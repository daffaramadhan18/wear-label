// Walk a list of Shopee product URLs, pull each one's gallery + per-variant
// imagery from the DOM, and download it all at full resolution.
//   node batch.mjs <links.json> <out-root> [limit]
//
// DOM only. Calling /api/v4/* from the page trips the anti-bot and costs a
// captcha, so nothing here fetches Shopee's API -- only its open image CDN.
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

function grab() {
  const CDN = "susercontent.com/file/";
  const clean = (u) => (u ? u.split("?")[0] : "");
  const isCdn = (u) => u && u.indexOf(CDN) > -1;
  const title = document.title.replace(/^Jual /, "").replace(/ \| Shopee Indonesia$/, "");
  const panel = [];
  document.querySelectorAll("img").forEach((i) => {
    const u = clean(i.currentSrc || i.src);
    if (!isCdn(u)) return;
    const r = i.getBoundingClientRect();
    const x = r.left + window.scrollX;
    const y = r.top + window.scrollY;
    if (x < 700 && y < 1100 && r.width >= 40) {
      panel.push({ url: u, y: Math.round(y), x: Math.round(x), w: Math.round(r.width) });
    }
  });
  panel.sort((a, b) => a.y - b.y || a.x - b.x);
  const variants = [];
  document.querySelectorAll("button").forEach((b) => {
    const im = b.querySelector("img");
    if (!im) return;
    const u = clean(im.currentSrc || im.src);
    if (!isCdn(u)) return;
    variants.push({ name: (b.textContent || "").trim().slice(0, 60), url: u });
  });
  return JSON.stringify({
    href: location.href,
    title,
    blocked: location.href.indexOf("/verify/") > -1,
    main: [...new Set(panel.filter((p) => p.w >= 300).map((p) => p.url))],
    thumbs: [...new Set(panel.filter((p) => p.w < 300).map((p) => p.url))],
    variants,
  });
}

const fileId = (u) => {
  const i = u.indexOf("/file/");
  return i < 0 ? null : u.slice(i + 6).split("@")[0].split("?")[0];
};
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/\(|\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";

// Folder name from the URL slug, cut at the marketing tail. Deliberately NOT
// mapped onto the Shopify handles: guessing that "Casual Culotte Linen" is the
// store's `casual-culotte-zipper` would be inventing a fact.
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
  return slug(s).split("-").slice(0, 6).join("-");
}

const ext = (ct) => (ct.includes("webp") ? ".webp" : ct.includes("png") ? ".png" : ".jpg");

const report = [];
for (const [n, link] of links.entries()) {
  const url = link.href.startsWith("http") ? link.href : "https://shopee.co.id" + link.href;
  const folder = folderFor(url);
  process.stderr.write(`\n[${n + 1}/${links.length}] ${folder}\n`);

  await send("Page.navigate", { url });
  await sleep(17000);
  await send("Runtime.evaluate", {
    expression:
      "(async()=>{for(let y=0;y<1600;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,250));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,700));})()",
    awaitPromise: true,
  });
  await sleep(1500);

  const r = await send("Runtime.evaluate", {
    expression: "(" + grab.toString() + ")()",
    returnByValue: true,
  });
  let d = null;
  try {
    d = JSON.parse(r.result.result.value);
  } catch (e) {}
  if (!d || d.blocked) {
    process.stderr.write("   DIBLOKIR / verify page -- dilewati\n");
    report.push({ folder, url, status: "blocked" });
    continue;
  }

  const outDir = path.join(outRoot, folder);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "_source.json"), JSON.stringify(d, null, 1));

  const jobs = [];
  const seen = new Set();
  const add = (u, name) => {
    const fid = fileId(u);
    if (!fid || seen.has(fid)) return;
    seen.add(fid);
    jobs.push({ fid, name });
  };
  d.main.forEach((u, i) => add(u, `main-${String(i + 1).padStart(2, "0")}`));
  d.thumbs.forEach((u, i) => add(u, `gallery-${String(i + 1).padStart(2, "0")}`));
  d.variants.forEach((v) => add(v.url, `warna-${slug(v.name)}`));

  let ok = 0;
  let bytes = 0;
  for (const j of jobs) {
    try {
      const res = await fetch(`https://down-id.img.susercontent.com/file/${j.fid}`);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(outDir, j.name + ext(res.headers.get("content-type") || "")), buf);
      ok++;
      bytes += buf.length;
    } catch (e) {}
  }
  process.stderr.write(
    `   ${d.title.slice(0, 55)}\n   ${ok}/${jobs.length} file, ${(bytes / 1048576).toFixed(1)} MB, ${d.variants.length} varian\n`
  );
  report.push({
    folder,
    url,
    title: d.title,
    variants: d.variants.length,
    files: ok,
    expected: jobs.length,
    mb: +(bytes / 1048576).toFixed(1),
    status: "ok",
  });
}

console.log(JSON.stringify(report, null, 1));
ws.close();
process.exit(0);
