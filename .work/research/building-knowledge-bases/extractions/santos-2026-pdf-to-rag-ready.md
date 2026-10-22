# 抽取紀錄：Santos et al. (2026) From PDF to RAG-Ready: Evaluating Document Conversion Frameworks for Domain-Specific Question Answering

read_status=full（arXiv v2 全文，即 MDPI 正式版排版；第 1–27 頁含附錄 A、B 全部讀完）

## 書目

- José Guilherme Marques dos Santos、Ricardo Yang（共同一作）、Rui Humberto Pereira、Alexandre Sousa、Brígida Mónica Faria、Henrique Lopes-Cardoso、José Duarte、José Luís Reis、Luís Paulo Reis、Pedro Pimenta、José Paulo Marques dos Santos（通訊）。Porto 大學、Maia 大學、LIACC。
- 正式版：Applied Sciences 2026, 16, 5069（MDPI，open access）。Received 2026-04-02、Revised 04-26、Accepted 05-16、Published 05-19。DOI: https://doi.org/10.3390/app16105069
- 預印本：arXiv:2604.04948，v1 2026-03-30、v2 2026-05-25（v2 = 期刊版 PDF）。
- 讀取：curl https://arxiv.org/pdf/2604.04948（1,188,556 bytes，v2）→ pdftotext -layout → scratchpad/fulltext/o13-santos2026.txt（1,606 行、147,866 bytes）；已讀 1–1606 全部。
- 致謝段（行 1366–1369）：作者自承用 Claude Opus 4.6 起草部分章節。
- 下文行號皆指 o13-santos2026.txt。

## 研究設計

- 語料：葡萄牙陸軍人事司令部的 36 份公開 PDF，1,706 頁、491,562 字，全為歐洲葡萄牙文（行 371–374，Table 1）。94.4%（34/36）含表格、常有合併儲存格；44.4% 含表單欄位；4,198 張圖其中 1,123 張不重複（行 389–411）。至少 8 種 PDF 產生工具（行 419–421）。
- 題庫：研究團隊手寫 50 題，含表格題、PDFLoader 已知會讀錯的段落、需章節階層的題、靠圖片作答的題（行 507–518）。
- 固定設定（行 521–534）：gpt-4o-mini、text-embedding-3-small、塊上限 1000 字元＋重疊 200、**K = 200**（故意取大，讓檢索不漏，差異主要反映轉換與索引品質）。
- 評分：LLM-as-judge 0–100，每個設定跑 50 輪；Wilcoxon 檢定＋Cohen's d（行 537–573）。
- 21 個設定：PDFLoader（下限）、MinerU Pipeline、MinerU VLM、手工 Markdown（上限，K=200/50/20/5）、Docling、DeepSeek OCR；Marker 因雲端版有隱私疑慮、本地版效果差而排除（行 169–173、653–654）。

## 可引用結果（數字照原文）

1. 總表（Table 4，行 675–695）：PDFLoader 86.2；MinerU 81.5–84.0；手工 Markdown K=200 91.3、K=50 92.9、K=20 87.6、K=5 78.4；Docling 遞迴切 84.7、Docling 階層切＋麵包屑 91.2、再加 VLM 圖片描述 94.1；DeepSeek OCR 79.1。
2. **只換轉換工具、都用遞迴切時，最陽春的 PDFLoader 反而最高**（行 763–768）：PDFLoader 86.2 > Docling 84.7 > MinerU 82.8，差異皆顯著。作者解釋：結構資訊沒被切塊用上，中介 Markdown 的轉換成本就沒有回報（行 1002–1011）。
3. **同一份 Docling 輸出，從遞迴切換成階層切＋麵包屑：84.7 → 91.2，+6.5 個百分點**，是全實驗最大的單一因素（行 807–813）。加 VLM 圖片描述再 +2.9 到 94.1（行 814–818）。
4. **表格題（9 題）**（Table 6，行 879–887；行 890–898）：PDFLoader 70.1、MinerU 69.5、Docling 遞迴切 66.6；Docling 階層切 99.8、手工 99.9、Docling＋圖 99.5。「The 33-percentage-point gain from recursive to hierarchical splitting within Docling on table-dependent questions (66.6% → 99.8%) far exceeds the corresponding gains on the other categories (0.8 to 1.3 pp).」
5. 清洗轉換（行 775–805）：在 MinerU 上單獨加 HTML 表格轉換、LaTeX 轉換、字型或 LLM 重建階層，各自變動都 < 1 個百分點；三種疊加（HTML＋LaTeX＋字型重建）反而掉到 81.5，是 MinerU 最差。
6. K 值（行 820–836）：手工 Markdown 從 K=5 到 K=50 +14.5；K=50 到 200 反而 −1.5。
7. 非英文字元（行 140–145、1181–1190）：葡文「ç」常被辨識錯，「caça」（獵物）變「caca」（糞便）；MinerU VLM 版把 promoção 讀成 promoçao 等，直接打壞檢索；MinerU VLM 版 36 份中 12 份當掉（行 853–857）。
8. GraphRAG 探索：82%（去重後 81%），低於 PDFLoader；建圖在 DGX Spark 上跑 10 小時以上（行 925–957）。
9. 結論句（行 244–246）："enriching the metadata and, especially, applying hierarchy-aware chunking turned out to matter more than which conversion tool or framework was used."；4.2 節標題 "Metadata and Splitting Matter More than the Framework"（行 1058）。

## 可引用原句

- Docling 的優勢不在抽字（行 1009–1011）："The advantage of Docling lies not in better text extraction per se but in its ability to produce well-structured Markdown that downstream splitting and metadata enrichment can exploit"
- 解析指標與 RAG 脫鉤（行 158–165）："a conversion tool might score well on text-fidelity metrics ... Yet, it could produce a Markdown file that, once chunked and embedded, may fail to retrieve the correct passages ... The reverse situation may also be a possibility."
- Docling 的限制（Table 3，行 483–488）："Sometimes mistakes the hierarchy of headings, which requires additional visual checking"——工具最好的一組，作者仍要人眼抽檢標題階層。

## 沒寫的事

- 「階層切塊」與「麵包屑 metadata」在 config 16→19 是同時打開的（Table 4 的 Splitting 與 Hier. Meta 一起變），**沒有拆開量**。所以「metadata 與階層切塊」只能當一個組合因素講，不能說 metadata 單獨貢獻多少。
- 階層切塊只對 Docling 與手工 Markdown 完整支援（行 338–340）；MinerU、DeepSeek 沒有跑階層切，所以「切法比工具重要」的比較其實只在 Docling 內部做。
- Docling 的階層來自 Docling-hierarchical-pdf 這個外掛（Table 3，行 481–482），不是 Docling 預設輸出（對照 Docling 官方文件：預設所有標題都是第 1 層）。
- 沒量解析本身的錯誤率（沒有逐頁對照原檔），只量下游答對率。
- 只有一個 LLM、一個 embedding、塊大小固定（行 1225–1244）。

## 與摘要或範圍卡不一致處

1. 範圍卡「表格題兩種切法差 33 個百分點」：數字正確（66.6 → 99.8 = 33.2），但要補三個限定：只有 **9 題**；比的是 **Docling 內部**遞迴切 vs 階層切＋麵包屑；而且 PDFLoader 在**階層題**反而最高（99.7，行 883），階層切的 Docling 只有 88.8——作者沒討論這個反向結果。
2. 範圍卡「metadata 與階層切塊貢獻大於轉換工具」：作者確實這樣下結論，但證據是「Docling 階層切 +6.5」對比「Docling vs PDFLoader 都用遞迴切只差 1.5、還是 PDFLoader 贏」。最穩的寫法：「同一份轉換結果換切法，差距比換工具大」。
3. 摘要「21 pipeline configurations」與內文「19 configurations」（行 174、643）混用；結論說「all pairwise differences are statistically significant」（行 1293–1294），但 3.1 節自己列了一個不顯著（K=50 vs K=5，p=0.090，行 711–712）。
4. Discussion 說三種遞迴切的表格題 "all score below 70.1%"（行 1050–1051），但 PDFLoader 就是 70.1，應為「≤」。
5. Table 5 與內文的 p 值不一致（如 config 16 vs 19：表 7.6×10⁻¹⁰，內文 p < 10⁻³⁴，行 747、811）。不影響方向，但引用時用表上數字或不引 p 值。
6. 「超越手工整理」（94.1 > 91.3）作者歸因於手工 Markdown 沒寫圖片描述（行 1101–1103）——不是自動化比人準，而是人工版少了一類資訊；且手工版由研究團隊自己做，有偏誤風險（行 1259–1263）。

## 限制

- 單一語料（36 份葡文行政文件）、50 題、LLM-as-judge；作者承認 PDFLoader 偏高可能是文件少（行 1206–1212）。
- K=200 × 1000 字元 ≈ 最多 20 萬字元進 context，與一般部署差很多。
- 表格密度高（94.4%），作者自己說表格少的語料，階層切優勢可能變小（行 1094–1095）。

## 對 order 13 的用法

- 可支持：「解析工具不是最大變因，解析後保留的結構有沒有被切塊用上才是」；「表格最容易因切法壞掉」；「非英文字元錯誤會直接打壞檢索」；「即使最好的工具，標題階層仍要人眼檢查」（直接支持抽檢）。
- 不要用來做工具排名（範圍卡也說不講）；Marker 未納入、MinerU/DeepSeek 沒跑階層切，排名不公平。
