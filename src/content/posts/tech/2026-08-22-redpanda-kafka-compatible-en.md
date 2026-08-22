---
title: "Redpanda: Kafka API Compatibility Still Requires Broker Migration Testing"
date: 2026-08-22
category: tech
type: deep-dive
tags: [redpanda, kafka, event-streaming, distributed-systems, tiered-storage, self-hosted]
lang: en
tldr: "Redpanda reimplements a Kafka-compatible event log with C++/Seastar, thread-per-core execution, and a Raft group per partition. Client compatibility is broad, but operational and edge semantics still require testing."
description: "Redpanda's Kafka API, Raft, thread-per-core model, tiered storage, and migration boundaries, including when to replace or retain Kafka."
series:
  name: "AI 時代的技術選擇"
  order: 28
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-redpanda-kafka-compatible)

[Redpanda](https://docs.redpanda.com/streaming/current/get-started/architecture/) is a distributed event log that implements the Kafka API, not a wrapper around Apache Kafka. Its C++ and Seastar broker uses a thread-per-core, shared-memory architecture. Kafka producers, consumers, and many ecosystem tools can remain while the JVM and a separate metadata service disappear.

Choose Redpanda when the Kafka event model is correct but a different broker implementation and operating model are attractive—not when the requirement is actually a simple work queue.

## Topics and partitions still follow the Kafka model

Producers use the Kafka protocol to write records to topic partitions, and consumers read by offset. Records with the same key route to one partition, and ordering remains partition-local. Consumer groups, retention, compaction, transactions, and schema-registry concepts continue from the Kafka ecosystem.

Redpanda therefore does not eliminate poor partition keys, hot partitions, consumer lag, breaking schema changes, or exactly-once boundaries. An application architecture that was wrong on Kafka does not become correct after switching brokers.

## Every partition is a Raft group

Each Redpanda topic partition forms a Raft group with a leader and followers. With producer `acks=all`, the leader confirms a committed record after a majority of replicas write it. Cluster metadata resides in a controller partition that is also replicated by Raft.

The design does not carry Kafka's historical ZooKeeper split. Modern Kafka uses KRaft as well, so “no ZooKeeper” is no longer a unique Redpanda advantage. Differences now live in runtime, resource model, operations, and commercial features.

## Thread-per-core is both a performance model and deployment assumption

Seastar pins application threads to CPU cores and uses message passing to avoid context switches and locks. Redpanda allocates and partitions memory up front and prefers predictable CPU resources, SSDs, and XFS. This can scale up efficiently, but a container cannot arbitrarily overcommit CPU and memory while reproducing vendor benchmarks.

Benchmark your own message sizes, partition counts, retention, replication, TLS, and producer settings. Measure p99 latency, throughput, disk use, and recovery time. Peak throughput on an empty cluster does not cover production failure modes.

## Tiered Storage changes retention cost, not latency physics

Redpanda Tiered Storage offloads log segments to object storage. Consumers keep the Kafka API: recent offsets come from local disk, while historical offsets hydrate from object storage. This supports longer retention, smaller local disks, and disaster recovery.

Historical reads still depend on object-storage latency, caches, and networking. Benchmark large cold-data replays separately and configure bucket lifecycle, encryption, IAM, and deletion policy. Moving data to S3-compatible storage does not move away governance responsibility.

## Split “Kafka-compatible” into layers

Compatibility includes protocol, clients, admin APIs, Connect, Streams, security, observability, and operational behavior. Ordinary producers and consumers often need only a new bootstrap server. Systems that depend on broker-specific settings, JMX metrics, custom authorizers, third-party connectors, or edge KIPs cannot infer zero changes from an API-compatible label.

Use shadow traffic or dual publication for migration. Map topic settings and ACLs, then test representative producers, consumers, rebalances, transactions, failures, lag, and replay before moving workloads. A rollback plan must align offsets rather than merely reverse DNS.

## When Redpanda belongs on the shortlist

Redpanda is compelling when a team wants Kafka clients and semantics with a more unified self-hosted broker, values tiered storage, or prefers Redpanda Cloud/BYOC. An organization with a mature Kafka platform, extensive integrations, and no broker bottleneck may not recover the compatibility-testing cost.

AI pipelines should follow the same data contract as Kafka: events contain pointers and metadata, while large prompts, documents, and model outputs live in object storage. Redpanda changes the runtime beneath that event backbone; idempotency, PII retention, schemas, and replay governance remain application responsibilities.

## References

- [How Redpanda works](https://docs.redpanda.com/streaming/current/get-started/architecture/)
- [Redpanda Kafka compatibility](https://docs.redpanda.com/current/develop/kafka-clients/)
- [Redpanda Tiered Storage](https://docs.redpanda.com/current/manage/tiered-storage/)
