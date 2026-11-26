# 抽取紀錄：Leutner & Biele 2025（畫圖輔助的統合分析）

## 檔頭

- **書目**：Leutner, Detlev, & Biele, Johanna (2025). Without Integration, Everything Is Nothing: A Meta-Analysis of the Effectiveness of Instructional Support for Drawing-to-Learn. *Educational Psychology Review*, 37(4), Article 93. https://doi.org/10.1007/s10648-025-10067-7
  - 作者全名對過 PDF 首頁（「Detlev Leutner 1 · Johanna Biele 1」）與文末作者資訊，也對過 Crossref（given/family 相同）。卷 37、文章號 93 取自 PDF 頁首；期別 4 只出現在 Crossref，PDF 頁首只寫「(2025) 37:93」。
  - 收稿 2025-04-11，接受 2025-08-12，線上刊出 2025-09-18。授權 CC BY 4.0（Projekt DEAL 開放取用）。
  - 單位：兩位作者都在 University of Duisburg-Essen；PDF 註明 Biele 現職 Ludwig-Maximilians-University of Munich。
- **版本**：出版者刊出版（Springer 開放取用 PDF，35 頁）。
- **原文檔**：
  1. 主要閱讀檔（這次新存）：`.work/learning-visualization-research/src/leutner-biele2025-springer-pdf.jina.md`，346 行、111,298 位元組。取得網址：https://link.springer.com/content/pdf/10.1007/s10648-025-10067-7.pdf （經 Jina reader `r.jina.ai` 轉文字；Unpaywall 列此網址為 best_oa_location，host_type publisher、version publishedVersion、license cc-by）。curl 直接抓 PDF 只拿到 3,038 位元組的 HTML 挑戰頁，沒有存 PDF 本體。
  2. 舊檔：`.work/learning-visualization-research/src/integration-meta2025.md`，1,317 行、216,811 位元組，取自 https://link.springer.com/article/10.1007/s10648-025-10067-7 （出版者文章網頁，經 Jina）。**這份不完整**：沒有作者區塊、沒有摘要，表 1–3 都只剩「Full size table」字樣，大部分長度是內嵌的參考文獻提示文字。這就是文章附錄說「我存的原文檔沒有作者區塊」的原因。
  3. 表格對照用：https://link.springer.com/article/10.1007/s10648-025-10067-7/tables/2 與 `/tables/3`（出版者網頁的表格頁，經 Jina），存在 scratch，未存回專案。
- **合法性**：Springer 出版者開放取用版，CC BY 4.0。✓
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 2 篇（圖表，`2026-10-13-diagrams-in-teaching-articles.md` 與英文版）。

## 研究設計

- **類型**：統合分析（random-effects，Knapp-Hartung 調整，SPSS 29.0.1.0）。比較「有輔助地畫」與「只畫、沒有輔助」（drawing-only）兩組的學習成果。
- **納入標準**（Inclusion Criteria 節）：畫圖是學習活動、手繪（紙或平板）、英文、有全文、2005 年 van Meter & Garner 之後（含）刊出、至少報平均與標準差、要同時有 drawing-only 組與 drawing support 組、依變項是畫圖之後的理解或遷移測驗。實驗或準實驗設計，不限國家年齡。
- **排除**：拖放式作圖、醫學解剖圖、地圖輪廓這類再現型圖、醫學生受試者、合作畫圖、拿畫圖當評量工具、眼動研究、教「怎麼畫」的研究、draw-an-engineer／draw-a-science-teacher 這類測驗。
- **檢索**：2023 年 6–7 月。六個資料庫（PubMed、PMC、PSYNDEX、Web of Science、EMBASE、ERIC）＋作者追查＋引用追蹤。1,514 筆 → 去重 1,028 → 全文評估 147 → 納入 14 個研究、16 個獨立比較（Search Strategy 節，Fig. 1）。
- **研究描述**（Study Descriptives 節）：研究刊出年 2001–2022（注意：與納入標準的「2005 年後」不一致，van Meter 2001 被納入），8 篇在 Cromley 等 2020 之後。計算平均學習成果的樣本數 18 到 46 人，平均 30、中位數 29。14 篇裡 7 篇（50%）受試者是 college 或高中生，7 篇（50%）是大學部學生。
- **效果量**：Hedges g。四篇研究（Fiorella 等 2021、Schmidgall 等 2020、van Meter 2001、van Meter 等 2006）各有兩種輔助對一個 drawing-only 組，兩個效果量用合併平均與合併標準差併成一個。理解／遷移的歸類由作者依定義判斷，不一定照原研究的分類。
- **調節變項**（二元編碼，兩位作者都編，分歧討論到一致）：
  - 降低外在認知負荷（ECL）：8 篇研究、10 個效果量。例：提供背景圖、指示要畫哪些元素、粗體標示要畫的元素、畫前選主旨或寫摘要。
  - 增加增生認知負荷（GCL）：10 篇、10 個效果量。例：畫圖時心像、邊畫邊解釋、指示畫哪些元素、多次修改提示、為想像的同伴畫、與老師互動。
  - 促進整合：6 篇、6 個效果量（是 GCL 的子集）。Jamet & Michinov 2022、Zhang & Fiorella 2021、Fiorella & Kuhlmann 2020、Lardi & Leopold 2022、van Meter 2001、van Meter 等 2006。
  - 三個成分不互斥，一種輔助可以同時屬於幾個成分（表 1）。
- **假設**：H1 有輔助勝過沒輔助；H2–H4 包含各成分的輔助勝過不包含的。註腳 1：假設出自第二作者未發表、有預註冊的碩士論文；**論文裡 H1 是驗證性分析，H2–H4 三個調節假設是探索性分析**。
- **量了什麼**：理解測驗與遷移測驗分數。遷移只有 k = 7，依 Schwarzer 等 2015「至少 k = 10」的經驗法則，調節分析只做理解。

## 結果（逐項）

1. **整體效果，理解**：g = 0.04，SE = 0.11，p = 0.738；有輔助組合計 N = 590、沒輔助組 N = 623。異質性 Q(15) = 37.99，p < 0.001。（Overall Effect of Drawing Support 節，主檔第 166–170 行）原文：「The overall effect of drawing support (Hypothesis 1) turned out to be statistically non-significant for both the comprehension test, g = 0.04, SE = 0.11, p = 0.738」
2. **整體效果，遷移**：g = −0.10，SE = 0.25，p = 0.696；有輔助 N = 274、沒輔助 N = 255。異質性 Q(6) = 28.33，p < 0.001。（同節，第 166–170 行）原文：「This indicated that there were no overall beneficial effects of drawing support for students’ comprehension and transfer.」
3. **總人數**：1,213 人（摘要、討論開頭）。等於理解比較的 590 + 623；遷移的 529 人是其中一部分。
4. **出版偏誤**（表 2，第 148–150 行；已對出版者表格頁）：理解 Egger 截距 0.57、p = 0.245、trim-and-fill p = 0.738；遷移截距 0.71、p = 0.532、trim-and-fill p = 0.696。作者結論是沒有出版偏誤，但也說遷移的漏斗圖看起來不對稱、研究少時可能是偶然，「inferences on publication bias cannot be drawn with high confidence」（第 162 行）。理解漏斗圖有四個研究落在 95% 信賴區間外。
   - 觀察（我的，不是作者說的）：表 2 的 trim-and-fill p 值 0.738、0.696 和整體效果的 p 值完全相同。
5. **調節：降低 ECL**（表 3，第 186–187 行；已對出版者表格頁）：Q(1) = 0.00，p = 0.976，不顯著，H2 被拒絕。不含此成分 k = 6，g = 0.03，SE 0.20，p = 0.874，95% CI [−0.46, 0.54]，Q = 15.69，df 5，p = 0.008；含此成分 k = 10，g = 0.04，SE 0.31，p = 0.761，CI [−0.25, 0.33]，Q = 21.59，df 9，p = 0.010。
   - 觀察（我的）：含 ECL 那列 SE 印成 0.31，但 CI [−0.25, 0.33] 的寬度對應的 SE 約 0.13；PDF 文字與出版者網頁表格都是 0.31，照原文記。
6. **調節：增加 GCL**（表 3）：Q(1) = 0.92，p = 0.339，不顯著，H3 被拒絕。不含 k = 6，g = −0.11，SE 0.18，p = 0.572，CI [−0.57, 0.35]，Q = 10.62，df 5，p = 0.059；含 k = 10，g = 0.11，SE 0.13，p = 0.404，CI [−0.18, 0.41]，Q = 25.54，df 9，p < 0.001。
7. **調節：促進整合**（表 3；第 178–180 行）：Q(1) = 7.90，p = 0.005，顯著。含此成分 k = 6，**g = 0.35**，SE 0.13，**p = 0.048**，CI [0.004, 0.70]，Q = 9.43，df 5，p = 0.093；不含 k = 10，**g = −0.15**，SE 0.11，p = 0.186，CI [−0.39, 0.09]，Q = 13.94，df 9，p = 0.125。原文：「Facilitation of integration … turned out to be a significant moderator of the effect of drawing support on students’ comprehension, Q(1) = 7.90, p = 0.005, with an aggregated effect size of g = 0.35, p = 0.048, for facilitation, and of g = − 0.15, p = 0.186, for no facilitation of integration.」兩個子群的異質性都不顯著。
8. **多元統合迴歸**（三個調節變項同時放入，第 189–191 行）：降低 ECL b = −0.404，t(12) = −1.390，p = 0.190；增加 GCL b = −0.546，t(12) = −1.534，p = 0.151；促進整合 b = 0.864，t(12) = 2.939，p = 0.012。原文：「facilitation of integration remains a statistically significant moderator even when adjusted for the other two moderators.」
9. **討論中轉述的先前統合分析**（第 203 行）：Cromley 等 2020 有輔助對沒輔助，事實知識 g = 0.22、推論知識 g = 0.28 顯著，遷移 g = 0.16 不顯著；Zhang 等 2021 保留 g = 0.24 不顯著、遷移 g = −0.06。Zhang 等 2021 另有畫圖輔助顯著節省學習時間 g = 1.69（k = 6），認知負荷沒有降低（k = 7）（第 213 行）。作者原文：「given the comparably small number of studies included in our meta-analysis and the strong heterogeneity of effect sizes, a general positive effect of drawing support on students’ learning outcomes might have been overlooked in our analysis.」
10. **作者對 Cromley 等 2020 的批評**（第 207–209 行）：Cromley 的 41 篇只有 3 篇符合本文標準（排除理由在補充表 5）；Cromley 納入拖放式作圖與合作畫圖；Cromley 的「improved drawing（ID）比較」定義沒有一致套用，例如 Leopold & Leutner 2012 的「drawing vs. main idea selection」（事實 g = 1.40）、「main selection vs. main idea selection and drawing」（g = 1.80）、遷移的「drawing vs. summary」（g = 1.09）、「drawing vs main idea selection」（g = 1.22）兩組並不都有畫圖，卻被算成 ID 比較。原文：「it is likely that the overall effect size may have been somewhat overestimated」「the authors’ finding of a small but significant effect of drawing support may be open to question.」
11. **各成分的解釋**（討論）：降低 ECL 無效的可能原因是畫圖任務本身沒有超出工作記憶（Jamet & Michinov 2022 Exp. 1 的受試者自述），或輔助反而提高負荷（Schmidgall 等 2020 的輔助組自評難度較高）。單一成分的 GCL 輔助（為想像同伴畫、畫前看或寫解釋、畫圖加心像、多次修改提示）沒有幫學生把文字模型與圖像模型整合。促進整合的機制例子：邊畫邊解釋、拿自己的圖對照提供的圖（van Meter 2001、2006）、文字問題提示修圖（Zhang & Fiorella 2021）、看老師畫（Lardi & Leopold 2022）。作者稱 g = 0.35 是「small to medium effect size」（第 233 行）。
12. **背景節提到的個別研究**（前言，非本文分析結果）：Leutner 等 2009 畫圖加心像降低理解、提高認知負荷；Fiorella 等 2021 提供解釋讓圖畫得較好，但一週後延宕測驗效果消失；van Meter 等 2006 有對照提示的組勝過只畫組與無提示對照組；Ainsworth 等 2007 為他人畫與為自己畫學習成果無差異，但圖較精確。

## 作者自己列的限制

- 納入研究少（14 個研究、16 個比較），更多研究可能得到不同結果，結果要保守解讀（Limitations 節，第 239–241 行）。
- 只能對理解檢驗調節假設，遷移研究太少做不了。
- 支持「促進整合」的結果還需要更多證據；可再研究不同年齡需要哪種輔助。
- 討論中另外承認：研究數少、異質性強，可能漏掉一般性的正效果（第 203 行）；理解的漏斗圖缺少高精確度研究，遷移的漏斗圖不對稱（第 162 行）。
- 前言說明不分析學習者特徵（年齡、先備知識）與其他輔助類型；討論提到先備知識太低時整合可能根本不會發生，建議後續研究納入先備知識與年齡。

## 與摘要說法不一致的地方

1. 摘要把「促進整合」寫成直接的發現（「facilitation of integration turned out to be a significant moderator」），沒有提到註腳 1：三個調節假設在預註冊的碩士論文裡是**探索性分析**，只有 H1 是驗證性。
2. 摘要說促進整合的輔助「significantly increased students’ comprehension (g = 0.35)」，正文的 p = 0.048、CI 下限 0.004，剛好過門檻；摘要沒有給 p 或信賴區間。
3. 摘要說 14 個研究的比較是「regarding differences in comprehension and transfer as learning outcomes (total N = 1213)」；1,213 是理解比較的人數合計（590 + 623），遷移只有 7 個比較、529 人。摘要沒寫錯，但讀者容易以為兩種成果都是 1,213 人、16 個比較。
4. 摘要說「drawing support in general was not related to students’ learning outcomes」，正文討論自己承認可能因研究少而漏掉一般性正效果；摘要沒有這個保留。
5. 正文內部：納入標準寫「published in or after … van Meter and Garner (2005)」，但研究描述寫刊出年 2001–2022，且 van Meter 2001 確實被納入。

## 與清單「文章引用了什麼」不合的地方

清單 D-14 列的是「g = 0.04、−0.10、14 個研究、1,213 人」。四項都和原文一致（結果 1–3）。補充：1,213 只對應理解的比較；−0.10 是遷移、只有 7 個比較。

## 已發佈文章引用核對

對象：`src/content/posts/learning/2026-10-13-diagrams-in-teaching-articles.md`（清單寫的行號 235、437、469 是舊行號，2026-10-14 實查為 235、432、461），英文版同行號內容對應，一併核對。

| 位置 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| 第 235 行 | 「兩篇統合分析的結論不同」（Leutner & Biele 對 Cromley 等 2020） | 討論與限制都寫 Cromley 得到顯著的整體效果，本文沒有 | 一致 |
| 第 235 行 | 比較「有輔助地畫」與「只叫學生畫」，整體沒有效果（理解 g = 0.04） | g = 0.04，p = 0.738；比較對象是 drawing-only 組 | 一致 |
| 第 235 行 | 「有效的只有幫學生把圖和文字整合起來的那一類，例如拿自己的圖去對照提供的圖」 | 促進整合子群 g = 0.35，p = 0.048，CI [0.004, 0.70]，只限理解；例子對得上表 1 與 van Meter 2001／2006 | 大致一致，但少了限定：這是跨研究的子群／調節分析（k = 6），作者預註冊時列為探索性，p 剛過 0.05，只有理解、沒有遷移。原文的「整合」是把文字模型、圖像模型與先備知識整合成一致的心智模型，不只是「圖和文字」 |
| 第 235 行 | 這篇自己指出 Cromley 等用比較多的研究得到顯著的整體效果，和它的結果不一致 | 限制節原文：「while Cromley and colleagues (2020) found a significant general effect of drawing support with a larger number of studies included in their meta-analysis」 | 一致 |
| 第 235 行 | 「它的解釋是自己的納入標準比較嚴、研究比較少」 | 作者的主要解釋不是這個。作者說 Cromley 納入了拖放式與合作畫圖、41 篇只有 3 篇符合本文標準，**而且** Cromley 的 ID 比較定義不一致、把兩組不都有畫圖的大效果量（1.40、1.80、1.09、1.22）算進去，整體效果「may have been somewhat overestimated」「may be open to question」。研究少是作者另外承認的限制（可能漏掉一般性正效果），不是用來解釋不一致的主因 | **部分不一致**：漏了作者對 Cromley 編碼方式的批評，把作者的立場寫得比原文中立 |
| 第 235 行 | Cromley 那篇只讀到摘要 | （本紀錄不涉及） | 不核 |
| 第 432 行 | Educational Psychology Review 37 卷 4 期（作者與卷期取自 Crossref；存的原文檔沒有作者區塊） | Crossref：37(4)，文章號 93；PDF 頁首只有 37:93。舊檔確實沒有作者區塊；新存的 PDF 文字檔有 | 一致；可補「文章號 93」。「原文檔沒有作者區塊」在換用新檔後不再成立 |
| 第 432 行 | 14 個研究、16 個獨立比較、1,213 人 | 同 | 一致（1,213 是理解比較的人數） |
| 第 432 行 | 理解 g = 0.04（p = 0.738），遷移 g = −0.10（p = 0.696），兩者異質性都顯著 | g = 0.04，p = 0.738，Q(15) = 37.99；g = −0.10，p = 0.696，Q(6) = 28.33，兩者 p < 0.001 | 一致 |
| 第 432 行 | 「幫助整合」在控制另外兩個調節變項之後仍然顯著 | b = 0.864，t(12) = 2.939，p = 0.012 | 一致 |
| 第 432 行 | 作者說明納入研究少，結果要保守解讀 | 「Accordingly, our results should be interpreted with caution.」 | 一致 |
| 第 432 行 | 提到 Cromley 等（2020）用較多研究得到顯著的整體效果，Zhang 等（2021）同樣沒有找到主效果 | 限制節原文同義 | 一致 |
| 第 432 行 | 「我讀了結果、討論開頭與限制」 | 本次已全文精讀 | 閱讀範圍說明可更新 |
| 第 461 行（參考資料） | 題名、連結 | 題名與 DOI 頁一致 | 一致；閱讀範圍說明同上可更新 |

## 讀取紀錄

- 主檔 `leutner-biele2025-springer-pdf.jina.md`，依序讀：第 1–60 行（題名、作者、摘要、前言到 ECL 成分節）→ 第 60–119 行（GCL 成分、社會互動、解釋、指示元素、心像、促進整合、本研究、假設、方法：排除／納入／檢索、效果量）→ 第 118–217 行（合併標準差公式、調節變項編碼、資料分析、結果：研究描述、偏誤檢查與表 2、整體效果、調節分析與表 3、多元迴歸、討論開頭、整體效果討論、與 Cromley、Zhang 比較）→ 第 217–241 行（各成分討論、限制）→ 第 241–346 行（限制尾段、結論、作者貢獻、資金、資料可得性、聲明、授權、參考文獻〔掃過〕、作者資訊）。首尾相接涵蓋全文 1–346 行。
- 舊檔 `integration-meta2025.md` 另用 scratch 清掉內嵌參考提示後讀了對應前言到假設的部分（清理後第 1–115 行），內容與主檔一致；其餘部分沒有重讀，因為表格缺漏，以主檔為準。
- 表格：表 2、表 3 用主檔的 PDF 文字與出版者網頁表格頁（`/tables/2`、`/tables/3`）兩份對照，數字逐格一致。**沒有看到 PDF 頁面影像**（curl 抓 PDF 被擋，沒有本機 PDF）；表 1 只有文字版，內容是定義與例子，沒有數字。
- 沒讀：補充材料（Supplemental Table 1–5，含各研究效果量與排除 Cromley 38 篇的理由）；Fig. 1、Fig. 4、Fig. 5 的圖形本身（只有圖說）。
