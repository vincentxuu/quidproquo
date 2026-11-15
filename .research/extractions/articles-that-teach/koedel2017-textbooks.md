# 抽取紀錄：Koedel、Li、Polikoff、Hardaway、Wrabel 2017，AERA Open 3(1)

**書目**：Cory Koedel、Diyi Li（University of Missouri）、Morgan S. Polikoff、Tenice Hardaway（University of Southern California）、Stephani L. Wrabel（The RAND Corporation）。Mathematics Curriculum Effects on Student Achievement in California. *AERA Open*, January–March 2017, Vol. 3, No. 1, pp. 1–22. DOI: 10.1177/2332858417690511。作者全名與單位對 PDF 第 1 頁與第 22 頁「Authors」核過。授權 CC BY 3.0（第 1 頁頁尾）。

**原文檔**：`.research/raw/learning-content/q6-evaluate/koedel2017textbooks.pdf`（22 頁）；文字檔 `koedel2017textbooks.txt`（`pdftotext -layout`，1,342 行、152,460 字元）。
**讀取用的版本**：原文是雙欄，`-layout` 版左右欄交錯，所以用不帶 `-layout` 的 `pdftotext`（26.07.0）重轉（2,809 行、109,420 字元，放在 scratch，沒有存回原目錄；同一指令可重現）。下面的行號一律寫成「R 行號」，指這份重轉檔；同時附 PDF 頁碼（PDF 頁碼等於期刊頁碼）。
**讀取日期**：2026-10-14
**版本**：刊出版（出版者排版的 PDF）
**供哪幾篇使用**：order 27（把別人的課重新講一次，值得嗎）
**表格對照**：Table 1–6、Table A1、B1、B2、B3 全部對過 PDF 版面（讀 PDF 第 4、8、10、13、14、16、17、18 頁），下面的數字都是對過版面的。Figure 1–3 與 Figure B1 是看 PDF 第 11、12、18 頁的圖。

## 研究設計

- **類型**：準實驗（觀察性資料 + 傾向分數配對），不是隨機分派。作者自稱「quasiexperimental evaluation」（R83–85，p.2）。
- **比較的東西**：加州 2008 年秋與 2009 年秋那一輪採用的四套最多學校用的小學數學教科書（R183–186，p.3）：
  - *enVision Math California*（Pearson Scott Foresman）
  - *California Math*（Houghton Mifflin）
  - *California Mathematics: Concepts, Skills, and Problem Solving*（McGraw Hill）
  - *California HSP Math*（Houghton Mifflin Harcourt）
- **最後的比較對象**：*California Math* 對「另外三套合起來的組合」（composite alternative），不是四套各自互比。這個設計是看過六組兩兩比較的初步結果之後才改的（見結果 14–17）。
- **分析單位**：學校（不是學生）。成績是學校平均的州標準化測驗分數；標準誤一律在學區層級群集（R237–247、R479–480，p.3–4）。採用決定多半在學區層級做，16.5% 的學區內有學校採用不同教材（R241–242）。
- **樣本**（Table A1，p.14；Table 1，p.4）：
  - 起始母群 5,494 所學校、825 個學區。
  - 扣掉：教科書檔沒有紀錄 339 所（6.2%）、教科書資訊無法判定 804 所（14.6%）、採用年不是 2008 或 2009 的 876 所（15.9%）、一到三年級沒有用同一套或無法確定 481 所（8.8%）、年級範圍資料衝突 33 所、缺成績資料 48 所、不是四套之一 632 所（11.5%）。
  - 初始分析樣本 2,281 所、311 個學區；再扣掉洛杉磯聯合學區（LAUSD）與長灘聯合學區（LBUSD）403 所，最後 1,878 所、309 個學區，占起始母群學校的 34.2%。
  - 依教科書：enVision 710 所（107 學區）、California Math 602 所（92 學區）、California Mathematics 389 所（69 學區）、HSP Math 177 所（48 學區）。
  - 實際進入主要比較（共同支持域內）的學校數逐年略有不同：Year 1 是 California Math 92 學區／597 所，組合對照 213 學區／1,143 所（Table 2、3）。
- **年級與量測**：主要是三年級的州數學標準化測驗；延伸到四、五年級。資料涵蓋 2003–2013 學年（R153–161，p.2）。
- **何時量**：採用後第 1 到第 4 年（Year 1–4）各估一次。Year 1 的三年級生只在三年級用新書；Year 2 的學生二、三年級用；Year 3、Year 4 的學生一到三年級都用（R808–811、R955–957，p.7–8）。
- **教科書資料來源**：作者人工從各校 2013 年的 School Accountability Report Cards（SARC，PDF）抄錄（R82–83，p.2）。
- **三種估計法**（R233–237，p.3）：(a) 核配對（kernel matching，Epanechnikov kernel）；(b) 限制在共同支持域內的 OLS（restricted OLS）；(c) 用樣本外資料先把成績殘差化再配對（remnant-based residualized matching；樣本外資料是那 632 所採用其他教科書的學校，Appendix C，p.19）。
- **配對用的共變數**：22 個（Table B3）：採用前的學校與學區數學、英語成績、性別／種族／英語學習者／社經弱勢比例、學校與學區人數（一次、二次、三次項）、2008 或 2009 採用、郵遞區號層級的家戶所得中位數與低教育比例等（R533–541，p.5）。
- **效果量單位**：分析在學校層級做，事後乘以 0.45（學校平均分數標準差對學生層級標準差的比值）換成學生層級標準差（Table 3 註；註 12，R2596–2605，p.21）。英語科用 0.47（Table 5 註）。
- **標準誤**：拔靴法 250 次，以學區為單位重抽（R584–585、R515，p.5）。
- **識別假設**：條件獨立假設（CIA），三種方法都靠它（R637–640，p.6）。作者用兩種反證檢定（falsification test）找違反的跡象：採用前世代的「假效果」，以及數學教科書對英語科成績的「效果」。

## 結果（逐項）

### 主要結果：三年級數學（Table 3，p.8，R890–953）

對照條件一律是「採用 California Math 的學校 vs 採用另外三套之一的學校（組合對照）」，單位是學生層級標準差；括號內是標準誤；`**` 是 p ≤ .05。

| # | 估計法 | Year 1 | Year 2 | Year 3 | Year 4 |
|---|---|---|---|---|---|
| 1 | 核配對 | 0.063（0.054） | 0.083（0.051） | 0.061（0.059） | 0.070（0.059） |
| 2 | Restricted OLS | 0.050（0.019）** | 0.064（0.023）** | 0.049（0.023）** | 0.058（0.023）** |
| 3 | Remnant 殘差化配對 | 0.050（0.020）** | 0.065（0.024）** | 0.052（0.024）** | 0.060（0.026）** |
| | 學區／學校數（California Math） | 92/597 | 89/588 | 91/595 | 90/590 |
| | 學區／學校數（組合對照） | 213/1,143 | 214/1,145 | 216/1,146 | 213/1,144 |

- 4. **核配對的四個估計值都沒有達到顯著**（Table 3 沒有任何星號）。摘要的「0.05 到 0.08」上限 0.08 來自核配對 Year 2 的 0.083，那一格不顯著。達到 p ≤ .05 的估計值範圍是 0.049–0.065。原文一句（R958–962，p.8）：「The point estimates from all three estimation strategies are similar and indicate effect sizes on the order of 0.05 to 0.08 student-level standard deviations of achievement. However, the standard errors for the matching estimates are much larger than for the OLS or remnant-residualized estimates.」
- 5. **作者自己說核配對在概念上比較可取**（R966–969，p.8）：「The cost of the improved precision is that the linear specification may be wrong, which is a reason that the parametrically less-restrictive matching estimators are preferred conceptually. That said, our falsification tests below suggest that our use of the linear functional form to improve precision does not result in biased estimates.」
- 6. **沒有劑量效果**：用了三年的世代（Year 3、4）效果沒有比只用一到兩年的世代（Year 1、2）大（R970–979，p.8–9）：「It is somewhat surprising that the treatment effect estimates do not become more pronounced over time in Table 3. … but no such pattern emerges.」作者列三個可能解釋，都是推測：有劑量效果但檢定力不足以偵測；最近一年用的教科書才是主要處理（與介入效果消退的文獻一致）；教材品質各年級不穩定（R979–996）。
- 7. **換算成學校排名**（結論，R1335–1338，p.12）：「which would move the 50th percentile school to roughly the 54th to 56th percentile in the school-level distribution of average test scores.」註 20（R2652–2653）：0.05／0.08 學生層級標準差相當於 0.11／0.18 學校層級標準差。

### 反證檢定（Table 4、Table 5，p.10）

| # | 結果 | 數字 | 表 | 原文一句 |
|---|---|---|---|---|
| 8 | 採用前世代（Year P3–P6）的三年級數學「假效果」 | 核配對 0.010、0.023、0.017、0.017（標準誤 0.051–0.056）；OLS 0.002、0.015、0.006、0.010（0.014–0.018）；Remnant 0.001、0.018、0.014、0.011（0.014–0.024）。全部不顯著 | Table 4（R1070–1131） | 「the false “effects” of California Math relative to the composite alternative are substantively small and far from statistical significance.」（R1011–1013，p.9） |
| 9 | 數學教科書對三年級英語科成績（採用前後 8 個年度） | 核配對 0.002–0.043；OLS −0.003–0.019；Remnant −0.005–0.020。全部不顯著。採用後四年的 OLS 是 0.012、0.019、−0.003、0.004 | Table 5（R1133–1250） | 「all of our estimates in Table 5 are small and statistically insignificant.」（R1015–1016，p.9） |
| 10 | 作者對反證檢定能證明什麼的界定 | 不能確認假設成立，只能找違反的證據 | Conditional Independence 節 | 「The falsification estimates cannot be used to confirm the satisfaction of the CIA because, as noted above, it is not possible to confirm with certainty that the CIA is upheld.」（R694–697，p.6） |
| 11 | 反證檢定的一個弱點 | 不知道各校這一輪之前用哪一套教科書，只能用過去成績代替 | Falsification Tests 節 | 「One issue with the falsification models is that we do not know which curriculum materials were used by schools prior to the curriculum adoption we study. No such longitudinal data on curriculum materials adoptions exist」（R1038–1041，p.9） |

留意：採用前的核配對「假效果」點估計（0.010–0.023）雖然不顯著，量級約是主要效果（0.061–0.083）的六分之一到三分之一。原文沒有討論這一點，這是我對表的觀察。

### 傾向分數與共變數平衡（Table 2、B2、B3）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 12 | 傾向分數模型的解釋力 | Pseudo R² = 0.1221，N = 1,878；顯著的預測變數只有學區人數的一次（−0.167，p ≤ .10）、二次、三次項（p ≤ .05） | Table B2（p.17）；R743–757（p.7） | 「The propensity score model in Equation (2) explains roughly 12% of the variance in curriculum adoptions … Thus, collectively, the covariates do not predict adoptions of California Math well.」 |
| 13 | 配對後的平衡 | 22 個共變數，配對 t 檢定在 5% 水準下每一年都是 0 個不平衡；平均絕對標準化差異 2.8%–3.6%；Smith-Todd 迴歸檢定每年 1–3 個不平衡，平均 p 值 0.46–0.51 | Table 2（p.8，R813–888） | 「There are 22 covariates in total, and none are unbalanced at the 5% level.」（R789–790） |

內文對 Table B2 的描述（「The only statistically significant predictors … are the linear, squared, and cubed district enrollment variables」，R749–751）與表有一點出入：表上一次項只到 p ≤ .10。同一個樣本外迴歸裡，這組共變數解釋成績的 R² 是 0.74（註 11，R2590–2595）。

### 六組兩兩比較（Table B1，p.16，R1815–2075）

只用核配對；括號內標準誤；數字是 Year 1／2／3／4。

| # | 處理 vs 對照 | 處理效果 | 顯著性 |
|---|---|---|---|
| 14 | California Math vs enVision | 0.048（0.063）／0.059（0.066）／0.041（0.058）／0.054（0.061） | 都不顯著 |
| 15 | California Mathematics vs California Math | −0.087（0.072）／−0.152（0.077）**／−0.110（0.072）／−0.091（0.076） | 只有 Year 2 顯著 |
| 16 | HSP Math vs California Math | −0.063（0.063）／−0.065（0.057）／−0.039（0.072）／−0.059（0.076） | 都不顯著 |
| 17a | California Mathematics vs enVision | 0.010／−0.017／−0.003／0.005（標準誤 0.058–0.066） | 都不顯著 |
| 17b | HSP Math vs enVision | 0.065／0.004／−0.009／0.013（標準誤 0.078–0.106） | 都不顯著 |
| 17c | HSP Math vs California Mathematics | 0.016／0.021／0.058／0.028（標準誤 0.079–0.091） | 都不顯著 |

- 24 個估計值裡只有 1 個達到 p ≤ .05。
- 「另外三套差不多」的依據就是 17a–17c 這 12 個不顯著、標準誤 0.06–0.11 的點估計。作者的用詞是「point toward」「suggestive」（R730–732，p.7：「collectively, the pairwise comparisons point toward California Math being more effective than the other three textbooks. Moreover, they also point toward the other curricula having similar effects.」；註 21，R2654–2656：「the suggestive results from our initial pairwise comparisons … imply that the other three curricula are similarly effective」）。
- 兩兩比較的平衡較差：平均標準化差異 3.9–6.7，Smith-Todd 不平衡的共變數 3–11 個、平均 p 值 0.21–0.57（Table B1）。作者：「In all pairwise comparisons, the Smith and Todd (2005) regression tests indicate imbalance in one form or another」（R2088–2091，p.17）。
- **研究設計是看過這批結果後才改的**（R710–715、R732–734，p.6–7）：「To arrive at this final research design, we began by examining all six possible pairwise comparisons across the four curricula. After performing the six comparisons, it became clear that it would be difficult to obtain meaningful insight from them individually.」「It is these preliminary results that motivate our comparison of California Math to the composite alternative.」

### 四、五年級（Figure 2、Figure 3，p.11–12）

這一段的數字只在長條圖裡，正文沒有表，下面的數值是我從圖上目測的，**不能當精確數字引用**。

| # | 結果 | 內容 | 原文一句 |
|---|---|---|---|
| 18 | 四年級 | 採用後四年全部是正的點估計，目測約 0.025–0.06；5% 顯著的只有 Year 2 的 OLS 與 Remnant 兩根，Year 1 的 OLS 是 10% | 「the estimates in Grade 4 are all nominally positive and sometimes statistically significant」（R1061–1062，p.9）；結論：「although the Grade 4 estimates are always nominally positive, they are smaller and mostly insignificant」（R1339，p.12） |
| 19 | 五年級 | 比三年級大，OLS 與 Remnant 目測約 0.045–0.10；圖上每一年這兩種估計法都有標記 | 「the estimates in Grade 5 are larger than in Grade 3 and statistically significant in all posttreatment years, at least using restricted OLS and remnant-based residualization.」（R1062–1064，p.9）；結論用的是「suggestively larger」（R1338–1339） |
| 20 | 方向 | 沒有任何年級或年度顯示負向 | 「There is no evidence to suggest a negative relative effect of California Math in any grade or year.」（R1064） |
| 21 | 四年級的凹陷 | 作者覺得費解，推測教材各年級的相對效果不一樣；提醒不要過度解讀 | 「it is somewhat puzzling that they are smallest in Grade 4.」（R1065–1066）；註 17：「we caution against overinterpreting this one result, which may be unique to the particular curricula we evaluate or could be the product of sampling variability.」（R2628–2632） |
| 22 | 樣本流失 | 四年級分析少 2.5% 的學校，五年級再少 1.5% | 註 15（R2614–2621） |

Figure 3 的 Year 4 那組標記是一個 † 加兩個 *，哪一個符號屬於哪一根長條，圖上分不清楚；與內文「OLS 與 Remnant 每年都顯著」是否完全一致，我無法從圖確認。

### 依社經弱勢身分分組（Table 6，p.13，R1345–1563）

三年級數學；括號內標準誤；`*` p ≤ .10，`**` p ≤ .05。只列採用後四年（採用前四年的「假效果」見下一列）。

| # | 組別／估計法 | Year 1 | Year 2 | Year 3 | Year 4 |
|---|---|---|---|---|---|
| 23 | 非弱勢／核配對 | 0.104（0.048）** | 0.084（0.043）** | 0.046（0.043） | 0.035（0.055） |
| | 非弱勢／OLS | 0.045（0.027）* | 0.054（0.028）* | 0.032（0.032） | 0.022（0.030） |
| | 非弱勢／Remnant | 0.055（0.027）** | 0.062（0.028）** | 0.045（0.035） | 0.027（0.039） |
| 24 | 弱勢／核配對 | 0.075（0.032）** | 0.087（0.032）** | 0.078（0.034）** | 0.109（0.038）** |
| | 弱勢／OLS | 0.059（0.023）** | 0.068（0.025）** | 0.062（0.025）** | 0.083（0.026）** |
| | 弱勢／Remnant | 0.063（0.027）** | 0.069（0.028）** | 0.067（0.031）** | 0.089（0.030）** |

- 25. 採用前的「假效果」：非弱勢組核配對 P6 = 0.077（0.047）、P4 = 0.051（0.050），不顯著但點估計不小；弱勢組 0.010–0.024。作者：「the falsification tests are generally as expected, although some are nominally larger than their analogs in the main tables.」（R1311–1312，p.12）
- 26. 作者的判讀（R1313–1328，p.12）：「the positive relative effect of California Math is driven disproportionately by its effect on achievement for socioeconomically disadvantaged students.」緊接著：「we do not interpret the suggestive evidence of heterogeneous effects in Table 6 too strongly but identify this as an area of potentially interesting future research.」也說沒有一組變差：「neither group is made worse off」。
- 樣本：非弱勢模型 California Math 65–72 學區／380–454 所；弱勢模型 80–86 學區／473–548 所（Table 6 下半）。

### 和先前研究比、成本與規模的論證

| # | 內容 | 位置 | 原文一句 |
|---|---|---|---|
| 27 | 比先前同類研究小 | 導言，R102–106（p.2） | 「The differential curriculum effects that we document in California are on the lower end of the range of estimates reported in similar recent studies, which have been between 0.08 and 0.17 student-level standard deviations (Agodini et al., 2010; Bhatt et al., 2013; Bhatt & Koedel, 2012).」 |
| 28 | 為什麼比較小：作者說只能猜 | 結論，R1585–1598（p.13–14） | 「We can only speculate as to why we find smaller differential curriculum effects in California than in previous studies.」候選解釋：加州這幾套書彼此比較像、加州的情境使教材效果較小、抽樣變異。 |
| 29 | 成本論證 | R97–101（p.2）；註 1（R2521–2525） | 「the marginal cost of choosing one textbook over another is so small that it is effectively zero.」註 1：作者**不知道**這四套書的定價；引 Boser 等 2015，小學數學教科書平均每生 34 美元，約占每生支出 0.32%。 |
| 30 | 規模論證 | 結論，R1571–1574（p.13） | 「an alternative intervention targeted at 10% of the student population would need to have an effect 10 times as large as the California Math effect to generate as large an increase in student achievement overall (ignoring spillovers).」 |
| 31 | 不知道這本書好在哪 | 結論，R1611–1612（p.14）；Appendix B，R1786–1802（p.15） | 「even if the features that make some curricula outperform others remain unidentified.」Appendix B：「Other than this, we were unable to find information about the Houghton Mifflin and Harcourt books.」已知的只有 California Math 與 HSP Math 都是 2001 年那一輪州採用版本的更新版。 |
| 32 | 文獻量 | 結論，R1599–1602（p.14） | 「Ours is one of only a small handful of rigorous studies to test for impacts of textbooks on student achievement in mathematics. Moreover, we are not aware of any similar studies in a subject outside of mathematics.」 |
| 33 | 選書過程 | 註 9（R2581–2587） | 訪談 21 位學區行政人員；決定多由以教師為主的委員會做，沒有發現強勢的單一決策者。原文沒有給訪談方法或抽樣方式。 |
| 34 | 州審定 | R226、R224–225（p.3） | K–3 共核定 10 套；出版商送審的教材近三分之一沒過。四套都通過五項標準（Appendix B）。 |

## 作者自己列的限制

原文沒有 Limitations 節，散在各處：

1. **識別靠條件獨立假設，無法直接檢定**（R640、R694–697）。最大的概念性威脅是「決策者品質」沒觀察到：好的領導者可能同時選到好書又做了其他提高成績的事（R676–693，p.6）：「such bias is arguably the biggest conceptual threat to the CIA in our application.」作者也說：「we are not aware of any empirical evidence that can rule out the importance of district administrators in influencing curriculum adoptions」。
2. **教師品質沒有直接控制**（R658–673，p.6）；作者的辯護是教師品質的變異多半在校內。
3. **OLS 與 Remnant 兩法多加了線性函數形式的假設**，假設錯了會有偏誤（R564–573、R966–969）。
4. **檢定力有限、有效樣本小**（R722–729，p.7）：「our effective sample sizes in the pairwise comparisons are no larger in California than in previous studies in smaller states.」中等大小的劑量效果排除不了（R981–983）。
5. **兩兩比較的共變數平衡「mediocre」**（R716–718）。
6. **不知道各校前一輪用哪套書**（R1038–1045）。
7. **教科書資料品質**：20.8% 的學校沒有報或報得無法判定（R1723–1724，p.15）；樣本只剩「just over half of the schools」（R179–180），再限四套書與剔除兩大學區後是 34.2%。分析樣本相對全州是「negatively selected … but not substantially」（R204–205，p.3）。
8. **講不出教科書之間差在哪**：關於加州版與全國版的差異「little or no publicly available information」（R1764–1766，p.15）；要把教科書特徵連到效果，目前「underidentified—that is, there are too many potential explanations and too few achievement-based estimates」（R118–122，p.2）。
9. **成績只是州測驗**：結果該占多少份量「will depend on how decision makers value achievement as measured by state assessments」（R1579–1582，p.13）。
10. **分組分析的假設沒有另外檢查**（註 19，R2636–2651）：整體條件獨立成立不保證各子群也成立。
11. **剔除 LAUSD 與 LBUSD 是分析開始之後才做的**（R189–193，p.3：「after our analysis began, we also dropped data from the Los Angeles Unified School District (LAUSD) and Long Beach Unified School District (LBUSD).」）；理由是這兩個學區太大、造成可比性問題（註 4，R2542–2551）。作者沒有把它當限制，也沒有報告包含這兩個學區時的結果。

原文沒有說、但引用時要知道的（我的觀察，不是作者的話）：(a) 主要比較的設計是看過六組兩兩比較後才定的，沒有事前註冊；(b) 研究的是 2008–2013 年、對齊加州 1997 年內容標準的版本，四套都是已經過州審定的教科書，比較的是「審定過的教科書之間」的差異；(c) 沒有任何教材實際使用情形（教師怎麼用、用多少）的資料。

## 與摘要說法不一致的地方

逐項對過，數字沒有錯，但有三處摘要說得比內文滿：

1. 摘要：「raising student achievement by 0.05 to 0.08 student-level standard deviations」（R22–23）。內文 Table 3：上限 0.08 來自核配對（0.083），而核配對四個估計值都不顯著；顯著的 OLS 與 Remnant 估計值是 0.049–0.065。摘要沒有提顯著性因估計法而異。
2. 摘要：「is more effective than the other three」。內文的主要比較是對「三套的組合」；對三套各自的比較（Table B1）12 個估計值裡只有 1 個顯著，作者在內文用的是「point toward」。
3. 摘要：「We also estimate positive effects of California Math relative to the other textbooks in higher elementary grades.」內文：四年級「smaller and mostly insignificant」（R1339），五年級「suggestively larger」。
4. 摘要的「effectively zero marginal cost」：內文註 1 承認不知道這四套書的價格，是依其他研究推論各套單價相近。

另有一處排版問題（不影響數字）：正文的註腳標號從第二個「16」起比文末註釋少一號。正文有兩個 16（p.10 與 p.11），之後的 17、18、19、20 分別對應文末的註 18、19、20、21；正文沒有 21 這個標號。所以「50 百分位移到 54–56 百分位」後面的標號 19 對應的是文末註 20（0.11／0.18 學校層級標準差），「CDE」後面的 17 對應文末註 18（弱勢的定義）。Table 5 的 Year 4 組合對照學校數印 213/1,143，Table 2、3 同一格是 213/1,144。

## 與清單『要撐的結論』不合的地方

清單寫：「一套教科書比另外三套高 0.05–0.08 SD」。

- 數字與方向撐得住，是摘要原話。
- 要補的條件，少了就會說過頭：
  1. 是準實驗的配對估計，不是隨機實驗；識別靠無法檢定的條件獨立假設。
  2. 比較對象是「另外三套合起來」，不是分別勝過三套；分別比的檢定力不足。
  3. 0.08 那一端不顯著；顯著的範圍是 0.05–0.065。
  4. 是三年級州數學測驗、學校平均分數，單位換算成學生層級標準差；換成學校排名是從 50 百分位到 54–56 百分位。
  5. 作者自己說這個差距落在先前研究（0.08–0.17）的低端，而且說不出這本書好在哪。
  6. 多用幾年沒有更高（沒有劑量效果）。
- order 27 若要拿它和 Blazar 2019（六州、教科書之間沒有差異）對比，這一篇本身提供的另一半是：另外三套之間看不出差異（但那是檢定力不足的不顯著，不是「證明沒有差」）。
- 這一篇研究的是「選哪一套已審定的教科書」，沒有研究「重寫或重講一套教材」的效果，也沒有任何關於教材內容特徵的結論。拿來支持「教材寫法有差」只能到「同一州四套審定教材裡，有一套的學校成績略高」這一步。

## 讀取紀錄

讀的是不帶 `-layout` 的重轉檔（R1–R2809），依序、首尾相接：

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | R1–R700 | 標題、作者、摘要、導言、Background and Data、Focal Textbooks、Empirical Strategy（配對、Restricted OLS、Remnant）、Table 1（文字版錯位，另對 PDF）、Conditional Independence |
| 2 | R700–R1449 | Results：六組兩兩比較、傾向分數、共變數平衡、Table 2、Table 3、三年級效果、Falsification Tests、Table 4、Table 5、四五年級、Figure 1–3 圖說、Effect Heterogeneity、Conclusion 前半、Table 6 前半 |
| 3 | R1449–R2148 | Table 6 後半、Conclusion 後半、Appendix A（Table A1）、Appendix B（四套書介紹、Table B1、配對細節、Table B2 變數名） |
| 4 | R2148–R2809 | Table B2 係數、Table B3、Figure B1、Appendix C（Remnant 殘差化、平衡檢定細節）、Acknowledgment、Notes 1–26（全讀）、References（書目，掃過）、Authors |
| 對表 | PDF p.4–13 | Table 1、2、3、4、5、6 逐格對過；Figure 1、2、3 看圖 |
| 對表 | PDF p.14–18 | Table A1、B1、B2、B3 逐格對過；Figure B1 看圖；順帶確認正文註腳標號重複的 16 是 PDF 原樣 |

PDF 第 1–3、19–22 頁沒有另外開圖看，內容以重轉文字讀完（這幾頁沒有表）。原文沒有線上補充材料的指示。
