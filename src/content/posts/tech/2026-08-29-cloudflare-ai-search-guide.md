---
title: "Cloudflare AI Search 怎麼用：資料來源、混合檢索與 Workers 綁定的完整解析"
date: 2026-08-29
type: deep-dive
category: tech
tags: [cloudflare, cloudflare-ai-search, rag, hybrid-search, vectorize, workers-ai]
lang: zh-TW
tldr: "前身 AutoRAG 的託管搜尋原語：丟文件進內建儲存或綁 R2／網站，自動走 Markdown 轉換、切分與向量加 BM25 索引，透過 hybrid 加 RRF 加 rerank 檢索，並以 namespace 與 instance 兩種綁定或 REST 與 MCP 在 Worker 與 Agent 內查詢。"
description: "從資料來源、索引管線、模型選擇到檢索與綁定，完整拆解 Cloudflare AI Search 的架構、用法與限制，並對照自建 Vectorize 方案的取捨。"
series:
  name: "Cloudflare AI Stack"
  order: 5
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 23
---

> 🌏 [English version](/en/posts/tech/2026-08-29-cloudflare-ai-search-guide-en)

如果每個 Agent 都要會搜尋，你會先蓋向量索引、再寫切分與同步管線，最後自己兜 BM25 與融合邏輯——還是直接要一個原語？[Cloudflare AI Search](https://developers.cloudflare.com/ai-search/) 就是後者。前身叫 [AutoRAG](https://blog.cloudflare.com/introducing-autorag-on-cloudflare/)，現在定位是 managed search primitive。建一個 instance、餵資料、直接用自然語言查。底層的 [R2](https://developers.cloudflare.com/r2/)、[Vectorize](https://developers.cloudflare.com/vectorize/)、[Workers AI](https://developers.cloudflare.com/workers-ai/) 都被包起來。這篇把資料怎麼進、索引怎麼跑、檢索怎麼調、Worker 怎麼接一次講清楚，讓你判斷何時用託管、何時自己組。

## AI Search 是什麼：為何叫 search primitive

設計哲學是把「可搜尋」做成跟 [Workers](https://developers.cloudflare.com/workers/) 的 `fetch()` 一樣基礎的能力。文件說它是 *the search primitive for your applications and agents*（[Overview](https://developers.cloudflare.com/ai-search/)）。不是再給你一個向量資料庫，而是給你一條端到端管線：上傳或綁定資料來源、自動索引與同步、混合檢索、回傳附來源的 chunks，必要時再串生成。

跟常見替代方案的差別：

- **自建 [Vectorize](https://developers.cloudflare.com/vectorize/) + 自寫管線**：彈性最高，切分大小、embedding 模型、filter 提取、降級策略都能自訂。代價是自己處理爬蟲、[Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)、重索引與觀測。站內對比見 [Vector Database Comparison](/posts/ai/2026-03-12-vector-database-comparison)。
- **Azure AI Search / Algolia 這類外部託管搜尋**：功能完整，但多一跳網路與帳務，且要自己把 Cloudflare 邊緣的資料搬過去。AI Search 的優勢是與 Workers、[Agents SDK](https://developers.cloudflare.com/agents/) 同網域，延遲與權限模型一致。
- **舊的 `env.AI.autorag()`**：仍可跑，但已標為 legacy。新功能（內建儲存、namespace 綁定、跨 instance 查詢、boost）只在新的 [Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/) 上提供，官方有 [Workers binding migration](https://developers.cloudflare.com/ai-search/api/migration/workers-binding/) 對照。

適合情境：文件或知識庫搜尋、Agent 的研究工具、每個 tenant／每個 Agent 一個可搜尋上下文（例如客服中每位客戶的歷史解法）。不適合：需要自訂切分策略、大量 metadata 欄位（目前每 instance 最多 5 個自訂欄位）或要 pin embedding 模型版本做離線評測的團隊。

## 資料怎麼進來：三種資料來源與索引管線

AI Search 的資料面有三條路（[Data source](https://developers.cloudflare.com/ai-search/configuration/data-source/)）：

1. **內建儲存（Built-in storage）**：每個 instance 自帶儲存與向量索引，直接用 API 上傳檔案即可索引，不用先建 R2。這是 2026 年 4 月後的新預設，適合「每個 Agent 一個 instance」這種動態建立的模型。
2. **R2 Bucket**：把已有的 R2 桶綁為來源，AI Search 會持續同步。適合你本來就把文件放在 R2 的架構。
3. **Website**：綁你擁有的網域，AI Search 用 [Browser Rendering](https://developers.cloudflare.com/browser-rendering/) 爬取並索引，支援 `discover` 與 `sitemap` 兩種 [Parse types](https://developers.cloudflare.com/ai-search/configuration/data-source/website/parse-types/)。

支援的檔案類型分兩層：純文字（`.md`、`.json`、`.csv`、`.py`、`.go` 等）直接索引；富文件（`.pdf`、`.docx`、`.xlsx`、`.html`、`.png`／`.jpg` 等）先走 [Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/) 轉成 Markdown 再切分。這步會調 Workers AI 的視覺模型做圖片描述，因此會產生額外計費。單檔上限 4 MB，超過不會索引，會出現在錯誤日誌。

索引是自動且持續的（[Automated indexing](https://developers.cloudflare.com/ai-search/configuration/indexing/syncing/)）。R2 與 Website 來源會在來源變更時重同步；內建儲存則是上傳即索引。關鍵差別在於「誰擁有資料」：內建儲存的檔案就在 AI Search 託管的 R2＋Vectorize 之上，不再需要在你帳號內額外建桶。舊版 AutoRAG 時代幫你建的那個 R2 桶現在已不再寫入，可自行清掉（見 [Limits & pricing 歷史計費](https://developers.cloudflare.com/ai-search/platform/limits-pricing/)）。

```ts
// 內建儲存：上傳後自動索引
const instance = env.AI_SEARCH.get("my-instance");
const item = await instance.items.upload("handbook.pdf", pdfBytes);
// 或等待索引完成再查
const ready = await instance.items.uploadAndPoll("handbook.pdf", pdfBytes);
```

## 索引與模型：從 Markdown 轉換到 Embedding 的五個階段

管線固定，但每段用的模型可配（[Models](https://developers.cloudflare.com/ai-search/configuration/models/)）：

1. **圖片轉 Markdown**（可選）：物件偵測＋描述模型。
2. **Embedding**：把切分後的 chunks 與查詢轉成向量。這是唯一在建立 instance 時就固定、之後不能改的模型選擇。
3. **Query rewriting**（可選）：用 LLM 把使用者口語查詢改寫得更利於檢索。
4. **Reranking**（可選）：cross-encoder 對融合後的結果重排，提升精準度。
5. **Generation**：把檢索到的上下文交給生成模型產生回答。生成模型可在建立時選，也能事後在 Dashboard 或 per-request 覆蓋。

模型來源分兩種：[Workers AI](https://developers.cloudflare.com/workers-ai/) 目錄內的模型，或經 [AI Gateway](https://developers.cloudflare.com/ai-gateway/) 帶你自己的 OpenAI／Anthropic 金鑰（[Bring your own keys](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)）。後者要在建立或設定頁綁定 Gateway，之後就能在 AI Search 選那些外部模型。選「Smart Default」則由 Cloudflare 自動幫你挑並隨時間更新；想鎖版就切顯式選擇，但要注意 [Supported models](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/) 的生命週期（Production → Announcement → End of life）。

取捨：Smart Default 省維運，但模型會無預警升級，評測分數可能漂移；顯式 pin 版可重現，但要自己追 [Release notes](https://developers.cloudflare.com/ai-search/platform/release-note/) 與棄用公告。對繁中場景，生成模型的中文能力仍以外部模型較穩，這正是 Gateway 整合的價值。

## 怎麼查：向量、關鍵字與混合檢索

檢索面是這次改版最多的地方（[Search modes](https://developers.cloudflare.com/ai-search/concepts/search-modes/)、[Hybrid search](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/)、[Keyword search](https://developers.cloudflare.com/ai-search/configuration/indexing/keyword-search/)）。

- **純向量**：語意理解強，但會漏掉精確詞彙。例如查 `ERR_CONNECTION_REFUSED timeout`，向量可能回「網路疑難排解」而非那篇含錯誤碼的文件。
- **純關鍵字（BM25）**：依詞頻、稀有度與文件長度打分（BM25），精確詞彙命中率高，但會漏掉同義表述。
- **混合（Hybrid）**：兩路並行再融合。建 instance 時把 `index_method: { vector: true, keyword: true }` 同時打開即可啟用，融合方法有 `rrf`（Reciprocal Rank Fusion，依排名而非分數，推薦預設）與 `max`（取正規化後較高分）。[Hybrid search 官方說明](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/) 建議多數情境用 `rrf`。實作細節與自建對照見站內 [Hybrid Search: BM25 + Vector + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)。

可調參數（instance 層或 per-request 覆蓋）：

- `keyword_tokenizer`：`porter`（詞幹化，`running` 匹配 `run`）或 `trigram`（子字串，`conf` 匹配 `configuration`，適合程式碼）。
- `keyword_match_mode`：`and`（全部詞彙都要命中）或 `or`（任一命中）。
- `reranking`：用 `@cf/baai/bge-reranker-base` 這類 cross-encoder 重排，融合後再精煉。
- `query_rewrite`：改寫查詢以提升召回。
- `boost_by`：依 metadata 提升排序，例如 `timestamp desc` 讓新文件靠前，最多 3 個欄位（[Metadata filtering](https://developers.cloudflare.com/ai-search/configuration/retrieval/filtering/) 與 [Filtering](https://developers.cloudflare.com/ai-search/configuration/retrieval/filtering/)）。
- `filters`：依自訂 metadata 過濾，支援 `eq`／`ne`／`gt`／`gte`／`lt`／`lte` 與 `and`／`or` 複合。每個 string 欄位只索引前 64 bytes，設計時要把可過濾鍵做短。
- `max_num_results`：1–50，預設 10。
- `match_threshold`：0–1，預設 0.4。
- `context_expansion`：0–3，周圍 chunks 加回。

```ts
const instance = await env.AI_SEARCH.create({
  id: "my-instance",
  index_method: { vector: true, keyword: true },
  indexing_options: { keyword_tokenizer: "porter" },
  retrieval_options: { keyword_match_mode: "or" },
  fusion_method: "rrf",
  reranking: true,
  reranking_model: "@cf/baai/bge-reranker-base",
});

// 查詢時覆蓋與加權
const hits = await instance.search({
  messages: [{ role: "user", content: "ERR_CONNECTION_REFUSED 怎麼解？" }],
  ai_search_options: {
    retrieval: {
      retrieval_type: "hybrid",
      fusion_method: "rrf",
      keyword_match_mode: "or",
      max_num_results: 8,
      filters: { category: "runbook" },  // 自訂 metadata 單欄位等值
      boost_by: [{ field: "timestamp", direction: "desc" }],
    },
    reranking: { enabled: true },
  },
});
```

另一個關鍵是**跨 instance 搜尋**。在 [Agents SDK](https://developers.cloudflare.com/agents/) 場景裡，共用文件與每位客戶的私有歷史常分屬不同 instance。透過 namespace 綁定的 `search()` 可一次查多個 instance 並合併排名：

```ts
// 依官方 Blog 的客服 Agent 範例
const results = await env.SUPPORT_KB.search({
  query: "billing error",
  ai_search_options: { instance_ids: ["product-knowledge", "customer-abc123"] },
});
```

這比在 Worker 裡發兩次查詢再自融合省一次來回，也讓 `boost_by` 與 `reranking` 在合併後統一生效。

## 怎麼接：五種介面與兩種 Workers 綁定

介面選擇依「誰發起」與「何時決定 instance」：

| 介面 | 適合 | 特色 |
|---|---|---|
| [Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/) | Worker／Agent 內部呼叫 | 延遲最低，支援 namespace 與 instance 兩種綁定 |
| [REST API](https://developers.cloudflare.com/ai-search/get-started/api/) | 後端服務或非 Worker 環境 | 用帳號 API Token（AI Search 權限）呼叫 |
| [Wrangler CLI](https://developers.cloudflare.com/ai-search/get-started/wrangler/) | 維運與一次性建置 | `wrangler ai-search create/list/delete` |
| [Python SDK](https://developers.cloudflare.com/ai-search/get-started/python/) | 離線批次或資料管線 | 與 REST 對等，適合爬蟲與 ETL |
| [Dashboard](https://developers.cloudflare.com/ai-search/get-started/dashboard/) | 手動建立與驗證 | 選 Gateway、看索引狀態 |
| [MCP server](https://developers.cloudflare.com/ai-search/api/search/mcp/) ＋ [UI snippets](https://developers.cloudflare.com/ai-search/api/search/mcp/) | 對外暴露給模型或網站 | 每個 instance 自帶 MCP endpoint 與可嵌入搜尋元件 |

Workers 綁定有兩種（[Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/)）：

**Namespace 綁定 `ai_search_namespaces`** — 動態管理。適合「每位客戶／每位 Agent 一個 instance」：

```jsonc
// wrangler.jsonc
{
  "ai_search_namespaces": [{ "binding": "SUPPORT_KB", "namespace": "support" }],
  "ai": { "binding": "AI" }
}
```

```ts
await env.SUPPORT_KB.create({ id: `customer-${customerId}`, index_method: { vector: true, keyword: true } });
const inst = env.SUPPORT_KB.get(`customer-${customerId}`);
await inst.search({ messages: [{ role: "user", content: "上次怎麼修的？" }] });
```

**Instance 綁定 `ai_search`** — 靜態綁定 `default` namespace 內單一 instance，部署時就決定，程式面最簡：

```jsonc
{ "ai_search": [{ "binding": "MY_SEARCH", "instance_name": "my-instance" }] }
```
```ts
await env.MY_SEARCH.search({ messages: [{ role: "user", content: "什麼是 Cloudflare？" }] });
```

舊寫法 `env.AI.autorag("my-rag").search({ query })` 仍相容，但參數已改為 `messages`（或 `query` 二選一）＋ `ai_search_options`，且不再更新。遷移對照見 [Workers binding migration](https://developers.cloudflare.com/ai-search/api/migration/workers-binding/) 與 [REST API migration](https://developers.cloudflare.com/ai-search/api/migration/rest-api)。

與 [Agents SDK](https://developers.cloudflare.com/agents/) 的組合是官方主推（見 [AI Search: the search primitive for your agents](https://blog.cloudflare.com/ai-search-agent-primitive)）。把 AI Search 當成 Agent 的工具（tool），模型自主決定何時 `search_knowledge_base`、何時 `save_resolution`（`uploadAndPoll` 確保下一輪可查），並用 `instance_ids` 同時橫跨共用知識與私有上下文。

## 限制、計費與何時不用它

先看硬限制（[Limits & pricing](https://developers.cloudflare.com/ai-search/platform/limits-pricing/)，2026-08-26 更新）：

| 項目 | Workers Free | Workers Paid |
|---|---|---|
| 每帳號 instance 數 | 100 | 5,000 |
| 每帳號 namespace 數 | 100 | 100 |
| 每 instance 檔案數 | 100,000 | 1,000,000（啟用 hybrid 為 500,000） |
| 單檔大小 | 4 MB | 4 MB |
| 每月查詢 | 20,000 | 無上限 |
| 跨 instance 單次查詢數 | 10 | 10 |
| 每天爬取頁數 | 500 | 無上限 |
| 自訂 metadata 欄位 | 每 instance 5 個 | 每 instance 5 個 |
| 單向量 metadata | 10 KiB（含系統開銷） | 10 KiB |
| 可過濾字串索引長度 | 前 64 bytes | 前 64 bytes |

計費：open beta 期間 AI Search 本身在限額內免費；[Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/) 與 [AI Gateway](https://developers.cloudflare.com/ai-gateway/reference/pricing/) 依用量另計。儲存、向量索引與 Website 爬取的 [Browser Rendering](https://developers.cloudflare.com/browser-rendering/) 已包含在 AI Search，不另收費。舊帳單若見獨立的 R2／Vectorize 項目，是遷移前的歷史計費。

何時不用：

- 要自訂切分、重疊、或對同一文件做多粒度索引（AI Search 切分策略固定）。
- 要超過 5 個可過濾 metadata 欄位、或要對長字串全文過濾（僅前 64 bytes 可過濾）。
- 要 pin 住 embedding／reranker 版本做長期評測（Smart Default 會漂移，顯式選擇又可能遇到 [Model lifecycle](https://developers.cloudflare.com/ai-search/configuration/models/) 的汰換）。
- 單檔常超過 4 MB（例如整本掃描 PDF）——得先在外層切檔再上傳。

反之，若需求就是「對一批文件做混合檢索、支援 keyword 精確命中、可在 Agent 內動態開 instance、並希望少維運」，託管的省事程度很明顯。站內在 [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) 末尾也提過同樣取捨：要的是維運省事就用託管，要的是對 filter 提取與降級策略的完全掌控就自己組。

## 整體來說

AI Search 的增量不在「能做 RAG」，而在「把 RAG 的髒活收進原語」。內建儲存讓 instance 自帶索引、Website／R2 綁定讓同步自動化、混合檢索與 `boost_by`／`filters` 讓排序可在請求面微調、namespace 綁定與跨 instance 查詢讓多租戶與多 Agent 的隔離變便宜。

實作建議：從一個 `ai_search` 單 instance 起步（最少設定），驗證召回與 `match_threshold` 後，再開 `hybrid` 與 `reranking` 做對比。需要多租戶時再切 `ai_search_namespaces` 並把 `instance_ids` 搜尋補上。今晚就能做的是：挑一份現有文件集（例如 `src/content/posts/`），建一個 Paid 帳號的測試 instance，丟 50 份文件進內建儲存，分別用 `vector`／`keyword`／`hybrid` 查同一組問題，記錄 `scoring_details`（`vector_score`／`keyword_score`／`fusion_method`）再決定預設檢索策略。

## 參考資料

- [Cloudflare AI Search — Overview](https://developers.cloudflare.com/ai-search/)
- [Cloudflare AI Search — Data source](https://developers.cloudflare.com/ai-search/configuration/data-source/)
- [Cloudflare AI Search — Hybrid search](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/)
- [Cloudflare AI Search — Keyword search](https://developers.cloudflare.com/ai-search/configuration/indexing/keyword-search/)
- [Cloudflare AI Search — Models](https://developers.cloudflare.com/ai-search/configuration/models/)
- [Cloudflare AI Search — Supported models](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/)
- [Cloudflare AI Search — Limits & pricing](https://developers.cloudflare.com/ai-search/platform/limits-pricing/)
- [Cloudflare AI Search — Workers binding](https://developers.cloudflare.com/ai-search/api/search/workers-binding/)
- [Cloudflare AI Search — Workers binding migration](https://developers.cloudflare.com/ai-search/api/migration/workers-binding/)
- [Cloudflare AI Search — REST API migration](https://developers.cloudflare.com/ai-search/api/migration/rest-api/)
- [Cloudflare Blog — AI Search: the search primitive for your agents](https://blog.cloudflare.com/ai-search-agent-primitive)
- [Cloudflare Blog — Introducing AutoRAG on Cloudflare](https://blog.cloudflare.com/introducing-autorag-on-cloudflare/)
- [Workers AI — Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)
- [Vectorize — Cloudflare Vector Database](https://developers.cloudflare.com/vectorize/)
- [Hybrid Search: BM25 + Vector + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- [Vector Database Comparison](/posts/ai/2026-03-12-vector-database-comparison)
- [Cloudflare Workers AI binding 全貌：不只是 run()](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities)
- [Workers AI 模型選型指南](/posts/ai/2026-08-18-workers-ai-model-guide)
