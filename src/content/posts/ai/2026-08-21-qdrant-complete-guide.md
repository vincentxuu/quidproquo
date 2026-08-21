---
title: "Qdrant 完整指南：Collection、Hybrid Search 與自架維運"
date: 2026-08-21
category: ai
type: deep-dive
tags: [qdrant, vector-database, rag, self-hosted, hybrid-search]
lang: zh-TW
tldr: "Qdrant 的核心不是把 embedding 存進去，而是先固定 vector schema、替高頻過濾欄位建 payload index，再用 dense + sparse query、租戶邊界、snapshot 與監控把檢索做成可維運的服務。"
description: "從安裝、Collection 與 payload schema，到 dense+sparse hybrid query、多租戶隔離、snapshot 備份與常見維運故障，完整說明 Qdrant 的實作取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-qdrant-complete-guide-en)

如果還沒決定該用 Qdrant、Pinecone、Weaviate 還是 pgvector，先看[向量資料庫選型比較](/posts/ai/2026-03-12-vector-database-comparison)。這篇假設你已經選 Qdrant，要把它從「能存 embedding」推進到可上線的檢索服務。

Qdrant 是向量搜尋引擎，不是 embedding model、文件解析器，也不是權限系統。它擅長把向量相似度與結構化過濾放在同一次查詢裡；資料如何切 chunk、誰能查哪個 tenant、原始文件能不能重建，仍是應用層責任。

## 先建立正確的資料模型

Qdrant 的三個基本單位是：

- **Collection**：一組 point，以及固定的 named vector 設定。
- **Point**：一個 ID、零到多個向量與一份 JSON payload。
- **Payload index**：替會出現在 filter 的欄位建立型別索引，也讓 query planner 更準確估計候選數量。

同一個 named dense vector 在 collection 內必須有固定維度與距離函數。若 embedding model 輸出 768 維，就不能把 1536 維向量塞進同一個 vector name。Named vector 則讓一個 point 同時帶 `dense`、`sparse`，甚至圖片或 ColBERT multivector，而各自有獨立設定。

Payload 是任意 JSON，不代表 Qdrant 會替應用驗證 schema。實務上應在寫入端固定至少這些欄位：

```json
{
  "tenant_id": "tenant-a",
  "document_id": "handbook-2026",
  "chunk_id": "handbook-2026#0042",
  "source_uri": "s3://knowledge/handbook.pdf",
  "language": "zh-TW",
  "updated_at": "2026-08-21T09:00:00Z",
  "acl": ["staff", "engineering"]
}
```

`document_id` 用來整批重建或刪除，`chunk_id` 用來追查答案來源，`tenant_id` 與 `acl` 則是每次 query 都必須注入的條件。只把這些資訊留在原始文件、卻不放進 point payload，日後就很難做可靠過濾與清理。

## 安裝：Docker 適合起步，不等於 production 已完成

官方建議開發與測試先用 Docker：

```bash
docker pull qdrant/qdrant

docker run --name qdrant \
  -p 127.0.0.1:6333:6333 \
  -v "$(pwd)/qdrant-data:/qdrant/storage" \
  qdrant/qdrant
```

瀏覽 `http://localhost:6333` 能看到 welcome message，但這只證明 process 有啟動。Qdrant 官方明確說明，自架開源版預設沒有驗證，而且會監聽可被連到的介面。對外部署前至少要加 API key、綁 private network、啟用 TLS，並依用途拆 admin、read-only 或 collection-scoped key。

儲存也有硬邊界。Qdrant 的 primary storage 需要 block-level、POSIX-compatible filesystem；NFS 或 S3 不能直接當主要資料目錄。若向量或索引會落盤，優先使用 SSD/NVMe。Production 還要自行補多節點、load balancer、backup、monitoring 與 disaster recovery；沒有維運人力時，Qdrant Cloud 往往比「一個 Docker container 永遠跑著」更誠實。

## 建 Collection：維度和距離不是事後調參

下面建立一個同時容納 dense 與 sparse vector 的 collection。範例用 4 維只是為了可閱讀；正式環境必須改成 embedding model 的真實輸出維度。

```bash
curl -X PUT 'http://localhost:6333/collections/documents' \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "dense": {"size": 4, "distance": "Cosine"}
    },
    "sparse_vectors": {
      "sparse": {"modifier": "idf"}
    }
  }'
```

距離函數要跟模型訓練與文件建議一致，不要因為名字熟悉就選 Cosine。Qdrant 支援 Cosine、Dot、Euclid 與 Manhattan；Cosine 向量在上傳時會正規化。若日後新增 named vector，舊 point 不會自動產生該向量，查詢新 vector name 時可能得到空結果，直到資料重新 upsert。

## Payload index 要在大量匯入前建

最常見的效能誤判是「有 payload 就能快速 filter」。Payload index 必須另外建立，而且官方建議在 ingest 前做，避免先寫大量資料再付重建成本。

```bash
curl -X PUT 'http://localhost:6333/collections/documents/index?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{
    "field_name": "tenant_id",
    "field_schema": {"type": "keyword", "is_tenant": true}
  }'

curl -X PUT 'http://localhost:6333/collections/documents/index?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "document_id", "field_schema": "keyword"}'

curl -X PUT 'http://localhost:6333/collections/documents/index?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{"field_name": "updated_at", "field_schema": "datetime"}'
```

只替實際用來 filter 的欄位建 index。Index 會吃記憶體與磁碟；把每個 metadata 欄位全建一遍，只會把「未來可能需要」變成現在確定要付的成本。型別也要一致：用 keyword 條件查一個被寫成 integer 的值，不會自動幫你轉型，表面症狀通常只是零結果。

## Upsert、更新與刪除要可重跑

Point ID 應穩定且可由來源推導，例如對 `tenant_id + document_id + chunk_id` 做 UUID v5。如此重跑 ingestion 才會覆寫同一筆，而不是製造重複 chunk。

```bash
curl -X PUT 'http://localhost:6333/collections/documents/points?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{
    "points": [{
      "id": "7d0b14f9-25ba-56c7-b473-d450a67f33b2",
      "vector": {
        "dense": [0.12, 0.08, 0.44, 0.31],
        "sparse": {"indices": [12, 81, 405], "values": [0.7, 1.1, 0.5]}
      },
      "payload": {
        "tenant_id": "tenant-a",
        "document_id": "handbook-2026",
        "chunk_id": "handbook-2026#0042",
        "language": "zh-TW",
        "updated_at": "2026-08-21T09:00:00Z"
      }
    }]
  }'
```

Point 修改先寫 WAL，再由服務套用；API 預設可能在更新完成前回應。匯入工具需要明確確認時可用 `wait=true`，但不要把逐筆同步等待當成高吞吐設計。用 batch upsert，記錄成功 checkpoint，失敗時從穩定 ID 重送。

刪除整份文件時，不要只刪目前記得的 point ID；用 `document_id` 加 `tenant_id` 過濾，避免同名文件跨租戶誤刪：

```bash
curl -X POST 'http://localhost:6333/collections/documents/points/delete?wait=true' \
  -H 'Content-Type: application/json' \
  -d '{
    "filter": {"must": [
      {"key": "tenant_id", "match": {"value": "tenant-a"}},
      {"key": "document_id", "match": {"value": "handbook-2026"}}
    ]}
  }'
```

## Filter 必須進檢索，不是查完再丟資料

Qdrant filter 用 `must`、`should`、`must_not` 組合條件。權限與租戶條件應由可信任的 server 端根據 session 注入同一次 query，不能讓 client 自己決定，也不要先抓 top 100 再在應用層過濾；後者既可能漏掉真正相關結果，也可能讓未授權 payload 先離開資料庫。

單純 dense query 的形狀如下：

```http
POST /collections/documents/points/query
{
  "query": [0.18, 0.05, 0.49, 0.28],
  "using": "dense",
  "filter": {
    "must": [
      {"key": "tenant_id", "match": {"value": "tenant-a"}},
      {"key": "acl", "match": {"any": ["staff"]}}
    ]
  },
  "limit": 10,
  "with_payload": true
}
```

## Dense + sparse：用 Query API 融合兩份候選

Dense vector 找語意相近內容；sparse vector 對料號、錯誤碼、產品名與罕見詞更敏感。Qdrant 的 hybrid query 先用 `prefetch` 各取一批候選，再用 RRF 或 DBSF 融合。

```http
POST /collections/documents/points/query
{
  "prefetch": [
    {
      "query": {"indices": [12, 81], "values": [0.8, 1.2]},
      "using": "sparse",
      "filter": {"must": [{"key": "tenant_id", "match": {"value": "tenant-a"}}]},
      "limit": 50
    },
    {
      "query": [0.18, 0.05, 0.49, 0.28],
      "using": "dense",
      "filter": {"must": [{"key": "tenant_id", "match": {"value": "tenant-a"}}]},
      "limit": 50
    }
  ],
  "query": {"fusion": "rrf"},
  "limit": 10,
  "with_payload": true
}
```

RRF 根據排名融合，不要求 dense 與 sparse 分數同尺度，沒有評測集時是安全起點。DBSF 會正規化各結果集的分數後再融合，適合你信任原始 score 分布的情境。不要直接用固定 alpha 相加兩種原始 score，除非已用自己的 query 集合驗證。`prefetch.limit` 也要大於最終 `limit`，否則融合器根本沒有足夠候選可重排。

## 多租戶：資料分區不等於授權

大量小 tenant 通常放在共享 collection，用 indexed `tenant_id` payload 分區；大 tenant 可移到 user-defined shard，tiered multitenancy 則讓大小 tenant 共存於同一 collection 的不同 shard。每 tenant 一個 collection 看似乾淨，但 collection 本身有資源開銷，tenant 數量大時通常不划算。

真正的隔離要分兩層：

1. **資料與搜尋邊界**：`is_tenant: true` 的 payload index、每次 query 的 tenant filter，必要時 dedicated shard 或 collection。
2. **存取控制**：private network、TLS、API key 與 collection-scoped permission；由後端注入 filter，不把管理 key 給 browser 或終端使用者。

共享 sparse/BM25 collection 還有一個容易忽略的邊界：IDF 若用 shard-wide 統計，不同 tenant 的詞頻會互相影響分數。使用 IDF modifier 時，可依官方 multitenancy 文件把 IDF corpus 限定在 tenant filter；這是排名隔離，仍不能取代授權。

## Snapshot 是備份材料，不是完整災難復原方案

Collection snapshot 可透過 API 建立：

```bash
curl -X POST 'http://localhost:6333/collections/documents/snapshots?wait=true'
```

接著把 snapshot 複製到節點之外的 object storage，並定期真的做 restore drill。官方目前要求目標版本與來源相同 minor，或最多高一個 minor；還原期間目標端約需要 collection 大小兩倍的磁碟，因為 snapshot 檔與還原資料會同時存在。

Snapshot 只涵蓋 Qdrant 狀態。要能重建完整 RAG 系統，還要另外保存原始文件、chunking 版本、embedding model 與維度、sparse encoder、payload schema、collection 設定及 ingestion checkpoint。只備份向量卻不知道它們由哪個模型產生，恢復後仍無法安全更新。

## 上線後最常見的失敗模式

| 症狀 | 常見原因 | 先做什麼 |
|---|---|---|
| Upsert 回 400 | vector name 或維度跟 collection 不符 | 查 collection schema，比對 embedding 輸出 |
| 明明有資料卻零結果 | payload 型別不符、tenant filter 錯、新 named vector 尚未回填 | retrieve point 檢查實際 vector 與 payload |
| Filter 一加就變慢 | 欄位沒建 payload index，或 index 型別錯 | 看 collection/index 設定，補正確 index |
| 新資料偶爾查不到 | 使用 `indexed_only`，更新仍在未最佳化 segment | 檢查 optimizer 狀態與查詢參數 |
| 延遲和磁碟突然升高 | 大量 ingest、segment merge、過多 payload index | 看 optimizer、CPU、I/O 與 segment 指標 |
| Snapshot 還原失敗 | minor version 不相容或磁碟不足 | 先建立同版環境並預留約 2 倍空間 |
| Tenant 資料外洩 | filter 由 client 控制，或共用管理 key | 後端強制注入 filter，縮小 key 權限 |
| 公網可直接讀寫 | self-host 預設沒有 auth | 立刻隔離網路，再加 API key 與 TLS |

監控至少要抓每個節點的 `/metrics`，並分開使用 `/healthz`、`/livez`、`/readyz` 做健康檢查。只看 HTTP 200 不夠；要追 query latency/error rate、points/vectors 數、active replicas、optimizer backlog、CPU、memory 與 disk I/O。Strict mode 也值得在 production 開啟，用來阻擋未索引 filter、過大 batch 或過度複雜查詢，而不是等資源被拖垮才處理。

## 最後的取捨

Qdrant 的優勢不是免維運，而是把向量、payload-aware filtering、sparse retrieval 與查詢融合放在同一個系統。正確導入順序是：先固定資料與 vector schema，再建 payload index，接著用代表性 query 評估 dense、sparse 與 fusion，最後補 tenant enforcement、snapshot restore drill、security 與 monitoring。

若團隊只需要在既有 Postgres 上加少量向量，pgvector 可能更省；若不想承擔上述 on-call，托管服務更合理。選擇自架 Qdrant，等於同時選擇它的搜尋能力與它的操作責任。

## 參考資料

- [Qdrant Installation](https://qdrant.tech/documentation/installation/)
- [Collections](https://qdrant.tech/documentation/manage-data/collections/)
- [Vectors](https://qdrant.tech/documentation/manage-data/vectors/)
- [Points](https://qdrant.tech/documentation/manage-data/points/)
- [Payload](https://qdrant.tech/documentation/manage-data/payload/)
- [Indexing](https://qdrant.tech/documentation/manage-data/indexing/)
- [Filtering](https://qdrant.tech/documentation/search/filtering/)
- [Hybrid Queries](https://qdrant.tech/documentation/search/hybrid-queries/)
- [Multitenancy](https://qdrant.tech/documentation/manage-data/multitenancy/)
- [Snapshots](https://qdrant.tech/documentation/snapshots/)
- [Migration and Recovery](https://qdrant.tech/documentation/migration-recovery-options/)
- [Security](https://qdrant.tech/documentation/security/)
- [Monitoring](https://qdrant.tech/documentation/operations/monitoring/)
- [Optimizer](https://qdrant.tech/documentation/operations/optimizer/)
