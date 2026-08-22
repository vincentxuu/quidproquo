---
title: "Hatchet: One Engine for Task Queues, DAGs, and Durable Tasks"
date: 2026-08-22
category: tech
type: deep-dive
tags: [hatchet, durable-execution, task-queue, workflow, postgres, ai-agent]
lang: en
tldr: "Hatchet unifies regular tasks, DAGs, and durable tasks behind a Postgres-backed control plane. Durable tasks checkpoint at waits and child tasks, then replay deterministic orchestration code on recovery."
description: "Hatchet task queues, DAGs, durable tasks, checkpoints, workers, self-hosting, and boundaries for AI agents."
series:
  name: "AI 時代的技術選擇"
  order: 35
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-hatchet-durable-workflows)

[Hatchet](https://github.com/hatchet-dev/hatchet) is more than a durable workflow SDK. It puts a durable task queue, static DAGs, dynamic workflows, schedules, rate limits, stored results, observability, and a dashboard in one Postgres-backed platform. Workers execute application code in Python, TypeScript, or Go.

That breadth distinguishes it from systems focused only on durable orchestration. A team can begin with background tasks and upgrade only the processes that need long-lived coordination.

## Separate regular and durable tasks

Regular tasks perform side effects: querying a database, calling a model, sending email, or updating SaaS. Hatchet persists task executions and outputs and offers retries, timeouts, priorities, and queue controls, but external effects still require idempotency.

A durable task is an orchestrator. In the official model it performs durable-context operations or spawns child tasks: waiting for time, events, or children and then deciding what to do next.

The following conceptual code deliberately omits version-specific SDK details:

```text
const research = hatchet.durableTask({
  name: "research-agent",
  fn: async (input, ctx) => {
    const plans = await ctx.aio.spawnMany(input.queries.map(runSearch));
    const approval = await ctx.aio.waitFor("research.approved");
    return ctx.aio.spawn(writeReport, { plans, approval });
  },
});
```

The stable boundary matters: search, model, and database writes should be child tasks, not hidden inside durable orchestration code. Use the official signature for the selected SDK version in implementation.

## A checkpoint is not a saved call stack

When a durable task finishes sleeping, receives an event, or completes a child wait, Hatchet checkpoints progress in a durable event log. It can evict the waiting task and release its worker slot. Once the condition is ready, it requeues the task and reconstructs state from history.

Recovery re-runs the code path leading to checkpoints while skipping recorded operations. Orchestration between checkpoints must therefore be deterministic. Do not directly query a database, call an API, or use uncontrolled randomness to select a branch; move those operations to child tasks.

Official material describes this as avoiding re-execution of completed application logic and providing exactly-once semantics. The safe engineering scope is narrower: Hatchet can deduplicate recorded tasks and durable operations, but cannot share a transaction with an arbitrary external API. A child may still be redelivered after its side effect succeeds but before it reports the result.

## DAGs and dynamic workflows have different jobs

A known data pipeline fits a DAG: declare dependencies upfront and let the engine parallelize ready tasks. Agent loops, recursive research, human approval, and runtime fan-out do not know their shape at startup, so durable tasks can spawn children dynamically.

Do not turn every job into a durable task. Use a regular task for independent work, a DAG for fixed dependencies, and a durable task only when orchestration decisions must survive waits. This keeps side-effect boundaries visible and reduces the cognitive cost of deterministic replay.

## Self-hosting is a control plane plus Postgres

Hatchet Cloud operates the control plane while workers may remain in a private VPC. A self-hosted installation includes the Hatchet engine, REST API, dashboard, and PostgreSQL. RabbitMQ is optional for high-throughput real-time dispatch; Postgres-backed messaging is the simpler alternative. Independent workers connect to the engine over gRPC.

The CLI and Docker Compose fit development or small deployments, while Kubernetes and Helm fit production. “Backed by Postgres” is not zero operations: database HA, backups, connection budgets, event retention, engine upgrades, worker credentials, and gRPC ingress remain production responsibilities.

## Dynamic fan-out is valuable for agents

A research agent can inspect stored child results, decide how many additional search, browser, or model tasks to launch, and wait for approval without occupying a worker slot. Each child has separate retry and observability, making repair easier than one enormous queue consumer.

Permissions and cost controls are not automatic. Child inputs should carry tenant, budget, tool allowlist, prompt and model versions, and idempotency keys. Large artifacts belong in object storage. Code upgrades also need versioning or compatibility policy so old histories do not unexpectedly take new branches.

## When to choose Hatchet

Hatchet deserves an early trial when a team wants one platform for background queues, DAGs, schedules, and dynamic durable workflows, prefers Python, TypeScript, or Go, and values a Postgres self-hosting path. Inngest is more direct for event-driven serverless functions and managed flow controls. Restate is distinctive for keyed durable state and service semantics. Temporal merits comparison for mature large-scale workflow governance.

A proof of concept should test failure, not just the happy path. Kill a worker after a child side effect, restart the control plane during a wait, upgrade workflow code, and verify history, duplicate handling, and manual replay against the team's failure contract.

## References

- [Hatchet repository and platform overview](https://github.com/hatchet-dev/hatchet)
- [Hatchet durable tasks](https://github.com/hatchet-dev/hatchet/blob/main/frontend/docs/pages/v1/durable-tasks.mdx)
- [Hatchet durable execution](https://hatchet.run/platform/durable-execution)
- [Hatchet core concepts](https://docs.hatchet.run/home/concepts)
- [Hatchet self-hosting overview](https://docs.hatchet.run/self-hosting/overview)
- [Hatchet: How to think about durable execution](https://hatchet.run/blog/durable-execution)
