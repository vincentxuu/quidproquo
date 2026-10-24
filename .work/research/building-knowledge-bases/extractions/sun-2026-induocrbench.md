# 抽取紀錄：Sun et al. (2026) When Good OCR Is Not Enough: Benchmarking OCR Robustness for Retrieval-Augmented Generation（InduOCRBench）

read_status=full（arXiv v1 正文＋附錄 A–D 全部讀完）

## 書目

- Lin Sun（通訊）、wangdexian、Jingang Huang、Linglin Zhang、Change Jia、Zhengwei Cheng、Xiangzheng Zhang。Beijing Qiyuan Technology（信箱 360.cn，即奇虎 360 體系）。
- arXiv:2605.00911 v1，2026-04-29（只有 v1）。致謝提到 reviewers 與 area chair，但 PDF 未印會議名，本次未查證是否已正式收錄。
- 資料與程式：https://github.com/Qihoo360/InduOCRBench
- 讀取：curl https://arxiv.org/pdf/2605.00911（3,720,206 bytes）→ pdftotext -layout → scratchpad/fulltext/o13-induocrbench.txt（663 行、57,396 bytes）；已讀 1–663 全部。

## 研究設計

- 從 12 個產業、1 萬份真實工作流文件中分層抽樣，得 570 份、3,402 頁；超過 20 頁只留前 20 頁（行 86–100、行 561–564）。
- 11 類難題（Table 1，行 101–117）：浮水印、複雜背景、超高解析、手寫、古籍、多欄、跨頁表格、超寬（甘特圖）、超長（收據、手機截圖）、視覺樣式（粗體/顏色/底線/刪除線帶語意）、多字型；另有 Normal 組。
- 標註：Markdown 混 HTML（表格含 rowspan/colspan）與 LaTeX；保留粗體、底線、顏色等樣式；三階段人工品管，抽樣準確率門檻 98%；66% 樣本需要 1–2 輪修正（行 121–150、行 500–553）。
- 10 個 OCR（pipeline：PP-StructureV3、MinerU2；閉源 Doc2X；通用 VLM：GPT-4o、Qwen3-VL-235B、Gemini-2.5 Pro；專用 OCR-VLM：DeepSeek-OCR、HunyuanOCR、MinerU2.5、PaddleOCR-VL）。
- 統一 RAG：OCR Markdown 轉 HTML 依樹狀結構切塊，上限 256 token；BGE-M3 取 top-100、BGE-Rerank-V2-M3 重排取 top-10；GPT-5 生成；RAGAS 的 Answer Accuracy 與 Context Recall，用 GPT-OSS-120B 評分（行 614–663）。

## 可引用結果（數字照原文）

1. 從標準基準換到工業文件，分數普遍大跌（Table 2，行 173–193；行 203–209）：PP-StructureV3 在 OmniDocBench 86.7 → 本基準 60.3（−26.4）；GPT-4o 75.0 → 52.0；PaddleOCR-VL 92.9 → 78.2。
2. 表格與公式掉最多，文字較穩（行 217–237）：HunyuanOCR 文字仍有 86.1，表格（TEDS）從 91.8 掉到 52.5；GPT-4o 表格 37.2。
3. **「OCR 盲點」——OCR 分數高、RAG 低**（行 270–281）：VisualStyle 類 OCR 82.9% 但 RAG 只有 52.8%（差 30.1）。原因：OCR 丟掉刪除線、顏色強調等帶語意的格式。對照組 MultiFont：OCR 97.2、RAG 97.5，字型變化通常不帶語意。
4. 刪除線案例（Figure 1、行 210–238）：合約原文 60 天交期、每日罰款 2,000 美元，「ninety (90)」與「$5,000」被刪除線作廢；OCR 去掉刪除線後變成「ninety (90) sixty (60) days」「$5,000 $2,000 per day」，LLM 反而把矛盾歸咎於「drafting errors」。
5. 版面幾何壞掉最難救（行 283–308）：UltraWide OCR 28.1 / RAG 49.1、UltraLong 23.6 / 42.6；跨頁表格 OCR 40.7 / RAG 63.8（LLM 補回 23.1 點但仍低於版面完整類）。
6. LLM 能補字錯、補不了結構錯（行 309–313、265–276）：浮水印 OCR 80.5 / RAG 90.2、複雜背景 77.4 / 88.7——局部錯字靠上下文冗餘補得回；古籍（非標準閱讀順序）OCR 42.8 / RAG 50.2 是補償的邊界。
7. 失敗位置分三型（行 316–332，以 PaddleOCR-VL 對標準答案）：檢索主導（UltraWide 召回 −21.81、答對 −20.16）；生成敏感（VisualStyle 召回只 −10.56、答對 −41.19）；兩段都壞（多欄 −19.57 / −31.95；跨頁表格 −11.10 / −22.03）。
8. 換檢索器（BM25、Qwen3-8B-Embedding）、換切法（LLM 語意切塊，DeepSeek v3.2），平均落差只從 16.72% 變 16.22%，模式穩定（行 333–339）。
9. **改用 GPT-5 看頁面影像作答沒有解決問題**（行 340–350）：同一份 OCR 檢索輸入下，文字生成 73.54% vs 影像生成 52.92%；即使給標準答案檢索文字，GPT-5 vision 53.97% 仍遠低於 GPT-5 文字 89.76%。唯一例外是 VisualStyle（40.32 → 51.58），但仍差標準答案 7.75。
10. 同一類文件不同 OCR 差很大（行 362–365）：古籍 8.63%（GPT-4o）到 83.45%（HunyuanOCR）；跨頁表格 25.74% 到 74.59%。MinerU2 在古籍 0.1%、Qwen3-VL 87.1%（行 197–199）。

## 可引用原句

- 摘要："high OCR accuracy does not necessarily translate into strong downstream RAG performance: structural and semantic errors can cause substantial retrieval failures even when WER/CER remains low."
- 靜默退化（行 286–289）："High OCR low RAG failures in VisualStyle produce silent degradation invisible to conventional monitoring"

## 沒寫的事

- 「標準答案 100% RAG accuracy uniformly」（行 341–343）：題目由 GPT-5 依標準答案生成（行 594–613；VisualStyle 例外為人工題），所以標準答案拿滿分有循環性，OCR 與標準答案的落差可能被放大。
- 沒給抽檢方法，只給分類學。
- 只測「先 OCR 再文字 RAG」；作者自己列為限制（行 393–400）。

## 與範圍卡不一致處

- 範圍卡「OCR 準確率高不代表 RAG 好（InduOCRBench 2026）」：成立，最強的例子是 VisualStyle 82.9 vs 52.8。但要注意反方向也存在：浮水印、複雜背景類 RAG 高於 OCR（LLM 補償）。寫成「OCR 分數和 RAG 表現對不上，兩個方向都有」更準。
- 內文 VisualStyle RAG 數字不一致：行 273 寫 52.8%，Figure 3 圖說（行 331）寫 53.0%，行 292 又寫差距 30.2。引用時用 52.8 / 差 30.1 並註明約數。

## 限制

- 570 份、偏中文工業文件；作者自述重診斷訊號不重完整性（行 395–396）。
- 評分者是 GPT-OSS-120B；預印本、單一公司團隊。

## 對 order 13 的用法

- 五種壞法中「圖片／格式資訊遺失」「多欄亂序」「表格攤平（跨頁表格斷開）」都有直接案例與數字；刪除線合約是很好的「解析沒報錯但意思反了」例子，可直接支持自我檢查題。
- 反駁「換成 VLM 看圖就好」：同一研究裡 GPT-5 vision 沒有勝過文字（但只是「OCR 檢索＋影像生成」這一種組合）。
