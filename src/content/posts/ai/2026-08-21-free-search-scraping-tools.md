---
title: "免費搜尋與爬取工具怎麼選：月度額度、試用與自架成本"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, search-api, crawler, self-hosted, pricing]
lang: zh-TW
tldr: "免費方案至少分成月度額度、餘額補回、一次性試用與本機自架四種；把它們都寫成 free tier，會直接算錯長期成本。"
description: "整理 Search API、crawler、browser 與抽取工具的免費方案，說明額度重置、超額計費、信用卡與自架成本的差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-free-search-scraping-tools-en)

搜尋、爬取與 browser agent 的定價頁都喜歡寫「Free」。但背後可能是每月重置、只送一次、把餘額補到固定金額，或單純讓你免費下載程式。這四種方案的長期成本完全不同。

本文不評比誰的搜尋品質最好，也不把幾十個工具各介紹一次。它只回答一個更早、也更容易算錯的問題：**你看到的免費，到底能不能在下個月繼續用？**

以下金額與額度查證於 2026 年 8 月 21 日。正式採用前仍應回官方定價頁重查。

## 先把四種「免費」拆開

| 類型 | 實際意思 | 代表例子 | 適合用途 |
|---|---|---|---|
| 月度額度 | 每個帳務週期重新取得固定用量 | [Tavily](https://docs.tavily.com/documentation/api-credits)、[Firecrawl](https://www.firecrawl.dev/pricing)、[SerpAPI](https://serpapi.com/pricing) | 可持續的小流量服務 |
| 餘額補回 | 把剩餘餘額補到某個上限，不是在原餘額上加碼 | [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | 成本封頂的搜尋原型 |
| 一次性試用 | 註冊時送 credit 或限期使用，之後不會恢復 | [Serper](https://serper.dev/)、[Zyte](https://www.zyte.com/pricing/)、[Typesense Cloud](https://cloud-help.typesense.org/article/how-does-the-free-tier-work) | 驗證 API 與做短期 benchmark |
| 本機／自架 | 程式本身可自行執行，沒有廠商 API 帳單 | [SearXNG](https://github.com/searxng/searxng)、[Crawl4AI](https://github.com/unclecode/crawl4ai)、[Qdrant](https://github.com/qdrant/qdrant) | 資料不能外流或用量穩定的工作負載 |

「$0/月」也不一定是第五種免費。有些服務只是沒有固定月費，使用前仍要購買 credits；這比較接近 PAYG 入口，不是每月贈送額度。

## Search API：先看額度會不會回來

如果工作流第一步是把 query 送進搜尋 API，最值得先確認的不是單次價格，而是免費用量的恢復方式。

| 服務 | 公開免費方案 | 關鍵限制 |
|---|---|---|
| [Exa](https://exa.ai/pricing?tab=api) | 每月 10 美元 credits，另有一次性註冊額度 | 不要把註冊額度算進每個月 |
| [Tavily](https://docs.tavily.com/documentation/api-credits) | 每月 1,000 credits，不需信用卡 | endpoint 與 search depth 消耗不同 |
| [Firecrawl](https://www.firecrawl.dev/pricing) | 每月 1,000 credits，不需信用卡 | search、scrape、crawl 共用 credits，未用完不累積 |
| [Linkup](https://docs.linkup.so/pages/documentation/platform/pricing) | 符合資格帳戶每月把 prepaid balance 補回 20 美元 | professional email 與 `eligible accounts` 的完整資格未公開 |
| [Brave Search API](https://brave.com/search/api/) | 每月 5 美元 credits | 要求信用卡作反詐驗證 |
| [Serper](https://serper.dev/) | 註冊一次性 2,500 queries | 不是月度額度；用完需 top-up |
| [SerpAPI](https://serpapi.com/pricing) | 每月 250 searches | 成功的搜尋才計數 |

最容易誤讀的是 Linkup。官方用語是每月把 eligible account 的餘額「top up back to $20」，意思是把餘額補回上限。月底還有餘額時，只會補足差額，不是在原本餘額上再加一筆完整額度。

它採預付餘額，credit 用完會回傳 HTTP 429，而不是直接形成一筆無上限帳單。

另一個陷阱是「一次性用量很大，看起來比月度方案划算」。Serper 的 2,500 queries 確實適合跑第一輪測試，但把一年預算寫成 2,500 × 12 就錯了。評估長期工作流時，trial 只能算導入成本，不能算穩態容量。

## 抓取、抽取與 browser 的免費額度常共用

找到 URL 之後，還可能經過 crawler、正文抽取或遠端 browser。這些服務的免費額度常用不同單位：request、page、credit、browser hour 或成功結果。

| 服務 | 公開免費方案 | 使用前要確認 |
|---|---|---|
| [Apify](https://apify.com/pricing) | 每月 5 美元 platform usage | Actor、proxy、儲存與運算都可能扣同一筆額度 |
| [AgentQL](https://www.agentql.com/pricing) | Starter 每月 50 API calls；trial 另有 300 calls | 公開頁未清楚交代綁卡、hard cap 與 browser hours 重置方式 |
| [Browserbase](https://www.browserbase.com/pricing) | Free plan 列 browser hour、agent runs、Search 與 Fetch 用量 | session concurrency 與各產品額度要按當期 dashboard 確認 |
| [Diffbot](https://www.diffbot.com/pricing) | 每月 10,000 credits，不需信用卡 | 不同 extraction API 的 credit 消耗可能不同 |
| [Jina Reader](https://jina.ai/en-US/reader/) | 無 key 基礎 Reader 有速率限制；新 key 另送一次性 tokens | 一次性 token 不是月度配額 |

AgentQL 正好示範為什麼「Trial」和「Starter」不能合成同一列。300 calls 是試用；長期 $0 Starter 才是每月 50 calls。定價頁也列出 Starter 包含 remote browser hours 與超額單價，卻沒有在公開頁完整說明未綁付款方式時會 hard stop 還是要求升級。正式串進排程前，應先到登入後的 Billing 頁確認 spending cap，而不是從 `$0/monthly` 推論絕對不會收費。

Bright Data 更不能用一個數字代表整個平台。[Web Scraper](https://brightdata.com/pricing/web-scraper) 與 [MCP Server](https://brightdata.com/pricing/mcp-server) 各有自己的免費用量；[官方 billing FAQ](https://docs.brightdata.com/general/account/billing-and-pricing/faqs) 也說明，個人信箱且沒有付款方式時，部分 Proxy 或 Web Unlocker 功能會受限制。某個產品每月免費，不代表同帳戶下所有 proxy 流量都免費。

## 開源免費，是把帳單換到別的地方

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

用 Tavily 做 search、Firecrawl 做 scrape，兩者都提供免信用卡的月度額度。先用 20 個固定問題與 20 個固定 URL 測成功率，不要一開始就接 production traffic。測試檔應保存 query、URL、參數、原始回應與查證日期，才能在供應商改模型後重跑。

### 想把成本封在固定上限

選會在額度用完後 hard stop 的方案，並在自己的 router 再加一層每日預算。不要只靠供應商儀表板：每次呼叫前先檢查 `daily_requests`、`monthly_credits` 與單一任務的 `max_depth`，任一項超標就回傳可辨識的 budget error，交給下一條較便宜的路徑。

```ts
if (budget.monthlyCredits <= 0) return fallback("self-hosted-search");
if (task.depth > 2) return fail("crawl_budget_exceeded");

const result = await provider.search(query);
budget.record(result.usage);
return result;
```

### 資料不能外流

用 [SearXNG](/posts/ai/2026-08-21-searxng-complete-guide) 找公開頁面、[Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide) 抓取內容，再把內部文件放進 Meilisearch 或 Qdrant。這條路沒有供應商 API quota，但要自己定義 crawl budget、來源權限、刪除傳播與備份。本站的 [SearXNG＋Crawl4AI 組合指南](/posts/ai/2026-08-21-searxng-crawl4ai-setup) 處理公開網路取得；私有語料則不應直接混入同一個未做 ACL 的索引。

## 選免費方案前，實際做這六個檢查

1. 找到官方定價頁上的 `/month`、trial 期限與 credit 到期日。
2. 確認額度是增加固定值，還是只補回固定餘額。
3. 確認失敗請求、retry 與 timeout 是否計費。
4. 確認用完是 429、停止服務，還是自動進入 PAYG。
5. 確認是否必須綁卡，以及能否設定 hard spending cap。
6. 把查證日期存進技術決策紀錄；上線前與每季重新檢查一次。

真正可持續的免費方案，不是額度最大的那個，而是**恢復規則、超額行為與成本單位都能被程式控制**的那個。搜尋品質仍要另外跑 benchmark；定價表只能回答能不能負擔，不能回答結果能不能用。

## 參考資料

- [Exa Pricing](https://exa.ai/pricing?tab=api)
- [Tavily API Credits](https://docs.tavily.com/documentation/api-credits)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing)
- [Linkup Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Brave Search API](https://brave.com/search/api/)
- [Serper Pricing](https://serper.dev/)
- [SerpAPI Pricing](https://serpapi.com/pricing)
- [Apify Pricing](https://apify.com/pricing)
- [AgentQL Pricing](https://www.agentql.com/pricing)
- [Browserbase Pricing](https://www.browserbase.com/pricing)
- [Diffbot Pricing](https://www.diffbot.com/pricing)
- [Jina Reader](https://jina.ai/en-US/reader/)
- [Bright Data Billing and Pricing FAQ](https://docs.brightdata.com/general/account/billing-and-pricing/faqs)
- [SearXNG repository](https://github.com/searxng/searxng)
- [Crawl4AI repository](https://github.com/unclecode/crawl4ai)
- [Qdrant repository](https://github.com/qdrant/qdrant)
