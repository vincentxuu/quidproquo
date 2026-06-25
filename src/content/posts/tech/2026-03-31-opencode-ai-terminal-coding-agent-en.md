---
title: "OpenCode: A Complete Guide to the Open-Source AI Terminal Coding Agent"
date: 2026-03-31
type: project
category: tech
tags: [opencode, ai-tools, cli, coding-agent, open-source, tui]
lang: en
tldr: "OpenCode is an open-source AI coding agent built in Go (95K+ GitHub stars) with a built-in TUI, support for 75+ LLMs, LSP integration, Vim-style editing, and SQLite session management. Free, no subscription required — works with local or cloud models."
description: "OpenCode installation, core features, dual agent modes, GitHub Actions integration, comparison with Aider, and recommended use cases."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)

OpenCode is an open-source AI coding agent built in Go by the SST/AnomalyCo team, running entirely in your terminal. No subscription required, supports 75+ LLM providers, and amassed 95K+ GitHub stars shortly after its Q4 2025 launch.

## Installation

```bash
# One-liner install via curl
curl -fsSL https://opencode.ai/install | bash

# npm
npm install -g opencode

# Homebrew
brew install opencode

# Other options
# Scoop / Chocolatey (Windows), pacman (Arch), Nix
```

## Core Features

| Feature | Description |
|---|---|
| TUI Interface | Interactive terminal UI built with Bubble Tea — feels close to an IDE |
| 75+ LLMs | OpenAI, Anthropic, Google, AWS Bedrock, Groq, Azure, OpenRouter, local models (Ollama, LM Studio) |
| LSP Integration | Language Server Protocol support for intelligent completions and semantic analysis |
| Vim-style Editor | Edit files directly in the terminal using Vim keybindings |
| SQLite Sessions | Persistent conversation history with cross-session context retention |
| GitHub Integration | Trigger tasks from PR comments using `/opencode` or `/oc` |

## Dual Agent Modes

OpenCode ships with two built-in agents, switchable with `Tab`:

| Agent | Permissions | Purpose |
|---|---|---|
| **Build** (default) | Full read/write | Development work: writing code, fixing bugs, refactoring |
| **Plan** | Read-only | Analysis and exploration: understanding codebases, planning architecture, code review |

This design lets you quickly switch between "doing" and "thinking." Plan mode never accidentally modifies any files.

## Supported Model Providers

One of OpenCode's biggest selling points is model freedom:

**Cloud:**
- OpenAI (GPT-4o, GPT-5, o3, etc.)
- Anthropic (Claude Sonnet, Opus, etc.)
- Google (Gemini Pro, Ultra)
- AWS Bedrock, Azure OpenAI
- Groq, OpenRouter, DeepSeek

**Local:**
- Ollama
- LM Studio
- Any OpenAI-compatible API

No vendor lock-in — swap providers whenever you want.

## GitHub Actions Integration

Add `/opencode` or `/oc` to a GitHub PR or Issue comment, and OpenCode will execute the task inside a GitHub Actions runner:

```
/opencode fix the lint errors and run the tests
```

Great for automating code review responses and simple fixes.

## OpenCode vs. Aider

| | OpenCode | Aider |
|---|---|---|
| GitHub Stars | 95K+ | 39K+ |
| Language | Go | Python |
| Interface | TUI (IDE-like) | CLI |
| Key Features | LSP integration, parallel sessions, shareable links | Git-first workflow with auto-commits after every AI edit |
| Best For | Interactive dev sessions, exploratory work | Systematic refactoring, repo-wide changes |

Many developers use both: Aider for systematic refactoring, OpenCode for interactive development.

## Typical Use Cases

1. **Interactive development**: Conversational coding in the TUI with real-time feedback
2. **Code exploration**: Use Plan mode to read-only analyze an unfamiliar codebase
3. **Multi-model comparison**: Switch between providers within the same session to compare results
4. **Local model development**: Connect Ollama for fully offline operation
5. **GitHub automation**: Trigger AI tasks directly from PRs

## How OpenCode Compares to Other Tools

OpenCode's core strengths: completely free and open-source, no vendor lock-in across 75+ model providers, an IDE-like TUI experience, and semantic-level understanding via LSP integration. Ideal for developers who want maximum model flexibility and refuse to be tied to any single provider.

## Resources

- [GitHub - opencode-ai/opencode](https://github.com/opencode-ai/opencode)
- [OpenCode Official Site](https://opencode.ai/)
- [OpenCode Documentation](https://opencode.ai/docs/)
- [CLI Usage Guide](https://opencode.ai/docs/cli/)
- [freeCodeCamp Tutorial](https://www.freecodecamp.org/news/integrate-ai-into-your-terminal-using-opencode/)

## References

- [OpenCode GitHub: sst/opencode open-source AI terminal coding agent (95K+ stars)](https://github.com/sst/opencode)
- [OpenCode Official Website: open-source AI terminal coding agent overview](https://opencode.ai/)
- [OpenCode Official Docs: terminal coding agent CLI usage](https://opencode.ai/docs/)
- [freeCodeCamp: Integrate AI into your terminal workflow using OpenCode](https://www.freecodecamp.org/news/integrate-ai-into-your-terminal-using-opencode/)
