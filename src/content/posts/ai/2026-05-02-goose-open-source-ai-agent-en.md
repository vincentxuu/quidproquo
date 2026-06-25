---
title: "goose: Open-Source, Cross-Platform, LLM-Agnostic Local AI Agent"
date: 2026-05-02
type: deep-dive
category: ai
tags: [goose, ai-agent, open-source, mcp, rust, linux-foundation, aaif, claude-code, cli, desktop-app]
lang: en
tldr: "goose is an open-source AI Agent maintained by the Linux Foundation's AAIF, supporting 15+ LLM providers and 70+ MCP extensions, built with Rust as a Desktop App + CLI + API. It positions itself as a vendor-neutral, self-hostable alternative to Claude Code."
description: "An introduction to goose, the open-source AI Agent: its migration from Block to Linux Foundation AAIF, technical architecture (Rust + TypeScript), multi-LLM support, MCP extension mechanism, .goosehints usage, and how it compares to Claude Code and Cursor."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-02-goose-open-source-ai-agent)

AI Coding Agent tools are proliferating, but most are either tied to a specific IDE or only support a single model provider. goose chose a different path: fully open-source, cross-platform, supporting any LLM, and governed by the Linux Foundation -- not owned by any single commercial company.

It was originally developed by Block (Square's parent company) and was officially donated to the **Agentic AI Foundation (AAIF)** in late 2025, becoming a Linux Foundation sub-foundation project. This move transformed goose from an internal enterprise tool into an open ecosystem with neutral governance. As of May 2026, it has 43.7k stars and 470+ contributors.

---

## Installation and Quick Start

**Desktop App**: Head to the [goose official installation page](https://goose-docs.ai/docs/getting-started/installation) to download the macOS / Linux / Windows version, extract it, and run directly.

**CLI**:

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

After installation, configure your LLM provider:

```bash
goose configure
```

The interactive interface will guide you through selecting a provider and entering your API Key. Once configured, start your first session:

```bash
goose session
```

Then give instructions just like talking to a developer:

```
> Write a Python script that reads a CSV and outputs a statistical summary
> Add argparse to the script so the file path can be passed from the command line
> Run it and test with sample.csv
```

goose will automatically plan, write code, execute, and report the results back to you.

---

## Architecture and Platform

goose's core is written in **Rust**, with the UI layer in **TypeScript (React)** -- a choice that ensures cross-platform consistency and performance.

It offers three usage modes:

- **Desktop App**: Native application for macOS, Linux, and Windows with a GUI interface
- **CLI**: Terminal workflow, start a conversation with `goose session`
- **API**: Embeddable in your own applications

For developers, the CLI is the primary mode. For non-technical users, the Desktop App lowers the barrier to entry.

```
goose Execution Model
┌──────────────────────────────────────────────────┐
│  Desktop App / CLI / API                         │
├──────────────────────────────────────────────────┤
│  Session Management Layer (Rust)                 │
├────────────────┬─────────────────────────────────┤
│  LLM Provider  │  MCP Extension Layer            │
│  (15+ vendors) │  (70+ servers)                  │
└────────────────┴─────────────────────────────────┘
```

---

## LLM Providers: 15+ Choices, No Vendor Lock-in

goose supports virtually all major LLM services:

| Type | Options |
|------|---------|
| API Key | Anthropic, OpenAI, Google Gemini, Azure OpenAI, AWS Bedrock |
| Local Inference | Ollama (fully offline, no API Key required) |
| Aggregation Platforms | OpenRouter (200+ models, pay-per-use) |
| Subscription Integration | ChatGPT Plus/Pro, Claude subscription (via ACP protocol) |

**ACP (Agent Communication Protocol)** is a key design in the goose ecosystem: it lets goose directly connect to your existing Claude or ChatGPT subscriptions without needing a separate API Key or additional payments. For users who already have subscriptions, this is the lowest-cost way to get started.

---

## MCP Extensions: Making goose Do More

goose adopts the **Model Context Protocol (MCP)** standard, proposed by Anthropic and now an industry-wide consensus for AI tool integration.

Through MCP, goose can connect to:

- **Computer Controller**: Browser control, desktop automation, web scraping
- **Databases**: Direct queries to PostgreSQL, SQLite
- **Development Tools**: GitHub, GitLab, Jira
- **Design Tools**: Figma
- **Communication**: Slack, Gmail
- And 70+ community-contributed servers

In the Desktop App, you can toggle extensions on and off directly from the sidebar without manually editing configuration files.

---

## `.goosehints`: Helping goose Understand Your Project

goose supports placing a `.goosehints` file in the project root directory, similar to Claude Code's `CLAUDE.md` -- it lets the agent load project conventions at the start of each session:

```
This is an Astro + Cloudflare Workers project
Package manager is pnpm, do not use npm or yarn
Commit messages in English, format: type(scope): description
Lint command: pnpm lint
```

With this in place, every time you ask goose to "add a feature," it already knows your tech stack and conventions without needing to explain them again each time.

---

## Custom Distributions: Package Your Own goose

goose supports packaging "distributions" -- customized versions with preset providers, extensions, and branding.

This design primarily targets enterprise scenarios: IT departments can package a "company-specific goose" that comes pre-configured with internal LLM connections, specific MCP servers enabled, and certain permissions locked down, then distribute it to all employees without requiring individual setup.

---

## Comparison with Claude Code and Cursor

| | **goose** | **Claude Code** | **Cursor** |
|--|-----------|-----------------|------------|
| License | Apache 2.0 open-source | Commercial (Anthropic) | Commercial |
| LLM | 15+ providers, switchable | Claude only | Multi-provider, but IDE-bound |
| Platform | Desktop + CLI + API | CLI | IDE plugin |
| Extensions | MCP standard, 70+ servers | MCP (expanding) | Plugin marketplace |
| Governance | Linux Foundation AAIF | Anthropic | Anysphere |
| Self-hosting | Yes | No | No |

Claude Code's advantage lies in its deep integration with the Claude model and Anthropic ecosystem; Cursor is the most natural choice for IDE users. goose's core value proposition is **vendor independence** -- you can use Claude today, switch to Gemini tomorrow, run Ollama locally, all with the same toolset.

---

## Ideal Use Cases

- Teams that want open-source, auditable code
- Enterprises needing self-hosted, controlled AI tool access
- Individual developers who already have ChatGPT or Claude subscriptions and don't want to pay additional API fees
- Researchers who need to switch between and compare multiple LLM providers
- Those who want a terminal-based workflow independent of any specific IDE

Not ideal for: If you're already a heavy Claude Code user and don't need to switch models, the extra flexibility goose provides may not justify the migration cost.

---

## Overall

goose's core trade-off is clear: **flexibility over depth**. It doesn't try to be the best on any single LLM; instead, it provides a consistent agent experience across any LLM. Under Linux Foundation governance, it's also one of the few AI Agent projects with truly neutral, open governance.

For users who value vendor independence, need enterprise deployment control, or want to flexibly switch between multiple models, goose is worth serious consideration.

---

## References

- [goose GitHub Repository (aaif-goose/goose)](https://github.com/aaif-goose/goose)
- [goose Official Documentation](https://goose-docs.ai/docs/quickstart)
- [Agentic AI Foundation (AAIF)](https://aaif.io/)
- [Model Context Protocol Official Site](https://modelcontextprotocol.io/)
- [ACP (Agent Communication Protocol) Documentation](https://goose-docs.ai/docs/guides/acp-providers)
