# 抽取紀錄：Ericson、Moore、Morrison、Guzdial 2015〈Usability and Usage of Interactive Features in an Online Ebook for CS Teachers〉

- **合法公開來源**：https://dl.acm.org/doi/10.1145/2818314.2818335（刊出版，2026-10-14 核對）。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。ACM 版另存 `.research/raw/learning-content/q3-activity/ericson2015wipsce-acm-dl.pdf`；與手上經 Wayback 取得的 `ericson2015wipsce.pdf` 位元組不同，`pdftotext` 轉出的 8,688 個詞逐詞相同。

## 檔頭

- **書目**：Barbara Ericson、Steven Moore、Briana Morrison、Mark Guzdial（2015）。Usability and Usage of Interactive Features in an Online Ebook for CS Teachers. WiPSCE '15（Workshop in Primary and Secondary Computing Education），2015-11-09 至 11，London。ACM，ISBN 978-1-4503-3753-3，DOI 10.1145/2818314.2818335。作者姓名、單位（Georgia Tech）對首頁核過（L3–14、L51–56）。
- **原文檔**：`.research/raw/learning-content/q3-activity/ericson2015wipsce.txt`（1,635 行、52,534 字元）與 `ericson2015wipsce.pdf`（10 頁，雙欄）。
- **讀取日期**：2026-10-14
- **版本**：ACM 刊出版面（首頁有 ACM 版權聲明與 DOI）。
- **供哪幾篇用**：order 10（10-c 的對照：沒有學分的自學電子書）。
- **作者與教材的關係**：電子書是作者群自己做的（L18「Our group has created an ebook」、L96），研究目的之一是驗證自己的設計（L124–126「We use our ebook as a platform to test design guidelines. This paper is an exploration of the effectiveness of our design decisions.」）。不是商業產品（建在開源的 Runestone Interactive 上，L157），但也不是第三方評估。經費：NSF Grant 1138378（L1452–1456）。

## 研究設計

這篇有兩個研究。

### 研究一：可用性問卷（第 3 節）

- **受試者**：18 位教師（L115、L370）。從一個運算教育部落格與 CS 教師郵件清單招募；只收教學經驗半年以上的；都有學士以上學位、都用過某種電子書（L258–263）。完成者有禮品卡（L268）。
- **做法**：三部分問卷，比較三個電子書平台：Runestone（作者用的）、Zyante（zyBooks）的 Python 書、CS Circles（L264–267）。八個版面項目用 1（Poor）到 5（Excellent）評；再評四種互動元件（Active Code、Code Lens、Parsons Problems、Multiple Choice）；最後每種元件選一個做得最好的平台（L277–304）。
- **順序沒有平衡**：一律先 Runestone、再 Zyante、最後 CS Circles（L283–286）。

### 研究二：使用研究（第 4 節）

- **類型**：小樣本的觀察研究，分析紀錄檔加前後測。沒有對照組。
- **受試者**：同樣的管道招募。條件：寫程式經驗兩個月以下；前測（9 題，多取自其他研究的入門 CS 題）得分低於 40% 才收（L425–434）。符合的有 **10 位教師**（L443）。
- **教材**：作者做的 CS Principles 電子書（Python）的前 8 章，內容是變數與迴圈（L411–414、L643）；全書當時 20 章（L645）。設計是「例題＋練習」交錯：Active Code、Audio Tour、Code Lens 呈現例題，接著 Parsons 題、選擇題或填空題（L183–193）。8 章裡有 15 題 Parsons、40 題選擇題（L666–667）；第 3 章有 31 個互動元件、第 4 章 10 個、第 2 章只有 2 題選擇題（L979–981）；第 8 章有 17 個（L456–457）。
- **進行方式**：自己的步調讀；每讀完兩章做一份後測（各 3、3、4、3 題，Table 3 表頭）；後測時不准回頭看書（L435–441）。
- **誘因**：沒有學分。四份後測全做完的給 50 美元禮品卡（L441–442）。
- **量了什麼**：完成情形、前後測分數、紀錄檔裡各互動元件的使用次數與順序、每章首尾事件之間的時間、開放式意見、教學信心自評。
- **小組共讀功能**在研究期間壞掉沒有作用（L152–153）。

## 結果（逐項）

### 研究一

Table 1（L314–358；對過 PDF p.4）平均（標準差），1＝poor、5＝excellent：

| 項目 | Runestone | Zyante | CS Circles |
|---|---|---|---|
| Navigation | 3.09 (1.19) | 3.68 (1.29) | 2.50 (1.41) |
| Page Information | 3.50 (0.80) | 3.43 (1.12) | 2.73 (1.12) |
| Media Arrangement | 3.64 (1.00) | 3.50 (0.96) | 2.86 (1.08) |
| Page Layout | 3.64 (0.95) | 3.67 (0.97) | 2.73 (1.12) |
| Font | 3.68 (0.84) | 3.68 (0.89) | 3.59 (0.91) |
| Legibility | 3.73 (0.70) | 3.68 (0.78) | 3.50 (1.19) |
| White Space | 3.64 (0.90) | 3.50 (1.19) | 3.27 (1.20) |
| Color | 3.95 (0.65) | 3.73 (0.88) | 3.38 (1.07) |

Table 2（L373–399；對過 PDF p.4）每種元件被選為「最好」的票數：

| 元件 | Runestone | Zyante | CS Circles |
|---|---|---|---|
| Active Code | 10 | 6 | 2 |
| Code Lens | 7 | 8 | 3 |
| Parsons Problem | 12 | 5 | 0 |
| Multiple Choice | 10 | 6 | 1 |

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 可讀性與導覽 | Runestone 與 Zyante 相近，CS Circles 明顯較低 | 三個平台，同一批 18 人，順序固定 | L310–312 | 「Runestone and Zyante were similarly highly-ranked (Table 1). CS Circles was rated markedly less usable.」 |
| 2 | 導覽一項 Runestone 較低 | 3.09 對 Zyante 3.68 | 同上 | Table 1 | 表列；內文沒有提 |
| 3 | 元件用途認錯 | 18 人裡 3 人認錯過至少一個元件的用途 | — | L362–367 | 「only three of the participants misidentified the purpose of any widget.」 |
| 4 | 有一人全盤否定 | 1 人 | — | L400–403 | 「"They were all abysmal interfaces that would cause me to reject the book violently." The other 17 participants liked the ebooks」 |

沒有做檢定。

### 研究二：完成情形

| # | 結果 | 數字 | 條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 5 | 至少做一份後測 | 10 人裡 7 人 | 自學、無學分、做完四份後測有 50 美元 | L443–444 | 「Of those ten, seven completed at least one post-test, and five completed all four post-tests.」 |
| 6 | 四份後測全做 | 10 人裡 5 人（Table 3：Vicki、Fred、Gina、Jim、Cabe） | 同上 | L444；Table 3 | 同上 |
| 7 | 做完四份後測的人不等於讀完八章的人 | Jim 做完四份後測，但紀錄檔顯示只完成第 1 到 6 章；Debra 讀完八章但一份後測都沒做 | 同上 | L445–448 | 「one of the teachers, Jim, completed all four post-tests but only actually completed chapters one through six in the ebook. Another teacher, Debra, completed all eight chapters of the ebook, but didn't take any of the post-tests.」 |
| 8 | 作者的完成率 | 5／10＝50% 讀完八章 | 同上 | L452–453、L1414–1415 | 「Having five (50%) teachers out of 10 complete the eight chapters of the ebook is still quite high, though our participants were compensated with a gift card」 |
| 9 | 讀完的人裡有兩位跳過大半互動元件 | 第 8 章 17 個互動活動，Gina 只做 5 個、Vicki 只做 7 個；第 5 與第 8 章兩人都跳過一半以上 | 同上 | L456–458、L1003–1004 | 「Gina only did five of the 17 possible interactive activities in chapter 8 and Vicki did only seven, so they may have been focusing on "completing" the chapter to earn the gift card.」「Gina and Vicki both skipped more than half of interactive features in Chapters 5 and 8」 |
| 10 | 禮品卡的影響（作者判斷） | 無數字 | — | L455–456、L493–494 | 「$50 is a small cost, but it probably had a significant impact on completion rates.」「Compensation likely had a significant impact on our completion rate, but did not eliminate non-completers.」 |
| 11 | 三位沒做任何後測的教師 | 一位來了三天只跑了一個例題；一位讀完兩章開始第三章；一位（Debra）三天內讀完八章再多讀四章 | — | L475–487 | 「A third teacher (a black female) actually completed all eight chapters in the study, and four more, all within the first three days of the study. But she did not take any post-tests.」 |

我依 Table 4「Last Chapter Visited」核對：到第 8 章的是 Vicki、Fred、Gina、Cabe 四人，加上 Debra 是五人；Jim 的最後一章是 7、Table 6 的時間只到第 6 章。所以「5／10 讀完八章」與「5／10 做完四份後測」是不同的五個人，原文在摘要與結論把兩件事當成同一個 50%。這個對法是我做的，原文沒有列出「讀完八章的五人」是誰。

### 研究二：前後測（Table 3，L538–631；對過 PDF p.6）

| 化名 | 性別 | 種族 | 自評程式知識 | 前測（9 題） | 第 1–2 章（3 題） | 第 3–4 章（3 題） | 第 5–6 章（4 題） | 第 7–8 章（3 題） |
|---|---|---|---|---|---|---|---|---|
| Mary | 女 | Black | Average | 22% | 66% | | | |
| Vicki | 女 | Black | Extremely Poor | 0% | 33% | 33% | 25% | 0% |
| Fred | 男 | N/A | None | 33% | 66% | 100% | 50% | 66% |
| Gina | 女 | White | Below Average | 22% | 66% | 100% | 75% | 33% |
| Jim | 男 | White | Below Average | 11% | 66% | 100% | 75% | 66% |
| Kay | 女 | White | Average | 33% | 100% | | | |
| Cabe | 男 | White | Extremely Poor | 33% | 100% | 100% | 100% | 66% |

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 12 | 前後測不能直接比 | L510–514 | 「Table 3 may seem to suggest that learning occurred from pre-test to post-test, but while the participants had lowscores on the pre-test and higher scores on the post-test, the tests were not close matches. The pre-test was considerably harder than any post-test」 |
| 13 | 最後一份後測低分的兩人是少用互動元件的兩人 | L507–509 | 「Two participants of the five completers scored below 50% on the last test. However, these were the participants, Gina and Vicki, who utilized much less of the interactive features.」 |
| 14 | 教學信心 | L529–536 | 「Interestingly the teachers who reported higher confidence in their ability to teach the material spent much more time working through the ebook and used more of the interactive features than teachers who didn't feel confident.」Gina 自評「below average」、Vicki「extremely poor」 |
| 15 | 教師要更多練習 | L636–641 | 「I would benefit from a LOT more practice exercises to accompany the text. I feel like I get it, but won't hold on to it otherwise.」 |

### 研究二：互動元件的使用（Table 4，L718–827；Table 5，L829–865；都對過 PDF p.7）

Table 4：每個不重複的元件算一次。

| 化名 | Parsons | Active Code | Code Lens | Audio Tours | 選擇題 | 填空題 | 語法錯誤 | 最後到的章 | 最後一份後測（分數） |
|---|---|---|---|---|---|---|---|---|---|
| Mary | 3 | 13 | 1 | 0 | 19 | 1 | 3 | 5 | 第 1–2 章（66%） |
| Vicki | 5 | 17 | 1 | 5 | 40 | 0 | 0 | 8 | 第 7–8 章（0%） |
| Fred | 21 | 67 | 30 | 26 | 60 | 2 | 12 | 8 | 第 7–8 章（66%） |
| Gina | 6 | 3 | 2 | 4 | 43 | 0 | 0 | 8 | 第 7–8 章（33%） |
| Jim | 9 | 23 | 8 | 2 | 24 | 1 | 2 | 7 | 第 7–8 章（66%） |
| Kay | 0 | 7 | 2 | 1 | 7 | 1 | 0 | 3 | 第 1–2 章（100%） |
| Cabe | 15 | 35 | 9 | 3 | 45 | 1 | 2 | 8 | 第 7–8 章（66%） |

Table 5（改過程式／跑過程式／語法錯誤）：Mary 20／36／3；Vicki 0／19／0；Fred 93／153／12；Gina 1／4／0；Jim 14／42／2；Kay 3／12／0；Cabe 18／52／2。

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 16 | 最後後測分數最高的人用最多互動元件 | Fred、Jim、Cabe（各 66%）的 Parsons、Active Code、Code Lens 用得最多 | L671–675 | 「The teachers who had the highest scores on the final posttest also made the greatest use of the interactive features.」 |
| 17 | **選擇題與填空題的作答量和後測成績看不出關係（無效果）** | Vicki 選擇題 40 題、最後後測 0%；Jim 24 題、66% | L681–688 | 「There is no obvious relationship between the amount of multiple choice and fillin-the-blank questions attempted and better performance on any post-test.」 |
| 18 | **幾乎不碰其他元件的人仍然會答選擇題** | Vicki、Gina 到最後一章幾乎只答選擇題 | L681–683、L1387–1389 | 「In fact Vicki and Gina ignored most of the other interactive features by the last chapter, but did attempt the multiple choice questions.」 |
| 19 | 答了但不重答 | Vicki 選擇題 38 次錯、10 次對，只改過一次答案 | L683–685、L1367–1376 | 「Vicki got most of the multiple-choice questions that she answered wrong (38 wrong vs 10 correct). Most of the participants answered the multiple-choice questions until they got them correct, which probably led to more learning.」 |
| 20 | 有人先答題才看例題 | Vicki 第一章先答選擇題、答錯才回去跑程式與聽導覽 | L1233–1240 | 「we were somewhat surprised that a teacher would try to answer the question first before actually studying the example.」 |
| 21 | 元件不會用 | Vicki 按了 Parsons 題的 Check 鈕但從沒拖過任何程式區塊；Kay 完全沒試 Parsons | L664–665、L1377–1383 | 「it was always wrong, because she never once dragged any of the code blocks into position! … She doesn't seem to have figured out how to use that widget.」 |
| 22 | 可以改程式但不強制時，改的人有多有少 | 改過程式的次數 0（Vicki）到 93（Fred） | L701–713 | 「The amount of interaction with code is interesting since our book encouraged interaction with code, but did not require it.」 |
| 23 | 多數人照章內順序做 | 無數字 | L1002–1003 | 「Most teachers worked though the interactive features in the order that they appear in the chapters.」 |
| 24 | 例題與練習之間來回 | 第 5 章 Fred、Cabe、Jim 答對選擇題後又回去跑、改例題 | L1220–1229 | 「This type of deeper exploration should improve learning.」（作者推測） |
| 25 | 用得最多的幾乎都是男性 | 無檢定 | L955–959 | 「nearly all of the participants who made the most use of the ebook were all male. … We can't tell from these results with a small number of participants」 |
| 26 | 作者的總結 | — | L966–974 | 「Overall, the results support the hypothesis that more interaction with the book was correlated with better results on the post-tests.」 |

### 研究二：時間（Table 6，L867–952；對過 PDF p.7）

時間＝該章第一個事件到最後一個事件，「We cannot account for time spent reading」（L1021–1024）。

| 化名 | Ch1 | Ch2 | Ch3 | Ch4 | Ch5 | Ch6 | Ch7 | Ch8 |
|---|---|---|---|---|---|---|---|---|
| Mary | 0:47 | 0:09 | 0:33 | 0:06 | 0:23 | | | |
| Vicki | 0:16 | 0:14 | 0:17 | 0:06 | 0:09 | 0:16 | 0:09 | 0:03 |
| Fred | 0:24 | 0:39 | 1:41 | 0:57 | 0:44 | 1:46 | 1:35 | 2:24 |
| Gina | 0:43 | 0:39 | 0:36 | 0:12 | 1:48 | 0:29 | 0:20 | 0:10 |
| Jim | 0:21 | 0:33 | 0:57 | 0:14 | 0:26 | 0:16 | | |
| Kay | 1:10 | 0:25 | 0:15 | | | | | |
| Cabe | 0:16 | 0:07 | 0:32 | 0:08 | 0:27 | 0:32 | 0:42 | 0:30 |

八章合計（我加的，原文沒有）：Vicki 1 小時 30 分、Fred 10 小時 10 分、Gina 4 小時 57 分、Cabe 3 小時 14 分。

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 27 | 個別差異很大；後測好的人花較多時間 | L1025–1028、L976 | 「There's an enormous variance between the participants. The participants who did the best on the post-tests also spent more time in the chapters and in the ebook in total.」 |
| 28 | 章太長、時間難預估 | L993–1001 | 「the time per chapter is less predictable than we would have liked. We might fit reading the ebook better into the small chunks of time in their lives if we had more, smaller chapters … It might also be helpful to add an estimate of the time it will take to complete each chapter」 |
| 29 | 零碎時間閱讀的實例 | L983–988 | 「We see Vicki starting the book at 3:19 pm on one day and ending that session at 3:35, and the next day, she starts at 4:13 pm and ends at 4:24 pm.」 |

Table 7（第 5 章）、Table 8（第 8 章）是每人使用元件的順序表（L1030–1219、L1196–1366；對過 PDF p.8）。文字檔裡這兩張表完全打散，不能從文字檔讀。表列的人：第 5 章是 Vicki、Gina、Fred、Cabe、Jim；第 8 章是 Vicki、Gina、Fred、Cabe、Debra。看得出的事：第 5 章 Vicki 走到第 11 步、Gina 第 9 步、Fred 第 20 步；第 8 章 Vicki 只有 7 個選擇題與 Parsons 的格子有紀錄。原文沒有把這兩張表彙總成數字。

## 作者自己列的限制

1. 樣本小、有報酬：「our results come from a small study, and the teachers were compensated. We cannot be sure that we have better completion rates than a traditional MOOC until we scale up use of the ebook and do not offer compensation.」（L1418–1422）
2. 前後測量的不是同一批知識（L510–514、L1425–1426）。
3. 個別元件的價值無法判斷：「We cannot be sure yet about the value of each of the widgets.」（L1428–1429）
4. 紀錄檔只記事件，讀了多久不知道（L1021–1024）；也看不出意圖：「From just the log file, we cannot be certain about intentionality.」（L1231）
5. 花的時間與成績相關「is not surprising」，作者自己承認 time on task 可以解釋（L1028–L976）。
6. 可用性問卷的順序沒有平衡（L285–286）。
7. 性別差異「can't tell」（L957–958）。
8. 可用性研究的受試者比使用研究的受試者有經驗，後者實際上會卡在介面（L1410–1413）。
9. 受試者只讀了 20 章裡的 8 章；小組功能沒測到（L1423–1425、L1442–1444）。

## 與摘要說法不一致的地方

1. **「Significantly, teachers who used more of the interactive features in the ebook did better on the post-tests」**（L30–32）：全文沒有任何統計檢定，樣本是 7 人（最後一份後測只有 5 人、3 題）。內文的用詞是「correlated」（L966）與「did appear to lead to」（L1427）。摘要的 Significantly 不是統計意義上的顯著。
2. **摘要沒提無效果的那一半**：內文明寫選擇題與填空題的作答量與後測成績「no obvious relationship」（L685–687）。「用越多互動元件成績越好」只在 Parsons、Active Code、Code Lens 上看得到。
3. **「Five of the ten teachers completed the first eight chapters which is a 50% completion rate」**（L29–30）：內文顯示讀完八章的五人與做完四份後測的五人不是同一批（Jim 與 Debra），而且讀完的人裡 Gina、Vicki 在第 5、8 章跳過一半以上的互動元件。摘要沒有提 50 美元禮品卡。
4. **摘要「The ebook interleaves worked examples and interactive practice activities, which we believe will lead to more efficient and effective learning」** 是信念，研究沒有比較別的教材設計；內文也是這樣寫（L108–112「We believe」）。這一點摘要與內文一致，只是容易被當成結果引用。

**內文與表之間的不一致（照實記，不猜哪個對）**：

- Parsons 題數：內文「Fred interacted with 23 Parsons Problems」（L677），Table 4 是 21。
- Code Lens：內文「Fred interacted with 30 Code Lens problems」（L695），下一句卻寫「Fred explored the visualizations with 318 steps over his 5 problems」（L699–700）；Jim「55 times over his 5 problems」（L698），Table 4 的 Jim 是 8。
- 「All participants answered the multiple choice and fill-in-the-blank questions」（L681）：Table 4 的填空題 Vicki、Gina 是 0。
- 「Only five participants completed the third post-test, and only one scored less than 25%」（L505–506）：Table 3 第三份後測最低是 Vicki 的 25%，沒有人低於 25%。
- 「Vicki used the fewest of the interactive features」（L662）：照 Table 4 相加，讀到第 8 章的人裡 Gina 的總數（58）比 Vicki（68）少；Kay（17）、Mary（36）更少但沒讀完。相加是我算的。
- 「On average, participants ranked all the Runestone design factors as superior (Table 2)」（L371–372）：Table 2 的 Code Lens 是 Zyante 8 票對 Runestone 7 票；Table 1 的 Navigation 與 Page Layout 也是 Zyante 較高。
- Table 2 說每人一票共 18 票（L370–371），Parsons 與 Multiple Choice 兩列加起來是 17。
- Jim：內文說只完成第 1 到 6 章（L446–447），Table 4 的「Last Chapter Visited」是 7（到過不等於完成，可能不矛盾）。

## 與清單『要撐的結論』不合的地方

清單寫這篇是「10-c 的非產品方對照：沒有學分的教師自學電子書，十人裡五人讀完前八章」。

1. **「非產品方」要改寫**：作者不是廠商，但電子書是他們自己做的，論文明說是在檢驗自己的設計決定。寫成「學術團隊評估自己做的開源電子書」比較準；不能當成獨立第三方。
2. **「十人裡五人讀完前八章」數字對，但缺三個條件**：(a) 做完後測有 50 美元禮品卡，作者自己說這「probably had a significant impact on completion rates」；(b) 這 10 人是先通過前測、主動報名的教師，作者說相當於 MOOC 裡「complete the first homework」的那群（L451–452），不是一般讀者；(c) 五位讀完的人裡有兩位在第 5、8 章跳過一半以上的互動元件，一位第 8 章只花 3 分鐘。「讀完」不等於「做了題目」。
3. **它不是 10-c 那種「完成率」的對照**：Edgcomb 2015 的完成率是「指派的簡答題裡答對的比例」；這篇的 50% 是「讀到第 8 章的人數比例」。兩個數字的定義不同，不能並排成「有學分九成、沒學分五成」。這篇也沒有量「先試答才看答案」的比例。
4. **清單沒寫、原文對 order 10 更有用的結果**：
   - 最不投入的兩位讀者跳過其他互動元件，卻仍然答選擇題（結果 18）。這是「哪一種題目會被做」的觀察，只有 2 人。
   - 選擇題答得多不等於學得多（結果 17），答錯不重答的人後測最差（結果 19）。對 10-a「會答」是提醒：會答不代表認真答。
   - 可以選擇要不要改程式時，投入差距是 0 次對 93 次（結果 22）。
   - 有讀者不會用 Parsons 元件、也沒看教學影片（結果 21）。
5. **樣本量**：使用研究實際分析的是 7 人，最後一份後測 5 人、每份後測 3 到 4 題。任何「用越多、學越好」的說法都只能寫成個案觀察。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | `ericson2015wipsce.txt` L1–420 | 標題、作者、摘要、第 1 節（為什麼需要線上師培）、第 2 節（電子書設計；文字檔裡節標題排在內文後面）、第 3 節可用性研究（方法、Table 1、Table 2、發現）、第 4 節開頭 |
| 2 | L420–1039 | 4.1 方法與受試者、4.2 前後測（Table 3）、4.3 紀錄檔分析（Table 4、5）、Table 6、4.4 時間、Table 7 開頭 |
| 3 | L1039–1635 | Table 7、Table 8（文字檔打散）、Vicki 個案五點、第 5 節結論、致謝、參考文獻 34 筆（L1460–1634，書目，掃過） |
| 4 | `ericson2015wipsce.pdf` p.3–8（逐頁看版面） | 對 Table 1 到 Table 8 每一格；看 Fig. 3 到 7；確認雙欄交錯處的閱讀順序（L449–515 兩欄交錯、L976–1030 的 4.4 節段落次序） |

對過 PDF 的表：Table 1、2、3、4、5、6、7、8。PDF p.1–2（Fig. 1、2 所在）與 p.9–10（參考文獻）沒有另外看版面，內容已由文字檔讀過。原文沒有附錄；註腳三個是網址（L269–275）。
