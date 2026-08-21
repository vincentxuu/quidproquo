---
title: "Tavily 和 Exa 沒有地端版：自己組一套搜尋堆疊要付出什麼"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, self-hosted, searxng, crawl4ai, open-source, tavily, exa]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 2
tldr: "Tavily 和 Exa 都是純雲端 API，沒有自架版本。能自己組的是 SearXNG（269 個上游引擎、82 個預設開啟）+ Crawl4AI（78.8k stars、Apache-2.0），現成的 Tavily 相容 wrapper 都還是幾十顆星的個人專案，不建議直接用。但 SearXNG 沒有自己的索引，而且從機房 IP 跑會被搜尋引擎打成空結果——這兩件事決定了自架划不划算。"
description: "為什麼 Tavily / Exa 沒有地端部署選項，以及 SearXNG + Crawl4AI 這套自架替代方案的實際組成、現成 wrapper 為什麼還不能用、想複製 Exa 自建索引的開源專案現況，還有機房 IP 被封這個最常翻車的坑。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-self-hosted-search-stack-en)

[系列前一篇](/posts/ai/2026-05-07-ai-search-mcp-tools)把 agent 能接的搜尋 MCP 服務比了一輪，但整篇有個沒說破的前提：那些全部是雲端 API，你的每一次查詢都會經過別人的伺服器，而且按次計費。這篇處理另一半——如果不想付錢、或資料不能外流，能不能自己架一套？

短答：**Tavily 和 Exa 都沒有自架版本**，但它們的能力可以用開源元件拼出七成。剩下三成拼不出來，而且拼不出來的部分正好是它們最貴的地方。

## 先講結論

| 你想要的 | 地端可行性 |
|---|---|
| Tavily 那種「查了就回乾淨結果」的 API 介面 | ✅ 容易，一個 `docker compose` |
| 語意排序，不要一堆 SEO 垃圾 | ✅ 容易，本地小模型就夠 |
| Exa 那種自建索引 + 神經檢索 | ⚠️ 有開源同構品，規模差幾個數量級 |
| 全網覆蓋 + 持續重爬的新鮮度 | ❌ 複製不了 |

## 官方確實沒有地端方案

Exa 的 Enterprise 方案給的是 custom index、自訂 rate limit、SLA、SOC 2 與 Zero Data Retention——全部還是跑在 Exa 的雲上，只是合約層級承諾不留存你的查詢。第三方評測寫得更直接：

> Deployment & Data Residency: A hosted SaaS API with no self hosted or on premises option, but customizable zero data retention lets regulated buyers control how long queries and data persist.
> —— Agentic Index, Exa Review, 2026-06-30

Tavily 同樣是 API-only，公開文件裡沒有自架路徑。

原因寫在 Exa 自己的首頁上：他們宣稱「crawl billions of documents per day」、向量資料庫要撐「10k+ QPS」，並且「on track to exceed Google-scale traffic and index size in 2027」。那個東西本來就不是能塞進你機房的形狀。**你談得到的只有合約層級的資料不落地，談不到機器在自己手上。**

## 第一層：SearXNG + 抓取器 = 自己的 Tavily

生態圈已經有一整批專案在做這件事，架構高度一致：**SearXNG 負責找、某個抓取器負責讀、FastAPI 包成 Tavily 相容的 `/search` 與 `/extract`**。

SearXNG 是這套的核心。依官方文件（2026.8.20 build）：

> SearXNG supports 269 search engines of which 82 are enabled by default.

也就是說它自己不做索引，而是把查詢分發給 Google、Bing、DuckDuckGo、Brave、Mojeek 這些上游，再把結果去重合併。35.8k stars、AGPL-3.0。

抓取那端最常見的搭配是 [Crawl4AI](https://github.com/unclecode/crawl4ai)（78,805 stars、Apache-2.0），Python + Playwright，抓回來直接吐 Markdown：

```python
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com",
            config=CrawlerRunConfig(cache_mode=CacheMode.BYPASS, scan_full_page=True),
        )
        print(result.markdown)

asyncio.run(main())
```

安裝要記得跑 `crawl4ai-setup`，它負責裝 Playwright 瀏覽器；漏了這步第一次 `arun()` 會直接找不到 Chromium。版型固定的站台用 `JsonCssExtractionStrategy` 寫 CSS schema，零 token 成本；版型不固定才上 `LLMExtractionStrategy`，而且 provider 可以指向 Ollama，讓整條鏈路都不出網段。

另一個選擇是自架 [Firecrawl](https://docs.firecrawl.dev/contributing/self-host)（170k stars、AGPL-3.0），但官方自架文件把閹割講得很白：

> Screenshots or page actions: Not available in the default stack. Fetch and Playwright both report no support; both require Fire-engine.

反爬蟲的 Fire-engine、截圖、page actions 都不在預設 stack 裡。授權也是考量——AGPL 表示你的整合程式碼若對外提供服務也得開源，這點在[爬蟲工具全景圖](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)那篇有更完整的比較。

### 現成的 wrapper 還不成熟

搜尋 GitHub 會找到一批把整套包好的「Tavily 開源替代品」，但**這一層目前普遍不成熟**——多數是個位數到數十顆星的個人專案，沒有第二個維護者，看架構可以，放進正式環境不行。

比較有樣子的是 [searcharvester](https://github.com/vakovalskii/searcharvester)（256 stars、AGPL-3.0），一行 `docker compose up` 起 SearXNG + trafilatura，額外提供 `/research` 深度研究端點，有預先建好的 GHCR image。即使如此，256 stars 仍然代表你要有自己接手維護的準備。

反過來看，底層元件都是社群夠大的東西——SearXNG（35.8k）、Crawl4AI（78.8k）、[trafilatura](https://github.com/adbar/trafilatura)（6,673 stars、Apache-2.0）。**把這三個黏起來的膠水程式碼不到三百行，自己寫反而比依賴一個隨時會停更的 wrapper 可控。**

## 第二層：想複製 Exa 的自建索引

Exa 真正的差異不在 API 形狀，而在它有自己爬的索引、用 embedding 做語意檢索。開源世界確實有同構品，但現況要先看清楚：

- **[DawnSearch](https://github.com/dawn-search/dawnsearch)**：設計上最像——索引 Common Crawl、用 all-MiniLM-L6-v2 產 embedding、USearch 做向量檢索、Rust 寫的分散式 P2P。但 **14 stars，最後一次 push 停在 2023-08-14**，已經是死專案，只能當設計參考。
- **[Marginalia Search](https://github.com/MarginaliaSearch/MarginaliaSearch)**（1,917 stars、Java）：活的，2026-07 還在更新。它明確支援跑成你自己的白牌搜尋引擎——官方 README 說「can both be run as a copy of Marginalia Search, or as a white-label search engine for your own data」。硬體門檻寫得很誠實：32GB RAM 跑得動，但正式規模要企業級 SSD 加額外數 TB 硬碟存爬取資料。
- **[YaCy](https://github.com/yacy/yacy_search_server)**（4,013 stars）：老牌 P2P 搜尋引擎，也能關掉網路只查本地索引，當純內網搜尋設備用。

共同的硬限制是**新鮮度**。Common Crawl 是快照，自己爬則受限於你的頻寬與 IP。你會得到一個語意檢索還可以、但內容是舊的索引——而 Exa 的核心賣點恰好是持續重爬。**自架版本最先掉的東西，正是你想買的東西。**

## 兩個決定划不划算的坑

**SearXNG 沒有自己的索引。** 它是元搜尋，實際上還是去打 Google 和 Bing。所以「地端」保證的是：查詢不經過 Tavily / Exa、不計費、不限量——**上游搜尋引擎還是看得到你的查詢字串**。如果你的動機是「查詢內容不能外流」，這套解不了，那種需求要走的是自建語料庫。

**機房 IP 會被打死。** 這是實務上最常翻車的地方。有人把兩種部署都跑過之後寫下這段：

> Search engines treat datacenter IPs as presumed-guilty. From a hyperscaler range (AWS, GCP, the big Hetzner/OVH pools) SearXNG starts handing back empty results within a handful of queries; from a residential IP you look like a person.
> —— Jingbiao, "Giving an Agent a Search Engine It Actually Owns", 2026-06-20

放家裡一台小主機（mini-PC、NAS）配住宅 IP，比放雲端順很多。硬要放雲上就要準備 residential proxy 的預算與維護成本，這筆常常比 Tavily 的 API 帳單還貴。抓取端同理，被擋住之後怎麼處理另見[繞過 Cloudflare 反爬蟲那篇](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent)。

## 整體架構

```
                  ┌─────────────┐
  查詢 ──────────▶│  你的 API    │  Tavily 相容 /search /extract
                  └──────┬──────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
     ┌─────────────┐          ┌──────────────┐
     │  SearXNG    │          │  Crawl4AI    │
     │ 269 引擎    │          │  Playwright  │
     └──────┬──────┘          └──────┬───────┘
            │                        │
            ▼                        ▼
   Google / Bing / DDG …      目標網站（吐 Markdown）
   ⚠ 查詢仍會外流             ⚠ 機房 IP 易被擋

            └────────┬───────────────┘
                     ▼
            本地 reranker（FlashRank / model2vec）
                     ▼
            可選：Ollama 產摘要，全程不出網段
```

## 整體來說

自架划算與否，取決於你的動機是哪一個：

- **只是不想付錢、不想被限額** → SearXNG + Crawl4AI，放住宅 IP 的一台小機器，這是 CP 值最高的組合。
- **想要語意排序的體感** → 加一個本地 reranker 就有八成，不需要模仿 Exa 的規模。
- **資料不能外流** → 自架搜尋救不了你，因為查詢還是會到上游引擎。該做的是對自己的語料建索引。
- **要打難搞的反爬站台、要穩定 SLA** → 老實付錢。Exa Enterprise 的 ZDR + DPA 對多數合規要求已經夠用，自架反而要自己扛 proxy 與封鎖。

一句話總結這篇的取捨：**你可以擁有介面，可以擁有抓取，但擁有不了那個索引。** 想清楚自己要的是哪一層，再決定要不要開這個 docker compose。

下一篇回到工具本身，看[爬蟲工具全景圖](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)怎麼在 34 個開源專案裡選；把這些接成完整研究流程的做法，則在[Local Deep Research 導讀](/posts/ai/2026-05-08-local-deep-research-walkthrough)。

## 參考資料

- [Crawl4AI](https://github.com/unclecode/crawl4ai) — 78,805 stars、Apache-2.0（2026-08-21 查詢）
- [SearXNG](https://github.com/searxng/searxng) — 35,834 stars、AGPL-3.0
- [SearXNG Configured Engines](https://docs.searxng.org/user/configured_engines.html) — 269 個引擎、82 個預設開啟
- [Firecrawl 自架文件](https://docs.firecrawl.dev/contributing/self-host) — 自架版功能限制對照表
- [trafilatura](https://github.com/adbar/trafilatura) — 內文抽取函式庫
- [searcharvester](https://github.com/vakovalskii/searcharvester) — Tavily 相容自架 API（256 stars、AGPL-3.0）
- [Marginalia Search](https://github.com/MarginaliaSearch/MarginaliaSearch) — 可自架的白牌搜尋引擎
- [YaCy](https://github.com/yacy/yacy_search_server) — P2P 搜尋引擎與內網搜尋設備
- [DawnSearch](https://github.com/dawn-search/dawnsearch) — Common Crawl 語意檢索（2023 停更）
- [Exa Pricing](https://exa.ai/pricing) — 費率與 Enterprise 方案內容
- [Exa Enterprise](https://exa.ai/enterprise) — custom index 與部署說明
- [Agentic Index: Exa Review](https://agenticindex.io/vendors/exa) — 第三方部署選項評測
- [Giving an Agent a Search Engine It Actually Owns](https://jingbiao.me/2026/06/20/online-research/) — 機房 IP 與住宅 IP 的實測差異
- 站內：[AI Agent 接搜尋 MCP 工具](/posts/ai/2026-05-07-ai-search-mcp-tools)
- 站內：[AI 爬蟲工具全景圖](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)
- 站內：[AI Agent 繞過 Cloudflare 反爬蟲完整指南](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent)
- 站內：[Local Deep Research 導讀](/posts/ai/2026-05-08-local-deep-research-walkthrough)
