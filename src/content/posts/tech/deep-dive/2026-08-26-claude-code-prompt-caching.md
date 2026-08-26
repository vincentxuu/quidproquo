---
title: "Prompt caching 怎麼左右 Claude Code 的速度與帳單：prefix 匹配、快取作廢時機與命中率"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, prompt-caching, context, cost]
lang: zh-TW
tldr: "Claude Code 的 prompt caching 靠 prefix 完全匹配運作：命中時重讀計費約為標準 input 的 10%，但換模型、改 effort、開 fast mode、連斷 MCP server、整工具 deny 都會讓下一輪整段重算。TTL 預設五分鐘，訂閱方案的主對話用一小時。"
description: "拆解 Claude Code prompt caching 的運作機制：prefix 分層結構、哪些動作會作廢快取、CLAUDE.md 為什麼改了不即時生效、/compact 的計費成本，以及怎麼查自己的 cache hit rate。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 11
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching-en)

用 [Claude Code](https://code.claude.com/docs/en/prompt-caching) 用一陣子，你大概遇過這幾件事：session 越到後面回應越快、帳單卻沒有等比變貴；某天 `/model` 切個模型，那一輪突然卡很久；中途改了 CLAUDE.md，Claude 卻像沒看到一樣。這些現象的答案都是同一個——prompt caching。這篇依官方文件把機制和日常困惑逐一對起來。

## 為什麼 session 越用越快也越便宜

Claude Code 每一輪都會重送完整 context：system prompt、專案脈絡、所有先前的對話和工具結果，新內容接在最後。模型本身不記得上一輪的任何事。如果每次都從頭處理整串內容，長 session 會慢到不能用。

API 的解法是 **prefix 匹配**：拿每個請求的開頭去比對最近處理過的內容，完全一致的部分直接讀快取——重讀部分按 cached token 費率計費，大約是標準 input 的 10%——只有新增的尾端真的重新處理。因為每輪請求絕大多數內容跟上一輪相同，session 持續工作時命中率自然越來越高，這就是「越用越快」的來源。

Claude Code 特意把請求排成三層，越少變動的放越前面：

| 層 | 內容 | 什麼時候變 |
|----|------|-----------|
| System prompt | 核心指令、工具定義、output style | 工具組合改變，或升級 Claude Code |
| 專案脈絡 | CLAUDE.md、auto memory | Session 開始，或 `/clear`／`/compact` 之後 |
| 對話 | 你的訊息、回應、工具結果 | 每一輪 |

匹配是「完全一致才算」，所以前綴任何一個地方改了，它之後的全部都要重算。沒有 per-file 或分段快取這種東西。

## 換模型那一輪為什麼特別慢

**Model 是 cache key 的一部分**：每個模型有自己獨立的快取。`/model` 切換之後的第一個請求，即使內容一模一樣，也要把整段對話歷史當成未快取 input 重讀一遍——這就是那一輪特別慢的原因。之後新前綴寫進快取，又恢復正常。

同樣屬於 cache key 的還有 effort level 和 fast mode 的請求 header。另外 `opusplan` 設定在 plan mode 用 Opus、執行時用 Sonnet，所以每次進出 plan mode 都是一次模型切換，都會重開一次快取。

## 改了 CLAUDE.md 為什麼沒生效

CLAUDE.md 在 **session 開始時讀取一次**，之後存在記憶體裡。中途編輯它不會打掉快取，但也不會生效——Claude 繼續用開場載入的那個版本，新內容要等到下一次 `/clear`、`/compact` 或重啟才載入。

這不是 bug，是快取結構的直接結果：CLAUDE.md 位在專案脈絡層，如果每一輪都重新讀檔，前綴就會一直變動，整條對話的快取全部作廢。固定在開頭讀一次，是拿「改動延遲生效」換整個 session 的快取穩定。

有一個例外：子目錄裡的巢狀 CLAUDE.md 和帶 `paths:` frontmatter 的 rules，是在 Claude 第一次讀到符合條件的檔案時才載入——在那之前先改好，是來得及生效的。

## /compact 的成本

[Compaction](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management) 把訊息歷史換成摘要，對話層因此必然作廢——新歷史跟舊前綴沒有任何共用開頭。system prompt 層會保留，專案脈絡從磁碟重載，只有 CLAUDE.md 和 memory 沒變過才能命中快取。

產生摘要本身也是一次 API 請求。快取還熱的時候，這個請求照樣讀快取，所以 mid-session 的 `/compact` 實際成本遠低於 context 大小給人的直覺；但如果離開超過快取壽命再回來 compact，整段歷史要當未快取 input 全部重算——這就是 resume 舊 session 後跑 `/compact` 最貴的原因。

順帶一提，`/rewind` 比 `/compact` 友善得多：它是截斷回某個早已快取的前綴，下一輪直接命中舊快取條目，不用重建。

## 怎麼查看自己的 cache hit rate

API 在每個回應上都報兩個 token 數：

| 欄位 | 意義 |
|------|------|
| `cache_creation_input_tokens` | 本輪寫入快取的 token，按快取寫入費率計費 |
| `cache_read_input_tokens` | 本輪從快取讀取的 token，約標準 input 費率的 10% |

最直接的觀察方式是寫一支 [statusline script](https://code.claude.com/docs/en/statusline) 讀 `current_usage` 物件。read 相對 creation 的比例高，代表快取運作良好；creation 連續好幾輪居高不下，代表你的前綴一直在被改動。組織層級則可以走 OpenTelemetry exporter，它會按使用者與 session 回報這兩個數字。

快取壽命方面，TTL 有兩種：五分鐘與一小時，每次命中都會重置計時器。預設主對話在訂閱方案的額度內走一小時、其他情況走五分鐘；超過額度改用 usage credits 時會降回五分鐘。想自己控制，v2.1.242 之後可以用 `promptCacheTtl` 設定或 `CLAUDE_CODE_PROMPT_CACHE_TTL` 環境變數。

## 哪些行為會打掉快取，哪些不會

會讓下一輪部分或全部重算的動作：換模型、換 effort level、開 fast mode、連上或斷開 MCP server（工具定義沒被 defer 時）、啟停提供 MCP server 或 code intelligence 的 plugin、加一條裸工具名的 deny rule、升級 Claude Code。其中 MCP server 斷線可能不是你做的——stdio 行程退出、HTTP session 過期、自動重連，都會觸發。

不會打掉快取的動作：編輯 repo 裡的檔案（檔案內容只在被讀取時進 context，改了只會附加 system-reminder）、呼叫 skills 和 slash commands（指令以訊息形式接在對話尾端）、切換 permission mode、跑 `/recap`。

還有一個容易被忽略的範圍限制：快取實際上綁機器和目錄。system prompt 內嵌工作目錄、平台、shell 等資訊，同一個 repo 的不同 worktree 各自建立不同的前綴，互相讀不到快取。

## 學到的事

把這篇收斂成一句操作原則：**model 和 effort 在 session 開頭就選好，`/compact` 留在工作段落之間，中途少碰會改動前綴的設定**——命中率自然高。想知道 context window 本身怎麼管理，看[系列先前那篇](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management)；CLAUDE.md 和 memory 體系的完整規則，見 [.claude 目錄導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)。

## 參考資料

- [How Claude Code uses prompt caching — Claude Code Docs](https://code.claude.com/docs/en/prompt-caching.md) — prefix 分層結構、快取作廢清單、CLAUDE.md 與 output style 的延遲生效行為、TTL 表、statusline 查看方式的官方說明

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方 prompt caching 文件撰寫。
