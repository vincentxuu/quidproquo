---
title: "Astro + Cloudflare Workers: Native Modules Break the Build Even on Prerendered Routes"
date: 2026-03-13
category: tech
tags: [astro, cloudflare, workers]
lang: en
tldr: "Even when a route has prerender = true, Cloudflare Workers' Rollup bundler still attempts to bundle native modules, causing the build to fail. The fix is to move any native module work into a postbuild script."
description: "A debug log of OG image generation failures with @resvg/resvg-js in an Astro + Cloudflare Workers setup, and how switching to a postbuild script solved the problem."
draft: false
type: debug
---

> 🌏 [中文版](/posts/tech/debug/2026-03-13-astro-cloudflare-native-module)

## TL;DR

Cloudflare Workers does not support native Node.js modules (`.node` binaries). Even if a route has `prerender = true`, importing a native module anywhere in the module graph will cause the entire build to fail. The fix is to move all native module work completely out of Astro and into a postbuild script.

## Context

I wanted to add OG image generation to my blog — using Satori to produce SVG and `@resvg/resvg-js` to convert it to PNG — implemented as a prerendered route:

```typescript
// src/pages/og/[slug].png.ts
export const prerender = true;

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export async function getStaticPaths() { /* ... */ }

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(/* ... */);
  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
```

## The Problem

```
[commonjs--resolver] resvgjs.darwin-arm64.node (1:0):
Unexpected character '■'
Note that you need plugins to import files that are not JavaScript
```

The build fails outright during the `[build] Building server entrypoints...` phase.

## What I Tried

First, I tried `vite.ssr.external: ['@resvg/resvg-js']`. No effect.

Then I added a Vite plugin to stub out `.node` files:

```js
{
  name: 'handle-native-modules',
  load(id) {
    if (id.endsWith('.node')) return 'module.exports = {};';
  },
}
```

The build passed, but then the prerender phase threw a 500 error — because Resvg had been stubbed to an empty object, `new Resvg()` blew up immediately.

## Why This Happens

The Astro + Cloudflare adapter build has two distinct phases:

1. **Worker bundle**: Rollup bundles all server-side code, preparing it for deployment to Cloudflare Workers.
2. **Static generation**: Prerendered routes are executed in a Node.js environment to produce static files.

Even though the route is marked `prerender = true`, Rollup still pulls all imported modules into the module graph during phase one. `@resvg/resvg-js` uses `require()` to load a `.node` binary at runtime, and Rollup follows that `require()` call, attempts to parse the binary, and crashes.

To make matters worse, the Cloudflare adapter's prerender execution environment also runs through the bundled server — so even after stubbing the native module, the prerender phase still can't use it.

## The Fix

Move OG image generation entirely out of Astro and into a standalone postbuild script:

```js
// scripts/generate-og-images.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Read src/content/posts/**/*.md
// Generate PNG → dist/client/og/[category]/[slug].png
```

```json
// package.json
"build": "astro build && node scripts/generate-og-images.mjs"
```

Move `satori` and `@resvg/resvg-js` to `devDependencies` so they never enter the production bundle.

## Key Takeaway

Any work that requires native modules belongs in a build script — not in Astro's module graph. The moment you import a native module, regardless of whether the route is prerendered, the Cloudflare Workers bundler will attempt to include it and fail.

## References

- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Satori - Enlightened library to convert HTML and CSS to SVG](https://github.com/vercel/satori)
- [@resvg/resvg-js GitHub](https://github.com/nicolo-ribaudo/resvg-js)
- [Cloudflare Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
