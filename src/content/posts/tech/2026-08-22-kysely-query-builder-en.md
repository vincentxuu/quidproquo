---
title: "Kysely: A Type-Safe TypeScript Query Builder That Keeps SQL Visible"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kysely, typescript, sql, database, query-builder]
lang: en
tldr: "Kysely derives query results from database types while preserving SQL and escape hatches, but teams must still keep migrations, the live schema, and generated types aligned."
description: "Kysely's type model, query composition, transactions, migrations, raw SQL boundaries, and tradeoffs against an ORM."
series:
  name: "Technology Choices in the AI Era"
  order: 47
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-kysely-query-builder)

[Kysely](https://kysely.dev/docs/intro) is a type-safe SQL query builder for TypeScript. It does not turn database rows into lifecycle-aware entities or pretend SQL is absent. Supply database schema types and the builder infers parameters and results across selections, joins, aliases, and expressions.

## Types come from a schema, not the connection

```ts
interface DB {
  person: {
    id: Generated<number>;
    email: string;
    tenant_id: string;
  };
}

const person = await db
  .selectFrom('person')
  .select(['id', 'email'])
  .where('tenant_id', '=', tenantId)
  .where('id', '=', personId)
  .executeTakeFirst();
```

The result contains only `id` and `email`; column names, values, and join relations are checked too. This is closer to the actual query shape than returning a whole model and hand-writing a DTO.

TypeScript does not inspect the production schema at runtime. If types claim a column exists but its migration was not deployed, execution still fails. Generate types from migrations or introspection, detect drift in CI, and model nullable, generated, and dialect-specific columns deliberately.

## Compose SQL without hiding it

The fluent API covers common CRUD, CTEs, subqueries, aggregates, and dialect expressions. A `sql` template handles database-specific features. Keep values parameterized; never interpolate user text into identifiers or SQL strings.

Dynamic filters need stronger boundaries. If an agent chooses columns, ordering, or expressions, do not translate its output directly into raw SQL. Map input through fixed column and operator allowlists, tenant predicates, and row limits. Type safety does not provide query authorization, timeouts, or cost controls.

## Transaction and migration boundaries

The [Kysely API](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html) includes transactions, a schema module, and migration primitives. Use only the transaction handle inside a callback so failures roll back. External API calls are not atomic with the database; use an outbox, idempotency keys, or durable workflows.

Kysely migrations do not mean changing an interface updates production. Deploys still need expand, migrate, and contract phases. With rolling deployment, add compatible columns first, backfill and switch reads, then remove old columns last.

## Choosing against an ORM

An ORM may be convenient when a product centers on aggregates, relation loading, unit of work, identity maps, or a full schema lifecycle. Kysely is thinner when the team reads SQL, query shapes vary, and joins and projections require precise control.

Relations, validation, authorization, caching, and domain invariants do not appear automatically. A practical test generates types from a test database, omits one migration, and confirms drift detection fails. Then run `EXPLAIN` on the hardest query: correct types do not guarantee correct indexes or cost.

## References

- [Kysely introduction](https://kysely.dev/docs/intro)
- [Kysely API documentation](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html)
- [Kysely type safety](https://kysely-org-kysely.mintlify.app/core-concepts/type-safety)
