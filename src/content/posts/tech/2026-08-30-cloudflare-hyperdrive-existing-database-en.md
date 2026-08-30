---
title: "How to Use Cloudflare Hyperdrive: Connecting Workers to Existing Postgres / MySQL"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-hyperdrive, database, postgres, mysql, serverless]
lang: en
tldr: "Hyperdrive solves the latency and connection-pooling problem when Workers connect to existing Postgres / MySQL databases. It uses edge connection setup, database-near pooling, and read query caching so a regional database works better with global Workers."
description: "A practical guide to Cloudflare Hyperdrive: positioning, Postgres/MySQL connectivity, Workers bindings, connection pooling, query caching, read-after-write behavior, limits, pricing, and observability."
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 10
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-hyperdrive-existing-database)

After moving an API to [Cloudflare Workers](https://developers.cloudflare.com/workers/), the database is usually the first hard edge. You may already have [Postgres](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/) running on AWS, GCP, Azure, Neon, Supabase, PlanetScale, RDS, or Aurora. The application runtime can be global, while the database still lives in one region.

[Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) addresses that gap. When a serverless runtime like Workers connects to an existing database from many locations, connection setup is slow, connection counts can spike, and popular read queries repeatedly hit the origin. Hyperdrive gives Workers a binding that works with existing drivers, while Hyperdrive manages connection pooling and cacheable read queries.

This post belongs after D1, Durable Objects, Queues, and Workflows in the Cloudflare Edge Platform series because it answers a common migration question: "I do not want to rewrite the data layer yet, but I do want to move the app runtime to Cloudflare."

## Where Hyperdrive Fits

Hyperdrive belongs between a Workers app and an existing relational database.

```txt
Browser / API client
        |
        v
Cloudflare Worker
        |
        v
Hyperdrive binding
        |
        +--> connection setup near Worker
        +--> connection pool near database
        +--> optional read query cache
        |
        v
Existing Postgres / MySQL
```

Cloudflare describes Hyperdrive as making an existing regional database feel globally distributed. Read that carefully. The data still lives in the original database; transactions, schema, writes, backups, replication, and migrations remain database-layer concerns. Hyperdrive improves the network and connection layer between Workers and that database.

The split with other Cloudflare data services looks like this:

| Need | Service |
|---|---|
| A new SQLite relational database | [D1](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database-en) |
| Existing Postgres / MySQL access from Workers | Hyperdrive |
| Strong per-entity state, locks, WebSockets | [Durable Objects](/posts/tech/2026-08-22-cloudflare-durable-objects-en) |
| Slow jobs or batch processing | [Queues](/posts/tech/2026-08-22-cloudflare-queues-en) |
| Long-running multi-step processes | [Workflows](/posts/tech/2026-08-30-cloudflare-workflows-durable-steps-en) |

If you have not chosen a database yet and the data model fits SQLite, D1 is simpler. If the data already lives in Postgres/MySQL, or the team already uses Prisma, Drizzle, Kysely, or node-postgres, Hyperdrive is usually the lower-migration path.

## How It Makes a Regional Database Faster

Workers is a global runtime. Traditional databases usually sit in one region, and connection setup is expensive. Cloudflare's getting started guide breaks that down directly: before a query can be sent, TCP, TLS, and database authentication may already have consumed several round trips.

Hyperdrive uses three mechanisms:

- **Edge connection setup**: the Worker establishes its connection to nearby Hyperdrive infrastructure, avoiding long setup round trips to the database region.
- **Connection pooling**: Hyperdrive maintains reusable database connections near the origin database.
- **Query caching**: cacheable read-only queries can return from Hyperdrive instead of hitting the origin database.

That leads to two design conclusions.

First, if a request sends one query, keeping the Worker close to the user usually still makes sense; Hyperdrive already helps with connection setup and pooling. Second, if one request sends several sequential uncached queries, Cloudflare recommends considering [Placement](https://developers.cloudflare.com/workers/configuration/placement/) to run the Worker near the database region so every SQL round trip is shorter.

```jsonc
{
  "placement": {
    "region": "aws:us-east-1"
  }
}
```

This is not a default setting for every Worker. It fits database-heavy request paths whose queries cannot be mostly absorbed by cache.

## Create a Hyperdrive Configuration

Hyperdrive currently supports Postgres, MySQL, and compatible databases. The official support table lists PostgreSQL 9.0 to 17.x and MySQL 5.7 to 8.x, plus compatible services such as Aurora, Neon, Supabase, Timescale, Materialize, CockroachDB, PlanetScale, and MariaDB. SQL Server and MongoDB are not currently supported.

Create a configuration with a database connection string:

```sh
npx wrangler hyperdrive create app-prod-db \
  --connection-string="postgres://user:password@database.example.com:5432/app"
```

Or for MySQL:

```sh
npx wrangler hyperdrive create app-prod-db \
  --connection-string="mysql://user:password@database.example.com:3306/app"
```

Wrangler returns a Hyperdrive config ID. Add it to `wrangler.jsonc`:

```jsonc
{
  "compatibility_date": "2026-08-30",
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<your-hyperdrive-id>"
    }
  ]
}
```

If the Worker compatibility date is before 2026-08-04, database drivers need the `nodejs_compat` flag. For compatibility dates from 2026-08-04 onward, Cloudflare's docs say Workers and Pages projects enable Node.js compatibility v1/v2 by default. Existing projects do not need to remove older flags just because the date changed.

For local development, add `localConnectionString`:

```jsonc
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<your-hyperdrive-id>",
      "localConnectionString": "postgres://local:local@127.0.0.1:5432/app"
    }
  ]
}
```

The production connection string should not be committed. Create the Hyperdrive configuration through Wrangler, let Cloudflare store the secret, and use only the binding in Worker code.

## Use It From Workers

With Postgres, the `pg` example is straightforward:

```ts
import { Client } from "pg";

export default {
  async fetch(request, env): Promise<Response> {
    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString,
    });

    try {
      await client.connect();
      const result = await client.query(
        "SELECT id, title FROM posts WHERE published = $1 ORDER BY created_at DESC LIMIT 20",
        [true],
      );

      return Response.json({ posts: result.rows });
    } finally {
      await client.end();
    }
  },
} satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
```

Creating a new client per request can feel wrong if you come from a long-running Node server. Hyperdrive's docs explicitly allow this because Hyperdrive maintains the underlying database connection pool.

For MySQL, use `mysql2/promise` and pass the host/user/password/database/port fields from the Hyperdrive binding:

```ts
import { createConnection } from "mysql2/promise";

export default {
  async fetch(request, env): Promise<Response> {
    const connection = await createConnection({
      host: env.HYPERDRIVE.host,
      user: env.HYPERDRIVE.user,
      password: env.HYPERDRIVE.password,
      database: env.HYPERDRIVE.database,
      port: env.HYPERDRIVE.port,
      disableEval: true,
    });

    try {
      const [rows] = await connection.query(
        "SELECT id, title FROM posts WHERE published = ? ORDER BY created_at DESC LIMIT 20",
        [true],
      );
      return Response.json({ posts: rows });
    } finally {
      await connection.end();
    }
  },
} satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
```

`disableEval: true` reflects a Workers runtime constraint: `mysql2` cannot use its eval-based parser there.

## Query Caching: Useful, but Know the Boundary

Hyperdrive enables query caching by default. The defaults are `max_age = 60 seconds` and `stale_while_revalidate = 15 seconds`; `max_age` can be configured up to 1 hour.

Hyperdrive parses the database protocol to decide whether a query mutates data. Read-only queries such as `SELECT` may be cached; `INSERT`, `UPDATE`, `DELETE`, and `CREATE` are not. PostgreSQL stable or volatile functions such as `NOW()`, `CURRENT_TIMESTAMP`, `RANDOM()`, and `LASTVAL()` also prevent caching. Cloudflare recommends calculating those values in the application and passing them as SQL parameters.

```sql
-- Easier to cache: compute time in the app and pass it as a parameter
SELECT * FROM events WHERE created_at > $1 ORDER BY created_at DESC LIMIT 50;
```

The main warning is read-after-write behavior. Hyperdrive does not purge cached reads when your app writes to the database. After a write, a matching `SELECT` may still return the cached result until `max_age` expires.

My default split is two Hyperdrive configurations:

```sh
npx wrangler hyperdrive create app-prod-cached \
  --connection-string="<DATABASE_CONNECTION_STRING>"

npx wrangler hyperdrive create app-prod-fresh \
  --connection-string="<DATABASE_CONNECTION_STRING>" \
  --caching-disabled
```

Bind both:

```jsonc
{
  "hyperdrive": [
    {
      "binding": "DB_CACHED",
      "id": "<cached-config-id>"
    },
    {
      "binding": "DB_FRESH",
      "id": "<cache-disabled-config-id>"
    }
  ]
}
```

Then route deliberately:

- Public content, product catalogs, leaderboards, and dashboard summaries use `DB_CACHED`.
- Auth, sessions, permissions, billing, admin settings, and reads immediately after writes use `DB_FRESH`.

This is more practical than disabling cache everywhere. You keep acceleration for popular reads without hiding consistency requirements in SQL comments or local convention.

## Connection Pooling Pitfalls

Hyperdrive's pool runs in transaction mode. When a query or transaction ends, the connection returns to the pool and is reset. That has practical consequences:

- Do not assume connection-level `SET` state survives the next query.
- If a query needs a session setting, set it for that query or transaction.
- Do not wrap many operations in a long transaction just to preserve `SET` state; long transactions hold pool connections and reduce Hyperdrive scaling.
- If multiple Hyperdrive configurations point to the same database, count the combined origin connections.

The current limits page lists approximate maximum origin database connections per configuration: about 20 on Free and about 100 on Paid, with a minimum of 5 connections. These are database-side connections, not Worker-to-Hyperdrive client concurrency; Hyperdrive does not limit concurrent client connections from Workers.

The errors to watch for are:

- `Failed to acquire a connection from the pool.`
- `Server connection attempt failed: connection_refused`

The first often means long queries or transactions are holding connections too long. The second usually points to firewall, ACL, or database-provider connection limits.

## Observability: Watch Cache Status and Pool Pressure

Hyperdrive exposes dashboard metrics and [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) datasets. The docs list two datasets:

- `hyperdriveQueriesAdaptiveGroups`
- `hyperdrivePoolSizesAdaptiveGroups`

I would start with:

- query volume
- query latency
- connection latency
- cache status: `hit`, `miss`, `uncacheable`, `volatile`, `transaction`, `parseerror`
- avg/max open connections
- waiting clients

`volatile` is especially useful: it means the query contained a PostgreSQL stable or volatile function such as `NOW()` or `RANDOM()`, so cache could not apply. Rising `waitingClients` indicates pool pressure and should send you to long queries, transactions, connection counts, or the database provider's connection limit.

## Limits and Pricing

As of the official docs checked on 2026-08-30:

- Hyperdrive is available on Workers Free and Paid plans.
- Free plan includes 100,000 database queries per day; Paid plan lists unlimited database queries.
- A database query means any statement through Hyperdrive, including `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, and `DROP`.
- Free supports up to 10 configured databases; Paid supports up to 25.
- Initial connection timeout is 15 seconds; idle connection timeout is 10 minutes.
- Maximum query statement duration is 60 seconds.
- Maximum cached query response size is 50 MB; larger responses still return to Workers but are not cached.
- Connection pooling and query caching are included in Workers Paid.
- Hyperdrive does not charge for data transfer or egress.

These numbers can change, so recheck pricing and limits before publication. The more durable lesson is the shape of the constraint: Hyperdrive is bounded by database statements, configuration count, origin connection pools, and query duration, not by VM-style machine sizing.

## When Not to Use Hyperdrive

I would not start with Hyperdrive in these cases:

- A new small project has a simple schema and fits D1.
- The request path depends on many long transactions or connection-level session state.
- The database is only reachable on a private network, and Workers VPC or another connection path is not configured.
- The main bottleneck is bad SQL, missing indexes, or a poor query plan; Hyperdrive can reduce connection and network cost, but it will not fix the query itself.
- You need multi-region writes, consistency replication, or database high availability; those remain database-layer responsibilities.

Good fits:

- An existing SaaS backend wants edge APIs, but the database cannot move yet.
- Postgres/MySQL is already the team standard, with mature ORM and migration tooling.
- Global read traffic repeatedly hits one regional database.
- Popular reads can tolerate short staleness around 15 to 60 seconds.
- Workers need to reach Neon, Supabase, Aurora, PlanetScale, or similar databases.

## Production Checklist

Before launch, I would check:

- The database hostname resolves through public DNS; for private networks, set up Workers VPC first.
- TLS is configured correctly; Hyperdrive does not support insecure plaintext database connections.
- The database user has only the permissions it needs.
- Compatibility date and Node.js compatibility match driver requirements.
- Postgres driver versions meet Cloudflare's minimums; MySQL uses `disableEval`.
- Public reads and fresh reads use separate Hyperdrive bindings.
- Auth, permissions, billing, and read-after-write paths avoid the cached binding.
- Long transactions have timeouts and monitoring.
- GraphQL or dashboard metrics track cache status, query latency, pool size, and waiting clients.
- Database-provider firewall and ACL rules allow Hyperdrive connections.

Hyperdrive does not replace the database. It lets Workers connect to existing Postgres/MySQL without turning every request into a slow, connection-heavy cross-region database call. In the Edge Platform, it is a migration bridge: move the runtime closer to users first, then decide which data should remain in the existing database and which parts should move to D1, R2, KV, or Durable Objects.

## References

- [Cloudflare Hyperdrive — Overview](https://developers.cloudflare.com/hyperdrive/)
- [Cloudflare Hyperdrive — Getting started](https://developers.cloudflare.com/hyperdrive/get-started/)
- [Cloudflare Hyperdrive — How Hyperdrive works](https://developers.cloudflare.com/hyperdrive/concepts/how-hyperdrive-works/)
- [Cloudflare Hyperdrive — Query caching](https://developers.cloudflare.com/hyperdrive/concepts/query-caching/)
- [Cloudflare Hyperdrive — Connection pooling](https://developers.cloudflare.com/hyperdrive/concepts/connection-pooling/)
- [Cloudflare Hyperdrive — Connect to PostgreSQL](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)
- [Cloudflare Hyperdrive — Supported databases and features](https://developers.cloudflare.com/hyperdrive/reference/supported-databases-and-features/)
- [Cloudflare Hyperdrive — Metrics and analytics](https://developers.cloudflare.com/hyperdrive/observability/metrics/)
- [Cloudflare Hyperdrive — Limits](https://developers.cloudflare.com/hyperdrive/platform/limits/)
- [Cloudflare Hyperdrive — Pricing](https://developers.cloudflare.com/hyperdrive/platform/pricing/)
