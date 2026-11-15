# 抽取紀錄：van der Zee 等 2018，LAK '18（doi 10.1145/3170358.3170382）

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3170358.3170382（刊出版，2026-10-14 核對）。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。ACM 版另存 `.research/raw/learning-content/q3-activity/vanderzee2018-acm-dl.pdf`；與手上經 Wayback 取得的 `vanderzee2018.pdf` 位元組不同，`pdftotext` 轉出的 8,954 個詞逐詞相同。Unpaywall 另列 Maastricht、Erasmus 兩個機構典藏有刊出版。

**書目**：Tim van der Zee、Dan Davis、Nadira Saab、Bas Giesbers、Jasper Ginn、Frans van der Sluis、Fred Paas、Wilfried Admiraal（八位，首頁核過）。2018。Evaluating Retrieval Practice in a MOOC: How writing and reading summaries of videos affects student learning。*LAK '18: International Conference on Learning Analytics and Knowledge*，March 7–9, 2018, Sydney, NSW, Australia，頁 216–225。ACM。DOI 10.1145/3170358.3170382。
**原文檔**：`.research/raw/learning-content/q3-activity/vanderzee2018.txt`（1,290 行、56,818 字元／57,067 位元組）與同名 `.pdf`（10 頁）。
**讀取日期**：2026-10-14
**版本**：刊出版（ACM 版面，頁碼 216–225）。
**供哪幾篇 order 使用**：order 10（10-b 的旁證）。
**文字檔狀況**：`.txt` 是不帶 `-layout` 的轉檔。雙欄版面造成幾處段落順序錯置（例如 1.2 節的後半出現在 1.1 節標題之前、L138–188；2.1.2 Design 被排到 2.2.2 之後、L448–452 接 L373；3.2.1 的 ANOVA 段落 L616–621 接 L736–744 再接 L717–734），已依 PDF 版面的閱讀順序接回去讀。表格被拆成一行一格；**Table 1–7 全部用 `pdftotext -layout` 重抽後逐格對過**，特別是 Table 3 與 Table 7 每個相關係數落在哪一欄。行號一律是 `.txt` 的行號。

## 研究設計

兩個研究，同一門課：Coursera 上 Leiden University 的「Terrorism and Counterterrorism: Comparing Theory and Practice」。選它的理由是大量使用影片、影片之間沒有任務或測驗（評量在每週結尾）（L431–433）。介入範圍是導言之後的兩週，共 11 支影片，每支約 5 到 15 分鐘（L434–436）。原文沒有寫課程開課日期。

### 兩種介入（L448–452、L373–382）

- **Retrieval Practice（寫摘要）**：每支影片之後，在**新的一頁**出現提示「Please shortly summarize the video for yourself in about three sentences」，下面有文字框。沒有回饋。
- **Given Summary（讀摘要）**：每支影片之後給一段三句長的現成摘要（第一作者與課程教學團隊寫的），指示「Please read the summary of the video carefully.」，下面有一個核取方塊讓學習者勾選已讀。
- 兩者都**可以略過**：「The MOOC learners were free to skip the questions regarding writing or reading a summary.」（L383–384）；討論節稱之為「relatively minor and completely optional」（L1150–1151）。
- 「讀過」的操作定義是勾了核取方塊；「寫過」是送出文字。原文沒有檢查摘要的品質，也沒有檢查寫摘要時是不是憑記憶（沒有說影片頁能不能回去看）。

### Study 1（L429–452、L373–385）

- **類型**：序列世代設計（sequential cohort），**不是隨機分派**。課程開兩期，每期 6 週；第一期全體是寫摘要版，第二期全體是讀摘要版。沒有控制組。作者把它定位成測試技術可行性的 pilot（L423–424）。
- **樣本**：只納入「至少寫過或讀過一份摘要」的人，共 823 人（L383–385、L393）。**兩期各有多少人註冊、各有多少人看過影片，原文沒寫。**
- **資料缺漏**：因技術問題，第 1 週第一支影片沒有資料，期末測驗成績也沒有（L398–401）。
- **量了什麼**：每支影片有多少人寫／讀；寫的摘要長度（字元）；當週測驗成績。

### Study 2（L588–601）

- **類型**：同一門課內的隨機分派實驗（Coursera 後來提供平行版本的隨機分派功能）。三個條件：Given Summary、Retrieval Practice、Control（兩者都沒有）。
- **樣本**：共 12,444 人。正文寫控制 4,169、讀摘要 4,128、寫摘要 4,146（L611–613）；Table 4 的讀摘要是 4,125（見「內部不一致」）。
- **量了什麼**：各條件在課程開始、第 1 週測驗、第 2 週測驗、期末測驗時還有多少人活躍；每支影片有多少人寫／讀；摘要長度；第 1 週、第 2 週、期末測驗成績。
- **何時量**：測驗在每週結尾與課程結尾，學習者自定進度，所以「寫摘要到測驗」的間隔沒有控制（L1082–1084）。
- 兩個研究的資料公開在 https://osf.io/qz5m6/（L391–392、L609–610）。**沒有寫預先註冊。**

### 假設（L413–418）

1. 讀摘要對測驗成績有正面影響。
2. 寫摘要對測驗成績有正面影響。
3. 寫摘要的影響大於讀摘要。

## 結果（逐項）

### Study 1

**Table 1（PDF p.220；L493–546）每支影片有多少人讀或寫**

| | 1.2 | 1.3 | 1.4 | 1.5 | 1.6 | 2.1 | 2.2 | 2.3 | 2.4 | 2.5 |
|---|---|---|---|---|---|---|---|---|---|---|
| 讀摘要（第二期） | 474 | 454 | 369 | 334 | 320 | 259 | 231 | 209 | 192 | 210 |
| 寫摘要（第一期） | 498 | 423 | 382 | 333 | 317 | 229 | 224 | 218 | 219 | 189 |

作者的敘述：「There appears to be no difference in the amount of learners who write or read summaries, despite the fact that writing a summary demands a higher investment by the student.」（L397–398）。這是兩期不同世代的人數並列，兩期的註冊人數沒有報告，所以這不是「比例相同」。

**Table 2（L548–586）寫的摘要長度**：各影片平均 180.37 到 255.05 字元（SD 113.93 到 189.02）；作者說平均約 230 字元，隨時間寫的人變少但長度不變（L402–409）。以摘要長度當預測變項或中介變項的探索性分析「did not result in anything noteworthy, and will not be reported」（L409–411）。

**Table 3（PDF p.221；L640–657；對過欄位）相關係數**

| | 第 1 週成績 | 第 2 週成績 |
|---|---|---|
| 讀摘要數（第 1 週） | 0.138（n = 769，p < 0.001） | |
| 讀摘要數（第 2 週） | | 0.138（n = 471，p = 0.003） |
| 寫摘要數（第 1 週） | 0.087（n = 743，p = 0.018） | |
| 寫摘要數（第 2 週） | | 0.137（n = 431，p = 0.004） |

表註：只含有寫／讀過摘要**而且**有做該次測驗的人（L655–657）。

| # | 結果 | 數字 | 對照 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 寫摘要數與當週成績 | 第 1 週 ρ = 0.087，p = 0.018；第 2 週 ρ = 0.137，p = 0.004 | 同條件內，寫得多對寫得少（至少寫一份的人） | L442–444 | 「Writing summaries was positively correlated with the respective weekly quiz」 |
| 2 | 讀摘要數與當週成績 | 第 1 週 ρ = 0.138，p < 0.001；第 2 週 ρ = 0.138，p = 0.003 | 同條件內 | L444–446 | 「Similar results were found for reading summaries」 |
| 3 | 兩種介入的相關有沒有差 | Fisher r-to-z：第 1 週 z = 1.00，p = 0.317；第 2 週 z = 0.02，p = 0.984（不顯著） | 讀的相關 vs 寫的相關（跨世代） | L625–632 | 「we observe no significant difference between these two interventions' effect on quiz scores.」 |

Study 1 **沒有**任何「有介入對沒介入」的比較。

### Study 2

**Table 4（PDF p.221；L684–715；對過版面）各時點仍活躍的人數**

| 條件 | 開始 | 第 1 週測驗 | 第 2 週測驗 | 期末測驗 |
|---|---|---|---|---|
| 控制 | 4,169 | 709 | 501 | 259 |
| 讀摘要 | 4,125 | 614 | 439 | 230 |
| 寫摘要 | 4,146 | 616 | 436 | 245 |

| # | 結果 | 數字 | 對照 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 4 | 時間對流失的效果 | 重複量數 ANOVA（Greenhouse-Geisser 校正，ε = .714）：F(2.142, 26644.88) = 61664.47，p < .001，partial η² = .832 | 四個時點 | L616–621、L736–738 | 「student attrition increased substantially as the course progressed each week.」 |
| 5 | 條件的主效果 | F(2, 12440) = 3,478（應為 3.478，原文用逗號），p = 0.031，partial η² = .001 | 三個條件，**全部學習者** | L739–740 | 「There was also a significant albeit very weak between-subjects effect of condition」 |
| 6 | 條件 × 時間 | F(4.284, 26644.88) = 3.273，p = .009，partial η² < .001 | 同上 | L741–742 | 「a significant but very weak condition by time interaction」 |
| 7 | 第 1 週測驗：控制 vs 讀摘要 | 709 vs 614，χ² = 7.037，p = 0.008（控制組留下來的人較多） | 控制 vs 讀摘要 | L717–719 | 「At the quiz of week 1, there are significantly more learners in the control condition than the given summary condition」 |
| 8 | 第 2 週測驗：控制 vs 讀摘要 | 501 vs 439，χ² = 3.947，p = 0.047 | 同上 | L719–720 | 同段 |
| 9 | 期末測驗：控制 vs 讀摘要 | 259 vs 230，χ² = 1.536，p = 0.215（不顯著） | 同上 | L720–721 | 「but not at the final quiz」 |
| 10 | 第 1 週測驗：控制 vs 寫摘要 | 709 vs 616，χ² = 7.165，p = 0.007 | 控制 vs 寫摘要 | L724–725 | 「The same pattern is found when comparing the control and retrieval conditions」 |
| 11 | 第 2 週測驗：控制 vs 寫摘要 | 501 vs 436，χ² = 4.685，p = 0.032 | 同上 | L725–726 | 同段 |
| 12 | 期末測驗：控制 vs 寫摘要 | 259 vs 245，χ² = 0.336，p = 0.562（不顯著） | 同上 | L726–727 | 「there is no difference at the final quiz」 |
| 13 | 作者的解讀 | 兩種介入讓前兩週多流失一些人，但整體流失率相同，可能只是讓流失提早 | — | L721–723、L1145–1155 | 「Both experimental interventions appear to have caused some more learners to dropout in the first two weeks of the course. … it appears that even educational interventions which are relatively minor and completely optional can potentially affect dropouts in unexpected ways. However, it is important to note that the overall drop-out rate was equivalent in all conditions」 |
| 14 | 作者的另一個說法 | 介入是「篩子」 | — | L727–730 | 「The intervention can thus be considered a filter—able to identify learners most likely to persist deeper in the course」 |

**Table 5（PDF p.223；L910–968；對過版面）每支影片有多少人讀或寫**

| | 1.1 | 1.2 | 1.3 | 1.4 | 1.5 | 1.6 | 2.1 | 2.2 | 2.3 | 2.4 | 2.5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 讀摘要 | 1,638 | 1,364 | 1,252 | 1,150 | 1,054 | 1,033 | 817 | 768 | 750 | 731 | 712 |
| 寫摘要 | 774 | 638 | 583 | 529 | 472 | 467 | 374 | 351 | 341 | 329 | 322 |

- 作者的敘述：「Overall, substantially more learners in the 'given summary' condition engage with the intervention than the 'write a summary' condition, most likely because the latter requires more effort from the learners.」（L759–762）；第 1 週到第 2 週之間有明顯下降（L758–759）。
- **原文沒有把這些人數換成比例，也沒有給「看過該支影片的人數」當分母。** 我自己用分派人數算（不是原文的數字）：第一支影片，讀摘要 1,638／4,125 ≈ 39.7%，寫摘要 774／4,146 ≈ 18.7%；第 2 週最後一支，讀 712／4,125 ≈ 17.3%，寫 322／4,146 ≈ 7.8%。分母含根本沒開始看影片的人，所以這是下限，不是「看到提示的人裡有多少人做」。
- 每一支影片，讀的人數都是寫的 2.1 到 2.2 倍左右（我算的）。

**Table 6（L970–1011）**：寫的摘要平均 234.05 到 328.47 字元；作者說平均將近 300 字元，長度隨時間穩定（L763–770）。摘要長度的探索性分析同樣「will not be reported」（L770–772）。

| # | 結果 | 數字 | 對照 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 15 | **全部學習者的測驗成績，三個條件比較** | 第 1 週 F(2, 1938) = 1.457，p = 0.233；第 2 週 F(2, 1375) = 2.905，p = 0.055；期末 F(2, 733) = 0.289，p = 0.749（**全部不顯著**） | 隨機分派的三個條件；只含有做該次測驗的人 | L796–800 | 「When we look at all learners in the three conditions, we detect no differences in quiz scores.」 |

各條件的平均分數與標準差**原文沒有給**，只給 F 值。

**Table 7（PDF p.224；L1052–1074；對過欄位）相關係數**

| | 第 1 週成績 | 第 2 週成績 | 期末成績 |
|---|---|---|---|
| 讀摘要數（第 1 週） | 0.136（n = 1,158，p < 0.001） | | |
| 讀摘要數（第 2 週） | | 0.227（n = 766，p < 0.001） | |
| 讀摘要數（合計） | | | 0.115（n = 436，p = 0.016） |
| 寫摘要數（第 1 週） | 0.121（n = 368，p = 0.008） | | |
| 寫摘要數（第 2 週） | | 0.323（n = 339，p < 0.001） | |
| 寫摘要數（合計） | | | 0.087（n = 203，p = 0.218） |

| # | 結果 | 數字 | 對照 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 16 | 讀／寫的數量與週測驗 | 相關 0.121 到 0.323 | 同條件內、有做介入也有做測驗的人 | L805–807 | 「Learners who wrote or read more summaries of the videos also scored higher on the weekly quizzes. With correlations between 0.121 and 0.323 these are noticeable correlations.」 |
| 17 | 與期末測驗 | 讀 ρ = 0.115，p = 0.016；寫 ρ = 0.087，p = 0.218（**寫的不顯著**） | 同上 | L808–813 | 「reading more summaries in the first two weeks of the course significantly predicts a higher grade on the final quiz, while this is not true for writing more summaries.」 |
| 18 | 兩種介入的相關有沒有差 | Fisher r-to-z：第 1 週 z = 0.29，p = 0.386；第 2 週 z = −1.59，p = 0.056；期末 z = 0.33，p = 0.370（不顯著） | 讀的相關 vs 寫的相關 | L814–817 | 「there was no significant difference between the correlation pairs」 |
| 19 | 假設 3 的判定 | 不成立 | — | L818–822、L1018–1023 | 「Contrary to our hypothesis, writing summaries of videos does not appear to lead to better quiz scores than passively reading provided summaries.」「Both studies failed to provide evidence for this hypothesis.」 |
| 20 | 作者對讀寫差別的三點總結 | — | — | L1029–1034 | 「1) reading summaries and the final quiz grade are correlated, 2) there is no evidence that writing summaries and the final quiz grade are correlated, and 3) there is no evidence that reading summaries has a bigger impact on the final quiz grade than writing summaries.」 |

## 作者自己列的限制

原文沒有 Limitations 節。散在各處的：

1. Study 1 是世代設計，「comes with various limitations」（L590–591），沒有展開說是哪些。
2. Study 1 因技術問題缺第一支影片與期末成績的資料（L398–401）。
3. **正面結果是相關，可能是自我選擇**：「An important caveat is that this is a correlational observation, and there are alternative interpretations. For example, it is possible that at least a portion of this correlation is explained by learner selfselection; high performers might have been more likely to engage with this intervention.」（L841–844）；寫摘要同樣適用（L856–857）。
4. 學習者沒有被教怎麼寫摘要，品質可能不足（L860–863、L1043–1044）。
5. 寫摘要緊接在影片後，沒有延遲，而提取練習的好處通常在延遲後才出現；MOOC 裡難以強制等待（L1080–1084）。
6. 可能有天花板效果（L1084–1086）。
7. MOOC 資料下因果推論要保守（L1089–1090、L1099–1103「it is difficult to distinguish artifacts from true (and potentially causal) relationships」）。
8. 對流失的解讀建立在對學習者意圖的推測上（L1164–1166）。

作者**沒有**說的：
- 隨機分派下的成績比較（結果 15）沒有差異這件事，在討論節完全沒有被拿來限制「有正面影響」的說法。
- 成績比較只含留下來做測驗的人，而三個條件留下來的人數不同（控制組較多），比較的已不是隨機分派的原始組別。
- 沒有檢查摘要品質，也沒有確認是憑記憶寫。「讀過」只靠核取方塊。
- 沒有預先註冊；相關分析沒有做多重比較校正。
- 單一課程（人文社會主題）。
- 每支影片有多少人看過沒有報告，所以介入的實際觸及率算不出來。

## 與摘要說法不一致的地方

1. **摘要：「Both interventions seemed to help students to perform better」；隨機分派的比較結果是三個條件的測驗成績沒有差異**（L796–800）。摘要沒有提這個無效果，也沒有提兩種介入讓前兩週多流失一些人（L717–727、L1145–1155）。摘要的正面說法只建立在「同一條件內，做得多的人分數高」的相關上，而作者自己在討論節承認這可能是自我選擇（L841–844）。
2. 摘要：「Writing, as well as reading summaries of videos were positively related to quiz grades.」正文：寫摘要數與**期末**成績的相關不顯著（ρ = 0.087，p = 0.218，L808–813）。摘要沒有區分週測驗與期末測驗。
3. 摘要：「two studies (n = 13k)」。823 + 12,444 = 13,267，數字對得上；但 Study 1 的 823 是「至少做過一次」的人，Study 2 的 12,444 是全部被分派的人，兩個數字的性質不同。相關分析實際用到的樣本是 203 到 1,158 人（Table 3、7）。
4. 正文 3.2.3 末句「they do appear to both have a positive impact on quiz grades」（L822–824）與同一小節開頭的「we detect no differences in quiz scores」（L797）直接衝突。
5. 討論節說讀摘要與成績有「moderately strong, positive correlation」（L835–836），實際係數是 0.115 到 0.227。又說這在兩個研究、週測驗與期末測驗都看到（L837–839），但 Study 1 沒有期末成績。
6. Study 2 讀摘要組的人數，正文寫 4.128（L612），Table 4 寫 4125。三組加總：用 4,128 得 12,443、用 4,125 得 12,440，都不等於正文的 12,444。
7. Study 1 的 Fisher 檢定 p 值是雙尾（z = 1.00 → p = 0.317），Study 2 的看起來是單尾（z = −1.59 → p = 0.056；雙尾應約 0.11）。原文沒有說明。這是我依 z 值換算的判斷。
8. 標題與全文把寫摘要稱為 retrieval practice，但作者自己說沒有延遲、沒有確認是憑記憶（L1080–1084）。

## 與清單「要撐的結論」不合的地方

清單寫的是 10-b「另外跳出、可略過的提示，少數人會碰，對成績無效」的旁證，註明要看「可略過的寫摘要任務有多少人做、寫與讀沒有差別」。

- **「另外跳出」不符。** 這篇的提示不是跳出視窗，是**排在每支影片之後的獨立一頁**（L374「This prompt was presented on a new page after each video」），在課程的線性動線上，只是可以不做就往下走。
- **「可略過的寫摘要任務有多少人做」**：原文只給人數，沒有給比例。Study 2 第一支影片有 774 人寫（寫摘要組 4,146 人）、1,638 人讀（讀摘要組 4,125 人）；到第 2 週最後一支剩 322 與 712（Table 5）。用分派人數算約 19% 寫、40% 讀（我算的，分母含沒看影片的人）。可以寫的是「**要打字的任務，做的人大約是只要勾選已讀的一半**」（隨機分派、每支影片都是這個比例），這是這篇最乾淨的一個數字。不能寫成「看到提示的人裡有幾成會寫」，因為沒有看過影片的人數。
- **Study 1 與 Study 2 在這一點上相反**：Study 1 寫與讀的人數差不多（498 對 474），Study 2 讀是寫的兩倍。Study 1 是兩期不同世代、沒有註冊人數，不能比；只能用 Study 2。
- **「寫與讀沒有差別」**：原文撐得住，但它的意思是「**寫／讀的數量與成績的相關**沒有顯著差別」（結果 3、18），不是兩組的平均成績沒有差別（各組平均原文沒給）。更重要的是：**隨機分派下，寫、讀、什麼都不做三組的成績都沒有差別**（結果 15）。這一條比「寫與讀沒差」更該被引用，而掃描階段的清單沒有提到。
- **「對成績無效」**：就隨機比較而言撐得住（三次測驗 p = 0.233、0.055、0.749）。但第 2 週是 p = 0.055，且比較只含留下來做測驗的人。寫成「沒有偵測到差異」比較準。
- **清單漏掉的反向結果**：兩種介入都讓第 1、2 週測驗時留下來的人變少（控制 709 對 614／616；501 對 439／436），期末無差別。作者的措辭是「appear to have caused some more learners to dropout in the first two weeks」。這與 order 10 的 10-f（課前測驗會讓一部分人離開）是同一類現象，可以當旁證，但要帶上「期末時流失率相同、作者解讀為流失提早」。
- 這篇常被二手引用成「寫摘要與讀摘要都有助學習」（摘要就這麼寫）。精讀後不能這樣引。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | `.txt` L1–650 | 標題、作者與單位、摘要、導言（1.1 影片的角色、1.2 影響觀看行為的因素、1.3 提取練習、1.4 寫摘要、1.5 把提取練習用到 MOOC、1.5.1 本研究、1.5.2 假設）、Study 1 方法與結果（Table 1–3）、Study 2 方法、3.2.1 前半 |
| 2 | `.txt` L650–1290 | Table 3 數字、Figure 2、Table 4、3.2.1 後半（流失分析）、3.2.2 介入的參與、3.2.3 測驗成績、總討論 4.1–4.3、Table 5–7、Unexpected findings、Future directions、參考文獻 53 筆（L1109–1287，掃過） |
| 對表 | `pdftotext -layout` PDF p.220–224 | Table 1–7 逐格對過；Table 3、7 確認每個係數所在的欄（週次與成績的對應） |

Figure 1–3 是 Table 1、4、5 的圖形版，沒有另外從圖上讀數字。原文沒有附錄與註腳。OSF 上的資料沒有讀。
