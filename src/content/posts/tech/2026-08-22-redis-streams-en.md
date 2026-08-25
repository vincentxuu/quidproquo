---
title: "Redis Streams: An Append-Only Log and Consumer Groups for Reliable Redis Messaging"
date: 2026-08-22
category: tech
type: deep-dive
tags: [redis-streams, redis, event-streaming, message-queue, consumer-group, background-jobs]
lang: en
tldr: "Redis Streams stores replayable entries with `XADD`; consumer groups add a Pending Entries List and `XACK`. It is more durable than Pub/Sub, but it does not automatically become Kafka."
description: "Redis Streams IDs, range queries, consumer groups, pending entries, claiming, and trimming, compared with Redis Pub/Sub, Kafka, and job queues."
series:
  name: "Technology Choices in the AI Era"
  order: 30
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-redis-streams)

[Redis Streams](https://redis.io/docs/latest/develop/data-types/streams/) is an append-only log inside Redis. `XADD` stores entries with IDs, `XRANGE` reads history, and `XREAD` waits for new data. Consumer groups divide work and retain unacknowledged state. Streams solve the Redis Pub/Sub problem of losing messages while subscribers are offline, but remain bounded by Redis persistence, memory, and clustering.

## Entry IDs are positions, not merely identifiers

A default stream ID contains millisecond time and a sequence. Clients resume from an ID or query a time range. Reading does not delete an entry; use `MAXLEN`, `MINID`, or `XTRIM` to bound growth.

```text
XADD orders MAXLEN ~ 100000 * order_id 42 state paid
XREAD BLOCK 5000 STREAMS orders $
```

Approximate trimming with `~` is usually cheaper than exact trimming. Retention that is too short strands slow consumers, while long retention turns Redis into an expensive archive. Keep large payloads in object storage and publish pointers and metadata.

## The Pending Entries List defines consumer groups

`XGROUP` creates a group and workers use `XREADGROUP`. Delivered entries enter that group's Pending Entries List until a worker runs `XACK`. After a crash, another worker can use `XAUTOCLAIM` to take entries idle beyond a threshold.

```text
XGROUP CREATE orders fulfillment 0 MKSTREAM
XREADGROUP GROUP fulfillment worker-1 COUNT 10 STREAMS orders >
XACK orders fulfillment 1710000000000-0
```

This is at-least-once. A crash after a side effect but before `XACK` repeats work, so database writes, email, and payments need idempotency keys. Monitor PEL size, oldest pending age, deliveries, and stream length rather than only Redis CPU.

## Groups do not share acknowledgments

One stream can have analytics, notification, and fulfillment groups. Each receives entries and owns a separate PEL. An `XACK` in one group does not acknowledge another group or delete the underlying entry.

Redis 8.2 added `XACKDEL`, `XDELEX`, and reference-aware trimming for coordinated deletion across groups. Older versions require application logic. Confirm server, managed-service, and client support before using newer commands.

## Boundaries against Pub/Sub, Kafka, and BullMQ

Redis Pub/Sub fits lossy live signals. Streams fit medium-scale replay, consumer groups, and pending tracking. BullMQ adds delayed jobs, retries, job states, and scheduling. Kafka and Pulsar target broker-partitioned logs, long retention, and larger data ecosystems.

Streams can avoid another service when Redis is already critical infrastructure, volume is bounded, and the team operates persistence and failover. If backlogs make memory cost unacceptable or the system needs regional replication and many connectors, “we already run Redis” is not enough.

## Agent workloads

Streams can record agent state transitions, tool-result pointers, and worker jobs. Include task ID, attempt, schema version, and trace ID. A consumer acknowledges after external side effects; failures remain pending for claim and dead-letter policy.

A stream does not understand workflow checkpoints. Multi-day waits, step recovery, and compensation still need a durable execution engine. Redis Streams is transport and an event log, not a workflow state machine.

## References

- [Redis Streams documentation](https://redis.io/docs/latest/develop/data-types/streams/)
- [Redis XREADGROUP](https://redis.io/docs/latest/commands/xreadgroup/)
- [Redis XAUTOCLAIM](https://redis.io/docs/latest/commands/xautoclaim/)
