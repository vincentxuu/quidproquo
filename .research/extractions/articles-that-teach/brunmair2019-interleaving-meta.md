# 抽取紀錄：Brunmair & Richter 2019，Similarity matters: A meta-analysis of interleaved learning and its moderators

- **作者**（對首頁，L14–16）：Matthias Brunmair、Tobias Richter，University of Würzburg
- **刊物**：Psychological Bulletin，DOI 10.1037/bul0000209（首頁 L18–24）。稿子只寫「Manuscript accepted for publication in Psychological Bulletin (2019)」，**沒有卷期頁碼**，原文檔無從核對，要引卷期得另查出版者頁面
- **版本**：作者接受稿（符茲堡大學心理系網站，https://psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf，68 頁）。首頁有 APA 的制式聲明：「This paper is not the copy of record and may not exactly replicate the final, authoritative version of the article. Please do not copy or cite without authors' permission.」**數字要進文章前，應對一次期刊刊出版**；這份紀錄只能擔保接受稿的內容
- **原文檔**：`.research/raw/learning-content/q4-time/brunmair2019-interleaving-meta.txt`，2,926 行、127,060 字元（127,345 位元組）。雙倍行高，非空白行 1,501 行（本紀錄計算：`grep -c '[^[:space:]]'`），其中 68 行是換頁頁首
- **讀取日期**：2026-10-14（同日整份重讀一次，重讀者沒有參與第一次精讀；更正見檔尾「2026-10-14 重讀更正」）
- **供哪幾篇用**：order 18（清單 D，18#3）
- **表格對照**：原文檔是單欄稿的 `-layout` 轉檔。重讀時另從作者機構頁重新下載 PDF（68 頁、4,935,082 位元組，存在 scratch），把第 53–67 頁轉成圖檔看版面：Table 1–4 逐格對過 PDF 第 53–57 頁，與原文檔一致。Figure 1–9 在原文檔裡只有圖說（森林圖是圖片，沒有轉成文字），改看 PDF 第 58–67 頁的圖；下面「各類教材由哪些研究組成」來自 PDF 的森林圖，篇數與效果量個數都是本紀錄逐列數出來的，原文沒有寫
- **缺的東西**：正文引用的 Appendix A（各研究的多個效果量，L1109–1111）與電子補充資料 1、2（完整資料檔、p-curve 檢定統計量，L2922–2926）不在這份稿子裡，沒有讀。資料與 R 程式在 https://osf.io/7u253/（L35–37），沒有讀

## 研究設計

- **類型**：多層次統合分析（效果量巢套在樣本裡），隨機效果模型估整體，混合效果模型做調節分析；R 的 metafor（L1107–1170）。
- **研究的是哪一種「交錯」**（定義，L288–304）：歸納學習裡，把**不同類別的範例**交錯呈現，對照「一個類別的範例全部連續呈現完才換下一類」；成果是之後的**類別辨別或分類作業**表現。原文：「we define the interleaving effect as a positive effect of an interleaved compared to a blocked inductive learning condition on the performance in a subsequent category discrimination or classification task.」反向的結果作者叫 blocking effect。
- **定義排除了什麼**（L306–386）：不涉及類別辨別與歸納的交錯（例：Duggan & Payne 2001 把閱讀與操作交錯）；間隔效應研究；動作技能的情境干擾（contextual interference）研究，除非符合上面的定義。
- **檢索**（L759–773）：檢索詞 interleav*、block*、random、schedul*、pract*、effect 的各種組合；PsycINFO、Google Scholar；灰色文獻查 WorldCat、ProQuest；另查 Rohrer 2012 與 Carvalho & Goldstone 2015b 的參考文獻及其補充材料。檢索到 2018 年 6 月 30 日。找到 176 個可能合格的研究。
- **納入標準**（L777–795）：原文說「following four criteria」，**實際只列了三條**（a）有交錯與區塊兩個學習條件，受試者內或受試者間皆可；（b）保留間隔、成果測量、每項目時間、項目間隔、每類項目數在兩條件相同；（c）報告了足以算效果量的統計值（或作者應要求提供）。
- **最後納入**：59 篇論文、238 個效果量、158 個樣本、N = 8,466 人（L808–810、L1175–1177）。摘要寫「59 studies」，正文寫「59 papers」。參考文獻裡打星號的條目數出來也是 59 條（本紀錄計算：L1985–L2647 以 `*` 開頭的行共 59 行）。發表年 2003–2018（L1181）——但參考文獻裡打星號的納入研究有 Carlson & Yaure 1990、Carlson & Shin 1996（L2050–2060），PDF 的 Figure 3 也有它們（各 4 列、3 列），與「2003 到 2018」不合。另一處對不上：Figure 3 有 6 列標成「Carvalho & Goldstone (2015a)」，參考文獻裡 2015a 沒有星號，有星號的是 2015c（2015b 的補充材料，L2109）。
- **受試者**：173 個效果量來自大學生樣本（L836–838）；141 個效果量沒有報告年齡（L848–850）；有報告的 97 個效果量（62 個樣本）平均年齡 21.32 歲（L1177–1181）。141 + 97 = 238，兩個數字互相吻合（本紀錄計算）。
- **教材分七類**（L971–1011）：畫作（多為印象派，Kornell & Bjork 2008 那套）、自然照片（鳥、蝴蝶、人臉）、人造圖片（虛構生物、方格圖）、數學作業、**說明文**（原文定義：「plain expository texts and combinations of texts and other media in a multimedia/interactive media environment」）、字詞（概念類別的名詞、發音規則、不同語言的翻譯）、味道。共 71 套不同教材（L1181–1183）。
- **教材特徵評分**（L1014–1069）：五位評分者依原論文的文字與圖片描述，對每套教材評類別內相似度、類別間相似度、複雜度、熟悉度、好奇度；取標準化評分的平均。好奇度因信度低被剔除。
- **其他編碼變項**（L820–969）：已發表或未發表（學位論文算未發表）、大學生或非大學生樣本、平均年齡、受試者內或受試者間設計、有意或無意學習、項目之間的時間間隔（三類：10 或 30 秒間隔、中間插干擾物、不到 2 秒的立即接續；前兩類只有四個研究）、同時或依序呈現、保留間隔（**只分短於 20 分鐘與較長兩類**，因為多數研究沒報確切時間）、保留測驗（學過的項目）或遷移測驗（新項目）。
- **效果量**（L1073–1103）：受試者間用 Cohen's d，受試者內用 d_av（忽略相關、用平均標準差），再做 Hedges 校正成 g。同一研究有多個相依效果但只有一個符合研究問題時只取那一個（例：Kornell & Bjork 2008 只取第一個測驗區段）。
- **離群值**（L1317–1336）：用完整模型逐步剔除，共剔 12 個效果量（來自 5 個研究），原文說「excluded from all models and the additional analyses except for the sensitivity analysis (Table 4)」；作者註明這套方法是為獨立效果量設計的，用在相依效果量的準確度不明。Table 3 的 Outlier Model 與 Model 3 的 df 差 211 − 199 = 12，與「12 個離群值」吻合（本紀錄計算）。但 Table 4「All Studies」那一欄 df = 205：若它含離群值，照 Outlier Model 的 k 推回去應是 (211 + 17) − 11 = 217；205 反而等於 Model 3 的 k 減去參數個數，(199 + 17) − 11 = 205（本紀錄計算，17 與 11 是兩個模型含截距的係數個數；以 df = k − 係數個數為前提，原文沒有寫 df 怎麼算）。所以「敏感度分析含離群值」這句話與表上的 df 對不起來，哪一邊對，這份稿子無從判斷。
- **調節分析排除**：味道的研究與項目間有時間間隔的研究不進迴歸（L1311–1315）。

## 結果（逐項）

### 整體與各類教材（Table 2，原文檔 L2677–2704，對過 PDF 第 54 頁）

對照條件一律是「交錯呈現 vs 區塊呈現」；g 為正表示交錯較好。各列是不同研究子集，屬跨研究比較。

| # | 教材 | k | g | p | 95% CI | Q_B | I² 樣本間／樣本內 | 原文一句（表列） |
|---|---|---|---|---|---|---|---|---|
| 1 | 整體 | 238 | 0.42 | < .001 | [0.34, 0.50] | 1201.1*** | 77.3%／0.0% | 「Overall 238 0.42 <.001 … 0.34 0.50 77.3 % 0.0 %」 |
| 2 | 畫作 | 70 | 0.67 | < .001 | [0.57, 0.77] | 278.0*** | 43.4%／27.1% | 「Paintings 70 0.67 <.001 278.0*** 0.57 0.77」 |
| 3 | 自然照片 | 19 | 0.35 | .001 | [0.16, 0.55] | 40.1** | 56.1%／0.0% | 「Naturalistic photographs 19 0.35 .001 40.1** 0.16 0.55」 |
| 4 | 人造圖片 | 63 | 0.31 | < .001 | [0.18, 0.44] | 262.4*** | 73.7%／0.0% | 「Artificial pictures 63 0.31 <.001 262.4*** 0.18 0.44」 |
| 5 | **說明文** | 25 | 0.21 | **.119（不顯著）** | [−0.06, 0.47] | 78.4*** | 74.4%／0.0% | 「Expository texts 25 0.21 .119 78.4*** -0.06 0.47」 |
| 6 | 數學作業 | 45 | 0.34 | .005 | [0.11, 0.57] | 202.3*** | 76.9%／0.0% | 「Mathematical tasks 45 0.34 .005 202.3*** 0.11 0.57」 |
| 7 | **字詞** | 13 | **−0.39** | .005 | [−0.64, −0.14] | 28.8** | 18.1%／39.7% | 「Words 13 -0.39 .005 28.8** -0.64 -0.14」 |
| 8 | 味道 | 3 | 0.57 | .24（不顯著） | [−0.11, 1.26] | 4.3 | 36.9%／— | 「Tastes 3 0.57 .24 4.3 -0.11 1.26」 |

k 加總 70 + 19 + 63 + 25 + 45 + 13 + 3 = 238，吻合（本紀錄計算）。Figure 1–7 森林圖的列數逐張數過，也是 70、19、63、25、45、13、3（本紀錄計算）。

其他整體數字：

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 9 | 只用獨立效果量的兩層模型 | k = 138，g = 0.43，95% CI [0.35, 0.51] | L1217–1221 | 「nearly the same when estimated with a two-level random effects model that included only independent effects」 |
| 10 | 忽略巢套結構的兩層模型 | k = 238，g = 0.36，95% CI [0.29, 0.42]；提供多個效果量的樣本平均 g 較低（Q_M = 9.7，p < .001） | L1221–1234 | 「In this model, the overall effect was biased downwards」 |
| 11 | 教材類型之間有差 | Q_M = 52.64，p < .001 | L1240–1242 | 「We found significant differences between types of learning materials」 |
| 12 | 異質性 | 整體 I² = 77.3%，τ² = .20；樣本層級效果量範圍 −1.37 到 1.85（森林圖上的兩端是 Higgins & Ross 2011 數學作業 −1.37、Friedman 2013 畫作 1.85）。各類 τ²：畫作 .07、照片 .07、人造圖片 .15、說明文 .19、數學 .23、字詞 .03。正文把字詞的樣本間 I² 寫成 18.3%，Table 2 是 18.1% | L1258–1270 | 「The effects sizes ranged from -1.37 to 1.85 on the sample level.」 |

### 各類教材由哪些研究組成（PDF 森林圖，Figure 4–6；原文檔沒有這些字）

- **說明文（Figure 4，PDF 第 61 頁；25 個效果量、7 篇，皆本紀錄逐列數）**：Archambault 2014（2 個：−0.20、−0.10）；de Croock & van Merriënboer 2007（7 個：0.45、0.08、−0.47、−0.67、−0.70、0.15、−0.59——這是蒸餾器故障排除的模擬作業，正文 L1048–1052；圖上拼作「de Crook & Merrienboer」）；Dobson 2011（8 個：0.17、0.09、0.01、0.08、0.01、−0.20、−0.15、−0.04，免疫系統與女性生殖兩篇文字交錯，正文 L524–528）；Richland 等 2005（−0.15、0.31）；Zulkiply 2013（0.59、0.23）；Zulkiply & Burt 2013a（0.42、0.19，心理疾患個案）；Zulkiply 等 2012（1.52、0.64）。列數加總 2 + 7 + 8 + 2 + 2 + 2 + 2 = 25。25 個裡 **15 個來自 Dobson 與 de Croock 兩篇**（本紀錄計算：8 + 7 = 15，占 15 / 25 = 60%）。圖上的合併值寫 0.21 [−0.04, 0.46]，與 Table 2 的 [−0.06, 0.47] 差一點（圖說寫「random effects model」，表註寫 multilevel）。
- **數學作業（Figure 5，PDF 第 62 頁；45 個效果量、12 篇，皆本紀錄逐列數）**：Gane 2006（6）、Higgins & Ross 2011（1，−1.37）、Patel 等 2016（3）、Phillips 2016（2：−0.32、0.62；「會計題」是從參考文獻的題名判斷的，L2386）、Rau 等 2010（8，**全部為負**，−0.83 到 −0.12）、Rau 等 2012（8，−0.11 到 0.45）、Rohrer & Taylor 2007（1.28）、Rohrer 等 2014（1.04；即參考文獻的 Rohrer, Dedrick, & Burgess 2014）、Sana 等 2017（5）、Taylor 2008（1.07）、Ziegler & Stern 2014（6）、Ziegler & Stern 2016（3）。列數加總 6 + 1 + 3 + 2 + 8 + 8 + 1 + 1 + 5 + 1 + 6 + 3 = 45。圖上合併值 0.34 [0.12, 0.57]，Table 2 是 [0.11, 0.57]。
- **字詞（Figure 6，PDF 第 63 頁；13 個效果量、只有 3 篇，皆本紀錄逐列數）**：Carpenter & Mueller 2013（8，法文發音規則，−0.85 到 −0.10）、Hausman & Kornell 2014（3：0.48、−0.26、0.00）、Sorensen & Woltz 2016（2：−0.93、−0.60）。列數加總 8 + 3 + 2 = 13。圖上合併值 −0.39 [−0.62, −0.17]，Table 2 是 [−0.64, −0.14]。
- **味道（Figure 7，PDF 第 64 頁；3 個效果量、1 篇）**：Dwyer 等 2004（0.83、1.02、−0.09）。圖上合併值 0.57 [−0.11, 1.26]，與 Table 2 相同。
- **其餘三類**：畫作（Figure 1，70 列、16 篇，合併值 0.67 [0.57, 0.77]，與 Table 2 相同）；自然照片（Figure 2，19 列、7 篇，合併值 0.36 [0.17, 0.54]，Table 2 是 0.35 [0.16, 0.55]，連點估計都差 0.01）；人造圖片（Figure 3，63 列，合併值 0.31 [0.18, 0.44]，與 Table 2 相同）。篇數與列數皆本紀錄逐列數。
- 沒有被納入的：Rohrer、Dedrick & Stershic（參考文獻列 2014，L2450，無星號）、Taylor & Rohrer 2010（L2513，無星號；有星號的是學位論文 Taylor 2008。原文只說重複的資料取較早的來源，L806–808，沒有說這兩筆是同一批資料，「同資料」是本紀錄的推測）、Rau 等 2013（L2405，無星號）。Rohrer 等 2020 的課堂 RCT 不在這篇的參考文獻裡；它的刊出時間與規模是別處的資訊，這次重讀沒有核對。

### 後設迴歸（Table 3，原文檔 L2710–2773，對過 PDF 第 55–56 頁）

係數為 b；正值表示該特徵使交錯效果變大。Model 1 只放研究與介入特徵；Model 2 加教材特徵評分；Model 3 再加教材類型（以畫作為參照）；Outlier Model 是 Model 3 把離群值放回去。

| 預測變項 | Model 1 | Model 2 | Model 3 | Outlier Model |
|---|---|---|---|---|
| 截距 | 0.28* | 0.33** | 0.54*** | 0.52*** |
| 灰色文獻（未發表 = 1） | 0.12 | −0.05 | −0.07 | −0.01 |
| 設計（受試者內 = 1） | 0.11 | −0.02 | −0.02 | 0.07 |
| 大學生樣本（= 1） | 0.13 | 0.14 | 0.17* | 0.19* |
| 保留間隔（較長 = 1） | −0.13 | −0.10 | −0.08 | −0.05 |
| 無意學習（= 1） | −0.46 | −0.52 | −0.37 | −0.55** |
| 遷移測驗（= 1） | −0.02 | −0.06 | −0.05 | −0.04 |
| 同時呈現（= 1） | 0.01 | −0.05 | 0.09 | 0.10 |
| 類別內相似度 | — | −0.33*** | −0.17* | −0.07 |
| 類別間相似度 | — | 0.41*** | 0.22* | 0.08 |
| 複雜度 | — | 0.06 | 0.12* | 0.15** |
| 熟悉度 | — | 0.19*** | 0.20*** | 0.20** |
| 自然照片 | — | — | −0.22 | −0.26 |
| 人造圖片 | — | — | −0.20 | −0.21 |
| 說明文 | — | — | −0.56** | −0.73*** |
| 數學作業 | — | — | −0.43* | −0.45* |
| 字詞 | — | — | −0.48* | −0.63** |
| df | 208 | 204 | 199 | 211 |
| Q_B | 1014.1 | 722.9 | 617.2 | 691.3 |
| Q_M | 11.8 | 88.0 | 105.8 | 98.9 |
| R²（樣本間） | .05 | .46 | .50 | .44 |

正文對 Model 3 的描述（L1350–1362）：說明文 b = −0.56（SE 0.18，p = .001）、字詞 b = −0.48（SE 0.23，p = .014）、數學 b = −0.43（SE 0.18，p = .004）；教材類型比 Model 2 多解釋 4.0% 的樣本間變異（Table 3 的 R² 是 .50 − .46 = .04，吻合，本紀錄計算）。注意把離群值放回去後，類別內與類別間相似度的係數都不顯著（−0.07、0.08）。正文與表有兩處對不上：正文說「still significantly smaller for all learning materials compared to the reference category of paintings」，但 Table 3 的自然照片（−0.22）與人造圖片（−0.20）都沒有星號；數學作業正文 p = .004，表上只標一顆星（p < .05）。

### 敏感度分析（Table 4，原文檔 L2777–2820，對過 PDF 第 57 頁）

| 預測變項 | 全部 | 只取獨立效果 | 只取大學生 | 只取視覺教材 | 只取人造圖片 |
|---|---|---|---|---|---|
| 截距 | 0.44*** | 0.46*** | 0.69*** | 0.22* | 0.11 |
| 大學生樣本 | 0.21** | 0.21** | — | 0.37*** | 0.14 |
| 類別內相似度 | −0.16* | −0.12 | −0.18* | −0.29** | −0.28* |
| 類別間相似度 | 0.20* | 0.18* | 0.28** | 0.34*** | 0.38** |
| 複雜度 | 0.12* | 0.11* | 0.11* | 0.18*** | 0.22*** |
| 熟悉度 | 0.18** | 0.20** | 0.26*** | .26** | 0.14 |
| 自然照片 | −0.22 | −0.35* | −0.35* | −0.12 | — |
| 人造圖片 | −0.21 | −0.26* | −0.24 | −0.12 | — |
| 說明文與互動作業 | −0.60*** | −0.58*** | −0.62*** | — | — |
| 數學作業 | −0.43* | −0.46** | −0.69*** | — | — |
| 字詞 | −0.52* | −0.26 | −0.65* | — | — |
| df | 205 | 127 | 154 | 128 | 52 |
| R²（樣本間） | 0.51 | 0.50 | 0.64 | 0.55 | 0.38 |

### 其他調節變項與追加分析

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 13 | 保留間隔 | 沒有調節效果（Table 3 係數 −0.13 到 −0.05，皆不顯著）。只分「短於 20 分鐘」與「較長」 | 較長 vs 短 | L1401–1403 | 「We found no evidence for a moderating effect of retention interval in the meta-regression analysis.」 |
| 14 | 保留 vs 遷移測驗 | 沒有調節效果；同一樣本兩種都測的 31 個研究追加分析：k = 64，Q_M = 0.56，p = .45 | 新項目 vs 學過的項目 | L1419–1429 | 「we found no overall effect of retention vs. transfer」 |
| 15 | 同時 vs 依序呈現 | 沒有調節效果；兩種都做的研究：同時 g = 0.44 [0.24, 0.64]、依序 g = 0.29 [0.09, 0.50]，差異不顯著（k = 26，Q_M = 1.0，p = 0.31） | 同時 vs 依序 | L1405–1417 | 「but the difference was not significant」 |
| 16 | 設計 | 受試者內與受試者間沒有差 | — | L1385–1387 | 「We found no effect of within-participants vs. between-participants designs」 |
| 17 | 已發表 vs 未發表 | 沒有調節效果 | — | L1442–1444 | 「We found no evidence for a moderating effect of publication」 |
| 18 | 有意 vs 無意學習 | 只有放回離群值的模型顯著（−0.55**），其他模型不顯著；只有 8 個研究用無意學習 | 無意 vs 有意 | L1389–1399 | 「it failed to reach significance in all other models」 |
| 19 | 大學生樣本 | 效果較大，Model 3 b = 0.17*，敏感度分析 0.21** | 大學生 vs 其他 | L1432–1440 | 「Interleaving effects were larger in pure university student samples compared to nonstudent samples.」 |
| 20 | 平均年齡 | 有報年齡的子集（排除一個平均 77 歲的研究，其餘 9.5 到 37 歲）：全部 k = 85，b = −0.04（SE 0.01），p < .001；只取視覺教材 k = 42，b = −0.03（SE 0.01），p < .001；**只取大學生樣本 k = 49，b = −0.07（SE 0.05），p = .19，不顯著** | 年齡每增一歲 | L1456–1487 | 「In the sample with only university students the effect was not significant」 |
| 21 | 項目間的時間間隔 | k = 17，Q_M = 9.64，p = .008。立即接續 g = 0.73 [0.51, 0.95]；有時間間隔 g = 0.22，CI 印作 [−0.13, 0.45]（不顯著；這個區間對 0.22 不對稱，疑為筆誤，未能核）；中間插干擾物 g = 0.51 [0.07, 0.96]（顯著） | 同一篇論文內比較三種間隔 | L1489–1505 | 「we found a significant interleaving effect only for immediate succession of items … but not for temporally spaced items … We also found a significant interleaving effect for item presentation with distractors」 |

### 出版偏誤（L1507–1558，Figure 8–9）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 22 | trim-and-fill，全部獨立效果量 | 校正後 g = 0.29，95% CI [0.20, 0.38]，左側補 23 個研究 | L1531–1535 | 「suggested a publication bias (gTrim & Fill = 0.29, p < .001, 95% CI [0.20, 0.38]) with 23 studies missing on the left side.」 |
| 23 | trim-and-fill，分教材 | 只有人造圖片顯示偏誤：校正後 g = 0.17，補 9 個；原文印「p = .10, 95% CI [0.02, 0.31]」（p 值與區間互相矛盾，照抄）。其他教材沒有偏誤的證據 | L1535–1542 | 「suggested publication biases only for artificial pictures」 |
| 24 | p-curve | k = 44 個顯著結果；右偏檢定全曲線 Z = −16.89、半曲線 Z = −16.44（皆 p < .001）；平坦檢定全曲線 Z = 11.55、半曲線 Z = 16.31（皆 p > .99）；檢定力估計 98%（90% CI [97%, 99%]）。Figure 9（PDF 第 67 頁）圖上標 64% 的 p 值落在 .01 那一格，其餘 11%、11%、9%、5%；圖說另寫「for 37 studies, p < .025」 | L1544–1558、L2915–2919 | 「We found no evidence for p-hacking」 |

作者說明多層次統合分析沒有現成的出版偏誤方法，做法是每個研究只取一個效果量（取較常見的條件：依序呈現、遷移測驗、短保留間隔、立即接續）（L1509–1519）。作者也說各類教材的標準誤與效果量都不同，合在一起會讓漏斗圖不對稱，所以另做分教材的分析（L1523–1529）。

### 教材特徵評分的信度（Table 1，L2650–2672，對過 PDF 第 53 頁）

Cronbach's α：類別內相似度 .91、類別間相似度 .92、複雜度 .92、熟悉度 .94、好奇度 .72。表註：α 是用「評了全部 71 套教材的四位評分者」估的（正文說五位評分者）。相關：類別內 × 類別間 r = .57***；熟悉度 × 類別間 r = −.39**；好奇度 × 熟悉度 r = −.69***。

## 作者自己列的限制（L1829–1947，另加散在各處的）

1. **資料庫不理想**：多數研究用視覺教材，「educationally interesting materials, such as mathematical tasks or expository texts, are clearly underrepresented」；多數用大學生，限制了對中小學生與大學年齡以上成人的推論（L1831–1847）。
2. **教材類型與方法特徵混淆**：非視覺教材的研究，保留間隔與每個項目的呈現時間通常較長（L1849–1860）。
3. 多數研究只看學習結果，很少看認知歷程（L1860–1876）。
4. 年齡的關聯是研究層級的聚合資料，不一定對應到個人層級；年齡變化常是非線性（L1878–1888）。
5. 教材特徵是主觀評分，有信度與效度的疑慮，「need to be interpreted with caution」（L1890–1915）。
6. 文獻集中在很窄的教材、情境、年齡範圍（L1929–1947）。
7. **字詞與味道的研究太少**：「included too few empirical studies … Therefore, the results should be interpreted with caution. The negative effect for words, for example, might not be caused by the use of words but rather by the task types or the specific categories or other (unknown) variables」（L1635–1646）。
8. 說明文不顯著、數學效果小，**不代表交錯對這些教材無效**：「does not imply that interleaving is ineffective when used with these learning materials. Instead, interleaving can benefit but also harm inductive learning, depending on the implementation, the measure of learning outcomes, and the specific characteristics of the learning material.」（L1619–1627）
9. 大學生樣本效果較大，可能只是樣本同質、雜訊小，「should be interpreted with caution」（L1648–1658）。
10. 離群值方法是為獨立效果量設計的（L1330–1336）。
11. 交錯本身就含間隔，兩者「to some extent impossible to disentangle」（L657–661）；結果不排除交錯效果部分來自間隔（L1748–1752）。

## 與摘要說法不一致的地方

數字逐項對過，摘要的 g 值（0.42、0.67、0.34、−0.39）都對得上 Table 2。但正文內部與摘要之間有這些出入：

1. 摘要「59 studies」；方法與結果寫「59 papers」，另有 158 個樣本。
2. 正文 L1254 把字詞那一項印成「p > .001」；Table 2 是 p = .005。應以表為準。
3. 正文說納入「four criteria」，只列三條。
4. 正文說所有研究發表於 2003–2018；納入清單裡有 1990 與 1996 年的研究。
5. **討論說年齡的關聯「was also found when only student samples or visual materials were analyzed」（L1666–1668）；結果節只取大學生樣本那一個是不顯著的（p = .19，L1485–1487）**。
6. **討論說「interleaving is effective only when items are presented in immediate succession without spacing」（L1582–1586）；結果節中間插干擾物的條件 g = 0.51 也顯著**。
7. 討論說「intentional learning seems to strengthen the interleaving effect」（L1586）；結果節這個變項只在放回離群值的模型顯著。
8. 討論說評分「highly reliable」且關聯「very robust」；Table 3 的 Outlier Model 裡類別內、類別間相似度都不顯著。
9. **實務建議說「We are reluctant to recommend interleaving for learning materials such as mathematical tasks, expository texts, grammar rules, foreign languages or words」（L1821–1827）；但數學作業的合併效果是正的且顯著（g = 0.34，p = .005）**，結論段也只說數學「a small overall effect was found, and the effects were overall heterogeneous」。「文法規則、外語」不是分析裡的類別，是從字詞那三篇推出去的。
10. 摘要說說明文與味道「ambiguous with nonsignificant overall effects」，與正文一致。
11. 森林圖上的合併值與 Table 2 有小差：說明文 [−0.04, 0.46] 對 [−0.06, 0.47]；字詞 [−0.62, −0.17] 對 [−0.64, −0.14]；自然照片 0.36 [0.17, 0.54] 對 0.35 [0.16, 0.55]；數學 [0.12, 0.57] 對 [0.11, 0.57]。畫作、人造圖片、味道兩邊相同。
12. 前言寫理論預測時說「higher between-category similarities and higher within-category similarity should increase the interleaving effect」（L736–740）；摘要、結果與討論說的都是類別內相似度**低**時交錯效果較大（Table 3 的類別內係數為負）。
13. 正文把自然照片印成「p < .001」（L1246），Table 2 是 p = .001；正文把字詞的樣本間 I² 印成 18.3%（L1266），Table 2 是 18.1%。
14. 正文說 Model 3 裡所有教材類型的交錯效果都顯著小於畫作（L1350–1354）；Table 3 的自然照片與人造圖片係數沒有星號。
15. 討論說異質性「within all types of learning materials」顯著（L1609–1611）；Table 2 味道那一列 Q_B = 4.3，沒有星號。
16. 討論說視覺教材是「moderate to large effects」（L1595–1599）；Table 2 的自然照片 g = 0.35、人造圖片 g = 0.31。
17. 原文說離群值在敏感度分析（Table 4）裡沒有剔除；Table 4 的 df 推回去比較像是剔除後的樣本（算式見「研究設計」的離群值那一條，本紀錄計算）。

## 與清單「要撐的結論」不合的地方

清單那句：「交錯的適用界線」，並標「反／無：說明文不顯著、字詞為負」。

- **說明文不顯著**：撐得住（g = 0.21，p = .119，95% CI [−0.06, 0.47]，k = 25）。要一起寫的：點估計是正的、區間很寬；25 個效果量只來自 7 篇，其中 15 個來自兩篇（本紀錄計算：Dobson 2011 八個近乎零 + de Croock & van Merriënboer 2007 七個 = 15；後者其實是故障排除模擬）；同一類裡心理疾患個案的研究（Zulkiply 系列）是正的。作者自己說這不代表對說明文無效。**不能寫成「交錯對文字教材沒用」**。
- **字詞為負**：撐得住（g = −0.39，CI [−0.64, −0.14]），但只有 3 篇 13 個效果量，作者明說要謹慎、可能是那幾個研究的作業類型造成的。
- **「適用界線」這個框架**：可以用，但這篇統合的「交錯」是「歸納學習時把不同類別的範例混著呈現」，成果是分類或辨別。它**不是**「系列文章或課程單元的先後順序」，也不是「複習時把舊主題混進來」。拿它來談系列的順序，只能支持很窄的一句：類別之間容易混淆（類別間相似度高）、類別內差異大時，混著呈現範例比較有利；類別本來就好分時，沒有這個好處甚至相反。這是跨研究的後設迴歸關聯，不是實驗操弄的結果，而且放回離群值後不顯著。
- 清單沒寫、引用時要帶的：出版偏誤校正後整體估計從 0.42 降到 0.29；保留間隔只分 20 分鐘上下，所以這篇**不能**用來說交錯的效果能不能維持幾週；大學生樣本占多數。
- 與同批 Rohrer 等 2020 的關係：Rohrer 等 2020 的課堂 RCT 不在這篇的參考文獻裡（它的效果量要看該篇自己的抽取紀錄，這裡不重抄）；這篇對數學的合併估計是 0.34，異質性大（Rau 等 2010 八個效果量全為負）。兩者不能互相替代。

## 讀取紀錄

2026-10-14 重讀（重讀者沒有參與第一次精讀）。原文檔用 Read 依行號分五段讀，區間首尾相接：

- L1–L760：首頁與作者註、摘要、Public significance statement、前言、Interleaving During Learning: An Illustration and a Definition、Key Theories、Generalizability and Potential Moderators、Rationale、Method 開頭
- L755–L1564：Review Criteria、Selection Criteria、Coded Variables、Effect Size Calculation、Meta-analytical Strategies、Results 全部（整體效果、後設迴歸、Additional Analyses、Publication Bias）、Discussion 開頭
- L1560–L1989：Discussion、Generalizability、Theoretical and Practical Implications、Limitations and Directions for Future Research、Conclusion
- L1985–L2649：References（掃過；星號條目另用程式數行數，59 條）
- L2648–L2926：Table 1–4、Figure 1–9 圖說、Supplements 說明

合計涵蓋 L1–L2926 全檔。

PDF（作者機構頁重新下載，68 頁）轉圖看過的頁面：

- 第 53–57 頁：Table 1、2、3（跨第 55–56 頁）、4，逐格對原文檔，一致
- 第 58 頁 Figure 1（300 dpi 分上下兩半看，70 列）、第 59 頁 Figure 2（19 列）、第 60 頁 Figure 3（300 dpi 分上下兩半看，63 列）、第 61 頁 Figure 4（25 列）、第 62 頁 Figure 5（45 列）、第 63 頁 Figure 6（13 列）、第 64 頁 Figure 7（3 列）
- 第 65 頁 Figure 8（漏斗圖八格，只看了哪幾格有補上的白點：a 與 e）、第 67 頁 Figure 9（p-curve）。第 66 頁只有 Figure 8 圖說的後半，讀的是原文檔 L2908–2909

Figure 1 與 Figure 3 只核對了列數、各篇的列數、合併值，以及本紀錄引用到的個別數值（Friedman 2013 的 1.85、Carlson 兩篇、Carvalho & Goldstone 2015a 的標籤）；其餘各列的數值沒有逐一抄錄。

沒讀的：Appendix A、電子補充資料 1 與 2、OSF 上的資料檔（都不在這份稿子裡）；期刊刊出版（沒有取得，卷期頁碼與刊出版是否改過數字都未核）。

## 2026-10-14 重讀更正

起因：獨立抽查（`.research/extractions/_audit/group-02.md`）指出「25 個效果量裡 16 個來自 Dobson 與 de Croock 兩篇」算錯。照規則整份從頭重讀，逐項對原文檔與 PDF 版面。原文照抄的數字（Table 1–4、正文的統計值、行號）全部對得上，沒有改；改的都是紀錄自己數或自己推的地方。

改正的錯誤：

1. **「16 個來自 Dobson 與 de Croock 兩篇」改為 15 個**（兩處：「各類教材由哪些研究組成」的說明文那一條、「與清單要撐的結論不合的地方」的說明文那一條）。Figure 4（PDF 第 61 頁）是 Dobson 2011 八列、de Croock & van Merriënboer 2007 七列，8 + 7 = 15。已標「本紀錄計算」並寫出算式。
2. **「Taylor & Rohrer 2010 與學位論文 Taylor 2008 同資料」改標為本紀錄的推測**。原文只說重複的資料取較早的來源（L806–808），沒有說這兩筆是同一批資料。
3. **拿掉兩個原文沒有的數字**：「Rohrer 等 2020 線上刊出是 2019 年 5 月、54 班」與「Rohrer 的課堂 RCT d = 0.83」。這篇的參考文獻沒有 Rohrer 等 2020，這些數字不是從這篇讀來的，這次重讀也沒有核對，改成只寫「不在這篇的參考文獻裡」。

補標「本紀錄計算」的（數字本身重數後沒有錯）：

4. 檔頭「有內容的行約 1,500 行」改為實數 1,501 行並寫出算法。
5. 各類教材的篇數與效果量個數（說明文 7 篇 25 個、數學 12 篇 45 個、字詞 3 篇 13 個）標明是逐列數森林圖得來，並補上各篇列數的加總算式；Table 2 的 k 加總 238 標明是本紀錄計算。
6. Dobson 2011 的八個效果量原本只寫範圍，補成逐個數值。

重讀時新增的（原紀錄沒有）：

7. 「研究設計」：星號條目數 59（與「59 papers」吻合）；141 + 97 = 238；Figure 3 的「Carvalho & Goldstone (2015a)」在參考文獻裡沒有星號；離群值 12 個與 Table 3 的 df 差吻合，但 Table 4 的 df 與「敏感度分析含離群值」對不起來。
8. 「各類教材由哪些研究組成」：補味道（Figure 7）與畫作、自然照片、人造圖片（Figure 1–3）的列數與合併值；數學與字詞補上圖上合併值與 Table 2 的差。
9. 結果 #12 補正文與表的 I² 出入（18.3% 對 18.1%）；#24 補平坦檢定與 Figure 9 圖上的數字；Table 3 下方補正文與表的兩處出入。
10. 「與摘要說法不一致的地方」第 11 條改成逐一列出數值，另加第 12–17 條。
11. 「讀取紀錄」整節換成這次重讀的。
