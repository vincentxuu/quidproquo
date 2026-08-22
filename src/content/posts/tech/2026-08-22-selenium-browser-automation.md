---
title: "Selenium 深入介紹：從 WebDriver session 到 Grid 的瀏覽器自動化"
date: 2026-08-22
category: tech
type: deep-dive
tags: [selenium, browser-automation, web-scraping, python, testing]
lang: zh-TW
tldr: "Selenium 透過標準化 WebDriver session 操作真實瀏覽器，適合跨瀏覽器流程、既有測試資產與遠端 Grid；它能執行 JavaScript 頁面，卻不保證繞過 CAPTCHA 或其他反自動化機制。"
description: "拆解 Selenium WebDriver 架構、定位與等待、session、Grid、容器部署，以及它在爬蟲工作中的適用範圍，並與 Playwright、Scrapy 比較。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-selenium-browser-automation-en)

[Selenium](https://www.selenium.dev/documentation/webdriver/) 是瀏覽器自動化工具，不是爬蟲框架，也不是反偵測套件。程式透過 WebDriver 啟動真實瀏覽器、導覽頁面、操作表單並讀取 DOM。這讓它能處理必須執行 JavaScript 或完成互動後才出現的內容；代價是每個工作都要負擔瀏覽器的 CPU、記憶體與 session 管理。

本文按一次瀏覽器工作的生命週期往下走：命令怎麼進入瀏覽器、元素怎麼定位與等待、session 怎麼關閉、工作怎麼交給 Grid，最後才判斷它是否適合你的擷取任務。

## WebDriver 架構：程式不直接控制瀏覽器

Selenium client library 把 Python 的 `get()`、`find_element()`、`click()` 等呼叫轉成 WebDriver 命令。依 Selenium 的[元件說明](https://www.selenium.dev/documentation/overview/components/)，driver 負責控制實際瀏覽器，命令與回應都經過它；瀏覽器可與程式位於同一台機器，也可以在遠端 Grid Node 上。

```text
Python 程式
    │  WebDriver commands
    ▼
Selenium client ──► browser driver ──► Chrome / Firefox / Edge
                         ▲                    │
                         └──── response ──────┘
```

這個邊界很重要。Selenium 的價值不是「幫你下載 HTML」，而是把不同瀏覽器的原生控制介面收斂成同一套 WebDriver API。若頁面不用執行 JavaScript，直接發 HTTP request 通常更簡單；若流程必須點選、輸入、切換視窗或維持登入狀態，瀏覽器才值得進場。

## 建立 session：最小可執行 Python 範例

先在虛擬環境安裝 Python binding：

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install selenium
```

以下範例開啟 Selenium 官方測試頁、填入文字、送出表單，等結果出現後印出訊息。它使用 Selenium Manager 處理本機 driver；官方的[自動 driver 管理文件](https://www.selenium.dev/documentation/selenium_manager/)說明，binding 在找不到可用 driver 時會呼叫 Selenium Manager。

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")

driver = webdriver.Chrome(options=options)
try:
    driver.get("https://www.selenium.dev/selenium/web/web-form.html")
    driver.find_element(By.NAME, "my-text").send_keys("Selenium")
    driver.find_element(By.CSS_SELECTOR, "button").click()

    message = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "message"))
    )
    print(message.text)
finally:
    driver.quit()
```

`webdriver.Chrome()` 建立一個 [driver session](https://www.selenium.dev/documentation/webdriver/drivers/)；options 描述想要的瀏覽器能力。`quit()` 則結束整個 session 與其視窗。把它放在 `finally`，即使定位或網路失敗也能回收程序。若工作需要登入，可在同一個 session 內沿用 cookie 與頁面狀態；不要把「永久不關的瀏覽器」當成狀態資料庫，應另外保存可重建的工作進度。

## 定位與等待：可靠度就在這一層

WebDriver 支援 ID、name、class name、CSS selector、XPath、link text 等[定位策略](https://www.selenium.dev/documentation/webdriver/elements/locators/)。選擇器應優先靠穩定且有語意的屬性，例如固定 ID、表單 name 或團隊約定的 `data-*` 屬性。一路寫到 `div:nth-child(7)` 的 selector 只是把網頁排版當 API，前端稍微調整就會失效。

找到元素不代表元素已經能互動。Selenium 的[等待策略文件](https://www.selenium.dev/documentation/webdriver/waits/)指出，導覽完成只代表對應的 document ready state 已達條件，JavaScript 仍可能在之後改寫頁面。固定 `sleep()` 不是同步機制：設太短會偶發失敗，設太長則每次都浪費時間。

可預期的做法是 explicit wait：等待「結果文字可見」「按鈕可點」或「資料列數達到條件」，而不是猜頁面需要幾秒。Implicit wait 是整個 session 的全域元素查找等待；官方明確警告不要混用 implicit 與 explicit waits，因為實際逾時可能變得難以預測。上面的範例只使用 explicit wait。

另一個常見問題是 stale element：畫面重新渲染後，先前拿到的 element reference 可能已不再對應目前 DOM。與其長期保存元素物件，不如保存 locator，互動前重新查找。

## 遠端 session 與 Grid：把瀏覽器變成可排程資源

本機 driver 適合單人開發；要跨機器、跨平台或平行執行，則把相同程式指向 [Remote WebDriver](https://www.selenium.dev/documentation/webdriver/drivers/remote_webdriver/)。Selenium Grid 的 [Router](https://www.selenium.dev/documentation/grid/architecture/) 接收新 session，New Session Queue 暫存請求，Distributor 依 capabilities 配對可用 slot，Node 實際執行瀏覽器，Session Map 則記錄 session ID 位於哪個 Node。

```text
client
  │
  ▼
Router ──► New Session Queue ──► Distributor ──► Node slot
  │                                      │
  └──────── Session Map ◄────────────────┘
```

Grid 解決的是瀏覽器容量與路由，不會自動讓你的爬取邏輯具備冪等性。工作佇列仍要記錄 URL、重試次數、輸出狀態與去重鍵；一個 session 失聯時，應能從工作邊界重跑，而不是依賴瀏覽器記憶接續。

小型環境可以先用 standalone 模式。官方 [Grid 入門](https://www.selenium.dev/documentation/grid/getting_started/)將本機預設入口放在 `http://localhost:4444`，並提醒 Grid 必須以防火牆保護，不能直接暴露在公開網路。正式環境還要限制可連線來源、隔離內網存取，並避免把憑證烘進映像檔。

## 容器部署：固定瀏覽器環境，不要固定 `latest`

SeleniumHQ 維護的 [docker-selenium](https://github.com/SeleniumHQ/docker-selenium) 提供 standalone、Hub 與 browser Node 映像。最小啟動方式如下；實際部署請從 release 清單挑明確版本標籤，不要把 `latest` 當成可重現設定。

```bash
docker run --rm -p 4444:4444 \
  --shm-size="2g" \
  selenium/standalone-chrome:<tag>
```

程式端只要換成 remote driver：

```python
from selenium import webdriver

options = webdriver.ChromeOptions()
driver = webdriver.Remote(
    command_executor="http://localhost:4444",
    options=options,
)
try:
    driver.get("https://example.com")
    print(driver.title)
finally:
    driver.quit()
```

容器能固定瀏覽器與系統相依套件，卻不會替你決定容量。每個瀏覽器都是真實程序；應以自己的頁面、併發量與記憶體尖峰做壓力測試，再設定 Node slot 與工作佇列的上限。

## 用於爬蟲：Selenium 能做什麼，不能承諾什麼

Selenium 適合「資料藏在瀏覽器工作流程裡」的任務：登入後查詢、點擊載入更多、經過前端計算才生成的內容，或必須驗證真實使用者路徑的工作。擷取時仍應把輸出轉成明確 schema，保存來源 URL 與觀察時間，並讓寫入可重試。

它不適合把大量靜態頁面逐頁塞進瀏覽器。那會用最昂貴的執行方式完成 HTTP client 本來就能做的事。也不要把 headless browser 誤認成「自然就是人類流量」。Selenium 是自動化介面，**不保證繞過反爬蟲**；網站仍可依流量模式、帳號行為、網路來源、瀏覽器特徵或挑戰頁拒絕請求。

尤其不要設計成自動解 CAPTCHA。Selenium 的[測試實務](https://www.selenium.dev/documentation/test_practices/discouraged/captchas/)直接把 CAPTCHA 列為不建議自動化的項目，因為它的目的就是阻止自動化。遇到阻擋時，正確動作是降低速率、檢查 robots.txt 與服務條款、尋找官方 API 或取得網站授權；不是把偽裝能力當成 Selenium 的功能。

## Selenium、Playwright、Scrapy 怎麼選

| 工具 | 核心抽象 | 優先選它的情況 | 主要取捨 |
|---|---|---|---|
| [Selenium](https://www.selenium.dev/documentation/webdriver/) | 標準化 WebDriver session | 既有 Selenium 資產、跨語言／跨瀏覽器組合、需要 Grid | 等待與 session 生命週期要明確管理 |
| [Playwright](https://playwright.dev/docs/intro) | browser、context、page 與 locator | 新建以互動流程為主的自動化，希望 action 前有內建檢查 | 自己管理它安裝的瀏覽器版本與框架慣例 |
| [Scrapy](https://docs.scrapy.org/en/latest/topics/architecture.html) | request／response、scheduler、pipeline | 大量 HTTP 抓取、佇列、去重與資料管線是主體 | 不會自動提供完整瀏覽器互動 |

差異最明顯的是等待模型。[Playwright auto-wait](https://playwright.dev/docs/actionability)會在 click 前檢查元素是否唯一、可見、穩定、可接收事件且啟用；Selenium 則讓你以 explicit wait 描述所需狀態。若團隊已累積 WebDriver page objects、語言 binding 或 Grid 維運經驗，Selenium 的相容性通常比重寫更有價值。若是全新的瀏覽器互動專案，Playwright 較強的 locator 與 auto-wait 預設值得優先評估。

Scrapy 解的是另一層問題。它的官方[架構說明](https://docs.scrapy.org/en/latest/topics/architecture.html)包含 scheduler、downloader middleware、spider 與 item pipeline，適合把大量 URL 變成可控的資料流。實務上可以讓 Scrapy 負責廣度與資料管線，只把少數必須執行瀏覽器流程的工作送到 Selenium；不要讓所有請求無條件升級成瀏覽器 session。

## 整體來說

Selenium 最值得選的理由，是標準 WebDriver、生態系與遠端 Grid，不是「比較像真人」。先用 HTTP 工具處理能直接取得的內容；確定資料必須經過瀏覽器互動，再以 Selenium 建立短而可回收的 session、穩定 locator、explicit wait 與可重試的工作邊界。這樣它是可靠的瀏覽器執行層；把它當反爬繞過器，則從一開始就選錯抽象。

## 參考資料

- [Selenium WebDriver 文件](https://www.selenium.dev/documentation/webdriver/)
- [Selenium components](https://www.selenium.dev/documentation/overview/components/)
- [Driver sessions](https://www.selenium.dev/documentation/webdriver/drivers/)
- [Locator strategies](https://www.selenium.dev/documentation/webdriver/elements/locators/)
- [Waiting strategies](https://www.selenium.dev/documentation/webdriver/waits/)
- [Remote WebDriver](https://www.selenium.dev/documentation/webdriver/drivers/remote_webdriver/)
- [Selenium Grid architecture](https://www.selenium.dev/documentation/grid/architecture/)
- [Getting started with Selenium Grid](https://www.selenium.dev/documentation/grid/getting_started/)
- [SeleniumHQ docker-selenium](https://github.com/SeleniumHQ/docker-selenium)
- [Selenium test practices: Captchas](https://www.selenium.dev/documentation/test_practices/discouraged/captchas/)
- [Playwright locators and auto-waiting](https://playwright.dev/docs/locators)
- [Scrapy architecture overview](https://docs.scrapy.org/en/latest/topics/architecture.html)
