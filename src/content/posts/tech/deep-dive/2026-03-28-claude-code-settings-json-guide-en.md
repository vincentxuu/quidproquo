---
title: "Claude Code settings.json Complete Guide: Tailoring Your Development Environment"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, configuration, settings, dx, hooks, permissions]
lang: en
tldr: "settings.json is the control center for all Claude Code behavior. Hooks, permissions, model selection, MCP servers, and tool blocklists are all configured here. This guide covers every available field, the difference between global and project-level settings, and recommended configuration combinations."
description: "A comprehensive reference for all Claude Code settings.json fields, global vs. project-level inheritance rules, the purpose of settings.local.json, and recommended configuration combinations for different development scenarios."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 4
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide)

<!-- TODO: Pending content -->

## Planned Outline

### Where settings.json Lives
- `~/.claude/settings.json` (global)
- `.claude/settings.json` (project)
- `.claude/settings.local.json` (local, not committed to git)
- Merge rules across all three layers

### Complete Field Reference
- hooks: event-driven automation
- permissions: tool permission control
- allowedTools / disallowedTools
- model: default model selection
- mcpServers: MCP server configuration
- env: environment variable injection

### Design Strategy: Global vs. Project Settings
- What belongs in global settings (personal preferences, general-purpose hooks)
- What belongs in project settings (team conventions, project-specific tools)
- When to use settings.local.json

### Common Configuration Combinations
- Secure development: hooks to block dangerous commands + disallowedTools
- Automation: commit hook + format hook + lint hook
- Team collaboration: unified model + shared MCP server

### Debugging Tips
- Common reasons settings don't take effect
- How to confirm which configuration layer is being loaded
- Diagnosing JSON syntax errors

## References

- [Claude Code Settings — Official Complete Docs](https://docs.anthropic.com/en/docs/claude-code/settings) — Full explanation of all settings.json fields, including global, project, and local three-tier configuration
- [Claude Code Permissions — Official Docs](https://docs.anthropic.com/en/docs/claude-code/permissions) — Permission rule syntax, allow/deny configuration, and tool-specific rules
- [Claude Code Hooks — Official Docs](https://docs.anthropic.com/en/docs/claude-code/hooks) — Hook event types, configuration format, and real-world examples
- [Claude Code Environment Variables Reference](https://docs.anthropic.com/en/docs/claude-code/environment-variables) — Complete list of all available environment variables
- [Claude Code MCP Configuration](https://docs.anthropic.com/en/docs/claude-code/mcp#mcp-installation-scopes) — mcpServers configuration locations and formats across different scopes
- [JSON Schema for Claude Code Settings](https://json.schemastore.org/claude-code-settings.json) — Official JSON Schema for settings.json, enables autocomplete in VS Code
- [Claude Code Managed Settings — Enterprise Deployment](https://docs.anthropic.com/en/docs/claude-code/settings#settings-precedence) — managed-settings.json priority levels and enterprise-grade configuration
