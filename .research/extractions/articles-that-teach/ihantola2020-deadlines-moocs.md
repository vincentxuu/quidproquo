# 抽取紀錄：Ihantola、Fronza、Mikkonen、Noponen、Hellas 2020，Deadlines and MOOCs: How Do Students Behave in MOOCs with and without Deadlines

- **書目**：Petri Ihantola（University of Helsinki）、Ilenia Fronza（Free University of Bozen-Bolzano）、Tommi Mikkonen（University of Helsinki）、Miska Noponen（University of Helsinki）、Arto Hellas（Aalto University）。作者名與單位對 PDF 首頁核過；清單上「作者名待補」補在這裡。*2020 IEEE Frontiers in Education Conference (FIE)*，Uppsala，2020-10-21，Crossref 登記頁碼 1–9。DOI：10.1109/FIE44824.2020.9274023（Crossref 與赫爾辛基典藏頁都是這個；清單只給了 IEEE Xplore 網址）。摘要首行自標「Full research paper」。
- **原文檔（重抓）**：`.research/raw/learning-content/q4-time/ihantola2020-deadlines-moocs-helda.pdf`（10 頁：1 頁典藏封面＋9 頁論文）與同名 `.txt`（1,467 行、47,023 字元；第 1 行是我加的來源註記；`pdftotext` 不帶 `-layout`）。
- **重抓來源**：赫爾辛基大學機構典藏 HELDA，`https://helda.helsinki.fi/handle/10138/322908`（封面註明「electronic reprint of the original article … may differ from the original in pagination and typographic detail」）。典藏的中繼資料把權限標成 closedAccess，但檔案可以公開下載；另有 Aalto 大學研究入口的同一篇（`research.aalto.fi/files/76856536/…`），沒有另外下載比對。
- **舊檔**：`q4-time/deadlines-moocs-ieee2020.md`（158 行、32,509 字元）正文各節都在，但**缺摘要、Table I–IV、Fig. 1–2 與參考文獻**。舊檔已從頭讀完並與新檔對過，正文句子相同。之後以新檔為準。
- **版本**：作者稿（機構典藏的重排版）；內文與 IEEE 版是否逐字相同沒有核對。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 19（清單 D 第 19#9 列）
- **表格對照**：Table I–IV 全部用 PDF 頁面讀過（第 4、5、6 頁）；Fig. 1、2 看過圖。文字檔把表格拆成一行一格，下面的數字都依 PDF 版面。

行號用新文字檔的行號。

## 研究設計

- **類型**：觀察性比較（同一門課的兩個版本，學生自己選），不是隨機實驗。舊檔標題與清單都沒有寫錯這一點。
- **課程**：赫爾辛基大學 2019 年的免費入門程式設計 MOOC（Java），5 ECTS、約 150 小時；教材分七個單元，對應七個學習週；每週有數十題程式作業，交到自動批改系統（L226–246 一帶，III.A）。
- **兩個版本**（L247–255、L304–316）：
  - **固定時程版（fixed-schedule）**：每週釋出、有固定截止日。成績＝完成的作業數 50%＋線上考試 50%；總分與考試都要過 50% 才通過。可以中途才加入（L1150–1156）。
  - **自訂進度版（self-paced）**：除了課程到期日之外沒有截止日，可做到 2020 年 1 月。**要完成前一單元至少 90% 的程式作業才能進下一單元**；成績只看期末線上考試。
  - 自訂進度版每個單元的教材，是在固定時程版該單元截止之後才釋出的（L252–254）。
  - 作者自己寫：兩個版本「differ in their schedule and grading」（L247–248）。
- **固定時程版的時間表**（Table I，L256 起；PDF 第 4 頁）：七個單元，釋出日 2018-12-14 到 2019-02-15，截止日 2019-01-21 到 2019-03-04；各單元可用週數 5.5、4.5、3.5、2.5、2.5、2.5、2.5；作業數 41、33、34、28、17、14、9（合計 176）。
- **受試者**（L318–326）：同意研究使用資料且至少完成一題程式作業的人，固定時程版 4,162、自訂進度版 5,309；兩邊都參加的 616 人剔除；分析樣本固定時程版 **3,546**、自訂進度版 **4,693**。沒有人口資料。課程對任何人開放，本校學生人數「marginal」；不需註冊，只有要拿證書或學分的人最後才登記（L327–334）。
- **資料**：程式環境收集的按鍵記錄彙總（每日輸入事件數、測試次數、提交次數）。**沒有成績與修課記錄**：「In this study, we had no access to the actual study records and grading data.」（L352–353）
- **量了什麼**：
  - 「某週活躍」＝有編輯過屬於那一週教材的任何一題程式作業（L354–356）。這裡的「週」是教材單元，不是日曆週（L1180 一帶：「weeks refer to sections in study material, not calendar weeks」）。
  - 「退出（exiting）」＝某週活躍、之後各週都不再活躍（L360–361）。
  - 「留存率」＝各週活躍人數除以全體。最後一週的留存率就是「有動過第七單元作業的人」的比例，**不是通過或完成課程的比例**。
  - 努力量：做過的作業數、提交的作業數、輸入事件數、分散在幾個日曆天。
- **統計**：卡方檢定比退出分布；Wilcoxon 等級和檢定比努力量，Bonferroni 校正，效果量用 Cliff's delta（L383–390、L415 起）。

## 結果（逐項）

### 留存與退出（Table II，L426–470；PDF 第 5 頁對過）

| 週 | 固定時程：活躍 | 固定時程：退出 | 自訂進度：活躍 | 自訂進度：退出 | 標準化殘差（固定／自訂） |
|---|---|---|---|---|---|
| W1 | 2,983 | 593 | 4,653 | 2,328 | −30.89／30.89 |
| W2 | 2,708 | 550 | 2,340 | 869 | −3.58／3.58 |
| W3 | 2,398 | 340 | 1,481 | 374 | 2.59／−2.59 |
| W4 | 2,056 | 180 | 1,112 | 179 | 2.78／−2.78 |
| W5 | 1,877 | 105 | 937 | 146 | −0.39／0.39 |
| W6 | 1,770 | 155 | 793 | 163 | 2.09／−2.09 |
| W7 | 1,623 | 1,623 | 634 | 634 | 32.51／−32.51 |

退出人數加總：固定時程 3,546、自訂進度 4,693，與內文的樣本數相符（我加的）。

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 最後一週的留存率 | 固定時程 45%、自訂進度 13%；χ²(1) = 1055.3，p < .000 | 兩個版本互比（學生自選） | L400–404 | 「45% of the students in the fixed schedule MOOC are active during the last week of the course, while for the self-paced MOOC the number is 13%.」 |
| 2 | 倍數 | 將近 3.5 倍 | 同上 | L404–406 | 「the retention rate of the fixed schedule is nearly 3.5 times higher than the retention rate of the self-paced MOOC.」 |
| 3 | 第一週退出 | 固定時程約 17%、自訂進度約 50% | 同上 | L521–524 | 「In the fixed-schedule, approximately 17% of the students dropped out in the first week, while in the self-paced MOOC approximately 50% of the students dropped out in the first week.」 |
| 4 | 第一週之後 | 作者說兩版的退出行為幾乎相同 | 同上 | L524–525 | 「After the first week, exit behavior is almost similar between the course versions.」（與表的對照見「不一致」第 2 點） |
| 5 | 各版本內退出分布不均 | 固定時程 χ²(5) = 689.17；自訂進度 χ²(5) = 5393.4；都是 p < .000 | 各版本內各週互比 | L396–400 | 「In both cases, the exits were unevenly distributed」 |
| 6 | 兩版退出分布不同 | χ²(6) = 1411.8，p < .000；差異主要在第 1 週，第 2、3、4、6 週也看得出（殘差絕對值大於 2） | 兩個版本互比 | L407–413 | 「indicating that the majority of differences are related to week one, although differences in weeks 2, 3, 4 and 6 are also identifiable」 |
| 7 | 固定時程版有人中途加入 | 第二週約 421 人新進 | — | L1153–1156 | 「Such hopping in to the fixed-schedule MOOC is visible especially during the second week of the course, where approximately 421 new students entered the course.」 |
| 8 | 做完整週作業卻不再繼續 | 第一週退出者裡，交齊全部作業的有 29 人（固定時程）與 74 人（自訂進度）；作者說約 5% | 兩版都有 | L511–514、L1134–1137 | 「For example, 29 and 74 of the first week dropout submitted all the assignments, respectively for the fixed-schedule and self-paced courses.」「approximately 5% completed all the assignments in the first week. It is unclear what contributes to this phenomenon.」 |

我核算的比例（原文沒有列式）：1,623 ÷ 3,546 = 45.8%；634 ÷ 4,693 = 13.5%；兩者相除 3.39。593 ÷ 3,546 = 16.7%；2,328 ÷ 4,693 = 49.6%。29 ÷ 593 = 4.9%；74 ÷ 2,328 = 3.2%。

### 努力量：累計（Table III，L823 起；PDF 第 6 頁對過）

各列是「在同一週退出的人」互比；數字是中位數，自訂進度／固定時程。粗體是原表標示 Cliff's d 絕對值大於 0.33 的格子。

| 指標 | 退出週 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| 做過的作業數 | 11／10（p.adj 1.000，d −0.032） | 58／47（**−0.411**） | 92／74（**−0.541**） | 119／93（**−0.547**） | 150／116（**−0.719**） | 161／124（**−0.552**） | 177／150（**−0.574**） |
| 提交數 | 10／9（1.000，−0.057） | 57／45（**−0.428**） | 90／68（**−0.559**） | 117／85（**−0.568**） | 148／113（**−0.724**） | 160／121（**−0.555**） | 177／146（**−0.577**） |
| 工作天數 | 2／2（0.000，−0.152） | 9／6（**−0.415**） | 14／9（**−0.383**） | 18／12（**−0.392**） | 25／16（**−0.404**） | 25／19（−0.288） | 27／26（1.000，−0.040） |
| 天數÷作業數 | 0.25／0.20（0.000，−0.120） | 0.17／0.15（1.000） | 0.16／0.15（1.000） | 0.16／0.15（1.000） | 0.17／0.16（1.000） | 0.16／0.16（1.000） | 0.15／0.18（0.000，+0.166） |
| 輸入事件÷作業數 | 152.64／149.00（1.000） | 264.03／254.52（1.000） | 267.09／254.44（1.000） | 275.93／248.95（1.000） | 307.53／302.33（1.000） | 367.06／339.41（1.000） | 426.65／455.24（0.000，+0.084） |

未標 p 值的粗體格 p.adj 都是 0.000。

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 9 | 累計來看，自訂進度版的人做的作業比較多、工作天數也比較多 | L1183 起 | 「students in the self-paced version complete more assignments and work on the course on more days than the students in the fixed-schedule version.」 |
| 10 | 每題花的天數與輸入事件，多數週沒有顯著差異 | 同段 | 「no significant differences exist between the MOOCs for the majority of the weeks.」 |
| 11 | 作者的解釋：評分規則不同 | 同段 | 「These results on the cumulative effort can partially be explained by the grading scheme differences between the courses」 |

### 努力量：只看退出那一週（Table IV，L809 起；PDF 第 6 頁對過）

| 指標 | 退出週 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| 做過的作業數 | 11／10 | 16／14 | 17／15 | 10／9 | 14／11 | 8／7 | 9／9（七週 p.adj 全為 1.000） |
| 提交數 | 10／9（1.000） | 15／12（0.000，d −0.102） | 16／14（0.000，−0.129） | 10／8（1.000） | 12／10（1.000） | 7／5（1.000） | 9／9（1.000） |
| 工作天數 | 2／2（−0.152） | 4／3（−0.199） | 4／3（−0.294） | 3／2（−0.250） | 4／3（**−0.379**） | 3／3（−0.190） | 5／5（−0.114）（七週 p.adj 全為 0.000） |
| 天數÷作業數 | 0.25／0.20 | 0.30／0.25 | 0.27／0.20 | 0.33／0.26 | 0.46／0.31 | 0.50／0.45（1.000） | 0.62／0.56（其餘 0.000） |
| 輸入事件÷作業數 | 152.64／149.00 | 316.74／304.99 | 258.54／221.34 | 288.57／262.20（前四週 1.000） | 524.83／461.75（0.000，−0.196） | 831.29／655.08（0.000，−0.230） | 2063.79／1782.33（0.000，−0.150） |

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 12 | 退出那一週做的作業數沒有差別；提交數只在第 2、3 週顯著，差異很小 | L1200–1205 | 「there is no difference in students' effort in terms of assignments worked on. Significant differences between the courses exist in the number of assignments submitted on weeks 2 and 3, but the differences are very small.」 |
| 13 | 作者據此推論差異來自時程而不是評分 | L1204–1207 | 「This speaks against the role of the grading scheme explaining the differences in retention and hints that those differences are related more closely to scheduling.」（作者用的是 hints） |
| 14 | 自訂進度版的人把作業分散在較多天 | L1207–1211 | 「Students in the self-paced version space out their work on more days than students on the fixed-schedule version.」 |

## 作者自己列的限制（V.E，L1278–1302）

1. 主題是程式設計，可能吸引特定類型的學生，能否推到別的領域要再研究。
2. **兩個版本的評分規則不同**：「the courses that we studied have different grading schemes, which are bound to influence students' behavior.」
3. **沒有成績，也沒有看有沒有學會**：「we did not have information of students actual grades or course points, and did not look into whether students learned in the courses or not.」
4. **學生自己選版本**：「students were able to choose between self-paced and fixed-schedule MOOCs, which means there may be differences in the students who choose the more strict scheduling option. Further research is needed to account for this, for instance by randomly assigning students to each version and seeing if the differences hold.」

討論裡另外承認的（不在限制節）：

5. 退出可能受時程以外的因素影響，評分是其中之一；固定時程版可以中途加入，自訂進度版要做完 90% 才能往下（L1146–1156）。
6. 固定時程版的評分會讓只做少量作業的人拿到差的成績，「might further incentive the students in the fixed-schedule course to drop out」；結論裡說得更直接：固定時程版的評分「effectively encourages students who complete only a handful of assignments to drop out」。
7. 自我調節、動機、志向等因素沒有量（「We plan to address these factors as well in the future」）。
8. 「做完整週卻不繼續」的原因不明，作者列了幾個猜測，都沒有資料。

原文沒有討論的：自訂進度版各單元比固定時程版晚釋出、而且可以做到 2020 年 1 月，兩群人修課的日曆時間不同；兩個版本「活躍於第七週」的門檻不一樣（見下一節第 1 點）；沒有任何人口或先備知識的比較。

## 與摘要說法不一致的地方

1. **「留存率 45% 對 13%」在兩個版本裡量的不是同一件事。** 這不是摘要與內文的數字不符，而是指標的定義問題：留存＝「動過第七單元的作業」。自訂進度版要先完成前六個單元各 90% 的作業才能進第七單元；固定時程版沒有這個門檻，可以跳著做、也可以中途加入（L304–316、L1146–1156）。Table III 也看得出來：在第七週「退出」（也就是撐到最後）的人，累計作業中位數自訂進度版 177、固定時程版 150。所以 13% 是「幾乎全做完的人」，45% 是「最後還有動的人」。摘要把兩個數字並列成「better overall retention rate」，沒有交代這個差別；作者在討論裡只把它當成評分規則不同來談。
2. **討論 L524–525「After the first week, exit behavior is almost similar」與結論 RQ1「the difference in dropout … persists almost all the way to the end of the course」（L1315 一帶）互相牴觸。** 依 Table II 我算的「退出人數÷當週活躍人數」：第 2 週 20%（固定）對 37%（自訂）、第 3 週 14% 對 25%、第 4 週 9% 對 16%、第 5 週 6% 對 16%、第 6 週 9% 對 21%。以當週活躍者為分母，自訂進度版每週都高出將近一倍；以全體為分母（Fig. 1 中間那格）兩條線才接近。「幾乎相同」只對後一種算法成立。這些比例是我用表上數字算的，原文只畫在 Fig. 1，沒有列數值。
3. **摘要與結論的因果用語超出設計。** 摘要：「Our results support scheduling student activities in open online courses」（L74 一帶）；結論：「meaning that the course scheduling has an effect on dropout rates」（L1340–1342）。同一篇的限制節第 4 點承認學生自選、需要隨機分派才能確定；第 2 點承認評分規則不同。
4. **摘要的「沉沒成本」解釋沒有資料。** 「We hypothesize that students initial investment of time and effort contributes to their persistence … do not want to let their initial investment go to waste」（L67–69）是假說；摘要自己用了 hypothesize。實務建議第二點卻寫成「we observe that the early start (or early investment) in the course is a key factor that determines whether students continue」（L1235 一帶），從假說變成觀察。
5. 結論 RQ1 的句子「when measured through the effort and persistence in the first week, students in a fixed-schedule MOOC are 3.5 times more likely to persist」（L1311–1314）把 3.5 倍說成第一週的指標；結果段的 3.5 倍是最後一週留存率的比值（L404–406）。
6. 摘要說「over 8.000 students」；分析樣本 3,546＋4,693＝8,239，相符。
7. Table II 表頭把自訂進度版印成 n=4696（L460），內文與退出人數加總都是 4,693。
8. Table I 的作業數合計 176（表說明寫適用兩個版本），Table III 自訂進度版第七週退出者的累計作業中位數卻是 177，多了一題；原文沒有說明。
9. 卡方檢定的自由度：七個週次的同質性檢定寫 χ²(5)，兩版×七週的獨立性檢定寫 χ²(6)（L398–408），照抄；p 值一律寫成「p < .000」。

## 與清單「要撐的結論」不合的地方

清單寫：「固定時程版的持續率較高，但學生自選版本」。

- **方向與但書都對，但但書不夠。** 除了學生自選之外，原文至少還有三個讓這個比較站不穩的地方，要一起寫：
  1. 兩個版本的過關規則不同（自訂進度版要做完 90% 才能進下一單元；固定時程版不用，還能中途加入），「持續到最後」的門檻本身就不一樣。
  2. 「持續」是用「有沒有動過那一單元的作業」量的，不是完成或通過；作者手上沒有成績。
  3. 兩個版本的修課時間不同（自訂進度版的教材較晚釋出，開放到隔年 1 月）。
- **數字要帶定義**：45% 對 13% 只能寫成「最後一個單元還有動手做作業的人的比例」。不能寫成完成率，也不能寫成「有截止日讓完成率變三倍」。
- **清單末尾那張表已經把「自訂進度對固定時程的因果效果」列為不能寫的結論，理由是「兩個來源都不是隨機分派」**；這一篇讀完之後這個判斷成立，而且理由可以再加上上面第 1 點。
- **原文裡比較站得住、可以單獨引的觀察**：(a) 兩個版本的流失都集中在第一個單元（17% 與 50%）；(b) 兩個版本都有人交齊一整週的作業之後就不再回來（29 人與 74 人），作者說原因不明；(c) 自訂進度版的人把同樣的作業分散在較多天做。這三點不依賴兩版之間的因果比較。
- 清單「之前讀到哪」寫「結果節沒讀」：舊檔的結果節文字是完整的，缺的是四張表與兩張圖；這次用新檔補齊。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | 舊檔 `deadlines-moocs-ieee2020.md` L1–158（全檔） | 第 I–VI 節正文（無摘要、無表、無圖、無參考文獻） |
| 2 | 新 PDF 第 1–10 頁（全檔，用 Read 直接讀 PDF 版面） | 典藏封面；標題、作者、摘要、關鍵詞；I 前言；II 背景與研究問題；III 方法與 Table I；IV 結果與 Table II；Fig. 1、Table III、Table IV；Fig. 2；V 討論（A–E）；VI 結論；參考文獻 [1]–[35]（書目，掃過） |
| 對表 | PDF 第 4 頁（Table I）、第 5 頁（Table II）、第 6 頁（Fig. 1、Table III、Table IV）、第 7 頁（Fig. 2） | 逐格讀過；上面各表照 PDF 版面抄 |

新文字檔（L1–1467）只用來標行號，沒有另外逐行重讀一遍；行號是讀完 PDF 後用片語在文字檔裡定位的，標「一帶」的是鄰近位置而非精確行。全文沒有附錄與註腳。
