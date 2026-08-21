---
title: "Trigger.dev: Durable Tasks via Process Snapshots, No Determinism Required"
date: 2026-08-21
category: tech
type: deep-dive
tags: [trigger-dev, durable-execution, criu, ai-agent, background-jobs, typescript]
lang: en
tldr: "Trigger.dev is an Apache 2.0 durable task platform (v4.5.12, checked 2026-08) that uses CRIU to snapshot entire Node.js processes for pause and resume. Unlike Temporal's replay model, it never re-executes your orchestration code and imposes no determinism constraint — LLM calls go directly in the task. The tradeoff: snapshots can't preserve TCP connections (you reconnect manually), and checkpointing is cloud-only — self-hosted deployments don't get it."
description: "How Trigger.dev's CRIU checkpoint-resume model works: the difference from Temporal's replay, what CRIU can and cannot snapshot, how snapshots interact with version deployments, why AI agent workloads fit this model, and the cost structure from Free to Pro (prices checked 2026-08)."
series:
  name: "Technology Choices in the AI Era"
  order: 18
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-21-trigger-dev-durable-tasks)

This site already has a dedicated piece on [Temporal](/posts/tech/2026-08-21-temporal-durable-execution-en), covering the replay model of durable execution — when a worker crashes, it re-executes the workflow code from the top, using the event history to skip completed steps. That article left an axis open: **does recovery re-execute your orchestration code?** [Trigger.dev](https://trigger.dev/docs/introduction) sits on the other side. It uses [CRIU](https://criu.org/Main_Page) (Checkpoint/Restore In Userspace) to snapshot the entire Node.js process, then restores it at the exact point of interruption without re-executing a single line of your code.

Versions checked 2026-08: [`@trigger.dev/sdk` 4.5.12](https://www.npmjs.com/package/@trigger.dev/sdk) (published 2026-08-20), [GitHub repo](https://github.com/triggerdotdev/trigger.dev) Apache 2.0 license, 16,000+ stars. Primary language support is TypeScript / Node.js; Python is available via the `pythonExtension`.

## Recap: Why the Replay Model Creates Friction for LLM Workloads

The core constraint of the [Temporal article](/posts/tech/2026-08-21-temporal-durable-execution-en): workflow code must be deterministic, because after a crash the worker replays it from line one, injecting recorded results from the event history at each activity call. Anything that might return a different answer on replay — `datetime.now()`, `random()`, HTTP requests, LLM calls — must be wrapped in an activity.

For AI agents, this means every model call becomes a separate activity, and the orchestration loop itself must be replayable. If the agent's logic is "each turn the model decides the next step" with a variable number of steps, forcing that control flow into a deterministic workflow becomes a fight against the sandbox.

Trigger.dev's answer: don't replay, just restore the memory.

## What CRIU Does

[CRIU](https://criu.org/Main_Page) (pronounced kree-oo) is a Linux userspace tool that freezes a running process, writes its complete state to disk, and later restores it on the same or a different machine. "Complete state" includes:

- Memory pages (heap, stack, mmap regions)
- CPU registers
- Open file descriptors
- Pipes
- Signal handlers
- Process tree structure

CRIU operates at the Linux kernel level, using `ptrace` to freeze processes, reading state from `/proc`, and injecting parasite code to extract process internals. It is the underlying mechanism behind Docker checkpoint and Kubernetes CRIU integration.

### What CRIU Cannot Snapshot

This is the most critical part. Per [CRIU's documentation](https://criu.org/What_cannot_be_checkpointed), the following cannot be checkpointed:

| Cannot snapshot | Reason |
|---|---|
| Socket types other than TCP / UDP / UNIX | Only TCP, UDP, UNIX domain, packet, and netlink are supported |
| Established TCP connections (need special handling) | The remote end doesn't know you disconnected; connection state becomes inconsistent |
| Character and block devices | Point to hardware; virtual devices (`/dev/null`, `/dev/zero`, TUN) are exceptions |
| Open files from unmounted filesystems | The filesystem path no longer exists, so references can't be rebuilt |
| Processes with a debugger attached | CRIU itself uses `ptrace`, and the API doesn't allow multiple debuggers |
| Pipes opened with `O_DIRECT` | Packetized pipe state can't be captured |
| File descriptors in transit over UNIX sockets | Can't track fds being passed between processes |
| UDP sockets with cork option | Application-layer buffer state can't be restored |

For Trigger.dev users, the most important item is **TCP connections**. Database connections, HTTP keep-alive, WebSockets — all of these break at snapshot time. After restore, your code thinks the connection is alive, but the remote end closed it long ago.

### How Trigger.dev Handles This

Trigger.dev provides `onWait` and `onResume` [lifecycle hooks](https://trigger.dev/docs/tasks/overview). `onWait` runs before the snapshot — you disconnect here. `onResume` runs after restore — you reconnect here. The official docs show a Prisma example: call `$disconnect()` in `onWait`, reinitialize the client in `onResume`.

This is not automatic. **You must manage every connection that spans a checkpoint yourself.** Miss one, and after restore you get a connection that looks alive but silently fails on writes.

## When Snapshots Are Triggered

Not every line of code triggers a checkpoint. Trigger.dev snapshots at these points:

1. **`triggerAndWait()`**: Call a child task and wait for its result. The parent is snapshotted, resources released; it restores when the child completes.
2. **`wait.for()` / `wait.until()`**: Pause for a duration or until a specific time. **Waits longer than 60 seconds trigger a real snapshot**; waits under 60 seconds keep the process in memory without snapshotting, and the concurrency slot is not released.
3. **`wait.forToken()`**: Wait for an external event (human approval, webhook callback). The process is snapshotted until the token completes.

After snapshotting, the [Trigger.dev docs](https://trigger.dev/docs/how-it-works) state that the checkpoint is "efficiently compressed and stored on disk," and the process's compute resources are released. When the condition is met (child completes, timer fires, token completes), the checkpoint is restored to a new execution environment and resumes from where it left off.

On Trigger.dev Cloud, **wait time is not billed**. You pay only for CPU time when code is actually executing.

## Version Deployment: Snapshots Are Locked to a Version

Trigger.dev uses [atomic version numbers](https://trigger.dev/docs/versioning) in the format `YYYYMMDD.N` (e.g. `20260821.1`). When a run starts, it locks to the current latest version. Even if you deploy a new version while it's waiting, **the restored run still uses the old version's code**.

This differs from the versioning problem Temporal faces. Temporal replays code, so changing an in-flight workflow's code causes a non-determinism error. Trigger.dev's snapshot contains the code itself (the entire process image), so version conflicts don't happen — but you also don't get new bug fixes until you replay.

Child task version locking rules:

| Trigger method | Which version the child uses |
|---|---|
| `trigger()` / `batchTrigger()` | Latest version (unlocked) |
| `triggerAndWait()` / `batchTriggerAndWait()` | Inherits parent's version (locked) |

Failed retries use the original version; replays use the latest version with the original input. Note that "replay" here means the opposite of Temporal's "replay": Temporal's replay is an internal state-reconstruction mechanism, while Trigger.dev's [replay](https://trigger.dev/docs/replaying) means "run the latest code with the same input again" — used to verify bug fixes.

## What This Means for AI Agent Workloads

Back to the opening question. If your agent flow looks like:

```
Call LLM → decide next step based on response → maybe call LLM again → wait for human approval → hit a third-party API → write back to database
```

In Temporal, every LLM call must be wrapped in an activity, and the orchestration loop must be replayable. In Trigger.dev, you write a regular async function:

```typescript
export const agentTask = task({
  id: "agent-loop",
  run: async (payload) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: payload.messages,
    });

    if (response.choices[0].message.content.includes("need_approval")) {
      const approval = await wait.forToken<{ approved: boolean }>({
        id: "human-review",
        timeout: "7d",
      });
      if (!approval.ok || !approval.output.approved) return;
    }

    // Continue processing...
  },
});
```

`wait.forToken()` triggers a snapshot. During the wait, no compute resources are used and nothing is billed. When the human approves, the process restores and continues from the `wait.forToken()` line. No need to extract LLM calls into activities, no need to ensure the control flow is replayable.

**This is the most direct benefit of the checkpoint model for AI workloads: LLM calls are inherently non-deterministic, but you don't need to care.**

The tradeoff is in two places. First, you **don't get** Temporal's full event history. Temporal's Event History records every activity's input, output, retry count, and duration — you can take production history and replay it locally for debugging. Trigger.dev has run logs and a dashboard, but no step-by-step replayable history.

Second, the snapshot contains the process's memory state at that moment. If your task accumulates large intermediate data in memory (e.g. a growing conversation history array), the snapshot grows accordingly. Trigger.dev's machine specs range from 0.25 GB (micro) to 16 GB (large-2x) — snapshot size is bounded by available memory, though the docs don't give an explicit ceiling.

## Self-Hosted vs Cloud: Checkpointing Is Cloud-Only

This must be stated clearly. Per Trigger.dev's [self-hosting docs](https://trigger.dev/docs/open-source-self-hosting), self-hosted deployments **do not have checkpoint functionality**. They also lack warm starts and auto-scaling.

In other words, if you self-host Trigger.dev, you get a background task platform with queues, retries, scheduling, and a dashboard — the same tier as [BullMQ](/posts/tech/2026-03-27-bullmq-job-queue-nodejs-en) or [Celery](/posts/tech/2026-03-27-celery-python-task-queue-en), but with native TypeScript support and a better UI. The checkpoint-resume capability that actually separates Trigger.dev from queue-based tools is cloud-only.

The self-hosted architecture uses two containers: Webapp (dashboard + Redis + Postgres) and Worker (supervisor + runner). v4.5.0 is the last version supporting v3 tasks; 4.5.1+ only runs v4 tasks.

## Cost Structure

[Trigger.dev's pricing](https://trigger.dev/pricing) (checked 2026-08) has four tiers:

| Plan | Monthly | Included credits | Concurrency limit | Schedules | Log retention |
|---|---|---|---|---|---|
| Free | $0 | $5 | 20 | 10 | 1 day |
| Hobby | $10 | $10 | 50 | 100 | 7 days |
| Pro | $50 | $50 | 200+ | 1,000+ | 30 days |
| Enterprise | Custom | Custom | Custom | Custom | Custom |

Compute is billed per second: the smallest spec, micro (0.25 vCPU / 0.25 GB), costs $0.0000169/sec; the largest, large-2x (8 vCPU / 16 GB), costs $0.0006800/sec. Each run invocation has an additional $0.000025 charge ($0.25 per 10,000 runs).

Compared to Temporal Cloud: Temporal starts at $100/month (Essentials), billing by Actions (activity starts, timers, signals — server-side operations), and replays are free. Trigger.dev starts at $0, billing by CPU seconds, and wait time is free. Both make "you don't pay when your code isn't running" their selling point, just cutting at different places.

An important cost distinction: Temporal's replays are free because they only reconstruct state on the worker side, producing no server-side operations. Trigger.dev's waits are free because the process has been snapshotted and the CPU released. But Trigger.dev's snapshot and restore operations themselves require I/O (compression, storage, transfer, decompression), and that cost is included in compute time.

## When to Choose Trigger.dev vs Temporal

| Consideration | Choose Trigger.dev | Choose Temporal |
|---|---|---|
| Workflow has many LLM calls | No activity wrapping needed, just write them | Every call must be wrapped in an activity |
| Need step-by-step replayable event history | No (has run logs, but not replayable) | Full Event History available |
| Team language | Primarily TypeScript (Python via extension) | .NET / Go / Java / PHP / Python / Ruby / TypeScript — seven SDKs |
| Self-hosting requirement | Self-hosted has no checkpoint — becomes a regular queue | Self-hosted has full functionality (MIT, single binary to run) |
| Workflow needs to wait for months | Snapshot on disk, waiting costs no CPU | Event History has a 51,200 event ceiling; long workflows need Continue-As-New |
| Need to audit every step's input/output | Dashboard has logs, but not structured per-step history | Event History is a complete audit trail |
| Budget | Free plan includes checkpointing | Cloud starts at $100/month |

One final heuristic: **is your code inherently non-deterministic?** If your agent loop has the model deciding the next step each turn with a variable number of steps, Trigger.dev lets you skip redesigning your entire control flow for determinism constraints. If your workflow has fixed steps and needs strict traceability between them, Temporal's event history is something Trigger.dev can't offer.

The boundary with [BullMQ](/posts/tech/2026-03-27-bullmq-job-queue-nodejs-en) and [Celery](/posts/tech/2026-03-27-celery-python-task-queue-en) is simpler: if the flow is a single step (receive message → do work → write back), a queue is enough. When you start having "step three failed but step two already sent" problems, that's when you need durable execution.

## References

- [Trigger.dev Documentation Home](https://trigger.dev/docs/introduction)
- [Trigger.dev How it works (CRIU checkpoint-resume mechanism)](https://trigger.dev/docs/how-it-works)
- [Trigger.dev Task Overview (lifecycle hooks: onWait / onResume)](https://trigger.dev/docs/tasks/overview)
- [Trigger.dev Wait functions](https://trigger.dev/docs/wait)
- [Trigger.dev Waitpoint Tokens (human approval and external event waits)](https://trigger.dev/docs/wait-for-token)
- [Trigger.dev Versioning (atomic version numbers and version locking)](https://trigger.dev/docs/versioning)
- [Trigger.dev Replaying (re-run with latest version)](https://trigger.dev/docs/replaying)
- [Trigger.dev Machine Configuration](https://trigger.dev/docs/machines)
- [Trigger.dev Error Handling & Retrying](https://trigger.dev/docs/errors-retrying)
- [Trigger.dev Self-hosting](https://trigger.dev/docs/open-source-self-hosting)
- [Trigger.dev Pricing (checked 2026-08)](https://trigger.dev/pricing)
- [Trigger.dev Config File](https://trigger.dev/docs/config/config-file)
- [Trigger.dev AI Agent Patterns](https://trigger.dev/docs/guides/ai-agents)
- [`@trigger.dev/sdk` on NPM (v4.5.12)](https://www.npmjs.com/package/@trigger.dev/sdk)
- [Trigger.dev GitHub repo (Apache 2.0)](https://github.com/triggerdotdev/trigger.dev)
- [CRIU Official Website](https://criu.org/Main_Page)
- [CRIU: What cannot be checkpointed](https://criu.org/What_cannot_be_checkpointed)
- Related on this site: [Temporal: Write Workflows as Code, Keep Running Through Crashes](/posts/tech/2026-08-21-temporal-durable-execution-en)
- Related on this site: [BullMQ: The Most Mature Redis-backed Job Queue for Node.js](/posts/tech/2026-03-27-bullmq-job-queue-nodejs-en)
- Related on this site: [Celery: The Standard Distributed Task Queue for Python](/posts/tech/2026-03-27-celery-python-task-queue-en)
