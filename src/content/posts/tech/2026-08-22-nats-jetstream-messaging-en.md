---
title: "NATS and JetStream: Choose Ephemeral Messaging or Durable Events First"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nats, jetstream, messaging, event-streaming, distributed-systems, microservices]
lang: en
tldr: "Core NATS is storage-free, at-most-once pub/sub. JetStream adds streams, consumers, acknowledgments, retention, and replay. They share subjects but expose fundamentally different reliability contracts."
description: "Core NATS subjects, queue groups, and request-reply; JetStream persistence and consumers; and practical selection against Kafka and RabbitMQ."
series:
  name: "Technology Choices in the AI Era"
  order: 27
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-nats-jetstream-messaging)

[NATS](https://docs.nats.io/learn/core-nats/) builds communication around subjects and an interest graph. A publisher sends to `orders.created`, and every client subscribed at that moment receives the message. Wildcards, request-reply, and queue groups reuse the same addressing model. The server treats payloads as opaque bytes, and Core NATS does not store messages.

The first question is therefore not “NATS or Kafka?” It is “may this message be missed?” If yes, Core NATS provides low-friction real-time communication. If no, explicitly use JetStream or another durable broker.

## Core NATS is fast because it promises less

Core NATS is at-most-once. A subscriber that is offline, restarting, or not yet subscribed never receives an earlier publication. This is the contract, not a defect. Cache invalidations, live telemetry, service-discovery signals, and state updates superseded by the next value do not need storage and acknowledgment overhead.

Subjects use dot-delimited names such as `orders.created.eu`. Subscribers use `*` for one token and `>` for the remaining hierarchy. A queue group sends each message to one group member for load balancing, while other groups and ordinary subscribers still receive their own copies.

```ts
const sub = nc.subscribe("orders.created", { queue: "fulfillment" });
for await (const msg of sub) {
  await pack(JSON.parse(sc.decode(msg.data)));
}
```

There is no acknowledgment here. If the handler crashes, Core NATS does not redeliver. Work that must complete cannot stop at this layer.

## JetStream captures subjects into streams

[JetStream](https://docs.nats.io/concepts/jetstream) is the persistence layer. A stream captures subject patterns and defines storage, replicas, maximum age, and size. Consumers track delivery and acknowledgment state and can begin from a sequence, timestamp, newest record, or other position.

Pull consumers are usually the scalable worker default. Workers request batches, control backpressure, and acknowledge completion. Unacknowledged messages can be redelivered after the acknowledgment timeout, so handlers need idempotency. Durable consumers retain progress; ephemeral consumers disappear with subscriptions.

Retention is not only time-based. Limits policy retains by stream limits, interest policy removes data after all interested consumers acknowledge it, and work-queue policy assigns each message to one consumer path. A wrong policy can create surprising replay or deletion.

## “Exactly once” still depends on side effects

JetStream combines publication-ID deduplication and double acknowledgments to provide its exactly-once semantics. It still cannot atomically charge an external card or send an email with a message acknowledgment. A crash window remains between the side effect and ack, so consumers still need idempotency keys.

A practical contract is clearer: Core NATS accepts loss; JetStream normally accepts duplicates but not silent loss; cross-system exactly-once requires cooperation from the business database and external API.

## Choosing against RabbitMQ and Kafka

NATS uses one lightweight subject model for pub/sub, request-reply, queue groups, and persistent streams. A microservice control plane, edge topology, low-latency request-reply, and medium-scale event flow can share less infrastructure.

RabbitMQ's exchanges, bindings, TTLs, priorities, and dead-letter topology provide richer job routing. Kafka's partition log, Connect, Streams, and data-platform ecosystem fit extensive replay, CDC, and analytics. JetStream persistence is not a reason to replace Kafka using latency benchmarks alone; compare retention, consumer count, replay patterns, connectors, and cross-region needs.

## Two layers for agent systems

Core NATS can carry worker presence, live token telemetry, cancellation notices, and new-work signals. JetStream can retain tool-call events, task-state transitions, and queued work. Do not let the same subject be ephemeral in one environment and captured by a stream in another without documenting the reliability difference.

Classify every event as ephemeral, at-least-once, or replayable. Then define the subject, retention policy, durable name, acknowledgment wait, and maximum deliveries. That table prevents more incidents than a claim that “NATS is fast.”

## References

- [Core NATS deep dive](https://docs.nats.io/learn/core-nats/)
- [NATS queue groups](https://docs.nats.io/learn/core-nats/queue-groups)
- [JetStream concepts](https://docs.nats.io/concepts/jetstream)
- [JetStream pull consumers](https://docs.nats.io/learn/jetstream/pull-consumers)
