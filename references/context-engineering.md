# Context Engineering 參考

## 定義與起源

**Context Engineering** 是設計動態系統的工程學科，確保在每次 LLM 推理步驟中提供正確的資訊和工具、以正確的格式、在正確的時間點送入模型。

更精確地說：**「策劃和維護最佳 token 集合的一整套策略」** — 涵蓋所有到達模型的資訊，不僅僅是手寫的 prompt。

### 術語誕生（2025 年 6 月）

**Tobi Lutke**（Shopify CEO，2025/6/22）：
> "I really like the term 'context engineering' over prompt engineering. It describes the core skill better: the art of providing all the context for the task to be plausibly solvable by the LLM."

**Andrej Karpathy**（前 Tesla/OpenAI，2025/6/27）：
> "+1 for 'context engineering' over 'prompt engineering'... In every industrial-strength LLM app, context engineering is the delicate art and science of filling the context window with just the right information for the next step."

**Simon Willison**（2025/6/27）：認為這個詞會留下來，因為它的「推斷定義」比 prompt engineering 更準確。

**Cognition AI**（Devin 團隊）：「Context engineering is effectively the #1 job of engineers building AI agents.」

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

> "Prompt engineering walked so context engineering could run."

---

## 核心心智模型

### Karpathy 的 LLM 作業系統類比

> LLM = CPU，Context Window = RAM（工作記憶）

就像作業系統管理 CPU 的 RAM 一樣，context engineering 管理 LLM 的 context window。

### Letta 的 Kernel/User Space 模型

**Kernel Context**（受管理的可變狀態）：
- Agent 配置（system prompts、tools）
- Memory blocks（有硬體大小限制、metadata 標籤的持久化單元）
- Files（已開啟/已載入 vs 已關閉/僅存 metadata）
- 透過受控介面（「system calls」）修改

**User Context**（訊息流）：
- 對話、外部 context、system calls
- 修改 kernel space 的 tool interactions

### Context Window 六大組成

1. **System prompt** — 行為指令和架構
2. **Tool schemas** — 可用行動的規格
3. **System metadata** — Agent 狀態的統計資料
4. **Memory blocks** — 持久化的 context 單元
5. **Files & Artifacts** — 文件和可編輯內容
6. **Message buffer** — 對話流 + tool interactions

---

## 四大核心策略（LangChain 框架）

### 基本原則

> 找到最小的高信號 token 集合，最大化期望結果的可能性。

聚焦的 300 token context 常常優於散漫的 113,000 token context。不是量多就好，是**相關**才好。

### 1. Write（寫入）

將資訊保存在 context window 之外，供後續檢索。

- **Scratchpads**：Agent 在任務中透過 tool calls 記筆記。Anthropic 的 multi-agent researcher 將計劃持久化到記憶中以避免截斷。
- **Memories**：跨 session 的持久資訊，三種類型：
  - **Episodic**：期望行為的範例
  - **Procedural**：引導指令和工作流程
  - **Semantic**：任務相關的事實和知識
- **實例**：ChatGPT 自動生成記憶、Cursor/Windsurf 儲存專案 context、Claude Code 使用 `CLAUDE.md`

### 2. Select（選取）

在需要時將相關資訊拉入 context window。

- **From Scratchpads**：Tools 讀取 scratchpad 資料，開發者控制每步曝光的狀態
- **From Memories**：Embeddings 和知識圖譜實現語意檢索
- **From Tools**：RAG 應用於 tool descriptions 可降低混淆，研究顯示 tool 選擇準確度提升 **3 倍**
- **From Knowledge**：大型 codebase 的 RAG 需組合方法 — grep/file search + knowledge graph + re-ranking

### 3. Compress（壓縮）

僅保留必要的 tokens。

- **Summarization**：遞迴或階層式方法壓縮 agent trajectories。Claude Code 在 95% context 使用率時自動壓縮。
- **Trimming**：硬編碼啟發式方法移除較舊訊息，或使用訓練過的 pruner
- **Contextual Compression**：基於當前對話 context 過濾檢索到的內容

### 4. Isolate（隔離）

將 context 分散到不同元件。

- **Multi-Agent Systems**：每個 Agent 有特定的 tools、instructions 和隔離的 context。Anthropic 的 multi-agent researcher 透過平行 context「同時探索不同面向」取得更好結果。
- **Environment Sandboxing**：在 sandbox 中執行程式碼，隔離 token-heavy objects（圖片、音訊）
- **State Objects**：Schema-based 狀態隔離，每步只曝光必要資訊

---

## 具體技術

### System Prompts 設計

- 找到「正確的高度」：具體到足以引導，靈活到保有自主性
- 避免硬編碼的脆弱 if-else 邏輯
- 用 XML tags 或 Markdown headers 組織不同段落（`<background_information>`、`## Tool guidance`）
- 從最小開始，根據觀察到的失敗模式增加清晰度
- 包含時間 context（當前日期/時間）防止幻覺

### Tool Definitions 設計

- 確保清晰度和最小功能重疊
- Tools 要自包含且對錯誤穩健
- Input parameters 要描述性且明確
- 避免膨脹的工具集（如果人類無法選對工具，Agent 也不行）
- 回傳 token-efficient 的資訊

### Memory 系統

三層架構：
- **Short-term memory**：活躍的 context window（當前推理 + tool outputs）
- **Working memory**：多步任務的暫時空間
- **Long-term memory**：外部儲存（vector DBs）存放 episodic、semantic、procedural 知識

關鍵原則：**選擇性勝過完整性**。有效系統用重要性評分過濾哪些互動值得長期儲存。

### Conversation History 管理

- **Compaction/Summarization**：接近 context 限制時壓縮歷史（Claude Code 在 95% 使用率時自動壓縮）
- **保留關鍵決策**：架構決策、未解決問題、策略性教訓在壓縮中存活
- **Trimming**：用啟發式方法或訓練過的 pruner 移除較舊訊息

### Context Rot 防治

延長的對話累積錯誤嘗試和矛盾資訊，降低效能（「context rot」）。解法：
- 定期 summary checkpoints
- 結構化的 context boundaries 標記階段
- 帶必要 carryover 的全新 context 刷新
- Sub-agent 架構回傳精簡摘要（1,000–2,000 tokens）

### 注意力預算問題

Transformer 架構對 n 個 token 需要 n² 的成對關係計算，長 context 會稀釋注意力。這就是為什麼聚焦的 300 token context 能勝過 113,000 token context — 重點不是量，是信號密度。

---

## 最佳實踐

### 設計原則

1. **最小可行 context**：找到每步的最小高信號 token 集
2. **做能用的最簡單方案**：從最小開始，需要時才加複雜度
3. **先建觀測**：用 tracing/observability 工具追蹤 token 使用和最佳化機會
4. **測試影響**：評估 context engineering 變更是否真的改善效能
5. **組合策略**：最有效的系統混合多種方法（memories + RAG + compression）
6. **視 context 為稀缺資源**：每個 token 都在競爭模型的注意力預算

### Anthropic 實務指南

- **System prompt 校準**：在脆弱硬編碼邏輯和模糊指引之間平衡
- **混合檢索模型**：速度關鍵資料預先檢索；完整性靠自主探索
- **結構化筆記**：Agent 維護跨 context 重置持久化的外部筆記（如 Claude 玩 Pokemon 跨數千步維護計數）
- **Sub-agent 委派**：專業化 sub-agent 處理聚焦任務，帶著乾淨 window，回傳精簡摘要給 coordinator

### 反模式

- **過度填充 context**：太多或不相關的 context 降低效能（注意力預算有限）
- **忽略 context rot**：長對話累積噪音；要規劃定期 compaction
- **靜態 context**：產品級系統需要動態、runtime 的 context 組裝
- **模糊的 system prompts**：提供具體信號，不是高層級空話
- **膨脹的工具集**：工具越多越混亂；積極精選

---

## AI 工程三階段演化中的定位

| 階段 | 時期 | 核心關注 |
|------|------|---------|
| **Phase 1: Prompt Engineering** | 2022–2024 | 單輪語法最佳化（CoT、Few-shot、Role-playing） |
| **Phase 2: Context Engineering** | 2025 | 「給什麼資訊」比「怎麼問」重要（RAG、Memory、Tool Definitions） |
| **Phase 3: Harness Engineering** | 2026 | 生命週期管理、狀態持久化、回饋迴路 |

Context Engineering 是從「怎麼跟 LLM 說話」到「怎麼建構 LLM 的完整資訊環境」的範式轉移。

---

## 參考文獻

### 學術論文

1. "A Survey of Context Engineering for Large Language Models" (Jul 2025) — https://arxiv.org/abs/2507.13334
2. "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models" (Oct 2025) — https://arxiv.org/abs/2510.04618
3. "MemGPT: Towards LLMs as Operating Systems" (Oct 2023, 先驅工作) — https://arxiv.org/abs/2310.08560

### 關鍵人物原始發言

4. Tobi Lutke tweet (2025/6/22) — https://x.com/tobi/status/1935533422589399127
5. Andrej Karpathy tweet (2025/6/27) — https://x.com/karpathy/status/1937902205765607626
6. Simon Willison blog (2025/6/27) — https://simonwillison.net/2025/jun/27/context-engineering/

### 權威技術文章

7. Anthropic "Effective Context Engineering for AI Agents" — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
8. LangChain "Context Engineering for Agents"（Write/Select/Compress/Isolate 框架） — https://blog.langchain.com/context-engineering-for-agents/
9. Letta "Anatomy of a Context Window: A Guide to Context Engineering" — https://www.letta.com/blog/guide-to-context-engineering
10. Prompting Guide "Context Engineering Guide" — https://www.promptingguide.ai/guides/context-engineering-guide

### 業界分析

11. Gartner "Context Engineering: Why It's Replacing Prompt Engineering" — https://www.gartner.com/en/articles/context-engineering
12. Neo4j "Why AI Teams Are Moving From Prompt Engineering to Context Engineering" — https://neo4j.com/blog/agentic-ai/context-engineering-vs-prompt-engineering/
13. Weaviate "Context Engineering - LLM Memory and Retrieval for AI Agents" — https://weaviate.io/blog/context-engineering
14. Elastic "Context engineering: LLM evolution for agentic AI" — https://www.elastic.co/search-labs/blog/context-engineering-llm-evolution-agentic-ai

### 社群資源

15. Addy Osmani "Context Engineering: Bringing Engineering Discipline to Prompts" — https://addyo.substack.com/p/context-engineering-bringing-engineering
16. Towards Data Science "Why Context Is the New Currency in AI" — https://towardsdatascience.com/why-context-is-the-new-currency-in-ai-from-rag-to-context-engineering/
17. Jason Liu "Beyond Chunks: Why Context Engineering is the Future of RAG" — https://jxnl.co/writing/2025/08/27/facets-context-engineering/
18. Firecrawl "Context Engineering vs Prompt Engineering for AI Agents" — https://www.firecrawl.dev/blog/context-engineering
19. GitHub "Context Engineering" handbook — https://github.com/davidkimai/Context-Engineering
