# 抽取紀錄：Mawson & Kang 2025，Behavioral Sciences 15(6):771

## 檔頭

- **書目**：Rhys D. Mawson、Sean H. K. Kang（2025）。The Distributed Practice Effect on Classroom Learning: A Meta-Analytic Review of Applied Research。*Behavioral Sciences*, 15(6), 771。doi 10.3390/bs15060771。PMC12189222。作者全名對 PDF 首頁與 Europe PMC XML 檔頭核過（XML 寫 Mawson Rhys D／Kang Sean H K）；兩位都屬 Faculty of Education, The University of Melbourne；通訊作者 Kang。收稿 2025-03-31、修訂 05-16、接受 05-23、刊出 2025-06-02。CC BY 開放取用。
- **原文檔**：`.research/raw/learning-content/q4-time/mdpi2025-distributed-practice-classroom-meta.md`，345 行（`wc -l`；Read 顯示 346 行）、82,189 位元組。來源是 Europe PMC fullTextXML 轉出的文字，圖只有圖說沒有圖。
- **本次補抓**（都是出版者自己的開放取用檔）：
  - 刊出版 PDF，28 頁：`q4-time/mdpi2025-distributed-practice-classroom-meta.pdf`，來源 `https://pub.mdpi-res.com/behavsci/behavsci-15-00771/article_deploy/behavsci-15-00771.pdf`
  - 補充資料 PDF，10 頁（完整抽取表＋R 程式碼）：`q4-time/mdpi2025-distributed-practice-classroom-meta-supplementary.pdf`，來源 `https://pub.mdpi-res.com/behavsci/behavsci-15-00771/article_deploy/behavsci-15-00771-s001.zip` 解開的 `behavsci-3588393-supplementary.pdf`
- **讀取日期**：2026-10-14
- **版本**：刊出版（version of record）
- **供哪幾篇用**：order 16（第 1 列）。補充資料表裡 Greving & Richter 2019、Lyle 等 2022 的列可供 order 16 第 4、7 列對照。
- 行號一律是 `.md` 檔的行號（L）；圖與補充資料表寫 PDF 頁碼（p.）。

## 研究設計

- **類型**：系統性回顧＋統合分析，遵循 PRISMA，有偏離（L44）。隨機效果模型、REML，R 4.3.1、metafor 4.2-0（L86、L121）。
- **納入標準**（Table 1，L49–59）：
  - 對象：小學、中學、大專在學生；只收特殊族群的研究排除。
  - 介入：分散練習，**間隔至少 1 天**；小於 1 天的排除。
  - 對照：集中練習，且學習時間與分散組相等；與其他學習策略比的排除。
  - 成果：保留或遷移的量化分數；量多次時取兩組都有量的**最長保留間隔**。質性成果排除。
  - 情境：在教室裡做、教材與課程有關；教材與課綱沒有明確關聯的排除。
- **灰色文獻**：只收學位論文（L48）。補充資料表裡標「Unpublished Dissertation」的有 Bloom & Shuell 1981、Buzzelli 2014、Camp 1973、Holdan 1986、Moss 1996、Weaver 1976（補充 p.1–7）。（Bloom & Shuell 在參考文獻列的是 *The Journal of Educational Research* 的期刊文章，與補充表的「Unpublished Dissertation」不一致，哪個對不確定。）
- **檢索**：ERIC、PsycINFO、A+ Education、ProQuest Central，建庫到 2023 年 6 月（L68）；另查 Donoghue & Hattie 2021、Ebersbach 等 2022 的參考文獻，以及納入文獻的參考文獻（L70）。檢索式在 Appendix A（L294–303）。
- **篩選流程**（Figure 1，PDF p.7，對過版面）：資料庫 2,991 筆（A+ Education 1、ERIC 58、ProQuest Central 1,669、PsycINFO 1,263）→ 去重 138、自動工具標不合格 100 → 篩 2,753 → 排除 2,545 → 取全文 208，2 篇拿不到 → 評估 206 → 排除 184（對象 10、介入 35、對照 42、成果 18、研究設計／情境 57、其他 22）。引文搜尋 11 篇（Donoghue & Hattie 1、Ebersbach 等 7、納入文獻的引文 3）→ 排除 8（介入 1、對照 4、設計 2、其他 1）。最後 **25 篇**進回顧。
- **誰篩、誰抽**：一位研究者（RM）篩全部題名與摘要；進全文的 194 篇英文非重複文獻中抽 19 篇（10%）由第二位（SK）獨立再看（L74–76）。資料抽取只有 RM 一人（L80）。沒有報告一致率數字。
- **效果量**：每個比較算 Cohen's d＝（分散組平均 − 集中組平均）÷ 合併標準差，正值代表分散較好（L84）。作者說一律用原研究報告的 M、SD 以線上計算器重算，不採原研究自報的效果量（L86）。
- **偏誤與證據確定性**：**沒有做偏誤風險評估**，理由是應用研究重生態效度（L90「an explicit risk of bias assessment was deemed irrelevant」）；只畫漏斗圖；沒有做確定性評估（L90）。
- **進入量化分析的**：25 篇裡 3 篇拿不到成果資料（Ebersbach & Barzagar Nazari 2020、Grote 1995、Barzagar Nazari & Ebersbach 2018），剩 **22 篇、31 個效果量**（L111；Table 2）。我照 Figure 2 逐列數過：31 列、22 份報告，其中 6 份報告、8 個效果量打星號（保留間隔不等或未說明：Buzzelli、Camp×2、Holdan、Lyle、Weaver×2、Yazdani），扣掉後是 16 份、23 個，與 Table 2 的分析 3 相符。
- **受試者**（補充資料表 p.1–7，對過版面）：
  - 國家：美國佔多數，另有德國、加拿大、英國、荷蘭、伊朗。
  - 年級：小學 12 個效果量、中學 14、小學＋中學 1、大學 4（Figure 7，p.16）。
  - 人數：原文正文**沒有給總人數**，只有摘要寫「N > 3000」。我把補充表 22 份報告的 N 相加約 3,200（Moss 四個效果量的 N 可能重疊，所以只能說約略），這個加總是我算的，不是作者的數字。
  - 單篇樣本最小的 Buzzelli 2014 每組 10 人、Holdan 1986 每組 14 人；最大的 Foot-Seymour & Wiseheart 2022 共 716 人。
- **保留間隔**：最長 42 天，沒有更長的（L186）。
- **領域**：數學 15 個效果量、語言 5、批判思考 3、閱讀 2、科學 2、會計 1、歷史 1、拼字 1、師資培育 1（Figure 4，p.13）。

## 結果（逐項）

### 整體效果與敏感度（Table 2，L122–131；PDF p.9 對過，數字相符）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 主分析（分析 1） | d = 0.54，95% CI [0.31, 0.77]，z = 4.631，p < 0.001；22 篇、31 個效果量；I² = 92.13% | 分散練習 vs 集中練習（學習時間相等、間隔 ≥ 1 天），取最長保留間隔的保留成績 | 3.3.2／Table 2 | L138 | 「standardized mean difference (SMD) values across included studies showed an overall significant effect of distributed over massed practice (d = 0.54, 95% CI [0.31, 0.77], z = 4.631, p < 0.001)」 |
| 2 | 分析 2：非獨立效果量取平均 | d = 0.63 [0.36, 0.89]；22 篇、25 個；I² = 94.93% | 同上 | Table 2 | L129 | 「2 \| Included \| Averaged \| 22 \| 25 \| 0.63 [0.36, 0.89] \| 94.93」 |
| 3 | 分析 3：排除保留間隔不等／未說明者 | d = 0.51 [0.31, 0.72]；16 篇、23 個；I² = 83.88% | 同上 | Table 2 | L130 | 「3 \| Excluded \| Included All \| 16 \| 23 \| 0.51 [0.31, 0.72] \| 83.88」 |
| 4 | 分析 4：兩者都處理 | d = 0.57 [0.36, 0.78]；16 篇、19 個；I² = 84.68% | 同上 | Table 2 | L131 | 「4 \| Excluded \| Averaged \| 16 \| 19 \| 0.57 [0.36, 0.78] \| 84.68」 |
| 5 | 異質性 | Q(30) = 230.33，p < 0.001；I² 超過 92% | 主分析 | 3.3.2 | L148 | 「more than 92% of the variance between studies was due to systematic influence and not chance (Q(30) = 230.33, p < 0.001)」 |
| 6 | 漏斗圖不對稱 | Egger 檢定 z = 2.719，p = 0.007，**顯著**；作者判斷不像出版偏誤，而是「小研究偏誤」 | 主分析 | 3.3.2 | L143 | 「Egger’s test (z = 2.719, p = 0.007) confirms the significant asymmetry … This suggests that the asymmetry is unlikely due to publication bias. Instead, the asymmetry likely represents a ‘small study bias’」 |
| 7 | 極端值 | Yazdani & Zebrowski 2006：d = 3.11，n = 120（Figure 2 的 CI 是 [2.58, 3.64]） | 同上 | 3.3.2／Figure 2 | L143；PDF p.10 | 「The large (d = 3.11; n = 120) effect in the study by Yazdani and Zebrowski (2006) is a notable exception.」 |
| 8 | 與先前統合分析的差距 | 本研究 0.54；Donoghue & Hattie 2021 是 0.85（混了實驗室與應用研究） | — | 4.1 | L238 | 「results of the present study indicate a somewhat smaller overall effect in comparison to previous reviews (d = 0.85; Donoghue & Hattie, 2021). The fact that the Donoghue and Hattie (2021) meta-analysis combined the effects of distributed practice in experimental and applied settings is a likely factor in this difference.」 |

- 四個分析都沒有做「拿掉 Yazdani & Zebrowski（d = 3.11）」的敏感度分析。原文沒有報告拿掉它之後的合併效果。
- 31 個效果量裡，信賴區間跨過 0 的有 **16 個**（我照 Figure 2 逐列數：Moss×4、Weaver×2、Barzagar Nazari & Ebersbach 2019b×2、Foot-Seymour 2019 (4)、Buzzelli、Greving & Richter、Camp (2)、Barzagar Nazari & Ebersbach 2019a、Goossens、Holdan、Küpper-Tetzel 7 天），點估計為負的有 4 個（Moss 二年級數學 −0.19、Moss 二年級閱讀 −0.11、Moss 四年級閱讀 −0.10、Weaver 百分比 −0.05）。這是我數的，原文只說「many studies were non-significant」（L143）。

### 領域（Table 3，L155–169；PDF p.11 對過，數字相符）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 9 | 領域當調節變項：**不顯著** | Q(8) = 7.56，p = 0.478 | 3.3.3 | L154 | 「results revealed a non-significant difference in the effect size at each level (Q(8) = 7.56, p = 0.478). This indicates that the estimated effect sizes within the nine learning domains were not significantly different from one another.」 |
| 10 | 殘餘異質性 | Q(22) = 180.85，p < 0.001；I² = 92.84% | 3.3.3 | L171 | 「this variable does not adequately explain the heterogeneity found in the main analysis」 |
| 11 | 各領域估計值 | 會計 0.67 [0.18, 1.16]；批判思考 0.41 [0.00, 0.82]；歷史 0.22 [0.00, 0.44]；語言 0.91 [0.44, 1.3]；數學 0.46 [0.09, 0.84]；閱讀 −0.11 [−0.42, 0.21]；科學 0.75 [−0.21, 1.71]；拼字 0.63 [0.03, 1.24]；師資培育 1.80 [1.15, 2.44] | Table 3 | L160–168 | 表列。語言的上限原表就寫「1.3」，只有一位小數。 |

- Table 3 有幾格與 Figure 4 的單篇數字對不上：歷史只有 Buzzelli 一個效果量，Figure 4 是 0.22 [−0.66, 1.10]，Table 3 卻寫 [0.00, 0.44]；會計、拼字、師資培育各一個效果量，Table 3 與 Figure 4 相同。表註說模型以「會計」為參照水準（L169），Table 3 各列究竟是模型估計還是另算的，原文沒有說明，**歷史那一格我無法解釋**。
- 數學 15 個效果量裡（Figure 4，p.13）：顯著的 6 個（Camp 多項式 0.44、Emeny 實驗 1 0.74、Emeny 實驗 2 0.54、Lyle 2022 0.34、Petersen-Brown 2019 0.64、Yazdani 3.11），跨 0 的 9 個。語言 5 個裡顯著 3 個（Bloom & Shuell 1.00、Küpper-Tetzel 1 天 0.98、Lotfolahi & Salehi 1.60）。
- 作者對數學的文字描述前後不同：3.4.1 說「generally positive effect sizes … distributed practice appears generally effective in the math domain」（L179）；4.1 說「effect sizes drawn from math-learning studies tended to be smaller and more frequently non-significant in the present review」（L242）；4.5.1 又說「results of the present study highlight the benefit of this strategy for math learning and in secondary school settings in particular」（L278）。
- 語言領域的大效果多半來自第二語言課堂，只有 Goossens 等 2012 一篇是一般字彙（L179）。

### 其他變項（都只有質性分組，沒有統計檢定）

作者明說這些分組比較**沒有量化檢定**：L173「This approach is taken to illustrate possible trends in effects that, although beyond the scope of this study, require statistical exploration to understand whether qualitative differences are supported by quantitative analysis.」；限制一節再說一次（L268）。

| # | 變項 | 作者的說法 | 我照圖數的 | 行號／圖 |
|---|---|---|---|---|
| 12 | 保留間隔 | 保留間隔較長時效果傾向較大；沒有超過 42 天的研究 | 1–14 天 8 個（顯著 3）；15–30 天 4 個（全顯著）；>30 天 11 個（顯著 5）；不等 2 個；未說明 6 個 | L186；Figure 5，p.14 |
| 13 | 保留間隔不等／未說明的研究 | 多數是分散組最後一次練習離測驗較近（對分散組有利），但效果量反而較小 | — | L186、L252 |
| 14 | 學習間隔 | 固定 7 天最一致地正向且顯著；漸增間隔的效果較小，有一個是負的；但漸增間隔的效果量多半來自同一套程序，不見得能推廣 | 固定 1 天 11 個（顯著 4）；固定 7 天 12 個（顯著 8）；漸增 5 個（顯著 1：Camp 多項式；負的 1：Weaver 百分比 −0.05）；可變 3 個 | L193；Figure 6，p.15 |
| 15 | 教育階段 | 小學的負向效果最多、不顯著的比例最高；中學較一致地正向且顯著；大學課堂的應用研究很少 | 小學 12 個（顯著 4、負 3）；中學 14 個（顯著 7、負 1）；小學＋中學 1 個；大學 4 個（顯著 3） | L200；Figure 7，p.16 |
| 16 | 重複接觸次數 | 次數較少時分散的優勢較大（「less is more」）；3 次以上的 5 個效果量裡 4 個來自 Moss 1996 | 1 次 5 個（顯著 3）；2 次 4 個（顯著 3）；3 次 11 個（顯著 6）；>3 次 5 個（顯著 1：Sayeski 1.80）；不明 6 個 | L207；Figure 8，p.18 |

- #15 原文一句：L200「studies in primary school settings produced the largest number of negative effects (i.e., favoring massed over distributed practice). Moreover, studies at this education level had the highest proportion of non-significant effect sizes. In contrast, secondary school-level studies produced more consistently positive and significant effects.」照圖數，中學 14 個裡顯著的是 7 個（一半），小學 12 個裡顯著 4 個（三分之一）。
- #15 的討論段：作者引 Donoghue & Hattie 2021 的數字作對照，小學平均 d = 0.57、中學 0.70（L260），並說年齡資料沒有廣泛報告，無法分開「年齡」與「教育階段的環境」（L260–262）。
- #16 的 Moss 1996：正文說「nine re-exposures to each of the reading and math learning material」（L207），補充資料表每列寫的重複接觸次數是 18（補充 p.5）。兩處不一致。
- 補充表顯示 Moss 1996 的保留間隔是「Immediately after the treatment at the next assigned computer class time」（補充 p.5），Figure 5 把它歸在「1–14 天」。

### 定性觀察（3.5 節，沒有數字）

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 17 | **沒有任何一篇讓學習者自己選擇要不要分散** | L232 | 「None of the included studies gave learners the option to practice materials in a distributed fashion without requiring it, a necessary consequence of experimental studies in which procedures are pre-determined and adherence is expected.」 |
| 18 | 「重複接觸」的形式差很多：語言字彙是同一批字再出現；數學是同概念但數字不同的題目（Lyle 2022 稱「algorithmic variants」） | L218 | 「learners in this and similar studies rarely—if ever—saw the exact same thing in each exposure」 |
| 19 | 練習的做法也不同：只重讀（Greving & Richter 2019）、做題（Weaver 1976）、複雜練習（Petersen-Brown 2023 的 Cover–Copy–Compare）、要求遷移到新情境（Foot-Seymour 兩篇） | L220 | — |
| 20 | 有沒有回饋取決於練習是主動回想還是只看；主動參與的研究較常給回饋 | L224 | 「feedback was more common in studies that involved active engagement from learners rather than just passive review」 |
| 21 | 學到達標準（learning to criterion）造成曝光量不等的混淆，也出現在應用研究裡（Petersen-Brown 2019） | L224 | 「it is one that appears to have made its way into applied studies」 |
| 22 | 誰主導練習差很多：學生自己做（Camp 1973）、同儕互練（Lotfolahi & Salehi 2017；Sayeski 2017）、老師一對一（Petersen-Brown 2019）、老師每次重教（McNellis 2015） | L232 | — |
| 23 | 被排除的常見類型：實驗室或模擬教室、教材與課程無關、把「分段排課」當成分散練習（同一個字其實沒有重複出現） | L96 | 「several studies involving second-language word learning had students review groups of words either in one long session or across several shorter sessions … However, these studies did not include repeated exposure to any one word. This represents a common misconception of distributed practice.」 |
| 24 | Lindsey 等 2014 被排除，理由是集中與分散兩種條件被合併去對交錯練習比較 | L101 | 「distributed and massed practice conditions were included in Lindsey et al.’s (2014) study, but results from both were combined to compare against interleaved practice」 |
| 25 | 真實課堂通常不是單次集中，而是把一個單元壓在幾天內教完；作者建議未來用 1 天間隔當對照 | L248 | 「in real-world classrooms, most teaching and learning tend to be condensed into distinct units that are covered intensely over a short number of days, rather than being covered in a single longer session as is done in massed practice conditions (Svihla et al., 2017). To better understand the effect of timing on distributed practice, future research could use alternative comparison conditions (e.g., 1-day interstudy intervals) that align more closely to classroom learning.」 |

### 補充資料表裡可單獨引用的列（補充 PDF p.1–7，對過版面）

| 研究 | N、年級 | 集中組 M (SD), n | 分散組 M (SD), n | d [95% CI] | 備註 |
|---|---|---|---|---|---|
| Greving & Richter 2019 | 62，中學，平均 12.94 歲（SD 0.39），德國 | 1.79 (2.04), 36 | 2.34 (2.0396), 26 | 0.27 [−0.24, 0.78] | 成果是 2 分鐘自由回想記得的概念數（滿分 5）；保留間隔 7 天；重複 1 次、間隔 7 天；977 字的生物文章 |
| Lyle、Bego、Ralston & Immekus 2022 | 180，大學部，受試者內，美國 | 0.71 (0.18), 180 | 0.77 (0.17), 180 | 0.34 [0.13, 0.55] | 24 個學習目標各練 3 題；集中是 3 題放同一份測驗、分散是連續 3 週各 1 題；保留間隔「不等」；每題 3 分鐘 |
| Yazdani & Zebrowski 2006 | 120，美國 10、11 年級 | 19.63 (1.52), 61 | 24.25 (1.45), 59 | 3.11 [2.58, 3.64] | van Hiele 幾何測驗；學習時間「未報告」，原作者只說「virtually identical」；重複次數不明、間隔 1–6 天可變、保留間隔未說明 |
| Foot-Seymour & Wiseheart 2022 | 716，加拿大小學＋中學 | 2.3 (1.4), 367 | 2.58 (1.3), 349 | 0.21 [0.06, 0.35]（保留，進分析） | 同一研究的兩個**遷移**成果是 −0.07 [−0.18, 0.03] 與 −0.01 [−0.11, 0.10]，沒有進分析 |
| Foot-Seymour、Foot & Wiseheart 2019 | 387（保留 362），加拿大 4–6 年級 | 30.8 (28.8), 186／62.6 (31.1), 186 | 56.2 (31.7), 176／68.4 (27.2), 177 | 0.84 [0.62, 1.05]／0.20 [−0.01, 0.40]（保留，進分析） | 兩個遷移成果是 0.48 [0.28, 0.69] 與 0.49 [0.28, 0.69]，沒有進分析 |
| Moss 1996 | 二、四年級，美國，學位論文 | — | — | −0.11、−0.19、−0.10、0.04 | 每週兩天各 30 分鐘 vs 每天數學 15 分＋英文 15 分，連續 9 週；每科共 270 分鐘 |
| 沒進分析的三篇 | — | — | — | Ebersbach & Barzagar Nazari 2020：保留 0.22、遷移 0.43（無 CI）；Grote 1995：0.57（無 CI）；Barzagar Nazari & Ebersbach 2018：NA | 拿不到 M、SD |

- 兩篇有遷移成果的研究，作者只取保留成績進分析（L113），所以 d = 0.54 是**保留**的估計，不含遷移。
- 補充表有幾處與正文或 R 程式碼不一致：Buzzelli 的 CI 下限寫「0.66」（Figure 2 與 R 碼對應的是 −0.66）、SE 寫 0.11（R 碼是 0.4485）；Petersen-Brown 2023 的 M、SD 欄寫「Not reported (F-test results used)」，與 L86「In all cases, reported means and standard deviations were used」不合。

## 作者自己列的限制（4.4 節，L264–272）

1. 異質性很高，可能因為納入標準有些地方定義不夠清楚：分散練習是照「時間」定義，不是照練習的內容與做法定義，導致不同性質的研究被放在一起比（L266）。
2. 效果量一律由作者用可抽取的數字重算，可能丟掉原作者做統計決定時的關鍵資訊（L268）。
3. 各變項的解讀是質性的，不是量化分析，因為資料的統計檢定力不夠；正式的調節分析需要更大的樣本（L268）。
4. 幾篇數學研究裡，分散組的作業混了不同主題，集中組沒有，等於分散與交錯（interleaving）混在一起（Camp 1973、Holdan 1986、Weaver 1976，可能還有 Yazdani & Zebrowski 2006），無法分清效果來自哪一個（L270）。
5. 無法對特殊族群下結論；效果量是組平均，看不出哪些子群受益不同（L272）。

寫在其他節、性質也是限制的：

- 保留間隔最長只到 42 天（L186）；學習間隔與保留間隔的關係無法評估（L250）。
- 多數關鍵變項報告不清或缺漏（L152、L284「a disconcerting level of unclearly reported or missing data across key variables」）。
- 年齡資料沒有廣泛報告，分不出年齡與教育階段（L260–262）。
- 沒有做偏誤風險評估與確定性評估（L90）。

## 與摘要說法不一致的地方

1. 摘要「generally larger effect sizes were associated with studies that … had learners at higher education levels」（L7）。正文的比較只有小學對中學，而且是看圖的質性描述（L200）；大學只有 4 個效果量，正文說的是「only a small number of applied studies in university-level classrooms」（L200）。沒有任何檢定支持「教育階段越高效果越大」。
2. 摘要「N > 3000」（L7）。正文沒有任何地方報告總人數，要從補充資料表自己加。
3. 摘要「22 reports containing 31 effect sizes」（L7）與正文一致；但正文 3.2.1 說進回顧的是 25 篇（L107），摘要沒有提 25。
4. 摘要「moderate effect」沒有帶出 Egger 檢定顯著（L143）與 I² 92% 這兩件事。
5. 摘要「Although a comprehensive quantitative moderator analysis was not possible」與正文一致；摘要列的三個「較大效果」方向（保留間隔長、教育階段高、重複次數少）在正文都標明沒有統計檢定（L173）。

## 與清單「要撐的結論」不合的地方

清單寫：「真實課堂的效果 d = 0.54；領域與年級的差異；沒有研究讓學習者自選」。

1. **「真實課堂的效果 d = 0.54」**：數字撐得住（L138、Table 2）。引用時要一起帶的條件：
   - 對照是「集中練習」而且學習時間相等；作者自己說真實課堂通常不是單次集中（L248），所以這個數字不是「分散 vs 平常上課」。平常上課當對照的研究（如 Benson 等 2022）是被排除的（L101）。
   - 量的是保留，不含遷移；保留間隔最長 42 天。
   - I² = 92%，31 個效果量裡 16 個的信賴區間跨 0（後者是我照圖數的）。
   - Egger 檢定顯著，沒有做校正；含一個 d = 3.11 的極端值，沒有做排除它的敏感度分析。
   - 沒有偏誤風險評估；抽取只有一人。
   - 部分數學研究的分散組同時是交錯練習（L270）。
2. **「領域與年級的差異」**：要改寫。領域的差異做過檢定，**不顯著**（Q(8) = 7.56，p = 0.478，L154）；作者自己的說法是「The magnitude—but not direction—of effect sizes favoring distributed practice appears to differ across learning domain … the meta-regression in the present did not confirm the statistical significance of this apparent difference」（L258）。年級（教育階段）的差異**完全沒有檢定**，只有看圖的描述。能寫的是「作者看圖描述的傾向」，不能寫成「領域與年級有差異」。
3. **「沒有研究讓學習者自選」**：撐得住，原文 L232 一字不差。要補的脈絡：作者說這是實驗研究的必然結果（程序事先定好），不是一個「發現」；它說明的是這批證據對「讀者自己決定要不要回來複習」這種情境沒有直接資料。

另外，清單「之前讀到哪」寫「附錄與補充資料表沒讀」：這次附錄 A 與補充資料 PDF 10 頁都讀了。

## 與同批另一篇的交叉對照（供寫作時留意）

- Yazdani & Zebrowski 2006：本篇以 d = 3.11 納入；Murray 等 2025 把它**排除**，理由是抽不到平均、標準差或人數，也聯絡不到作者（見 `murray2025-spacing-retrieval-math.md`）。兩篇對同一份研究的處理相反。
- Ebersbach & Barzagar Nazari 2020：本篇因為抽不到成果資料排除；Murray 等 2025 納入。
- Lyle 等 2022：本篇 d = 0.34 [0.13, 0.55]；Murray 等 2025 的森林圖是 g = 0.35 [0.25, 0.46]。

## 讀取紀錄

- `.md` 檔依序讀完：L1–259（檔頭、摘要、1 前言、2 方法、3 結果、4.1–4.3）→ L260–346（4.3 後半、4.4 限制、4.5 啟示、5 結論、補充資料說明、Appendix A、作者貢獻與聲明、參考文獻、資料可得性）。參考文獻（L337 一整行）掃過，用來核對哪些研究打星號（納入）。
- 對過 PDF 版面的表：Table 2（p.9）、Table 3（p.11），數字與 `.md` 相同。Table 1（納入標準）與 Table A1（檢索式）是文字表，只讀 `.md`。
- 看過 PDF 的圖：Figure 1 流程圖（p.7）、Figure 2 森林圖（p.10）、Figure 3 漏斗圖（p.11）、Figure 4–7（p.13–16）、Figure 8（p.18）。「我照圖數的」各項都出自這幾頁。
- 補充資料 PDF p.1–10 全部看過（p.1–7 抽取表、p.8–10 R 程式碼與 31 個效果量的 SMD 與 SE）。
- PDF 的 p.1–6、p.12、p.17、p.19–28 沒有另外逐頁看，內容與 `.md` 的文字相同（p.8、p.9、p.17 在讀圖時順帶看過，與 `.md` 一致）。
