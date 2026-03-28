---
title: "OpenClaw 桌面平台：macOS、Linux 與 Windows"
date: 2026-03-28
category: ai
tags: [openclaw, macos, linux, windows, wsl2, systemd, launchd]
lang: zh-TW
tldr: "OpenClaw 在 macOS 有選單列 app、Linux 用 systemd 跑服務、Windows 建議走 WSL2。三個平台的差異與注意事項。"
description: "OpenClaw 在 macOS、Linux、Windows 三個桌面平台的安裝差異、服務管理、Node 功能與限制。"
draft: false
---

OpenClaw 的核心是 TypeScript，Node.js 是推薦的 runtime（Bun 不建議用在 Gateway，WhatsApp 和 Telegram 有相容性問題）。但三個桌面平台的體驗差異不小，這篇整理各自的特點。

## macOS

macOS 是 OpenClaw 體驗最完整的平台，有專屬的選單列 companion app。

### 選單列 App

不只是 Gateway 啟動器，它本身是一個 **Node**——可以把 macOS 的系統能力暴露給 AI agent：

- **Canvas** — 截圖、導覽、JavaScript 執行、A2UI push
- **Camera** — 前後鏡頭拍照、錄影片段
- **Screen Recording** — MP4 錄製
- **system.run** — 在 macOS 上執行指令（有 approval 機制）
- **Notifications** — 原生通知

### 運作模式

**Local Mode（預設）：** 連接本機的 Gateway，或自動啟用 launchd 服務。

**Remote Mode：** 連到遠端 Gateway（透過 SSH/Tailscale），同時啟動本地 node host，讓遠端 Gateway 能呼叫你 Mac 的 camera、canvas 等功能。

### 安全與 Exec Approvals

`system.run` 的執行受 `~/.openclaw/exec-approvals.json` 控制，支援 allowlist、逐次核准、過濾危險環境變數。

### Deep Links

註冊了 `openclaw://` URL scheme，可以帶 `message`、`sessionKey` 等參數，適合自動化場景。

### 注意事項

- State 目錄 `~/.openclaw` 不要放在 iCloud 同步路徑
- Gateway 服務用 launchd（LaunchAgent）管理

## Linux

Linux 是 Gateway 完整支援的平台，沒有專屬 companion app（社群開發中）。

### 服務管理

預設用 **systemd user service**。安裝指令三選一：

```bash
openclaw onboard --install-daemon
openclaw gateway install
openclaw configure
```

如果是共用或 always-on 的場景，可以改成 system service：

```ini
# 建立 systemd service unit
[Unit]
Description=OpenClaw Gateway

[Service]
ExecStart=/usr/bin/openclaw gateway
Restart=always
RestartSec=2

[Install]
WantedBy=default.target
```

### VPS 快速設定

```bash
# 裝 Node 24
# npm i -g openclaw@latest
# openclaw onboard --install-daemon
# SSH tunnel 到本機存取 Control UI
ssh -L 18789:127.0.0.1:18789 user@your-vps
```

### 診斷

`openclaw doctor` 可以檢查設定問題、自動遷移。

## Windows

Windows 支援兩條路：WSL2（推薦）和原生 Windows。

### WSL2（推薦）

WSL2 提供完整 Linux 環境，CLI、Gateway、所有工具都在 Linux 裡跑，是最穩定的路徑。

安裝方式跟 Linux 一樣。

**LAN 存取注意：** WSL 用虛擬網路，要從 LAN 存取需要做 port forwarding——把 Windows port 轉到 WSL IP。WSL IP 重啟後可能會變。

**Pre-login 啟動（Headless）：**
1. 啟用 WSL 的 user service persistence
2. 安裝 gateway user service
3. 用 Windows Scheduled Task 自動啟動 WSL

### 原生 Windows

功能持續改進中，但仍是次要路徑。

**可用：** 安裝（PowerShell script）、基本 CLI 指令、本地 agent/provider。

**限制：**
- Onboarding 預設要連到本地 Gateway，否則需加 `--skip-health`
- 服務安裝先嘗試 Windows Scheduled Task，失敗則 fallback 到 Startup 資料夾
- `schtasks` 無回應時會快速中止，不會 hang
- 沒有 companion app（計畫中）

## 服務管理方式比較

| 平台 | 服務機制 | 指令 |
|---|---|---|
| macOS | launchd (LaunchAgent) | `launchctl` |
| Linux | systemd user service | `systemctl --user` |
| Windows (WSL2) | systemd (WSL 內) | `systemctl --user` |
| Windows (原生) | Scheduled Task 或 Startup | `schtasks` |

## Node 功能比較

| 功能 | macOS App | Linux | Windows |
|---|---|---|---|
| Gateway | ✅ | ✅ | ✅ (WSL2) / ⚠️ (原生) |
| Canvas | ✅ | ❌ | ❌ |
| Camera | ✅ | ❌ | ❌ |
| Screen Recording | ✅ | ❌ | ❌ |
| system.run | ✅ | ✅ (CLI) | ✅ (WSL2) |
| Companion App | ✅ 選單列 | ❌ 開發中 | ❌ 計畫中 |
| Deep Links | ✅ `openclaw://` | ❌ | ❌ |

## 整體來說

macOS 體驗最完整，有 companion app 加 Node 功能。Linux 跑 Gateway 最穩、適合伺服器部署。Windows 走 WSL2 就對了，原生支援還在進步中。如果你要遠端部署 Gateway 在 Linux，可以用 macOS 或 iOS 配對 Node，兩邊各取所長。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/platforms/index.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/index.md) — 平台總覽
- [docs/platforms/macos.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/macos.md) — macOS 平台
- [docs/platforms/linux.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/linux.md) — Linux 平台
- [docs/platforms/windows.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/windows.md) — Windows 平台
- [docs/platforms/mac/](https://github.com/openclaw/openclaw/tree/main/docs/platforms/mac) — macOS App 子目錄
