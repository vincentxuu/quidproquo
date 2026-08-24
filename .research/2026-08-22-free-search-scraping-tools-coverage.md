# 免費搜尋、抓取與 Browser API 覆蓋補查

查證日期：2026-08-22

## 研究範圍

本文只納入一般開發者可註冊，且提供公開 API 或 MCP 的服務。免費模型分成：

1. 固定週期恢復的 recurring allowance。
2. 持續可用但只有 RPM／QPS 的 rate-limited access。
3. Free plan 存在，但官方沒說額度是否週期性恢復。
4. 不保證恢復的一次性 signup／trial pool。
5. 沒有 API 免費額度，只提供 PAYG 或自行部署的服務。

價格、額度、重置、信用卡與超額行為以官方定價或官方文件為主；二手來源只作交叉檢查。

## 應補入：官方明確寫出週期的免費額度

| 服務 | 免費額度 | 主要消耗方式 | 重置、卡與超額 | 文章優先度 |
|---|---|---|---|---|
| [Browserless](https://www.browserless.io/pricing) | 1,000 units／月；2 個並行 browser；單次最多 1 分鐘 | 每個 browser connection 每 30 秒 1 unit；住宅代理 6 units/MB；資料中心代理 2 units/MB；成功 CAPTCHA 10 units | 免卡；dashboard 顯示 cycle reset date；Free 用完、top-up 與 rollover 行為未公開 | 必補 |
| [Cloudflare Browser Run](https://developers.cloudflare.com/browser-rendering/pricing/) | Workers Free 每日 10 browser minutes；3 個並行 browser | Quick Actions 計 browser time；Puppeteer／Playwright／CDP sessions 同時計 browser time 與 concurrency | Free 用完回 429，UTC 隔日恢復；Paid 含 10 小時／月，超額 $0.09/hour，並行另計 | 必補 |
| [ZenRows](https://www.zenrows.com/pricing) | 5,000 credits／月；5 concurrency | Fetch 1；JS rendering 5；premium proxy 10；JS＋premium 25；Browser Sessions 另按流量與分鐘 | 免卡；每月 refresh、不 rollover；Free 不可 top-up；只對 usable result 計費，404/410 仍計 | 必補 |
| [Parallel](https://parallel.ai/pricing) | eligible organization 每月 $5 credits | Search、Extract、Task 各模式單價不同；只有最便宜 Search mode 才接近 5,000 requests | 必須綁卡；月底失效、不 rollover；超額按標準費率扣卡 | 必補，但需醒目提示自動超額 |
| [You.com free MCP](https://www.you.com/api) | keyless `you-search` 100 queries／日 | 只含 search，不含 Contents、Research、Finance | 無 API key；這條 daily MCP allowance 與 API-key 帳戶的 $100 trial 分開 | 必補 |
| [Browser Use Cloud](https://browser-use.com/pricing) | 每月 10 agent tasks；3 concurrent sessions | agent tasks；browser infrastructure、proxy 與 token 另按量計 | 頁面寫 then PAYG／可 top-up；一般 Free signup 是否免卡未公開 | 建議補 |

只有官方明寫 `/month`、`every month`、`daily`、`billing cycle`、`monthly refresh` 或 `top up each month` 才歸入本表。Free plan 本身不等於額度會恢復。

## 深挖後確認不是週期性免費

| 服務 | 最終判定 | 仍未知 |
|---|---|---|
| [Hyperbrowser](https://www.hyperbrowser.ai/pricing) | 一次性 5,000 credits、免卡。官方網站前端 FAQ 明寫這筆額度用於 test service，Free 用完必須升級；不會每月 refresh | 未使用的免費 credits 是否有到期日 |
| [Bocha／博查免費資源包](https://aq6ky2b8nql.feishu.cn/wiki/RWdvw557Li3IJekGeLkcDFa3n1f) | 公開活動頁支持一次性免費 1,000 次 resource package，另可憑活動口令再兌換；沒有月／日 reset。標準 Web Search 是 ¥0.036/次，即 ¥36/千次；¥3.6/千次是優惠 resource package | 今天是否仍能在登入後 `/package` 實際兌領、免費包效期 |

## 既有與新增服務的週期證據

| 類型 | 服務 | 官方可安全寫法 | 尚未公開 |
|---|---|---|---|
| 每月 | Exa | 註冊 $20，之後每月 $10 | reset 日、時區、rollover |
| 每月 | Tavily | 每月 1,000 credits | reset 日、時區、rollover |
| 每月 | Firecrawl | 每月 1,000 credits；Free 不 rollover | reset 日、時區 |
| 每月補回 | Linkup | eligible account 每月把餘額補回 $20 | top-up 日、時區、expiry |
| 每月 | Brave Search API | 每月自動套用 $5 credits | apply 日、時區、rollover |
| billing cycle | SerpAPI | 每月 250 successful searches；新 billing cycle 開始時 reset | Free rollover、Free 提前續期行為 |
| 每月 | Parallel | eligible org 每月 $5；月底失效 | grant 日與時區 |
| 每月 | Apify | 每月 $5 prepaid usage；週期結束失效 | 各帳戶週期起始日 |
| 每月 | AgentQL | Starter 50 API calls/month | 10 browser hours 的精確 reset、trial 週期、hard stop／overage |
| monthly allocation | Browserbase | 每月 1 browser hour、3 Agents、1,000 Search、1,000 Fetch | reset 日、rollover、Free 用完行為 |
| billing period | Diffbot | 每月 10,000 credits；billing period 開始時 reset | rollover、精確日期 |
| 每月 1 日 | Bright Data 一般 Free Tier | 每月 5,000 credits；一般共用池每月 1 日 renew | 剩餘 credits 是否保留 |
| 每月 | Bright Data MCP | 新 MCP 使用者每月 5,000 requests | reset 日、rollover、是否和一般 Free Tier 同池 |
| monthly refresh | ZenRows | 每月 5,000 credits；Free 不 rollover | refresh 日期與時區 |
| monthly cycle | Browserless | 每月 1,000 units；dashboard 顯示 cycle reset date | rollover、Free top-up |
| 每月 | Browser Use Cloud | 每月 10 agent tasks | reset 日、時區、rollover |
| 每日 UTC | Cloudflare Browser Run | Workers Free 每日 10 browser minutes；超限至下一個 UTC day | rollover 不適用／未說 |
| 每日 | You.com free MCP | keyless `you-search` 每日 100 queries | reset 時刻、時區、rollover |
| 持續限速 | Jina Reader | 無 key Reader 20 RPM；Search 無 key blocked；不是月度額度池 | 匿名免費流量的商用條款仍有歧義 |
| 一次性 | Jina welcome key | 首次造訪官網且通過 IP eligibility 時可能取得 10M 非商用 tokens；手動新建 key 預期為 0；不 refresh | welcome tokens 到期日 |
| 一次性 | Hyperbrowser | 5,000 credits 用於 test；耗盡需升級 | 未用額度到期日 |
| 一次性活動包 | Bocha | 公開活動頁列免費 1,000 次；無 reset | 當期可兌領性與效期需登入確認 |

## 應補入：一次性 signup 或 trial

| 服務 | 一次性額度 | 主要限制 | 文章優先度 |
|---|---|---|---|
| [You.com API](https://you.com/docs/administration/billing) | 新帳戶 $100 complimentary API credits，免卡 | 不是月度；Web Search $5/1k calls，Contents $1/1k pages，Research 依 effort 計；用完需加值，auto top-up 為 opt-in | 必補 |
| [SearchAPI.io](https://www.searchapi.io/pricing) | 註冊 100 requests，免卡 | 只有成功 HTTP 200 扣量；官方未寫刷新或到期，因此不能當月度額度 | 建議補 |
| [ScrapingBee](https://www.scrapingbee.com/pricing/) | 1,000 API credits，免卡 | 一般 request 可低至 1 credit；預設 JS rendering 5 credits，代理與特定 API 更高；官方未寫 trial 到期日 | 建議補 |
| [Steel Cloud](https://docs.steel.dev/overview/pricinglimits) | Launch 一次性 $30 usage credits，90 天 | 可扣 browser、proxy、CAPTCHA、Browser Tools；proxy／CAPTCHA 要先存 $10 paid balance 驗證 | 建議補 |
| [Zyte API](https://www.zyte.com/pricing/) | $5 credits，30 天／首個 billing month | 只計成功 response；依網站 tier、HTTP／browser rendering 與附加功能計價；用完或到期 suspended | 原文已有名稱，補完整 |
| [Valyu](https://www.valyu.ai/pricing) | 註冊一次性 $10 credits，免卡；官方文件另稱 work email 可得 $20 | $1=1 credit，Search、Answer、Contents、DeepResearch 共用；Web $1.50/1k retrievals，open databases $0.50/1k，專業資料最高 $30–50/1k；官方 API reference 對計費單位另有 token 字樣，應以回傳 cost 實測 | 建議補 |
| [Hyperbrowser](https://www.hyperbrowser.ai/pricing) | 一次性 5,000 credits，免卡 | 官方 FAQ 說用於測試，耗盡後 Free user 必須升級；未用額度到期日未公開 | 必補 |
| [Bocha／博查](https://aq6ky2b8nql.feishu.cn/wiki/RWdvw557Li3IJekGeLkcDFa3n1f) | 公開活動頁列一次性免費 1,000 次 resource package | 沒有週期性 reset；是否仍可兌領需登入確認；標準 Web Search ¥36/千次，¥3.6/千次只是優惠包 | 建議補，需活動有效性但書 |
| [Jina welcome key](https://github.com/jina-ai/reader/issues/1256) | 首次造訪官網且符合 IP eligibility 時可能自動取得 10M tokens | 非商用、沒有 periodic refresh；手動建立新 key 預期餘額為 0；到期日未公開 | 修正原文 |

## 原文需要更正

- [Bright Data Free Tier](https://docs.brightdata.com/general/account/billing-and-pricing/free-tier)：一般 Free Tier 中 Web Unlocker、SERP、Web Scraper、Scraper Studio 共用每月 5,000 credits，官方明寫每月 1 日 renew。MCP pricing 另寫新 MCP 使用者每月 5,000 requests，但公開頁沒有證明兩者同池或分池；文章不能斷言任一方向。
- [AgentQL Pricing](https://www.agentql.com/pricing)：Starter 除了每月 50 API calls，也已公開列出超額 $0.02/call、10 browser hours 與超額 $0.12/hour。原文「公開頁沒有完整說明 browser hours 重置與超額」需要縮小到只保留「未綁付款方式時的 hard-stop／升級行為不明」。
- [Exa Pricing](https://exa.ai/pricing?tab=api)：可把模糊的「一次性註冊額度」補成一次性 $20，之後每月 $10。
- [Browserbase Plans](https://docs.browserbase.com/account/billing/plans)：Free 可明列 1 browser hour、3 agent calls、1,000 Search、1,000 Fetch 與 3 concurrency，而不是只叫讀者看 dashboard。

## 不放進免費額度主表

- [Perplexity Search API](https://docs.perplexity.ai/docs/getting-started/pricing)：官方明載沒有 complimentary API credits；網頁版 Free／Pro／Max 訂閱不附 API 額度。Search API 為 $5/1,000 successful requests，須先買 prepaid credits；餘額歸零會封鎖 API key，可選擇啟用 auto top-up。可作為「消費版免費不等於 API 免費」的反例。
- [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview)：已停止接受新客戶。既有客戶才有每日 100 queries，超額 $5/1,000，並將於 2027-01-01 停止服務。免費且不限量的 Standard Search Element 是含廣告的前端 JavaScript 元件，不是 agent/backend 可用的 JSON API。
- 自架工具如 SearXNG、Crawl4AI、Qdrant、Meilisearch、Scrapy：應留在自架成本表，不和 SaaS quota 混算。
- 一般付費 scraping／proxy 服務若沒有公開免費額度，只列在延伸清單，不放主比較表。

## 建議文章結構

1. Search API recurring：Exa、Tavily、Firecrawl、Linkup、Brave、SerpAPI、Parallel；另列每日額度的 You.com free MCP。
2. Browser／scrape recurring：Apify、AgentQL API calls、Browserbase、Diffbot、Bright Data、Browserless、Cloudflare Browser Run、ZenRows、Browser Use。對 AgentQL browser hours 與 Bright Data MCP 分別保留週期／共用池但書。
3. 持續限速而非額度池：Jina Reader keyless 20 RPM；Jina Search 不支援匿名呼叫。
4. Signup／trial：Serper、You.com API、SearchAPI.io、Valyu、ScrapingBee、Steel、Zyte、Hyperbrowser、Bocha 活動資源包、Jina welcome key。
5. Self-hosted：保留現有 SearXNG、Crawl4AI、Qdrant 等成本說明。
6. 沒有或不可新申請免費 API：Perplexity、Google Custom Search JSON API；提醒 consumer subscription、前端 Search Element 與後端 API billing 分開。

## 來源讀取程度

- Browserless、Cloudflare、ZenRows、Parallel、You.com、SearchAPI.io、Valyu、Bocha、Perplexity、Google Custom Search、Browser Use、Hyperbrowser、ScrapingBee、Steel、Zyte、Bright Data、AgentQL、Exa、Browserbase：✅ 官方定價／官方文件全文抽取。
- 各服務二手 pricing review：🟡 僅用來交叉檢查，不作主結論依據。
- Perplexity：✅ 官方 Help Center 與 API pricing 文件。

## 尚未確認

- Browser Use Free signup 是否需要付款方式。
- SearchAPI.io、ScrapingBee trial 的精確到期日與零餘額 HTTP 行為。
- Browserless Free 未使用 units 是否 rollover；官方目前只寫每月額度。
- Hyperbrowser 一次性免費 credits 的到期日。
- Bocha 登入後免費 1,000 次資源包今天是否仍可兌領，以及效期。
- Jina 10M welcome tokens 的到期日與匿名 Reader 免費流量的無歧義商用授權。
- Valyu pricing docs 與 Search API reference 對 retrieval／token 計費單位的文字衝突。
