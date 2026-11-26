# 抽取紀錄：Most et al. (2025) Lost in OCR Translation? Vision-Based Approaches to Robust Document Retrieval

read_status=full（arXiv v1 全文；行 1–230 的前言與相關研究以 Exa 搜尋回傳的 PDF 全文段落讀過，與 pdftotext 檔同文；行 230–643 在 pdftotext 檔逐段讀）

## 書目

- Alexander Most、Joseph Winjum、Ayan Biswas、Shawn Jones、Nishath Rajiv Ranasinghe、Dan O'Malley、Manish Bhattarai（Los Alamos National Laboratory；Winjum 為 Montana State）。
- DocEng '25（ACM Symposium on Document Engineering, 2025-08），DOI 10.1145/3704268.3742698（Exa 搜尋結果列出）。預印本 arXiv:2505.05666 v1，2025-05-08。LA-UR-25-24280。
- 讀取：curl https://arxiv.org/pdf/2505.05666 → pdftotext -layout → scratchpad/fulltext/o13-most2025-lost-in-ocr.txt（643 行、78,747 bytes）。
- 角色：order 13 的**反證／限制**來源——檢驗「VLM 直接讀頁面影像，可以跳過解析」這個說法。

## 研究設計

- DocDeg 資料集：美國能源部 OSTI 的 4,196 份文件（論文、技術報告、備忘錄、投影片、手寫筆記），人工分四級劣化：0 原生數位、1 好掃描、2 有瑕疵掃描、3 嚴重劣化（行 234–292）。
- Llama 3.3 70B 每份生 10 題，共 41,956 題（行 293–319）。
- 比較：ColQwen2（7B，ColPali 家族，不微調）vs OCR 管線（Nougat 或 Llama 3.2 90B 做 OCR，再用 gte-Qwen2-7B 嵌入）（行 357–385）。另在 ViDoRe DocVQA 子集比較。

## 可引用結果（數字照原文）

1. DocDeg 全體（Table 1，行 408–424）：Recall@5 ColQwen2 0.3554、Nougat OCR 0.3774、**Llama OCR 0.6359**；MRR 0.2471 / 0.2858 / 0.4852。每一級劣化 Llama OCR 都贏；連最嚴重的第 3 級也是 0.5925 vs 0.3112。
2. 換 OCR 引擎本身差很大（行 373–385）：Llama 3.2 OCR 全面優於 Nougat。
3. 答題（Table 3，行 450–488）：OCR 管線在每個指標、每級劣化都較高（總 ROUGE-L 0.2355 vs 0.1903）。
4. 反方向：在 ViDoRe DocVQA（ColQwen2 有在這上面微調過），ColQwen2 NDCG@5 0.6027 遠勝兩種 OCR 管線的 0.3373（Table 5，行 536–548）。作者解釋是 ViDoRe 的查詢是短關鍵詞、與頁面文字鬆散相關，微調過的模型學到了這種配對；兩種 OCR 的檢索分數完全相同，「on such clean PDFs OCR quality is no longer the bottleneck」（行 549–562、531–533）。
5. 成本（Table 4，行 450–462）：VLM 管線記憶體 1.38 GB / 千份 vs OCR 管線 9.5 GB；OCR 每份 6 秒。

## 可引用原句

- 摘要："while vision-based RAG performs well on documents it has been fine-tuned on, OCR-based RAG is better able to generalize to unseen documents of varying quality."
- 結論（行 537–540）："without task-specific fine-tuning, OCR-based approaches offer improved retrieval and generation performance in all evaluated settings"

## 沒寫的事／內部不一致

- 檢索延遲：Table 4 寫 VLM 0.04252 秒/查詢、OCR 0.0311 秒，但 4.3 節內文寫 VLM「0.0010s per query vs. 0.0311s」並說 VLM 較快（行 495–499），與結論「OCR 在查詢時較快」（行 544–545）相反。延遲數字不要引。
- 不對等比較：VLM 7B vs OCR 用 90B 模型（作者在引言自己承認 2–7B vs 90B 的落差，並說 OCR 管線因此「potentially affording substantial advantages」）。
- 答題時 ColPali 取回的頁面也是先 OCR 再給 LLM（行 431–441），所以端到端比較其實是「檢索方式」不同，生成端都是文字。
- 題目由 LLM 依文件生成、只做約 40 題人工抽查（行 432–436）；EM 都低於 1%，分數絕對值意義有限。

## 對 order 13 的用法

- 反證定位：它**反駁的是「VLM 看圖就能取代解析」**，不是反駁 order 13 的主張；反而支持「OCR／解析品質是關鍵變數」（Llama OCR vs Nougat 差近一倍）。
- 限制：只比 ColQwen2 一種視覺檢索，未微調；換成微調過、或更新的視覺檢索模型，結論可能不同（ViDoRe 結果就是反例）。
- 文章若提「也可以不解析、直接用頁面影像檢索」，要同時引 ColPali（在它的基準上大勝）與本文（換到沒見過的文件就輸），講成「視覺檢索在訓練過的文件類型上強，泛化未定」。
