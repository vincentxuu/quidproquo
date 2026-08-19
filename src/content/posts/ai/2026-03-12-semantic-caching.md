---
title: "Semantic Caching：語義相近的問題只跑一次 RAG"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, semantic-cache, caching, vector-search, performance]
lang: zh-TW
tldr: "快取不只能比對完全一樣的查詢，語義相近的問題也能命中快取，省下整個 RAG pipeline 的執行。"
description: "Semantic Caching 的設計：用向量相似度匹配快取的查詢，cosine threshold 設定，privacy 考量，以及在 RAG 系統中的效能影響。"
draft: false
series:
  name: "RAG 技法大全"
  order: 41
---

> 🌏 [English version](/posts/ai/2026-03-12-semantic-caching-en)

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

命中快取 → 跳過後續整條 pipeline，直接回傳結果。延遲從「跑完整條 pipeline 的秒級」降到「一次向量比對的毫秒級」，實際數字取決於你的 pipeline 長度與模型，自己量過再對外宣稱。

> 上面的 loop 是「把所有快取 embedding 拉回來線性掃一遍」，只在快取條目是幾十、幾百筆的規模能用。它有兩個會踩到的限制：Workers KV 只能 `list()` 出 key，值要一把一把讀（[KV 運作原理](https://developers.cloudflare.com/kv/concepts/how-kv-works/)），條目一多，光讀快取就比跑 pipeline 還慢；而且 KV 是最終一致的，剛寫入的快取在其他地區不保證馬上讀得到。條目上千以後，正確的做法是把快取查詢本身放進向量索引（例如 [Vectorize](https://developers.cloudflare.com/vectorize/) 開一個獨立的 cache namespace），用 top-1 + threshold 取代線性掃描。

## Threshold 的選擇

0.95 的 cosine 相似度看起來很高，但在語義空間中這是合理的。下表是個直覺參考，**不是通用常數**——不同 embedding 模型的相似度分佈差很多（有些模型的無關句對就有 0.7 以上的底噪），務必拿自己的查詢日誌校準一次：

| 相似度 | 語義關係 |
|------|---------|
| 1.0 | 完全相同的句子 |
| 0.98-0.99 | 措辭幾乎一樣，只差助詞 |
| 0.95-0.97 | 語義幾乎等同，不同表達方式 |
| 0.90-0.94 | 相關但有一定差異 |
| < 0.90 | 顯著不同 |

0.95 能讓「龍洞有幾條路線」和「龍洞共有幾條路線」命中同一快取，但不會讓「龍洞有幾條路線」和「龍洞最難的路線是什麼」混在一起。

這個值可以通過 `ai_config` 動態調整，找到 cache hit rate 和準確度的最佳平衡點。校準方式很土法：抓一批真實查詢兩兩配對，人工標「該不該共用答案」，再看哪個 threshold 的偽命中率可以接受。

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

## 先確認供應商內建的快取夠不夠

自己做 semantic cache 之前，先看兩層現成的機制能不能解掉一部分：

- **Prompt caching / context caching**：主流 API 都支援把重複的 prompt 前綴（system prompt、固定的知識片段）快取在供應商那側，命中時輸入 token 以折扣計價。這是**精確前綴比對**，不是語義比對，所以它省的是「同一份長 context 反覆送」的錢，不是「同義問題重複跑」的錢——兩者互補。細節與計價看各家官方文件：[Anthropic prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)、[OpenAI prompt caching](https://platform.openai.com/docs/guides/prompt-caching)、[Gemini context caching](https://ai.google.dev/gemini-api/docs/caching)。
- **Gateway 層快取**：如果請求走 [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/features/caching/)，可以直接在 gateway 開快取，不必自己寫。官方明講它是**整個請求的精確比對**，語義比對還在規劃中。
- **函式庫層的現成語義快取**：Python 生態早就有一整排——`langchain-community` 的 [`RedisSemanticCache`](https://reference.langchain.com/python/langchain-community/cache/RedisSemanticCache)、`CassandraSemanticCache`、`OpenSearchSemanticCache`、`AzureCosmosDBSemanticCache`，以及 GPTCache。做的事跟本文下面要手刻的一樣（embedding + 相似度閾值）。

所以「語義快取只能自己做」並不成立——前兩層確實只認一模一樣的輸入（「龍洞有幾條路線」和「龍洞共有幾條路線」在字串上不同），但第三層有現成品。**真正逼你自己做的是技術棧**：現成的語義快取實作都在 Python 生態，跑在 Workers / TypeScript 上就只能落回自己實作。

## Privacy 考量

**已登入使用者的查詢不進快取**。

個性化查詢的結果依賴使用者的個人資料（攀岩程度、歷史記錄、偏好），快取同一個問題給不同使用者會回傳錯誤的個性化結果：

- 使用者 A 問「推薦適合我的路線」→ 回傳 5.10 的路線
- 使用者 B（高手）問同樣的問題 → 也回傳 5.10 → 錯誤

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
[... 後續所有 steps ...]
```

命中時的返回包含完整的 `query_id`、`sources`、`quota_info`，讓前端體驗一致，使用者看不出是快取結果還是新生成的。

## 整體來說

Semantic Caching 是 RAG 系統效能優化中成本最低、效益最高的手段之一。實作簡單（一次向量比對），效果明顯（延遲從秒級降到毫秒級），對使用者體驗的提升立竿見影。

需要注意的是三件事：privacy（個性化查詢不快取）、TTL（資料更新的頻率），以及快取本身的查詢成本——條目一多，線性掃描會反過來變成瓶頸，記得換成向量索引。這三點顧好，它就是投報率極高的優化。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [GPTCache: An Open-Source Semantic Cache for LLM Applications Enabling Faster Answers and Cost Savings](https://aclanthology.org/2023.nlposs-1.24/)——概念仍值得讀，但 [GPTCache 專案本身](https://github.com/zilliztech/GPTCache)最後一個 release 是 2024-08 的 0.1.44，之後只有零星提交，不建議當成還在積極維護的相依套件。
- [MeanCache: User-Centric Semantic Caching for LLM Web Services (arXiv:2403.02694)](https://arxiv.org/abs/2403.02694)
- [Cloudflare Workers KV Documentation](https://developers.cloudflare.com/kv/)
- [Cloudflare AI Gateway：Caching](https://developers.cloudflare.com/ai-gateway/features/caching/)
- [Anthropic：Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
- [OpenAI：Prompt caching](https://platform.openai.com/docs/guides/prompt-caching)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
