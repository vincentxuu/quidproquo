---
title: "Codex CLI: A Complete Guide to OpenAI's Open-Source Terminal Coding Agent"
date: 2026-03-31
type: project
category: tech
tags: [codex, openai, ai-tools, cli, coding-agent, open-source]
lang: en
tldr: "Codex CLI is OpenAI's open-source terminal coding agent built in Rust. It supports MCP, subagents, image input, and code review. Paired with the codex-1 (o3-optimized) or GPT-5-Codex model, it can read, write, and execute code directly on your local machine."
description: "A comprehensive look at OpenAI Codex CLI — installation, core features, model evolution, its relationship with the Codex App, and real-world use cases."
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

The earliest cloud version of Codex, built on the o3 model and optimized for software engineering. Capable of handling multiple tasks in parallel — writing features, answering codebase questions, fixing bugs, and opening PRs.

### GPT-5-Codex (late 2025)

A version of GPT-5 further optimized for agentic coding. Excels at both fast interactive conversations and autonomous execution of long, complex tasks. OpenAI rebuilt Codex CLI from the ground up around agentic coding workflows, based on community feedback.

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
