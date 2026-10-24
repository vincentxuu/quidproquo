# 抽取紀錄：Huwiler, Stockinger & Fürst (2025) VersionRAG: Version-Aware Retrieval-Augmented Generation for Evolving Documents

read_status=full（arXiv v1 PDF 25 頁，正文、附錄 A–F 全讀）

## 書目

- Daniel Huwiler、Kurt Stockinger、Jonathan Fürst（Zurich University of Applied Sciences）
- arXiv:2510.08109 v1，2025-10-09（cs.IR）。預印本，未見同儕審查發表資訊。程式與資料集：https://github.com/danielhuwiler/versionrag
- 附錄 B.1 提到 "from the thesis evaluation"，研究源自學位論文。
- 讀取方式：curl https://arxiv.org/pdf/2510.08109（1,863,178 bytes，25 頁）→ pdftotext -layout → o12-versionrag.txt（1,362 行、104,841 bytes），已讀 1–1362 全部。
- 全文目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文「行」為 o12-versionrag.txt 行號。

## 研究設計

- 自建資料集 VersionQA：100 題人工整理題目、34 份文件、約 710 頁（行 258–271、952–961）。四個主題：Apache Spark release notes（6 份，2.4.7–3.5.5）、Bootstrap release notes（6 份，5.2.3–5.3.5）、Node.js Assert 模組文件（13 版，11.15.0–23.11.0）、Node.js Errors 文件（9 版，15.14.0–23.11.0）（行 308–313）。全是英文開源軟體技術文件。
- 六類題目（行 278–298、Table 3 行 307–313）：一般內容題 20、複雜內容題 20（以上 40 題「不需版本判斷」）；指定版本內容題 20、版本清單題 20、明示變更題 10、隱含變更題 10（這 60 題 version-sensitive）。
- 比較三種做法 × 三個模型（Llama 3 8B、GPT-4o Mini、DeepSeek-R1 70B）。Naive RAG：512 token 切塊、text-embedding-3-small、cosine top-5、無版本 metadata 與過濾（行 278–289、1224–1238）。GraphRAG：Neo4j 官方實作 HybridCypherRetriever。
- 評分：GPT-4.1 當評審，100 題人工複核（行 363–372）。作者明說題數少，無法做充分統計檢定（行 369–370、551–558）。

## 可引用結果（數字照原文）

1. 總體正確率（Table 5，行 323–361；DeepSeek-R1 70B）：Naive RAG 58.0%、GraphRAG 64.0%、VersionRAG 90.0%。GPT-4o Mini：53.0 / 57.0 / 79.0。Llama 3 8B：47.0 / 43.0 / 55.0。
2. 分類細項（Table 7，行 843–853；DeepSeek-R1 70B，Naive RAG）：一般內容 95.0%、複雜內容 80.0%、指定版本內容 55.0%、版本清單 35.0%、明示變更 50.0%、隱含變更 0.0%。
3. 本紀錄自行換算（原文沒有這個數）：Naive RAG 在 60 題 version-sensitive 題目的正確數 = 20×55% + 20×35% + 10×50% + 10×0% = 11+7+5+0 = 23 題，約 38%；40 題非版本題 = 19+16 = 35 題，約 88%。合計 58 題，與總體 58% 吻合。
4. 錯誤歸因（附錄 D.3，行 1089–1107）：Naive RAG 錯 42% 的題，其中「版本混雜（retrieves conflicting information from multiple versions）」占 25 個百分點、「沒有變更意識」占 17 個百分點。
5. 失敗例子（附錄 D.1.1，行 1054–1060）：問 Node.js 23.11.0 的 assert.partialDeepStrictEqual 穩定度，Naive RAG 同時撈到 v23.11.0 的 "1_2 - Release candidate" 與 v22.14.0 的 "1_0 - Early development"，"This conflicting information prevents correct answer generation."
6. 索引成本（Table 4、9，行 386–390、877–886）：VersionRAG 186K tokens、$0.17、25 分鐘；GraphRAG 2,970K tokens、$6.67、5h12m（DeepSeek-R1 70B）。
7. 查詢意圖分類正確率：DeepSeek-R1 70B 92%、GPT-4o Mini 91%、Llama 3 8B 76%（行 1204–1210）。

## 可引用原句

- 摘要（行 18–23）："Existing approaches achieve only 58-64% accuracy on version-sensitive questions, retrieving semantically similar content without temporal validity checks."
- 討論（行 447–458）："The 32-point accuracy gap between VersionRAG and Naive RAG cannot be bridged by simply retrieving more context or using larger models—it stems from the inability to distinguish between version-valid and version-invalid information."
- 版本資訊的前提（行 595–606）："The system assumes documents contain extractable version information in their first pages and maintain consistent structure across versions. Documents with version information embedded in filenames only, irregular formatting, or versioning schemes that don't follow semantic conventions (e.g., date-based versions, code names) may fail during indexing."
- 資料隱私（行 613–624）："organizations must carefully consider which documents to include and ensure appropriate access controls on the resulting knowledge graph."

## 與摘要或範圍卡說法不一致處

1. **58% 不是「版本題」的正確率。** 58% 是 Naive RAG（DeepSeek-R1 70B）在全部 100 題的總體正確率，其中 40 題根本不需要版本判斷（一般內容題 95%）。摘要寫 "58-64% accuracy on version-sensitive questions" 是不精確的說法，正文 Table 5 與 Table 21 都顯示 58% 是 overall。
   - 範圍卡「版本題 naive RAG 只對 58%」應改成以下其中一種：
     - （照原文分類）「指定版本的內容題只對 55%、問『有哪些版本』只對 35%、文件沒寫明的變更 0%」；或
     - （照總體）「在混有多版本的 100 題技術文件測驗裡，naive RAG 總體只對 58%」；或
     - （自行換算，要註明是換算）「需要分辨版本的 60 題約只對四成（23/60）」。
2. 「58%」只對應 DeepSeek-R1 70B；換成 GPT-4o Mini 是 53%、Llama 3 8B 是 47%。
3. 結論段（行 489）寫 "VersionRAG achieves 90% accuracy on version-sensitive questions"，同樣把總體數字說成版本題數字，與表格不符。

## 沒寫的事

- 沒測「只收現行版」或「把舊版刪掉」的基準條件；不能用來直接證明「只收現行版」比較好，只能證明「多版本混在一起又沒有版本 metadata 時，naive RAG 會混版本」。
- 沒測中文、法規、公司規章、合約；作者自己說法律、醫療文件的版本慣例不同，需要另外調整（行 560–573）。
- 沒測日期型版本（如 2023 年版、2025 年版）——作者明說日期型版本可能在索引階段失敗（行 600–601），也無法回答「2023 Q3 加了什麼」這種日曆時間問題（行 553–571）。

## 限制

- 100 題、34 份文件、四個英文開源專案；作者自承規模限制統計檢定。
- 預印本、作者自建基準又自己提方法，有「自家考卷」偏誤。
- Naive RAG 基線刻意最簡（無 metadata 過濾），實務上加版本 metadata 過濾的普通 RAG 不在比較內。

## 對 order 12 的用法

- 支持「同一份文件的多個版本混在知識庫、又沒標版本時，檢索會把不同版本的段落一起撈出來，模型無法判斷」。附錄 D.1.1 的 Node.js 例子可直接改寫成規章例子的對照。
- 支持「版本資訊要能被機器讀到（標在文件內，不能只靠檔名）」——這是盤點表要有「版本／生效日」欄的理由。
- 不支持「只收現行版」本身的效果大小；那一點改引 HoH（舊資訊一出現就掉分）與 Deasy（移除舊版後的前後對照）。
