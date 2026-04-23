---
title: "OpenClaw 多 Agent 與 Delegate 架構"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, multi-agent, delegate, session-management, routing]
lang: zh-TW
tldr: "OpenClaw 支援在一個 Gateway 內跑多個隔離 agent，透過 binding 路由訊息，還能用 Delegate 架構讓 AI 以代理人身份行動。"
description: "OpenClaw 的多 Agent 路由、Session 隔離策略、Delegate 代理人模式與 Agent Loop 執行機制。"
draft: false
---

OpenClaw 不只能跑一個 AI agent。它支援在同一個 Gateway 內運行多個完全隔離的 agent，各自有獨立的 workspace、認證、session。再加上 Delegate 架構，agent 還能以代理人身份替你行動。這篇整理多 Agent 路由、Session 隔離、Delegate 模式和 Agent Loop 的運作方式。

## 多 Agent 架構

### 一個 Agent 包含什麼

每個 agent 是一個完全獨立的實體：

| 組成 | 說明 |
|---|---|
| AgentId | 唯一識別，如 `work`、`personal` |
| Workspace | 獨立工作目錄，含 `AGENTS.md`、`SOUL.md`、`USER.md` |
| State Dir | `~/.openclaw/agents/<agentId>/` |
| Auth Profiles | 獨立的 API Key / OAuth，不自動共享 |
| Sessions | `~/.openclaw/agents/<agentId>/sessions/` |
| Skills | workspace 下的 `skills/`，可共用 `~/.openclaw/skills` |

### 建立與管理

```bash
# 新增一個叫 "work" 的 agent
openclaw agents add work

# 查看所有 agent 和綁定關係
openclaw agents list --bindings
```

### Binding 路由

Binding 決定「哪些訊息送到哪個 agent」。三個關鍵概念：

- **AgentId** — 一個隔離的「大腦」
- **AccountId** — 一個頻道帳號實體（例如一個 WhatsApp 號碼）
- **Binding** — 基於 channel、accountId、peer 的路由規則

路由採最具體優先（most-specific-first）：

```
1. Peer match（精確 DM / 群組）
2. Parent peer（thread 繼承）
3. Guild + roles（Discord）
4. Guild（Discord）
5. Team（Slack）
6. Account ID
7. Channel 層級
8. Default agent（兜底）
```

多個條件是 AND 邏輯——全部符合才 match。

### 實際應用

**依頻道分流：** WhatsApp 用快速便宜模型處理日常，Telegram 用 Claude Opus 做深度工作。

**依對象分流：** 大部分 WhatsApp 走標準 agent，特定聯絡人路由到更強的模型。

**多帳號隔離：** WhatsApp 帳號 A 綁 agent-personal，帳號 B 綁 agent-work，Discord 綁 agent-community。

## Session 管理

### DM Scope

`session.dmScope` 控制直接訊息的隔離層級：

| 模式 | 行為 | 適用場景 |
|---|---|---|
| `main`（預設）| 所有 DM 共享一個 session | 個人使用，跨裝置連續 |
| `per-peer` | 按發送者隔離 | 多人存取同一 agent |
| `per-channel-peer` | 按頻道 + 發送者隔離 | 多用戶收件箱 |
| `per-account-channel-peer` | 按帳號 + 頻道 + 發送者 | 多帳號設定 |

安全警告：如果你的 agent 會收到多人的 DM，**強烈建議**不要用預設的 `main`。否則所有人共享對話上下文，會洩漏私人資訊。

### Identity Links

用 `session.identityLinks` 把不同平台的同一個人對應到同一個身份，讓他們跨頻道共享 DM session。

### Session 生命週期

- **每日重置** — 預設凌晨 4:00
- **閒置重置** — 可選的滑動視窗，跟每日重置取先到期者
- **手動觸發** — `/new` 和 `/reset`
- **Cron job** — 每次執行都產生新 session

維護設定預設：30 天後清除、最多 500 筆、10MB 旋轉門檻。正式環境建議用 `mode: "enforce"` 自動清理。

## Delegate 架構

Delegate 是多 Agent 的進階應用：agent 以**自己的身份**代替人類行動，像一個有獨立帳號的 AI 秘書。

### 三個能力層級

**Tier 1：Read-Only + Draft** — 只讀資料、草擬訊息。需人工審核才發送。只需 read 權限。

**Tier 2：Send on Behalf** — 以 delegate 身份發送。收件者看到「Delegate 代表 Principal」。可以建立行事曆事件。

**Tier 3：Proactive** — 自主排程執行，結合 cron job。無需逐次核准，按 `AGENTS.md` 中的 standing orders 行動。

### 安全前提

在給 Delegate 權限之前，必須先設定：

- **Hard blocks** — 不可協商的限制（例如：不可在未核准下發外部信件）
- **Tool 限制** — Gateway 層級的 allow/deny list
- **Sandbox 隔離** — 限制檔案系統和網路存取
- **Audit log** — 完整的操作記錄

### 建立方式

```bash
openclaw agents add delegate
# 設定 identity provider delegation（Microsoft 365 / Google Workspace）
# 透過 binding 綁定到特定頻道
```

支援多個 delegate 在同一個 Gateway 上運行，各自有獨立的 workspace 和認證。

## Agent Loop

每個 agent 的一次完整執行：

```
收到訊息 → Context 組裝 → 模型推理 → Tool 執行 → 串流回覆 → 持久化
```

### 並行控制

每個 session 內的執行是**串行的**（session lane），避免 race condition。可選的 global lane 做全域串行。訊息通道有三種佇列策略：

- **collect** — 收集訊息
- **steer** — 導向執行中的 agent
- **followup** — 追加到當前執行

### Hook 系統

| 類型 | 可用 Hook |
|---|---|
| Gateway hooks | `agent:bootstrap`、`/new`、`/reset` 等生命週期事件 |
| Plugin hooks | `before_model_resolve`、`before_prompt_build`、`before_tool_call` |

### 超時行為

`agent.wait` 預設 30 秒。agent runtime 本身有 48 小時的 abort timer。

## Agent 間通訊

預設**關閉**。必須明確啟用並設定 allowlist 才能開啟 agent-to-agent messaging。這是刻意的安全設計——避免 agent 之間未經授權的互動。

## 整體來說

OpenClaw 的多 Agent 架構核心取捨是**隔離優先**。每個 agent 都是完全獨立的實體，不共享認證、不共享 session、不能互相通訊（除非明確開放）。這對安全性很好，但也意味著跨 agent 協作需要額外設定。適合需要在同一台機器上運行多個用途明確、互不干擾的 AI 助手的場景。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/concepts/multi-agent.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/multi-agent.md) — 多 Agent 路由
- [docs/concepts/delegate-architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/delegate-architecture.md) — Delegate 代理人架構
- [docs/concepts/agent-loop.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-loop.md) — Agent Loop 執行迴圈
- [docs/concepts/agent.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent.md) — Agent Runtime 總覽
- [docs/concepts/agent-workspace.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-workspace.md) — Agent Workspace
- [docs/concepts/session.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session.md) — Session 管理
- [docs/concepts/model-failover.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-failover.md) — 模型容錯與 Auth 輪替
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration.md) — Gateway 設定（多 Agent 相關）
