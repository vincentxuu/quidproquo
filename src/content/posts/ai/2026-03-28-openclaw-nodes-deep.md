---
title: "OpenClaw Nodes 深入：行動裝置與遠端主機"
date: 2026-03-28
category: ai
tags: [openclaw, nodes, ios, android, macos, camera, canvas, location, sms]
lang: zh-TW
tldr: "Node 是 Gateway 的周邊裝置——iOS/Android 提供相機/位置/通知，macOS 提供 Canvas/system.run，Node Host 讓遠端主機跑 exec。"
description: "OpenClaw Nodes 完整指南：裝置配對、Canvas/Camera/Location/SMS 指令、Node Host 遠端執行、以及 Android 個人資料存取。"
draft: false
---

Node 是連接到 Gateway 的周邊裝置，提供 Gateway 自己沒有的能力——相機、螢幕、位置、通知、甚至遠端指令執行。

## Node 基本概念

- Node 是**周邊**，不是 Gateway——不跑 gateway 服務
- 透過 WebSocket 連接 Gateway（同一個 port）
- 需要 device pairing 認證
- 訊息在 Gateway 處理，Node 只提供能力

### 配對

```bash
openclaw devices list               # 列出待配對裝置
openclaw devices approve <requestId> # 核准
openclaw devices reject <requestId>  # 拒絕
openclaw nodes status                # 檢查 node 狀態
```

## Node 類型

### iOS（內部預覽）

提供 Camera、Canvas、Location、Voice Wake 能力。透過 Telegram 配對最方便：對 bot 發 `/pair`，拿 setup code 貼到 iOS app。

### Android（原始碼可用）

能力最多——除了 Camera/Canvas/Location，還有：

| 指令族 | 能力 |
|---|---|
| `device.*` | status、info、permissions、health |
| `notifications.*` | list、actions |
| `photos.latest` | 最近照片 |
| `contacts.*` | search、add |
| `calendar.*` | events、add |
| `callLog.search` | 通話紀錄搜尋 |
| `sms.*` | search、send（需 SMS 權限） |
| `motion.*` | activity、pedometer |

### macOS Node Mode

macOS menu bar app 可以當 Node 使用，提供 Canvas 和 `system.run`。

### Headless Node Host

沒有 UI 的 node，跑在遠端機器上，提供 `system.run`、`system.which`。

## Canvas 指令

```bash
# 截圖
openclaw nodes canvas snapshot --node <id> --format png

# 控制
openclaw nodes canvas present --node <id> --target https://example.com
openclaw nodes canvas hide --node <id>
openclaw nodes canvas navigate https://example.com --node <id>
openclaw nodes canvas eval --node <id> --js "document.title"

# A2UI（JSONL 推送）
openclaw nodes canvas a2ui push --node <id> --text "Hello"
openclaw nodes canvas a2ui reset --node <id>
```

Node 必須在前景才能用 `canvas.*` 和 `camera.*`。

## Camera 指令

```bash
# 拍照
openclaw nodes camera list --node <id>
openclaw nodes camera snap --node <id>                    # 預設：前後鏡頭都拍
openclaw nodes camera snap --node <id> --facing front     # 只拍前鏡頭

# 錄影
openclaw nodes camera clip --node <id> --duration 10s
openclaw nodes camera clip --node <id> --duration 3000 --no-audio
```

限制：
- 錄影最長 60 秒
- Android 需要 CAMERA/RECORD_AUDIO 權限
- 背景呼叫回傳 `NODE_BACKGROUND_UNAVAILABLE`

## 螢幕錄製

```bash
openclaw nodes screen record --node <id> --duration 10s --fps 10
openclaw nodes screen record --node <id> --duration 10s --no-audio
```

## Location

```bash
openclaw nodes location get --node <id>
openclaw nodes location get --node <id> --accuracy precise --max-age 15000
```

- 預設關閉
- 回傳 lat/lon、accuracy（公尺）、timestamp
- 「Always」需要系統權限

## Node Host（遠端執行）

Gateway 在一台機器，exec 在另一台——用 Node Host。

### 啟動

```bash
# 前景
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"

# 透過 SSH tunnel（loopback bind 時）
ssh -N -L 18790:127.0.0.1:18789 user@gateway-host
OPENCLAW_GATEWAY_TOKEN="<token>" openclaw node run --host 127.0.0.1 --port 18790

# 安裝為服務
openclaw node install --host <gateway-host> --port 18789 --display-name "Build Node"
```

### 設定 exec 指向 node

```bash
openclaw config set tools.exec.host node
openclaw config set tools.exec.security allowlist
openclaw config set tools.exec.node "<id-or-name>"
```

或 per-session：
```
/exec host=node security=allowlist node=Build-Node
```

### Allowlist

```bash
openclaw approvals allowlist add --node <id> "/usr/bin/uname"
openclaw approvals allowlist add --node <id> "/usr/bin/sw_vers"
```

Approval 綁定具體的 request context。如果指令涉及本地檔案，OpenClaw 會綁定該檔案，檔案變更則拒絕執行。

## System 指令

```bash
openclaw nodes run --node <id> -- echo "Hello from node"
openclaw nodes notify --node <id> --title "Ping" --body "Gateway ready"
```

`system.run` 回傳 stdout/stderr/exit code。

## 整體來說

Nodes 讓 OpenClaw 超越純文字聊天——手機變成 agent 的眼睛（Camera）和手（SMS、Contacts），遠端主機變成 agent 的計算資源（Node Host）。所有互動都經過 Gateway 路由，approval 確保安全。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/nodes/index.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/index.md) — Nodes 總覽
- [docs/nodes/camera.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/camera.md) — Camera 指令
- [docs/nodes/audio.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/audio.md) — Audio 指令
- [docs/nodes/voicewake.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/voicewake.md) — Voice Wake
- [docs/nodes/location-command.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/location-command.md) — Location 指令
- [docs/nodes/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/troubleshooting.md) — Nodes 疑難排解
- [docs/platforms/ios.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/ios.md) — iOS
- [docs/platforms/android.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/android.md) — Android
- [docs/cli/node.md](https://github.com/openclaw/openclaw/blob/main/docs/cli/node.md) — Node CLI
