---
title: "oh-my-codex: A Structured Workflow Enhancement Layer on Top of OpenAI Codex CLI"
date: 2026-04-05
type: guide
category: ai
tags: [agent-cli, openai-codex, oh-my-codex, workflow, multi-agent, tmux, developer-tools]
lang: en
tldr: "oh-my-codex (OMX) doesn't replace Codex CLI — it adds a structured workflow layer on top of it. From requirements clarification and plan generation to multi-agent parallel execution, four core Skills transform scattered prompt conversations into a trackable development process."
description: "An introduction to oh-my-codex (OMX) architecture, core workflow Skills, multi-agent collaboration mechanisms, and how it fills the process management gaps that Codex CLI lacks natively."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)

OpenAI Codex CLI is powerful, but anyone who has used it knows the problem: **it has no concept of workflow**. You throw a prompt at it, it executes, and it's done — no task decomposition, no plan tracking, no state management across sessions. oh-my-codex (OMX) is the enhancement layer built to solve this problem.

## What Is OMX

OMX is not another Agent CLI — it's a **workflow framework built on top of Codex CLI**. You still use Codex for model inference, file I/O, and command execution. OMX handles what Codex doesn't: how to decompose tasks, how to track plans, and how to coordinate multiple Agents.

In short:

| Layer | Responsibility | Tool |
|-------|---------------|------|
| Model inference + code operations | LLM calls, file read/write, command execution | OpenAI Codex CLI |
| Workflow management | Requirements clarification, plan generation, state persistence, multi-agent coordination | oh-my-codex |

This layered design means OMX doesn't need to reinvent what Codex already does well — it focuses solely on filling the gaps.

## Four Core Skills

OMX's workflow consists of four Skills, each corresponding to a stage in the development process:

### `$deep-interview`: Requirements Clarification

When your requirements are vague ("help me refactor this module"), feeding them directly to Codex often produces results that miss the mark. `$deep-interview` first runs a structured requirements interview to confirm scope, edge cases, and expected output before moving to the next stage.

### `$ralplan`: Plan Generation

Converts clarified requirements into an executable implementation plan. The plan includes task decomposition, dependency relationships, and estimated complexity, stored in the `.omx/` directory for reference in subsequent stages.

### `$ralph`: Single Agent Execution

Handles persistent completion loops. A single Agent owns a task from start to finish until it's done. Cross-session state is maintained in the `.omx/` directory, so work can resume even after interruptions.

### `$team`: Multi-Agent Parallel Execution

When a task is large enough to split into multiple parallel paths, `$team` uses tmux (macOS/Linux) or psmux (Windows) to launch multiple Codex Agent sessions, each Agent handling an independent subtask without interference.

The relationship between the four Skills is a linear progression:

```
$deep-interview → $ralplan → $ralph (single task)
                           → $team  (multiple parallel tasks)
```

You don't have to go through the entire flow every time — skip `$deep-interview` when requirements are clear, skip `$team` when tasks are simple. But this structure provides a **predictable workflow skeleton**.

## State Persistence

OMX creates an `.omx/` folder in the project root directory, storing:

- Interview records (output from requirements clarification)
- Implementation plans (task decomposition and dependencies)
- Execution logs (progress for each Agent)
- Runtime memory (cross-session context)

This solves one of Codex CLI's biggest pain points: **no memory between sessions**. With `.omx/`, you can pause work, come back the next day, and the Agent knows where it left off.

## Multi-Agent Collaboration Mechanism

The `$team` mode is OMX's most ambitious feature. Here's how it works:

1. Identifies parallelizable subtasks from the `$ralplan` plan
2. Launches an independent tmux session for each subtask
3. Each session runs a Codex Agent with its own workspace
4. Agents report results upon completion, and a coordinator integrates them

This partially overlaps with Codex's native Parallel Agents feature, but OMX's difference lies in **managing task-level coordination**, not just agent-level parallelism.

## Technical Composition

| Component | Technology |
|-----------|-----------|
| Primary language | TypeScript (91.7%) |
| Performance modules | Rust (4.6%) |
| Prompt management | Templates in the `prompts/` directory |
| Skill definitions | Composable modules in the `skills/` directory |
| Agent roles | Reusable specialist role definitions |

The TypeScript + Rust combination is increasingly common in CLI tools — TS handles logic and prompt processing, while Rust handles performance-critical low-level operations.

## Installation and Usage

Prerequisites: Node.js 20+, OpenAI Codex CLI installed and authenticated.

```bash
npm install -g @openai/codex oh-my-codex
```

Recommended startup:

```bash
omx --madmax --high
```

Multi-agent mode requires additionally installing tmux (Linux/macOS) or psmux (Windows).

## Comparison with Other Tools

OMX is not positioned to compete with Claude Code, Gemini CLI, or Cursor — it only works with Codex CLI. A more accurate comparison would be with other "Agent enhancement layers":

| Tool | Base | Key Difference |
|------|------|---------------|
| oh-my-codex | Codex CLI | Structured workflow (clarify → plan → execute), multi-agent coordination |
| Claude Code CLAUDE.md | Claude Code | Project-level guidance, but no workflow engine |
| Codex native Skills | Codex CLI | Reusable templates, but lacks planning and coordination layers |

OMX's value proposition: if you're already using Codex CLI and frequently encounter situations where "the task is too big for a single prompt," OMX provides structure to manage that complexity.

## Use Cases

**Good fit:**

- Already using Codex CLI and want a more structured development process
- High task complexity requiring task decomposition and multi-agent parallelism
- Teams sharing the same workflow conventions
- Need cross-session state persistence

**Not ideal:**

- Not using Codex CLI (OMX is tied to the Codex ecosystem)
- Tasks simple enough to solve with a single prompt
- Scenarios requiring non-OpenAI models

## Project Status

| Metric | Value |
|--------|-------|
| GitHub Stars | ~16.6k |
| Forks | ~1.6k |
| Latest version | v0.11.13 (2026-04-04) |
| License | MIT |
| Primary maintainers | Yeachan Heo, HaD0Yun |
| Contributors | 35 |

Based on star count and update frequency, OMX is one of the most active community enhancement tools in the Codex CLI ecosystem.

## References

- [oh-my-codex GitHub Repository](https://github.com/Yeachan-Heo/oh-my-codex)
- [OpenAI Codex CLI — GitHub](https://github.com/openai/codex)
- [OpenAI Introduces Codex: Agent CLI Workflows and Multi-Agent Collaboration](https://openai.com/index/introducing-codex/)
- [Codex CLI Complete Analysis](/posts/ai/2026-04-02-agent-cli-openai-codex)
