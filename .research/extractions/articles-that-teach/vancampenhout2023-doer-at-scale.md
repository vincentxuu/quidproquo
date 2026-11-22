# 抽取紀錄：Van Campenhout、Jerome、Dittel、Johnson 2023，LAK 2023

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3576050.3576103（刊出版，文章頁標示 OPEN ACCESS，2026-10-14 核對）。ACM 版另存 `.research/raw/learning-content/q3-activity/vancampenhout2023-acm-dl.pdf`；與手上經 Wayback 取得的 `vancampenhout2023.pdf` 位元組不同，`pdftotext` 轉出的 8,450 個詞逐詞相同。

**書目**：Rachel Van Campenhout、Bill Jerome、Jeffrey S. Dittel、Benny G. Johnson（四人掛名機構皆 VitalSource Technologies；第一作者的信箱網域是 acrobatiq.com；姓名對 PDF 首頁與 ACM Reference Format 核過）。〈The Doer Effect at Scale: Investigating Correlation and Causation Across Seven Courses〉。*LAK23: 13th International Learning Analytics and Knowledge Conference*，2023 年 3 月 13–17 日，Arlington, TX，頁 357–365（9 頁）。DOI 10.1145/3576050.3576103。

**原文檔**：`.research/raw/learning-content/q3-activity/vancampenhout2023.pdf`（9 頁）與 `vancampenhout2023.txt`（1,273 行、55,300 字元；非 `-layout` 轉檔，表格被拆成一行一格，表 3 與表 5、表 6 的欄位順序在文字檔裡是亂的）。行號一律是 `vancampenhout2023.txt` 的行號。
**讀取日期**：2026-10-14
**版本**：刊出版（ACM 版權頁、頁碼 357–365）。
**供哪幾篇使用**：order 8（8-d 的複製、作者自述的限制、利益關係）。

## 研究設計

- **類型**：事後觀察分析，沒有隨機分派、沒有操弄。「No controls were placed on these students; this is a post hoc analysis.」（L141–142）。
- **受試者**：同一所「major online university」（沒寫校名）七門課、18,546 名學生（L135–138）。滾動入學，選課後最多六個月修完，資料跨一年以上（L142–144、L326–327）。只納入有用過 courseware 的學生（L332–333）。沒有任何人口背景資料。
- **各課人數與事件數（表 1，對過 PDF 第 3 頁）**：

| 課 | 學生 | 閱讀事件 | 做題事件 |
|---|---|---|---|
| Information Systems Management（ISM） | 879 | 203,615 | 713,403 |
| IT Fundamentals（IT Fund） | 4,871 | 1,493,270 | 3,886,710 |
| Macroeconomics（Macro） | 592 | 134,874 | 537,495 |
| Microeconomics（Micro） | 533 | 88,544 | 386,668 |
| Project Management（PM） | 599 | 163,993 | 428,769 |
| Research Foundations（Research） | 2,675 | 575,897 | 1,027,268 |
| Statistics（Stats） | 8,397 | 3,002,295 | 2,589,668 |
| 合計 | 18,546 | 5,662,488 | 9,569,981 |

  兩欄事件合計 15,232,469，對得上摘要的 15.2 million。Stats 一門佔全部學生的 45%。
- **教材**：courseware 是每門課的主要學習資源（L144–146）。結構：對應學習目標的課文頁 → 模組（結尾有 adaptive activity 與計分小考）→ 單元（結尾有 unit test）（L267–271）。形成性練習內嵌在課文頁，答錯可一直重試到對，有即時的針對性回饋（L271–275）。「Most questions are low level Bloom's questions that target recognition and recall cognitive process dimensions」（L278–280）。
- **成績制度**：courseware 裡的小考與 unit test 會計分但**不算入課程成績**；要過這門課只看期末考，期末考是成績的唯一依據（L148–152）。期末考可重考，只取第一次，也只取第一次應考前的閱讀與做題（L334–336）。
- **變項定義**（L281–295）：
  - 讀＝「all visits to a lesson page where the student did not choose to do any practice」。也就是有做題的那次頁面造訪**不算閱讀**。作者承認「page visits are a proxy for reading」。
  - 做＝學生嘗試過的不重複形成性練習題數，含 adaptive activity；模組小考與 unit test 不算。
  - 沒有影片變項。
- **五種分析**（每門課各做一次）：
  1. 相關模型，結果＝期末考：`lm(z_final_exam ~ z_total_reading + z_total_doing)`
  2. 同上加前測（前測當先備知識的代理）
  3. 相關模型，結果＝各 unit test 分數加總
  4. 同上加前測
  5. 「因果模型」，結果＝各 unit test：`lmer(z_unit_test ~ z_within_reading + z_outside_reading + z_within_doing + z_outside_doing + (1|student) + (1|unit_test))`，用概似比檢定判顯著（L732–747）。只納入考了幾乎全部 unit test、且讀與做都不為零的學生（L713–732）。**每門課進入因果模型的人數沒有報告。**
- **「因果模型」這個名稱是作者自己取的**，並當場加了但書（L180–182）：「In this work we refer to this model as the "causal model" in contrast with the correlational model, although it does not demonstrate causality conclusively.」
- 期末考沒有跑因果模型，因為期末考題是能力本位的，缺少考題對 courseware 學習目標的對應表（L183–189）。
- **doer effect ratio**＝做的標準化係數除以讀的標準化係數。讀的係數不顯著或為負時記成 ∞（L411–415）。

## 結果（逐項）

表 1–9 全部對過 PDF 版面（第 3–7 頁）。所有係數都是 Z 分數對 Z 分數；表裡只給估計值與顯著星號，**沒有標準誤、信賴區間，也沒有各模型的 R²**。顯著碼：*** .001、** .01、* .05、「.」.1。

### 表 6：四個相關模型 × 七門課（原文檔 L512–665；PDF 第 5 頁）

期末考（不含前測）：

| # | 課 | 讀 | 做 | 倍數 |
|---|---|---|---|---|
| 1 | ISM | −0.1410*** | 0.1631*** | ∞ |
| 2 | IT Fund | −0.1514*** | 0.3321*** | ∞ |
| 3 | Macro | −0.2402*** | 0.3743*** | ∞ |
| 4 | Micro | −0.0716** | 0.3549*** | ∞ |
| 5 | PM | −0.1299*** | 0.3065*** | ∞ |
| 6 | Research | −0.0274（不顯著） | 0.3266*** | ∞ |
| 7 | Stats | −0.1819*** | 0.3783*** | ∞ |

期末考＋前測：

| # | 課 | 前測 | 讀 | 做 | 倍數 |
|---|---|---|---|---|---|
| 8 | ISM | 0.4567*** | −0.0351（不顯著） | 0.1273*** | ∞ |
| 9 | IT Fund | 0.4039*** | −0.1101*** | 0.3403*** | ∞ |
| 10 | Macro | 0.5361*** | −0.1292*** | 0.1828*** | ∞ |
| 11 | Micro | 0.5410*** | −0.0460* | 0.1621*** | ∞ |
| 12 | PM | 0.4111*** | −0.0854*** | 0.2171*** | ∞ |
| 13 | Research | 0.4195*** | −0.0273（不顯著） | 0.2359*** | ∞ |
| 14 | Stats | 0.4901*** | −0.0579*** | 0.1875*** | ∞ |

Unit test（不含前測）：

| # | 課 | 讀 | 做 | 倍數 |
|---|---|---|---|---|
| 15 | ISM | 0.0897*** | 0.5948*** | 6.6 |
| 16 | IT Fund | 0.0853*** | 0.7661*** | 9.0 |
| 17 | Macro | 0.0548** | 0.6449*** | 11.8 |
| 18 | Micro | 0.0379「.」（p < .1，未達 .05） | 0.6173*** | 16.3 |
| 19 | PM | 0.0811*** | 0.6489*** | 8.0 |
| 20 | Research | 0.1169*** | 0.6691*** | 5.7 |
| 21 | Stats | 0.0461*** | 0.6421*** | 13.9 |

Unit test＋前測：

| # | 課 | 前測 | 讀 | 做 | 倍數 |
|---|---|---|---|---|---|
| 22 | ISM | 0.1182*** | 0.1171*** | 0.5855*** | 5.0 |
| 23 | IT Fund | 0.0882*** | 0.0943*** | 0.7679*** | 8.1 |
| 24 | Macro | 0.0842*** | 0.0722*** | 0.6148*** | 8.5 |
| 25 | Micro | 0.1849*** | 0.0466* | 0.5514*** | 11.8 |
| 26 | PM | 0.0961*** | 0.0915*** | 0.6280*** | 6.9 |
| 27 | Research | 0.1774*** | 0.1169*** | 0.6307*** | 5.4 |
| 28 | Stats | 0.1690*** | 0.0889*** | 0.5763*** | 6.5 |

作者對表 6 的敘述：

- **期末考模型裡「讀」的係數全部為負**（L469–473）：「the standardized reading coefficient for both final exam regression models was always negative. Of the fourteen final exam regression models, reading was not significant in three cases and negatively significant in the remaining eleven. This means that the doer effect ratio in every final exam model is ∞.」對表：不顯著的三個是第 6、8、13 項，相符。
- Unit test 倍數（L476–483）：不含前測 5.7（Research）到 16.3（Micro），中位數 9.0、平均 10.2；含前測 5.0（ISM）到 11.8（Micro），中位數 6.9、平均 7.5。我重算過，相符。
- **期末考上前測比做題重要**（L494–500）：「For the final exam model in every course, the pretest estimate is larger than the doing estimate by a mean ratio of 2.5. The exact opposite occurs in the unit test regression models: every doing estimate is larger than the pretest estimate by a mean ratio of 6.9.」我用表 6 重算期末考的七個前測／做比值，平均 2.48，相符。
- 做的係數在期末考約是 unit test 的一半（L1007–1009）：「the doing coefficient is roughly half the size for the final exam than for the unit tests」。對表：0.16–0.38 對 0.59–0.77，實際是 27% 到 59%。
- 作者對前測型態的解釋是內容對齊（L501–506、L667–674）：courseware 與前測、期末考是不同團隊做的，除了共用學習目標對應表之外沒有協調；前測的用途是評估能否應考期末考，所以前測可能與期末考較對齊，courseware 與 unit test 較對齊。
- 作者的結論句（L685–688）：「the doer effect is still observed (even if diminished) when controlling for prior knowledge on both the proximal and distal assessments」。

Stats 一門的單獨表（表 2–5，L308–463）與表 6 的 Stats 列相同；只有表 3 的做寫成 0.187、表 6 寫 0.1875。

### 表 7、表 8：「因果模型」（結果＝unit test；L720–793、L842–907；PDF 第 6、7 頁）

| # | 課 | 單元內・讀 | 單元外・讀 | 單元內・做 | 單元外・做 | 倍數（單元內做／單元內讀） |
|---|---|---|---|---|---|---|
| 29 | ISM | 0.0723*** | 0.1157*** | 0.1202*** | 0.0413「.」（不顯著） | 1.7 |
| 30 | IT Fund | 0.0550*** | 0.0455*** | 0.1014*** | 0.0331*** | 1.8 |
| 31 | Macro | 0.0460* | −0.0515* | 0.1392*** | 0.0791** | 3.0 |
| 32 | Micro | 0.0515* | −0.0821** | 0.3178*** | −0.0027（不顯著） | 6.2 |
| 33 | PM | 0.0708*** | 0.0023（不顯著） | 0.1245*** | 0.0774** | 1.8 |
| 34 | Research | 0.0520*** | 0.0604*** | 0.0678*** | 0.0499*** | 1.3 |
| 35 | Stats | 0.0292***（p = 1.26e-12） | 0.0023（p = .700） | 0.1007*** | 0.1027*** | 3.5 |

- 作者的判讀（L748–761、L773–797）：「The outside-doing significance indicates there is some additional "go-getter" variable accounting for overall level of student effort」；「The relationship between within-unit doing and unit test scores remained significant even when controlling for the amount of doing outside the unit, supporting that within-unit doing is causal in nature.」；「the within-unit doing coefficient is larger than the outside-unit doing coefficient for all courses except Stats, where they are essentially equal.」
- **人數最多的 Stats（8,397 人，佔 45%）單元外的做（0.1027）略大於單元內（0.1007）。** 單元內與單元外係數之間的差異，七門課都**沒有檢定**。
- 單元外的做在七門課裡只有五門顯著為正（L766–767）：「Outside-unit doing was positive and significant for only five of the seven, which was a small surprise.」
- 因果模型的倍數 1.3 到 6.2（L802），是五種分析裡最小的。作者的解釋（L1017–1026）：「Given that the correlational model includes both correlational and causal components in its doing coefficient while the causal model attempts to separate them, it is expected for this ratio to be smaller. The causal model ratio may be smaller, but it is also more likely to be indicative of the relationship of interest between doing and outcomes.」
- 原文沒討論、表上看得到的：ISM 與 Research 的單元外・讀（0.1157、0.0604）大於單元內・讀（0.0723、0.0520）；Research 的單元內做（0.0678）與單元內讀（0.0520）差距很小（倍數 1.3）。

### 表 9：倍數彙整（L909–973；PDF 第 7 頁）

| 課 | 期末考 | 期末考＋前測 | Unit test | Unit test＋前測 | 因果・unit test |
|---|---|---|---|---|---|
| ISM | ∞ | ∞ | 6.6 | 5.0 | 1.7 |
| IT Fund | ∞ | ∞ | 9.0 | 8.1 | 1.8 |
| Macro | ∞ | ∞ | 11.8 | 8.5 | 3.0 |
| Micro | ∞ | ∞ | 16.3 | 11.8 | 6.2 |
| PM | ∞ | ∞ | 8.0 | 6.9 | 1.8 |
| Research | ∞ | ∞ | 5.7 | 5.4 | 1.3 |
| Stats | ∞ | ∞ | 13.9 | 6.5 | 3.5 |

- ∞ 的意思，作者自己澄清（L975–980）：「Does a ratio of ∞ mean doing practice was infinitely better than reading? Certainly not. This is merely used to indicate that a numeric ratio could not be calculated」。
- 對負的閱讀係數，作者只給軼事性解釋（L983–991）：「Anecdotally, we have observed that some students who performed poorly re-read the content several times and have little or no engagement with the available practice … This issue warrants further investigation.」

### 討論裡會被引用的句子

- 效果量不能換成分數（L1150–1152）：「It is very difficult to state quantitatively how much a student's grade will increase by doing a certain amount of practice.」
- 係數相同不等於效果相同（L1115–1129）：單元外做題數的標準差遠大於單元內，同樣的係數代表要多做好幾倍的題才換得同樣的分數變化；作者用假想數字（單元內 SD 10 題、單元外 SD 50 題）說明，不是實際資料。
- 模型假設每一題等值、練習與學習線性，作者自己說這兩個假設都不成立（L1130–1148）。

## 作者自己列的限制（4.3 節，L1053–1066）

1. 全部七門課來自同一所線上學校、都是能力本位課程，「which may limit generalizability」。
2. 「the mixed effects regression model used does not prove causality of the doer effect but gets closer to causal inference by showing that the doer effect cannot be completely explained by a global student trait」。
3. 「Other third-variable explanations could still be possible, however, and more work on establishing causality is warranted, such as through causal discovery algorithms … or actual experimentation.」

散在別處的：頁面造訪只是閱讀的代理（L285）；前測與 courseware 可能沒對齊（L501–506）；模型線性、題目等值的假設不成立（L1130–1148）；期末考沒有因果模型（L183–189）。

**利益關係與經費**：論文**沒有利益衝突聲明，也沒有經費聲明**；致謝只謝審稿人與一位協助編修的人（L1199–1201）。四位作者都掛 VitalSource Technologies，第一作者信箱是 acrobatiq.com。論文沒有寫這套 courseware 是哪家公司的產品，只說它「mirrors many of those same features」（L213–215）；結論段把結果接到用 AI 自動出題來大量製作形成性練習（L1179–1186），引的是同一組作者自己的研究。所以「作者與產品有利益關係」可由機構歸屬與自我引用推得，但原文沒有一句話直接說。

## 與摘要說法不一致的地方

1. 摘要與導言把前人研究寫成已證明因果：「Research on the doer effect has shown it to be causal to learning [10]」（L30–31）、「This causal doer effect relationship was confirmed in later work」（L93–94）。本文自己的方法段與限制段卻寫這個模型「does not demonstrate causality conclusively」（L181–182）、「does not prove causality」（L1058–1059）。被引的 Koedinger 2016 原文也只寫「cannot be explained solely by some global student trait」（見同目錄 `koedinger2016-doer-causal.md`）。
2. 4.4 節直接寫「because doing practice causes learning, students should be encouraged to attempt as much practice as is available」（L1078–1079），與 4.3 節的限制互相矛盾。
3. 摘要把 doer effect 定義成「students who do practice while they read have higher outcomes than those who only read」（L28–30）。本文沒有比較「邊讀邊做的人」與「只讀的人」這兩群，做的是連續變項的迴歸；而且「讀」的定義把有做題的頁面造訪排除在外。
4. 內文寫 unit test 的十四個模型「show a positive and significant total reading coefficient」（L474–476）。表 6 的 Micro（不含前測）讀的係數是 0.0379，標的是「.」（p < .1），照表頭的顯著碼不算顯著；16.3 這個最高倍數正是用這個係數當分母算的。
5. 表 7 的標題是「**Final exam** causal doer effect regression analysis」，但內文講明因果模型只用 unit test、沒有期末考版本（L183、L748 起）。標題應是誤植。
6. 4.1 節寫「The results of this replication study are entirely consistent with previous doer effect findings」（L806–807）。但期末考上讀的係數十四個全為負、十一個顯著為負，Koedinger 2016 的期末成績模型讀的係數全為正（0.020 到 0.109）；兩者的遠端結果變項也不同（一個是期末考分數、一個是五級期末成績）。「entirely consistent」說得太滿。
7. L351–353 把倍數寫成「the standardized reading estimate can be divided by the standardized doing estimate」，方向寫反了（前一句與表格都是做除以讀）。
8. 4.2 節說「for every course, a correlational doer effect was confirmed by also finding a causal doer effect」（L1046–1048）；Stats 的單元內做並沒有大於單元外做。

## 與清單「要撐的結論」不合的地方

清單寫 8-d「doer effect 在多門課裡一致出現，但是相關性資料，沒有隨機實驗；主要作者與產品有利益關係」，本篇負責「複製、作者自述的限制、利益關係」。

- 「多門課一致出現」：做的係數在七門課、五種分析裡全部為正且顯著，撐得住。但「六倍」複製不出一個穩定的數：相關模型 5.0 到 16.3，因果模型 1.3 到 6.2（中位數 1.8），期末考上因為讀的係數為負而根本算不出來。文章若要寫倍數，得寫成「看用哪個考試、哪個模型，從一點三倍到算不出來」。
- 清單沒列、原文有的重要結果：**(a) 以期末考（這門課唯一算成績的考試）為結果時，前測的係數是做題的 2.5 倍，做的係數只有 unit test 上的三到六成；unit test 是與 courseware 同一套系統裡的近遷移測驗。(b) 讀得多的人期末考較差（十四個模型裡十一個顯著為負）。** 這兩點比「複製成功」更值得寫。
- 「相關性資料、沒有隨機實驗」：撐得住，作者自己寫了三次。
- 「作者自述的限制」：有，見上；但同一篇在摘要、導言與 4.4 節又用因果用語，自述的限制與行文不一致，這一點可以寫。
- 「利益關係」：原文沒有聲明。能寫的事實是「四位作者都任職 VitalSource，論文沒有利益衝突聲明」；「courseware 是 VitalSource／Acrobatiq 的產品」要另找來源才能寫。

## 讀取紀錄

- `vancampenhout2023.txt` 一次讀完 L1–1273（全檔）：L1–68 標題、摘要、ACM 資訊；L70–200 導言；L202–339 方法、表 1、表 2；L341–506 結果 3.1、表 3–5；L508–688 表 6 與判讀；L690–802 結果 3.2、表 7；L804–836 討論 4.1；L838–973 表 8、表 9；L975–1051 討論 4.2；L1053–1154 限制、4.4；L1156–1201 結論、致謝；L1205–1273 參考文獻（掃過）。
- 對過 PDF 版面：表 1、表 2（第 3 頁）、表 3–5（第 4 頁）、表 6（第 5 頁）、表 7（第 6 頁）、表 8、表 9（第 7 頁）。PDF 第 3–7 頁以影像讀過；第 1、2、8、9 頁只讀文字檔（沒有表）。
- 文字檔裡表 6 的四欄是依欄逐塊輸出的，上面的表是照 PDF 版面重排的，逐格對過。
