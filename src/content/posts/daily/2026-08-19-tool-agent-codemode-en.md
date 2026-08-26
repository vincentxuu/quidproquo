---
title: "Tool Pick | agent-codemode — Let Coding Agents Write Scripts That Call MCP Servers Directly, Saving 99% Context"
date: 2026-08-19
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "A CLI + TypeScript SDK that reads the MCP servers already authenticated in Claude Code and lets your scripts call them directly — one script replaces dozens of tool-call round trips, no extra API keys or OAuth needed"
tldr: "agent-codemode is an open-source CLI/SDK that lets scripts written by Coding Agents call MCP servers you've already authenticated in Claude Code, Cursor, or Windsurf. Install: npm install -g agent-codemode. It solves the problem of agents burning through context on per-step tool calls by batching them into a single script execution (the author's benchmark shows 99.66% token savings)."
series:
  name: "AI Tool of the Day"
  order: 4
---

> 🌏 [中文版](/posts/daily/2026-08-19-tool-agent-codemode)

## Tool Info

| Field | Value |
|---|---|
| Name | agent-codemode |
| Type | CLI + TypeScript SDK |
| GitHub | [janwilmake/agent-codemode](https://github.com/janwilmake/agent-codemode) |
| Stars | 8 (repo created 2026-08-18) |
| Language | TypeScript |
| License | MIT |
| Install | `npm install -g agent-codemode` |

## What Problem Does It Solve

Have you ever used an Agent connected to multiple MCP servers (Linear, Slack, GitHub...) to do cross-system work, only to watch it fire off dozens of tool calls — the model stopping after each one to read the result and decide what to do next — blowing up your context window and slowing everything down? The author shares a benchmark in the README: the same task (fetch all In Progress Linear tickets, read their full content, count occurrences of "mcp") took 40 round trips and consumed 262,159 characters (~65,500 tokens) via sequential tool calls; rewritten as a single script, it used just 903 characters (~226 tokens) — a 99.66% reduction.

agent-codemode turns "calling MCP servers" from "a tool call that requires model intervention at every step" into "a TypeScript script the Agent writes once and runs to completion." It reads the MCP server list already configured and authenticated in Claude Code, Cursor, Windsurf, VS Code, Gemini CLI, and other tools on your machine (via Keychain on macOS, or config files like `~/.claude/.credentials.json` on other platforms) — no separate API keys or OAuth flows needed. It also dynamically generates typed TypeScript clients based on each server's actual tool schema, giving the Agent type checking instead of guessing parameter names from memory.

Good fit for: Coding Agent workflows that need to hit multiple MCP servers in one batch (e.g., pulling Linear progress, Slack discussions, and log data into a single report); developers already using Claude Code or Cursor who don't want to manage a separate set of credentials just to write a script.

## Quick Start

### Installation

```bash
npm install -g agent-codemode
# also installs a shorter alias
codemode --help
```

### Basic Usage

```bash
# List all currently authenticated MCP servers
agent-codemode servers

# Show available tools for a specific server
agent-codemode tools linear

# Call a tool directly (for one-off queries, no script needed)
agent-codemode call linear listIssues --arg assignee=me --arg limit:=50
```

### Advanced Usage

```ts
// Generate type definitions first
// agent-codemode types --all

import { mcp } from "agent-codemode";

// A script the Agent writes: hits three different MCP servers in parallel,
// no model intervention needed between calls
const [issues, events, channel] = await Promise.all([
  mcp.linear.listIssues({ assignee: "me", limit: 50 }),
  mcp.axiom.queryDataset({ apl: "['prod'] | where _time > ago(24h)" }),
  mcp.slack.slackSearchChannels({ query: "general" }),
]);
```

## Comparison with Existing Approaches

| | agent-codemode | Sequential tool calls | Writing a one-off integration script |
|---|---|---|---|
| No extra API keys / OAuth (reuses Claude Code's auth) | ✅ | ✅ (built into the Agent) | ❌ (manage credentials yourself) |
| Multiple tool calls batched into one round trip | ✅ | ❌ | ✅ (but you wire it manually) |
| Type checking (dynamically generated from server schema) | ✅ | ❌ | Depends on your setup |
| Works across Claude Code / Cursor / Windsurf / VS Code / Gemini CLI | ✅ | Depends on the Agent | ❌ |
| Open source, free | ✅ MIT | — | — |

## Caveats

- **Non-macOS platforms have partial support only**: Full Keychain reading is verified on macOS only. Linux and Windows fall back to reading config files like `~/.claude/.credentials.json`, which the author explicitly labels "partial support" in the README. Run `agent-codemode servers` first to verify your servers are detected.
- **claude.ai connectors not supported**: Those connectors use a different auth mechanism — supporting them would mean emulating Claude Code itself, which the author hasn't done yet.
- **Very new project**: The GitHub repo was created on 2026-08-18, has single-digit stars, and is maintained by one person. Long-term stability and issue responsiveness remain to be seen. Before adopting in production, read through the source to confirm the credential-reading logic meets your expectations.

## Takeaway

MCP standardized "what systems an Agent can access," but it didn't solve the efficiency problem of "the model has to stop and think after every single tool call." This is actually the same direction Anthropic has been exploring with "code execution with MCP" — instead of having the model issue instructions step by step, let it write the complete logic and execute it in one shot. agent-codemode packages this pattern into a small tool that borrows your existing Agent credentials with zero extra key management — bringing it down to a single `npm install`.

## References

- [janwilmake/agent-codemode — GitHub](https://github.com/janwilmake/agent-codemode)
- [agent-codemode — npm](https://www.npmjs.com/package/agent-codemode)
