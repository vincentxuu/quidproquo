---
title: "clawhip: An Event Notification Router That Keeps Multi-Agent Development Under Control"
date: 2026-04-05
type: guide
category: ai
tags: [agent-cli, clawhip, notification, discord, slack, tmux, rust, multi-agent, ultraworkers]
lang: en
tldr: "clawhip is a Rust daemon that routes AI coding agent events (commits, PRs, session status) to Discord / Slack, solving the observability problem of not knowing who is doing what when multiple agents run in parallel."
description: "An introduction to clawhip's event pipeline architecture, routing rules, tmux monitoring mechanism, and its role as the notification and observability layer in the UltraWorkers multi-agent ecosystem."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-clawhip-event-notification-router)

When you have 3 AI coding agents running simultaneously, each in a different tmux session modifying different files, how do you know which one finished, which one is stuck, and which one just opened a PR? clawhip exists to answer that question.

## What Problem Does It Solve

Multi-agent parallel development has an underestimated pain point: **observability**. Agents don't proactively report their progress. You either open a bunch of terminal windows and watch them, or wait until everything finishes and then check.

What makes it worse is that if you let agents call the Discord API to send notifications themselves, it pollutes their context window — the model's attention gets consumed by API responses, degrading the quality of their actual work.

clawhip's solution is to **decouple notification logic from the agent**, turning it into a standalone daemon:

```
Agent emits event → clawhip daemon receives → route + format → send to Discord / Slack
```

The agent only needs to fire a lightweight HTTP POST; clawhip handles the rest.

## Architecture

clawhip is a Rust daemon that listens on `http://127.0.0.1:25294` by default, using a typed event pipeline internally:

```
[CLI / webhook / git / GitHub / tmux]
  → sources
  → mpsc queue
  → dispatcher
  → router → renderer → Discord/Slack sink
```

### Event Families

| Event Prefix | Source |
|--------------|--------|
| `github.*` | GitHub webhooks (issues, PRs, reviews) |
| `git.*` | Local Git operations (commit, push) |
| `agent.*` | Agent lifecycle (started, completed, failed) |
| `session.*` | OMC / OMX session events |
| `tmux.*` | tmux session state changes |

### Routing Rules

Routing is configured in `~/.clawhip/config.toml`, with support for glob pattern matching, payload filtering, and dynamic token expansion:

```toml
[[routes]]
events = ["github.pr.*"]
channel = "123456789"
format = "compact"
filters = { repo = "my-project" }
mentions = ["@dev-team"]
```

You can set different notification channels and formats for different repos, branches, and agents — no need to blast all events into the same channel.

### Multi-Sink Support

| Sink | Method |
|------|--------|
| Discord Bot | REST API (requires bot token) |
| Discord Webhook | No bot needed, direct webhook URL |
| Slack Webhook | Incoming webhook |

## tmux Monitoring

clawhip doesn't just passively receive events — it can also **actively monitor tmux sessions**:

```bash
# Start a new session and monitor it
clawhip tmux new -s issue-123 --channel <id> --keywords "error,complete" -- 'omx --madmax'

# Monitor an existing session
clawhip tmux watch -s my-session --channel <id> --keywords "error,PR created"

# List all monitored sessions
clawhip tmux list
```

It scans tmux pane output and sends a notification when it detects a keyword. It also has stale session detection — if a session hasn't produced output for too long, it sends a warning to remind you to check.

This is especially useful for multi-agent development: you don't need 5 terminal windows open to keep watching. clawhip tells you in Discord what happened in which session.

## Integration with OMC / OMX

clawhip has native integration with oh-my-claudecode (OMC) and oh-my-codex (OMX). It defines a standardized set of `session.*` event contracts:

| Event | Trigger |
|-------|---------|
| `session.started` | Agent session started |
| `session.finished` | Task completed |
| `session.failed` | Execution failed |
| `session.pr-created` | New PR opened |

OMC / OMX push events to clawhip through a built-in hook bridge:

```bash
# OMX hook entry point
clawhip omx hook <event-payload>

# Or hit the API directly
POST /api/omx/hook
```

This means if you're already using OMC or OMX for multi-agent coordination, adding clawhip gives you full Discord / Slack notifications automatically — no need to write any webhook logic yourself.

## Other Features

### Batch Sending

You can configure burst batching and CI batch summary windows to prevent a flood of events from spamming a channel in a short time:

```toml
[dispatch]
burst_window_ms = 2000
ci_summary_window_ms = 30000
```

### Agent Memory Management

```bash
clawhip memory init    # Initialize structured memory
clawhip memory status  # Check memory status
```

Uses a `MEMORY.md` + `memory/` shard pattern to persist agent memory across sessions.

### Cron Scheduling

Combined with system cron, you can set up periodic dev channel tracking:

```bash
# Send project status summary every 30 minutes
*/30 * * * * clawhip send --channel <id> --message "$(git log --oneline -5)"
```

## Installation

```bash
# Precompiled binary (recommended, no Rust required)
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/Yeachan-Heo/clawhip/releases/latest/download/clawhip-installer.sh | sh

# Or from crates.io
cargo install clawhip

# Start
clawhip          # Start the daemon
clawhip status   # Check health status
```

Supports systemd integration for auto-start on boot. Precompiled binaries cover x86_64 / aarch64 for both Linux and macOS.

## Project Status

| Metric | Value |
|--------|-------|
| GitHub Stars | ~543 |
| Forks | ~101 |
| Language | Rust |
| Latest Version | v0.4.0 |
| Published On | crates.io |
| Maintainer | Yeachan Heo |

Compared to OMC and OMX with their tens of thousands of stars, clawhip's 543 stars may seem modest. But this aligns with its positioning — it's an infrastructure tool, not a consumer-facing product. Its users are developers already running multi-agent workflows who need systematic notifications.

## Position in the UltraWorkers Ecosystem

```
oh-my-claudecode (OMC)  ─┐
oh-my-codex (OMX)        ├── Agent Coordination Layer
oh-my-openagent (OmO)   ─┘
         │
         │ session events
         ▼
      clawhip ──── Notification & Observability Layer
         │
         ▼
    Discord / Slack
```

OMC, OMX, and OmO are responsible for making agents do work; clawhip is responsible for letting humans know what agents are doing. This separation of concerns lets each tool focus on its own responsibility, rather than every agent framework having to reimplement its own notification system.

## References

- [clawhip GitHub Repository](https://github.com/Yeachan-Heo/clawhip)
- [clawhip on crates.io](https://crates.io/crates/clawhip)
- [oh-my-codex Workflow Enhancement Layer Introduction](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)
- [Claw Code: Open-Source Rust Reimplementation of Claude Code](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation)
