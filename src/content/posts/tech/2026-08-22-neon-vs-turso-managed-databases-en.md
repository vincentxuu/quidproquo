---
title: "Neon vs Turso: Do Not Call Both Serverless Databases Managed Postgres"
date: 2026-08-22
category: tech
type: deep-dive
tags: [neon, turso, postgresql, sqlite, serverless-database]
lang: en
tldr: "Neon is serverless PostgreSQL; Turso follows the SQLite-compatible path, and Turso Cloud runs both libSQL and the now production-ready Turso Database. Their compatibility boundaries are fundamentally different, and Turso's Postgres frontend is still experimental."
description: "A comparison of Neon serverless Postgres and Turso Cloud's libSQL and SQLite path, covering branching, scale-to-zero, embedded replicas, database density, and Turso's 2026 Postgres project."
series:
  name: "Technology Choices in the AI Era"
  order: 125
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-neon-vs-turso-managed-databases)

The label “managed Postgres (Neon/Turso)” remains inaccurate in August 2026. [Neon](https://neon.com/docs/introduction) is a PostgreSQL-compatible serverless platform. [Turso Cloud](https://docs.turso.tech/cloud) follows the SQLite-compatible path: for years it ran libSQL (a fork of SQLite), and it can now also run the ground-up, SQLite-compatible Turso Database. The [official documentation](https://docs.turso.tech/libsql) marks Turso Database as production-ready and recommends it for new projects, keeping libSQL for mission-critical workloads that need a battle-tested foundation. Turso is also building a PostgreSQL-compatible frontend, but the [Turso README](https://github.com/tursodatabase/turso) still lists it as experimental, not a Postgres replacement.

## Neon: Postgres compatibility with separated compute and storage

Neon separates compute and storage. Compute can autoscale and scale to zero when idle. Copy-on-write branches create isolated database branches for previews, migration tests, and agent-generated changes. PostgreSQL semantics preserve familiar drivers, SQL, migrations, and much of the extension ecosystem.

The tradeoffs include cold starts, connection churn, autoscaling thresholds, and a new performance model around remote storage. Serverless runtimes should use pooled connections. A branch is not anonymization: PII copied from production keeps the same governance requirements. Validate required extensions, logical replication, regions, backups and PITR, and plan limits.

## Turso: SQLite lineage and dense isolated databases

Turso emphasizes SQLite-compatible APIs, the libSQL ecosystem, embedded replicas and local-first operation, and dense database-per-tenant or database-per-agent patterns. Those capabilities reduce read latency and fit intermittent edge workloads. It is not a connection-string migration for PostgreSQL applications: SQL dialects, types, extensions, concurrency, transactions, and ecosystems differ.

Turso Database differs from libSQL in architecture: libSQL keeps SQLite's file format and API, while Turso Database is a Rust rewrite designed for concurrent writes, async I/O, and high database density, and remains backward compatible with SQLite. It runs in production today (including Turso Cloud itself), but the project has not reached 1.0, and the README notes that some features are marked experimental and that you should keep independent backups.

In July 2026, Turso announced a Rust PostgreSQL-compatible frontend compiled to shared bytecode, and v0.8.0 in September 2026 shipped experimental Postgres support (SQL dialect and wire protocol). It is an engineering project worth tracking, not a mature Postgres service for today's production matrix. Decision records must say whether they evaluate libSQL on Turso Cloud, Turso Database, or the experimental Postgres frontend; the three differ in maturity.

## How to choose

Start with Neon for an existing PostgreSQL workload that values its relational ecosystem, preview branches, and scale-to-zero. Start with Turso for embedded or local replicas, many small isolated databases, and SQLite compatibility. Benchmark both with the real schema, peak concurrent writes, cold paths, restores, region failures, egress, and monthly cost. “Serverless” describes a resource and operating model; it does not mean infinite capacity or zero operations.

## Update history

- 2026-11-23: Turso Database is now marked production-ready and recommended for new projects, and Turso Cloud can run Turso databases; rewrote the introduction and decision-record paragraph, and noted that the Postgres frontend shipped as experimental in v0.8.0.

## References

- [Neon documentation overview](https://neon.com/docs/introduction)
- [Neon autoscaling](https://neon.com/docs/introduction/autoscaling)
- [Neon branching](https://neon.com/docs/introduction/branching)
- [Turso Cloud documentation](https://docs.turso.tech/cloud)
- [libSQL and Turso Database](https://docs.turso.tech/libsql)
- [Turso's PostgreSQL-compatible project announcement](https://turso.tech/blog/we-are-building-postgres-in-rust)
- [tursodatabase/turso README](https://github.com/tursodatabase/turso)
- [Turso v0.8.0 release notes](https://github.com/tursodatabase/turso/releases/tag/v0.8.0)
