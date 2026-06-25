---
title: "你的 JSON-LD 和 schema 對 AI 搜尋引擎是隱形的嗎？各家管線拆解與 AEO/GEO 策略"
date: 2026-04-18
type: guide
category: marketing
tags: [aeo, geo, ai-seo, web-search, content-strategy, seo, json-ld, schema, structured-data, llms-txt, claude-code, perplexity]
lang: zh-TW
tldr: "不同 AI 引擎讀網頁的方式差異很大。有的只看 body、有的靠預建索引。JSON-LD 和 schema 不是萬能的，正文品質和結構才是跨平台有效的基礎。"
description: "拆解 ChatGPT、Perplexity、Gemini、Claude 四家 AI 搜尋引擎的網頁處理管線，分析 JSON-LD、schema、meta 標籤的實際效果，給出 2026 年可操作的 AEO/GEO 策略。"
draft: false
---

🌏 [English version](/posts/marketing/2026-04-18-ai-search-engine-aeo-geo-strategy-en)

做 AEO/GEO 的人很容易把「AI 搜尋優化」想成傳統 SEO 的延伸：加 JSON-LD、補 FAQ schema、寫好 meta description，然後等 AI 引用你。但如果你看過各家 AI 引擎實際讀網頁的管線，會發現事情沒這麼單純——有些引擎根本讀不到你放在 `<head>` 裡的東西。

這篇拆解四家主要 AI 搜尋引擎的內容處理管線，看看你的 SEO 資產到底在哪些平台有效、哪些完全浪費。

## Claude：只看 body，head 完全不存在

Claude 的網頁搜尋走兩個工具：WebSearch 找網址、WebFetch 讀內容。

WebSearch 在伺服器端執行，回傳 title、url 和加密 snippet。但 CLI 流程裡 snippet 幾乎不被使用，真正決定 AI 讀到什麼的是 WebFetch。

WebFetch 的管線：

```
URL → HTTP 升 HTTPS
    → 查網域黑名單（via api.anthropic.com）
    → Axios 在本地端抓取 HTML
    → Turndown.js 把 <body> 轉成 Markdown
    → 截斷至 100,000 字元
    → 交給 Claude Haiku 做摘要
    → 回傳摘要（非預核准網域限制 125 字元可直接引用）
```

Turndown.js 用的是**零設定**（zero configuration），預設行為：

- `<script>`、`<style>` 被移除 → **JSON-LD 在 `<script type="application/ld+json">` 裡，直接消失**
- `<meta>`、`<link>` 全在 `<head>` → **meta description、OG tags 不存在**
- 圖片預設被移除 → **alt-text 也不可見**
- `<nav>` 裡的文字**不會**被特別移除，反而跟正文一起送進 Haiku，搶佔注意力

對於 119 個預核准的文件網站（主要是各技術框架的官方文件），如果伺服器回傳 `Content-Type: text/markdown` 且內容在 100K 字元以內，會跳過 Haiku 直接使用。但一般網站不在這個名單上。

另外，Axios 是 HTTP client，不執行 JavaScript。SPA 和客戶端渲染的頁面，抓到的可能是空殼。

## ChatGPT：段落級檢索，低排名也有機會

ChatGPT 的搜尋基於 Bing 的即時索引，但處理方式跟傳統搜尋引擎差很多。

管線大致是：

1. **伺服器端抓取**，支援 query rewriting（自動改寫查詢來擴大匹配）
2. 清洗 HTML → **分段切塊（passage-level chunking）** → 向量嵌入
3. **混合檢索**（語意搜尋 + 關鍵字匹配）
4. **Cross-encoder reranker** 精排
5. **LLM-as-a-judge**：最終由模型決定引用哪段

這個管線的重點是**段落級**。搜尋排名第五的頁面，如果某一段剛好精準回答了問題，可以贏過排名第一的頁面。

`<head>` 的 metadata 主要影響 Bing 的索引端，不一定直接傳給生成模型。但因為是伺服器端抓取，JavaScript 渲染的內容有機會被讀到。

## Perplexity：自建索引，structured data 有效

Perplexity 是唯一自建完整搜尋索引的 AI 搜尋引擎。

- 自家爬蟲 **PerplexityBot** 預先爬取並建索引，追蹤超過 2,000 億唯一 URL
- 使用 **AI 驅動的動態解析模組**，自動產生解析邏輯處理不同網站結構
- 多階段排序管線：混合檢索 → 預過濾 → cross-encoder reranker
- 引用密度在所有平台中最高，逐句標注來源
- 底層用 **Vespa AI** 做大規模 RAG

因為 PerplexityBot 爬的是完整 HTML，**schema、JSON-LD、structured data 在這裡是有效的**。想被 Perplexity 引用，傳統 SEO 的 structured data 工作不會白費。

## Gemini：站在 Google 索引上

Gemini 的生成式回答直接建在 Google Search 索引和 Knowledge Graph 之上。

- 模型自動判斷是否需要搜尋 → 生成查詢 → 取得搜尋結果
- 頁面沒進 Google 索引，Gemini 就讀不到
- 尊重 `robots.txt` 中的 `Google-Extended` 設定
- 回傳 `groundingMetadata`，含搜尋查詢、網頁結果、引用連結

因為 Google 的索引爬蟲本來就會讀完整 HTML（包含 `<head>`），**傳統 SEO 的 structured data 在 Gemini 路徑上仍然完全有效**。

## 管線比較一覽

| | Claude | ChatGPT | Perplexity | Gemini |
|---|---|---|---|---|
| 抓取方式 | 本地端 Axios | 伺服器端 | 預先爬取建索引 | 已有 Google 索引 |
| 讀 `<head>`？ | ❌ | ⚠️ 間接 | ✅ | ✅ |
| JSON-LD/schema 有效？ | ❌ | ⚠️ 有限 | ✅ | ✅ |
| 支援 JS 渲染？ | ❌ | ✅ | ✅ | ✅ |
| 引用密度 | 低 | 中 | 高 | 中 |

## 實際策略

看完管線差異，幾個可以直接執行的方向：

**正文結構比 metadata 更重要。** 這是唯一在所有平台都有效的策略。用清楚的標題層級（H2/H3）、段落、列表組織正文。Claude 的 Turndown.js 轉換後，結構越清楚的頁面越容易保留可引用的段落；ChatGPT 的段落級檢索也依賴乾淨的分段。

**每段的第一句就是結論。** Claude 的 Haiku 摘要對非預核准網域只允許 125 字元的直接引用。讓每個段落的第一句都是可以獨立存在的完整主張，而不是鋪墊句。這在所有 AI 引擎都有幫助，因為它們都會做某種形式的段落摘要。

**schema 和 structured data 不要停。** 對 Perplexity 和 Gemini 仍然有效。但不要把它當成唯一策略——Claude 完全看不到，ChatGPT 的影響也是間接的。

**確保內容不依賴客戶端渲染。** Claude 的 Axios 和大多數 AI 爬蟲一樣不執行 JavaScript。如果你的頁面核心內容是 React/Vue 在瀏覽器端才渲染的，多數 AI 引擎讀到的是空殼或骨架。SSR 或靜態生成是基本要求。

**減少 `<nav>` 的文字雜訊。** Claude 的 Turndown.js 不會移除 `<nav>`，導航文字會跟正文一起被送進摘要模型搶注意力。用簡潔的導航標籤、避免在 nav 裡塞大量關鍵字。

**針對不同引擎分配資源。** 如果你的流量主要來自 Google 生態系（搜尋 + Gemini），structured data 仍是高優先。如果目標是被 AI coding 工具的使用者引用（Claude Code、Cursor 等），回到正文品質和靜態 HTML。

## 整體來說

2026 年的 AEO/GEO 不是「一套策略打天下」的事。各家 AI 引擎讀網頁的管線差異大到讓同一個頁面在不同平台呈現完全不同的面貌——從「完整爬取建索引」到「本地端 Axios 只讀 body」，差距不是微調能彌補的。

但有一件事是跨平台恆定的：**寫有資訊密度的正文，用清楚的結構呈現，讓每個段落在被截斷和改寫之後仍然有意義。** 技術手段（schema、llms.txt、JSON-LD）是加分，不是基礎。

## 參考資料

- [How Claude Code Eats the Web - Giuseppe Gurgone](https://giuseppegurgone.com/claude-webfetch)
- [Claude Code Leak: How WebSearch Sees Your Website - Wise Relations](https://wire.wise-relations.com/news/2026-04-01-claude-code-websearch-leak/)
- [Reverse Engineering Claude Code Web Tools - Liran Yoffe (Medium)](https://medium.com/@liranyoffe/reverse-engineering-claude-code-web-tools-1409249316c3)
- [Inside Claude Code's Web Tools: WebFetch vs WebSearch - Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-web-tools/)
- [Anthropic leaked its own Claude source code - Axios](https://www.axios.com/2026/03/31/anthropic-leaked-source-code-ai)
- [The Claude Code Source Leak: 512,000 Lines, a Missing .npmignore - Layer5](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history/)
- [Claude Code's Entire Source Code Was Just Leaked via npm Source Maps - DEV Community](https://dev.to/gabrielanhaia/claude-codes-entire-source-code-was-just-leaked-via-npm-source-maps-heres-whats-inside-cjo)
- [Architecting and Evaluating an AI-First Search API - Perplexity Research](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api)
- [How Perplexity Built an AI Google - ByteByteGo](https://blog.bytebytego.com/p/how-perplexity-built-an-ai-google)
- [How different AI engines generate and cite answers - Search Engine Land](https://searchengineland.com/how-different-ai-engines-generate-and-cite-answers-463234)
- [Perplexity vs ChatGPT vs Gemini: How AI Engines Cite Content - WhiteHat SEO](https://whitehat-seo.co.uk/blog/ai-engines-comparison-citations)
- [Grounding with Google Search - Gemini API Docs](https://ai.google.dev/gemini-api/docs/google-search)
- [How OpenAI, Gemini, Perplexity, Claude Crawl Your Website - Daydream Journal](https://journal.withdaydream.com/p/how-openai-gemini-perplexity-claude-crawl-and-index-your-website)
