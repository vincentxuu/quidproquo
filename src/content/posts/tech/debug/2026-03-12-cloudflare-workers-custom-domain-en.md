---
title: "The Correct Way to Bind a Custom Domain in Cloudflare Workers"
date: 2026-03-12
category: tech
tags: [cloudflare, workers, wrangler, dns]
lang: en
tldr: "In wrangler.jsonc, use custom_domain: true in routes with only the hostname as the pattern — no /* wildcard"
description: "A format pitfall when configuring custom domains in wrangler.jsonc: paths and wildcards are not allowed"
draft: false
type: debug
---

🌏 [中文版](/posts/tech/debug/2026-03-12-cloudflare-workers-custom-domain)

## TL;DR

In the `routes` config, set `pattern` to just the hostname — no `/*` — and pair it with `custom_domain: true`.

## Context

After deploying a blog to Cloudflare Workers, I wanted to bind `quidproquo.cc` to replace the default `*.workers.dev` URL.

## The Problem

I added the following to `wrangler.jsonc`:

```jsonc
"routes": [
  { "pattern": "quidproquo.cc/*", "custom_domain": true }
]
```

Running `wrangler deploy` threw an error:

```
Invalid Routes:
  quidproquo.cc/*:
  Wildcard operators (*) are not allowed in Custom Domains
  Paths are not allowed in Custom Domains
```

## The Fix

For a custom domain, the `pattern` should be just the hostname — no paths or wildcards:

```jsonc
"routes": [
  { "pattern": "quidproquo.cc", "custom_domain": true },
  { "pattern": "www.quidproquo.cc", "custom_domain": true }
]
```

After making this change, you need to run `astro build` again — the Cloudflare adapter copies the config into `dist/server/wrangler.json`, so running `wrangler deploy` directly will use the stale file from the previous build.

## Why This Happens

Custom domains and route patterns are two distinct mechanisms. A route pattern like `example.com/*` is for zone-based routing and performs path matching. A custom domain, on the other hand, points the entire hostname directly at a Worker — paths are neither needed nor permitted.

## What I Learned

When using `custom_domain: true`, the `pattern` is just the hostname. Adding a path breaks it. And any time you change `wrangler.jsonc`, you need to rebuild before deploying.

## References

- [Cloudflare Workers Custom Domains docs](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Cloudflare Workers Routes docs](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- [Wrangler configuration reference](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
