---
title: "Framework Update: Agno v3.2.0"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno v3.2.0 upgrades A2A to the official 1.0 protocol, tightens the default Slack approval permissions, and lets Super Agent do the work itself instead of just routing requests"
tldr: "Three breaking changes to check before upgrading to Agno v3.2.0: OS Manager's `tool_call_limit` and `num_history_runs` defaults changed, A2A moved to the official 1.0 protocol (removing the old `/v1/message` and `/v1/tasks` routes), and Slack approvals now default to only the run's own starter. The headline feature is Super Agent doing the work itself instead of just routing to manager members."
series:
  name: "AI Framework Changelog"
  order: 65
---

> 🌏 [中文版](/posts/daily/2026-11-13-framework-agno-v3.2.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.2.0 |
| Previous version | v3.1.12 |
| Release date | 2026-11-12 |
| Release Notes | [v3.2.0](https://github.com/agno-agi/agno/releases/tag/v3.2.0) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43.2k |

## Why this release matters

This release touches three places that can break existing code or workflows outright, rather than adding something you could opt out of. The biggest one is the A2A (agent-to-agent) protocol moving from draft/RC status to the official `a2a-sdk` 1.x: the `/v1/message:*` and `/v1/tasks:*` routes are gone, so AgentOS and `A2AClient` have to upgrade together to keep speaking the same language. The second is the Slack interface moving entirely onto the official Slack Bolt SDK, which quietly changes approval semantics too — anyone used to be able to click Approve/Deny on Slack, but now only the person who started the run can, unless they're explicitly listed in `approvers=`. That kind of change — same API name, different default behavior — is easier to miss than a renamed method, because the code keeps compiling and running right up until someone actually clicks Approve and discovers they don't have permission. On the feature side, the notable shift is Super Agent no longer just routing requests to manager members but doing the work itself; combined with A2A tasks now being persisted and subscribable, this release clearly puts "how agents talk to each other" front and center.

```diagram
title: Agno v3.2.0: before and after on three breaking changes
desc: OS Manager defaults, the A2A protocol version, and Slack approval permissions all shift at once — worth checking each one before upgrading.
caption: Simplified: full scope and compatibility-layer details for each item are in "Breaking Changes" below.
---
<svg viewBox="0 0 640 400">
  <rect class="dg-box" x="20" y="20" width="250" height="72" rx="6"/>
  <text class="dg-label" x="145" y="42" text-anchor="middle" dominant-baseline="central">OS Manager defaults (before)</text>
  <text class="dg-sub" x="145" y="66" text-anchor="middle" dominant-baseline="central">tool_call_limit=8 / num_history_runs=7</text>

  <path class="dg-line" d="M270 56H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="370" y="20" width="250" height="72" rx="6"/>
  <text class="dg-label" x="495" y="42" text-anchor="middle" dominant-baseline="central">OS Manager defaults (after)</text>
  <text class="dg-sub" x="495" y="66" text-anchor="middle" dominant-baseline="central">tool_call_limit=24 / num_history_runs=5</text>

  <rect class="dg-box" x="20" y="160" width="250" height="72" rx="6"/>
  <text class="dg-label" x="145" y="182" text-anchor="middle" dominant-baseline="central">A2A protocol (before)</text>
  <text class="dg-sub" x="145" y="206" text-anchor="middle" dominant-baseline="central">/v1/message:* and /v1/tasks:* routes</text>

  <path class="dg-line" d="M270 196H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="370" y="160" width="250" height="72" rx="6"/>
  <text class="dg-label" x="495" y="182" text-anchor="middle" dominant-baseline="central">A2A protocol (after, v1.0)</text>
  <text class="dg-sub" x="495" y="206" text-anchor="middle" dominant-baseline="central">official a2a-sdk 1.x, per-entity A2A endpoint</text>

  <rect class="dg-box" x="20" y="300" width="250" height="72" rx="6"/>
  <text class="dg-label" x="145" y="322" text-anchor="middle" dominant-baseline="central">Slack approvals (before)</text>
  <text class="dg-sub" x="145" y="346" text-anchor="middle" dominant-baseline="central">anyone could Approve/Deny</text>

  <path class="dg-line" d="M270 336H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="370" y="300" width="250" height="72" rx="6"/>
  <text class="dg-label" x="495" y="322" text-anchor="middle" dominant-baseline="central">Slack approvals (after)</text>
  <text class="dg-sub" x="495" y="346" text-anchor="middle" dominant-baseline="central">only the starter, unless listed in approvers</text>
</svg>
```

## Key changes

- **Super Agent now does the work itself**: it used to just route requests to manager members; now it directly lists and runs agents, teams, and workflows, and reads platform activity and schedules, with Platform Builder as its only member → no need to wrap another manager member around it just to get Super Agent to execute a task
- **A2A stored tasks and full lifecycle**: A2A tasks are now persisted in the database, supporting send/stream/get/cancel/list/subscribe; external agents can be served, HITL and external tools can pause and continue, and Agent Cards advertise both v1.0 and v0.3 interfaces → A2A is no longer a single request/response, it's a task you can query, subscribe to, and resume
- **Mini Agent for Company Routines**: Routines now run on a restricted, non-chat Mini Agent that only has Company tools and packaged Routine skills — it can't see platform or general execution tools and doesn't show up in agent discovery, MCP, or A2A; Tasks gained `last_run`, API-computed `allowed_transitions`, direct start, and durable attempt-state recording, so Super Agent can push an accepted Task onto the durable queue without blocking the conversation → Routine execution is sandboxed, and a Task's state machine becomes something you can query and act on
- **AgentOS homepage metrics**: new component/aggregate/refresh tables back daily session/run/token/user/model/cost/duration/time-to-first-token/model-latency numbers through `/os/metrics/*`; refreshes run in the background, only recompute days that changed, and can aggregate across multiple local or remote databases → platform metrics you used to hand-roll in SQL are now built into the framework
- **Stored external-agent components**: `ClaudeAgent` and `CodexAgent` can now be saved, loaded, versioned, listed, and run through the components API; sandbox and output-schema references resolve through the registry, and unsupported or non-serializable settings fail loudly instead of being silently dropped → a harness agent's configuration becomes a manageable component, just like any other agent

## Breaking Changes

- `OSManager.tool_call_limit` default changes from `8` to `24`, and `OSManager.num_history_runs` default changes from `7` to `5`; separately, AgentOS now refuses to start when `OSManager(root=...)` is combined with custom tools named `read_file`, `list_files`, or `search_content`
  - Affected: deployments relying on the old framework defaults for these two settings, and any project using `OSManager(root=...)` whose tool names happen to collide
- AgentOS and `A2AClient` now run on the official `a2a-sdk` 1.x: the `/v1/message:*` and `/v1/tasks:*` routes are removed in favor of each entity's own A2A endpoint, and stream events plus response artifacts follow the v1.0 shape; the `a2a` extra now requires `a2a-sdk[http-server]>=1.2.2,<2`
  - Affected: clients calling the removed routes directly, and code importing the removed A2A helpers directly; standard v0.3 clients still work through the compatibility wire by default, but new clients should target v1.0 directly
- The Slack interface now runs on Slack Bolt: only the person who started a run can Approve/Deny it, unless they're listed in `approvers=` or mapped to the same principal through `users=`; the `slack` extra now requires `slack_bolt>=1.29.0,<2` and `slack_sdk>=3.43.0,<4`; AgentOS refuses to start when Slack serves `agent_os.manager` under `AgentOS(authorization=...)` without `users=`; direct imports of removed internal Slack helpers (`SlackEventHandler`, `HITLHandler`, `verify_slack_signature`) need updating
  - Affected: existing Slack approval flows that rely on "anyone on the team can approve," and projects pinned to older `slack_bolt`/`slack_sdk` version ranges

## Migration Guide

### Upgrading from 3.1.x to 3.2.0

```bash
pip install --upgrade "agno[a2a,slack]==3.2.0"
```

```python
# Old behavior (3.1.x): relied on the default tool_call_limit=8 / num_history_runs=7
# If your flow expects the old defaults, pin them explicitly after upgrading
from agno.os import OSManager

os_manager = OSManager(
    tool_call_limit=8,      # new default is 24; pin it if you don't want the behavior to change
    num_history_runs=7,     # new default is 5; same idea
)

# A2A: make sure your dependency is pinned to the 1.x line, and stop calling
# /v1/message:* or /v1/tasks:* directly
# pip install "a2a-sdk[http-server]>=1.2.2,<2"

# Slack: add approvers or users, or approval permissions narrow down to the starter only
from agno.os.interfaces.slack import Slack

slack = Slack(
    team=agent_os.manager,
    approvers=["U012ABCDEF"],      # explicitly list who can approve on someone else's behalf
    users={"U012ABCDEF": "alice"}, # or map a Slack user to the same principal
)
```

## Compared to other frameworks

In the same week (Nov 10), [AG2 v1.3.1](https://github.com/ag2ai/ag2/releases/tag/v.1.3.1) also moved its own A2UI protocol from release candidate to the official 1.0 stable spec, while this Agno release moves Google's A2A protocol from draft/RC to official 1.0. Two frameworks shipping their respective cross-agent interoperability protocols into stable status in almost the same week suggests that "how agents talk to each other" has become a new competitive front among frameworks in the second half of 2026 — not just "how you write a single agent" anymore.

## Today's takeaway

I used to assume a breaking change only shows up in the calling interface itself — a renamed function, a reordered parameter, something you'd spot just by reading the code. This time I noticed Agno listing a change to Slack's *default approval semantics* as a breaking change too: going from "anyone can click Approve" to "only the starter, by default, unless named," with the API name completely unchanged. The code still compiles and runs fine, right up until someone actually clicks Approve on Slack and finds out they've been locked out. That kind of behavior shift hiding inside a default value is easier to miss than an interface that visibly changed.

## References

- [Agno v3.2.0 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)
- [agno-agi/agno on GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.1.12...v3.2.0](https://github.com/agno-agi/agno/compare/v3.1.12...v3.2.0)
- [AG2 v1.3.1 Release Notes (A2UI v1.0)](https://github.com/ag2ai/ag2/releases/tag/v.1.3.1)
- [Agno v3.1.12 deep dive (Native Approvals for Harness Agents)](/posts/daily/2026-10-30-framework-agno-v3.1.12-en)
