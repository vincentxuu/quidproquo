---
title: "OpenClaw Operations: Troubleshooting and Diagnostics"
date: 2026-03-28
type: debug
category: ai
tags: [openclaw, troubleshooting, doctor, diagnostics, operations]
lang: en
tldr: "openclaw doctor is the all-in-one diagnostic tool, openclaw sandbox explain troubleshoots sandbox issues, and openclaw channels status --probe checks channel connectivity."
description: "OpenClaw operations guide: diagnostic tools, common troubleshooting, health checks, and log analysis."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-troubleshooting)

Once a system is up and running, problems will inevitably arise. This article compiles OpenClaw's diagnostic tools and solutions for common issues.

## All-in-One Diagnostics: openclaw doctor

```bash
openclaw doctor                  # Full diagnostics
openclaw doctor --fix            # Attempt automatic fixes
openclaw doctor --json           # JSON output
```

`doctor` checks:
- Config file schema validation
- Model authentication status
- Channel connectivity
- Sandbox configuration
- Plugin status
- Permissions and paths

## Common Issues

### Model Authentication

| Symptom | Troubleshooting |
|---|---|
| No credentials found | Run `openclaw models status`, verify API key or token |
| Token expired | `openclaw models status` to check which profile expired |
| Rate limited | Check API key rotation settings |

```bash
openclaw models status           # View authentication status
openclaw models status --check   # Automated check (exit 1 = expired)
openclaw models status --probe   # Active probing
```

### Channel Connectivity

```bash
openclaw channels status         # List channel status
openclaw channels status --probe # Actively probe connections
```

| Symptom | Troubleshooting |
|---|---|
| Messages not received | Check policy → allowlist → mention → user restrictions |
| DM issues | `dm.enabled` → policy → pairing approvals |
| Group issues | group policy → sender allowlist → mention gating |

### Sandbox

```bash
openclaw sandbox explain         # View effective settings
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

| Symptom | Troubleshooting |
|---|---|
| Tool blocked | Check `tools.sandbox.tools.deny` |
| Shouldn't be sandboxed | Check `sandbox.mode` (under `non-main`, groups/channels are all considered non-main) |
| setupCommand fails | Check network (default is none), readOnlyRoot, user permissions |

### Session

```bash
openclaw sessions list           # List sessions
openclaw sessions cleanup --dry-run  # Preview cleanup
```

| Symptom | Troubleshooting |
|---|---|
| Conversations getting mixed up | Check `session.dmScope` (don't use `main` for multi-user DMs) |
| Context too long | Manually `/compact` or adjust compaction settings |
| Memory lost | Check memory flush settings |

### Gateway Network

```bash
openclaw health                  # Check Gateway health
openclaw gateway status          # Gateway status
```

| Symptom | Troubleshooting |
|---|---|
| Cannot connect to Gateway | Check `gateway.bind` and port |
| WebSocket disconnects | Check reverse proxy WS support |
| Trusted proxy failure | Check trustedProxies IP |

## Security Audit

```bash
openclaw security audit          # Security configuration check
```

Checks:
- Trusted proxy auth configuration
- Missing trustedProxies
- Empty allowUsers
- Insecure safeBins (interpreters/runtimes)
- Missing safeBinProfiles

## Logs

OpenClaw's log output includes structured diagnostic codes (e.g., `SECRETS_REF_IGNORED_INACTIVE_SURFACE`, `SECRETS_GATEWAY_AUTH_SURFACE`) that can be used to trace specific behaviors.

## Maintenance Scheduling

```json5
{
  session: {
    maintenance: {
      mode: "enforce",         // warn | enforce
      pruneAfterDays: 30,
      maxEntries: 500,
      rotationThresholdMb: 10
    }
  }
}
```

For production environments, the `enforce` mode with automatic cleanup is recommended.

## Useful Command Reference

| Command | Function |
|---|---|
| `openclaw doctor` | Full diagnostics |
| `openclaw doctor --fix` | Automatic repair |
| `openclaw health` | Gateway health |
| `openclaw models status` | Model authentication |
| `openclaw channels status --probe` | Channel probing |
| `openclaw sandbox explain` | Sandbox settings |
| `openclaw security audit` | Security audit |
| `openclaw sessions cleanup --dry-run` | Preview cleanup |
| `openclaw config validate` | Config validation |
| `/context detail` | Context size breakdown |
| `/tools verbose` | Available tools in detail |

## Overall

OpenClaw's operations tooling is comprehensive -- `doctor` for all-in-one diagnostics, `sandbox explain` for sandbox inspection, `channels status --probe` for connectivity checks, and `security audit` for security reviews. When encountering issues, start with `doctor`, then drill down based on the symptoms.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/troubleshooting/index.md](https://github.com/openclaw/openclaw/blob/main/docs/troubleshooting/index.md) — Troubleshooting overview
- [docs/troubleshooting/common-issues.md](https://github.com/openclaw/openclaw/blob/main/docs/troubleshooting/common-issues.md) — Common issues
- [docs/channels/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/troubleshooting.md) — Channel troubleshooting
- [docs/automation/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/troubleshooting.md) — Automation troubleshooting
- [docs/nodes/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/troubleshooting.md) — Nodes troubleshooting
- [docs/gateway/security.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/security.md) — Gateway security
