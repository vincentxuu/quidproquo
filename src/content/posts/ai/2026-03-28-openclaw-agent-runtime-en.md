---
title: "OpenClaw Agent Runtime: Workspace, System Prompt, and Bootstrap"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, agent, workspace, system-prompt, bootstrap, soul-md, agents-md]
lang: en
tldr: "Every OpenClaw agent has its own 'home' (Workspace), with personality and behavior defined by bootstrap files like AGENTS.md and SOUL.md. The System Prompt is dynamically assembled each time."
description: "OpenClaw Agent Workspace structure, bootstrap files, System Prompt assembly, and customization guide."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-agent-runtime)

Every OpenClaw agent has a "home" -- the Workspace. The Markdown files inside it define who the agent is, how it speaks, and what it should do. This article covers the Workspace structure, the role of bootstrap files, and how the System Prompt is dynamically assembled.

## Workspace

The Workspace is the agent's sole working directory; all file tool operations happen here. The default location is `~/.openclaw/workspace`.

**The Workspace is not `~/.openclaw/`.** `~/.openclaw/` stores configuration, credentials, and session history. The Workspace only holds the agent's "personality files" and work files.

If `OPENCLAW_PROFILE` is set (and is not `default`), the path becomes `~/.openclaw/workspace-<profile>`.

### Core Files

| File | Role |
|---|---|
| `AGENTS.md` | Operational instructions, injected at each session start |
| `SOUL.md` | Personality, tone, boundaries |
| `USER.md` | User info and name/pronoun preferences |
| `IDENTITY.md` | Agent name, vibe, emoji |
| `TOOLS.md` | Tool usage conventions (advisory, not enforced) |
| `HEARTBEAT.md` | Heartbeat execution checklist (optional) |
| `BOOT.md` | Startup checklist when the Gateway restarts (optional) |
| `BOOTSTRAP.md` | One-time initialization ritual, deleted after completion |
| `MEMORY.md` | Long-term memory (optional, loaded only in private sessions) |
| `memory/YYYY-MM-DD.md` | Daily memory logs |

### What Should Not Go in the Workspace

Config files, credentials, OAuth tokens, session transcripts -- these all belong in `~/.openclaw/`.

### Backup Strategy

The docs recommend treating the Workspace as private memory and managing it with a private Git repo:

```bash
cd ~/.openclaw/workspace
git init && git add . && git commit -m "Initial workspace"
git remote add origin <private-repo-url> && git push -u origin main
```

Never commit secrets; use `.gitignore` to exclude them.

### Migration

Clone the repo to `~/.openclaw/workspace` on the new machine, run `openclaw setup` to fill in any missing files, and migrate sessions separately.

## Bootstrap Injection

On the first turn of every new session, these 8 files are injected into the context:

```
AGENTS.md → SOUL.md → TOOLS.md → IDENTITY.md → USER.md
→ HEARTBEAT.md → BOOTSTRAP.md → MEMORY.md
```

Limits:
- Single file cap: **20,000 characters**
- Total injection cap: **150,000 characters**
- Files exceeding the limit are truncated; missing files are marked with a single-line marker

If you don't want to create bootstrap files:

```json5
{ agent: { skipBootstrap: true } }
```

## System Prompt Assembly

OpenClaw doesn't use a static system prompt. Instead, it dynamically assembles one each time the agent runs. This differs from Pi's (the underlying coding agent) default prompt.

### Component Blocks

| Block | Content |
|---|---|
| Tooling | List and brief descriptions of available tools |
| Safety | Safety guardrails (advisory, not enforced) |
| Skills | Skill instructions loaded on demand |
| Self-Update | `config.apply` and `update.run` guidance |
| Workspace | Working directory path |
| Documentation | Local documentation paths and usage guidance |
| Workspace Files | Bootstrap file inclusion markers |
| Sandbox | Runtime details when sandbox is enabled |
| Date & Time | UTC + user timezone |
| Reply Tags | Syntax for supported providers |
| Heartbeats | Heartbeat behavior spec |
| Runtime | Host, OS, Node version, model, repo root, thinking level |
| Reasoning | Current visibility settings |

**Important:** The safety guardrails in the system prompt are **advisory** (guiding model behavior). Real hard limits are enforced through tool policies, exec approvals, and sandboxing.

### Three Modes

| Mode | Use Case | Includes |
|---|---|---|
| Full (default) | Primary agent execution | All blocks |
| Minimal | Sub-agent | Excludes Skills, Memory, Self-Update, Heartbeat |
| None | Most minimal | Only the base identity line |

### Configurable Options

```json5
{
  agents: {
    defaults: {
      userTimezone: "Asia/Taipei",
      timeFormat: "24",                    // auto | 12 | 24
      bootstrapMaxChars: 20000,           // single file cap
      bootstrapTotalMaxChars: 150000,      // total cap
    }
  }
}
```

## Skills Loading

Skills are loaded from three tiers, with higher priority overriding lower:

1. **Workspace skills** -- `<workspace>/skills` (highest)
2. **Project agent skills** -- `<workspace>/.agents/skills`
3. **Personal agent skills** -- `~/.agents/skills`
4. **Managed skills** -- `~/.openclaw/skills`
5. **Bundled skills** -- Included with the installation
6. **Extra dirs** -- `skills.load.extraDirs`

In a multi-agent setup, each agent's workspace has its own skills. `~/.openclaw/skills` is shared across all agents.

## The Big Picture

The Workspace is where the agent's personality and memory live. Editing `AGENTS.md` changes the agent's behavior; editing `SOUL.md` changes its tone. The System Prompt is dynamically assembled -- no manual maintenance needed. You only need to manage the Markdown files in your Workspace.

This design turns "customizing an agent" into "writing Markdown."

## References

This article is compiled from the following OpenClaw source documents:

- [docs/concepts/agent.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent.md) -- Agent Runtime Overview
- [docs/concepts/agent-workspace.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-workspace.md) -- Workspace Structure
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/system-prompt.md) -- System Prompt Assembly
- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md) -- Skills Loading Mechanism
- [docs/reference/AGENTS.default.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/AGENTS.default.md) -- AGENTS.md Default Template
