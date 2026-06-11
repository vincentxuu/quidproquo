---
title: "oh-my-openagent: A Multi-Model Agent Team Framework That Replaces Single-LLM Coding"
date: 2026-04-05
type: guide
category: ai
tags: [agent-cli, oh-my-openagent, opencode, multi-agent, multi-model, orchestration, ultraworkers]
lang: en
tldr: "oh-my-openagent (OmO) transforms OpenCode from a single-LLM tool into a multi-model agent team — Opus as the workhorse, GPT-5.2 as the architect, Gemini for frontend, Sonnet for documentation lookup — all triggered to run in parallel with a single ultrawork keyword. With 48K stars, it is the earliest project in the UltraWorkers ecosystem to establish the multi-agent coding pattern."
description: "An introduction to oh-my-openagent's multi-model agent team architecture, role assignments, hook system, and its relationship to the UltraWorkers ecosystem."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-oh-my-openagent-multi-model-orchestration)

Most AI coding tools follow a simple logic: pick one model and throw every task at it. oh-my-openagent (OmO, formerly oh-my-opencode) proposes a different approach: **use different models for different tasks and assemble them into an agent team**.

## Core Concept

OmO is a plugin built on top of [OpenCode](https://github.com/sst/opencode) (a terminal-based AI coding tool developed by SST). The author uses an analogy: if OpenCode is Debian, OmO is Ubuntu — the same kernel, but with out-of-the-box configuration and collaboration mechanisms layered on top.

Its core belief is: **no single model is the best at every task**. Claude Opus excels at complex reasoning, GPT-5.2 at architecture design, Gemini 3 Pro at frontend UI, and Claude Sonnet at quick lookups. Rather than forcing one model to do everything, let each model do what it does best.

## Agent Team

OmO comes with a set of named agents, each with a clear role and designated model:

| Agent Name | Model | Responsibility |
|------------|-------|----------------|
| **Sisyphus** | Claude Opus 4.5 High | Primary development agent, handles core implementation |
| **Oracle** | GPT-5.2 Medium | Architecture design, debugging, technical decisions |
| **Frontend UI/UX** | Gemini 3 Pro | Frontend interfaces, styling, user experience |
| **Librarian** | Claude Sonnet 4.5 | Documentation search, codebase exploration |
| **Explore** | Grok Code | Fast global search (contextual grep) |
| **Prometheus** | — | Planner |
| **Metis** | — | Plan advisor |
| **Multimodal Looker** | — | Multimodal analysis |

Each agent's model, temperature, prompt, and permissions can be overridden in the configuration file. This is not a hard binding — you can swap Oracle to Claude or replace the Frontend agent with another model. The key point is the **role-assignment framework**, not a lock-in to specific models.

## ultrawork Mode

OmO's most signature feature is the `ultrawork` (shorthand `ulw`) keyword. Adding this keyword to any prompt triggers the full multi-agent collaboration pipeline:

```
ultrawork: build a REST API for task management
```

The system will automatically:

1. Have Prometheus decompose the task and create a plan
2. Have Metis review the plan for soundness
3. Dispatch subtasks to the corresponding agents (Sisyphus writes logic, Frontend handles UI, Librarian looks up documentation)
4. Run multiple agents in parallel in the background
5. Have Sisyphus integrate results and verify completeness

Without the `ultrawork` keyword, it operates as a normal single-agent mode — OmO does not force you to use team mode every time.

## Technical Architecture

| Aspect | Details |
|--------|---------|
| Language | TypeScript |
| Form | OpenCode plugin |
| Installation | npm (`oh-my-opencode@latest`) |
| Config format | JSONC |
| Config location | `.opencode/oh-my-opencode.json` (project) or `~/.config/opencode/oh-my-opencode.json` (global) |

### Hook System

OmO ships with 25+ hooks corresponding to various stages of the agent lifecycle, all toggleable via `disabled_hooks`:

- `PreToolUse` / `PostToolUse`: before and after tool calls
- `UserPromptSubmit`: when the user submits a prompt
- `Stop`: when the agent stops

This hook system is compatible with Claude Code's hook model, reducing the learning curve when migrating across tools.

### Built-in MCP Services

| MCP | Function |
|-----|----------|
| **Exa** | Web search |
| **Context7** | Official documentation lookup |
| **Grep.app** | GitHub code search |

### LSP and AST-Grep

OmO integrates full Language Server Protocol support and AST-Grep, allowing agents to perform deterministic code refactoring (rename, extract, inline) rather than relying on the model to guess string replacements.

### Todo Continuation Enforcer

An interesting mechanism: it forces the agent to complete every item on the todo list, preventing the agent from giving up halfway. The project documentation calls this "Sisyphus keeps pushing the boulder" — the name is deliberately chosen from Greek mythology, referencing a character who never stops.

### Comment Checker

Automatically detects and prevents agents from leaving excessive comments in code. This is a direct response to a common problem with AI coding tools — models tend to add explanatory comments on every line.

## Installation

OmO's recommended installation method is distinctive — let an AI agent install it for you:

```
# Paste this into any LLM agent
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

Or install manually:

```bash
# OpenCode must be installed first
npm install -g oh-my-opencode@latest
```

You will need API keys for each model (Claude, OpenAI, Google, xAI, etc.), configured according to the agents you actually use.

## Project Status

| Metric | Value |
|--------|-------|
| GitHub Stars | ~48.5K |
| Forks | ~3.8K |
| Open Issues | 422 |
| License | SUL-1.0 (Sisyphus Use License) |
| Maintainer | code-yeongyu (Yeongyu Kim) |
| Website | ohmyopenagent.com |

Worth noting is the license: OmO uses a custom SUL-1.0 (Sisyphus Use License), not the common MIT or Apache licenses. It is advisable to review the license terms before use.

## Position in the UltraWorkers Ecosystem

OmO is the **origin project** of the entire UltraWorkers multi-agent coding ecosystem. It was the first to establish the "agent team" architectural pattern — role assignment, model routing, background parallelism, hook system — and subsequent projects like oh-my-codex (OMX) and oh-my-claudecode (OMC) ported this pattern to different agent CLIs.

| Project | Base Platform | Maintainer |
|---------|---------------|------------|
| **oh-my-openagent** | OpenCode | code-yeongyu |
| **oh-my-codex** | OpenAI Codex CLI | Yeachan Heo |
| **oh-my-claudecode** | Claude Code | Yeachan Heo |

All three share the same design philosophy but adapt to different CLI ecosystems. If you use OpenCode, choose OmO; if you use Codex CLI, choose OMX; if you use Claude Code, choose OMC.

## References

- [oh-my-openagent GitHub Repository](https://github.com/code-yeongyu/oh-my-openagent)
- [OpenCode by SST](https://github.com/sst/opencode)
- [oh-my-codex Workflow Enhancement Layer Introduction](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)
- [Claw Code: Open-Source Rust Reimplementation of Claude Code](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation)
