---
title: "Claude Code Scheduled Tasks：讓 AI 在雲端自動幫你做事"
date: 2026-03-27
category: tech
tags: [claude-code, scheduled-tasks, remote-agent, automation, cron, dx]
lang: zh-TW
tldr: "Scheduled Task 是 Claude Code 的雲端排程系統。設定 cron、指定 repo、寫好 prompt，AI 就會定時自動執行——掃 issue、審 PR、跑檢查、開 PR，電腦關了也會跑。"
description: "完整介紹 Claude Code 的三種排程方式（Cloud、Desktop、/loop），以及如何用 Cloud Scheduled Tasks 建立自動化開發代理，包含實際案例 daodao-auto-dev 的設計。"
draft: false
---

你寫了一個 prompt 告訴 Claude「掃描這四個 repo 的 GitHub issues，有標 `auto` 的就實作，完成後開 PR」。然後設定每 2 小時跑一次。

接下來你去睡覺。半夜 2 點、4 點、6 點，Claude 自己 clone repo、讀 issue、寫 code、跑測試、開 PR。你早上起來，收件匣裡躺著三個等你 review 的 PR。

這就是 Claude Code Scheduled Tasks 做的事。

## 三種排程方式

Claude Code 提供三種排程機制，適合不同場景：

| | Cloud | Desktop | `/loop` |
|---|---|---|---|
| 跑在哪 | Anthropic 雲端 | 你的電腦 | 你的電腦 |
| 電腦要開著嗎 | 不用 | 要 | 要 |
| 需要開著 session 嗎 | 不用 | 不用 | 要 |
| 重啟後還在嗎 | 在 | 在 | 不在 |
| 能讀本地檔案嗎 | 不能（每次 fresh clone） | 能 | 能 |
| MCP 支援 | Connectors | config files + connectors | 繼承 session |
| 最短間隔 | 1 小時 | 1 分鐘 | 1 分鐘 |

**Cloud**：不需要你的電腦在線，適合跨時區團隊和長期自動化。每次 run 都是 fresh clone，獨立乾淨。

**Desktop**：需要電腦在線但不需要開 session，能讀寫本地檔案。適合需要本地環境的任務。

**/loop**：最輕量，session 內的快速排程。適合「部署完通知我」這種短期監控。session 結束就消失。

這篇專注介紹 Cloud Scheduled Tasks。`/loop` 的介紹見 [/loop 排程功能](/posts/tech/2026-03-16-claude-code-loop-scheduling)，Remote Agent 的完整流水線見 [Remote Agent 自動開發](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline)。

## Cloud Scheduled Tasks

### 建立方式

三個入口，做的事一樣：

- **Web**：到 [claude.ai/code/scheduled](https://claude.ai/code/scheduled) 點 New scheduled task
- **Desktop App**：Schedule 頁面 → New task → New remote task
- **CLI**：在 session 中打 `/schedule`，Claude 會用對話引導你設定

### 設定什麼

一個 scheduled task 有五個元素：

**1. 名稱**

給任務一個描述性名稱。例如 `daodao-auto-dev`、`daily-pr-review`、`weekly-dependency-audit`。

**2. Prompt（指令）**

最重要的部分。這個 prompt 在每次 run 時完全自主執行，沒有人類互動，所以必須寫得夠完整：做什麼、怎麼做、成功的標準是什麼。

````
你是 daodao 的自動開發代理。

## 準備工作

你的工作環境有 4 個 repo 已經 clone 好。先探索目錄結構：

```bash
ls -la ~/ && find ~/ -maxdepth 2 -name '.git' -type d 2>/dev/null
```

記下每個 repo 的實際路徑，建立對應關係...
````

**3. Repositories**

指定一個或多個 GitHub repo。每次 run 都會 fresh clone default branch。Claude 只能 push 到 `claude/` 前綴的 branch（除非你開啟 Allow unrestricted branch pushes）。

**4. 排程（Cron）**

| 預設選項 | 說明 |
|---------|------|
| Hourly | 每小時 |
| Daily | 每天指定時間（預設 9:00 AM） |
| Weekdays | 週一到週五 |
| Weekly | 每週指定日期和時間 |
| Custom cron | 完全自訂 cron expression |

需要更精確的控制（例如每 2 小時），用 CLI 的 `/schedule update` 設定自訂 cron expression。cron 格式是標準五欄位：`minute hour day-of-month month day-of-week`。

**5. Environment 和 Connectors**

- **Environment**：控制網路存取、環境變數（API key 等）、setup script（安裝依賴）
- **Connectors**：連接外部 MCP 服務（Slack、Linear、Google Drive 等）

### 管理任務

在 [claude.ai/code/scheduled](https://claude.ai/code/scheduled) 可以：

- **Run now**：立即手動觸發一次
- **Pause/Resume**：暫停排程，保留設定
- **查看 Runs 歷史**：每次 run 都是一個完整的 session，可以看 Claude 做了什麼
- **編輯**：改 prompt、排程、repo、environment

CLI 也能管理：`/schedule list`、`/schedule update`、`/schedule run`。

## 實際案例：daodao-auto-dev

這是我實際在跑的 scheduled task，用來自動開發 daodao 專案。

### 設定

- **名稱**：`daodao-auto-dev`
- **Repositories**：4 個 repo——`daodaoedu/daodao-server`、`daodaoedu/daodao-f2e`、`daodaoedu/daodao-ai-backend`、`daodaoedu/daodao-storage`
- **排程**：Custom cron `0 */2 * * *`（每 2 小時），UTC 時間
- **狀態**：可以隨時 Pause/Resume

### Prompt 設計

prompt 告訴 Claude：

1. 先探索工作環境，找到四個 repo 的路徑
2. 掃描 GitHub issues，找有 `auto` label 的
3. 按優先順序實作：建 branch → 寫 code → 跑測試 → 開 PR
4. 檢查已開的 PR 有沒有 review feedback，有的話自動修

這個 prompt 大概 200 行，包含每個 repo 的技術棧說明、coding convention、PR 格式規範。寫得越具體，AI 的產出品質越好。

### 運作結果

從截圖可以看到 Runs 歷史：

- 每 2 小時自動執行一次（2:01 AM、4:04 AM、6:02 AM）
- 也支援手動觸發（MANUAL 標記）
- 每次 run 都是獨立 session，可以展開看完整對話

實際效果：

```
半夜 → Claude 掃到 3 個 auto issue
    ↓
自動建 branch、寫 code、跑測試
    ↓
開 3 個 PR（各帶 +177/-0、+121/-18 等改動）
    ↓
早上起來 → review 3 個 PR → merge
```

人類的角色從「寫 code」變成「寫 issue + review PR」。

### 搭配 /file-bug-issue

上一篇介紹的 [`/file-bug-issue` skill](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) 可以在 debug 時直接開 GitHub issue。如果判斷 AI 能修，手動加上 `auto` label，下一輪 scheduled task 就會自動接手。

```
Debug → /file-bug-issue → GitHub Issue (bug label)
    ↓
人類判斷能自動修 → 加 auto label
    ↓
Scheduled Task 下一輪掃到 → 自動修 → 開 PR
```

## Prompt 設計原則

Cloud Scheduled Task 最大的挑戰是 prompt 品質。它完全自主執行，你不在場。

**要自足。** 不能假設任何上下文。每次 run 都是 fresh clone，session 之間沒有記憶。所有需要的資訊都要寫在 prompt 裡。

**要具體。** 「幫我處理 issue」太模糊。「掃描 `auto` label 的 issue，按 priority 排序，一次處理一個，建 `claude/<issue-number>` branch，完成後跑 `pnpm test`，通過才開 PR」才是好的。

**要有邊界。** 告訴 Claude 什麼不該做：不要改 CI config、不要 force push、不要 merge PR。自主執行的 AI 需要明確的約束。

**要考慮失敗。** 「如果測試失敗，停止該 issue 的處理，在 PR 留言說明失敗原因，繼續處理下一個」。不處理失敗路徑的 prompt 會讓 AI 卡住。

**迭代改進。** 前幾次 run 一定會有問題。看 session 記錄，調整 prompt，再跑。幾輪之後就穩了。

## 限制

**每次 fresh clone。** 沒有 cache，大 repo 的 clone 時間長。也不能存狀態（例如「上次處理到哪個 issue」），需要靠外部系統（GitHub labels、issue 狀態）追蹤進度。

**Branch 限制。** 預設只能 push 到 `claude/` 前綴的 branch。合理的安全設計，但如果你的 workflow 需要 push 到其他 branch，要明確開啟。

**最短間隔 1 小時。** Cloud task 不適合高頻監控。需要分鐘級輪詢的用 Desktop task 或 `/loop`。

**沒有本地檔案存取。** 跑在 Anthropic 雲端，看不到你電腦上的檔案。需要本地環境的任務用 Desktop task。

**會有幾分鐘的延遲。** 為了避免所有任務同時打 API，每次 run 會有一個小的隨機延遲。不影響實際使用，但不適合需要精確時間的場景。

## 整體來說

Scheduled Tasks 把 Claude Code 從「你問它答」的互動模式，變成了「設定好就自己跑」的自動化系統。

最大的心態轉變是：**你不再需要坐在電腦前等 AI 做事。** 寫好 prompt，設好 cron，AI 就變成一個全天候運行的開發者。你的角色從「寫 code 的人」變成「設計工作流程的人」。

從簡單的開始：每天早上自動 review 前一天的 PR、每週跑一次 dependency audit。確認穩定了，再加入更複雜的自動化：掃 issue 自動開發、監控 CI 失敗自動修復。

---

## 參考資料

- [Cloud Scheduled Tasks 官方文件](https://code.claude.com/docs/en/web-scheduled-tasks)
- [Desktop Scheduled Tasks 官方文件](https://code.claude.com/docs/en/desktop#schedule-recurring-tasks)
- [/loop 與 CLI 排程官方文件](https://code.claude.com/docs/en/scheduled-tasks)
- [GitHub Actions 整合](https://code.claude.com/docs/en/github-actions)
- [Claude Code /loop 排程功能](/posts/tech/2026-03-16-claude-code-loop-scheduling)
- [Remote Agent 自動開發流水線](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline)
- [/file-bug-issue Skill 與 Remote Agent 串接](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent)
