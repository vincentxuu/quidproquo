---
title: "Pi Coding Agent: A Minimalist Open-Source Terminal Coding Harness"
date: 2026-03-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, ollama, openclaw]
lang: en
tldr: "Pi is a minimalist coding agent built in TypeScript by Mario Zechner, featuring just 4 core tools (read, write, edit, bash) and a 300-word system prompt. It's extensible via Extensions, Skills, and Prompt Templates, runs on the Bun runtime, and ships with built-in Ollama support via `ollama launch pi`."
description: "An overview of Pi Coding Agent's design philosophy, architecture, core features, extension system, its relationship with OpenClaw, and how it compares to other coding agents."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)

Pi is an open-source coding agent built by Mario Zechner (GitHub: badlogic), centered on a single principle: minimal but extensible. The entire system is roughly 4,000 lines of TypeScript, ships with just 4 tools and a 300-word system prompt — and leaves everything else up to you.

## Installation

```bash
# Launch via Ollama with a single command
ollama launch pi

# Install via npm
npm install -g @mariozechner/pi-coding-agent
```

Runs on the Bun runtime for fast startup.

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

### 300-Word System Prompt

Most coding agents have system prompts thousands of words long. Pi uses just 300 words, maximizing prompt cache hit rates and minimizing token consumption.

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

## Relationship with OpenClaw

| Layer | Owner | Responsibility |
|---|---|---|
| Gateway | OpenClaw | Channel management, routing, authentication, scheduling |
| Agent Runtime | Pi | Reasoning, tool execution, context management |
| Session | Shared | OpenClaw owns the session; Pi runs the agent loop |
| Memory | Pi | Markdown files, vector search |

Pi serves as OpenClaw's AI core engine. OpenClaw handles the outer layer (channels, security, scheduling); Pi handles the inner layer (reasoning, execution, memory). Pi's configuration is passed through OpenClaw's `agents.defaults` and `agents.list[]`.

That said, Pi works perfectly fine as a standalone tool — no OpenClaw required.

## Resource Requirements

Pi can run on very small models:

| Use Case | Model |
|---|---|
| Lightweight use | Qwen3:1.7b (local) |
| General development | Claude Sonnet, GPT-4o |
| Complex tasks | Claude Opus, GPT-5 |

Compared to OpenClaw, which requires at least a 64K context window, Pi is far more flexible.

## Comparison with Other Coding Agents

| | Pi | Claude Code | Codex CLI | OpenCode |
|---|---|---|---|---|
| Language | TypeScript | TypeScript | Rust | Go |
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
5. **OpenClaw core**: Serve as the agent runtime for an OpenClaw Gateway

## Positioning vs. Other Tools

Pi's core strengths are its minimalist design (low token consumption, high prompt cache hit rates), unlimited extensibility via TypeScript Extensions, and friendly support for small models. It's the right fit for developers who prefer the "build it yourself" approach and want full control over agent behavior.

## Resources

- [GitHub - badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [npm - @mariozechner/pi-coding-agent](https://www.npmjs.com/package/@mariozechner/pi-coding-agent)
- [Pi development retrospective (author's blog)](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Ollama announces Pi integration](https://www.sci-tech-today.com/news/ollama-pi-coding-agent-launch-openclaw-customization/)
- [shittycodingagent.ai](https://shittycodingagent.ai/)

## References

- [Pi Coding Agent GitHub: badlogic/pi-mono — minimalist open-source terminal coding harness](https://github.com/badlogic/pi-mono)
- [Claude Code GitHub: anthropics/claude-code (used as a comparison reference)](https://github.com/anthropics/claude-code)
- [Pi Coding Agent author's blog: pi-mono design philosophy and TUI engine development](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [npm - @mariozechner/pi-coding-agent (Pi Coding Agent installation source)](https://www.npmjs.com/package/@mariozechner/pi-coding-agent)
