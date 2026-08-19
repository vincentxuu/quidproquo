---
title: "36 小時建出法律合約 RAG：Weaviate Query Agent + ColQwen 架構拆解"
date: 2026-04-23
updated: 2026-08-19
type: guide
category: ai
tags: [rag, weaviate, legal-ai, colqwen, muvera, vector-database, agentic-search]
lang: zh-TW
tldr: "用 Weaviate Query Agent + ColQwen 多向量模型，一個 prompt 在 36 小時內搭出生產等級的法律合約搜尋系統——這篇拆解它的架構邏輯、技術選擇，以及你真正需要注意的事。"
description: "拆解 Weaviate 法律合約 RAG 系統的完整架構：ColQwen 視覺嵌入、Muvera 多向量壓縮、Query Agent 動態推理搜尋，以及 CUAD dataset 的資料結構。"
draft: false
series:
  name: "RAG 技法大全"
  order: 45
---

法律文件搜尋是 RAG 最難的場景之一。不是因為資料量，而是因為精確度要求：使用者問的是 2024 年的合約，你不能回傳 2022 年語意相似的條款。日期、當事人、管轄法律、特定條款類型——任何一個維度出錯都是法律風險。

Weaviate 的 Femke Plantinga 與 Victoria Slocum 在 2026 年 2 月 26 日發布了一篇文章，記錄他們如何在 36 小時內為內部財務團隊建出一套法律合約搜尋系統。這篇文章拆解它的完整架構，並解釋每個技術選擇背後的邏輯。

> **關於標題裡的「ColQwen」**：這個 demo 實際用的視覺檢索模型不是 ColQwen，而是 `ModernVBERT/colmodernvbert`。兩者同屬 ColPali 開創的「late interaction 視覺文件檢索」家族，做的事一樣，但模型不同。細節見下面的〈視覺嵌入〉一節。

## 為什麼傳統 RAG 在法律場景失效

傳統 Naive RAG 的問題是它是靜態的。你寫一個 retriever，它做固定的事：語意搜尋，或關鍵字搜尋，或 hybrid。如果使用者的問題是「找出所有 2024 年後生效且管轄法律是加州的保密條款」，傳統 RAG 要嘛給你一堆「語意相關但時間不對」的結果，要嘛你要手工寫每一條 filter 邏輯。

問題的本質是：**法律查詢很少是一維的**。它需要同時滿足日期、管轄地、合約類型等多個條件的交集。

## 架構全覽

```
PDF 合約
   │
   ▼
Late-interaction 視覺嵌入模型
   │ 每頁 → 多向量
   ▼
MUVERA 編碼（多向量壓成固定維度）
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

## 視覺嵌入：不跑 OCR 的 PDF 索引

傳統的 PDF 處理流程是：OCR → 文字抽取 → 分塊 → 嵌入。這條路在表格密集、版面複雜的合約文件上問題很多——OCR 錯誤會直接污染向量。

late-interaction 視覺檢索模型的做法不同：把每一頁 PDF 當作**圖像**直接輸入，輸出視覺 token 的多向量表示。不需要 OCR，不需要文字抽取前處理，版面、表格、標題的結構資訊都保留在視覺 token 裡。

這條路線由 [ColPali（arXiv:2407.01449）](https://arxiv.org/abs/2407.01449)開創，後續衍生出 ColQwen2 等一整個家族。要注意各 checkpoint 授權不同：`vidore/colpali*` 的骨幹是 PaliGemma，走 Gemma 授權；`vidore/colqwen2*` 的骨幹是 Qwen2-VL，是 Apache-2.0（早期 v0.1 的 adapter 標 MIT）。要自架的話，授權條款要自己讀過。

**但這個 demo 沒有用 ColQwen。** Weaviate 的 prompt 指定的是 `ModernVBERT/colmodernvbert`——[ModernVBERT（arXiv:2510.01149）](https://arxiv.org/abs/2510.01149)家族裡的 late-interaction 版本，250M 參數，[模型權重與訓練程式碼採 MIT 授權](https://huggingface.co/ModernVBERT/colmodernvbert)。原因很直接：這是 Weaviate Embeddings 多模態 vectorizer 目前唯一提供的模型（見[官方文件](https://docs.weaviate.io/weaviate/model-providers/weaviate/embeddings-multimodal)），而託管 vectorizer 省掉了自己跑 GPU 推論的整條路。這個 vectorizer 從 Weaviate `v1.35.0` 起提供，且**僅限 Weaviate Cloud**，self-host 沒有。

每個物件就是一個 PDF 頁面，collection 這樣建：

```python
import weaviate
from weaviate.classes.config import Configure, Property, DataType

client.collections.create(
    "CommercialContracts",
    properties=[
        Property(name="doc_page", data_type=DataType.BLOB),
        Property(name="page_text", data_type=DataType.TEXT),
        Property(name="contract_type", data_type=DataType.TEXT, skip_vectorization=True),
        Property(name="title", data_type=DataType.TEXT, skip_vectorization=True),
        Property(name="document_id", data_type=DataType.TEXT, skip_vectorization=True),
        Property(name="page_number", data_type=DataType.INT),
        Property(name="total_pages", data_type=DataType.INT),
    ],
    vector_config=[
        Configure.MultiVectors.multi2vec_weaviate(
            name="doc_vector",
            image_field="doc_page",   # 單數；寫 image_fields 會 TypeError
            model="ModernVBERT/colmodernvbert",
            encoding=Configure.VectorIndex.MultiVector.Encoding.muvera(
                ksim=4, dprojections=16, repetitions=20
            ),
        )
    ],
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

## MUVERA：多向量編碼

late-interaction 模型產生的是多向量（每頁多個 token 向量），儲存和檢索成本高。MUVERA 是 Google Research 在 NeurIPS 2024 提出的 Fixed Dimensional Encodings 演算法（[arXiv:2405.19504](https://arxiv.org/abs/2405.19504)），把一組多向量壓成單一固定維度向量，讓多向量相似度退化成單向量的 MIPS 問題，再用原本的 Chamfer 相似度做 rerank。

常被引用的「32× 記憶體壓縮」出自 MUVERA 論文本身：在 BEIR 資料集上，對 FDE 再做 product quantization 可把記憶體足跡降到約 1/32，而檢索品質影響很小。這是論文的實驗結果，不是這個法律 demo 量出來的數字——實際壓縮比與召回損失要在自己的語料上測。

## Collection 分三個的理由

CUAD 全套有 510 份合約（這個 demo 只取其中 15 份），全塞進一個 collection 也能跑，但 Weaviate 把合約拆成三個 collection 有明確目的：

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

- **Search Mode**：回傳最相關的原始物件，供人工審查或接進自己的 pipeline
- **Ask Mode**：直接合成答案 + 引用來源，適合 chatbot 場景

它在 2025 年 9 月[正式 GA](https://weaviate.io/blog/query-agent-generally-available)，走的是獨立的 `weaviate-agents` 套件，跟主 client 一起裝：

```bash
pip install -U "weaviate-client[agents]"
```

```python
from weaviate.agents.query import QueryAgent

qa = QueryAgent(
    client=client,  # Weaviate Cloud client
    collections=["CommercialContracts", "CorporateIPContracts", "OperationalContracts"],
)

res = qa.ask("列出所有 2024 年後生效、管轄法律為加州的保密條款")
res.display()
```

非同步版本是 `AsyncQueryAgent`，這個 demo 的 FastAPI backend 用的就是它。兩點務必先確認：**Query Agent 只在 Weaviate Cloud 上跑**，self-host 的 Weaviate 沒有；免費額度與計價會變，看[官方定價頁](https://weaviate.io/pricing)與 [Query Agent 文件](https://docs.weaviate.io/query-agent)，不要照抄任何文章裡寫死的數字。

## 資料集：CUAD

測試用的是 CUAD（Contract Understanding Atticus Dataset），510 份商業法律合約、13,000+ 人工標注、涵蓋 41 類重要條款（日期、當事人、管轄法律、競業禁止、保密條款等）。授權 CC BY 4.0，可商用。

Weaviate 的 prompt 指定從中隨機取 15 份（每類 5 份）作為起點，這個規模夠驗證系統，又不會讓 embedding 時間太長。

CUAD 下載：`https://zenodo.org/records/4595826/files/CUAD_v1.zip`（約 106 MB）。zip 內的 `full_contract_pdf/` 是純文字型 PDF，不需要 OCR。

## 實作陷阱

文章裡特別提到幾個容易踩到的問題：

**Async client**：Weaviate backend 用 `weaviate.WeaviateAsyncClient`，不是同步版本；對應的 agent 也要用 `AsyncQueryAgent`。

**Dependency injection**：Import module，不要 import variable，否則 client 在 request 時會是 `None`：
```python
# 正確
from app import lifespan as _lifespan
def get_client(): return _lifespan.weaviate_client
```

**BLOB 欄位**：Sources endpoint 要明確指定 `return_properties`，BLOB 預設不回傳。

**`image_field` 是單數**：寫成 `image_fields` 會直接 `TypeError`。

## 這是生產系統嗎？

「Production-ready in 36 hours」這句話需要 context。Weaviate 建的是**內部財務團隊的內部工具**，不是面向外部客戶的法律 SaaS。

真正部署面向客戶的法律 AI 系統，還有幾個 demo 沒碰到的問題：

**資料主權**：法律合約涉及律師-委託人特權（attorney-client privilege）。資料能不能送到外部 LLM 是合規問題，不是工程問題。而 Query Agent 與這個多模態 vectorizer 都是 Weaviate Cloud 上的託管服務——資料一定會離開你的機器，這在合規審查裡是第一個會被問的問題。

**幻覺的後果**：Query Agent 的引用來源機制大幅降低幻覺風險，但「降低」不等於「消除」。法律場景一個錯誤引用可能直接影響商業決策，需要 human-in-the-loop 驗證。

**模型版本一致性**：託管 LLM 與託管 embedding 模型都會被供應商更新，同一個問題的答案可能改變。法律分析需要版本控制。

## 整體來說

這個架構組合（late-interaction 視覺嵌入 + MUVERA + Weaviate Query Agent）解決的核心問題是：讓搜尋策略在執行期動態規劃，而不是靜態寫死。對任何需要精確、結構化文件搜尋的場景（法律、醫療、合規、技術文件），這個方向值得認真評估。

36 小時能跑起來，是因為 Agent Skills 把幾個月的工程成果壓進了一個 prompt 能用的操作手冊。這是重要的 context，不是批評——你要知道你在使用別人做完的功課，這樣才能準確評估哪些部分你真正理解，哪些部分你只是呼叫了而已。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Building A Legal RAG App in 36 Hours - Weaviate Blog](https://weaviate.io/blog/legal-rag-app)
- [Query Agent 正式 GA 公告（2025-09）](https://weaviate.io/blog/query-agent-generally-available)
- [Query Agent 官方文件](https://docs.weaviate.io/query-agent)
- [Introducing Weaviate Agent Skills](https://weaviate.io/blog/weaviate-agent-skills)
- [weaviate/agent-skills（GitHub）](https://github.com/weaviate/agent-skills)
- [Weaviate Embeddings 多模態 vectorizer 文件](https://docs.weaviate.io/weaviate/model-providers/weaviate/embeddings-multimodal)
- [ModernVBERT/colmodernvbert（HuggingFace，MIT）](https://huggingface.co/ModernVBERT/colmodernvbert)
- [ModernVBERT: Towards Smaller Visual Document Retrievers (arXiv:2510.01149)](https://arxiv.org/abs/2510.01149)
- [ColPali: Efficient Document Retrieval with Vision Language Models (arXiv:2407.01449)](https://arxiv.org/abs/2407.01449)
- [CUAD Dataset - HuggingFace](https://huggingface.co/datasets/theatticusproject/cuad)
- [CUAD 論文 (arXiv:2103.06268)](https://arxiv.org/abs/2103.06268)
- [MUVERA: Making multi-vector retrieval as fast as single-vector search - Google Research](https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/)
- [MUVERA: Multi-Vector Retrieval via Fixed Dimensional Encodings (arXiv:2405.19504)](https://arxiv.org/abs/2405.19504)
- [ColQwen / PDF Retrieval with Late Interaction - Qdrant](https://qdrant.tech/documentation/tutorials/pdf-retrieval-at-scale/)
- [12 分鐘、$0.30、一個 Prompt：Weaviate 如何用 Agentic Search 重新定義法律合約搜尋 - Akira](https://akiraxclaw.com/blog/weaviate-legal-rag-query-agent/)
