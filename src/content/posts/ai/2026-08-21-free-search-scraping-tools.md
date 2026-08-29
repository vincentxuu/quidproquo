---
title: "免費搜尋、爬取與 Browser API 怎麼選：週期額度、限速、試用與自架成本"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, search-api, crawler, self-hosted, pricing]
lang: zh-TW
tldr: "免費不只分月度與試用：還有每日額度、餘額補回、持續限速、一次性 credits，以及根本沒有 API 免費額度的 PAYG。"
description: "整理 Search API、crawler、browser 與抽取工具的週期額度、持續限速、一次性試用及自架成本，並核對重置、超額與綁卡規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-free-search-scraping-tools-en)

搜尋、爬取與 browser agent 的定價頁都喜歡寫「Free」。但背後可能是每天或每月恢復、只把餘額補到固定上限、只限制 RPM、註冊時送一次，或單純讓你免費下載程式。這些方案的長期成本完全不同。

本文不評比誰的搜尋品質最好，也不把幾十個工具各介紹一次。它只回答一個更早、也更容易算錯的問題：**你看到的免費，到底能不能在下一個週期繼續用？**

資料首次整理於 2026 年 8 月 21 日，本文於 2026 年 8 月 22 日依官方定價頁、文件與公開方案資料更新。正式採用前仍應回官方頁與登入後 Billing 畫面重查。

## 先判斷免費額度屬於哪一種

| 類型 | 判斷方式 | 代表例子 | 適合用途 |
|---|---|---|---|
| 週期額度 | 官方明寫 daily、monthly 或 billing cycle | [Tavily](https://docs.tavily.com/documentation/api-credits)、[SerpAPI](https://serpapi.com/pricing)、[Cloudflare Browser Run](https://developers.cloudflare.com/browser-rendering/pricing/) | 可持續的小流量服務 |
| 餘額補回 | 把餘額補到上限，不是固定再加一筆 | [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | 成本封頂的搜尋原型 |
| 持續限速 | 沒有每月 credit pool，只限制 RPM／QPS | [Jina Reader](https://jina.ai/en-US/reader/) | 低流量正文讀取 |
| 一次性試用 | signup／trial credits 用完不恢復 | [Serper](https://serper.dev/)、[You.com API](https://you.com/docs/administration/billing)、[Hyperbrowser](https://www.hyperbrowser.ai/pricing) | API 驗證與短期 benchmark |
| 本機／自架 | 沒有 SaaS quota，成本轉成主機、proxy 與維運 | [SearXNG](https://github.com/searxng/searxng)、[Crawl4AI](https://github.com/unclecode/crawl4ai)、[Qdrant](https://github.com/qdrant/qdrant) | 私有資料或穩定的大量工作負載 |

`$0` 不代表有免費 API 額度，Free plan 也不代表 quota 會每月恢復。只有官方明寫週期，才能把它算進穩態容量；沒有明文就記成 unknown，而不是自行乘以 12。

## Search API 與 MCP：先看額度會不會回來

| 服務 | 官方公開額度 | 卡、重置與超額行為 |
|---|---|---|
| [Exa](https://exa.ai/pricing?tab=api) | 註冊一次性 20 美元，之後每月 10 美元 credits | 免付款方式；reset 日、時區與 rollover 未公開 |
| [Tavily](https://docs.tavily.com/documentation/api-credits) | 每月 1,000 credits | 免卡；endpoint 與 search depth 消耗不同；精確 reset 日與 rollover 未公開 |
| [Firecrawl](https://www.firecrawl.dev/pricing) | 每月 1,000 credits | 免卡；Search、Scrape、Crawl 共用 credits；Free 不 rollover，沒有一般 PAYG，需升級 |
| [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | professional email 註冊時取得 20 美元；eligible account 每月把餘額補回 20 美元 | 預付餘額，歸零回 HTTP 429；資格與 top-up 日期未完整公開 |
| [Brave Search API](https://brave.com/search/api/) | 每月自動套用 5 美元 credits | 要求付款卡作反詐驗證；超額走 PAYG；rollover 未公開 |
| [SerpAPI](https://serpapi.com/pricing) | 每個 billing cycle 250 次成功搜尋 | 新 cycle 開始時重置；cached、failed、errored 不扣；Free rollover 未公開 |
| [Parallel](https://parallel.ai/blog/free-tier-parallel) | eligible organization 每月 5 美元 credits | 必須綁卡；月底失效、不 rollover；超額按標準費率扣卡 |
| [You.com free MCP](https://you.com/docs/quickstart) | keyless `you-search` 每日 100 queries | 只含 Search，不含 Contents、Research、Finance；reset 時刻與時區未公開 |
| [Keenable](https://keenable.ai/pricing) | 每月 100K free requests；keyless endpoint 另限 1,000 req/hour + 10 req/sec per IP | 免卡；Search 與 Fetch 共用同一 allowance；keyless pool 是 shared per-IP，不適合 production；精確 reset 日未公開 |

Linkup 最容易誤讀。官方寫的是每月把 eligible account 的餘額 `top up back to $20`，意思是補回上限，不是每月固定再送 20 美元。補值發生時若仍有 7 美元，只補 13 美元；官方沒有公開精確 top-up 日期，因此也不該擅自寫成「月底結算」。

Parallel 則是另一種風險：每月贈送額度是真的，但必須綁卡，超過 5 美元後會按標準費率扣款。週期性免費不等於 hard stop，router 仍要有自己的 spending cap。

## Browser／scrape：同樣是 credits，成本單位完全不同

| 服務 | 官方公開額度 | 最重要限制 |
|---|---|---|
| [Apify](https://apify.com/pricing) | 每月 5 美元 prepaid platform usage | Actor、proxy、storage、compute 共用；未用額度在週期結束時失效 |
| [AgentQL](https://www.agentql.com/pricing) | Starter 每月 50 API calls；另列 10 browser hours | 公開超額價為每 call 0.02 美元、每 browser hour 0.12 美元；未綁付款方式時的 hard stop／升級行為不明 |
| [Browserbase](https://docs.browserbase.com/account/billing/plans) | monthly allocation 含 1 browser hour、3 Agents、1,000 Search、1,000 Fetch；3 concurrency | reset 日、rollover 與 Free 耗盡行為未公開 |
| [Diffbot](https://www.diffbot.com/pricing) | 每個 billing period 10,000 credits | 新 billing period 開始時重置；不同 API 消耗不同；Free 用盡回 429 |
| [Bright Data Free Tier](https://docs.brightdata.com/general/account/billing-and-pricing/free-tier) | 一般 Free Tier 每月 5,000 credits，每月 1 日 renew | Web Unlocker、SERP、Web Scraper、Scraper Studio 共用一般池；[MCP](https://brightdata.com/pricing/mcp-server) 另列每月 5,000 requests，但官方沒有證明兩者同池或分池 |
| [Browserless](https://www.browserless.io/pricing) | 每月 1,000 units、2 concurrent browsers、單次最多 1 分鐘 | 每個 browser connection 每 30 秒 1 unit；住宅代理 6 units/MB、資料中心代理 2 units/MB、成功 CAPTCHA 10 units；rollover 與 Free 耗盡行為未公開 |
| [Cloudflare Browser Run](https://developers.cloudflare.com/browser-rendering/pricing/) | Workers Free 每個 UTC day 10 browser minutes；3 concurrency | 用完回 429，下一個 UTC day 恢復；Paid 含每月 10 小時，之後 0.09 美元／小時，session concurrency 另計 |
| [ZenRows](https://www.zenrows.com/pricing) | 每月 5,000 credits；5 concurrency | 免卡、monthly refresh、不 rollover、Free 不可 top-up；Fetch 1、JS 5、premium proxy 10、兩者並用 25 credits |
| [Browser Use Cloud](https://browser-use.com/pricing) | 每月 10 agent tasks；3 concurrent sessions | 後續可 top-up／PAYG；browser、proxy、token 另計；一般 Free signup 是否需要付款方式未公開 |

Browserless 很適合說明為什麼不能只比 headline quota。它的 1,000 units 不是 1,000 個任意請求。連線時間、proxy 流量與 CAPTCHA 都可能從同一單位換算，所以短 session 與高流量工作負載的實際容量差很多。

Bright Data 也不能用一句「各產品都有 5,000」帶過。一般 Free Tier 的多個 scraping 產品共用一池；MCP 頁面則用 `requests` 描述自己的月度方案。公開文件尚未交代兩者是否共用，因此正式接入時應以登入後帳單與 usage 回應為準。

## 一次性 credits 只能算導入預算

| 服務 | 一次性額度 | 用完、到期或其他限制 |
|---|---|---|
| [Serper](https://serper.dev/) | 註冊 2,500 queries | 不是月度；用完需 top-up |
| [You.com API](https://you.com/docs/administration/billing) | 新帳戶 100 美元 complimentary API credits，免卡 | 不是月度；用完加值；auto top-up 是 opt-in，和每日 100 次的 keyless MCP 分開 |
| [SearchAPI.io](https://www.searchapi.io/pricing) | 註冊 100 次成功 requests，免卡 | 只有 HTTP 200 扣量；refresh、expiry 與零餘額 HTTP 行為未公開 |
| [ScrapingBee](https://www.scrapingbee.com/pricing/) | 1,000 API credits，免卡 | JS rendering 預設 5 credits，proxy 與特定 API 可能更高；到期日未公開 |
| [Steel Cloud](https://docs.steel.dev/overview/pricinglimits) | 30 美元 usage credits，有效 90 天 | browser、proxy、CAPTCHA、Browser Tools 共用；使用 proxy／CAPTCHA 前要先存入 10 美元 paid balance 驗證 |
| [Zyte API](https://www.zyte.com/pricing/) | 5 美元，限 30 天／第一個 billing month | 只計成功 response；用完或到期後 suspended |
| [Valyu](https://www.valyu.ai/pricing) | 官網列註冊 10 美元，官方文件另稱 work email 20 美元；免卡 | Search、Answer、Contents、DeepResearch 共用；官方文件對 retrieval／token 計費單位有衝突，應以 API 回傳 cost 實測 |
| [Hyperbrowser](https://www.hyperbrowser.ai/pricing) | 5,000 credits，免卡 | 官方 FAQ 明寫用於測試；耗盡後 Free user 必須升級；未用額度到期日未公開 |
| [Bocha／博查](https://aq6ky2b8nql.feishu.cn/wiki/RWdvw557Li3IJekGeLkcDFa3n1f) | 公開活動頁列一次性免費 1,000 次 resource package，活動口令可再兌換一包 | 沒有週期性 reset；今天是否仍可兌領及效期需登入確認。標準 Web Search 是人民幣 36 元／千次，3.6 元／千次是優惠 resource package |

一次性額度再大，也不能拿來算穩態容量。Serper 的 2,500 queries、Hyperbrowser 的 5,000 credits 與 You.com 的 100 美元，都適合跑第一輪驗證；把它們乘以 12，只會得到不存在的年度預算。

## 持續限速、沒有免費 API，別混進 quota 表

[Jina Reader](https://jina.ai/en-US/reader/) 不帶 key 可持續使用，但限制為 20 RPM；Jina Search 不支援匿名呼叫。首次造訪官網且符合 IP eligibility 時，網站可能自動產生含 10M 非商用 tokens 的 key；[官方維護者說明](https://github.com/jina-ai/reader/issues/1256)手動新建 key 預期為 0。這筆 welcome balance 不會週期性刷新，到期日則未公開。

[Perplexity Search API](https://docs.perplexity.ai/docs/getting-started/pricing) 沒有 complimentary API credits。網頁版 Free、Pro、Max 訂閱不附 API 額度；Search API 為每 1,000 次成功 requests 5 美元，必須先購買 prepaid credits，餘額歸零後 API key 會被封鎖。

[Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview) 已停止接受新客戶。既有客戶才保留每天 100 queries，並將於 2027 年 1 月 1 日停止服務。Google 仍提供免費、含廣告的 Standard Search Element，但那是前端 JavaScript widget，不是 agent 可以從後端呼叫的 JSON API。

[TinyFish Search/Fetch](/posts/ai/2026-08-29-tinyfish-search-fetch-free-tier) 也是同样的持續限速路線：Search 30 requests/min、Fetch 150 URLs/min，Wallet 餘額 $0 仍可用，失敗的 Fetch 不計額。它和 Jina 的差別在於機器渲染後的乾淨 Markdown 與 batch selector 抽取，更適合喂進 context window。

[AutoScraper](https://github.com/alirezamika/autoscraper)、[Trafilatura](https://github.com/adbar/trafilatura) 與 [Readability](https://github.com/mozilla/readability) 沒有「每月 API 額度」，因為它們本來就是在自己的環境執行的 library。[Scrapy](https://github.com/scrapy/scrapy)、SearXNG、Crawl4AI、Qdrant 與 Meilisearch 也是同一類，只是負責的層次不同。

這不等於零成本。自架工作流至少要算五筆帳：

1. 主機、儲存與備份。
2. browser 的 CPU／記憶體與並行容量。
3. proxy、CAPTCHA 或遠端 browser。
4. LLM extraction 與 embedding 的模型運算。
5. 版本升級、告警與失敗重跑的維運時間。

對每天只查幾十次的小工具，SaaS 免費額度通常比維護一台主機便宜。對資料不能外流、每天固定大量抓取，或已經有 Kubernetes／VM 維運能力的團隊，自架才可能在成本與控制權上占優勢。

## 三種可以直接採用的起步方式

### 只想驗證需求，不綁信用卡

用 Tavily 做 Search、Firecrawl 做 Scrape，兩者都有免卡的月度額度；若需要遠端 browser，可再用 Browserless 的月度 units 做小量測試。先用 20 個固定問題與 20 個固定 URL 測成功率，不要一開始就接 production traffic。保存 query、URL、參數、原始回應與查證日期，供應商改模型後才能重跑。

### 想把成本封在固定上限

只有官方明載 hard stop，或你已在登入後 Billing 驗證 spending cap 時，才能把方案當成成本上限。Parallel 與 Brave 可能進入 PAYG，不能只看免費額度。自己的 router 仍應在每次呼叫前檢查 `daily_requests`、`monthly_credits` 與單一任務的 `max_depth`，任一項超標就改走較便宜的路徑。

```ts
if (budget.monthlyCredits <= 0) return fallback("self-hosted-search");
if (task.depth > 2) return fail("crawl_budget_exceeded");

const result = await provider.search(query);
budget.record(result.usage);
return result;
```

### 資料不能外流

用 [SearXNG](/posts/ai/2026-08-21-searxng-complete-guide) 找公開頁面、[Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide) 抓取內容，再把內部文件放進 Meilisearch 或 Qdrant。這條路沒有供應商 API quota，但要自己定義 crawl budget、來源權限、刪除傳播與備份。本站的 [SearXNG＋Crawl4AI 組合指南](/posts/ai/2026-08-21-searxng-crawl4ai-setup) 處理公開網路取得；私有語料不應直接混入同一個未做 ACL 的索引。

## 選免費方案前，實際做這六個檢查

1. 找到官方對 daily、monthly 或 billing cycle 的明文；沒有就把 reset 記成 unknown。
2. 確認額度是固定增加、補回上限、持續限速，還是只送一次。
3. 確認失敗 request、retry、timeout、proxy 與 browser time 如何扣量。
4. 確認用完是 429、停止服務、要求升級，還是自動進入 PAYG。
5. 確認是否必須綁卡、能否設定 hard spending cap，以及未用額度是否 rollover。
6. 保存來源 URL、查證日期與官方原句；上線前與每季重新檢查。

真正可持續的免費方案，不是額度最大的那個，而是**恢復規則、超額行為與成本單位都能被程式控制**的那個。搜尋品質仍要另外跑 benchmark；定價表只能回答能不能負擔，不能回答結果能不能用。

## 更新紀錄

- 2026-08-22：將週期額度、持續限速與一次性 trial 分表，補入 Search、browser 與 scraping 服務。
- 2026-08-22：將 Hyperbrowser 5,000 credits 更正為一次性，並修正 Exa、Linkup、AgentQL、Browserbase、Bright Data 與 Jina 的額度說明。
- 2026-08-22：加入 Perplexity 與 Google Custom Search JSON API 反例，避免把 consumer plan 或前端 widget 當成免費 API。

## 參考資料

### Search API 與 MCP

- [Exa Pricing](https://exa.ai/pricing?tab=api)
- [Tavily API Credits](https://docs.tavily.com/documentation/api-credits)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing)
- [Linkup Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Brave Search API](https://brave.com/search/api/)
- [SerpAPI Pricing](https://serpapi.com/pricing)
- [Parallel Pricing](https://parallel.ai/pricing)
- [Parallel Free Tier Mechanics](https://parallel.ai/blog/free-tier-parallel)
- [You.com Quickstart and Free MCP](https://you.com/docs/quickstart)

### Browser、Scrape 與持續限速

- [Apify Pricing](https://apify.com/pricing)
- [AgentQL Pricing](https://www.agentql.com/pricing)
- [Browserbase Plans](https://docs.browserbase.com/account/billing/plans)
- [Diffbot Pricing](https://www.diffbot.com/pricing)
- [Diffbot Credits](https://www.diffbot.com/docs/credits)
- [Bright Data Free Tier](https://docs.brightdata.com/general/account/billing-and-pricing/free-tier)
- [Bright Data MCP Pricing](https://brightdata.com/pricing/mcp-server)
- [Browserless Pricing](https://www.browserless.io/pricing)
- [Browserless Unit Consumption](https://docs.browserless.io/overview/unit-consumption)
- [Cloudflare Browser Run Pricing](https://developers.cloudflare.com/browser-rendering/pricing/)
- [Cloudflare Browser Rendering Limits](https://developers.cloudflare.com/browser-rendering/platform/limits/)
- [ZenRows Pricing](https://www.zenrows.com/pricing)
- [Browser Use Cloud Pricing](https://browser-use.com/pricing)
- [Jina Reader](https://jina.ai/en-US/reader/)
- [Jina Reader Issue #1256](https://github.com/jina-ai/reader/issues/1256)

### 一次性試用與反例

- [Serper](https://serper.dev/)
- [You.com API Billing](https://you.com/docs/administration/billing)
- [SearchAPI.io Pricing](https://www.searchapi.io/pricing)
- [ScrapingBee Pricing](https://www.scrapingbee.com/pricing/)
- [ScrapingBee API Credit Cost](https://www.scrapingbee.com/documentation/#api-credit-cost)
- [Steel Pricing and Limits](https://docs.steel.dev/overview/pricinglimits)
- [Zyte Pricing](https://www.zyte.com/pricing/)
- [Zyte API Pricing Details](https://docs.zyte.com/zyte-api/pricing.html)
- [Valyu Pricing](https://www.valyu.ai/pricing)
- [Hyperbrowser Pricing](https://www.hyperbrowser.ai/pricing)
- [Hyperbrowser Credit Rules](https://www.hyperbrowser.ai/docs/pricing)
- [Bocha 免費資源包](https://aq6ky2b8nql.feishu.cn/wiki/RWdvw557Li3IJekGeLkcDFa3n1f)
- [Bocha API 定價](https://aq6ky2b8nql.feishu.cn/wiki/JYSbwzdPIiFnz4kDYPXcHSDrnZb)
- [Perplexity API Pricing](https://docs.perplexity.ai/docs/getting-started/pricing)
- [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview)

### 自架工具

- [SearXNG repository](https://github.com/searxng/searxng)
- [Crawl4AI repository](https://github.com/unclecode/crawl4ai)
- [Qdrant repository](https://github.com/qdrant/qdrant)
