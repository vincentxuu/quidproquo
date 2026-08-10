---
title: "RAG 的三種形態與 evaluator paradox"
date: 2026-08-10
category: ai
type: deep-dive
tags: [rag, retrieval, ai-agent, agentic-ai, embedding]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 8
tldr: "Standard RAG 取錯 chunk 就答錯，而且沒有任何機制會發現。Agentic RAG 補上自我檢查，但代價是 evaluator paradox——自我修正能力的上限，就是那個做評估的 LLM 判斷相關性的能力。"
description: "Standard RAG、Graph RAG、Agentic RAG 三者的機制與取捨，Agentic RAG 的 evaluator paradox 與 overcorrection，以及 Perplexity、Dropbox、Uber、Yelp 四家在檢索上的具體工程做法。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

系列最後一篇回到檢索。[第一篇](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)給的判準是「答案在文件裡 → RAG；答案需要對其他系統動手 → Agent」，但 RAG 自己也已經分化成三種形態，而且第三種把 agent 的迴圈搬進了檢索裡。

## 三種形態的機制與取捨

| | 機制 | 取捨 |
|---|---|---|
| **Standard RAG** | query → embedding → 向量庫取 top-K → LLM 生成 | 快又便宜，但**取錯 chunk 就答錯，而且沒有任何機制會發現** |
| **Graph RAG** | 先分類 query：具體問題走 local search（向量找實體 → 沿知識圖譜蒐集關聯 context）；廣泛問題走 global search（不做向量搜尋，分批載入 community reports 讓 LLM 評分排序） | 建置貴、更新慢。適合法律、法遵、生醫這類結構化知識 |
| **Agentic RAG** | 推理 agent 拆子問題、選來源 → 多來源檢索 → **另一個 agent 檢查檢索到的內容有沒有回答問題，沒有就重新檢索** → 綜合 | 更強更彈性，但慢、貴、難 debug。適合需要多步推理與自我修正的問題 |

Standard RAG 那一列的後半句是關鍵：**沒有任何機制會發現。** 它不會知道自己取錯了，因為它沒有任何東西可以拿來比對。生成階段的 LLM 拿到什麼就用什麼，於是錯誤的檢索會被包裝成一個流暢、有引用、看起來很可信的答案。

Agentic RAG 就是為了補這個洞——加一個檢查步驟。但這一步有它自己的問題。

## evaluator paradox

自我評估這一步，是**用一次 LLM 呼叫去監督另一次 LLM 呼叫**。

所以整個系統的自我修正能力有一個上限：**那個做評估的 LLM 判斷「這段檢索有沒有回答問題」的能力。** 如果它判斷不出來，多加的那一輪只是多花錢多花時間。這不是實作品質的問題，是架構本身的天花板。

還有一個相關的失效模式叫 **overcorrection**：agent 在評估時丟掉了其實有用的檢索結果、繼續去找「更好的」，最後拿到比第一次更差的答案。加了自我修正不等於單調變好。

這跟[第三篇](/posts/ai/2026-08-10-agent-context-memory-failure)那個記憶的思想實驗結構一樣——一個會自信地評估自己的系統，可能輸給一個知道自己不確定的系統。

## 四家的具體做法

**[Perplexity](https://blog.bytebytego.com/p/how-perplexity-built-an-ai-google)：五階段管線。** 這篇還有個有意思的產品史細節——他們原本在做「英文轉資料庫查詢」，ChatGPT 發表後發現外界最大的抱怨是**沒有來源**，而自家原型剛好解了這題，於是**放棄四個月的既有工作**全轉去做答案引擎。

**[Dropbox Dash](https://blog.bytebytego.com/p/how-dropbox-built-an-ai-product-dash)：資料的三種難處。** 多樣性（每種格式要各自的語意抽取邏輯）、破碎性（散在 Gmail / Slack / Notion / Jira，**各有各的權限規則**）、多模態。第二項最容易被低估——跨系統檢索不只是接 API，是要在檢索階段就正確套用每個來源的權限模型，否則就是[第五篇](/posts/ai/2026-08-10-agent-security-harness-layer)講的那種洩漏。

**[Uber Finch](https://blog.bytebytego.com/p/how-uber-built-a-conversational-ai)：用單表 data mart 避免 join。** 與其讓 LLM 生成複雜的多表查詢，不如先把資料整理成寬表。另外**語意層用 OpenSearch 存欄位名與欄位值的自然語言別名**——使用者說「上個月的取消」，系統要知道那對應到哪個欄位的哪個值。

**[Yelp](https://blog.bytebytego.com/p/how-yelp-built-yelp-assistant)：citation 要做解析與驗證兩步。** 模型輸出 `[S1][S3]` 這類標記後，先解析回原始來源，再**驗證每個標記都對應到真的可檢索的內容**。少了第二步，你會得到看起來有引用、但引用指向不存在東西的答案——這比沒有引用更糟，因為它更可信。

## 怎麼知道檢索有沒有壞

不同元件要用不同方式評估，混為一談就抓不到問題：

| 對象 | 主要評估方式 |
|---|---|
| **LLM** | 評最終答案（LLM-as-judge） |
| **RAG** | **要分開評檢索與生成**——檢索對了但生成錯，跟檢索就錯了，是兩個問題 |
| **編碼 agent** | 主要靠跑測試（code-based） |
| **多 agent** | 評的是協調與角色遵守，混用 code test + LLM judge + 人工 |

原文那句總結很實在：**「管線每多一個元件，就多一個出錯的地方，也多一件 eval 必須抓到的事。」** 這句話反過來也是選型的依據——如果你的 eval 抓不到 Graph RAG 或 Agentic RAG 多出來的失敗模式，那多出來的複雜度只會讓 debug 更難，不會讓答案更好。

回到系列開頭那條判準：多數情況下，**先把 Standard RAG 的檢索品質做好，比升級到更複雜的變體划算**。Anthropic 在《Building Effective Agents》講過同一件事——對很多應用而言，把單次 LLM 呼叫加上檢索與範例優化好，通常就夠了。

## 本系列

1. [概念界線：agent、workflow、RAG、MCP 到底差在哪](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)
2. [模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
3. [context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
4. [上線才是工作的開始：企業案例橫向讀](/posts/ai/2026-08-10-enterprise-agent-case-studies)
5. [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
6. [引用之前：把 19 份一手來源查一遍](/posts/ai/2026-08-10-verifying-agent-numbers)
7. [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
8. **RAG 的三種形態與 evaluator paradox**（本篇）

## 參考資料

- [ByteByteGo — EP220: RAG vs Graph RAG vs Agentic RAG](https://blog.bytebytego.com/p/ep220-rag-vs-graph-rag-vs-agentic)
- [ByteByteGo — How Agentic RAG Works?](https://blog.bytebytego.com/p/how-agentic-rag-works)
- [ByteByteGo — How Perplexity Built an AI Google](https://blog.bytebytego.com/p/how-perplexity-built-an-ai-google)
- [ByteByteGo — How Dropbox Built an AI Product Dash with RAG and AI Agents](https://blog.bytebytego.com/p/how-dropbox-built-an-ai-product-dash)
- [ByteByteGo — How Uber Built a Conversational AI Agent For Financial Analysis](https://blog.bytebytego.com/p/how-uber-built-a-conversational-ai)
- [ByteByteGo — How Yelp Built "Yelp Assistant"](https://blog.bytebytego.com/p/how-yelp-built-yelp-assistant)
- [ByteByteGo — MCP vs A2A vs ACP](https://blog.bytebytego.com/p/mcp-vs-a2a-vs-acp-how-ai-agents-actually)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
