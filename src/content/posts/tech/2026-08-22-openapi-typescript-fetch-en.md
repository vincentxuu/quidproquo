---
title: "openapi-typescript: Turn OpenAPI into Runtime-Free Types and a Fetch Client"
date: 2026-08-22
category: tech
type: deep-dive
tags: [openapi-typescript, openapi, typescript, api-client, fetch, codegen]
lang: en
tldr: "openapi-typescript converts OpenAPI 3.0 and 3.1 into pure TypeScript types; openapi-fetch then infers methods, literal paths, parameters, and response unions from that schema."
description: "openapi-typescript, openapi-fetch, runtime-validation boundaries, CI schema diffs, and appropriate use cases."
series:
  name: "Technology Choices in the AI Era"
  order: 41
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-openapi-typescript-fetch)

[openapi-typescript](https://openapi-ts.dev/introduction) converts OpenAPI 3.0 and 3.1 paths, components, requests, and responses into `.d.ts`. The output contains types only—no runtime classes, HTTP client, or dependency. The same project provides [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) when requests are needed.

This split fits teams with a trusted OpenAPI document that want TypeScript consumers to stop copying interfaces.

## Generate types, then call literal paths

```bash
npx openapi-typescript ./openapi.yaml -o ./src/api/schema.d.ts
```

```ts
import createClient from 'openapi-fetch';
import type { paths } from './api/schema';

const client = createClient<paths>({ baseUrl: 'https://api.example.com' });
const { data, error, response } = await client.GET('/users/{id}', {
  params: { path: { id: 'u_123' } },
});
```

`data` represents successful responses, `error` represents 4xx, 5xx, or default responses, and the original Fetch `Response` remains available. The literal path indexes inference; a dynamically constructed plain string loses the operation relationship.

## Generated types are not runtime validation

Types disappear after compilation. If a server returns data that violates its spec, openapi-fetch does not automatically parse every property with Zod. Server contract tests, response validation, or independent conformance tests must establish that the source is truthful. Otherwise generation faithfully amplifies a bad specification.

Test actual fixtures for date-time representation, nullable versus optional fields, multipart encoding, and discriminators. Never edit generated files manually; fix the source and regenerate.

## Make CI flow in one direction

Commit the OpenAPI document and generated types. CI regenerates, requires a clean diff, and runs `tsc --noEmit`. An OpenAPI diff tool separately detects breaking changes. Together they catch stale output and expose type changes in consumer reviews.

Remote schema URLs weaken reproducibility. A production pipeline should pin or download an approved artifact before generation rather than fetching whatever is current during frontend installation.

## Comparing full SDK generators

openapi-typescript preserves HTTP paths and the Fetch mental model with small, transparent output. Stainless and Speakeasy additionally generate resource methods, pagination, retries, publishing workflows, documentation, and multiple languages; they treat SDKs as products.

The thin option does not design developer experience for you. Full generators add configuration, vendor workflows, and generated-repository governance. A private TypeScript app often needs only the thin client. Public Python, Go, and Java SDKs are not solved by a `.d.ts` file.

Coding agents can follow `paths` accurately, but should modify only specification sources and application code, never generated output. A useful gate deletes one required field and confirms both typecheck and generated diff fail.

## References

- [openapi-typescript introduction](https://openapi-ts.dev/introduction)
- [openapi-fetch getting started](https://openapi-ts.dev/openapi-fetch/)
- [openapi-fetch middleware and authentication](https://openapi-ts.dev/openapi-fetch/middleware-auth)
