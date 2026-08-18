---
title: "OpenClaw Agent Loop：序列化、寫入者宣告，與那個防止舊回合覆寫逐字稿的柵欄"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, agent-loop, streaming, queue, hooks, concurrency]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 11
tldr: "Agent loop 是每個 session 序列化的執行。最值得學的是它處理並行的方式：每個被接受的回合會記下 activeWriterRunId 宣告，之後每次逐字稿寫入都要附上 expectedWriterRunId，在交易裡比對——被取代的回合因此無法提交過期資料。"
description: "OpenClaw agent loop 的完整生命週期：五步執行序列、per-session 與全域佇列、寫入者宣告柵欄、內部 hook 與 plugin hook 的分工與終止語意、串流與 agent.wait。"
draft: false
---

Agent loop 是**每個 session 序列化的執行**，把一則訊息變成動作與回覆：intake、上下文組裝、模型推論、工具執行、串流、持久化。

入口有兩個：Gateway RPC 的 `agent` 與 `agent.wait`，以及 CLI 的 `openclaw agent`。

## 執行序列

1. **`agent` RPC** 驗證參數、解析 session（`sessionKey`／`sessionId`）、持久化 session 中繼資料，然後**立刻回傳 `{ runId, acceptedAt }`**
2. **`agentCommand`** 跑這一輪：解析模型與 thinking／verbose／trace 預設、載入 skills 快照、呼叫 `runEmbeddedAgent`，並在嵌入式迴圈沒有自己發出時**補發生命週期的 end／error**
3. **`runEmbeddedAgent`**：透過 per-session 與全域佇列序列化執行、解析模型與 auth profile、建立 session、訂閱執行期事件、串流助理與工具的差量、**強制執行逾時（到期就中止）**，回傳 payload 與用量中繼資料
4. **`subscribeEmbeddedAgentSession`** 把執行期事件橋接到 `agent` 串流：工具事件進 `stream: "tool"`、助理差量進 `stream: "assistant"`、生命週期進 `stream: "lifecycle"`（`phase: "start" | "end" | "error"`）
5. **`agent.wait`** 等待某個 `runId` 的生命週期 end／error，回傳 `{ status: ok|error|timeout, startedAt, endedAt, error? }`

第一步的「立刻回傳」是關鍵設計：**接受與完成是分開的**，所以呼叫方可以先拿到 `runId`，再決定要不要等。

第三步還有一條 Codex 專屬的保護：**Codex app-server 的回合如果被接受之後停止產出進度、又還沒到終端事件，會被中止**——避免掛在那裡。

## 序列化與並行

執行是**依 session key 序列化**（session 車道），並可選擇再走一條全域車道，防止工具與 session 競態。訊息頻道會選一種佇列模式（steer／followup／collect／interrupt）餵進這套車道系統。

### 寫入者宣告：這篇最值得學的一段

問題是這樣的：一個 session 可能有舊的回合還在跑，而新的回合已經取代了它。舊回合如果照樣把結果寫進逐字稿，就會覆蓋掉新的狀態。

OpenClaw 的解法：

- 開始串流之前，被接受的執行會記下一個**持久的 `activeWriterRunId` 宣告**
- **每一次逐字稿的追加或重寫都要附上 `expectedWriterRunId`**
- **同步的提交交易會驗證它是否仍然等於當前的宣告**

結果是：**被取代的執行無法提交過期的逐字稿資料。** 而且後續的重寫、compaction 與截斷，用的是同一道交易內的寫入者宣告柵欄。

外面還有兩層：**SQLite 寫入佇列**排序每個 agent 的變更，**Gateway 狀態目錄鎖**防止另一個 Gateway 或 `openclaw agent --local` 程序同時擁有同一個狀態目錄。

這是很典型的分散式系統技巧（fencing token）用在單機的 agent 執行上——值得記住的原因是：**只要你的 agent 允許中斷與取代，你就會需要它。** 光靠「取消舊回合」不夠，因為取消是非同步的，而寫入可能已經在路上。

## 準備階段

- workspace 被解析並建立；**沙箱化的執行可能重導到沙箱的 workspace 根**
- skills 被載入（或重用快照）並注入環境與 prompt
- bootstrap／上下文檔案被解析並注入系統 prompt
- **逐字稿目標與寫入者宣告在串流開始之前就準備好**

系統 prompt 由 OpenClaw 的基礎 prompt、skills prompt、bootstrap 上下文與 per-run 覆寫組成，並強制執行模型特定的上限與 compaction 保留的 token。

## 兩套 hook 系統

這是很容易混淆的地方，官方分得很清楚：

**內部 hook（Gateway hooks）** — 事件驅動的腳本，用於指令與生命週期事件：

- **`agent:bootstrap`**：在建立 bootstrap 檔案、系統 prompt 定案之前執行，用來增減 bootstrap 上下文檔案
- **指令 hook**：`/new`、`/reset`、`/stop` 等

**Plugin hook** — 跑在 agent 迴圈或 gateway 管線**裡面**：

| Hook | 時機 |
|---|---|
| `before_model_resolve` | Session 之前（沒有 `messages`），用來決定性地覆寫 provider／model |
| `before_prompt_build` | Session 載入後（有 `messages`），可注入 `prependContext`、`systemPrompt`、`prependSystemContext`、`appendSystemContext`，或在支援的 runtime 上用 `toolsAllow` 收窄這一輪送出的工具面 |
| `before_agent_reply` | 內聯動作之後、LLM 呼叫之前。**可以讓 plugin 認領這一輪**，回傳合成的回覆或讓它完全靜默 |
| `agent_end` | 完成後，帶最終訊息清單與執行中繼資料 |
| `before_compaction` / `after_compaction` | 觀察或標註 compaction 週期 |
| `before_tool_call` / `after_tool_call` | 攔截工具參數與結果 |
| `tool_result_persist` | **同步地**在工具結果被寫進逐字稿之前轉換它 |
| `message_received` / `message_sending` / `message_sent` | 入站與出站訊息 |
| `session_start` / `session_end`、`gateway_start` / `gateway_stop` | 生命週期邊界 |

`toolsAllow` 有一個設計細節值得看：**空的 `toolsAllow` 代表不送出任何選用工具，省略則維持主機解析出的工具面；不支援的 runtime 會拒絕限制性的值，而不是忽略它。** 「不支援就拒絕」比「不支援就當沒看到」安全得多——後者會讓你以為工具被收窄了，其實沒有。

### Hook 的終止語意

守衛類 hook 的決策規則要記住，因為它決定了多個 handler 之間誰說了算：

- **`before_tool_call`**：`{ block: true }` 是**終端的**，會停掉較低優先權的 handler。`{ block: false }` 是 no-op，**不會清除先前的 block**
- **`message_sending`**：`{ cancel: true }` 同樣是終端的，`{ cancel: false }` 是 no-op，不會清除先前的 cancel

也就是說：**擋下來的決定是單向的，沒有人能把別人的擋放行。** 這是護欄該有的形狀。

另外有一條分工提醒：**操作者擁有的安裝允許／警告／封鎖決定要用 `security.installPolicy`，不要用 `before_install`**——因為前者才涵蓋 CLI 的安裝與更新路徑。

## 協定層的不變式

Agent loop 之外，Gateway 的 WebSocket 協定有幾條硬規則值得一併知道：

- **第一個 frame 必須是 `connect`**，任何非 JSON 或非 connect 的第一個 frame 都是硬關閉
- 有副作用的方法（`send`、`agent`）**要求冪等鍵**才能安全重試，伺服器保有短期的去重快取
- **事件不會重播**，客戶端在發現斷層時必須自行刷新
- 每台主機恰好一個 Gateway 控制單一的 Baileys session

## 整體來說

Agent loop 的設計主軸是**序列化加上可證明的寫入順序**：每個 session 一條車道、接受與完成分離、寫入帶 fencing token、hook 的擋下決定單向終端。

這些機制單獨看都不起眼，合起來回答的是同一個問題——**當使用者在 agent 還在跑的時候又說了一句話，誰的結果算數？** OpenClaw 的答案是：最新被接受的那個，而且舊的那個連寫都寫不進去。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：完整的五步執行序列與「接受即回傳 `runId`」的分離設計、Codex app-server 停止產出進度時的中止保護、**寫入者宣告柵欄**（`activeWriterRunId` / `expectedWriterRunId` 的交易內驗證）與外層的 SQLite 寫入佇列、Gateway 狀態目錄鎖、**內部 hook 與 plugin hook 的分工與完整 hook 表**、`toolsAllow` 在不支援 runtime 上拒絕而非忽略的行為、hook 的終止語意（block／cancel 單向不可撤銷）、`security.installPolicy` 與 `before_install` 的分工，以及協定層的不變式（首個 frame 必須是 connect、副作用方法需冪等鍵、事件不重播）。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Agent loop](https://docs.openclaw.ai/concepts/agent-loop) — 執行序列、佇列、寫入者宣告與 hook
- [Command queue](https://docs.openclaw.ai/concepts/queue) — 佇列模式與並行
- [Plugin hooks](https://docs.openclaw.ai/plugins/hooks) — hook API 與註冊
- [Hooks](https://docs.openclaw.ai/automation/hooks) — 內部 Gateway hook 的設定
- [Gateway architecture](https://docs.openclaw.ai/concepts/architecture) — 協定與不變式
