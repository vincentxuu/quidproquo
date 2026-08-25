---
title: "Nhost: A BaaS of PostgreSQL, Hasura GraphQL, Auth, and Storage"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nhost, baas, postgresql, graphql, hasura]
lang: en
tldr: "Nhost uses PostgreSQL as the source of truth, Hasura to generate GraphQL, and connects Auth claims, role permissions, Storage, and Functions into one platform."
description: "Nhost PostgreSQL, Hasura GraphQL, Auth, permissions, Storage, Functions, migrations, metadata, and local development."
series:
  name: "Technology Choices in the AI Era"
  order: 89
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-nhost-postgres-graphql-backend)

[Nhost](https://docs.nhost.io/) is a PostgreSQL-centered BaaS. Hasura derives a GraphQL API from the schema, Nhost Auth signs tokens with Hasura claims, and Storage, Serverless Functions, and a local CLI complete the backend. Like Supabase it starts with Postgres, but its API and authorization model differ.

## PostgreSQL schema directly shapes GraphQL

Tables, relationships, views, functions, and Hasura metadata determine queries, mutations, and subscriptions. Fast schema-to-API development can also expose mistaken relationships, columns, or expensive nested queries. Add indexes, query depth or allowlists, timeouts, rate limits, and operation telemetry.

[Permissions](https://docs.nhost.io/products/graphql/permissions) are separate per role, table, and select, insert, update, or delete operation, with no non-admin access by default. Rules use JWT variables such as `X-Hasura-User-Id` for ownership and tenant filtering and restrict columns, row checks, and aggregates. Admin secrets bypass them and belong in neither browsers nor ordinary server paths.

## Auth claims connect identity and data policy

Each user has a default and allowed roles; one request role resolves GraphQL and Storage permissions. Clients must not claim roles absent from trusted tokens. Trusted workflows generate custom claims and permission variables. WebAuthn elevation can protect sensitive changes, but its token lifetime still requires auditing and replay controls.

Storage also uses role and user context. Database rows, objects, and external side effects do not share one ACID transaction. Model uploads with pending and complete states, checksums, cleanup, and idempotency.

## Version migrations and Metadata together

[Local Development](https://docs.nhost.io/platform/cli/local-development) runs PostgreSQL, Hasura, Auth, MinIO, Functions, and Mailhog in Docker. Dashboard database changes generate SQL migrations, while permissions and triggers become Hasura metadata. Review, commit, and deploy both.

Cloud-console-only edits create drift and may be overwritten by synchronization. Migrations must coexist with old and new clients. Test rollback or forward fixes, metadata inconsistency, isolated seeds, and restoration. Functions and event triggers remain idempotent because Hasura delivery is not exactly-once.

Nhost fits teams valuing PostgreSQL, GraphQL subscriptions, role permissions, and local/cloud parity. Compare Firebase or Appwrite for REST and mobile ecosystems, Convex for typed reactive functions, and PocketBase for a minimal single host. Test role escalation, nested-query cost, migration plus metadata rollout, event redelivery, orphan cleanup, and Postgres point-in-time recovery.

## References

- [Nhost documentation](https://docs.nhost.io/)
- [Nhost local development](https://docs.nhost.io/platform/cli/local-development)
- [Nhost GraphQL permissions](https://docs.nhost.io/products/graphql/permissions)
- [Nhost Auth users and roles](https://docs.nhost.io/products/auth/users)
- [Nhost Storage](https://docs.nhost.io/products/storage)
- [Nhost Functions](https://docs.nhost.io/products/functions)
