---
title: "oRPC: Put End-to-End Type Safety and OpenAPI on the Same Path"
date: 2026-08-22
category: tech
type: deep-dive
tags: [orpc, typescript, api-contract, rpc, openapi, standard-schema]
lang: en
tldr: "oRPC supports implementation-first and contract-first APIs, offers an RPC client, and can expose the same router through OpenAPI 3.1.1 HTTP endpoints."
description: "oRPC procedures, Standard Schema, RPCHandler, OpenAPIHandler, contract-first development, and cross-runtime tradeoffs."
series:
  name: "AI 時代的技術選擇"
  order: 37
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-orpc-openapi-rpc)

[oRPC](https://orpc.dev/) addresses a common TypeScript API choice. Internal development wants function-like end-to-end types, while external consumers need conventional HTTP paths, OpenAPI documentation, and language-neutral clients. The same procedures can run through an RPCHandler or an OpenAPIHandler.

This is not a mechanical RPC-to-Swagger conversion. Route metadata, input and output schemas, errors, and serialization form the contract required for a useful OpenAPI surface.

## Start from implementation or contract

Implementation-first code defines route, schema, and handler with a builder:

```ts
const findPlanet = os
  .route({ method: 'GET', path: '/planets/{id}' })
  .input(z.object({ id: z.number().int() }))
  .output(PlanetSchema)
  .handler(async ({ input }) => db.planet.find(input.id));
```

Contract-first development puts input, output, route, and error definitions in an independent package before the server implements them. The former suits rapid iteration by one team; the latter suits separate repositories or API review before business logic. Standard Schema support allows validators beyond Zod, including Valibot and ArkType.

Middleware, context, and typed errors remain server responsibilities. A schema rejects malformed payloads but cannot replace resource authorization. Every procedure must check actor, tenant, and resource together.

## Two handlers, one business implementation

`RPCHandler` with RPCLink preserves native oRPC transport and types. `OpenAPIHandler` accepts conventional GET, POST, and other HTTP requests from route metadata. The same router can generate an [OpenAPI 3.1.1 specification](https://orpc.dev/docs/openapi/openapi-specification). Official runtimes include Node.js, Bun, Deno, and Cloudflare Workers.

```ts
const handler = new OpenAPIHandler(router, {
  plugins: [new CORSPlugin()],
});

export default async function fetch(request: Request) {
  const { matched, response } = await handler.handle(request, {
    prefix: '/api',
    context: {},
  });
  return matched ? response : new Response('Not Found', { status: 404 });
}
```

OpenAPI transport still obeys HTTP encoding constraints. File, Blob, Date, BigInt, streams, and nested multipart values require tests across server, generated client, and schema converter. A correct TypeScript hover is not sufficient evidence.

## Lazy routers have contract costs

Routers are nested ordinary objects and can load lazily to improve cold starts. Importing a contract derived directly from an implementation router can pull internal logic into a client bundle. The official unlazy and minify flow emits only routing metadata.

Contract-first is cleaner for public APIs and multiple repositories because the shared package contains no implementation from the start. Existing OpenAPI can also generate an oRPC contract through a Hey API plugin, though that path is currently beta and should be version-pinned with artifact diffs.

## Comparing tRPC and ts-rest

tRPC flows the server router type directly to the client and has the largest mature ecosystem; its official OpenAPI package is currently alpha. ts-rest centers on a conventional REST contract and is a smaller incremental layer over existing frameworks. oRPC brings RPC, OpenAPI, native types, streaming, and multiple runtimes into a more comprehensive framework.

That completeness creates more governance surfaces. Teams must decide whether RPC and OpenAPI clients are both supported, which artifact is canonical, how serializers are versioned, and whether renaming a procedure changes its path. A useful test is one route containing a typed error and Date, exercised through RPCLink, curl, and a generated OpenAPI client.

## When to choose oRPC

oRPC is well positioned when one TypeScript backend serves an internal frontend, external integrations, and AI tools from one procedure definition. tRPC is more mature when a monorepo only needs the shortest internal path. ts-rest is easier to explain when the requirement is a thin REST contract layer. With oRPC, commit and diff the OpenAPI artifact in CI instead of trusting inference alone.

## References

- [oRPC documentation](https://orpc.dev/)
- [oRPC OpenAPI getting started](https://orpc.dev/docs/openapi/getting-started)
- [oRPC OpenAPI specification generation](https://orpc.dev/docs/openapi/openapi-specification)
- [oRPC router-to-contract guidance](https://orpc.dev/docs/contract-first/router-to-contract)
