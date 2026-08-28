---
title: "How Claude Code connects to external tools: MCP scopes, transports, and auth"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, mcp, mcp-server, integration]
lang: en
tldr: "Claude Code connects to external tools via MCP (Model Context Protocol), with manual configuration split across three scopes: team-shared .mcp.json, personal local/user entries in ~/.claude.json, and enterprise managed config — not settings.json. This post covers claude mcp add/login flows, the transport landscape (SSE is deprecated), and tool search lazy loading."
description: "A complete guide to MCP server configuration in Claude Code: choosing between local/project/user scopes, stdio vs HTTP transports, OAuth authentication with claude mcp login, tool search deferral, and debugging with /mcp."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 14
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration)

Earlier posts in this series covered Claude Code's built-in toolset (see the [series entrance](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en)), but built-in tools only reach your filesystem and terminal. When you catch yourself pasting text from an issue tracker into the conversation or transcribing numbers from a monitoring dashboard, that's the signal to connect an MCP server. As [the official docs put it](https://code.claude.com/docs/en/mcp): once connected, Claude can read and act on that system directly instead of working from what you paste.

## What problem MCP solves

[MCP](https://code.claude.com/docs/en/mcp) is an open standard for AI-tool integrations: servers expose a set of tool definitions, and clients — here, Claude Code — merge those tools into their own toolset. To be precise about the increment: without MCP you can still have Claude run `gh` commands against GitHub or query a database with psql — the shell was always there. What MCP adds is **structure**: tools carry schemas, types, and names you can reference in permission rules and hook matchers, and the same server can be reused by Claude Desktop, Cursor, and other clients instead of each integration being rewritten per vendor.

## Choosing between the three scopes

First, the most common trap: **MCP server configuration does not live in settings.json**. settings.json governs permissions and hooks (see the [settings.json guide](/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide-en)); MCP servers live in three separate places:

| Scope | Loads in | Shared with team | Stored in |
|-------|----------|------------------|-----------|
| Local (default) | Current project only, private to you | No | `~/.claude.json`, under that project's entry |
| Project | Current project | Yes, via version control | `.mcp.json` in project root |
| User | All your projects | No | `~/.claude.json`, top-level `mcpServers` |

The decision logic is straightforward: personal tools carrying API keys that shouldn't enter version control go in **local** scope; servers the whole team needs (GitHub, Sentry) go in **project** scope by committing `.mcp.json`; utilities you use across projects (Notion, say) go in **user** scope. Within these three manual scopes, same-named servers resolve as local > project > user, taking the entire entry from the winning source without merging fields; plugin servers and claude.ai connectors come after them.

Organizations have a fourth path: managed configuration, where administrators deploy a fixed server set via `managed-mcp.json` and restrict what users can connect with an allowlist/denylist.

Project scope has a security design worth knowing: when you clone someone's repository, its `.mcp.json` servers don't start automatically — you get an approval prompt on first use. Otherwise any repo could launch processes on your machine. Since v2.1.196 this goes further: in an untrusted workspace, even approvals committed into the repo don't count; you must run `claude` locally and accept the workspace trust dialog.

## Adding servers and authenticating

Adding a server is one line:

```bash
# Remote HTTP server (Notion)
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Local stdio server (Playwright); everything after -- is the command to run
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

The `--` separator is what newcomers most often miss: arguments after it pass through untouched to the server; without it, flags like `--port` get eaten as Claude Code's own options. `.mcp.json` supports `${VAR}` and `${VAR:-default}` expansion, so team-shared configs can keep keys in each person's environment variables.

Hosted services requiring sign-in (Sentry, Linear, and similar) use OAuth: after adding, `claude mcp list` shows `! Needs authentication` — open a session, run `/mcp`, choose Authenticate, and complete the browser login. If you'd rather not open a session, since v2.1.186 `claude mcp login sentry` runs the whole OAuth flow from your shell; over SSH it detects the missing browser and prints the URL for you to paste back. Services preferring static tokens take one at add time via `--header "Authorization: Bearer <token>"`.

## The transport landscape

Four transports — confirm which one you need before writing config:

- **HTTP**: the recommended option for remote servers, with the widest support among cloud services.
- **stdio**: local processes, for tools needing direct filesystem or browser access.
- **WebSocket**: suits servers that push events unprompted, but `claude mcp add --transport` doesn't accept `ws` — write JSON directly or use `add-json`.
- **SSE**: **deprecated**. A few services still expose only SSE endpoints; prefer HTTP wherever available.

When you hold config written for another client (Claude Desktop, for instance), classify by shape: a URL means remote, a launch command means stdio, and an `mcpServers` JSON block goes through `claude mcp add-json` — note you pass the object inside, not the wrapper, and an entry with `url` but no `type` needs `"type": "http"`, `"sse"`, or `"ws"` added. Current Claude Code treats this as a configuration error and skips that server instead of guessing for you.

## Large toolsets lean on tool search

Every MCP server's tool names and descriptions occupy the context window; connect a dozen servers and tool definitions alone consume a noticeable share. Tool search is the current answer, enabled by default: at session start only tool names and server instructions load; full definitions are deferred until Claude actually searches for and calls them. The docs state there's no fixed per-server tool cap — the practical limit is your context budget.

Behavior is tunable via `ENABLE_TOOL_SEARCH`: `auto:N` sets a threshold (defer once definitions exceed N% of context), `false` returns to loading everything upfront. A side effect: server instructions matter more now — they're how Claude decides when to search for that toolset, each truncated at 2KB, so put critical details first.

## Debugging: the /mcp panel

The debug entry point is `/mcp` inside a session: connection status and tool count next to each server, plus reconnect, re-authenticate, and disable-without-deleting actions. From the shell, `claude mcp list` also reports health status, appending the HTTP status code and server-returned error text on failure. Common symptoms:

- Startup timeout: `npx` downloading a package for the first time is slow; `MCP_TIMEOUT=60000 claude` widens it to sixty seconds.
- Server connects but exposes no tools: usually a missing environment variable — add it with `--env KEY=value` or the `env` field in `.mcp.json`.
- Changes to `.mcp.json` not taking effect: it's read at session startup, so restart; if you previously rejected a server, run `claude mcp reset-project-choices`.
- If all you see is `✘ Failed to connect`: current `claude mcp list` / `claude mcp get <name>` output includes the HTTP status or server-returned error text; headless `stream-json` runs can also detect skipped `--mcp-config` entries via `system/init.mcp_server_errors`.
- Tool output warns past 10,000 tokens and truncates at a 25,000-token cap; raise it with `MAX_MCP_OUTPUT_TOKENS`.

## Takeaways

Unpacked, MCP configuration comes down to two decisions: **scope determines who sees the toolset** (`.mcp.json` for the team, `~/.claude.json` for yourself, managed config for the organization) and **transport determines how to connect** (remote HTTP, local stdio, and stop using SSE for new setups). Everything else is process — add, login, check status with `/mcp`. Like the other config files in the [.claude directory tour](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en), once you know which thing lives in which file, debugging is just opening the right checkpoint.

## References

- [Connect Claude Code to tools via MCP — Claude Code Docs](https://code.claude.com/docs/en/mcp) — Complete official reference covering the three scopes, four transports, OAuth and `claude mcp login`, tool search, and server status detail
- [Connect to MCP servers (quickstart) — Claude Code Docs](https://code.claude.com/docs/en/mcp-quickstart.md) — Step-by-step from add to verifying the connection, including the on-disk config table and troubleshooting checklist

## Changelog

- 2026-08-26: Initial version based on the August 2026 official docs (SSE transport deprecated, tool search on by default, `claude mcp login` available since v2.1.186).
- 2026-08-29: Refreshed against the 2026-08-27 official MCP docs for precedence, URL entries without `type`, server status detail, and `stream-json` debugging.
