---
title: "LanceDB 深入介紹：把向量搜尋嵌進 Arrow 資料工作流"
date: 2026-08-22
category: ai
tags: [lancedb, vector-database, rag, apache-arrow, embedded-database]
lang: zh-TW
type: deep-dive
tldr: "LanceDB 以 Lance 欄式格式保存向量、metadata 與多模態原始資料；OSS 可直接嵌入 Python、TypeScript 或 Rust 程序，資料放大或多人共用時再轉向分散式 Enterprise。"
description: "從 Lance 與 Apache Arrow 的資料模型、Python 寫入與查詢、IVF-PQ 和 metadata filtering，到嵌入式與 Enterprise 部署，完整拆解 LanceDB 的取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-lancedb-vector-database-en)

[LanceDB](https://github.com/lancedb/lancedb) 是一套可嵌入應用程式的開放原始碼檢索資料庫。它不只存 embedding，也把文字、圖片等來源資料與 metadata 放在同一張表，支援向量、全文與 SQL 式查詢。安裝 Python 套件後，連到本機目錄就能使用，不必先啟動獨立資料庫服務。

它和一般「先架一個向量資料庫叢集，再透過網路 API 存取」的產品路線不同。LanceDB OSS 跟 SQLite 或 DuckDB 一樣進入應用程式程序，底層資料則寫成 [Lance 欄式格式](https://lance.org/format/)；官方也提供連到物件儲存的方式。需要跨機器擴充、共用查詢服務與平台代管維護時，才進入 LanceDB Enterprise 的遠端叢集模型。

這個設計最吸引人的地方，不是少打一個 Docker 指令，而是向量搜尋能留在既有的 Arrow、Pandas、Polars 與 ML 資料工作流裡。代價也很清楚：OSS 的 CPU、記憶體、快取與索引維護都跟應用程式共用；「嵌入式」不等於「自動有高可用」。若你還在比較各種向量儲存方案，先讀[向量資料庫選型比較](/posts/ai/2026-03-12-vector-database-comparison)。

## Lance 與 Arrow：資料不是只剩一個向量欄位

LanceDB 的表格以 Lance 格式保存，而 Lance 的型別大致對應 Apache Arrow。向量通常是固定長度的浮點數 list，旁邊可以放字串、時間、數字、巢狀 struct、標籤，以及影像或其他多模態資料。這讓一筆檢索結果可以直接帶回生成答案需要的內容，不必只拿到 ID，再回另一個資料庫補查原文。

Lance 的表格沿兩個方向組織資料：列分成 fragments，每個 fragment 又可由多個資料檔案分別提供部分欄位。依[格式規格](https://lance.org/format/)，新增欄位或回填 embedding 因而主要是 metadata 操作，不必整張表重寫。manifest 則記錄 schema、fragments、版本與索引資訊，每次提交形成一個可追蹤的資料集版本。

```text
LanceDB table
├── manifest vN：schema、fragments、index metadata
├── fragment 0
│   ├── text / tenant / timestamp columns
│   └── embedding / image columns
├── fragment 1
└── _indices：vector、scalar、FTS index segments
```

索引也是有版本的第一級表格物件，而不是藏在某個常駐伺服器的記憶體裡。[Lance 索引規格](https://lance.org/format/index/)允許索引只覆蓋部分 fragments；查詢引擎可搜尋已索引區段、掃描尚未納入索引的新資料，再合併結果。這解釋了為什麼新寫入資料仍可查到，也解釋了為什麼長期寫入後仍要更新索引與 compact。

## 寫入與查詢：從 list of dict 到 Arrow table

最小的 Python 範例只需要 `pip install lancedb`。以下使用已算好的簡化向量，實際系統應固定 embedding 模型與維度，並保留可重建向量的原文與模型版本。

```python
import lancedb

db = lancedb.connect("./data/help-center.lance")

rows = [
    {
        "id": "doc-001",
        "tenant": "acme",
        "language": "zh-TW",
        "text": "管理員可以在帳務頁面下載發票。",
        "vector": [0.12, 0.81, -0.22, 0.09],
    },
    {
        "id": "doc-002",
        "tenant": "acme",
        "language": "en",
        "text": "Admins can download invoices from Billing.",
        "vector": [0.10, 0.78, -0.18, 0.14],
    },
]

table = db.create_table("articles", data=rows)
table.add([
    {
        "id": "doc-003",
        "tenant": "beta",
        "language": "zh-TW",
        "text": "帳單會在每月一日寄出。",
        "vector": [0.20, 0.66, -0.11, 0.07],
    }
])

query_vector = [0.11, 0.80, -0.20, 0.10]
results = (
    table.search(query_vector)
    .where("tenant = 'acme' AND language = 'zh-TW'")
    .select(["id", "text"])
    .limit(5)
    .to_list()
)
```

[基本表格操作文件](https://docs.lancedb.com/tables)也支援直接從 PyArrow、Pandas 或 Polars 建表，並能用明確的 Arrow schema 建立空表後逐批加入資料。這比把每個 DataFrame 轉成逐筆 REST payload 更接近資料工程原本的工作方式。

`search()` 預設可做 exact kNN；官方建議在幾十萬筆以下先測量暴力搜尋是否已足夠，再決定要不要建立 ANN 索引。這個順序很實用：小資料先保留精確結果與最少維護面，只有延遲或吞吐量真的不合格時才引入索引參數。

## 索引與 metadata filtering：ANN 只是半套答案

LanceDB 的向量索引以磁碟為主。[索引文件](https://docs.lancedb.com/indexing)列出的組合包含 IVF 搭配 Flat、PQ、SQ 或 RQ，也有 IVF-HNSW；預設自動建立的是 IVF-PQ。IVF 先把向量分區，查詢時只探測部分分區；PQ 再壓縮向量。增加 `nprobe` 通常能換取較高 recall，但會增加查詢工作量，因此索引調校必須用自己的 query set 測量，不能照抄一組參數。

新版 Python API 可明確指定向量與純量索引：

```python
from lancedb.index import BTree, IvfPq

table.create_index(
    "vector",
    config=IvfPq(distance_type="cosine"),
)
table.create_index("tenant", config=BTree())
```

metadata 過濾可以在向量搜尋之前或之後執行。前置過濾先縮小候選列，適合 tenant、權限、語言或時間窗這類不能越界的條件。後置過濾則先找鄰居再刪掉不符者，可能拿不到要求的筆數。正式上線前要用「向量相近但 tenant 不同」的測試資料驗證隔離，不要把 `.where()` 當成裝飾。

純量索引也要配合欄位形狀。BTree 適合高選擇性的等值與範圍條件，Bitmap 適合低基數類別，LabelList 則處理 list 欄位的包含查詢。若新增或修改資料，OSS 使用者還得執行 `optimize()` 將新列納入索引，並用 `index_stats()` 或 `wait_for_index()` 確認沒有未索引列；這是準確度與延遲之外，真正的維運工作。

## 嵌入式、物件儲存與 Enterprise

LanceDB OSS 最適合單一程序或單機可容納的工作負載，例如桌面 AI、研究資料集、批次 embedding pipeline 與單一 API service。它也適合不想多維護一個資料庫服務的 RAG。資料可放在本機路徑，也能直接連 S3、GCS 或 Azure Blob。不過程序直接讀遠端物件時，每次 cold read 仍付出網路往返，OSS 也沒有內建的分散式快取。

長期運行時至少要監看表格與 fragment 數、未索引列、查詢延遲、recall 測試集，以及 compaction/reindex 工作。寫入、更新與刪除會增加 fragments 或留下 deletion metadata，官方明確把 OSS 的索引更新與 compact 視為操作人員要自行排程的任務。

[LanceDB Enterprise 架構](https://docs.lancedb.com/enterprise/architecture)則把 durable table 與索引放在物件儲存，query nodes、執行節點與 indexers 分開擴充；索引、compaction 和 cleanup 移到背景工作。應用程式改用 `db://...` 連線並取得 remote table，核心查詢 API 大致不變。官方提供 managed 與 BYOC 兩種企業部署，但部分 materialization API 與 OSS 不同，所以遷移前仍要跑整合測試，不能只替換 URI 就宣告完成。

## 適合與不適合

**適合 LanceDB 的情境：**

- 資料已經在 Python、Arrow、Pandas 或 Polars pipeline，希望向量搜尋貼近資料，而不是先架另一套服務。
- 需要把 embedding、metadata 與圖片等多模態來源放在同一表格，並做向量、全文與結構化條件的組合查詢。
- 專案從本機或單機起步，能接受自行排程 optimize、compaction、備份與容量監控。
- 想保留開放欄式格式，未來再把相同資料移到叢集型部署。

**不適合直接用 OSS 的情境：**

- 服務一開始就需要多租戶高併發、跨節點容錯、線上擴縮與明確的 SLO；這已是遠端服務或 Enterprise 的問題。
- 團隊已有成熟 PostgreSQL，向量只是既有交易資料旁的一小部分；pgvector 通常少一套資料生命週期。
- 團隊需要資料庫替你自動處理 shard、replica、線上索引維護與 on-call，而不是把這些責任放進應用程式工作排程。
- 工作負載主要是複雜關聯、交易約束與更新，不是多模態掃描或檢索；LanceDB 不該取代通用 OLTP 資料庫。

LanceDB 的判斷題其實很簡單：你要的是「資料工作流裡的一個檢索引擎」，還是「獨立維運、多人共用的資料庫服務」？前者正是它的強項。後者要把 Enterprise 或其他叢集型向量資料庫一起放回評估表，別被零設定的開發體驗遮住正式環境的責任。

## 參考資料

- [LanceDB GitHub repository](https://github.com/lancedb/lancedb)
- [Lance format overview](https://lance.org/format/)
- [Lance table format specification](https://lance.org/format/table/)
- [Lance index format specification](https://lance.org/format/index/)
- [LanceDB basic table operations](https://docs.lancedb.com/tables)
- [LanceDB indexing](https://docs.lancedb.com/indexing)
- [LanceDB metadata filtering](https://docs.lancedb.com/search/filtering)
- [LanceDB Enterprise architecture](https://docs.lancedb.com/enterprise/architecture)
- [向量資料庫選型比較](/posts/ai/2026-03-12-vector-database-comparison)
