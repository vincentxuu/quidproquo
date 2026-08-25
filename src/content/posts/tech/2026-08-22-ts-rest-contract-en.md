---
title: "ts-rest: A TypeScript Contract-First API that Preserves REST Semantics"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ts-rest, typescript, api-contract, rest, openapi, standard-schema]
lang: en
tldr: "ts-rest describes methods, paths, status codes, and schemas in a shared contract, providing end-to-end server and client types without a code-generation step."
description: "ts-rest contracts, runtime validation, strict status codes, server adapters, clients, OpenAPI, and adoption boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 38
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-ts-rest-contract)

[ts-rest](https://ts-rest.com/) offers an RPC-like client over ordinary REST. A shared TypeScript contract defines method, path, query, body, headers, response statuses, and schemas. Server adapters implement it and clients consume it without a separate generation step or proprietary wire protocol.

## The contract is the shared artifact

```ts
const c = initContract();

export const contract = c.router({
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({ id: z.string() }),
    responses: {
      200: UserSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
```

The contract can live in a monorepo package or be published independently. It contains no database connection, secret, or handler. Official docs warn that metadata enters the client bundle, so it must not contain sensitive data. Validation may use Zod, another Standard Schema implementation, or plain TypeScript types.

Plain types vanish at runtime. Network input needs a runtime schema; successful compilation says nothing about malicious or old consumers.

## HTTP status is part of the type

Responses form a discriminated `{ status, body }` union. After checking `status === 200`, the client gets a User; a 404 has a different error body. `strictStatusCodes` restricts server responses to declared statuses. The fetch client also needs `throwOnUnknownStatus` to align runtime behavior with the type assumption.

This is friendlier to gateways, caches, monitoring, and non-TypeScript consumers than putting every failure inside status 200. It also forces a real distinction among 400, 401, 403, 404, and 409.

## Adapters allow incremental adoption

ts-rest integrates with NestJS, Express, Fastify, Next.js, fetch clients, and TanStack Query. An existing REST service can contract one route group at a time. The same contract can generate OpenAPI for documentation, SDKs, and breaking-change checks.

Contract, implementation, and middleware can still drift. Authentication may emit an undeclared status, a proxy can rewrite paths, and a serializer may turn Date into a string. CI should start a real server, exercise success and errors through the contract client, and diff the generated OpenAPI artifact.

## Comparing adjacent choices

tRPC uses procedure inference for the shortest monorepo loop. ts-rest makes method, path, and status explicit for existing REST and external consumers. oRPC is a broader framework spanning RPC, OpenAPI, streaming, and native types. Zodios also centralizes endpoint definitions but centers on Axios and Zod and evolves more conservatively.

Coding agents can fill contracts quickly and still omit authorization. A concrete gate is to test unauthenticated, cross-tenant, invalid-schema, and successful requests for every mutation, then smoke-test with a generated client that shares no source package.

## When to choose ts-rest

ts-rest fits teams that want predictable REST, use TypeScript on both sides, and do not want a generator pipeline. When external SDKs and multiple languages become the product, treat generated OpenAPI as a formal artifact. If the contract only compiles inside one repository, end-to-end typing has not crossed the actual organizational boundary.

## References

- [ts-rest contract overview](https://ts-rest.com/contract/overview)
- [ts-rest repository and integrations](https://github.com/ts-rest/ts-rest)
- [ts-rest OpenAPI](https://ts-rest.com/openapi)
