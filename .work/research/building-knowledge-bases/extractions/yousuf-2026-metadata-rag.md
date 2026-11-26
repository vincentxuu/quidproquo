# 抽取紀錄：Yousuf et al. (2026) Utilizing Metadata for Better Retrieval-Augmented Generation

read_status=full（arXiv v1 PDF 15 頁全讀，含表 1–3、局限段、參考文獻）

## 書目

- Raquib Bin Yousuf、Shengzhe Xu、Mandar Sharma、Andrew Neeser、Naren Ramakrishnan（Virginia Tech），Chris Latimer（Vectorize.io）。
- arXiv:2601.11863 v1（2026-01-17，cs.IR）。作者頁另有 PDF 檔名 ecir-metadata-2026.pdf（people.cs.vt.edu/naren/papers/），推測為 ECIR 2026；arXiv 版本身沒寫會議名（本紀錄未另查證接受狀態）。
- 讀取：curl https://arxiv.org/pdf/2601.11863 → pdftotext -layout。資料與程式：github.com/raquibvt/RAGMate。
- 全文檔：scratchpad/fulltext/o15-yousuf2026-metadata.txt（703 行，42,726 bytes）。已讀 1–703 全部。

## 研究設計

- 語料 RAGMATE-10K（行 338–352）：5 家美國科技公司（Apple、Alphabet、Adobe、Oracle、Nvidia）共 25 份 10-K，350-token 切塊、50-token overlap（同一句又寫 "non-overlapping"，原文自相矛盾），共 4,490 個 chunk。
- 題目：30 個人寫的模板展開成公司×年份的題目；排除 Apple 後 **120 題測試**。答案由 LLM 限定在目標文件內產生並引用 chunk（半自動標註，行 578–580 自承）。
- metadata（Table 1，行 356–365）：company_name、form_type、section（章節標題，如 "Item 1 - BUSINESS"）、fiscal_year_end、period_of_report、filed_date、exchange_listings、SIC_code。全是**既有的結構化欄位**，不是 LLM 產生。
- 比較方式（行 189–310）：純文字 baseline；metadata-as-text（前綴 prefix／後綴 suffix，序列化成 "company: …; form: …; section: …; year: …"）；dual encoder 融合（unified，α 加權）與 late fusion；LLM 依 schema 改寫查詢（reformulated）。
- 編碼器凍結：text-embedding-3-small、bge-m3（行 379–382）。**沒有測 metadata 過濾**——研究問題明說要把 metadata 當「不只是過濾」的檢索訊號（行 113–115）。

## 可引用結果（Table 2，k=5，行 437–461）

| 方法 | text-embedding-3-small 一般題 Context@5 | 深入題 Context@5 | bge-m3 一般題 | bge-m3 深入題 |
|---|---|---|---|---|
| 無 metadata | 33.33 | 31.67 | 26.67 | 33.33 |
| 後綴 | 48.33 | 53.33 | 33.33 | 45.00 |
| 前綴 | 55.00 | 65.00 | 61.67 | 58.33 |
| unified | 63.33 | 60.00 | 55.00 | 51.67 |
| LLM 改寫查詢 | 41.38 | 38.60 | 25.86 | 26.32 |

- 失敗率（完全沒撈到相關 chunk）：OpenAI 一般題 10.00 → 前綴 3.33；bge-m3 一般題 30.00 → 前綴 3.33。
- 平均首個命中排名：OpenAI 一般題 21.61 → 前綴 10.22 → unified 7.84。
- **LLM 改寫查詢反而讓失敗率上升**：OpenAI 一般題 10.00 → 22.41、bge-m3 30.00 → 34.48（Table 2）；作者只說它 "trail these methods"（行 429）。
- α 掃描（行 430–432）："moderate values (α ≈ 0.3−0.6) work best, confirming that metadata should complement, not dominate, content signals."
- 向量空間（Table 3，行 502–517）：同公司同年份 vs 其他的 AUC 0.625 → +0.315（unified）；Cohen's d 0.45 → 2.25。
- **欄位消融（行 550–554）**："Company and year provide the strongest disambiguating signal: removing them reduces both Title@K and Context@K. In contrast, removing section titles yields only a modest drop in Context@K with no effect on Title@K"。消融只有圖，沒有表格數字。
- 維護成本（行 121–123）：前綴法 "any metadata update requires re-embedding the full index."

## 限制（作者自述＋本紀錄補充）

- 作者（行 570–581）：只用 10-K，刻意挑最容易混淆的語料；答案半自動產生；只測凍結編碼器。
- 補充：120 題、4 家公司（測試時）；沒有報信賴區間或顯著性。改寫查詢的 n 不一致（41.38、22.41 這類非 1/60 倍數，暗示有部分題目被排除，原文沒解釋）。
- 沒測過濾：無法用來支持「過濾會提升或降低召回」。
- 標題路徑只有單層 section；沒有測多層麵包屑。

## 對 order 15 的用法

- 「同一段文字有無來源與日期時檢索的差別」：這篇是最直接的實證——10-K 這種「每年每家公司都長得很像」的語料，把公司與年份寫進 chunk 前面，Context@5 從 33% 到 55%（一般題，OpenAI 編碼器）。
- 修正範圍卡「標題路徑」的分量：在這份語料裡，**文件層級的識別欄（公司、年份）比章節標題重要**；章節標題只幫 chunk 定位。
- 把 metadata 寫進向量的代價：欄位一改就要重 embed 全部。
- 可當反證之一：讓 LLM 依 schema 改寫查詢，失敗率比不加 metadata 還高。
