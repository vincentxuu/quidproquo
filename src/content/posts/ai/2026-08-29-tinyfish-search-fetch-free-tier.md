---
title: "TinyFish 介紹：為 AI Agent 設計的免費 Search 與 Fetch 基礎設施"
date: 2026-08-29
category: ai
tags: ["tinyfish", "web-scraping", "search-api", "fetch-api", "ai-agent"]
lang: zh-TW
tldr: "TinyFish 為 AI agent 提供四個 Web API——Search、Fetch、Agent、Browser，其中 Search 與 Fetch 為 $0 永久免費且免信用卡，適合做 RAG 與文件檢索的預設層。"
description: "介紹 TinyFish 的定位與四個 API，深入解析 Search 與 Fetch 的設計、免費層邊界、程式碼範例，以及與 Firecrawl、Tavily 等方案的取捨。"
series:
  name: "搜尋與爬取實戰"
  order: 15
draft: false
---

> English version: [TinyFish: Free Search and Fetch Infrastructure for AI Agents](/en/posts/ai/2026-08-29-tinyfish-search-fetch-free-tier-en)

AI agent 幾乎每個任務都從兩件事開始：找對網址、把頁面讀乾淨。TinyFish 就是為這兩個原語打造的基礎設施——它在 2026 年 5 月把最常用的 Search 與 Fetch 改為對所有開發者與 agent 免費，支援 REST API、MCP、Python/TS SDK、CLI 與 n8n/Dify 等整合，一組 `X-API-Key` 就能用。這篇從工具介紹出發，帶你看懂它在解什麼問題、怎麼設計、怎麼用，以及什麼時候該選它而不是 Firecrawl 或自建 Playwright。

## TinyFish 在做什麼

一句話：把「瀏覽」做成免費的基礎設施，把「自動化」做成付費的加值層。官方說法是 `fundamental things shouldn't cost you money`，所以把 agent 最頻繁呼叫的兩個能力抽出來，不計費、不扣 Wallet，只做速率限制。

平台對外提供四個端點，層級由淺到深：

- **Search**：找網址。`GET https://api.search.tinyfish.ai`，回 rank-stable 的結構化 JSON（title/snippet/url/position），支援 `location`/`language`、`include_domains`/`exclude_domains`、`recency_minutes`/`after_date`/`before_date`、`domain_type`（web/news/research_paper）與 `purpose` 意圖參數。
- **Fetch**：讀頁面。`POST https://api.fetch.tinyfish.ai`，把 URL 丟進自建 Chromium 叢集做完整渲染，去除 nav/cookie banner/script 後回乾淨的 `markdown`/`html`/`json`，支援 batch（單次最多 10 URLs）、`ttl` 快取、`include_selectors`/`exclude_selectors` 範圍抽取、conditional request（`etag`/`last_modified`）。
- **Agent**：代操作。給一個 URL 與自然語言 `goal`，讓雲端 agent 去點擊、填表、登入並回結構化結果，依 step 計費。
- **Browser**：代管瀏覽器。開一個可遠端操控的瀏覽器會話（Playwright/CDP），適合需要登入態與反 bot 的長流程，依分鐘計費。

這篇聚焦在前兩個免費端點，因為它們已能覆蓋 RAG 檢索、文件查核、價格監控等大多數 agent 的日常需求。

## 設計哲學：為何免費、為何是速率限制

與常見的「每月 1,000 credits」不同，TinyFish 選擇 `per-minute 速率` 作為免費層的邊界，論文與官方文件有三個一致的理由：

1. **基礎能力不該收費**：Search 是 entry point，所有 agent 任務都從它開始。官方靠自建瀏覽器叢集壓低成本，才能同時給免費與 <0.5s 延遲。
2. **公平性**：月度 quota 會造成「月初夠用、月底被斷」的尖峰不公平。改為 30 req/min（Search）與 150 URLs/min（Fetch）的滑動窗口，超速回 429 + `Retry-After`，做退避就能持續用，不用先儲值。
3. **失敗不該算在使用者頭上**：Fetch 失敗多來自目標站（DNS、anti-bot、404、timeout），若計費等於為外部不穩定買單，因此失敗只在 `errors[]` 回報，不扣額也不影響 batch 內其他 URL。

落到定價表就是 `Search Free — 30 requests/min — $0.00` 與 `Fetch Free — 150 urls/min — $0.00`，文件首段也直接標註：

> Search/Fetch never draws from your wallet — it's free at any balance, including $0.

## 怎麼用：從註冊到第一個請求

註冊入口只有一個：`agent.tinyfish.ai/api-keys`，建一把 `X-API-Key` 即可。文件特別強調免信用卡、免月費、免最低消費，Wallet 餘額即使是 $0 也不影響 Search/Fetch。

```bash
# Search：關鍵字 + 地域/語言可選
curl "https://api.search.tinyfish.ai?query=web+automation+tools&location=US&language=en" \
  -H "X-API-Key: $TINYFISH_API_KEY"

# Fetch：最多 10 URLs，失敗的 URL 進 errors[] 不影響其他
curl -X POST https://api.fetch.tinyfish.ai \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://docs.tinyfish.ai/search-api"], "format": "markdown"}'
```

Python 與 TypeScript SDK 也是一行初始化：

```python
from tinyfish import TinyFish
client = TinyFish()  # 讀 TINYFISH_API_KEY
print(client.search.query(query="web automation tools").results[0].url)
print(client.fetch.get_contents(urls=["https://www.tinyfish.ai/"]).results[0].text[:500])
```

MCP 則直接把 `https://agent.tinyfish.ai/mcp` 丟進 Claude/Cursor/Codex，agent 就能自主決定何時 search、何時 fetch。

兩個實用技巧：Fetch 想只取文章本體可用 `include_selectors: ["article"]` 搭配 `exclude_selectors: [".comments"]`；需要增量更新就帶 `include_etag_and_last_modified: true` 存下 `etag`，下次用 `if_none_match` 重打，未變更會回 `not_modified: true`。

## 與替代方案比較

| 方案 | 免費層邊界 | 強項 | 取捨 |
|---|---|---|---|
| **TinyFish Search/Fetch** | $0 wallet 可用，無月總量，30 req/min + 150 URLs/min，失敗不計額 | Agent 友善的清洗後 Markdown、batch 與 selector 抽取、速率可持續打 | 超速硬限 429，需自做佇列與退避 |
| **Firecrawl** | 約 1,000 credits/月，search 2 credits/10 results、scrape 1 credit/page | 全站 crawl、結構化抽取、自託管 AGPL | 高頻檢索成本高，對 bot 保護站通過率低（官方對比 1/6） |
| **Tavily / Exa / Brave Search** | 多為月額度或按千次計費，調參（深度、domain 權重）彈性大 | 研究論文、即時新聞、精準調參 | 零成本持續跑的門檻較高 |
| **自建 Playwright + Proxy** | 無 API 成本，維運成本高 | 完全客製渲染與反制策略 | 需自維 anti-bot、IP 輪替與 token 清洗 |

TinyFish 的差異在於把清洗做在基礎設施層——去 nav/script/cookie banner 後的乾淨 Markdown 直接進 context window，少付垃圾 token，也少寫清洗程式碼。

## 適合與不適合

- **適合**：coding agent 的文件檢索與 RAG retrieval、價格與財報監控、新聞與論文追蹤、學生與獨立開發者無信用卡起步、任何「找得到、讀得乾淨」是當前瓶頸的團隊。
- **不適合**：流程第一步就是登入牆或需填表單（改用 Agent，回 $0.016/step，2 concurrent）、需長時間持有的 stealth browser 會話（改用 Browser，回 $0.002/min，5 sessions）、需法律承諾「永不調價」的企業採購。

## 免費是真的嗎？官方邊界一次看懂

這也是最多人追問的點，交叉官方 Blog、docs 與定價頁後，8 項皆一致：

- **完全免費**：Blog 寫 Free for every developer / every agent / every surface，Docs 首頁寫 Search and Fetch are free。
- **$0 仍可用**：`remain completely free even with a $0.00 Wallet balance` 與 `free at any balance, including $0` 逐字一致。
- **免信用卡與月費**：`No credit card required`、`No plans, no minimums`，儲值只在跑 Agent/Browser 時才需最低 $10。
- **限速**：Search 30 req/min、Fetch 150 URLs/min，以 `requests` 與 `urls` 為單位區分。
- **頻率而非總量**：全站無 monthly quota，429 會帶 `Retry-After` 與 `X-RateLimit-Limit`，退避後可繼續。
- **失敗不計額**：`Failed URLs don't count` / `Failed URLs are free`，失敗以 `errors[]` + 200 回報。
- **常態免費層**：自 2026-05-04 Now FREE 起持續為 Free，無到期日文字，官方未用 permanent 但也無試用期。
- **付費邊界清晰**：只有 Agent 與 Browser 會扣 Wallet，舊制 credits 已遷移至美元制，舊帳號的 `403 FORBIDDEN` 與新制的 `402 INSUFFICIENT_CREDITS` 需同時處理。

## 限制與實務建議

- **限速硬門檻**：大量抓取要做佇列與指數退避，batch 建議 1-2 秒間隔；升級限速走 `tinyfish.ai/pricing`。
- **Fetch 上限**：batch 最多 10 URLs；單 URL 後端逾時 110 秒、整批 CDN 上限 120 秒，客戶端逾時建議設 150 秒。
- **錯誤碼分流**：`402` 只會在 Agent/Browser 出現，`429` 有 `details` 代表撞到 per-minute 限速（可升級），無 `details` 代表上游被限或容量滿（應退避）。
- **需 API Key 但不用綁卡**：無 key 回 `401 MISSING_API_KEY`，$0 wallet 不影響 Search/Fetch 授權。

## 整體來說

TinyFish 把「瀏覽」與「自動化」拆成兩個商業單位：瀏覽層用速率換免費，自動化層用 Wallet 賺推理與瀏覽器成本。對開發者，決策點不在「要不要付費才能搜」，而在「瓶頸是找得到、讀得乾淨，還是操作得動」——前者已經免費，後者才需付費。若你的 agent 還在用模型記憶回答或手寫 Playwright 抓文件，先把 Search/Fetch 接上去當預設檢索層，通常是最低成本、最高穩定度的起點。

> 這篇屬於「[搜尋與爬取實戰](/series/search-and-scraping)」系列。如果你在比對各家 Search API 的免費額度，我們有一篇 [免費搜尋、爬取與 Browser API 怎麼選](/posts/ai/2026-08-21-free-search-scraping-tools) 把各方案的額度、重置規則與超額行為整理成判斷表，TinyFish 的「持續限速」路線也在其中。

---

## 參考資料

- [Search and Fetch are now FREE for every agent, everywhere!](https://www.tinyfish.ai/blog/search-and-fetch-are-now-free-for-every-agent-everywhere)
- [TinyFish Developer Documentation](https://docs.tinyfish.ai/)
- [Search API](https://docs.tinyfish.ai/search-api)
- [Fetch API](https://docs.tinyfish.ai/fetch-api)
- [Search API Reference](https://docs.tinyfish.ai/search-api/reference)
- [Fetch API Reference](https://docs.tinyfish.ai/fetch-api/reference)
- [Pricing](https://www.tinyfish.ai/pricing)
- [Error Codes](https://docs.tinyfish.ai/error-codes)
- [tinyfish-cookbook](https://github.com/tinyfish-io/tinyfish-cookbook)
- [TinyFish: The Best Free Firecrawl Alternative for AI Agents in 2026](https://www.bitdoze.com/tinyfish-free-firecrawl-alternative/)
- [Free Web Search for AI Coding Agents: TinyFish Setup Guide](https://bitdoze.com/tinyfish-free-search-coding-agents)
- [TinyFish makes Search and Fetch APIs free for all developers](https://testingcatalog.com/tinyfish-makes-search-and-fetch-apis-free-for-all-developers)
