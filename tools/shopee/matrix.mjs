// Capture a Shopee PDP's full option matrix: every axis (Warna, Ukuran, ...),
// every option value on it, and the image tied to a value where one exists.
//   node matrix.mjs <links.json> <out-root> [limit]
//
// DOM only. Per-variant price is deliberately NOT collected: Shopee only
// reveals it after selecting a combination, and clicking through 23x3 of them
// per product would be both slow and a good way to get the session blocked.
// The listed price range is captured instead, and the gap is reported.
import fs from "node:fs";
import path from "node:path";

const PORT = 9222;
const linksFile = process.argv[2];
const outRoot = process.argv[3];
const limit = Number(process.argv[4] || 17);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const links = JSON.parse(fs.readFileSync(linksFile, "utf8")).slice(0, limit);
const tabs = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page =
  tabs.find((t) => t.type === "page" && /shopee\.co\.id/.test(t.url)) ||
  tabs.find((t) => t.type === "page");
if (!page) {
  console.error("NO_PAGE");
  process.exit(1);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
let msgId = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((res) => {
    const n = ++msgId;
    pending.set(n, res);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
await new Promise((res) => ws.addEventListener("open", res));
await send("Page.enable");
await send("Runtime.enable");

function grabMatrix() {
  const CDN = "susercontent.com/file/";
  const clean = (u) => (u ? u.split("?")[0] : "");

  // An axis is a short heading; its buttons live in the same <section>.
  const axes = [];
  document.querySelectorAll("h2,h3").forEach((h) => {
    const label = (h.textContent || "").trim();
    if (!label || label.length > 24) return;
    const sec = h.closest("section") || h.parentElement?.parentElement;
    if (!sec) return;
    const btns = [...sec.querySelectorAll("button")];
    if (btns.length < 2) return;
    const options = btns
      .map((b) => {
        const im = b.querySelector("img");
        const u = im ? clean(im.currentSrc || im.src) : "";
        return {
          value: (b.textContent || "").trim().slice(0, 60),
          image: u && u.indexOf(CDN) > -1 ? u : null,
          soldOut: /sold|habis/i.test(b.className) || b.disabled === true,
        };
      })
      .filter((o) => o.value);
    if (options.length) axes.push({ axis: label, count: options.length, options });
  });

  // de-dup: the same section can be reached from more than one heading
  const uniq = [];
  const seen = new Set();
  for (const a of axes) {
    const key = a.axis + "|" + a.options.map((o) => o.value).join(",");
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(a);
  }

  const body = (document.body.innerText || "").replace(/ /g, " ");
  const price = (body.match(/Rp[\d.]+(?:\s*-\s*Rp[\d.]+)?/) || [])[0] || null;
  const stock = (body.match(/(\d+)\s+tersisa/i) || [])[1] || null;

  return JSON.stringify({
    href: location.href,
    blocked: location.href.indexOf("/verify/") > -1,
    price,
    stock,
    axes: uniq,
  });
}

function folderFor(href) {
  let s = href.split("/").pop().split("-i.")[0];
  for (const cut of ["-by-Wear-Label", "-By-Wear-Label", "-BY-WEAR-LABEL"]) {
    const i = s.indexOf(cut);
    if (i > 0) {
      s = s.slice(0, i);
      break;
    }
  }
  s = s.split("-Celana")[0].split("-|")[0];
  return (
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 6).join("-") ||
    "untitled"
  );
}

const report = [];
for (const [n, link] of links.entries()) {
  const url = link.href.startsWith("http") ? link.href : "https://shopee.co.id" + link.href;
  const folder = folderFor(url);
  process.stderr.write(`\n[${n + 1}/${links.length}] ${folder}\n`);

  await send("Page.navigate", { url });
  await sleep(16000);
  await send("Runtime.evaluate", {
    expression:
      "(async()=>{for(let y=0;y<1400;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,220));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,600));})()",
    awaitPromise: true,
  });
  await sleep(1500);

  const r = await send("Runtime.evaluate", { expression: "(" + grabMatrix.toString() + ")()", returnByValue: true });
  let d = null;
  try {
    d = JSON.parse(r.result.result.value);
  } catch (e) {}
  if (!d || d.blocked) {
    process.stderr.write("   diblokir\n");
    report.push({ folder, status: "blocked" });
    continue;
  }

  const outDir = path.join(outRoot, folder);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "_matrix.json"), JSON.stringify(d, null, 1));
  process.stderr.write(
    `   ${d.price || "?"}  ${d.axes.map((a) => a.axis + ":" + a.count).join("  ")}\n`
  );
  report.push({
    folder,
    price: d.price,
    axes: d.axes.map((a) => ({ axis: a.axis, count: a.count, values: a.options.map((o) => o.value) })),
    status: "ok",
  });
}

console.log(JSON.stringify(report, null, 1));
ws.close();
process.exit(0);
