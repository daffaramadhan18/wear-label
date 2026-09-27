// Diagnostic: what does the rendered PDP actually expose?
//  1. any window-level state object that looks like it holds the item
//  2. every susercontent image with its geometry and a short DOM path, so the
//     product's own gallery can be told apart from the recommendation rails
const PORT = 9222;
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

function inspect() {
  const stateKeys = Object.keys(window).filter(
    (k) => /state|store|data|item|pdp|initial|__/i.test(k) && k.length < 40
  );

  const shortPath = (el) => {
    const bits = [];
    let n = el;
    for (let i = 0; i < 4 && n && n.tagName; i++) {
      bits.unshift(n.tagName.toLowerCase() + (n.className && typeof n.className === "string" ? "." + n.className.trim().split(/\s+/).slice(0, 2).join(".") : ""));
      n = n.parentElement;
    }
    return bits.join(">");
  };

  const seen = [];
  const add = (el, url) => {
    if (!url || url.indexOf("susercontent.com/file/") < 0) return;
    const r = el.getBoundingClientRect();
    seen.push({
      url: url.split("?")[0],
      x: Math.round(r.left + window.scrollX),
      y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
      path: shortPath(el),
    });
  };
  document.querySelectorAll("img").forEach((i) => add(i, i.currentSrc || i.src));
  document.querySelectorAll("*").forEach((e) => {
    const v = getComputedStyle(e).backgroundImage;
    if (!v || v === "none" || v.indexOf("url(") !== 0) return;
    let t = v.slice(4).trim();
    if (t.charAt(t.length - 1) === ")") t = t.slice(0, -1).trim();
    const q = t.charAt(0);
    if (q === '"' || q === "'") t = t.slice(1, -1);
    add(e, t);
  });

  // where do the variant pickers sit? find labels then their row
  const labels = [];
  document.querySelectorAll("*").forEach((e) => {
    if (e.children.length) return;
    const tx = (e.textContent || "").trim();
    if (/^(Warna|Ukuran|Variasi|Pilih)/i.test(tx) && tx.length < 30) {
      const r = e.getBoundingClientRect();
      labels.push({ text: tx, y: Math.round(r.top + window.scrollY), path: shortPath(e) });
    }
  });

  return JSON.stringify({
    url: location.href,
    stateKeys: stateKeys.slice(0, 40),
    docHeight: document.body.scrollHeight,
    labels: labels.slice(0, 15),
    images: seen.slice(0, 400),
  });
}

const r = await send("Runtime.evaluate", {
  expression: "(" + inspect.toString() + ")()",
  returnByValue: true,
});
console.log(r.result?.result?.value || JSON.stringify(r).slice(0, 800));
ws.close();
process.exit(0);
