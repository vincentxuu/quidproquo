---
title: "OpenClaw Automation, Part 2: Standing Orders Are the Authorization, Automations Are the Clock"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, standing-orders, automation, agents-md, escalation, autonomy]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 25
tldr: "Standing orders grant an agent permanent operating authority for a defined program, written into AGENTS.md and injected into every session. They define what it may do; automations define when — and the automation prompt should reference the standing order rather than duplicate it."
description: "Standing orders in OpenClaw: the four required fields (scope, triggers, approval gates, escalation), how they divide labor with automations, which files bootstrap auto-injects, and the execute-verify-report discipline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-automation-standing-orders)

The previous article covered **when** work runs. This one covers **what the agent is authorized to do.**

Standing orders grant your agent **permanent operating authority** for defined programs. Instead of prompting per task, you define scope, triggers, and escalation rules, and the agent executes autonomously within those boundaries:

> "You own the weekly report. Compile it every Friday, send it, and only escalate if something looks wrong."

## Why they exist

The contrast upstream is blunt:

**Without standing orders**: you prompt for every task, routine work gets forgotten or delayed, and **you become the bottleneck.**

**With standing orders**: the agent executes autonomously within defined boundaries, routine work happens on schedule, and you are involved only for exceptions and approvals.

## Where to write them: what bootstrap injects

Standing orders live in the agent workspace files. **The recommendation is to put them directly in `AGENTS.md`**, which is auto-injected every session. For larger configurations, use a dedicated file like `standing-orders.md` and reference it from `AGENTS.md`.

Here is the list to memorize — **workspace bootstrap auto-injects `AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `USER.md`, `BOOTSTRAP.md`, and `MEMORY.md`** — **but not arbitrary files in subdirectories.**

So "I wrote it in `docs/policies/rules.md`" does nothing unless something references it.

Conversely, when you want a run **not governed by standing orders** — CI or scripting — use `openclaw agent exec`: it **skips workspace bootstrap files**, so each one-shot run is self-contained.

## The four fields of a standing order

Each program specifies four things:

1. **Scope** — what the agent is authorized to do
2. **Triggers** — when to execute (schedule, event, or condition)
3. **Approval gates** — what requires human sign-off before acting
4. **Escalation rules** — when to stop and ask for help

The skeleton:

```markdown
## Program: Weekly Status Report

**Authority:** Compile data, generate report, deliver to stakeholders
**Trigger:** Every Friday at 4 PM (enforced via automation job)
**Approval gate:** None for standard reports. Flag anomalies for human review.
**Escalation:** If a data source is unavailable or metrics look unusual (>2σ)

### Execution steps
1. Pull metrics from configured sources
2. Compare to prior week and targets
3. Generate report in Reports/weekly/YYYY-MM-DD.md
4. Deliver summary via configured channel
5. Log completion to Agent/Logs/

### What NOT to do
- Do not send reports to external parties
- Do not modify source data
- **Do not skip delivery if metrics look bad — report accurately**
```

That last line is the most instructive in the whole example. **Writing down what not to do constrains an agent's improvisation better than only writing what to do** — especially the well-intentioned kind of improvisation.

## The division of labor: authorization vs. clock

Standing orders define **what**; [automations](/posts/ai/2026-03-28-openclaw-automation-cron-webhook) define **when**:

```text
Standing Order: "You own the daily inbox triage"
    ↓
Automation (8 AM daily): "Execute inbox triage per standing orders"
    ↓
Agent: reads standing orders → executes steps → reports results
```

**The key point is that the automation prompt should reference the standing order rather than duplicate it.** Duplication produces two sets of rules that drift apart, and eventually you cannot tell which one the agent is following.

```bash
openclaw automations add \
  --name daily-inbox-triage \
  --cron "0 8 * * 1-5" \
  --tz America/New_York \
  --timeout-seconds 300 \
  --announce \
  --channel imessage \
  --to "+1XXXXXXXXXX" \
  --message "Execute daily inbox triage per standing orders. Check mail for new alerts. Parse, categorize, and persist each item. Report summary to owner. Escalate unknowns."
```

## Three trigger shapes

The three official examples happen to demonstrate three different trigger patterns:

**A weekly cycle** (content and social) — Monday metrics review, Tuesday–Thursday drafting, Friday brief. The value is in **writing the rhythm of a week down** rather than re-deciding it daily.

Note how its approval gate is written: **"All posts require owner review for the first 30 days, then standing approval"** — a time-boxed escalation of trust, more practical than either reviewing forever or delegating fully from day one.

**Event-triggered** (financial processing) — runs when a new file is detected or on a monthly cycle. Its escalation rules are quantified:

| Condition | Action |
|---|---|
| Single item > $500 | Immediate alert |
| Category over budget by 20% | Flag in the report |
| Unrecognizable transaction | Ask the owner to categorize |
| Failed processing after 2 retries | Report the failure, **do not guess** |

That last line is another concrete "what not to do."

**Continuous monitoring** (system health) — runs every heartbeat cycle, using a response matrix that cleanly separates "handle it" from "escalate": restart services automatically but **escalate only if a restart fails twice**; alert the owner when disk drops below 10%; log and retry an offline channel, **escalating only after 2 hours**.

That matrix really answers "when may the agent interrupt you" — which is what determines whether autonomy works in practice.

## Execute, verify, report

Standing orders work best with strict execution discipline. The loop:

1. **Execute** — do the actual work, **don't just acknowledge the instruction**
2. **Verify** — confirm the result
3. **Report** — report what actually happened

The parenthetical on step one is notable: "don't just acknowledge" is the same problem the scheduler addresses from the other side (re-prompting when the first result is only an interim status). One is a rule written for the model, the other is a mechanism in the system. **You want both, because the first is advice and only the second is enforcement.**

## The big picture

What standing orders really are is **a document recording how far you trust the agent with something.** The valuable part is not "the agent does things automatically" — automations already do that — but that they **force you to spell out authorization boundaries, approval gates, and escalation thresholds.**

Two practical reminders when writing them: **put them in `AGENTS.md` or reference them from it, because bootstrap only auto-injects those six files**; and **write more "do not" lines** — the strongest lines in every official example are prohibitions.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **the six files bootstrap auto-injects** (`AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `USER.md`, `BOOTSTRAP.md`, `MEMORY.md`) and the boundary that arbitrary subdirectory files are not injected, **`openclaw agent exec` as the strict one-shot entry point that skips bootstrap**, the full four-field example, **the recommendation that automation prompts reference rather than duplicate standing orders** with the actual `openclaw automations add` command (cron having been renamed, with `openclaw cron` as alias), the three trigger shapes (including a time-boxed trust escalation and a quantified escalation matrix), and the execute-verify-report discipline alongside the scheduler-level countermeasure.

## References

This article draws on the following official OpenClaw documentation:

- [Standing orders](https://docs.openclaw.ai/automation/standing-orders) — the four fields, examples, execution discipline
- [Automations](https://docs.openclaw.ai/automation/cron-jobs) — time-based enforcement
- [Agent workspace](https://docs.openclaw.ai/concepts/agent-workspace) — the auto-injected bootstrap files
- [Agent exec](https://docs.openclaw.ai/cli/agent) — one-shot runs that skip bootstrap
- [Automation](https://docs.openclaw.ai/automation/) — how the six mechanisms divide up
