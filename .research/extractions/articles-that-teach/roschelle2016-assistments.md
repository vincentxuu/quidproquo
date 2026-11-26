# 抽取紀錄：Roschelle、Feng、Murphy、Mason 2016，AERA Open（含 2017 更正啟事）

**書目**：Jeremy Roschelle, Mingyu Feng, Robert F. Murphy（以上 SRI International）, Craig A. Mason（University of Maine）(2016). Online Mathematics Homework Increases Student Achievement. *AERA Open*, 2(4), 1–12（October–December 2016）. doi:10.1177/2332858416673968。CC BY 3.0。作者全名對過 PDF 首頁與 Crossref。

**更正啟事**：Corrigendum. *AERA Open*, 3(2)，2017-04-17 刊出，doi:10.1177/2332858417707489。Crossref 的 `update-to` 欄把它登記為對 10.1177/2332858416673968 的 correction（2026-10-14 查）。

**原文檔**：`.research/raw/learning-content/q6-evaluate/roschelle2016assistments.pdf`（12 頁）。清單登記的 `roschelle2016assistments.txt` 是 `-layout` 版（723 行、82,149 位元組），雙欄交錯。這次用不帶 `-layout` 的 `pdftotext` 重轉（1,100 行、61,630 位元組）依序讀，**下面行號是重轉版行號**，另附 PDF 頁碼（＝期刊頁碼 1–12）。更正啟事：`roschelle2017corrigendum.md`（15 行、965 位元組；經 Exa 從 journals.sagepub.com 的開放取用頁抓，全文就是一張表加一句註）。

**讀取日期**：2026-10-14
**版本**：刊出版
**供**：order 26

## 研究設計

- **類型**：學校層級的叢集隨機對照實地試驗，延後處理設計（對照組兩年後才拿到）。配對後隨機分派。
- **研究問題**（L161–162）：「Do students in schools that use ASSISTments for mathematics homework learn more than students in schools who do homework without ASSISTments?」
- **地點與理由**：美國緬因州。該州 2001 年起給每位中學生一台可帶回家的筆電（L147–150）。
- **學校**：招募 46 所 → 最後分析 43 所（L306–321，p.4）。先依前測成績排序並微調規模後配對；1 所在配對後退出（剩 45，重新配對）；1 所實驗組學校在開始後退出，它的對照配對學校資料照收但被排除。最後＝20 對（40 所）＋3 所未配對而個別隨機分派（實驗 2、對照 1）。學校層級整體流失 6.5%、差別流失 3.8%。由此推得實驗組 22 所、對照組 21 所（原文沒有直接寫這兩個數字，是我由 20 對加 2、加 1 算的）。
- **學生**：只看七年級。六年級上學期在研究學校的有 3,035 人；其中 2,728 人在七年級末考了 TerraNova；離開的 307 人裡對照組 178、實驗組 129。學生層級流失 10.1%、差別流失 5.6%（L492–501，p.6）。另有 122 位後來轉入者（兩組各 61）納入。**分析樣本 2,850 人：實驗組 1,621、對照組 1,229**（L507–509）。
- **人口組成**（Table 1，L336–366，對過 PDF p.5）：男 49.3%；白人 92.6%、非裔 2.0%、西語裔 2.0%、亞裔 1.8%、多族裔／其他 1.5%；免費或減價午餐 38.7%；特教 12.2%；六年級 NECAP 閱讀 648.3（SD 11.5）、數學 644.6（SD 11.0）。
- **介入內容＝一整包，不只是軟體**（L131–134、L165–273、L398–410）：
  1. ASSISTments 平台：學生寫作業時立即知道對錯並可看提示；老師拿到逐題、逐生的報表（含常見錯誤答案）。
  2. 內容兩種：(a) 暑假由大學生把實驗組各校所用教科書的作業題全部鍵入；(b) skill builders（針對單一技能練到連對若干題，300 多個主題；可在 1、2 週後再檢查保留）。**skill builders 是對照組沒有的額外內容**（L840–843）。
  3. 教師專業發展：第一年前的暑假 3 天、學年中約 6 小時（教練到班 3 次）、第一與第二年之間的暑假再 2 天；教練是 ASSISTments 團隊成員，另有每年 2–3 次線上研討、可隨時來信來電。
  4. 派多少、派什麼作業由老師決定，並請他們照學校既有的作業政策。
- **時程**：老師先用一年（暖身年，當時的學生不算）；**第二年的新一屆七年級學生**才是分析對象（L371–372、L818–820）。所以量到的是「老師已經用了一年之後」的效果。
- **對照組**：照舊派作業，沒有額外訓練，不能用 ASSISTments；知道兩年後可以免費拿到（L373–376）。
- **量了什麼**：
  - 前測：六年級的 NECAP 州測驗（數學、閱讀），由州政府提供。
  - 結果：七年級末的 **TerraNova Common Core 數學測驗**（Level 17，37 題、1.5 小時，選擇題加建構反應題；全國常模）。由老師施測，出版商在不知道組別的情況下計分（L464–468）。選它是因為州測驗正在換制；作者說 ASSISTments 沒有為了對齊 TerraNova 改內容（L425–429）。
  - 使用紀錄：系統 log。
- **分析**（L526–582，p.6–7）：兩層 HLM（學生在學校內）。學生層共變數：先前數學、先前閱讀、FRL、IEP；學校層：處理、學校先前數學平均、20 個配對指標。三層模型結果相近。效果量用 Hedges's g，分母是整體七年級樣本的合併標準差。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 主要效果（調整後） | 實驗組比對照組高 **8.84** 分（對照組調整後平均 681.95）；γ01 = 8.835，t(20) = 2.992，p = .007 | 用 ASSISTments＋教師訓練的學校 vs 照舊派作業的學校 | Results／Table 2 | L591–595、L637–639；p.7–8 | 「the treatment students' adjusted mean TerraNova scale score was 8.84 points higher than the control students' modeladjusted mean scale score of 681.95. This difference is statistically significant, t(20) = 2.992, p = .007.」 |
| 2 | 效果量 | **Hedges's g = 0.18** | 同上 | Results／Table 2 註 | L601–603；p.7 | 「The difference of 8.84 points corresponds to an effect size of 0.18 standard deviation units」 |
| 3 | 未調整差距 | 約 11 分，同方向 | 同上 | Results | L596–598 | 「The unadjusted difference between the mean scores of the two conditions was slightly greater, 11 points」 |
| 4 | 敏感度：去掉 122 位轉入者 | γ01 = 8.573，t(20) = 2.852，p = .010；g = 0.17 | 同上 | Table 3 | L604–610、L672–693；p.7–8 | 「the adjusted mean difference between groups is 8.57 and remains statistically significant (p = .01)」 |
| 5 | Table 2 其他係數 | 截距 γ00 = 681.952；學校先前數學 γ02 = 1.145，p = .127（不顯著）；先前閱讀 γ10 = 0.406；先前數學 γ20 = 2.522；IEP γ30 = −15.624；FRL γ40 = −5.294（學生層皆 t(2760)，p < .001） | — | Table 2（對過 PDF p.8） | L625–659 | 表列 |
| 6 | 先備成績 × 處理的交互作用 | t(2770) = 2.432，p = .015 | 六年級 NECAP 數學中位數以下 vs 以上 | Students With Low and High Prior Achievement／Table 4 | L703–706、L759–760；p.8–9 | 「The interaction is statistically significant, t(2770) = 2.432, p = .015; the effect of the ASSISTments intervention is greater for lower-performing students」 |
| 7 | 中位數以下組 | 對照 650.94、實驗 665.29、差 **14.35**（未調整分數）；**g = 0.29（更正後）** | 實驗 vs 對照 | Table 4＋更正啟事 | L744–757；p.9；corrigendum L10–13 | 更正啟事：「At or below median \| 650.94 \| 665.29 \| 14.35 \| 0.29」 |
| 8 | 中位數以上組 | 對照 711.95、實驗 717.80、差 5.84（未調整）；**g = 0.12（更正後）** | 實驗 vs 對照 | 同上 | 同上 | 更正啟事：「Above median \| 711.95 \| 717.80 \| 5.84 \| 0.12」 |
| 9 | 基線等值 | FRL γ = 0.012，p = .905；非白人 γ = −0.219，p = .427；IEP γ = −0.013，p = .910；性別 γ = 0.100，p = .095；先前數學 γ = 0.194，p = .648；先前閱讀 γ = −0.139，p = .861（皆 t(21)） | 兩組 | Baseline Equivalence | L511–517；p.6 | 「Analyses found no difference between the treatment and control groups in various demographic and predictor variables.」 |
| 10 | 實際使用量**低於預期** | 平均每位學生一學年 967 題、**14 小時**；原預期 18–24 小時 | 只有實驗組 | Use of ASSISTments | L519–525；p.6 | 「Students in the ASSISTments condition used the system, on average, for 967 mathematics problems and for 14 hr in the course of a school year. We had expected 18 to 24 hr of use」 |
| 11 | 處理是否落實 | 所有實驗組老師都有用；沒有對照組老師使用的跡象 | — | System use data | L475–477 | 「we confirmed that all treatment group teachers used ASSISTments, and we found no evidence that control teachers were using the system.」 |
| 12 | 轉入者 | 兩組各 61；先前數學無差異 t(120) = 1.085，p = .280 | 兩組轉入者 | Results | L695–699 | 「their average prior math test scores were also similar across groups, t(120) = 1.085, p = .280」 |
| 13 | 作者對 0.18 的解讀之一 | 大於 FRL 與非 FRL 學生的分數差 | — | Discussion | L774–779；p.9 | 「the gains due to the intervention were greater in magnitude than the difference in scores between students with and without FRL status」 |
| 14 | 解讀之二：improvement index | 第 50 百分位 → 第 58 百分位 | — | Discussion | L780–783 | 「Students at the 50th percentile without the intervention would improve to the 58th percentile」 |
| 15 | 解讀之三：對照全國常模的年成長 | 六、七、八、九年級開學時常模平均 655、670、678、690，平均每年 11.66 分；本研究差 8.84 分 | — | Discussion | L789–799；p.9 | 「(an average difference of 11.66 points per year). In the context of these modest expected differences, the measured difference of 8.84 scale score points is meaningful.」 |

對第 13–15 列的註記（我的核算，不是原文）：
- 第 13 列比的是 Table 2 的 FRL 係數 −5.294，那是**控制了先前成績之後**的 FRL 差，不是兩群學生的原始分數差距；原文沒有給原始差距。
- 第 14 列：g = 0.18 換成常態分配的百分位約是第 57 百分位，原文寫 58。
- 第 15 列：原文只說「meaningful」，**沒有**把 8.84 ÷ 11.66 換算成「多學了幾個月」；這個換算若要寫是我們自己算的（約 0.76 年），而且拿學年成長當分母本身有爭議，不建議寫。

### 更正啟事改了什麼

- 原刊 Table 4 的「Effect size, g」欄兩列都印成 **50.10**（L756–757，PDF p.9 確認）。更正啟事說「in the "Effect Size, g" column of Table 4, the numbers were incorrect」，改成 0.29 與 0.12。
- 正文 L707–710 原本就寫「The corresponding effect sizes were .29 for those students at or below the median and .12 for those students above the median」，所以更正後表與正文一致。
- 更正啟事**沒有**動 Table 2、Table 3，也沒有動整體的 0.18。
- 我的推算：14.35 ÷ 50.10 = 0.286、5.84 ÷ 50.10 = 0.117、8.84 ÷ 50.10 = 0.176，三個效果量都對得上，50.10 應是全樣本的合併標準差被誤植到效果量欄。原文與更正啟事都沒有這樣說，這是推算。

## 作者自己列的限制（Discussion，L812–856，p.9–10）

1. 緬因州每位七年級生都有筆電；別處設備取得不均，效果可能較小。
2. 緬因州比多數州更鄉村、同質性更高。
3. 老師有一整年改善實作之後才量成效；「Implementations that seek results quickly or provide less teacher support may result in smaller or different effects.」
4. **無法指認是介入裡的哪個機制造成效果**（L822–827）：「we are also limited in the degree to which we can identify specific mechanisms within the intervention that were most closely related to the effects observed.」
5. 兩組做作業的時間可能不同（作者認為不太可能，理由是作業量由學校政策決定，各校政策相近）；作業內容可能不同（作者認為不太可能，但承認實驗組多了 skill builder，「We will be examining the extent to which the additional skill builder content ... might explain the findings」）。
6. 學生直接從回饋與提示受益、或老師行為改變的中介，本文沒有分析；「There is some preliminary indication that teachers did change their behavior」，完整分析留待後續。
7. 引言裡對先前三個小型研究的評語（L206–210）：它們「conflate the timing of feedback (immediate vs. delayed) and the modality of feedback (from a computer or a teacher)」，而且都不到一週。

原文沒有列、但設計上可見的：對照組的作業時間與題數沒有量（只有實驗組有 log）；TerraNova 由各校老師施測（計分是盲的，施測不是）；學校是自願報名的；差別流失方向是對照組流失較多（178 vs 129），最後兩組人數差 392 人。

## 與摘要說法不一致的地方

- 摘要「Students with low prior mathematics achievement benefited most」（L26）：正文是中位數二分的兩組比較，交互作用 p = .015，兩組都是正向（0.29 與 0.12）。「most」是兩組裡較大的那組，不是多組比較的最大者。
- 摘要把介入寫成「combining an online homework tool with teacher training」（L21–22），這一點和正文一致；但**標題**「Online Mathematics Homework Increases Student Achievement」只寫線上作業，沒帶教師訓練與暖身年。
- 正文內部一處不一致：L714–716 寫中位數以下組「was 13.35 points higher」，Table 4（原刊與更正版）都是 665.29 − 650.94 = **14.35**。應以表為準；更正啟事沒有處理正文這個 13.35。
- 摘要沒有提使用量低於預期（14 小時 vs 預期 18–24 小時）。
- 其餘（2,850 人、43 所、七年級、年終標準化測驗）逐項對過，一致。

## 與清單「要撐的結論」不合的地方

清單寫：「整個平台層級的正向效果 g = 0.18」。

- 數字撐得住：g = 0.18，t(20) = 2.992，p = .007，更正啟事沒有動它。
- 「整個平台層級」這個說法要改。這篇量的是**一整包介入**：平台＋把各校教科書作業題鍵入＋skill builders 額外內容＋教師訓練（3 天＋2 天工作坊、約 6 小時到班教練）＋一年暖身，以學校為單位隨機分派，和「照舊派作業」比。作者自己說分不出是哪個成分起作用。寫成「用這個平台派作業、加上教師訓練，一學年後標準化測驗高 0.18 個標準差」才對；不能寫成「平台本身的效果」，更不能拿來和 Prihar 2022 那種平台內單一功能的 A/B 測試效果量直接相加或相比。
- 清單對更正啟事的描述正確（只改 Table 4 的效果量欄為 0.29 與 0.12）。引用分組結果時，差距用 14.35 與 5.84（未調整的觀察分數），不要用正文的 13.35。
- 適用範圍：一個州、七年級、數學、人人有筆電；結果測驗是年終標準化測驗，不是平台內的題目，這是它比平台內實驗有說服力的地方。

## 讀取紀錄

重轉版行號，依序、首尾相接：

- L1–L519（題目、摘要、引言、Research Design、Intervention、招募與流失、Table 1、Procedure、Measures、Data Linking、Baseline Equivalence、Use of ASSISTments 開頭）
- L520–L1100（Use of ASSISTments、Analytic Models、Results、Table 2–4、圖 2 圖說、Discussion、限制、Conclusion、Acknowledgments、References、作者簡介；References 掃過）
- 更正啟事 `roschelle2017corrigendum.md` L1–L15 全文

對過 PDF 版面：Table 1（p.5）、Table 2、Table 3（p.8）、Table 4 與圖 2（p.9，確認原刊效果量欄印的是 50.10）、公式（p.7）。圖 1（報表截圖，p.4）沒看。PDF p.5–9 整頁看過；p.1–4、p.10–12 只讀文字。
