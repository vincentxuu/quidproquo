# 精讀紀錄：order 11 動作學習（Czyż 2024 保留、Czyż 2024 遷移、Tassignon 2021、Hassar 2026）

取得管道：Groundlane `web_fetch` 讀 Europe PMC `fullTextXML`（curl 連外被擋）。全文以 `extract=full` 取回，單次輸出上限 10 萬字元。引文已用 python 對取回全文做空白正規化後逐字比對，皆吻合（見 `.work/motor-learning/evidence.md`）。

## 規劃表候選的處理

- Hassar 2026（PMID 42480681，DOI 10.1016/j.neubiorev.2026.106886）：Europe PMC 標非開放（isOpenAccess N、inPMC N），doi.org 與出版社頁回 CAPTCHA。**只讀到 Europe PMC 的摘要**。文章只引摘要的一句，並標明「僅讀摘要」。
- Tassignon 2021（PMID 34025487，PMC8138164）：開放全文，**全文讀完**（取回 10 萬字元含參考文獻前段，討論、限制、結論都在內）。
- 規劃表原寫「動作控制教科書付費」：scan/G 與 research-note 都記沒有開放授權的動作控制教科書。本篇沒有用 OpenStax，因此文末不需 CC BY-NC-SA 說明。

## 補充來源（用 Europe PMC 搜尋題名關鍵字找到，OPEN_ACCESS:y）

### A. Czyż et al. 2024，保留（Sci Rep 14:15, PMC11237090，PMID 38987617）
- 書目：Czyż SH, Wójcik AM, Solarská P, Kiper P. *High contextual interference improves retention in motor learning: systematic review and meta-analysis.* Sci Rep 2024. DOI 10.1038/s41598-024-65753-3。CC BY 4.0。
- 讀取：取回 10 萬字元（truncated: true），讀了摘要、引言、方法、結果（統合分析各段）、討論、限制、結論、利益聲明。**沒讀：** 系統性回顧段（立即保留 5 項研究）、表 1 後半（只到第 23 筆）、表 2 逐筆、參考文獻、附錄（OSF）。
- 設計：統合分析，PROSPERO CRD42021228267；納入 54 項（59 項進系統性回顧）、2,068 人、194 個效果量；只算練習結束 24 小時以上的保留測驗；三層混合模型加平均效果量的隨機效應模型兩種。品質工具 EPHPP。

| 內容 | 原文／數字 |
|---|---|
| Battig 的觀察 | "random practice condition hinders performance during acquisition, although it facilitates retention and transfer"（原文為 "Battig noted that random practice condition hinders ..."） |
| 整體 | 三層模型 SMD = 0.63 (95% CI 0.33, 0.93)；去掉 10 個離群值 SMD = 0.43 (0.19, 0.67)；平均效果量模型 0.71 (0.41, 1.01) |
| 實驗室 vs 實際場景 | 實驗室 n=30、SMD 0.92 (0.48, 1.36)；實際 n=24、SMD 0.23 (−0.16, 0.62, p=0.24)；移除三個結果後實際場景 −0.01 |
| 年齡（三層） | 兒童青少年 0.02 (−0.90, 0.94)；成人 0.63 (0.30, 0.96)；60 歲以上 1.45 (0.55, 2.35)；moderator 檢定 F(2,189)=1.69, p=0.19，不顯著 |
| 年齡與場景糾在一起 | "all included experiments with older adults' participation were performed in a laboratory setting"；青少年只有一項在實驗室，其餘（400 名青少年）在實際場景 |
| 品質 | 54 項中只有 3 項中等或高品質；"Unfortunately, studies on the CI effect are of poor quality." |
| 異質性 | 總 I² = 90%（整體三層模型） |
| 作者結論 | "The Ci effect is a robust phenomenon in motor learning." 但主要建立在成人與長者的實驗室研究；"high CI does not benefit retention in young participants. It does in adults and older adults." |
| 拆成兩篇 | "the review has been split into two consecutive papers: retention and transfer" |
| 作者對 Ammar 2023 的批評 | 指其資料庫選擇不佳、未預先註冊，稱「不可靠」；本篇未讀 Ammar 原文 |

### 要小心的（A）
1. 文中有內部不一致：成人三層模型 CI 0.30–0.96（顯著），但討論寫「三層模型中成人差異不顯著」；表內 p = 0.54 疑為筆誤。文章只引效果量，不引這個 p。
2. 討論說「實際場景只有兒童（除一項）」與表 1 中成人實際場景研究（如籃球、高爾夫）不一致。文章只用「60 歲以上全在實驗室、青少年幾乎都在實際場景」這兩句（原文有明確支持）。
3. 作者自己做的分析，結論偏向支持 CI；品質低、異質性高；同一團隊的另一篇遷移回顧共用註冊號。

### B. Czyż et al. 2024，遷移（Front Psychol 15:1377122, PMC11349744，PMID 39205981）
- DOI 10.3389/fpsyg.2024.1377122。CC BY。取回 69,813 字元，truncated: false。讀了摘要、引言、結果（品質、實驗室／實際場景描述）、討論、限制。**沒讀：** 補充表與逐項效果量圖。
- 數字：34 項研究、1,421 人、86 個效果量；整體 SMD 0.55；實驗室 0.75（顯著）、實際 0.34（不顯著）；成人 0.54、60 歲以上 1.28、年輕 0.12（不顯著）。
- "None of the included studies was assessed as strong."；兩篇中等；"Retention is a good indicator of learning, whereas transfer is a good indicator of adaptability"（原文後接 Magill and Anderson 2021）。
- 任務清單（文中列舉）：排球、高爾夫、網球、曲棍球、投擲飛鏢、單腳跳、籃球、棒球、投擲、Pawlata roll、步槍射擊、腹腔鏡、書寫、Wii-Fit 平衡、按鍵、追蹤、定位。無攀岩。
- 限制（作者列）：多個效果量視為獨立可能膨脹顯著性；未能取得 Brady 2004 所有結果；可做更細的 PICO。

### C. Tassignon et al. 2021（Front Psychol 12:533033, PMC8138164，PMID 34025487）
- DOI 10.3389/fpsyg.2021.533033。CC BY。全文讀完（含表 1）。
- 設計：系統性回顧加「探索性」統合分析；27 項研究、31 個實驗（量化：學習階段 23 項／27 個實驗，保留 12 個實驗）；PubMed、Web of Science、Google Scholar 搜到 2020-02-03；Cochrane 偏誤工具，整體偏誤風險高。
- 數字：摘要 acquisition d = 0.26 [0.10, 0.42]、retention d = 0.61 [0.30, 0.91]；結果段 acquisition d = 0.27 [0.12, 0.42]（摘要與結果段差 0.01）；異質性 I² 77%（摘要）／78%（討論）、79%。文章用摘要的數字。
- DL 的定義："practicing a movement needs to be done in many varieties and thus no exact repetition, and without corrective feedback on the movement pattern"。
- 作者結論："inferences about the effectiveness of DL would be premature"；"The results of this meta-analysis do not allow for strong recommendations in favor of a specific motor learning method toward trainers or clinicians."；與 SL、CtIt 比較"scarce and inconclusive evidence"。
- 技術性技巧子群組：「多數實驗來自同一研究團隊」（討論）。可能的發表偏誤：作者提到許多未發表摘要。
- 我自己的讀法（非作者結論，文章已標示）：表 1 中許多實驗 DL 組 "feedback: no"、對照組 "feedback: yes, corrective instructions"。作者在討論另兩項 Beckmann 2006 vs Hossner 2016 的差異時說「回饋與示範的差別可能有貢獻」。

### D. Hassar et al. 2026（僅摘要）
- 摘要："Fatigue does not uniformly impair motor learning. Local neuromuscular fatigue appears most likely to disrupt acquisition and sometimes retention"；38 篇文章、43 個實驗；練習階段 28/43（65.1%）有不利影響。文章只引「疲勞不一律妨礙學習，局部肌肉疲勞最可能干擾練習階段」，不引數字。方法與結果正文沒讀。

## 對本篇的影響
- 聚焦「練習怎麼排」這一個問題（有可讀的免費全文系統性回顧），不寫神經機制、回饋、注意焦點。
- 一萬小時、肌肉記憶：在我查的範圍內沒有可讀的免費來源，文章明講不驗證。
