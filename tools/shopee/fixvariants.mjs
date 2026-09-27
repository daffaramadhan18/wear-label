// Repair pass. The first download deduplicated by CDN file id across the whole
// product, so a colour photograph that ALSO appeared in the gallery strip was
// written once under its gallery name and never under its colour name. The
// colour data was never lost -- it is all in _source.json -- so re-fetch any
// warna-<colour> file that is missing.
import fs from "node:fs";
import path from "node:path";

const ASSET = process.argv[2];
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/\(|\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const fileId = (u) => {
  const i = u.indexOf("/file/");
  return i < 0 ? null : u.slice(i + 6).split("@")[0].split("?")[0];
};
const ext = (ct) => (ct.includes("webp") ? ".webp" : ct.includes("png") ? ".png" : ".jpg");

let added = 0;
for (const d of fs.readdirSync(ASSET)) {
  const dir = path.join(ASSET, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  const srcFile = path.join(dir, "_source.json");
  if (!fs.existsSync(srcFile)) continue;
  const src = JSON.parse(fs.readFileSync(srcFile, "utf8"));
  const files = fs.readdirSync(dir);
  for (const v of src.variants || []) {
    const want = `warna-${slug(v.name)}`;
    if (files.some((f) => f.replace(/\.[a-z0-9]+$/i, "") === want)) continue;
    const fid = fileId(v.url);
    if (!fid) continue;
    try {
      const r = await fetch(`https://down-id.img.susercontent.com/file/${fid}`);
      if (!r.ok) {
        console.log(`  GAGAL ${d}/${want} HTTP ${r.status}`);
        continue;
      }
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(path.join(dir, want + ext(r.headers.get("content-type") || "")), buf);
      console.log(`  + ${d}/${want}  ${(buf.length / 1024).toFixed(0)} KB`);
      added++;
    } catch (e) {
      console.log(`  GAGAL ${d}/${want} ${String(e).slice(0, 50)}`);
    }
  }
}
console.log(`\n${added} file varian ditambahkan`);
