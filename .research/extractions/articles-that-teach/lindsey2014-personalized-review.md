# 抽取紀錄：Lindsey、Shroyer、Pashler、Mozer 2014，Psychological Science 25(3), 639–647（doi 10.1177/0956797613504302）

- **完整書目**：Robert V. Lindsey、Jeffery D. Shroyer、Harold Pashler、Michael C. Mozer（2014）。Improving Students' Long-Term Knowledge Retention Through Personalized Review. *Psychological Science*, 25(3), 639–647。線上先行 2014-01-20，正式刊出 2014-03-12；收稿 2013-06-18、接受 2013-08-15。作者全名與順序對過 PDF 首頁與 Crossref 紀錄。單位：Lindsey、Mozer 在 University of Colorado Boulder 的 Institute of Cognitive Science 與資訊系，Shroyer 在同一研究所，Pashler 在 UC San Diego 心理系。通訊作者 Michael C. Mozer。
- **原文檔**（都在 `.research/raw/learning-content/q4-time/`）：
  - `lindsey2014-personalized-review.txt`：1,467 行、122,040 位元組，`pdftotext -layout` 轉的，正文是雙欄，左右兩欄交錯。**這份沒有拿來讀。**
  - `lindsey2014-personalized-review-nolayout.txt`：2,046 行、81,920 位元組，2026-10-14 用不帶 `-layout` 的 `pdftotext` 從同一份 PDF 重轉。**下面的行號（N 開頭）都指這一份。**
  - `lindsey2014-personalized-review.pdf`：24 頁（封面 1 頁、正文 639–647 共 9 頁、補充材料 SOM-R 2 頁、SOM-U 12 頁），2026-10-14 重新下載存檔。
  - 來源：作者 Mozer 的個人頁 `https://home.cs.colorado.edu/~mozer/Research/Selected%20Publications/reprints/LindseyShroyerPashlerMozer2014Published.pdf`。Unpaywall 查這個 DOI 沒有登錄開放取用版本，手上這份是作者自己放的刊出版抽印本。
- **讀取日期**：2026-10-14
- **版本**：刊出版（Version of Record），含出版者的補充材料 SOM-R 與 SOM-U。
- **供哪幾篇 order 使用**：order 16（清單 D 第 16#8 列）、order 17（共用）。
- **勘誤**：查了 Crossref，這個 DOI 沒有登錄更正或勘誤（`update-to` 為空）。只查了 Crossref，沒有翻期刊網站。

## 研究設計

- **類型**：真實課堂裡的一學期受試者內實驗。每個學生每一章的項目隨機分成三份，各交給一種複習排程（N258–N259）。
- **受試者**：美國丹佛郊區一所中學的八年級生（年齡中位數 13 歲），179 人（男 82、女 97），分在同一位教師的 6 個班，第三學期西班牙語（N997–N999）。教師有 22 年教學經驗，只知道實驗的大致目的（N1017–N1019）。學生不知道操弄的細節，只知道軟體會花一部分時間複習舊字彙（N1008–N1011）。
- **上課時間**：每班週一、二、五各 50 分鐘，週三或週四 90 分鐘（N999–N1000）。
- **教材**：教師提供 409 個西英字詞與片語，10 章，出自課本 *¡Ven Conmigo! Adelante* Level 1a；把高度相關的變體（同一動詞的各種變化、名詞的陰陽性與複數等）併成 221 個知識元件（KC），正文裡稱為 item（N946–N956）。各章的字詞數與 KC 數見 Table S1（對過 PDF：字詞數合計 409、KC 合計 221）。
- **軟體**：Colorado Optimized Language Tutor（COLT），網頁式閃卡。出英文，學生打出西班牙文，之後給正解並用背景色標對錯（綠／紅）；自訂步調；回饋畫面至少停 3 秒；拼字與重音符號要完全正確才算對（N1040–N1066）。
- **每章的流程**：課堂上三次、每次 20–30 分鐘。前兩次先做「練到會」（study-to-proficiency：答對的項目退出，直到本章全部答對一次），再進複習階段到下課；第三次先考本章小考（計入成績），再做同樣兩階段（N125–N131、N968–N979）。新章通常週五開始，下週二再練，週三或週四小考（N1201–N1202）。學生可以在家補做或加練（N1012–N1016、N1203）。
- **三種排程**（複習階段輪流出題，每種排程拿到同樣多的複習次數；N259–N263、Figure S2 的虛擬碼對過 PDF）：
  1. **Massed**：繼續出本章裡最久沒練的項目（N132–N133）。作者說這對應學生原本的做法：七年級用的市售閃卡軟體讓學生自己選章，學生幾乎只練當週那一章（N135–N140、N1003–N1007）。
  2. **Generic spaced**：出上一章裡最久沒練的項目，等於隔約一週複習一次（N157–N169）。
  3. **Personalized spaced**：用 DASH 模型估每個學生每個項目當下的回想機率，出機率最接近門檻的那一項，可以是之前任何一章（N170–N185、N1271–N1274）。門檻依 Khajah 等 2013 的模擬取 .33（N772–N774）。
- **DASH 模型**：把項目難度、學生能力、該學生對該項目的練習史（次數、時間分布、對錯）三者相加成回想的對數勝算（N250–N257、附錄 N623–N746）。時間窗五個：1 小時、1 天、7 天、30 天、無限（N743–N744）。參數用全體學生對全體項目的作答資料做階層式貝氏推論（N179–N185、SOM-U 的 Hierarchical Distributional Assumptions 與 Gibbs-EM 兩節）。
- **系統實作**：前端網站每題作答後即時寫進資料庫；另有一台後端伺服器持續下載全部資料、重跑模型、把預測傳回。推論時間從學期初的幾秒增加到學期末的半小時，當時已累積近 60 萬題；後端至少當機三次，當機時前端用最近一次的預測輪流出題（N1076–N1101）。
- **量了什麼、何時量**：
  - 兩次有監考的累積考試：學期末（第 89–90 天）與 28 天後、下學期初（第 117–118 天），中間學生不能用 COLT（N205–N210、N1210–N1212、Table S1）。每次考每章每個條件一半的 KC，兩次不重複，逐學生隨機分派；考試不給回饋（N989–N992）。Table S1 列的是第一次考 112 個 KC、第二次 109 個（對過 PDF）。
  - 章末小考（第 1–9 章，計入成績；第 10 章沒有小考）（N1206、N1520–N1522）。
- **分析樣本**：第一次考試 172 人應考，2 人作弊被排除；第二次 176 人應考。只要考過任一次就納入（N1000–N1002、N1015–N1016）。
- **練習量**：整學期共記錄 597,990 題（含小考與三種排程的項目）（N492、N1859–N1861）。

## 結果（逐項）

所有百分比的寫法原文都沒有說明是百分點還是相對增幅。Fig. 2a 的長條（我從 PDF 第 4 頁的圖目測，原文沒有給數值）約是：學期末 massed 65、generic 68、personalized 73；28 天後 52、55、60.5。73／65 ≈ 1.12、60.5／52 ≈ 1.16，與內文的 12.4% 與 16.5% 相符，所以這些數字**看起來是相對增幅，不是百分點**；百分點差距大約是 8 與 8.5。這是我對圖的判讀，引用時要寫「相對提高」或直接不換算。

| # | 結果 | 數字 | 對照條件 | 節／表 | 位置 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 學期末考試：personalized 對 massed | 高 12.4%；t(169) = 1.01（原文如此），p < .001，Cohen's d = 1.38 | 同一批學生，三分之一項目各走一種排程 | Results、Fig. 2a | N210–N212，PDF p.641 | 「retention for items assigned to the personalized spaced scheduler was 12.4% higher than retention for items assigned to the massed scheduler, t(169) = 1.01, p < .001, Cohen's d = 1.38」 |
| 2 | 學期末考試：personalized 對 generic | 高 8.3%；t(169) = 8.2，p < .001，d = 1.05 | 同上 | 同上 | N212–N215 | 「and 8.3% better than retention for items assigned to the generic spaced scheduler, t(169) = 8.2, p < .001, Cohen's d = 1.05」 |
| 3 | 28 天寒假的遺忘率 | massed 18.1%、generic 17.1%、personalized 15.7% | 兩次考試之間 | Results | N215–N217 | 「Over the 28-day intersemester break, the forgetting rate was 18.1%, 17.1%, and 15.7% for the massed, generic spaced, and personalized spaced conditions, respectively」。原文沒有定義遺忘率怎麼算，也沒有檢定三者的差異。 |
| 4 | 28 天後考試：personalized 對 massed | 高 16.5%；t(175) = 1.11（原文如此），p < .001，d = 1.42 | 同上 | Results、Fig. 2a | N320–N322 | 「personalized review boosted retention by 16.5% over massed review, t(175) = 1.11, p < .001, Cohen's d = 1.42」 |
| 5 | 28 天後考試：personalized 對 generic | 高 10.0%；t(175) = 6.59，p < .001，d = 0.88 | 同上 | 同上 | N322–N324 | 「and by 10.0% over generic review, t(175) = 6.59, p < .001, Cohen's d = 0.88」 |
| 6 | 個別學生的方向 | 兩次都考的學生裡，只有 22.3% 在 generic、13.5% 在 massed 的得分高於 personalized | 同上 | Results | N330、N476–N477 | 「Among students who took both exams, only 22.3% and 13.5% scored better in the generic spaced and massed conditions, respectively, than in the personalized spaced condition.」 |
| 7 | 效果集中在學期前段的章節 | Fig. 2b：第 1–5 章 personalized 明顯較高；第 7–10 章三條線重疊 | 依章分 | Results、Fig. 2b | N325–N329 | 「The schedulers had their primary impact for material introduced earlier in the semester (Fig. 2b)」「without sacrificing efficacy for later chapters」 |
| 8 | **generic 對 massed 只有小幅差距，最後幾章沒有間隔效果** | 內文沒有給這一組的數字或檢定 | generic 對 massed | Results | N478–N484 | 「This fact may explain both the small benefit of the generic spaced over the massed scheduler and the absence of a spacing effect (generic and personalized spaced schedulers outperforming the massed scheduler) for the final chapters」 |
| 9 | 各排程的練習量與間隔（Table 1，對過 PDF） | 練到會的次數：7.58（SD 6.70）、7.57（6.49）、7.56（6.47）；複習次數：8.03（11.99）、8.05（12.14）、8.03（9.65）；複習之間的天數：0.12（1.43）、1.69（3.29）、4.70（6.39）。順序皆為 massed、generic、personalized | 每個學生每個項目 | Table 1 | N332–N382，PDF p.641 | 表列 |
| 10 | 累積考試的 ANOVA：排程主效果 | 考試 1：F(2, 328) = 52.3，p < .001；考試 2：F(2, 340) = 55.1，p < .001 | 班別 × 排程 × 章 | SOM-U | N1382–N1384 | 「The main effect of scheduler is highly reliable in both exams (exam 1: F(2, 328) = 52.3, p < .001; exam 2: F(2, 340) = 55.1, p < .001)」 |
| 11 | 班別主效果 | 考試 1：F(5, 164) = 6.77，p < .001；考試 2：F(5, 170) = 9.72，p < .001 | 六個班 | SOM-U | N1384–N1385 | 「some sections perform better than others」 |
| 12 | 排程 × 章交互作用 | F(18, 2952) = 8.90，p < .001；F(9, 1530) = 29.67，p < .001 | — | SOM-U | N1386–N1388 | 「A scheduler × chapter interaction is observed (exam 1: F(18, 2952) = 8.90, p < .001; F(9, 1530) = 29.67, p < .001)」。第二個 F 沒有標「exam 2」，自由度（9, 1530）也與第一個的形式不同；原文如此。 |
| 13 | 排程 × 班別（**不顯著**） | 考試 1：F(10, 328) = 1.44，p = .16；考試 2：F(10, 340) = 1.36，p = .20；三因子交互作用兩次都 F < 1 | — | SOM-U | N1388–N1390 | 「The scheduler × period interaction is not reliable」 |
| 14 | **章末小考：massed 最高**（反向） | massed 89.4%、generic 87.2%、personalized 88.1%；排程主效果 F(2, 310) = 11.8，p < .001；只收七次小考（第 2–7、9 章）都考了的 156 人 | 當章小考，小考只考當章 | SOM-U、Fig. S5 | N1395–N1402 | 「the massed scheduler does best on the quizzes—89.4% versus 87.2% and 88.1% for the generic and personalized spaced schedulers—because it provided the largest number of study trials on the quizzed chapter.」 |
| 15 | 小考的章主效果與交互作用 | 章：F(6, 930) = 49.0，p < .001；排程 × 章不顯著，F(12, 1860) = 1.56，p = .096 | — | SOM-U | N1402–N1404 | 表列 |
| 16 | 第 8 章小考（教師出的題大多來自第 7 章） | generic 76.1%、personalized 67.5%、massed 64.2%；F(2, 336) = 14.4，p < .001 | — | SOM-U | N1523–N1526 | 「Because the generic-spaced condition focused review on chapter 7 during chapter 8, it fared the best on the week 8 quiz」 |
| 17 | 模型預測誤差（Fig. 4，從 PDF 目測） | baseline 約 0.35、IRT 約 0.34、ACT-R 約 0.305、DASH 三個變體約 0.25–0.255 | 把 597,990 題依時間切 100 段，用前面各段預測下一段 | Results、Fig. 4 | N489–N512、N447–N453 | 「The three variants of DASH performed better than the alternatives.」「The DASH variants all performed similarly.」內文沒有給數值，也沒有檢定。 |
| 18 | 三個推論因子的變異 | 各因子約跨 3 個對數單位，相當於回想機率可差 .65 | — | Fig. 3 | N438–N439 | 「Each factor varies over 3 log units, which corresponds to a possible modulation of .65 in recall probability.」 |
| 19 | 複習占課程時間的比例 | 每週約 30 分鐘，約占學生投入課程時間的 10% | — | Discussion | N553–N556 | 「considering that the duration of roughly 30 min a week was only about 10% of the time students were engaged with the course」 |
| 20 | 各章練習量差很多（Fig. S3，對過 PDF） | 每位學生每章的題數中位數約從 55（第 8 章）到 430（第 6 章）；在家練習占相當比例（第 3 章過半） | — | SOM-U、Fig. S3 | N1215–N1219、N1377–N1381 | 「Chapter 8 has few trials because it was covered in class only the day before a holiday break and the day after it.」 |

### t 值的問題（清單特別交代要對 PDF）

對過 PDF 第 4 頁（期刊頁碼 641）：**刊出版本身印的就是「t(169) = 1.01」與「t(175) = 1.11」，不是轉文字錯位。** 這兩個值與同一句的 p < .001、d = 1.38／1.42 兜不起來（自由度 169 時 t = 1.01 對應的 p 約 .31）；另外兩個 t 值 8.2 與 6.59 沒有這個問題。看起來像小數點位置印錯，但原文沒有更正，Crossref 也沒有勘誤紀錄，正確值我無從確認。引用時不要引這兩個 t 值，也不要自己改成別的數字；要引檢定就引 SOM-U 的 ANOVA（第 10 列）。

Cohen's d 的算法原文沒有交代（受試者內設計有好幾種算法），1.38 與 1.42 不能直接拿去和組間設計的 d 比。

### 補充材料裡其他對不上的小地方

- SOM-U 說排程 × 章的交互作用「as one would expect from Fig. 4」（N1387），Fig. 4 是模型預測誤差，對應的應該是 Fig. 2b。原文如此。
- 內文說 172 人考了第一次、其中 2 人作弊被排除（N1000–N1002），對應 t(169)；第二次 176 人對應 t(175)，表示那 2 人沒有從第二次排除，原文沒說明。

## 作者自己列的限制

原文沒有 Limitations 節。作者自己承認的保留：

1. **個人化與「複習拉得比較開」兩件事混在一起**：「We acknowledge that our design confounded personalization and the coarse temporal distribution of review (Fig. 1, Table 1).」（N571–N572）Table 1 裡 personalized 的複習間隔平均 4.70 天，generic 1.69 天，massed 0.12 天；generic 只複習上一章，personalized 可以回到任何一章（Fig. 1）。作者接著辯護：不加選擇地複習舊教材不太可能有幫助（N572–N575），但這句沒有資料支持。
2. **massed 條件其實也是分散的**：至少跨 6 天（週五到下週三或四）。作者用這一點解釋 generic 對 massed 只有小幅差距、最後幾章沒有間隔效果（N478–N484）。
3. **課堂外的接觸沒有控制**：上課、作業、課本都會碰到同樣的教材，「might well have washed out the effect」（N557–N560）。
4. **最佳排程算不出來**，COLT 用的是啟發式門檻規則（N751–N758）。
5. **推論演算法不能直接放大規模**：學期末要跑半小時，作者說要換成 sequential Monte Carlo 才能擴大（N1089–N1092）；後端當機至少三次（N1095–N1096）。
6. **平衡對調只能近似**（±1）（N962–N965）。
7. **各學生使用量差異大**，因為在家使用是自願的（N1014–N1015、N1867–N1870）。
8. Leitner 與 SuperMemo 的效果，作者說是「尚未在實際使用中做過正式評估」，並「懷疑」有改進空間（N590–N596）；這是意見，本研究沒有測這兩種方法。
9. 推廣到概念、程序、技能學習是主張（「The approach is also general」，N605–N607），本研究只有字彙與短句的英翻西。

原文沒有談的（我的觀察，不是作者說的）：

- 單一學校、單一教師、單一科目、單一學期。
- 兩次考試只隔 28 天，最長的保留間隔是學期初教材到第二次考試約 117 天；沒有更長的追蹤。
- 沒有「不複習」的對照，也沒有「學生自選」的對照（massed 是用來代表學生自選時的行為，依據是前一年的觀察與 Cohen 等 2013）。
- generic 對 massed 沒有報告單獨的檢定。
- 計分要求拼字與重音完全正確，量的是提示回想；沒有量理解或使用。

## 與摘要說法不一致的地方

1. **摘要只報了第二次考試的數字**（16.5% 與 10.0%，N60–N61），也就是兩次裡較大的那一組；學期末那一次是 12.4% 與 8.3%。摘要寫的是「a cumulative exam administered after the semester's end」，沒有提有兩次考試。
2. **摘要的「16.5% boost」「10.0% improvement」沒有說是相對增幅**；從 Fig. 2a 看是相對值，百分點差距約 8.5 與 5.5（目測）。
3. **摘要把 massed 稱為「current educational practice (massed study)」**，內文自己說這個條件以實驗室標準看是分散的、跨至少 6 天（N478–N480）。
4. **摘要的「time-matched」**：對齊的是複習的出題次數（Table 1 各約 8 次），原文沒有報告各條件實際花的時間。
5. **摘要沒有提**：章末小考是 massed 最高（SOM-U）；效果集中在學期前半的章節；個人化與複習間隔長短混在一起。
6. 數字本身（16.5%、10.0%）與內文一致。

## 與清單「要撐的結論」不合的地方

清單寫的是：「把排程做進課程軟體的一學期實驗；個人化排程需要逐題作答資料」。

1. **「把排程做進課程軟體的一學期實驗」：撐得住。** 補上規模與條件才不會被讀大：一所中學、一位教師、179 名八年級生、西班牙語字彙 221 個知識元件、每週約 30 分鐘、複習約占課程時間 10%。
2. **「個人化排程需要逐題作答資料」：方向對，但原文的要求比這句重，而且「需要」不是被檢定出來的。**
   - 原文用的不只是「這個讀者自己的逐題作答」，而是**全體學生對全體項目、帶時間戳記的每一次作答**，靠群體資料去補個人資料的稀疏（N179–N185）；外加一台持續重跑模型的伺服器（N1083–N1092）。
   - 支持這句的證據是 Fig. 4 的預測誤差比較（只用個人答對率的 baseline 與沒有貝氏群體推論的 ACT-R 預測較差），是預測準確度的比較，不是「少了這些資料排程就沒效」的實驗；原文沒有拿「只用個人資料的適性排程」當對照組。
   - 作者自己承認個人化的效果與「複習間隔拉得較長、可回到任何舊章」分不開（N571–N572）。所以不能寫成「個人化本身帶來 10%」，只能寫「這套個人化排程勝過固定隔一週複習上一章的排程」。
3. **清單沒列、但會改變怎麼引這篇的三件事**：
   - 兩個主要 t 值在刊出版就印得不合理（見上），不要引。
   - 12.4%、16.5% 等是相對增幅（依圖判讀），不是百分點。
   - 章末小考是 massed 條件最高（89.4% 對 87.2% 與 88.1%）；這是「當下考試集中較好、延後考試分散較好」的同一份資料，寫間隔的代價時可以用。
4. **對 order 17（把複習做進文章）的適用範圍**：這裡的複習是教師排在課堂時間裡、軟體決定出什麼題，學生不用自己決定要不要回來，也不用自己選內容。原文沒有任何關於讀者自發回訪的資料。

## 讀取紀錄

讀的是 `lindsey2014-personalized-review-nolayout.txt`（N1–N2046），依序、首尾相接：

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | N1–N700 | 封面頁、標題、作者與單位、摘要、前言、方法（COLT、三種排程、DASH 概述）、Fig. 1 圖說、結果（兩次考試、Fig. 2、Table 1、Fig. 3、模型比較、Fig. 4）、討論（Personalization、Beyond fact learning）、附錄前半（IRT、additive-factors、DASH 的式 1） |
| 2 | N700–N1419 | 附錄後半（時間窗、個人化排程的門檻規則）、作者貢獻、致謝、利益衝突、經費（NSF 研究生獎學金、NSF SBE-0542013 與 SMA-1041755、McDonnell Foundation）、參考文獻（掃過）、SOM-R 全文（Materials、Procedure、Participants）、SOM-U 的 Experimental Methods（Software、Implementation、Table S1、Semester Calendar、Figure S2 虛擬碼）、Additional Analyses 前半（Fig. S3、累積考試 ANOVA、小考分析） |
| 3 | N1419–N2046 | Fig. S4、Fig. S5、第 8 章小考、Modeling（Other models that consider time、Fig. S6、Hierarchical Distributional Assumptions、Gibbs-EM、Model Comparison and Evaluation、四個對照模型的規格、註腳 1–4）、SOM-U 參考文獻（掃過） |

對過 PDF 版面的頁（用 Read 直接看頁面影像）：

- PDF 第 3–5 頁（期刊 640–642）：Fig. 1、Fig. 2a／2b、**Table 1 六欄逐格**、四個 t 值與 d、Fig. 3、Fig. 4。
- PDF 第 15–20 頁（SOM-U 第 3–8 頁）：**Table S1 逐格**（並自己加總核對 409 與 221）、Figure S2、Fig. S3、ANOVA 段落的 F 值、Fig. S4、Fig. S5、Fig. S6。

沒有對 PDF 的部分：SOM-U 後段的公式（式 2–13）在轉文字後符號散掉（α、δ、σ 等變成空白或亂碼），我只讀了文字敘述，沒有逐式核對；這些公式是模型推論的細節，不含會被文章引用的結果數字。
