# 抽取紀錄：Gorbunova、Kapuza、Chen、Costley 2025，Rethinking pre-training（Frontiers in Psychology）

- **書目**：Anna Gorbunova¹、Anastasiia Kapuza¹（通訊作者）、Ouhao Chen²、Jamie Costley³。¹HSE University, Moscow；²School of Education, University of Leeds；³College of Education, United Arab Emirates University。2025。Rethinking pre-training: cognitive load implications for learners with varying prior knowledge. *Frontiers in Psychology* 16:1628047。DOI 10.3389/fpsyg.2025.1628047。PMCID PMC12367772，PMID 40851629。收稿 2025-05-13、接受 2025-07-25、線上刊出 2025-08-07。CC BY。作者姓名、單位、DOI 都是從 XML 的 front matter 直接抄的（清單上「作者群沒核對」那一格可以補上了）。
- **原文檔**：`.research/raw/learning-content/q1-learner/pretraining2025_PMC12367772.xml`（JATS XML，80 行、144,624 位元組／144,237 字元，含標記）。我用自寫的小腳本去掉標記、表格每格以「 | 」分隔，轉成同目錄 `pretraining2025_PMC12367772.txt`（623 行、78,866 位元組），下面行號（L）都是這個 .txt 的行號。表 1–3 另外對過 XML 原始的 `<table>` 標記（含 rowspan／colspan）。
- **補充資料**：正文多處寫「see Supplementary materials」，原檔沒有。2026-10-14 從 Europe PMC 的補充檔服務抓回（`https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12367772/supplementaryFiles`，出版者隨文公開的檔），存在 `.research/raw/learning-content/q1-learner/pretraining2025_supp/`：`Image_1.png`（概念圖）、`Presentation_1.pdf`（詞彙表，1 頁）、`Presentation_2.pdf`（Microsoft Forms 問卷全文，4 頁）。三個都讀完。
- **讀取日期**：2026-10-14
- **版本**：刊出版（PMC 收錄的出版者 XML，pmc-version 1）
- **供哪篇使用**：order 12（先備知識）

## 研究設計

- **類型**：單組、前後兩階段的重複測量設計，外加用事前測驗分數把人事後切成兩組。**沒有「不給事前訓練」的對照組，也沒有隨機分派**。所有 136 人都拿到同一份事前訓練。作者自己在結論末段承認：「Future studies could also … compare pre-training against a control condition」（L273）。
- **受試者**（L129）：136 位，73.6% 女性；「second-year graduate students from various majors at a selective Russian university」，來自超過 15 個學程；在兩門教育類選修課的一堂同步線上課裡施測。摘要寫的是「136 university students」。事前檢定力分析算出需要 n = 125（L128，假設 η² = 0.06、2×2 混合 ANOVA、α = .05、power = .80）。
- **教材主題**：「Cognitive Load」（認知負荷理論本身）。
- **事前訓練**（L134–136、補充資料）：一張作者預先畫好的概念圖（16 個節點，中心是 Cognitive load）加一份 14 個詞條的詞彙表，約 7 分鐘。概念圖節點與詞彙表詞條大量重疊，作者說兩者「served complementary functions and were designed to be used together as a unified tool」。
- **流程**（L141–157，共 80 分鐘）：講師介紹 10 分鐘 → 先備知識測驗（約 7 分）→ 事前訓練（約 7 分）→ 認知負荷問卷第一次（約 7 分）→ 解題活動（約 30 分，**可以繼續看概念圖與詞彙表**）→ 認知負荷問卷第二次（約 7 分）→ 與老師討論 10 分鐘。
- **先備知識怎麼量、怎麼分組**（L166–167、註 1 L277）：8 題選擇題，每題 1 分；Cronbach's α = 0.44。平均 6.31（SD 1.40，範圍 2–8）。以中位數 6 切：低於 6 分為低先備組（26.5%），6 分以上為高先備組（73.5%）。136 人換算約 36 人與 100 人，**這兩個人數是我算的，原文只給百分比**。作者承認測驗太簡單、有天花板效應。
- **認知負荷怎麼量**（L172、補充資料）：Krieglstein 等 2023 的自陳量表，0–9 分；正文說 ICL、ECL、GCL 各 5 題；α 介於 0.62 到 0.92（沒有分量表列）。兩次施測的題目**不是同一組對象**：第一次的 ECL 題問的是「概念圖的設計」（例：「The design of the concept map was inconvenient.」），第二次問的是「題目的設計」（例：「The design of the tasks was inconvenient.」）。ICL 題兩次大多相同（問認知負荷理論難不難），只有一題從「concept map 的結構」換成「tasks 的結構」。
- **解題分數**（L177）：6 題簡答（前 3 題各 0–2 分、後 3 題各 0–3 分，滿分 15），兩位作者評分，Cohen's κ = 0.63–0.82，取兩人平均後加總。
- **分析**（L202–205）：ICL、ECL、GCL 各跑一個 2（階段：事前訓練 vs 解題，受試者內）× 2（先備知識：低 vs 高，受試者間）的重複測量 ANOVA；R 的 afex，Type III；事後比較用 emmeans，Bonferroni 校正；效果量是 generalized eta squared。
- **何時量**：全部在同一堂 80 分鐘的課內，沒有延宕測驗。

## 結果（逐項）

### Table 1　描述統計（L182–197；對過 XML 的表格標記，前四欄是全體 Mean／SD／Min／Max，後四欄是低先備組 Mean／SD、高先備組 Mean／SD）

| # | 變項 | 全體 M（SD） | 低先備組 M（SD） | 高先備組 M（SD） |
|---|---|---|---|---|
| 1 | 先備知識（0–8） | 6.31（1.40），範圍 2–8 | 表中空白 | 表中空白 |
| 2 | 事前訓練階段 ICL | 4.39（1.61） | 4.89（1.93） | 4.21（1.44） |
| 3 | 事前訓練階段 ECL | 4.79（1.97） | 5.37（2.08） | 4.58（1.89） |
| 4 | 事前訓練階段 GCL | 5.92（1.17） | 5.59（1.34） | 6.03（1.08） |
| 5 | 解題階段 ICL | 4.63（1.77） | 5.17（2.04） | 4.43（1.63） |
| 6 | 解題階段 ECL | 3.64（1.91） | 4.16（2.35） | 3.45（1.69） |
| 7 | 解題階段 GCL | 6.47（1.32） | 5.92（1.66） | 6.67（1.13） |
| 8 | 兩階段合計 ICL／ECL／GCL | 4.51（1.59）／4.21（1.68）／6.19（1.1） | 5.03（1.85）／4.76（1.95）／5.76（1.28） | 4.32（1.45）／4.02（1.53）／6.35（0.99） |
| 9 | 解題分數（0–15） | 7.51（2.43），範圍 0–13.5 | 5.97（2.79） | 8.03（2.08） |

解題分數兩組差 2.06 分，**原文沒有對這個差做任何檢定，也沒有在結果或討論裡提它**。

### Table 2　2×2 重複測量 ANOVA（L218–234）與 RQ1（L213–214）

| # | 結果 | 數字 | 對照 | 原文一句（L214） |
|---|---|---|---|---|
| 10 | 先備知識對 ICL 的主效果 | F(1, 134) = 5.51，p = 0.02，η²G = 0.03 | 高先備組 vs 低先備組，**兩階段合併** | 「ICL was significantly lower for learners with higher prior knowledge than those with lower prior knowledge, F(1, 134) = 5.51, p = 0.02, η2 = 0.03, supporting H1a.」 |
| 11 | 先備知識對 ECL 的主效果 | F(1, 134) = 5.41，p = 0.02，η²G = 0.03 | 同上 | 「ECL also differed significantly between groups, F(1, 134) = 5.41, p = 0.02, η2 = 0.03, consistent with H1b.」 |
| 12 | 先備知識對 GCL 的主效果 | F(1, 134) = 8.07，p < 0.01，η²G = 0.04 | 同上 | 「GCL was significantly higher in the higher prior knowledge group, F(1, 134) = 8.07, p < 0.01, η2 = 0.04, confirming H1c.」 |
| 13 | 階段對 ICL 的主效果 | F = 2.09，p = 0.15，η²G < 0.01，**不顯著** | 解題 vs 事前訓練 | Table 2 |
| 14 | 階段對 ECL 的主效果 | F = 13.97，p < 0.01，η²G = 0.03 | 解題 vs 事前訓練 | Table 2 |
| 15 | 階段對 GCL 的主效果 | F = 2.8，p = 0.10，η²G < 0.01，**不顯著** | 解題 vs 事前訓練 | Table 2 |
| 16 | 先備知識 × 階段交互作用：ICL | F = 0.05，p = 0.82，**不顯著** | — | Table 2 |
| 17 | 先備知識 × 階段交互作用：ECL | F = 0.04，p = 0.84，**不顯著** | — | Table 2 |
| 18 | 先備知識 × 階段交互作用：GCL | F = 1.78，p = 0.19，**不顯著** | — | Table 2；L239「No significant interaction effects between prior knowledge and phase were found for any type of cognitive load (all p > 0.19)」。註：GCL 那格是 p = 0.19，「all p > 0.19」嚴格說不對，應是 ≥。 |

### Table 3　各組內的階段比較（L243–252）與 RQ2（L239、L254）

差值一律是「解題階段 − 事前訓練階段」。

| # | 負荷 | 組 | 差值 | SE | t | p | 原文怎麼說 |
|---|---|---|---|---|---|---|---|
| 19 | ICL | 低先備 | +0.28 | 0.19 | 1.45 | 0.15 | 不顯著。「ICL also showed a non-significant trend (p = 0.15)」（L239） |
| 20 | ICL | 高先備 | +0.23 | 0.12 | 1.96 | 0.05 | 「ICL was lower during pre-training (p = 0.05), partially failing to support the predicted direction of change.」（L254）方向是解題時 ICL **較高**。 |
| 21 | ECL | 低先備 | −1.21 | 0.32 | −3.74 | <0.01 | 「Among learners with lower prior knowledge, ECL significantly differs from pre-training to problem-solving (p = < 0.01), supporting H2a.」（L239） |
| 22 | ECL | 高先備 | −1.13 | 0.19 | −5.83 | <0.01 | 「For learners with higher prior knowledge, ECL was also significantly lower during problem solving (p < 0.01), which contradicts H2b, as pre-training was expected to be redundant and lead to increased extraneous processing.」（L254） |
| 23 | GCL | 低先備 | +0.33 | 0.19 | 1.68 | 0.10 | 不顯著（L239） |
| 24 | GCL | 高先備 | +0.63 | 0.12 | 5.38 | <0.01 | 「GCL was significantly higher during problem-solving (p < 0.01), also contrary to expectations.」（L254） |

我拿 Table 1 的組平均相減核過 Table 3 的差值：ECL 低先備 4.16 − 5.37 = −1.21、高先備 3.45 − 4.58 = −1.13；ICL 5.17 − 4.89 = 0.28、4.43 − 4.21 = 0.22（表列 0.23，捨入差）；GCL 5.92 − 5.59 = 0.33、6.67 − 6.03 = 0.64（表列 0.63）。對得上。

- H2b 的結論（L254）：「Overall, H2b was not supported, as higher prior knowledge learners also appeared to benefit from pre-training.」
- 兩組 ECL 的下降幅度幾乎一樣（−1.21 與 −1.13），交互作用 p = 0.84。

## 作者自己列的限制（L273）

1. 先備知識測驗太簡單，兩組人數懸殊，可能偵測不到較細的差異。
2. 只用了一種事前訓練格式（概念圖加詞彙表），不一定能推到其他做法；概念圖與詞彙表各自的效果沒有拆開。
3. 題目是結構良好、套規則的題型，不是結構不良或創造性的解題。
4. 認知負荷量表雖經驗證，GCL 的測量仍有爭議。
5. 只看立即結果，沒有量長期保留與遷移。
6. 末句提到未來應「compare pre-training against a control condition」——等於承認這次沒有對照組，但沒有把它列成一條正式的限制。

討論裡另外提到的（L265–266）：事前訓練兩部分的複雜度與有限的學習時間可能限制了效果；事前訓練效果對先備知識最少的人最強，本研究的受試者可能不屬於那一類；學習者可能沒有完全讀懂事前訓練的材料。

作者沒有列、但從設計與補充資料看得出來的：
- **兩次問卷的 ECL 題問的是不同東西**（第一次問概念圖的設計好不好用、第二次問題目的設計好不好用）。所以「ECL 從 4.79 降到 3.64」字面上是「學生覺得題目的設計比概念圖的設計好用」，不是同一項活動在有無事前訓練下的差別。
- 階段與時間順序、活動內容完全綁在一起，沒有辦法把「事前訓練的效果」與「兩種活動本來就不同」分開。
- 沒有任何一組沒做事前訓練，所以「事前訓練降低了負荷」「沒有出現專長反轉」都沒有比較基準。專長反轉效應的定義是「同一種協助對低先備者有利、對高先備者不利」，要比的是有協助與沒協助，這篇沒有這個比較。
- 先備知識測驗 α = 0.44，分組的界線落在 5 分與 6 分之間，分錯組的機率不小。
- 解題時可以回頭看概念圖與詞彙表，事前訓練與解題並不是兩個乾淨分開的階段。
- 高先備組平均 6 分以上（滿分 8），但受試者是選修教育課的研究生，題目是認知負荷理論入門；「高先備」是相對於這個樣本，不是專家。

## 與摘要說法不一致的地方

1. **摘要用因果語氣，設計撐不起來**。摘要：「Pre-training consistently reduced extraneous load across all learners, including those with higher prior knowledge, challenging the expected expertise reversal effect.」（L28）。正文的資料是同一批人「解題階段的 ECL 自評」低於「事前訓練階段的 ECL 自評」，兩次評的對象不同，也沒有無事前訓練的對照。
2. 摘要說高先備者在解題時 ICL、ECL 較低、GCL 較高（「during problem-solving」）。正文 H1 的檢定是 ANOVA 的先備知識主效果，是**兩階段合併**的組間差（L214、Table 2），不是只看解題階段；解題階段單獨的組間比較沒有報告檢定。
3. 摘要說「learners with lower prior knowledge did not show significant reductions in intrinsic load」。Table 3 裡低先備組的 ICL 差值是 **+0.28**（解題時較高，不顯著），不只是「沒有顯著下降」，方向是往上。
4. 討論說高先備組「ICL remains unchanged」（L267），結果段卻寫「ICL was lower during pre-training (p = 0.05)」（L254），Table 3 是 +0.23、p = 0.05。同一個數字前後兩種講法。
5. 討論說「The results confirmed all three hypotheses (H1a, H1b, and H1c)」，這三個效果量都只有 η²G = 0.03–0.04。
6. 摘要寫「136 university students」，正文是研究所二年級學生（L129）。
7. 正文說三個分量表各 5 題（L172）；補充資料的問卷我數到的是 ICL 6 題、GCL 5 題、ECL 4 題，共 15 題。補充檔的 PDF 表格轉文字後有兩列黏在一起，**這個數法我不完全確定**，但 ECL 題在兩份問卷裡都只找得到 4 題。

## 與清單「要撐的結論」不合的地方

清單寫的是：「事前訓練對高先備者也降低外在認知負荷，沒有出現預期的反轉。**反向／無效**（對 #3 Tetzlaff 2025 而言）」。

**這句撐不住，不能當成對專長反轉效應的反例。** 差在：

1. 沒有對照組。每個人都做了事前訓練，資料裡不存在「有事前訓練 vs 沒有事前訓練」的比較。Tetzlaff 2025 統合的是「高協助 vs 低協助」的受試者間比較，這篇不是同一種證據。
2. 「降低」是兩個不同活動的自評差：學生評「概念圖設計造成的負擔」5.37／4.58（低／高先備），評「題目設計造成的負擔」4.16／3.45。兩次問卷的 ECL 題目主詞不一樣（補充資料 `Presentation_2.pdf`）。
3. 沒有量學習成果在有無事前訓練下的差別；解題分數只報了描述統計。專長反轉效應說的是學習成果，這篇只有自陳負荷。
4. 交互作用不顯著（p = 0.84）只表示兩組的階段差一樣大，不表示「事前訓練對高先備者沒有害處」。
5. 「高先備」是 8 題簡單測驗（α = 0.44）答對 6 題以上，占樣本 73.5%。

可以照實寫的最多是：「一項沒有對照組的單組研究裡，研究所學生在解題階段自評的外在負荷比在看概念圖階段低，高低先備兩組降幅相近；作者把它解讀為事前訓練沒有對高先備者造成多餘負擔，但這個設計分不開事前訓練的效果與兩種活動本身的差異。」如果 order 12 需要一篇「專長反轉沒出現」的實證，這篇不合用，要另找有對照組的研究。

清單上的書目也要補：作者是 Gorbunova、Kapuza、Chen、Costley；期刊卷號 16、文章編號 1628047；DOI 10.3389/fpsyg.2025.1628047。

## 讀取紀錄

- `pretraining2025_PMC12367772.txt` L1–330 一次依序讀完（L1–39 front matter 與摘要、L41–47 前言、L51–106 文獻回顧六小節、L109–119 本研究與假設、L123–205 方法含 Table 1、L209–254 結果含 Table 2–3、L258–267 討論、L271–274 結論與限制、L277 註 1、L281–312 資料／倫理／作者貢獻／利益衝突／生成式 AI 聲明／補充資料連結）。
- L316–623 參考文獻清單逐行掃過，沒有細讀。
- **Table 1 對過 XML 原始標記**（確認表頭是「全體四欄＋低先備組兩欄＋高先備組兩欄」，先備知識那一列的組別欄是空的）；Table 2、3 的數字與正文敘述、與 Table 1 相減的結果互相對過。這篇沒有 PDF 檔在手上，沒有對 PDF 版面；XML 是 PMC 的出版者結構化原檔，表格每格有明確標記，不會有雙欄錯位的問題。
- Figure 1 只有 XML 裡的替代文字（流程圖說明），圖檔本身也在補充檔包裡（`fpsyg-16-1628047-g001.jpg`），沒有另外打開；流程以正文 L141–150 為準。
- 補充資料三個檔全部讀完：`Image_1.png`（概念圖，直接看圖）、`Presentation_1.pdf`（詞彙表 31 行）、`Presentation_2.pdf`（4 頁、227 行：先備知識測驗 8 題、事前訓練後問卷 15 題、解題 6 題、解題後問卷 15 題）。解題第 6 題的教材 b) 在 PDF 裡是圖，轉文字後是空的，沒看到內容。
