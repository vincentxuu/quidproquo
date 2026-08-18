---
title: "@opennextjs/cloudflare: Running Next.js on Cloudflare Workers"
date: 2026-03-27
type: guide
category: tech
tags: [opennextjs, cloudflare-workers, nextjs, deployment]
lang: en
tldr: "@opennextjs/cloudflare enables Next.js App Router deployments on Cloudflare Workers — dynamic SSR runs in a Worker, static assets are served from Cloudflare Assets. Zero server management, but with clear feature limitations."
description: "How the @opennextjs/cloudflare adapter works: splitting Next.js SSR and static assets for deployment on Cloudflare's edge network. Real-world limitations and use cases illustrated with NobodyClimb."
draft: false
series:
  name: "The Cloudflare Edge Stack"
  order: 6
---

🌏 [中文版](/posts/tech/2026-03-27-opennextjs-cloudflare-adapter)

Cloudflare Workers runs on V8 isolates, not a standard Node.js environment. Next.js depends on several Node.js APIs (`fs`, `crypto`, `net`, `http`), so deploying directly to Workers doesn't work out of the box. `@opennextjs/cloudflare` is an adapter that transforms Next.js build output into a format that Cloudflare Workers can execute.

## Why This Adapter Exists

Vercel's Next.js hosting is purpose-built and offers the most complete feature support. If you want to deploy to Cloudflare instead, you have a few options:

1. **Static export (`next export`)**: Only works for static sites — no SSR, no API routes
2. **Self-hosted Node.js server**: Requires managing a server, losing the serverless advantage
3. **`@opennextjs/cloudflare`**: Runs Next.js SSR on the Cloudflare Workers runtime

Option three is what NobodyClimb uses.

One confusion worth clearing up first: `@opennextjs/cloudflare` runs Next.js's **Node.js runtime**, not the Edge runtime. That is the opposite of the older `@cloudflare/next-on-pages` it replaces, which only supported the Edge runtime. So when migrating, every `export const runtime = "edge";` in your code must be removed — **leaving them in breaks the build**.

Which Next.js versions and which features are supported is listed item by item on the official [Cloudflare overview page](https://opennext.js.org/cloudflare), and that is the first page to read.

## What It Does

For new projects, use the official scaffold:

```bash
npm create cloudflare@latest -- my-next-app --framework=next --platform=workers
```

Existing projects have a one-shot migration command:

```bash
npx @opennextjs/cloudflare migrate
```

It installs the package, generates `wrangler.jsonc` and `open-next.config.ts`, and rewrites the scripts. Day to day you then use the `opennextjs-cloudflare` CLI: `build` (which itself invokes the `build` script in your `package.json` to run `next build`), `preview` (run it locally in the Workers runtime), `deploy`, and `upload`.

After the transformation, the original Next.js output is split into two parts:

```
.open-next/
├── worker.js          # Cloudflare Worker: handles SSR and API routes
└── assets/            # Static assets: uploaded to Cloudflare Assets
```

**The Worker** handles:
- SSR for dynamic routes (parts of `page.tsx` that fetch async data)
- API routes (`route.ts`)
- Middleware (`middleware.ts`)

**Cloudflare Assets** handles:
- `_next/static/` (JS chunks, CSS)
- Static files from the `public/` directory
- Fully static pages (those using `generateStaticParams` with no dynamic data)

Static-asset caching needs a `public/_headers` file of your own marking `/_next/static/*` as `immutable`; without it every request goes back to origin.

When a request comes in, the Cloudflare edge node first determines whether it's for a static asset or a dynamic request. Static assets are served directly from Assets (near CDN speed); only dynamic requests go into the Worker for SSR.

## Configuration

`wrangler.jsonc` (Cloudflare's configuration file):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-nextjs-app",
  "main": ".open-next/worker.js",
  // Must be 2024-09-23 or later
  "compatibility_date": "2026-08-18",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    // The service must match the "name" above
    { "binding": "WORKER_SELF_REFERENCE", "service": "my-nextjs-app" }
  ],
  "images": {
    // Enables next/image optimization
    "binding": "IMAGES"
  }
}
```

Three fields people miss: `nodejs_compat` is the precondition for Next.js running at all; the `WORKER_SELF_REFERENCE` service binding is used internally by the adapter; and image optimization only exists if the `images` binding is declared. Do not change `main` or `assets` yourself.

`package.json` scripts:

```json
{
  "scripts": {
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  }
}
```

Note that `build` is plain `next build` — `opennextjs-cloudflare build` calls it for you, and chaining the two runs it twice.

## Accessing Cloudflare Bindings

The function for reaching bindings (D1, KV, R2) is `getCloudflareContext()`, imported from `@opennextjs/cloudflare`:

```typescript
// app/api/posts/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const { env, cf, ctx } = getCloudflareContext();

  // Query with D1
  const result = await env.DB.prepare(
    "SELECT * FROM posts ORDER BY created_at DESC LIMIT 10"
  ).all();

  return Response.json(result.results);
}
```

> The `getRequestContext()` seen in older tutorials comes from `@cloudflare/next-on-pages` — a **different adapter**. It does not exist in `@opennextjs/cloudflare`, and copying it over breaks outright.

Inside SSG routes (generated at build time) it must be called in async mode: `await getCloudflareContext({ async: true })`. Be aware that this reads **locally simulated binding values and secrets from `.dev.vars`**, not production data — unless you have enabled remote bindings.

Besides `env`, the same return value carries `cf` (request geo and connection info) and `ctx` (lifecycle methods such as `waitUntil`). Generate the types with `wrangler types --env-interface CloudflareEnv`.

This lets Next.js API routes use Cloudflare's infrastructure directly, without setting up a separate database connection. NobodyClimb uses a standalone Hono API (also running on Workers), but the Next.js frontend accesses KV cache and other resources through the same mechanism.

## Role in NobodyClimb

NobodyClimb's web frontend is built with Next.js 15 App Router and deployed to Cloudflare Workers via `@opennextjs/cloudflare`. The entire system runs on Cloudflare's infrastructure:

```
Browser Request
    │
    ▼
Cloudflare Edge Node
    ├── Static assets → Cloudflare Assets (direct response)
    └── Dynamic requests → Worker (Next.js SSR)
                    │
                    ├── D1 (SQLite database)
                    ├── KV (cache)
                    └── HTTP → Hono API Worker
```

This architecture means NobodyClimb requires zero server management — no EC2, no RDS, no load balancer configuration.

## Known Limitations

This adapter isn't a silver bullet. It has well-defined constraints:

**Genuinely unsupported:**
- **The Edge runtime**: every `export const runtime = "edge";` must be removed
- **Node Middleware**, introduced in Next.js 15.2, is not yet supported

**Supported, but frequently written up as unsupported in older posts:**
- `next/image` optimization — via the `IMAGES` binding (backed by Cloudflare Images) or a custom loader. A few compatibility gaps are worth knowing: only PNG, JPEG, WEBP, AVIF, GIF, and SVG are handled, and anything else is returned unchanged; the `minimumCacheTTL` setting has no effect; and image optimization [can incur additional cost](https://opennext.js.org/cloudflare/howtos/image)
- **ISR, `'use cache'`, PPR, and `after`** are all on the supported list, but they require an incremental cache (R2 is the documented default). Without one there is no cross-request caching

**Workers runtime constraints:**
- CPU time: 10 ms per request on the free plan; on paid, 30 seconds by default with a 5-minute ceiling. SSR-heavy pages hit the free-plan limit easily
- 128 MB of memory (the old "Bundled" and "Unbound" plan names are retired — do not configure against older write-ups)
- See [Workers limits](/posts/tech/2026-03-27-cloudflare-workers-edge-compute-en)

**You do not have to give up `next dev` locally.**
Call `initOpenNextCloudflareForDev()` in `next.config.ts` and bindings are available under `next dev` too:

```typescript
// next.config.ts
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

export default { /* ... */ };
```

Use `next dev` for everyday work (fast, hot reload) and `npm run preview` when you need to verify real Workers-runtime behaviour. Bindings default to local simulation; to hit real Cloudflare resources, set `remote` to `true` on that binding (remote bindings stabilized in wrangler 4.36.0).

## When to Use It (and When Not To)

**Good fit:**
- You want zero infrastructure management and can work within Cloudflare's ecosystem constraints
- The project has moderate dynamic request volume and no long-running computations
- You're already using other Cloudflare services (D1, R2, KV, Workers AI)

**Not a good fit:**
- Your code still leans heavily on the Edge runtime and you have no plan to move off it
- Your project has complex native Node.js dependencies (not all npm packages run in Workers)
- CPU-intensive SSR, with no intention of moving to a paid plan

For a community platform like NobodyClimb — moderate traffic, everything on Cloudflare — the tradeoff makes sense.

## Tradeoff Summary

| | @opennextjs/cloudflare | Vercel | Self-hosted Node.js |
|--|--|--|--|
| Infra management | None | None | Required |
| Next.js feature completeness | Partial limitations | Most complete | Full (depends on Node.js version) |
| Pricing model | Per-request | Usage/seat-based | Per server-hour |
| Cold starts | Very low (edge) | Low | None (always-on) |
| Suitable scale | Small to medium | Small to large | Medium to large |

## References

- [@opennextjs/cloudflare Official Docs](https://opennext.js.org/cloudflare) — supported Next.js versions and feature list
- [Get Started (includes the wrangler config template)](https://opennext.js.org/cloudflare/get-started)
- [Accessing bindings: `getCloudflareContext`](https://opennext.js.org/cloudflare/bindings)
- [Image optimization setup and compatibility gaps](https://opennext.js.org/cloudflare/howtos/image)
- [OpenNext Project](https://opennext.js.org/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Migrating from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [NobodyClimb: Building a Climbing Community Platform on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en) — NobodyClimb's full Cloudflare architecture and real-world usage of @opennextjs/cloudflare
