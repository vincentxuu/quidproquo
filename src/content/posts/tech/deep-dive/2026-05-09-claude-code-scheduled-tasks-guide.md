---
title: "Claude Code Routines 全攻略：雲端自動化系統的完整設定與案例（前 Cloud Scheduled Tasks）"
date: 2026-05-09
type: guide
category: tech
tags: [claude-code, routines, scheduled-tasks, remote-agent, automation, cron, dx]
lang: zh-TW
tldr: "Routines 是 Claude Code 的雲端自動化系統（前身 Cloud Scheduled Tasks）。除了 cron 排程，還能用 API 端點或 GitHub 事件觸發——掃 issue、審 PR、跑檢查、開 PR，電腦關了也會跑。"
description: "完整介紹 Claude Code Routines 的三種觸發方式（Schedule / API / GitHub），與 Desktop scheduled tasks、/loop 的差異，以及實際案例 daodao-auto-dev 的設計。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 8
---

你寫了一個 prompt 告訴 Claude「掃描這四個 repo 的 GitHub issues，有標 `auto` 的就實作，完成後開 PR」。然後設定每 2 小時跑一次。

接下來你去睡覺。半夜 2 點、4 點、6 點，Claude 自己 clone repo、讀 issue、寫 code、跑測試、開 PR。你早上起來，收件匣裡躺著三個等你 review 的 PR。

這就是 Claude Code **Routines** 做的事。

> **更名提醒**：Routines 就是過去的 Cloud Scheduled Tasks。功能擴充後改名——除了排程之外，還新增 **API trigger** 和 **GitHub event trigger** 兩種觸發方式，三者可以組合在同一個 routine 上。
>
> 目前 Routines 處於 **research preview**，行為、限制、API 介面可能還會變。

## 三種排程方式

Claude Code 提供三種排程機制，適合不同場景：

| | Routines（雲端） | Desktop scheduled tasks | `/loop` |
|---|---|---|---|
| 跑在哪 | Anthropic 雲端 | 你的電腦 | 你的電腦 |
| 電腦要開著嗎 | 不用 | 要 | 要 |
| 需要開著 session 嗎 | 不用 | 不用 | 要 |
| 重啟後還在嗎 | 在 | 在 | `--resume` 還可還原（7 天內） |
| 能讀本地檔案嗎 | 不能（每次 fresh clone） | 能 | 能 |
| MCP 支援 | Connectors（每個 routine 設定） | config files + connectors | 繼承 session |
| 權限提示 | 沒有（自主執行） | 每個任務可設定 | 繼承 session |
| 觸發方式 | Schedule / API / GitHub | 排程 | 排程 |
| 最短間隔 | 1 小時 | 1 分鐘 | 1 分鐘 |

**Routines**：不需要你的電腦在線，適合跨時區團隊和長期自動化。每次 run 都是 fresh clone，獨立乾淨。

**Desktop scheduled tasks**：需要電腦在線但不需要開 session，能讀寫本地檔案。適合需要本地環境的任務。

**`/loop`**：最輕量，session 內的快速排程。適合「部署完通知我」這種短期監控。新 session 就消失，開了 `--resume` 才會還原。

這篇專注介紹 Routines。`/loop` 的介紹見 [/loop 排程功能](/posts/tech/2026-05-09-claude-code-loop-scheduling)，Remote Agent 的完整流水線見 [Remote Agent 自動開發](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline)。

## Routines 是什麼

一個 routine 就是一份打包好的 Claude Code 設定：**prompt + 一或多個 GitHub repo + connectors + 一或多個 trigger**。打包一次，自動跑無數次。

可用方案：Pro、Max、Team、Enterprise 並啟用 Claude Code on the web。Team / Enterprise 管理員可以從 admin settings 全域關閉。

每個 routine 跑起來等於一個完整的 Claude Code cloud session：**自主執行、沒有權限提示、可以跑 shell、用 skills、呼叫 connectors**。能碰到什麼完全由你選的 repo、environment、connectors 決定，所以這三項一定要設緊一點。

### 建立方式

三個入口寫到同一個雲端帳號，介面互通：

- **Web**：到 [claude.ai/code/routines](https://claude.ai/code/routines) 點 **New routine**
- **Desktop App**：Routines 頁面 → **New routine** → 選 **Remote**（選 Local 就變成 Desktop scheduled task）
- **CLI**：在 session 中打 `/schedule`，Claude 會用對話引導你設定

CLI 的 `/schedule` 只能建立排程型 routine。要加 API 或 GitHub trigger，必須回 Web 編輯。

CLI 也能管理現有的：`/schedule list`、`/schedule update`、`/schedule run`。

### 設定的內容

建立表單上的關鍵欄位：

**1. 名稱與 prompt**

prompt 是核心，`Routines` 完全自主執行、沒有人類互動，所以 prompt 必須**自足、明確、可驗證**。prompt 輸入框可以選用的 model，每次 run 用同一個。

**2. Repositories**

一或多個 GitHub repo。每次 run 都會 fresh clone default branch，Claude 只能 push 到 `claude/` 前綴的 branch（除非開 **Allow unrestricted branch pushes**）。

**3. Environment（雲端環境）**

控制這個 routine 能碰到什麼：

- **Network access**：預設是 **Trusted**，只開放 npm/PyPI 之類的常見套件源、雲端 API、容器 registry，其他全擋（回 `403 host_not_allowed`）。要打你自己的服務改 **Custom** 並列出網域，或設 **Full** 完全放行
- **Environment variables**：API key、token 之類的 secret
- **Setup script**：安裝依賴。**結果會 cache**，不是每次重跑

> Connector 流量走 Anthropic server，不需要把 connector 的 host 加進 Allowed domains。

**4. Connectors**

連 MCP 服務（Slack、Linear、Google Drive 等）。建立時預設帶入你已連接的所有 connector，**用不到的記得拿掉**——run 中 Claude 不會問權限就直接呼叫工具，包含寫入。

**5. Triggers（一或多個）**

下一節詳述。

## 三種 Trigger

一個 routine 可以同時掛多種 trigger。例如「每晚跑一次 + 部署腳本叫一次 + 新 PR 開了就跑一次」可以全綁在同一個 routine 上。

### Schedule trigger

預設選項：Hourly / Daily（預設 9:00）/ Weekdays / Weekly。時間用本機時區輸入，自動轉換。

**自訂 cron**：在 Web 表單先選最接近的預設，再用 CLI 跑 `/schedule update` 設精確的 cron 表達式。**最短間隔 1 小時**——比這還密的會被擋掉。

每次 run 會有幾分鐘的隨機延遲（stagger），避免所有人同時打 API。同一個 routine 偏移量固定。

#### One-off run（單次觸發）

Schedule 也能設一次性：在指定時間跑一次，跑完自動 disable，UI 顯示為 **Ran**。

CLI 可以用自然語言：

```bash
/schedule tomorrow at 9am, summarize yesterday's merged PRs
/schedule in 2 weeks, open a cleanup PR that removes the feature flag
```

**One-off run 不算進每日 routine 上限**，只算進你方案的一般使用量。

### API trigger（新）

每個 routine 可以掛一個 HTTP 端點，POST 過去就觸發一次 run，回傳 session URL。把 Claude Code 接進告警系統、CD pipeline、內部工具都靠這個。

設定流程（**只能在 Web 設**，CLI 不能建立或撤銷 token）：

1. 編輯 routine → **Select a trigger** → **Add another trigger** → **API**
2. 存檔後 modal 顯示 URL 和 sample curl
3. 點 **Generate token**，**token 只會出現一次**，當下複製存好

範例呼叫：

```bash
curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_01ABCDEFGHJKLMNOPQRSTUVW/fire \
  -H "Authorization: Bearer sk-ant-oat01-xxxxx" \
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"text": "Sentry alert SEN-4521 fired in prod. Stack trace attached."}'
```

回傳：

```json
{
  "type": "routine_fire",
  "claude_code_session_id": "session_01HJKLMNOPQRSTUVWXYZ",
  "claude_code_session_url": "https://claude.ai/code/session_01HJKLMNOPQRSTUVWXYZ"
}
```

`text` 欄位是 freeform 字串（不會 parse 結構），會跟 routine 原本的 prompt 一起餵給 Claude。傳 JSON 進去 Claude 會看到字面字串。

> Beta header 是 `experimental-cc-routine-2026-04-01`。research preview 期間可能改變，但 Anthropic 承諾舊 header 還會支援前兩個版本給時間遷移。`/fire` 端點只給 claude.ai 帳號用，不在 Claude Platform API 表面。

### GitHub event trigger（新）

GitHub 事件直接觸發一次 run，每個事件獨立開新 session（**沒有 session reuse**）。

設定步驟（**只能在 Web 設**）：

1. 編輯 routine → **Add another trigger** → **GitHub event**
2. **必須先安裝 Claude GitHub App**（CLI 的 `/web-setup` 只給 clone 權限，不會裝 App，也不會啟用 webhook）
3. 選 repo、選事件、選 filter

支援事件：

| 類別 | 觸發時機 |
|--|--|
| Pull request | PR 開、關、指派、貼 label、push 新 commit、其他更新 |
| Release | release 建立、發布、編輯、刪除 |

每類都能挑特定 action（如 `pull_request.opened`）或全部 action。

PR filter 欄位很豐富：Author、Title、Body、Base branch、Head branch、Labels、Is draft、Is merged。每個欄位可選 operator：equals、contains、starts with、is one of、is not one of、matches regex。

> `matches regex` 比對整個值不是 substring。要找 title 包含 hotfix 寫 `.*hotfix.*`，或乾脆用 `contains`。

幾個範例組合：

- **Auth 模組 review**：base = `main` AND head 包含 `auth-provider`
- **跳過 draft**：Is draft = false
- **Label gating**：Labels 包含 `needs-backport`

> Research preview 期間，**GitHub webhook 有每個 routine 和每個帳號的小時上限**，超過就丟掉到下個窗口才復原。

## 管理 routine

在 [claude.ai/code/routines](https://claude.ai/code/routines) 點 routine 進細節頁：

- **Run now**：立即手動觸發一次
- **Pause/Resume**：用 Repeats 區塊的 toggle 暫停排程，設定保留
- **Edit**：改名稱、prompt、repo、environment、connectors、triggers
- **Delete**：刪除 routine（過去的 session 還在）
- **Runs 歷史**：每次 run 都是完整 session，點開可看 Claude 做了什麼、改了什麼、決定要不要開 PR

> 重要：run list 的綠燈只代表「session 順利啟動沒爆 infrastructure 錯誤」，**不代表 prompt 任務真的成功**。網路被擋、connector tool 缺、邏輯失敗都要進 transcript 才看得到。

## 實際案例：daodao-auto-dev

這是我實際在跑的 routine，用來自動開發 daodao 專案。

### 設定

- **名稱**：`daodao-auto-dev`
- **Repositories**：4 個 repo——`daodaoedu/daodao-server`、`daodaoedu/daodao-f2e`、`daodaoedu/daodao-ai-backend`、`daodaoedu/daodao-storage`
- **Trigger**：Schedule，custom cron `0 */2 * * *`（每 2 小時）
- **狀態**：可以隨時 Pause/Resume

### Prompt 設計

prompt 告訴 Claude：

1. 先探索工作環境，找到四個 repo 的路徑
2. 掃描 GitHub issues，找有 `auto` label 的
3. 按優先順序實作：建 branch → 寫 code → 跑測試 → 開 PR
4. 檢查已開的 PR 有沒有 review feedback，有的話自動修

這個 prompt 大概 200 行，包含每個 repo 的技術棧說明、coding convention、PR 格式規範。寫得越具體，AI 的產出品質越好。

### 運作結果

從 Runs 歷史可以看到：

- 每 2 小時自動執行一次（2:01 AM、4:04 AM、6:02 AM）
- 也支援手動觸發（**MANUAL** 標記）
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

### 搭配 GitHub trigger 讓 PR review 即時化

Schedule 跑得是「批次」。要讓 review 即時化，可以**再掛一個 GitHub trigger** 在同一個 routine（或另開一個專做 review 的 routine）：

- Trigger：`pull_request.opened`，filter `is draft = false`
- 一開 PR 就跑一次 review，留 inline comment

排程處理 backlog、GitHub trigger 處理即時事件，組合在一起變成完整的開發代理。

### 搭配 /file-bug-issue

[`/file-bug-issue` skill](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) 可以在 debug 時直接開 GitHub issue。如果判斷 AI 能修，手動加上 `auto` label，下一輪 routine 就會自動接手。

```
Debug → /file-bug-issue → GitHub Issue (bug label)
    ↓
人類判斷能自動修 → 加 auto label
    ↓
Routine 下一輪掃到 → 自動修 → 開 PR
```

## Prompt 設計原則

Routines 最大的挑戰是 prompt 品質。它完全自主執行，**run 中沒有權限提示也不會停下來問你**——你不在場。

**要自足。** 不能假設任何上下文。每次 run 都是 fresh clone，session 之間沒有記憶。所有需要的資訊都要寫在 prompt 裡。

**要具體。** 「幫我處理 issue」太模糊。「掃描 `auto` label 的 issue，按 priority 排序，一次處理一個，建 `claude/<issue-number>` branch，完成後跑 `pnpm test`，通過才開 PR」才是好的。

**要有邊界。** 告訴 Claude 什麼不該做：不要改 CI config、不要 force push、不要 merge PR。Connector 拿掉用不到的，network access 不要直接開 Full。

**要考慮失敗。** 「如果測試失敗，停止該 issue 的處理，在 PR 留言說明失敗原因，繼續處理下一個」。不處理失敗路徑的 prompt 會讓 Claude 卡住。

**迭代改進。** 前幾次 run 一定會有問題。看 session 記錄，調整 prompt，再跑。幾輪之後就穩了。

## 限制

**每次 fresh clone。** 沒有 cache（setup script 結果有，但檔案系統狀態沒有）。大 repo 的 clone 時間長。也不能存狀態（例如「上次處理到哪個 issue」），需要靠外部系統（GitHub labels、issue 狀態）追蹤進度。

**Branch 限制。** 預設只能 push 到 `claude/` 前綴的 branch。合理的安全設計，但如果你的 workflow 需要 push 到其他 branch，要明確開 **Allow unrestricted branch pushes**。

**最短間隔 1 小時。** Routines 不適合高頻監控。需要分鐘級輪詢的用 Desktop scheduled task 或 `/loop`，或改用 GitHub trigger 把「定時掃」變成「事件驅動」。

**沒有本地檔案存取。** 跑在 Anthropic 雲端，看不到你電腦上的檔案。需要本地環境的任務用 Desktop scheduled task。

**會有幾分鐘的延遲。** Stagger 避免大家同時打 API，每次 run 會有一個小的隨機延遲。不影響實際使用，但不適合需要精確時間的場景。

**每日跑次上限。** Routines 除了消耗訂閱用量，還有**每帳號每日 run 上限**。在 [claude.ai/code/routines](https://claude.ai/code/routines) 或 settings/usage 看剩多少。打到上限：開 extra usage 走 metered overage，或等下個窗口。

**身分共用問題。** Routine 屬於你個人 claude.ai 帳號，不會跟同事共享。Claude 透過你連的 GitHub 開的 PR、透過 Slack connector 發的訊息，**都掛你的名字**。這對團隊使用是一個要考慮的點。

**API 還在 beta。** `/fire` endpoint 帶的 beta header 是 `experimental-cc-routine-2026-04-01`，request/response shape 還可能變。

## 整體來說

Routines 把 Claude Code 從「你問它答」的互動模式，變成了「設定好就自己跑」的自動化系統。

最大的心態轉變是：**你不再需要坐在電腦前等 AI 做事。** 寫好 prompt，掛上 trigger，AI 就變成一個全天候運行的開發者。從「寫 code 的人」變成「設計工作流程的人」。

而且現在不只是「定時跑」這一種——把告警接 API trigger、把 PR 開啟接 GitHub trigger，AI 就能在事件發生的當下立刻動作。

從簡單的開始：每天早上自動 review 前一天的 PR、每週跑一次 dependency audit。確認穩定了，再接 GitHub trigger 把 PR review 自動化、再接 API trigger 把告警自動 triage。

---

## 參考資料

- [Routines 官方文件（前 Cloud Scheduled Tasks）](https://code.claude.com/docs/en/routines)
- [Desktop scheduled tasks 官方文件](https://code.claude.com/docs/en/desktop-scheduled-tasks)
- [/loop 與 in-session 排程官方文件](https://code.claude.com/docs/en/scheduled-tasks)
- [Trigger a routine via API（Platform docs）](https://platform.claude.com/docs/en/api/claude-code/routines-fire)
- [GitHub Actions 整合](https://code.claude.com/docs/en/github-actions)
- [Claude Code on the web：cloud environment 設定](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Claude Code /loop 排程功能](/posts/tech/2026-05-09-claude-code-loop-scheduling)
- [Remote Agent 自動開發流水線](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline)
- [/file-bug-issue Skill 與 Remote Agent 串接](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
