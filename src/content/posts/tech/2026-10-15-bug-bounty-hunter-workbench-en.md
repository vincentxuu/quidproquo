---
title: "Bug Bounty Hunter's Workbench: Inspecting, Interfering, and Resending HTTP Requests"
date: 2026-10-15
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, web-security, burp-suite, devtools, local-practice]
lang: en
description: "Series 3 of 'Bug Bounty from Zero': A hands-on guide to using Chrome DevTools and Burp Suite Community Edition to intercept requests, modify parameters, and observe server responses."
tldr: "This article teaches you how to use Chrome DevTools 'Copy as cURL' and Burp Proxy/Repeater to inspect HTTP requests, modify parameters like order IDs or search terms, and analyze server responses on a local practice environment. Mastering these tools lets you move from rules (1) and web fundamentals (2) to real vulnerability testing."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 3
---

> 🌏 [中文版](/posts/tech/2026-10-15-bug-bounty-hunter-workbench)

## TL;DR

**Your workbench is the bridge from theory to practice in bug bounty hunting.** This article teaches you:
- Chrome DevTools 'Copy as cURL' — capture browser requests
- Burp Suite Community Edition (Proxy & Repeater) — intercept and modify requests
- Local practice server (`shop.mjs` on 127.0.0.1:8000) — test IDOR & XSS in a safe sandbox

Master these three tools, and you transform rules (article 1) and web fundamentals (article 2) into reproducible vulnerability tests.

---

## Scenario

You’ve enrolled in a bug bounty program, and the rules say "local testing only." You don’t know how to test — no interception tools, no local environment, no way to capture requests for your report. This is where the workbench becomes essential.

**You don’t need expensive cloud services** — all tools are free: Burp Suite Community Edition (downloadable), Chrome DevTools (F12), plus a minimal Node.js practice server (shop.mjs) simulating IDOR and XSS test cases.

---

## Problem

**Mistake 1: No interception tools — cannot replay requests or observe response differences.** You can’t tell if changed input triggers 200 OK or 403 Forbidden, or whether you’ve stolen the right data.

**Mistake 2: No local test environment.** Testing real targets may violate rules, resulting in rejected reports and wasted time.

**Mistake 3: Reports just say "found XSS" with no reproduction steps or evidence.** Google VRP applies a quality multiplier (0.8x/1.0x/1.2x) that directly affects your reward — $101,010 drops to $80,808 with low quality.

---

## Solution: Three Testing Tools

### Tool 1: Chrome DevTools — Copy as cURL

1. Launch DevTools with F12 → Network tab
2. Request http://127.0.0.1:8000/api/search?q=coffee
3. Right-click → **Copy as cURL** → paste into terminal → run curl command

**What you get:**
- Exact HTTP method (GET), full URL, all request headers
- Server response preview (status code, Headers, Body)
- Save as `.sh` for replaying, testing reproducibility

### Tool 2: Burp Suite Community Edition — Proxy & Repeater

1. Download Burp Suite Community (free)
2. Start Proxy → Intercept (ON) → Repeater
3. Visit http://127.0.0.1:8000/api/search?q=tea in any browser
4. Burp captures and pauses at **Intercept** panel
5. Right-click → **Send to Repeater** → Open Repeater → click **Send** → Observe response

**What you get:**
- **Intercept:** Pause any request for inspection
- **Modify:** Change `q=tea` to `q=<script>alert(1)</script>` and observe 200 vs 400
- **Resend:** Test status code changes (200 → 403 → 404) for permission checks

### Tool 3: Local Practice Server `shop.mjs`

You need: A simple server simulating a vulnerable e-commerce site with three endpoints:

- `/login` — POST credentials, returns a `session` cookie
- `/api/search?q=` — returns a list of products
- `/api/orders/<id>` — returns an order only if the requester owns it

Save this as `shop.mjs` and run: `node shop.mjs`. Binds only to 127.0.0.1, so nothing is exposed externally.

Example Request: `curl 'http://127.0.0.1:8000/api/search?q=tea'` → `["Filter"]`

You need: A minimal practice server called `shop` simulating a vulnerable e-commerce site with three endpoints:

- `/login` — POST your credentials, gets a `session` cookie back
- `/api/search?q=` — returns a list of products
- `/api/orders/<id>` — returns an order, but only if the owner matches your session

**Key vulnerability baked in**: change the `id` to another user's order number, you can see their data — classic IDOR.

Save this as `shop.mjs` in a folder and run with `node shop.mjs`. The server binds only to `127.0.0.1`, so nothing is exposed externally.

```js
// shop.mjs — only binds to 127.0.0.1 for safe local practice
import http from "node:http";

const users = { alice: "alice-pass", bob: "bob-pass" };
const sessions = {};
const orders = {
  1532: { owner: "alice", item: "Coffee Beans", address: "Taipei (alice's address)" },
  1533: { owner: "bob", item: "Filter", address: "Taichung (bob's address)" },
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...headers });
  res.end(JSON.stringify(body));
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const sid = (req.headers.cookie ?? "").match(/session=(\w+)/)?.[1];
  const me = sessions[sid];

  if (req.method === "POST" && url.pathname === "/login") {
    let raw = ""; for await (const c of req) raw += c;
    const { user, pass } = JSON.parse(raw);
    if (users[user] !== pass) return send(res, 401, { error: "wrong password" });
    const id = Math.random().toString(36).slice(2, 10);
    sessions[id] = user;
    return send(res, 200, { ok: true }, { "set-cookie": `session=${id}; HttpOnly; Path=/` });
  }
  if (url.pathname === "/api/search") {
    const q = url.searchParams.get("q") ?? "";
    const limit = Number(url.searchParams.get("limit") ?? 2);
    return send(res, 200, ["Coffee beans","Filter","Pour over kettle","Grinder"]
      .filter(p => p.toLowerCase().includes(q.toLowerCase())).slice(0, limit));
  }
  if (url.pathname.startsWith("/api/orders/")) {
    if (!me) return send(res, 401, { error: "not logged in" });
    const order = orders[url.pathname.split("/")[3]];
    if (!order) return send(res, 404, { error: "no such order" });
    if (order.owner !== me) return send(res, 403, { error: "not your order" });
    return send(res, 200, order);
  }
  send(res, 404, { error: "not found" });
}).listen(8000, "127.0.0.1", () => console.log("shop on http://127.0.0.1:8000"));
```

---

## Why This Matters: Report Quality is the Key

Google VRP explicitly states quality multiplier:
- Low (0.8x) = missing repro steps, no PoC
- Good (1.0x) = full repro steps, PoC present
- Exceptional (1.2x) = Good + remediation, quantified impact

$101,010 base:
- 0.8x → $80,808
- 1.0x → $101,010
- 1.2x → $121,212

The workbench exists to **generate those quality conditions**: reproducible PoC, clear steps, verified impact.

---

## Self-Check (Key question: Are your tools ready?)

- [ ] You can intercept http://127.0.0.1:8000 requests (DevTools or Burp)
- [ ] You can replay a curl command and observe the same response
- [ ] You can modify query parameters (q, id) and observe status code changes (200 → 403 → 404)
- [ ] You could test IDOR (`1532` → `1533`) and XSS (`<script>alert(1)</script>`)
- [ ] You understand "local testing only" means security (localhost only, no internet exposure)

---

## References

- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [Chrome DevTools — Network requests](https://developer.chrome.com/docs/devtools/network/reference/)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [Node.js http module](https://nodejs.org/api/http.html)
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)

---

*This is Series 3 (Workbench) of "Bug Bounty from Zero." Previous: Rules (1), Websites (2); Next: XSS/IDOR (4), RCE (5).*

---

*上一篇：[如何讀懂 Bug Bounty 規則](/posts/tech/2026-10-15-bug-bounty-zero-01-rules-and-scope) | 下一篇：[XSS + IDOR：這兩種最常見、獎金最高的漏洞](/posts/tech/2026-10-15-bug-bounty-zero-04-xss-and-idor)*