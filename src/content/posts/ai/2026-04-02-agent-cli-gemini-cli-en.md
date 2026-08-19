---
title: "Google's Terminal Agent, Reassessed: Gemini CLI Is Gone, Antigravity CLI Took Over"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, gemini-cli, google, pricing, terminal-agent, antigravity]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 7
tldr: "Gemini CLI stopped serving individual accounts on 2026/06/18. Its successor is Antigravity CLI (rewritten in Go, sharing the server-side harness with Antigravity 2.0). Gemini CLI itself isn't dead, but only two paths remain: a Gemini Code Assist Standard/Enterprise license, or a paid API key."
description: "Where Google's terminal agent stands now: what Antigravity CLI is, the Gemini CLI paths that survive for enterprise and API-key users, how to migrate, and the lessons this transition left behind."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-02-agent-cli-gemini-cli)

If you're picking a Google terminal agent based on articles from the first half of 2026, that information no longer applies. Gemini CLI's free tier — 1,000 requests a day, Gemini 2.5 Pro, a 1M-token context window, all for the price of a Google login — **stopped serving individual accounts on June 18, 2026**.

This post covers where things actually stand: what Google fields in the terminal now, which paths still work, and how to migrate.

## The product is now Antigravity CLI

On May 19, 2026, Google announced it was moving its terminal experience from Gemini CLI to **Antigravity CLI**, consolidating effort behind a single agent-first development platform rather than maintaining two CLIs and a set of IDE extensions.

What actually differs:

| Aspect | Detail |
|--------|--------|
| **Implementation** | Rewritten in Go (Gemini CLI was TypeScript) |
| **Architecture** | Shares one server-side harness with the Antigravity 2.0 desktop app |
| **Async workflows** | Supports long-running background tasks — the headline differentiator |
| **Carried over** | Agent Skills, Hooks, Subagents; Extensions renamed to Antigravity plugins |
| **Openness** | Not an Apache-2.0 open source project the way Gemini CLI was — the loudest community complaint |

Google explicitly said there would be **no 1:1 feature parity** at launch. Some Gemini CLI capabilities did not make the crossing, and the complaints under the announcement thread cluster around two things: shrunken usage quotas (users reporting they hit weekly limits within a few requests), and a replacement that is no longer open source.

Installation:

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex
```

## What's left of Gemini CLI

The project wasn't shut down. The repo is still maintained under Apache-2.0, and Google says it will keep pace with new models and ship bug and security fixes — but **only enterprise customers are served**.

| Path | Still works | Notes |
|------|-------------|-------|
| Free Google account (Gemini Code Assist for Individuals) | ❌ Ended 2026/06/18 | The individual free tier is gone |
| Google AI Pro / Ultra subscription | ❌ Ended the same day | Now served through Antigravity CLI |
| Gemini Code Assist Standard / Enterprise license | ✅ Unaffected | Organizations via license or Google Cloud |
| Paid Gemini / Gemini Enterprise Agent Platform API key | ✅ Unaffected | Billed per token |
| Gemini Code Assist for GitHub | ❌ Individual tier ended | No new installs from 6/18, full shutdown 7/17; enterprise unaffected |

In short: **individual developers have no free path left**. Either move to Antigravity CLI, or bring a paid API key and keep running Gemini CLI.

## Migrating from Gemini CLI

Antigravity CLI detects your local Gemini CLI directory during installation and carries configuration across:

- **Skills** — custom and installed skills are imported automatically
- **MCP Servers** — all configured servers are migrated
- **Agents** — existing agent profiles and setups are preserved
- **Project memory** — fully compatible with existing `gemini.md` files

Extensions need one manual step:

```bash
agy plugin import gemini
```

MCP configuration moved: the file goes from `settings.json` to `mcp_config.json`, and the remote-server field is renamed from `url` to `serverUrl`.

## Two lessons from this transition

**A free tier is not a moat; it's a marketing budget.** Gemini CLI's free tier was the most aggressive this category has seen — Google analyzed internal developer usage and set the ceiling at twice what its heaviest engineers consumed, effectively declaring that most people would never hit a paywall. It lasted about a year. Choosing a tool primarily for its free tier stakes your toolchain on somebody else's marketing decision.

**Open source doesn't mean it can't be taken away.** Gemini CLI is Apache-2.0 and the repo is still there, and none of that helped individual users — because the valuable part was never the source, it was the free inference behind it. A license governs the code, not who is allowed to call the endpoint.

## Who this fits

- **Teams with an existing Gemini Code Assist enterprise license** — Gemini CLI remains a supported path; no need to rush
- **Developers already in the Antigravity ecosystem** — Antigravity CLI is the official line, with async background tasks as the current draw
- **Individuals who just want a free terminal agent** — this door is closed at Google; see the other posts in this series

If you want depth of reasoning, Claude Code is still the better pick; if you want no vendor lock-in, OpenCode's multi-provider architecture fits better.

## References

- [Google Developers Blog: Transitioning Gemini CLI to Antigravity CLI (official announcement)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017: official shutdown notice (2026/06/18)](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Gemini CLI Discussion #27274: transition announcement and community discussion](https://github.com/google-gemini/gemini-cli/discussions/27274)
- [Google Antigravity Blog: Introducing Google Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [Gemini CLI | GitHub](https://github.com/google-gemini/gemini-cli)
- [The Register: Bye-bye, Gemini CLI; Google nudges devs toward Antigravity](https://www.theregister.com/ai-ml/2026/05/20/bye-bye-gemini-cli-google-nudges-devs-toward-antigravity/5243605)

## Changelog

- 2026-08-18: The shutdown has happened; full rewrite. Removed the now-defunct free tier, authentication, and paid plan tables in favor of Antigravity CLI's positioning, a table of surviving Gemini CLI paths, migration steps, and two lessons from the transition. Title and tldr updated accordingly
- 2026-05-21: Added the Gemini CLI discontinuation notice (2026/06/18) and the Antigravity CLI migration section; updated tldr, tags, and references
