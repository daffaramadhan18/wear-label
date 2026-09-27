// Walk the shop's product listing (DOM only) and collect every product URL.
const PORT = 9222;
const shop = process.argv[2] || "278671029";
const pages = Number(process.argv[3] || 3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tabs = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page =
  tabs.find((t) => t.type === "page" && /shopee\.co\.id/.test(t.url)) ||
  tabs.find((t) => t.type === "page");
if (!page) {
  console.error("NO_PAGE");
  process.exit(1);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
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
    const n = ++id;
    pending.set(n, res);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
await new Promise((res) => ws.addEventListener("open", res));
await send("Page.enable");
await send("Runtime.enable");

function collect(shopId) {
  const out = [];
  document.querySelectorAll("a[href]").forEach((a) => {
    const h = a.getAttribute("href") || "";
    if (h.indexOf("-i." + shopId + ".") > -1) {
      out.push({
        href: h.split("?")[0],
        text: (a.textContent || "").trim().slice(0, 90),
      });
    }
  });
  const uniq = [];
  const seen = new Set();
  for (const o of out) {
    if (seen.has(o.href)) continue;
    seen.add(o.href);
    uniq.push(o);
  }
  return JSON.stringify({ url: location.href, found: uniq });
}

const all = new Map();
for (let p = 0; p < pages; p++) {
  await send("Page.navigate", { url: `https://shopee.co.id/shop/${shop}?page=${p}&sortBy=pop` });
  await sleep(14000);
  await send("Runtime.evaluate", {
    expression:
      "(async()=>{for(let y=0;y<7000;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,200));}})()",
    awaitPromise: true,
  });
  await sleep(2500);
  const r = await send("Runtime.evaluate", {
    expression: "(" + collect.toString() + ")(" + JSON.stringify(shop) + ")",
    returnByValue: true,
  });
  let got = [];
  try {
    got = JSON.parse(r.result.result.value).found;
  } catch (e) {}
  for (const g of got) all.set(g.href, g.text);
  console.error(`page ${p}: +${got.length} (total ${all.size})`);
  if (!got.length) break;
}

console.log(
  JSON.stringify(
    [...all].map(([href, text]) => ({ href, text })),
    null,
    1
  )
);
ws.close();
process.exit(0);
