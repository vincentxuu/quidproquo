# 抽取紀錄：Xu、Zhao、Zhang、Liew、Kogut 2022，A meta-analysis of the efficacy of self-regulated learning interventions on academic achievement in online and blended environments in K-12 and higher education

- **書目**：Zhihong Xu、Yingying Zhao、Bingsheng Zhang、Jeffrey Liew、Ashlynn Kogut。作者名對出版者頁面的作者欄核過；單位依 OpenAlex 是 Texas A&M University（Zhang 為 StataCorp），出版者頁面的單位欄我沒有另外核對。清單上「作者名待補」補在這裡。*Behaviour & Information Technology* 42(16)，2911–2931。DOI：10.1080/0144929X.2022.2151935。收稿 2021-09-15、接受 2022-11-21、線上 2022-12-16。開放取用（hybrid，CC BY-NC-ND 4.0）。
- **原文檔（重抓）**：`.research/raw/learning-content/q4-time/xu2022-srl-online-blended-meta-full.txt`，519 行、106,087 字元。前半是正文（L3–131）與參考文獻（L132–348），後半是 Table 1–3（L349–519）。
- **重抓來源**：出版者 Taylor & Francis 的開放取用全文頁 `https://www.tandfonline.com/doi/full/10.1080/0144929X.2022.2151935`。直接用 curl 會被擋（403），所以取 Wayback 2025-04-27 的快照（`http://web.archive.org/web/20250427052915/…`），再用瀏覽器開現行頁面比對：正文逐行相同，三張表逐字元相同。**三張表在頁面裡是內嵌資料，一般抓取工具拿不到**，這次另外解出來。Table 1 裡有缺值的列，原 HTML 沒有那個儲存格，欄位會左移，讀的時候要從右邊往回數。
- **舊檔**：`q4-time/srl-k12-online-meta-2022.md`（223 行、50,313 字元）在第 6 節限制段中間被截斷（截在「Future research should further investigate the effectiveness of note-taking and video scaffolds in online and」），而且**沒有任何一張表**。舊檔這次沒有重讀全文，只核對了檔頭與截斷位置；之後以新檔為準。
- **版本**：刊出版（出版者 HTML）。沒有取得 PDF，頁碼無法標，以下用新文字檔行號。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 19（清單 D 第 19#10 列）
- **表格對照**：Table 1（92 列）、Table 2、Table 3 逐列讀過，來源是出版者頁面的內嵌表格資料（不是 PDF 轉文字，沒有錯位問題）；沒有對 PDF 版面。**Figure 1（篩選流程圖）、Figure 2（漏斗圖）、Figure 3（trim-and-fill 圖）是圖檔，沒有看**。

## 研究設計

- **類型**：統合分析。
- **檢索**（L42）：教育館員設計檢索式；ERIC、APA PsycInfo、Education Source、Academic Search Ultimate、Computer Source（都在 EBSCO）。三個核心概念：自我調節、線上與混成環境、學業成就。期間 2011-01-01 到 2022-03-16。得 7,171 筆，去重後 5,458 筆；摘要篩選後 512 篇；全文篩選剔除 462 篇；**納入 50 篇文章、92 個「獨立研究」**（L42–44）。
- **納入標準**（L48–55）：原文說「eight criteria」，實際列了七條：
  1. 檢驗 SRL 介入對學業表現的效果，以標準化測驗或研究者自編測驗測量
  2. 在線上或混成環境進行（面對面課堂的排除）
  3. 2011-01-01 到 2022-03-16 的同儕審查期刊論文或學位論文，英文；排除次級資料分析、文獻回顧、研討會論文、書籍章節
  4. 隨機實驗或準實驗
  5. 有獨立的對照組；對照條件「were not involved in any formats of self-regulated strategies」，可以是傳統教師主導的課堂，也可以是線上或混成環境
  6. 任何類型的學習者（幼兒園到成人、一般到特殊需求、正式到非正式教育）
  7. 有足夠的量化資訊可算效果量
- **編碼**（L57–68）：出版類型、教育階段、學科（STEM／非 STEM）、樣本數、介入期間（週）、強度（每週分鐘數）、學習情境（混成／線上課程或學習系統／行動學習／網頁式）、SRL 策略（認知／後設認知／資源管理／情緒／混合）、SRL 階段（準備／執行／評估／混合）、SRL 鷹架（提示或暗示／概念圖／整合式 SRL 工具／範例／影片／筆記／混合）。兩位編碼者獨立編碼，一致率 95%，爭議由第四作者裁決。
- **效果量**（L70）：Cohen's d，依 Lipsey 與 Wilson 2001 的程序；沒有報告平均數與標準差的，用 p 值、t 或 F、信賴區間估計。
- **分析**（L72–74）：隨機效果模型估整體；調節變項一次做一個（子群分析＋Stata 的 meta regress）；出版偏誤用「期刊對學位論文」的調節分析與 trim-and-fill。
- **沒有做的**：沒有研究品質或偏誤風險評估；研究設計（隨機對準實驗）、結果測量（標準化對自編）沒有當調節變項；同一篇文章、同一批受試者貢獻的多個效果量當成獨立的（見下方「Table 1」）。

## 結果（逐項）

### 納入研究的樣貌（L77；Table 1，L350–444）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 設計 | 準實驗 71、隨機實驗 21 | L77 | 「Seventy-one studies were quasi-experimental, whereas the other 21 used randomised experimental designs.」 |
| 2 | 介入強度與期間 | 每週 6 到 330 分鐘；1 到 36 週 | L77 | 「The intensity of the SRL interventions varied from six to 330 min each week. The durations of the SRL interventions extended from one week to 36 weeks.」 |
| 3 | 樣本數 | 20 到 2,536 | L77 | 「The sample sizes of the studies ranged from 20 to 2,536.」 |

我從 Table 1 逐列統計的（原文沒有寫，這些是我算的）：

- 設計 71／21、出版類型期刊 86／學位論文 6，與內文相符。
- 樣本數中位數 68；92 個裡 64 個小於 100。
- 結果測量：研究者自編測驗 82 個、標準化測驗 10 個。
- 教育階段：高等教育 60、中學 23、小學 7、非正式教育 2。
- 效果量中位數 0.44；負值 12 個（最小 −0.36）；大於等於 2 的有 6 個：2.01、2.41、3.03、4.48、4.52、7.25。
- 50 篇文章裡 17 篇貢獻了多個效果量，共 59 個（占 92 個的 64%）。同一篇的多個效果量常常樣本數完全相同，例如 Cai 等 2020 三個都是 N = 2,536、Long 與 Aleven 2017 有四個 N = 245、Bannert 等 2015 六個都是 N = 70、Shin 與 Song 2016 六個都是 N = 33。原文把它們稱為「independent studies」，沒有說明是不是同一批人的不同結果測量，也沒有處理相依。
- 小學組的 7 個效果量：Hsiao 等 2012 兩個（d = 4.48，N = 43；d = 7.25，N = 41）、Kim 與 Pedersen 2011（0.25，N = 172）、Chen 等 2019（0.37，N = 46）、Lai 等 2018 兩個（1.82，N = 30；0.47，N = 26）、Boykin 等 2019（1.32，N = 69）。

### 整體效果（L80；Table 2 末列）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 4 | 隨機效果 | d = .63（表列 .626），95% CI [.47, .79]，k = 92 | SRL 介入組 vs 沒有任何 SRL 策略的對照組 | L80、L476 | 「The random effect model gives a larger overall effect size .63 (with 95% CI [.47, .79]).」 |
| 5 | 固定效果 | .55，95% CI [.52, .59] | 同上 | L80 | 「The fixed effect model with inverse-variance method gives the overall effect size .55」 |
| 6 | 異質性 | Q = 513.22，df = 91，p < .001；Tau² = .53；原文沒有報告 I² | 同上 | L80、L476 | 「indicated the existence of significant variations in the effect sizes」 |

### 出版偏誤（5.3 節，L118）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 7 | Egger 檢定 | z = 6.85，p < .001 | L118 | 「The significance of regression-based Egger test … for small-study effects (z = 6.85 and p < .001) necessitates further exploration of the possible publication bias.」 |
| 8 | 漏斗圖 | 不對稱 | L118 | 「The funnel plot (see Figure 2) appeared to be non-symmetric, indicating the existence of potential publication bias.」 |
| 9 | **Trim-and-fill** | **補 13 個研究後，效果量從 0.63 降到 .38** | L118 | 「Imputation results showed that we might need 13 additional studies, which would reduce the effect size from 0.63 using only the observed studies to .38.」 |
| 10 | 期刊對學位論文 | 期刊 .634（k = 86，CI [.476, .792]）；學位論文 .491（k = 6，CI [−.47, 1.45]）；QB = .08，p = .773 | L83、L447–448 | 「no significant difference was found between studies from refereed journals and the unpublished studies … caution needs to be taken in interpreting the results due to the limited number of studies categorised as unpublished (n = 6).」 |

### 子群分析（Table 2，L445–477）

對照條件一律是「SRL 介入 vs 沒有 SRL 的對照組」；各列是不同研究的子集，屬跨研究比較。

| 分組 | 子群 | k | ES | 95% CI | 組內 Q（p） | Tau² | 組間 QB（p） |
|---|---|---|---|---|---|---|---|
| 學習情境 | 線上課程／學習系統 | 55 | .72 | [.46, .99] | 372.53（.00） | .90 | 1.90（.59，不顯著） |
| | 行動 | 5 | .41 | [−.07, .89] | 11.33（.02） | .19 | |
| | 網頁式 | 23 | .52 | [.31, .74] | 78.58（.00） | .21 | |
| | 混成 | 9 | .55 | [.14, .95] | 43.55（.00） | .31 | |
| SRL 策略 | 後設認知 | 31 | **.19** | [.10, .27] | 31.7（.38） | .00 | 27.36（.00） |
| | 認知 | 4 | .78 | [−.002, 1.57] | 28.86（.00） | .58 | |
| | 資源管理 | 2 | .46 | [−.02, .93] | .38（.54） | .00 | |
| | 情緒 | 1 | .19 | [−.22, .59] | — | .00 | |
| | 混合 | 54 | .92 | [.64, 1.19] | 358.44（.00） | .95 | |
| SRL 階段 | 準備 | 1 | .13 | [−.19, .44] | — | .00 | 20.05（.00） |
| | 執行 | 17 | .36 | [.14, .59] | 53.94（.00） | .16 | |
| | 評估 | 8 | .15 | [−.04, .34] | 8.65（.28） | .02 | |
| | 混合 | 66 | .78 | [.55, 1.00] | 398.25（.00） | .78 | |
| SRL 鷹架 | **提示或暗示** | 24 | **.24** | [.11, .38] | 39.86（.02） | .05 | 19.89（.00） |
| | 概念圖 | 3 | .36 | [.05, .66] | .07（.96） | .00 | |
| | 整合式 SRL 工具 | 32 | .63 | [.37, .84] | 121.93（.00） | .32 | |
| | 範例 | 1 | .42 | [.41, .84] | — | .00 | |
| | 筆記 | 4 | 1.25 | [.54, 1.95] | 25.86（.00） | .43 | |
| | 影片 | 3 | 1.20 | [−.51, 2.91] | 31.73（.00） | 2.19 | |
| | 混合 | 25 | .96 | [.58, 1.18] | 214.34（.00） | 1.82 | |
| 學科 | STEM | 51 | .88 | [.59, 1.27] | 373.89（.00） | 1.09 | 18.83（.00） |
| | 非 STEM | 40 | .40 | [.27, .52] | 123.76（.00） | .09 | |
| | 混合 | 1 | −.095 | [−.42, .23] | — | .00 | |
| 教育階段 | 小學 | 7 | 2.21 | [.33, 4.09] | 126.08（.00） | 6.23 | 5.19（.16，不顯著） |
| | 中學 | 23 | .43 | [.31, .55] | 61.90（.00） | .04 | |
| | 高等教育 | 60 | .58 | [.40, .76] | 291.70（.00） | .41 | |
| | 非正式／成人 | 2 | .74 | [−1.01, 2.49] | 19.17（.00） | 1.51 | |

k 由表列 df 加 1 得出，與內文各段寫的 n 相符。

與教學文章最相關的兩列，原文的說法：

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 11 | 只給提示或暗示的鷹架 .24（k = 24），是樣本數夠的鷹架類別裡最小的 | L108 | 「The effect sizes for utilising worked examples (n = 1), providing concept maps (n = 3), and giving only prompts or hints (n = 24) were .42, .36 and .24, respectively.」 |
| 12 | 只用後設認知策略 .19（k = 31），組內同質（Q 的 p = .38） | L100 | 「using metacognitive strategies (n = 31, with effect size .19)」 |
| 13 | 混合策略、跨多階段的介入效果最大 | L101、L106 | 「we encourage the use of multiple SRL strategies in SRL interventions」；「SRL interventions should support SRL in multiple phases rather than focusing on one phase.」 |
| 14 | 筆記與影片最大，但作者要讀者小心 | L109 | 「this result should be interpreted with caution, as the sample sizes for them are very small, with four studies using notes as scaffolds and three studies using videos.」 |

### 迴歸分析（Table 3，L478–518）

| # | 結果 | 數字 | 行號 |
|---|---|---|---|
| 15 | 期間（只放線性項） | 係數 .0125，SE .0107，p = .24，CI [−.0085, .0334] | L512–513 |
| 16 | 期間（加二次項） | 線性 .0539（p = .05，CI [−.0009, .1086]）、二次 −.0015（p = .11） | L509–511 |
| 17 | 強度（只放線性項） | 係數 −.0016，p = .431 | L517–518 |
| 18 | 強度（加二次項） | 線性 −.0019（p = .772）、二次 9.73 × 10⁻⁷（p = .963） | L514–516 |
| 19 | 作者的判定 | 期間與強度都不能預測效果量；22 個研究沒報強度、13 個沒報期間 | L115–116 |

L115 原文：「the overall effect size was not statistically detectable by neither the intervention's duration nor intensity (p > .05).」L116：「Twenty-two studies did not provide information about the intensity of the intervention, and 13 did not provide information for duration.」

Table 3 其餘各列是各類別的係數，數值與 Table 2 的子群效果量接近（例：提示或暗示 .27，SE .15，p = .08，CI [−.04, .57]；後設認知 .21，SE .13，p = .11；小學 1.78，SE .31）。在迴歸裡，「提示或暗示」與「只用後設認知策略」兩項都不顯著。

## 作者自己列的限制

第 6 節倒數第二段（L128），只講了一類：

1. **某些類別的樣本很小**：「The primary limitations of this meta-analysis are small samples in certain categories.」點名學位論文只有 6 個、筆記 4 個、影片 3 個。

散在結果段的保留：

2. 混成（9 個）與行動（5 個）情境的研究少，「we should interpret our results cautiously」（L91）。
3. 期間與強度有大量缺漏（L116）。
4. 教育階段的發現與先前研究不一致（Zheng 2016 沒有差異；Li 等 2018 小學反而較小），作者把「愈早介入愈好」寫成假說：「We hypothesise that early SRL interventions might have beneficial effects」（L95–98）。
5. 結論段：「these findings also need to be replicated by additional empirical studies」（L127）。

**原文沒有列為限制的**：出版偏誤（Egger 顯著、校正後剩 .38）；沒有做研究品質評估；92 個裡 71 個是準實驗；82 個用研究者自編測驗；多個效果量來自同一批受試者；異質性很大（Q = 513）；極端值（d = 4.48、4.52、7.25）沒有做敏感度分析。

## 與摘要說法不一致的地方

1. **摘要的整體效果量是 0.69，正文與結論是 0.63。** 摘要：「confirmed a positive and moderate effect of SRL intervention (ES = 0.69)」（L4）；結果段：隨機效果 .63（L80），Table 2 末列 .626；結論段：「(ES = 0.63)」（L125）。全文沒有任何一個分析得出 0.69；0.69 這個數字只在文獻回顧裡出現過，是 Dignath 與 Büttner 2008 的結果（L31）。引用時要用 0.63，並註明摘要印的數字不同。
2. **摘要與結論都沒有提出版偏誤校正後的 .38。** 5.3 節自己寫了 Egger 檢定顯著、漏斗圖不對稱、trim-and-fill 之後降到 .38（L118），但摘要、結論、限制三處都沒有再出現。「中等效果」的說法只對未校正的數字成立；.38 一般歸為小到中。
3. **結論把組間不顯著的差異寫成發現。**
   - 「produce the largest effect size for early-age learners」「elementary education produced the largest effect size」（L127）：教育階段的組間檢定 QB = 5.19，p = .16，不顯著；小學只有 7 個效果量，CI [.33, 4.09]，Tau² = 6.23，其中兩個（4.48、7.25）來自同一篇、樣本各 40 人上下。
   - 「online learning systems and blended learning produced the largest effect size with the biggest sample size」（L127）：學習情境 QB = 1.90，p = .59，不顯著（結果段 L90 自己寫了「not statistically detectable」）。
4. 內文 L77 寫「51 were published between 2011 and 2015, and 41 were published between 2016 and 2019」；Table 1 有 2020、2021、2022 年的研究，我依引用年份數：2011–2015 共 51 個、2016–2019 共 22 個、2020–2022 共 19 個。41 是 2016–2022 的合計，「2019」應是筆誤。
5. 內文與表的數字出入（照實記錄）：
   - 教育階段小學的迴歸係數，內文 1.76（L94），Table 3 是 1.78。
   - SRL 階段混合的係數，內文 .75（L104），Table 3 是 .76。
   - SRL 策略段說後設認知、資源、情緒三項「failed to statistically predict the effect size (p = .21, .45, .19 respectively)」（L100）；Table 3 的 p 值是 .11、.39、.79。內文括號裡的三個數字與 Table 3 的係數（.21、.45、.19）相同，看起來是把係數誤植成 p 值。
   - 學科的組間檢定，內文寫 df = 1（L85），分成三組（STEM、非 STEM、混合）。
6. Table 2 幾個信賴區間不以點估計為中心：範例 .42 [.41, .84]（只有 1 個研究）、整合式 SRL 工具 .63 [.37, .84]、鷹架混合 .96 [.58, 1.18]、STEM .88 [.59, 1.27]。原文沒有說明，照抄。
7. 納入標準自稱八條，列了七條（L48–55）。
8. 題名寫「K-12 and higher education」；92 個裡小學 7 個、中學 23 個、高等教育 60 個、非正式教育 2 個。

## 與清單「要撐的結論」不合的地方

清單寫：「與第 3、8 列衝突的一方：統合平均是中等效果」（第 3 列是 Kizilcec 等 2020，第 8 列是 Hsu 與 Tutwiler 2022）。

- **「中等效果」只是未校正的數字。** 隨機效果 0.63；作者自己做的 trim-and-fill 降到 0.38，Egger 檢定顯著。要引就得兩個數字一起寫。摘要的 0.69 是印錯的，不能用。
- **它和 Kizilcec 等 2020 量的不是同一件事，說「衝突」不準。** 這份統合分析的結果變項是測驗成績（82 個是研究者自編測驗），不是完成率或持續率；樣本數中位數 68，三分之二不到 100 人；77% 是準實驗；介入期間 1 到 36 週、多半是一門課裡的小班研究。全文沒有把 MOOC 當成一個類別，也沒有任何一個分析是針對大規模開放課程的完成率。Kizilcec 等 2020 是在幾十萬名 MOOC 學習者身上量完成率的輕量介入。兩邊的對象、規模、結果變項都不同，比較合適的寫法是「小型課堂研究用測驗成績量到正向效果（未校正 0.63、校正後 0.38），放到大規模開放課程量完成率時效果消失或剩很小」，而不是兩邊結果互相矛盾。
- **這份統合分析自己就有支持「輕量提示效果小」的結果，清單沒有用到。** 只給提示或暗示的鷹架是 0.24（24 個效果量，迴歸裡 p = .08 不顯著）；只針對後設認知策略的是 0.19（31 個，組內同質）。效果大的是「混合多種策略、跨多個階段、整合式工具」的重介入（0.63 到 0.96）。這和 Kizilcec 2020、Hsu 2022 的方向其實一致：輕的介入效果小。不過這些是跨研究的子群比較，不是同一研究內的對照。
- **證據品質要交代**：沒有偏誤風險評估；同一批受試者的多個效果量當獨立；有三個 d 大於 4 的極端值沒有處理。
- 清單把題名簡寫成「K12 online」；這篇涵蓋的主力是高等教育（60／92）。

## 讀取紀錄

| 順序 | 位置（新文字檔行號） | 內容 |
|---|---|---|
| 1 | L1–131 | 檔頭註記、摘要、關鍵詞、第 1 節前言、第 2 節文獻回顧（2.1–2.3）、第 3 節研究問題、第 4 節方法（4.1–4.5）、第 5 節結果與討論（5.1、5.2.1–5.2.8、5.3）、第 6 節結論與未來方向（含限制段）、利益衝突聲明 |
| 2 | L349–519 | Table 1（92 列，逐列讀過並做了計數）、Table 2（含表註）、Table 3 |
| 3 | L132–348 | 參考文獻（書目，沒有逐條讀；只用 Table 1 的引用年份做了年份計數） |

沒有讀到的：Figure 1（篩選流程圖）、Figure 2（漏斗圖）、Figure 3（trim-and-fill 圖），三張都是圖檔，內文對應的數字（7,171→5,458→512→50；補 13 個研究、.63→.38）已記在上面。PDF 版沒有取得，所以沒有對 PDF 版面，也沒有確認 PDF 是否另有附錄；出版者 HTML 頁面沒有列出補充材料連結。舊檔沒有重讀。
