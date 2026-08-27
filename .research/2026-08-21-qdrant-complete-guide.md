# Research: Qdrant 完整指南

## 子問題

1. Qdrant 的 collection、point、dense/sparse vector 與 payload schema 邊界是什麼？
2. Docker 起步到 production 還缺哪些儲存、安全與監控條件？
3. Payload index、filter 與 hybrid query 該如何組合？
4. Upsert、delete、snapshot 與 restore 有哪些一致性與版本限制？
5. 共享 collection、user-defined shard 與 tiered multitenancy 各自解決什麼問題？
6. 哪些常見故障會表現成零結果、延遲或資料邊界錯誤？

## 來源清單

- [Qdrant Installation](https://qdrant.tech/documentation/installation/) — 官方；訪問日：2026-08-21
- [Collections](https://qdrant.tech/documentation/manage-data/collections/) — 官方；訪問日：2026-08-21
- [Vectors](https://qdrant.tech/documentation/manage-data/vectors/) — 官方；訪問日：2026-08-21
- [Points](https://qdrant.tech/documentation/manage-data/points/) — 官方；訪問日：2026-08-21
- [Payload](https://qdrant.tech/documentation/manage-data/payload/) — 官方；訪問日：2026-08-21
- [Indexing](https://qdrant.tech/documentation/manage-data/indexing/) — 官方；訪問日：2026-08-21
- [Filtering](https://qdrant.tech/documentation/search/filtering/) — 官方；訪問日：2026-08-21
- [Hybrid Queries](https://qdrant.tech/documentation/search/hybrid-queries/) — 官方；訪問日：2026-08-21
- [Multitenancy](https://qdrant.tech/documentation/manage-data/multitenancy/) — 官方；訪問日：2026-08-21
- [Snapshots](https://qdrant.tech/documentation/snapshots/) — 官方；訪問日：2026-08-21
- [Migration and Recovery](https://qdrant.tech/documentation/migration-recovery-options/) — 官方；訪問日：2026-08-21
- [Security](https://qdrant.tech/documentation/security/) — 官方；訪問日：2026-08-21
- [Monitoring](https://qdrant.tech/documentation/operations/monitoring/) — 官方；訪問日：2026-08-21
- [Optimizer](https://qdrant.tech/documentation/operations/optimizer/) — 官方；訪問日：2026-08-21

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| Installation / Collections / Vectors | ✅ 全頁與 REST 範例 | 無 |
| Points / Payload | ✅ 官方頁面與搜尋段落 | 文件目前有舊 `/concepts/` 與新 `/manage-data/` 路徑轉址 |
| Indexing / Filtering / Hybrid Queries | ✅ 全頁與 REST 範例 | 無 |
| Multitenancy | ✅ 全頁，含 tenant index、tiered multitenancy 與 IDF corpus | 無 |
| Snapshots / Migration and Recovery | ✅ 全頁，含版本與磁碟限制 | 無 |
| Security | ✅ 全頁，含 self-host 預設與 API key 類型 | 無 |
| Monitoring / Optimizer | ✅ 官方頁面與操作段落 | 文件路徑有舊 `/ops-*` 與新 `/operations/` 轉址 |

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| Named dense vector 在 collection 內有固定維度與距離 | Collections | Vectors | ✅ |
| Payload index 同時加速 filter 並改善 query planner 的 cardinality estimate | Indexing | Filtering | ✅ |
| Dense 與 sparse 可用 Query API prefetch 後以 RRF/DBSF 融合 | Hybrid Queries | Vectors | ✅ |
| Point mutation 先寫 WAL 再套用，`wait` 可控制是否等待完成 | Points | Collections 的 WAL 設定 | ✅ |
| 多租戶可從共享 payload partition 演進到 dedicated shard / tiered 模式 | Multitenancy | Indexing 的 tenant index | ✅ |
| Shared sparse corpus 的 IDF 可依 tenant filter 限定 | Multitenancy | Vectors 的 IDF modifier | ✅ |
| Self-hosted OSS 預設無驗證，production 要自行補 API key、network bind 與 TLS | Security | Installation | ✅ |
| Snapshot restore 要同 minor 或最多高一個 minor，並預留約 2 倍 collection 磁碟 | Migration and Recovery | Snapshots | ✅ |
| `indexed_only` 可能讓尚未最佳化的新資料暫時不可見 | Optimizer | Monitoring | ✅ |

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| Production 導入順序應先 schema/index，再調 hybrid，最後才做容量優化 | schema 與 index 錯誤會讓評測結果失真 | 已有成熟資料契約的團隊可平行處理 |
| Tenant filter 必須由可信任後端注入 | Payload partition 是搜尋邊界，不是 client 身分驗證 | 完全隔離 collection 且使用 granular key 時可減少 filter 依賴 |
| Stable point ID 是可重跑 ingestion 的最小條件 | Upsert 以 ID insert/update，重試可能重送 | 仍需處理 payload/vector 部分更新與來源版本競爭 |
| Snapshot 不足以單獨重建 RAG 系統 | Snapshot 不包含外部原始文件與 pipeline 設定 | 若所有 pipeline metadata 都已寫入並另有來源，缺口較小 |

## 草稿骨架

### 核心概念

Collection 固定 vector schema；point 組合 ID、named vectors 與 payload；payload index 讓 filter 成為檢索計畫的一部分。

### 關鍵設計決定

先固定 embedding 維度、距離、stable ID 與 payload 型別；dense/sparse 分開召回再融合；租戶條件在 query boundary 強制執行。

### 跟替代方案的比較

選型比較留給既有文章。本篇只指出：已有 Postgres 且規模有限時 pgvector 操作成本可能更低；不想 on-call 時應選 managed service。

### 適合 / 不適合的情境

適合需要自架、filter-aware vector retrieval、sparse/hybrid 與多租戶演進的系統；不適合把單機 Docker 當成零維運 production，或期待資料庫代替應用授權。

### 限制 / 已知問題

Primary storage 不能用 NFS/S3；payload 無 schema enforcement；新增 vector name 不會回填；snapshot restore 有版本與磁碟限制；未索引 filter 與 optimizer backlog 會造成效能或可見性問題。

### 取捨總結

Qdrant 把向量、filter、sparse 與融合放在同一搜尋系統，但安全、tenant enforcement、備份驗證與容量規劃仍由操作者負責。

## 待解問題

- 實際 HNSW、quantization、segment 與 replication 參數必須由資料量、SLO 與評測結果決定，不提供虛假的通用最佳值。
- 範例向量刻意縮成 4 維；production 必須依使用的 embedding model 修改。
