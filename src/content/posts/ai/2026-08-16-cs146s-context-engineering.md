---
title: "CS146S Week 2：context 工程、RePPIT，與 MCP 的 98.7% 那一刀"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - context-engineering
  - mcp
  - prompt-engineering
  - ai-agent
  - spec-driven-development
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 3
tldr: "Fall 2026 把整整一週的 prompting 壓成這週的一節，換上 RePPIT（Research、Propose、Plan、Implement、Test）與 MCP。RePPIT 的兩條硬規則最值得抄：propose 一定要兩個方案、寫 code 的那個 instance 不准 review 自己的 code。MCP 那邊 Anthropic 量到把工具改成程式碼呼叫可以把 150,000 tokens 壓到 2,000。"
description: "拆解 Stanford CS146S Fall 2026 第二週「Advanced Context Engineering」：context 工程與 prompt 工程的分界、RePPIT 五步驟的實際操作規則、spec-driven development，以及 MCP 的伺服器／客戶端／工具／傳輸層與 code execution 的 token 帳。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-context-engineering-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第三篇，對應 Fall 2026 的第二週。

課程列的四條主題：進階 prompting 技巧與各自的適用時機、RePPIT 與 spec-driven development、MCP 基礎（servers、clients、tools、transport）、以及 tool ergonomics。兩堂課分別是「Advanced prompting + agentic dev frameworks」與「Full introduction to MCP and tool-calling」。

先說這週最大的訊號：**Fall 2025 有一整堂課叫「Power prompting for LLMs」，Fall 2026 它變成這週四條主題裡的第一條**。

## 為什麼 prompting 會被降級

Anthropic 在 [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 裡把這個轉向講得很清楚：

> Building with language models is becoming less about finding the right words and phrases for your prompts, and more about answering the broader question of "what configuration of context is most likely to generate our model's desired behavior?"

差別在於單輪與多輪。一次性的分類或生成任務，prompt 幾乎就是全部；一個跑幾十輪工具呼叫的 agent，system prompt 只佔它 context 的一小塊，剩下是工具定義、工具輸出、檔案內容、對話歷史。你調得再漂亮的一段 prompt，抵不過三十輪之後被塞進來的一堆雜訊。

這篇文章給的判準是全篇最實用的一句：

> good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome

背後的機制是 attention budget。Anthropic 引用 Chroma 的 [context rot 研究](https://research.trychroma.com/context-rot)指出，token 數上升時模型從 context 裡準確取回資訊的能力會下降，而且「this characteristic emerges across all models」。原因是 transformer 的 n² pairwise 關係被拉薄，加上訓練資料裡短序列本來就比長序列多。

實務結論：**context window 是預算，不是倉庫**。

## 課程實際教的 prompting 技巧表

Fall 2026 這週的第一條主題是「Advanced prompting techniques and **when each applies**」。Fall 2025 有一整堂 31 頁的 [Power prompting for LLMs](https://docs.google.com/presentation/d/1MIhw8p6TLGdbQ9TcxhXSs5BaPf5d_h77QY70RHNfeGs/edit) 在講這件事，「when each applies」的部分是這樣分的：

| 技巧 | 課程給的適用條件 |
|---|---|
| Zero-shot | 直接問，不給範例也不給支撐 |
| K-shot（in-context learning） | k 取 1、3、5（「some empirical results justify these numbers」）。適合推理步驟不多的任務、模型沒見過的 domain-specific API、要指定風格或命名慣例。**避免**用在知名函式庫與一般任務，也避免 over-constraining |
| Chain-of-Thought | multi-shot（寫出推理軌跡）／zero-shot（"Let's think step-by-step"）／用 `<reasoning>` 標籤。適合多邏輯步驟的程式與數學，「the workhorse for a lot of reasoning models」 |
| Self-consistency | 同一題取樣多次（通常搭 CoT）取最常見結果，等於一種 model ensembling |
| Tool use | 「One of the most important techniques for reducing hallucinations and enabling the autonomy of LLMs」 |
| RAG | 「When you @context in Cursor/Windsurf/etc this is utilizing RAG」 |
| **Reflexion** | 動作後加一句「Now critique your answer. Was it correct? If not, explain why and try again.」課程稱它是「workhorse of autonomous coding agents」，並說 **Reflexion 就是現代 coding IDE 產生完整 agentic 行為的方式** |

最後一條最值得注意：課程把 Reflexion（又叫 self-critique）擺在「為什麼 IDE 裡的 agent 看起來會自己反覆修正」的解釋位置上。它不是一個進階技巧，是那個行為的來源。

課程給的 prompt 檢查法也很省事：**「Give prompt to someone with minimal context and if they're confused an LLM will be too.」** 其餘幾條是用 `<log>`、`<error>` 這類標籤把 prompt 結構化、明講語言與tech stack、積極用 role prompting、以及把任務拆開。

## RePPIT：把一次 prompt 拆成五個里程碑

RePPIT 是課程講師 Mihail Eric 自己提的框架，他在 MLOps Community 寫過[完整說明](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster)（2026 年 6 月）。五個字母是 **Re**search、**P**ropose、**P**lan、**I**mplement、**T**est。

他對「為什麼要拆」的比喻很直白：

> One-shotting a feature there is like texting a contractor, "build me an office tower," and expecting move-in-ready floors.

每一步的操作細節比框架名稱有用得多：

**Research**——先讓模型把現況寫成一份 100–300 行的 Markdown，只描述不建議。文章特別交代這份文件**每次都重跑、不要 commit**：「A live read beats a cached one, like a current map versus a printout from last year.」這一步是你第一個人工檢查點，也是最便宜的除錯點。

**Propose**——固定要**兩個**方案，不多不少。理由是：「ask for more, and the extras are just reskins of the first」。兩個逼出真正不同的路線；每個方案回來的格式固定：overview、key changes、trade-offs、validation、open questions。

**Plan**——把選定方案填進 design doc 模板，含功能與非功能需求、關鍵決策與理由、資料模型、整合點、以及**明確列出「會動」與「不會動」的檔案**。文章提醒跑這步之前先清 context，免得第二步的來回討論污染判斷。

**Implement**——到這裡模型幾乎沒有猜測空間了。

**Test**——這步有一條鐵律，值得單獨抄下來：

> do not let the instance that wrote the code review it. It will defend its own choices if it is biased toward an initial implementation, like proofreading your own writing and reading what you meant to type.

換一個模型家族，或者把 context 完全清掉，讓 reviewer 自己重建理解。文章補了一句：harness 內建的 review 模式也有同樣的疑慮。

至於「2-3X faster」這個數字，它出自作者本人的文章，沒有獨立第三方量測，讀的時候要當成經驗宣稱。

spec-driven development 是同一個方向的另一種說法。Fall 2025 的 Week 3 指定過 [Specs Are the New Source Code](https://blog.ravi-mehta.com/p/specs-are-the-new-source-code)，論點是規格取代程式碼成為你真正在維護的東西。RePPIT 的 Plan 步驟就是這件事的具體形狀。

課程自己也給了一份 design doc 模板（Fall 2025 Week 3 的 [From first prompt to optimal IDE setup](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit)），八個欄位，可以直接拿來當 RePPIT Plan 步驟的表格：

| 欄位 | 課程的說明 |
|---|---|
| Goal | 這個改動的目的 |
| Definitions | LLM 需要先知道哪些前提 |
| Plan | 高層次的實作拆解 |
| Source files being changed | 哪些部分相關、為什麼 |
| Test cases | 測試怎麼做 |
| Edge cases | 有哪些特殊情況要顧 |
| Out-of-scope | 什麼**不該**被改動 |
| **Extensions** | 之後會有哪些相關改動，好讓 LLM 預留設計空間、不要走捷徑 |

最後那欄是我自己不會想到的。**Extensions 的作用是防走捷徑**——先告訴模型未來會長什麼樣，它才不會寫出一個只滿足當下需求、之後必須整段重來的實作。課程對前置說明也很直接：簡單改動不必費心 prompt，複雜任務「you're going to become a product manager」。

## MCP：四個名詞與一筆 token 帳

課程把 MCP 的基礎拆成 servers、clients、tools、transport 四塊。[Fall 2025 的 MCP 課堂](https://docs.google.com/presentation/d/1zSC2ra77XOUrJeyS85houg1DU7z9hq5Y4ebagTch-5o/edit)給的術語比多數文件精確——它把 **host** 跟 **client** 分開：

- **Host**：Cursor、Claude Desktop 這類應用本身
- **MCP Client**：嵌在 host 裡的函式庫，**每個 server 維持一個 stateful session**
- **MCP Server**：某個工具前面的輕量包裝
- **Tool**：可呼叫的函式（可能是資料源，也可能是 API）

一次呼叫的完整流程：client 對 server 送 `tools/list`（你會做什麼？）→ server 回一段 JSON 描述每個工具（name、summary、JSON schema）→ host 把那段 JSON 注入模型的 context → 使用者的 prompt 觸發模型，模型送出結構化的 tool call → server 執行，對話繼續。傳輸層在 Fall 2025 時是 **stdio 與 SSE**（規格後來演進，實作前要查當下文件）。

課程解釋 MCP 存在的理由用的是連接器數量：整合一個第三方 API 你要自己吞掉文件差、格式不一致、認證與錯誤處理，乘上幾百個 API、再乘上多個 LLM app，就是 **N×M 個連接器**。MCP 用 JSON-RPC 統一輸出格式，把它變成 **M+N**。

還有一條系譜是我沒有的：課程說 MCP **「extends from Language Server Protocols」**，差別在於「allows for proactive agentic workflows rather than purely reactive ones as in LSP」。LSP 是編輯器問、語言伺服器答；MCP 讓模型主動發動。順帶一提，LSP 正是 VSCode 在 2015 年帶進來的東西——課程在 IDE 那一堂把它標成「the conceptual inspiration for MCP」。

[MCP](https://modelcontextprotocol.io/) 從 2024 年 11 月推出到現在的實際狀況是：Anthropic 自己說「the industry has adopted MCP as the de-facto standard for connecting agents to tools and data」。

但真正該從這週帶走的是那個代價。Anthropic 在 [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) 裡量了兩種浪費：所有工具定義在開場就全塞進 context，以及每個中間結果都要穿過模型一次。他們舉的例子是把 Google Drive 的會議逐字稿寫進 Salesforce——同一份逐字稿在 context 裡流過兩次，「For a 2-hour sales meeting, that could mean processing an additional 50,000 tokens.」

解法是把 MCP 工具呈現成檔案系統上的程式碼 API，讓 agent 寫程式去呼叫，而不是一個個工具呼叫：

```
servers
├── google-drive
│   ├── getDocument.ts
│   └── index.ts
└── salesforce
    ├── updateRecord.ts
    └── index.ts
```

量出來的差距是：「This reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%.」Cloudflare 用 [Code Mode](https://blog.cloudflare.com/code-mode/) 這個名字得到同樣的結論。

代價那一段 Anthropic 也寫了：跑 agent 產生的程式碼需要沙箱、資源上限與監控，「These infrastructure requirements add operational overhead」。這條線一路連到 [Week 9 的 MCP portal 與 gateway](/posts/ai/2026-08-16-cs146s-ai-native-team)。

## tool ergonomics：給 agent 用的工具怎麼設計

課程主題裡寫的是「Designing tools for agent ergonomics」。Fall 2025 的 MCP 課堂用三條限制收尾，而且這三條到今天都還成立：

> - Agents don't handle many tools very well today
> - APIs eat up your context window quickly
> - **Design APIs to be AI-native rather than rigid**

課堂上還討論了 Cursor 對工具數量設的硬上限——這不是產品缺陷，是前兩條的直接後果。

可以直接拿來當檢查表的幾條：

- 一個工具做一件事，功能不要重疊到讓模型難選
- 參數名稱要能自我解釋，不要 `opts`、`data`、`payload`
- 回傳值要 token-efficient——回一萬列的 CSV 不如回篩選後的五列加一個總數
- 錯誤訊息寫給模型看：說清楚哪裡錯、下一步該怎麼修
- 少即是多：工具越多，選錯的機率越高

## 長任務的三招

同一篇 context 工程文列了三個處理超過 context window 的長任務的方法，這三招也是後面幾週的伏筆：

| 方法 | 做什麼 | 適合 |
|---|---|---|
| Compaction | 快滿的時候摘要整段對話，用摘要重開一個 context | 需要大量來回的任務 |
| Structured note-taking | 把進度寫到 context 外的檔案（`NOTES.md`、todo list） | 有明確里程碑的迭代開發 |
| Sub-agent | 子 agent 各自用乾淨 context 深挖，只回傳結論 | 平行探索、研究分析 |

sub-agent 那條有個具體數字：子 agent 可能燒掉數萬 token，但回傳的是「a condensed, distilled summary of its work (often 1,000-2,000 tokens)」。這個比例就是 sub-agent 的全部價值——它替主線擋掉了中間過程。

## 會過期的東西

- Fall 2026 的 reading list 尚未公布；本文的課程內容取自 Fall 2025 同主題的公開投影片，其餘為自行挑選的一手來源
- 課程投影片講 MCP 傳輸層時是 stdio 與 SSE，規格之後有演進
- 「2-3X faster」與「98.7%」分別出自框架作者與工具供應商，都是自家量測
- MCP 的傳輸層規格仍在演進，寫作當下以官方文件為準

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 2 主題與講題
- [RePPIT: A Framework to Ship Production Code 2-3X Faster](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) — Mihail Eric，MLOps Community，2026-06-02
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering，2025-09-29
- [Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp) — Anthropic Engineering，2025-11-04
- [Code Mode: the better way to use MCP](https://blog.cloudflare.com/code-mode/) — Cloudflare
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io/) — servers / clients / transports 規格
- [Context Rot: Understanding Degradation in AI Context Windows](https://research.trychroma.com/context-rot) — Chroma Research，Fall 2025 Week 6 指定讀物
- [Specs Are the New Source Code](https://blog.ravi-mehta.com/p/specs-are-the-new-source-code) — Fall 2025 Week 3 指定讀物
- [Power prompting for LLMs](https://docs.google.com/presentation/d/1MIhw8p6TLGdbQ9TcxhXSs5BaPf5d_h77QY70RHNfeGs/edit) — Fall 2025 Week 1 課堂投影片，prompting 技巧與適用條件
- [To MCP and Beyond](https://docs.google.com/presentation/d/1zSC2ra77XOUrJeyS85houg1DU7z9hq5Y4ebagTch-5o/edit) — Fall 2025 Week 2 課堂投影片，host/client/server/tool 與 LSP 系譜
- [From first prompt to optimal IDE setup](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit) — Fall 2025 Week 3 課堂投影片，八欄位 design doc 模板
