# Context Engineering 參考

## 目錄

1. [定義](#定義)
2. [Context Engineering vs Prompt Engineering](#context-engineering-vs-prompt-engineering)
3. [四大核心策略](#四大核心策略)
4. [注意力預算問題](#注意力預算問題)
5. [Context Rot 防治](#context-rot-防治)
6. [最佳實踐與反模式](#最佳實踐與反模式)
7. [AI 工程三階段](#ai-工程三階段)
8. [參考文獻](#參考文獻)

---

## 定義

設計動態系統的工程學科，確保每次 LLM 推理步驟中提供正確的資訊和工具、以正確的格式、在正確的時間點送入模型。核心目標：**策劃和維護最佳 token 集合的一整套策略**。

---

## Context Engineering vs Prompt Engineering

| 維度 | Prompt Engineering | Context Engineering |
|------|-------------------|-------------------|
| **範圍** | 單次 input-output | 模型在所有互動中看到的一切 |
| **焦點** | 對模型說什麼 | 模型說話時知道什麼 |
| **本質** | 離散、一次性任務 | 迭代、每次推理都發生 |
| **規模** | prompt 中的文字指令 | system prompt + tools + RAG + memory + history + metadata |
| **目標** | 巧妙措辭獲得更好回應 | 系統化的資訊架構實現可靠結果 |
| **產出** | Demo 品質結果 | Production-grade 可靠 AI 系統 |
| **關係** | — | Prompt engineering 是 context engineering 的子集 |

---

## 四大核心策略

原則：聚焦的 300 token context 常優於散漫的 113,000 token context。重點是**信號密度**，不是量。

### 1. Write（寫入）— 保存資訊供後續檢索

- **Scratchpads**：Agent 在任務中透過 tool calls 記筆記，避免截斷
- **Memories**：跨 session 持久資訊，分三類：
  - **Episodic**（行為範例）、**Procedural**（工作流程）、**Semantic**（事實知識）
- 實例：ChatGPT 記憶、Cursor 專案 context、Claude Code 的 `CLAUDE.md`

### 2. Select（選取）— 需要時拉入相關資訊

- RAG 應用於 tool descriptions 可降低混淆，tool 選擇準確度提升 **3 倍**
- 大型 codebase 需組合方法：grep/file search + knowledge graph + re-ranking
- 選擇性勝過完整性：用重要性評分過濾值得儲存的互動

### 3. Compress（壓縮）— 僅保留必要 tokens

- **Summarization**：遞迴或階層式壓縮 agent trajectories（Claude Code 在 95% context 使用率時自動壓縮）
- **Trimming**：啟發式方法移除較舊訊息，或訓練過的 pruner
- **Contextual Compression**：基於當前對話 context 過濾檢索內容

### 4. Isolate（隔離）— 分散 context 到不同元件

- **Multi-Agent**：每個 Agent 有專用 tools、instructions、隔離 context
- **Environment Sandboxing**：隔離 token-heavy objects（圖片、音訊）
- **State Objects**：Schema-based 狀態隔離，每步只曝光必要資訊
- Sub-agent 回傳精簡摘要（1,000–2,000 tokens）給 coordinator

---

## 注意力預算問題

Transformer 對 n 個 token 需要 n² 的成對關係計算。長 context 稀釋注意力，導致模型「看到但忽略」關鍵資訊。每個 token 都在競爭模型的注意力預算 — 不相關的 token 不是零成本，是**負成本**。

---

## Context Rot 防治

延長的對話累積錯誤嘗試和矛盾資訊，導致效能持續下降。解法：

- 定期 summary checkpoints
- 結構化 context boundaries 標記階段
- 帶必要 carryover 的全新 context 刷新
- Sub-agent 架構回傳精簡摘要
- 保留關鍵決策（架構決策、未解決問題、策略性教訓）在壓縮中存活

---

## 最佳實踐與反模式

### 最佳實踐

1. **最小可行 context**：每步找最小高信號 token 集
2. **從最小開始**：需要時才加複雜度
3. **先建觀測**：用 tracing 工具追蹤 token 使用和最佳化機會
4. **混合檢索**：速度關鍵資料預先檢索；完整性靠自主探索
5. **結構化筆記**：Agent 維護跨 context 重置持久化的外部筆記
6. **組合策略**：最有效的系統混合 memories + RAG + compression

### 反模式

- **過度填充 context**：不相關 context 不是零成本，是負成本
- **忽略 context rot**：長對話必須規劃定期 compaction
- **靜態 context**：產品級系統需要動態、runtime 的 context 組裝
- **模糊 system prompts**：提供具體信號，不是高層級空話
- **膨脹工具集**：工具越多越混亂；如果人類無法選對工具，Agent 也不行

---

## AI 工程三階段

| 階段 | 時期 | 核心關注 |
|------|------|---------|
| **Phase 1: Prompt Engineering** | 2022–2024 | 單輪語法最佳化（CoT、Few-shot、Role-playing） |
| **Phase 2: Context Engineering** | 2025 | 「給什麼資訊」比「怎麼問」重要（RAG、Memory、Tool Definitions） |
| **Phase 3: Harness Engineering** | 2026 | 生命週期管理、狀態持久化、回饋迴路 |

---

## 參考文獻

### 學術論文

1. "A Survey of Context Engineering for Large Language Models" (Jul 2025) — https://arxiv.org/abs/2507.13334
2. "Agentic Context Engineering" (Oct 2025) — https://arxiv.org/abs/2510.04618
3. "MemGPT: Towards LLMs as Operating Systems" (Oct 2023) — https://arxiv.org/abs/2310.08560

### 權威技術文章

4. Anthropic "Effective Context Engineering for AI Agents" — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
5. LangChain "Context Engineering for Agents"（Write/Select/Compress/Isolate 框架）— https://blog.langchain.com/context-engineering-for-agents/
6. Letta "Anatomy of a Context Window" — https://www.letta.com/blog/guide-to-context-engineering
7. Prompting Guide "Context Engineering Guide" — https://www.promptingguide.ai/guides/context-engineering-guide

### 業界分析

8. Gartner "Context Engineering: Why It's Replacing Prompt Engineering" — https://www.gartner.com/en/articles/context-engineering
9. Neo4j "Context Engineering vs Prompt Engineering" — https://neo4j.com/blog/agentic-ai/context-engineering-vs-prompt-engineering/
10. Weaviate "Context Engineering - LLM Memory and Retrieval" — https://weaviate.io/blog/context-engineering
11. Elastic "Context engineering: LLM evolution for agentic AI" — https://www.elastic.co/search-labs/blog/context-engineering-llm-evolution-agentic-ai

### 社群資源

12. Addy Osmani "Context Engineering: Bringing Engineering Discipline to Prompts" — https://addyo.substack.com/p/context-engineering-bringing-engineering
13. Towards Data Science "Why Context Is the New Currency in AI" — https://towardsdatascience.com/why-context-is-the-new-currency-in-ai-from-rag-to-context-engineering/
14. Jason Liu "Beyond Chunks: Why Context Engineering is the Future of RAG" — https://jxnl.co/writing/2025/08/27/facets-context-engineering/
15. Firecrawl "Context Engineering vs Prompt Engineering" — https://www.firecrawl.dev/blog/context-engineering
16. GitHub "Context Engineering" handbook — https://github.com/davidkimai/Context-Engineering
