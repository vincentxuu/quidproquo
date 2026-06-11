---
title: "oh-my-claudecode: An Enhancement Layer That Turns Claude Code into a Multi-Agent Collaboration Platform"
date: 2026-04-05
type: guide
category: ai
tags: [agent-cli, claude-code, oh-my-claudecode, multi-agent, tmux, orchestration, ultraworkers]
lang: en
tldr: "oh-my-claudecode (OMC) adds 8 collaboration modes, 19 specialized agents, and cross-model orchestration (Claude + Codex + Gemini) on top of Claude Code, transforming a single-user CLI tool into a multi-agent development platform. Features include Deep Interview for requirement clarification, Smart Model Routing that saves 30-50% on tokens, and automatic rate limit recovery."
description: "An introduction to oh-my-claudecode's multi-agent collaboration architecture, 8 execution modes, cross-CLI orchestration mechanisms, and how it extends Claude Code from a single-agent tool into a team-level development platform."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-oh-my-claudecode-multi-agent-claude)

Claude Code is a powerful single-agent CLI tool on its own. But when the task scope exceeds what one agent can handle, you need to coordinate multiple agents, decompose tasks, and track progress. oh-my-claudecode (OMC) is the enhancement tool that adds this coordination layer on top of Claude Code.

## Product Positioning

OMC's tagline is "Don't learn Claude Code. Just use OMC." -- it doesn't aim to replace Claude Code, but rather abstracts Claude Code operations into natural language commands and magic keywords. Developers describe what they want, and OMC handles the planning, dispatching, execution, verification, and repair.

There are two installation methods:

```bash
# Claude Code marketplace plugin (recommended)
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode

# Or global npm install
npm i -g oh-my-claude-sisyphus@latest
```

You need to enable Claude Code's experimental Agent Teams feature:

```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

## Eight Execution Modes

OMC provides 8 different execution modes, covering scenarios from simple tasks to large-scale refactoring:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Team** | Standard multi-agent pipeline (plan -> PRD -> exec -> verify -> fix) | Medium to large feature development |
| **CLI Team** | tmux multi-worker parallel execution | Parallel tasks requiring isolated environments |
| **CCG** | Three-model collaboration (Claude + Codex + Gemini) | Cross-model verification |
| **Autopilot** | Automatic mode selection and dispatch | When you don't want to pick a mode manually |
| **Ultrawork** | Maximum parallelism | Large refactors, multi-file changes |
| **Ralph** | Continuous verify/fix loop | Tasks requiring repeated testing until passing |
| **Pipeline** | Strict sequential execution | Tasks with strict dependencies |
| **Ultrapilot** | Legacy mode | Backward compatibility |

The most central is **Team mode**, with the following execution pipeline:

```
team-plan → team-prd → team-exec → team-verify → team-fix (loop)
```

This isn't simply "throwing tasks at multiple agents" -- it's an engineering workflow with distinct phases: first plan, then write requirements, then execute, verify after execution, and automatically fix on verification failure.

## 19 Specialized Agents

OMC ships with 19 named agents, each with a dedicated role definition and tier variants:

- **Architecture Agent**: System architecture design and technical decisions
- **Research Agent**: Technical research and solution comparison
- **Design Agent**: UI/UX design decisions
- **Testing Agent**: Test strategy and test code
- **Data Science Agent**: Data analysis and ML-related tasks
- ...and more specialized roles

Each agent can have different tiers (e.g., senior / junior), which affect the model tier and token budget assigned to it.

## Smart Model Routing

OMC doesn't use the most expensive model for every task. It implements intelligent routing:

| Task Complexity | Model Used | Effect |
|----------------|------------|--------|
| Simple (lookups, formatting) | Haiku | Fast, low cost |
| Complex (reasoning, architecture) | Opus | High-quality output |

According to the project documentation, this mechanism can **save 30-50% on token consumption**. The logic is similar to Codex's GPT-5.4 / mini automatic routing, but OMC does tiered routing within the Claude model family.

## Cross-CLI Multi-Model Collaboration

OMC's most ambitious feature is **cross-CLI orchestration** -- it can simultaneously launch workers from Claude Code, Codex CLI, and Gemini CLI:

```bash
# Launch 3 Claude workers + 2 Codex workers
/team 3:claude 2:codex "review auth module for security issues"

# Or in CLI mode
omc team 2:codex "fix all TypeScript errors"
```

Each worker runs in an independent tmux pane without interfering with others. This means you can have Claude write core logic, Codex write tests, and Gemini handle the frontend -- three models working simultaneously.

The prerequisite is installing the corresponding CLIs:

```bash
npm install -g @google/gemini-cli   # Gemini
npm install -g @openai/codex        # Codex
```

## Deep Interview

When requirements are vague, OMC provides a Socratic-style requirement interview mode:

```
/deep-interview "I want to build a task management app"
```

It uses a series of structured questions to clarify scope, edge cases, technical constraints, and expected outputs, ensuring the direction is correct **before writing any code**. This feature shares its origins with oh-my-codex's `$deep-interview` and is a common design pattern across the UltraWorkers ecosystem.

## Skills System

OMC supports custom Skills -- portable YAML / Markdown files that are automatically injected into the agent's context when trigger conditions match:

```
.omc/skills/     # Project-level Skills
~/.omc/skills/   # Global Skills
```

Built-in Skills include Playwright (browser automation) and Git Master (atomic commits). You can create additional Skills tailored to your team's workflow.

## Notifications and Integrations

| Channel | Supported |
|---------|-----------|
| Telegram | Yes |
| Discord | Yes |
| Slack | Yes |
| Webhook | Yes |

Notifications support tags and session summaries -- when a session ends, a summary is automatically sent containing completed tasks, created PRs, tokens spent, and other information.

### OpenClaw Integration

OMC includes a built-in OpenClaw bridge (`bridge.ts`) that can forward session events to the OpenClaw gateway:

| Hook Event | Trigger Timing |
|------------|---------------|
| `session-start` | Session starts |
| `session-stop` | Session ends |
| `keyword-detector` | Keyword detected |
| `ask-user-question` | Agent needs human input |
| `pre-tool-use` | Before tool invocation |
| `post-tool-use` | After tool invocation |

Combined with clawhip, you can build a complete multi-agent monitoring and notification pipeline.

## Automatic Rate Limit Recovery

A practical small feature: OMC includes a built-in daemon that detects Claude API rate limits and **automatically recovers the session via tmux** when throttling occurs, without manual intervention. For scenarios involving long-running large tasks, this prevents the situation where a session breaks due to rate limits in the middle of the night and isn't discovered until the next morning.

## Magic Keywords

Another design feature of OMC is magic keywords -- adding specific keywords to your prompt triggers the corresponding functionality:

| Keyword | Function |
|---------|----------|
| `autopilot` | Automatic mode |
| `ralph` | Continuous verify/fix loop |
| `ulw` / `ultrawork` | Maximum parallelism |
| `ralplan` | Generate implementation plan |
| `deep-interview` | Requirement interview |
| `deepsearch` | Deep search |
| `ultrathink` | Deep thinking mode |

This reduces the cognitive load of memorizing slash commands -- you can operate using natural language combined with keywords.

## Project Status

| Metric | Value |
|--------|-------|
| GitHub Stars | ~11K |
| License | MIT |
| npm Package Name | oh-my-claude-sisyphus |
| Maintainer | Yeachan Heo |
| Contributors | HaD0Yun, Sigrid Jin, et al. |
| Official Docs | yeachan-heo.github.io/oh-my-claudecode-website |

The npm package name (`oh-my-claude-sisyphus`) and the repo name (`oh-my-claudecode`) don't match -- be careful not to confuse them during installation.

## Position in the UltraWorkers Ecosystem

OMC is the coordination layer specifically targeting Claude Code within the UltraWorkers ecosystem. The four "oh-my-X" projects each cover one CLI platform:

| Project | Platform | Stars |
|---------|----------|-------|
| oh-my-openagent | OpenCode | ~48.5K |
| oh-my-codex | Codex CLI | ~16.6K |
| **oh-my-claudecode** | **Claude Code** | **~11K** |
| clawhip | Notification routing (cross-platform) | ~543 |

If you primarily use Claude Code, OMC is the most directly relevant tool in this ecosystem. It doesn't require you to switch CLIs -- instead, it adds a coordination layer on top of the Claude Code you already know.

## References

- [oh-my-claudecode GitHub Repository](https://github.com/Yeachan-Heo/oh-my-claudecode)
- [oh-my-claudecode Documentation](https://yeachan-heo.github.io/oh-my-claudecode-website)
- [Claude Code Complete Solution Analysis](/posts/ai/2026-04-02-agent-cli-claude-code)
- [clawhip Event Notification Router Introduction](/posts/ai/2026-04-05-clawhip-event-notification-router)
- [oh-my-codex Workflow Enhancement Layer Introduction](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)
