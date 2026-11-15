# 抽取紀錄：Zhang & Ma 2023，Frontiers in Psychology 14:1202728

**書目**：Lu Zhang（Institute of Computer and Information Science, Chongqing Normal University）、Yan Ma（Institute of Smart Education, Chongqing Normal University，通訊作者）。〈A study of the impact of project-based learning on student learning effects: a meta-analysis study〉。Frontiers in Psychology，2023 年 7 月 17 日刊出，14 卷，文章編號 1202728。doi 10.3389/fpsyg.2023.1202728。PMCID PMC10411581。期刊標的文章類型是「Systematic Review」。作者姓名與單位對過 PDF 首頁。

**原文檔**：

- `.research/raw/learning-content/q3-activity/zhang_ma2023.md`（清單列的檔；PMC 頁面轉的 markdown，412 行、110,448 字元，其中 L323–412 是參考文獻）。**以下行號一律指這個檔。**
- `.research/raw/learning-content/q3-activity/zhang_ma2023.pdf`（本批次新增，14 頁；來源 `https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1202728/pdf`，出版者開放取用版，CC BY）。用來對表與看圖。

**讀取日期**：2026-10-14
**版本**：刊出版
**供哪幾篇 order 使用**：order 11（結論 11-e）

**先講最要緊的一件事**：這篇刊出版的表本身有錯（見「與摘要說法不一致的地方」第 1–4 點）。markdown 檔與出版者 PDF 的數字一模一樣，所以不是轉檔弄壞的，是原文如此。Table 4 的國家地區那一區、Table 2 的信賴區間不能照抄引用。

---

## 研究設計

- **類型**：統合分析。作者自述照 Glass (1976) 的四步驟：蒐集、編碼、算效果量、調節變項分析（L62）。軟體 Comprehensive Meta Analysis 3.0（L57、L122）。
- **專題式學習的定義**（L29）：引 Jingfu & Zhixian 2002，「a new model of inquiry-based learning that is centered on the concepts and principles of a subject … with the aim of producing a complete project work and solving multiple interrelated problems within a certain period of time」。全文縮寫用 PBL，沒有與 problem-based learning 區分；L82 還把 1969 年 McMaster 大學的 PBL（那是 problem-based learning）當成專題式學習的歷史。
- **檢索**（L67）：2003–2023 年；CNKI、Springer Link、Web of Science、Semantic Scholar「and other databases」；關鍵詞 project-based learning、PBL、project teaching 配 learning effect、performance、achievement、outcome 等。來源限「SSCI or SCI authoritative journals, Chinese core journals … and part of the master's degree thesis」。另查參考文獻。沒有寫檢索日期、沒有完整檢索式。
- **納入標準**（L72，四條）：(1) 去重；(2)「it had to be a study of the effects of project-based learning versus traditional teaching models on learning effectiveness」；(3) 實證研究；(4) 有能算效果量的完整數據。**沒有任何關於研究設計品質、隨機分派、前測等值的標準。**
- **篩選流程**（Figure 2，看過 PDF 第 4 頁的圖）：資料庫共 1,790 筆（CNKI 506、Springer Link 94、Web of Science 398、Semantic Scholar 792）→ 去重 289 → 1,501 → 看題目摘要刪 827 → 674 → 刪非實證 304、刪「non-college students」196、刪對照組不是傳統教學 89 → 讀全文後符合者 91 → 刪資料不全 25 → 納入 66。
  - 674 − (304＋196＋89) = 85，圖上寫 91，差 6，原文沒有解釋。
  - 圖上寫刪掉「non-college students (n=196)」，但納入的效果量有 133 個來自中小學（Table 4）。這一格的意思不明，我無法判斷是筆誤還是別的。
- **最後納入**：66 篇，190 個效果量（L14、L151）。一篇研究可貢獻多個效果量（Table 1 裡同一篇 Parrado-Martínez & Sánchez-Andújar 2020 就佔 6 個）。**全文沒有說明怎麼處理同一研究多個效果量的相依性**，190 個當成獨立樣本算。
- **受試者**：沒有報告總人數。依效果量數：小學 41、國中 52、高中 40、大學 57（Table 4）。地區依效果量數：東亞 94、西歐 32、西亞 23、東南亞 15、北美 14、大洋洲 9、北非 1、東歐 1、南美 1（Table 4）。東亞佔 190 個裡的 94 個；參考文獻裡標明碩士論文或附 CNKI 連結的有 20 筆。
- **比較對象**：專題式學習 vs「traditional teaching」。傳統教學是什麼沒有定義。
- **量了什麼**：學習效果分三類（L82、L161）：學業成就 40 個效果量、情意態度 50 個（動機、態度、興趣、自我效能）、思維能力 100 個（創造思考、運算思維、決策、批判思考、問題解決、提問、合作、綜合應用）。各研究用什麼工具量、何時量，沒有報告。沒有延宕測驗的資訊。
- **調節變項**（L82）：學科類別、課程類型（理論課／實驗課）、國家地區、學段、班級規模、小組人數、實驗期間。班級規模的分法是依樣本數：小 1–100 人、中 100–200 人、大 200–300 人（L193）。
- **編碼信度**：兩位研究者各自編 66 篇，Kappa = 0.864（L82）。
- **效果量**（L108–120）：StdDiff = (Mean1 − Mean2) / 合併標準差。公式是未經小樣本校正的標準化平均差；L57 與 L133 卻稱它是「can correct for small sample bias」的「unbiased effect value」，公式與說法不合。
- **各研究的清單**：Table 1 只列 15 列（表題寫「due to space limitation, only part of the coding content is shown」）。190 個效果量的個別數值、樣本數、研究設計都沒有公開；資料可得性聲明（L301）說資料在文章或補充材料裡，但文中找不到補充材料的連結或內容。**所以這篇的結果無法由讀者重算。**

---

## 結果（逐項）

對照條件一律是「專題式學習 vs 傳統教學」。Table 1–4 都對過出版者 PDF 的版面（`pdftotext -layout`），markdown 與 PDF 數字相同。

### A. 出版偏誤與異質性

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| A1 | Begg 秩相關檢定 | Z = 5.082，p < 0.05（顯著，表示可能有出版偏誤） | L133 | 「Begg's rank test Z = 5.082 > 1.960 (p < 0.05), indicating a possible publication bias」 |
| A2 | fail-safe N | 2,546，大於 5K＋10（K = 190，即 960） | L133 | 「it can be concluded that there is no significant publication bias in this study」 |
| A3 | Trim and Fill | 方法段說有做，**沒有報告結果** | L133 | 「Begg's rank test, Trim and Fill and Fail-safe N to quantitatively analyze publication bias」 |
| A4 | 漏斗圖（Figure 3，看過 PDF 第 6 頁） | 中線約在 0.3；右側（SMD 1 到 2.5）有二十來個點落在漏斗外，左側最遠只到約 −0.7。我看圖的判讀是明顯右偏 | L133 | 「a small number of effect values were relative to the right」 |
| A5 | 異質性 | Q = 1496.2，p < 0.001；I² = 87.4% | L143 | 「there is a high degree of heterogeneity between the samples」 |

### B. 整體效果（Table 2，L153–159）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| B1 | 隨機效果 | SMD = 0.441，k = 190，Z = 12.334，p = 0.000；表列 95% CI 下限 0.371、上限 0.551 | L159 | 「Random effects \| 190 \| 0.441 \| 0.371 \| 0.551 \| 12.334 \| 0.000」 |
| B2 | 固定效果 | SMD = 0.306，k = 190，Z = 24.854；表列下限 0.453、上限 0.331（**下限大於上限也大於點估計，表有誤**） | L158 | 「Fixed effects \| 190 \| 0.306 \| 0.453 \| 0.331 \| 24.854 \| 0.000」 |
| B3 | 作者的詮釋 | 0.441「接近 0.5」，稱為「large degree of impact」 | L151 | 「indicating that project-based learning has a large degree of impact on learning outcomes」 |

B1 補註：由 Z 反推標準誤約 0.036，95% CI 應約 [0.371, 0.511]；Table 4 課程類型的合併列正好是 0.441 [0.372, 0.511]。所以表上的 0.551 很可能是 0.511 的誤植。這是我的推算，原文沒有更正。固定與隨機兩個估計差很多（0.306 對 0.441），表示小樣本研究的效果偏大。

### C. 三類學習效果（Table 3，L165–182）

| # | 類別 | k | SMD | 95% CI | Z | p |
|---|---|---|---|---|---|---|
| C1 | **學業成就** | 40 | 0.650 | [0.453, 0.846] | 6.480 | 0.000 |
| C2 | 情意態度（合計） | 50 | 0.389 | 未報 | — | — |
| C2a | 學習動機 | 5 | 0.401 | [0.162, 0.640] | 3.283 | 0.001 |
| C2b | 學習態度 | 18 | 0.536 | [0.312, 0.759] | 4.702 | 0.000 |
| C2c | 學習興趣 | 7 | 0.713 | [0.282, 1.145] | 3.242 | 0.001 |
| C2d | 自我效能 | 20 | 0.181 | [0.062, 0.301] | 2.969 | 0.003 |
| C3 | 思維能力（合計） | 100 | 0.386 | 未報 | — | — |
| C3a | 創造思考 | 14 | 0.626 | [0.288, 0.965] | 8.956 | 0.000 |
| C3b | 運算思維 | 5 | 0.719 | [0.332, 1.106] | 3.645 | 0.000 |
| C3c | **決策能力（不顯著）** | 9 | 0.092 | [−0.127, 0.311] | 0.820 | 0.412 |
| C3d | **批判思考（不顯著）** | 2 | 0.512 | [−0.583, 1.607] | 0.916 | 0.360 |
| C3e | 問題解決 | 18 | 0.365 | [0.182, 0.548] | 3.909 | 0.000 |
| C3f | **提問能力（不顯著）** | 13 | 0.117 | [−0.092, 0.326] | 1.096 | 0.273 |
| C3g | 合作能力 | 17 | 0.404 | [0.141, 0.666] | 3.016 | 0.003 |
| C3h | 綜合應用 | 22 | 0.432 | [0.217, 0.646] | 3.945 | 0.000 |

原文一句（L163）：「but the effects on decision making, critical thinking, and problem raising skills did not reach a statistically significant level」。k 加總 40＋50＋100 = 190，子類加總也對。C3a 補註：由信賴區間反推 Z 應約 3.6，表上寫 8.956，兩者不合，我無法判斷哪個錯。

### D. 調節變項（Table 4，L195–237；正文 L187–243）

**全表沒有任何組間異質性檢定（Q-between）的數值。** 正文只在課程類型與實驗期間兩處各寫一句「reached a statistically significant level (p < 0.001)」（L241、L243），沒有給統計量；國家地區、學段、小組人數、班級規模、學科五項連這句都沒有。每個調節變項底下還各報一個「combined effect」（0.358、0.355、0.592、0.378、0.443、0.441、0.424），作者把它讀成「該調節變項對學習效果的整體調節效果量」（例 L187、L191），這不是調節分析的正確讀法。

| # | 調節變項 | 各組 k、SMD、95% CI | 行號 |
|---|---|---|---|
| D1 | 學段 | 小學 41，0.527 [0.369, 0.684]；國中 52，0.520 [0.388, 0.651]；高中 40，0.720 [0.558, 0.881]；**大學 57，0.116 [0.027, 0.204]** | L210–214 |
| D2 | 小組人數（只有 81 個效果量有報） | 3 人以下 2，0.778 [0.464, 1.093]；4–5 人 23，0.909 [0.720, 1.099]；6–7 人 42，0.436 [0.310, 0.562]；8 人以上 14，0.514 [0.229, 0.799] | L215–219 |
| D3 | 班級規模 | 小 104，0.483 [0.387, 0.578]；中 71，0.466 [0.338, 0.594]；**大 15，0.106 [0.021, 0.233]，Z = 1.642，p = 0.101（不顯著；下限印成 0.021，照 Z 值應是負的）** | L220–223 |
| D4 | 學科 | 工程與技術 62，0.619 [0.482, 0.756]；人文社會 55，0.284 [0.166, 0.402]；生命科學 3，0.708 [0.482, 0.933]；自然科學 42，0.484 [0.365, 0.602]；其他 28，0.275 [0.107, 0.442] | L224–229 |
| D5 | 課程類型 | 理論課 103，0.393 [0.297, 0.488]；實驗課 87，0.498 [0.395, 0.600] | L230–232 |
| D6 | 實驗期間 | 單次 28，0.359 [0.241, 0.478]；1–8 週 62，0.498 [0.380, 0.615]；9–18 週 35，0.673 [0.494, 0.853]；18 週以上 65，0.300 [0.179, 0.420] | L233–237 |
| D7 | 國家地區 | **表列的信賴區間、Z、p 不可用（見下）。** 只有 k 與 SMD 兩欄與正文一致：北非 1，2.033；北美 14，0.061；大洋洲 9，0.334；東南亞 15，0.684；東歐 1，0.305；東亞 94，0.550；南美 1，1.145；西歐 32，0.076；西亞 23，0.594 | L200–209 |

D7 的問題：表上北美 SMD = 0.061，信賴區間卻是 [1.447, 2.618]、p = 0.000；正文（L187）寫的是「SMD = 0.061, p = 0.429」。同一組四個數字（0.190／0.857／1.249／0.212；1.447／2.618／6.806／0.000；0.058／0.258／1.239／0.215）各重複出現在兩個不同地區的列上，九列裡沒有一列的區間包住自己的點估計。這一區的後四欄是排錯或貼錯的。

D2 補註：Table 4 的註腳（markdown 檔沒有抓到，見 PDF 第 10 頁）寫：「To avoid the inclusion of literature that did not provide group size numbers from influencing the study results, only literature that did provide data was included in the analysis here.」也就是 190 個效果量裡有 109 個沒有小組人數資料。

### E. 作者的整合建議（L287）

「For high school students in the field of engineering and technology subject areas of laboratory courses to 9–18 weeks as the experimental period, based on small class teaching, and group size of 4–5 people using the PBL method of teaching, to promote the improvement of student learning outcomes more effective.」這是把七個單變項分析各自最高的那一格拼在一起，沒有做過交互作用或多變項分析。

---

## 作者自己列的限制（L297）

1. 有些研究統計資訊不足，沒能納入。
2. 多數研究沒有對學習效果做具體分類，限制了更細的分析。

就這兩點。後面接的是未來研究方向：(1)「the current empirical studies on project-based learning focus on primary and secondary schools, with less research on the impact on universities and young children」；(2) 結合教育數位轉型。

**作者沒有列、但讀全文看得出來的問題**（我的整理，不是原文說法）：

- 沒有編碼研究設計（隨機或準實驗、有無前測、對照組是否等值），也沒有任何研究品質評估。
- 同一研究的多個效果量當獨立樣本。
- Begg 檢定顯著、漏斗圖右偏、固定與隨機估計差很多，卻以 fail-safe N 下結論說沒有顯著出版偏誤；Trim and Fill 的結果沒報。
- 調節分析沒有報組間檢定，卻用「significantly better」下結論。
- 個別研究的資料沒有公開，無法重算。
- 編碼有看得出來的錯：Table 1 第 3–8 列把 Parrado-Martínez & Sánchez-Andújar 2020 編成「國中、大洋洲」，L38 又說它研究的是九年級生的寫作；但參考文獻（L377）的題目是〈Development of competences in postgraduate studies of finance: A project-based learning (PBL) case study〉，是研究所的財務課程。我沒有讀那篇原文，只能確定「題目與編碼對不上」。
- 參考文獻有重複條目：Yang 2020（L403）與 Yuan 2017（L407）指向同一個 CNKI 檔號 1017093188；Ying 2022（L406）與 Zhang 2022（L410）是同一個 DOI；García-Rodríguez 等 2021（L343）與 Ruiz-Rosa 等 2021（L381）是同一個 DOI。這些有沒有被重複計入 66 篇，原文看不出來。
- L38 描述的 Zhang (2022) 是 21 名學生的單組前後測（「administered to 21 private university students before and after」），沒有對照組；它有沒有進統合分析，原文看不出來（它在 L82 的編碼引用名單裡）。
- 兩位審稿人之一 Yousef Wardat 的兩篇文章（Hamad 等 2022、Wardat 等 2022）在文獻回顧被引用（L38），兩篇的題目都與專題式學習的成效無直接關係。
- 經費來自重慶市研究生教改專案與重慶師範大學智慧教育研究院（L309）；聲明無利益衝突（L313）。

---

## 與摘要說法不一致的地方

逐項對過，有下面這些。前四點是表本身的錯。

1. **Table 4 國家地區區塊的信賴區間、Z、p 全部對不上點估計**（見 D7）。摘要與討論的主要調節結論之一「亞洲、尤其東南亞顯著優於西歐與北美」就建立在這一區，而這一區沒有可用的區間，也沒有組間檢定。「significantly」沒有統計依據可查。
2. **Table 2 固定效果的信賴區間下限 0.453 大於點估計 0.306**；隨機效果的上限 0.551 與 Z 值不合（見 B1、B2）。
3. **Table 3 創造思考的 Z = 8.956 與它的信賴區間不合**（見 C3a 補註）。
4. **Table 4 大班的下限 0.021 與 p = 0.101 不合**；正文 L193 還寫成「p = 0.101 < 0.05」。
5. **正文與表的數字不一致**：
   - 討論 L255 寫思維能力 SMD = 0.387、情意態度 SMD = 0.379；Table 3 是 0.386、0.389。
   - 討論 L266 寫 18 週以上 SMD = 0.359；Table 4 是 0.300（0.359 是單次實驗那一列）。
6. **效果大小的形容前後不一**：L151 說 0.441 是「large degree of impact」，L253 說是「moderately positive」。L151 引 Cohen 的基準也引錯（寫成小於 0.2 是小、0.2–0.8 是中、大於 0.8 是顯著）。
7. **摘要說對三類成果都有正向貢獻**，沒有提思維能力底下有三個子類（決策、批判思考、提問）不顯著；這三項在正文 L163 有寫。
8. **摘要寫「亞洲優於西歐與北美」**，討論 L260 的條列卻寫「優於大洋洲與西歐」。
9. **出版偏誤**：摘要沒提；正文自己報了 Begg 檢定顯著，卻下結論「no significant publication bias」。
10. **限制節說現有研究集中在中小學、大學較少**；Table 4 的大學效果量 57 個，是四個學段裡最多的。
11. **摘要說「9–18 週較合適」「4–5 人最佳」「高中優勢明顯」**，都是單變項的描述性排序，沒有報組間檢定；4–5 人那一格的分析只用了 190 個效果量裡的 81 個。

---

## 與清單「要撐的結論」不合的地方

清單寫這篇要撐 **11-e「專題式學習對成績的統合效果為正，但研究設計弱、全部有老師與小組」**。分三段對：

- **「對成績的統合效果為正」**：原文有這個數字，學業成就 SMD = 0.650，95% CI [0.453, 0.846]，40 個效果量，對照是「傳統教學」。但依上面列的問題，這個數字的可信度低：沒有品質篩選、相依效果量沒處理、出版偏誤檢定顯著而未校正、個別資料不公開、同一篇文章的其他表有多處明顯錯誤。**我的建議是不要把 0.650 當成可靠的估計來寫**；要引就得同時寫出這些問題，或改用別的統合分析當主要來源、這篇只當「也報告正向效果、但品質有疑慮」的一筆。這是我的判斷，請主筆決定。
- **「研究設計弱」**：這句話**不能引這篇來撐**，因為這篇根本沒有評估或報告納入研究的設計品質，只說是「experimental or quasi-experimental」。能說的是「這份統合分析本身的方法弱，而且沒有交代納入研究的設計」。若要講「專題式學習的原始研究設計弱」，要靠 Condliffe 等 2017 那一類有做品質評述的來源。
- **「全部有老師與小組」**：原文**沒有這樣的陳述**。
  - 小組：190 個效果量裡只有 81 個報了小組人數（D2 註腳），其餘 109 個是不是分組做，原文沒說。只能寫「有報的都是分組」，不能寫「全部」。
  - 老師：原文沒有描述各研究的教學安排。可以由納入標準（對照組是傳統教學）與學段、班級規模的編碼推知這些都是學校課堂裡的研究，但「全部有老師」是推論，不是原文的話。
  - 比較穩的寫法：「這份統合分析納入的都是學校課堂裡與傳統教學對照的研究，沒有任何一筆是學習者獨自做專案。」這句與清單「找不到來源」節裡「沒有來源可以撐自學者做專案有效或無效」一致。
- 清單在 Chen & Yang 2019 那一列提到「它的 Highlights 與第 9 項在地區調節上方向相反」。就這篇這一邊而言，地區調節的結論沒有可用的統計（見上面第 1 點），所以這個「衝突」的其中一邊本來就站不住，不需要當成兩份可靠結果互相矛盾來處理。
- 這篇有、清單沒提、與本站讀者較相關的一點：**大學階段的效果最小**，SMD = 0.116 [0.027, 0.204]，57 個效果量（D1）。同樣沒有組間檢定，也受上述品質問題影響，只能當線索。

---

## 讀取紀錄

讀的是 `zhang_ma2023.md`（412 行），用 Read 依序：

| 段 | 行號 | 內容 |
|---|---|---|
| 1 | L1–134 | 摘要、導言、文獻回顧與研究框架、研究設計（方法、檢索、納入、編碼、Table 1、資料分析）、出版偏誤檢定 |
| 2 | L135–303 | Figure 3 圖說、異質性、整體效果（Table 2）、三類成果（Table 3）、七個調節變項（Table 4）、討論四小節、結論、限制、資料可得性聲明 |
| 3 | L304–412 | 作者貢獻、經費、利益衝突、出版者註、致謝、參考文獻（這篇的參考文獻逐條讀過，因為要核對納入研究的身分） |

**對過 PDF 的表與圖**（`zhang_ma2023.pdf`）：

- Table 1（15 列）、Table 2、Table 3、Table 4（含續表與註腳）：全部用 `pdftotext -layout` 的版面逐格對過，與 markdown 數字相同；Table 4 的註腳只在 PDF 裡有。
- Figure 1（研究框架）、Figure 2（篩選流程，數字抄自圖）、Figure 3（漏斗圖）：把 PDF 第 4、6 頁轉成圖看過。
- Figure 4（理論框架示意圖）：只讀了圖說與正文對它的描述（L273–282），沒有看圖。
- 首頁（作者、單位、編輯與審稿人、收稿與刊出日期）：讀過 PDF 版面第 1–45 行。

全文沒有附錄；補充材料在文中找不到。
