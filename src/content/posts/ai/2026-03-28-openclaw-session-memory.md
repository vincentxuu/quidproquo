---
title: "OpenClaw 的 Session 與記憶：一條滾動的主對話，加上四個會被寫進磁碟的檔案"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, session, memory, compaction, main-session, incognito, dreaming]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 12
tldr: "預設下所有 DM 匯進同一條「主 session」，群組活動與背景工作都往那裡回報。記憶則完全是磁碟上的 Markdown——模型只記得被寫下來的東西，沒有隱藏狀態。但如果不只你一個人能私訊它，DM 隔離是必須主動打開的。"
description: "OpenClaw 的 session 路由與記憶層：主 session 的匯流設計、dmScope 與 groupScope 矩陣、incognito session 的邊界、重置策略、四個記憶檔案的分工、dreaming 蒸餾與記憶匯入。"
draft: false
---

這一層回答兩個問題：**訊息進來之後屬於哪段對話**，以及**對話結束之後還剩下什麼**。

## 主 session：一條滾動的對話

OpenClaw 首先是個**個人 agent**。開箱狀態下，你從 Telegram、WhatsApp、iMessage、Slack DM、網頁——任何地方——送出的每一則私訊，都會落進**同一條滾動的對話**。手機上問一句，筆電上接著問，agent 兩邊都有相同的上下文。

底層它就是一個普通的 session，預設 key 是 `agent:<id>:main`。特別的是**其他系統都把它當成 agent 的根**：

- **群組活動會匯進來。** 群組與房間 session 預設是隔離的，但在預設 DM 範圍下，主 session 會**自動關注它們**。活動排隊成精簡的通知——**每個對話合併一次，不是每則訊息叫醒一次**——agent 在下次執行時看到（你的下一則訊息，或排程的 heartbeat）
- **背景工作會回報。** 子 agent 與 spawn 出來的 session 會把結果宣告回啟動它們的那個 session
- **Heartbeat 指向主 session**，這就是為什麼你沒說話它也會有意識

## DM 範圍：多人時必須主動隔離

預設所有 DM 共用一條 session，這對單人使用沒問題。但官方的警告很直接：

> 如果有多個人能私訊你的 agent，**啟用 DM 隔離**。沒有的話，所有使用者共用同一段對話上下文——Alice 的私訊會被 Bob 看見。

| `session.dmScope` | 行為 |
|---|---|
| `main`（預設）| 所有 DM 共用主 session |
| `per-peer` | 依發送者隔離，跨頻道 |
| `per-channel-peer` | 依頻道 + 發送者隔離（**官方推薦**）|
| `per-account-channel-peer` | 依帳號 + 頻道 + 發送者隔離 |

`openclaw security audit` 在偵測到多個 DM 發送者時會建議隔離。反過來，如果同一個人從多個頻道找你，用 `session.identityLinks` 把他的身分對應到同一個標準 peer id，就能共用 session。

**啟用隔離會連帶關掉兩件事**：主 session 的群組關注、以及跨對話的記憶回想（預設變成關閉）。

## 群組範圍與 binding 覆寫

`session.groupScope` 預設 `per-group`（每個群組、房間、頻道各自在自己的 session）。設成 `main` 則全部匯進主對話。

比較實用的是**單一 binding 覆寫**——只讓某個團隊房間加入主對話：

```json5
{
  bindings: [{
    agentId: "main",
    match: { channel: "slack", peer: { kind: "channel", id: "C0123TEAM" } },
    session: { groupScope: "main" },
  }],
}
```

binding 的覆寫贏過全域設定。要注意它**只改變 session key 的選擇**——DM 路由、mention gating、投遞上下文與回覆到來源房間都不變。

## Incognito session

3 月之後新增的：只能從 Control UI 的 **New thread** 畫面開，開始 thread 之前先打開 **Incognito**。它的 session 條目、逐字稿與 compaction 狀態會留在**程序記憶體裡而不是磁碟上**，Gateway 重啟就消失，不跑自動記憶 flush，重置或刪除時也不建立逐字稿封存。

但官方把邊界寫得很清楚，這段值得完整看：

- **Incognito 不限制 agent 的正常工具。** 明確要求儲存資訊、或任何工具驅動的檔案寫入，仍然可以把資料持久化到 incognito 儲存之外
- **你設定的模型供應商仍然處理你送出的訊息**
- 診斷日誌不變，OpenClaw 仍記錄不含內容的稽核中繼資料（例如 HMAC 參照）
- 多使用者 gateway 上，incognito thread 只對 admin 範圍的連線可見——**這保護的是儲存與其他經 gateway 中介的使用者，不是 gateway 擁有者或程序操作者**，後者永遠能觀察到活躍的 session

換句話說：它是「不留在磁碟上」，不是「沒有人看得到」。

## Session 生命週期

**預設不自動重置**——session 保持同一個 `sessionId`，由 compaction 管理隨對話成長的活躍上下文。

| 模式 | 行為 |
|---|---|
| `none`（預設）| 不自動重置 |
| `daily` | 在設定的本地時鐘（`atHour`，預設 4）開新 session |
| `idle` | 閒置 `idleMinutes` 之後開新 session |
| 手動 | 聊天裡打 `/new` 或 `/reset`（`/new <model>` 還會換模型）|

兩個容易踩到的細節：**每日重置的新鮮度基準是當前 `sessionId` 開始的時間，不是後來的中繼資料寫入**；而**閒置重置的基準是最後一次真實的使用者／頻道互動——heartbeat、cron 與 exec 這類系統事件不會讓 session 保持存活**。兩者都設時，先到期的贏。

重置時還有一個貼心處理：**舊 session 排隊中的系統事件通知會被丟棄**，免得過時的背景更新被塞到新 session 的第一個 prompt 前面。

重置會指派新的 live session id，但**先前的 SQLite 逐字稿仍在同一個主 session key 底下可搜尋**。

還有一條容量規則：當某個 agent 的實體資料庫、WAL 與 session 產物超過磁碟預算（**預設 10 GB**），OpenClaw 會把最舊的、沒被引用的歷史**抽取成經過驗證的壓縮封存**，然後才移除資料庫列。**活躍、已路由與進行中的 session 永遠不會成為預算的犧牲品。**

## 記憶：四個檔案，全部是 Markdown

官方講得很白：**模型只記得被存到磁碟上的東西，沒有隱藏狀態。**

| 檔案 | 角色 |
|---|---|
| `USER.md`（選用）| 精簡的**使用者模型層**：穩定的偏好、溝通風格、關係、進行中的專案脈絡，寫成祈使句的指令，帶觀察日期與 active／superseded 中繼資料。有自己的小預算，在 session 開始時載入 |
| `MEMORY.md` | 長期記憶：耐久的非個人檔案事實與決定。session 開始時載入。**不是逐字稿、日誌或詳盡封存** |
| `memory/YYYY-MM-DD.md` | 工作層：詳細的每日筆記、觀察、session 摘要。**被索引供 `memory_search` 與 `memory_get` 使用，但不會每輪注入 bootstrap prompt** |
| `DREAMS.md`（選用）| Dream Diary 與 dreaming 掃描摘要，供人類檢閱 |

想讓它記住什麼，直接說「記住我偏好 TypeScript」就好，它自己會寫到對的檔案。

**`USER.md` 有一條寫法規則值得注意**：偏好改變時要**就地標記 superseded，而不是追加一條矛盾的 active 指令**。這避免了「新舊偏好同時有效」這種很難查的錯誤。

**蒸餾是自動的**：每日筆記裡有用的材料會被預設的 **dreaming** 掃描蒸餾進 `MEMORY.md`。預設的 heartbeat prompt 本身**不做任何記憶維護**。

**`MEMORY.md` 太大時**，OpenClaw 保留磁碟上的完整檔案，但**截斷注入上下文的那份副本**。把這當成訊號：把細節搬去 `memory/*.md`、只在 `MEMORY.md` 留耐久摘要，或提高 bootstrap 上限。用 `/context list`、`/context detail` 或 `openclaw doctor` 看原始大小與注入大小的差異與截斷狀態。

## 會影響行動的記憶

這是很有洞察力的一段。多數記憶是普通筆記，但有些會影響 agent **之後該做什麼**——對這些，要記的不只是事實本身，還有**何時可以安全地依它行動**。

需要捕捉行動邊界的情況：核准或權限要求、暫時性限制、交接給另一個 session／thread／人、到期條件、安全行動的時機、來源或擁有者的權威、以及「不要做某個誘人動作」的指示。

一則好的行動敏感記憶要講清楚：**什麼改變了未來行為、什麼條件下適用、何時到期或什麼解鎖行動、該避免什麼、來源是誰**。

官方的例子：

```md
API 遷移正在另一個 session 裡設計。之後的回合不應該從這個 thread 編輯 API
實作；在遷移計畫落地之前，這裡的發現只能當設計輸入。
```

但同時有一句必須記住的界線：**記憶可以保存核准的脈絡，但它不執行政策。** 硬性的操作控制要用核准設定、沙箱與排程任務。

## 記憶工具與引擎

三個工具：`memory_search`（語意搜尋，即使措辭不同也找得到）、`memory_get`（讀特定檔案或行範圍）、`intent`（建立、列出、明確取消**事件條件式的常駐意圖**；時間型提醒仍走排程任務）。

**記憶引擎現在是可替換的 plugin**：預設 `memory-core` 是 SQLite 基礎，開箱支援關鍵字、向量與混合搜尋，無額外相依。另有 AI 原生的跨 session 記憶（含使用者建模與多 agent 感知）與 LanceDB 支撐的方案可裝。

搜尋在設定了 embedding 供應商時會用**混合搜尋**（向量語意 + 關鍵字精確比對，適合 ID 與程式碼符號）。預設用 OpenAI embedding，可明確設 `memory.search.provider` 換成 Gemini、Voyage、Mistral、Bedrock、DeepInfra、本地 GGUF、Ollama、LM Studio 等。

## 從其他編碼助理匯入記憶

Control UI 的 **Settings → Import Memory** 可以匯入 Codex、Claude Code 與 Hermes 的本機記憶。

它**只複製 Markdown 記憶**——Codex 只取 `~/.codex/memories` 底下的 `MEMORY.md` 與 `memory_summary.md`（**原始 rollout 與逐字稿不匯入**）；Claude Code 取各專案 auto-memory 目錄下的 Markdown（**專案指令、session、設定與憑證不在此列**）；Hermes 取偵測到的 home 裡的 `MEMORY.md` 與 `USER.md`。

匯入的檔案**分開放在 `memory/imports/<來源>/`**，被索引供搜尋使用，但**不會併進 agent 的 bootstrap `MEMORY.md`**，來源檔案也保持不變。

## 整體來說

這一層的設計哲學是**顯性**：記憶是你看得到、改得動的 Markdown 檔案；session 的匯流關係寫在設定裡；連 incognito 都明說它保護什麼、不保護什麼。

但顯性不等於安全的預設。最該主動決定的是那一條——**如果不只你一個人能私訊這個 agent，`session.dmScope` 就必須改。** 預設值是為單人設計的，而它失敗的方式是把別人的私訊給別人看。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**主 session 的匯流設計**（群組活動合併成通知、背景工作回報、heartbeat 指向它）、`dmScope` 四種模式與啟用隔離會連帶關掉群組關注與跨對話回想、`groupScope` 的 binding 層覆寫、**incognito session** 及其明確邊界（不限制工具、供應商仍處理訊息、保護的不是 gateway 擁有者）、重置的新鮮度基準（系統事件不延長閒置計時）與重置時丟棄舊通知、**10 GB 磁碟預算與壓縮封存**。記憶部分新增 `USER.md` 與 `DREAMS.md` 兩個檔案、`USER.md` 的 supersede 寫法、**dreaming 掃描負責蒸餾而 heartbeat 不做記憶維護**、`MEMORY.md` 超出預算時只截斷注入副本、**會影響行動的記憶**該捕捉的行動邊界（含「記憶不執行政策」的界線）、`intent` 工具、記憶引擎已 plugin 化與混合搜尋的供應商選項，以及從 Codex／Claude Code／Hermes 匯入記憶的範圍與隔離存放。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Session management](https://docs.openclaw.ai/concepts/session) — 路由、範圍、incognito 與重置
- [The main session](https://docs.openclaw.ai/concepts/main-session) — 主對話的匯流與磁碟預算
- [Memory overview](https://docs.openclaw.ai/concepts/memory) — 四個記憶檔案、工具、引擎與匯入
- [Dreaming](https://docs.openclaw.ai/concepts/dreaming) — 背景蒸餾掃描
- [Memory search](https://docs.openclaw.ai/concepts/memory-search) — 混合搜尋與供應商設定
