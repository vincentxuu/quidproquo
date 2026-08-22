---
title: "Zyte 深入介紹：從 Scrapy 開發、反爬取頁到 Scrapy Cloud"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zyte, scrapy, web-scraping, anti-bot, cloud]
lang: zh-TW
tldr: "Scrapy 負責爬取流程與資料模型，Zyte API 接手取頁、瀏覽器與反爬細節，Scrapy Cloud 再負責部署、排程和輸出；三者可以分開採用，不是一套綁死的框架。"
description: "沿著 Scrapy 專案生命週期拆解 Zyte API、Automatic Extraction 與 Scrapy Cloud，包含最小範例、成本與供應商鎖定，以及合規責任邊界。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-zyte-api-scrapy-cloud-en)

[Scrapy](https://docs.scrapy.org/en/latest/) 是開放原始碼的 Python 爬蟲框架；[Zyte API](https://docs.zyte.com/zyte-api/usage/) 與 [Scrapy Cloud](https://docs.zyte.com/scrapy-cloud/) 則是 Zyte 的商業服務。最容易搞混的地方，是把這三者當成同一套產品。其實 Scrapy 可以完全自架，Zyte API 也能由其他 HTTP client 呼叫，而 Scrapy Cloud 解決的是執行與營運，不會替你決定爬哪些頁面。

這篇沿著一個 Scrapy 專案的生命週期走：先在本機寫 spider，再視網站難度把下載交給 Zyte API，必要時改用 Automatic Extraction，最後才決定要不要部署到 Scrapy Cloud。這條主脊也剛好揭露每一層的責任、成本與鎖定位置。

## 第一階段：用 Scrapy 建立可測試的爬取流程

Scrapy 的核心工作不是「突破封鎖」，而是管理 request、response、排程、去重、解析與 item pipeline。[官方把它定義為抓取網站並抽出結構化資料的高階框架](https://docs.scrapy.org/en/latest/intro/overview.html)。CSS selector、分頁規則和輸出 schema 留在 spider 裡，日後不論換代理服務或部署平台，都還有可測試的業務邏輯。

先從不需要登入、沒有刻意規避存取限制的測試站開始：

```python
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]

    def parse(self, response):
        for quote in response.css("div.quote"):
            yield {
                "text": quote.css("span.text::text").get(),
                "author": quote.css("small.author::text").get(),
            }

        next_url = response.css("li.next a::attr(href)").get()
        if next_url:
            yield response.follow(next_url, self.parse)
```

用 `scrapy crawl quotes -O quotes.jl` 就能在本機驗證 selector 與分頁。此時先設定合理的併發與延遲、保存失敗樣本，避免把「解析錯誤」誤判成「反爬失敗」。純靜態網站若用 Scrapy 直接下載就穩定，也沒有必要為每一頁加上瀏覽器或代理成本。

Selenium 的分工不同。它操控你管理的瀏覽器，適合重現互動流程與除錯；Scrapy 則適合大量 URL 的排程、重試與資料管線。自架 Selenium 還要自己處理瀏覽器版本、資源占用、代理品質與封鎖判讀。Zyte API 把取頁基礎設施變成遠端 API，但不會替代 spider 的網站導覽邏輯。

## 第二階段：只把困難的取頁交給 Zyte API

安裝 `scrapy-zyte-api` 後，可以讓既有 Scrapy request 維持原來的 callback。API key 放在環境變數，不要寫進 `settings.py` 或版本控制：

```python
# settings.py
import os

ADDONS = {"scrapy_zyte_api.Addon": 500}
ZYTE_API_KEY = os.environ["ZYTE_API_KEY"]
ZYTE_API_TRANSPARENT_MODE = True
```

```python
import scrapy


class ProductSpider(scrapy.Spider):
    name = "product"

    async def start(self):
        yield scrapy.Request(
            "https://example.com/product/123",
            meta={"zyte_api_automap": {"browserHtml": True}},
        )

    def parse(self, response):
        yield {"title": response.css("h1::text").get()}
```

[官方整合範例](https://docs.zyte.com/zyte-api/usage/examples.html)把這種做法稱為 transparent mode：request 仍由 Scrapy 發出，但 downloader 交給 Zyte API。沒有 JavaScript 的頁面可要求 `httpResponseBody`；需要執行 JavaScript、捲動、截圖或擷取背景 request 時，再要求 `browserHtml` 與 browser actions。[HTTP 與 browser HTML 的 DOM 可能不同](https://docs.zyte.com/zyte-api/usage/http.html)，切換後要重跑 selector 測試，不能假設兩者可互換。

這一層真正省下的是代理池、瀏覽器叢集、重試策略、地理位置與封鎖處理的營運工作。它不是「任何網站都能合法存取」的通行證，也不保證你的 selector 永遠不壞。今晚可以做的動作很具體：先列出目前 spider 的失敗 URL，只讓需要渲染或經常被封鎖的 domain 經過 Zyte API，其他 request 保持直接下載，再比較成功率與帳單。

## 第三階段：Automatic Extraction 要不要取代 selector

[Automatic Extraction](https://docs.zyte.com/zyte-api/usage/extract/spiders.html) 仍是現行功能。它能回傳 product、article、job posting、forum thread、page content 等預先定義的結構，也支援自訂 attributes。抽取來源可選 HTTP response、browser HTML，或你自己提供的 HTML；官方說明中，HTTP 通常較快且便宜，browser 來源則較適合 JavaScript-heavy 頁面。

在 Scrapy request 裡可直接要求結構化 product：

```python
yield scrapy.Request(
    "https://example.com/product/123",
    meta={"zyte_api": {"product": True}},
    callback=self.parse_product,
)

def parse_product(self, response):
    product = response.raw_api_response["product"]
    yield {"name": product.get("name"), "price": product.get("price")}
```

它適合版型多、selector 維護成本高，而且目標資料正好落在官方 schema 的專案。不適合的情況也很清楚：欄位定義特殊、需要精確重現來源節點、抽取結果必須可逐條解釋，或現有 selector 已經便宜又穩定。Automatic Extraction 會另外產生抽取費用，schema 與回傳語意也是一個供應商鎖定點。比較時不要只看「少寫幾行 CSS」，要抽樣保存原始 HTML、結構化結果與人工標準答案，量測缺欄與誤填。

## 第四階段：用 Scrapy Cloud 部署、排程與取回資料

Scrapy Cloud 是託管的執行環境，不是 Zyte API 的另一個名稱。你可以把使用直接下載、Zyte API，甚至其他服務的 Scrapy 專案部署上去；同樣地，使用 Zyte API 也不必購買 Scrapy Cloud。兩套服務還使用不同的 API key，[Scrapy Cloud API 文件有明確提醒](https://docs.zyte.com/scrapy-cloud/usage/reference/http/)。

官方流程使用 `shub` CLI：

```bash
python -m pip install --upgrade shub
shub login
shub deploy YOUR_SCRAPY_CLOUD_PROJECT_ID
```

[部署指南](https://docs.zyte.com/web-scraping/tutorials/main/cloud.html)要求專案指定 Scrapy Cloud project 與執行 stack。部署後，spider 可從 dashboard、Jobs API 或 periodic job 啟動；每次執行是一個 job，可以帶 spider arguments 與覆寫 settings。這讓「每天跑一次」與「某客戶臨時補跑一個日期區間」共用同一份程式碼，而不是在伺服器上堆 cron script。

spider `yield` 的 item 會進入 Scrapy Cloud 儲存空間。[官方下載文件](https://docs.zyte.com/scrapy-cloud/usage/items/download.html)列出 dashboard、URL 與 API 三種取回方式，並支援 CSV、JSON、JSON Lines 與 XML。正式資料管線不該把 dashboard 下載當最後一步：讓下游工作以 job ID 呼叫 Items API，成功寫入自己的倉儲後再標記已消費，才有可重跑的交接點。

Scrapy Cloud 的鎖定集中在部署設定、排程、job metadata、Items API 與附加元件。若團隊已經有 Kubernetes、工作排程器、集中式 logging 與 object storage，自架 Scrapy worker 可能更一致；若真正缺的是 spider 的可觀測性與定期執行，而不是另一套基礎設施，Scrapy Cloud 可以少維護一層。

## 成本與責任邊界

Zyte 的成本不是單一月租。依[現行 Zyte API 定價文件](https://docs.zyte.com/zyte-api/pricing.html)，請求成本受目標網站、HTTP 或 browser 類型及 actions、screenshots、automatic extraction 等功能影響，並只對成功 response 計費；網站 tier 由服務端分派且可能調整。Scrapy Cloud 則按執行 unit 與方案能力計算，[保留期限、最長執行時間、排程與 Docker 權限也依方案而異](https://docs.zyte.com/scrapy-cloud/pricing.html)。因此預算模型至少要分開記錄「取頁請求」與「執行環境」，不要拿每月總額反推單頁成本。

責任也要分開：

| 層級 | 主要負責者 | 不會自動替你處理的事 |
| --- | --- | --- |
| Scrapy spider | 開發團隊 | 資料是否可蒐集、欄位是否正確、下游用途 |
| Zyte API | Zyte 管理的取頁服務 | 你的合法依據、授權、保存期限與資料治理 |
| Automatic Extraction | Zyte 管理的抽取服務 | 每個欄位符合業務定義、結果零誤差 |
| Scrapy Cloud | Zyte 管理的執行與儲存 | spider 邏輯、外部資料倉儲與完整工作流程 |

Zyte 的[合規檢查表](https://www.zyte.com/learn/compliant-web-scraping-checklist/)要求特別檢查非公開資料、明確同意的網站條款、著作權、個人資料、IP 來源與資料的外部使用。使用商業反爬服務不會把這些判斷轉移給供應商。若任何一項涉及疑慮，實際動作是先縮小資料範圍、記錄來源與用途，並讓熟悉適用司法管轄區的法律顧問審查，而不是先測試能不能繞過。

## 整體來說

Zyte 最合理的採用方式是逐層買回維運時間：Scrapy 保留爬取與資料邏輯；直接下載不穩時才導入 Zyte API；selector 維護昂貴時才評估 Automatic Extraction；缺少穩定執行、排程和 job data 介面時再上 Scrapy Cloud。

這套組合適合已有 Python spider、目標網站難度不一，而且不想自己經營代理池與瀏覽器叢集的團隊。小型靜態網站、一次性腳本，或已擁有成熟容器平台的團隊，可能只需要 Scrapy。最重要的不是一次選完整套，而是保留原始輸入、明確量測每層成本，讓每次外包都有可撤回的邊界。

## 參考資料

- [Scrapy 官方文件](https://docs.scrapy.org/en/latest/)
- [Zyte API 使用文件](https://docs.zyte.com/zyte-api/usage/)
- [Zyte API HTTP requests](https://docs.zyte.com/zyte-api/usage/http.html)
- [Zyte API browser automation](https://docs.zyte.com/zyte-api/usage/browser.html)
- [Zyte API Automatic Extraction](https://docs.zyte.com/zyte-api/usage/extract/spiders.html)
- [Zyte API 定價](https://docs.zyte.com/zyte-api/pricing.html)
- [Scrapy Cloud 部署與執行](https://docs.zyte.com/web-scraping/tutorials/main/cloud.html)
- [Scrapy Cloud jobs](https://docs.zyte.com/scrapy-cloud/usage/jobs/)
- [Scrapy Cloud 資料下載](https://docs.zyte.com/scrapy-cloud/usage/items/download.html)
- [Scrapy Cloud 定價](https://docs.zyte.com/scrapy-cloud/pricing.html)
- [Zyte 服務條款](https://www.zyte.com/terms-and-services/)
- [Zyte 合規爬蟲檢查表](https://www.zyte.com/learn/compliant-web-scraping-checklist/)
