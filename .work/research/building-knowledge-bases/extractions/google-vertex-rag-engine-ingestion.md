# 抽取紀錄：Google Cloud — Use data ingestion with RAG Engine（原 Vertex AI RAG Engine 文件，現屬 Gemini Enterprise Agent Platform）

read_status=full（curl 取 HTML → 取 <article> → pandoc 轉 Markdown，標題讀到 What's next）

## 書目

- Google Cloud Documentation。頁面標題 "Use data ingestion with RAG Engine | Gemini Enterprise Agent Platform"。
- sources.jsonl 原網址 https://docs.cloud.google.com/vertex-ai/generative-ai/docs/rag-engine/use-data-ingestion 會 301 轉到 canonical：https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion （2026-10-22 查）。產品已改名，文章引用時建議用新網址並註明原屬 Vertex AI RAG Engine。
- 頁尾 "Last updated 2026-10-21 UTC."
- 全文檔（scratchpad/fulltext/）：o12-vertex-ingestion.md（470 行、17,524 bytes），已讀 1–470；原始 HTML o12raw/vertex-ingest.html（252,591 bytes）。
- 下文「行」為 o12-vertex-ingestion.md 行號。

## 性質

- 廠商官方操作文件（規範性說明），不是實證研究。

## 可引用內容（原文）

1. **靜默失敗確切原文（行 51，Google Drive 項下）**："The service account must be granted the correct permissions to import files. Otherwise, no files are imported and no error message displays."
   - 確實在這一頁，位置是「Data sources supported for RAG → Google Drive」的說明段。後面接設定步驟：在 IAM 頁找 "Agent Platform RAG Data Service Agent" 服務帳號、把 Drive 資料夾分享給它、給 Viewer 權限（行 53–59）。
2. 去重規則（行 65–73，"Data deduplication"）："If the same file is imported multiple times with no changes, the file is skipped since it already exists." 跳過的條件三者皆須成立：已匯入、檔案沒變、切塊設定沒變。數量記在 `response.skipped_rag_files_count`。
3. 版本判斷依據（行 103–105）："The system automatically checks your file's path, filename, and `version_id`. The `version_id` is a file hash that's calculated using the file's content, which prevents the file from being reindexed." "If a file with the same filename and path has a content update, the file is reindexed."
4. 查失敗的方法（行 75–93，"Understand import failures"）：`import_result_sink` 是選填參數，設成 Cloud Storage 路徑或 BigQuery 表格後，"the successful and failed file results are written to the sink"，每行含 operation ID、時間、檔名、狀態、file ID。
5. 支援的來源（行 41–63）：本機上傳（單檔 25 MB 內、同步）、Cloud Storage、Google Drive（匯入目錄）、Slack、Jira；SharePoint 另有段落（行 300–458）。
6. SharePoint：若未指定資料夾 "all of the folders and files on the drive are imported."（行 338）

## 沒寫的事

- 沒說「權限不足」以外的情況是否也靜默（例如部分檔案權限不足時，是否只跳過那些檔案而不報錯）；原文只講「no files are imported」。
- 去重只認「同路徑、同檔名、內容 hash 相同」。**本紀錄推論**（原文沒有直接寫）：同一份文件放在兩個路徑、或改了檔名的副本，不會被當成重複，會各自進索引；內容幾乎相同的近重複版也一樣。去重不等於版本管理。
- 沒有提供「哪個版本是現行版」的機制。

## 與範圍卡說法的核對

- 範圍卡「連接器的靜默失敗（Google Drive 權限不足時不報錯）」：**正確**，出處就是這頁行 51。精確措辭應是「服務帳號沒有權限時，一個檔案都不會匯入，而且不會顯示錯誤訊息」。
- 建議補一句實務對策：匯入後要核對匯入檔案數，或設 `import_result_sink` 把每個檔案的成敗寫出來——這兩點都可直接掛本頁。

## 對 order 12 的用法

- 盤點表的「存取限制」欄要記錄「連接器用哪個帳號讀、該帳號有沒有權限」，匯入後比對「應有檔數 vs 實際匯入檔數」。
- 去重規則可用來說明：平台的去重只擋「同一個檔案重匯」，擋不了散在各處的副本與舊版，所以副本與版本要在盤點時處理。
