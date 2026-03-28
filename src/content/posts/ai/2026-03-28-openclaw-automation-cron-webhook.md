---
title: "OpenClaw 自動化（一）：Cron、Heartbeat 與 Webhook"
date: 2026-03-28
category: ai
tags: [openclaw, cron, heartbeat, webhook, automation, scheduling]
lang: zh-TW
tldr: "Heartbeat 定期巡檢（30 分鐘批次），Cron 精確排程（支援隔離 session 和模型覆寫），Webhook 接收外部事件觸發 agent。"
description: "OpenClaw 的三種自動化機制：Heartbeat 定期巡檢、Cron 精確排程、Webhook 外部事件觸發。"
draft: false
---

OpenClaw 不只是被動回覆——它可以自己定時做事、接收外部事件、甚至主動監控。這篇講三種自動化機制。

## Heartbeat：定期巡檢

Heartbeat 在**主 session** 裡定期跑一次（預設 30 分鐘），讓 agent 檢查狀況、處理例行事務。

### 適用場景

- 多項定期檢查（收件匣、行事曆、通知）可以批次處理
- 需要對話 context（agent 知道你最近在做什麼）
- 不需要精確時間
- 想減少 API 呼叫（一次 heartbeat 取代 5 個獨立 cron）

### 設定

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
        activeHours: { start: "08:00", end: "22:00" },
      }
    }
  }
}
```

### HEARTBEAT.md

Agent 每次 heartbeat 會讀這個檔案：

```markdown
# Heartbeat checklist

- 掃描收件匣是否有緊急郵件
- 檢查未來 2 小時的行事曆
- 確認待辦任務沒有過期
- 如果安靜超過 8 小時，發個簡短 check-in
```

沒事要報告時，agent 回覆 `HEARTBEAT_OK`，不發送訊息。

## Cron：精確排程

Cron 在精確時間運行，可以用隔離 session、不同模型。

### 基本用法

```bash
# 每天早上 7 點的簡報
openclaw cron add \
  --name "Morning briefing" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate today's briefing" \
  --model opus \
  --announce \
  --channel whatsapp \
  --to "+15551234567"

# 20 分鐘後的提醒（一次性）
openclaw cron add \
  --name "Meeting reminder" \
  --at "20m" \
  --session main \
  --system-event "Standup meeting in 10 minutes" \
  --wake now \
  --delete-after-run
```

### 支援格式

- 5-field cron expression（分/時/日/月/週）
- 6-field（含秒）
- `--at` 一次性排程
- `--every` 間隔排程
- `--tz` 時區支援

### 負載分散

週期性的整點排程會自動加上 0-5 分鐘的隨機偏移，避免所有 job 同時觸發。用 `--stagger <duration>` 自訂或 `--exact` 強制精確時間。

### Main vs Isolated Session

| | Heartbeat | Cron (main) | Cron (isolated) |
|---|---|---|---|
| Session | Main | Main（透過 system event） | `cron:<jobId>` |
| 歷史 | 共享 | 共享 | 每次重新開始 |
| Context | 完整 | 完整 | 無 |
| 模型 | Main session | Main session | 可覆寫 |
| 輸出 | 有事才送 | Heartbeat 處理 | Announce 摘要 |

### 成本考量

| 機制 | 成本 |
|---|---|
| Heartbeat | 每 N 分鐘一次 turn，跟 HEARTBEAT.md 大小成正比 |
| Cron (main) | 加 event 到下次 heartbeat，不產生獨立 turn |
| Cron (isolated) | 每個 job 一次完整 agent turn，可用較便宜模型 |

## Heartbeat vs Cron 選擇指南

| 場景 | 推薦 | 原因 |
|---|---|---|
| 每 30 分鐘檢查收件匣 | Heartbeat | 跟其他檢查批次處理 |
| 每天 9:00 發日報 | Cron (isolated) | 需要精確時間 |
| 監控行事曆 | Heartbeat | 定期巡檢的天然場景 |
| 每週深度分析 | Cron (isolated) | 獨立任務，可用更強模型 |
| 20 分鐘後提醒 | Cron (`--at`) | 一次性精確時間 |

**最佳做法：** 兩者搭配——Heartbeat 處理例行巡檢，Cron 處理精確排程和重度任務。

## Webhook：外部事件觸發

讓外部系統透過 HTTP 觸發 agent 行為。

### 設定

```json5
{
  hooks: {
    enabled: true,
    token: "your-secret-token",
    path: "/hooks",
    allowedAgentIds: ["assistant"]
  }
}
```

### 三種端點

**Wake（`POST /hooks/wake`）：** 發送 system event 到主 session。

```json
{
  "description": "New urgent email from client",
  "timing": "now"
}
```

`timing` 可以是 `now`（立即）或 `next-heartbeat`（等下次 heartbeat）。

**Agent（`POST /hooks/agent`）：** 跑隔離的 agent turn。

```json
{
  "message": "Analyze this new data",
  "agent": "analyst",
  "session": "isolated",
  "model": "opus",
  "thinking": "high",
  "channel": "whatsapp",
  "to": "+15551234567"
}
```

**Mapped（`POST /hooks/<name>`）：** 自訂 handler，可以做 payload 轉換。適合整合 Gmail Pub/Sub 等外部服務。

### 安全

- Token 用 Bearer authorization header，**不要**放 query string
- 端點放在網路邊界後面
- 用獨立的 token
- 限制 agent routing（`allowedAgentIds`）
- 外部 payload 視為不信任
- 自訂 transform 必須在指定目錄內

## 其他自動化

### Gmail Pub/Sub

透過 Google Cloud Pub/Sub 整合 Gmail，新郵件時觸發 agent。設定在 `docs/automation/gmail-pubsub.md`。

### Hooks

Shell hooks 在特定事件時執行。設定在 `docs/automation/hooks.md`。

### Polls

Agent 可以在 Telegram、WhatsApp、Discord、Teams 發起投票：

```bash
openclaw message poll --channel telegram --target 123456789 \
  --poll-question "Ship it?" --poll-option "Yes" --poll-option "No"
```

### Auth Monitoring

可選的 ops script 監控認證狀態（systemd/Termux）。設定在 `docs/automation/auth-monitoring.md`。

## 整體來說

OpenClaw 的自動化分三層：

1. **Heartbeat** — 定期批次巡檢，context-aware，低成本
2. **Cron** — 精確排程，支援隔離 session 和模型覆寫
3. **Webhook** — 外部事件驅動，支援 wake、agent、mapped 三種端點

三者可以自由組合。最高效的設定是 Heartbeat 處理例行監控 + Cron 處理精確排程 + Webhook 處理外部事件。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/automation/cron-jobs.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-jobs.md) — Cron Jobs
- [docs/automation/cron-vs-heartbeat.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-vs-heartbeat.md) — Cron vs Heartbeat
- [docs/automation/webhook.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/webhook.md) — Webhook
- [docs/automation/gmail-pubsub.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/gmail-pubsub.md) — Gmail Pub/Sub
- [docs/automation/hooks.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/hooks.md) — Hooks
- [docs/automation/poll.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/poll.md) — Polls
- [docs/automation/auth-monitoring.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/auth-monitoring.md) — Auth Monitoring
- [docs/automation/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/troubleshooting.md) — 自動化疑難排解
