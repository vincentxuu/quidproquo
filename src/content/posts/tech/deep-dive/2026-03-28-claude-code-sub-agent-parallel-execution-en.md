---
title: "How Claude Code Sub-agents Work: Context Isolation, Frontmatter Definitions, Background Execution, and Permission Inheritance"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, sub-agent, ai-agent, dx]
lang: en
tldr: "Sub-agents are specialized assistants that work in their own context window: a single Markdown file defines their system prompt, tools, and model. Claude delegates automatically based on the description field, or you can @-mention to force one. This post breaks down the frontmatter schema, background execution and nested spawning, permission inheritance rules, and when not to use them."
description: "A deep dive into Claude Code's sub-agent mechanism: built-in agent list, custom frontmatter fields, delegation triggers, background execution and three-layer nesting, permission inheritance, and cost considerations — based on the official docs."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 15
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution)

The [series entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) dispatched subagents in one line: "open a new context window to share the workload." This post unpacks the machinery behind that sentence — how they're defined, how they get triggered, where they run, and what tools they can use.

## The problem it solves: context isolation

The scarcest resource in an agent session is the context window. Tasks like searching a codebase, fetching documentation, or digging through logs produce large volumes of intermediate output that you'll never reference again — yet it permanently occupies space in the main conversation.

A sub-agent's approach is to throw this kind of work into a **brand-new context window**: it receives its own system prompt plus a task description, reads files and runs commands on its own, and all intermediate output stays in its window. Only the final summary returns to the main conversation. The official context window visualization page puts a concrete number on it: the subagent read 6,100 tokens of file contents, and only a 420-token result came back.

Not everything is isolated. On startup, a non-fork subagent loads: its own system prompt, the task message Claude wrote, every level of CLAUDE.md, and a git status snapshot taken at the start of the parent session. The built-in Explore and Plan agents are the exception — for fast, cheap research, both skip CLAUDE.md and git status. If a rule must reach Explore (say, "ignore the vendor/ directory"), restate it in the delegation prompt. Pair this with [context window management](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management) for the bigger picture.

## Built-in list and how to define your own

There aren't many built-in subagents:

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| **Explore** | Inherits main conversation (capped at Opus on the Claude API) | Read-only | Search and analyze the codebase |
| **Plan** | Inherits main conversation | Read-only | Research during plan mode |
| **General-purpose** | Inherits main conversation | All | Multi-step tasks needing exploration plus modification |
| Other helpers | Varies | Restricted | `claude` (catch-all), `statusline-setup`, `claude-code-guide` |

Two common misconceptions first: as of v2.1.198, Explore **no longer always runs Haiku** — it inherits the main conversation's model (on the Claude API, at most Opus); and Bash is **not** in the built-in agent list — to run commands in an isolated context, use general-purpose or a custom agent.

A custom subagent is just a Markdown file dropped into `.claude/agents/` (project scope) or `~/.claude/agents/` (user scope):

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices. Use proactively after code changes.
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. Analyze the code and provide specific,
actionable feedback on quality, security, and best practices.
```

Only `name` and `description` are required; every other field has a sensible default. The commonly used ones:

| Field | What it does |
|-------|--------------|
| `tools` / `disallowedTools` | Allowlist or denylist; supports server-level patterns like `mcp__<server>` |
| `model` | `sonnet` / `opus` / `haiku` / `fable` / full model ID / `inherit`; omitted means inherit |
| `permissionMode` | Overrides this agent's permission mode (see the limits below) |
| `memory` | Persistent memory scope: `user` / `project` / `local` |
| `background` | Forces background execution |
| `isolation` | Set to `worktree` to run inside a temporary git worktree instead of your checkout |
| `skills` / `mcpServers` / `hooks` / `maxTurns` / `effort` | Preloaded skills, scoped MCP servers, lifecycle hooks, turn limit, effort level |

Name conflicts resolve by source priority: managed settings > `--agents` CLI flag > `.claude/agents/` > `~/.claude/agents/` > plugin. Project-level agents should be checked into version control so the whole team shares them.

By the way: if you remember an interactive `/agents` creation wizard — it's gone. As of v2.1.198, `/agents` just reminds you to ask Claude to write the file or edit `.claude/agents/` directly. The directory structure and frontmatter format are unchanged.

## How delegation gets triggered

Three ways, from automatic to manual:

- **Automatic delegation**: Claude matches your task against each subagent's `description` field and decides whether to hand work off. That makes description the highest-leverage required field — to encourage proactive use, the docs suggest adding "use proactively" to it.
- **@-mention**: type `@` and pick from the typeahead (e.g., `@"code-reviewer (agent)"`) to guarantee that specific subagent runs for this task. Note the @-mention only decides *who* does the work; Claude still writes the task prompt based on your full message.
- **Whole-session takeover**: `claude --agent code-reviewer` applies that subagent's system prompt, tool restrictions, and model to the main thread itself. You can also set `"agent": "code-reviewer"` in `.claude/settings.json` as the project default.

## Background execution and nested spawning

In interactive sessions, subagents Claude spawns **run in the background by default** (since W27): you keep typing while the result arrives later. Foreground mode blocks the main conversation until completion. Press `Ctrl+B` to move a running task to the background.

Background has a price: fewer tools. A background subagent keeps every MCP tool but only a whitelist of built-in ones (Read, Edit, Bash, WebFetch, etc.) — everything else is removed without an error, so the same definition can resolve to different tool sets in the foreground versus the background. Permission prompts don't disappear either: when a background subagent hits a call needing approval, the prompt surfaces in your main session for you to decide.

On nesting: since W24, subagents can spawn their own subagents — currently up to **three layers** deep by default (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` to adjust; set it to 1 to disable). Concurrently running subagents are capped at 20 by default (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`). At the depth limit, the Agent tool is withheld so the deepest subagent finishes the work itself and returns one summary. The canonical pattern is a reviewer subagent dispatching a verifier per finding, keeping intermediate output out of your main conversation entirely.

## Permission inheritance

A subagent's `permissionMode` doesn't take effect unconditionally:

- Unset → inherits the main conversation's mode.
- Parent session uses `bypassPermissions` or `acceptEdits` → **takes precedence and can't be overridden**.
- Parent session uses auto mode → the subagent runs in auto mode too, and any frontmatter `permissionMode` is ignored; the same classifier rules review the subagent's tool calls.
- Managed settings disabled bypass mode → writing `bypassPermissions` in the frontmatter has no effect.

In other words, tightening always wins from the parent side — you can relax things within a child definition, but you can't cross a boundary the parent session has already granted or revoked. One more security detail: since v2.1.210, each subagent's final report is scanned before Claude reads it. Text imitating formats like `<system-reminder>` gets backslashes inserted or a marker line prepended, so instruction-shaped text isn't mistaken for a system message. The scan never rewrites content; the real defenses remain permission checks and sandboxing.

One rule that's easy to miss: no message from any agent counts as your approval for a pending permission prompt, and no agent message can change a subagent's permission settings or CLAUDE.md — approval can only come from you or the permission system.

## When not to use one

Sub-agents aren't free. Each one is a full model invocation that rebuilds context from scratch, with higher latency than the main conversation; multiple subagents each returning detailed results still eat your context in aggregate. The official guidance is practical:

Frequent back-and-forth needed, multiple phases sharing significant context, or a quick targeted change — stay in the main conversation. Verbose output you won't reference again, enforced tool restrictions, self-contained work that returns a summary — delegate to a subagent. Reusable prompts or workflows that don't need context isolation — that's Skills, not subagents.

## Takeaways

A sub-agent boils down to one trade: **pay the cost of rebuilding context in exchange for a clean main conversation**. Whether it's worth it depends on how much intermediate output the task produces and whether you need tool isolation. Definitions are lightweight — one Markdown file — so the sensible move is to extract a subagent when you notice yourself repeating the same kind of instruction, not to design an agent hierarchy up front. As for scenarios where multiple agents talk to each other and collaborate, that's agent teams and the F cluster — this post's subagent only ever "does the work and reports back."

## References

- [Create custom subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents) — Primary source for this post: frontmatter schema, built-in agent list, background execution and nesting rules, permission inheritance, persistent memory
- [Explore the context window — Claude Code Docs](https://code.claude.com/docs/en/context-window) — Interactive simulation of subagent isolation (6,100 tokens read vs. 420 returned) and a breakdown of context consumption

## Changelog

- 2026-08-26: Initial version, written against the August 2026 official docs (Explore now inherits the main conversation's model, `/agents` wizard removed, subagents run in the background by default and nest up to three layers).
