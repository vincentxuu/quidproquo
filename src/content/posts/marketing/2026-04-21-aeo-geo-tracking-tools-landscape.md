---
title: "AEO / GEO 工具全景：輸入面、流量面、輸出面——從 isitagentready 到 aeo-radar 到 Profound"
date: 2026-04-21
category: marketing
tags: [aeo, geo, ai-visibility, brand-monitoring, open-source, self-hosted, llm, ai-seo, cloudflare, agent-readiness, llms-txt, mcp, ai-crawler, gptbot]
lang: zh-TW
tldr: "AEO/GEO 工具不是單一類別，而是三個面向：輸入面（網站有沒有準備好給 AI 讀）、流量面（AI bot 實際爬了多少）、輸出面（品牌在答案裡怎麼被提到）。這篇把三面向、從開源自架到商業 SaaS 的工具一次攤開。"
description: "完整盤點 AEO / GEO 工具地圖：輸入面的 isitagentready、llms.txt 驗證器與產生器；流量面的 Matomo、Zerply、aibottracker；輸出面的 aeo-radar、AiCMO、Profound、AthenaHQ、Ahrefs Brand Radar。附共通架構與選型建議。"
draft: false
---

AEO / GEO 工具這兩年從「SEO 廠商延伸功能」冒出一整個獨立類別。動機很直接：Google 搜尋仍然重要，但越來越多使用者直接問 ChatGPT、Perplexity、Gemini、Claude，得到一段合成過的答案——而答案裡有沒有你的品牌、排第幾個、引用了誰的內容，傳統 SEO 指標完全看不到。

但「AEO 工具」其實是個很鬆散的詞。實際拆開會發現它涵蓋三個完全不同的面向：

- **輸入面**：你的網站有沒有準備好讓 AI agent 讀取（你能完全控制）
- **流量面**：AI bot 實際爬了你多少頁（你能觀察但不能控制）
- **輸出面**：AI 生成答案時怎麼提到你（你只能影響）

這篇按三個面向盤點工具地圖，再拉出共通架構和選型建議。

## 輸入面：網站本身準備好給 AI 讀了嗎

這是唯一你能 100% 控制的層。工具分兩類：整體健檢、與 llms.txt 單點工具。

### 整體健檢

**[isitagentready.com](https://isitagentready.com/)**（Cloudflare 出）是目前最完整的輸入面健檢。貼網址、選 Content Site / API / All Checks，掃出一份分數報告，檢查四個面向：

- **Discoverability**：robots.txt、sitemap、llms.txt
- **Content**：Markdown content negotiation、結構化資料
- **Bot Access Control**：AI 爬蟲宣告（`AI-usage` directives）
- **Capabilities**：MCP endpoint、OAuth、Agent Skills、agentic commerce

Cloudflare 公布的掃描統計很狠——全網站只有 4% 宣告 AI 使用偏好、3.9% 支援 Markdown 協商。定位類似「給 AI agent 用的 Lighthouse」，免費、不用註冊。

### llms.txt 專門工具

**驗證器**（貼網址掃 llms.txt 格式）：

- [llms-txt.io/validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [Pixelmojo](https://www.pixelmojo.io/tools/llms-txt-validator) — 含 AI 建議
- [indexly.ai](https://indexly.ai/llms-txt-checker)

**開源產生器**（爬你網站、生出 llms.txt）：

- [firecrawl/llmstxt-generator](https://github.com/firecrawl/llmstxt-generator) — 最多星，用 Firecrawl 爬 + GPT-4-mini
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator) — Apify Actor 形式
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator) — 能自動監測網站變化

llms.txt 本身還是 proposed standard，2025 年開始大量網站跟進，但 Cloudflare 的掃描顯示實際採用率還很低——所以這是很容易搶先建立優勢的一塊。

## 流量面：AI bot 實際爬了你多少頁

這是最容易被忽略的類別。傳統 GA / Plausible 預設會**過濾掉** bot 流量，所以 GPTBot、ClaudeBot、PerplexityBot 每天爬你幾千頁，你在儀表板上看不到。

Cloudflare 的 server log 研究顯示，ChatGPT-User 一小時可以爬 2,400 頁。對重視內容資產的站，這個數字直接關係到「AI 有沒有看到你」——跟輸入面的 llms.txt 設定是一體兩面。

幾個新興的專門工具：

- **[Matomo 5.8](https://inimino.org/matomo-5-8-launches-ai-chatbot-tracking-dedicated-reports-separate-bot-traffic-from-human-visits/)** — 第一個主流開源分析平台內建 AI Assistants 報表，把 AI bot 從人類流量分開。想自架分析就選這個
- **[Zerply AI Traffic Analytics](https://zerply.ai/platform/ai-traffic-analytics)** — 商業 SaaS，不用埋 code，直接接 CDN/reverse proxy
- **[aibottracker.com](https://www.aibottracker.com/)** — 免費、不限次數，輕量選項
- **[LLM Bot Tracker](https://wordpress.org/plugins/llm-bot-tracker-by-hueston/)** — WordPress 外掛版

DIY 派可以直接從 access log 撈，搭 ELK / Grafana / Datadog。`User-Agent` 特徵清單（GPTBot、ChatGPT-User、ClaudeBot、PerplexityBot、Google-Extended、CCBot...）各家官網都有文件，不難做。

## 輸出面：品牌在 AI 答案裡被怎麼提到

這是 AEO/GEO 工具最擁擠的戰場，也是這篇一開始出發點（aeo-radar 就在這層）。

### 開源自架

核心賣點都一樣：**不要每月 $200–$500 給 SaaS，資料和 prompt 留在自己機器上**。差異在技術棧和資料取得方式。

**[aeo-radar](https://github.com/hellowalt/aeo-radar)** 用 Playwright 每天 headless 爬 AI 介面、不需要 API key，抓回來的答案交給 Claude CLI 做結構化萃取（品牌是否被提到、情感、競品、引用來源），存進 SQLite，Next.js 16 + Ant Design 畫儀表板。繁中先行、主打非英文市場是明確的取捨——英文市場已經紅海，非英文市場的 AEO 資料反而是商業 SaaS 長期忽略的縫隙。

**[AICMO/ai-cmo](https://github.com/AICMO/ai-cmo)** 是完成度更高的開源選項，Vue + Python + TypeScript，Docker 一鍵起，明確支援 ChatGPT / Gemini / Perplexity / Claude 四家。定位接近「開源版 Profound」，但需要自己帶 OpenAI + Vertex AI 憑證。

**[danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)** 技術棧跟 aeo-radar 最像（Next.js 16、TypeScript、Recharts），功能面比較滿——13 個分頁、6 個 AI 模型同追蹤、6 階段 SRO 分析、引用機會掃描、競品 battlecard。資料面用的是 Bright Data 的 Web Scraper API，優點是不用自己維護反爬策略，缺點是 Bright Data 不免費。

**[sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)** 走的是另一條路——不直接爬 AI 介面，而是呼叫 OpenAI API，自動爬你的品牌網站、用網站內容產生一批 prompt 去問 ChatGPT。優點是合法乾淨、不擔心反爬；缺點是你拿到的是「API 版 ChatGPT 怎麼看你」，跟網頁版使用者看到的有落差——網頁版有即時搜尋、API 沒有。

輕量選項還有 [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer) 和 [getcito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool)。

### 商業 SaaS：光譜從 free tier 到六位數企業合約

純 AEO/GEO 廠商：

- **[Profound](https://www.tryprofound.com/)** — Series B $35M，enterprise 旗艦
- **[AthenaHQ](https://athenahq.ai)** — YC 支持，前 Google / DeepMind 班底
- **[Evertune](https://www.evertune.ai/)** — 主打 AI 搜尋 customer journey 全流程
- **[Peec.ai](https://peec.ai)**、**[Scrunch](https://scrunch.com)**、**[Goodie](https://goodie.ai)**、**[Bluefish AI](https://bluefish.ai)**、**[ZipTie](https://ziptie.ai)**、**[Knowatoa](https://knowatoa.com)** — 中段班
- **[Otterly.AI](https://otterly.ai)**、**[LLMrefs](https://llmrefs.com/)**、**[AIclicks](https://aiclicks.io/)**、**[Rankscale](https://rankscale.ai/)**、**[Sight AI](https://www.trysight.ai)** — 偏中小團隊訂閱

傳統 SEO 大廠延伸出的 AEO 模組：

- **[Ahrefs Brand Radar](https://ahrefs.com/brand-radar)** — 2025/3 推出，直接併進 Ahrefs 主訂閱
- **[SEMrush AI Visibility Toolkit](https://semrush.com)**
- **[SE Ranking AEO Tool](https://seranking.com/answer-engine-optimization-tool.html)**
- **[HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)** — 免費，28 天試用含 10 組 ChatGPT prompt
- **[Writesonic GEO](https://writesonic.com/)** — 追蹤 + 內容生成綁一起

SaaS 端的競爭焦點已經從「有沒有追 ChatGPT」變成「引用來源分析深度」「hallucination 偵測」「跨平台 share of voice 歸因」。純追蹤功能會越來越 commodity。

### Citation 專門工具（比 mention 更細的顆粒度）

Mention（有沒有被提到）和 citation（有沒有被當引用來源、帶連結）是不同指標。專做 citation 追蹤的：

- **[Am I Cited](https://www.amicited.com)** — 商業 SaaS，聚焦 citation frequency、sentiment、share of voice
- **[AI Citation Tracker Chrome 擴充](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)** — 自己搜尋時即時 highlight，品牌綠色、競品紅色，免費
- **[Decoding](https://trydecoding.com/ai-citation-tracking/)** — citation tracking 商業版

Chrome 擴充這類「人肉搜尋時順便記錄」的輕量工具，在還沒下手買 SaaS 的探索階段很好用。

## 資源目錄：盤點時的 meta 層

- [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization) — 目前最完整的 GEO 工具地圖
- [geotoolco/AEO-Answer-Engine-Optimization](https://github.com/geotoolco/AEO-Answer-Engine-Optimization) — 連社群、外掛、顧問公司都列
- [izak-fisher/generative-engine-optimization-tools](https://github.com/izak-fisher/generative-engine-optimization-tools)
- [luka2chat/awesome-geo](https://github.com/luka2chat/awesome-geo)
- [tentenco/awesome-geo](https://github.com/tentenco/awesome-geo)
- [DavidHuji/Awesome-GEO](https://github.com/DavidHuji/Awesome-GEO) — 學術論文集

## 共通架構（輸出面工具）

把輸出面的開源專案拆開，會發現大家做的事情其實是同一套 pipeline：

```
[Prompt 清單] → [查詢 AI 介面] → [結構化萃取] → [儲存] → [儀表板]
     │              │                   │              │          │
  關鍵字        Playwright /         LLM-as-judge    SQLite /     Next.js
  品牌名        官方 API /            （Claude /      Postgres     React
  競品          Bright Data          GPT-4 /                       Recharts
                Scraper API          Gemini）
```

幾個設計決策會決定走哪條路：

**資料取得方式**：爬網頁版 vs. 呼叫 API。前者看到的是真實使用者體驗（含即時搜尋、引用連結），但要處理反爬、Cloudflare、Cookie 牆；後者穩定乾淨但跟使用者實際看到的有落差。aeo-radar 選 Playwright + 無 API key，賭的就是「前者比較真實」。

**分析引擎**：aeo-radar 用 Claude CLI，AiCMO 用 OpenAI + Vertex AI。選 CLI 的好處是不用再申請一套 API key、搭 Max 訂閱就能跑；選 API 的好處是可以上雲、多 worker 並行。

**資料庫**：SQLite 起手、提供 Postgres 選項幾乎是這類專案的預設。資料量大多是每日一次 × N 個 prompt × M 個模型，SQLite 撐一陣子沒問題。

**多語言市場**：目前開源場上繁中/日文/韓文覆蓋很薄，aeo-radar 繁中先行這件事在 SaaS 世界裡沒有對應者。

## 選型建議

按三個面向分開看：

**輸入面**（先做這層，CP 值最高）：
- 先用 isitagentready 掃一次，把 llms.txt、robots.txt、MCP 能補的補齊
- 想要產生 llms.txt，firecrawl/llmstxt-generator 開源跑一次

**流量面**（你自架分析就做）：
- 自架：Matomo 5.8 起
- 不想動基建：aibottracker.com 免費版
- 重內容資產的站要開，才知道 GPTBot 有沒有在爬你

**輸出面**（實際看品牌在 AI 答案裡的樣子）：
- 只想快速看一眼：HubSpot AEO Grader 免費試、Ahrefs Brand Radar（本來就訂）、AI Citation Tracker Chrome 擴充（搜尋時 highlight）
- 長期自架：aeo-radar（繁中市場最順）、AiCMO（功能最完整）、geo-aeo-tracker（UI 最完整但要 Bright Data）
- 做自己的 AEO 產品：讀 aeo-radar 和 AiCMO 的 source code，再掃 awesome list
- 企業級：Profound 或 AthenaHQ
- 單平台訂閱：Otterly.AI 或 LLMrefs
- 要 citation 粒度：Am I Cited

## 整體來說

AEO 工具這個類別在 2025 上半年還是 SaaS 廠商的戰場，到 2026 年已經長出完整的三層生態——輸入面、流量面、輸出面各自有開源和商業選項。

最有趣的觀察是：**輸入面和流量面反而比輸出面更被忽略**。大家都在看「品牌在 AI 答案裡怎麼被提到」，但很少人先回答「我的網站 AI 讀不讀得到」「AI 有沒有在爬我」這兩個更基礎的問題。這兩層都是你能控制、能量化、且競爭強度遠低於輸出面的。

輸出面的開源方案倒是這兩年成熟得很快。aeo-radar 這種繁中先行、Playwright 無 key 爬取、Claude CLI 分析的組合，在兩年前連技術路徑都不存在——能這樣做是因為 headless browser、LLM CLI、Next.js App Router 這幾塊同時成熟。自己做一個 AEO 工具的進入門檻比看起來低很多：核心不是「寫爬蟲和儀表板」，而是「選對 prompt、選對分析邏輯、選對資料呈現方式」。工具只是殼。

## 參考資料

### 輸入面
- [isitagentready.com - Cloudflare](https://isitagentready.com/)
- [Introducing the Agent Readiness score - Cloudflare Blog](https://blog.cloudflare.com/agent-readiness/)
- [llms-txt.io Validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [firecrawl/llmstxt-generator](https://github.com/firecrawl/llmstxt-generator)
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator)
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator)

### 流量面
- [Matomo 5.8 AI Chatbot Tracking](https://inimino.org/matomo-5-8-launches-ai-chatbot-tracking-dedicated-reports-separate-bot-traffic-from-human-visits/)
- [Zerply AI Traffic Analytics](https://zerply.ai/platform/ai-traffic-analytics)
- [aibottracker.com](https://www.aibottracker.com/)
- [LLM Bot Tracker WordPress Plugin](https://wordpress.org/plugins/llm-bot-tracker-by-hueston/)
- [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)
- [How to Detect AI Crawlers - GetCito](https://getcito.com/how-to-detect-ai-crawlers-on-your-website)
- [AI Bot Behavior Log Analysis - Wislr](https://www.wislr.com/articles/ai-bot-behavior-log-analysis)

### 輸出面：開源
- [hellowalt/aeo-radar（README 繁中）](https://github.com/hellowalt/aeo-radar/blob/main/README.zh-TW.md)
- [AICMO/ai-cmo](https://github.com/AICMO/ai-cmo)
- [danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)
- [merdandt/geo-aeo-tracker-bright-data](https://github.com/merdandt/geo-aeo-tracker-bright-data)
- [sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)
- [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer)
- [ai-search-guru/getcito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool)

### 輸出面：商業
- [Profound](https://www.tryprofound.com/)
- [AthenaHQ](https://athenahq.ai)
- [Evertune](https://www.evertune.ai/)
- [Ahrefs Brand Radar](https://ahrefs.com/brand-radar)
- [HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)
- [Otterly.AI](https://otterly.ai)
- [LLMrefs](https://llmrefs.com/)
- [Sight AI](https://www.trysight.ai)
- [Am I Cited](https://www.amicited.com)
- [AI Citation Tracker Chrome Extension](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)
- [Decoding AI Citation Tracking](https://trydecoding.com/ai-citation-tracking/)

### 資源目錄
- [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization)
- [geotoolco/AEO-Answer-Engine-Optimization](https://github.com/geotoolco/AEO-Answer-Engine-Optimization)
- [DavidHuji/Awesome-GEO](https://github.com/DavidHuji/Awesome-GEO)
- [Best AEO/GEO Tracking Tools (aiclicks)](https://aiclicks.io/blog/best-aeo-tracking-tools)
- [Profound vs Ahrefs Brand Radar Review](https://www.tryprofound.com/blog/ahrefs-brand-radar-review)
