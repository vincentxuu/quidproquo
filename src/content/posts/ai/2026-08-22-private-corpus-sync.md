---
title: "從來源到索引：私有語料的同步與增量更新管線"
date: 2026-08-22
category: ai
type: deep-dive
tags: [data-pipeline, rag, qdrant, meilisearch, data-sync, indexing]
lang: zh-TW
tldr: "私有語料同步的核心不是定時重抓，而是用 canonical ID 固定文件身分、用來源版本與 checksum 判斷變更、用冪等 upsert 寫入，並讓 tombstone 走完所有索引的刪除傳播。"
description: "拆解私有語料從 connector 到搜尋索引的完整生命週期：變更偵測、版本控制、冪等寫入、tombstone、重建、死信佇列，以及可稽核的刪除傳播。"
series:
  name: "私有語料管線"
  order: 2
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-private-corpus-sync-en)

把 SharePoint、Google Drive、內部 Wiki 或物件儲存空間接到搜尋系統，第一次全量匯入通常不難。真正麻煩的是第二次：文件改名、移動、權限變更或被刪掉時，索引裡的舊內容能不能正確更新，而不是多出一份幽靈副本。

這篇只處理「資料如何從來源安全、持續地進入索引」。搜尋排序與 RAG 技法不在範圍內；Qdrant 與 Meilisearch 的查詢能力分別見[Qdrant 完整介紹](/posts/ai/2026-08-21-qdrant-complete-guide)與[Meilisearch 完整介紹](/posts/ai/2026-08-21-meilisearch-complete-guide)。

## 先把同步看成狀態機

一條可維護的管線不是 `fetch → chunk → index` 三步驟，而是一個保存來源狀態的狀態機：

```text
source connector
      │ change hint / periodic scan
      ▼
source manifest ──► fetch ──► normalize ──► checksum
      │                                      │
      │ deleted                              ├─ unchanged → update checkpoint
      ▼                                      └─ changed
  tombstone                                      ▼
      │                                  versioned document
      └──────────────► outbox / queue ◄──────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              Meilisearch upsert   Qdrant upsert
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    sync ledger / audit log
```

connector 只負責把不同來源翻成同一份事件格式，例如 `upsert` 或 `delete`、來源游標、來源版本與文件識別碼。解析器、切塊器與索引 client 不應知道 SharePoint 的 page token 或 S3 的 continuation token。這個邊界讓來源 API 改版時，不必連索引寫入一起重做。

## Canonical ID 決定文件是不是同一份

索引主鍵不能直接用檔名或 URL。兩者都可能因移動或改名而變動，最後讓同一份文件留下兩組 chunks。優先使用來源提供、跨改名仍穩定的物件 ID，再加上租戶與來源命名空間：

```text
document_id = sha256(tenant_id + ":" + source_type + ":" + source_object_id)
chunk_id    = sha256(document_id + ":" + parser_version + ":" + chunk_ordinal)
```

若來源真的沒有穩定 ID，才退而使用正規化路徑；此時「移動」必須被視為舊 ID 的刪除加新 ID 的建立。canonical ID 也不能混入標題、修改時間或內容 checksum，否則每次編輯都會產生新主鍵，upsert 就失去意義。

每筆 manifest 至少保存 `document_id`、來源 locator、來源版本、內容 checksum、管線版本、最後看見時間與刪除狀態。索引可以壞掉重建，manifest 才是同步判斷的事實來源。

## 先用來源提示省流量，再用 checksum 下判決

不同 connector 能拿到的變更訊號不同。HTTP 來源可保存 `ETag` 或 `Last-Modified`，下一輪用 `If-None-Match` 或 `If-Modified-Since` 發條件式請求；沒有變更時伺服器會回 `304 Not Modified`。[MDN 的條件式請求文件](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests)也特別區分強、弱 validator，因此弱 ETag 不等於內容逐位元組一致。

網站 connector 可以先讀 Sitemap 的 `<lastmod>` 縮小候選集合。不過 [Sitemaps protocol](https://www.sitemaps.org/protocol.html)明確說它是可選欄位，而且日期應代表頁面實際修改時間，不是 sitemap 產生時間；所以它只能是提示，不能當最終真相。其他來源則可能提供 change feed、增量游標或物件 generation。

真正決定要不要重做下游工作的，應是正規化內容的 checksum：先移除每次抓取都會變的 request ID、產生時間與無關導覽，再對穩定表示算 SHA-256。這能避免「來源版本變了、可搜尋文字沒變」時重跑解析與 embedding，也能抓到來源沒有正確更新 `lastmod` 的情況。

另外保存 `parser_version`、`chunker_version`、`embedding_model_version` 與 `schema_version`。內容 checksum 沒變，但任何會改變索引輸出的管線版本變了，仍要重算。來源版本回答「上游是否變動」，checksum 回答「標準化內容是否變動」，管線版本回答「相同內容是否會產生不同索引資料」；三者不要塞成一個欄位。

## 冪等 upsert 才扛得住重試

訊息佇列通常保證至少一次傳送，因此同一事件可能被處理多次。consumer 必須讓重跑得到相同結果：固定 ID、完整 payload、帶版本的條件寫入，成功後才推進 checkpoint。

[Qdrant 的 upsert API](https://api.qdrant.tech/api-reference/points/upsert-points)會以既有 point ID 覆寫 point；[Meilisearch 的 add-or-update API](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents)則是頂層欄位的局部更新，巢狀物件會整個取代。這兩種語意不同，所以同步層最好產生完整 canonical document，並明確選擇 replace 或 update，不能假設兩邊的 `upsert` 完全相同。

```python
def apply(event, ledger, indexes):
    current = ledger.get(event.document_id)
    if current and event.version <= current.applied_version:
        return "stale-or-duplicate"

    if event.op == "delete":
        indexes.delete_document_and_chunks(event.document_id)
    else:
        indexes.replace_document(event.document_id, event.payload)

    ledger.mark_applied(event.document_id, event.version, event.event_id)
```

版本比較要由同一文件的來源序號、generation 或單調遞增的內部 revision 支撐，不能拿不同主機的 wall-clock timestamp 硬比。若索引寫入與 ledger 無法共用交易，就用 outbox 加可重試的 reconcile job，定期找出「某一個索引成功、另一個失敗」的半套狀態。

## Tombstone 是資料，不是缺席

「本輪沒看到文件」不能立刻等同刪除：可能是 connector timeout、API 分頁中斷，或服務帳號暫時失去整個資料夾的讀取權。刪除應來自明確 delete event，或在一次完整 enumeration 成功後，用本輪集合與 manifest 做差集。

tombstone 至少要記錄 `document_id`、delete version、偵測時間、原因與各下游完成狀態。處理順序是先把 tombstone 寫進耐久儲存，再刪除文件、chunks、向量與衍生快取，最後才標記完成。這樣中途掛掉仍能重試，也保留「何時、為何刪除」的稽核軌跡。

保留 tombstone 一段時間還有另一個目的：阻擋延遲抵達的舊 upsert 把已刪文件復活。只有版本高於 delete version 的重新建立事件，才能清除 tombstone。刪除傳播的完成條件不是 API 回 `200`，而是所有索引都查不到該 `document_id`，而且 ledger 已記錄確認時間。

## Rebuild 不要覆寫線上索引

parser、chunk 規則或 embedding 模型大改時，逐筆更新很難判斷是否漏掉舊資料。安全做法是從 manifest 建一個帶 generation 的新索引：

1. 固定 rebuild 起始 checkpoint，將當下快照寫進新 generation。
2. 同步記錄 rebuild 期間的新事件，不要讓它們只進舊索引。
3. 全量完成後重播 checkpoint 之後的事件，直到 lag 歸零。
4. 驗證文件數、chunk 數、抽樣 checksum 與 tombstone 後，原子切換讀取別名。
5. 保留舊 generation 作短期回復，再依保留政策清除。

這種 blue-green rebuild 把「重算」和「線上服務」拆開。最重要的是 manifest 可重播；如果 rebuild 還得回來源重新抓一次，來源當下的權限或內容可能已改變，就無法重現原索引。

## DLQ 是維修工作台，不是垃圾桶

網路逾時與限流適合指數退避重試；格式壞掉、超大檔案、密碼保護 PDF 或 schema 不相容，重試一百次也不會好。超過上限後，事件要進 dead-letter queue（DLQ），並保留 `event_id`、來源 locator、失敗階段、錯誤分類、管線版本與重試次數。

[Amazon SQS 官方文件](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)把 DLQ 定位為隔離未成功處理的訊息，以便檢查原因並 redrive。實務上還要替 DLQ 深度與最舊訊息年齡設告警；修好 parser 後以受控速率重送，避免瞬間壓垮來源或索引。刪除事件應使用更高優先級與獨立告警，不能跟一般解析失敗一起無限等待。

## 上線前的最小檢查表

- 同一事件送兩次，索引內容與文件數是否完全相同？
- 文件改名或移動後，canonical ID 是否保持不變？
- 較舊 upsert 晚到時，是否會被版本閘門拒絕？
- enumeration 半途失敗時，是否不會誤發大量 tombstone？
- 刪除後，文件、所有 chunks、兩種索引與快取是否都能驗證消失？
- 新索引 rebuild 期間發生的更新，切換後是否仍存在？
- DLQ 是否能看出失敗階段、重送，並對刪除失敗立即告警？

同步管線真正要守住的 invariant 很簡單：**每個來源物件只有一個穩定身分；索引只接受最新版本；刪除與更新同樣可重試、可追蹤。** 做到這三件事，Qdrant 或 Meilisearch 才是可以重建的投影，而不是另一份無法對帳的資料庫。

## 參考資料

- [MDN：HTTP conditional requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests)
- [Sitemaps.org：Sitemap protocol](https://www.sitemaps.org/protocol.html)
- [Qdrant API：Upsert points](https://api.qdrant.tech/api-reference/points/upsert-points)
- [Meilisearch API：Add or update documents](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents)
- [Amazon SQS：Using dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)

