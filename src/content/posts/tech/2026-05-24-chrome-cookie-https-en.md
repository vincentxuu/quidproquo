---
title: "Mobile Chrome Redirects Back to Login After Sign-In: Debugging an HTTP-to-HTTPS Entry Point Issue"
date: 2026-05-24
category: tech
type: debug
tags: [cloudflare, debugging, cookie, chrome, nextjs, auth]
lang: en
tldr: "When mobile Chrome keeps redirecting back to the login page after sign-in, the culprit isn't always OAuth or broken frontend state. In this case, the root cause was that the HTTP entry point for app-dev.daodao.so wasn't issuing a 301 redirect to HTTPS, so /auth/me requests sent with an http origin didn't include the auth_token cookie."
description: "A walkthrough of debugging a mobile Chrome login loop: tracing backend auth logs, Origin/Referer headers, Set-Cookie behavior, and /auth/me 401s — ultimately tracing the issue to Cloudflare's Always Use HTTPS not being enabled."
draft: false
---

🌏 [中文版](/posts/tech/2026-05-24-chrome-cookie-https)

## TL;DR

When mobile Chrome redirects back to the login page after signing in, the issue isn't necessarily OAuth or broken frontend state. In this case, the root cause was that the HTTP entry point for `app-dev.daodao.so` wasn't issuing a 301 redirect to HTTPS, so `/auth/me` requests sent with an `http` origin didn't include the `auth_token` cookie.

## Context

The problem occurred in a dev environment. Users reported that after signing in on mobile Chrome, they were immediately redirected back to the login page. Safari appeared to work fine.

The system setup:

- Frontend: Next.js product app deployed at `app-dev.daodao.so`
- Backend: Express API deployed at `server-dev.daodao.so`
- Auth: Google OAuth callback handled by the backend, which sets an `auth_token` cookie and redirects back to the frontend
- Auth state check: frontend calls `/api/v1/auth/me`

This kind of issue often leads you to suspect the frontend route guard first — that the auth state hasn't refreshed after the OAuth callback, causing the client-side guard to treat the user as unauthenticated. But the real clue this time was in the request headers.

## The Problem

After signing in on mobile Chrome, the user was redirected back to the login page. The backend was returning 401 for `/api/v1/auth/me`:

```json
{
  "method": "GET",
  "url": "/api/v1/auth/me",
  "message": "Missing authentication token"
}
```

This meant the backend wasn't receiving a usable token. There were at least three possible causes:

- The OAuth callback didn't set `Set-Cookie`
- The browser received the cookie but didn't send it on subsequent requests
- The request was coming from a different origin or protocol, causing the cookie rules not to apply

Since Safari worked but Chrome didn't, I focused on cookies, secure context, `Origin`/`Referer`, and CORS.

## Investigation

I added two diagnostic log statements to the backend.

The first goes right after the OAuth callback sets the cookie, logging only environment context — no token values:

```ts
const setCookieHeader = res.getHeader("Set-Cookie");
loggerService.info("OAuth callback set auth cookie", {
  userAgent: req.get("User-Agent"),
  origin: req.get("Origin"),
  referer: req.get("Referer"),
  host: req.get("Host"),
  forwardedProto: req.get("X-Forwarded-Proto"),
  frontendUrl,
  cookieDomain: process.env.COOKIE_DOMAIN,
  redirectTarget,
  setCookieHeaderCount: Array.isArray(setCookieHeader) ? setCookieHeader.length : setCookieHeader ? 1 : 0,
});
```

The second goes in the `/auth/me` handler when the token is missing — again, only cookie names and boolean flags, no token values:

```ts
loggerService.warn("Auth me missing token", {
  userAgent: req.get("User-Agent"),
  origin: req.get("Origin"),
  referer: req.get("Referer"),
  host: req.get("Host"),
  forwardedProto: req.get("X-Forwarded-Proto"),
  cookieDomain: process.env.COOKIE_DOMAIN,
  cookieNames: Object.keys(req.cookies ?? {}),
  hasAuthTokenCookie: Boolean(req.cookies?.auth_token),
  hasAuthorizationHeader: Boolean(req.get("Authorization")),
  secFetchSite: req.get("Sec-Fetch-Site"),
  secFetchMode: req.get("Sec-Fetch-Mode"),
  secFetchDest: req.get("Sec-Fetch-Dest"),
});
```

The new logs quickly pointed to the anomaly:

```json
{
  "message": "Auth me missing token",
  "origin": "http://app-dev.daodao.so",
  "referer": "http://app-dev.daodao.so/",
  "host": "server-dev.daodao.so",
  "cookieDomain": ".daodao.so",
  "cookieNames": ["_ga", "_ga_52MHR7GXYH", "ph_phc_...", "_clck"],
  "hasAuthTokenCookie": false,
  "secFetchSite": "cross-site"
}
```

Two key observations:

1. The backend received `Origin` / `Referer` as `http://app-dev.daodao.so`.
2. No `auth_token` in the cookie jar.

But later in the same login flow, the OAuth callback had successfully set the cookie:

```json
{
  "message": "OAuth callback set auth cookie",
  "frontendUrl": "https://app-dev.daodao.so",
  "cookieDomain": ".daodao.so",
  "redirectTarget": "https://app-dev.daodao.so/auth/callback?...",
  "setCookieHeaderCount": 1
}
```

And the `/api/v1/auth/me` call following the callback returned 200. That meant OAuth itself wasn't broken — the cookie worked fine after the HTTPS callback.

Next, I tested the HTTP entry point directly:

```bash
curl -I -L http://app-dev.daodao.so
```

Before the fix, Cloudflare returned 200 directly:

```http
HTTP/1.1 200 OK
Server: cloudflare
link: <http://app-dev.daodao.so/>; rel="alternate"; hreflang="zh-TW"
```

If HTTP were being forced to HTTPS, this should have been a 301 or 302 with a `Location` pointing to `https://app-dev.daodao.so/`. It wasn't.

## The Fix

Enable `Always Use HTTPS` for `daodao.so` in Cloudflare.

Steps in the Cloudflare dashboard:

1. Open Cloudflare Dashboard
2. Select `daodao.so`
3. Go to `SSL/TLS`
4. Go to `Edge Certificates`
5. Enable `Always Use HTTPS`

After the fix, testing again:

```bash
curl -I http://app-dev.daodao.so
```

Now returns:

```http
HTTP/1.1 301 Moved Permanently
Location: https://app-dev.daodao.so/
Server: cloudflare
```

Signing in again on mobile Chrome worked normally.

## Why This Happens

Cloudflare proxying your traffic does not mean HTTP entry points are automatically redirected to HTTPS.

In this case, `http://app-dev.daodao.so` was returning 200, so browsers could — and did, in certain situations — send requests with an HTTP origin. For auth cookies, this is a recipe for trouble:

- `auth_token` is a secure, cross-subdomain cookie.
- `SameSite=None` cookies require `Secure`, which means they only apply over HTTPS.
- When the frontend makes a request with `http://app-dev.daodao.so` as its origin, Chrome applies different security context and site classification rules.
- The backend saw `secFetchSite: "cross-site"` and received no `auth_token`.

MDN's documentation on `Set-Cookie` notes that `SameSite=None` must be paired with `Secure`. The MDN `Request.credentials` docs also warn that whether the browser sends credentials and whether it honors `Set-Cookie` depends on the request credentials configuration. Even when all those conditions are met correctly, you still need to make sure the page itself isn't issuing requests from an HTTP origin.

So this wasn't "mobile Chrome doesn't support login" or "the OAuth callback didn't set the cookie." The real issue was that the HTTP entry point was still alive, causing some requests to originate from the wrong protocol.

## Takeaways

Don't just check "is the cookie there?" when debugging login issues. Also look at:

- Whether the OAuth callback returned `Set-Cookie`
- Whether the `/auth/me` request included `auth_token`
- Whether `Origin` / `Referer` is `http` or `https`
- Whether `Sec-Fetch-Site` is `same-site` or `cross-site`
- Whether the Cloudflare HTTP entry point actually issues a 301 to HTTPS

In short: **running a service behind Cloudflare does not mean the HTTP entry point is closed. Redirecting HTTP to HTTPS should be a basic acceptance criterion for any authentication system.**

## References

- [Cloudflare Docs: Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [MDN: Set-Cookie — Secure attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure)
- [MDN: Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
- [Chrome cookie behavior: Secure cookies on HTTPS only](https://developer.chrome.com/blog/cookie-max-age-expires/)
- [MDN: HTTP to HTTPS redirect and cookie security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
