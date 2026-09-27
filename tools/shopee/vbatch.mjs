// Harvest Shopee product videos for a list of PDPs.
//   node vbatch.mjs <links.json> <out-root> [limit]
//
// Shopee serves each video as several renditions that differ only by a numeric
// suffix on the same base id (plus a ".default"). They are not ordered by
// quality in the markup -- ".default" was the SMALLEST on the one measured --
// so every rendition is HEADed and the largest wins.
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

function findVideos() {
  const html = document.documentElement.innerHTML;
  const urls = new Set();
  const re = /https?:\/\/[^"'\\\s<>]+?\.mp4/g;
  let m;
  while ((m = re.exec(html))) urls.add(m[0]);
  document.querySelectorAll("video").forEach((v) => {
    if (v.currentSrc) urls.add(v.currentSrc);
    if (v.src) urls.add(v.src);
  });
  return JSON.stringify({
    href: location.href,
    blocked: location.href.indexOf("/verify/") > -1,
    urls: [...urls],
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
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .split("-")
      .slice(0, 6)
      .join("-") || "untitled"
  );
}

// ".../mms/<base>.<rendition>.mp4" -> group renditions under <base>
const baseOf = (u) => {
  const f = u.split("/").pop();
  return f.split(".")[0];
};

const report = [];
for (const [n, link] of links.entries()) {
  const url = link.href.startsWith("http") ? link.href : "https://shopee.co.id" + link.href;
  const folder = folderFor(url);
  process.stderr.write(`\n[${n + 1}/${links.length}] ${folder}\n`);

  await send("Page.navigate", { url });
  await sleep(17000);
  const r = await send("Runtime.evaluate", {
    expression: "(" + findVideos.toString() + ")()",
    returnByValue: true,
  });
  let d = null;
  try {
    d = JSON.parse(r.result.result.value);
  } catch (e) {}
  if (!d || d.blocked) {
    process.stderr.write("   diblokir / verify page\n");
    report.push({ folder, status: "blocked" });
    continue;
  }
  if (!d.urls.length) {
    process.stderr.write("   tidak ada video\n");
    report.push({ folder, status: "none", videos: 0 });
    continue;
  }

  const groups = new Map();
  for (const u of d.urls) {
    const b = baseOf(u);
    if (!groups.has(b)) groups.set(b, new Set());
    groups.get(b).add(u);
  }

  const outDir = path.join(outRoot, folder);
  fs.mkdirSync(outDir, { recursive: true });
  const saved = [];
  let gi = 0;
  for (const [base, set] of groups) {
    gi++;
    let best = null;
    for (const u of set) {
      try {
        const h = await fetch(u, { method: "HEAD" });
        const len = Number(h.headers.get("content-length") || 0);
        if (h.ok && len > (best?.len || 0)) best = { u, len };
      } catch (e) {}
    }
    if (!best) continue;
    try {
      const res = await fetch(best.u);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const name = groups.size > 1 ? `video-${String(gi).padStart(2, "0")}.mp4` : "video.mp4";
      fs.writeFileSync(path.join(outDir, name), buf);
      saved.push({ name, base, mb: +(buf.length / 1048576).toFixed(2), from: best.u, renditions: set.size });
      process.stderr.write(`   ${name}  ${(buf.length / 1048576).toFixed(2)} MB  (${set.size} rendition)\n`);
    } catch (e) {}
  }
  if (saved.length) {
    fs.writeFileSync(path.join(outDir, "_video.json"), JSON.stringify(saved, null, 1));
  }
  report.push({ folder, status: "ok", videos: saved.length, saved });
}

console.log(JSON.stringify(report, null, 1));
ws.close();
process.exit(0);
