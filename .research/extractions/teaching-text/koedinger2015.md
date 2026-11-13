# 抽取紀錄：Koedinger、Kim、Jia、McLaughlin、Bier 2015，L@S 2015（Learning is Not a Spectator Sport: Doing is Better than Watching for Learning from a MOOC），pp. 111–120

合法公開來源：https://dl.acm.org/doi/10.1145/2724660.2724681 （刊出版，ACM 文章頁標示 OPEN ACCESS，2026-10-14 核對）；同一個檔也在作者 Koedinger 的實驗室著作頁 https://pact.cs.cmu.edu/pubs/koedinger,%20Kim,%20Jia,%20McLaughlin,%20Bier%202015.pdf 。兩處重新下載都與手上的 `.work/teaching-text-research/src/koedinger2015.pdf` 位元組完全相同（2,016,196 位元組）。

原文檔：`/Users/vincent/Work/study/quidproquo/.work/teaching-text-research/seq/koedinger2015.txt`（共 1,259 行、45,210 位元組）
讀取日期：2026-10-14

表格還原說明：PDF 是雙欄，seq 檔把左右欄與表格交錯在一起（例如第 31–37 行是導言的右欄開頭，排在摘要前面；Table 1 的格子散在第 340–468 行，中間夾著正文）。我讀完全文後用 `pdftotext -layout -f 4 -l 4 src/koedinger2015.pdf -` 重抽第 4 頁對 Table 1，下面的 Table 1 以 layout 版為準。Table 2、3、4 在 seq 檔裡一列一組，可以直接還原。Figure 2、3、4 只有圖說，圖上的數字讀不到；下面所有 Figure 3、4 的數字都來自正文的敘述。

## 研究設計

- **研究類型**：對一門 MOOC 自然使用紀錄的觀察性（相關性）分析，加上一個準實驗比較與因果模型搜尋。沒有隨機分派。作者自己的定性在第 56–59 行：「Our data, from a psychology MOOC, is correlational in character, however we employ causal inference mechanisms to lend support for the claim that the associations we find are causal.」
- **資料來源**（第 181–189、199–219 行）：2013 年 Georgia Tech 在 Coursera 開的「Introduction to Psychology as a Science」，12 週，每週一個大主題、3–4 個子主題，每個子主題一支 10–15 分鐘的預錄影片；課程裡嵌入 CMU Open Learning Initiative（OLI）的「Introduction to Psychology」教材。資料集是 DataShop 的 'Psychology MOOC GT'（第 1041–1044 行）。
- **課程元件的分類**（第 158–168 行）：passive/declarative（影片、投影片、說明文字）對 active/interactive（小考、考試、討論區、有針對性回饋與提示的互動活動）。
- **OLI 的兩種互動活動**（第 252–261 行）：「Learn By Doing」活動有針對迷思的回饋與提示；「Did I Get This」是自我檢查，沒有提示但有回饋。
- **成績怎麼算**（第 168–172 行）：期末成績由小考分數、期末考分數與兩份寫作作業決定；前測／後測與背景問卷不計分。
- **評量的來源**（這一點影響結果怎麼解讀）：
  - 每週小考是 high-stakes，題目出自 OLI 題庫：「quizzes (with questions drawn from OLI item banks, see Figure 1b for an example)」（第 212–214 行）。
  - 期末考由授課教師出題：「a final exam (with questions created by the instructor, see Figure 1c for an example)」（第 214–216 行）。
  - 第 947–950 行再說一次：「The final exam was developed by the MOOC instructor whereas the unit quizzes more directly correspond with the content of the associated OLI modules.」
- **三個研究問題**（第 221–237 行）：(1) 什麼因素決定學生留下或退出；(2) 用 OLI 的學生是否比只用 MOOC 的學得多；(3) 看影片、讀文字、做活動三種使用量，哪一種和學習最有關，能否推論因果。
- **人數（Table 1，以 layout 版為準）**：

| 群組 | 人數 | 佔全體（佔該子群） | 平均分數或使用量／最大值 |
|---|---|---|---|
| All students | 27,720 | 100% | |
| 　Pre-test | 12,218 | 44.89% | 6.9/20 |
| 　Quizzes | 2373（上標 1；註 1 寫的是 2374） | 8.7% | 7.1/10 |
| 　Final | 1,154 | 4.2% | 25.6/40 |
| MOOC only | 18,645 | 67.3%（100%） | |
| 　Pre-test | 4,872 | 17.6%（39.9%） | 5.8/20 |
| 　Quizzes | 496 | 1.8%（4.1%） | 6.3/10 |
| 　Final | 215 | 1%（1%） | 22.8/40 |
| OLI registered | 9,075 | 32.7%（100%） | |
| 　Pre-test | 7,346 | 26.5%（80.9%） | 8.6/20 |
| 　Quizzes | 1,876 | 6.8%（20.7%） | 7.5/10 |
| 　Final | 939 | 3.4% | 26.3/40 |
| 　　Playing video | 902 | （96.1%） | 164.4/4460 |
| 　　Reading pages | 939 | （100%） | 296.8/1942 |
| 　　Doing activities | 939 | （100%） | 387.2/695 |
| 　　Non-activity pages | 939 | （100%） | 182/1759 |

  註 1（第 530–531 行）：「6912 students took quiz 1 and 1136 students took quiz 11. 2374 is the average across all 11 quizzes.」seq 檔第 362 行的「23731」是 2373 加註腳上標。
- **使用量變項**：
  - 影片：playing video（有幾次開始播放）。
  - 閱讀：pageview；因為活動放在頁面上、做活動一定會進頁面，作者另造 `non_activities_pageview`，用「每頁約 3.4 個活動」的比例把因活動而產生的頁面瀏覽扣掉（第 472–481、538–541 行）：「arguably a more pure measure of the variation in the reading students did」。
  - 活動：`activities_started`（開始了幾個活動）。
  - 三者都是「開始了幾次」，不是花了多少時間；作者在限制裡說明（第 1053–1058 行）。
- **RQ1 的做法**（第 279–289、667–675 行）：以參加小考與期末考與否當作退出的估計；邏輯斯迴歸預測是否參加期末考，預測變項是前測參加與分數、11 次小考各自的參加與分數（共 24 個）。
- **RQ2 的做法**（第 290–298、645–662 行）：準實驗比較 MOOC+OLI 且考期末（N = 939）對 MOOC-only 且考期末（N = 215）的期末成績；再用線性迴歸加入六個學生特徵（前測、Quiz 1 分數、職業、年齡、教育程度、性別）。
- **RQ3 的做法**：(a) 探索性分析，對三個使用量各做中位數切分（watcher／reader／doer）（第 768–776 行）；(b) 四分位的極端組分析（Table 4，第 871–874 行）；(c) 用 Tetrad 的 PCD 演算法搜尋因果模型，變項是前測、三種使用量、小考總分、期末考分數；加時間順序的限制（期末不能影響小考、小考不能影響使用量、使用量不能影響前測）；資料標準化（輸入相關矩陣）（第 487–510 行）。
- **因果模型用了多少人**：原文沒有明說 Tetrad 模型的樣本數。Table 1 與第 533–537 行顯示使用量統計是針對 939 位「OLI 註冊且考期末」的學生。

## 結果（逐項）

### 整體使用情形

| # | 結果 | 數字 | 對照條件 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 註冊對完成 | 27,720 註冊、1,154 完成（考期末） | — | Methods | 277–279 | 「27720 students registered in the Coursera MOOC Psychology course while 1154 students completed it」 |
| 2 | 開始看過至少一支影片 | 14,264（51.4%） | 全體註冊者 | Methods | 308–309 | 「Of all MOOC registrants, 14,264 (51.4% of total) started to watch at least one lecture video.」 |
| 3 | OLI 註冊者讀過至少一頁 | 7,683（84.5%）；平均瀏覽 69 頁、最多 1,942；不重複頁平均 33、最多 192 | 9,075 位 OLI 註冊者 | Methods | 309–315 | 「84.5% (7683 students) accessed at least one page of OLI readings and visited or revisited an average of 69 pages」 |
| 4 | OLI 註冊者開始過至少一個活動 | 5,658（62.3%）；平均 127、最多 695 | 同上 | Methods | 315–317、533–534 | 「62.3% (5658 students) started at least one interactive activity with an average of 127 and a maximum of 695 activities started」 |

### RQ1：退出與完成

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 5 | 考期末的比例 | 全體 4%；OLI 註冊者 10% | — | Predicting Course DropOut | 514–517 | 「only 4% take the final exam. Of the 9075 students who registered for the OLI materials, only 10% took the final exam.」 |
| 6 | 小考參加率 | MOOC+OLI 約為全體的兩倍 | 全體 MOOC 學生 | 同上 | 611–613 | 「The rate of quiz participation is consistently higher for MOOC+OLI students than for MOOC students in general, about twice as high.」 |
| 7 | 只看完成第一次小考的人 | 參加第 11 次小考：MOOC+OLI 18.5%、MOOC-only 14% | — | 同上 | 616–619 | 「we still find the MOOC+OLI students are more likely to take quiz 11 (18.5%) than the MOOConly students (14%).」 |
| 8 | 最大的流失點 | 第 1 到第 2 次小考之間掉 43%（MOOC+OLI 39%、MOOC only 50%） | — | 同上 | 619–622 | 「The biggest drop in participation comes between quiz 1 and 2 with 43% of students dropping overall」 |
| 9 | Table 2：預測參加期末考的邏輯斯迴歸（只列 p < 0.01 的） | 截距 −6.34020（SE 0.19564）；Quiz 1 分數 0.24434（0.07698，p = 0.0015）；有沒有考 Quiz 7 2.95023（0.71933，p = 4.11e-05）；有沒有考 Quiz 11 4.95794（0.69094，p = 7.20e-13）；AIC 1469 | — | Table 2 | 561–603、627 | 「A student's score on quiz 1, above and beyond having merely taken it (and taken other quizzes), is associated with higher final exam participation.」（第 680–683 行） |

### RQ2：MOOC+OLI 對 MOOC-only

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 10 | 期末考平均 | MOOC-only（N = 215）56.9%；MOOC+OLI（N = 939）65.7%；t 檢定 p < .001；分數做三次方轉換後仍 p < 0.001 | 兩個自選群組 | Comparing Learning Outcomes | 632–644 | 「MOOC-only students (N=215) had an average final exam score of 56.9% and the MOOC+OLI students (N=939) averaged 65.7%.」 |
| 11 | 控制學生特徵後的線性迴歸（Table 3，只列顯著的） | 截距 16.90（SE 3.32）；OLI use 1.43（0.55，p = 0.009）；Quiz 1 score 1.06（0.11，p < 2e-16）；Education = PhD 3.96（1.84，p = 0.032） | 依變項是期末考答對題數（滿分 40） | Table 3 | 695–746 | 「use of OLI (at least registering) produces 1.43 more questions correct.」（第 752–753 行） |
| 12 | 不顯著的變項 | 前測、職業、年齡、性別 | — | 同上 | 692–694 | 「None of the other variables (pretest score, occupation, age, or gender) make a significant independent contribution to the final exam score.」 |
| 13 | 這個迴歸的樣本 | 551 人：MOOC+OLI 251、MOOC-only 301（原文照抄；兩數相加是 552，而且 MOOC-only 考期末的只有 215 人） | — | 同上 | 659–662 | 「our sample is now reduced to 551 students, 251 in MOOC+OLI and 301 in MOOC-only.」 |

### RQ3：三種使用量與成績

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 14 | 中位數切分後的人數 | 三項都低 201；三項都高 184；reader-doer 120；watcher 105；其餘組合各 > 70 | — | Exploratory Data Analysis；Fig. 3a | 776–789 | 「the most frequent combinations are the extremes」 |
| 15 | 小考總分（Fig. 3b） | doer 約 94 分，不論閱讀或觀看高低；non-doer 中，閱讀或觀看其一為高者 80 分，兩者皆低 62 分 | 中位數切分的各組 | 同上 | 804–809、716–722 | 「doing the activities may be sufficient to do well on the quizzes, but if you do not do the activities, you will be better off at least reading or watching.」 |
| 16 | 作者對 #15 的附註 | doer 在對應組裡通常也讀得、看得比較多 | — | 同上 | 808–809、715 | 「(Note, however, that the doers tend to read and watch more than the nondoers in the matched reading and watching groups.)」 |
| 17 | 期末考（Fig. 3c） | doer 約 28 分；只有閱讀或觀看高約 26；全低 23。只做 26.7、加觀看 27.4、加閱讀 28.2、兩者都加 28.7 | 同上 | 同上 | 795–802 | 「there is at least a hint in the final exam score showing that simply doing (26.7) is further enhanced by watching (27.4), reading (28.2), and both (28.7).」 |
| 18 | Table 4：極端組（最高四分位）表現差／優的比例 | 只高觀看：小考差 46%、優 5%；期末差 38%、優 15%。只高做活動：小考差 13%、優 42%；期末差 13%、優 16%。兩者皆高：小考差 2%、優 52%；期末差 0%、優 31% | 四分位切分 | Table 4 | 816–858、871–891 | 「However, a lot of doing alone does not facilitate excellent performance on the final (16%).」 |
| 19 | 把 Table 4 的「高觀看」換成「高閱讀」結果相似 | 原文沒有給數字 | — | 同上 | 904–913 | 「it may not be the video lecture per se, but the declarative content present in video or reading, that appears important, on top of lots of learning by doing, for excellent performance on the final exam.」 |
| 20 | Tetrad 模型適配 | 卡方（df = 7）p = 0.39，模型預測與資料沒有顯著差異 | — | Is Course Feature Use Causally Related | 823–827 | 「The model is a good one in that a chi square (df=7) test shows its predictions are not statistically different from the data (p = 0.39)」 |
| 21 | 三種使用量 → **小考總分** | 做活動 0.44（標準化係數）；看影片、讀頁面各約 .065 | 依變項是 total quiz score，不是期末考 | 同上 | 860–869 | 「The most influential impact comes from doing activities, with a normalized coefficient of 0.44 (a 1 standard deviation increase in doing activities produces 0.44 sd increase in quiz score). The strength of this relationship is more than six times the impact of watching video or reading pages (both with coefficients of about .065) and more than three times the combined impact of watching and reading.」 |
| 22 | 前測 → 小考 | 0.25 | — | 同上 | 919–922 | 「a higher pretest score directly causes a higher quiz score (coefficient = 0.25). Thus, effects of course feature use are adjusted for and above and beyond this influence.」 |
| 23 | 前測 → 做活動 | 0.08（弱） | — | 同上 | 923–924 | 「Higher pretest also causes greater activity use, though weakly (0.08).」 |
| 24 | 閱讀 → 做活動、閱讀 → 觀看 | 0.39、0.12 | — | 同上 | 924–945 | 「more reading causes both more doing and more watching, with a larger coefficient for doing (0.39 > 0.12). The higher influence of reading on doing may reflect the proximity of these features within OLI pages」 |
| 25 | 小考 → 期末 | 0.65 | — | 同上 | 945–953 | 「Higher quiz scores cause higher final scores and this relationship is quite strong (0.65).」 |
| 26 | 三種使用量有沒有直接指向期末考的路徑 | 原文沒有說（Figure 4 在文字檔只有圖說）。正文只描述使用量到小考、小考到期末 | — | — | 860–862、945–953 | 「student-learning improvements as measured by the quizzes (and highly influenced by doing more activities) do well transfer to the final exam.」 |
| 27 | 時間（初步分析） | 平均做 387 個活動、讀 297 頁；做活動共 21.6 小時、閱讀 25.0 小時；每個活動 3.4 分鐘、每頁 5.0 分鐘 | — | Related Work, Limitations | 959–970 | 「students, on average, do more activities than read pages (387 vs. 297, respectively), but spend less overall time doing activities than reading (21.6 hrs vs. 25.0 hrs, respectively).」 |

### 原文內部對不攏的地方（照抄，不猜）

- 第 661–662 行「551 students, 251 in MOOC+OLI and 301 in MOOC-only」：相加是 552；MOOC-only 考期末的總共只有 215 人（Table 1、第 297–298 行），而這個迴歸的依變項是期末考分數。
- 第 750–752 行「every extra point on the pre-test yields 1.06 more questions correct」，但 Table 3 裡 1.06 是 Quiz 1 score 的係數，第 692–694 行又說 pretest score 不顯著。
- 第 906–909 行「high doing is enough to increase chances of excellent quiz performance but it takes combining high reading along with high doing to increase chances of excellent quiz performance」：後半句依上下文應指 final，原文寫的是 quiz。
- Table 1「Pre-test 12218，44.89%」；「Quizzes 2373」對註 1 的 2374。
- 第 777–779 行兩次都寫「shown in the leftmost bar」。

## 作者自己的解釋與保留

- **自然使用資料的不確定性**（第 325–333、263–270 行）：「using data from natural student use of MOOCs adds uncertainty in making inferences about causal relationships as compared to using data from experimental designs. This uncertainty is further increased by the large attrition or dropout that is typical in MOOCs.」「effects that might be attributed to other factors (e.g., course features) might instead be so-called "selection effects"」「Nevertheless, there is a real opportunity … to provide initial, if not confirming, evidence of factors of potential importance」。
- **RQ2 的選擇效應**（第 645–651 行）：「the difference in these self-selected groups may be a consequence of features of the students rather than of the OLI instruction. Students who registered to use the OLI materials may simply be better students. One way to test for (but not completely eliminate) the possibility of such a selection effect is to build a statistical model using all the information we have about student characteristics.」
- **註冊不等於使用**（第 753–757 行）：「Just because students register to use OLI, does not guarantee that they do.」
- **作者仍主張因果有支持**：摘要（第 56–59 行）；模型的用語是「direct causal impacts」（第 860 行）；前測的影響已被調整（第 921–922 行）。
- **期末考上，觀看／閱讀有附加價值**（第 892–913 行）：作者的一個可能解釋是期末考由教師出題，可能考到只在影片裡出現、OLI 活動沒涵蓋的內容；另一個是重要的是影片或閱讀裡的陳述性內容。
- **時間的保留與作者的回應**（第 959–970 行）：「If more time were spent doing activities than reading, our results may simply be a consequence of this extra time.」初步分析顯示做活動的總時間反而較少，作者認為這「further supports the notion that doing interactive activities has a greater impact on learning than passive reading」。影片觀看時間還沒有做同樣的分析（第 971–973 行）。
- **互動而不只是主動**（第 994–1000 行）：和其他 MOOC 的 learning by doing 活動的差別可能在於「the availability of fast feedback and hints in the context of doing. Such interactive (not merely active) experiences may be particularly effective for learning.」
- **結論的措辭**（第 1020–1023 行）：「Our results support the view that video lectures may add limited value for student learning and that providing more interactive activities will better enhance student learning outcomes.」
- **其他 MOOC 的結果沒那麼明確**（第 989–994 行）：轉述 Champaign 等 2014 對兩個 MOOC 資料集的分析「was less conclusive」。

## 作者列的限制

這一節標題是「RELATED WORK, LIMITATIONS AND FUTURE WORK」（第 975–1034 行），限制散在其中：

1. 沒有用到全部資料：同儕評分的寫作作業、討論區參與和成績、退出的關係都還沒分析（第 1049–1053 行）。
2. 使用量只量了「開始幾次」，沒有量花多少時間；各資源的開始與結束時間不完整，時間估計比看起來難（第 1053–1058、955–958 行）。
3. 時間可能是混淆因素；只做了初步分析，影片時間還沒做（第 959–973 行）。
4. 分析是整門課加總的層級，更細的分析（對應到 OLI 標好的學習目標與技能）還沒做（第 1002–1007 行）。
5. 只有一門心理學 MOOC；同一門課 2014 春季的第二次開課、OLI 社區大學評估計畫的資料還沒分析，能否推廣待驗證（第 1008–1012、1025–1034 行）。

散在別處的限制：

- 資料是相關性的、學生自選、流失率高（第 325–333 行；全體只有 4% 考期末，第 514–515 行）。
- RQ3 的分析對象是考了期末的 OLI 註冊者（939 人，佔註冊者 3.4%）（Table 1）。
- 小考題目出自 OLI 題庫，和 OLI 活動同源（第 212–214、947–950 行）。原文沒有把這一點列為限制，只用它解釋小考到期末的連結強度。
- 原文沒有報告係數的信賴區間或標準誤（Tetrad 模型部分）。

## 與摘要不一致的地方

- 摘要（第 54–56 行）：「We estimate the learning benefit from extra doing (1 SD increase) to be more than six times that of extra watching or reading.」內文（第 862–869 行）這個 0.44 對 .065 是對**小考總分**的係數。摘要用「learning benefit」，沒有說依變項是小考；小考題目出自 OLI 題庫（第 212–214 行）。
- 摘要（第 51–53 行）：「students doing more activities learn more than students watching more videos or reading more pages」。內文在期末考上有保留：只做活動而少看影片的人，期末表現優異的比例是 16%，和只看影片的 15% 相近；兩者都高才是 31%（Table 4，第 883–891 行）。
- 其餘（資料來自一門心理學 MOOC、相關性質、用了因果推論）逐項對過，一致。

## 與現有文章稿不一致的地方

只有第 2 篇引用。行號是 2026-10-14 讀到的版本。

1. **第 76 行**（小節標題）：「做比讀更能預測成績」
   → 相符。原文的探索性分析小標是「Doing, not Watching, Better Predicts Learning」（第 768–769 行）。
2. **第 78 行**：「Kenneth Koedinger 等人 2015 年的研究分析一門心理學線上課程的紀錄。」
   → **相符**（第 181–189 行）。
3. **第 78 行**：「學生多做一個標準差的互動練習，測驗成績的提升大約是多讀一個標準差頁面的六倍。」
   → 原文：0.44 對約 .065，「more than six times」（第 862–869 行）。**數字相符，對照條件只寫了一半**：
   - 依變項是每週小考的總分，不是期末考；小考題目出自 OLI 題庫，和互動練習同源（第 212–214、947–950 行）。稿子寫「測驗成績」，讀者會以為是一般的考試。
   - 「六倍」同時適用於看影片（係數也是約 .065），稿子只寫了「讀頁面」。這一節的標題是「做比讀」，只寫讀不算錯，但原文的主標是 doing 對 watching。
   - 原文是「超過六倍」，稿子寫「大約六倍」。
   - 期末考上的圖像不同：只做活動、少看影片的學生，期末優異的比例（16%）和只看影片的（15%）差不多，兩者都高才到 31%（Table 4）。稿子沒有提。
   建議改成：「學生多做一個標準差的互動練習，每週小考總分高 0.44 個標準差，是多看影片或多讀頁面（各約 0.065）的六倍多。小考題目和練習出自同一個題庫；在教師自己出的期末考上，只做練習的人拿高分的比例並沒有比只看影片的人高，要兩樣都多才明顯。」
4. **第 78 行**：「這是觀察資料，作者用了因果推論的方法，但沒有隨機分派；願意多做題的學生本來就可能比較認真。」
   → 前半**相符**（第 56–59、325–333 行）。後半「願意多做題的學生本來就可能比較認真」方向和作者自己提的選擇效應一致（第 645–649 行「may simply be better students」，但那一句說的是 RQ2 的 OLI 註冊者對未註冊者），原文對 RQ3 的回應是模型已調整前測（第 921–922 行）。稿子沒有寫的另一個作者自己提的保留是時間：「If more time were spent doing activities than reading, our results may simply be a consequence of this extra time」，以及作者的初步檢查（做活動的總時間反而較少，第 959–970 行）。建議補上時間這一條，並把「比較認真」標成稿子的說法或改引作者原話。
5. **第 207 行**（限制）：「Koedinger 的資料也只能說做題的人考得好，不能說題目讓他們考得好。」
   → **這是稿子作者的判斷，不是原文的說法，而且比原作者保守**。原作者的立場是：資料是相關性的，但因果推論方法「lend support for the claim that the associations we find are causal」（第 56–59 行），並用「direct causal impacts」描述模型（第 860 行）；同時承認自然使用資料「adds uncertainty」、只能提供「initial, if not confirming, evidence」（第 266–270、325–328 行）。建議改成兩句分開：作者怎麼主張、我為什麼保留，例如「作者認為因果模型支持做題有因果效果，同時承認沒有隨機分派、流失率高；我把它當成相關證據」。
6. **第 231 行**（附錄）：「課程註冊 27,720 人，使用互動教材並考期末的有 939 人。」
   → **相符**（Table 1）。較精確的說法是「註冊使用 OLI 教材並考期末的 939 人」；Tetrad 模型實際用了多少人，原文沒有明說。
7. **第 231 行**：「做練習的標準化係數是 0.44，看影片與讀頁面各約 0.065。」
   → **數字相符**（第 862–868 行）。漏了依變項（小考總分）、模型適配（卡方 df = 7，p = 0.39）、小考到期末 0.65、前測到小考 0.25。
8. **第 255 行**（參考資料）：「讀了摘要、研究問題、結果與結論。」
   → 自述的讀取範圍沒有包含「Related Work, Limitations and Future Work」一節（第 975–1034 行），時間的保留、只量次數不量時間、只有一門課這幾條限制都在那一節；課程設計一節（小考題目出自 OLI 題庫）也不在自述範圍內。上面第 3、4 條漏掉的內容正好落在沒讀的章節。
9. **審稿報告**：把 Koedinger 2015 列在「數字核對相符」（報告第 209 行），數字部分我同意。報告沒有指出依變項是小考總分、小考與練習同源、期末考上的不同圖像、時間的保留，也沒有指出第 207 行把稿子的判斷寫成資料的性質。

小計：需要改或補的 4 條（3、4、5、7）；相符 3 條（1、2、6）；第 8 條是讀取範圍。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | 1–420 | 題名與作者、導言右欄開頭（第 31–37 行）、摘要、導言、課程特徵與設計、三個研究問題、OLI 活動說明、Methods（選擇效應、三個研究問題的樣本、整體使用量）、Figure 1 圖說、Table 1 前半（格子散開） |
| 2 | 420–839 | Table 1 後半、non_activities_pageview 的定義、Tetrad 方法、註 1、RQ1 結果與 Table 2、Figure 2 圖說、RQ2 結果與 Table 3、RQ3 探索性分析與 Figure 3 圖說、Tetrad 模型適配、Table 4 前半 |
| 3 | 839–1259 | Table 4 後半與說明、Tetrad 係數、註 2、Figure 4 圖說、Related Work／Limitations／Future Work、Conclusion、Acknowledgements；第 1063–1259 行是書目（36 條），掃過 |
| 補 | PDF 第 4 頁（layout） | 讀完後重抽，對 Table 1 的欄位 |

## 補記（2026-10-14，複審後整理）

「原文內部對不攏」一節的「Pre-test 12218，44.89%」沒有寫原因：12218 ÷ 27720 ≈ 44.08%，與原文印的 44.89% 不合。文章沒有用這個數字。

原文檔最後一行沒有換行符號，`wc -l` 少算一行；多出的那一行只有換頁字元，沒有內容。
