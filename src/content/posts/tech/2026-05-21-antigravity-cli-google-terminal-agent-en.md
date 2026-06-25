---
title: "Antigravity CLI: How Google Folded Gemini CLI Into a Unified Terminal Agent Harness"
date: 2026-05-21
type: deep-dive
category: tech
tags: [antigravity-cli, google, cli, coding-agent, ai-tools, gemini-cli]
lang: en
tldr: "Antigravity CLI is a terminal agent Google announced at I/O on May 19, 2026. Written in Go (versus Gemini CLI's Node.js), its binary is called agy, and it shares the same agent harness as the desktop Antigravity 2.0. It is also Gemini CLI's successor — the personal-tier Gemini CLI service ends on June 18, 2026."
description: "Antigravity CLI's positioning, installation and SSH auth, async subagents, slash commands, the migration story from Gemini CLI (June 18 sunset), enterprise carveout, and how it differs from Antigravity 2.0 and competing tools."
draft: false
---

🌏 [中文版](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)

Antigravity CLI is the terminal AI agent Google announced at I/O on May 19, 2026. The story isn't just "another coding CLI" — it's a strategic move: Google folded the previously standalone Gemini CLI into "Antigravity," a four-surface platform where the terminal, desktop app, SDK, and IDE all run on **the same agent harness**. This post explains what it is, how to install it, what the migration from Gemini CLI looks like, and whether you should switch now.

## What Antigravity CLI Is

Per the official docs, Antigravity CLI is "the lightweight Terminal User Interface (TUI) surface of Antigravity," bringing the same core capabilities as the desktop Antigravity 2.0 — multi-step reasoning, multi-file editing, tool calls, conversation history — directly into the terminal. It deliberately avoids being a GUI: visual orchestration stays in 2.0, while the CLI focuses on speed, keyboard-driven operation, and low resource overhead, especially for SSH and remote workflows.

The key to understanding it is the "four surfaces" model. Before May 19, 2026, "Antigravity" referred to an IDE. After that date it became a platform, with four surfaces all sharing a single agent engine:

```
                  ┌─────────────────────────────┐
                  │   Shared Agent Harness (core) │
                  │  Reasoning loop / tool routing / permission model  │
                  └──────────────┬──────────────┘
        ┌──────────────┬─────────┴────────┬──────────────┐
        │              │                  │              │
   Antigravity 2.0  Antigravity CLI   Antigravity SDK  Antigravity IDE
   Desktop GUI      Terminal TUI (agy)  Programmatic embed  Original IDE
   Visual orchestration  Speed / SSH-first  Build your agent  (being phased out)
```

This architecture is the product's central design decision. The official CLI launch post says it plainly: "A primary goal for the Antigravity CLI was the consolidation of a single agent harness across Google-built developer surfaces for more rapid future improvements." In plain English: update the harness once, all four surfaces get it the same day — no per-surface backporting needed. Settings and permissions **sync bidirectionally** between the CLI and 2.0 — agent permissions you configure in 2.0 take effect in the CLI and vice versa; conversations started in the CLI can be pulled up in 2.0's `@conversation` dropdown and continued there.

## Why This Is an "Acquisition" and Not an "Upgrade"

Gemini CLI was no small project. Google's transition announcement acknowledges its scale: "over 100,000 GitHub stars, 6,000 merged pull requests, and hundreds of contributors." But Google's read is that user needs have shifted from "a single agent running in the terminal" to "multiple agents communicating with each other to divide and solve problems" — and that requires the terminal tool to share a backend with other surfaces.

Antigravity CLI is therefore a **parallel new product**, not a versioned update to Gemini CLI. The two most concrete differences:

- **Language changed**: Antigravity CLI is written in Go; Gemini CLI was Node.js. The official line is "Built in Go, Antigravity CLI is snappier and more responsive" — faster startup, lower memory.
- **Binary name changed**: After installation, the command is `agy`, not `antigravity`. Worth noting if you have scripts.

For personal-tier users, this migration has a deadline. The official announcement is explicit: **starting June 18, 2026**, Gemini CLI and the Gemini Code Assist IDE extension will stop serving requests for Google AI Pro, Ultra, and the free Gemini Code Assist for individuals. If you're running Gemini CLI under a personal Google account, you have roughly 30 days from the announcement date.

There is, however, a clear **enterprise carveout**: if your organization is on Gemini Code Assist Standard or Enterprise licensing, or using a paid Gemini API key, access "remains unchanged" — Gemini CLI will continue to be maintained and receive model updates. So this sunset affects consumer/personal users, not enterprise.

## Installation and Authentication (Including SSH)

The official Getting Started docs provide three one-line install commands, all pulling from `antigravity.google/cli/install.*`:

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex

# Windows CMD
curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
```

After installation, launch with `agy`. Even though these scripts come from Google's official domain, on shared machines it's still good practice to download first, review, then run.

Authentication treats remote environments as first-class. The CLI first tries silent sign-in using the OS's secure keyring; if no session is found it falls back to browser-based Google Sign-In:

- **Local machine**: automatically opens your default browser to complete Google sign-in, storing credentials in the system keyring.
- **SSH session**: the CLI detects you're in SSH and instead prints an authorization URL; you open it in a local browser, complete OAuth, then paste the authorization code back into the CLI. This was a pain point in early Gemini CLI and is now a built-in first-class experience.
- **Sign out**: `/logout` clears cached credentials.

Configuration is stored as plain JSON at `~/.gemini/antigravity-cli/settings.json`; typing `/config` or `/settings` inside the CLI opens a full-screen settings panel.

## Core Features: Async Subagents, Sandbox, and Slash Commands

**Async subagents** are the CLI's headline feature. The main agent can offload background research, build runs, or fix verification to independent subagents that run in parallel, without blocking the main conversation where you're still typing. Type `/agents` to open a panel showing which subagents are running and where they're stuck; when a subagent needs a permission grant, a Fast Path Alert appears above the prompt — press `ctrl+k` to approve it inline without switching screens.

**Terminal Sandbox** is lightweight security isolation. Rather than spinning up a VM or container, it uses OS-native mechanisms — `nsjail` on Linux, `sandbox-exec` on macOS, `AppContainer` on Windows — to limit the blast radius when an agent executes local shell commands, with near-zero startup overhead. Off by default; enable it with `"enableTerminalSandbox": true` in `settings.json`.

**Slash commands** are the main control surface. A few common ones:

| Command | Purpose |
|---|---|
| `/model` | Select the default reasoning model (persists across sessions) |
| `/permissions` | Set agent autonomy level (`request-review` / `always-proceed` / `strict`) |
| `/tasks` | Monitor, view logs, and terminate background tasks |
| `/agents` | Open the subagent panel |
| `/mcp` | Configure MCP servers |
| `/skills` | Browse local / global agent skills |
| `/resume`, `/rewind`, `/fork` | Resume, roll back, or branch a conversation |

Permissions can also be configured at fine-grained level in `settings.json` — for example, `allow: ["command(git)"]` and `deny: ["command(rm -rf)"]`.

## Migrating From Gemini CLI

On first launch, the CLI prompts you to migrate, automatically converting Gemini CLI extensions to Antigravity plugins. If that prompt doesn't appear or you're setting up on a different machine, run it manually:

```bash
agy plugin import gemini
```

A few things to watch out for:

- **Extensions are now called plugins**: The official reason is "the industry has standardized on the term."
- **Commands have been folded into skills**: The old "commands" concept is subsumed into the broader skills primitive.
- **MCP config file location changed**: Antigravity separates MCP server configuration into its own `mcp_config.json` instead of embedding it in `settings.json`. Additionally, the remote MCP server field changed from `url` to `serverUrl` — copying your old config verbatim will cause remote servers to **silently fail**.
- **Custom themes don't migrate** and there is **no `skills` terminal management command** (you write skill files manually or use `npx skills install`).

Google is also upfront that this won't be a complete handoff: "there won't be 1:1 feature parity right out of the gate," but commits to preserving the most critical things — Agent Skills, Hooks, Subagents, and Extensions (now plugins).

## Positioning vs. Antigravity 2.0 and Competitors

Compared to its sibling **Antigravity 2.0**: same engine, different ergonomics. The CLI is built for speed, keyboard efficiency, and low overhead — SSH, remote servers, tmux. The 2.0 desktop app is built for completeness: visual orchestration, artifact previews, visual diff review, and voice input. You can use them together; conversations opened in the CLI can be exported into 2.0.

Compared to **Claude Code, Codex CLI, and Gemini CLI**, Antigravity CLI's differentiation isn't in "can it read and write files or run commands" — all of them can. The distinction is that it's one surface of a larger platform: shared harness with the desktop app, bidirectional settings sync, native async subagents, and SSH as a design target rather than an afterthought. For a full side-by-side on installation and pricing, the site also has in-depth coverage of [Gemini CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent), [Codex CLI](/posts/tech/2026-03-31-codex-cli-openai-coding-agent), and [Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent).

On models: the CLI runs on a shared harness "co-optimized" with Gemini models; the default reasoning model can be switched with `/model`, and the underlying engine is a specialized configuration of the Gemini 3 series. The official CLI docs do not enumerate the available models individually.

## Limitations and Known Issues

- **Not 1:1 feature parity**: If you rely on a specific Gemini CLI peripheral command, verify it's been ported before migrating.
- **Security responsibility is yours**: The official repo README includes this warning: "AI coding agents are known to have certain security risks, including autonomous code execution, data exfiltration, prompt injection, and supply chain risks. Ensure that you monitor and verify all actions taken by the agent." Consumer defaults collect interaction data; this can be disabled in settings.
- **Early-stage stability**: Around launch, the broader Antigravity platform (including the IDE) saw community reports of quota locks and crashes. The CLI is also early — worth testing at small scale before committing to it fully.

## Bottom Line

Antigravity CLI makes a clear tradeoff: in exchange for speed and consistency through a "four surfaces, one harness" architecture, you're tied into the Antigravity platform — this isn't a standalone, Apache-licensed open-source CLI like Gemini CLI was.

Should you switch? The answer is fairly clean:

- **Switch now**: You're running Gemini CLI under a personal Google account (AI Pro / Ultra / free Code Assist) — the June 18 deadline is real; you live in tmux or on remote servers; you want background subagents that don't block your shell.
- **Hold off**: You're on Code Assist Standard / Enterprise or a paid API key (Gemini CLI keeps running); your workflow depends on artifact previews, visual diff, or voice (those are 2.0 features); you depend on a specific Gemini CLI feature that hasn't been ported yet.

The most efficient way to evaluate: install `agy` on the machine where you use Gemini CLI most, run `agy plugin import gemini`, then pick a task that would normally take you 20 minutes and try it. One session will tell you whether the migration is smooth.

## References

- [Introducing Google Antigravity CLI (official announcement)](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [Antigravity CLI Overview (official docs)](https://antigravity.google/docs/cli-overview)
- [Getting Started with Antigravity CLI (installation / auth)](https://antigravity.google/docs/cli-getting-started)
- [Antigravity CLI Features (plugins / sandbox / subagents / slash commands)](https://antigravity.google/docs/cli-features)
- [Using AGY CLI (settings / keybindings)](https://antigravity.google/docs/cli-using)
- [An important update: Transitioning Gemini CLI to Antigravity CLI (Google Developers Blog)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Google Antigravity Documentation (four-surface overview)](https://antigravity.google/docs/home)
- [google-antigravity/antigravity-cli (public repo / community forum)](https://github.com/google-antigravity/antigravity-cli)
- [Gemini CLI: Complete Guide to Google's Open-Source Terminal AI Agent (on this site)](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)
- [Codex CLI: Complete Guide to OpenAI's Open-Source Terminal Coding Agent (on this site)](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)
- [Claude Code: Complete Guide to Anthropic's Terminal AI Coding Agent (on this site)](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent)
