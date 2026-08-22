---
title: "Elasticsearch 與 OpenSearch：從 Lucene 全文檢索到站內搜尋的選型"
date: 2026-08-22
category: tech
type: deep-dive
tags: [elasticsearch, opensearch, search, full-text-search, lucene, site-search]
lang: zh-TW
tldr: "Elasticsearch 與 OpenSearch 都以 Lucene 支撐文字分析、BM25、聚合與向量搜尋，但 2021 年分家後，授權、治理、混合搜尋 API 與託管生態已是兩條路。"
description: "比較 Elasticsearch 與 OpenSearch 的共同 Lucene 基礎、全文檢索查詢、聚合、混合搜尋，以及自架站內搜尋時的治理與維運取捨。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-elasticsearch-opensearch-site-search-en)

[Elasticsearch](https://www.elastic.co/elasticsearch) 與 [OpenSearch](https://opensearch.org/About/) 都是分散式搜尋與分析引擎。它們能替網站做全文檢索、篩選、排序、搜尋建議與分類統計，也能承接日誌和可觀測性資料。

兩者不是同一個產品。OpenSearch 在 2021 年從 Elasticsearch 與 Kibana 的 7.10.2 程式碼分支，此後各自演進。

如果站內搜尋只要幾百篇靜態文章，這兩套通常太重；若資料持續更新、欄位多、需要細緻的相關性調校、權限篩選或多節點可用性，它們才開始合理。選型的關鍵也不只是「搜尋得到」，而是團隊願意承擔哪一套治理、API 與維運模型。

## 共同根基：Lucene、analysis 與 BM25

兩者底層都使用 [Apache Lucene](https://lucene.apache.org/core/)。Lucene 是 Java 搜尋函式庫，提供欄位式全文檢索、片語與範圍查詢、facet、拼字建議、向量近鄰搜尋和可替換的排名模型。Elasticsearch 與 OpenSearch 再往上補上 JSON REST API、分片、複本、叢集協調、安全功能和管理介面。

文字不會整段直接拿來比對。analysis 會在建立索引與查詢時，經過字元過濾、tokenizer 與 token filter，把內容轉成 term；因此中文斷詞、大小寫、同義詞與詞幹處理都會改變召回結果。站內搜尋最常見的失誤，是先調 boost，卻沒有先用 `_analyze` 檢查「Cloudflare Workers」或中文產品名稱究竟被切成什麼。

一般全文欄位預設以 BM25 計分。它會考慮 term 在文件內出現的頻率、在整體語料的稀有程度與欄位長度；所以罕見的錯誤碼通常比常見助詞更有辨識力。BM25 不理解語意，但對 API 名稱、型號和錯誤訊息很可靠，也是加入向量搜尋前應先建立的基準線。

## 一個可落地的站內搜尋查詢

以下 Query DSL 的基本結構可用於兩者。`multi_match` 提高標題欄位的權重；`filter` 限制語言與草稿狀態，不參與相關性計分；`terms` aggregation 可產生分類 facet。

```http
GET posts/_search
{
  "size": 10,
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "cloudflare d1 timeout",
            "fields": ["title^3", "description^2", "body"],
            "type": "best_fields",
            "minimum_should_match": "75%"
          }
        }
      ],
      "filter": [
        { "term": { "lang": "zh-TW" } },
        { "term": { "draft": false } }
      ]
    }
  },
  "highlight": {
    "fields": { "title": {}, "body": {} }
  },
  "aggs": {
    "categories": {
      "terms": { "field": "category.keyword" }
    }
  }
}
```

這只是起點，不是萬用排名公式。實作時先準備一份代表性查詢集，記下每個查詢期待出現在前幾名的文章，再調 analyzer、同義詞、欄位權重與模糊比對。沒有這份判準，相關性調校很容易只讓眼前的一個查詢變好。

## 分家之後：授權與治理不同

2021 年，Elasticsearch 原先採 Apache License 的原始碼改用 SSPL 與 Elastic License 2.0。OpenSearch 則從最後一版 Apache 2.0 程式碼分支，並持續以該授權發布。

Elastic 在 2024 年又為部分 Elasticsearch 與 Kibana 原始碼加入 OSI 認可的 AGPLv3 選項，但官方預建 distribution 仍適用 ELv2。若要重新散布、修改，或把搜尋引擎本身做成託管服務，不能只看「原始碼可見」。要由法務核對實際使用的程式碼與 distribution 授權。

治理也已分流。Elasticsearch 由 Elastic 主導產品方向，並提供自管、Elastic Cloud Hosted、Serverless 與 Kubernetes 等部署路徑。OpenSearch 是獨立專案，設有技術指導機制與 Linux Foundation 架構下的基金會治理；除了自架，也常由 AWS 的 Amazon OpenSearch Service 承接維運。這些背景不代表任一方必然較好，但會影響修補來源、外掛相容性、支援合約與長期路線。

## 功能相似，介面已經分岔

| 面向 | Elasticsearch | OpenSearch |
| --- | --- | --- |
| 詞彙搜尋 | Query DSL、analysis、BM25、highlight | Query DSL、analysis、BM25、highlight |
| 篩選與統計 | bucket、metric、pipeline aggregations | bucket、metric、pipeline aggregations |
| 向量搜尋 | dense／sparse vector、kNN、`semantic_text` | k-NN vector、Neural Search 與模型整合 |
| 混合搜尋 | retrievers 可用 RRF 或線性組合；ES\|QL 另有多階段介面 | `hybrid` query 搭配 search pipeline 做分數正規化或 rank fusion |
| 操作介面 | Kibana 與 Elastic 生態 | OpenSearch Dashboards 與外掛生態 |

共同名詞不等於共同 API。尤其混合搜尋，不能把 Elasticsearch 的 retriever 範例原封不動貼到 OpenSearch。OpenSearch 的 `hybrid` query 預期放在頂層，文件也明列它不能包進 `function_score` 等 wrapper query，否則可能報錯或略過正規化流程。升級前應以目標產品的當版文件重跑查詢測試，不要把「源自同一份程式碼」當成相容承諾。

向量搜尋也不是免費的相關性升級。embedding 需要額外的產生流程、向量欄位、記憶體與延遲預算；詞彙分數和向量分數尺度又不同，必須以 RRF、正規化或重新排序融合。對文章標題、錯誤碼與產品型號而言，先把 BM25、同義詞與欄位權重做好，往往比直接上純向量搜尋更可控。

## 真正昂貴的是維運

自架任一產品都要管理 mapping、reindex、分片與複本、節點故障、磁碟水位、JVM、滾動升級、安全修補、監控和快照。分片不是越多越好：每個分片都有資源成本，分片配置錯誤也會讓查詢扇出與復原時間惡化。複本能提高讀取容量並承接主分片故障，卻不能取代備份；刪錯資料會同步到複本，所以仍要把快照放到叢集外的 repository，並實際演練還原。

託管服務可以移走部分叢集工作，但不會替你決定 schema、analysis、相關性與資料同步策略。也要確認供應商提供的究竟是哪個產品、哪些外掛與 API 版本，以及跨服務遷移時快照是否相容。

## 怎麼選

選 Elasticsearch，通常是因為團隊要跟 Elastic 的 Search／Observability／Security 產品線整合，想採用其 retrievers、`semantic_text` 或 Elastic Cloud 的操作體驗，並接受相應授權與商業關係。選 OpenSearch，通常是因為 Apache 2.0 是硬條件、既有系統深度使用 Amazon OpenSearch Service，或團隊願意在其外掛與 search pipeline 生態內工作。

兩者都不適合「只想替靜態部落格加一個搜尋框，而且沒有人要顧叢集」的情境。這時 Pagefind 之類的建置期索引、託管站內搜尋，甚至資料庫內建全文檢索，通常更省事。反過來，如果搜尋已是產品核心，需要即時索引、複雜 ACL、facet、跨欄位排名、混合檢索與可觀測的相關性調校，Elasticsearch 與 OpenSearch 才值得進入決選。

最後別用功能清單投票。拿真實資料與查詢集做一個小型 proof of concept，逐一驗證中文斷詞、前幾名結果、索引延遲、故障復原和升級流程；能長期維持搜尋品質的那一套，才是比較便宜的選擇。

## 參考資料

- [Apache Lucene Core](https://lucene.apache.org/core/)
- [Elasticsearch Query DSL](https://www.elastic.co/docs/explore-analyze/query-filter/languages/querydsl)
- [Elasticsearch：Build your search queries](https://www.elastic.co/docs/solutions/search/querying-for-search)
- [Elastic software licensing FAQ](https://www.elastic.co/pricing/faq/licensing/)
- [Elastic：Deploy and manage](https://www.elastic.co/docs/deploy-manage)
- [OpenSearch：About](https://opensearch.org/About/)
- [OpenSearch full-text queries](https://docs.opensearch.org/latest/query-dsl/full-text/index/)
- [OpenSearch hybrid search](https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/index/)
- [OpenSearch hybrid query limitations](https://docs.opensearch.org/latest/query-dsl/compound/hybrid/)
