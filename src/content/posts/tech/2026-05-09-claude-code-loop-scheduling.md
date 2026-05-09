---
title: "Claude Code /loop：把 AI 變成背景 worker 的排程功能（v2.1.72+ 新版）"
date: 2026-05-09
type: guide
category: tech
tags: [claude-code, ai-tools, automation, scheduling]
lang: zh-TW
tldr: "/loop 是 Claude Code 的原生 cron 功能，自然語言設定排程，讓 Claude 在背景持續監控、自動修 PR、定期執行任務。Session 範圍、7 天到期，跨 session 用 Routines 或 Desktop 任務。"
description: "介紹 Claude Code 的 /loop 排程功能，包含動態間隔、loop.md 自訂預設 prompt、cron 表達式、以及與 Routines、Desktop scheduled tasks 的差異。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 7
---

## TL;DR

`/loop` 讓你用自然語言設定 Claude Code 的定期任務——不用寫 cron expression，直接說「每 10 分鐘檢查部署狀態」就行。也可以只給 prompt 不給間隔，讓 Claude 自己根據觀察到的狀況動態決定下一次什麼時候跑。Session 範圍、最長 7 天，適合 session 內的監控和提醒；不適合跨 session 的長期排程。

> 需要 Claude Code v2.1.72 或更新版本。用 `claude --version` 確認。

---

`/loop` 在 2026 年 3 月 7 日的更新中正式推出，讓 Claude Code 從被動回應工具變成可以在背景主動執行任務的 worker。

本質上就是 session 層級的 cron job：你定義好排程和 prompt，Claude Code 在閒置時自動執行。每個 session 最多支援 50 個並行排程任務。

## 三種使用模式

`/loop` 接受 interval 和 prompt 兩個參數，組合決定行為：

| 你給的 | 範例 | 行為 |
|--|--|--|
| 間隔 + prompt | `/loop 5m check the deploy` | 固定 cron 排程跑你的 prompt |
| 只有 prompt | `/loop check the deploy` | Claude 每次根據觀察結果動態決定下次間隔 |
| 只有間隔，或什麼都沒給 | `/loop` | 跑內建 maintenance prompt（或你的 `loop.md`） |

### 1. 固定間隔

最直觀的用法。Claude 把你的描述轉成 cron 表達式，排好後跟你確認：

```bash
/loop 5m check if the deployment finished and tell me what happened
```

時間單位：`s`（秒，進位到分鐘）、`m`（分鐘）、`h`（小時）、`d`（天）。間隔可以放前面（`5m`）也可以放後面（`every 2 hours`）。

不對齊 cron 的時間（例如 `7m`、`90m`）會自動四捨五入到最接近的 cron step，Claude 會告訴你它選了什麼。

### 2. 動態間隔（讓 Claude 自己決定）

省略間隔，只給 prompt：

```bash
/loop check whether CI passed and address any review comments
```

Claude 每跑完一次就根據看到的狀況挑下一次間隔（1 分鐘到 1 小時之間）。build 還在跑、PR 還在動就密集點；都靜下來就拉長。每次結束會印出選擇的間隔和理由。

值得注意的是，動態 `/loop` 可能會直接改用 [Monitor 工具](https://code.claude.com/docs/en/tools-reference#monitor-tool) 監聽背景腳本輸出，避免不必要的輪詢，比定期 re-run prompt 更省 token、回應更快。

> 在 Bedrock、Vertex AI、Microsoft Foundry 上，沒給間隔會 fallback 到固定 10 分鐘。

### 3. 內建 maintenance prompt

什麼都不給：

```bash
/loop
```

Claude 跑內建的維護 prompt，依序處理：

- 繼續對話中還沒完成的工作
- 維護當前 branch 的 PR：review comments、CI 失敗、merge 衝突
- 沒事做的時候做清理工作（bug hunt、簡化）

預設用動態間隔。加上時間（如 `/loop 15m`）就改成固定排程。

#### 用 `loop.md` 自訂預設 prompt

想替換內建 maintenance prompt，建立 `loop.md`：

| 路徑 | 範圍 |
|--|--|
| `.claude/loop.md` | 專案級，優先生效 |
| `~/.claude/loop.md` | 使用者級，所有沒設專案版的專案都用這個 |

純 Markdown，沒固定結構。例如維持 release branch 健康：

```markdown
Check the `release/next` PR. If CI is red, pull the failing job log,
diagnose, and push a minimal fix. If new review comments have arrived,
address each one and resolve the thread. If everything is green and
quiet, say so in one line.
```

修改 `loop.md` 下次 iteration 立即生效，可以邊跑邊調。檔案超過 25,000 bytes 會被截斷。

## 一次性提醒

不用 `/loop`，直接用自然語言講：

```bash
remind me at 3pm to push the release branch
in 45 minutes, check whether the integration tests passed
```

Claude 會排成單次觸發任務，跑完自動刪除。

## 實際使用場景

### 部署監控

```bash
/loop 10m check deployment status and alert on errors
```

### PR 自動維護

```bash
/loop babysit all my PRs. When builds fail auto-fix
```

### 每兩小時跑自訂 slash command

```bash
/loop 2h /review-pr 1234
```

### 早上 Slack 摘要

```bash
/loop every morning at 9:05 use Slack MCP to summarize mentions
```

### 主分支 CI 監控

```bash
/loop 15m check main branch CI, notify if red
```

### 事件處理視窗

```bash
/loop every morning at 9:00 process overnight error logs for 30 minutes then stop
```

## 管理排程任務

直接跟 Claude 講就好：

```bash
what scheduled tasks do I have?
cancel the deploy check job
cancel task abc12345
```

底層用三個工具，知道一下就好：

| 工具 | 作用 |
|--|--|
| `CronCreate` | 建立任務（cron 表達式 + prompt + 是否重複） |
| `CronList` | 列出所有任務和它們的 ID、排程、prompt |
| `CronDelete` | 用 8 字元 task ID 取消任務 |

### 停止 `/loop`

`/loop` 在等下次 iteration 時，按 **Esc** 就能停。這只清掉 pending wakeup，不影響你直接請 Claude 排的其他任務（那些要用 `cancel` 才會消失）。

## 排程怎麼運作

- 排程器每秒檢查一次，到時間的任務排進 low priority queue
- **在輪次之間觸發**，不打斷 Claude 進行中的回應；忙的話就等這輪完
- 時間用本機時區。`0 9 * * *` 是當地 9 點，不是 UTC

### Jitter（時間抖動）

避免所有 session 同時打 API：

- 重複任務最多延後 30 分鐘觸發（高頻任務最多延後一半間隔）
- 整點/半點的單次任務最多提早 90 秒

抖動量由 task ID 推導，固定不變。要避免抖動，把分鐘設成非 `:00`/`:30`，例如 `3 9 * * *` 就不會被抖。

### 7 天到期

重複任務建立後 **7 天自動過期**，到期前最後跑一次再刪。需要更久的長期排程，到期前重建一次，或直接用 [Routines](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide) / Desktop scheduled tasks。

### Resume 還原

`claude --resume` 或 `claude --continue` 會把未到期的任務還原回來：7 天內的重複任務，或排定時間還沒過的單次任務。背景 Bash 和 monitor 任務不會還原。

## 限制

- **Session 範圍**：關掉 terminal 就停；只有 resume 還原才會回來
- **不打斷對話**：Claude 忙的時候到期任務排隊等
- **不補跑**：閒置時錯過的觸發只會跑一次，不會把錯過的次數補滿
- **新 session 清空**：開新對話舊任務全消失

## Cron 表達式參考

`CronCreate` 接受標準 5 欄位：`minute hour day-of-month month day-of-week`。支援 `*`、單值、`*/n` 步進、`1-5` 範圍、`1,15,30` 列表。

| 範例 | 意思 |
|--|--|
| `*/5 * * * *` | 每 5 分鐘 |
| `0 * * * *` | 每整點 |
| `0 9 * * *` | 每天當地 9 點 |
| `0 9 * * 1-5` | 平日 9 點 |
| `30 14 15 3 *` | 3/15 下午 2:30 |

不支援 `L`、`W`、`?`、`MON`/`JAN` 別名。day-of-month 和 day-of-week 同時設限時，符合任一條件即觸發（標準 vixie-cron 行為）。

## 關閉排程功能

設環境變數 `CLAUDE_CODE_DISABLE_CRON=1`，排程器整個關掉，`/loop` 也不能用。

## 什麼時候不該用 /loop

`/loop` 不適合當真正的 overnight cron daemon。需要這些情境換工具：

- **跨 session 的雲端排程**：用 [Routines](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide)（電腦關著也跑、支援 API/GitHub trigger）
- **本地長期排程**：用 Desktop scheduled tasks（要電腦開著但不用 session）
- **CI 整合**：用 GitHub Actions

Anthropic 的設計定位很明確：`/loop` 是 in-session 的隨行助理，跨 session 的長期自動化要走 Routines 或 Desktop。

## `/loop` vs Ralph Loop

Ralph Loop 是社群的做法，用 shell 腳本持續對 prompt 執行 Claude，直到任務完成或達到限制：

|  | `/loop`（原生） | Ralph Loop（社群） |
|--|--|--|
| 設定方式 | 自然語言 | shell 腳本 |
| 觸發條件 | 時間排程或動態間隔 | 任務完成條件 |
| 持久性 | session 限定，最多 7 天 | 腳本控制 |
| 適合場景 | 監控、提醒、定期檢查 | 跑到任務完成為止 |

Ralph Loop 適合「跑到成功為止」的工作，例如反覆修 bug 直到測試全過。`/loop` 適合「定期檢查」或「動態 polling」的工作，例如盯 CI 狀態、PR review。

兩者邏輯不同，不是誰取代誰，依情境選用。

---

## 參考資料

- [Run prompts on a schedule - Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks)
- [Routines（雲端排程）](https://code.claude.com/docs/en/routines)
- [Desktop Scheduled Tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks)
- [Channels：事件推送替代輪詢](https://code.claude.com/docs/en/channels)
- [Monitor 工具：背景腳本串流輸出](https://code.claude.com/docs/en/tools-reference#monitor-tool)
