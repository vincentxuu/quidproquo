---
title: "OpenClaw Access Control: Authentication, Secrets, and OAuth"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, authentication, secrets, oauth, trusted-proxy, secretref, security]
lang: en
tldr: "API Key is the most stable option; OAuth uses PKCE + token sink pattern; SecretRef supports env/file/exec sources; Trusted Proxy delegates authentication to a reverse proxy."
description: "OpenClaw authentication mechanisms (API Key / OAuth / Setup Token), SecretRef secret management, and Trusted Proxy Auth reverse proxy authentication."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-auth-secrets)

OpenClaw Gateway needs to manage two types of credentials: API authentication for model providers, and access control for the Gateway itself. This post covers how to configure both.

## Model Authentication

### API Key (Recommended)

For long-running Gateways, API Keys are the most stable choice.

```bash
# Set environment variable
export ANTHROPIC_API_KEY="..."
openclaw models status

# Or write to a .env file readable by the daemon
cat >> ~/.openclaw/.env <<'EOF'
ANTHROPIC_API_KEY=...
EOF
```

### API Key Rotation

Some providers support automatic key rotation when hitting rate limits:

| Priority | Source |
|---|---|
| 1 | `OPENCLAW_LIVE_<PROVIDER>_KEY` (single override) |
| 2 | `<PROVIDER>_API_KEYS` |
| 3 | `<PROVIDER>_API_KEY` |
| 4 | `<PROVIDER>_API_KEY_*` |

Only rate limit errors (429, quota, resource exhausted) trigger a switch to the next key. The key list is automatically deduplicated.

### Setup Token (Anthropic Subscription)

```bash
claude setup-token
openclaw models auth setup-token --provider anthropic
openclaw models status
```

**Note:** Anthropic's setup-token is a technical compatibility feature, not a policy guarantee. There have been cases where users were restricted when using it outside of Claude Code.

### Claude CLI Migration

If you've already logged into the Claude CLI on the Gateway host:

```bash
openclaw models auth login --provider anthropic --method cli --set-default
```

### OpenAI Codex OAuth

OpenAI explicitly supports using Codex OAuth in external tools (including OpenClaw).

Flow (PKCE):
1. Generate PKCE verifier/challenge + random state
2. Open authorization URL
3. Capture callback (`http://127.0.0.1:1455/auth/callback`) or manually paste the redirect URL
4. Exchange token
5. Store `{ access, refresh, expires, accountId }`

### Authentication Status Check

```bash
openclaw models status          # View status
openclaw models status --check  # Automation-friendly (exit 1 = expired, exit 2 = expiring soon)
openclaw doctor                 # Full diagnostics
```

### Per-Session Switching

```bash
/model Opus@anthropic:work      # Specify profile
/model list                     # Compact selector
/model status                   # Full view
```

## Token Sink Pattern

OAuth providers often issue a new refresh token during login/refresh and may revoke the old one. If you're simultaneously using OpenClaw and Claude Code / Codex CLI logged into the same account, one of them will be randomly "logged out."

OpenClaw uses `auth-profiles.json` as a **token sink**:
- The runtime reads credentials from a single location
- Supports multiple profiles with deterministic routing

### Multiple Accounts

**Method 1 (Recommended): Separate agents**
```bash
openclaw agents add work
openclaw agents add personal
```
Each agent has fully isolated sessions, credentials, and workspaces.

**Method 2: Multiple profiles in the same agent**

`auth-profiles.json` supports multiple profile IDs per provider. Use `auth.order` for global ordering, or `/model ...@<profileId>` for per-session override.

## Secrets Management (SecretRef)

OpenClaw supports SecretRef, so credentials don't need to be stored as plaintext in config files. Plaintext still works; SecretRef is opt-in.

### Runtime Model

- **Eager resolution** at startup, not lazy
- Unresolvable active SecretRef at startup → **fail fast**
- Reload uses **atomic swap**: all succeed, or keep the last-known-good snapshot
- Runtime requests only read from the in-memory snapshot

### SecretRef Format

```json5
{ source: "env" | "file" | "exec", provider: "default", id: "..." }
```

### Three Sources

**Env:**
```json5
{ source: "env", provider: "default", id: "OPENAI_API_KEY" }
```

**File:**
```json5
{ source: "file", provider: "filemain", id: "/providers/openai/apiKey" }
```
Uses JSON Pointer (RFC 6901) paths.

**Exec:**
```json5
{ source: "exec", provider: "vault", id: "providers/openai/apiKey" }
```
Runs an external program (stdin JSON request → stdout JSON response). Supports 1Password CLI, HashiCorp Vault, and sops.

### Provider Configuration

```json5
{
  secrets: {
    providers: {
      default: { source: "env" },
      filemain: {
        source: "file",
        path: "~/.openclaw/secrets.json",
        mode: "json",
      },
      vault: {
        source: "exec",
        command: "/usr/local/bin/openclaw-vault-resolver",
        args: ["--profile", "prod"],
        passEnv: ["PATH", "VAULT_ADDR"],
        jsonOnly: true,
      }
    }
  }
}
```

### Active Surface Filtering

SecretRef validation only applies to **actively enabled surfaces**:

- Enabled channels/accounts → unresolved blocks startup
- Disabled channels/accounts → unresolved does not block, only emits non-fatal diagnostics
- Sandbox SSH credentials → only active when backend is `ssh`

### Exec Integration Examples

**1Password CLI:**
```json5
{
  secrets: {
    providers: {
      onepassword_openai: {
        source: "exec",
        command: "/opt/homebrew/bin/op",
        allowSymlinkCommand: true,
        trustedDirs: ["/opt/homebrew"],
        args: ["read", "op://Personal/OpenClaw QA API Key/password"],
      }
    }
  }
}
```

**HashiCorp Vault:**
```json5
{
  secrets: {
    providers: {
      vault_openai: {
        source: "exec",
        command: "/opt/homebrew/bin/vault",
        allowSymlinkCommand: true,
        args: ["kv", "get", "-field=OPENAI_API_KEY", "secret/openclaw"],
        passEnv: ["VAULT_ADDR", "VAULT_TOKEN"],
      }
    }
  }
}
```

## Trusted Proxy Auth

Delegate Gateway authentication to a front-end reverse proxy (Pomerium, Caddy, nginx, Traefik).

### How It Works

1. Reverse proxy authenticates the user (OAuth, OIDC, SAML)
2. Proxy adds identity headers (e.g., `x-forwarded-user`)
3. OpenClaw verifies the request comes from a trusted proxy IP
4. OpenClaw extracts user identity from the header
5. Pass → authorized

### Configuration

```json5
{
  gateway: {
    bind: "loopback",
    trustedProxies: ["10.0.0.1", "172.17.0.1"],
    auth: {
      mode: "trusted-proxy",
      trustedProxy: {
        userHeader: "x-forwarded-user",
        requiredHeaders: ["x-forwarded-proto"],
        allowUsers: ["nick@example.com"],
      }
    }
  }
}
```

### Proxy Configuration Examples

| Proxy | Identity Header | Notes |
|---|---|---|
| Pomerium | `x-pomerium-claim-email` | Adds JWT assertion header |
| Caddy + OAuth | `x-forwarded-user` | caddy-security plugin |
| nginx + oauth2-proxy | `x-auth-request-email` | auth_request mode |
| Traefik + Forward Auth | `x-forwarded-user` | Forward auth middleware |

### Security Checklist

Before enabling trusted-proxy auth, verify the following:

- The proxy is the only path (Gateway port is firewalled from other sources)
- trustedProxies is minimized (only actual proxy IPs, not entire subnets)
- The proxy **overwrites** (not appends) `x-forwarded-*` headers
- TLS terminates at the proxy
- Setting allowUsers is recommended

### TLS and HSTS

**Recommended pattern:** The proxy handles TLS termination with HSTS configured at the proxy. OpenClaw uses HTTP on loopback.

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

If OpenClaw handles HTTPS itself:
```json5
{
  gateway: {
    tls: { enabled: true },
    http: {
      securityHeaders: {
        strictTransportSecurity: "max-age=31536000; includeSubDomains",
      }
    }
  }
}
```

### Common Errors

| Error | Cause |
|---|---|
| `trusted_proxy_untrusted_source` | Request does not come from an IP in trustedProxies |
| `trusted_proxy_user_missing` | User header is empty |
| `trusted_proxy_missing_header` | Required header is missing |
| `trusted_proxy_user_not_allowed` | User is not in the allowUsers list |

## Summary

OpenClaw's authentication and secret management has clear layering:

1. **Model Authentication** — API Key is the most stable; OAuth uses token sink to prevent mutual logout
2. **SecretRef** — Three sources (env/file/exec), fail fast at startup, active surface filtering
3. **Gateway Access** — Trusted Proxy delegates authentication with strict IP + header + user checks

For production environments, the recommended setup is: API Key + SecretRef (exec/vault) + Trusted Proxy Auth.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/gateway/authentication.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/authentication.md) — Model Authentication
- [docs/gateway/secrets.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/secrets.md) — Secrets Management
- [docs/concepts/oauth.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/oauth.md) — OAuth Mechanism
- [docs/gateway/trusted-proxy-auth.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/trusted-proxy-auth.md) — Trusted Proxy Auth
- [docs/auth-credential-semantics.md](https://github.com/openclaw/openclaw/blob/main/docs/auth-credential-semantics.md) — Auth Credential Semantics
