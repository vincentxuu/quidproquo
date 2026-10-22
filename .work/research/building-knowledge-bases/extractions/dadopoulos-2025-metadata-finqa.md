# 抽取紀錄：Dadopoulos et al. (2025) Metadata-Driven Retrieval-Augmented Generation for Financial Question Answering

read_status=full（arXiv v1 PDF 20 頁；正文 1–877 行全讀，參考文獻 878–1174 只讀到 1019，其餘未逐條讀）

## 書目

- Michail Dadopoulos（Aristotle University of Thessaloniki）、Anestis Ladas、Stratos Moschidis（University of Macedonia）、Ioannis Negkakis（University of Plymouth）。
- arXiv:2510.24402 v1（2025-10-28，cs.IR），標 "A Preprint"。
- 讀取：curl https://arxiv.org/pdf/2510.24402 → pdftotext -layout。
- 全文檔：scratchpad/fulltext/o15-dadopoulos2025-metadata-finqa.txt（1,174 行，99,882 bytes）。

## 研究設計

- 資料（行 403–425）：FinanceBench 公開子集 **150 題**（完整 10,231 題未公開）。
- 評估（行 433–470）：RAGChecker，以 Gemini 2.5 Flash-Lite 當評審（行 502–504）；檢索指標 Claim Recall、Context Precision。
- 前處理（行 522–588）：Docling 轉 Markdown；Gemini 2.5 Flash 產生文件層級 metadata（one_liner、summary、5–20 個 clusters）與 chunk 層級 metadata（parent_clusters、chunk_entities、answered_questions 3–10 題、retrieval_nuggets）；RecursiveCharacterTextSplitter 1,000 tokens、overlap 100。兩份索引：Std（只 embed 本文）、Ctx（**LLM 產生的 metadata 前置到本文再 embed**）。file name、year、quarter 等欄位存 Qdrant payload 供過濾。
- 架構（行 598–656）：Naive、Hybrid、Hybrid＋Cohere rerank、**Filtering + Rewriting**（gpt-4.1-mini 讀所有文件的 one-liner 挑檔案，再用所選檔案的摘要改寫查詢，檢索限定在挑中的檔案）、自製 metadata reranker、metadata 驅動的 chunk expansion。top-7。

## 可引用結果（Table 1，行 694–707）

1. 基準：Naive RAG F1 32.9、Claim Recall 45.9；Hybrid＋Cohere（Std）F1 38.9、Claim Recall 50.7。
2. **LLM 挑檔過濾＋改寫查詢讓檢索召回下降**（行 748–752）：Hybrid＋Cohere（Std）Claim Recall 50.7 → 加 Filtering + Rewriting 47.7。作者："may occasionally reformulate the query in a way that misses some key terms … or the file filtering step may be too aggressive."
3. **LLM metadata 併入向量也讓召回下降**（行 728–732）：Filtering + Rewriting + Cohere 從 Std 換 Ctx，Claim Recall 47.7 → 42.3；但 F1 37.3 → 44.4。作者：「every single head-to-head comparison」Ctx 的 F1 都較高（行 733–734）。
4. metadata 驅動的 chunk expansion（行 768–775）：Claim Recall 47.7 → 41.1；F1 37.3 → 33.2；Hallucination 14.7 → 22.2。
5. 總結（行 784–786）："Pre-retrieval Steps are a Double-Edged Sword: While aiming to improve precision, techniques like file filtering and query rewriting can inadvertently harm recall by over-constraining the search. Their value depends heavily on the quality of the controlling LLM."
6. 最佳 F1 44.4（Filtering + Rewriting + Cohere，Ctx）；作者自製 reranker 43.2，較 Naive 相對 +31%（行 681–688）。

## 原文疑點

- Table 1 第 9 列 Context Precision 44.4，其他列都在 16–23 之間，且與同列 F1 44.4 相同，疑似誤植（本紀錄判斷，原文未說明）。
- 只有 150 題、單一評審模型、每種設定只跑一次，沒有變異或顯著性；差 3 個百分點的 Claim Recall 落差可能在雜訊內。

## 限制（作者自述，行 847–876）

- 全靠 LLM 評審；k 固定 7；前檢索步驟結果好壞參半；只在 FinanceBench。

## 對 order 15 的用法

- 反證：metadata 用錯地方會傷召回——讓 LLM 依文件摘要先挑檔案再搜，召回 50.7 → 47.7；拿 LLM 產生的 metadata 擴充更多 chunk，幻覺率 14.7 → 22.2。
- 同時注意它也顯示 metadata 併入向量讓最終答案 F1 一致提高；所以結論是「過濾與擴充要量召回，不是 metadata 沒用」。
- 樣本 150 題，引用時要寫出來。
