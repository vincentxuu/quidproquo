---
title: "Antigravity CLI: Google's Terminal AI Agent, Explained (Gemini CLI's Successor)"
date: 2026-03-31
type: project
category: tech
tags: [gemini, google, ai-tools, cli, coding-agent, antigravity]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 6
tldr: "Google's terminal agent is now Antigravity CLI: written in Go, sharing a server-side harness with the Antigravity 2.0 desktop app, with async background workflows. Agent Skills, Hooks, and Subagents carry over; Extensions become plugins. Its predecessor Gemini CLI stopped serving individual accounts on 2026/06/18 — the repo stays Apache-2.0 but only serves enterprise licenses and paid API keys."
description: "Installing Antigravity CLI, what it does, how it relates to Gemini CLI and how to migrate, plus the Gemini CLI paths that still work."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)

Google's product in the terminal is **Antigravity CLI**. It replaced Gemini CLI — the open source terminal agent that once handed out 1,000 free requests a day — which stopped serving all individual accounts on June 18, 2026.

This post covers what to install now, what it does, and which Gemini CLI paths survive.

## Installation

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex
```

The installer detects a local Gemini CLI directory and carries over skills, MCP server configuration, and agent profiles.

Unlike Gemini CLI, Antigravity CLI is **not an Apache-2.0 open source project**. That is the community's loudest objection to the transition.

## Core features

| Feature | Notes |
|---|---|
| Agent Skills | Carried over from Gemini CLI; global skills import automatically |
| Hooks | Same behavior, no reconfiguration needed |
| Subagents | Parallel agent capability retained |
| Plugins | Formerly Gemini CLI Extensions; needs one import command |
| MCP support | Configuration moved to a standalone `mcp_config.json` |
| Async background workflows | The headline differentiator — long tasks run in the background |
| Project memory | Fully compatible with existing `gemini.md` files |

The structural change is that it **shares one server-side harness with the Antigravity 2.0 desktop app** — the CLI is no longer a standalone implementation but a terminal surface onto the same agent platform. That's Google's stated reason for the move: one agent-first platform instead of two CLIs plus IDE extensions.

Google explicitly said there was **no 1:1 feature parity** at the transition; some Gemini CLI capabilities did not make the crossing.

## Migrating from Gemini CLI

Most settings transfer automatically. Extensions need one manual step:

```bash
agy plugin import gemini
```

MCP configuration moved location and field names:

| | Gemini CLI | Antigravity CLI |
|---|---|---|
| Config file | `mcpServers` inside `settings.json` | standalone `mcp_config.json` |
| Global path | `~/.gemini/settings.json` | `~/.gemini/antigravity-cli/mcp_config.json` |
| Workspace path | `.gemini/settings.json` | `.agents/mcp_config.json` |
| Remote server field | `url` | `serverUrl` |

## What's left of Gemini CLI

The project wasn't shut down — the [repo](https://github.com/google-gemini/gemini-cli) is still maintained under Apache-2.0, and Google committed to keeping pace with new models and security fixes — but it only serves enterprise:

- ✅ **Still works**: Gemini Code Assist Standard / Enterprise licenses, access through Google Cloud, paid Gemini or Gemini Enterprise Agent Platform API keys
- ❌ **Ended**: the individual free tier (Gemini Code Assist for Individuals), Google AI Pro / Ultra subscriptions, individual Gemini Code Assist for GitHub (no new installs from 6/18, full shutdown 7/17)

Individual developers have no free path left.

## Typical use cases

1. **Fix a bug and run the tests** — describe the problem; the agent locates it, fixes it, and verifies by running tests
2. **Long tasks in the background** — async workflows are this generation's main draw, suited to large refactors or batch work
3. **Understanding a codebase** — Gemini's long context handles reading many files at once to answer questions
4. **Cross-language translation** — rewriting a Python module in TypeScript

## How it compares

Antigravity CLI's advantages are its integration with the Antigravity desktop platform and async background agents. The cost is losing both of the Gemini CLI era's selling points: being open source, and that nearly unlimited free tier.

For depth of reasoning, see Claude Code; for freedom from vendor lock-in, see OpenCode.

## References

- [Google Antigravity Blog: Introducing Google Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [Google Developers Blog: Transitioning Gemini CLI to Antigravity CLI (official announcement)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017: shutdown notice and install commands (2026/06/18)](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Gemini CLI GitHub: google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- [Google announcement: introducing Gemini CLI, an open source AI agent](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/)

## Changelog

- 2026-08-18: The shutdown has happened; rewritten as an Antigravity CLI introduction. Removed the defunct free tier table and the Gemini 3 Pro section in favor of Antigravity CLI installation and features, a migration mapping table, and the surviving Gemini CLI paths; corrected the install URL (official is `antigravity.google/cli/install.sh`, previously written as `antigravity.google/install.sh`); title and tldr updated
- 2026-05-21: Added the Gemini CLI discontinuation notice (2026/06/18) and Antigravity CLI migration guidance; updated tldr, tags, and references
