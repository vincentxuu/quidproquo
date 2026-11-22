# 抽取紀錄：Murray、Horner & Göbel 2025，Educational Psychology Review 37:75

## 檔頭

- **書目**：Ewan Murray、Aidan J. Horner、Silke M. Göbel（2025）。A Meta-analytic Review of the Effectiveness of Spacing and Retrieval Practice for Mathematics Learning。*Educational Psychology Review*, 37, 75（共 28 頁）。doi 10.1007/s10648-025-10035-1。作者全名對 PDF 首頁核過。三位都在 University of York 心理系；Horner 另屬 York Biomedical Research Institute，Göbel 另屬奧斯陸大學。收稿 2025-02-04、接受 2025-05-25。
- **原文檔**：`.research/raw/learning-content/q4-time/murray2025-spacing-retrieval-math-meta.txt`，1,217 行、85,828 位元組。來源是共同作者 Horner 個人網站上的 PDF（`http://aidanhorner.org/papers/Murrayetal_EdPsychReview_2025.pdf`），版面是 Springer 刊出版。這份期刊是單欄排版，`pdftotext -layout` 沒有造成左右交錯。
- **本次補抓**：
  - 同一份 PDF 另存：`q4-time/murray2025-spacing-retrieval-math-meta.pdf`（28 頁），用來看圖。
  - 出版者的補充資料（Springer ESM，docx）：`q4-time/murray2025-spacing-retrieval-math-meta-supplementary.docx`，來源 `https://static-content.springer.com/esm/art%3A10.1007%2Fs10648-025-10035-1/MediaObjects/10648_2025_10035_MOESM1_ESM.docx`。用 pandoc 轉成文字讀，約 300 行（表格攤平後）。
  - OSF 上的資料包（`https://osf.io/qtfcu/`，`data_and_analyses_300125.zip`）日期是 2025-01-30，早於正文說的 2025-02-25 補檢索，**沒有拿來用**。
- **讀取日期**：2026-10-14
- **版本**：刊出版
- **供哪幾篇用**：order 16（第 2 列）
- 行號（L）是 `.txt` 的行號；圖寫 PDF 頁碼；補充資料寫「補充 Table n」。

## 研究設計

- **類型**：預先註冊的統合分析（OSF `https://osf.io/qtfcu/`，L272），只收數學教材。作者自己說有偏離預註冊（調節變項從多變量改成單變量，L430–439；「需要提取」從是／否改成確定／不確定，L872–874）。
- **三個問題**（L231–237）：(1) 數學練習分散是否比集中保留更好；(2) 數學的提取練習是否比重學保留更好；(3) 分散＋提取是否比集中提取更好。**第三題因為研究不夠沒有做**（L235–237、L768–769）。
- **納入標準**（Table 1，L298–307；PICOS 表在附錄，L929–955）：用了間隔重複或提取練習（或兩者）；受試者要學數學教材；以後測量表現；有英文摘要。排除：非實驗設計、臨床族群、抽不出只屬於數學教材的效果量。實驗室或教室都收，年齡與教育階段不限。
- **成果指標**：後測的平均百分比分數（保留）。三篇用「每分鐘正確位數」（流暢度）的研究被排除（Bullard 2020；Powell 2022；Schutte 等 2015），因為與預註冊的成果不相當（L266–272）。
- **另外排除三篇**抽不到平均、標準差或人數、也聯絡不到作者的：Rea & Modigliani 1985、Reed 1924、**Yazdani & Zebrowski 2006**（L272–276）。
- **檢索**：2023-01-11 檢索，初審後於 2025-02-25 更新（L263–265）。資料庫：ERIC 129、OSF Preprints 11、ProQuest Dissertations 116、PsyArXiv 27、PsycINFO 154、Scopus 279、Web of Science 662，共 1,378 筆（Figure 3，PDF p.7）。檢索式在補充 Table 1。
- **篩選流程**（Figure 3，PDF p.7，看過圖）：資料庫 1,378 → 去重 204 → 篩 1,174 → 排除 1,065 → 取全文 109。引文搜尋 1,716 → 篩 1,683 → 排除 1,653 → 30 篇進評估。合計評估 139 篇 → 排除 105（介入不對 31、成果不對 29、非原始研究 14、對照不對 13、設計不對 12、抽不出效果量 3、樣本重複 2、臨床族群 1）→ **34 篇**。
- **誰篩、誰抽**：兩位篩選者先篩 10% 題名摘要（n = 88），一致率 88.6%；其餘一人篩。全文階段兩人共篩 10 篇（一致率 100%），其餘一人篩（L313–318）。抽取先由兩人共抽 5 篇、再共抽 3 篇對表，其餘一人抽（L320–329）。
- **聯絡作者**：19 位作者被問缺漏資料，9 位回覆（47%）（L330–331）。另問納入研究的作者有沒有未發表資料，除三位外都回覆，沒有人報告有未發表資料（L283–286）。
- **效果量**：Hedges' g，用 metafor 的 escalc。受試者內設計的相關係數多半沒報，一律假設 r = .5（L343–347）。
- **合併方法**：metafor ＋ clubSandwich，穩健變異估計、相關且階層效果（CHE）模型（L385–393）。異質性不用 Q，改報三層的 I² 與信賴區間（L396–404）。
- **偏誤檢查**：對單變量版本做 Egger 迴歸、畫漏斗圖、trim-and-fill；品質指標六項加總當調節變項（抽樣方式、有無報告測驗信度、地板／天花板效應、缺漏資料處理、樣本數、有無報告流失，L408–420）；Cook 距離與 DFFITS 找影響點（L421–424）。品質分數當調節變項的結果，正文與補充資料都沒有列出數字。
- **規模**：結果一節寫 34 篇、85 個效果量（L444）＝分散 27 篇 53 個＋提取 7 篇 32 個。
- **兩類分散研究**（L124–148、L457–471）：
  - 「孤立學習」（isolated learning）：在課程之外教一兩個數學程序，所有題目的保留間隔相同，跟傳統語文學習實驗同一種設計。
  - 「嵌入課程」（course-embedded）：把間隔排進正在上的課。課程前段的內容保留間隔比後段長；而且同時含有交錯（interleaving）。作者原話：L147–148「these course-embedded studies provide a less pure measure of spacing, as interleaving, mixing practice of different topics and skills, is also involved.」

## 結果（逐項）

### 分散 vs 集中

| # | 結果 | 數字 | 對照條件 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 全部分散研究 | g = 0.282（SE 0.045），95% CI [0.188, 0.376]；27 篇、53 個效果量 | 分散（跨多次）vs 集中（一次），數學教材 | Results | L454–456 | 「We found a weighted mean effect of g = 0.282 (se = 0.045) (95% CI [0.188, 0.376]).」 |
| 2 | 孤立 vs 嵌入的差：**不顯著** | β = 0.188，SE = 0.106，p = .0952 | 孤立學習研究 vs 嵌入課程研究 | Results | L465–468 | 「the effects were larger on average for isolated learning than course-embedded studies (see below), although they do not differ significantly (𝛽 = 0.188, SE = 0.106, p = .0952)」 |
| 3 | 孤立學習 | g = 0.427（SE 0.107），95% CI [0.179, 0.675]；10 篇、27 個效果量 | 同 #1，限孤立學習研究 | Overall Effect Size | L509–510 | 「The overall weighted mean effect size of spaced versus massed practice for isolated learning is g = 0.427 (se = 0.107) (95% CI [0.179, 0.675])」 |
| 4 | 孤立學習的異質性 | 第一層（抽樣誤差）24%；第二層（研究內）33%，95% CI [1.456, 82.675]；第三層（研究間）43.287%，95% CI [0, 88.234] | — | 同上 | L512–516 | — |
| 5 | 孤立學習：拿掉影響點 | 拿掉 Ebersbach & Barzagar Nazari 2020a（DFFITS = −0.708）→ g = 0.499（SE 0.097）[0.268, 0.731]；拿掉 Gay 1973（DFFITS = 0.638）→ g = 0.368（SE 0.096）[0.14, 0.596] | — | 同上 | L531–537 | 「Critically, 95% confidence intervals remain greater than zero when either of these studies are removed」 |
| 6 | 孤立學習：出版偏誤 | Egger t = 1.033，df = 25，p = 0.312（不顯著）；trim-and-fill 不補研究；但漏斗圖看起來不對稱 | — | Risk of Bias | L543–551 | 「the funnel plot (see Fig. 5) appears to show asymmetry. There appears to be a significant gap of lower powered observed spacing effects that were smaller or negative, which could be an indicator of publication bias.」 |
| 7 | **嵌入課程** | g = 0.24（SE 0.038），95% CI [0.155, 0.324]；17 篇、26 個效果量 | 同 #1，限嵌入課程研究（同時含交錯） | Overall Effect Size | L610–611 | 「The overall weighted mean effect size of spaced versus massed practice for course-embedded material is g = 0.24 (se 0.038) (95% CI [0.155, 0.324])」 |
| 8 | 嵌入課程的異質性 | 第一層 57%；第二層 0%，95% CI [0, 50.555]；第三層 43.065%，95% CI [0, 78.745] | — | 同上 | L613–618 | — |
| 9 | 嵌入課程：拿掉影響點 | 拿掉 Hirsch 等 1982 → g = 0.256（SE 0.036）[0.176, 0.337]。拿掉 Lyle 等 2022（DFFITS = 0.491）之後的數字，原文寫的與整體完全相同（見下方「不一致」第 6 點） | — | 同上 | L621–638 | 「The removal of Hirsch et al. (1982) changes the mean effect size to g = 0.256 (se = 0.036) (95% CI [0.176, 0.337]).」 |
| 10 | 嵌入課程：出版偏誤 | Egger t = −2.4，df = 24，p = 0.025（**顯著**）；t 為負，作者解讀成「高於平均的結果被少報」；trim-and-fill 補 6 篇，校正後 g = 0.27，CI [0.215, 0.326]（比原本**大**） | — | Risk of Bias | L644–650 | 「The negative t-value would suggest under-reporting of results that exceed the mean effect size. … it adds in six studies and provides a corrected effect of g = 0.27 CI [0.215, 0.326].」 |

嵌入課程這 17 篇的特徵（L560–605）：全部在美國；65% 的效果量在大學；54% 來自同儕審查文章，其餘是學位論文（Camp 1973、Gorgievski 2012 等）與一篇研討會論文（Bego 等 2017）；68% 用漸增間隔；四分之三有某種回饋；53% 的效果量是在教室或不限時作業裡做的，學生可以回頭看自己的東西，「需不需要提取」不確定（L579–582）；只有 Goettl 等 1996 在實驗室。每個學習目標練 3 到 9 次；最後一次練習到考試的間隔 2 天到 5 週，5 週最常見。

嵌入課程森林圖（Figure 6，PDF p.15，看過圖）逐列：Beagley & Capaldi 2016 0.06 [−0.30, 0.43]；Beagley & Capaldi 2020 0.22 [−0.15, 0.58]；Bego 2017 0.22 [0.03, 0.41]、0.25 [0.07, 0.44]；Camp 1973 0.27 [0.08, 0.45]、0.26 [0.08, 0.45]；Crissinger 2015 0.16 [−0.09, 0.41]；Goettl 1996 0.16 [−0.44, 0.76]；Gorgievski 2012 −0.46 [−1.02, 0.10]、−0.04 [−0.58, 0.49]；Hirsch 1982 0.05 [−0.49, 0.60]；Holdan 1986 0.39 [−0.36, 1.14]；Hopkins 2016 0.59 [0.15, 1.02]、0.23 [0.01, 0.45]；Lerma 1990 0.74 [0.19, 1.28]；Lyle 2020 0.22 [0.04, 0.40]、0.31 [0.12, 0.51]、0.26 [0.08, 0.43]、0.14 [−0.05, 0.33]；Lyle 2022 0.35 [0.25, 0.46]；Moss 1996 −0.18 [−0.59, 0.24]、0.00 [−0.47, 0.47]；Reed 1983 0.52 [0.32, 0.72]；Revak 1997 0.21 [−0.02, 0.43]；Weaver 1976 −0.08 [−0.48, 0.31]、0.06 [−0.34, 0.45]。圖底：RE Model 0.24 [0.16, 0.31]；小樣本校正後 0.24 [0.16, 0.32]。26 列裡信賴區間跨 0 的有 14 列、點估計為負的 4 列（我數的）。

孤立學習森林圖（Figure 4，PDF p.12，看過圖）：27 列來自 10 份研究（Chen 2018×3、Chen 2024×2、Ebersbach & Nazari 2020×4、Ebersbach 等 2020×1、Emeny 2021×2、Gay 1973×6、Nazari & Ebersbach 2019×4、Rohrer & Taylor 2006×2、Rohrer & Taylor 2007×1、Zhang 2024×2）。最大的是 Gay 1973 的 2.55 [1.62, 3.49] 與 1.66 [0.86, 2.47]；負的有 Ebersbach & Nazari 2020 的 −0.39 [−0.83, 0.05]、−0.08、Ebersbach 等 2020 的 −0.20 [−0.59, 0.19]、Rohrer & Taylor 2006 的 −0.13。圖底：RE Model 0.43 [0.22, 0.64]；小樣本校正後 0.43 [0.18, 0.68]。

### 提取 vs 重學

| # | 結果 | 數字 | 對照條件 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 11 | 提取 vs 重學 | g = 0.184（SE 0.095），95% CI [−0.069, 0.436]；7 篇、32 個效果量；**信賴區間跨 0** | 提取練習（測驗）vs 重學，數學教材 | Overall Effect Size | L706–708 | 「the overall weighted mean effect size is g = 0.184 (se = 0.095) (95% CI [− 0.069, 0.436]) (Fig. 8). Note that the 95% confidence intervals crossed the zero line.」 |
| 12 | 異質性 | 第一層 30%；第二層 50%，95% CI [26.417, 83.001]；第三層 20.105%，95% CI [0, 89.458] | — | 同上 | L710–714 | — |
| 13 | 拿掉影響點 | 拿掉 Betsch 等 2015（DFFITS = −0.483）→ g = 0.239（SE 0.096）[−0.038, 0.516]；不管拿掉哪一篇，CI 都跨 0 | — | 同上 | L717–722 | 「the 95% confidence interval always crosses zero regardless of which study is removed」 |
| 14 | 出版偏誤 | Egger t = −1.279，df = 30，p = 0.211（不顯著）；漏斗圖沒有明顯不對稱 | — | Risk of Bias | L737–740 | — |
| 15 | 作者的結論 | 不能說有、也不能說沒有穩健的測驗效果 | — | Discussion／Conclusion | L886–887、L921–924 | 「Given the current available literature, we were not able to state whether there is or is not a robust effect of testing for mathematics material.」「there is insufficient evidence to suggest that retrieval practice is not a useful pedagogical tool for mathematics learning; however, more evidence is required to ensure the robustness of the testing effect.」 |

提取研究的特徵（L659–701）：最常見的主題是統計；兩篇是實驗室實驗（Fazio 2018；Yeo & Fazio 2019），其餘在教室；42% 的觀測保留間隔不到 1 天；每次學習或測驗 4 到 8 分鐘。作者指出數學裡「重學」長什麼樣並不明確，一種做法是拿「需要提取的練習」對「範例＋題目配對」（L205–211）。Fazio 2018 的結果是範例在立即測驗較好、提取在延後測驗較好（L217–219）。

提取森林圖（Figure 8，PDF p.18，看過圖）：32 列來自 7 份研究（Betsch 2015×4、Dirkx 2014×1、Eustace 2020×3、Fazio 2018×4、Huang 2023×12、Lyle & Crawford 2011×1、Yeo & Fazio 2019×7）。32 列裡點估計為負的 13 列（我數的）。Huang 2023 一篇就佔 12 列，其中 5 列為負。圖底：RE Model 0.18 [−0.03, 0.39]；小樣本校正後 0.18 [−0.07, 0.43]。

### 分散＋提取的交互作用：沒有做

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 16 | 第三個問題無法回答 | L869–876 | 「there was insufficient information in most studies to decide whether the spacing study required retrieval or not. Ultimately, we deviated from our pre-registered retrieval moderator (yes or no) to retrieval (certain or uncertain). … The moderator analyses for whether retrieval was certain or uncertain were not significant.」 |
| 17 | 三題只答了一題 | L892–896 | 「the current state of the literature allowed us to answer one of our three questions: spacing is effective for mathematics material. However, we were unable to answer whether retrieval practice is effective for mathematics learning and how the testing and spacing effects interact.」 |

### 調節變項（只在補充資料；全部不顯著）

正文 L437–439：「none of the results was significant. As our moderating analyses were exploratory, we do not include them in this manuscript」。補充資料的數字（B 是迴歸係數，後面是 p）：

- **孤立學習**（補充 Table 5、6）：國家（美國內外）0.25，p = 0.32；回饋 0.14，p = 0.45；教育階段（大學前／大學）−0.19，p = 0.27；首次提取立即／延後 0.31，p = 0.14；提取確定／不確定 0.11，p = 0.58；實驗室／教室 −0.15，p = 0.37；首次表現 0.04，p = 0.97；曝光次數 −0.00，p = 0.95；題目數 0.04，p = 0.16；年齡 −0.03，p = 0.12；學習間隔（分鐘）p = 0.73；保留間隔（分鐘）p = 0.47。
- **嵌入課程**（補充 Table 7、8）：是否同儕審查 0.02，p = 0.79；教育階段 0.07，p = 0.25；提取確定／不確定 0.03，p = 0.65；間隔型態（等距／漸增）−0.06，p = 0.31（k = 22）；受試者間／內 −0.00，p = 0.97；首次表現 −0.37，p = 0.08（k = 11）；曝光次數 −0.02，p = 0.22；題目數 p = 0.52；最後一次到考試的時間 p = 0.80；練習次數 p = 0.84；學習間隔 p = 0.15。
- **提取**（補充 Table 9、10）：國家 0.06，p = 0.72；保留間隔（不到一天／一天以上）0.27，p = 0.21；回饋 0.07，p = 0.73；首次提取立即／延後 −0.14，p = 0.41；實驗室／教室 0.16，p = 0.41；曝光次數、題目數、每次時長、保留間隔都不顯著。
- 多數調節分析的校正後自由度低於 4（作者自己說自由度低於 4 時不可靠，L432–434）。
- **ρ 敏感度**（補充 Table 11）：假設的研究內相關從 0 到 1，孤立學習的平均效果 0.42–0.46、嵌入課程 0.23–0.24、提取 0.15–0.20。

### 補充資料表裡與 order 16 其他來源有關的列

- Lyle 等 2022（補充 Table 3）：美國、同儕審查、教室、受試者內、隨機分派、大學、微積分；等距間隔；最後一次到考試 40,320 分鐘（28 天）；g = 0.35，var g = 0.00。
- Lyle 等 2020（補充 Table 3）四列：g = 0.22、0.31、0.26、0.14；漸增間隔；到考試 10,080 分鐘（7 天）與 50,400 分鐘（35 天）各兩列。
- 補充 Table 3 的「N」與「ISI s」兩欄的數字（例：Lyle 2022 是 180 與 360；Camp 1973 是 226 與 458）看起來像欄位錯位，表註把 ISI s 定義成「平均學習間隔（分鐘）」，這些數字不像分鐘數。哪一欄才是人數我**不確定**，引用人數請回原研究。

## 作者自己列的限制

原文沒有獨立的「限制」一節，散在討論裡：

1. 提取 vs 重學的研究太少，整體效果比過去小而且不穩健（L753–755）。
2. 嵌入課程的研究是「分散＋交錯」，不是純的分散（L147–148、L469–471）。
3. 多數研究沒有交代學生練習時能不能看舊教材，無法判定練習是否真的需要提取（L831–845、L887–890）。
4. 數學是累積性的：即使在集中組，較簡單的內容在後面學較複雜內容時也會被再練到，等於集中組也帶了一點分散（L846–850）；課程後段會用到前段內容，實際練習量可能比報告的多（L794–798）。
5. 樣本小，調節分析自由度不足，全部移到補充資料（L430–439）。
6. 受試者內效果量的相關係數一律假設 r = .5（L344–346）。
7. 孤立學習的漏斗圖有不對稱的跡象，雖然檢定不顯著（L808–816）。
8. 嵌入課程的研究全部在美國（L565）。

## 與摘要說法不一致的地方

本文內部數字不一致的地方不少，全部列出：

1. **整體分散效果**：摘要與結果寫 g = 0.28（L27、L455），討論寫 g = 0.26（L773）。
2. **孤立學習的研究數**：摘要與結果是 10 篇、27 個效果量（L29、L477），森林圖逐列數也是 10 篇 27 列；討論卻寫「nine studies with 35 effect sizes」（L799）。
3. **提取的研究數**：摘要與結果是 7 篇、32 個效果量（L31–32、L659），森林圖是 7 篇 32 列；討論卻寫「six studies with 20 effect sizes」（L865）。結果一節還有一句「Half of the studies were undertaken in the USA, with the other three …」（L666），那是以 6 篇在算。
4. **孤立學習效果的大小形容**：摘要說整體是「small to medium」（L26）；結果說孤立學習是「medium to large beneficial effect」（L552）；討論說同一個 g = 0.427 是「small to medium effect」（L800）。
5. **提取效果的形容**：g = 0.184 在討論與結論被稱為「small to medium」（L766、L919），同一個詞也用來稱 0.28 與 0.427。
6. **Lyle 等 2022 的影響**：L621–635 說拿掉它會讓平均效果移動近半個標準差（DFFITS = 0.491），但給的拿掉後數字是 g = 0.24（SE 0.038）[0.155, 0.324]，與沒拿掉時一字不差，疑似誤植。同段說 Hirsch 等 1982 是「next largest」，給的 DFFITS 卻是 0.638，比 0.491 大（而且 0.638 與孤立學習那節 Gay 1973 的 DFFITS 數字相同）。**拿掉 Lyle 2022 之後的真實數字，原文沒有可信的值。**
7. **摘要「We found a larger, yet less robust, effect for the isolated learning (g = 0.43) than for course-embedded (g = 0.24)」**（L30–31）：兩者的差沒有達到顯著（p = .0952，L468），摘要沒有提。結論改用「numerically larger」（L916），討論寫「though not significantly smaller」（L824–825），但討論另一處又直接寫「This effect was smaller in studies where the material was embedded in a course」（L891–892）。
8. **引用與文獻對不上**：森林圖與補充表有 Chen 等 2024、Zhang 等 2024、Revak 1997、Huang 2023，正文沒有提，參考文獻也沒有列。正文把 Betsch 等 2015 列在孤立學習研究的德國樣本裡（L485–486），它其實是提取研究；把 Reed 1924 列在嵌入課程的代數研究裡（L562），Reed 1924 在方法一節是被排除的（L275），森林圖裡的是 Reed 1983。
9. 摘要寫提取的「weighted mean effect … was g = 0.18. However, the 95% confidence interval crossed zero」與結果一致。
10. 嵌入課程的 Egger 檢定顯著（L644–645）而 trim-and-fill 往上修，摘要稱這個效果「robust」，沒有提 Egger 結果。作者在討論裡也只談孤立學習的出版偏誤（L808–816），沒有再談嵌入課程的。

## 與清單「要撐的結論」不合的地方

清單寫：「數學裡間隔更小（課程內 g = 0.24）；數學裡提取對重學不穩健」。

1. **「課程內 g = 0.24」**：數字撐得住（L610–611；森林圖底也是 0.24）。引用時要帶的條件：
   - 這是「分散＋交錯」對集中，作者明說不是純的分散（L147–148）。
   - 17 篇全在美國、65% 的效果量在大學、46% 的效果量不是來自同儕審查的期刊文章。
   - Egger 檢定顯著（p = 0.025），方向是「大效果被少報」，trim-and-fill 校正後是 0.27。
   - 26 個效果量裡 14 個的信賴區間跨 0（我照圖數的）。
2. **「數學裡間隔更小」**：要分兩個比較，不能混寫。
   - 與其他領域比：作者說的是「may be smaller than in other domains」（摘要 L36）；比的對象是第二語言學習的 g = 0.80（Kim & Webb 2022）與跨領域的 g = 0.46（Donovan & Radosevich 1999），而作者說自己的數字與後者「similar」（L774–777）。這是跨統合分析的數字對照，沒有檢定。
   - 嵌入課程（0.24）比孤立學習（0.43）小：**差異不顯著**（p = .0952）。只能寫「數值上較小」。作者自己也說「there is no clear reason why spacing may be less effective when embedded in a course」（L861–862）。
3. **「數學裡提取對重學不穩健」**：撐得住，g = 0.184、95% CI [−0.069, 0.436]（L706–708）。要補的：
   - 只有 7 篇；32 個效果量裡 12 個來自 Huang 2023 一篇、7 個來自 Yeo & Fazio 2019。
   - 作者的結論是「證據不足」，不是「沒有效果」（L921–924）。
   - 作者提到納入的研究有些是在「pushing the effect to find boundary conditions」而不是用最佳做法（L907–909）。
   - 「重學」在數學裡的操作定義不一致，有的是重讀、有的是看範例（L205–222）。
4. 清單沒有寫但文章可能會用到：作者原本要回答的「分散提取 vs 集中提取」**沒有做**（L768–769）。這篇不能拿來支持或反對「間隔提取在數學有效」。

清單「之前讀到哪」寫「方法與結果表沒讀」：這篇正文沒有結果表，結果都在內文與森林圖；這次方法、結果、森林圖、附錄 PICOS 表與補充資料 11 張表都讀了。

## 讀取紀錄

- `.txt` 依序讀完：L1–330（首頁、摘要、前言、兩節文獻概覽、本研究、方法前半、Table 1）→ L330–729（方法後半、效果量公式、偏誤、調節變項、結果三個子集）→ L729–1217（提取的偏誤、討論、結論、附錄 Table 2 PICOS、補充資料說明、作者貢獻、經費、資料可得性、參考文獻、出版者聲明）。參考文獻（L988–1209）掃過，用來核對哪些被引研究有列。
- 看過 PDF 版面的頁：p.7（Figure 3 PRISMA 與 Table 1）、p.11–18（Figure 4 孤立學習森林圖、Figure 5 漏斗圖、Figure 6 嵌入課程森林圖、Figure 7 漏斗圖含補點、Figure 8 提取森林圖，以及這幾頁的內文）。內文數字與 `.txt` 相同。
- 沒有另外看 PDF 的：Figure 1、Figure 2（實驗設計示意圖，p.2、p.4）、Figure 9（提取漏斗圖，p.19）。
- 補充資料 docx 全部讀完：Table 1 檢索式、Table 2–4 三個子集的逐效果量特徵表、調節變項定義、Table 5–10 調節分析、Table 11 ρ 敏感度。補充 Table 2–4 的 g 值與 PDF 森林圖的點估計逐列相符。
- 附錄 Table 2（PICOS）在 `.txt` 裡因為橫向排版有頁眉字串混入（L931–955），內容可辨識，沒有另對 PDF。
