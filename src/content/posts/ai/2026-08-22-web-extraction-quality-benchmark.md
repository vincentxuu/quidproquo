---
title: "網頁抽取品質實測：Crawl4AI、Firecrawl、Jina Reader 與 Readability 差多少？"
date: 2026-08-22
category: ai
type: deep-dive
tags: [web-scraping, web-extraction, crawl4ai, firecrawl, benchmark]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 10
tldr: "抽取工具不能只比 HTTP 200；同一組 20 個 URL 要分別量正文、heading、table、code、link、metadata、雜訊、延遲與成本。本文先公開 corpus、adapter contract 與評分 gate，但因目前缺 Firecrawl credential 與四條同版本 raw run，尚不發佈勝負。"
description: "建立 Crawl4AI、Firecrawl、Jina Reader 與 Mozilla Readability 的可重跑網頁抽取 benchmark，涵蓋 20 個固定 URL、結構保存、雜訊、metadata、延遲與成本。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-web-extraction-quality-benchmark-en)

> **尚未發佈的實測規格。** 本文已固定 20 個 URL、輸出 contract、評分 rubric 與失敗分類，但 2026-08-22 的環境沒有 `FIRECRAWL_API_KEY`，也尚未把四條 adapter 鎖在同一次 raw run。沒有 raw artifacts 就沒有排名；完成前維持 `draft: true`。

搜尋找到 URL 之後，下一步不是「把 HTML 丟給 LLM」而是先決定怎麼把正文抽出來。[Crawl4AI](https://docs.crawl4ai.com/core/markdown-generation/)、[Firecrawl](https://docs.firecrawl.dev/features/scrape)、[Jina Reader](https://jina.ai/reader/)與 [Mozilla Readability](https://github.com/mozilla/readability)都能把網頁變成比較乾淨的內容，但它們處理 JS、正文判定、Markdown 結構、metadata 與成本的方式不同。

這篇不重做[34 個爬蟲工具全景](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)，也不拿官方 demo 頁互比。唯一問題是：**給四條管線完全相同的 URL，誰保留了回答問題需要的內容，誰只是輸出看起來很乾淨的文字？**

## 四條管線其實不是同一種東西

| 管線 | 取得頁面 | 主要輸出 | 這次測試的設定 |
|---|---|---|---|
| Crawl4AI | 本地 browser crawler | raw／fit Markdown、HTML、links | `cleaned_html` + default Markdown，不開 LLM filter |
| Firecrawl | 託管 scrape API | Markdown、HTML、metadata | `/scrape`，formats=`markdown` |
| Jina Reader | 託管 URL-to-text service | LLM-friendly Markdown | 無 key Reader endpoint |
| Readability | 本地 DOM heuristic | article HTML、text、title、byline | Playwright 取 final DOM，再交給 Readability |

Readability 本身不負責 browser fetch，也不把 HTML 轉成 Markdown。這次用同一個 Playwright fetcher 取得 final DOM，再用 Readability 判斷正文；否則比較到的是 HTTP client 差異，不是 extraction。Mozilla 文件也提醒，Readability 不負責 sanitize output，顯示抽取 HTML 前仍要經過 sanitizer。

Crawl4AI 官方把 `raw_markdown` 與 `fit_markdown` 分開；fit 會經 content filter 移除區塊。為避免把 query-specific pruning 當成抽取能力，第一輪只比較預設 cleaned Markdown，第二輪才把 fit Markdown 當獨立 configuration。

## 固定 20 個 URL，不用每次挑對自己有利的頁

Corpus 以公開、可匿名讀取、能人工標示關鍵結構的頁面為主。每個 case 都要保存 `retrieved_at`、final URL、HTTP 狀態、content hash 與人工 ground-truth manifest。

| ID | 類型 | URL | 必須保留的結構 |
|---|---|---|---|
| docs-01 | API 文件 | `https://playwright.dev/docs/auth` | headings、code、warning |
| docs-02 | Python 文件 | `https://docs.python.org/3/library/pathlib.html` | API signatures、tables、code |
| docs-03 | Rust Book | `https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html` | prose、code、callouts |
| docs-04 | Crawl4AI docs | `https://docs.crawl4ai.com/core/markdown-generation/` | nested headings、code、links |
| docs-05 | Firecrawl docs | `https://docs.firecrawl.dev/features/scrape` | tabs、code、response fields |
| repo-01 | GitHub README | `https://github.com/mozilla/readability` | badges、headings、code、links |
| repo-02 | GitHub README | `https://github.com/microsoft/playwright-mcp` | option table、code、warnings |
| table-01 | HTML table | `https://www.w3.org/TR/WCAG22/` | conformance tables、anchors |
| table-02 | Compatibility data | `https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie` | syntax、compatibility links |
| long-01 | Security guide | `https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html` | long hierarchy、code、lists |
| long-02 | Standards text | `https://www.rfc-editor.org/rfc/rfc9110.html` | numbered sections、references |
| spa-01 | React docs | `https://react.dev/learn/managing-state` | client-rendered navigation、code |
| spa-02 | Material docs | `https://m3.material.io/styles/color/system/overview` | rendered body、image captions |
| article-01 | Engineering blog | `https://blog.cloudflare.com/workers-ai/` | title、author/date、body、links |
| article-02 | Product blog | `https://www.mozilla.org/en-US/firefox/reader-view/` | body、images、CTA noise |
| zh-01 | 台灣政府頁 | `https://moda.gov.tw/` | 繁中標題、導覽與正文分離 |
| zh-02 | 台灣法規頁 | `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021` | 條文編號、段落、metadata |
| ja-01 | 日本政府頁 | `https://www.digital.go.jp/policies` | 日文 headings、cards、links |
| pdf-01 | arXiv abstract | `https://arxiv.org/abs/2311.09735` | title、authors、abstract、DOI links |
| edge-01 | robots policy | `https://www.google.com/robots.txt` | plain text，不應被判定成空內容 |

這份清單不是永久不變。若頁面消失或大幅改版，manifest 要保留舊 hash 並新增 corpus version；不能默默換 URL 後把兩次分數接在一起。

## Adapter 只能回同一種 contract

每個 adapter 的原始 response 完整保存，另外正規化成同一份 JSON：

```json
{
  "case_id": "docs-01",
  "adapter": "crawl4ai-default",
  "adapter_version": "0.9.x",
  "requested_url": "https://playwright.dev/docs/auth",
  "final_url": "https://playwright.dev/docs/auth",
  "retrieved_at": "2026-08-22T00:00:00Z",
  "status": "success",
  "latency_ms": null,
  "cost_usd": null,
  "title": null,
  "author": null,
  "published_at": null,
  "markdown": null,
  "links": [],
  "raw_artifact": "raw/docs-01/crawl4ai-default.json",
  "error": null
}
```

`null` 和 `0` 不可混用。沒有計費資料就是 `null`，不是零成本；沒有作者欄位也是 `null`，不是空字串。timeout、blocked、fetch error、parse empty、partial content 必須分開，否則 success rate 會把「抓到登入頁」算成成功。

## 評分先看必須保留什麼，再看輸出多漂亮

每個 case 的 ground truth 不保存整頁標準答案，而是保存 `required_spans`、`required_structures` 與 `known_noise`。人工審查者不知道輸出來自哪個 adapter，再分別打：

1. **正文完整度**：required spans 找回多少。
2. **雜訊比例**：navigation、cookie banner、推薦卡、footer 等 known noise 佔多少。
3. **結構保存**：heading 層級、table、code block、list、link 是否還能辨識。
4. **Metadata**：title、author、published time、canonical URL 是否正確。
5. **可追溯性**：輸出 link 能否回到原始 href，內容是否保留足以定位的 section。
6. **效率**：p50／p95 latency、request 數、付費金額與 output bytes。

不要壓成單一總分。正文少一半但 latency 很低，不該和內容完整但稍慢互相抵銷。Regression gate 應分開設定，例如：required span recall 不得下降、code block 保存率不得下降、p95 latency 不得惡化超過事先接受的幅度。

## 最容易做錯的四件事

### 把 fetch success 當 extraction success

HTTP 200 可能是 consent page、登入頁、bot challenge 或只有 app shell。必須先驗證 title、required span 與最小正文長度，再標 success。

### 四條管線用不同時間抓

新聞首頁、文件與 SPA 會更新。每個 case 的四個 adapter 應在同一個短 window 內跑完，並保存 source snapshot；否則差異可能來自頁面變了。

### 只用字數判定完整

字多可能只是導覽與 footer。字少也可能是精準抽取。完整度應對 required spans，雜訊另算。

### 忘記抽取結果仍是不受信任輸入

HTML、Markdown 與 metadata 都可能含提示注入或惡意 markup。Mozilla 明確說 Readability 不做 sanitization；其他服務輸出 Markdown 也不代表內容安全。抽取後仍要 sanitize、保留 provenance，並和 tool instruction 分離。

## 目前能下的結論只有測試設計

四個工具的官方能力可以描述，勝負還不能。Crawl4AI 提供本地 browser 與可調 Markdown/filter pipeline；Firecrawl 提供託管 scrape 與多種 formats；Jina Reader 用 URL prefix 快速取得 LLM-friendly text；Readability 是最輕的本地 article heuristic，但 fetch、render、Markdown conversion 與 sanitization 都要自己補。

等四條 adapter 在同一個 corpus version 跑完、raw artifacts 入庫、人工標註完成，本文才會把 `draft` 改為 `false`，加入結果表與逐類失敗案例。少任何一項，都只是在比較產品說明，不是實測。

## 參考資料

- [Crawl4AI — Markdown Generation](https://docs.crawl4ai.com/core/markdown-generation/)
- [Firecrawl — Scrape](https://docs.firecrawl.dev/features/scrape)
- [Jina AI — Reader API](https://jina.ai/reader/)
- [Mozilla Readability — README and API](https://github.com/mozilla/readability)
- [Playwright — Browser automation documentation](https://playwright.dev/docs/intro)
