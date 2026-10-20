---
title: "Framework Update: Agno v3.1.4"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.1.4 lets ClaudeAgent/CodexAgent run inside isolated containers, restoring session state from checkpoints even after the container, host, or replica goes down; background runs on one session now default to a strict queue of one at a time"
tldr: "The core of Agno v3.1.4 is Sandboxed Harness Agents: ClaudeAgent/CodexAgent can now run inside isolated, per-session containers (DockerSandbox or AWS Bedrock AgentCore), restoring session state from checkpoints so a lost container doesn't force a brand-new conversation; warm sandboxes make the next turn start faster. It also adds Queue Per Session — background runs on one session now default to running strictly one at a time in order, instead of the old accept-then-fail behavior. No formal breaking changes, but sandbox import paths moved, `sandbox=\"read-only\"` was renamed to `sandbox_mode`, and old sandbox binding tables need a manual migration — all worth checking after upgrading."
series:
  name: "AI Framework Changelog"
  order: 46
---

> 🌏 [繁體中文版](/posts/daily/2026-10-17-framework-agno-3.1.4)

## Version Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | `v3.1.4` |
| Previous | `v3.1.3` |
| Released | 2026-10-16 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.4) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.8k |

## Why This Release Matters

The previous release made `ClaudeAgent`/`CodexAgent` first-class citizens on par with native Agents (background execution, retries, checkpoint replay); this one fills in the execution environment itself: these external agents can now actually run inside isolated containers instead of touching the host directly. For teams running Claude Code or Codex in production as a coding agent, this finally gives them an official isolation story, instead of hand-rolling Docker configs and figuring out session recovery after a disconnect themselves.

## Key Changes

- **Sandboxed Harness Agents**: `ClaudeAgent`/`CodexAgent` accept a `sandbox=` parameter and run inside an isolated, per-session container; losing the container, host, or replica doesn't affect session state, which restores from checkpoints between turns, and a turn fails outright rather than silently starting a new conversation when native conversation state genuinely can't be recovered → new `require_native_resume`/`strict_persistence` options, plus `agno[claude]`/`agno[codex]` extras
- **DockerSandbox**: containers run as UID 1000 with a read-only filesystem, dropped capabilities, resource limits, and no networking by default (with an `isolated` option), and never mount the host or Docker socket; supports pause/resume and checkpoint transfer
- **AWS Bedrock AgentCore Sandbox**: the same sandbox contract implemented on AgentCore Runtime, with `AgentCoreCheckpointTransfer` (pause isn't supported)
- **Warm Sandbox Turns**: the coordinator keeps a session's container alive for `warm_computer_seconds` (default 300) after a turn so the next one connects faster — the release notes report warm-start times of 4.6s (Docker) and 3.3s (AgentCore) for Claude, versus 8.2s cold
- **Queue Per Session**: background runs on one session now default to running strictly one at a time, in order; different sessions still run concurrently → the accepting replica wakes its own queue worker right after commit, so a run starts within milliseconds instead of waiting for the next poll
- **ChartTools**: a new toolkit whose `create_chart` tool validates chart payloads (bar, line, area, pie, and stacked/horizontal variants) and returns a renderable chart block

## Breaking Changes

Nothing is formally labeled breaking, but a few changes affect existing deployments' behavior:

- Sandbox provider import paths moved to `agno.sandbox.docker` and `agno.sandbox.agentcore`
  - Affected: projects importing the old paths directly
- `CodexAgent`'s `sandbox="read-only"` is renamed to `sandbox_mode` (the old form still works but raises a `DeprecationWarning`)
  - Affected: any CodexAgent configured with `sandbox="read-only"`
- Queue Per Session is on by default, so background runs on one session go from "can run concurrently" to "strictly one at a time"
  - Affected: services that relied on concurrent background runs within a single session
- Sandbox binding tables created by earlier versions need a manual migration; AgentOS validates this at startup and names the remedy
  - Affected: deployments upgrading from an older version with existing sandbox binding data

## Migration Guide

### Upgrading from v3.1.3 to v3.1.4

```bash
pip install --upgrade agno==3.1.4
```

```python
# Updated import paths
# Before: from agno.sandbox import DockerSandbox
# After:
from agno.sandbox.docker import DockerSandbox

# sandbox_mode replaces sandbox="read-only"
# Before:
agent = CodexAgent(sandbox="read-only")
# After:
agent = CodexAgent(sandbox_mode="read-only")
```

After upgrading, start AgentOS and follow its prompts to migrate any existing sandbox binding tables. If you relied on concurrent background runs within a single session, redesign that flow to tolerate strict ordering instead.

## Compared With Other Frameworks

Today's batch also has Mastra 1.78.0 using agent scopes to guard "who can touch which run" and Pydantic AI v2.57.0's `ApprovalReviewer` guarding "should a tool call reach a person." Agno's containers here guard the third layer: "what can the agent actually touch while it runs." Three frameworks closing three different gaps in the same week looks less like coincidence and more like the whole ecosystem realizing, at the same moment, that once external coding agents like Claude Code and Codex become part of production, being able to run tasks isn't enough — permissions, approval, and isolation all have to show up together.

## Today's Takeaway

I used to think putting an external coding agent like Claude Code into a container was just an extra layer of plumbing. Seeing the warm-sandbox design made the real tradeoff clear: full isolation buys safety, but a container's cold-start latency directly slows down every turn. Agno's answer — keep the container around for a while instead of rebuilding it every time — sidesteps that choice rather than forcing a pick between isolation and speed.

## References

- [Agno v3.1.4 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.4)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Framework Update: Agno v3.1.3](/posts/daily/2026-10-12-framework-agno-3.1.3-en)
- [PR #11028: Sandbox Support](https://github.com/agno-agi/agno/pull/11028)
- [PR #9587: Queue Per Session](https://github.com/agno-agi/agno/pull/9587)
