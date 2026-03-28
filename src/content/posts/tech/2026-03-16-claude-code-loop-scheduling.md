---
title: "Claude Code /loop：把 AI 變成背景 worker 的排程功能"
date: 2026-03-16
category: tech
tags: [claude-code, ai-tools, automation, scheduling]
lang: zh-TW
tldr: "/loop 是 Claude Code 的原生 cron 功能，自然語言設定排程，讓 Claude 在背景持續監控、自動修 PR、定期執行任務。"
description: "介紹 Claude Code 的 /loop 排程功能，包含語法、實際使用場景、限制，以及與 Desktop Scheduled Tasks 的差異。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 7
---

## TL;DR

`/loop` 讓你用自然語言設定 Claude Code 的定期任務——不用寫 cron expression，直接說「每 10 分鐘檢查部署狀態」就行。適合 session 內的監控和提醒，不適合跨 session 的長期排程。

---

`/loop` 在 2026 年 3 月 7 日的更新中正式推出，讓 Claude Code 從被動回應工具變成可以在背景主動執行任務的 worker。

本質上就是 session 層級的 cron job：你定義好排程和 prompt，Claude Code 在閒置時自動執行。每個 session 最多支援 50 個並行排程任務。

## 語法

三種寫法都接受：

```bash
# 前綴間隔
/loop 5m check the build

# 後綴 every
/loop check the build every 2 hours

# 不指定間隔（預設 10 分鐘）
/loop babysit all my PRs
```

時間單位：`s`（秒，進位到分鐘）、`m`（分鐘）、`h`（小時）、`d`（天）。

也支援一次性提醒：

```bash
remind me at 3pm to push the release branch
in 45 minutes, check whether the tests passed
```

## 實際使用場景

### 部署監控

```bash
/loop 10m check deployment status and alert on errors
```

Claude 每 10 分鐘去查部署狀態，有問題就提醒你。不用開著一堆監控視窗盯著看。

### PR 自動維護

```bash
/loop babysit all my PRs. When builds fail auto-fix
```

PR 的 CI 掛了，Claude 自動去修。適合跑著等 review 的期間。

### 每兩小時檢查特定 PR

```bash
/loop 2h /review-pr 1234
```

搭配自訂 slash command 用，讓 Claude 定期重跑你定義好的任務。

### 早上 Slack 摘要

```bash
/loop every morning at 9:05 use Slack MCP to summarize mentions
```

每天早上自動整理昨晚的 Slack 訊息，配合 MCP server 使用。

### 主分支 CI 監控

```bash
/loop 15m check main branch CI, notify if red
```

main 掛了立刻知道，不用定時手動去看。

### 事件處理視窗

比較進階的用法：用排程任務觸發一段時間的集中處理，例如每天早上跑 30 分鐘處理昨晚累積的 log：

```bash
/loop every morning at 9:00 process overnight error logs for 30 minutes then stop
```

## 管理排程任務

```bash
# 查看目前排程
what scheduled tasks do I have?

# 取消（用名稱或 ID）
cancel the deploy check job
cancel task abc12345
```

## 限制

這幾點很重要，用之前要清楚：

- **Session 範圍**：關掉 terminal 就消失，不存磁碟
- **3 天到期**：72 小時後自動刪除，刪除前執行最後一次
- **不補跑**：錯過的任務直接略過，等下次排程
- **執行時機**：Claude 閒置時才跑，不打斷進行中的對話

## 什麼時候不該用 /loop

`/loop` 不適合當真正的 overnight cron daemon 用。如果你需要：

- **跨 session 的持久排程**：用 Desktop Scheduled Tasks
- **team 共用的自動化**：用 GitHub Actions
- **不依賴開著的 terminal**：以上兩者

Anthropic 的設計定位很明確：`/loop` 是 in-session 的隨行助理，Desktop Scheduled Tasks 才是長期自動化的選項。

## `/loop` vs Ralph Loop

Ralph Loop 是社群的做法，用 shell 腳本持續對 prompt 執行 Claude，直到任務完成或達到限制：

|  | `/loop`（原生） | Ralph Loop（社群） |
|--|--|--|
| 設定方式 | 自然語言 | shell 腳本 |
| 觸發條件 | 時間排程 | 任務完成條件 |
| 持久性 | session 限定，最多 3 天 | 腳本控制 |
| 適合場景 | 監控、提醒、定期檢查 | 跑到任務完成為止 |

Ralph Loop 適合「跑到成功為止」的工作，例如反覆修 bug 直到測試全過。`/loop` 適合「定期檢查」的工作，例如每 15 分鐘看一次 CI 狀態。

兩者邏輯不同，不是誰取代誰，依情境選用。

---

## 參考資料

- [Run prompts on a schedule - Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks)
- [Claude Code Gets Cron Scheduling to Run as a Background Worker - Winbuzzer](https://winbuzzer.com/2026/03/09/anthropic-claude-code-cron-scheduling-background-worker-loop-xcxwbn/)
- [Claude Code Loop vs Scheduled Tasks | MindStudio](https://www.mindstudio.ai/blog/claude-code-loop-vs-scheduled-tasks)
- [Put Claude on Autopilot: Scheduled Tasks | Medium](https://medium.com/@richardhightower/put-claude-on-autopilot-scheduled-tasks-with-loop-and-schedule-built-in-skills-43f3be5ac1ec)
- [Claude Code Loop vs Scheduled Tasks: Key Limits - Geeky Gadgets](https://www.geeky-gadgets.com/claude-code-loop-cron-session-scheduling/)
