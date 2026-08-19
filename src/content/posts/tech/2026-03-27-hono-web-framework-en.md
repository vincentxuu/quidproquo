---
title: "Hono: The Lightweight Web Framework Built for Edge Runtimes"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [hono, cloudflare-workers, edge, web-framework]
lang: en
tldr: "Hono is a web framework designed specifically for edge runtimes like Cloudflare Workers, Deno, and Bun. It's an order of magnitude lighter than Express, natively supports Web Standard APIs, and is the go-to choice for edge environments."
description: "An introduction to Hono, the lightweight web framework: why it's a better fit than Express on edge runtimes, its core design philosophy, code examples, and when you should — or shouldn't — reach for it."
draft: false
series:
  name: "The Cloudflare Edge Stack"
  order: 5
---

🌏 [中文版](/posts/tech/2026-03-27-hono-web-framework)

Express has dominated Node.js for over a decade, but running Express on Cloudflare Workers was a mistake from the start. Workers execute inside V8 Isolates, not a Node.js environment — Express's heavy reliance on Node.js APIs simply won't run. Hono was built to solve exactly this problem.

## What It Is

Hono is an ultra-lightweight web framework designed to run on any JavaScript runtime:

- Cloudflare Workers
- Deno
- Bun
- Node.js (supported, but not its primary target)
- AWS Lambda

The number the project actually publishes is **under 14 kB minified for the `hono/tiny` preset** — not for all of Hono; middleware and adapters are bundled only when used. Zero dependencies, written entirely with Web Standard APIs (`Request`, `Response`, `URL`).

NobodyClimb's backend is built with Hono and deployed on Cloudflare Workers. The reason for choosing it was straightforward: no other framework offered the same developer experience and feature completeness on Cloudflare Workers.

## Why Not Express

The problem with Express isn't its API design — it's that Express assumes Node.js exists:

- `req.socket`, `res.end()`, `Buffer` are all Node.js-only APIs
- Bundle size eats a meaningful share of the Workers [script size limit](https://developers.cloudflare.com/workers/platform/limits/) (different ceilings on free and paid: 3 MB / 10 MB compressed, plus a 64 MB uncompressed ceiling shared by both)
- No native async/await middleware support, making error handling easy to miss

In a Cloudflare Workers environment, you need:
1. Context that can directly access `env.DB` (D1), `env.KV` (KV), `env.R2` (R2)
2. Support for `ctx.waitUntil()` for background tasks
3. The smallest possible bundle size

Hono has native support for all of these.

## Core Features

**Routing syntax is nearly identical to Express**, so the learning curve is essentially zero:

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})

app.post('/posts', async (c) => {
  const body = await c.req.json()
  return c.json({ created: true }, 201)
})

export default app
```

**Middleware is async-first**, so you won't run into the Express problem where forgetting to call `next()` causes a hang:

```typescript
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())
app.use('/api/*', jwt({ secret: 'secret' }))

app.get('/api/me', (c) => {
  const payload = c.get('jwtPayload')
  return c.json({ userId: payload.sub })
})
```

**Cloudflare Workers bindings are accessed through a typed context**:

```typescript
type Bindings = {
  DB: D1Database
  KV: KVNamespace
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/search', async (c) => {
  const query = c.req.query('q')
  // c.env.DB is D1, fully typed
  const results = await c.env.DB
    .prepare('SELECT * FROM posts WHERE title LIKE ?')
    .bind(`%${query}%`)
    .all()
  return c.json(results)
})
```

**OpenAPI integration (hono-openapi)**:

NobodyClimb uses `hono-openapi` to auto-generate OpenAPI specs, keeping API documentation in sync with implementation:

```typescript
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'

app.get(
  '/posts/:id',
  describeRoute({
    description: 'Get a single post',
    responses: {
      200: { content: { 'application/json': { schema: resolver(PostSchema) } } }
    }
  }),
  async (c) => {
    const id = c.req.param('id')
    // ...
  }
)
```

Scalar UI is mounted at `/api/v1/docs`, letting you test the API directly in the browser during development.

## Architectural Layers

NobodyClimb's Hono backend is organized into three layers:

```
routes → services → repositories
```

Routes handle only OpenAPI descriptions and request validation, services contain business logic, and repositories handle D1 queries. This is the same layering pattern you'd use with Express — Hono doesn't force any particular architectural style on you.

## When to Choose Hono

**Good fit for:**
- Deploying to Cloudflare Workers, Deno Deploy, or Bun
- Situations where bundle size matters (Workers has strict limits)
- Codebases that want Web Standard API compatibility
- Migrating from Express while keeping a familiar API syntax

**Not a good fit for:**
- Already on Node.js with no plans to migrate
- Heavy reliance on the Express middleware ecosystem (passport.js, multer, etc.)
- Teams unfamiliar with edge runtime concepts — the learning cost will just shift elsewhere

## Tradeoffs

Hono is lean, but lean means you assemble more yourself. Express has over a decade of middleware accumulation, with off-the-shelf solutions for most common needs. Hono's ecosystem is still growing, so edge-case requirements may require rolling your own.

Another thing to keep in mind: the Workers environment has real constraints (no filesystem access, no direct TCP socket access, CPU-time and memory ceilings). These aren't Hono's problems — they're [Workers' constraints](/posts/tech/2026-03-27-cloudflare-workers-edge-compute-en). But choosing Hono usually means choosing Workers too, so they need to be considered together.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Cloudflare Edge Stack" series.

## References

- [Hono Official Docs](https://hono.dev/)
- [Hono's own size and benchmark figures](https://hono.dev/docs/) — the 14 kB number is the `hono/tiny` preset
- [Cloudflare Workers Official Docs](https://developers.cloudflare.com/workers/)
- [hono-openapi](https://github.com/rhinobase/hono-openapi)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en) — Hono in action on a real Cloudflare-first project
- [NobodyClimb RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en) — AI Q&A system design on the same backend
