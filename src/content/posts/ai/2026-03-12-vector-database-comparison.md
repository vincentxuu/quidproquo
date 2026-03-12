---
title: "Vector Database 選型：Pinecone、Weaviate、Qdrant、Vectorize 怎麼選"
date: 2026-03-12
category: ai
tags: [rag, vector-database, pinecone, weaviate, qdrant, cloudflare-vectorize]
lang: zh-TW
tldr: "向量資料庫的選型比 LLM 選型更受部署平台限制。先確認平台和規模需求，再看功能特性，不要只看 benchmark。"
description: "主流向量資料庫的比較：Pinecone、Weaviate、Qdrant、Chroma、Cloudflare Vectorize，各自的強項、限制，以及選型決策框架。"
draft: false
---

向量資料庫是 RAG 系統的核心基礎設施。選型時，大多數人先看 benchmark（ANN 搜尋速度、recall@K），但實際上決定選哪個的通常是：**部署平台、規模需求、已有的技術棧**。

## Pinecone

**定位**：最成熟的托管向量資料庫，SaaS 模式。

**核心特性**：
- 完全托管，不需要維運
- Serverless tier：按查詢量計費，適合早期專案
- Pod-based tier：固定容量，適合大規模穩定流量
- Namespace 機制：同一個 index 下的邏輯隔離
- 支援 Metadata 過濾（搜尋時 filter）

**適合場景**：
- 快速啟動，不想維運基礎設施
- 文件數量大（百萬以上）
- 已在 AWS 生態系

**限制**：
- 閉源，資料在 Pinecone 的伺服器（EU 合規需要特別處理）
- Serverless tier 有 cold start 問題
- 跨雲延遲（不在 Cloudflare 網路）

---

## Weaviate

**定位**：開源向量資料庫，功能最豐富，有托管版（Weaviate Cloud）。

**核心特性**：
- GraphQL 查詢介面，支援複雜的混合查詢
- 內建 Hybrid Search（BM25 + 向量，原生支援）
- 模組系統：plug-in vectorizer（直接在資料庫內 embed）
- 多租戶支援
- 支援 Named Vectors（同一個物件多個向量，用於不同語言或模態）

**適合場景**：
- 需要原生 Hybrid Search
- 需要複雜的結構化 + 語義查詢
- 可以自架或接受托管費用

**限制**：
- 自架有一定維運成本（需要 Kubernetes 或 Docker）
- SDK 學習曲線比 Pinecone 高
- 托管版價格較貴

---

## Qdrant

**定位**：Rust 編寫的高效能開源向量資料庫，自架友善。

**核心特性**：
- 高效能，記憶體使用效率高
- 支援 Payload（metadata）過濾，語法靈活
- Sparse Vector 支援（SPLADE 可以直接在 Qdrant 用）
- Quantization（向量量化，降低記憶體使用）
- 支援多向量（類似 ColBERT 的 multi-vector）

**適合場景**：
- 自架，希望完全控制基礎設施
- 記憶體資源有限，需要量化
- 需要 Sparse Vector 支援（SPLADE）

**限制**：
- 托管版（Qdrant Cloud）相對較新，成熟度不如 Pinecone
- 中文文件和社群較少

---

## Chroma

**定位**：最輕量的開源向量資料庫，適合本地開發和小規模部署。

**核心特性**：
- 嵌入式模式（單一 Python process，無需獨立服務）
- 極易上手，幾行程式碼就能跑
- 支援 Server 模式（可以部署成獨立服務）

**適合場景**：
- 本地開發和 PoC
- 小規模（幾萬文件以內）
- 快速驗證 RAG 概念

**限制**：
- 大規模效能不佳
- 功能相對簡單，Metadata 過濾能力有限
- Production 大規模使用案例少

---

## Cloudflare Vectorize

**定位**：Cloudflare Workers 原生的向量資料庫，與 Workers 深度整合。

**核心特性**：
- Workers 原生：在 Workers 內直接呼叫，低延遲
- 與 Workers AI 整合（在同一個請求內做 embed + search）
- Metadata 過濾
- Namespace 支援

```typescript
// Workers 內直接用，沒有跨服務呼叫
const results = await env.VECTORIZE.query(queryVector, {
  topK: 20,
  filter: { crag_id: { $eq: "longtung" } },
  returnValues: false,
  returnMetadata: "all",
});
```

**適合場景**：
- 部署在 Cloudflare Workers 上的 RAG 系統
- 文件數量中等（幾萬到幾十萬）
- 希望最簡化的架構（不需要獨立的向量資料庫服務）

**限制**：
- 只在 Cloudflare 生態系內用
- 功能相對基礎（ANN 搜尋、Metadata 過濾，無原生 Hybrid Search）
- 大規模（百萬以上文件）效能需要評估

---

## 比較總結

| | Pinecone | Weaviate | Qdrant | Chroma | Vectorize |
|---|---------|---------|--------|--------|----------|
| 開源 | ❌ | ✅ | ✅ | ✅ | ❌ |
| 自架 | ❌ | ✅ | ✅ | ✅ | ❌（CF 專屬）|
| Hybrid Search | 需自實作 | ✅ 原生 | 需自實作 | ❌ | 需自實作 |
| Sparse Vector | ❌ | ✅ | ✅ | ❌ | ❌ |
| 大規模效能 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| 上手難度 | 低 | 中 | 中 | 最低 | 低（在 CF 環境） |
| 月費（中等規模） | $70+ | $25+ | $9+ | 自架免費 | Cloudflare 計費 |

## 選型決策框架

```
部署在 Cloudflare Workers？
  → 是 → Vectorize（架構最簡單）

需要自架（資料主權、成本控制）？
  → 是 → Qdrant（效能好，Rust 編寫）
         Weaviate（需要 Hybrid Search 或複雜查詢）

SaaS，不想維運？
  → 規模小 → Chroma（本地開發） or Pinecone Serverless
  → 規模大 → Pinecone Pod-based

需要 Sparse Vector（SPLADE）？
  → Weaviate 或 Qdrant
```

NobodyClimb 選擇 Cloudflare Vectorize 的原因很簡單：系統部署在 Cloudflare Workers，用 Vectorize 讓 embed + search 都在同一個 Cloudflare 網路內，沒有跨服務的網路延遲，架構也最簡單。

## 整體來說

向量資料庫的選型，70% 是由**部署平台和規模**決定的，30% 才是功能特性的比較。在 Cloudflare Workers 上，Vectorize 是自然選擇；在 AWS 上，Pinecone 有地利優勢；需要自架完全控制，Qdrant 是最成熟的開源選項。

不要在「哪個 benchmark 最高」上花太多時間，先確認你的部署環境和規模，再做選型。
