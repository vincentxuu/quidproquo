---
title: "Apache Kafka: A Replayable Event Log, Not Merely a Message Queue"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kafka, event-streaming, distributed-systems, message-queue, data-pipeline, ai-agent]
lang: en
tldr: "Kafka is a distributed log ordered by partition and retained by policy. Consumer groups divide work through offsets, while exactly-once processing holds only inside boundaries covered by Kafka transactions. Since Kafka 4.2, share groups are production-ready and let Kafka act as a per-record-acknowledged work queue, at the cost of ordering within a partition."
description: "Apache Kafka through partitions, consumer groups, offsets, replication, and transactions, with practical boundaries against share groups, queues, and Redpanda."
series:
  name: "Technology Choices in the AI Era"
  order: 25
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-apache-kafka-event-streaming)

[Apache Kafka](https://kafka.apache.org/44/design/design/) often appears in message-queue lists, but its central data structure is a retained, replayable distributed commit log. Producers append records to topic partitions, and consumers store offsets describing their position. Retention policy—not whether one consumer read a record—determines when data disappears.

That distinction makes Kafka useful for event streaming, CDC, audit trails, and multi-consumer data pipelines. It also makes Kafka more operationally demanding than an ordinary background-job queue.

## Partitions determine ordering and parallelism

A topic is split into partitions. Kafka guarantees order inside one partition, not across an entire topic. A producer keyed by order ID normally sends all events for one order to the same partition. Missing keys or skewed key distributions can instead create unpredictable placement or hot partitions.

A consumer group acts as one logical subscriber. In a traditional group, each partition is assigned to one consumer at a time, so adding consumers beyond the partition count does not add throughput (share groups, in the next section, are the exception). Separate groups maintain separate offsets, allowing risk, notification, and analytics systems to read the same records without duplicating stored data.

```text
orders topic
  partition 0 ──> risk group / consumer A
  partition 1 ──> risk group / consumer B

  partition 0 ──> analytics group / consumer C
  partition 1 ──> analytics group / consumer C
```

An offset is the next position to read, not per-message acknowledgment state maintained by the broker. A consumer can rewind and replay history after a bug fix. That is the defining boundary between Kafka and a traditional queue.

## Share groups: Kafka as a work queue

Kafka 4.2 (February 2026) declared [share groups](https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/) (KIP-932, Queues for Kafka) production-ready. They are a different consumption model: one partition can be served to several consumers in a share group at once, and the broker tracks state per record instead of relying on a single offset.

- A consumer that receives a record holds a time-limited lock on it (30 seconds by default), during which no one else gets it. On success it accepts; otherwise it can release the record for redelivery, reject it as unprocessable, or renew the lock. If the lock expires without a response, the record is released automatically.
- Every record has a delivery count; once redeliveries exceed the limit (5 by default) it is archived and not delivered again, which stops poison messages.
- Delivery is at-least-once, so handlers still need idempotency.

The price is ordering. The [KafkaShareConsumer documentation](https://kafka.apache.org/44/javadoc/org/apache/kafka/clients/consumer/KafkaShareConsumer.html) is direct: share groups give more flexible sharing at the expense of record ordering. Records in one fetched batch are in increasing offset order, but there is no ordering guarantee across batches, especially after redelivery. Events that must stay ordered (state changes for one order) stay on consumer groups; independent, throughput-bound work (per-record conversion, notifications, embedding jobs) fits share groups, and the consumer count is no longer capped by the partition count.

## Reliability is more than `acks=all`

Each partition has a leader and replicas. Producers write to the leader and followers replicate the log. Common durable configurations consider replication factor, `min.insync.replicas`, and producer `acks=all` together rather than changing one flag in isolation.

Consumer semantics depend on the order of output processing and offset commits. Commit first and a crash can lose work: at-most-once. Process first and a crash can repeat work: at-least-once. Production handlers should generally assume duplicate delivery and use event IDs, business keys, or database constraints for idempotency.

## Exactly-once has a concrete boundary

Kafka transactions can atomically include output-topic records and input consumer offsets. With `read_committed` consumers, Kafka Streams or consume-transform-produce pipelines can provide exactly-once processing. This does not mean an arbitrary external API call occurs exactly once.

When a consumer charges a card, sends email, or writes another database, Kafka cannot unilaterally make that side effect atomic with its offset. Use an outbox, an external idempotency key, or store the result and offset in the same database transaction. An architecture claiming “Kafka exactly-once” without drawing the transaction boundary is almost certainly overstated.

## KRaft removes ZooKeeper, not operational work

Modern Kafka uses a KRaft controller quorum for cluster metadata and no longer needs ZooKeeper. One distributed system disappears, but teams still manage partition counts, replica placement, disk capacity, consumer lag, rebalances, schemas, and cross-region replication.

Kafka fits when independent consumers need replay, retention is substantial, throughput is high, and the team can operate a data platform. Share groups mean that "a separate pool of workers processes the same event stream record by record" no longer requires bolting on another queue, so teams already running Kafka should evaluate share groups for background work first. Conversely, for a few background jobs deleted after processing with no other streaming need, standing up Kafka just for share groups does not pay off; RabbitMQ, SQS, BullMQ, or Cloudflare Queues are usually more direct. Redpanda or managed Kafka can change the operational model while keeping the Kafka event model and client ecosystem.

## Kafka in AI systems

Kafka can retain agent-run events, tool calls, model-response metadata, and evaluation results for online monitoring, offline training, and audit consumers. Do not put large prompts, documents, or model outputs directly into every record. Store blobs in object storage and publish a URI, hash, schema version, and authorization context to control retention and replay cost.

Before adoption, write down three answers: how long replay is required, which key must preserve order, and what duplicate processing would do. Without those answers, partitions and transactions turn an unclear requirement into expensive configuration.

## Update history

- 2026-11-23: Added a share group section (production-ready since Kafka 4.2: per-record acknowledgment, multiple consumers per partition, no ordering guarantee), clarified that "consumers beyond the partition count add no parallelism" applies only to classic consumer groups, and rewrote when to choose RabbitMQ or SQS instead; documentation links now point to 4.4.

## References

- [Apache Kafka design](https://kafka.apache.org/44/design/design/)
- [Apache Kafka consumer groups](https://kafka.apache.org/44/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)
- [Apache Kafka KRaft operations](https://kafka.apache.org/44/operations/kraft/)
- [Apache Kafka 4.2.0 release announcement (share groups production-ready)](https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/)
- [KafkaShareConsumer](https://kafka.apache.org/44/javadoc/org/apache/kafka/clients/consumer/KafkaShareConsumer.html)
- [KIP-932: Queues for Kafka](https://cwiki.apache.org/confluence/spaces/KAFKA/pages/255070434/KIP-932+Queues+for+Kafka)
