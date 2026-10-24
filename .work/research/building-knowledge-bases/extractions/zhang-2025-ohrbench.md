# 抽取紀錄：Zhang et al. (2025) OCR Hinders RAG: Evaluating the Cascading Impact of OCR on Retrieval-Augmented Generation（OHRBench）

read_status=full（arXiv v4 正文＋補充材料全部讀完；補充材料末段 Fig. S3–S12 是案例圖，只有圖說可讀）

## 書目

- Junyuan Zhang、Qintong Zhang、Bin Wang（共同一作）、Linke Ouyang、Zichen Wen、Ying Li、Ka-Ho Chow、Conghui He（通訊）、Wentao Zhang。上海 AI Lab、北京大學、港大、上海交大、北航。
- arXiv:2412.02592，v1 2024-12-03、v2 2025-03-11、v3 2025-08-16、v4 2025-08-30（讀 v4）。sources.jsonl 原標「ICCV 2025」：PDF 本身未印會議名，本次未另行查證收錄資訊。
- 程式與資料：https://github.com/opendatalab/OHR-Bench
- 讀取：curl https://arxiv.org/pdf/2412.02592（13,552,746 bytes）→ pdftotext -layout → scratchpad/fulltext/o13-ohrbench.txt（1,318 行、128,728 bytes）；已讀 1–1318 全部。
- 同團隊也做 OmniDocBench 與 MinerU（利益相關：MinerU 是受測工具之一）。

## 研究設計

- 1,261 份 PDF、8,561 頁、7 個領域（教科書、法律、金融、報紙、手冊、學術、行政），中英文；含手寫、掃描、扭曲、多欄等（行 268–273；Table S1 行 734–743）。
- 標準答案：先用 Mathpix 預標，再由作者人工逐頁修正（行 276–281、行 751–760）。
- 8,498 題（由 15,317 題候選篩出），GPT-4o 依「文字、表格、公式、圖表、閱讀順序」五種證據來源生題，再經 LLM 與人工過濾（行 284–321、行 838–842）。證據分布：文字 41.5%、表格 27.8%、公式 14.9%、圖表 9.0%、閱讀順序 8.1%（Table 1，行 237–244）。
- 兩種 OCR 雜訊（行 332–336、309–320）：**語意雜訊**（辨識錯字、錯結構）與**格式雜訊**（粗體、斜體、LaTeX 空白指令、Markdown/LaTeX/HTML 表示法不一致）。以擾動產生輕、中、重三級。
- 檢索 top-2、塊 1024 無重疊；檢索器 BGE-M3、BM25；生成 Qwen2-7B/72B、Llama3.1-8B（行 337–364）。

## 可引用結果（數字照原文）

1. 現有 OCR 都比標準答案差（Table 2，行 368–379）：端到端 F1 標準答案 36.1；最好的 Qwen2.5-VL-72B 31.1、MinerU 30.0、Marker 29.5、GOT 24.6、Nougat 14.5。作者：「Even the best solutions experience a 14% (5 F1-score) drop in the overall stage evaluation」（行 399–401）。
2. **編輯距離（OCR 準確率）和 RAG 表現對不上**（行 404–411）："standard OCR metrics like edit distance do not always align with RAG performance. For example, while MinerU and Qwen2.5-VL-72B exhibit lower edit distances compared to Marker, they do not consistently achieve better performance across all metrics." 具體：MinerU 編輯距離 0.24 優於 Marker 0.28，但檢索 50.1 < Marker 56.6。
3. 商用 Azure OCR（Table S5，行 989–1015）：編輯距離 0.17 全場最好；配 Qwen2-7B 端到端最好，但配 Llama3.1-8B 反而比 MinerU 還差（24.0 vs 28.5），作者人工檢查認為是 Azure 輸出的自訂格式標籤干擾生成。
4. 語意雜訊從輕到重（rnoise 0 → >0.6），多數檢索器與 LLM 掉近 50%；稠密檢索沒比 BM25 更耐（行 452–459）。
5. 格式雜訊主要傷表格、公式、圖表題：檢索最多掉 12.7%（BGE-M3）、生成 9.1%（Llama3.1-8B）；大模型較耐，只掉 7%（行 440–449）。
6. 表格格式（行 513–526，Fig. 4）：HTML 表格檢索最差；Markdown 生成較差，因為「the lack of support for merging cells」。
7. 閱讀順序：VLM 與端到端 OCR 合併段落很差，閱讀順序題端到端 F1 只有 8.8；pipeline 式工具接近標準答案（行 388–398）。
8. 真實 OCR 輸出中的雜訊比例（Table S3，行 924–930）：約 130 token 的區塊裡，MinerU 文字區塊 40.3%、Qwen2.5-VL 31.6% 有文字或結構錯誤。
9. 人改寫題目（Sim2Real，行 944–953）：隨機 100 題改寫後分數下降，但 OCR 間的排序不變。
10. 視覺 RAG 對照（Table S4，行 955–966）：VisRAG 在表格、圖表題有競爭力，但文字與閱讀順序題差（高解析報紙）。

## 可引用原句

- 摘要結論："none is competent for constructing high-quality knowledge bases for RAG systems."
- 格式雜訊不影響語意卻仍有害（行 313–318）："Although irrelevant to semantics, this noise complicates information integration for both retrievers and LLMs."

## 沒寫的事

- 標準答案本身端到端也只有 36.1 F1、閱讀順序題 18.7（Table 2）——基準本身很難，絕對分數不能直接拿來說「RAG 只答對三成」。
- 沒給「怎麼抽檢」；只量自動指標。
- 題目由 GPT-4o 從標準答案頁生成，與真實使用者問法有落差（作者自己做了 100 題改寫測試）。

## 與範圍卡不一致處

- 範圍卡「OCR 準確率高不代表 RAG 好（OHRBench 2025）」：成立，但原文措辭是「不一定一致」（do not always align），例子是 MinerU vs Marker、Azure 配 Llama。寫「不一定」，不寫「無關」。
- 年份：v1 是 2024-12，現行 v4 是 2025-08；寫 2025 可以，但 arXiv 編號是 2412。

## 限制

- 雜訊是合成擾動（雖有盲測校準，行 349–356）；中英文為主。
- top-2 檢索、1024 塊，設定偏嚴，放大 OCR 差異。
- 作者團隊開發 MinerU。

## 對 order 13 的用法

- 「OCR 準確率高不等於 RAG 好」主證據；「表格轉成 Markdown 會失去合併儲存格」；「格式雜訊（粗體、表示法不一致）也會傷檢索」；「多欄閱讀順序是 VLM 類工具的弱點」。
