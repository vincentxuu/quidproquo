---
title: "How to manage Claude Code's context window: startup content, per-feature costs, and the compaction trio"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, context-window, compaction, token]
lang: en
tldr: "Claude Code loads the system prompt, MEMORY.md, CLAUDE.md, MCP tool names, and skill descriptions before you type your first word. This post breaks down the startup context, what each of six extension features costs, and how to control auto-compaction with /compact, /autocompact, and autoCompactWindow."
description: "Claude Code context window management: what loads automatically at session start, how much context CLAUDE.md, skills, MCP, subagents, and hooks each consume, the compaction configuration trio, and remedies for the errors a full window produces."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 10
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management)

The previous post [took apart the agentic loop](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works): the harness does three things — provide tools, manage context, maintain the execution environment. This one goes deep on the second. The context window is the loop's memory; when it fills up, behavior starts to drift — skills fail to trigger, earlier instructions fade. To manage it well, first know what's actually inside.

## What the context window holds

The official definition is blunt: the context window holds everything Claude knows about your session — your instructions, the files it reads, its own responses, plus content that **never appears in your terminal**. The one-line `Read auth.ts` you see on screen can mean thousands of tokens of file content entering context behind it.

In other words, the conversation you watch is just the tip of the iceberg. The first lesson of context management is telling apart what loads, when it loads, and how much it takes.

## Session start: loaded before you type

After you run `claude`, before your first prompt, the official interactive simulation lists a set of content that automatically enters context. Treat this as the practical startup inventory, not a strict sequence that is identical in every environment; output styles, `--append-system-prompt`, external settings, and version differences can change the exact request shape.

| Category | Content | Source |
|-------|---------|--------|
| System prompt | Built-in Claude Code behavior, tool use, response format; may include output style or appended system prompt |
| Auto memory | Claude's own accumulated notes; first 200 lines or 25KB of `MEMORY.md` |
| Environment info | Working directory, platform, shell, git repo status, branch, recent commits |
| MCP tool names | Names only, so Claude knows what is available |
| Skill descriptions | Descriptions for model-invocable skills |
| User-level CLAUDE.md | `~/.claude/CLAUDE.md`, cross-project preferences |
| Project CLAUDE.md / rules | Project instructions and unscoped rules; path-scoped rules load on demand |

Two details worth remembering. First, full MCP tool schemas are **deferred by default**: tool search is on by default, so Claude normally sees only tool names and pulls in a specific schema when a task needs it. Second, only skill descriptions stay resident; full content loads when a skill is actually used — which means how precisely you write the description determines both the context cost and the trigger accuracy. The layering details of the memory system (what goes at which level, how imports work) are covered in the [dedicated memory post](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide-en).

One more class loads on demand while you work: rules under `.claude/rules/` with a `paths:` frontmatter enter context only when Claude reads files matching the pattern. Moving language-specific or directory-specific guidance out of CLAUDE.md into these is the official first slimming move.

## Context cost per feature

[Extend Claude Code](https://code.claude.com/docs/en/features-overview) gives a complete cost table:

| Feature | When it loads | What loads | Cost |
|---------|---------------|------------|------|
| CLAUDE.md | Session start | Full content | Present on every request |
| Skills | Start + when used | Description → full content | Low (descriptions resident)* |
| MCP servers | Start | Tool names, schemas deferred | Low until a tool is used |
| Code intelligence | After edits + on demand | Type errors, symbol locations | Low; reduces file reads elsewhere |
| Subagents | When spawned | A fresh isolated context | Isolated from main session |
| Hooks | On trigger | Nothing by default (runs externally) | Zero unless output is returned |

\* That asterisk deserves its own note: a skill with `disable-model-invocation: true` in its frontmatter keeps even its description out of context until you invoke it manually with `/name`. Side-effecting skills (committing, deploying, sending messages) suit this setting — it saves context and guarantees only you can trigger them.

The "unless output is returned" cell on hooks also has nuance: plain stdout on exit code 0 goes to the debug log only and never counts as context. Information reaches Claude through the `additionalContext` JSON field instead — and it enters **untruncated**, so keep hook output concise.

### Subagent: the only feature that saves you context

Every other row adds things to *your* window; subagents run the other way. They work inside their own separate context window: their own system prompt, the same CLAUDE.md and MCP/skill setup loaded fresh (though the built-in Explore and Plan agents skip CLAUDE.md entirely). However many files they read, it lands on their tab; only a summary plus a small metadata trailer returns to the main conversation. In the official simulation's example: a subagent read 6,100 tokens of files, and the main conversation received a 420-token conclusion.

One counterintuitive warning: subagents **inherit every MCP tool definition** from the parent session. With many MCP servers connected, a subagent can bloat its own window before running its first turn — disable unused servers with `/mcp disable` before dispatching. Also note it does not inherit the main session's auto memory; don't expect it to remember preferences you taught last turn.

## When it fills up: the compaction trio

As context nears capacity, Claude Code compacts automatically: the whole conversation is replaced with a structured summary (your requests and intent, key technical concepts, which files changed and how errors were fixed, pending tasks), freeing space to keep working. The everyday controls have three layers:

**`/compact`** — manual compaction, and it accepts focus instructions. `/compact focus on the auth bug fix` makes the summary keep what you name instead of letting the automatic pass guess what matters. Compacting deliberately before a long new task beats waiting for the automatic trigger.

**`/autocompact`** — sets the water level for the automatic pass. `/autocompact 500k` means compact once context reaches 500k tokens; the value persists into the `autoCompactWindow` field of your user settings. `/autocompact auto` returns to the model-tuned default.

**`CLAUDE_CODE_AUTO_COMPACT_WINDOW`** — an environment variable that takes precedence over both the command and the setting, suited to scripts and cloud environments. The accepted range is **100K to 1M** tokens, written as `500k`, `1M`, or a plain count; a separate `--autocompact` flag overrides a single launch. No matter how high you set it, the window is capped at the model's own context limit.

If you do not want to compact the whole conversation, Claude Code now also offers `/rewind` with **Summarize from here** and **Summarize up to here**. Treat that as a partial cleanup tool, not part of the auto-compact threshold configuration.

With nothing set, Claude Code compacts as the conversation approaches the model's context limit. If your problem is a too-small window rather than too-early compaction, the current docs list Fable 5, Sonnet 5, Opus 4.6 and later, and Sonnet 4.6 as supporting a 1 million token context window. Sonnet 5 runs natively at 1M; other models may require a `[1m]` variant depending on plan and provider, and default compaction thresholds vary by model.

### What survives compaction

It isn't a clean wipe. The system prompt, CLAUDE.md, auto memory, and the plan written in plan mode are all re-injected from their sources; up to five recently modified files get re-read (files over 5,000 tokens come back as path references without content); the bodies of skills you invoked are re-injected, capped at 5,000 tokens each and 25,000 total, oldest dropped first. Conversely, the skill description listing does **not** reload after compaction — only skills you actually invoked survive. Path-scoped rules ride along with file reads, so re-reading files brings them back naturally.

## When compaction itself fails: three documented errors

Automatic compaction is not invincible; the error reference lists three situations:

- **`Context limit reached · /compact or /clear to continue`**: the request already exceeds the limit. Run `/compact` or `/clear`, or check `/context` first to see what is consuming space.
- **`Prompt is too long · automatic compaction failed: <cause>`**: the automatic pass ran but failed on an underlying error such as an unavailable model or authentication failure. Fix the named error first — otherwise `/compact` fails the same way.
- **`Error during compaction: Conversation too long`**: the window is already completely full; there isn't room for the summary itself. Press `Esc` twice to step back several messages and retry, or `/clear` into a fresh session — the old conversation survives and `/resume` brings it back.

The third is the ugliest way to die: waiting until the window is completely full leaves no margin even for compaction. That is exactly the value of setting `/autocompact` at a lower level — compact early, always keep an escape route.

## Everyday control techniques

- **`/context`**: live breakdown of usage by category with optimization suggestions, including which CLAUDE.md and memory files loaded; add `all` to see tokens per MCP tool.
- **`/clear` between unrelated tasks**: the old conversation doesn't just take space — every request pays tokens for it.
- **Send research-heavy tasks to a subagent**: bulk file reading stays in its window; the main conversation receives conclusions.
- **Keep CLAUDE.md under 200 lines**: move reference material into skills or path-scoped rules under `.claude/rules/`; if you're not sure what to trim, `/doctor` produces trim proposals.

## Takeaway

Context management is fundamentally a balance sheet: the startup autoloads are fixed expenses, every file read and tool output is a variable expense, the subagent is the only channel that can transfer variable spending elsewhere, and the compaction trio is debt restructuring when you're close to insolvency. How the files under `.claude` divide the labor is covered in the [directory tour](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en), and writing memory files that don't eat context in the [memory system post](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide-en). The next post covers the other side of this ledger: [prompt caching](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching-en) — which actions invalidate the cached prefix, straight off your bill.

## References

- [Explore the context window — Claude Code Docs](https://code.claude.com/docs/en/context-window) — Official interactive simulation of startup context and per-event token costs, including the compaction survival table and the "When your context fills up" remedy list
- [Extend Claude Code — Claude Code Docs](https://code.claude.com/docs/en/features-overview) — Context cost comparison across CLAUDE.md, skills, MCP, code intelligence, subagents, and hooks, with loading timing explained
- [Model configuration — Claude Code Docs](https://code.claude.com/docs/en/model-config) — The three-layer auto-compact window configuration (`/autocompact`, `--autocompact`, `CLAUDE_CODE_AUTO_COMPACT_WINDOW`), the 100K–1M range, and per-model default thresholds
- [Error reference — Claude Code Docs](https://code.claude.com/docs/en/errors) — Meaning and recovery steps for the `Prompt is too long`, `automatic compaction failed`, and `Conversation too long` context-related errors

## Changelog

- 2026-08-26: Initial version, written against the August 2026 official docs (tool search on by default, Sonnet 5 native 1M context, compaction trio verified against the model-config page).
- 2026-08-29: Updated startup-context wording so the interactive simulation is not presented as a fixed sequence; expanded the 1M-context model list.
