---
title: "Neon vs Turso: Do Not Call Both Serverless Databases Managed Postgres"
date: 2026-08-22
category: tech
type: deep-dive
tags: [neon, turso, postgresql, sqlite, serverless-database]
lang: en
tldr: "Neon is serverless PostgreSQL; Turso Cloud currently follows the libSQL and SQLite-compatible path. Their compatibility boundaries are fundamentally different."
description: "A comparison of Neon serverless Postgres and Turso Cloud's libSQL and SQLite path, covering branching, scale-to-zero, embedded replicas, database density, and Turso's 2026 Postgres project."
series:
  name: "AI-Era Technology Choices"
  order: 125
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-neon-vs-turso-managed-databases)

The label “managed Postgres (Neon/Turso)” remains inaccurate in August 2026. [Neon](https://neon.com/docs/introduction) is a PostgreSQL-compatible serverless platform. [Turso Cloud](https://docs.turso.tech/cloud) currently runs production-ready libSQL and is moving toward the ground-up, SQLite-compatible Turso Database. Turso has announced a PostgreSQL-compatible frontend, but explicitly describes the current work as a foundation rather than a finished production Postgres product.

## Neon: Postgres compatibility with separated compute and storage

Neon separates compute and storage. Compute can autoscale and scale to zero when idle. Copy-on-write branches create isolated database branches for previews, migration tests, and agent-generated changes. PostgreSQL semantics preserve familiar drivers, SQL, migrations, and much of the extension ecosystem.

The tradeoffs include cold starts, connection churn, autoscaling thresholds, and a new performance model around remote storage. Serverless runtimes should use pooled connections. A branch is not anonymization: PII copied from production keeps the same governance requirements. Validate required extensions, logical replication, regions, backups and PITR, and plan limits.

## Turso: SQLite lineage and dense isolated databases

Turso emphasizes SQLite-compatible APIs, the libSQL ecosystem, embedded replicas and local-first operation, and dense database-per-tenant or database-per-agent patterns. Those capabilities reduce read latency and fit intermittent edge workloads. It is not a connection-string migration for PostgreSQL applications: SQL dialects, types, extensions, concurrency, transactions, and ecosystems differ.

In July 2026, Turso announced a Rust PostgreSQL-compatible frontend compiled to shared bytecode. It is an engineering project worth tracking, not a mature Postgres service for today's production matrix. Decision records must say whether they evaluate current libSQL Cloud, beta Turso Database, or future PostgreSQL compatibility.

## How to choose

Start with Neon for an existing PostgreSQL workload that values its relational ecosystem, preview branches, and scale-to-zero. Start with Turso for embedded or local replicas, many small isolated databases, and SQLite compatibility. Benchmark both with the real schema, peak concurrent writes, cold paths, restores, region failures, egress, and monthly cost. “Serverless” describes a resource and operating model; it does not mean infinite capacity or zero operations.

## References

- [Neon documentation overview](https://neon.com/docs/introduction)
- [Neon autoscaling](https://neon.com/docs/introduction/autoscaling)
- [Neon branching](https://neon.com/docs/introduction/branching)
- [Turso Cloud documentation](https://docs.turso.tech/cloud)
- [libSQL and Turso Database](https://docs.turso.tech/libsql)
- [Turso's PostgreSQL-compatible project announcement](https://turso.tech/blog/we-are-building-postgres-in-rust)
