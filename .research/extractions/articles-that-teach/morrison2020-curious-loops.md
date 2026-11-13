# 抽取紀錄：Morrison、Margulieux、Decker 2020，The curious case of loops

> **先看這一段**：清單 order 3 第 3 列指定的檔案 `morrison2020-loops.pdf`／`.txt` 其實是 2016 年的 ICER 論文（紀錄在 `morrison2016-learning-loops.md`）。本篇才是清單寫的那篇，是我 2026-10-14 重新抓的作者接受稿。兩篇都讀完了。

- **書目**：Briana B. Morrison（Computer Science Department, University of Nebraska Omaha）、Lauren E. Margulieux（Department of Learning Sciences, Georgia State University）、Adrienne Decker（Department of Engineering Education, University at Buffalo）。作者全名與順序對稿本首頁（L26–30）核過，也對過 Crossref。2020。The curious case of loops。Computer Science Education 30(2)，127–154。DOI 10.1080/08993408.2019.1707544。線上刊出 2020-01-13（Crossref）。
- **原文檔（重抓）**：`.research/raw/learning-content/q2-interactive/morrison2020-curious-loops-aam.pdf`（81 頁：1 頁典藏封面＋稿本 80 頁，雙行距）與 `.txt`（不帶 `-layout` 的 `pdftotext`，3,026 行、114,159 字元／114,560 位元組）。
- **來源網址**：Georgia State University 機構典藏 ScholarWorks@GSU，`https://hdl.handle.net/20.500.14694/10139`；檔案 `Curious_Case_of_Loops_final_submission.pdf`，下載位址 `https://scholarworks.gsu.edu/server/api/core/bitstreams/f2ebbcd9-5e23-480d-81d4-b9087ff83c10/content`。典藏紀錄註明「Author accepted manuscript version of an article published by Taylor & Francis」，禁運到 2021-07-07，已過。
- **版本**：作者接受稿，不是刊出版。圖表集中在稿末，正文裡只有「[Table 4 goes about here]」這類佔位。**我沒有刊出版可以對**；頁碼、圖表編號與個別數字可能與刊出版不同，引用時頁碼只能寫稿本頁碼。
- **試過但拿不到的**：Unpaywall 與 OpenAlex 都標 closed；清單給的 NSF PAR 連結給的是 2016 年那篇；UNO DigitalCommons 被 Cloudflare 擋（403）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）。

行號一律是 `morrison2020-curious-loops-aam.txt` 的行號；「稿頁」是稿本印的頁碼。

## 研究設計

- **類型**：把三個用同一套流程做的實驗合起來重新分析（L78–87、L863–864）。每個實驗都是隨機分派、受試者間 3 × 2 設計：例題格式（No Subgoal／Given 專家寫好的子目標標籤／Generate 留空讓學生自己寫）× 例題與練習題的距離（isomorphic：情境相同只換數值／contextual：情境不同但解法格式相同）（L376–400）。合併分析時把大學當成準實驗變項放進模型（L635–641）。**不是統合分析，是把原始資料併在一起跑一個 ANOVA。**
- **三個實驗與先前發表的關係**（L588–603）：
  - 實驗 1 的寫程式、後測、時間資料發表過（Morrison、Margulieux、Guzdial 2015，文內稱 Study 1）；Parsons 題資料發表過（Morrison、Margulieux、Ericson、Guzdial 2016，Study 1 follow-up）
  - 實驗 1 與 2 的寫程式、Parsons 題、標籤品質、時間發表過（Margulieux、Morrison、Catrambone、Guzdial 2016，Study 2）
  - 實驗 3 的寫程式與時間發表過（Morrison、Decker、Margulieux 2016，Study 3）
  - **本篇新增**：三個實驗的認知負荷、實驗 3 的 Parsons 題、實驗 2 與 3 的後測
- **受試者**：合計 220 人（L499）。
  - 實驗 1：66 人，美國東南部一所理工大學的四門入門程式課；**課堂還沒教迴圈**；前測平均 1.2／5，32% 零分；72 人裡 6 人（8%）因前測高分排除（L526–532）。Table 1：84% 男、平均 21 歲、50% CS 主修、42% 先前修過程式課
  - 實驗 2：54 人，東南部另一所理工大學；23% CS 主修，多數修的是給非主修的 Computational Media；前測平均 1.6／5，23% 零分；59 人裡 5 人（8%）排除（L542–550）。Table 2：40% 男、平均 22 歲、29% 先前修過程式課
  - 實驗 3：100 人，東北部一所理工大學；含第一學期入門課與二年級課；**兩群都已經學過 `while` 迴圈**；前測平均 2.3／5；**沒有依前測排除任何人**，理由是排除後檢定力不夠（L559–575）。Table 3：71% 男、平均 19 歲、94% 先前修過程式課
- **教材**（L403–429）：三個例題各接一個練習題，教用 `while` 迴圈解題；用虛擬碼，好讓不同語言的課都能參加；放在 SurveyMonkey。例題與練習題可以來回看，進入評量後不能回頭。整個流程「about two hours」（L416–417），另一處寫場次通常 1 到 1.5 小時、最慢的在 2 小時被請離開（L471–477）。大多在課堂 lab 做，部分人當回家作業做（L421–422）。自寫標籤組先做子目標標籤訓練，其他組做語文類比訓練（L479–490）。Figure 2（稿頁 73）是完整流程。
- **量了什麼**（L353–372、L441–465）：
  1. 寫程式 4 題（兩題較近、兩題較遠的遷移），逐行計分，滿分 44；概念對就算對，邏輯錯（`<` 寫成 `<=`）算錯
  2. 一題 Parsons 題（rainfall，13 段），依相對順序計分，滿分 13
  3. 前測與後測：同一組 5 題 AP CS A 選擇題（追蹤程式會印出什麼）
  4. 認知負荷自陳量表（Morrison、Dorn、Guzdial 2014），10 題，0–10 分，滿分 100，教學階段結束後填
  5. 各階段時間
- **何時量**：同一場次內立刻測，**沒有延宕測驗**。
- **研究問題**（L347–352）：RQ1 兩種學子目標的方式（給定或自己寫）怎麼影響解題表現；RQ2 例題到練習題的距離怎麼影響解題表現。

## 結果（逐項）

### 寫程式（主要依變項）

| # | 結果 | 數字 | 節／表 | 行號（稿頁） | 原文一句 |
|---|---|---|---|---|---|
| 1 | 整體描述 | 平均 26.58，SD 14.05，滿分 44 | Problem-solving score | L633–634（22） | 「The overall mean score was 26.58, and the standard deviation was 14.05.」 |
| 2 | 格式 × 距離交互作用 | F(2, 188) = 5.23，p = .028，est. ω² = .08 | 同上、Fig. 3 | L642–646（23） | 「Problem-solving score depended on the interaction of the worked example format and transfer distance」 |
| 3 | 主效果 | **沒有報**，理由是有交互作用時報主效果會造成誤讀 | 同上 | L646–648 | 「the main effects of worked example format and transfer distance will not be reported to avoid confusion in interpretation」 |
| 4 | 大學的效果 | 大學 × 格式 p = .37；大學 × 距離 p = .65；三因子 p = .20；大學主效果 p = .12；都不顯著，所以三校合併做事後比較 | 同上 | L649–653 | 「there was no main effect of university, p = .12; therefore, the combined data from all three universities were used for the post hoc tests.」 |
| 5 | Table 4：isomorphic 之內，No Subgoal 對 Given | 平均差 1.55，SE 3.34，p = .64，d = .10，**不顯著** | Table 4 | L2914–2997（79） | — |
| 6 | Table 4：isomorphic 之內，No Subgoal 對 Generate | 平均差 −4.80，SE 3.34，**p = .15，不顯著**，d = .37 | Table 4 | 同上 | — |
| 7 | Table 4：isomorphic 之內，Given 對 Generate | 平均差 −6.36，SE 3.52，p = .02，d = .44（Generate 較高） | Table 4 | 同上 | — |
| 8 | Table 4：contextual 之內，No Subgoal 對 Given | 平均差 −7.62，SE 3.01，p = .01，d = .59（Given 較高） | Table 4 | 同上 | — |
| 9 | Table 4：contextual 之內，No Subgoal 對 Generate | 平均差 −1.49，SE 3.15，p = .64，d = .11，**不顯著** | Table 4 | 同上 | — |
| 10 | Table 4：contextual 之內，Given 對 Generate | 平均差 6.14，SE 3.24，**p = .06，不顯著**，d = .47 | Table 4 | 同上 | — |
| 11 | 作者對 Table 4 的解讀 | 六個比較只有兩個顯著（#7、#8）；作者把六組分成高低兩層，中間兩組雖然與誰都沒有顯著差別，仍被歸為低表現 | 同上 | L660–671（23–24） | 「The only two comparisons that were statistically significant were those within isomorphic transfer between given labels and generated labels and within contextual transfer between no labels and given labels.」「Thus, we consider the two middle groups as low performance groups.」 |
| 12 | Fig. 3 各組平均（**原文沒有給數字表，下列是我從圖上目測，誤差線是標準誤**） | No Subgoal：isomorphic 約 25、contextual 約 24；Given：isomorphic 約 24、contextual 約 31；Generate：isomorphic 約 30、contextual 約 25。相鄰差值與 Table 4 的六個平均差吻合 | Fig. 3 | L2590–2615（75） | 「Maximum score was 44. Error bars represent standard error.」 |
| 13 | 把 4 題拆成較近與較遠兩類 | 交互作用都還在：較近 F(2, 188) = 4.04，p = .02，est. ω² = .06；較遠 F(2, 188) = 2.99，p = .03，est. ω² = .05 | 同上 | L685–692（24–25） | 「The results did not change when comparing groups within only the nearer or farther transfer tasks.」 |

### Parsons 題

| # | 結果 | 數字 | 行號（稿頁） | 原文一句 |
|---|---|---|---|---|
| 14 | 整體描述 | 平均 6.20，SD 4.27，滿分 13 | L695–697（25） | — |
| 15 | 格式、距離、交互作用 | 格式 F(2, 188) = 1.11，p = .41；距離 F(2, 188) = 0.15，p = .73；交互 F(2, 188) = 1.50，p = .31；**全部不顯著** | L701–704 | 「Parsons problem score did not have a statistically significant main effect of worked example format ... transfer distance ... nor interaction」 |
| 16 | **與自己先前的論文不一致** | 先前那篇發現給定標籤（不論距離）Parsons 題較好；合併後沒有。作者認為合併的結果較可靠，並撤回先前的結論 | L704–714 | 「Therefore, we would not conclude that giving learners subgoals labels necessarily results in better performance on Parsons problems after receiving instructional materials similar to ours.」 |
| 17 | 大學主效果 | F(2, 188) = 10.16，p = .04，est. ω² = .06。大學 1 M = 3.7、大學 2 M = 4.6、大學 3 M = 8.8。1 對 2：t(116) = 1.35，p = .18，d = .25；1 對 3：t(181) = 10.44，p < .001，d = 1.57；2 對 3：t(133) = 5.53，p < .001，d = 1.04 | L715–724（25–26） | 「These results are not unexpected, though, given that the participants from University 3 had already learned about solving problems with loops in their programming courses.」 |
| 18 | 作者的觀察 | 大學 3 在 Parsons 題較好，寫程式題卻沒有較好 | L726–730 | 「This supports the notion that students may demonstrate problem solving knowledge in Parsons problems even if they cannot in traditional code writing problems.」 |

### 後測（5 題追蹤題）

| # | 結果 | 數字 | 行號（稿頁） | 原文一句 |
|---|---|---|---|---|
| 19 | 整體描述 | 平均 2.40，SD 1.45，滿分 5 | L733–734（26） | 「the mean was low」 |
| 20 | 格式、距離、交互作用、大學 | 格式 F(2, 188) = 1.37，p = .34；距離 F(2, 188) = 0.24，p = .65；交互 F(2, 188) = 1.39，p = .33；大學 p = .76；**全部不顯著** | L735–745 | — |
| 21 | 作者的處置 | 事後判定這個測驗沒量到東西，**排除在結論之外** | L745–755（27） | 「we conclude that this post-test, perhaps because it measured code tracing skill more than problem-solving skill, did not effectively measure performance for any of the groups of participants, and we do not include this assessment when considering the conclusions of the study.」 |

### 認知負荷（本篇新報）

| # | 結果 | 數字 | 行號（稿頁） | 原文一句 |
|---|---|---|---|---|
| 22 | 整體描述 | 平均 40.9，SD 14.6，滿分 100 | L768（27） | — |
| 23 | 格式、距離、交互作用、大學 | 格式 F(2, 188) = .51，p = .63；距離 F(2, 188) = 0.89，p = .43；交互 F(2, 188) = .56，p = .60；大學 p = .35；**全部不顯著** | L769–777（27–28） | 「suggesting no differences among universities.」 |
| 24 | 作者的解讀 | 學生沒有感覺到心智負荷有差，卻有些組表現較好；作者承認沒有證據支持任何一種解釋 | L778–786 | 「We have no supplemental evidence to make a strong argument for this possibility. We can say, however, that some participants performed better than others without perceiving differences in mental workload.」 |

### 時間（整場實驗的總時間）

| # | 結果 | 數字 | 行號（稿頁） | 原文一句 |
|---|---|---|---|---|
| 25 | 格式主效果 | F(2, 188) = 8.67，p < .001，est. ω² = .09；距離 F(2, 188) = 0.55，p = .46；交互 F(2, 188) = 1.20，p = .30 | L791–795（28） | 「The amount of time that participants spent on the task depended on worked example format」 |
| 26 | isomorphic 之內 | No Subgoal M = 52 分鐘（SD 21）；Given M = 72（SD 27）；Generate M = 71（SD 29）。No 對 Given 差 20.1 分，p = .003，d = .83；No 對 Generate 差 18.8 分，p = .007，d = .75；Given 對 Generate 差 1.4 分，p = .85 | L797–804（28–29） | 「No Subgoal participants completed the task faster」 |
| 27 | contextual 之內 | No Subgoal M = 59 分鐘（SD 25）；Given M = 67（SD 25）；Generate M = 79（SD 35）。No 對 Given 差 12.2 分，**p = .076，不顯著**，d = .32（作者稱 meaningfully significant）；No 對 Generate 差 20.1 分，p = .005，d = .66；Given 對 Generate 差 7.9 分，p = .22 | L813–820（29） | 「Though the difference between the No Subgoal and Given groups is not statistically significant, we argue that it is meaningfully significant, albeit small」 |
| 28 | 自寫標籤＋contextual 這組變異特別大 | SD 35 分鐘；花 100 分鐘以上的有 6 人，其他組 1–3 人 | L821–833（29–30） | 「participants in this group were more likely to flounder and take an excessively long time to complete the experiment.」 |
| 29 | 時間與表現的關係 | 整體 r = 0.43，p < .001。Table 5 各組：No＋iso r = 0.26（p = .140）；Given＋iso r = 0.67（p < .001）；Generate＋iso r = 0.51（p = .008）；No＋ctx r = 0.53（p = .001）；Given＋ctx r = 0.41（p = .011）；Generate＋ctx r = 0.27（p = .186） | L843–859、Table 5 L2999–3023（30–31、80） | 「Overall, there was a strong, positive relationship between performance and time on task, r = 0.43, p < .001」 |
| 30 | 作者的結論 | 多花時間不保證表現好；子目標的好處不只是讓學生多花時間 | L855–859（31） | 「we conclude that the benefit of learning subgoals (under particular circumstances) is due to more than coaxing students to spend more time on task.」 |

### 討論與結論的說法

| # | 說法 | 行號（稿頁） | 原文一句 |
|---|---|---|---|
| 31 | 最有效的兩種組合：給定標籤＋較遠的練習題；自己寫標籤＋較近的練習題。兩者表現相同 | L863–869、L954–963（31、34–35） | 「In our experiment, these two conditions performed equally」「Either condition should yield the highest performance from students.」 |
| 32 | 怎麼選：學生本來就會自我解釋、學得快、動機高，適合自己寫；吃力或沒動機的給定標籤較好。**這一段是作者的推論，本篇沒有資料** | L873–889（31–32） | 「If the students tend to be unable to self-explain, are otherwise struggling in the course ... then giving subgoal labels would likely be more effective」 |
| 33 | 沒有回饋時，自己寫與給定沒有差別（就是這幾個研究的情況）；引 Margulieux & Catrambone 2019：有回饋或有提示時自己寫較好，但兩者同時給沒有更好 | L890–899、L917–924（32–33） | 「then generating labels might be no different than given labels, as was the case in these studies.」 |
| 34 | 給定標籤要配較遠的練習題，這與認知負荷理論的預測相反，作者沒有解釋 | L925–930（33） | 「this is contradictory to what would be predicted by cognitive load theory. This is certainly one phenomenon that needs further research.」 |
| 35 | 作者的猜測與檢查 | 給定標籤配 isomorphic 時步驟一模一樣，學生可能沒有自我解釋；逐字元比對過，沒有學生照抄例題（沒有超過 10% 相同的） | L928–941（33–34） | 「We found no instances of an exact copy of worked example code or any student submissions more than 10% identical to the worked example.」 |
| 36 | 文獻回顧裡的一個數字 | 最早的實驗室研究（心理系學生學 App Inventor）子目標標籤讓解題表現提高 8% | L250–252（8） | 「subgoal labeled worked examples were found to improve problem-solving performance by 8% (Margulieux, Guzdial, & Catrambone, 2012).」 |

## 作者自己列的限制（Limitations，L965–983，稿頁 35）

- 只有一堂 lab 的表現資料，不能推論長期影響或學習軌跡。
- 同一場次內測完，沒有延宕測驗，「our results only speak to the immediate learning outcomes」。
- 學生被要求獨自在電腦前做 1–2 小時，不能問同學、老師或助教；這對實驗必要，但「is not ecologically valid for many classroom lab environments」。合作可能以無法預測的方式改變效果。
- Future Work（L985–998）：目前只測過一個概念（`while` 迴圈），還沒有整門課使用的研究。
- 正文另外承認：Parsons 題只有一題，測量可能不可靠（L708–710）。

作者沒有列、但讀得出來的（我的觀察，不是原文）：

- **合併的資料包含原始研究本身**（實驗 1 的 66 人就是 Study 1）。所以「合併後交互作用仍顯著」不等於又一次獨立複製；獨立的新資料是實驗 2 與 3。
- 實驗 3 的 100 人全部納入，含已學過迴圈的二年級學生（94% 修過先前課程）。2016 年那篇對同一批二年級學生單獨分析時交互作用不顯著（p = .11），見 `morrison2016-learning-loops.md` 第 16 條。
- 表現好的組花的時間也比較長（#26、#27），時間與表現整體相關 r = 0.43。作者用組內相關不一致來反駁「只是多花時間」，但沒有把時間當共變數控制。
- 原文沒有報各格人數。

## 與摘要說法不一致的地方

1. **摘要 Findings「Two groups of students ... perform better than the others」（L58–63）**。Table 4 的六個事後比較只有兩個顯著：自寫標籤＋isomorphic 只顯著高於給定標籤＋isomorphic（p = .02），與無標籤＋isomorphic 沒有顯著差別（p = .15）；給定標籤＋contextual 只顯著高於無標籤＋contextual（p = .01），與自寫標籤＋contextual 沒有顯著差別（p = .06）。跨距離的比較（例如兩個高分組對另一列的組）沒有檢定。「比其他組都好」比統計結果強，正文 L660–671 自己有交代這是作者的歸類。
2. **摘要 Background「Subgoal labeled worked examples are effective」**。本篇的資料裡，「有標籤對沒標籤」只在 contextual 之下、給定標籤時顯著（#8）；isomorphic 之下給定標籤與沒標籤沒有差（#5，d = .10）；自寫標籤對沒標籤在兩種距離下都不顯著（#6、#9）。格式主效果沒有報。
3. **摘要「both with medium-large effect sizes」**：對應 d = .44 與 .59。照正文自己引的 Cohen 標準，d = .5 是中等（L628–630）。
4. **摘要沒有提的虛無結果**：Parsons 題、後測、認知負荷三項全部沒有效果，其中後測被事後排除在結論之外（#21），Parsons 題的結果推翻了作者自己先前的論文（#16）。
5. **「與認知負荷理論相反」的那個比較本篇沒有直接檢定**。該比較是「給定標籤之內，isomorphic 對 contextual」。本篇只做了「各距離之內比較三種格式」的事後比較（Table 4），沒有做「各格式之內比較兩種距離」。從 Table 4 與 Fig. 3 推算，兩組差約 7.6 分（約 24 對 31，滿分 44），方向與先前一致，但本篇沒有給這一對的 p 值。
6. **統計數字對不上（原文的問題，我用印出來的 F 與自由度重算）**：
   - 主要交互作用 F(2, 188) = 5.23 重算 p 約 .006，原文印 .028；較遠遷移題 F(2, 188) = 2.99 重算約 .053，原文印 .03；Parsons 題大學主效果 F(2, 188) = 10.16 重算遠小於 .001，原文印 .04；Parsons 與後測的幾個不顯著結果也都差 .05–.1。可能是巢狀設計用了別的誤差項而自由度沒有照實印，原文沒有說明。**引 p 值時要註明這一點，或只引 F 與效果量。**
   - 距離只有兩個水準，原文卻一律印 F(2, 188)（#15、#20、#23、#25）。
   - 220 人、三校 × 六格共 18 格，誤差自由度應為 202，原文是 188，沒有解釋。
   - #17 三個 t 檢定的自由度（116、181、133）換算回去是三校 83、35、100 人，合計 218，與正文寫的 66、54、100 不合。
   - L627 寫「f ... is equal to 2d」，下一句的例子卻是 f = .25 等於 d = .5，前一句寫反了。
7. 場次長度前後不一：L416–417「about two hours」，L471–472「typically lasted between 1 and 1.5 hours」，時間資料的各組平均是 52–79 分鐘。

## 與清單「要撐的結論」不合的地方

清單那句是：「子目標研究裡與認知負荷理論相反、且被複製出來的結果；先備經驗的差距一門課後消失」。

1. **「先備經驗的差距一門課後消失」不在這篇裡**。本篇沒有任何高中修課或先備經驗的分組分析，只有 Table 1–3 的相關係數（先前修過程式課與寫程式表現的相關：實驗 1 ρ = .37、實驗 2 ρ = .11 不顯著、實驗 3 ρ = .30）。那個結論出自 2016 年的 ICER 論文，而且要加限定，見 `morrison2016-learning-loops.md`。
2. **「與認知負荷理論相反」**：是作者自己的說法（#34），可以轉述。要補兩點：作者沒有解釋，只有猜測；本篇直接量了認知負荷，各組沒有差別（#23），所以這個「相反」是從表現推出來的，不是從負荷量表看到的。
3. **「被複製出來」要改寫**：
   - 本篇是合併分析，資料含原始研究，不算獨立複製（見上面我的觀察）。
   - 能說的是：三校合併後交互作用顯著，而且交互作用不隨學校不同（三因子 p = .20）。
   - 關鍵的那一對比較在本篇沒有檢定（上一節第 5 點），在 2016 年的獨立樣本裡是 p = .17。
   - 比較貼近原文的寫法：把步驟標上名字有沒有用，要看練習題與例題差多遠。給現成的標籤時，練習題換了情境的那組分數較高；讓學生自己寫標籤時，練習題只換數字的那組分數較高。三所學校合起來看這個型態還在，但每一對差異單獨看大多沒有達到顯著。
4. **清單沒有提、寫文章時不該漏的**：
   - 有標籤不一定比沒標籤好：例題與練習題同情境時，給現成標籤與不給沒有差別（d = .10），而且多花 20 分鐘（#5、#26）。
   - 追蹤題（後測）、排列片段題、自陳負荷三項都沒有效果。
   - 沒有回饋時，自己寫標籤與給定標籤整體沒有差別（#33）；自寫標籤配換情境的練習題那組最容易卡住、耗時最長（#28）。
   - 全部是當場測，沒有延宕測驗；只測過 `while` 迴圈一個概念。
5. **Muldner 等 2022 對本篇的轉述不準確**（見 `muldner2022-worked-examples.md` 第 49 條）：Muldner 寫「the pattern of results reported by the individual studies held」。寫程式題的交互作用是如此，但 Parsons 題「給定標籤較好」那個先前的結論在本篇被作者自己撤回（#16）。Muldner 的 Fig. 2a 仍把它列為顯著結果。
6. 與本系列主題有關的旁證（我的觀察，不是原文的結論）：稿本附錄的例題 3（數 1 到 100 的質數）本身有錯。L2061–2064 把 count 初始化成 3，註解寫「1, 2, and 3 are all prime numbers」（1 不是質數）；L2087 的迴圈條件是 `num <= 100`，L2093 起變成 `num < 100`；L2125 的註解把 num 寫成 lcv。這是作者稿的附錄，刊出版與實際施測的教材是否相同我無法確認，**不能當成已證實的事實引用**，只記下來供需要時查證。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–60 | 典藏封面、作者與單位、結構式摘要前半 |
| 2 | L60–699 | 摘要後半、導言、文獻回顧（例題、認知負荷、子目標標籤、自我解釋、Parsons 題、資工領域的子目標研究）、本研究、方法（設計、教材、評量、流程、受試者與三個實驗）、結果開頭、寫程式分數、Parsons 題開頭 |
| 3 | L699–1318 | Parsons 題、後測、認知負荷、時間、討論、結論、限制、未來工作、參考文獻（L1002–1136，書目，掃過）、附錄開頭（人口學問卷、前後測第 1–3 題） |
| 4 | L1318–2177 | 附錄：前後測第 4–5 題、子目標標籤訓練、語文類比訓練、例題 1 的三種版本、例題 2、例題 3 前半 |
| 5 | L2177–3026 | 附錄：例題 3 後半、練習題（isomorphic 與 contextual 各版本）、4 題評量、Parsons 題、Figure 2、Figure 1、Figure 3、Table 1–5 |
| 對 PDF | PDF 第 74–81 頁（稿頁 73–80） | Figure 2、Figure 1、Figure 3、Table 1、2、3、4、5 逐格對過。文字檔把 Table 4 的欄位拆散（「Significance」「Effect size (d)」的表頭掉到表尾），上面的數字以 PDF 版面為準 |

被正文引用的附錄全部讀了。原文沒有註腳。Fig. 3 沒有附數字，第 12 條是目測值，不能當精確數字引用。
