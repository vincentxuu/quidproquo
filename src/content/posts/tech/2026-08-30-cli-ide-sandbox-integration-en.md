---
title: "CLI Agent and IDE Sandbox Integration"
date: 2026-08-30
category: tech
type: deep-dive
tags: [sandbox, cli-agent, ide, opencode, codex, cursor, local-sandbox, ai-agent]
lang: en
tldr: "The local products post (order 6) of the Sandbox Series. How OpenCode, Codex CLI, Cursor and other CLI agents and IDEs set up local sandboxes, where the isolation boundary lies, common pitfalls, and security best practices."
description: "CLI agent and IDE sandbox integration: OpenCode, Codex CLI, Cursor local sandbox setup, isolation boundaries, permission management, common pitfalls, and security practices."
series:
  name: "Sandbox Series"
  order: 6
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-30-cli-ide-sandbox-integration)

## What This Post Is

This post is the "local products" post (order 6) of the Sandbox Series. It doesn't cover single provider technical details (Claude Code in order 5), but focuses on **CLI agent and IDE local sandbox integration**:

1. **How do OpenCode, Codex CLI, Cursor and other CLI agents set up local sandboxes?**
2. **Where is the isolation boundary?** — Filesystem, network, subprocesses, credentials.
3. **What are the common pitfalls?** — Docker socket, SSH keys, Git hooks, environment variables.
4. **What are the security best practices?**

---

## Current State of CLI Agent and IDE Sandboxes

Modern CLI agents (OpenCode, Codex CLI, Antigravity CLI, Kiro) and IDE agents (Cursor, Windsurf, Copilot in local mode) all need to execute user code. Their sandbox modes fall into three categories:

| Mode | Representative Tools | Isolation Strength | Suitable Scenario |
|------|---------------------|-------------------|-------------------|
| No sandbox | Early Copilot, some IDE plugins | Weak | Read-only, no code execution |
| Permission rules only | OpenCode | Weak | Allowed commands get full account permissions |
| Local OS sandbox | Codex CLI, Cursor, Claude Code | Medium | Local development, code generation & execution |
| Container/VM sandbox | Some enterprise IDE versions | Strong | Multi-tenant, untrusted code |

This post focuses on **local OS sandbox**, the model adopted by most CLI agents and IDEs today.

---

## OpenCode: Permission Rules, No OS Sandbox

OpenCode currently has no built-in OS-level sandbox. Its [permission system](https://opencode.ai/docs/permissions) decides whether the agent may take an action, such as asking before running a shell command or allowing certain Git commands outright; once a command is allowed, it runs locally with your account's permissions and can see everything you can. This series' post on [sandboxes and remote execution](/posts/ai/2026-08-25-coding-agent-sandbox-remote-execution-en) also found that `packages/containers/` in the repo holds CI images, not runtime isolation.

### Key Configuration

```jsonc
// opencode.jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": [
    { "action": "shell", "resource": "*", "effect": "ask" },
    { "action": "shell", "resource": "git status *", "effect": "allow" },
    { "action": "shell", "resource": "git push *", "effect": "deny" },
    { "action": "external_directory", "resource": "*", "effect": "ask" }
  ]
}
```

### Isolation Boundaries

| Layer | Restriction | Notes |
|-------|-------------|-------|
| Actions | allow / ask / deny by rule | Governs whether the agent acts, not what an allowed command can reach |
| Paths outside the project | `external_directory` allowed by default | Add a rule to be asked |
| Filesystem, network, processes | No OS-level limits | Allowed commands get your full account permissions |

To get real isolation with OpenCode, run the whole thing inside a container, VM, or remote sandbox.

---

## Codex CLI Local Sandbox Setup

Codex CLI uses each platform's native mechanism for an OS-level sandbox: Seatbelt on macOS, bubblewrap on Linux and WSL2, and the native Windows sandbox under PowerShell.

### Basic Usage

```bash
# Default: read files, write inside the workspace, run routine commands; network off by default
codex --sandbox workspace-write

# Read-only: no edits or commands without approval
codex -s read-only

# Set the working directory and grant one extra writable directory
codex -C ./workspace --add-dir ../shared

# No sandbox at all; only inside an environment that is already isolated (container, VM)
codex --sandbox danger-full-access
```

Allowing network by domain requires the experimental `features.network_proxy` in `config.toml` (off by default), and it filters only traffic from sandboxed commands, not web search, MCP, or other tools.

### Common Pitfalls

1. **Docker socket not blocked**: If Codex CLI can access `/var/run/docker.sock`, it can start new containers, bypassing sandbox restrictions.
2. **SSH key leakage**: `~/.ssh/id_rsa` is readable by default, needs explicit blocking.
3. **Environment variable inheritance**: AWS credentials, API keys may be passed into the sandbox via environment variables.

---

## Cursor Local Sandbox Setup

Cursor's sandbox covers only the agent's terminal commands, configured under `Settings > Agents > Approvals & Execution`. In Auto-review mode, shell commands run in the sandbox when they can, and only those that can't go to a classifier; the classifier itself is not a security boundary.

### Configuration File

What the sandbox can reach lives in `~/.cursor/sandbox.json` (machine-wide) or the project's `.cursor/sandbox.json` (takes priority):

```json
{
  "type": "workspace_readwrite",
  "readBoundary": "workspace",
  "additionalReadonlyPaths": ["~/.config/tool"],
  "networkPolicy": {
    "default": "deny",
    "allow": ["registry.npmjs.org", "*.github.com"]
  }
}
```

By default the workspace is read-write and network is denied; private ranges and the cloud metadata endpoint (`169.254.169.254`) are always blocked. Paths such as `.git/hooks/**`, `.git/config`, `.vscode/**`, and `.cursor/*.json` are always write-protected and `sandbox.json` cannot change that. Read access defaults to the whole machine (System); set it to Workspace to be asked before files outside the project are read.

### Common Issues

- **Git hooks executed**: After agent modifies code, Git hooks may auto-execute, causing malicious code to run outside the sandbox. CVE-2026-26268 (escaping the sandbox by writing `.git` configuration, fixed in 2.5) is exactly this type of vulnerability, and `.git/hooks` is now write-protected.
- **Working directory escape**: Agent accesses files outside workspace via `../` paths.

---

## Common Pitfalls Across Tools

### Pitfall 1: Docker Socket Not Blocked

If agent can access Docker socket, it can start new containers, bypassing all sandbox limits.

**Defense**: Do not mount Docker socket into sandbox:
```
--mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock,readonly
```

### Pitfall 2: SSH Keys and Cloud Credentials

`~/.ssh/id_rsa`, `~/.aws/credentials`, `~/.env` are readable by default.

**Defense**:
- Use `denyRead` to block sensitive paths
- Use short-lived credential proxy, not long-term keys
- Environment variables should not be passed into sandbox

### Pitfall 3: Git Hook Auto-Execution

Agent modifies code, then Git hooks (pre-commit, post-commit) may auto-execute.

**Defense**:
- Disable Git hooks inside sandbox
- Or set Git hooks to read-only

### Pitfall 4: Environment Variable Inheritance

`OPENAI_API_KEY`, `ANTHROPIC_API_KEY` may be passed into sandbox, agent can steal and exfiltrate them.

**Defense**:
- Do not pass full API keys into sandbox environment
- Use credential broker to inject on demand

---

## Security Best Practices Checklist

| Item | Suggestion | Priority |
|------|------------|----------|
| Block Docker socket | Do not mount Docker socket into sandbox | High |
| Block sensitive paths | denyRead `~/.ssh`, `~/.aws`, `~/.env` | High |
| Network allowlist | Default no egress, only allow necessary domains | High |
| Limit process count | PID limit, memory limit | Medium |
| Disable Git hook | No Git hook execution inside sandbox | Medium |
| Short-lived credentials | Use credential broker, not long-term keys | Medium |
| Audit logs | Record all file and network operations | Medium |

---

## What You Should Understand After Reading

1. Three sandbox modes for CLI agents and IDEs and applicable scenarios.
2. OpenCode's permission rules, and Codex CLI and Cursor local sandbox setup methods.
3. Five common pitfalls: Docker socket, SSH keys, environment variables, Git hooks, working directory escape.
4. Five security best practices: block Docker socket, sensitive paths, network allowlist, process limits, short-lived credentials.
5. Sandboxing isn't a "whether" question — it's a "how strict" question.

---

## Update Log

- 2026-11-23: OpenCode is now correctly described as having no OS sandbox, only permission rules, with the example switched to the official `opencode.jsonc` `permissions`; Codex CLI flags now match the real `--sandbox read-only|workspace-write|danger-full-access`, `-C`, and `--add-dir`; Cursor now uses `sandbox.json` and `Settings > Agents > Approvals & Execution`, with the write-protected paths added; the Cursor CVE number now matches its link (CVE-2026-26268).

## References

- [OpenCode Permissions](https://opencode.ai/docs/permissions)
- [Codex Sandboxing](https://developers.openai.com/codex/sandboxing) and [Codex CLI reference](https://developers.openai.com/codex/cli/reference)
- [Cursor Run Modes](https://cursor.com/docs/agent/run-modes) and [sandbox.json reference](https://cursor.com/docs/reference/sandbox)
- [CVE-2026-26268: Cursor sandbox escape via .git configuration](https://www.sentinelone.com/vulnerability-database/cve-2026-26268)
- [CVE-2026-25725: Claude Code Bubblewrap Sandbox Escape](https://cymulate.com/blog/the-race-to-ship-ai-tools-left-security-behind-part-1-sandbox-escape)
- [本站：Claude Code Sandboxing Works (order 5)](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing-en)
- [本站：Sandbox Series Overview (order 0)](/posts/tech/2026-08-30-sandbox-series-overview-en)
