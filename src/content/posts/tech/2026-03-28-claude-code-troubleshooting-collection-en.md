---
title: "Claude Code Troubleshooting Collection: Common Issues Solved"
date: 2026-03-28
type: debug
category: tech
tags: [claude-code, troubleshooting, debugging, dx, skills, hooks, settings]
lang: en
tldr: "A curated collection of the most common Claude Code issues: Skills not found, Hooks not triggering, settings not taking effect, permission blocks, MCP connection failures. Each problem includes root cause analysis and step-by-step fixes."
description: "A comprehensive troubleshooting reference for Claude Code covering Skill discovery failures, Hook not triggering, settings.json conflicts, permission mode issues, MCP server connection failures, and more — each with symptoms, root cause analysis, and resolution steps."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 27
---

🌏 [中文版](/posts/tech/2026-03-28-claude-code-troubleshooting-collection)

<!-- TODO: Pending write-up -->

## Planned Outline

### Skills

- Global skills not found in a new session (→ link to dedicated article in order 15)
- Skill execution interrupted mid-way
- Skill steps being skipped by the AI

### Hooks

- Hook not being triggered
- Hook matcher syntax errors
- Hook command fails but does not block execution
- Choosing the wrong timing: PreToolUse vs PostToolUse

### Settings

- settings.json syntax error causing everything to break
- Conflicts between global and project-level settings
- settings.local.json not being read

### Permissions

- --dangerously-skip-permissions enabled but tools are still blocked
- Known bug with allowedTools in bypass mode
- Sub-agent permission inheritance issues

### MCP Server

- MCP server connection timeout
- Authentication token expired
- Tool schema not matching expectations

### Performance

- Context window full causing abnormal behavior
- Slow startup on large repos
- Diagnosing unexpectedly high token usage

## References

- [Claude Code Troubleshooting](https://docs.anthropic.com/en/docs/claude-code/troubleshooting) — Official Anthropic troubleshooting docs covering common installation and runtime issues
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — Complete settings.json reference including hooks, permissions, and env field descriptions
- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — Official documentation on hook event types, matcher syntax, and exit code behavior
- [Claude Code Permission Modes](https://docs.anthropic.com/en/docs/claude-code/permission-modes) — Behavioral differences between permission modes: default, acceptEdits, auto, and bypassPermissions
- [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp) — MCP server connection configuration and tool schema documentation
- [Explore the Context Window](https://docs.anthropic.com/en/docs/claude-code/context-window) — Interactive context consumption simulator for understanding token usage per feature
- [Claude Code Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices) — Officially recommended usage patterns including context management and debugging strategies
