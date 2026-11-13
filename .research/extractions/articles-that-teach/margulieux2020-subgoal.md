# 抽取紀錄：Margulieux、Morrison、Decker 2020，International Journal of STEM Education 7:19

- **書目**（對 PDF 首頁核過）：Lauren E. Margulieux、Briana B. Morrison、Adrienne Decker (2020). Reducing withdrawal and failure rates in introductory programming with subgoal labeled worked examples. *International Journal of STEM Education*, 7:19。DOI 10.1186/s40594-020-00222-7。收稿 2019-12-20、接受 2020-04-28。CC BY 4.0 開放取用。
- **作者單位**：Margulieux 在 Georgia State University；Morrison 在 University of Nebraska Omaha；Decker 在 University at Buffalo。
- **版本**：刊出版（出版者 PDF）。
- **原文檔**：
  - 精讀用：`.research/raw/learning-content/q2-interactive/margulieux2020-subgoal.pdf`（16 頁）與同目錄 `margulieux2020-subgoal-pdf.txt`（不帶 `-layout` 的 `pdftotext`，1,706 行、78,668 字元）。**這兩個檔是本次重抓的**，來源是出版者開放取用 PDF 的 Wayback 存檔：`http://web.archive.org/web/20250408134547id_/https://stemeducationjournal.springeropen.com/counter/pdf/10.1186/s40594-020-00222-7.pdf`（出版者網站直連與 link.springer.com 都回 Client Challenge 頁；Europe PMC 沒收這篇）。
  - 清單原列的 `margulieux2020-subgoal.txt`（Jina 轉的 markdown，435 行、103,603 字元）**不完整，不能當依據**：九張表全部只剩「Full size table」連結；第 175 行在「homogeneity was violated … _p_」之後直接接到「0.20, which is a small-moderate effect size」，中間掉了重複量數分析、整個〈Exam performance〉小節、〈Demographic and learner characteristics〉小節開頭（對應 PDF 文字檔 L901–L1128，約兩頁）。期考那幾個數字正好全在掉的那段。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）#2
- 下文行號一律是 `margulieux2020-subgoal-pdf.txt` 的行號，另附 PDF 頁碼。

## 研究設計

- **類型**：課堂準實驗（quasi-experiment），沒有隨機分派，學生自己選班（L397「The classroom-based quasi-experiment manipulated one variable」；L1392–1395）。只操弄一個變項：新題型第一次出現時，例題有沒有子目標標籤。
- **場域與時間**：2018 年秋季，一所美國中西部大學（致謝寫 University of Nebraska Omaha，L1497–1498）用 Java 的程式設計入門課，五個班（L296–299，p.4）。各班課綱、進度、小考、考試相同；實習課可跨班選（L300–307）。
- **分組**：兩個班用子目標標籤例題，三個班用原本的例題（L315–318，p.5）。對照組其中一班是全線上班，先分開分析，除了年齡較大以外沒差別，併入對照組（L442–451，p.6）。
- **受試者**：學期初選課 307 人；沒有完成任何一次小考或考試的排除，另有少數人退出研究；最後 N = 265，子目標組 120 人、對照組 145 人（L433–442）。Table 1（p.6，L466–574）：85% 在 18–23 歲（範圍 17–46）；67% 男、31% 女、2% 其他；73% 白人；90% 英語為主要語言；43% 資訊相關科系、40% 工程；47% 大一、25% 大二；34% 沒有任何程式經驗；高中 GPA 平均 3.56、大學 GPA 平均 3.42；64% 預期拿 A。兩組的特徵只用「目測集中趨勢與變異」比過，沒有檢定（L453–457）。
- **教材（介入本身）**：
  - 子目標是用 TAPS（Task Analysis by Problem Solving）訪談法找出來的：一位學科專家（Morrison，教入門程式 24 年）邊解題邊講，一位分析者（Margulieux）追問專家已經自動化、講不出理由的步驟，直到分析者只靠列出的步驟就能解新題（L242–270，p.3–4）。
  - 涵蓋題型：運算式、選擇敘述、迴圈、方法、陣列（L399–401；另提過物件／類別，L236–241，但研究設計段列的是五種）。每種再分「讀／追蹤」與「寫」。
  - 標籤長什麼樣（Fig. 1，p.4）：評估 if 敘述的例題拆成「Subgoal 1: Diagram which statements go together」「Subgoal 2: For if statement, determine whether true or false」「Subgoal 3: If true – follow true branch, if false – do nothing or follow else branch」，每個標籤下面接該步的實際演算，最後給答案。
  - **劑量**：新教材只佔 15 週裡的 5 週，其餘教學完全相同（L318–324「the new materials filled only 5 of 15 weeks of the semester」）。
  - 課程是翻轉教室：課前看講課影片，上課時老師示範例題、學生做練習題；另有作業與 2 小時實習課（L327–332）。所以介入是「老師上課帶的例題」，不是學生自己讀的文字教材。
- **比較對象**：同一批例題不加子目標標籤（「conventional worked examples」）。
- **量了什麼、何時量**：
  - 小考：只分析用過子目標教材那 5 週之後各一次的小考，共 5 次（L421–424）。線上作答、有 4 天可寫，每次只佔學期成績 0.44%（L582–589）。每次只考前一週的主題（L910–911）。
  - 考試：整學期 4 次，含一次不累計的期末考；每次 2 小時、佔學期成績 7.5%（L332、L583–592）。
  - 小考上的「用白話解釋你會怎麼解」題：學生只要寫得通就拿滿分；課程結束後由三位作者在不知組別的情況下依 SOLO 五級評分（L598–614）。5 題中 1 題（是非型）丟掉；3 題在評完前 40% 後達到 ICC(A) ≥ 0.75、其餘由一人評；1 題（小考 3）始終沒達標，逐份討論（L619–634）。
  - 每種成績算三個版本：平均分（只算有考的）、總分（缺考算 0）、有考的次數（L640–657）。
  - 學習者特徵：一份人口與背景問卷（L401–418）。

## 結果（逐項）

### 小考（〈Quiz performance〉，p.9–10，L796–920）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 小考平均分（只算有考的） | 子目標組 M = 48%（SD 14%）；對照組 M = 41%（SD 16%）；d = 0.44；「t(264) = 12.03, p = .001」 | 子目標標籤例題 vs 一般例題 | L803–807，p.9 | 「For the average quiz score, the subgoal group (M = 48%, SD = 14%) outscored the control group (M = 41%, SD = 16%) with a medium effect size, d = 0.44, t(264) = 12.03, p = .001.」 |
| 2 | 小考總分（缺考算 0，滿分 31） | 子目標組 M = 12.0（SD 5.6）；對照組 M = 9.5（SD 6.3）；d = 0.42；Mann-Whitney U = 6703，p = .001；變異數同質性檢定 p = .03 | 同上 | L808–L894，p.9–10 | 「the subgoal group (M = 12.0, SD = 5.6) performed better on total score than the control group (M = 9.5, SD = 6.3), based on a maximum score of 31 with a medium effect size, d = 0.42, U = 6703, p = .001.」 |
| 3 | 完成的小考次數（共 5 次） | 子目標組 M = 3.9（SD 1.2）；對照組 M = 3.4（SD 1.6）；U = 7126，p = .01；同質性檢定 p < .01 | 同上 | L895–901，p.10 | 「Out of five quizzes, the subgoal group (M = 3.9, SD = 1.2) completed more quizzes than the control group (M = 3.4, SD = 1.6), U = 7126, p = .01.」 |
| 4 | 效果隨學期有沒有變（重複量數） | 只有 97 人五次小考都有分數；小考主效果 F(4, 93) = 2.04，p = .21；組別 × 小考交互作用 F(4, 93) = 1.31，p = .56（都不顯著） | 同上 | L902–910，p.10 | 「Due to the missing data points for some students, only 97 had a complete set of quiz scores that could be used for the analysis. With these limited data, we found no effect of quiz on the scores, F(4, 93) = 2.04, p = .21, nor an interaction between group and quiz, F(4, 93) = 1.31, p = .56.」 |

作者由 #4 推論「整學期效果量相同」（L914–917「This finding suggests that the subgoal labeled materials had the same effect size throughout the semester」）。原文沒有報告各次小考分別的組間差異。

### 考試（〈Exam performance〉，p.10，L921–959）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 5 | 考試平均分（只算有考的） | 子目標組 M = 75%（SD 15%）；對照組 M = 72%（SD 18%）；d = 0.20；U = 7975，**p = .24（不顯著）**；同質性檢定 p = .02 | 同上 | L926–931 | 「For the average exam score, excluding missing exams, the subgoal group (M = 75%, SD = 15%) did not score statistically better than the control group (M = 72%, SD = 18%) but did achieve the threshold for a small effect, d = 0.20, U = 7975, p = .24.」 |
| 6 | 考試總分（缺考算 0，滿分 200） | 子目標組 M = 140.3（SD 42.4）；對照組 M = 128.2（SD 51.6）；d = 0.26；「t(264) = 4.20, p = .04」（顯著） | 同上 | L931–935 | 「For the total exam score, however, the subgoal group (M = 140.3, SD = 42.4) did perform statistically better than the control group (M = 128.2, SD = 51.6), based on a maximum score of 200 with a small effect size, d = 0.26, t(264) = 4.20, p = .04.」 |
| 7 | 參加的考試次數（共 4 次） | 子目標組 M = 3.7（SD 0.8）；對照組 M = 3.5（SD 1.0）；d = 0.22；U = 7785，p = .045；同質性檢定 p < .01 | 同上 | L939–943 | 「Out of four exams, the subgoal group (M = 3.7, SD = 0.8) took more than the nonsubgoal group (M = 3.5, SD = 1.0) with a small effect size, d = 0.22, U = 7785, p = .045.」 |

作者對 #5–7 的解讀（L935–938）：「This finding suggests that the subgoal group took more exams than the control group but did not perform better on them」。

### 白話解釋題的 SOLO 評分（p.8–10；只有描述統計，沒有檢定）

表內數字是人數（該組百分比）。等級由低到高：Prestructural、Unistructural、Multistructural、Relational、Extended abstract。

| 小考（主題） | 組別（眾數） | Pre | Uni | Multi | Rel | Ext | 表與位置 |
|---|---|---|---|---|---|---|---|
| 1（運算式） | 子目標（眾數 4） | 1 (1%) | 8 (10%) | 18 (21%) | 43 (51%) | 14 (17%) | Table 2，p.9，L703–736 |
| 1 | 對照（眾數 3） | 6 (8%) | 14 (19%) | 27 (36%) | 25 (33%) | 3 (4%) | 同上 |
| 2（迴圈） | 子目標（眾數 3） | 5 (5%) | 13 (13%) | 49 (50%) | 28 (29%) | 3 (3%) | Table 4，p.10，L851–884 |
| 2 | 對照（眾數 3） | 11 (11%) | 25 (26%) | 45 (46%) | 16 (17%) | 0 (0%) | 同上 |
| 3（巢狀迴圈） | 子目標（眾數 2） | 8 (9%) | 48 (53%) | 23 (26%) | 8 (9%) | 3 (3%) | Table 5，p.10，L963–996 |
| 3 | 對照（眾數 2） | 12 (12%) | 39 (38%) | 32 (31%) | 17 (17%) | 2 (2%) | 同上 |
| 4（寫方法） | 子目標（眾數 4） | 1 (1%) | 4 (4%) | 27 (29%) | 53 (58%) | 7 (8%) | Table 3，p.9，L810–843 |
| 4 | 對照（眾數 3） | 11 (12%) | 17 (19%) | 32 (35%) | 27 (29%) | 5 (5%) | 同上 |

- 8. 小考 1：最高兩級子目標組 68%、對照組 37%；最低兩級子目標組 11%、對照組 27%（L693–695、L738–739）。
- 9. 小考 4：最高兩級 66% 對 34%；最低兩級 5% 對 31%（L743–747）。
- 10. 小考 2：兩組眾數都是 Multistructural；Relational 29% 對 17%；最低兩級 18% 對 37%（L748–756）。
- 11. **小考 3（巢狀迴圈）不符合趨勢**：兩組眾數都是 Unistructural。原文只寫「did not follow the same trend as the other quizzes, and the responses were overall worse」（L757–762）。照 Table 5 的數字算，最高兩級子目標組 12%（11/90）、對照組 19%（19/102）；最低兩級子目標組 62%（56/90）、對照組 50%（51/102）——**這一題對照組分布較好**，原文沒有把這句話寫出來。這一題也是唯一沒達到評分者信度的題目。
- 12. SOLO 分數在同一學生身上不穩定：31 人拿過 Extended abstract，只有 6 人拿到兩次；265 人中只有 7 人每次都在 Relational 以上；10 人拿過不只一次 Prestructural，只有 4 人每次都在 Unistructural 以下（L763–773）。
- 13. SOLO 分數能預測成績（Table 6，p.11，L1002–1091；ANOVA，不分組）：

| SOLO 來源 | 成績來源 | F | p | d |
|---|---|---|---|---|
| 小考 1 | 小考 1 | 11.15 | .001 | 0.41 |
| 小考 1 | 考試 1 | 7.11 | .008 | 0.33 |
| 小考 2 | 小考 2 | 30.31 | < .001 | 0.68 |
| 小考 2 | 考試 2 | 38.94 | < .001 | 0.77 |
| 小考 3 | 小考 3 | 20.80 | < .001 | 0.57 |
| 小考 3 | 考試 3 | 17.35 | < .001 | 0.52 |
| 小考 4 | 小考 4 | 56.03 | < .001 | 0.93 |
| 小考 4 | 考試 3 | 35.07 | < .001 | 0.73 |

- 14. 沒有任何學習者特徵與 SOLO 分數相關（L1146–1148）。

### 學習者特徵與考試平均分的相關（Table 7，p.11，L1157–1241；兩組合併）

顯著門檻由作者自訂為 r/ρ > 0.20 且 p < .01（L1127–1130）。人口變項（年齡、性別、種族）與成績無相關（L1141–1142）。

| 特徵 | 子目標組 | 對照組 | r/ρ | p |
|---|---|---|---|---|
| 因為對主題有興趣而修課 | 63% | 58% | .24 | < .001 |
| 與職涯相關 | 61% | 59% | .27 | < .001 |
| 預期成績 | 62% A、32% B、6% C | 65% A、26% B、8% C | .36 | < .001 |
| 預期難度 | M = 3.52 | M = 3.65 | .30 | < .001 |
| 高中 GPA | M = 3.59 | M = 3.55 | .26 | .001 |
| 大學 GPA | M = 3.39 | M = 3.44 | .35 | < .001 |

### 只看有風險因子的學生（Table 8、Table 9，p.12–13，兩張都是圖檔，數字對 PDF 頁面讀出）

Table 8（預期課程很難的學生，n = 129；各風險因子與考試平均分的相關）：

| 風險因子 | 子目標組 r/ρ（p） | 對照組 r/ρ（p） |
|---|---|---|
| 對主題有興趣 | .22（.08） | .30（.008）* |
| 與職涯相關 | .31（.01）* | .29（< .001）* |
| 預期成績 | .22（.10） | .38（.001）* |
| 高中 GPA | .40（.02）* | .61（< .001）* |
| 大學 GPA | .33（.12） | .50（.001）* |
| 被建議來修 | .03（.82） | .31（.006）* |

（* 是原表灰底，表示顯著。子目標組的 .31／p = .01 與 .40／p = .02 也被標成顯著，與 L1129–1130 自訂的 p < .01 門檻不一致。）

Table 9（複合風險因子，格式「子目標組／對照組」，* 顯著，NS 兩組都不顯著）有數字的格子：
- 以「對主題沒興趣」篩（n = 114）：預期難度 .19/.30*；大學 GPA .58*/.02；年齡 −.49*/−.16。
- 以「與職涯無關」篩（n = 117）：預期成績 .38*/.18；預期難度 .15/.41*；大學 GPA .57*/.09；年齡 −.23*/−.11。
- 以「預期成績非 A」篩（n = 95）：目前主修 −.18/.67*。
- 以「預期難度高」篩（n = 129）：興趣 .22/.30*；職涯 .31*/.29*；預期成績 .22/.38*；高中 GPA .40*/.61*；大學 GPA .33/.50*；年齡 −.52*/−.12。
- 以「高中 GPA 低」篩（n = 121）：預期難度 .26/.38*；大學 GPA .54*/.14。
- 以「大學 GPA 低」篩（n = 124）：預期難度 .08/.57*；目前主修 −.11/.41*。

作者整理成三個樣式（L1260–1330）：
- 15. 預期難度與成績的相關只出現在對照組或在對照組較強。只看預期課程很難的學生，考試平均分子目標組 74%（全體子目標組 75%）、對照組 67%（全體對照組 72%）（L1265–1269）。
- 16. 大學 GPA 與成績的相關只出現在子目標組。只看大學 GPA 低於平均的學生，考試平均分子目標組 76%（對 75%）、對照組 69%（對 72%）（L1284–1289）。
- 17. 年齡與成績負相關，只在子目標組。20 歲以下的學生，子目標組 80%（對 75%）、對照組 72%（對 72%）（L1297–1301）。
- #15–17 的組間平均差都沒有檢定。作者結語用的是「seemed to help」（L1328）。

### 缺考與不及格（p.13–14，L1331–1388；只有描述統計）

| # | 結果 | 子目標組（n = 120） | 對照組（n = 145） | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 18 | 只考了一次考試的人數 | 6（5%） | 10（7%） | L1344–1348 | 「In the control group, 10 students took one exam (7%) and 19 took two exams (13%). This rate was halved in the subgoal group in which 6 students took one exam (5%) and 6 took two exams (5%).」 |
| 19 | 只考了兩次的人數 | 6（5%） | 19（13%） | 同上 | 同上 |
| 20 | 缺一次考試者的考試平均分 | M = 69.2%（SD 20.8%） | M = 59.2%（SD 23.4%） | L1352–1355 | 「For students who took all but one exam, the subgoal group had a mean of 69.2% and a standard deviation of 20.8%, and the control group had a mean of 59.2% and a standard deviation of 23.4%.」（人數沒寫） |
| 21 | 只考兩次者的平均分 | M = 64.0%（SD 14.4%） | M = 54.6%（SD 17.2%） | L1356–1359 | 表列 |
| 22 | 只考一次者的平均分 | M = 63.0%（SD 19.6%） | M = 54.0%（SD 17.6%） | L1359–1362 | 表列 |
| 23 | 四次都考、但考試平均在 70% 以下（本課及格線） | n = 30（25%） | n = 64（44%） | L1374–1380 | 「We again found the rate of meeting this criterion was almost double in the control group (n = 64, 44%) as in the subgoal group (n = 30, 25%).」 |

- #18–19 合計：考兩次以下的，子目標組 12 人（10%）、對照組 29 人（20%）（我由原文數字相加，原文沒寫合計）。前兩次考試在退選截止日之前（L1344）。
- #20–22 作者明寫樣本太小不做推論統計（L1351–1352「The sample size was too small to use inferential statistics meaningfully」）。#18、#19、#23 的比例差也沒有任何檢定。
- 作者由 #18–23 得出的話（L1380–1384）：「Based on findings from exam performance alone, which is a good but not perfect representative of their overall grade, students in the subgoal group were half as likely to withdraw and half as likely to fail than the control group.」

### 結論段的說法（p.14–15，L1412–1488）

- 小考（學新程序後一週內）子目標組較好；之後的考試兩組相當（L1415–1422「Later problem-solving performance on exams, however, was equivalent between the two groups, suggesting that subgoal labels promote better initial performance but not consistently better performance.」）。
- 作者的解釋：沒有標籤的學生隨知識增加會追上；但沒有標籤的學習過程可能較花時間或較挫折，使有風險的學生退選或不及格（L1453–1468「performance for those who persist might end up the same, but performance for those who do not is substantially different」）。這是推測，文中沒有量時間或挫折感。
- 作者自己畫的適用範圍（L1484–1488）：「Subgoal labels are likely not effective for improving problem-solving for those who already know the problem-solving procedure or whose personal learning strategies already help them to master new material.」
- 這是子目標學習架構第一個課堂實驗；先前研究都在實驗室、一次約一小時（L96–99、L1446–1451）。

## 作者自己列的限制（〈Limitations〉，L1389–1410）

1. 沒有隨機分派，學生依自己時間選班，因果論證變弱；作者比過一長串特徵，沒發現有意義的差異。
2. 教子目標組的老師是研究團隊成員（Morrison，見 L1503），是潛在偏誤來源（「some bias is still likely in the data」）。
- 只列了這兩條。下面幾點原文沒有列為限制，是我讀到的事實：對照組三個班由其他老師教，所以「教材」與「老師」綁在一起；對照組有一班全線上，子目標組沒有；退選與不及格是用考試資料推的，不是學校的退選或學期成績紀錄；風險因子分析跑了很多次相關，作者自己說預期會有型一錯誤（L1122–1125）。

## 與摘要說法不一致的地方

1. **摘要「half received subgoal-oriented instruction while the other half received typical instruction」**（L24–25）：實際是 120 對 145（45% 對 55%），兩個班對三個班。
2. **摘要「fewer students dropped or failed the course than in the control group」、標題「Reducing withdrawal and failure rates」**：正文沒有真正的退選或學期成績資料。依據是考試次數（#7、#18–19）與「四次都考但平均 ≤ 70%」的人數（#23），作者在正文自己加了但書「Based on findings from exam performance alone, which is a good but not perfect representative of their overall grade」（L1380–1382）。這些比例差沒有做檢定。
3. **摘要「Learning subgoals consistently improved performance on quizzes」／結論「For each quiz given after subgoal labeled materials, the subgoal group performed better than the control group」**（L1471–1473）：正文沒有報告各次小考的組間比較。支持「consistently」的只有 97 人的重複量數分析中交互作用不顯著（#4）。SOLO 資料裡小考 3 反而是對照組分布較好（#11）。
4. **摘要「not on exams」**：考試平均分不顯著（#5），但考試總分顯著（#6，p = .04）。正文有解釋總分差異來自考的次數，摘要沒提總分。
5. 正文內部的數字不一致（不是摘要問題，一併記下）：
   - 預期難度的平均，Table 1 與 L1153 寫 2.97，Table 7 卻寫子目標組 3.52、對照組 3.65，兩組都高於全體平均，不可能同時成立。原文沒有說明。
   - 「t(264)」：N = 265 的獨立樣本 t 檢定自由度應為 263；而且 t = 12.03 配 d = 0.44、t = 4.20 配 p = .04 都對不起來（數值大小像 F 值）。我不確定是誤植還是實際跑的是 ANOVA，引用時只引 M、SD、d 與 p，不要引 t 值。
   - F(4, 93) = 2.04 寫 p = .21、F(4, 93) = 1.31 寫 p = .56，與一般 F 分布的 p 值對不上（我估前者約 .09–.10、後者約 .27；沒有實際查表重算）。結論方向（不顯著）不受影響。
   - 不及格門檻一處寫「below 70%」（L1337）、一處寫「70% or lower」（L1376）。
   - 全體考試平均寫「73%」（L1377），兩組分別是 75% 與 72%。
   - Table 8 的顯著標記與自訂的 p < .01 門檻不一致（見上）。

## 與清單「要撐的結論」不合的地方

清單寫：「把例題切成有名字的步驟：小考較好、中途放棄的人較少，期考差距消失」。

- **「小考較好」撐得住**：平均分 48% 對 41%，d = 0.44，p = .001。要連著寫的條件：小考在學新題型後一週內、線上作答、每次只佔學期成績 0.44%；準實驗；子目標組老師是作者之一。
- **「中途放棄的人較少」要改寫**：原文量的不是退選紀錄。能說的是「子目標組考的考試次數略多（3.7 對 3.5 次，p = .045），只考兩次以下的人是 10% 對 20%」，後一個數字沒有檢定。作者自己的用語是從考試資料推得「half as likely to withdraw」。
- **「期考差距消失」要改寫，有兩處不對**：
  1. 不是「期考」。是整學期四次考試（最後一次是不累計的期末考），與小考交錯進行，不是學期末一次量。
  2. 「消失」暗示先有後無的時間變化，原文不是這個設計。原文是同一學期裡「剛學完的低風險小考有差」對「之後的高風險考試平均分沒有顯著差（75% 對 72%，d = 0.20，p = .24）」。而且考試總分（缺考算 0）是顯著的（p = .04）。作者把它解讀成「學久了會追上」，那是解釋，不是量到的軌跡。
- **「把例題切成有名字的步驟」大致對，但漏了三個條件**：(a) 標籤是用專家訪談法（TAPS）找出來的、講的是「這一步的目的」，不是隨手下的小標；(b) 只用在每種新題型第一次出現時，15 週裡佔 5 週；(c) 是老師在課堂上示範的例題，不是學生自己讀的文章。把這篇直接推到「教學文章的程式例題該加步驟小標」，中間隔著這三層。
- 清單沒提、但可能有用的：不及格比例（四次都考、平均 ≤ 70%）25% 對 44%（無檢定）；SOLO 白話解釋題四題中三題子目標組分布較好、巢狀迴圈那題相反；作者自己說標籤對已經會的人大概沒用。

## 讀取紀錄

- 先讀 Jina 版 `margulieux2020-subgoal.txt` L1–259（正文到參考文獻開頭），在 L175 發現斷裂、九張表全缺，判定不完整，重抓 PDF。
- `margulieux2020-subgoal-pdf.txt` 依序讀：L1–620（首頁、摘要、前言、文獻回顧、研究設計、受試者、Table 1、資料蒐集前半）→ L620–1319（評分程序、SOLO 結果、Table 2–7、小考、考試、學習者特徵、Table 8–9 的圖說）→ L1319–1706（缺考與不及格、限制、結論、縮寫、致謝、作者貢獻、經費、參考文獻）。三段首尾相接，涵蓋全檔。參考文獻 L1530–1701 只掃過。
- 對過 PDF 版面的表與圖：Fig. 1（p.4）、Fig. 2（p.8）、Table 2–3（p.9）、Table 4–5（p.10）、Table 6–7（p.11）、Table 8（p.12）、Table 9（p.13）直接看 PDF 頁面影像；Table 1（p.6）對 `pdftotext -layout` 的輸出。Table 8、9 在 PDF 裡是圖檔，文字檔沒有內容，數字全部由頁面影像讀出。
- 沒有附錄。
