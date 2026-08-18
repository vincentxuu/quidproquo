---
title: "OpenClaw Automation, Part 1: Choosing Among Six Mechanisms, and Why 'Exactly on Time' and 'Check on It' Are Different Jobs"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, automation, cron, heartbeat, webhook, background-tasks]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 24
tldr: "Cron is now called Automations (openclaw cron remains an alias), and automation spans six mechanisms. The core trade-off is one line: Automations give you exact timing and isolated execution, Heartbeat gives you full main-session context on a roughly-every-30-minutes cadence."
description: "A selection guide for OpenClaw's automation mechanisms: how Automations, Heartbeat, Background Tasks, Task Flow, Hooks, and Standing Orders divide the work, plus the scheduler's execution location, layered timeouts, and failure handling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-automation-cron-webhook)

OpenClaw now has **six** mechanisms for background work — enough to need a decision table. This article helps you pick the right one, then covers what the scheduler actually does.

(The naming changed too: **cron is now Automations**, managed with `openclaw automations`, with `openclaw cron` as an alias for the same commands.)

## How the six divide up

| What you need | Use | Why |
|---|---|---|
| Send a daily report at 9 AM sharp | **Automations** | Exact timing, isolated execution |
| Remind me in 20 minutes | **Automations** | One-shot with precise timing (`--at`) |
| Check the inbox every 30 minutes | **Heartbeat** | Batches with other checks, context-aware |
| Monitor the calendar for upcoming events | **Heartbeat** | A natural fit for periodic awareness |
| Inspect a subagent or ACP run | **Background Tasks** | The ledger tracks all detached work |
| Audit what ran and when | **Background Tasks** | `openclaw tasks list` / `audit` |
| Multi-step research then summarize | **Task Flow** | Durable orchestration with revision tracking |
| Run a script on session reset | **Hooks** | Event-driven |
| Execute code on every tool call | **Plugin hooks** | Only in-process hooks intercept tool calls |
| Always check compliance before replying | **Standing Orders** | Injected into every session |

## The trade-off that matters: Automations vs. Heartbeat

| Dimension | Automations | Heartbeat |
|---|---|---|
| Timing | **Exact** (cron expressions, one-shot) | **Approximate** (default every 30 min) |
| Session context | Fresh (isolated) or shared | **Full main-session context** |
| Task records | **Always created** | **Never created** |
| Delivery | Channel, webhook, or silent | Inline in the main session |
| Best for | Reports, reminders, background jobs | Inbox checks, calendar, notifications |

The criterion is crisp: **need precise timing or isolated execution → Automations; the work benefits from full session context and approximate timing is fine → Heartbeat.**

A few Heartbeat behaviors are worth knowing: its monitor scratch is **small prompt context**, so recurring work belongs in automation jobs rather than the scratch file; empty scratch skips as `empty-heartbeat-file`; and **scheduled heartbeats automatically defer** while the main queue or automation work is busy, another reply or embedded run for the same agent is active, or the target session has active or queued work.

It also **does not extend daily or idle session reset freshness** — consistent with what the sessions article said from the other side.

## What the scheduler actually does

**Automations run inside the Gateway process, not inside the model** — so **if the Gateway is not running, nothing fires.** Job definitions, runtime state, and run history persist in the shared SQLite state database, so restarts do not lose schedules.

**Every automation run creates a background task record.** One-shot jobs (`--at`) **auto-delete after success by default**; pass `--keep-after-run` to keep them.

### Timeouts are layered

This section explains "why is my job stuck for so long":

- `--timeout-seconds` when set
- Otherwise, **isolated/detached agent-turn jobs are bounded by the scheduler's own 60-minute watchdog**, long before the underlying agent-turn timeout (`agents.defaults.timeoutSeconds`, **default 48 hours**) would apply
- **Command jobs default to 10 minutes, script payloads to 5 minutes**

There are also **phase-specific watchdogs**: setup and startup stalls produce explicit messages ("isolated agent setup timed out before runner start", "run stalled before execution start (last phase: context-engine)"). These **cover embedded and CLI-backed providers even before an external CLI process starts**, and are **capped independently of long `timeoutSeconds` values** so cold-start, auth, and context failures surface quickly instead of after 48 hours.

### Failures must look like failures

Three designs exist to stop failure from masquerading as success:

- **Run-level agent failures count as job errors even with no reply payload**, so model and provider failures increment error counters and trigger failure notifications rather than clearing the job green
- **Structured execution-denial metadata is recognized** (including node-host `UNAVAILABLE` wrappers whose nested error starts with `SYSTEM_RUN_DENIED` or `INVALID_REQUEST`), so a blocked command is not reported as a green run — while ordinary assistant prose is not mistaken for a denial
- **Stale acknowledgement replies are guarded against**: if the first result is only an interim status update ("on it", "pulling everything together") and no descendant subagent is still responsible for the final answer, OpenClaw **re-prompts once for the actual result** before delivery

The third is especially practical — it addresses the very common trap of a model replying "sure, I'll do that" and being counted as done.

### Cleanup after a timeout

When a job hits `timeoutSeconds`, the scheduler aborts and allows a short cleanup window. **If it does not drain, Gateway-owned cleanup force-clears that run's session ownership** before recording the timeout — so queued chat work is not stuck behind a stale processing session.

## Schedule types and time zones

| Kind | Flag | Description |
|---|---|---|
| `at` | `--at` | One-shot timestamp (ISO 8601 or relative like `20m`) |
| `every` | `--every` | Fixed interval |
| `cron` | `--cron` | 5- or 6-field cron expression, optionally with `--tz` |
| `on-exit` | `--on-exit` | Fires once when a watched command exits (**survives turn teardown**) |
| `stream` | `--stream-command` | Fires from batched lines produced by a supervised long-lived command |

**Timestamps without a timezone are treated as UTC.** Cron expressions without `--tz` use the Gateway host timezone. `--tz` is **not** valid with `--every` or `--on-exit`.

A thoughtful detail: **recurring top-of-hour expressions (minute `0` with a wildcard hour) are automatically staggered by up to 5 minutes** to reduce load spikes. Use `--exact` for precise timing or `--stagger 30s` for an explicit window (cron schedules only).

Startup behavior is considered too: **on Gateway startup, overdue isolated agent-turn jobs are rescheduled rather than replayed immediately**, keeping model and tool bootstrap work out of the channel-connect window.

## Driving it from an external scheduler

If you drive `openclaw agent` from system cron or another scheduler, the docs recommend **wrapping it with a hard-kill escalation** even though the CLI handles `SIGTERM`/`SIGINT`:

```bash
timeout -k 60 600 openclaw agent ...
```

The `-k` value is the backstop when the process cannot drain in time. For systemd units, use a `SIGTERM` stop signal with a `TimeoutStopSec` grace window.

Also: **reusing a `--run-id` while the original Gateway run is still active reports the duplicate as in-flight** rather than starting a second run.

## The big picture

Choosing here answers two questions: **how precise does the timing need to be** (exact → Automations, approximate → Heartbeat) and **do you need context** (isolated → Automations, full main session → Heartbeat).

What is most admirable about the scheduler itself is its care with **failure semantics**: layered timeouts surface cold-start problems quickly instead of after 48 hours, denied commands are not counted green, and "I'm on it" is not counted as done. All concrete implementations of "make failure look like failure."

Standing Orders are next — they answer a different question: **what the agent is authorized to do.**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Cron is now Automations** (`openclaw cron` as alias), and automation expanded to six mechanisms (Automations, Heartbeat, Background Tasks, Task Flow, Hooks, Standing Orders) with the full decision table and the Automations/Heartbeat comparison. Added the scheduler's actual behavior: **running inside the Gateway process so nothing fires when it is down**, SQLite-persisted state, a task record per run, **layered timeouts** (the scheduler's 60-minute watchdog, 10-minute commands, 5-minute scripts, a 48-hour underlying default) and phase-specific watchdogs, **the three "failure must look like failure" designs**, forced session-ownership clearing after a timeout, the `on-exit` and `stream` schedule kinds, up-to-5-minute staggering with `--exact`/`--stagger`, rescheduling of overdue jobs at startup, and the hard-kill recommendation plus `--run-id` reuse behavior for external schedulers.

## References

This article draws on the following official OpenClaw documentation:

- [Automation](https://docs.openclaw.ai/automation/) — the six-mechanism decision guide
- [Automations](https://docs.openclaw.ai/automation/cron-jobs) — the scheduler, schedule kinds, failure handling
- [Background Tasks](https://docs.openclaw.ai/automation/tasks) — the ledger for detached work
- [Task Flow](https://docs.openclaw.ai/automation/taskflow) — multi-step flow orchestration
- [Heartbeat](https://docs.openclaw.ai/gateway/heartbeat) — periodic main-session turns
