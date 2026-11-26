# 抽取紀錄：Faysse et al. (2025) ColPali: Efficient Document Retrieval with Vision Language Models

read_status=full（arXiv v6 正文 1–682 與附錄 683–1454 全讀：正文含摘要、引言、相關研究、ViDoRe、架構、訓練、結果、延遲、消融、結論；行 683–1454 是參考文獻與附錄 A–F，2026-10-22 逐段補讀，見文末「附錄補讀」）

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
- 由於附錄未讀，不引附錄中的細部數字。（2026-10-22 已補讀，見下節；此句保留為歷史紀錄）

## 附錄補讀（2026-10-22，行 683–1454）

- 行 683–985：參考文獻。逐筆掃過，沒有正文以外的主張；Unstructured 的 OCR 引 Tesseract（Smith 2007，行 912–915），與「文字基線是 Unstructured＋Tesseract」一致。
- 行 987–1002，A.1 學術資料集：DocVQA（UCSF Industry Documents，人工標註）、InfoVQA（網路資訊圖表，人工標註）、TAT-DQA（財報，金融專家人工標註）、arXivQA（arXiv 圖，**題目由 GPT-4 Vision 合成**）、TabFQuAD（另用 A.2 方法補合成題）。
- 行 1004–1093，A.2 實務資料集（ViDoRe 的 Energy、Government Reports、Healthcare、AI 四主題）：
  - 爬蟲用 GPT-3.5 Turbo 展開子題、SerpAPI 只抓 PDF，檔案雜湊後放進共用 Bloom filter 去重（行 1013–1022）。
  - 每個主題約 100 份文件（行 1023–1026），移除含個資的文件。
  - 每主題隨機抽 10,000 張頁面影像，用 Claude-3 Sonnet 每頁最多生 3 題（行 1027–1029；prompt 在行 1040–1080）。
  - 人工驗證：4 位志工（作者的同事與合作者）逐題篩，每主題留 100 題，每人約 3 小時；過程中沒有人標出個資（行 1085–1093）。
  - 意義：ViDoRe 實務題是 **VLM 看頁面影像生成的合成題再人工篩選**，題目天生偏向「頁面上看得到」的內容，對影像檢索有利。這點正文沒寫得這麼明白，可補進「沒寫的事」第 2 點的限制。
- 行 1096–1118，A.3 訓練集（Table 3）：共 118,695 組，全英文；DocVQA 39,463、InfoVQA 10,074、TATDQA 13,251、arXivQA 10,000、爬來的 PDF 45,940（3,885 個網域）。同一份 PDF 的頁面不會同時出現在訓練與測試（行 1099–1101）——但資料來源與生成方法相同，「同分布」的限制仍在。
- 行 1121–1135，B.1–B.2：PyTorch＋HuggingFace；學習率 5e-5、LoRA r=α=32、總 batch 32、訓練 1 epoch；驗證集是訓練集的 2%。
- 行 1137–1155，B.3 嵌入大小（Table 4，DocVQA 測試集）：BGE-M3 8.60 KB、BM25 dense 3.00 KB、BM25 sparse 1.56±0.51 KB、**ColPali（float16）257.5 KB**；作者說比 BM25 大一個數量級、比 BGE-M3 大兩個數量級，但 pooling 或二值化可降兩個數量級（引 Vespa 部落格與 PLAID）。本紀錄「沒寫的事」寫的 257.5 KB 出處其實是這張表（行 1151）。
- 行 1158–1193，B.4 延遲（Table 5，GCP g2-standard-8＋NVIDIA L4，ViDoRe 測試集隨機 1,000 份文件的每頁平均）：Unstructured 版面偵測 0.81 s＋OCR 2.67 s＋圖說 3.71 s＋頁面編碼 0.03 s＝**7.22 s**；SigLIP 0.12 s；ColPali 0.39 s。注意 7.22 s 是「最高設定＋Claude 圖說」的管線（行 1162），其中圖說就占 3.71 s；只算版面偵測＋OCR 約 3.5 s。引用「7.22 秒 vs 0.39 秒」時要附這個限定。
- 行 1196–1240，B.5 圖說：Claude-3 Sonnet，prompt 要求最多 3,000 字元、「qualitative and not quantitative」（行 1201–1204）。圖說刻意不寫數字，所以「解析＋圖說」管線對要數字的題目本來就吃虧。Figure 4 的圖說文字寫 x 軸「from 1 to 2」（同句又說 over 24 hours；是圖說本身的錯還是 pdftotext 漏字，未對 PDF 影像確認，不引用）。
- 行 1247–1275，C.1 Recall@1（Table 6）：ColPali 平均 72.7；Unstructured＋OCR 55.9（BM25）／57.5（BGE-M3）；＋圖說 55.9／57.2；SigLIP 39.7；Jina-CLIP 12.6、Nomic-vision 8.8。純文字版在 ArxivQ、InfoQ、TabF 沒有分數（「-」）。方向與正文 nDCG@5（81.3 vs 66.1／67.0）一致，差距約 15 分。
- 行 1277–1296，C.2 變體（Table 7，nDCG@5）：ColPali 參考 81.3；Docmatix 訓練 79.1（掉 2.2，與正文一致）；224 解析度 56.5；加 TabFQuAD 訓練 81.7；**ColQwen2（768）86.6**；ColSigLIP 只有 2.5–3.2。
- 行 1306–1321，D 相似度圖：「Kazakhstan」token 對應的區塊相似度高；空白區塊也有高分，作者推測類似 ViT registers。
- 行 1323–1375，E 名詞解釋：SigLIP、PaliGemma（3B，SigLIP＋Gemma-2B）、ColBERT（late interaction、MaxSim）的背景，沒有新數字。
- 行 1386–1454，F ViDoRe 例題：各主題三題範例；Shift 主題是**法文**題目。附錄其實到 F（原紀錄寫 A–E）。
- 與紀錄或文章有無矛盾：**沒有矛盾**。附錄數字（81.3、2.2、257.5 KB、7.22／0.39 s、Recall@1 72.7 vs 55.9–57.5）都和紀錄與 order 13 正文（中文第 31、58 行，英文第 31、58 行）的方向一致；「高了十幾分」（81.3 對 66.1／67.0 ≈ 14–15 分）成立。需要補的限定只有兩點：7.22 秒含圖說；ViDoRe 實務題是 VLM 依頁面影像合成，對影像檢索有利。正文目前沒有引 7.22 秒，第 58 行已寫「在它設計的基準上」，不必改。
