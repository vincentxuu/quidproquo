# 抽取紀錄：Faysse et al. (2025) ColPali: Efficient Document Retrieval with Vision Language Models

read_status=partial（arXiv v6 正文 1–682 全讀：摘要、引言、相關研究、ViDoRe、架構、訓練、結果、延遲、消融、結論；附錄 A–E（行 683–1454：參考文獻、資料集細節、延遲細節、額外結果、ColBERT/SigLIP 背景）只看章節標題，未逐段讀）

## 書目

- Manuel Faysse、Hugues Sibille、Tony Wu（共同一作）、Bilel Omrani、Gautier Viaud、Céline Hudelot、Pierre Colombo。Illuin Technology、Equall.ai、CentraleSupélec、ETH Zürich。
- ICLR 2025（PDF 頁首標示）。arXiv:2407.01449 v6，2025-02-28。資源：https://hf.co/vidore
- 讀取：curl https://arxiv.org/pdf/2407.01449 → pdftotext -layout → scratchpad/fulltext/o13-colpali.txt（1,454 行、93,290 bytes）。
- 站上已有 colpali-visual-document-retrieval 一文（2026-09-03），本紀錄只取 order 13 需要的反面論點。
- 角色：order 13 的**反證**——「解析成文字」這條路本身會丟視覺資訊，而且慢。

## 可引用結果（數字照原文）

1. ViDoRe 平均 nDCG@5（Table 2，行 394–414）：Unstructured＋OCR（BGE-M3）66.1、Unstructured＋Claude-3 Sonnet 圖說（BGE-M3）67.0；**ColPali 81.3**。表格題 TabFQuAD：Unstructured＋OCR BGE-M3 70.8 vs ColPali 83.9；資訊圖表 InfoVQA 60.1–71.9 vs 81.8。
2. **文字管線預設把圖表丟掉**（行 257–260）："in our simplest Unstructured configuration (text-only), only textual elements are kept and figures, images, and tables are considered noisy information and are filtered out."——純文字版在圖表類任務連分數都無法計算（Table 2 以「-」表示）。
3. 建索引速度（Figure 2，行 284–295）：PDF 解析管線（Unstructured 設定）每頁 7.22 秒 vs ColPali 0.39 秒。
4. 引言的觀察（行 47–57）："the primary performance bottleneck for efficient document retrieval stems not from embedding model performance but from the prior data ingestion pipeline ... optimizing the ingestion pipeline yields much better performance on visually rich document retrieval than optimizing the text embedding model." 結果段：BM25 與 BGE-M3 差異很小，「highlighting the visual information bottleneck」（行 277–278）。
5. 換訓練資料（只用 DocMatix）只掉 2.2，仍領先最接近的基線 12 分以上（行 615–626）。

## 沒寫的事

- 只做**頁面級檢索**，不做答題；要答題還得再接 OCR 或 VLM（Most 2025 指出這點）。
- 學術任務的訓練集與測試同分布（作者承認，行 615–618）；Most 2025 在沒見過的劣化文件上得到相反結果。
- 文字基線是 Unstructured＋Tesseract，不是最新解析工具（Most 2025 批評這點）。
- 儲存成本：每頁 257.5 KB（行 501–504）。

## 對 order 13 的用法

- 反證寫法：「有研究主張跳過解析、直接嵌入頁面影像（ColPali），在它設計的基準上比『解析＋OCR＋圖說』高約 14 分；但換到沒訓練過的劣化掃描檔，OCR 管線反而勝（Most 2025）。對多數知識庫，解析仍是主流，所以要會抽檢。」
- 與 order 13 主張一致的部分：引言自己就說「瓶頸在資料攝取管線，不在 embedding 模型」——跟 Santos 的「資料準備比選工具重要」同方向。
- 由於附錄未讀，不引附錄中的細部數字。
