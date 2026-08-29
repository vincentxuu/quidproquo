---
title: "Jina Reader 完整指南：把網頁轉成 Agent 可讀 Markdown"
date: 2026-08-22
category: ai
type: deep-dive
tags: [jina-ai, web-scraping, retrieval, ai-agent, rag]
lang: zh-TW
tldr: "Jina Reader 把單一 URL 轉成適合 LLM 使用的 Markdown；真正上線時，還要控制渲染時機、正文範圍、token 上限與失敗回退。"
description: "從 URL 輸入開始，拆解 Jina Reader 的渲染、Markdown 輸出、參數設計，以及它與 Firecrawl、Tavily Extract 的能力邊界。"
draft: false
series:
  name: "搜尋與爬取實戰"
  order: 16
---

> 🌏 [English version](/posts/ai/2026-08-22-jina-reader-guide-en)

[Jina Reader](https://jina.ai/reader/) 是一個把網頁 URL 轉成 LLM-friendly 文字的 API。最簡單的用法，是把原始網址接在 `https://r.jina.ai/` 後面；服務會抓取頁面、辨識正文，再回傳 Markdown。它解決的是 retrieval pipeline 中「URL 已經找到了，怎麼把內容餵給模型」這一步。

它不是搜尋引擎，也不是會自己逛完整網站的研究 Agent。Reader 的核心輸入是已知 URL，核心輸出是清理後的內容。Jina 另有 `s.jina.ai` 搜尋端點，但本文只處理單次讀取，因為搜尋、排序與擷取是三種不同責任；混在一起，很難知道答案漏資料究竟是哪一層出錯。

依 [Reader 官方架構文件](https://github.com/jina-ai/reader/blob/main/architecture.md)，網頁可以經由 headless Chrome 或輕量 curl 引擎取得，PDF 則走 PDF.js。換句話說，它不只是對 HTML 套一層文字抽取器，而是代管了抓取、必要時的瀏覽器渲染，以及 HTML-to-Markdown。以下 API 行為查核於 **2026-08-22**。

## 一條最小 retrieval pipeline

先從真的做得出來的版本開始：搜尋系統或使用者提供 URL，後端把 URL 交給 Reader，檢查回應，再把 Markdown 放進模型 context。

```text
query / user input
      ↓
known URL
      ↓
Jina Reader: fetch → render → extract → Markdown
      ↓
validate source URL, status, length, content
      ↓
LLM context / chunking / index
```

第一次測試甚至不需要 SDK：

```bash
curl 'https://r.jina.ai/https://example.com'
```

這個前綴形式適合手動閱讀、原型與除錯。程式裡建議要求 JSON，保留 metadata，並設定 token 防線：

```bash
curl 'https://r.jina.ai/https://example.com/article' \
  -H 'Accept: application/json' \
  -H 'x-preset: agent' \
  -H 'x-max-tokens: 12000'
```

`x-max-tokens` 超過上限時會截短輸出；若不完整內容反而危險，改用 `x-token-budget`，讓超額請求直接失敗。兩者的差別不是效能微調，而是產品語意：聊天摘要可能接受截斷，合約或規格查核通常不該默默少掉後半段。這些 header 與預設值會改版，實作前應以[官方 README 的 request headers](https://github.com/jina-ai/reader#using-request-headers)為準。

## 從預設輸出調到你的用途

Reader 預設會保留連結與圖片，並用 Readability 清理正文，適合把結果直接交給聊天模型。需要穩定介面時，可用 `X-Respond-With: frontmatter` 取得 YAML metadata 加 Markdown，或用 `Accept: application/json` 讓程式不必解析純文字開頭的標題與來源欄位。

真正影響 retrieval 品質的，通常是以下四組控制：

| 問題 | Reader 控制 | 使用時機 |
|---|---|---|
| 抓到導覽列而非正文 | `x-target-selector`、`x-remove-selector` | 已知網站 DOM 結構 |
| SPA 內容還沒出現 | `x-wait-for-selector`、`x-timeout` | 頁面由 JavaScript 延後渲染 |
| 網址與圖片浪費 context | `x-retain-links`、`x-retain-images` | embedding 或長文件索引 |
| 一大段 Markdown 不好切 | `x-markdown-chunking` | 依標題或結構直接分塊 |

例如文件站的 DOM 很固定，與其期待通用正文演算法每次猜對，不如指定內容區：

```bash
curl 'https://r.jina.ai/https://example.com/docs/start' \
  -H 'x-target-selector: main article' \
  -H 'x-remove-selector: nav, footer, .related' \
  -H 'x-wait-for-selector: main article'
```

若要建立向量索引，則可從官方 `index` preset 開始。它會偏向保留文字、移除媒體 URL，並輸出結構化切塊。[官方 cookbooks](https://github.com/jina-ai/reader/blob/main/cookbooks.md)也提供 `reader`、`research`、`agent`、`spider` 等 preset；preset 是起點，不是品質保證，明確設定的 header 仍可覆寫其中單一選項。

## Reader、Firecrawl、Tavily Extract 的邊界

三者都能從 URL 拿內容，但選擇重點不該是「誰也能輸出 Markdown」，而是 pipeline 還缺哪一層。

| 工具 | 最自然的工作單位 | 何時優先考慮 |
|---|---|---|
| [Jina Reader](https://github.com/jina-ai/reader) | 一個已知 URL → 可讀內容 | 想用最低摩擦完成單頁 reading，並控制連結、圖片、渲染與切塊 |
| [Firecrawl](https://docs.firecrawl.dev/features/scrape) | scrape / batch / crawl 與多種輸出 | 需要從單頁擴成網站 crawl、batch job，或直接取 schema JSON、HTML、截圖等格式 |
| [Tavily Extract](https://docs.tavily.com/documentation/api-reference/endpoint/extract) | 一個或多個 URL → raw content | 搜尋本來就在 Tavily，想沿用同一套 API，或依 query 只取相關 chunks |

Firecrawl 官方 scrape 文件列出 Markdown、HTML、截圖、links 與 schema JSON 等輸出，並另有 batch、crawl、map 端點，因此它覆蓋的是更完整的 web data workflow。Reader 也能截圖、處理 PDF 與設定代理，但它最鮮明的入口仍是「讀這個 URL」。若你已有一批 URL，只要乾淨文字，Reader 的介面比較直接；若要排程爬整站與監控工作狀態，Firecrawl 的抽象比較貼近任務。

Tavily Extract 的官方 API 接受一個或多個 URL，也可帶 `query` 與 `chunks_per_source`，讓回傳內容先朝查詢相關片段收斂。它適合接在 Tavily Search 後方；Reader 則給你更多頁面渲染與 Markdown 形狀的控制。站內另有 [Exa 搜尋介紹](/posts/ai/2026-08-21-exa-neural-search-for-agents)、[Tavily 完整指南](/posts/ai/2026-08-21-tavily-search-api-guide)與 [Firecrawl 完整指南](/posts/ai/2026-08-21-firecrawl-complete-guide)，可以從搜尋與整站抓取的角度接著看。

## 失敗不是例外，要先設計

Reader 不能保證每個 URL 都能讀。登入牆、付費牆、CAPTCHA、地區限制與網站的反自動化措施，可能讓它回傳錯誤頁或不完整內容。SPA 也可能在 Reader 判定頁面可讀後才載入真正正文。最危險的結果不是 HTTP error，而是狀態成功、內容卻是「Please enable JavaScript」。

因此，不要把成功狀態直接等同於可用證據。每次回應至少檢查來源 URL、內容長度、標題、預期關鍵詞與明顯封鎖字樣；重要來源最好保存擷取時間與原始 URL。失敗時按順序嘗試：指定 selector 與等待條件、用 `x-no-cache: true` 排除舊快取、強制 `x-engine: browser`，最後才切換代理或另一個 extractor。官方 README 也提醒，匿名流量受較嚴格的速率限制；正式流量應使用 API key，並自行實作退避與熔斷。

安全界線同樣重要。URL 是外部輸入時，Reader 雖在 SaaS 層做可疑位址過濾，應用端仍要限制協定與網域，阻擋 localhost、私有 IP、雲端 metadata endpoint 與重新導向後的內部位址，避免 SSRF。抓回來的網頁也只是**不受信任資料**：其中的「忽略前文」「呼叫這個工具」可能是 prompt injection，不是系統指令。把 retrieved content 放進清楚標記的資料區，限制 Agent 工具權限，引用前回到來源核對。

還有法律與內容治理：遵守網站條款、robots 政策與著作權要求，不要把「技術上抓得到」誤當成「可以大量重製」。含個資、機密或受管制內容時，也要確認第三方處理與資料保存政策符合你的需求；不能接受外部 SaaS 的資料路徑，才考慮官方 Apache-2.0 儲存庫的自架版本。官方架構文件明確指出，開放原始碼分支不包含 SaaS 的 MongoDB 儲存層，因此自架與代管版不能假設完全相同。

## 整體來說

Jina Reader 最好的位置，是「已知 URL」和「模型可讀 context」之間。它把瀏覽器渲染與正文轉換藏在簡單 API 後面，又留下 selector、等待、token 與輸出形狀等必要控制。原型可以從 URL 前綴開始；上線前則要補齊 JSON 介面、內容驗證、token 預算、重試回退與 prompt injection 隔離。

如果需求自然長成整站 crawl、批次任務或 schema extraction，改看 Firecrawl；如果搜尋和相關片段擷取都在同一條 Tavily pipeline，Tavily Extract 會更順。Reader 的優勢不是包辦所有 web retrieval，而是把「讀一頁」做成一個夠小、又能逐步加控制的元件。

## 參考資料

- [Jina AI — Reader API](https://jina.ai/reader/)
- [Jina AI Reader — GitHub README](https://github.com/jina-ai/reader)
- [Jina AI Reader — Architecture](https://github.com/jina-ai/reader/blob/main/architecture.md)
- [Jina AI Reader — Cookbooks](https://github.com/jina-ai/reader/blob/main/cookbooks.md)
- [Firecrawl — Scrape documentation](https://docs.firecrawl.dev/features/scrape)
- [Tavily — Extract API reference](https://docs.tavily.com/documentation/api-reference/endpoint/extract)
- [Exa：給 AI Agent 的神經搜尋引擎](/posts/ai/2026-08-21-exa-neural-search-for-agents)
- [Tavily Search API 完整指南](/posts/ai/2026-08-21-tavily-search-api-guide)
- [Firecrawl 完整指南](/posts/ai/2026-08-21-firecrawl-complete-guide)

---

> 本文的免费额度已收進 [免費搜尋、爬取與 Browser API 怎麼選](/posts/ai/2026-08-21-free-search-scraping-tools) 的判斷表：Jina 屬「持續限速」路線，不帶 key 可持續用但限 20 RPM，Search 不支援匿名呼叫。同系列也包括 [TinyFish Search/Fetch](/posts/ai/2026-08-29-tinyfish-search-fetch-free-tier)（同樣持續限速，但帶機器渲染與 batch selector 抽取）。
