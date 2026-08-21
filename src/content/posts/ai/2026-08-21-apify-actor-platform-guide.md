---
title: "Apify 完整介紹：Actor、Task、排程與資料集怎麼組成爬取平台"
date: 2026-08-21
category: ai
type: guide
tags: [apify, web-scraping, browser-automation, data-pipeline, python]
lang: zh-TW
tldr: "Apify 不是單一 crawler，而是把爬取程式包成 Actor，再用 Task 固定設定、Schedule 觸發執行、Dataset 交付結果的平台。適合不想自己維護佇列、排程與執行環境的團隊，但 Actor 費用、運算、proxy、儲存與傳輸會共同消耗預付額度。"
description: "從實作角度介紹 Apify 的 Actor、Task、Schedule、Dataset、Request Queue 與 Python API，並說明免費額度、成本邊界、錯誤處理，以及何時應改用 Crawl4AI、Scrapy 或自建 worker。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-apify-actor-platform-guide-en)

[Apify](https://docs.apify.com/actors) 不是一套新的 CSS selector，也不是只有雲端版 crawler。它是一個爬取與自動化執行平台：程式被包成 Actor，常用輸入存成 Task，Schedule 負責定時執行，結果則進入 Dataset 或其他內建儲存空間。

因此，判斷要不要用 Apify 的問題不是「它抓不抓得到這個頁面」。真正的問題是：要不要把執行環境、排程、結果儲存、proxy 與失敗通知一起交給平台。只需要在本機讀一個已知 URL，可以先看 [Crawl4AI 完整介紹](/posts/ai/2026-08-21-crawl4ai-complete-guide)；需要把抓取工作變成可重複服務，Apify 才開始有明顯價值。

本文依 2026 年 8 月 21 日的官方文件與公開價格撰寫，沒有實際租用付費 Actor 或執行大規模爬取。

## Actor 是有輸入與輸出的雲端程式

官方把 [Actor](https://docs.apify.com/actors) 定義為接收結構化 JSON、執行工作並選擇性產生結構化輸出的 serverless cloud program。它可以是 crawler、瀏覽器自動化、資料轉換程式，甚至是呼叫其他 Actor 的編排器。

一個 Actor 不只有程式碼。它通常還包含 Dockerfile、README、輸入與輸出 schema、版本 metadata，以及對平台儲存空間的存取。這讓 Apify Console 能根據 schema 畫出表單，也讓 API 呼叫端知道應該傳什麼欄位。

Actor 有兩條取得路徑：

- 從 Apify Store 使用別人發布的 Actor，適合快速驗證。
- 自己用 JavaScript、Python、Crawlee 或任意 Docker 映像建立 Actor，適合需要控制程式與輸出契約的工作。

Store Actor 的品質與計費方式由各作者決定。它能省掉開發時間，卻不代表輸出 schema、維護節奏與網站政策會永遠穩定。正式接進 agent 前，先固定 Actor 版本、保存一份測試輸入，並驗證輸出欄位。

## Actor、Task、Schedule 是三種不同責任

第一次接觸 Apify，最容易把三者都理解成「一個爬蟲」。實際分工如下：

| 元件 | 保存什麼 | 適合用途 |
|---|---|---|
| Actor | 程式、schema 與版本 | 定義工作能做什麼 |
| Task | 某個 Actor 的固定輸入與執行選項 | 為不同網站或客戶建立可重用設定 |
| Schedule | cron、時區與要觸發的 Actor／Task | 定時執行已經測過的工作 |

[Actor Task](https://docs.apify.com/actors/running/tasks) 不會複製一份程式。它保存 Actor 的輸入、timeout、memory 等設定。例如，同一個產品爬蟲可以有「台灣站每日價格」與「日本站每週庫存」兩個 Task，而不需要 fork 兩份 Actor。

[Schedule](https://docs.apify.com/actors/running/schedules) 再負責觸發 Task。它支援 cron、時區與日光節約時間；官方也提醒，排程可能因系統負載而延後。因此它適合「固定週期執行」，不適合拿來承諾硬即時的秒級工作。

可以把整條控制面理解成：

```text
Actor version
    └── Task: 固定輸入、memory、timeout
            └── Schedule: cron、timezone
                    └── Run: 一次實際執行
                            ├── Dataset: 表格式結果
                            ├── Key-value store: 檔案與任意值
                            └── Request queue: 待處理 URL
```

## 用 Python 跑 Actor 並取得 Dataset

官方 Python client 同時提供同步與非同步介面，並對失敗或 rate limit 實作 exponential backoff。安裝：

```bash
pip install apify-client
```

把 token 放進環境變數，不要寫進前端或 commit：

```bash
export APIFY_TOKEN="apify_api_..."
```

以下範例啟動一個 Actor、等待執行結束，再讀取這次 run 的預設 Dataset：

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

actor = client.actor("username/actor-name")
run = actor.call(
    run_input={
        "startUrls": [{"url": "https://example.com"}],
        "maxPagesPerCrawl": 20,
    },
    memory_mbytes=1024,
    timeout_secs=600,
)

if run is None:
    raise RuntimeError("Actor did not return a completed run")

dataset = client.dataset(run.default_dataset_id)
items = dataset.list_items(clean=True).items

for item in items:
    print(item)
```

`actor.call()` 是同步等待。互動式 API 不應無限制卡在這裡；把工作改成非同步啟動，保存 run ID，再用 webhook 或狀態查詢收結果。官方 webhook 支援 `SUCCEEDED`、`FAILED`、`ABORTED` 與 `TIMED-OUT` 等 run event，接收端應以 run ID 做冪等處理。

這段程式的 `run_input` 只是形狀示例。實際欄位由該 Actor 的 input schema 決定，不能把某一支 Store Actor 的參數套到所有 Actor。

## 三種儲存空間不要混用

[Apify Storage](https://docs.apify.com/storage) 內建三種資料結構：

| 儲存類型 | 適合放什麼 | 不適合放什麼 |
|---|---|---|
| Dataset | 一列一筆的結構化結果，可匯出 JSON、CSV、Excel | 任意大型 binary 或 crawler frontier |
| Key-value store | JSON、HTML、圖片、checkpoint | 需要逐列查詢的大型結果集 |
| Request queue | URL、HTTP method、unique key 與 crawl metadata | 最終分析結果 |

每次 run 都會取得預設儲存空間。未命名空間受 retention policy 管理；需要長期保留時，應使用命名儲存空間或在下游完成匯出。官方文件指出，命名空間會持續保留，但仍會產生儲存與操作費用。

Dataset 和 key-value store 支援多個 run 同時寫入，寫入順序沒有保證。若下游在意順序或版本，結果裡應加入 `source_url`、`retrieved_at`、`run_id` 與內容 hash，而不是把 Dataset 的列順序當事件順序。

## 排程只是觸發器，不是資料新鮮度策略

設定 `@daily` 只能表示每天啟動一次，不能保證資料每天都真的更新。production 工作至少還要補四件事：

1. Task 設定頁面上限、timeout 與允許的網域。
2. 成功 webhook 驗證 Dataset 是否真的有預期欄位與筆數。
3. 失敗 webhook 記錄錯誤類別，不對永久性 `401`／`403` 無限重試。
4. 下游以 canonical URL 與內容 hash 做 upsert，處理消失頁面的 tombstone。

今晚就能做的最小動作是：先手動執行 Task，保存一份成功輸出；只有 schema validation 通過後才打開 Schedule。官方排程文件本身也要求 Actor 或 Task 先準備並測試完成。

需要的是「什麼頁面值得重爬」而非固定 cron 時，應另外加入 sitemap、RSS、webhook 或變更偵測器。Apify 提供執行能力，不會替你的資料定義 freshness SLA。

## 成本不是只有 Actor 的標價

依 [Apify 公開 pricing](https://apify.com/pricing)，Free plan 在查證日提供每月 5 美元 prepaid usage，不需信用卡；用完後會停用到下一個 billing cycle，未使用額度不會累積。付費方案則可能在 prepaid usage 用完後產生 overage，應在 Billing 設定 spending limit。

一次 run 的成本可能同時來自：

- Actor 自己的 pay-per-event 或 pay-per-usage 模式。
- 記憶體乘以執行時間形成的 compute units。
- residential／datacenter／SERP proxy。
- Dataset、key-value store、request queue 的儲存與操作。
- 外部與內部資料傳輸。
- timeout、retry 或 selector 失效造成的無效執行。

所以不要拿「每月 5 美元」除以預估頁數後直接承諾成本。先用代表性 Task 跑小批次，再到 Billing 看 compute、proxy、storage 與 transfer 的實際拆分；網站類型不同時，結果可能差很多。

## 什麼時候適合 Apify

適合：

- 想快速使用現成 scraper，又需要 API、排程與結果儲存。
- 自己有 crawler，但不想維護 worker、cron、佇列與執行紀錄。
- 多個 Task 共用同一支 Actor，需要按客戶或網站隔離輸入。
- 希望完成後用 webhook 接到資料倉儲或 agent pipeline。

不適合：

- 只抓少量已知 URL，本機或單一 worker 已足夠。
- 資料不能離開自己的基礎設施。
- 需要完全掌控 proxy、瀏覽器版本或底層網路行為。
- 無法接受 Store Actor 的第三方維護與額外計價方式。

Apify 的核心取捨很清楚：它把 crawler 周圍那圈不起眼的執行工作產品化。省下的不是 selector，而是部署、排程、儲存、通知與帳務整合；代價則是平台依賴，以及必須同時理解 Actor 與基礎設施的多層成本。

## 參考資料

- [Apify Actors](https://docs.apify.com/actors)
- [Apify Actor tasks](https://docs.apify.com/actors/running/tasks)
- [Apify Actor and task schedules](https://docs.apify.com/actors/running/schedules)
- [Apify Storage](https://docs.apify.com/storage)
- [Apify API client for Python](https://docs.apify.com/api/client/python/docs)
- [Apify pricing](https://apify.com/pricing)
- [站內：AI 爬蟲工具全景圖](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)
- [站內：免費搜尋與爬取工具怎麼選](/posts/ai/2026-08-21-free-search-scraping-tools)
- [站內：Crawl4AI 完整介紹](/posts/ai/2026-08-21-crawl4ai-complete-guide)
