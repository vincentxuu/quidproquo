# 抽取紀錄：Nelson、Xie、Ko 2017，Comprehension First（ICER '17）

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3105726.3106178（ACM 現行提供的檔，2026-10-14 核對）；同一個檔也在共同作者 Amy Ko 的教職頁 https://faculty.washington.edu/ajko/papers/Nelson2017PLTutor.pdf 。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。兩處重新下載的 PDF 都與手上的 `nelson2017-pltutor.pdf` 位元組完全相同（2,752,330 位元組）。

- **書目**：Greg L. Nelson、Benjamin Xie、Amy J. Ko（三人皆 University of Washington；對過 PDF 第 1 頁）。Comprehension First: Evaluating a Novel Pedagogy and Tutoring System for Program Tracing in CS1. *Proceedings of ICER '17*（2017 年 8 月 18–20 日，Tacoma, WA），頁 42–51。DOI 10.1145/3105726.3106178（首頁版權欄印的就是這個 DOI）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/nelson2017-pltutor.pdf`（10 頁）、`.txt`（1,356 行、71,310 字元；不帶 `-layout` 的 pdftotext，雙欄與圖內數字的順序是亂的）。
- **版本**：ACM 刊出版的版面（有 ICER 頁首、頁碼 42–51、版權欄），第 1 頁右下另印「Most up-to-date version: 06/25/2021」。也就是作者後來重新放出的檔；和 2017 年 ACM DL 上的版本差在哪裡，原檔沒有說明，我沒有比對。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 3（程式碼）#7
- **行號**：一律是 `.txt` 的行號；`.txt` 第 5 節左右欄交錯，結果段另外對過 PDF 第 6–8 頁（論文頁碼 47–49）。

## 研究設計

- **類型**：作者自稱「formative, block-randomized, between subjects study」（L588–589）。一天的實驗室工作坊，前測／後測，再追蹤課程期中考。論文前半（第 3、4 節）是理論與系統設計，不是實驗。
- **受試者**：剛開始修 CS1 的大學部學生；CS1 是「procedural-first writing pedagogy using Java」（L640）。學校原文沒有明寫（三位作者都在 University of Washington）。納入條件是沒修完大學 CS1、沒用過 Codecademy（L638–639）。
  - 招募：988 名學生中 200 人回覆招募問卷，90 人符合條件（L650–651）；依先前寫程式時數、自述出席可能性、年齡、性別做區組隨機分派，再從各區組隨機邀請，最後 41 人到場（L652–655）。
  - 分析樣本：SCS1 系統「randomly lost some tests」，丟掉這些人之後 PLT 18 人、CC 19 人，共 37 人（L571–572）。
  - 招募方式的偏誤作者自己寫了：以「a chance to excel in the class」宣傳，「potentially biasing towards motivated and at-risk students」（L648–650）；摘要也寫「self-selected CS1 students」（L63）。
  - 新手的操作定義：自述經驗少於 10 小時且沒修過 CS 課（L572–574）。兩組各有幾個新手，原文沒有寫。（我用 Figure 4 的分組平均反推，兩組大約各 7 人，這是我算的，不是原文數字。）
- **教材與比較對象**：
  - PLT 組：PLTutor，作者做的網頁版教學系統，教 JavaScript 的執行語意。學習者不寫也不改程式，只一步一步看指令層級的執行、讀穿插的概念說明、填被藏起來的值（L41–44、L373–375、L478–481）。
  - CC 組：Codecademy 的教學，作者說選它是因為「traditional writing-focused spiral pedagogy」與四年的課程打磨（L589–590）。原文沒有寫用的是 Codecademy 哪一門課、哪個語言。
  - 兩組各用 4.33 小時（L642；指示語說 4 小時 20 分，L660–661），中間 1 點供午餐；結束後休息 10 分鐘，再給 1 小時做後測（L661–664）。工作坊時間是週六 10:30–18:00（L641）。
  - 兩組在不同教室、不同講師（L655–658、L1003–1006）。
- **量了什麼、何時量**：
  - 程式理解：SCS1（27 題選擇題的 CS1 知識測驗），當天前測與後測各一次，間隔約 4.3 小時（L642–643、L940–941）。
  - 寫程式能力：用課程期中考成績當代理（L665–667）。
  - 衍生指標（L667–670、L567–570）：learning gain（後測減前測）、FT（前測錯、後測對的題數）、TT（兩次都對，當成既有知識）、learning capacity、LCL（FT ÷ learning capacity，「the % learned that could learn」）。
  - 問卷：固定／成長心態、程式自我效能、Epworth 嗜睡量表（L643–647）。
  - 兩個月後的訪談（操弄檢核）：自願回來接受期中後輔導的 6 人（CC 2 人、PLT 4 人）做放聲思考（L877–891）。
- **分析**：預設用 Wilcoxon rank-sum；Shapiro-Wilk 各組 p > 0.1 時加報 t 檢定（L600–603）。作者試過用線性與二項 GLM 控制其他變項，但「residuals strongly violated modeling assumptions」（L613–615），所以沒有控制前測差異的模型。

## 結果（逐項）

Figure 4 的數字（格式「平均 標準差」）是從 PDF 第 7 頁（論文頁 48）的圖上讀的，`.txt` 裡散在 L686–873。

| # | 結果 | 數字與對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|
| 1 | 前測兩組不相等 | CC 前測 8.26（SD 2.96），PLT 6.61（SD 2.09）；CC−PLT = 1.65，Wilcoxon p < .111，t 檢定 p < 0.058 | 5.2；Figure 4；L598–605 | 「Pre-test SCS1 differences between the two conditions were large and marginally significant (CC–PLT mean=1.65, W p < .111, t-test p < 0.058), but self-reported prior programming experience and mindset did not differ significantly.」 |
| 2 | 組內前後測 | PLT 後測與前測有顯著差異（p<.0044）；CC 沒有達到 .05（p<.089） | 5.2；L606–609 | 「comparing within each condition, only PLT's post-scores were significantly different from its pre-scores (p<.0044) (for CC p<.089).」 |
| 3 | 後測分數 | CC 10.68（SD 4.63），PLT 10.5（SD 4.49）；滿分 27。兩組後測幾乎一樣，CC 還略高 | Figure 4（PDF 頁 48） | 圖內數字；討論段寫「PLTutor matched Codecademy's post-scores」（L1031） |
| 4 | **learning gain 的組間比較：不顯著** | PLT 3.89（SD 4.1）對 CC 2.42（SD 3.2）；Cohen's d = .398，Wilcoxon p<.41，t 檢定 p<.24 | 5.2；L611–612；Figure 4 | 「for learning gain: Cohen's d=.398 (p<.41, t-test p<.24)」 |
| 5 | FT（前測錯→後測對）的組間比較：不顯著 | PLT 6.39（SD 3.15）對 CC 4.68（SD 2.43）；d = .59，p<.12，t 檢定 p<.075 | 5.2；L611；Figure 4 | 「Comparing conditions, PLT had higher individual FT, with Cohen's d=.59 (p<.12, t-test p<.075)」 |
| 6 | LCL 的組間比較：不顯著 | PLT .29（SD .16）對 CC .24（SD .14）；d = .34，p<.39，t 檢定 p<.31 | 5.2；L612–613；Figure 4 | 「for the % learned that each person could learn (LCL): d=.34 (p<.39, t-test p<.31)」 |
| 7 | 前測對→後測錯（T to F） | CC 2.47（SD 1.58），PLT 2.50（SD 1.92）；原文沒有檢定 | Figure 4；L1033–1035 | 「true to false shows little to no difference (see 4.c)」 |
| 8 | TT（兩次都對） | CC 5.74（SD 3.3），PLT 4.11（SD 2.32）；原文沒有檢定 | Figure 4 | 圖內數字 |
| 9 | 逐題比較 | 以兩組 LCL 相差 ≥ .1 為準，PLT 較好的題目佔 37%，CC 較好的佔 22%（27 題）。這是描述性的門檻，不是檢定；Figure 5 另用星號標出兩組 95% 信賴區間不重疊的題目，圖上只看得到 1 個星號（最左邊那一題） | 5.2；L616–621；Figure 5 | 「PLT outperformed CC on 37% of questions and CC outperformed PLT on 22%, based on between group difference of ≥ .1 in LCL」 |
| 10 | 哪些題各自較好 | CC 較好：部分程式填空（Q18、25、21）、寫程式概念題（Q1、Q6）、PLT 沒教的字串（Q18）與含 modulus 的追蹤題（Q19）。PLT 較好：追蹤題（Q2、23、3、12、24、14、8）、一題靠子運算式細節的追蹤概念題（Q10）、複雜的程式填空（Q13、Q26）、CC 沒教的遞迴（Q14、Q24）、只用到陣列語法的字串追蹤題（Q15） | 5.2；L622–630 | 「CC did better for some code completion (Q18,25,21) and writing conceptual questions … In contrast, PLT did better for tracing (Q2,23,3,12,24,14,8)」 |
| 11 | 期中考平均：**沒有差別** | CC 76.11（SD 15.68），PLT 77.28（SD 9.03）；原文只寫不顯著，沒有給檢定統計量。符合條件但沒參加的人（n=38）平均 72.1（SD 22.1） | 5.2；L924–926；Figure 4 | 「Midterm average did not differ significantly between PLT or CC (see 4.e), or those in the recruitment group that met the inclusion criteria and did not participate, midterm m = 72.1, SD = 22.1 (n=38).」 |
| 12 | 期中考的分布 | Shapiro-Wilk 拒絕 CC 的常態性（p<.013）、沒有拒絕 PLT（p=.4723）；PLT 沒有人期中不及格，CC 有 2 人。變異數的差別原文沒有做檢定 | 5.2；L631–633、L924 | 「PLT had less variation and a more normal distribution for later writing outcomes compared to CC」「PLT had no midterm failures (vs. 2 in CC).」 |
| 13 | 當天的進步能不能預測期中考 | PLT：learning gain adj-R² = .6469（95% CI .28–.84，p<.00004）、後測 adj-R² = .5502、LCL adj-R² = .53、FT adj-R² = .4983。CC：只有後測的模型顯著（adj-R² = 0.1784，p<.041） | 5.2；L633–634、L921–924 | 「For PLT, midterm fit a linear model on each of: learning gain: (adj-R2=.6469 (95% CI: .28, .84 …) p<.00004 residual SE=5.37) … For CC, only a post-score model had significance (adj-R2=0.1784, p<.041, SE 14.21).」 |
| 14 | 期中考能不能代表寫程式能力 | 向 90 名符合條件者徵求期中考卷照片，收到 17 份；總分預測寫程式部分 adj-R² = .85，預測其他部分 .61 | 5.2；L927–931 | 「suggesting total midterm score varies fairly closely with the writing portion.」 |
| 15 | 新手與非新手的分組數字（Figure 4 下半） | 新手 CC：前測 6.57、後測 8.57、gain 2（SD 3.27）、期中 69.57（SD 19.5）；新手 PLT：前測 6.14、後測 11、gain 4.86（SD 4.85）、期中 78.57（SD 11.46）。非新手 CC：前測 9.25、後測 11.92、gain 2.67（SD 3.28）、期中 79.92；非新手 PLT：前測 6.91、後測 10.18、gain 3.27（SD 3.66）、期中 76.45。**這些分組數字正文一個都沒有檢定，也沒有寫各格人數** | Figure 4（PDF 頁 48） | 圖內數字 |
| 16 | 兩個月後的訪談 | 只有 6 人（CC 2、PLT 4）。作者說進步與期中成績「mostly increased with more sub-expression tracing (except P5)」；P5 是 PLT 組裡成績最高的（8 TT、12 FT、期中 86），用的卻是逐行模型 | 5.2；L877–891 | 「P5 (8 TT, 12 FT, 86 midterm) had a line level model.」 |
| 17 | 兩組都在約 4 小時內進步 | 作者拿來比的參照：修完 CS1 的學生 SCS1 平均 9.68（SD 3.5），範圍 2–20（引 Parker 與 Guzdial 2016）。兩組後測（10.68、10.5）都高於這個平均 | L609–611、L957–964 | 「We also saw learning gains comparable to full quarter or semester long courses with both tutorials in ~4 hours」 |

沒有任何一項組間比較達到 p < .05。作者摘要的用詞是「some evidence of improved learning gains」（L65）。

## 作者自己列的限制

第 6 節（L935–942、L996–1012）與第 4.3 節（L546–559、L576–580）：

1. 前測後 4.3 小時內就後測，可能有記題目的 carry-over 把後測灌高（L940–942、L996）。
2. 猜題，尤其新手（L996–997）。
3. SCS1 的效度論證不涵蓋三件事：新手受測者、前後測情境、當成學習進步的量尺（L997–999）。
4. 期中考當寫程式能力的量尺「had unknown measurement error and lacks validation」（L999–1000）。
5. 動機差異、疲勞、測量誤差、沒量到的個別差異、兩間教室的環境差異（L1001–1003）。
6. 講師不同，Codecademy 組的講師較有經驗；PLTutor 組的講師還因為午餐的事離開教室 45 分鐘（L1003–1006）。
7. 研究時間短，學習進步可能有天花板（L1006–1007）。
8. 研究流程、課程品質、花的時間、程式領域、沒有適性功能都會影響結果（L1007–1009）。
9. PLT 組的受試者在非正式訪談中抱怨練習重複（L1009–1012）。
10. PLTutor 沒教字串、I/O、物件、部分運算子、錯誤路徑；沒有逐步撤掉鷹架；評估當時是研究原型，有可用性問題（L547–553、L576–580）。
11. 樣本小：摘要「In our small study」（L65），討論「our small study still has threats to validity」（L1046）。
12. 隨機分派後兩組仍不相等：「Despite random assignment, we found differences that may have confounded measures of learning gains.」（L598–599）
13. 回歸到平均：作者自己提到 CC 的結果可能是「mean-reversion」（L1032–1034），只用 T to F 沒有差別來回應。

原文沒有討論的：流失的 4 份測驗（41 人到場、37 人分析）在兩組怎麼分布；兩組教的語言與 CS1 的 Java、SCS1 的虛擬碼之間的差距；多重比較（27 題逐題比、多個衍生指標）。

## 與摘要說法不一致的地方

1. **摘要沒有交代顯著性。** 摘要寫「average learning gains of PLTutor 60% higher than Codecademy (gain of 3.89 vs. 2.42 out of 27 questions)」（L65–67）。3.89 ÷ 2.42 = 1.61，算術對；但正文這項比較是 d = .398、Wilcoxon p<.41、t 檢定 p<.24（L611–612），摘要只用「some evidence」帶過。
2. **摘要沒提前測不相等。** PLT 前測低 1.65 分（L603–604），進步分數較高有一部分可能來自起點較低；兩組後測幾乎相同（10.5 對 10.68）。
3. **摘要的 R² = .64，正文是 adj-R² = .6469**（L68 對 L634），四捨五入應該是 .65；摘要也沒有寫這是調整後的值。
4. **摘要「less variation and no failures」**：正文沒有對變異數做檢定，只有常態性檢定與 SD（15.68 對 9.03）；「no failures」是 0 人對 2 人。期中考平均沒有差別（L924–925）這件事摘要沒寫。
5. **討論段比結果段說得更滿**（不是摘要，但會被引用）：
   - 討論寫「Higher total and question-specific learning gain than Codecademy (overall 37% of questions and 70% for novices)」（L1022）。「70% for novices」在結果段的文字裡找不到，只能對應到 Figure 5 的新手那一列長條。
   - 討論寫「even with a significant initial deficit」（L1031–1032），結果段寫的是「marginally significant」（p < .111、p < 0.058）。
   - 討論寫「something one can measure in only 8 hours」（L983–984），方法段的教學時間是 4.33 小時，整個工作坊 10:30–18:00 是 7.5 小時。
   - 討論寫「Our empirically strongest result is that PLTutor normalized midterm outcomes」（L1047–1048），依據是常態性檢定與 0 對 2 人不及格。
   - 討論寫 4 位學習者（22%）從低於平均的前測進步到接近高一個標準差，括號內又寫「3 (16%) above 13.18」（L965–967）；3 ÷ 18 = 16.7%。
6. 正文點名 PLT 較好的題號（Q2、23、3、12、24、14、8、10、13、26、15）數起來是 11 題，37% × 27 約等於 10 題。可能其中一題的差距沒到 .1 的門檻，原文沒有說明，我不確定。

## 與清單「要撐的結論」不合的地方

清單寫：「**不顯著**：先學讀再學寫的教材，摘要寫進步高 60%，組間差異沒達顯著」。

- 「摘要寫進步高 60%、組間差異沒達顯著」：撐得住。learning gain d = .398，p<.41（t 檢定 p<.24）；FT 與 LCL 兩個衍生指標也都沒過 .05（表中第 4–6 列）。
- 要補的三點：
  1. **兩組前測就不相等**（CC 高 1.65 分），後測幾乎相同。只寫「進步高 60% 但不顯著」會漏掉「起點不同」這個更直接的問題。
  2. **比的不是「先學讀再學寫」對「先學寫」的課程順序。** 實驗是開學初一天、4.33 小時、JavaScript 的追蹤教學（不寫程式）對 Codecademy 的寫程式教學；之後兩組修的是同一門以寫為主的 Java CS1。寫成「先學讀再學寫的教材」要說清楚「讀」的部分只有這 4 小時多。
  3. **寫程式這一端的結果是期中考平均沒有差別**（76.11 對 77.28，原文只說不顯著）。作者強調的是 PLT 組沒人不及格、分數較集中，以及當天的進步能預測期中考（只在 PLT 組）。這幾項都是事後觀察，樣本各 18、19 人。
- 另外可用：兩組在約 4 小時內都進步到接近修完 CS1 的學生的 SCS1 平均，作者自己列了三個解釋（真的學會、樣本偏向動機高的人、重測灌水），沒有下結論（L961–964）。

## 讀取紀錄

| 順序 | `.txt` 行號 | 內容 |
|---|---|---|
| 1 | L1–700 | 首頁、摘要、第 1 節前言、第 2 節相關研究、第 3 節追蹤知識的理論（含 Table 1）、第 4 節教學法與 PLTutor（4.1、4.2、4.3）、第 5 節評估（5.1 方法、5.2 結果前半）、Figure 4 的數字開頭 |
| 2 | L700–1356 | Figure 4 其餘數字、Figure 5 圖說、5.2 結果後半（訪談、期中考模型）、第 6 節效度威脅、第 7 節討論、致謝；L1065–1353 是參考文獻（91 筆，掃過） |
| 對版面 | PDF 第 1 頁 | 作者姓名、單位、DOI、「Most up-to-date version: 06/25/2021」 |
| 對版面 | PDF 第 6–8 頁（論文頁 47–49） | 5.1、5.2 全文依欄序重讀；Figure 4 八欄 × 六列的平均與 SD 逐格讀；Figure 5；第 6、7 節 |

Table 1（直譯器三階段的虛擬碼）與 Figure 1–3 是系統說明，沒有實驗數字，只讀了 `.txt` 與圖說，沒有逐格對版面。原文沒有附錄。Figure 5 是長條圖，沒有印數字，逐題的 LCL 數值無法抽取。
