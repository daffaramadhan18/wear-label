// Upload the planned media to Shopify and wire each variant to its colour shot.
//   node upload.mjs <scratch-dir> <asset-root> [step]
//
// Three phases, each checkpointed to disk so a failure resumes rather than
// re-uploading:
//   1 stage    stagedUploadsCreate + the multipart POST to the returned target
//   2 attach   productCreateMedia, product by product
//   3 link     productVariantsBulkUpdate, setting each variant's mediaId
//
// The Shopify CLI is the only authenticated path here, so every GraphQL op is
// a CLI invocation. Those cost ~10s each, so operations are batched with
// aliases rather than issued one per product.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SP = process.argv[2];
const ASSET = process.argv[3];
const ONLY = process.argv[4] || "all";
// The Shopify CLI resolves itself from the repo's node_modules, so it has to
// run with the repo as its cwd. On Windows it REFUSES a UNC path, which is what
// a WSL checkout is, so the repo must be reachable by drive letter:
//   net use W: \\wsl.localhost\Ubuntu
// Override either of these from the environment rather than editing the file.
const REPO = process.env.WL_REPO || "W:/home/daffa/wear-label";
const STORE = process.env.WL_STORE || "kbysza-bk.myshopify.com";

const plan = JSON.parse(fs.readFileSync(path.join(SP, "plan.json"), "utf8"));
const load = (f, d) => (fs.existsSync(path.join(SP, f)) ? JSON.parse(fs.readFileSync(path.join(SP, f), "utf8")) : d);
const save = (f, v) => fs.writeFileSync(path.join(SP, f), JSON.stringify(v, null, 1));

function gql(doc, mutations = false) {
  const f = path.join(SP, "_op.graphql");
  fs.writeFileSync(f, doc);
  const args = ["shopify", "store", "execute", "--store", STORE, "--query-file", f];
  if (mutations) args.push("--allow-mutations");
  const out = execFileSync("npx", args, {
    cwd: REPO,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 64 * 1024 * 1024,
    shell: true,
  });
  const i = out.indexOf("{");
  if (i < 0) throw new Error("tidak ada JSON: " + out.slice(0, 200));
  return JSON.parse(out.slice(i));
}

const mime = (f) =>
  f.endsWith(".png") ? "image/png" : f.endsWith(".webp") ? "image/webp" : f.endsWith(".mp4") ? "video/mp4" : "image/jpeg";

// every file the plan wants, flattened
const items = [];
for (const e of plan) {
  for (const u of e.uploads) {
    items.push({
      key: `${e.handle}/${u.file}`,
      handle: e.handle,
      productId: e.productId,
      abs: path.join(e.dir, u.file),
      filename: `${e.handle}-${u.file}`,
      kind: u.kind,
      alt: u.alt,
      role: u.role,
      colour: u.colour || null,
    });
  }
}

// ---------- phase 1: stage + upload ----------
let staged = load("staged.json", {});
if (ONLY === "all" || ONLY === "stage") {
  const todo = items.filter((i) => !staged[i.key]);
  console.log(`stage: ${todo.length} file belum diunggah (${items.length} total)`);
  for (let c = 0; c < todo.length; c += 40) {
    const chunk = todo.slice(c, c + 40);
    const inputs = chunk
      .map((i) => {
        const size = fs.statSync(i.abs).size;
        return `{ filename: ${JSON.stringify(i.filename)}, mimeType: ${JSON.stringify(mime(i.filename))}, resource: ${i.kind === "VIDEO" ? "VIDEO" : "IMAGE"}, httpMethod: POST, fileSize: ${JSON.stringify(String(size))} }`;
      })
      .join("\n        ");
    const doc = `mutation {
  stagedUploadsCreate(input: [
        ${inputs}
  ]) {
    stagedTargets { url resourceUrl parameters { name value } }
    userErrors { field message }
  }
}`;
    const res = gql(doc, true).stagedUploadsCreate;
    if (res.userErrors?.length) throw new Error("stagedUploadsCreate: " + JSON.stringify(res.userErrors));
    for (const [n, t] of res.stagedTargets.entries()) {
      const it = chunk[n];
      const fd = new FormData();
      for (const p of t.parameters) fd.append(p.name, p.value);
      fd.append("file", new Blob([fs.readFileSync(it.abs)], { type: mime(it.filename) }), it.filename);
      const up = await fetch(t.url, { method: "POST", body: fd });
      if (!up.ok && up.status !== 201 && up.status !== 204) {
        console.log(`  GAGAL POST ${it.key} HTTP ${up.status}`);
        continue;
      }
      staged[it.key] = { resourceUrl: t.resourceUrl, alt: it.alt, kind: it.kind, role: it.role, colour: it.colour, handle: it.handle, productId: it.productId };
      process.stdout.write(".");
    }
    save("staged.json", staged);
    console.log(` ${Object.keys(staged).length}/${items.length}`);
  }
}

// ---------- phase 2: attach media to products ----------
let attached = load("attached.json", {});
if (ONLY === "all" || ONLY === "attach") {
  const byProduct = new Map();
  for (const [key, s] of Object.entries(staged)) {
    if (attached[key]) continue;
    if (!byProduct.has(s.handle)) byProduct.set(s.handle, []);
    byProduct.get(s.handle).push({ key, ...s });
  }
  const groups = [...byProduct.entries()];
  console.log(`attach: ${groups.length} produk`);
  for (let c = 0; c < groups.length; c += 3) {
    const chunk = groups.slice(c, c + 3);
    const parts = chunk.map(([handle, list], n) => {
      const media = list
        .map((m) => `{ originalSource: ${JSON.stringify(m.resourceUrl)}, alt: ${JSON.stringify(m.alt)}, mediaContentType: ${m.kind} }`)
        .join("\n      ");
      return `  p${n}: productCreateMedia(productId: ${JSON.stringify(list[0].productId)}, media: [
      ${media}
    ]) {
      media { ... on MediaImage { id alt } ... on Video { id alt } }
      mediaUserErrors { field message }
    }`;
    });
    const res = gql(`mutation {\n${parts.join("\n")}\n}`, true);
    for (const [n, [handle, list]] of chunk.entries()) {
      const r = res[`p${n}`];
      if (r?.mediaUserErrors?.length) {
        console.log(`  ${handle}: ${JSON.stringify(r.mediaUserErrors).slice(0, 200)}`);
        continue;
      }
      const byAlt = new Map((r?.media || []).map((m) => [m.alt, m.id]));
      let ok = 0;
      for (const m of list) {
        const id = byAlt.get(m.alt);
        if (!id) continue;
        attached[m.key] = { mediaId: id, handle, colour: m.colour, role: m.role };
        ok++;
      }
      console.log(`  ${handle}: ${ok}/${list.length} media`);
    }
    save("attached.json", attached);
  }
}

// ---------- phase 3: variant -> media ----------
if (ONLY === "all" || ONLY === "link") {
  const state = JSON.parse(fs.readFileSync(path.join(SP, "state.json"), "utf8")).products.nodes;
  const mediaFor = new Map(); // handle|colour -> mediaId
  for (const a of Object.values(attached)) {
    if (a.role === "variant" && a.colour) mediaFor.set(a.handle + "|" + a.colour, a.mediaId);
  }
  const groups = [];
  for (const p of state) {
    const rows = [];
    for (const v of p.variants.nodes) {
      const c = v.selectedOptions.find((o) => /colou?r|warna|kulot/i.test(o.name));
      if (!c) continue;
      const id = mediaFor.get(p.handle + "|" + c.value);
      if (id) rows.push({ variantId: v.id, mediaId: id });
    }
    if (rows.length) groups.push({ handle: p.handle, productId: p.id, rows });
  }
  console.log(`link: ${groups.length} produk, ${groups.reduce((a, b) => a + b.rows.length, 0)} varian`);
  for (const g of groups) {
    for (let c = 0; c < g.rows.length; c += 100) {
      const chunk = g.rows.slice(c, c + 100);
      const variants = chunk
        .map((r) => `{ id: ${JSON.stringify(r.variantId)}, mediaId: ${JSON.stringify(r.mediaId)} }`)
        .join("\n      ");
      const doc = `mutation {
  productVariantsBulkUpdate(productId: ${JSON.stringify(g.productId)}, variants: [
      ${variants}
  ]) {
    productVariants { id }
    userErrors { field message }
  }
}`;
      const r = gql(doc, true).productVariantsBulkUpdate;
      if (r.userErrors?.length) console.log(`  ${g.handle}: ${JSON.stringify(r.userErrors).slice(0, 220)}`);
      else console.log(`  ${g.handle}: ${r.productVariants.length} varian terhubung`);
    }
  }
}

console.log("selesai");
