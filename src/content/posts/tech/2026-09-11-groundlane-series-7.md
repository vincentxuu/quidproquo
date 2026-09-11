---
title: "Groundlane 實戰系列（篇 7）：Selector Healing、Retrieval Test 與品質 Benchmark"
date: 2026-09-11
category: tech
type: deep-dive
tags: [groundlane, mcp, web-extract, selector, rag, corpus, benchmark, document-parsing, retrieval-test]
lang: zh-TW
tldr: "Groundlane v0.1.0 新增四個品質機制：web_extract 的 selector healing（三層確定性 fallback，不用 LLM）、corpus_retrieval_test（RAG 召回品質驗證，受 RAGFlow 啟發）、document benchmark CLI（character-level F1）、search benchmark framework（ground truth corpus + 多 provider 比較）。工具數從 54 增至 55。"
description: "篇 7 聚焦「讓 agent 取到的資料更穩」：selector 壞了怎麼自動修復、corpus 品質怎麼在建 pipeline 前驗證、文件解析和搜尋的品質怎麼用 benchmark 量化。"
draft: false
glossary:
  - term: "selector-healing"
    definition: "web_extract 的確定性 fallback 機制：當 CSS selector 無匹配時，依序嘗試 tag-only → partial class → attribute 三種降級策略，回報 healedFields 讓 caller 知道修復了什麼。"
  - term: "corpus-retrieval-test"
    definition: "Groundlane 的 RAG 召回品質驗證工具：給定 query 和預期 source ID 清單，回報 recall、每個命中的 rank 和 score、以及漏掉的 source。"
---

> 🌏 [English version](/posts/tech/2026-09-11-groundlane-series-7-en)

前五篇建立了 Groundlane 的操作基線——三個核心工具的合約、與傳統方案的差異、站內應用、踩坑清單。這篇的焦點不在「怎麼用」，而在「怎麼確保取到的資料是對的」：selector 壞了能不能自救、corpus 的召回品質能不能在建 pipeline 前就驗證、文件解析和搜尋的品質能不能用數字衡量。

## Selector Healing：確定性的三層 Fallback

### 問題：selector 為什麼會壞

`web_extract` 的確定性建立在 CSS selector 與目標 DOM 結構的一致性上。篇 5 已經說過：selector 無匹配時，系統不會自動修正，也不會隱式填充。但現實是，目標頁面的 DOM 會改版——class name 加了前綴、元素從 `div` 變成 `section`、屬性名微調。對定期跑的自動化流程來說，selector 壞掉是時間問題，不是機率問題。

傳統的解法是「壞了就手動修」或「用 LLM 猜一個新的 selector」。前者不 scale，後者破壞確定性。Groundlane 的做法是在兩者之間加一層：確定性的 fallback，不猜，但試幾種降級策略。

### 三層降級策略

[`tryHealSelector`](https://github.com/lanefoundry/groundlane/blob/main/src/core/extract-fields.ts) 的邏輯依序嘗試三種策略：

**第一層：tag-only fallback。** 從原始 selector 提取 tag name（例如 `h1.article-title` → `h1`），只用 tag 去匹配。如果頁面上有 `<h1>` 元素，這層就能接住大部分「class 改了但元素還在」的情況。

**第二層：partial class match。** 提取 selector 中的第一個 class name（例如 `.article-title-v2` 中的 `article-title-v2`），用 `[class*="article-title-v2"]` 做 substring match。這能接住「class name 只改了前綴或後綴」的情況。

**第三層：attribute fallback。** 提取 selector 中的屬性名（例如 `[data-testid="price"]` 中的 `data-testid`），只匹配有該屬性的元素，不限值。

三層都失敗，selector 就真的無匹配，回到 `missingFields`。沒有第四層，沒有 LLM。

### healedFields 回報

當 healing 觸發時，response 會多一個 `healedFields` 陣列（[`web-extract.ts`](https://github.com/lanefoundry/groundlane/blob/main/src/tools/web-extract.ts) 實作）：

```json
{
  "healedFields": [
    {
      "name": "price",
      "originalSelector": "span.price-tag-v2",
      "healedSelector": "span"
    }
  ]
}
```

caller 知道三件事：哪個欄位被修復了、原始 selector 是什麼、實際用了什麼 fallback。這讓 agent 可以決定「接受 healed 結果」或「回報需要人工檢查」，而不是悶頭用錯誤的資料。

### 風險控制

healing 刻意保守。tag-only fallback 可能匹配到多個同 tag 元素（頁面上不只一個 `<span>`），但 `web_extract` 會依 `many: true/false` 控制回傳數量，且 healed 結果明確標記，不會偷偷混進正常結果。如果 healing 匹配到的元素內容明顯不對，那是 caller 的判斷問題，不是系統的——系統只負責「在完全無匹配時嘗試降級」，不負責「確保降級結果一定正確」。

## corpus_retrieval_test：RAG 召回品質驗證

### 為什麼在建 pipeline 前就要驗證召回

[RAGFlow 的 Retrieval Test 功能](https://ragflow.io/)——在生成回答前看見召回內容——解決了一個常見的 RAG 盲區：你不知道 LLM 是基於正確的 source 回答，還是基於「剛好匹配到的不相關文件」回答。Groundlane 的 `corpus_retrieval_test`（[`corpus-tools.ts`](https://github.com/lanefoundry/groundlane/blob/main/src/tools/corpus-tools.ts) 實作）把這個概念做成 MCP 工具：不跑 LLM 生成，只測檢索。

### 怎麼用

輸入：corpus ID、query、預期應該被召回的 source ID 清單。輸出：

```json
{
  "corpusId": "tech-docs",
  "query": "Cloudflare Workers WASM size limit",
  "expectedCount": 2,
  "foundCount": 1,
  "recall": 0.5,
  "hits": [
    { "sourceId": "workers-limits", "expected": true, "rank": 1, "score": 0.92 },
    { "sourceId": "workers-pricing", "expected": false, "rank": 2, "score": 0.71 }
  ],
  "missed": ["workers-changelog"]
}
```

`recall` 直接告訴你：預期的 2 個 source 只找到 1 個（50%）。`missed` 指出漏了哪個。`hits` 裡的 `expected: false` 顯示有不在預期清單裡的結果混進 top-K。

### 適合的情境

- **新 corpus 上線前**：enroll 完 source 後，用幾個已知 query 跑 retrieval test，確認召回率達標再接 LLM。
- **source 更新後**：corpus 更新了幾個 source，用 retrieval test 確認更新沒有破壞既有的召回品質。
- **比較不同 chunk 策略**：同一批 source 用不同的 `document_chunk` 參數（例如 2048 vs 512 token level），各跑一次 retrieval test 比較 recall。

這個工具是 read-only 的，不消耗 LLM token，跑一次只是一個 corpus_search 的成本。

## Document Benchmark CLI

### 為什麼需要 benchmark

`document_parse` 支援 14+ 種格式（PDF、DOCX、XLSX、PPTX、CSV、HTML、Markdown、JSON、XML、RTF、EML、EPUB、ODF），但「支援」和「正確」是兩件事。一個 CSV 檔案能被解析不代表所有 cell 都被正確提取；一個 PDF 能產出 text block 不代表文字沒有亂序。

[`benchmark-document.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-document.mts) 的設計目標是：用最小的 fixture 集合驗證每種格式的基本正確性，而不是追求大規模的涵蓋率。

### character-level F1

benchmark 使用兩個互補指標：

**required-text recall**：fixture 定義一組「必須出現在解析結果中」的字串（例如 CSV 裡的每個 cell 值），recall 是「找到幾個 / 預期幾個」。這抓的是「有沒有漏」。

**character-level F1**：把 required text 和解析結果各拆成字元級別的 bag-of-chars，算 precision（解析結果中有多少字元是正確的）和 recall（正確字元被找到了多少），取 F1。這比 exact match 更適合文件解析——因為解析結果可能多出空白、標點或格式標記，但核心內容是正確的。

### fixture 設計

目前 3 個 fixture（[`test/fixtures/document/`](https://github.com/lanefoundry/groundlane/tree/main/test/fixtures/document)）：

| fixture | 格式 | 測什麼 |
|---|---|---|
| `text-pdf` | PDF | 單頁文字 PDF 的基本文字提取 |
| `csv-table` | CSV | 4 欄 4 列表格的 cell 完整性（20 cells） |
| `markdown-doc` | Markdown | heading、列表、表格的文字保留 |

每個 fixture 是一個目錄，包含 `source.*`（原始檔案）和 `expected.json`（ground truth）。跑法：

```bash
node --import tsx scripts/benchmark-document.mts
```

輸出是 machine-readable JSON，包含每個 fixture 的 recall、F1、block 數、table cell 數和延遲。

### 設計取捨

fixture 刻意很小（3 個），因為這是 regression gate 而不是品質排行榜。目標是「每次改 parser 都能在 1 秒內跑完所有 fixture，確認沒有退化」，而不是「證明 Groundlane 的 parser 比 Docling 好」。要做跨 parser 比較，需要更大的 corpus 和人工審核的 ground truth——那是 [Arena 設計](https://github.com/lanefoundry/groundlane/blob/main/docs/product/arena-design.md) 的範疇。

## Search Benchmark Framework

### ground truth corpus 格式

[`test/fixtures/search/queries.json`](https://github.com/lanefoundry/groundlane/blob/main/test/fixtures/search/queries.json) 定義 benchmark 的 query corpus：

```json
{
  "schemaVersion": 1,
  "queries": [
    {
      "id": "factual-01",
      "category": "factual",
      "query": "Cloudflare Workers WASM size limit",
      "expectedUrls": ["https://developers.cloudflare.com/workers/platform/limits/"],
      "expectedFragments": ["module size"]
    }
  ]
}
```

每個 query 有兩種 ground truth：

- `expectedUrls`：預期 top-5 結果應該包含這些 URL（部分匹配，容許 trailing slash 差異）。
- `expectedFragments`：預期結果的 title + snippet 合併文字中應該包含這些片段。

### 多 provider 比較

[`benchmark-search.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-search.mts) 會啟動一個本機 MCP server，透過 `web_search` 工具呼叫指定的 provider：

```bash
# 自動模式（用 Groundlane 預設的 RRF 合併）
node --import tsx scripts/benchmark-search.mts

# 指定 provider
node --import tsx scripts/benchmark-search.mts -- test/fixtures/search/queries.json brave
node --import tsx scripts/benchmark-search.mts -- test/fixtures/search/queries.json tavily
```

輸出 JSON 包含每個 query 的 `urlRecall`、`fragmentRecall`、使用的 provider、延遲和錯誤（如果有）。summary 包含整體平均 recall 和 p95 延遲。

### 目前的限制

- query corpus 只有 5 個 query（2 factual、2 technical、1 current events），不具統計顯著性——只能看大方向差異，不能做排名。
- ground truth 是手寫的，沒有經過人工 annotation 流程驗證。
- expectedUrls 容許部分匹配，可能產生 false positive（例如某個不相關的 URL 剛好包含 expected URL 的 substring）。
- 需要 provider API key 才能實際執行，offline 跑不了。

要把這個做成有公信力的排行榜，需要擴充到 50+ query、分五個 strata（factual / current events / technical / multi-hop / ambiguous），並加入人工 annotation——這是 [Arena 設計文件](https://github.com/lanefoundry/groundlane/blob/main/docs/product/arena-design.md) 中 Search track 規劃的範疇。

## 整體來說

四個機制解決的是同一類問題：agent 從外部取資料時，怎麼知道取到的是對的。selector healing 處理「DOM 改版時 selector 壞掉」的確定性修復；corpus_retrieval_test 處理「RAG pipeline 建起來前驗證召回品質」；document benchmark 處理「parser 改動後確認沒退化」；search benchmark 處理「多 provider 的品質比較」。

這些都不用 LLM：healing 是確定性的 DOM 結構匹配，retrieval test 是純檢索 + 集合比對，benchmark 是字元級別的 F1 計算。在 agent 生態裡，「確定性的品質機制」比「用另一個 LLM 去判斷品質」便宜得多，也更可重現。

## 參考資料

- [Groundlane — GitHub Repo](https://github.com/lanefoundry/groundlane) — 原始碼、README（55 個工具清單）、CHANGELOG、SECURITY.md
- [Groundlane `extract-fields.ts` — selector healing 實作](https://github.com/lanefoundry/groundlane/blob/main/src/core/extract-fields.ts) — `tryHealSelector` 三層降級策略、`HealedField` 型別、`extractFields` 整合邏輯
- [Groundlane `corpus-tools.ts` — corpus_retrieval_test 實作](https://github.com/lanefoundry/groundlane/blob/main/src/tools/corpus-tools.ts) — 輸入 schema、recall 計算、missed source 回報
- [Groundlane `benchmark-document.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-document.mts) — character-level F1、required-text recall、fixture schema
- [Groundlane `benchmark-search.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-search.mts) — ground truth corpus 格式、多 provider MCP 呼叫、JSON 輸出
- [Groundlane Arena 設計文件](https://github.com/lanefoundry/groundlane/blob/main/docs/product/arena-design.md) — Search/Extraction/Document 三個 track 的完整 benchmark 規劃、Elo 評分系統
- [RAGFlow](https://ragflow.io/) — Retrieval Test 功能的靈感來源：在生成回答前看見並驗證召回內容
- [Groundlane 實戰系列（篇 5）：踩坑與最佳實踐](/posts/tech/2026-08-23-groundlane-series-5) — selector 設計錯誤的確定性特性、`truncated` 檢查、版本變動風險
- [Groundlane 實戰系列（篇 2）：三個 MCP 工具的參數、回傳與錯誤處理](/posts/tech/2026-08-23-groundlane-series-2) — `web_extract` 的 selector / pattern engine 基礎合約
