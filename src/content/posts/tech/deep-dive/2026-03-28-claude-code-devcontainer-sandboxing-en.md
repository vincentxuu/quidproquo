---
title: "Claude Code DevContainer & Sandboxing: Safe AI Usage in Isolated Environments"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, devcontainer, sandboxing, docker, security, dx]
lang: en
tldr: "DevContainer runs Claude Code in a standardized container environment — consistent dependencies, tools, and settings. Sandboxing restricts Bash commands' filesystem and network access. Together, they make YOLO mode as safe as it can get."
description: "An overview of Claude Code's DevContainer support and Sandboxing mechanism: devcontainer.json configuration, usage in GitHub Codespaces, filesystem and network restrictions in Sandbox mode, combining with bypassPermissions mode, and enterprise security deployment strategies."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 25
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing)

<!-- TODO: Pending writeup -->
<!-- Reference: https://code.claude.com/docs/en/devcontainer.md -->
<!-- Reference: https://code.claude.com/docs/en/sandboxing.md -->

## Planned Outline

### What Is a DevContainer
- Standardized containerized development environment
- devcontainer.json defines the environment
- Consistent dependencies, tools, and configuration
- Ideal for teams, CI/CD, and remote development

### Using Claude Code Inside a DevContainer
- devcontainer.json configuration examples
- GitHub Codespaces integration
- Local VS Code + Docker
- Special considerations: PATH, auth, MCP servers

### Sandboxing Mechanism
- Isolated execution of Bash commands
- Filesystem restriction: access limited to the working directory
- Network restriction: `--network none`
- `--sandbox` / `--no-sandbox` flag

### Security Level Combinations

| Combination | Security | Convenience |
|-------------|----------|-------------|
| default mode | ★★★★★ | ★★ |
| auto mode | ★★★★ | ★★★★ |
| bypass + sandbox | ★★★ | ★★★★ |
| bypass + Docker --network none | ★★★★ | ★★★ |
| bypass bare | ★ | ★★★★★ |

### Enterprise Deployment Strategy
- Server-managed settings to enforce sandbox
- Disable bypassPermissions
- Standardized DevContainer environments
- Network isolation strategies

## References

- [Claude Code Development Containers — Official Docs](https://docs.anthropic.com/en/docs/claude-code/devcontainer) — Anthropic's official devcontainer configuration guide, including firewall rules and VS Code integration
- [Claude Code Sandboxing — Official Settings Docs](https://docs.anthropic.com/en/docs/claude-code/settings#sandbox-settings) — Full sandbox field reference in settings.json, including filesystem and network restriction options
- [VS Code Dev Containers Official Docs](https://code.visualstudio.com/docs/devcontainers/containers) — VS Code Dev Containers extension usage guide
- [devcontainer.json Specification Reference](https://containers.dev/implementors/json_reference/) — Official JSON reference for the Dev Container spec
- [GitHub Codespaces Quickstart](https://docs.github.com/en/codespaces/getting-started/quickstart) — Official tutorial for using devcontainers in GitHub Codespaces
- [Claude Code Permissions Mode Explained](https://docs.anthropic.com/en/docs/claude-code/permissions) — Full comparison of bypassPermissions and various permission modes
- [Claude Code Enterprise Network Configuration](https://docs.anthropic.com/en/docs/claude-code/network-configuration) — Network settings and proxy configuration guide for enterprise environments
