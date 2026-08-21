---
title: "Agent 搜尋 Query 怎麼寫：關鍵字、語意描述、拆解與改寫"
date: 2026-08-22
category: ai
type: deep-dive
tags: [web-search, ai-agent, query-rewriting, semantic-search, academic-search]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 9
tldr: "Agent 不該把使用者原句直接丟給每一種搜尋服務：先辨認 exact lookup、keyword、semantic 或 fielded search，再把來源、時間、語言與欄位限制放進 provider 原生參數，最後依零結果、結果過廣與來源不對症狀改寫。"
description: "一套可重跑的 Agent 搜尋 query 方法：從查詢分類、關鍵字與語意描述，到拆解、擴展、學術 API 語法與失敗後改寫，附 12 個固定案例。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-agent-search-query-writing-en)

搜尋品質不只取決於搜尋引擎。Agent 把「幫我查一下」原封不動送出去，等於把使用者的對話句當成檢索語言；偶爾能中，多半不可控。

比較穩的做法是把 query 當成編譯結果：先判斷這次在找識別碼、某種頁面、未知概念，還是一組學術紀錄，再轉成目標 provider 看得懂的語法。本文只處理**送出單次搜尋前，query 如何生成與修正**。多步研究的任務規劃與停止條件不在範圍內；向量資料庫裡的多路召回則另見 [Multi-Query Expansion](/posts/ai/2026-03-12-multi-query-expansion)。

## 先決定你在寫哪一種 query

同一句需求至少有四種編譯目標：

| 類型 | query 的核心 | 典型用途 |
|---|---|---|
| Exact lookup | 不可被改寫的字串 | 錯誤訊息、API symbol、DOI、型號 |
| Keyword search | 幾個高辨識度詞彙 | 找官方文件、版本公告、特定檔案 |
| Semantic search | 理想頁面會怎麼介紹自己 | 找「描述得出來，但叫不出名稱」的內容 |
| Fielded search | 資料庫欄位與布林條件 | 論文、作者、日期、期刊、出版類型 |

這四類不能只靠字數分。`CVE-2026-1234` 很短，但每個字元都重要；「討論小團隊如何在 Cloudflare Workers 上做可觀測 AI agent 的工程文章」很長，卻適合語意檢索；「近五年、標題含 retrieval、排除 review」則應編譯成學術資料庫的欄位與 filter。

Agent 在真正搜尋前，至少應產生這份中介資料：

```json
{
  "intent": "exact_lookup | keyword | semantic | fielded",
  "must_keep": ["原樣保留的產品名、錯誤字串或識別碼"],
  "concepts": ["可以換同義詞的概念"],
  "source_preference": ["official", "primary"],
  "filters": {
    "domains": [],
    "published_after": null,
    "language": null,
    "document_type": null
  },
  "queries": []
}
```

`must_keep` 與 `concepts` 分開很重要。模型可以把「錯誤處理」擴展成 `exception handling`，卻不該把 `CrawlerRunConfig` 改成它猜測的 class 名稱。

## Keyword query：先保住辨識度，再減字

Keyword query 不是把問題刪成三個名詞，而是保留能排除錯頁的 lexical anchors。

依序做四件事：

1. 原樣保留錯誤訊息、symbol、產品名、版本與識別碼。
2. 移除「請幫我找」「最新是什麼」等對匹配沒有幫助的對話文字。
3. 加上一個能辨認頁面類型的詞，例如 `release notes`、`API reference`、`security advisory`。
4. 來源、時間、語言與檔案類型若有原生參數，就放在參數，不要全部塞進 query。

Google 的官方文件確認 `site:` 可限制網域或 URL prefix、`filetype:` 可限制檔案類型。不過這不是通用標準。[SearXNG Search API](https://docs.searxng.org/dev/search_api.html)會把 query 傳給外部搜尋服務，也直接警告：某個上游理解 `site:`，不代表其他上游會照做。因此，走 SearXNG 時應優先用 `engines`、`language`、`time_range` 等 API 參數；要用上游 operator，就把引擎固定住並記錄它。

```json
{
  "q": "\"CrawlerRunConfig\" \"wait_for\"",
  "engines": "google",
  "language": "en",
  "format": "json"
}
```

引號也不是越多越準。精確字串適合錯誤訊息與 symbol；一般概念全部加引號，常會把同義詞、詞形變化與不同語序一起擋掉。先鎖一個真正不可變的 anchor，其他詞保持可召回。

## Semantic query：描述你想找到的頁面

語意搜尋要寫的不是關鍵字袋，而是「理想結果會如何被介紹」。[Exa 的 Search Best Practices](https://exa.ai/docs/reference/search-best-practices)明確表示 `query` 支援長、語意豐富的描述，官方範例也是 `blog post about embeddings and vector search` 這種頁面描述。

一個可用的語意 query 通常含四個部件：

```text
[頁面類型] + [主題] + [必要條件] + [希望出現的證據]
```

例如不要只寫：

```text
React Vue performance
```

可以改成：

```text
An engineering article comparing React and Vue rendering performance,
with a reproducible benchmark setup, measured results, and stated limitations.
```

這裡的 `engineering article`、`reproducible benchmark setup` 與 `stated limitations` 都在描述理想頁面的特徵。如果 API 有 `includeDomains`、日期或 `category`，仍應用欄位限制；不要把「只找官方網站、2026 年後、英文」全混進自然語言，然後期待模型每次都同樣解讀。

## 拆解不是換十二種說法

一個 query 應只承擔一種可驗證的資訊需求。以下問題就該拆：

```text
比較 Tavily 和 Exa 的價格、資料保留政策、搜尋能力與自架可能性。
```

可以拆成：

```text
1. Tavily official pricing API credits
2. Exa official pricing API credits
3. Tavily official privacy data retention API queries
4. Exa official privacy zero data retention API queries
5. Tavily self-hosted official
6. Exa self-hosted official
```

理由不是「多搜幾次比較強」，而是不同主張的權威來源不同。價格應落到定價頁，資料保留應落到 privacy／security 文件，自架能力要找 deployment 或 repository。把六件事塞進一句話，搜尋排序只能猜哪一件最重要。

但 query expansion 是另一個動作：它保留同一個資訊需求，只換可能出現在文件裡的詞。例如 `data retention` 可以另跑 `query storage`、`zero data retention`，中文「隨身碟」可以另跑 `USB flash drive`。每個變體都要標記來自同一個 `claim_id`，合併時才不會被當成三份獨立證據。

一個實用上限是：**先一條精準 query；有明確漏召回跡象時，再加兩條變體。** 這是成本護欄，不是宣稱三條一定最佳。

## 學術搜尋：把自然語言翻成資料庫文法

學術 API 不共享一套 query syntax。照 Web 搜尋習慣拼 operator，最常見的結果不是 error，而是悄悄查錯欄位。

- [PubMed Help](https://pubmed.ncbi.nlm.nih.gov/help/)說明未加 tag 的字詞會走 Automatic Term Mapping；`[tiab]`、`[mh]`、`[dp]` 等欄位標籤會改變處理方式，布林運算子要大寫。它也提醒：加引號後如果 phrase 不在 phrase index，行為不一定等同一般 Web 搜尋的 exact match。
- [OpenAlex Search](https://help.openalex.org/api/searching/)目前提供 `search`、`search.exact` 與 `search.semantic`，每次 request 只能選一種；布林、片語、proximity、wildcard 也有自己的規則。
- [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/rest-api-filters/)把文字 query 與精確 filter 分開，出版日期應用 `from-pub-date`／`until-pub-date`，不要只把年份寫進 `query.bibliographic`。
- [Semantic Scholar Academic Graph API](https://api.semanticscholar.org/api-docs/)的 paper relevance search 與 bulk search 目的不同；bulk 的文字 query 對 title／abstract 配對並支援布林邏輯，filter 與回傳欄位另放參數。

因此 Agent 不該先生成一串「學術搜尋語法」再到處貼。它應先產生概念群組，再由各 adapter 編譯：

```text
concept A: retrieval-augmented generation OR RAG
concept B: query rewriting OR query reformulation
date: 2023-01-01..
document type: research article
```

同一份中介資料送往 PubMed、OpenAlex 或 Semantic Scholar 時，輸出必須不同。

## 12 個固定案例：這是可重跑規格，不是勝負表

下表是 query regression set。本站在 2026-08-22 **沒有替這 12 組保存跨 provider 的 raw results**，因此「預期改變」只是要驗證的方向，不是已觀察到的排名或成功率。實際使用時應保存 provider、完整 request、時間、前幾筆原始回應與人工判定，再談哪種寫法較好。

| ID | 需求與原始 query | 改寫／拆解 | 預期改變（待實測） |
|---|---|---|---|
| Q01 | `Node fetch failed 怎麼辦` | `"TypeError: fetch failed" undici Node.js` | 用原始錯誤字串縮小到同一 failure family |
| Q02 | `Crawl4AI 等元素` | `"CrawlerRunConfig" "wait_for" API reference` | 保留 class 與 parameter，減少泛用爬蟲教學 |
| Q03 | `Astro 最新版本` | `Astro stable release notes`＋官方 domain filter | 把「最新」轉成 release page 與來源限制 |
| Q04 | `台灣人工智慧政策 PDF` | `人工智慧 政策`＋`site:gov.tw`＋`filetype:pdf` | 限縮到政府網域與文件類型；僅用於支援 operator 的引擎 |
| Q05 | `React Vue performance` | `An engineering article comparing React and Vue rendering performance with a reproducible benchmark and limitations` | 由詞彙共現改成理想頁面描述 |
| Q06 | `小團隊 agent observability` | `A postmortem or engineering guide about observability for production AI agents operated by a small team, including traces, cost, and failure diagnosis` | 尋找具體經驗頁，而非名詞介紹 |
| Q07 | `比較 Tavily 跟 Exa` | 拆成 pricing、retention、search capability、self-hosting 四個 claim group，各自加官方來源限制 | 讓每一項比較落到對應的一手文件 |
| Q08 | `2026 Astro security` | `Astro security advisory`＋`published_after=2026-01-01`＋官方 domain filter | 把時間與來源移到結構化 filter |
| Q09 | `台灣 USB 叫什麼` | 同一 claim 跑 `隨身碟 USB 台灣用語` 與 `"USB flash drive" Taiwan terminology` | 補中英文用詞差異，不把兩筆當獨立證據 |
| Q10 | `RAG query rewrite 醫療 systematic review 近五年` | PubMed：`(("retrieval augmented generation"[tiab] OR RAG[tiab]) AND ("query rewriting"[tiab] OR "query reformulation"[tiab])) AND 2021:2026[dp]` | 用欄位與日期範圍限制 title／abstract 與出版年 |
| Q11 | `用很長的研究摘要找相近論文` | OpenAlex：`search.semantic=<abstract>`，日期等條件另用 filter | 讓長輸入走語意模式，而非硬拆成關鍵字 |
| Q12 | `找 2024 年 query rewriting 論文 DOI` | Crossref：`query.bibliographic=query rewriting`＋`filter=from-pub-date:2024-01-01,until-pub-date:2024-12-31,type:journal-article`＋`select=DOI,title` | 分開文字匹配、日期／類型限制與回傳欄位 |

Q10–Q12 是語法範例，不是完整 systematic review search strategy。真正的文獻回顧還要處理受控詞彙、資料庫覆蓋、去重與人工篩選，會在後續學術搜尋管線專文處理。

## 失敗後怎麼改：一次只動一個旋鈕

不要看到結果差就叫 LLM「重寫得更好」。先把症狀分類，才能知道改哪裡。

| 症狀 | 先檢查 | 下一次只改這件事 |
|---|---|---|
| 零結果 | exact anchor 是否拼錯、引號／欄位是否過窄 | 拿掉一個限制，或把片語改成兩個概念 |
| 結果過少 | 同義詞、縮寫、語言是否漏掉 | 新增一條 expansion query，不覆蓋原 query |
| 結果過廣 | 是否缺產品名、頁面類型或欄位 | 加一個高辨識度 anchor 或原生 filter |
| 結果來源不對 | 來源偏好是否只寫在自然語言 | 改用 domain／category／endpoint 限制 |
| 結果過舊 | 「latest」是否只是文字 | 改用 publication／crawl date filter |
| 全是二手整理 | 任務是否明確要求 primary source | 拆出官方文件、論文、法規或原始公告 query |
| 同站重複頁 | query 是否混了多個 claim | 先拆 claim，再對 URL canonicalize／dedupe |

每次只改一個旋鈕，才能知道是哪個條件改變結果。建議 trace 至少保存：

```json
{
  "case_id": "Q03",
  "claim_id": "astro-current-stable-version",
  "provider": "provider-name",
  "request": {},
  "rewrite_reason": "source-mismatch",
  "parent_query_id": "q-001",
  "searched_at": "ISO-8601 timestamp",
  "raw_result_path": "artifacts/search/q-002.json"
}
```

沒有 raw result，就不要只留下「第二版比較好」。搜尋索引、排序與 API 都會變；可重跑的 query 加上當時回應，才是能除錯的紀錄。

## 一個夠用的 Agent 迴圈

```text
使用者需求
  ↓
抽出 must_keep、concepts、source、time、language、document type
  ↓
分類 exact / keyword / semantic / fielded
  ↓
編譯成 provider query + native filters
  ↓
檢查前幾筆：是否對題、是否一手、是否夠新
  ↓
依症狀放寬、限縮、擴展或拆解（一次一種）
  ↓
保存 request + raw results + 判定
```

停止條件也要在 query 階段寫清楚：找到能直接支持 claim 的一手來源就停；連續兩次只換同義詞卻沒有新增合格來源，就不要無限改寫，改走其他 provider、改查已知資料庫，或回報缺口。

## 整體來說

Agent 搜尋 query 的關鍵不是「讓 LLM 想出更多關鍵字」，而是**先分清楚什麼不能改、什麼可以換詞、什麼應該成為 filter，以及這次到底要找哪一種頁面或紀錄**。

Keyword query 靠 lexical anchor；semantic query 靠理想頁面的描述；academic query 靠資料庫自己的欄位與布林文法。遇到失敗時，一次只放寬或收緊一個條件，並保留 parent query 與 raw results。這樣 query 才不是 prompt 裡消失的一句字串，而是可以版本控制、回歸測試與追責的 retrieval artifact。

下一篇會接「抓對」：用固定 URL 比較 Crawl4AI、Firecrawl、Jina Reader 與 Readability 的正文、表格、程式碼與 metadata 保存情況。

## 參考資料

- [SearXNG Search API：query 與上游語法的關係](https://docs.searxng.org/dev/search_api.html)
- [Google Search Central：`site:` 與 `filetype:` operators](https://developers.google.com/search/docs/monitor-debug/search-operators)
- [Exa Search Best Practices：長語意 query、filter 與 search type](https://exa.ai/docs/reference/search-best-practices)
- [OpenAlex Search：exact、Boolean、phrase、proximity 與 semantic search](https://help.openalex.org/api/searching/)
- [Crossref REST API Filters](https://www.crossref.org/documentation/retrieve-metadata/rest-api/rest-api-filters/)
- [Crossref REST API Tips：query、filter 與 select](https://www.crossref.org/documentation/retrieve-metadata/rest-api/tips-for-using-the-crossref-rest-api/)
- [Semantic Scholar Academic Graph API](https://api.semanticscholar.org/api-docs/)
- [PubMed Help：Automatic Term Mapping、field tags 與 Boolean operators](https://pubmed.ncbi.nlm.nih.gov/help/)
- 站內相關：[Exa 完整介紹](/posts/ai/2026-08-21-exa-neural-search-for-agents)、[SearXNG 完整介紹](/posts/ai/2026-08-21-searxng-complete-guide)、[Web Retrieval Fallback Routing](/posts/ai/2026-08-21-web-retrieval-fallback-routing)、[Multi-Query Expansion](/posts/ai/2026-03-12-multi-query-expansion)
