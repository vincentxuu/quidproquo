---
title: "Inngest: Turn Serverless Functions into Recoverable Workflows with Steps"
date: 2026-08-22
category: tech
type: deep-dive
tags: [inngest, durable-execution, workflow, serverless, background-jobs, ai-agent]
lang: en
tldr: "Inngest makes steps the persistence boundary for ordinary TypeScript, Python, and Go functions. Recovery re-executes the function while memoized steps avoid repeating completed side effects."
description: "Inngest durable functions: step memoization, retries, waits, flow control, deployment, and boundaries for AI agents."
series:
  name: "Technology Choices in the AI Era"
  order: 33
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-inngest-durable-functions)

[Inngest](https://www.inngest.com/docs/learn/how-functions-are-executed) is an event-driven durable execution platform. You write ordinary TypeScript, Python, or Go functions and put database, API, and model calls inside `step.run()`. Inngest persists each step result and manages retries, sleeps, event waits, and flow control.

Its value is not that failures disappear. It moves control logic otherwise scattered across queues, cron jobs, status tables, and retry loops into one execution history.

## Recovery re-executes the function

Each step is executed through a separate request to the function endpoint. Inngest memoizes a completed result. On the next invocation, it re-executes the handler from the top, injects that result, and skips the completed callback.

```ts
export const summarize = inngest.createFunction(
  { id: "summarize-document", retries: 4 },
  { event: "document/uploaded" },
  async ({ event, step }) => {
    const text = await step.run("extract", () => extract(event.data.uri));
    const summary = await step.run("summarize", () => callModel(text));
    await step.run("persist", () => saveSummary(event.data.id, summary));
  }
);
```

This does not restore a JavaScript call stack. A completed `extract` receives its recorded result while a failed `summarize` follows its retry policy. Database queries, HTTP requests, randomness, and time must not happen secretly outside steps because replay would perform them again.

Nor does this make arbitrary side effects exactly once. A process can fail after an external API succeeds but before its step result is recorded. Payments, email, and expensive model calls still need idempotency keys.

## Sleeps and waits release compute

`step.sleep()` and `step.waitForEvent()` hand waiting to the platform. No process, connection, or serverless invocation must remain alive for hours. This fits approvals, webhook callbacks, human input, and long backoff in an agent.

Concurrency, throttling, rate limiting, debounce, and priority are declarative controls. Concurrency counts active steps; sleeping or event-waiting runs do not occupy an active slot. Limits should still be scoped by tenant or provider key so one customer cannot exhaust shared capacity.

## Separate control and compute planes

Hosted Inngest operates event ingestion, queues, execution state, and scheduling while functions run in serverless, containers, or ordinary servers. HTTP serve mode lets Inngest call an endpoint; Connect lets persistent workers establish a connection. Code and credentials remain in the compute environment, but event data, step input/output, and execution metadata entering the hosted control plane require a data-classification decision.

Self-hosting is available, but the official architecture includes an Event API, event stream, Runner, Queue, Executor, state store, database, and API/UI. It is an operational system, not merely a binary. Managed service fits teams optimizing for low operations; self-hosting requires upgrades, backups, high availability, and retention planning.

## Agents fit well and can burn money

Agent loops contain model calls, tools, waits, and dynamic branches. Making each model and tool result a step allows recovery to replay the same decision path without paying again for earlier tokens. External events can resume approvals.

Execution history is not a complete agent-state strategy. Store large prompts, documents, and outputs in object storage, retaining URI, hash, model, prompt version, tenant, and budget in step state. Expensive steps need timeouts, retry classification, and idempotency keys; permanent 4xx failures should not loop under the same policy.

## When to choose Inngest

Inngest offers a short path for event-driven and serverless teams, especially TypeScript teams, that want retries, waits, observability, and flow control. A queue is simpler for independent one-step work. Restate merits comparison for keyed service state and single-writer semantics. Hatchet combines a task queue, DAGs, and dynamic durable tasks. Temporal has a broader ecosystem for a large cross-language workflow platform.

The deciding factor is not SDK syntax. It is whether the team accepts the function-replay and step-memoization contract and the data boundary of its control plane.

## References

- [Inngest: How functions are executed](https://www.inngest.com/docs/learn/how-functions-are-executed)
- [Inngest flow control](https://www.inngest.com/docs/guides/flow-control)
- [Inngest concurrency](https://www.inngest.com/docs/guides/concurrency)
- [Inngest deployment options](https://www.inngest.com/docs/platform/deployment)
- [Inngest self-hosting architecture](https://www.inngest.com/docs/self-hosting)
- [Inngest durable agents](https://www.inngest.com/docs/learn/durable-agents)
