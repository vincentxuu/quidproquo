---
title: "Tool Pick | mcp-anything — One MCP Server to Search All 75,000 MCP Servers"
date: 2026-08-23
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A meta-MCP gateway that indexes MCP servers from four registries (official, PulseMCP, npm, Glama) into a local BM25 search, exposing just 5 meta-tools so agents can discover, inspect, and invoke any MCP server without context cost scaling with the ecosystem"
tldr: "mcp-anything is a meta-MCP server that indexes 75,000 MCP servers from public registries to your local machine, letting agents discover and call any server through 5 fixed meta-tools (search/describe/list_tools/call_tool/sync). Install: `npx mcp-anything sync && npx mcp-anything serve`. Solves the problem of too many MCP servers to manually configure, each one burning context tokens."
series:
  name: "AI Tool of the Day"
  order: 8
---

> 🌏 [中文版](/posts/daily/2026-08-23-tool-mcp-anything)

## Tool Info

| Field | Value |
|---|---|
| Name | mcp-anything |
| Type | MCP server (meta-MCP gateway) |
| GitHub | [Dror-Bengal/mcp-anything](https://github.com/Dror-Bengal/mcp-anything) (created 2026-08-21) |
| Stars | 0 (just published, single contributor) |
| Language | TypeScript |
| License | MIT |
| Install | `npx mcp-anything sync && npx mcp-anything serve` |

## The Problem It Solves

You've probably been here: you want an MCP server that can query Postgres, but you don't know where to look. You end up keyword-searching, scrolling through awesome-lists, or asking around. Even when you find one, you still have to paste its config into your host's settings file, restart, and verify the connection — repeating this ritual every time you add a new tool. Worse, every MCP server you configure permanently loads its tool schemas into every conversation's context; by the time you have ten servers with a dozen tools each, you're burning thousands of tokens before saying a word. This is why most people stop at a handful of MCP servers — not because they don't want more capabilities, but because context is expensive.

mcp-anything flips this model: you configure **one** MCP server in your host, and it syncs four registries behind the scenes — the official MCP registry, PulseMCP (~22K), npm (~67K packages tagged `mcp`), and Glama (~75K indexed) — deduplicating across sources (the same server might appear as `io.github.acme/weather`, `pulse/weather-mcp`, and `npm/@acme/weather-mcp`), merging star counts and download numbers for popularity ranking, and building a local BM25 full-text index. The agent sees exactly 5 fixed meta-tools: `search_mcp_servers` to search, `describe_mcp_server` to inspect transport/required env vars/security assessment, `list_mcp_tools` to live-connect and list actual tool schemas, `call_mcp_tool` to execute, and `sync_registry` to refresh the index. No matter how large the ecosystem grows, the context footprint stays constant at these 5 tool definitions.

Best for: MCP hosts (Claude Code, Claude Desktop, Cursor) where you want the agent to discover and connect new tools on its own instead of manual configuration every time; or when you want to explore whether an existing MCP server can handle a task before committing to a formal install.

## Quick Start

### Installation

```bash
# Requires Node >= 20
npx mcp-anything sync     # First-time index download, takes a few seconds
npx mcp-anything serve    # Start the meta-MCP server on stdio
```

Add to Claude Code:

```bash
claude mcp add anything -- npx -y mcp-anything serve
```

### Basic Usage

Once installed, just ask the model in natural language — it will invoke the meta-tools on its own:

```
You: Find me an MCP server that can query Postgres and list its tools

What the agent does behind the scenes:
1. search_mcp_servers("postgres")     → gets candidate list (with connectivity assessment)
2. describe_mcp_server(selected one)  → checks transport, required env vars
3. list_mcp_tools(same server)        → live-connects, lists actual tool schemas
```

### Advanced Usage (CLI directly, without going through an agent)

```bash
mcp-anything sync             # Manually refresh registry index
mcp-anything search "weather" # Search the index directly from terminal
mcp-anything serve --http --discovery-only   # Expose search as a service, but disable execution (avoid becoming an open proxy)
```

## Comparison with Existing Tools

In the launch post, the author explicitly compared three similar but distinct approaches: MetaMCP-style gateways aggregate servers you've **already configured**, Composio's Rube routes to their own hosted catalog, and native tool search built into hosts only searches tools **already connected**. mcp-anything's differentiator is indexing the entire public registry ecosystem, local-first, open-source, with private registry support:

| | mcp-anything | Manual per-server config | MetaMCP-style gateway |
|---|---|---|---|
| Searches entire public MCP ecosystem (75K) | Yes | No | No (only aggregates configured ones) |
| Fixed context cost (5 meta-tools) | Yes | No (each install adds more) | Depends on aggregated server count |
| Local-first, open-source, self-hostable | Yes (MIT) | — | Some are hosted |
| Built-in SSRF guard / stdio execution off by default | Yes | Up to you | Varies |

## Caveats

- **Just published, 0 stars, single contributor**: Created 2026-08-21, long-term maintenance unknown. Treat as proof-of-concept — don't plug it into production workflows.
- **stdio server spawning is off by default**: Executing arbitrary packages from a public registry on your machine is essentially RCE risk. `call_mcp_tool` is disabled for stdio-type servers by default; you must explicitly whitelist specific packages with pinned versions to enable it.
- **Use `--discovery-only` when self-hosting publicly**: The author states explicitly that an instance with `call_mcp_tool` enabled is effectively an open proxy anyone can use. The official Dockerfile defaults to discovery-only mode.
- **Treat all downstream server responses as untrusted third-party data**: The README acknowledges this only "reduces" prompt injection risk rather than solving it; the security model is still evolving.

## Takeaway

Most MCP aggregation tools solve "how do I manage the servers I've already installed." mcp-anything solves the step before that — "I don't even know which one to install" — by handing the discovery task back to the agent through 5 fixed-cost meta-tools. But it honestly acknowledges the tradeoff: connecting an LLM to a public registry that anyone can upload to fundamentally expands the attack surface from "the handful of servers you manually vetted" to "the entire ecosystem." The real value proposition of tools like this isn't the search algorithm — it's the security layer: the SSRF guard, the stdio whitelist, and the "untrusted output" tagging that together form the safety strategy.

## References

- [Dror-Bengal/mcp-anything — GitHub](https://github.com/Dror-Bengal/mcp-anything): Project overview, architecture diagram, quickstart commands, meta-tools list, security model, and license (MIT) from the official README.
- [MCP has a discovery problem. I built a meta-server that searches all 75,000 servers. — DEV Community](https://dev.to/dror_bengal_4d4388774752d/mcp-has-a-discovery-problem-i-built-a-meta-server-that-searches-all-75000-servers-30gm): Author's launch post covering index scale by source, design tradeoffs (BM25 over embeddings), and positioning vs MetaMCP / Composio Rube / native tool search.
- [MCP Official Registry](https://registry.modelcontextprotocol.io): One of the four sources mcp-anything indexes.
