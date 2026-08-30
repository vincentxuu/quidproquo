---
title: "Cloudflare Cache Rules: What to Cache and What Must Stay Dynamic"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-cache-rules, cdn, caching, edge-computing, performance]
lang: en
tldr: "Cloudflare Cache Rules are zone-level cache policy: request expressions decide what is eligible for cache, how Edge TTL and Browser TTL behave, what dimensions enter the cache key, and how stale content, ETags, and purge interact. Use them for CDN cache policy; use the Worker Cache API for programmatic caching."
description: "A practical guide to Cloudflare Cache Rules: default cache behavior, cache eligibility, Edge TTL, Browser TTL, custom cache keys, CF-Cache-Status, Rulesets API, Terraform, and Cloudflare Trace."
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 11
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-cache-rules-edge-cache-policy)

Cloudflare caching is often reduced to "turn on the CDN." In a real product, the hard question is more specific: which responses can enter shared cache, which must remain dynamic, whether TTL should come from the origin or the platform, and whether a purge can precisely remove the cached object.

[Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) is the tool for that layer. In the zone Ruleset Engine, it configures cache eligibility, Edge TTL, Browser TTL, cache keys, Cache Reserve eligibility, stale behavior, strong ETag handling, and other cache policy for matching requests. It is not the Worker `caches.default` API, and it is not Smart Shield. Cache Rules answers: should this URL be cached by Cloudflare, and under which policy?

```txt
Browser
  |
  v
Cloudflare Ruleset Engine
  |
  +-- Cache Rules: eligibility, TTL, cache key, stale, ETag
  |
  v
Cloudflare cache
  |
  v
Origin / Worker / R2-backed app
```

## Start With Default Behavior

Without custom rules, Cloudflare mainly uses file extensions, HTTP method, and origin response headers to decide cache behavior. Several documented defaults matter in product code:

- Only `GET` requests are cacheable; other HTTP methods are not.
- `Cache-Control: private`, `no-store`, `no-cache`, or `max-age=0` usually keeps a resource out of cache, with details affected by Origin Cache Control.
- A response with `Set-Cookie` is not treated like normal public cache by default.
- Cloudflare caches static assets by extension. HTML and JSON are not admitted to CDN cache by MIME type alone.
- Without cache headers, some status codes receive default Edge TTLs, including successful responses and some redirects or not-found responses.

So the first use of Cache Rules is not "cache everything." It is to turn vague defaults into explicit policy. Static assets can be cached aggressively. Logged-in pages, personalized APIs, and cookie-bearing responses should be bypassed first.

## What Cache Rules Control

A Cache Rule has two parts: a match expression and action parameters.

Match expressions can look at URL, path, query string, cookie, hostname, referer, SSL, user agent, X-Forwarded-For, request headers, and file extension. Through the API, Cache Rules are deployed to the `http_request_cache_settings` phase with the `set_cache_settings` action.

```jsonc
{
  "expression": "(starts_with(http.request.uri.path, \"/assets/\"))",
  "description": "cache immutable build assets",
  "action": "set_cache_settings",
  "action_parameters": {
    "cache": true,
    "edge_ttl": {
      "mode": "override_origin",
      "default": 31536000
    },
    "browser_ttl": {
      "mode": "override_origin",
      "default": 31536000
    }
  }
}
```

Common settings fall into a few groups:

- **Cache eligibility**: whether a match bypasses cache or becomes eligible for cache.
- **Edge TTL**: how long Cloudflare keeps the response at the edge; it can respect origin, override origin, or bypass when headers are missing.
- **Browser TTL**: how long user browsers keep the response; this is separate from Cloudflare edge cache.
- **Cache Key**: which request dimensions define one cached object, such as query string, device type, headers, cookies, host, country, and language.
- **Serve stale**: whether Cloudflare can serve stale content while updating from origin.
- **Respect Strong ETags**: whether Cloudflare uses strong ETag validation for byte-for-byte revalidation.

I treat Cache Rules as production policy rather than a temporary optimization. Once rules multiply, order, naming, and tests matter more than the exact TTL number.

## Edge TTL and Browser TTL Are Different

Edge TTL controls Cloudflare cache. Browser TTL controls the user's browser cache. Keep them separate.

For hashed build assets such as `/assets/app.4f3a9c.js`, long edge and browser TTLs are reasonable. The filename changes on deployment, so old cached files do not contaminate the new page.

For HTML, be conservative. A public marketing page may tolerate a few minutes of edge cache while keeping browser TTL short or origin-controlled. A logged-in dashboard should bypass cache.

For APIs, start with data semantics. Public, non-personal, low-change read APIs can be cached. Session-specific, authorization-bearing, cookie-based, or per-user responses should not enter shared cache.

```txt
/assets/*        edge: 1 year, browser: 1 year
/blog/*          edge: minutes to hours, browser: short or origin-controlled
/api/public/*    edge: short, cache key includes real variants
/api/me/*        bypass
/admin/*         bypass
```

The common failure modes are long browser TTL on HTML, or overriding origin headers and accidentally bypassing the original `private` / `no-store` protection around personalized content.

## Cache Keys Should Stay Small

The cache key decides which requests share one response. The default key is close to the URL. Cache Rules can include query strings, headers, cookies, host, device type, geography, and language.

Adding dimensions has a cost. Add `Accept-Language`, and languages split. Add device type, and mobile and desktop split. Add cookies, and hit rate can collapse. Purge also becomes harder.

Cloudflare's docs call out a practical consequence: when a custom cache key includes headers, cookies, or other request properties, dashboard single-file purge may not work because the dashboard purge request cannot supply those values. In that case, use API purge by URL with the full key dimensions, or purge by host, prefix, tag, or everything.

I use this order:

1. Is the URL path already unique? If yes, leave the cache key alone.
2. Are query strings only tracking parameters? Ignore them or include only parameters that change the body.
3. Does a header or cookie truly change the response body? If not, keep it out of the key.
4. Once a dimension enters the key, design purge at the same time.

The cache key is a correctness boundary, not just a performance knob.

## Write Bypass First

In practice, Cache Rules should start with bypass rules, then eligible rules. Protect what must never be shared before widening cache coverage.

I would begin with these bypass rules:

- `/admin/*`
- `/api/me/*`
- `/api/auth/*`
- any endpoint returning personal data, permission data, or one-time tokens
- pages with session cookies unless the response is explicitly public
- preview, draft, and staging paths

Then add cacheable paths:

- hashed static assets
- public blog posts
- images and downloadable public files
- public metadata endpoints
- OG image or screenshot artifacts, if the URL key is stable

If the origin already returns correct `Cache-Control`, let Cache Rules respect origin. Use Edge TTL override when the origin is hard to change, such as a third-party origin, legacy app, or framework default that does not match the product policy.

## Read CF-Cache-Status

Cache issues should be debugged from response headers. `CF-Cache-Status` tells you how Cloudflare handled the request:

- `HIT`: cache hit.
- `MISS`: eligible for cache, but not present at request time.
- `BYPASS`: initially eligible, but origin response headers or conditions prevented storage.
- `DYNAMIC`: not eligible at request time, so no cache lookup happened.
- `EXPIRED` / `REVALIDATED` / `STALE` / `UPDATING`: expired, revalidated, or stale-related paths.

`BYPASS` and `DYNAMIC` are easy to confuse. `DYNAMIC` usually means the request was never eligible, such as HTML or JSON without a rule, or a matching bypass rule. `BYPASS` usually means the request was eligible, but the response was blocked by `no-store`, `private`, `Set-Cookie`, size limits, or `Authorization` conditions.

When tuning rules, I hit the same URL twice:

```bash
curl -I https://example.com/blog/post
curl -I https://example.com/blog/post
```

The first request may be `MISS`; the second should become `HIT`. If it stays `DYNAMIC`, inspect rule matching. If it stays `BYPASS`, inspect origin response headers.

## Use Trace for Rules, Logs for Reality

[Cloudflare Trace](https://developers.cloudflare.com/rules/trace-request/) simulates an HTTP/S request and shows how rules, caching, and security settings would apply. It is useful for questions like: why did this Cache Rule not match, does this cookie or query string hit bypass, and is rule order wrong?

Trace is a simulation, not production traffic. For historical traffic, error rates, performance trends, or a specific real request, use Log Explorer, Workers logs, Analytics, or origin logs.

My rollout checklist is:

1. Add the rule to a staging host or narrow path.
2. Use Trace to verify the match expression.
3. Use curl or browser devtools to inspect `CF-Cache-Status` and `Age`.
4. Confirm the purge strategy.
5. Expand to the full path or hostname.

## Cache Rules, Worker Cache API, and Smart Shield

These three often get mixed together.

Cache Rules is zone-level policy. Use it to control how path, hostname, query, cookie, and header conditions affect Cloudflare CDN cache. It runs at the platform layer and can be reviewed, managed through API, or managed with Terraform.

The [Workers Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/) is a code-level tool. A Worker can use `caches.default` or `caches.open()` to store and retrieve responses. It fits generated cache entries, modified response headers before `cache.put()`, and local deletions. Cloudflare's docs note that the Cache API is data center-local and does not support Tiered Cache. If a Worker is middleware calling an origin with `fetch()`, using `fetch` with platform cache settings is often smoother.

Smart Shield is origin protection. Cache Rules decides which content should be cached and how. Smart Shield belongs to the next layer: reducing origin pressure during spikes, misses, revalidation, tiered cache paths, and origin load. This post keeps the Cache Rules boundary clear instead of front-loading Smart Shield.

## Launch Checklist

I would check Cache Rules against this list:

- Bypass comes first: admin, auth, per-user API, preview, and sensitive cookie paths.
- Static assets get long TTL only when filenames are hashed.
- HTML browser TTL stays conservative, so users do not keep stale pages for too long.
- APIs are cached only when responses are public, shareable, and stale-tolerant.
- Cache key dimensions are limited to values that actually change the response body.
- Custom cache keys include a purge strategy by URL/header, prefix, host, or tag.
- `BYPASS` and `DYNAMIC` are debugged separately.
- Cloudflare Trace and `CF-Cache-Status` are checked before production rollout.
- API or Terraform management avoids copying PUT examples that replace the whole existing ruleset.

The value of Cache Rules is not caching as much as possible. It is turning shared cache into reviewable platform policy. Put shareable content at the edge, bypass content that must stay dynamic, and design cache keys together with purge. Then Cloudflare is reducing origin cost instead of preserving the wrong response.

## References

- [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)
- [Available Cache Rules settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/)
- [Cache Rules examples](https://developers.cloudflare.com/cache/how-to/cache-rules/examples/)
- [Create a cache rule via API](https://developers.cloudflare.com/cache/how-to/cache-rules/create-api/)
- [Cache Rules Terraform example](https://developers.cloudflare.com/cache/how-to/cache-rules/terraform-example/)
- [Default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/)
- [Origin Cache Control](https://developers.cloudflare.com/cache/concepts/cache-control/)
- [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/)
- [How Workers interacts with Cloudflare cache](https://developers.cloudflare.com/workers/reference/how-the-cache-works/)
- [Cloudflare Trace](https://developers.cloudflare.com/rules/trace-request/)
