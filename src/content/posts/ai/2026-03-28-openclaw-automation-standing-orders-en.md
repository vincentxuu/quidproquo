---
title: "OpenClaw Automation (Part 2): Standing Orders — Permanent Directives"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, standing-orders, automation, agents-md, autonomous]
lang: en
tldr: "Standing Orders grant an agent permanent authorization to execute defined programs — with explicit scope, triggers, approval gates, and escalation rules, paired with Cron for time-based control."
description: "OpenClaw's Standing Orders mechanism: structured directives that grant agents permanent execution authority, combined with Cron and Heartbeat for autonomous operation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-automation-standing-orders)

Standing Orders are the closest OpenClaw gets to "letting an agent operate autonomously." Instead of issuing instructions every time, you define programs, and the agent executes automatically within its authorized scope.

## Why You Need Standing Orders

**Without Standing Orders:**
- Every task requires you to issue manual instructions
- The agent sits idle between requests
- Routine work gets forgotten or delayed
- You become the bottleneck

**With Standing Orders:**
- The agent operates autonomously within defined boundaries
- Routine work happens on schedule
- You only intervene for exceptions
- The agent makes good use of idle time

## How It Works

Standing Orders are defined in agent workspace files. The recommended approach is to write them directly in `AGENTS.md` (which is automatically injected into every session), ensuring the agent always has its directives in context.

Each Program specifies:
1. **Scope** — what the agent is authorized to do
2. **Triggers** — when to execute (scheduled, event-driven, conditional)
3. **Approval Gates** — what requires human sign-off
4. **Escalation Rules** — when to stop and ask for help

### Pairing with Cron

Standing Orders define "what to do," Cron defines "when to do it":

```
Standing Order: "You are responsible for daily inbox triage"
    ↓
Cron Job (daily at 8:00): "Execute inbox triage per standing orders"
    ↓
Agent: reads standing orders → executes steps → reports results
```

The cron job prompt should reference the standing order, not duplicate it:

```bash
openclaw cron add \
  --name daily-inbox-triage \
  --cron "0 8 * * 1-5" \
  --tz America/Taipei \
  --timeout-seconds 300 \
  --announce \
  --message "Execute daily inbox triage per standing orders."
```

## Standing Order Structure

```markdown
## Program: Weekly Status Report

**Authority:** Compile data, generate reports, deliver to stakeholders
**Trigger:** Every Friday at 4 PM (via cron job)
**Approval gate:** Standard reports need no review. Anomalous data flagged for human review.
**Escalation:** Data source unavailable, or metrics anomalous (beyond 2σ)

### Execution Steps

1. Pull metrics from configured sources
2. Compare against previous week and targets
3. Generate report to Reports/weekly/YYYY-MM-DD.md
4. Deliver summary via configured channels
5. Log completion to Agent/Logs/

### What NOT to Do

- Do not send reports to external parties
- Do not modify source data
- Do not skip the report because metrics look bad — report honestly
```

## The Execute-Verify-Report Pattern

Every task under Standing Orders should follow:

1. **Execute** — Do the actual work (not just "I'll go do it")
2. **Verify** — Confirm the result is correct (file exists, message delivered)
3. **Report** — Report what was done and what was verified

```markdown
### Execution Rules

- Every task follows Execute-Verify-Report, no exceptions
- "I'll do that" is not execution — report after completion
- "Done" without verification doesn't count — prove it
- Execution failure: adjust approach and retry once
- Still failing: report failure and diagnostics, never fail silently
- Maximum 3 retries, then escalate
```

## Practical Examples

### Example 1: Content & Social Media (Periodic)

```markdown
## Program: Content & Social Media

**Authority:** Draft content, schedule posts, compile engagement reports
**Approval gate:** All posts require owner review for the first 30 days, then standing approval
**Trigger:** Weekly cycle (Monday review → mid-week drafting → Friday briefing)

### Content Rules
- Tone must match brand guidelines (refer to SOUL.md)
- Do not self-identify as AI in public content
- Include data when available
- Focus on audience value
```

### Example 2: Financial Processing (Event-Driven)

```markdown
## Program: Financial Processing

**Authority:** Process transaction data, generate reports, send summaries
**Approval gate:** Analysis needs no review. Recommendations require owner approval.
**Trigger:** New data file detected or monthly schedule

### Escalation Rules
- Single transaction > $500: immediate alert
- Category exceeds budget by 20%: flag in report
- Unrecognized transaction: ask owner for classification
- Still failing after 2 retries: report failure, don't guess
```

### Example 3: System Monitoring (Continuous)

```markdown
## Program: System Monitoring

**Authority:** Check system health, restart services, send alerts
**Approval gate:** Auto-restart services. Escalate only after 2 failed restarts.
**Trigger:** Every heartbeat

### Response Matrix
| Condition | Action | Escalate? |
|---|---|---|
| Service down | Auto-restart | Only after 2 failed restarts |
| Disk < 10% | Notify owner | Yes |
| Task overdue > 24h | Remind owner | No |
| Channel offline | Log and retry next cycle | Offline > 2 hours |
```

## Multi-Program Architecture

When managing multiple domains, separate them into independent programs:

```markdown
# Standing Orders

## Program 1: [Domain A] (Weekly)
...

## Program 2: [Domain B] (Monthly + On-Demand)
...

## Program 3: [Domain C] (As-Needed)
...

## Escalation Rules (All Programs)
- [Cross-program escalation conditions]
- [Shared approval gates]
```

Each program has its own trigger cadence, approval gates, and explicit boundaries.

## Best Practices

### Do

- Start with narrow authorization, expand as trust builds
- Define explicit approval gates (for high-risk actions)
- Include a "What NOT to Do" section — boundaries matter as much as permissions
- Pair with cron jobs to enforce time-based execution
- Review agent logs weekly
- Treat standing orders as living documents that evolve with your needs

### Don't

- Grant broad authorization on day one
- Skip escalation rules — every program needs a "when to stop and ask for help"
- Assume the agent will remember verbal instructions — write everything to files
- Mix different domains in a single program
- Forget to enforce with cron — standing orders without triggers are just suggestions

## The Big Picture

Standing Orders are the key to transforming OpenClaw from a "chatbot" into an "autonomous assistant." Define the authorization scope, trigger conditions, and escalation rules, and the agent can operate autonomously within safe boundaries. Pair with Cron for time-based control and Heartbeat for periodic health checks to form a complete automation system.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/automation/standing-orders.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/standing-orders.md) — Standing Orders
- [docs/automation/cron-jobs.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-jobs.md) — Cron Jobs
- [docs/automation/cron-vs-heartbeat.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-vs-heartbeat.md) — Cron vs Heartbeat
- [docs/concepts/agent-workspace.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-workspace.md) — Agent Workspace
- [docs/reference/AGENTS.default.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/AGENTS.default.md) — Default AGENTS.md Content
