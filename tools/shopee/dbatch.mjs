// Harvest each Shopee PDP's own copy: the description block and the
// specification rows, verbatim.
//   node dbatch.mjs <links.json> <out-root> [limit]
//
// DOM only -- same rule as the image and video passes. Shopee collapses long
// descriptions behind a "Selengkapnya" control, so that is clicked first.
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

// Click whatever expands the description, then report what it found.
function expand() {
  let clicked = 0;
  const wanted = /^(selengkapnya|lihat selengkapnya|baca selengkapnya|see more|lainnya)$/i;
  document.querySelectorAll("button,div,span,a").forEach((e) => {
    if (e.children.length > 1) return;
    const t = (e.textContent || "").trim();
    if (wanted.test(t)) {
      try {
        e.click();
        clicked++;
      } catch (err) {}
    }
  });
  return String(clicked);
}

function grabCopy() {
  const norm = (s) => (s || "").replace(/ /g, " ").replace(/[ \t]+\n/g, "\n").trim();

  // Find a heading by its exact text, then take the block that follows it.
  const sectionAfter = (labels) => {
    let best = null;
    const all = document.querySelectorAll("div,section,h1,h2,h3,span");
    for (const e of all) {
      const t = (e.textContent || "").trim();
      if (t.length > 40) continue;
      if (!labels.some((l) => t.toLowerCase() === l)) continue;
      // walk up until an ancestor holds substantially more text than the label
      let n = e;
      for (let i = 0; i < 6 && n; i++) {
        n = n.parentElement;
        if (!n) break;
        const txt = norm(n.innerText || "");
        if (txt.length > t.length + 80) {
          if (!best || txt.length > best.length) best = txt;
          break;
        }
      }
    }
    return best;
  };

  let desc = sectionAfter(["deskripsi produk", "deskripsi"]);
  if (desc) {
    desc = desc.replace(/^Deskripsi Produk\s*/i, "").trim();
  }
  let spec = sectionAfter(["spesifikasi produk", "spesifikasi"]);
  if (spec) spec = spec.replace(/^Spesifikasi Produk\s*/i, "").trim();

  // price + sold, straight off the buy box
  const body = norm(document.body.innerText);
  const priceMatch = body.match(/Rp[\d.]+(?:\s*-\s*Rp[\d.]+)?/);

  return JSON.stringify({
    href: location.href,
    blocked: location.href.indexOf("/verify/") > -1,
    title: document.title.replace(/^Jual /, "").replace(/ \| Shopee Indonesia$/, ""),
    price: priceMatch ? priceMatch[0] : null,
    spec: spec || null,
    description: desc || null,
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
  // the description sits well down the page; scroll it into view so it renders
  await send("Runtime.evaluate", {
    expression:
      "(async()=>{for(let y=0;y<4200;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,220));}})()",
    awaitPromise: true,
  });
  await sleep(2000);
  const c = await send("Runtime.evaluate", { expression: "(" + expand.toString() + ")()", returnByValue: true });
  await sleep(2500);

  const r = await send("Runtime.evaluate", { expression: "(" + grabCopy.toString() + ")()", returnByValue: true });
  let d = null;
  try {
    d = JSON.parse(r.result.result.value);
  } catch (e) {}
  if (!d || d.blocked) {
    process.stderr.write("   diblokir / verify page\n");
    report.push({ folder, status: "blocked" });
    continue;
  }

  // After the long scroll, document.title sometimes reads back as Shopee's
  // generic site title rather than the product's. Fall back to the listing
  // text, which came from the shop page and is the product's own name.
  if (!d.title || /^Shopee Indonesia/.test(d.title)) {
    d.title = (link.text || "").replace(/Rp[\d.]+.*$/, "").trim() || folder;
  }

  const outDir = path.join(outRoot, folder);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "_copy.json"), JSON.stringify(d, null, 1));
  const md =
    `# ${d.title}\n\n` +
    `Sumber: ${d.href}\n` +
    (d.price ? `Harga tercantum: ${d.price}\n` : "") +
    `\n## Spesifikasi\n\n${d.spec || "(tidak ditemukan)"}\n` +
    `\n## Deskripsi\n\n${d.description || "(tidak ditemukan)"}\n`;
  fs.writeFileSync(path.join(outDir, "deskripsi.md"), md);

  const dl = d.description ? d.description.length : 0;
  process.stderr.write(
    `   expand:${c.result?.result?.value || 0}  spec:${d.spec ? d.spec.length : 0}  desc:${dl} char\n`
  );
  report.push({ folder, title: d.title, price: d.price, descChars: dl, specChars: d.spec ? d.spec.length : 0, status: dl ? "ok" : "empty" });
}

console.log(JSON.stringify(report, null, 1));
ws.close();
process.exit(0);
