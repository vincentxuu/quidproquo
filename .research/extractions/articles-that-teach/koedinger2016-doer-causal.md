# 抽取紀錄：Koedinger、McLaughlin、Jia、Bier 2016，LAK '16

- **合法公開來源**：https://dl.acm.org/doi/10.1145/2883851.2883957（刊出版，2026-10-14 核對）。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。ACM 版另存 `.research/raw/learning-content/q3-activity/koedinger2016-acm-dl.pdf`；與手上經 Wayback 取得的 `koedinger2016.pdf` 位元組不同，`pdftotext` 轉出的 6,708 個詞逐詞相同。

**書目**：Kenneth R. Koedinger、Elizabeth A. McLaughlin、Julianna Zhuxin Jia、Norman L. Bier（四人皆 Carnegie Mellon University；姓名對 PDF 首頁核過）。〈Is the Doer Effect a Causal Relationship? How Can WE Tell and Why It's Important〉。*LAK '16: Proceedings of the Sixth International Conference on Learning Analytics & Knowledge*，2016 年 4 月 25–29 日，Edinburgh，頁 388–397。DOI 10.1145/2883851.2883957。

**原文檔**：`.research/raw/learning-content/q3-activity/koedinger2016.pdf`（10 頁）與 `koedinger2016.txt`（1,367 行、43,693 字元；非 `-layout` 轉檔，段落順序因雙欄而左右欄交錯，但每段內文字連續）。下面行號一律是 `koedinger2016.txt` 的行號。
**讀取日期**：2026-10-14
**版本**：刊出版（頁碼 388–397、ACM 版權頁俱在）。
**供哪幾篇使用**：order 8（8-d 的因果論證）。

## 研究設計

- **類型**：觀察資料的迴歸分析，沒有隨機分派、沒有操弄。作者自己在導言就寫明「Because such data comes from naturally occurring variations in use rather than from random assignment, we cannot be sure that those associations are causal.」（L72–74）。全文是兩個分析：(A) 單一 MOOC 內的跨單元分析；(B) 另外四門課的整門課迴歸。
- **分析 A 的受試者**：Georgia Tech 透過 Coursera 開的〈Introduction to Psychology as a Science〉MOOC，與 Koedinger 等 2015 是同一批資料（L312–316）。只取修完課、考了全部或大部分 11 次小考的人，N = 1,154；其中 1,051 人至少用過一點 OLI 教材，103 人沒用（L317–323、L333–335）。迴歸實際用的是「registered OLI students」N = 939（L693–694）；作者說把全部學生放進來顯著結果不變（L695–696）。年級、國籍等背景在本文沒有寫，指向 2015 那篇。
- **分析 A 的教材**：12 週課，每個主題有教授的講課影片（Coursera），並對應 CMU OLI〈Introduction to Psychology〉的模組當線上課本與練習環境；課綱把每週講課對到 OLI 模組（L359–372）。互動活動內嵌在課文中，形式有選擇題、互動模擬、拖放、配對、開放式 submit and compare，一律有即時回饋或提示，「In all cases, students have immediate access to correct responses.」（L373–385）。
- **分析 A 量了什麼**：前 11 週每週講課後有一次小考，每次 10 題，全體平均 8.2／10（L266–272）；結果變項是該生該單元的小考分數（Z 分數）。預測變項是該生在該單元**內**與單元**外**的三種次數：開始的活動數（doing）、存取的頁數（reading）、開始的影片數（watching），全部轉 Z 分數（L556–560、L538–545）。
  - 「單元內」的定義：屬於該單元內容**而且**在該生考該單元小考**之前**用的資源；其餘（別的單元的資源、以及該單元小考之後才用的該單元資源）全算「單元外」（L526–538）。
  - 閱讀分數做過調整：只算「超過為了做到那些活動所必須存取的最少頁數」的頁面（L539–542）。
  - 模型：`lmer`，學生與小考各放一個隨機截距（L681–692）。
- **分析 A 的延伸（2.4 節）**：把單元外次數拆成「之前」與「之後」，只用第 2 到第 10 單元（L698–736）。
- **分析 B 的受試者**：University of Maryland University College（UMUC）一項遠距教學研究的 OLI 紀錄。內文寫資料來自「six courses in four disciplines (2 biology courses, 2 statistics courses, 1 computing course, 1 psychology course)」（L935–937），表 4 合成四列：Information Systems 7,739 人、Biology 4,564、Statistics 359、Psychology 123（合計 12,785）。納入條件：註冊 OLI 的班、修完課並拿到期末成績者；退選、因缺席不及格、未完成者排除（L939–943）。心理學這一門與 MOOC 用同一套 OLI 內容，但學生是大學修課生、沒有 Coursera 影片（L925–951）。
- **分析 B 量了什麼**：每門課跑兩個一般線性迴歸，結果變項分別是小考總分與期末成績（F = 1 到 A = 5），預測變項是活動數與調整後閱讀數，全部 Z 分數；加上 Psy MOOC 共 10 個模型（L1056–1072）。作者說模型比 2015 那篇簡單，因為多數資料集沒有影片觀看與**前測**（L1059–1061）。
- **比較對象**：沒有對照組。比的是同一迴歸裡「做」與「讀」「看」的標準化係數大小，以及「單元內」對「單元外／之前／之後」。

## 結果（逐項）

表 1、2、3、4、5 都對過 PDF 版面（第 5、6、8、9 頁），數字與文字檔一致。

### 2.2 節：學生各單元的活動量有沒有變化（表 1，L405–510）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 單元內活動量與單元外活動量的相關 | R = .68，11,561 個學生×單元（1,051 × 11） | L336–339 | 「No surprise, these measures are highly correlated, R = .68.」 |
| 2 | 單元內五分位與單元外五分位不同 | 6,266 個，54% | L387–389 | 「In 6266 instances or 54% of the student-unit combinations, the within-unit activity quintile was different from the outside-unit activity.」 |
| 3 | 差兩級 | 1,464 個，13% | L389–391 | 「In 1464 instances or 13% of the cases, the quintile was different by two levels」 |
| 4 | 單元內五分位切不齊 | 第 9–11 單元超過 40% 的學生做了 0 個活動，第 1、2 分位無法區分（表 1 的單元內合計：4,231／543／3,212／2,509／1,066） | L349–357 | 「in units 9-11 where there is a median of 15, 11, and 2 activities done, more than 40% of the students did 0 activities」 |

我自己用表 1 的格子重算：對角線合計 5,295，11,561 − 5,295 = 6,266，與第 2 項相符。差「恰好兩級」的格子合計是 1,317；要把差三、四級的也算進去才是 1,464。所以第 3 項的「different by two levels」實際是「兩級以上」。

### 2.3 節：單元內 vs 單元外（表 2，L561–667；N = 939）

結果變項：單元小考 Z 分數。係數是 Z 分數對 Z 分數。

| # | 預測變項 | 估計值 | SE | df | t | p |
|---|---|---|---|---|---|---|
| 5 | 做・單元內 | 0.195 | 0.011 | 9969 | 17.475 | < 0.000001 |
| 6 | 做・單元外 | 0.196 | 0.022 | 1389 | 8.736 | < 0.000001 |
| 7 | 讀・單元內 | 0.015 | 0.009 | 10226 | 1.676 | 0.0937（邊緣） |
| 8 | 讀・單元外 | −0.006 | 0.021 | 1184 | −0.283 | 0.7770 |
| 9 | 看・單元內 | 0.036 | 0.009 | 10244 | 4.174 | < 0.00003 |
| 10 | 看・單元外 | −0.002 | 0.020 | 1215 | −0.103 | 0.9182 |

- 作者的判讀（L719–728）：「We find that within-unit doing remains a large and higher significant predictor even after controlling for non-relevant choices. This result is consistent with a causal interpretation.」
- 作者算的倍數（L724–728）：「here we find a 13 times bigger effect of doing than reading and a greater than 5 times effect of doing than video watching」。對表：0.195／0.015 = 13.0；0.195／0.036 = 5.4。分母 0.015 那個係數本身不顯著。
- **單元外的「做」與單元內一樣大**（0.196 對 0.195）。作者對這一點的說法（L741–743、L671–679）：「This result may indicate some third variable yielding both higher general doing and better outcomes.」並提出另一種可能是單元之間有先備關係。

### 2.4 節：之前／之內／之後（表 3，L744–885；第 2–10 單元，registered OLI 學生）

| # | 預測變項 | 估計值 | SE | df | t | p |
|---|---|---|---|---|---|---|
| 11 | 做・之前 | 0.143 | 0.016 | 1861 | 8.840 | < 0.00 |
| 12 | 做・之內 | 0.181 | 0.011 | 8892 | 16.973 | < 0.00 |
| 13 | 做・之後 | 0.078 | 0.014 | 3063 | 5.402 | 0.00 |
| 14 | 讀・之前 | 0.008 | 0.015 | 1635 | 0.579 | 0.56278 |
| 15 | 讀・之內 | 0.010 | 0.008 | 9233 | 1.224 | 0.22116 |
| 16 | 讀・之後 | −0.013 | 0.012 | 2603 | −1.028 | 0.30410 |
| 17 | 看・之前 | 0.054 | 0.014 | 2432 | 3.853 | 0.00012 |
| 18 | 看・之內 | 0.025 | 0.008 | 9463 | 3.123 | 0.00180 |
| 19 | 看・之後 | 0.033 | 0.013 | 2876 | 2.474 | 0.01343 |

- 作者的判讀（L737–740、L899–904）：「We find that the doer effect is now strongest for doing within the target unit as compared to doing before or after.」「The effect of doing outside the target unit is stronger when more doing occurs before the unit (0.143) than after the unit (.078). This difference is consistent with prerequisite relationships between units.」
- **「之後」的做仍然顯著（第 13 項）**，作者自己承認這指向學生特質（L913–920）：「Interestingly, there is still a significant effect for doing after the target unit. This effect suggests that, in addition, to possible causal effects of within and before unit practice on improved outcomes, there may also be some general student trait (e.g., a conscientious doer/learner) that yields more practice and more learning」。
- 三個「做」的係數之間有沒有顯著差異，原文**沒有做檢定**，只比大小。
- 讀的三個係數全部不顯著。看影片是「之前」最大（L889–892）。
- 作者算的倍數（L893–897）：「the effect of doing being 18 times more than the (non-significant) effect of reading and 7 times more than the effect of video watching」。對表：0.181／0.010 = 18.1；0.181／0.025 = 7.2。

### 3 節：推到其他課（表 4 L968–1030；表 5 L1085–1202）

表 4（各課使用量）：

| 課 | 用線上教材的學生 | 可用活動數 | 做了的活動數 平均（SD） | 可讀頁數 | 讀了的頁數 平均（SD） |
|---|---|---|---|---|---|
| Information Systems | 7,739 | 153 | 52（43.7） | 151 | 94.4（88.8） |
| Biology | 4,564 | 544 | 200（133.8） | 881 | 571（416.4） |
| Statistics | 359 | 428 | 312（116.0） | 441 | 688（420.2） |
| Psychology | 123 | 687 | 621（114.5） | 545 | 510（236.9） |

Statistics 的「讀了的頁數」平均 688 大於可讀頁數 441：原文沒有解釋，可能是重複存取都算，不確定。

表 5（標準化係數與倍數）：

| # | 課 | 小考：Adj R² | 做 | 讀 | 倍數 | 期末成績：Adj R² | 做 | 讀 | 倍數 |
|---|---|---|---|---|---|---|---|---|---|
| 20 | InfoSystems | 0.49 | 0.642 | 0.124 | 5.2 | 0.08 | 0.227 | 0.105 | 2.2 |
| 21 | Biology | 0.39 | 0.571 | 0.114 | 5.0 | 0.16 | 0.340 | 0.109 | 3.1 |
| 22 | Statistics | 0.24 | 0.519 | −0.127 | ∞ | 0.11 | 0.327 | 0.020 | 16.4 |
| 23 | Psychology | 0.64 | 0.781 | 0.092 | 8.5 | 0.45 | 0.654 | 0.085 | 7.7 |
| 24 | Psy MOOC | 0.25 | 0.467 | 0.069 | 6.8 | 0.08 | 0.259 | 0.054 | 4.8 |

- 表 5 **沒有列標準誤、p 值或信賴區間**。內文只說做的係數「always significant」，讀的係數「not always significant」，沒說哪幾個不顯著（L1033–1036）。
- 「六倍」在這篇的來歷（L1036–1041）：「The ratio of the size of the doing to reading effect goes from 2.2 to infinity (because in one case, quiz score in Statistics, the reading effect is not positive) with median of 6 -- the same ratio we found previously! In other words, the effect of doing is generally about 6 times greater than the effect of reading across four different courses and involving over 12,500 students.」十個倍數排序後是 2.2、3.1、4.8、5.0、5.2、6.8、7.7、8.5、16.4、∞，中位數是 5.2 與 6.8 的平均 6.0。所以「六倍」是**十個迴歸的係數比值的中位數**，範圍 2.2 到無限大，不是一個合併估計值，也沒有區間。
- 以期末成績為結果時模型解釋力很低：InfoSystems 與 Psy MOOC 的 Adj R² 都是 0.08。
- 做與讀本身相關：Biology 課 R² = .342（L1046–1047）。
- 小考與線上活動表面相似，作者自己歸為近遷移（L954–957）：「Given the similarity in surface characteristics between the online activities and the quizzes, these provide a kind of near transfer assessment of learning.」期末成績只有五級、含教師主觀判斷（L957–963）。

## 作者自己列的限制

這篇沒有獨立的「限制」節，以下散在導言與討論：

1. 資料是相關性的，不能確定因果（L72–74）；「Analysis of associations of method and outcome threatens internal validity」（L82–83）。
2. 全域學生特質以外的第三變項仍有可能，需要實驗（L1271–1275）：「Of course, other third variable explanations are still possible (e.g., interest in a particular unit content produces more doing and more learning) and experimentation is warranted, especially as so-called A/B testing is becoming easier to do online.」
3. 「之後」的做仍顯著，可能有一般性學生特質（L913–920）。
4. 四個內容領域沒有藝術類，沒試過法律、設計這種定義較鬆的領域（L1238–1241）。
5. 期末成績粗（五級）、主觀（L957–960）；UMUC 資料多數沒有前測與影片觀看紀錄（L1059–1061）。
6. 「讀」量的是頁面存取，作者自己寫「read (or at least access) pages」（L952–953）。

作者沒有提到的（我讀到、原文沒討論）：小考平均 8.2／10 可能有天花板；單元內五分位切不齊；表 5 沒有不確定性估計；樣本限於修完課的人。

**利益關係與經費**：論文沒有利益衝突聲明。致謝寫 NSF grant ACI-1443068（LearnSphere.org）與 Google 的經費（L1243–1246）。被研究的教材 OLI 是作者所屬機構 CMU 的產品，Bier 在 OLI 任職這件事**本文沒寫**。

## 與摘要說法不一致的地方

1. 摘要說「showing that doing within a course unit predicts learning of that unit content more than doing in units before or after」（L52–54）。這句只對得上表 3（0.181 對 0.143 與 0.078），而且三個係數之間沒有檢定。表 2 把之前與之後合成「單元外」時，單元外（0.196）與單元內（0.195）一樣大。導言自己設的判準是「if some general trait is an explanation then the amount of doing outside a unit should be equally predictive (or more…)」（L228–233）；照這個判準，表 2 的結果正好是「equally predictive」，摘要沒有提這一點。
2. 摘要說「four different courses involving over 12,500 students」（L55–56）；導言說「five data sets … five courses from four different content areas」（L96–97）；方法說 UMUC 資料來自「six courses in four disciplines」（L935–937）；表 5 是五列。課的數目全文四種說法（四、五、六門），取決於怎麼合併。
3. 摘要說做的學習效果「about six times greater than that of reading」。內文是十個比值的中位數 6，範圍 2.2 到 ∞；其中讀的係數有的不顯著、有一個是負的。摘要沒有交代範圍。
4. 摘要用「learning effect of doing」這種因果用語，內文結論段用的是「association」（L1264–1265）。

## 與清單「要撐的結論」不合的地方

清單寫的是 8-d「doer effect 在多門課裡一致出現，但是相關性資料，沒有隨機實驗；主要作者與產品有利益關係」，本篇負責「因果論證」。

- 「多門課裡一致出現」：撐得住，但要加條件。做的係數在五個資料集、兩種結果變項都為正且據稱顯著；倍數從 2.2 到無限大，並不一致，一致的只有方向。
- 「相關性資料，沒有隨機實驗」：撐得住，作者自己這樣寫。
- 「因果論證」：這篇論證的範圍比掃描時轉述的窄。作者的結論是這個效果「cannot be explained **solely** by some global student trait」（L1266–1267），同時承認 (a)「之後」的做仍顯著、可能有學生特質，(b) 其他第三變項（例如對某單元特別有興趣）仍可能。如果文章要寫「2016 年這篇排除了動機的解釋」，原文撐不住；能寫的是「排除了『只有』全域特質這一種解釋」。
- 「主要作者與產品有利益關係」：**這篇原文沒有任何利益聲明**，只有經費致謝。OLI 是 CMU 的產品這件事可由機構歸屬推得，但不是原文說的。這半句若要寫，得另找來源，或改寫成「作者與教材出自同一所大學」。

## 讀取紀錄

- `koedinger2016.txt` 一次讀完 L1–1367（全檔）：L1–131 標題、摘要、導言；L133–303 相關研究、研究問題；L305–385 方法 2.1；L387–545 結果 2.2、表 1；L547–743 結果 2.3、表 2、2.4 的模型；L744–920 表 3 與判讀；L922–1081 第 3 節方法、表 4、結果；L1085–1215 表 5、討論前半；L1217–1296 討論、致謝、參考文獻 1–7；L1299–1367 參考文獻 8–21（掃過）。
- 對過 PDF 版面：表 1、表 2（第 5 頁）、表 3（第 6 頁）、表 4、表 5（第 8、9 頁）；圖 1、2、3 的圖說也在 PDF 上看過。PDF 第 4–9 頁以影像讀過，第 1–3、10 頁只讀文字檔。
- 文字檔 L671–675 有一句不通（「a third variable account for the causing better learning, is that there are prerequisite. activity effect.」），對過 PDF 第 6 頁，原文就是這樣排的，不是轉檔錯誤。
