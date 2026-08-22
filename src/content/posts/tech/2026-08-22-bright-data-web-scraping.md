---
title: "Bright Data 深入介紹：從 Proxy、Web Unlocker 到 Scraping Browser 與 Datasets"
date: 2026-08-22
category: tech
type: deep-dive
tags: [bright-data, web-scraping, proxy, anti-bot, data-collection]
lang: zh-TW
tldr: "Bright Data 把網頁資料取得拆成四層：Proxy 保留控制權，Web Unlocker 回傳已解鎖內容，Browser API 代管互動式瀏覽器，Web Scraper APIs 與 Datasets 直接交付結構化資料。"
description: "拆解 Bright Data 的 Proxy Networks、Web Unlocker、Browser API、Web Scraper APIs 與 Datasets，說明它和自架 Scrapy、Selenium 的差異，以及成本、合規與供應商綁定風險。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-bright-data-web-scraping-en)

[Bright Data](https://docs.brightdata.com/introduction) 不是一套「更強的爬蟲框架」，而是一組把網路出口、反爬處理、瀏覽器執行與資料解析逐層代管的服務。選它的關鍵不是網站難不難爬，而是團隊想保留多少控制權、願意把多少維運責任交出去。

這篇按資料從目標網站回到應用程式的路徑，拆解四個層次：Proxy Networks、Web Unlocker、Browser API（舊稱 Scraping Browser），以及 Web Scraper APIs / Datasets。先講結論：Scrapy 與 Selenium 負責「怎麼走、怎麼解析」，Bright Data 主要處理「從哪裡連、怎麼取得可用回應」。兩者常是互補，不是直接替代。

```text
你的排程、驗證與儲存
        │
        ├─ 自寫請求與解析 ─ Proxy Networks ─ 目標網站
        ├─ 傳入 URL ───── Web Unlocker ─────── 已解鎖 HTML / JSON
        ├─ Playwright / Selenium ─ Browser API ─ 遠端瀏覽器
        └─ 傳入 URL / 查詢 ─ Web Scraper API ─ 結構化資料
                                      └─────── Datasets（預先蒐集）
```

## Proxy Networks：只代管網路出口

[Proxy Networks](https://docs.brightdata.com/proxy-networks/introduction) 是最底層的選項。你的程式仍然送 HTTP 請求、管理 cookie、重試、節流並解析回應；Bright Data 提供資料中心、ISP、Residential 等不同來源的 IP，以及地理位置與 session 控制。

資料中心 proxy 通常適合沒有嚴格封鎖、但需要大量或固定出口的網站。ISP proxy 是註冊在 ISP 名下的伺服器 IP，適合長 session 或資料中心 IP 容易被擋的情境。Residential 則把流量送經真實使用者同意加入的住宅連線，較接近當地一般訪客的網路來源，但延遲、成本與治理敏感度也更高。

這一層最像替 Scrapy 換掉 downloader 的出口。Spider、selector、去重、排程與資料模型都不必交給供應商，因此鎖定程度最低；代價是反爬邏輯仍屬於你。當網站改驗 TLS 指紋、cookie 流程或 CAPTCHA，換 IP 未必能解決。

最小連線概念如下。帳號、zone 與密碼必須從環境變數讀取，不能寫進 repository：

```bash
curl --proxy "http://${BRIGHT_DATA_PROXY_USER}:${BRIGHT_DATA_PROXY_PASSWORD}@brd.superproxy.io:33335" \
  "https://example.com/"
```

Residential 不是「註冊就能任意使用」的公共 IP 池。[官方網路存取政策](https://docs.brightdata.com/proxy-networks/residential/network-access) 說明，新建 Residential zone 需要註冊公司、公司信箱與人工 KYC，核准範圍也會綁定申請時提出的用途。若專案無法清楚說明目標、資料類型與保存方式，這不是適合用住宅 proxy 補救的工程問題。

## Web Unlocker：把一次取得內容的反爬流程交出去

[Web Unlocker API](https://docs.brightdata.com/scraping-automation/web-unlocker/introduction) 接收目標 URL，代管 proxy 選擇、header 與指紋調整、CAPTCHA、重試，再回傳 HTML 或 JSON。你的程式仍負責找出下一個 URL、解析欄位、驗證資料與寫入儲存層，但不再需要維護每個網站的解鎖策略。

```bash
curl "https://api.brightdata.com/request" \
  -H "Authorization: Bearer ${BRIGHT_DATA_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "web_unlocker",
    "url": "https://example.com/",
    "format": "raw"
  }'
```

這比單純 proxy 多了一層結果導向的介面：官方目前採成功請求才計費，失敗重試由服務端吸收。不過「成功」代表取得供應商判定可用的回應，不代表你需要的欄位存在、內容沒有 A/B test，或資料符合商業規則。應用程式仍要檢查 HTTP 狀態、必要 selector、語系與資料新鮮度。

Web Unlocker 不提供可編排的瀏覽器互動。需要點擊、捲動、填表或維持多步驟狀態時，官方也明確指向 Browser API。反過來說，若單次 HTTP 回應就夠，啟動完整瀏覽器只會增加流量與故障面。

## Browser API：保留 Selenium 腳本，交出瀏覽器基礎設施

[Browser API](https://docs.brightdata.com/scraping-automation/scraping-browser/introduction) 在雲端啟動已接好 proxy 與解鎖能力的 Chrome。開發者透過 WebSocket 連上遠端瀏覽器，繼續使用 Puppeteer、Playwright 或 Selenium 寫導覽與抽取邏輯。它代管的是瀏覽器程序、IP 輪替、指紋、CAPTCHA 與 session recovery，不會替你決定該按哪個按鈕。

```js
import puppeteer from "puppeteer-core";

const endpoint = `wss://${process.env.BRIGHT_DATA_BROWSER_AUTH}@brd.superproxy.io:9222`;
const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
const page = await browser.newPage();

await page.goto("https://example.com/", { waitUntil: "domcontentloaded" });
console.log(await page.title());
await browser.close();
```

它與自架 Selenium Grid 的差別在責任位置。自架時，團隊要處理 Chrome 版本、容器容量、崩潰回收、proxy、CAPTCHA 與可觀測性；Browser API 把前半段移給供應商，你仍要維護 selector、等待條件、導覽狀態與輸出驗證。既有 Selenium 流程可以沿用觀念與部分程式碼，但遠端環境、逾時與網路錯誤仍需要重新測試。

[官方 FAQ](https://docs.brightdata.com/scraping-automation/scraping-browser/faqs) 說明 Browser API 依傳輸流量計費，因此圖片、字型、影片與廣告不是單純的效能浪費，也會直接推高帳單。實作時可攔截不需要的資源，並先在少量代表頁面量測每筆工作消耗的流量，再決定 concurrency 與預算上限。

## Web Scraper APIs 與 Datasets：連解析也一起代管

[Web Scraper APIs](https://docs.brightdata.com/datasets/scrapers/overview) 再往上抽象一層。你傳入 URL 或查詢條件，取得網站特定 schema 的 JSON 或 CSV，不必自己維護 proxy、瀏覽器與 selector。它適合目標落在既有 scraper 目錄、欄位定義穩定，而且產品更在意交付資料而非頁面操作細節的情境。

```bash
curl "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${BRIGHT_DATA_DATASET_ID}&format=json" \
  -H "Authorization: Bearer ${BRIGHT_DATA_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[{"url":"https://example.com/product/123"}]'
```

同步請求適合少量即時查詢；批次工作則要設計非同步完成通知、重試與重複資料處理。即使 API 回傳結構化欄位，也要把供應商 schema 當外部合約：保存原始回應、驗證必要欄位，並在欄位消失或型別改變時發出告警。

[Dataset Marketplace](https://docs.brightdata.com/datasets/marketplace/overview) 則把蒐集時間也往前移。資料已依排程整理好，可選欄位、篩選並交付到物件儲存或資料倉儲。若用途是模型訓練、研究母體或定期市場快照，而不是「現在打開這個頁面」，直接買資料集往往比維護爬蟲合理。相對地，更新頻率、欄位血緣、補值規則與刪除請求如何傳遞，都要在採購前確認。

## Managed anti-bot 的責任邊界

Bright Data 能承接的是存取層的工程工作：IP 來源與輪替、瀏覽器執行、常見 challenge、重試，以及在更高階產品中的解析。它不會替資料使用者取得網站授權，也不會替你判斷著作權、個資、契約、robots 指示或特定地區法規。

[Acceptable Use Policy](https://brightdata.com/acceptable-use-policy) 是供應商允許使用服務的最低門檻，其中禁止蒐集非公開資訊與多種濫用行為。通過 KYC 或 API 請求成功，只能證明供應商允許該帳戶使用某項能力；它不是目標網站授權，更不是法律意見。

上線前至少做四件事：列出目標網域與所需欄位、確認公開性與使用依據、設定合理速率及停止條件、定義保存期限與刪除流程。資料含可識別個人資訊時，再讓法務或隱私負責人依實際司法管轄區審查。不要把「公開可見」直接等同「可無限制蒐集與再利用」。

## 成本、可觀測性與供應商綁定

Bright Data 各層的計費單位不同：proxy 與 Browser API 常以流量為核心，Unlocker 看成功結果，scraper 與 dataset 則可能按紀錄或交付量。價格會變，因此預算模型應從自己的工作量推導，不要把首頁單價硬寫進程式碼或年度估算。

先用代表性樣本記錄每個 URL 的請求數、回傳 bytes、成功率、重試次數與有效紀錄數，再換算「每一筆通過驗證的資料」成本。供應商的成功率不等於資料有效率；只看 HTTP 成功會低估空欄位、錯語系與重複紀錄造成的浪費。

抽象層越高，切換成本通常越高。Proxy 的輸出仍是標準 HTTP；Web Unlocker 回傳 HTML，解析器多半可搬走；Browser API 維持標準自動化框架，但依賴遠端執行特性；預建 scraper 的 dataset ID、schema 與交付流程則最容易綁住應用。降低風險的方法是把供應商呼叫包在 adapter 後面，建立自己的 canonical schema，並保存可合法保存的原始輸出與品質指標。

## 何時應該選 Scrapy、Selenium，何時不該用 Bright Data

| 情境 | 較合適的起點 | 原因 |
|---|---|---|
| 靜態頁、限制少、規模可控 | [Scrapy](https://docs.scrapy.org/en/latest/) | 排程、去重、解析與 pipeline 完整，自架成本較低 |
| 必須操作 JavaScript 頁面，反爬不重 | [Selenium](https://www.selenium.dev/documentation/) 或 Playwright | 保留瀏覽器控制，不必先承擔代管流量費 |
| HTTP 取得常被擋，但解析規則由你掌握 | Web Unlocker | 把解鎖交出去，保留 crawler 與 parser |
| 多步驟互動且需要代管反爬 | Browser API | 遠端瀏覽器與解鎖整合，腳本仍由你控制 |
| 常見網站、固定欄位、只需要結構化結果 | Web Scraper API | 不維護 selector 與瀏覽器 |
| 要的是一批定期更新資料，不是即時頁面 | Datasets | 直接採購資料交付，不必營運 crawler |

不該用 Bright Data 的情況也很清楚：資料來源提供正式 API；低頻公開頁面用一般 HTTP client 就穩定；團隊不能接受資料經第三方處理；目標、用途或保存依據說不清楚；或工作流程高度依賴供應商沒有承諾的特殊互動。此時先解決授權、資料治理或產品需求，買更強的解鎖能力只會把問題藏得更深。

整體來說，Bright Data 的價值是把網頁資料取得從「自架所有層」改成可逐層採購。最穩健的選法是從最低抽象層開始：普通請求夠用就不加 proxy，proxy 夠用就不上 Unlocker，單次內容夠用就不開瀏覽器，自己解析能保持產品差異就不買固定 schema。只有當反爬維運已成為可量測的瓶頸，代管成本才有明確的比較基準。

## 參考資料

- [Bright Data Proxy infrastructure](https://docs.brightdata.com/proxy-networks/introduction)
- [Bright Data Residential network access policy](https://docs.brightdata.com/proxy-networks/residential/network-access)
- [Bright Data Web Unlocker API overview](https://docs.brightdata.com/scraping-automation/web-unlocker/introduction)
- [Bright Data Browser API introduction](https://docs.brightdata.com/scraping-automation/scraping-browser/introduction)
- [Bright Data Browser API FAQs](https://docs.brightdata.com/scraping-automation/scraping-browser/faqs)
- [Bright Data Web Scraper APIs overview](https://docs.brightdata.com/datasets/scrapers/overview)
- [Bright Data Dataset Marketplace overview](https://docs.brightdata.com/datasets/marketplace/overview)
- [Bright Data Acceptable Use Policy](https://brightdata.com/acceptable-use-policy)
- [Bright Data pricing overview](https://brightdata.com/pricing)
- [Scrapy documentation](https://docs.scrapy.org/en/latest/)
- [Selenium documentation](https://www.selenium.dev/documentation/)
