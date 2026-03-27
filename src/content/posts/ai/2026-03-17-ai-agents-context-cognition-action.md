---
title: "AI Agent 的三個核心支柱：Context、Cognition、Action"
date: 2026-03-17
category: ai
tags: [ai-agents, context-engineering, llm, reasoning, ReAct, agentic-ai, memory, mcp]
lang: zh-TW
tldr: "AI Agent 不是黑盒子——它由三層構成：知道什麼（Context）、怎麼想（Cognition）、能做什麼（Action）。搞清楚這三層，才能理解 agent 為什麼有時聰明、有時失控，以及怎麼設計一個真正好用的 agent 系統。"
description: "深入解析 AI Agent 的三個核心支柱：Context（情境管理）、Cognition（推理規劃）、Action（行動執行），涵蓋 context engineering、記憶體架構、ReAct/ToT 推理框架、MCP 工具協定等實作細節。"
draft: false
---

從 ChatGPT 到 Claude、從 GitHub Copilot 到自動化工作流程，「AI agent」這個詞越來越普遍。但大多數人對它的理解停留在「能幫我做事的 AI」，對它內部怎麼運作一無所知。

這種模糊的理解在使用上勉強夠用，但一旦你想**認真構建**或**深度使用** AI agent，就會踢到各種莫名其妙的牆：為什麼 agent 記不住上次說的事？為什麼它在複雜任務中途迷失？為什麼它明明有工具卻不知道怎麼用？

這些問題的答案，幾乎都能追溯到同一個框架。

根據 Velu Sankaran 的分析，一個真正意義上的 AI agent 由三個支柱撐起：**Context（情境）**、**Cognition（認知）**、**Action（行動）**。這不是比喻，是架構——三層各有職責，各有對應的工程問題，也各有失敗模式。

這篇文章想做一件事：把每一層拆開來看清楚。

---

## Context：Agent 的工作記憶

### LLM 是 CPU，Context Window 是 RAM

Andrej Karpathy 有一個精準的比喻：把大型語言模型想成一種新型作業系統，模型本身是 CPU，而 **context window 是 RAM**——它是 agent 唯一的工作記憶。

這個比喻有幾個重要含義：

**記憶體有上限。** 就算是現在最大的模型，context window 也不是無限的。100K、200K tokens 聽起來很多，但當你把工具定義、系統指令、對話歷史、RAG 結果、任務狀態全塞進去，就會發現它消耗得比你預期的快得多。

**每次都從零開始。** LLM 本身沒有跨對話的持久記憶。對話結束，一切歸零。你昨天告訴 agent 你喜歡什麼格式、你的專案背景是什麼——它全都不記得，除非你在下一次對話重新告訴它，或者有外部記憶系統幫它記住。

**放進去什麼，就影響輸出什麼。** Context 的品質直接決定推理的品質。這不只是「加更多資訊就會更好」，而是**加對的資訊**。不相關的資訊會稀釋注意力，錯誤的資訊會導致錯誤的推理。

### Context Engineering：2025 年最重要的工程能力

這就是為什麼 **Context Engineering** 在 2025 年突然成為所有人都在討論的話題。

Karpathy 給出了它的定義：

> Context engineering is the delicate art and science of filling the context window with just the right information for the next step.

LangChain 則更直白地說：Context engineering 是 agent 工程師的第一要務——如果你的 agent 總是表現不穩定，問題十有八九出在 context 設計，而不是模型本身。

**Context 包含哪些東西？**

```
┌─────────────────────────────────────────┐
│              Context Window             │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ System      │  │ Tool Definitions │  │
│  │ Instructions│  │ (what agent can  │  │
│  │             │  │  do & how)       │  │
│  └─────────────┘  └──────────────────┘  │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Memory      │  │ RAG Results      │  │
│  │ (retrieved  │  │ (relevant chunks │  │
│  │  history)   │  │  from knowledge) │  │
│  └─────────────┘  └──────────────────┘  │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Current     │  │ Task State       │  │
│  │ Conversation│  │ (progress, vars) │  │
│  └─────────────┘  └──────────────────┘  │
└─────────────────────────────────────────┘
```

每一個區塊都有工程決策：要放多少？放哪個版本？怎麼壓縮？怎麼更新？

### 記憶體系統：從短期到長期

Context 裡的「記憶」部分，是現代 agent 系統最複雜的工程挑戰之一。

仿照人類認知科學，agent 的記憶通常分為四類：

**Working Memory（工作記憶）**
就是 context window 本身。容量有限，對話結束即消失。Agent 目前的推理狀態、正在執行的任務步驟、剛才工具回傳的結果——都活在這裡。

**Episodic Memory（情節記憶）**
記錄具體發生過的事件：「上週三用戶說他不喜歡 bullet point 格式」、「昨天這個 API 回傳了 404」。這類記憶通常用 vector database 實作，透過語意相似度來檢索相關的過去經驗，在需要的時候注入 context。

**Semantic Memory（語意記憶）**
儲存結構化的事實知識：專業術語的定義、業務規則、世界知識。這類記憶的特點是比較穩定，不像情節記憶那麼容易過期。通常用 knowledge graph 或 structured database 實作。

**Procedural Memory（程序記憶）**
「怎麼做某件事」的知識：怎麼呼叫特定 API、怎麼處理某類錯誤、執行某個流程的標準步驟。這類記憶有時直接內嵌在 system prompt，有時以 few-shot examples 的形式提供。

2025 年最成熟的長期記憶方案是 **Mem0**，它結合了 episodic 和 semantic memory，讓 agent 能夠在跨對話、跨 session 的情境下維持一致的「記憶」。

### 為什麼 Context 是 Agent 的命脈

Context 不好，其他兩個支柱再強也沒用。

一個常見的失敗案例是：agent 拿到的工具定義描述模糊，導致它不知道該在什麼時機用哪個工具；或是 RAG 拉回來的片段跟問題只有表面關聯，導致推理走偏；或是沒有 memory 機制，agent 每次都在重新從零理解用戶的偏好和背景。

好的 context engineering 是這樣的：context window 裡的每一個 token 都有存在的理由，都對當下的任務有直接貢獻。

---

## Cognition：Agent 怎麼思考

拿到資訊之後，agent 要做什麼？**推理**。

Cognition 是 context 和 action 之間的橋梁——它決定 agent 如何分析問題、制定計劃、決定下一步。這是讓 agent 從「會回答問題的 chatbot」變成「能自主解決問題的 agent」的關鍵差異。

### ReAct：最主流的推理框架

**ReAct（Reason + Act）** 是目前 LLM agent 最廣泛使用的推理框架，由 Yao et al. 在 2023 年提出。

它的邏輯結構如下：

```
Thought: 分析目前狀況，決定下一步
Action: 呼叫工具或執行操作
Observation: 觀察工具回傳的結果
Thought: 根據結果調整推理...
Action: ...
（循環直到任務完成）
```

舉個具體例子，如果你叫一個 ReAct agent 幫你查「台北明天的天氣，然後根據天氣建議我該穿什麼」：

```
Thought: 我需要先查台北明天的天氣。
Action: search("台北 明天天氣")
Observation: 明天台北氣溫 18-24°C，下午有雷陣雨機率 60%。

Thought: 氣溫偏涼且有雨，應該建議帶傘並穿薄外套。
Action: respond("明天台北下午有雨，建議穿薄外套並帶傘...")
```

ReAct 的優點是**適應性強**——因為它每一步都在觀察環境反饋，一旦某個工具回傳非預期的結果，下一個 Thought 可以立即調整策略。它特別適合「路徑不明確、需要邊做邊修正」的任務。

缺點是對於長任務效率較低，因為每一步都需要一次 LLM 推理呼叫。

### 更進階的推理框架

**Tree of Thoughts（ToT）**

ToT 把推理步驟展開成樹狀結構，讓 agent 可以同時探索多條可能路徑，再評估哪條路最有希望。

```
             問題
            /    \
         路徑A   路徑B
        /    \      \
      A1      A2    B1
    (好)   (死路)  (最佳)
```

這個方法模仿人類在解複雜問題時的「腦力激盪」過程。適合創意性或有多個可行解的問題，但計算成本高很多，因為要維護多條推理樹。

**Plan-and-Execute**

把任務拆成兩個階段：先由 Planner 完整規劃所有步驟，再交給 Executor 一步一步執行。

```
Phase 1 - Planning:
  任務: "幫我寫一份市場分析報告"
  計劃:
    1. 搜集競爭對手資訊
    2. 分析市場規模數據
    3. 整理用戶調研結果
    4. 撰寫報告框架
    5. 填充各章節內容

Phase 2 - Execution:
  逐一執行上述步驟...
```

Plan-and-Execute 的優點是結構清晰、可預測，適合任務步驟明確的場景。缺點是彈性較差——如果執行中途遇到意外，要回頭修改計劃的成本較高。

**各框架比較**

| 框架 | 適合場景 | 優點 | 缺點 |
|------|---------|------|------|
| ReAct | 探索性任務、路徑不明確 | 適應性強 | 長任務效率低 |
| Tree of Thoughts | 多解問題、創意任務 | 探索全面 | 計算成本高 |
| Plan-and-Execute | 步驟明確的長任務 | 結構清晰 | 彈性差 |
| ReWOO | 工具呼叫多的任務 | 減少來回次數 | 規劃失敗代價高 |

2025 年之後的趨勢是**動態切換**：根據任務特性自動選擇推理模式——遇到不確定性時用 ReAct 逐步探索，遇到結構化長任務時切換 Plan-and-Execute。

### Self-Reflection 與錯誤修正

一個更高級的認知能力是 **Reflexion**——agent 在執行失敗後能夠回顧、反思，從錯誤中學習並調整策略，而不是繼續重複同樣的錯誤。

這個能力在實際任務中非常關鍵。能不能自我修正，幾乎決定了 agent 在複雜任務上的上限。

---

## Action：Agent 對世界的影響力

想清楚了，要做。

Action 是 agent 與外部世界互動的介面，也是它從「思考工具」變成「執行系統」的關鍵。沒有 action 能力，agent 只是一個聊天機器人。

### Action 的完整版圖

**資訊檢索類**
- 搜尋引擎查詢
- 資料庫查詢
- RAG 知識庫檢索
- API 呼叫（讀取資料）

**運算與處理類**
- 程式碼執行（Python sandbox、JavaScript runtime）
- 數學計算
- 資料轉換與分析

**系統操作類**
- 檔案讀寫
- Shell 命令執行
- 瀏覽器自動化（Playwright、Puppeteer）
- 應用程式控制（RPA）

**外部服務類**
- 發送 email / Slack 訊息
- 呼叫第三方 API（日曆、CRM、支付）
- 觸發 webhook

**Agent 協作類**
- 呼叫子 agent（multi-agent 架構）
- 向人類請求確認（human-in-the-loop）
- 與其他 agent 交換資訊

### Model Context Protocol（MCP）：工具的統一語言

以前每個 agent 系統都要針對每個工具寫一套整合邏輯，重複又脆弱。**MCP（Model Context Protocol）** 是 Anthropic 在 2024 年推出的開放標準，試圖解決這個問題。

MCP 的核心概念是**把工具定義標準化**：

```
┌──────────────────┐       MCP Protocol      ┌──────────────────┐
│   AI Agent       │ ◄──────────────────────► │   MCP Server     │
│   (Client)       │                          │   (Tool Provider)│
│                  │  1. 詢問有哪些工具        │                  │
│                  │ ──────────────────────►  │                  │
│                  │  2. 回傳工具定義清單      │                  │
│                  │ ◄──────────────────────  │                  │
│                  │  3. 呼叫特定工具          │                  │
│                  │ ──────────────────────►  │                  │
│                  │  4. 回傳執行結果          │                  │
│                  │ ◄──────────────────────  │                  │
└──────────────────┘                          └──────────────────┘
```

MCP 的好處是：開發者只需要寫一次 MCP Server，任何支援 MCP 的 agent 都能用這個工具——不管是 Claude、GPT、還是開源模型。工具與模型解耦，大幅降低整合成本。

同時，MCP Server 的工具定義也替 context engineering 服務：清晰的工具描述讓 agent 能在對的時機選擇對的工具，而不是靠猜。

### Action 的風險管理

Action 層的能力越強，出錯的代價越高。刪一個檔案、發一封 email、提交一筆交易——這些行動是不可逆的。

實際的 agent 系統通常有幾層安全機制：

**Human-in-the-loop（人機協作確認）**
對高風險操作（刪除資料、金融交易、公開發布內容），在執行前要求用戶確認。

**Action Whitelist（工具白名單）**
只允許 agent 使用特定的工具組合。例如一個 code review agent，只需要讀檔案的工具，不需要寫檔案的工具。

**Sandboxed Execution（沙盒執行）**
程式碼執行在隔離環境中，避免影響主系統。這也是為什麼大部分 code agent 都在 Docker container 裡跑。

**Reversibility Check（可逆性檢查）**
在執行前評估這個行動是否可逆。如果不可逆，要求更高等級的確認。

---

## 三個支柱如何協同

把三層放在一起，就能看到一個 AI agent 完整的運作循環：

```
                    ┌─────────────────────────────────────────┐
                    │              AI Agent Loop               │
                    │                                         │
                    │   ┌─────────┐                           │
  User/Environment  │   │ Context │  ← Memory, Tools, State   │
       ──────────►  │   └────┬────┘                           │
                    │        │                                │
                    │        ▼                                │
                    │   ┌─────────┐                           │
                    │   │Cognition│  ← Reason, Plan, Reflect  │
                    │   └────┬────┘                           │
                    │        │                                │
                    │        ▼                                │
                    │   ┌─────────┐                           │
                    │   │ Action  │  → Tools, APIs, Files     │──► World
                    │   └────┬────┘                           │
                    │        │                                │
                    │        └─── Observation ──► Context ───┘
                    │                  (feedback loop)        │
                    └─────────────────────────────────────────┘
```

這三個支柱不是線性的 pipeline，而是持續循環：
- Action 執行後的結果（Observation）回饋進 Context
- 更新後的 Context 驅動下一輪 Cognition
- Cognition 決定下一個 Action

每一個循環讓 agent 往任務目標前進一步。

### 三層不平衡的失敗模式

理解這個架構，就能快速診斷 agent 出問題時的根本原因：

| 問題現象 | 根本原因 | 改善方向 |
|---------|---------|---------|
| Agent 忘記之前說過的事 | Context 缺乏 memory 機制 | 加入 episodic memory |
| Agent 拿到工具卻不知道怎麼用 | Context 的工具描述不清晰 | 改善 tool definition |
| Agent 在複雜任務中途迷失方向 | Cognition 缺乏 planning 能力 | 改用 Plan-and-Execute |
| Agent 重複同樣的錯誤 | Cognition 缺乏 self-reflection | 加入 Reflexion 機制 |
| Agent 想做但做不到 | Action 工具集不足 | 擴充工具，接入 MCP servers |
| Agent 行動出現副作用 | Action 層缺乏風險控制 | 加入 human-in-the-loop |

---

## 對使用者和工程師的意義

### 如果你是 Agent 的使用者

理解這三層讓你在使用 AI agent 時更有意識：

- 當 agent 回答不準確，先問自己：我給了它足夠的 **context** 嗎？
- 當 agent 解決不了複雜問題，可能是它的 **reasoning** 框架不適合這類任務
- 當 agent 能想清楚卻執行不了，可能是它缺少對應的 **tools**

這不只是抽象理解，而是有實際操作意義的——你可以通過補充 context、選擇更合適的 agent、或要求它分步思考，來顯著提升結果品質。

### 如果你是 Agent 的構建者

設計 agent 系統時，這三層各有對應的技術決策：

**Context 層的決策**
- Memory 策略：要用 working memory 還是外接 long-term memory？選哪個 vector database？
- RAG 設計：檢索策略、chunk size、reranking 要怎麼做？
- Context 壓縮：歷史對話怎麼摘要？什麼資訊可以丟棄？

**Cognition 層的決策**
- 推理框架：ReAct、ToT、Plan-and-Execute，還是混合？
- 模型選擇：需要多強的推理能力？cost 和 capability 怎麼 trade-off？
- Self-reflection：要不要讓 agent 能夠自我修正？

**Action 層的決策**
- 工具集設計：需要哪些工具？用 MCP 還是自己定義？
- 安全邊界：哪些操作需要人工確認？哪些可以完全自動化？
- 錯誤處理：工具失敗時的 fallback 策略？

---

## 整體來說

AI agent 不是一個黑盒子，也不是「更聰明的 chatbot」。它是三個精心設計的層次在協同運作：

- **Context** 決定它知道什麼——這是輸入的品質
- **Cognition** 決定它怎麼思考——這是推理的品質
- **Action** 決定它能影響什麼——這是輸出的能力

這三層任何一層出問題，agent 的整體表現都會崩塌。而真正好的 agent 系統，是把三層都做到位，讓它們像齒輪一樣精準咬合。

這個框架的另一個價值是：它讓你意識到 agent 的「智慧」不只是模型本身的能力，更大程度上取決於你怎麼設計它的環境。一個被精心餵入正確 context、配備完整推理框架、授權足夠工具的 agent，可以遠遠超過同款模型在預設狀態下的表現。

**你設計的不只是一個 AI，而是一個完整的認知環境。**

---

## 參考資料

- [The Three Pillars of AI Agents: Context, Cognition, and Action](https://medium.com/@v31u/the-three-pillars-of-ai-agents-context-cognition-and-action-5f75c4d8534f) — Velu Sankaran
- [Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain Blog
- [Andrej Karpathy on Context Engineering](https://x.com/karpathy/status/1937902205765607626) — Twitter/X
- [Context Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide) — Prompt Engineering Guide
- [ReAct vs Plan-and-Execute: A Practical Comparison](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9) — DEV Community
- [What Is AI Agent Memory?](https://www.ibm.com/think/topics/ai-agent-memory) — IBM
- [A Visual Guide to LLM Agents](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-llm-agents) — Maarten Grootendorst
- [What is the Model Context Protocol (MCP)?](https://modelcontextprotocol.io/) — MCP 官方文件
- [Agentic AI: Architectures, Taxonomies, and Evaluation](https://arxiv.org/html/2601.12560v1) — arXiv
- [Memory in the Age of AI Agents](https://arxiv.org/abs/2512.13564) — arXiv
