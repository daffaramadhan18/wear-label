// Write each product's Shopee description onto the Shopify product, verbatim.
// Plain text becomes paragraphs; nothing is rewritten, trimmed or translated --
// this is the studio's own copy and paraphrasing it would change what the
// store claims about the garment.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SP = process.argv[2];
const ASSET = process.argv[3];
// The Shopify CLI resolves itself from the repo's node_modules, so it has to
// run with the repo as its cwd. On Windows it REFUSES a UNC path, which is what
// a WSL checkout is, so the repo must be reachable by drive letter:
//   net use W: \\wsl.localhost\Ubuntu
// Override either of these from the environment rather than editing the file.
const REPO = process.env.WL_REPO || "W:/home/daffa/wear-label";
const STORE = process.env.WL_STORE || "kbysza-bk.myshopify.com";

const FOLDER = {
  "basic-linen-culotte-kulot-highwaist-wanita": "basic-linen-culotte",
  "casual-culotte-linen": "casual-culotte-zipper",
  "wear-label-lilo-pants": "lilo-pants",
};
const SKIP = new Set(["basic-pants", "barrel-pants", "taka-flare-pants"]);

const state = JSON.parse(fs.readFileSync(path.join(SP, "state.json"), "utf8")).products.nodes;
const idFor = new Map(state.map((p) => [p.handle, p.id]));

function gql(doc) {
  const f = path.join(SP, "_desc.graphql");
  fs.writeFileSync(f, doc);
  const out = execFileSync(
    "npx",
    ["shopify", "store", "execute", "--store", STORE, "--allow-mutations", "--query-file", f],
    { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 32 * 1024 * 1024, shell: true }
  );
  const i = out.indexOf("{");
  if (i < 0) throw new Error("tidak ada JSON");
  return JSON.parse(out.slice(i));
}

// No em or en dashes in the store's copy, by instruction. An en dash here is
// almost always a range -- "62-90 cm", "Senin-Sabtu", "Small-Medium" -- so it
// becomes a hyphen, which says the same thing. An em dash is punctuation
// joining two clauses, so it becomes a comma. Applied at upload rather than by
// editing _copy.json, which stays a faithful record of what Shopee served.
const undash = (s) =>
  s
    .replace(/–/g, "-")
    .replace(/\s*—\s*/g, ", ")
    .replace(/[ \t]{2,}/g, " ");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toHtml = (text) =>
  undash(text)
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => `<p>${esc(b).replace(/\n/g, "<br>")}</p>`)
    .join("\n");

const jobs = [];
for (const d of fs.readdirSync(ASSET)) {
  if (SKIP.has(d)) continue;
  const dir = path.join(ASSET, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  const f = path.join(dir, "_copy.json");
  if (!fs.existsSync(f)) continue;
  const c = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!c.description) continue;
  const handle = FOLDER[d] || d;
  const id = idFor.get(handle);
  if (!id) {
    console.log(`  lewati ${d}: tidak ada di store`);
    continue;
  }
  jobs.push({ handle, id, html: toHtml(c.description), chars: c.description.length });
}

console.log(`${jobs.length} deskripsi akan ditulis`);
for (let c = 0; c < jobs.length; c += 4) {
  const chunk = jobs.slice(c, c + 4);
  const parts = chunk.map(
    (j, n) => `  p${n}: productUpdate(product: { id: ${JSON.stringify(j.id)}, descriptionHtml: ${JSON.stringify(j.html)} }) {
      product { handle descriptionHtml }
      userErrors { field message }
    }`
  );
  const res = gql(`mutation {\n${parts.join("\n")}\n}`);
  for (const [n, j] of chunk.entries()) {
    const r = res[`p${n}`];
    if (r?.userErrors?.length) console.log(`  ${j.handle}: ${JSON.stringify(r.userErrors).slice(0, 180)}`);
    else console.log(`  ${j.handle}: ${r.product.descriptionHtml.length} char HTML (dari ${j.chars} char teks)`);
  }
}
console.log("selesai");
