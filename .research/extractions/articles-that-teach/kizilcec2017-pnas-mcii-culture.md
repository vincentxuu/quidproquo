# 抽取紀錄：Kizilcec & Cohen 2017，PNAS 114(17), 4348–4353（doi 10.1073/pnas.1611898114）

- 完整書目：René F. Kizilcec（Stanford University, Department of Communication）、Geoffrey L. Cohen（Stanford University, Department of Psychology）。Eight-minute self-regulation intervention raises educational attainment at scale in individualist but not collectivist cultures. *Proceedings of the National Academy of Sciences of the United States of America*, 114(17), 4348–4353. 2016-07-19 收稿，2017-02-27 核准，線上 2017-04-10，期號日期 2017-04-25。編輯 Susan T. Fiske；PNAS Direct Submission（原文檔 L79、L86–121、L516）。作者全名對過 PMC 作者列（L88–112）。PMCID PMC5410783，PMID 28396404。
- 版本：PMC 上的刊出版全文（PNAS 存入 PMC 的出版者版本），含線上補充資料（SI）的 Materials and Methods、Measures、Survey Questions、Supporting Analyses 與 Table S1、S2、Fig. S1。
- 原文檔：`.research/raw/learning-content/q5-social/kizilcec-cohen2017-pnas.md`，662 行、112,921 字元（113,386 位元組）。來源網址：https://pmc.ncbi.nlm.nih.gov/articles/PMC5410783/ （檔頭 L3；經 Jina reader 轉文字）。L1–85 是 PMC 站台導覽，正文 L86–518，參考文獻 L520–575（48 條），其後是站台頁尾。
- 表格對照：PMC 的 PDF（/pdf/pnas.201611898.pdf）用 curl 與 r.jina.ai 都被 reCAPTCHA 擋，PNAS 與 Europe PMC 的 PDF／XML 也沒取到，所以**沒有對 PDF 版面**。改對 PMC 自己的結構化表格頁（HTML 的 `<td>` 逐格）：https://pmc.ncbi.nlm.nih.gov/articles/PMC5410783/table/t01/ 與 /table/st02/，存成 `q5-social/kizilcec-cohen2017-tables.md`（1,871 位元組）。Table 1、Table S2 每一格都與原文檔一致。
- 讀取日期：2026-10-14
- 供：order 24 第 8 列（與 Kizilcec 等 2020 的放大失敗對照；2020 的紀錄是 `kizilcec2020-scaling-interventions.md`）

## 研究設計

- **類型**：一份跨文化問卷調查（相關比較）加兩個隨機對照田野實驗。
- **問卷**（L180–182、L277）：Amazon Mechanical Turk 招募美國與印度的成年人，條件是過去 12 個月修過線上課。招募 367 人，排除 49 位沒過注意力檢查、2 位不是在美國或印度長大、121 位過去一年沒修過線上課，剩 195 人（美國 94、印度 101）；69% 男性，63% 是 25–34 歲。
- **實驗 1**（L188、L281、L297–303）：Coursera 上一門 10 週的研究所程度商管課（organizational analysis）。課前三波 email 招募，介入包在一份「選填的課前準備活動」問卷裡。問卷開了 29,504 次；排除沒看到任何實驗活動的、重複作答的、IP 定不出國家的 31 人、所在國沒有 Hofstede 分數的 860 人，剩 16,418 人；再排除沒寫出至少一個好處與一個障礙的人（超過 6,000 人）。另有一半對照組（占全部的 25%）因為問卷版本沒有問好處與障礙，為了排除標準一致而全部剔除。最後 9,619 人、86 國；MCII 6,507、對照 3,112（Table 1）。
- **實驗 2**（L188、L281、L301）：Open edX 上一門 6 週的計算機概論。開課時以歡迎信與課程頁連結招募，問卷開了 11,012 次。四組各 25%：MCII 2,167、MC 2,082、II 1,972、對照 2,123，合計 8,344 人、87 國（Table 1 與正文 L281）。
- **介入**（L283、L305–392）：
  - MCII：寫兩個「看完大部分課程影片」的好處與兩個可能的障礙 → 生動想像好處並書寫 → 生動想像障礙如何干擾並書寫 → 寫三個「如果…就…」計畫（兩個對應障礙，一個是何時何地看影片）。改編自 Duckworth 等 2011。實驗 2 在文字框裡預填「If …, then …」。
  - 對照：實驗 1 寫「今天或昨天的經歷與活動」；實驗 2 寫對課程的期待、每週打算花多少時間、計算機背景。
  - 中位數花費時間：MCII 8.0 分鐘（實驗 1）、6.6 分鐘（實驗 2）；對照 5.0 與 4.3 分鐘（Table 1）。
- **文化怎麼判定**（L188、L285）：用 IP 經 MaxMind GeoIP 定國家，再套 Hofstede 個人主義指數（0–100，94 國）。0–33 集體主義（例：墨西哥、中國、羅馬尼亞），34–66 平衡（例：**印度**、巴西、俄羅斯），67–100 個人主義（例：美國、澳洲、法國）。
- **量了什麼**：完課——課程成績超過講師訂的門檻（實驗 1 為 70%，實驗 2 為 80%），成績由每週評量與期末考組成（L285、L396）。另有觀看影片比例，作者因分布嚴重偏斜沒有分析（L398）。**沒有量學到什麼**，也沒有收集地區以外的人口資料（L281）。
- **分析**（L190、L285）：意向治療（所有被分派、開始活動的人都算），線性機率模型加穩健標準誤，共變項是事前自評的目標重要性與可能性。另做國家隨機效果的 logistic 混合模型、把個人主義當連續變項、換其他文化與國家層級指標的穩健性分析（SI，L474–506）。

## 結果（逐項）

### 完課率原始數字（Table 1，原文檔 L192–210，已對 PMC 表格頁）

| 條件 | 實驗 1 控制 | 實驗 1 MCII | 實驗 2 控制 | 實驗 2 MC | 實驗 2 II | 實驗 2 MCII |
|---|---|---|---|---|---|---|
| N（國家數） | 3,112（85） | 6,507（86） | 2,123（81） | 2,082（79） | 1,972（78） | 2,167（78） |
| 介入完成率 % | 94.7 | 77.5 | 95.9 | 94.1 | 97.9 | 83.8 |
| 整體完課 % | 5.42 | 6.32 | 25.4 | 25.7 | 25.9 | 27.5 |
| 個人主義國家 % | 5.52 | 7.28 | 25.7 | 24.8 | 26.2 | 29.5 |
| 平衡國家 % | 5.64 | 5.93 | 25.8 | 25.7 | 25.9 | 24.2 |
| 集體主義國家 % | 5.03 | 4.80 | 23.5 | 29.9 | 24.5 | 21.1 |

### 逐項結果

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | **整體沒有顯著效果** | 實驗 1：b = 0.008，z = 1.66，P = 0.097；實驗 2：b = 0.021，z = 1.54，P = 0.122 | MCII vs 對照，全部文化合併 | Results | L214 | 「Across all cultural contexts, MCII did not significantly increase course completion relative to the control condition in either experiment, although there was a positive trend」 |
| 2 | MC、II 單獨都沒有效果 | b < 0.005，z < 0.37，P > 0.71 | 實驗 2，MC 或 II vs 對照 | Results | L214 | 「MC and II alone did not significantly increase course completion in the second experiment」 |
| 3 | 個人主義國家：MCII 提高完課 | 實驗 1：相對提高 32%，b = 0.018，z = 2.35，P = 0.019（5.52% → 7.28%，絕對差約 1.8 個百分點）；實驗 2：相對提高 15%，b = 0.039，z = 2.41，P = 0.016（25.7% → 29.5%，約 3.8 個百分點） | MCII vs 對照，限個人主義國家 | Results、Table 1、Fig. 1 | L216 | 「MCII increased course completion by 32% (experiment 1: b = 0.018, z = 2.35, P = 0.019) and 15% (experiment 2: b = 0.039, z = 2.41, P = 0.016) for participants in individualist countries, relative to the control condition.」（絕對差是我從 Table 1 算的） |
| 4 | 集體主義與平衡國家：沒有效果 | 實驗 1：\|b\| < 0.004，\|z\| < 0.38，P > 0.70；實驗 2：\|b\| < 0.023，\|z\| < 0.67，P > 0.51 | MCII vs 對照 | Results | L216 | 「In contrast, MCII did not raise course completion in collectivist and culturally balanced countries」 |
| 5 | **反向（不顯著）**：實驗 2 集體主義國家的 MCII 組完課率低於對照 | 21.1% vs 23.5% | MCII vs 對照，集體主義國家 | Table 1 | L208 | 表列（正文沒有對這個差距另做檢定敘述，包在 #4 的 P > 0.51 裡） |
| 6 | 意外的趨勢：MC 單獨在集體主義國家 | b = 0.07，z = 1.83，P = 0.068（23.5% → 29.9%） | 實驗 2，MC vs 對照，集體主義國家 | Results；Discussion | L216、L263 | 「we unexpectedly found a trend for MC to increase course completion in collectivist countries (b = 0.07, z = 1.83, P = 0.068)」；作者自稱「Although speculative」 |
| 7 | 依障礙類型（只用實驗 1）：個人主義國家、障礙是日常義務時 | 相對提高 78%，b = 0.039，z = 2.93，P = 0.003 | MCII vs 對照 | Results、Fig. 2 | L247 | 「In this case, MCII increased course completion by 78% relative to the control condition (b = 0.039, z = 2.93, P = 0.003).」 |
| 8 | 其他障礙類型沒有效果 | 個人主義國家的其他障礙 P > 0.44；其他文化任何障礙 P > 0.094 | 同上 | Results | L247 | 「By contrast, MCII did not raise course completion in individualist countries for any other obstacle type (Ps > 0.44).」 |
| 9 | **反向趨勢**：集體主義國家、障礙是日常義務時 | b = −0.035，z = −1.67，P = 0.094 | MCII vs 對照 | Results；Discussion | L247、L261 | 「There was only an unexpected negative trend in completion due to MCII among participants in collectivist countries who faced obstacles concerning everyday obligations」；討論段寫成「rendering it not only ineffective but even counterproductive」 |
| 10 | 障礙的三個主題（LDA 主題模型，17,963 份書寫） | 日常義務、缺時間、實際障礙；「實際障礙」的代表詞含 Internet、computer、**language、understand、English** | — | Results、Table S2 | L228、L235 | 「practical barriers (Internet, computer, language, video, understand)」 |
| 11 | 障礙類型的分布 | 實際障礙占比：實驗 1 個人主義 27%、平衡 33%、集體主義 40%；實驗 2 為 32%、44%、46%。日常義務：實驗 1 為 31%、25%、22%；實驗 2 為 28%、19%、19% | 各文化間比較，χ² > 88，df = 2，P < 0.001 | Table S2 | L228、L234–243 | 表列 |
| 12 | 照做「如果…就…」格式的比例 | 實驗 1：個人主義 41% vs 非個人主義 32% 寫出 if 與 then（χ² = 54，P < 0.001）；實驗 2（已預填）：刪掉預填字樣的 24% vs 28%（χ² = 6.8，P = 0.009） | 個人主義 vs 非個人主義國家 | Results | L226 | 「24% of participants from individualist countries deleted the prompt, whereas 28% of participants from nonindividualist countries did」 |
| 13 | 書寫量差不多 | II 回答字數中位數：實驗 1 為 10 vs 12，實驗 2 為 14 vs 15（非個人主義 vs 個人主義） | 同上 | Results | L226 | 「Participants in nonindividualist countries wrote almost as much as participants in individualist countries in response to the II prompt」 |
| 14 | 問卷：印度受訪者列出較多障礙 | 中位數 4 vs 3，Kruskal–Wallis χ² = 9.50，P = 0.002 | 印度 101 人 vs 美國 94 人 | Cross-Cultural Survey | L180 | 「Indian respondents listed more obstacles…(India median = 4, US median = 3…)」 |
| 15 | 問卷：認為如果–就計畫過度簡化 | t(192) = 3.12，P = 0.002，d = 0.45 | 印度 vs 美國 | 同上 | L180 | 「They were also more likely to report that if–then plans oversimplify the complexity and ignore the uncertainty of real-life situations」 |
| 16 | 問卷：尋求社會問責 | 31% vs 4%（χ² = 21.3，P < 0.001）；事先計畫（P = 0.21）與求助（P = 0.89）沒有差異 | 同上 | 同上 | L182 | 「31% of Indian respondents, compared with only 4% of US respondents, reported seeking social accountability」 |
| 17 | 問卷：不想讓家人朋友失望 | χ² = 17.3，P < 0.001；「為自己的成就自豪」只略高（χ² = 4.82，P = 0.028） | 同上 | 同上 | L182 | 「they were substantially more motivated by a desire not "to disappoint [their] family and friends with academic failures"」 |
| 18 | 個人主義當連續變項，交互作用仍顯著 | MCII × IC：實驗 1 b = 0.01，z = 2.07，P = 0.038；實驗 2 b = 0.026，z = 2.01，P = 0.045；日常義務子群 b = 0.028，z = 2.98，P = 0.003 | — | SI Supporting Analyses | L478 | 「Thus, the findings are robust to modeling IC continuously.」 |
| 19 | 國家隨機效果的混合模型 | 個人主義國家相對提高 35%（實驗 1，z = 2.22，P = 0.026）與 22%（實驗 2，z = 2.35，P = 0.019）；日常義務子群 89%（z = 2.62，P = 0.009） | — | SI | L502–504 | 「in fact, we found even larger effects than before.」 |
| 20 | **英語能力不是調節變項** | EF 英語能力指數（EPI）與個人主義相關 r = 0.68；實驗 1 四個國家變項交互作用都不顯著（z < 1.39，P > 0.16）；實驗 2 EPI 與自由度指數不顯著（z < 1.70，P > 0.09）。英語國家在 EPI 沒有資料，作者手動補成最高值 | — | SI Economic and Other… | L492–494、L498 | 「Moreover, our pattern of results does not appear to be related to English proficiency per se. As reported above, country-level English proficiency did not moderate treatment effects consistently.」 |
| 21 | 財富與資訊科技發展只在一個實驗顯著 | 實驗 2：MCII × logGNI z = 2.18，P = 0.029；MCII × IDI z = 2.15，P = 0.032；實驗 1 都不顯著 | — | SI | L494 | 「Thus, we found some evidence that MCII is more effective in wealthy and technologically progressive countries, but only in one of two experiments. Moreover, the exploratory and post hoc nature of these analyses raises the possibility that this result arose by chance, in contrast to the role of IC, which was specified ex ante.」 |
| 22 | 其他文化指標 | 八個指標裡只有 Inglehart 的生存／自我表達（SSE，與 IC 相關 r = 0.58）在兩個實驗都顯著；逐步迴歸（AIC）兩個實驗都選了 IC | — | SI Robustness… | L484–488 | 「We found that IC was selected over all other moderators in both experiments.」 |
| 23 | 宗教文化圈 | 九個文化圈裡只有「英語圈」（澳、加、愛、紐、英、美）MCII 顯著 | — | SI | L498 | 「The only cluster that yielded a significant effect of MCII was the English-Speaking cluster…This result is unsurprising as all of these countries score highly on Hofstede's IC dimension (specifically, between 70 and 91).」 |
| 24 | 兩版對照組的完課率沒有差異（實驗 1 被剔除的那 25%） | 4.7% vs 4.8%，χ² = 0.02，P = 0.9 | 兩種對照問卷版本 | SI Materials and Methods | L303 | 「there was no significant difference in course completion between the two versions of the control condition for the original sample」 |
| 25 | 介入前的自評沒有組間差異 | P > 0.093 | 各組之間，整體與各文化內 | Self-Regulation Intervention Experiments | L190 | 「Their ratings did not differ significantly between experimental conditions either overall or within each cultural context」 |

## 作者自己列的限制

原文沒有獨立的限制節。散見的自陳：

- 財富與資訊科技發展的調節是探索性、事後的分析，可能是巧合（L494）。
- 只用實驗 1 做障礙類型分析，因為實驗 2 多兩組、各組樣本較小（L247）。
- MC 在集體主義國家的趨勢是「speculative」（L263）。
- 沒有收集地點以外的人口資料，只「expected to contain a majority of educated adults in full-time employment」（L281）。
- 觀看比例分布嚴重偏斜，沒有分析（L398）。
- 文化指標是國家層級；作者承認個人主義與財富、科技、民主、英語能力相關（L267、L492）。
- MCII 組沒做完活動的比例較高（實驗 1 完成率 77.5% vs 對照 94.7%），作者說意向治療分析會給出保守估計（L190）。

## 與摘要說法不一致的地方

1. **印度的歸類**：摘要說 MCII「may reduce its efficacy in collectivist cultures such as India or China」（L135），但正文的實驗把印度歸在「平衡」（34–66），不是集體主義（L188）。問卷部分則把印度當「the most represented collectivist country」（L180）。同一篇裡印度在問卷是集體主義的代表、在實驗是平衡文化。
2. **實驗 2 的樣本數**：正文與 Table 1 是 8,344 人（L281、L198），SI 寫「resulting in a final sample of 8,977 participants in experiment 2」（L301）。差 633 人，原文沒有解釋。摘要的 n = 17,963 = 9,619 + 8,344，與正文一致。
3. **「集體主義不受影響」**：摘要只說集體主義不受影響（L135），正文是集體主義與平衡文化都沒有效果（L216）；而且集體主義國家在兩個子群出現負向趨勢（#5、#9），摘要沒有提，討論段則說成「even counterproductive」（L261），比 P = 0.094 的證據說得強。
4. **摘要沒有說整體效果不顯著**：摘要只報個人主義子群的 32% 與 15%，沒有提兩個實驗合併各文化的整體效果都不顯著（#1）。題目「raises educational attainment at scale」也是指子群。
5. **「up to 78%」**（Significance，L129）：78% 只來自實驗 1、個人主義國家、障礙歸為日常義務的子群；混合模型是 89%。
6. **「Eight-minute」**：Table 1 的 MCII 花費時間中位數是 8.0 分鐘（實驗 1）與 6.6 分鐘（實驗 2），題目取的是實驗 1 的中位數。討論段寫「fewer than 8 min」（L259），與實驗 1 的中位數剛好 8.0 不完全一致。
7. 相對提高 32%、15% 的基數差很多：實驗 1 的完課率只有約 5%，32% 對應約 1.8 個百分點；實驗 2 約 25%，15% 對應約 3.8 個百分點。原文都用相對百分比敘述，沒有寫絕對差（絕對差是我從 Table 1 算的）。

## 與清單「要撐的結論」不合的地方

清單原句：「原始研究：個人主義文化完成率相對提高 32% 與 15%，集體主義沒有；與 Kizilcec 2020 的複製失敗對照」。

- 數字撐得住：32% 與 15% 都是原文的相對提高，P = 0.019 與 0.016。
- 要補的限定：
  1. 是相對值；絕對差約 1.8 與 3.8 個百分點（Table 1）。
  2. 兩個實驗的整體效果都**不顯著**（P = 0.097、0.122）；效果只在個人主義子群出現。
  3. 「集體主義沒有」要改成「集體主義與平衡文化都沒有」，而且集體主義在兩處有不顯著的負向趨勢。印度在實驗裡算平衡文化。
  4. 文化是用 IP 國家的 Hofstede 分數代表，不是個人的文化傾向。
  5. 量的是完課，不是學習。
- 對 order 24（語言）特別要注意：原文明確檢驗過英語能力，**國家層級的英語能力指數不是穩定的調節變項**（#20），作者的結論是「not related to English proficiency per se」。若 order 24 想用這篇談「語言讓介入失效」，原文撐不住；它談的是文化與自我調節策略的契合。另一方面，障礙主題裡的「實際障礙」包含 language、English、understand 等詞（#10），MCII 對這類障礙沒有效果（#8），集體主義國家提這類障礙的比例較高（#11）——這一點可以接到 order 24，但「實際障礙」也混了網路與電腦，不能單獨說成語言障礙。
- 與 Kizilcec 2020 的對照：本文本身沒有提到 2020 的放大研究（時間在後）。對照的數字要從 `kizilcec2020-scaling-interventions.md` 取（那份紀錄 #11：本文兩個個人主義子群 1.8 與 3.9 個百分點，放大後第二年 β = 0.25 個百分點，P = 0.662）。注意 2020 紀錄寫實驗 2 是 3.9 個百分點、本文 Table 1 算出來是 3.8（29.5 − 25.7），差異來自 b = 0.039 是迴歸係數、3.8 是原始百分比相減，兩者都對，引用時要說是哪一個。

## 讀取紀錄

- L1–85：PMC 站台導覽與書目區，讀過。
- L86–142：題名、作者、單位、編輯與收稿資訊、Significance、摘要、引言兩段。
- L143–171：MCII 理論與 Table S1（先前 12 個 MCII 研究，樣本 51–256，都在美國或德國）。
- L172–185：文化異質性的理論、跨文化問卷結果。
- L186–211：實驗設計與 Table 1。
- L212–256：結果全節、Fig. 1、Table S2、Fig. 2 圖說。
- L257–272：討論全節。
- L273–294：Materials and Methods（問卷、田野實驗）、Fig. S1 圖說。
- L295–393：SI Materials and Methods，含各組逐字指示語。
- L394–471：SI Measures、SI Survey Questions（逐題）。
- L472–507：SI Supporting Analyses 四小節。
- L508–518：致謝、註腳（無利益衝突、PNAS Direct Submission、SI 網址）。
- L520–575：參考文獻 48 條，掃過。L576–662：PMC 頁尾，掃過。
- 以上依序首尾相接，涵蓋全檔。
- 表格：Table 1 與 Table S2 逐格對過 PMC 結構化表格頁（不是 PDF 版面，PDF 被 reCAPTCHA 擋）。Table S1 沒有另外對（只是文獻整理）。Fig. 1、Fig. 2、Fig. S1 是圖片，只讀圖說，圖中數值沒看到。
