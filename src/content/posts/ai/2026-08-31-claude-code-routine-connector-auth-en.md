---
title: "Claude Code Routine Connector Keeps Asking for Permission: The Hidden created_via Field"
date: 2026-08-31
category: ai
type: debug
tags: [claude-code, mcp, routine, connector, debugging]
lang: en
tldr: "Routines created by Claude itself (created_via: meta_mcp) prompt for connector approval on every call. User-created ones (created_via: http_api) don't. Fix: recreate the routine via the RemoteTrigger API."
description: "Investigating why a Claude Code Routine's groundlane MCP connector keeps prompting for authorization, and discovering the created_via field controls connector trust level."
draft: false
glossary:
  - term: "MCP"
    aliases: ["Model Context Protocol"]
    definition: "An open protocol that lets AI models connect to external tools and data sources through a standard interface."
  - term: "Routine"
    definition: "A scheduled cloud agent in Claude Code that runs on a cron schedule or as a one-time trigger."
  - term: "Connector"
    definition: "An MCP server connected via claude.ai, either Anthropic-hosted or self-hosted."
---

> 🌏 [中文版](/posts/ai/2026-08-31-claude-code-routine-connector-auth)

## TL;DR

Claude Code Routines have an undocumented `created_via` field that determines connector permission behavior. `meta_mcp` (created by Claude through MCP tools) prompts for approval on every connector call. `http_api` (created by the user or API) doesn't. Recreate the routine via the [RemoteTrigger API](https://docs.anthropic.com/en/docs/claude-code/routines) to fix it.

## Context

I run over a dozen Claude Code Routines for daily scheduled tasks. One of them — a daily Taiwan stock risk dashboard — needs to call a self-hosted [groundlane](https://groundlane.vincent-xu-work.workers.dev/mcp) MCP server to fetch stock data from the FinMind API. This routine was created by Claude during a Claude Code session.

Other routines (like `daily-digest-signals`) also use the same groundlane connector heavily — over 75 `web_fetch` calls per run — and never prompt for authorization.

## Problem

Every time the stock dashboard routine called groundlane's `web_fetch`, this prompt appeared:

```
Allow Claude to use Web fetch (groundlane)?
This connector call requires your approval to proceed.
```

Scheduled runs that hit this prompt with nobody around to approve would fail with `stop_reason=tool_use`. Manual runs required clicking "Allow once" each time.

The connector settings page had all groundlane tools set to "Always allow". It made no difference.

## Investigation

### Ruling out hypothesis 1: first-party vs third-party connector

Initial theory: groundlane is self-hosted (no `claude_ai` prefix in tool names), so the platform treats it differently from Anthropic-hosted connectors like Exa or Tavily.

**Disproved**: The `daily-digest-signals` routine uses the same groundlane connector and its SKILL.md explicitly says "do not switch to Exa/Tavily/others." It never prompts.

### Ruling out hypothesis 2: new routine needs first-time authorization

Theory: a newly created routine needs one round of manual approval before auto-approving.

**Disproved**: The stock routine's first Scheduled run appeared to "succeed," but the run log revealed it never mounted the repo (`No sources configured`, `/home/user` was an empty directory). It never reached the groundlane call. The "success" was a false positive.

### Finding the real difference

Using the [RemoteTrigger API](https://docs.anthropic.com/en/docs/claude-code/routines) with `list` and `get` actions, I pulled the full JSON for both routines and compared field by field:

| Field | daily-digest-signals (works) | Stock dashboard (broken) |
|---|---|---|
| `created_via` | `http_api` | `meta_mcp` |
| `created_kind` | `ROUTINE_CREATED_KIND_UNSPECIFIED` | `routine` |
| `creator.display_name` | `Vincent` | (empty) |
| groundlane connector config | identical | identical |
| `permitted_tools` | `[]` | `[]` |
| `tool_policy_overrides` | `[]` | `[]` |

The groundlane connector configuration was byte-for-byte identical — same `connector_uuid`, same URL, same empty `permitted_tools`. The only structural difference was `created_via`.

## Solution

Create a new routine with identical config using the RemoteTrigger API's `create` action:

```bash
# Inside a Claude Code session, use the RemoteTrigger tool
RemoteTrigger({
  action: "create",
  body: {
    name: "Your routine name",
    cron_expression: "30 10 * * 1-5",  // weekdays 6:30 PM GMT+8
    enabled: true,
    job_config: {
      ccr: {
        environment_id: "env_...",
        session_context: {
          model: "claude-sonnet-5",
          sources: [{ git_repository: { url: "https://github.com/..." } }],
          allowed_tools: ["preset:default", "Bash", "Read", ...]
        },
        events: [{ data: { uuid: "...", type: "user",
          message: { content: "Your prompt", role: "user" }
        }}]
      }
    },
    mcp_connections: [
      { connector_uuid: "...", name: "groundlane", url: "https://..." },
      // ... other connectors
    ]
  }
})
```

The response confirmed `created_via: "http_api"`.

Manually triggering the new routine, groundlane `web_fetch` returned results immediately with **no authorization prompt**:

```
[12:14:29] tool_use mcp__groundlane__web_fetch → FinMind TAIEX
[12:14:31] tool_result: {"ok":true, ...}  ← direct success
[12:14:34] tool_use mcp__groundlane__web_fetch → TAIEX historical data
[12:14:36] tool_result: {"ok":true, ...}  ← success again
```

Then delete the old routine at https://claude.ai/code/routines.

## Root cause

The `created_via` field records how the routine was created:

- **`http_api`**: Created through Claude Code's HTTP API — this includes the web UI, the RemoteTrigger tool, and the `/schedule` skill. The system treats this as "explicitly authorized by the user," so connector calls proceed without confirmation.
- **`meta_mcp`**: Created by Claude through MCP tools during a session. The system treats this as "AI-initiated, user hasn't explicitly approved connector permissions," so every connector call prompts for confirmation.

This field is immutable — set at creation time. Using the `update` API to change other routine settings does not change `created_via`. The only fix is to recreate.

## Takeaway

Connector permissions in Claude Code Routines don't just depend on the connector's own settings (Always allow / Ask / Deny). They also depend on who created the routine. Letting Claude "create a routine for you" during a session and creating one yourself are two different things in the permission model.

## References

- [Claude Code Routines documentation](https://docs.anthropic.com/en/docs/claude-code/routines)
- [Model Context Protocol specification](https://modelcontextprotocol.io/)
- [FinMind Taiwan Stock API](https://finmindtrade.com/) (in Chinese)
