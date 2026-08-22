---
title: "Firecrawl 完整介紹：Scrape、Crawl、Map 與結構化抽取怎麼選"
date: 2026-08-21
category: ai
type: guide
tags: [firecrawl, web-scraping, crawler, structured-output, self-hosted, python]
lang: zh-TW
tldr: "Firecrawl 把單頁抓取、網站探索、整站爬取與 JSON 抽取包成同一套 API；雲端版省下瀏覽器、proxy 與 worker 維運，自架版則換得基礎設施控制，但預設能力不等同雲端。"
description: "從 Firecrawl v2 的 Scrape、Crawl、Map 與 JSON Schema 抽取開始實作，並說清楚雲端額度、自架功能差異、AGPL-3.0 授權與 Crawl4AI 的選擇邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-firecrawl-complete-guide-en)

[Firecrawl](https://docs.firecrawl.dev/advanced-scraping-guide) 是一套 Web Data API。給它一個 URL，可以拿回 Markdown、連結、HTML、截圖或結構化 JSON；給它一個網域，還能先列 URL，或直接把多個頁面爬回來。它和一般爬蟲函式庫最大的差別，不是多了一個 Markdown converter，而是把瀏覽器、快取、proxy、工作佇列與 API 服務一起包起來。

本文依查核日的 Firecrawl v2 官方文件撰寫。範例使用官方 Python SDK 與 REST API，但沒有實際消耗 Firecrawl Cloud credits，也沒有啟動完整自架堆疊。文中的端點形狀、額度與自架能力是文件查核，不是成功率或反爬效果實測。

## 先按工作決定端點

四個常見名稱其實回答不同問題：

| 工作 | 端點 | 取得的東西 | 典型用途 |
|---|---|---|---|
| 已知一個頁面，要內容 | `scrape` | Markdown、HTML、links、JSON 等 | RAG ingestion、單頁解析 |
| 已知一批 URL，要批次處理 | batch scrape | 每個 URL 的 scrape 結果 | 價格頁、名單頁定期更新 |
| 知道網站，不知道有哪些頁 | `map` | URL 清單 | 先盤點範圍、建立 crawl allowlist |
| 要沿連結取得整站內容 | `crawl` | 非同步 job 與逐頁結果 | 文件站、知識庫匯入 |

`extract` 需要特別說明。Firecrawl 目前仍保留多頁結構化抽取端點，但官方的[抽取選擇指南](https://docs.firecrawl.dev/developer-guides/usage-guides/choosing-the-data-extractor)已標示「改用 `/agent`」。已知單一 URL 時，用 `scrape` 的 JSON mode；要跨頁探索與抽取時，新專案應先評估 `agent`，不要看到舊教學就把 `/extract` 當預設入口。

## Scrape：先取得可保存的原始內容

Python SDK 的最短路徑如下：

```bash
pip install firecrawl-py
export FIRECRAWL_API_KEY="fc-YOUR-API-KEY"
```

```python
from firecrawl import Firecrawl

app = Firecrawl()
result = app.scrape(
    "https://example.com",
    formats=["markdown", "links"],
    only_main_content=True,
)

print(result.markdown)
print(result.metadata.status_code)
```

`formats` 預設是 Markdown，也能要求 `html`、`rawHtml`、`links`、`images`、`summary` 或 screenshot。`onlyMainContent` 預設會排除 navigation 與 footer；需要全頁證據時要明確關閉，不能假設被清掉的內容都是垃圾。

快取同樣要明講。官方進階指南列出的 `maxAge` 預設是兩天；若資料新鮮度有 SLA，把它設成 `0` 才會強制重新取得。反過來，內容幾乎不變時保留快取，可以降低等待時間與重複抓取。資料管線應另外保存 `sourceURL`、HTTP status、取得時間與內容 hash，不要只留洗過的 Markdown。

## 用 JSON Schema 把單頁轉成資料契約

已知資料就在某一頁時，JSON mode 比先抓 Markdown、再自己呼叫另一個 LLM 少一層組裝。Pydantic model 可以直接產生 schema：

```python
from pydantic import BaseModel
from firecrawl import Firecrawl

class Product(BaseModel):
    name: str
    price: str | None = None
    in_stock: bool | None = None

app = Firecrawl()
result = app.scrape(
    "https://example.com/product/42",
    formats=[{
        "type": "json",
        "prompt": "Extract the product exactly as displayed.",
        "schema": Product.model_json_schema(),
    }],
)

product = Product.model_validate(result.json)
```

Schema 是輸出約束，不是正確性保證。價格可能缺幣別、庫存可能藏在尚未展開的元件裡，模型也可能把頁面文案當欄位值。正式接到下游前，至少要做型別驗證、必要欄位檢查與來源保存；如果 DOM 很穩定且可用 selector 表達，沒有必要為每頁加上 LLM 抽取成本。

## Map：先看範圍，再決定要不要 Crawl

`map` 只找 URL，不抓每頁正文。這適合在爬整站之前先看會碰到哪些路徑：

```bash
curl -X POST https://api.firecrawl.dev/v2/map \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "search": "api reference",
    "limit": 100
  }'
```

把結果存下來，人工抽查登入頁、搜尋頁、日曆與帶 query parameter 的重複 URL。真正要抓的路徑很少時，改用 batch scrape；不要因為已經拿到網站入口，就直接開一個無邊界 crawl。

## Crawl：非同步工作一定要封頂

`crawl` 會建立 job，沿連結發現頁面，再對每頁套用 scrape options：

```bash
curl -X POST https://api.firecrawl.dev/v2/crawl \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "includePaths": ["^/guides/.*$", "^/reference/.*$"],
    "excludePaths": ["^/account/.*$"],
    "maxDiscoveryDepth": 2,
    "limit": 100,
    "scrapeOptions": {"formats": ["markdown"]}
  }'
```

回應中的 `id` 用來查 `GET /v2/crawl/{id}`。結果過大或工作尚未結束時，回應可能帶 `next` 分頁 URL，因此接收端不能只讀第一包資料。

`limit` 不該省略。依官方 [Billing 文件](https://docs.firecrawl.dev/billing)，crawl 啟動前會檢查餘額能否覆蓋 requested limit。預設上限是 10,000 頁，所以只剩少量 credits 時，即使網站實際很小也可能先收到 `402`。第一輪先設 20 或 100，確認 URL 分布後再放大。

## Cloud 的成本與失敗邊界

查核日的基礎計價是 scrape 與 crawl 每頁 1 credit，map 每次呼叫 1 credit；JSON format 另外加每頁 4 credits。Firecrawl 基礎設施成功處理請求時，即使目標站回 `403` 或 `404` 仍可能計費，因此重試前要看 `metadata.statusCode`，不能把所有空結果都當暫時性錯誤。

免費帳號目前提供 1,000 credits。

依官方 [Rate Limits](https://docs.firecrawl.dev/rate-limits)，Free plan 的 scrape 與 map 各為每分鐘 10 次。crawl 為每分鐘 2 次，並有 2 個 concurrent browsers。這些數字會隨方案調整；production 不要把文章裡的快照寫死成容量設定，應從 dashboard 與 queue status 觀察實際限制。

錯誤處理至少分四類：

- `402`：額度或 crawl pre-flight 不足；縮小 limit 或處理方案，不要立即重試。
- `429`：rate limit、concurrency 或 queue 滿；讀取等待資訊並做 exponential backoff。
- 目標站 `401`／`403`／`404`：通常不是多重試幾次就會恢復。
- Firecrawl timeout／`5xx`：才適合有上限的暫時性重試，並保留 job ID 追查。

## 自架不是「免費的 Cloud」

官方的[雲端與開放原始碼比較](https://docs.firecrawl.dev/contributing/open-source-or-cloud)列出兩者邊界。預設自架堆疊包含 core scrape、crawl、map、search、fetch 與 Playwright；LLM formats 要接 OpenAI-compatible provider 或 Ollama。Agent、Browser、Interact、dashboard、enterprise controls，以及部分進階反爬路徑則是 Cloud 能力，不能把 API 名稱相同理解成支援面完全相同。

自架 quickstart 會用 Docker Compose 啟動 API 與多個相依服務，API 在 `localhost:3002`。但官方[自架指南](https://docs.firecrawl.dev/contributing/self-host)也明示：示範設定關閉驗證，沒有 durable storage、TLS 或 high availability；預設 Compose 不是 production architecture。要上線，至少還要補驗證、網路隔離、持久化、備份、監控與升級回復程序。

Firecrawl 主專案採 [AGPL-3.0](https://github.com/firecrawl/firecrawl/blob/main/LICENSE)。這不是一句「商用禁止」，也不能簡化成「只要呼叫 API 就要公開自己的應用程式」。不過，修改受涵蓋程式並讓使用者透過網路互動時，AGPL 第 13 節涉及提供 corresponding source 的義務。實際產品如何組合、是否修改、哪些部分構成 covered work 都是法律判斷。上線前應讓法務依部署方式確認，不要靠部落格代替授權意見。

## Firecrawl 還是 Crawl4AI

| 判斷軸 | Firecrawl Cloud | 自架 Firecrawl | Crawl4AI |
|---|---|---|---|
| 最短上線路徑 | API key 後直接呼叫 | 先操作多服務堆疊 | Python 程式內啟動瀏覽器 |
| 維運責任 | 供應商負責主要基礎設施 | 自己負責 API、worker、queue 與資料服務 | 自己負責程式、browser 與並行 |
| 結構化抽取 | 代管 JSON mode／agent | 要自行接模型，能力依服務而異 | CSS 與 LLM strategy 都由程式控制 |
| 適合情境 | 想買到穩定 API 與較少維運 | 需要 source／infrastructure control | 想把抓取策略留在 Python codebase |

[Crawl4AI 完整介紹](/posts/ai/2026-08-21-crawl4ai-complete-guide)的強項是程式內控制：CSS-first、LLM fallback、browser config 與 extraction strategy 都能跟應用程式一起測。Firecrawl Cloud 的價值則是把抓取變成共享服務，讓不同語言與 agent 共用同一套 endpoint。只抓少量已知 URL 時，Crawl4AI 通常更直接；需要跨團隊的 API、job、crawl 與代管基礎設施時，Firecrawl 才值得用 credits 換維運時間。

最小決策動作很簡單：先選 20 個固定 URL，保存 Firecrawl scrape 的 status、Markdown 與 credits；同一批再用現有 crawler 跑一次。比較缺頁、延遲、人工介入與維運時間，而不是只比「哪個輸出了 Markdown」。

## 參考資料

- [Firecrawl Advanced Scraping Guide](https://docs.firecrawl.dev/advanced-scraping-guide)
- [Firecrawl Python quickstart](https://docs.firecrawl.dev/quickstarts/python)
- [Choosing the Data Extractor](https://docs.firecrawl.dev/developer-guides/usage-guides/choosing-the-data-extractor)
- [Firecrawl Billing](https://docs.firecrawl.dev/billing)
- [Firecrawl Rate Limits](https://docs.firecrawl.dev/rate-limits)
- [Open source or Firecrawl Cloud](https://docs.firecrawl.dev/contributing/open-source-or-cloud)
- [Self-hosting Firecrawl](https://docs.firecrawl.dev/contributing/self-host)
- [Firecrawl AGPL-3.0 license](https://github.com/firecrawl/firecrawl/blob/main/LICENSE)
- [站內：Crawl4AI 完整介紹](/posts/ai/2026-08-21-crawl4ai-complete-guide)
