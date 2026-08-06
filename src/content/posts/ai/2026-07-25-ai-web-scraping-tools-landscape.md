---
title: "AI 爬蟲工具全景圖：34 個開源專案的五大分類與選型指南"
date: 2026-07-25
category: ai
type: deep-dive
tags: [web-scraping, ai-agent, browser-automation, llm, open-source]
lang: zh-TW
tldr: "從 MarkItDown (169k stars, MIT) 到 curl-impersonate (7k stars)，整理 34 個「爬資料餵 AI」的開源工具。沿五條軸線分類：整站爬取、AI 瀏覽器代理、文件轉檔、智慧擷取、反偵測基建。選型關鍵不是哪個最好，是場景匹配。"
description: "34 個 AI 爬蟲與資料擷取開源工具的分類選型指南：整站爬取（Firecrawl、Crawl4AI）、AI 瀏覽器代理（Browser-Use、Stagehand）、文件轉檔（MarkItDown、MinerU）、智慧擷取（Scrapling、ScrapeGraphAI）、反偵測基建（curl-impersonate）。含 GitHub API 驗證的星數與授權資訊。"
draft: false
glossary:
  - term: "AGPL"
    aliases: ["AGPL-3.0", "GNU Affero General Public License"]
    definition: "一種 copyleft 開源授權。如果你用 AGPL 軟體對外提供網路服務，你的整合程式碼也必須以相同授權開源。"
    context: "Firecrawl 和 Skyvern 使用 AGPL-3.0，選型時需評估授權對商業部署的影響。"
  - term: "TLS 指紋"
    aliases: ["TLS fingerprint", "JA3 fingerprint"]
    definition: "瀏覽器建立 HTTPS 連線時的握手參數組合。反爬蟲系統用它判斷請求是否來自真實瀏覽器。"
    context: "curl-impersonate 和 CloakBrowser 透過偽裝 TLS 指紋來繞過反爬蟲偵測。"
---

> 🌏 [English version](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en)

「爬資料餵 AI」已經催生出一整個工具生態。從 [MarkItDown](https://github.com/microsoft/markitdown) 的 169k stars 到各種千星級的利基工具，GitHub 上至少有 34 個活躍專案在處理這件事。這篇把它們沿五條軸線分類——整站爬取、AI 瀏覽器代理、文件轉檔、智慧擷取、反偵測基建——幫你根據場景選對工具，不用再自己刻爬蟲。

## 不只是「把網頁抓下來」

爬資料餵 AI 的核心問題有三個，彼此獨立，沒有一個工具能全解：

1. **格式轉換**：怎麼把非結構化的網頁或文件轉成 LLM 能消化的格式（Markdown、結構化 JSON）
2. **互動爬取**：怎麼處理需要登入、JS 渲染、動態載入的頁面
3. **穩定取得**：怎麼在反爬蟲越來越嚴的環境下可靠地拿到資料

## 誰來決定怎麼爬：五種取向

工具之間最大的分歧在「決策者是誰」：

| 取向 | 代表工具 | 決策者 | 代價 |
|---|---|---|---|
| 規則驅動 | [Scrapy](https://github.com/scrapy/scrapy)、[Crawlee](https://github.com/apify/crawlee) | 開發者寫選擇器 | 維護成本高，改版就壞 |
| AI 驅動（DOM） | [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai)、[Stagehand](https://github.com/browserbase/stagehand) | LLM 看 DOM 決定 | Token 成本、延遲 |
| AI 驅動（視覺） | [Skyvern](https://github.com/Skyvern-AI/skyvern)、[Browser-Use](https://github.com/browser-use/browser-use) | LLM 看截圖決定 | 更慢更貴，但跨平台 |
| 自適應 | [Scrapling](https://github.com/D4Vinci/Scrapling)、AgentQL | 智慧選擇器自動修復 | 不靠 AI 但有學習曲線 |
| 格式轉換 | [MarkItDown](https://github.com/microsoft/markitdown)、[MinerU](https://github.com/opendatalab/MinerU)、[Marker](https://github.com/VikParuchuri/marker) | 不做爬取，只做轉檔 | 需搭配上游爬蟲 |

以下五大分類就沿這些取向展開。

## 整站爬取：Firecrawl 領跑，但注意授權

首選 [Firecrawl](https://github.com/mendableai/firecrawl)（155k stars, AGPL-3.0）——功能最全、生態最大，自帶 JS 渲染、Markdown 輸出、sitemap 掃描，API 設計直接面向 LLM 輸入場景。代價是 AGPL 授權：你的整合程式碼若對外提供服務，也必須開源。

如果授權不能接受，[Crawl4AI](https://github.com/unclecode/crawl4ai)（75k stars, Apache-2.0）是最接近的替代，Python 寫的、更輕量，社群成長很快。

百萬頁規模用 [Scrapy](https://github.com/scrapy/scrapy)（63k stars, BSD-3）——Python 生態的老牌框架，分散式架構成熟，但要自己寫解析器。JS/TS 團隊用 [Crawlee](https://github.com/apify/crawlee)（25k stars, Apache-2.0），Apify 出品，API 乾淨，支援 Playwright 和 Cheerio。非工程背景可以看 Maxun（~17k stars），no-code 介面直接在瀏覽器裡標記要爬的元素。

## AI 瀏覽器代理：讓 AI 像真人操作

這類工具讓 AI 像真人一樣操作瀏覽器——點擊、填表、滾動、截圖，全程自主決策。

[Browser-Use](https://github.com/browser-use/browser-use)（106k stars, MIT）社群最大，Python 寫的 autonomous agent loop，每步都靠 LLM 推理決定下一動，適合「讓 AI 自己上網完成任務」的場景。[Stagehand](https://github.com/browserbase/stagehand)（24k stars, MIT）API 最乾淨——三個原語 `act` / `extract` / `observe` 就涵蓋操作和資料擷取，建在 Playwright 上，TypeScript，適合寫成穩定的自動化腳本。[Skyvern](https://github.com/Skyvern-AI/skyvern)（23k stars, AGPL-3.0）走視覺優先路線，不解析 DOM，純靠截圖做決策，跨平台性最好但每步最慢。

Browser-MCP（~7k stars）把瀏覽器操作暴露成 MCP tools，適合直接接進 Claude 或 LLM agent 的工作流程。

想深入了解純視覺路線的取捨，可以看站內的 [Midscene.js 深度分析](/posts/ai/2026-05-23-midscene-vision-ui-automation)——同賽道但選了「只看截圖、不碰 DOM」的極端路線，連 DOM 動作模式都在 v1.0 移除了。

## 文件轉檔：不爬取，只轉格式

這類工具不負責爬取，專把 PDF / Office / HTML 轉成 LLM 友善格式。

[MarkItDown](https://github.com/microsoft/markitdown)（169k stars, MIT）是微軟出品，格式支援最廣——PDF、Word、Excel、PowerPoint、HTML、圖片都能轉 Markdown，是目前這個賽道星數最高的專案。[MinerU](https://github.com/opendatalab/MinerU)（76k stars）表格與數學公式擷取最強，學術 PDF 首選。[Marker](https://github.com/VikParuchuri/marker)（38k stars, Apache-2.0）速度快、GPU 需求低，適合批量轉換。[Docling](https://github.com/DS4SD/docling)（64k stars, MIT）IBM Research 出品，強調結構化輸出（JSON schema），適合需要精確保留文件結構的場景。

[anydoc](https://github.com/firecrawl/anydoc)（746 stars, MIT，2026-08-06 查詢）是 Firecrawl 出品的 Rust 函式庫，2026-08-03 才開源，走的路線跟上面幾個都不同：只做辦公文件、完全不碰 OCR，但 14 種格式全支援（含 `.doc` / `.ppt` / `.xls` 老格式），中位耗時 4.7ms。值得注意的是它跟 Firecrawl 主專案的授權不同——主專案是 AGPL-3.0，anydoc 是 MIT，商業整合沒有 copyleft 顧慮。詳細比較見[〈anydoc：14 種辦公格式轉 Markdown〉](/posts/ai/2026-08-06-anydoc-rust-document-markdown)。

輕量選項：[Trafilatura](https://github.com/adbar/trafilatura)（~6k stars）專攻「從網頁抽正文、濾廣告」，做前處理穩定好用。[Jina Reader](https://github.com/jina-ai/reader)（12k stars, Apache-2.0）零設定——URL 前加 `r.jina.ai/` 就拿到 Markdown。Readability（~9k stars）是 Firefox 閱讀模式的引擎，常被當成前處理步驟嵌在其他工具裡。

## 智慧擷取：讓選擇器自己修復

規則驅動的爬蟲碰到網站改版就壞。這類工具用 AI 或自適應機制讓擷取更穩。

[Scrapling](https://github.com/D4Vinci/Scrapling)（71k stars, BSD-3）是自適應選擇器——不靠 LLM，而是用智慧演算法在網站改版後自動修復失效的選擇器，速度快、不花 token。[ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai)（29k stars, MIT）走另一條路：你用自然語言描述要什麼資料，它用 LLM 自動建爬蟲管線，適合一次性擷取任務。[AutoScraper](https://github.com/alirezamika/autoscraper)（8k stars, MIT）更簡單——給一個範例頁面和你要的資料，它自動學會選擇器。

AgentQL（~1k stars）用語意查詢取代 CSS/XPath，Parsera 是輕量的 LLM 擷取 library，ferret（~6k stars, Go）提供宣告式擷取語言。

## 反偵測與基建：穩定取得資料的基礎設施

[curl-impersonate](https://github.com/lwthiker/curl-impersonate)（7k stars, MIT）偽裝 TLS 指紋，讓 HTTP 請求看起來像真實瀏覽器發出的。CloakBrowser（~29k stars）是隱身版 Chromium，可以直接 drop-in 替換 Playwright 的瀏覽器實例。botasaurus（~6k stars）是 Python 反偵測爬蟲框架，SeleniumBase（~13k stars）是 Selenium 的加強版，內建 stealth 模式。

[changedetection.io](https://github.com/dgtlmoon/changedetection.io)（~33k stars）做另一件事——不爬取，而是監控網頁變更並通知你，適合追蹤價格、庫存或政策變動。[scrcpy](https://github.com/Genymobile/scrcpy)（146k stars, Apache-2.0）嚴格來說不是爬蟲，而是 Android 螢幕鏡像工具，用在需要從 App 擷取資料的場景。brightdata-mcp（~3k stars）是商業級 MCP server，讓 AI agent 透過 Bright Data 的基礎設施取得資料。

更多反偵測細節，參考站內的[繞過 Cloudflare 反爬蟲指南](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent)（nodriver / stealth / camoufox 的比較）。MCP 串接爬蟲的實作範例，見[把爬蟲腳本做成 MCP Server](/posts/tech/2026-03-20-mcp-server-job-scraper)。

## 選型速查表

以下是經 GitHub API 驗證的主要工具（2026-07-24 查詢），按星數排序：

| 工具 | Stars | 授權 | 語言 | 定位 |
|---|---|---|---|---|
| [MarkItDown](https://github.com/microsoft/markitdown) | 169k | MIT | Python | 文件轉 Markdown |
| [Firecrawl](https://github.com/mendableai/firecrawl) | 155k | AGPL-3.0 | TS | 整站爬取 + LLM 輸出 |
| [scrcpy](https://github.com/Genymobile/scrcpy) | 146k | Apache-2.0 | C | Android 螢幕鏡像 |
| [Browser-Use](https://github.com/browser-use/browser-use) | 106k | MIT | Python | AI 瀏覽器代理 |
| [MinerU](https://github.com/opendatalab/MinerU) | 76k | — | Python | PDF 表格/公式擷取 |
| [Crawl4AI](https://github.com/unclecode/crawl4ai) | 75k | Apache-2.0 | Python | 輕量整站爬取 |
| [Scrapling](https://github.com/D4Vinci/Scrapling) | 71k | BSD-3 | Python | 自適應選擇器 |
| [Docling](https://github.com/DS4SD/docling) | 64k | MIT | Python | 結構化文件轉換 |
| [Scrapy](https://github.com/scrapy/scrapy) | 63k | BSD-3 | Python | 大規模爬蟲框架 |
| [Marker](https://github.com/VikParuchuri/marker) | 38k | Apache-2.0 | Python | 快速 PDF 轉換 |
| [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | 29k | MIT | Python | 自然語言 → 爬蟲 |
| [Crawlee](https://github.com/apify/crawlee) | 25k | Apache-2.0 | TS | JS/TS 爬蟲框架 |
| [Stagehand](https://github.com/browserbase/stagehand) | 24k | MIT | TS | 乾淨 API 瀏覽器代理 |
| [Skyvern](https://github.com/Skyvern-AI/skyvern) | 23k | AGPL-3.0 | Python | 視覺優先瀏覽器代理 |
| [Jina Reader](https://github.com/jina-ai/reader) | 12k | Apache-2.0 | TS | URL → Markdown |
| [AutoScraper](https://github.com/alirezamika/autoscraper) | 8k | MIT | Python | 範例驅動擷取 |
| [curl-impersonate](https://github.com/lwthiker/curl-impersonate) | 7k | MIT | C | TLS 指紋偽裝 |

另有 changedetection.io、CloakBrowser、Maxun、SeleniumBase、Readability、Browser-MCP、Trafilatura、ferret、botasaurus、AnyCrawl、Markdowner、CyberScraper-2077、brightdata-mcp、webclaw、Parsera、AgentQL、Craw4LLM 等 17 個工具收錄在研究筆記中，多數星數在千至萬級。

## 整體來說

這個領域的工具沿「規則 vs AI」和「通用 vs 專用」兩軸分布。2024–2025 的趨勢很明確：AI 驅動的爬蟲（ScrapeGraphAI、Browser-Use、Stagehand）和文件轉 LLM 格式（MinerU、Marker、Docling）爆發成長。但規則驅動的老牌工具（Scrapy、Crawlee）在百萬頁規模仍無可取代。

選型的關鍵不是「哪個最好」，而是場景匹配：

- **Markdown 輸出 + 不想管 JS 渲染** → Firecrawl（注意 AGPL）或 Crawl4AI
- **登入 / 複雜互動** → Browser-Use 或 Stagehand
- **PDF / Office 轉檔** → MarkItDown（通用）或 MinerU（學術 PDF）
- **網站常改版、選擇器一直壞** → Scrapling
- **被 Cloudflare 擋** → curl-impersonate + [繞過 Cloudflare 指南](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent)

## 更新紀錄

- 2026-08-06：「文件轉檔」一節補上 anydoc（Firecrawl 的 Rust 轉檔函式庫，14/14 格式、4.7ms 中位耗時、746 stars、MIT 授權），並標注它與 Firecrawl 主專案 AGPL-3.0 的授權差異。文件轉檔這一層的完整選型脈絡另見[「文件解析實戰」系列](/series/document-parsing)。本篇其餘工具的星數仍為 2026-07-24 查詢值，未重新驗證。

## 參考資料

- [Firecrawl (GitHub)](https://github.com/mendableai/firecrawl)
- [Crawl4AI (GitHub)](https://github.com/unclecode/crawl4ai)
- [Browser-Use (GitHub)](https://github.com/browser-use/browser-use)
- [Crawlee (GitHub)](https://github.com/apify/crawlee)
- [Scrapy (GitHub)](https://github.com/scrapy/scrapy)
- [MarkItDown (GitHub)](https://github.com/microsoft/markitdown)
- [Scrapling (GitHub)](https://github.com/D4Vinci/Scrapling)
- [ScrapeGraphAI (GitHub)](https://github.com/ScrapeGraphAI/Scrapegraph-ai)
- [Stagehand (GitHub)](https://github.com/browserbase/stagehand)
- [Skyvern (GitHub)](https://github.com/Skyvern-AI/skyvern)
- [MinerU (GitHub)](https://github.com/opendatalab/MinerU)
- [Marker (GitHub)](https://github.com/VikParuchuri/marker)
- [Docling (GitHub)](https://github.com/DS4SD/docling)
- [anydoc (GitHub)](https://github.com/firecrawl/anydoc)
- [Jina Reader (GitHub)](https://github.com/jina-ai/reader)
- [Trafilatura (GitHub)](https://github.com/adbar/trafilatura)
- [AutoScraper (GitHub)](https://github.com/alirezamika/autoscraper)
- [curl-impersonate (GitHub)](https://github.com/lwthiker/curl-impersonate)
- [changedetection.io (GitHub)](https://github.com/dgtlmoon/changedetection.io)
- [scrcpy (GitHub)](https://github.com/Genymobile/scrcpy)
- [Midscene.js：純視覺 UI 自動化](/posts/ai/2026-05-23-midscene-vision-ui-automation)（站內）
- [繞過 Cloudflare 反爬蟲指南](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent)（站內）
- [把爬蟲腳本做成 MCP Server](/posts/tech/2026-03-20-mcp-server-job-scraper)（站內）
