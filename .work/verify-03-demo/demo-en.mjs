// demo.mjs, practice only on your own computer: servers bind to 127.0.0.1 only
import http from "node:http";

// --- fake data: two users, three notes ---
const sessions = { "alice-token": "alice", "bob-token": "bob" }; // cookie -> user
const notes = {
  1: { owner: "alice", text: "Alice's diary" },
  2: { owner: "bob", text: "Bob's bank memo" },
  3: { owner: "alice", text: "Alice's shopping list" },
};

// --- XSS: vulnerable and fixed ---
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
   .replaceAll('"', "&quot;").replaceAll("'", "&#x27;");

function greet(req, res, safe) {
  const name = new URL(req.url, "http://x").searchParams.get("name") ?? "";
  const shown = safe ? escapeHtml(name) : name; // vulnerable: dropped into HTML as-is
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(`<p>Hello, ${shown}</p>`);
}

// --- IDOR: vulnerable and fixed ---
function getNote(req, res, safe) {
  const me = sessions[(req.headers.cookie ?? "").replace("session=", "")];
  if (!me) { res.statusCode = 401; return res.end("not logged in"); }
  const id = new URL(req.url, "http://x").pathname.split("/")[2];
  const note = notes[id];
  if (!note || (safe && note.owner !== me)) { // fix: server-side ownership check
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
console.log("vulnerable :", await get(pv, `/greet?name=${payload}`));
console.log("fixed      :", await get(pf, `/greet?name=${payload}`));
console.log("== IDOR (I am alice, asking for id=2, which is bob's) ==");
console.log("vulnerable :", await get(pv, "/notes/2", "session=alice-token"));
console.log("fixed      :", await get(pf, "/notes/2", "session=alice-token"));
console.log("fixed, my own id=1 :", await get(pf, "/notes/1", "session=alice-token"));
vuln.close(); fixed.close();
