---
title: "Tool Pick | mcp-guardrail — Add an Approval and Audit Layer to Every MCP Tool Call"
date: 2026-08-25
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "mcp-guardrail is a stdio proxy sitting between the MCP client and the real MCP server. It uses a policy.yaml to decide which tools an agent may call, logs every invocation to an audit file, and scans config files for hard-coded API keys."
tldr: "mcp-guardrail is an open-source MCP security proxy: policy gateway + audit log + secret scanner in one. Install: clone then `pip install -e .`. It addresses the fact that most MCP server setups lack tool-level permission controls and often have secrets hard-coded in config files."
series:
  name: "AI Tool of the Day"
  order: 10
---

> 🌏 [中文版](/posts/daily/2026-08-25-tool-mcp-guardrail)

## Tool Info

| Field | Value |
|---|---|
| Name | mcp-guardrail |
| Type | MCP security proxy (policy gateway + audit log + secret scanner) |
| GitHub | [KiaanKothari/mcp-guardrail](https://github.com/KiaanKothari/mcp-guardrail) |
| Stars | 2 |
| Language | Python |
| License | MIT |
| Install | `git clone` then `pip install -e .` (not yet on PyPI) |

## What Problem Does It Solve

Have you ever wired up a bunch of MCP servers — GitHub, databases, filesystem, shell — letting your agent call them directly, without ever stopping to ask: "Is there a tool in this list that I actually don't want the agent to invoke on its own?" Most teams authorize MCP servers as a unit: if the agent can connect, it can call every tool under that server, including destructive ones like `github.delete_repo` or `shell.exec`. On top of that, many people hard-code API keys directly in their `mcpServers` config files — once that config gets pasted into an issue or committed, the keys are leaked.

mcp-guardrail is a stdio JSON-RPC proxy that sits between the MCP client and the real MCP server. Instead of launching the real server directly, you route it through `mcp-guardrail run` with a `policy.yaml` (allow/deny rules with glob patterns, matched top-down, defaulting to `deny`). Every `tools/call` goes through a policy check first — blocked requests get an error response without ever reaching the real server. Regardless of the verdict, all calls are logged to a local JSONL audit file that you can tail, grep, or aggregate later. It also includes a narrowly scoped secret scanner that catches hard-coded API keys and tokens in config files (AWS, GitHub, Slack, OpenAI, Anthropic, PEM private keys, etc.) and can run as a CI check — non-zero exit on any finding.

Good fit: teams that already have multiple high-risk MCP servers wired up (GitHub, shell, database) and want an auditable boundary for "what can the agent actually do" rather than relying on the agent's self-restraint; or anyone who wants to run its scan command across their entire MCP config directory to catch hard-coded secrets.

## Quick Start

### Installation

```bash
git clone https://github.com/KiaanKothari/mcp-guardrail.git
cd mcp-guardrail
pip install -e .
```

### Basic Usage

```bash
# 1. Generate a starter policy file
mcp-guardrail init

# 2. Replace the direct MCP server launch with one routed through guardrail
#    (in your Claude Code / Claude Desktop mcpServers config)
```

```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-guardrail",
      "args": [
        "run", "--policy", "/path/to/policy.yaml", "--",
        "npx", "-y", "@modelcontextprotocol/server-github"
      ]
    }
  }
}
```

```bash
# 3. See what just happened
mcp-guardrail report
```

### Advanced Usage

```bash
# Scan a config directory for hard-coded API keys/tokens — plug into CI
mcp-guardrail scan ~/.config/claude/
```

Policy rules in policy.yaml are matched top-down; the first matching pattern wins, and unmatched calls fall back to `default`:

```yaml
default: deny

rules:
  - tool: "github.create_issue"
    action: allow
  - tool: "github.delete_*"
    action: deny
    note: "destructive GitHub actions are never auto-approved"
```

## Comparison with Alternatives

| | mcp-guardrail | Bare direct connection | General-purpose secret scanners (gitleaks, etc.) | Host-native tool permission settings |
|---|---|---|---|---|
| Tool-level allow/deny policy | ✅ (glob pattern) | ❌ | ❌ (no MCP semantics) | Varies by host, usually coarse-grained |
| Auditable call log | ✅ (local JSONL) | ❌ | ❌ | Most hosts lack a standalone portable audit file |
| Secret scanning for MCP configs | ✅ | ❌ | Partial (generic patterns, not MCP-specific heuristics) | ❌ |
| Same config works across MCP clients | ✅ (proxy layer, host-agnostic) | — | — | ❌ (permissions tied to the specific host) |
| Requires extra services or accounts | No, pure CLI | — | No | No |

## Caveats

- **Limited transport support**: currently only handles standard newline-delimited JSON-RPC 2.0 over stdio. MCP servers using Content-Length framing or other transports require modifying the read loop in `proxy.py`.
- **Not yet on PyPI; early stage**: install-only via clone + `pip install -e .`. Created on 2026-08-24 with a single contributor and 2 stars — the policy schema may still change.
- **Policy only matches tool names**: there is no parameter-level filtering yet (e.g., allowing the same tool only for certain input paths). The README itself lists this as a planned feature.

## Takeaway

Most people think about "can this agent connect to this MCP server?" but rarely about the next layer down — "once connected, which specific tools can it call?" mcp-guardrail highlights a gap: the default trust boundary in the MCP ecosystem is the entire server, not the individual tool. That gap is exactly where it aims to fit.

## References

- [mcp-guardrail GitHub repo](https://github.com/KiaanKothari/mcp-guardrail): project overview, README, install instructions, policy schema, proxy architecture, and license (MIT) — all sourced from the official README.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): MCP protocol introduction.
