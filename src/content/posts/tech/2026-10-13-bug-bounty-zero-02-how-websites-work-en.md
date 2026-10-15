---
title: "What Do the Browser and Server Exchange When You Click a Link?"
date: 2026-10-13
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web, http, cookies, session, curl]
lang: en
description: "Part 2 explains URLs, HTTP requests and responses, status codes, cookies, and sessions through DevTools and a local curl exercise."
tldr: "A browser sends a request with a method, target, headers, and sometimes cookies. The server returns a status, headers, and content. Authentication identifies a user; authorization must still check access to each order."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 2
---

> 🌏 [繁體中文版](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work)

This is part 2. Part 1 covered program selection and scope. Here we answer what actually happens after you click a link. Understanding what the browser sends, what the server returns, and what a session cookie does prepares you to inspect requests in part 3.

## The lifecycle of a link

Enter `http://example.com/search?q=coffee` in a browser. At the application level:

1. The browser parses the URL into a scheme, host, path, and query.
2. It prepares an HTTP request with a method such as GET, a request target, and headers such as Accept and any applicable Cookie header.
3. It sends that request over a connection to the server. The underlying transport depends on the HTTP version; HTTP/1.1 and HTTP/2 use TCP, while HTTP/3 uses QUIC over UDP.
4. The server parses the request and runs application logic, which may query a database.
5. The server returns an HTTP response: a status code, headers such as Content-Type and possibly Set-Cookie, and a body such as HTML or JSON.
6. The browser processes the response. It may render HTML, execute scripts, and request further resources. It stores accepted cookies and sends them on later requests that match their scope and browser policy.

We focus on the application data you can inspect. A complete networking explanation would also cover DNS, connection establishment, TLS for HTTPS, and caching; these are not prerequisites for the local exercise.

## Splitting a URL into four parts

For `http://example.com/api/orders/1532?q=coffee`:

| Part | Value | Meaning |
|---|---|---|
| Scheme | `http` | The URL uses HTTP; this does not by itself specify HTTP/1.1 |
| Host | `example.com` | The destination host, usually resolved through DNS |
| Path | `/api/orders/1532` | The application route and, here, an object identifier |
| Query | `q=coffee` | Additional input that the application may use |

Paths and parameters are useful places to investigate application behavior:

- Change `/api/orders/1532` to `1533` and check whether the server enforces ownership.
- Change `q=coffee` to another search term and compare the result.
- In an authorized XSS lab, trace where input reaches HTML or a browser API that can interpret it as code.

Changing an ID or inserting a script-shaped string is a test input, not a vulnerability finding by itself. Part 4 explains the evidence needed.

## Status codes: what did the server report?

| Code | Meaning | What to investigate |
|---|---|---|
| 200 OK | The request succeeded | Does the body contain only data this account may access? |
| 301/302 | A redirect | Where does the Location header lead, and is access still checked? |
| 400 Bad Request | The server considers the request invalid | Does the error reveal sensitive implementation details? |
| 401 Unauthorized | Valid authentication credentials are missing | Is the session missing, expired, or invalid? |
| 403 Forbidden | The server refuses the request | Which application rule denies access? Authentication is not implied by the code alone |
| 404 Not Found | The resource is unavailable or the server does not disclose it | The code may deliberately conceal a resource's existence |
| 500 Internal Server Error | An unexpected server error | Record the relevant input and response; this does not establish RCE |

In Repeater, compare the status, body, and response size while changing one parameter. A difference is a clue about application behavior. It may be entirely expected; confirm the account, resource, and access policy before calling it a vulnerability.

A difference between an owner's `200` and another account's `404` does not automatically disclose a secret. Even an existence difference such as `403` versus `404` matters only when the existence itself is sensitive and the test demonstrates an unauthorized disclosure.

## Cookies and sessions: recognizing the user

A cookie stores a value that the browser can send with matching requests. A session cookie often contains an identifier that the server maps to a logged-in user. Other cookies store preferences or unrelated state, so a cookie is not inherently an identity credential. Applications can also authenticate without cookies.

For an order API, distinguish authentication from authorization:

- If an endpoint returns private orders to anyone who changes the URL, access control is missing.
- If it recognizes your session but does not check whether you may access the selected order, a valid login can still expose someone else's data.
- If it checks the relevant ownership or role policy on every request, it enforces that boundary.

Knowing who you are does not answer which objects you may read.

### Local exercise: inspect cookie behavior with curl

Start `shop.mjs` from part 3 on `127.0.0.1:8000`. Its sample data assigns order `1532` to Alice and `1533` to Bob.

```bash
# 1. Log in as Alice and save the session cookie.
curl -s -c jar.txt -H 'content-type: application/json' \
  -d '{"user":"alice","pass":"alice-pass"}' \
  http://127.0.0.1:8000/login

# 2. Send Alice's cookie and read her order.
curl -s -b jar.txt http://127.0.0.1:8000/api/orders/1532
# Expected body: {"owner":"alice","item":"Coffee Beans","address":"Taipei"}

# 3. Repeat without a cookie: the sample returns 401.
curl -s -o /dev/null -w "%{http_code}\n" \
  http://127.0.0.1:8000/api/orders/1532

# 4. Keep Alice's cookie and request Bob's order: the sample returns 403.
curl -s -b jar.txt -o /dev/null -w "%{http_code}\n" \
  http://127.0.0.1:8000/api/orders/1533
```

In this application, `401` means no valid session and `403` means a logged-in user does not own the order. Those interpretations come from the application code, not a universal guarantee about every server. The sample protects the cross-account order boundary; it does not deliberately demonstrate an IDOR.

## Same-origin intuition: why XSS can act as a user

An origin consists of the scheme, host, and port. Browsers restrict scripts from reading data across origins. XSS matters because attacker-controlled code executes in the vulnerable application's browser context and may use the victim's application privileges.

Cookie access has additional rules. JavaScript cannot read an `HttpOnly` cookie through `document.cookie`, and cookie scope controls which other cookies are visible. `HttpOnly` does not prevent an injected script from making permitted same-origin requests for which the browser supplies the session cookie. It therefore reduces cookie theft without making XSS harmless.

Use a benign execution marker in a lab. Demonstrating XSS does not require stealing cookies or another person's data.

## Inspect your own request in DevTools

1. Open your local practice application, open DevTools, and select Network.
2. Enable Preserve log, then perform a search or login.
3. Select the request and inspect its method, URL, request headers, response status, and body.
4. Right-click → Copy as cURL to export a terminal command. A logged-in request may include credentials: keep it private and redact them before sharing.
5. Run it locally, change one parameter such as `q=coffee` to `q=tea`, and compare the response.

You can now connect a browser action to an HTTP exchange instead of treating the resulting page as a black box.

## Preparing for part 3

You should now be able to:

- Identify a URL's path and query.
- Find the status and content in an HTTP response.
- Explain why the same URL can produce different results for different accounts.
- Resend a request with curl and change one parameter.

Next, part 3 combines DevTools, Burp Proxy, and Repeater into a workflow: inventory features, vary inputs, and record responses.

## Update history

- 2026-10-15: Completed the English article and synchronized both languages; corrected cookie and status-code explanations, matched the local exercise to the server, and removed claims that response differences alone prove vulnerabilities.

## References

- [MDN: An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [PortSwigger: Web Security Academy](https://portswigger.net/web-security)
- [OWASP: Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
