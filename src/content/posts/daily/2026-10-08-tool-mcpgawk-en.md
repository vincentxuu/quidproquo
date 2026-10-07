---
title: "Tool Pick｜mcpgawk — Catch MCP Servers That Change After You Approved Them"
date: 2026-10-08
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source CLI that blocks MCP server calls when a tool definition has drifted from the baseline you approved, running entirely on your machine with nothing uploaded"
tldr: "mcpgawk is an open-source CLI that remembers what each MCP server's tools looked like when you approved them, then blocks any call once a tool has changed. Install: `uv tool install --force mcpgawk`. It solves the problem of an approved MCP server silently rewriting its tools later (a rug-pull) with nobody noticing."
series:
  name: "AI Tool of the Day"
  order: 48
---

> 🌏 [中文版](/posts/daily/2026-10-08-tool-mcpgawk)

## Tool Info

| Item | Value |
|---|---|
| Name | mcpgawk |
| Type | CLI (MCP server security scanning + rug-pull detection) |
| GitHub | [gawk-dev/mcpgawk](https://github.com/gawk-dev/mcpgawk) |
| Stars | 0 (repo created 2026-07-08, launched on Product Hunt today — still very thin on community track record) |
| Language | Python |
| License | Apache-2.0 |
| Install | `uv tool install --force mcpgawk` |

## What Problem It Solves

Before you wire an MCP server into Claude Code or Cursor, you probably glance at what tools it declares and what permissions look reasonable, then approve it. But the MCP protocol itself never tells you when that server changes later — the next time it starts up, it can ship a new version where a tool's description, input schema, or even whether it writes files has quietly changed, and your agent just calls the new version without asking. That's the "rug-pull" that security circles have been discussing the last few weeks: an attacker, or a maintainer who's had a change of heart, doesn't need to trick you into re-approving anything — they just swap the content inside a server you already trust.

mcpgawk's approach is direct: it first reads every MCP server each agent on your machine can reach and records a baseline of every tool's schema, description, and permission flags. From then on, every call gets re-checked against that baseline before it runs, and anything that doesn't match gets blocked — not auto-approved, and not just logged after the fact. Instead it opens a local page where you can eyeball the diff yourself and approve or reject it. At the same time it calculates how many tokens each tool adds to your context window at connect time, so you know exactly what installing a given MCP server costs you in context budget. None of this touches the network — every measurement stays on your own machine.

Best fit: teams already running more than one or two MCP servers, across multiple maintainers or versions, who want to catch an agent quietly picking up new tool behavior before it turns into an incident. If you're just running one or two servers you wrote yourself and never update, this layer of protection won't do much for you yet.

## Getting Started

### Install

```bash
# Needs uv or pipx
uv tool install --force mcpgawk      # or: pipx install --force mcpgawk

# First run: finds every agent's MCP config on this machine automatically
mcpgawk
```

### Basic Usage

```bash
# Wire baseline checking into your agent's call path — stays on once installed
mcpgawk guard install
mcpgawk guard status          # confirm protection is actually on

# Scan one MCP config on its own, without installing the guard
mcpgawk scan mcp.json

# Review and approve or reject a call that got blocked for drifting from baseline
mcpgawk decide
```

### Advanced Usage

```bash
# Record history snapshots so you can later answer
# "what actually changed on this server since I last approved it"
mcpgawk scan mcp.json --track
mcpgawk changes

# CI: check every PR's MCP config for token cost and drift, fail the build over the limit
# .github/workflows/mcp-gate.yml
# - uses: gawk-dev/mcpgawk@v1
#   with: { config: mcp.json, max-tokens: 8000, fail-on-flagged: true }
```

## How It Compares

| | mcpgawk | Manual periodic review | Typical cloud MCP scanner |
|---|---|---|---|
| Detects "changed after approval" (rug-pull) | ✅ `--track` | ❌ Nobody re-reviews every time | Partial |
| Actually blocks the call, not just a report | ✅ `guard install` | ❌ | ❌ Mostly report-only |
| Inventory/scan results uploaded to the cloud | ❌ (local only) | — | Usually yes |
| CI integration | ✅ GitHub Action | ❌ | Depends on vendor |
| Free to use | ✅ Core scan/guard features | ✅ | Mostly paid |

## Things to Watch For

- **This is a very young project.** The GitHub repo was created on 2026-07-08 and currently has 0 stars and 0 forks; the PyPI release is still at 0.1.x (Beta). The documentation is thorough, but there's little long-term community validation yet — try it somewhere non-critical before wiring it into a production approval flow.
- **The blocking feature doesn't cover every agent.** The `guard install` pre-execution hook officially works on only 6 of the 21 supported clients; the rest are explicitly listed as having no hook point, rather than being glossed over as protected.
- **The free tier stops at a single machine.** Scanning, `guard`, and `--track` are free and open source, but fleet-wide management (`enforce`) and always-on monitoring (`monitor`) are part of the paid mcpgawk Platform and require a separate subscription.

## Today's Takeaway

Most "MCP security" discussion still stops at "look at what a server can do before you install it." mcpgawk is a reminder of a messier fact underneath: the MCP protocol has no version-notification mechanism, so what you approved was a snapshot of the tool definitions at that moment, not a standing promise from the server. Moving the security check from "look once before installing" to "re-check the baseline on every call" closes a gap the protocol's own design leaves open.

## References

- [gawk-dev/mcpgawk — GitHub](https://github.com/gawk-dev/mcpgawk)
- [mcpgawk official site and docs](https://mcp.gawk.dev/)
- [mcpgawk — PyPI](https://pypi.org/project/mcpgawk/)
- [mcpgawk — Product Hunt](https://www.producthunt.com/products/mcpgawk?launch=mcpgawk)
- [AI Agent Gateway: Open-source tool keeps credentials out of agent configs — Help Net Security](https://www.helpnetsecurity.com/2026/10/07/open-source-ai-agent-gateway)
