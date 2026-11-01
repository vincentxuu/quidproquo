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

> 🌏 [中文版](/posts/tech/2026-08-30-cli-ide-sandbox-integration)

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
| Local OS sandbox | OpenCode, Codex CLI, Cursor | Medium | Local development, code generation & execution |
| Container/VM sandbox | Some enterprise IDE versions | Strong | Multi-tenant, untrusted code |

This post focuses on **local OS sandbox**, the model adopted by most CLI agents and IDEs today.

---

## OpenCode Local Sandbox Setup

OpenCode uses local OS primitives (macOS Seatbelt, Linux bubblewrap/Landlock) to enforce the same boundary on every Bash command.

### Key Configuration

```json
// ~/.opencode/settings.json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["./", "./src", "./tmp"],
      "denyRead": ["~/.ssh", "~/.aws", "~/.env", "/etc/passwd"]
    },
    "network": {
      "allowedDomains": ["api.opencode.dev", "github.com"],
      "strictAllowlist": true
    },
    "process": {
      "maxProcesses": 64,
      "maxMemoryMB": 512
    }
  }
}
```

### Isolation Boundary

| Layer | Restriction | Description |
|-------|-------------|-------------|
| Filesystem | Write limited to working directory + session temp | Prevent writing system files |
| Filesystem | Read defaults to entire machine, but denyRead can block | Requires explicit setup |
| Network | Default zero domains, requires allowlist | Prevent lateral movement |
| Process | PID limit, memory limit | Prevent fork bomb |
| Capabilities | Drop SYS_ADMIN and other high-risk capabilities | Prevent privilege escalation |

---

## Codex CLI Local Sandbox Setup

Codex CLI uses container or local OS sandbox, depending on platform.

### Basic Usage

```bash
# Enable sandbox mode
codex --sandbox enabled

# Specify working directory
codex --sandbox-workdir ./workspace

# Restrict network
codex --sandbox-network allowlist github.com,api.openai.com
```

### Common Pitfalls

1. **Docker socket not blocked**: If Codex CLI can access `/var/run/docker.sock`, it can start new containers, bypassing sandbox limits.
2. **SSH key leakage**: `~/.ssh/id_rsa` is readable by default, needs explicit blocking.
3. **Environment variable inheritance**: AWS credentials, API keys may be passed into the sandbox.

---

## Cursor Local Sandbox Setup

Cursor's sandbox mode mainly targets its agent mode (Composer, Chat).

### Configuration Entry

Cursor sandbox settings in `Settings > Features > Agent > Sandbox`:

```json
{
  "agent.sandbox.enabled": true,
  "agent.sandbox.docker.enabled": false,
  "agent.sandbox.local.enabled": true,
  "agent.sandbox.local.readOnlyPaths": [
    "~/.ssh",
    "~/.aws",
    "~/.config/git/credentials"
  ],
  "agent.sandbox.local.writePaths": [
    "${workspaceFolder}"
  ]
}
```

### Common Issues

- **Git hook executed**: After agent modifies code, Git hooks (pre-commit, post-commit) may auto-execute, leading to malicious code running outside sandbox. CVE-2026-50548 is exactly this type of vulnerability.
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
2. OpenCode, Codex CLI, Cursor local sandbox setup methods.
3. Five common pitfalls: Docker socket, SSH keys, environment variables, Git hooks, working directory escape.
4. Five security best practices: block Docker socket, sensitive paths, network allowlist, process limits, short-lived credentials.
5. Sandboxing isn't a "whether" question — it's a "how strict" question.

---

## References

- [OpenCode Documentation](https://opencode.dev/)
- [Codex CLI Documentation](https://platform.openai.com/docs/codex)
- [Cursor Documentation](https://cursor.sh/docs)
- [CVE-2026-50548: Cursor Code Editor RCE Vulnerability](https://www.sentinelone.com/vulnerability-database/cve-2026-26268)
- [CVE-2026-25725: Claude Code Bubblewrap Sandbox Escape](https://cymulate.com/blog/the-race-to-ship-ai-tools-left-security-behind-part-1-sandbox-escape)
- [本站：Claude Code Sandboxing Works (order 5)](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing-en)
- [本站：Sandbox Series Overview (order 0)](/posts/tech/2026-08-30-sandbox-series-overview-en)
