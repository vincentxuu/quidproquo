---
title: "Claude Code: A Complete Guide to Anthropic's Terminal AI Coding Agent"
date: 2026-03-31
type: guide
category: tech
tags: [claude-code, anthropic, ai-tools, cli, coding-agent]
lang: en
tldr: "Claude Code is Anthropic's agentic coding tool that runs in the terminal, IDEs, Slack, GitHub, and on the web. Its core extension system has six layers: CLAUDE.md (persistent context), Skills (on-demand workflows), Hooks (deterministic automation), Subagents (isolated delegation), MCP (external tool connections), and Agent Teams (multi-agent collaboration)."
description: "How to install Claude Code, its core capabilities, the six-layer extension system, runtime environments, pricing, how it compares to other AI coding agents, and an index of in-depth guides on this site."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent)

Claude Code is Anthropic's agentic coding tool. It understands your codebase, executes everyday tasks through natural language instructions, explains complex code, and handles git workflows — all from your terminal, IDE (VS Code / JetBrains), Slack, GitHub, or the web.

## Installation

```bash
# Recommended (macOS / Linux)
curl -fsSL https://claude.ai/install.sh | bash

# Windows
winget install Anthropic.ClaudeCode
```

The npm installation method is now deprecated — use the native installer instead. After installation, sign in with your Claude account and you're ready to go.

**System requirements:** macOS 13.0+ / Windows 10+ / major Linux distributions.

## Core Capabilities

| Capability | Description |
|---|---|
| Code read/write | Read, edit, and create files; understands entire project structure |
| Shell execution | Run arbitrary commands in the terminal (build, test, lint, etc.) |
| Git workflows | commit, branch, PR, merge — all via natural language |
| Extended Thinking | Enabled by default; reasons through complex problems before acting |
| Auto Mode | A safe alternative to `--dangerously-skip-permissions` for long-running autonomous tasks |
| Headless Mode | `claude -p` for programmatic execution; embeds into CI/CD pipelines or scripts |

## The Six-Layer Extension System

Claude Code's extension system is what sets it apart from other coding agents. Each layer solves a different problem:

### 1. CLAUDE.md — Persistent Context

```
# CLAUDE.md (place in your project root)
This is an Astro + React project
Package manager: pnpm
Testing: vitest
Commit messages in English
```

This file is loaded automatically at the start of every session, so you never have to repeat project conventions.

### 2. Skills — On-Demand Workflows

Place `.md` files in `~/.claude/skills/`. No SDK required — just write Markdown.

- **Reference Skills**: provide knowledge (e.g., an API style guide) that Claude references throughout the session
- **Action Skills**: trigger actions (e.g., `/deploy`) that Claude executes step by step
- Supports auto-detection — you don't always need a slash command to activate them

### 3. Hooks — Deterministic Automation

Configured in `settings.json`, hooks bind to lifecycle events (before/after tool calls, session start/end, etc.).

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "edit",
      "command": "npx biome check --fix $CLAUDE_FILE_PATH"
    }]
  }
}
```

Hooks are guaranteed to run regardless of model behavior. Perfect for lint, format, security checks, and any operation that must run every single time.

### 4. Subagents — Isolated Delegation

The main agent splits tasks and spawns subagents to run them in parallel. Each subagent has its own isolated context window and does not inherit conversation history. Only the final result returns to the main context, keeping token usage lean.

### 5. MCP — External Tool Connections

The Model Context Protocol lets Claude connect to your toolchain: databases, GitHub, Sentry, Figma, Slack — 3,000+ integrations. Each MCP server becomes an immediately available tool.

### 6. Agent Teams — Multi-Agent Collaboration

Released in February 2026 alongside Opus 4.6. Multiple independent Claude sessions can message each other, divide work, and operate in parallel. Unlike subagents (a hierarchical delegation relationship), Agent Teams are peers collaborating as equals.

### Extension System Summary

| Layer | Problem it solves | When it loads |
|---|---|---|
| CLAUDE.md | Project conventions, persistent instructions | Auto-loaded at session start |
| Skills | Reusable workflows | On-demand or auto-detected |
| Hooks | Must-run automation | Deterministically on event trigger |
| Subagents | Isolation and parallelism | Spawned by the main agent as needed |
| MCP | External system connections | Always available after configuration |
| Agent Teams | Multi-agent collaboration | Manually initiated |
| Plugins | Package and distribute all of the above | Loaded per their own rules after install |

## Runtime Environments

| Environment | Description |
|---|---|
| Terminal | Native CLI, the core experience |
| VS Code | Native extension with visual diff |
| JetBrains | Native extension |
| Web | claude.ai/code |
| Slack | Launch dev tasks directly in team conversations |
| GitHub | Trigger with @claude in PRs or Issues |

## Update Channels

| Channel | Description |
|---|---|
| `latest` | Default; receives new features immediately |
| `stable` | Approximately one week delayed; skips releases with major regressions |

## Pricing

Requires a Claude Pro or Max subscription (or API access). Using Claude Sonnet 4.6 as an example:

| | Price |
|---|---|
| Input | $3.00 / 1M tokens |
| Output | $15.00 / 1M tokens |

## How Claude Code Compares to Other Coding Agents

| | Claude Code | Codex CLI | Gemini CLI | OpenCode | Pi |
|---|---|---|---|---|---|
| Vendor | Anthropic | OpenAI | Google | SST (open source) | badlogic (open source) |
| Extension layers | 6 layers | Skills + MCP | MCP | Dual Agent | Extension |
| Open source | ❌ | ✅ | ✅ (Apache 2.0) | ✅ | ✅ |
| Free tier | ❌ (subscription required) | Partially free | 1,000 requests/day | Completely free | Completely free |
| Core strength | Most complete extension ecosystem | OpenAI model integration | Free + 1M context | 75+ model flexibility | Minimal + low token usage |
| IDE integration | VS Code + JetBrains | VS Code | VS Code | TUI | TUI |

Claude Code's core advantage is the depth of customization enabled by its six-layer extension system — from individual developers to enterprise teams, you can layer in exactly the automation and integrations you need. The trade-offs: it's not open source and requires a paid subscription.

## In-Depth Guides on This Site

This site has 20+ articles dedicated to Claude Code, indexed by topic below:

**Extension system:**
- [Complete Guide to Hooks](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide)
- [Complete Guide to Skills](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)
- [Complete Guide to Sub-agents](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution)
- [MCP Server Integration](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration)
- [Agent Teams Guide](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide)
- [Plugins & Marketplaces](/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide)
- [Three-Layer Quality Defense: Hook, Skill, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)

**Configuration & environment:**
- [Complete settings.json Reference](/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide)
- [CLAUDE.md and agents.md Guide](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide)
- [Context Window Management](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management)
- [DevContainer & Sandboxing](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing)
- [Permission Modes Explained](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions)

**Integrations & automation:**
- [CI/CD × GitHub Actions](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions)
- [Headless Mode](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide)
- [Remote Control](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide)
- [Slack Integration](/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration)
- [Chrome Integration](/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration)
- [Routines (formerly Scheduled Tasks)](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide)
- [Checkpointing](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide)

**Miscellaneous:**
- [Complete List of Spinner Verbs](/posts/tech/2026-03-30-claude-code-spinner-verbs)
- [Debugging & Troubleshooting Collection](/posts/tech/2026-03-28-claude-code-troubleshooting-collection)
- [/loop Scheduling Feature](/posts/tech/2026-05-09-claude-code-loop-scheduling)
- [Skill vs Subagent Comparison](/posts/ai/2026-03-30-skill-vs-subagent-comparison)

## Resources

- [GitHub - anthropics/claude-code](https://github.com/anthropics/claude-code)
- [Claude Code Official Docs](https://code.claude.com/docs/en/setup)
- [Claude Code Product Page](https://claude.com/product/claude-code)
- [Features Overview](https://code.claude.com/docs/en/features-overview)
- [npm - @anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code)

## References

- [Claude Code Official Docs: Anthropic Coding Agent Overview](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Claude Code GitHub: anthropics/claude-code repository](https://github.com/anthropics/claude-code)
- [Anthropic Blog: Announcing Claude Code, an agentic coding tool](https://www.anthropic.com/news/claude-code)
- [npm - @anthropic-ai/claude-code (Claude Code CLI package)](https://www.npmjs.com/package/@anthropic-ai/claude-code)
