---
title: "Claude Code Headless Mode: Programmatic AI Development with claude -p"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, headless, agent-sdk, cli, automation, scripting, ci-cd, dx]
lang: en
tldr: "claude -p is Claude Code's programmatic execution mode. Run tasks with a single command, pipe data in, and get structured JSON output. Use --bare to skip all auto-loading for CI/CD and scripts. You can also use --json-schema to enforce structured output that conforms to a schema."
description: "A complete guide to Claude Code's Headless Mode (claude -p): basic usage, --bare fast mode, structured output, streaming, auto-approve tools, continue conversations, and its relationship to the Agent SDK (Python/TypeScript)."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 2
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide)

<!-- TODO: Pending write-up -->
<!-- Reference official docs: https://code.claude.com/docs/en/headless.md -->

## Planned Outline

### What is Headless Mode
- `claude -p "prompt"` — non-interactive execution
- CLI entry point for the Agent SDK
- Ideal for scripts, CI/CD, and piping data

### Basic Usage
```bash
claude -p "What does the auth module do?"
claude -p "Fix TypeScript errors in src/auth.ts" --allowedTools "Read,Edit,Bash(tsc:*)"
```

### --bare Fast Mode
- Skips hooks, skills, plugins, MCP servers, and CLAUDE.md loading
- Starts faster than standard mode
- Recommended for CI/CD
- Manually specify the context you need:
  - `--append-system-prompt`
  - `--settings <file>`
  - `--mcp-config <file>`
  - `--agents <json>`

### Structured Output
```bash
# JSON output (includes session ID and metadata)
claude -p "Summarize this project" --output-format json

# Specify a JSON Schema
claude -p "Extract function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}}}'
```

### Streaming
```bash
claude -p "Explain recursion" --output-format stream-json --verbose --include-partial-messages
```
- `stream-json`: one JSON event per line
- Combine with `jq` to filter text deltas

### Auto-approve Tools
```bash
claude -p "Run tests and fix failures" --allowedTools "Bash,Read,Edit"
```
- Permission rule syntax: `Bash(git diff *)` (space + asterisk = prefix match)

### Continue Conversations
```bash
# Continue the most recent conversation
claude -p "Now focus on database queries" --continue

# Continue a specific session
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

### Real-world Use Cases
- Batch-fix lint errors
- Git commit with AI-generated messages
- PR diff → security review
- Batch processing with shell loops

### Relationship to the Agent SDK
- The CLI is one entry point to the Agent SDK
- Python / TypeScript SDKs provide more fine-grained control
- Structured output, tool approval callbacks, native message objects

## References

- [Claude Code CLI Reference — Official Docs](https://docs.anthropic.com/en/docs/claude-code/cli-reference) — Complete reference for all CLI flags: `claude -p`, `--bare`, `--output-format`, and more
- [Claude Code Programmatic Usage — Official Docs](https://docs.anthropic.com/en/docs/claude-code/programmatic-usage) — Official guide to headless mode and Agent SDK integration
- [Claude Code GitHub Actions — Official Docs](https://docs.anthropic.com/en/docs/claude-code/github-actions) — Practical examples of using `claude -p` in CI/CD environments
- [Claude Code Common Workflows](https://docs.anthropic.com/en/docs/claude-code/common-workflows) — Real-world examples: batch processing, piping data, scripting automation
- [Anthropic Agent SDK — Official Docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/sdk) — Complete API reference for the Python and TypeScript SDKs
- [Claude Code Permission Rule Syntax](https://docs.anthropic.com/en/docs/claude-code/permissions#permission-rule-syntax) — Rule syntax for `--allowedTools`, including Bash prefix matching
- [jq Official Docs](https://jqlang.org/manual/) — Tool reference for filtering `stream-json` output
