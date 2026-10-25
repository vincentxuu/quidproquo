# 精讀紀錄：運動與膝關節炎（order 18，joints-and-cartilage）

## 來源書目與取得管道

| 代號 | 來源 | 讀取程度 | 管道 |
|---|---|---|---|
| V | Voinier D, White DK. *Walking, Running, and Recreational Sports for Knee Osteoarthritis: An Overview of the Evidence.* Eur J Rheumatol. 2024;11(suppl 1):S21–S31. doi:10.5152/eurjrheum.2022.21046。PMID 35943452，PMC11664837。CC BY-NC | 全文（61,572 字元，含表 1–3、補充方法、參考文獻） | Europe PMC fullTextXML（Groundlane web_fetch，已存檔，python 逐字比對） |
| D | Dhillon J 等. *Effects of Running on the Development of Knee Osteoarthritis: An Updated Systematic Review at Short-Term Follow-up.* Orthop J Sports Med. 2023;11(3). doi:10.1177/23259671231152900。PMID 36875337，PMC9983113。CC BY-NC-ND | 全文（含 Table 1–4） | 同上；輸出直接內嵌在對話，**未存檔，未程式比對**，文章只用數字與轉述 |
| C | Cui X 等. *Association between physical activity and knee osteoarthritis: a comprehensive systematic review and meta-analysis.* J Glob Health. 2025;15:04173. doi:10.7189/jogh.15.04173。PMID 40511516，PMC12163862。CC BY | 全文（不含線上補充文件 Table S1–S2、Figure S1–S11） | 同上；**未存檔，未程式比對** |
| Y | Yan L 等. *Comparative efficacy and safety of exercise modalities in knee osteoarthritis: systematic review and network meta-analysis.* BMJ 2025. doi:10.1136/bmj-2025-085242。PMID 41093618，PMC12522397。CC BY-NC | 全文（53,866 字元；附錄 1–18 未讀） | 同上（已存檔，python 逐字比對） |
| K | Coburn SL 等. *Is running good or bad for your knees?...* Osteoarthritis Cartilage. 2023;31(2):144–157. doi:10.1016/j.joca.2022.09.013。PMID 36402349 | **只讀摘要**（Europe PMC REST core 回傳；isOpenAccess=N、inEPMC=N） | Europe PMC search JSON |

沒讀：Khan 2022、Timmins 2017、Alentorn-Geli 2017、Burfield 2023（皆非開放，只在 V 的轉引裡看到結果）；Petrigna 2022（🟡，未抓）；Weng 2023、Kitagawa 2025（掃描時抓到前段，本篇未精讀）；Fransen 2014/2015 Cochrane（未抓）。

## 可用陳述的逐字引文表（V、Y 已程式比對為 True）

| # | 來源 | 逐字 | 文章用法 |
|---|---|---|---|
| 1 | V 結論／Main Points | "There is consistent evidence that common forms of PA (walking, running, and certain recreational sports) do not increase risk of structural progression of knee OA" | 走路與休閒跑步段，轉述為「沒有關係」 |
| 2 | V | "it was a commonly held belief that engaging in PA-accelerated structural progression of knee OA"（原文連字號有誤植） | 「磨損」說法段，轉述 |
| 3 | V | "practice guidelines for the management of knee OA now recommend PA as a first-line intervention to improve pain and function" | 同上 |
| 4 | V | "few studies examine how PA relates to structural progression of knee OA" | 同上；「後者研究少得多」 |
| 5 | V | "Current evidence only shows that meeting PA guidelines does not worsen knees" | 沒講的段 |
| 6 | V | "although again these relationships may be confounded by risk of knee injury" | 競技運動轉引，需帶「可能受混淆」 |
| 7 | V | "the knee injury still likely acts as the “driving force” behind structural progression" ；肥胖也有同型句（"obesity is likely still the “driving force”"） | 標為作者詮釋 |
| 8 | V | "previous knee injury is a strong, independent risk factor (and often a confounding factor) for developing knee OA (pooled OR = 4.20, 95% CI 3.11-5.66)" | 轉引數字 |
| 9 | V | "Obesity is a strong, independent risk factor for developing knee OA (risk ratio [RR] = 4.55, 95% CI 2.90-7.13)" | 轉引數字 |
| 10 | Y 摘要 | "The safety outcome was reported in a small proportion of studies (40 studies, 18%)" | 安全性 |
| 11 | Y 結果 | "All confidence intervals were wide and crossed the null value (risk ratio 1), indicating substantial imprecision" / "no clear evidence of difference in safety between exercise types and control" | 安全性（正確讀法） |
| 12 | Y 討論 | "None of the exercise interventions resulted in more adverse safety events than the control group, suggesting that exercise therapy is a safe treatment approach" | **作者推論**；比資料強，文章標為作者的結論並說明較準確的讀法 |
| 13 | Y 討論 | "none of the exercise interventions showed clinically meaningful differences compared with the control group at the 24 week follow-up"（MID 0.5） | 長期限制 |
| 14 | Y 結果 | "three quarters of comparisons (557, 76%) were at some concerns, 159 (21%) at high risk, and only 16 (2%) at low risk" | 品質 |
| 15 | Y 方法 | "Trials were excluded if they included patients who had a history of knee surgery or who had knee osteoarthritis and hip osteoarthritis at the same time" | 對象限制（這是納入／排除準則，不是作者列的「限制」） |
| 16 | Y 結果 | "Aerobic exercise probably results in a large reduction in pain at short term follow-up (standardised mean difference −1.10, 95% confidence interval −1.68 to −0.52; moderate certainty)" | 主要結果（文章只寫「很可能大幅減輕，中等確定性」） |

D、C、K 的數字（人數、百分比、RR、CI、I²）直接從工具輸出抄錄，未存檔、未程式比對；文章沒有引用 D、C、K 的英文句子，只有兩處英文檢索詞（Table 3 / Knee Pain、Limitations、“selection bias”），這些詞確實出現在 D 的全文（Table 3 標題為「Knee Pain」，Limitations 段內有 "selection bias"）。

## 各來源的設計、結果與限制

**V（回顧的回顧）。** PubMed 搜尋 exercise ＋ osteoarthritis, knee（MeSH），限回顧、2005–2020、英文；114 篇摘要審查，最後整理 20 篇回顧加 12 篇「根據作者對文獻的熟悉」加入的原始研究。多數是敘述性回顧，表 1 與表 3 多項標註「作者沒有做質性整合」。作者結論：走路、跑步、某些休閒運動不增加膝關節炎結構惡化的風險；肥胖與受傷史是獨立的風險因子。作者自己列出需要更多研究：用活動追蹤器客觀量活動、區分受傷與運動、檢驗 U 型關係（多數研究以低活動量為對照，可能掩蓋 U 型）。**文章只引用 U 型以外的內容；U 型是作者提出的待驗假說，沒寫進文章。**

**D（系統性回顧）。** 17 項研究（6 項 level 2、9 項 level 3、2 項 level 4），7,194 跑者／6,947 不跑者；平均追蹤跑者 55.8 個月、不跑 99.7 個月；平均年齡 56.2 vs 61.6；BMI 26.7 vs 28；男性 58.5%。Modified Coleman 方法學分數平均 63.2 ± 13.9（優 2、良 4、可 6、差 5 篇）。**作者列的限制：** 各研究在跑量、年齡、結果、設計上異質；部分樣本小，5 項沒有對照組；可能有干擾因子與選擇偏差（跑者可能原本關節較健康）；兩組追蹤時間與年齡不同；多數為回溯性，無法評估跑步造成的變化。結論限於「短期」。**注意：** 第一作者群揭露多位作者與骨科器材公司有顧問費關係（A.J.S.、E.C.M.、P.C.M.），文章未提；已記於「要小心的」。

**C（統合分析）。** 14 項觀察性研究（13 世代、1 病例對照），507,696 人、27,412 個新發病例；Newcastle-Ottawa 5–7 分（中位 6.5）。高 vs 低 RR 1.02（0.84–1.23），I² 98.9%；中等 vs 低 0.94（0.84–1.05）；高 vs 中等 1.26（1.17–1.37）；「依國際指引」的高 PA 1.18（1.02–1.35），作者稱證據有限。8 項研究的分組：高 ＞150 分鐘／週、低 ＜30、中 30–150。作者列的限制：部分研究沒把休閒與職業活動納入。結論措辭 "association"。

**Y（網路統合分析）。** 217 項 RCT、15,684 人，檢索到 2024-08。見引文表。有氧運動被排為最佳的機率最高（SUCRA 平均 0.72）；作者的臨床建議（有氧為第一線）是建議，文章未引用。

**K（摘要）。** 24 項研究、446 個膝；跑後即時膝軟骨厚度與體積下降 3.3%–4.9%；T1ρ／T2 下降，最多 13.1%（股骨滑車軟骨）；脛股關節 T2 在 91 分鐘內回到基準；既有軟骨缺損 48 小時內不變。證據確定性「非常低」；三分之一研究低偏差風險。結論：髖軟骨未知；膝的變化小且短暫，「suggesting that a single bout of running is not detrimental to knee cartilage」。

## 要小心的

1. **C 的作者自己寫了與自己結果不一致的句子：** 討論說「Moderate PA is an effective means of preventing knee osteoarthritis」，但中等對低的 RR 是 0.94（0.84–1.05），包含 1。文章**不引用**這句。
2. C 的摘要與內文對分層結果的敘述有混亂（例如「excluding case-control studies 後 6% 增加」），且「高 vs 中等」的比較樣本組成未在正文說明（Figure S9–11 在補充文件）。文章只引三個主要 RR，並明講是作者的解讀。
3. C 的 I² 98.9% 出現在「高 vs 低」；其他比較的 I² 未讀到（在補充文件）。文章只寫「高對低那一項」。
4. V 的所有 RR／OR 都是**轉引**自其他回顧（Driban、Alentorn-Geli、Timmins、Lo 等）；文章標「轉引，沒有回頭讀原始文獻」。V 的 Table 2 中 "Alentorn-Geli 休閒跑者 OR 0.83" 等數字**沒有放進文章**。
5. V 的 Voinier 版本年份：EPMC 首次出版 2022，期刊卷期 2024（suppl 1）；文章引用 2024。
6. Y 的安全性：18% 的研究報告；作者結論 "safe" 比資料強（見引文 11、12）。
7. D 的標題寫 "Effects of ... Development"，但設計為回溯性比較，不能支持因果。
8. K 只讀摘要，所有數字與推論都是作者摘要寫的；Europe PMC 無全文。

## 對本篇的影響

- 範圍縮到**膝**；髖、手指、深蹲、爬樓梯寫成「沒有直接回答」。
- 「磨損」說法用 V 當來源，但不引用 V 對動物研究或機制的敘述。
- 最切題的 Coburn 2023 只讀摘要，在內文與參考資料明標；Khan 2022 與 Timmins 等未讀，不寫。
- 不給運動處方；Y 的有氧第一線建議、V 的步行／跑步量建議（如每週 25 英里）、10,000 步等**都不寫**。
