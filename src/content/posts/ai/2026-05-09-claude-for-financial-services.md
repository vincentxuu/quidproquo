---
title: "Claude for Financial Services：拆解 Anthropic 的多 Agent 參考實作"
date: 2026-05-09
category: ai
tags: [claude, agents, mcp, rag, langgraph, multi-agent]
lang: zh-TW
tldr: "Anthropic 開源了 12 個金融業 Agent + 11 個 MCP connector，最值得抄的不是 Agent 本身，而是『同一份 prompt 雙 runtime』和『純檔案擴充』的分層設計。"
description: "拆解 anthropics/financial-services repo 的雙部署模式、Named Agent 切分邏輯、MCP connector 抽換哲學，並對照 quidproquo 的 LangGraph planner→research→writer→critic 架構，提出可借鏡的設計取捨。"
draft: false
---

Anthropic 在 2026 年初放出了 [`anthropics/financial-services`](https://github.com/anthropics/financial-services)：一個專為投行、研究、PE、財管、基金行政打造的 Agent 參考實作集。17K star、12 個 Named Agent、11 個資料商 MCP connector，文件全部用 markdown / YAML 寫，沒有 build step。

把它當「金融業 demo」看會錯過重點。這個 repo 真正值得讀的是它的**分層設計**——同一份 prompt 跑在兩個 runtime、Agent 透過檔案組裝、connector 可抽換。任何在做 RAG 或多 Agent 系統的團隊，都能從這裡偷到結構上的決定。

## 雙部署模式：同一份 prompt，兩種 runtime

整個 repo 的第一個關鍵設計是「runtime 與 prompt 解耦」。

```
plugins/
├── agent-plugins/           # 12 個 Named Agent 的 prompt + skill
├── vertical-plugins/        # 依垂直業務打包的 skill bundle
└── managed-agent-cookbooks/ # Headless 部署 recipe
```

同一個 Pitch Agent，可以用兩種方式部署：

- **Cowork Plugin**：使用者在 Claude Web UI 的 Settings → Plugins 貼上 GitHub URL，即時對話式使用
- **Managed Agents API**：透過 `POST /v1/agents` headless 跑，搭配 `scripts/deploy-managed-agent.sh` 一鍵部署到後端服務

兩種模式**共用同一份 system prompt 與 skill 定義**。你選的是 runtime 環境，不是重寫 Agent。

這個設計的取捨很清楚：他們把「Agent 的人格與能力」（prompt + tools）和「Agent 的執行方式」（互動 vs batch、有狀態 vs 無狀態）切開。對照之下，多數團隊的做法是 chat endpoint 一份 prompt、批次 job 又寫一份，兩邊行為慢慢漂移，最後沒人敢動。

對 RAG 系統的啟示：你的 `chat.ts` SSE endpoint 跟未來可能要暴露的 `POST /api/agent/run` batch endpoint，應該共用同一份 graph 定義。差別只在 stream output 的 transport，不在 agent 邏輯本身。

## 12 個 Named Agent：以工作流為切分單位

repo 把 Agent 分成四個業務類別，但更值得注意的是切分粒度——每個 Agent 都是 **end-to-end 工作流**，不是單一技能。

| 類別 | Agents |
|------|--------|
| Coverage & Advisory | Pitch Agent、Meeting Prep |
| Research & Modeling | Market Researcher、Earnings Reviewer、Model Builder |
| Fund Admin & Finance Ops | Valuation Reviewer、GL Reconciler、Month-End Closer、Statement Auditor |
| Ops & Onboarding | KYC Screener |

例如 `GL Reconciler`（總帳對帳）不是「一個會比對數字的工具」，而是涵蓋「拉資料 → 分類差異 → 標記異常 → 產出對帳報告」整段流程的 Agent。每個 Named Agent 對應一個分析師職責，不是一個 function。

對照常見的做法——把 Agent 切成 `summarizer`、`extractor`、`reranker` 這種**技能單元**——Anthropic 選的是**職責單元**。技能單元適合做 library 給其他 Agent 組合；職責單元適合直接交付給業務使用者。兩種切分都對，但目標讀者不同。

如果你正在設計多 Agent 系統，這是要先決定的事：你的 Agent 是「給其他 Agent 用的零件」，還是「給人用的同事」？

## 11 個 MCP Connector：資料層可抽換

整套架構的另一個關鍵是 **MCP（Model Context Protocol）連接器**全部外掛化。

- **市場數據**：Daloopa、FactSet、S&P Global、LSEG、Morningstar
- **研究**：Moody's、PitchBook、MT Newswires、Aiera
- **基礎設施**：Egnyte（文件儲存）、Chronograph（PE portfolio tracking）

設計哲學寫在 README：「換掉 connector 指向自家資料源就能客製化，不用改 Agent 本身」。

這對應到 RAG 系統的 retriever 抽象。你的 `searchBlogPosts` / `searchDocs` / `getPostDetail` 工具應該是**可替換的綁定**，不是 Agent 寫死的依賴。當你哪天要換掉 Vectorize 改用 pgvector，或從靜態 markdown 改接 Notion API，理想狀態是只動 tool implementation，不動 graph。

實務上很難做到完全乾淨，但這個 repo 證明了：只要 Agent 是用 markdown / YAML 描述「我要哪種資料」而不是「我要呼叫哪個 SDK」，抽換成本就會壓得很低。

## 純檔案擴充：沒有 build step 的工程哲學

repo 全部用 markdown + YAML 寫成。Agent 定義是 markdown、skill manifest 是 YAML、deploy script 是 bash 一行。沒有 TypeScript、沒有 webpack、沒有 schema validation library。

```
plugins/agent-plugins/pitch-agent/
├── system.md          # Agent prompt
├── skills/            # 可呼叫的 skill manifest
└── manifest.yaml      # Plugin metadata
```

這個選擇背後的邏輯是：**Agent 行為是 prompt 工程，不是傳統工程**。你不需要 type system 來保證 prompt 正確，你需要的是低門檻、可 diff、可 PR 的格式，讓非工程師也能貢獻。

代價是 runtime 沒有靜態檢查，prompt 寫錯只能跑起來才知道。但對於這類「行為由 LLM 詮釋」的系統，過度工程化反而會變成阻礙。Anthropic 顯然押的是「降低貢獻門檻」這一邊。

## 對照 quidproquo 的 LangGraph Multi-Agent

我自己的 RAG 系統用 LangGraph 串了 `planner → research → normalize_results → writer → critic → related` 這條 graph，每個 node 是一個 agent function。讀完 `financial-services` 後，有三個地方值得重新檢視。

**第一，graph 結構應該獨立於 transport。** 我目前 `src/pages/api/chat.ts` 直接呼叫 graph 並串 SSE，graph 邏輯跟 streaming 黏在一起。如果未來要做 batch evaluation 或 cron job，會被迫複製一份。應該把 graph 抽出去，chat endpoint 只負責 stream 包裝。

**第二，critic 的職責切分還可以更狠。** 我現在 `critic-routing.ts` 只判斷「要不要 retry」，但 Anthropic 的 `Statement Auditor` 是一個**完整的審核 Agent**，會輸出結構化問題清單。把 critic 從「routing 函式」升級到「auditor agent」，可能讓系統更可解釋——但代價是多一輪 LLM call，要看 latency 預算。

**第三，retriever 應該對應到 MCP connector 模型。** 我目前 `searchBlogPosts` / `searchDocs` 是寫死的 D1 + Vectorize 呼叫。改成 MCP-style 介面之後，未來要接外部資料源（例如其他人的部落格、Hacker News、論文資料庫）就只是新增一個 connector，graph 不用改。

## 整體架構（對照圖）

```
┌─────────────────────────────────────────────────────────┐
│  anthropics/financial-services                          │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │ Cowork Plugin│    │ Managed API  │   ← Runtime 層   │
│  └──────┬───────┘    └──────┬───────┘                  │
│         └──────┬─────────────┘                          │
│                ▼                                        │
│      ┌──────────────────┐                              │
│      │ Agent Definition │   ← Prompt + Skill (markdown)│
│      └────────┬─────────┘                              │
│               ▼                                        │
│      ┌──────────────────┐                              │
│      │   MCP Connectors │   ← 資料層 (可抽換)          │
│      └──────────────────┘                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  quidproquo RAG (對照)                                  │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │ /api/chat SSE│    │  (未來) batch│   ← Runtime 層   │
│  └──────┬───────┘    └──────┬───────┘                  │
│         └──────┬─────────────┘                          │
│                ▼                                        │
│      ┌──────────────────────────┐                      │
│      │ LangGraph                │                      │
│      │ planner→research→writer  │   ← Graph 定義      │
│      │ →critic→related          │                      │
│      └──────────┬───────────────┘                      │
│                 ▼                                      │
│      ┌──────────────────────────┐                      │
│      │ search-posts/docs/detail │   ← 資料層 (待抽換)  │
│      └──────────────────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

## 整體來說

`anthropics/financial-services` 不是「Claude 在金融業多厲害」的 demo，是 Anthropic 對「企業級 Agent 系統該長什麼樣」的具體主張：

- **Agent 是工作流，不是技能**——以業務職責為單位切分
- **Prompt 與 runtime 解耦**——Cowork 與 API 共用定義
- **資料層必須可抽換**——MCP connector 是強制設計
- **降低貢獻門檻優先於型別安全**——純檔案、無 build step

對在做 RAG / 多 Agent 的團隊來說，最值得偷的不是金融 prompt 本身，而是這套**分層思維**。下一次設計 graph，先問：runtime 跟 graph 是不是綁在一起？retriever 是不是寫死的？這些 Agent 是給人用還是給 Agent 用？

把這幾個問題答清楚，再開始寫程式。

## 參考資料

- [anthropics/financial-services GitHub repo](https://github.com/anthropics/financial-services)
- [Claude Managed Agents API](https://docs.claude.com/en/api/agents)
- [Model Context Protocol (MCP) 官方文件](https://modelcontextprotocol.io/)
- [Claude Cowork Plugins 介紹](https://www.anthropic.com/news/claude-for-financial-services)
- [LangGraph 官方文件](https://langchain-ai.github.io/langgraph/)
- [站內：Plan-and-Execute RAG](/posts/plan-and-execute-rag)
- [站內：Agentic RAG with ReAct Loop](/posts/agentic-rag-react-loop)
- [站內：Modular RAG Pipeline Architecture](/posts/modular-rag-pipeline-architecture)
