---
title: "OpenClaw 桌面平台：Windows 現在有原生 Hub，而 Node 是硬性需求"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, macos, linux, windows, wsl2, windows-hub, platforms]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 4
tldr: "Node 是必要的執行期，因為標準狀態儲存用 node:sqlite——Bun 只能拿來裝依賴。Windows 這邊變化最大：新增了原生的 Windows Hub companion app，不需要管理員權限，還能自己開一個 app 專屬的 WSL 發行版來裝 Gateway。"
description: "OpenClaw 在 macOS、Linux 與 Windows 上的支援現況：Node 執行期的硬性需求、Windows Hub 的三種角色、三種 Windows 路徑的選擇，以及各 OS 的服務安裝目標。"
draft: false
---

OpenClaw 核心用 TypeScript 寫成，而有一條硬性需求要先講：

> **Node 是必要的執行期**，因為標準的狀態儲存使用 `node:sqlite`。Bun 仍可用於安裝依賴與執行套件腳本。

也就是說，Bun 在這裡是套件管理器，不是 runtime——這點在前面安裝那篇也提過，兩邊一致。

## Windows 的三條路，先選一條

Windows 是這一輪變化最大的平台，現在有三種明顯不同的用法：

| 路徑 | 適合 | 特點 |
|---|---|---|
| **Windows Hub** | 想要桌面 app 的人 | 原生 WinUI app，含設定、系統匣狀態、聊天、診斷與 Windows node 能力 |
| **原生 PowerShell 安裝** | 終端機優先 | 直接裝 CLI 與 Gateway |
| **WSL2** | 要最接近 Linux 的 Gateway 執行期 | 相容性最好 |

### Windows Hub 值得單獨講

它是給 Windows 10 20H2+ 與 Windows 11 的原生 WinUI companion app，**不需要管理員權限就能安裝**，並提供簽署過的 x64 與 ARM64 安裝檔。

有一個發布節奏上的細節要注意：**Windows Hub 獨立於 OpenClaw CLI 與 Gateway 發布**。一般的 OpenClaw 穩定版會鏡像一份釘死、經過發布驗證的 Hub 建置，但**那份鏡像可能落後於較新的獨立 Hub 發布**。

它包含的東西：系統匣狀態與開機自啟、**首次執行時為本地 app 擁有的 WSL Gateway 做設定**、本地／遠端／SSH 通道 Gateway 的連線設定、原生聊天視窗與瀏覽器 Control UI 的入口、涵蓋 session／用量／頻道／節點／配對與修復指令的 Command Center 診斷，以及 **Windows node 模式**與**本地 MCP 伺服器模式**。

首次啟動時最快的路徑是 **Set up locally**：它會佈建一個 **app 專屬的 `OpenClawGateway` WSL 發行版**、在裡面裝 Gateway、然後把 app 配對上去。官方特別註明：**這不會匯出或改動你既有的 Ubuntu 發行版。**

### Hub 的三種角色可以疊加

| Node 模式 | MCP 伺服器 | 行為 |
|---|---|---|
| 關 | 關 | 純操作者桌面 app |
| 開 | 關 | 連上 Gateway 的 Windows node |
| 關 | 開 | 只當本地 MCP 伺服器 |
| 開 | 開 | Gateway node 加上本地 MCP 伺服器 |

**本地 MCP 模式**的用途很具體：把同一套 Windows 原生能力登錄暴露成 loopback 上的本地 MCP 伺服器，**讓 Claude Desktop、Claude Code、Cursor 這類 MCP 客戶端在沒有跑 OpenClaw Gateway 的情況下也能驅動 Windows 能力**。

Node 模式的能力面包含 Canvas、Screen、Camera、System（含 `system.run`）、Device 與 Talk 幾組指令，但**Gateway 只轉發 node 有宣告、而且伺服器政策允許的指令**——`screen.record`、`camera.snap`、`camera.clip` 這類隱私敏感的指令需要明確的 `gateway.nodes.commands.allow` 選擇加入。

## macOS 與 Linux

**macOS** 有選單列 app，而且它可以跑在 **node 模式**——選單列 app 以一個 node 的身分連上 Gateway 的 WS 伺服器，替 node-host 指令面加上原生的 Canvas、相機、螢幕、通知與電腦控制指令。

**這裡有一條不要踩的**：**不要在那台 Mac 上再啟一個 CLI node**。app 已經把對應的 CLI node-host 執行期當成內部 worker 在跑，並且是唯一的 Gateway 連線與 node 身分。

**Linux** 的 companion app **還在計畫中**，但 **Gateway 本身今天就完整支援**。

## 服務安裝：四種方式，三種目標

安裝 Gateway 服務有四條路，官方說都受支援：

```bash
openclaw onboard --install-daemon   # 精靈（建議）
openclaw gateway install            # 直接
openclaw configure                  # 選 Gateway service
openclaw doctor                     # 修復／遷移時會提議安裝或修正服務
```

服務目標依 OS 不同：

| OS | 目標 |
|---|---|
| macOS | LaunchAgent（`ai.openclaw.gateway`，具名 profile 則是 `ai.openclaw.<profile>`）|
| Linux / WSL2 | systemd user service（`openclaw-gateway[-<profile>].service`）|
| 原生 Windows | **Scheduled Task**（`OpenClaw Gateway`），**若建立被拒則退回每使用者的 Startup 資料夾登入項目** |

Windows 的實作細節值得知道：排程工作保留了狀態目錄裡那份**可讀的 `gateway.cmd` 腳本**，但透過一個產生出來的 **`gateway.vbs` WScript 包裝**去啟動它——**這樣背景 Gateway 就不會開出一個可見的主控台視窗**。

## 一個 Windows 專屬的排查點

Control UI 那篇會提到，但這裡先標：**原生 Windows 的 LAN 綁定上，即使 `127.0.0.1` 在 Gateway 主機上可用，Windows 防火牆或組織管理的群組原則仍可能擋掉廣告出來的 LAN URL。**

診斷方式是在 Windows 主機上跑：

```powershell
openclaw gateway status --deep
```

它會回報可能被擋的埠、profile 不符，以及**原則可能忽略的本地防火牆規則**。

## 整體來說

桌面平台的選擇現在其實是在回答「**你要 app 還是要終端機**」：Windows Hub 與 macOS 選單列 app 給你系統匣狀態、原生聊天與 node 能力；PowerShell／CLI 安裝給你直接的 Gateway 控制；WSL2 給你最接近 Linux 的執行期。

而不管走哪條，Node 都是硬性需求——這是 `node:sqlite` 帶來的約束，不是偏好問題。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**Node 是必要執行期（因 `node:sqlite`）而 Bun 只用於安裝依賴**、**原生的 Windows Hub companion app**（WinUI、免管理員權限、簽署的 x64／ARM64、獨立於 CLI 發布且鏡像版可能落後、首次啟動可佈建 app 專屬的 `OpenClawGateway` WSL 發行版而不動既有 Ubuntu）、**Hub 的 node 模式與本地 MCP 模式可疊加的四種組合**與隱私敏感指令需明確 allow、三種 Windows 路徑的選擇、macOS 選單列 app 的 node 模式與「不要再啟第二個 CLI node」的警告、Linux companion app 仍在計畫但 Gateway 完整支援、**四種服務安裝方式與三種 OS 目標**（含 Windows 的 `gateway.vbs` 包裝避免主控台視窗、以及排程工作被拒時退回 Startup 資料夾），以及 Windows LAN 綁定被防火牆或群組原則擋住時用 `gateway status --deep` 診斷。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Platforms](https://docs.openclaw.ai/platforms/) — 平台支援總覽與服務安裝目標
- [Windows](https://docs.openclaw.ai/platforms/windows) — Windows Hub、原生 CLI、WSL2 與 node 模式
- [macOS](https://docs.openclaw.ai/platforms/macos) — 選單列 app
- [Linux](https://docs.openclaw.ai/platforms/linux) — Linux 上的 Gateway
- [Nodes](https://docs.openclaw.ai/nodes/) — node 的指令政策與配對
