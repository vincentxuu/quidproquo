---
title: "Stanford CS329Z 導讀 Week 3：工具接進來，框架換上去——HW1 開工"
date: 2026-09-11
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 4
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 19
tldr: "Week 3 週一用 MCP 規範把工具介面標準化，週三用 DSPy 論文把手刻管線換成可編譯、可優化的程式；同一週 HW1 發布，Part A 手刻與 Part B 框架重寫的對照 dispute 正式開打。"
description: "帶讀 Stanford CS329Z Week 3 兩篇主讀物：MCP 規範的主從架構與安全原則，DSPy 把 prompt 模板變成可編譯管線的設計，以及它們如何對應 HW1 的 Part A 與 Part B。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en)

Week 3 是轉折週。週一（10/5，Tool Use & Function Calling）的主讀物是 [MCP 規範](https://modelcontextprotocol.io/specification/2025-06-18)：工具從此有統一插頭，不用每接一家重寫一遍。週三（10/7，Frameworks & Agent Design）的主讀物是 Khattab 等人的 [DSPy](https://arxiv.org/abs/2310.03714)（ICLR 2024）：prompt 模板從手工藝變成可編譯、可優化的程式。同一個週一，[HW1 發布](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，Part A 手刻與 Part B 框架重寫的對照正式開打，週五（10/9）還要交 project proposal。

## MCP：工具的統一插頭

規範的靈感來自 LSP（Language Server Protocol）：當年每個編輯器配每種語言都要重寫一遍，LSP 統一之後生態才爆發。MCP 想對 AI 工具做同樣的事，角色拆三層。Host 是 LLM 應用，負責建 Client、收攏 context、執行同意與安全政策。Client 是裡面的連接器，一個 Client 只連一台 Server。Server 提供 context 與能力，全走 JSON-RPC 2.0。隔離是寫死的設計原則：Server 拿不到完整對話，也看不見別台 Server。開什麼能力，初始化先做 capability negotiation，沒宣告就不能用。

Server 端三種能力各有控制者：Prompts 是使用者觸發的模板，Resources 由應用端掛載管理，[Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)由模型決定呼叫。[Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) 的 ACI 在這裡有了標準形狀：工具定義不再是各家 API 的方言。Client 端反過來也能開三種能力給 server。[Sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/sampling)是 server 發起的 agent 行為，模型偏好只供參考，最後由 client 選型。[Roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots)是可活動的檔案邊界，現行規範限 file:// URI。[Elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)是向使用者要結構化資訊的本版新能力，只收扁平基本型別，禁收敏感資訊。

安全章節值得單獨讀。工具就是任意程式碼執行，規範開宗明義這麼處理。工具 annotations 一律視為不可信，除非來自可信 server。呼叫要留人類否決權，敏感操作先經使用者確認，參數送出前先攤開看。sampling 的請求與回應都要能攤開給人審，roots 暴露前也要先問過使用者。協議管格式，同意流是實作者的責任——這句話 HW1 寫 code sandbox 章節時會回來。

## DSPy：prompt 模板的終結

DSPy 論文的開場白很嗆：現在的模型管線全是硬編碼提示模板，靠反覆試誤攢出來的長字串。它要的是系統化方法：把管線抽象成文字轉換圖，模型經由**宣告式模組**呼叫。機制有三層。signature 是自然語言的輸入輸出宣告（例如 `user_question -> search_query`），只說要什麼、不說怎麼哄模型。module 是帶參數的簽名實現：內建 ChainOfThought 其實就是在輸出前插一個 rationale 欄位再交給 Predict，論文只用十餘行寫完。teleprompter 是優化器，拿訓練輸入與驗證指標回填每個模組的示範。模組是帶參數的，會自己學——自己造示範、收集示範，把提示、微調、擴增、推理技巧組起來用。

寫法上，使用者只寫 signature 加一個目標指標，編譯器分三階段調校。先產生候選示範：跑管線、只留下通過指標的軌跡。再用隨機搜尋或 Optuna 挑示範組合，必要時改寫程式結構，例如把多份編譯結果 ensemble 投票。兩個案例研究的數字都可重現。[GSM8K](https://arxiv.org/abs/2110.14168) 上幾行 DSPy 讓 GPT-3.5 衝上八成二正確率。[HotPotQA](https://arxiv.org/abs/1809.09600) 的兩跳檢索管線 ensemble 後，在測試集答對四成五六（論文註明該格只評一半測試集）。只用 200 條標註、外加無標註問題蒸餾出的 770M T5，在開發集拿下近四成正確率。小模型加好系統，打大模型加爛系統——[Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems) 的論點在這裡有了可重現的數字。

## 兩篇的關係：抽象層級的選擇題

週三課程標題就點名了：what frameworks abstract vs. what you built from scratch。LangChain、LangGraph、LlamaIndex 各自選了不同的抽象位置；DSPy 選的是「連 prompt 都不讓你手寫」。Week 2 Anthropic 的煞車皮在這裡依然有效：框架省的是起步時間，付的是除錯能見度。HW1 Part B 要你寫的正是這篇反思：同一個 agent，手刻版和 DSPy 版差在哪，框架替你藏了什麼、也替你決定了什麼。

## 怎麼做：本週就把 Part B 縮小版跑完

**怎麼做**：拿 Week 2 的手刻 RAG，只抽其中一段（例如 query 生成）用 DSPy signature 重寫。給 20 個問題當驗證集、正確率當指標，編譯一次，對照手刻版的分數和你花的時間。重點不是分數贏多少，是寫下三行：框架替你做了什麼決定、哪個決定你不同意、什麼情況下你會換回去。這三行就是 Part B 反思題的草稿，提案書（週五截止）的方法論段落也能用。

## 它在課程裡的位置

Week 3 發 HW1（10/30 截止），Week 4 的 ReAct 把迴圈形狀定下來後 Part A 就能收尾。MCP 往後只會越來越重要：Week 5 的多智慧體協作、Week 9 的 coding agent（SWE-agent、Claude Code 架構），談的都是標準介面上的分工。讀規範時記住它的定位句：MCP 管格式，同意與信任是實作者的功課。

## 本週 Course Material 對照

- 週一 10/5 Tool Use & Function Calling：主讀物 MCP 規範（本文已導讀）；本週無 additional readings。
- 週三 10/7 Frameworks & Orchestration：主讀物 DSPy 論文（本文已導讀）；本週無 additional readings。
- 課表原文：[CS329Z 官網 Week 3](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[Week 2：先分清 workflow 和 agent](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[Week 1：別再只調模型了](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)、[Khattab et al., DSPy, ICLR 2024](https://arxiv.org/abs/2310.03714)
- 工具：[DSPy 官網](https://dspy.ai/)、[LangChain](https://www.langchain.com/)、[LlamaIndex](https://www.llamaindex.ai/)
