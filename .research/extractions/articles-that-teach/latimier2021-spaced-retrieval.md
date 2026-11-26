# 抽取紀錄：Latimier、Peyre & Ramus 2021，Educational Psychology Review 33:959–987

- **合法公開來源**：http://www.lscp.net/persons/ramus/docs/EPR20.pdf （通訊作者 Franck Ramus 的實驗室個人頁，Springer 排版的刊出版，2026-10-14 核對）。重新下載與手上的 `latimier2021-spaced-retrieval-meta.pdf` 位元組完全相同（1,088,888 位元組）。出版者那邊 Unpaywall 標 closed；作者另有預印本在 PsyArXiv（https://osf.io/kzy7u）與 HAL（hal-02976100），這兩份沒有比對。手上讀的是出版者版面，不是作者稿。

## 檔頭

- **書目**：Alice Latimier、Hugo Peyre、Franck Ramus（2021）。A Meta-Analytic Review of the Benefit of Spacing out Retrieval Practice Episodes on Retention。*Educational Psychology Review*, 33(3), 959–987。doi 10.1007/s10648-020-09572-8。作者全名對 PDF 首頁與 Crossref 紀錄核過。三位都屬巴黎 ENS 的 Laboratoire de Sciences Cognitives et Psycholinguistique；Peyre 另屬 Université Paris Diderot 與 Robert Debré 醫院兒童青少年精神科。接受 2020-09-06，線上刊出 2020-10-07，卷期年份 2021。
- **版本**：刊出版。首頁版權行寫「corrected publication 2021」，代表刊出後更正過。Crossref 上查不到連結到這個 DOI 的獨立更正啟事（`filter=updates:` 回傳 0 筆），**更正了什麼我不知道**。另有預印本 PsyArXiv 10.31234/osf.io/kzy7u（2020-03-05），沒有拿來比對。
- **原文檔**：`.research/raw/learning-content/q4-time/latimier2021-spaced-retrieval-meta.txt`，1,357 行、108,394 位元組。來源是通訊作者實驗室網頁上的 PDF（`http://www.lscp.net/persons/ramus/docs/EPR20.pdf`）。這份期刊單欄排版，`pdftotext -layout` 沒有左右交錯；Table 1、Table 2 在 PDF 裡是橫向排的，轉文字後欄位對得齊。
- **本次補抓**：同一份 PDF 另存 `q4-time/latimier2021-spaced-retrieval-meta.pdf`（29 頁），用來對表與看圖。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 16（第 3 列）
- 行號（L）是 `.txt` 的行號；圖表另寫 PDF 頁碼（p.，括號內是期刊頁碼）。

## 研究設計

- **類型**：統合分析，穩健變異估計（RVE）的後設迴歸，R 套件 robumeta；研究內效果量相關設 ρ = 0.80（套件預設），另做 ρ 從 0 到 1 的敏感度分析（L424–442）。小樣本校正（L451–452）。沒有提到預先註冊。
- **兩個問題、兩個子集**（L210–216、L280–283）：
  - 子集 1：**分散的提取練習 vs 集中的提取練習**。兩邊都是提取，比的只是有沒有分散。
  - 子集 2：**漸增間隔 vs 等距間隔**（都是分散的提取練習）。
- **「集中」的定義**（L250–252）：「Learning is considered to be massed when the retrieval events for a given item are not separated by the retrieval events for other items」。也就是同一題連續提取、中間沒有插入別的題。前言說間隔可以用「中間隔幾題」或「隔多少時間」定義（L113–115），這篇**沒有把間隔的絕對長度編碼成變項**，Table 1、2 也沒有這一欄。
- **納入標準**（L246–256、L267–268）：(1) 一般（非病患）族群，年齡與教育程度不限；(2) 有訓練階段，之後有保留測驗；(3) 訓練階段對同一題至少提取兩次；(4) 有集中提取的對照，**或**有漸增對等距的操弄；(5) 隨機分派；(6) 算得出效果量（必要時用 WebPlotDigitizer 從圖上讀數字）。排除知覺與動作學習（L217–218）。收實驗室與教室實驗，收學位論文（L242–243、L271–273）。
- **檢索**：ERIC、Web of Science、Scopus；另查 Balota 等 2007、Roediger & Karpicke 2011 兩篇回顧的引文，加上 Google Scholar 通知；檢索到 2017 年 9 月（L229–237）。
- **篩選流程**（Figure 1，PDF p.6（964），看過圖）：資料庫 3,948 筆＋其他來源 10 筆 → 去重後 3,210 → 依題名摘要留 42 篇、排除 3,168 → 全文評估後排除 13 篇（拿不到全文 9、訓練時沒有至少兩次提取 2、沒有「學習後接測驗」的設計 1、非隨機 1）→ 29 篇、97 個比較 → 子集 1 是 39 個比較（11 份研究）、子集 2 是 54 個比較（16 份研究）、另有 4 個比較因統計資訊不足被排除。
- **誰編碼**：只有第一作者一人（L278–279「The coding process was determined a priori and was completed by the first author for all studies」）。沒有第二位編碼者，沒有一致率。
- **效果量**：Hedges' g。受試者內設計的相關一律假設 r = 0.5（L411–413）。
- **調節變項**（L296–356）：情境、教育程度、教材（配對 vs 其他）、設計、訓練測驗型態、最終測驗型態、回饋、保留間隔（取對數）、每題總曝光次數、間隔型態（子集 1）、第一次提取的時機（子集 2）。類別的切法是看到資料分布後才定的（L299「The categories for each of the categorical moderators were created a posteriori」）；「第一次提取的時機」這個變項是讀完全文後才加的（L297–298）。每個調節變項分開跑，因為自由度不夠做多變量（L453–454、L800–801）。
- **出版偏誤**：漏斗圖＋Egger 迴歸；子集 1 另做 trim-and-fill（L454–455、L703–704）。

### 納入研究的樣貌

**子集 1**（Table 1，L494–562；PDF p.11–12（969–970）對過）：11 份研究、39 個比較。

- 研究：Fishman 等 1968、Grote 1995、Caple 1996、Carpenter & DeLosh 2005、Balota 等 2006、Karpicke & Roediger 2007、Fritz 等 2007、Logan & Balota 2008、Nakata 2015、Hopkins 等 2016、Dobson 等 2016。
- 情境：表上標成教室（C）的只有 Hopkins 2016 與 Dobson 2016 兩份研究、共 5 個比較，其餘 34 個比較是實驗室。
- 教材：配對（P）31 個比較，其他（O）8 個。
- 保留間隔（我照表逐列數的）：**5 分鐘或 10 分鐘以內的 23 個**，1 天以上的 15 個，未報告 1 個。這與作者的說法相符（L472–474「Half the comparisons measured final performance immediately after the end of the learning phase (k = 23), while the other half used longer retention intervals (k = 15, from 1 day to more than 1 month)」）。保留間隔一週以上的只有 5 個比較（Fishman 21,600 分鐘、Caple 10,080、Hopkins 57,148 兩個、Dobson 40,320）。
- 對象：除 Fishman（5 年級）、Grote（11.5 年級）、Fritz（學齡前）之外都是受過 12 年以上教育的成人。
- 作者自己歸納的典型研究：L480–483「the typical study comparing spaced versus massed retrieval practice is a laboratory study on adults, using a cued-recall task. Retention is assessed with the same test type, and the spaced retrieval condition is scheduled according to a uniform distribution with four retrieval attempts for a given item.」

**子集 2**（Table 2，L568–662；PDF p.13–15（971–973）對過）：16 份研究、54 個比較。

- 研究：Carpenter & DeLosh 2005、Balota 等 2006、Karpicke & Roediger 2007、Pyc & Rawson 2007、Logan & Balota 2008、Storm 等 2010、Karpicke & Roediger 2010、Karpicke & Bauernschmidt 2011、Maddox 等 2011、Dobson 2012、Dobson 2013、Kang 等 2014、Küpper-Tetzel 等 2014、McGregor 2014、Mettler 等 2016、Kalenberg 2017。
- 實驗室 13 份、教室 3 份（L487–489）；只有一份研究的對象是兒童。受試者內設計 31 個比較；配對教材 36 個；訓練與最終都用線索回想的 40 個；沒給回饋的 33 個（L672–675）。
- 34 個比較裡，兩種排程的第一次提取時機不同：漸增排程通常是看完馬上提取，等距排程則延後（L677–680）。
- 保留間隔比子集 1 長，多半一週以上（L675–676）。

## 結果（逐項）

### 主要效果（Table 3，L708–721；PDF p.16（974）對過，數字相符）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 子集 1，未校正 | g = 1.01，SE 0.15，d.f. 9.72，95% CI [0.68, 1.34]，p < 0.0001；k = 39，11 份研究 | 分散的提取練習 vs 集中的提取練習（最終保留測驗） | Effect Size Analyses／Table 3 | L689–692 | 「The overall weighted mean effect size across all 39 effect size estimates was g = 1.01 (95% CI [0.68, 1.34], p < 0.0001) with an estimated between-study SE of 0.15」 |
| 2 | 子集 1 異質性 | I² = 49.09%；T² 在 ρ = 0 時 0.204、ρ = 1 時 0.215 | 同上 | 同上 | L693–696 | 「Heterogeneity was moderate (Higgins’ I2 = 49.09%).」 |
| 3 | 子集 1 出版偏誤 | Egger t = 4.41，d.f. = 37，p < 0.0001，**顯著** | 同上 | Publication Bias Analysis | L699–703 | 「This makes it likely that publication bias has occurred: some studies with negative or non-significant findings were probably not published and therefore were not included in this meta-analysis. Thus, the mean effect size may be overestimated.」 |
| 4 | **子集 1，trim-and-fill 校正後** | g = 0.74，SE 0.09，d.f. 19.4，95% CI [0.55, 0.91]，p < 0.0001；補了 10 個效果量，k = 49；I² = 46.62% | 同上 | Table 3；Fig. 2b | L704–706、L715、L727–730 | 「The overall weighted mean effect size was reduced to g = 0.74 (95% CI [0.55, 0.91], p < 0.0001), with a moderate heterogeneity (I2 = 46.62%) too.」 |
| 5 | **子集 2** | g = 0.034，SE 0.06（內文 0.063），d.f. 13.7，95% CI [−0.10, 0.17]；k = 54，16 份研究；**不顯著** | 漸增間隔 vs 等距間隔的提取練習（正值代表漸增較好） | Table 3 | L738–741、L716 | 「The overall weighted mean effect size across all 54 effect size estimates was g = 0.034 (95% CI = [− 0.10, 0.17], p = 0.59) with an estimated between-study SE of 0.063」 |
| 6 | 子集 2 異質性與出版偏誤 | I² = 0%；Egger t = −0.44，d.f. = 52，p = 0.66，不顯著 | 同上 | 同上 | L744、L747–749 | 「Higgins test suggested no heterogeneity (I2 = 0%).」 |
| 7 | 子集 2 效果量的方向分布 | 55% 為正（漸增較好）、43% 為負（等距較好）、1 個等於 0 | 同上 | Discussion | L887–890 | 「55% of effect sizes were positive (i.e., expanding schedule superiority), 43% were negative (i.e., equal-uniform schedule superiority), and one was equal to zero」 |
| 8 | ρ 敏感度 | 子集 1：平均效果 1.009–1.011；子集 2：0.0343 不變、Tau² = 0 | — | Appendix 1 | L1063–1071 | 表列 |

- #5 的 p 值：內文寫 p = 0.59（L741），Table 3 寫 0.62（L716）。兩處不同，原文如此。
- #4 作者對校正後數字的態度：L824–825「There was evidence for publication bias, but even after correction with the trim-and-fill method, the effect remained substantial (g = 0.74, 95% CI [0.55, 0.91]).」
- 作者對子集 2 的結論：L893–895「if the effect existed, it would small anyway. Overall, contrary to the apparent consensus in the literature, the expanding schedule did not seem consistently superior to the uniform schedule.」

### 調節變項（Table 4，L766–797；PDF p.19（977）對過，數字相符）

**子集 1：沒有任何一個接近顯著**（L802「no moderator came close to statistical significance at α = 0.1」）。

| 調節變項 | k | β | SE | 95% CI | d.f. | p |
|---|---|---|---|---|---|---|
| 保留間隔（log 分鐘） | 36 | 0.02 | 0.06 | [−0.12, 0.16] | 5.33 | 0.78 |
| 設計（受試者間 vs 內） | 39 | 0.36 | 0.49 | [−1.54, 2.27] | 2.26 | 0.53 |
| 回饋（無 vs 有） | 35 | 0.37 | 0.23 | [−0.20, 0.94] | 5.47 | 0.16 |
| 教材（配對 vs 其他） | 39 | −0.32 | 0.23 | [−0.94, 0.31] | 4.13 | 0.24 |
| 每題曝光次數（2–4 vs 多於 4） | 36 | −0.40 | 0.16 | [−1.05, 0.24] | 2.20 | 0.12 |
| 訓練測驗型態（線索回想 vs 自由回想） | 39 | −0.15 | 0.34 | [−1.30, 1.01] | 2.65 | 0.70 |
| 間隔型態（漸增 vs 等距） | 39 | −0.05 | 0.11 | [−0.38, 0.28] | 3.19 | 0.66 |

**子集 2**：

| 調節變項 | k | β | SE | 95% CI | d.f. | p |
|---|---|---|---|---|---|---|
| 保留間隔（log 分鐘） | 54 | 0.03 | 0.04 | [−0.07, 0.13] | 7.43 | 0.53 |
| 設計 | 54 | 0.11 | 0.17 | [−0.29, 0.50] | 8.06 | 0.54 |
| 回饋 | 50 | −0.13 | 0.10 | [−0.35, 0.10] | 8.22 | 0.23 |
| 教材 | 54 | 0.24 | 0.17 | [−0.23, 0.71] | 4.28 | 0.23 |
| **每題曝光次數（4 次 vs 多於 4 次）** | 49 | 0.22 | 0.11 | [−0.04, 0.48] | 8.50 | **0.09** |
| 訓練測驗型態 | 53 | −0.09 | 0.10 | [−0.43, 0.24] | 2.93 | 0.44 |
| 最終測驗型態 | 54 | −0.17 | 0.10 | [−0.47, 0.14] | 3.14 | 0.18 |
| 第一次提取時機（不同 vs 相同） | 54 | 0.25 | 0.23 | [−0.43, 0.93] | 3.51 | 0.35 |

- 表註：d.f. 小於 4 時結果不可靠；顯著水準標記是 < 0.10 一顆星（L796–797）。子集 1 七個調節變項裡四個的 d.f. 小於 4。
- 情境（實驗室 vs 教室）與教育程度**沒有進調節分析**，因為一邊倒（L753–755「one category was largely predominant (laboratory settings, and more than 12 years of education), so we did not include it in the moderator analyses」）。
- 子集 2 曝光次數的分組結果：超過 4 次時 g = 0.2，95% CI [−0.07, 0.47]，p = 0.12（n = 25）；4 次以下 g = −0.04，95% CI [−0.17, 0.094]，p = 0.54（n = 26）（L807–813）。兩組的信賴區間都跨 0。
- 作者自己對這個調節效果的定性：L918–920「the advantage of the expanding schedule at high repetition rates (g = 0.2, 95% CI [− 0.07, 0.47]) being non-significant, this conclusion remains tentative.」
- 保留間隔越長、漸增越有利的假設沒有被支持：L931–932「this hypothesis was not supported by our analysis of retention interval as a moderator (β = 0.03, 95% CI [− 0.07, 0.13])」。

### 提取與分散是否相加（沒有檢定）

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 9 | Figure 4 是把本研究與過去統合分析的數字拼在一起的示意，集中閱讀的值是任意設的 0.3 | L876–885、L904–906；PDF p.21（979） | 「A tentative compilation of subset 1 meta-analysis with previous estimates … is consistent with the hypothesis that their effects are simply additive. However, the available data collected for the present review do not allow us to test directly the hypothesis of an interaction between retrieval practice and spaced learning.」 |
| 10 | 作者明說找不到足夠的研究直接比「集中閱讀 vs 分散提取」 | L959–965 | 「We did not find enough studies to perform a direct comparison between the two opposite learning strategies, namely, massed reading and spaced retrieval practice … our results are consistent with the idea that spacing and retrieval practice should have additive effects … but further research is needed to test this hypothesis.」 |

- Figure 4 圖上標的是校正後的 g = 0.74（「Spacing effect in RP, g = 0.74 (present study, Subset 1)」），間隔效果 0.71 的來源在圖上寫 Hattie, 2007、內文與參考文獻寫 Hattie 2008（L125–126、L1186）。

### Table 1 裡與 order 16 其他來源有關的列（PDF p.12（970）對過）

| 研究 | g | N | 情境 | 設計 | 教材 | 保留間隔（分鐘） | 曝光次數 | 排程 |
|---|---|---|---|---|---|---|---|---|
| Hopkins 2016，實驗 1 | 0.30 | 40 | 教室 | 受試者內 | 其他 | 57,148 | 2 | 等距 |
| Hopkins 2016，實驗 1 | 2.10 | 86 | 教室 | 受試者間 | 其他 | 57,148 | 2 | 等距 |
| Dobson 2016，實驗 1 | −0.34 | 60 | 教室 | 受試者內 | 其他 | 0 | 6 | 漸縮 |
| Dobson 2016，實驗 1 | 0.94 | 60 | 教室 | 受試者內 | 其他 | 1,440 | 6 | 漸縮 |
| Dobson 2016，實驗 1 | 0.74 | 60 | 教室 | 受試者內 | 其他 | 40,320 | 6 | 漸縮 |
| Grote 1995，實驗 1 | 0.56 | 36 | 實驗室 | 受試者內 | 其他 | 未報告 | 3 | 未報告 |

- Dobson 2016 的三列是同一批人在不同保留間隔的結果：立即測驗時集中較好（−0.34），隔 1 天與 28 天分散較好。這是子集 1 裡唯一一個負值。
- Hopkins 2016 的受試者間比較，本篇算出 g = 2.10；Murray 等 2025 的森林圖對同一份研究給的是 0.59 [0.15, 1.02] 與 0.23 [0.01, 0.45]（見 `murray2025-spacing-retrieval-math.md`）。兩篇對同一研究的數字差很多，原因我不知道。

## 作者自己列的限制（Limitations 節，L979–1002）

1. 除了 ERIC 收錄的學位論文之外，沒有系統地找未發表研究（L981–982）。
2. 子集 1 有偏向正向顯著結果的出版偏誤；作者用 trim-and-fill 估計校正後的值（L985–987）。
3. 子集 1 的異質性顯著，調節分析解釋不了；效果量數目不夠、類別調節變項的檢定力低，無法分辨「真的沒差」與「檢定力不足」（L987–995）。
4. 納入研究的實驗設定不夠多樣（教材、測驗型態、對象），無法完整檢驗這些因素（L998–1002「meta-analyses cannot make new results emerge that have not been sufficiently investigated in the experimental literature」）。
5. 子集 2 的無差異不太可能來自出版偏誤，因為出版偏誤應該會偏向漸增排程（L996–997）。

寫在別處、性質也是限制的：

- 提取與分散是否相加無法直接檢定（L881–885）。
- 調節分析多半自由度不足（L802–806、L813–814）；子集 1 曝光次數的分析「was not reliable, so we cannot conclude on this point」（L874–875）。
- 編碼只有一人（L278–279）。
- 作者指出比「固定的漸增 vs 等距」更相關的可能是依個人表現調整的適應性排程（L945–950，引 Lindsey 等 2014、Sense 等 2016、Tabibian 等 2019），但這篇沒有分析適應性排程。

## 與摘要說法不一致的地方

1. **摘要只報校正後的 0.74，沒有提未校正的 1.01，也沒有說 0.74 是 trim-and-fill 校正值**（L29–31「Results from subset 1 indicated a strong benefit of spaced retrieval practice in comparison with massed retrieval practice (g = 0.74)」）。正文的主結果是 1.01（L691），0.74 是補了 10 個假想效果量之後的估計（L704–706）。引用時兩個數字都要帶，並寫明 0.74 是校正值。
2. **摘要說調節分析「showed that the number of exposures of an item during retrieval practice explains inconsistencies between studies: the more learners are tested, the more beneficial the expanding schedule is compared with the uniform one」**（L32–35）。正文的依據是 p = 0.09（作者自訂 α = 0.1 才算顯著，L813），分組後 g = 0.2 的信賴區間跨 0，討論裡作者自己寫「this conclusion remains tentative」（L920）。而且子集 2 的 I² = 0%（L744），等於統計上沒有「研究間的不一致」可解釋。摘要的說法比正文強。
3. **摘要「29 studies」**（L23）。Table 1 列 11 份、Table 2 列 16 份，其中 Carpenter & DeLosh 2005、Balota 等 2006、Karpicke & Roediger 2007、Logan & Balota 2008 四份兩邊都有；參考文獻打星號的我數到 23 筆。11 + 16 = 27、不重複 23，都不是 29。方法一節說 42 篇全文評估後 29 篇合格（L274），但 Figure 1 的「全文評估」那格寫的是 n = 29，前一格「依題名摘要」寫 42。29 這個數字到底指什麼，原文對不起來。
4. 子集 1 的情境：正文寫實驗室 n = 9、教室 n = 4（L465–466），加起來 13，不是 11；Table 1 標成教室的只有 2 份研究。
5. 子集 1 效果量的範圍：討論寫「ranging from g = 0.29 to g = 2.16」（L831），Table 1 最小的是 −0.34（Dobson 2016），次小 0.30。子集 2 討論寫「from g = −0.53 to g = 1.02」（L888），Table 2 最小 −0.52、最大 0.99。
6. 子集 2 的 p 值內文 0.59、Table 3 是 0.62（見上）。
7. 摘要結尾「do not support the widely held belief that inter-retrieval intervals should be progressively increased」與正文一致。

## 與清單「要撐的結論」不合的地方

清單寫：「漸增間隔對等距間隔分不出來；間隔提取的效果與出版偏誤校正」。

1. **「漸增間隔對等距間隔分不出來」**：撐得住。g = 0.034，95% CI [−0.10, 0.17]，54 個比較、16 份研究，I² = 0%，Egger 不顯著（L738–749）。引用時要帶的條件：
   - 16 份研究裡 13 份是實驗室、幾乎都是成人、三分之二的比較用配對教材（L487–489、L672–683）。這是「實驗室裡分不出來」。
   - 34 個比較裡漸增排程的第一次提取是看完馬上做，等距排程則延後（L677–680），兩種排程不只差在「間隔怎麼排」。
   - 曝光超過 4 次時漸增可能略好（g = 0.2），但不顯著，作者說暫定（L918–920）。不能寫成「練習次數多時漸增較好」。
   - 這篇比的是固定的漸增與固定的等距，沒有比依個人表現調整的排程（L945–950）。「漸增沒有比較好」不等於「適應性排程沒有比較好」。
2. **「間隔提取的效果與出版偏誤校正」**：數字撐得住（1.01 → 0.74），但清單的「間隔提取」容易被讀成「間隔提取 vs 重讀」或「真實課程裡的間隔複習」，兩個都不是：
   - 對照是**集中的提取練習**，不是重讀、也不是沒複習（L213–214）。
   - 「集中」是同一題連續提取、中間不插別的題（L250–252）；「分散」在多數納入研究裡是同一次實驗內隔幾題再考，這篇沒有編碼間隔的絕對長度。
   - 39 個比較裡 23 個在訓練結束後 10 分鐘內就測（L472–474）；保留間隔一週以上的只有 5 個比較。
   - 39 個比較裡 34 個是實驗室、31 個是配對教材。教室的只有 Hopkins 2016 與 Dobson 2016。
   - 情境沒有進調節分析（L753–755），所以這篇**不能**回答「教室裡的效果是不是比較小」。
   - 0.74 是 trim-and-fill 的估計，不是實測；異質性 I² 約 47–49%。
   - 編碼只有一人。
   所以這篇對 order 16「間隔複習搬出實驗室之後」能提供的是**實驗室那一側的基準**，不是搬出去之後的證據。
3. 清單沒寫但容易被順手引的：「提取與分散的效果相加」。這是作者拿別人的統合分析數字拼出來的示意圖（Figure 4），作者明說無法檢定（L881–885、L959–965）。Murray 等 2025 引這篇時寫「the effect of spacing and testing is additive and is typically a large effect (g = 1.01, 95% CI [0.68, 1.34])」，用的是未校正值，也把「與相加假設一致」寫成了「是相加的」。

清單「之前讀到哪」寫「方法、結果表、調節變項沒讀」：這次全讀了。

## 讀取紀錄

- `.txt` 依序讀完：L1–340（首頁、摘要、前言、本研究、方法的檢索與納入標準、Figure 1 圖說、調節變項定義前半）→ L340–699（調節變項定義後半、效果量公式、合併方法、研究特徵、Table 1、Table 2、子集 1 效果量）→ L699–1048（出版偏誤、Table 3、Figure 2–3 圖說、子集 2、Table 4、討論、Figure 4 圖說、限制、實務意涵、資料可得性、作者貢獻、經費）→ L1048–1357（聲明、Appendix 1、參考文獻、出版者聲明）。參考文獻（L1076–1354）掃過，用來數打星號的納入研究。
- 對過 PDF 版面的表：Table 1（p.11–12，期刊頁 969–970）、Table 2（p.13–15，期刊頁 971–973）、Table 3（p.16，期刊頁 974）、Table 4（p.19，期刊頁 977）。四張表的數字與 `.txt` 相同。Table 1、2 在 PDF 是橫排、字小，我逐研究對過列數與效果量欄；其他欄位以 `.txt` 為準。
- 看過 PDF 的圖：Figure 1（p.6）、Figure 2a／2b（p.17）、Figure 3（p.18）、Figure 4（p.21）。
- Appendix 1（p.25，期刊頁 983）只讀 `.txt`，沒有另對 PDF；這張表是兩個三列的小表，`.txt` 欄位整齊。
- 沒有讀的：OSF 上的資料與 R 程式（`https://osf.io/jbmq4/`，正文給的是 view-only 連結）。更正啟事找不到。
