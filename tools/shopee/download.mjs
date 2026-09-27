// Download a product's Shopee imagery at full resolution.
//   node download.mjs <extract.json> <out-dir>
// Shopee serves a sized derivative when the file id carries an "@resize_..."
// suffix and the original when it does not, so the suffix is stripped. The
// CDN needs no session -- only the file ids did.
import fs from "node:fs";
import path from "node:path";

const src = process.argv[2];
const outDir = process.argv[3];
const data = JSON.parse(fs.readFileSync(src, "utf8"));

const fileId = (u) => {
  const i = u.indexOf("/file/");
  if (i < 0) return null;
  return u.slice(i + 6).split("@")[0].split("?")[0];
};
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/\(|\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";

fs.mkdirSync(outDir, { recursive: true });

const jobs = [];
const seen = new Set();
const add = (id, name) => {
  if (!id || seen.has(id)) return;
  seen.add(id);
  jobs.push({ id, name });
};

data.main.forEach((u, i) => add(fileId(u), `main-${String(i + 1).padStart(2, "0")}`));
data.thumbs.forEach((u, i) => add(fileId(u), `gallery-${String(i + 1).padStart(2, "0")}`));
data.variants.forEach((v) => add(fileId(v.url), `warna-${slug(v.name)}`));

const ext = (ct) =>
  ct.includes("webp") ? ".webp" : ct.includes("png") ? ".png" : ".jpg";

let ok = 0;
const failed = [];
for (const j of jobs) {
  const url = `https://down-id.img.susercontent.com/file/${j.id}`;
  try {
    const r = await fetch(url);
    if (!r.ok) {
      failed.push(`${j.name} HTTP ${r.status}`);
      continue;
    }
    const ct = r.headers.get("content-type") || "";
    const buf = Buffer.from(await r.arrayBuffer());
    const file = path.join(outDir, j.name + ext(ct));
    fs.writeFileSync(file, buf);
    console.log(`  ${(buf.length / 1024).toFixed(0).padStart(5)} KB  ${path.basename(file)}`);
    ok++;
  } catch (e) {
    failed.push(`${j.name} ${String(e).slice(0, 60)}`);
  }
}
console.log(`\n${ok}/${jobs.length} tersimpan di ${outDir}`);
if (failed.length) console.log("GAGAL:", failed.join(" | "));
