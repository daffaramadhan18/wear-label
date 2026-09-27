// Fetch an arbitrary same-origin Shopee API path from inside the logged-in tab
// and print a shape summary (keys, counts) plus a truncated raw body.
const PORT = 9222;
const path = process.argv[2];
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
await send("Runtime.enable");

function probe(p) {
  const H = { "x-api-source": "pc", "x-requested-with": "XMLHttpRequest" };
  return (async () => {
    const r = await fetch(p, { headers: H });
    const text = await r.text();
    let shape = null;
    try {
      const j = JSON.parse(text);
      const describe = (o, d) => {
        if (d > 2 || o === null || typeof o !== "object") return typeof o;
        if (Array.isArray(o)) return "[" + o.length + "]" + (o.length ? describe(o[0], d + 1) : "");
        const out = {};
        for (const k of Object.keys(o).slice(0, 25)) out[k] = describe(o[k], d + 1);
        return out;
      };
      shape = describe(j, 0);
    } catch (e) {}
    return JSON.stringify({ status: r.status, shape, raw: text.slice(0, 900) });
  })();
}

const r = await send("Runtime.evaluate", {
  expression: "(" + probe.toString() + ")(" + JSON.stringify(path) + ")",
  awaitPromise: true,
  returnByValue: true,
});
console.log(r.result?.result?.value || JSON.stringify(r).slice(0, 800));
ws.close();
process.exit(0);
