# 抽取紀錄：Danielson、Jacobson、Patall、Sinatra、Adesope 等 2024，Educational Psychologist（線上版 2024-08-16，doi 10.1080/00461520.2024.2365628；NSF PAR 存放的版本）

合法公開來源：https://par.nsf.gov/servlets/purl/10629626 （NSF PAR，經費單位的公開取用典藏，2026-10-14 核對）。重新下載與手上的 `.work/teaching-text-research/src/danielson2024_nsf.pdf` 位元組完全相同（2,744,159 位元組）。出版者 Taylor & Francis 頁 Unpaywall 標 closed，引用時註明讀的是 NSF PAR 存放的版本。

原文檔：`.work/teaching-text-research/seq/danielson2024_nsf.txt`（共 3,742 行、157,539 字元）
讀取日期：2026-10-13／14
表格對照：PDF 是雙欄，原文檔的 Table 3–6 被拆成一行一格、左右兩半（IGRM 與 IG）交錯。四張表另用 `pdftotext -layout .work/teaching-text-research/src/danielson2024_nsf.pdf` 重抽後逐列對過，下面的數字以版面版為準；行號寫原文檔（seq）該表的起訖行。Figure 1–4 是圖片，原文檔只有圖說；Figure 2（PRISMA 流程圖）裡各排除原因的篇數讀不到。補充資料（Table S1–S3）不在原文檔內，沒有讀。

## 研究設計

- **研究類型**：預先註冊的統合分析（OSF：`https://osf.io/8kfue/`，L978–980）。只收把受試者分到不同組的研究，不收受試者自己當對照的設計（納入標準 6，L1019–1032）。
- **研究問題**（L945–972）：RQ1 整體效果（正確信念、錯誤信念、正負面情緒、態度）與出版偏誤；RQ2A 文本特徵的驗證性調節分析；RQ2B 文本特徵的探索性調節分析；RQ3A 設計、樣本、情境、成果特徵的驗證性分析；RQ3B 同類的探索性分析。調節分析一律控制四個共變項（信念類型、出版狀態、隨機分派、是否篩掉信念已經正確的人）。
- **駁斥文字的定義**（L141–145）：「Refutation texts typically contain three important components—first, they state the common but inaccurate knowledge that is assumed to be held by the reader; second, they explicitly indicate what is incorrect; and third, they provide the correct information, often with supporting explanations」。用詞是 typically。
- **納入標準**（L998–1038，八條）：
  1. 比較駁斥文字或 conceptual change text，與內容相同的非駁斥對照文本（單面或雙面的說明文、說服文、敘事文）。
  2. 題材是科學（列舉含化學、電腦與資訊科學工程、工程、地球科學、生命科學、材料、數學科學、物理與天文、心理學、社會科學、STEM 教育）。
  3. 評量並報告文本類型對介入後信念的效果；有量情緒、態度、動機的也編碼。
  4. 有可算效果量的統計量，或作者回信提供。
  5. 樣本是「typical functioning students」。
  6. 受試者（隨機或非隨機）分到不同的駁斥與對照條件，不能自己當對照。
  7. 介入不能含互動式教學（與教師、學生或智慧家教輪流對話）。
  8. 英文撰寫。
  不限年份、出版管道、是否發表（L1040–1043）。
- **檢索**（L1045–1096，六種途徑）：電子資料庫（Google Scholar、PsycINFO、ERIC、ProQuest 學位論文、Sociological Abstracts、Worldwide Political Science Abstracts、Medline、Biology Database、Science Database、Biological Science Database；檢索式見 Table 2，L1152–1177）；引用追蹤；學會 listserv 與 Twitter 徵求；經費機構的獎助資料庫；納入文章的參考文獻；寫信給在納入文章裡出現兩次以上的作者。原文沒有寫檢索日期。
- **篩選**（L1098–1132）：標題與摘要 7,741 筆 → 留 927 筆 → 全文審閱後 71 篇符合；全文階段排除 856 篇，原因在 Figure 2（讀不到）。每筆都由兩位編碼者篩；資料抽取雙人編碼、討論、第三位專家確認，一致率 95%（L1135–1141）。
- **最後納入**（L1277–1301）：71 篇文章（53 篇已發表、18 篇未發表），76 個研究、111 個樣本、294 個效果量；文章年份 1986–2021；各樣本 18 到 600 人，總樣本 10,265 人。
- **IG 與 IGRM 的定義**：
  - IG＝independent groups，只用後測：「posttest only effects (i.e., effects based on independent groups [IG] with posttests only)」（L921–923）；「an independent groups' (IG) posttest only design」（L1198–1199）。
  - IGRM＝independent groups with repeated measures，用前測調整後的變化量：「posttest effects adjusted by pretest scores (i.e., effects based on independent groups with repeated measures [IGRM] in which the outcome is measured before and after the refutation text intervention)」（L923–925）；算法是實驗組與對照組各自的前後測效果相減（Morris 與 DeShon 2002，L1201–1204）。沒有報告前後測相關的研究，代入 r = 0.534（取自另一份統合分析，L1205–1209）。
  - 兩種效果分開跑兩套分析。分開的理由：前測本身可能促成迷思與正確說法同時被喚起（L422–432）。
- **效果量**（L1188–1226）：標準化平均差，轉成 Hedges' g；正值代表駁斥文字組的成果較高。一個研究有多個駁斥或對照條件時，每個比較各算一個效果量。IG 效果裡有兩個離群值（2.52 與 2.83），保留不刪。
- **分析**（L1228–1274）：隨機效果多層次模型加穩健變異估計（CHE+ 工作模型），效果量巢套在子樣本、子樣本巢套在研究；同一樣本多個成果之間假設 r = .80。報告 95% 信賴區間與 95% 預測區間。調節分析只做信念成果，把錯誤信念的效果反號後和正確信念合併。出版偏誤：漏斗圖、處理相依效果量的修正版 Egger 迴歸、選擇模型（結果在補充資料 Table S3）。
- **成果的定義**：作者把信念與學習成果當同一件事（L472–473「learning outcomes (i.e., accurate and inaccurate beliefs)」）。題型含選擇題、是非題、解釋、Likert、申論、簡答、自由回想、再認（Table 1，L716–717）。
- **調節變項怎麼數到 26 個**：共變項 4 個（Table 4）；驗證性 9 個（Table 5：5 個相對文本特徵、篩選、教育情境、題型、成果信度），其中「篩選」和共變項重複；探索性 14 個（Table 6：學門、爭議性、相對文本長度、5 個平均文本特徵、對照文本、教育程度、女性比例、地區、國家科學信任度、成果測量時機）。4 + 9 + 14 = 27，扣掉重複的篩選是 26，和摘要的「26 moderators」（L55–56）一致。

## 結果（逐項）

### 整體效果（Table 3，原文檔 L1395–1499；內文 L1302–1328）

對照條件一律是「駁斥文字 vs 內容相同的非駁斥文本」。k＝研究數，NS＝樣本數，NES＝效果量數。

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 正確信念，IG（只用後測） | g = .37***，95% CI .26/.47，k = 67，NS = 102，NES = 222；τ² = .11；Q = 1315.23***；95% PI −.53/1.26 | RQ1／Table 3 | L1307–1312、L1395–1499 | 「the overall mean weighted IG and IGRM effect sizes for accurate beliefs were in the small-to-medium range, gIG (number of studies [k] = 67, number effect sizes [NES] = 222) = 0.37, p < .001 and gIGRM (k = 49, NES = 113) = 0.36, p < .001.」 |
| 2 | 正確信念，IGRM（前後測變化） | g = .36***，CI .24/.47，k = 49，NS = 68，NES = 113；τ² = .04；Q = 562.14***；PI −.41/1.12 | 同上 | 同上 | 同上 |
| 3 | 錯誤信念，IG | g = −.38**，CI −.55/−.21，k = 10，NS = 11，NES = 14；τ² = .00；Q = 29.32**；PI −.83/.07 | 同上 | L1312–1316 | 「gIG (k = 10, NES = 14) = −0.38, p < .001 and gIGRM (k = 6, NES = 10) = −0.31, p < .002.」（內文 p < .001，表內星號是 **） |
| 4 | 錯誤信念，IGRM | g = −.31**，CI −.44/−.18，k = 6，NS = 7，NES = 10；τ² = .00；Q = 9.77；PI −.38/−0.24 | 同上 | 同上 | 同上 |
| 5 | 正面情緒，IG | g = .24，p = .35，CI −.33/.82，k = 7，NS = 9，NES = 13；τ² = .33；Q = 88.52***；PI −1.24/1.72。**不顯著，假設不成立** | 同上 | L1316–1320 | 「In contrast to our hypotheses, the effect of refutation texts on positive emotions (gIG[k = 7, NES = 13] = 0.24, p = .35), negative emotions (gIG [k = 7, NES = 14] = −0.04, p = .71), and attitudes (gIG [k = 7, NES = 11] = 0.08, p = .36) did not differ significantly from zero.」 |
| 6 | 負面情緒，IG | g = −.04，p = .71，CI −.32/.23，k = 7，NS = 9，NES = 14；τ² = .05；Q = 26.48*；PI −.64/.55。不顯著 | 同上 | 同上 | 同上 |
| 7 | 正面態度，IG | g = .08，p = .36，CI −.12/.28，k = 7，NS = 10，NES = 11；τ² = .00；Q = 27.30**；PI −.36/.50。不顯著 | 同上 | 同上 | 同上 |
| 8 | 作者對假設的判定 | 正確信念、錯誤信念兩項符合假設；情緒與態度三項不符 | RQ1 | L1307、L1312、L1316 | 「In line with the hypothesis that refutation texts enhance accurate beliefs」「In contrast to our hypotheses」 |
| 9 | 異質性 | 正確信念的效果量有異質性；錯誤信念的 τ² 幾乎是 0 | RQ1 | L1320–1328 | 「The effect size estimates for accurate beliefs were heterogeneous, with the between-study variance (𝜏2) estimated as .11 for IG effects and .04 for IGRM effects」 |

預測區間：正確信念的 95% 預測區間跨過零（IG −.53 到 1.26；IGRM −.41 到 1.12）。原文只在表裡報告，內文沒有解讀這組數字。原文沒有報告 I²。

### 出版偏誤（L1329–1353）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 10 | 漏斗圖 | 正確與錯誤信念的圖「appeared to be symmetrical」 | L1334–1335 | 「The funnel plots for accurate and inaccurate beliefs appeared to be symmetrical」 |
| 11 | Egger，IGRM 正確信念 | b = −0.67，SE = 1.22，t(13.14) = −0.55，p = .59 | L1337–1339 | 「Results showed no evidence of funnel plot asymmetry for any outcome」 |
| 12 | Egger，IGRM 錯誤信念 | b = 0.70，SE = 4.88，t(1.42) = 0.14，p = .90 | L1339–1340 | 同上 |
| 13 | Egger，IG 正確信念 | b = −0.67，SE = 0.78，t(16.77) = −0.86，p = .40 | L1340–1346 | 同上 |
| 14 | Egger，IG 錯誤信念 | b = 4.93，SE = 5.23，t(2.93) = 0.94，p = .42 | L1346–1347 | 同上 |
| 15 | Egger，正面情緒 | b = −12.97，SE = 10.62，t(2.37) = −1.22，p = .33 | L1347–1348 | 同上 |
| 16 | Egger，負面情緒 | b = −2.50，SE = 1.61，t(2.60) = −1.56，p = .23 | L1348–1349 | 同上 |
| 17 | Egger，態度 | b = −1.75，SE = 3.41，t(3.40) = −0.51，p = .64 | L1349 | 同上 |
| 18 | 作者的判定 | 「little evidence」 | L1349–1351 | 「Taken together, funnel plot and "Egger's" regression models show little evidence of publication bias in this synthesis.」 |
| 19 | 選擇模型 | 內文沒有數字，放在補充資料 Table S3 | L1266–1274、L1351–1353 | 「Currently, selection models assume independence among the effect sizes. Given that our data structure consists of dependent effects, there is likely inflated Type-I error rates and we only evaluate the adjusted mean estimates of the intervention effects. The results are included in our supplementary materials.」 |
| 20 | 已發表 vs 未發表（當共變項檢驗） | IGRM：已發表 g = 0.40***（k = 39）、未發表 0.22*（k = 10），b = −0.18（SE 0.10），不顯著。IG：0.39***（k = 51）對 0.31*（k = 17），b = −0.08（SE 0.13），不顯著 | Table 4，L1514–1754 | 「None of the covariates predicted statistically significant differences in the refutation effects using either IG or IGRM effects.」（L1380–1382） |

### 共變項（Table 4，原文檔 L1514–1754）

每格寫「k／NS／NES；b(SE)；g；95% CI；95% PI」。b 是該類別相對於參照類別（–）的差。

| # | 調節變項・類別 | IGRM（前後測變化） | IG（只用後測） | 顯著與否 |
|---|---|---|---|---|
| 21 | 信念類型・Accurate（參照） | 48／67／112；–；0.35***；0.24/0.47；−0.04/0.74 | 67／103／221；–；0.37***；0.26/0.47；−0.28/1.02 | — |
| 22 | 信念類型・Inaccurate（已反號） | 6／7／10；0.05(0.10)；0.40*；0.15/0.65；−0.16/0.97 | 10／11／14；0.11(0.11)；0.47**；0.23/0.72；−0.30/1.24 | b 不顯著 |
| 23 | 出版狀態・Published（參照） | 39／53／92；–；0.40***；0.27/0.53；0.02/0.77 | 51／79／173；–；0.39***；0.29/0.51；−0.26/1.05 | — |
| 24 | 出版狀態・Unpublished | 10／15／30；−0.18(0.10)；0.22*；0.03/0.40；−0.23/0.66 | 17／25／62；−0.08(0.13)；0.31*；0.05/0.57；−0.42/1.04 | b 不顯著 |
| 25 | 隨機分派・Random（參照） | 46／64／110；–；0.38***；0.28/0.48；0.03/0.73 | 63／98／221；–；0.38***；0.27/0.49；−0.27/1.04 | — |
| 26 | 隨機分派・Not random | 3／3／12；−0.22(0.30)；0.16；−1.46/1.78；−1.69/2.02 | 5／6／14；−0.15(0.14)；0.23；−0.17/0.64；−0.83/1.30 | b 不顯著；這一類的平均效果本身也不顯著 |
| 27 | 篩選・Does not exclude（參照） | 41／52／92；–；0.35***；0.22/0.48；−0.06/0.75 | 55／74／157；–；0.38***；0.25/0.50；−0.29/1.04 | — |
| 28 | 篩選・Excludes highly accurate | 10／16／30；0.06(0.08)；0.41***；0.29/0.53；−0.04/0.86 | 16／30／78；−0.02(0.08)；0.36***；0.24/0.48；−0.35/1.07 | b 不顯著 |

作者的說法（L1380–1389）：「None of the covariates predicted statistically significant differences in the refutation effects using either IG or IGRM effects. … It is important to note that only a few studies use nonrandom assignment, and thus there were not enough studies with variation on this factor to draw a firm conclusion.」

### 驗證性調節分析（Table 5，原文檔 L1783–2155；內文 L1392–1394、L1756–1769、L2162–2183）

連續變項只有斜率 b(SE)，沒有各類別的 g。

| # | 調節變項・類別 | IGRM | IG | 顯著與否 |
|---|---|---|---|---|
| 29 | 相對參照連貫性（Rel referential cohesion） | 22／27／54；b = 0.001 (0.002) | 29／41／102；b = −0.002 (0.005) | 不顯著 |
| 30 | 相對因果連貫性（Rel causal cohesion） | 23／29／56；b = −0.007 (0.007) | 30／43／104；b = 0.003 (0.006) | 不顯著 |
| 31 | 相對敘事性（Rel narrativity） | 23／29／56；b = −0.003 (0.03) | 30／43／104；b = 0.008 (0.01) | 不顯著 |
| 32 | 相對句法簡單度（Rel syntactic simplicity） | 22／27／54；b = 0.008 (0.008) | 29／41／102；b = 0.01 (0.005) | 表內沒有星號 |
| 33 | 相對用詞具體度（Rel word concreteness） | 23／29／56；b = −0.004 (0.007) | 30／43／104；b = −0.02 (0.02) | 不顯著 |
| 34 | 篩選・Does not exclude（參照；控制其他三個共變項） | 41／52／92；–；0.42***；0.28/0.56；0.08/0.75 | 55／74／157；–；0.42***；0.27/0.57；−0.25/1.09 | — |
| 35 | 篩選・Excludes highly accurate | 10／16／30；0.02 (0.08)；0.45***；0.30/0.59；0.08/0.81 | 16／30／78；−0.04 (0.09)；0.37***；0.24/0.51；−0.33/1.08 | 不顯著；**驗證性假設（篩過的效果較大）不成立** |
| 36 | 教育情境・Embedded/Authority（嵌在真實課程且有權威者在場） | 8／14／28；0.16 (0.16)；0.50*；0.16/0.85；−0.02/1.04 | 13／21／49；0.04 (0.15)；0.47**；0.15/0.78；−0.34/1.28 | b 不顯著 |
| 37 | 教育情境・Not emb/Auth（參照） | 27／35／59；–；0.35**；0.16/0.53；−0.04/0.74 | 35／53／110；–；0.43***；0.28/0.59；−0.27/1.13 | — |
| 38 | 教育情境・Not emb/No auth | 4／5／8；0.23 (0.15)；0.58*；0.19/0.97；−0.10/1.26 | 4／6／17；−0.19 (0.14)；0.24；−0.09/0.58；−0.80/1.28 | b 不顯著；IG 這一類的平均效果不顯著 |
| 39 | 題型・Closed（參照） | 33／48／82；–；0.45***；0.28/0.62；0.08/0.82 | 46／74／129；–；0.45***；0.29/0.62；−0.21/1.11 | — |
| 40 | 題型・Open | 12／13／21；−0.14 (0.10)；0.31**；0.10/0.51；−0.11/0.72 | 26／38／60；−0.06 (0.08)；0.39***；0.21/0.57；−0.28/1.06 | 不顯著；**驗證性假設（開放題效果較大）不成立**，點估計方向相反 |
| 41 | 題型・Both | 6／9／17；0.02 (0.17)；0.48*；0.04/0.91；−0.11/1.06 | 16／29／42；−0.08 (0.06)；0.37***；0.20/0.54；−0.31/1.05 | 不顯著 |
| 42 | 成果信度（Cronbach's α） | 26／36／60；b = −0.009 (0.01) | 35／56／96；b = 0.005 (0.002) | 表內沒有星號 |

作者的說法：
- 文本特徵（L1765–1769）：「None of these moderators explained heterogeneity in the intervention effects, suggesting that the positive effect of refutation text on beliefs is relatively robust across circumstances.」假設原本是駁斥文字相對或絕對更連貫、更具體時效果較大（L553–554、L747–748）。
- 設計、樣本、情境、成果（L2175–2183）：「None of these moderators explained heterogeneity in the intervention effects. Although average effects were typically positive and statistically significant across various levels of these moderators, the positive average refutation text effect did not significantly differ from zero in one instance. Specifically, the refutation effect was not statistically significantly different from zero when the study content was not embedded and a person in authority was not present using IG effects.」
- 表裡的教育情境只有三類。假設段寫的是四類（嵌入且有引導者最大、不嵌入且無引導者最小、其餘居中，L815–822；Table 1 L705–706 也列四類），「Embedded without authority」沒有出現在 Table 5。原文沒有說明。

### 探索性調節分析（Table 6，原文檔 L2213–2751；內文 L1770–1778、L2157–2161、L2184–2208、L2753–2755）

| # | 調節變項・類別 | IGRM | IG | 顯著與否 |
|---|---|---|---|---|
| 43 | 學門・Physics（參照） | 10／14／24；–；0.49*；0.10/0.88；−0.09/1.07 | 17／34／76；–；0.54**；0.19/0.90；−0.26/1.33 | — |
| 44 | 學門・Geosciences | 12／19／41；−0.12 (0.20)；0.37*；0.10/0.64；−0.12/0.86 | 13／20／56；−0.14 (0.14)；0.40***；0.20/0.60；−0.34/1.14 | 不顯著 |
| 45 | 學門・Life sciences | 15／19／29；−0.05 (0.17)；0.44***；0.25/0.63；−0.01/0.89 | 21／28／54；−0.11 (0.18)；0.43***；0.21/0.65；−0.30/1.17 | 不顯著 |
| 46 | 學門・Social science | 12／16／28；−0.09 (0.19)；0.40**；0.15/0.65；−0.09/0.89 | 17／22／49；−0.20 (0.18)；0.34**；0.14/0.55；−0.39/1.08 | 不顯著 |
| 47 | 爭議性題材・No（參照） | 20／26／46；–；0.44***；0.25/0.59；0.05/0.83 | 35／55／115；–；0.39***；0.19/0.58；−0.32/1.09 | — |
| 48 | 爭議性題材・Yes | 29／42／76；0.04 (0.11)；0.40***；0.22/0.63；0.02/0.78 | 33／49／120；−0.06 (0.10)；0.46***；0.30/0.63；−0.24/1.16 | 不顯著；探索性假設（爭議題材效果較小）沒有得到支持 |
| 49 | 相對文本長度（Rel text length） | 37／51／91；b = −0.0006 (0.0004) | 48／72／174；b = −0.0006 (0.0004) | 不顯著 |
| 50 | 平均參照連貫性（Mn referential cohesion） | 20／25／51；b = −0.0005 (0.003) | 27／38／97；b = −0.005 (0.006) | 不顯著 |
| 51 | 平均因果連貫性（Mn causal cohesion） | 16／22／40；b = 0.002 (0.01) | 19／32／76；b = −0.001 (0.005) | 不顯著 |
| 52 | 平均敘事性（Mn narrativity） | 15／20／36；b = −0.01 (0.006) | 17／27／67；b = 0.004 (0.007) | 表內沒有星號 |
| 53 | 平均句法簡單度（Mn syntactic simplicity） | 9／13／28；b = −0.009 (0.007) | 16／27／74；b = 0.003 (0.006) | 不顯著 |
| 54 | 平均用詞具體度（Mn word concreteness） | 21／27／53；b = 0.0005 (0.003) | 25／37／94；b = −0.002 (0.003) | 不顯著 |
| 55 | 對照文本・One-sided（參照） | 41／56／100；–；0.44***；0.28/0.59；0.09/0.78 | 54／77／172；–；0.39***；0.24/0.55；−0.30/1.09 | — |
| 56 | 對照文本・Two-sided | 10／12／22；−0.10 (0.14)；0.34*；0.05/0.62；−0.10/0.77 | 16／27／63；0.16 (0.15)；0.55**；0.24/0.86；−0.21/1.32 | 不顯著；探索性假設（對上雙面文本效果較小）沒有得到支持，IG 的點估計方向相反 |
| 57 | 教育程度・Elementary | 3／5／14；−0.20 (0.17)；0.21；−0.49/0.91；−0.85/1.27 | 4／6／22；−0.16 (0.09)；0.28*；0.02/0.53；−0.74/1.29 | b 不顯著；IGRM 的平均效果不顯著 |
| 58 | 教育程度・Secondary | 7／12／20；0.10 (0.23)；0.51；−0.03/1.04；−0.17/1.18 | 9／14／30；0.17 (0.21)；0.61*；0.10/1.12；−0.29/1.51 | b 不顯著；IGRM 的平均效果不顯著 |
| 59 | 教育程度・College（參照） | 35／44／78；–；0.41***；0.23/0.58；0.006/0.80 | 52／78／169；–；0.43***；0.29/0.57；−0.25/1.12 | — |
| 60 | 女性比例（% Female） | 40／54／88；b = −0.009† (0.004) | 52／77／161；b = −0.007† (0.004) | **† p ≤ 0.10**（表註 L2751）；未達 .05 |
| 61 | 地區・North America（參照） | 29／40／74；–；0.38***；0.19/0.57；0.03/0.74 | 40／66／159；–；0.40***；0.25/0.56；−0.20/1.01 | — |
| 62 | 地區・Europe | 16／23／39；−0.02 (0.12)；0.36**；0.17/0.55；0.005/0.71 | 23／32／66；−0.10 (0.08)；0.31***；0.19/0.42；−0.29/0.90 | 不顯著 |
| 63 | 地區・Other | 4／5／9；0.38 (0.27)；0.76；−0.24/1.76；−0.37/1.89 | 5／6／10；0.62 (0.45)；1.02；−0.33/2.38；−0.57/2.62 | b 不顯著；這一類的平均效果在兩種分析都不顯著 |
| 64 | 國家科學信任度・Low（參照） | 45／63／110；–；0.44***；0.27/0.60；0.08/0.80 | 62／97／218；–；0.45***；0.28/0.62；−0.22/1.12 | — |
| 65 | 國家科學信任度・High | 4／5／12；0.09 (0.12)；0.34*；0.01/0.68；−0.31/0.99 | 6／7／17；0.22 (0.11)；0.23*；0.05/0.41；−0.66/1.13 | 表內 b 沒有星號；假設（高信任國家效果較大）沒有得到支持 |
| 66 | 成果測量時機（分鐘，連續） | 49／68／120；b = −0.000 (0.000) | 68／104／233；b = −0.000 (0.000) | 不顯著 |

作者的說法：
- RQ2B（L2159–2161）：「Again, none of these moderators predicted the refutation text effects. Average effects were typically positive and statistically significant across various levels of these moderators.」
- RQ3B（L2197–2208、L2753–2755）：「Again, none of these moderators explained heterogeneity in the intervention effects. Refutation text effects were robust across circumstances, including across control text type, education levels, gender of the sample, continent, country level of trust in science, and outcome measurement timing. Although average effects were typically positive and statistically significant across various levels of these moderators, the positive average refutation text effect on beliefs did not significantly differ from zero in a few instances. Specifically, using IGRM effects, the average effect of refutation text was not statistically significantly different from zero for either elementary or secondary students but was for college students. The refutation text effect was also not statistically significant across other continents outside of North America and Europe using either IG or IGRM effects.」

**26 個調節變項是否真的全部不顯著**：逐列對過 Table 4–6，在 p < .05 的標準下，26 個變項的每一個 b 係數都沒有星號，IG 與 IGRM 兩套分析都一樣。要一起記下的四點：
1. 女性比例在兩套分析都標了 †（p ≤ 0.10），方向是女性比例越高效果越小。內文把它歸在「robust across … gender of the sample」。
2. 有三個斜率的係數是標準誤的兩倍以上而表內沒有星號：成果信度 IG（0.005，SE 0.002）、相對句法簡單度 IG（0.01，SE 0.005）、國家科學信任度 IG（0.22，SE 0.11）。原文沒有給這些係數的 p 值或自由度（分析用小樣本校正的穩健變異估計，L1250–1252）；照表記錄為不顯著。
3. 有幾個類別的平均效果本身不顯著：非隨機分派（兩套分析）、不嵌入且無權威者（IG）、小學與中學（IGRM）、北美與歐洲以外（兩套分析）。
4. 作者自己說不顯著可能是檢定力不足（見下一節第 3 點）。

### 原文內部對不上的地方（照實記錄）

- L1277–1281：「294 effect sizes (both IG and IGRM versions of effects were able to be computed in 292 cases, only IG effects could be computed in 274 cases, and only IGRM effects could be computed in 123 cases)」。三個數字照字面無法同時成立。同段對正確信念的寫法是「both … in 98 cases, only IG … 222 cases, and only IGRM … 113 cases」，其中 222 與 113 就是 Table 3 的 IG 與 IGRM 效果量數，可見「only IG」在這裡指的是「算得出 IG 的」。哪個數字有誤，原文無從判斷。
- L1281–1282 說 75 個研究、237 個效果量以正確信念為成果；Table 3 的 IG 分析是 k = 67、IGRM 是 k = 49。
- Table 3 正確信念 IG 是 NS = 102、NES = 222；Table 4 同一列是 NS = 103、NES = 221。
- 錯誤信念的 p 值：內文「p < .001」「p < .002」（L1315–1316），Table 3 兩格都標 **（p < .01）。
- 學門：內文寫「five levels—geosciences, life sciences, physics/applied physics, social science」（L1776），只列了四個，Table 6 也只有四列；Table 1 的類別另有 Chemistry（L613）。
- 教育情境：假設與 Table 1 是四類，Table 5 只有三類（見上）。
- 摘要與內文都說納入「76 studies」，討論段說「a large sample of effects across 76 studies」（L2807–2808），一致。

## 作者自己的解釋與保留

1. **效果的定性是「小到中」「modest」**：「in the small-to-medium range」（L1309–1310）；「It is therefore possible that the impact of refutation texts is modest but stable across populations, content, and text features.」（L2817–2818）；結論「Our findings show that refutation texts are a modest but effective means of confronting misinformation.」（L3074–3075）；「Refutation texts should be considered as one, albeit limited, useful approach」（L3083–3084）。
2. **調節變項沒有解釋變異，所以「對誰有效、什麼情況有效」答不出來**（L2799–2806）：「Despite our best efforts to elucidate the circumstances in which these texts are and are not effective, it was not possible to definitively answer that question because our moderators did not explain variability in the observed effects. Said another way, our findings suggest that refutation texts consistently outperform their non-refutational counterparts with little variation in effects across different designs, groups of individuals, settings, topics, text features, or measures.」
3. **不顯著可能是檢定力不足**（L2807–2815）：「perhaps there were too few studies examining individual moderators of interest to detect a significant moderator effect, especially for certain moderators. For example, only five studies took place outside of America/Europe and only six countries in the analysis could be categorized as "high trust."」未來方向一節再講一次（L3057–3066）：「we might speculate that moderator analyses that have fewer than 10 studies are not adequately powered. However, research on power for overall average effects may not generalize to models with moderators. Researchers have yet to explore power for moderator analyses with dependent effect models.」
4. **「結構本身就是原因」是作者的推測**（L2823–2832）：「Perhaps the structure of a refutation text affords the opportunity for co-activation, which is the mechanism for change. … perhaps an Occam's razor argument is that structure itself accounts for the effect.」理論意涵一節說結果「may show the strongest support for the KReC framework」（L2897–2898），並提出要用工作記憶的測量去檢驗（L2908–2912）。
5. **三段式結構本身還沒有被系統性檢驗**（L2938–2942）：「These researchers could more systematically evaluate the three-part structure as described by Kendeou et al. (2014). This includes stating the misinformation, refuting it, and explaining the correct information. For example, future research might examine how alterations to this structure might impact the effectiveness of the text.」
6. **重複迷思與多重駁斥的風險還沒有評估**（L2953–2958）：「this literature also suggests that repeating misinformation is harmful as it may result in the reader remembering the misinformation, but not necessarily remembering that it is incorrect. Refutation texts that include multiple refutation statements should be evaluated to examine whether they cause readers to double down on incorrect beliefs or if, when carefully crafted, whether they can be an effective debunking strategy.」
7. **反效果（backfire）**：導言列出三種理論上的反效果，其中 familiarity effect 是讀者原本沒有那個迷思時，駁斥文字反而讓他知道了（L390–394）。結果的說法（L2778–2781）：「our meta-analysis found no evidence of widespread backfire effects.」原文沒有另外做反效果的檢定；這句是從整體效果為正推出來的（L406–408 說反效果會降低偵測到效果的能力）。篩掉信念已正確的人與否，效果沒有差別（Table 5）。
8. **糾正迷思不等於概念改變**（L2915–2918）：「We have argued that misconception correction cannot be equated with conceptual change unless readers can be shown to have restructured their conceptual knowledge.」導言也說根深柢固的概念可能需要比單篇文本更長、更互動的介入（L340–346）。
9. **不建議只靠文本教科學**（L2972–2988）：「we know of no one who suggests that refutations should be a primary method for teaching science in K-12, higher education, or any learning environment. … We do not recommend teaching science through text alone, even effective texts, in any level of education. We do see refutations as playing an important role when students hold misconceptions. Teachers may consider leveraging refutation texts as a starting point for interactive discussions when misconceptions are identified.」
10. **什麼時候值得針對迷思寫**（L2960–2971）：迷思特別有害、造成混淆、妨礙概念理解時；「A focus on building scientifically accurate knowledge is a laudable goal, especially when background knowledge is limited or non-existent.」
11. **在真實教學情境裡是否有效仍待檢驗**（L3011–3023）：「In this meta-analysis, we explored experimental studies, mostly outside of "authentic" instructional contexts. The question remains as to whether refutations are effective when they are embedded within instructional contexts. … If the effect is modest in experimental contexts as we saw here, it is worth exploring whether the effect holds up in real-world contexts」。
12. **情緒與態度**：三項都不顯著、每項只有 7 個研究（L1316–1320、L2934–2937「we only located seven studies including these constructs as outcome measures that met our selection criteria」）。
13. **與 Schroeder 與 Kucera 2022 的關係**：作者說結果支持那份的發現、效果量相近（L2774–2777）；指出那份只有 33 個研究、調節分析檢定力有限（L459），用的是沒有處理研究內效果相依的傳統隨機效果模型（L915–920）；自己納入的研究是那份的兩倍以上（L900–902）。討論段寫「Schroeder and Kucera (2022) also found no moderator effects」（L2816–2817）。這句和 Schroeder 與 Kucera 原文不完全一致：那份有一個顯著的調節變項（出版類型，見 `schroeder_kucera2022.md` 結果第 69 列）。
14. **前測的影響**（L422–432）：前測可能本身就促成迷思被喚起；作者轉述一份審查中的研究（Jin 等），有前測的人有優勢，但駁斥文字仍勝過說明文。這份統合分析的處理方式是 IG 與 IGRM 分開估，兩者結果相近（.37 與 .36）。
15. **導言承認既有回顧受到質疑**（L132–139）：「these findings have recently been met with skepticism (Zengilowski et al., 2021)」；題材集中在少數幾個主題（L433–439）。討論開頭也說先前的證據「has been mixed」（L2758–2760）。
16. **可以怎麼加強駁斥文字**（L3035–3054）：加圖、比喻、說服性論證「have shown modest success」；敘事元素、遊戲化還沒有被深入研究。這些是研究方向，不是這份統合分析的結果。

## 作者列的限制

Limitations 節（L2847–2888）逐條：

1. 信念以外的成果（態度、情緒）很少研究量（L2848–2853）。
2. 沒有深入分析各領域裡的具體概念，題材之間可能有沒被挖出來的差別（L2854–2856）。
3. 幾個調節變項變異很小或只在少數研究裡有測，檢定力受限；例子是小學生與歐美以外的研究很少（L2856–2865）：「several of our moderators had little variability or were only measured in a small number of studies, which limited our power to detect differences. … few studies engaged with students in elementary school or outside of the US/Europe.」
4. 樣本特徵資訊不足，例如種族常常沒報告（L2865–2873）。Table 1 也註明族裔「insufficient variability for analysis」（L697）。
5. 只收純文本、排除含互動或討論的研究，影響外部效度（L2874–2888）：「this choice comes with consequences for external validity. When used in classrooms for educational purposes, we suspect that refutation texts will often be used in combination with other activities, such as whole or small group discussion. … as these were not included here, this limits the generalizability of our findings.」

散在別處的限制：

6. 非隨機分派的研究太少，無法下定論（L1384–1389）。
7. 選擇模型假設效果量彼此獨立，套在相依資料上型一錯誤率可能膨脹，所以只看調整後的平均估計（L1269–1274）。
8. 沒有報告前後測相關的研究代入 r = 0.534；同一樣本多個成果假設 r = .80（L1205–1209、L1242–1243）。
9. 納入的研究多半不在真實教學情境（L3011–3012）。
10. 只收英文、只收科學題材、只收「typical functioning students」（納入標準 2、5、8）。

原文沒有說：納入文本的絕對長度（最長或平均多少字）。文本長度只編了駁斥文字與對照文本的差（Table 1 L635–637；Table 6「Rel text length」），導言舉的例子是「if the control text is approximately 1000 words in length」（L534–537）。受試者教育程度的分布只能從 Table 6 看：IG 分析裡大專 52 個研究、中學 9 個、小學 4 個。

## 與摘要不一致的地方

數字逐項對過，沒有不一致（71 篇、53 發表、18 未發表、76 個研究、111 個樣本、294 個效果量、26 個調節變項；L54–56 對 L1277–1278）。措辭上：

1. 摘要「We also found that moderators neither enhanced nor diminished the impact of the refutation texts」（L58–59）是肯定句。內文的說法較保留：「it was not possible to definitively answer that question because our moderators did not explain variability」（L2801–2803），並把檢定力不足列為可能原因（L2807–2811、Limitations 第三條）。
2. 摘要完全沒有給效果量的數字，也沒有提情緒與態度三項成果不顯著。摘要的標的寫「individuals' misconceptions about scientific information」（L53–54），沒有提還分析了情緒與態度。
3. 摘要「a consistent and statistically significant advantage … in controlled experiments」（L56–58）；內文與結論對大小的定性是 small-to-medium、modest（L1309、L3074）。摘要沒有用這兩個詞。
4. 摘要沒有提「不建議只靠文本教科學」「在真實教學情境是否有效仍待檢驗」這兩個保留。

## 與現有文章稿不一致的地方

「第 1 篇」＝ `2026-10-13-teaching-text-evidence.md`，「第 2 篇」＝ `2026-10-13-teaching-text-questions-feedback.md`。與 Schroeder 與 Kucera 共用的句子，這裡只對 Danielson 的部分。

### 第 1 篇

1. **第 9 行 tldr「把常見誤解明說出來再駁斥（兩份統合分析 0.37 與 0.41）……是證據最強的三種寫法」；第 33 行結論表「g = 0.37｜強；材料都是短文」**
   - 0.37 相符，是只用後測（IG）的正確信念效果；用前測調整的是 0.36（L1310–1312）。
   - 「材料都是短文」：這份原文沒有任何一句談納入文本的絕對長度，Limitations 也沒有這一條。這個限定只有 Schroeder 與 Kucera 那份支持。
   - 「強」：稿子的定義是「有統合分析、方向一致」（第 41 行）。原作者對效果大小的定性是 small-to-medium 與 modest（L1309、L3074），正確信念的 95% 預測區間跨過零（Table 3）。兩件事不衝突，但表裡只有「強」會讓人讀成效果大。
   - 建議：強度欄改成「兩份統合分析方向一致；原作者形容為小到中、modest」；「材料都是短文」註明出自 Schroeder 與 Kucera。

2. **第 81 行「駁斥文字（refutation text）有固定的三步」**
   - 這份原文的定義是「typically contain three important components」（L141）。納入標準把 conceptual change text 一併納入（L998–999）。作者自己說三段式結構還需要系統性檢驗、改動結構會怎樣還不知道（L2938–2942）。
   - 建議：「固定的」改成「通常有三個成分」。

3. **第 83 行「Robert Danielson 等人 2024 年那份事先註冊了分析計畫，收了 18 篇沒有發表的研究，得到 g = 0.37，而且沒有偵測到出版偏誤。」**
   - 預先註冊：相符（L978–980）。
   - 18 篇未發表：相符（L1277；單位是文章）。
   - g = 0.37：相符。
   - 「沒有偵測到出版偏誤」：原文是漏斗圖加 Egger 迴歸「show little evidence of publication bias」（L1349–1351）。選擇模型的結果只在補充資料，內文沒有數字，而且作者自己說這個方法在相依資料上有問題（L1269–1274）。稿子的說法大致相符，可改成「漏斗圖與 Egger 檢定都沒有偵測到」。
   - 稿子沒寫的一項：未發表研究的效果點估計較小（前後測變化 0.22 對 0.40；只用後測 0.31 對 0.39），差異不顯著（Table 4）。方向和 Schroeder 與 Kucera「學位論文 0.11」一致。稿子用「收了 18 篇沒有發表的研究」當作偏誤較小的理由，這個數字是同一件事的另一半。
   - 建議：補一句「未發表研究的估計較小（0.22 到 0.31），但和已發表的差異不顯著」。

4. **第 83 行「兩份獨立的綜整落在同一個範圍。」**
   - 「落在同一個範圍」：這份原作者自己也這樣說（L2774–2777「which showed a similar effect size advantage」）。相符。
   - 「獨立」：兩份的作者群不同，但納入的原始研究大量重疊。對照兩份的參考文獻：兩份都打星號（＝納入）的有 Kutza 2000、Nasim 2018、Peltier 等 2020、Rodrigues 與 Thacker 2019、Ramsburg 的學位論文，以及 Diakidoy 等的能源研究（那份編的是 2002 年的研討會版，這份編的是 2003 年的期刊版）。Schroeder 與 Kucera 的轉出檔裡，多數條目的星號在轉檔時掉了，但那份內文點名當作已編碼例子的研究（Adesope 等 2017、Aguilar 等 2019、Liu 與 Nesbit 2018、Mason 等 2017、Yürük 與 Eroğlu 2016、Ariasi 與 Mason、Wang 與 Andre 1991），在這份的參考文獻裡也都有星號（L3115–3123、L3143、L3414、L3446、L3708、L3732）。完整的重疊篇數要對兩份的補充資料才算得出來，這裡沒有算。Danielson 等人自己的描述是納入的研究是那份的兩倍以上（L900–902），也就是後一份大致涵蓋前一份。兩個數字接近，有一部分是因為算的是同一批研究。
   - 建議：把「獨立」拿掉，改成「兩個團隊各做一次，納入的研究有不少重疊，後一份的研究數是前一份的兩倍多」。

5. **第 85 行「兩份的限制也一致。……Danielson 等人指出，絕大多數研究只量了讀者相不相信正確說法，很少量情緒與態度，小學生與歐美以外的樣本也很少。」**
   - 「很少量情緒與態度」：相符（L2848–2851）。
   - 「小學生與歐美以外的樣本也很少」：相符（L2860–2862）。
   - 「只量了讀者相不相信正確說法」：原文是「very few studies have examined outcomes other than beliefs」。作者把 beliefs 和學習成果當同一件事（L472–473），納入的測驗含選擇題、申論、自由回想（Table 1）。寫成「相不相信」會讓人以為沒有量知識；較貼近原文的說法是「絕大多數研究只量信念／知識這一類成果」。
   - 「兩份的限制也一致」：對不上。Schroeder 與 Kucera 列的是短文、一次性閱讀、先備知識無法分析、報告不全；這份列的是其他成果太少、沒有細分概念、調節分析檢定力不足、樣本資訊不足、排除互動式介入影響外部效度。重疊的只有「非大專與非歐美樣本少」。這份完全沒有提文本長度。
   - 漏掉這份的兩條限制，都和本站的用途直接相關：排除了搭配討論或互動的研究（L2874–2888）；納入的研究多半不在真實教學情境，作者說在教學情境裡是否有效仍待檢驗（L3011–3019）。
   - 建議：刪掉「也一致」，兩份的限制分開寫；補上「只收純文本、多半在實驗情境」。

6. **第 91 行「做法：每篇挑一到兩個讀者真的會有的誤解，照三步寫。不要只在正文寫正確的版本……」**
   - 「讀者真的會有的」：和原文的顧慮方向一致（familiarity effect，L390–394）。但這份的結果是：有沒有篩掉信念已經正確的人，效果沒有差別（Table 5 篩選，b 不顯著），驗證性假設不成立。稿子沒寫這個結果。
   - 「一到兩個」：原文沒有談數量。相關的一句是含多個駁斥句的文本會不會讓讀者記住迷思、反而更堅持，還沒有被評估（L2953–2958）。可以拿來支持「不要放太多」，但那是原作者列的待研究問題，不是結果。
   - 稿子沒寫的保留：作者不建議只靠文本教科學（L2984–2985），認為駁斥文字是「one, albeit limited, useful approach」（L3083–3084）。
   - 建議：標成作者自己的做法；補「駁斥句放多了會不會有反效果，原作者列為還沒有研究的問題」。

7. **第 203 行附錄**（逐項）：
   - 「預先註冊；71 篇文章（53 篇已發表、18 篇未發表）、76 個研究、111 個樣本、294 個效果量，總樣本 10,265 人，1986 到 2021 年」→ 全部相符（L978–980、L1277–1278、L1299–1301）。
   - 「對正確信念 g = 0.37（67 個研究）；對錯誤信念 g = −0.38（10 個研究）」→ 相符，都是只用後測（IG）的數字（Table 3）。沒有交代另一套前後測變化的估計（0.36，49 個研究；−0.31，6 個研究）。
   - 「對正面情緒、負面情緒、態度的效果都不顯著」→ 相符（L1316–1320；各 7 個研究）。
   - 「Egger 檢定對各項結果都不顯著」→ 相符（L1337–1349，七項）。
   - 「檢驗的 26 個調節變項沒有一個增強或減弱效果」→ 這是摘要的句子（L58–59）。逐列對過 Table 4–6，p < .05 下確實沒有任何一個係數顯著。但內文的說法較保留，而且作者自己說可能是檢定力不足（L2801–2811、L2856–2859）；另有女性比例在兩套分析都是 p ≤ 0.10。審稿報告指出這句出自摘要與限制段、而稿子沒細讀調節變項的表，判斷正確。
   - 建議改成：「26 個調節變項在 p < .05 下都不顯著（女性比例 p ≤ .10）；作者說部分分析的研究數太少，可能是檢定力不足。」

8. **第 232 行參考資料「讀了摘要、分析方法、整體結果、出版偏誤與限制……個別調節變項的表沒有細讀」** → 自述的讀取範圍和稿子用到的內容對得上。上面第 5、6 條漏掉的保留落在 Limitations 末段、Practice and policy implications、Future directions，後兩節不在稿子自述讀過的範圍內。

### 第 2 篇

9. **第 165 行對照表「指出常見誤解｜駁斥文字，兩份統合分析 0.37 與 0.41｜有支持；規格沒寫三步結構」** → 數字相符。「規格沒寫三步結構」當成缺口：這份原文說三段式結構本身還沒有被系統性檢驗（L2938–2942），所以它支持的是「把迷思講出來並駁斥，勝過不講」，不是「一定要照三步」。

10. **第 178 行建議 4「『常見誤解』寫成三步：寫出錯誤的想法，明說它錯，給正確的解釋。只寫正確版本不算指出誤解。」**
    - 後半句有支持：對上單面的非駁斥文本，效果 0.39 到 0.44（Table 6 對照文本 One-sided）。
    - 前半句同第 9 條。
    - 稿子沒帶的保留：這份排除了搭配討論與互動的研究、多半不在真實教學情境（限制第 5 條、L3011–3019）；作者說糾正一個迷思不等於概念改變（L2915–2918）。
    - 審稿報告判建議 4「站得住。兩份統合分析比的就是這個結構對一般說明文。限制（短文、多半只量信念）文章有寫」。就這份而言要修正兩點：「短文」不是這份的限制；這份納入的是「refutational or conceptual change text」，作者明說結構怎麼改會影響效果還不知道。
    - 建議：規格寫成「把迷思寫出來並駁斥」，三步列為建議的寫法而不是研究結論。

11. **第 267 行參考資料列** → 只是連結清單，沒有主張。相符。

### 審稿報告相關項目的確認

- 審稿報告「需要判斷的事 (1)」說 Danielson 2024 可以列、文章用到的數字都在讀過的章節、唯一踩線的是附錄「26 個調節變項」那句：數字部分確認相符；踩線的不只那一句，還有第 1 條（短文不是這份的限制）、第 4 條（獨立）、第 5 條（限制一致）。
- 審稿者沒有找到的同類問題：第 1、3、4、5、6 條。

合計 11 條；其中相符 2 條（第 8、11 條），其餘 9 條是只取一半、漏掉保留、把另一份的限制算到這份頭上，或用詞超出原文。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–400 | 期刊資訊、作者、摘要、導言（錯誤資訊、駁斥文字的定義、三個理論架構、理論上的批評與反效果） |
| 2 | L401–800 | 方法上的批評（前測、題材狹窄）、與 Schroeder 與 Kucera 的關係、本研究的目的與各調節變項的假設（文本特徵）、Table 1 全表、設計／樣本特徵的假設前半 |
| 3 | L801–1200 | 樣本、情境、成果特徵的假設，為什麼需要新的統合分析、RQ1–RQ3B、方法（納入標準、六種檢索途徑、篩選與編碼、Table 2、效果量計算前半） |
| 4 | L1201–1600 | 效果量計算後半、分析策略、結果（納入數量、RQ1 整體效果、出版偏誤、調節分析總說、共變項）、Table 3 全表、Table 4 前半 |
| 5 | L1601–2020 | Table 4 後半與表註、RQ2A 敘述、RQ2B 開頭、Table 5 前半 |
| 6 | L2021–2420 | Table 5 後半與表註、RQ2B 結果、RQ3A、RQ3B 敘述前半、Table 6 前半 |
| 7 | L2421–2870 | Table 6 後半與表註、RQ3B 敘述後半、討論、調節變項的討論、限制前四條 |
| 8 | L2871–3320 | 限制第五條、理論意涵、實務與政策意涵、未來方向、結論、聲明與經費（L3090–3111）；L3113 起是參考文獻 |
| 9 | L3321–3742 | 參考文獻（L3113–3742，書目，掃過；有留意星號標記的納入研究，用來對照 Schroeder 與 Kucera 的納入清單） |
| 對表 | `pdftotext -layout` 輸出的第 740–780、900–1160 行 | Table 2、Figure 2 的位置（圖內文字抽不出來）、Table 3–6 的版面，逐列對 k、NS、NES、b(SE)、g、CI、PI |

原文沒有註腳（只有 Table 1 的表註 a、b，L735–737）與附錄。

## 補記（2026-10-14，複審後整理）

原文檔最後一行沒有換行符號，`wc -l` 少算一行；多出的那一行只有換頁字元，沒有內容。
