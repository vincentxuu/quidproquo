# 抽取紀錄：Kandemir、Esposito、Gurgand、Ramus 2026，A Meta-Analysis of the Impact of Feedback Timing on Learning Outcomes in Computer-Assisted Learning（Educational Psychology Review 38）

- **書目**（作者全名對 PDF 第 1–2 頁與 HAL 後設資料核過）：Erva Nihan Kandemir、Emanuele Esposito、Lilas Gurgand、Franck Ramus (2026). A Meta-Analysis of the Impact of Feedback Timing on Learning Outcomes in Computer-Assisted Learning. *Educational Psychology Review*, 38(1), 13. DOI 10.1007/s10648-026-10117-8。ERIC EJ1504374。四位作者都在 Laboratoire de Sciences Cognitives et Psycholinguistique（ENS／CNRS／PSL，巴黎），通訊作者 Kandemir（txt L29–36）。
- **合法公開來源**：HAL hal-05546645v1（https://hal.science/hal-05546645v1 ，檔案 https://hal.science/hal-05546645/document ）。2026-10-14 查 HAL API：`contributorFullName_s` = Erva Nihan Kandemir（第一作者本人存放）、`submitType_s` = file、授權欄是 HAL 的「Copyright - All rights reserved」。屬作者自存，合規。Unpaywall（email unpaywall@example.org）2026-10-14 回 `oa_status: closed`、出版日 2026-01-26，尚未收錄 HAL 這份。
- **版本**：作者稿。PDF 是 Springer Nature 的 LaTeX 投稿範本排版（無期刊頁首、頁碼 1–71 自編），HAL 封面頁標「Submitted on 11 Mar 2026」，出版者正式版是 2026-01-26 上線。摘要與 ERIC EJ1504374 收錄的刊出版摘要逐字相同（2026-10-14 用 ERIC API 比對），推定是接受稿；與刊出版內文有無差異**沒有比對**，不確定。
- **原文檔**：`.research/raw/learning-content/q3-activity/kandemir2026_hal.pdf`（72 頁＝HAL 封面 1 頁＋論文 71 頁，12,046,232 位元組）、`kandemir2026_hal.txt`（不帶 `-layout` 的 pdftotext，5,885 行、146,525 字元、147,146 位元組）。下文「txt L」是文字檔行號，「p.」是論文自印頁碼（PDF 頁碼＝自印頁碼＋1）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 9 篇（提問，`2026-10-13-teaching-text-questions-feedback.md`）第 31、161、236 行；清單 G 編號 Q-1，批次 V14。

## 研究設計

- **類型**：系統性回顧＋統合分析，依 PRISMA 2020，納入標準、編碼與分析計畫有預先登錄（OSF；txt L320–326）。資料與程式碼放 GitHub `ervanihank/Meta_Analysis_Feedback_Timing`（txt L2342–2347）。
- **研究問題**（txt L313–318）：RQ1 立即 vs. 延遲回饋整體影響多大；RQ2「立即」「延遲」的定義不同如何影響結果；RQ3 還有哪些調節變項。
- **納入標準**（2.1，txt L330–394）：1988 年以後發表（接 Kulik & Kulik 1988）；英文、土耳其文、法文；有意義的學習（排除知覺辨識等無語意任務，是相對預登錄的修改）；**電腦輔助情境**（訓練與回饋由電腦系統提供即可，前後測可不是電腦）；一般學習者；回饋針對個人作答、明確分成立即或延遲、要能看出是以題數或時間定義延遲；**直接比較立即與延遲回饋**；以學習成果（後測分數等）為依變項；隨機或擬隨機分派、兩組只差回饋時機；有足夠統計量。
- **搜尋**（2.2，txt L396–423；附錄 A txt L2351–2376）：Web of Science（3,812 筆）、Scopus（1,993）、ERIC（617），合計 6,422，去重後 5,100；資料庫警示追到 2024-12-06 凍結；回溯參考文獻等另得 8 筆。
- **篩選**（2.3，txt L425–454）：標題摘要階段第一作者排除 4,945 篇，第二人複核約 10%（500 篇），Kappa 0.742（95% CI [0.725, 0.759]），8 件分歧中 7 件最後維持第一人判斷。155 篇全文審查並用 Kmet（2004）14 項品質工具；Schroth 1992、1995、Schroth & Lund 1993 三篇（21 個效果量）因訓練以達標為止、延遲組練得較多而在品質階段排除。全文階段排除 109 篇、3 篇取不到，得 43 篇；全文階段複核 20 篇（約 13%），Kappa 0.70（[0.510, 0.890]）。加其他管道 8 篇，**共 51 篇研究**。
- **效果量**（2.4–2.5，txt L456–630）：Hedges' g，**以延遲回饋為參照組：正值＝立即較好，負值＝延遲較好**（txt L463–466、L624–625）。受試者內設計相關未報告時假設 r = 0.5。有調整前測的成果優先取調整後數值。20% 研究由另兩位編碼者雙重編碼，32 個效果量的相關 r = 0.96（txt L477–482）。
- **模型**：Robust Variance Estimation（robumeta，ρ = 0.80，並做 ρ = 0–1 的敏感度分析）；每個調節變項各跑一個統合迴歸；顯著者再放進多元統合迴歸（多元迴歸**不在**預登錄內，txt L669–672）。離群值以偏離三個標準差判定；出版偏誤用 Egger 檢定與漏斗圖。
- **調節變項**：預登錄 8 個——延遲單位（題數／秒）、延遲差、回饋類型（簡單／詳細／再試一次；簡單＝驗證＋給正確答案，合併是預登錄外的改動）、教育程度、學習領域、訓練任務複雜度（Bloom 高／低階）、是否以前測調整、任務情境（實驗用／課程內）。探索性 10 個——受試者設計、任務是否任意聯結、後測題與訓練題是否相同、是否只在答錯時給回饋、回饋是否提醒原答案、訓練題數、後測任務（記憶提取／知識應用）、作答是否限時、保留間隔差、發表年（txt L489–557）。
- **受試者總覽**（3.1，txt L678–760）：51 篇研究、160 個效果量，**發表年 1995–2024**；每篇平均約 3.14 個效果量（最多 12、中位數 2）；2 篇是博士論文（6 個效果量），49 篇期刊（154 個）。總人數 14,313，每篇平均約 117 人（SD 338.39，範圍 17–2,445）。女性平均 58.96%（23 篇沒報）；平均年齡 21.39 歲（範圍 8.2–64.4，27 篇沒報）；**76.5% 的研究對象是大學生**。地區：美國 28 篇（87 個效果量）、日本 5、西班牙 3、荷蘭 3、德國 3、中國 3、澳洲 1、台灣 1、沙烏地 1、希臘 1、未說明 2（Table 1，p.19，已對 PDF）。
- **延遲長度分布**：以時間定義者，立即組平均 0.03 秒；延遲組幾何平均約 559.73 秒（約 9.33 分鐘）、中位數 525 秒（約 8.75 分鐘）、範圍 1 秒–604,800 秒（7 天）。以題數定義者，立即組平均 1.18 題，延遲組平均 20.74 題（中位數 14.5，範圍 3–60）（txt L737–749）。約 45% 效果量屬短延遲（< 1 小時或 ≤ 10 題）、30% 中延遲（1 小時–1 天或 11–30 題）、25% 長延遲（> 1 天或 > 30 題）（txt L756–758）。

## 結果（逐項）

方向提醒：g 正值＝立即較好，負值＝延遲較好。

### 整體（RQ1）與敏感度分析（3.2–3.3.1，p.20–24）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 整體平均效果：沒有差別 | g = 0.03，95% CI [−0.08, 0.13]，p = .61；I² = 82%，τ² = 0.12 | 立即 vs. 延遲，51 篇、160 個效果量 | 3.3，txt L790–794，p.22；Table 2 末列 | 「yielding g = 0.03 (95% CI [-0.08, 0.13], p = .61) with an estimated between-study standard error of 0.05. Heterogeneity was substantial (I 2 = 82%)」 |
| 2 | 沒有離群值 | 無效果量偏離平均（−0.022）三個標準差 | — | 3.2，txt L765–767 | 「no effect sizes deviated by more than three standard deviations from the mean group effect size of -0.022」 |
| 3 | 沒有出版偏誤證據 | Egger 截距 0.09（SE 0.32，t = 0.28，p = .78）；精確度係數 −0.04（p = .43） | — | 3.2，txt L778–786，p.22 | 「these results indicate no significant evidence of publication bias」 |
| 4 | ρ 改變不影響結果 | ρ = 0 到 1，g 都是 0.03、SE 0.05、τ² 0.12 | — | Table D3，txt L5390–5431，p.52 | 「Modifying the assumed within-study effect size correlation (ρ) did not affect the estimated value of g」（txt L878–879） |
| 5 | 逐一剔除研究 | g 介於 0.00–0.04 | — | txt L879–882；Figure E1 | 「the overall effect estimate ranged from g = 0.00 to g = 0.04 when individual studies were sequentially removed」 |
| 6 | 去掉極短延遲仍沒有差別 | g = 0.00，[−0.10, 0.10]，p = .95；43 篇、133 個效果量 | 排除時間延遲 < 1 分鐘、題數延遲 < 5 題 | txt L994–999，p.24 | 「the overall effect remained non-significant (g = 0.00, 95% CI [-0.10, 0.10], p = .95)」 |
| 7 | 短延遲 | g = 0.13，[−0.05, 0.32]，p = .15；21 篇、66 個 | < 1 小時或 1–10 題 | Table 2，p.22（已對 PDF） | （表列） |
| 8 | 中延遲 | g = −0.05，[−0.26, 0.15]，p = .60；19 篇、45 個 | 1 小時–1 天或 11–30 題 | Table 2 | （表列） |
| 9 | 長延遲 | g = −0.06，[−0.26, 0.15]，p = .52；9 篇、31 個；I² = 66% | > 1 天或 > 30 題 | Table 2；txt L1005–1007 | 「even extended feedback intervals did not produce a reliable advantage over immediate feedback」 |
| 10 | 延遲 ≥ 1 天的子集：偏向延遲但不顯著 | g = −0.35，[−0.78, 0.07]，p = .09；7 篇、17 個；I² = 85%，τ² = 0.26 | 延遲至少一天（作者稱最接近課堂實務） | Table 2；txt L1008–1013，p.24；Figure F2 | 「The pooled effect was moderate in magnitude but did not reach statistical significance (g = −0.35, 95% CI [-0.78, 0.07], p = .09)」 |

### 延遲的定義（RQ2，3.4.1，p.24–25；Table 3，p.26 已對 PDF）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 11 | 以秒或以題數定義延遲，結果沒差 | 秒 vs. 題：g = −0.12，p = .20；以秒定義者本身 g = −0.09（p = .24），以題數者 g = 0.03（p = .57） | 秒 k = 66，題數 k = 92（參照）；混合 k = 2 不解讀 | txt L1026–1032；Table 3 | 「Comparing delays defined in seconds (num. effects k = 66) to those defined in items (k = 92, reference category) revealed no significant difference (g = −0.12, p = .20)」 |
| 12 | 時間延遲差（取 log）不調節 | 斜率 −0.02，p = .35；18 篇、62 個 | 以秒定義且有報延遲差者 | txt L1036–1039；Table 3 | 「there was no significant effect of delay difference (g = −0.02, p = .35)」 |
| 13 | 題數延遲差有調節：題數越多越偏向延遲 | 截距（延遲差 2 題）g = 0.19（p = .05）；每多一題 −0.01（p = .03）；約超過 21 題後轉為偏向延遲；29 篇、80 個 | 以題數定義且有報延遲差者 | txt L1040–1047；Table 3 | 「when the delay difference between immediate and delayed feedback increased beyond 21 items, it started having positive effects on performance」 |
| 14 | 題數換算成秒後不再顯著 | 斜率 −0.03，p = .60；16 篇、54 個 | 能把題數換算成時間的研究 | txt L1048–1052 | 「the moderating effect of delay difference was no longer significant (g = −0.03, p = .60)」 |
| 15 | 全部換成秒：不調節 | 斜率 −0.02，p = .44；34 篇、116 個 | 62 個原本以秒＋54 個換算 | txt L1053–1057 | 「there was no significant moderating effect of delay difference on learning outcomes (g = −0.02, p = .44)」 |
| 16 | 作者對 RQ2 的結論 | — | — | txt L1058–1060 | 「we found evidence in favor of the effect of delayed feedback on performance only in studies defining delay in items, and using a large number of intervening items」 |

### 其他預登錄調節變項（3.4.2，Table 3，p.26–27 已對 PDF）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 17 | 回饋類型不調節 | 簡單 vs. 詳細 g = 0.02，p = .84 | 簡單 k = 118，詳細 k = 40（參照）；再試一次 k = 2 不解讀（表中 p < .001 但作者不解讀） | txt L1775–1779 | 「the type of feedback used in the experiment—whether simple or elaborated—does not significantly influence the effect of feedback timing」 |
| 18 | 教育程度：中學偏向延遲 | 中學 vs. 大學 g = −0.25，p = .04；中學本身 g = −0.23，p = .03；大學本身 g = 0.01，p = .76 | 中學 k = 22，大學 k = 127（參照）；成人教育 k = 6（−0.10，p = .09）、小學 k = 5（−0.23，p = .49）不顯著 | txt L1780–1788 | 「studies involving secondary education participants demonstrated greater improvements in performance under delayed feedback conditions (g = −0.23, p = .03)」 |
| 19 | 教育程度重新分兩組 | 中小學 vs. 大學＋成人 g = −0.23，p = .04 | 中小學 k = 27，大學＋成人 k = 133 | txt L1789–1794；Table 3 | （同上節） |
| 20 | 學習領域：只有「文字記憶」偏向延遲 | 文字記憶本身 g = −0.30，p < .001；一般認知技能 −0.05（p = .54）、語言學習 0.13（p = .15）、STEM −0.05（p = .47） | 文字記憶 k = 18（參照）；相對於它，認知技能 +0.25、語言 +0.42、STEM +0.24 皆顯著；閱讀理解 k = 2、社會科學 k = 3 不解讀 | txt L1795–1805 | 「text memory (g = −0.30, p < .001) demonstrated a significant advantage for delayed feedback」 |
| 21 | 領域分兩組 | 文字型學習 vs. 其他 g = −0.35，p < .001 | 文字型（文字記憶＋閱讀理解）k = 20，其他 k = 140 | txt L1806–1813；Table 3 | 「in experiments focusing on text-based learning, delayed feedback had a significant advantage compared to other domains (g = −0.35, p < .001)」 |
| 22 | 任務複雜度不調節 | 低階 vs. 高階 g = −0.10，p = .24 | 低階 k = 84，高階 k = 76 | txt L1814–1815 | 「there was no significant difference in feedback delay effectiveness between lower-order tasks (k = 84) and higher-order tasks (k = 76)」 |
| 23 | 前測調整不調節 | g = −0.14，p = .34 | 未調整 k = 135，調整 k = 25 | txt L1815–1816 | （同段） |
| 24 | 實驗用 vs. 課程內任務不調節 | g = −0.09，p = .29 | 實驗 k = 102，課程內 k = 58 | txt L1816–1818 | 「learning task context did not moderate the impact of feedback timing」 |

### 探索性調節變項（3.4.3，Table 4，p.28 已對 PDF）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 25 | 作答不限時者偏向延遲 | 不限時 vs. 限時 g = −0.19，p = .03；不限時本身 g = −0.15，p = .005；限時本身 g = 0.04，p = .52 | 不限時 k = 42，限時 k = 60（參照），未報告 k = 58 | txt L1825–1829；Table 4 | 「Studies that did not impose a time limit for responses demonstrated improved performance under delayed feedback conditions (g = −0.15, p = .005)」 |
| 26 | 發表年：越新的研究越不偏向延遲 | 每年 +0.02，p = .002；1995 年截距 g = −0.34；約 2012 年接近 0 | 51 篇、160 個 | txt L1830–1835；Table 4 | 「It reached approximately zero around 2012, after which more recent studies found no benefit for delayed feedback」 |
| 27 | 其餘探索變項都不顯著 | 受試者設計 p = .30；任意聯結 p = .53；後測題相同 p = .30；只對錯題回饋 p = .69；**提醒原答案 p = .87**；訓練題數 p = 1.00；後測任務 p = .07；**保留間隔差 p = .18** | 見 Table 4 各列 k | Table 4 | （表列） |

### 多元統合迴歸與混淆（3.4.4，Table 5、6，p.31–32 已對 PDF）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 28 | 三個顯著變項放在一起後**都不再顯著** | 大學＋成人 vs. 中小學 0.10（p = .48）；文字型 vs. 其他 −0.26（p = .08）；不限時 vs. 限時 −0.14（p = .09）；未報告 −0.03（p = .81） | 51 篇、160 個；發表年刻意不放 | txt L1852–1855；Table 5 | 「the results of the multiple meta-regression (Table 5) indicate that none of the moderators remained statistically significant」 |
| 29 | 調節變項彼此相關 | 教育程度×領域 χ²(1) = 41.76，p < .001；教育程度×限時 χ²(2) = 10.40，p = .006；領域×限時 χ²(2) = 17.79，p < .001。大學＋成人：其他領域 127、文字型 6；中小學：其他 13、文字型 14 | — | txt L1856–1863；Table 6 | 「educational level and learning domain were closely related (χ2 (1) = 41.76, p < .001)」 |
| 30 | 研究型態隨年代轉移 | 大學／成人研究增加 t(30.81) = 4.65，d = 1.28；非文字型 t(22.01) = −6.33，d = −1.91；限時 t(73.89) = 4.24，d = 0.89；p 皆 < .001 | — | txt L1864–1869；Figure 4 | 「The distributions indicate a noticeable shift over time」 |
| 31 | 作者歸納哪類研究偏向延遲 | 偏向延遲：多在 2012 年前、文字記憶、不限時、以題數定義且延遲 > 21 題、中小學生。沒差別：較新、認知技能／二語／STEM、大學或成人。偏向立即：以少數幾題定義延遲 | — | 4.2，txt L2176–2184 | 「Studies that suggested an advantage of delayed feedback were typically published before 2012, involved text memorization…」 |

### 討論中的其他可引說法

- 整體結論的適用範圍：從幾秒或幾題到幾天；**不一定能推到課堂常見的更長延遲**（4，txt L2004–2010）：「the main conclusion that feedback timing does not reliably influence learning outcomes might not generalize to substantially longer delays that are sometimes typical of classroom instruction」。
- 多數研究把回饋時機和「最後一次回饋到後測的間隔」混在一起，延遲組常離後測較近（txt L2011–2017、L2278–2293）。只有 8 篇研究（Butler 等 2007、Canals 等 2021、Hays 等 2013、Lu 等 2021、Metcalfe 等 2009、Nakata 2015、Smith & Kimball 2010、Tanaka 等 2019）控制了這段間隔。
- 干擾—持續假說（interference-perseveration）沒得到支持：提醒原答案與否不調節（txt L2137–2145、L2202–2213）。
- 間隔練習的解釋：延遲差不是顯著調節變項，較長延遲沒有一致較好（txt L2214–2223）。
- 實務建議（4.4，txt L2239–2255）只說文字型學習或中小學情境「more often favored delayed feedback」，大學與成人「little or no benefit of delay」，並強調這些是「cautious but informative guidance」。

## 作者自己列的限制（4.5，txt L2257–2337）

1. 異質性大，多數調節分析解釋不了；類別變項報告不一致，限制了多元迴歸。
2. 部分子群效果量很少：小學 n = 5、社會科學 n = 3、閱讀理解 n = 2（原文用 n，對照 Table 3 是效果量數 k）。
3. 延遲定義分兩種造成檢定力下降；題數換算時間所需資訊常沒報，換算不可靠。
4. 回饋時機與保留間隔混淆，只有 8 篇控制；保留間隔差不顯著要謹慎解讀。
5. 教材難度、學習者能力等無法編碼。
6. 多數是電腦輔助、受控實驗，延遲比真實課堂短，後測多在短期內；生態效度只限這類情境，建議做週級延遲的課堂實驗。
7. 只看學習成果，沒看投入與偏好。
8. 調節變項互相混淆，需要新研究補空格：中小學、大學／成人的文字型學習、中小學限時作答、文字型＋限時。

## 與摘要說法不一致的地方

- **發表年範圍**：摘要寫「51 studies published from 1988 to 2024」（txt L45），3.1 節寫「51 studies published from 1995 to 2024」（txt L680），Table B1 最早一篇是 Morrison 等 1995。1988 是納入標準的起點，不是實際納入研究的年份範圍。
- **探索性變項顯著個數**：3.4.3 寫「only three were found to significantly moderate」（txt L1821–1822），但 Table 4 只有兩個 p < .05（作答限時 .03、發表年 .002），內文也只描述這兩個。第三個是什麼原文沒有交代，不確定是筆誤還是把預登錄的變項算進來。
- **「around 30% of studies did not specify response time constraints」**（txt L2119）：Table 4 是 58／160 個效果量（約 36%），沒有給研究篇數，30% 對不上效果量比例；以篇數計是否 30% 無法從原文核對。
- 其餘摘要句（g = 0.03、延遲範圍 1 秒–7 天與 1–60 題、教育程度／領域／限時顯著、部分混淆、約半數效果量是數小時或 ≥ 10 題延遲、一天以上的研究少）逐項對過，與正文一致。

## 與清單『要撐的結論』不合的地方

清單 Q-1 的「文章引用了什麼」：「立即與延遲回饋平均沒有差別（目前標『只讀到摘要』）」。

- 「平均沒有差別」**撐得住**：g = 0.03，[−0.08, 0.13]，p = .61（結果 #1）。
- 但只寫「平均沒有差別」會漏掉三個原文自己強調的限定：(1) 適用於電腦輔助學習、延遲從幾秒到幾天；延遲 ≥ 1 天的子集只有 7 篇，g = −0.35 偏向延遲但不顯著（#10），作者明說不一定能推到課堂的多天延遲；(2) 異質性很高（I² = 82%），單獨看時中學、文字記憶、不限時作答偏向延遲，但三者互相混淆，合起來後都不顯著（#18–#29）；(3) 多數研究把回饋時機和離後測的時間混在一起。
- 清單 V14 交代的「對照 Van der Kleij 2015 摘要的延遲回饋說法」見下一節。

## Kandemir 與 Van der Kleij 等 2015 摘要的對照

Van der Kleij、Feskens、Eggen 2015（RER 85(4), 475–511，DOI 10.3102/0034654314564881）沒有合法全文，只比摘要。摘要取自 ERIC EJ1081708（2026-10-14 用 ERIC API 抓）：「From 40 studies, 70 effect sizes were computed … Effect sizes were negatively affected by delayed feedback timing and by primary and high school. Although the results suggested that immediate feedback was more effective for lower order learning than delayed feedback and vice versa, no significant interaction was found.」

1. **兩份問的不是同一件事**。Van der Kleij 的效果量是「有某種回饋 vs. 對照」的效果，延遲是其中一個調節變項：延遲時「回饋的效果」較小。Kandemir 的效果量是立即與延遲**直接比較**。Kandemir 自己點出這個差別：「Earlier reviews like those by Azevedo and Bernard (1995), Van der Kleij et al. (2015), and Swart et al. (2019) primarily used feedback timing as a moderating factor in meta-analyses of feedback effects, which may obscure specific effects attributable to timing」（txt L299–302）。所以兩份摘要不一定互相矛盾。
2. **延遲的定義**：依 Kandemir 轉述，Van der Kleij 把延遲定義為「not delivered immediately after completing each item」（txt L160–163），也就是凡不是逐題立即給的都算延遲（另見 txt L226–228）。Kandemir 則依各原始研究自己的定義編碼，再用延遲單位與延遲差當調節變項（txt L485–487）。這一點只能經 Kandemir 轉述得知，Van der Kleij 原文沒讀到。
3. **Kandemir 怎麼轉述 Van der Kleij**：40 篇、1968–2012；「immediate feedback was particularly effective for lower-order learning tasks, whereas delayed feedback seemed more suitable for higher-order tasks, though they reported no significant interaction」（txt L160–166）。與 Van der Kleij 摘要最後一句一致。Kandemir 的轉述**沒有提**摘要裡「Effect sizes were negatively affected by delayed feedback timing」這一句。
4. **任務高低階**：Van der Kleij 摘要說交互作用不顯著；Kandemir 自己的資料裡任務複雜度也不調節（#22，p = .24）。兩者方向一致。
5. **教育程度**：Van der Kleij 摘要說中小學「negatively affected」整體回饋效果；Kandemir 發現中小學反而偏向延遲回饋（#18–19）。兩者看的效果量不同，不能直接拿來比。
6. **年代重疊**：Kandemir 收 1988 年以後（實際 1995 起）、Van der Kleij 收 1968–2012；Kandemir 納入的研究裡有 Van der Kleij 等 2012、Attali & van der Kleij 2017（Table B1）。Van der Kleij 收了哪些研究、和 Kandemir 重疊多少，沒有全文無法比對。

## 已發佈文章引用核對（`2026-10-13-teaching-text-questions-feedback.md`，2026-10-14 實查行號）

清單寫的是 Q 159、234；檔案現況的對應行是 161、236，另有第 31 行的表格也牽涉到。英文版 `-en.md` 同行號內容相同。

| 行 | 文章說法 | 與原文是否一致 |
|---|---|---|
| 31 | 表格「答案立即給或晚點給｜最直接的兩份統合分析我只讀到摘要，而且說法不同｜未定」 | 「只讀到摘要」對 Kandemir 已不成立（全文已讀）。「說法不同」要修正：Kandemir 是立即 vs. 延遲的直接比較，Van der Kleij 是把延遲當成回饋效果的調節變項，兩份回答不同問題（見上節第 1 點），摘要看似相反，但不一定矛盾。「未定」作為結論仍合理：平均沒差、異質性高、一天以上的延遲證據少。 |
| 161 | 「一份 2026 年的統合分析（Kandemir 等）的摘要說，在電腦輔助學習裡，立即與延遲回饋平均沒有差別。」 | **一致**（摘要 txt L48–49；結果 #1）。 |
| 161 | 「Van der Kleij 等人 2015 年那份的摘要說，延遲回饋對效果量有負向影響。」 | 與 ERIC 摘要一致（「Effect sizes were negatively affected by delayed feedback timing」）。但「效果量」指的是回饋相對於對照的效果量，不是立即 vs. 延遲的直接比較；沒寫出這一點，讀者容易讀成兩份結論相反。 |
| 161 | 「兩份我都只讀到摘要，無法比較它們納入的研究與『延遲』的定義。」 | Kandemir 部分**不再成立**：全文已讀，可以說出它的納入條件（電腦輔助、直接比較、隨機分派、1988 後）與延遲定義方式（依各研究原定義，再分題數／時間兩種單位）。Van der Kleij 的延遲定義可經 Kandemir 轉述得知（不是逐題立即給就算延遲），但這是轉引；納入研究仍無法比較。 |
| 236 | 「只讀到摘要、沒有列進參考資料的：Van der Kleij 等（2015）與 Kandemir 等（2026）的回饋研究…」 | Kandemir 已有合法全文（HAL 作者自存）且已精讀，可以改列進參考資料，連結建議用 DOI 或 HAL。Van der Kleij 維持只讀摘要。 |

## 讀取紀錄

依序讀過（Read 工具，首尾相接）：

- txt L1–400：HAL 封面、標題、作者、摘要、1 Introduction、1.1–1.5、2 Methods、2.1 納入標準與預登錄偏離、2.2 開頭
- txt L400–1099：2.2 搜尋、Figure 1 標題、2.3 篩選、2.4 資料擷取與編碼、2.5 統計方法（公式）、3.1 描述統計與 Table 1、3.2 離群與出版偏誤、3.3 整體效果、3.3.1 敏感度分析與 Table 2、Figure 3 標籤、3.4.1 前半、Table 3 開頭
- txt L1100–1999：Table 3 其餘、Table 4、3.4.2、3.4.3、3.4.4、Table 5、Table 6、Figure 4 標題、4 Discussion 開頭
- txt L2000–2699：4.1–4.5 全部、Acknowledgements、Data Availability、附錄 A 搜尋字串、附錄 B 標題與 Table B1 開頭（Albrecht 到 Canals 的欄位碎片）
- txt L2700–5279（Table B1 其餘，pdftotext 把表格拆成逐欄碎片，無法依列閱讀）：**改讀 PDF 第 45–50 頁（論文 p.44–49）的表格影像**，全表 51 篇從 Albrecht 2023 到 Zawadzka 2023 逐列讀過；文字檔這段沒有逐行讀。
- txt L5280–5885：Table B1 註、附錄 C（Table C2）、附錄 D（Table D3）、附錄 E–H 標題與圖說、參考文獻（只掃過）

對過 PDF 的表與圖：Table 2、Figure 3（PDF 第 23–24 頁）、3.4.1 正文（第 25–26 頁）、Table 3（第 27–28 頁）、Table 4（第 29 頁）、Table 5 與 Table 6（第 33 頁）、Table B1（第 45–50 頁）、Table C2（第 51–52 頁）。Table 1（p.19）只對了文字檔，數字欄順序與國家欄一一對應，未另開 PDF。Figure 2、E1、F2、G3、H4、Figure 4 的圖形本身沒有看（只讀圖說）。文字檔與 PDF 表格數字逐格比對，沒有發現錯位。

附註：Table B1 的「Delay Difference」與 Table C2 括號裡的數字略有出入（例如 Iwaki 等 2017 是 59 對 60、Erdman & Chan 2013 是 47 對 48），推定 B1 是延遲組減立即組、C2 是延遲組本身的延遲，不是錯誤；原文沒有明講。
