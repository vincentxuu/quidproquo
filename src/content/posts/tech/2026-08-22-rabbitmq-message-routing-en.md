---
title: "RabbitMQ: Express Routing with Exchanges, Preserve Work with Quorum Queues"
date: 2026-08-22
category: tech
type: deep-dive
tags: [rabbitmq, message-queue, amqp, distributed-systems, background-jobs, event-streaming]
lang: en
tldr: "RabbitMQ's strength is routing through exchanges, bindings, and queues. For replicated work, default to quorum queues and combine publisher confirms, manual acknowledgments, and idempotent consumers."
description: "RabbitMQ's exchange model, quorum queues, acknowledgments and confirms, stream boundaries, and selection against Kafka and NATS."
series:
  name: "AI 時代的技術選擇"
  order: 26
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-rabbitmq-message-routing)

In [RabbitMQ](https://www.rabbitmq.com/docs), producers publish to an exchange before binding rules route messages into one or more queues. Direct, topic, fanout, and headers exchanges keep work distribution, broadcast, pattern routing, and dead-letter flows in broker topology instead of scattering that logic across producers.

When the requirement is “someone must process this work, failures must retry, and categories go to different workers,” RabbitMQ maps more directly to the problem than a partitioned log.

## Exchanges, bindings, and queues have separate jobs

A producer publishes to an exchange. Routing keys and bindings choose destination queues, and consumers receive deliveries from queues. Multiple consumers on one queue divide work. Multiple queues bound to one exchange each receive a copy. Those topologies are not interchangeable.

```text
producer -> orders(topic exchange)
              | orders.paid.*
              +--> fulfillment queue -> workers
              | orders.*.failed
              +--> incident queue -> on-call worker
```

This model provides finer routing than Kafka consumer groups and naturally supports short-lived work, priorities, TTLs, and dead-letter exchanges. Messages normally disappear after acknowledgment. If independent consumers must rewind and replay history, use RabbitMQ Streams, Kafka, or Redpanda.

## Quorum queues are the high-availability default

[Quorum queues](https://www.rabbitmq.com/docs/quorum-queues) are durable replicated queues built on Raft and are RabbitMQ's modern choice for data safety and leader election. RabbitMQ 4.0 removed classic queue mirroring, so new systems should not copy old mirrored-classic-queue tutorials.

Quorum queues fit long-lived, important work queues that need replication. They are a poor fit for large numbers of transient or exclusive queues, minimum latency, very long backlogs, or large fan-outs; the latter cases point toward streams. Three members are a common starting point. More members add consensus cost rather than free safety.

## Confirms and acknowledgments transfer responsibility in opposite directions

A publisher confirm says the broker has accepted responsibility; a quorum queue confirms after a quorum accepts the message. A manual consumer acknowledgment says the application completed necessary work, allowing the broker to remove the delivery. Durable queues and persistent messages without confirms and manual acknowledgments still leave loss windows.

```ts
channel.prefetch(20);
channel.consume("fulfillment", async (msg) => {
  if (!msg) return;
  try {
    await processOrder(JSON.parse(msg.content.toString()));
    channel.ack(msg);
  } catch {
    channel.nack(msg, false, false);
  }
});
```

Manual acknowledgments imply at-least-once delivery. If a worker completes a side effect and crashes before acknowledgment, the message returns. `processOrder` therefore needs an idempotency key. Requeue behavior must also be explicit to avoid poison-message loops. Quorum queues track delivery attempts, but the team still owns dead-letter policy.

## RabbitMQ Streams are not a faster ordinary queue

RabbitMQ Streams are persistent replicated append-only logs with non-destructive consumption, so records can be reread. Super streams add partitions for throughput. They let one RabbitMQ cluster serve some event-streaming workloads, but ordinary queue semantics such as priorities and per-message TTLs do not all transfer.

Use quorum queues for AMQP routing and reliable work. Evaluate streams for replay and high throughput within RabbitMQ. If long-lived logs, CDC, and stream processing define the whole platform, Kafka usually has the broader ecosystem.

## Practical AI workloads

RabbitMQ fits LLM batches, document parsing, embeddings, tool execution, and webhook retries. Put a task ID, tenant, input location, and idempotency key in the message—not a whole document. Set prefetch to bound unacknowledged work, and give retries a limit, backoff, and dead-letter queue.

Long-running agent work exposes a boundary. Extending an acknowledgment timeout does not create durable execution. After a worker crash, RabbitMQ can redeliver the entire message but cannot know which workflow steps completed. Workflows that recover step by step or wait hours for a person belong in Temporal, Restate, or Trigger.dev.

## References

- [RabbitMQ queues](https://www.rabbitmq.com/docs/queues)
- [RabbitMQ quorum queues](https://www.rabbitmq.com/docs/quorum-queues)
- [RabbitMQ acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms)
- [RabbitMQ streams](https://www.rabbitmq.com/docs/streams)
