# 抽取紀錄：Dringoli、Kolosova、Rademaker、Wray、Choquette、Hilke 2021（arXiv:1910.00145v2）

**書目**：Benjamin J. Dringoli、Ksenia Kolosova、Thomas J. Rademaker、Juliann Wray、Jeremie Choquette、Michael Hilke（通訊作者）。The impact of content sequencing on quantitative problem-solving: A case study in Electromagnetism using an online learning platform。arXiv:1910.00145v2 [physics.ed-ph]，2021-01-29。DOI 只有 arXiv 發的 10.48550/arXiv.1910.00145。作者全名對過 PDF 首頁；單位是 McGill 物理系（Choquette 另掛 Dawson College）。

**版本**：預印本，**沒有同儕審查**。arXiv 頁面沒有 journal-ref；2026-10-14 用 Crossref、OpenAlex、Exa 以題名與作者查，沒找到期刊版（查不到不等於一定沒有）。v1（2019-09-30）題名不同，叫「Content Sequencing and its Impact on Student Learning in Electromagnetism: Theory and Experiment」，摘要寫「over 1000 students」並提出「Content Cube」；v2 改了題名、人數與理論框架。本紀錄只讀 v2。

**原文檔**：清單上的 `.research/raw/learning-content/q4-time/content-sequencing-electromagnetism-arxiv.txt`（1,042 行、105,522 位元組）是 `pdftotext -layout` 的雙欄版，左右欄交錯，沒有用它讀。改從 `https://arxiv.org/pdf/1910.00145v2` 重抓 PDF，用不帶 `-layout` 的 `pdftotext` 重轉：

- `q4-time/content-sequencing-electromagnetism-arxiv-v2-nolayout.txt`（1,480 行、77,887 位元組）——下面的行號都指這個檔
- `q4-time/content-sequencing-electromagnetism-arxiv-v2.pdf`（21 頁：正文 14 頁、參考文獻到第 16 頁、補充材料 5 頁）

**讀取日期**：2026-10-14。**供**：order 18。

## 研究設計

- **類型**：線上作業內的隨機分派實驗（作者自稱 case study，也稱 randomized experiment，L890–891），加一份獨立的偏好問卷。
- **受試者**：McGill 大一「電磁學與光學」課的學生，多為加拿大與美國的理工新生（L811–812）。2017、2018 兩年、每年兩份作業，四個資料集分別 426、437、346、399 人（L390–391），合計 1,608 筆。兩年只有 2 人重複（L392）；**同一年的兩份作業是同一批學生各做一次**（「McLEAP consisted of two parts, each part testing different course content」，L420–421），所以不同的學生數遠少於 1,608，原文沒有給不重複人數。**各組（六種順序、三種「先看什麼」）的人數全文沒有報告。**
- **教材**：課堂還沒教過的主題（反射與折射，L394–397）。內容分三種：Concept（C，質性概述加圖）、Theory（T，數學式的形式描述）、Example（E，完整解出的計算題）。三種各一頁，Fig. 2 示範同一主題（全反射）的三種寫法。
- **流程**（Fig. 1、Fig. S4，L398–414）：前測 5 題 → 隨機抽一種內容 → 小考 1 → 剩下兩種之一 → 小考 2 → 最後一種 → 小考 3 → **「All Content Review Page」（三種內容全部可再看一次）** → 後測（2017 年 5 題、2018 年 10 題）。每次小考 2 到 4 題計算題；題目自動批改、立刻回饋分數但不給解答（L423、L710–711）。每一段前後有偏好與準備度問卷。
- **比較對象**：六種順序（CTE、CET、ECT、ETC、TEC、TCE）互比；後來改成三種「第一個看到的內容類型」互比。每個學生三種內容都會看到，差別只在順序。
- **量了什麼**：計算題的前後測分數，換算成四種增益——gain of averages g（式 1）、average of gains ḡ（式 5，允許負值）、修正的 ḡ（式 4，負的增益設為 0）、normalized change c（式 3）。另有後測原始分數。**後測緊接在學習之後，沒有延後測驗**；整份作業限 5 小時內、5 天期限內完成（L419–420）。
- **統計**：Tukey HSD，六種順序時校正 15 個比較，三種「先看」時校正 3 個比較（L602–604、L639）。**全文沒有報告效果量（d 或 g）**，只有平均、標準誤與 p 值。
- **問卷**：111 人同意提供資料（L329），超過 95% 來自 McGill 理工學院（L326–328），身分自填為大學部、研究生、教師。**各身分的人數沒有報告。**

## 結果（逐項）

圖上的數值標「約」的是我從 PDF 圖讀的，原文沒有印數字。

### 順序對增益

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | 六種順序：ḡ | CTE 高於 TCE，校正後 p = 0.03 | CTE vs TCE（15 個比較的 Tukey） | IV.A.1，Fig. 3，L605–606 | 「We find that CTE gives a significant increase in average of gains TCE (p = 0.03)」 |
| 2 | 六種順序：g | 同一比較 p = 0.08，不顯著 | 同上 | L606–607 | 「but find a below significant result for gain of averages (p = 0.08). We thus find no conclusive evidence against our null hypothesis.」 |
| 3 | 小節標題 | 「No sequence provides a significantly better learning outcome than others」 | — | L594–595 | 標題原文 |
| 4 | 改比「先看什麼」的理由 | 六種順序的檢定沒過之後才放寬假設 | — | L572–574、L614–618 | 「Because this result was not supported (p = 0.08) by gains of averages … we decide to loosen our null hypothesis to no content type first results in a greater quantitative problemsolving ability than any other.」 |
| 5 | 先看 Concept vs 先看 Theory：g | p = 0.033（圖上標 0.03） | 3 個比較的 Tukey | IV.A.2，Fig. 4，L639–642 | 「we find a significant effect between Concept first and Theory first regardless of measure used (p = 0.033 for normalized gain, p = 0.035 for average of gains).」 |
| 6 | 同上：ḡ（式 5） | p = 0.035（圖上標 0.04） | 同上 | 同上 | 同上 |
| 7 | 同上：normalized change c | **不顯著**；內文 p = 0.24，Fig. 4 圖上標 p = 0.29（兩處不一致） | 同上 | IV.A.3，L658–660；Fig. 4 | 「We retrieve the same hierarchy for normalized change (Fig. 4) although the result is not significant (p = 0.24 for Concept first vs Theory first).」 |
| 8 | 同上：修正的 ḡ（負增益設 0） | **不顯著**（圖上 p = 0.20）；而且 Example 先的增益高於 Concept 先 | 同上 | L660–662 | 「For corrected ḡ, we find that students with Example first have a higher gain than students with Concept first (Fig. 4), neither of which is significantly higher than Theory first.」 |
| 9 | 小節標題 | 「Correcting for students with negative gain changes conclusion」 | — | L646–647 | 標題原文 |
| 10 | 後測分數低於前測的人數（Table I，對過 PDF 第 9 頁） | Concept 先 21 人（ḡ −76 ± 13%，c −45 ± 6%）；Example 先 26 人（−103 ± 16%，−58 ± 7%）；Theory 先 32 人（−128 ± 20%，−55 ± 6%） | 排除前測滿分者 | Table I，L687–706 | 「Fewer students with Concept first (21) than Theory first (32) reported a negative gain」（L668–670） |
| 11 | 顯著性的來源 | 一部分來自負增益的學生 | — | L716–717 | 「we found that part of the significance is driven by students with a negative gain.」 |
| 12 | 後測原始分數：順序 | CTE 比 TCE 高 5% ± 3，校正後 p = 0.10，不顯著 | CTE vs TCE | L879–880，Fig. S5 | 「Postscores of students with the sequence CTE are on average 5% ± 3 higher than students with TCE with multiplehypothesis adjusted p-value 0.10.」 |
| 13 | 後測原始分數：先看什麼 | Concept 先比 Theory 先高 4% ± 2，p = 0.01；Fig. S5 圖上約 86.5%、84.5%（Example）、82.5% | Concept 先 vs Theory 先 | L880–881 | 「Post-scores of students with Concept first are on average 4% ± 2 higher than students with Theory first, p-value 0.01.」 |
| 14 | 逐份作業 | 四份裡三份方向相同；2018-1 相反（Fig. S6 圖上 Theory 先最高，約 87%，Concept 先約 85%），作者稱為統計離群並歸因於題目外流 | — | L883–886；Fig. S6 圖說 L1476–1479 | 「The conclusions that Concept first gives better results than Theory first holds in three of four assignments separately. In 2018-1, the availability of questions online may have caused this statistical outlier.」 |
| 15 | Example 先的位置 | 介於兩者之間，都不顯著 | — | 結論 L1095–1096 | 「The gain for Example first lies in-between Concept first and Theory first, but without statistical significance.」 |
| 16 | 小考 1（只看過第一種內容時） | Example 先比 Concept 先高 2%、比 Theory 先高 3%；沒有檢定，小考至多 3 題 | 三種「先看」 | L929–933 | 「These results should be taken with caution as intermediate tests consisted of no more than three questions.」 |

### 各份作業與前測（Table II、III，對過 PDF 第 9 頁）

| # | 結果 | 數字 | 位置 |
|---|---|---|---|
| 17 | 全體（Table II）前測／後測／g／ḡ | 2017-1：39 ± 1／82 ± 1／70 ± 2／69 ± 3；2017-2：31 ± 1／85 ± 1／78 ± 2／72 ± 3；2018-1：50 ± 2／86 ± 1／72 ± 2／65 ± 3；2018-2：41 ± 2／86 ± 1／76 ± 1／69 ± 2（皆 %） | L743–768 |
| 18 | 排除前測滿分（Table III） | 2017-1：39／82／70／69；2017-2：29／84／78／72；2018-1：44／85／71／65；2018-2：35／85／74／69 | L770–796 |
| 19 | 前測滿分人數 | 2018 年 69 人，2017 年 8 人；作者歸因於學生上網查答案（Chegg） | L733–736「We attribute this to students looking up questions and answers online using sources such as Chegg」 |
| 20 | 後測與前測無關 | 迴歸係數 0.0 ± 0.2，p = 0.96 | L841，Fig. 5 |
| 21 | 增益與前測負相關 | 四種增益的係數 −0.5 ± 0.1、−0.5 ± 0.1、−0.6 ± 0.3、−0.6 ± 0.2 | L845–846，Fig. 6 |
| 22 | 數學小考比前測更能預測後測（只有 2018） | 數學 0.13 ± 0.04，前測 0.03 ± 0.02 | L859–863 |

### 偏好與準備度

| # | 結果 | 數字 | 位置 | 原文 |
|---|---|---|---|---|
| 23 | 作業過程中學生「下一頁想看什麼」 | Example 42% → 66%；Theory 39% → 22%；Concept 19% → 12%（小考 1 前 → 後測後）；Fig. 7 橫軸約 390 人 | L908–911，Fig. 7 | 「the percentage of students who prefer Example rises from 42% before Test 1 to 66% after the post-test」 |
| 24 | 作者對 23 的評語 | 稱為 surface learning；也說這個偏好「justified」，因為小考 1 Example 先的分數較高 | L927–938 | 「This preference is justified, given that …」 |
| 25 | 獨立問卷：偏好的內容類型（Fig. 8，圖讀值） | 大學部 Example 約 53%、Theory 約 31%、Concept 約 15%；研究生 Concept 約 60%、Example 約 21%、Theory 約 18%；教師 Concept 約 55%、Theory 約 44%、Example 0 | Fig. 8，L981–985 | 「With experience, content type preference shifts from example (undergraduates) towards concept (graduates), and a mix of concept and theory (faculty)」 |
| 26 | 獨立問卷：偏好的順序（Fig. 9，圖讀值） | 大學部 CTE 約 51%、TCE 約 27%、CET 約 13%；研究生 CTE 約 51%、CET 約 24%；教師 CET 約 33%、CTE 約 22%、無偏好約 22%、TEC 與 TCE 各約 11% | Fig. 9，L986–988 | 「Interestingly, the sequence preference corresponds well to the sequences with which students performed best during the McLEAP assignments.」 |
| 27 | 準備度自評（只有 2018 第二份） | Concept 先的變化：小考 1→2 為 −0.5 ± 1.8%，1→3 為 5.6 ± 2.0%，1→後測 6.1 ± 2.2%；與另兩組的整體變化相比不顯著 | L1069–1077，Fig. 10 | 「The students who receive concept first do not report an overall change in preparedness that is statistically significant within a 95% confidence interval as it compares to the overall change in preparedness within the example and theory first groups.」 |
| 28 | 問卷的分類一致度 | Example 被正確標示 91%、Concept 62%、Theory 60%；Fig. S1 混淆矩陣：Concept 219／56／76，Example 14／318／19，Theory 119／22／210；Cronbach α 全體 0.66、正確標示題 0.79、錯標題 0.43 | L344–349、L368–370、Fig. S1 | 「survey respondents were not provided with our definition of Concept, Example and Theory」（L353–355） |

## 作者自己列的限制

原文沒有 Limitations 節，散在各處：

1. 測量的是不到 5 小時的短期學習（L708–709、L1035–1037）；偏好問卷問的是不限時間的學習，兩者時間尺度不同。
2. 線上、無人監考，題目會外流，2018 年前測滿分人數暴增（L733–736）。
3. 前測沒有抓到先備知識，後測與前測無關（L850–853「That the pre-test did not adequately capture the student's prior knowledge」）。
4. 各份作業之間有找不出來源的變異（L814「we still end up with unidentified variation」）。
5. 結論隨增益的算法而變（IV.A.3 整節）。
6. Concept 與 Theory 的分類有重疊，受訪者有四成會標錯（L349–358）；作者主張這只會讓效果被低估，沒有檢驗。
7. 範圍：一門課、一個主題、一所學校、線上平台；搬到課堂「it is less clear how it impacts inclass teaching」（L1176）。
8. 小考題數少（L932–933）。

作者沒有提、但設計裡看得到的：後測前有「全部內容複習頁」，三組在後測前都能重看全部三頁；每種內容只有一頁、一個版本，「順序」與「那一頁寫得好不好」分不開；各組人數與流失沒有報告；「先看什麼」的比較是六種順序的檢定沒過之後才改做的；沒有效果量。

## 與摘要說法不一致的地方

1. **人數**：摘要「over 1500 students」（L18）；結果節「over 1500 datapoints」（L891）；結論「close to 1500 students」（L1089）；方法的四個數字相加是 1,608，而且同一年的兩份作業是同一批學生。1500 比較像筆數，不是人數。
2. **摘要只說 Concept 先勝過 Theory 先**，沒有說：六種順序的原始假設沒過（L607）；兩種修正算法下不顯著（p = 0.20、0.24 或 0.29）；修正的 ḡ 下 Example 先反而最高；四份作業有一份方向相反。
3. **結論寫「there is an optimal sequencing」「The optimal sequence of content presentation is Concept first」（L1090–1091）**，與小節標題「No sequence provides a significantly better learning outcome than others」和「no conclusive evidence against our null hypothesis」（L607）對不上。結論列的顯著指標是 g、ḡ、後測分數三種，略去不顯著的兩種。
4. **摘要「instructors' preferences for content sequencing differ strongly from that of students」**：內文沒有任何檢定，教師人數沒報告（問卷總共 111 人）。Fig. 9 裡大學部與教師偏好的順序都以 Concept 開頭的居多（大學部 CTE＋CET 約 64%，教師約 55%）；差別大的是 Fig. 8 的「偏好的內容類型」（大學部選 Example，教師選 Concept 與 Theory）。內文自己寫的是順序偏好「corresponds well」於表現最好的順序（L987–988）。
5. **Fig. 3 的左右**：內文說 ḡ 在左圖、g 在右圖（L572–574），PDF 上左圖是 Gain of averages（p = 0.08）、右圖是 Average of gains（p = 0.03）。
6. **Fig. 4 圖上的 p 值與內文不同**：normalized change 內文 0.24、圖 0.29。
7. 內文多處圖號是「Fig. S??」（v2 的交叉引用壞掉），對照補充材料可還原為 S1–S6。

## 與清單「要撐的結論」不合的地方

清單：「概念先於理論；教師與學生偏好的順序不同」。

- **「概念先於理論」只撐得住一半。** 原文能說的是：在一份不到 5 小時的線上作業裡，三種內容都看、只是順序不同，第一頁是概念的學生，計算題的立即後測增益高於第一頁是理論的學生，p ≈ 0.03（三個比較的 Tukey），後測分數差 4 ± 2 個百分點。必須連著寫的但書：沒有效果量；換兩種增益算法就不顯著；這個比較是原定的六種順序檢定沒過之後才改的；四份作業一份方向相反；沒有延後測驗；預印本、沒有同儕審查。它比的也不是「只給概念」對「只給理論」。
- **「教師與學生偏好的順序不同」撐不住。** 沒有檢定、沒有各組人數，而且圖上兩組偏好的順序都以概念開頭的最多；差別在偏好的內容類型，不在順序。可以改寫成「大學部學生偏好例題，教師偏好概念與理論（描述性問卷，111 人，沒有檢定）」。
- 值得帶的反向材料：學生做題過程中愈來愈想先看例題（42% → 66%），而且只看一頁就考時，例題先的分數最高（差 2 到 3 個百分點，沒有檢定）。

## 讀取紀錄

讀的是 `content-sequencing-electromagnetism-arxiv-v2-nolayout.txt`：

| 順序 | 行號 | 內容 |
|---|---|---|
| 1 | L1–520 | 題名、作者、摘要、I 前言、II 背景（A 內容類型、B 順序、C 學習理論、D 教科書、E 偏好）、III 方法（A 問卷、B McLEAP、C 分析到式 4） |
| 2 | L520–1019 | 式 4–5、IV.A 結果 1–5（含 Table I–III）、IV.B 偏好前半、Fig. 5–9 圖說 |
| 3 | L1019–1480 | IV.B 後半、IV.C 準備度、V 結論、致謝；L1140–1358 參考文獻（掃過）；L1360–1480 補充材料 Fig. S1–S6 圖說 |

對過 PDF 版面的：第 6–13 頁（Fig. 1–10、Table I、II、III、式 1–5）、補充材料第 2–5 頁（Fig. S1–S6）。三張表的數字與轉文字檔一致。Fig. 8、9、S5、S6 的數值是看圖估的，已標「約」。
