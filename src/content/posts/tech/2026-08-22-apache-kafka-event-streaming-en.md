---
title: "Apache Kafka: A Replayable Event Log, Not Merely a Message Queue"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kafka, event-streaming, distributed-systems, message-queue, data-pipeline, ai-agent]
lang: en
tldr: "Kafka is a distributed log ordered by partition and retained by policy. Consumer groups divide work through offsets, while exactly-once processing holds only inside boundaries covered by Kafka transactions."
description: "Apache Kafka through partitions, consumer groups, offsets, replication, and transactions, with practical boundaries against queues and Redpanda."
series:
  name: "AI 時代的技術選擇"
  order: 25
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-apache-kafka-event-streaming)

[Apache Kafka](https://kafka.apache.org/42/design/design/) often appears in message-queue lists, but its central data structure is a retained, replayable distributed commit log. Producers append records to topic partitions, and consumers store offsets describing their position. Retention policy—not whether one consumer read a record—determines when data disappears.

That distinction makes Kafka useful for event streaming, CDC, audit trails, and multi-consumer data pipelines. It also makes Kafka more operationally demanding than an ordinary background-job queue.

## Partitions determine ordering and parallelism

A topic is split into partitions. Kafka guarantees order inside one partition, not across an entire topic. A producer keyed by order ID normally sends all events for one order to the same partition. Missing keys or skewed key distributions can instead create unpredictable placement or hot partitions.

A consumer group acts as one logical subscriber. In a traditional group, each partition is assigned to one consumer at a time, so adding consumers beyond the partition count does not add throughput. Separate groups maintain separate offsets, allowing risk, notification, and analytics systems to read the same records without duplicating stored data.

```text
orders topic
  partition 0 ──> risk group / consumer A
  partition 1 ──> risk group / consumer B

  partition 0 ──> analytics group / consumer C
  partition 1 ──> analytics group / consumer C
```

An offset is the next position to read, not per-message acknowledgment state maintained by the broker. A consumer can rewind and replay history after a bug fix. That is the defining boundary between Kafka and a traditional queue.

## Reliability is more than `acks=all`

Each partition has a leader and replicas. Producers write to the leader and followers replicate the log. Common durable configurations consider replication factor, `min.insync.replicas`, and producer `acks=all` together rather than changing one flag in isolation.

Consumer semantics depend on the order of output processing and offset commits. Commit first and a crash can lose work: at-most-once. Process first and a crash can repeat work: at-least-once. Production handlers should generally assume duplicate delivery and use event IDs, business keys, or database constraints for idempotency.

## Exactly-once has a concrete boundary

Kafka transactions can atomically include output-topic records and input consumer offsets. With `read_committed` consumers, Kafka Streams or consume-transform-produce pipelines can provide exactly-once processing. This does not mean an arbitrary external API call occurs exactly once.

When a consumer charges a card, sends email, or writes another database, Kafka cannot unilaterally make that side effect atomic with its offset. Use an outbox, an external idempotency key, or store the result and offset in the same database transaction. An architecture claiming “Kafka exactly-once” without drawing the transaction boundary is almost certainly overstated.

## KRaft removes ZooKeeper, not operational work

Modern Kafka uses a KRaft controller quorum for cluster metadata and no longer needs ZooKeeper. One distributed system disappears, but teams still manage partition counts, replica placement, disk capacity, consumer lag, rebalances, schemas, and cross-region replication.

Kafka fits when independent consumers need replay, retention is substantial, throughput is high, and the team can operate a data platform. For a few background jobs deleted after processing, RabbitMQ, SQS, BullMQ, or Cloudflare Queues are usually more direct. Redpanda or managed Kafka can change the operational model while keeping the Kafka event model and client ecosystem.

## Kafka in AI systems

Kafka can retain agent-run events, tool calls, model-response metadata, and evaluation results for online monitoring, offline training, and audit consumers. Do not put large prompts, documents, or model outputs directly into every record. Store blobs in object storage and publish a URI, hash, schema version, and authorization context to control retention and replay cost.

Before adoption, write down three answers: how long replay is required, which key must preserve order, and what duplicate processing would do. Without those answers, partitions and transactions turn an unclear requirement into expensive configuration.

## References

- [Apache Kafka design](https://kafka.apache.org/42/design/design/)
- [Apache Kafka consumer groups](https://kafka.apache.org/42/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)
- [Apache Kafka KRaft operations](https://kafka.apache.org/42/operations/kraft/)
