---
title: "Cloudflare Workflows: Durable Multi-Step Execution on Workers"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-workflows, cloudflare-workers, durable-execution, workflow, serverless]
lang: en
tldr: "Cloudflare Workflows turns multi-step Workers processes into durable steps: each step can retry, sleep, wait for events, and register rollbacks, while instances can be inspected, paused, resumed, or terminated. Queues fit single-step background work; Workflows fit long processes that must remember progress."
description: "A practical guide to Cloudflare Workflows: WorkflowEntrypoint, step.do, sleep, waitForEvent, retries, rollback, instance lifecycle, limits, pricing, and the boundary with Queues."
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 9
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-workflows-durable-steps)

[Cloudflare Queues](/posts/tech/2026-08-22-cloudflare-queues-en) moves slow work out of the request path, but it is built around "receive one thing, process it later." Once the work becomes a process, the problem changes: read an R2 file, generate embeddings, write to Vectorize, send email, wait for human approval, then sync an external API tomorrow. The system needs to know which step finished, which step should retry, and where to resume after a callback arrives.

[Cloudflare Workflows](https://developers.cloudflare.com/workflows/) lives there. It brings serverless durable execution to the [Workers](https://developers.cloudflare.com/workers/) platform: split a process into steps, let the platform persist step results, and continue after sleeps, webhooks, retries, or runtime restarts.

```txt
Worker / Queue / Cron / Durable Object
        |
        v
Workflow instance
        |
        +-- step.do("read input")
        +-- step.do("call model", retry policy)
        +-- step.waitForEvent("approval")
        +-- step.do("publish")
        +-- rollback handlers when needed
```

The main boundary is simple: Queues is a work buffer, Workflows is process state. A queue consumer can trigger a Workflow, but queue retries should not be stretched into a process engine.

## Step Is the Durable Unit

A Workflow is a class that extends `WorkflowEntrypoint` and implements `run(event, step)`. `event` carries the parameters used to create the instance. `step` provides APIs such as `do`, `sleep`, `sleepUntil`, and `waitForEvent`.

```ts
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";

type Params = {
  uploadKey: string;
  userId: string;
};

export class DocumentWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const document = await step.do("read document", async () => {
      const object = await this.env.BUCKET.get(event.payload.uploadKey);
      if (!object) throw new Error("document not found");
      return await object.text();
    });

    const chunks = await step.do("chunk document", async () => {
      return splitIntoChunks(document);
    });

    await step.do(
      "write embeddings",
      {
        retries: { limit: 5, delay: "10 seconds", backoff: "exponential" },
        timeout: "10 minutes",
      },
      async () => {
        await writeEmbeddings(this.env.VECTORIZE, chunks);
      },
    );

    return { chunks: chunks.length };
  }
}
```

The important part of `step.do()` is that the result is persisted after completion. If a later step fails, the Workflow does not need to read from R2 again or re-chunk the document. It resumes from the last successful durable step. That is the practical difference between Workflows and a plain `async function`.

When splitting steps, I ask one question: if the next piece fails, should the previous piece run again? If the answer is no, split it. External API calls, database writes, file reads, and expensive model outputs usually deserve their own step.

## Trust Step Returns for State

Workflows may hibernate. When an instance enters sleep, retry delay, or `waitForEvent`, the runtime can pause, and the next wake-up may not reuse the same in-memory lifetime.

Do not store process state in mutable variables outside steps. This is fragile:

```ts
export class BadWorkflow extends WorkflowEntrypoint<Env> {
  async run(_event: WorkflowEvent<unknown>, step: WorkflowStep) {
    const done: string[] = [];

    await step.do("first", async () => {
      done.push("first");
    });

    await step.sleep("wait", "1 hour");

    await step.do("second", async () => {
      return done.length;
    });
  }
}
```

After waking up, `done` may be empty again. A sturdier pattern is to build state from step returns:

```ts
export class GoodWorkflow extends WorkflowEntrypoint<Env> {
  async run(_event: WorkflowEvent<unknown>, step: WorkflowStep) {
    const first = await step.do("first", async () => {
      return { finished: true };
    });

    await step.sleep("wait", "1 hour");

    return await step.do("second", async () => {
      return { firstFinished: first.finished };
    });
  }
}
```

The same rule applies to side effects. Logs, random values, creating another Workflow instance, or writing to external systems outside `step.do()` may repeat after a runtime restart. Step-external code should normally be side-effect-free helpers or clients. For resources such as Hyperdrive connections, Cloudflare recommends creating and using the connection inside each `step.do()`.

## Retry Is Designed Per Step

Each `step.do()` can have its own retry and timeout policy. Workflows has defaults, but production code should be explicit when protecting downstream systems.

```ts
await step.do(
  "sync crm",
  {
    retries: {
      limit: 5,
      delay: ({ ctx, error }) => {
        if (error.message.includes("rate limit")) {
          return `${ctx.attempt * 30} seconds`;
        }
        return "10 seconds";
      },
      backoff: "linear",
    },
    timeout: "5 minutes",
  },
  async () => {
    await syncToCrm();
  },
);
```

Some errors should not retry: invalid payloads, permission failures, or a payment processor explicitly rejecting a charge. Throw `NonRetryableError` inside the step to fail immediately.

```ts
import { NonRetryableError } from "cloudflare:workflows";

await step.do("validate input", async () => {
  if (!event.payload.userId) {
    throw new NonRetryableError("missing userId");
  }
});
```

Idempotency still matters. Workflows persists successful step output and retries failed steps, but it cannot turn a payment API, email provider, or CRM into a transaction. Any step with external side effects should first check whether the operation already happened, or use an idempotency key supported by that external system.

## Sleep and Event Waiting

The part that makes Workflows feel different from Queues is that waiting is part of the process.

```ts
await step.sleep("wait before retrying import", "1 hour");
await step.sleepUntil("publish next week", Date.parse("2026-09-06T01:00:00Z"));
```

`step.sleep()` uses relative time. `step.sleepUntil()` uses a fixed time. Cloudflare's documented sleep limit is 365 days. While an instance is waiting, it does not consume active concurrency, and idle time spent waiting on APIs or sleeping does not consume CPU time.

Human review, webhook callbacks, and external system notifications use `step.waitForEvent()`.

```ts
const approval = await step.waitForEvent<{ approved: boolean }>(
  "wait for editor approval",
  { type: "approval", timeout: "24 hours" },
);

if (!approval.payload.approved) {
  return { published: false };
}
```

Another Worker, webhook route, or REST API can call `sendEvent()` on the same instance. The event `type` must match the `waitForEvent()` call. Cloudflare's docs also note that event type currently supports letters, digits, underscores, and dashes, but not `.`.

## Trigger and Lifecycle

Workflows can be triggered from several places: an HTTP Worker, queue consumer, scheduled handler, Durable Object, Wrangler CLI, REST API, or a `schedules` entry on the workflow binding in `wrangler.jsonc`.

```jsonc
{
  "workflows": [
    {
      "name": "document-workflow",
      "binding": "DOCUMENT_WORKFLOW",
      "class_name": "DocumentWorkflow",
      "schedules": ["0 * * * *"]
    }
  ]
}
```

From a Worker, call `create()` on the binding:

```ts
const instance = await env.DOCUMENT_WORKFLOW.create({
  id: `document-${uploadId}`,
  params: { uploadKey, userId },
});

return Response.json({ instanceId: instance.id });
```

You can later call `get(id)` and inspect `status()`. Status tells you whether the instance is queued, running, waiting, paused, errored, terminated, or complete. For operations work, you can also pause, resume, and terminate. Termination can run rollback handlers when requested. Restart erases intermediate state and runs from the beginning.

These lifecycle APIs make Workflows more than a background job. A user can see import progress, support can terminate a stuck process, and engineers can inspect the failed step.

## Rollback Is Compensation

Workflows supports rollback handlers on `step.do()`. When a later step fails, registered rollbacks run in reverse step-start order.

```ts
await step.do(
  "reserve inventory",
  async () => {
    const reservation = await reserveInventory();
    return { reservationId: reservation.id };
  },
  {
    rollback: async ({ output }) => {
      if (output) {
        await releaseInventory(output.reservationId);
      }
    },
    rollbackConfig: {
      retries: { limit: 3, delay: "10 seconds", backoff: "linear" },
      timeout: "2 minutes",
    },
  },
);
```

This is saga-style compensation, not a database transaction. It fits reserving inventory, creating temporary files, or deleting external resources after a failure. It should not be treated as atomic commit across D1, R2, and third-party APIs. Each rollback handler also needs retries and idempotency.

## Cost and Limits

Workflows is available on Workers Free and Paid plans, but Cloudflare's pricing docs say step and storage billing starts on August 10, 2026. It uses Workers Standard pricing for requests and CPU time, plus storage and step usage.

Several limits shape the design:

- Event payloads are capped at 1 MiB.
- A non-stream step result is capped at 1 MiB.
- Total persisted state per instance has different Free and Paid limits.
- Workers Free supports 1,024 steps per Workflow. Workers Paid defaults to 10,000 steps and can be configured up to 25,000.
- `step.sleep()` can wait up to 365 days.
- Completed instance state is retained for a period that differs by plan, and instance creation can request shorter retention.
- Workflows cannot currently be deployed to Workers for Platforms namespaces.

My default design is to pass immutable pointers in the payload, store durable results in R2, D1, or Vectorize, and keep Workflow state to the summary needed to resume the process. Large documents, full model outputs, and long-term audit records should not live as step output. That turns Workflows storage into the wrong data store.

## When to Choose Workflows

I would choose Workflows for these cases:

- Document ingestion: upload, parse, chunk, embed, index, notify.
- Orders or billing: reserve resources, charge, email, compensate on failure.
- User lifecycle: trials, expiration reminders, downgrades, data deletion.
- Human review: AI generates a draft, waits for approval, then publishes.
- Cross-system sync: unstable third-party APIs that need step-level retry and status checks.

I would not use it for every background job. Single-step email, logging, batch flushes, and short fan-out tasks are lighter with Queues. Per-user, per-session, or per-entity locks, WebSocket coordination, and live state fit Durable Objects better. Existing Postgres/MySQL connectivity belongs to Hyperdrive; Workflows only owns the process.

Cloudflare Workflows has a practical place in the Edge Platform: it is not another queue, and it does not turn business logic into YAML. It lets you write the process in TypeScript while the platform owns completed steps, waiting, retries, rollbacks, and instance lifecycle.

## References

- [Cloudflare Workflows docs](https://developers.cloudflare.com/workflows/)
- [Build your first Workflow](https://developers.cloudflare.com/workflows/get-started/guide/)
- [Rules of Workflows](https://developers.cloudflare.com/workflows/build/rules-of-workflows/)
- [Workflows Workers API](https://developers.cloudflare.com/workflows/build/workers-api/)
- [Sleeping and retrying](https://developers.cloudflare.com/workflows/build/sleeping-and-retrying/)
- [Events and parameters](https://developers.cloudflare.com/workflows/build/events-and-parameters/)
- [Trigger Workflows](https://developers.cloudflare.com/workflows/build/trigger-workflows/)
- [Workflows limits](https://developers.cloudflare.com/workflows/reference/limits/)
- [Workflows pricing](https://developers.cloudflare.com/workflows/reference/pricing/)
