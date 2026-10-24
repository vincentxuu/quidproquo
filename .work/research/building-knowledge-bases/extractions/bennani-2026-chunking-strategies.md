# 抽取紀錄：Bennani & Moslonka (2026) A Systematic Analysis of Chunking Strategies for Reliable Question Answering

read_status=full（arXiv v1 全文，3 頁短文含表 1、限制段、參考文獻全部讀完；ECIR 正式版 Springer 章節未取得全文，只核對書目）

## 書目

- Sofia Bennani（École polytechnique；研究在 Artefact 期間完成）、Charles Moslonka（Artefact Research Center；Université Paris-Saclay MICS）。
- ECIR 2026（48th European Conference on Information Retrieval, Delft），Proceedings Part IV，**Industry Papers** 區，LNCS 16486，pp. 68–73。DOI: 10.1007/978-3-032-21321-1_9（Springer 書目頁經 Exa 檢索核對）。
- 預印本：arXiv:2601.14123 v1（2026-01-20），Comments "3 pages, 2 figures, 1 table, pre-print"。
- 讀取方式：curl https://arxiv.org/pdf/2601.14123（1,288,745 bytes）→ pdftotext -layout → scratchpad/fulltext/o16-bennani2026.txt（207 行、21,988 bytes），已讀 1–207 全部；另以 arXiv HTML 版（Exa 檢索結果全文）交叉核對數字。
- 致謝：BPIFrance ArGiMi 計畫資助。作者單位 Artefact 是顧問公司，研究目的是「standardize our production defaults」（行 40–41）。

## 研究設計

- 語料與題目：Natural Questions short-answer 子集，語料是英文維基百科（行 58–60）。題數沒寫。
- 檢索器：**SPLADE 稀疏檢索**（學習式的稀疏向量，類關鍵字），不是 dense 向量檢索（行 8–20）。不用 reranker（行 56–57）。
- 生成：Ministral-8B-Instruct-2410，T=0.1，提示要求只依上下文作答、不足就輸出 NONE（行 35–40）。
- 「填滿預算」：依排名把塊塞進 C token 為止，避免固定 K 對大小塊不公平（行 17–20）。
- 變數（行 41–44）：切法 Token／Sentence／Semantic（相鄰句 cosine > 0.5 合併，all-MiniLM-L12-v2）／Code；塊大小 S = 50–500（每 50）；overlap O = 0% 或 20%；上下文 C ∈ {500, 1k, 2.5k, 5k, 10k}。
- 指標：BERTScore、Exact Match、None Ratio；問題層級 95% bootstrap CI（行 46–57）。

## 可引用結果（數字照原文）

1. **F1 overlap 無可量測效益**（行 116–125）："Across paired configurations, adding 10–20% overlap did not improve BERTScore or EM (e.g., |ΔBERTScore| ≤ 0.004; EM differences ≤ 0.001)." 成本：重疊比例 r 讓塊數放大 1/(1−r)，r=0.2 → 1.25 倍。建議 "use O = 0 unless you have evidence your retriever benefits from boundary redundancy."
2. **F2 切法排序 sentence ≈ semantic > token ≫ code**（行 127–136）：sentence 與 semantic 在 C ≤ ~5k 統計上打平；token（固定 token 滑動視窗）落後；C > 5k 時 semantic 略佔優。圖 2 右（行 88–113，C=5k、S=300、O=0）BERTScore：Sentence 0.606、Semantic 0.609、Token 0.599、Code 0.578。
3. F3 上下文懸崖（行 138–140 左欄接行 116–125 右欄）：sentence（O=0、S=300）BERTScore 在 0.5k–2.5k 穩定，10k 時相對下降約 4–5%；作者說確切位置依模型而異。
4. F4（行 129–140）：BERTScore 在 ~500 token 最高、EM 在 ~2.5k 最高；None Ratio 從 0.5k 的約 30% 降到 10k 的約 11%，塊越大 NONE 越多。
5. 表 1 預設值（行 144–152）：Overlap 0%；Chunker Sentence；S 150–300；C（QA）~2.5k；C（摘要）~500；C > 5k 考慮 Semantic。

## 可引用原句

- 機制（行 119–121）："with a sentence-aware pipeline and a sparse retriever, boundary spillover rarely changes the top-C content; overlap mostly introduces near-duplicates."
- 外部效度（行 163–167）："our results on Natural Questions are most representative of general text-centric corpora ... these findings should be validated on specialized enterprise domains (e.g., legal or technical documentation)."

## 沒寫的事

- 沒有 dense 向量檢索的結果；overlap 結論的機制解釋明說是「sentence-aware pipeline + sparse retriever」。
- 沒有題數、沒有每個設定的完整數字表，只有兩張圖與 F1–F4 的摘要句；「paired deltas within CIs」沒列哪些配對。
- 沒有測按標題或文件結構切塊（Code 切法是 markdown 結構解析，但 NQ 是純文字，作者自己說只是為了完整性，行 30–33）。
- 沒有非英文語料、沒有企業文件。
- 沒報索引或切塊的實際時間成本，只有塊數放大公式。

## 內部不一致

- 設定段說 overlap 只測 0% 或 20%（行 43），F1 卻寫「adding 10–20% overlap」（行 117）。10% 是否真的測過不明。

## 與範圍卡不一致處

1. 範圍卡「overlap 沒好處（Bennani 2026）」：論文確實這樣寫，但要加限定：**用 SPLADE 稀疏檢索、句子邊界切塊、英文維基百科 NQ 短答題**時，加 20% overlap 量不到差別。不能直接推到 dense 向量檢索或固定 token 切法（overlap 最常用的情境）。
2. 範圍卡把 Qu 與 Bennani 並列成「預設用簡單切法」：Bennani 的「簡單」是**按句切**，而且它發現**固定 token 切法反而落後**（0.599 vs 0.606）。兩篇共同支持的是「不必上語意切塊」，不是「固定 token 長度就好」。
3. 「語意切塊不划算」在 Bennani 是「與 sentence 打平、比較貴」；C > 5k 時 semantic 略好，作者建議那時可考慮。
4. 這是 ECIR 的 industry track 短文（6 頁正式版／3 頁預印本），證據強度低於完整論文；引用時不要寫成「系統性大規模研究」。

## 對 order 16 的用法

- overlap：可寫「兩篇研究都沒量到 overlap 的好處（Qu 只測 1 句、Bennani 用稀疏檢索），而它一定讓索引變大（20% → 1.25 倍塊數）」，再接反證（Chroma 2024、CRUD-RAG 2024）說明 dense 檢索或小塊時可能有幫助，所以要用題庫自己量。
- 切法：「按句或按段切優於硬切 token」可以用 Bennani F2。
