# 抽取紀錄：Nogueira, Silva & Conte 2026, One Size Fits All? An Empirical Comparison of ADR Templates regarding Comprehension, Usability, and Ease of Adoption

read_status=full（arXiv 2604.27333v1 預印本全文，11 頁；標 EASE'26 Glasgow，未與 ACM 正式版比對）

角色：order 8「模板效果」的實證——短模板（Nygard）vs 有選項欄的模板（MADR）。對「替團隊選 ADR 模板」直接有用，也是「欄位越多不一定越好」的證據。

## 書目

- 作者：Fernando Nogueira、Nabson Silva、Tayana Conte（Federal University of Amazonas, Brazil）
- 刊物：EASE 2026（Evaluation and Assessment in Software Engineering），Glasgow；arXiv:2604.27333v1 [cs.SE] 2026-04-30。DOI 欄位在預印本是佔位符。
- 資料與工具：https://github.com/foolnando/ease-one-size-fits-all-adr（未開）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o8-adr-templates-2026.txt（pdftotext 非 layout 模式，1,132 行，62,098 bytes）

## 設計、樣本、比較、量了什麼

- 兩階段（行 118–126、275–279）：
  1. 前兩位作者用 DESMET Feature Analysis 評五個模板（Tyree/Akerman、Nygard、arc42、Y-statements、MADR），選出前兩名。
  2. 受控實驗：33 位大學部軟體工程學生（Group A 17、Group B 16，行 640–641），crossover 設計，兩個決策情境（外部 API 通訊、選 Postgres），間隔一週（行 546–570）。
- 分數組成（行 366–388、Table 2 行 485–535）：Overall Score = 0.15×結構理解（能否辨認 Decision／Context／Consequences 欄）＋0.50×效率與易用（完成時間、查閱說明次數、自評客觀性）＋0.35×採用潛力（0–10 推薦意願）。
- 量的是：填寫一份 ADR 的時間、查閱次數、自評、推薦分數。沒量讀者理解、ADR 長期維護、真實團隊採用。

## 可引用結果（行號指 o8-adr-templates-2026.txt）

1. 專家評分（Table 3，行 744–781）
   - Overall：MADR 0.900、Nygard 0.868、Y-statement 0.779、Tyree/Akerman 0.761、arc42 0.370。
   - 「while templates like arc42 and Tyree/Akerman are structurally complete (FS1 = 0.15), they incur significant efficiency penalties due to their high documentation overhead」（行 717–718）
2. 學生實驗（行 731–799）
   - 「The Wilcoxon signed-rank test revealed a statistically significant difference between the Nygard and MADR templates in terms of Overall Score (W = 84.0, p = 0.002)」（行 731–733）
   - Cliff's δ = 0.6364，95% CI [0.2842, 0.7011]，大效果（行 785–788）；Probability of Superiority 0.8182——「an 81% probability that the Nygard template outperforms MADR in a random paired observation」（行 791–794）
   - 中位數 Overall：Nygard 約 0.8、MADR 約 0.7（行 798–799）
3. 質性發現（行 817–901）
   - Finding 1：「MADR's structural granularity minimizes ambiguity and ensures rationale completeness, although it increases documentation effort and cognitive demand.」（行 830–831）
   - Finding 2：Nygard「straight-to-the-point structure promotes documentation objectivity and clarity」（行 855–856）
   - Finding 3：時間緊選 Nygard、時間多選 MADR（行 885–889）
   - Finding 4：大型專案或對主管報告選 MADR，小專案選 Nygard（行 850–853）
   - 學生引述 P32：「The amount of additional information makes the document feel more cluttered than the other model」（行 839）；P13：MADR「explains the reasons for the decision more clearly」（行 822–823）

## 作者限制（行 938–976）

- 受試者是學生，外推到資深工程師有限（行 972–973）。
- 第一階段由作者自己評分，不是獨立專家（行 957–962）。
- 量表可能捕捉不到細微感受（行 940–943）。

## 沒寫的事

- 正文沒給兩個模板的實際完成時間、查閱次數的原始數字（只有正規化後的合成分數）。
- 沒評 ADR 內容品質（例如有沒有寫出替代方案、理由是否充分）——只評填寫體驗與推薦意願。
- 沒有讀者端（另一個人讀這份 ADR 能否理解決策）的測量。

## 與摘要或常見轉述不一致處

- 「實驗證明 Nygard 比 MADR 好」：分數有 50% 權重給「效率」（時間短、少查說明），35% 給推薦意願。欄位少的模板天生寫得快，所以「Nygard 贏」很大程度是「短的寫得快」的同義反覆；而 MADR 多出的價值（選項、理由完整）正是質性部分說 MADR 較好的地方，卻沒有進分數。轉述時要講清楚：Nygard 贏的是「寫的人的負擔」，不是「ADR 的資訊品質」。
- 專家評分 MADR（0.900）其實高於 Nygard（0.868）；實驗才反過來。轉述只講實驗結果會漏這個翻轉。
- 相關工作段說 Ahmeti et al. 2024「does not specify the ADR template used」（行 248–249）——與 Ahmeti 原文不符：Ahmeti 用 Nygard 格式再加「考慮過的選項」與「標籤」兩節（見 ahmeti-2024-adr-action-research.md）。本篇對前人的轉述不可盡信。
- 標題「One Size Fits All?」的答案是「看情境」，不是「Nygard」。

## 限制（我的判斷）

- 33 人、單一課程、兩個學生已在課堂討論過的決策，情境人工。
- 預印本，尚未比對正式版。

## 讀取紀錄

- 管道：arXiv API 搜尋 abs:"decision records" 找到 → `curl -sL https://arxiv.org/pdf/2604.27333` → 200 PDF（11 頁）→ `pdftotext`（-layout 版雙欄錯位，改用預設模式）。
- 依序讀行 1–450（摘要、§1–3.2、Table 1 前半）→ 450–1132（Table 1–3、§3.3–7、參考文獻）。全文讀過。Figure 1–6 為圖片，只讀到圖說。
