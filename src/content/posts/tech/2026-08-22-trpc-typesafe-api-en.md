---
title: "tRPC: Connect Client and Server Contracts through TypeScript Inference"
date: 2026-08-22
category: tech
type: deep-dive
tags: [trpc, typescript, api-contract, rpc, openapi, full-stack]
lang: en
tldr: "tRPC lets a client reference the server router type without a separate schema or code generation. Version 11 also has an official, alpha-stage OpenAPI 3.1 generator."
description: "tRPC procedures, routers, validators, client links, HTTP wire format, and the boundary between TypeScript monorepos and cross-language APIs."
series:
  name: "Technology Choices in the AI Era"
  order: 36
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-trpc-typesafe-api)

[tRPC](https://trpc.io/docs/) has a simple core: the server exports an `AppRouter` type, and the client uses it to infer procedure paths, inputs, outputs, and errors. There is no separate IDL or required code-generation step. TypeScript inference connects both sides.

That makes iteration extremely short inside one TypeScript codebase. It also means tRPC primarily solves a shared compilation boundary, not a language-neutral public API standard.

## Procedures join contract and implementation

A router contains query, mutation, and subscription procedures. An input validator parses untrusted runtime data, while the resolver return type flows to the client.

```ts
const t = initTRPC.create();

export const appRouter = t.router({
  userById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => db.user.findUnique({ where: { id: input.id } })),
});

export type AppRouter = typeof appRouter;
```

The client imports `AppRouter` as a type, so server business logic does not enter its bundle. Middleware and base procedures centralize authentication, tenant membership, and context narrowing. Authorization still executes on the server; type safety cannot prevent an unauthorized query.

An inferred output is pleasant at compile time but is not automatically runtime-validated. Database migrations, serializers, or third-party data can violate expectations. Add an `.output()` validator where the boundary warrants it.

## Client links select the transport

The client link chain composes logging, retries, headers, and a terminating transport. The official docs recommend `httpBatchLink` for ordinary HTTP and also provide streaming, subscription, and WebSocket choices.

The wire format is not one conventional REST resource per procedure. The [HTTP RPC specification](https://trpc.io/docs/rpc) defines procedure paths, JSON input, batching, and response envelopes. Official clients make browser and same-language application use easy; curl, third-party webhooks, gateway policies, and other languages must understand the protocol.

## Official OpenAPI exists, in alpha

tRPC v11 now includes [`@trpc/openapi`](https://trpc.io/docs/openapi). It statically analyzes router TypeScript types without executing application code and emits OpenAPI 3.1. Queries become GET operations, mutations become POST operations, and tools such as Hey API can generate clients.

The boundaries matter: the package remains alpha, subscriptions are excluded, and GET input is one JSON query parameter rather than conventional independent parameters. If the server uses a transformer such as SuperJSON, external clients need the same serializer or values such as Date, Map, and BigInt become incorrect.

OpenAPI improves documentation, agent tool discovery, and external clients. It does not automatically turn the existing tRPC wire contract into the most conventional REST surface. If stable paths, status codes, language-neutral schemas, and gateway interoperability are primary requirements, oRPC, ts-rest, or an OpenAPI-first design is usually more direct.

## AI coding amplifies both sides

An agent can follow router types to implement calls and refactors quickly, and tRPC has abundant searchable examples. It can also confuse successful compilation with a compatible API. Runtime validation, error shape, authorization, cache keys, and transformers need integration tests.

A concrete CI check is to export OpenAPI and run a breaking-change diff against the previous version, then compile a consumer package that cannot import server source. One checks the wire surface; the other proves that the TypeScript contract is independently consumable.

## When to choose tRPC

tRPC remains a low-friction default when one team owns a monorepo, both sides use TypeScript, and the main consumer is its own web application. For multi-language SDKs, external developers, or independent release cadences, making OpenAPI or Protobuf the source of truth is usually more stable than reconstructing a public contract later.

## References

- [tRPC procedures](https://trpc.io/docs/server/procedures)
- [tRPC client links](https://trpc.io/docs/client/links)
- [tRPC HTTP RPC specification](https://trpc.io/docs/rpc)
- [tRPC OpenAPI alpha](https://trpc.io/docs/openapi)
