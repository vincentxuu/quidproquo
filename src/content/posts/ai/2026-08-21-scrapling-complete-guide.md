---
title: "Scrapling 完整介紹：從 adaptive selector 到並行 Spider"
date: 2026-08-21
category: ai
type: guide
tags: [scrapling, web-scraping, crawler, browser-automation, playwright, python]
lang: zh-TW
tldr: "Scrapling 把 HTTP、Playwright 瀏覽器、CSS/XPath 抽取與 Spider 放進同一套 Python API；adaptive selector 會保存元素特徵，版面改動後再用相似度重新定位，但仍需要驗證輸出。"
description: "從安裝、Fetcher 選型、CSS/XPath 與 adaptive selector，到 session、proxy、並行 Spider 與失敗處理，完整說明 Scrapling 適合什麼工作，以及它和 Crawl4AI、AgentQL、Scrapy 的差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-scrapling-complete-guide-en)

[Scrapling](https://github.com/D4Vinci/Scrapling) 是 Python 網頁擷取框架：同一套 API 裡有純 HTTP fetcher、以 Playwright 驅動的瀏覽器、CSS/XPath parser，以及可排程多個 request 的 Spider。它最特別的能力是 adaptive selector：先保存元素特徵，網站改版後再依相似度尋找原本的元素。

這不是「丟一個網址，自動理解所有資料」的 AI extractor。你仍要定義欄位、selector、驗證規則與爬取範圍。Scrapling 解決的是取得頁面、定位元素與擴大 crawl；資料的商業語意還是由程式決定。本文依查證日的官方文件與 PyPI 0.4.14 介面整理，範例沒有對受保護網站做成功率實測。

## 安裝時先決定要用到哪一層

[PyPI 套件頁](https://pypi.org/project/scrapling/)列出的最低版本是 Python 3.10。只執行 `pip install scrapling` 會安裝 parser，不包含 fetcher、Spider 與 CLI 的相依套件。要抓網頁，至少要裝 `fetchers` extra：

```bash
python -m venv .venv
source .venv/bin/activate
pip install "scrapling[fetchers]"
scrapling install
```

最後一行會下載瀏覽器和相關系統元件。只要命令列擷取與互動式 shell，可另外安裝 `scrapling[shell]`；全部功能則是 `scrapling[all]`。這個差異很容易踩坑：只裝基本套件後 import `scrapling.fetchers`，官方文件明確說會得到 `ModuleNotFoundError`。

CLI 適合先確認網址和 selector 是否合理，不必先寫完整程式：

```bash
scrapling extract get "https://example.com" page.md
scrapling extract get "https://example.com" title.txt --css-selector "h1"
```

副檔名決定輸出形式：`.md` 轉成 Markdown、`.txt` 取文字、`.html` 保留 HTML。正式資料管線仍建議用 library 或 Spider，才能加入 schema validation、重試與監控。

## 三種取得方式：HTTP、一般瀏覽器、stealth 瀏覽器

[Fetcher 選擇文件](https://scrapling.readthedocs.io/en/latest/fetching/choosing.html)把取得方式分成三條路：

| 類別 | 適合情境 | 主要代價 |
| --- | --- | --- |
| `Fetcher`／`AsyncFetcher` | HTML 已在 response 裡、API 或靜態頁 | 不執行 JavaScript |
| `DynamicFetcher` | 內容要等 JavaScript、捲動或點擊後才出現 | 啟動 Chromium／Chrome，記憶體和延遲較高 |
| `StealthyFetcher` | 需要額外 fingerprint 處理的瀏覽器流程 | 行為較複雜，也沒有跨網站成功保證 |

先從最便宜的 HTTP 路徑開始。`Fetcher` 回傳的 `Response` 同時也是 selector，可以直接看狀態碼並抽取資料：

```python
from scrapling.fetchers import Fetcher

page = Fetcher.get("https://quotes.toscrape.com/")
if page.status != 200:
    raise RuntimeError(f"unexpected status: {page.status}")

quotes = [
    {
        "text": item.css(".text::text").get(),
        "author": item.css(".author::text").get(),
    }
    for item in page.css(".quote")
]
```

同一份頁面可用 CSS、XPath、文字搜尋或類似 BeautifulSoup 的 `find_all`。`::text`、`::attr(href)` 與 chained selector 的寫法接近 Scrapy／Parsel，既有 selector 知識可以沿用。

JavaScript 頁面才換 `DynamicFetcher`：

```python
from scrapling.fetchers import DynamicFetcher

page = DynamicFetcher.fetch(
    "https://example.com/app",
    wait_selector="main article",
    network_idle=True,
    timeout=30_000,
)
titles = page.css("main article h2::text").getall()
```

[DynamicFetcher 文件](https://scrapling.readthedocs.io/en/latest/fetching/dynamic.html)也支援 `page_action` 執行 Playwright 操作、`cdp_url` 連遠端瀏覽器，以及 `proxy`、cookie、locale 與 timezone。不要同時開所有等待條件；長連線或 analytics 可能讓 `network_idle` 一直等不到，通常以真正代表內容完成的 `wait_selector` 比較可靠。

## Adaptive selector 怎麼運作

[Adaptive scraping 文件](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html)描述的是兩階段流程，不是每次都用模糊搜尋取代 selector：

1. 第一次 selector 正常命中時，用 `auto_save=True` 保存元素特徵。
2. 之後原 selector 失效時，用 `adaptive=True` 尋找最相似的元素。

```python
from scrapling.fetchers import Fetcher

Fetcher.configure(adaptive=True)
page = Fetcher.get("https://example.com/products")

# 第一次部署：selector 必須真的抓對，才值得保存
product = page.css("article#featured-product", auto_save=True)

# 網站改版後：原 selector 失效時，才要求重新定位
product = page.css("article#featured-product", adaptive=True)
```

Scrapling 預設用 SQLite 保存元素屬性，並以 domain 和 identifier 區分紀錄。CSS/XPath 方法預設把 selector 當 identifier，也可以自己指定。重新保存會覆寫舊資料，因此 production 不能把 `adaptive=True` 當成無條件正確。若價格區塊和促銷卡片長得很像，相似度最高的元素未必是商業上正確的元素。

實作時至少驗證三件事：結果數量、必要欄位與資料格式。例如價格必須符合預期貨幣，商品網址必須留在允許的 domain；失敗就停下來告警，不要把新的錯誤元素再保存成基準。adaptive selector 的價值是降低版面微調造成的維護量，不是取消 selector regression test。

## Session、proxy 與並行不是同一個旋鈕

單次 `Fetcher.get()` 會建立暫時 session。多個同站 request 應改用 `FetcherSession`，共用連線、cookie 與設定：

```python
from scrapling.fetchers import FetcherSession

with FetcherSession(impersonate="chrome", timeout=30) as session:
    index = session.get("https://example.com/products")
    detail = session.get("https://example.com/products/1")
```

[HTTP fetcher 文件](https://scrapling.readthedocs.io/en/latest/fetching/static.html)也提供 `ProxyRotator`，可在 session 間輪替 proxy。Proxy 只改變網路出口，不會自動修正 selector、登入權限或抓取合法性；輪替也不應拿來忽略 rate limit。

需要佇列、去重、回呼和輸出時，再升級成 Spider：

```python
from scrapling.spiders import Spider, Response

class CatalogSpider(Spider):
    name = "catalog"
    start_urls = ["https://example.com/products"]
    allowed_domains = {"example.com"}
    robots_txt_obey = True
    concurrent_requests = 4
    concurrent_requests_per_domain = 2
    download_delay = 1.0

    async def parse(self, response: Response):
        for card in response.css("article.product"):
            yield {
                "name": card.css("h2::text").get(),
                "url": card.css("a::attr(href)").get(),
            }

        next_url = response.css("a.next::attr(href)").get()
        if next_url:
            yield response.follow(next_url, callback=self.parse)

result = CatalogSpider().start()
result.items.to_json("products.json")
```

[Spider 架構文件](https://scrapling.readthedocs.io/en/latest/spiders/architecture.html)顯示 scheduler 會處理 priority、request fingerprint 與去重，session manager 則能把不同 request 路由到 HTTP 或瀏覽器 session。[進階設定](https://scrapling.readthedocs.io/en/latest/spiders/advanced.html)另有全域與單一 domain 的 concurrency、download delay、AutoThrottle、checkpoint 和開發快取。值得特別注意的是 `robots_txt_obey` 預設為 `False`；需要遵守時要明確打開。

## 「繞過反爬」只能當產品能力宣稱

[StealthyFetcher 官方文件](https://scrapling.readthedocs.io/en/latest/fetching/stealthy.html)列出 headless fingerprint patch、canvas noise、WebRTC/CDP leak 處理，以及 Cloudflare Turnstile／Interstitial 自動化。這些是專案方列出的能力，不等於任何網址、地區、IP 或帳號都能成功。

反爬結果會被目標站規則、browser 版本、IP 信譽、請求節奏、cookie 狀態與頁面更新共同影響。本文沒有針對受保護網站跑成功率測試，所以不引用 README 的速度或 bypass benchmark，也不承諾 StealthyFetcher 能解決 CAPTCHA。即使技術上取得頁面，仍須遵守存取權限、服務條款、robots.txt、個資與著作權規範。

比較穩定的 fallback 是：HTTP 先跑，只有明確缺少 JavaScript 內容才升級 `DynamicFetcher`；確認遭遇 fingerprint 類阻擋後，才評估 `StealthyFetcher`。每次升級都記錄 status、等待點、回應大小與失敗類型，否則最後只會得到昂貴但無法除錯的瀏覽器重試。

## 常見失敗與檢查順序

- **Import 失敗**：確認安裝的是 `scrapling[fetchers]`，瀏覽器模式也執行過 `scrapling install`。
- **HTTP 200 卻沒有資料**：先看原始 response 是否真的含內容；若資料由 JavaScript 載入，改用瀏覽器或直接找合法可用的 API。
- **瀏覽器逾時**：把泛用的 `network_idle` 改成具體 `wait_selector`，並檢查是否錯擋必要 resource。
- **Adaptive 找錯元素**：停止寫入，檢查保存的 identifier、domain 與舊元素特徵，再用代表頁面重建基準。
- **並行後被限流**：降低 per-domain concurrency、增加 delay，並啟用 robots.txt 或 AutoThrottle；增加 proxy 不應是第一個動作。
- **登入狀態消失**：使用 session 保存 cookie，確認 redirect 與登入成功條件，不要把登入頁當成空資料頁。

## 和 Crawl4AI、AgentQL、Scrapy 怎麼選

| 工具 | 最適合的核心工作 | 何時比 Scrapling 合適 |
| --- | --- | --- |
| [Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide) | 把網頁清成 Markdown，再用 CSS 或 LLM 做結構化抽取 | 主要輸出是給 LLM 的乾淨內容，或需要內建 LLM extraction strategy |
| [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction) | 用語意 query 找資料或 Playwright 元素 | DOM 常改、欄位意圖穩定，而且能接受外部語意查詢服務 |
| [Scrapy](https://docs.scrapy.org/en/latest/) | 大型規則式 crawler 與可擴充 middleware／pipeline | 團隊已有 Scrapy 專案、生態整合或成熟部署流程 |
| Scrapling | 同一套 Python API 裡切換 HTTP、瀏覽器、adaptive selector 和並行 Spider | 想保留 deterministic extraction，同時減少多套取得工具的整合成本 |

Scrapling 不是這三者的超集合。它的 adaptive 機制從已知正確元素出發，不做 AgentQL 的自由文字語意定位。它可以輸出 Markdown，但主軸不是 Crawl4AI 的 LLM-ready content pipeline。Spider API 雖受 Scrapy 啟發，也不代表現有 middleware 和部署生態可以直接搬過來。

## 整體來說

Scrapling 的核心取捨，是用一個框架覆蓋 parser、HTTP、瀏覽器與 crawl scheduler。同一套 selector 可以從單頁原型長成多頁 crawler，版面變動時再用 adaptive matching 降低維護量。代價是 fetcher 選擇、瀏覽器資源、相似度誤判與並行禮貌都仍要自己治理。

最小可行做法是先用 CLI 或 `Fetcher` 抓一個公開頁面，固定輸出 schema，替 selector 建立 fixture 測試，再選一個非關鍵欄位試用 `auto_save`／`adaptive`。只有當單頁流程能穩定判斷「抓對、抓錯、抓不到」時，才加 session、Spider 與 stealth fallback。

## 參考資料

- [Scrapling 官方 repository](https://github.com/D4Vinci/Scrapling)
- [Scrapling on PyPI](https://pypi.org/project/scrapling/)
- [Choosing a fetcher](https://scrapling.readthedocs.io/en/latest/fetching/choosing.html)
- [HTTP requests and sessions](https://scrapling.readthedocs.io/en/latest/fetching/static.html)
- [DynamicFetcher](https://scrapling.readthedocs.io/en/latest/fetching/dynamic.html)
- [StealthyFetcher](https://scrapling.readthedocs.io/en/latest/fetching/stealthy.html)
- [Adaptive scraping](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html)
- [Spider architecture](https://scrapling.readthedocs.io/en/latest/spiders/architecture.html)
- [Spider advanced usage](https://scrapling.readthedocs.io/en/latest/spiders/advanced.html)
- [Scrapy official documentation](https://docs.scrapy.org/en/latest/)
