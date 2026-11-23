---
title: "OpenClaw 自動化（一）：機制怎麼選，以及 Heartbeat 改成一般排程工作之後"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, automation, cron, heartbeat, webhook]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 24
tldr: "Cron 已改名 Automations（openclaw cron 仍是別名），而且週期性檢查也併進來了：Heartbeat 不再是獨立機制，舊設定用 openclaw doctor --fix 轉成一般排程工作，新安裝會建一個 Proactive check（預設關閉，打開後每 30 分鐘、用主對話、閒置才跑）。Background Tasks 與 Task Flow 已移除，多步驟流程改用 Lobster 外掛。選機制只剩一個問題：是時間到了、事件發生了，還是每次都要遵守的規則。"
description: "OpenClaw 自動化機制的選擇指南：Automations、Hooks、Webhooks、IMAP 觸發、Standing Orders、Lobster 的分工，Heartbeat 遷移成排程工作後的監控設定，以及排程器的執行位置、逾時分層與失敗處理。"
draft: false
---
OpenClaw 跑背景工作的機制在 2026 年下半年整併過一次。這篇先幫你選對機制，再講週期性檢查改成一般排程工作之後怎麼設，最後是排程器本身的實際行為。

（命名也變了：**cron 已改稱 Automations**，用 `openclaw automations` 管理，`openclaw cron` 仍是同一組指令的別名。）

## 機制的分工

依[官方的選擇表](https://docs.openclaw.ai/automation)：

| 你要做的事 | 用哪個 | 為什麼 |
|---|---|---|
| 每天 9 點整送報告 | **Automations** | 精確時間、隔離執行 |
| 20 分鐘後提醒我 | **Automations** | 一次性且時間精確（`--at`）|
| 每 30 分鐘看一次信箱 | **Automations** | 自己的排程與執行歷史 |
| 監看行事曆上的近期事件 | **Automations** | 明確的週期與投遞設定 |
| 在主對話裡順便提醒有變化的事 | **Automations** | 可編輯的監控工作，沒事就不說話 |
| 收到新信時安全地觸發 | **IMAP 外掛** | 依寄件人把關，每封信開一個隔離的讀信 session |
| 外部服務觸發 agent | **Webhooks** | 有驗證的 HTTP 入口 |
| session 重置時跑一個腳本 | **Hooks** | 事件驅動的 `HOOK.md` 腳本 |
| 每次工具呼叫都執行程式 | **Plugin hooks** | 程序內的 hook 才攔得到工具呼叫 |
| 回覆前一律先檢查合規 | **Standing Orders** | 自動注入每個 session |
| 多步驟流程、中途要人核准 | **Lobster** | 選裝的外掛，停在核准點、拿 token 續跑 |

跟舊版比，少了三樣東西：

- **Heartbeat** 不再是獨立機制，週期性檢查都是一般的 automation 工作（下一節）。
- **Background Tasks** 的任務帳本已移除，排程的執行紀錄改看 automation 自己的執行歷史（`openclaw automations runs <job-id>`）。
- **Task Flow** 也移除了，多步驟、要核准的流程改用 [Lobster](https://docs.openclaw.ai/automation/taskflow) 外掛。

所以選機制只剩一個問題：觸發它的是**時間**（Automations）、**事件**（Hooks、Webhooks、IMAP）、還是**每次都要遵守的規則**（Standing Orders）。

## Heartbeat 改成一般排程工作之後

舊版的取捨是「Automations 精確但隔離，Heartbeat 大約但有主 session 脈絡」。現在這兩種能力都放進 automation 工作，[Heartbeat 遷移文件](https://docs.openclaw.ai/gateway/heartbeat)寫的變化是：

- **舊設定要遷移**：跑 `openclaw doctor --fix`，它會把舊的 heartbeat 監控轉成可編輯的 automation 工作。ID、執行歷史、scratch 和排程錨點都會保留，`HEARTBEAT.md` 裡支援的內容也會匯入。轉換驗證成功後，`agents.defaults.heartbeat` 這類設定才會被移除，`HEARTBEAT.md` 也不再被讀取。
- **新安裝會建一個 Proactive check，但預設是關的**：用 `openclaw automations enable <job-id>` 打開後，每 30 分鐘一次，用 agent 的主對話執行，等閒置才跑，結果送到擁有者的私訊。它只建一次，刪掉就不會再自動長回來。
- **沒事就不說話**：檢查沒有要回報的事時回 `NO_REPLY`，不會發訊息，也不需要多一次模型請求。

要讓排程工作保留舊 heartbeat 的「順便看一下」行為，用[這幾個工作層級的設定](https://docs.openclaw.ai/automation/cron-jobs/schedules)：

| 設定 | 作用 |
|---|---|
| `activeHours` | 只在某個時段內執行，例如 08:00–22:00，可指定時區 |
| `idleOnly` | 等整個 agent 都閒下來才跑，包括其他排程和前景對話 |
| `payload.skipIfScratchEmpty` | scratch 明確清空時跳過；沒設 scratch 照樣跑 |
| `delivery.target: "owner"` | 送到擁有者的私訊，不會跟著某個群組對話跑 |

session 也是工作層級的選擇：指定具名 session 就共用那段對話的脈絡，`isolated` 每次從乾淨的脈絡開始。

兩個遷移時要注意的地方：

- Doctor 遷移完會提示：舊 heartbeat 專屬的「重複訊息不再送」和「沒有投遞路徑就跳過」都拿掉了，同樣的更新可能重複送出。依賴這兩個行為的人要回頭調投遞設定。
- `idleOnly` 看的是整個 agent。共用、很忙的 agent 上，排程可能一直被延後。

scratch 是附在工作上的一小段私有脈絡，適合放簡短的檢查清單。它會進到模型的 prompt，所以不要放密碼。它也不是排程器：要定期做的事，各開一個 automation 工作，不要寫成 scratch 裡的 `tasks:` 區塊。

另外兩個新的寫法：

- **動態頻率**：設 `pacing.min`／`pacing.max`，agent 執行時可以提議下次什麼時候再檢查，OpenClaw 會限制在範圍內。
- **`/loop`**：在對話裡打 `/loop 5m <要做的事>` 建一個綁在這段對話的週期工作；不給間隔就讓它在 1 分鐘到 1 小時之間自己決定頻率。

v2026.8.1 也移除了「從對話裡推斷待辦、透過 heartbeat 提醒」的實驗功能。要提醒，就明確建一個 automation。

## 排程器實際上怎麼跑

**Automations 跑在 Gateway 程序裡，不是在模型裡**——所以 **Gateway 沒開，排程就不會觸發**。工作定義、執行期狀態與執行歷史持久化在共用的 SQLite 狀態資料庫裡，重啟不會弄丟排程。

**執行紀錄寫在 automation 自己的執行歷史裡。** 一次性工作（`--at`）**預設成功後自動刪除**，要保留就加 `--keep-after-run`；必要的投遞失敗或結果不明時，工作會停用保留下來給你檢查，不會重跑。

**同時最多跑 8 個工作**；都在忙而還有工作到期時，只要可用記憶體還有 1 GiB 以上，就再多開一個，最多 16 個。

### 逾時是分層的

這段值得看，因為它解釋了「為什麼我的工作卡住那麼久」：

- 有設 `--timeout-seconds` 就用它
- 沒設時，**隔離／分離的 agent-turn 工作受排程器自己的 60 分鐘看門狗約束**。這個期限跟每次模型嘗試的上限（`agents.defaults.timeoutSeconds`，**預設 48 小時**）是分開算的，換備援模型也不會重置
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
| `cron` | `--cron` | 5 欄或 6 欄的 cron 表達式，可搭 `--tz`；日期和星期兩欄都有值時是「或」，不是「且」|
| `on-exit` | `--on-exit` | 被監看的指令結束時觸發一次（**存活過回合拆除**）|
| `stream` | `--stream-command` | 由受監督的長壽指令產出的批次行觸發 |

**沒有時區的時間戳一律當成 UTC。** cron 表達式沒有 `--tz` 時用 Gateway 主機時區。`--tz` **不能**跟 `--every` 或 `--on-exit` 一起用。

一個很貼心的細節：**整點的週期性表達式（分鐘為 `0` 且小時是萬用字元）會自動錯開最多 5 分鐘**以減少負載尖峰。要精確就用 `--exact`，要自訂窗口用 `--stagger 30s`（僅 cron 排程）。

啟動時的行為也想過了：**Gateway 啟動時，逾期、需要 agent 執行的工作會被重新排程而不是立刻重播**，包括遷移過來的監控工作，把模型與工具的啟動工作擋在排程器啟動之外。

`every`、`cron`、`stream` 排程還可以掛一個**條件腳本**（`--trigger-script`）：腳本回傳 `fire: true` 才真的跑 agent，沒變化就安靜跳過、不花模型呼叫。每次評估最多 30 秒、5 次工具呼叫，最短間隔 30 秒。這類腳本預設以該 agent 的完整工具權限無人值守執行，要全部關掉就設 `cron.triggers.enabled: false`。

## 從外部排程器驅動時的注意事項

如果你用系統 cron 或別的排程器驅動 `openclaw agent`，官方建議**包一層硬殺升級**，即使 CLI 已經處理 `SIGTERM`／`SIGINT`：

```bash
timeout -k 60 600 openclaw agent ...
```

`-k` 的值是排不乾淨時的最後保險。systemd 單元則用 `SIGTERM` 停止訊號加上 `TimeoutStopSec` 的寬限窗口。

還有一條：**原本的 Gateway 執行還活著時重用 `--run-id`，會把重複的那次回報為 in-flight，而不是啟動第二次執行。**

## 整體來說

自動化這一層的選擇現在只要回答一個問題：**觸發它的是時間、事件，還是每次都要遵守的規則**。「時間要多準」和「要不要主對話的脈絡」不再是兩種機制的差別，而是同一個 automation 工作上的設定（`--exact`、`idleOnly`、session 目標）。

而排程器本身最值得欣賞的是它對**失敗語意**的講究：分層的逾時讓冷啟動問題快速浮現而不是等 48 小時、拒絕的指令不會被算成綠燈、只回了一句「我在處理」不算完成。這些都是「讓失敗看起來像失敗」的具體實作。

下一篇講 Standing Orders——它回答的是另一個問題：**agent 被授權做什麼。**

## 更新紀錄

- 2026-11-23：修正 Proactive check 的說法：新安裝會建立這個工作，但預設是關的，要自己用 `openclaw automations enable` 打開（原寫成新安裝就會每 30 分鐘跑）。
- 2026-11-20：對照官方文件現況改寫前兩節。Heartbeat 已遷移成一般 automation 工作（`openclaw doctor --fix`、新安裝建一個 Proactive check、`NO_REPLY`），Background Tasks 與 Task Flow 已移除（改看 automation 執行歷史、多步驟流程改用 Lobster 外掛），機制表改依官方現行選擇表（新增 IMAP 觸發、Webhooks）；新增監控設定（`activeHours`、`idleOnly`、`skipIfScratchEmpty`、擁有者投遞）、動態頻率與 `/loop`、條件腳本、同時執行上限，修正「每次執行建立背景任務紀錄」與 48 小時上限的說法，並記下 v2026.8.1 移除推斷待辦的實驗。
- 2026-08-18：對照官方文件現況大改。**cron 已改稱 Automations**（`openclaw cron` 為別名），自動化擴充為六種機制（Automations、Heartbeat、Background Tasks、Task Flow、Hooks、Standing Orders）並補上完整的選擇決策表與 Automations／Heartbeat 的對照。新增排程器的實際行為：**跑在 Gateway 程序內、Gateway 沒開就不觸發**、狀態持久化於共用 SQLite、每次執行建立背景任務紀錄、**分層的逾時**（排程器 60 分鐘看門狗、指令 10 分鐘、腳本 5 分鐘、底層 agent-turn 預設 48 小時）與階段專屬看門狗、**三條「不讓失敗偽裝成成功」的設計**（無 payload 的執行失敗仍計為錯誤、結構化拒絕不算綠燈、只回中途狀態會被重新提示）、逾時後強制清除 session 擁有權、`on-exit` 與 `stream` 兩種新排程種類、整點錯開最多 5 分鐘與 `--exact`／`--stagger`、啟動時逾期工作重新排程，以及從外部排程器驅動時的硬殺升級建議與 `--run-id` 重用行為。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Automation](https://docs.openclaw.ai/automation) — 機制的選擇表
- [Automations](https://docs.openclaw.ai/automation/cron-jobs) — 排程器總覽
- [How automations work](https://docs.openclaw.ai/automation/cron-jobs/how-it-works) — 執行模型、逾時與失敗處理
- [Automation schedules](https://docs.openclaw.ai/automation/cron-jobs/schedules) — 排程種類、監控設定、動態頻率與條件觸發
- [Heartbeat migration](https://docs.openclaw.ai/gateway/heartbeat) — 週期性監控遷移成排程工作
- [Lobster](https://docs.openclaw.ai/automation/taskflow) — 多步驟、可核准的流程外掛
