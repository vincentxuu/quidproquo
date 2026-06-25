---
title: "Cloudflare D1: SQLite Relational Database at the Edge"
date: 2026-03-27
type: guide
category: tech
tags: [cloudflare-d1, sqlite, serverless, edge, cloudflare-workers, database]
lang: en
tldr: "D1 is Cloudflare's serverless SQLite database that binds directly to Workers, supports full SQL (JOINs, transactions), and handles automatic backups. It's well-suited for small-to-medium relational data needs — NobodyClimb uses it as its primary database."
description: "An introduction to Cloudflare D1: a SQLite-based serverless relational database. Covers Workers binding, basic CRUD, wrangler migration workflow, comparison with PostgreSQL/MySQL, and when to choose D1 over KV."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database)

D1 is Cloudflare's serverless relational database, built on SQLite. It runs on the same edge node as your Workers — no round-trip to a separate region — which keeps query latency low and setup overhead minimal. If you've already committed to Cloudflare Workers, D1 is the most natural relational database option.

## Core Features

- **Full SQL support**: JOINs, subqueries, transactions, FOREIGN KEYs — everything SQLite supports, D1 supports
- **Workers binding**: Access your database directly via `env.DB` in Worker code, no connection strings or connection pools to manage
- **Automatic replication and backups**: Cloudflare handles the underlying replication; no snapshot configuration required
- **Wrangler migrations**: Manage schema versions with `wrangler d1 migrations apply`
- **HTTP API**: In addition to the Workers binding, D1 also exposes a REST API for external access

## Basic CRUD

**wrangler.toml binding**

```toml
[[d1_databases]]
binding = "DB"
database_name = "nobodyclimb"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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

`batch()` executes all statements within the same transaction — if any one fails, the entire batch is rolled back.

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
| Latency | Runs beside the Worker, extremely low | Round-trip to a separate region, typically 10–50ms |
| SQL support | SQLite syntax subset | Full PostgreSQL / MySQL |
| Concurrent writes | Single-point SQLite; high-concurrency writes are queued | Supports high concurrency |
| Features | No stored procedures, no pg extensions | Rich extension ecosystem |
| Cost | Generous free tier; pay-per-row-read/write | EC2 + RDS fixed costs are high |

**When D1 makes sense:**
- Small-to-medium projects with moderate write volume (hundreds of writes per second or fewer)
- Already running on Cloudflare Workers
- No need for PostgreSQL-specific features (JSONB indexes, pgvector, stored procedures)
- Minimizing infrastructure management overhead is a priority

**When to switch away:**
- High-concurrency writes (thousands per second) — SQLite's single-writer model becomes a bottleneck
- Complex SQL requirements or PostgreSQL extensions
- Database size approaching the 10 GB limit

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

KV is not a database — it only supports exact-key lookups with no query capabilities. For anything like "fetch all climbing records for a given user," you need D1. For a detailed comparison, see [Cloudflare KV](/posts/tech/2026-03-27-cloudflare-kv-key-value-store).

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

For architecture details, see [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture).

## Trade-offs and Limitations

**Advantages**
- Zero-config: wrangler creates and connects it — no VPC, connection pool, or SSL certificates
- Full SQL: JOINs, transactions, subqueries — not a stripped-down API
- Runs beside the Worker, extremely low latency
- Generous free tier (5 GB storage, 5 million row reads/day)

**Disadvantages**
- SQLite single-writer model: high-concurrency write scenarios will queue up — this is an architectural constraint, not a bug
- No stored procedures or triggers (SQLite limitation)
- 10 GB database size limit (expandable on enterprise plans; sufficient for most use cases)
- Still maturing: D1 is quite stable, but API and pricing occasionally change — track the changelog for production use

## Pricing

- **Free plan**: 5 GB storage, 5 million row reads/day, 100K row writes/day
- **Paid plan (Workers Paid from $5/month)**: 50 GB storage; overage billed per row read/write ($0.001 / 1M row reads, $1.00 / 1M row writes)

Write costs are significantly higher than read costs — design your schema and queries to avoid unnecessary writes, and batch operations with `batch()` wherever possible.

## References

- [Cloudflare D1 Official Docs](https://developers.cloudflare.com/d1/)
- [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [Cloudflare Workers: Getting Started with Edge Compute](/posts/tech/2026-03-27-cloudflare-workers-edge-compute)
- [Cloudflare KV: Global Edge Key-Value Store](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)
- [Cloudflare R2: Object Storage with Zero Egress Fees](/posts/tech/2026-03-27-cloudflare-r2-object-storage)
