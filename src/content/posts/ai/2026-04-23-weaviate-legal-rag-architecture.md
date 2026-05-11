---
title: "36 小時建出法律合約 RAG：Weaviate Query Agent + ColQwen 架構拆解"
date: 2026-04-23
type: guide
category: ai
tags: [rag, weaviate, legal-ai, colqwen, muvera, vector-database, agentic-search]
lang: zh-TW
tldr: "用 Weaviate Query Agent + ColQwen 多向量模型，一個 prompt 在 36 小時內搭出生產等級的法律合約搜尋系統——這篇拆解它的架構邏輯、技術選擇，以及你真正需要注意的事。"
description: "拆解 Weaviate 法律合約 RAG 系統的完整架構：ColQwen 視覺嵌入、Muvera 多向量壓縮、Query Agent 動態推理搜尋，以及 CUAD dataset 的資料結構。"
draft: false
series:
  name: "RAG 系統實戰"
  order: 5
---

法律文件搜尋是 RAG 最難的場景之一。不是因為資料量，而是因為精確度要求：使用者問的是 2024 年的合約，你不能回傳 2022 年語意相似的條款。日期、當事人、管轄法律、特定條款類型——任何一個維度出錯都是法律風險。

Weaviate 的 Victoria Slocum 在 2026 年 2 月發布了一篇文章，記錄他們如何在 36 小時內為內部財務團隊建出一套法律合約搜尋系統。這篇文章拆解它的完整架構，並解釋每個技術選擇背後的邏輯。

## 為什麼傳統 RAG 在法律場景失效

傳統 Naive RAG 的問題是它是靜態的。你寫一個 retriever，它做固定的事：語意搜尋，或關鍵字搜尋，或 hybrid。如果使用者的問題是「找出所有 2024 年後生效且管轄法律是加州的保密條款」，傳統 RAG 要嘛給你一堆「語意相關但時間不對」的結果，要嘛你要手工寫每一條 filter 邏輯。

問題的本質是：**法律查詢很少是一維的**。它需要同時滿足日期、管轄地、合約類型等多個條件的交集。

## 架構全覽

```
PDF 合約
   │
   ▼
ColQwen（視覺嵌入）
   │ 每頁 → 多向量
   ▼
Muvera 壓縮（32× 記憶體壓縮）
   │
   ▼
Weaviate（三個 Collection）
   │  CommercialContracts
   │  CorporateIPContracts
   │  OperationalContracts
   ▼
Query Agent（動態推理）
   ├─ Schema 檢查 → 決定搜尋策略
   ├─ Filter + Aggregation 建構
   ├─ Rerank Sub-agent
   └─ Answer Sub-agent
   │
   ▼
FastAPI（串流） + Next.js（含引用來源）
```

## ColQwen：不跑 OCR 的 PDF 嵌入

傳統的 PDF 處理流程是：OCR → 文字抽取 → 分塊 → 嵌入。這條路在表格密集、版面複雜的合約文件上問題很多——OCR 錯誤會直接污染向量。

ColQwen 的做法不同：把每一頁 PDF 當作**圖像**直接輸入，輸出視覺 token 的多向量表示。不需要 OCR，不需要文字抽取前處理，版面、表格、標題的結構資訊都保留在視覺 token 裡。

每個物件就是一個 PDF 頁面，Schema 長這樣：

```python
wvc.config.Configure.MultiVectors.multi2vec_weaviate(
    name="doc_vector",
    image_field="doc_page",        # base64 JPEG，vectorizer 讀這個
    model="ModernVBERT/colmodernvbert",
    encoding=wvc.config.Configure.VectorIndex.MultiVector.Encoding.muvera(
        ksim=4, dprojections=16, repetitions=20
    ),
)
```

Collection schema 的欄位：

| 欄位 | 類型 | 說明 |
|------|------|------|
| `doc_page` | BLOB | base64 JPEG，vectorizer 讀這個 |
| `page_text` | TEXT | pdfplumber 抽取的文字，Query Agent 讀 |
| `contract_type` | TEXT | 合約類型，skip vectorization |
| `title` / `document_id` | TEXT | 元資料，skip vectorization |
| `page_number` / `total_pages` | INT | 頁碼 |

## Muvera：多向量壓縮

ColQwen 產生的是多向量（每頁多個 token 向量），儲存和檢索成本高。Muvera 是 Google Research 在 NeurIPS 2024 提出的 Fixed Dimensional Encodings 演算法，把多向量壓縮成固定維度，搭配 product quantization 達到 **32× 記憶體壓縮**，同時維持高召回率。

## Collection 分三個的理由

把 510 份合約全塞進一個 collection 也能跑，但 Weaviate 把合約拆成三個 collection 有明確目的：

- **`CommercialContracts`**：授權、轉銷、行銷、贊助、特許等市場面合約
- **`CorporateIPContracts`**：策略聯盟、合資、智慧財產等
- **`OperationalContracts`**：維護、服務、外包、諮詢等

這個 schema 讓 Query Agent 可以做 **collection routing**——一個問題進來，agent 先判斷要搜哪個 collection（或哪幾個），縮小搜尋空間再做精確搜尋。這比把所有東西混在一起、靠語意相似度區分要可靠得多。

## Query Agent：推理層

Query Agent 是這個系統最關鍵的部分。它做的事不是 keyword match，是推理：

1. **Schema 檢查**：讀你的 collection 結構，決定最佳搜尋策略；必要時把一個複雜問題拆成多個 sub-query
2. **結構化查詢**：動態建 filter 和 aggregation，鎖定相關資料
3. **Rerank**：Rerank Sub-agent 依真實相關性重新排序（不是向量相似度）
4. **答案合成**：Answer Sub-agent 生成有引用來源段落的答案

這有點像 Text-to-SQL，但用在多 collection 的向量資料庫場景，輸出的不是 SQL 而是 Weaviate 查詢 API 呼叫。

Query Agent 有兩種模式：

- **Search Mode**：回傳最相關的合約段落，供人工審查
- **Ask Mode**：直接合成答案 + 引用來源，適合 chatbot 場景

## 資料集：CUAD

測試用的是 CUAD（Contract Understanding Atticus Dataset），510 份商業法律合約、13,000+ 人工標注、涵蓋 41 類重要條款（日期、當事人、管轄法律、競業禁止、保密條款等）。授權 CC BY 4.0，可商用。

Weaviate 的 prompt 指定從中取 15 份（每類 5 份）作為起點，這個規模夠驗證系統，又不會讓 embedding 時間太長。

CUAD 下載：`https://zenodo.org/records/4595826/files/CUAD_v1.zip`（106 MB）

## 實作陷阱

文章裡特別提到幾個容易踩到的問題：

**Async client**：Weaviate backend 用 `WeaviateAsyncClient`，不是同步版本。

**Dependency injection**：Import module，不要 import variable，否則 client 在 request 時會是 `None`：
```python
# 正確
from app import lifespan as _lifespan
def get_client(): return _lifespan.weaviate_client
```

**BLOB 欄位**：Sources endpoint 要明確指定 `return_properties`，BLOB 預設不回傳。

## 這是生產系統嗎？

「Production-ready in 36 hours」這句話需要 context。Weaviate 建的是**內部財務團隊的內部工具**，不是面向外部客戶的法律 SaaS。

真正部署面向客戶的法律 AI 系統，還有幾個 demo 沒碰到的問題：

**資料主權**：法律合約涉及律師-委託人特權（attorney-client privilege）。資料能不能送到外部 LLM 是合規問題，不是工程問題。

**幻覺的後果**：Query Agent 的引用來源機制大幅降低幻覺風險，但「降低」不等於「消除」。法律場景一個錯誤引用可能直接影響商業決策，需要 human-in-the-loop 驗證。

**模型版本一致性**：LLM 版本更新時，同一個問題的答案可能改變。法律分析需要版本控制。

## 整體來說

這個架構組合（ColQwen + Muvera + Weaviate Query Agent）解決的核心問題是：讓搜尋策略在執行期動態規劃，而不是靜態寫死。對任何需要精確、結構化文件搜尋的場景（法律、醫療、合規、技術文件），這個方向值得認真評估。

36 小時能跑起來，是因為 Agent Skills 把幾個月的工程成果壓進了一個 prompt 能用的操作手冊。這是重要的 context，不是批評——你要知道你在使用別人做完的功課，這樣才能準確評估哪些部分你真正理解，哪些部分你只是呼叫了而已。

---

## 參考資料

- [Building A Legal RAG App in 36 Hours - Weaviate Blog](https://weaviate.io/blog/legal-rag-app)
- [Weaviate Query Agent 正式 GA 公告](https://weaviate.io/blog/query-agent)
- [Weaviate Agent Skills 發布公告](https://weaviate.io/blog/agent-skills)
- [CUAD Dataset - HuggingFace](https://huggingface.co/datasets/theatticusproject/cuad)
- [CUAD 論文 (arXiv:2103.06268)](https://arxiv.org/abs/2103.06268)
- [Muvera: Fixed Dimensional Encodings - Google Research](https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-retrieval/)
- [ColQwen / PDF Retrieval with Late Interaction - Qdrant](https://qdrant.tech/documentation/tutorials/pdf-retrieval-at-scale/)
- [12 分鐘、$0.30、一個 Prompt：Weaviate 如何用 Agentic Search 重新定義法律合約搜尋 - Akira](https://akiraxclaw.com/blog/weaviate-legal-rag-query-agent/)
