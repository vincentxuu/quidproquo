# RAG 系統模式參考

## 目錄

1. [RAG 世代演化](#rag-世代演化)
2. [世代對比表](#世代對比表)
3. [Chunking 策略](#chunking-策略)
4. [向量資料庫選型](#向量資料庫選型)
5. [常見失敗模式與修復](#常見失敗模式與修復)
6. [評估框架](#評估框架)
7. [參考文獻](#參考文獻)

---

## RAG 世代演化

### Gen 1: Naive RAG（2020–2023）
Index → Search → Generate。靜態一次性檢索，無回饋迴路。
**參考：** Lewis et al. (2020, Facebook AI)

### Gen 2: Advanced RAG（2023–2024）
加入 pre-retrieval（Query Rewriting、HyDE、Multi-Query）和 post-retrieval（Cross-Encoder Reranking、Context Compression）。仍是線性 pipeline。

### Gen 3: Modular RAG（2024）
可組合 DAG Pipeline，元件可插拔替換（retriever、generator、evaluator、router）。
**參考：** Gao et al. "RAG Survey" (Dec 2023) — https://arxiv.org/abs/2312.10997

### Gen 4: Self-RAG（2023–2024）
LLM 用 reflection tokens 自己決定是否檢索，自我評估 relevance/factuality/quality。需端到端訓練。
**參考：** Asai et al. (ICLR 2024 Oral, top 1%) — https://arxiv.org/abs/2310.11511

### Gen 5: Corrective RAG / CRAG（2024）
檢索後評估文件相關性（Correct/Incorrect/Ambiguous），不相關就回退網路搜尋。Plug-and-play。
**參考：** Yan et al. (Jan 2024) — https://arxiv.org/abs/2401.15884

### Gen 6: Graph RAG（2024）
知識圖譜 + RAG，entity extraction + community clustering，支援主題級查詢和多跳推理。

**變體：** Microsoft GraphRAG（完整 KG）、KAG（Ant Group）、Fast GraphRAG、LightRAG、LazyGraphRAG

**參考：** Han et al. (Jan 2025) — https://arxiv.org/abs/2501.00309

### Gen 7: Speculative RAG（2024）
小模型平行生成多個草稿，大模型一次驗證。準確度 +12.97%，延遲 -50.83%。
**參考：** Wang et al. (ICLR 2025) — https://arxiv.org/abs/2407.08223

### Gen 8: Agentic RAG（2024–2025）
自主 Agent 動態編排 RAG：Autonomous Strategy + Iterative Execution + Adaptive Retrieval。
**參考：** Singh et al. (Jan 2025) — https://arxiv.org/abs/2501.09136

### Gen 9: Multi-Agent RAG（2025）
多專業化 Agent 由 orchestrator 協調，各自有不同檢索策略和知識庫。

### Gen 10: LongRAG（2024–2025）
檢索整個章節/文件（非小段落），搭配 100K+ token window 長上下文模型。

### 前沿趨勢
- **Agent Memory**：從 read-only 擴展到 read-write（Monigatti, 2025）
- **Multimodal RAG**：跨文字/圖片/音訊，ColPali 繞過 OCR
- **RAG as Context Engine**：RAG 演化為 Agent 基礎設施層

---

## 世代對比表

| 世代 | 檢索方式 | 推理能力 | 自適應性 | 核心強項 | 複雜度 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| Naive | 關鍵字 / 基礎 dense | 基礎 | 最低 | 簡單 | 低 |
| Advanced | Dense + re-ranking | 改善 | 有限 | 準確度 | 中 |
| Modular | Hybrid | 靈活 | 中等 | 客製化 | 高 |
| Self-RAG | Adaptive on-demand | 自我反思 | 高 | 自我批評 | 高 |
| CRAG | 評估 + 修正 | 修正式 | 中等 | 錯誤恢復 | 中高 |
| Graph RAG | 圖遍歷 | 多跳 | 領域特定 | 關係推理 | 高 |
| Speculative | 平行草稿 | 驗證選擇 | 中等 | 速度+準確 | 中高 |
| Agentic | 自主工具化 | 多步迭代 | 高 | 自主性 | 很高 |
| Multi-Agent | 分散式 | 協作式 | 很高 | 可擴展 | 很高 |
| LongRAG | 大 chunk | 延伸上下文 | 有限 | 連貫性 | 中 |

---

## Chunking 策略

| 策略 | 適用場景 | chunk size 建議 |
|------|---------|----------------|
| Fixed-size | 結構化程度低的文本 | 512 tokens, overlap 50 |
| Sentence-based | 文章、部落格 | 3-5 句一組 |
| Recursive | Markdown、程式碼 | 先按結構切，再按句切 |
| Semantic | 主題不規則的長文 | 基於 embedding 相似度聚類 |

Overlap 通常設 10-15%。Hybrid Search（BM25 + Vector）用 RRF 合併：`score = Σ 1/(k + rank_i)`，k=60。

---

## 向量資料庫選型

| 資料庫 | 適合場景 | 特色 |
|--------|---------|------|
| Pinecone | SaaS 快速上線 | Serverless、namespace 隔離 |
| Weaviate | 需要 hybrid search | 開源、原生混合搜尋 |
| Qdrant | 自架、需要過濾 | 高效儲存、snapshot 備份 |
| Chroma | 原型開發 | 輕量、notebook 友善 |
| Cloudflare Vectorize | 邊緣部署 | 低延遲、平台整合 |

---

## 常見失敗模式與修復

| 失敗模式 | 症狀 | 修復方案 |
|---------|------|---------|
| Recall 不足 | 找不到相關文件 | HyDE、Multi-Query、放寬 filter |
| Precision 不足 | 找到但不相關 | Cross-Encoder reranking、metadata filter |
| Ranking 錯誤 | 相關文件排太後面 | Reranking 模型、分數校正 |
| Context 混淆 | 多文件互相矛盾 | chunk overlap、文件格式化 |
| Generation 幻覺 | 回答沒有根據 | prompt 加信心機制、context 排序 |
| Token 爆掉 | context window 不夠 | token 預算管理、摘要壓縮 |

---

## 評估框架

| 框架 | 核心指標 | 適用 |
|------|---------|------|
| **RAGAS** | Faithfulness、Answer Relevance、Context Precision、Context Recall | 最廣泛使用 |
| **DeepEval** | 假設檢定框架，可組合多指標 | CI/CD 整合 |
| **TruLens** | Relevance、Groundedness、Coherence | 強調可追溯性 |
| **LLM-as-Judge** | 用 LLM 評估 LLM 輸出 | 快速迭代，不適合最終評估 |

---

## 參考文獻

### 學術論文

1. Gao et al. "RAG for LLMs: A Survey" (Dec 2023) — https://arxiv.org/abs/2312.10997
2. Asai et al. "Self-RAG" (Oct 2023, ICLR 2024 Oral) — https://arxiv.org/abs/2310.11511
3. Yan et al. "Corrective RAG" (Jan 2024) — https://arxiv.org/abs/2401.15884
4. Wang et al. "Speculative RAG" (Jul 2024, ICLR 2025) — https://arxiv.org/abs/2407.08223
5. "Graph RAG Survey" (Aug 2024, ACM TOIS) — https://arxiv.org/abs/2408.08921
6. Gupta et al. "Comprehensive Survey of RAG" (Oct 2024) — https://arxiv.org/abs/2410.12837
7. Han et al. "RAG with Graphs" (Jan 2025) — https://arxiv.org/abs/2501.00309
8. Singh et al. "Agentic RAG Survey" (Jan 2025) — https://arxiv.org/abs/2501.09136
9. "Engineering the RAG Stack" (Jan 2025) — https://arxiv.org/html/2601.05264v1

### 部落格文章

10. RAGFlow "Rise and Evolution of RAG in 2024" — https://ragflow.io/blog/the-rise-and-evolution-of-rag-in-2024-a-year-in-review
11. RAGFlow "From RAG to Context — 2025 Review" — https://ragflow.io/blog/rag-review-2025-from-rag-to-context
12. Weaviate "What Is Agentic RAG?" — https://weaviate.io/blog/what-is-agentic-rag
13. LlamaIndex "Agentic Retrieval Guide" — https://www.llamaindex.ai/blog/rag-is-dead-long-live-agentic-retrieval
14. Google Research "Speculative RAG" — https://research.google/blog/speculative-rag-enhancing-retrieval-augmented-generation-through-drafting/
