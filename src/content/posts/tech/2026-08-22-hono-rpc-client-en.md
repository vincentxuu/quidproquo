---
title: "Hono RPC: Infer Fetch Client Types from Route Implementations"
date: 2026-08-22
category: tech
type: deep-dive
tags: [hono, hono-rpc, typescript, api-contract, edge-computing, fetch]
lang: en
tldr: "Hono RPC exports a route's `typeof AppType` so `hc` can infer inputs, response bodies, and status codes. The shared artifact is a TypeScript type, not an independent wire schema."
description: "Hono RPC route inference, validators, status unions, large-router performance, and OpenAPI and cross-language boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 40
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-hono-rpc-client)

[Hono RPC](https://hono.dev/docs/guides/rpc) is not another server protocol. Hono routes still accept HTTP and return Fetch `Response` objects. The server exports `typeof AppType`, and an `hc<AppType>()` client infers paths, validator input, response JSON, and status codes.

It is Hono's built-in TypeScript contract bridge, especially useful for full-stack applications already running Hono on Cloudflare Workers, Bun, Deno, or Node.js.

## Types grow from the route chain

```ts
const routes = new Hono().post(
  '/posts',
  zValidator('json', z.object({ title: z.string() })),
  async (c) => c.json({ id: await create(c.req.valid('json')) }, 201),
);

export type AppType = typeof routes;

const client = hc<AppType>('https://api.example.com');
const res = await client.posts.$post({ json: { title: 'Hello' } });
```

Input comes from the validator and output from `c.json()`. Explicit status codes for both 200 and 404 produce a union that narrows on `res.status`. Direct `c.notFound()` loses body inference, so official guidance uses `c.json(body, 404)`.

Both client and server need strict TypeScript settings, and the exported type must reference the fully chained routes. Creating an app and later registering scattered routes without retaining chain results can leave endpoints out of `AppType`.

## It preserves Fetch rather than hiding it

`hc` returns a Fetch-compatible response. The client handles `res.ok`, status, headers, and `res.json()` explicitly. This preserves familiar HTTP caching, streaming, cookies, and middleware, while leaving retries, error mapping, and body consumption to application policy.

Responses from global `app.onError()` and middleware are not automatically inferred for every route. `ApplyGlobalResponse` can add shared 401 and 500 shapes. Without it, client types show the happy path while production can still receive global errors.

## Large AppTypes can tax TypeScript

A huge inferred type can slow editors and builds. Official guidance splits authors, books, and other sub-apps, chains them at the top level, and optionally splits clients. Explicit route type arguments can reduce type instantiation.

This is a shared cost of inference-based contracts. An AI agent can generate hundreds of routes faster than the language server can expand the tree. Track TypeScript compile time in CI in addition to HTTP latency.

## OpenAPI and other languages are separate requirements

AppType exists only in the TypeScript compiler. Python, Swift, gateways, and external developers cannot consume it directly. Hono's validator and OpenAPI ecosystem can generate a schema, but a correct Hono RPC type is not itself a public API contract.

Hono RPC stays closer to native HTTP and Fetch than tRPC and has no procedure protocol. Unlike ts-rest, it infers from route implementation instead of starting with an independent contract. Compared with oRPC, it is a thinner feature set for teams that already chose Hono and do not want another framework layer.

A useful gate creates a separate client package that can only import `AppType`, then integration-tests 201, 400, 401, 404, and 500. If non-TypeScript consumers exist, generate OpenAPI from the same routes and run a breaking-change diff.

## References

- [Hono RPC guide](https://hono.dev/docs/guides/rpc)
- [Hono validation guide](https://hono.dev/docs/guides/validation)
- [Hono large application guidance](https://hono.dev/docs/guides/best-practices)
