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
  name: "Technology Choices in the AI Era"
  order: 28
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-redpanda-kafka-compatible)

[Redpanda](https://docs.redpanda.com/streaming/current/get-started/architecture/) is a distributed event log that implements the Kafka API, not a wrapper around Apache Kafka. Its C++ and Seastar broker uses a thread-per-core, shared-memory architecture. Kafka producers, consumers, and many ecosystem tools can remain while the JVM and a separate metadata service disappear.

Choose Redpanda when the Kafka event model is correct but a different broker implementation and operating model are attractive—not when the requirement is actually a simple work queue.

## Topics and partitions still follow the Kafka model

Producers use the Kafka protocol to write records to topic partitions, and consumers read by offset. Records with the same key route to one partition, and ordering remains partition-local. Consumer groups, retention, compaction, transactions, and schema-registry concepts continue from the Kafka ecosystem.

Redpanda therefore does not eliminate poor partition keys, hot partitions, consumer lag, breaking schema changes, or exactly-once boundaries. An application architecture that was wrong on Kafka does not become correct after switching brokers. The reverse also matters: Apache Kafka [share groups](https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/) (KIP-932) are production-ready since 4.2, letting several consumers share a partition with per-record acknowledgment, and Redpanda does not support them yet (a maintainer on the [official issue](https://github.com/redpanda-data/redpanda/issues/26434) says 27.1 at the earliest). A design that relies on share groups as a work queue cannot move to Redpanda for now.

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

Check the license before self-hosting. Starting with 26.3.1 (2026-11-20), the Redpanda broker and Operator are no longer source-available and ship as binaries only. Community Edition now falls under the [Redpanda Community Edition License](https://docs.redpanda.com/streaming/current/get-started/licensing/redpanda-community-edition-license/): free, but capped at 50 cores in total across every cluster your organization runs, and it may not be used to offer a streaming or queuing service to others. A cluster [over the limit](https://docs.redpanda.com/streaming/current/get-started/licensing/core-limit/) keeps running but logs warnings and refuses upgrades to the next feature release. Tiered Storage was already a licensed enterprise feature. Teams that plan to self-host at growing scale should budget for an Enterprise subscription or evaluate Apache Kafka itself; source for releases before 26.3.1 remains in the archived GitHub repository.

AI pipelines should follow the same data contract as Kafka: events contain pointers and metadata, while large prompts, documents, and model outputs live in object storage. Redpanda changes the runtime beneath that event backbone; idempotency, PII retention, schemas, and replay governance remain application responsibilities.

## Update history

- 2026-11-23: Added the license change from 26.3.1 (broker no longer source-available, Community Edition capped at 50 cores per organization, no offering it as a streaming service) and what it means for self-hosting decisions; noted that Redpanda does not yet support Kafka 4.2 share groups.

## References

- [How Redpanda works](https://docs.redpanda.com/streaming/current/get-started/architecture/)
- [Redpanda Kafka compatibility](https://docs.redpanda.com/current/develop/kafka-clients/)
- [Apache Kafka 4.2.0 release announcement (share groups)](https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/)
- [Support KIP-932: Queues for Kafka (Redpanda issue)](https://github.com/redpanda-data/redpanda/issues/26434)
- [R2: The engine of engines (26.3.1 license announcement)](https://www.redpanda.com/blog/r2-the-engine-of-engines)
- [Redpanda Community Edition Core Limit](https://docs.redpanda.com/streaming/current/get-started/licensing/core-limit/)
- [Redpanda Tiered Storage](https://docs.redpanda.com/current/manage/tiered-storage/)
