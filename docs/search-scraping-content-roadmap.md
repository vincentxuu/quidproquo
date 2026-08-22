# 搜尋、爬取、工具介紹與私有語料內容規劃

## Requirements Summary

- 盤點現有「搜尋與爬取實戰」、相鄰工具文、文件解析與 RAG 內容。
- 保留有閱讀順序的系統系列；單一產品的具體用法維持獨立工具介紹，不另建「工具系列」。
- 新題必須補現有內容缺口，不能重寫既有工具比較、RAG 技法或文件解析文章。
- 規劃同時涵蓋公開網路取得、工具實作與私有語料，但用清楚邊界和交叉連結串接。

## Evidence-backed Inventory

### 1. 「搜尋與爬取實戰」已是完整主幹

系列定義本來就涵蓋「雲端或自架搜尋、爬取選型、反爬與研究流程」，不是純工具選型（`src/utils/series.ts:93-100`）。目前 order 1–13 的中英雙語文章均已建立；order 1–7、9、11–13 已發布，order 8、10 因缺完整 raw benchmark 維持 draft：

1. 搜尋 MCP 選型（`src/content/posts/ai/2026-05-07-ai-search-mcp-tools.md:2-12`）
2. 自架搜尋方案決策（`src/content/posts/ai/2026-08-21-self-hosted-search-stack.md:2-20`）
3. SearXNG + Crawl4AI 實作（`src/content/posts/ai/2026-08-21-searxng-crawl4ai-setup.md:2-24`）
4. 34 個爬蟲工具選型（`src/content/posts/ai/2026-07-25-ai-web-scraping-tools-landscape.md:2-10`）
5. Cloudflare 反爬 fallback（`src/content/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent.md:2-24`）
6. Local Deep Research 工具與流程（`src/content/posts/ai/2026-05-08-local-deep-research-walkthrough.md:2-20`）
7. Search／Fetch／Crawler／Browser fallback 路由（`src/content/posts/ai/2026-08-21-web-retrieval-fallback-routing.md`）
8. Web Retrieval Benchmark（draft；`src/content/posts/ai/2026-08-21-web-retrieval-benchmark.md`）
9. Agent 搜尋 query 改寫（`src/content/posts/ai/2026-08-22-agent-search-query-writing.md`）
10. 網頁抽取品質實測（draft；`src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark.md`）
11. 搜尋結果到可靠引用（`src/content/posts/ai/2026-08-22-search-results-reliable-citations.md`）
12. 學術搜尋管線（`src/content/posts/ai/2026-08-22-academic-search-pipeline.md`）
13. 登入網站的 session 與權限邊界（`src/content/posts/ai/2026-08-22-authenticated-web-agent-safety.md`）

接下來的主系列工作不是再增加 order，而是補齊 order 8、10 的可重跑實測證據，再決定是否將兩篇解除 draft。

### 2. 工具介紹已有健康的獨立文章模式

- Exa 已有原理、定價、API 層與限制專文（`src/content/posts/ai/2026-08-21-exa-neural-search-for-agents.md:20-124`）；下一篇只能補 SDK／schema／production 實作，不能再寫一次「Exa 是什麼」。
- OpenClaw 的搜尋與瀏覽器能力留在自己的產品導讀系列（`src/content/posts/ai/2026-03-28-openclaw-tools-browser-search.md:16-22`）。
- 瀏覽器工具比較已有獨立系列，不應在新的 fallback 文重新比較 Playwright／Puppeteer／CDP（`src/utils/series.ts:47-54`）。
- 文件轉換、抽取與 OCR 已有「文件解析實戰」，crawler ingestion 不應再重講 HTML／PDF 轉 Markdown（`src/utils/series.ts:76-82`）。

### 3. 私有語料的檢索技法已高度飽和

「RAG 技法大全」已涵蓋 embedding、vector DB、hybrid search、reranker、chunking、fusion、evaluation、cold start 與 observability（系列邊界見 `src/utils/series.ts:30-37`）。直接重複的代表文章包括：

- Vector DB 選型：`src/content/posts/ai/2026-03-12-vector-database-comparison.md`
- Hybrid Search：`src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md`
- Reranker：`src/content/posts/ai/2026-03-12-cross-encoder-reranking.md`
- RAG 評估：`src/content/posts/ai/2026-03-12-rag-evaluation-frameworks.md`
- 冷啟動與增量索引：`src/content/posts/ai/2026-03-12-rag-cold-start.md`
- Ingestion 品質管線：`src/content/posts/ai/2026-04-18-knowledge-pipeline-rag-quality-control.md`

真正未被完整處理的是私有資料生命週期：connector、canonical ID、checksum、增量 upsert、tombstone、ACL、刪除傳播、freshness SLA 與 embedding migration。

## Tool Universe

工具池遠大於目前排定的文章。以下地圖用來區分「市場上有哪些」與「本站是否值得為它建立 canonical 工具文」。收錄不代表推薦，也不代表每個工具都要寫一篇。

免費方案、一次性試用、自架版本與官方資訊衝突已逐項記錄在 [2026-08-21 工具額度盤點](../../.research/2026-08-21-search-scraping-tool-free-tier-inventory.md)。該筆記以本節已列名工具為封閉範圍；任何正式文章刊出前仍須重查 SaaS 定價。

### A. 公開網路搜尋與取得

#### 搜尋 API／SERP

| 工具 | 主要定位 | 站內狀態 | 內容決策 |
|---|---|---|---|
| SearXNG | 自架元搜尋 | 已有完整介紹與組合實作 | 維護既有專文 |
| Exa | 神經搜尋與內容 API | 已有專文 | 擴寫原文，不新增 |
| Tavily | agent-oriented search API | 已有完整指南 | 維護既有專文 |
| Firecrawl Search | 搜尋加抓取 | 已與 crawler 能力合併成完整指南 | 維護既有專文 |
| Linkup | agent search API | 已有完整指南 | 維護既有專文 |
| Brave Search | 自有索引搜尋 API | 比較文已涵蓋 | 暫留比較文 |
| Bocha | 中文／中國網路搜尋 | 比較文已涵蓋 | 除非有中文實測，否則留比較文 |
| Serper／SerpAPI | Google SERP 包裝 | 比較文已涵蓋 | 合併在 SERP API 類型，不各寫一篇 |
| Bright Data | SERP、proxy、解鎖與資料 API | 比較文已涵蓋 | 適合場景／基建文，不優先單品文 |

#### Crawler／整站抓取

| 工具 | 主要定位 | 站內狀態 | 內容決策 |
|---|---|---|---|
| Crawl4AI | LLM-oriented crawler／Markdown／extraction | 已有完整介紹與組合實作 | 維護既有專文 |
| Firecrawl | 託管＋自架的 scrape／crawl／map／extract | 已有完整指南 | 維護既有專文 |
| Scrapy | 大規模規則式 crawler | 全景文已涵蓋 | 留在類型比較，除非有大型專案案例 |
| Crawlee | JS／TS crawler framework | 全景文已涵蓋 | 留在類型比較，或和 Scrapy 做實測比較 |
| Apify | crawler runtime／actor platform | 已有 Actor 平台完整指南 | 維護既有專文 |
| Maxun | no-code web extraction | 全景文已涵蓋 | 暫留比較文 |
| AnyCrawl／Craw4LLM | 新興 LLM crawler | 研究筆記收錄 | 觀察成熟度，不排文 |

#### Browser agent／互動自動化

| 工具 | 主要定位 | 站內狀態 | 內容決策 |
|---|---|---|---|
| Browser Use | autonomous browser agent | 已有完整指南 | 維護既有專文 |
| Stagehand | `act`／`extract`／`observe` browser API | 全景與 E2E 文提及 | 候選完整介紹或與 Browser Use 實測 |
| Skyvern | 視覺優先 browser agent | 全景文已涵蓋 | 暫留比較文 |
| Midscene.js | 視覺 UI automation | 已有專文 | 維護原文 |
| Playwright MCP | agent 操作網頁 | 已有專文與比較 | 不新增 |
| Chrome DevTools MCP | agent 診斷 Chrome | 已有專文與比較 | 不新增 |
| Puppeteer MCP | Puppeteer MCP server | 已有專文與比較 | 不新增 |
| Browser-MCP | 瀏覽器操作 MCP | 全景文提及 | 暫留比較文 |

#### 智慧抽取／正文抽取

| 工具 | 主要定位 | 站內狀態 | 內容決策 |
|---|---|---|---|
| Scrapling | 自適應 selector、反爬與抓取 | 已有完整指南 | 維護既有專文 |
| ScrapeGraphAI | 自然語言生成抽取 pipeline | 全景文已涵蓋 | 候選，先看可重現案例 |
| AgentQL | 語意式頁面查詢 | 已有完整指南 | 維護既有專文 |
| AutoScraper | 範例驅動 selector | 全景文已涵蓋 | 暫留比較文 |
| Parsera | 輕量 LLM extraction | 全景文已涵蓋 | 暫留比較文 |
| Trafilatura | 規則式正文抽取 | 全景／文件解析脈絡已提及 | 放進抽取 benchmark，不單寫 |
| Jina Reader | URL → Markdown service | 全景文已涵蓋 | 放進抽取 benchmark，不單寫 |
| Readability | 閱讀模式正文抽取 | 全景文已涵蓋 | 放進抽取 benchmark，不單寫 |
| Diffbot | 商業 knowledge extraction | 尚無主文 | 只有實際企業案例才排文 |

#### 反偵測、代理與執行基建

| 工具 | 主要定位 | 站內狀態 | 內容決策 |
|---|---|---|---|
| nodriver／Camoufox／stealth Playwright | browser anti-detection | Cloudflare 指南已涵蓋 | 更新既有文章 |
| curl_cffi | TLS fingerprint impersonation | 全景文已涵蓋 | 可做底層技術文，不優先工具介紹 |
| CloakBrowser | stealth Chromium | 全景文已涵蓋 | 暫留比較文 |
| botasaurus／SeleniumBase | Python stealth automation | 全景文已涵蓋 | 暫留比較文 |
| Browserbase | remote browser infrastructure | Stagehand 脈絡相關 | 若寫 Stagehand，再決定是否獨立 |
| Bright Data／Zyte／Oxylabs | proxy、unlocker、browser infrastructure | 零散涵蓋 | 適合商業基建比較，不逐家介紹 |

#### 監控與變更偵測

| 工具 | 主要定位 | 站內狀態 | 內容決策 |
|---|---|---|---|
| changedetection.io | 網頁差異監控 | 已有完整指南 | 維護既有專文 |
| sitemap／RSS／Webhook-based watcher | 來源更新訊號 | 私有語料規劃已涵蓋概念 | 放入增量同步方法文 |

### B. 私有語料與自建搜尋

這一群不屬於公開網路搜尋／爬取系列，另放「私有語料管線」與 RAG 脈絡。

| 工具群 | 代表工具 | 站內決策 |
|---|---|---|
| 全文搜尋 | Meilisearch、Typesense、Elasticsearch、OpenSearch、Pagefind、Tantivy | Meilisearch 已有完整介紹；其餘先做比較或依案例 |
| 向量資料庫 | Qdrant、Weaviate、Milvus、LanceDB、Chroma、pgvector、Vectorize、Pinecone | 已有選型文與 Qdrant 完整介紹；其餘由私有語料案例決定 |
| Embedding runtime | Ollama、TEI、Infinity、FastEmbed | Ollama 擴寫原文；其他適合 runtime 比較 |
| RAG framework | LlamaIndex、LangChain、Haystack | 不放搜尋與爬取工具池，各自依 framework 內容線處理 |

### C. 文件解析

MarkItDown、anydoc、pandoc、PyMuPDF、pdfplumber、MinerU、Marker、Docling、OCR／VLM 已由「文件解析實戰」系列承接。它們是「已經取得檔案之後」的工具，不重新塞回搜尋與爬取候選池。

### Canonical Tool Article Priority

#### 已完成 canonical 專文

1. SearXNG、Crawl4AI、Firecrawl、Scrapling、Browser Use。
2. Tavily、Linkup、AgentQL、Apify、changedetection.io。
3. Meilisearch、Qdrant。

下一輪不按工具名稱繼續擴張；只有出現可重現案例、既有文章無法吸收，而且能明確回答獨立問題時，才新增 canonical 專文。

#### 適合比較／benchmark，暫不逐一成文

- Scrapy vs Crawlee：規則式大型 crawler。
- Browser Use vs Stagehand vs Skyvern：browser agent。
- Crawl4AI vs Firecrawl vs Jina Reader vs Readability：抽取品質。
- Tavily vs Exa vs SearXNG：web retrieval。
- Bright Data vs Zyte vs Oxylabs：商業解鎖與代理基建。

這份優先序的目的不是縮小工具世界，而是避免把 50 個 README 改寫成 50 篇文章。完整工具地圖由比較文維護，只有設計獨特、能實際驗證且足以支撐一篇完整「認識＋實作」的工具才升格成 canonical 專文。

## Content Model

### A. 系列文

回答「整套系統如何選、如何組、如何驗證」。讀者應依順序閱讀，每篇補一個架構決定。

### B. 獨立工具介紹

回答「特定工具是什麼、為什麼值得用、怎麼設定、實際怎麼操作、會在哪裡失敗」。不建立工具系列；使用 tags、正文交叉連結與相關系列文導流。

**一個工具原則上只有一篇 canonical 工具介紹，而且一篇 canonical 工具介紹只負責一個工具。** 認識與實作是同一篇內的章節，不拆成上下篇或「介紹篇／實戰篇」：

1. 它解決什麼問題、核心機制是什麼。
2. 與替代方案的關鍵差異，以及適合／不適合情境。
3. 最小可運作的安裝與設定。
4. 真實使用方式、schema／API 與進階配置。
5. production 限制、錯誤處理、成本或維運邊界。
6. 可重跑的驗證方式與參考資料。

如果既有文章已經介紹該工具，就直接擴寫原文，不另開一篇只談實作。只有 benchmark、事故復盤或跨工具方法能獨立成立，因為它們回答的問題已不再是「這個工具怎麼用」。

多工具文章只負責「怎麼整合」：可以包含讓範例跑起來所需的最小設定，但每個工具的完整能力、進階配置與限制應回到各自的 canonical 工具文。

### C. 方法文

換掉工具名稱後仍成立，例如 fallback routing、web retrieval eval、incremental indexing。方法文可成為系列主幹。

## Roadmap

### Phase 0 — 先修閱讀地圖與內容邊界

1. 修正 Local Deep Research 文末「前面兩篇」已落後實際六篇的敘述，補完整系列入口（`src/content/posts/ai/2026-05-08-local-deep-research-walkthrough.md:163`）。
2. 在 Local Deep Research 與 Autonomous Deep Research 之間建立雙向連結；前者定位為工具案例，後者定位為跨工具方法架構（`src/content/posts/ai/2026-06-04-autonomous-deep-research-agent.md:65-80`）。
3. 將搜尋 MCP 比較文的 Exa 段落維持為短版比較，詳細機制導向 Exa 專文，避免兩邊同步維護價格與 API 細節（重疊起點：`src/content/posts/ai/2026-05-07-ai-search-mcp-tools.md:50`）。
4. 另開維護任務修正系列首頁 `latestDate`：目前先按 series order 排，再拿最後一篇日期，會把 order 6 的 2026-05-08 誤當成本系列最新日期（`src/utils/series.ts:298-317`）。這是程式 bug，不和文章批次混做。

### Phase 1 — 收尾「搜尋與爬取實戰」主系列

#### 7. AI Agent 上網取資料的 fallback 路由

**狀態**：中英文已發布。

暫定題名：**AI Agent 上網查資料的完整路由：Search、Fetch、Crawler、Browser 怎麼切換**

必須涵蓋：

- 已知 URL 直接 fetch、搜尋 API、crawler、browser、stealth browser 的責任邊界。
- 依 HTTP 狀態、空內容、JS shell、登入需求、challenge page、內容品質切換。
- retryable 與 non-retryable 錯誤、budget／depth 上限、快取、去重、來源紀錄。
- 一個可執行形狀的 router pseudocode 與 decision table。

不得重複：Browser MCP 工具橫向比較、Cloudflare bypass 細節、Deep Research 的規劃／停止／證據仲裁。

#### 8. Web Retrieval Eval 實測

**狀態**：中英文骨架已完成，維持 draft；尚未保存三條管道的完整 raw results、provider 參數、延遲與成本紀錄。

暫定題名：**Agent 搜尋品質怎麼驗收：Web Retrieval Benchmark 實作**

最低實測規格：

- 至少 30 個固定 query，涵蓋繁中、英文、known-item、學術、即時／freshness 與需要全文抓取的任務。
- 至少比較 3 條管道；建議 Exa、Tavily、SearXNG，自架抓取層另記 fetch success。
- 指標至少包含 Recall@k／MRR（有標注題）、fetch success rate、freshness、p50／p95 latency、成本／成功任務與可追溯來源比例。
- 保存查證日期、provider 參數、區域、失敗樣本與 raw result；不把單次結果寫成永久能力判斷。
- 明確區分 open-web retrieval eval 與既有 closed-corpus RAG eval（`src/content/posts/ai/2026-03-12-rag-evaluation-frameworks.md:51-65`）。

### Phase 2 — 工具介紹合併盤點

#### 更新既有文章，不新增

1. **SearXNG + Crawl4AI 組合指南**：保留既有 [整合文章](../../src/content/posts/ai/2026-08-21-searxng-crawl4ai-setup.md)作為「搜尋、抓取、黏著層、MCP 怎麼串起來」的 worked example。它只保留讓整套流程跑起來的最小設定；新增兩篇 canonical 工具文後，補雙向連結，避免繼續往裡面堆各工具的完整功能。
2. **Exa**：擴寫既有 [Exa 專文](../../src/content/posts/ai/2026-08-21-exa-neural-search-for-agents.md)。原文已有機制、成本、本站用法與限制（20–124 行），補上 SDK payload、search depth、contents／highlights、`output_schema`、429 retry 與成本控制；不新增「Exa API 實戰」。
3. **Ollama**：擴寫既有 [Ollama 完整指南](../../src/content/posts/ai/2026-03-14-ollama-local-llm-guide.md)。原文已有安裝、CLI、API 與 `/api/embed` 範例（185–383 行），在同篇補 batch、embedding 模型選擇、normalization、維度、吞吐與向量庫串接；不新增「Ollama Embedding 實戰」。

#### 已完成的完整工具介紹

4. **SearXNG 完整介紹**：已發布於 [SearXNG 完整介紹](../../src/content/posts/ai/2026-08-21-searxng-complete-guide.md)，定位為元搜尋引擎，不混入 Crawl4AI。
5. **Crawl4AI 完整介紹**：已發布於 [Crawl4AI 完整介紹](../../src/content/posts/ai/2026-08-21-crawl4ai-complete-guide.md)，定位為抓取與抽取工具，不混入 SearXNG。
6. **Qdrant 完整介紹**：已發布於 [Qdrant 完整指南](../../src/content/posts/ai/2026-08-21-qdrant-complete-guide.md)，涵蓋 collection、payload index、dense＋sparse、備份與多租戶邊界。
7. **Meilisearch 完整介紹**：已發布於 [Meilisearch 完整介紹](../../src/content/posts/ai/2026-08-21-meilisearch-complete-guide.md)，涵蓋索引設定、繁中搜尋、非同步 task 與多租戶安全。

Phase 2 的 canonical 工具文已完成；目前剩下 **既有文章擴寫、組合文去重補鏈與實測稿收尾**。

#### 其他已完成的工具文

- **Tavily**：[Search API 完整指南](../../src/content/posts/ai/2026-08-21-tavily-search-api-guide.md)。
- **Linkup**：[Search API 完整指南](../../src/content/posts/ai/2026-08-21-linkup-search-api-guide.md)。
- **Firecrawl**：[完整指南](../../src/content/posts/ai/2026-08-21-firecrawl-complete-guide.md)。
- **Apify**：[Actor 平台完整介紹](../../src/content/posts/ai/2026-08-21-apify-actor-platform-guide.md)。

## Detailed Article Briefs

### Tool 1 — SearXNG 完整介紹

**狀態**：已發布；以下保留為維護驗收基準。

**暫定標題**：`SearXNG 完整介紹：引擎調校、JSON API 與自架維運`

**文章身分**：獨立工具介紹；`category: ai`、`type: guide`，不掛 series。中英各一篇，日期以實際發佈日為準。

**讀者問題**：SearXNG 到底做了什麼、怎麼架、怎麼決定哪些引擎要開，以及為什麼查詢會變慢、空結果或被上游封鎖？

**建議章節**：

1. `## SearXNG 是什麼，也不是什麼`
   - 元搜尋引擎，不建立自己的全網索引。
   - 和 SERP API、自建索引、crawler 的責任差異。
2. `## 一次查詢在裡面怎麼走`
   - query → engine selection → parallel requests → normalization → dedup／ranking → output format。
3. `## 最小安裝與第一個 JSON 查詢`
   - 官方 container／compose 路線。
   - `formats`、`secret_key`、limiter 等必要設定。
4. `## settings.yml 的真正結構`
   - `use_default_settings`、general／server／search／engines。
   - 哪些設定是 instance-wide，哪些可以 query-time 覆寫。
5. `## 引擎怎麼選，不是全部打開就好`
   - general、news、images、IT、science、files 等 category。
   - 語言、地區、safe search、timeout、weight。
   - disabled、inactive、suspended 與失敗退避。
6. `## 給 agent 使用的 JSON API`
   - query、categories、language、time_range、engines、pageno。
   - 回傳欄位、去重與 citation 所需 metadata。
7. `## 機房 IP 是自架的真正限制`
   - 上游封鎖、CAPTCHA、空結果、rate limit。
   - 只陳述 source／官方可證明的限制；台灣與機房成功率留給 benchmark。
8. `## 維運與失敗診斷`
   - engine stats、timeout、network、DNS、proxy、log。
   - 錯誤分類與處理順序。
9. `## 什麼時候不該用 SearXNG`
   - 需要穩定 SLA、自己的索引、語意檢索或付費結果品質時的替代方案。
10. `## 參考資料`

**必要範例**：

- 一份最小可用 `settings.yml`。
- 三個 JSON API 範例：通用、繁中／地區、學術 category。
- 一張 engine selection decision table。
- 一個「空結果」診斷流程。

**明確不寫**：Crawl4AI、網頁全文抽取、MCP glue code、台灣成功率排行。

**主要證據**：SearXNG 官方 installation／settings／search API／engine docs，以及 repo 中的預設 `settings.yml`、engine definitions。版本與查證日期必須入文。

### Tool 2 — Crawl4AI 完整介紹

**狀態**：已發布；以下保留為維護驗收基準。

**暫定標題**：`Crawl4AI 完整介紹：從 Markdown 抓取到結構化資料抽取`

**文章身分**：獨立工具介紹；`category: ai`、`type: guide`，不掛 series。中英各一篇，日期以實際發佈日為準。

**讀者問題**：已經有 URL 之後，Crawl4AI 怎麼抓出適合 LLM 的內容；何時用 CSS 規則，何時才值得叫 LLM 抽取？

**建議章節**：

1. `## Crawl4AI 解決的是 URL 之後的問題`
   - crawler／browser／extractor 的邊界。
   - 不負責 web search。
2. `## AsyncWebCrawler 的執行模型`
   - browser config、crawler run config、result shape、session lifecycle。
3. `## 最小安裝與第一個 Markdown 結果`
   - 官方安裝、browser setup、async 範例。
   - success、status code、markdown、links、metadata。
4. `## Markdown 不是只有一種輸出`
   - raw／fit markdown、content filter、noise removal。
   - 什麼情況不應直接把整頁丟給 LLM。
5. `## 確定性抽取：JsonCssExtractionStrategy`
   - schema、base selector、nested fields、multiple records。
   - 適合穩定 DOM、列表與產品頁。
6. `## LLM 抽取：LLMExtractionStrategy`
   - schema／instruction、provider、token 成本與延遲。
   - Ollama provider 的設定與本地模型限制。
7. `## CSS-first，LLM-fallback`
   - 兩條策略使用同一份輸出 schema。
   - selector 失敗、欄位缺漏、confidence／validation 後才切 LLM。
8. `## Deep crawl、URL 範圍與去重`
   - BFS／DFS 或官方現行 strategy、include／exclude、depth、canonical URL。
   - 避免無限日曆、query parameter 與重複內容。
9. `## Cache、並行、代理與錯誤處理`
   - cache mode、concurrency、timeout、retry、robots／登入／challenge 的邊界。
10. `## 什麼時候不該用 Crawl4AI`
    - 純 HTTP parser、完整 browser agent、託管爬蟲服務的替代情境。
11. `## 參考資料`

**必要範例**：

- URL → Markdown 最小範例。
- 同一份資料 schema 的 CSS 與 LLM 兩種抽取版本。
- Ollama provider 範例。
- CSS-first／LLM-fallback 的完整函式。
- bounded deep crawl 範例與去重 key。

**明確不寫**：SearXNG、搜尋引擎選擇、MCP server 完整實作、繞 Cloudflare 成功率。

**主要證據**：Crawl4AI 官方 docs、API reference、extraction／deep crawl／cache examples 與 repo source。所有 class／parameter 名稱依實際安裝版本驗證，不能沿用記憶中的舊 API。

### Integration — SearXNG + Crawl4AI 組合指南

**既有文章**：`src/content/posts/ai/2026-08-21-searxng-crawl4ai-setup.md`

**保留定位**：回答「如何把搜尋、抓取與 MCP glue 串成一套自架取得管道」，仍是「搜尋與爬取實戰」order 3。

**重整原則**：

- SearXNG 與 Crawl4AI 各保留一個最小可執行範例。
- 引擎調校導向 SearXNG 完整介紹。
- extraction／deep crawl 導向 Crawl4AI 完整介紹。
- 主體聚焦 glue API、資料 contract、錯誤傳遞、MCP tool schema 與端到端驗證。
- 不改既有 slug／date；內容實質更新時加 `updated`。

**建議章節**：

1. 三個元件的 contract。
2. 以最小設定啟動 SearXNG。
3. 以最小設定抓取單一 URL。
4. 定義 `/search`、`/extract` 或等價 glue API。
5. 將 search result URL 交給 crawler，保留來源 metadata。
6. 包成 MCP tools。
7. 端到端驗證與失敗邊界。
8. 延伸閱讀：兩篇 canonical 工具介紹。

### Article-Level Acceptance Criteria

- 三篇文章互相連結，但任何一篇都不複製另一篇超過必要的最小設定。
- SearXNG 文單獨閱讀即可完成「安裝 → 選引擎 → JSON 查詢 → 診斷」。
- Crawl4AI 文單獨閱讀即可完成「安裝 → Markdown → CSS extraction → LLM fallback → bounded crawl」。
- 組合文單獨閱讀即可完成「search → fetch → MCP」端到端流程，但進階工具設定明確導向專文。
- 中英版本的標題、程式碼、參數、限制與查證日期對稱。
- 每篇完成後執行 `pnpm check:references`，整批完成後執行 `pnpm verify`。

## Further Topic Backlog

這一區盤點 SearXNG、Crawl4AI、fallback 與 benchmark 之外還能寫的題目。原則是先判斷能否併入既有文章；只有回答獨立問題、且不會重寫現有內容時才新增。

### Tier 1 — 值得新增的文章

#### 1. Agent 的搜尋 query 怎麼寫

**暫定標題**：`Agent 搜尋 Query 怎麼寫：關鍵字、語意描述、拆解與改寫`

**類型**：跨工具方法文，可獨立發佈；不作單一 provider 教學。

**核心問題**：同一個資訊需求，Google／SearXNG 型 keyword query、Exa 型 semantic description、學術 API 的 fielded query 應該如何轉換？

**涵蓋範圍**：

- exact match、錯誤訊息、產品名與 API symbol。
- 長語意描述與「理想頁面會怎麼被介紹」。
- query decomposition、expansion、時間／語言／網站限制。
- 零結果、低品質結果與結果過廣時的改寫策略。
- 同一組問題在 keyword 與 semantic search 的對照範例。

**與既有內容邊界**：不重講 Deep Research 的任務規劃與停止條件；只處理單次或一組 query 如何生成與修正。

**驗證要求**：至少用 12 個固定案例展示原 query、改寫 query、預期改變與實際前幾筆結果；若比較 provider，保存日期與 raw result。

#### 2. 網頁抽取品質實測

**暫定標題**：`網頁抽取品質實測：Crawl4AI、Firecrawl、Jina Reader 與 Readability 差多少？`

**類型**：實測文；不是另一篇爬蟲工具全景。

**核心問題**：已經找到 URL 後，哪條抽取管道最能保留正文、表格、程式碼與 metadata，同時減少 navigation／廣告雜訊？

**最低資料集**：至少 20 個固定 URL，涵蓋新聞、技術文件、部落格、表格、程式碼、SPA、長文、非英文頁面與反爬站點。

**指標**：

- fetch success rate。
- 正文完整度與雜訊比例。
- heading／table／code block／link 保存率。
- metadata 完整度。
- p50／p95 latency、付費成本與失敗類型。

**與既有內容邊界**：34 工具全景回答「有哪些、怎麼選」；本篇只用少數代表工具跑相同資料集。

#### 3. 搜尋結果如何變成可靠引用

**暫定標題**：`從搜尋結果到可靠引用：URL 去重、來源分級與 Claim-Source Mapping`

**類型**：跨工具方法文。

**核心問題**：搜尋回來十條 URL 之後，如何避免轉載文被當成十個獨立來源，並確認每個主張真的受到來源支持？

**涵蓋範圍**：

- URL normalization、canonical URL、tracking parameter 清理。
- 同稿轉載與內容 fingerprint 去重。
- 官方／一手／二手／聚合來源分級。
- atomic claim、claim-source matrix、quote span 與 citation coverage。
- 網頁更新、消失與 archive snapshot 的證據保存。

**與既有內容邊界**：Autonomous Deep Research 已談證據仲裁與 citation pass；本篇必須落到資料結構、演算法與可重跑檢查，不再寫一次原則文。

#### 4. 學術搜尋管線

**暫定標題**：`學術搜尋怎麼組：arXiv、OpenAlex、Crossref、Semantic Scholar 與 PubMed 的分工`

**類型**：場景方法文；不是五個 API 各自介紹。

**核心問題**：如何把 preprint、正式出版版本、DOI metadata、引用關係與醫學索引整合成不重複、可追蹤版本的研究結果？

**涵蓋範圍**：DOI／PMID／arXiv ID 對齊、preprint → version of record、retraction／correction、作者與機構 identity、citation count 的來源差異、去重與更新。

**驗證要求**：至少選 10 篇同時存在 preprint／正式版本或跨資料庫紀錄的論文，展示 entity resolution 結果。

#### 5. 需要登入的網站怎麼交給 agent

**暫定標題**：`需要登入的網站怎麼交給 Agent：Session、權限與自動化邊界`

**類型**：browser automation／security 方法文。

**涵蓋範圍**：browser profile、cookie／session 保存、CSRF、MFA、人機交接、最小權限、敏感資料遮罩、操作與純讀取的權限差異。

**限制**：不能把「如何繞過登入或存取控制」寫成目標；文章只處理使用者已合法登入、已授權資料的安全自動化。

### Tier 2 — 併入既有規劃，不另開文章

#### 網站變更偵測與增量重爬

併入「私有語料管線第 2 篇：從來源到索引」。新增 ETag、Last-Modified、sitemap `lastmod`、content checksum、recrawl priority、tombstone 與刪除傳播。只有未來累積公開網站的大型重爬實測，才升格成獨立文章。

#### Crawler 的網址陷阱

併入 Crawl4AI 完整介紹的 deep crawl 章節：query parameters、calendar trap、pagination、faceted navigation、canonical、include／exclude、crawl budget 與 URL normalization。避免再開一篇只有陷阱清單的文章。

#### 搜尋與爬取快取設計

先併入 fallback 路由方法文：query cache、URL content cache、negative cache、TTL、stale-while-revalidate，以及 freshness query 不應命中舊快取。若未來有命中率／成本／freshness 的實際數據，再獨立寫成實測文。

### Do Not Schedule Yet

- 第二篇爬蟲工具大全：既有 34 工具全景已覆蓋。
- 泛用 Deep Research 架構介紹：已有 Local Deep Research 與 Autonomous Deep Research。
- 泛用 prompt injection 文章：站內已有完整安全文章。
- BM25／hybrid／reranker／RAGAS 再介紹：RAG 技法大全已覆蓋。
- 無實測的「台灣最好用搜尋引擎排行」：地區與機房能力必須用固定資料集實測。

### Backlog Priority

原定五篇已全部建立中英文版本，狀態如下：

1. Agent 搜尋 query 怎麼寫：已發布（order 9）。
2. 網頁抽取品質實測：骨架已完成，待同 corpus 四工具 raw run（order 10，draft）。
3. 搜尋結果到可靠引用：已發布（order 11）。
4. 學術搜尋管線：已發布；實例明示為 fixture，尚未宣稱 live entity-resolution benchmark（order 12）。
5. 需要登入的網站與 agent 權限邊界：已發布（order 13）。

前三篇把取得流程補成「問對 → 抓對 → 引對」；後兩篇再處理專門場景。

### Phase 3 — 新系列「私有語料管線」

系列定位：**私有資料如何安全且持續地流進索引、被查到、被更新與被刪除。** RAG 技法負責檢索品質；工具文章負責產品操作。

建議 4 篇：

1. **私有語料搜尋的邊界與架構**：資料外流限制、元件邊界、威脅模型、權限與 freshness SLA。只畫出 BM25／vector／reranker 的位置，細節連回 RAG 大全。
2. **從來源到索引：同步與增量更新**：connector、canonical ID、checksum、版本、idempotent upsert、tombstone、rebuild、dead-letter queue。
3. **查詢時權限、刪除與 freshness**：pre-filter／post-filter、ACL 漏洞、多租戶隔離、刪除傳播、來源血緣與 freshness 監控。
4. **私有語料 Retrieval Eval 實測**：用一份實際繁中 corpus 比較配置，報 Recall@k、MRR、nDCG、延遲與錯誤類型；不再介紹 RAGAS。

新系列需在 `src/utils/series.ts` 加中英名稱、共用 slug 與描述；文章 frontmatter 的 series schema 已支援 name／order（`src/content.config.ts:41-53`）。不要用 `additionalSeries` 把所有工具文硬掛進來；該欄位會讓文章同時進系列列表和導航（`src/utils/seriesNav.ts:17-28`）。

## New Articles — Recommended Publishing Order

1. **Web Retrieval Eval**（order 8）：先補三條管道的同批 raw run，再決定是否發布。
2. **網頁抽取品質實測**（order 10）：補 Crawl4AI、Firecrawl、Jina Reader、Readability 的同 corpus raw run，再決定是否發布。
3. **SearXNG + Crawl4AI 組合指南維護**：兩篇 canonical 工具文均已發布，現在刪除重複內容並補雙向連結。
4. **私有語料管線**：四篇中英文草稿已建立；前三篇進 review，第 4 篇待 corpus manifest、qrels、runner 與 raw results。

## Existing Articles — Maintenance, Not New Posts

1. **SearXNG + Crawl4AI 組合指南**：兩篇 canonical 工具文已完成；下一步刪掉重複的進階說明、補雙向連結，維持原 slug、series order 3，不新增文章。
2. **Exa 專文**：在原文補 API 使用章節，不另開「Exa API 實戰」。
3. **Ollama 完整指南**：在原文補 embedding 章節，不另開新文。
4. **閱讀地圖**：修正 Local Deep Research 的過期連結敘述。

SearXNG 與 Crawl4AI canonical 文、fallback 文均已完成。現在可直接整理組合指南；兩篇 benchmark 仍須等同批 raw run，不能用工具專文取代實測。

## Acceptance Criteria

- 「搜尋與爬取實戰」新增文章只補方法缺口，不新增單一工具導讀。
- 每個工具只有一篇 canonical 介紹；認識、安裝、實際使用與限制放在同一篇內。
- 一篇 canonical 工具介紹只負責一個工具；多工具文章只能作選型、比較或整合案例。
- 已有工具主文時直接擴寫，不新增以「實戰」「進階」「完整指南」重新包裝相同工具的文章。
- 每篇工具文開頭明示：上游選型問題由哪篇回答、本文負責哪個工具，以及不涵蓋哪些跨工具方法。
- 新私有語料系列不重新解釋 BM25、embedding、vector DB、hybrid、reranker 或 RAGAS；相關段落以短摘要加站內連結處理。
- 所有宣稱成功率、延遲、成本或地區可用性的文章都附可重跑方法、查證日期、參數與失敗樣本。
- 新文章維持中英配對；每篇有 `## 參考資料` 且來源覆蓋核心主張。
- 每批文章與 metadata 調整後執行 `pnpm verify`；benchmark 額外保存 dataset、raw result 與計算腳本。
- 單次變更避免超過 20 個檔案；若要批次建立整個新系列，依治理規則先取得使用者決定。

## Risks and Mitigations

- **內容重複**：動筆前先列「本文新增／既有文章已回答」；工具比較只留摘要，細節由專文單一維護。
- **價格與 API 快速過期**：標查證日期，易腐資訊連官方文件，避免在多篇複製表格。
- **Benchmark 無法重現**：固定 query、時間、區域、參數、版本與 raw response；分開報搜尋失敗和抓取失敗。
- **私有語料系列膨脹成第二套 RAG 大全**：以資料生命週期為章節骨架，禁止用技法名稱當系列順序。
- **series order 與日期不一致**：series order 只表閱讀順序；另修 `latestDate` 計算，避免列表排序受影響。

## Verification Steps

1. 用 frontmatter 掃描確認新系列中英名稱與 order 對稱且無缺號。
2. 用站內 reference checker 驗證每篇核心外部主張都有來源。
3. 用全文搜尋確認同一價格、API enum 或 benchmark 數字沒有在比較文與工具文雙份維護。
4. 執行 `pnpm verify` 作唯一品質閘門。
5. Benchmark 文從保存的 raw results 重算表格，結果必須一致。

## Stop Condition

本規劃完成於：現況、重疊、缺口、內容邊界、選題順序與驗收條件均可直接用於後續開文；本階段不修改文章或程式。
