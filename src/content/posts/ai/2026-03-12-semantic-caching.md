---
title: "Semantic Caching：語義相近的問題只跑一次 RAG"
date: 2026-03-12
category: ai
tags: [rag, semantic-cache, caching, vector-search, performance]
lang: zh-TW
tldr: "快取不只能比對完全一樣的查詢，語義相近的問題也能命中快取，省下整個 RAG pipeline 的執行。"
description: "Semantic Caching 的設計：用向量相似度匹配快取的查詢，cosine threshold 設定，privacy 考量，以及在 RAG 系統中的效能影響。"
draft: false
---

傳統快取比對的是精確字串：「龍洞有幾條路線」和「龍洞共有幾條路線」會被當成兩個不同的查詢，各自執行一次完整的 RAG pipeline。

Semantic Caching 用向量相似度做比對：**如果兩個查詢的 embedding 足夠接近，就視為同一個問題，直接回傳快取結果**。

## 運作原理

```typescript
async function checkSemanticCache(
  queryVector: number[],
  db: D1Database,
  kv: KVNamespace,
  threshold = 0.95
): Promise<CachedResult | null> {

  // 從 KV 取所有快取的 embedding
  const cached = await getCachedEmbeddings(kv);

  for (const entry of cached) {
    const similarity = cosineSimilarity(queryVector, entry.embedding);

    if (similarity >= threshold) {
      return entry.result; // 命中快取
    }
  }

  return null; // 未命中
}
```

命中快取 → 跳過所有 17 個 pipeline step，直接回傳結果。延遲從 5-8 秒降至 < 100 毫秒。

## Threshold 的選擇

0.95 的 cosine 相似度看起來很高，但在語義空間中這是合理的：

| 相似度 | 語義關係 |
|------|---------|
| 1.0 | 完全相同的句子 |
| 0.98-0.99 | 措辭幾乎一樣，只差助詞 |
| 0.95-0.97 | 語義幾乎等同，不同表達方式 |
| 0.90-0.94 | 相關但有一定差異 |
| < 0.90 | 顯著不同 |

0.95 能讓「龍洞有幾條路線」和「龍洞共有幾條路線」命中同一快取，但不會讓「龍洞有幾條路線」和「龍洞最難的路線是什麼」混在一起。

這個值可以通過 `ai_config` 動態調整，找到 cache hit rate 和準確度的最佳平衡點。

## 快取的存儲

使用 Cloudflare KV 存儲快取：

```typescript
await kv.put(
  `semantic_cache:${queryHash}`,
  JSON.stringify({
    embedding: queryVector,
    result: response,
    createdAt: Date.now(),
  }),
  { expirationTtl: 3600 } // TTL: 1 小時
);
```

1 小時的 TTL 是個取捨：
- 太短 → cache hit rate 低，省不了多少
- 太長 → 資料更新後快取可能過期（路線資訊被修改、新路線加入）

攀岩路線資訊相對穩定，1 小時是合理的。若資料有重大更新，可以手動清除快取。

## Privacy 考量

**已登入用戶的查詢不進快取**。

個性化查詢的結果依賴用戶的個人資料（攀岩程度、歷史記錄、偏好），快取同一個問題給不同用戶會回傳錯誤的個性化結果：

- 用戶 A 問「推薦適合我的路線」→ 回傳 5.10 的路線
- 用戶 B（高手）問同樣的問題 → 也回傳 5.10 → 錯誤

匿名查詢（未登入的一般問題）就沒有這個問題，可以安全快取。

## 快取命中率的影響

快取命中率取決於：
1. **使用者行為模式**：攀岩社群有一些高頻問題（「龍洞有哪些路線」、「抱石和運動攀登的差別」）
2. **Threshold 設定**：越低 → 越容易命中，但可能回傳不精確的答案
3. **TTL 設定**：越長 → 快取池越大，命中率越高

在早期的攀岩社群，使用者群體集中，高頻問題的重疊度高，語義快取的效益很明顯。

## 在 Pipeline 中的位置

Semantic Cache 是 pipeline 的**第一個 step**，在所有其他步驟之前執行：

```
Request
  ↓
[Semantic Cache Check] ← 如果命中，直接 return
  ↓ (未命中)
[Query Classification]
  ↓
[... 其他 17 個 steps ...]
```

命中時的返回包含完整的 `query_id`、`sources`、`quota_info`，讓前端體驗一致，使用者看不出是快取結果還是新生成的。

## 整體來說

Semantic Caching 是 RAG 系統效能優化中成本最低、效益最高的手段之一。實作簡單（一次向量比對），效果明顯（延遲從秒級降到毫秒級），對使用者體驗的提升立竿見影。

唯一需要注意的是 privacy 考量（個性化查詢不快取）和 TTL 設定（資料更新的頻率）。其他方面，這是幾乎沒有缺點的優化。
