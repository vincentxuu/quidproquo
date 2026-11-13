# 抽取紀錄：Mosca、Ottley、Chang 2021，Does Interaction Improve Bayesian Reasoning with Visualization?（CHI 2021）

- **書目**：Ab Mosca（Tufts University）、Alvitta Ottley（Washington University in St. Louis）、Remco Chang（Tufts University）。Does Interaction Improve Bayesian Reasoning with Visualization? 收於 CHI 2021 論文集，ACM ISBN 978-1-4503-8096-6/21/05，doi 10.1145/3411764.3445176。作者姓名與單位照首頁（L3–14）。
- **版本**：arXiv:2103.01701v2（2021-03-05）的預印本，頁首印「PREPRINT」「To appear in proceedings of CHI 2021」（L59–61）。沒有對過 ACM 刊出版，頁碼只能寫預印本的第幾頁。
- **原文檔**：`.research/raw/learning-content/q2-interactive/mosca2021-interaction.txt`（1,332 行、75,127 字元，不帶 `-layout` 的 pdftotext；我重轉一次比對，行數與字元數相同）；PDF 同目錄 `mosca2021-interaction.pdf`，14 頁。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 7（該不該做互動）
- **補充材料沒有讀**：論文多次把分析推到 supplemental materials（實驗 1 的空間能力分析、各互動技術「有沒有動手」的進一步分析、原圖），這份檔案裡沒有，也沒有去抓。資料依 IRB 規定不公開（L527–529、L880–881）。

## 研究設計

- **類型**：兩個線上群眾外包實驗（Amazon Mechanical Turk），都是受試者間設計。
- **任務**（L376–386）：一題貝氏推理題，文字用頻率格式（100 人中 6 人有病，其中 4 人檢驗陽性；94 人沒病，其中 16 人檢驗陽性），旁邊配一張圖示陣列（icon array）。兩小題：(a) 多少人會檢驗陽性；(b) 陽性的人裡有多少真的有病。**兩小題都對才算答對**（L525–527、L874–875）。每人只做這一題。
- **所有條件都同時有文字與圖**（L406–407「given textual and visual representations」）。沒有「只有文字」的條件。
- **底圖三種**（L317–351）：grouped（有病／沒病分成兩塊格子，陽性集中在左上）、aligned（一張 5×20 格子，有病與陽性各自對齊成塊）、randomized（四種人隨機散在 5×20 格子）。
- **互動都不增加資訊**（L708–716）：只是把圖上已有的子群體隱藏、凸顯，或把文字與圖連起來。作者把這點當成設計前提：「adding interaction does not add any otherwise obscured information to the visualization, it simply highlights or draws connections between information already present」（L96–97）。
- **實驗 1**：2（cbAll 核取方塊／static）× 3（底圖）。招募 530 人，剔除跳過整段或沒照指示的 3 人、自述色盲的 55 人，剩 **N = 472**（L392–401）。限美國、通過率 > 90%；底薪 1.80 美元，每答對一題加 0.10 美元。有一頁操作說明頁，示範 static 與 cbAll 的圖例長什麼樣（L421–423）。cbAll：載入時全部勾選，畫面與靜態版相同，取消勾選會把該子群體藏起來。
- **實驗 2**：5（cbAll、cbNone、drag、hover、tooltip）× 3（底圖）。招募 2,149 人，剔除 35 + 134 人，剩 **N = 1,980**（L729–735、L821）。底薪 **0.80 美元**（實驗 1 是 1.80）。**沒有說明頁**，說明改放在每張圖旁；主任務後多做一份 NASA-TLX（L830–834）。
  - cbAll 的實作和實驗 1 不同：沒勾的子群體改成淺灰佔位符，不再整個消失（L701–703）。
  - cbNone：同 cbAll 但預設全部不勾。drag：把圖例標籤拖上／拖離圖。hover：滑過文字裡描述子群體的地方，文字與圖上對應的子群體一起反白。tooltip：滑過任一圖示，跳出文字說它屬於哪一群（L641–662）。
- **實驗 2 的靜態對照組是借來的**：L876–878「we included the static group from Experiment 1 as an "interaction technique" in our analysis (this brings the total number of participants to N = 2,206)」。也就是 1,980 + 226 = 2,206；靜態組沒有和實驗 2 的互動組一起隨機分派，報酬與有無說明頁也不同。
- **量了什麼**：答對比例（唯一的成果變項）；有沒有動手操作；紙張摺疊測驗 VZ-2 的空間能力分數（分數範圍 −5 到 20，中位數 6.25，≥ 中位數算高空間能力，L968–972）。NASA-TLX 有收，**正文沒有報告任何 NASA-TLX 結果**。作答時間沒有報告。
- **何時量**：看完刺激後立即作答，沒有延宕測驗，沒有遷移題。
- **統計**：全部是比例齊一性的卡方檢定（2、3、6、18 組），事後比較用 Bonferroni 校正；信賴區間用 Wilson 分數法。沒有迴歸、沒有效果量、沒有事前檢定力分析。

### 各組人數（Table 2、Table 5，已對 PDF 版面，列與欄的合計都驗算過）

| | grouped | aligned | randomized | 合計 |
|---|---|---|---|---|
| 實驗 1 cbAll | 64 | 100 | 82 | 246 |
| 實驗 1 static | 86 | 70 | 70 | 226 |
| 實驗 1 合計 | 150 | 170 | 152 | 472 |
| 實驗 2 cbAll | 119 | 129 | 123 | 371 |
| 實驗 2 cbNone | 147 | 125 | 122 | 394 |
| 實驗 2 drag | 102 | 115 | 129 | 346 |
| 實驗 2 hover | 131 | 136 | 167 | 434 |
| 實驗 2 tooltip | 147 | 154 | 134 | 435 |
| 實驗 2 合計 | 646 | 659 | 675 | 1,980 |

受試者組成（Table 3、Table 6）：實驗 1 女性 38.3%、男性 61.0%，學士 56.6%；實驗 2 女性 54.1%、男性 45.1%，學士 49.8%。兩個實驗的性別比例差很多，而實驗 2 的靜態組來自實驗 1。

## 結果（逐項）

圖上的百分比是我從 PDF 的圖讀的（圖上印有數值標籤）；文字檔裡沒有這些數字。

### 實驗 1

| # | 結果 | 數字 | 對照條件 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 互動對靜態，整體 | cbAll 53%（圖 1 標 52.85）對 static 57%（57.08）；χ²(1, N=472) = 0.69，p = 0.41，**不顯著** | 加了核取方塊的圖 vs 同一張靜態圖 | 4.6.1／Fig. 1 | L465–473 | 「We find no statistically significant difference in accuracy between participants using the cbAll versus the static visualization (χ²(1, N = 472) = 0.69, p = 0.41)」 |
| 2 | 多少人動手 | cbAll 組 246 人裡只有 43% 用了核取方塊 | — | 4.6.1 | L536–538 | 「Out of the 246 participants assigned to cbAll, only 43% used the checkboxes on the visualization.」 |
| 3 | 有動手對沒動手（同在 cbAll 組內，非隨機） | 動手的 70%（圖 2 標 70.48）答對，沒動手的 40%（39.72）；χ²(1, N=246) = 21.63，p < 0.001；差的 95% CI [−43.48, −18.04] | cbAll 組內自己選擇動手與否的兩群人 | 4.6.1／Fig. 2 | L538–545 | 「Seventy percent of the participants who interacted with the visualization answered correctly, while only 40% of those who did not interact answered correctly」 |
| 4 | 作者對 #3 的解讀 | 不下因果結論 | — | 4.6.1 | L545–554 | 「simply adding interaction does not guarantee use. However, the act of interacting may improve performance on a Bayesian reasoning task. We note future work is needed to isolate if this is an artifact of participant engagement, or an effect of interacting.」 |
| 5 | 底圖主效果 | grouped 57.33、aligned 57.06、randomized 50.00（圖 3）；χ²(2, N=472) = 2.15，p = 0.34，**不顯著** | 三種底圖（互動與靜態合併） | 4.6.2／Fig. 3 | L576–584 | 「We find no significant difference in accuracy by base visualization」 |
| 6 | 底圖 × 互動（六組） | χ²(5, N=472) = 6.42，p = 0.27，**不顯著** | 六個格子互比 | 4.6.2 | L585–588、L556–559 | 「This suggests that the value-add of interaction may not be modulated by base visualization design.」 |
| 7 | 六格的答對比例（圖 4） | static-grouped 58.14、cbAll-grouped 56.25、static-aligned 54.29、cbAll-aligned 59.00、static-randomized 58.57、**cbAll-randomized 42.68** | 同上 | Fig. 4 | L560–567 | 「the proportion of correct answers is smaller on average for participants assigned the cbAll version of the randomized visualization. While this difference is not statistically significant, we note that practically speaking it is important to consider」 |
| 8 | 沒動手的比例（討論段的說法） | 57% 沒有操作 | — | 4.7 | L617–619 | 「a sizable portion of our study population assigned to the interactive visualization did not interact with it (57%).」 |

randomized 底圖上互動比靜態低 15.9 個百分點（58.57 對 42.68），原文沒有對這一對單獨做檢定，只有六組總檢定（p = 0.27）。作者把它叫「observational findings」，用認知負荷過載來解釋，並明寫是推測（L608–616「We speculate」「we postulate」）。

### 實驗 2（靜態組借自實驗 1，N = 2,206）

| # | 結果 | 數字 | 對照條件 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 9 | 六種「互動技術」（含 static）互比 | χ²(5, N=2206) = 11.33，作者寫 p = 0.05，**判為不顯著** | static、cbAll、cbNone、drag、hover、tooltip | 5.6.1 | L885–898 | 「We find no statistically significant difference in accuracy between participants using different interaction techniques (χ²(5, N = 2206) = 11.33, p = 0.05), and therefore fail to reject the null hypothesis.」 |
| 10 | 各技術答對比例（圖 5） | static 57.08、cbAll 56.60、cbNone 56.85、drag 49.71、hover 48.16、tooltip 53.33 | 同上 | Fig. 5 | L883–884 | 圖說：「Portion of participants answering the Bayesian reasoning task correctly given each interaction technique.」 |
| 11 | cbAll 動手比例 | 371 人裡 44% 實際操作；其他互動條件的比例「顯著較高」，但**沒有給數字** | — | 5.6.1 | L899–900 | 「out of the 371 participants assigned to cbAll, only 44% actually interacted. This proportion was significantly higher for all other interactive conditions.」 |
| 12 | 有動手對沒動手，各技術分開檢定 | 只有 drag 顯著：χ²(1, N=346) = 18.49，p < 0.001，差的 95% CI [−38.69, −14.93]。其餘四種不顯著，沒有給數字 | 同一條件內自己選擇動手與否 | 5.6.1 | L900–906 | 「Interestingly drag is the only condition in which participants who interacted were significantly more accurate than those who did not」 |
| 13 | 底圖主效果 | grouped 56.01、aligned 54.87、randomized 49.13（圖 6）；χ²(2, N=2206) = 8.09，p = 0.02，**顯著** | 三種底圖（六種技術合併） | 5.6.2／Fig. 6 | L909–913 | 「We find a significant difference in accuracy by base」 |
| 14 | 事後比較 | grouped > randomized：χ²(1, N=1477) = 6.74，p < 0.01；差的 95% CI [−12.10, −1.67]（Bonferroni 校正後 α = 0.02） | 兩種底圖 | 5.6.2 | L913–920 | 「This suggests that design of the underlying static visualization has an effect on participants' accuracy in a Bayesian reasoning task.」 |
| 15 | 底圖 × 技術（18 組） | χ²(17, N=2206) = 27.92，作者寫 p = 0.05，**判為不顯著** | 18 個格子 | 5.6.2 | L921–925 | 「We find no significant difference (χ²(17, N = 2206) = 27.92, p = 0.05) and therefore fail to reject the null hypothesis.」 |
| 16 | 18 格答對比例（圖 7） | grouped：static 58.14、cbAll 62.18、cbNone 56.46、drag 54.90、hover 51.91、tooltip 53.74。aligned：static 54.29、cbAll 57.36、cbNone 64.80、drag 44.35、hover 50.74、tooltip 56.49。randomized：static 58.57、cbAll 50.41、cbNone 49.18、drag 50.39、hover 43.11、tooltip 49.25 | 同上 | Fig. 7 | L953–960 | 「any interactive technique added to the randomized base resulted in lower accuracy on average than the static version of randomized. This is not the case for the grouped and aligned bases.」 |
| 17 | 高空間能力組，六種技術互比 | χ²(5, N=1114) = 17.76，p < 0.005，**顯著** | 同 #9，只看高分組 | 5.6.3 | L934–936 | 「Within the high spatial ability group we find a statistically significant difference in accuracy between participants using different interaction techniques」 |
| 18 | 高空間能力組：hover 對 static | χ²(1, N=332) = 12.44，p < 0.001（校正後 α = 0.003）；差的 95% CI [9.43, 30.37]；圖 8：static 80.36、hover 60.45 | 加了 hover 的圖 vs 靜態圖 | 5.6.3／Fig. 8 | L936–943 | 「A larger proportion of participants with high spatial ability answered the Bayesian reasoning task correctly using the static visualization versus the hover visualization」 |
| 19 | 高空間能力組其他技術（圖 8） | cbAll 72.04、cbNone 73.96、drag 67.24、tooltip 70.87（全都低於 static 80.36，但只有 hover 通過校正後的事後比較） | 同上 | Fig. 8 | L985–987 | 原文只報告 hover 這一對顯著 |
| 20 | 低空間能力組，六種技術互比 | χ²(5, N=1092) = 5.72，p = 0.33，**不顯著**；圖 8：static 34.21、cbAll 41.08、cbNone 40.59、drag 31.98、hover 35.51、tooltip 33.66 | 同 #9，只看低分組 | 5.6.3／Fig. 8 | L944–951 | 「for people with low spatial ability, adding interaction to a static visualization does not significantly effect reasoning accuracy.」 |
| 21 | 高空間能力組的底圖效果 | χ²(2, N=1114) = 2.93，p = 0.23，不顯著；圖 9：grouped 71.82、aligned 71.51、randomized 66.75 | 三種底圖 | 5.6.4／Fig. 9 | L1001–1004 | 「Within the high spatial ability group we find no significant difference in accuracy by base」 |
| 22 | 低空間能力組的底圖效果 | χ²(2, N=1092) = 11.23，p < 0.005，顯著；randomized 比 grouped 差（χ²(1, N=721) = 9.43，p < 0.005，CI [−18.38, −4.01]），比 aligned 差（χ²(1, N=722) = 6.77，p < 0.01，CI [−16.62, −2.32]）；圖 9：grouped 40.54、aligned 38.81、randomized 29.34 | 三種底圖 | 5.6.4／Fig. 9 | L1005–1017 | 「for people with high spatial ability, performance on a Bayesian reasoning task is not affected by design of the underlying static visualization, and for people with low spatial ability it is.」 |
| 23 | 各空間能力組內，底圖 × 技術 | 高分組 χ²(17, N=1114) = 23.64，p = 0.13；低分組 χ²(17, N=1092) = 23.41，p = 0.14；**都不顯著** | 18 個格子 | 5.6.4 | L1018–1035 | 「This suggests that for people with high and low spatial ability the value-add of interaction is not modulated by underlying static visualization design and interaction technique.」 |
| 24 | 高低空間能力的差距 | 圖 8、圖 9 上兩組的 95% CI 完全不重疊（高分組約 60–80%，低分組約 30–41%）；沒有做檢定 | 高分組 vs 低分組 | 5.6.3 | L973–978 | 「we observe no overlaps in 95% confidence intervals for proportions of correct answers of participants with high versus low spatial ability.」 |

圖 10（低空間能力，18 格）與圖 11（高空間能力，18 格）的數值我有對過 PDF 第 11 頁，但字太小，不逐格抄錄；圖 11 裡三種底圖的 static 都在 79–81（80.95、79.31、80.49），hover 是 59.70、68.75、55.06。

### 作者的總結句

- L1069–1073：「Despite our best efforts, none of the interaction techniques we test significantly improve participants' performance on a Bayesian reasoning task compared to a static visualization. Moreover, we identify several scenarios that suggest interaction decreases participants' performance.」
- L1085–1089：「a well-designed static visualization can be as (if not more) beneficial to solving complex reasoning tasks as an interactive visualization. In cases where the user's interactions result in additional information being shown on the visualization (e.g. panning a map), the value of the interaction is undisputed.」
- L1096–1099：建議「a cautious use of interactivity in cases where it does not add additional information to a visualization」。

### 相關文獻段裡可能被轉引的句子（二手，本篇沒有驗證）

- Theis 等 [39]：互動對靜態的不確定性圖，錯誤率無顯著差異（L74–75）；2.1 節又說依準確度與速度靜態版較好（L181–183）。兩處說法不完全一樣。
- Ragan 等 [35]：互動對自動的視角控制，理解與細節回憶無顯著差異（L183–186）。
- Zhi 等 [46]：在敘事型圖表加 brushing 與 linking 提高投入度（L179–181）。
- Tsai 等 [41]：互動核取方塊的頻率格子比「機率格式的純文字」準；作者指出那是互動圖＋頻率文字對上機率文字，條件不對等（L1045–1058）。
- Khan 等 [24]：雙樹圖加拖放。2.2 節寫「significantly decreased accuracy」（L240–241），討論段寫「decreased performance … but not significantly so」（L1040–1044）。**同一篇論文對同一項前人結果前後說法相反**，要引 Khan 2018 得回原文查。
- Micallef、Ottley、Khan 三份比較研究：圖相對於文字沒有顯著提高貝氏推理準確度（L222–225）。
- 註腳 2 引 Archie Tse 的簡報（L704–706），說法是「scaling back their creation of interactive visualization in lieu of static images」（L630–632），沒有引任何百分比。

## 作者自己列的限制（第 7 節，L1105–1156）

1. 範圍有限：只測了圖示陣列一類底圖、五種互動、一種題目數值；「It is plausible that there exists a combination of visualization and interaction techniques that can improve participants' abilities to solve the Bayesian reasoning task」（L1109–1111）。
2. 測的互動都不增加新資訊；作者認為在貝氏推理題裡增加資訊沒有意義（L1120–1130）。
3. 題目的敏感度、特異度、盛行率換一組數值，結果可能不同（L1131–1134）。
4. 「互動可能妨礙高認知負荷任務」只是推論，沒有量認知負荷的實證依據（L1148–1152）。（NASA-TLX 有收但沒報告，作者沒有提這一點。）

作者沒有列、但從方法讀得出來的：實驗 2 的靜態組借自實驗 1（報酬、說明頁、招募時間、性別組成都不同）；只有一題、立即作答；受試者是 MTurk 工作者；動手與否是自選。

## 與摘要說法不一致的地方

1. **摘要「In some cases, it can significantly detract from it」**：全篇通過顯著檢定的「互動比靜態差」只有一個——實驗 2 高空間能力組的 hover 對 static（#18）。其餘「變差」的情形（randomized 底圖上的各種互動、drag 與 hover 的整體比例）都沒有達顯著，作者在正文自己寫「This decrease is not statistically significant」（L1075–1076）。
2. **摘要「underlying visualization design modulates performance」**：顯著的是底圖的主效果（實驗 2，#13；實驗 1 不顯著，#5）。「底圖會改變互動的效果」這個交互作用，四次檢定全部不顯著（#6、#15、#23）。結論段卻寫「The results illustrate that the effect of interaction is largely dependent on the design of the underlying static visualization, and implementation of the interaction itself」（L1165–1167），與 5.6.1 的「the design of an interactive technique does not affect the value-add of interaction」（L896–898）和 5.6.4 的結語（L1032–1035）互相矛盾。
3. **貢獻第 (2) 點**「provide empirical and observational evidence that the value-add of interaction … is dependant on two factors」（L126–128）：同上，實證檢定不支持，只有圖上的觀察。
4. **討論段自己前後矛盾**：L1079–1082 剛說高空間能力組的 hover 顯著較差，下一句寫「While all of these findings are not statistically significant」。
5. **兩個 p = 0.05**：#9 的 χ²(5) = 11.33 與 #15 的 χ²(17) = 27.92，作者都寫 p = 0.05 並判為不顯著。我用卡方分布重算，分別是 p ≈ 0.045 與 p ≈ 0.046，都略低於 0.05。這是我的計算，不是原文的說法；原文沒有給到小數第三位。引用時應寫「作者報告 p = 0.05、判為不顯著」，不要寫成「明確無差異」。整體比例上 drag（49.71）與 hover（48.16）比 static（57.08）低 7 到 9 個百分點。
6. **摘要「Through two crowdsourced studies」**沒有提靜態對照組只在實驗 1 收過一次，實驗 2 的所有「互動對靜態」比較都是跨實驗比較。
7. **L957–958「This is not the case for the grouped and aligned bases」**：圖 7 上 grouped 底圖的 cbNone、drag、hover、tooltip 四種都低於 static-grouped（58.14），只有 cbAll 較高；aligned 底圖的 drag、hover 也低於 static-aligned。原文那句話只在「不是每一種互動都較低」的意義上成立。

## 與清單「要撐的結論」不合的地方

清單寫：「**無效果或反向**：在靜態圖上加互動沒有幫助」。

- 「沒有幫助」撐得住：兩個實驗、五種互動技術，沒有任何一種顯著優於靜態（L1069–1073）。
- 「反向」要縮小範圍：顯著變差只出現在一個子群體的一種技術（高空間能力者用 hover，80.36% 對 60.45%）。其他都是不顯著的下降。
- 必須連著寫的條件：
  1. 任務是**一題貝氏推理的答對率**，立即作答；不是學習成效、不是保留、不是遷移。這篇不能拿來說「互動圖學得比較差」。
  2. 互動**不增加資訊**；作者明說會帶出新資訊的互動（例如平移地圖）價值沒有爭議（L1087–1089）。
  3. 所有條件都有文字＋圖，比較的是「同一張圖能不能操作」。
  4. 實驗 2 的靜態組是實驗 1 的人，報酬與流程不同；唯一顯著的反向結果正好出在這個跨實驗比較上。
- 清單沒寫、但原文有、對 order 7 可能更有用的兩項：
  - **放了互動不等於有人用**：cbAll 組只有 43%（實驗 1）與 44%（實驗 2）的人動手。
  - **動手的人答對率高得多**（70% 對 40%），但這是自選分組，作者不下因果結論。寫文章時不能把它寫成「有互動的人學得好」。
- 高空間能力組用靜態圖答對 80%、低空間能力組只有 34%，差距遠大於任何互動技術造成的差別；這是原文圖 8 的數字，原文對這個差距只說信賴區間不重疊，沒有檢定。

## 讀取紀錄

依序讀過原文檔 L1–39（標題、作者、摘要、關鍵詞）、L40–499（前言、相關研究、研究問題、實驗 1 設計與結果前半）、L500–1332（實驗 1 結果後半與討論、實驗 2 全部、第 6–8 節、致謝、參考文獻）。雙欄轉檔造成段落交錯的地方（4.2／4.3、4.6／4.7、5.1.2、5.6.4／第 6 節）對著 PDF 第 4–11 頁的版面重新接過。

對過 PDF 的表與圖：Table 1（刺激示意）、Table 2、Table 3、Table 4（刺激示意）、Table 5、Table 6；Figure 1–11 的數值標籤（PDF 第 5、6、9、10、11 頁，圖 7 另外放大到 250 dpi 讀）。參考文獻 46 筆只掃過。

沒有讀到的：補充材料（實驗 1 的空間能力分析、各技術動手與否的分析、分析腳本）。
