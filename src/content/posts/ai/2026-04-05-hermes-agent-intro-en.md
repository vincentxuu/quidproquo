---
title: "Hermes Agent: Nous Research's Self-Improving AI Agent"
date: 2026-04-05
type: guide
category: ai
tags: [hermes-agent, nous-research, ai-agent, self-improving, gateway, multi-platform, openclaw]
lang: en
tldr: "Hermes Agent is an open-source self-improving AI agent by Nous Research, featuring persistent memory, skill learning, 40+ tools, multi-platform gateways, support for 200+ model providers, and serving as the official successor to OpenClaw."
description: "An in-depth look at Hermes Agent's architecture, memory and skill systems, multi-platform gateway, terminal backends, model integration, and its relationship with OpenClaw."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-hermes-agent-intro)

Hermes Agent is an open-source AI agent framework by Nous Research. Its core positioning is "an agent that teaches itself" — after completing tasks it automatically creates skills, continuously improves during use, and proactively reminds itself to consolidate memory. It's not just a chat interface but a complete AI agent operating system, connecting everything from local CLI to Telegram, Discord, WhatsApp, with model providers switchable at any time and execution environments ranging from local machines to serverless.

If you previously followed OpenClaw, Hermes Agent is its official successor, providing a complete migration path.

## Core Architecture

```
User
  ↓
CLI / Telegram / Discord / Slack / WhatsApp / Signal
  ↓
Gateway (Unified Gateway)
  ↓
Agent Core (Reasoning + Decision Making)
  ├── Tools (40+ tools)
  ├── Skills (Procedural Memory)
  ├── Memory (Persistent Memory + FTS5 Search)
  └── Cron (Scheduled Tasks)
  ↓
LLM Provider (Nous Portal / OpenRouter / OpenAI / Anthropic / Custom)
```

The entire system is written in Python (93%), uses `uv` for package management, and deploys with a single `curl` command. The directory structure is cleanly divided into six main modules: `agent/`, `gateway/`, `skills/`, `tools/`, `hermes_cli/`, and `cron/`.

## Self-Improvement Loop

This is the biggest differentiator between Hermes Agent and typical agent frameworks. It has a built-in learning cycle:

1. After **completing complex tasks**, it automatically abstracts the process into reusable Skills
2. **While using Skills**, it continuously fine-tunes and improves them
3. It **periodically reminds itself** to organize and consolidate accumulated knowledge

The memory system uses FTS5 full-text search + LLM summarization, enabling cross-session historical conversation retrieval. It also implements a "user profile dialectic" inspired by Honcho — as interactions increase, the agent's understanding of you deepens over time.

The skill format is compatible with the [agentskills.io](https://agentskills.io) open standard, meaning skills can be shared across frameworks.

## Multi-Platform Gateway

The Gateway is Hermes's control plane — a single process managing all platform connections:

| Platform | Support |
|----------|---------|
| Telegram | Bot API |
| Discord | Bot |
| Slack | App |
| WhatsApp | Pairing Connection |
| Signal | Bridge |
| Email | Send & Receive |
| Home Assistant | Integration |

Setup process:

```bash
hermes gateway setup    # Interactive setup for platform credentials
hermes gateway start    # Start the gateway and begin listening
```

All platforms share the same agent core, maintaining conversation continuity across platforms. The Gateway also supports voice memo transcription.

## Terminal Backends

The agent's command execution environment is switchable — it doesn't have to run locally:

| Backend | Characteristics |
|---------|----------------|
| **Local** | Executes directly on the local machine, simplest option |
| **Docker** | Container isolation, higher security |
| **SSH** | Connects to a remote server for execution |
| **Daytona** | Serverless dev environment, auto-hibernates when idle |
| **Modal** | Serverless compute, near-zero cost between sessions |
| **Singularity** | Container alternative |

Modal and Daytona are particularly suited for intermittent use — they only spin up when a message is received, costing nothing the rest of the time.

## Model Integration

Not locked to any provider. Switch with a single `hermes model` command:

```bash
hermes model                     # Interactive selection
hermes model openrouter:mixtral  # Direct specification
```

Supported providers:

- **Nous Portal** — Nous Research's own platform
- **OpenRouter** — 200+ models, one key for everything
- **OpenAI** / **Anthropic** — Direct connection
- **z.ai / GLM** / **Kimi / Moonshot** / **MiniMax** — Chinese model providers
- **Custom endpoints** — Any OpenAI-compatible API

Switching requires no code changes, no restarts, and no reconfiguration.

## Tool Ecosystem

40+ built-in tools covering:

- File operations and terminal execution
- Web browsing and search
- API calls
- Sub-Agent spawning (can spawn isolated child agents for parallel processing)
- MCP support (connect to any MCP server via `mcp_serve.py`)

Tool enabling/disabling is managed through `hermes tools`.

## Scheduled Tasks

Built-in cron scheduler that lets you define tasks in natural language — no need to write cron syntax manually:

- Daily reports
- Nightly backups
- Weekly audits

Results are pushed through your configured platforms (Telegram, Discord, etc.).

## CLI Operations

```bash
# System management
hermes setup     # Full setup wizard
hermes update    # Update to latest version
hermes doctor    # Diagnose issues

# In conversation
/new             # New conversation
/retry           # Retry last response
/undo            # Undo
/compress        # Compress context
/usage           # Token usage
/insights        # Usage statistics
/skills          # Browse skills
/personality     # Switch personality
/model           # Switch model
```

## Migrating from OpenClaw

If you were previously using OpenClaw, Hermes provides a complete migration path:

```bash
hermes claw migrate              # Interactive full migration
hermes claw migrate --dry-run    # Preview without executing
hermes claw migrate --preset user-data  # Migrate data only, not keys
```

What gets migrated: Persona files (SOUL.md), memory (MEMORY.md, USER.md), custom skills, command whitelists, platform settings, API keys, TTS audio files, and AGENTS.md.

## Research Use Cases

Beyond daily use, Hermes Agent also supports AI research scenarios:

- **Trajectory batch generation**: Use `batch_runner.py` to generate large volumes of tool-calling training data
- **Atropos RL integration**: Connect to reinforcement learning environments via the `tinker-atropos` submodule
- **Trajectory compression**: Prepare data for training next-generation tool-calling models

This makes it not just a user tool, but also a research platform.

## Comparison with Other Frameworks

| Aspect | Hermes Agent | LangGraph | Claude Code |
|--------|-------------|-----------|-------------|
| Self-improvement | Built-in learning loop | Must build yourself | None |
| Multi-platform | 7+ platform gateways | Must build yourself | CLI / IDE |
| Model providers | 200+ | Self-integration | Anthropic only |
| Execution environments | 6 backends | Self-deployment | Local |
| Skill system | Auto-creation + sharing | None | Yes (manual) |
| Open source | MIT | MIT | Partially open source |

Hermes's positioning leans more toward a "personal AI operating system" rather than a simple agent framework. It bundles communication, execution, learning, and scheduling into a unified interface.

## Overall Assessment

Hermes Agent's core trade-off is **feature completeness in exchange for complexity**. It's not a lightweight library but a complete system. It's suited for:

- Those wanting a cross-platform AI assistant, not just in the terminal
- Those needing an agent that remembers context and accumulates experience
- Those wanting to flexibly switch between multiple model providers
- Those interested in using agents to generate training data for research

Scenarios where it's not a fit: just wanting to call an LLM API from code, needing a lightweight SDK to embed in an existing application, or enterprise-level deployment for team collaboration (currently geared toward personal use).

## References

- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)
- [Nous Research Official Site](https://nousresearch.com/)
- [agentskills.io — Skill Open Standard](https://agentskills.io)
- [OpenRouter — Multi-Model Provider Platform](https://openrouter.ai/)
- [Honcho — User Profile System](https://github.com/plastic-labs/honcho)
- [Atropos RL Environment](https://github.com/NousResearch/Atropos)
- [Modal — Serverless Compute Platform](https://modal.com/)
- [Daytona — Serverless Dev Environment](https://www.daytona.io/)
