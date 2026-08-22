---
title: "Typesense 站內搜尋：把全文檢索做成可控制的產品功能"
date: 2026-08-22
category: tech
tags: [typesense, search, full-text-search, api, self-hosted]
lang: zh-TW
type: deep-dive
tldr: "Typesense 是以即時、容錯關鍵字搜尋為核心的搜尋伺服器：用 collection schema、欄位權重、facet 與排序就能做出站內搜尋，也能自行架設或交給 Typesense Cloud；繁體中文欄位要設 locale: zh，專業詞彙則可能需要自訂斷詞。"
description: "深入介紹 Typesense 的索引、查詢與排序模型，示範建立可搜尋的文章 collection，並說明繁體中文斷詞、部署、安全性與適用限制。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-typesense-site-search-en)

[Typesense](https://typesense.org/docs/overview/) 是一套為即時、容錯搜尋設計的開放原始碼搜尋伺服器。它不是會自動爬遍網站的 Google：你要先從 CMS、資料庫或建置產物整理出文件，送進 Typesense 建立索引，再由網站呼叫 Search API。這個界線很重要，因為「內容何時同步、哪些欄位可搜」仍是應用程式的責任。

它的產品方向介於 Algolia 與 Elasticsearch / OpenSearch 之間：像 Algolia 一樣，預設就有 search-as-you-type、拼字容錯與 facet；又像 Elasticsearch 一樣可以自行架設。不過 Typesense 刻意把設定面縮小，適合想快速做出好用站內搜尋、又不需要完整搜尋分析平台的團隊。

## 核心模型：文件、collection 與可預測的排序

Typesense 把一筆可搜尋資料稱為 document，放在有明確 schema 的 collection 裡。文章站通常會索引標題、摘要、內文、分類、標籤、網址與發佈時間；搜尋結果只存足以顯示結果卡片的資料，不必複製整個 CMS。

文字相關性不是一個不可見的魔法分數。依[排序文件](https://typesense.org/docs/guide/ranking-and-relevance.html)，Typesense 會看查詢詞重疊、編輯距離、詞彙接近程度與欄位權重，再以 `_text_match` 及自訂欄位打破同分。例如標題可以比內文重要，新文章則只在文字相關性接近時往前排。

除此之外，[功能清單](https://typesense.org/docs/overview/features.html)還包含 filter、facet、synonym、結果釘選、地理搜尋、向量與混合搜尋。但站內搜尋的第一版通常只需要關鍵字、highlight、分類 facet 與時間排序；先看真實查詢紀錄，再決定要不要加同義詞或語意搜尋。

## 一個最小但可用的文章索引

下例建立 `posts` collection。`locale: zh` 不能省略：Typesense 未指定 locale 時會當成英文處理；官方的[多語系搜尋指南](https://typesense.org/docs/guide/locale.html)說明，`zh` 同時支援繁體與簡體中文，並套用 ICU 的中文切詞規則。

```bash
curl -X POST "$TYPESENSE_HOST/collections" \
  -H "X-TYPESENSE-API-KEY: $TYPESENSE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "posts",
    "fields": [
      {"name": "title", "type": "string", "locale": "zh"},
      {"name": "body", "type": "string", "locale": "zh"},
      {"name": "category", "type": "string", "facet": true},
      {"name": "tags", "type": "string[]", "facet": true},
      {"name": "published_at", "type": "int64"},
      {"name": "url", "type": "string", "index": false}
    ],
    "default_sorting_field": "published_at"
  }'
```

接著把每篇文章轉成 JSON，透過 Documents API 新增或批次匯入。實務上可在 Astro 建置前產生 JSONL，再由 CI 同步；資料庫型網站則可由背景工作處理新增、更新與刪除。搜尋端只需要一把限制為 search action 的 key，不要把 admin key 放進瀏覽器。

```ts
import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [{ host: "search.example.com", port: 443, protocol: "https" }],
  apiKey: PUBLIC_SEARCH_ONLY_KEY,
  connectionTimeoutSeconds: 2,
});

const result = await client.collections("posts").documents().search({
  q: "cloudflare 搜尋",
  query_by: "title,body,tags",
  query_by_weights: "5,2,1",
  filter_by: "category:=tech",
  facet_by: "category,tags",
  sort_by: "_text_match:desc,published_at:desc",
  highlight_fields: "title,body",
  per_page: 10,
});
```

這份參數已經表達產品判斷：標題命中最重要、只看 tech 類、同樣相關時新文優先。Typesense 提供結果，但搜尋框的 debounce、鍵盤操作、空狀態與 highlight 安全轉譯仍要由前端處理。若不想從零刻 UI，可採用官方相容的 InstantSearch adapter。

## 繁體中文真正要測的是斷詞

設定 `locale: zh` 是起點，不是品質保證。中文沒有空白詞界，ICU 的字元與詞界規則未必知道產品名、縮寫或領域術語。例如「大型語言模型」、「臺灣攀岩」與中英混寫的套件名稱，可能需要不同的詞彙策略。

先用真實內容建立一小份 relevance 測試：列出查詢、預期前幾名與不該出現的結果，尤其涵蓋繁簡字、英文縮寫、錯字與短詞。若預設斷詞不夠，Typesense 支援 `pre_segmented_query: true`；做法是用自己的斷詞器把索引文字與查詢都轉成空白分隔的 token。兩邊必須共用同一套規則，否則查詢看似成功，實際上永遠對不到索引。

拼字容錯對拉丁字母特別直覺，對一兩個中文字的短查詢卻可能擴得太寬。這時應依欄位調整 `num_typos`，而不是把所有模糊比對關掉。同義詞則適合處理「台灣／臺灣」或站內既有稱呼，但不能取代可靠的斷詞與內容清理。

## 部署選擇與營運成本

Typesense 是單一執行檔、沒有執行期相依套件，可用 Docker 或套件自行架設；[正式環境指南](https://typesense.org/docs/guide/running-in-production.html)仍建議正式流量採高可用叢集，並監控 health、記憶體、CPU 與延遲。它不是「起一個 container 就永遠不用管」：備份、升級、容量、節點故障與索引重建都有人要負責。

Typesense Cloud 使用與自行架設相同的核心 binary 與 API，另外代管基礎設施、提供管理介面與高可用選項。選擇不只是主機帳單，而是團隊願不願意承擔搜尋服務值班。小型內容站若不想維護常駐服務，也應先評估建置期產生索引的 Pagefind；Typesense 的價值在內容持續更新、需要 filter/facet、跨 collection 搜尋或更細緻 relevance 控制時才明顯。

## 適合與不適合的情境

Typesense 適合商品目錄、文件站、媒體內容與 SaaS 內搜尋：資料結構清楚、讀取多於寫入，而且團隊想用少量參數控制排序。它也適合希望保留自行架設選項，但不想先學完整 Elasticsearch mapping、analyzer 與叢集操作的專案。

它不適合直接取代主要資料庫，也不會替你爬站或解決同步一致性。如果需求核心是複雜的日誌分析、任意 aggregation、成熟的企業外掛生態，Elasticsearch / OpenSearch 的範圍更完整；如果團隊要的是完全代管、連前端元件與營運工具都打包的服務，Algolia 可能更省工程時間。純靜態小站則常常連搜尋伺服器都不需要。

最後的判準很簡單：如果你願意擁有「內容轉文件、同步索引、調整 relevance」這條 pipeline，Typesense 給的是一個小而完整、可自行掌握的搜尋核心。若連這條 pipeline 都不想維護，就該選更上層的代管產品，而不是只比較 API 看起來多簡單。

## 參考資料

- [Typesense：What is Typesense?](https://typesense.org/docs/overview/)
- [Typesense：Features](https://typesense.org/docs/overview/features.html)
- [Typesense：Ranking and Relevance](https://typesense.org/docs/guide/ranking-and-relevance.html)
- [Typesense：Tips for Locale-Specific Search](https://typesense.org/docs/guide/locale.html)
- [Typesense：Running Typesense in Production](https://typesense.org/docs/guide/running-in-production.html)
- [Typesense Search API](https://typesense.org/docs/29.0/api/search.html)
- [Typesense Collections API](https://typesense.org/docs/29.0/api/collections.html)
