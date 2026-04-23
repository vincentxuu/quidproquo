---
title: "OpenClaw 存取控制：Authentication、Secrets 與 OAuth"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, authentication, secrets, oauth, trusted-proxy, secretref, security]
lang: zh-TW
tldr: "API Key 最穩、OAuth 用 PKCE + token sink 模式、SecretRef 支援 env/file/exec 三種來源、Trusted Proxy 可以委託 reverse proxy 做認證。"
description: "OpenClaw 的認證機制（API Key / OAuth / Setup Token）、SecretRef 密鑰管理、以及 Trusted Proxy Auth 反向代理認證。"
draft: false
---

OpenClaw Gateway 需要管理兩類憑證：模型供應商的 API 認證、以及 Gateway 本身的存取控制。這篇講這兩者的設定方式。

## 模型認證

### API Key（推薦）

長期運行的 Gateway，API Key 是最穩定的選擇。

```bash
# 設定環境變數
export ANTHROPIC_API_KEY="..."
openclaw models status

# 或寫入 daemon 可讀的 .env
cat >> ~/.openclaw/.env <<'EOF'
ANTHROPIC_API_KEY=...
EOF
```

### API Key 輪替

部分供應商在遇到 rate limit 時支援自動換 key：

| 優先順序 | 來源 |
|---|---|
| 1 | `OPENCLAW_LIVE_<PROVIDER>_KEY`（單一覆寫） |
| 2 | `<PROVIDER>_API_KEYS` |
| 3 | `<PROVIDER>_API_KEY` |
| 4 | `<PROVIDER>_API_KEY_*` |

只有 rate limit 錯誤（429、quota、resource exhausted）才會嘗試下一把 key。Key list 會自動去重。

### Setup Token（Anthropic 訂閱）

```bash
claude setup-token
openclaw models auth setup-token --provider anthropic
openclaw models status
```

**注意：** Anthropic 的 setup-token 是技術相容性，不是政策保證。過去有使用者在 Claude Code 外使用被限制的案例。

### Claude CLI 遷移

已經在 Gateway 主機上登入 Claude CLI 的話：

```bash
openclaw models auth login --provider anthropic --method cli --set-default
```

### OpenAI Codex OAuth

OpenAI 明確支援在外部工具（包含 OpenClaw）使用 Codex OAuth。

流程（PKCE）：
1. 產生 PKCE verifier/challenge + random state
2. 開啟授權 URL
3. 捕捉 callback（`http://127.0.0.1:1455/auth/callback`）或手動貼 redirect URL
4. Exchange token
5. 存入 `{ access, refresh, expires, accountId }`

### 認證狀態檢查

```bash
openclaw models status          # 查看狀態
openclaw models status --check  # 自動化友善（exit 1 = 過期, exit 2 = 即將過期）
openclaw doctor                 # 全面診斷
```

### Per-Session 切換

```bash
/model Opus@anthropic:work      # 指定 profile
/model list                     # 緊湊選擇器
/model status                   # 完整視圖
```

## Token Sink 模式

OAuth 供應商常在 login/refresh 時產生新的 refresh token，且可能作廢舊的。如果你同時用 OpenClaw 和 Claude Code / Codex CLI 登入同一帳號，其中一個會隨機被「登出」。

OpenClaw 用 `auth-profiles.json` 作為 **token sink**：
- Runtime 從一個地方讀憑證
- 支援多個 profile，確定性路由

### 多帳號

**方法一（推薦）：獨立 agent**
```bash
openclaw agents add work
openclaw agents add personal
```
各自的 session、憑證、workspace 完全隔離。

**方法二：同一 agent 多 profile**

`auth-profiles.json` 支援同 provider 多個 profile ID，用 `auth.order` 全域排序，或 `/model ...@<profileId>` per-session 覆寫。

## Secrets Management（SecretRef）

OpenClaw 支援 SecretRef，讓憑證不需要以明文存在設定檔裡。明文仍然可用，SecretRef 是 opt-in。

### Runtime 模型

- 啟動時**急切解析**（eager resolution），不是 lazy
- 啟動時 active SecretRef 無法解析 → **fail fast**
- Reload 用**原子交換**：全部成功，或保持 last-known-good snapshot
- Runtime request 只從記憶體 snapshot 讀取

### SecretRef 格式

```json5
{ source: "env" | "file" | "exec", provider: "default", id: "..." }
```

### 三種來源

**Env：**
```json5
{ source: "env", provider: "default", id: "OPENAI_API_KEY" }
```

**File：**
```json5
{ source: "file", provider: "filemain", id: "/providers/openai/apiKey" }
```
用 JSON Pointer（RFC 6901）路徑。

**Exec：**
```json5
{ source: "exec", provider: "vault", id: "providers/openai/apiKey" }
```
跑外部程式（stdin JSON request → stdout JSON response），支援 1Password CLI、HashiCorp Vault、sops。

### Provider 設定

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

### Active Surface 過濾

SecretRef 只在**有效啟用的表面**上驗證：

- 啟用的頻道/帳號 → 未解析會阻擋啟動
- 停用的頻道/帳號 → 未解析不阻擋，只發 non-fatal 診斷
- 沙箱 SSH 認證材料 → 只在 backend 是 `ssh` 時才 active

### Exec 整合範例

**1Password CLI：**
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

**HashiCorp Vault：**
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

把 Gateway 認證委託給前面的 reverse proxy（Pomerium、Caddy、nginx、Traefik）。

### 運作方式

1. Reverse proxy 認證使用者（OAuth、OIDC、SAML）
2. Proxy 加入身份 header（如 `x-forwarded-user`）
3. OpenClaw 檢查 request 來自 trusted proxy IP
4. OpenClaw 從 header 提取使用者身份
5. 通過 → 授權

### 設定

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

### Proxy 設定範例

| Proxy | 身份 Header | 特點 |
|---|---|---|
| Pomerium | `x-pomerium-claim-email` | 加 JWT assertion header |
| Caddy + OAuth | `x-forwarded-user` | caddy-security plugin |
| nginx + oauth2-proxy | `x-auth-request-email` | auth_request 模式 |
| Traefik + Forward Auth | `x-forwarded-user` | Forward auth middleware |

### 安全清單

啟用 trusted-proxy auth 前必須確認：

- Proxy 是唯一路徑（Gateway port 對其他來源有防火牆）
- trustedProxies 最小化（只放實際 proxy IP，不放整個子網）
- Proxy 會**覆寫**（不是 append）`x-forwarded-*` headers
- TLS 終止在 proxy
- 建議設 allowUsers

### TLS 與 HSTS

**推薦模式：** Proxy 做 TLS 終止，在 proxy 設 HSTS。OpenClaw 在 loopback 用 HTTP。

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

如果 OpenClaw 自己做 HTTPS：
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

### 常見錯誤

| 錯誤 | 原因 |
|---|---|
| `trusted_proxy_untrusted_source` | Request 不來自 trustedProxies 裡的 IP |
| `trusted_proxy_user_missing` | User header 是空的 |
| `trusted_proxy_missing_header` | 必要 header 不存在 |
| `trusted_proxy_user_not_allowed` | 使用者不在 allowUsers 裡 |

## 整體來說

OpenClaw 的認證和密鑰管理有清楚的分層：

1. **模型認證** — API Key 最穩、OAuth 用 token sink 避免互踢
2. **SecretRef** — env/file/exec 三種來源，啟動時 fail fast，active surface 過濾
3. **Gateway 存取** — Trusted Proxy 委託認證，嚴格的 IP + header + user 檢查

正式環境建議：API Key + SecretRef（exec/vault）+ Trusted Proxy Auth。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/gateway/authentication.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/authentication.md) — 模型認證
- [docs/gateway/secrets.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/secrets.md) — Secrets 管理
- [docs/concepts/oauth.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/oauth.md) — OAuth 機制
- [docs/gateway/trusted-proxy-auth.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/trusted-proxy-auth.md) — Trusted Proxy Auth
- [docs/auth-credential-semantics.md](https://github.com/openclaw/openclaw/blob/main/docs/auth-credential-semantics.md) — Auth Credential Semantics
