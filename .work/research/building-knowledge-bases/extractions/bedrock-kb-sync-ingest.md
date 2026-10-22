# 抽取紀錄：Amazon Bedrock User Guide — Sync your data with your Amazon Bedrock knowledge base

read_status=full（正文全讀，含 Console／API 兩個分頁；另讀 API Reference 的 IngestionJobStatistics 全頁）

## 書目

- AWS 官方文件，Amazon Bedrock User Guide。頁面未標日期（2026-10-22 讀取）。
- URL：https://docs.aws.amazon.com/bedrock/latest/userguide/kb-data-source-sync-ingest.html
- 補讀：https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_IngestionJobStatistics.html
- 全文檔（scratchpad/fulltext/）：
  - o18-bedrock-sync.html（27,334 bytes，curl）→ pandoc → o18-bedrock-sync.txt（130 行，8,844 bytes），已讀 1–130。
  - o18-bedrock-ingestion-stats.txt（107 行，2,172 bytes），已讀 1–107。
  - 目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文行號指 o18-bedrock-sync.txt，「S」前綴指 o18-bedrock-ingestion-stats.txt。

## 文件類型

- 官方產品說明，非實證。說明「同步做什麼」，沒說「怎麼判斷變更」。

## 可引用內容

1. 增量同步（行 37、41）："Syncing is incremental, so Amazon Bedrock processes only the documents that were added, modified, or deleted since the last sync." 每次新增、修改、刪除檔案都「must sync」——不同步就不會反映。
2. 四種情境表（行 45–48）：
   - 沒變 → skip。
   - 內容或 metadata 變 → 整份重新 ingest（re-parsed, re-chunked, re-embedded, re-indexed）。
   - 新文件 → 只 ingest 新的。
   - 刪除 → "The document is removed from the vector store."
3. 只改 metadata 不重算 embedding（行 52–62）："retrieves existing vector embeddings from the vector store, merges the new metadata, and writes the updated embeddings back, which avoids calls to the embedding model." 三個條件同時成立才適用：只改 `.metadata.json`、內容檔不是 CSV、沒用自訂轉換 Lambda。
4. CSV 例外（行 66）：CSV 的 metadata 裡有 `documentStructureConfiguration` 控制哪些欄被索引，Bedrock 不重處理就無法判斷結構設定有沒有變，所以 CSV 的 metadata 一改就整份重 ingest。
5. 同步完成≠可查（行 84、98）：除 Aurora（RDS）外的向量庫，同步完成後「could take a few minutes」新向量才可查詢。即官方承認的同步延遲窗。
6. 失敗紀錄（行 86、100；S 行 13–72）：Console 有 Sync history 與 View warnings 看失敗原因；API 用 GetIngestionJob 的 statistics。統計欄位：numberOfDocumentsScanned、numberOfNewDocumentsIndexed、numberOfModifiedDocumentsIndexed、numberOfDocumentsDeleted、numberOfDocumentsFailed、numberOfDocumentsSkipped、numberOfMetadataDocumentsScanned、numberOfMetadataDocumentsModified。
7. 可中斷續跑（行 78、90）：StopIngestionJob 可停，再 StartIngestionJob「to ingest the rest of your data」。
8. metadata 檔被忽略的前提（行 21–31）：`.metadata.json` 要與來源檔同名同副檔名；OpenSearch Serverless 索引須用 faiss 引擎，nmslib 要重建索引。
9. 頁首（行 11）：AWS 現在推薦改用「Amazon Bedrock Managed Knowledge Base」。

## 沒寫的事

- 沒說怎麼判斷「變了」：hash、LastModified 還是 ETag，頁面沒寫。不能拿來說「Bedrock 用內容 hash」。
- 沒說刪除是否也有延遲；只對新增資料講「few minutes」。
- 沒說失敗的文件舊版本會不會留在向量庫（文件修改後 ingest 失敗時，查到的是舊版、還是沒有）。
- 沒說「沒按 sync」時已刪檔案會留多久——答案就是一直留著，直到下次同步，但頁面沒明講。

## 對 order 18 的用法

- 「增量同步」四種情境的乾淨示範表；「只改 metadata 可不重算 embedding」的官方條件（含 CSV 與 Lambda 例外，說明這個優化有前提）。
- 「同步完成到可查有延遲」、「失敗要看統計欄位」兩點的出處。
- 不講設定步驟（範圍卡：不講特定雲服務的設定步驟）。
