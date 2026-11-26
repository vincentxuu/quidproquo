---
title: "ts-rest: A TypeScript Contract-First API that Preserves REST Semantics, and What to Do Now That It Is Unmaintained"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ts-rest, typescript, api-contract, rest, openapi, standard-schema]
lang: en
tldr: "ts-rest describes methods, paths, status codes, and schemas in a shared contract, providing end-to-end server and client types without a code-generation step. Since October 2026 it is officially unmaintained, with no bug or security fixes, so new projects should look at oRPC contract-first or OpenAPI-first; its contract design ideas still apply."
description: "ts-rest contracts, runtime validation, strict status codes, server adapters, clients, and OpenAPI, plus how existing projects should handle the end of maintenance and what new projects should choose instead."
series:
  name: "Technology Choices in the AI Era"
  order: 38
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-ts-rest-contract)

[ts-rest](https://ts-rest.com/) offers an RPC-like client over ordinary REST. A shared TypeScript contract defines method, path, query, body, headers, response statuses, and schemas. Server adapters implement it and clients consume it without a separate generation step or proprietary wire protocol.

## Unmaintained since October 2026

On 2026-10-26 the maintainer announced in the repository README that ts-rest is no longer maintained: there will be no new releases (including the planned V4), bug fixes, security updates, or support, and the GitHub repository has since been archived. The last stable release is `@ts-rest/core` 3.52.1 (March 2025); the unfinished V4 work remains only as a base for forks. Existing releases, source, and docs stay available under the MIT license, and independent forks are welcome.

The contract, status-union, and adapter design below is still sound, but the answer to "should we choose ts-rest" has changed; see the last two sections.

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

tRPC uses procedure inference for the shortest monorepo loop. ts-rest makes method, path, and status explicit for existing REST and external consumers. oRPC is a broader framework spanning RPC, OpenAPI, streaming, and native types, and it also supports a contract-first style where the contract is defined before the implementation, making it the closest replacement for ts-rest's use cases. Zodios also centralizes endpoint definitions but centers on Axios and Zod and has had no release since August 2023.

Coding agents can fill contracts quickly and still omit authorization. A concrete gate is to test unauthenticated, cross-tenant, invalid-schema, and successful requests for every mutation, then smoke-test with a generated client that shares no source package.

## Can you still choose ts-rest

Not for new projects. Without security fixes, nobody will update the adapters when Express, Fastify, NestJS, or Next.js ship breaking changes or vulnerabilities, and the same goes for TypeScript and validator upgrades. To keep the shape of a shared contract over ordinary REST with no generator, look at oRPC contract-first; if external SDKs and multiple languages are central, make OpenAPI the source of truth (for example with openapi-typescript or an SDK generator).

Existing projects need not rewrite immediately, but should plan a migration:

1. Pin `@ts-rest/*` versions together with the framework versions the adapters depend on, and run contract tests before any upgrade.
2. Export OpenAPI from the contract now and commit it. That artifact does not depend on ts-rest and serves as the comparison baseline whether you move to oRPC, OpenAPI-first, or a fork.
3. Order the work by risk: public APIs and routes on less common adapters first, internal routes later. If the team adopts a fork, treat it as a dependency you maintain and track its security advisories yourself.

Whatever you choose, when external SDKs and multiple languages become the product, treat generated OpenAPI as a formal artifact. If the contract only compiles inside one repository, end-to-end typing has not crossed the actual organizational boundary.

## Update Log

- 2026-11-23: ts-rest announced the end of maintenance on 2026-10-26 (no new releases, bug fixes, or security updates), and the repository is archived. Added an "Unmaintained since October 2026" section, rewrote "When to choose" into guidance that new projects should look at oRPC contract-first or OpenAPI-first plus migration steps for existing projects, and noted that Zodios has had no release since August 2023.

## References

- [ts-rest contract overview](https://ts-rest.com/contract/overview)
- [ts-rest repository (README maintenance status)](https://github.com/ts-rest/ts-rest)
- [ts-rest OpenAPI](https://ts-rest.com/openapi)
- [oRPC procedure contract (contract-first)](https://orpc.dev/docs/contract/procedure)
