---
title: "Zodios: Build an Axios Type-Safe Client from Zod Endpoint Definitions"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zodios, zod, axios, typescript, api-contract, openapi]
lang: en
tldr: "Zodios uses a central Zod endpoint definition for Axios client types, runtime validation, and aliases, with optional Express and OpenAPI packages."
description: "Zodios API definitions, client validation, plugins, server, and OpenAPI, plus its maintenance status after nearly three years without a release and the trade-offs against oRPC and OpenAPI-first tools."
series:
  name: "Technology Choices in the AI Era"
  order: 39
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-zodios-api-client)

[Zodios](https://www.zodios.org/docs/intro) is a REST toolbox centered on Zod and Axios. A central definition describes methods, paths, parameters, responses, errors, and aliases. It drives a typed client and can also feed an Express adapter and OpenAPI generator.

Its distinctive property is not merely another fetch wrapper: responses are runtime-validated by default. An incorrect backend shape fails at the network boundary instead of propagating into the UI.

## One definition drives types and runtime checks

```ts
const api = new Zodios('/api', [
  {
    method: 'get',
    path: '/users/:id',
    alias: 'getUser',
    response: UserSchema,
    errors: makeErrors([
      { status: 404, schema: z.object({ message: z.string() }) },
    ]),
  },
]);

const user = await api.getUser({ params: { id: 'u_123' } });
```

Path parameters are inferred from `:id`; body, query, and headers are declared as parameters. The client validates and transforms requests and responses by default, with options to narrow or disable validation. Removing response validation may save work but also removes the main runtime contract; measure before doing it.

Plugins can add authentication, retries, mocks, or transport behavior while preserving Axios configuration. This is natural for a frontend already invested in Axios interceptors. Native Fetch and edge-runtime projects should measure adapters and bundles instead of trusting types alone.

## Client and server are independently useful

The frontend can use only `@zodios/core` against an existing API. A server can implement the definition through `@zodios/express`, while `@zodios/openapi` emits a specification and Swagger UI. The ecosystem's `openapi-zod-client` can generate a Zodios client from existing OpenAPI.

Modularity supports gradual adoption but requires one source of truth. If developers can independently edit a Zodios definition, Express routes, and OpenAPI JSON, they will drift. CI should permit manual edits to one artifact and generate and diff the others.

## Maintenance status is an architecture input

The last stable release is `@zodios/core` 10.9.6 from August 2023; since then the main branch has received only dependency-bot updates. The repository's v11 roadmap lists validator abstraction, a separate Fetch client, and package restructuring, but the `feature/v11` branch also stops in August 2023. `@zodios/core` still declares a `zod: ^3.x` peer dependency, and the Zod 4 support issue opened by Zod's author in April 2025 got no maintainer response before a stale bot closed it. The repository is not archived and there is no formal end-of-maintenance notice, but in practice it is frozen. A roadmap is not delivered functionality and should not be credited during selection.

That does not justify rewriting a working application. Pinning Zod 3 and Axios, contract tests, and controlled upgrade pull requests are often cheaper. Just know that when Axios or Express ships an incompatible major, a vulnerability turns up in Zodios itself, or the team wants Zod 4, no upstream work will follow, so plan the migration early. New projects prioritizing Standard Schema, native Fetch, multiple runtimes, and ongoing maintenance should compare oRPC, or make OpenAPI the source of truth with openapi-typescript. ts-rest, which also uses a central contract, stopped being maintained in October 2026 and is no longer a replacement option.

## Using it with coding agents

Agents can generate calls, fixtures, and mocks from endpoint definitions, but an alias is not an authorization scope. Keep mutation input minimal, inject credentials through a client plugin, and never ask a model to generate or record tokens. The server derives the actor from credentials rather than trusting a user ID in the body.

A practical test intentionally returns the wrong response type and verifies client rejection, then generates an independent smoke client from OpenAPI. Passing both demonstrates alignment between static and wire contracts.

## Update Log

- 2026-11-23: The maintenance section now states concrete facts: the last stable release is 10.9.6 from August 2023, the v11 branch also stops in August 2023, and the peer dependency still only covers Zod 3. Removed ts-rest, unmaintained since October 2026, from the alternatives in favor of oRPC or OpenAPI-first.

## References

- [Zodios introduction](https://www.zodios.org/docs/intro)
- [Zodios client API](https://www.zodios.org/docs/client)
- [Zodios API definitions](https://www.zodios.org/docs/category/zodios-api-definition)
- [Zodios repository](https://github.com/ecyrbe/zodios)
- [Zodios issue #661: Support for Zod 4](https://github.com/ecyrbe/zodios/issues/661)
- [@zodios/core on npm](https://www.npmjs.com/package/@zodios/core)
