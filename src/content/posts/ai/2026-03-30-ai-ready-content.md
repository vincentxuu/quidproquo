---
title: "AI-Ready Content：把網站變成 AI 可讀的資料來源，完整指南"
date: 2026-03-30
type: guide
category: ai
tags: [ai-ready-content, llms-txt, geo, rag, web-scraping, structured-data, mcp, seo, rsl, webmcp]
lang: zh-TW
tldr: "2025–2026 年，網站不只要給人看，還要給 AI 看。從 llms.txt、Schema Markup、GEO 到 RAG ingestion pipeline，這篇整理了讓你的網站變成 AI 可用資料來源的完整技術地圖。"
description: "完整解析 AI-ready content 領域：llms.txt 標準、GEO（Generative Engine Optimization）、結構化資料、RAG ingestion pipeline、AI 爬蟲工具比較，以及如何讓你的網站在 AI 搜尋時代被引用。"
draft: false
series:
  name: "AEO / GEO 與 AI 搜尋"
  order: 3
---

2025 年，一個新問題浮現：**你的網站在 ChatGPT 裡看得到嗎？**

這篇整理了「把網站變成 AI 可讀資料來源」這個領域的完整技術地圖。

> **2026-08 更新說明**：這篇原稿寫於 2026-03，當時引用了一批「傳統搜尋量將下降 25%」「60% 搜尋不產生點擊」之類的預測數字。這類數字的來源多半是廠商報告，彼此打架且無法複驗，這次翻新把它們拿掉了——底下保留的是有官方文件或可複驗研究支撐的部分，並在幾個關鍵處標明「後來被推翻」。整篇文章最大的變化是 llms.txt：Google 已經明說不使用它，第三方大規模日誌研究也顯示幾乎沒人讀它。

---

## 這個領域叫什麼？

你會看到很多名詞指向同一件事：

| 名詞 | 側重點 |
|------|--------|
| **AI-ready content** | 內容本身為 AI 消費而優化 |
| **LLM-friendly website** | 網站結構讓 LLM 容易理解 |
| **RAG-ready web** | 內容可以直接被 RAG pipeline 吃進去 |
| **AI ingestion pipeline** | 從網頁到向量資料庫的整條工程管線 |
| **GEO（Generative Engine Optimization）** | 行銷端：讓 AI 搜尋引用你的內容 |
| **LLMO / AEO / AIO** | 同一件事的不同縮寫 |

本質上分兩個面向：
1. **供給端**：我怎麼讓我的網站更容易被 AI 讀取和引用？
2. **需求端**：我怎麼把別人的網站內容拉進我的 AI 系統？

---

## 一、供給端：讓網站被 AI 看懂

### 1.1 llms.txt — 給 AI 的自我介紹

[llms.txt](https://llmstxt.org/) 是 Jeremy Howard（Answer.AI）在 2024 年提出的提案：在網站根目錄放一個 Markdown 檔，告訴 AI 系統你的網站是什麼。

**格式規範：**

```markdown
# 你的網站名稱

> 一段簡短摘要

詳細說明（任意 Markdown，但不能用 heading）

## Optional
- [文件名](url): 說明
- [API 文件](url): 說明
```

**跟 robots.txt 的差異：**

| | robots.txt | llms.txt |
|---|---|---|
| 用途 | 定義存取權限 | 提供理解脈絡 |
| 格式 | 純文字指令 | Markdown |
| 對象 | 搜尋引擎爬蟲 | LLM / AI 助手 |

**現況（2026-08，這一段跟原稿差最多）：**

- 仍然是社群提案，不是 IETF/W3C 正式標準
- Anthropic、Cloudflare、Stripe、Vercel、Astro 都有部署；Mintlify 為所有託管文件站台啟用，讓文件站的覆蓋率一次跳很高
- 採用率沒有想像中高：SE Ranking 掃 30 萬個網域，[只有 10.13% 有 llms.txt](https://seranking.com/blog/llms-txt/)
- **關鍵證據**：Ahrefs 分析 13.7 萬個網站的伺服器日誌，[97% 的 llms.txt 檔案從未被請求過](https://ahrefs.com/blog/llmstxt-study/)；有被請求的那些裡，只有 19.5% 的請求來自 AI bot，其餘多半是一般爬蟲和 GEO/AEO 稽核工具；而且**沒有任何 AI bot 會主動去試探不存在的 llms.txt**
- **Google 的正式立場**：2026-05 的[生成式 AI 最佳化指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)把 llms.txt 列進「不用做」清單，2026-06-15 又補了一則[文件更新](https://developers.google.com/search/updates)澄清——這類檔案「不會正面也不會負面影響你的能見度或排名」，想為了別的服務維護它是你的自由

**修正後的結論**：原稿寫「低成本、高潛力，先做不吃虧」，這個判斷過於樂觀。現在比較誠實的說法是：**低成本、低回報，但也沒有壞處**。它唯一有實據的用途是 AI 編程助理——Cursor、Copilot、Continue 這類工具在文件網站上確實會讀它。所以：

- 你的網站是**技術文件站**：值得做，讀者的 coding agent 會用到
- 你的網站是**一般部落格或行銷站**：做了也行，但不要期待它帶來 AI 搜尋能見度，更不要為它排優先順序

---

### 1.2 新興標準：RSL、Content Signals、WebMCP

llms.txt 不是唯一的新標準。2025–2026 年還冒出了幾個重要的協定：

#### RSL（Really Simple Licensing）

2025 年 9 月由 RSL Collective（RSS 共同創造者 Eckart Walther 共同創辦）推出。核心概念：**把機器可讀的授權和付費條款直接嵌入 robots.txt、HTTP headers、RSS feeds 和 HTML `<link>` 元素。**

- 定義使用類別：`ai-all`、`ai-input`、`ai-index`
- 支援定價模式：pay-per-crawl、pay-per-inference、subscription、free with attribution
- 1,500+ 媒體組織背書，Reddit、Yahoo、Medium、AP、Cloudflare、Stack Overflow 都支持
- 官方網站：[rslstandard.org](https://rslstandard.org/)

#### Cloudflare Content Signals

Cloudflare 擴展 robots.txt，新增三個訊號：

```
Content-signal: search=yes, ai-train=no, ai-input=no
```

- `search`：傳統搜尋索引
- `ai-train`：是否允許用來訓練模型
- `ai-input`：是否允許在推論時存取

以 CC0 授權釋出，Cloudflare 表示已在數百萬個受管網域的 robots.txt 中預設帶入。配套的 **Pay-Per-Crawl**（2025 年 7 月）用 HTTP 402（Payment Required）阻擋未付費的 AI 爬蟲。

**2026-07 的重大變化**（原稿沒有，但改變了整個賽局）：Cloudflare [宣布](https://blog.cloudflare.com/content-independence-day-ai-options/)把爬蟲分成 Search / Agent / Training 三類分別管控，並且自 **2026-09-15** 起，預設封鎖「混用型」爬蟲（同一個 agent 同時做搜尋、訓練、agent 用途）存取**有廣告的頁面**。這個預設值套用在新客戶、既有客戶的新站台，以及所有免費方案客戶。同時 Pay-Per-Crawl 演進成 **Pay-Per-Use**——按「內容產生價值」計費而非按抓取次數計費，首波合作對象是 Ceramic.ai 與 You.com。

值得記住的一句話：**robots.txt 是表態，CDN 層的封鎖才是執行**。Cloudflare 自己在 2025-08 就[公開指控 Perplexity 用未宣告的爬蟲繞過 no-crawl 指令](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/)——不管你怎麼寫 robots.txt，遵不遵守終究是對方的選擇。

#### WebMCP（Web Model Context Protocol）

2026 年 2 月的 W3C Draft Community Group Report，由 Google Chrome、Microsoft Edge 共同開發。

核心想法：**讓網站直接對瀏覽器內的 AI agent 暴露結構化工具**，不需要靠 screen-scraping。

```javascript
// 注意：註冊入口在 2026-05 的規格修訂中從 navigator 移到 document，
// navigator.modelContext 已於 Chromium 150 標記為 deprecated
await document.modelContext.registerTool({
  name: 'search_products',
  description: '搜尋產品目錄',
  inputSchema: {
    type: 'object',
    properties: { query: { type: 'string', description: '搜尋關鍵字' } },
    required: ['query'],
  },
  execute: async ({ query }) => {
    const results = await searchCatalog(query);
    return JSON.stringify(results);
  },
});
```

- 兩種 API：[Declarative](https://developer.chrome.com/docs/ai/webmcp/declarative-api)（標註 HTML form）和 [Imperative](https://developer.chrome.com/docs/ai/webmcp/imperative-api)（JavaScript）
- 有多層權限閘門：只在 origin-isolated 文件可用、受 `tools` Permissions Policy 管制（預設 `self`，跨來源 iframe 要 `allow="tools"`）、跨來源工具還要用 `exposedTo` 明確開放
- **狀態（2026-08）**：原稿寫「Chrome 146 Canary 早期預覽，預計 2026 下半年正式支援」，實際進度是自 **Chrome 149 起開放 origin trial**（可在正式環境試用），本機開發用 `chrome://flags/#enable-webmcp-testing`。仍未進 stable 預設開啟，規格也還在動——官方文件明寫「subject to change」
- 與 Anthropic 的 MCP 互補（不是取代）

**標準層生態總覽：**

| 標準 | 用途 | 狀態 |
|------|------|------|
| robots.txt | 存取控制 | 成熟 |
| llms.txt | 內容摘要 | 社群提案 |
| Content Signals | AI 使用偏好 | Cloudflare 部署中 |
| RSL | 授權與付費 | 1,500+ 組織背書 |
| WebMCP | Agent 互動介面 | W3C Draft，Chrome 149 origin trial |
| IETF AIPREF | AI 使用偏好（正式標準） | 制定中 |

---

### 1.3 結構化資料 — JSON-LD Schema Markup

JSON-LD 在 2026 年的角色是什麼，答案比原稿寫的複雜。

**先講最硬的一條證據**：Google 在 2026-05 的[官方指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)裡把「過度聚焦結構化資料」列進不必做的事——原文是結構化資料**不是生成式 AI 搜尋的必要條件**，也沒有任何專屬的 schema.org 標記；但仍建議繼續做，因為它決定你有沒有 rich result 資格。

原稿在這裡列了幾個常被轉載的數字（「有 schema 被引用機率 3.2 倍」「GPT-4 表現從 16% 提升到 54%」），這次翻新把它們拿掉了：樣本小（其中一份只有 73 個網站）、無對照組、且與 Google 的官方說法直接衝突。在只有廠商部落格轉述、找不到可複驗方法學的情況下，不該當成事實引用。

**同時也要注意「Google 說不必要」不等於「所有平台都不必要」**：Perplexity 自建索引、爬完整 HTML，structured data 在那條路徑上仍然會被讀到（見本系列第 4 篇的管線拆解）。合理的結論是：**把 schema 當 SEO 基本功做，不要當 AEO 銀彈**。

另外要提醒，Google 支援的 rich result 型別一直在縮編：`FAQPage` 2026-05-07 全面下架、`HowTo` 2023 年就停了、`WebSite` + `SearchAction` 的 sitelinks search box 2024-10 退場。標之前先查[官方支援清單](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)。

**2026 最佳實踐：**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "AI-Ready Content 完整指南",
  "author": {
    "@type": "Person",
    "name": "Vincent Hsu",
    "knowsAbout": ["AI", "RAG", "Web Development"]
  },
  "about": {
    "@type": "Thing",
    "name": "AI-Ready Content",
    "sameAs": "https://www.wikidata.org/wiki/Q..."
  }
}
```

**重點策略：**

| 策略 | 說明 |
|------|------|
| **Entity Depth** | 不只標 Article，要往下展開：Product → Manufacturer → Organization → Founder |
| **Wikidata 連結** | 用 `sameAs` 和 `mentions` 連到 Wikidata ID，這是 2026 Entity SEO 最強訊號 |
| **Content Parity** | Schema 裡的資料必須在頁面上可見，否則 Google 會標記為垃圾結構化資料 |
| **LLM 專屬屬性** | `knowsAbout`、`transcript`、FAQPage——可能不會觸發 rich result，但會影響 AI 引用 |

---

### 1.4 內容結構優化

LLM 不像人一樣「瀏覽」，它們需要明確的結構訊號來定位資訊：

**必做清單：**

- **語意化 HTML**：正確使用 H1 → H2 → H3 層級，不跳級
- **Answer-first**：前 200 字直接回答核心問題（AI 系統優先評估開頭內容）
- **FAQ 格式**：Q&A 結構是 LLM 最容易引用的格式
- **語意分塊**：每個段落一個概念，方便 AI 擷取特定事實
- **作者資訊**：匿名內容是 GEO 的減分項，AI 系統越來越重視作者可信度

---

### 1.5 技術層面

```
robots.txt       → 允許 AI 爬蟲（GPTBot、ClaudeBot、PerplexityBot）
llms.txt         → 提供網站摘要
sitemap.xml      → 列出所有頁面
JSON-LD Schema   → 提供結構化語意
語意化 HTML       → 清晰的內容層級
```

確認你的 `robots.txt` 沒有擋錯 AI 爬蟲。原稿這裡只列了三個 user-agent，但各家早就把「訓練」「搜尋索引」「使用者觸發抓取」拆開了，只開訓練用的那個等於自願從搜尋答案裡消失：

```
# OpenAI — OAI-SearchBot 才是決定你出不出現在 ChatGPT 搜尋答案裡的
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: GPTBot          # 訓練用，要不要開是另一個決定
Allow: /

# Anthropic
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: ClaudeBot       # 訓練用
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /
```

幾個容易踩的點：

- `Google-Extended` 只管 Gemini Apps 與 Vertex AI 生成式 API，**不影響 Google 搜尋**——擋掉它不會讓你從 AI Overviews 消失，因為 AI Overviews 走的是 Googlebot（[官方文件](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended)）
- `Perplexity-User` 是使用者觸發的抓取，Perplexity 官方明說它**一般不遵守 robots.txt**（[官方文件](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)）
- 各家的 user-agent 清單會變（OpenAI 在 2026 年多了 `OAI-AdsBot`），別把它硬編進設定檔就不管了；官方文件在[OpenAI](https://platform.openai.com/docs/bots)、[Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)、[Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

---

## 二、需求端：把網頁內容拉進 AI 系統

### 2.1 AI 爬蟲工具比較

傳統爬蟲輸出 HTML，AI 爬蟲輸出 **Markdown / JSON**——token-efficient、保留結構、適合 chunking。

| 特性 | [Firecrawl](https://github.com/firecrawl/firecrawl) | [Crawl4AI](https://github.com/unclecode/crawl4ai) | Jina Reader |
|------|-----------|----------|-------------|
| **類型** | SaaS API（開源自架可行） | 開源 Python | Hosted API |
| **輸出** | Markdown / JSON | Markdown / JSON | Markdown / JSON |
| **最適合** | RAG pipeline、LangChain 整合 | 自建、隱私優先團隊 | 快速原型 |
| **AI 萃取** | Schema-based | 支援 local LLM | 有限 |
| **Anti-Bot** | 付費方案支援 | 要自己處理 | 有限 |
| **MCP Server** | ✅ | ❌ | ✅ |

**這裡刻意不寫價格**：三家的免費額度與價格帶在這一年內都改過不只一次，寫死只會誤導。要決策請直接看各家 pricing 頁。真正該拿來取捨的是這三件事：

1. **反爬蟲要誰扛**：目標站點有 Cloudflare / Datadome 的話，自架方案的維護成本會遠超過 SaaS 價差
2. **資料能不能出境**：金融、醫療的內容常常一開始就排除掉 hosted API，這時候只剩 Crawl4AI 這類自架選項
3. **是不是一次性**：原型階段用 hosted API 拿 Markdown 最快；穩定的每日增量抓取才值得自己搭基礎設施

**選擇建議：**
- **Firecrawl**：深度整合 LangChain 生態、需要 managed service
- **Crawl4AI**：要完全控制、有 Python 基礎設施、在意隱私（金融/醫療）
- **Jina Reader**：原型階段、想快速拿到 Markdown、不想管基礎設施

---

### 2.2 RAG Ingestion Pipeline 架構

把網頁內容送進 AI 系統的標準管線，2026 年已經從 ETL 演化成 **PTI（Parse-Transform-Index）**：

```
網頁 → 爬取 → 解析（Parse） → 轉換（Transform） → 索引（Index） → 向量 DB
                  ↓                    ↓                    ↓
            HTML → Markdown      Chunking + Metadata    Embedding + Store
            表格/圖片處理        摘要生成、實體抽取       HNSW / IVF 索引
```

**三代 RAG 架構演進：**

| 世代 | 名稱 | 特徵 |
|------|------|------|
| 第一代 | **Naive RAG** | 線性：Index → Retrieve → Generate |
| 第二代 | **Advanced RAG** | 加入 pre/post-retrieval 優化（query rewrite、reranking） |
| 第三代 | **Modular RAG** | 模組可替換、支援 adaptive retrieval、multi-agent 協作 |

**2026 關鍵趨勢：**

- **Agentic RAG**：不再是「查一次、生一次」，而是推理迴圈 + 多步檢索 + 動態查詢改寫
- **RAG as Context Engine**：從「檢索增強生成」進化成「智慧檢索」核心能力
- **Traceability > Accuracy**：2026 年 RAG 系統的評判標準不只是答對，而是能否證明答案來源
- **Multimodal Ingestion**：純文字 RAG 在遇到圖表、表格時會失敗，multimodal 處理成為必要
- **Hybrid Retrieval**：語意搜尋 + 關鍵字搜尋混合，更穩健

---

### 2.3 MCP（Model Context Protocol）— AI 工具整合標準

MCP 不是爬蟲，是控制面（control plane）——標準化 AI 模型呼叫外部工具的介面。

**現況（2026 初）：**
- Anthropic 2024 年 11 月推出，2025 年 12 月捐給 Linux Foundation AAIF
- 月下載量超過 9,700 萬次（Python + TypeScript SDK）
- Anthropic、OpenAI、Google、Microsoft、Amazon 全部採用

**跟 AI-ready content 的關係：**

```
MCP Server（爬蟲/API）  →  AI Agent  →  使用者
     ↓
 Firecrawl MCP Server
 Apify MCP Server（4000+ Actors）
 自建 MCP Server（包裝你的 API）
```

MCP 讓 AI agent 可以即時存取網頁內容，但爬取本身仍然需要基礎設施（headless browser、proxy、rate limit）。

**2026 Roadmap 重點：**
- Streamable HTTP 讓 MCP server 可以跑在遠端
- `.well-known` metadata 讓 server 可被發現（不需要建立連線就能知道能力）
- 企業級：audit trail、SSO 整合、gateway 行為標準化

---

## 三、GEO — 行銷端的 AI 可見性

GEO（Generative Engine Optimization）是這個領域的行銷面：讓你的內容被 AI 搜尋引用。

**為什麼重要：** 原稿在這裡列了一串成長率與使用者數（「AI 導流 session 年增 527%」「AI Overviews 每月觸及 20 億使用者」等）。這類數字每季都在變、來源多半是廠商報告，這次翻新拿掉了。真正該記住的只有一件事：**AI 生成的答案通常只引 2–7 個來源，而傳統搜尋給你 10 個藍色連結**——分母小了一個數量級，這才是 GEO 和 SEO 賽制的根本差異。

至於「我到底有沒有被引用」，2026-06 之後 Google Search Console 有官方的[生成式 AI 曝光報表](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)可以看自己的數字，比看別人的市場報告可靠得多。

**GEO vs SEO：**

| | SEO | GEO |
|---|---|---|
| 目標 | 排進 10 個藍色連結 | 被 AI 回答引用（通常只引 2-7 個來源） |
| 排名因素 | 反向連結、關鍵字 | 結構、可信度、新鮮度 |
| 衰退速度 | 排名可持續數年 | AI 引用每週都在輪替 |
| 衡量指標 | 排名、流量 | AI 引用頻率、Share of Voice、引用情感 |

**GEO 六大策略：**

1. **語意分塊**：內容分成 AI 可獨立擷取的段落
2. **Answer-first**：前 200 字直接回答，AI 優先評估開頭
3. **技術標記**：Schema Markup（`Article`、`Organization`、`BreadcrumbList`——`FAQ`/`HowTo` 的 rich result 已經下架）+ 不擋錯 AI 爬蟲。llms.txt 從這一項降級成「可選」，理由見前面 1.1 節
4. **作者可信度**：有名字、有經歷、有外部可驗證的存在
5. **內容新鮮度**：AI 引用衰退比 SEO 排名快得多，持續更新是必要的
6. **第三方背書**：Princeton 研究顯示 AI 強烈偏好 earned media 而非品牌自有內容

---

## 四、內容授權與變現

AI 爬蟲在 2025 年成為網站流量的重要來源——但也引發了「你拿我的內容去訓練模型，我得到了什麼？」的問題。

**授權交易的規模**：2025 年起大型出版商陸續與 AI 公司簽約（News Corp–OpenAI、OpenAI–Axios、Google–AP、Meta 與多家新聞集團），Perplexity 也開了 Comet Plus 出版商收入池。個別金額多半來自媒體報導而非雙方揭露，這裡不逐筆列，因為數字會被續約與改版洗掉。Cloudflare 在 2026-07 的說法是過去一年間業界簽了 50 筆以上的內容授權協議。

真正對一般網站有意義的是下面這層——**你不需要有談判籌碼也能用的技術執行機制**：

**技術執行機制：**

| 機制 | 說明 |
|------|------|
| Cloudflare Pay-Per-Crawl / Pay-Per-Use | 原本用 HTTP 402 對未付費爬蟲收費；2026-07 起演進成 Pay-Per-Use，按內容產生的價值計費 |
| RSL 授權協定 | 機器可讀的付費條款嵌入 robots.txt |
| IAB Tech Lab CoMP | 標準化從 pay-per-crawl 到 outcome-based 的變現模式 |

**crawl-to-refer 比率**（爬了幾頁換來一次導流）是這一年出版商最常拿出來的指標，各家 AI 平台的數字差距很大，而且隨著各家調整爬蟲策略持續在變。原稿列的排名來自單一時點的問卷，這次拿掉；要看數字建議直接讀 Cloudflare Radar 這類持續更新的來源，或自己從 access log 算——後者反而最準，因為它算的是你自己的站。

---

## 五、Agentic Web — 下一步

2026 年的新趨勢：AI agent 不只是「讀」網站，而是「用」網站——瀏覽、比較、下單、完成交易。

- 各家的瀏覽器 agent 都已進入產品：ChatGPT 的瀏覽器操作、Anthropic 的 Computer Use、Google 的 AI Mode
- Google 在 2026-05 的官方指南裡首度為此給了指引：browser agent 會**看截圖、讀 DOM、解析 accessibility tree** 來完成任務，並建議參考 web.dev 的 [agent-friendly 網站最佳實務](https://web.dev/articles/ai-agent-site-ux)
- 同一份文件點名了 [Universal Commerce Protocol（UCP）](https://ucp.dev/latest/)——讓 Search agent 從「檢索與摘要」走到「交易」的新興協定

**這對網站意味著什麼？**

網站將同時服務兩種受眾：**人類**（視覺、互動）和**機器**（結構化、語意、API 驅動）。WebMCP 就是這個方向的具體協定——讓每個網站變成 AI agent 的工具介面。

有意思的是，Google 給的 agent-friendly 建議跟「無障礙」高度重疊：用真正的 `<button>` 和 `<a>`、把 label 綁到 input、版面在不同狀態下保持穩定、移除隱形遮罩。也就是說，把 accessibility 做好，順便就把 agent readiness 做好了大半——這比追任何 AI 專用標記都划算。

行銷漏斗也要為 AI agent「使用者」優化，不只是人類。你的下一個最大「使用者」可能不是人。

---

## 六、完整技術堆疊一覽

如果你要從零開始讓一個網站「AI-ready」，這是完整的 checklist：

### 供給端（讓你的網站被 AI 讀取）

```
□ robots.txt 分別檢查搜尋型（OAI-SearchBot、Claude-SearchBot、PerplexityBot）
  與訓練型（GPTBot、ClaudeBot）user-agent，不要一起處理
□ 確認 Google-Extended 的設定是刻意的（它不影響 Google 搜尋與 AI Overviews）
□ 設定 Cloudflare Content Signals（控制 ai-train / ai-input）
□ 確認自家 CDN 的 AI bot 預設值——Cloudflare 2026-09-15 起會改預設
□ JSON-LD Schema Markup（Article、Organization、BreadcrumbList）
□ 語意化 HTML（正確的 heading 層級）
□ Answer-first 內容結構
□ 作者資訊（姓名、經歷、外部連結）
□ sitemap.xml 保持更新
□ 在 Search Console 開生成式 AI 曝光報表（有放行到你的資源的話）
□ 內容定期更新（對抗 AI 引用衰退）
□ 評估 RSL 授權條款（如果你是出版商）
□ 關注 WebMCP（Chrome 149 origin trial）與 agent-friendly 的頁面設計
□ （可選）/llms.txt——技術文件站值得做，一般站台效益未經證實
```

### 需求端（把網頁內容送進你的 AI 系統）

```
□ 選擇爬蟲工具（Firecrawl / Crawl4AI / Jina Reader）
□ 設計 PTI pipeline（Parse → Transform → Index）
□ Chunking 策略（語意分塊 + metadata）
□ Embedding + 向量資料庫（Pinecone / Weaviate / Qdrant / Cloudflare Vectorize）
□ Hybrid retrieval（語意 + 關鍵字）
□ MCP Server 整合（讓 AI agent 即時存取）
□ 增量更新機制（不需要每次全部重建索引）
□ Traceability（每個答案可追溯到來源）
```

---

## 結語

「把網站變成 AI 可讀的資料來源」不是單一技術，是一整個生態系：

- **標準層**：llms.txt、Schema Markup、robots.txt、RSL、Content Signals
- **工具層**：Firecrawl、Crawl4AI、Jina Reader
- **協定層**：MCP、WebMCP、A2A
- **管線層**：PTI pipeline、RAG 架構
- **變現層**：Pay-Per-Crawl、RSL 授權、出版商交易
- **策略層**：GEO、LLMO
- **未來層**：Agentic Web、AI agent 商務

這個領域在 2025–2026 年正在經歷類似早期 SEO 的爆發期。差別是：SEO 花了十年成熟，AI-ready content 可能只需要兩年。

現在開始做，成本低、風險小、先行者優勢明確。等到變成標準配備時再追，就晚了。

## 參考資料

- [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — Google 2026-05 官方指南，含 llms.txt / chunking / 結構化資料的「不用做」清單
- [Google Search 文件更新記錄](https://developers.google.com/search/updates) — 2026-06-15 的 llms.txt 澄清、FAQ rich result 退場時間點
- [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read — Ahrefs](https://ahrefs.com/blog/llmstxt-study/) — llms.txt 實際被讀取率的大規模日誌研究
- [LLMs.txt: Why Brands Rely On It and Why It Doesn't Work — SE Ranking](https://seranking.com/blog/llms-txt/) — 30 萬網域的採用率調查
- [Your site, your rules: new AI traffic options for all customers — Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/) — 2026-07-01 公告，Search/Agent/Training 分類與 2026-09-15 預設封鎖
- [Cloudflare Content Signals Policy](https://blog.cloudflare.com/content-signals-policy/)
- [Perplexity is using stealth, undeclared crawlers — Cloudflare](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) — robots.txt 是表態不是強制的實例
- [Overview of OpenAI Crawlers](https://platform.openai.com/docs/bots)
- [Anthropic 爬蟲說明](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Google crawlers 與 Google-Extended 說明](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended)
- [WebMCP — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp) 與 [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) — 現行 `document.modelContext` 用法與 origin trial 狀態
- [webmachinelearning/webmcp](https://github.com/webmachinelearning/webmcp) — WebMCP explainer 與規格討論
- [Agent-friendly website best practices — web.dev](https://web.dev/articles/ai-agent-site-ux)
- [Universal Commerce Protocol](https://ucp.dev/latest/)
- [llms.txt Proposal](https://llmstxt.org/) — Jeremy Howard 提出的 llms.txt 規範，給 AI 的網站自我介紹標準
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — arXiv 論文，Naive RAG、Advanced RAG、Modular RAG 三代架構的學術綜述
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction) — MCP 官方文件，AI agent 工具整合的標準控制面
- [Firecrawl GitHub Repository](https://github.com/firecrawl/firecrawl) — AI-ready 爬蟲工具，將網頁轉換為 LLM 可消費的 Markdown
- [Crawl4AI GitHub Repository](https://github.com/unclecode/crawl4ai) — 開源 AI 爬蟲框架，支援本地 LLM 萃取
- [RSL Standard](https://rslstandard.org/) — Really Simple Licensing 官方網站，機器可讀授權標準
- [Schema.org](https://schema.org/) — 結構化資料詞彙標準，JSON-LD Schema Markup 的定義來源
- [Google Search Central: Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) — Google 官方結構化資料指南，AI 引用最佳化的技術基礎
