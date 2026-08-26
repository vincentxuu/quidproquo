# 2026-08-25 RAG 新技術研究筆記 — 是否更新《RAG 系統模式完整指南》

> 研究目標：確認 2025-2026 是否出現值得收進 `src/content/posts/ai/2026-03-14-rag-patterns-complete-guide.md`（「RAG 技法大全」導航）的新 RAG 技術
> 執行日：2026-08-25 · 來源數：約 30 一手（論文/官方 Blog/官方 Release）· 取用層級標註見各表

## 1. 結論先講

- **有新技術，但沒有共識的「Gen 11」編號**。三份 2025 綜述一致將 2025 集群命名為 **Agentic RAG / Synergized RAG-Reasoning / Reasoning Agentic RAG**，主張其為「檢索-推理雙向交織 + RL 訓練 + 多輪工具調用」的新範式，與早期 Adaptive/Self-RAG 有本質差異。建議導航新增一節「後十代：Agentic / Reasoning RAG（2025-）」標為 *Agentic Era*，不硬編 Gen 11，並引用綜述作世代劃界依據。
- **檢索/嵌入/向量庫/重排 2025-2026 為增量式演進**，未推翻「切塊→嵌入→檢索→重排」主線，但有 4 個必補點：**Late Chunking**（零 LLM 成本的 Contextual Retrieval 替代）、**jina-embeddings-v5/v4 + ColBERT-v2 + SPLADE-v3**、**Qdrant 1.19 Turbo4 + Weaviate 1.30 BlockMax WAND + Hybrid RRF/DBSF 實測**、**jina-reranker-v3.5 listwise**。建議以「對比框/選型分支」形式補進現有 Part 2/Part 3，不另開 Part。
- **Agentic / Graph / Multimodal 前沿已到下一代**：**Microsoft GraphRAG 已至 v3.1.2**（非 1.x）、**LightRAG / HippoRAG 2** 成為輕量/記憶替代、**Multimodal 已轉向 ColPali/ColQwen 視覺直嵌**（colpali-engine 已棄用→遷至 Sentence Transformers v6）、**Agent 編排已分層為 LangGraph 1.2.11 runtime / MCP 2025-06-18 協議 / CrewAI/AutoGen/OpenAI Agents SDK**。導航前沿章節需重寫，否則 6 個月內過時。
- **判定：導航值得更新，但採「導航式更新」**（2-4 段概述 + 關鍵洞察 + 轉手連結），不把論文細節複製進導航。估計改動：新增 1 節（Agentic Era）、重寫/增補 4-6 個小節、補 8-12 條句內官方來源與參考資料。

## 2. 來源清單（按原始研究 A/B/C 彙整，皆已 webfetch 實抓）

### A. 超十代架構（Gen 11 / Reasoning / Adaptive）

| 標題 | 日期 | URL | 取用 |
|---|---|---|---|
| Adaptive-RAG: Learning to Adapt Retrieval-Augmented LLMs through Question Complexity | 2024-03-21 v1 | https://arxiv.org/abs/2403.14403 | 一手摘要 🟡 |
| Self-RAG: Learning to Retrieve, Generate, and Critique | 2023-10-17 | https://arxiv.org/abs/2310.11511 | 一手摘要 🟡 |
| Search-R1: Training LLMs to Reason and Leverage Search Engines with RL | 2025-03-12 v1 → 2025-08-05 v5 | https://arxiv.org/abs/2503.09516 | 一手摘要 🟡 |
| REX-RAG: Reasoning Exploration with Policy Correction | 2025-08-11 v1 | https://arxiv.org/abs/2508.08149 | 一手摘要 🟡 |
| GTA-RAG: Graph-Trajectory-Augmented RL | 2025-08-23 (EMNLP 2026) | https://arxiv.org/abs/2608.22479 | 一手摘要 🟡 |
| Interact-RAG: Reason and Interact with the Corpus | 2025-10-31 v1 → 2026-02-26 v3 | https://arxiv.org/abs/2510.27566 | 一手摘要 🟡 |
| AlignRAG: Enhancing RAG Reasoning through Test-Time Critique | 2025-04-21 v1 (NeurIPS 2025) | https://arxiv.org/abs/2504.14858 | 一手摘要 🟡 |
| Towards Agentic RAG with Deep Reasoning: A Survey | 2025-07-13 v1 | https://arxiv.org/abs/2507.09477 | 一手綜述 🟡 |
| Reasoning RAG via System 1 or System 2: A Survey | 2025-06-12 v1 | https://arxiv.org/abs/2506.10408 | 一手綜述 🟡 |
| Introducing deep research (OpenAI Official Blog) | 2025-02-02 | https://openai.com/index/introducing-deep-research/ | 一手全文 ✅ |
| Introducing the Model Context Protocol (Anthropic) | 2024-11-25 | https://www.anthropic.com/news/model-context-protocol | 一手全文 ✅ |
| Model Context Protocol Spec 2025-06-18 | 2025-06-18 | https://modelcontextprotocol.io/specification/2025-06-18 | 一手全文 ✅ |
| LangGraph Releases | 1.2.11 2025-08-11 | https://github.com/langchain-ai/langgraph/releases | 一手部分 ✅ |

### B. 檢索 / Embedding / Vector DB / Reranking

| 標題 | 日期 | URL | 取用 |
|---|---|---|---|
| Introducing Contextual Retrieval (Anthropic) | 2024-09-19 | https://www.anthropic.com/news/contextual-retrieval | 一手全文 ✅ |
| Late Chunking: Contextual Chunk Embeddings | 2024-09-07 v1 | https://arxiv.org/abs/2409.04701 | 一手摘要 🟡 |
| RAPTOR: Recursive Abstractive Processing | 2024-01-31 | https://arxiv.org/abs/2401.18059 | 一手摘要 🟡 |
| jina-embeddings-v3 | 2024-09-16 | https://arxiv.org/abs/2409.10173 | 一手摘要 🟡 |
| Jina-ColBERT-v2 | 2024-08-29 | https://arxiv.org/abs/2408.16672 | 一手摘要 🟡 |
| jina-embeddings-v4 (Multimodal) | 2025-06-23 | https://arxiv.org/abs/2506.18902 | 一手摘要 🟡 |
| jina-embeddings-v5-text | 2026-02-17 | https://arxiv.org/abs/2602.15547 | 一手摘要 🟡 |
| SPLADE-v3 | 2024-03-11 | https://arxiv.org/abs/2403.06789 | 一手摘要 🟡 |
| Qdrant 1.19 — TurboQuant & Memory Tiers | 2026-08-05 | https://qdrant.tech/blog/qdrant-1.19.x/ | 一手全文 ✅ |
| Hybrid Search in Qdrant | 2026-08-24 | https://qdrant.tech/articles/hybrid-search/ | 一手全文 ✅ |
| Weaviate 1.30 Release | 2025-04-08 | https://weaviate.io/blog/weaviate-1-30-release | 一手全文 ✅ |
| jina-reranker-v3 | 2025-09-29 | https://arxiv.org/abs/2509.25085 | 一手摘要 🟡 |
| jina-reranker-v3.5 | 2026-07-20 | https://arxiv.org/abs/2607.18152 | 一手摘要 🟡 |

### C. Agentic / GraphRAG / Multimodal / 評估

| 標題 | 日期 | URL | 取用 |
|---|---|---|---|
| LangGraph overview (docs.langchain.com) | 常青 1.x | https://docs.langchain.com/oss/python/langgraph/overview | 一手全文 ✅ |
| GraphRAG Docs Welcome | 常青 | https://microsoft.github.io/graphrag/ | 一手全文 ✅ |
| GraphRAG Releases v3.1.2 | 2025-08-21 | https://github.com/microsoft/graphrag/releases | 一手部分 ✅ |
| LightRAG — arXiv:2410.05779 | 2025-04-28 v3 | https://arxiv.org/abs/2410.05779 | 一手摘要 🟡 |
| HippoRAG 2 — arXiv:2502.14802 | ICML'25 | https://arxiv.org/abs/2502.14802 | 一手摘要 🟡 |
| ColPali — arXiv:2407.01449 | ICLR 2025 | https://arxiv.org/abs/2407.01449 | 一手摘要 🟡 |
| Qwen2.5-VL Blog | 2025-01-26 | https://qwenlm.github.io/blog/qwen2.5-vl/ | 一手全文 ✅ |
| ViDoRe V2 — arXiv:2505.17166 | 2025-05-22 | https://arxiv.org/abs/2505.17166 | 一手摘要 🟡 |
| Ragas Docs / Releases v0.4.3 | 2025-01-13 | https://docs.ragas.io/en/latest/ | 一手全文 ✅ |
| RAGTruth — arXiv:2401.00396 | 2024-05-17 v2 | https://arxiv.org/abs/2401.00396 | 一手摘要 🟡 |
| FinanceBench HF Dataset | 常青 | https://huggingface.co/datasets/PatronusAI/financebench | 一手全文 ✅ |

## 3. 盤點讀到什麼程度

| 來源類別 | 標記 | 阻礙 |
|---|---|---|
| OpenAI Deep Research / Anthropic MCP / MCP Spec / Qdrant 1.19 / Weaviate 1.30 / Anthropic Contextual Retrieval / LangGraph docs / GraphRAG docs / Qwen2.5-VL | ✅ 一手全文 | 無 |
| arXiv 論文 15+ 篇 | 🟡 摘要/落地頁（abs+meta） | 未逐字抽 PDF 方法段與表格；日期/作者/版本/核心主張以 abstract 為準 |
| 個別 GitHub releases | 🟡 部分（動態渲染截斷） | JS 載入，改 markdown fallback 已取關鍵 tag |
| 無 | 🔴 未讀 | — |

## 4. 事實交叉表（窄事實）

| 事實 | 來源 | 驗證 |
|---|---|---|
| Search-R1 v1 2025-03-12 v5 2025-08-05；Qwen2.5-7B +41% / 3B +20% vs RAG baselines | arXiv:2503.09516 abs | ✅ |
| REX-RAG +5.1% (3B) / +3.6% (7B) over strong baselines (7 QA) | arXiv:2508.08149 abs | ✅ |
| GTA-RAG Accepted EMNLP 2026；Interact-RAG v1 2025-10-31 → v3 2026-02-26 | arXiv:2608.22479 / 2510.27566 | ✅ |
| AlignRAG Accepted NeurIPS 2025；8B CLM 比 72B CLM +2.2% | arXiv:2504.14858 abs | ✅ |
| 兩份 2025 綜述將 2025 集群定義為 Synergized / Agentic 新範式 | arXiv:2507.09477 / 2506.10408 | ✅ |
| OpenAI Deep Research 2025-02-02（o3 優化版，GAIA 72.57% / HLE 26.6%） | openai.com official blog | ✅ |
| MCP 2024-11-25 開源，Spec 2025-06-18 | anthropic.com / modelcontextprotocol.io | ✅ |
| Anthropic Contextual Retrieval 2024-09-19：5.7%→1.9%（-67% with rerank），$1.02/1M tokens | anthropic.com official blog | ✅ |
| Late Chunking 先全文件編碼再切塊再 mean-pool，無需訓練 | arXiv:2409.04701 abs | ✅ |
| Qdrant 1.19 Turbo4 4-bit 9× 降 + pinned/cached/cold；Weaviate 1.30 BlockMax WAND 10× | qdrant.tech / weaviate.io release blogs | ✅ |
| Qdrant Hybrid RRF/DBSF 4/5 勝單一檢索，延遲 +0.6–1.47ms | qdrant.tech/articles/hybrid-search | ✅ |
| jina-reranker-v3.5 BEIR 63.20 (0.6B) 對標 4B，延遲 -1.56× | arXiv:2607.18152 abs | ✅ |
| GraphRAG 最新 v3.1.2 (2025-08-21)，四查詢 Global/Local/DRIFT/Basic | github.com/microsoft/graphrag/releases + docs | ✅ |
| LightRAG 39.2k★ v3 2025-04-28；HippoRAG 2 ICML'25 PPR +7% | arXiv:2410.05779 / 2502.14802 | ✅ |
| ColPali ICLR 2025；colpali-engine 已棄用→Sentence Transformers v6 | arXiv:2407.01449 / colpali GitHub | ✅ |
| RAGAS 最新 v0.4.3 (2025-01-13)，不存在 2.0 | github.com/explodinggradients/ragas/releases | ✅ |

## 5. 對導航的具體更新建議（post-update 範疇）

> 原則：導航每節 2-4 段概述 + 關鍵洞察 + `→ 深入閱讀` 轉手，不把論文細節複製進導航。變的是「分界與轉手」，不是「濃縮重講」。

| 導航位置 | 現狀風險 | 建議動作 | 優先級 |
|---|---|---|---|
| 全域架構圖 + 世代總覽 | 十代後空白，讀者以為到頂 | 新增「後十代：Agentic Era（2025-）」框，不編 Gen 11，引用兩份綜述作劃界 | P0 |
| Gen 8/9 小節後 | 缺 Reasoning RAG / RL 搜索 | 新增小節「後十代：Agentic / Reasoning RAG（Search-R1 / REX-RAG / AlignRAG）」3 段，附 Deep Research + MCP 作為產品/協議層落地 | P0 |
| Part 2 Contextual Retrieval | 僅 Anthropic CR，無低成本替代 | 新增對比框「Contextual Retrieval vs Late Chunking」，補成本/延遲/窗口限制 | P0 |
| Part 2 Embedding 推薦 | 僅 BGE-M3 | 更新為 jina-v5-text（小/高效）/ v4（多模）/ ColBERT-v2 / SPLADE-v3 四分支，保留 BGE-M3 作對照 | P1 |
| Part 3 Vector DB | 無 2025 量化/混合實測 | 補 Turbo4 / BlockMax WAND / RRF vs DBSF 實測，引 Qdrant/Weaviate 官方數據 | P1 |
| Part 2 Reranking | 僅 cross-encoder | 補 listwise jina-reranker-v3.5（0.6B）與混合注意力，標需自測 | P1 |
| 前沿：GraphRAG | 可能停在舊版 | 重寫至 3.1.x（Leiden/Community Summary/四查詢），新增 LightRAG / HippoRAG 2 選型對比小節 | P0 |
| 前沿：Multimodal | 可能僅提 OCR | 重寫為 vision retriever（ColPali/ColQwen2.5 + Qwen2.5-VL），標 colpali-engine 棄用遷移，補 ViDoRe V2 | P0 |
| 前沿：評估/可觀測 | 無版本錨點 | 闢謠 RAGAS 2.0→0.4.3（collections API 破壞性遷移），新增 RAGTruth + FinanceBench 基準矩陣，補 LangGraph checkpoint / MCP 安全 | P1 |
| 文末：參考資料 + 版本錨點 | 易過時 | 新增 8-10 條一手參考（見 §2），加邊欄「版本錨點：LangGraph 1.2.11 / GraphRAG 3.1.2 / RAGAS 0.4.3 / Qwen2.5-VL 2025-01-26」 | P2 |

## 6. 推論（與窄事實分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| 十代分類本身非學界標準，硬編 Gen 11 會製造偽共識 | 僅綜述提出新範式命名，無官方編號 | 若作者堅持「十代」即定版，則新增 Era 章節比硬編更穩 |
| Late Chunking 是當前最值得補的「低成本 CR 替代」 | 零 LLM 成本、無需訓練 | 若文件語意高度獨立或超 32K 窗口，收益遞減 |
| GraphRAG 3.x / LightRAG / HippoRAG 選型關鍵在「增量/成本」而非精度 | 三者論文皆強調少 LLM 呼叫 | 若評測偏重 global summarization，GraphRAG 仍可能精度領先 |
| MCP 12 個月內取代各框架自製 tool-use 層 | OpenAI/Anthropic/VS Code 同採納 | 企業內網禁用 MCP server 時自製仍存活 |

## 7. 待解與限制

- [ ] 補抓 Pinecone / Cloudflare Vectorize 2025 一手更新（本次 404，需換路徑或 GitHub release）
- [ ] jina 系列在 MTEB 領先榜的獨立交叉驗證（非論文自報）
- [ ] Late Chunking vs Anthropic CR 在同一私有數據集的召回/成本對照實測
- [ ] 租戶隔離尚無統一基準，僅 repo 層 namespace（待追蹤 OWASP/ISO 草案）

---
*底層研究檔案：`/tmp/research-A.md`、`/tmp/research-B.md`、`/tmp/research-C.md`*
