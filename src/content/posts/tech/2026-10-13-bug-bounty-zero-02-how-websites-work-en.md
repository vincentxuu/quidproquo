---
title: "How a Website Request Works: URLs, HTTP, Cookies and Hands-On curl"
date: 2026-10-13
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - web-security
  - http
  - cookie
  - devtools
lang: en
description: "For readers with no security background: what the browser and server exchange when you click a link. Breaks down URLs, HTTP requests and responses, status codes, cookies and the same-origin rule, then shows how to inspect your own requests with curl and browser DevTools."
tldr: "A click turns a URL into an HTTP request, and the server answers with a status code. A cookie is the wristband the server hands you so stateless HTTP can recognize you. By the end you can find one request in DevTools' Network panel and point to its URL, method and cookie. The examples only hit your own machine."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 2
---

> 🌏 [中文版](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work)

What actually happens when you click a link in your browser? This post splits the answer into five things: the URL, the HTTP request, the HTTP response, the cookie, and the same-origin rule. By the end you should be able to open your browser's developer tools, find one request, and say which part is the URL, which is the method, and which is the cookie.

This is part 2 of the "Bug Bounty from Zero" series. [Part 0](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en) fact-checked a few top payout numbers, and [part 1](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope-en) covers rules and scope. The next post, on common web bugs such as XSS and IDOR, builds directly on the ideas here, so it is worth getting the foundation straight first.

This post covers basics only. There are no attack techniques in it, and it skips HTTP/2 and HTTP/3 details. All you need is to be comfortable using a browser; no programming required.

## The big picture: one click, in order

We will follow one click through time. That is the spine of the whole post:

| Step | What happens | Section |
|---|---|---|
| 1 | You click a link and the browser has a URL | URL |
| 2 | The browser builds an HTTP request and sends it | Requests |
| 3 | The server handles it and sends back an HTTP response | Responses and status codes |
| 4 | The browser stores any cookie in the response and sends it back next time | Cookies |
| 5 | Once the page loads, the browser limits how code from different origins can read each other | Same-origin rule |

According to [MDN's overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview), the browser always initiates the request, never the server (some later mechanisms simulate server-initiated messages, but this post leaves them aside). It first fetches an HTML document, parses it, then sends further requests for the CSS, scripts and images, and finally assembles the page you see. So "opening a web page" is usually many requests, not one.

## The URL: four parts of an address

Take the URL we will use later, `http://127.0.0.1:8000/me?lang=zh`, and split it following [MDN's explanation of URLs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL):

| Part | Example | Plain meaning |
|---|---|---|
| Scheme | `http` | How to talk; for websites usually HTTPS or HTTP |
| Authority (domain and port) | `127.0.0.1:8000` | Which server, and which "gate" on it; when the port is omitted, HTTP uses 80 and HTTPS uses 443 |
| Path | `/me` | Which resource on that server |
| Query | `?lang=zh` | A small `key=value` note passed to the server |

MDN compares this to a postal address: the scheme is the postal service, the domain is the city, the port is the zip code, the path is the building, and the parameters are the apartment number. There is also the fragment after `#`. It stays in the browser and is **never sent to the server**, which will matter in the next post.

## Requests and responses: two notes with the same shape

HTTP messages are readable by humans. Per [MDN's page on HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages), both requests and responses have four blocks: a start line, a set of headers, an empty line, and an optional body.

A request's first line is the request-line, in the form `<method> <target> <protocol version>`, for example `GET /me HTTP/1.1`. The method says what you want: [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) means "give me this resource" and POST means "I am sending you data". Headers are metadata attached to the message, like `Host` (which site) and `Cookie` (more below). A body appears only on requests such as POST, PUT and PATCH, for example the fields of a form you submit.

A response's first line is the status line, `<protocol version> <status code> <reason>`, such as `HTTP/1.1 404 Not Found`, followed by response headers and a body (the page content itself).

## Status codes: the server's first words

A status code is three digits, and the first digit gives the category. [MDN's status code reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) groups them into five classes (informational, success, redirection, client error, server error). To start, remember three:

- **200 OK**: the request succeeded.
- **404 Not Found**: [the server cannot find the requested resource](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404).
- **401 and 403 are easy to mix up**: [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401) means the request lacks valid authentication credentials, as in "who are you? prove it first". [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403) means the server understood the request but refuses it, and authenticating again makes no difference. The most common case is "you are signed in, but you lack permission for this".

This pair comes up again and again. Checking whether a site keeps "who can see what" under control often comes down to what it returns at the moment it should have said 403.

## Cookies and sessions: the entry wristband

HTTP has no memory. [MDN states it plainly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview): HTTP is stateless, with no link between two requests carried out one after another on the same connection. So how does a site know you just signed in? Through cookies.

Picture the site as a venue with controlled entry. At the gate you show your ID (username and password). The desk checks it and **gives you a wristband**. At every stall inside, you show the wristband, and the stall does not need to check your ID again. Mapped to HTTP:

1. You send your username and password.
2. The server verifies them and puts a [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) header in the response, usually carrying a session ID (the number on the wristband).
3. The browser stores it and, for each later request to the same site, sends it in a `Cookie` header.
4. The server looks the number up ("this wristband belongs to alice") and returns her page; an invalid number gets a login page or an error.

These four steps are the sign-in flow described in [MDN's cookie guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies). The session is the state the server keeps on its side: the record of who each number belongs to.

For a wristband to be worth anything, nobody must be able to guess the number. MDN notes that cookie values are by default visible to and changeable by the user, and suggests using an opaque identifier that the server looks up rather than putting sensitive data in the cookie itself. Some cookies carry `HttpOnly`, which keeps JavaScript on the page from reading them while still sending them with requests. MDN lists this as a mitigation against XSS, which the next post covers.

## The same-origin rule: the intuitive version

One last concept. You have your bank open next to a stranger's site. Why can't the stranger's code read your bank page? Because browsers enforce the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy).

An origin is the combination of scheme, host and port, and all three must match. MDN's examples, using `http://store.company.com/dir/page.html` as the baseline:

| Other URL | Same origin? | Reason |
|---|---|---|
| `http://store.company.com/dir2/other.html` | Same | Only the path differs |
| `https://store.company.com/page.html` | Different | Different scheme |
| `http://store.company.com:81/dir/page.html` | Different | Different port |
| `http://news.company.com/dir/page.html` | Different | Different host |

The intuitive version: between different origins you can send a letter or embed something, but you usually cannot read the other side's content. MDN sorts this into three: cross-origin writes (links, redirects, form submissions) are typically allowed, cross-origin embedding (images, scripts, iframes) is typically allowed, and cross-origin reads are typically disallowed. The same-origin policy is a browser security mechanism ([PortSwigger](https://portswigger.net/web-security/cors/same-origin-policy)), so a non-browser tool like curl is not held to it; but curl only sends your own requests and never carries someone else's cookies. How CORS opens specific exceptions is a topic for later.

## Hands-on: watch a full request and response with curl

The experiment below only touches your own machine. In my sandbox, curl could not resolve example.com, so I wrote a tiny local server with Python's built-in `http.server`: `/login` hands out a cookie, `/me` only recognizes you if you present it, and any other path returns 404. The outputs below were actually run in the sandbox on 2026-10-13 (curl 8.5.0, Python 3.13); I only removed curl's progress meter.

The server (save as `server.py`, start it with `python3 server.py`; it listens on 127.0.0.1:8000 only):

```python
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/login"):
            body = b"welcome\n"
            self.send_response(200)
            self.send_header("Set-Cookie", "session=abc123; HttpOnly; Path=/")
        elif self.path.startswith("/me"):
            if "session=abc123" in self.headers.get("Cookie", ""):
                body = b"hello, alice\n"
                self.send_response(200)
            else:
                body = b"please log in\n"
                self.send_response(401)
        else:
            body = b"not here\n"
            self.send_response(404)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("127.0.0.1", 8000), H).serve_forever()
```

Step one: ask for `/me` with no cookie (`-i` makes curl print the response headers too):

```bash
curl -i "http://127.0.0.1:8000/me?lang=zh"
```

```http
HTTP/1.0 401 Unauthorized
Server: BaseHTTP/0.6 Python/3.13.16
Date: Tue, 13 Oct 2026 14:29:25 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 14

please log in
```

Step two: visit `/login` and look at the wristband the server hands out:

```bash
curl -i http://127.0.0.1:8000/login
```

```http
HTTP/1.0 200 OK
Server: BaseHTTP/0.6 Python/3.13.16
Date: Tue, 13 Oct 2026 14:29:25 GMT
Set-Cookie: session=abc123; HttpOnly; Path=/
Content-Type: text/plain; charset=utf-8
Content-Length: 8

welcome
```

Step three: show the wristband and ask for `/me` again:

```bash
curl -i -H "Cookie: session=abc123" http://127.0.0.1:8000/me
```

```http
HTTP/1.0 200 OK
Server: BaseHTTP/0.6 Python/3.13.16
Date: Tue, 13 Oct 2026 14:29:25 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 13

hello, alice
```

Same URL, `/me`, and the answer flips from 401 to 200 depending on whether a `Cookie` header is present. That is the whole idea of a session. A path that does not exist returns `HTTP/1.0 404 Not Found` with the body `not here`.

To see the **request** itself, add `-v`. Lines starting with `>` are what curl sent (lines starting with `*` are curl's own connection messages, and of the response headers starting with `<` only the status line is kept; the rest are omitted):

```bash
curl -v http://127.0.0.1:8000/me
```

```text
> GET /me HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/8.5.0
> Accept: */*
>
< HTTP/1.0 401 Unauthorized
```

Match it to the structure above: `GET /me HTTP/1.1` is the request-line (method, target, version), the next three lines are headers, and the empty line ends the headers. Two side notes. This toy server answers with `HTTP/1.0`, which is that Python module's default; real sites mostly answer HTTP/1.1 or newer, and the structure reads the same. Its 401 also leaves out the `WWW-Authenticate` header that MDN says a 401 should come with, to keep the example short; that is not how a proper 401 looks.

Finally, instead of copying the cookie by hand, let curl keep it:

```bash
curl -s -c jar.txt http://127.0.0.1:8000/login > /dev/null
curl -s -b jar.txt http://127.0.0.1:8000/me
# hello, alice
```

`-c` saves cookies the server sets into a file, and `-b` reads them back and sends them. A browser does exactly this, automatically.

## Tonight: find your own request in DevTools

Use any site you have an account on (or the local server above):

1. Open a tab and press `Control+Shift+J` (`Command+Option+J` on Mac) to open Chrome DevTools, then switch to the **Network** tab. Per [Chrome's tutorial](https://developer.chrome.com/docs/devtools/network), DevTools only records requests made while it is open, so the list starts empty. **Reload the page** to fill it.
2. Right-click the table header and enable the **Method**, **URL** and **Cookies** columns (these are optional columns per the [Network reference](https://developer.chrome.com/docs/devtools/network/reference)). Each row now shows the method, the full URL, and how many cookies that request carried.
3. Click the top row (usually the main HTML document). The **Headers** tab shows General (including the status code), Response Headers and Request Headers. The **Cookies** tab shows the cookies sent with that request. If the page has a form or query parameters, the **Payload** tab lists them.
4. Write down three things: what each of the four URL parts is, whether the method is GET or POST, and the name of the cookie. If you can, you have met this post's goal.

Firefox has a similar Network panel with slightly different labels; I only checked Chrome's documentation for this post.

## Limits

This post simplifies on purpose. From HTTP/2 on, messages are wrapped in frames and can no longer be read directly by eye; this post does not go into that. Cookies also have attributes such as `SameSite`, `Domain`, `Path` and expiry, and only `HttpOnly` is mentioned here; the rest can wait until specific bugs need them. The same-origin policy is covered only intuitively, with no CORS. And when practicing with curl, point it only at your own machine or targets you are authorized to test; the scope and rules from part 1 apply here too.

## Putting it together

After a click, the browser builds a request from the URL, the server answers with a status code, cookies give stateless HTTP a way to recognize you, and the same-origin rule limits how code from different origins reads each other. Each of these is a place a bug hunter learns to look: how the server uses a URL parameter, what it returns when it should have said 403, whether a wristband number can be guessed.

That is why this comes first. Part 0 checked a few top-of-the-range payouts, while beginners mostly run into common web-layer bugs. The next post, [common web bugs](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en), uses the vocabulary from here to explain what goes wrong in XSS and IDOR.

## References

- [Overview of HTTP (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [What is a URL? (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL)
- [HTTP messages (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)
- [HTTP request methods (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [HTTP response status codes (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [401 Unauthorized (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401)
- [403 Forbidden (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403)
- [404 Not Found (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404)
- [Using HTTP cookies (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [Set-Cookie header (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
- [Same-origin policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)
- [Same-origin policy (PortSwigger Web Security Academy)](https://portswigger.net/web-security/cors/same-origin-policy)
- [Inspect network activity (Chrome for Developers)](https://developer.chrome.com/docs/devtools/network)
- [Network features reference (Chrome for Developers)](https://developer.chrome.com/docs/devtools/network/reference)
- On this site: [Fact-checking bug bounty's top payouts (part 0)](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en), [Rules and scope (part 1)](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope-en), [Common web bugs (part 3)](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en)
