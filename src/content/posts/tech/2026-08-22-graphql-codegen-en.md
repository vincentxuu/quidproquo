---
title: "GraphQL and Code Generator: Type Safety Comes from Schema Plus Operations"
date: 2026-08-22
category: tech
type: deep-dive
tags: [graphql, graphql-code-generator, api-contract, typescript, codegen, frontend]
lang: en
tldr: "A GraphQL schema defines available capabilities; GraphQL Code Generator combines it with actual queries, mutations, and fragments to emit precise results, variables, and typed documents."
description: "GraphQL schemas, operation-level codegen, client preset, resolver types, schema evolution, authorization, and AI-agent boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 46
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-graphql-codegen)

[GraphQL](https://graphql.org/learn/) lets clients select fields through queries while one server schema exposes types, fields, and operations. Converting the whole schema to TypeScript is insufficient because each query determines its own response shape. [GraphQL Code Generator](https://the-guild.dev/graphql/codegen/docs/getting-started) compiles schema and documents together into variables, results, typed documents, and resolver types.

## An operation is the client's actual contract

```graphql
query UserCard($id: ID!) {
  user(id: $id) {
    id
    displayName
    avatarUrl
  }
}
```

Even if `User` has fifty schema fields, this operation returns only three. The client preset can emit TypedDocumentNode so Apollo, urql, and other clients infer variables and results directly. Fragment masking limits a component to fields in its fragment.

Do not hand-write a `User` interface and assume it equals a query response. Aliases, nullability, unions, interfaces, and conditional directives alter the shape. Generate types from operation sources and never edit output directly.

## The server can generate resolver contracts

Plugins generate resolver signatures, context types, and model mappings, reducing drift between schema and implementation. This is not runtime authorization. A schema exposing `user(id:)` does not permit every authenticated user to request every ID. Resolvers or directive middleware enforce actor, tenant, and resource access.

N+1 queries, cost, depth, timeouts, and persisted operations are also outside TypeScript types. Public endpoints should constrain arbitrary queries. Agents can explore introspection schemas, making operation allowlists, field authorization, and cost budgets especially important.

## Treat codegen as a CI compiler

Configuration selects schema, documents, output, and plugins:

```ts
export default {
  schema: './schema.graphql',
  documents: ['src/**/*.{ts,tsx,graphql}'],
  generates: {
    './src/gql/': { preset: 'client' },
  },
};
```

CI regenerates, requires a clean diff, and uses a registry or comparison tool for breaking and dangerous changes. Codegen catches operations in the repository that stop compiling, but not an untracked mobile client or persisted query. Production usage belongs in field-removal policy.

GraphQL Code Generator is plugin-based across TypeScript clients, Node resolvers, Java, and multiple frameworks. Plugin versions interact and monorepo hoisting can affect loading. Pin CLI, preset, plugins, and `graphql`, and upgrade them in dedicated pull requests.

## Comparing REST and RPC

GraphQL excels when multiple UIs need different projections over one graph and product iteration is frequent. gRPC and Connect are clearer for fixed service methods, strong streaming, and binary cross-language contracts. OpenAPI REST is smaller for public resources, HTTP caching, and simple webhooks.

GraphQL exposes a query language to clients and therefore requires resolver performance, schema evolution, and access-control governance. A practical test removes a used field and confirms codegen failure, then submits a deeply expensive query and confirms gateway cost policy rejects it.

## References

- [GraphQL learn](https://graphql.org/learn/)
- [GraphQL specification](https://spec.graphql.org/)
- [GraphQL Code Generator introduction](https://the-guild.dev/graphql/codegen/docs/getting-started)
- [GraphQL Code Generator client preset](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client)
- [GraphQL Code Generator installation](https://the-guild.dev/graphql/codegen/docs/getting-started/installation)
