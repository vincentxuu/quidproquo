---
title: "Scrapy 深入介紹：從 Engine 到 Pipeline 的自架爬蟲架構"
date: 2026-08-22
category: tech
type: deep-dive
tags: [scrapy, web-scraping, python, crawler, self-hosted]
lang: zh-TW
tldr: "Scrapy 把抓取流程拆成 Engine、Scheduler、Downloader、Spider、Item Pipeline 與 Middleware；適合大量、規則明確的 HTTP 頁面，也能自行控制排程、節流、重試與資料落地。"
description: "拆解 Scrapy 的 Engine、Scheduler、Downloader、Spider、Item Pipeline 與 Middleware，並說明自架部署、robots.txt、AutoThrottle、重試，以及何時改用 Selenium 或代管服務。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-scrapy-crawler-framework-en)

[Scrapy](https://docs.scrapy.org/en/latest/) 是 Python 的網站爬取與結構化資料擷取框架。它不是「送一個 HTTP request，再解析一頁 HTML」的薄包裝，而是一條非同步處理管線：排程、下載、解析、清理與儲存各自有明確邊界。當工作從單頁腳本成長到定期跑、會失敗、要限速、要續跑的 crawler，這個拆分才是 Scrapy 的價值。

這篇按部件拆解 Scrapy。主線是 Engine、Scheduler、Downloader、Spider、Item Pipeline 與兩類 Middleware，接著把它們放回自架環境，處理 robots.txt、節流、重試與部署。文末再判斷何時該選 Selenium 或 Bright Data、Zyte 這類代管服務。

## Engine：只協調，不寫網站規則

依[官方架構說明](https://docs.scrapy.org/en/latest/topics/architecture.html)，Execution Engine 控制所有元件之間的資料流。Spider 產生初始 Request，Engine 交給 Scheduler；Scheduler 選出下一個 Request，Engine 再送往 Downloader。Response 回來後，Engine 把它交給 Spider，最後將新 Request 送回 Scheduler、將 Item 送進 Pipeline。

```text
Spider -> Engine -> Scheduler -> Engine
                  ^              |
                  |              v
Item Pipeline <- Spider <- Middleware <- Downloader
```

Engine 的設計重點是協調，而不是知道「商品名稱在哪個 CSS selector」。網站專屬邏輯應留在 Spider，跨網站的 HTTP 行為放 Downloader Middleware，資料驗證與儲存放 Item Pipeline。照這條界線寫，網站改版時不必翻遍整個專案。

## Scheduler：決定下一個 URL，而不只是保存清單

[Scheduler](https://docs.scrapy.org/en/latest/topics/scheduler.html) 接收 Engine 傳入的 Request，存入記憶體或磁碟資料結構，再依優先權交回 Engine。預設 Scheduler 也搭配 duplicate filter，避免同一個 Request 一再進入佇列；Request 的 `priority`、佇列種類與並行設定會共同影響實際下載順序。

如果工作可能被中斷，啟動時指定 `JOBDIR`，Scrapy 就能保存尚未下載的 Request 與去重狀態，供乾淨停止後續跑。官方也提醒 job directory 內部檔案是實作細節，不應由應用程式直接讀寫。

```bash
scrapy crawl catalog -s JOBDIR=.scrapy-jobs/catalog
```

不要把 Scheduler 當成分散式佇列。Scrapy 官方明確說明它[沒有內建多伺服器分散式 crawl](https://docs.scrapy.org/en/latest/topics/practices.html#distributed-crawls)。需要水平擴充時，應先切分 URL 或任務範圍，再由外部排程器把工作送到不同 worker。

## Downloader：非同步抓頁面的 I/O 層

Downloader 負責把 Request 變成 Response。Scrapy 建立在事件驅動網路框架上，因此等待某個網站回應時，程序仍可處理其他下載；這和逐頁阻塞的 `requests.get()` 迴圈有本質差異。

這一層處理 HTTP，不處理頁面語意。代理伺服器、Cookie、重新導向、壓縮、快取與重試適合放在 Downloader Middleware。若把代理切換或狀態碼判斷散落在每個 Spider callback，行為很快就會不一致。

## Spider：網站規則與導覽策略

Spider 定義從哪裡開始、哪些頁面要跟進，以及如何把 Response 轉成 Item。下面是可直接執行的最小範例；它抓取 Scrapy 官方示範網站、跟隨下一頁，並輸出 JSON Lines。

```python
# quotes_spider.py
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    allowed_domains = ["quotes.toscrape.com"]
    start_urls = ["https://quotes.toscrape.com/"]

    custom_settings = {
        "ROBOTSTXT_OBEY": True,
        "AUTOTHROTTLE_ENABLED": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 2,
        "DOWNLOAD_DELAY": 1.0,
    }

    def parse(self, response):
        for quote in response.css("div.quote"):
            yield {
                "text": quote.css("span.text::text").get(),
                "author": quote.css("small.author::text").get(),
                "url": response.url,
            }

        next_href = response.css("li.next a::attr(href)").get()
        if next_href:
            yield response.follow(next_href, callback=self.parse)
```

```bash
python -m pip install scrapy
scrapy runspider quotes_spider.py -O quotes.jsonl
```

Spider 應負責「這個網站怎麼走」與「這個頁面抽什麼」。欄位清理、必填驗證或寫資料庫，交給下一個部件。

## Item Pipeline：把擷取結果變成可信資料

[Item Pipeline](https://docs.scrapy.org/en/latest/topics/item-pipeline.html) 依設定順序處理 Spider 產生的 Item。典型用途是清理 HTML、驗證欄位、移除重複項目與持久化。每個 component 回傳 Item 讓它繼續流動，或丟出 `DropItem` 終止該筆資料。

```python
# pipelines.py
from scrapy.exceptions import DropItem


class RequiredFieldsPipeline:
    def process_item(self, item):
        item["text"] = item.get("text", "").strip()
        item["author"] = item.get("author", "").strip()
        if not item["text"] or not item["author"]:
            raise DropItem("missing quote text or author")
        return item
```

```python
# settings.py
ITEM_PIPELINES = {
    "myproject.pipelines.RequiredFieldsPipeline": 300,
}
```

Pipeline 的順序值只表示先後。把「正規化 → 驗證 → 去重 → 儲存」拆成小元件，比一個同時做完所有事的巨大 class 更容易測試與替換。

## Middleware：在資料流邊界放共用政策

Scrapy 有兩條 middleware 鏈，名稱相近但位置不同。

- [Downloader Middleware](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html) 位於 Engine 與 Downloader 之間，可在 HTTP request 送出前修改它，也可檢查 response 或 download exception。代理、認證、重試與 robots.txt 都在這一側。
- [Spider Middleware](https://docs.scrapy.org/en/latest/topics/spider-middleware.html) 位於 Engine 與 Spider 之間，可檢查進入 Spider 的 Response，以及 Spider 產生的 Request 或 Item。深度限制與跨 Spider 的輸出政策適合放這裡。

兩條鏈都有順序，而且 request 與 response 的行進方向相反。新增自訂 middleware 前，先看內建 middleware 的順序，再選插入位置；順序不是裝飾性的設定。

## 自架部署：一個 crawl 一個可觀察的工作

最小部署單位可以是容器或虛擬機上的 `scrapy crawl catalog`。由 cron、systemd timer、Kubernetes Job 或現有工作佇列啟動；輸出交給 Feed Export 或 Pipeline；stdout 收進集中式日誌。每次執行都要保留結束原因、下載狀態碼、重試數、丟棄 Item 數與輸出筆數，否則「程序正常結束」不等於「資料完整」。

中斷後必須續跑的工作，為每個 execution 配置獨立且持久化的 `JOBDIR`。不要讓兩個程序共用同一個目錄。[官方續跑文件](https://docs.scrapy.org/en/latest/topics/jobs.html)也提醒：callback 必須可序列化，且 Cookie 等狀態不一定能跨執行完整保存。

多個 Spider 可由外部排程器各自啟動。需要遠端排程 API 時，可以另外部署 Scrapyd。需要跨機跑單一大型 crawl 時，先用可重現方式切分 URL，再讓每個 worker 寫入具備唯一鍵的儲存層。Scrapy 自己不替你處理跨機協調與全域 exactly-once。

## robots.txt、節流與反爬蟲邊界

自架不代表可以忽略網站規則。先確認網站允許自動存取、服務條款與資料使用目的，再設定可識別且能聯絡到維運者的 `USER_AGENT`。Scrapy 的 [`RobotsTxtMiddleware`](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#robotstxtmiddleware) 只有在 `ROBOTSTXT_OBEY` 開啟時才會過濾 robots.txt 禁止的 Request。

固定 `DOWNLOAD_DELAY` 與 `CONCURRENT_REQUESTS_PER_DOMAIN` 提供硬邊界；[AutoThrottle](https://docs.scrapy.org/en/latest/topics/autothrottle.html) 則依各 download slot 的延遲動態調整等待時間，而且仍遵守前述限制。實務上先用保守值跑小範圍，觀察對方延遲與錯誤率，再逐步調整，不要把「沒立刻被封鎖」當成安全訊號。

Scrapy 的節流、Cookie 與代理 middleware 能管理 HTTP 流量，但它不會自動解決 JavaScript challenge、瀏覽器指紋或互動式驗證。這些機制出現時，先找公開 API、資料匯出或取得授權；不要把繞過存取控制當成普通的 middleware 設定。

## 失敗重試：只重試暫時性錯誤

內建 [`RetryMiddleware`](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#retrymiddleware) 會對連線逾時與部分伺服器錯誤等暫時性失敗重排 Request。重試不是成功保證，也不該掩蓋 parser bug。將失敗分成三類會比較好維運：

- 網路或伺服器暫時異常：有限次重試，耗盡後記錄 URL 與原因。
- 被限流：降低並行度與頻率，遵守 `Retry-After`；不要用密集重試加重負載。
- selector 找不到或資料不合法：記錄樣本並告警，交給程式修正，不做相同 request 的盲目重試。

另外替 Item 寫入穩定唯一鍵，讓資料庫採用 upsert 或等價操作。網路重試與工作續跑都可能再次處理同一頁；冪等寫入比假設每頁只執行一次可靠。

## Scrapy、Selenium 與代管服務怎麼選

| 選項 | 最適合 | 主要代價 |
|---|---|---|
| [Scrapy](https://scrapy.org/) | 大量規則明確的 HTML／API、連結導覽、定期 crawl | 自己維運排程、proxy、監控與 selector |
| [Selenium](https://www.selenium.dev/documentation/) | 必須執行 JavaScript、操作表單或重現真實瀏覽器流程 | 瀏覽器程序較重，並行與除錯成本較高 |
| [Bright Data](https://docs.brightdata.com/) | 團隊要採購代理與代管擷取基礎設施 | 依供應商介面與方案運作，需另做成本和資料治理評估 |
| [Zyte](https://docs.zyte.com/) | 想保留 Scrapy 工作流，同時外包部分存取與擷取能力 | 需整合外部服務，並評估資料流向與供應商依賴 |

靜態頁面不要先上瀏覽器。先在 Scrapy Shell 確認原始 Response 是否已含目標資料；有就留在 Scrapy。只有資料必須由前端執行後產生，或流程需要點擊與登入互動，才把特定步驟交給 Selenium。若主要難題已從「解析 HTML」變成代理供應、地理節點、瀏覽器基礎設施與封鎖處理，可以考慮代管服務。它可能比自建整套網路層省維運時間，但那是採購與治理決策，不是 Scrapy 的直接升級。

## 整體來說

Scrapy 的核心取捨很清楚：它用明確元件邊界換取可控性。Engine 串起資料流，Scheduler 管待抓 Request，Downloader 處理 I/O，Spider 保存網站知識，Pipeline 守住資料品質，Middleware 集中共用政策。適合它的工作，是大量、可用 HTTP 表達、規則能寫成 selector 與連結策略的 crawl。

今晚要開始，可以先把最小 Spider 跑通，再依序加 `ROBOTSTXT_OBEY`、保守節流、輸出驗證與失敗觀測。先證明一台機器上的單一工作可重跑、可續跑、可追查，再談分散式或代管反爬蟲服務。

## 參考資料

- [Scrapy official repository](https://github.com/scrapy/scrapy)
- [Scrapy architecture overview](https://docs.scrapy.org/en/latest/topics/architecture.html)
- [Scrapy scheduler](https://docs.scrapy.org/en/latest/topics/scheduler.html)
- [Scrapy spiders](https://docs.scrapy.org/en/latest/topics/spiders.html)
- [Scrapy item pipeline](https://docs.scrapy.org/en/latest/topics/item-pipeline.html)
- [Scrapy downloader middleware](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html)
- [Scrapy spider middleware](https://docs.scrapy.org/en/latest/topics/spider-middleware.html)
- [Scrapy AutoThrottle](https://docs.scrapy.org/en/latest/topics/autothrottle.html)
- [Scrapy jobs: pausing and resuming crawls](https://docs.scrapy.org/en/latest/topics/jobs.html)
- [Scrapy common practices](https://docs.scrapy.org/en/latest/topics/practices.html)
- [Selenium documentation](https://www.selenium.dev/documentation/)
- [Bright Data documentation](https://docs.brightdata.com/)
- [Zyte documentation](https://docs.zyte.com/)
