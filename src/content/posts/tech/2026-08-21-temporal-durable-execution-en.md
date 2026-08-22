---
title: "Temporal: Write the Process as Code, and It Finishes Even After a Crash"
date: 2026-08-21
category: tech
type: deep-dive
tags: [temporal, durable-execution, ai-agent, task-queue, python]
lang: en
tldr: "Temporal is a durable execution platform (Server 1.31.2, Python SDK temporalio 1.31.0, MIT, verified 2026-08). What separates it from BullMQ / Celery isn't scale but the guarantee: a queue guarantees a message gets consumed, Temporal guarantees a multi-call process runs to completion. The price is that Workflow code must be deterministic — and LLM calls are inherently non-deterministic. This post covers how to resolve that tension and when the constraint isn't worth it."
description: "A deep dive into Temporal's durable execution model: the four building blocks (Workflow / Activity / Event History / Worker), why it recovers by replaying event history rather than restoring a memory snapshot, exactly which code patterns break determinism, how LLM and agent workloads fit in, and what self-hosting versus Temporal Cloud actually costs (prices verified 2026-08)."
series:
  name: "Technology Choices in the AI Era"
  order: 16
draft: false
---

🌏 [中文版](/posts/tech/2026-08-21-temporal-durable-execution)

This site already has deep dives on [BullMQ](/posts/tech/2026-03-27-bullmq-job-queue-nodejs-en) and [Celery](/posts/tech/2026-03-27-celery-python-task-queue-en), but a whole layer sits between them. When a process looks like "call an LLM → wait three days for a human approval → hit a third-party API → write back to the database," pushing it through a queue exposes the gap: when the worker dies at step three, you don't know whether steps one and two ran, and a retry starts over from the top. That LLM call gets paid for twice, and that email gets sent twice.

[Temporal](https://docs.temporal.io/) exists for exactly this. It's a durable execution platform, MIT-licensed. Latest stable Server is 1.31.2 ([Docker Hub `temporalio/server`](https://hub.docker.com/r/temporalio/server/tags), tag dated 2026-07-08), with Python SDK [`temporalio` 1.31.0](https://pypi.org/project/temporalio/) (2026-07-29) and TypeScript [`@temporalio/worker` 1.22.0](https://www.npmjs.com/package/@temporalio/worker) (2026-08-05) — all verified 2026-08.

## First, three things that aren't the same

Queues, streams, and durable execution get used interchangeably. They guarantee different things.

| Category | Examples | Guarantees |
|---|---|---|
| Task queue | [BullMQ](https://docs.bullmq.io/), [Celery](https://docs.celeryq.dev/) | A message gets consumed by some worker (with retries, delays, priorities) |
| Event stream | [Kafka](https://kafka.apache.org/documentation/), [NATS](https://docs.nats.io/) | Events are ordered, retained, and replayable by multiple consumers |
| Durable execution | Temporal, [Restate](https://docs.restate.dev/), [DBOS](https://docs.dbos.dev/) | A **process** spanning many external calls runs to completion, even through a crash |

The difference is the unit. A queue's unit is one message, a stream's unit is one event, and durable execution's unit is **the execution state of a whole process**. [Hatchet's docs](https://docs.hatchet.run/home/durable-execution) put it plainly: durable execution gives you "guarantees about tasks and workflows you wouldn't get from an ordinary task queueing system," and it is "priceless in systems that cannot reasonably be made idempotent, so replaying on failure is impossible."

You can of course build processes on a plain queue. The cost is that you maintain the state table yourself, write the idempotency key for every step yourself, and handle "step three failed but step two already sent the email" yourself. Temporal's pitch is moving all of that into the platform.

## Temporal's four building blocks

**Workflow** is your process code, written in a general-purpose language (seven SDKs: .NET, Go, Java, PHP, Python, Ruby, TypeScript). **Activity** is each action that touches the outside world — sending mail, calling an API, querying a database, invoking an LLM — retried automatically according to the Retry Policy you configure. The **Temporal Service** is the bookkeeper, appending each step to the **Event History**. The **Worker** is your own process, actually running your code.

That last point is routinely misread. Temporal's own docs stress it: "A common misconception is that the Temporal Service runs your code." The Worker is what actually runs your code and touches your data. Your process code runs on your infrastructure; the Service only schedules and records.

## It recovers by replay, not by snapshot

This is the key to every constraint that follows, and Temporal's docs say it better than any paraphrase:

> When it's time to continue the Workflow, Temporal doesn't restore memory from a snapshot. It starts the Workflow code from the beginning, replays the Event History step by step, and uses that history to guide the code back to the exact state as before.
>
> — [Temporal Workflow documentation](https://docs.temporal.io/workflows)

So when a worker dies and restarts, your workflow function **runs again from line one**. When it reaches "execute activity X," the platform doesn't hit that API again — it feeds back the result recorded in the Event History. The point where the history runs out is where execution genuinely continues.

Two practical wins fall out of this: a complete audit trail (every step, every retry, and who triggered it, all in the history), and the ability to pull production history down and replay it locally to debug. The price is the next section.

The history isn't unlimited. The [Event History docs](https://docs.temporal.io/workflow-execution/event) give hard ceilings: warnings start after 10,240 events, and a Workflow Execution is **terminated** when the history exceeds 51,200 events, 2,000 Updates, or 10,000 Signals. Long-lived processes need Continue-As-New to periodically close the current execution and start a fresh one.

## What the determinism constraint actually means

"Workflow code must be deterministic" is too abstract to act on. What you actually need to remember is: **anything that could return a different answer on a re-run cannot be written directly in the Workflow.**

Patterns that break, and their replacements:

| Don't write this in a Workflow | Write this instead |
|---|---|
| `datetime.now()` / `Date.now()` | `workflow.now()` — time comes from the Workflow context and matches the recorded history |
| `random.random()` / `uuid.uuid4()` | `workflow.random().random()` / `workflow.uuid4()` — the PRNG seed lives in the history |
| `requests.get(...)`, database queries, LLM calls | Wrap in an Activity and call `workflow.execute_activity()` |
| `time.sleep(60)` | `await asyncio.sleep(60)` — the Python SDK turns it into a Temporal Timer that doesn't wait again on replay |
| Branching on env vars or global mutable state | Pass it in as a Workflow parameter, or wrap it in an Activity |

There's a sneakier category: **changing Workflow code that's already running**. Temporal's [determinism documentation](https://docs.temporal.io/workflow-definition) lists the calls that produce Commands, and these **cannot be reordered, added, or removed**: starting or cancelling a Timer, scheduling or cancelling Activities, starting or cancelling Child Workflows, signalling external Workflows, Nexus operations, and ending the Workflow itself.

Take the doc's own example. A process that sleeps and then runs an Activity is currently waiting on its timer, and you edit the code to run the Activity first and sleep second. When the timer fires and the Workflow replays, the first Command is `ScheduleActivityTask`, which doesn't match the `TimerStarted` event in the history. The execution fails with a non-determinism error.

Some changes are explicitly safe: changing a Timer's duration (except to or from 0 in Java, Python, and Go), changing Activity Options or Child Workflow Options, changing the arguments to an external Signal, and adding a handler for a Signal Type this execution has never received. For genuinely breaking changes you need Worker Versioning or patching — and note that the pre-2025 experimental Worker Versioning is being removed from the Server in March 2026.

**What to do**: the Python SDK ships a safety net. By default it runs Workflow code in a sandbox that isolates global state with `exec` and wraps modules in proxy objects to block known non-deterministic standard-library calls; trip it and you get an exception, the Worker task fails, and the Workflow stops making progress until the code is fixed.

Tonight's concrete action: wrap the third-party imports in your Workflow file in `with workflow.unsafe.imports_passed_through():`, then run an existing Workflow and see what the sandbox flags. Don't mistake it for a guarantee, though: the docs are candid that the sandbox "is not completely isolated, and some libraries can internally mutate state."

## LLMs are non-deterministic by nature, so where do agents go?

The answer is already written into the constraint. Temporal's determinism section names it directly:

> Workflow code must be deterministic to support replay. To handle non-deterministic operations like API calls, LLM/AI invocations, database queries, and other external interactions, put them in Activities.
>
> — [Temporal Workflow Definition documentation](https://docs.temporal.io/workflow-definition)

The dividing line: **the agent's orchestration runs in the Workflow, the agent's model calls run in Activities.** How the loop turns, which tool gets picked, whether to hand off to another agent — that's deterministic control flow. The HTTP request that actually goes out is not.

You don't have to wire this up by hand. The [OpenAI Agents SDK integration](https://docs.temporal.io/develop/python/integrations/openai-agents) installs `OpenAIAgentsPlugin`, which redirects `Runner.run` so every model call becomes an Activity while the code inside your Workflow stays ordinary Agents SDK code; `ModelActivityParameters` controls how that model Activity is scheduled, with `start_to_close_timeout` defaulting to 60 seconds. The [LangGraph integration](https://docs.temporal.io/develop/python/integrations/langgraph) (Public Preview, requires `temporalio` 1.27.0 or later) makes the choice explicit instead: every node must declare `execute_in: "activity"` in its metadata or else run inline in the Workflow — and the inline ones are yours to keep deterministic.

Here's the sentence worth keeping: **Temporal doesn't make non-determinism go away, it forces you to label it.** For agents that's both a tax and a dividend — the tax is splitting every external call into an Activity, the dividend is that once you have, every LLM call comes with retries, timeouts, and a queryable history entry for free.

## The real axis: replay or snapshot

There is a genuine architectural split inside durable execution, but it isn't marked by the word "checkpoint" — **half the engines that use checkpoint vocabulary still require determinism**. The actual dividing line is: **does recovery re-run your orchestration code?**

| Engine | Recovery mechanism | Orchestration code must be deterministic? |
|---|---|---|
| [Temporal](https://docs.temporal.io/workflows) | Re-runs the Workflow from the top, replaying Event History | Yes |
| [Restate](https://docs.restate.dev/develop/python/durable-steps) | Re-runs the handler, replays the journal, skips completed steps | Yes (provides `ctx.run` / `ctx.uuid()` / `ctx.random()` / `ctx.time()`) |
| [DBOS](https://docs.dbos.dev/architecture) | Re-invokes the workflow with checkpointed inputs; each step first checks Postgres for a checkpoint | Yes (docs state the workflow function must be deterministic) |
| [Hatchet](https://docs.hatchet.run/home/durable-execution) | Replays from the last checkpoint in a durable event log | Yes (a durable task may only wait or spawn children) |
| [Trigger.dev](https://trigger.dev/docs/how-it-works) | CRIU takes a memory snapshot of the whole process and restores it mid-flight | No |
| [LangGraph](https://langchain-ai.github.io/langgraph/concepts/persistence/) | A checkpointer stores graph state snapshots; a thread resumes from its checkpoint | No |

Look at DBOS: its docs use "checkpoint" throughout, but the mechanism is "re-invoke the workflow, check each step against its checkpoint, and only actually execute the first step without one" — the same logic as Temporal's replay, with Postgres rows standing in for event history.

The one genuinely on the other side is Trigger.dev. CRIU is OS-level checkpoint/restore that captures memory, CPU registers, and open file descriptors, and restoring re-runs none of your code — which is why it needs no determinism from your tasks. That also makes "replay" mean opposite things in the two products: in Temporal it's "re-run code to rebuild state," while in [Trigger.dev's vocabulary](https://trigger.dev/docs/replaying) it's "run the same input against the latest version of the code."

What this means for agent workloads is direct. **The side with no determinism requirement has a lower barrier but no complete event history.** The side with one charges you the work of pushing LLM calls out into Activities, and pays back a trail where every step is queryable, replayable, and debuggable by time travel.

## Self-hosting versus Temporal Cloud

The Server is MIT-licensed, and `temporal server start-dev` brings up a complete Service plus Web UI from a single binary with no external dependencies. Production self-hosting means owning Persistence and Visibility storage, monitoring, and upgrades yourself. Visibility currently supports Elasticsearch v7/v8, OpenSearch 2+, MySQL 8.0.17+, PostgreSQL 12+, and SQLite 3.31+; [Cassandra Visibility support](https://docs.temporal.io/self-hosted-guide/visibility) was deprecated in Server 1.21 and removed in 1.24.

[Temporal Cloud pricing](https://temporal.io/pricing) (verified 2026-08) has four tiers; Essentials and Business are self-serve:

| Plan | From | Included Actions | Active / Retained storage | P0 response |
|---|---|---|---|---|
| Essentials | $100/mo | 1M | 1 GB / 40 GB | 1 business day |
| Business | $500/mo | 2.5M | 2.5 GB / 100 GB | 2 business hours |
| Enterprise | Contact sales | 10M | 10 GB / 400 GB | 24/7, under 30 min |
| Mission Critical | Contact sales | 10M | 10 GB / 400 GB | 24/7, under 15 min |

Overage Actions start at $50 per million and slide down to $25 as monthly volume grows (above 200M, contact sales). Storage is $0.042/GBh Active and $0.00105/GBh Retained. The plan fee is the greater of the monthly minimum and a percentage of consumption — 5% on Essentials, 10% on Business. The docs' own example: an Essentials account with $3,000 of monthly usage pays max($100, $150) = $150. New accounts get $1,000 in credits expiring after 90 days, and startups with under $30M raised can apply for $6,000 in credits.

One detail that matters to the cost model: **Actions generated during replay are not billed.** Temporal's reasoning is that replay reconstructs state on the Worker side and produces no new server-side operations. So a Workflow that crashes and replays a hundred times costs nothing extra; what costs money is each Activity start and retry, each timer, and each signal / update / query.

## When not to use Temporal

**The process is one step.** "Receive a request → run it in the background → write to the database" doesn't need durable execution. BullMQ or Celery is enough, and it's one less service to operate. Temporal itself offers a middle path here: a single action can be a Standalone Activity with no Workflow wrapper.

**The team can't absorb the determinism constraint.** It doesn't only bite while you're writing the code — it bites every time you change a process that's already live. If you deploy several times a day and your executions outlive multiple versions, what you're really buying is a versioning discipline, not just a library.

**The workload is inherently non-deterministic orchestration.** An agent loop where the model decides each next step and even the number of steps varies will turn into a tug-of-war with the sandbox. Check the real question first: once the model calls are pushed out into Activities, is the remaining control flow actually replayable? If not, a checkpoint-style engine is the more honest choice.

**You just want cron.** Scheduling alone doesn't justify a Temporal cluster.

Flip it around, though: if a process hits three of these four — multi-step, spanning external systems, expensive to get wrong, requires human input or long waits — Temporal almost always pays off, because the state table, idempotency keys, and compensation logic you'd otherwise write by hand cost far more than learning the determinism rules.

## References

- [Temporal Workflow (including how replay works)](https://docs.temporal.io/workflows)
- [Temporal Workflow Definition: deterministic constraints and versioning](https://docs.temporal.io/workflow-definition)
- [Temporal Events and Event History (including history limits)](https://docs.temporal.io/workflow-execution/event)
- [Understanding Temporal (Workflow / Activity / Worker concepts)](https://docs.temporal.io/evaluate/understanding-temporal)
- [Temporal Python SDK sandbox environment](https://docs.temporal.io/develop/python/best-practices/python-sdk-sandbox)
- [Temporal Workflow Basics - Python SDK](https://docs.temporal.io/develop/python/workflows/basics)
- [Temporal Durable AI (agent use cases and integration catalog)](https://docs.temporal.io/ai)
- [Temporal × OpenAI Agents SDK integration](https://docs.temporal.io/develop/python/integrations/openai-agents)
- [Temporal × LangGraph integration](https://docs.temporal.io/develop/python/integrations/langgraph)
- [Temporal Cloud pricing (verified 2026-08)](https://temporal.io/pricing)
- [Temporal self-hosted guide](https://docs.temporal.io/self-hosted-guide)
- [Temporal Visibility store support matrix](https://docs.temporal.io/self-hosted-guide/visibility)
- [Restate Key Concepts (journal and replay)](https://docs.restate.dev/foundations/key-concepts)
- [Restate Durable Steps - Python (`ctx.run` and deterministic helpers)](https://docs.restate.dev/develop/python/durable-steps)
- [DBOS Architecture (checkpointing and recovery)](https://docs.dbos.dev/architecture)
- [Hatchet Durable Execution](https://docs.hatchet.run/home/durable-execution)
- [Trigger.dev How it works (CRIU checkpoint-resume)](https://trigger.dev/docs/how-it-works)
- [Trigger.dev Versioning](https://trigger.dev/docs/versioning)
- [LangGraph Persistence (checkpointers and stores)](https://langchain-ai.github.io/langgraph/concepts/persistence/)
- Related on this site: [BullMQ: The Most Mature Redis-Backed Job Queue for Node.js](/posts/tech/2026-03-27-bullmq-job-queue-nodejs-en), [Celery: The Standard Distributed Task Queue for Python](/posts/tech/2026-03-27-celery-python-task-queue-en)
