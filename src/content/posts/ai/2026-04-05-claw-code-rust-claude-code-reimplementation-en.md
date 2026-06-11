---
title: "Claw Code: An Open-Source CLI Agent That Rewrites Claude Code in Rust"
date: 2026-04-05
type: project
category: ai
tags: [agent-cli, claude-code, claw-code, rust, open-source, multi-agent, mcp]
lang: en
tldr: "Claw Code is a from-scratch Rust rewrite of the Claude Code CLI, featuring 48K lines of code, 40 tools, and MIT licensing. Most remarkably, the entire project was built by multiple AI agents collaborating over just 5 days, surpassing 170K GitHub stars within a week of launch."
description: "An overview of Claw Code's architecture, tool system, feature-parity strategy with Claude Code, and its significance as a product of multi-agent collaboration."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation)

Claude Code is Anthropic's official CLI agent tool, but it's not open source. Claw Code did something bold: **rewrite a feature-aligned alternative from scratch in Rust** — and the entire development process itself was a public experiment in multi-AI-agent collaboration.

## Project Positioning

Claw Code is not a fork of Claude Code, nor is it a thin API wrapper. It's a complete Rust rewrite aiming for feature parity with Claude Code, while delivering the performance and safety guarantees that Rust provides.

Key facts:

| Item | Details |
|------|---------|
| Language | Rust (edition 2021) |
| Codebase | ~48,600 lines of Rust + 2,568 lines of tests |
| Tool Count | 40 tool specs |
| Default Model | claude-opus-4-6 |
| License | MIT |
| Development Time | 5 days (2026-03-31 – 2026-04-04) |

Worth emphasizing: Claw Code is **not affiliated with Anthropic** — the project documentation explicitly states this.

## Architecture

Claw Code uses a Cargo workspace structure split into 9 crates, each with a clear responsibility:

| Crate | Responsibility |
|-------|---------------|
| `api` | Provider client, SSE streaming, API Key + OAuth authentication |
| `commands` | Slash command registration and rendering |
| `compat-harness` | Extracts tool/prompt manifests from upstream TypeScript source |
| `mock-anthropic-service` | Deterministic local mock service for parity testing |
| `plugins` | Plugin installation, activation, and deactivation management |
| `runtime` | Session management, config loading, permission system, MCP client, system prompt assembly |
| `rusty-claude-cli` | Main CLI binary (`claw`), REPL, streaming display |
| `telemetry` | Session tracing and usage telemetry |
| `tools` | All built-in tools (Bash, Read, Write, Edit, Glob, Grep, Agent, etc.) |

The entire workspace enforces `unsafe_code = "forbid"` and strict Clippy lints — a highly disciplined approach for a 48K-line Rust project.

## Tool System

Claw Code exposes 40 tool specs, covering nearly the full tool surface of Claude Code:

**Core Tools:**
- Bash execution, file read/write/edit
- Glob search, Grep content search
- Web search / fetch

**Advanced Tools:**
- Sub-agent spawning (Task, Team)
- Cron scheduled tasks
- LSP integration
- MCP server lifecycle management
- Notebook editing
- Todo tracking

**Feature-Parity Strategy with Claude Code:**

The `compat-harness` crate deserves special attention. It directly parses Claude Code's upstream TypeScript source to extract tool specs and prompt manifests, ensuring Claw Code's tool behavior remains consistent with the original. Combined with the 10 deterministic test scenarios provided by `mock-anthropic-service`, this forms a systematic parity verification mechanism.

## Feature Highlights

### Interactive REPL + One-Shot Prompts

```bash
# Interactive mode
./target/debug/claw

# One-shot prompt
./target/debug/claw prompt "summarize this repository"
```

### Dual Authentication Tracks

```bash
# API Key
export ANTHROPIC_API_KEY="sk-ant-..."

# OAuth login
./target/debug/claw login
```

### Permission Tiers

| Mode | Description |
|------|-------------|
| Read-only | Can only read files and search |
| Workspace-write | Can write within the working directory |
| Full-access | Full permissions, including bash execution |

### Session Persistence

Sessions are stored in JSONL format and support resumption after interruption. This mirrors Claude Code's behavior — you can close your terminal and pick up where you left off with `claw resume`.

### Layered Config Merging

Supports user → project → local three-tier config, with merging logic similar to Claude Code's settings structure. Also supports `CLAUDE.md` / project memory files.

## Installation and Usage

```bash
# Build
cd rust
cargo build --workspace

# Health check
./target/debug/claw doctor

# Test
cargo test --workspace

# Mock parity tests
./scripts/run_mock_parity_harness.sh
```

There are currently no precompiled binary releases — you need to build from source.

## A Product of Multi-Agent Collaboration

What makes Claw Code most remarkable isn't just what it does, but **how it was built**.

The entire project was completed in 5 days by multiple AI coding agents collaborating, with humans issuing instructions via Discord rather than traditional pair programming. The development process used three coordination tools:

| Tool | Role |
|------|------|
| **clawhip** | Event/notification router, monitoring git commits, tmux sessions, GitHub issues |
| **oh-my-codex (OmX)** | Workflow layer that transforms instructions into structured multi-agent execution |
| **oh-my-openagent (OmO)** | Multi-agent coordination — planning, handoffs, review loops |

3 authors, 292 commits, 5 days — this velocity alone is a public answer to the question "Can AI agents write production-quality software?"

## Comparison with Claude Code

| Aspect | Claude Code | Claw Code |
|--------|------------|-----------|
| Language | TypeScript / Node.js | Rust |
| License | Proprietary | MIT |
| Model Support | Claude family | Claude family (same) |
| Tool Count | ~40+ | 40 |
| MCP Support | Native | Yes (lifecycle + inspection) |
| Plugin System | Yes | Yes |
| Installation | npm | cargo build |
| Performance | Node.js level | Rust native performance |

Feature-wise they're nearly aligned, with the main differences being the language ecosystem and licensing model. Claw Code's Rust implementation has inherent advantages in startup speed and memory usage, but Claude Code as the official tool benefits from tighter model integration and guaranteed continuous updates.

## Current Status

| Metric | Value |
|--------|-------|
| GitHub Stars | ~170K |
| Forks | ~103K |
| Open Issues | 1,413 |
| License | MIT |
| Organization | UltraWorkers |
| Community | Discord (discord.gg/5TUQKqFWd) |

170K stars in under a week — the project claims to be "the fastest repo in history to break 100K stars." Even accounting for potential community amplification effects, this number still reflects strong market demand for an open-source Claude Code alternative.

## Use Cases

**Good fit:**

- Want an open-source, auditable Claude Code alternative
- Developers who prefer the Rust ecosystem
- Need to customize or extend agent tool behavior
- Want to deploy a Claude agent in controlled environments (containerization support is documented)

**Not ideal for:**

- Enterprise users who need official support and guarantees
- Users who don't want to build and maintain the tool themselves
- Scenarios requiring non-Claude models

## References

- [Claw Code GitHub Repository](https://github.com/ultraworkers/claw-code)
- [oh-my-codex GitHub Repository](https://github.com/Yeachan-Heo/oh-my-codex)
- [Claude Code Complete Analysis](/posts/ai/2026-04-02-agent-cli-claude-code)
- [oh-my-codex Workflow Enhancement Layer Introduction](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)
