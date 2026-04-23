---
title: "OpenClaw UI：Control UI、TUI 與 Web Chat"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, control-ui, tui, web-chat, dashboard, terminal]
lang: zh-TW
tldr: "Control UI 是瀏覽器 dashboard（http://127.0.0.1:18789），TUI 是終端互動介面，Web Chat 是 WebSocket 即時聊天。"
description: "OpenClaw 的三種使用者介面：Control UI 瀏覽器 Dashboard、TUI 終端介面、Web Chat 即時聊天。"
draft: false
---

OpenClaw 提供多種互動方式——從瀏覽器 dashboard 到終端介面，從 WebSocket 聊天到聊天平台頻道。

## Control UI（瀏覽器 Dashboard）

`http://127.0.0.1:18789`——Gateway 內建的管理介面。

### 功能

| 區域 | 功能 |
|---|---|
| Dashboard | 系統狀態總覽 |
| Sessions | Session 列表、對話記錄 |
| Channels | 頻道狀態、連線管理 |
| Models | 模型狀態、認證狀態 |
| Agents | Agent 列表、設定 |
| Nodes | Node 狀態、配對管理 |
| Config | 設定編輯（需啟用 `commands.config`） |
| Chat | 內建 Web Chat |

### 存取控制

- Loopback 綁定時不需認證
- 非 loopback 需要 token 或 password
- Tailscale Serve 可用 Tailscale identity
- Trusted Proxy 可委託 reverse proxy

### 設定

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

## Web Chat

Control UI 內建的即時聊天，走 WebSocket。

### 特色

- 即時串流回覆
- Thinking 層級選擇器
- 媒體附件支援
- 工具呼叫視覺化
- Session 切換

### Thinking 選擇器

Web Chat 的 thinking 選擇器映射 session 存儲的層級。選擇新層級只影響下一則訊息（`thinkingOnce`），發送後回到 session 預設。要永久改 session 預設，用 `/think:<level>` directive。

## TUI（終端介面）

CLI 的互動模式。

```bash
openclaw chat                    # 開始互動
openclaw chat --agent work       # 指定 agent
openclaw chat --session isolated # 隔離 session
```

### 特色

- 終端內即時串流
- 支援所有 slash commands
- 支援所有 directives
- 背景執行監控

## WebChat 頻道

除了 Control UI 內建的 Web Chat，OpenClaw 還有 WebChat 作為獨立頻道，走 WebSocket，支援 pairing 和存取控制。

## macOS Menu Bar App

macOS 的 menu bar app 可以作為：
- Gateway 控制面板
- Node（提供 Canvas/Camera）
- Skills 管理 UI

### Skills UI

在 macOS app 裡：
- 瀏覽可用 skills
- 啟用/停用 skills
- 安裝 skills（brew/npm/go/download）
- 設定 skill API key

## CLI 操作

```bash
openclaw health                  # 檢查 Gateway 健康
openclaw channels status         # 頻道狀態
openclaw models status           # 模型狀態
openclaw nodes status            # Node 狀態
openclaw doctor                  # 全面診斷
openclaw doctor --fix            # 嘗試修復
```

## 整體來說

OpenClaw 的 UI 覆蓋了不同使用場景：Control UI 適合管理和監控、Web Chat 適合快速測試、TUI 適合終端使用者、macOS App 適合桌面整合。所有介面都連到同一個 Gateway，狀態完全同步。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/ui/control-ui.md](https://github.com/openclaw/openclaw/blob/main/docs/ui/control-ui.md) — Control UI
- [docs/ui/tui.md](https://github.com/openclaw/openclaw/blob/main/docs/ui/tui.md) — TUI
- [docs/ui/index.md](https://github.com/openclaw/openclaw/blob/main/docs/ui/index.md) — UI 總覽
- [docs/channels/webchat.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/webchat.md) — WebChat 頻道
- [docs/platforms/macos.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/macos.md) — macOS App
