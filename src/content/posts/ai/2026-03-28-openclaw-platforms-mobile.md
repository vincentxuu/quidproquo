---
title: "OpenClaw 行動平台：iOS 與 Android"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, ios, android, mobile, node, canvas, camera, voice-wake]
lang: zh-TW
tldr: "OpenClaw 的 iOS 和 Android app 不是 Gateway，而是 Node——讓手機的相機、螢幕、位置、語音成為 AI agent 的感官延伸。"
description: "OpenClaw iOS 與 Android 的 Node 角色、配對流程、Canvas/Camera/Voice 功能與限制。"
draft: false
---

OpenClaw 的手機 app 跟你想的不一樣——它們不跑 Gateway，而是作為 **Node** 連接到 Gateway。Gateway 在你的電腦或伺服器上跑，手機把自己的硬體能力（相機、螢幕、位置、麥克風）暴露給 AI agent 使用。

## Node 的角色

```
Gateway（電腦 / VPS）
    ↕ WebSocket
手機 Node（iOS / Android）
    ↕
相機、Canvas、Location、Voice、SMS...
```

Node 是周邊設備，不是 Gateway。訊息從聊天 app 進到 Gateway，Gateway 把需要手機硬體的工具呼叫路由到配對的 Node。

## iOS

目前是 **內部預覽** 階段。

### 連線方式

三種 discovery 方式：

| 方式 | 場景 |
|---|---|
| Bonjour（區域網路）| Gateway 和 iPhone 在同一網路 |
| Tailscale DNS-SD | 跨網路，但都在 tailnet 裡 |
| 手動輸入 host/port | 任何情況 |

### 配對流程

1. 啟動 Gateway
2. iOS app 在設定中發現或手動輸入 Gateway
3. 在 Gateway 的 CLI 核准配對：

```bash
openclaw devices list
openclaw devices approve <requestId>
```

### 功能

**Canvas** — WKWebView 渲染互動內容。Gateway 在 `/__openclaw__/canvas/` 提供 HTTP 端點，可以導覽到自訂 URL、執行 JavaScript、截圖。

**Camera** — 前後鏡頭拍照、錄影片段（JPEG / MP4）。

**Voice Wake** — 喚醒詞啟動，加上連續語音模式。

**Location** — GPS 定位。

### Push 通知架構

iOS 版用 relay-backed push 系統，不把 APNs token 直接存在 Gateway 上。這是為了：
- 正式版憑證不散佈到使用者部署
- relay 只接受 Apple 正式發布的 build
- Gateway 只能對自己配對的裝置發 push
- app、relay、Gateway 之間有加密委派

### 限制

- 需要 app 在前景才能用媒體指令（iOS 背景執行限制）
- 重裝 app 後 keychain token 可能遺失，需重新配對
- Canvas host 設定遺漏會導致 canvas 載入失敗

## Android

源碼已開放，**尚未公開發布**。可以用 Java 17 + Android SDK 自行編譯。

### 連線方式

透過 mDNS/NSD 發現 Gateway，或手動輸入 WebSocket URL（`ws://<host>:18789`）。

### 配對流程

類似 iOS：Setup Code 或手動模式連線，然後在 Gateway CLI 核准。

```bash
openclaw devices list
openclaw devices approve <requestId>
```

### 功能

Android 的功能比 iOS 更豐富，因為 Android 的權限模型更開放：

**Chat** — 歷史紀錄、發送訊息、push 更新訂閱。

**Canvas / Camera** — HTML/CSS/JS 編輯、JPEG 截圖、MP4 錄影。

**Voice** — 麥克風控制、轉錄、TTS 播放（ElevenLabs 或系統 TTS fallback）。

**Device Commands（Android 獨有）：**

| 指令 | 功能 |
|---|---|
| `device.notifications` | 讀取通知 |
| `device.contacts` | 讀取聯絡人 |
| `device.calendar` | 讀取行事曆 |
| `device.callLogs` | 讀取通話紀錄 |
| `device.sms` | 發送簡訊 |
| `device.motion` | 動作感測器 |
| `device.status` | 裝置狀態 |

### 八步設定流程

1. Gateway 開啟 verbose logging
2. （可選）用 dns-sd 驗證 discovery
3. Android app 連線（Setup Code 或手動）
4. Gateway CLI 核准配對
5. 驗證連線（`openclaw nodes status`）
6. 測試 chat 功能
7. 測試 Canvas / Camera
8. 測試 Voice 和 device commands

## iOS vs Android 功能比較

| 功能 | iOS | Android |
|---|---|---|
| Canvas | ✅ WKWebView | ✅ WebView |
| Camera（拍照）| ✅ | ✅ |
| Camera（錄影）| ✅ | ✅ |
| Location | ✅ | ✅ |
| Voice Wake | ✅ | ✅ |
| Voice / TTS | ✅ | ✅ |
| Push 通知 | ✅ relay-backed | ✅ |
| SMS 發送 | ❌ | ✅ |
| 聯絡人 / 行事曆 | ❌ | ✅ |
| 通話紀錄 | ❌ | ✅ |
| 通知讀取 | ❌ | ✅ |
| 動作感測器 | ❌ | ✅ |
| 公開發布 | 內部預覽 | 未公開（可自行編譯）|

## Telegram 配對（iOS 推薦方式）

如果你用 Telegram，最簡單的 iOS 配對方式是透過 `device-pair` plugin：

1. 在 Telegram 對 bot 發 `/pair`
2. Bot 回覆設定指引和 setup code
3. iOS app → Settings → Gateway，貼上 setup code
4. 回到 Telegram：`/pair pending` 確認並核准

Setup code 是 base64 編碼的 JSON，包含 Gateway WebSocket URL 和短效 bootstrap token。

## 整體來說

手機在 OpenClaw 裡不是「另一個聊天介面」，而是 AI agent 的感官延伸。Gateway 在雲端或電腦上思考，手機提供相機、位置、螢幕等現實世界的輸入。Android 因為權限模型較開放，可以做更多事（讀通知、發簡訊、看行事曆）。iOS 則在推送通知的安全架構上更講究。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/platforms/index.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/index.md) — 平台總覽
- [docs/platforms/ios.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/ios.md) — iOS 平台
- [docs/platforms/android.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/android.md) — Android 平台
- [docs/nodes/index.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/index.md) — Nodes 總覽
- [docs/nodes/camera.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/camera.md) — Camera 功能
- [docs/nodes/audio.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/audio.md) — Audio 功能
- [docs/nodes/voicewake.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/voicewake.md) — Voice Wake 功能
- [docs/nodes/location-command.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/location-command.md) — Location 功能
- [docs/channels/pairing.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/pairing.md) — 配對機制（Telegram 配對）
