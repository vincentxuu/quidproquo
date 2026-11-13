# 抽取紀錄：Davis、Kizilcec、Hauff、Houben 2018，Journal of Learning Analytics（doi 10.18608/jla.2018.53.3）

**書目**：Dan Davis、René F. Kizilcec、Claudia Hauff、Geert-Jan Houben（四位，首頁核過；Davis、Hauff、Houben 屬 TU Delft EEMCS Web Information Systems，Kizilcec 屬 Cornell University）。2018。Scaling Effective Learning Strategies: Retrieval Practice and Long-Term Knowledge Retention in MOOCs。*Journal of Learning Analytics*，5(3)，21–41。DOI 10.18608/jla.2018.53.3。投稿 2018-06-01、接受 2018-07-21、刊出 2018-12-11。
**原文檔**：`.research/raw/learning-content/q3-activity/davis2018.txt`（1,639 行、82,984 字元／83,524 位元組）與同名 `.pdf`（21 頁，期刊頁碼 21–41）。
**讀取日期**：2026-10-14
**版本**：刊出版（期刊排版，CC BY-NC-ND 3.0，開放取用）。
**供哪幾篇 order 使用**：order 10（10-b）；批次表註明與 order 17、19 共用。
**文字檔狀況**：`.txt` 是單欄、不帶 `-layout` 的轉檔，正文可順讀；表格被拆成一行一格，圖裡的刻度與標籤混在正文中。Table 1–3 另用 `pdftotext -layout` 重抽後逐列對過；Figure 4、5、6、9、16 直接看 PDF 頁面。行號一律是 `.txt` 的行號。

## 研究設計

- **類型**：單一 MOOC 內的隨機對照試驗，**有預先註冊**（註腳 7：https://osf.io/4py2h/，L352）。確認性分析之外還有一串探索性分析（作者自己標示，L535–536、L538）。
- **課程**：edX 上的 *Geoscience: The Earth and its Resources*（GeoscienceX），2017-05-23 到 2017-07-26（L317–318）。56 支講課影片、217 題計分測驗題；其中 132 題被人工挑出可放進 qCard（多步驟題排除），112 題選擇題（MC）、20 題數值輸入題（NI）（L318–320）。
- **受試者**：註冊 2,324 人。研究樣本定義為**至少進入課程一次的 1,047 人**：對照 524、實驗 523（L325–326）。依 edX 數字 ID 取餘數分派（L326–327）。有人口資料的 1,962 人中 35% 是女性、年齡中位數 27；學歷：至少高中 24%、副學士 7%、學士 42%、碩士 24%、博士 3%（L321–323）。除了課程證書沒有其他誘因（L323–324）。
- **兩個條件**（L333–345）：
  - **對照組**：每週導言加一課「有效的學習習慣」，說明提取練習的好處與做法（Figure 5）。
  - **實驗組**：同一課，**外加** ARPS（Adaptive Retrieval Practice System）。另外告知 qCard 的作答不計入成績。
  - 所以比較的是「說明＋自動跳出的題目」對「只有說明」，不是對「什麼都沒有」。
- **qCard 是什麼**（L225–271；Figure 4）：
  - 在每一支講課影片頁面上（第 2–6 週的 49 支影片之前）**自動跳出**的視窗，蓋在影片上（L236–237「These qCards appear to the learner as a pop-up within the browser tab」；L343–344）。
  - 題目從學習者**已經看過的先前單元**的題庫裡隨機抽（L235–236），所以不是剛看完的內容，而是前幾週的題目。
  - 作者把它稱為 push 式設計，與要學習者自己按按鈕去找題目的做法相對（L260–265），目的是降低不遵從。
  - 選擇題只要點一下：答對顯示鼓勵文字後消失；答錯顯示提示 4 秒後回到原題重答，**不告知正確答案**（L265–271）。
  - 右上角有灰色「x」可以不作答直接關掉（L271；Figure 4 圖說）。
  - 影片頁下方有按鈕可以再要一張 qCard（L344–345）。
- **量了什麼**（L359–379）：最終成績（0–100）、是否通過（門檻 60%，L457–458）、影片互動、測驗提交數、論壇發文、課程內時間；qCard 的顯示時間、作答與對錯、作答或關閉；課後問卷的測驗分數、學習意圖、學歷。作者列的三個主要結果變項是最終成績、是否通過、課後測驗分數（L376–379）。
- **何時量**：課程期間的紀錄檔；課程結束**兩週後**寄問卷，內含從六次週測驗裡隨機抽的 10 題（L347–351、L1380–1382）。
- **問卷取樣**：寄給**全部 102 位在 ARPS 裡作答過的人**（9 人填答，8.8%）與**對照組最終成績最高的 150 人**（11 人填答，7.3%）（L328–331）。

## 結果（逐項）

### Table 1（期刊頁 28；`.txt` L386–444；對過版面）兩組的平均值

| 組別 | N | 最終成績 | 通過率 | 影片互動數 | 測驗提交數 | 論壇發文 | 課程內時間 | qCard 時間 | 看到的 qCard 數 |
|---|---|---|---|---|---|---|---|---|---|
| 對照 | 524 | 9% | 8% | 6.52 | 34.77 | 0.26 | 4h47m | – | – |
| 實驗 | 523 | 8% | 7% | 5.83 | 30.88 | 0.29 | 3h40m | 23m9s | 7.71 |

表註：「The differences observed between the control and treatment groups are not statistically significant.」（L442–444）；檢定是比例檢定與 Kruskal-Wallis，「all p > 0.05」（L448–450）。

### 5.1 確認性分析（RQ1）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 遵從率 | 實驗組 523 人裡只有 102 人至少與一張 qCard 互動過一次 | — | L450–452 | 「of the 523 learners assigned to the treatment, only 102 interacted at least once with a qCard (i.e., complied with the treatment).」 |
| 2 | 偏離預先註冊 | 因樣本小、遵從率低而改了分析做法；沒有套用預先註冊的樣本排除條件 | — | L453–456 | 「Due to the small sample size and low compliance rate, however, we adjusted our analytic approach. … we do not apply the pre-registered sample exclusion criteria because they could inadvertently bias the causal inference.」 |
| 3 | ITT：取得證書 | log odds ratio = −0.215，z = −0.920，p = 0.357（不顯著） | 實驗組全體 vs 對照組全體 | L459–462 | 「We find that the ITT is not significant for certification」 |
| 4 | ITT：成績非零 | logOR = 0.143，z = 1.08，p = 0.280（不顯著） | 同上 | L461 | 同段 |
| 5 | ITT：連續成績 | Kruskal-Wallis χ²(df=1) = 0.592，p = 0.442（不顯著） | 同上 | L462 | 同段 |
| 6 | LATE（工具變項，兩階段最小平方）：取得證書 | βIV = −0.078，z = −0.893，p = 0.371（不顯著） | 以分派當工具變項估計實際使用者的效果 | L468–477 | 「The LATE is not significant for certification」 |
| 7 | LATE：成績非零 | βIV = 0.160，z = 1.11，p = 0.267（不顯著） | 同上 | L476–477 | 同段 |
| 8 | LATE：連續成績 | βIV = −0.066，z = −0.889，p = 0.374（不顯著） | 同上 | L477 | 同段 |
| 9 | Per-protocol：取得證書 | logOR = 1.74，z = 6.66，p < 0.001 | 實驗組遵從者 vs 對照組全體 | L478–482 | 「We find large differences」 |
| 10 | Per-protocol：成績非零 | logOR = 2.00，z = 7.94，p < 0.001 | 同上 | L481 | 同段 |
| 11 | Per-protocol：連續成績 | Kruskal-Wallis χ²(df=1) = 99，p < 0.001 | 同上 | L481–482 | 同段 |
| 12 | 作者對 9–11 的判定 | **不是因果估計**，是自我選擇 | — | L482–484 | 「However, the per-protocol analysis does not yield causal estimates due to self-selection bias; in particular, we compare everyone in the control group with those highly motivated learners who comply in the treatment group.」 |
| 13 | 遵從與成績的相關 | Spearman's r = 0.56，p < 0.001 | 實驗組內 | L484 | 「treatment compliance is strongly correlated with receiving a higher grade」 |
| 14 | 過程指標（回看先前內容、看進度頁、持續較久） | ITT：Kruskal-Wallis χ² 值 < 0.68、p 值 > 0.41；LATE：\|z\| < 0.98、p > 0.32（全部不顯著） | 同 ITT、LATE | L523–526 | 「No evidence in support of the hypothesized behaviour was found」 |
| 15 | 實驗組內：qCard 作答率與一般課程評量分數 | Spearman's r = 0.42，p < 0.001 | 實驗組內相關 | L526–528 | 「learners who attempt qCards at a higher rate would learn more and score higher on regular course assessments, which is supported by the data」 |
| 16 | 作者對 15 的保留 | 可能是自我選擇 | — | L533–534 | 「though this pattern could be due to selfselection (e.g., more committed learners both attempt more qCards and put more effort into assessments)」 |
| 17 | 總結句（原文加框） | — | — | L531–532 | 「A causal analysis yields no evidence that encouraging retrieval practice raised learning, performance, or selfregulatory outcomes in this course.」 |

### Table 2（期刊頁 29；`.txt` L485–522；對過版面）

| 條件 | 子集 | N | 成績非零 | 通過率 | 成績四分位 |
|---|---|---|---|---|---|
| 對照 | 全體 | 524 | 31% | 8% | [0, 0, 2] |
| 實驗 | 全體 | 523 | 34% | 7% | [0, 0, 2] |
| 實驗 | 遵從者 | 102 | 76% | 34% | [2, 19, 74] |
| 實驗 | 不遵從者 | 421 | 23% | 0.2% | [0, 0, 0] |

兩組都是**七成左右的人成績為零**、成績中位數為 0。不遵從的 421 人裡 77% 成績為零、通過率 0.2%。

### 5.2 qCard 之後的瀏覽行為（探索性）

| # | 結果 | 數字 | 對照 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 18 | 看到 qCard 之後往回瀏覽的比例 | 兩組都是 8–10%；差異 χ² = 1.5，p = 0.22（不顯著） | 實驗組內遵從者 vs 不遵從者 | L546–554 | 「This indicates that qCards did not have a significant effect on learners' navigation and did not motivate them to revisit previous course topics to retrieve relevant information.」 |

### 5.3 誰會碰 qCard（探索性）

| # | 結果 | 數字 | 對照 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 19 | 學歷 | 學歷越高越可能遵從（Figure 6，只有圖：各學歷層的遵從比例從國中約 0.02 到碩士、博士約 0.045；分母是該學歷的「all learners」，原文沒說是 2,324、1,962 還是 523） | 各學歷層 | L565–567 | 「learners with a higher level of education are more likely to interact with ARPS」 |
| 20 | 年齡 | 遵從者平均 38 歲、不遵從者 32 歲；p = 0.003，t 值絕對值 2.99（版面上負號位置跑掉） | 遵從者 vs 不遵從者 | L567–569 | 「The average complier is 38 while the average non-complier is only 32 years old」 |
| 21 | 國家發展程度 | 遵從者來自 HDI 較高的國家，控制學歷後仍是；ANCOVA F = 4.93，p = 0.027 | 同上 | L570–572 | 「compliers came from significantly more developed countries (higher HDI) than non-compliers, even when adjusting for prior education levels」 |
| 22 | 作答或略過（**以 qCard 互動為單位**，Table 3 左） | 未通過者：作答 47%、略過 53%；通過者：作答 73%、略過 27%；兩欄 p < 0.001 | 通過者 vs 未通過者 | L730–753 | 表註「Significant differences (p < 0.001) between passing and non-passing learners in each column are indicated with †.」 |
| 23 | 作答後對錯（Table 3 右，只算有作答的） | 未通過者：對 76%、錯 24%；通過者：對 82%、錯 18%；差 6 個百分點，χ² = 9.63，p = 0.002 | 同上 | L670–672 | 「we observe a significant albeit small difference (6 percentage points, χ2 = 9.63, p = 0.002)」 |
| 24 | 隨課程進行，參與下降 | 通過者與未通過者都下降（Figure 7，只有圖） | — | L607–610 | 「it shows a steady decrease in learner engagement over time, not only among non-passing learners, but also among those who earned a certificate.」 |
| 25 | 「再來一題」按鈕 | **只有一位**學習者用，答了三百多題 | — | L674–678；Figure 8 圖說 | 「This is the only learner who took advantage of the ARPS functionality that allowed learners to continue answering qCard questions」 |
| 26 | 第一張 qCard 的反應與通過率（Figure 9a） | 有作答者 47% 通過；略過者 14% 通過 | 第一張作答 vs 略過 | L757–759 | 「Learners who attempted the first qCard instead of ignoring it had a 47% chance of passing the course. In contrast, learners who ignored their first qCard only had a 14% chance of passing.」 |
| 27 | 第一張的對錯（Figure 9b） | 答對者 48% 通過（圖上標 48%／52%）；答錯者 33% 通過（人數很少）；略過 14% | — | L759–765 | 「There were notably few learners who responded incorrectly, but their chance of passing the course was still relatively high at 33%」 |
| 28 | 前兩張都答對 | 53% 通過；作者說沒有增加預測力 | — | L766–769 | 「No difference in predictive power was observed」 |
| 29 | 反應時間 | 略過的中位數 7 秒；答對 18 秒、答錯 16 秒 | — | L775–778 | 「the decision to ignore the qCard happened quickly, with a median duration of 7 seconds」 |
| 30 | 題型（Figure 16；正文在 5.5） | 選擇題：對 57%、錯 12%、略過 31%（共約 3,300 次）；數值輸入題：對 24%、錯 17%、略過 59%（共約 750 次）。正文：選擇題 69% 會作答、數值題 41%，p < 0.001 | 題型之間（非隨機分派，題目不同） | L1419–1425；Figure 16 | 「We found a 69% likelihood of learners attempting a MC qCard problem type compared to 41% attempting NI problems (p < 0.001).」 |

Figure 9a 的長條高度（我從圖上讀的，約略值）：第一張略過約 43 人、作答約 62 人，合計約 105 人。原文沒有給這兩個人數。

### 5.4 知識隨時間的變化（探索性，以 qCard 作答為資料）

| # | 結果 | 數字 | 行號 |
|---|---|---|---|
| 31 | 通過者，第 2 週到第 6 週 | 答對率 67% → 49%（χ² = 32.8，p < 0.001）；答錯率 4% → 25%（χ² = 87.8，p < 0.001）；略過率維持低 | L874–884 |
| 32 | 未通過者，第 2 週到第 6 週 | 答對率顯著下降（χ² = 15.7，p < 0.001）；答錯率無顯著變化；略過率 47% → 61% | L885–893 |
| 33 | 作者列的兩個原因 | 每週要考的內容變多；時間經過 | L950–954 |
| 34 | 通過者，測驗延遲 1 週到 5 週 | 答對率 65% → 42%（χ² = 23.6，p < 0.001）；答錯率 8% → 21%（χ² = 17.5，p < 0.001）；略過率上升不顯著 | L960–963 |
| 35 | 未通過者，測驗延遲 1 週到 5 週 | 略過率 50% → 72%（χ² = 4.9，p = 0.025） | L963–965 |
| 36 | 延遲 1 週、只算有作答的 | 通過者答對 88%、未通過者 79% | L969–971 |
| 37 | 依原題表現：會不會作答 qCard | 原題答對 73%、原題答錯 61%、原題沒答 34%；彼此顯著不同（χ² > 22，p < 0.0001） | L1046–1050 |
| 38 | 依原題表現：qCard 答對率 | 原題答對 61%、原題答錯 42%、原題沒答 23%（χ² > 40.0，p < 0.0001） | L1121–1123 |
| 39 | 通過者、原題沒答的題目 | 第 2 週答對 79%，第 6 週 7%；第 6 週原題答錯的題目答對 40%，作者算成 5.7 倍 | L1131–1142 |
| 40 | 通過者、原題答對的題目，延遲 1 週到 5 週 | 答對率 68% → 39%（χ² = 21.8，p < 0.0001） | L1368–1376 |
| 41 | 作者對 ARPS 的判定 | 「We expected ARPS to accomplish this, but it was ultimately ineffective at promoting long-term knowledge retention.」 | L973 |

### 課後測驗（RQ4）

| # | 結果 | 數字 | 對照 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 42 | 課程結束兩週後的 10 題測驗 | 對照組平均 6.2（SD = 1.9）、實驗組 6.6（SD = 1.8），滿分 10；**N = 20**，t(17.6) = −0.45，p = 0.66（不顯著） | 實驗組填答者（9 人）vs 對照組填答者（11 人） | L1383–1386 | 「We compare performance on the post-test between the two experimental conditions and found no significant difference」 |
| 43 | 「約三分之二」 | 由上面兩個平均（6.2、6.6／10）而來 | — | L1386–1390 | 「regardless of experimental condition and whether or not a learner passed the course: Approximately two thirds of course knowledge is retained over the long-term.」 |
| 44 | 填答者偏誤 | 填答者課程成績中位數 82%，未填答者 4%；Kruskal-Wallis χ² = 26.7，p < 0.0001 | 填答 vs 未填答 | L1397–1399 | 「We find evidence for survey response bias in terms of course performance.」 |

### 5.5 使用經驗（RQ5）

- SUS 改編版平均 73.9（σ = 12.2），作者歸為「acceptable usability」（L1392–1395）。填答人數沒有另寫；依取樣只有實驗組填答者（9 人）會拿到 ARPS 的題目（L349–350）。
- 開放題的引述：一位學習者說需要計算的題目很麻煩、希望只問觀念題（L1404–1408）；其他人說它幫忙提醒漏掉的內容、複習先前章節（L1409–1414）。

## 作者自己列的限制

導言預告討論節會談「limitations to consider」（L100–101），但**討論節沒有獨立的限制小節**。作者承認的限制散在各處：

1. **不遵從是主要限制**：「we found noncompliance to be a major limitation in our evaluation of the system and its effectiveness. Many learners did not engage with the intervention, which limits our ability to draw causal inferences about the effect of retrieval practice on learner achievement and engagement in the course.」（L1480–1482）
2. 樣本小、遵從率低，因此改了預先註冊的分析做法（L453–456）。
3. Per-protocol 與實驗組內的相關都受自我選擇影響（L482–484、L533–534）。
4. 課後問卷有回應偏誤（L1397–1399）。
5. 可用性還有改進空間，可能影響參與（L1396–1397）。
6. 題型比較無法分辨是「自己產生答案」還是「打字」讓人略過（L1424–1425）。
7. 系統對年輕、學歷較低、來自開發中國家的學習者較少被使用（L573–576、L1440–1441）。

作者**沒有**說的：
- 實驗組裡**實際被顯示過至少一張 qCard 的人數**。qCard 從第 2 週才出現（L343、L871–873），而實驗組 66% 的人成績為零（Table 2），很多人可能根本沒走到會跳出 qCard 的頁面。「102／523」的分母是「進過課程一次」的人，不是「看過 qCard」的人。
- 統計檢定力。兩組通過率只有 7–8%、成績中位數為 0。
- 單一課程、單一期。
- 對照組也被教了提取練習，且沒有量對照組有沒有照做。
- 課後測驗只有 20 人，而且兩組的抽樣方式不同（實驗組抽作答過的人、對照組抽成績最高的 150 人）。
- qCard 答錯不給正確答案，這個設計對結果的可能影響。

## 與摘要說法不一致的地方

1. **摘要：「both passing and non-passing learners scored similarly on a knowledge post-test」（L13–15）；實務重點也寫「Learners who passed the course scored similarly on a knowledge post-test as did learners who didn't pass.」（L28–29）。正文沒有任何「通過者對未通過者」的課後測驗分數。** 正文報告的唯一比較是對照組對實驗組（6.2 對 6.6，N = 20，L1383–1386），「whether or not a learner passed the course」只出現在結論句裡（L1387–1388），沒有數字、沒有人數。而且填答者成績中位數是 82%（L1398），對照組又只抽成績最高的 150 人，填答者裡有幾個未通過者，原文沒寫。
2. **摘要與重點：「retaining approximately two-thirds of what they learned over the long term」「after a two-week testing delay」。** 依據是 20 位自選填答者在課程結束兩週後答對 10 題中的 6.2 到 6.6 題。原文沒有同一批人在課程當下對這 10 題的答對率，所以「保留了三分之二」其實是「兩週後答對約三分之二」。
3. **正文加框的結論「There is no significant difference in assessed knowledge between passing and non-passing learners」（L786–789、討論 L1496–1497）與同一節的檢定結果相反**：作者自己報告的是「a significant albeit small difference (6 percentage points, χ2 = 9.63, p = 0.002)」（L671）。
4. 摘要說「We observed no effect on learning outcomes」；正文較精確的說法是「no evidence that encouraging retrieval practice raised…」（L531–532），且討論明寫不遵從限制了因果推論（L1481–1482）。摘要有提「high levels of treatment non-compliance」，這一點一致。
5. 導言寫「more than 500 learners assigned to either a treatment (ARPS) or a control group」（L83–84），實際是兩組各約 520 人、共 1,047 人。
6. 節號：5.3 底下的第一個小節標成「5.1.1 Demographic Analysis」（L558）。Table 1 在文字檔與版面上都沒有「Table 1」表題。

## 與清單「要撐的結論」不合的地方

清單寫的是 10-b「另外跳出、可略過的提示，少數人會碰，對成績無效。」（標註：無效果，預先註冊）

- **「對成績無效」**：方向撐得住——ITT 與 LATE 對取得證書、成績非零、連續成績全部不顯著（L459–477）。但要改成原文的強度：「沒有證據顯示有效」，而且作者自己說不遵從「limits our ability to draw causal inferences」（L1481–1482）。這是一個檢定力很低的無效果：通過率 7–8%、成績中位數 0、實際使用的人約一百位。**不能寫成「證明無效」**。
- **「預先註冊」**：是（L352），但作者沒有套用預先註冊的排除條件、並調整了分析做法（L453–456）。引用時要帶這一句。
- **「少數人會碰」要改寫**。102／523（19.5%）的分母是「進過課程一次的實驗組」，其中多數人成績為零，很可能沒走到第 2 週以後的影片頁。**以實際顯示出來的 qCard 為單位，作答的是多數**：選擇題 69% 有作答（Figure 16；L1419–1420）；通過者 73% 作答、未通過者 47% 作答（Table 3）。原文沒有給「被顯示過 qCard 的人裡有多少人至少答過一題」。比較站得住的寫法：「跳出的題目被顯示時，選擇題約七成有人作答、要打數字的約四成；但會走到題目出現那一步的人本來就少」。
- **「另外跳出」與 10-a 的對比不成立。** 清單把 Kovacs（10-a）寫成「擋在動線上」、Davis 寫成「另外跳出」，暗示位置造成 74% 對 20% 的差別。原文裡 qCard 是**在每支講課影片頁面上自動跳出、蓋住影片**的視窗（L236–237、L343；Figure 4），作者還特別說這是 push 式、不需要學習者去找（L260–265）。兩者都是自動出現、都可以略過。真正不同的是：(a) 題目內容——Kovacs 的題目問的是正在看的那支影片，Davis 的題目問的是**前幾週**的內容；(b) 分母——Kovacs 的 74% 是「開始看影片的人」，Davis 的 19.5% 是「進過課程的人」。換成同一種算法（題目出現時有沒有作答），Davis 的選擇題是 69%，與 Kovacs 的 74% 相去不遠。清單「找不到來源」一節已寫兩篇不能拿來談位置的因果，這裡再加一層：連「兩個數字差很多」這個前提都要先改。
- **可以補進去的原文發現**：
  - 題型的差別很大（選擇題 69% 對數值輸入 41%），但題目不是隨機分派到題型（L1419–1425）。
  - 略過的決定很快，中位數 7 秒（L775–776）。
  - 原題沒答過的，之後的 qCard 只有 34% 會作答；原題答對的 73%（L1046–1050）。這與 10-d「題目答得出來時才願意自我測驗」方向一致，但屬探索性分析。
  - 「再來一題」按鈕只有 1 個人用（L674–678）。這是另一種「要自己去按」的可略過功能，使用率接近零。
  - 看到 qCard 後只有 8–10% 的時候會往回瀏覽（L546–554）。
- **對照組不是空白對照**：兩組都拿到提取練習的說明，所以「無效」是相對於「只給說明」而言。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | `.txt` L1–820 | 標題、摘要、實務重點、導言與五個研究問題、相關研究（提取練習、知識保留）、ARPS 系統說明、研究設計（受試者、程序、測量）、結果 5.1（確認性分析、Table 1、Table 2）、5.2、5.3（人口變項、逐題分析、Table 3、第一題反應、反應時間）前半 |
| 2 | `.txt` L820–1639 | Figure 9–10 圖說、5.4（依週次、依測驗延遲、依原題表現、課後測驗）、5.5 使用經驗、討論、利益衝突與經費聲明（L1515–1520）、參考文獻 L1522–1633（掃過） |
| 對表 | `pdftotext -layout` 輸出 | Table 1、Table 2、Table 3 逐列對過，與 `.txt` 的數字一致 |
| 對圖 | PDF 期刊頁 25、26、30、33、38 | Figure 3、4、5（qCard 與對照組頁面的實際樣子）、Figure 6（學歷）、Figure 9–10（第一題反應、反應時間）、Figure 16（題型）。Figure 7、8、11–15 只讀了圖說與正文敘述，沒有從圖上讀數字 |

原文沒有附錄。註腳 1–8 都讀了（L60、L114、L214、L273–274、L294–296、L352、L681–683）。預先註冊文件（OSF）本身沒有讀。
