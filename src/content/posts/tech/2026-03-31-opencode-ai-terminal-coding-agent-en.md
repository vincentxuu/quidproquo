---
title: "OpenCode: A Complete Guide to the Open-Source AI Terminal Coding Agent"
date: 2026-03-31
type: project
category: tech
tags: [opencode, ai-tools, cli, coding-agent, open-source, tui]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 8
tldr: "OpenCode is an open-source AI coding agent written in TypeScript (MIT, ~198K GitHub stars, repo at anomalyco/opencode) with a built-in TUI, 75+ LLM providers, LSP integration, a Vim-style editor, SQLite session management, and a desktop app. Free, no subscription, local or cloud models."
description: "OpenCode installation, core features, dual agent modes, GitHub Actions integration, comparison with Aider, and recommended use cases."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)

OpenCode is an open-source AI coding agent written in **TypeScript** (MIT licensed) that runs in your terminal. No subscription, 75+ LLM providers, and around **198K GitHub stars** — the highest in this space. The repo has moved a few times and now lives at [anomalyco/opencode](https://github.com/anomalyco/opencode) (formerly `sst/opencode`).

> **⚠️ Don't confuse it with the identically named Go project**: an earlier `opencode-ai/opencode` was written in Go with Bubble Tea and is not the same codebase. Most "OpenCode is written in Go" claims online trace back to that.

## Installation

```bash
# One-liner install via curl
curl -fsSL https://opencode.ai/install | bash

# npm
npm i -g opencode-ai@latest

# Homebrew
brew install anomalyco/tap/opencode

# Other options
# Scoop / Chocolatey (Windows), pacman (Arch), Nix
```

## Core Features

| Feature | Description |
|---|---|
| TUI interface | Interactive terminal UI close to an IDE experience; a desktop app (beta) and IDE extension also exist |
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

## Changelog

- 2026-08-18: Corrected three substantive errors against the official repo: the language is TypeScript not Go, the license is MIT, and the repo moved to `anomalyco/opencode`. Stars 95K → ~198K; fixed the npm package name (`opencode-ai`) and Homebrew tap; added the desktop app; added to the Choosing an Agent CLI series
