---
title: "AI Agent 架構模式完整指南：從三支柱到 Multi-Agent 的系統化導航"
date: 2026-03-18
category: ai
tags: [agent, architecture, harness, multi-agent, mcp, context-engineering, guide]
lang: zh-TW
tldr: "AI Agent 不是一個技術，是一整個架構體系。本文是系統化導航：從 Agent 三支柱（Context/Cognition/Action）出發，穿過 AI 工程三階段演化（Prompt → Context → Harness），到八種 Multi-Agent 設計模式和生產級 Harness 基礎設施。每個主題都有對應專文深入。"
description: "AI Agent 架構的系統化導航指南：Agent 三支柱模型、AI 工程三階段演化、Context Engineering、Prompt Engineering、Google 八種 Multi-Agent 模式、Anthropic Harness 設計、LangGraph 工作流、MCP 標準化協定、Agent Memory、聊天機器人開發，以及可觀測性。"
draft: false
---

你打開了第三篇 Agent 教學，發現它在講的東西跟前兩篇完全不在同一個層次。

一篇在講 prompt 怎麼寫，一篇在講 tool calling 的 JSON schema，另一篇在講 multi-agent 的拓撲結構。它們都叫「AI Agent 教學」，但彼此之間幾乎沒有交集。你看完三篇，對 AI Agent 的理解反而更碎片化了。

這就是 2026 年 AI Agent 領域的現狀：**技術棧太深、概念太多、層次太多，很容易迷失。**

從 Prompt Engineering 到 Context Engineering 到 Harness Engineering，從 RAG 到 Agent Memory，從 Tool Calling 到 MCP，從 Single Agent 到 Multi-Agent——每一個都是一個大主題，每一個都有自己的框架、最佳實踐、和陷阱。更麻煩的是，它們之間有複雜的依賴關係，但很少有人把這張依賴圖畫出來。

這篇文章不是另一篇深入教學。這是一張地圖——一張展示整個 AI Agent 技術棧的全景圖，讓你知道每個主題是什麼、為什麼重要、跟其他主題的關係、以及從哪裡深入。

---

## 這篇指南怎麼用

每個章節會用 2-4 段文字給你一個主題的全局理解——足夠讓你知道它是什麼、為什麼重要、跟其他主題的關係。然後連結到對應的專文，讓你按需深入。

**你不需要從頭讀到尾。** 根據你的需求，跳到對應的章節就好。文末有四條推薦的閱讀路線，針對不同背景和目標。

這篇指南涵蓋 12 個主題、連結到 14 篇專文，總共大約需要 15 分鐘閱讀。每篇專文的深入閱讀時間在 10-20 分鐘。

先看全局：

```
                        ┌─────────────────────────────┐
                        │     AI Agent 架構全景圖      │
                        └──────────────┬──────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
    ┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
    │   Context 支柱     │   │  Cognition 支柱    │   │   Action 支柱     │
    │                    │   │                    │   │                    │
    │  • Context Eng.    │   │  • Prompt Eng.     │   │  • Tool Calling    │
    │  • RAG / Memory    │   │  • Reasoning       │   │  • MCP 協定        │
    │  • State Mgmt      │   │  • Planning        │   │  • Code Execution  │
    └─────────┬──────────┘   └─────────┬──────────┘   └─────────┬──────────┘
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │      Harness 控制層          │
                        │                              │
                        │  • Tool Registry             │
                        │  • Guard System              │
                        │  • Checkpoint-Resume         │
                        │  • Observability             │
                        └──────────────┬───────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
    ┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
    │  Single Agent      │   │  Multi-Agent      │   │  Production       │
    │                    │   │                    │   │                    │
    │  • ReAct Loop      │   │  • 8 Patterns     │   │  • Chatbot Dev    │
    │  • LangGraph       │   │  • Coordinator    │   │  • Guardrails     │
    │  • Plan-Execute    │   │  • Hierarchical   │   │  • Observability  │
    └────────────────────┘   └────────────────────┘   └────────────────────┘

    演化路徑：Prompt Engineering → Context Engineering → Harness Engineering
```

這張圖的核心訊息是：Agent 的三支柱（Context/Cognition/Action）是底層模型，Harness 是中間控制層，上層是各種架構模式和生產化需求。所有的專文都可以對應到這張圖的某個位置。

**快速導航：**

| # | 主題 | 一句話 | 層次 |
|---|------|--------|------|
| 1 | Agent 三支柱 | 所有 Agent 都有 Context、Cognition、Action | 概念基礎 |
| 2 | 三階段演化 | Prompt → Context → Harness 的工程演化 | 概念基礎 |
| 3 | Context Engineering | 給對的資訊比換更強的模型更有效 | Context 支柱 |
| 4 | Prompt Engineering | 系統化的 prompt 設計和迭代方法論 | Cognition 支柱 |
| 5 | Harness Engineering | LLM 和應用之間的控制層 | 控制層 |
| 6 | Multi-Agent 模式 | Google 的八種 Agent 協作拓撲 | 架構模式 |
| 7 | LangGraph | 圖結構的 Agent 工作流框架 | 執行框架 |
| 8 | MCP | AI 工具呼叫的 USB-C 標準 | Action 支柱 |
| 9 | Agent Memory | 從唯讀 RAG 到讀寫記憶 | Context 支柱 |
| 10 | 聊天機器人開發 | 所有主題的整合實戰 | 生產化 |
| 11 | 可觀測性 | 看見黑盒子裡面在發生什麼 | 生產化 |
| 12 | 設計原則 | 五個跨主題的通用原則 | 全局 |

接下來，我們一個一個走過去。

---

## 1. Agent 三支柱：Context、Cognition、Action

所有的 AI Agent 都可以拆解成三個核心能力：

- **Context**：Agent 在做決策時能取得什麼資訊。包括 system prompt、對話歷史、RAG 檢索結果、工具回傳值、記憶系統。
- **Cognition**：Agent 怎麼思考和推理。包括 LLM 的推理能力、chain-of-thought、planning、self-reflection。
- **Action**：Agent 能對外部世界做什麼。包括 tool calling、code execution、API 呼叫、檔案操作。

這個三支柱模型的價值在於：當你的 Agent 表現不好時，你可以精準定位問題在哪一層。如果 Agent 呼叫了錯的工具，問題可能在 Context（沒給夠資訊讓它選對工具）而不是 Action（工具本身沒問題）。如果 Agent 的推理過程正確但最後答錯，問題可能在 Context（檢索到了錯的文件）而不是 Cognition。

三支柱之間是互相依賴的：好的 Context 讓 Cognition 更準確，好的 Cognition 讓 Action 更精準，Action 的結果又回頭豐富 Context。理解這個循環，是理解所有後續主題的基礎。

```
Context ──→ Cognition ──→ Action
   ▲                         │
   └─────────────────────────┘
        Action 結果回饋為新的 Context
```

本指南後續的每個主題，都可以對應到某一個支柱：Context Engineering 和 Agent Memory 強化 Context 支柱，Prompt Engineering 強化 Cognition 支柱，MCP 和 Tool Calling 強化 Action 支柱。Harness Engineering 則是橫跨三者的控制層。

→ **專文深入**：[AI Agent 的三個核心支柱：Context、Cognition、Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action)

---

## 2. AI 工程三階段演化：Prompt → Context → Harness

AI 應用開發的方法論，在三年內經歷了三次根本性的轉變：

**第一階段：Prompt Engineering（2023）**。重點是怎麼寫出好的指令。Few-shot、Chain-of-Thought、role-playing——所有技巧都在「一條 prompt」上做文章。這個階段的心智模型是：模型是固定的，你能調的只有輸入的文字。

**第二階段：Context Engineering（2025）**。Shopify CEO 和 Andrej Karpathy 同時喊出這個詞，業界瞬間共鳴。重點從「怎麼寫指令」轉移到「在執行時動態組裝正確的資訊環境」。RAG、memory、state management 都是 context engineering 的手段。你在設計的不再是一條 prompt，而是一個系統。

**第三階段：Harness Engineering（2026）**。Anthropic 和 Phil Schmid 推動的概念：LLM 與應用之間需要一個控制層（harness），負責工具註冊、權限管理、狀態持久化、錯誤恢復、可觀測性。你在建造的不再是一個 chatbot，而是一個可靠的基礎設施。

每個階段不是取代前一個，而是包含前一個。Prompt engineering 現在是 context engineering 的子集，context engineering 現在是 harness engineering 的子集。

```
2023                  2025                  2026
┌──────────┐    ┌──────────────┐    ┌────────────────────┐
│  Prompt  │ ⊂  │   Context    │ ⊂  │     Harness        │
│  Eng.    │    │   Eng.       │    │     Eng.           │
│          │    │              │    │                    │
│ 調措辭    │    │ 設計資訊環境   │    │ 建造控制基礎設施    │
└──────────┘    └──────────────┘    └────────────────────┘
```

理解這三個階段的演化非常重要，因為它決定了你的心智模型。如果你還停在第一階段，你會以為「Agent 不好用是因為 prompt 寫不好」。到了第二階段，你會意識到「大部分問題出在 context」。到了第三階段，你會發現「即使 context 對了，沒有 harness 的 Agent 在生產環境中仍然不可靠」。

→ **專文深入**：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)

---

## 3. Context Engineering

如果要在這篇指南裡挑出一個「最值得先搞懂的主題」，就是 Context Engineering。

核心觀點很簡單：**大部分 Agent 的失敗是 context 的失敗，不是模型的失敗。** 你的 Agent 不是笨，是瞎——它在做決策的當下沒有足夠的資訊。換一個更強的模型不會解決問題，給它正確的資訊才會。

Context Engineering 有四個核心策略：

- **Write**：把資訊寫入 context（system prompt、few-shot examples、scratchpad）
- **Select**：動態選擇要放什麼進 context（RAG 檢索、tool selection、memory recall）
- **Compress**：壓縮資訊以適應 context window（summarization、truncation、重要性排序）
- **Isolate**：把不同任務的 context 隔離（sub-agent、parallel processing、scoped context）

LangChain CEO Harrison Chase 的診斷原則：「如果你的 agent 表現不穩定，問一個問題就好——LLM 在做這個決策的當下，有足夠的資訊和工具嗎？十之八九，答案是沒有。」

掌握這四個策略，你就掌握了 Agent 品質最大的槓桿。在你去研究更 fancy 的架構之前，先確保你的 context 是對的。

→ **專文深入**：[Context Engineering：為什麼你的 AI Agent 問題出在資訊，不在模型](/posts/ai/2026-03-24-context-engineering-guide)

---

## 4. Prompt Engineering

Context Engineering 取代了 Prompt Engineering 嗎？沒有。它只是讓我們重新定位了 Prompt Engineering 的角色：它不再是「全部」，但仍然是基礎。

一個好的 system prompt 結構通常包含：角色定義、任務描述、輸出格式、約束條件、少量範例。但在生產級系統中，system prompt 只是 context window 的一小部分——其餘被 RAG 結果、工具回傳值、對話歷史佔據。

Prompt Engineering 在 2026 年的價值主要在兩個面向：一是**迭代方法論**（怎麼系統性地改進 prompt，而不是隨機調詞），二是**RAG 場景下的 prompt 設計**（怎麼寫 system prompt 來正確引導模型使用檢索到的 context）。

一個容易忽略的觀點：Prompt Engineering 在 Agent 系統中的角色跟在 chatbot 中不一樣。Chatbot 的 system prompt 是「一次設定，長期使用」的。但 Agent 的 prompt 往往是動態組裝的——根據當前的任務階段、可用的工具、已經收集的 context，system prompt 的內容會不同。這就是 Prompt Engineering 和 Context Engineering 的交匯點。

另一個常見錯誤是在 prompt 中放入太多指令。當你的 system prompt 超過 2000 字，LLM 對後面的指令的遵循度會明顯下降。這時候你需要的不是更長的 prompt，而是更好的 context 架構——把部分指令移到工具描述中、移到 few-shot examples 中、或者根據任務階段動態載入。

→ **專文深入**：
- [Prompt Engineering 實戰：迭代方法論、常見錯誤與 Few-shot 最佳化](/posts/ai/2026-03-13-prompt-engineering-iteration-guide)
- [RAG Prompt Engineering：System Prompt 和 Context 怎麼設計](/posts/ai/2026-03-12-rag-prompt-engineering)

---

## 5. Harness Engineering

如果 LLM 是引擎，Harness 就是整台車——底盤、煞車、儀表板、安全氣囊。

Harness 是 LLM 和應用之間的控制層。它負責：

- **Tool Registry**：管理 Agent 能用哪些工具、每個工具的權限和速率限制
- **Guard System**：在 LLM 輸出和工具執行之間加入驗證層，防止幻覺或危險操作
- **Checkpoint-Resume**：長任務的狀態持久化和斷點恢復
- **Error Recovery**：工具呼叫失敗時的降級策略和重試機制

Anthropic 的 Claude Code 是目前最成熟的 harness 實作之一——它展示了一個 Agent 怎麼像工程師一樣工作：讀代碼、做計劃、執行、驗證、回退。Phil Schmid（前 Hugging Face）則從更抽象的層次定義了 harness 的設計原則和標準組件。

Harness Engineering 是 2026 年 AI 工程最重要的主題，因為它直接決定了 Agent 在生產環境中是否可靠。一個沒有 harness 的 Agent 就像一台沒有煞車的車——在空曠的停車場可以跑得很開心，上了馬路就是災難。

一個好的 harness 設計原則是：**LLM 決定做什麼，harness 決定怎麼安全地做。** LLM 說「我要刪除這個檔案」，harness 檢查這個操作是否在允許範圍內、是否需要人類審核、是否有 rollback 機制。這種分離讓你可以升級 LLM 而不需要重寫安全邏輯。

→ **專文深入**：
- [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design)
- [Phil Schmid：為什麼 Agent Harness 是 2026 年最重要的事](/posts/ai/2026-03-28-phil-schmid-agent-harness)
- [Harness Engineering 進階模式：Tool Registry、Guard System 與 Checkpoint-Resume](/posts/ai/2026-03-30-harness-engineering-patterns)

---

## 6. Multi-Agent 設計模式

當單一 Agent 不夠用時，你需要多個 Agent 協作。Google 在 2025 年的 Agent 白皮書中系統化整理了八種 Multi-Agent 設計模式：

| 模式 | 一句話描述 |
|------|-----------|
| **Sequential** | Agent 像流水線一樣串接，前一個的輸出是後一個的輸入 |
| **Coordinator（Delegator）** | 一個中央 Agent 分配任務給專門的 sub-agent |
| **Parallel** | 多個 Agent 同時處理同一個問題的不同面向 |
| **Hierarchical** | 多層管理結構，manager agent 管理 sub-manager |
| **Generator-Critic** | 一個 Agent 生成，另一個 Agent 評審，迭代改進 |
| **Iterative Refinement** | 單個 Agent 反覆改進自己的輸出 |
| **Human-in-the-Loop** | 在關鍵決策點加入人類審核 |
| **Composite** | 組合以上多種模式 |

選擇哪種模式取決於你的任務結構。大部分生產系統用的是 Coordinator 或 Sequential，因為它們最好理解、最好除錯。Hierarchical 和 Composite 在任務複雜度真的很高時才值得引入。

一個常見的錯誤是過早引入 multi-agent：如果你的單一 Agent 還沒調好，加更多 Agent 只會讓問題變得更難除錯。先把單一 Agent 做到穩定，再考慮拆分。

什麼時候該拆分成 multi-agent？有幾個訊號：

1. **Context window 不夠用**：單一 Agent 需要的背景資訊太多，塞不進一個 context window
2. **需要不同的專業能力**：一個 Agent 要同時精通寫 code 和做 UI 設計，不如拆成兩個專門的 Agent
3. **需要平行處理**：多個獨立的子任務可以同時進行
4. **需要 checks and balances**：Generator-Critic 模式讓一個 Agent 檢查另一個 Agent 的工作

如果以上都不成立，single agent 通常是更好的選擇——更簡單、更好除錯、更低延遲。

→ **專文深入**：[Google 的八種 Multi-Agent 設計模式](/posts/ai/2026-03-28-google-multi-agent-patterns)

---

## 7. LangGraph 工作流程

LangGraph 是 LangChain 團隊推出的 Agent 工作流框架，核心理念是：**用圖結構來定義 Agent 的控制流程。**

傳統的 Agent 框架（像 LangChain 的 AgentExecutor）是把 Agent 包在一個 while loop 裡，讓 LLM 自己決定每一步要做什麼。LangGraph 不一樣——它要求你明確定義節點（node）和邊（edge），把 Agent 的行為變成一個有向圖。

這帶來幾個好處：

- **可預測性**：你可以看到 Agent 的控制流程，而不是完全依賴 LLM 的即興發揮
- **Typed State**：每個節點共享一個有型別的狀態物件，避免資訊在傳遞中遺失
- **Human-in-the-Loop**：在圖中的任何節點都可以加入人類審核的斷點
- **Persistence**：內建的 checkpointing，可以暫停和恢復長任務

LangGraph 特別適合那些需要「有結構的自由度」的場景——Agent 在某些步驟有固定流程，在某些步驟可以自主決策。

```
              ┌─────────┐
              │  Start  │
              └────┬────┘
                   │
              ┌────▼────┐     ┌───────────┐
              │ Retrieve │────▶│  Grade    │
              └─────────┘     └─────┬─────┘
                                    │
                        ┌───────────┼───────────┐
                        │ relevant  │           │ not relevant
                   ┌────▼────┐           ┌─────▼─────┐
                   │ Generate │           │ Re-query  │
                   └────┬────┘           └───────────┘
                        │
                   ┌────▼────┐
                   │  End    │
                   └─────────┘
```

上面是一個簡化的 Corrective RAG 圖——LangGraph 的典型用例。每個方框是一個 node，箭頭是 edge，分支邏輯由 conditional edge 決定。整個流程是確定性的框架，但每個 node 內部可以是非確定性的 LLM 呼叫。

LangGraph 和前面提到的 Multi-Agent 設計模式不是互斥的——LangGraph 是實作層的框架，Multi-Agent 模式是設計層的概念。你可以用 LangGraph 來實作 Sequential、Coordinator、或 Hierarchical 模式。

→ **專文深入**：[LangGraph：用圖結構管理 Agent 工作流程](/posts/ai/2026-03-27-langgraph-agent-orchestration)

---

## 8. MCP（Model Context Protocol）

MCP 是 Anthropic 在 2024 年底推出的開放標準，目標是成為 **AI 工具呼叫的 USB-C**。

在 MCP 之前，每個 AI 應用要串接一個工具，就要自己寫一套整合邏輯。你的 Agent 要用 Slack、GitHub、Jira？三套 API 整合，三種不同的認證方式，三組不同的錯誤處理。

MCP 定義了一個標準化的協定：工具提供者實作一個 MCP Server，AI 應用實作一個 MCP Client，兩邊透過標準的 JSON-RPC 溝通。這意味著：

- 任何支援 MCP 的 AI 應用都能直接使用任何 MCP Server 提供的工具
- 工具開發者只需要寫一次 MCP Server，就能被所有 MCP Client 使用
- 權限、認證、capability negotiation 都有標準化的機制

MCP 已經被 Claude Desktop、Cursor、Windsurf、Claude Code 等主流 AI 應用支援。生態系正在快速成長，從資料庫查詢到瀏覽器操作到雲端服務管理，越來越多工具有了 MCP Server。

MCP 跟本指南的其他主題有什麼關係？

- **跟 Harness 的關係**：MCP 是 Harness 中 Tool Registry 的標準化實作。Harness 定義了「Agent 需要一個工具管理層」，MCP 定義了「這個管理層的協定長什麼樣」。
- **跟 Context Engineering 的關係**：MCP Server 不只提供工具，也提供 Resources（上下文資訊）和 Prompts（預設的互動範本）。Resources 本質上就是 context engineering 的 Select 策略的一種實作。
- **跟 Multi-Agent 的關係**：在 multi-agent 架構中，不同的 Agent 可以連接不同的 MCP Server，實現職責分離。

→ **專文深入**：[MCP（Model Context Protocol）：AI Agent 工具呼叫的標準化協定](/posts/ai/2026-03-22-mcp-model-context-protocol)

---

## 9. Agent Memory

傳統 RAG 是唯讀的：你有一堆文件，Agent 檢索然後回答。Agent Memory 把這個模型升級為**讀寫**：Agent 不只能讀取記憶，還能寫入新的記憶。

三種記憶類型：

- **Procedural Memory**：Agent 怎麼做事的知識（相當於肌肉記憶）。例如：「上次用戶要求用繁體中文回答」「這個 codebase 用 pnpm 不是 npm」。
- **Episodic Memory**：Agent 過去經歷的具體事件。例如：「上次用戶問了這個問題，我用了 X 方法解決」。
- **Semantic Memory**：Agent 對世界的一般性知識。例如：從文件庫中學到的領域知識。

Memory 系統的設計挑戰不在於「怎麼儲存」，而在於「怎麼選擇性地回想」。一個有十萬筆記憶的 Agent，如果不能在對的時機想起對的記憶，就跟沒有記憶一樣。這就回到了 Context Engineering 的核心問題：Select。

一個具體的例子：Claude Code 的 `CLAUDE.md` 就是一種 procedural memory——它告訴 Agent「在這個專案中，你應該用 pnpm 而不是 npm」「commit message 要用中文」。這些資訊不是從對話中推理出來的，而是從持久化的記憶中讀取的。

Memory 也是 Agent 和 Chatbot 最大的差異之一。Chatbot 通常只有 session 內的短期記憶（對話歷史），Agent 需要跨 session 的長期記憶才能隨時間變得更有用。

→ **專文深入**：[Agent Memory 系統：從 RAG 到 Read-Write 記憶的演化](/posts/ai/2026-03-19-agent-memory-systems)

---

## 10. 聊天機器人開發

聊天機器人是最常見的 Agent 應用形式，但「能 demo」和「能上線」之間的差距巨大。

一個生產級聊天機器人需要解決的問題遠超過「呼叫 LLM API」：

- **狀態管理**：多輪對話的 context 怎麼維護？對話太長怎麼截斷？
- **記憶策略**：跨 session 的用戶記憶怎麼存取？
- **串流回應**：怎麼做到 token-by-token 的串流輸出，而不是等全部生成完才顯示？
- **Guardrails**：怎麼防止 prompt injection？怎麼過濾不安全的輸出？
- **技術棧選型**：Vercel AI SDK vs LangChain vs 自己刻？各有什麼取捨？

這些問題每一個都有坑，而且它們之間會互相影響。例如，串流回應和 guardrails 之間有天然的衝突——你要在輸出完成前就開始串流，但 guardrails 需要看到完整輸出才能判斷。

聊天機器人開發可以說是本指南所有主題的「整合考試」：

- 你需要 **Context Engineering** 來管理多輪對話的 context window
- 你需要 **Prompt Engineering** 來設計 system prompt 和對話引導
- 你需要 **Harness Engineering** 來處理錯誤恢復和狀態持久化
- 你需要 **Agent Memory** 來實現跨 session 的記憶
- 你需要**可觀測性**來追蹤生產環境中的每一次對話

如果你能建造一個穩定的生產級聊天機器人，你對 Agent 架構的理解就已經很紮實了。

→ **專文深入**：[聊天機器人開發完整指南：狀態管理、記憶策略與技術棧選型](/posts/ai/2026-03-13-chatbot-development-guide)

---

## 11. 可觀測性

你不會部署一個沒有 logging 和 monitoring 的後端服務。AI Agent 也一樣。

LLM 應用的可觀測性比傳統應用更重要，因為 LLM 的行為本質上是不確定的。同樣的輸入可能產生不同的輸出，你需要看到每一次呼叫的完整 trace 才能除錯。

Langfuse 是目前最流行的開源 LLM 可觀測性平台，它提供：

- **Trace**：完整的請求追蹤，從用戶輸入到最終回應的每一步
- **Prompt Management**：版本化管理你的 prompt，追蹤哪個版本的表現最好
- **Evaluation**：自動化和人工評估，建立品質基準線
- **Cost Tracking**：每次呼叫花了多少錢，哪些用戶或功能最燒錢

可觀測性不是 nice-to-have，是生產級 Agent 的必備條件。沒有它，你就是在盲飛。

一個實際的場景：你的 Agent 在生產環境中突然開始給出低品質的回答。沒有可觀測性，你只能看到「用戶抱怨了」。有可觀測性，你可以看到：

1. 這批低品質回答都集中在某個時間段
2. 這個時間段的 RAG 檢索品質下降了
3. 原因是某個 embedding index 更新失敗了
4. 修復 index 後品質恢復

從「用戶抱怨」到「找到根因」，可觀測性讓這個過程從幾天縮短到幾分鐘。

除了 debug，可觀測性還有兩個常被忽略的價值：

- **成本控制**：LLM 呼叫不便宜。沒有 cost tracking，你不會知道某個功能每天燒掉多少錢，也不會知道某個用戶的 prompt injection 嘗試正在浪費你的 token。
- **持續改進**：有了 evaluation 數據，你可以量化每次 prompt 修改或架構調整的效果，而不是靠感覺。

→ **專文深入**：[Langfuse 完整指南：LLM 應用的可觀測性從零開始](/posts/ai/2026-03-26-langfuse-llm-observability-guide)

---

## 12. Agent 設計原則

跨越所有主題，有五個設計原則反覆出現。不管你在建造什麼類型的 Agent，這些原則都適用：

### 原則一：最小工具集

給 Agent 最少的工具，而不是最多的。每多一個工具，Agent 選錯工具的機率就上升。如果一個工具在 90% 的情境下不會被用到，就不要預設載入——用動態 tool selection 按需提供。

實測數據：當可用工具從 5 個增加到 20 個時，Agent 選對工具的準確率會明顯下降。這不是模型的問題，是資訊過載的問題——回到 Context Engineering 的核心命題。

### 原則二：明確的停止條件

Agent 必須知道什麼時候該停下來。沒有明確停止條件的 Agent 會陷入無限迴圈，或者在已經完成任務後繼續做不必要的事。在 system prompt 中明確定義：「當 X 條件滿足時，停止並回報結果。」

### 原則三：可觀測性優先

在建造 Agent 的第一天就接入可觀測性，不要等到上線後才補。每一次 LLM 呼叫、每一次工具執行、每一次決策分支，都應該被記錄和追蹤。這跟傳統軟體開發的 logging 一樣：事後補永遠比一開始就做更痛苦。

### 原則四：優雅降級

工具呼叫會失敗，API 會 timeout，LLM 會幻覺。你的 Agent 必須有降級策略：工具失敗時用 fallback 方法、LLM 回應不符合格式時重試、整個流程卡住時有 timeout 機制。

### 原則五：狀態持久化

任何超過 30 秒的 Agent 任務都應該有 checkpoint 機制。用戶不會因為你的 Agent 跑了 5 分鐘後崩潰而感激你——但如果你能從上次的 checkpoint 恢復，用戶會覺得你很專業。

這五個原則不需要特定的框架或工具，它們是設計層的思考。在你開始寫第一行 Agent 程式碼之前，先把這五個原則想清楚，會省下大量的重構時間。

把它們濃縮成一句話：**讓 Agent 做少一點、知道什麼時候停、看得到它在做什麼、壞了能修、斷了能接。**

---

## 閱讀路線推薦

不知道從哪開始？根據你的角色和目標，這裡有四條建議路線。每條路線的專文之間有邏輯遞進，建議按順序閱讀：

### 入門路線：理解 Agent 是什麼

```
Agent 三支柱 → Prompt Engineering → Context Engineering → 聊天機器人開發
```

從最基礎的概念模型開始，理解 Agent 的三個面向。然後學會怎麼寫好 prompt（這仍然是基本功），再理解更大的 context engineering 框架。最後用聊天機器人開發把理論落地。這條路線大約需要 1.5 小時。

### 進階路線：建造複雜系統

```
Harness Engineering → Multi-Agent 設計模式 → LangGraph → MCP
```

當你的 Agent 已經能基本運作，這條路線幫你建造更複雜、更可靠的系統。Harness 給你控制層，Multi-Agent 給你架構模式，LangGraph 給你執行框架，MCP 給你標準化的工具整合。這條路線大約需要 1.5 小時。

### 生產路線：讓系統可靠上線

```
Agent 設計原則 → 可觀測性 → Harness Engineering（Guard System）→ 聊天機器人開發
```

你的 Agent 已經 demo 成功了，老闆要你上線。這條路線聚焦在生產環境的必備條件：設計原則讓你避開常見陷阱，可觀測性讓你能除錯，Guard System 讓你安全，聊天機器人指南給你完整的 production checklist。這條路線大約需要 1 小時。

### 全棧路線：從頭到尾

```
三支柱 → 三階段演化 → Prompt Eng. → Context Eng. → Harness Eng.
→ Multi-Agent → LangGraph → MCP → Memory → 聊天機器人 → 可觀測性
```

按照本文的章節順序，從概念到實作，完整走一遍。適合想要系統性理解整個 AI Agent 架構體系的人。預計閱讀時間：所有專文加起來約 3-4 小時。

### 速查表：我遇到了這個問題，該看哪篇？

| 問題 | 建議閱讀 |
|------|---------|
| Agent 回答品質不穩定 | Context Engineering → Prompt Engineering |
| Agent 呼叫了錯的工具 | Context Engineering（Tool Selection）→ Harness（Tool Registry） |
| Agent 陷入無限迴圈 | Agent 設計原則（停止條件）→ LangGraph（結構化控制流） |
| 不知道 Agent 為什麼出錯 | 可觀測性（Langfuse） |
| 單一 Agent 不夠用 | Multi-Agent 設計模式 → LangGraph |
| 想讓 Agent 記住用戶偏好 | Agent Memory |
| 想上線但不確定夠不夠穩 | Harness Engineering → 可觀測性 → 聊天機器人開發 |
| 想串接外部工具 | MCP |
| 從零開始建 chatbot | 聊天機器人開發（整合指南） |

---

## 結語

AI Agent 的技術棧在 2026 年已經發展成一個完整的工程體系。它不再是「會寫 prompt 就好」的事情——你需要理解 context 管理、harness 設計、工具標準化、記憶系統、可觀測性，才能建造出可靠的 Agent。

但好消息是：這些技術之間有清晰的邏輯關係和學習順序。你不需要一次學會全部，只要知道自己在地圖上的哪個位置，下一步該往哪走就好。

回到最開始的全景圖：

- **底層**是 Agent 三支柱（Context/Cognition/Action），這是你的概念基礎
- **中間**是 Harness 控制層，這是你的工程基礎
- **上層**是各種架構模式和生產化需求，這是你的實戰領域

不管 AI 技術怎麼演化，這三層的結構不會變。模型會越來越強，但 context 管理、控制流程、可觀測性這些工程問題只會越來越重要——因為模型越強，你能交給它的任務越複雜，對工程基礎設施的要求也越高。

這就是這篇指南的目的：給你一張地圖，讓你在這個快速演化的領域中不迷路。

如果你在讀這篇文章的過程中發現某個主題特別引起你的興趣，不要猶豫，直接點進去。理論上的「最佳學習路線」不如你自己的好奇心來得有效。

最後提醒一點：AI Agent 技術的迭代速度非常快。這篇指南和所有連結的專文都基於 2026 年初的技術現狀。具體的框架和工具會變，但底層的架構思維——三支柱模型、控制層設計、可觀測性——這些是穩定的。學好這些，你就有能力自己判斷新技術值不值得採用。

挑一條閱讀路線，開始吧。

## 參考資料

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al. (2023, ICLR)，推理與行動交織的 Agent 框架，現代 Agentic RAG 的理論基石
- [Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/abs/2305.10601) — Yao et al. (2023, NeurIPS)，多路徑搜尋的 Agent 認知框架，超越線性 Chain-of-Thought
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic 工程部落格，Context Engineering 與 Harness Design 的完整實作原則
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain，Write/Select/Compress/Isolate 四大 context 管理策略
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) — Singh et al. (2025)，Agentic RAG 系統演化與 Multi-Agent 架構全面綜述
- [AgentVerse: Facilitating Multi-Agent Collaboration and Exploring Emergent Behaviors](https://arxiv.org/abs/2308.10848) — Chen et al. (2023)，Multi-Agent 協作框架與湧現行為實驗
- [HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face](https://arxiv.org/abs/2303.17580) — Shen et al. (2023)，LLM 作為 controller 統一協調多模型的 Hierarchical Agent 早期範例
- [Model Context Protocol (MCP) 官方規格](https://modelcontextprotocol.io/specification) — Anthropic 發布的 MCP 標準規格，Agent 工具標準化的核心協定
