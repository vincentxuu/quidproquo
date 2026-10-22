# 抽取紀錄：LangChain — How to use the LangChain indexing API（RecordManager、cleanup 模式）

read_status=full（v0.3 版 how-to notebook 全讀；現行 langchain-core 原始碼 `index()` docstring 與 hash 函式讀過）

## 書目

- LangChain 官方文件。原網址 https://python.langchain.com/docs/how_to/indexing/ 已轉址到 v1 文件首頁（docs.langchain.com/oss/python/langchain/overview），v1 文件裡沒有這頁（docs.langchain.com/oss/python/langchain/indexing 回 404）。
- 改讀官方 repo 的 v0.3 分支原檔：https://raw.githubusercontent.com/langchain-ai/langchain/v0.3/docs/docs/how_to/indexing.ipynb（27,005 bytes）→ 轉文字 o18-lc-indexing.txt（301 行，13,918 bytes），已讀 1–301。
- 現行程式碼：https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/core/langchain_core/indexing/api.py（954 行，39,246 bytes）存 o18-lc-api.py；已讀 1–230（hash 函式）、295–420（`index()` 簽名與 docstring）。其餘為 async 版與實作細節，未逐行讀。
- 目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 行號「N」指 notebook 文字檔、「C」指 api.py。

## 可引用內容

1. 目的（N 行 6–10）：避免重複寫入、避免重寫沒變的內容、避免對沒變的內容重算 embedding。
2. 怎麼判斷變更（N 行 19–25）：RecordManager 記三件事——文件 hash（"hash of both page content and metadata"）、寫入時間、source id。現行碼（C 行 213–223）分別 hash page_content 與 metadata 再合併。
   - 這個 hash 同時當成文件在向量庫裡的 ID（C 行 190–205 docstring："Document with a unique identifier based on the hash of the content and metadata"）；內容一變 ID 就變，所以「改」在向量庫裡其實是「新增一筆＋刪掉舊的」。
   - 所以 LangChain 的做法裡，只改 metadata 也算「變了」→ 刪舊寫新、重算 embedding。與 Bedrock 的 metadata-only 優化相反。
3. 四種 cleanup 模式（N 行 31–36 表）：

   | 模式 | 去重 | 清掉已刪來源 | 清掉被改的舊版 | 清理時機 |
   |---|---|---|---|---|
   | None | ✅ | ❌ | ❌ | — |
   | incremental | ✅ | ❌ | ✅ | 邊寫邊清 |
   | full | ✅ | ✅ | ✅ | 全部寫完才清 |
   | scoped_full | ✅ | ❌ | ✅ | 全部寫完才清 |

4. 刪除只有 full 模式處理（N 行 43–44、182–186）：來源被刪＝這次沒傳進來；只有 full 會刪，incremental 與 scoped_full 不會。full 模式要傳「full universe of content」，沒傳進來的都會被刪。
5. 新舊並存的時間窗（N 行 46–49）："there will be a period of time during indexing when both the new and old versions may be returned to the user." incremental 縮短這段；full／scoped_full 要等全部批次寫完才清。
6. 範例輸出（N 行 126–205）：同一份文件重複 5 次只加 1 筆；第二次跑全部 skipped；改 doggy.txt 內容 → num_added 1、num_deleted 1；full 模式刪掉一份來源 → num_skipped 1、num_deleted 1。
7. source 要指向最終來源（N 行 209–213）：切成 chunk 後每塊的 `source` 都要指向同一份母文件，否則 incremental 認不出舊 chunk。
8. 前提（N 行 53–56）：不能用在「不是透過 indexing API 寫入」的既有向量庫——RecordManager 不知道那些資料存在；向量庫要支援 add by id 與 delete by id。
9. 時間戳風險（N 行 62–70）：清理靠時間判斷；兩個任務若在時鐘還沒前進前接連完成，第二個可能清不掉。文件自己說實務上不太會發生。
10. 現行碼的警告（C 行 321–343）：full 模式下 loader 若只回傳部分資料，"the auto_cleanup will remove documents that it is not supposed to"；scoped_full 是 0.3.25 新增；預設 hash 是 SHA-1，碼內警告 SHA-1 不抗碰撞，建議 blake2b／sha256／sha512（C 行 55–66、370–386）；`force_update` 用於「re-indexing with updated embeddings」（C 行 367–368）。

## 沒寫的事

- 沒有任何實測數據（效能、時間窗長短）。
- 沒處理權限變更、跨索引（例如另有 BM25 索引）一起刪。
- v1 文件已不收這頁；API 仍在 langchain-core，但教學頁的「官方現行」地位要註明是 v0.3 文件。

## 對 order 18 的用法

- 「用內容 hash 判斷變更」的具體實作與四種模式表。
- 最好用的一句：增量模式不會處理刪除（incremental 不清已刪來源），要刪得靠「把完整清單交出來比對」的 full 模式——這正是 Ask AI 用 manifest 比對的理由。
- full 模式的風險面：清單不完整就誤刪（可接 Ask AI 的「空 manifest 拒絕同步」防呆）。
