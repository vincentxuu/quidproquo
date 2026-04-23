---
title: "OpenClaw Gateway 篇（一）：設定系統與 Hot Reload"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, configuration, json5, hot-reload, openclaw-json]
lang: zh-TW
tldr: "openclaw.json 用 JSON5 格式，嚴格 schema 驗證，支援 hybrid hot reload（安全變更即時生效，關鍵變更自動重啟）。"
description: "OpenClaw Gateway 的設定系統：JSON5 格式、四種設定方式、嚴格 schema 驗證、Hybrid Hot Reload。"
draft: false
---

OpenClaw 的所有行為都由一個設定檔控制。這篇講設定系統的設計和使用方式。

## 設定檔

`~/.openclaw/openclaw.json`，JSON5 格式。不存在時用安全預設值。

### 四種設定方式

| 方式 | 說明 |
|---|---|
| `openclaw onboard` | 互動式精靈，適合新手 |
| `openclaw config set` | CLI 單行設定 |
| Control UI | 瀏覽器 `http://127.0.0.1:18789` |
| 直接編輯檔案 | 自動偵測變更 |

### 嚴格驗證

OpenClaw 只接受完全符合 schema 的設定。未知 key、型別錯誤、無效值 → Gateway 拒絕啟動。

```bash
openclaw doctor      # 診斷問題
openclaw doctor --fix  # 嘗試修復
```

### 最小設定範例

```json5
{
  agents: {
    defaults: {
      workspace: "~/openclaw-workspace"
    }
  },
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"]
    }
  }
}
```

## 主要設定區域

| 區域 | 涵蓋 |
|---|---|
| Channels | 頻道連線、存取控制 |
| Models | 模型選擇、failover |
| Agents | workspace、sandbox、tools |
| Session | DM scope、生命週期 |
| Automation | Cron、heartbeat、webhook |
| Gateway | 綁定、認證、網路 |
| Secrets | SecretRef provider |
| Skills | 載入、覆寫 |

## Hot Reload

設定檔變更時自動套用，不需手動重啟。

### Hybrid 模式（預設）

| 類型 | 行為 |
|---|---|
| 安全變更 | 即時 hot apply（頻道設定、模型、工具等） |
| 關鍵變更 | 自動重啟（Gateway server 設定） |

大部分設定在不停機的情況下更新。只有 gateway server 相關設定需要手動重啟。

### 環境變數

可以用 `~/.openclaw/.env` 設定環境變數，daemon 啟動時讀取。

```bash
# ~/.openclaw/.env
ANTHROPIC_API_KEY=sk-...
OPENCLAW_GATEWAY_TOKEN=my-token
```

`$OPENCLAW_STATE_DIR` 可以覆寫狀態目錄位置。

## Gateway 核心設定

### 綁定

```json5
{
  gateway: {
    bind: "loopback",    // loopback | lan | tailnet | auto | custom
    port: 18789,         // 預設
  }
}
```

| Bind | 說明 |
|---|---|
| `loopback` | 只有本機可連（預設，最安全） |
| `lan` | 區網可連 |
| `tailnet` | Tailscale IP |
| `auto` | 偏好 loopback |

### 認證

非 loopback 綁定需要認證：

```json5
{
  gateway: {
    auth: {
      mode: "token",      // token | password | trusted-proxy
      token: "your-token"
    }
  }
}
```

或用環境變數：
- `OPENCLAW_GATEWAY_TOKEN`
- `OPENCLAW_GATEWAY_PASSWORD`

### Control UI

```json5
{
  gateway: {
    controlUi: {
      enabled: true,
      basePath: "/"
    }
  }
}
```

## 設定工具

```bash
openclaw config get agents.defaults.workspace     # 讀取
openclaw config set channels.telegram.enabled true  # 設定
openclaw config list                                # 列出全部
openclaw config validate                            # 驗證
```

## 整體來說

OpenClaw 的設定系統有三個特點：JSON5 格式讓設定可讀可注釋、嚴格 schema 防止錯誤配置、Hybrid Hot Reload 讓大部分變更免重啟。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration.md) — 設定總覽
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration-reference.md) — 設定參考
- [docs/gateway/configuration-examples.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration-examples.md) — 設定範例
- [docs/gateway/heartbeat.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/heartbeat.md) — Heartbeat 設定
- [docs/help.md](https://github.com/openclaw/openclaw/blob/main/docs/help.md) — 環境變數與 .env
