---
title: "Tool Pick｜mcptui — debug an MCP server from the terminal, no browser, no burned tokens"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "A terminal-native MCP Inspector: once your MCP server is wired up, call its tools, inspect schemas, and watch JSON-RPC traffic straight from a TUI — no config-file edits, no restarting Claude Desktop, no LLM tokens spent just to check a function runs"
tldr: "mcptui is an open-source Python TUI for testing, inspecting, and debugging MCP servers right from the terminal. Install: pip install mcptui. It solves the problem of having to edit a config file and restart an app, open the official web Inspector, or burn LLM tokens just to check whether an MCP tool works."
series:
  name: "AI Tool of the Day"
  order: 54
---

> 🌏 [中文版](/posts/daily/2026-10-14-tool-mcptui)

## Tool Info

| Field | Value |
|---|---|
| Name | mcptui |
| Type | CLI / Terminal UI (TUI) |
| GitHub | [kimarsen/mcptui](https://github.com/kimarsen/mcptui) |
| Stars | 1 (checked 2026-10-14; the repo was created on 10-13, less than a day old) |
| Language | Python |
| License | MIT |
| Install | `pip install mcptui` |

## What problem it solves

You're writing an MCP server and want to check that a tool you just added actually works. The usual path is to wire it into Claude Desktop or Cursor's config file, restart the whole app, and ask an agent in plain language to call it — if the schema is wrong or the return shape is off, you edit the config again, restart again, and ask again. Confirming that one function "runs" burns a round of LLM tokens and an app restart every time. The official MCP Inspector skips the config-file dance, but it's a browser-based web app that needs Node.js and a `localhost:5173` tab open — it doesn't fit into a terminal-only workflow.

mcptui moves that debugging loop into the terminal itself. Point it at your server command — `mcptui run "python my_server.py"`, say — and it lists every tool, resource, and prompt the server exposes, auto-generates a parameter template from each tool's `inputSchema`, and lets you fill in JSON and hit `Ctrl+Enter` to call it directly. The result comes back instantly with latency and formatted output, with no LLM in the loop at all, so nothing gets spent on tokens. It also has a live JSON-RPC 2.0 packet inspector, so you can see the raw content of every `initialize`, `tools/call`, and other request/response pair — handy for tracking down protocol-level bugs. It goes a step further and auto-discovers servers you've already configured in Claude Desktop, Cursor, and a project's `mcp.json`, so you don't have to retype the launch command.

It's a good fit for the inner test loop while building a new MCP server (change a line, call it again, check the result), manually tracking down a schema or return-format bug you suspect exists, verifying tools haven't broken in a CI pipeline via its headless CLI mode, or just looking at an unfamiliar MCP server to see what tools it actually exposes before deciding whether to wire it into your own agent.

## Quick Start

### Install

```bash
# with pip
pip install mcptui

# or with uv, no virtualenv setup needed
uvx mcptui demo
```

### Basic usage

Warm up with the built-in demo server to see what the interface looks like:

```bash
mcptui demo
```

Point it at your own MCP server:

```bash
mcptui run "python my_server.py"
```

It opens a tabbed interface (Tools / Resources / Prompts / Protocol Logs / History). Pick a tool on the left, and the right pane auto-generates a JSON parameter template; fill it in, hit `Ctrl+Enter`, and the result comes back in tens of milliseconds.

### Advanced usage

Skip the interactive UI and call a single tool from a script or CI pipeline for clean JSON output:

```bash
# register a server as a persistent config
mcptui add notes "python examples/sample_server.py"

# list every tool the server exposes
mcptui list notes

# call a tool headlessly and get the JSON result back
mcptui call convert_temperature '{"value": 100, "from_scale": "C", "to_scale": "F"}' --server notes
```

## Compared to existing approaches

| | mcptui | Official MCP Inspector | Testing manually through Claude Desktop / Cursor |
|---|---|---|---|
| Needs Node.js / a browser | ❌, terminal-only | ✅ needs both | ❌ |
| Testing burns LLM tokens | ❌ | ❌ | ✅ every call goes through an agent |
| Changing one tool means restarting the whole app | ❌ | ❌ | ✅ |
| Auto-discovers existing agent configs (Claude Desktop / Cursor / `mcp.json`) | ✅ | ❌ | — |
| Headless mode you can script into CI | ✅ (`mcptui call` / `mcptui list`) | has a CLI mode, but the main interface is still the web UI | ❌ |
| Inspect raw JSON-RPC traffic live | ✅ | ✅ | ❌ |

## Things to watch out for

- **It just launched — the ecosystem hasn't tested it yet**: the repo was created on 2026-10-13, has a single author, and one star. There's no body of real-world bug reports yet, so run it against a server you're comfortable with before trusting it on anything production-facing.
- **It complements the official MCP Inspector rather than replacing it**: mcptui's edge is a terminal-only, token-free loop, but the official Inspector keeps shipping too — v2.7.0 already folded its web/CLI/TUI clients into one binary. Both solve the same class of problem; which one fits depends on whether your workflow lives closer to the terminal or the browser.
- **Right now it only covers stdio/SSE connections to local or known-address servers**: the README doesn't mention special handling for remote MCP servers that need an extra auth flow (like OAuth), so check the source or open an issue before pointing it at one of those.

## Today's takeaway

I used to think testing an MCP server only had two options: wire it into a real agent and test it in plain language, or open the official Inspector's web UI. Seeing mcptui made it click that there's a third space in between — a pure protocol-layer debugging tool that treats an MCP server like any other API service, without routing through an LLM at all: call a tool, check its schema, inspect the packet, Postman-style. That splits "does this tool actually work" from "can the agent use this tool correctly" into two separable questions, instead of leaving them tangled together where a failure could be either one.

## References

- [kimarsen/mcptui — GitHub repo](https://github.com/kimarsen/mcptui)
- [mcptui README](https://raw.githubusercontent.com/kimarsen/mcptui/main/README.md)
- [mcptui — PyPI package](https://pypi.org/project/mcptui/)
