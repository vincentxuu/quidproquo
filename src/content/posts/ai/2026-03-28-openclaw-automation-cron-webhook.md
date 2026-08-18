---
title: "OpenClaw 自動化（一）：六種機制怎麼選，以及「排程要準」與「順便看一下」是兩件事"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, automation, cron, heartbeat, webhook, background-tasks]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 24
tldr: "Cron 已經改名為 Automations（openclaw cron 仍是別名），而自動化現在有六種機制。核心的取捨只有一條：Automations 給你精確時間與隔離執行，Heartbeat 給你完整的主 session 脈絡與大約每 30 分鐘一次的頻率。"
description: "OpenClaw 自動化機制的選擇指南：Automations、Heartbeat、Background Tasks、Task Flow、Hooks、Standing Orders 的分工，以及排程器的執行位置、逾時分層與失敗處理。"
draft: false
---

OpenClaw 現在有**六種**跑背景工作的機制，多到需要一張決策表。這篇先幫你選對機制，再講排程器本身的實際行為。

（命名也變了：**cron 已改稱 Automations**，用 `openclaw automations` 管理，`openclaw cron` 仍是同一組指令的別名。）

## 六種機制的分工

| 你要做的事 | 用哪個 | 為什麼 |
|---|---|---|
| 每天 9 點整送報告 | **Automations** | 精確時間、隔離執行 |
| 20 分鐘後提醒我 | **Automations** | 一次性且時間精確（`--at`）|
| 每 30 分鐘看一次信箱 | **Heartbeat** | 與其他檢查批次處理、有脈絡 |
| 監看行事曆上的近期事件 | **Heartbeat** | 週期性的覺察本來就適合 |
| 查某個 subagent 或 ACP 執行的狀態 | **Background Tasks** | 任務帳本追蹤所有分離出去的工作 |
| 稽核什麼在什麼時候跑過 | **Background Tasks** | `openclaw tasks list` / `audit` |
| 多步驟研究然後彙整 | **Task Flow** | 耐久的編排，有修訂追蹤 |
| session 重置時跑一個腳本 | **Hooks** | 事件驅動 |
| 每次工具呼叫都執行程式 | **Plugin hooks** | 程序內的 hook 才攔得到工具呼叫 |
| 回覆前一律先檢查合規 | **Standing Orders** | 自動注入每個 session |

## 最重要的一條取捨：Automations vs Heartbeat

| 面向 | Automations | Heartbeat |
|---|---|---|
| 時間 | **精確**（cron 表達式、一次性）| **大約**（預設每 30 分鐘）|
| Session 脈絡 | 全新（隔離）或共享 | **完整的主 session 脈絡** |
| 任務紀錄 | **一律建立** | **從不建立** |
| 投遞 | 頻道、webhook，或不投遞 | 內聯在主 session 裡 |
| 適合 | 報告、提醒、背景工作 | 信箱檢查、行事曆、通知 |

判準很乾脆：**需要精確時間或隔離執行 → Automations；工作受益於完整 session 脈絡而且時間大約就好 → Heartbeat。**

Heartbeat 還有幾個行為值得知道：它的 monitor scratch **是小塊的 prompt 脈絡**，週期性工作應該排成 automation job 而不是塞進 scratch；scratch 空的時候會以 `empty-heartbeat-file` 跳過；而且**排程的 heartbeat 會在主佇列或 automation 工作忙碌、同一個 agent 有其他回覆或嵌入式執行進行中、或目標 session 有進行中／排隊中的工作時自動延後**。

它也**不會延長每日／閒置的 session 重置新鮮度**——這點在前面 session 那篇也提過，兩邊是一致的。

## 排程器實際上怎麼跑

**Automations 跑在 Gateway 程序裡，不是在模型裡**——所以 **Gateway 沒開，排程就不會觸發**。工作定義、執行期狀態與執行歷史持久化在共用的 SQLite 狀態資料庫裡，重啟不會弄丟排程。

**每一次 automation 執行都會建立一筆背景任務紀錄。** 一次性工作（`--at`）**預設成功後自動刪除**，要保留就加 `--keep-after-run`。

### 逾時是分層的

這段值得看，因為它解釋了「為什麼我的工作卡住那麼久」：

- 有設 `--timeout-seconds` 就用它
- 沒設時，**隔離／分離的 agent-turn 工作受排程器自己的 60 分鐘看門狗約束**，遠早於底層 agent-turn 逾時（`agents.defaults.timeoutSeconds`，**預設 48 小時**）會生效
- **指令型工作預設 10 分鐘，腳本 payload 預設 5 分鐘**

還有一組**針對階段的看門狗**：啟動／設定卡住會給出明確訊息（例如「隔離 agent 設定在 runner 啟動前逾時」或「執行在開始前停滯，最後階段：context-engine」）。這些看門狗**涵蓋嵌入式與 CLI 支撐的供應商，甚至在外部 CLI 程序啟動之前**，而且**獨立於很長的 `timeoutSeconds` 上限**——好讓冷啟動、認證與 context 失敗快速浮現，而不是等 48 小時。

### 失敗要看起來像失敗

有三條設計是為了**不讓失敗偽裝成成功**：

- **執行層級的 agent 失敗即使沒有回覆 payload 也算工作錯誤**，所以模型／供應商失敗會累加錯誤計數並觸發失敗通知，而不是把工作清成成功
- **結構化的執行拒絕中繼資料被辨識出來**（包含 node-host 的 `UNAVAILABLE` 包裝，其巢狀錯誤以 `SYSTEM_RUN_DENIED` 或 `INVALID_REQUEST` 開頭），所以被擋下的指令不會被回報成綠燈；而普通的助理散文不會被誤判成拒絕
- **防止過時的確認式回覆**：如果第一個結果只是中途狀態更新（「在處理了」「正在整理」這類），而且沒有後代 subagent 還在負責最終答案，OpenClaw 會**重新提示一次要真正的結果**才投遞

第三條特別務實——它處理的是「模型回了一句『好的我來做』就被當成完成」這個很常見的坑。

### 逾時後的清理

工作撞到 `timeoutSeconds` 時，排程器中止執行並給一小段清理視窗。**如果沒排乾淨，Gateway 擁有的清理會強制清除那次執行的 session 擁有權**，才記錄逾時——這樣排隊中的聊天工作就不會卡在一個過時的處理中 session 後面。

## 排程種類與時區

| 種類 | 旗標 | 說明 |
|---|---|---|
| `at` | `--at` | 一次性時間戳（ISO 8601 或相對如 `20m`）|
| `every` | `--every` | 固定間隔 |
| `cron` | `--cron` | 5 欄或 6 欄的 cron 表達式，可搭 `--tz` |
| `on-exit` | `--on-exit` | 被監看的指令結束時觸發一次（**存活過回合拆除**）|
| `stream` | `--stream-command` | 由受監督的長壽指令產出的批次行觸發 |

**沒有時區的時間戳一律當成 UTC。** cron 表達式沒有 `--tz` 時用 Gateway 主機時區。`--tz` **不能**跟 `--every` 或 `--on-exit` 一起用。

一個很貼心的細節：**整點的週期性表達式（分鐘為 `0` 且小時是萬用字元）會自動錯開最多 5 分鐘**以減少負載尖峰。要精確就用 `--exact`，要自訂窗口用 `--stagger 30s`（僅 cron 排程）。

啟動時的行為也想過了：**Gateway 啟動時，逾期的隔離 agent-turn 工作會被重新排程而不是立刻重播**，把模型與工具的 bootstrap 工作擋在頻道連線窗口之外。

## 從外部排程器驅動時的注意事項

如果你用系統 cron 或別的排程器驅動 `openclaw agent`，官方建議**包一層硬殺升級**，即使 CLI 已經處理 `SIGTERM`／`SIGINT`：

```bash
timeout -k 60 600 openclaw agent ...
```

`-k` 的值是排不乾淨時的最後保險。systemd 單元則用 `SIGTERM` 停止訊號加上 `TimeoutStopSec` 的寬限窗口。

還有一條：**原本的 Gateway 執行還活著時重用 `--run-id`，會把重複的那次回報為 in-flight，而不是啟動第二次執行。**

## 整體來說

自動化這一層的選擇其實是在回答兩個問題：**時間要多準**（精確 → Automations，大約 → Heartbeat），以及**要不要脈絡**（隔離 → Automations，完整主 session → Heartbeat）。

而排程器本身最值得欣賞的是它對**失敗語意**的講究：分層的逾時讓冷啟動問題快速浮現而不是等 48 小時、拒絕的指令不會被算成綠燈、只回了一句「我在處理」不算完成。這些都是「讓失敗看起來像失敗」的具體實作。

下一篇講 Standing Orders——它回答的是另一個問題：**agent 被授權做什麼。**

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**cron 已改稱 Automations**（`openclaw cron` 為別名），自動化擴充為六種機制（Automations、Heartbeat、Background Tasks、Task Flow、Hooks、Standing Orders）並補上完整的選擇決策表與 Automations／Heartbeat 的對照。新增排程器的實際行為：**跑在 Gateway 程序內、Gateway 沒開就不觸發**、狀態持久化於共用 SQLite、每次執行建立背景任務紀錄、**分層的逾時**（排程器 60 分鐘看門狗、指令 10 分鐘、腳本 5 分鐘、底層 agent-turn 預設 48 小時）與階段專屬看門狗、**三條「不讓失敗偽裝成成功」的設計**（無 payload 的執行失敗仍計為錯誤、結構化拒絕不算綠燈、只回中途狀態會被重新提示）、逾時後強制清除 session 擁有權、`on-exit` 與 `stream` 兩種新排程種類、整點錯開最多 5 分鐘與 `--exact`／`--stagger`、啟動時逾期工作重新排程，以及從外部排程器驅動時的硬殺升級建議與 `--run-id` 重用行為。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Automation](https://docs.openclaw.ai/automation/) — 六種機制的決策指南
- [Automations](https://docs.openclaw.ai/automation/cron-jobs) — 排程器、排程種類與失敗處理
- [Background Tasks](https://docs.openclaw.ai/automation/tasks) — 分離工作的任務帳本
- [Task Flow](https://docs.openclaw.ai/automation/taskflow) — 多步驟流程編排
- [Heartbeat](https://docs.openclaw.ai/gateway/heartbeat) — 週期性的主 session 回合
