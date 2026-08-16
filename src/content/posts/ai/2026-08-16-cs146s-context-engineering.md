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

## MCP：四個名詞與一筆 token 帳

課程把 MCP 的基礎拆成 servers、clients、tools、transport 四塊。最短的解釋是：

- **server**：把某個系統的能力包成標準介面（GitHub、資料庫、你公司的內部 API）
- **client**：agent 這一側，負責連線與呼叫
- **tool**：server 對外暴露的單一動作，有名字、描述、參數 schema
- **transport**：兩邊怎麼講話（本機 stdio，或遠端 HTTP）

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

課程主題裡寫的是「Designing tools for agent ergonomics」。可以直接拿來當檢查表的幾條：

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

- Fall 2026 的 reading list 尚未公布，本文的材料是依課程主題自行挑的一手來源
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
