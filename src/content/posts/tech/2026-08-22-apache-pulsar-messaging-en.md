---
title: "Apache Pulsar: An Event Platform Separating Stateless Brokers from BookKeeper Storage"
date: 2026-08-22
category: tech
type: deep-dive
tags: [apache-pulsar, event-streaming, message-queue, bookkeeper, distributed-systems, multi-tenancy]
lang: en
tldr: "Pulsar separates serving from storage: stateless brokers handle connections while BookKeeper stores ledgers and subscription cursors. Elasticity and multi-tenancy come with more operational components."
description: "Apache Pulsar's broker/BookKeeper architecture, subscriptions, geo-replication, tiered storage, and selection against Kafka."
series:
  name: "AI 時代的技術選擇"
  order: 29
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-apache-pulsar-messaging)

[Apache Pulsar](https://pulsar.apache.org/docs/4.0.x/concepts-architecture-overview/) offers queue-like consumption and replayable streams, but its largest difference from Kafka is storage architecture. Brokers handle producer and consumer connections and dispatch, while Apache BookKeeper stores durable messages and subscription cursors. Brokers scale with serving load; bookies scale storage independently.

## What serving-storage separation means

Each topic maps to a managed ledger built from BookKeeper ledgers. A ledger is a single-writer append-only log replicated across bookies. Sealed ledgers can be reclaimed or offloaded without blocking new writes. Moving broker ownership does not require moving an entire partition's data.

This helps services with many topics, changing tenant loads, and independently scaling CPU and disks. A self-hosted cluster still operates brokers, BookKeeper, a metadata store, journals, recovery, and placement. Pulsar does not remove operations; it separates them into explicit subsystems.

## Subscriptions define consumption semantics

Pulsar supports Exclusive, Failover, Shared, and Key_Shared subscriptions. Exclusive uses one consumer, Failover keeps a standby, Shared distributes messages without global order, and Key_Shared pins one key to a consumer to combine key-local ordering with scale.

Subscription cursors persist. Acknowledgments advance progress and unacknowledged messages may be redelivered. Readers can start at a position without an ordinary subscription. Pulsar can therefore resemble both a work queue and an event log, but each topic still needs an explicit subscription type, acknowledgment timeout, retry, dead letter, and ordering key.

## Multi-tenancy and geo-replication are first-class

Topic names contain tenants and namespaces, such as `persistent://tenant/ns/topic`. Quotas, retention, TTL, isolation, and replication policies can live at the namespace level. Brokers replicate events between regional clusters for regional autonomy and global distribution.

These features repay their complexity only when an organization actually has multiple teams, regions, and isolation requirements. A single product with a few dozen background queues is usually simpler on SQS, RabbitMQ, or NATS JetStream.

## Tiered Storage and long backlogs

[Pulsar Tiered Storage](https://pulsar.apache.org/docs/4.0.x/tiered-storage-overview/) offloads sealed ledgers to S3, GCS, Azure, and other long-term stores while consumers keep using the Pulsar API. BookKeeper retains hot data and recent backlog; object storage carries long retention.

That fits training events and recommendation recomputation, but cold-replay latency, bucket lifecycle, incomplete multipart uploads, and deletion still require operations. Cheap storage is not permission to retain PII forever.

## Pulsar or Kafka?

Kafka has a simpler partition-log model and broader Connect, Streams, and staffing ecosystems. Pulsar makes serving-storage separation, subscription variety, multi-tenancy, and geo-replication more central. Do not decide from throughput alone. Test your topic count, backlog, consumer patterns, regional topology, and failure recovery.

An AI platform with many tenants, many topics per tenant, online work distribution, and offline replay may justify Pulsar. A system merely assigning agent jobs to workers probably does not justify BookKeeper and a metadata layer.

## References

- [Apache Pulsar architecture overview](https://pulsar.apache.org/docs/4.0.x/concepts-architecture-overview/)
- [Apache Pulsar messaging concepts](https://pulsar.apache.org/docs/4.0.x/concepts-messaging/)
- [Apache Pulsar multi-tenancy](https://pulsar.apache.org/docs/4.0.x/concepts-multi-tenancy/)
- [Apache Pulsar tiered storage](https://pulsar.apache.org/docs/4.0.x/tiered-storage-overview/)
