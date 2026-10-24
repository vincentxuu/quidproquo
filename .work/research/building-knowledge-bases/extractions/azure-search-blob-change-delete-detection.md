# 抽取紀錄：Azure AI Search — Change and delete detection using indexers for Azure Storage

read_status=full（全頁讀完，含 portal 與 REST 兩種設定、Limitations）

## 書目

- Microsoft Learn 官方文件。meta ms.date 2026-03-25；頁尾「Last updated on 2026-06-02」；updated_at 2026-07-02。
- URL：https://learn.microsoft.com/en-us/azure/search/search-howto-index-changed-deleted-blobs
- curl → o18-azure-blob-delete.html（62,045 bytes）→ pandoc → o18-azure-blob-delete.txt（213 行，11,103 bytes），已讀 1–213。
- 目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/

## 文件類型

- 官方產品文件。定位為「限制／反證」：主流託管 indexer 預設偵測變更但不偵測刪除。

## 可引用內容

1. 變更靠時間戳，不是內容 hash（行 55）："indexers keep track of the last update using the built-in timestamps on objects and files in Azure Storage."
2. 刪除預設不偵測（行 57）："Although change detection is a given, deletion detection isn't. An indexer doesn't track object deletion in data sources." 要避免 "orphan search documents"，得用 soft delete：先刪搜尋文件、再刪儲存體裡的實體檔。
3. 必須第一天就設（行 64）：刪除偵測政策沒在第一次 indexer 執行前設好，之前刪掉的文件「remain in your index, even if you add the policy to the indexer later and reset it」；建議另建新索引與新 indexer。
4. 兩種 soft delete（行 59–62、76–163）：Blob 原生 soft delete（要開 soft delete、不能開 blob versioning、Azure Files 不支援），或自訂 metadata 欄位（例如 `IsDeleted=true`）。
5. 保留期要長於排程（行 94）：原生 soft delete 的保留期要「much higher than your indexer interval schedule」，因為 indexer 只在 blob 仍處於 soft deleted 狀態時處理到它才會刪索引文件。
6. 時間戳陷阱（行 74、134–136、171）：ADLS Gen2 目錄改名不更新 blob 時間戳 → 不會重新索引；還原 soft delete 的 blob 時間戳不變 → 可能不被重新索引，要重存 metadata 觸發。
7. 改 key 或路徑會斷追蹤（行 70）："Changing document keys or directory names and paths … breaks the internal tracking information used by indexers."
8. 切塊情境不適用（行 177）："Neither native blob soft delete nor soft delete via custom metadata applies when using one-to-many indexing scenarios. To delete the document entry, you must submit a deletion request to the index using the REST API deletion operation." one-to-many＝一份來源產生多筆索引文件（例如切塊）。

## 沒寫的事

- 沒有延遲數字。
- 沒說向量欄位與全文欄位是否同步刪（同一筆搜尋文件，一起刪）。

## 對 order 18 的用法

- 反證／限制：「增量同步會自動處理刪除」不成立。Azure 預設只看時間戳抓新增與修改；刪除要另外設計，而且要從第一次就設；切塊後一對多的索引得自己呼叫刪除 API。
- 與既有 microsoft-copilot-connectors-crawl-permissions（增量不處理刪除）同方向，一個是 Copilot connector、一個是 AI Search indexer。
- 「穩定 ID」的反例：改路徑就斷追蹤（可接 dzone-2026-source-inventory 的穩定 ID）。
