---
title: "RAG 系統模式完整指南：從 Naive 到 Multi-Agent 的十代演化與實戰導航"
date: 2026-03-14
category: ai
tags: [rag, guide, retrieval, embedding, reranking, evaluation, agent]
lang: zh-TW
tldr: "RAG 已經從簡單的「搜尋+生成」演化成涵蓋十個世代的技術體系。本文是系統化導航：從 Naive RAG 到 Multi-Agent RAG 的十代演化、檢索策略、Chunking、Embedding、Reranking、評估框架、可觀測性、成本優化。每個主題都有對應專文深入。"
description: "RAG 系統的完整導航指南：十代 RAG 演化（Naive → Advanced → Modular → Self-RAG → CRAG → Graph RAG → Speculative → Agentic → Multi-Agent → LongRAG）、檢索策略、Chunking、Embedding、向量資料庫、Reranking、評估框架、Guardrails、可觀測性和成本優化。"
draft: false
---

你搜尋「RAG」，會得到幾百篇文章，每篇都在講不同的東西。

有人在講 Naive RAG 的三步驟，有人在講 Graph RAG 的知識圖譜，有人在講 Agentic RAG 的 ReAct loop，有人在講 Reranking 和 Embedding 模型選型。這些全部都叫 RAG，但它們解決的問題完全不同，適用的場景也天差地遠。

問題不是資訊太少，是**資訊太碎**。

這篇文章是一張地圖。它不會深入任何單一主題——每個主題都有對應的專文。它做的事情是：讓你站在高處，看清整個 RAG 技術體系的全貌，然後根據你的需求，選對路線走進去。

**誰需要這篇指南**：正在建 RAG 系統的工程師、想了解 RAG 全貌的技術主管、以及在各種 RAG 變體之間迷路的任何人。不管你是從零開始還是已經有一個在跑的系統想要改進，這篇都能幫你定位。

---

## 怎麼使用這篇指南

1. **先看全域架構圖**：理解十代 RAG 和周邊技術的關係
2. **找到你的階段**：你在建 MVP？在優化品質？在搞生產營運？
3. **跳到對應章節**：每個章節會給你 2-4 段概述 + 關鍵洞察
4. **點進專文**：想深入的主題，每個都有獨立的完整文章

---

## 全域架構圖

```
                        RAG 技術體系全景
    ┌─────────────────────────────────────────────────────┐
    │                                                     │
    │  ┌─────────── 十代演化 ──────────────────────────┐  │
    │  │                                               │  │
    │  │  Gen 1: Naive RAG (搜尋+生成)                 │  │
    │  │    ↓                                          │  │
    │  │  Gen 2: Advanced RAG (前處理+後處理)           │  │
    │  │    ↓                                          │  │
    │  │  Gen 3: Modular RAG (可組合 DAG)              │  │
    │  │    ↓                                          │  │
    │  │  Gen 4: Self-RAG (LLM 自己決定要不要搜尋)     │  │
    │  │    ↓                                          │  │
    │  │  Gen 5: CRAG (搜尋結果不對就重試)             │  │
    │  │    ↓                                          │  │
    │  │  Gen 6: Graph RAG (知識圖譜推理)              │  │
    │  │    ↓                                          │  │
    │  │  Gen 7: Speculative RAG (小模型打草稿)        │  │
    │  │    ↓                                          │  │
    │  │  Gen 8: Agentic RAG (自主 Agent)              │  │
    │  │    ↓                                          │  │
    │  │  Gen 9: Multi-Agent RAG (多 Agent 協作)       │  │
    │  │    ↓                                          │  │
    │  │  Gen 10: LongRAG (長上下文取代細切)           │  │
    │  │                                               │  │
    │  └───────────────────────────────────────────────┘  │
    │                                                     │
    │  ┌─── 檢索策略 ───┐  ┌─── 基礎設施 ───┐           │
    │  │ BM25 + Vector   │  │ Chunking       │           │
    │  │ HyDE            │  │ Embedding      │           │
    │  │ Multi-Query     │  │ Vector DB      │           │
    │  │ Cross-Encoder   │  │ Prompt Design  │           │
    │  │ ColBERT / SPLADE│  │ Streaming      │           │
    │  │ RRF / MMR       │  │ Memory         │           │
    │  │ Semantic Cache   │  └────────────────┘           │
    │  │ Text-to-SQL     │                                │
    │  └─────────────────┘  ┌─── 品質與營運 ───┐         │
    │                       │ Evaluation       │         │
    │  ┌─── 前沿 ────────┐ │ Guardrails       │         │
    │  │ Agent Memory    │ │ Observability    │         │
    │  │ Multimodal RAG  │ │ Cost / A/B Test  │         │
    │  └─────────────────┘ └──────────────────┘         │
    │                                                     │
    └─────────────────────────────────────────────────────┘
```

---

## 世代對比總覽

| 世代 | 一句話描述 | 核心強項 | 適用場景 |
|------|-----------|---------|---------|
| Gen 1: Naive | 搜尋 → 塞進 prompt → 生成 | 最簡單、最快能跑 | MVP、PoC、內部工具 |
| Gen 2: Advanced | 加上 query rewrite、reranking、chunk 優化 | 品質大幅提升 | 生產環境第一版 |
| Gen 3: Modular | 把 pipeline 拆成可組合模組 | 彈性、可測試 | 需要客製化的產品 |
| Gen 4: Self-RAG | LLM 自己判斷要不要搜尋 | 減少不必要的檢索 | 混合知識型問答 |
| Gen 5: CRAG | 搜尋結果不好就自動修正重試 | 容錯能力 | 開放域問答 |
| Gen 6: Graph RAG | 知識圖譜 + 向量搜尋 | 關係推理 | 法規、醫療、複雜知識網 |
| Gen 7: Speculative | 小模型平行打草稿，大模型驗證 | 延遲低、成本低 | 高吞吐量場景 |
| Gen 8: Agentic | 自主 Agent + ReAct loop | 多步推理 | 複雜研究型問題 |
| Gen 9: Multi-Agent | 多個專業 Agent 分工協作 | 規模化、專業化 | 企業級多領域系統 |
| Gen 10: LongRAG | 大 chunk + 長上下文模型 | 保留完整語境 | 長文件、法律合約 |

### 成熟度光譜

不是每一代都同樣成熟。在選擇時，你也要考慮技術的生產就緒程度：

- **已驗證**（大量生產案例）：Gen 1 Naive、Gen 2 Advanced、Gen 3 Modular
- **漸趨成熟**（有生產案例但仍在快速演化）：Gen 5 CRAG、Gen 6 Graph RAG、Gen 8 Agentic RAG
- **早期採用**（論文發表不久，框架支持有限）：Gen 4 Self-RAG、Gen 7 Speculative、Gen 9 Multi-Agent、Gen 10 LongRAG

---

# Part 1：RAG 十代演化

## Gen 1-3：Naive → Advanced → Modular

### Gen 1: Naive RAG

最原始的 RAG：把使用者的問題拿去做向量搜尋，找到最相關的幾個 chunk，全部塞進 prompt，讓 LLM 生成答案。三個步驟：Indexing → Retrieval → Generation。

架構一句話：`Query → Embed → Vector Search → Top-K Chunks → LLM → Answer`

它能跑，但問題很多。Query 和 document 的語義不一定對齊，chunk 的切法影響巨大，找回來的結果可能不相關，LLM 可能無視 context 自己幻覺。每一個環節都是潛在的失敗點。大多數團隊會在 Naive RAG 上卡兩到三週，然後意識到「光是塞進去」不夠。

### Gen 2: Advanced RAG

Advanced RAG 的核心改進是在 Retrieval 前後各加一層處理。**前處理**：query rewriting、HyDE、multi-query expansion，讓搜尋更精準。**後處理**：reranking、compression、deduplication，讓送進 LLM 的 context 品質更高。

架構一句話：`Query → Pre-process → Retrieve → Post-process → Generate`

這是大多數生產系統的起點。單純加上 Cross-Encoder reranking，relevance 就能提升 15-30%。如果你只能做一件事來改善 Naive RAG，加 reranking。

### Gen 3: Modular RAG

Modular RAG 把整個 pipeline 拆成獨立模組——Routing、Retrieval、Reranking、Generation 各自是一個可替換的元件。你可以把它想成一個 DAG（有向無環圖），每個節點負責一件事，節點之間透過標準介面串接。

架構一句話：`Query → Router → [Module A | Module B | Module C] → Merge → Generate`

這讓你可以 A/B 測試單一元件、根據 query 類型動態切換策略、甚至在不同模組間做 fallback。大部分成熟的 RAG 產品最終都會走向 Modular 架構，因為你總會遇到「這類問題要走不同路徑」的需求。

→ 深入閱讀：[RAG 的三個世代：從 Naive 到 Modular](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution)
→ 深入閱讀：[Modular RAG Pipeline：把 RAG 設計成可組合的 DAG](/posts/ai/2026-03-12-modular-rag-pipeline-architecture)

---

## Gen 4: Self-RAG

Self-RAG 的關鍵突破是：**LLM 自己決定要不要檢索**。

傳統 RAG 不管什麼問題都去搜尋，但很多問題 LLM 自己就知道答案——「Python 的 list comprehension 怎麼寫」不需要搜尋。Self-RAG 訓練模型輸出特殊的 reflection token：`[Retrieve]` 決定要不要搜尋，`[ISREL]` 判斷搜尋結果是否相關，`[ISSUP]` 判斷生成的答案是否有 context 支持。

```
User Query
    ↓
LLM: 需要搜尋嗎？ ──→ [No Retrieve] → 直接生成
    ↓ [Retrieve]
搜尋 → 結果相關嗎？ ──→ [ISREL=No] → 丟棄，換一批
    ↓ [ISREL=Yes]
生成答案 → 有 context 支持嗎？ ──→ [ISSUP=No] → 重新生成
    ↓ [ISSUP=Yes]
輸出最終答案
```

Self-RAG 的好處是減少不必要的搜尋（降低延遲和成本），同時在需要搜尋時確保結果品質。缺點是需要特殊訓練——你不能直接在 GPT-4 上用，需要 fine-tune 過的模型才能輸出 reflection token。

適用場景：知識庫內容和 LLM 自身知識有大量重疊時，Self-RAG 能避免冗餘搜尋。如果你的問題幾乎都需要搜尋（例如企業內部文件問答），那 Self-RAG 的好處不大。

---

## Gen 5: CRAG（Corrective RAG）

CRAG 解決的問題很直接：**搜尋結果不好怎麼辦？**

Naive RAG 搜到什麼就用什麼，即使結果根本不相關。CRAG 在 Retrieval 後面加了一個 Evaluator，用一個輕量級模型（或 LLM）對搜尋結果打分。如果分數高，直接用；如果分數低，觸發修正策略——放寬搜尋條件、換一個搜尋引擎、甚至用 web search 作為 fallback。

架構一句話：`Query → Retrieve → Evaluate(相關/不確定/不相關) → [Use | Refine | Web Search] → Generate`

這個「搜不到就修正」的機制讓 RAG 系統在面對 edge case 時不會直接失敗，而是自動嘗試不同策略。在開放域問答中，CRAG 比 Naive RAG 的答案準確率高出 20% 以上。

CRAG 的實用價值在於它不需要改你現有的搜尋引擎——它是在搜尋結果出來之後加的一層。這意味著你可以在任何現有的 RAG 系統上「加裝」CRAG，而不需要重新設計 pipeline。

→ 深入閱讀：[CRAG：檢索失敗時，自動放寬條件重試](/posts/ai/2026-03-12-corrective-rag-crag)

---

## Gen 6: Graph RAG

向量搜尋擅長找「語義相似的段落」，但它不擅長**關係推理**。

「這個藥物和那個藥物有交互作用嗎？」「這條法規引用了哪些其他法規？」「這個人在這家公司擔任什麼職位，這家公司又跟哪些公司有合作關係？」——這些問題需要的不是找到相似的文字，而是沿著**關係鏈**走。

Graph RAG 把文件中的實體和關係抽取出來，建成知識圖譜（Knowledge Graph），然後在檢索時同時查向量索引和圖譜。向量搜尋負責找到相關的文件片段，圖譜負責找到相關的實體關係，兩者合併後送進 LLM。

架構一句話：`Query → [Vector Search + Graph Traversal] → Merge Context → Generate`

Microsoft 的 GraphRAG 論文進一步提出了 Community Summary 的概念：對圖譜中的社群（高度互連的節點群）預先生成摘要，讓系統能回答那些需要「全局理解」的問題。

Graph RAG 的建置成本比純向量搜尋高得多——你需要做實體抽取、關係建模、圖譜維護。但在法規遵循、醫療知識、企業組織關係等「關係密集」的領域，這個投資是值得的。

→ 深入閱讀：[GraphRAG：把知識做成圖，讓 LLM 沿著關係推理](/posts/ai/2026-03-12-graph-rag)

---

## Gen 7: Speculative RAG

Speculative RAG 借鑑了 Speculative Decoding 的思路：**用小模型做初步工作，大模型做最終驗證**。

具體做法：一個小型 specialist model（例如 7B 參數）同時生成多個候選答案草稿，每個草稿基於不同的 retrieved chunk 子集。然後一個大型 generalist model（例如 70B 或 GPT-4）一次性評估所有草稿，選出最好的那個。

```
Retrieved Chunks: [C1, C2, C3, C4, C5]
    ↓
小模型（平行）:
    Draft 1 (基於 C1, C2)
    Draft 2 (基於 C2, C3)
    Draft 3 (基於 C4, C5)
    ↓
大模型（一次驗證）: 選 Draft 2 → 最終答案
```

好處是延遲低（小模型跑得快，而且是平行的）和成本低（大模型只做一次驗證，不做完整生成）。在高吞吐量的場景中，Speculative RAG 可以把延遲降低 30-50%，同時維持接近大模型直接生成的品質。

關鍵洞察：Speculative RAG 本質上是用 compute parallelism 換 latency。如果你的瓶頸是 GPU 不夠而不是延遲太高，這個模式反而會讓事情更糟。

→ 深入閱讀：[Speculative RAG：用小模型平行打草稿，大模型一次驗證](/posts/ai/2026-03-30-speculative-rag)

---

## Gen 8: Agentic RAG

前面所有世代的 RAG 都是**單次流程**：query 進來，跑一遍 pipeline，答案出去。Agentic RAG 打破了這個限制——它讓 LLM 變成一個**自主 Agent**，可以多次搜尋、反思、調整策略。

核心機制是 ReAct loop（Reasoning + Acting）：LLM 先思考（「這個問題需要什麼資訊？」），然後行動（搜尋、呼叫 API、計算），觀察結果，再決定下一步。這個 loop 可以跑多輪，直到 Agent 認為它有足夠的資訊來回答。

Agentic RAG 特別適合**複雜的研究型問題**——那些需要拆解成多個子問題、從不同來源收集資訊、最後綜合成答案的問題。缺點是延遲高（可能跑 3-10 輪），成本高（每輪都是一次 LLM call + 搜尋），而且 Agent 可能走偏。

架構一句話：`Query → Agent(Think → Act → Observe → Think → ...) → Answer`

除了 ReAct，還有 Plan-and-Execute 模式：先讓 LLM 制定完整計劃，再逐步執行。這在需要系統性資訊收集的場景中表現更好。

什麼時候該用 Agentic RAG？一個簡單的判斷標準：如果使用者的問題需要超過一次搜尋才能回答（例如「比較 A 公司和 B 公司的營收成長率」需要分別搜尋兩家公司），就該考慮 Agentic RAG。

→ 深入閱讀：[Agentic RAG：讓 LLM 自己決定要不要再搜尋一次](/posts/ai/2026-03-12-agentic-rag-react-loop)
→ 深入閱讀：[Plan-and-Execute：先規劃再執行的 RAG 模式](/posts/ai/2026-03-12-plan-and-execute-rag)

---

## Gen 9: Multi-Agent RAG

當系統需要覆蓋多個專業領域，單一 Agent 很難做好所有事情。Multi-Agent RAG 的做法是：**每個領域一個專業 Agent，再加一個 Orchestrator 負責分配和彙整**。

例如一個企業知識問答系統：HR Agent 專門搜尋人事制度文件，Legal Agent 搜尋法規合約，Tech Agent 搜尋技術文件。使用者的問題先到 Orchestrator，Orchestrator 判斷該問哪個 Agent（或同時問多個），等結果回來後合併成最終答案。

架構一句話：`Query → Orchestrator → [Agent_HR | Agent_Legal | Agent_Tech] → Merge → Answer`

Multi-Agent 的優勢是每個 Agent 可以有自己的搜尋策略、自己的 prompt、自己的知識庫，互不干擾。挑戰是 Agent 之間的通訊協議設計、結果合併的邏輯、以及整體延遲的控制。

在實務中，Multi-Agent RAG 最大的坑不是技術，而是「agent 之間的責任邊界怎麼劃」。如果兩個 agent 的知識領域有重疊，orchestrator 不知道該問誰，結果反而比單一 agent 更差。

→ 深入閱讀：[Multi-Agent RAG：多個專業 Agent 協作的分散式檢索架構](/posts/ai/2026-03-30-multi-agent-rag-patterns)

---

## Gen 10: LongRAG

LongRAG 挑戰了一個 RAG 的基本假設：**chunk 一定要切小嗎？**

傳統 RAG 把文件切成 256-512 token 的小 chunk，因為早期 LLM 的 context window 小（4K-8K），塞不下太多。但現在的模型動輒 128K-1M context window，這個限制已經不存在了。

LongRAG 的做法是用大 chunk（甚至整份文件），搭配長上下文模型。好處是保留了完整的語境——不再有「答案被切在兩個 chunk 的邊界」的問題。搜尋的精準度要求也降低了，因為 chunk 大，命中率自然高。

架構一句話：`Query → Coarse Search(大 chunk) → Long-Context LLM → Answer`

架構一句話：`Query → Coarse Retrieval (大 chunk) → Long-Context LLM → Answer`

代價是 token 用量暴增（大 chunk 意味著送進 LLM 的 token 數多），延遲也會增加。LongRAG 適合那些對完整性要求高、對成本不那麼敏感的場景，例如法律合約分析、長篇論文問答。

一個有趣的趨勢：隨著 long-context 模型的成本持續下降（Gemini 1.5 Pro 的 1M context 已經相當便宜），LongRAG 的經濟可行性會越來越高。未來可能出現的情況是：小型知識庫直接用 LongRAG（把所有文件塞進 context），只有大型知識庫才需要傳統的 chunking + retrieval。

一個有趣的趨勢：隨著 LLM 的 context window 持續擴大、token 價格持續下降，LongRAG 的「代價」正在快速縮小。2024 年這個做法太貴，2025 年已經值得考慮，2026 年可能成為很多場景的預設選擇。

→ 深入閱讀：[LongRAG：用長上下文模型重新思考 RAG 的 Chunking 策略](/posts/ai/2026-03-30-longrag-long-context-retrieval)

---

## 前沿：Agent Memory

RAG 本質上是**唯讀**的——系統從知識庫裡讀資料，但不會寫回去。Agent Memory 把 RAG 升級成**讀寫系統**。

Agent 在與使用者互動的過程中，會把學到的偏好、事實、決策寫進記憶存儲。下次互動時，這些記憶和知識庫一起被檢索。這讓 Agent 能夠持續學習和個性化，而不只是一個無狀態的問答機器。

記憶系統通常分三層：Working Memory（當前對話的 context）、Episodic Memory（過去對話的摘要）、Semantic Memory（抽取出的事實和偏好）。這三層加上外部知識庫，構成了 Agent 的完整認知系統。

→ 深入閱讀：[Agent Memory 系統：從 RAG 到 Read-Write 記憶的演化](/posts/ai/2026-03-30-agent-memory-systems)

---

## 前沿：Multimodal RAG

文字只是知識的一種形式。很多企業的知識散佈在 PDF 裡的圖表、簡報裡的架構圖、產品照片、甚至影片和錄音中。

Multimodal RAG 把這些非文字內容也納入知識庫。做法有兩種：一是用視覺模型把圖片轉成文字描述再索引（text-centric），二是直接用 multimodal embedding 把圖片和文字映射到同一個向量空間（native multimodal）。

實務上，multimodal RAG 最大的挑戰不是模型能力，而是 pipeline 的複雜度——PDF 解析、表格抽取、圖片 OCR、影片逐幀分析，每一步都可能出錯。

→ 深入閱讀：[Multimodal RAG：把圖片也納入知識庫](/posts/ai/2026-03-12-multimodal-rag)

---

# Part 2：檢索策略

檢索是 RAG 系統的心臟。用錯策略，後面的 LLM 再強也救不回來。以下是主要的檢索策略，以及它們各自解決的問題。

### 檢索策略快速選型

| 你的問題 | 該用什麼 | 為什麼 |
|---------|---------|-------|
| 向量搜尋漏掉精確關鍵字 | Hybrid Search (BM25 + Vector) | 兩種搜尋互補 |
| Query 和文件的用詞不同 | HyDE | 用假設答案橋接語義差距 |
| 單一 query 覆蓋面不足 | Multi-Query Expansion | 多角度搜尋 |
| Top-K 結果排序不準 | Cross-Encoder Reranking | 精準重排 |
| 需要速度又要精準度 | ColBERT | Late interaction 折衷 |
| BM25 太笨但需要稀疏向量 | SPLADE | 學習型稀疏向量 |
| 多路結果要合併 | RRF | 排名融合，免訓練 |
| 結果太同質化 | MMR | 相關性 + 多樣性 |
| Chunk 脫離上下文 | Contextual Retrieval | 加 context 前綴 |
| 不同問題要走不同路徑 | Query Classification | 入口分流 |
| 重複問題太多 | Semantic Caching | 語義快取 |
| 答案在結構化資料中 | Text-to-SQL Router | SQL 比搜尋準 |

### Hybrid Search：BM25 + Vector + RRF

向量搜尋擅長語義匹配，但會漏掉精確的關鍵字。BM25 擅長關鍵字匹配，但不懂語義。Hybrid Search 兩者並用，再透過 RRF（Reciprocal Rank Fusion）合併排名。這是目前生產系統最常見的搜尋架構。

→ [Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)

### HyDE：假設答案搜尋

使用者的問題和文件的語言風格不同，導致向量搜尋的 recall 不高。HyDE 先讓 LLM 生成一個「假設的答案」，再用這個假設答案去搜尋。因為假設答案和真實文件的語言風格更接近，recall 可以提升 10-20%。

→ [HyDE：用假設答案提升向量搜尋的 Recall](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)

### Multi-Query Expansion

一個問題可能有多種問法。Multi-Query 讓 LLM 把原始問題改寫成 3-5 個不同角度的 query，每個都去搜尋，最後合併結果。這能覆蓋到單一 query 漏掉的文件。

→ [Multi-Query Expansion：一個問題，多個角度搜尋](/posts/ai/2026-03-12-multi-query-expansion)

### Cross-Encoder Reranking

向量搜尋用的是 bi-encoder——query 和 document 各自算 embedding 再比較，快但不精準。Cross-Encoder 把 query 和 document 拼在一起送進模型，精準度高很多，但慢。通常的做法：先用向量搜尋拉回 top-50，再用 Cross-Encoder rerank 取 top-5。

→ [Cross-Encoder Reranking：讓最相關的文件排到前面](/posts/ai/2026-03-12-cross-encoder-reranking)

### ColBERT：Late Interaction

ColBERT 是 bi-encoder 和 cross-encoder 之間的折衷。它為 query 和 document 的每個 token 都算一個 embedding，在搜尋時做 token-level 的交互比對。比 bi-encoder 精準，比 cross-encoder 快。

→ [ColBERT：向量搜尋的第三條路](/posts/ai/2026-03-12-colbert-late-interaction)

### SPLADE：學習型稀疏向量

BM25 靠的是 term frequency，SPLADE 用 BERT 學出每個 token 的權重，產生稀疏向量。它同時具備關鍵字匹配（稀疏）和語義理解（學習型）的優點。

→ [SPLADE：比 BM25 更聰明的稀疏向量搜尋](/posts/ai/2026-03-12-splade-sparse-vectors)

### RRF：多路結果融合

當你有多個搜尋結果列表（例如 BM25 的結果和向量搜尋的結果），RRF 用一個簡單的公式根據排名位置合併它們。不需要分數標準化，不需要訓練，即插即用。

→ [RRF：RAG 系統裡多路結果怎麼合併](/posts/ai/2026-03-12-rrf-multi-source-fusion)

### MMR：多樣性重排

如果搜尋結果的 top-5 都在講同一件事，你等於浪費了 4 個 context slot。MMR（Maximal Marginal Relevance）在排名時同時考慮相關性和多樣性，確保結果覆蓋不同面向。

→ [MMR + 熱門度加權：讓推薦結果既相關又多樣](/posts/ai/2026-03-12-mmr-diversity-reranking)

### Contextual Retrieval

Anthropic 提出的方法：在 indexing 階段，對每個 chunk 加上一段 context（「這段出自某份文件的某個章節，在講某個主題」）。搜尋時這段 context 一起被比對，大幅提升 chunk 的可定位性。

→ [Contextual Retrieval：幫每個 Chunk 加上「這段在說什麼」](/posts/ai/2026-03-12-contextual-retrieval)

### Query Classification

不是所有問題都該走同一條路。事實型問題用精確搜尋，分析型問題用深度搜尋，閒聊直接回覆不搜尋。Query Classification 在 pipeline 入口做分類，根據問題類型選擇不同策略。

→ [Query Classification：讓 RAG 知道該怎麼回答這個問題](/posts/ai/2026-03-12-query-classification-adaptive-routing)

### Semantic Caching

語義相近的問題（「台北天氣如何」和「現在台北氣溫多少」）不需要跑兩次完整 pipeline。Semantic Cache 用向量相似度判斷新 query 是否和之前的某個 query 足夠接近，如果是，直接返回快取的答案。

→ [Semantic Caching：語義相近的問題只跑一次 RAG](/posts/ai/2026-03-12-semantic-caching)

### Text-to-SQL Router

有些問題的答案在結構化資料中（資料庫），用向量搜尋反而不如直接寫 SQL。Text-to-SQL Router 判斷問題是否適合轉成 SQL query，如果是，走資料庫路線而不是 RAG。

→ [Text-to-SQL Router：精確查詢不走 RAG](/posts/ai/2026-03-12-text-to-sql-router)

---

# Part 3：基礎設施

RAG 的效果有一半取決於基礎設施的選擇——chunk 怎麼切、embedding 用哪個、向量資料庫怎麼選。這些決定在專案初期就會做出，之後要改的成本很高。

### 基礎設施決策順序

建 RAG 系統時，基礎設施的決策有先後順序。先決定 Chunking 策略（因為它影響後面所有環節），然後選 Embedding 模型（因為一旦選了就很難換——換模型意味著重新 embed 所有文件），接著選向量資料庫，最後設計 prompt。

```
Chunking → Embedding → Vector DB → Prompt Design → Streaming
   ↑                                                    ↓
   └──── 如果效果不好，通常要從這裡開始改 ────────────────┘
```

### Chunking 策略

切塊方式直接決定 RAG 能不能找到答案。切太小會失去上下文，切太大會混入噪音。常見策略包括：固定大小、基於段落/句子、遞迴切分、語義切分（根據 embedding 相似度判斷分界點）。沒有「最佳大小」——要根據你的文件類型和問題類型實驗。

→ [Chunking 策略：切塊方式決定 RAG 能不能找到答案](/posts/ai/2026-03-12-chunking-strategies)

### Embedding 模型選型

繁體中文的 RAG 系統，embedding 模型的選擇特別重要。BGE-M3 是目前繁中表現最好的多語言模型之一，同時支持 dense、sparse 和 multi-vector retrieval。選模型要看：語言覆蓋、維度大小、最大 token 長度、以及在你自己的資料上的 benchmark。

→ [BGE-M3：為什麼這個 Embedding 模型適合繁體中文 RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)

### 向量資料庫選型

Pinecone（全託管、最省事）、Weaviate（開源、hybrid search 內建）、Qdrant（Rust 寫的、效能好）、Cloudflare Vectorize（邊緣部署）——每個都有不同的取捨。選型要考慮：部署模式、規模、hybrid search 支持、metadata filtering、成本。

→ [Vector Database 選型：Pinecone、Weaviate、Qdrant、Vectorize 怎麼選](/posts/ai/2026-03-12-vector-database-comparison)

### Prompt 設計

RAG 的 prompt 設計不只是「把 context 塞進去」。要注意：context 和 instruction 的位置安排、引用格式、如何指示 LLM 在 context 不足時說「我不知道」、以及如何讓 LLM 標註答案來源。好的 prompt 設計能讓同一批 retrieved chunks 產出品質差異巨大的答案。

→ [RAG Prompt Engineering：System Prompt 和 Context 怎麼設計](/posts/ai/2026-03-12-rag-prompt-engineering)

### Streaming

使用者不想等 10 秒才看到完整答案。SSE（Server-Sent Events）讓 LLM 的回答邊生成邊顯示，大幅改善使用者體驗。實作時要注意 streaming 狀態下的 citation 處理、error handling、以及 abort 機制。

→ [RAG Streaming：SSE 讓 LLM 回答邊生成邊顯示](/posts/ai/2026-03-12-rag-streaming-sse)

### 個性化與記憶

讓 RAG 系統記住使用者的偏好——語言風格、常問的主題、上次對話的脈絡。這不只是 chat history，而是從對話中抽取結構化的偏好資料，在下次搜尋和生成時作為額外的 context。

→ [RAG 個性化：從對話中學習用戶偏好](/posts/ai/2026-03-12-memory-personalization)

---

# Part 4：品質與營運

RAG 系統上線只是開始。真正的挑戰是：怎麼知道它表現好不好？怎麼防止它出包？怎麼在控制成本的同時持續改進？

### 品質營運的優先順序

如果你剛上線，建議按這個順序建立品質基礎設施：

1. **Evaluation**（先能衡量，才能改善）
2. **Failure Modes**（知道會在哪裡壞）
3. **Guardrails**（防止最嚴重的錯誤）
4. **Observability**（出問題時能找到原因）
5. **Cost Optimization**（在品質穩定後再省錢）
6. **A/B Testing**（有了基線後才能比較）

### 評估框架

你不能改善你不能衡量的東西。RAGAS、DeepEval、TruLens 是三個主流的 RAG 評估框架，各自提供不同的指標：Faithfulness（答案是否忠於 context）、Relevance（檢索結果是否相關）、Answer Correctness（答案是否正確）。建議在 CI 中跑自動化評估，每次 pipeline 變更都有數字。

→ [RAG 評估框架：RAGAS、DeepEval、TruLens 怎麼用](/posts/ai/2026-03-12-rag-evaluation-frameworks)

### LLM-as-Judge

當你沒有大量 human-labeled 測試資料時，可以用另一個 LLM 來評估 RAG 的輸出。Self-Reflection 讓生成答案的 LLM 自己評分，LLM-as-Judge 用一個獨立的 LLM 評分。兩者都有偏差，但作為快速迭代的信號已經夠用。

→ [Self-Reflection + LLM-as-Judge：讓 AI 評估自己的回答](/posts/ai/2026-03-12-self-reflection-llm-as-judge)

### 常見失敗模式

RAG 系統有十種以上的常見失敗模式：chunk 切錯位導致答案不完整、embedding 語義偏移、reranking 反而把對的結果排掉、LLM 無視 context 自己幻覺、context window 塞太滿反而降低品質。知道這些 failure mode 才能針對性地修。

→ [RAG 常見失敗模式：10 種問題和對應的解法](/posts/ai/2026-03-12-rag-failure-modes)

### Guardrails

RAG 系統的輸入和輸出都需要防護。輸入端：防止 prompt injection、過濾敏感查詢。輸出端：檢查 hallucination、過濾有害內容、確保答案有 citation 支持。Guardrails 不是 nice-to-have，是生產系統的必要條件。

→ [RAG Guardrails：在輸入和輸出加一道防線](/posts/ai/2026-03-12-rag-guardrails)

### 可觀測性

RAG pipeline 有很多環節，任何一個出問題都會影響最終答案。可觀測性的目標是讓這個黑盒子變透明：每一次查詢的每一步（query rewrite 的結果、搜尋回來的 chunks、reranking 後的順序、LLM 的完整 prompt）都要能追蹤和回放。

→ [RAG Observability：黑盒子變透明的 17 步追蹤](/posts/ai/2026-03-12-rag-observability-tracing)
→ [RAG 可觀測性工具全景](/posts/ai/2026-03-12-rag-observability-tools)

### 成本優化

RAG 的成本主要來自三個地方：embedding 計算、向量搜尋、LLM 生成。每一個都有優化空間——embedding cache、chunk 壓縮、小模型 + 大模型分層、semantic caching、token quota 系統。目標是在不犧牲品質的前提下，把每次查詢的成本壓到最低。

→ [RAG 成本優化：把每次查詢的花費壓到最低](/posts/ai/2026-03-12-rag-cost-optimization)
→ [RAG 配額系統](/posts/ai/2026-03-12-rag-token-quota-system)

### A/B 測試

你換了一個 reranking 模型，品質變好了還是變差了？你把 chunk size 從 512 改成 1024，效果如何？RAG 的 A/B 測試比 web A/B 測試複雜得多——你要比較的是兩個完整 pipeline 的表現，指標是語義層面的（答案品質），不是點擊率。

→ [RAG A/B 測試：怎麼科學地比較兩個 Pipeline 配置](/posts/ai/2026-03-12-rag-ab-testing)

### 冷啟動

新系統上線時，知識庫是空的或很少。怎麼讓系統在這個階段也能用？常見策略：預載公開知識、用 LLM 自身知識做 fallback、引導使用者上傳文件、用 few-shot 範例展示系統能力。

→ [RAG 冷啟動：沒有資料時怎麼讓系統能用](/posts/ai/2026-03-12-rag-cold-start)

### RAG vs Fine-tuning

不是所有問題都該用 RAG 解決。如果知識是靜態的、query pattern 是固定的、而且你有足夠的訓練資料，fine-tuning 可能更適合。實務上最強的做法是兩者結合：fine-tune 讓模型學會「怎麼用 context」，RAG 提供最新的 context。

→ [RAG vs Fine-tuning：不是非此即彼](/posts/ai/2026-03-12-rag-vs-fine-tuning)

---

# 怎麼選 RAG 世代？

面對十個世代，最常見的問題是：「我該用哪一代？」

答案取決於你的問題複雜度和資源限制：

```
你的問題需要幾次搜尋就能回答？

只要一次 ──→ Gen 1-3 (Naive/Advanced/Modular)
    │           ├─ 剛起步？ → Gen 1 Naive
    │           ├─ 品質不夠？ → Gen 2 Advanced
    │           └─ 需要彈性？ → Gen 3 Modular
    │
有時不需要搜尋 ──→ Gen 4 Self-RAG
    │
搜尋結果常常不對 ──→ Gen 5 CRAG
    │
需要關係推理 ──→ Gen 6 Graph RAG
    │
延遲要求很高 ──→ Gen 7 Speculative RAG
    │
需要多步推理 ──→ Gen 8 Agentic RAG
    │
多個專業領域 ──→ Gen 9 Multi-Agent RAG
    │
文件很長且不能切碎 ──→ Gen 10 LongRAG
```

重要提醒：**世代不是線性升級**。Gen 10 不一定比 Gen 2 好——它們解決不同的問題。一個設計良好的 Advanced RAG（Gen 2）在大多數場景下會比一個設計糟糕的 Agentic RAG（Gen 8）表現更好。選擇世代的依據是你的問題特性，不是越新越好。

---

# 閱讀路線推薦

根據你的目標，選一條路線走：

### MVP 路線：最快把 RAG 跑起來

如果你要在最短時間內建一個能用的 RAG 系統：

1. [RAG 的三個世代](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution) — 理解基本架構
2. [Chunking 策略](/posts/ai/2026-03-12-chunking-strategies) — 把文件切好
3. [BGE-M3 Embedding](/posts/ai/2026-03-12-bge-m3-embedding-model-selection) — 選對 embedding 模型
4. [Vector Database 選型](/posts/ai/2026-03-12-vector-database-comparison) — 選一個向量資料庫
5. [RAG Prompt Engineering](/posts/ai/2026-03-12-rag-prompt-engineering) — 寫好 prompt

### 品質提升路線：讓答案更準確

如果你的 RAG 已經在跑，但答案品質不夠好：

1. [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) — 彌補向量搜尋的盲區
2. [Cross-Encoder Reranking](/posts/ai/2026-03-12-cross-encoder-reranking) — 提升排名精準度
3. [HyDE](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings) — 改善 recall
4. [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks) — 用數字衡量改進
5. [RAG 常見失敗模式](/posts/ai/2026-03-12-rag-failure-modes) — 找到具體問題點

### 進階架構路線：處理更複雜的問題

如果你需要的不只是簡單的問答：

1. [CRAG](/posts/ai/2026-03-12-corrective-rag-crag) — 搜尋失敗的容錯機制
2. [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop) — 多步推理
3. [GraphRAG](/posts/ai/2026-03-12-graph-rag) — 關係推理
4. [Speculative RAG](/posts/ai/2026-03-30-speculative-rag) — 低延遲高吞吐

### 生產營運路線：穩定地跑在線上

如果你要把 RAG 系統上生產：

1. [RAG Guardrails](/posts/ai/2026-03-12-rag-guardrails) — 輸入輸出防護
2. [RAG Observability](/posts/ai/2026-03-12-rag-observability-tracing) — 全鏈路追蹤
3. [RAG 成本優化](/posts/ai/2026-03-12-rag-cost-optimization) — 控制花費
4. [RAG A/B 測試](/posts/ai/2026-03-12-rag-ab-testing) — 科學地比較配置

### 前沿探索路線：看看未來

如果你想了解 RAG 的最新發展：

1. [Multi-Agent RAG](/posts/ai/2026-03-30-multi-agent-rag-patterns) — 多 Agent 協作
2. [LongRAG](/posts/ai/2026-03-30-longrag-long-context-retrieval) — 長上下文新思路
3. [Agent Memory](/posts/ai/2026-03-30-agent-memory-systems) — 讀寫記憶系統
4. [Multimodal RAG](/posts/ai/2026-03-12-multimodal-rag) — 多模態知識庫

---

## 最後一句話

RAG 不是一個技術，是一個技術體系。

不要試圖一次學完所有東西。找到你現在最需要解決的問題，沿著對應的路線走進去，把那一塊搞懂、搞穩，再往下一個主題前進。

這篇指南會持續更新。每當有新的專文發布，這裡會同步加上連結。

## 參考資料

- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al. (2024)，涵蓋 Naive RAG、Advanced RAG、Modular RAG 三代演化的完整綜述
- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection](https://arxiv.org/abs/2310.11511) — Asai et al. (2023)，Self-RAG 原始論文，自主決定是否檢索的反思機制
- [Corrective Retrieval Augmented Generation](https://arxiv.org/abs/2401.15884) — Yan et al. (2024)，CRAG 論文，透過評估器修正不良檢索結果
- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) — Edge et al. (2024)，Microsoft GraphRAG 原始論文，知識圖譜加強全域查詢
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) — Singh et al. (2025)，Agentic RAG 系統分類學與演化路徑綜述
- [Searching for Best Practices in Retrieval-Augmented Generation](https://arxiv.org/abs/2407.01219) — Wang et al. (2024)，RAG pipeline 各元件最佳組合的實驗性研究
- [Multi-Head RAG: Solving Multi-Aspect Problems with LLMs](https://arxiv.org/abs/2406.05085) — Besta et al. (2024)，利用多頭注意力機制提升多面向查詢的檢索準確率
