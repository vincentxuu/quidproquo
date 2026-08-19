---
title: "AEO / GEO 工具全景：輸入面、流量面、輸出面——從 isitagentready 到 aeo-radar 到 Profound"
date: 2026-04-21
updated: 2026-08-19
type: project
category: marketing
tags: [aeo, geo, ai-visibility, brand-monitoring, open-source, self-hosted, llm, ai-seo, cloudflare, agent-readiness, llms-txt, mcp, ai-crawler, gptbot]
lang: zh-TW
tldr: "AEO/GEO 工具不是單一類別，而是三個面向：輸入面（網站有沒有準備好給 AI 讀）、流量面（AI bot 實際爬了多少）、輸出面（品牌在答案裡怎麼被提到）。這篇把三面向、從開源自架到商業 SaaS 的工具一次攤開。"
description: "完整盤點 AEO / GEO 工具地圖：輸入面的 isitagentready、llms.txt 驗證器與產生器；流量面的 Matomo、Zerply、aibottracker；輸出面的 aeo-radar、AiCMO、Profound、AthenaHQ、Ahrefs Brand Radar。附共通架構與選型建議。"
draft: false
series:
  name: "AEO / GEO 與 AI 搜尋"
  order: 5
---

AEO / GEO 工具這兩年從「SEO 廠商延伸功能」冒出一整個獨立類別。動機很直接：Google 搜尋仍然重要，但越來越多使用者直接問 ChatGPT、Perplexity、Gemini、Claude，得到一段合成過的答案——而答案裡有沒有你的品牌、排第幾個、引用了誰的內容，傳統 SEO 指標完全看不到。

但「AEO 工具」其實是個很鬆散的詞。實際拆開會發現它涵蓋三個完全不同的面向：

- **輸入面**：你的網站有沒有準備好讓 AI agent 讀取（你能完全控制）
- **流量面**：AI bot 實際爬了你多少頁（你能觀察但不能控制）
- **輸出面**：AI 生成答案時怎麼提到你（你只能影響）

這篇按三個面向盤點工具地圖，再拉出共通架構和選型建議。

> **2026-08 更新**：這篇原稿寫於 2026-04，四個月內這個類別發生了三件大事——Adobe 完成收購 Semrush（2026-04-28）、Sitecore 收購 Scrunch（2026-06-03）、Profound 完成 $96M C 輪達到 $1B 估值（2026-02）。同時 llms.txt 的實證資料出爐，結論跟原稿相反。這次翻新逐家開站確認、把會腐爛的價格與功能對照表換成取捨判準，並標明各開源專案最後更新時間。

## 輸入面：網站本身準備好給 AI 讀了嗎

這是唯一你能 100% 控制的層。工具分兩類：整體健檢、與 llms.txt 單點工具。

### 整體健檢

**[isitagentready.com](https://isitagentready.com/)**（Cloudflare 出）是目前最完整的輸入面健檢。貼網址、選 Content Site / API / All Checks，掃出一份分數報告。檢查的類別它自己會調整，2026-08 是五類（llms.txt 已經不在清單上了）：

- **Discoverability**：robots.txt、Sitemap、Link headers、DNS-AID
- **Content Accessibility**：Markdown content negotiation、結構化資料
- **Bot Access Control**：AI 爬蟲規則、Content Signals、Web Bot Auth
- **Protocol Discovery**：MCP Server Card、Agent Skills、WebMCP、API Catalog、OAuth
- **Commerce**：x402、MPP、UCP、ACP

清單會變，以[官網](https://isitagentready.com/)當下顯示的為準。

Cloudflare 在[發佈文章](https://blog.cloudflare.com/agent-readiness/)裡公布的掃描統計很狠——當時**造訪量前 20 萬個網域**裡只有約 4% 宣告 AI 使用偏好、3.9% 支援 Markdown 協商（母體不是「全網站」，而且已濾掉 redirect、廣告伺服器等類別）。這是發佈時點的數字，但原文寫明該圖表**每週更新**，要現值可以走 Cloudflare Radar 的 Data Explorer 或 API，引用時請帶上時間。定位類似「給 AI agent 用的 Lighthouse」，免費、不用註冊。

### llms.txt 專門工具

**驗證器**（貼網址掃 llms.txt 格式）：

- [llms-txt.io/validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [Pixelmojo](https://www.pixelmojo.io/tools/llms-txt-validator) — 含 AI 建議

**開源產生器**（爬你網站、生出 llms.txt）：

- [firecrawl/llmstxt-generator](https://github.com/firecrawl/llmstxt-generator) — 星數最多（最後更新 2025-06）
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator) — Apify Actor 形式，維護中（最後更新 2026-05）
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator) — 能自動監測網站變化，但幾乎沒有社群（0 star、最後更新 2025-09），要用之前先看過程式碼

**原稿在這裡的判斷已經被推翻。** 當時寫「採用率低所以容易搶先建立優勢」，後來的實證資料顯示問題不在採用率，而在**根本沒人讀**：

- Ahrefs 分析 13.7 萬個網站的伺服器日誌，[97% 的 llms.txt 從未被請求過](https://ahrefs.com/blog/llmstxt-study/)，而且沒有任何 AI bot 會主動去試探不存在的 llms.txt
- SE Ranking 在 [2025-11 掃 30 萬網域，10.13% 有 llms.txt](https://seranking.com/blog/llms-txt/)——注意這是該研究自己的結論的反面：原文判定為「a niche practice with very limited adoption」，近九成網站沒有採用。前述 Ahrefs 那份研究則量到約 28%，兩個數字的母體與時間點都不同，別當成同一件事比較
- Google 2026-05 把 llms.txt 列進[「不用做」清單](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)，2026-06-15 又澄清它「不會正面也不會負面影響能見度或排名」

唯一有實據的用途是 AI 編程助理會在文件網站上讀它。所以：**技術文件站值得做，一般站台別排優先順序**，上面這些驗證器與產生器也就跟著降級成「順手工具」而非必備。

## 流量面：AI bot 實際爬了你多少頁

這是最容易被忽略的類別。傳統 GA / Plausible 預設會**過濾掉** bot 流量，所以 GPTBot、ClaudeBot、PerplexityBot 每天爬你幾千頁，你在儀表板上看不到。

這一層在 2026 下半年多了一個必看的理由：Cloudflare [宣布](https://blog.cloudflare.com/content-independence-day-ai-options/)自 **2026-09-15** 起，預設封鎖「混用型」爬蟲（同時做搜尋、訓練、agent 的那種）存取有廣告的頁面，適用新客戶、既有客戶的新站台與所有免費方案客戶（「混用型」與適用範圍的細節在[新聞稿](https://www.cloudflare.com/press/press-releases/2026/cloudflare-allows-the-agentic-internet-to-flourish-with-a-simple-philosophy-your-content-your-rules/)，blog 只寫了新網域那一段）。也就是說，**你的 AI bot 流量可能會在你什麼都沒改的情況下改變**——先有流量面的觀測，才看得出來發生了什麼。

幾個新興的專門工具：

- **[Matomo AI Assistants](https://matomo.org/guide/reports/ai-assistants/)** — 主流開源分析平台內建的 AI 報表，把 AI bot 從人類流量分開。AI chatbot 報表自 [5.8.0](https://matomo.org/blog/2026/03/new-feature-matomo-ai-assistants-tracking/)（2026-03）起，這條有官方新聞稿；導流追蹤與 Content Requests（看 AI 具體要走哪些頁）也已具備，但確切從哪個版本進的在 changelog 上查不到，要卡版本請自己對 [changelog](https://matomo.org/changelog/)。想自架分析就選這個
- **[Zerply AI Traffic Analytics](https://zerply.ai/platform/ai-traffic-analytics)** — 商業 SaaS，不用埋 code，直接接 CDN/reverse proxy
- **[aibottracker.com](https://www.aibottracker.com/)** — 免費、不限次數，輕量選項
- **[LLM Bot Tracker](https://wordpress.org/plugins/llm-bot-tracker-by-hueston/)** — WordPress 外掛版

DIY 派可以直接從 access log 撈，搭 ELK / Grafana / Datadog。`User-Agent` 特徵清單（GPTBot、ChatGPT-User、ClaudeBot、Claude-User、PerplexityBot、CCBot...）各家官網都有文件，不難做。**但別把 `Google-Extended` 放進去**——[Google 明講](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)它沒有自己的 HTTP user agent 字串，抓取仍用既有的 Googlebot UA，這個 token 只在 robots.txt 裡當控制用，永遠不會出現在你的 log 裡。

## 輸出面：品牌在 AI 答案裡被怎麼提到

這是 AEO/GEO 工具最擁擠的戰場，也是這篇一開始出發點（aeo-radar 就在這層）。

### 開源自架

核心賣點都一樣：**不付 SaaS 訂閱，資料和 prompt 留在自己機器上**。差異在技術棧和資料取得方式。

自架要付的隱藏成本有三筆，決定之前先算清楚：反爬蟲維護（AI 介面的登入牆和 Cloudflare 挑戰會變）、分析用的 LLM token、以及你自己的時間。當追蹤的 prompt 數量少時，自架通常划算；規模上去之後，前兩筆會逼近 SaaS 的訂閱費。

以下各專案附最後更新時間（2026-08 查核），這類小型工具的汰換率很高，長期停更的請當成參考實作而非可依賴的產品。

**[aeo-radar](https://github.com/hellowalt/aeo-radar)**（最後更新 2026-07，維護中）用 Playwright 每天 headless 爬 AI 介面、不需要 API key，抓回來的答案交給 Claude CLI 做結構化萃取（品牌是否被提到、情感、競品、引用來源），存進 SQLite，Next.js 16 + Ant Design 畫儀表板。繁中先行、主打非英文市場是明確的取捨——英文市場已經紅海，非英文市場的 AEO 資料反而是商業 SaaS 長期忽略的縫隙。

**[AICMO/ai-cmo](https://github.com/AICMO/ai-cmo)**（最後更新 2025-10，已久未更新）是完成度更高的開源選項，Vue + Python + TypeScript，Docker 一鍵起，明確支援 ChatGPT / Gemini / Perplexity / Claude 四家。定位接近「開源版 Profound」，但需要自己帶 OpenAI + Vertex AI 憑證。

**[danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)**（最後更新 2026-08，這幾個月成長最快，星數已破 200）技術棧跟 aeo-radar 最像（Next.js 16、TypeScript、Recharts），功能面比較滿——13 個分頁、6 個 AI 模型同追蹤、6 階段 SRO 分析、引用機會掃描、競品 battlecard。資料面用的是 Bright Data 的 Web Scraper API，優點是不用自己維護反爬策略，缺點是 Bright Data 不免費。

**[sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)**（最後更新 2025-07，已久未更新）走的是另一條路——不直接爬 AI 介面，而是呼叫 OpenAI API，自動爬你的品牌網站、用網站內容產生一批 prompt 去問 ChatGPT。優點是合法乾淨、不擔心反爬；缺點是你拿到的是「API 版 ChatGPT 怎麼看你」，跟網頁版使用者看到的有落差——網頁版有即時搜尋、API 沒有。

輕量選項還有 [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer)（1 star、2025-10 後未更新，當範例讀就好）和 [getcito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool)。

### 商業 SaaS：光譜從 free tier 到六位數企業合約

**這一節不列價格。** 原稿寫過的價格帶在四個月內幾乎全數變動過（有的降價、有的取消免費方案、有的改成 EUR 地區定價），而且多數廠商的入門方案會用「追幾個 prompt、涵蓋幾家引擎」來切級距，單看月費沒有意義。要比價請直接看各家 pricing 頁；下面只寫定位與 2026-08 的狀態。

純 AEO/GEO 廠商（2026-08 逐家開站確認，不只看狀態碼）：

- **[Profound](https://www.tryprofound.com/)** — enterprise 旗艦。原稿寫的「Series B $35M」已過期：2026-02-24 完成 [$96M C 輪、估值 $1B](https://www.tryprofound.com/blog/profound-raises-96m-series-c)（Lightspeed 領投），累計募資超過 $155M，產品線也從追蹤延伸到會自己產內容的 Agents
- **[AthenaHQ](https://athenahq.ai)** — YC 支持，前 Google / DeepMind 班底
- **[Evertune](https://www.evertune.ai/)** — 主打 AI 搜尋 customer journey 全流程
- **[Scrunch](https://scrunch.com)** — **已被 Sitecore 收購**（[2026-06-03 公告](https://www.sitecore.com/company/newsroom/press-releases/2026/06/sitecore-acquires-scrunch-to-help-brands-influence-discovery--and-buying-decisions)），品牌與網站仍在，但已併入 Sitecore 的 DXP，未來的採購決策會綁到 Sitecore 合約
- **[Peec.ai](https://peec.ai)**、**[ZipTie](https://ziptie.ai)**、**[Knowatoa](https://knowatoa.com)** — 中段班
- **Goodie**、**Bluefish AI** — **已經收掉**。goodie.ai 現在是域名待售頁，bluefish.ai 導向停放頁。兩個網域都還回 HTTP 200，只看狀態碼會以為它們還活著——這正是這個類別的風險：工具還在你的儀表板上，公司已經不在了
- **[Otterly.AI](https://otterly.ai)**、**[LLMrefs](https://llmrefs.com/)**、**[AIclicks](https://aiclicks.io/)**、**[Rankscale](https://rankscale.ai/)**、**[Sight AI](https://www.trysight.ai)** — 偏中小團隊訂閱

傳統 SEO 大廠延伸出的 AEO 模組：

- **[Ahrefs Brand Radar](https://ahrefs.com/brand-radar)** — 注意 AI 追蹤是**獨立付費 add-on**（選定平台與全平台兩種級距），主訂閱只含基本的 web visibility，不是「訂了 Ahrefs 就有」
- **Semrush AI Visibility Toolkit** — **Semrush 已被 Adobe 收購**，交易於 [2026-04-28 完成](https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition)（$1.9B 全現金，2025-11 宣布）。它現在是 Adobe 客戶體驗產品線的一部分，跟 Adobe LLM Optimizer 會怎麼整併還沒定案——如果你正在評估長約，這是要問清楚的事
- **[SE Ranking AEO Tool](https://seranking.com/answer-engine-optimization-tool.html)**
- **[HubSpot AI Search Grader](https://www.hubspot.com/aeo-grader)**（原名 AEO Grader，網址沒改）— 免費的一次性健檢（試用條件會變，以官網為準）
- **[Writesonic GEO](https://writesonic.com/)** — 追蹤 + 內容生成綁一起

**2026 年的兩個結構性變化**：一是**併購潮**——半年內 Adobe 吃下 Semrush、Sitecore 吃下 Scrunch，純追蹤型工具正在被大型行銷/內容平台收編；二是**競爭焦點上移**——從「有沒有追 ChatGPT」變成「引用來源分析深度」「hallucination 偵測」「跨平台 share of voice 歸因」，再進一步變成「查到問題之後能不能自動改內容」。純追蹤功能會越來越 commodity。

選型時值得問的一句話是：**這家公司兩年後還會獨立存在嗎？** 被收購不必然是壞事（資源更多），但你的資料匯出路徑、API 承諾與價格會跟著改。

### Citation 專門工具（比 mention 更細的粒度）

Mention（有沒有被提到）和 citation（有沒有被當引用來源、帶連結）是不同指標。專做 citation 追蹤的：

- **[Am I Cited](https://www.amicited.com)** — 商業 SaaS，聚焦 citation frequency、sentiment、share of voice
- **[AI Citation Tracker Chrome 擴充](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)** — 自己搜尋時即時 highlight，品牌綠色、競品紅色，免費
- **[Decoding](https://trydecoding.com/ai-citation-tracking/)** — citation tracking 商業版

Chrome 擴充這類「人肉搜尋時順便記錄」的輕量工具，在還沒下手買 SaaS 的探索階段很好用。

## 資源目錄：盤點時的 meta 層

- [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization) — 目前最完整的 GEO 工具地圖
- [geotoolco/Top-Answer-Engine-Optimization](https://github.com/geotoolco/Top-Answer-Engine-Optimization) — 連社群、外掛、顧問公司都列（repo 已改名，舊網址會轉址）
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
- 只想快速看一眼：HubSpot AI Search Grader 免費試、AI Citation Tracker Chrome 擴充（搜尋時 highlight）
- 長期自架：aeo-radar（繁中市場最順、仍在維護）、geo-aeo-tracker（功能最滿、更新最勤，但要 Bright Data）；AiCMO 功能完整但已久未更新，當參考實作看
- 做自己的 AEO 產品：讀 aeo-radar 和 geo-aeo-tracker 的 source code，再掃 awesome list
- 企業級：Profound 或 AthenaHQ；已經在 Sitecore 或 Adobe 生態系裡的，先問既有合約能不能涵蓋（Scrunch → Sitecore、Semrush → Adobe）
- 單平台訂閱：Otterly.AI 或 LLMrefs
- 要 citation 粒度：Am I Cited

## 整體來說

AEO 工具這個類別在 2025 上半年還是 SaaS 廠商的戰場，到 2026 年已經長出完整的三層生態——輸入面、流量面、輸出面各自有開源和商業選項。

最有趣的觀察是：**輸入面和流量面反而比輸出面更被忽略**。大家都在看「品牌在 AI 答案裡怎麼被提到」，但很少人先回答「我的網站 AI 讀不讀得到」「AI 有沒有在爬我」這兩個更基礎的問題。這兩層都是你能控制、能量化、且競爭強度遠低於輸出面的。

輸出面的開源方案倒是這兩年成熟得很快。aeo-radar 這種繁中先行、Playwright 無 key 爬取、Claude CLI 分析的組合，在兩年前連技術路徑都不存在——能這樣做是因為 headless browser、LLM CLI、Next.js App Router 這幾塊同時成熟。自己做一個 AEO 工具的進入門檻比看起來低很多：核心不是「寫爬蟲和儀表板」，而是「選對 prompt、選對分析邏輯、選對資料呈現方式」。工具只是殼。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「AEO / GEO 與 AI 搜尋」系列

## 參考資料

- [isitagentready.com — Cloudflare Agent Readiness 健檢](https://isitagentready.com/)
- [Introducing the Agent Readiness score — Cloudflare Blog](https://blog.cloudflare.com/agent-readiness/)
- [llms-txt.io Validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [firecrawl/llmstxt-generator（開源 llms.txt 產生器）](https://github.com/firecrawl/llmstxt-generator)
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator)
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator)
- [Matomo AI Assistants 報表說明](https://matomo.org/guide/reports/ai-assistants/) 與 [5.8.0 發佈公告](https://matomo.org/blog/2026/03/new-feature-matomo-ai-assistants-tracking/)（流量面分析）
- [Zerply AI Traffic Analytics](https://zerply.ai/platform/ai-traffic-analytics)
- [aibottracker.com](https://www.aibottracker.com/)
- [LLM Bot Tracker WordPress Plugin](https://wordpress.org/plugins/llm-bot-tracker-by-hueston/)
- [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)
- [How to Detect AI Crawlers — GetCito](https://getcito.com/how-to-detect-ai-crawlers-on-your-website)
- [hellowalt/aeo-radar（AEO 輸出面開源工具，README 繁中）](https://github.com/hellowalt/aeo-radar/blob/main/README.zh-TW.md)
- [AICMO/ai-cmo（開源 GEO/AEO 追蹤平台）](https://github.com/AICMO/ai-cmo)
- [danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)
- [sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)
- [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer)
- [Profound — AEO/GEO 企業級 SaaS](https://www.tryprofound.com/) 與 [$96M C 輪公告（2026-02）](https://www.tryprofound.com/blog/profound-raises-96m-series-c)
- [Sitecore 收購 Scrunch 公告（2026-06-03）](https://www.sitecore.com/company/newsroom/press-releases/2026/06/sitecore-acquires-scrunch-to-help-brands-influence-discovery--and-buying-decisions)
- [Adobe 完成收購 Semrush（2026-04-28）](https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition)
- [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read — Ahrefs](https://ahrefs.com/blog/llmstxt-study/)
- [LLMs.txt: Why Brands Rely On It and Why It Doesn't Work — SE Ranking](https://seranking.com/blog/llms-txt/)
- [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — Google 官方把 llms.txt 列進「不用做」清單
- [Your site, your rules: new AI traffic options for all customers — Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/) — 2026-09-15 起的預設封鎖政策
- [AthenaHQ — YC 支持 GEO 工具](https://athenahq.ai)
- [Ahrefs Brand Radar — AI 品牌知名度追蹤](https://ahrefs.com/brand-radar)
- [Semrush AI Visibility Toolkit](https://www.semrush.com/)（現屬 Adobe）
- [HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)
- [Otterly.AI](https://otterly.ai)
- [LLMrefs — LLM 品牌提及追蹤](https://llmrefs.com/)
- [Am I Cited — AI Citation 追蹤](https://www.amicited.com)
- [AI Citation Tracker Chrome Extension](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)
- [Decoding AI Citation Tracking](https://trydecoding.com/ai-citation-tracking/)
- [amplifying-ai/awesome-generative-engine-optimization（GEO 工具地圖）](https://github.com/amplifying-ai/awesome-generative-engine-optimization)
- [geotoolco/AEO-Answer-Engine-Optimization](https://github.com/geotoolco/AEO-Answer-Engine-Optimization)
- [DavidHuji/Awesome-GEO（學術論文集）](https://github.com/DavidHuji/Awesome-GEO)
- [Best AEO/GEO Tracking Tools — aiclicks](https://aiclicks.io/blog/best-aeo-tracking-tools)
- [Profound vs Ahrefs Brand Radar 比較](https://www.tryprofound.com/blog/ahrefs-brand-radar-review)
