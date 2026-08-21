---
title: "AgentQL 完整介紹：用語意查詢做網頁擷取與 Playwright 自動化"
date: 2026-08-21
category: ai
type: guide
tags: [agentql, web-scraping, browser-automation, playwright, structured-output, ai-agent]
lang: zh-TW
tldr: "AgentQL 用接近資料結構的語意查詢取代易碎的 CSS/XPath：`query_data` 回傳結構化資料，`query_elements` 回傳可操作的 Playwright locator。Starter 公開方案列出每月 50 次免費 API 呼叫，但超額、綁卡與遠端瀏覽器時數的實際停止規則仍要在 Billing 頁確認。"
description: "從 AgentQL query syntax、結構化資料擷取與 Playwright 操作開始，實作本機及遠端瀏覽器，整理除錯方法、成本界線，以及它和 Crawl4AI、AutoScraper、Browser Use 的差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en)

[AgentQL](https://github.com/tinyfish-io/agentql) 是一套網頁擷取與瀏覽器自動化工具。它讓你用 `product_name`、`add_to_cart_btn` 這類帶有語意的欄位描述目標，再把結果交給 Python／JavaScript SDK、REST API 或 Playwright。你仍然負責流程、錯誤處理與資料驗證；AgentQL 處理的是「這一頁上的哪個資料或元素符合描述」。

這個分工很重要。AgentQL 不是整站 crawler，也不是會自行規劃任務的瀏覽器 agent。它比較像 Playwright 上面的一層語意定位器。當網站改版只動到 DOM 結構，按鈕功能與頁面語意沒有改變時，查詢有機會繼續工作，不必立刻重寫 CSS selector。

本文把認識與實作放在同一條路徑：先寫出資料形狀，再決定要讀資料或操作元素，最後才處理遠端瀏覽器、除錯與成本。所有功能與價格資訊均依 2026-08-21 可讀到的官方頁面整理。

## 先看懂 AgentQL query

AgentQL query 看起來像沒有冒號與逗號的 GraphQL，但它不是對固定 schema 查詢。欄位名稱是自由文字，後端會依名稱、頁面內容、階層與括號裡的提示尋找目標。[官方語法文件](https://docs.agentql.com/agentql-query/query-intro)定義了四個最常用的結構：

```text
{
    product_category
    products[] {
        name
        price(as a float, or null if not present)
        add_to_cart_btn(the button inside this product card)
    }
}
```

- `{ ... }` 包住整份查詢。
- `products[]` 表示回傳同類項目的清單。
- 巢狀區塊表達頁面上的結構關係。
- `( ... )` 加入語意提示，也能指定期望格式與缺值處理。

欄位要一行一個，不加逗號。官方建議使用小寫與底線，按鈕名稱加 `_btn`，輸入欄位加 `_box`。這些不是 HTML attribute，而是讓查詢意圖更清楚的命名慣例。

括號提示不要拿來塞整段 prompt。當頁面有兩個「Sign in」時，先用 `header { sign_in_btn }` 或 `login_form { sign_in_btn }` 補階層，再用一句短描述消除剩餘歧義。資料型別也只是提示，不是靜態型別保證。[官方 type hinting 範例](https://docs.agentql.com/accuracy/type-hinting)示範把評分指定成 float，找不到時回 `null`，避免同一欄偶爾得到 `No rating`、`0.0` 或空值。

今晚就能做的第一步：開一個你熟悉的商品列表頁，只查 `products[] { name price }`。成功後才逐一加入描述、型別與操作元素，不要一開始就寫二十個欄位的大查詢。

## `query_data` 與 `query_elements` 是兩條路

同一份 query 可以描述資料，也可以描述頁面元素，但呼叫的方法決定回傳物件。

`query_data` 用在擷取。它依查詢形狀回傳 Python dictionary 或 JavaScript object，適合存成 JSON、送進資料庫或交給後續程式驗證。

```python
import agentql
from playwright.sync_api import sync_playwright

PRODUCT_QUERY = """
{
    products[] {
        name
        price(as a float, or null if not present)
    }
}
"""

with sync_playwright() as p, p.chromium.launch(headless=True) as browser:
    page = agentql.wrap(browser.new_page())
    page.goto("https://scrapeme.live/shop/")

    data = page.query_data(PRODUCT_QUERY, mode="fast")
    for product in data["products"]:
        print(product["name"], product["price"])
```

安裝流程依[官方 Quick Start](https://docs.agentql.com/quick-start)：執行 `pip3 install agentql` 與 `agentql init`，再提供 `AGENTQL_API_KEY`。範例使用 headless Chromium；想先看清楚瀏覽器做了什麼，把 `headless=True` 改成 `False`。

`query_elements` 則回傳包裝過的 Playwright locator，給你點擊、輸入或讀取 element。它不是資料擷取的捷徑；只想取得文字時，直接用 `query_data` 比較清楚。

```python
SEARCH_QUERY = """
{
    search_products_box
}
"""

controls = page.query_elements(SEARCH_QUERY)
controls.search_products_box.fill("Charmander")
page.keyboard.press("Enter")
```

如果只找一個操作目標，也可以用 `page.get_by_prompt("search input field")`。要找一組彼此有結構關係的元素，再用 `query_elements`。操作仍由 Playwright 執行，因此原本的等待、navigation、context、cookie 與例外處理知識都用得上。

## 從本機 Playwright 換到遠端瀏覽器

本機模式是最容易理解的起點：Playwright 在自己的機器啟動 Chromium，AgentQL SDK 包裝 `Page`，語意查詢送往 AgentQL 服務。這代表 SDK 與 repo 採 MIT 授權，不等於核心查詢能力完全離線；查詢需要 API key，也會進入服務端額度計算。

[官方 remote browser 文件](https://docs.agentql.com/browser/remote-browser)另外提供託管瀏覽器 session。建立 session 後取得 CDP URL，再用 Playwright 的 `connect_over_cdp` 連線：

```python
import agentql
from agentql.tools.sync_api import create_browser_session
from playwright.sync_api import sync_playwright

session = create_browser_session()
print("Watch:", session.get_page_streaming_url(0))

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(session.cdp_url)
    page = agentql.wrap(browser.new_page())
    page.goto("https://example.com")
    print(page.query_data("""
    {
        title
        main_content
    }
    """))
    browser.close()
```

遠端 session 提供 CDP、即時畫面網址、不同 browser profile 與 proxy 設定。它適合排程環境沒有瀏覽器、需要從伺服器觀察執行畫面，或想集中管理 browser infrastructure 的情境。若本機 Playwright 已穩定運作，不必為了使用 AgentQL 強制改成遠端瀏覽器；兩者使用同一套 wrapped page API。

登入後頁面也不是 AgentQL 自動取得權限。你仍要在 Playwright 流程裡登入、載入合法取得的 session，並遵守網站條款與資料使用規則。語意定位能找元素，不能替你取得存取授權。

## 除錯順序：先看元素，再調提示

AgentQL 的查詢不是靜態 selector，所以除錯不能只問「語法有沒有過」。比較有效的順序是：

1. 用 [AgentQL Debugger Chrome extension](https://docs.agentql.com/debugger-extension) 在真實頁面執行最小 query。
2. 先按 **Fetch Web Elements**，hover 回傳結果，確認它實際指到哪個 DOM element。
3. 再按 **Fetch Data**，檢查資料形狀與缺值。
4. 有歧義時先補巢狀階層，再補括號描述；不要直接改成一大段自然語言。
5. 固定一組代表性頁面做 regression fixture，驗證必要欄位、型別與合理範圍。

SDK 預設使用 `fast` mode。簡單、重複查詢先用它；複雜頁面漏資料時，再依[官方 Standard Mode 指南](https://docs.agentql.com/accuracy/standard-mode)改成 `mode="standard"`。不要把 Standard Mode 當成萬用修復：如果 query 把 header 與 login form 混在一起，較慢的模式也不會替你補上缺少的結構提示。

動態頁面另一個常見問題是時間點。`query_data` 預設會等待 network idle，但有些網站持續送 analytics 或用無限捲動載入內容。這時要把「等待頁面進入可查詢狀態」寫成明確的 Playwright 步驟，再執行 AgentQL query。若回傳會進入正式資料管線，也要在程式端加 schema validation；語意查詢降低 selector 維護量，不會消除錯資料的可能。

## 免費額度與成本：已知的數字，不知道的停止規則

[AgentQL pricing](https://www.agentql.com/pricing) 在查證日列出兩個免費入口：

| 入口 | 公開包含量 | 公開限制 |
|---|---:|---|
| Trial | 300 API calls、1 小時 remote browser | 10 calls/min、1 個 concurrent remote browser；明載免信用卡 |
| Starter | 每月 50 次免費 API calls、10 小時 remote browser included | 超過免費呼叫後每次 0.02 美元、remote browser 每小時 0.12 美元、5 個 concurrent sessions |

這張表沒有回答三件事：Starter 是否一定不需付款方式、超過免費量時會 hard stop 還是進入可計費狀態，以及 included browser hours 依哪個週期重置。公開 pricing 頁同時寫 `$0/monthly` 與超額單價，卻沒有把這些操作規則說完整。

因此，正式排程前要登入 Billing 頁確認付款方式、spending cap、目前餘額與 browser-hour 規則，並在低額度測試帳戶先跑固定樣本。成本估算也要拆成 API calls 與遠端瀏覽器時間；只看「每月 50 次」會漏掉 browser infrastructure 的另一條計價線。

## 跟四類工具的邊界

| 工具 | 它主要替你處理什麼 | 不等同 AgentQL 的地方 |
|---|---|---|
| 原生 Playwright selector | 用 role、text、CSS 或 XPath 做可重現的元素定位 | 最確定、可完全本機執行，但 UI 結構變動時要自行維護 |
| [Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide) | 抓頁、清理 Markdown、整站 crawling 與 extraction strategy | 它處理取得與整理內容；AgentQL 聚焦目前頁面的語意資料或操作元素 |
| AutoScraper | 從你提供的範例值學出本機擷取規則 | 它是 example-driven library；AgentQL 用自由文字 query，查詢依賴雲端服務 |
| Browser Use | 讓模型觀察頁面並規劃多步驟 browser action | 它負責「下一步做什麼」；AgentQL 負責「哪個元素或資料符合開發者指定的形狀」 |

適合 AgentQL 的工作，是欄位與操作意圖相對穩定、DOM 卻常變動的頁面。例如跨多家商店取得同一組商品欄位，或在既有 Playwright workflow 裡降低 locator 維護量。

它不適合離線環境、資料不能送到外部服務、整站爬取，或要求每次定位都能以固定 selector 完整重現的任務。任務本身還沒拆成明確步驟時，也不該急著導入。

## 整體取捨

AgentQL 把 selector 從「DOM 怎麼寫」提升到「這個元素在做什麼」。代價是定位不再完全由本機規則決定，還多了 API 額度、服務可用性與資料治理問題。最穩的用法不是把整套自動化都改寫成自然語言，而是保留 Playwright 的流程控制，只把最易碎、最難跨站共用的定位工作交給 AgentQL。

實作時先在 Debugger 用三到五個代表頁面收斂 query，再把同一份 query 放進 SDK。輸出進資料庫前做 schema validation，排程上線前到 Billing 確認 hard cap。這三個動作能把 AgentQL 從漂亮 demo 變成可維護的資料流程。

## 參考資料

- [AgentQL 官方 repository](https://github.com/tinyfish-io/agentql)
- [AgentQL Query Introduction](https://docs.agentql.com/agentql-query/query-intro)
- [Best Practices for AgentQL Queries](https://docs.agentql.com/agentql-query/best-practices)
- [Scraping data with query_data](https://docs.agentql.com/scraping/scraping-data-sdk)
- [AgentQL Python Page API](https://docs.agentql.com/python-sdk/api-references/agentql-page)
- [AgentQL Debugger Extension](https://docs.agentql.com/debugger-extension)
- [AgentQL Remote Browser](https://docs.agentql.com/browser/remote-browser)
- [AgentQL Pricing](https://www.agentql.com/pricing)
