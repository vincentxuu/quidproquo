---
title: "Cloudflare Queues: Move Work off the Request Path into Retryable Batches"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare-queues, cloudflare-workers, message-queue, serverless, background-jobs, edge-computing]
lang: en
tldr: "Cloudflare Queues provides at-least-once delivery, batched consumers, retries, delays, and DLQs. It fits background work around Workers, while consumers still require per-message acknowledgment and idempotency."
description: "Cloudflare Queues producers, consumers, batches, retries, DLQs, pull consumers, platform limits, and boundaries against SQS and durable execution."
series:
  name: "Technology Choices in the AI Era"
  order: 32
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-cloudflare-queues)

[Cloudflare Queues](https://developers.cloudflare.com/queues/) lets a Worker validate and enqueue on the request path while another consumer Worker performs slow work. The platform stores and delivers messages and supplies retries, batching, delays, and dead-letter queues. External infrastructure can also consume through HTTP pull consumers.

It fits webhooks, email, synchronization, document processing, and AI batches. It is not a replayable event platform or a durable workflow engine.

## At-least-once is the first contract

Queues defaults to at-least-once delivery. A message arrives at least once and may rarely repeat. Producers create task IDs, database inserts use them as keys, and external APIs receive idempotency keys.

```ts
export default {
  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        await env.DB.prepare(
          "INSERT OR IGNORE INTO jobs (id, payload) VALUES (?, ?)"
        ).bind(message.id, JSON.stringify(message.body)).run();
        message.ack();
      } catch {
        message.retry({ delaySeconds: 60 });
      }
    }
  },
};
```

`ack()` prevents redelivery but does not create a transaction with a database or external side effect. `INSERT OR IGNORE` is illustrative; a real handler records state and distinguishes completed work from an in-progress attempt.

## Batches save invocations and amplify failures

Consumer bindings define maximum batch size and wait time, with the first threshold triggering delivery. Batching external APIs or D1 writes reduces invocations and round trips. If one message fails without per-message acknowledgments, however, the whole batch may return.

Acknowledge each completed message and retry only failures. Use whole-batch operations only when a shared transaction justifies them. Batch size must account for downstream API limits and Worker memory, CPU, and wall-clock constraints.

## Retries need a DLQ

After maximum retries, messages are deleted or written to a dead-letter queue. A DLQ needs alarms, retention, inspection, and a redrive workflow. Include error category, schema version, and attempt metadata so operators can distinguish transient failures, permanent input defects, and deployment regressions.

Delays smooth traffic and implement backoff but are not a precise scheduler. Use Cron Triggers for scheduled time and Workflows or another durable engine for multi-step waits and recovery.

## Check platform limits first

Official limits vary over time and plan, so architecture should link to the current table. Relevant boundaries include message size, batches, retention, backlog, consumer duration, and throughput. Put documents and model output in R2 and queue only URI, hash, tenant, trace ID, and task parameters.

Worker consumers provide the tightest Cloudflare integration. Pull consumers let Kubernetes, VMs, or other clouds consume over HTTP, but still require visibility, acknowledgments, and credential rotation.

## Choosing against SQS and Workflows

Queues is the natural default when the application runs on Workers and wants global ingress without broker operations. SQS is smoother for AWS workloads with Lambda and SNS fan-out. Kafka, Pulsar, or Redpanda fit replay and independent consumer groups. Cloudflare Workflows fits checkpoints, sleeps, and compensation rather than stacking queue retries.

AI agent workers make expensive external calls. Messages should carry immutable input pointers and budgets. Consumers claim an idempotency record before calling a model, store the result, and then acknowledge. That sequence matters more than raising concurrency; otherwise redelivery pays for the same tokens twice.

## References

- [Cloudflare Queues overview](https://developers.cloudflare.com/queues/)
- [Cloudflare Queues delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/)
- [Cloudflare Queues batching, retries, and delays](https://developers.cloudflare.com/queues/configuration/batching-retries/)
- [Cloudflare Queues limits](https://developers.cloudflare.com/queues/platform/limits/)
