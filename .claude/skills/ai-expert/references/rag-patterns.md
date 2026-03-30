# RAG 系統模式參考

## RAG 三個世代

### Naive RAG
三步驟：Index → Search → Generate。簡單但問題多：
- Recall 問題：query 和文件用語不同、語意壓縮、一詞多義
- Precision 問題：context 噪音、無關文件、缺少 reranking
- Generation 問題：context window 管理不善、信心評估不足

### Advanced RAG
在 Naive 基礎上加入：
- Pre-retrieval：Query Rewriting、HyDE、Multi-Query Expansion
- Retrieval：Hybrid Search（BM25 + Vector + RRF）
- Post-retrieval：Cross-Encoder Reranking、MMR 去重
- Generation：Context 排序、Token 預算管理

### Modular RAG
把 RAG 設計成可組合的 DAG Pipeline：
- PipelineStep 介面：`skipWhen`、`timeout`、`execute`
- Step Registry 動態組合
- PipelineContext 狀態傳遞
- Plugin 架構：HyDE、Multi-Query、CRAG 等可插拔

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

## 進階模式

### HyDE（Hypothetical Document Embeddings）
用 LLM 生成假設性答案，用答案的 embedding 去搜尋。適合問題和文件語言差異大的場景。

### Multi-Query Expansion
把一個 query 展開成 3-5 個不同角度的子查詢，合併結果。提升 recall，但增加延遲和成本。

### CRAG（Corrective RAG）
檢索後先評估文件相關性，不相關就重新搜尋或用網路搜尋補充。三個判斷：Correct、Ambiguous、Incorrect。

### Agentic RAG（ReAct Loop）
LLM 自己決定要不要再搜一次：Reason → Act → Observe → Loop。適合多跳推理問題。需要設定最大迴圈次數和文件閾值。

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
