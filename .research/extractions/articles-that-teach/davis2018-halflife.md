# 抽取紀錄：Davis、Kizilcec、Hauff、Houben 2018，The Half-Life of MOOC Knowledge（LAK '18）

- **書目**：Dan Davis、René F. Kizilcec、Claudia Hauff、Geert-Jan Houben（作者全名對 PDF 首頁與 Crossref 核過）。2018。The Half-Life of MOOC Knowledge: A Randomized Trial Evaluating Knowledge Retention and Retrieval Practice in MOOCs。Proceedings of the 8th International Conference on Learning Analytics and Knowledge（LAK '18），Sydney，2018-03-07 至 09，共 10 頁。doi 10.1145/3170358.3170383。會議論文集內的實際頁碼檔內沒有（Crossref 只登「1-10」），不確定。
- **原文檔**：`.research/raw/learning-content/q4-time/davis2018-halflife-mooc.txt`，736 行、83,288 字元（83,675 位元組）。來源網址在檔頭：`https://dan7davis.github.io/papers/LAK18_Half_Life.pdf`（第一作者個人頁）。
- **版本**：作者個人頁上的 ACM 排版版（頁首頁尾與 ACM 版權聲明俱全，10 頁），不是付費牆抓來的。
- **讀取日期**：2026-10-14
- **版面處理**：原文檔是 `pdftotext -layout` 的雙欄輸出，左右欄同列並排，圖的座標數字夾在正文裡。我把同一份 PDF 重抓到 scratch（`…/scratchpad/d17b/lak18.pdf`），第 4、5、6、8、9、10 頁直接看 PDF 頁面；Table 1、2、3 與 Figure 8、10、11、12 的數字都對過版面。下面行號是原文檔行號（因為雙欄並排，同一行號區間含左右兩欄）。
- **供哪幾篇用**：order 17（把複習做進文章）、order 19（為什麼多數人讀不完）。
- **注意**：同一資料夾另有 `davis2018-jla-retrieval-mooc.txt`（Journal of Learning Analytics 5(3), 21–41 的擴充版，`q3-activity/davis2018.pdf` 也是那一篇），不是這一篇，本批沒有讀。

## 研究設計

- **類型**：單一 MOOC 內的隨機對照實驗，事後改以「鼓勵設計」（encouragement design）分析；另有大量探索性的描述分析與一份課後問卷。有預先註冊（osf.io/4py2h），但分析方法事後調整（見限制）。
- **課程**：edX 上的 *Geoscience: the Earth and its Resources*（GeoscienceX），2017-05-23 至 2017-07-26，六個課程週，56 支講課影片、217 題計分測驗題（L175–181）。
- **受試者**：2,324 人註冊；研究樣本定義為至少進入課程一次的 1,047 人，對照組 524、實驗組 523（L259–265）。有自報人口資料的 1,962 人中，35% 女性、年齡中位數 27；學歷 24% 至少高中、7% 副學士、42% 學士、24% 碩士、3% 博士（L191–255）。除證書外沒有任何參與誘因（L255–257）。
- **介入（實驗組）**：Adaptive Retrieval Practice System（ARPS）。在第 2–6 週的 49 支講課影片**之前**，各彈出一張 qCard（瀏覽器內的彈出視窗），題目從學習者已經接觸過的先前週次題庫隨機抽；影片頁底另有按鈕可再要一題（L214–224）。題庫是課程 217 題裡適合單獨作答的 132 題：112 題選擇題、20 題數值輸入題（L183–189）。選擇題答對顯示打勾並消失，答錯顯示叉號 4 秒後回到原題重答（L154–161）。qCard 不計分，右上角灰色 x 可直接關掉。實驗組也拿到與對照組相同的每週讀書方法說明。
- **對照組**：不是「什麼都沒有」。每週導言加一頁「有效讀書習慣」說明，解釋提取練習的好處並給一個做法範例（L210–213；Figure 4）。所以這個實驗比的是「推送題目＋建議」對「只有建議」。
- **量了什麼**（L241–266）：主要結果變項三個——期末成績（0–100）、是否通過（及格線 60%，L336）、課後測驗分數（0–10）。另有影片互動、測驗提交、論壇發文、在課時間、qCard 互動紀錄。
- **何時量**：課內指標在課程期間；課後問卷在課程結束**兩週後**寄出，內含從六次週測驗隨機抽的 10 題（L225–229、L621–625）。
- **課後問卷寄給誰**：實驗組寄給「曾與 ARPS 互動」的 102 人，回 9 份（8.8%）；對照組寄給「期末成績最高」的 150 人，回 11 份（7.3%）（L267–275）。兩組的抽樣條件不同，而且 4.2 節另寫成「the most active learners in the course (in terms of time spent in the platform)」（L226–227），兩處說法不一致。

## 結果（逐項）

### 5.1 因果分析（Table 1，L278–292，已對 PDF 第 5 頁）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | 順從率 | 523 人中只有 102 人至少與 qCard 互動一次（19.5%，百分比是我算的；未互動 421 人，80.5%） | 實驗組內部 | 5.1，L327–330 | 「of the 523 learners assigned to the treatment, only 102 interacted at least once with a qCard (i.e. complied with the treatment).」 |
| 2 | 各組成績（Table 1） | 對照組全體 N=524：非零成績 31%、通過率 8%、成績四分位 [0, 0, 2]；實驗組全體 N=523：34%、7%、[0, 0, 2]；實驗組順從者 N=102：76%、34%、[2, 19, 74]；未順從者 N=421：23%、0.2%、[0, 0, 0] | — | Table 1，L285–292 | 表列 |
| 3 | ITT：通過 | log odds ratio = −0.215，z = −0.920，p = 0.357（不顯著，方向為負） | 實驗組全體 vs 對照組全體 | 5.1，L340–343 | 「We find that the ITT is not significant for certification (log odds ratio= −0.215, z = −0.920, p = 0.357)」 |
| 4 | ITT：拿到非零成績 | logOR = 0.143，z = 1.08，p = 0.280（不顯著） | 同上 | L343–344 | 「getting a non-zero grade (logOR= 0.143, z = 1.08, p = 0.280)」 |
| 5 | ITT：連續成績 | Kruskal-Wallis χ²(df=1) = 0.592，p = 0.442（不顯著） | 同上 | L344–345 | 「and the continuous grade itself (Kruskal-Wallis χ2 df=1 = 0.592, p = 0.442).」 |
| 6 | LATE（工具變數、兩階段最小平方） | 通過 β = −0.078，z = −0.893，p = 0.371；非零成績 β = 0.160，z = 1.11，p = 0.267；連續成績 β = −0.066，z = −0.889，p = 0.374（都不顯著） | 順從者的局部平均處理效果 | L287–291 | 「The LATE is not significant either for certification (β IV = −0.078, z = −0.893, p = 0.371), getting a non-zero grade (β IV = 0.160, z = 1.11, p = 0.267), and the continuous grade itself (β IV = −0.066, z = −0.889, p = 0.374).」 |
| 7 | Per-protocol（作者明說沒有因果解讀） | 通過 logOR = 1.74，z = 6.66，p < 0.001；非零成績 logOR = 2.00，z = 7.94，p < 0.001；連續成績 χ² = 99，p < 0.001 | 實驗組順從者 102 人 vs 對照組全體 | L293–306 | 「However, the per-protocol estimates do not have a causal interpretation because different subpopulations are compared」 |
| 8 | 順從與成績的相關 | Spearman r = 0.56，p < 0.001 | 實驗組內 | L306–310 | 「treatment compliance is strongly correlated with receiving a higher grade (Spearman's r = 0.56, p < 0.001).」 |
| 9 | 自我調節行為（回看舊內容、看進度頁、堅持更久） | ITT：各項 Kruskal-Wallis χ² < 0.68、p > 0.41；LATE：|z| < 0.98、p > 0.32（都無效果） | 實驗組 vs 對照組 | L312–325 | 「No evidence in support of the hypothesized behavior was found」 |
| 10 | 作答 qCard 的比率與一般測驗成績的相關 | Spearman r = 0.42，p < 0.001 | 實驗組內 | L325–329 | 「learners who attempt qCards at a higher rate would learn more and score higher on regular course assessments, which is supported by the data (Spearman's r = 0.42, p < 0.001).」作者隨後說這可能是自我選擇（L340–344）。 |
| 11 | 5.1 結論框 | — | — | L333–335 | 「The causal analysis yields no evidence that ARPS raised learning, performance, or self-regulatory outcomes in this course.」 |
| 12 | 作者對無效果的解釋 | — | — | L337–338 | 「This may be due to the low sample size or rate of compliance in this study.」 |

### Table 2（L358–365，已對 PDF 第 6 頁；全部是兩組各自的平均值，原文沒有對這張表逐項做檢定）

| 組 | N | 期末成績 | 通過率 | 影片互動 | 測驗提交 | 論壇發文 | 在課時間 | 與 qCard 相處時間 | 看到的 qCard 數 |
|---|---|---|---|---|---|---|---|---|---|
| Control | 524 | 9 | 8% | 6.52 | 34.77 | 0.26 | 4h47m | – | – |
| Treatment | 523 | 8 | 7% | 5.83 | 30.88 | 0.29 | 3h40m | 23m9s | 7.71 |

實驗組在課時間、影片互動、測驗提交的平均值都比對照組低，原文沒有討論這一點，也沒有報告這些差異的檢定（只有 #9 那句總括的「無證據」）。

### 5.2 與提取題的互動（探索性，只看實驗組）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 13 | 互動隨課程推進下滑 | 沒有數字，依 Figure 5 的描述 | 通過者與未通過者皆然 | 5.2.1，L370–375 | 「it shows a steady decrease in learner engagement over time, not only among non-passing learners, but also among those who earned a certificate. … even the highest-achieving learners show a tendency of slowing down after the first week or two」 |
| 14 | 作答 vs 忽略（Table 3 左） | 未通過者：作答 0.47、忽略 0.53；通過者：作答 0.73、忽略 0.27；差異 p < 0.001（†） | 通過 vs 未通過 | Table 3，L390–397 | 表列 |
| 15 | 作答者的對錯（Table 3 右） | 未通過者：對 0.76、錯 0.24；通過者：對 0.82、錯 0.18；差 6%，χ² = 9.63，p = 0.002 | 通過 vs 未通過，只算有作答的 | L380–384 | 「we observe a significant albeit small difference (6% difference, χ2 = 9.63, p = 0.002)」 |
| 16 | 第一張 qCard 的反應與通過率（Figure 8 左） | 有作答者 47% 通過；忽略者 14% 通過 | 第一張作答 vs 忽略 | 5.2.2，L404–407 | 「Learners who attempted rather than ignored the first qCard had a 47% chance of passing the course. In contrast, learners who ignored the first qCard delivered to them only had a 14% chance of passing.」 |
| 17 | 第一張答錯者 | 33% 通過（人數很少）；Figure 8 右：答對者 48% 通過 | — | L409–412 | 「There were notably few learners who responded incorrectly, but their chance of passing the course was still relatively high at 33%」 |
| 18 | 前兩張都答對 | 53% 通過；加看第二張沒有增加預測力 | — | L413–416、L370–372 | 「learners who answered their first two consecutive qCards correctly had a 53% chance of earning a passing grade.」 |
| 19 | 忽略的速度 | 忽略的中位時間 7 秒；答對 18 秒、答錯 16 秒，作答時間與對錯無關 | — | 5.2.3，L380–386 | 「the decision to ignore the qCard happened quickly, with a median duration of 7 seconds」 |
| 20 | 5.2 結論框 | — | — | L390–393 | 「There is no significant difference in assessed knowledge between passing and non-passing learners; the key difference lies in a learner's willingness to engage with the retrieval practice questions.」 |
| 21 | 題型（Figure 12，在 5.5 節報告） | 選擇題作答率 69%（對 57%、忽略 31%、錯 12%）；數值輸入題作答率 41%（對 24%、忽略 59%、錯 17%）；χ² 檢定 p < 0.001 | 選擇題 vs 數值輸入題 | L622–625、Figure 12 | 「there was a 69% likelihood of learners attempting a MC qCard problem type compared to 41% attempt rate for NI problems.」 |
| 22 | 只有一人用「再來一題」按鈕 | 通過者中只有一位常用 | — | Figure 6 圖說，L503–505 | 「Only one learner took advantage of the "infinite quizzing" capability by frequently using the "Generate new qCard" button.」 |

### 5.3 知識隨時間的變化（探索性，只看實驗組的 qCard 作答）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 23 | 通過者：答對率（分母含忽略） | 第 2 週 67% → 第 6 週 49%，χ² = 32.8，p < 0.001 | 課程週次 | L411–416 | 「correct response rate dropping from 67% to 49% respectively; χ2 = 32.8, p < 0.001」 |
| 24 | 通過者：答錯率 | 4% → 25%，χ² = 87.8，p < 0.001；忽略率「steadily low」 | 同上 | L414–416、L483–484 | 「rate of incorrect responses increased from 4% to 25%」 |
| 25 | 未通過者：答對率下降 | χ² = 15.7，p < 0.001；答錯率無顯著變化 | 同上 | L489–494 | 「there is no significant change for non-passing learners」 |
| 26 | 未通過者：忽略率 | 第 2 週 47% → 第 6 週 61% | 同上 | L494–496 | 「The change, instead, is in the rate of ignored responses, increases from 47% in Week 2 to 61% in Week 6.」 |
| 27 | 作者列的兩個原因 | 每週受測內容變多；時間過去就忘 | — | L498–504 | 「First, the amount of assessed content increases each week … Second, people simply forget more with the passing of time」 |
| 28 | 測驗延遲（題目來源週與目前週的差距），通過者 | 隔 1 週答對 65% → 隔 5 週 42%，χ² = 23.6，p < 0.001；答錯 8% → 21%，χ² = 17.5，p < 0.001；忽略率增加不顯著 | 延遲週數 | L581–586 | 「For passing learners there is a 23% drop in correct response rates from 1 Week Elapsed to 5 Weeks Elapsed (65% to 42%…)」 |
| 29 | 測驗延遲，未通過者 | 忽略率 50% → 72%，χ² = 4.9，p = 0.025 | 延遲週數 | L586–588 | 「ignored questions increased by 22% from 50% to 72% (χ2 = 4.9, p = 0.025)」 |
| 30 | 隔 1 週、只算有作答的 | 通過者答對 88%；未通過者 79% | — | L544–554 | 「considering problems that were attempted with 1 Week Elapsed, passing learners answer 88% of problems correctly. Non-passing learners also show good performance with 79% correct」 |

### 5.4 長期保留（課後兩週）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 31 | 課後 10 題測驗 | 對照組 6.2（SD 1.9）、實驗組 6.6（SD 1.8），N = 20，t(17.6) = −0.45，p = 0.66（不顯著） | 對照組回卷者 11 人 vs 實驗組「至少互動一次」的回卷者 9 人 | L627–632 | 「The mean score for learners in the control and treatment conditions was 6.2 (SD = 1.9) and 6.6 (SD = 1.8), respectively, out of a possible 10 points (N = 20, t (17.6) = −0.45, p = 0.66).」 |
| 32 | 5.4 結論框 | 「約三分之二」 | — | L638–639 | 「Approximately two thirds of course knowledge is retained over the long-term.」 |

### 5.5 使用經驗

| # | 結果 | 數字 | 位置 | 原文 |
|---|---|---|---|---|
| 33 | SUS 易用性分數 | 73.9（SD 12.2），歸類「acceptable usability」、C 級 | L641–649 | 「a cumulative usability score of 73.9 (SD = 12.2) on the SUS scale」（填答者是實驗組回卷的 9 人，原文在這裡沒有重寫人數） |
| 34 | 開放題回饋 | 一位學習者嫌計算題麻煩，希望只出觀念題；另有人說系統提醒了漏掉的內容 | L599–613 | 「it's troublesome if calculation is required」「the chance to see what I remembered and what I had learned.」 |

## 作者自己列的限制

- 順從率低是主要限制，限制了因果推論（L687–692：「We found noncompliance to be a major limitation in our evaluation of the system and its effectiveness. Many learners did not engage with the intervention, which limits our ability to draw causal inferences」）。
- 樣本小（L337–338）。
- qCard 可能本身是干擾、讓人更想離開（L694–696：「the qCards could potentially act as a distraction and make a learner more inclined to disengage」）。
- 測驗題可能量不準學習，這會威脅「提取練習沒有改善學習」這個說法的效度（L696–702）。
- 偏離預註冊：因樣本小與順從率低而改變分析方式，並且沒有套用原訂的樣本排除條件（註 3，L351–355）。
- 順從者的好表現可能是自我選擇（L340–344）。
- 結語仍主張提取練習值得在線上情境繼續研究，關鍵是設計出互動率高的介面（L720–728）。

## 與摘要說法不一致的地方

1. **「通過者與未通過者保留相近」在 5.4 節沒有對應資料**。摘要說「passing learners engaged more with ARPS but exhibited similar levels of knowledge retention as non-passing learners」，導言貢獻 (iii) 說兩者「do not differ in long-term knowledge retention (RQ3)」（L84–85），5.4 的敘述也寫「regardless of … whether or not a learner passed the course」（L634–636）。但 5.4 只報告了兩個實驗條件的比較（6.2 對 6.6），沒有任何依通過與否分組的數字。能對應的只有 5.2 的 qCard 答對率（0.82 對 0.76），那是課內作答，不是課後保留。
2. **5.2 結論框與自己的統計量相反**。結論框寫通過與未通過者的受測知識「no significant difference」（L390–391），但同節報告的差異是顯著的（6%，χ² = 9.63，p = 0.002，L382–383）。作者的意思是差異小，但字面上不成立。
3. **5.4 寫用 χ² 檢定，報的卻是 t 值**（L627 對 L632）。
4. **「三分之二」沒有基準**。6.2／10 與 6.6／10 來自 20 位自願回卷者（回卷率 8.8% 與 7.3%），而且對照組只寄給成績最高的 150 人。原文沒有這些人課內原本答對幾成，所以算不出「保留了多少」；H3 是照 Custers 的文獻數字預設的，結論框等於把課後得分直接讀成保留率。
5. **H1（推送式比靜態式引出更多提取練習）沒有被檢驗**。對照組沒有任何提取練習的量測，結果章也沒有回頭談 H1。
6. **問卷寄送對象兩處寫法不同**（L226–227「most active … time spent」對 L267–275「engaged with ARPS／highest performing … final grade」）。
7. 導言寫「more than 500 learners assigned to either a treatment (ARPS) or a control group」（L56–58），實際是每組約 520 人、合計 1,047 人；讀起來容易誤會成總共 500 多人。
8. 相關研究裡對 Duolingo 的描述（「0% probability of remembering after seven days」，引的是 [25] Streeter 2015，L118–131）與 Settles & Meeder 2016 原文對不上（原文沒有這句，見 `settles2016-hlr.md`）；對 Lindsey 2014 的數字（50% 對 60%、遺忘率 18.1% 對 15.7%，L112–116）本批沒有核對原文。這兩處都不要從這篇轉引。

## 與清單「要撐的結論」不合的地方

- **order 17：「把複習題推給線上學習者，八成沒互動，整體無效」**
  - 「八成沒互動」撐得住：523 人中 421 人一次都沒有與 qCard 互動（80.5%，百分比是我從 Table 1 算的，原文只寫「only 102 interacted at least once」）。要注意分母是「至少進入課程一次」的人，不是註冊的 2,324 人；「互動」的定義是至少一次，門檻很低。
  - 「整體無效」撐得住，但要寫完整：ITT 與 LATE 在通過率、非零成績、連續成績上都不顯著。三個要帶著寫的條件：(a) 對照組不是空白，每週也拿到提取練習的建議；(b) 作者自己把無效歸因於樣本小與順從率低，並說這限制了因果推論，不是主張提取練習在 MOOC 無效；(c) 這是單一課程、單一梯次。
  - 另外兩個清單沒寫但文章可能想用的點：送出的題卡裡，選擇題有 69% 被作答、數值輸入題只有 41%；忽略一張題卡的中位時間是 7 秒。
- **order 19：「每週的互動率下滑；兩週後的保留測驗只有 20 人」**
  - 「只有 20 人」撐得住（9＋11）。要補：兩組的寄送條件不同，回卷率 8.8% 與 7.3%。
  - 「每週的互動率下滑」要改寫。原文有數字的是**未通過者**的忽略率從第 2 週 47% 升到第 6 週 61%；通過者的忽略率是「remains steadily low」，沒有上升。「連通過者也在第一、二週後放慢」那句（L370–375）講的是 Figure 5 裡被送到題目的人數逐題變少，沒有給數字。所以不能寫成「每個人的互動率每週下滑」。

## 讀取紀錄

依序讀過原文檔 L1–736 全部（一次讀完）：L1–63（題名、作者、摘要、導言前半）、L64–122（導言後半、2 相關研究）、L123–201（2.3 尾、假設、3 系統、4.1 前半）、L202–275（4.1 後半、4.2、4.3）、L276–355（Table 1、5.1、註 3）、L356–416（Table 2、5.2、Table 3、5.3 開頭）、L417–507（Figure 5–6、5.3）、L508–589（Figure 7–10、5.3 後半）、L590–652（Figure 11、5.4、5.5、6 結論開頭）、L653–736（Figure 12、結論、限制、參考文獻；參考文獻只掃過）。

對過 PDF 版面的：Table 1（第 5 頁）、Table 2 與 Table 3（第 6 頁）、Figure 8、9、10（第 8 頁）、Figure 11 與 5.4、5.5（第 9 頁）、Figure 12 與結論（第 10 頁）；第 4 頁（4.2、4.3）也看過版面。PDF 第 1–3、7 頁沒有另外看版面，只讀文字檔（那幾頁沒有表）。
