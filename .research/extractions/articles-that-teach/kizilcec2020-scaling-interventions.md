# 抽取紀錄：Kizilcec、Reich、Yeomans 等 2020，PNAS 117(26):14900–14905

**書目**：René F. Kizilcec（Cornell 資訊科學系）、Justin Reich（MIT Comparative Media Studies/Writing）、Michael Yeomans（Harvard Business School）、Christoph Dann（Carnegie Mellon 機器學習系）、Emma Brunskill（Stanford 資訊工程系）、Glenn Lopez（Harvard Office of the Vice Provost for Advances in Learning）、Selen Turkay（Queensland University of Technology）、Joseph Jay Williams（University of Toronto）、Dustin Tingley（Harvard）。前三位並列第一作者。作者與單位對 XML 的 contrib 區與 SI 首頁核過。〈Scaling up behavioral science interventions in online education〉。Proceedings of the National Academy of Sciences 117(26):14900–14905，2020-06-30 出刊（線上 2020-06-15）。doi 10.1073/pnas.1921417117。PMCID PMC7334459。CC BY-NC-ND 4.0 開放取用。Edited by Susan T. Fiske；received 2019-12-05，approved 2020-05-12。

**原文檔**（都在 `.research/raw/learning-content/q3-activity/`）：
- `kizilcec2020_PMC7334459.xml`（26 行、76,270 字元；PMC 的 JATS XML）。我用腳本去標籤轉成純文字（234 行、42,402 字元，放在 scratch，未存回）後從頭讀到尾。
- **本次新抓**：`kizilcec2020_PMC7334459.pdf`（6 頁，刊出版 PDF）、`kizilcec2020_si_pnas.1921417117.sapp.pdf`（SI Appendix，28 頁）與我轉的 `kizilcec2020_si.txt`（1,744 行、69,025 字元）、`kizilcec2020_fig01.jpg`、`kizilcec2020_fig02.jpg`。來源：PMC 開放資料桶 `https://pmc-oa-opendata.s3.amazonaws.com/PMC7334459.1/`（NIH/NLM 官方的 PMC Open Access 資料集；檔名分別是 `PMC7334459.1.pdf`、`pnas.1921417117.sapp.pdf`、`pnas.1921417117fig01.jpg`、`pnas.1921417117fig02.jpg`）。pnas.org 與 PMC 網頁直連都被擋（403／Cloudflare 驗證頁）。
**版本**：刊出版。
**讀取日期**：2026-10-14
**供哪幾篇使用**：order 10（清單 B 10#12，10-b 的背景）、order 19（清單 D 19#3，「輕量介入放大後效果剩十分之一或消失」）、order 26（清單 E 25#2／26，「小實驗放大後效果小一個數量級」）。清單 D 寫「SI Appendix 未取」，這次已取並讀完。其他目錄另有三份同一篇的檔（`q4-time/kizilcec2020-pnas-scaling.md`、`q1-learner/kizilcec2020pnas_PMC7334459.txt`、清單 E 提到的作者稿 `kizilcec2020.txt`），我沒有讀那三份，也沒有比對作者稿與刊出版的差異。

**利益關係**：「The authors declare no competing interest.」經費：NSF 1646978、Stanford Interdisciplinary Graduate Fellowship、Microsoft Faculty Fellowship。被放大的三個介入的原始研究（Ref. 12–14）都是本文作者自己的。

## 研究設計

- **類型**：大規模隨機田野實驗，分四個「wave」，每個 wave 各自預先註冊假說與分析程式（https://osf.io/9bacu/），wave 之間做事後探索再修改下一輪的註冊。作者定位為 NSF／IES 準則下的 scale-up 研究（正文導言末段）。
- **場域**：Harvard、MIT（edX）與 Stanford（Open edX）在 2016 年 9 月到 2019 年 5 月開的幾乎所有 MOOC。SI 的 Methods Overview 寫選課期間到「June 2019」，與正文的「May 2019」差一個月（SI L44–45）。
- **樣本**：焦點樣本 269,169 人、247 門課。第一年（wave 1–2，2016-09 到 2017-12）153 門課、199,517 人；第二年（wave 3–4，2018-01 到 2019-05）94 門課、69,652 人。課程領域：人文 22%、社會科學 40%、STEM 29%、電腦科學 9%；每門課被分派人數 102 到 16,645；完成率 1% 到 65%（Materials and Methods）。
- **介入怎麼送到學生面前**：嵌在課程開頭的問卷裡（SI Fig. S1：課程第一頁的「Entrance Survey」區塊，點連結進 Qualtrics）。學生先答人口與目標題，**在問卷後段才隨機分派**，然後看到介入活動或什麼都沒有（控制組）。
- **五種介入**（全部是幾分鐘的寫作活動，全文在 SI 第 22–27 頁）：
  1. 長期計畫（plan-making, long）：寫下整門課何時、何地、怎麼完成功課。
  2. 短期計畫（short plans）：只計畫第一週。只在第一年。
  3. 價值關聯（value-relevance）：勾選 2–3 個重要價值，寫修這門課如何反映這些價值；第一年版本還要寫一段給未來自己的話，第二年簡化。
  4. MCII（心智對比加執行意圖）：寫目標的好處、障礙、「如果…我就…」計畫。只在第二年。
  5. 社會問責（social accountability）：寫下誰可以盯你、要跟他們說什麼、何時說。只在第二年，之前沒在線上課測過。
- **分派**：第一年 2×3 因子設計（價值關聯有無 × 計畫 無／短／長），依四個自陳變項分層隨機；第二年改為每人一種介入或無，完全隨機。平衡檢查：第一年 42 個比較的絕對標準化差最大 0.011 SD；第二年 35 個比較最大 0.024 SD（SI L90–99、L164–168）。
- **分析**：**意向處理（intent-to-treat）**，不論學生有沒有真的寫（SI L71–80）。最終規格：OLS、課程固定效果、異質變異穩健標準誤、個人層級共變項。子群假說只在該子群內配適模型。
- **成果量數**：
  - 主要：課程完成（拿到及格成績，二元）。edX 改制後免費學生拿不到證書，作者用追蹤紀錄把同一門檻套到未付費學生身上（SI L194–209）。
  - 替代指標：第 1 週（第 2–8 天）與第 2 週（第 9–16 天）的平台事件數取對數。作者原本想用「看了幾成影片或做了幾成作業」，因為課程結構差異太大而放棄（正文 Materials and Methods；SI L210–268）。第一週活動與期末成績的相關：r = .418（第 1 週）、.512（第 2 週）、.550（第 3 週）（SI L255–258，wave 1 焦點樣本，觀察性）。
- **排除**（SI Participants）：沒走到隨機分派的人；分派人數不到 100 或完成率不到 1% 的課（第一年排除 15 門、第二年 20 門）；重複曝露者只留第一次；第二年另外排除在介入前的開放題「課程目標」寫不到 4 個字元的人（用來篩掉可能不會寫的人）。

## 結果（逐項）

位置寫法：正文段落以小節名標示；SI 以 `kizilcec2020_si.txt` 行號（L）標示。pp＝百分點。

### 一、參與漏斗（SI Table S1，對過 PDF 第 16 頁）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 1 | 247 門課的總註冊人數 | 3,546,206 | Table S1，All 列 | 表列 |
| 2 | 進入問卷（至少一筆互動） | 432,164（第一年 318,485；第二年 113,679）。佔註冊人數 12.2%（比例是我算的，原文沒寫） | Table S1 | 表列 |
| 3 | 走到隨機分派 | 312,221（第一年 224,414；第二年 87,807）。佔進入問卷者 72.2%（我算的） | Table S1 | SI L296–299「many students did not progress far enough in the survey to be randomized into an intervention group.」 |
| 4 | 焦點樣本 | 269,169；Table S3 圖說：進入問卷者有 62.6%（第一年）與 61.3%（第二年）在焦點樣本內 | Table S1、S3 | 表列 |
| 5 | 完成課程人數（全體註冊者） | 99,197，佔註冊 2.8%（我算的）；焦點樣本完成率各 wave 為 15.2%、13.4%、13.8%、12.0%（Table S2，對過 PDF 第 17 頁） | Table S1、S2 | 表列 |
| 6 | **被分派到介入的人有相當比例完全沒做** | 第一年焦點樣本中看到計畫介入的人，**14% 什麼都沒寫**；其他介入的未作答比例原文沒給 | SI L71–74、L343–349 | 「a substantial fraction of students assigned to treatment did not engage with the interventions at all - either skipping the writing prompt entirely, or else abandoning the course survey to explore the rest of the course.」「14% of students in the focal sample who saw a planning intervention in Year 1 wrote nothing.」 |
| 7 | 不開問卷的人多半也不太上課 | 無數字（引 Reich 2014） | SI L294–296 | 「Many students do not open the survey, but prior work shows that most of these students also do not engage much in the course」 |
| 8 | 焦點樣本的早期活動 | 第一週有活動：43.1%、33.3%、35.3%、35.8%（wave 1–4）；第二週：33.5%、22.8%、23.5%、26.9% | Table S2 | 表列 |
| 9 | 焦點樣本的背景 | 學士學位 71.6%–77.7%；平均年齡 32.4–35.2；低 HDI 國家 20.1%–27.0%；自陳英語流利 49.7%–55.4%；過去完成 MOOC 數平均 1.64–2.18 | Table S2 | 表列 |

### 二、主要假說（先前的效果能否複製）：全部沒有複製

對照條件一律是同課程內沒有介入活動的控制組；成果是課程完成率。

| # | 介入與子群 | 先前結果（Table 1，對過 PDF 第 4 頁） | 本研究結果 | 位置 |
|---|---|---|---|---|
| 10 | 長期計畫；有決心且英語流利的學生 | β = 3.9 pp，χ²(1) = 5.2，P = 0.023，n = 2,053（3 門課）；正文另述為完成率 14% → 18%，增加 29% | 第一年 β = 0.19 pp，95% CI [−0.69, 1.07]，t = 0.43，P = 0.670，n = 26,586；第二年 β = −0.23 pp，[−1.61, 1.14]，t = −0.33，P = 0.741，n = 10,372 | Results 首段、Table 1 |
| 11 | MCII；個人主義國家的學生 | Study 1：β = 1.8 pp，z = 2.35，P = 0.019，n = 4,628；Study 2：β = 3.9 pp，z = 2.41，P = 0.016，n = 3,248；正文另述為 26% → 30% 與 5.5% → 7.3% | 第二年 β = 0.25 pp，[−0.87, 1.37]，t = 0.44，P = 0.662，n = 12,879 | 同上 |
| 12 | 社會問責；非個人主義國家的學生 | 無（之前沒測過） | 第二年 β = 0.89 pp，[−0.22, 1.99]，t = 1.58，P = 0.115 | Results 首段 |
| 13 | 價值關聯；較低度發展國家的學生，**所有課程** | 先前兩門課（n = 3,451）把發展中國家學生的完成率從 17% 提高到 41%；已開發國家學生在其中一門課從 32% 降到 23% | 第一年 β = 0.14 pp，[−0.753, 1.03]，t = 0.30，P = 0.764；第二年 β = −0.04 pp，[−1.37, 1.30]，t = −0.05，P = 0.957 | Results 首段；先前結果見 Interventions and Prior Results |

原文一句：「Overall, we did not find new evidence for our original large- to medium-sized effects.」

### 三、反覆修正後找到的兩個較小效果

**（一）計畫類介入提高前一兩週的活動量，但不影響完成率**（小節 Planning Supports Short-Term Persistence；成果是事件數取對數）

| # | 時間 | 介入 | 數字 |
|---|---|---|---|
| 14 | 第一年第 1 週 | 短期計畫 | β = 0.0437，[0.0066, 0.0808]，t = 2.31，P = 0.021 |
| 15 | 第一年第 1 週 | 長期計畫 | β = 0.0336，[−0.0033, 0.0706]，t = 1.79，P = 0.074（不顯著） |
| 16 | 第二年第 1 週 | 長期計畫 | β = 0.1057，[0.0496, 0.1619]，t = 3.69，P < 0.001 |
| 17 | 第二年第 1 週 | MCII | β = 0.0603，[0.0039, 0.1167]，t = 2.10，P = 0.036 |
| 18 | 第二年第 1 週 | 社會問責 | β = 0.0788，[0.0225, 0.1351]，t = 2.74，P = 0.006 |
| 19 | 第一年第 2 週 | 短期計畫 | β = 0.0257，[−0.0110, 0.0624]，t = 1.37，P = 0.169（不顯著） |
| 20 | 第一年第 2 週 | 長期計畫 | β = 0.0493，[0.0127, 0.0859]，t = 2.64，P = 0.008 |
| 21 | 第二年第 2 週 | 長期計畫 | β = 0.0685，[0.0134, 0.1236]，t = 2.44，P = 0.015 |
| 22 | 第二年第 2 週 | MCII | β = 0.0099，[−0.0451, 0.0649]，t = 0.35，P = 0.724（不顯著） |
| 23 | 第二年第 2 週 | 社會問責 | β = 0.0939，[0.0387, 0.1491]，t = 3.34，P < 0.001（唯一持續的） |

原文一句：「the effects of our plan-making interventions attenuated after 1 to 2 wk, and were not detectable in the final course completion rates.」作者把這與一次性行為（投票、看醫生）對比：「planning prompts may be unreliable for more complex goals」。

注意：正文說效果在第 2 週「attenuated」，但 #20、#21 的長期計畫在第 2 週仍顯著，第一年的係數還比第 1 週大（0.0493 對 0.0336）。「衰減」只對短期計畫與 MCII 成立。這個替代指標是在研究過程中發展出來的（「developed … in our iterative research process」），wave 2 註冊的是二元的「活躍日」定義，wave 4 才改成對數事件數；作者說兩種定義結果一致（SI L259–268）。

**（二）價值關聯介入只在「有全球落差」的課程裡幫到較低度發展國家的學生**（小節 Value-Relevance…；全球落差定義為控制組中低度發展國家學生完成率比高度發展國家低 0.2 SD 以上；HDI 以 0.7 為界）

| # | 課程 | 學生 | 數字 |
|---|---|---|---|
| 24 | 有落差 | 低度發展國家 | 第一年 +2.79 pp，[1.30, 4.27]，t = 3.68，P < 0.001，n = 5,974；第二年 +2.74 pp，[0.32, 5.17]，t = 2.22，P = 0.026，n = 2,712 |
| 25 | **無落差或落差反向**（事後分析） | 低度發展國家 | **第一年 −1.62 pp，[−2.73, −0.27]，t = −2.86，P = 0.004；第二年 −1.71 pp，[−3.27, −0.16]，t = −2.16，P = 0.031（介入反而降低完成率）** |
| 26 | 有落差 | 高度發展國家 | 第一年 0.45 pp，[−0.52, 1.43]，P = 0.363；第二年 −0.62 pp，[−2.46, 1.22]，P = 0.509（無效果） |
| 27 | 無落差 | 高度發展國家 | 第一年 −0.08 pp，[−0.83, 0.67]，P = 0.835；第二年 0.94 pp，[−0.01, 1.89]，t = 1.95，P = 0.051 |

- 與先前研究比較，作者的話：「The effect of the intervention is significant but an order-of-magnitude smaller than in our prior study (Table 1)」。Table 1 的先前數字：Study 1 β = 3.4 個課程活動（不是完成率），n = 227；Study 2 β = 24 pp，n = 64。所以「小一個數量級」是 24 pp 對 2.79 pp，而先前那個 24 pp 來自 **n = 64**。
- 「有落差」這個條件在第一年是事後才定義的，第二年才寫進註冊（「We therefore refined our hypothesis … in the second year」）。作者在下一段自己提醒：「The post hoc determination of which courses present a global gap may also contribute to this unexpected pattern of results.」
- #25 第一年的信賴區間 [−2.73, −0.27] 相對點估計 −1.62 不對稱（XML 與 PDF 都這樣印），可能是印刷錯誤，不確定。

**探索性分析**：同一子群（有落差課程裡的低度發展國家學生）對其他介入也有反應——第一年短期計畫 +2.44 pp（[0.96, 3.92]，P = 0.001）、長期計畫 +2.74 pp（[1.27, 4.22]，P < 0.001）、第二年 MCII +2.76 pp（[0.35, 5.18]，P = 0.025）；但第二年的計畫（+1.06 pp，[−1.33, 3.44]，P = 0.386）與社會問責（+1.23 pp，[−1.16, 3.62]，P = 0.314）沒有複製。作者的兩種解讀：共同機制是「自我反思的寫作」，或這群學生對各種支持都有反應。

### 四、預測與個人化

| # | 結果 | 數字 | 位置 |
|---|---|---|---|
| 28 | 一門課會不會有全球落差無法事先預測 | 與學校、領域等特徵無關；79 門重開的課中，落差有無與前一次一致的只有 60.8% | Forecasting 小節 |
| 29 | 隨機森林模型（21 個課程特徵，第一年 153 門訓練、第二年 94 門測試） | 準確率 54.3%（95% CI [44.1, 64.4]），隨機猜 50.0%（[39.8, 60.2]）；SI 寫的是 11 個模型的中位數 0.54 | Forecasting 小節；SI L455–468 |
| 30 | 個人化分派政策（三種機器學習方法，第一年訓練、第二年評估） | 最佳政策估計完成率 13.38%（[12.79, 13.98]）；無介入 12.81%（[12.23, 13.39]）；差異不顯著 | Forecasting 小節；SI Table S6（對過 PDF 第 21 頁） |
| 31 | Table S6 全表（重要性加權估計） | 無介入 12.81%（SE 0.30%）；計畫 13.28%（0.30%）；價值關聯 13.08%（0.30%）；隨機介入 13.06%（0.16%）；最佳化政策 DM 13.23%（0.24%）、IS 13.28%（0.30%）、DR 13.38%（0.30%） | SI Table S6 |

原文一句：「To realize the potential benefit of personalized policies for students, the field will require more effective interventions」。

### 五、作者的結論句

- 摘要：「Scaling behavioral science interventions across various online learning contexts can reduce their average effectiveness by an order-of-magnitude.」
- Significance：「adequately supporting diverse students will require more than a light-touch intervention.」
- 討論：「behavioral insights have more promise in encouraging one-time, short-lived actions than more continuous behaviors that require sustained effort and habit change.」
- 討論：作者收回先前的建議——「In our original studies, we recommended that policymakers and online instructors consider employing the tested behavioral interventions in their own MOOCs; we now conclude that further research is necessary to predict in advance when these interventions will help」。

## 作者自己列的限制

- **樣本是有填問卷的人**：「The population of students who complete surveys in MOOCs is exceptionally diverse along certain dimensions, but may not capture aspects of other populations of interest: For example, less engaged students or those in other educational settings. As such, we believe caution is warranted in applying our findings beyond motivated and self-directed students in open-enrollment courses.」（討論第二段）
- 先前研究與本研究在介入說明文字與排除準則上有若干差異（Table 1 註）。SI 具體寫了：第二年縮短問卷、簡化價值關聯活動、刪掉短期計畫、子群定義逐 wave 改動（例如計畫介入的子群從「有決心且英語流利」→「英語流利」→ 整個焦點樣本）。
- 全球落差是事後才能判定的課程特徵，事後歸類可能造成結果型態（見 #24 下的引文）。
- wave 1 的混合模型估計有缺陷（最佳化不收斂、標準誤不可靠），wave 2 起改用固定效果加群聚穩健標準誤（SI L378–392）。
- 介入採用率低於預期：各課放問卷連結的方式不同、問卷中途流失比預期多（SI L152–156）。
- 完整原始資料不公開；去識別資料與程式在 OSF／Harvard Dataverse。

我讀完的觀察（作者沒有列）：

- 意向處理估計把沒寫的人算在介入組裡。正文沒有報告「真的寫了的人」的效果（例如 CACE），所以這篇回答的是「把這個活動放進課裡」的效果，不是「做了這個活動」的效果。
- 分母是走到問卷後段的人（註冊者的約 8.8%，312,221 ÷ 3,546,206，我算的），結論不能推到其餘九成。
- 四個 wave 的成果定義、排除準則、模型都改過；正文報告的是最後一版註冊的規格套回全部資料。子群檢定很多，正文沒有提多重比較校正。

## 與摘要說法不一致的地方

- 摘要「one-quarter million students, from nearly every country, across 247 online courses」與正文 n = 269,169、247 門課相符。
- 摘要「Self-regulation interventions raised student engagement in the first few weeks but not final completion rates」：正文的活動量數字只有第 1、2 週（Fig. 1 畫到第 3 週，SI 提到第 3 週的相關係數，但第 3 週的處理效果正文沒有數字）。「first few weeks」比資料寬一點。
- 摘要「can reduce their average effectiveness by an order-of-magnitude」：正文只對價值關聯介入用了「order-of-magnitude smaller」這個說法（24 pp 對 2.79 pp，且限於有落差的課）。計畫與 MCII 的情況是效果不顯著（3.9 pp → 0.19 與 −0.23 pp；1.8／3.9 pp → 0.25 pp），不是「剩十分之一」。摘要把兩種情況合成一句。
- 正文寫隨機分派介入的估計完成率是 13.08%（[12.74, 13.38]）；SI Table S6 的「Random intervention」是 13.06%（SE 0.16%），13.08% 是「Value-relevance intervention」那一列。兩處差 0.02 個百分點，可能是正文抄錯列，不確定。
- 選課期間：正文「to May 2019」，SI Methods Overview「to June 2019」（SI 後文又寫 wave 3–4 是 1/2018–5/2019）。
- 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

**清單 B（order 10）：「10-b 的背景（大規模無效果：輕量介入搬到 247 門課後沒有先前的效果）」**

- 「沒有先前的效果」撐得住：四個主要假說全部不顯著（#10–13）。
- 「大規模無效果」要改寫，原文不是全無效果：(a) 計畫類介入提高了第 1 週（部分到第 2 週）的活動量；(b) 價值關聯在有落差的課幫了低度發展國家學生約 2.8 pp，兩年都複製；(c) **在沒有落差的課反而降低完成率約 1.6–1.7 pp**。比較準的說法是「先前的效果沒有複製；剩下的效果小、短、看情境，還有一處反向」。
- **這篇的介入不是測驗或練習題**，是課程開頭問卷裡的計畫與價值寫作。把它放在 10-b（「另外跳出、可略過的提示，少數人會碰，對成績無效」）底下只能當類比背景，不能當成可略過測驗提示無效的證據。
- **這篇對 order 10 最直接有用的反而是 SI 的漏斗數字**（#1–#8），清單沒有列：註冊者約 12% 進入課程開頭的問卷，其中約 72% 走到問卷後段；看到計畫寫作提示的人有 14% 一個字沒寫。這是「放在課程開頭、可略過的活動有多少人做」的大樣本資料，但要註明問卷位置與宣傳方式各課不同（SI L154–156），而且比例是我從 Table S1 算的。

**清單 D（order 19）：「輕量介入放大後效果剩十分之一或消失」**

- 方向撐得住，但「十分之一」只適用價值關聯介入、限於有落差的課、且比較基準是先前 n = 64 的 24 pp；「消失」適用計畫（完成率）、MCII、價值關聯（全部課程）。寫的時候要分開講，並補上反向結果（#25）與短期活動量的正向結果（#14–23）。

**清單 E（order 26）：「小實驗放大後效果小一個數量級」**

- 這是摘要的原話，但見上：正文裡這句話只對應價值關聯一項。而且先前研究的樣本並不都小（MCII 先前兩個研究 n = 4,628 與 3,248；計畫 n = 2,053），「小實驗」只對價值關聯的先前研究（n = 227、n = 64）說得通。建議改成「在少數幾門課得到的效果，放到 247 門課後多數沒有複製，唯一複製的一項約為原來的十分之一」。

**三份清單都沒提、但引用時必須帶上的條件**：樣本是自願填問卷、七成以上有學士學位、平均 33 歲左右的 MOOC 學習者；作者自己說不要推到較不投入的學生或其他教育情境。

## 讀取紀錄

- 正文：XML 去標籤後的純文字共 234 行，依序讀完 L1–234（作者與單位、Significance、摘要、導言 4 段、Interventions and Prior Results 5 段、Results 首 2 段、Planning 小節 3 段含 Fig. 1 圖說、Value-Relevance 小節 4 段含 Table 1 與 Fig. 2 圖說、Forecasting 小節 2 段、Discussion 4 段、Materials and Methods 3 段、Data／Code Availability、致謝、註腳、參考文獻 36 條全部讀過）。XML 裡有兩個 `table-wrap` 與兩個 `supplementary-material` 標籤，是 PMC 的重複區塊，實際只有 Table 1 一張表、一份 SI。
- SI：`kizilcec2020_si.txt` L1–619（方法總覽、介入、量數、受試者、迴歸規格、子群分析、落差預測、個人化政策、Fig. S1–S2 圖說、Table S1 圖說）；L619–1744（Table S1–S6、五種介入的完整說明文字、補充參考文獻 17 條）。個人化政策一節的三條公式在 txt 裡是空白（公式為圖片），沒有另外看 PDF 的公式。
- 對過 PDF 版面的表：正文 Table 1（刊出版 PDF 第 4 頁，同頁的 Fig. 2 也看了，第 3 頁的統計數字段落一併對過）；SI Table S1（第 16 頁）、S2（第 17 頁）、S3（第 18 頁）、S6（第 21 頁）。**SI Table S4、S5（基準模型係數，第 19–20 頁）只讀了 txt 的拆散版，沒有對 PDF**；紀錄裡沒有引這兩張表的數字。
- Fig. 1 只讀了圖說，沒有看圖；Fig. S1、S2 只讀圖說。

## 2026-10-14 抽查後更正

- 第 9 項：學士學位比例的下限由 73.6% 改為 71.6%。回 SI Appendix 第 17 頁 Table S2 的版面（PDF 轉成影像看過）：「% Bachelor's Degree」四波是 73.6%、71.6%、77.5%、77.7%，最低的是 Wave 2 的 71.6%；原先誤把 Wave 1 當下限。同一項其餘四個範圍（年齡 32.4–35.2、低 HDI 20.1%–27.0%、英語流利 49.7%–55.4%、過去完成 MOOC 數 1.64–2.18）對同一張表重看過，沒有錯。
