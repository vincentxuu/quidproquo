# Research：搜尋、爬取、私有檢索與文件工具免費方案盤點

查證日：2026-08-21

## 研究範圍與判讀方式

本筆記覆蓋 `.omx/plans/search-scraping-content-roadmap.md`「Tool Universe」已列名的工具。它不是把所有出現在 GitHub 的 scraper 都收進來，而是確認目前內容規劃中的工具是否有長期免費額度、一次性試用、純本機開源版本，或根本沒有可驗證的免費方案。

標記定義：

- `月度`：免費額度會按日曆月或帳務週期恢復。
- `一次性`：註冊 credit、限期 trial 或只送一次的用量，不能寫成「每月免費」。
- `本機／自架`：軟體本身可自行執行，沒有廠商 API 額度；主機、模型、proxy 與維運成本另計。
- `無固定免費額度`：有 $0 入口或 PAYG，不代表每月送用量。
- `待確認`：官方頁彼此衝突、公開頁未交代，或 hosted 方案沒有可驗證價格。

## 子問題

1. 每個工具的免費屬性是哪一種：月度、一次性、本機開源，還是沒有？
2. 額度用完後是停用、回傳錯誤，還是自動按量計費？
3. 是否要求付款方式？未使用額度是否累積？
4. 工具目前是否仍活躍、已封存、beta，或存在官方資訊衝突？
5. 哪些工具值得獨立工具文，哪些只應留在比較／方法文？

## A. 公開網路搜尋與取得

### 搜尋 API／SERP

| 工具 | 免費類型與目前可驗證內容 | 用完／限制 | 官方來源 |
|---|---|---|---|
| SearXNG | 本機／自架；沒有 SaaS 額度 | 成本在自己的主機與上游引擎；公開 instance 不等於服務保證 | [repo](https://github.com/searxng/searxng) |
| Exa | 月度 $10 credits；另有註冊一次性 $20 credits | 依 API 用量扣 credit；不要把註冊額度寫成每月 $20 | [pricing](https://exa.ai/pricing?tab=api) |
| Tavily | 月度 1,000 credits，不需信用卡 | 每月 1 日重置；不同 search depth／endpoint 消耗不同 | [credits](https://docs.tavily.com/documentation/api-credits)、[FAQ](https://help.tavily.com/articles/4840311948-tavily-api-pricing) |
| Firecrawl Search／Crawler | 月度 1,000 credits，不需信用卡 | 不 rollover；一般方案沒有傳統 PAYG，升級後才有更多額度 | [pricing](https://www.firecrawl.dev/pricing)、[repo](https://github.com/firecrawl/firecrawl) |
| Linkup | 符合資格的 professional-email 帳戶每月把 prepaid balance **補回** $20 | 餘額用完回 429；成功請求才扣款；`eligible accounts` 未公開定義 | [pricing](https://docs.linkup.so/pages/documentation/platform/pricing)、[balance API](https://docs.linkup.so/pages/documentation/endpoints/account/balance) |
| Brave Search API | 月度 $5 credits；官方要求信用卡作反詐驗證 | Search 定價 $5／1,000 requests；免費 credit 內不收費 | [pricing](https://brave.com/search/api/) |
| Bocha／LangSearch | 待確認：現行頁宣稱 API 免費且免信用卡，但 Terms 同時描述預付、按量計費與 promotional credits | 不宜寫成穩定永久免費；刊文前需以登入後 billing 為準 | [pricing](https://open.bochaai.com/pricing)、[terms](https://open.bochaai.com/terms-of-service) |
| Serper | 一次性 2,500 queries；不需信用卡 | top-up 模式，非月度；付費 credits 有效期 6 個月 | [pricing](https://serper.dev/) |
| SerpAPI | 月度 250 searches | 成功搜尋才計數；付費方案可選 automatic early renewal | [pricing](https://serpapi.com/pricing) |
| Bright Data | 產品別月度方案：Web Scraper 5,000 records、MCP 5,000 requests；另有受限制 trial | 個人信箱且未驗證付款方式時，Proxy／Web Unlocker 可能不可用；不可把某產品額度外推到全平台 | [Web Scraper](https://brightdata.com/pricing/web-scraper)、[MCP](https://brightdata.com/pricing/mcp-server)、[trial FAQ](https://docs.brightdata.com/general/account/billing-and-pricing/faqs) |

### Crawler／整站抓取

| 工具 | 免費類型與目前可驗證內容 | 狀態／備註 | 官方來源 |
|---|---|---|---|
| Crawl4AI | 本機／自架 | Cloud API 為 closed beta，尚無可引用的正式免費方案 | [repo](https://github.com/unclecode/crawl4ai) |
| Firecrawl | 本機／自架加月度 cloud 1,000 credits | 同上；自架版與 Cloud 功能／基建責任不可混寫 | [repo](https://github.com/firecrawl/firecrawl)、[pricing](https://www.firecrawl.dev/pricing) |
| Scrapy | 本機／自架 | framework 無 API quota | [repo](https://github.com/scrapy/scrapy) |
| Crawlee | 本機／自架 | library 無 API quota；Apify Cloud 另計 | [repo](https://github.com/apify/crawlee) |
| Apify | 月度 $5 platform usage | 免費方案不需信用卡；不用量不累積，超額後等下個週期或升級 | [pricing](https://apify.com/pricing) |
| Maxun | 本機／自架 | 公開頁未找到可驗證的 hosted 月度額度 | [repo](https://github.com/getmaxun/maxun) |
| AnyCrawl | 本機／自架；hosted 月度 1,500 credits | 注意不要和一次性 5,000 credits 的 `AnyCrawler` 混為同一產品 | [repo](https://github.com/any4ai/anycrawl)、[pricing](https://anycrawl.dev/price) |
| Craw4LLM | 研究程式碼／本機 | 論文配套 repo，不是一般 SaaS crawler | [repo](https://github.com/cxcscmu/Craw4LLM) |

### Browser agent／互動自動化

| 工具 | 免費類型與目前可驗證內容 | 狀態／備註 | 官方來源 |
|---|---|---|---|
| Browser Use | 本機開源；一般 Cloud 為 $0/月 PAYG 入口，但需購買 credits，未見穩定月送額度 | Claude Code 特殊整合頁另稱 zero-cost free tier，和一般 pricing 衝突，不外推 | [repo](https://github.com/browser-use/browser-use)、[pricing](https://browser-use.com/pricing)、[Claude Code integration](https://docs.browser-use.com/cloud/tutorials/integrations/claude-code) |
| Stagehand | 本機開源；遠端執行沿用 Browserbase 額度 | SDK 本身不提供獨立 SaaS free tier | [repo](https://github.com/browserbase/stagehand)、[Browserbase pricing](https://www.browserbase.com/pricing) |
| Skyvern | 本機開源；Cloud 官方頁出現每月約 1,000 與 5,000 credits 兩種說法 | 額度衝突，刊文前應登入確認，不寫死數字 | [repo](https://github.com/Skyvern-AI/skyvern)、[pricing announcement](https://www.skyvern.com/blog/launch-week-day-5-simpler-pricing-model/)、[HR page](https://www.skyvern.com/hr-tech) |
| Midscene.js | 本機開源 | 模型 API、瀏覽器執行環境另計 | [repo](https://github.com/web-infra-dev/midscene) |
| Playwright MCP | 本機開源 | 無 SaaS quota；接遠端 browser 時由供應商計費 | [repo](https://github.com/microsoft/playwright-mcp) |
| Chrome DevTools MCP | 本機開源 | 無 SaaS quota | [repo](https://github.com/ChromeDevTools/chrome-devtools-mcp) |
| Puppeteer MCP | 本機開源，但原 Model Context Protocol server 已封存 | 不應再當成活躍官方 MCP 優先推薦 | [archived repo](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) |
| Browser-MCP | 本機開源 | 以 browser extension 操作既有瀏覽器，無 hosted quota | [repo](https://github.com/BrowserMCP/mcp) |

### 智慧抽取／正文抽取

| 工具 | 免費類型與目前可驗證內容 | 用完／限制 | 官方來源 |
|---|---|---|---|
| Scrapling | 本機開源 | proxy、遠端瀏覽器等外部成本另計 | [repo](https://github.com/D4Vinci/Scrapling) |
| ScrapeGraphAI | 本機開源；Cloud 月度 500 credits、10 RPM | unused credits 原則上不 carry；免費方案資料可能用於 model training／research | [repo](https://github.com/ScrapeGraphAI/Scrapegraph-ai)、[pricing](https://docs.scrapegraphai.com/knowledge-base/account/pricing)、[terms](https://scrapegraphai.com/terms) |
| AgentQL | Starter 月度 50 API calls；另有一次性 trial 300 calls＋1 browser hour | Starter 列 10 browser hours included 與超額費率，但公開頁沒說清綁卡、hard cap、10 小時重置週期 | [pricing](https://www.agentql.com/pricing)、[repo](https://github.com/tinyfish-io/agentql) |
| AutoScraper | 本機開源 | 沒有官方託管 API，故沒有每月 API 額度 | [repo](https://github.com/alirezamika/autoscraper) |
| Parsera | 本機開源；hosted API 的穩定免費額度未在公開頁確認 | 使用 LLM 時仍有模型成本 | [repo](https://github.com/raznem/parsera)、[docs](https://parsera.org/docs/quickstart) |
| Trafilatura | 本機開源 | 無 SaaS quota | [repo](https://github.com/adbar/trafilatura) |
| Jina Reader | 無 key 基礎 Reader 免費 20 RPM；新 key 一次性 10M tokens | key credits 非每月；failed calls 不扣 token | [Reader](https://jina.ai/en-US/reader/) |
| Readability | 本機開源 | 無 SaaS quota | [repo](https://github.com/mozilla/readability) |
| Diffbot | 月度 10,000 credits、5 RPM，不需信用卡 | 免費額度用完回 429 | [pricing](https://www.diffbot.com/pricing) |

### 反偵測、代理與執行基建

| 工具 | 免費類型與目前可驗證內容 | 狀態／備註 | 官方來源 |
|---|---|---|---|
| nodriver | 本機開源 | 無 SaaS quota | [repo](https://github.com/ultrafunkamsterdam/nodriver) |
| Camoufox | 本機開源 | 無 SaaS quota | [repo](https://github.com/daijro/camoufox) |
| stealth Playwright | 本機開源 | 此名稱泛指多個套件；規劃目前以 Python `playwright-stealth` 為代表 | [repo](https://github.com/Granitosaurus/playwright-stealth) |
| curl_cffi | 本機開源 | 無 SaaS quota | [repo](https://github.com/lexiforest/curl_cffi) |
| CloakBrowser | 本機可用；changedetection.io plugin 開源 | binary 可免費使用但有再散布限制；不是一般 cloud browser free tier | [integration repo](https://github.com/dgtlmoon/changedetection.io-cloak-browser) |
| botasaurus | 本機開源 | Cloud／proxy 若使用則另計 | [repo](https://github.com/omkarcloud/botasaurus) |
| SeleniumBase | 本機開源 | 無 SaaS quota | [repo](https://github.com/seleniumbase/SeleniumBase) |
| Browserbase | 月度 Free plan：目前定價頁列 1 browser hour、3 agent runs、1,000 Search、1,000 Fetch | 公開文件對 concurrent session 曾有 1 與 3 的差異；以當期 dashboard 為準 | [pricing](https://www.browserbase.com/pricing) |
| Bright Data | 見搜尋 API 表；免費額度依產品分開 | 不可把 Web Scraper／MCP 額度當成 proxy 額度 | [pricing](https://brightdata.com/pricing) |
| Zyte | 一次性 $5、首個 billing month／30-day trial | 期滿未升級會 suspend，不是每月 $5 | [pricing](https://www.zyte.com/pricing/)、[docs](https://docs.zyte.com/zyte-api/pricing.html) |
| Oxylabs | 一次性 trial，Web Scraper API 最多 2,000 results，不需信用卡 | 非長期月度免費方案 | [Web Scraper pricing](https://oxylabs.io/products/scraper-api/web/pricing)、[general pricing](https://oxylabs.io/pricing) |

### 監控與更新訊號

| 工具／方法 | 免費類型與目前可驗證內容 | 狀態／備註 | 官方來源 |
|---|---|---|---|
| changedetection.io | 本機開源；hosted 為付費訂閱，未見穩定 hosted free tier | 適合以實際監控案例成文，不以免費 SaaS 為賣點 | [repo](https://github.com/dgtlmoon/changedetection.io)、[hosted](https://changedetection.io/) |
| sitemap／RSS／Webhook watcher | 方法，不是單一產品 | 費用取決於 scheduler、queue 與 hosting | [Sitemaps protocol](https://www.sitemaps.org/protocol.html)、[RSS 2.0](https://www.rssboard.org/rss-specification) |

## B. 私有語料與自建搜尋

### 全文搜尋

| 工具 | 免費類型與目前可驗證內容 | Cloud 備註 | 官方來源 |
|---|---|---|---|
| Meilisearch | Community Edition 本機開源 | Cloud 為 14-day trial、免信用卡，之後方案從 $20 起；不是 monthly free | [repo](https://github.com/meilisearch/meilisearch)、[pricing](https://www.meilisearch.com/pricing) |
| Typesense | 本機開源 | Cloud 一次性 720 cluster-hours＋10GB bandwidth；明示不是每月重置 | [repo](https://github.com/typesense/typesense)、[free-tier FAQ](https://cloud-help.typesense.org/article/how-does-the-free-tier-work) |
| Elasticsearch | self-managed 有免費可用功能，但授權不是單一純 OSS 敘述 | Elastic Cloud 14-day trial、免信用卡；不是 monthly free | [repo](https://github.com/elastic/elasticsearch)、[Cloud trial](https://www.elastic.co/cloud/cloud-trial-overview) |
| OpenSearch | 本機開源 | managed service 額度依 AWS 或其他供應商，工具本身沒有單一 cloud free tier | [repo](https://github.com/opensearch-project/OpenSearch) |
| Pagefind | 本機／build-time 開源 | 靜態搜尋索引，無 SaaS quota | [repo](https://github.com/Pagefind/pagefind) |
| Tantivy | 本機開源 library | 無 SaaS quota | [repo](https://github.com/quickwit-oss/tantivy) |

### 向量資料庫

| 工具 | 免費類型與目前可驗證內容 | Cloud 備註 | 官方來源 |
|---|---|---|---|
| Qdrant | 本機開源；Cloud free-forever cluster：0.5 vCPU、1GB RAM、4GB disk、單節點 | 閒置 1 週 suspend、4 週未恢復會刪除；免信用卡 | [repo](https://github.com/qdrant/qdrant)、[pricing](https://qdrant.tech/pricing/)、[free cluster](https://qdrant.tech/documentation/cloud/create-cluster/) |
| Weaviate | 本機開源；Cloud free-forever、免信用卡 | 1 cluster/user、100k objects、1GB memory、10GB disk；另有 embeddings／Query Agent 日月限制 | [repo](https://github.com/weaviate/weaviate)、[pricing](https://weaviate.io/pricing) |
| Milvus | 本機開源 | Zilliz Cloud 是另一服務；本筆記尚未把其 promotion 當成 Milvus 本身額度 | [repo](https://github.com/milvus-io/milvus) |
| LanceDB | 本機開源 embedded retrieval library | hosted Cloud 免費額度未在本輪確認，不寫數字 | [repo](https://github.com/lancedb/lancedb) |
| Chroma | 本機開源 | hosted Cloud 免費額度未在本輪確認，不寫數字 | [repo](https://github.com/chroma-core/chroma) |
| pgvector | PostgreSQL extension，本機／自架開源 | managed Postgres 成本依供應商 | [repo](https://github.com/pgvector/pgvector) |
| Cloudflare Vectorize | Workers Free 月度 30M queried vector dimensions、5M stored vector dimensions | Free 用量超過後不自動產生付費 overage；Paid plan 才按超額計費 | [pricing](https://developers.cloudflare.com/vectorize/platform/pricing/) |
| Pinecone | Starter 免費方案 | 1 project；定價頁另列 embeddings 5M tokens/月、reranker 500 requests/月等包含量；Standard trial 是另一個一次性試用 | [pricing](https://www.pinecone.io/pricing/) |

### Embedding runtime 與 RAG framework

| 工具 | 免費類型 | 額外成本／邊界 | 官方來源 |
|---|---|---|---|
| Ollama | 本機開源 | 硬體與模型運算成本 | [repo](https://github.com/ollama/ollama) |
| Text Embeddings Inference（TEI） | 本機開源 | 硬體與模型權重授權另看模型 | [repo](https://github.com/huggingface/text-embeddings-inference) |
| Infinity | 本機開源 | 硬體成本 | [repo](https://github.com/michaelfeil/infinity) |
| FastEmbed | 本機開源 library | 硬體成本 | [repo](https://github.com/qdrant/fastembed) |
| LlamaIndex | 本機開源 framework | LlamaCloud 等 hosted 產品另計，不等於 framework 額度 | [repo](https://github.com/run-llama/llama_index) |
| LangChain | 本機開源 framework | LangSmith／hosted 服務另計 | [repo](https://github.com/langchain-ai/langchain) |
| Haystack | 本機開源 framework | 模型、DB 與 deployment 另計 | [repo](https://github.com/deepset-ai/haystack) |

## C. 文件解析

| 工具 | 免費類型 | 額外成本／邊界 | 官方來源 |
|---|---|---|---|
| MarkItDown | 本機開源 | 選用 Azure Document Intelligence／Content Understanding 或 LLM plugin 時另計 | [repo](https://github.com/microsoft/markitdown) |
| anydoc | 本機開源 | Firecrawl Parse hosted 服務另計 | [repo](https://github.com/firecrawl/anydoc) |
| pandoc | 本機開源 | 無 SaaS quota | [repo](https://github.com/jgm/pandoc) |
| PyMuPDF | 本機可用，採 AGPL／commercial 雙軌授權 | 商業散布情境需自行確認授權，不應只寫「免費」 | [repo](https://github.com/pymupdf/PyMuPDF) |
| pdfplumber | 本機開源 | 無 SaaS quota | [repo](https://github.com/jsvine/pdfplumber) |
| MinerU | 本機開源 | 模型下載與 GPU／CPU 成本 | [repo](https://github.com/opendatalab/MinerU) |
| Marker | 本機可執行；授權與模型條款需依當期 repo 核對 | hosted API 若使用則另計 | [repo](https://github.com/datalab-to/marker) |
| Docling | 本機開源 | 模型與運算成本 | [repo](https://github.com/docling-project/docling) |
| OCR／VLM | 方法類別，不是單一工具 | 應拆成 Tesseract／PaddleOCR／雲端 OCR／特定 VLM 後再查額度 | 不以單一價格列處理 |

## 讀取完整度盤點

| 類型 | 完整度 | 說明 |
|---|---|---|
| 規劃文件已列名工具 | ✅ 已逐項有狀態與官方入口 | 重複出現在多類的 Firecrawl、Bright Data 以同一產品交叉引用 |
| 純本機／自架工具 | ✅ 已確認官方 repo 與產品形態 | 本輪沒有逐一抄 license version；涉及特殊授權者另標示 |
| 有明確公開定價的 SaaS | ✅ 已記錄 recurring／one-time 與主要限制 | 數字以 2026-08-21 為準，刊文前仍要重查 |
| 登入後才看得到的 billing 行為 | ⚠️ 部分未驗證 | AgentQL、Bocha、Skyvern、Browser Use 等已列為待確認／衝突 |
| 泛稱方法 | ✅ 已排除假精確 | watcher、OCR／VLM 不是單一產品，不能硬填一個額度 |

## 事實交叉表：最容易寫錯的項目

| 常見誤寫 | 正確判讀 | 驗證狀態 |
|---|---|---|
| Linkup 每月「送」$20 | 符合資格帳戶是每月把 prepaid balance **補回 $20**，不是在剩餘額度上再加 $20 | 金額與機制已確認；資格定義未公開 |
| AgentQL 免費 300 calls／月 | 300 是 trial；長期 Starter 是 50 API calls／月 | 已確認 |
| Serper 每月 2,500 queries | 2,500 是註冊一次性額度 | 已確認 |
| Zyte 每月 $5 | $5 是首個 billing month／30-day trial | 已確認 |
| Typesense Cloud 每月 720 小時 | 官方明示 720 小時是一次性 free tier，不重置 | 已確認 |
| AutoScraper 有免費 API quota | 它是本機 library，沒有官方 hosted API | 已確認 |
| Browser Use Cloud 有穩定免費月額度 | 一般 pricing 與 Claude Code 特殊整合頁說法不一致 | 官方衝突，待登入確認 |
| Skyvern 每月固定 N credits | 官方頁同時出現約 1,000 與 5,000 | 官方衝突，不能寫死 |
| Puppeteer MCP 是活躍官方選項 | 原官方 server 已移入 archived repository | 已確認 |

## 對內容規劃的推論

以下是選題判斷，不是定價事實：

- 有 recurring free tier 不代表值得獨立成文；它只降低實測成本。設計差異、可重現案例與維護活性仍是主條件。
- 純開源工具不能用「每月免費額度」排名。應改比較部署責任、模型／proxy 成本、授權與維護負擔。
- 最適合近期實測的 cloud 工具是 Tavily、Firecrawl、Apify、AgentQL、Diffbot、Qdrant、Weaviate、Vectorize；它們有可重跑的免費邊界。
- Linkup 值得保留，但 professional-email eligibility 未透明；它不適合作為「任何人都能免費複現」的唯一範例。
- Bocha、Skyvern、Browser Use 的公開方案資訊有衝突，若要寫專文，第一個工作不是寫稿，而是用實際帳戶截圖／billing 頁把方案定義釘死。
- Puppeteer MCP 應從「可新增介紹」降為歷史／遷移脈絡；Crawl4AI Cloud 在正式公開定價前，以 self-host 工具文為主。

## 草稿骨架

若把本研究轉成文章，建議題目是「免費搜尋／爬取工具怎麼選：月度額度、試用額度與開源自架不是同一件事」，而不是逐項 README 大全：

1. 先定義四種 free。
2. 依 Search、Crawler、Browser、Extraction、Private Search 分表。
3. 解釋 hard stop、PAYG、top-up 與 rollover。
4. 用 3 個可複現 stack 示範：全 SaaS、小額 hybrid、全 self-host。
5. 列出方案衝突與查證日期，避免把價格寫成永久事實。

## 待解問題

- 用實際帳戶確認 Linkup `eligible accounts`、每月 top-up 日期與 purchased／free credit 扣除順序。
- 用實際帳戶確認 AgentQL Starter 是否需付款方式、browser hours 重置週期與 spending cap。
- 用實際帳戶確認 Bocha、Skyvern、Browser Use 的當前 dashboard，解決公開頁衝突。
- 若要把 LanceDB Cloud、Chroma Cloud、Zilliz Cloud 納入文章，需把它們視為獨立 hosted 產品另開一輪定價查證，不能從 OSS 工具名稱推導。
- 寫任何正式文章前重查所有 SaaS 定價頁，因為本表只保證 2026-08-21 的公開資訊。
