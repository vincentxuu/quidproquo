---
title: "Claude Code Config Not Taking Effect: Diagnosing with /context, /doctor, and /mcp, Plus a Common Errors Reference"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, debugging, dx, settings]
lang: en
tldr: "When CLAUDE.md rules are ignored, hooks never fire, or an MCP server shows no tools, the file usually didn't load, loaded from an unexpected location, or got overridden. This guide covers what each of the four diagnostic commands (/context, /memory, /doctor, /mcp) actually shows, safe-mode bisection, and a table of six high-frequency error messages with fixes."
description: "A Claude Code configuration diagnosis guide: inspect what actually loaded with /context, /memory, /doctor, and /mcp; understand the managed/local/project/user settings precedence; bisect problems with --safe-mode; and look up fixes for common runtime errors."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 35
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config)

"I put that rule in CLAUDE.md and it keeps ignoring it." "My hook is defined but nothing fires." "I added an MCP server and the tool list is empty." This family of "configured it but it's not taking effect" problems is among the most reported in Claude Code. The official diagnostics guide narrows the cause down to three possibilities: **the file never loaded, it loaded from a different location than you expected, or another file overrode it**. This post is about telling those three apart: first inspect what actually loaded with four diagnostic commands, then bisect with safe mode, then match your symptom against a table of high-frequency errors. Installation and login problems are out of scope here — see the series' [installation troubleshooting post](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en).

## The diagnostic four: what each one shows

The core principle is one sentence: don't guess — look at what Claude Code actually loaded. The first step is always `/context`, which breaks down everything occupying the current session's context window by category: system prompt, built-in tools, MCP tools, subagents (with the source each loaded from), memory files, skills, and conversation messages. If your CLAUDE.md or skill doesn't appear in that breakdown at all, the problem is "didn't load" and there is no point guessing about behavior. Once you've confirmed something loaded, drill into its category:

| Command | What it shows |
|---------|---------------|
| `/context` | Full context window breakdown by category and load source — whether a given file made it in |
| `/memory` | Memory file locations across user and project scopes, openable directly in your editor, plus the auto memory toggle |
| `/doctor` | A checkup: installation health, invalid settings files, duplicate subagent names in the same directory, unused extensions — with proposed fixes |
| `/mcp` | Every MCP server's connection status, and whether you have approved it for this project |

Two more useful helpers: `/hooks` lists every hook active in the current session, grouped by event, and `/status` shows which settings sources are in effect, including whether managed settings apply. From the terminal you can also run `claude doctor`, which prints read-only installation and settings diagnostics without starting a session — handy in scripts.

## Who overrode your setting

Settings merge across layers: managed (organization-deployed) → local (`settings.local.json`) → project (`.claude/settings.json`) → user (`~/.claude/settings.json`). Closer scopes override broader ones, and command-line flags and environment variables form yet another override layer on top. So the most common answer to "I set it but nothing happened" is not a bug — it's that the same key was also set in a closer scope.

High-frequency landmines:

- **`~/.claude.json` is not a settings file.** It holds app state and UI toggles. `permissions`, `hooks`, and `env` belong in `~/.claude/settings.json`. The two files look similar but are different things.
- **MCP server configuration does not go in settings.json.** Project-scoped servers live in `.mcp.json` at the repository root (under the `mcpServers` key — not `servers`, VS Code style); user-scoped servers are added with `claude mcp add --scope user`.
- **Project `.mcp.json` requires one-time approval.** Dismiss the approval prompt once and the server stays disabled — re-approve it from `/mcp`.
- A hook's `matcher` is a single string; separate multiple tools with `|` (as in `"Edit|Write"`). Before v2.1.191, a comma separator silently matched nothing. Tool names are case-sensitive: `bash` will not match `Bash`. And a matcher written as an array is a schema error — Claude Code rejects the entire settings file containing it, so all of that file's hooks vanish together; `/doctor` reports the validation failure.

## Safe mode: bisecting the culprit

If the targeted checks haven't isolated the layer yet, launch `claude --safe-mode`: a session with every customization disabled — CLAUDE.md, skills, plugins, hooks, MCP servers, custom commands and agents — while authentication, model selection, built-in tools, and permissions work normally.

The result is binary:

- **The problem disappears in safe mode** → the cause is one of your customizations; go back to the targeted checks above to find which.
- **The problem persists in safe mode** → narrow further to a clean environment: `cd /tmp && CLAUDE_CONFIG_DIR=/tmp/claude-clean claude`, bypassing everything under `~/.claude` and loading no project configuration. If the problem vanishes here, reintroduce your files one at a time to find the culprit; if it persists even here, the cause lies outside your user and project configuration — run `/status` to check whether managed settings apply, then look for environment variables affecting Claude Code.

Note that organization-managed hooks and settings policy still apply in safe mode; they are the only thing carried in.

## Common error messages

Beyond configuration, the other big blocker category is runtime errors. There is a full official error reference; below are six of the highest-frequency entries condensed into a table (the official page remains the authoritative list):

| Message | Cause | Fix |
|---------|-------|-----|
| `API Error: 500 Internal server error` | An unexpected API-side failure — not caused by your prompt, settings, or account | Wait a minute and resend (your message is still in the conversation; typing `try again` suffices). If it persists, check status.claude.com |
| `API Error: Repeated 529 Overloaded errors` | The API is temporarily at capacity across all users; Claude Code already retried several times before surfacing this | Try again in a few minutes; if you need to keep working, switch models with `/model` — capacity is tracked per model |
| `Prompt is too long` (shown interactively as `Context limit reached · /compact or /clear to continue`) | Conversation plus attached files exceed the model's context window | Run `/compact` to free space or `/clear` to start fresh; use `/context` to see what fills the window and `/mcp disable <name>` to drop unneeded MCP servers |
| `Unable to connect to API` (with codes like `ConnectionRefused`, `ENOTFOUND`) | TCP connection to the API failed: no internet, a VPN blocking api.anthropic.com, or an unconfigured corporate proxy | Verify from the same shell with `curl -I https://api.anthropic.com`; set `HTTPS_PROXY` if a proxy is required |
| `You've hit your session limit` (or weekly / Opus / Sonnet limit) | Your subscription plan's rolling usage allowance ran out; session and weekly limits are shared across all models | Wait for the reset time shown in the message; for Opus/Sonnet limits, switching outside that model family with `/model` keeps you working; check remaining allowance with `/usage` |
| `Not logged in · Please run /login` | No login or credentials expired | Run `/login` to re-authenticate |

One more thing worth knowing: Claude Code automatically retries transient failures up to 10 times with exponential backoff, so by the time any of these errors reaches you, every applicable retry has already happened — act on the error rather than wondering whether you should have waited longer.

## Two worked cases

Both paths have full write-ups on this site:

- [Global skills not found](/posts/tech/2026-03-27-claude-code-global-skills-not-found-en): global skills invisible in new sessions — a textbook case of the "file never loaded" branch.
- [Spinner verbs stuck](/posts/tech/2026-03-30-claude-code-spinner-verbs-en): frozen spinner verbs — the runtime-problem investigation path.

Finally, how these three posts divide the territory: can't install or log in, read the [installation & login post](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en); crashes mid-run, performance anomalies, interrupted responses, read the [runtime post](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime-en); "configured but not taking effect" is this one. For the series map and underlying mechanics, start from the [entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en).

## References

- [Debug your configuration — Claude Code Docs](https://code.claude.com/docs/en/debug-your-config) — Official guidance on diagnosing with /context, /doctor, /hooks, and /mcp, safe mode and clean-config comparison, plus the common configuration pitfalls table
- [Error reference — Claude Code Docs](https://code.claude.com/docs/en/errors) — The complete runtime error catalog: meaning and recovery steps per message, automatic retry behavior, and tunable environment variables

## Changelog

- 2026-08-26: Initial version, written against the official Debug your configuration and Error reference pages.
