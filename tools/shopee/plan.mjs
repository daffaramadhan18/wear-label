// Build the upload plan: for every product on the store, work out which local
// file becomes the main image, which becomes the video, and which variant gets
// which colour photograph. Writes plan.json and prints anything unmatched.
//
// Gallery shots are deliberately excluded -- instruction was main + variants only.
import fs from "node:fs";
import path from "node:path";

const SP = process.argv[2];
const ASSET = process.argv[3];

const state = JSON.parse(fs.readFileSync(path.join(SP, "state.json"), "utf8")).products.nodes;

// Shopee folder -> Shopify handle, where the two names differ.
const FOLDER = {
  "basic-linen-culotte-kulot-highwaist-wanita": "basic-linen-culotte",
  "casual-culotte-linen": "casual-culotte-zipper",
  "wear-label-lilo-pants": "lilo-pants",
};
// Scraped but deliberately not created on the store, by instruction.
const SKIP = new Set(["basic-pants", "barrel-pants", "taka-flare-pants"]);

const slug = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/\(|\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const byHandle = new Map();
for (const d of fs.readdirSync(ASSET)) {
  if (SKIP.has(d)) continue;
  const dir = path.join(ASSET, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  byHandle.set(FOLDER[d] || d, dir);
}

const plan = [];
const problems = [];

for (const p of state) {
  const dir = byHandle.get(p.handle);
  if (!dir) {
    problems.push(`${p.handle}: tidak ada folder asset`);
    continue;
  }
  const files = fs.readdirSync(dir);
  const hasImage = p.media.nodes.some((m) => m.mediaContentType === "IMAGE");
  const hasVideo = p.media.nodes.some((m) => m.mediaContentType === "VIDEO");

  const entry = { handle: p.handle, productId: p.id, dir, uploads: [], variantLinks: [] };

  // main image, only when the product has none
  const mainFile = files.find((f) => /^main-01\./.test(f));
  if (!hasImage) {
    if (mainFile) entry.uploads.push({ kind: "IMAGE", file: mainFile, alt: p.handle, role: "main" });
    else problems.push(`${p.handle}: tidak punya media DAN tidak ada main-01`);
  }

  // video, only when the product has none
  const videoFile = files.find((f) => /^video\.mp4$/.test(f));
  if (videoFile && !hasVideo) {
    entry.uploads.push({ kind: "VIDEO", file: videoFile, alt: `${p.handle} video`, role: "video" });
  }

  // one photograph per colour option value
  const colours = new Map();
  for (const v of p.variants.nodes) {
    const c = v.selectedOptions.find((o) => /colou?r|warna|kulot/i.test(o.name));
    if (!c) continue;
    if (!colours.has(c.value)) colours.set(c.value, []);
    colours.get(c.value).push(v.id);
  }
  if (!colours.size) problems.push(`${p.handle}: tidak ada opsi warna`);

  for (const [colour, variantIds] of colours) {
    const want = `warna-${slug(colour)}`;
    const f = files.find((x) => x.replace(/\.[a-z0-9]+$/i, "") === want);
    if (!f) {
      problems.push(`${p.handle}: warna "${colour}" -> tidak ada file ${want}.*`);
      continue;
    }
    entry.uploads.push({ kind: "IMAGE", file: f, alt: `${p.handle} — ${colour}`, role: "variant", colour });
    entry.variantLinks.push({ colour, variantIds, file: f });
  }
  plan.push(entry);
}

fs.writeFileSync(path.join(SP, "plan.json"), JSON.stringify(plan, null, 1));

let img = 0;
let vid = 0;
let links = 0;
console.log("handle".padEnd(28) + "main".padStart(5) + "video".padStart(6) + "  warna(file/total)".padEnd(22) + "varian dilink");
for (const e of plan) {
  const m = e.uploads.filter((u) => u.role === "main").length;
  const v = e.uploads.filter((u) => u.role === "video").length;
  const c = e.uploads.filter((u) => u.role === "variant").length;
  const total = e.variantLinks.length;
  const vl = e.variantLinks.reduce((a, b) => a + b.variantIds.length, 0);
  img += m + c;
  vid += v;
  links += vl;
  console.log(
    e.handle.padEnd(28) + String(m).padStart(5) + String(v).padStart(6) + `  ${c}/${total}`.padEnd(22) + vl
  );
}
console.log(`\nTOTAL upload: ${img} gambar + ${vid} video | ${links} varian akan dapat foto`);
if (problems.length) {
  console.log("\nMASALAH:");
  for (const p of problems) console.log("  - " + p);
} else {
  console.log("\nTidak ada warna yang tidak cocok.");
}
