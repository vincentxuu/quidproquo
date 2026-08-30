---
title: "Cloudflare Queues: Move Work off the Request Path into Retryable Batches"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare-queues, cloudflare-workers, message-queue, serverless, background-jobs, edge-computing]
lang: en
tldr: "Cloudflare Queues is the message queue beside Workers: producers enqueue slow work, consumers process it with batching, ack/retry, delays, and DLQs. It is good for single-step background jobs; durable multi-step state belongs in Workflows."
description: "A practical guide to Cloudflare Queues: producer and consumer bindings, send/sendBatch, batching, ack/retry, delays, Dead Letter Queues, limits, pricing, and where Queues fits in a Workers app."
series:
  name: "Technology Choices in the AI Era"
  order: 32
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 8
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-cloudflare-queues)

After moving a site to [Cloudflare Workers](https://developers.cloudflare.com/workers/), the first real issue is often not whether a request can return. It is that the request starts doing too much: writing logs, sending email, generating thumbnails, synchronizing with third-party APIs, writing events to a database, saving AI chat traces, or producing embeddings.

Those jobs make users wait when they run in the request path, and failures turn directly into 500 responses. `ctx.waitUntil()` lets a Worker return a response before finishing extra work, but it still belongs to the same invocation. It is useful for short tails, not for work that needs retries, batching, backpressure, or protection from an unstable downstream service.

[Cloudflare Queues](https://developers.cloudflare.com/queues/) sits in that gap. A producer Worker writes a job description to a queue. A consumer Worker reads messages from that queue and processes them later. It is a serverless message queue next to Workers, designed to move slow work, bursts, and downstream failures out of user-facing requests.

```txt
Client
  |
  v
Worker route
  |
  +-- fast response
  |
  +-- env.JOBS.send({ type, id, payload })
        |
        v
      Queue
        |
        v
   Consumer Worker
        |
        +-- D1 / R2 / external API / Workers AI
```

## What Layer Queues Solves

Queues is most useful when the work has three traits.

First, the user does not need the result immediately. Examples include sending a notification after a form submission, writing audit logs to [R2](https://developers.cloudflare.com/r2/), or batching request logs into an external analytics service.

Second, the downstream system needs protection. A third-party API may have a rate limit. A database may behave better with batched writes. A consumer can use batch size, batch timeout, and concurrency to control processing speed instead of letting frontend traffic hit the downstream dependency directly.

Third, failure can be retried and you can make the operation idempotent. Cloudflare Queues uses at-least-once delivery by default. Once a message is written successfully, it should be delivered at least once, and in rare cases it may be delivered more than once. A consumer cannot assume that a job only runs one time. In practice, put a job id, event id, or idempotency key in the message. Use a primary key when writing to [D1](https://developers.cloudflare.com/d1/), and pass an idempotency key when calling payment or email APIs that support one.

The boundaries matter too. If you need to preserve state across a durable multi-step process, sleep for a long time, or resume from a specific step, look at [Cloudflare Workflows](https://developers.cloudflare.com/workflows/). If you need strongly consistent state and WebSocket coordination for one user, room, or document, look at [Durable Objects](https://developers.cloudflare.com/durable-objects/).

## Producers and Consumers

The basic model has three parts: queue, producer, and consumer.

A producer is the Worker that writes messages. Create a queue first:

```bash
npx wrangler queues create app-jobs
```

Then bind it to the producer Worker in `wrangler.jsonc`:

```jsonc
{
  "queues": {
    "producers": [
      {
        "queue": "app-jobs",
        "binding": "APP_JOBS"
      }
    ]
  }
}
```

The Worker can then call `send()` or `sendBatch()`:

```ts
type JobMessage =
  | { type: "send-email"; id: string; userId: string }
  | { type: "write-audit-log"; id: string; objectKey: string };

interface Env {
  APP_JOBS: Queue<JobMessage>;
}

export default {
  async fetch(request, env) {
    const job: JobMessage = {
      type: "send-email",
      id: crypto.randomUUID(),
      userId: "user_123",
    };

    await env.APP_JOBS.send(job);

    return Response.json({ queued: true, jobId: job.id });
  },
} satisfies ExportedHandler<Env>;
```

A consumer is the Worker that processes messages. It receives batches through a `queue()` handler:

```ts
type JobMessage =
  | { type: "send-email"; id: string; userId: string }
  | { type: "write-audit-log"; id: string; objectKey: string };

interface Env {
  DB: D1Database;
}

export default {
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      const job = message.body;

      await env.DB.prepare(
        "insert or ignore into processed_jobs (id, type) values (?, ?)",
      )
        .bind(job.id, job.type)
        .run();

      if (job.type === "send-email") {
        // Call your email provider here.
      }

      message.ack();
    }
  },
} satisfies ExportedHandler<Env, JobMessage>;
```

The consumer binding also lives in Wrangler configuration:

```jsonc
{
  "queues": {
    "consumers": [
      {
        "queue": "app-jobs",
        "max_batch_size": 10,
        "max_batch_timeout": 5
      }
    ]
  }
}
```

A queue can have multiple producers, but a push-based queue can only have one active consumer. That limitation should shape the design. If different jobs need different retry policies, batch sizes, or downstream throttles, split them into queues such as `email-jobs`, `audit-log-jobs`, and `embedding-jobs`.

## Batches, Retries, and Delays

The core of Queues is not just background execution. It is controlling how background work is consumed.

`max_batch_size` defaults to 10 and can go up to 100. `max_batch_timeout` defaults to 5 seconds and can go up to 60 seconds. Larger batches fit R2 logs, batch inserts, and external bulk endpoints. Smaller batches fit latency-sensitive work.

Failures need a clear boundary between batch failure and message failure. If the `queue()` handler throws an uncaught exception, the whole batch is retried. If only one message fails, call `message.retry()` for that message and `message.ack()` for messages that finished. That prevents one bad payload from dragging the whole batch through repeated work.

Delayed messages are useful for simple "do this later" cases, such as checking a third-party import status again in 10 minutes.

```ts
await env.APP_JOBS.send(
  { type: "write-audit-log", id: crypto.randomUUID(), objectKey: "logs/1.json" },
  { delaySeconds: 600 },
);
```

Delay is still not a workflow engine. Use `delaySeconds` for a one-time delay or retry delay. When a process needs to remember "step one is done, wait for review, call an API tomorrow, resume from step three if it fails", that is a Workflows problem.

## DLQ Is an Operations Surface

A [Dead Letter Queue](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/) is the place messages go after a consumer reaches its retry limit. Without a DLQ, messages that exceed the retry limit are deleted permanently. With a DLQ, they are written to another queue so you can attach a separate consumer, save them to R2, notify engineers, or run a manual repair path.

```jsonc
{
  "queues": {
    "consumers": [
      {
        "queue": "app-jobs",
        "dead_letter_queue": "app-jobs-dlq"
      }
    ]
  }
}
```

A DLQ is not a trash can. It is an operations surface. Before production, decide at least three things:

- Which errors should retry, and which errors should be acknowledged and recorded.
- Where DLQ messages should be stored, such as R2 or D1.
- Where the team will inspect backlog, oldest message age, and failure rate.

Cloudflare Queues also exposes queue metrics such as backlog count, backlog bytes, and oldest message timestamp. These are more useful than logs alone because they directly show whether consumption is keeping up with production.

## Cost and Limits Shape the Schema

Queues is priced by operation. Cloudflare defines an operation as each 64 KB of data written, read, or deleted. A small message that is processed normally roughly maps to three operations: write, read, and delete. Retries add read operations. Writing to a DLQ adds another write.

Several limits affect message design directly:

- Message size is capped at 128 KB, so large payloads should not be placed directly in the queue.
- `sendBatch()` supports up to 100 messages and has a total batch size limit.
- Each queue has a per-second throughput limit; beyond it, `send()` or `sendBatch()` throws a Too Many Requests error.
- On the Free plan, message retention is 24 hours. On the Paid plan, retention defaults to 4 days and can be configured up to 14 days.
- Push-based consumer concurrency can scale up to a documented limit, and `max_concurrency` can be set lower to protect downstream systems.

I treat a message as a job pointer, not the job's whole data body. Put large payloads in R2, relational state in D1, per-entity coordination in Durable Objects, and only type, id, object key, required parameters, and idempotency key in the queue. That makes retries easier and avoids fighting the 128 KB message limit.

## Where Queues Fits in AI Apps

In a Cloudflare AI app, Queues usually belongs beside model calls rather than inside the call itself.

Examples:

- After a user uploads a document, the Worker returns "received" and a queue consumer performs chunking, embeddings, and writes to [Vectorize](https://developers.cloudflare.com/vectorize/).
- After an agent conversation ends, trace data, tool calls, and cost summaries are queued and later written to D1 or R2 in batches.
- Model output needs post-processing, email, Slack notification, or CRM synchronization, and the user should not wait for external APIs.
- Browser Run produces a screenshot or PDF, stores artifacts in R2, and Queues triggers follow-up processing.

If the work is "receive one thing, process it once", Queues is a good fit. If it turns into a stateful process with steps and waiting time, hand it to Workflows. That is the boundary for the next Edge Platform article.

## Launch Checklist

I would check a Queues design against this short list:

- The message has a stable id, so retries do not create duplicate side effects.
- Large payloads live in R2, D1, or Durable Objects; the queue carries references.
- Each job class has its own queue, at least when retry policies differ.
- The consumer uses `for...of` with `await` or an explicit `Promise.all()`, not `forEach()` for async processing.
- The consumer has explicit ack/retry behavior, so one bad message does not force a whole batch to repeat.
- The DLQ has a consumer or a storage path.
- Backlog, oldest message age, and error rate are visible somewhere.
- When the app needs process state, it does not force Queues to act like Workflows.

Queues has a clear place in Cloudflare Edge Platform: it shortens Worker requests, lets slow jobs be consumed in batches, and gives failures a retry and DLQ path. It is not a database, and it is not a workflow engine. Drawing that line early keeps the system simple after background side effects start to pile up.

## Update Log

- 2026-08-30: Rewrote producer/consumer, batching, ack/retry, DLQ, limits/pricing, and AI app boundaries against Cloudflare Queues 2026 docs, and added the post to the Cloudflare Edge Platform series.

## References

- [Cloudflare Queues docs](https://developers.cloudflare.com/queues/)
- [Cloudflare Queues: Get started](https://developers.cloudflare.com/queues/get-started/)
- [How Queues works](https://developers.cloudflare.com/queues/reference/how-queues-works/)
- [Queues JavaScript APIs](https://developers.cloudflare.com/queues/configuration/javascript-apis/)
- [Batching, retries and delays](https://developers.cloudflare.com/queues/configuration/batching-retries/)
- [Dead Letter Queues](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/)
- [Consumer concurrency](https://developers.cloudflare.com/queues/configuration/consumer-concurrency/)
- [Queues delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/)
- [Queues limits](https://developers.cloudflare.com/queues/platform/limits/)
- [Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/)
