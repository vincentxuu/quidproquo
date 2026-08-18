---
title: "RAG 成本優化：把每次查詢的花費壓到最低"
date: 2026-03-12
type: guide
category: ai
tags: [rag, cost-optimization, performance, token-budget, caching]
lang: zh-TW
tldr: "RAG 系統的成本來自 LLM token、Embedding API、向量搜尋。每個環節都有可以壓成本的地方，但要確認優化沒有犧牲太多品質。"
description: "RAG 系統的成本組成分析、各環節的優化策略，以及品質和成本之間的取捨決策框架。"
draft: false
series:
  name: "RAG 技法大全"
  order: 42
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

這幾項的比例會隨模型與 pipeline 設計大幅變動，本文不列任何單價——**各家單價、prompt caching 折扣、batch 折扣都在改，任何寫死在文章裡的數字都會過期**。要算自己的帳，去看官方定價頁：[Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)、[Anthropic pricing](https://www.anthropic.com/pricing)、[OpenAI pricing](https://platform.openai.com/docs/pricing)。

真正該做的第一件事，是在自己的系統裡量一次：把每個 pipeline step 的 input/output token 數記進 log，乘上當下單價，得到「每次查詢的成本拆解」。沒有這張表，後面所有優化都是猜的。一般而言 LLM 生成是最大頭，其次是 embedding，向量搜尋與資料庫通常是零頭——但比例請以自己量到的為準。

## 優化策略

### 1. Semantic Caching（投資報酬率最高）

語義相近的查詢直接返回快取結果，跳過整個 pipeline：

- 實作成本：低（一次向量比對 + KV 存取）
- 效益：完全省去 LLM 生成成本
- 適用條件：查詢重複率高的場景

對攀岩社群，「龍洞有哪些路線」、「怎麼開始攀岩」這類問題重複率高，快取值得做。省下的比例基本上就等於 cache hit ratio：命中率 30%，LLM 生成成本大約也就少 30%。這個數字沒有通則，取決於你的使用者有多集中在少數問題上——先把 hit ratio 當成一個要監控的指標埋進 log，再談它值多少錢。

細節見〈[Semantic Caching：語義相近的問題只跑一次 RAG](/posts/ai/2026-03-12-semantic-caching)〉。

### 2. 使用供應商內建的折扣機制

在動任何架構之前，先確認兩個「不改邏輯就能省」的開關有沒有開：

- **Prompt caching**：把 system prompt、few-shot 範例、固定的知識片段擺在 prompt 最前面且逐字不變，重複的前綴就能以折扣價計費。RAG 的 prompt 前半段通常是固定的，這個很好拿。做法看 [Anthropic](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)、[OpenAI](https://platform.openai.com/docs/guides/prompt-caching)、[Gemini](https://ai.google.dev/gemini-api/docs/caching) 的官方文件。
- **Batch API**：不需要即時回應的工作（重建索引時的摘要、離線評估、Judge 的批次重跑）改走批次介面，通常有明顯折扣，代價是延遲。見 [OpenAI batch](https://platform.openai.com/docs/guides/batch)、[Anthropic batch processing](https://docs.claude.com/en/docs/build-with-claude/batch-processing)、[Workers AI Batch API](https://developers.cloudflare.com/workers-ai/features/batch-api/)。

折扣幅度各家不同也會調整，去定價頁看當下的數字，不要抄任何文章裡寫死的百分比。

### 3. 動態模型選擇

根據查詢複雜度選擇 LLM，不是所有查詢都需要最強的模型：

```typescript
// 依「查詢分類」路由到不同大小的模型
const model = queryType === 'simple' || queryType === 'general-knowledge'
  ? env.MODEL_SMALL   // 小模型：簡單定義、通用知識
  : env.MODEL_LARGE;  // 大模型：複雜推理、推薦
```

這裡刻意不寫死任何模型 ID：可用的模型每幾個月就換一輪，寫死在程式碼裡的模型名稱是最容易腐爛的東西。把模型 ID 放進設定（環境變數或 `ai_config`），文章與程式碼只描述「大 / 小」這個角色。可選清單見 [Workers AI models](https://developers.cloudflare.com/workers-ai/models/) 或各家的 model 文件。

規模差一級，單價通常差好幾倍（實際倍率去定價頁比），所以這條的槓桿很直接：能被安全路由到小模型的查詢比例越高，省越多。前提是**分類要準**——把複雜查詢誤判成簡單查詢送給小模型，省下的錢會用回答品質付回去。上線前先拿一批標好的查詢量一下分類器的準確率，再決定路由要多積極。

另一個同源的招式是「小 reranker 在前、大生成模型在後」：用便宜的 reranker 把候選從幾十份壓到 top-3~5，再讓貴的生成模型只讀這幾份。省的是生成端的 input token，而 rerank 本身便宜得多。

### 4. Context 長度控制

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

### 5. 跳過不必要的步驟

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

### 6. Embedding 複用

同一次請求裡，embedding 只計算一次，後面都複用：

```typescript
// pipeline 早期計算，存入 context
ctx.queryEmbedding = await embed(ctx.query, env);

// 後面所有搜尋路徑都用這個 embedding，不重新計算
const queryResults = await searchVectorize(ctx.queryEmbedding, filter);
```

### 7. BM25 作為搜尋的前置過濾

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

排序的原則，而不是一張抄得到的表（省下的百分比完全取決於你的流量分佈，別人的數字對你沒有意義）：

1. **不動品質的先做**：prompt caching、batch API、embedding 複用——這些只是把同一件事算得更省，回答一個字都不會變。
2. **命中才省的次之**：semantic cache 的省法等於 cache hit ratio，品質風險只有「快取回傳了過期資料」，用 TTL 與 privacy 規則控制。
3. **拿品質換錢的要量過再上**：動態模型選擇、縮短 context、跳過 pipeline step。每一項上線前都要有 A/B 或離線評估數字，知道 groundedness 掉了多少。
4. **品質監控最後才砍**：Judge 抽樣（例如只評估 30%）是可接受的折衷；完全關掉 Judge 省的是零頭，失去的是「系統壞掉時你會知道」，通常不划算。

## 整體來說

RAG 成本優化的投資報酬率排序，通常是：先開 prompt caching 與 batch（不動品質）、再做 semantic cache（省下的等於命中率）、最後才是動態模型選擇（省最多，但要用分類準確率換）。真正的數字只能從自己的 token log 算出來，別人文章裡的百分比只能當作「有沒有值得一試」的參考。

其他優化（context 長度控制、步驟跳過）是微調，效益有限但累積起來也值得。品質保護（Judge）是不應該輕易犧牲的，它的成本換來的是對系統品質的持續監控，這個監控的價值遠超過省下的那點 token 費用。

---

## 參考資料

- [CompactRAG: Reducing LLM Calls and Token Overhead in Multi-Hop Question Answering](https://arxiv.org/abs/2602.05728)
- [RAGO: Systematic Performance Optimization for Retrieval-Augmented Generation Serving](https://arxiv.org/abs/2503.14649)
- [Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach](https://arxiv.org/abs/2407.16833)
- [Towards Understanding Systems Trade-offs in Retrieval-Augmented Generation Model Inference](https://arxiv.org/abs/2412.11854)
- 官方定價與折扣機制（單價會變，以官方頁面為準）：[Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)、[Anthropic pricing](https://www.anthropic.com/pricing)、[OpenAI pricing](https://platform.openai.com/docs/pricing)、[OpenAI Batch API](https://platform.openai.com/docs/guides/batch)、[Anthropic Batch processing](https://docs.claude.com/en/docs/build-with-claude/batch-processing)、[Workers AI Batch API](https://developers.cloudflare.com/workers-ai/features/batch-api/)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
