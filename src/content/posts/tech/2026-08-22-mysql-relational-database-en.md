---
title: "MySQL: A Mature Relational Database, Not Merely the Popular Default"
date: 2026-08-22
category: tech
type: deep-dive
tags: [mysql, innodb, sql, database, replication]
lang: en
tldr: "MySQL offers a mature ecosystem, InnoDB transactions, and predictable operations, but teams must still own indexes, isolation, replication lag, and migrations."
description: "An introduction to MySQL, InnoDB, indexing, transactions, replication, and high-availability boundaries, with comparisons to PostgreSQL, MongoDB, and DuckDB."
series:
  name: "AI-Era Technology Choices"
  order: 122
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-mysql-relational-database)

[MySQL](https://dev.mysql.com/doc/refman/8.4/en/) is a mature client-server relational database. Typical deployments use InnoDB for ACID transactions, row-level locking, crash recovery, foreign keys, and clustered primary keys. It is not limited to legacy systems: predictable SQL, broad driver and ORM support, and abundant operational experience remain valuable for SaaS, commerce, and content workloads.

## The core model is schema, constraints, and transactions

Encoding business invariants with `NOT NULL`, `UNIQUE`, foreign keys, and transactions is safer than expecting every handler to behave perfectly. Indexes are not free acceleration: secondary indexes consume space and amplify writes, while compound-index usefulness depends on column order and query shape. Use `EXPLAIN ANALYZE` against production-like data before choosing indexes.

InnoDB defaults to `REPEATABLE READ`; applications must still retry deadlocks and avoid long transactions. Bound connection pools as well. Unbounded serverless functions can exhaust database connections long before they provide unlimited throughput.

## Replication does not guarantee zero data loss

MySQL replication is asynchronous by default. Replicas can scale reads, but lag breaks read-after-write assumptions. GTIDs simplify topology changes and failover; they do not choose promotion policy, drain connections, restore backups, or define RPO and RTO. Practice restores. A replica is not a backup because accidental deletes replicate too.

## When to choose it

MySQL is a low-risk default when the team knows it, the workload is OLTP, relationships are clear, and hosting and tooling are mature. Choose PostgreSQL directly for a PostgreSQL-specific extension and type ecosystem. A changing document shape alone does not require MongoDB; inspect transaction and query boundaries first. Local analytics over Parquet or CSV belongs to DuckDB, not a production MySQL instance.

AI can draft migrations and queries, but it cannot own locking, online DDL, lag, or rollback. Popularity supplies many examples and many obsolete configurations; validate advice against the manual for the deployed version and a measured migration plan.

## References

- [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/)
- [InnoDB transaction model](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html)
- [MySQL replication](https://dev.mysql.com/doc/refman/8.4/en/replication.html)
- [EXPLAIN ANALYZE](https://dev.mysql.com/doc/refman/8.4/en/explain.html#explain-analyze)
