---
title: "Cloudflare Vectorize 怎麼用：自己掌控 RAG Retrieval 的時候"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, cloudflare-vectorize, rag, vector-database, embeddings, retrieval]
lang: zh-TW
tldr: "Vectorize 是 Cloudflare 的向量資料庫。AI Search 適合先把 RAG pipeline 交給平台；Vectorize 適合你要自己控制 chunking、embedding、metadata filter、hybrid retrieval、重新索引與降級策略。"
description: "從 Cloudflare Vectorize 的 index、Workers binding、insert/upsert/query、metadata filtering、namespace、limits 與 pricing，拆解它在 RAG app 裡適合承擔哪一層，以及何時該自己做 retrieval。"
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 6
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 21
---

> 🌏 [English version](/posts/ai/2026-08-30-cloudflare-vectorize-rag-control-en)

[Cloudflare AI Search](/posts/tech/2026-08-29-cloudflare-ai-search-guide) 已經把一條 RAG 管線包好：資料來源、Markdown 轉換、chunking、embedding、Vectorize、BM25、rerank、Workers binding。那為什麼還要直接碰 [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)？

答案通常不在「向量資料庫比較酷」。真正的理由是 retrieval 已經變成產品邏輯：你要自己決定文件怎麼切、metadata 怎麼抽、哪些 tenant 或權限先過濾、BM25 與向量結果怎麼融合、召回失敗時怎麼降級。到了這個階段，Vectorize 才是你要拿在手上的 primitive。

這篇接在 AI Search 後面，不把 Vectorize 寫成泛泛的 [vector database](/posts/ai/2026-03-12-vector-database-comparison) 介紹，而是回答一個實務問題：在 Cloudflare 上做 AI app，什麼時候該自己管 retrieval？

## Vectorize 在 Cloudflare AI Stack 裡的位置

Vectorize 是 Cloudflare 的向量資料庫，用來存 embeddings 並做相似度搜尋。它和 [Workers](https://developers.cloudflare.com/workers/)、[Workers AI](https://developers.cloudflare.com/workers-ai/)、[R2](https://developers.cloudflare.com/r2/)、[D1](https://developers.cloudflare.com/d1/) 放在同一個平台上，所以一個 RAG request 可以留在 Cloudflare 內部完成大部分工作：

```txt
User query
   |
   v
Worker / Agent
   |
   +--> Workers AI embedding model
   |
   +--> Vectorize query
   |       |
   |       +--> vector id + score + metadata
   |
   +--> D1 / R2 / KV fetch source content
   |
   +--> AI Gateway / Workers AI generation
```

這裡要分清楚資料位置。Vectorize 儲存的是 embedding 與可選 metadata，不該當成全文內容庫。常見做法是：

- **Vectorize**：存 chunk vector、chunk id、tenant、文件版本、source key。
- **R2**：存原始文件、轉換後 Markdown、大型 artifacts。
- **D1**：存文件表、chunk 表、權限、索引版本、任務狀態。
- **KV**：存可容忍 eventual consistency 的快取，例如熱門查詢結果或設定。
- **Durable Objects**：處理每個 tenant、agent session 或索引任務的協調。

AI Search 適合「我想要一條託管搜尋管線」。Vectorize 適合「我知道自己的 retrieval 規則，而且那些規則會影響產品品質」。

## 先決定 index：dimensions 和 metric 不能事後改

建立 Vectorize index 時，要指定 vector dimensions 與 distance metric。官方範例：

```sh
npx wrangler vectorize create docs-prod --dimensions=768 --metric=cosine
```

這兩個值不是裝飾。`dimensions` 必須和 embedding 模型輸出的向量長度一致；`metric` 會影響相似度分數。Cloudflare 文件明講：index 建好後，這個 vector configuration 不能更改。

所以不要先隨便建一個 index 再說。最少先決定三件事：

- **embedding 模型**：例如 Workers AI 的 `@cf/baai/bge-base-en-v1.5` 回傳 `[1,768]` 形狀，index 就要是 768 維。
- **分環境策略**：`docs-dev`、`docs-staging`、`docs-prod` 分開，避免測試資料污染正式搜尋。
- **重建路徑**：模型、chunking 或 metadata 規則改掉時，通常要建新 index，完整重灌，切流量，再刪舊 index。

wrangler 會輸出 binding 設定。`wrangler.jsonc` 可以這樣寫：

```jsonc
{
  "vectorize": [
    {
      "binding": "DOC_VECTORS",
      "index_name": "docs-prod"
    }
  ]
}
```

Worker 裡就能用 `env.DOC_VECTORS`。

## 寫入：insert 和 upsert 的差別會影響重建

Vectorize 的 vector 至少有 `id` 與 `values`，也可以帶 `namespace` 和 `metadata`。

```ts
type DocChunk = {
  id: string;
  text: string;
  tenantId: string;
  docId: string;
  sourceUrl: string;
};

export async function indexChunk(env: Env, chunk: DocChunk) {
  const embedding = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
    text: [chunk.text],
  });

  await env.DOC_VECTORS.upsert([
    {
      id: chunk.id,
      namespace: chunk.tenantId,
      values: embedding.data[0],
      metadata: {
        docId: chunk.docId,
        sourceUrl: chunk.sourceUrl,
        indexedAt: Date.now(),
      },
    },
  ]);
}
```

`insert()` 和 `upsert()` 行為不同：

- `insert()` 遇到既有 id 時保留舊 vector。
- `upsert()` 遇到既有 id 時整筆覆蓋，包含 values 和 metadata。
- `insert()`、`upsert()`、`deleteByIds()` 都是非同步 mutation，通常要幾秒後才會反映在查詢結果。

我會把 production RAG ingestion 預設寫成 `upsert()`，因為文件內容、chunking、embedding 模型或 metadata 版本都可能更新。若你用 `insert()`，重跑索引任務可能安靜地保留舊 embedding，debug 時會很痛苦。

大量寫入時要 batch。官方最佳實務提到，Vectorize 會把多個變更合併成背景工作；Workers 單批 upsert 上限目前是 1000 筆，HTTP API 是 5000 筆。不要對 25 萬個 chunk 打 25 萬次 insert。

## 查詢：query 回 id，再自己補內容

查詢時先把使用者 query 轉成 embedding，再交給 Vectorize：

```ts
export async function retrieve(env: Env, query: string, tenantId: string) {
  const embedding = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
    text: [query],
  });

  const matches = await env.DOC_VECTORS.query(embedding.data[0], {
    namespace: tenantId,
    topK: 8,
    returnMetadata: "indexed",
    filter: {
      status: "published",
    },
  });

  return matches.matches.map((match) => ({
    id: match.id,
    score: match.score,
    metadata: match.metadata,
  }));
}
```

兩個細節很容易踩：

- Workers AI embedding response 是 `{ shape, data }`，丟進 `query()` 的是 `data[0]`，不是整個 response，也不是 `data`。
- Vectorize 回來的是 match id、score、metadata、可選 values。真正要丟給模型的 chunk 內容，通常還是從 D1、R2 或 KV 依 id 補回來。

`topK` 預設是 5。目前 V2 index 在不回傳 values/完整 metadata 時最高 100；如果 `returnValues: true` 或 `returnMetadata: "all"`，最高 50。實務上我會先拿 20 到 50 個候選，再用 BM25、reranker、權限與品質規則做下一段處理，而不是直接把前 5 個塞進 prompt。

## metadata filter 是 retrieval 品質，不只是查詢條件

Vectorize 的 `filter` 會先套用，再從過濾後的集合取 `topK`。這個順序對 RAG 很重要。假設使用者只能看某個 tenant 的文件，或只想查特定產品線，權限與 scope 應該先過濾，再做相似度搜尋。

支援的 operator 包含 `$eq`、`$ne`、`$in`、`$nin`、`$lt`、`$lte`、`$gt`、`$gte`。例如：

```ts
const matches = await env.DOC_VECTORS.query(queryVector, {
  namespace: tenantId,
  topK: 12,
  returnMetadata: "indexed",
  filter: {
    product: { $in: ["billing", "analytics"] },
    updatedAtBucket: { $gte: 20260801 },
    visibility: "public",
  },
});
```

但 filter 不是免費魔法。除了 namespace 以外，要對 metadata 欄位過濾，必須先建立 metadata index：

```sh
npx wrangler vectorize create-metadata-index docs-prod \
  --property-name=product \
  --type=string

npx wrangler vectorize create-metadata-index docs-prod \
  --property-name=updatedAtBucket \
  --type=number
```

幾個限制要寫進設計：

- 每個 Vectorize index 最多 10 個 metadata indexes。
- metadata 每個 vector 最多 10 KiB。
- string metadata index 只索引前 64 bytes。
- metadata index 建立前已寫入的 vectors 不會自動進入該 index；要重新 upsert。
- 大量高基數 range query 可能降低效能與準確度。

這也是 Vectorize 和 AI Search 的關鍵分界。AI Search 讓你少管 pipeline；Vectorize 讓你把 scope、權限、版本、時間窗、產品線這些 retrieval 規則變成第一級設計。

## namespace 怎麼用

namespace 是每個 vector 的單一分區鍵。Cloudflare 文件把它定位成按 customer、merchant、store ID 這類邊界切分資料。查詢指定 namespace 時，只會在該 namespace 裡搜尋，而且 namespace filtering 會在 vector search 前套用。

我會用這個原則：

- **namespace 放硬隔離邊界**：tenant、customer、workspace。
- **metadata 放可組合條件**：product、language、doc type、visibility、indexed version。
- **不要把所有維度都塞 namespace**：vector 只能屬於一個 namespace，條件組合交給 metadata filter。

如果你的 SaaS 是每個 workspace 都有自己的知識庫，`namespace = workspaceId` 很自然。若同一個 workspace 還要依角色、產品、文件狀態過濾，那些就放 metadata。

## Vectorize 不能替你做好 hybrid search

純向量搜尋對語意查詢很強，但它會漏掉錯誤碼、API 名稱、短中文詞、版本號、函式名。站上做過一輪 [D1 FTS5 + Vectorize hybrid search 的召回 debug](/posts/tech/2026-08-26-d1-fts5-hybrid-search-cjk-recall)，核心教訓很簡單：BM25 和 vector search 要互補，不能讓其中一路過早短路。

如果你用 AI Search，hybrid retrieval、BM25、RRF 和 reranking 都由平台處理。改用 Vectorize 後，這些就回到你的應用程式：

```txt
query
  |
  +--> embedding -> Vectorize topK
  |
  +--> keyword search -> D1 FTS5 / external search
  |
  +--> merge -> RRF / weighted score / reranker
  |
  +--> fetch chunks -> prompt context
```

這不是壞事，只是工作量要算進去。你拿到的是控制權：你可以針對繁中斷詞、程式碼符號、專有名詞、文件新鮮度、權限條件調整融合邏輯。代價是 ingestion、reindex、evaluation、observability 都要自己補齊。

## 成本模型：看 dimensions，不看 index 數

Vectorize pricing 目前照兩個維度計費：

- **queried vector dimensions**：查詢時掃過的 vector 數加 query vector，再乘以 dimensions。
- **stored vector dimensions**：儲存的 vector 數乘以 dimensions。

官方 pricing 頁目前寫，Workers Free 每月包含 3000 萬 queried vector dimensions 與 500 萬 stored vector dimensions；Workers Paid 每月包含前 5000 萬 queried vector dimensions 與 1000 萬 stored vector dimensions，超出後按量計價。Cloudflare 也明確說，不按 CPU、memory、active index hours 或 index 數收費，空 index 不算 stored dimensions。

這讓小型 RAG 很便宜，但也讓設計決策變得具體：

- chunk 越細，stored dimensions 越高。
- embedding dimensions 越大，查詢和儲存都更貴。
- `topK` 本身不是唯一成本，真正影響是搜尋範圍內的 vector 數和維度。
- namespace 與 filter 如果能縮小搜尋空間，品質和成本都會受益。

價格和 included allocation 會變，文章上線前要重查官方 pricing。這裡的重點不是記數字，是知道成本跟「你存了多少維度、查了多少維度」綁在一起。

## 何時用 AI Search，何時用 Vectorize

我會這樣切：

| 情境 | 選擇 |
|---|---|
| 想快速把文件變成可查詢知識庫 | AI Search |
| 來源是 R2、網站或上傳檔，管線規則可以接受平台預設 | AI Search |
| 需要自己控制 chunking、overlap、索引版本 | Vectorize |
| 需要複雜 metadata filter、tenant 權限、產品線 scope | Vectorize |
| 要把 BM25、Vectorize、reranker、fallback 串成自己的 retrieval stack | Vectorize |
| 要做推薦、相似圖片、去重、分類、異常偵測 | Vectorize |
| 主要目標是讓 Agent 多一個知識庫搜尋工具 | 先 AI Search，再視品質改 Vectorize |

比較直接的判斷方式：如果 retrieval 對你來說只是功能，先用 AI Search。如果 retrieval 已經是產品品質的主要來源，Vectorize 值得拿出來自己設計。

## production 前的檢查清單

上線前我會逐項確認：

- index dimensions 和 embedding 模型輸出一致。
- index name 依環境切開，dev/staging/prod 不共用。
- metadata index 在寫入正式 vectors 前建好。
- vector id 能穩定映射回 D1/R2/KV 的原始內容。
- ingestion job 用 batch upsert，並能重跑。
- query 先做 namespace/metadata filter，再做 rerank 或融合。
- prompt context 保留來源 id、URL、版本與 score。
- 有離線 evaluation set，能比較 chunking、embedding、filter 與 reranker 版本。
- AI Gateway metadata 會記 `retrieval_version`、`index_name`、`topK`、`tenant`。
- 成本估算用 queried/stored vector dimensions，不只看 request 數。

Vectorize 的角色很清楚：它不是 RAG 的全部，只是 retrieval stack 裡最核心的一塊向量索引。當你要的是低維運，AI Search 先贏；當你要的是可解釋、可調、可評測的 retrieval，Vectorize 才值得成為主角。

## 參考資料

- [Cloudflare Vectorize — Overview](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Vectorize — Introduction](https://developers.cloudflare.com/vectorize/get-started/intro/)
- [Cloudflare Vectorize — API](https://developers.cloudflare.com/vectorize/reference/client-api/)
- [Cloudflare Vectorize — Metadata filtering](https://developers.cloudflare.com/vectorize/reference/metadata-filtering/)
- [Cloudflare Vectorize — Insert vectors](https://developers.cloudflare.com/vectorize/best-practices/insert-vectors/)
- [Cloudflare Vectorize — Query vectors](https://developers.cloudflare.com/vectorize/best-practices/query-vectors/)
- [Cloudflare Vectorize — Limits](https://developers.cloudflare.com/vectorize/platform/limits/)
- [Cloudflare Vectorize — Pricing](https://developers.cloudflare.com/vectorize/platform/pricing/)
- [Cloudflare AI Search 怎麼用：資料來源、混合檢索與 Workers 綁定的完整解析](/posts/tech/2026-08-29-cloudflare-ai-search-guide)
