---
title: "Tool of the Day | AgentConfig Doctor — Catch Leaked Keys, Dangerous Commands and Over-Broad Permissions in Agent Config Before You Commit"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "A local CLI that scans Claude Code, Cursor and VS Code MCP and permission configs for leaked keys, curl | sh style commands, whole-filesystem access and MCP servers added since a baseline"
tldr: "AgentConfig Doctor is a static scanner for agent configuration. Install: from source for now with `npm ci && npm run build` (not yet on npm). It solves the problem that files like `.mcp.json` and `.claude/settings.json` go unreviewed, and you can't tell when they've been changed."
series:
  name: "AI Tool of the Day"
  order: 55
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-tool-agentconfig-doctor)

## Tool Info

| Item | Value |
|---|---|
| Name | AgentConfig Doctor |
| Type | CLI (config security scanner) |
| GitHub | [vasikmansuri/agentconfig-doctor](https://github.com/vasikmansuri/agentconfig-doctor) |
| Stars | 3 (created 2026-10-14) |
| Language | TypeScript |
| License | MIT |
| Install | `git clone`, then `npm ci && npm run build` (`npx agentconfig-doctor scan` once published to npm) |

## What Problem It Solves

A project's `.mcp.json`, `.claude/settings.json` and `.cursor/mcp.json` decide which MCP servers a coding agent can start, which commands it can run and which directories it can touch. These files are often committed with the repo, yet rarely get a careful look in code review. Today's [Visual Studio Copilot security alert](/posts/daily/2026-10-15-security-visual-studio-copilot-trailing-dot-rce-en) is a case in point: a hijacked agent that can edit `.mcp.json` can give itself a server that runs arbitrary commands.

AgentConfig Doctor scans these files statically. Eleven rules look for leaked keys (GitHub, AWS, Anthropic, OpenAI and other formats), download-and-execute commands, arguments granting the whole filesystem or `~/.ssh`, unpinned `npx` packages, risky combinations such as `enableAllProjectMcpServers` alongside local servers, and hidden bidirectional Unicode characters. It needs no AI API and no account, sends no telemetry, and never executes the commands it inspects.

The most useful piece is the baseline: save today's accepted state, and later scans fail only on new findings while listing permission changes — new allow rules, added MCP servers or hooks. It fits in PR CI, and it's a good first pass when you inherit someone else's repo.

## Quick Start

### Install

```bash
# Requires Node.js 22.12+; not yet on npm, so build from source
git clone https://github.com/vasikmansuri/agentconfig-doctor.git
cd agentconfig-doctor
npm ci
npm run build
```

### Basic usage

```bash
node dist/cli.js scan /path/to/your/project              # scan a whole project
node dist/cli.js scan ./my-project --fail-on medium      # non-zero exit at medium or above
node dist/cli.js check-mcp ./my-project/.cursor/mcp.json # validate MCP config only
node dist/cli.js scan ./my-project --format json --output report.json
node dist/cli.js rules                                   # list every rule
```

### Advanced usage

```bash
# Create a baseline; later scans only flag new findings and permission changes (ACD009)
node dist/cli.js baseline create
git add .agentconfig-doctor-baseline.json
node dist/cli.js scan --baseline .agentconfig-doctor-baseline.json
```

The README also includes a GitHub Actions example that needs only `contents: read` and no secrets, usable as-is once the npm package ships.

## Comparison With Existing Tools

| | AgentConfig Doctor | Generic secret scanners (gitleaks etc.) | Manual code review |
|---|---|---|---|
| Finds leaked keys | ✅ | ✅ | Depends on the reviewer |
| Understands MCP/agent config structure (servers, hooks, allow rules) | ✅ | ❌ | Depends on the reviewer |
| Flags risky combinations (e.g. auto-enabling all project MCP servers) | ✅ | ❌ | Easy to miss |
| Compares permissions against a baseline | ✅ | ❌ | ❌ |
| Never executes scanned content, safe on fork PRs | ✅ | ✅ | — |

## Caveats

- **Very new**: created 2026-10-14, 3 stars, a 0.1.0 pre-release not yet on npm. Use it as an extra check, not your only line of defense.
- **Static, textual rules**: the author notes false positives (e.g. docs quoting a `curl | sh` installer) and that obfuscated commands, scripts referenced by path and package contents aren't analyzed. A clean scan is not a safety guarantee.
- **Limited coverage**: only Claude Code, Cursor and VS Code config plus `CLAUDE.md`/`AGENTS.md`. Visual Studio's `settings.VisualStudio.json` isn't supported, and home-directory config is scanned only when you pass its path.

## Today's Takeaway

I assumed the main risk in agent config files was leaked keys. The rule table shows the more common problem is combinations: settings that each look reasonable alone, but together let local servers start without approval. Secret scanners can't see that; it takes a tool or a person who understands agent config structure.

## References

- [AgentConfig Doctor (vasikmansuri/agentconfig-doctor) — GitHub](https://github.com/vasikmansuri/agentconfig-doctor)
- [Security Alert | One Trailing Dot Let Copilot in Visual Studio and SSMS Rewrite Its Own Settings](/posts/daily/2026-10-15-security-visual-studio-copilot-trailing-dot-rce-en)
- [Claude Code settings — Anthropic Docs](https://code.claude.com/docs/en/settings)
