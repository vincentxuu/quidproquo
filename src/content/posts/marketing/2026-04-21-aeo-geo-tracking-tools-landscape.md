---
title: "AEO / GEO 追蹤工具盤點：從 aeo-radar 到 Profound，開源自架與商業 SaaS 的取捨"
date: 2026-04-21
category: marketing
tags: [aeo, geo, ai-visibility, brand-monitoring, open-source, self-hosted, llm, ai-seo, cloudflare, agent-readiness, llms-txt, mcp]
lang: zh-TW
tldr: "想追蹤品牌在 ChatGPT / Perplexity / Gemini / Claude 裡被怎麼提到，選擇光譜很長——從 $0 自架的 aeo-radar、AiCMO，到月費 $500+ 的 Profound、AthenaHQ。輸入面還有 Cloudflare 的 isitagentready 可以健檢。這篇拆解各類工具的設計邏輯與取捨。"
description: "盤點 AEO / GEO 工具地圖：開源自架（aeo-radar、AiCMO、geo-aeo-tracker、llm-brand-tracker）、商業 SaaS（Profound、AthenaHQ、Evertune、Ahrefs Brand Radar）、Cloudflare 的網站 agent readiness 健檢工具 isitagentready，以及做類似專案時的共通架構。"
draft: false
---

AEO / GEO 工具這兩年從「SEO 廠商延伸功能」冒出一整個獨立類別。動機很直接：Google 搜尋仍然重要，但越來越多使用者直接問 ChatGPT、Perplexity、Gemini、Claude，得到一段合成過的答案——而答案裡有沒有你的品牌、排第幾個、引用了誰的內容，傳統 SEO 指標完全看不到。

這篇盤點這個空間的工具地圖，依「開源自架」「商業 SaaS」「資源目錄」「單次健檢」四層切開，最後拉出共通架構，給想自己做類似工具（或寫選型報告）的人一個對照表。

## 開源自架：aeo-radar 和它的同類

這類專案的核心賣點都一樣：**不要每月 $200–$500 給 SaaS，資料和 prompt 留在自己機器上**。差異在技術棧和資料取得方式。

**[aeo-radar](https://github.com/hellowalt/aeo-radar)**（這篇的出發點之一）用 Playwright 每天 headless 爬 AI 介面、不需要 API key，抓回來的答案交給 Claude CLI 做結構化萃取（品牌是否被提到、情感、競品、引用來源），存進 SQLite，Next.js 16 + Ant Design 畫儀表板。繁中先行、主打非英文市場是明確的取捨——英文市場已經紅海，非英文市場的 AEO 資料反而是商業 SaaS 長期忽略的縫隙。

**[AICMO/ai-cmo](https://github.com/AICMO/ai-cmo)** 是完成度更高的開源選項，Vue + Python + TypeScript，Docker 一鍵起，明確支援 ChatGPT / Gemini / Perplexity / Claude 四家。定位接近「開源版 Profound」，但需要自己帶 OpenAI + Vertex AI 憑證。

**[danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)** 技術棧跟 aeo-radar 最像（Next.js 16、TypeScript、Recharts），功能面比較滿——13 個分頁、6 個 AI 模型同追蹤、6 階段 SRO 分析、引用機會掃描、競品 battlecard。資料面用的是 Bright Data 的 Web Scraper API，優點是不用自己維護反爬策略，缺點是 Bright Data 不免費。

**[sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)** 走的是另一條路——不直接爬 AI 介面，而是呼叫 OpenAI API，自動爬你的品牌網站、用網站內容產生一批 prompt 去問 ChatGPT，分析回應裡的品牌與來源網域。優點是合法乾淨、不擔心反爬；缺點是你拿到的是「API 版 ChatGPT 怎麼看你」，跟「網頁版 ChatGPT 使用者看到什麼」有差距——網頁版有即時搜尋，API 沒有。

輕量選項還有 [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer) 和 [getcito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool)，前者是 Python 小工具，後者自稱首個開源 AIO/AEO/GEO 工具。

## 商業 SaaS：光譜從 free tier 到六位數企業合約

純 AEO/GEO 廠商：

- **[Profound](https://www.tryprofound.com/)** — Series B $35M，enterprise 旗艦。跟 Fortune 500 簽年約那一個 tier
- **[AthenaHQ](https://athenahq.ai)** — YC 支持，前 Google / DeepMind 班底
- **[Evertune](https://www.evertune.ai/)** — 主打 AI 搜尋 customer journey 全流程
- **[Peec.ai](https://peec.ai)**、**[Scrunch](https://scrunch.com)**、**[Goodie](https://goodie.ai)**、**[Bluefish AI](https://bluefish.ai)**、**[ZipTie](https://ziptie.ai)**、**[Knowatoa](https://knowatoa.com)** — 中段班，功能接近、差在 UI 和價格
- **[Otterly.AI](https://otterly.ai)**、**[LLMrefs](https://llmrefs.com/)**、**[AIclicks](https://aiclicks.io/)**、**[Rankscale](https://rankscale.ai/)** — 偏向中小團隊訂閱

傳統 SEO 大廠延伸出的 AEO 模組：

- **[Ahrefs Brand Radar](https://ahrefs.com/brand-radar)** — 2025/3 推出，直接併進 Ahrefs 主訂閱
- **[SEMrush AI Visibility Toolkit](https://semrush.com)**
- **[SE Ranking AEO Tool](https://seranking.com/answer-engine-optimization-tool.html)**
- **[HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)** — 免費，28 天試用含 10 組 ChatGPT prompt
- **[Writesonic GEO](https://writesonic.com/)** — 追蹤 + 內容生成綁一起

SaaS 端的競爭焦點已經從「有沒有追 ChatGPT」變成「引用來源分析深度」「hallucination 偵測」「跨平台 share of voice 歸因」。純追蹤功能會越來越 commodity。

## 資源目錄：盤點時的 meta 層

不是工具、而是工具清單：

- [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization) — 目前最完整的 GEO 工具地圖
- [geotoolco/AEO-Answer-Engine-Optimization](https://github.com/geotoolco/AEO-Answer-Engine-Optimization) — 連社群、外掛、顧問公司都列
- [izak-fisher/generative-engine-optimization-tools](https://github.com/izak-fisher/generative-engine-optimization-tools)
- [luka2chat/awesome-geo](https://github.com/luka2chat/awesome-geo)
- [tentenco/awesome-geo](https://github.com/tentenco/awesome-geo)
- [DavidHuji/Awesome-GEO](https://github.com/DavidHuji/Awesome-GEO) — 學術論文集，研究 GEO 演算法本身用的

## 單次健檢：輸入面 vs. 輸出面

上面列的工具都在追蹤「品牌被 AI 怎麼提到」——**輸出面**。但做 AEO 另一半是**輸入面**：你的網站本身有沒有準備好讓 AI agent 讀取？這是完全不同類別的工具。

**[isitagentready.com](https://isitagentready.com/)**（Cloudflare 出）是目前最完整的輸入面健檢。貼網址、選 Content Site / API / All Checks，掃出一份分數報告，檢查四個面向：Discoverability（robots.txt、sitemap、llms.txt）、Content（Markdown content negotiation、結構化資料）、Bot Access Control（AI 爬蟲宣告）、Capabilities（MCP endpoint、OAuth、Agent Skills、agentic commerce）。Cloudflare 自己公布的掃描統計很狠——全網站只有 4% 宣告 AI 使用偏好、3.9% 支援 Markdown 協商。定位類似「給 AI agent 用的 Lighthouse」，免費、不用註冊。

**[HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)** 則是輸出面的單次掃描——給你 10 組 ChatGPT prompt，看品牌出不出現。28 天免費。

這兩個工具合在一起是做 AEO 專案的起手式：先用 isitagentready 把輸入面補齊（這是你能完全控制的），再用輸出面工具（aeo-radar 自架或 HubSpot Grader 試用）看品牌實際怎麼被提到。

## 共通架構

把開源專案拆開，會發現大家做的事情其實是同一套 pipeline：

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

- **只想快速看一眼品牌在 AI 搜尋裡長什麼樣**：HubSpot AEO Grader 免費試，或 Ahrefs Brand Radar（如果本來就訂）
- **想先確認網站本身有沒有準備好給 agent 讀**：isitagentready 掃一次，把 llms.txt、robots.txt、MCP 缺的補齊
- **要長期追蹤、不想每月付月費、有一台家用伺服器**：aeo-radar（如果是繁中市場最順）、AiCMO（功能最完整）、geo-aeo-tracker（UI 最完整但要 Bright Data）
- **要做自己的 AEO 產品或寫研究報告**：讀 aeo-radar 和 AiCMO 的 source code，再掃一次 awesome list
- **企業級、需要法遵 + SLA + 客戶經理**：Profound 或 AthenaHQ
- **預算在中間、只追單一平台**：Otterly.AI 或 LLMrefs

## 整體來說

AEO 工具這個類別在 2025 上半年還是 SaaS 廠商的戰場，到 2026 年開源方案已經補齊到「中小團隊自架就夠用」的水準。aeo-radar 這種繁中先行、Playwright 無 key 爬取、Claude CLI 分析的組合，在兩年前連技術路徑都不存在——能這樣做是因為 headless browser、LLM CLI、Next.js App Router 這幾塊同時成熟。

這也是為什麼現在自己做一個 AEO 工具的進入門檻比看起來低很多：核心不是「寫爬蟲和儀表板」，而是「選對 prompt、選對分析邏輯、選對資料呈現方式」。工具只是殼。

## 參考資料

- [hellowalt/aeo-radar（README 繁中）](https://github.com/hellowalt/aeo-radar/blob/main/README.zh-TW.md)
- [AICMO/ai-cmo](https://github.com/AICMO/ai-cmo)
- [danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)
- [merdandt/geo-aeo-tracker-bright-data](https://github.com/merdandt/geo-aeo-tracker-bright-data)
- [sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)
- [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer)
- [ai-search-guru/getcito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool)
- [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization)
- [geotoolco/AEO-Answer-Engine-Optimization](https://github.com/geotoolco/AEO-Answer-Engine-Optimization)
- [DavidHuji/Awesome-GEO](https://github.com/DavidHuji/Awesome-GEO)
- [isitagentready.com - Cloudflare](https://isitagentready.com/)
- [Introducing the Agent Readiness score - Cloudflare Blog](https://blog.cloudflare.com/agent-readiness/)
- [Profound](https://www.tryprofound.com/)
- [AthenaHQ](https://athenahq.ai)
- [Evertune](https://www.evertune.ai/)
- [Ahrefs Brand Radar](https://ahrefs.com/brand-radar)
- [HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)
- [Otterly.AI](https://otterly.ai)
- [LLMrefs](https://llmrefs.com/)
- [Best AEO/GEO Tracking Tools (aiclicks)](https://aiclicks.io/blog/best-aeo-tracking-tools)
- [Profound vs Ahrefs Brand Radar Review](https://www.tryprofound.com/blog/ahrefs-brand-radar-review)
