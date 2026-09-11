---
title: "Groundlane 實戰系列（篇 6）：Document 工具全家桶 — effort 旋鈕、field-aware chunking 與 confidence routing"
date: 2026-09-11
category: tech
type: deep-dive
tags: [groundlane, mcp, document-parsing, rag, chunking, effort, ocr, vlm, docling, confidence-routing]
lang: zh-TW
tldr: "document_parse 新增 effort 參數（fast/standard/deep）把 anydoc WASM、OCR.space、Docling VLM 三條路徑統一成一個旋鈕；document_chunk 的 fieldAware 模式從表格 header 和 metadata 抽欄位名附到 chunk，解決 RAG 的 attribute conflation；document_smart_parse 回傳 confidence 分數讓 agent 自己決定要不要升級。"
description: "Groundlane 實戰系列第六篇：document_parse 的 effort 參數設計、document_chunk 的 field-aware 模式如何解決 RAG 屬性混淆問題、document_smart_parse 的 confidence routing 讓 agent 自主決策升級路徑，以及 Docling-serve VLM adapter 的設計與接入方式。"
draft: false
series:
  name: "Groundlane 實戰系列"
  order: 6
glossary:
  - term: "effort"
    definition: "document_parse 的品質-成本旋鈕：fast（確定性本地解析，零成本）、standard（掃描件自動升級 OCR）、deep（VLM 高精度解析）。"
  - term: "field-aware chunking"
    definition: "document_chunk 的 fieldAware 模式：從表格第一行和 metadata 提取欄位名，附到每個 chunk 的 fields 陣列，讓下游向量庫做 metadata pre-filter。"
  - term: "attribute conflation"
    definition: "embedding 模型把多個結構化欄位（名稱、難度、地點）壓進同一個向量，導致搜尋時無法區分使用者關注哪個屬性的問題。"
---

> 🌏 [English version](/posts/tech/2026-09-11-groundlane-series-6-en)

前五篇把 Groundlane 的 Web 工具從概念走到踩坑清單（[篇 1：為什麼需要受控存取層](/posts/tech/2026-08-23-groundlane-series-1)、[篇 2：三個工具的參數與回傳](/posts/tech/2026-08-23-groundlane-series-2)、[篇 3：與傳統方案對比](/posts/tech/2026-08-23-groundlane-series-3)、[篇 4：站內應用](/posts/tech/2026-08-23-groundlane-series-4)、[篇 5：踩坑與最佳實踐](/posts/tech/2026-08-23-groundlane-series-5)）。這篇進入 Document 工具——Groundlane 從 `v0.1.0` 之後擴展到 55 個工具，其中文件解析相關佔了超過 20 個。這篇聚焦三個設計決策：`effort` 參數、field-aware chunking、confidence routing。

## 為什麼需要 effort 旋鈕

Groundlane 的文件解析有三條路徑，各自獨立存在：

| 路徑 | 工具 | 成本 | 精度 | 適合 |
|---|---|---|---|---|
| 確定性本地解析 | `document_parse`（anydoc WASM） | $0 | 中 | 數位原生 PDF/DOCX/CSV |
| OCR | `document_ocr`（OCR.space） | 免費額度 25k/月 | 高（掃描件） | 掃描 PDF、圖片 |
| VLM 版面解析 | Docling-serve（GraniteDocling 258M） | 自架成本 | 最高 | 複雜表格、多欄、圖文混排 |

問題是：caller 必須自己判斷該用哪個工具。一個 PDF 可能前三頁是數位文字、第四頁是掃描的附件——你要先用 `document_smart_parse` 偵測，再決定走哪條路。

依 [MinerU](https://github.com/opendatalab/MinerU) 的設計（`effort: medium | high` 參數，在同一引擎內調整解析深度），Groundlane 把三條路徑統一成 `document_parse` 的 `effort` 參數：

```json
{
  "name": "document_parse",
  "arguments": {
    "source": {
      "kind": "inline",
      "dataBase64": "...",
      "mimeType": "application/pdf",
      "filename": "report.pdf"
    },
    "output": "markdown",
    "effort": "standard"
  }
}
```

- **`fast`**（預設）：走 anydoc WASM 確定性解析，零成本，適合已知是數位原生的文件
- **`standard`**：先跑 `fast`，然後偵測內容是否為掃描件（用 pdf.js 分析前 5 頁的文字量）；若超過半數頁面文字量低於 5 個字元，自動升級到 OCR.space
- **`deep`**：走 Docling-serve VLM 路徑，用 GraniteDocling 258M 做版面感知解析

response 加了 `effortUsed` 欄位，告訴 caller 實際走了哪條路：

```json
{
  "ok": true,
  "data": {
    "effortUsed": "standard",
    "envelope": { "..." },
    "projection": { "..." },
    "mediaType": "application/pdf",
    "bytes": 245760
  }
}
```

與 MinerU 的差異：MinerU 的 `effort` 在同一引擎內調整（規則引擎的強度），Groundlane 的 `effort` 跨引擎路由（anydoc → OCR → VLM）。MinerU 的 `vlm-engine` 是通用介面可接不同 VLM，Groundlane 目前固定接 Docling-serve。兩者不是替代關係——MinerU 是獨立的解析工具，Groundlane 是 MCP server 的統一入口。

## field-aware chunking：解決 RAG 的 attribute conflation

這個功能直接源自一個在攀岩推薦系統上踩到的 RAG 問題（[完整分析](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation)）：使用者查「美人照鏡 5.11b，推薦類似難度的路線」，結果回來的全是名字像的路線——難度從 5.8 到 5.12 都有。

根因是 dense embedding（如 `bge-m3`）把多個獨立屬性壓進同一個向量。「美人照鏡」作為專有名詞在 embedding 空間裡區辨力極高，「5.11b」作為結構化等級標記出現頻率遠高於特定路線名——模型自然把更多注意力放在稀有詞上。這就是 attribute conflation。

解法之一是在 chunk 階段就保留欄位資訊，讓下游向量庫做 metadata pre-filter。Groundlane 的 `document_chunk` 新增了 `fieldAware` 參數：

```json
{
  "name": "document_chunk",
  "arguments": {
    "dataBase64": "...",
    "mimeType": "text/csv",
    "filename": "routes.csv",
    "fieldAware": true
  }
}
```

開啟後，每個 chunk 會多一個 `fields` 陣列：

```json
{
  "chunkId": "chunk-L0-0",
  "text": "Name | Grade | Location | Type\nBeauty Mirror | 5.11b | Dragon Cave | Sport",
  "tokenCount": 18,
  "blockRefs": ["table-1"],
  "fields": ["Name", "Grade", "Location", "Type"]
}
```

欄位名從兩個來源提取：

1. **表格 header**：表格第一行（row 0）的非空白內容
2. **Document metadata**：envelope 裡的 `metadata` key-value pairs

下游寫入向量庫時，可以把 `fields` 存為 metadata：

```python
# 寫入 Vectorize / Pinecone / Qdrant 時
for chunk in response["data"]["chunks"]:
    vector_db.upsert(
        id=chunk["chunkId"],
        text=chunk["text"],
        metadata={"fields": chunk["fields"]}  # 用於 pre-filter
    )

# 查詢時
results = vector_db.query(
    text="推薦 5.11b 難度的路線",
    filter={"fields": {"$contains": "Grade"}}  # 只搜有 Grade 欄位的 chunk
)
```

這不是完整的解法——完整方案需要 query rewriting + score fusion（見[原文](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation)的三層防線）——但它在 chunking 階段就減少了噪音，成本是零（純規則提取，不呼叫 LLM）。

## confidence routing：讓 agent 自己決定

`document_smart_parse` 原本就會偵測掃描件（用 pdf.js 分析每頁文字量），但它只在 response 裡告訴你「這是掃描 PDF」而不會建議你下一步該做什麼。新版加了 `confidence` 物件：

```json
{
  "ok": true,
  "data": {
    "routedTo": "document_parse",
    "routeReason": "Mixed PDF: pages 1, 2 have text, pages 3, 4 appear scanned",
    "confidence": {
      "score": 0.75,
      "suggestedEffort": "standard",
      "reason": "2 of 4 pages appear scanned"
    },
    "content": "...",
    "engine": "groundlane-bounded-document-v3"
  }
}
```

confidence 的計算邏輯：

| 情況 | score | suggestedEffort |
|---|---|---|
| 全部頁面有文字 | 0.95 | fast |
| 全部掃描，有 OCR 且已使用 | 0.7 | standard |
| 全部掃描，OCR 未配置 | 0.1 | deep |
| 混合（部分掃描） | `1 - scannedRatio × 0.5` | scannedRatio > 0.3 → standard |
| 大檔案但幾乎沒提取到文字 | 0.2 | standard |

這遵循 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 的核心思路：不是自動升級（那會違反 bounded cost 原則），而是給 agent 資訊讓它決定。agent 可以這樣用：

1. 先呼叫 `document_smart_parse`
2. 看 `confidence.score`——如果 > 0.8，用 `fast` 就夠了
3. 如果 < 0.5，用 `document_parse` 的 `effort: "standard"` 或 `"deep"` 重新解析

## Docling-serve VLM adapter

`effort: "deep"` 背後接的是 Docling-serve，IBM 開源的文件解析 API server（MIT 授權，依 [Docling 深入介紹](/posts/tech/2026-09-06-docling-document-parsing) 的分析，它的核心價值是結構化 JSON 輸出和可替換階段 pipeline）。

Groundlane 的 adapter 做了幾件事：

1. **標準化輸入**：把 Groundlane 的 base64 inline source 轉成 Docling-serve 的 FormData file upload
2. **標準化輸出**：把 Docling 的 `DoclingDocument` JSON（`main_text` + `tables`）轉成 Groundlane 的 `DocumentBlock` 格式（`TextBlock` + `TableBlock`）
3. **pipeline 選擇**：支援 `standard`（確定性規則引擎）和 `vlm`（GraniteDocling 258M）兩種 pipeline

配置方式是設定 `DOCLING_SERVE_URL` 環境變數指向自架的 Docling-serve 實例。不配置時 `effort: "deep"` 仍然可用但不會啟動 VLM——只會標記 `effortUsed: "deep"` 讓 caller 知道它要求了高精度但 VLM backend 未就緒。

## 整體來說

這三個功能解決的是同一個問題：**文件解析不是一刀切的**。

- `effort` 讓 caller 不需要知道「該用哪個工具」，只需要說「我要多高的精度」
- `fieldAware` 讓 chunking 保留結構化語意，而不是把所有欄位壓進同一個文字塊
- `confidence` 讓 agent 在「成本」和「品質」之間自主決策，而不是由系統硬性決定

三者都是 additive（新增參數，不破壞現有行為）、deterministic（不引入隱式 LLM 呼叫）、bounded（不自動升級到更貴的路徑——除非 caller 明確要求）。這和 Groundlane 的核心設計原則一致：確定性 extraction 不以隱藏的 LLM call 假裝穩定 structured output。

## 參考資料

- [Groundlane — GitHub Repo](https://github.com/lanefoundry/groundlane) — 原始碼、README（55 個工具完整清單）、`src/tools/document-parse.ts`（effort 參數實作）、`src/tools/document-chunk.ts`（fieldAware 實作）
- [MinerU — GitHub Repo](https://github.com/opendatalab/MinerU) — `effort: medium | high` 參數設計參考
- [Docling — GitHub Repo](https://github.com/docling-project/docling) — VLM adapter 的 backend，MIT 授權，LF AI & Data 治理
- [Docling-serve — GitHub Repo](https://github.com/docling-project/docling-serve) — Docling 的 REST API server，Groundlane `effort: "deep"` 的實際 backend
- [當 Vector Search 把名字當難度搜：RAG 系統的 Attribute Conflation 問題](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation) — field-aware chunking 的問題動機
- [Agentic Parsing：讓 Agent 決定怎麼解析文件](/posts/ai/2026-09-03-agentic-parsing-document-agents) — confidence routing 的設計靈感
- [Docling：IBM 開源、MIT 授權、結構化 JSON 為核心的文件解析標準庫](/posts/tech/2026-09-06-docling-document-parsing) — Docling 的完整介紹
- [Groundlane 實戰系列（篇 1）：為什麼 AI 代理需要一個受控的網路存取層](/posts/tech/2026-08-23-groundlane-series-1) — 系列起點
- [Groundlane 實戰系列（篇 2）：三個 MCP 工具的參數、回傳與錯誤處理](/posts/tech/2026-08-23-groundlane-series-2)
- [Groundlane 實戰系列（篇 3）：與傳統方案的對比](/posts/tech/2026-08-23-groundlane-series-3)
- [Groundlane 實戰系列（篇 4）：在 quidproquo 站內的應用](/posts/tech/2026-08-23-groundlane-series-4)
- [Groundlane 實戰系列（篇 5）：踩坑與最佳實踐](/posts/tech/2026-08-23-groundlane-series-5)
