---
title: "OpenClaw Gateway 篇（二）：遠端存取、Tailscale 與多 Gateway"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, remote-access, tailscale, ssh-tunnel, multi-gateway]
lang: zh-TW
tldr: "Gateway 預設只綁 loopback，遠端存取用 SSH tunnel 或 Tailscale Serve/Funnel，多 Gateway 可以分散負載。"
description: "OpenClaw Gateway 的遠端存取方式（SSH Tunnel、Tailscale Serve/Funnel）、TLS/HSTS 設定、以及多 Gateway 架構。"
draft: false
---

Gateway 預設綁在 loopback（127.0.0.1:18789）。這篇講怎麼從遠端安全存取，以及多 Gateway 架構。

## 三種部署模式

### 模式一：Always-on Gateway（VPS/家用伺服器）

Gateway 跑在永遠開著的機器上，透過 Tailscale 或 SSH 存取。你的筆電可以隨時休眠。

### 模式二：桌面 + 遠端筆電

桌面跑 Gateway，筆電用 Remote over SSH 模式連接（macOS app 自動管理）。

### 模式三：本地 Gateway + 遠端存取

Gateway 跑在筆電上，透過 SSH tunnel 或 Tailscale Serve 安全暴露。

## SSH Tunnel

最簡單的遠端存取方式：

```bash
ssh -N -L 18789:127.0.0.1:18789 user@host
```

這讓本地的 `openclaw health` 等 CLI 指令可以透明地連到遠端 Gateway。

## Tailscale 整合

OpenClaw 可以自動設定 Tailscale Serve 或 Funnel。

### 三種模式

| 模式 | 範圍 | 說明 |
|---|---|---|
| `serve` | Tailnet 內 | 透過 `tailscale serve`，Gateway 留在 loopback |
| `funnel` | 公網 | 透過 `tailscale funnel`，需要共享密碼 |
| `off`（預設）| — | 不用 Tailscale 自動化 |

### Tailnet-only（Serve）

```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "serve" },
  }
}
```

存取：`https://<magicdns>/`

### Serve + Tailscale Auth

`gateway.auth.allowTailscale: true` 時，Control UI 可以用 Tailscale identity header 認證，不需 token/password。

OpenClaw 驗證方式：
1. 確認 request 來自 loopback
2. 有 Tailscale 的 `x-forwarded-for`、`x-forwarded-proto`、`x-forwarded-host` headers
3. 用 `tailscale whois` 解析身份
4. 比對 header

**注意：** HTTP API 端點（`/v1/*`、`/tools/invoke`）仍然需要 token/password。

### Public（Funnel + 密碼）

```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "funnel" },
    auth: { mode: "password", password: "replace-me" },
  }
}
```

Funnel 拒絕沒有密碼的啟動，避免公開暴露。建議用 `OPENCLAW_GATEWAY_PASSWORD` 環境變數。

### 直接 Tailnet 綁定

不用 Serve/Funnel，直接綁定 Tailnet IP：

```json5
{
  gateway: {
    bind: "tailnet",
    auth: { mode: "token", token: "your-token" },
  }
}
```

**注意：** 這個模式下 loopback 不可用。

### Tailscale 前提

- Serve 需要 tailnet 啟用 HTTPS
- Funnel 需要 Tailscale v1.38.3+、MagicDNS、HTTPS、funnel node attribute
- Funnel 只支援 port 443、8443、10000
- macOS Funnel 需要開源版 Tailscale app

### CLI

```bash
openclaw gateway --tailscale serve
openclaw gateway --tailscale funnel --auth password
```

## 遠端瀏覽器控制

Gateway 在一台機器，瀏覽器在另一台：在瀏覽器機器上跑 **node host**，兩者在同一 tailnet。Gateway 會 proxy 瀏覽器操作到 node。

## 安全原則

- **預設 loopback** — 永遠是最安全的起點
- 用 SSH 或 Tailscale 存取，不要直接暴露
- 明文 `ws://` 只限 loopback
- 非 loopback 綁定需要 token 或 password
- `gateway.tailscale.resetOnExit` 可在關閉時復原 Tailscale 設定

## 多 Gateway 架構

對於大型部署，可以跑多個 Gateway 實例，每個負責不同的頻道或 agent 群組。設定在 gateway 相關文件中。

## Gateway API

Gateway 提供 HTTP API 用於程式化互動：

- `/v1/*` — 核心 API 端點
- `/tools/invoke` — 工具呼叫
- `/api/channels/*` — 頻道操作
- WebSocket — 即時通訊

需要 token/password 認證。

## 整體來說

OpenClaw Gateway 的網路設計是「預設安全，顯式暴露」。Loopback 是起點，SSH tunnel 最簡單，Tailscale Serve 最方便，Funnel 才公網。多 Gateway 可以 scale。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/gateway/remote.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/remote.md) — 遠端存取
- [docs/gateway/tailscale.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/tailscale.md) — Tailscale 整合
- [docs/gateway/security.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/security.md) — Gateway 安全
- [docs/gateway/api.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/api.md) — Gateway API
- [docs/gateway/multi-gateway.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/multi-gateway.md) — 多 Gateway
