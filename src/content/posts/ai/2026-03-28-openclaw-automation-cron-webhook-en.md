---
title: "OpenClaw Automation, Part 1: Choosing a Mechanism, and What Changed When Heartbeat Became a Scheduled Job"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, automation, cron, heartbeat, webhook]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 24
tldr: "Cron is now Automations (openclaw cron remains an alias), and periodic checks have folded into it: Heartbeat is no longer a separate mechanism. openclaw doctor --fix converts old settings into ordinary jobs, and new setups get a Proactive check (disabled by default; once enabled it runs every 30 minutes in the main conversation when idle). Background Tasks and Task Flow are gone; multi-step flows use the Lobster plugin. Picking a mechanism now comes down to whether it is triggered by time, by an event, or is a rule to follow every time."
description: "A selection guide for OpenClaw's automation mechanisms: how Automations, Hooks, Webhooks, the IMAP trigger, Standing Orders and Lobster divide the work, how monitoring works after Heartbeat migrated into scheduled jobs, plus the scheduler's execution location, layered timeouts and failure handling."
draft: false
---

> :globe: [中文版](/posts/ai/2026-03-28-openclaw-automation-cron-webhook)

OpenClaw consolidated its background-work mechanisms in the second half of 2026. This article helps you pick the right one, then covers how periodic checks work now that they are ordinary scheduled jobs, and finally what the scheduler actually does.

(The naming changed too: **cron is now Automations**, managed with `openclaw automations`, with `openclaw cron` as an alias for the same commands.)

## How the mechanisms divide up

Following the [official decision table](https://docs.openclaw.ai/automation):

| What you need | Use | Why |
|---|---|---|
| Send a daily report at 9 AM sharp | **Automations** | Exact timing, isolated execution |
| Remind me in 20 minutes | **Automations** | One-shot with precise timing (`--at`) |
| Check the inbox every 30 minutes | **Automations** | Its own recurring schedule and run history |
| Monitor the calendar for upcoming events | **Automations** | Explicit cadence and delivery policy |
| Surface changes in the main conversation | **Automations** | Editable monitoring jobs that stay quiet when nothing changed |
| Trigger safely on new email | **IMAP plugin** | Sender-gated, one isolated reader session per message |
| Trigger the agent from an external service | **Webhooks** | Authenticated HTTP ingress |
| Run a script on session reset | **Hooks** | Event-driven `HOOK.md` scripts |
| Execute code on every tool call | **Plugin hooks** | Only in-process hooks intercept tool calls |
| Always check compliance before replying | **Standing Orders** | Injected into every session |
| Multi-step flows with approval stops | **Lobster** | Optional plugin that halts at checkpoints and resumes with a token |

Compared with the older lineup, three things are gone:

- **Heartbeat** is no longer a separate mechanism; periodic checks are ordinary automation jobs (next section).
- The **Background Tasks** ledger was removed; check an automation's own run history instead (`openclaw automations runs <job-id>`).
- **Task Flow** was removed too; multi-step flows that need approvals use the [Lobster](https://docs.openclaw.ai/automation/taskflow) plugin.

So choosing a mechanism comes down to one question: is it triggered by **time** (Automations), by an **event** (Hooks, Webhooks, IMAP), or is it a **rule to follow every time** (Standing Orders)?

## After Heartbeat became an ordinary scheduled job

The old trade-off was "Automations are exact but isolated; Heartbeat is approximate but has main-session context." Both capabilities now live in automation jobs. The [heartbeat migration docs](https://docs.openclaw.ai/gateway/heartbeat) describe the change:

- **Old configuration must be migrated**: run `openclaw doctor --fix`. It converts existing heartbeat monitors into editable automation jobs, keeping their IDs, run history, scratch and schedule anchors, and imports supported `HEARTBEAT.md` content. Only after the new jobs are verified does it remove settings such as `agents.defaults.heartbeat`; `HEARTBEAT.md` is no longer read.
- **New setups get one Proactive check, disabled by default**: once you turn it on with `openclaw automations enable <job-id>`, it runs every 30 minutes, run in the agent's main conversation, waiting for idle, delivered to the owner's DM. It is provisioned once; delete it and it stays deleted.
- **Quiet when nothing needs attention**: a check with nothing to report returns `NO_REPLY`, sends no message, and needs no extra model request.

To keep the old "check on it while you're there" behavior on a scheduled job, use [these per-job settings](https://docs.openclaw.ai/automation/cron-jobs/schedules):

| Setting | Effect |
|---|---|
| `activeHours` | Runs only inside a window, e.g. 08:00–22:00, timezone-aware |
| `idleOnly` | Waits until the whole agent is quiet, including other jobs and foreground conversations |
| `payload.skipIfScratchEmpty` | Skips when scratch is explicitly empty; missing scratch still runs |
| `delivery.target: "owner"` | Delivers to the owner's DM rather than following a group conversation |

The session is a per-job choice too: a named session shares that conversation's context, while `isolated` starts each run fresh.

Two things to watch when migrating:

- Doctor notes on completion that heartbeat-specific duplicate suppression and no-route skipping were removed, so repeated updates can now be delivered. If you relied on either, revisit the delivery settings.
- `idleOnly` looks at the whole agent. On a busy shared agent, a check can keep getting deferred.

Scratch is a small piece of private context attached to a job, good for a short checklist. It goes into the model prompt, so keep secrets out of it. It is also not a scheduler: give each recurring task its own automation job instead of a `tasks:` block in scratch.

Two newer patterns:

- **Dynamic cadence**: set `pacing.min`/`pacing.max`, and during a run the agent can propose when to check next; OpenClaw clamps it to the bounds.
- **`/loop`**: type `/loop 5m <task>` in chat to create a recurring job bound to that conversation; omit the interval and it self-paces between 1 minute and 1 hour.

v2026.8.1 also removed the experiment that inferred follow-ups from conversations and delivered them through heartbeat. For reminders, create an explicit automation.

## What the scheduler actually does

**Automations run inside the Gateway process, not inside the model** — so **if the Gateway is not running, nothing fires.** Job definitions, runtime state, and run history persist in the shared SQLite state database, so restarts do not lose schedules.

**Runs are recorded in the automation's own run history.** One-shot jobs (`--at`) **auto-delete after success by default**; pass `--keep-after-run` to keep them. If required delivery fails or its outcome is unknown, the job is kept disabled for inspection rather than replayed.

**Up to eight jobs run at once**; when all eight are busy and more are due, one more starts as long as at least 1 GiB of memory is free, up to 16.

### Timeouts are layered

This section explains "why is my job stuck for so long":

- `--timeout-seconds` when set
- Otherwise, **isolated/detached agent-turn jobs are bounded by the scheduler's own 60-minute watchdog**. That deadline is separate from the per-model-attempt budget (`agents.defaults.timeoutSeconds`, **default 48 hours**), and starting a fallback model doesn't reset it
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
| `cron` | `--cron` | 5- or 6-field cron expression, optionally with `--tz`; when both day-of-month and day-of-week are set, they combine with OR, not AND |
| `on-exit` | `--on-exit` | Fires once when a watched command exits (**survives turn teardown**) |
| `stream` | `--stream-command` | Fires from batched lines produced by a supervised long-lived command |

**Timestamps without a timezone are treated as UTC.** Cron expressions without `--tz` use the Gateway host timezone. `--tz` is **not** valid with `--every` or `--on-exit`.

A thoughtful detail: **recurring top-of-hour expressions (minute `0` with a wildcard hour) are automatically staggered by up to 5 minutes** to reduce load spikes. Use `--exact` for precise timing or `--stagger 30s` for an explicit window (cron schedules only).

Startup behavior is considered too: **on Gateway startup, overdue jobs that need agent execution are rescheduled rather than replayed immediately**, including migrated monitors, keeping model and tool startup work out of scheduler startup.

`every`, `cron` and `stream` schedules can also carry a **condition script** (`--trigger-script`): the agent runs only when the script returns `fire: true`, so quiet checks skip the model call. Each evaluation gets up to 30 seconds and 5 tool calls, with a 30-second minimum interval. These scripts run unattended with the owning agent's full tool policy by default; set `cron.triggers.enabled: false` to turn them all off.

## Driving it from an external scheduler

If you drive `openclaw agent` from system cron or another scheduler, the docs recommend **wrapping it with a hard-kill escalation** even though the CLI handles `SIGTERM`/`SIGINT`:

```bash
timeout -k 60 600 openclaw agent ...
```

The `-k` value is the backstop when the process cannot drain in time. For systemd units, use a `SIGTERM` stop signal with a `TimeoutStopSec` grace window.

Also: **reusing a `--run-id` while the original Gateway run is still active reports the duplicate as in-flight** rather than starting a second run.

## The big picture

Choosing here now answers one question: **is it triggered by time, by an event, or is it a rule to follow every time?** "How exact" and "whether it needs main-conversation context" are no longer the difference between two mechanisms; they are settings on the same automation job (`--exact`, `idleOnly`, the session target).

What is most admirable about the scheduler itself is its care with **failure semantics**: layered timeouts surface cold-start problems quickly instead of after 48 hours, denied commands are not counted green, and "I'm on it" is not counted as done. All concrete implementations of "make failure look like failure."

Standing Orders are next — they answer a different question: **what the agent is authorized to do.**

## Changelog

- 2026-11-23: Corrected the Proactive check description: new setups create the job but leave it disabled, and you turn it on with `openclaw automations enable` (previously described as running every 30 minutes on new installs).
- 2026-11-20: Rewrote the first two sections against the current docs. Heartbeat has migrated into ordinary automation jobs (`openclaw doctor --fix`, a Proactive check provisioned on new setups, `NO_REPLY`); Background Tasks and Task Flow were removed (use automation run history; multi-step flows move to the Lobster plugin); the mechanism table now follows the current official one (adding the IMAP trigger and Webhooks). Added monitoring policies (`activeHours`, `idleOnly`, `skipIfScratchEmpty`, owner delivery), dynamic cadence and `/loop`, condition scripts and the concurrency limit; corrected "every run creates a background task record" and the 48-hour budget, and noted the removal of inferred follow-ups in v2026.8.1.
- 2026-08-18: Substantially revised against the current official docs. **Cron is now Automations** (`openclaw cron` as alias), and automation expanded to six mechanisms (Automations, Heartbeat, Background Tasks, Task Flow, Hooks, Standing Orders) with the full decision table and the Automations/Heartbeat comparison. Added the scheduler's actual behavior: **running inside the Gateway process so nothing fires when it is down**, SQLite-persisted state, a task record per run, **layered timeouts** (the scheduler's 60-minute watchdog, 10-minute commands, 5-minute scripts, a 48-hour underlying default) and phase-specific watchdogs, **the three "failure must look like failure" designs**, forced session-ownership clearing after a timeout, the `on-exit` and `stream` schedule kinds, up-to-5-minute staggering with `--exact`/`--stagger`, rescheduling of overdue jobs at startup, and the hard-kill recommendation plus `--run-id` reuse behavior for external schedulers.

## References

This article draws on the following official OpenClaw documentation:

- [Automation](https://docs.openclaw.ai/automation) — the mechanism decision table
- [Automations](https://docs.openclaw.ai/automation/cron-jobs) — scheduler overview
- [How automations work](https://docs.openclaw.ai/automation/cron-jobs/how-it-works) — runtime model, timeouts, failure handling
- [Automation schedules](https://docs.openclaw.ai/automation/cron-jobs/schedules) — schedule kinds, monitoring policies, pacing, condition triggers
- [Heartbeat migration](https://docs.openclaw.ai/gateway/heartbeat) — moving periodic monitoring into scheduled jobs
- [Lobster](https://docs.openclaw.ai/automation/taskflow) — the multi-step, approval-gated workflow plugin
