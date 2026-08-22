---
title: "Milvus 向量資料庫深入介紹：從 Segment、索引到分散式維運"
date: 2026-08-22
category: ai
type: deep-dive
tags: [milvus, vector-database, rag, self-hosted, similarity-search]
lang: zh-TW
tldr: "Milvus 把即時寫入、歷史查詢、索引建置與持久化拆成可獨立擴縮的元件，適合需要大量向量、持續更新與分散式維運的檢索服務；小型專案則常會為這套架構付出過多複雜度。"
description: "從 Milvus 的 Segment 與儲存運算分離架構出發，說明 PyMilvus 寫入與查詢、向量索引、metadata filtering、備份監控，以及適用與不適用情境。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-milvus-vector-database-en)

[Milvus](https://milvus.io/docs/architecture_overview.md) 是為向量相似度搜尋設計的開放原始碼資料庫。它把文字、圖片或其他內容的 embedding，連同主鍵與結構化 metadata 存成 collection，提供近似最近鄰搜尋、條件過濾與混合搜尋。它不是 embedding model，也不會替應用決定文件怎麼切段或使用者能看哪些資料。

Milvus 最鮮明的設計不是某一種 ANN 演算法，而是把儲存、運算與控制平面拆開。小規模可以用 Standalone 跑在單機；資料量與流量上升後，Cluster 能分別擴充寫入、查詢與離線索引工作。若你還在比較不同產品，先讀站內的[向量資料庫選型比較](/posts/ai/2026-03-12-vector-database-comparison)。

這篇沿著一筆資料的生命週期往下走：核心架構、寫入與查詢、索引與 metadata filtering、部署維運，最後才判斷什麼時候值得選 Milvus。

## 核心架構：Collection 最後會落成 Segment

應用看到的是 collection、schema 與 entity；Milvus 內部真正安排資料與索引的單位則是 segment。新資料先進入 growing segment，持久化後轉為不可變的 sealed segment。每個 sealed segment 可以建立自己的索引，再分派給 Query Node 服務搜尋。這讓寫入不必每來一筆就重建整個 collection 的索引。

[官方架構文件](https://milvus.io/docs/architecture_overview.md)把系統分成四層：

- Proxy 接收請求，並合併分散在不同節點的結果。
- Coordinator 維護拓樸、排程與一致性，是控制平面。
- Streaming Node 處理 WAL、growing data 與即時查詢；Query Node 搜尋 sealed data；Data Node 執行 compaction 與索引建置。
- etcd 保存 metadata，物件儲存保存 binlog 與索引檔，WAL 保存尚未整理成 sealed segment 的變更。

```text
Application / PyMilvus
          |
        Proxy
          |
      Coordinator
       /    |    \
Streaming  Query  Data Node
   Node    Node   (index / compact)
       \     |     /
       WAL + etcd + object storage
```

這個拆法適合負載不對稱的系統：讀取變多時增加 Query Node，索引工作塞車時擴充 Data Node，不必把整台資料庫一起放大。代價也很直接：單機資料庫原本藏在一個 process 裡的責任，現在成了需要觀測、備份與升級的多個元件。

## 寫入與查詢：先把可重建性寫進 schema

RAG collection 至少應保留穩定主鍵、文件與 chunk 識別、租戶邊界、原文，以及向量。不要把所有 metadata 都塞進不受約束的動態欄位；高頻過濾條件用明確型別，日後才容易加 scalar index、檢查錯值與批次刪除。

下面用目前文件建議的 `MilvusClient` API 建立 collection。四維向量只是方便閱讀，正式環境必須換成 embedding model 的輸出維度，距離函數也要依模型建議選擇。

```python
from pymilvus import DataType, MilvusClient

client = MilvusClient(uri="http://localhost:19530", token="root:Milvus")

schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
schema.add_field("chunk_id", DataType.VARCHAR, is_primary=True, max_length=128)
schema.add_field("tenant_id", DataType.VARCHAR, max_length=64)
schema.add_field("document_id", DataType.VARCHAR, max_length=128)
schema.add_field("text", DataType.VARCHAR, max_length=4096)
schema.add_field("embedding", DataType.FLOAT_VECTOR, dim=4)

indexes = client.prepare_index_params()
indexes.add_index(
    field_name="embedding",
    index_type="HNSW",
    metric_type="COSINE",
    params={"M": 16, "efConstruction": 200},
)
indexes.add_index(field_name="tenant_id", index_type="INVERTED")
indexes.add_index(field_name="document_id", index_type="INVERTED")

client.create_collection(
    collection_name="knowledge_chunks",
    schema=schema,
    index_params=indexes,
)
```

主鍵最好由 `tenant_id + document_id + chunk position` 穩定推導。重新執行 ingestion 時用 upsert 覆蓋同一筆，來源文件刪除時也能靠 `tenant_id` 與 `document_id` 找回整批 chunk，而不是留下無主向量。

```python
rows = [{
    "chunk_id": "tenant-a:handbook-2026:0042",
    "tenant_id": "tenant-a",
    "document_id": "handbook-2026",
    "text": "退款申請必須在購買後十四天內提出。",
    "embedding": [0.12, 0.08, 0.44, 0.31],
}]

client.upsert(collection_name="knowledge_chunks", data=rows)

hits = client.search(
    collection_name="knowledge_chunks",
    data=[[0.18, 0.05, 0.49, 0.28]],
    anns_field="embedding",
    filter='tenant_id == "tenant-a"',
    limit=5,
    output_fields=["document_id", "text"],
    consistency_level="Session",
    search_params={"metric_type": "COSINE", "params": {"ef": 64}},
)
```

寫入完成不代表每個 reader 都立刻看到相同資料。Milvus [提供 Strong、Bounded、Session 與 Eventually 四種一致性層級](https://milvus.io/docs/consistency.md)，預設是 Bounded。需要同一個 client 寫後立刻讀，可選 Session；測試或嚴格讀新值的流程可選 Strong，但要接受等待最新時間戳的延遲。不要用 `flush()` 當作每筆寫入的同步按鈕，它的工作是把 growing segment 推進 sealed 狀態，不是取代一致性設定。

## 索引與 metadata filtering：先量 recall，再調速度

Milvus 的向量索引選擇很多，但起點可以很樸素：小資料或需要精確基準時用 FLAT；資料能放進記憶體、追求低延遲時從 HNSW 開始；需要壓低記憶體或資料更大時，再評估 IVF、量化或磁碟型索引。[官方索引說明](https://milvus.io/docs/index-explained.md)也強調，索引會增加建置時間、空間與查詢記憶體，近似搜尋則以 recall 換速度。

索引參數不能只抄範例。HNSW 的 `M`、`efConstruction` 與查詢時的 `ef`，或 IVF 的 `nlist` 與 `nprobe`，都要拿自己的 query、filter 分布與 top-k 量測 recall、p95 latency、記憶體與建置時間。embedding model 或距離函數改變時，應建立新 collection、重新嵌入與評測，再用 alias 切換，不能把兩代向量混進同一欄位。

Metadata filtering 不是搜尋後在應用端丟掉不合格結果。Milvus 會把 filter 解析成執行計畫，在每個 segment 產生 bitset，讓向量搜尋只處理符合條件的候選；因此 `tenant_id`、`language`、`updated_at` 等常用欄位應建立 [scalar index](https://milvus.io/docs/scalar_index.md)。權限條件必須由可信任的後端注入每次搜尋，不能讓 browser 自己傳 tenant，也不能把未授權資料先取回再過濾。

## 部署與維運：Standalone 是入口，不是縮小版 Cluster

本機試驗可用 Milvus Lite，整合環境可用 Docker Compose Standalone。Production Cluster 通常透過 Kubernetes 部署，把 Proxy、Streaming Node、Query Node 與 Data Node 分開擴縮。官方特別提醒：[Standalone 目前不能線上升級成 Cluster](https://milvus.io/docs/main_components.md)；若已知很快需要高可用或水平擴充，應提早規劃搬遷與重建，而不是假設能直接切換模式。

上線前至少要把這些責任寫進 runbook：

- 監控搜尋與寫入延遲、錯誤率、growing/sealed segment、compaction、索引建置、Query Node 記憶體，以及 etcd、WAL、物件儲存健康狀態。
- 用 private network、TLS 與認證限制入口；不要把預設連線資訊交給前端。
- 備份原始文件、embedding/chunking 版本與 ingestion checkpoint，並使用 [Milvus Backup](https://milvus.io/docs/milvus_backup_overview.md)備份 collection metadata 與 segment。
- 定期還原到另一個 collection，實際搜尋並核對筆數。備份檔存在，不等於復原路徑可用。
- 升級前閱讀版本相容矩陣。Milvus Backup 的可還原版本有方向性限制，WAL backend 的切換也不能當成一般滾動升級。

儲存運算分離不會消除容量規劃。物件儲存承擔持久化，但 Query Node 仍要載入或快取查詢所需的欄位與索引；大量 metadata、HNSW 圖與高 replica 數都會吃記憶體。壓力測試要模擬真實 filter 比例與冷啟動，不能只用已熱身、無條件的單一 query 報表。

## 適用與不適用

Milvus 適合這些情境：向量規模持續增長、寫入與查詢同時發生、讀寫負載需要分開擴縮、團隊已有 Kubernetes 與分散式儲存維運能力，或確實需要多種向量索引、scalar filtering 與混合檢索集中在同一服務。

它不適合只存幾萬個 chunk 的個人專案、沒有 SRE 能力的小團隊，或主要需求仍是關聯交易與 SQL join 的系統。前兩者通常先用 Chroma、LanceDB 或受管服務更省力；已經以 PostgreSQL 為核心、向量只是附加查詢時，pgvector 往往能少維護一套資料同步與權限模型。

真正的判斷不是「Milvus 能不能做」，而是負載是否大到值得把檢索拆成獨立的分散式資料系統。若答案是肯定的，它的 segment、獨立 worker 與共享儲存架構提供了清楚的擴充路徑；若答案還不確定，先用同一批 query 做 recall 與延遲基準，再決定是否承擔這套維運成本。

## 參考資料

- [Milvus Architecture Overview](https://milvus.io/docs/architecture_overview.md)
- [Milvus Data Processing](https://milvus.io/docs/data_processing.md)
- [Milvus Schema Design](https://milvus.io/docs/schema_design.md)
- [Milvus Index Explained](https://milvus.io/docs/index-explained.md)
- [Milvus Scalar Index](https://milvus.io/docs/scalar_index.md)
- [Milvus Consistency](https://milvus.io/docs/consistency.md)
- [Milvus Main Components and Deployment Modes](https://milvus.io/docs/main_components.md)
- [Milvus Backup](https://milvus.io/docs/milvus_backup_overview.md)
- [Milvus GitHub Repository](https://github.com/milvus-io/milvus)
- [向量資料庫選型比較](/posts/ai/2026-03-12-vector-database-comparison)
