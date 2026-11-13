# 抽取紀錄：Prinz、Golke、Wittwer 2021，Instructional Science 49, 165–195

## 檔頭

- **書目**：Anja Prinz、Stefanie Golke、Jörg Wittwer (2021). Counteracting detrimental effects of misconceptions on learning and metacomprehension accuracy: The utility of refutation texts and think sheets. *Instructional Science*, 49, 165–195. https://doi.org/10.1007/s11251-021-09535-8。欄位標「ORIGINAL RESEARCH」。Received 25 February 2020／Accepted 11 February 2021／Published online 17 March 2021。三位作者都在 University of Freiburg 教育科學系（作者全名與單位對過 PDF 首頁，L8–37）。
- **版本**：刊出版，CC BY 4.0（L1663–1669）。
- **原文檔**（都在 `.research/raw/learning-content/q1-learner/`）：
  - `prinz2021.pdf`：本次新下載的出版者 PDF，31 頁、2,040,167 位元組。來源 `https://web.archive.org/web/2id_/https://link.springer.com/content/pdf/10.1007/s11251-021-09535-8.pdf`（Wayback 存的 Springer 原檔；Springer 本站對 curl 回 JavaScript 驗證頁）。
  - `prinz2021.raw.txt`：**本次精讀用的主檔**，由上面的 PDF 以不帶 `-layout` 的 `pdftotext` 轉出，1,869 行、96,049 位元組。下面行號一律是這個檔的行號。
  - `prinz2021.txt`／`.md`：清單原列的 jina HTML 版（590 行、86,916 位元組），本次沒有用來讀。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 13（#6）、order 15（#3，後設理解準確度）。

## 研究設計

- **類型**：實驗室實驗，受試者間設計。教學方法三組隨機分派；誤解數量是量出來的連續變項，不是操弄（L255–257「Misconceptions were not experimentally manipulated but measured.」）。分析是「誤解 × 教學方法」的調節迴歸。
- **受試者**（L248–252）：德國一所大學的學生 N = 92，平均 23.32 歲（SD 2.61），66% 女。必須修過至少一門教過共變數的統計課；平均第 4.13 學期（SD 2.06）、修過 1.57 門（SD 0.80）。科系為教育科學、認知科學、心理、經濟、環境科學。資料收集於 2017 年 12 月至 2018 年 2 月（L1660）。
- **分組**（L256–257）：反駁文組 n = 31、對照表（think sheet）組 n = 29、控制組 n = 32。
- **教材**（L276–324）：
  - 統計課文，改自 Bortz 與 Schuster (2010) 的德文教科書，主題是共變數。針對四個誤解：(1) 共變數代表因果、(2) 共變數是標準化統計量、(3) 共變數與配適線斜率有關、(4) 共變數為零證明完全沒有關聯。
  - 一般版：536 字、27 句、Flesch 33，只寫正確資訊。
  - 反駁版：665 字、35 句、Flesch 34。每個誤解一句描述誤解、一句明說它錯、三句正確資訊。兩版長度刻意不調齊（L290–295）。
  - 對照表（think sheet）：三欄的表。第一欄四個問題，第二欄各一句典型誤解（與反駁文裡描述誤解的那一句相同），第三欄空白，由受試者邊讀一般版課文邊填入正確資訊。
  - **控制單（control sheet）**：只有前兩欄（問題與對應誤解）。**控制組讀的是一般版課文加這張列出四個誤解的單子**，目的是讓三組接觸到的資訊量相同（L313–324）。
- **比較對象**：反駁文、對照表，各自對「一般課文＋誤解清單」。沒有「只讀一般課文、完全沒看到誤解陳述」的組。
- **學習時間**（L395–404）：三組總時間都是 12 分鐘。反駁文組讀 12 分鐘；對照表組先看表 2 分鐘再邊讀邊填 10 分鐘；控制組先看控制單 2 分鐘再讀 10 分鐘。
- **量了什麼**：
  - 誤解：4 題單選，每題四個選項（一個是誤解、一個正確、兩個其他錯誤），0–4 個誤解；沒有算內部一致性（L328–332）。
  - 理解：**用的是同樣那 4 題**，答對 1 分，滿分 4（L335–337）。
  - 遷移：讀一篇改自 PISA 的教育研究報告（655 字，Flesch 25，限時 8 分鐘），再答 4 題；題目對應同樣四個誤解但換了情境（L340–367）。
  - 預測準確度：讀完課文後、作答前，預測理解題與遷移題各會答對幾題；偏誤 = 預測 − 實際，正值是高估（L376–383）。
  - 作答信心準確度：每題答完給 0–5 的信心，與對錯算 gamma 相關，8 題合併算（L386–389）。
- **何時量**（L392–419）：即時階段約 75 分鐘：誤解測驗 → 填充作業 → 學習 → 預測 → 理解題與信心 → 讀研究報告 → 遷移題與信心。延宕階段在 6 到 8 天後，約 15 分鐘，再答一次理解題與遷移題。延宕階段有 1 人（對照表組）沒來，N = 91。
- **分析**（L422–444）：PROCESS 3.4。教學方法用指示變項編碼，控制組為參照；誤解數量做平均數中心化。先比較含與不含交互作用項的模型（∆R²、F），顯著才進一步看各組的條件效果。α = .05。

## 結果（逐項）

### 描述統計與前置分析

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 全體平均 | 誤解 1.88（0.96）；理解 2.85（1.10）；遷移 2.57（1.12）；理解預測偏誤 0.26（1.18）；遷移預測偏誤 −0.22（1.19）；作答信心準確度 .50（.60）；延宕理解 2.73（1.06）；延宕遷移 2.66（1.14） | 無（全體 N = 92，延宕 N = 91） | 表 1 | L453–581（PDF p.177） | 表列 M、SD |
| 2 | **全體層次：誤解數與理解無關** | r = .01（不顯著）；與遷移 r = .23*；與理解預測偏誤 r = .11（不顯著）；與遷移預測偏誤 r = −.03；與作答信心準確度 r = −.14；與延宕理解 r = .05；與延宕遷移 r = .26* | 三組合併的零階相關 | 表 1 | 同上 | 表列第 1 欄 |
| 3 | 理解與預測偏誤的相關 | 理解 × 理解預測偏誤 r = −.77*；遷移 × 遷移預測偏誤 r = −.76* | 同上 | 表 1 | 同上 | 表列 |
| 4 | 各組平均（反駁文／對照表／控制） | 誤解 2.03／1.79／1.81；理解 3.10（0.79）／2.69（1.14）／2.75（1.30）；遷移 2.71／2.59／2.41；理解預測偏誤 0.07（0.93）／0.41（0.98）／0.31（1.51）；遷移預測偏誤 −0.32／−0.17／−0.16；作答信心準確度 .43（.60）／.72（.35）／.38（.74）；延宕理解 2.94／2.57／2.66；延宕遷移 2.84／2.54／2.59 | 三組 | 表 2 | L590–708（PDF p.178） | 表列 |
| 5 | 三組事前無差異 | 學期數 F(2, 89) = 0.32，p = .726；修課數 F(2, 89) = 0.04，p = .961；事前誤解數 F(2, 89) = 0.58，p = .560 | 三組互比 | Preliminary analyses | L712–716 | 「The three groups did not significantly differ from each other」 |
| 6 | **三組的誤解都減少，教學方法沒有主效果** | 教學方法主效果 F(2, 88) = 0.69，p = .507，η² = .02；時間主效果 F(1.63, 143.52) = 44.59，p < .001，η² = .34；交互作用 F(3.26, 143.52) = 2.22，p = .083，η² = .05（作者稱 marginally significant） | 3 組 × 3 個時間點（學習前、即時、延宕） | Reduction of misconceptions | L719–761 | 「there was no significant main effect of instructional method」 |
| 7 | 三組都比學習前少 | 即時與延宕都比學習前少，ps ≤ .010 | 各組內前後比（Bonferroni） | 同上 | L762–763 | 「the number of misconceptions was reduced at immediate testing and delayed testing with all three instructional methods (ps ≤ .010)」 |
| 8 | **反駁文組從即時到延宕誤解回升** | 反駁文組 p = .045（顯著增加）；對照表組與控制組 ps = 1.00（無變化） | 各組內，即時 vs. 延宕 | 同上 | L764–768 | 「For the refutation-text group, however, there was a significant increase in misconceptions from immediate to delayed testing (p = .045); although the number of misconceptions was still lower than in the other two groups.」 |
| 9 | 即時階段組間比較 | 反駁文組比控制組少（p = .077）、比對照表組少（p = .093），皆未達 .05；延宕時三組無差異（ps ≥ .956） | 組間（Bonferroni） | 註 1 | L778–782 | 「At delayed testing, there was no significant difference between the groups with regard to the number of misconceptions anymore (ps ≥ .956).」 |
| 10 | 圖 6 的誤解數（從圖讀，約值） | 學習前約 2.0／1.8／1.8；即時約 0.5／1.0／1.0；延宕約 0.85／1.05／1.05（反駁文／對照表／控制） | 同上 | 圖 6 | L731–755（PDF p.179） | — |
| 11 | 作者對第 6–9 項的結論 | 三種做法都能引發概念改變 | — | 同上 | L769–770 | 「Hence, it can be concluded that all three instructional methods were effective in inducing conceptual change.」 |
| 12 | 對照表填寫品質 | 29 人中 23 人滿分 4 分、4 人 3 分、2 人 2 分 | 無 | Quality of completed think sheets | L773–776 | 「the participants completed the think sheets thoroughly」 |

### 理解（即時）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 13 | 整體交互作用**未達 .05** | ∆R² = .06，F(2, 86) = 3.03，p = .053 | 含 vs. 不含「誤解 × 教學方法」 | Comprehension | L871–872 | 「there was a marginally significant overall interaction between misconceptions and instructional method」 |
| 14 | 整個迴歸模型不顯著 | R² = .09，F(5, 86) = 1.72，p = .138 | — | 表 3 | L868 | 表列 |
| 15 | 控制組：誤解越多理解越差，**p = .050** | b = −0.40，SE = 0.20，t = −1.99，p = .050（正文寫 t(91)，表 3 寫 t(86)） | 控制組內的斜率 | Comprehension、表 3 | L872、L838–862 | 「In the control group, misconceptions had a marginally significant negative effect on comprehension, b = −0.40, SE = 0.20, t(91) = −1.99, p = .050.」 |
| 16 | 反駁文組：誤解數與理解無關 | b = 0.15，SE = 0.21，t(91) = 0.70，p = .487 | 反駁文組內的斜率 | Comprehension | L873–874 | 「misconceptions had no significant effect in the refutation-text group」 |
| 17 | 對照表組：無關 | b = 0.27，SE = 0.21，t(91) = 1.28，p = .204 | 對照表組內的斜率 | 同上 | L874–875 | 同上 |
| 18 | 斜率差：反駁文 vs. 控制**未達 .05** | b = 0.54，SE = 0.29，t(86) = 1.88，p = .063 | 交互作用項 | 表 3 | L841–866、L877–879 | 「the interaction between misconceptions and refutation-text/control was marginally significant」 |
| 19 | 斜率差：對照表 vs. 控制顯著 | b = 0.66，SE = 0.29，t(86) = 2.30，p = .024 | 交互作用項 | 表 3 | 同上、L879–881 | 「the impact of misconceptions on comprehension in the control group and the think-sheet group differed significantly」 |
| 20 | **平均誤解數下，三組理解沒有差異** | 反駁文 vs. 控制 b = 0.35，SE = 0.28，p = .202；對照表 vs. 控制 b = −0.01，SE = 0.28，p = .971 | 在平均誤解數處的組間差 | 表 3 | L839–864 | 表列（正文沒有另外敘述這兩個係數） |
| 21 | 反駁文 vs. 對照表：斜率無差異 | b = 0.12，SE = 0.21，t(86) = 0.42，p = .679 | 以反駁文組為參照重跑 | Comprehension | L917–920 | 「the interaction between misconceptions and think-sheet/refutation-text was not significant」 |
| 22 | 作者的結論 | 與理解假設相符 | — | 同上 | L921–923 | 「the refutation text and the think sheet compensated the negative impact of misconceptions on comprehension occurring in the control condition. This compensatory effect did not differ between the refutation text and the think sheet.」 |

### 遷移（即時）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 23 | 整體交互作用顯著 | ∆R² = .08，F(2, 86) = 4.05，p = .021；模型 R² = .14，F(5, 86) = 2.83，p = .020 | 同上 | L926–927、L998 | 「there was a significant overall interaction」 |
| 24 | **控制組：誤解數與遷移無關** | b = −0.16，SE = 0.20，t(91) = −0.79，p = .430 | 控制組內斜率 | L927–929 | 「The effect of misconceptions on transfer was not significant in the control group」 |
| 25 | 反駁文組：無關 | b = 0.31，SE = 0.21，t(91) = 1.49，p = .139 | 反駁文組內斜率 | L929–930 | 同上 |
| 26 | **對照表組：誤解越多遷移越好** | b = 0.66，SE = 0.21，t(91) = 3.17，p = .002 | 對照表組內斜率 | L930–931 | 「in the think-sheet group, misconceptions had a significant positive effect」 |
| 27 | 斜率差 | 反駁文 vs. 控制 b = 0.47，SE = 0.29，t(86) = 1.63，p = .108（不顯著）；對照表 vs. 控制 b = 0.81，SE = 0.29，t(86) = 2.83，p = .006 | 交互作用項 | 表 4 L947–996 | 表列 |
| 28 | 平均誤解數下組間無差異 | 反駁文 vs. 控制 b = 0.27，p = .328；對照表 vs. 控制 b = 0.25，p = .370 | — | 表 4 | 表列 |
| 29 | 反駁文 vs. 對照表：斜率無差異 | b = 0.35，SE = 0.29，t(86) = 1.19，p = .238 | 以反駁文組為參照 | L935–938 | 「was not significant」 |
| 30 | 作者的結論 | **與遷移假設不符** | — | L939–940、L1029–1030 | 「the results were not in line with the transfer hypothesis. Misconceptions had no significant negative effect on transfer in the control group. Consequently, no compensatory effect of the refutation text and the think sheet could emerge.」 |

### 理解預測的偏誤（order 15 用）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 31 | 整體交互作用**未達 .05** | ∆R² = .06，F(2, 86) = 2.76，p = .069；模型 R² = .09，F(5, 86) = 1.67，p = .150 | 同上 | L1033–1035、L1098 | 「a marginally significant overall interaction」 |
| 32 | 控制組：誤解越多越高估 | b = 0.55，SE = 0.22，t(91) = 2.56，p = .012 | 控制組內斜率 | L1035 | 「indicating that more misconceptions resulted in greater overconfidence」 |
| 33 | 反駁文組：無關 | b < −0.01，SE = 0.22，t(91) = −0.01，p = .991 | 反駁文組內斜率 | L1035 | 「misconceptions had no significant effect in the refutation-text group」 |
| 34 | 對照表組：無關 | b = −0.13，SE = 0.22，t(91) = −0.59，p = .557 | 對照表組內斜率 | L1036 | 同上 |
| 35 | 斜率差 | 反駁文 vs. 控制 b = −0.55，SE = 0.31，t(86) = −1.79，p = .078（未達 .05）；對照表 vs. 控制 b = −0.68，SE = 0.31，t(86) = −2.20，p = .031 | 交互作用項 | 表 5 L1047–1096、L1037–1040 | 「differed marginally significantly」／「differed significantly」 |
| 36 | 平均誤解數下組間無差異 | 反駁文 vs. 控制 b = −0.29，p = .334；對照表 vs. 控制 b = 0.05，p = .860；常數（控制組在平均誤解數的偏誤）0.35，p = .091 | — | 表 5 | 表列 |
| 37 | 反駁文 vs. 對照表：無差異 | 原文印 b = −0.13，SE = 0.22，t(86) = −0.59，p = .557（與第 34 項四個數字完全相同，見「不一致」第 4 點） | 以反駁文組為參照 | L1128–1130 | 「found no significant interaction」 |
| 38 | 作者的結論 | 與理解預測假設相符 | — | L1131–1133 | 「the refutation text and the think sheet counteracted the detrimental impact of misconceptions on the accuracy of comprehension predictions occurring in the control condition.」 |

### 遷移預測的偏誤

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 39 | 整體交互作用顯著 | ∆R² = .07，F(2, 86) = 3.17，p = .047；模型 R² = .07，F(5, 86) = 1.35，p = .250 | 同上 | L1136–1138、L1206 | — |
| 40 | **控制組：誤解數與遷移預測偏誤無關** | b = 0.35，SE = 0.22，t(91) = 1.58，p = .117（表 6 的 SE 印 0.23） | 控制組內斜率 | L1138–1139 | 「The effect of misconceptions on bias was not significant in the control group」 |
| 41 | 反駁文組：無關 | b = −0.03，SE = 0.23，t(91) = −0.11，p = .912 | 反駁文組內斜率 | L1139–1140 | 同上 |
| 42 | **對照表組：誤解越多越低估自己**（未達 .05） | b = −0.45，SE = 0.23，t(91) = −1.97，p = .052 | 對照表組內斜率 | L1140–1142 | 「More misconceptions resulted in more underconfident predictions」 |
| 43 | 斜率差 | 反駁文 vs. 控制 b = −0.37，p = .241（不顯著）；對照表 vs. 控制 b = −0.80，SE = 0.32，t(86) = −2.52，p = .014 | 交互作用項 | 表 6 L1151–1200 | 表列 |
| 44 | 反駁文 vs. 對照表：無差異 | b = −0.43，SE = 0.32，t(86) = −1.32，p = .192 | 以反駁文組為參照 | L1258–1259 | — |
| 45 | 三組平均都低估遷移 | 遷移預測偏誤 −0.32／−0.17／−0.16 | 表 2 | L1527–1528 | 「in all three groups, the learners on average underestimated their transfer」 |
| 46 | 作者的結論 | **與遷移預測假設不符** | — | L1260–1264 | 「the results were not in line with the transfer-prediction hypothesis.」 |

### 作答信心準確度

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 47 | 14 人算不出來 | 因作答對錯沒有變異（反駁文 3、對照表 6、控制 5），分析 N = 78 | — | L1267–1268、表 2 註 b L706–708 | 「We could not calculate response-confidence accuracy for 14 participants」 |
| 48 | **沒有交互作用** | ∆R² = .01，F(2, 72) = 0.44，p = .646；兩個交互作用項 p = .387、.453；模型 R² = .08，p = .284 | 同上 | L1268–1269、表 7 L1207–1254 | 「the response-confidence hypothesis was not supported」（L1335） |
| 49 | 對照表組在平均誤解數下較高，未達 .05 | b = 0.33，SE = 0.17，t(72) = 1.89，p = .062 | 對照表 vs. 控制 | 表 7、L1269–1271 | 「the effect of think-sheet/control was marginally significant」 |
| 50 | 事後對比：對照表組高於另兩組 | 對比（+2、−1、−1）F(1, 75) = 4.43，p = .039，η² = .06；各組 gamma .72／.43／.38 | 對照表 vs. 反駁文＋控制 | L1331–1337 | 「response-confidence accuracy was higher in the think-sheet group than in the other two groups」 |

### 延宕（6–8 天後）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 51 | **延宕理解：什麼都不顯著** | 交互作用 ∆R² = .01，F(2, 85) = 0.95，p = .391；控制組斜率 b = −0.18，p = .377；模型 R² = .05，p = .558 | 同即時 | L1340–1342、表 8 L1278–1329 | 「none of the variables entered in the regression analysis were significant」 |
| 52 | **延宕遷移：什麼都不顯著** | 交互作用 ∆R² = .04，F(2, 85) = 1.69，p = .190；控制組斜率 b = −0.02，p = .941；模型 R² = .11，p = .077 | 同上 | L1345–1348、表 9 L1355–1406 | 「the delayed-transfer hypothesis was apparently not confirmed」 |
| 53 | 作者對延宕結果的解釋 | 控制組裡誤解的負面影響在延宕時變小，推測是重複作答的測驗效應；另說有額外的探索分析顯示延宕表現取決於即時階段學到多少、即時到延宕沒有顯著退步（這些分析沒有給數字） | — | L1552–1570 | 「this result reflects that the negative impact of misconceptions on learning was diminished in the control group at delayed testing. Presumably, the learners with misconceptions in this group particularly benefitted from repeatedly completing test questions on the topic.」 |

### 討論節裡與結果有關的說法

- 控制組本身就是強對照：「in addition to the standard text, the learners in this group were provided with a sheet that listed the targeted misconceptions … This might have helped the learners who held some of these misconceptions to engage in certain effective learning processes as well.」（L1452–1458）
- 光是先給一張誤解清單再讀正確內容就可能有用：「even the rather simple and easy-to-implement method of providing learners with a list of misconceptions before confronting them with a text on the correct information can be effective to debunk misconceptions」（L1629–1632）
- 過度使用反駁文的顧慮（引言，非本研究結果）：「an extensive use of refutation texts in instruction might be counterproductive because learners might experience a decline in motivation and become insensitive to the refutations.」（L160–162）
- 對照表組「誤解越多遷移越好」的解釋引用把誤解當資源的觀點（Clark & Linn 2013；diSessa 2014；Smith et al. 1994）（L1466–1472）。

## 作者自己列的限制（L1573–1603）

1. 對照表為什麼有效的機制不清楚，沒有過程資料（放聲思考、眼動、自陳）。
2. 對照表的做法不只一種；本研究把誤解直接印在表上，沒有讓學習者自己寫下原本的想法，也沒有要求明確對比。
3. 對照表是邊讀邊填；延後幾分鐘再填可能對後設理解更有利，沒有測。
4. **「some results were only marginally significant」**，事後檢定力分析顯示檢定力低於 .80，需要更大樣本重做。
5. 延宕只隔約 7 天。

另外，作者在討論與結論中承認控制組也有效、是強對照（L1452–1461、L1625–1632），但沒有把它列在限制一節。

沒有列為限制、但讀的時候看得到的（我的觀察，不是原文說法）：

- 理解測驗就是事前誤解測驗的同樣 4 題，學習前、即時、延宕共答三次；作者只在解釋延宕結果時提到重複作答。
- 每個依變項只有 4 題；理解滿分 4，反駁文組平均 3.10。
- 誤解數是量出來的，「誤解多的人」與「誤解少的人」的差別不是隨機分派造成的。
- 單一主題（共變數）、單一學校、修過統計的大學生。

## 與摘要說法不一致的地方

1. **摘要沒說控制組是什麼**。摘要只寫「compared with a control condition」（L20–21），正文的控制組是一般課文加一張列出四個誤解的單子。引言與討論有幾處把控制組的結果寫成「when reading the standard text」（L220、L1415、L1488），讀者容易以為控制組沒有接觸到誤解陳述。
2. **摘要沒說主要結果多數未達 .05**。摘要寫「The results revealed that both reading a refutation text and completing a think sheet supported learners with misconceptions in acquiring and accurately predicting their comprehension.」（L21–23）。正文：理解的整體交互作用 p = .053、控制組斜率 p = .050、反駁文對控制的斜率差 p = .063；理解預測偏誤的整體交互作用 p = .069、反駁文對控制的斜率差 p = .078。達 .05 的是對照表對控制的斜率差（p = .024、p = .031）與控制組在預測偏誤上的斜率（p = .012）。討論節開頭把 p = .050 的結果直接寫成「learners with more misconceptions achieved poorer comprehension」（L1415），沒有帶「marginally」。
3. **摘要對延宕結果的寫法**。摘要寫「delayed testing showed that the learning effects were quite stable, independent of the instructional method」（L26–27）。結果節寫的是兩個延宕假設都不成立（「not in line with the delayed-comprehension hypothesis」「delayed-transfer hypothesis was apparently not confirmed」），即時階段看到的調節效果在延宕時不見了；反駁文組的誤解數從即時到延宕顯著回升（p = .045）。「stable」指的是即時到延宕的平均表現沒有顯著下降，那項分析只有文字敘述、沒有數字（L1558–1570）。
4. **數字重複**：L1128–1130 報告反駁文與對照表在理解預測偏誤上的斜率差為 b = −0.13，SE = 0.22，t(86) = −0.59，p = .557，與 L1036 對照表組的條件效果四個數字完全相同。由表 5 兩個交互作用項相減（−0.68 − (−0.55) = −0.13）得到的 b 值吻合，但 SE、t、p 是否誤植無從確認。另外 L920 理解的同類比較 SE 印 0.21，而 b／t = 0.12／0.42 推回約 0.29。
5. **自由度**：各組條件效果正文一律寫 t(91)，表 3–6 同一個迴歸的係數寫 t(86)（例如控制組斜率 −1.99 在兩處都出現）。
6. **表 6 與正文**：控制組斜率的 SE，表 6 印 0.23，正文 L1139 印 0.22。
7. 摘要的 N = 92、三組比較、對照表組遷移較好但低估自己、對照表組作答信心較準，這幾項與正文對得上。

## 與清單「要撐的結論」不合的地方

### order 13 #6：「讀一般文字時誤解多的人理解較差，讀反駁文或填對照表時差距消失；兩種做法沒有差別」

- **「讀一般文字時」要改**：控制組讀的是一般課文加一張列出四個誤解的單子，不是只讀一般文字。這篇沒有「完全不提誤解」的組，所以它回答不了「加一段常見誤解比不加好不好」；它比的是三種呈現誤解的方式。
- **「誤解多的人理解較差」只到 p = .050**：控制組斜率 b = −0.40，作者自己稱 marginally significant；三組合併時誤解數與理解的相關是 r = .01。
- **「差距消失」要分開講**：反駁文組與對照表組的斜率確實不顯著（p = .487、.204），但「反駁文組與控制組的斜率有差」這件事 p = .063，沒有達標；只有對照表對控制達標（p = .024）。整體交互作用 p = .053。
- **平均來看三組理解沒有差異**（p = .202、.971），三組的誤解也都減少、教學方法沒有主效果。清單那句話沒寫到這一點，容易被讀成「反駁文讓人學得比較好」。
- **6–8 天後全部不顯著**，反駁文組的誤解還顯著回升。
- **「兩種做法沒有差別」**：就理解與理解預測的斜率而言撐得住（p = .679、.557）。但在遷移、遷移預測偏誤（對照表對控制顯著、反駁文對控制不顯著）與作答信心準確度（對照表組較高，p = .039）上兩者表現不同，作者結論也說對照表「have some further benefits」（L1638）。
- 遷移這個依變項上假設不成立：控制組裡誤解數與遷移無關。

### order 15 #3：「有誤解的讀者更高估自己；反駁文與對照表對判斷準確度的效果」

- **「有誤解的讀者更高估自己」**：只在控制組、只在理解預測上成立（b = 0.55，p = .012）。三組合併的相關是 r = .11，不顯著。遷移預測上控制組不顯著（p = .117），而且三組平均都是低估遷移。
- **反駁文的效果**：反駁文組內斜率接近零（p = .991），但與控制組的斜率差 p = .078，未達 .05；整體交互作用 p = .069。
- **對照表的效果**：與控制組的斜率差達標（p = .031）。但在遷移預測上，對照表組誤解越多的人越低估自己（p = .052）。
- **作答信心準確度**：誤解數沒有調節效果（p = .646），假設不成立；對照表組整體較準是事後對比的結果。
- 在平均誤解數下，三組的預測偏誤沒有差異（p = .334、.860）。

## 讀取紀錄

主檔 `prinz2021.raw.txt`，依序讀：

| 次序 | 行號 | 內容 |
|---|---|---|
| 1 | L1–40 | 刊頭、題名、作者、摘要、關鍵詞、引言首段、通訊作者與單位 |
| 2 | L40–620 | 引言其餘、誤解與後設理解、反駁文、對照表、The present study（各假設）、Method（受試者、設計、教材、測量、程序、分析）、Results 開頭、表 1、表 2 開頭 |
| 3 | L617–1010 | 表 2、Preliminary analyses、誤解減少、對照表品質、註 1、圖 6–8 的文字、表 3、Comprehension、Transfer、表 4 |
| 4 | L1010–1480 | 圖 9–10 的文字、理解預測偏誤、表 5、遷移預測偏誤、表 6、表 7、作答信心準確度、表 8、延宕理解、延宕遷移、表 9、Discussion 前兩節 |
| 5 | L1480–1669 | Discussion 其餘各節、Limitations and future directions、Implications and conclusion、Funding、資料可得性、倫理、Open Access 聲明 |
| 6 | L1671–1869 | 參考文獻：只掃過 |

- 表 1、表 2：直接看 PDF 第 13、14 頁（期刊頁碼 177、178）逐格對過。表 1 在 PDF 上是轉 90 度的橫表，`prinz2021.raw.txt` 把它拆成一欄一段且順序打散，上面第 1–3 項的數字以 PDF 頁面為準。
- 表 3–9：用帶 `-layout` 的 `pdftotext` 另轉一份（放在 scratch，未存回），逐列與主檔對過，一致。
- 圖 6：看過 PDF 第 15 頁，數值目測，標「約」。圖 7–10（各組迴歸線）只讀了圖題與正文敘述，沒有從圖上讀數；斜率以表 3–6 與正文為準。圖 1（一般版與反駁版課文的節錄）與圖 2（對照表全表）看過 PDF 第 7、8 頁：反駁版節錄的開頭是「Learners often assume that, like the correlation coefficient, covariance is a standardized statistic … However, this assumption is incorrect.」，之後的正確資訊與一般版逐字相同；對照表三欄標題是「Central question about covariance」「Typical misconception concerning the question」「Correct explanation concerning the question」，第二欄四句誤解都以肯定句寫出。圖 3–5（誤解題、研究報告節錄、遷移題的範例）只讀了圖題，圖中的範例文字沒有逐字讀。
- 沒有附錄或補充材料；資料「available from the corresponding author on request」（L1647）。
