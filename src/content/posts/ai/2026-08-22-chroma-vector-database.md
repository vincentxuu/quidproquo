---
title: "Chroma 向量資料庫完整指南：從本機 RAG 到分散式檢索"
date: 2026-08-22
category: ai
type: deep-dive
tags: [chroma, vector-database, rag, self-hosted, embedding]
lang: zh-TW
tldr: "Chroma 用 collection 統一管理 embedding、文件與 metadata；本機可嵌入 Python，單機版採 HNSW，分散式版則以物件儲存、SSD 快取與 SPANN 拆分運算和儲存。"
description: "深入拆解 Chroma 的資料模型、寫入與查詢路徑、HNSW／SPANN 索引、metadata filtering，以及從本機原型走向正式環境時的維運取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-chroma-vector-database-en)

[Chroma](https://github.com/chroma-core/chroma) 是為 AI 檢索打造的開放原始碼資料庫。它把向量、原始文件、metadata 與 embedding function 收在同一個 collection。RAG 應用不必先組一套資料庫框架，幾行 Python 就能寫入並做語意搜尋。

它的特色不只「容易在筆電上跑」。[官方架構](https://docs.trychroma.com/reference/architecture/overview)分成嵌入式本機、單機伺服器與分散式三種模式，對外維持相近的 API。底層會隨規模改變：單機版偏向簡單部署，分散式版把寫入紀錄、索引與系統目錄拆成獨立元件。

這篇依序拆解核心架構、寫入與查詢、索引與 metadata filtering、部署維運，最後說明 Chroma 適合與不適合的情境。如果你還沒選定產品，先讀[向量資料庫選型比較](/posts/ai/2026-03-12-vector-database-comparison)；本文假設你想知道 Chroma 選下去之後會遇到什麼。

## 核心架構：collection 是操作與隔離單位

Chroma 的資料模型由 tenant、database、collection 三層組成。collection 是實際建立索引與執行查詢的單位，每筆 record 有唯一 ID、embedding，可選擇保存文件與 metadata。database 提供應用或環境的命名空間，tenant 則是最上層的隔離邊界。

本機模式可以直接嵌入 Python 程序，單機模式把 Chroma 變成一個服務。分散式模式則拆成五個核心元件：Gateway、write-ahead log、Query Executor、Compactor 與 System Database。[分散式架構文件](https://docs.trychroma.com/reference/architecture/distributed)顯示，寫入先持久化到 log 才回覆。Compactor 再非同步產生向量、全文與 metadata 索引；查詢端同時讀索引與 log，以取得一致結果。

```text
client -> Gateway -> write-ahead log -> object storage
              |              |
              |              v
              |          Compactor -> index versions
              v
        Query Executor <-> SSD cache
              |
        System Database (catalog)
```

這個設計把運算與儲存分開：log 和索引落在雲端物件儲存，System Database 保存目錄資訊，查詢節點用本機 SSD 當快取。代價是分散式版不再是「一個 Python 套件」而已；若自行部署，就得維護多個服務與外部儲存。

## 寫入與查詢：先固定 ID 與 embedding 契約

最小可用範例可用 `PersistentClient` 把資料留在指定目錄。正式資料管線建議使用穩定 ID 搭配 `upsert`，重跑匯入時才不會產生重複紀錄：

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma-data")
collection = client.get_or_create_collection(name="product-docs")

collection.upsert(
    ids=["refund-001", "shipping-001"],
    documents=[
        "退款申請須在收到商品後七天內提出。",
        "現貨訂單通常在兩個工作天內出貨。",
    ],
    metadatas=[
        {"locale": "zh-TW", "topic": "refund", "year": 2026},
        {"locale": "zh-TW", "topic": "shipping", "year": 2026},
    ],
)

result = collection.query(
    query_texts=["我可以在多久內退貨？"],
    n_results=2,
    where={"locale": "zh-TW"},
    include=["documents", "metadatas", "distances"],
)
print(result["documents"][0])
```

依[新增資料文件](https://docs.trychroma.com/docs/collections/add-data)，`add` 遇到既有 ID 會忽略，`update` 只更新既有 record，`upsert` 才是有則更新、無則新增。只傳文件時，collection 的 embedding function 會負責產生向量；也可以自行傳入 `embeddings`。後者讓模型版本與批次推論完全由應用掌控，但查詢向量必須維持相同維度。

查詢也有兩條路：`query_texts` 由 Chroma 呼叫 collection 綁定的 embedding function，`query_embeddings` 則接受預先算好的向量。[Query API](https://docs.trychroma.com/docs/querying-collections/query-and-get)回傳的是 distance，不是跨模型通用的百分比信心值。排序與門檻應用自己的驗證集校準，不能把某個固定 distance 當成普遍正確答案。

## 索引與 metadata filtering：兩種部署，兩套核心索引

[collection 設定文件](https://docs.trychroma.com/docs/collections/configure)指出，單機 Chroma 使用 HNSW 做近似最近鄰搜尋。提高 `ef_search` 通常會改善 recall，但增加查詢時間；提高 `ef_construction` 會增加建索引的時間與記憶體用量。這些參數沒有一組適合所有 embedding 與資料分布，應以自己的檢索題庫測 recall、延遲和資源占用。

分散式 Chroma 與 Chroma Cloud 使用 SPANN。這不只是同一套索引換到更多機器，而是不同儲存子系統；[官方開源說明](https://docs.trychroma.com/docs/overview/oss)也明確提醒，本機與分散式功能或行為可能暫時不完全一致。因此，本機 PoC 驗證的是資料模型與應用流程，正式上線前仍要在目標部署模式重跑品質與負載測試。

metadata filtering 透過 `where` 加進 `get` 或 `query`。官方支援比較、`$and`、`$or`、`$in`、`$nin`，陣列欄位也能用 `$contains`；`where_document` 則用於文件內容條件。實務上，把租戶、語言、權限、文件類型與時間放進 metadata，先限縮候選集合再做向量排序，通常比把所有限制塞進查詢文字更可控。

```python
result = collection.query(
    query_texts=["退貨期限"],
    n_results=5,
    where={
        "$and": [
            {"locale": "zh-TW"},
            {"year": {"$gte": 2025}},
            {"topic": {"$in": ["refund", "warranty"]}},
        ]
    },
)
```

## 部署與維運：不要把持久化目錄當成完整正式環境

開發機用 `PersistentClient` 很方便；需要讓多個應用共用時，改用 client-server 模式，並把資料目錄掛載到持久化儲存。[Docker 文件](https://docs.trychroma.com/deployment/docker)也提供 OpenTelemetry 串接方式，可追蹤請求路徑與瓶頸。至少要監看查詢延遲、錯誤率、寫入積壓、磁碟與記憶體，並實際演練備份還原。

容量判斷不要只看 record 數。向量維度、文件大小、metadata 數量、索引參數與同時查詢量都會改變需求。官方把單機模式定位在少量 collection、通常低於一千萬筆 record 的工作負載；這是產品定位，不是你的容量保證。接近邊界前，應用真實資料做壓力測試，再決定放大單機、採 Chroma Cloud，或自行維護分散式 Chroma。

另一個維運契約是 embedding 版本。collection 內的向量必須維度一致，但「維度相同」不代表不同模型的向量可以混用。升級模型時，建立新 collection、完整重建索引、以同一組查詢做離線比較，再切換流量；不要直接把新舊 embedding 混在原 collection。

## 適用與不適用

Chroma 適合想快速完成 RAG 原型、偏好 Python-first API、需要把文件與 metadata 跟向量一起管理，或希望從嵌入式開發平順走向服務模式的團隊。它也適合願意使用 Chroma Cloud 承接分散式維運，而不是自己組裝所有底層元件的產品。

不適合的情境也很清楚。既有資料主要留在 PostgreSQL、團隊不想維護第二套資料系統時，pgvector 往往更自然。需要複雜關聯查詢與交易邏輯時，Chroma 也不該取代主資料庫。若強制自架分散式環境，卻沒有物件儲存、SQL catalog、監控與容量規劃能力，簡單的 API 不會消除後端的維運成本。

整體來說，Chroma 最強的取捨是把「第一次語意搜尋」做得非常短，同時保留走向分散式架構的路。真正的選型題不是它能不能存向量，而是你的團隊要把 embedding、索引生命週期與分散式維運責任放在哪一層。

## 參考資料

- [Chroma GitHub repository](https://github.com/chroma-core/chroma)
- [Chroma Architecture Overview](https://docs.trychroma.com/reference/architecture/overview)
- [Chroma Distributed Architecture](https://docs.trychroma.com/reference/architecture/distributed)
- [Chroma: Adding Data](https://docs.trychroma.com/docs/collections/add-data)
- [Chroma: Query and Get](https://docs.trychroma.com/docs/querying-collections/query-and-get)
- [Chroma: Metadata Filtering](https://docs.trychroma.com/docs/querying-collections/metadata-filtering)
- [Chroma: Configure Collections](https://docs.trychroma.com/docs/collections/configure)
- [Chroma: Docker Deployment](https://docs.trychroma.com/deployment/docker)
- [向量資料庫選型比較](/posts/ai/2026-03-12-vector-database-comparison)
