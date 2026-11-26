# 抽取紀錄：Docling 官方文件＋技術報告（Auer et al. 2024）＋AAAI 2025 版（Livathinos et al. 2025）

read_status=full（官方文件 9 頁全文；技術報告 v5 正文全讀、附錄為輸出示意圖只讀圖說；AAAI 版全文）

## 書目

- 官方文件：https://docling-project.github.io/docling/ （2026-10-22 抓取；PyPI 當日最新版 docling 2.141.0）。讀的頁面：首頁、concepts/architecture、concepts/docling_document、concepts/chunking、concepts/serialization、concepts/confidence_scores、concepts/OCR、faq、usage/heading_levels。curl → 取 `<article>` → pandoc → scratchpad/fulltext/o13-docling-docs.md（1,187 行、69,054 bytes），已讀全部。
- 技術報告：Auer, Lysak, Nassar, Dolfi, Livathinos, … Staar（IBM Research Zurich）。Docling Technical Report, arXiv:2408.09869，v1 2024-08-19 … v5 2024-12-09（讀 v5，封面標 "Version 1.0"）。→ o13-docling-techreport.txt（878 行、132,541 bytes）；正文 1–324 全讀，325–878 為附錄示意圖（pdftotext 抽出的多欄排版亂文，只讀圖說）。
- 更新版：Livathinos, Auer, et al. Docling: An Efficient Open-Source Toolkit for AI-driven Document Conversion, arXiv:2501.17887 v1（2025-01-27），版權頁標 AAAI 2025。→ o13-docling-aaai2025.txt（497 行、57,088 bytes），全讀。
- 性質：工具開發者自述。沒有任何轉換品質的評測數字，只有速度。

## 可引用內容

### 架構與設計
1. 管線（技術報告行 80–89；AAAI 行 183–195）：PDF backend 取程式文字與座標並渲染頁面圖 → 每頁跑版面分析（RT-DETR，DocLayNet 訓練）、表格結構（TableFormer）、選用 OCR → 組裝、修正閱讀順序、配對圖與圖說。
2. **文字不由模型生成**（AAAI 行 109–118）："All text content is taken from the programmatic PDF or transcribed through OCR methods. This design ensures faithful conversion, without the risk of generating false content." 對比：VLM 類工具 "are prone to hallucinations"（AAAI 行 98–102）。
3. 為何不用現成 PDF 函式庫（技術報告行 96–120）：授權限制（pymupdf）、速度，或 "unrecoverable quality issues, such as merged text cells across far-apart text tokens or table columns (pypdfium, PyPDF)"。
4. 頁首頁尾分開存（docs 行 120、146）："Disambiguation between main body and headers, footers (furniture)"；`furniture` 是不屬於本文的節點樹。

### 中介格式會丟資料（直接支持範圍卡「避免中介格式」）
5. AAAI 行 134–139："Docling supports lossless serialization to (and deserialization from) JSON, and lossy export formats such as Markdown and HTML, which, unlike JSON, cannot retain all available meta information."
6. 表格合併儲存格（docs 行 322–334，concepts/serialization）：JSON、HTML、DocTags 保留跨欄跨列；**Markdown "Flattened. Markdown tables have no span syntax, so the serializer writes cell text at the origin position only; all other grid positions covered by the span are rendered as empty cells."**；LaTeX 也攤平。官方建議："If your downstream workflow depends on accurate table structure (e.g. merged header cells), prefer export_to_html() or export_to_dict() over export_to_markdown()."
7. 切塊兩條路（docs concepts/chunking）：先匯出 Markdown 再自己切，或用原生 chunker 直接在 DoclingDocument 上切；HierarchicalChunker 「attaching all relevant document metadata, including headers and captions」；HybridChunker 表格跨塊時預設重複表頭（`repeat_table_header=True`）。

### 「沒報錯」但資訊少了（直接支持自我檢查）
8. **標題階層預設全被壓平**（docs 行 993–995，usage/heading_levels）："Every heading therefore arrives at level 1, so a report whose real structure runs PART I → 1. Definitions → 1.1 Interpretation → (a) comes out as a flat stack of # headings. Everything downstream that leans on the hierarchy loses out too ... hierarchical chunking"。修復功能 "disabled by default, because a wrong level is worse than a missing one"。
9. 靜默跳過（docs 行 1151）："Without them, style inference is skipped silently — no error, just fewer levels."
10. 掃描檔沒有字型資訊（docs heading_levels "Scanned pages and OCR"）："OCR produces no font metadata, so weight and slant are unavailable on scanned documents"。
11. 文字樣式（docs 行 819，FAQ）：粗體、底線等樣式只在 docx、pptx、html 等宣告式格式支援，"Support for PDF is not yet possible."（對照 InduOCRBench 刪除線案例）
12. 圖片遺失（docs 行 909，FAQ）："able to handle embedded WMF images only on Windows platform. If you are on other operating systems, these images will be ignored."
13. 反例（docs 行 531）：OCR 語言沒有模型時會丟例外，"Docling never quietly substitutes a different recognizer"——這一項是「會報錯」的設計。

### 品質訊號
14. 信心分數（docs concepts/confidence_scores，v2.34.0 起）：layout、ocr、parse、table 四項分數與 POOR/FAIR/GOOD/EXCELLENT 等級；用途包含 "Identify documents requiring manual review after the conversion"；**但 `table_score` "(not yet implemented)"**（docs 行 388）——表格這個最容易壞的地方沒有自動分數。

### 效能（唯一有數字的評測）
15. AAAI 版 89 份 PDF、4,008 頁（行 225–237）：x86 CPU 每頁中位數 0.79 秒（5–95 百分位 0.6–16.3 秒）；關 OCR 省約 60% 時間、關表格省 16%（行 313–327）；OCR 是最貴的步驟，EasyOCR x86 每頁 13 秒（行 335–338）。

## 沒寫的事

- 技術報告與 AAAI 版都**沒有品質評測**；AAAI 版 Future Work 說將來會用 DP-Bench、OmniDocBench 做品質比較（行 430–437）。官方 RapidOCR 段落也說 "Docling does not benchmark or recommend one over another -- ... measure it on your own workload"。
- 沒提抽檢流程；信心分數是最接近的東西。

## 與範圍卡不一致處

- 範圍卡「版面分析工具的類型（以 Docling 為例）」：Docling 自己把工具分成兩類——VLM 直接讀頁面影像（會幻覺、要大算力）vs 多個專用模型組成的管線（Docling、Marker、MinerU、Unstructured），文字取自 PDF 或 OCR（AAAI 行 92–120）。可直接用這個二分法。
- Santos 2026 用的是 Docling＋Docling-hierarchical-pdf 外掛；Docling 預設輸出標題全是第 1 層，文章不要寫成「Docling 預設就保留階層」。

## 對 order 13 的用法

- 「表格攤平」的機制來源：Markdown 沒有合併儲存格語法（官方明寫）。
- 「解析沒報錯 ≠ 內容正確」：標題階層預設壓平、樣式推斷靜默跳過、非 Windows 的 WMF 圖被忽略、PDF 的粗體刪除線不支援。
- 抽檢可以從信心等級 POOR/FAIR 的文件優先抽，但表格沒有分數，表格要另外抽。
