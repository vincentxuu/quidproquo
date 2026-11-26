# 抽取紀錄：Amazon Bedrock Knowledge Bases — metadata filtering 與 S3 metadata.json

read_status=full（兩頁都 curl 取 HTML → pandoc plain，從標題讀到頁尾）

## 書目

- (A) "Configure and customize queries and response generation"，https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html
  - 全文檔：scratchpad/fulltext/o15-bedrock-kb-test-config.md（541 行，39,255 bytes）。已讀 1–541 全部。
- (B) "Connect to Amazon S3 for your knowledge base"，https://docs.aws.amazon.com/bedrock/latest/userguide/s3-data-source-connector.html
  - 全文檔：scratchpad/fulltext/o15-bedrock-s3-metadata.md（200 行，10,801 bytes）。已讀 1–200 全部。
- 頁面無更新日期；讀取日 2026-10-22。

## 可引用內容

1. 過濾的目的（A 行 3）："you can apply filters to document metadata fields/attributes to use the most recently updated documents or documents with recent modification times."
2. **日期過濾範例**（A 行 93）："epoch_modification_time" 是自 1970-01-01 起的秒數，"You can filter on the most recent data, where "epoch_modification_time" is greater than a certain number."
3. 運算子與型別（A 行 117–128、271–281）：equals／notEquals（string、number、boolean）；greaterThan／lessThan 等**只支援 number**；in／notIn（字串清單）；stringContains、listContains、startsWith 只在部分向量庫（OpenSearch Serverless）可用。邏輯 andAll／orAll，每組最多 5 個條件、最多 5 組、只能巢狀一層（A 行 157–161、236）。
4. 依向量庫而異（A 行 99–111）：OpenSearch Serverless 要 faiss 引擎、nmslib 不能過濾；S3 vector bucket 不能用 startsWith／stringContains；Aurora 要另設 metadata 欄並建索引。→ 「同一份 schema 換一個向量庫可能就不能用」。
5. 系統自動欄位（A 行 91、113）：保留欄位 x-amz-bedrock 前綴或底線前綴（_source_uri、_data_source_id）；PDF 的頁碼會自動存進 x-amz-bedrock-kb-document-page-number（選 no chunking 時沒有）。
6. **implicit metadata filtering**（A 行 292–332）：給一份 metadata schema（key、type、description），由 LLM（Claude）依使用者問題自動產生過濾條件。範例欄位 company、ticker、pe_ratio、is_us_company、tags。頁面沒有任何準確度數字。
7. **metadata 檔格式**（B 行 57–92）：每個來源檔旁放 `檔名.副檔名.metadata.json`，內含 metadataAttributes；**單檔上限 10 KB**；範例欄位 company、created_date（`numberValue: 20221205`，用數字存日期）、author、origin。
8. **includeForEmbedding**（B 行 94–98）：
   - false：只 embed chunk 本文，metadata 只用來過濾，"does not influence semantic search results"。
   - true："The metadata key-value pair is concatenated to the chunk text before embedding (for example, key1: value1\n\nchunk text) … queries mentioning the metadata key or value will contribute to the similarity score … The metadata key-value pair is not included in the chunk text returned in results, ensuring that results contain only the raw content from source files."
   - 簡化格式（只有 key: value）等同 false（B 行 100–108）。
9. 權限提醒（B 行 118）："All data that you sync from your data source becomes available to anyone with bedrock:Retrieve permissions"（order 17 用）。
10. 切塊策略連上資料源後不能改（B 行 140）："You can't change the chunking strategy after connecting to the data source."（order 16 用）

## 沒寫的事

- 沒有過濾或 includeForEmbedding 的效果數字。
- implicit filtering 沒提 LLM 產生錯誤條件時的後果（過濾錯了等於直接漏掉正確文件）——見 poliakov-2026-probe.md、dadopoulos-2025-metadata-finqa.md。

## 對 order 15 的用法

- metadata 的兩種用法在 Bedrock 是同一個開關：只過濾（false）或也併入向量參與比對（true）。可當「用途」一節的具體例子，也呼應 Azure「清理後另存一欄、回傳原文」——併入向量的 metadata 不出現在回傳的原文裡。
- 日期一律存數字：Bedrock 的 greaterThan 只吃 number（A 行 121），範例用 epoch 秒或 20221205。
