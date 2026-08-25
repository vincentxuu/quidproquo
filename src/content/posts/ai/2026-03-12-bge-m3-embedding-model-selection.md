---
title: "BGE-M3：為什麼這個 Embedding 模型適合繁體中文 RAG"
date: 2026-03-12
updated: 2026-08-25
type: guide
category: ai
tags: [rag, embedding, bge-m3, multilingual, vector-search, cloudflare-workers-ai]
lang: zh-TW
tldr: "Embedding 模型的選擇直接影響 RAG 的搜尋品質。BGE-M3 的多語言訓練、1024 維向量、同系列 Reranker，是繁中 RAG 的實用選擇。"
description: "BGE-M3 Embedding 模型的選型考量：多語言能力、向量維度、與 Reranker 的配套關係，以及在 Cloudflare Workers AI 上的實際限制。"
draft: false
series:
  name: "RAG 技法大全"
  order: 7
---

> 🌏 [English version](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en)

RAG 系統的搜尋品質，很大一部分取決於 Embedding 模型的選擇。一個好的 Embedding 模型讓語義相近的查詢和文件在向量空間距離接近，差的模型讓向量搜尋變成彩票。

選擇 Embedding 模型時，幾個關鍵問題：語言支援、向量維度、是否有配套的 Reranker、在目標平台上的可用性。

## BGE-M3 是什麼

[BGE-M3](https://huggingface.co/BAAI/bge-m3) 是北京人工智能研究院（BAAI）出品的多語言 Embedding 模型，「M3」代表 **Multi-Linguality, Multi-Granularity, Multi-Functionality**：

- **Multi-Linguality**：官方宣稱支援 100+ 語言（語言清單裡沒有單獨列出繁體中文）
- **Multi-Granularity**：支援短句到長文件（最長 8192 tokens）
- **Multi-Functionality**：同時支援 Dense retrieval、Sparse retrieval、Multi-vector retrieval

在 Cloudflare Workers AI 上，可用的版本是標準的 Dense retrieval 模式（1024 維向量）。

## 選它的理由

### 繁體中文效果

大多數 Embedding 模型的中文訓練資料以簡體中文為主。**要注意 BGE-M3 也是**——[M3 論文](https://arxiv.org/abs/2402.03216)全文沒有出現過 Traditional Chinese，列出的中文微調資料（DuReader、mMARCO-ZH、T²-Ranking、CMedQAv2 等）全是簡中，HuggingFace 模型卡同樣沒提繁中。所以「它對繁中特別好」是沒有依據的，簡繁共享大量字形與詞彙可能讓它堪用，但這要靠你自己的評測集證實。

在這個系統上，攀岩的繁中術語（「先鋒攀登」、「確保站」、「岩壁」、「抱石」）用起來沒有出現明顯的跳號——但這是使用觀感，沒有做過對照量測，別當成模型比較的證據。

### 1024 維向量

常見的向量維度落在 384 到 3072 之間，BGE-M3 是 1024 維。

維度越高，表達能力越強，但：
- 儲存成本：每個向量多佔空間
- 計算成本：cosine similarity 計算量隨維度增加
- Vectorize 的查詢速度：維度越高越慢

值得注意的是「維度高 = 效果好」並不成立：維度只是容量上限，實際檢索品質取決於訓練資料與目標語言。要比較就去看 [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 的多語言分頁，而不是比維度數字——榜單每個月都在動，這裡不列排名。

1024 維在攀岩這個相對垂直的領域已經足夠區分語義差異，不需要追求更高維度。

### 配套的 Reranker

這裡要更正一個常見誤解（本文最初的版本也寫錯了）：**`bge-reranker-base` 並不是 BGE-M3 的配套 Reranker**。它屬於較早的 BGE v1 系列，主打中英雙語。真正與 BGE-M3 同源的是 [`bge-reranker-v2-m3`](https://huggingface.co/BAAI/bge-reranker-v2-m3)——它明確標示為「基於 bge-m3」的多語言 Cross-Encoder，繁中場景應該優先考慮它。

實務上的落差在於：Cloudflare Workers AI 目前提供的 Reranker 是 [`@cf/baai/bge-reranker-base`](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/)，不是 v2-m3。所以在 Workers AI 上跑，等於是「M3 embedding + 非同源 reranker」的組合。

為什麼在意同源與否：如果 Embedding 模型和 Reranker 來自不同訓練集，兩者對「相關性」的定義可能有細微差異，重排後的順序不一定比原本好。多語言／繁中語料尤其容易踩到——上線前務必用自己的查詢集做 A/B，確認加了 Reranker 之後真的變好，而不是預設它一定有幫助。

### Cloudflare Workers AI 原生支援

部署在 Cloudflare Workers 上，使用平台原生的 Workers AI 避免了外部 API 的延遲和費用：

```typescript
const embeddingResult = await env.AI.run(
  "@cf/baai/bge-m3",
  { text: [query] }
);
const vector = embeddingResult.data[0]; // number[], length=1024
```

相比呼叫外部 Embedding API（跨區域網路請求），Workers AI 在同一個 Cloudflare 網路內，延遲低很多。

Workers AI 上的 embedding 模型不只 bge-m3 一個；平台後來陸續加入了 Qwen3-Embedding、EmbeddingGemma 等選項，輸入長度上限與價格各有不同。要選型請直接看 [Workers AI 模型列表](https://developers.cloudflare.com/workers-ai/models/)，這裡不列快照——這份清單的變動速度遠快於文章更新速度。

## 實際的限制

### 批次大小

Workers AI 對單次請求能帶幾筆文字有上限，帳號層級另有速率限制；實際數字以 [Workers AI limits 文件](https://developers.cloudflare.com/workers-ai/platform/limits/)為準，這裡不抄快照。Multi-Query 擴展生成 5 個子查詢時，需要分批 embed 或確認批次限制：

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

### 輸入長度：模型規格 ≠ 平台限制

BGE-M3 原生支援到 8192 tokens，這是最常被拿來當賣點的數字。但**託管平台的實際上限往往低很多**，而且不同文件頁面標的還不一致：

- Cloudflare [AI Search 支援模型表](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/)把 `@cf/baai/bge-m3` 的 input tokens 標為 512
- [Workers AI 的 bge-m3 模型頁](https://developers.cloudflare.com/workers-ai/models/bge-m3/)則只標 context window，沒有列單次輸入上限

兩處對不上，所以**不要照抄任何一個數字**，包括本文的。上線前用一段已知長度的文字實測，確認截斷發生在哪裡。bge-m3 的 API 有 `truncate_inputs` 參數：預設 `false`（超長就報錯），設成 `true` 會靜默截斷——除錯階段建議保持 `false`，才會在超長時直接看到錯誤，而不是拿到一個只 embed 了前半段的向量。

不論上限多少，索引前都必須把長文件切塊。切塊策略見 [Chunking 策略](/posts/ai/2026-03-12-chunking-strategies)。

## 與其他選項怎麼比

原本這裡有一張列出各家模型維度、多語言能力與價格的比較表。那張表現在拿掉了——模型清單、維度、單價每季都在變，寫死在文章裡只會誤導人。以 [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) 為基線，2025-2026 有三條值得對照的分支：

- **小而高效：[jina-embeddings-v5-text](https://arxiv.org/abs/2602.15547)（2026-02-17）** — sub-1B 參數、支援到 32K 上下文，透過蒸餾加上任務導向對比訓練達到同級領先的檢索品質，截斷與二值量化也很穩。適合預算或延遲敏感、純文字檢索為主的場景。
- **多模雙模式：[jina-embeddings-v4](https://arxiv.org/abs/2506.18902)（2025-06-23）** — 3.8B 參數、單向量與多向量雙模式，文字與圖表/表格等視覺豐富內容同吃，在圖表與表格檢索上達到 SOTA。適合要同時檢索影片截圖、掃描檔、圖表，或做跨模態搜尋的場景。
- **多向量：[Jina-ColBERT-v2](https://arxiv.org/abs/2408.16672)** — late interaction 多向量檢索，把 single-vector 訓練技巧移植到 ColBERT，在多語檢索上表現強。適合需要 token 級細粒度比對、可解釋性或高召回的場景，但儲存與查詢成本高於單向量。

怎麼選：純文字、成本/速度優先 → v5-text 這類小模型；要吃圖表與版面、或影片/掃描等多模內容 → v4 多模；要極致召回或做可解釋比對 → ColBERT-v2 多向量。但不論選哪條，**排行榜換很快、要在自家資料上量**——用自己的查詢集與語料做 MTEB 多語言分頁對照與 A/B，重排與量化前後也要一起量，而不是拿任何一篇文章的結論當答案。

判準仍維持五點：

1. **語言優先於分數**：先確認候選模型的訓練資料涵蓋你的目標語言。繁中要特別小心「支援中文」通常指簡體；看模型卡有沒有明確列出多語言訓練，再用自己的術語做實測。
2. **平台可用性是硬限制**：跑在 Workers 上而只能用外部 API 的模型，等於每次查詢多一趟跨網路請求。先看目標平台原生支援哪些。
3. **維度只看得懂成本，看不懂品質**：維度決定儲存與查詢成本，不決定檢索品質。要比品質請查 [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)。
4. **Reranker 要一起選**：確認有沒有同源的 Cross-Encoder 可用，沒有的話要接受重排效果需要自行驗證。
5. **實際輸入上限要實測**：見上一節。

想看目前各平台實際提供哪些模型與價格，去官方頁面查：[Workers AI 模型列表](https://developers.cloudflare.com/workers-ai/models/)、[MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)。

在 Cloudflare Workers 的限制下，BGE-M3 仍是繁中場景相對穩妥的預設值——但這是「這個平台、這個時間點」的結論，不是永久答案。

## 整體來說

Embedding 模型選型不是「找最強的」，而是「找最適合這個場景和平台限制的」。BGE-M3 在繁體中文語義理解、平台原生支援、配套工具鏈（Reranker）上的組合，讓它在 Cloudflare Workers 的 RAG 系統中是個實用的選擇。

如果不在 Cloudflare Workers 上，或者需要更強的英文表現，商用 API 與新一代開源多語言模型都是選項——但請以當下的 MTEB 多語言榜單與自己語料的實測結果為準，不要拿任何一篇文章（包括這篇）裡的模型名稱當結論。關鍵是根據語言需求、部署平台、成本限制做選型，而不是盲目追求最高維度或最新模型。

---

## 更新紀錄

- 2026-08-25：補充 2025-2026 Embedding 三分支選型對照（jina-embeddings-v5-text / v4 / Jina-ColBERT-v2），以 BGE-M3 為基線說明小/高效、多模/視覺、多向量何時適用
- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation (2024)](https://arxiv.org/abs/2402.03216)
- [MTEB: Massive Text Embedding Benchmark (arXiv:2210.07316)](https://arxiv.org/abs/2210.07316)
- [MTEB Leaderboard（Hugging Face，含多語言分頁）](https://huggingface.co/spaces/mteb/leaderboard)
- [BAAI/bge-m3 模型卡](https://huggingface.co/BAAI/bge-m3)
- [BAAI/bge-reranker-v2-m3 模型卡](https://huggingface.co/BAAI/bge-reranker-v2-m3)
- [jina-embeddings-v5-text: Task-Targeted Embedding Distillation (2026-02-17)](https://arxiv.org/abs/2602.15547)
- [jina-embeddings-v4: Universal Embeddings for Multimodal Multilingual Retrieval (2025-06-23)](https://arxiv.org/abs/2506.18902)
- [Jina-ColBERT-v2: A General-Purpose Multilingual Late Interaction Retriever (2024-08-29)](https://arxiv.org/abs/2408.16672)
- [Cloudflare Workers AI — bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/)
- [Cloudflare Workers AI — 模型列表](https://developers.cloudflare.com/workers-ai/models/)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
