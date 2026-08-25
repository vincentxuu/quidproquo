---
title: "Elysia: Bun-First APIs with Runtime Schemas and End-to-End Types"
date: 2026-08-22
category: tech
type: deep-dive
tags: [elysia, bun, typescript, backend, api]
lang: en
tldr: "Elysia connects runtime schemas, TypeScript inference, OpenAPI, and Eden clients into one contract pipeline, but Bun-first performance, plugin scope, and cross-runtime compatibility still require separate verification."
description: "Elysia schemas, lifecycle, plugin scope, macros, Eden Treaty, OpenAPI, Bun and Node adapters, and production selection boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 96
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-elysia-web-framework)

[Elysia](https://elysiajs.com/) is a TypeScript web framework designed primarily around Bun while providing runtime adapters for Node.js and other targets. Its important property is not one benchmark result, but a contract pipeline connecting routing, runtime validation, type inference, OpenAPI, and typed clients.

## A schema is a runtime contract

`Elysia.t`, based on TypeBox, can drive runtime validation, coercion, TypeScript types, and OpenAPI schemas for bodies, queries, parameters, headers, cookies, and responses. Standard Schema support permits Zod, Valibot, ArkType, and other validators. Before mixing them, verify coercion, file inspection, and OpenAPI output behavior.

```ts
import { Elysia, t } from 'elysia'

export const app = new Elysia()
  .post('/notes', ({ body, status }) => {
    if (body.title.trim() === '') return status(422, { error: 'empty title' })
    return { id: crypto.randomUUID(), title: body.title }
  }, {
    body: t.Object({ title: t.String({ minLength: 1 }) }),
    response: {
      200: t.Object({ id: t.String(), title: t.String() }),
      422: t.Object({ error: t.String() })
    }
  })
```

Eden Treaty infers an object-like client directly from the server instance without code generation and narrows errors by status. This works well inside a shared TypeScript monorepo. For polyglot clients, separate repositories, or versioned organizational contracts, export and diff OpenAPI in CI instead of treating TypeScript inference as the external protocol.

## Lifecycle and scope define policy coverage

A request moves through parse, transform, validation, before-handle, handler, after-handle, response mapping, error, and after-response stages. Use `derive` for per-request context, put authorization after structural validation in `beforeHandle`, and cover errors, streams, and client aborts in cleanup and telemetry.

An Elysia instance is also a plugin, but its lifecycle is isolated by default. `local` scope covers the current instance and descendants, `scoped` also reaches one parent, and `global` reaches every ancestor using the plugin. A misplaced authentication hook can protect plugin routes while leaving later parent routes open. Give reusable plugins a `name` and, when needed, a `seed` for deduplication. Global scope fits tracing or CORS; databases, authentication, and business features usually deserve explicit dependencies.

Macros combine schemas and lifecycle behavior into route declarations such as `auth: true`, reducing policy drift. They remain sensitive to scope and registration order, so test marked and unmarked routes both inside plugins and on parent instances.

## Bun-first does not mean Bun-only

The `@elysia/node` adapter runs Elysia on Node.js, and a Cloudflare Worker integration also exists. This reduces runtime lock-in but does not make Bun-specific APIs, WebSockets, file systems, native packages, signals, or performance portable automatically. If portability is a requirement, run contract, shutdown, streaming, WebSocket, and load tests on every target runtime from the start.

Elysia fits TypeScript full-stack teams wanting rapid inference, runtime schemas, and Eden clients. Fastify has a more established Node plugin ecosystem and JSON Schema pipeline; Hono hews closer to Web Standards and edge portability; NestJS supplies opinionated modules and DI. Evaluate schema coverage for every status, scope leakage, independent client versioning, adapter parity, Bun upgrades, and production observability—not only requests per second.

## References

- [Elysia documentation](https://elysiajs.com/)
- [Validation](https://elysiajs.com/essential/validation)
- [Lifecycle](https://elysiajs.com/essential/life-cycle)
- [Plugins and scope](https://elysiajs.com/essential/plugin)
- [Eden end-to-end type safety](https://elysiajs.com/eden/overview)
- [OpenAPI](https://elysiajs.com/patterns/openapi)
- [Node.js integration](https://elysiajs.com/integrations/node)
