---
title: "Framework Update: Agno v3.1.12"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno v3.1.12 routes the permission requests that Claude Code and Codex already raise on their own straight into AgentOS's existing Approval UI, pausing them as a resumable PAUSED run"
tldr: "Agno v3.1.12 headline: Native Approvals for Harness Agents — `ClaudeAgent`/`CodexAgent`'s own permission requests (Claude's `permission_mode`, Codex's `approval_policy`) now turn into a PAUSED run inside AgentOS, showing up in the existing Chat and Approvals views; Resolve plus Continue Run sends the decision back into the same native execution without replaying the prompt, and sandboxed environments (Docker/AgentCore) keep this capability too. Also new: `Routine(enabled=False)` for a company routine a template can ship disabled and let users turn on later, and a headline number on charts."
series:
  name: "AI Framework Changelog"
  order: 58
---

> 🌏 [中文版](/posts/daily/2026-10-30-framework-agno-v3.1.12)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.1.12 |
| Previous version | v3.1.11 |
| Release date | 2026-10-29 |
| Release Notes | [v3.1.12](https://github.com/agno-agi/agno/releases/tag/v3.1.12) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43k |

## Why this release matters

The previous release (v3.1.11, Oct 27) had just made `ClaudeAgent`/`CodexAgent` first-class Team members and Workflow steps. This one closes a very practical gap: Claude Code and Codex already have their own permission mechanisms — Claude's `permission_mode` and permission callbacks, Codex's `approval_policy` — but until now those requests only lived inside the harness's own world; AgentOS couldn't see or govern them at all. This release wires both mechanisms straight into AgentOS's existing Approval UI. A permission request raised by the harness now becomes a persisted `PAUSED` run that shows up in the same Chat and Approvals screens users already use; a human resolves it, and Continue Run sends the decision back into the same native execution without replaying the prompt. Even Docker/AgentCore sandboxed environments keep this ability, including capability negotiation, a decision RPC, durable persistence, and reattachment after a worker disconnect. One behavior change worth flagging: a `CodexAgent` with no approval settings now defaults to the `on-request` policy, so a request that previously went nowhere now pauses and waits instead, bounded by `hitl_timeout` (default 900 seconds).

```diagram
title: Agno v3.1.12: a harness agent's permission request reaches the Approval UI
desc: A permission request raised by ClaudeAgent/CodexAgent itself is stored by AgentOS as a PAUSED run; once a human resolves it, Continue Run sends the decision back into the same native execution without replaying the prompt.
caption: Simplified: sandbox-specific capability negotiation and reattachment-after-disconnect details are omitted.
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M320 96V136" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 204V240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 300V340" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="100" y="40" width="440" height="56" rx="6"/>
  <text class="dg-label" x="320" y="60" text-anchor="middle" dominant-baseline="central">ClaudeAgent / CodexAgent</text>
  <text class="dg-sub" x="320" y="80" text-anchor="middle" dominant-baseline="central">raises its own permission request</text>

  <rect class="dg-box dg-box--accent" x="100" y="140" width="440" height="64" rx="6"/>
  <text class="dg-label" x="320" y="160" text-anchor="middle" dominant-baseline="central">Run pauses</text>
  <text class="dg-sub" x="320" y="180" text-anchor="middle" dominant-baseline="central">state = PAUSED, persisted to the database</text>

  <rect class="dg-box" x="100" y="244" width="440" height="56" rx="6"/>
  <text class="dg-label" x="320" y="264" text-anchor="middle" dominant-baseline="central">AgentOS Approval UI</text>
  <text class="dg-sub" x="320" y="284" text-anchor="middle" dominant-baseline="central">shown in the existing Chat / Approvals views</text>

  <rect class="dg-box" x="100" y="344" width="440" height="64" rx="6"/>
  <text class="dg-label" x="320" y="364" text-anchor="middle" dominant-baseline="central">Resolve + Continue Run</text>
  <text class="dg-sub" x="320" y="384" text-anchor="middle" dominant-baseline="central">returns to the same native execution, no replay</text>
</svg>
```

## Key changes

- **Native Approvals for Harness Agents**: Claude's and Codex's own permission requests now reach AgentOS's Approval UI directly, persisted as a `PAUSED` run; Resolve plus Continue Run sends the decision back into the same native execution. Decisions are validated against the exact action requested, with sync/async continuation, cancellation, expiry, and storage-failure handling; sandboxed agents (Docker/AgentCore) keep capability negotiation, a decision RPC, and reattachment after a worker loss → reviewing permission requests no longer means switching to the harness's own interface, it's all unified in AgentOS. One behavior change to note: a `CodexAgent` with no approval settings now defaults to `on-request`, so a request that previously went nowhere now pauses and waits (`hitl_timeout` defaults to 900s)
- **Initially Disabled Company Routines**: `Routine(enabled=False)` lets a template ship a Routine in a disabled state that a user later turns on from the UI; disabled Routines are still created atomically, stay linked to their Product, and remain visible in listings — only the scheduler skips them, and the user's choice survives a restart → templates can ship a whole pipeline without forcing every user to run all of it from day one
- **Headline Numbers on Charts**: `ChartTools.create_chart()` now takes an optional preformatted `value` (like `"$22.3K"` or `"94%"`) shown next to the chart title; the docstring tells the model to fill it in only when a single number genuinely summarizes the chart, so averages and rates don't get wrongly summed → adding a headline figure to a chart no longer needs a separate drawing step

## Breaking Changes

None, but there's one behavior change worth flagging:

- A `CodexAgent` with no approval options configured now automatically applies the native `on-request` policy; a request that previously went nowhere when unhandled now explicitly pauses and waits (`hitl_timeout` defaults to 900 seconds)
- Affected: existing code that creates a `CodexAgent` without approval-related settings, and any flow relying on "an unhandled request just continues"

## Migration Guide

Upgrade directly, no code changes required; extra setup is only needed to use the new approval feature:

```bash
pip install --upgrade agno==3.1.12
```

```python
from agno.agent import ClaudeAgent
from agno.os import AgentOS

# ClaudeAgent's permission requests are automatically wired into AgentOS's Approval UI
# as long as this agent has a database (including the one AgentOS supplies)
claude_agent = ClaudeAgent(permission_mode="default")
agent_os = AgentOS(agents=[claude_agent])

# After a human resolves it in the Approvals view, Continue Run sends the
# decision back into the same native execution.
# See cookbook/frameworks/human_in_the_loop/
```

## Compared to other frameworks

In the same week (Oct 27–29), Mastra's `@mastra/core@1.80.0` added per-resource OAuth connection isolation — solving "which user does this connection represent." Agno's release solves a different problem — "should this one tool call run" — through a consent mechanism. Both are pulling authorization logic that used to be scattered across the application layer, or even inside the harness's own interface, up into the framework itself. This also continues the direction set by the previous release (v3.1.11): first make Harness Agents first-class citizens that can be orchestrated into a team, then make their permission mechanisms visible to the framework's own review surface.

## Today's takeaway

I used to assume that a permission prompt from Claude Code or Codex could only be handled inside their own CLI or interface. Seeing Agno turn that request into a `PAUSED` run sitting in AgentOS's database made it clear: as long as a state can be persisted, read by another system, and written back to with a decision, "review" doesn't have to happen in the same interface that produced the request — it can be moved to any review screen that can reach the same database.

## References

- [Agno v3.1.12 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.12)
- [agno-agi/agno on GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.1.11...v3.1.12](https://github.com/agno-agi/agno/compare/v3.1.11...v3.1.12)
- [Agno v3.1.11 deep dive (Harness Agents)](/posts/daily/2026-10-29-framework-agno-v3.1.11-en)
- [Mastra @mastra/core v1.80.0 deep dive](/posts/daily/2026-10-30-framework-mastra-core-v1.80.0-en)
