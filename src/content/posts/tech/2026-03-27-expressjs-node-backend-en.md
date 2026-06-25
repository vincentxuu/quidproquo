---
title: "Express.js: The Default Answer for Node.js Backends, and Why It Still Makes Sense"
date: 2026-03-27
type: guide
category: tech
tags: [expressjs, nodejs, backend, api]
lang: en
tldr: "Express is the most mature Web framework for Node.js, with a rich middleware ecosystem and abundant learning resources. Paired with TypeScript and a clear layered architecture, it remains a justifiable choice in 2026."
description: "A look at Express.js's core design philosophy, middleware pattern, TypeScript integration, and why DaoDao chose it as the primary backend framework — plus when you should consider alternatives."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-expressjs-node-backend)

Express was released in 2010 — over 15 years ago. Every few years someone declares it "dead," replaced by Fastify, Koa, or NestJS, yet npm download counts keep it near the top of the charts. DaoDao's primary backend is built on Express + TypeScript, and that choice has solid reasoning behind it.

## What It Is

Express is a minimalist Node.js Web framework that does exactly three things:

1. **Routing**: Maps HTTP requests to handler functions
2. **Middleware**: Lets requests pass through a series of processors before reaching a handler
3. **Response helpers**: `res.json()`, `res.send()`, `res.status()`, and friends

That's it. Express doesn't care about your database, your ORM, or your auth strategy — all of that is filled in by ecosystem middleware and your own architectural decisions.

This minimalist design is Express's greatest strength and its greatest weakness — high flexibility, but no guardrails.

## Why DaoDao Chose Express

DaoDao's backend requirements:
- REST API for the frontend (Next.js + Expo)
- JWT auth + Google OAuth
- BullMQ notification system integration
- Prisma ORM for PostgreSQL access
- Zod validation

Express's mature ecosystem has ready-made solutions for all of these. Passport.js handles OAuth, BullMQ is a plain Node.js package you can import directly, and the Prisma client works out of the box in any Node.js environment.

Switching to Fastify or NestJS would work too, but the migration cost offers no corresponding benefit — Express is sufficient, and the team knows it well.

## The Middleware Pattern

The heart of Express is the middleware chain. Each middleware is a function that receives `(req, res, next)`, does its work, then calls `next()` to pass control to the next handler:

```typescript
import express, { Request, Response, NextFunction } from 'express'

const app = express()

// Global middleware
app.use(express.json())
app.use(cors())

// Custom middleware: request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' })
  // verify token...
  next()
}

// Apply auth only to specific routes
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ success: true, data: req.user })
})
```

## Layered Architecture

DaoDao's Express backend is organized into four layers:

```
routes → controllers → services → Prisma ORM
              ↕
         middleware (auth, rate limit, validation)
```

**Routes**: Only responsible for path mapping and middleware attachment

```typescript
// routes/posts.ts
import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { PostController } from '../controllers/PostController'

const router = Router()
const controller = new PostController()

router.get('/', controller.list)
router.post('/', requireAuth, controller.create)
router.get('/:id', controller.getById)

export default router
```

**Controllers**: Handle HTTP request/response; no business logic here

```typescript
// controllers/PostController.ts
import { Request, Response } from 'express'
import { PostService } from '../services/PostService'
import { CreatePostSchema } from '../schemas/post'

export class PostController {
  private service = new PostService()

  list = async (req: Request, res: Response) => {
    const posts = await this.service.list()
    res.json({ success: true, data: posts, timestamp: new Date().toISOString() })
  }

  create = async (req: Request, res: Response) => {
    const parsed = CreatePostSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ success: false, data: null, errors: parsed.error.issues })
    }
    const post = await this.service.create(parsed.data)
    res.status(201).json({ success: true, data: post, timestamp: new Date().toISOString() })
  }
}
```

**Services**: Business logic, with no knowledge that HTTP exists

```typescript
// services/PostService.ts
import { prisma } from '../lib/prisma'
import { CreatePostInput } from '../schemas/post'
import { randomUUID } from 'crypto'

export class PostService {
  list() {
    return prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
  }

  create(data: CreatePostInput) {
    return prisma.post.create({
      data: { ...data, externalId: randomUUID() }
    })
  }
}
```

This layering keeps each tier focused on its own responsibility. Services can be unit-tested in complete isolation without mocking HTTP.

## Unified Response Format

All DaoDao API responses follow the same structure:

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T | null
  timestamp: string
  meta?: { page?: number; total?: number }
}
```

The frontend API client handles errors uniformly — no per-endpoint error logic needed.

## External UUID Design

All publicly exposed IDs use UUIDs rather than auto-increment integers. URLs like `/api/posts/1` and `/api/posts/2` allow attackers to enumerate resources — UUID format makes guessing infeasible. In the Prisma schema, `id` uses an auto-increment integer as the primary key (better performance), while a separate `externalId` column holds the UUID. The public API only exposes `externalId`.

## Tradeoffs

**The downsides of Express:**

- **No structure**: You decide the layering, naming, and organization. Easy to get started, but long-term maintenance requires discipline
- **Legacy of the callback era**: Express error handling uses four-parameter `(err, req, res, next)` middleware; async errors require manual try/catch or a wrapper utility
- **Type support relies on @types/express**: Thinner than Fastify's native TypeScript support

**Reasons to still choose Express:**

- More documentation and tutorials than any other Node.js framework
- Nearly every Node.js-compatible package includes an Express example
- Finding backend engineers with Express experience is far easier than finding Fastify or Koa specialists
- The path from zero to production-ready is well-trodden and clear

If you're in a Node.js environment, don't need edge runtime, and your team has experience with architectural design, Express + TypeScript remains a sound choice. If you want more framework guardrails, NestJS is a full-featured framework built on top of Express. If you're chasing maximum throughput, Fastify is worth evaluating.

## References

- [Express.js Official Documentation](https://expressjs.com/)
- [Passport.js Official Documentation](https://www.passportjs.org/)
- [Zod Official Documentation](https://zod.dev/)
- [BullMQ Official Documentation](https://docs.bullmq.io/)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Express in a full production project
