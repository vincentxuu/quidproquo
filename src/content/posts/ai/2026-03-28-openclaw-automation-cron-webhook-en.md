---
title: "OpenClaw Automation (Part 1): Cron, Heartbeat, and Webhook"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, cron, heartbeat, webhook, automation, scheduling]
lang: en
tldr: "Heartbeat for periodic checks (30-minute batches), Cron for precise scheduling (with isolated sessions and model overrides), Webhook for receiving external event triggers."
description: "OpenClaw's three automation mechanisms: Heartbeat for periodic checks, Cron for precise scheduling, and Webhook for external event triggers."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-automation-cron-webhook)

OpenClaw is not just a passive responder — it can run tasks on a schedule, receive external events, and even proactively monitor things. This post covers the three automation mechanisms.

## Heartbeat: Periodic Checks

Heartbeat runs periodically in the **main session** (default every 30 minutes), letting the agent check conditions and handle routine tasks.

### Use Cases

- Batch-processing multiple periodic checks (inbox, calendar, notifications)
- Requires conversation context (the agent knows what you've been working on recently)
- Precise timing is not needed
- Reduce API calls (one heartbeat replaces 5 separate cron jobs)

### Configuration

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
        activeHours: { start: "08:00", end: "22:00" },
      }
    }
  }
}
```

### HEARTBEAT.md

The agent reads this file on every heartbeat:

```markdown
# Heartbeat checklist

- Scan inbox for urgent emails
- Check calendar for the next 2 hours
- Confirm no overdue to-do items
- If quiet for more than 8 hours, send a brief check-in
```

When there's nothing to report, the agent replies `HEARTBEAT_OK` without sending a message.

## Cron: Precise Scheduling

Cron runs at exact times and can use isolated sessions and different models.

### Basic Usage

```bash
# Daily briefing at 7 AM
openclaw cron add \
  --name "Morning briefing" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate today's briefing" \
  --model opus \
  --announce \
  --channel whatsapp \
  --to "+15551234567"

# Reminder in 20 minutes (one-time)
openclaw cron add \
  --name "Meeting reminder" \
  --at "20m" \
  --session main \
  --system-event "Standup meeting in 10 minutes" \
  --wake now \
  --delete-after-run
```

### Supported Formats

- 5-field cron expression (minute/hour/day/month/weekday)
- 6-field (with seconds)
- `--at` for one-time scheduling
- `--every` for interval scheduling
- `--tz` for timezone support

### Load Spreading

Periodic on-the-hour schedules automatically get a random offset of 0-5 minutes to prevent all jobs from firing simultaneously. Use `--stagger <duration>` to customize or `--exact` to enforce precise timing.

### Main vs Isolated Session

| | Heartbeat | Cron (main) | Cron (isolated) |
|---|---|---|---|
| Session | Main | Main (via system event) | `cron:<jobId>` |
| History | Shared | Shared | Starts fresh each time |
| Context | Full | Full | None |
| Model | Main session | Main session | Overridable |
| Output | Only when needed | Handled by heartbeat | Announce summary |

### Cost Considerations

| Mechanism | Cost |
|---|---|
| Heartbeat | One turn every N minutes, proportional to HEARTBEAT.md size |
| Cron (main) | Adds event to next heartbeat, no independent turn |
| Cron (isolated) | One full agent turn per job, can use a cheaper model |

## Heartbeat vs Cron Selection Guide

| Scenario | Recommended | Reason |
|---|---|---|
| Check inbox every 30 minutes | Heartbeat | Batch with other checks |
| Daily report at 9:00 AM | Cron (isolated) | Requires precise timing |
| Monitor calendar | Heartbeat | Natural fit for periodic checks |
| Weekly deep analysis | Cron (isolated) | Independent task, can use a stronger model |
| Reminder in 20 minutes | Cron (`--at`) | One-time precise timing |

**Best practice:** Combine both — Heartbeat handles routine checks, Cron handles precise scheduling and heavy tasks.

## Webhook: External Event Triggers

Let external systems trigger agent behavior via HTTP.

### Configuration

```json5
{
  hooks: {
    enabled: true,
    token: "your-secret-token",
    path: "/hooks",
    allowedAgentIds: ["assistant"]
  }
}
```

### Three Endpoint Types

**Wake (`POST /hooks/wake`):** Sends a system event to the main session.

```json
{
  "description": "New urgent email from client",
  "timing": "now"
}
```

`timing` can be `now` (immediate) or `next-heartbeat` (wait for the next heartbeat).

**Agent (`POST /hooks/agent`):** Runs an isolated agent turn.

```json
{
  "message": "Analyze this new data",
  "agent": "analyst",
  "session": "isolated",
  "model": "opus",
  "thinking": "high",
  "channel": "whatsapp",
  "to": "+15551234567"
}
```

**Mapped (`POST /hooks/<name>`):** Custom handler with payload transformation. Suitable for integrating external services like Gmail Pub/Sub.

### Security

- Use the token in a Bearer authorization header — **do not** put it in the query string
- Place endpoints behind a network boundary
- Use a dedicated token
- Restrict agent routing (`allowedAgentIds`)
- Treat external payloads as untrusted
- Custom transforms must be in the designated directory

## Other Automation Features

### Gmail Pub/Sub

Integrate Gmail via Google Cloud Pub/Sub to trigger the agent on new emails. Configuration in `docs/automation/gmail-pubsub.md`.

### Hooks

Shell hooks execute on specific events. Configuration in `docs/automation/hooks.md`.

### Polls

The agent can initiate polls on Telegram, WhatsApp, Discord, and Teams:

```bash
openclaw message poll --channel telegram --target 123456789 \
  --poll-question "Ship it?" --poll-option "Yes" --poll-option "No"
```

### Auth Monitoring

An optional ops script monitors authentication status (systemd/Termux). Configuration in `docs/automation/auth-monitoring.md`.

## Summary

OpenClaw's automation is organized in three layers:

1. **Heartbeat** — Periodic batch checks, context-aware, low cost
2. **Cron** — Precise scheduling with isolated session and model override support
3. **Webhook** — External event-driven, supporting wake, agent, and mapped endpoint types

All three can be freely combined. The most efficient setup uses Heartbeat for routine monitoring + Cron for precise scheduling + Webhook for external events.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/automation/cron-jobs.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-jobs.md) — Cron Jobs
- [docs/automation/cron-vs-heartbeat.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-vs-heartbeat.md) — Cron vs Heartbeat
- [docs/automation/webhook.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/webhook.md) — Webhook
- [docs/automation/gmail-pubsub.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/gmail-pubsub.md) — Gmail Pub/Sub
- [docs/automation/hooks.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/hooks.md) — Hooks
- [docs/automation/poll.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/poll.md) — Polls
- [docs/automation/auth-monitoring.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/auth-monitoring.md) — Auth Monitoring
- [docs/automation/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/troubleshooting.md) — Automation Troubleshooting
