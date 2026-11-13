# 抽取紀錄：Sales、Prihar、Gagnon-Bartsch、Heffernan 2023，arXiv 預印本

**書目**：Adam C. Sales（Worcester Polytechnic Institute）, Ethan B. Prihar（WPI）, Johann A. Gagnon-Bartsch（University of Michigan）, Neil T. Heffernan（WPI）(2023). Using Auxiliary Data to Boost Precision in the Analysis of A/B Tests on an Online Educational Platform: New Data and New Results. arXiv:2306.06273v1 [stat.ME]，2023-06-09。作者全名與單位對過 PDF 首頁。資料與程式碼：https://osf.io/k8ph9/（首頁註腳）。

**原文檔**：`.research/raw/learning-content/q6-evaluate/sales2023abtests250.pdf`（33 頁，單欄）。清單登記的 `sales2023abtests250.txt` 是 `-layout` 版（1,462 行、106,759 位元組）。這次用不帶 `-layout` 的 `pdftotext` 重轉（1,673 行、93,097 位元組）依序讀，**行號是重轉版行號**，另附 PDF 頁碼。

**讀取日期**：2026-10-14
**版本**：預印本 v1。版面是期刊投稿樣式，但檔內沒有期刊名、卷期、DOI；是否已正式刊出**沒查到**（Crossref 標題搜尋沒有命中，arXiv API 當下沒有回應）。引用時只能寫 arXiv 預印本。
**供**：order 26

## 這篇是什麼

**統計方法論文**，不是教學成效研究。主題是：分析平台內 A/B 測試時，拿「沒參加實驗的其他使用者」的歷史紀錄（作者稱 remnant）訓練一個預測模型，把模型的預測值當共變數放進設計本位（design-based）的估計式，能把標準誤縮小多少。全篇關心的是**標準誤（抽樣變異數）**，不是處理效果。原文自己說（L699–702，p.13）：「Since our interest here is primarily methodological, with the goal of reducing standard errors, we focus on estimated standard errors as opposed to treatment effects. Our analyses focus on assignment completion as a binary outcome.」

## 研究設計

- **資料來源**：ASSISTments 的 E-Trials（舊稱 TestBed）。學生一次一位、獨立隨機分派（兩個條件時是 Bernoulli 隨機化）（L697–698）。
- **實驗資料怎麼篩**（第 3 節，L699–727，p.13）：
  - 起點 84 個 A/B 測試；多條件的實驗拆成所有兩兩配對，共 **383 對**。
  - 剔除 6 對：某一條件的結果變異數為零。
  - 剔除分派機率看來不是 1/2 的：對每一對檢定 p = 1/2，p 值 < 0.1 的丟掉。作者說有「strong indications」少數實驗用了別的隨機化方式，猜是兩個條件被合併成 2/3 或 1/3（L715–719）。丟掉幾對沒寫。
  - 剔除樣本太小的：任一條件人數少於 5(k+2)+1（k = 9，即少於 56 人）就丟（L722–724）。最小的一對只有 n = 16（L719–720）。丟掉幾對沒寫。
  - 剩下 **227 對比較、來自 68 個 A/B 測試**（L726–727）。導言說這些共含 38,035 位學生（L117–119）。
- **Remnant**：193,218 位做過類似 skill builder、但沒參加這 68 個實驗的學生（L120–121）。和實驗資料的學生與 skill builder 都不重疊（L736–739）。3.1 節另給資料筆數：remnant 有 193,218 組學生先前統計、837,409 組先前作業統計、695,869 個學生-日的動作紀錄；實驗資料有 113,963 組學生先前統計、2,663,421 組先前作業統計、926,486 個學生-日（L755–758）。「113,963 組」和導言的「38,035 位學生」單位不同（前者看來是「學生首次開始某個 skill builder」的筆數），原文沒有說明兩者關係。
- **結果變項**：是否完成作業（二元）。模型同時預測「達到精熟前做了幾題」，但分析只用完成與否。**沒有任何學習測驗**。
- **共變數**：9 個學生層級彙總變項（開始與完成的 skill builder 數、problem set 數、先前首次作答時間中位數、作答時間中位數、整體正確率、完成題數、平均嘗試次數）（L703–706）。
- **比較的四種估計式**（2.3.5 節，L604–615，p.11）：
  - T-Test：兩組平均相減，不調整。
  - LOOP：只用實驗內資料，以隨機森林做留一法共變數調整（Wu & Gagnon-Bartsch 2018）。
  - ReLOOP：只調整 remnant 模型的預測值（OLS）。
  - ReLOOP+：預測值加 9 個共變數，OLS 與隨機森林的集成。
- **Remnant 預測模型**（第 4 節，p.14–16）：四個神經網路——學生先前統計（前饋，單一隱藏層）、最近 20 份作業（LSTM）、最近 60 天每日動作數（LSTM）、三者合併。5 折交叉驗證。
- **度量**：兩種估計式的「估計抽樣變異數」之比。作者把它解讀成「樣本數乘數」（L968–971）：變異數降為 1/q 相當於樣本數乘 q。
- **四個研究問題**（L125–135）：(1) 整體效果的標準誤能改善多少、會不會變差；(2) 子群效果；(3) remnant 與實驗樣本母群不同時還有沒有用；(4) 推到更大母群（事後分層）。

## 結果（逐項）

### 預測模型好不好（Table 2，L900–938，對過 PDF p.16）

| 指標 | 學生先前統計 | 先前作業統計 | 每日動作數 | 合併 |
|---|---|---|---|---|
| 完成與否 AUC | 0.743 | 0.755 | 0.658 | **0.770** |
| 完成與否 Accuracy | 0.761 | 0.767 | 0.743 | **0.774** |
| 完成與否 R² | 0.143 | 0.161 | 0.045 | **0.184** |
| 題數 MSE | 8.489 | 8.505 | 8.719 | **8.363** |
| 題數 R² | 0.033 | 0.032 | 0.007 | **0.048** |

- 原文（L945–947）：「even though all the models are bad at predicting problems to mastery, removing problems to mastery from the loss function reduced the models' ability to predict completion.」
- 這張表順帶說明一件事：用學生過去所有紀錄去預測「這份作業會不會寫完」，合併模型的 R² 只有 0.184。

### 研究問題 1：整體效果（圖 3，PDF p.17；227 對）

圖 3 沒有印統計量，下列是原文敘述；我看圖核對過大致位置。

| # | 比較 | 原文敘述 | 行號 |
|---|---|---|---|
| 1 | ReLOOP vs T-Test | 「In nearly every case the estimator using remnant data substantially outperformed the t-test estimator. In the majority of cases, including remnant-based predictions was roughly equivalent to increasing the sample by between 15 and 60%.」 | L982–984 |
| 2 | ReLOOP+ vs T-Test | 「the median improvement is equivalent to increasing the sample size by about 20%, and in the best case the improvement is equivalent to an 80% increase in sample size.」 | L984–985 |
| 3 | ReLOOP+ vs LOOP | 「in roughly half of cases, including data from the remnant was equivalent to increasing the sample size by about 10–20%, and in a handful of cases the improvement was closer to 30%.」 | L986–990 |

- 看圖：三欄的箱形圖中位數大約在 1.17、1.20、1.10；各欄都有少數點略低於 1.0（最低約 0.96–0.97），第 1 列「15 到 60%」的上限比箱子上緣（約 1.25）高很多，比較像是整個點雲的範圍。這些是目測。
- 圖 3 的結果先前已在研討會海報發表（Sales et al. 2022，AIED 2022）（L980–981）。

### 5.1 有沒有因此多發現效果（Table 3，L1006–1032，對過 PDF p.18；227 個檢定，α = 0.05）

| | T-Test | LOOP | ReLOOP | ReLOOP+ |
|---|---|---|---|---|
| 未校正 | 38 | 39 | 41 | 41 |
| Benjamini-Hochberg | 3 | 11 | 8 | 10 |
| Benjamini-Yekutieli | 2 | 2 | 2 | 2 |

- 作者先聲明數顯著個數是有問題的做法（L1001–1005）：「Counting significant p-values is a problematic approach ... Since the ground truth is unknown, we cannot know which one is the case.」
- 原文（L1036–1038）：「since there were 227 total hypothesis tests, even if the null hypothesis were true in every case we would expect around 11 significant p-values」。
- 這 227 個檢定彼此不獨立（同一個實驗拆出多對、共用資料），BH 不保證控制偽發現率（L1042–1044）；BY 在任意相依下仍成立，四種估計式都只剩 2 個（L1061–1063）。
- LOOP 在 BH 下比 ReLOOP+ 多 1 個：有兩例 ReLOOP+ 標準誤較小但估計值也更接近 0（L1048–1052）。
- **對 order 26 有用的讀法**：在 227 對「完成與否」的比較裡，不做任何調整的 t 檢定，未校正顯著的有 38 對（16.7%，我算的），控制偽發現率後剩 3 對或 2 對。但這不能直接讀成「大多數實驗檢定力不足」：也可能是真實效果本來就接近零，作者自己說分不出來。

### 5.2 哪一種 remnant 資料最有用（圖 4，PDF p.20）

- 原文（L1076–1079）：每日動作模型最差，合併模型最好；「the assignment-level model performed nearly as well as the combined model, suggesting that action- and student-level data did not contribute substantially.」圖 4 沒有印數字。

### 研究問題 2：子群效果（圖 5、Table 4，PDF p.21–22）

- 做法（L1085–1098）：把 9 個共變數各自在全部 227 對合併後取 1/3、2/3 分位數，分「低」「高」兩群；再加一個用 remnant 預測值定義的高低群。理論上 227 × 10 × 2 = 4,540 個估計；任一組少於 10 人的不估（排除 210 個），另 12 個有其他估計問題，剩 **4,318 個**。作者強調這些彼此絕不獨立。

圖 5 印出的分布統計（對過 PDF p.22）：

| 比較 | Min | 1st Qu. | Median | Mean | 3rd Qu. | Max |
|---|---|---|---|---|---|---|
| ReLOOP vs T-Test | 0.55 | 1.04 | 1.12 | 1.16 | 1.22 | 5.63 |
| ReLOOP+ vs T-Test | 0.56 | 1.05 | 1.14 | 1.18 | 1.25 | 5.63 |
| ReLOOP+ vs LOOP | 0.53 | 1.05 | 1.11 | 1.13 | 1.18 | 2.82 |

- **變差的情形**（L1112–1119，p.21）：「For the first time, we see some cases of covariate adjustment substantially harming the precision of effect estimates—ReLOOP gave larger standard errors than T-Tests in about 11% of cases, ReLOOP+ gave larger standard errors than T-Tests in around 12% of cases and ReLOOP+ gave larger standard errors than LOOP in about 13% of cases.」多數相當於樣本數減少不到 10%；約 3% 的情形相當於減少 10% 以上；少數幾例「up to nearly 50%」。
- 改善（L1120–1125）：三種比較的中位數都大於 1.1；前 25% 的情形 ReLOOP 勝 T-Test 22% 以上、ReLOOP+ 勝 T-Test 25% 以上、ReLOOP+ 勝 LOOP 18% 以上；極端情形相當於樣本數乘 2、乘 3，有一例超過 5 倍。

Table 4（L1135–1161，對過 PDF p.21；4,318 個檢定）：

| | T-Test | LOOP | ReLOOP | ReLOOP+ |
|---|---|---|---|---|
| 未校正 | 375 | 403 | 419 | 421 |
| Benjamini-Hochberg | 0 | 23 | 17 | 25 |
| Benjamini-Yekutieli | 0 | 2 | 8 | 8 |

- 原文（L1130–1132）：「a researcher using T-Tests would fail to reject every one of the 4,318 null hypotheses」。未校正的 375／4,318 是 8.7%（我算的），只比 5% 的機率水準高一點。
- **6.1 依子群與樣本數**（圖 6、圖 7，p.22–23；L1169–1209）：用預測值本身定義的高、低群，ReLOOP 幾乎不比 T-Test 好（預測值在群內變異小）；其他子群之間差別不大，ReLOOP vs T-Test 的中位數在 1.1–1.2 之間。平均改善幅度不隨樣本數變，但離散程度隨樣本數變大而明顯縮小。「Every case in which ReLOOP hurt the precision relative to T-Tests by more than 10% was in a subgroup with n < 80, as were all but one of the cases when ReLOOP adjustment was equivalent to multiplying the sample size by 2.5 or higher」（L1204–1206）。

### 研究問題 3：remnant 不具代表性（第 7 節、圖 8，PDF p.24–26）

- 做法：平台不蒐集人口資料；用 Python 套件 gender-guesser 由名字猜性別（作者說「Clearly, this process is faulty and inexact」，L1239）。把 remnant 限縮成被標為「Male」或「mostly male」的學生重新訓練模型；作者推論這群人裡白人與亞裔男性比例偏高，「unknown」類別裡非亞裔少數族裔與移民比例較高，但這是依姓名庫的假設推論，沒有資料驗證（L1242–1252）。再分別分析全體、被標為男性者、其餘者。
- 結果（L1279–1293）：ReLOOP、ReLOOP+ 幾乎都和 T-Test 一樣或更精確，例外是少數幾例相當於樣本數減少 15% 以內，「mostly due to very small samples in some RCTs」；多數改善 10% 以上，不少超過 30%。「Most surprisingly, the estimators performed as well or better in the non-Male sets and the full RCTs than in the Male subset.」圖 8 沒有印數字；看圖三個子集的箱子位置相近，M 子集低於 1 的點較多。
- 圖 8 圖說寫 remnant「composed of only students whose inferred gender was male」，正文寫「Male or mostly male」。

### 研究問題 4：事後分層推到母群（第 8 節、圖 9，PDF p.26–27）

- 用猜測的性別做事後分層；母群比例從 remnant 估，「roughly a third are labeled "Male"」（L1304–1305）。
- 結果（L1311–1319）：含 remnant 預測值的估計式精確度「greatly」改善（圖 9 沒有印數字；看圖三欄中位數約 1.15、1.18、1.13）。作者明說**不能宣稱這些事後分層估計對母群平均效果無偏**：「we cannot claim that the post-stratification estimates ... are unbiased for E_POP[τ]」。

## 作者自己列的限制（9.1 節，L1345–1374，p.27–28）

1. 不是每個隨機試驗都適用：需要有非參與者的大量共變數與結果資料。
2. LOOP 目前只適用 Bernoulli 或配對隨機化，不適用完全隨機、叢集隨機、一般區集設計。
3. 實作成本高：蒐集高維資料、設計與調校模型都要時間、算力與專業（作者說在別的工作裡現成的隨機森林也有不錯的增益）。
4. 樣本數小於 100 時增益最大，但也有少數情形標準誤比 t 檢定大很多；這時不會造成偏誤，只是比較不精確。「Future research may show that simpler adjustment methods, such as ANCOVA, may pose lower risks in small-sample settings.」
5. 結果只限於一個電腦輔助學習平台上的 A/B 測試。
- 另外散在正文的：數顯著個數的做法有問題（5.1）；各比較彼此不獨立（5.1、第 6 節）；姓名猜性別不準（7.1）；事後分層不保證外部無偏（第 8 節）。

原文沒有列、但讀設計可見的：只分析「完成與否」一個結果；227 對各自的樣本數分布、被兩道排除規則丟掉幾對，都沒有報告；「檢定力不足」沒有任何一處做檢定力計算。

## 與摘要說法不一致的地方

1. **比較數**：摘要寫「a new dataset including over 250 randomized A/B comparisons」（L32），正文從頭到尾是 **227** 對、68 個實驗（L117–119、L726–727、L967、圖 3、圖 4 圖說）。正文沒有任何地方出現 250 以上的數字（起點是 383 對）。摘要的數字與正文不合。
2. **相對 LOOP 的上限**：摘要寫相對於只用實驗資料的方法「by about 10% on average, or as much as 30-50%」（L36）。正文是「about 10–20%」「in a handful of cases the improvement was closer to 30%」（L989–990），Discussion 是「as much as 30%」（L1328–1329）；圖 3 右欄最高點約 1.33。主分析沒有 50%。
3. **相對 t 檢定的上限**：摘要「as much as 50-80%」；正文「in the best case ... an 80% increase」；Discussion 卻寫「as much as 40-50% relative to t-tests」（L1328）。三處三個說法。
4. **「不會變差」**：Discussion 說主分析裡「incorporating remnant-based imputations never noticeably harmed precision」（L1330–1331），5.1 前也說「consistently outperformed」。圖 3 有少數點略低於 1.0，所以是「沒有明顯變差」，不是「從不變差」；子群分析則有 11–13% 變差。摘要完全沒提子群會變差。
5. **小樣本門檻**：第 6 節是 n < 80，Discussion 與 9.1 節寫 100。
6. 摘要第二句「often experimental samples and/or treatment effects are small, A/B tests are underpowered, and effect estimates are overly imprecise」是當作前提陳述，正文沒有用這批資料去驗證它。
7. Table 1 的 Remnant 說明寫成「but who were randomized between conditions in the RCT」（L166–167），照正文定義應是「were not randomized」，是筆誤。

## 與清單「要撐的結論」不合的地方

清單寫：「平台內 A/B 測試常檢定力不足」。

- **這篇沒有檢驗這句話**。它是摘要與導言的出發前提（L26–27、L73–86），唯一的實例是導言引的 Harrison et al. 2020：2,152 位學生的實驗，因為標準誤太大而無法確認或否定其中一個關於子群差異的假設（L73–76、L85–86）。全篇沒有檢定力計算、沒有各實驗樣本數的分布、沒有效果量。
- 這篇能撐的是另一句：**用歷史使用者的紀錄做共變數調整，在這 227 對比較裡，標準誤的改善中位數相當於樣本數多約 20%（相對 t 檢定）或約 10%（相對只用實驗內資料的調整），而且只針對「是否寫完作業」這個結果。**
- 可以當旁證但要加註的數字：Table 3 的 38／227（未校正）→ 3（BH）→ 2（BY）。要寫的話必須連著三件事：結果變項是作業完成與否不是學習；作者自己說數顯著個數有問題；顯著的少可能是檢定力不足，也可能是這些介入本來就沒有效果。
- 另一個可用的旁證是排除規則本身：84 個實驗拆出的 383 對裡，最小的一對 n = 16，而且要把「任一條件少於 56 人」的丟掉才能分析（但丟了幾對原文沒寫）。
- 如果 order 26 要寫「平台內實驗常檢定力不足」，這篇只能引作「研究者自己這樣描述，並為此發展方法」，不能引作「有資料顯示」。
- 引用時用 227，不要用摘要的「over 250」。

## 讀取紀錄

重轉版行號，依序、首尾相接：

- L1–L599（題目、作者、摘要、1 導言、Table 1、2.1–2.3.4：架構、偏誤、remnant、rebar、LOOP 估計式）
- L600–L1159（2.3.5–2.3.6、3 資料、3.1 蒐集、4 模型與 Table 2、5 研究問題 1、5.1 與 Table 3、5.2、6 研究問題 2 與 Table 4）
- L1160–L1673（6.1、圖 5–7 圖說、7 研究問題 3、8 研究問題 4、9 討論、9.1 限制、10 致謝、參考文獻、附錄 A 的 Table 5–7；參考文獻掃過，附錄三張表是特徵清單，沒有結果數字，讀過）

對過 PDF 版面：Table 2（p.16）、圖 3（p.17）、Table 3（p.18）、圖 4（p.20）、Table 4（p.21）、圖 5 與圖 6（p.22）、圖 7（p.23）、圖 8（p.25）、圖 9（p.26）。圖 1（集合圖，p.5）、圖 2（模型架構，p.15）沒看。公式（2.2–2.3.6）在重轉文字檔裡排版破碎，只讀了文字敘述，沒有逐式對 PDF；本紀錄沒有引用任何公式。圖 3、4、8、9 沒有印數字，上面寫「約」的都是目測。
