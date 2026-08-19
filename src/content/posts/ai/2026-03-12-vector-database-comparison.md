---
title: "Vector Database 選型：Pinecone、Weaviate、Qdrant、Vectorize 怎麼選"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, vector-database, pinecone, weaviate, qdrant, cloudflare-vectorize]
lang: zh-TW
tldr: "向量資料庫的選型比 LLM 選型更受部署平台限制。先確認平台和規模需求，再看功能特性，不要只看 benchmark。"
description: "主流向量資料庫的比較：Pinecone、Weaviate、Qdrant、Chroma、pgvector、Cloudflare Vectorize，各自的強項、限制，以及選型決策框架。"
draft: false
series:
  name: "RAG 技法大全"
  order: 8
---

> 🌏 [English version](/posts/ai/2026-03-12-vector-database-comparison-en)

向量資料庫是 RAG 系統的核心基礎設施。選型時，大多數人先看 benchmark（ANN 搜尋速度、recall@K），但實際上決定選哪個的通常是：**部署平台、規模需求、已有的技術棧**。

## 先說一件事：功能對照表不要看

這篇文章原本有一張「誰支援 Hybrid Search、誰支援 Sparse Vector、月費多少」的對照表。後來我把它刪掉了，因為那種表格的保鮮期只有幾週。

實際發生的例子：Pinecone 現在有原生的 sparse index 與 [hybrid search 文件](https://docs.pinecone.io/guides/search/hybrid-search)，早期「Pinecone 不支援 sparse」的說法已經不成立；Chroma 從「只適合本機 PoC」變成有 Rust 寫的 distributed 版本與托管的 Chroma Cloud；Pinecone 的 pod-based index 也從「大規模的正解」變成官方明講[不建議新專案使用](https://docs.pinecone.io/guides/indexes/pods/understanding-pod-based-indexes)的遺留架構。

所以下面談的是**比較不會過期的決策軸**，功能細節請直接查各家官方文件。

## 決策軸一：自架 vs 托管

這是最先要決定的，因為它決定了後面所有選項。

- **需要資料主權 / 不能出境 / 成本要壓在自己的機器上** → 自架。Qdrant、Weaviate、Milvus、Chroma、pgvector 都可以自架。
- **不想養維運人力** → 托管。Pinecone、Weaviate Cloud、Qdrant Cloud、Chroma Cloud、Cloudflare Vectorize。

自架的真實成本不是伺服器費用，而是「誰半夜起來處理 OOM」。向量索引是記憶體大戶，HNSW 圖要吃記憶體、rebuild 要吃 CPU，這些都會變成你的 on-call。如果團隊沒有這個人，托管的價差通常是划算的。

## 決策軸二：過濾語意（最常被低估的一項）

RAG 幾乎一定要帶條件過濾——只查某個租戶、某個岩場、某個時間範圍之後的文件。這時「過濾在什麼時候發生」比 ANN 速度重要得多：

- **Post-filter（先 ANN 再過濾）**：先取回 topK 個近鄰，再丟掉不符合條件的。條件越嚴格，回來的結果越少，極端情況下回傳 0 筆——這叫 over-filtering，是 RAG 系統最常見的「明明有資料卻查不到」。
- **Pre-filter / filter-aware index**：先用 metadata 索引縮小候選集，或把過濾條件編進索引結構裡。

各家的做法不同，而且這是真正的架構差異：

- **Qdrant** 用 [filterable HNSW](https://qdrant.tech/articles/vector-search-filtering/)：payload index 會在 HNSW 圖上補額外的邊，低選擇性時查詢規劃器直接改走 payload index 全掃。前提是**你要先建 payload index**。
- **Cloudflare Vectorize** 的 filter 是先套用、再從過濾後的集合取 topK（[官方文件](https://developers.cloudflare.com/vectorize/reference/metadata-filtering/)）。
- **pgvector** 在 0.8.0 之前是典型的 post-filter 受害者，0.8.0 加了 [iterative index scans](https://github.com/pgvector/pgvector?tab=readme-ov-file#iterative-index-scans)（`hnsw.iterative_scan`），索引掃不夠就繼續掃，才把 over-filtering 補起來。

選型時務必拿你**真實的過濾條件**去測，不要用無條件查詢的 benchmark 做決定。

## 決策軸三：Hybrid / Sparse 要在哪一層做

BM25 或 SPLADE 這類詞彙訊號要不要進資料庫，有三種擺法：

1. **資料庫原生支援**（Weaviate 的 hybrid、Pinecone 的 sparse index、Qdrant 的 sparse vector）：一次查詢拿到融合結果，維運最少。
2. **兩個索引 + 自己做 RRF**：向量索引一個、全文索引一個，應用層融合。彈性最大，也最容易調權重，但要自己維護兩份索引的一致性。
3. **平台層外掛**：例如 Vectorize 本身只做向量，但 Cloudflare 的 [AI Search 提供 hybrid（keyword + vector）檢索](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/)，代價是要照它的 pipeline 走。

沒有哪個一定對。重點是**先確認你的語料需不需要詞彙訊號**（專有名詞、料號、路線代號多的語料通常需要），再決定要不要為它換資料庫。

## 決策軸四：維運負擔與成長路徑

問三個問題：

- 資料量從現在成長 10 倍，這個方案要改架構嗎？
- 要不要 quantization（向量量化）才塞得下記憶體？Qdrant、Weaviate、pgvector（`halfvec`、binary）都有，設定方式各不相同。
- 多租戶怎麼隔離？namespace、collection、還是 metadata 欄位？改起來成本差很多。

## 各家的一句話定位

功能細節查文件，這裡只講「什麼情況下它是自然選擇」：

- **[Pinecone](https://docs.pinecone.io/)**：不想碰基礎設施、規模會長大、團隊已經在 AWS。新專案用 serverless index；大流量再加 dedicated read nodes。閉源、資料在對方機房，合規需求要先確認。
- **[Weaviate](https://weaviate.io/developers/weaviate)**：需要原生 hybrid search、多租戶、同一物件多個具名向量。查詢面同時提供 [GraphQL 與 gRPC](https://docs.weaviate.io/weaviate/api/graphql)，官方 client 再包成 collection 導向的 API。自架要 Docker/K8s。
- **[Qdrant](https://qdrant.tech/documentation/)**：自架友善、Rust 寫的、過濾語意最完整、sparse 與 multi-vector（ColBERT 式後期互動）都有。適合「要自己掌控，但不想自己實作過濾邏輯」。
- **[Chroma](https://docs.trychroma.com/)**：本機開發與 PoC 最快上手；現在也有 distributed 版本與 [Chroma Cloud](https://docs.trychroma.com/cloud/getting-started)，所以「只能做小東西」的舊印象要更新。
- **[pgvector](https://github.com/pgvector/pgvector)**：**如果你已經有 Postgres，先試它**。資料和向量在同一個交易裡、備份和權限沿用既有機制，省下的維運成本通常大於效能差距。跨過幾百萬向量再考慮專用資料庫。
- **[Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)**：部署在 Workers 上時的自然選擇，embed 與 search 都在同一個網路內。

## Vectorize 的幾個實作細節

因為 NobodyClimb 用的是 Vectorize，這裡記下幾個踩過或差點踩到的點（以官方文件為準，[限制頁](https://developers.cloudflare.com/vectorize/platform/limits/)會變動）：

```typescript
// Workers 內直接用，沒有跨服務呼叫
const results = await env.VECTORIZE.query(queryVector, {
  topK: 20,
  filter: { crag_id: { $eq: "longtung" } },
  returnValues: false,
  returnMetadata: "all",
});
```

- **metadata index 要先建再寫入**：除了 namespace 之外的欄位要能被 filter，必須先建立 metadata index，而且**建立之前就寫進去的向量不會進索引**，要重新 upsert。上面那個 `crag_id` filter 沒先建索引就是查不到。
- **metadata index 數量有上限**，字串型別只索引前 64 bytes，所以不要拿長字串當過濾鍵。
- **向量維度上限 1536（float32）**，這會直接刷掉一部分高維 embedding 模型，選 embedding 模型時要先確認。
- **topK 上限跟你要不要帶 metadata / values 有關**，帶了會比較低；需要更大的候選集就分兩段查（先不帶 metadata 拿 id，再補資料）。

## 選型決策框架

```
已經有 Postgres，資料量還在百萬以內？
  → pgvector（省下一整套維運）

部署在 Cloudflare Workers？
  → Vectorize（架構最簡單，先確認維度與 metadata index 限制）

需要自架（資料主權、成本控制）？
  → 過濾條件複雜 → Qdrant
  → 需要原生 hybrid / 多租戶 → Weaviate

不想維運？
  → Pinecone serverless（大流量再加 dedicated read nodes）
  → 或各家的 Cloud 版本

需要詞彙訊號（BM25 / SPLADE）？
  → 先確認語料真的需要，再看要用原生支援還是自己做 RRF
```

NobodyClimb 選擇 Cloudflare Vectorize 的原因很簡單：系統部署在 Cloudflare Workers，用 Vectorize 讓 embed + search 都在同一個 Cloudflare 網路內，沒有跨服務的網路延遲，架構也最簡單。

## 整體來說

向量資料庫的選型，70% 是由**部署平台、既有技術棧和維運人力**決定的，30% 才是功能特性的比較。在 Cloudflare Workers 上，Vectorize 是自然選擇；已經有 Postgres 的團隊，pgvector 通常是最省事的起點；需要自架完全控制、過濾條件又複雜，Qdrant 是最成熟的開源選項。

不要在「哪個 benchmark 最高」上花太多時間，也不要相信任何一張功能對照表（包括這篇文章刪掉的那張）。先確認你的部署環境、過濾需求和規模，再去官方文件確認當下的功能狀態。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [ANN Benchmarks - Benchmarking Nearest Neighbor Search](https://ann-benchmarks.com/)
- [A Comprehensive Survey on Vector Database (arXiv:2310.11703)](https://arxiv.org/abs/2310.11703)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Pinecone - Hybrid search](https://docs.pinecone.io/guides/search/hybrid-search)
- [Pinecone - Understanding pod-based indexes（不建議新專案使用）](https://docs.pinecone.io/guides/indexes/pods/understanding-pod-based-indexes)
- [Weaviate Documentation](https://weaviate.io/developers/weaviate)
- [Weaviate - Search (GraphQL | gRPC)](https://docs.weaviate.io/weaviate/api/graphql)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Qdrant - A Complete Guide to Filtering in Vector Search](https://qdrant.tech/articles/vector-search-filtering/)
- [Chroma Documentation](https://docs.trychroma.com/)
- [Chroma Cloud](https://docs.trychroma.com/cloud/getting-started)
- [pgvector](https://github.com/pgvector/pgvector)
- [pgvector 0.8.0 Released（iterative index scans）](https://www.postgresql.org/about/news/pgvector-080-released-2952/)
- [Cloudflare Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Vectorize - Metadata filtering](https://developers.cloudflare.com/vectorize/reference/metadata-filtering/)
- [Cloudflare Vectorize - Limits](https://developers.cloudflare.com/vectorize/platform/limits/)
- [Cloudflare AI Search - Hybrid search](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
