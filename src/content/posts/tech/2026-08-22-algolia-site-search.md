---
title: "Algolia 站內搜尋深入介紹：託管索引、排名與 InstantSearch"
date: 2026-08-22
category: tech
type: deep-dive
tags: [algolia, search, site-search, instantsearch, hosted-search]
lang: zh-TW
tldr: "Algolia 把索引、即時查詢、facet 與前端元件包成託管服務；上線很快，但資料同步、搜尋品質與用量成本仍要自己負責。"
description: "從 record 與 index、逐層排名、錯字容忍、facet、Crawler 到 InstantSearch，拆解 Algolia 適合哪些站內搜尋，以及與 Typesense、Elasticsearch/OpenSearch 的取捨。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-algolia-site-search-en)

[Algolia](https://www.algolia.com/doc/) 是託管式搜尋服務：應用程式先把文章、商品或文件整理成 JSON records，送進遠端 index，再由瀏覽器或後端呼叫搜尋 API。它不是對既有資料庫加一個查詢語法，而是把「建立索引、調整相關性、送出查詢、呈現互動介面」組成一套產品。

這個定位很適合站內搜尋。團隊不用維運搜尋叢集，就能做輸入即搜、結果醒目提示、分類篩選與查詢分析；代價是搜尋資料要另外同步，排名模型受平台語意約束，流量和索引量也會成為持續成本。

## 搜尋的是 index，不是原始資料庫

Algolia 的 [record](https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data) 是一組鍵值屬性；index 則是為搜尋最佳化的 records 集合。官方建議只放搜尋、顯示、篩選、排序或相關性需要的欄位。對部落格而言，一篇文章不一定只能是一筆 record：長文可依標題切成段落，讓結果直接連到對應錨點，避免整篇正文形成一個模糊命中。

```json
{
  "objectID": "algolia-site-search#ranking",
  "title": "Algolia 站內搜尋深入介紹",
  "heading": "排名不是加權總分",
  "content": "Algolia 依序用多個條件打破平手……",
  "url": "/posts/tech/2026-08-22-algolia-site-search#排名不是加權總分",
  "category": "tech",
  "publishedAt": 1787328000,
  "popularity": 42
}
```

索引工作必須在伺服器端執行，寫入金鑰不能送到瀏覽器。資料來源若有可靠的建置流程，可在發佈後批次更新；只有網頁可用時，[Algolia Crawler](https://www.algolia.com/doc/tools/crawler/getting-started/overview) 能從起始 URL 追蹤連結、擷取 HTML 或 PDF，並定期送進 index。Crawler 省下擷取與排程程式，但仍要定義每頁如何拆 record、哪些頁面應排除，以及刪文後如何移除舊資料。

## 排名不是加權總分

Algolia 的[預設排名](https://www.algolia.com/doc/guides/managing-results/relevance-overview/in-depth/ranking-criteria)採 tie-breaking：先按 Typo 排序，只把仍平手的結果交給下一項 Geo、Words、Filters、Proximity、Attribute、Exact，最後才輪到 Custom。這比一個混合所有訊號的浮點分數容易解釋，卻也意味著後面的商業訊號不能推翻前面的文字相關性。

最值得先調的不是神祕權重，而是 `searchableAttributes`。欄位順序會影響 Attribute criterion；標題應排在段落標題與正文之前，URL 等展示資料則不該參與搜尋。接著用 `customRanking` 以瀏覽數、品質分數或日期打破剩餘平手。數值精度太高會讓第一個自訂欄位幾乎永遠不平手，後續條件便無法生效。

```js
await client.setSettings({
  indexName: "posts",
  indexSettings: {
    searchableAttributes: ["title", "heading", "content", "tags"],
    attributesForFaceting: ["category", "tags"],
    customRanking: ["desc(popularity)", "desc(publishedAt)"],
    attributesToSnippet: ["content:24"],
  },
});
```

錯字容忍預設開啟，英文字較長時可接受一至兩個 typo，完全命中仍會排前面；SKU、郵遞區號等識別碼通常應關掉。然而官方明確說明，這套以拼字距離為基礎的機制[不適用中文與日文等表意文字](https://www.algolia.com/doc/guides/managing-results/optimize-search-results/typo-tolerance)。繁中內容不能把英文 demo 的錯字修正效果直接當成既有能力，應以真實查詢測試斷詞、同義詞與中英文混搜。

## Facet 把搜尋變成可探索介面

[Faceting](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting) 會回傳目前結果下可用的類別與數量，例如 category、tag 或年份，使用者可同時縮小多個維度。它和隱藏的 filter 不同：facet 是介面的一部分，filter 也可拿來限制登入者只能看到自己的資料。

Facet 欄位必須先列進 `attributesForFaceting`。不要把高基數、對決策沒幫助的值全部做成 facet；作者、分類與標籤通常有用，每篇唯一的 URL 通常沒有。若搜尋包含私有內容，公開 search-only key 並不等於授權模型，應由後端產生帶固定 filter 的 secured API key，並把敏感屬性設為不可回傳。

## InstantSearch 負責瀏覽器裡的互動

[InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js) 是開放原始碼 UI 函式庫，提供搜尋框、結果、分頁與 refinement list 等 widgets。預製 widget 適合快速上線；要換 HTML 可用 connector；只有行為也不存在時才需要自訂 widget。

```js
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { hits, refinementList, searchBox } from "instantsearch.js/es/widgets";

const search = instantsearch({
  indexName: "posts",
  searchClient: algoliasearch("APP_ID", "SEARCH_ONLY_KEY"),
});

search.addWidgets([
  searchBox({ container: "#searchbox" }),
  refinementList({ container: "#categories", attribute: "category" }),
  hits({ container: "#hits" }),
]);

search.start();
```

這段程式可放在靜態網站前端，因為只使用受限的搜尋金鑰。InstantSearch 預設會以空查詢送出初始 request；若網站不需要一開頁就列出內容，可用 conditional requests 避免不必要的網路呼叫。醒目提示內容也要使用函式庫提供的 highlight/snippet 輸出，不要把回傳標記當成未經處理的 HTML 任意插入。

## 和 Typesense、Elasticsearch / OpenSearch 怎麼選

| 方案 | 核心取捨 | 比較適合 |
|---|---|---|
| [Algolia](https://www.algolia.com/doc/) | 託管 API、相關性設定與 UI 生態整合，維運少但平台綁定與用量成本較高 | 想快速交付成熟站內搜尋、前端互動重要的團隊 |
| [Typesense](https://typesense.org/docs/) | 可自行部署，也有託管方案；控制權較高，但要承擔更多容量與維運決策 | 偏好開放原始碼、需求接近即時文字搜尋的產品 |
| [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) / [OpenSearch](https://docs.opensearch.org/latest/) | 查詢 DSL、分析器與聚合彈性最大，叢集與相關性工程也最重 | 已有搜尋平台團隊，或需要複雜分析、日誌與跨欄位查詢 |

Algolia 適合公開內容、電商目錄、文件站和 SaaS 功能搜尋，尤其是交付速度比底層控制重要時。不適合的情況包括：資料不能離開自有環境、需要高度客製分析器或複雜聚合、搜尋量使託管成本失去優勢，以及團隊已經能可靠營運搜尋叢集。

真正的工作仍在資料品質。今晚要評估它，可以先抽 50 個真實或預期查詢，為每個查詢寫下前三名應出現什麼，再用小型 index 測試零結果、中文查詢、拼錯英文、facet 與權限。若結果不好，先修 record 粒度和 searchable attributes，最後才碰排名順序。

## 整體來說

Algolia 賣的不是一顆免設定的搜尋按鈕，而是一條已經接好的產品管線。它替團隊拿掉叢集維運，並用 Crawler、API、ranking 設定、facets 與 InstantSearch 縮短上線時間；團隊仍需擁有索引同步、查詢評測、權限與成本監控。若這個責任分界符合專案能力，它是很務實的站內搜尋選擇。

## 參考資料

- [Algolia：Prepare your records for indexing](https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data)
- [Algolia：The eight ranking criteria](https://www.algolia.com/doc/guides/managing-results/relevance-overview/in-depth/ranking-criteria)
- [Algolia：Custom ranking](https://www.algolia.com/doc/guides/managing-results/must-do/custom-ranking)
- [Algolia：Typo tolerance](https://www.algolia.com/doc/guides/managing-results/optimize-search-results/typo-tolerance)
- [Algolia：Faceting](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting)
- [Algolia：InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js)
- [Algolia：Crawler overview](https://www.algolia.com/doc/tools/crawler/getting-started/overview)
- [Algolia：Service limits](https://www.algolia.com/doc/guides/scaling/algolia-service-limits)
- [Algolia：User-restricted access to data](https://www.algolia.com/doc/guides/security/api-keys/how-to/user-restricted-access-to-data)

