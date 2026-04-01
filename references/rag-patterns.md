# RAG 系統模式參考

## RAG 世代演化

RAG 的分類依來源粒度不同，從 3 代到 10 種都有。以下採用學術界與業界較廣泛認可的分類架構。

> **分類依據：**
> - 3 代分類：Gao et al. (2024) — 最多引用的 RAG 綜述
> - 5 代分類：Singh et al. (2025) — Agentic RAG Survey (`arxiv:2501.09136`)
> - 10 類分類：Vamsikd (Medium, 2025) — 最細粒度分類

### Generation 1: Naive RAG（2020–2023）

三步驟：Index → Search → Generate。最基礎的 RAG 實作。

**架構：** `Query → Embedding → Vector Search → Top-K Chunks → LLM → Answer`

- 基於關鍵字（BM25/TF-IDF）或基礎 dense retrieval
- 靜態、一次性檢索，沒有回饋迴路
- 簡單 chunking 策略（固定大小窗口）

**問題：**
- Recall 問題：query 和文件用語不同、語意壓縮、一詞多義
- Precision 問題：context 噪音、無關文件、缺少 reranking
- Generation 問題：context window 管理不善、幻覺

**適用：** FAQ bot、基礎知識助手、MVP 原型

**參考：** Lewis et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020, Facebook AI)

---

### Generation 2: Advanced RAG（2023–2024）

在 Naive 基礎上加入 pre-retrieval 和 post-retrieval 處理階段。

**架構：** `Query → [Rewriting/HyDE/Expansion] → Hybrid Search → [Re-Ranking] → Context Compression → LLM → Answer`

- **Pre-retrieval：** Query Rewriting、HyDE、Multi-Query Expansion、Query Decomposition
- **Retrieval：** Hybrid Search（BM25 + Vector + RRF）、Dense Passage Retrieval
- **Post-retrieval：** Cross-Encoder Reranking、ColBERT、MMR 去重、Context Compression
- **Generation：** Context 排序、Token 預算管理

**限制：** 仍是線性 pipeline，無法迭代精煉，多步推理仍困難

**適用：** 領域特定 QA、企業搜尋、需要高準確度的客服

---

### Generation 3: Modular RAG（2024）

把 RAG 設計成可組合的 DAG Pipeline，元件可插拔替換。

**架構：** `Query → [Router] → [Search / Memory / API / DB Module] → [Fusion] → LLM`

- Plug-and-play 元件設計（retriever、generator、evaluator、router）
- Hybrid 檢索策略：sparse + dense + structured
- 外部 API、資料庫、工具整合
- 基於規則或 ML 的路由到不同模組
- PipelineStep 介面：`skipWhen`、`timeout`、`execute`
- Plugin 架構：HyDE、Multi-Query、CRAG 等可插拔

**限制：** 工程複雜度高、元件整合需要仔細設計、仍是人為設計的工作流（無自主決策）

**適用：** 跨多資料源的企業搜尋（SQL + PDFs + APIs）、研究助手、AI copilot

**參考：** Gao et al. "Retrieval-Augmented Generation for Large Language Models: A Survey" (Dec 2023, revised Mar 2024) — https://arxiv.org/abs/2312.10997

---

### Generation 4: Self-RAG（2023–2024）

LLM 自己決定是否需要檢索，並用特殊 reflection tokens 自我評估輸出品質。

**關鍵特徵：**
- **Adaptive on-demand retrieval** — 模型自己判斷 IF 需要檢索
- 插入特殊 **reflection tokens** 進行自我批評
- 可多次檢索或完全跳過檢索
- 細粒度自我評估：relevance、factuality、quality
- 需要端到端訓練（非 plug-and-play）

**限制：** 需要專門的模型訓練、reflection token 管理複雜、訓練資料需要獨立的 critic model 生成

**參考：** Asai et al. "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection" (Oct 2023, **ICLR 2024 Oral — top 1%**) — https://arxiv.org/abs/2310.11511

---

### Generation 5: Corrective RAG / CRAG（2024）

檢索後先評估文件相關性，不相關就觸發修正行動。

**關鍵特徵：**
- 輕量級 retrieval evaluator 評估文件相關性
- 三向分類：**Correct / Incorrect / Ambiguous**
- 觸發行動：使用已檢索文件、回退到網路搜尋、擴展查詢
- Decompose-then-recompose 算法選擇性萃取關鍵資訊
- **Plug-and-play** — 可與任何 RAG 方法耦合

**限制：** 額外的評估元件增加 pipeline 複雜度、evaluator 品質是瓶頸

**參考：** Yan et al. "Corrective Retrieval Augmented Generation" (Jan 2024) — https://arxiv.org/abs/2401.15884

---

### Generation 6: Graph RAG（2024）

整合圖結構（知識圖譜）與 RAG，支援關係推理和主題級查詢。

**關鍵特徵：**
- 從文件中萃取 entity-relationship 結構
- 透過 graph traversal 實現多跳推理
- Community detection 和階層式摘要
- 支援主題級查詢（如「所有供應商合約的合規風險？」）
- 五大元件：Query Processor、Retriever、Organizer、Generator、Graph Data Source

**Graph RAG 變體（2024）：**

| 變體 | 核心差異 |
|------|---------|
| **Microsoft GraphRAG** | 完整 KG + entity extraction + community summaries |
| **KAG**（Ant Group） | 強調圖完整性和可解釋性 |
| **Fast GraphRAG** | 省略 community generation |
| **LightRAG** | 移除 community structures 提升效率 |
| **LazyGraphRAG** | 用 local models 取代 LLM-based extraction |

**限制：** 需要知識圖譜基礎設施、依賴高品質圖資料、大規模資料的可擴展性挑戰

**參考：**
- Microsoft GraphRAG (open-sourced mid-2024)
- Han et al. "Retrieval-Augmented Generation with Graphs (GraphRAG)" (Jan 2025) — https://arxiv.org/abs/2501.00309
- "Graph Retrieval-Augmented Generation: A Survey" (Aug 2024, ACM TOIS) — https://arxiv.org/abs/2408.08921

---

### Generation 7: Speculative RAG（2024）

雙模型框架：小模型平行生成多個草稿，大模型一次驗證選擇最佳答案。

**架構：**
- **RAG Drafter**（小型專家模型）：從不同文件子集平行生成多個答案草稿
- **RAG Verifier**（大型通用模型）：單次驗證所有草稿

**效能：**
- 準確度提升最高 **12.97%**（PubHealth）
- 延遲降低最高 **50.83%**
- SOTA：TriviaQA、MuSiQue、PopQA、PubHealth、ARC-Challenge

**參考：** Wang et al. "Speculative RAG: Enhancing Retrieval Augmented Generation through Drafting" (Jul 2024, **ICLR 2025**) — https://arxiv.org/abs/2407.08223

---

### Generation 8: Agentic RAG（2024–2025）

自主 AI Agent 動態編排整個 RAG pipeline，具備迭代推理和自適應檢索。

**架構：** `Agent Plans → Tool Selection → Retrieve → Evaluate → Re-retrieve if needed → Self-Correct → Answer`

**三大定義原則：**
1. **Autonomous Strategy** — 動態選擇高層策略，不依賴預設工作流
2. **Iterative Execution** — 多輪檢索，基於中間結果調整
3. **Adaptive Retrieval** — 條件式、工具化的多來源存取

**關鍵特徵：**
- 檢索定義為可呼叫工具，Agent 決定何時調用哪個
- 利用 agentic design patterns：reflection、planning、tool use、multi-agent collaboration
- Agent 先評估是否需要檢索才開始搜尋

**限制：** 元件協調複雜度高、計算開銷大、高流量場景的資源壓力、除錯和可觀察性挑戰

**適用：** 研究助手、金融/法律分析、複雜多步推理任務

**參考：** Singh et al. "Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG" (Jan 2025) — https://arxiv.org/abs/2501.09136

---

### Generation 9: Multi-Agent RAG（2025）

分散式 RAG，多個專業化 Agent 由中央 orchestrator 協調。

**關鍵特徵：**
- 跨領域專業 Agent 的任務委派
- 非同步通訊和平行處理
- 每個 Agent 可有不同的檢索策略或知識庫
- 中央協調邏輯管理工作流

**限制：** 需要穩健的協調邏輯、Agent 間通訊開銷

---

### Generation 10: LongRAG（2024–2025）

針對延伸上下文最佳化，使用更大的文件區段搭配長上下文 LLM。

**關鍵特徵：**
- 檢索更大的 chunks（整個章節/文件）而非小段落
- 利用 100K+ token window 的長上下文模型
- 減少小 chunk 檢索造成的資訊碎片化

**限制：** 需要高上下文 LLM、較大的 chunks 可能降低檢索精度和速度

---

## 前沿趨勢

### Agent Memory（Beyond Agentic RAG）

從 read-only 擴展到 read-write — Agent 在推理過程中可以寫入和持久化資訊。

**三種記憶類型：**
- **Procedural Memory** — 行為模式（如「永遠使用正式語氣」）
- **Episodic Memory** — 時間事件（如「使用者在 10/30 提到旅行」）
- **Semantic Memory** — 事實知識（如「艾菲爾鐵塔 330 公尺高」）

**參考：** Leonie Monigatti "The Evolution from RAG to Agentic RAG to Agent Memory" (2025)

### Multimodal RAG（2024–2025）

跨文字、圖片、音訊和結構化資料的檢索與推理。

- **ColPali** — 直接 image-to-tensor embeddings，繞過 OCR
- OCR-based 文字轉換後索引
- Vision-Language Models 跨模態檢索

**參考：** "MMA-RAG: A Survey on Multimodal Agentic Retrieval-Augmented Generation" (2025)

### RAG as Context Engine（2025–2026）

RAG 從「檢索增強生成」演化為自主 Agent 的基礎設施層 — Context Engine。

**參考：** RAGFlow "From RAG to Context — A 2025 Year-End Review" — https://ragflow.io/blog/rag-review-2025-from-rag-to-context

---

## 世代對比表

| 世代 | 檢索方式 | 推理能力 | 自適應性 | 核心強項 | 複雜度 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| Naive | 關鍵字 / 基礎 dense | 基礎 | 最低 | 簡單 | 低 |
| Advanced | Dense + re-ranking | 改善 | 有限 | 準確度 | 中 |
| Modular | Hybrid（sparse + dense + structured） | 靈活 | 中等 | 客製化 | 高 |
| Self-RAG | Adaptive on-demand | 自我反思 | 高 | 自我批評 | 高 |
| CRAG | 評估 + 修正 | 修正式 | 中等 | 錯誤恢復 | 中高 |
| Graph RAG | 圖遍歷 | 關係 / 多跳 | 領域特定 | 關係推理 | 高 |
| Speculative | 平行草稿子集 | 驗證選擇 | 中等 | 速度 + 準確度 | 中高 |
| Agentic | 自主工具化 | 多步迭代 | 高 | 自主性 | 很高 |
| Multi-Agent | 分散式專業化 | 協作式 | 很高 | 可擴展性 | 很高 |
| LongRAG | 大 chunk 檢索 | 延伸上下文 | 有限 | 文件連貫性 | 中 |

---

## 檢索策略

### BM25（詞彙搜尋）
- TF-IDF 變體，加入飽和度和長度正規化
- 強項：精確關鍵字匹配、專有名詞、錯誤代碼
- 弱項：同義詞、語意相近但用詞不同的查詢

### 向量搜尋（語意搜尋）
- 透過 Embedding 模型將文本轉為向量
- 推薦模型：BAAI/BGE-M3（多語言）、text-embedding-3-small（英文）
- 強項：語意相似度、跨語言、模糊查詢
- 弱項：精確匹配、罕見術語、數字

### Hybrid Search + RRF
- 同時跑 BM25 和向量搜尋
- 用 Reciprocal Rank Fusion 合併排名：`score = Σ 1/(k + rank_i)`，k 通常取 60
- 實作：SQLite FTS5 + Vectorize，或 Weaviate 原生 hybrid

## 進階檢索模式

### HyDE（Hypothetical Document Embeddings）
用 LLM 生成假設性答案，用答案的 embedding 去搜尋。適合問題和文件語言差異大的場景。

### Multi-Query Expansion
把一個 query 展開成 3-5 個不同角度的子查詢，合併結果。提升 recall，但增加延遲和成本。

## Chunking 策略

| 策略 | 適用場景 | chunk size 建議 |
|------|---------|----------------|
| Fixed-size | 結構化程度低的文本 | 512 tokens, overlap 50 |
| Sentence-based | 文章、部落格 | 3-5 句一組 |
| Recursive | Markdown、程式碼 | 先按結構切，再按句切 |
| Semantic | 主題不規則的長文 | 基於 embedding 相似度聚類 |

重要：overlap 通常設 10-15%，太多浪費 token，太少丟失邊界語境。

## 向量資料庫選型

| 資料庫 | 適合場景 | 特色 |
|--------|---------|------|
| Pinecone | SaaS 快速上線 | Serverless、namespace 隔離 |
| Weaviate | 需要 hybrid search | 開源、GraphQL、原生混合搜尋 |
| Qdrant | 自架、需要過濾 | 高效儲存、snapshot 備份 |
| Chroma | 原型開發 | 輕量、notebook 友善 |
| Cloudflare Vectorize | 邊緣部署 | 低延遲、平台整合 |

## 常見失敗模式與修復

| 失敗模式 | 症狀 | 修復方案 |
|---------|------|---------|
| Recall 不足 | 找不到相關文件 | HyDE、Multi-Query、放寬 filter |
| Precision 不足 | 找到但不相關 | Cross-Encoder reranking、metadata filter |
| Ranking 錯誤 | 相關文件排太後面 | Reranking 模型、分數校正 |
| Context 混淆 | 多文件互相矛盾 | chunk overlap、文件格式化 |
| Generation 幻覺 | 回答沒有根據 | prompt 加信心機制、context 排序 |
| Token 爆掉 | context window 不夠 | token 預算管理、摘要壓縮 |

## 評估框架

### RAGAS
四個核心指標：
- **Faithfulness**：回答是否基於 context（防幻覺）
- **Answer Relevance**：回答是否切題
- **Context Precision**：context 中有多少是有用的（防噪音）
- **Context Recall**：相關資訊是否都被找到

### DeepEval
假設檢定框架，可組合多個指標。適合 CI/CD 整合。

### TruLens
三元模型：Relevance、Groundedness、Coherence。強調可追溯性。

### LLM-as-Judge
用 LLM 評估 LLM 的輸出。便宜快速但有偏差，適合快速迭代，不適合最終評估。

---

## 參考文獻

### 學術論文

1. Gao et al. "Retrieval-Augmented Generation for Large Language Models: A Survey" (Dec 2023) — https://arxiv.org/abs/2312.10997
2. Asai et al. "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection" (Oct 2023, ICLR 2024 Oral) — https://arxiv.org/abs/2310.11511
3. Yan et al. "Corrective Retrieval Augmented Generation" (Jan 2024) — https://arxiv.org/abs/2401.15884
4. Wang et al. "Speculative RAG: Enhancing Retrieval Augmented Generation through Drafting" (Jul 2024, ICLR 2025) — https://arxiv.org/abs/2407.08223
5. "Graph Retrieval-Augmented Generation: A Survey" (Aug 2024, ACM TOIS) — https://arxiv.org/abs/2408.08921
6. Gupta et al. "A Comprehensive Survey of RAG: Evolution, Current Landscape and Future Directions" (Oct 2024) — https://arxiv.org/abs/2410.12837
7. Han et al. "Retrieval-Augmented Generation with Graphs (GraphRAG)" (Jan 2025) — https://arxiv.org/abs/2501.00309
8. Singh et al. "Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG" (Jan 2025) — https://arxiv.org/abs/2501.09136
9. "Engineering the RAG Stack" (Jan 2025) — https://arxiv.org/html/2601.05264v1
10. "MMA-RAG: A Survey on Multimodal Agentic Retrieval-Augmented Generation" (2025)

### 部落格文章

1. RAGFlow "The Rise and Evolution of RAG in 2024: A Year in Review" — https://ragflow.io/blog/the-rise-and-evolution-of-rag-in-2024-a-year-in-review
2. RAGFlow "From RAG to Context — A 2025 Year-End Review" — https://ragflow.io/blog/rag-review-2025-from-rag-to-context
3. RAGFlow "RAG at the Crossroads — Mid-2025 Reflections" — https://ragflow.io/blog/rag-at-the-crossroads-mid-2025-reflections-on-ai-evolution
4. Leonie Monigatti "The Evolution from RAG to Agentic RAG to Agent Memory" (2025)
5. Weaviate "What Is Agentic RAG?" — https://weaviate.io/blog/what-is-agentic-rag
6. LlamaIndex "Agentic Retrieval Guide: Beyond Naive RAG" — https://www.llamaindex.ai/blog/rag-is-dead-long-live-agentic-retrieval
7. DEV Community "From Naive to Agentic: A Developer's Guide to RAG Architectures" — https://dev.to/ayas_tech_2b0560ee159e661/from-naive-to-agentic-a-developers-guide-to-rag-architectures-4hap
8. DigitalOcean "RAG, AI Agents, and Agentic RAG: An In-Depth Review" — https://www.digitalocean.com/community/conceptual-articles/rag-ai-agents-agentic-rag-comparative-analysis
9. Google Research Blog "Speculative RAG" — https://research.google/blog/speculative-rag-enhancing-retrieval-augmented-generation-through-drafting/
