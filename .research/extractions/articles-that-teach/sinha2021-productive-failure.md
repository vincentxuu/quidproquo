# 抽取紀錄：Sinha & Kapur 2021，Review of Educational Research

- **合法公開來源**：https://journals.sagepub.com/doi/10.3102/00346543211019105 （SAGE 出版者頁，刊出版，頁面標示 Open access、CC BY 4.0，2026-10-14 核對）。出版者 PDF 另存 `.research/raw/learning-content/q3-activity/sinha_kapur2021-sage-oa.pdf`。手上的 `sinha_kapur2021.pdf` 當初取自第三方網站 janfasen.nl（研究筆記 q3-activity L143；重新下載該網址位元組相同），不是作者或出版者的頁面；與出版者 PDF 位元組不同，`pdftotext` 轉出的 16,360 個詞逐詞相同，所以抽取內容不受影響。連結一律寫 DOI，不寫 janfasen.nl。

- **書目**：Tanmay Sinha、Manu Kapur（兩人皆 ETH Zürich；姓名與單位對過 PDF 首頁 p.761 與文末作者簡介 p.798）。When Problem Solving Followed by Instruction Works: Evidence for Productive Failure. *Review of Educational Research*, October 2021, Vol. 91, No. 5, pp. 761–798. DOI 10.3102/00346543211019105。
- **原文檔**：`.research/raw/learning-content/q3-activity/sinha_kapur2021.txt`（`pdftotext -layout` 轉檔，1,856 行、129,247 位元組；清單記 128,740 字元）與同目錄 `sinha_kapur2021.pdf`（38 頁）。本刊是單欄版面，layout 轉檔沒有左右交錯。
- **版本**：刊出版（SAGE 排版，頁碼 761–798）。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 11（11-a、11-b）
- **行號**：一律寫 `sinha_kapur2021.txt` 的行號；頁碼是期刊頁碼。
- **沒在手上的東西**：線上補充資料（各比較的文獻清單、Table S1 森林圖與每個比較的 SMD、排除文章的範例、每個比較的子群編碼）。正文多次指向它（L437–439、L465–466、L600–602、L804–807），沒有取檔，所以「哪 45 篇、哪個比較是哪個效果量」這一層查不到。

## 研究設計

- **類型**：統合分析，三層隨機效果模型（受試者 ⊂ 研究 ⊂ 文章），Hedge's g，R 實作（L476–497）。另外做了子群分析、統合迴歸、多元迴歸（兩種選模法）、出版偏誤檢查（漏斗圖、Egger、p-curve）。
- **比較對象**：PS-I（先解題再講解）對 I-PS（先講解再解題）。正的效果量代表 PS-I 較好（Table 3–5 表註）。
- **檢索**（L377–392、Figure 2）：只用 Google Scholar，而且只收「引用了五篇 PF 文章之一」的文獻——Kapur 2008（552 筆）、Kapur & Bielaczyc 2012（349）、Kapur 2014（171）、Kapur 2015（33）、Kapur 2016（107），合計 1,212 筆，截止日 2019-06-26。五篇種子文章的作者都是本文第二作者。再加上 Loibl 等 2017 回顧裡的 20 篇，去掉 324 筆重複後剩 908 筆。
- **納入標準**（L382–388）：(1) 引用上述 PF 文章；(2) 報告 PF 與 I-PS 的實驗或準實驗比較；(3) 成果量到概念知識或遷移至少一項，程序知識可有可無。
- **最後納入**（L435–437、Figure 2）：908 筆篩掉 863 筆，45 篇文章、53 個研究、166 個比較。
- **受試者與教材**（Table 1，L395–431，以比較數計，n=166）：
  - 地區：歐洲 43（25.9%）、北美 72（43.4%）、亞洲 46（27.7%）、澳洲 5（3%）。
  - 年級：二到五年級 25（15.1%）、六到十年級 75（45.2%）、大學部 61（36.7%）、其他（研究生、專業人員）5（3%）。
  - 內容：數學 75（45.2%）、基礎科學 47（28.3%；其中物理 36、化學 3、生物 4，另 4 個比較出自 Fukaya 等 2019、跨三科）、醫學 32（19.3%）、通用技能 8（4.8%；控制變因策略、水壺問題、魔術方塊）、其他 4（2.4%；心理學、環境科學）。
  - 原文沒有報告總受試人數。
- **實驗與準實驗的定義**（L565–574）：實驗＝隨機分派，兩組只差在解題與講解的順序；準實驗＝整班分派，而且「treatment and control groups differ in more than just the experimental treatment they receive, e.g., different teachers, presence of prompts or accuracy feedback during problem solving, different presentation modality during instruction」。實驗比較 81 個、準實驗 85 個（L350–352）。
- **PF 忠實度七項準則與各自佔比**（L513–549；佔比是「PS-I 那一組有做到」的比較佔 166 的比例）：
  1. 題目容許多種表徵與解法（RSM）：92.77%
  2. 文章裡有學生確實產生多種 RSM 的證據：59.64%
  3. 題目有情感吸引力（故事題、**對比案例**、模擬、代理人模型等都算）：61.45%
  4. 解題階段採小組：53.01%
  5. 講解接著學生的解法：44.58%
  6. 解題階段的社會環境促進：高／低（57.2%、n=95 個比較沒有報告這一項；有報告的裡面 33.8% 編為高，註 6，L1488–1490）
  7. 講解階段的社會環境促進：對話為主 33.73%／獨白為主
- **編碼信度**：七項的 κ = 0.92、1.0、0.87、1.0、1.0、0.73、0.91（L513–514）。兩位作者先討論 20% 的文章，其餘由第一作者與一位研究助理編（L586–593）。
- **忠實度總分**：七項各 1 分加總，除以可得的總分（解題階段社會環境沒報告的，分母少一項）得百分比。分布：0–25% 22 個、25–50% 60 個、50–75% 36 個、75–100% 48 個（L689–698）。
- **成果變項**：概念知識、遷移、合併測驗（一份後測同時量概念與遷移）三類合併成主要分析；程序知識另外分析（L468–470、L582–584）。註 4 說近九成比較只量了概念或遷移其中一種（L1470–1472）。
- **I-PS 對照組的實際樣子**（L603–678）：81 個實驗比較裡兩個階段的內容相同、只換順序。85 個準實驗比較的 I-PS 組：14.11% 用比較對照式討論講解、15.29% 在解題階段有鷹架或提示或例題、64.7% 解題階段是小組。多數情況下 I-PS 的解題階段是「practice-oriented (rather than being generative in nature)」（L661–663）。

## 結果（逐項）

### 整體

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 概念知識與遷移的整體效果 | g = 0.36，95% CI [0.20, 0.51]，p < .0001，166 個比較 | PS-I 對 I-PS | Results | L763–796 | 「the SMD or effect size for conceptual knowledge and transfer was moderate (Hedge's g = 0.36, p < .0001, 95% CI [0.20, 0.51]), and in favor of PS-I.」 |
| 2 | 異質性 | Q(165) = 295.91，p < .0001；三層變異佔比 57.99%、38.51%、3.50%；total I² = 42.01% | 同上 | Results | L796–799 | 「The heterogeneity between comparisons was moderate (Q[df = 165] = 295.91, p < .0001).」 |
| 3 | 程序知識 | g = −0.03，p = .7384，95% CI [−0.20, 0.15]，51 個比較 | PS-I 對 I-PS | Results | L802–804 | 「For the n = 51/166 comparisons assessing procedural knowledge, results suggested the pooled effect size for procedural knowledge to be Hedge's g = −0.03, p = .7384, 95% CI [−0.20, 0.15].」 |
| 4 | 貝氏模型複核 | g = 0.36，95% CI [0.19, 0.52]；效果小於 0.2 的後驗機率 3.05%、小於 0.3 是 25.11%、小於 0.4 是 70.41%、小於 0.5 是 95.72% | 同上 | 註 12 | L1533–1542 | 「the probability of the SMD being <0.2: 3.05%; <0.3: 25.11%; <0.4: 70.41%; <0.5: 95.72%.」 |

「n = 51/166」讀起來像程序知識的 51 個比較是 166 個裡面的，但主要分析又說 166 個效果量對應兩類成果（L468–470）。程序知識的比較算不算在 166 裡面，原文沒有寫清楚。

### PF 忠實度子群（Table 3，L767–792，對過 PDF p.777）

| # | 準則 | 有 | 沒有 | 子群差異檢定 | 行號 |
|---|---|---|---|---|---|
| 5 | 題目容許多種 RSM | 0.37 [−0.41, 1.38] | −0.11 [−0.99, 0.77] | n.s. | L771–772 |
| 6 | 有多種 RSM 產生的證據 | 0.47 [0.00, 0.61] | 0.16 [−0.08, 0.40] | p = .05（表標 +，即 p < .1） | L773–774、L845 |
| 7 | 題目有情感吸引力（含對比案例） | 0.44 [−0.08, 0.58] | 0.19 [−0.08, 0.46] | n.s. | L775–776 |
| 8 | 解題階段小組 | 0.49 [0.01, 0.58] | 0.19 [−0.02, 0.40] | p = .04 | L777–778、L845–846 |
| 9 | 講解接著學生解法 | 0.56 [0.07, 0.64] | 0.20 [0.01, 0.40] | p = .02 | L779–780、L846 |
| 10 | 解題階段社會環境促進 | 高 0.58 [−0.30, 0.74] | 低 0.36 [0.02, 0.71] | n.s. | L781–782 |
| 11 | 講解階段社會環境促進 | 對話為主 0.55 [0.00, 0.63] | 獨白為主 0.24 [0.05, 0.43] | p = .05（表標 +） | L783–784、L847 |

- 原文一句（L814–847）：「Descriptively, comparisons had a higher effect size (in favor of PS-I), if any of the seven PF fidelity criteria were followed in the PS-I design. Only four of these seven subgroup differences were significant (or marginally significant)」。
- **表中信賴區間的問題（我的推算，原文沒有說明）**：Table 3 到 5 很多列的點估計落在自己的區間外（例如大學部 0.28 [−0.46, 0.24]、概念知識 0.33 [−0.30, 0.22]、二到五年級 −0.09 [−0.92, −0.16]）。逐列算過，區間中心都對得上「這一組減去對照組（或減去其餘各組）的差」：RSM 證據 0.47 − 0.16 = 0.31，區間 [0.00, 0.61] 中心 0.305；小組 0.49 − 0.19 = 0.30，區間中心 0.295；幾天 0.41 − 幾小時 0.32 = 0.09，區間 [−0.22, 0.42] 中心 0.10。所以每組第一個參照列的區間看來是該組效果的區間，其餘各列的區間看來是「差值」的區間。這只是從數字回推的，原文表頭寫的是「Hedge's g [95% CI]」。寫文章時這些區間不能當成該子群效果量的信賴區間引用；能安全引用的只有點估計與子群差異的顯著標記。

### 忠實度總分與介入長度（L847–918、L963–993）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 12 | 忠實度總分預測效果量 | β = 0.0065（每一個百分點），p < .001，95% CI [0.0044, 0.0087] | L847–849 | 「The overall PF fidelity score (computed as a percentage) was a significant predictor of the effect size」 |
| 13 | 介入愈長忠實度愈高 | 幾天的平均忠實度 74.45（SD 22.64），幾小時的 42.01（SD 26.13）；Welch t(154.22) = 8.504，p < .001 | L850–854 | 「We found that longer interventions had a higher overall PF fidelity score.」 |
| 14 | 忠實度 × 介入長度 | 忠實度主效果 β = 0.0173，p = .0005；幾小時的介入反而下降 β = −0.0116，p = .0546，95% CI [−0.0235, 0.0002] | L863–867 | 「This suggests that cramming too many design features within a short amount of time may not be optimal.」 |
| 15 | 情感吸引力 × 介入長度 | 主效果 β = 0.3710，p = .0056；幾小時的介入增幅更大 β = 0.7322，p = .0732，95% CI [−0.0695, 1.5339] | L900–906 | 「This suggests that for shorter interventions, affective draw of the problem may be critical.」 |
| 16 | 小組 × 介入長度 | 小組主效果 β = 0.6286，p < .0001；幾小時的介入**不用小組**時增幅更大 β = 0.7395，p = .0023，95% CI [0.1067, 1.3723] | L907–914 | 「This suggests that for shorter interventions, designing the problem-solving phase to accommodate individual work yields a better predictive estimate of the observed effect sizes.」 |
| 17 | 其餘五項準則 × 介入長度 | 不顯著 | L915–918 | 「lending weak overall support to the conjecture that intervention length (and not PF fidelity) might be responsible for the observed overall effects.」 |
| 18 | 實驗研究的忠實度遠低於準實驗 | 實驗 32.36（SD 19.50）對準實驗 76.78（SD 19.07）；Welch t(163.19) = −14.83，p < .001。類型 × 忠實度的交互作用不顯著（p = 0.79） | L963–975 | 「the mean of experimental comparisons being 32.36 (SD = 19.50) and those of quasi-experimental comparisons being 76.78 (SD = 19.07).」 |
| 19 | 研究類型與介入長度相關 | χ²(1) = 33.15，p < .001：實驗多為幾小時、準實驗多為幾天。只做幾小時的準實驗 β = −0.5530，p = .0838，95% CI [−1.1807, 0.0748] | L976–993 | 「the extent to which a quasi-experimental intervention reports high effect sizes favoring PS-I might be influenced by the length of the intervention.」 |

### 學生特徵（Table 4，L818–841，對過 PDF p.778）

| # | 子群 | 點估計（表列區間） | 顯著標記（該組對其餘各組） | 行號 |
|---|---|---|---|---|
| 20 | 二到五年級 | −0.09 [−0.92, −0.16] | ** | L822 |
| 21 | 六到十年級 | 0.50 [−0.04, 0.58] | + | L823 |
| 22 | 大學部 | 0.28 [−0.46, 0.24] | n.s. | L824 |
| 23 | 其他（研究生、專業人員） | 1.03 [0.05, 1.39] | * | L825 |
| 24 | 歐洲 | 0.19 [−0.59, 0.15] | n.s. | L826 |
| 25 | 北美 | 0.24 [−0.54, 0.09] | n.s. | L827 |
| 26 | 亞洲 | 0.64 [0.03, 0.73] | * | L828 |
| 27 | 澳洲 | 0.95 [−0.13, 1.39] | n.s. | L829 |
| 28 | 沒有前測 | 0.31 [−0.44, 0.30] | n.s. | L830 |
| 29 | 前測考先備概念 | 0.30 [−0.63, 0.50] | n.s. | L831 |
| 30 | 前測考目標概念 | 0.39 [−0.26, 0.42] | n.s. | L832 |

- 低年級，原文（L1213–1216）：「Younger age students (2nd to 5th graders), however, seemed to benefit from I-PS interventions, although the average effect size favoring I-PS was low (Hedge's g of −0.09 [95% CI −0.92, −0.16].」點估計 −0.09 很小；顯著的是「低年級比其他年級低」，原文沒有給「低年級的效果顯著小於零」的檢定（見上面區間的推算）。
- 低年級這 25 個比較裡 72%（18/25）有多種 RSM 產生的證據（L1216–1219）；平均忠實度 56.86%（SD 27.84%）（L1232–1234）。作者提的三個解釋都是推測：被喚起的先備知識相關性低、不懂後設認知策略、忠實度低（L1227–1236）。
- 年級 × 前測性質的交互作用不顯著（ps .15 到 .77，L933–936）。
- 忠實度在六到十年級與大學部之間有顯著差異（ANOVA F(3,162) = 6.485，p = .0004；Tukey p = .0002）。年級 × 忠實度：六到十年級 β = 0.0190，p < .0001，95% CI [0.0106, 0.0274]；大學部 β = 0.0080，p = .0934，95% CI [−0.0014, 0.0173]（L937–948）。原文沒寫兩者誰高。

### 介入特徵（Table 5，L870–897，對過 PDF p.779）

| # | 子群 | 點估計（表列區間） | 顯著標記 | 行號 |
|---|---|---|---|---|
| 31 | 準實驗 | 0.46 [−0.10, 0.50] | n.s. | L874 |
| 32 | 實驗 | 0.25 [0.04, 0.47] | （參照列） | L875 |
| 33 | 幾天 | 0.41 [−0.22, 0.42] | n.s. | L876 |
| 34 | 幾小時 | 0.32 [0.11, 0.52] | （參照列） | L877 |
| 35 | 數學 | 0.48 [−0.10, 0.52] | n.s. | L878 |
| 36 | 物理 | 0.39 [−0.34, 0.43] | n.s. | L879 |
| 37 | 化學 | 0.48 [−0.71, 0.96] | n.s. | L880 |
| 38 | 生物 | 0.32 [−0.73, 0.66] | n.s. | L881 |
| 39 | 醫學 | 0.24 [−0.60, 0.33] | n.s. | L882 |
| 40 | 心理學 | 1.38 [−0.43, 2.49] | n.s. | L883 |
| 41 | 環境科學 | 0.56 [−0.80, 1.20] | n.s. | L884 |
| 42 | 通用技能 | −0.17 [−1.11, −0.02] | * | L885 |
| 43 | 概念知識 | 0.33 [−0.30, 0.22] | n.s. | L886 |
| 44 | 遷移 | 0.40 [−0.19, 0.32] | n.s. | L887 |
| 45 | 合併測驗 | 0.31 [−0.43, 0.31] | n.s. | L888 |

- 研究類型與介入長度，原文（L956–960）：「effect sizes were descriptively higher (and in favor of PS-I) for (a) quasi-experimental comparisons relative to experimental comparisons and (b) interventions spanning a few days relative to those that spanned a few hours. These subgroup differences, were, however, not significant.」
- 通用技能，原文（L995–998）：「For learning domain-general skills, however, the effect size was low, and in favor of I-PS.」只有 8 個比較（Table 1）。作者引 Chase & Klahr 2017 的解釋並自己加了「More empirical work is however needed to generalize these claims」（L1267–1279）。

### 七項準則的相對重要性（Table 6，L1023–1050，對過 PDF p.782）

| 準則 | 逐步法：Pearson 相關 | 逐步法：係數 | 多模型推論：Akaike 權重 | 多模型推論：係數 |
|---|---|---|---|---|
| 題目容許多種 RSM | 0.17 | 0.12 | 0.38 | 0.03 |
| 有多種 RSM 的證據 | **0.25** | 0.27 | **0.93** | 0.27 |
| 情感吸引力 | 0.18 | — | **0.56** | 0.09 |
| 小組 | **0.29** | 0.28 | **0.85** | 0.24 |
| 講解接著學生解法 | **0.28** | — | 0.40 | 0.01 |
| 解題階段社會環境 | 0.09 | 0.14 | 0.43 | 0.03 |
| 講解階段社會環境（對話） | **0.23** | 0.20 | **0.60** | 0.11 |

（粗體照原表。）

- 46. 逐步法的模型 R² = 13.51%，子集 merit 0.358（L1015–1016）。
- 47. 「講解接著學生解法」單看相關排第二（0.28），但逐步法的最後模型沒有選它（係數欄是「—」），多模型推論的 Akaike 權重 0.40、係數 0.01。原文在 L1007–1016 說它是逐步法前四名，接著說被選進模型的是「the latter three predictors (β = 0.28, β = 0.27, and β = 0.20, respectively)」，也就是小組、RSM 證據、對話式講解。原文說多重共線的預測變項會在最後模型移除（L713–714），沒有說明這一項是不是因此被移除。
- 48. 註 10：Akaike 權重大於 0.8 才算高（L1524–1525）；只有 RSM 證據（0.93）與小組（0.85）過門檻。
- 49. 解題階段社會環境有 57.2% 遺漏，是用隨機抽樣補值五次後取平均（註 8，L1497–1511）。
- 50. 原文結語（L1055–1056）：「Taken together, these rankings align with those from the stepwise model-building method.」兩種方法的前四名其實差一項（逐步法有「講解接著學生解法」，多模型推論換成「情感吸引力」）。

### 出版偏誤（L1057–1091、Figure 3，對過 PDF p.783）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 51 | 漏斗圖與 Egger 檢定 | intercept = 0.63，p = .219；沒有補任何研究 | L1059–1063 | 「The absence of asymmetry is visually evident. Egger's test of asymmetry was not significant (intercept = 0.63, p = .219). Since this source of publication bias could be therefore ruled out, no studies were imputed in trim and fill analysis.」 |
| 52 | p-curve | 右偏檢定顯著、平坦檢定不顯著；估計檢定力 94%，CI [91%, 97%] | L1066–1087 | 「we could conclude that evidential value was present in the p-curve.」 |
| 53 | p-curve 推估的「真實效果」 | g = 0.87 | L1088–1091 | 「The estimate of true effect size (in absence of publication bias) was therefore computed to be Hedge's g = 0.87.」 |

Figure 3 右圖的小字註記，從 PDF 影像辨識大意是：p-curve 只納入 67 個 p < .05 的顯著結果，另外 99 個結果因為 p > .05 被排除。字很小，數字我不完全確定，要引用得另外放大核對。註 11（L1526–1532）說明 0.87 是找出最貼近「顯著結果的 p 值分布」的效果量。

### 其他

- 54. Table 2（L614–652）三個範例：Loehr 等 2014 研究一（二到五年級、實驗、忠實度 16.66%）g = −0.97 [−2.1, 0.16]；Loibl & Rummel 2014a 研究一（六到十年級、準實驗、71.42%）g = 1.31 [0.22, 2.4]；Song 2018（六到十年級、準實驗、100%）g = 0.73 [−0.31, 1.78]。這張表只用兩種文字轉檔互對，沒有看 PDF 影像。
- 55. 作者對先前統合分析的轉述：Darabi 等 2018，12 篇，平均效果 0.43，95% CI [0.19, 0.68]（L167–170）。
- 56. 作者用 Kraft 2019 的基準（>0.20 算大）主張 0.36「can be considered rather large」（L1111–1116）。Kraft 的基準是從用標準化測驗當成果的隨機對照試驗來的（原文自己這樣描述，L1111–1113）；本文的成果多是研究者自編的概念與遷移測驗，原文沒有討論這個差別。

## 作者自己列的限制（L1302–1412）

1. 近 75% 的比較是數學與物理，而且集中在少數主題（例如變異數）。教材複雜度可能是邊界條件，「a recent PS-I work (Ashman et al., 2020) suggests that advantages of PS-I over I-PS may diminish with increasing complexity」（L1311–1319）。研究生與專業人員的研究太少（L1322–1324）。（Table 1 的數字是數學 45.2% 加物理 21.7% 等於 66.9%；數學加整個基礎科學才是 73.5%。）
2. 歐洲與北美做這類研究的團隊數約是亞洲與澳洲的三倍；歐美效果量低可能來自理論取向不同或教師訓練（L1325–1345）。
3. 有 RSM 證據的 59.64% 比較裡，很少報告實際的失敗率。「multiple RSM generation is a rather weak proxy for failure」（L1346–1353）。
4. 沒有個別差異的資料；沒有學習障礙或學習困難學生的研究（L1354–1376）。
5. 只看概念知識與遷移；只有一個研究（Loibl & Leuders 2018）單獨量了負面知識（L1377–1387）。
6. PS-I 與 I-PS 的學習目標不同，可能無法直接比（L1392–1399）。
7. 把忠實度準則與學生、介入特徵都二分；細分後可編碼的比較數不夠（L1400–1412）。
- 另外作者自己說（L1307–1310）：「it would be a mistake to interpret the comprehensive nature of this work as providing authoritative conclusions about the pattern of effects.」
- 作者沒有列為限制、但從方法看得出來的：檢索只收引用 Kapur 五篇文章的文獻、只用 Google Scholar；補充資料以外看不到個別研究；準實驗依作者自己的定義就是兩組不只差在順序。

## 與摘要說法不一致的地方

1. **摘要說年級、介入長度、準實驗與否「contributed to the efficacy of PS-I over I-PS designs」（L37–38）。** 正文的子群檢定裡，介入長度與研究類型都是 n.s.（Table 5；L959–960「These subgroup differences, were, however, not significant」）。三項裡只有年級有顯著的子群差異。
2. **摘要說「after accounting for publication bias suggested a strong effect size favoring PS-I (Hedge's g 0.87)」（L41–42），結論還寫「After accounting for the significant evidence regarding publication bias」（L1427–1428）。** 正文的漏斗圖對稱、Egger 不顯著，而且寫明小研究偏誤「could be therefore ruled out」（L1062）。全文沒有任何一處報告偵測到出版偏誤；0.87 是 p-curve 只用顯著結果回推的估計，比全部 166 個比較的合併值 0.36 高出一倍多。正文沒有解釋兩個數字為什麼差這麼多。
3. **摘要說高忠實度時效果「even stronger (Hedge's g ranging between 0.37 and 0.58)」（L34–36）。** 0.37 到 0.58 是七項準則各自「有做到」那一列的點估計。七項裡子群差異達 p < .05 的只有兩項（小組、講解接著學生解法），兩項 p = .05，三項不顯著。0.37 那一項（題目容許多種 RSM）92.77% 的比較都有，差異不顯著。
4. 結論說「we clearly established the efficacy of PS-I over I-PS when PF design fidelity was high」（L1418–1419）。實驗比較的忠實度平均只有 32.36%，高忠實度幾乎都在準實驗裡（#18），而準實驗依定義兩組不只差在順序。
5. 摘要的 53 個研究、166 個比較、0.36 [0.20, 0.51]、低年級與通用技能偏向 I-PS：逐項對過，與正文一致。

## 與清單「要撐的結論」不合的地方

**11-a「先解題再講解平均有利，但有效的版本依賴對比案例、小組或接著學生自己的解法講。」**

- 「平均有利」撐得住，但要加兩個限定：只限概念知識與遷移（g = 0.36）；程序知識沒有差別（g = −0.03）。只看隨機分派的實驗比較時點估計是 0.25 [0.04, 0.47]。
- **「對比案例」這篇撐不住。** 對比案例在這篇不是獨立的編碼項，只是「情感吸引力」準則的舉例之一（L521–524），而情感吸引力的子群差異不顯著（0.44 對 0.19，n.s.）。
- **「小組」要改寫。** 單看子群有差（0.49 對 0.19，p = .04），多元迴歸也排前二。但幾小時的短介入裡，不用小組時增幅更大（#16）。
- **「接著學生自己的解法講」要降級。** 單變項子群差異最顯著（0.56 對 0.20，p = .02；差值最大的是「題目容許多種 RSM」0.37 對 −0.11，不顯著），但放進多元迴歸後逐步法沒有選它、多模型推論的權重 0.40、係數 0.01（#47）。這一項與其他準則高度重疊，這篇分不出它的獨立貢獻。
- 「依賴」兩個字太強。這些全是研究間的相關，忠實度又與準實驗設計、介入長度綁在一起（#13、#18、#19）；整個多元迴歸只解釋 13.51% 的變異。作者自己的建議是「Rather than forcing the implementation of all seven PF design fidelity criteria, it is important to consider what is feasible」（L1195–1198）。
- 對本站的適用性：166 個比較全是有老師的課堂或實驗室情境；七項準則裡四項（小組、兩項社會環境促進、接著學生解法講）要有人在場。沒有任何子群是一個人讀文字教材。

**11-b「對年紀小的學習者、通用技能，先講解較好」（清單指定這篇撐低年級與通用技能子群）。**

- 方向對，但「較好」的幅度很小：低年級 −0.09（25 個比較）、通用技能 −0.17（8 個比較）。顯著的是「這一組比其他組低」，不是「這一組的效果顯著小於零」。比較穩的寫法是「在這兩個子群裡看不到先解題的優勢，點估計略偏向先講解」。
- 11-b 的第三項「各部分互相牽連的內容」這篇沒有分析，只在限制裡引 Ashman 等 2020 一句（L1316–1319）。

## 讀取紀錄

依序讀完 `sinha_kapur2021.txt` 全檔，四段首尾相接：

| 段 | 行號 | 內容 |
|---|---|---|
| 1 | L1–480 | 題名、摘要、導言、Productive Failure、Previous Reviews、The Present Review、研究問題、Coding Rationale、Method（檢索、Table 1、Figure 2 圖說、Meta-Analysis、Pooling） |
| 2 | L480–999 | Subgroup Analysis 編碼定義、Table 2、Regression Analysis、Publication Bias 方法、Results（合併效果、Table 3–5、忠實度、學生特徵、介入特徵） |
| 3 | L999–1468 | 準則排序、Table 6、出版偏誤結果、Discussion 全部、Implications、Limitations、Conclusion、Notes 1–4 |
| 4 | L1468–1856 | Notes 4–13、References（掃過）、作者簡介 |

- 對過 PDF 影像的頁：p.770（Figure 2 流程圖）、p.777（Table 3）、p.778（Table 4）、p.779（Table 5）、p.782（Table 6）、p.783（Figure 3）、p.784、p.785（Figure 4）。Table 3 到 6 的每一格與文字檔一致。
- 只用兩種文字轉檔（`-layout` 與不帶 `-layout`）互對、沒看影像的：Table 1、Table 2。
- 沒讀到的：線上補充資料（不在手上）。Figure 1（Venn 圖）只讀了圖說。

## 2026-10-14 更正

- 「與清單『要撐的結論』不合的地方」11-a 第三點原寫「單變項子群差異最大」，不對：Table 3 裡差值最大的是「題目容許多種 RSM」（0.37 對 −0.11，差 0.48，不顯著）；「講解接著學生解法」差 0.36，是七項裡 p 值最小的（p = .02）。改成「差異最顯著」。單變項相關（Table 6）也是小組 0.29 第一、這一項 0.28 第二。此錯曾帶進 order 11 稿，由 order 11 審稿（`.work/reviews/2026-10-14-o11-projects-review.md` M1）抓到。
