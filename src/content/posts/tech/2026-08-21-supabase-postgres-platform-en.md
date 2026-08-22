---
title: "Supabase: A Platform Built Entirely on PostgreSQL"
date: 2026-08-21
category: tech
type: deep-dive
tags: [supabase, postgresql, baas, pgvector, realtime, open-source, database]
lang: en
tldr: "Supabase isn't just an open-source Firebase alternative — its core design builds Auth, Storage, and Realtime entirely on PostgreSQL schemas and WAL. The result: everything is queryable with SQL, pgvector works out of the box, and AI agents can operate the entire platform by writing SQL. 108k GitHub stars, Apache 2.0, free tier with 500 MB database."
description: "Supabase architecture teardown: Auth is a Postgres table, Storage metadata is a Postgres table, Realtime reads the WAL. Why 'everything is SQL' is particularly advantageous for AI agents, plus pricing, pgvector integration, and the MCP server."
draft: false
series:
  name: "Technology Choices in the AI Era"
  order: 20
glossary:
  - term: "BaaS"
    aliases: ["Backend-as-a-Service"]
    definition: "後端即服務，提供資料庫、驗證、儲存等後端功能的雲端平台，讓開發者不用自己架設伺服器。"
    definition_en: "Backend-as-a-Service — a cloud platform providing database, auth, storage and other backend capabilities so developers don't need to run their own servers."
  - term: "WAL"
    aliases: ["Write-Ahead Log"]
    definition: "PostgreSQL 的預寫日誌，所有資料變更先寫進 WAL 再落盤，用於保證交易安全和資料複寫。"
    definition_en: "Write-Ahead Log — PostgreSQL writes all changes to this log before committing to disk, ensuring transaction safety and enabling replication."
  - term: "RLS"
    aliases: ["Row Level Security"]
    definition: "PostgreSQL 的列層級安全性，透過 policy 控制每個使用者能看到和修改哪些資料列。"
    definition_en: "Row Level Security — PostgreSQL's mechanism for controlling which rows each user can see and modify through declarative policies."
---

> 🌏 [中文版](/posts/tech/2026-08-21-supabase-postgres-platform)

[Supabase](https://supabase.com/) is often introduced as "the open-source Firebase alternative." That positioning isn't wrong, but it obscures the more interesting architectural decision: **the entire platform is built on PostgreSQL**, rather than inventing its own data model.

Auth user data lives in PostgreSQL's `auth` schema. Storage file metadata lives in PostgreSQL's `storage` schema. Realtime reads PostgreSQL's WAL (Write-Ahead Log). This means you can query everything with SQL — and in the AI era, that's worth more than it might seem.

As of August 2026, Supabase has [108k stars on GitHub](https://github.com/supabase/supabase), an Apache 2.0 license, and runs PostgreSQL 17 by default.

---

## Architecture: Seven Services, One PostgreSQL

Supabase's architecture can be understood as **a single PostgreSQL database instance with seven services in front of it**, each handling one concern, all unified behind an Envoy API gateway.

| Service | Function | Built with | License |
|---|---|---|---|
| [PostgREST](https://postgrest.org/) | Auto-generates REST API from database schema | Haskell | MIT |
| [GoTrue](https://github.com/supabase/auth) | JWT auth & user management | Go | MIT |
| [Realtime](https://github.com/supabase/realtime) | WebSocket broadcast of database changes | Elixir / Phoenix | Apache 2.0 |
| [Storage API](https://github.com/supabase/storage-api) | S3-compatible object storage | TypeScript | Apache 2.0 |
| [pg_graphql](https://github.com/supabase/pg_graphql) | GraphQL API (PostgreSQL extension) | Rust | Apache 2.0 |
| [Supavisor](https://github.com/supabase/supavisor) | Connection pooling | Elixir | Apache 2.0 |
| [Edge Functions](https://supabase.com/docs/guides/functions) | Serverless functions | Deno | MIT |

The key insight: these services don't "also happen to store data in Postgres." They **use PostgreSQL as the single source of truth**. PostgREST directly reflects your table schema without requiring separate API route definitions. GoTrue's user data and your business data live in the same database, connectable via foreign keys. Realtime doesn't poll — it reads the PostgreSQL WAL.

This is fundamentally different from Firebase's architecture. Firebase's Firestore is a proprietary document database, Auth is a separate service, and Storage has its own permission model — three systems, three rule sets, three query syntaxes.

---

## Why "Everything Is SQL" Matters

When every component of a platform is accessible via SQL, several things become simpler:

**Cross-feature queries become a single JOIN.** Want to find "users who signed up in the last seven days but haven't uploaded an avatar"? In Firebase, you'd need to query Auth and Storage APIs separately, then merge results. In Supabase, it's one SQL statement:

```sql
select u.id, u.email, u.created_at
from auth.users u
left join storage.objects o
  on o.owner = u.id
  and o.bucket_id = 'avatars'
where u.created_at > now() - interval '7 days'
  and o.id is null;
```

**Unified permission model.** Supabase uses PostgreSQL's native Row Level Security (RLS) for access control. Auth, Storage, your business tables — all use the same policy syntax. No need to learn three permission models.

**Backup and restore are atomic.** A database backup captures everything — users, file metadata, business data. You'll never encounter "the database was restored but Auth users weren't."

---

## AI Criterion: Agents Write SQL Better Than SDK Calls

This is where Supabase becomes particularly interesting in the AI era.

LLMs generate SQL with significantly higher accuracy than they generate calls to proprietary BaaS SDKs. The reason is intuitive: SQL has been a stable language since the 1970s, with decades of training examples. BaaS SDKs have large API surfaces, frequent version changes, and models often generate outdated patterns.

Since Supabase's foundation is PostgreSQL, an agent's primary interface is SQL. Combined with Supabase's [MCP server](https://github.com/supabase-community/supabase-mcp) (2.9k GitHub stars, Apache 2.0), agents can directly operate on projects through the Model Context Protocol — creating tables, querying data, managing Auth.

This extends the "Just Use Postgres" argument from [our PostgreSQL deep dive](/posts/tech/deep-dive/2026-07-09-postgres-unified-database): it's not just that engineers can get by with PostgreSQL — **agents can do everything with PostgreSQL too**.

In the Supabase context, this means:

- Creating and modifying schemas → SQL DDL
- CRUD operations → SQL DML
- Access control → SQL policies (RLS)
- Vector search → pgvector SQL functions
- Real-time subscriptions → Realtime subscribes to table changes

There's no operation in this chain that "only the SDK can do and SQL can't."

---

## pgvector Integration: No Separate Vector Database Needed

Supabase ships with the [pgvector](https://github.com/pgvector/pgvector) extension built in. Since the foundation is PostgreSQL, you don't need a separate Pinecone or Qdrant — vectors live alongside your business data.

Enabling it is straightforward:

```sql
create extension vector with schema extensions;
```

Create a table with a vector column:

```sql
create table documents (
  id serial primary key,
  title text not null,
  body text not null,
  embedding extensions.vector(384)
);
```

Query using pgvector's distance operators:

| Operator | Distance metric |
|---|---|
| `<=>` | Cosine distance |
| `<->` | Euclidean distance (L2) |
| `<#>` | Negative inner product |

Supabase recommends [HNSW indexes](https://supabase.com/docs/guides/ai/vector-indexes) as the default vector indexing method, as they handle data mutations better than IVFFlat. pgvector 0.7.0+ supports up to 2,000 dimensions for standard vectors, 4,000 for halfvec, and 64,000 for bit vectors.

Since PostgREST doesn't natively support pgvector operators, the practical approach is wrapping queries in a PostgreSQL function and calling it via the client's `rpc()` method:

```sql
create or replace function match_documents (
  query_embedding extensions.vector(384),
  match_threshold float,
  match_count int
) returns table (id bigint, title text, body text, similarity float)
language sql stable as $$
  select documents.id, documents.title, documents.body,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by (documents.embedding <=> query_embedding) asc
  limit match_count;
$$;
```

This aligns directly with [the pgvector approach discussed in our PostgreSQL post](/posts/tech/deep-dive/2026-07-09-postgres-unified-database): for most applications, keeping vectors and business data in the same database saves far more effort than maintaining sync pipelines between two systems.

---

## Realtime: Reading the WAL, Not Polling

Supabase Realtime is a globally distributed cluster written in Elixir. Its real-time push mechanism doesn't periodically check for database changes — it reads the WAL directly through PostgreSQL's logical replication:

1. Client subscribes to the `postgres_changes` channel
2. Realtime establishes a logical replication slot with PostgreSQL
3. WAL records stream to the Realtime cluster as they're generated
4. The cluster pushes changes to the corresponding clients via WebSocket

The benefit of this design is **zero additional write overhead** — no triggers needed on tables, changes are read directly from the WAL. The Realtime cluster connects from the region closest to your database, maintaining at least two nodes per region for failover.

Beyond database changes, Realtime also provides Broadcast (low-latency messages between clients) and Presence (tracking who's online). However, note that the [official documentation explicitly states Realtime does not guarantee message delivery](https://github.com/supabase/realtime). If your use case requires guaranteed delivery (e.g., payment notifications), Realtime alone isn't sufficient — you need additional mechanisms.

---

## Pricing (verified August 2026)

| Plan | Monthly | Database | Storage | Bandwidth | MAU |
|---|---|---|---|---|---|
| **Free** | $0 | 500 MB | 1 GB | 5 GB | 50,000 |
| **Pro** | $25 | 8 GB ($0.125/GB over) | 100 GB | 250 GB | 100,000 |
| **Team** | $599 | 8 GB ($0.125/GB over) | 100 GB | 250 GB | 100,000 |
| **Enterprise** | Custom | Custom | Custom | Custom | Custom |

Source: [Supabase Pricing](https://supabase.com/pricing) (verified August 2026).

Key details:

- **Free plan projects pause after one week of inactivity**, limited to 2 active projects. Suitable for side projects and prototyping, not for running real services.
- **Pro plan has spend caps enabled by default** — features degrade instead of incurring surprise charges when limits are exceeded. This is cost-control friendly.
- **Team plan** primarily adds SOC2/ISO 27001 compliance, 14-day backups (Pro has 7-day), and 28-day log retention.
- Pro plan includes a $10/month compute credit for upgrading database compute specs.

Compared to Firebase's Blaze plan, Supabase Pro's fixed $25/month is more predictable. Firebase's pay-as-you-go model can occasionally produce surprise bills during traffic spikes.

---

## When to Use and When Not To

### Good fit

- **Applications requiring relational data** — Supabase's foundation is PostgreSQL, so JOINs, transactions, and foreign keys are native. Firebase's Firestore is inherently weak here.
- **AI/RAG applications** — pgvector is built in, no separate vector database needed.
- **Teams that want SQL access** — not just SDK calls, but direct PostgreSQL connections via pgAdmin, DBeaver, or any SQL tool.
- **Teams that want migration flexibility** — the foundation is standard PostgreSQL. If you later need to move to self-managed RDS or Cloud SQL, your data and schema come with you.

### Not ideal

- **Very high write throughput** — PostgreSQL has a single write node architecture. If your writes consistently exceed ~1,500/sec and keep growing, consider horizontally scalable solutions like CockroachDB or DynamoDB.
- **Offline-first mobile apps** — Firebase's Firestore has mature offline sync; Supabase has no equivalent.
- **Projects deeply integrated with Google Cloud** — Firebase's integrations with Cloud Functions, BigQuery, and Analytics are deeper than Supabase's with any cloud provider.
- **Scenarios requiring guaranteed message delivery** — As noted, Supabase Realtime does not guarantee delivery.

---

## Relationship to Other Posts on This Site

Supabase's architectural choice directly echoes the core argument from ["Is PostgreSQL Enough? Don't Rush to Specialized Databases"](/posts/tech/deep-dive/2026-07-09-postgres-unified-database): **the hidden cost of managing an additional system is severely underestimated**. Supabase pushes this idea to its logical conclusion — not just the database, but Auth, Storage, and Realtime are all built on PostgreSQL.

Compared to [Cloudflare D1 used on this site](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database), Supabase and D1 solve problems at different scales. D1 is an SQLite-based edge database for lightweight applications running on Workers; Supabase is a full backend platform for applications needing Auth, Storage, and Realtime. They're not mutually exclusive — you could use Supabase as your primary database and D1 as an edge cache.

---

## References

- [Supabase Official Documentation](https://supabase.com/docs) — Architecture, service API references
- [Supabase GitHub Repository](https://github.com/supabase/supabase) — 108k stars, Apache 2.0
- [Supabase Pricing](https://supabase.com/pricing) — Free / Pro / Team / Enterprise plan details (verified August 2026)
- [Supabase Architecture](https://supabase.com/docs/guides/getting-started/architecture) — How seven services relate to PostgreSQL
- [Supabase Auth Architecture](https://supabase.com/docs/guides/auth/architecture) — GoTrue storing user data in `auth` schema
- [Supabase Realtime Architecture](https://supabase.com/docs/guides/realtime/architecture) — WAL reading, replication slots, WebSocket push
- [Supabase Database Replication](https://supabase.com/docs/guides/database/replication) — Logical replication, publications, WAL configuration
- [Supabase AI / Vector Documentation](https://supabase.com/docs/guides/ai) — pgvector integration, embedding generation, semantic search
- [Supabase Vector Columns](https://supabase.com/docs/guides/ai/vector-columns) — pgvector distance operators, query function examples
- [Supabase Vector Indexes](https://supabase.com/docs/guides/ai/vector-indexes) — HNSW vs IVFFlat, dimension limits
- [Supabase Storage](https://supabase.com/docs/guides/storage) — S3-compatible storage with metadata in PostgreSQL
- [Supabase Realtime GitHub](https://github.com/supabase/realtime) — Elixir/Phoenix implementation, "no delivery guarantee" statement
- [Supabase MCP Server](https://github.com/supabase-community/supabase-mcp) — 2.9k stars, AI agent operation via Model Context Protocol
- [Is PostgreSQL Enough? Don't Rush to Specialized Databases](/posts/tech/deep-dive/2026-07-09-postgres-unified-database) — PostgreSQL deep dive on this site
- [Cloudflare D1: SQLite on the Edge](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database) — D1 post on this site
