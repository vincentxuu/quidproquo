---
title: "Drizzle ORM: A SQL-First Database Access Layer for TypeScript"
date: 2026-08-21
category: tech
type: deep-dive
tags: [drizzle-orm, orm, typescript, sql, database, edge-computing]
lang: en
tldr: "Drizzle ORM is a SQL-first TypeScript ORM — its query builder reads like SQL, so queries written by agents are auditable in diffs. Zero dependencies, ~7.4 KB gzipped, native support for edge databases like Cloudflare D1, Neon, and Turso. Still at version 0.45.2 with no 1.0, yet weekly downloads have reached 16.9 million — surpassing Prisma's 13.8 million."
description: "An introduction to Drizzle ORM's SQL-first design philosophy, the dual-track API of query builder and relational queries, native edge runtime support (D1 / Neon / Turso), the migration toolchain, and its auditability advantage in AI agent workflows."
series:
  name: "Technology Choices in the AI Era"
  order: 17
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-21-drizzle-orm-sql-first)

This series keeps returning to one criterion: **when choosing a data access layer, optimize for auditability**. Agents will write queries for you, but you need to be able to read what they wrote in a diff and judge whether it's correct. Drizzle ORM's core value proposition sits squarely on this line — its query builder reads like SQL, not a separate DSL.

## What It Is

[Drizzle ORM](https://orm.drizzle.team/) is a TypeScript ORM, open-sourced on GitHub since 2021 under the Apache-2.0 license. The official one-liner: "If you know SQL, you know Drizzle." The design philosophy is not to invent new syntax, but to map SQL operations into type-safe TypeScript APIs — what you write and what gets sent to the database are nearly one-to-one.

As of 2026-08-21, npm weekly downloads stand at [16.9 million](https://www.npmjs.com/package/drizzle-orm), with [35,500 GitHub stars](https://github.com/drizzle-team/drizzle-orm). A notable data point: it has surpassed Prisma's 13.8 million weekly downloads — yet the version number is still [0.45.2](https://www.npmjs.com/package/drizzle-orm), with no 1.0 in sight. We'll come back to this tension.

## What SQL-First Means

A side-by-side comparison makes this concrete. TypeScript on the left, generated SQL on the right:

```typescript
// Drizzle query builder
const result = await db
  .select({ age: users.age, count: sql<number>`cast(count(${users.id}) as int)` })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.authorId))
  .where(gt(users.age, 18))
  .groupBy(users.age)
  .orderBy(desc(users.age))
  .limit(10);
```

```sql
-- Generated SQL
SELECT "age", cast(count("users"."id") as int)
FROM "users"
INNER JOIN "posts" ON "users"."id" = "posts"."author_id"
WHERE "users"."age" > 18
GROUP BY "users"."age"
ORDER BY "users"."age" DESC
LIMIT 10;
```

You can read them line by line. `select`, `from`, `innerJoin`, `where`, `groupBy`, `orderBy`, `limit` — each method name is a SQL keyword. This is fundamentally different from Prisma's `findMany({ where: { age: { gt: 18 } }, include: { posts: true } })`: Prisma invented its own query language; Drizzle chose to stay close to SQL.

**What this means for AI agent workflows**: When a coding agent writes a query for you, what you see in code review is near-SQL — your SQL knowledge applies directly, without first mentally translating ORM syntax back to SQL. This is "auditability": **agent-generated code that humans can verify via the shortest path**.

## Dual-Track API: Query Builder and Relational Queries

Drizzle provides two query approaches simultaneously:

The **SQL-like query builder** (shown above) is for when you know exactly what SQL you want — JOINs, subqueries, CTEs, aggregations, all mapped directly.

**Relational queries** (the `db.query` API) are for fetching nested relational data, with syntax closer to Prisma's `include`:

```typescript
const users = await db.query.users.findMany({
  with: {
    posts: {
      with: { comments: true },
    },
  },
});
```

The key difference: Drizzle's relational queries guarantee **exactly one SQL query** as output. No matter how many levels of `with` you nest, it consolidates everything into a single query at the ORM layer — no N+1 problem. In serverless environments (where each database round-trip carries cold-start overhead), this guarantee has real implications.

The two APIs are not mutually exclusive — you can mix them in the same project. Use the query builder for complex queries requiring precise SQL control; use relational queries for simple CRUD with nested relations.

## Native Edge Runtime Support

Drizzle has zero dependencies and weighs approximately 7.4 KB gzipped, purpose-built for serverless and edge runtimes. Its native database driver support covers the major edge databases:

| Database | Driver | Target Environment |
|---|---|---|
| [Cloudflare D1](https://orm.drizzle.team/docs/get-started/d1-new) | `d1-http` | Cloudflare Workers / Pages |
| [Neon](https://orm.drizzle.team/docs/get-started/neon-new) | `neon-http` / `neon-websockets` | Any serverless environment |
| [Turso / libSQL](https://orm.drizzle.team/docs/get-started/turso-new) | `@libsql/client` | Node / Web / edge |
| PostgreSQL | `postgres` / `pg` | Traditional servers |
| MySQL | `mysql2` | Traditional servers |
| SQLite | `better-sqlite3` | Local development |

For this blog (running on Cloudflare Workers + D1), Drizzle is one of the few ORMs that can connect to D1 directly via Workers bindings — the setup is just `drizzle(env.DB)`, no HTTP proxy layer needed.

Prisma also supports edge runtimes (via Prisma Accelerate), but requires routing through Prisma's proxy service. Drizzle goes through the binding directly with nothing in between.

## Schema Definition and Migrations

Drizzle schemas are defined in TypeScript (not Prisma's `.prisma` DSL):

```typescript
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});
```

The migration tool is [drizzle-kit](https://www.npmjs.com/package/drizzle-kit) (14.1 million weekly downloads), offering two workflows:

- **`drizzle-kit push`**: Push schema changes directly to the database — good for rapid iteration during development
- **`drizzle-kit generate` + `drizzle-kit migrate`**: Generate SQL migration files then apply them — suitable for version-controlled production deployments

For D1 migrations, setting `migrations_dir = "drizzle"` in `wrangler.toml` lets Wrangler and drizzle-kit share the same set of migration files.

## Drizzle Studio

[Drizzle Studio](https://local.drizzle.studio) is a built-in database browser — running `drizzle-kit studio` starts a local web interface for browsing and editing data. The official commitment is "free to use forever." A Chrome extension also lets you open Drizzle Studio directly within Cloudflare and Vercel Postgres admin panels.

Turso, Neon, and Replit have embedded Drizzle Studio into their own services — which is also an ecosystem signal: edge database vendors are choosing Drizzle as their preferred ORM.

## The Honest Take on 0.x

16.9 million weekly downloads, 35,500 GitHub stars — but the version is still 0.45.2, no 1.0. This is not a fact to ignore.

**Practical impact**: 0.x means no guarantee of backward compatibility. Drizzle has a track record of breaking changes — `drizzle-kit`'s versioning is even decoupled from `drizzle-orm` (currently at 0.31.10), and the compatibility matrix between them requires attention. When upgrading a production project, you need to read the changelog.

**Why no 1.0 yet**: The Drizzle team is still actively expanding database support (MSSQL and SingleStore are recent additions), and the API surface is still growing. This is not exactly the same as "not stable enough" — the core APIs (schema definition, query builder, relational queries) are quite stable, but edge features and new database support are indeed iterating rapidly.

A reasonable expectation: core features are production-ready; but read the release notes before upgrading — don't blindly run `npm update`.

## Positioning Relative to Prisma

This blog already has a dedicated [Prisma post](/posts/tech/2026-03-27-prisma-orm-typescript) — this section isn't a full comparison, just a positioning sketch:

| Aspect | Drizzle | Prisma |
|---|---|---|
| Design philosophy | SQL-first, stays close to SQL | Schema-first, custom query language |
| Schema definition | TypeScript files | `.prisma` DSL |
| Type safety | Inferred from TypeScript schema | Generated from `.prisma` via codegen |
| Edge support | Direct bindings, zero intermediaries | Requires Prisma Accelerate proxy |
| Bundle size | ~7.4 KB gzipped, zero deps | Larger (includes Rust engine) |
| Version status | 0.45.2 (no 1.0) | 6.x (stable) |
| Weekly downloads | 16.9M | 13.8M |

**How to choose**: If your project runs on an edge runtime, you care about bundle size, or you want agent-written queries that you can audit with raw SQL knowledge — Drizzle is the better fit. If you need a mature migration toolchain, stable version commitments, or your team is already fluent in Prisma's mental model — Prisma remains a good choice. They are different trade-offs, not replacements.

## Agent Friendliness

Returning to this series' core theme, Drizzle has several concrete advantages for AI agent workflows:

**Auditability**: The query builder outputs near-SQL, eliminating the need for mental translation during code review. When an agent writes a JOIN, you can judge its correctness with SQL knowledge directly.

**llms.txt**: Drizzle's documentation site provides a comprehensive [llms.txt](https://orm.drizzle.team/llms.txt) with 50+ quickstart guide indexes — agents can fetch up-to-date API documentation instead of relying on stale training data. This connects to [the llms.txt post in this series](/posts/tech/2026-08-21-llms-txt).

**TypeScript schema**: Schema definitions are plain TypeScript, not a separate DSL, reducing friction for agents reading and generating code.

**Bundle size**: 7.4 KB gzipped means virtually zero overhead for edge function cold starts and deployment — adding an ORM dependency via an agent won't blow up your Worker's startup time.

## The Bottom Line

Drizzle bets on a simple judgment: **SQL is the most stable API of the past 50 years — don't build another language on top of it**. This judgment has earned a bonus in the AI era — when your queries are written by agents, "the output looks just like SQL" shifts from a developer preference to an engineering requirement. Combined with zero dependencies, native edge support, and ecosystem validation from 16.9 million weekly downloads, Drizzle is an option that TypeScript projects in 2026 should seriously evaluate — provided you accept the 0.x version reality.

## References

- [Drizzle ORM Official Docs](https://orm.drizzle.team/)
- [Drizzle ORM GitHub](https://github.com/drizzle-team/drizzle-orm)
- [Drizzle ORM npm](https://www.npmjs.com/package/drizzle-orm)
- [Drizzle + Cloudflare D1 Quickstart](https://orm.drizzle.team/docs/get-started/d1-new)
- [Drizzle + Neon Quickstart](https://orm.drizzle.team/docs/get-started/neon-new)
- [Drizzle + Turso Quickstart](https://orm.drizzle.team/docs/get-started/turso-new)
- [Drizzle Relational Queries Docs](https://orm.drizzle.team/docs/rqb)
- [Drizzle llms.txt](https://orm.drizzle.team/llms.txt)
- Related on this site: [Prisma ORM: Type-Safe Database Access for TypeScript Projects](/posts/tech/2026-03-27-prisma-orm-typescript-en)
- Related on this site: [llms.txt: Writing Documentation for Machines](/posts/tech/2026-08-21-llms-txt-en)
