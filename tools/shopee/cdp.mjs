const PORT = 9222;
const url = process.argv[2];
const waitMs = Number(process.argv[3] || 20000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function list() {
  const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  return r.json();
}

let tabs = null;
for (let i = 0; i < 40; i++) {
  try {
    tabs = await list();
    if (tabs.length) break;
  } catch {}
  await sleep(500);
}
if (!tabs || !tabs.length) {
  console.error("NO_CHROME");
  process.exit(1);
}

const page =
  tabs.find((t) => t.type === "page" && /shopee/.test(t.url)) ||
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
if (url) await send("Page.navigate", { url });
await sleep(waitMs);

// scroll so lazy images load
await send("Runtime.evaluate", {
  expression:
    "(async()=>{for(let y=0;y<9000;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,180));}window.scrollTo(0,0);})()",
  awaitPromise: true,
});
await sleep(3000);

// Collect image URLs. Built as a plain function, stringified, to avoid any
// escaping games between the shell, node and the page.
function collect() {
  const out = [];
  const push = (u) => {
    if (u && u.indexOf("susercontent.com/file/") > -1) out.push(u.split("?")[0]);
  };
  document.querySelectorAll("img").forEach((i) => push(i.currentSrc || i.src));
  document.querySelectorAll("*").forEach((e) => {
    const v = getComputedStyle(e).backgroundImage;
    if (!v || v === "none" || v.indexOf("url(") !== 0) return;
    let t = v.slice(4).trim();
    if (t.charAt(t.length - 1) === ")") t = t.slice(0, -1).trim();
    const q = t.charAt(0);
    if (q === '"' || q === "'") t = t.slice(1, -1);
    push(t);
  });
  return JSON.stringify({
    url: location.href,
    title: document.title,
    h1: (document.querySelector("h1") || {}).textContent || "",
    bodyHead: document.body.innerText.slice(0, 400),
    imgs: Array.from(new Set(out)),
  });
}

const r = await send("Runtime.evaluate", {
  expression: "(" + collect.toString() + ")()",
  returnByValue: true,
});
console.log(r.result?.result?.value || JSON.stringify(r));
ws.close();
process.exit(0);
