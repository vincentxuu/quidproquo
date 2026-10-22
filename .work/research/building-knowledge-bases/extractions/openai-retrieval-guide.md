# 抽取紀錄：OpenAI Retrieval guide（vector stores、attributes、attribute filtering）

read_status=full（curl 取 HTML → 去 svg/script/img → pandoc plain，刪掉程式碼區塊的行號雜訊；正文從標題讀到頁尾 "Previous / File search"）

## 書目

- OpenAI API docs，"Retrieval — Search your data using semantic similarity."
- URL：https://platform.openai.com/docs/guides/retrieval （2026-10-22 會 301 轉到 https://developers.openai.com/api/docs/guides/retrieval）。頁面沒有更新日期。
- 讀取方式：curl 直接拿到 200 的 SSR HTML（1,057,182 bytes），不需要 Playwright 或 Exa。
- 全文檔：scratchpad/fulltext/o15-openai-retrieval.md（2,036 行，58,552 bytes）。已讀 1–2036 全部；Go/Java/Ruby/JS 範例只確認與 Python 版參數一致。
- 先前 sources.jsonl 這列是 partial（只讀前 25,000 字元），本次補成全文。

## 可引用內容（行號為全文檔）

1. 回傳結果帶來源與 attributes（行 276–317）：每筆結果有 file_id、filename、score、attributes（範例 region、author）、content。
2. **attribute filtering 在語意搜尋之前套用**（行 335）："Attribute filtering helps narrow down results by applying criteria, such as restricting searches to a specific date range. You can define and combine criteria in filters to target files based on their attributes before performing semantic search."
3. 運算子（行 341–352）：比較 eq、ne、gt、gte、lt、lte、in、nin；複合 and、or。
4. **日期用 unix timestamp 數字**（行 382–396）：date range 範例 `gte 1704067200`（2024-01-01）、`lte 1710892800`（2024-03-20）；建立範例 `"date": 1672531200`（行 1507）。
5. 範例欄位（行 368–456、1502–1519）：region、date、filename、project_code、confidentiality（"top_secret"）、language、category、department。
6. filename 不會自動成為 attribute（行 356）："The filename examples below match a custom filename attribute, which you must explicitly set on each vector store file … They don't automatically match the uploaded file's name."
7. **attributes 掛在檔案上，不是 chunk 上**（行 476、1496）：vector_store.file "Contains attributes map used for filtering"；"Each vector_store.file can have associated attributes … The dictionary can have at most 16 keys, with a limit of 256 characters each."
8. 刪除是最終一致（行 745）："Removing files from a vector store is eventually consistent, and search results may still include content from a removed file for a short period."（order 18 可用）
9. 預設切塊（行 1660）：800 tokens、overlap 400；max_chunk_size_tokens 100–4096，overlap 不得超過一半（行 1664–1665）。
10. ranking_options（行 460）：ranker、score_threshold 0.0–1.0，"A higher score_threshold will limit the results to more relevant chunks, though it may exclude some potentially useful ones"；hybrid_search 可調 embedding_weight 與 text_weight（RRF）。
11. 合成回答的範例 prompt 把 file_id、file_name 包進 `<result>` 標籤（行 1942–1963）——來源欄位傳進生成階段，才能引用。

## 沒寫的事

- 沒有任何效果數字（過濾前後的召回、精確度）。
- 沒說過濾會不會讓召回下降（order 17 用 Filtered ANN 2026 補）。
- attribute 只能到檔案層級：同一份檔案裡「這段適用 A 方案、那段適用 B 方案」在 OpenAI vector store 無法用 attribute 區分，只能拆檔。

## 對 order 15 的用法

- 「適用範圍單獨成欄才能過濾」：行 335 是直接根據（過濾在語意搜尋之前）。但要補一句：在 OpenAI 是**每個檔案**最多 16 個欄位，所以適用範圍不同的內容要拆成不同檔案。
- 「日期欄位是處理過時文件的前提」：日期要存成數字（unix timestamp）才能用 gt/lt 做區間過濾。
- 範例 schema 可參考行 1505–1507 的 region／category／date 三欄。
