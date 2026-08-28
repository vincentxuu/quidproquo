---
title: "Claude Code 的 context window 怎麼管理：自動載入內容、各功能成本與 compaction 三件套"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, context-window, compaction, token]
lang: zh-TW
tldr: "Claude Code 在你打第一個字之前就載入了 system prompt、MEMORY.md、CLAUDE.md、MCP tool 名稱和 skill 描述。本文拆解 session 開頭的自動載入內容、六類擴充功能各自的 context 成本，以及 /compact、/autocompact、autoCompactWindow 三層壓縮控制的用法。"
description: "Claude Code context window 管理：session 開頭自動載入哪些內容、CLAUDE.md／skills／MCP／subagents／hooks 各佔多少 context、compaction 三件套設定，以及 context 滿了時的錯誤訊息與對策。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 10
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management-en)

上一篇[拆解了 agentic loop](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)：harness 的三件事是提供工具、管理 context、維持執行環境。這篇深入第二件——context window 是這個 loop 的記憶體，裝滿了行為就開始走樣：skill 該觸發沒觸發、先前的指示被淡忘。要管好它，先知道它到底裝了什麼。

## Context window 裡裝了什麼

官方文件的定義很直接：context window 裝著 Claude 對這個 session 知道的一切——你的指示、它讀過的檔案、它自己說過的話，還有一批**永遠不會出現在你終端機上**的內容。你在畫面上看到的一行 `Read auth.ts`，背後可能是幾千個 token 的檔案內容進了 context。

換句話說，你看到的對話只是冰山露出水面的部分。管理 context 的第一課就是分清楚：哪些東西在載入、什麼時候載入、佔多少。

## Session 開頭：你還沒打字，東西已經進來了

跑 `claude` 之後、你送出第一個 prompt 之前，官方文件的互動模擬列出了一批自動進 context 的內容。這不是所有環境都固定相同的嚴格序列；output style、`--append-system-prompt`、外部設定和版本差異都可能讓實際內容不同。日常需要記的是這些類別：

| 類別 | 內容 | 來源 |
|------|------|------|
| System prompt | Claude Code 內建行為、工具使用與回應格式，可能包含 output style 或追加 system prompt |
| Auto memory | Claude 自己累積的筆記，載入 `MEMORY.md` 前 200 行或 25KB |
| Environment info | 工作目錄、平台、shell、是否 git repo、分支與近期 commit |
| MCP tool 名稱 | 只列名字讓 Claude 知道有什麼可用 |
| Skill descriptions | 每個可由模型觸發的 skill 描述 |
| 使用者層 CLAUDE.md | `~/.claude/CLAUDE.md`，跨專案偏好 |
| 專案 CLAUDE.md / rules | 專案指示、未設 `paths:` 的 rules；路徑限定規則按需載入 |

兩個細節值得記住。第一，MCP 的完整 tool schema **預設延遲載入**：tool search 預設開啟，Claude 平常只看得到工具名稱，需要某個工具時才把它的 schema 抓進來。第二，skill 只有描述常駐，全文要等實際用到才載入——所以 description 寫得準不準，同時決定了 context 成本和觸發正確率。memory 體系的分層細節（哪一層放什麼、怎麼 import）留給[專門那篇](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide)。

工作過程中還有一類按需載入：`.claude/rules/` 底下標了 `paths:` 的規則，只在 Claude 讀到符合 pattern 的檔案時才進 context。把語言特定或目錄特定的指引從 CLAUDE.md 挪到這裡，是官方建議的第一個瘦身手段。

## 各功能的 context 成本

[Extend Claude Code](https://code.claude.com/docs/en/features-overview) 給了一張完整的成本表：

| 功能 | 載入時機 | 載入什麼 | 成本 |
|------|---------|---------|------|
| CLAUDE.md | session 開始 | 全文 | 每次請求都在 |
| Skills | 開始＋使用時 | 描述→全文 | 低（描述常駐）* |
| MCP servers | 開始 | tool 名稱，schema 延遲 | 低，直到使用某個工具 |
| Code intelligence | 檔案編輯後＋按需 | type error、符號位置 | 低，還能減少其他檔案讀取 |
| Subagents | 啟動時 | 全新的獨立 context | 與主對話隔離 |
| Hooks | 觸發時 | 預設無（外部執行） | 零，除非回傳輸出 |

\* 表上有個星號值得單獨講：frontmatter 加 `disable-model-invocation: true` 的 skill 連描述都不進 context，直到你手動用 `/名稱` 叫它。有副作用的 skill（commit、部署、發訊息）適合這樣設——省 context，也保證只有你能觸發。

Hooks 那格的「除非回傳輸出」也有講究：exit code 0 的純 stdout 只進 debug log，不算 context；要用 `additionalContext` JSON 欄位回報資訊才會進去，而且**不截斷**，寫 hook 時輸出要保持精簡。

### Subagent：唯一能幫你省 context 的功能

表裡其他功能都是「往你的 window 裡加東西」，subagent 相反。它在自己的獨立 context window 裡工作：有自己的 system prompt、載入同一份 CLAUDE.md 和 MCP/skill 設定（但內建的 Explore 和 Plan agent 連 CLAUDE.md 都跳過），讀再多檔案都計在它頭上，最後只有摘要和一小段 metadata 回到主對話。官方模擬裡的例子：subagent 讀了 6,100 tokens 的檔案，主對話只收到 420 tokens 的結論。

一個反直覺的提醒：subagent 會**完整繼承**父 session 的所有 MCP tool 定義。接了很多 MCP server 時，subagent 可能第一輪都沒跑就先把自己的 window 塞掉一大塊——不用到的 server 先 `/mcp disable` 再派工。另外它不繼承主 session 的 auto memory，別指望它記得你上一輪教的偏好了。

## 滿了怎麼辦：compaction 三件套

Context 快滿時，Claude Code 會自動壓縮：把整段對話換成一份結構化摘要（保留你的需求和意圖、關鍵技術概念、動過哪些檔案、錯誤怎麼修的、待辦事項），騰出空間繼續工作。日常最常用的控制面有三層：

**`/compact`**——手動壓縮，可以帶焦點指令。`/compact focus on the auth bug fix` 會讓摘要保住你指定的部分，而不是讓自動流程猜什麼重要。開始長任務前主動壓一次，比等自動觸發更可控。

**`/autocompact`**——設定自動壓縮的觸發水位。`/autocompact 500k` 表示 context 到 500k tokens 就先壓，值會存進使用者設定的 `autoCompactWindow` 欄位；`/autocompact auto` 回復模型調校的預設值。

**`CLAUDE_CODE_AUTO_COMPACT_WINDOW`**——環境變數，優先權高於指令和設定，適合腳本和雲端環境。接受的範圍是 **100K 到 1M** tokens，寫 `500k`、`1M` 或純數字都行；另有 `--autocompact` 旗標可以只覆蓋一次啟動。不管設多大，都不會超過模型本身的 context window。

如果不是要壓整段對話，而是只想把某個切點之前或之後整理成摘要，官方現在也提供 `/rewind` 的 **Summarize from here** / **Summarize up to here**。它比較像局部整理工具，不是 auto-compact 水位設定的一部分。

不設任何值的話，Claude Code 在對話接近模型 context 上限時才壓縮。如果你的問題是 window 不夠大而不是太早壓：官方目前列出 Fable 5、Sonnet 5、Opus 4.6 之後版本、Sonnet 4.6 都支援 100 萬 token 的 context window。Sonnet 5 原生就是 1M；其他模型依方案和 provider 可能需要選 `[1m]` 變體，預設壓縮水位也會因模型而異。

### 壓縮之後留下什麼

並不是壓完全部重來。system prompt、CLAUDE.md、auto memory、plan mode 寫的計畫都會從原處重注入；最近修改的檔案最多重讀五個（超過 5,000 tokens 的檔案只給路徑參照）；你叫用過的 skill 全文也會重注入，每個上限 5,000 tokens、總計 25,000，最舊的先丟。反過來，skill 描述清單壓完**不會**重載——只有實際叫用過的 skill 保得住。路徑限定規則因為是跟著檔案讀取走的，重讀檔案時自然回來。

## 壓不動的時候：三個官方錯誤訊息

自動壓縮不是萬靈丹，error reference 列了三種狀況：

- **`Context limit reached · /compact or /clear to continue`**：請求已經超過上限。手動跑 `/compact` 或 `/clear`，或先用 `/context` 看是什麼在吃空間。
- **`Prompt is too long · automatic compaction failed: <原因>`**：自動壓縮跑了但敗在底層錯誤（模型不可用、認證失敗之類）。先修掉指名的錯誤，否則 `/compact` 也會敗在同一個地方。
- **`Error during compaction: Conversation too long`**：window 已經全滿，連摘要本身都放不下了。按兩次 `Esc` 退回幾則訊息再壓，不行就 `/clear` 開新 session——舊對話還在，`/resume` 找得回來。

第三種是最難看的死法：等到全滿才壓，連壓縮的餘裕都沒有。這也是 `/autocompact` 設低一點水位的價值——提前壓，永遠留有退路。

## 日常控制技巧

- **`/context`**：即時查看 context 用量分類明細與優化建議，包括載入了哪些 CLAUDE.md 和 memory 檔；加 `all` 可以看到每個 MCP tool 佔的 tokens。
- **切換不相關的任務就 `/clear`**：舊對話不只占位，每則請求都在為它付 token。
- **研究型任務丟給 subagent**：大量讀檔留在它的 window，主對話只收結論。
- **CLAUDE.md 控制在 200 行內**：參考資料挪到 skill 或 `.claude/rules/` 的 path-scoped 規則；不知道怎麼瘦，跑 `/doctor` 會給裁減建議。

## 學到的事

Context 管理的本質是一張收支表：session 開頭的自動載入是固定支出，每次讀檔和工具輸出是變動支出，subagent 是唯一能把變動支出轉帳出去的管道，compaction 三件套則是在快破產時整理債務。`.claude` 目錄裡各檔案的分工見[目錄導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)，memory 檔案怎麼寫才不吃 context 見[memory 體系篇](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide)。下一篇談的是這張表的另一面：[prompt caching](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching)——哪些動作會讓已快取的前綴失效，直接影響帳單。

## 參考資料

- [Explore the context window — Claude Code Docs](https://code.claude.com/docs/en/context-window) — session 開頭自動載入項目、各事件 token 成本的官方互動模擬，含 compaction 保留機制表與「When your context fills up」對策清單
- [Extend Claude Code — Claude Code Docs](https://code.claude.com/docs/en/features-overview) — CLAUDE.md／skills／MCP／code intelligence／subagents／hooks 六類功能的 context 成本比較表與載入時機說明
- [Model configuration — Claude Code Docs](https://code.claude.com/docs/en/model-config) — auto-compact window 的三層設定（`/autocompact`、`--autocompact`、`CLAUDE_CODE_AUTO_COMPACT_WINDOW`）、100K–1M 範圍與各模型預設閾值
- [Error reference — Claude Code Docs](https://code.claude.com/docs/en/errors) — `Prompt is too long`、`automatic compaction failed`、`Conversation too long` 三種 context 相關錯誤的意義與復原步驟

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（tool search 預設開啟、Sonnet 5 原生 1M context、compaction 三件套以 model-config 頁為準）。
- 2026-08-29：更新 context 啟動載入措辭，避免把互動模擬寫成固定順序；補齊 1M context 模型清單。
