---
title: "OpenClaw 文件導讀：200+ 份文件，從哪讀起？"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, ai-gateway, self-hosted, documentation, guide]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 1
tldr: "OpenClaw 有 200+ 份文件，這篇幫你搞懂全貌、知道每塊在講什麼、依你的角色決定從哪讀起。"
description: "OpenClaw 開源 AI 閘道器的完整文件導讀，涵蓋 16 個目錄、335 份文件的系列文章地圖。"
draft: false
---

OpenClaw 是一個開源、自架的 AI 閘道器——一個 Gateway 程式串接 WhatsApp、Telegram、Discord、iMessage 等 24+ 聊天平台到 AI agent。它的文件有 **16 個目錄、335 份檔案**，從安裝到威脅模型都有。這篇是整個系列的起點：先看全貌，再決定從哪讀起。

## OpenClaw 在做什麼

```
聊天 App (WhatsApp / Telegram / Discord / iMessage / Slack / ...)
       ↓
   Gateway（本地運行，port 18789）
       ↓
  ┌────┼────┬────────┬──────────┬──────────┐
  AI   CLI   Web UI   macOS App   手機 Node
Agent              (Control UI)   (iOS/Android)
```

你從手機傳一則訊息，Gateway 路由到 AI agent，agent 用工具做事（讀檔、跑指令、開瀏覽器、搜尋），再把結果送回你的聊天 app。Gateway 是唯一的控制平面，所有東西跑在你自己的機器上。

這不只是一個聊天機器人框架。它是一套完整的 AI agent 營運系統，涵蓋：多模型供應商切換、沙箱隔離、排程自動化、Plugin 生態、Mobile Node 整合、企業級存取控制。

## 文件全貌

| 目錄 | 檔案數 | 在講什麼 |
|---|---|---|
| `cli/` | 48 | 每個 CLI 指令的用法與參數 |
| `tools/` | 40 | 瀏覽器控制、8 種搜尋引擎、Sub-Agent、Skills、Exec、TTS、PDF... |
| `providers/` | 38 | 35+ 模型供應商各自的認證與設定（Anthropic、OpenAI、Google、DeepSeek、Ollama...）|
| `gateway/` | 34 | Gateway 設定、網路模型、Protocol、API、沙箱、Secrets、遠端存取 |
| `concepts/` | 29 | 核心架構概念：Agent Loop、Session、Memory、Streaming、Context Engine... |
| `channels/` | 29 | 24+ 頻道各自的設定：WhatsApp QR 配對、Telegram Bot、Discord、Slack、Signal... |
| `install/` | 27 | npm、Docker、K8s、Nix、Bun、9 個雲平台、Raspberry Pi、Ansible |
| `plugins/` | 17 | Plugin SDK、架構、Channel/Provider Plugin 開發、測試、發布 |
| `reference/` | 16 | AGENTS.md 模板、Token 計費、Prompt Caching、RPC、Release 流程 |
| `platforms/` | 10 | macOS、Linux、Windows/WSL2、iOS、Android 各自的注意事項 |
| `automation/` | 9 | Cron 排程、Webhook、Standing Orders、Gmail PubSub、Hooks |
| `nodes/` | 9 | iOS/Android Node 配對、Camera、Audio、Voice Wake、Location |
| `help/` | 7 | FAQ、疑難排解、Debug、環境問題 |
| `web/` | 5 | Control UI、Dashboard、WebChat、TUI |
| `security/` | 3 | MITRE ATLAS 威脅模型、Formal Verification |
| 根目錄 | ~12 | Pi 整合架構、Auth 語意、CI、VPS、網路拓撲 |

## 系列文章地圖

這個系列共 32 篇，分成 12 個區塊。以下是每個區塊的重點和適合的讀者。

### 入門篇（#1-3）

| # | 標題 | 你會知道 |
|---|---|---|
| 1 | 本篇 | 全貌、文件結構、從哪讀起 |
| 2 | 安裝指南（上）：六種本機安裝方式怎麼選 | 六種方式的取捨，以及 npm／pnpm lifecycle script、PATH、OOM 這些真正會卡住的地方 |
| 3 | 安裝指南（下）：雲端部署的四個決定 | 綁定與認證、管理面隔離、信任邊界、復原能力，以及 K8s 的探針與 ConfigMap 行為 |

**適合：** 所有人。先裝起來再說。

### 平台篇（#4-5）

| # | 標題 | 你會知道 |
|---|---|---|
| 4 | 桌面平台：Windows 有了原生 Hub | Node 是硬性需求、Windows 的三條路、各 OS 的服務安裝目標 |
| 5 | 行動平台：手機是周邊不是 Gateway | 核准範圍的三段分級、watchOS 的專屬傳輸、版本落差的升級順序 |

**適合：** 多裝置使用者。

### 模型篇（#6-8）

| # | 標題 | 你會知道 |
|---|---|---|
| 6 | 模型需求與供應商生態 | provider／model／agent runtime／channel 是四層，`openai/*` 不等於 Codex |
| 7 | 60 個供應商的分類地圖 | 接本地模型的實際門檻：tool support、16K context，以及 base URL 別加 `/v1` |
| 8 | 模型進階：容錯、冷卻與 Prompt Caching | 誰選的模型決定它嚴不嚴格；冷卻是 30 秒→1 分→5 分 |

**適合：** 想選模型、省錢、或確保高可用的人。

### Agent 核心篇（#9-12）

| # | 標題 | 你會知道 |
|---|---|---|
| 9 | 多 Agent：人格邊界與 agent 生 agent | 隔離的實際邊界，以及 agent 要求建立 agent 的來源追蹤與人類閘門 |
| 10 | Agent Runtime：系統 prompt 怎麼組出來 | 三層組裝、快取邊界的切法、Promised Work 的跟進契約 |
| 11 | Agent Loop：序列化與寫入者宣告 | 被取代的回合為什麼寫不進逐字稿；兩套 hook 的分工 |
| 12 | Session 與記憶 | 主 session 的匯流、incognito 的邊界、四個記憶檔案與 dreaming 蒸餾 |

**適合：** 想深入理解 agent 怎麼運作的人。這是 OpenClaw 的核心。

### 頻道篇（#13-16）

| # | 標題 | 你會知道 |
|---|---|---|
| 13 | 頻道總覽：31 個頻道幾乎都是 plugin | 「誰能觸發」與「模型看得到什麼」是兩個獨立的軸 |
| 14 | 主力頻道：WhatsApp、Telegram、Discord | 每個頻道那個「安靜失敗」的卡點 |
| 15 | 企業頻道：Slack 的三種傳輸模式 | 按部署形狀選傳輸；多 Gateway 共用一個 Slack app 的陷阱 |
| 16 | 其他頻道與 Reef | 讓不同人的 agent 直接對話的加密側頻道 |

**適合：** 想把 AI 接到特定聊天平台的人。

### 安全篇（#17-19）

| # | 標題 | 你會知道 |
|---|---|---|
| 17 | 沙箱機制：四種後端、三個開關 | `tools.exec.host` 預設 auto，「沒設＝在沙箱裡」已不成立 |
| 18 | 威脅模型：先講它不保護什麼 | 個人助理信任模型的邊界，與「依設計不算漏洞」清單 |
| 19 | 存取控制：SecretRef 的哨兵與邊界 | 它把明文從設定拿掉，但它不是程序隔離 |

**適合：** 在意安全的人。OpenClaw 讓 AI 執行系統指令，安全不是選配。

### 工具篇（#20-23）

| # | 標題 | 你會知道 |
|---|---|---|
| 20 | 瀏覽器與搜尋 | 三種瀏覽器 profile 的差異；搜尋結果在型別層被標成不可信 |
| 21 | Skills 與子 agent | 六層載入優先順序；子 agent 為什麼不給 message 工具 |
| 22 | Exec | 關掉檔案工具不會讓 exec 變成唯讀 |
| 23 | 大型工具目錄：Code Mode、Tool Search、MCP | 工具多到塞不進 prompt 時的兩種答案 |

**適合：** 想知道 AI agent 能做哪些事、又不想被 token 吃光的人。

### 自動化篇（#24-25）

| # | 標題 | 你會知道 |
|---|---|---|
| 24 | 六種自動化機制怎麼選 | Automations（精確）與 Heartbeat（有脈絡）的取捨、排程器的失敗語意 |
| 25 | Standing Orders | 授權書與時鐘的分工；bootstrap 只注入六個檔案 |

**適合：** 想讓 AI 定時做事、或自主執行例行工作的人。

### Gateway 篇（#26-27）

| # | 標題 | 你會知道 |
|---|---|---|
| 26 | 設定系統與嚴格驗證 | 不認識的鍵會讓 Gateway 拒絕啟動；防誤覆寫的三個形狀 |
| 27 | 綁定、認證與憑證優先權 | 非 loopback 強制認證；那份決定「它用了哪組憑證」的順序表 |

**適合：** 維運人員、想遠端存取的人。

### Plugin 篇（#28）

| # | 標題 | 你會知道 |
|---|---|---|
| 28 | Plugin 系統：安裝的安全與驗證 | 把安裝當成執行程式碼；`inspect --runtime` 才證明得了載入 |

**適合：** 想擴充 OpenClaw 功能的人。

### 介面篇（#29-30）

| # | 標題 | 你會知道 |
|---|---|---|
| 29 | Nodes 深入：遠端執行的核准綁定 | 核准綁的是計畫，不是之後可編輯的欄位 |
| 30 | UI：Control UI、TUI 與 Web Chat | session rail 讓你觀察執行中的 agent 而不打斷它 |

**適合：** 日常使用者、想從瀏覽器或手機操作的人。

### 營運與參考篇（#31-32）

| # | 標題 | 你會知道 |
|---|---|---|
| 31 | 維運篇：分診與排查 | 前 60 秒的七行指令；「感覺變笨」先查工具 profile |
| 32 | 參考篇：Agent runtime 架構 | Pi 已被吸收，內建 runtime 就叫 `openclaw` |

**適合：** 遇到問題的人、想理解內部架構的人。

## 你是哪種讀者？

**「我只想快速跑起來」** → #1 → #2 → #14（挑一個頻道）→ #6（選模型）。四篇搞定。

**「我想當日常使用者」** → 上面四篇 + #30（UI）+ #12（Session 與記憶）+ #24（自動化）。

**「我想深入理解架構」** → #9-12（Agent 核心）→ #32（runtime 架構）→ #17-19（安全）。

**「我想部署到正式環境」** → #3（雲端）→ #26-27（Gateway）→ #17-19（安全）→ #31（排查）。

**「我想開發 Plugin」** → #28（Plugin 系統）+ #21（Skills）+ #23（MCP 與 Code Mode）。

**「我在意安全」** → #18（威脅模型）→ #17（沙箱）→ #19（SecretRef）→ #13（頻道的兩個軸）。

**「我想接企業通訊」** → #13（頻道總覽）→ #15（Slack／Teams）→ #19（存取控制）→ #9（多 Agent）。

## 整體來說

OpenClaw 的文件量反映了它的野心：不只是「聊天機器人框架」，而是一套完整的 AI agent 營運系統。從模型供應商管理、沙箱安全、到 MITRE ATLAS 威脅分析都有。335 份文件看起來嚇人，但組織結構清楚——知道自己要什麼，就能快速找到對應的區塊。

這個系列會把每塊都拆開來講。接下來從安裝開始。

## 更新紀錄

- 2026-08-18（二次）：全系列 32 篇對照官方文件現況翻新完畢後，重建系列地圖——所有篇章標題與重點都已更換（例如 #32 從「Pi 整合架構」改為「Agent runtime 架構」，因為 Pi 已被吸收進核心），「你是哪種讀者」的推薦路線一併重排並新增「我在意安全」一條。
- 2026-08-18：修正系列文章地圖。原本規劃 36 篇，實際完成 32 篇（多 Gateway 與背景程序、Gateway API、打造自己的 Plugin、CLI 速查附錄未單獨成篇，其中多 Gateway 與 Plugin 開發併入既有篇章）。#26 之後的編號、各區塊標題與「你是哪種讀者」的推薦路線一併對齊實際篇章。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/index.md](https://github.com/openclaw/openclaw/blob/main/docs/index.md) — 首頁與專案總覽
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/main/docs/docs.json) — 文件站導覽結構（Mintlify 設定）
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/main/docs/start/getting-started.md) — 快速上手指南
- [docs/concepts/features.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/features.md) — 完整功能列表
- [docs/concepts/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/architecture.md) — 核心架構
- [README.md](https://github.com/openclaw/openclaw/blob/main/README.md) — 專案 README
