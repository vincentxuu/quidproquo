---
title: "Pi Coding Agent: A Minimalist Open-Source Terminal Coding Harness"
date: 2026-03-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, ollama, openclaw]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 10
tldr: "Pi is a minimalist coding agent by Mario Zechner (TypeScript, MIT, ~93K stars) with just 4 core tools and a very short system prompt — everything else you add yourself via Extensions, Skills, and Prompt Templates. It deliberately omits MCP, sub-agents, plan mode, and permission popups. The repo is now earendil-works/pi and the npm scope is @earendil-works."
description: "An overview of Pi Coding Agent's design philosophy, architecture, core features, extension system, its relationship with OpenClaw, and how it compares to other coding agents."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)

Pi is an open-source coding agent built by Mario Zechner (GitHub: badlogic), centered on a single principle: minimal but extensible. It ships with just 4 tools and a very short system prompt — and leaves everything else up to you. Site: [pi.dev](https://pi.dev/); repo: [earendil-works/pi](https://github.com/earendil-works/pi), MIT licensed, around 93K stars.

## Installation

```bash
# Launch via Ollama with a single command
ollama launch pi

# Install via npm
npm install -g @earendil-works/pi-coding-agent
```

## Design Philosophy

What Pi deliberately omits is just as important as what it includes.

### Only 4 Core Tools

| Tool | Function |
|---|---|
| `read` | Read files |
| `write` | Write files |
| `edit` | Edit files |
| `bash` | Execute shell commands |

No built-in sub-agents, no plan mode, no MCP — but all of these can be added through Extensions.

### A very short system prompt

Most coding agents have system prompts thousands of words long. Pi keeps its deliberately tiny, maximizing prompt cache hit rates and minimizing token consumption. The short prompt is also what leaves room for real context engineering — deciding what enters the context window and how it's managed.

> **The package and repo were renamed**: the npm scope moved from `@mariozechner` to `@earendil-works`, and GitHub from `badlogic/pi-mono` to `earendil-works/pi` (the old URLs 301). Existing global installs can use `pi update --self`, which follows the package name returned by the version-check endpoint.

## Core Features

| Feature | Description |
|---|---|
| 4 Execution Modes | Interactive, Print/JSON (output), RPC (programmatic integration), SDK (embed in apps) |
| Compaction | Automatically summarizes older messages when approaching the context limit; summary strategy is customizable via Extension |
| Skills | On-demand capability packs (commands + tools) that don't occupy the prompt cache |
| Dynamic Context | Extensions can inject messages before each turn, filter history, or implement RAG and long-term memory |
| Multi-Provider | Supports Anthropic, OpenAI, Google, Azure, Bedrock, Mistral, Groq, Cerebras, xAI, Hugging Face, and more |
| Mid-Session Model Switching | Switch models during an active session |

## Extension System

Pi's extension system consists of TypeScript modules with access to:

- **Tools**: Add custom tools
- **Commands**: Add custom commands
- **Keyboard shortcuts**: Bind custom actions
- **Events**: Listen to agent lifecycle events
- **TUI**: Full access to the terminal UI

Through Extensions, you can implement sub-agents, plan mode, permission control, sandboxing, MCP integration, and more. Pi's philosophy: rather than bundling everything and letting you disable what you don't need, it lets you load only what you actually use.

## TUI Engine

Pi's TUI is powered by `@mariozechner/pi-tui`, featuring:

- Flicker-free diff rendering
- CSI 2026 synchronized output
- Bracketed paste handling
- Inline image support (Kitty / iTerm2 protocols)
- Autocomplete and overlay dialogs

## Relationship with OpenClaw (this changed)

The familiar description — "OpenClaw is the shell, Pi is its agent runtime core" — **is out of date**.

The two projects' official positions no longer agree, so here are both:

- **On the OpenClaw side**: the docs now state that the built-in runtime id is `openclaw`, that `pi` is a legacy alias that gets normalized away, and explicitly that there is "no external agent framework package" anymore. That part was absorbed into OpenClaw's own code and is no longer a plugged-in dependency. Details in [the OpenClaw reference post](/posts/ai/2026-03-28-openclaw-pi-reference-en).
- **On the Pi side**: pi.dev still lists OpenClaw as the real-world example of its SDK mode.

The safer reading: **Pi's SDK mode was (and is still cited as) OpenClaw's embedding example, but OpenClaw's built-in runtime is no longer "Pi bolted on."** If you see a `pi` runtime id in a config file, that's the legacy alias.

The author's public commentary on this relationship is worth reading too — after Pi landed inside OpenClaw, his issue tracker filled with content auto-generated by OpenClaw instances, and he ended up auto-closing PRs with a request that humans rewrite the issue in their own words as a filter. It's a real side effect of an open source project being amplified by an agent ecosystem.

Pi has always worked perfectly fine standalone — no OpenClaw required.

## Someone built Pi's inverse: omp

Pi's list of deliberate omissions reads like someone else's to-do list. `can1357/oh-my-pi` (the binary is `omp`) is a fork of Pi that opened 2025-12-31 and has accumulated 18,392 commits and 25,706 stars in eight months. It adds back everything Pi declined: built-in tools go from 7 to 31, plus 14 LSP operations, 28 DAP operations, subagents, an advisor model, and approval modes.

The split is not only at the feature layer — omp adds roughly 80,000 lines of Rust, pulling grep, shell, AST, and PTY in-process. The language mix shifts from Pi's "TypeScript 8.5 MB, C 10 KB" to "TypeScript 50.1 MB, Rust 5.2 MB."

Both remain MIT; omp's LICENSE carries joint copyright. Details in [omp (Oh My Pi): The Fork That Inverts Pi's Minimalism](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en).

## Resource Requirements

Pi can run on very small models:

| Use Case | Model |
|---|---|
| Lightweight use | Qwen3:1.7b (local) |
| General development | Claude Sonnet, GPT-4o |
| Complex tasks | Claude Opus, GPT-5 |

Specific model IDs turn over every quarter, so this table talks in tiers. The point is that Pi is unusually friendly to small models — a very short system prompt and four tools keep even a 1.7B local model viable, which a fully featured harness cannot do.

## Comparison with Other Coding Agents

| | Pi | Claude Code | Codex CLI | OpenCode |
|---|---|---|---|---|
| Language | TypeScript | TypeScript | Rust | TypeScript |
| Core tools | 4 | Multiple | Multiple | Multiple |
| Design philosophy | Minimal + extensible | Feature-complete | OpenAI ecosystem integration | Model flexibility |
| Built-in sub-agents | ❌ (via Extension) | ✅ | ✅ | ✅ |
| Built-in MCP | ❌ (via Extension) | ✅ | ✅ | ❌ |
| Minimum viable model | 1.7B | Requires large model | Requires OpenAI model | Flexible |

## Typical Use Cases

1. **Minimalist development**: When you only need basic read/write/edit capabilities without the overhead of complex features
2. **Custom agents**: Build a fully tailored coding workflow using the Extension system
3. **Local small models**: Connect to Ollama and run a 1.7B model in resource-constrained environments
4. **Embedding in apps**: Use SDK mode to integrate Pi directly into your own product
5. **Embedding**: use SDK mode to put an agent inside your own product

## Positioning vs. Other Tools

Pi's core strengths are its minimalist design (low token consumption, high prompt cache hit rates), unlimited extensibility via TypeScript Extensions, and friendly support for small models. It's the right fit for developers who prefer the "build it yourself" approach and want full control over agent behavior.

## References

- [Pi official site, pi.dev](https://pi.dev/)
- [GitHub - earendil-works/pi](https://github.com/earendil-works/pi)
- [The author's retrospective on building a minimal coding agent](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Mario Zechner's talk: Building pi in a World of Slop (AI Engineer)](https://www.youtube.com/watch?v=RjfbvDXpFls)
- [OpenClaw reference: Pi has been absorbed](/posts/ai/2026-03-28-openclaw-pi-reference-en)
- [omp (Oh My Pi): The Fork That Inverts Pi's Minimalism](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en)
- [GitHub - can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)

## Changelog

- 2026-08-18: Refreshed against pi.dev and the repo. (1) The repo was renamed from `badlogic/pi-mono` to `earendil-works/pi` and the npm scope to `@earendil-works`; install commands updated. (2) **Rewrote the OpenClaw section** — the old "Pi is OpenClaw's AI core engine" layer table is out of date; OpenClaw's built-in runtime id is now `openclaw` with `pi` as a legacy alias, and the disagreement between the two projects' docs is now noted. (3) Corrected OpenCode's language in the comparison table (Go → TypeScript). (4) Replaced hardcoded model IDs with tiers
- 2026-08-19: Added the "Someone built Pi's inverse: omp" section covering the `can1357/oh-my-pi` fork and its scale (31 tools, ~80k lines of Rust, 18,392 commits), with cross-links to the dedicated article in References.
