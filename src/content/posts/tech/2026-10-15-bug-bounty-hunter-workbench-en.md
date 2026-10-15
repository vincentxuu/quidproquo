---
title: "A Bug Bounty Workbench: Capture Requests, Change Parameters, and Check Authorization"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, burp-suite, devtools, local-practice]
lang: en
description: "Build repeatable HTTP and order-authorization controls with a local Node.js server, DevTools, and Burp Repeater."
tldr: "Replay the control, then change one field; a status code or reflected text alone is not vulnerability proof."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 3
---

> 🌏 [繁體中文版](/posts/tech/2026-10-15-bug-bounty-hunter-workbench)

## Start with one request

The previous chapter explained how browsers and servers exchange data. This chapter captures one request, changes one field, and compares the results. Your deliverable is a reproducible record: the original request, the modified request, both responses, and an explanation of what they show.

Think of the workbench as the building reception desk. First understand the form you submit, then change its contents. Practice only against your own local server here. For a real program, return to chapter 1 and check its scope and testing rules.

## Establish a repeatable local baseline

Save the following as `shop.mjs` and run `node shop.mjs`. It provides login, product search, and order retrieval. Search returns JSON, and order retrieval checks ownership. This is an HTTP and authorization baseline, not an application that already contains XSS or IDOR.

```js
// shop.mjs — local HTTP and authorization practice, not a production service
import http from "node:http";
import { randomBytes } from "node:crypto";

const users = { alice: "alice-pass", bob: "bob-pass" };
const sessions = {};
const orders = {
  1532: { owner: "alice", item: "Coffee Beans", address: "Taipei" },
  1533: { owner: "bob", item: "Filter", address: "Taichung" },
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
    let credentials;
    try { credentials = JSON.parse(raw); } catch { return send(res, 400, { error: "invalid JSON" }); }
    const { user, pass } = credentials ?? {};
    if (typeof user !== "string" || typeof pass !== "string" || !Object.hasOwn(users, user) || users[user] !== pass) return send(res, 401, { error: "wrong password" });
    const id = randomBytes(16).toString("hex");
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

It listens only on `127.0.0.1:8000`. That keeps the exercise local; it does not make this a production service. The example lacks comprehensive input limits, persistent storage, and production account protection. Stop it with Ctrl+C. Its sessions disappear when it stops.

## Record a control case with curl

Open another terminal and run these commands. The cookie jar at `/tmp/qpq-shop.cookies` carries the same session into subsequent requests.

```sh
curl -i 'http://127.0.0.1:8000/api/search?q=coffee'
curl -i 'http://127.0.0.1:8000/api/orders/1532'
curl -i -c /tmp/qpq-shop.cookies -H 'Content-Type: application/json' \
  --data '{"user":"alice","pass":"alice-pass"}' \
  'http://127.0.0.1:8000/login'
curl -i -b /tmp/qpq-shop.cookies 'http://127.0.0.1:8000/api/orders/1532'
curl -i -b /tmp/qpq-shop.cookies 'http://127.0.0.1:8000/api/orders/1533'
curl -i -b /tmp/qpq-shop.cookies 'http://127.0.0.1:8000/api/orders/9999'
```

In order, expect a successful search containing `Coffee beans`, a 401 for unauthenticated order access, successful login, a 200 for Alice's own order, a 403 for Bob's order, and a 404 for a nonexistent order. Alice's order contains `Coffee Beans` and `Taipei`.

Those are conventions implemented by this particular server. On another application, a 403 does not necessarily establish that you are authenticated, and a 200 does not establish that you retrieved someone else's data. Inspect identity, response contents, and expected permissions together.

## Capture the browser's actual request with DevTools

Open Chrome's Network panel and visit the product-search URL. Select the request and inspect Headers and Response, then choose Copy as cURL. Replay the command in a terminal without changing anything. Confirm that the baseline still works before modifying it.

Now change only `q=coffee` to `q=filter`. Expect the product to change from coffee beans to a filter; both responses can still be 200. This practices controlling a variable, not declaring any responsive input a vulnerability. Copying a real authenticated request also copies credentials such as cookies. Remove those before sharing a report or an example.

## Change one field in Burp Repeater

Open Burp's built-in browser and visit the local search URL. Proxy's HTTP history shows requests already sent. If Intercept is enabled, Forward the paused request so it does not remain stuck. Choose Send to Repeater on the target request, change a parameter, and click Send.

For order authorization, use the local browser tab's DevTools Console to run the request below. There is no login form in this example. You can alternatively import the complete authenticated curl request and cookie into Repeater.

```js
await fetch("/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user: "alice", pass: "alice-pass" }),
});
```

 Keep the session fixed and change order 1532 to 1533. Expect a 403. Bob's session should be able to retrieve 1533. This compares identity with resource ownership.

## Observation is not yet vulnerability evidence

If a defective service lets Alice retrieve Bob's private order contents, that provides evidence of unauthorized access. A 200 response, the existence of an order number, or differing error messages alone does not establish the same result.

The search endpoint returns a JSON product list. It does not execute the query as HTML. Sending `<script>` and receiving a response cannot establish XSS. The next chapter uses browser execution contexts and official exercises to separate reflected data from script execution.

Record the test identity, endpoint, single modified field, expected outcome, actual response, and conclusion. Helping another person reproduce the result matters more than collecting screenshots. Report quality can affect triage, but a reward-table multiplier cannot guarantee a payout for every example.

## Check your understanding

1. How do the responses for order 1532 differ before and after Alice logs in?
2. What does Alice's 403 for order 1533 establish, and what does it leave unproven?
3. Why does a 200 search response, even one containing `<script>` text, not prove XSS?
4. When changing one parameter, how would you rule out session expiration?

## Update history

- 2026-10-15: Added reproducible login and authorization controls, corrected the JSON-search/XSS boundary, and removed guaranteed payout claims.

## References

- [Chrome DevTools: Network reference](https://developer.chrome.com/docs/devtools/network/reference/)
- [Burp Suite: Repeater](https://portswigger.net/burp/documentation/desktop/tools/repeater)
- [PortSwigger: Access control](https://portswigger.net/web-security/access-control)
- [PortSwigger: Cross-site scripting](https://portswigger.net/web-security/cross-site-scripting)
- [Node.js HTTP module](https://nodejs.org/api/http.html)
