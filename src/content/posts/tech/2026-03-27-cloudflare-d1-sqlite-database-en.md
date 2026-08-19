---
title: "Cloudflare D1: SQLite Relational Database at the Edge"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [cloudflare-d1, sqlite, serverless, edge, cloudflare-workers, database]
lang: en
tldr: "D1 is Cloudflare's serverless SQLite database that binds directly to Workers, supports full SQL (JOINs, transactions), and handles automatic backups. It's well-suited for small-to-medium relational data needs — NobodyClimb uses it as its primary database."
description: "An introduction to Cloudflare D1: a SQLite-based serverless relational database. Covers Workers binding, basic CRUD, wrangler migration workflow, comparison with PostgreSQL/MySQL, and when to choose D1 over KV."
draft: false
series:
  name: "The Cloudflare Edge Stack"
  order: 2
---

🌏 [中文版](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database)

D1 is Cloudflare's serverless relational database, built on SQLite. It shares the Cloudflare platform with your Workers and keeps setup overhead minimal — but do not read that as "the database runs at every edge node alongside the Worker": without read replication, [D1 routes both reads and writes to a primary instance in a single location in the world](https://developers.cloudflare.com/d1/best-practices/read-replication/), and latency depends on how far the user is from it. If you've already committed to Cloudflare Workers, D1 is the most natural relational database option.

## Core Features

- **Full SQL support**: JOINs, subqueries, transactions, FOREIGN KEYs — everything SQLite supports, D1 supports
- **Workers binding**: Access your database directly via `env.DB` in Worker code, no connection strings or connection pools to manage
- **Time Travel**: built-in point-in-time recovery — roll the database back to an earlier moment without scheduling your own snapshots (retention window depends on plan; see the official limits page)
- **Wrangler migrations**: Manage schema versions with `wrangler d1 migrations apply`
- **Read replication**: optional read-only replicas that spread reads across locations. The [official docs](https://developers.cloudflare.com/d1/best-practices/read-replication/) state replicas cost nothing extra — you still pay by `rows_read` / `rows_written`
- **HTTP API**: In addition to the Workers binding, D1 also exposes a REST API for external access

## Basic CRUD

**Wrangler configuration binding** (Cloudflare recommends `wrangler.jsonc` for new projects)

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "nobodyclimb",
      "database_id": "<DATABASE_ID>"
    }
  ]
}
```

**Working with D1 in a Worker**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Parameterized query
    const user = await env.DB.prepare(
      'SELECT id, username, email FROM users WHERE id = ?'
    )
      .bind(userId)
      .first<User>();

    // Insert
    await env.DB.prepare(
      'INSERT INTO climbs (user_id, route_name, grade, notes) VALUES (?, ?, ?, ?)'
    )
      .bind(userId, routeName, grade, notes)
      .run();

    // Batch queries (single round-trip)
    const [users, climbs] = await env.DB.batch([
      env.DB.prepare('SELECT * FROM users WHERE active = 1'),
      env.DB.prepare('SELECT * FROM climbs WHERE created_at > ?').bind(since),
    ]);

    return Response.json(user);
  },
};
```

**Transactions**

```typescript
const { success } = await env.DB.batch([
  env.DB.prepare('UPDATE users SET ai_quota_used = ai_quota_used + 1 WHERE id = ? AND ai_quota_used < ai_quota_limit').bind(userId),
  env.DB.prepare('INSERT INTO ai_usages (user_id, tokens_used, created_at) VALUES (?, ?, ?)').bind(userId, tokensUsed, now),
]);
```

`batch()` executes the statements sequentially inside a single transaction — if any one fails, the entire batch is rolled back.

One limit is easy to trip over: **there is a cap on how many D1 queries a single Worker invocation may issue**, much tighter on the free plan, and every statement inside a batch counts individually. Turning an N+1 query into a JOIN or a batch is not only a performance question — it decides whether you hit the wall at all.

## Schema and Migrations

D1 uses wrangler to manage migrations:

```bash
# Create a migration file
wrangler d1 migrations create nobodyclimb "create users table"

# Apply to local dev environment
wrangler d1 migrations apply nobodyclimb --local

# Apply to production
wrangler d1 migrations apply nobodyclimb --remote
```

Migration files live in the `migrations/` directory and are plain SQL:

```sql
-- migrations/0001_create_users.sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  climber_rank TEXT NOT NULL DEFAULT 'foothill',
  ai_quota_used INTEGER NOT NULL DEFAULT 0,
  ai_quota_limit INTEGER NOT NULL DEFAULT 2,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

Wrangler maintains a `d1_migrations` table inside D1 to track applied versions — already-applied migrations are never re-run.

## D1 vs Traditional Databases

| | D1 | PostgreSQL / MySQL |
|---|---|---|
| Deployment complexity | Near-zero (wrangler handles it) | Requires RDS, VPC, connection pooling |
| Latency | Depends on distance to the primary instance; read replication helps | Round-trip to a separate region |
| SQL support | SQLite syntax subset | Full PostgreSQL / MySQL |
| Concurrent writes | Single-point SQLite; high-concurrency writes are queued | Supports high concurrency |
| Features | No stored procedures, no pg extensions | Rich extension ecosystem |
| Cost | Free allowance, then per row read/written and per GB stored | EC2 + RDS fixed costs are high |

D1 throughput has a mental model you can compute, and the docs state it outright: **each D1 database is backed by a single Durable Object and processes one query at a time**, so throughput is simply "one second ÷ average query duration". Queries averaging 1 ms give roughly 1,000 per second; queries averaging 100 ms give 10 per second. On D1, optimizing a slow query does not just cut cost — it buys throughput directly.

**When D1 makes sense:**
- Small-to-medium projects with moderate write volume (hundreds of writes per second or fewer)
- Already running on Cloudflare Workers
- No need for PostgreSQL-specific features (JSONB indexes, pgvector, stored procedures)
- Minimizing infrastructure management overhead is a priority

**When to switch away:**
- High-concurrency writes (thousands per second) — SQLite's single-writer model becomes a bottleneck
- Complex SQL requirements or PostgreSQL extensions
- A single database approaching the size ceiling — the official answer is sharding across databases rather than growing one ([the limits page](https://developers.cloudflare.com/d1/platform/limits/) says D1 is designed to "scale out across multiple, smaller (10 GB) databases", and per-user or per-tenant sharding is the recommended pattern). Whether the per-database ceiling can be raised case by case is not something the docs currently state; [what you can ask to have raised is the account-wide storage limit](https://developers.cloudflare.com/d1/observability/debug-d1/), which is a different thing

## D1 vs KV

These two are the most commonly confused choices in the Cloudflare ecosystem:

| Use Case | Choice |
|------|------|
| User data, relational data, need JOINs | D1 |
| Caching, ephemeral data, feature flags | KV |
| ACID transactions required | D1 |
| Global ultra-low-latency reads | KV |
| Range queries / complex filtering | D1 |
| Read-heavy, eventual consistency acceptable | KV |

KV is not a database — it only supports exact-key lookups with no query capabilities. For anything like "fetch all climbing records for a given user," you need D1. For a detailed comparison, see [Cloudflare KV](/posts/tech/2026-03-27-cloudflare-kv-key-value-store-en).

## How NobodyClimb Uses D1

NobodyClimb uses D1 as its primary database, storing all relational data there:

- **users**: Basic user info, Climber Rank, AI quota
- **climbs**: Climbing records (route, grade, outcome, date)
- **stories**: Community stories and trip reports
- **ai_usages**: Token usage logs for AI Q&A (quota deduction via atomic UPDATE)
- **embeddings metadata**: Metadata for the vector index (vectors themselves live in Vectorize)

The atomic quota deduction is one of D1's most critical use cases in NobodyClimb — a dual-condition UPDATE that avoids race conditions:

```sql
UPDATE users
SET ai_quota_used = ai_quota_used + 1
WHERE id = ? AND ai_quota_used < ai_quota_limit
```

This query only updates when quota remains. If `changes()` returns 0, the quota is exhausted — no separate SELECT + check needed.

For architecture details, see [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en).

## Trade-offs and Limitations

**Advantages**
- Zero-config: wrangler creates and connects it — no VPC, connection pool, or SSL certificates
- Full SQL: JOINs, transactions, subqueries — not a stripped-down API
- Runs beside the Worker, extremely low latency
- The free plan is enough to run a real project

**Disadvantages**
- SQLite single-writer model: high-concurrency write scenarios will queue up — this is an architectural constraint, not a bug
- No stored procedures (but **triggers are supported** — SQLite has them, and D1's SQL documentation references both `CREATE TRIGGER` and `PRAGMA recursive_triggers`)
- A per-database size ceiling that is **explicitly not raisable** — if the data will grow, plan the sharding up front
- The free plan's **per-database size ceiling is far below the paid one** — 500 MB against 10 GB, a 20x gap that is easy to misjudge during development
- Large bulk `UPDATE` / `DELETE` statements hit execution limits; the docs recommend chunking them into batches of roughly a thousand rows

## The Shape of the Billing

Exact numbers live in [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/) and [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/). Three things matter for design decisions:

1. **You are billed for rows scanned, not rows returned.** A `SELECT *` full scan over a five-thousand-row table is five thousand rows read, even if you use one of them. This is why indexes show up directly on the D1 bill.
2. **Per-million writes cost orders of magnitude more than reads.** Indexes also add a written row when the write touches an indexed column (one to the table, one to the index) — the docs still recommend indexing, because the reads saved almost always outweigh the extra write.
3. **The free plan's daily read/write allowances are hard walls.** Hit one and D1 returns errors account-wide until the 00:00 UTC reset. Have an error path for that before you launch.

There are no egress or bandwidth charges.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Cloudflare Edge Stack" series.

## References

- [Cloudflare D1 Official Docs](https://developers.cloudflare.com/d1/)
- [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/) — size, queries per invocation, SQL statement length, and other hard limits
- [D1 read replication](https://developers.cloudflare.com/d1/best-practices/read-replication/)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [Cloudflare Workers: Getting Started with Edge Compute](/posts/tech/2026-03-27-cloudflare-workers-edge-compute-en)
- [Cloudflare KV: Global Edge Key-Value Store](/posts/tech/2026-03-27-cloudflare-kv-key-value-store-en)
- [Cloudflare R2: Object Storage with Zero Egress Fees](/posts/tech/2026-03-27-cloudflare-r2-object-storage-en)
