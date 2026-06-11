---
title: "OpenClaw Multi-Agent and Delegate Architecture"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, multi-agent, delegate, session-management, routing]
lang: en
tldr: "OpenClaw supports running multiple isolated agents within a single Gateway, routing messages via bindings, and enabling AI to act on your behalf through its Delegate architecture."
description: "OpenClaw's multi-agent routing, session isolation strategies, Delegate proxy model, and Agent Loop execution mechanism."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-multi-agent)

OpenClaw can run more than just a single AI agent. It supports running multiple fully isolated agents within the same Gateway, each with its own independent workspace, authentication, and session. Combined with the Delegate architecture, agents can even act on your behalf as proxies. This post covers multi-agent routing, session isolation, Delegate mode, and how the Agent Loop works.

## Multi-Agent Architecture

### What Makes Up an Agent

Each agent is a completely independent entity:

| Component | Description |
|---|---|
| AgentId | Unique identifier, e.g. `work`, `personal` |
| Workspace | Independent working directory containing `AGENTS.md`, `SOUL.md`, `USER.md` |
| State Dir | `~/.openclaw/agents/<agentId>/` |
| Auth Profiles | Independent API Keys / OAuth, not shared automatically |
| Sessions | `~/.openclaw/agents/<agentId>/sessions/` |
| Skills | `skills/` under workspace, can share `~/.openclaw/skills` |

### Creation and Management

```bash
# Add a new agent called "work"
openclaw agents add work

# View all agents and their binding relationships
openclaw agents list --bindings
```

### Binding Routing

Bindings determine "which messages go to which agent." Three key concepts:

- **AgentId** -- An isolated "brain"
- **AccountId** -- A channel account entity (e.g., a WhatsApp phone number)
- **Binding** -- Routing rules based on channel, accountId, and peer

Routing uses most-specific-first matching:

```
1. Peer match (exact DM / group)
2. Parent peer (thread inheritance)
3. Guild + roles (Discord)
4. Guild (Discord)
5. Team (Slack)
6. Account ID
7. Channel level
8. Default agent (fallback)
```

Multiple conditions use AND logic -- all must match.

### Practical Applications

**Route by channel:** Use a fast, cheap model for everyday tasks on WhatsApp; use Claude Opus for deep work on Telegram.

**Route by contact:** Most WhatsApp messages go to the standard agent; specific contacts get routed to a more powerful model.

**Multi-account isolation:** WhatsApp account A binds to agent-personal, account B binds to agent-work, Discord binds to agent-community.

## Session Management

### DM Scope

`session.dmScope` controls the isolation level for direct messages:

| Mode | Behavior | Use Case |
|---|---|---|
| `main` (default) | All DMs share one session | Personal use, cross-device continuity |
| `per-peer` | Isolated by sender | Multiple people accessing the same agent |
| `per-channel-peer` | Isolated by channel + sender | Multi-user inbox |
| `per-account-channel-peer` | Isolated by account + channel + sender | Multi-account setups |

Security warning: If your agent receives DMs from multiple people, it is **strongly recommended** not to use the default `main` mode. Otherwise, everyone shares the same conversation context, which leaks private information.

### Identity Links

Use `session.identityLinks` to map the same person across different platforms to a single identity, allowing them to share DM sessions across channels.

### Session Lifecycle

- **Daily reset** -- Default at 4:00 AM
- **Idle reset** -- Optional sliding window; whichever expires first wins against the daily reset
- **Manual trigger** -- `/new` and `/reset`
- **Cron job** -- Each execution creates a new session

Default maintenance settings: purge after 30 days, maximum 500 entries, 10MB rotation threshold. For production environments, using `mode: "enforce"` for automatic cleanup is recommended.

## Delegate Architecture

Delegate is an advanced application of multi-agent: an agent acts **under its own identity** on behalf of a human, like an AI secretary with its own account.

### Three Capability Tiers

**Tier 1: Read-Only + Draft** -- Read-only data access and draft message composition. Requires manual review before sending. Only needs read permissions.

**Tier 2: Send on Behalf** -- Sends as the delegate identity. Recipients see "Delegate on behalf of Principal." Can create calendar events.

**Tier 3: Proactive** -- Autonomous scheduled execution combined with cron jobs. No per-action approval needed; acts according to standing orders in `AGENTS.md`.

### Security Prerequisites

Before granting Delegate permissions, you must configure:

- **Hard blocks** -- Non-negotiable restrictions (e.g., no sending external emails without approval)
- **Tool restrictions** -- Gateway-level allow/deny lists
- **Sandbox isolation** -- Restricted filesystem and network access
- **Audit log** -- Complete operation records

### Setup

```bash
openclaw agents add delegate
# Configure identity provider delegation (Microsoft 365 / Google Workspace)
# Bind to specific channels via bindings
```

Multiple delegates can run on the same Gateway, each with independent workspaces and authentication.

## Agent Loop

A complete execution cycle for each agent:

```
Receive message → Context assembly → Model inference → Tool execution → Streaming response → Persistence
```

### Concurrency Control

Execution within each session is **serial** (session lane) to avoid race conditions. An optional global lane provides gateway-wide serialization. Message channels support three queuing strategies:

- **collect** -- Collect messages
- **steer** -- Direct to a running agent
- **followup** -- Append to the current execution

### Hook System

| Type | Available Hooks |
|---|---|
| Gateway hooks | `agent:bootstrap`, `/new`, `/reset`, and other lifecycle events |
| Plugin hooks | `before_model_resolve`, `before_prompt_build`, `before_tool_call` |

### Timeout Behavior

`agent.wait` defaults to 30 seconds. The agent runtime itself has a 48-hour abort timer.

## Inter-Agent Communication

Disabled by **default**. You must explicitly enable it and configure an allowlist to activate agent-to-agent messaging. This is an intentional security design -- preventing unauthorized interactions between agents.

## Summary

The core tradeoff in OpenClaw's multi-agent architecture is **isolation first**. Each agent is a completely independent entity that does not share authentication, sessions, or communication channels (unless explicitly opened). This is great for security but means cross-agent collaboration requires additional configuration. It is well-suited for scenarios where you need to run multiple purpose-specific, non-interfering AI assistants on the same machine.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/concepts/multi-agent.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/multi-agent.md) -- Multi-Agent Routing
- [docs/concepts/delegate-architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/delegate-architecture.md) -- Delegate Proxy Architecture
- [docs/concepts/agent-loop.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-loop.md) -- Agent Loop Execution Cycle
- [docs/concepts/agent.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent.md) -- Agent Runtime Overview
- [docs/concepts/agent-workspace.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-workspace.md) -- Agent Workspace
- [docs/concepts/session.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session.md) -- Session Management
- [docs/concepts/model-failover.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-failover.md) -- Model Failover and Auth Rotation
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration.md) -- Gateway Configuration (Multi-Agent Related)
