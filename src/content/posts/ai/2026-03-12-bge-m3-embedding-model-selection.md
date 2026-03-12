---
title: "BGE-M3：為什麼這個 Embedding 模型適合繁體中文 RAG"
date: 2026-03-12
category: ai
tags: [rag, embedding, bge-m3, multilingual, vector-search, cloudflare-workers-ai]
lang: zh-TW
tldr: "Embedding 模型的選擇直接影響 RAG 的搜尋品質。BGE-M3 的多語言訓練、1024 維向量、同系列 Reranker，是繁中 RAG 的實用選擇。"
description: "BGE-M3 Embedding 模型的選型考量：多語言能力、向量維度、與 Reranker 的配套關係，以及在 Cloudflare Workers AI 上的實際限制。"
draft: false
---

RAG 系統的搜尋品質，50% 取決於 Embedding 模型的選擇。一個好的 Embedding 模型讓語義相近的查詢和文件在向量空間距離接近，差的模型讓向量搜尋變成彩票。

選擇 Embedding 模型時，幾個關鍵問題：語言支援、向量維度、是否有配套的 Reranker、在目標平台上的可用性。

## BGE-M3 是什麼

BGE-M3 是北京人工智能研究院（BAAI）出品的多語言 Embedding 模型，「M3」代表 **Multi-Linguality, Multi-Granularity, Multi-Functionality**：

- **Multi-Linguality**：支援 100+ 語言，包括繁體中文
- **Multi-Granularity**：支援短句到長文件（最長 8192 tokens）
- **Multi-Functionality**：同時支援 Dense retrieval、Sparse retrieval、Multi-vector retrieval

在 Cloudflare Workers AI 上，可用的版本是標準的 Dense retrieval 模式（1024 維向量）。

## 選它的理由

### 繁體中文效果

大多數 Embedding 模型的中文訓練資料以簡體中文為主，繁體中文的語義理解較差。BGE-M3 的多語言訓練集包含大量繁體中文資料，在繁中語義搜尋上的表現明顯優於只支援英文或以簡中為主的模型。

攀岩相關的繁體中文術語（「先鋒攀登」、「確保站」、「岩壁」、「抱石」）在 BGE-M3 的向量空間中有比較好的語義聚類，搜尋相關術語不會出現奇怪的跳號。

### 1024 維向量

常見的選項是 768 維（BERT 系列）、1024 維（BGE-M3）、1536 維（OpenAI text-embedding-3-small）、3072 維（text-embedding-3-large）。

維度越高，表達能力越強，但：
- 儲存成本：每個向量多佔空間
- 計算成本：cosine similarity 計算量隨維度增加
- Vectorize 的查詢速度：維度越高越慢

1024 維在攀岩這個相對垂直的領域已經足夠區分語義差異，不需要追求更高維度。

### 配套的 Reranker

BAAI 同時提供 `bge-reranker-base`（Cross-Encoder），兩者是同系列訓練的，向量空間的理解更協調。

這點很重要：如果 Embedding 模型和 Reranker 來自不同訓練集，兩者對「相關性」的定義可能有細微差異，導致 Reranker 重排後的效果不穩定。同系列模型避免了這個問題。

### Cloudflare Workers AI 原生支援

部署在 Cloudflare Workers 上，使用平台原生的 Workers AI 避免了外部 API 的延遲和費用：

```typescript
const embeddingResult = await env.AI.run(
  "@cf/baai/bge-m3",
  { text: [query] }
);
const vector = embeddingResult.data[0]; // number[], length=1024
```

相比呼叫 OpenAI Embedding API（跨區域網路請求），Workers AI 在同一個 Cloudflare 網路內，延遲低很多。

## 實際的限制

### 批次大小

Workers AI 對 bge-m3 有批次大小限制，一次請求不能超過一定數量的文字。Multi-Query 擴展生成 5 個子查詢時，需要分批 embed 或確認批次限制：

```typescript
// 並行 embed，每個單獨一次請求
const embeddings = await Promise.all(
  queries.map(q => embed(q, env))
);
```

### 索引時的吞吐量

大量文件索引時，Workers AI 有每分鐘請求限制。索引服務需要做限流：

```typescript
const EMBED_BATCH_SIZE = 10;
const EMBED_DELAY_MS = 100; // 批次間等待

for (let i = 0; i < chunks.length; i += EMBED_BATCH_SIZE) {
  const batch = chunks.slice(i, i + EMBED_BATCH_SIZE);
  await Promise.all(batch.map(chunk => embedAndStore(chunk)));
  if (i + EMBED_BATCH_SIZE < chunks.length) {
    await sleep(EMBED_DELAY_MS);
  }
}
```

### 8192 Token 限制

BGE-M3 支援到 8192 tokens，但 Workers AI 的實際限制可能更低。索引前需要把長文件切塊，確保每個 chunk 不超過限制。

## 與其他選項的比較

| 模型 | 維度 | 多語言 | 平台 | Reranker | 成本 |
|------|------|--------|------|---------|------|
| BGE-M3 | 1024 | ✅ 強 | Workers AI | ✅ 同系列 | Workers AI 計費 |
| text-embedding-3-small | 1536 | 🟡 中 | OpenAI API | ❌ | API 費用 |
| text-embedding-3-large | 3072 | 🟡 中 | OpenAI API | ❌ | 高 API 費用 |
| multilingual-e5-large | 1024 | ✅ 強 | 自架 | ❌ | 自架成本 |
| nomic-embed-text | 768 | ❌ 英文為主 | Workers AI | ❌ | Workers AI 計費 |

在 Cloudflare Workers 的限制下，BGE-M3 是多語言支援最好的選擇，同時有配套 Reranker，是這個場景的自然選擇。

## 整體來說

Embedding 模型選型不是「找最強的」，而是「找最適合這個場景和平台限制的」。BGE-M3 在繁體中文語義理解、平台原生支援、配套工具鏈（Reranker）上的組合，讓它在 Cloudflare Workers 的 RAG 系統中是個實用的選擇。

如果不在 Cloudflare Workers 上，或者需要更強的英文支援，OpenAI 的 text-embedding-3-large 是另一個常見選擇。關鍵是根據語言需求、部署平台、成本限制做選型，而不是盲目追求最高維度或最新模型。
