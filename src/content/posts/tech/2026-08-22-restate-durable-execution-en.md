---
title: "Restate: Put Journals, Durable State, and Service Calls in One Execution Model"
date: 2026-08-22
category: tech
type: deep-dive
tags: [restate, durable-execution, workflow, distributed-systems, backend, ai-agent]
lang: en
tldr: "Restate journals operations and results, then re-executes handlers while skipping completed work. Virtual Objects and Workflows add keyed state, single-writer semantics, and long-lived coordination."
description: "Restate journal replay, durable steps, Services, Virtual Objects, Workflows, deployment, and boundaries for AI agents."
series:
  name: "Technology Choices in the AI Era"
  order: 34
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-restate-durable-execution)

[Restate](https://docs.restate.dev/foundations/key-concepts) makes durable execution a service layer. Application handlers still deploy on Node.js, Bun, Deno, Cloudflare Workers, Lambda, or other infrastructure. Restate Server sits in front, receives invocations, persists a journal, schedules retries, and provides durable state, messages, and service calls.

It does not snapshot process memory. After failure, the handler runs again while the journal replays prior operation results.

## `ctx.run` is the side-effect boundary

Database access, HTTP APIs, file I/O, and nondeterministic computation belong in `ctx.run`. Once an operation completes, its result enters the journal. On retry, Restate returns the record without invoking the callback again.

```ts
const agent = restate.service({
  name: "Agent",
  handlers: {
    answer: async (ctx, req: Request) => {
      const source = await ctx.run("load-source", () => load(req.uri));
      const answer = await ctx.run("call-model", () => ask(source));
      await ctx.run("save-answer", () => save(req.id, answer));
      return answer;
    },
  },
});
```

After a crash, the handler starts at the top and skips recorded operations such as `load-source`. A direct `Math.random()`, `Date.now()`, or fetch can alter replay control flow. Use deterministic helpers such as `ctx.rand` and `ctx.date`, or place the operation in `ctx.run`.

The journal cannot share a transaction with every external side effect. A remote service can succeed before the journal commit and then receive a retry. Payments, email, and model requests therefore still require idempotency keys.

## Three service primitives have distinct semantics

A Basic Service fits stateless handlers. A Virtual Object is addressed by key and provides durable state per key. Exclusive handlers have single-writer semantics for that key, so carts, devices, tenant budgets, and agent sessions need less custom distributed locking.

A Workflow is addressed by workflow ID. Its main run handler executes once per ID and works with signals and queries for long processes. It fits onboarding, order sagas, human approval, and agent runs. External callbacks can wake an invocation through awakeables or durable promises instead of polling a status table.

“Runs once” describes Restate's coordination of the workflow invocation. It does not turn every external API into exactly-once execution. Architecture documents and incident runbooks should preserve this distinction.

## One server, many compute environments

Restate Server is a standalone Rust runtime between clients and service deployments. A single binary works for development and simple installations. Production high availability still requires cluster, durable storage, backups, journal retention, and version-compatibility planning. Service code can run elsewhere and on a different compute platform.

That separation gives Workers, Lambda, and containers a shared execution model, while adding a network hop and control plane. Teams must decide which sensitive inputs and outputs enter the journal, how long they remain, how deletion works, and how old executions survive code upgrades.

## Layer agent state deliberately

A Virtual Object can use an agent or conversation ID as its key and serialize small control-state changes. A Workflow represents a long-lived run, while `ctx.run` wraps model and tool side effects. Large transcripts, documents, and embeddings should live in object storage or a database with hashes and URIs in durable state.

Pin token budget, tool permissions, model version, and prompt version in invocation state. Durability recovers control flow; it does not prevent a retried agent from gaining more authority or determine whether old prompts remain safe with new code.

## When to choose Restate

Restate is distinctive when one problem combines reliable calls, keyed state, per-key serialization, and long workflows. A queue is smaller for one background webhook. Inngest emphasizes event-driven serverless experience and flow controls. Hatchet combines a general task queue, DAGs, and dynamic child tasks.

Before adopting it, run a crash test immediately after an external side effect. Validate idempotency, journal replay, code upgrades, and manual repair. Durable execution earns its place when the worst failure point remains explainable.

## References

- [Restate key concepts](https://docs.restate.dev/foundations/key-concepts)
- [Restate durable steps for TypeScript](https://docs.restate.dev/develop/ts/durable-steps)
- [Restate services, virtual objects, and workflows](https://docs.restate.dev/develop/ts/services)
- [Restate service communication model](https://docs.restate.dev/foundations/services)
- [Restate external events](https://docs.restate.dev/develop/ts/external-events)
- [Serving Restate TypeScript services](https://docs.restate.dev/develop/ts/serving)
