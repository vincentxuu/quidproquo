# 抽取紀錄：Pinecone docs — Update data／Delete data

read_status=full（兩頁 .md 原文全讀；多語言程式碼範例只看 Python 與 curl，其餘語言掃過）

## 書目

- Pinecone 官方文件，頁面未標日期（2026-10-22 讀取）。
- https://docs.pinecone.io/guides/manage-data/update-data → curl .md → o18-pinecone-update.md（693 行，25,785 bytes），已讀 1–693。
- https://docs.pinecone.io/guides/manage-data/delete-data → curl .md → o18-pinecone-delete.md（489 行，15,637 bytes），已讀 1–489。
- 目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 行號「U」指 update、「D」指 delete。

## 可引用內容（只改 metadata 不必重算 embedding）

1. Update by ID（U 行 107–115）：參數可以只給 `setMetadata`，不給 `values`；"only the specified metadata fields are modified"。即改 metadata 不必重送向量、不必重算 embedding。
2. Update by metadata（U 行 13、276–287）：用 filter 一次改多筆的 metadata；"Vector values can't be updated"。每次最多 100,000 筆，可先 `dry_run` 看命中數（U 行 283–287、505–539）。
3. 例子正好是 chunk 情境（U 行 289）：同一份文件的多個 chunk，一次補上 `author` 欄位。
4. 限制（U 行 679、683）：by-filter 只能加或改欄位，不能刪欄位；刪欄位要 upsert 整筆（帶原 ID 與原向量）並只給要保留的 metadata。
5. 陷阱（U 行 117–119）：ID 不存在時 "no records are affected and a `200 OK` status is returned"——不會報錯。
6. 陷阱（U 行 101–103）：Documents API 的 update 會忽略 `dry_run`，回 202 但照樣寫入。
7. 有內建 embed 欄位的 schema（U 行 97）：即使只改 metadata，每批上限從 1,000 降到 96。
8. 最終一致（U 行 567、687–689）：更新後 "there can be a slight delay before updates are visible to queries"；可用 log sequence number 確認完成。大批 by-metadata 更新「can be slow to process … and to be reflected」（U 行 678）。

## 可引用內容（刪除）

9. 三種刪法（D 行 11–12、108–114、228–230、361–363）：by ID（最有效率）、by metadata filter、刪整個 namespace 內容；by ID 每次最多 1,000 個 ID，速率上限每索引或 namespace 每秒 5,000 筆（D 行 476–479）；by metadata 每 namespace 每秒 5 次請求（D 行 483–485）。
10. 回應（D 行 100）：by ID 與 delete_all 回空 body，只有 filter 刪除會回 `matched_records`——by ID 刪了沒，回應本身看不出來。
11. 刪除也是最終一致（D 行 487–489）："Pinecone is eventually consistent, so there can be a slight delay before new or changed records are visible to queries."

## 沒寫的事

- 沒有延遲的數字（「slight delay」）。
- 沒說刪除後底層什麼時候真的回收（tombstone／compaction）。
- 沒說向量庫以外的副本（快取、BM25、備份）——那是應用端的事。

## 對 order 18 的用法

- 「只改 metadata 可不重算 embedding」的資料庫層官方說明（Bedrock 是託管服務層、Pinecone 是向量庫層，兩者互補）。
- 「刪除可能最終一致」再一條官方出處（已有 openai-retrieval-guide）。
- 寫刪除流程時的兩個坑：不存在的 ID 也回 200、by-ID 刪除回空 body → 刪完要另外驗證。
