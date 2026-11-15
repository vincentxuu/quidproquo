# 抽取紀錄：Kim、Reinecke、Hullman 2017，Explaining the Gap（CHI 2017）

- **合法公開來源**：https://mucollective.northwestern.edu/files/2017-ExplainingTheGap-CHI.pdf （共同作者 Jessica Hullman 的實驗室網站，2026-10-14 核對；重新下載與手上的 `kim2017-explaining-gap.pdf` 位元組完全相同，3,816,934 位元組）；刊出版在 https://dl.acm.org/doi/10.1145/3025453.3025592（ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS），另存 `.research/raw/learning-content/q2-interactive/kim2017-explaining-gap-acm-dl.pdf`。兩版比對：手上那份 9,559 個詞有 9,430 個與 ACM 版逐詞對上，差別是 ACM 版每頁多的頁眉與頁碼（1375–1386）以及參考文獻在雙欄裡的抽字順序；正文與數字沒有差異。

- **書目**：Yea-Seul Kim, Katharina Reinecke, Jessica Hullman (2017). Explaining the Gap: Visualizing One's Predictions Improves Recall and Comprehension of Data. *Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems*（CHI 2017，May 06–11，Denver）。DOI 10.1145/3025453.3025592。三位作者都掛 University of Washington。作者全名與 DOI 對過首頁（L1–11、L54–59）。
- **版本**：ACM 刊出版（首頁有 ACM 版權聲明與 ISBN，L44–54）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/kim2017-explaining-gap.txt`（1,145 行、63,980 字元／64,325 位元組）；PDF `kim2017-explaining-gap.pdf`，12 頁。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 7（該不該做互動）#5
- **表格與圖對照**：原文檔是不帶 `-layout` 的轉檔，雙欄沒有左右交錯，只有圖說與側欄文字插進段落中（L260–266、L303–313）。Table 1 在原文檔裡一格一行，六列三欄可以直接對齊，沒有錯位。文字條件的係數只畫在 Figure 6(b)、高熟悉度資料集只畫在 Figure 7(b)，正文沒有數字，另看了 PDF 第 6、8 頁的頁面影像。補充材料（GitHub `yeaseulkim/ExplainingTheGap`）沒有讀。

## 研究設計

- **類型**：線上受試者間實驗（Amazon Mechanical Turk），一個主實驗加兩個部分複製，前面有一個選資料集用的預備調查。
- **預備調查**（L246–343）：AMT 100 人。六個資料集兩兩比較熟悉度（15 對），再對每個資料集預測全部六個資料點。Table 1 按三種熟悉度排名：速食熱量最熟、糖尿病前期小鼠實驗最不熟、投票結果居中。主實驗選投票結果。
- **主實驗的資料**：2008 年美國總統大選，三個族裔（Hispanic、White、Black）在兩個收入級距投給共和黨的百分比，科羅拉多與康乃狄克兩州各一張圖，共 12 個資料點（L409–419、L886–887）。
- **條件**（L202–226、L387–398）：五種做法 × 兩種呈現方式，Predict-Feedback 沒有文字版，共 9 個條件。
  - None（基準）：只看資料，被要求看幾次。
  - Explain-Only：邊看邊在文字框打幾句自我解釋。
  - Predict-Only：先預測被隱藏的一組資料，再看自己的預測疊在真實資料上。
  - Predict-Explain：先預測，再看對照，並打字解釋自己的預測與真實資料的差距。
  - Predict-Feedback：先預測，再看對照，外加文字與視覺的回饋（高估或低估、「You guessed 66%, but the true answer is 23%」、違反整體型態時的提示）。
  - 呈現方式：Vis（折線圖，預測用拖曳資料點）或 Text（資料用文字呈現，預測用打字）。
- **預測的範圍**：每州只預測隨機選出的**一個族裔**在兩個收入級距的值，另外兩個族裔的資料一開始就顯示（L416–419、L823–825、L890–891）。
- **補齊互動量的作法**：沒被要求預測的組（None、Explain-Only）改成**重打一段關於美國選舉的文字**（L379–382、L421–423）。所以基準組不是「什麼都不做」，是做了一件與資料無關的打字工作。
- **受試者**：依前導實驗做檢定力分析，每條件 42 人，共招募 378 人，報酬 1.50 美元（L401–406）。排除 5 人（3 人在文字條件沒填預測、2 人重複參加，L475–477），剩 373 人。各條件實際人數正文沒有寫。年齡、教育程度等人口資料正文沒有報告，只說各條件間沒有差異（L472–475）。
- **流程**（L409–466）：說明 → （視覺條件）看操作教學影片 → 預測或重打文字 → 看資料（依條件有不同提示）→ **三分鐘摺紙測驗**（當干擾作業，也當空間能力分數，10 題）→ 回憶 12 個百分比（用與學習時相同的介面，文字或圖）→ 人口資料。
- **量了什麼**（L484–493）：
  - 絕對誤差：回憶值與真實值的絕對差，單位是百分點。
  - 趨勢誤差：回憶的線斜率與真實斜率的絕對差。
  - **沒有任何理解題。** 兩個依變項都是回憶。作者把趨勢誤差說成「accuracy in recalling the higher level structure of datasets」（L489–490）。
- **何時量**：同一次作業內，隔三分鐘干擾作業後。沒有延宕測驗。整個實驗平均 19.4 分鐘（SD 8.4）。
- **分析**（L478–507）：R 的 lme4，兩個混合效果模型；固定效果是四種做法、呈現方式、兩者的交互作用、空間能力分數（置中）；隨機效果是受試者與族裔組。p 值用常態近似。係數單位是百分點。
- **兩個部分複製**（L625–684）：只做視覺條件的五個做法。低熟悉度用小鼠血糖實驗資料，高熟悉度用麥當勞與漢堡王三種食物兩種份量的熱量。**兩個複製各招了多少人，正文沒有寫。**

## 結果（逐項）

### 主實驗，視覺條件（投票資料）

對照條件一律是 None-Vis（看圖、另外重打一段選舉文字）。

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | Predict-Explain-Vis，絕對誤差 | −4.08 百分點，t = −4.02，p < .0001 | Core Results | L518–522 | 「the Predict-Explain-Vis condition had the lowest absolute error relative to the None-Vis condition by -4.08 … t = −4.02, p < .0001」 |
| 2 | Predict-Feedback-Vis，絕對誤差 | −3.54，t = −3.49，p < .001 | 同上 | L522–524 | 「The Predict-Feedback-Vis condition had the next lowest effect (-3.54; t = −3.49, p < .001)」 |
| 3 | Explain-Only-Vis，絕對誤差 | −3.52，t = −3.47，p < .0001（原文如此；t 值比上一列小，p 卻寫得更小） | 同上 | L524–525 | 「followed by the Explain-Only-Vis condition (-3.52; t = −3.47, p < .0001)」 |
| 4 | Predict-Only-Vis，絕對誤差 | −2.30，t = −2.25，p < .05 | 同上 | L525–526 | 「and the Predict-Only-Vis condition (-2.30; t = −2.25, p < .05)」 |
| 5 | 四種做法彼此之間 | **沒有差別** | 同上 | L534–535 | 「We observed no difference in absolute error between the four elicitation techniques.」 |
| 6 | 空間能力，絕對誤差 | 摺紙測驗每多對一題，誤差少 0.44，t = −3.63，p < .001 | 同上 | L531–533 | 「participants' expected absolute recall error decreased by 0.44」 |
| 7 | 趨勢誤差 | 只有 Predict-Explain-Vis（−2.06，t = −2.07，p < .05）與 Predict-Feedback-Vis（−2.79，t = −2.80，原文寫 p < .05）低於基準。**Explain-Only-Vis 與 Predict-Only-Vis 在趨勢誤差上沒有效果。** 空間能力無效果（t = −0.53，p = .596） | Trend Error | L536–544 | 「Only participants in the Predict-Explain-Vis and the Predict-Feedback-Vis conditions had a lower trend error compared to the None-Vis condition.」 |

### 主實驗，文字條件（投票資料）

對照條件是 None-Text。

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 8 | 視覺對文字的整體差距 | 視覺條件每個回憶值平均**多錯 3.76 百分點（36%）** | Visual vs Text | L547–552 | 「Overall, we observed 3.76 percentage points (36%) more errors on average per recalled value among visual conditions compared to text. This aligns with prior research indicating that text is better for exact value retention than visualization」 |
| 9 | **Explain-Only-Text，絕對誤差** | **−2.00，t = −2.07，p < .05（有效果）** | 同上 | L553–556 | 「the Explain-Only-Text condition was the only condition that led to lower absolute errors than the None-Text condition, by an average of -2.00」 |
| 10 | Predict-Explain-Text、Predict-Only-Text，絕對誤差 | 無效果；正文沒有數字。Figure 6(b) 上 Predict-Explain-Text 的點估計大約在 −1.8 上下、區間上緣貼近 0，Predict-Only-Text 大約 −0.6、區間跨過 0（從圖上讀的，不是精確值） | 同上 | L556–558；PDF 第 6 頁 | 「We observed no effect from the Predict-Explain and the Predict-Only techniques in the text modality conditions when we compared them to the None-Text condition」 |
| 11 | 文字條件的趨勢誤差 | 三種做法都沒有效果；視覺與文字的平均趨勢誤差也沒有差別；空間能力 t = −1.30，p = .193 | Trend Error | L564–567 | 「we found no effect of any of the elicitation techniques (i.e., Explain-Only-Text, Predict-Explain-Text, or Predict-Only-Text) compared to the None-Text condition.」 |
| 12 | 文字條件的空間能力 | 每多對一題，絕對誤差少 0.31，t = −2.04，p < .05 | 同上 | L562–563 | 「Participants with higher spatial ability scores again had a lower absolute error on recall by 0.31」 |

### 定錨與自我解釋的品質

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 13 | 預測值與回憶值的相關 | R² = 0.176，截距 −1.28，斜率 0.18 | L570–573 | 「We observed a weak positive correlation between the values that participants predicted and the values that they recalled」 |
| 14 | 回憶偏向自己的預測 | 有預測的受試者的資料點裡 75.9%，回憶的偏差方向與預測的偏差方向相同 | L573–579 | 「for 75.9% of the data points from participants who were asked to predict, their recalled value showed a bias in the same direction as their predicted value … Hence, a slight anchoring effect appears to be present.」 |
| 15 | 自我解釋的數量 | 每人平均 3.2 句（1–7）；句數對回憶誤差無效果（R² = 0.001，F = 0.39，原文寫 p < .533） | L582–591 | 「We observed no effect of the number of explanations on recall error」 |
| 16 | 自我解釋的品質 | 依 Chi 的準則分「有無用到先備知識的推論」與「細節高低」；兩位研究者編 42 份解釋（Cohen's kappa = 1）；對絕對誤差與趨勢誤差都沒有效果 | L592–624 | 「observed no effect of either quantity or quality on factors. It may be that the difference between participants' self-explanation quality was smaller overall than in educational studies of spontaneous self-explanation, perhaps due to the incentives to work quickly on AMT.」 |

### 部分複製（只有視覺條件）

| # | 資料集 | 結果 | 行號 | 原文一句 |
|---|---|---|---|---|
| 17 | 低熟悉度（小鼠血糖實驗），絕對誤差 | Explain-Only-Vis −1.78（t = −3.75，p < .001）；Predict-Explain-Vis −1.27（t = −2.62，p < .01）；Predict-Feedback-Vis −1.31（t = −2.69，p < .01）；**Predict-Only-Vis 無效果（t = −1.43，p = .152）**。前三者彼此沒有差別 | L640–648 | 「Predict-Only-Vis condition had no effect compared to the None condition (t = −1.43, p = .152).」 |
| 18 | 低熟悉度，趨勢誤差 | 全部無效果 | L650–652 | 「We also observed no effects of the elicitation techniques on decreasing trend error compared to the None condition.」 |
| 19 | **高熟悉度（速食熱量），絕對誤差與趨勢誤差** | **任何條件之間都沒有差別**；正文沒有數字，Figure 7(b) 四個做法的區間都跨過 0 | L675–678；PDF 第 8 頁 | 「Results of the mixed effect model for absolute error (Fig. 7(b)) and trend error indicate no differences between any conditions for the fast food dataset.」 |

### 資料前處理

| # | 結果 | 數字 | 行號 |
|---|---|---|---|
| 20 | 各條件作業時間 | 平均 19.4 分鐘（SD 8.4），條件間無差別（F(4) = 1.073，p = .37）。九個條件卻寫 F(4)，原文沒有說明這個檢定是怎麼分組的 | L470–472 |
| 21 | 預備調查的熟悉度相關 | 自評熟悉度與數值熟悉度 Spearman ρ = .84；自評與趨勢熟悉度 ρ = .42（皆 p < .001） | L319–322 |

### 假設有沒有被檢定

- H1（Explain-Only 在兩種呈現方式都勝過 None）：絕對誤差上兩邊都成立（結果 3、9）；趨勢誤差上兩邊都不成立（結果 7、11）。
- H2（三種預測條件在兩種呈現方式都勝過 None）：視覺成立（絕對誤差），**文字不成立**。
- H3（文字的預測效果小於視覺）：模型裡有呈現方式 × 做法的交互作用項（L496–499），但**正文沒有報告任何交互作用的係數或檢定**。作者的依據是「視覺條件顯著、文字條件不顯著」這個對比（L697–699）。一邊顯著一邊不顯著，不等於兩邊的差異顯著。Figure 6(b) 上 Predict-Explain-Text 的區間上緣就貼在 0 附近。

## 作者自己列的限制（Limitations and Future Work，L882–908）

1. 只測了一種資料結構（兩個類別維度加一個連續量），兩張圖共 12 個資料點；「Future work should evaluate the same techniques applied to other datasets with varying formats and sizes.」
2. 所有預測條件都是預測三組中的一組；沒有系統地變化提供多少參考資料：「we suspect that the effects of the techniques can be increased or decreased by adding or removing forms of context.」
3. 是否讓人互動得更久、更投入還沒有測，列為未來工作。

散在別處、作者承認的保留：

4. 高熟悉度資料集複製不出來，作者的解釋是推測：「One possible reason … the initial 'gap' is too small」（L704–709）。
5. 趨勢誤差的改善只出現在投票資料，另兩個資料集沒有；作者推測與線有沒有交叉有關（L710–717）。
6. 低熟悉度時只預測不夠：「a user needs additional reinforcement to recognize the gap」（L662–665）。
7. 自我解釋品質無效果，可能與 AMT 趕工的誘因有關（L619–623）。
8. 定錨：「a slight anchoring effect appears to be present」（L578–579）。

原文沒有討論的：回憶只隔三分鐘、沒有延宕測驗；沒有量理解；基準組另外重打一段文字，可能本身就占用注意力；受試者是 AMT 工作者；文字條件的呈現長什麼樣子正文沒有描述（Figure 1 只畫視覺條件的介面）；複製實驗的樣本數；H3 沒有直接檢定。

## 與摘要說法不一致的地方

1. **標題與摘要說「Recall and Comprehension」，實驗沒有量理解。** 摘要：「participants who are prompted to reflect on their prior knowledge by predicting and self-explaining data outperform a control group in recall and comprehension」（L21–23）。全文的依變項只有絕對誤差與趨勢誤差兩種回憶誤差，沒有任何理解題、推論題或遷移題。能勉強對上「comprehension」的只有趨勢誤差，而趨勢誤差只在主實驗視覺條件的兩種做法上有效果，兩個複製都沒有。結論段自己寫的是「improves recall of data values」（L919），沒有再提 comprehension。
2. 摘要說「These effects persist when participants have moderate or little prior knowledge on the datasets」（L23）。低熟悉度資料集上 Predict-Only 不顯著、趨勢誤差全部不顯著。摘要完全沒有提高熟悉度資料集上**什麼效果都沒有**。
3. 摘要說「We discuss how the effects differ based on text versus visual presentations」，沒有說方向。前言說「the text conditions do not」benefit from predicting（L89–91），成立；但文字條件裡 Explain-Only 是有效果的，前言沒有提。
4. 前言的貢獻 (2) 寫「prompting participants to first predict data, or to self-explain presented data, or to do both, improves data recall and comprehension」（L81–83）：同第 1 點。
5. 討論說預測加回饋「which we found to reduce both the absolute and relative recall error」（L718–719）：只在投票資料的視覺條件成立。
6. 討論說「our work is the first to show that incorporating prediction tasks … also improves users' ability to recall specific data」（L692–694）。實驗沒有把預測的貢獻單獨分離出來：四種做法之間沒有差別，只預測的那一組效果量最小（−2.30），在低熟悉度資料集上還不顯著。

## 與清單「要撐的結論」不合的地方

清單寫：「圖上先畫預測有效；**同一實驗的文字條件無效**」。

1. **「圖上先畫預測有效」要縮小範圍**：
   - 有效的是「三分鐘後回憶 12 個百分比的絕對誤差」，不是理解，也不是長期記憶。
   - 「只預測」是四種做法裡效果最小的（−2.30 百分點），在低熟悉度資料集上不顯著，在高熟悉度資料集上不顯著。預測加解釋、預測加回饋比較穩，但它們與「不預測、只打字解釋」（−3.52）沒有差別。照原文，不能說預測比解釋好，也不能說預測是必要成分。
   - 高熟悉度資料集上四種做法全部無效。
   - 預測會讓回憶偏向自己原本的猜測（75.9% 的資料點）。
2. **「文字條件無效」不對，要改寫**。文字條件裡無效的是兩種**預測**做法；**打字解釋（Explain-Only-Text）在文字條件是有效的**（−2.00 百分點，p < .05）。正確說法是「把資料用文字呈現時，先預測沒有幫助，要讀者自己解釋仍然有幫助」。
3. 文字與圖之間的差別沒有被直接檢定（見上面 H3）。能寫的是「圖的條件顯著、文字的條件不顯著」，不能寫「預測在圖上比在文字上有效」已被證實。
4. 對 order 7 還有一個清單沒寫、方向相反的結果：**記確切數值，文字整體比圖好**，圖的條件平均多錯 3.76 百分點（36%）。
5. 「互動」在這個實驗裡的意思是先畫出自己的預測，或打字解釋。基準組也有互動量（重打一段文字），所以這個實驗比的是「與資料內容有關的生成活動」對「無關的打字」，不是「有互動對沒互動」。
6. 清單的「之前讀到哪裡」欄寫「理解題與穩健性檢查沒讀」：全文讀完，**這篇論文沒有理解題**；穩健性檢查就是兩個部分複製（結果 17–19）。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–1145（一次讀完） | 標題、作者、摘要、前言、假設推導（內部表徵、自我解釋、好奇心理論）、條件與假設、預備調查（含 Table 1）、研究設計、受試者、流程、結果（資料前處理、分析方法、視覺條件、文字條件、定錨、自我解釋的量與質、兩個複製）、討論、設計空間三小節、限制與未來工作、結論；L924–1145 是參考文獻（掃過，共 48 筆） |
| 對版面 | PDF 第 6、8 頁 | Figure 6（主實驗視覺與文字條件的係數與區間）、Figure 7（兩個複製的係數與區間）。Figure 6(b)、7(b) 的數值正文沒有，紀錄裡標明是從圖上讀的近似值 |

版面註記：L650–656 的「resources in contrast to text, so that they can focus on more meaningful activities…」是討論段 L702 那一句的後半，轉檔時被搬到複製結果的中間；L260–266、L303–313 有圖說混進正文。Figure 1–5、8 沒有看影像（介面截圖與流程圖，內容已由正文與圖說涵蓋）。沒有附錄；補充材料在 GitHub，沒有讀。
