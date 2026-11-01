---
title: "OpenCode: A Complete Guide to the Open-Source AI Terminal Coding Agent"
date: 2026-03-31
type: project
category: tech
tags: [opencode, ai-tools, cli, coding-agent, open-source, tui]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 9
tldr: "OpenCode is an open-source AI coding agent written in TypeScript (MIT, repo at anomalyco/opencode) with a built-in TUI, 75+ LLM providers, LSP integration, a Vim-style editor, SQLite session management, and a desktop app. The tool is free; native free models and paid or local providers are separate choices."
description: "OpenCode installation, core features, dual agent modes, GitHub Actions integration, comparison with Aider, and recommended use cases."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)

OpenCode is an open-source AI coding agent written in **TypeScript** (MIT licensed) that runs in your terminal. The application requires no subscription and supports multiple LLM providers. The repo has moved a few times and now lives at [anomalyco/opencode](https://github.com/anomalyco/opencode) (formerly `sst/opencode`).

> **⚠️ Don't confuse it with the identically named Go project**: an earlier `opencode-ai/opencode` was written in Go with Bubble Tea and is not the same codebase. Most "OpenCode is written in Go" claims online trace back to that.

## Installation: distinguish V1 and V2

For a new V2 installation, use the V2 package and check the resulting version:

```bash
npm install --global @opencode/cli
opencode --version
opencode
```

V1 instructions such as `npm install -g opencode-ai` belong to the older release. Both versions use the `opencode` command, so do not assume the command name identifies the version. On Windows, use the standalone CLI download from the [V2 installation page](https://opencode.ai/v2/docs); V2 does not currently support Windows package managers.

The feature overview below retains the original V1 interface context. For the changed backend, desktop app, and APIs, see the [OpenCode 2 architecture guide](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en).

## Free software and free models

The OpenCode application is open source. Its built-in free models provide a way to try it without first connecting OpenRouter or buying a subscription. In V2, open `/models`, find a free entry, and check that both Input and Output are Free in the [official model table](https://opencode.ai/v2/docs/console/models). Big Pickle uses the ID `opencode/big-pickle`; its name does not need to contain “Free.” Availability and usage limits can change.

OpenCode Console also provides paid models, and Go is an optional subscription. External providers apply their own pricing and allowances. A previously purchased subscription is still a paid plan, even when it avoids a separate API bill.

Free cloud models still receive your prompts. Provider data terms differ: Big Pickle's free-period data may be used to improve the model. Choose a suitable provider or local model before submitting private code.

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
| Language | TypeScript | Python |
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

For step-by-step setup, finding free models, and a first everyday prompt, read [How to use LLMs for free with OpenCode 2 and OpenRouter](/posts/ai/2026-11-01-free-llm-opencode2-openrouter-en).

## Changelog

- 2026-11-01: Distinguished V1 and V2 installation, added native free models and pricing checks, corrected the cloud-privacy boundary and current repository references; removed stale popularity counts.
- 2026-08-18: Corrected three substantive errors against the official repo: the language is TypeScript not Go, the license is MIT, and the repo moved to `anomalyco/opencode`. Stars 95K → ~198K; fixed the npm package name (`opencode-ai`) and Homebrew tap; added the desktop app; added to the Choosing an Agent CLI series

## References

- [OpenCode GitHub](https://github.com/anomalyco/opencode)
- [OpenCode V2 installation](https://opencode.ai/v2/docs)
- [OpenCode V2 CLI commands](https://opencode.ai/v2/docs/cli/commands)
- [OpenCode Console models and privacy](https://opencode.ai/v2/docs/console/models)
- [OpenCode V2 models](https://opencode.ai/v2/docs/models/)
- [OpenCode V1 documentation](https://opencode.ai/docs/)
