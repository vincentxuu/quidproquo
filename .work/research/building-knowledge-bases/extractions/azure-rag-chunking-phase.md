# 抽取紀錄：Microsoft Azure Architecture Center — RAG chunking phase（附 RAG preparation phase 的文件分析段）

read_status=full（chunking 頁 curl 取 HTML → `<main>` → pandoc，從標題讀到頁尾 Last updated；preparation 頁本次重抓重讀，已有 order 11 紀錄 azure-rag-preparation-phase.md）

## 書目

- RAG chunking phase：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-chunking-phase （meta ms.date 2026-05-27；頁尾 Last updated on 2026-06-18）。→ scratchpad/fulltext/o13-azure-rag-chunking.md（628 行、48,197 bytes），正文行 91–624 全讀（之前 sources.jsonl 記錄只讀前 25,000 字元，本次補完）。
- RAG preparation phase：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase （ms.date 2025-10-10；Last updated 2025-11-21）。→ o13-azure-rag-preparation.md（469 行、29,239 bytes），全讀。
- 下文「C」= chunking 頁檔、「P」= preparation 頁檔的行號。
- 性質：廠商官方架構指引，規範性建議，沒有實驗數據；會推自家服務（Document Intelligence、Content Understanding）。

## 重點：範圍卡要的三塊其實分在兩頁

- 「要忽略的內容清單」、表格與圖片要問的問題 → 在 **preparation 頁**的 "Content structure and characteristics"（P 行 181–265）。
- 「解析時移除浮水印、頁首頁尾」「避免中介格式」「版面分析工具」→ 在 **chunking 頁**（C 行 208–240、379–381）。
- 引用時兩頁都要列；只掛 chunking 頁，讀者找不到忽略清單。

## 可引用內容（原文）

### 要忽略的內容（P 行 181–192）
"Some structural elements might not add meaning to the document and can safely be ignored when chunking. In some situations, these elements can add valuable context and improve the relevancy of queries to your index, but not all." 六個問題：目錄？頁首頁尾？版權或免責聲明？註腳或尾註？浮水印？註解或評論？
- 注意原文措辭是「問這些問題決定要不要忽略」，不是「一律刪掉」。

### 解析前要確認的結構（P 行 194–211）
- "Are there multicolumn data or multicolumn paragraphs? You don't want to parse multicolumn content the same way as single-column content."
- HTML 用表格排版 vs 真正的表格資料要分開；語言與方言；Unicode；**數字格式（逗號、小數點）是否一致**；有無可抽出語意的標題結構；項目符號與縮排。

### 圖片（P 行 221–231）
- 解析度、圖中有沒有文字、圖與周圍文字的關係（圖說常含圖本身沒有的脈絡）、有無無障礙描述。
- "icons might not add any semantic value. Adding a description for icons might be detrimental to your solution"。

### 表格與圖表（P 行 258–268）
- 圖表有沒有數字？表格是否巢狀複雜？有無表格標題？"How long are the tables? Long tables might require repeating headers in chunks."；有無數學式。

### 掃描檔（P 行 283）
- "Physical content quality: ... Scanned images might not let you extract usable information"。

### 載入階段的前處理（C 行 208–216）
- "you might want to remove watermarks, headers, and footers." 清單：移除或標註要忽略的項目；用 LLM 生成圖片描述替換圖片引用；圖片另存；**重排表格讓它更好處理**；依標題建立文件結構（可用 Document Intelligence，敏感資料可改用 Python 函式庫）。
- 持久化載入結果的理由之一（C 行 220–222，"Persist the result of the loading code"）："if you want the ability to inspect the documents after they're loaded and preprocessed, but before the chunking logic runs"——這是抽檢的落點。

### 中介格式（C 行 238–240）
- "Start by combining your loading and chunking logic. Separate them when your solution requires it."
- **"Avoid converting documents to an intermediate format if you choose to separate the processes. This type of operation can result in data loss."**
- HTML 圖片標籤（C 行 232）：解析器不要把圖片參照標籤移除，否則切塊程式找不到圖。

### 版面分析（C 行 379–381）
- "Document layout analysis libraries and services combine optical character recognition (OCR) capabilities with deep learning models to extract both the structure and the text of documents. Structural elements can include headers, footers, titles, section headings, tables, and figures." 工具：Document Intelligence、Donut、Layout Parser；"You still have to write code that interacts with the model."

### 其他
- 切塊策略是「semipermanent choice」，換了會牽動整條下游（C 行 252）。
- 圖片描述成本：先用 Vision 分類決定哪些圖值得描述、再用 hash 快取（C 行 141–185）。
- 圖片描述被切成多塊時，每塊都附圖片 URL（C 行 294）。

## 沒寫的事

- 沒有任何數據證明哪種前處理有效。
- 沒提怎麼抽檢解析結果，只有「持久化以便檢查」。
- 「避免中介格式」只有一句，沒說哪種格式會丟什麼；具體機制要靠 Docling 文件（Markdown 攤平合併儲存格）與 OHRBench（Markdown 表格生成較差）補。

## 與範圍卡不一致處

- 範圍卡寫「要忽略的內容清單」掛 Azure chunking 頁：清單實際在 preparation 頁。
- sources.jsonl 原記錄 chunking 頁 read_status=partial（前 25,000 字元），本次已讀完全文。

## 對 order 13 的用法

- 「要忽略的內容」：用 preparation 頁的六個問題，強調「先問、再決定」，頁首頁尾有時有價值（InduOCRBench 標註規範也保留「資料來源」這類頁尾）。
- 「避免中介格式」直接引 chunking 頁原句。
- 抽檢落點：載入後、切塊前持久化結果。
