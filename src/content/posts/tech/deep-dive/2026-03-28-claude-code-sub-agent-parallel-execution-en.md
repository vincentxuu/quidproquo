---
title: "Claude Code Sub-agents Complete Guide: Custom AI Sub-agents and Parallel Execution"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, sub-agent, parallel-execution, worktree, ai-agent, dx, plugins]
lang: en
tldr: "Sub-agents are specialized AI assistants that run in isolated context windows. Define their system prompt, tool permissions, and model choice via Markdown files — Claude automatically delegates tasks at the right moment. Three built-in types are available (Explore, Plan, General-purpose), and you can create custom ones. Pair with persistent memory to accumulate knowledge across sessions."
description: "A deep dive into Claude Code's Sub-agent system: built-in agent types, full custom agent configuration (frontmatter fields, tool control, MCP integration, hooks, persistent memory), foreground vs. background execution, comparison with Agent Teams, and real-world examples."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 11
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution)

<!-- TODO: Pending write-up -->
<!-- Reference official docs: https://code.claude.com/docs/en/sub-agents.md -->

## Planned Outline

### What Is a Sub-agent?
- A specialized AI assistant running in an isolated context window
- Has its own system prompt, tool permissions, and model configuration
- Claude automatically delegates tasks based on the `description` field
- Protects the main conversation's context window from being filled up

### Built-in Sub-agents
| Type | Model | Tools | Purpose |
|------|-------|-------|---------|
| **Explore** | Haiku (fast) | Read-only | Search and analyze the codebase |
| **Plan** | Inherited from main | Read-only | Research during Plan mode |
| **General-purpose** | Inherited from main | All | Complex multi-step tasks |
| **Bash** | Inherited | Terminal commands | Run commands in an isolated context |
| **Claude Code Guide** | Haiku | — | Answer Claude Code questions |

### Creating Custom Sub-agents

#### Using the /agents UI
- `/agents` — create, edit, or delete agents
- Choose scope: Personal vs. Project
- Auto-generate configuration with Claude

#### Writing a Markdown File Manually
```markdown
---
name: code-reviewer
description: Expert code review specialist
tools: Read, Glob, Grep, Bash
model: sonnet
---
You are a senior code reviewer...
```

#### Scope and Priority Order
| Location | Scope | Priority |
|----------|-------|----------|
| `--agents` CLI flag | Current session | Highest |
| `.claude/agents/` | Current project | 2 |
| `~/.claude/agents/` | All projects | 3 |
| Plugin's `agents/` | Where plugin is enabled | Lowest |

### Full Configuration Fields (Frontmatter)
- `name`, `description` (required)
- `tools` / `disallowedTools`: tool allowlist / denylist
- `model`: `sonnet` / `opus` / `haiku` / `inherit` / full model ID
- `permissionMode`: `default` / `acceptEdits` / `dontAsk` / `bypassPermissions` / `plan`
- `maxTurns`: maximum number of agentic turns
- `skills`: pre-loaded skills
- `mcpServers`: MCP server configuration (inline or by reference)
- `hooks`: lifecycle hooks
- `memory`: persistent memory scope (`user` / `project` / `local`)
- `background`: whether to run in the background
- `effort`: effort level
- `isolation`: worktree isolation

### Persistent Memory
- `memory: user` → `~/.claude/agent-memory/<name>/`
- `memory: project` → `.claude/agent-memory/<name>/`
- `memory: local` → `.claude/agent-memory-local/<name>/`
- Accumulates knowledge across sessions: codebase patterns, debug insights
- `MEMORY.md` is managed automatically

### Tool and Permission Control
- `tools` allowlist vs. `disallowedTools` denylist
- `Agent(worker, researcher)` restricts which sub-agents can be spawned
- MCP servers scoped to a specific sub-agent
- `PreToolUse` hooks for conditional validation

### Foreground vs. Background Execution
- Foreground: blocks the main conversation until complete
- Background: runs in parallel; press Ctrl+B to move to background
- Pre-approved permissions for background mode

### How to Invoke Sub-agents
- Natural language: Claude auto-delegates based on `description`
- @-mention: guarantees a specific sub-agent is used
- `--agent <name>`: runs the entire session as that sub-agent
- Set `"agent": "name"` as the project default in settings

### Sub-agents vs. Agent Teams
| | Sub-agents | Agent Teams |
|---|---|---|
| Context | Isolated; results returned to caller | Fully independent |
| Communication | Reports back to the main agent only | Agents communicate directly with each other |
| Best for | Focused tasks where only the result matters | Complex work requiring collaboration |
| Token cost | Lower | Higher |

### Real-world Examples
- **Code Reviewer**: read-only sub-agent with checklist-style review
- **Debugger**: write-enabled, root cause → fix → verify workflow
- **Data Scientist**: SQL analysis specialist
- **DB Reader**: paired with a `PreToolUse` hook to enforce read-only queries

## References

- [Claude Code Create Custom Subagents — Official Docs](https://docs.anthropic.com/en/docs/claude-code/sub-agents) — Full sub-agent configuration reference, including frontmatter fields, tool control, and persistent memory
- [Claude Code Run Agent Teams — Official Docs](https://docs.anthropic.com/en/docs/claude-code/agent-teams) — Differences between Agent Teams and Sub-agents, and parallel multi-agent architecture
- [Claude Code Hooks — Official Docs](https://docs.anthropic.com/en/docs/claude-code/hooks) — Complete guide to PreToolUse/PostToolUse hooks for conditional validation
- [Claude Code Programmatic Usage & SDK](https://docs.anthropic.com/en/docs/claude-code/programmatic-usage) — Controlling sub-agent parallel execution via the SDK
- [Claude Code MCP Scoped to Subagent](https://docs.anthropic.com/en/docs/claude-code/sub-agents#scope-mcp-servers-to-a-subagent) — How to scope an MCP server to a specific sub-agent
- [Claude Code Settings — Subagent Configuration](https://docs.anthropic.com/en/docs/claude-code/settings#subagent-configuration) — Sub-agent configuration fields in `settings.json`
- [Anthropic Blog — Multi-agent Frameworks](https://www.anthropic.com/research/building-effective-agents) — Design patterns and best practices for multi-agent systems
