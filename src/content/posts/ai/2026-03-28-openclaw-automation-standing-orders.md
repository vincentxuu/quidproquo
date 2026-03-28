---
title: "OpenClaw 自動化（二）：Standing Orders 永久指令"
date: 2026-03-28
category: ai
tags: [openclaw, standing-orders, automation, agents-md, autonomous]
lang: zh-TW
tldr: "Standing Orders 給 agent 永久授權執行定義好的程式——有明確的範圍、觸發條件、approval gate 和升級規則，搭配 Cron 做時間控制。"
description: "OpenClaw 的 Standing Orders 機制：給 agent 永久執行權限的結構化指令，搭配 Cron 和 Heartbeat 實現自主營運。"
draft: false
---

Standing Orders 是 OpenClaw 最接近「讓 agent 自主運作」的功能。不是每次都下指令，而是定義好程式，agent 在授權範圍內自動執行。

## 為什麼需要 Standing Orders

**沒有 Standing Orders：**
- 每個任務都要你手動下指令
- Agent 在 request 之間閒置
- 例行工作被忘記或延遲
- 你變成瓶頸

**有了 Standing Orders：**
- Agent 在定義的邊界內自主執行
- 例行工作按時發生
- 你只在例外情況介入
- Agent 善用閒置時間

## 如何運作

Standing Orders 定義在 agent workspace 檔案裡。推薦直接寫在 `AGENTS.md`（每次 session 自動注入），確保 agent 永遠有指令在 context 裡。

每個程式（Program）指定：
1. **Scope** — agent 被授權做什麼
2. **Triggers** — 什麼時候執行（排程、事件、條件）
3. **Approval Gates** — 什麼需要人類簽核
4. **Escalation Rules** — 什麼時候停下來求助

### 搭配 Cron

Standing Orders 定義「做什麼」，Cron 定義「什麼時候」：

```
Standing Order: "你負責每日收件匣整理"
    ↓
Cron Job (每天 8:00): "執行收件匣整理，依照 standing orders"
    ↓
Agent: 讀 standing orders → 執行步驟 → 回報結果
```

Cron job 的 prompt 應該引用 standing order，不是重複它：

```bash
openclaw cron add \
  --name daily-inbox-triage \
  --cron "0 8 * * 1-5" \
  --tz America/Taipei \
  --timeout-seconds 300 \
  --announce \
  --message "Execute daily inbox triage per standing orders."
```

## Standing Order 結構

```markdown
## Program: Weekly Status Report

**Authority:** 編譯資料、產生報告、遞交給利害關係人
**Trigger:** 每週五下午 4 點（透過 cron job）
**Approval gate:** 標準報告不需審核。異常數據標記給人類審查。
**Escalation:** 資料來源不可用，或指標異常（超過 2σ）

### Execution Steps

1. 從設定的來源拉取指標
2. 與前週和目標比較
3. 產生報告到 Reports/weekly/YYYY-MM-DD.md
4. 透過設定的頻道遞送摘要
5. 記錄完成到 Agent/Logs/

### What NOT to Do

- 不要把報告送給外部人員
- 不要修改來源資料
- 不要因為指標不好就跳過報告——如實報告
```

## Execute-Verify-Report 模式

Standing Orders 的每個任務都應該遵循：

1. **Execute** — 做實際的工作（不只是「我會去做」）
2. **Verify** — 確認結果正確（檔案存在、訊息已送達）
3. **Report** — 回報做了什麼、驗證了什麼

```markdown
### Execution Rules

- 每個任務都走 Execute-Verify-Report，沒有例外
- "I'll do that" 不是 execution，做完再報
- "Done" 但沒驗證不算完成，要證明
- 執行失敗：調整方法重試一次
- 仍然失敗：回報失敗和診斷，永遠不靜默失敗
- 最多重試 3 次，然後升級
```

## 實際範例

### 範例一：內容與社群（週期性）

```markdown
## Program: Content & Social Media

**Authority:** 起草內容、排程貼文、編譯互動報告
**Approval gate:** 前 30 天所有貼文需 owner 審查，之後 standing approval
**Trigger:** 週循環（週一審查 → 週中起草 → 週五簡報）

### Content Rules
- 語調必須符合品牌（參考 SOUL.md）
- 公開內容不要自我標示為 AI
- 有數據就附上
- 焦點放在受眾價值
```

### 範例二：財務處理（事件驅動）

```markdown
## Program: Financial Processing

**Authority:** 處理交易資料、產生報告、送摘要
**Approval gate:** 分析不需審核。建議需要 owner 核准。
**Trigger:** 偵測到新資料檔或月度排程

### Escalation Rules
- 單筆 > $500：立即警報
- 類別超出預算 20%：在報告中標記
- 無法辨識的交易：問 owner 分類
- 2 次重試後仍失敗：回報失敗，不猜測
```

### 範例三：系統監控（持續性）

```markdown
## Program: System Monitoring

**Authority:** 檢查系統健康、重啟服務、發送警報
**Approval gate:** 自動重啟服務。重啟失敗兩次才升級。
**Trigger:** 每次 heartbeat

### Response Matrix
| 狀況 | 動作 | 升級？ |
|---|---|---|
| 服務掛了 | 自動重啟 | 重啟失敗 2 次才升級 |
| 磁碟 < 10% | 通知 owner | 是 |
| 任務過期 > 24h | 提醒 owner | 否 |
| 頻道離線 | 記錄並下次重試 | 離線 > 2 小時 |
```

## 多程式架構

管理多個領域時，分開成獨立程式：

```markdown
# Standing Orders

## Program 1: [Domain A] (Weekly)
...

## Program 2: [Domain B] (Monthly + On-Demand)
...

## Program 3: [Domain C] (As-Needed)
...

## Escalation Rules (All Programs)
- [跨程式通用的升級條件]
- [共用的 approval gates]
```

每個程式有自己的觸發節奏、approval gates、明確邊界。

## 最佳實踐

### 要

- 從窄授權開始，建立信任後再擴展
- 定義明確的 approval gates（高風險動作）
- 加入「What NOT to do」段落——邊界跟權限一樣重要
- 搭配 cron jobs 確保時間執行
- 每週審查 agent 日誌
- Standing orders 是活文件，隨需求演進

### 不要

- 第一天就給廣泛授權
- 跳過升級規則——每個程式都需要「何時停下求助」
- 假設 agent 會記住口頭指令——全部寫入檔案
- 在一個程式裡混合不同領域
- 忘記用 cron 強制執行——沒有觸發器的 standing orders 只是建議

## 整體來說

Standing Orders 是 OpenClaw 從「聊天機器人」變成「自主助理」的關鍵。定義好授權範圍、觸發條件、和升級規則，agent 就能在安全邊界內自主運作。搭配 Cron 做時間控制、Heartbeat 做定期巡檢，形成完整的自動化系統。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/automation/standing-orders.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/standing-orders.md) — Standing Orders
- [docs/automation/cron-jobs.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-jobs.md) — Cron Jobs
- [docs/automation/cron-vs-heartbeat.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-vs-heartbeat.md) — Cron vs Heartbeat
- [docs/concepts/agent-workspace.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-workspace.md) — Agent Workspace
- [docs/reference/AGENTS.default.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/AGENTS.default.md) — AGENTS.md 預設內容
