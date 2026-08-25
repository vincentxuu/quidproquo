---
title: "Claude Code Plugins & Marketplaces: Package and Distribute Your AI Workflows"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, plugins, marketplace, skills, agents, hooks, dx]
lang: en
tldr: "Plugins bundle skills, agents, hooks, and MCP servers into a single installable unit. Distribute them to your team or community via Marketplaces. Migrating from a standalone .claude/ setup to a plugin is as simple as moving directories and adding a manifest."
description: "A comprehensive guide to the Claude Code Plugin system: plugin structure (manifest + skills + agents + hooks + MCP), how to create and test plugins, migrating from standalone settings to a plugin, building and distributing through Plugin Marketplaces, and LSP server integration."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 13
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide)

<!-- TODO: To be written -->
<!-- Reference docs: https://code.claude.com/docs/en/plugins.md -->
<!-- Reference docs: https://code.claude.com/docs/en/plugin-marketplaces.md -->
<!-- Reference docs: https://code.claude.com/docs/en/discover-plugins.md -->
<!-- Reference docs: https://code.claude.com/docs/en/plugins-reference.md -->

## Planned Outline

### What Is a Plugin?
- Bundle skills, agents, hooks, and MCP servers into an installable unit
- Standalone (.claude/) vs Plugin — what's the difference
- Namespacing: `/plugin-name:skill-name` to avoid conflicts
- When to use a plugin vs standalone

### Plugin Structure
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # manifest
├── commands/                 # slash commands
├── skills/                   # Agent Skills (SKILL.md)
├── agents/                   # custom sub-agents
├── hooks/
│   └── hooks.json           # event handlers
├── .mcp.json                # MCP server configs
├── .lsp.json                # LSP server configs
└── settings.json            # default settings
```

### Building Your First Plugin
- The plugin.json manifest format
- Adding a skill
- Local testing with `--plugin-dir`
- Hot-reloading with `/reload-plugins`

### Advanced Plugin Features
- Adding Agent Skills
- Adding LSP servers (language servers)
- Adding default settings (e.g. agent configuration)
- Adding hooks
- MCP server integration

### Migrating from Standalone to Plugin
- Moving the commands, agents, and skills directories
- Migrating hooks to hooks/hooks.json
- Testing and validation

### Plugin Marketplace
- What a Marketplace is: a GitHub repo containing multiple plugins
- Creating your own Marketplace
- Installing and managing plugins with `/plugin install`
- Team-level marketplace configuration
- Submitting to the official Marketplace

### Security Considerations
- Plugin agents do not support hooks, mcpServers, or permissionMode
- The Marketplace trust model
- Team management settings

### Real-World Examples
- A shared code review plugin for teams
- A project template plugin (with CLAUDE.md + skills + hooks)
- A language-specific LSP plugin

## References

- [Claude Code Plugins Reference — Official Docs](https://docs.anthropic.com/en/docs/claude-code/plugins-reference) — plugin.json manifest format, plugin structure, and component descriptions
- [Create Plugins — Official Guide](https://docs.anthropic.com/en/docs/claude-code/create-plugins) — Official step-by-step guide to building a Claude Code plugin from scratch
- [Discover and Install Prebuilt Plugins — Official Docs](https://docs.anthropic.com/en/docs/claude-code/discover-and-install-prebuilt-plugins) — How to install and manage plugins from the Marketplace
- [Claude Code Settings — Plugin Configuration](https://docs.anthropic.com/en/docs/claude-code/settings#plugin-configuration) — Configuring enabledPlugins and extraKnownMarketplaces in settings.json
- [Claude Code Hooks Reference — Official Docs](https://docs.anthropic.com/en/docs/claude-code/hooks-reference) — hooks.json format and lifecycle event descriptions
- [Claude Code Skills — Official Docs](https://docs.anthropic.com/en/docs/claude-code/skills) — Complete guide to adding skills inside a plugin
- [Claude Code MCP Plugin Integration](https://docs.anthropic.com/en/docs/claude-code/mcp#plugin-provided-mcp-servers) — How plugins can bundle MCP servers
