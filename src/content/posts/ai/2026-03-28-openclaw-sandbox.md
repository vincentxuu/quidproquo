---
title: "OpenClaw 沙箱機制：Docker、SSH 與 OpenShell"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, sandbox, docker, ssh, openshell, security, tool-policy, elevated]
lang: zh-TW
tldr: "OpenClaw 沙箱有三層控制：Sandbox 決定在哪跑（Docker/SSH/OpenShell）、Tool Policy 決定能用什麼工具、Elevated 是 exec 的主機逃生門。"
description: "OpenClaw 沙箱機制完整指南：三種後端（Docker/SSH/OpenShell）、三層控制（Sandbox/Tool Policy/Elevated）、workspace 存取模式與安全設定。"
draft: false
---

OpenClaw 可以把工具執行放進沙箱，減少模型「做了蠢事」時的影響範圍。這篇講沙箱的三種後端、三層控制機制、以及它們之間的關係。

## 三層控制模型

OpenClaw 有三個相關但不同的安全控制：

| 控制 | 功能 | 設定路徑 |
|---|---|---|
| **Sandbox** | 決定工具**在哪裡跑** | `agents.defaults.sandbox.*` |
| **Tool Policy** | 決定**哪些工具可用** | `tools.*` / `tools.sandbox.tools.*` |
| **Elevated** | exec 的**主機逃生門** | `tools.elevated.*` |

這三層是獨立的。Tool Policy 是硬性限制——即使你開了沙箱，被 deny 的工具還是不能用。Elevated 只影響 `exec`，不會多給你工具。

### 診斷工具

```bash
openclaw sandbox explain
openclaw sandbox explain --session agent:main:main
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

這會印出：有效的 sandbox mode、tool allow/deny、elevated gates、以及每個設定來自哪裡。

## Sandbox Mode

`agents.defaults.sandbox.mode` 控制**什麼時候**啟用沙箱：

| Mode | 行為 |
|---|---|
| `"off"` | 不沙箱，全部跑在主機 |
| `"non-main"` | 只有非 main session 進沙箱（群組、頻道都算非 main） |
| `"all"` | 所有 session 都進沙箱 |

**常見誤解：** `"non-main"` 是看 `session.mainKey`，不是 agent ID。群組/頻道 session 的 key 不是 `main`，所以會被沙箱。

## Sandbox Scope

`agents.defaults.sandbox.scope` 控制容器數量：

| Scope | 行為 |
|---|---|
| `"session"` | 每個 session 一個容器（預設） |
| `"agent"` | 每個 agent 一個容器 |
| `"shared"` | 所有沙箱 session 共用一個容器 |

## 三種後端

### Docker（預設）

本地容器，完整隔離。

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "session",
        workspaceAccess: "none",
      }
    }
  }
}
```

預設 image：`openclaw-sandbox:bookworm-slim`，用 `scripts/sandbox-setup.sh` 建。如果需要更多工具（curl、jq、Node、Python），用 `scripts/sandbox-common-setup.sh` 建 `openclaw-sandbox-common:bookworm-slim`。

安全預設：
- **網路預設關閉**（`docker.network` 預設 `"none"`）
- `network: "host"` 被封鎖
- `network: "container:<id>"` 預設封鎖（namespace join bypass 風險），需要 `dangerouslyAllowContainerNamespaceJoin: true` 才能開

### SSH

遠端 SSH 主機上跑沙箱。

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "ssh",
        ssh: {
          target: "user@gateway-host:22",
          workspaceRoot: "/tmp/openclaw-sandboxes",
          identityFile: "~/.ssh/id_ed25519",
        }
      }
    }
  }
}
```

SSH 是**遠端正本模式**——首次使用時從本地 seed 到遠端，之後所有操作都在遠端。`openclaw sandbox recreate` 會重新 seed。

認證材料支援：
- 本地檔案（`identityFile`、`certificateFile`、`knownHostsFile`）
- SecretRef / 內嵌字串（`identityData`、`certificateData`、`knownHostsData`）——寫到 `0600` 暫存檔，SSH session 結束時刪除
- 兩者都設時，`*Data` 優先

### OpenShell

託管式遠端沙箱，用 OpenShell plugin。

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "openshell",
      }
    }
  },
  plugins: {
    entries: {
      openshell: {
        enabled: true,
        config: {
          from: "openclaw",
          mode: "remote",  // mirror | remote
        }
      }
    }
  }
}
```

OpenShell 有兩種 workspace 模式：

| 模式 | 正本在哪 | 同步行為 | 適合 |
|---|---|---|---|
| `mirror` | 本地 | 每次 exec 前後雙向同步 | 把沙箱當臨時執行環境 |
| `remote` | 遠端 | 只 seed 一次，不回同步 | 把沙箱當正式 workspace |

### 後端比較

| | Docker | SSH | OpenShell |
|---|---|---|---|
| 在哪跑 | 本地容器 | 任何 SSH 主機 | OpenShell 託管 |
| 設定 | `sandbox-setup.sh` | SSH key + 目標主機 | OpenShell plugin |
| Workspace | Bind-mount 或 copy | 遠端正本（seed 一次）| mirror 或 remote |
| 瀏覽器沙箱 | ✅ | ❌ | ❌（尚未支援）|
| Bind mount | `docker.binds` | N/A | N/A |

## Workspace Access

`workspaceAccess` 控制沙箱能看到什麼：

| 模式 | 行為 |
|---|---|
| `"none"`（預設）| 看到 `~/.openclaw/sandboxes` 下的獨立 workspace |
| `"ro"` | agent workspace 掛載在 `/agent`（唯讀，停用 write/edit） |
| `"rw"` | agent workspace 掛載在 `/workspace`（讀寫） |

## Bind Mounts（Docker）

`docker.binds` 把主機目錄掛進容器：

```json5
{
  sandbox: {
    docker: {
      binds: ["/home/user/source:/source:ro", "/var/data:/data:ro"]
    }
  }
}
```

**安全注意事項：**
- Bind **穿透**沙箱檔案系統——掛了什麼就看得到什麼
- OpenClaw 封鎖危險來源：`docker.sock`、`/etc`、`/proc`、`/sys`、`/dev`
- 機密掛載應該用 `:ro`
- Global 和 per-agent binds 會**合併**（不是取代）
- `scope: "shared"` 下忽略 per-agent binds

## Tool Policy

兩層工具控制：

**全域 / Per-agent：**
- `tools.profile` — 基礎 allowlist
- `tools.allow` / `tools.deny` — 全域規則
- `tools.byProvider[provider].allow/deny` — 按 provider 的規則

**沙箱內專用：**
- `tools.sandbox.tools.allow` / `tools.sandbox.tools.deny`

規則：`deny` 永遠勝出。如果 `allow` 非空，其他全部視為 blocked。

### Tool Groups

Tool policy 支援群組簡寫：

| 群組 | 包含工具 |
|---|---|
| `group:runtime` | exec, bash, process |
| `group:fs` | read, write, edit, apply_patch |
| `group:sessions` | sessions_list, sessions_history, sessions_send, sessions_spawn, session_status |
| `group:memory` | memory_search, memory_get |
| `group:ui` | browser, canvas |
| `group:automation` | cron, gateway |
| `group:messaging` | message |
| `group:nodes` | nodes |
| `group:openclaw` | 所有內建工具（不含 plugin） |

## Elevated：主機逃生門

Elevated **不會**多給工具，只影響 `exec`：

- `/elevated on` — 沙箱內的 exec 跑在主機上（仍需 approval）
- `/elevated full` — 跳過 exec approval
- 已經在主機上時，elevated 等於 no-op

Gates：
- `tools.elevated.enabled` — 啟用
- `tools.elevated.allowFrom.<provider>` — 發送者 allowlist

**注意：** `/exec` 和 elevated 不同。`/exec` 只調整 per-session 的 exec 預設值，不授予工具存取權限。

## setupCommand

`setupCommand` 在容器建立後跑一次（不是每次 exec 都跑）：

```json5
{
  sandbox: {
    docker: {
      setupCommand: "apt-get update && apt-get install -y nodejs"
    }
  }
}
```

常見陷阱：
- 預設無網路 → 套件安裝會失敗
- `readOnlyRoot: true` → 寫入失敗
- 需要 root 權限才能裝套件
- 沙箱 exec 不繼承主機 `process.env`

## 瀏覽器沙箱

Docker 後端支援獨立的瀏覽器沙箱容器：

```bash
scripts/sandbox-browser-setup.sh
```

特色：
- 用獨立 Docker 網路（`openclaw-sandbox-browser`）
- CDP source range 可限制（`browser.cdpSourceRange`）
- noVNC 觀察存取有密碼保護，用短效 token URL
- 可選 `allowHostControl` 讓沙箱 session 控制主機瀏覽器

## Multi-Agent 覆寫

每個 agent 可以獨立覆寫沙箱 + 工具設定：

```json5
{
  agents: {
    list: [{
      id: "build",
      sandbox: { mode: "all", scope: "agent" },
      tools: { allow: ["group:runtime", "group:fs"] }
    }]
  }
}
```

## 常見問題

### "Tool X blocked by sandbox tool policy"

修法：
1. 關閉沙箱：`agents.defaults.sandbox.mode = "off"`
2. 或在沙箱內允許：加到 `tools.sandbox.tools.allow`
3. 或從 `tools.sandbox.tools.deny` 移除

### "我以為是 main session，為什麼被沙箱了？"

`"non-main"` 模式下，群組/頻道 key 不是 main。用 `sandbox explain` 查看實際的 session key。

## 整體來說

OpenClaw 的沙箱設計是**多層防禦**：

1. **Sandbox** 決定執行環境（Docker/SSH/OpenShell）
2. **Tool Policy** 決定可用工具（deny 永遠勝出）
3. **Elevated** 是 exec 專用的主機逃生門

三層獨立運作，互不取代。不是完美的安全邊界，但能有效限制模型行為的影響範圍。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/gateway/sandboxing.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandboxing.md) — 沙箱完整參考
- [docs/gateway/sandbox-vs-tool-policy-vs-elevated.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandbox-vs-tool-policy-vs-elevated.md) — 三層控制比較
- [docs/gateway/openshell.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/openshell.md) — OpenShell 後端
- [docs/tools/elevated.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/elevated.md) — Elevated Mode
- [docs/tools/multi-agent-sandbox-tools.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/multi-agent-sandbox-tools.md) — Multi-Agent 沙箱與工具
