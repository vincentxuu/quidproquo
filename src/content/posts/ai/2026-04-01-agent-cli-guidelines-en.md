---
title: "The Complete Guide to Agent CLIs: Design Logic, Tool Comparison, and Best Practices"
date: 2026-04-01
type: guide
category: ai
tags: [agent-cli, claude-code, codex-cli, gemini-cli, opencode, pi, kiro, aider, amp, cursor-cli, agentic-ai, developer-tools, cli, mcp, context-engineering]
lang: en
tldr: "Agent CLIs are not smarter autocomplete tools -- they are AI agents that can read your codebase, execute multi-step tasks, and operate in real environments. Claude Code, Codex CLI, Gemini CLI, OpenCode, Aider, Pi, Kiro, Amp, Cursor CLI... the tools keep multiplying, but they all share a common set of design principles -- understanding these principles is how you actually get good at using them."
description: "A comprehensive comparison of the core mechanisms behind major Agent CLI tools including Claude Code, OpenAI Codex CLI, Gemini CLI, OpenCode, Aider, Pi, Kiro (AWS), Amp, and Cursor CLI, along with best practices for context engineering, tool usage, and permission control."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-01-agent-cli-guidelines)

Before 2025, AI coding assistants were mostly used for autocomplete (Copilot) or Q&A (ChatGPT). You typed, it responded, you copied and pasted, and you decided whether to use it or not.

After 2025, Agent CLIs changed this paradigm. You input a task, and the agent reads the codebase, runs tests, modifies code, and opens a PR -- all while you go grab a coffee.

This article covers the design logic of Agent CLIs, differences between major tools, and how to use them effectively. Each tool has its own dedicated deep-dive article; this serves as the overview map.

## What Is an Agent CLI

An Agent CLI is an AI coding agent that runs in the terminal. The fundamental difference from traditional autocomplete tools is that it doesn't just answer your questions -- it has the ability to **take action in your environment**.

A typical capability set includes:

- Reading entire repos (not just your selected snippets)
- Executing shell commands (running tests, installing packages, git operations)
- Reading and writing to the filesystem
- Calling external APIs and MCP tools
- Maintaining context and plans across multiple steps

This transforms it from a "Q&A assistant" into an "agent capable of executing tasks."

## Major Tools

### Claude Code (Anthropic)

Built by Anthropic, powered by Claude Sonnet / Opus models. Positioned as **the developer's primary daily agent**, not a point-solution helper.

Core design: The **CLAUDE.md system** lets you place working guidelines in your repo or `~/.claude/`; the **Skills system** packages common workflows into slash commands; **Hooks** inject automation logic at tool-call events; **MCP integration** connects external tools; the **Sub-agent architecture** supports parallel agent dispatch.

The most feature-complete option, suitable as a primary development tool. Billed by Anthropic API token usage.

**-> [Claude Code: Anthropic's Terminal AI Coding Agent -- Complete Overview](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent)**

---

### Codex CLI (OpenAI)

OpenAI's open-source Agent CLI (Apache-2.0, 71k stars), built in Rust. Can be used with a **ChatGPT subscription plan** (Plus / Pro / Team / Enterprise) directly, or with your own API key.

Core design: The **AGENTS.md system** mirrors CLAUDE.md; **three authorization modes** (suggest / auto-edit / full-auto); **sandbox isolation** (Apple Sandbox on macOS, Docker on Linux); **fully local execution** with no state uploaded.

Ideal for developers who need strict control over the execution environment or want to customize agent behavior.

**-> [Codex CLI: OpenAI's Open-Source Terminal Coding Agent -- Complete Overview](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)**

---

### Gemini CLI (Google)

Google's open-source Agent CLI (Apache 2.0), powered by the **Gemini 3 series** models. Currently has the highest GitHub stars (~99.8k). The highlight is the **generous free tier** -- 60 requests per minute, 1,000 per day, accessible with just a Google account login.

Core design: The **GEMINI.md system**; a **1M token context window** (currently the largest); **Google ecosystem integration** (Search, Drive, Workspace); MCP support.

**-> [Gemini CLI: Google's Open-Source Terminal AI Agent -- Complete Overview](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)**

---

### OpenCode

An open-source AI coding agent (built in Go) with a built-in TUI interface. Its biggest feature is **support for 75+ LLMs** -- connecting to Anthropic, OpenAI, Ollama local models, and any OpenAI-compatible API.

Core design: LSP integration gives the agent IDE-level code understanding; a **dual-agent mode** (planning agent + execution agent division of labor); Vim-style editor; SQLite session management.

**-> [OpenCode: Open-Source AI Terminal Coding Agent -- Complete Overview](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)**

---

### Aider (Paul Gauthier)

The most established terminal pair programming tool (42.7k+ GitHub stars), pure CLI, built in Python. Supports 100+ LLMs, with official recommendations for **Claude 3.7 Sonnet, DeepSeek R1, and OpenAI o1 / o3-mini**. Its standout feature is **automatic git commits** -- every AI modification automatically creates a commit, making review and rollback easy.

Core design: `--architect` mode (high-capability model designs the architecture, low-cost model implements it); `--watch` mode detects AI comments and triggers automatically; excellent SWE-bench scores.

Best suited for developers who want a lightweight, reliable terminal pair programmer without complex agent features.

---

### Pi (Mario Zechner)

A minimalist open-source coding harness, built in TypeScript, running on the Bun runtime. The core consists of just **4 tools** (read, write, edit, bash) and a 300-word system prompt -- the design philosophy is "reject complexity."

Core design: Extensible through Extensions, Skills, and Prompt Templates; Ollama has built-in `ollama launch pi` for one-click startup; deep integration with OpenClaw.

**-> [Pi Coding Agent: A Minimalist Open-Source Terminal Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)**

---

### Kiro CLI (AWS)

An official AWS product (formerly **Amazon Q Developer CLI**), available as both an IDE (Code OSS fork) and a standalone CLI.

Core design: **Spec-driven development** -- uses EARS notation to convert natural language requirements into structured requirements + acceptance criteria, then generates architecture designs and task lists, with the agent executing step by step; **Agent Hooks** auto-trigger on events like file saves; supports multimodal input; native MCP; default model is **Claude Sonnet 4.5**, or Auto mode (dynamically switches between Sonnet 4.5 and other frontier models).

Best for teams heavily invested in the AWS ecosystem or those who prefer spec-first development workflows. Official site: [kiro.dev](https://kiro.dev)

---

### Cursor CLI (Anysphere)

A standalone CLI from the Cursor AI IDE, one-line install: `curl https://cursor.com/install -fsS | bash`. Positioned as "deliver code in any environment" -- no need to open the IDE, just run the agent directly in the terminal.

Core design: Supports all Cursor models (Claude Opus 4.6, GPT-5.2, Gemini 3 Pro, Grok, etc.); **Shell Mode** lets the agent execute shell commands directly and display output; **Headless mode** for CI pipelines and script automation; **GitHub Actions integration** can trigger nightly docs updates, security audits, and other workflows; MCP integration.

Can be used independently without the Cursor IDE, suitable for CI/CD automation or developers who want to use Cursor subscription models in the terminal. Official site: [cursor.com/cli](https://cursor.com/cli)

---

### GitHub Copilot CLI (GitHub / Microsoft)

GitHub's official terminal agent, bundled with **GitHub Copilot subscription plans** (Free / Pro / Team / Enterprise), no additional cost. Provides a chat interface in the terminal that can autonomously read/write files, execute commands, and complete bug fixes, feature development, documentation updates, and test completion.

Core design: **Autopilot mode** (`--allow-all`) lets the agent operate fully autonomously without step-by-step confirmation; by default, only accesses files in the current directory -- cross-directory access requires explicit authorization; supports **custom instructions** (`.github/copilot-instructions.md`) for project-specific guidelines; deep integration with the GitHub ecosystem (PR review, issue triage, GitHub Actions).

Ideal for developers who already have a GitHub Copilot subscription and work within the GitHub ecosystem -- no additional API setup required.

---

### Amp (Sourcegraph)

A CLI-first agent from Sourcegraph. In early 2026, they **dropped editor extensions to focus entirely on the CLI path**. Emphasizes frontier models, pay-as-you-go pricing, and publishes "Chronicle" showcasing real usage examples (with full token consumption and reasoning traces).

Suited for developers who value transparency and want to observe the agent's decision-making process.

---

## Tool Comparison Overview

| Tool | Open Source | Model | Highlights | Stars |
|------|------------|-------|------------|-------|
| Claude Code | No | Claude | Skills + Hooks + Sub-agent, most feature-complete | -- |
| Codex CLI | Apache-2.0 | ChatGPT plan / API key | Sandbox isolation, three auth modes | ~71k |
| Gemini CLI | Apache 2.0 | Gemini 3 series | Free 1,000/day, 1M context | ~99.8k |
| OpenCode | MIT | 75+ LLMs | TUI + LSP, vendor-agnostic | -- |
| Aider | Apache 2.0 | 100+ LLMs | Auto git commit, most established | ~42.7k |
| Pi | MIT | Any | Minimalist 4 tools, 300-word prompt | -- |
| Kiro CLI | No | Claude Sonnet 4.5 / Auto | Spec-first, official AWS product | -- |
| Cursor CLI | No | Claude / GPT-5 / Gemini | IDE extension, headless/CI | -- |
| GitHub Copilot CLI | No | Copilot models | Bundled with Copilot subscription, GitHub ecosystem | -- |
| Amp | No | Frontier | CLI-first, Chronicle transparency | -- |

## Core Design Pattern: Context Engineering

How well an Agent CLI works is 30% model capability and 70% the context you provide.

**Context files (CLAUDE.md / AGENTS.md / GEMINI.md)** -- tell the agent about this project's conventions, prohibitions, workflows, and anything that can't be inferred from the code itself.

A good context file:

```markdown
# Project Context
This project is ... using ... tech stack, deployed on ...

# Commit Convention
Use conventional commits format for every commit: feat / fix / docs / refactor

# Do Not
- Do not use `git add .`, add files to commit individually
- Do not delete files without asking first
- Do not commit before tests pass

# Workflow
1. Read the relevant tests before modifying code
2. Run `npm test` after making changes
3. Handle bug fixes using TDD approach
```

Principles: **Specific instructions beat vague principles** ("follow clean code" is useless); **prohibitions must be explicit** (the agent doesn't know what you consider obvious constraints); **use layered management** (global settings for common habits, repo root for project-specific conventions).

## Tool Usage and Authorization Modes

**Read-only tools** (typically safe to auto-allow): reading files, searching the codebase, git log / diff

**Write tools** (confirmation recommended): editing/creating/deleting files, git commit / push

**Execution tools** (highest risk): executing shell commands, calling external APIs

Setting the authorization mode to "fully automatic" and then complaining that the agent did something you didn't want is the most common mistake.

## Practical Principles for Effective Use

**Break tasks down instead of giving everything at once:**
```
Bad:  "Convert this entire codebase from REST API to GraphQL"
Good: "First list all external REST endpoints, don't modify any code"
   -> After confirmation: "Convert /users GET and POST to GraphQL, leave everything else alone"
```

**Have the agent plan before executing:**
```
> claude "I want to refactor the auth module, first tell me your plan, don't touch any files"
```

**Package repeatable workflows:** If you type the same instructions for every commit, that's a signal to package it. Claude Code's Skills, Pi's Prompt Templates, and Kiro's Custom Agents all serve this purpose.

**Verification is your responsibility:** The agent won't tell you it made a mistake. Having the agent run tests to confirm they pass, checking `git diff` before critical operations -- these steps are non-negotiable.

## Overall Assessment

```
Selection logic:
Claude Code        -> Most feature-complete, ideal for primary daily use
Codex CLI          -> Open-source and controllable, ideal for sandbox isolation needs
Gemini CLI         -> Generous free tier, ideal for lightweight experimentation or long context
OpenCode           -> LLM-agnostic, ideal for multi-model mixing or local deployment
Aider              -> Auto git commit, ideal for lightweight pair programming
Pi                 -> Minimalist, ideal for understanding internals or custom harnesses
Kiro CLI           -> Spec-first, ideal for AWS ecosystem or spec-driven teams
Cursor CLI         -> IDE extension, ideal for Cursor users needing terminal/CI coverage
GitHub Copilot CLI -> Already have Copilot subscription, ideal for GitHub ecosystem workers
Amp                -> High transparency, ideal for those who care about agent decision process
```

The core trade-off: investing the upfront cost of context engineering in exchange for an efficiency multiplier on every subsequent task. For developers working in the same repo long-term, this investment pays back quickly.

---

## References

- [Claude Code Official Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [OpenAI Codex CLI GitHub](https://github.com/openai/codex)
- [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli)
- [OpenCode GitHub](https://github.com/opencode-ai/opencode)
- [Aider GitHub](https://github.com/paul-gauthier/aider)
- [Pi Coding Agent GitHub](https://github.com/badlogic/lemmy)
- [Kiro Official Website](https://kiro.dev)
- [GitHub Copilot CLI Official Documentation](https://docs.github.com/en/copilot/github-copilot-in-the-cli/about-github-copilot-in-the-cli)
- [Amp](https://ampcode.com)
- [Cursor CLI Official Website](https://cursor.com/cli)
- [AGENTS.md Standard Draft](https://agentsmd.org/)
- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.io/)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
