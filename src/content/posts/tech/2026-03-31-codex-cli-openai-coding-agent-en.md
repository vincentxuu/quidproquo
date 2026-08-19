---
title: "Codex CLI: A Complete Guide to OpenAI's Open-Source Terminal Coding Agent"
date: 2026-03-31
type: project
category: tech
tags: [codex, openai, ai-tools, cli, coding-agent, open-source]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 4
tldr: "Codex CLI is OpenAI's open source terminal coding agent (Rust, Apache-2.0, ~106.6k stars) with MCP, subagents, image input, code review, and Skills. The model line is now GPT-5.6 Sol / Terra / Luna, and the desktop app, CLI, and IDE extension share one config.toml."
description: "Installing OpenAI Codex CLI, its core features, how its models evolved and where they stand now, its relationship to the Codex App, and practical use cases."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)

Codex CLI is OpenAI's open-source coding agent that runs directly in your terminal. It can read, modify, and execute code on your machine. Written in Rust, it starts fast and performs well.

## Installation

```bash
# npm
npm i -g @openai/codex

# Homebrew
brew install --cask codex
```

Supports macOS and Linux; use via WSL on Windows. Codex is included with ChatGPT Plus, Pro, Business, Edu, and Enterprise plans.

## Core Features

| Feature | Description |
|---|---|
| MCP Support | Configure STDIO or streaming HTTP servers in `~/.codex/config.toml`; Codex itself can also act as an MCP server |
| Subagents | Spawns sub-agents only when explicitly requested, enabling parallel execution of large tasks |
| Image Input | Paste screenshots or design mockups — Codex reads and incorporates visual details |
| Code Review | A dedicated Codex agent reviews your code before commits or pushes |
| Automation | Use the `exec` command to script repetitive workflows |
| Skills | Bundle instructions, resources, and scripts so Codex can reliably connect to tools and run workflows |

## Model Evolution

### codex-1 (early 2025)

The earliest cloud version of Codex, an o3 model optimized for software engineering. It handled tasks in parallel — writing features, answering codebase questions, fixing bugs, opening PRs.

### GPT-5-Codex (late 2025)

GPT-5 further optimized for agentic coding, good at both fast interactive conversation and long-running autonomous work. OpenAI rebuilt Codex CLI around agentic coding workflows based on community feedback.

### The three GPT-5.6 tiers (current)

The main line is now **Sol / Terra / Luna**: Sol for depth, Terra as the everyday default, Luna for speed and cost. You pick via the Power setting (Smarter ↔ Faster); the default is `gpt-5.6-sol` at medium reasoning.

Two dates matter: **GPT-5.4 and GPT-5.4 mini retire from ChatGPT-signed-in Codex on 2026/8/31** (replaced by Terra and Luna), and `gpt-5.2` and `gpt-5.3-codex` were deprecated earlier. Update any script or `codex exec --model` invocation that hardcodes an old model ID. The bring-your-own-API-key path is unaffected.

For model and billing detail, see [OpenAI Codex: A Complete Plan Analysis](/posts/ai/2026-04-02-agent-cli-openai-codex-en) in this series.

## Codex App vs. Codex CLI

| | Codex CLI | Codex App |
|---|---|---|
| Interface | Terminal | Desktop app (macOS / Windows) |
| Highlights | Lightweight, scriptable | Multi-agent management, parallel tasks, long-running collaboration |
| Open Source | ✅ | ❌ |

The Codex App added Windows support in March 2026, offering a more visual interface for managing multiple agents.

## Typical Use Cases

1. **Bug fixing**: Describe the problem — Codex reads the relevant files, pinpoints the issue, and proposes a fix
2. **Feature development**: Provide a spec and Codex generates code step by step for you to review
3. **Codebase Q&A**: Ask "what does this function do?" and Codex reads the source code and answers
4. **Automation scripts**: Use `codex exec` to chain CI/CD pipelines or repetitive daily tasks

## Positioning vs. Other Tools

Codex CLI's core advantage lies in its deep integration with OpenAI's own models (codex-1, GPT-5-Codex) and the complete ecosystem spanning from the cloud-based Codex App to the local CLI. If you're already using the OpenAI API, Codex CLI is the most seamless choice.

## Resources

- [GitHub - openai/codex](https://github.com/openai/codex)
- [Codex CLI Official Docs](https://developers.openai.com/codex/cli)
- [Codex CLI Features](https://developers.openai.com/codex/cli/features)
- [Introducing Codex](https://openai.com/index/introducing-codex/)
- [Codex Product Page](https://openai.com/codex/)

## References

- [OpenAI Codex CLI GitHub: openai/codex open-source terminal coding agent](https://github.com/openai/codex)
- [Introducing Codex: OpenAI official blog announcement for Codex CLI](https://openai.com/index/introducing-codex/)

## Changelog

- 2026-08-18: Added the current GPT-5.6 Sol / Terra / Luna line and the 2026/8/31 GPT-5.4 retirement date (the post previously stopped at codex-1 and GPT-5-Codex); noted that the three surfaces share one `config.toml`; added to the Choosing an Agent CLI series
