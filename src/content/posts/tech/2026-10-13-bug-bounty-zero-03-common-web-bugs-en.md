---
title: "The Two Most Common Web Bugs, XSS and IDOR, and Why Google Pays Them Differently"
date: 2026-10-13
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - web-security
  - xss
  - idor
  - owasp
lang: en
description: "A small program you can run on your own machine shows what XSS (making someone else's browser run a script it shouldn't) and IDOR (swapping the id in a URL for someone else's) look like, then maps each to its cell in Google's reward table."
tldr: "XSS happens when a site puts user input into a page unchanged, so another person's browser runs it as code; the fix is escaping on output. IDOR happens when a server hands over whatever id it is asked for without checking the record is yours; the fix is an ownership check on the server. Google's table puts XSS under 'execute code on the client' (C0), $10,000 base on a standard Google app, and IDOR under logic flaws (S2), priced by how sensitive the exposed data is: on the same standard Google app, $3,133.7 to $31,337."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 3
---

> 🌏 [中文版](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs)

This is part 3 of "Bug Bounty from Zero". The previous post, [How Websites Work](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work-en), covered HTTP, cookies and the same-origin policy. Here we use that groundwork on the two most common web bugs, XSS and IDOR. Part 0, [Fact-Checking Bug Bounty's Top Payouts](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en), leaned on [Google's reward table](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules); this time we find where these two bugs sit in it.

By the end you should be able to look at a short piece of web code, point to the XSS or IDOR, and say how to fix it.

## Two analogies first

**XSS** is like pinning a note to the neighborhood bulletin board. The board never checks what is written on it. You pin up "please turn this over and write your door code on the back," and people walking by do it. The site is the board, the browser is the passer-by, and the note is a script.

**IDOR** is like a hotel desk that looks at the room number but not at you. You say "I'd like the bill for room 502," and they hand it over without asking whether you are staying in 502.

The difference matters. With XSS, someone else's browser is tricked into doing something. With IDOR, the server itself gives out data it shouldn't.

## XSS: making someone else's browser run a script it shouldn't

[OWASP defines it](https://owasp.org/www-community/attacks/xss/) as malicious scripts injected into an otherwise trusted site; the browser has no way to know the script shouldn't be trusted, so it runs it. The root cause is a web app using user input in its output without validating or encoding it.

Once a script runs, it can do what the site's own code can do. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) lists three things: read or change the page, read or change local storage, and make HTTP requests with the user's credentials. That is why the same-origin rule from part 2 matters here: the script arrives inside the site's own page, so the browser treats it as the site's own code.

OWASP describes two common forms. **Reflected** XSS bounces input straight back in the response, for example in a search result or error message, so the attacker has to get the victim to open a crafted link. **Stored** XSS saves the input first, in a database for instance, and every visitor who loads that page runs it. OWASP's classic example is a guestbook.

### A minimal example (practice only on your own computer)

The script below uses Node.js with no packages. It starts two small servers bound only to `127.0.0.1`, one vulnerable and one fixed, sends requests to them, and prints the responses. `127.0.0.1` is reachable only from your own machine.

```js
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
```

I ran `node demo.mjs` in a sandbox on Node.js v22.22.0. The actual output:

```text
== XSS ==
vulnerable : 200 <p>Hello, <script>alert(1)</script></p>
fixed      : 200 <p>Hello, &lt;script&gt;alert(1)&lt;/script&gt;</p>
== IDOR (I am alice, asking for id=2, which is bob's) ==
vulnerable : 200 Bob's bank memo
fixed      : 404 not found
fixed, my own id=1 : 200 Alice's diary
```

Start with the two XSS lines. `name` comes from the URL, so it is user input. The vulnerable version splices it into the HTML, and the response contains a real `<script>` tag. A browser receiving that HTML would run it (that is OWASP's and MDN's description; this script only prints the server's response and does not open a browser). The fixed version turns `<` into `&lt;` and `>` into `&gt;`, so the browser sees plain text to display, not a tag.

**Spotting XSS:** ask "who controls this variable, and was it escaped before going into the HTML?" In the example it is the `${shown}` line.

**The fix is output escaping.** [OWASP's XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) says that when a variable goes between HTML tags, use HTML entity encoding, which is the five replacements above. When displaying text from JavaScript, prefer [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) over `innerHTML`; MDN notes that `innerHTML` deals with raw HTML and can be susceptible to XSS. The same cheat sheet warns that different places (HTML body, attributes, JavaScript, URLs) need different encodings, so in practice lean on your framework's automatic escaping rather than hand-rolling it.

## IDOR: swapping the id for someone else's

[OWASP's IDOR Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) says IDOR comes from missing access control checks, which fail to verify whether a user should be allowed to access specific data. It names three ingredients: an object (an account, document, order), a reference to it (an ID, filename, token), and a missing object-level authorization check.

Its own example is plain: a profile lives at `https://example.org/users/123`, an attacker changes 123 to 124 and sees another user's data, because the app never checked that the user may view 124.

Back to the second half of the output. Alice sends her own login cookie and asks for `/notes/2`, which is Bob's. The vulnerable server answers 200 with Bob's text, because it only checked "are you logged in," not "is this yours." Authentication and authorization are different questions: the first establishes who you are, the second decides what you may touch.

**Spotting IDOR:** find where an id from the request is used to fetch data, then ask "after this line, is the logged-in user compared with the record's owner?" In the example it is the `notes[id]` line.

**The fix is an ownership check on the server.** The fixed version returns 404 when `note.owner !== me`, and Alice can still read her own id=1. Returning 404 rather than 403 is one approach the [cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) mentions: if the existence of a resource is itself sensitive, return the same response for "missing" and "not allowed."

Two common misconceptions:

- **"Random ids make it safe."** The cheat sheet says complex identifiers such as GUIDs are a defense-in-depth measure, but access control checks are still essential, because if an attacker obtains a URL for someone else's object the app must still refuse.
- **"Do the check in the front end."** [OWASP Top 10:2025 A01, Broken Access Control](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/) (which lists IDOR under it) states that access control is only effective in trusted server-side code or serverless APIs, where the attacker cannot modify the check. The 2025 edition adds a scenario that fits exactly: an app that does all its access control in the front end, bypassed by calling the admin URL directly with curl. Put another way, requests come from a browser the user controls, so the server can't assume the id it receives is honest.

## Back to Google's reward table

In part 0 the table was a source for numbers. Now you can read the cells themselves. The figures below come from the rules page's reward table, which I viewed on 2026-10-13.

| Category | Example column on the rules page | T0 (Tier 0 domain or global impact) | T1 | T2 (normal Google apps, e.g. *.google.com) |
|---|---|---|---|---|
| C0 Execute code on the client | Web: Cross-site scripting; Mobile / Hardware: Code execution | 20,000 | 15,000 | 10,000 |
| S2a Logic flaw impacting Information Tier 0 or Critical Actions | Direct object reference, remote user impersonation | 50,000 | 50,000 | 31,337 |
| S2b Logic flaw impacting Information Tier 1 or Impactful Actions | Direct object reference, remote user impersonation | 31,337 | 31,337 | 13,337 |
| S2c Logic flaw impacting Information Tier 2 or Moderate Actions | Direct object reference, remote user impersonation | 7,500 | 5,000 | 3,133.7 |

Amounts are in US dollars. XSS maps to one row (C0), whose amount varies only with the domain tier. IDOR is split across three logic-flaw rows: the row is chosen by how sensitive the leaked or modified data is, and the domain tier still sets the amount within that row.

The rules page grades data sensitivity like this:

- Tier 0: credentials and data that can lead to account takeover, such as email contents, OAuth tokens, passwords.
- Tier 1: high-impact user data, such as Drive document contents, photos, private calendar events, payment information.
- Tier 2: metadata and lower-impact data, such as the titles of a few private documents, or an email address (unless meant to be public).

So the page's logic reads like this: an XSS is priced by which domain it is on, while an IDOR is priced by what it exposes and which domain it is on. On the same standard Google app, an IDOR touching Tier 0 data has a $31,337 base, over three times XSS's $10,000; an IDOR touching only Tier 2 data has a $3,133.7 base, lower than XSS.

The rules page gives one worked example of each:

| Example (paraphrased from the rules page) | Calculation | Amount |
|---|---|---|
| An IDOR on `*.google.com` that can exfiltrate a user's saved address (PII) | T2, S2b, quality 1x | $13,337 |
| An easy-to-exploit XSS affecting all pages translated to English via Google Translate (global impact tier) | T0, C0, quality 1x | $20,000 |

These two aren't directly comparable, since one is T2 and the other T0. My point is not to read the table as "IDOR always beats XSS." The page doesn't say that, and the table contains cells where IDOR pays less than XSS (Tier 2 data) and cells where it pays more (Tier 0 and Tier 1 data). What you can conclude is that the table prices IDOR by data sensitivity, so when the data is sensitive, an IDOR cell can exceed an XSS cell.

Two more notes. The final amount is multiplied by a report-quality factor (0.8, 1 or 1.2), may be downgraded for things like significant user interaction or required prior access, and is ultimately at the reward panel's discretion. The page also sets a testing rule: only target your own accounts, and never attempt to access anyone else's data.

## Limits

This is an intuition-building introduction, and the real world is messier.

- The example's XSS defense is a single layer. Real sites usually add a Content Security Policy (CSP), a way for the server to tell the browser which script sources may run; see [MDN's CSP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP). Both OWASP and MDN describe CSP as defense in depth, not a replacement for output escaping.
- The example puts input in one place only (HTML body text). OWASP's cheat sheet lists separate encoding rules for attributes, JavaScript, CSS and URLs, which this post doesn't cover.
- The example's IDOR check covers reading only. OWASP's cheat sheet says to verify read, create, update, delete, export and administrative actions.
- This post doesn't teach filter bypasses or how to attack real sites. Testing other people's sites without permission can be illegal; the rules page itself says to test only your own accounts.

## Where to practice legally

These three are practice resources I confirmed exist on their official pages; PortSwigger's page says outright that it is free. They exist so you can practice without touching a real site.

- [PortSwigger Web Security Academy](https://portswigger.net/web-security): per its official page, a free online web security training center with interactive labs. It says that without Burp Suite Professional you can experiment with the free Community Edition, and you need an account to track progress.
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/): described on its OWASP project page as an insecure web application for security training that contains OWASP Top 10 vulnerabilities.
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/): an OWASP training application; OWASP's XSS entry also mentions its lessons on cross-site scripting and data encoding.

Something to do tonight: save the `demo.mjs` above and run it once, then change the `/notes/2` request to another id and swap the `name` value for other text to see how the responses change. After that, pick one beginner lab each on XSS and access control from Juice Shop or PortSwigger. Next up is [What Is RCE](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce-en), the top row of the reward table.

## References

- [Google and Alphabet VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) (reward table, data sensitivity tiers, worked examples, testing rule)
- [OWASP: Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- [OWASP Cheat Sheet: Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet: Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [OWASP Top 10:2025 A01 Broken Access Control](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/)
- [MDN: Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [MDN: Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- This series: [Part 0: Fact-Checking Bug Bounty's Top Payouts](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en), [Part 2: How Websites Work](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work-en), [Part 4: What Is RCE](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce-en)
