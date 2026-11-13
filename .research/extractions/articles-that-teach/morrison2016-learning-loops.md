# 抽取紀錄：Morrison、Decker、Margulieux 2016，Learning Loops: A Replication Study Illuminates Impact of HS Courses

> **先看這一段**：清單 order 3 第 3 列寫的是「Morrison, Margulieux, Decker 2020, The curious case of loops, Computer Science Education 30(2)（作者稿）」，檔案是 `morrison2020-loops.pdf`／`.txt`。**那個檔案不是 2020 年那篇**，是同一組作者 2016 年的 ICER 論文（本紀錄）。清單給的 `https://par.nsf.gov/servlets/purl/10301529` 我重新下載過，回來的也是這篇 ICER 2016，位元組數與原檔相同（1,004,092）。2020 年那篇另外從 Georgia State University 機構典藏抓到作者接受稿，紀錄在 `morrison2020-curious-loops.md`。清單「要撐的結論」的後半句（先備經驗的差距）只出現在本篇，前半句兩篇都有。

- **書目**：Briana B. Morrison（University of Nebraska at Omaha）、Adrienne Decker（Rochester Institute of Technology）、Lauren E. Margulieux（Georgia Institute of Technology）。作者順序與全名對 PDF 第 1 頁核過。2016。Learning Loops: A Replication Study Illuminates Impact of HS Courses。ICER '16（Proceedings of the 2016 ACM Conference on International Computing Education Research），Melbourne，2016-09-08 至 12，頁 221–230。DOI 10.1145/2960310.2960330。經費：NSF grant 1138378（PDF 頁 229）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/morrison2020-loops.pdf`（10 頁，檔名有誤）與 `.txt`（1,349 行、60,425 字元／60,630 位元組）。
- **版本**：刊出版的版面（有 ACM 版權區塊與頁碼 221–230），由 NSF PAR 提供。
- **讀取日期**：2026-10-14
- **讀法**：這是雙欄版面，`.txt` 的段落左右欄交錯（例如 L32–44 是右欄第一段，L46–62 才是摘要）。我用 Read 逐頁讀 PDF 第 1–10 頁當主要讀本，再把 `.txt` L1–1178 從頭讀一遍對數字。下面的行號是 `.txt` 的行號，另附 PDF 印的頁碼。
- **供哪幾篇使用**：order 3（程式碼）。

## 研究設計

- **類型**：複製研究＋事後探索。複製的是 Morrison、Margulieux、Guzdial 2015（ICER，文內 [28]）。隨機分派、受試者間 3 × 2 因子設計（L535–540，頁 224）：例題格式（無標籤／給定子目標標籤／留空讓學生自己寫標籤）× 例題與練習題的距離（isomorphic：情境相同只換數字／contextual：步驟相同但換情境與數字）。
- **受試者**：美國東北部一所理工大學的 100 名學生（L543–544），來自三門課（Table 1，頁 223）：
  - 101：Processing，New Media 主修的第一門程式課，課堂 lab
  - 105：C#，Game Design & Development 主修的第一門程式課，**選做的回家作業**
  - 202：C#，二年級課，課堂 lab。走 101 的學生要再修兩門才到 202，走 105 的修一門（L412–417）
  - Table 2（頁 224）：平均 19 歲、72% 男、GPA 平均 3.5/4、主修 33% New Media、63% Game Design、3% CS／SWE／CEngr
  - 入門課學生做實驗時，課堂上**已經教過迴圈約兩週**，正在準備含迴圈的考試（L1138–1141）。這與原始研究（教迴圈之前做）不同。
- **排除**（L586–611，頁 224–225）：沒做完所有任務的排除。複製分析另外排除前測 5 題答對超過 2 題的人。結果：**複製分析只剩 27 人**，分到 6 組；「整體表現」分析用 100 人。入門課做完的 51 人裡有 24 人因前測太高被排除（L797–801）。
- **教材**（L483–506）：三個例題與三個練習題交錯，教用 `while` 迴圈解題。放在 SurveyMonkey。課堂場次是一整堂課 110 分鐘。教材與 [28] 相同，只把同意書移到最後。自己寫標籤的組先受子目標標籤訓練，其他組做語文類比訓練當對等任務（L632–646）。**自己寫標籤的組沒有得到任何回饋**（L1009–1013）。
- **量了什麼**：
  - 前測與後測：同一組 5 題選擇題，取自 AP CS A 考古題（L616–619、L686–687）
  - 寫程式：4 題新題（2 題換情境，2 題換情境且換結構），逐行計分，滿分 44（L447–461、L604–608、L728–734）
  - 一題 Parsons 題（rainfall，13 個片段），依相對順序計分，滿分 13（L473–481、L776–788）
  - 各階段時間
- **何時量**：同一場次內，教完立刻測。沒有延宕測驗。
- **研究問題**（L717–724）：R1 給定標籤時，isomorphic 與 contextual 哪個好；R2 修課較多的學生是不是在前後測與程式題都勝過新手。

## 結果（逐項）

### 複製分析（N = 27，前測 ≤ 2 題的入門課學生）

| # | 結果 | 數字 | 節／圖 | 行號（頁） | 原文一句 |
|---|---|---|---|---|---|
| 1 | 寫程式：例題格式主效果 | F(2, 21) = 0.26，MSE = 105.6，p = .78，est. ω² = .02，**不顯著** | 4.1 | L650–652（225） | 「We found no main effect of worked example format」 |
| 2 | 寫程式：距離主效果 | F(1, 21) = 1.47，p = .24，est. ω² = .07，**不顯著** | 4.1 | L652–653 | 「we found no main effect of transfer distance」 |
| 3 | 寫程式：交互作用 | F(2, 21) = 5.19，MSE = 105.6，p = .015，est. ω² = .33，f = .44 | 4.1、Fig. 2 | L654–656 | 「There was, however, a statistically significant interaction between worked example format and transfer distance」 |
| 4 | **給定標籤：isomorphic 對 contextual（這就是要複製的那個「反常」結果）** | isomorphic M = 18.4（SD 13.0）對 contextual M = 31.2（SD 13.8），t(8) = −1.50，**p = .17，不顯著**，d = 0.95。兩格合計 10 人 | 4.1 | L695–706 | 「was not statistically significant, t (8) = -1.50, p = .17, but the difference between groups was large with an effect size of d = 0.95. Based on these results, the difference between groups is meaningful, even though it is not statistically significant, likely due to a small sample size.」 |
| 5 | 自己寫標籤：isomorphic 對 contextual | t(4) = 7.18，p = .002，d = 4.18。**兩格合計 6 人**。文字印的平均數是 isomorphic M = 18.0（SD 4.6）、contextual M = 37（SD 4.5） | 4.1 | L707–714 | 「This effect size is based on a sample of six, therefore, it is likely not reliable. The effect size is likely inflated due to the small sample」 |
| 6 | 作者對 #4、#5 的解讀 | 給定標籤配 contextual 較好；自己寫標籤配 isomorphic 較好 | 4.1 | L715–716、L747–749 | 「participants who were given subgoal labels performed better when they had contextual transfer, and participants who generated subgoal labels performed better with isomorphic problems.」 |
| 7 | 後測（5 題選擇） | 平均 36%（1.8／5），與前測相近；格式 F(2, 21) = .07，p = .93；距離 F(1, 21) = .28，p = .60；交互 F(2, 21) = .93，p = .41；**全部不顯著** | 4.1 | L753–759（226） | 「Performance on the post-test was similar to that on the pre-test. Average scores on the post-test were low, 36% (1.8 out of 5 points).」 |
| 8 | Parsons 題 | 格式 F(2, 21) = 1.20，p = .32；距離 F(1, 21) = .61，p = .45；交互 F(2, 21) = .24，p = .79；**全部不顯著** | 4.2 | L807–813 | 「performance did not seem to depend on the worked example or transfer manipulations.」 |
| 9 | 教學階段的時間 | 格式 F(2, 21) = 3.37，MSE = 202.2，p = .06，est. ω² = .27，f = .35，**不顯著**，作者稱 meaningful；距離 F(1, 21) = 1.94，p = .18；交互 F(2, 21) = 1.80，p = .19。Fig. 3 只有長條圖沒有數字 | 4.3.1 | L833–840 | 「we found a meaningful difference based on worked example format even though there was not a statistically significant ANOVA」 |
| 10 | 寫程式題的時間 | 格式 p = .13、距離 p = .44、交互 p = .60，不顯著 | 4.3.2 | L843–848 | — |
| 11 | Parsons 題的時間 | 格式 p = .34、距離 p = .65、交互 p = .77，不顯著 | 4.3.3 | L870–875 | — |

### 入門課全部學生（n = 51，不排除前測高分）

| # | 結果 | 數字 | 節 | 行號（頁） | 原文一句 |
|---|---|---|---|---|---|
| 12 | 前後測 | 前測 46%（2.3／5），後測 54%（2.7／5） | 5.1 | L815–818（226） | 「Participants scored about the same on the post-test」 |
| 13 | 寫程式 | 格式 F(2, 45) = .32，p = .73；距離 F(1, 45) = 1.88，p = .18；**交互 F(2, 45) = 4.04，MSE = 106.1，p = .024，est. ω² = .15**。沒有報事後比較，也沒有報各格平均數（只有 Fig. 4） | 5.1 | L819–826 | 「This interaction resembles the pattern of results seen in the analyses reported earlier in this paper.」 |
| 14 | Parsons 題 | 格式 p = .19、距離 p = .39、交互 p = .98，不顯著 | 5.1 | L877–882 | 「there were no statistical differences among groups on performance.」 |

### 後續課程 202 的學生（由 F 的自由度推算約 49 人；原文沒有直接寫人數）

| # | 結果 | 數字 | 節 | 行號（頁） | 原文一句 |
|---|---|---|---|---|---|
| 15 | 前後測 | 前測 73%（3.6／5），後測 70%（3.5／5） | 5.2 | L898–901（227） | 「participants scored about the same」 |
| 16 | 寫程式 | 給定標籤組優於無標籤與自寫標籤，F(2, 43) = 7.33，MSE = 15.9，p = .002，est. ω² = .25，f = .37；距離 p = .62；交互 F(2, 43) = 2.30，p = .11，**不顯著**（也就是那個「反常」的交互型態在這群人沒有出現） | 5.2、Fig. 5 | L901–907 | 「participants who were given subgoal labels performed better on the code writing assessments than those who were not given labels or those who generated labels」 |
| 17 | Parsons 題 | **自己寫標籤的組比另外兩組差**，F(2, 43) = 4.75，MSE = 10.9，p = .014，est. ω² = .18，f = .31；距離 p = .15；交互 p = .54 | 5.2、Fig. 6 | L969–975 | 「participants who generated subgoal labels performed worse than those who were not given labels or those who received labels」 |
| 18 | 作者對 #17 的解釋 | 可能是 expertise reversal | 6.2 | L1076–1091（228） | 「This may be an example of the expertise reversal effect [19].」 |

### 先前修課的效果（N = 100；高中修過電腦課 × 目前修的大學課）

| # | 結果 | 數字 | 節 | 行號（頁） | 原文一句 |
|---|---|---|---|---|---|
| 19 | 寫程式：高中修過 | 較好，F(1, 96) = 12.0，MSE = 56.2，p = .001，est. ω² = .11，f = .35 | 5.3 | L1026–1029（227） | 「Participants who took computing courses in high school performed better on the code writing assessment than those who did not」 |
| 20 | 寫程式：大學先前修過課 | 較好，F(2, 96) = 14.3，p < .001，est. ω² = .13，f = .38 | 5.3 | L1029–1031 | — |
| 21 | 寫程式：交互作用 | F(2, 96) = 11.1，MSE = 56.2，p = .001，est. ω² = .10，f = .33。Fig. 7（滿分 44，目測）：100 級課沒修過高中課約 27、修過約 37；200 級課兩者都約 38 | 5.3、Fig. 7 | L1031–1033、L911–917 | 「participants who took computing courses in high school did not perform better that those who did not in later college computing courses (Figure 7).」 |
| 22 | **Parsons 題：高中修過** | 較好，F(1, 96) = 9.85，MSE = 11.6，p = .002，est. ω² = .09，f = .31；大學先前修過 F(2, 96) = 6.78，p = .011；**交互作用不顯著**，F(2, 96) = 1.66，p = .20。也就是高中修過的人到了 202 仍然較好 | 5.3 | L952–961 | 「suggesting that those who had computing courses in high school performed better than those who did not, even after their first computing course in college.」 |
| 23 | 作者的討論 | 寫程式上的差距到後續課程消失，「at least for code writing tasks」；Parsons 題上高中修過的人持續較好，需要再研究 | 6.2 | L1128–1133、L1046–1047、L1054–1062（228） | 「any advantage those with prior coursework in high school once had, has been eliminated; at least for code writing tasks.」「On the Parsons problem assessment, results from this study indicate that those who took a high school course continue to outperform those who did not.」 |
| 24 | 作者的建議 | 兩種說法並存：或許該把有經驗與沒經驗的學生分班（L1171–1173）；到後續課程差距消失，所以可以合班（L1155–1156） | 6.2、7 | 同左 | 「Perhaps students with prior experience should be in a separate class」「This indicates that the students with differing experience backgrounds can be merged into a single class.」 |

### 結論段的說法（7，L1116–1165，頁 228）

- 「The data gathered in this study confirms that students who learn with given subgoal labels perform better with contextual transfer ... we now know that the result is repeatable」（L1119–1124）
- 「any advantage gained through previous coursework disappears, with regard to this introductory concept, in the follow-on course」（L1161–1163）
- 作者承認不知道原因：「we still have no evidence as to why this occurs, contrary to cognitive load theory」（L1122–1123）。討論段提的猜測：給定標籤配 isomorphic 時，例題與練習步驟一模一樣，學生可能沒有自我解釋（L1038–1041）；檢查過學生的程式不是照抄例題（L1041–1050）。

## 作者自己列的限制

原文**沒有限制一節**。散在文中的有：

- 複製分析樣本小：「The sample size was small because this was a replication study thus we did not need as much statistical power」（L702–705）。
- #5 的效果量建立在 6 個人上，「likely not reliable」、「likely inflated」（L711–713）。
- 自己寫標籤的學生沒有得到回饋（L1009–1013）。
- Parsons 題上高中經驗持續有優勢，「Further research is needed to determine if this result is repeatable」（L1056–1057）。

作者沒有提、但設計上看得出來的（我的觀察，不是原文）：

- 先前修課的分析是**橫斷比較**（同一時間點的 100 級與 200 級學生是不同的人），不是追蹤同一批人。能修到 202 的是留下來的學生，退選或沒過的人不在裡面。
- 高中有沒有修過課是學生自己填的，沒有隨機分派。
- 105 班是選做的回家作業，101 與 202 是課堂 lab，施測條件不同。
- 沒有延宕測驗。
- 學生已經在課堂上學過迴圈兩週，處理前的知識狀態與原始研究不同。

## 與摘要說法不一致的地方

1. **摘要「We found that the previous puzzling results were repeated」（L53–54）**。要複製的關鍵比較（給定標籤：contextual 對 isomorphic）是 p = .17、不顯著，兩格合計 10 人（#4）。作者靠 d = 0.95 與方向一致，主張「meaningful」。正文 6.1 與結論寫成「confirms」「repeatable」，比統計結果強。
2. **摘要「this performance difference disappears in a follow-on course」（L57–60）**。只在寫程式題成立（#21）。Parsons 題的交互作用不顯著，高中修過的人到後續課程仍然較好（#22），正文 5.3 與 6.2 都明寫了，摘要與結論沒有帶這個限定。
3. **正文內部矛盾（#5）**：文字印的平均數是自寫標籤 isomorphic 18.0、contextual 37，照這組數字是 contextual 較好；但緊接著的句子（#6）、6.1 的結論（L996–1001「generating subgoal labels (using isomorphic WE-PP pairs) perform the best」）與 Fig. 2（自寫標籤：isomorphic 柱約 37、contextual 柱約 21）都是 isomorphic 較好。**兩個平均數的標籤看起來印反了**；要引這兩個數字時不能照抄文字，方向以圖與結論為準。
4. 6.1 說自己寫標籤配 isomorphic 的新手「perform the best, and statistically better than」配 contextual 的（L996–998），這句的依據就是那 6 個人。
5. p 值我用印出來的 F 與自由度重算過：多數相符。#22 的 F(2, 96) = 6.78 重算約 .002，原文印 .011，對不上；不影響顯著與否。

## 與清單「要撐的結論」不合的地方

清單那句是：「子目標研究裡與認知負荷理論相反、且被複製出來的結果；先備經驗的差距一門課後消失」。

1. **來源掛錯**：清單掛在 2020 年的期刊文章名下，手上的檔案是 2016 年這篇。「先備經驗的差距」這半句**只有本篇有**，2020 年那篇完全沒有分析高中或先前修課經驗。引用要改成 Morrison, Decker, Margulieux 2016（ICER），作者順序也不同。
2. **「被複製出來」要改寫**：本篇是唯一一次獨立樣本的複製，關鍵比較不顯著（p = .17，10 人）；顯著的是整體交互作用（27 人分 6 格，p = .015；放寬到 51 人 p = .024）。交互作用的「型態相似」是作者看圖說的，51 人那次沒有報事後比較。可以寫「在另一所學校看到同方向、同型態的結果，但關鍵的那一對差異沒有達到顯著」，不能寫「被複製出來」不加限定。
3. **「與認知負荷理論相反」**：這是作者自己的說法（L1036–1037），可以轉述；作者同時承認不知道為什麼。
4. **「先備經驗的差距一門課後消失」撐不住，要改**：
   - 只在寫程式題成立；Parsons 題上差距沒有消失（#22）。
   - 「一門課後」不精確：202 是二年級課，走 101 路線的學生中間還隔兩門課（三學期序列），走 105 的隔一門。
   - 是橫斷比較、不是追蹤，而且有存活者偏誤。原文的用詞是「caught up」，那是作者的詮釋。
   - 比較貼近原文的寫法：同一時間點比兩群學生，入門課裡高中修過電腦課的人寫迴圈題分數較高（約 37 對 27，滿分 44，圖上目測），二年級課裡兩種人分數相近；但在排列程式片段的題目上，高中修過的人在二年級課仍然較好。
5. 清單沒有提、但本篇有的反向結果：二年級學生被要求自己寫子目標標籤時，Parsons 題反而比較差（#17）；二年級學生的寫程式題是給定標籤最好、沒有交互作用（#16）。這對「讓讀者自己歸納步驟名稱」的建議是一個限制條件。
6. 後測（追蹤執行結果的選擇題）在所有分析裡都沒有進步（#7、#12、#15）。也就是這套教材對「讀懂迴圈會印出什麼」沒有可見的幫助，看得到差別的只有寫程式題。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | PDF 第 1–5 頁（印刷頁 221–225） | 標題、作者、摘要、1 導言、2 背景（2.1.1–2.1.4、2.2）、3 方法（3.1–3.5）、Table 1、Table 2、Figure 1、4.1 前半、Figure 2 |
| 2 | PDF 第 6–10 頁（印刷頁 226–230） | 4.1 後半、4.2、4.3、5（5.1–5.3）、Figure 3–7、6 討論、7 結論、8 致謝、9 參考文獻（書目，掃過） |
| 3 | `.txt` L1–450 | 與 PDF 第 1–4 頁對讀（欄位交錯） |
| 4 | `.txt` L450–1009 | 與 PDF 第 4–7 頁對讀，逐一核對 F、p、ω²、M、SD |
| 5 | `.txt` L1009–1178 | 與 PDF 第 7–8 頁對讀 |
| 6 | `.txt` L1178–1349 | 參考文獻，在 PDF 第 9–10 頁讀過，`.txt` 這一段沒有再逐行讀 |

對過 PDF 版面的表與圖：Table 1、Table 2、Figure 1–7。Figure 2–7 只有長條圖，原文沒有附各格平均數的表；上面標「目測」的數字是我從圖上讀的近似值，**不能當精確數字引用**。原文有一個註腳（誤差線是 95% 信賴區間，頁 225）。沒有附錄。
