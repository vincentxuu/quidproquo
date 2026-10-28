---
title: "Framework Update: Agno v3.1.11"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno v3.1.11 lets external coding agents like Claude Code and Codex join a Team directly as members or a step in a Workflow, plus advanced Session Search and lifecycle APIs for Company Tasks and Routines"
tldr: "Three things in Agno v3.1.11: (1) Harness Agents arrive — `ClaudeAgent`/`CodexAgent` can now join a `Team` directly as members or serve as a step inside `Parallel`/`Loop`/`Condition`/`Router` in a `Workflow`, each running its own model, tools, and workspace while keeping its own conversation history within a session; (2) advanced Session Search — `POST /sessions/search` supports nested AND/OR/NOT filters over sessions; (3) Company Tasks and Routines get full lifecycle management APIs (Tasks can be created or edited at any stage, Routines can be cancelled, archived, or restored)."
series:
  name: "AI Framework Changelog"
  order: 56
---

> 🌏 [中文版](/posts/daily/2026-10-29-framework-agno-v3.1.11)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.1.11 |
| Previous | v3.1.10 |
| Released | 2026-10-27 |
| Release Notes | [v3.1.11](https://github.com/agno-agi/agno/releases/tag/v3.1.11) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43k |

## Why this version matters

Multi-agent teams have had a persistent gap: every member of a Team had to be defined with Agno's own primitives, so dropping in an external coding agent like Claude Code or Codex — something with its own full toolchain, sandbox, and conversation state — meant hand-rolling an adapter layer. This release makes `ClaudeAgent`/`CodexAgent` first-class Harness Agents that can become formal Team members or a step in a Workflow, including inside control flows like `Parallel`, `Loop`, `Condition`, and `Router`. The team leader delegates to them with the same `delegate_task_to_member` it uses for any other member; the difference is that this particular member is running an entire independent coding agent with its own workspace and sandbox, and it keeps its own conversation history across turns of the same session. In effect, an external coding agent goes from being a black box you had to wire in by hand to a first-class citizen you can delegate to and compose with in multi-agent orchestration.

```diagram
title: Agno v3.1.11: Harness Agents join a Team
desc: The team leader still delegates with delegate_task_to_member — the difference is that two of the members are Harness Agents running in a sandbox
caption: Simplified: only the delegation relationship is shown; Workflow's Parallel/Loop/Condition/Router control flows are omitted.
---
<svg viewBox="0 0 640 320">
  <rect class="dg-zone" x="220" y="160" width="380" height="120" rx="8"/>
  <text class="dg-tag" x="236" y="182" dominant-baseline="central">SANDBOX</text>

  <path class="dg-line" d="M270 104V138Q270 146 262 146H118Q110 146 110 154V188" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M310 104V188" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 104V138Q350 146 358 146H482Q490 146 490 154V188" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="240" y="40" width="160" height="64" rx="6"/>
  <text class="dg-label" x="320" y="62" text-anchor="middle" dominant-baseline="central">Team Leader</text>
  <text class="dg-sub" x="320" y="82" text-anchor="middle" dominant-baseline="central">orchestrates</text>

  <rect class="dg-box" x="40" y="188" width="140" height="64" rx="6"/>
  <text class="dg-label" x="110" y="210" text-anchor="middle" dominant-baseline="central">Member</text>
  <text class="dg-sub" x="110" y="232" text-anchor="middle" dominant-baseline="central">Agno Agent</text>

  <rect class="dg-box" x="240" y="188" width="140" height="64" rx="6"/>
  <text class="dg-label" x="310" y="210" text-anchor="middle" dominant-baseline="central">ClaudeAgent</text>
  <text class="dg-sub" x="310" y="232" text-anchor="middle" dominant-baseline="central">sandboxed</text>

  <rect class="dg-box" x="420" y="188" width="140" height="64" rx="6"/>
  <text class="dg-label" x="490" y="210" text-anchor="middle" dominant-baseline="central">CodexAgent</text>
  <text class="dg-sub" x="490" y="232" text-anchor="middle" dominant-baseline="central">sandboxed</text>

  <text class="dg-edge" x="320" y="146" text-anchor="start" dominant-baseline="central">delegates</text>
</svg>
```

## Key changes

- **Harness Agents as Team members or Workflow steps**: `ClaudeAgent`/`CodexAgent` can be a `Team` member or a step inside `Parallel`/`Loop`/`Condition`/`Router` in a `Workflow`; a harness agent with `sandbox=` runs each turn in its own container as a member or step, and AgentOS lists harness members on the team page → no more hand-rolling an adapter to wire an external coding agent into multi-agent orchestration; the team leader delegates with the existing `delegate_task_to_member`
- **Advanced Session Search**: new `GET /sessions/filter-schema` and `POST /sessions/search` support nested AND/OR/NOT filters on session name, session/user/component IDs, session type, and created/updated timestamps, matching the existing Traces API's filtering logic; PostgreSQL and SQLite apply predicates before counting and pagination, with a batched fallback for other adapters, and both sync and async client methods are included → deployments with large numbers of sessions can query with structured filters instead of fetching everything and filtering in the application layer
- **Company Task lifecycle management across every stage**: `POST /company/tasks` now accepts `status`, so a Task can be created in Backlog, Ready, or Cancelled; Tasks can move between any stages, Done or Cancelled Tasks can be reopened, and title and brief can be edited at any stage — though In Progress still only starts from a run, and moving a Task out of In Progress while that run is executing or paused is refused → more complete Task lifecycle management while keeping the "can't be bypassed while running" safety boundary
- **Company Routine operations API**: new `POST /company/routines/{id}/cancel`, `/archive`, `/restore`, and an admin-only `DELETE /company/routines/{id}`; `GET /company/routines` supports `sort_by`/`sort_order`; pausing or resuming an already-paused on-demand Routine now returns `409`, and scheduled runs no longer bump `updated_at` → Routine lifecycle management finally catches up to Tasks

## Breaking Changes

No breaking changes in this release. A few fixes do tighten edge-case behavior:

- `ReaderFactory.create_reader()` now returns a fresh reader configured per call instead of a cached singleton, so overrides like `chunk_size` reliably take effect and mutations no longer leak across `Knowledge` instances
- `StepOutput.to_dict()` now preserves int/float/bool/str values as their own types instead of stringifying them, so a step that returned `0` or `False` no longer comes back as `"0"`/`"False"` after an HITL resume or a session reload

## Migration guide

No code changes needed — just upgrade:

```bash
pip install --upgrade agno==3.1.11
```

```python
# Wire Claude Code or Codex into a Team and delegate to them like any other member
from agno.agent import ClaudeAgent, CodexAgent
from agno.team import Team

team = Team(members=[
    ClaudeAgent(sandbox=my_sandbox),
    CodexAgent(sandbox=my_sandbox),
    # other regular Agno Agent members
])
```

## Comparison with other frameworks

On the same day (2026-10-27), Pydantic AI's v2.63.0 added `IPythonCodeMode`, evolving its own execution layer with another code-execution environment. Agno took the opposite route, absorbing mature external coding agents like Claude Code and Codex directly into the Team/Workflow orchestration layer as formal members that can be delegated to. Both frameworks are grappling with the same question at the same time — where to draw the line between an agent framework and an external coding agent — just from opposite directions: one builds its own execution environment, the other orchestrates existing toolchains directly.

## Takeaway

I used to think wiring Claude Code into a multi-agent Team meant having some Agent's tool shell out to the Claude Code CLI. Seeing Agno make it a Harness Agent that's a first-class Team member — one the leader can delegate to and compose with `Parallel`/`Loop` control flow — made it clear that the difference between an external coding agent and a framework-native Agent can just be "this member runs on a different, complete agent runtime," and the orchestration layer's delegation logic doesn't need to know or care where that difference lives.

## References

- [Agno v3.1.11 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.11)
- [agno-agi/agno on GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.1.10...v3.1.11](https://github.com/agno-agi/agno/compare/v3.1.10...v3.1.11)
- [Pydantic AI v2.63.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)
