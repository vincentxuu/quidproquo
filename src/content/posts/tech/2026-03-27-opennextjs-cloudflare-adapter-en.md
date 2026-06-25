---
title: "@opennextjs/cloudflare: Running Next.js on Cloudflare Workers"
date: 2026-03-27
type: guide
category: tech
tags: [opennextjs, cloudflare-workers, nextjs, deployment]
lang: en
tldr: "@opennextjs/cloudflare enables Next.js 15 App Router deployments on Cloudflare Workers — dynamic SSR runs in a Worker, static assets are served from Cloudflare Assets. Zero server management, but with clear feature limitations."
description: "How the @opennextjs/cloudflare adapter works: splitting Next.js SSR and static assets for deployment on Cloudflare's edge network. Real-world limitations and use cases illustrated with NobodyClimb."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-opennextjs-cloudflare-adapter)

Cloudflare Workers runs on V8 isolates, not a standard Node.js environment. Next.js depends on several Node.js APIs (`fs`, `crypto`, `net`, `http`), so deploying directly to Workers doesn't work out of the box. `@opennextjs/cloudflare` is an adapter that transforms Next.js build output into a format that Cloudflare Workers can execute.

## Why This Adapter Exists

Vercel's Next.js hosting is purpose-built and offers the most complete feature support. If you want to deploy to Cloudflare instead, you have a few options:

1. **Static export (`next export`)**: Only works for static sites — no SSR, no API routes
2. **Self-hosted Node.js server**: Requires managing a server, losing the serverless advantage
3. **`@opennextjs/cloudflare`**: Runs Next.js SSR on the Cloudflare Workers runtime

Option three is what NobodyClimb uses.

## What It Does

The build process:

```bash
# First run the standard Next.js build
next build

# Then transform the output with the adapter
npx @opennextjs/cloudflare build
```

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

When a request comes in, the Cloudflare edge node first determines whether it's for a static asset or a dynamic request. Static assets are served directly from Assets (near CDN speed); only dynamic requests go into the Worker for SSR.

## Configuration

`wrangler.jsonc` (Cloudflare's configuration file):

```jsonc
{
  "name": "my-nextjs-app",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-11-18",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "your-kv-namespace-id"
    }
  ]
}
```

The `nodejs_compat` flag enables partial Node.js API support in Workers — this is the key that makes Next.js run.

`package.json` scripts:

```json
{
  "scripts": {
    "build": "next build && npx @opennextjs/cloudflare build",
    "deploy": "npm run build && wrangler deploy",
    "preview": "npm run build && wrangler dev"
  }
}
```

## Accessing Cloudflare Bindings

In the Workers environment, you can access Cloudflare bindings (D1, KV, R2) via `getRequestContext()`:

```typescript
// app/api/posts/route.ts
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function GET() {
  const { env } = getRequestContext();

  // Query with D1
  const result = await env.DB.prepare(
    "SELECT * FROM posts ORDER BY created_at DESC LIMIT 10"
  ).all();

  return Response.json(result.results);
}
```

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

**Unsupported Next.js features:**
- `next/image` image optimization (requires Node.js, not supported in the Workers environment)
- Some server-side `next/font` functionality
- Full Incremental Static Regeneration (ISR) support (limited)

**Workers runtime constraints:**
- CPU time limit: Free plan allows up to 10ms CPU time per request; paid plans allow 30ms
- Memory limit: 128MB (Bundled); larger workloads require Unbound pricing
- No long-running tasks (requests that exceed 30 seconds will time out)

**`getRequestContext()` only works in the Workers environment:**
- For local development, use `wrangler dev` instead of `next dev` — otherwise `getRequestContext()` will throw an error

In practice, your `package.json` will likely need:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:worker": "npm run build && wrangler dev"
  }
}
```

Use `next dev` for everyday development (fast, hot reload) and `wrangler dev` when testing Workers-specific behavior.

## When to Use It (and When Not To)

**Good fit:**
- You want zero infrastructure management and can work within Cloudflare's ecosystem constraints
- The project has moderate dynamic request volume and no long-running computations
- You're already using other Cloudflare services (D1, R2, KV, Workers AI)

**Not a good fit:**
- You need `next/image` optimization (consider Vercel or self-hosting)
- Your project has complex Node.js dependencies (not all npm packages run in Workers)
- CPU-intensive SSR (Workers' CPU time limits are strict)
- Large content sites that require full ISR support

For a community platform like NobodyClimb — moderate traffic, no complex image processing needs, everything on Cloudflare — the tradeoff makes sense. But if your Next.js app relies heavily on `next/image` or has pages with long SSR runtimes, this adapter will introduce additional friction.

## Tradeoff Summary

| | @opennextjs/cloudflare | Vercel | Self-hosted Node.js |
|--|--|--|--|
| Infra management | None | None | Required |
| Next.js feature completeness | Partial limitations | Most complete | Full (depends on Node.js version) |
| Pricing model | Per-request | Usage/seat-based | Per server-hour |
| Cold starts | Very low (edge) | Low | None (always-on) |
| Suitable scale | Small to medium | Small to large | Medium to large |

## References

- [@opennextjs/cloudflare Official Docs](https://opennext.js.org/cloudflare)
- [OpenNext Project](https://opennext.js.org/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages vs Workers](https://developers.cloudflare.com/workers/platform/deployments/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [NobodyClimb: Building a Climbing Community Platform on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — NobodyClimb's full Cloudflare architecture and real-world usage of @opennextjs/cloudflare
