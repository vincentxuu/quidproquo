---
title: "How Claude Code Works: The Agentic Loop, Built-in Tools, and Two Safety Rails"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, agentic-loop, ai-agent, anthropic]
lang: en
tldr: "Claude Code runs an agentic loop — gather context, take action, verify results — until the task is done. This entry to the series breaks down its five tool categories, the model/harness split, and the two safety rails: checkpoints and permission modes."
description: "Series entry point: how the agentic loop works, what tools Claude Code ships with, what it can access, and how checkpoints and permission modes keep it safe."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 1
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)

This is the entry point to the *Claude Code Deep Dives* series. If you are still deciding whether to adopt it, or comparing coding agents in general, start with the earlier [Agent CLI comparison](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent-en). This post assumes you have decided to use it and want to understand **what actually runs underneath** — because every advanced feature (hooks, MCP, multi-agent, automation) builds on the same mechanics.

## A language model that takes action

Start with the difference from a web chatbot. An ordinary chatbot can only reply with text: you paste code, it suggests changes, and you do all the moving between editor and chat. Claude Code is different. The official docs position it as an **agentic harness** around the Claude model: a layer that provides tools, manages context, and maintains the execution environment so a language model can act as a coding agent.

So when you type "fix the failing tests" in your terminal, it does not reply with "you could try..." — it actually runs the tests, reads the errors, finds the source files, edits them, and runs the tests again to confirm.

## The agentic loop: three phases

Every task you hand to Claude Code runs through a loop of three phases:

```
your prompt ──► gather context ──► take action ──► verify results
                       ▲                              │
                       └──── not done yet, go again ◄─┘
```

- **Gather context**: search files, read code, check git state, understand the situation.
- **Take action**: edit files, run commands, call external services.
- **Verify results**: run tests, look at type errors, re-read edited files.

The phases are not a fixed pipeline. A question about the codebase might only need context gathering; a bug fix cycles through all three repeatedly; a large refactor leans heavily on verification. What each step requires is decided by the model based on what it learned in the previous step — that is what "agentic" means here: not following a script, but course-correcting along the way.

You are part of this loop too. Press `Esc` at any point to interrupt immediately — the running tool call is canceled. Or keep it running and just type a correction: Claude reads it as soon as the current action completes and adjusts before deciding its next step.

## Models reason, tools act

Two components power the loop.

**The model** does the reasoning. Sonnet handles most coding tasks well; complex architectural decisions benefit from Opus. Switch mid-session with `/model`, or start with `claude --model <name>`. When the docs say "Claude chooses" or "Claude decides," that is the model making a judgment.

**Tools** are what make it agentic at all. Without tools, Claude produces text; with tools, every action's result feeds back into the loop and informs the next decision. Built-in tools fall into five categories:

| Category | What Claude can do |
|----------|--------------------|
| File operations | Read files, edit code, create files, rename and reorganize |
| Search | Find files by pattern, search content with regex, explore codebases |
| Execution | Run shell commands, start servers, run tests, use git |
| Web | Search the web, fetch documentation, look up error messages |
| Code intelligence | See type errors after edits, jump to definitions, find references (requires code intelligence plugins) |

The complete list, including per-tool permission requirements, is in the official [Tools reference](https://code.claude.com/docs/en/tools-reference). One thing worth knowing early: tool names are not just labels. Permission rules, subagent tool lists, and hook matchers all use the exact same strings — later posts in this series lean on that constantly.

## What it can access

Running `claude` in a directory gives it broader access than most people assume:

- **Your project**: everything in the working directory and subdirectories; anything outside needs your approval.
- **Your terminal**: if you can run it from the command line, so can Claude — build tools, git, package managers, system utilities.
- **Git state**: current branch, uncommitted changes, recent history.
- **CLAUDE.md**: project instructions you write, loaded at the start of every session.
- **Auto memory**: notes Claude accumulates itself (preferences, build commands, debugging insights); the first 200 lines or 25KB of MEMORY.md load each session.
- **Configured extensions**: MCP servers, skills, subagents, Chrome integration.

Because it sees the whole project, cross-file tasks like "fix the authentication bug" actually work: find relevant files, read several to understand the flow, make coordinated edits, verify with tests. An inline completion assistant that only sees the current file structurally cannot do this.

## Two safety rails

Before letting an agent loose on your code, know how to pull control back.

**First rail: checkpoints.** Before editing a file, Claude snapshots the current contents. If something goes wrong, press `Esc` twice to rewind, or just ask Claude to undo. Checkpoints are separate from git and survive a session resume. Know the limits: they only cover file changes — side effects from bash commands, databases, APIs, and deployments are not checkpointed. Those rely on the second rail.

**Second rail: permission modes.** Cycle through them with `Shift+Tab` to control how much Claude can do without asking. These are the four modes you encounter most often in interactive coding sessions; the full list also includes `dontAsk` and `bypassPermissions`, which belong in the dedicated permissions post.

| Mode | Behavior |
|------|----------|
| Auto | A background classifier reviews most actions and blocks risky ones; when available and not disabled by settings, it is the built-in starting mode for interactive sessions on Pro, Max, and Team plans |
| Manual | Claude asks before file edits and shell commands |
| Accept edits | Edits files and runs common filesystem commands without asking; other commands still prompt |
| Plan | Explores and proposes a plan without touching source files |

Trusted commands can also be allowlisted in `.claude/settings.json` (like `npm test`), and settings scale from organization-wide policy down to personal preference — that is cluster B's territory.

## Where sessions live

Each message, tool use, and result is written as plaintext JSONL under `~/.claude/projects/`; rewind, resume, and fork all build on it. Every new session starts with a fresh context window and none of the previous conversation. To continue, use `--continue` or `--resume` (same session ID, messages appended); to branch, use `--fork-session` or `/branch` (history copied to a new session ID, original untouched). Details in A3.

## The map for this series

Everything else in the series goes deeper on one of these parts:

- **Core operation**: [.claude directory tour](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en), [sessions management](/posts/tech/deep-dive/2026-08-26-claude-code-sessions-guide-en), checkpointing
- **Configuration & permissions**: settings.json, permissions and auto mode, CLAUDE.md and memory
- **Context management**: context window, prompt caching
- **Extensions**: hooks, skills, MCP, sub-agents, plugins
- **Automation**: headless and Agent SDK, GitHub Actions, channels, scheduled tasks
- **Multi-agent**: overview, agent teams, agent view, dynamic workflows
- **Safety & operations**: sandboxing, costs, troubleshooting

## Takeaways

Every Claude Code feature reduces to one sentence: **the model runs a loop over a tool set provided by the harness, and you bound the loop with checkpoints and permissions.** Hooks inject your scripts at specific points of the loop, MCP adds new tools to the set, subagents open fresh context windows to share the work. Understand the loop and the tool layer, and every remaining post in this series is just another layer on top.

## References

- [How Claude Code works — Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works) — official description of the agentic loop phases, harness positioning, access scope, checkpoints, and permission modes
- [Tools reference — Claude Code Docs](https://code.claude.com/docs/en/tools-reference) — complete built-in tool list, permission requirements, auto mode defaults
- [Checkpointing — Claude Code Docs](https://code.claude.com/docs/en/checkpointing) — checkpoint timing, the rewind menu, limitations, and retention rules
- [Choose a permission mode — Claude Code Docs](https://code.claude.com/docs/en/permission-modes) — complete permission mode list, starting-mode rules, and `Shift+Tab` switching
- [Explore the .claude directory — Claude Code Docs](https://code.claude.com/docs/en/claude-directory) — auto memory loading rules and session data storage
- [Claude Code docs index (llms.txt)](https://code.claude.com/docs/llms.txt) — official documentation index used to scope this series

## Changelog

- 2026-08-26: Initial version, written against the August 2026 docs (auto mode is now the default permission mode on Pro/Max/Team).
