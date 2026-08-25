---
title: "Convex: Building Reactive TypeScript Backends with Queries, Mutations, and Actions"
date: 2026-08-22
category: tech
type: deep-dive
tags: [convex, baas, typescript, realtime, database]
lang: en
tldr: "Convex combines typed backend functions, a transactional document database, and reactive query subscriptions; correctness depends on separating deterministic mutations from side-effecting actions."
description: "Convex schemas, queries, mutations, actions, reactive subscriptions, authorization, scheduling, and self-hosting boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 87
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-convex-reactive-backend)

[Convex](https://docs.convex.dev/) is a TypeScript-first reactive backend combining schemas, a document database, server functions, scheduling, file storage, and client subscriptions. Frontends call generated APIs rather than holding database connections.

## Query, Mutation, and Action carry different semantics

A [Query](https://docs.convex.dev/functions/query-functions) is read-only, deterministic, cached, and subscribable; dependent data changes recompute and push its result. A [Mutation](https://docs.convex.dev/functions/mutation-functions) reads and writes transactionally, committing all writes together, and must remain deterministic for retries. Neither may call arbitrary external APIs.

An [Action](https://docs.convex.dev/functions/actions) can `fetch` Stripe or OpenAI and optionally use Node, but is not a database transaction. A safer workflow has a client mutation persist intent and schedule an internal action; a later mutation records its result. Every external side effect needs an idempotency key and state machine.

## Realtime is query invalidation, not broadcasting rows

Clients subscribe to query results. Convex tracks dependencies and updates subscriptions after relevant changes, avoiding hand-built WebSocket events and client caches. Queries still need indexes, bounded results, and stable access patterns; an unbounded scan cannot support a popular view.

A mutation protects Convex invariants, while multiple `runQuery` or `runMutation` calls from an action are separate transactions without one snapshot. Combine consistency-sensitive work in one internal function.

## Authorization belongs in every public function

Convex integrates identity through OIDC and JWT, while deployment endpoints are internet-accessible. [Authorization](https://docs.convex.dev/auth/overview) is code in the opening of each query, mutation, or action: inspect `ctx.auth` and enforce tenant, ownership, and role. Missing checks are public API vulnerabilities. Shared helpers, internal functions, and negative tests reduce omissions.

Convex Cloud operates runtime and database, and an open-source backend can be [self-hosted](https://docs.convex.dev/self-hosting). Self-hosting transfers storage, availability, upgrades, backups, telemetry, and capacity. Open source does not make migration free; test export, import, and recovery time.

Convex fits collaborative UIs, dashboards, chat, game state, and TypeScript teams needing type-safe realtime. Compare Supabase or Nhost for SQL analytics and joins, Firebase for mobile ecosystems, and conventional backends for polyglot APIs. Test authorization denial, concurrent mutations, action redelivery, subscription fan-out, index limits, restoration, and provider failure.

## References

- [Convex documentation](https://docs.convex.dev/)
- [Convex functions](https://docs.convex.dev/functions/overview)
- [Convex mutations and transactions](https://docs.convex.dev/functions/mutation-functions)
- [Convex actions](https://docs.convex.dev/functions/actions)
- [Convex authentication and authorization](https://docs.convex.dev/auth/overview)
- [Convex self-hosting](https://docs.convex.dev/self-hosting)
