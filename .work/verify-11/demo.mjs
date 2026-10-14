// demo.mjs，只在自己的電腦練習：所有伺服器只綁 127.0.0.1
import http from "node:http";

// --- 假資料：兩個使用者、三張筆記 ---
const sessions = { "alice-token": "alice", "bob-token": "bob" }; // cookie -> 使用者
const notes = {
  1: { owner: "alice", text: "Alice 的日記" },
  2: { owner: "bob", text: "Bob 的銀行備忘" },
  3: { owner: "alice", text: "Alice 的購物清單" },
};

// --- XSS：有洞版與修法版 ---
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
   .replaceAll('"', "&quot;").replaceAll("'", "&#x27;");

function greet(req, res, safe) {
  const name = new URL(req.url, "http://x").searchParams.get("name") ?? "";
  const shown = safe ? escapeHtml(name) : name; // 有洞版：原樣塞進 HTML
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(`<p>Hello, ${shown}</p>`);
}

// --- IDOR：有洞版與修法版 ---
function getNote(req, res, safe) {
  const me = sessions[(req.headers.cookie ?? "").replace("session=", "")];
  if (!me) { res.statusCode = 401; return res.end("not logged in"); }
  const id = new URL(req.url, "http://x").pathname.split("/")[2];
  const note = notes[id];
  if (!note || (safe && note.owner !== me)) { // 修法：伺服器端檢查擁有者
    res.statusCode = 404; return res.end("not found");
  }
  res.end(note.text);
}

const app = (safe) => http.createServer((req, res) =>
  req.url.startsWith("/greet") ? greet(req, res, safe) :
  req.url.startsWith("/notes/") ? getNote(req, res, safe) :
  (res.statusCode = 404, res.end("?")));

const listen = (s) => new Promise((r) => s.listen(0, "127.0.0.1", () => r(s.address().port)));
const get = async (port, path, cookie) => {
  const r = await fetch(`http://127.0.0.1:${port}${path}`, { headers: cookie ? { cookie } : {} });
  return `${r.status} ${await r.text()}`;
};

const vuln = app(false), fixed = app(true);
const [pv, pf] = [await listen(vuln), await listen(fixed)];
const payload = encodeURIComponent("<script>alert(1)</script>");

console.log("== XSS ==");
console.log("有洞版 :", await get(pv, `/greet?name=${payload}`));
console.log("修法版 :", await get(pf, `/greet?name=${payload}`));
console.log("== IDOR（我是 alice，改成讀 id=2，那是 bob 的）==");
console.log("有洞版 :", await get(pv, "/notes/2", "session=alice-token"));
console.log("修法版 :", await get(pf, "/notes/2", "session=alice-token"));
console.log("修法版讀自己的 id=1 :", await get(pf, "/notes/1", "session=alice-token"));
vuln.close(); fixed.close();
