# 抽取紀錄：Karakurt & Akbulut (2026) RAG and LLMs for Enterprise Knowledge Management and Document Automation: A Systematic Literature Review

read_status=full（MDPI HTML 全文經 Exa web_fetch 取得，正文到參考文獻前全部讀完；表格與圖為圖片，未取得內容）

## 書目

- Ehlullah Karakurt、Akhan Akbulut，Istanbul Kültür University。
- Applied Sciences 16(1), 368。Received 2025-11-26、Revised 2025-12-15、Accepted 2025-12-16、Published 2025-12-29（期號屬 2026）。開放取用。https://www.mdpi.com/2076-3417/16/1/368 ；DOI 10.3390/app16010368。
- 讀取方式與全文檔（scratchpad/fulltext/）：
  - curl（HTML 與 /pdf）皆 403（MDPI 擋）。
  - Exa web_fetch（maxCharacters 200000）成功，100,300 字元 → o11-karakurt2026.md（787 行、100,810 bytes）。已讀 1–454（標題到 Abbreviations，正文全部）；455–787 為參考文獻，未逐條讀。
  - Table 1–13 與 Figure 1–14 在抓取結果中只有標題，沒有內容（圖片或動態表格）。

## 研究設計

- 系統性文獻回顧。六個資料庫（IEEE Xplore、ACM DL、ScienceDirect、SpringerLink、Wiley、Google Scholar），2015–2025，截止 2025-06-15。>500 篇候選 → 63 篇主要研究（55 篇來自 Google Scholar）。8 題品質評估，滿分 16，<10 分剔除。九個研究問題（平台、資料集、ML 範式、架構、評估指標、驗證方式、軟體指標、最佳組態、挑戰）。

## 可引用結果（行號為 o11-karakurt2026.md）

1. 評估指標（行 260，4.5 節）：分類型指標 80.5%；Recall@K/Precision@K 72.7%；ROUGE/BLEU 44.2%；"only 19.5% of studies included human judgments, and just 15.6% measured tangible business impact outcomes"。
2. 驗證方式（行 264）：k-fold 93.6%（作者說多用於檢索與輔助分類）；hold-out 26%；"Only 13% of the articles reported real world case studies or field trials deploying RAG + LLM prototypes in live corporate environments"。
3. 實驗室到市場的落差（行 314）：實地試驗只占 12.7%，其中 80% 有量業務影響。
4. "Strict RAG"（行 356）：高風險文件需在檢索分數低於門檻時輸出 "I don't know"——"a behavior rarely optimized in standard academic benchmarks like TruthfulQA"。
5. 資料來源（行 208–212）：54.5% 用公開 GitHub 資料；學術基準 13.0%；自建產業語料 16.9%；私有企業文件 15.6%。

## 嚴重的品質問題（本紀錄自行核算）

1. 百分比的分母不是 63。以 n=77 換算幾乎全部是整數（66.2%→51、19.5%→15、10.4%→8、3.9%→3、80.5%→62、15.6%→12、72.7%→56、44.2%→34、54.5%→42、13.0%→10、16.9%→13、92.2%→71）；以 n=63 換算都不是整數。文中卻一再寫 "across the 63 reviewed studies"。
2. 同一數字前後不一：業務影響 15.6%（行 260、346）vs 15.9%（行 312、398）；實地試驗 13%（行 264）vs 12.7%（行 314、398）；監督式 92.2%（行 224）vs 92.1%（行 396）；非監督 3.9%（行 218）vs 4.8%（行 396）；自建語料 16.9% vs 17.4%；私有語料 15.6% vs 15.9%；幻覺 48.1%（行 348）vs 47.6%（行 400）；隱私 37.7% vs 38.1%。
3. 指標類別與企業 RAG 不太相干：「object oriented metrics 31.7%」「defect prediction」「PROMISE, NASA」資料集、k-fold 93.6%，像是從軟體缺陷預測類回顧沿用的框架。
4. "RAG Sequence 46.8% / RAG Token 36.4%"：RAG-Sequence/Token 是 Lewis et al. 2020 的特定模型變體，企業研究大多不這樣分類，數字可信度低。

## 沒寫的事

- 沒有題庫或測試集怎麼建、題數、不可回答題的任何資料。對 order 11 的主題只提供「很少人用人工評估、很少人上線實測」這一層背景。

## 與摘要或先前紀錄不一致處

- 摘要說 "63.6% of implementations utilize GPT based models"；正文找不到 63.6% 的出處（可能在未取得的 Table 9/12）。
- 摘要 "fewer than 15% of studies address real-time integration challenges"；正文對應數字不明確（13%/12.7% 是實地試驗，不是即時整合）。

## 對 order 11 的用法

- 建議不引用或只輕引。若要引「只有約兩成研究做人工評估、一成多做實地試驗」，必須註明「該回顧的百分比分母不一致」，或改找品質較好的來源。不適合當主證據。
