---
title: "Fastify: Plugin Encapsulation, JSON Schema, and Efficient Node.js APIs"
date: 2026-08-22
category: tech
type: deep-dive
tags: [fastify, nodejs, typescript, backend, json-schema]
lang: en
tldr: "Fastify is more than benchmarks: plugin scopes, hooks, decorators, and compiled JSON Schema build composable Node.js APIs with explicit request and response contracts."
description: "Fastify plugins, encapsulation, route schemas, validation, serialization, hooks, decorators, TypeScript, testing, and production boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 95
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-fastify-web-framework)

[Fastify](https://fastify.dev/docs/latest/) is a low-overhead, schema-based Node.js web framework. Routing, Ajv-compiled validation, and fast-json-stringify serialization drive performance, while the `register` plugin encapsulation graph drives maintainability.

## Every register creates a scope

Nearly everything beyond the root is a plugin. `register(plugin)` creates a child context by default. Children inherit ancestor decorators, hooks, schemas, and plugins; ancestors and siblings cannot see additions made in the child. A feature plugin can therefore own routes, authentication hooks, database decorators, and schemas.

`fastify-plugin` can break encapsulation and expose capability upward; use it only for genuinely application-wide infrastructure. Registration order is dependency order, and missing decorator dependencies should fail startup rather than the first request.

Declare decorator shapes before serving requests. Never store mutable request state on a shared server decorator; use request or reply decorators and local objects. Create singleton pools in plugins and release them symmetrically with `onClose`.

## Route Schema controls input and output

[Validation and Serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/) recommends full JSON Schema for bodies, queries, parameters, headers, and responses. Ajv validates inputs, while fast-json-stringify emits only response-schema fields, reducing accidental disclosure.

Fastify v5 requires full JSON Schema for route inputs and responses and Node.js 20+. Schemas compile with `new Function()` and are trusted application code, never user input. Do not perform database or external API work during initial validation; validate structure first and use `preHandler` for authorization or I/O.

TypeScript types do not create runtime schemas. TypeBox, JSON Schema-to-TS, and other type providers help, but choose one source of truth so TypeScript, validation, serialization, and OpenAPI do not drift. Cover every response status.

## Hook order is request policy

The lifecycle includes `onRequest`, `preParsing`, `preValidation`, `preHandler`, the handler, `preSerialization`, `onSend`, and `onResponse`, all scoped by encapsulation. Authentication belongs before handling; metrics and tracing need timeouts, aborted clients, and streams.

Do not mix callback `done` with async or Promise handlers, which can execute hooks twice. Arrow functions do not bind `this` to the Fastify context; use normal functions or explicit closures when accessing decorators.

Fastify does not prescribe DI, ORM, or application architecture. It fits high-throughput APIs, precise schemas, composable plugins, and small-core teams. NestJS adds opinionated modules and DI while optionally using Fastify; Hono or Elysia targets edge and multi-runtime simplicity. Test plugin isolation, denied schemas, response stripping, hook ordering, client aborts, backpressure, graceful close, plugin compatibility, and v4-to-v5 migration.

## References

- [Fastify documentation](https://fastify.dev/docs/latest/)
- [Fastify plugins](https://fastify.dev/docs/latest/Reference/Plugins/)
- [Fastify encapsulation](https://fastify.dev/docs/latest/Reference/Encapsulation/)
- [Validation and serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
- [Fastify hooks](https://fastify.dev/docs/latest/Reference/Hooks/)
- [Fastify v5 migration guide](https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/)
