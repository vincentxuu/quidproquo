# 抽取紀錄：MongoDB Docs（Voyage AI）— Migrate to a New Embedding Model

read_status=full（curl 取 SSR HTML，抽出正文從首句到頁尾 "To learn more about generating embeddings"；另用 Exa web_fetch 抓同頁全文交叉核對，兩者內容一致）

## 書目

- MongoDB 官方文件，Voyage AI 區（Voyage AI 為 MongoDB 旗下 embedding 模型）。
- URL：https://www.mongodb.com/docs/voyageai/tutorials/migrate-embedding-model/ （2026-10-22 讀取，HTTP 200）。頁面沒有更新日期。
- 讀取：curl（654,805 bytes HTML）。第一次用 pandoc 轉 `<main>` 只得到 61 行（在第一個 JSON 程式碼區塊後截斷），改用 python 去標籤後取正文 → scratchpad/fulltext/o16-mongodb-migrate-embedding.txt（141 行、8,750 bytes），已讀 1–141 全部；Exa web_fetch 版本逐段比對無差異。
- 性質：廠商文件，規範性說明，沒有數據；推自家 Automated Embedding 功能。

## 可引用內容（行號為全文檔）

1. **不同模型的向量不能比**（行 4）："Embeddings that different models generate aren't comparable, so a migration involves more than changing a model name. Always regenerate the embeddings for your entire corpus with the successor model so that your stored vectors and your query vectors come from the same model."
2. **維度相同也要重算**（行 5）："Regenerate your corpus even when the successor model produces embeddings with the same number of dimensions and the same element type as your current model. Matching dimensions make two sets of vectors mathematically comparable, but Voyage AI models aren't trained to preserve relevance across models. Comparing query embeddings from a new model against stored embeddings from an older one degrades retrieval quality".
3. 同系列也建議重算（Note，行 43）：voyage-4 系列彼此相容，"but Voyage AI still recommends that you regenerate your corpus when you migrate between them."
4. 先用自己的資料評估（行 45）："evaluate its retrieval quality on a representative sample of your own data before you migrate your production corpus."
5. 自動嵌入時改 model 會重建索引並另計費（行 60）："When you change the model, numDimensions, or quantization settings, MongoDB Vector Search regenerates the index and the embeddings, which incurs additional embedding costs." 重建期間舊索引仍可查詢。
6. 自管向量的不停機做法（行 67 起）：新欄位寫新向量 → 建新向量索引（numDimensions 設新值）→ 查詢端改用新模型 → 驗證後刪舊索引與舊欄位（行 113–140）。
7. 成本提醒（行 112）："re-embedding a large corpus can exhaust your rate limits."

## 沒寫的事

- 沒說重算一個語料要多久、多少錢。
- 沒提切塊參數改變的影響（只講換模型）；「改切法要重建」在 Azure chunking 頁（semipermanent choice）與 Unrag、Curiosity 等文件才有。

## 其他看過的同類文件（Exa 搜尋結果摘要，未逐頁全讀，不列參考資料）

- NVIDIA RAG Blueprint、Qdrant、Zilliz、ScyllaDB、DataHub 文件都有同樣主張（換模型要重新嵌入全部資料）；Qdrant 與 Zilliz 另給藍綠或雙欄位遷移法。若正文要第二個來源，Qdrant 的 embedding-model-migration 教學是最完整的候選，需另讀全文。

## 對 order 16 的用法

- 「embedding 模型是半永久選擇」：直接引第 1、2 點。特別是「維度一樣也不能混用」這句，能打掉「換個同維度模型應該沒差」的直覺。
- 搭配 Azure chunking 頁「切塊策略是 semipermanent choice」（azure-rag-chunking-phase.md），組成「切法與 embedding 改了都要整批重建」。
