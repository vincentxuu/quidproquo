# 抽取紀錄：Dersch、Thacker、Eitel 2026，Educational Psychology Review 38:17

## 檔頭

- **書目**：Anna-Sophia Dersch、Ian Thacker、Alexander Eitel (2026). Should we Tell Teachers That They Are (In)Correct? How Personalized Refutation Text Promotes or Hampers Conceptual Change. *Educational Psychology Review*, 38, Article 17（共 42 頁）. https://doi.org/10.1007/s10648-026-10116-9。欄位標「INTERVENTION STUDY」。Received 3 April 2025／Accepted 1 January 2026。作者全名與單位對過 PDF 首頁（L71–77）：Dersch 與 Eitel 在 Justus-Liebig-Universität Gießen 心理系，Thacker 在 University of Texas at San Antonio。
- **版本**：刊出版（publisher version），CC BY 4.0（L3248–3264）。
- **原文檔**（都在 `.research/raw/learning-content/q1-learner/`）：
  - `persrefutation2026.pdf-jina.txt`：**本次精讀用的主檔**，3,832 行、139,936 位元組。2026-10-14 用 `https://r.jina.ai/https://link.springer.com/content/pdf/10.1007/s10648-026-10116-9.pdf` 從出版者 PDF 轉出，含摘要、作者欄、表 1–3、附錄 A（表 4）、參考文獻。下面行號一律是這個檔的行號。
  - `persrefutation2026.txt`／`.md`：清單原列的 jina HTML 版（666 行、116,675 位元組），沒有摘要、作者欄，表格全部只剩「Full size table」字樣。只拿來對照文字。
  - `persrefutation2026.tables.md`：本次另抓的 Springer 獨立表格頁（`…/article/10.1007/s10648-026-10116-9/tables/1`–`3`），表 1–3 的結構化版本。
  - `persrefutation2026.fig1.png`–`fig4.png`：本次從 `media.springernature.com` 下載的圖 1–4。
  - **PDF 原檔沒拿到**：`link.springer.com/content/pdf/…` 對 curl 回傳 JavaScript 驗證頁，Wayback 沒有存檔，firecrawl 額度用完。所以「對 PDF 版面」這一步改成：表 1–3 用出版者的結構化表格頁逐格對過 PDF 轉出的文字；圖 3、圖 4 直接看圖。表 4（附錄 A 的教材全文）只有 PDF 轉出的文字，欄位順序靠圖 2 的結構判讀。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 13（#3，反向／無效）。

## 研究設計

- **類型**：線上隨機實驗，2×2 受試者間設計（反駁文 vs. 說明文 × 個人化回饋 vs. 無），前測—後測。有預先登錄（aspredicted.org，L689–691）；註 1 說登錄版與本文的假設措辭與順序有改（L693–695）。資料與語法公開在 OSF（https://doi.org/10.17605/OSF.IO/TP2SN，L801–805）。
- **受試者**（L809–872）：德國的師資生與在職教師，經 SONA 與 News4Teachers 招募。476 人同意參加，42 人開始前退出、84 人中途退出（各組退出分布 χ²(3) = 5.22，p = .156），350 人完成；排除 2 人（自陳沒認真做）與 12 人（自陳分心），最後 N = 336（266 女、69 男、1 非二元；平均 27.56 歲，SD 12.77，18–75 歲）。完全合格的在職教師 85 人（25.3%）、已在學校任教的師資生 50 人（14.9%）、沒有教學經驗的 201 人（59.8%）。中學 204 人、小學 132 人。336 人中 213 人教數學或正在讀數學教育（L2482–2484）。預先登錄的樣本是 N = 250，因為在職教師太少而多收（L860–868）。
- **各組人數**（L874–878）：個人化反駁文 93、個人化說明文 86、一般反駁文 74、一般說明文 83。
- **教材**（L882–1062、附錄 A L2692–3244、圖 2）：兩段德文短文，一段對應「同理—系統化」誤解（說明文 163 字），一段對應「女生靠努力補天分」誤解（190 字）。四組都讀同一段說明文（含 APA 格式文獻）。
  - 反駁文組在說明文前多讀一段反駁（32–77 字）：「Many people think that … However, these assumptions are incorrect and not in line with the scientific consensus.」（L1038–1052）
  - 個人化組在每段文字前多一段依前測作答給的回饋（43–52 字），三種之一：答案符合科學證據／答得不確定／答案不符合科學證據（L1000–1012）。
  - 個人化反駁文組的順序：個人化回饋 → 誤解陳述 → 「這是錯的」→ 說明文（圖 2）。
  - 閱讀時間：每段至少停留 35 秒才能翻頁，學習階段最少 70 秒（L1562–1566）。整個實驗中位數 29.14 分鐘（L1578）。
- **量了什麼**：
  - 誤解：MGMQ-s 短版，兩個量表各 4 題，另有 8 題正確的填充題不計分（L1072–1102）。每題先答對／錯，再答確定程度（0–4），分數 = 同意（+1）或不同意（−1）× 確定度，範圍 −4 到 +4，越高誤解越強（L1104–1122）。
  - **概念改變分數**：原文寫「subtracting the pre-test result from the post-test result」（L1126–1128），但全篇實際用法是正值代表誤解變少、負值代表誤解變多（見「不一致」第 1 點）。
  - **「有誤解」的判定**：某量表至少一題以高確定度（certain 或 absolutely certain）同意（L1130–1134）。
  - 情緒：讀完文字後填 PANAS（20 題），負向情緒拆成內歸因（guilty、ashamed、startled，ω = 0.75）、外歸因（upset、irritable、hostile，ω = 0.61）、與歸因無關（ω = 0.68）（L1138–1312）。
  - 認知負荷：內在與外在負荷量表（L1314–1334）。
  - 行為測量：看四段教室影片後開放作答，評「察覺強化數學性別刻板印象的教師行為」；266 人有可用資料，70 人因技術問題排除（註 2，L839–842）。兩位評分者 κ = 0.73（L1466–1482）。
  - 數學性別刻板印象（1–9 單題）、對縮小數學性別差距的態度（兩題，r = .34）（L1502–1516）。只在介入後量。
- **何時量**：前測 → 讀文 → 情緒與負荷 → 後測 #1（MGMQ-s）→ 影片任務 → 態度 → 背景資料，全部在同一次線上作答內完成（圖 1、L1544–1578）。**沒有延宕測驗**。
- **分析**：SPSS v30；正交對比（#1 [−1 −1 −1 +3] 個人化反駁文對其餘三組；#2 [−1 −1 +2 0]；#3 [−1 +1 0 0]）放進線性迴歸；反效果用 2×2 ANOVA／MANOVA；中介用 PROCESS（10,000 次拔靴）（L1582–1606）。

## 結果（逐項）

### 隨機分派檢查與描述統計

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 各組背景與前測沒有差異 | 性別、母語、學校類型、身分的 χ² 與年齡、教學年資、前測誤解的 ANOVA 全部 ps > 0.05 | 四組互比 | Preliminary Analyses | L1616–1626 | 「These results suggest a successful randomization.」 |
| 2 | 各組認知負荷沒有差異 | ps > 0.05；內在負荷四組 2.67／2.73／2.90／2.84，外在負荷 2.24／2.18／2.35／2.30（1–7 分） | 四組互比（一般說明文／一般反駁文／個人化說明文／個人化反駁文） | 表 1 | L1626–1632、表 1 L933–948 | 「varying text length … did not influence intrinsic or extraneous cognitive load.」 |
| 3 | 前測誤解分數 | 四組 −0.78（2.05）／−0.77（1.77）／−0.53（1.84）／−0.70（1.77），全體 −0.69（1.86），量尺 −4 到 +4 | 同上 | 表 1 | L949–954 | 表列「Pretest Scores」 |
| 4 | 逐題誤解分數（前測或合併，原文沒寫是哪一次） | 8 題平均都是負值，只有 GC2「Girls compensate for their on average lower aptitude…」為 +0.47（2.86）；同意率（−1 到 1）只有 ES4（0.11）與 GC2（0.18）為正 | 無對照 | 表 2 | L1160–1308 | 表列 |
| 5 | 概念改變與前測誤解的相關 | r = 0.68***；與後測誤解 r = −0.41*** | 全體 336 人 | 表 3 | L1434 | 表列 |
| 6 | 行為測量與誤解無關 | 與前測誤解 r = 0.08、後測 r = 0.03、概念改變 r = 0.05，皆不顯著 | 全體 | 表 3、Measures | L1437、L1484–1490 | 「Due to these null-correlations, our behavioral measure must be considered exploratory and its transfer validity is hence limited.」 |

### H1 個人化反駁文假設

| # | 結果 | 數字 | 對照條件 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 7 | **全體樣本：沒有效果** | 三個對比都不顯著；原文印「(t > 1)」（按文意應是 t < 1，見「不一致」第 3 點） | 個人化反駁文 vs. 其餘三組；個人化說明文 vs. 兩個一般組；一般反駁文 vs. 一般說明文（N = 336） | H1／Conceptual Change | L1680–1682 | 「In a regression model with all 336 participants, we did not find the contrasts to significantly predict conceptual change scores (t > 1).」 |
| 8 | 前測兩個誤解都有的人：個人化反駁文最好 | 對比 #1：b = 0.26，SE = 0.13，t(92) = 2.04，p = .044，R² = 0.05；另兩個對比 t < 1 | 個人化反駁文 vs. 其餘三組，n = 96（28.57%） | 同上 | L1684–1692 | 「results revealed that contrast #1 significantly predicted conceptual change scores, b = 0.26, SE = 0.13, t(92) = 2.04, p =.044, R2 = 0.05, whereas both residual contrasts did not, t < 1.」 |
| 9 | 上一項的各組平均（從圖讀，約值） | 一般說明文約 2.6、個人化說明文約 2.75、一般反駁文約 3.0、個人化反駁文約 3.8；誤差線為平均數標準誤 | n = 96 | 圖 3 | L1742；圖檔 | 圖註：「we included the results of all participants who held both misconceptions in the pre-test (n = 96).」 |
| 10 | **一般反駁文沒有比一般說明文好** | 對比 #3 不顯著（全體與 n = 96 子樣本皆然，t < 1） | 一般反駁文 vs. 一般說明文 | 同上 | L1664–1668、L1680–1692 | 同第 7、8 項 |
| 11 | 行為測量，全體：沒有效果 | 三個對比 ts < 1 | 同第 7 項，n = 266 | H1／Behavioral Measure | L1702–1726 | 「No contrast significantly predicted awareness (ts < 1).」 |
| 12 | **行為測量，兩個誤解都有的人：個人化反駁文反而較低** | 對比 #1：b = −0.09，SE = 0.04，t(78) = −2.01，p = .047，R² = 0.06 | 個人化反駁文 vs. 其餘三組，n = 82（30.8%） | 同上 | L1728–1740 | 「the first contrast testing personalized refutation texts against the other conditions significantly predicted lower awareness among those participants with both misconceptions in the pre-test … suggesting backfire effects in the behavioral measure for this subsample.」 |

### H2 內歸因情緒中介

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 13 | 沒有中介 | 全體：間接效果 ab = −0.003，SE = 0.01，BCa CI 95 [−0.02, 0.01]；n = 96：原文印「ab = −0.2, SE = 0.02, BCa CI 95 [−0.07, 0.02]」（−0.2 落在自己的信賴區間外，見「不一致」第 4 點） | 個人化反駁文 vs. 其餘 → 內歸因情緒 → 概念改變 | L1760–1768 | 「Results did not reveal significant mediations」 |
| 14 | 內歸因情緒與概念改變有小的正相關 | r = .14，p = .009（全體 336 人） | 相關，不分組 | L1768–1778 | 「while stronger internal blame was related to more conceptual change, internal blame was not impacted by personalized refutation texts」 |

### H3 知識反效果

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 15 | 後測誤解分數比前測高的人數 | 42 人（12.5%），四組合計；這群人前後差 t(41) = −6.72，p < .001 | 同一人前後比 | L1790–1800 | 「We found that 42 participants (12.5%) demonstrated conceptual change that was negative, meaning, after the intervention, they held more misconceptions than before the intervention.」 |
| 16 | 與先前研究比 | 原文印先前研究「0.02%」；χ²(1) = 13.05，p < .001 | 本研究 12.5% vs. Dersch 等 2022b | L1800–1804 | 「This is significantly more than in previous studies using similar materials, where 0.02% of participants backfired (e.g., Dersch et al., 2022b)」 |
| 17 | **這 42 人裡面，退步幅度的交互作用** | 個人化 × 反駁：F(1, 38) = 8.11，p = .007，ηp² = 0.18，「disordinal」；兩個主效果 ps > 0.05 | 2×2 ANOVA，**只分析這 42 人**，依變項是他們的（負）概念改變分數 | L1808–1828 | 「Results revealed a significant disordinal interaction effect for personalization with refutation, F(1, 38) = 8.11, p =.007, ηp² = 0.18, yet there were no main effects」 |
| 18 | 上一項的各組平均（從圖讀，約值） | 非個人化說明文約 −1.05、個人化說明文約 −0.65、非個人化反駁文約 −0.35、個人化反駁文約 −1.75 | 42 人 | 圖 4 | 圖題：「Result pattern of backfire effects for participants who had negative conceptual change」 |
| 19 | 作者的判讀 | 個人化反駁文的反效果最強；一般反駁文與個人化說明文「沒有」 | 同上 | L1828–1836 | 「personalized refutation texts caused the strongest knowledge backfire effects among those participants who backfired, while common refutation text and personalized expository text did not.」 |
| 20 | 42 人的前測狀態 | 只有 8 人前測兩個誤解都有；其餘 34 人（10.1%）只有一個或沒有 | 無 | L1836–1840 | 「only eight of the 42 participants who backfired held both misconceptions in the pre-test, 34 (10.1%); the remainder either held only one misconception or no misconception at all.」 |
| 21 | 排除那 8 人後交互作用仍在 | n = 34；原文印「F(30) = 6.05, p = .020, ηp² = 0.17」（自由度只寫一個） | 2×2 ANOVA，34 人 | L1840–1846 | 「Excluding those eight participants who held both misconceptions, we still found a significant interaction effect for personalized refutation texts」 |
| 22 | 退步者與其他人的差別 | F(1,334) = 110.62，p < .001 | 42 人 vs. 其餘 294 人的概念改變 | L1804–1808 | 「participants who backfired demonstrated significantly less conceptual change than other participants」（這是依定義切出來的組，必然如此） |
| 23 | **原文沒有報告的事** | 42 人在四組各有幾人；各組退步者的比例；「前測沒有誤解」的全體子樣本在四組的平均概念改變 | — | H3 整節 L1788–1866 | 原文無對應句子 |

### H4 外歸因情緒中介反效果

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 24 | 沒有中介 | 直接效果 c′ = −0.24，SE = 0.08，p = .006；間接效果 ab = −0.0002，SE = 0.01，BCa CI 95 [−0.01, 0.03] | 42 名退步者 | L1880–1894 | 「indicating that there was no mediation effect」 |
| 25 | 外歸因情緒在退步者中不分組別、也與概念改變無關 | Fs < 1；r = −.061，p = .701 | 42 人 | L1894–1904 | 「anger did not mediate knowledge backfire」 |
| 26 | 行為測量同樣沒有中介 | ab = −0.003，SE = 0.01，BCa CI 95 [−0.02, 0.01]，R² = 0.07 | n = 82 | L1906–1922 | 「Results did not reveal a significant mediation」 |
| 27 | 外歸因情緒幾乎沒有變異 | M = 1.23（1–5 分），SD = 0.45 | 全體 | L2520–2524 | 「We did not find a lot of variance in the negative affect of external blame」 |

### H5–H7 態度（探索性）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 28 | 個人化反駁文對刻板印象與態度沒有效果 | ps > 0.05（全體與 n = 96） | 同 H1 的三個對比 | L1928–1952 | 「personalized refutation texts did not impact either type of attitude more than the other conditions」 |
| 29 | 後測誤解與態度的相關 | r = −.20，p < .001 | 全體，相關 | L1956–1964 | 「lower levels of math-gender misconceptions at post-test predicted more positive attitudes」 |
| 30 | 態度反效果：全體與 n = 96 都沒有效果 | 原文兩處印「(ps < 0.05)」，文意是沒有效果（見「不一致」第 3 點） | 2×2 MANOVA | L1976–1990 | 「We found no main effects nor an interaction effect (ps < 0.05).」 |
| 31 | 42 名退步者中，個人化的主效果 | 對縮小差距的態度：F(1, 32) = 5.92，p = .021，ηp² = 0.16（個人化兩組較正向）；刻板印象方向相同但不顯著，整體 MANOVA p = .05 未過 | 個人化 vs. 非個人化，42 人 | L1990–2006 | 「we found a main effect for personalization on positive attitudes towards gender equity in mathematics」 |
| 32 | H7 沒有做 | — | — | L2008–2014 | 「Since we did not find evidence of attitude backfire, we did not conduct this mediation analysis.」 |

### 其他探索性分析

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 33 | 在校任教者前測誤解較少 | 任教者 M = −1.58（SD 1.86）vs. 無經驗師資生 M = −0.39（SD 1.80），t(334) = 3.13，p < .001（任教者平均有疑問，見「不一致」第 5 點） | 任教者 n = 135 vs. 師資生 n = 201 | L2036–2040 | 「working teachers … had significantly fewer misconceptions than pre-service teachers」 |
| 34 | 師資生概念改變較大，後測兩群沒有差異 | 改變：2.13（1.91）vs. 1.58（1.76），t(334) = 2.67，p = .004；後測：−2.57（1.38）vs. −2.66（1.67），t(334) = 0.54，p = .295 | 同上 | L2042–2050 | 「misconception scores no longer differed significantly」 |
| 35 | 組別效果不因有無教學經驗而異 | 2×2×2 ANOVA 交互作用全部 p > .05（概念改變與行為測量皆然） | 組別 × 教學經驗 | L2052–2066 | 「the conditions had similar effects on conceptual change, regardless of whether participants were teaching at schools or not」 |
| 36 | 只看在校任教且兩個誤解都有的人：對比 #1 不顯著 | b = 0.42，SE = 0.22，t(29) = 1.93，p = .063，R² = 0.16；對比 #2 b = −0.36，p = .310；#3 b = −0.31，p = .653。原文說人數是「63 teachers」 | 個人化反駁文 vs. 其餘 | L2068–2088 | 「did not significantly predict conceptual change scores … likely due to lower power in this smaller subsample」 |
| 37 | 性別沒有效果 | 前測 F(1,334) = 0.69，p = .405；後測 F = 0.81，p = .369；概念改變 F = 0.01，p = .961 | 女 vs. 男 | L2104–2122 | 「we did not find gender effects for conceptual change」 |

### 作者的解釋（討論節，不是結果）

- 世界觀反效果不太能解釋，因為退步最多的是前測沒有或只有很少誤解的人（L2190–2206）。
- 改提「熟悉度反效果」當替代機制，並明說這不在預先登錄裡：「familiarity backfire was not something we had predicted in advance of conducting this study. Evidence on familiarity backfire is mixed, with a recent study failing to replicate it (Ecker et al., 2023).」（L2220–2226）
- 作者自己的區分：Ecker 等只提一次誤解；本研究個人化反駁文組在回饋裡提一次、反駁文裡再提一次，前後測問卷也都有（L2226–2246）。用語是「might have」「may have caused」（L2252–2258）。
- 全體沒有效果的原因，作者推測是沒有誤解的人反應不同：「This finding was likely due to participants who did not hold prior misconceptions reacting differently to the interventions, for instance by backfiring.」（L2168–2172）
- 實務建議：個人化回饋要搭配演算法，只有在誤解存在時才給反駁文，否則給說明文（L2656–2668）。

## 作者自己列的限制（L2450–2636）

1. 樣本以沒有教學經驗的師資生為主（59.8%），在職教師只有 25.3%。
2. 不是只有數學教師（336 人中 213 人教或讀數學）。
3. 男性偏少（20.5%）；作者說這與德國教師母體相近。
4. 樣本幾乎全是德語區，推論到其他文化要小心。
5. 線上研究：外歸因負向情緒幾乎沒有變異，可能是生氣的人直接退出；作者認為主題本身可能就是退出的原因，操弄可能太弱。
6. 行為測量與前測、後測誤解及概念改變都不相關，「awareness, as assessed here, does not tap into math-gender misconceptions」的可能性作者自己列出。
7. 態度沒有前測，無法談態度改變（L2412–2416，寫在討論節）。
8. 熟悉度反效果是否足以解釋結果「more research is needed」（L2324–2326）。

作者**沒有**列為限制、但讀的時候看得到的（這幾點是我的觀察，不是原文說法）：

- 沒有延宕測驗，後測緊接在閱讀之後。
- 「反效果」的定義是後測分數高於前測，沒有設最小變化量，也沒有討論測量誤差或迴歸均值。分數由「同意與否 × 確定度」構成，前測在 −4 附近的人後測只可能持平或變高。
- H3 的 ANOVA 是先依結果（分數變差）挑出 42 人再比各組，不是隨機分派下的組間比較。
- 個人化回饋給「沒有誤解」者的那段文字（附錄 A，L2724–2742）只提到題目主題（「the questions on empathic and systematic thinking in boys and girls and their effects on mathematical talent」），沒有把誤解的內容陳述出來；討論節卻說誤解「was mentioned in the personalized feedback and in the refutation text itself—it was mentioned twice」（L2236–2240）。

## 與摘要說法不一致的地方

1. **概念改變分數的方向**：方法節寫後測減前測（L1126–1128），照這個算法誤解變少應該是負值。但 H3 把「negative」定義成誤解變多（L1790–1794），圖 3 的改變量是正值，探索分析的改變量 2.13、1.58 也是正值而後測比前測低（L2036–2050）。實際用的是前測減後測。
2. **各組人數**：正文與表 1 都是一般反駁文 n = 74（L878；表 1 性別欄 61+13）。圖 1 的流程圖印一般反駁文 n = 93，四格加起來是 355，不是 336。以正文與表 1 為準。
3. **顯著性符號印反**：L1682「(t > 1)」接在「did not find」後面；L1984、L1990 兩處「(ps < 0.05)」接在「no main effects」「did not find any effects」後面。HTML 版同樣這樣印，是刊出版本身的錯。
4. **H2 子樣本的間接效果**：ab = −0.2 不在自己的信賴區間 [−0.07, 0.02] 內（L1766–1768），疑為 −0.02，原文無從確認。
5. **任教者前測平均**：L2036 印 −1.58。但任教者後測 −2.66、改變量 1.58，推回前測約 −1.08；用 −1.08 與師資生 −0.39 加權也才對得上表 1 的全體 −0.69（用 −1.58 會得到約 −0.87）。疑為誤植，原文無從確認。
6. **排除人數**：L827 寫另外排除 12 人，L1540 寫 n = 13。350 − 2 − 12 = 336，12 才對得上。
7. **教學年資**：正文 4.99 年（SD 9.45）（L835），表 1 全體欄 5.08（9.52）。
8. **「0.02%」**：L1802 說先前研究退步比例 0.02%，照比例意義應是 2% 左右的小數寫法，原文無從確認。
9. **L2072–2078**：說任教且兩個誤解都有的是「63 teachers」，但統計量自由度是 t(29)；L2090–2092 又說行為測量只有 29 人符合。人數對不起來。
10. **摘要對主要結果的寫法**：摘要說個人化反駁文「triggered the most backfire among those who did not [hold misconceptions]」（L44–48）。結果節實際做的是「在 42 名退步者之中」個人化反駁文組退步幅度最大（第 17 項），之後才補述這 42 人裡 34 人不是兩個誤解都有（第 20 項）。沒有任何一項分析是拿「前測沒有誤解的人」當母群來比四組。摘要也沒有提全體樣本三個對比都不顯著（第 7 項）。
11. **摘要的機制句**：摘要用「may lead to familiarity backfire」，正文明說這是事後提出、未預先登錄、且現有證據不一致（L2220–2226）。語氣一致，但摘要沒交代是事後解釋。

## 與清單「要撐的結論」不合的地方

清單原句：「對本來沒有該誤解的讀者，反覆提起誤解可能有害；12.5% 的人後測更差，集中在個人化反駁文組。**反向／無效**」

- **「12.5% 的人後測更差」**：撐得住（42／336，四組合計，第 15 項）。
- **「集中在個人化反駁文組」**：**撐不住**。原文沒有報告 42 人在四組各幾人。原文說的是在這 42 人裡，個人化反駁文組的退步「幅度」最大（交互作用 F(1, 38) = 8.11；圖 4 約 −1.75 對其他三組約 −0.35 到 −1.05）。是幅度，不是人數。圖 4 顯示一般說明文組的退步者平均也有約 −1.05。
- **「對本來沒有該誤解的讀者」**：要改寫。原文的說法是 42 人裡有 34 人「只有一個誤解或沒有誤解」，不是全都沒有誤解；而且沒有針對「前測沒有誤解者」這個母群做組間比較。
- **「反覆提起誤解可能有害」**：只能當作者的事後推測引用。原文明說熟悉度反效果不在預先登錄、證據不一致、需要更多研究；且給「沒有誤解」者的回饋文字只提主題、沒有把誤解內容寫出來（附錄 A）。
- 清單沒寫到、但同樣屬於「反向／無效」的結果：全體 336 人三個對比都不顯著；一般反駁文在全體與有誤解子樣本都沒有比一般說明文好（第 7、10 項）；有誤解者讀個人化反駁文後行為測量反而較低（第 12 項，p = .047，且該測量與誤解不相關）。
- 正向結果只有一項：前測兩個誤解都有的 96 人，個人化反駁文對其餘三組 p = .044、R² = 0.05（第 8 項）。
- 教材很短（說明文 163 與 190 字，反駁段 32–77 字），主題是帶價值立場的性別信念，對象是教師與師資生；拿來類推一般教學文章的「常見誤解」段落時要寫明這三點。

## 讀取紀錄

主檔 `persrefutation2026.pdf-jina.txt`，依序讀：

| 次序 | 行號 | 內容 |
|---|---|---|
| 1 | L1–900 | 檔頭、摘要、作者、Introduction、Theoretical Background（五小節）、Current Study and Hypotheses（H1–H7）、Method 開頭、表 1 開頭 |
| 2 | L880–1700 | 表 1、教材與操弄、Measures、表 2、表 3、Procedure、Results 開頭、Preliminary Analyses、H1 概念改變 |
| 3 | L1700–2560 | H1 行為測量、H2、H3、H4、H5–H7、Further Exploratory Analyses、Discussion 各節、Limitations 前半 |
| 4 | L2560–3020 | Limitations 後半、Conclusion、附錄 A（表 4）前半 |
| 5 | L3020–3264 | 附錄 A 後半、Acknowledgements、Funding、Declarations、Open Access 聲明 |
| 6 | L3266–3832 | 參考文獻：只掃過，確認 Ecker 2014、Ecker 2023、Lewandowsky 2020、Dersch 2022a／2022b 的條目存在 |

- 表 1、表 2、表 3：用 Springer 獨立表格頁（`persrefutation2026.tables.md`）逐格對過，與 PDF 轉出文字一致。表 3 有兩格原文就印成「−27***」「−19***」（少了「0.」）。
- 圖 1–4：看過原圖。圖 3、圖 4 的數值是從圖上目測，標「約」。
- 表 4（附錄 A）：只有 PDF 轉出的文字，沒有結構化版本可對；欄位歸屬依圖 2 判讀。
- 正文中的統計句另外用 HTML 版（`persrefutation2026.txt`）對過第 7、8、16、20、21、30、36 項，兩個版本文字相同。
- **沒對到的**：PDF 原始版面（拿不到檔）。OSF 上的資料與語法沒有開。
