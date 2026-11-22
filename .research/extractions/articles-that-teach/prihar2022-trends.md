# 抽取紀錄：Prihar、Syed、Ostrow、Shaw、Sales、Heffernan 2022，EDM 2022 論文集

- **合法公開來源**：https://educationaldatamining.org/edm2022/proceedings/2022.EDM-long-papers.3/2022.EDM-long-papers.3.pdf （EDM 2022 論文集，出版者本站，CC BY-NC-ND 4.0，2026-10-14 核對）。重新下載與手上的 `prihar2022trends.pdf` 位元組完全相同（1,357,905 位元組）。

**書目**：Ethan Prihar, Manaal Syed, Korinn Ostrow, Stacy Shaw, Adam Sales, Neil Heffernan (2022). Exploring Common Trends in Online Educational Experiments. In A. Mitrovic & N. Bosch (Eds.), *Proceedings of the 15th International Conference on Educational Data Mining*, pp. 27–38. Durham, United Kingdom, July 2022. International Educational Data Mining Society. doi:10.5281/zenodo.6853041。六位作者都掛 Worcester Polytechnic Institute。作者全名與順序對過 PDF 首頁與首頁的引用方塊。CC BY-NC-ND 4.0。

**原文檔**：`.research/raw/learning-content/q6-evaluate/prihar2022trends.pdf`（12 頁；論文頁碼 27–38）。清單登記的 `prihar2022trends.txt` 是 `pdftotext -layout` 版（706 行、75,810 位元組），雙欄交錯。這次改用不帶 `-layout` 的 `pdftotext prihar2022trends.pdf` 重轉（1,080 行、58,755 位元組）依序讀，**下面的行號都是這個重轉版的行號**（同一指令可重現），另附 PDF 頁碼（p.1 = 論文 p.27）。

**讀取日期**：2026-10-14
**版本**：刊出版（會議論文集定稿）
**供**：order 26

## 研究設計

- **類型**：對同一平台上既有的多個隨機對照實驗做彙整再分析（不是統合分析：沒有逐實驗算效果量再合併，而是把不同實驗裡「條件相同」的學生資料直接併成一個資料集，再跑一個 OLS）。
- **平台與機制**：ASSISTments 的研究測試平台 E-TRIALS。研究者改寫既有的作業加上實驗條件，老師照常派作業，學生**以個人為單位**隨機分派（L229–232「students will be randomized (on an individual basis, not at the class level)」，PDF p.3）。
- **受試者**：30,408 位不重複學生、50,752 筆「學生參加實驗」的紀錄、50 個實驗，2019 年 2 月起（L246–248）。K-12 學生做線上數學作業（L95）。**沒有年級、地區、人口統計**：平台不向學生要人口資料（L259–261）；社經地位用學區是否屬 Opportunity Zone 代替，由老師電郵網域推定（L253–259）。
- **怎麼從 103 個變成 50 個**（L347–352，PDF p.4）：「Even though 103 experiments have been deployed in ASSISTments since 2019, only 50 had at least one condition similar to a condition in another experiment and were complete enough to be included in the analyses.」排除理由有兩種，原文沒分別給數字：(a) 太獨特，找不到別的實驗有相同條件；(b) 建置錯誤或影片連結失效，學生根本沒被分派（L348–350）。
- **教材**：全部是 skill builder 作業（同一數學技能連續出題，預設連對 3 題才算完成，老師可改）（L190–194；限制段 L774–776 說「All of the experiments also take place within skill builder assignments」）。
- **比較對象**：19 個研究問題，各是一對條件（Table 2，L379–438 與 L467–486，已對 PDF p.5 版面）。
- **量了什麼**：五種依變項，Table 4（L534–551，對過 PDF p.6）：Problems to Mastery 44%、Posttest Score 44%、Learning Gains 7%、Assignment Correctness 3%、Assignment Completion 1%（加起來 99%）。全部是作業當下或作業內的後測，**沒有任何延宕測驗，也沒有平台外的測驗**（原文沒有寫後測與作業間隔多久）。
- **標準化**（4.2 節 L488–504；Table 5 對過 PDF p.6）：先套 f(x) 再在各實驗內用依條件合併的標準差做 z 分數。Table 5：Problems to Mastery「0 if incomplete else √(3/x)」；Posttest Score「0 if incomplete else x」；Learning Gains「0 if incomplete else x + 1」；Assignment Correctness「x」；Assignment Completion「x」。**沒寫完作業一律記 0**，理由是「which presumably means they learned the least」（L491）。所以文中的「normalized student learning」混進了「有沒有寫完」。
- **統計**（4.3 節 L510–591）：效果量用 Cohen's d；顯著性用 OLS，依變項是標準化後的學習，自變項有實驗條件、實驗固定效果、Table 1 的學生／班級／老師／學區特徵；缺值補全體平均（L587–589）。95% CI 與 p 值取自實驗條件係數。**沒有做多重比較校正**（見限制）。

### Table 2（19 個研究問題；對過 PDF p.5）

| 研究問題 | 實驗數 | 學生數 | 實驗組比例 |
|---|---|---|---|
| 2 vs 3 Correct for Mastery | 4 | 1192 | 0.487 |
| 2 vs 4 | 4 | 1165 | 0.475 |
| 2 vs 5 | 3 | 846 | 0.483 |
| 3 vs 4 | 5 | 2030 | 0.492 |
| 3 vs 5 | 4 | 1683 | 0.494 |
| 4 vs 5 | 4 | 1681 | 0.495 |
| Example vs. Answer Only | 3 | 765 | 0.467 |
| Explanation vs. Answer Only | 1 | 85 | 0.471 |
| Hint vs. Answer Only | 5 | 1192 | 0.513 |
| Scaffolding vs. Answer Only | 7 | 2010 | 0.546 |
| Video Example vs. Answer Only | 1 | 366 | 0.484 |
| Video Scaffolding vs. Answer Only | 3 | 1033 | 0.509 |
| Video vs. Text | 5 | 2492 | 0.497 |
| Common Wrong Answer Feedback vs. No Feedback | 2 | 7046 | 0.497 |
| Adaptive vs. Non-Adaptive | 9 | 7754 | 0.498 |
| Fill-In vs. Multiple Choice | 2 | 4057 | 0.493 |
| Choice vs. No Choice | 9 | 12789 | 0.499 |
| Emotion vs. No Emotion | 2 | 1211 | 0.766 |
| Motivational vs. Non-Motivational | 14 | 12243 | 0.581 |

我自己加總：實驗數欄合計 87、學生數欄合計 61,640，都大於 50 與 50,752，表示同一實驗、同一學生會進到不只一個研究問題。原文沒有說明重疊多少。有兩個研究問題只靠 1 個實驗（Explanation、Video Example），談不上「跨實驗的共同趨勢」。

Table 3（教學輔助的定義，L517–532，對過 PDF p.6）：Example＝相似題的完整解；Explanation＝本題的完整解；Hint＝本題的逐步提示；Scaffolding＝把本題拆成一串較簡單的小題並附解說；Video Example／Video Scaffolding＝同上但錄成影片。

## 結果（逐項）

圖 2–7 的數字只在圖裡，重轉的文字檔讀不到；下面都是直接看 PDF 頁面（p.6–9），圖 5、圖 7 另以 220 dpi 裁圖放大確認過。

### 5.1 完成門檻（圖 2、圖 3；PDF p.6–7）

格子讀法照原文 L609–612：列是較少題、欄是較多題，正值表示「要求較少題」的那一組較高。

| # | 比較（少 vs 多） | 圖 2：標準化學習，全體 d (p) | 圖 3 上：完成作業 d (p) | 圖 3 下：只看有完成者的學習 d (p) |
|---|---|---|---|---|
| 1 | 連對 2 vs 3 | 0.142 (0.004) | 0.09 (0.014) | 0.036 (0.745) |
| 2 | 連對 2 vs 4 | 0.139 (0.007) | 0.208 (<1e-3) | 0.006 (0.773) |
| 3 | 連對 2 vs 5 | 0.18 (0.015) | 0.252 (<1e-3) | 0.055 (0.61) |
| 4 | 連對 3 vs 4 | −0.014 (0.574) | 0.088 (0.136) | −0.04 (0.358) |
| 5 | 連對 3 vs 5 | 0.064 (0.303) | 0.139 (0.015) | −0.035 (0.411) |
| 6 | 連對 4 vs 5 | 0.048 (0.227) | 0.025 (0.475) | 0.005 (0.848) |

- 原文解讀（L621–629，PDF p.6–7）：「there is no statistically significant effects on student learning for students that completed their assignment, regardless of how many problems they had to complete correctly in a row」「The vast majority of the effects seen in Figure 2 come from more students failing to complete their assignment」。
- 原文推論（L675–683）：這些門檻都不像是判斷「學會了沒」的有效指標，建議改用 Knowledge Tracing 或 Performance Factors Analysis。
- 要注意：圖 3 下是「只看有完成的人」，這是隨機分派之後才形成的子群，兩組完成率不同，已不是隨機比較；原文沒有提這一點。

### 5.2 教學輔助 vs 只給答案（圖 4；PDF p.8）

| # | 比較 | d | n | p | 信賴區間（看圖） |
|---|---|---|---|---|---|
| 7 | Video Scaffolding vs. Answer Only | 0.267 | 1033 | <1e-3 | 不含 0 |
| 8 | Video Example vs. Answer Only | 0.237 | 366 | 0.029 | 不含 0，下限貼近 0 |
| 9 | Scaffolding vs. Answer Only | 0.176 | 2010 | <1e-3 | 不含 0 |
| 10 | Hint vs. Answer Only | 0.155 | 1192 | 0.003 | 不含 0 |
| 11 | **Explanation vs. Answer Only** | **−0.061** | 85 | 0.576 | 約 −0.57 到 0.32，**無效果** |
| 12 | Example vs. Answer Only | 0.237 | 765 | <1e-3 | 不含 0 |

- 原文（L641–648）：「most tutoring is effective」「The only tutoring strategy that had no significant impact on student learning was explanations, which had a wide confidence interval and relatively few participants.」
- 結論段把它寫成（L819–822）：「the tutoring provided to students by ASSISTments had almost entirely a positive effect on students' learning compared to just giving students the answer」。

### 5.2 依先備程度分組（圖 5；PDF p.8）

分組方式：學生先前平均答對率高於或低於全體平均（L652–656）。六種裡只有四種可分組，另兩種的實驗沒有用過平台的學生（L657–660）。

| # | 比較 | 低於平均：d／n／p | 高於平均：d／n／p |
|---|---|---|---|
| 13 | Video Scaffolding vs. Answer Only | 0.333／443／<1e-3 | 0.169／526／0.017 |
| 14 | Scaffolding vs. Answer Only | 0.204／884／<1e-3 | 0.178／1036／0.017 |
| 15 | **Hint vs. Answer Only** | 0.122／536／0.047 | **0.168**／623／0.032（**方向相反：高程度組較大**） |
| 16 | Example vs. Answer Only | 0.341／342／0.001 | 0.085／401／0.186（不顯著） |

- 原文（L660–670）：「The below average prior knowledge students consistently had statistically significant positive effects ... and greater effect sizes for three out of the four tutoring strategies.」Example 是唯一「低程度組顯著、高程度組不顯著」的。
- 原文沒有檢定兩組之間的差（沒有交互作用檢定）；各組信賴區間在圖上大幅重疊（Scaffolding、Hint 尤其）。「低程度學生受益較多」是比較兩個點估計，不是檢定過的差異。

### 5.3 其他介入（圖 6；PDF p.9）

| # | 比較 | d | n | p | 備註 |
|---|---|---|---|---|---|
| 17 | Video vs. Text | 0.123 | 2492 | 0.002 | 本圖最大 |
| 18 | **Motivational vs. Non-Motivational** | **−0.072** | 12243 | <1e-3 | **反向**：加激勵訊息與影片的較差 |
| 19 | Adaptive vs. Non-Adaptive | 0.054 | 7754 | 0.015 | |
| 20 | **Common Wrong Answer Feedback vs. No Feedback** | **−0.041** | 7046 | 0.055 | **反向、未達 .05**；信賴區間上限約在 0。正文 5.3 與結論**完全沒有討論這一項** |
| 21 | Emotion vs. No Emotion | −0.013 | 1211 | 0.807 | 無效果；正文沒討論 |
| 22 | Choice vs. No Choice | 0.014 | 12789 | 0.472 | 無效果（9 個實驗、樣本最大）；正文沒討論 |
| 23 | Fill-In vs. Multiple Choice | 0.085 | 4057 | 0.009 | |

- 原文（L706–725，PDF p.8）：影片優於文字「This could have been due to videos being more engaging and not requiring students to also be proficient readers」（作者的猜測）；填答優於選擇題「This could have been due to the added difficulty」（猜測）；激勵訊息「have a negative impact on students' learning. This could be a result of students finding the messages distracting. However, students' perceptions of the messages were not recorded」。

### 5.3.1 影片 vs 文字，依輔助類型拆（圖 7；PDF p.9）

| # | 輔助類型 | d | n | p |
|---|---|---|---|---|
| 24 | Scaffolding | 0.125 | 1078 | 0.017 |
| 25 | Hint | 0.121 | 1056 | 0.056（不顯著，區間下限約在 0） |
| 26 | Example | 0.125 | 358 | 0.648（不顯著，區間約 −0.16 到 0.26） |

- 三個 n 加起來 2,492，等於圖 6 的 Video vs. Text。
- 原文（L737–739）：「Video-based scaffolding had the only significant positive effect on learning compared to a text-based control. Hints and examples had no statistically significant difference」。
- 要注意：三種的 d 幾乎相同（0.125、0.121、0.125），差別在樣本數與 p 值。原文 L744–745 卻推論「students benefit differently from different types of tutoring being video-based」，結論段再寫成「when scaffolding problems were video-based, they had a larger positive impact than when they were text-based」並建議「the extra effort of making video-based tutoring could be saved for scaffolding」（L825–831）。圖 7 的點估計並不支持「三種受益程度不同」，只支持「只有 scaffolding 的樣本夠大到顯著」。Example 的 d = 0.125 配 p = 0.648 也和 n = 358 不太相稱（d 是原始 Cohen's d，p 來自加了共變數與固定效果的 OLS 係數，兩者不是同一個估計）；原文沒有解釋。

## 作者自己列的限制（第 6 節，L763–800，PDF p.9）

1. 只有 ASSISTments 一個平台；介面可能影響效果，例如某些輔助扣部分分數、某些扣全部分數（L769–774）。
2. 全部是 skill builder、全部是數學、同一份作業同一主題；換科目或混合主題可能不同（L774–779）。
3. 推到線上平台以外有問題：教室裡有老師可問時，各種輔助的差別可能無關緊要；激勵訊息的負面效果「was likely due to the distracting and impersonal nature of the motivational messages」（L780–788）。
4. 多個研究問題、併的是設計相似但不相同的實驗，「has increased the potential of discovering false positives」；「While the results with effect sizes greater than 0.1 and p-values in range of of 10−3 can likely be trusted, there are many weaker findings that some might consider significant while others may be more critical.」（L789–800）

照作者自己這條標準（d > 0.1 且 p 在 10⁻³ 量級），站得住的只有：連對 2 vs 3、2 vs 4（全體，p = .004、.007）、Video Scaffolding／Scaffolding／Hint／Example vs. Answer Only、Video vs. Text（p = .002）。Adaptive（d = 0.054）、Fill-In（d = 0.085）、Motivational（d = −0.072）的 d 都不到 0.1；Video Example（p = .029）、連對 2 vs 5（p = .015）的 p 不在 10⁻³ 量級。但結論段把 Adaptive、Fill-In、Motivational 都當成已確立的發現寫。

原文沒有列、但讀設計可見的：沒有延宕測驗；未完成記 0 使「學習」與「完成」混在一起；沒有交代同一學生跨研究問題重複計入的處理；圖 3 下與圖 5 是事後子群。

## 與摘要說法不一致的地方

- 摘要沒有報任何效果量，只說「identified multiple statistically significant insights on the impact of various skill mastery requirements, strategies for personalization, and methods for tutoring」（L61–62）。正文第 6 節自己承認有偽陽性風險、沒有校正，摘要沒提。
- 摘要與導言都寫「50 different experiments」（L60、L93），沒有提這是從 103 個裡篩出來的；103 只出現在 4.1 節。
- 摘要的「skill mastery requirements」會讓人以為門檻影響學習；正文的結果是門檻只影響完成率，完成者之間沒有差別。
- 其餘數字（50,752、30,408、50）摘要、導言、第 3 節、結論四處一致。

## 與清單「要撐的結論」不合的地方

清單寫：「50 個實驗彙整出的幾條；103 個部署只有 50 個可用」。

- 「103 個只有 50 個可用」：數字對，但「不可用」的意思要寫準。原文的條件是「至少有一個條件和別的實驗相似，而且夠完整」。被排除的 53 個裡有一部分只是「太獨特、無法和別的實驗併」，不是壞掉；壞掉的（建置錯誤、影片連結失效、學生沒被分派）原文沒有給數字。不能寫成「一半以上的實驗是壞的」。
- 「彙整出的幾條」：引用時每一條都要帶 d、n、p 與「作業內的即時表現」這個量法。可引的穩定結果是「給輔助 vs 只給答案」四種 d = 0.155–0.267；「完成門檻提高只降低完成率」；Choice（9 個實驗、12,789 人）無效果；激勵訊息 d = −0.072。「影片只對 scaffolding 有用」「低程度學生受益較多」兩條原文有寫，但圖上的數字撐不住這麼強的說法（見上）。
- 這篇的依變項沒有一個是平台外或延宕的學習測驗，不能拿來支持「長期學習」的說法。

## 讀取紀錄

重轉版（不帶 -layout）行號，依序、首尾相接：

- L1–L559（題目、作者、摘要、1 導言、2 背景、3 資料集、4.1、Table 1–2、4.2、4.3 開頭、Table 3–5 文字）
- L560–L1080（Table 5 殘列、4.3 後半、5.1、5.2、5.3、5.3.1、6 限制、7 結論、8 致謝、9 參考文獻 [1]–[49]；參考文獻掃過）

對過 PDF 版面的表與圖：Table 2（p.5）、Table 3、4、5（p.6）、圖 2（p.6）、圖 3 上下（p.7）、圖 4、圖 5（p.8）、圖 6、圖 7（p.9）。圖 5、圖 7 另裁圖放大。Table 1（特徵清單，p.4）只在文字檔讀，沒有數字。圖 1（介面截圖，p.3）沒看。信賴區間端點只有圖、沒有印數字，上面寫「約」的是目測。
