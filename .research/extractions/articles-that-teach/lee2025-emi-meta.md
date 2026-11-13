# 抽取紀錄：Lee, Rose, Macaro & Lee 2025，System（EMI 在高等教育的多層次統合分析）

- 書目：Hansol Lee、Heath Rose、Ernesto Macaro、Jang Ho Lee（2025）. Effectiveness of EMI in higher education: A multi-level meta-analysis. *System*, 133, 103755. https://doi.org/10.1016/j.system.2025.103755
  - 作者名：原文檔首頁的引用格式只寫姓與縮寫（Lee, H., Rose, H., Macaro, E., & Lee, J. H.）；PDF 中繼資料 Author 欄是「Hansol Lee」。其餘三位的全名取自 Oxford ORA 紀錄頁的作者欄，**原文檔內沒有作者全名**，刊出版首頁沒有對到（ScienceDirect 付費）。
- **題名不一致**：原文檔首頁的題名是「Impact of English Medium Instruction in Higher Education: A Multi-Level Meta-Analysis」（第 5–7 行），底下的引用格式（第 13–15 行）寫的是刊出題名「Effectiveness of EMI in higher education: A multi-level meta-analysis」。引用時用刊出題名。
- 原文檔：`.research/raw/learning-content/q5/emi-meta2025.txt`（1,851 行、79,008 位元組）；PDF `q5/emi-meta2025.pdf`（45 頁，Word 轉出，2025-07-24 建檔）
- 取得網址：https://ora.ox.ac.uk/objects/uuid:8b4c6bbc-7436-43df-8ba4-fa56fd888e97/files/szg64tp515（Oxford 大學機構典藏 ORA）。2026-10-14 重抓一次，與本機 PDF 逐位元組相同（`cmp` 無差異）。紀錄頁註明：「The author accepted manuscript (AAM) of this paper has been made available under the University of Oxford's Open Access Publications Policy, and a CC BY public copyright licence has been applied.」→ 作者機構合法公開。
- 版本：**作者接受稿（AAM）**，不是刊出版。下面所有數字都出自作者稿；刊出版沒對到，排版與數字可能有出入。
- 讀取日期：2026-10-14
- 供 order 24 使用（清單 F 第 24#2 列）

## 研究設計

- 類型：多層次統合分析（variance-known model，效果量巢套在樣本內；Hox 等）。STATA 16；出版偏誤另用 R metafor（第 694–761 行）。
- 搜尋：ERIC（EBSCO）、ProQuest Social Science Premium、Scopus、Web of Science；關鍵字只套在摘要欄：[EMI OR CLIL] AND [English] AND ["higher education"] AND [randomized OR "control group" OR post-test …]（第 559–589 行）；加前後向追溯（第 594–602 行）。
- 納入：英文寫成、高等教育 EMI、評估 EMI 對內容或英語學習的成效、有可算 Cohen's d 的統計量（第 612–626 行）。
- 篩選（第 806–832 行、Figure 1 對過 PDF 第 19 頁）：WoS 60、Scopus 6、ERIC 20、ProQuest 20、追溯 26 → 去重與看標題摘要後 62 篇全文審查 → 排除 34（4 篇不是談成效、1 篇是 EMI 預備課程、20 篇沒量學習成果、3 篇質性、5 篇只有單組後測、1 篇資料不足且作者確認拿不到）→ **28 篇研究、41 個獨立樣本、N = 8,747、51 個效果量**（第 953–981 行）。
- 四組分開算：內容學習組內（前後測，n = 7 個效果量、k = 7 個樣本）、內容學習組間（EMI 對非 EMI 後測，n = 19、k = 16）、英語學習組內（n = 21、k = 14）、英語學習組間（n = 4、k = 4）（Table 2，第 1024–1046 行；n、k 的意思原文沒有明寫，我依 Table 1 計數推得 n 是效果量數、k 是樣本數）。摘要寫內容 23 個樣本（N = 7,659）、英語 18 個樣本（N = 1,088）（第 26–30 行）。
- 調節變項 8 個，只能做次群組分析（樣本太少做不了多元後設迴歸，第 783–798 行）：L1 與英語是否語系相近、機構支援、全 EMI 或部分 EMI、是否長於一學期、STEM、量的是否學術英語、是否確認同質性（組內：是否處理自選偏誤；組間：是否確認兩組同質）、入學門檻（第 659–692 行）。
- 效果量來源：多數用平均數、標準差手算；部分用迴歸係數（Lin & Lei 2021、Arco-Tirado 2018、Lei & Hu 2014、Civan & Coskun 2016）、t 檢定、ANCOVA（Guo 2018）（第 981–994 行）。
- 樣本大小差很多：組間內容學習最大是 Civan & Coskun 2016（N = 4,151），其次 Bälter 2024（815）、Lin & He 2019（498）（Table 1，第 891–949 行）。

## 結果（逐項）

1. **內容學習，組內前後測：d = 1.57，p < .001，95% CI [0.90, 2.25]**（第 1081–1083 行；Figure 2）。原文：「as within-group effect sizes do not establish causality, these gains cannot be directly attributed to EMI, as other factors may have contributed」（第 1085–1089 行）。7 個樣本中只有 Guo 2018[1] 不顯著（d = 0.19, 95% CI [−0.55, 0.93]，第 1073–1077 行）。註：討論節與 Figure 6、7 的圖上 CI 寫成 [0.89, 2.25]（第 1293、1507 行），與結果節 [0.90, 2.25] 差 0.01。
2. **內容學習，EMI 對非 EMI 組間：d = 0.13，p > .05（摘要寫 p = 0.14），95% CI [−0.04, 0.31]**（第 1120 行；摘要第 42 行；討論第 1362 行寫 p = .14）。16 個樣本中 7 個負、9 個正；CI 不含 0 的只有 5 個，其中 2 負 3 正（第 1105–1113 行）。對過 Figure 3（PDF 第 26 頁）：顯著為負的是 Civan & Coskun 2016（−0.25 [−0.31, −0.19]）、Bälter 2024（−0.17 [−0.31, −0.03]）；顯著為正的是 del Campo 2023（0.32）、del Campo 2016[3]（0.44）、de Perea & Ramírez-García 2024（0.85）。原文：「EMI on the whole does not harm students' content learning and may allow them to perform at levels comparable to those studying in their first language (L1)」（第 1122–1126 行）。
3. **英語學習，組內前後測：d = 0.81，p < .001，95% CI [0.50, 1.12]**（第 1145–1147 行；Figure 4）。14 個樣本中 3 個不顯著（Guo 2018[3]、Aguilar & Muñoz 2014、Satayev 2022b[4]）。作者自己說可能受 EMI 以外的英語接觸影響（第 1151–1155 行）。
4. **英語學習，組間：d = 0.33，p = 0.009，95% CI [0.08, 0.57]，只有 4 個樣本**（第 1174–1180 行；Figure 5 對過 PDF 第 28 頁：Salamanca & Montoya 2018[2] 0.13、Lei & Hu 2014 0.24（權重 52.50%）、Guo 2018[4] 0.69、Thi 2023[2] 0.73；4 個中 3 個 CI 含 0）。原文：「The limited sample size (n = 4, k = 4) weakens the reliability of this estimate, making it unsuitable for drawing generalizable conclusions about the impact of EMI on English learning.」（第 1176–1180 行）。註：討論節把這個 CI 寫成 [0.01, 0.57]（第 1391 行），與結果節、摘要不一致。
5. **調節變項（Table 3，第 1200–1221 行，對過 PDF 第 29–30 頁）**：內容學習組內「全 EMI」係數 1.46（SE 0.42, p < .01）、「同質性確認」−1.36（SE 0.60, p < .05）；內容學習組間「同質性確認」−0.38（SE 0.19, p < .05）；其他調節變項在四組都不顯著。英語學習兩組沒有任何調節變項顯著（第 1186–1196 行）。表中「-」是該組某一類別沒有樣本、無法分析（Table 2）。
6. **全 EMI 對部分 EMI（內容學習組內）**：全 EMI d = 2.48 [1.83, 3.13]（3 個樣本：Satayev 2022b[1]、[2]、Kim & Kim 2022）；部分 EMI d = 1.03 [0.52, 1.54]（4 個樣本）（第 1226–1232 行；Figure 6 對過 PDF 第 30 頁）。
7. **組內內容學習，沒處理自選偏誤 vs 有處理**：沒處理的 5 個樣本 d = 1.96 [1.31, 2.61]；有處理的 2 個樣本（Aizawa 2023[1] 0.99、Guo 2018[1] 0.19）d = 0.61 [−0.18, 1.40]，不顯著（第 1244–1250、1489–1499 行；Figure 7 對過 PDF 第 31 頁）。差值 1.36（p < .05, 95% CI [0.19, 2.53]，第 1493–1495 行）。
8. **組間內容學習，沒確認同質性 vs 有確認**：沒確認的 4 個樣本（Yang 2019[1]、[2]、Ortín 2016、de Perea & Ramírez-García 2024）d = 0.41 [0.04, 0.77]；**有確認同質性的 12 個樣本 d = 0.04，p = .68，95% CI [−0.13, 0.20]**（第 1261–1270、1477–1483 行；Figure 8 對過 PDF 第 32 頁）。差值 0.38（p < .05, 95% CI [0.00, 0.75]，第 1456–1458 行）。原文：「When restricting analyses to studies that confirmed comparable baseline characteristics between EMI and non-EMI groups, the results suggest that EMI does not negatively affect content learning (d = 0.04, p = .68, 95% CI [-0.13, 0.20]).」（第 1477–1483 行）。
9. **出版偏誤**：四組在兩個準則（漏斗圖＋Egger 檢定、離群與影響診斷）同時考量時都沒有顯著出版偏誤；有些組在單一準則下顯著（第 743–761 行）。細節說在 Appendix 1，**本檔沒有附錄**（見讀取紀錄）。
10. 前人統合分析的轉述（第 316–332、357–363 行）：Peng & Xie 2021 只收中國研究，內容學習 EMI 優於中文授課 d = 0.67，但約 74% 是醫學領域，非醫學領域 d = −0.06（不顯著）；英語學習 d = 1.58。這是二手轉述，要引得回原文。

## 作者自己列的限制

- 內容學習與英語學習的資料來自不同樣本，只有三篇研究兩者都量；只有四篇同時有組內與組間設計（第 1552–1558 行）。
- 樣本少：內容學習組內與英語學習組間的效果量太少，不足以代表較廣的趨勢；部分調節變項類別不足而無法分析；即使做了，只有兩三個效果量的推論統計不太可能可推廣（第 1564–1581 行）。
- 只能做次群組分析，沒辦法同時控制其他變項（第 790–798 行）。
- 組內設計不能推因果（第 1085–1089、1151–1155、1285 行）。
- EMI 與非 EMI 組學習者特質不可比，仍是組間研究內部效度的重大威脅（第 1534–1540 行）。

## 與摘要說法不一致的地方

- 摘要寫組間內容學習「comparable outcomes (d = 0.13, p = 0.14)」，與正文一致。
- 摘要說有方法限制的研究「often overestimate the effectiveness of EMI for content learning」（第 46–50 行），正文支撐這句的分組各只有 2 到 5 個樣本（結果 7、8），摘要沒有提到這個規模。
- 作者在不同位置對同一數字的寫法不一致（不是摘要，但引用時會碰到）：
  - 沒確認同質性的組間 d = 0.41，結果節寫「p > 0.05, 95% CI [0.04, 0.77]」（第 1263 行），CI 不含 0 卻寫 p > .05，自相矛盾；討論節改用差值 0.38、p < .05（第 1458 行）。
  - 英語組間 CI：摘要與結果 [0.08, 0.57]，討論 [0.01, 0.57]。
  - 內容組內 CI 下限 0.90 與 0.89 兩種寫法。
- 結論說「the comparable impact of EMI on content learning holds even when controlling for whether studies ensured homogeneity」（第 1526–1528 行），這是對 12 個有確認同質性樣本的次群組結果（d = 0.04），不是迴歸控制。

## 與清單「要撐的結論」不合的地方

清單寫：「EMI 對非 EMI 的組間比較：學科內容 d = 0.13 不顯著」。
- 數字撐得住（d = 0.13, p = .14, 95% CI [−0.04, 0.31]，16 個樣本、19 個效果量）。
- 但要補兩點，否則容易被讀成「EMI 有一點點好處」：(1) 只看有確認兩組同質的 12 個樣本，d = 0.04（p = .68），更接近零；沒確認同質性的 4 個樣本是 0.41，把整體往上拉。(2) 作者的結論措辭是「不比母語授課差」（comparable / does not harm），不是「EMI 沒用」；英語能力的組間優勢 d = 0.33 只有 4 個樣本，作者自己說不適合下可推廣的結論。
- 樣本都是高等教育的整個學程或課程，量的是學科考試或成績；不是「讀一篇外語教學文章」的情境。用到本站「讀者用非母語讀教學文章」時要明說是類比，而且大學 EMI 學生多半有入學英語門檻或自選。

## 我的觀察（不是作者說法）

- 組內內容學習「沒處理自選偏誤」的 5 個樣本裡有 3 個就是「全 EMI」的 3 個樣本（Satayev 2022b[1]、[2]、Kim & Kim 2022；對 Figure 6、7）。「全 EMI 效果較大」與「沒處理自選偏誤效果較大」這兩個調節結果在這 7 個樣本裡大幅重疊，分不開。作者沒有討論這一點。

## 讀取紀錄

- 第 1–650 行：題名、摘要、前言、文獻回顧、研究問題、方法（搜尋、納入、效果量計算開頭）
- 第 650–1300 行：方法（調節變項、分析）、結果（搜尋、Table 1、Table 2、四組整體效果量、Table 3、Figure 6–8 文字）、討論開頭
- 第 1300–1851 行：討論、方法反思、結論與限制、參考文獻（掃過）
- 三段首尾相接，涵蓋全文 1,851 行。
- 本檔是單欄 Word 稿，`-layout` 轉出沒有雙欄交錯問題。Table 1、2、3 對過文字檔排版；Figure 1、3、5、6、7、8 是圖片，在文字檔裡只有標題，用 `pdftoppm` 轉 PDF 第 19、26、28、30、31、32 頁逐一看過，上面引的樣本層級數字都出自圖。Figure 2、4（PDF 第 24、27 頁）已轉圖但沒有打開看，兩組的整體值取自正文；樣本層級數字沒抄。
- **缺件**：正文說出版偏誤結果在 Appendix 1、完整資料集在 Appendix 2、研究清單在 Appendix 3（第 759–761、798–800、828–830 行），ORA 的作者稿 45 頁到參考文獻就結束，沒有附錄；參考文獻清單也只列正文引用的文獻，28 篇納入研究多數不在清單內（例如 Civan & Coskun 2016、Bälter 2024 都沒有完整書目）。附錄應在刊出版的線上補充資料，沒有取得。
- 參考文獻中「Authors. (2025a)」「Authors. (2025b)」是匿名審稿留下的佔位（第 1600–1602 行），刊出版應已補回。
