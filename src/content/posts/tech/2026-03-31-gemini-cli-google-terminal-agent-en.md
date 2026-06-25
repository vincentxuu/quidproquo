---
title: "Gemini CLI: A Complete Guide to Google's Open-Source Terminal AI Agent"
date: 2026-03-31
type: project
category: tech
tags: [gemini, google, ai-tools, cli, coding-agent, open-source, antigravity]
lang: en
tldr: "Gemini CLI is Google's open-source terminal AI agent (Apache 2.0). ⚠️ Announced end-of-service on 2026/06/18 — official migration path is Antigravity CLI. Free accounts get 60 requests/minute and 1,000 requests/day; Skills, Hooks, and Subagents all carry over."
description: "Installing Gemini CLI, understanding its free tier, exploring core features, and migrating to Antigravity CLI after the 2026/06/18 shutdown."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)

> **⚠️ Deprecation Notice (2026/05/19)**
> Google has announced that Gemini CLI will stop serving all free, Pro, and Ultra users on **June 18, 2026**. The official successor is [Antigravity CLI](#migrating-to-antigravity-cli). Enterprise users (Gemini Code Assist Standard/Enterprise or Google Cloud API key) are not affected by this deadline. See the [official migration announcement](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli) for details.

Gemini CLI is Google's open-source AI agent that brings Gemini's capabilities directly into your terminal. It uses a ReAct (Reason and Act) loop, combining built-in tools and MCP servers to tackle complex tasks.

## Installation

```bash
# Run without installing
npx @google/gemini-cli

# Install globally
npm install -g @google/gemini-cli
```

Open-source license: Apache 2.0.

## Free Tier

This is one of Gemini CLI's most compelling selling points:

| Item | Quota |
|---|---|
| Requests per minute | 60 |
| Requests per day | 1,000 |
| Requires | Personal Google account |

No credit card required, no API key needed (for the free tier) — just sign in with your Google account.

## Core Features

| Feature | Description |
|---|---|
| Google Search grounding | Built-in search capability for real-time, up-to-date answers |
| File operations | Read, write, and edit local files |
| Shell commands | Execute arbitrary commands in the terminal |
| Web fetching | Retrieve web page content |
| MCP support | Connect custom tools via the Model Context Protocol |
| 1M token context | Native support for an extremely long context window |

## Gemini 3 Pro Integration

Gemini CLI integrates Gemini 3 Pro — Google's most powerful reasoning model:

- **Better instruction following**: Enhanced reasoning leads to more accurate task interpretation
- **Agentic coding**: Autonomous coding for complex engineering tasks
- **Advanced tool use**: Smarter workflow composition

Gemini 3 Pro is available in Gemini CLI for Google AI Ultra subscribers, or via a paid API key.

## Relationship with Gemini Code Assist

| | Gemini CLI | Gemini Code Assist |
|---|---|---|
| Interface | Terminal | VS Code extension |
| Underlying engine | Standalone CLI | Powered by Gemini CLI |
| Plans | Free / API key | Free / Standard / Enterprise |

Gemini Code Assist's agent mode in VS Code is essentially a subset of Gemini CLI's functionality. Both share the same core capabilities.

## More Than Just Coding

Gemini CLI is not limited to writing code:

- **Content generation**: Produce documentation, translations, and summaries
- **Problem solving**: Analyze logs, debug issues, process data
- **Deep research**: Conduct real-time research using Google Search grounding
- **Task management**: Organize workflows and automate routine tasks

## Typical Use Cases

1. **Fix bugs + run tests**: Describe the problem; Gemini locates, fixes, and verifies with tests
2. **New feature development**: Provide a spec; get incremental code generation
3. **Code comprehension**: Use the 1M token context to load an entire project and ask questions
4. **Cross-language translation**: Rewrite a Python snippet in TypeScript

## Positioning vs. Other Tools

Gemini CLI's core strengths: a generous free tier, a 1M-token context window, real-time Google Search grounding, and a fully open-source codebase (Apache 2.0). It's a great fit for developers on a budget who want to try an AI coding agent, or for scenarios involving very large codebases.

## References

- [GitHub - google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- [Gemini CLI Official Docs](https://developers.google.com/gemini-code-assist/docs/gemini-cli)
- [geminicli.com](https://geminicli.com/)
- [Google Blog Announcement](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/)
- [Hands-on Codelab](https://codelabs.developers.google.com/gemini-cli-hands-on)

## Migrating to Antigravity CLI

At Google I/O 2026 (2026/05/19), Google announced that Gemini CLI's functionality will be fully taken over by **Antigravity CLI**. Antigravity CLI is the terminal interface for the Google Antigravity 2.0 platform — rewritten in Go for faster execution and with support for asynchronous agent workflows.

### Retained Features

The following features carry over completely:

| Feature | Notes |
|---|---|
| Agent Skills | Automatically available after migration; `/skills` command works the same way |
| Hooks | Identical behavior — no reconfiguration needed |
| Subagents | Parallel agent capabilities are preserved with improved performance |
| Extensions → Plugins | Extensions are renamed to Antigravity plugins and can be migrated automatically |
| MCP Servers | Same `/mcp` command is supported; config file path has changed |

### Quick Migration

```bash
# Install Antigravity CLI
# macOS / Linux
curl -fsSL https://antigravity.google/install.sh | sh

# Migrate existing Extensions → Antigravity plugins
agy plugin import gemini
```

**MCP config difference**: Gemini CLI's `mcpServers` lives in `settings.json`. Antigravity CLI moves this to a dedicated `mcp_config.json` (global path: `~/.gemini/antigravity-cli/mcp_config.json`; workspace: `.agents/mcp_config.json`). The remote MCP server field name changes from `url` to `serverUrl`.

### Key Dates

- **2026/06/18**: Gemini CLI stops serving personal free, Pro, and Ultra users
- Enterprise users (Gemini Code Assist Standard/Enterprise or Google Cloud API key): not yet affected; separate notice to follow

Full migration guide: [antigravity.google/docs/gcli-migration](https://antigravity.google/docs/gcli-migration)

## Further Reading

- [Gemini CLI GitHub: google-gemini/gemini-cli open-source terminal AI agent](https://github.com/google-gemini/gemini-cli)
- [Google Gemini Developer Docs: Gemini CLI features and MCP configuration](https://developers.google.com/gemini/)
- [Gemini CLI Hands-on Codelab: practical terminal AI agent tutorial](https://codelabs.developers.google.com/gemini-cli-hands-on)
- [Google Official Announcement: Introducing Gemini CLI open-source terminal AI agent](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/)
- [Google Developers Blog: Transitioning Gemini CLI to Antigravity CLI (official deprecation notice)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli)
- [Antigravity CLI Migration Docs: Migrating from Gemini CLI](https://antigravity.google/docs/gcli-migration)
- [Google I/O 2026 Developer Highlights: Antigravity 2.0 and Antigravity CLI launch](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights)

## Changelog

- 2026-05-21: Added Gemini CLI deprecation notice (2026/06/18) and Antigravity CLI migration guide; updated tldr, tags, and references
