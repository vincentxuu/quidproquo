# 抽取紀錄：Ouyang et al. (2025) OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations

read_status=full（arXiv v2 正文、補充材料 I–V 全部讀完；補充材料 Fig. S5–S34 是模型輸出對照圖，pdftotext 抽出的是並排文字，讀了圖說與 S24 雙欄、S29 彩色背景兩例的文字內容）

## 書目

- Linke Ouyang、Yuan Qu、Hongbin Zhou、Jiawei Zhu、Rui Zhang、Qunshu Lin、Bin Wang（project lead）等，Conghui He（通訊）。上海 AI Lab、Abaka AI、2077AI。
- CVPR 2025（Santos 2026 參考文獻 [9] 列 pp. 24838–24848；PDF 本身未印會議名）。
- arXiv:2412.07626，v1 2024-12-10、v2 2025-03-25（讀 v2）。資料與程式：https://github.com/opendatalab/OmniDocBench
- 讀取：curl https://arxiv.org/pdf/2412.07626（15,162,227 bytes）→ pdftotext -layout → scratchpad/fulltext/o13-omnidocbench.txt（2,127 行、211,529 bytes）；正文 1–716 全讀、補充材料 717–1000 全讀、1000–2127（圖例文字）讀圖說與兩個例子。
- 同團隊開發 MinerU（受測工具之一）。
- 行號：未標者為全文檔行號；標「補充行 n」者對應全文檔第 713+n 行。

## 研究設計

- 從 20 萬份以上 PDF（Common Crawl、Google、百度、內部資料）以 ResNet-50 特徵＋Faiss 分群抽 6,000 頁，人工平衡後留 **981 頁**、9 類（書、投影片、財報、教科書、考卷、雜誌、學術論文、筆記、報紙）（行 252–269、行 39–41 補充）。
- 標註：19 種版面類別、15 種屬性；20,000+ 區塊級、70,000+ 片段級標註；含閱讀順序（頁首、頁尾、頁腳註除外）（行 309–328）。
- 評估：文字用正規化編輯距離、表格用 TEDS、公式用 CDM、閱讀順序用編輯距離（行 416–434）。

## 可引用結果（數字照原文）

1. 整體（Table 2，行 364–375）：英文整體編輯距離 MinerU 0.15 最好、中文 Qwen2-VL-72B 0.327 最好；幾乎所有方法英文優於中文（行 497）。
2. **頁面類型差很大**（Table 3，行 380–394）：MinerU 在學術論文 0.025、財報 0.033，但筆記 0.984（補充說明：MinerU 把手寫筆記整頁當成圖片，行 46–47 補充）；多數 VLM 在報紙失敗（GPT-4o 0.751、InternVL2 0.903），pipeline 工具較好（MinerU 0.171）（行 467–474）。
3. **多欄與複雜版面**（Table 5，行 417–428；行 483–489）："Across all models, we observe a clear drop in accuracy on multi-column and complex layouts." 補充材料（行 117–125）：InternVL2 單欄好、雙欄三欄差（漏內容、閱讀順序判錯）；MinerU 在複雜版面會「incorrectly merges multiple columns」；Qwen2-VL 與 InternVL2 在投影片、財報傾向把多欄文字合併（行 48–51）。
4. **表格**（Table S1，行 54–69 補充；Table 7）：表格旋轉幾乎讓所有模型崩潰（如 MinerU 旋轉表 TEDS 3.0、GOT 0.0）；多數 VLM 遇合併儲存格變差；pipeline 工具受彩色背景影響。
5. 視覺劣化（Table 4，行 398–415）：模糊掃描、浮水印、彩色背景下 VLM 較穩，pipeline 工具受影響較大。
6. 文字旋轉 270° 幾乎所有模型失敗（Table 8；補充行 154–160）；VLM 會在難辨識頁面「hallucinated information」（補充行 158–159）。
7. VLM 低分主因（補充行 35–37）："1) Missing Content in dense pages; 2) Hallucinations in hard-to-recognize pages"；pipeline 低分主因：特殊頁面（浮水印）穩定性差、少見類型（手寫）泛化差。
8. 公式（Table 9）：CDM GPT-4o 86.8、Mathpix 86.6、UniMERNet 85.0。

## 可引用原句

- 頁首頁尾在評分時被忽略的理由（行 400–414；補充行 168–176）："(1) Headers, footers, page numbers, and page footnotes, which are handled inconsistently by different models." 補充："Some algorithm (e.g., GPT-OCR, Qwen2-VL) tends to remove headers and footers, while others (e.g., GPT4o) prefers to retain them"（Figure S3）。
- 例子（Figure S29，彩色背景題目）：Marker 輸出把選擇題選項順序打亂成「( B. 氧气 C. 二氧化碳 A. 氮气 D . 稀有气体」，並漏掉第 3 題（"Missing option 3"）。

## 沒寫的事

- **完全不碰 RAG**：只量解析輸出與標註的相似度，不量下游答題。InduOCRBench 與 Santos 都拿這點批評它。
- 頁首頁尾、頁碼、頁腳註在評分中被「ignore」——所以 OmniDocBench 分數高，不代表工具有把頁首頁尾正確分出來。這對 order 13「頁首頁尾混入」的壞法是盲區。
- 圖片內容不評分（前處理移除圖片，行 344–351）。

## 與範圍卡／其他來源不一致處

- 任務描述「哪些元素最難：表格、公式、閱讀順序」：原文支持「多欄／複雜版面的閱讀順序」「旋轉表、合併儲存格」「筆記、報紙等少見頁型」較難；但「最難」是依頁型與屬性而變，沒有單一排名。公式其實 GPT-4o、Mathpix 都到 86% 左右。
- 頁數：v2 為 981 頁。Santos 2026（行 153–154）寫 OmniDocBench「1355 pages」，與本文不符——應是之後的 v1.5 擴充版（本次未查證）。文章引頁數要寫明版本。

## 限制

- 中文頁 612 / 981，偏中文；981 頁規模中等。
- 受測版本是 2024 年底（MinerU 0.9.3、Marker 1.2.3），工具更新很快，數字只代表當時。

## 對 order 13 的用法

- 「多欄亂序」「表格（旋轉、合併儲存格）」「掃描與浮水印」「手寫」各自有基準證據；「不同工具對頁首頁尾的處理不一致」直接支持把頁首頁尾列入抽檢項目。
- 用來說明「解析基準分數 ≠ RAG 好壞」時，要配 OHRBench / InduOCRBench；本文本身不量 RAG。
