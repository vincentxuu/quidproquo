---
title: "Local AI Backend API Always Returns Empty Data: Cookie Domain Isolation"
date: 2026-04-19
type: debug
category: tech
tags: [cookie, cors, fastapi, nextjs, auth, local-dev, debug]
lang: en
tldr: "The main backend runs on a remote HTTPS server, so the auth_token cookie is scoped to that domain. The browser never sends it to the local AI backend, causing the API to treat every request as unauthenticated."
description: "During local development, the AI backend recommendation API always returned an empty array. The root cause was cookie domain isolation: auth_token was set by the remote server, so the browser never sent it to localhost."
draft: false
---

🌏 [中文版](/posts/tech/debug/2026-04-19-ai-backend-auth-cookie-cross-domain)

## TL;DR

The main backend runs on a remote HTTPS server (`server-dev.daodao.so`), so the `auth_token` cookie is bound to that domain. When the frontend calls the local AI backend (`localhost:8002`), the browser does not attach the cookie — regardless of `credentials: "include"` — causing the AI backend to treat every request as unauthenticated and return an empty array.

## Context

A front-end/back-end separated architecture with three services:

- Frontend: `http://localhost:3001`
- AI backend: `http://localhost:8002` (local)
- Main backend: `https://server-dev.daodao.so` (remote dev server)

While building the recommendation feature, I called `GET /api/v1/recommendation/topic_cards`. The database had data, the user was logged in, but the response was always:

```json
{ "success": true, "data": [] }
```

## The Problem

The API returned empty data with no errors, so my first instinct was that the database had no data or the query filters were too strict.

I dug into the AI backend's `recommendation.py`:

```python
if not user_id:
    return build_success_response(data=[])
```

`user_id` was `None`. Looking further into `dependencies.py`:

```python
def get_current_user(request: Request, ...):
    token = request.cookies.get("auth_token")
    if not token:
        return None
```

No `auth_token` cookie was present.

But in DevTools Network, requests to the main backend clearly showed `auth_token` being sent...

## Investigation

My initial guess was the `secure: true` flag in `cookie-config.ts` — since the local environment runs over HTTP, `secure` cookies wouldn't be stored. But looking more carefully, `auth_token` was indeed in the browser's cookie list; it just wasn't being sent to `localhost:8002`.

The frontend's `fetchAiBackend` had `credentials: "include"` set, which should attach cookies on cross-origin requests — but it had no effect.

## Root Cause & Fix

**Cookies are domain-scoped.**

`auth_token` is set by `server-dev.daodao.so` (over HTTPS) during login. The browser binds this cookie to that domain. When a request goes to `http://localhost:8002`, the browser will not include cookies that belong to `server-dev.daodao.so` — even with `credentials: "include"`.

## Why This Happens

The browser's cookie security model works as follows:

1. When a cookie is stored, it is associated with the `domain` of the server that set it (defaults to the host in the `Set-Cookie` response header)
2. `credentials: "include"` tells the browser: "include cookies that belong to the *target* domain on cross-origin requests"
3. But `auth_token`'s domain is `server-dev.daodao.so`, not `localhost`
4. So when making a request to `localhost:8002`, this cookie falls outside the scope of "cookies belonging to the target domain"

Requests to the same remote main backend work fine because the target domain matches the cookie's domain.

The full failure chain:

```
request → localhost:8002
→ fetchAiBackend: credentials: "include"
→ browser looks up cookies for localhost → auth_token not found
→ FastAPI get_current_user() → return None
→ if not user_id: return []
```

## Takeaway

`credentials: "include"` does not mean "send all cookies" — it means "send cookies that belong to this domain." When developing with multiple local services where auth cookies originate from different domains, you need to consider using a server-side proxy or unifying under a single domain.

---

## References

- [MDN - Using credentials with Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials)
- [MDN - Set-Cookie: Domain attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#domaindomain-value)
