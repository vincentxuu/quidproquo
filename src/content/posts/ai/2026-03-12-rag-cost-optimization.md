---
title: "RAG 成本優化：把每次查詢的花費壓到最低"
date: 2026-03-12
category: ai
tags: [rag, cost-optimization, performance, token-budget, caching]
lang: zh-TW
tldr: "RAG 系統的成本來自 LLM token、Embedding API、向量搜尋。每個環節都有可以壓成本的地方，但要確認優化沒有犧牲太多品質。"
description: "RAG 系統的成本組成分析、各環節的優化策略，以及品質和成本之間的取捨決策框架。"
draft: false
---

一個生產環境的 RAG 系統，成本來源很具體。把每個環節的成本來源搞清楚，才能有針對性地優化。

## 成本組成分析

**LLM 生成**（通常是最大頭）：
- 每次查詢消耗 prompt tokens（context + query）+ completion tokens（回答）
- 多次 LLM 呼叫（Query Classification、HyDE、Multi-Query、Judge）累加

**Embedding**：
- 每次查詢的 query embedding
- HyDE 假設文件的 embedding
- Multi-Query 子查詢的 embeddings
- 索引時每個 chunk 的 embedding（一次性，但量大）

**向量搜尋**：
- 多路向量搜尋（query + HyDE + Multi-Query）的費用
- Reranking（Cross-Encoder）的費用

**資料庫**：
- BM25 全文搜尋
- Metadata 查詢
- Log 寫入

在 Cloudflare Workers AI 的環境，LLM 生成通常佔 70-80%，Embedding 佔 10-15%，其餘是資料庫和 Vectorize。

## 優化策略

### 1. Semantic Caching（投資報酬率最高）

語義相近的查詢直接返回快取結果，跳過整個 pipeline：

- 實作成本：低（一次向量比對 + KV 存取）
- 效益：完全省去 LLM 生成成本
- 適用條件：查詢重複率高的場景

對攀岩社群，「龍洞有哪些路線」、「怎麼開始攀岩」這類問題有很高的重複率，快取命中率可以達到 20-30%，顯著降低平均成本。

```typescript
// 快取前：每次都跑完整 pipeline，平均 0.05 USD/query
// 快取後：70% 未命中跑 pipeline，30% 命中秒回
// 平均成本降低 30%
```

### 2. 動態模型選擇

根據查詢複雜度選擇 LLM，不是所有查詢都需要最強的模型：

```typescript
const model = queryType === 'simple' || queryType === 'general-knowledge'
  ? 'llama-3.1-8b-instruct'   // 便宜，夠用
  : 'gemma-3-12b-it';         // 貴，但必要
```

| 模型 | 相對成本 | 適合場景 |
|------|---------|---------|
| 8B 模型 | 1x | 簡單定義、通用知識 |
| 12B 模型 | 3-4x | 複雜推理、推薦 |
| 70B+ 模型 | 10x+ | 極複雜（避免用） |

如果 40% 的查詢是 simple 類型，用輕量模型就能省下 40% × (3x-1x) = 80% 的模型成本。

### 3. Context 長度控制

LLM 的成本和 context 長度正相關。context 越長，prompt tokens 越多：

```typescript
// 不好：把所有搜尋結果都塞進 context
const context = allDocuments.map(d => d.content).join('\n');

// 好：限制 context 長度
const MAX_CONTEXT_TOKENS = 3000;
const context = buildContext(selectedDocuments, MAX_CONTEXT_TOKENS);
```

控制策略：
- MMR 選出最多樣的 Top-5 文件（不是 Top-20）
- 對每個文件截取最相關的段落（不是整份文件）
- Context compression（讓 LLM 先壓縮文件再送給生成模型）

### 4. 跳過不必要的步驟

每個 pipeline step 都有成本，確保只跑必要的步驟：

```typescript
// HyDE 只在 complex 查詢跑
skipWhen: (ctx) => ctx.queryType !== 'complex'

// Multi-Query 只在 complex 查詢跑
skipWhen: (ctx) => ctx.queryType !== 'complex'

// Self-Reflection 只在品質差的回答觸發
skipWhen: (ctx) => ctx.judgeResult?.quality > 2

// Judge 可以設定為只對特定比例的查詢跑（抽樣評估）
skipWhen: (ctx) => Math.random() > 0.3  // 只評估 30% 的查詢
```

Judge 的抽樣評估是個值得考慮的做法：全量 Judge 成本高，但只要樣本夠有代表性，30% 抽樣的監控效果已經足夠。

### 5. Embedding 複用

同一次請求裡，embedding 只計算一次，後面都複用：

```typescript
// pipeline 早期計算，存入 context
ctx.queryEmbedding = await embed(ctx.query, env);

// 後面所有搜尋路徑都用這個 embedding，不重新計算
const queryResults = await searchVectorize(ctx.queryEmbedding, filter);
```

### 6. BM25 作為搜尋的前置過濾

對可以用關鍵字精確命中的查詢（地名、路線名、難度），先用 BM25 快速過濾，再把少量候選送去向量搜尋做精排：

```typescript
// 替代全表向量搜尋
if (hasExactKeywords(query)) {
  const bm25Results = await bm25Search(query, filter);
  if (bm25Results.length >= 5) {
    // BM25 結果夠多，跳過向量搜尋
    ctx.candidateMatches = bm25Results;
    return;
  }
}
// 否則繼續向量搜尋
```

向量搜尋（ANN）比 BM25 貴，能用 BM25 就不用向量搜尋。

## 成本 vs 品質的取捨

優化成本不是無限制地削，而是找到「夠好的品質 + 可接受的成本」的平衡點：

```
成本優化決策框架：

1. 建立 baseline 成本和品質指標
2. 每個優化選項評估：
   - 成本降低多少（%）
   - 品質下降多少（groundedness、user satisfaction）
3. 計算 cost/quality ratio
4. 按 ratio 優先選擇，到品質下降接近紅線為止
```

| 優化 | 成本降低 | 品質影響 | 推薦程度 |
|------|---------|---------|---------|
| Semantic Cache | -30% | 無 | ⭐⭐⭐⭐⭐ |
| 動態模型選擇 | -20% | 輕微（simple query 用小模型） | ⭐⭐⭐⭐⭐ |
| 減少 context 長度 | -15% | 中等（可能遺漏資訊） | ⭐⭐⭐ |
| Judge 抽樣 30% | -10% | 輕微（監控密度降低） | ⭐⭐⭐⭐ |
| 完全跳過 Judge | -13% | 高（失去品質保護） | ⭐ |

## 整體來說

RAG 成本優化的最高投資報酬率策略是：Semantic Cache 和動態模型選擇。前者完全省去重複查詢的成本，後者讓簡單查詢用便宜的模型。這兩個加起來，通常可以把平均成本降低 40-50%，且幾乎不影響整體品質。

其他優化（context 長度控制、步驟跳過）是微調，效益有限但累積起來也值得。品質保護（Judge）是不應該輕易犧牲的，它的成本換來的是對系統品質的持續監控，這個監控的價值遠超過省下的那點 token 費用。
