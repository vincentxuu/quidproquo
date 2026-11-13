# 抽取紀錄：Ecker、Sharkey、Swire-Thompson 2023，PLOS ONE 18(4): e0281140

書目：Ullrich K. H. Ecker、Caitlin X. M. Sharkey、Briony Swire-Thompson（2023）。Correcting vaccine misinformation: A failure to replicate familiarity or fear-driven backfire effects. *PLOS ONE* 18(4): e0281140。DOI 10.1371/journal.pone.0281140。收稿 2022-03-12、接受 2023-01-03、刊出 2023-04-12。作者全名與單位對過首頁（L7–11）：Ecker 與 Sharkey 在 University of Western Australia；Swire-Thompson 在 Northeastern University 與 Harvard University。
原文檔：`.research/raw/learning-content/q1-learner/ecker2023_plos.txt`（1,798 行、77,296 位元組；不帶 `-layout` 的 `pdftotext` 輸出，段落順序正常）；PDF 在同目錄 `ecker2023_plos.pdf`（24 頁）。
讀取日期：2026-10-14
版本：刊出版（開放取用，CC BY）。
供哪幾篇使用：order 13（讀者已經相信錯的東西）。
資料公開：https://osf.io/dwyma/ （L36–37；刺激材料與 S1 File 在這裡，**S1 File 沒有讀**，見讀取紀錄）。

## 研究設計

- **類型**：隨機分派實驗，複製並擴充 Pluviano 等 2017。組間因子「條件」五個水準 × 組內因子「時間」（L208–212）。
- **五個條件**（L242–274）：
  1. **Myths vs. facts**：10 條常見疫苗迷思，各配一條取自世界衛生組織教材的事實；每對一頁，事實緊接在迷思下方。
  2. **Myths only**（本研究新增）：只呈現同樣 10 條迷思，每條明確標成 myth，不給事實。作者說這是最弱的撤回，理論上最容易產生熟悉度反效果（L179–182）。
  3. **Visual correction**：麻疹、腮腺炎、德國麻疹各一張圖，各用 100 個彩色小人表示併發症程度，配簡短文字。
  4. **Fear appeal**：三張未接種而染病兒童的照片，配一段對讀者說話的警告文字與疾病風險條列。
  5. **Control**：兩份與疫苗安全無關的醫療須知（20 條避免醫療疏失的提示、5 步驟更安全就醫）。
- **受試者**（L223–237）：Prolific 招募英國成人便利樣本 440 人；383 人完成兩階段；依事前訂的排除標準剔除 3 人；**最後 N = 380**（男 95、女 283、非二元 2；平均 36.45 歲，SD 11.66，範圍 18–76）。110 人（29%）有六歲以下子女。2021 年 5–6 月線上進行（L307）。知情同意書說明研究與 COVID-19 無關（L318–319）。
- **各組人數**：正文沒有直接寫。Table 4 的百分比可反推（我的推算，不是原文數字）：控制組 70、myths only 79、myths vs. facts 78、visual 72、fear 81，合計 380。
- **檢定力**（L223–232）：事前估計每組至少 64 人可偵測 f = 0.25（α = .05、1−β = .80），目標每組 75 人。作者自己註明效果量「was determined somewhat arbitrarily」，且實際用的是含全部條件、經 Holm-Bonferroni 校正的計畫對比，「which reduced achieved power」。
- **量了什麼**（L275–304）：
  - T0（介入前）：3 題（各依變項 1 題），0–5 分李克特量尺；另測 12 題疫苗態度量表 VAX 與 2 題身分核心性。兩者相乘再標準化成共變項「VAX-ID」。
  - T1（介入後立刻）與 T2（一週後，開放約 48 小時）：21 題，三個依變項各 7 題——(i) 對疫苗副作用的擔憂、(ii) 相信疫苗與自閉症有關、(iii) 接種猶豫。各依變項有 1 題直接取自 Pluviano 等 2017、6 題新增。
  - 各量表信度 Cronbach's α ≥ .87（L347–348；文字檔把「≥」顯示成亂碼）。
- **分析**：三個依變項各做 2（時間）× 5（條件）ANCOVA，共變項 VAX-ID；計畫對比是各實驗條件對控制組，Holm-Bonferroni 校正以「依變項 × 時間點」為一族（每族 4 個對比）（L356–374、Table 1 註）。
- **作者的預測**（L195–205）：不會有反效果；myths only 與 myths vs. facts 在 T1、T2 都會低於控制組；T1 到 T2 會回升一些。

## 結果（逐項）

### 主要分析（全樣本，Table 1，PDF 第 9 頁；已對過版面）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 副作用擔憂：條件主效果 | F(4, 370) = 2.73，p = .029，ηp² = .029；**不放共變項時不顯著**：F(4, 375) = 2.34，p = .055 | 五條件 | Primary analyses | L375–378 | 「note that the effect was nonsignificant in an ANOVA, F(4, 375) = 2.34, p = .055」 |
| 2 | 副作用擔憂：時間主效果、交互作用 | 時間 F(1, 370) = 5.45，p = .020，ηp² = .015（T2 略低）；交互作用 F(4, 370) = 1.44，p = .218 | — | 同上 | L375–379 | 「indicating slightly lower scores at T2 relative to T1」 |
| 3 | 副作用擔憂 T1：myths vs. facts 低於控制組 | F(1, 370) = 13.43，ηp² = .035，p < .001，校正後顯著 | 對控制組 | Table 1 | L415–421 | 「the myths-vs.-facts condition was associated with reduced concern about vaccine side effects at Time 1 relative to control.」（L383–385） |
| 4 | 副作用擔憂 T1：其他三條件 | myths only F = 2.29，p = .131；visual F = 1.86，p = .173；fear F = 3.10，p = .079；都不顯著 | 對控制組 | Table 1 | L407–437 | — |
| 5 | 副作用擔憂 T2：全部校正後不顯著 | myths only F = 4.24，ηp² = .011，p = .040；myths vs. facts F = 5.71，ηp² = .015，p = .017；visual F = 1.02，p = .313；fear F = 2.11，p = .147 | 對控制組 | Table 1 | L439–470 | 表註：「one could also argue that correction should instead control only for the dual tests across timepoints (i.e., family size 2)… This would result in some non-significant contrasts becoming significant.」（L604–608） |
| 6 | 疫苗–自閉症連結：條件主效果 | F(4, 370) = 2.52，p = .041，ηp² = .027；**不放共變項時不顯著**：F(4, 375) = 2.27，p = .061 | 五條件 | Primary analyses | L611–614 | 同 #1 的句型 |
| 7 | 疫苗–自閉症連結：條件 × 時間交互作用 | F(4, 370) = 3.56，p = .007，ηp² = .037 | — | 同上 | L615–616 | — |
| 8 | 疫苗–自閉症連結 T1：myths vs. facts 低於控制組 | F = 6.90，ηp² = .018，p = .009，校正後顯著 | 對控制組 | Table 1 | L481–487 | 「the myths-vs.-facts condition was associated with significantly lower belief in the vaccine-autism link at T1」（L618–619） |
| 9 | 疫苗–自閉症連結 T1：其他三條件 | myths only F = 1.80，p = .180；visual F = 0.13，p = .719；fear F = 0.02，p = .884 | 對控制組 | Table 1 | L473–503 | — |
| 10 | 疫苗–自閉症連結 T2：全部校正後不顯著 | myths only F = 5.85，ηp² = .016，p = .016；myths vs. facts F = 4.99，ηp² = .013，p = .026；visual F = 0.74，p = .392；fear F = 1.07，p = .303 | 對控制組 | Table 1 | L505–536 | — |
| 11 | 接種猶豫：沒有任何條件與控制組有差異 | 8 個對比 F 介於 0.03–1.75，p 介於 .186–.860；條件與時間主效果 F < 1；交互作用 F(4, 370) = 3.51，p = .008 | 對控制組 | Table 1 下段 | L538–602、L633–636 | 「no condition increased or decreased vaccine hesitancy, relative to control」 |
| 12 | 沒有任何條件在任何時間點顯著高於控制組 | — | 對控制組 | Primary analyses | L386–387、L619–620、L635–636 | 「No conditions were associated with elevated concerns relative to control at any time. This indicated that there was no backfire effect in any of the conditions.」 |

方向補充（讀 Fig 1、Fig 2，PDF 第 8、10 頁，目測）：副作用擔憂在 T1、T2 四個實驗條件的平均都低於或接近控制組；疫苗–自閉症連結 T1 的 visual 條件平均略高於控制組（約 1.2 對 1.2 上下，誤差線大幅重疊，對比 F = 0.13）。所有平均都落在 0–5 量尺的 1.6 以下，接種猶豫在 0.7 以下——**樣本的誤信程度本來就低**。

### 補充分析

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 13 | 疫苗態度最高與最低三分位（n = 255）：高疑慮組裡沒有反效果 | 高疑慮組唯一校正後顯著的對比：副作用 T1，myths vs. facts 低於控制組，F(1, 245) = 6.65，ηp² = .026，p = .010。其餘 23 個對比不顯著（p 介於 .066–.959） | 對控制組，限 VAX-ID 最高三分位 | Table 2（PDF 第 13 頁，已對過版面；文字檔把分組標題排到表尾，以 PDF 為準） | L639–677、L720–933 | 「To foreshadow, no backfire effects emerged on any variable (note that exploratory analyses using more extreme groups [e.g., deciles] also found no evidence for backfire).」 |
| 14 | 高疑慮組：對疫苗–自閉症連結沒有任何介入有顯著影響 | myths only T1 F = 3.41，p = .066；myths vs. facts T1 F = 2.94，p = .088 | 同上 | Table 2 中段 | L670–672 | 「indicating no significant impact of any interventions in the top tertile of vaccine-hesitant participants.」 |
| 15 | 有無六歲以下子女不影響介入效果 | 所有含家長身分的主效果與交互作用 F(1/4, 360) ≤ 2.15，p ≥ .074 | 家長 vs. 非家長 | Analyses considering parent status | L678–703 | 「There were no backfire effects in any condition at any timepoint (see S2 Table in S1 File).」 |
| 16 | **只用 Pluviano 等 2017 的單題量尺做直接複製：什麼都不顯著** | 條件主效果 F(3, 297) ≤ 1.38，p ≥ .248；時間 × 條件 F(3, 297) ≤ 1.43，p ≥ .234（去掉 myths only 條件與共變項） | 四條件 | Replication using only Pluviano et al.'s items | L704–710 | 「There were no backfire effects in any condition at any timepoint (see S3 Table in S1 File).」 |
| 17 | 前後測（T0、T1、T2 都有的 3 題合成分數）：時間主效果 | F(2, 740) = 87.20，p < .001，ηp² = .191，分數隨時間下降；條件主效果 F < 1；時間 × 條件 F(8, 740) = 3.35，p = .001，ηp² = .035 | T0 對 T1、T2 | Pre-post analyses | L935–948 | 「indicating a significant decrease over timepoints」 |
| 18 | 基準線各組沒有差異 | F < 1 | 五條件，T0 | 同上 | L939–941 | — |
| 19 | **控制組自己也下降** | 控制組 T1 對 T0：F(1, 375) = 10.70，ηp² = .028，p = .001；T2 對 T0：F = 23.52，ηp² = .059，p < .001 | 對 T0 | Table 3（PDF 第 17 頁，已對過版面） | L1052–1067、L965–966 | 「Aside from the myths-only condition at T1, all T1 and T2 scores were significantly lower than the T0 baseline, including the control condition.」 |
| 20 | Myths only：T1 校正後不顯著，T2 顯著低於基準線 | T1 F = 4.11，ηp² = .011，p = .043（未過校正）；T2 F = 16.35，ηp² = .042，p < .001 | 對 T0 | Table 3 | L1069–1083 | — |
| 21 | Myths vs. facts：下降最大 | T1 F = 74.24，ηp² = .165；T2 F = 58.97，ηp² = .136；皆 p < .001 | 對 T0 | Table 3 | L1085–1099 | — |
| 22 | Visual、Fear | visual T1 F = 9.41（p = .002）、T2 F = 15.70；fear T1 F = 12.67、T2 F = 25.89；皆校正後顯著 | 對 T0 | Table 3 | L1101–1131 | — |
| 23 | 前後測分數再對控制組比：myths vs. facts 只有 T1 較低 | T1：F(1, 375) = 12.61，p < .001，ηp² = .033；**T2 不顯著**：F(1, 375) = 3.10，p = .079，ηp² = .008 | 對控制組 | Pre-post analyses | L966–968 | 「only the myths-vs.-facts condition was associated with lower concern at T1… but not T2」 |
| 24 | **個人層次**：誤信在數值上上升（作者在表頭稱 Backfire）的人數比例 | 控制組 T1 20.00%、T2 10.00%；myths only 20.25%、16.46%；myths vs. facts 5.13%、11.54%；visual 19.44%、18.06%；fear 14.81%、14.81% | 相對於各人自己的 T0 | Table 4（PDF 第 17 頁，已對過版面） | L1152–1248 | 「We finally examined the proportion of participants with numerically decreased misperceptions (corrective change), increased misperceptions (backfire), or no change post intervention.」（L969–970） |
| 25 | 同表：數值上下降（Corrective）的比例 | 控制組 54.29%、65.71%；myths only 43.04%、55.70%；myths vs. facts 65.38%、66.67%；visual 52.78%、58.33%；fear 55.56%、62.96%（T1、T2） | 同上 | Table 4 | 同上 | — |
| 26 | 同表：沒變的比例 | 控制組 25.71%、24.29%；myths only 36.71%、27.85%；myths vs. facts 29.49%、21.79%；visual 27.78%、23.61%；fear 29.63%、22.22% | 同上 | Table 4 | 同上 | — |

Table 4 正文沒有做任何統計檢定，也沒有進一步討論，只在討論段用來說 fear 條件沒有雙峰分布（L1262–1265：「the backfire rate of approximately 15% was comparable to other conditions」）。要留意：**沒有接受任何更正的控制組也有 20%（T1）的人分數上升**，所以這個比例反映的主要是 3 題量尺的重測波動，不是更正造成的反效果。

### 作者的解讀（討論段，不是數據）

| # | 說法 | 行號 | 原文一句 |
|---|---|---|---|
| 27 | 只標「這是迷思」而不給事實（myths only）相對控制組沒有顯著效果，但也沒有反效果；作者認為這是反對熟悉度反效果的有力證據 | L1030–1033 | 「Despite the myths-only condition theoretically being the one most likely to cause a familiarity-driven backfire effect, though, no such effect was observed; this is particularly strong evidence against the notion of familiarity backfire.」 |
| 28 | myths vs. facts 有效，可能是因為提供了清楚而詳細的替代資訊 | L1025–1029 | 「It has been suggested that provision of alternative, factual information is the most important ingredient of a successful correction」 |
| 29 | 介入相對控制組的效果普遍偏低，最可能與控制組受需求特徵影響有關 | L1265–1266 | 「is most likely associated with demand characteristics affecting responses in the control group.」 |
| 30 | 對更正時重提錯誤資訊的顧慮大致沒有必要，重提甚至可能有益 | L1309–1312 | 「the hesitancy surrounding repetition of misinformation during correction is largely unwarranted. In light of the broader literature, the repetition of misinformation within a correction may actually be beneficial rather than harmful.」 |
| 31 | **但書**：不必要的重複仍應避免；有些錯誤資訊根本不該去更正 | L1314–1317 | 「However, unnecessary repetition of misinformation should still be avoided as there is a risk that it will enhance familiarity without any added benefit [8, 31, 32]. Moreover, there will be situations in which misinformation should not be corrected at all, to avoid amplifying a disinformant and adopting their framing of an issue, or where the misinformation has little traction and thus presents low risk of harm」 |
| 32 | 為什麼與 Pluviano 等 2017 不同：(1) 2016 年與義大利樣本可能疑慮較高，原結果可能是世界觀造成；(2) 原研究用單題量尺、樣本小（N = 120），可能只是偽陽性 | L1286–1308 | 「to the best of our knowledge, all backfire effects reported with vaccine-related stimuli have been elicited using single-item measures [23, 33]. Thus, Pluviano et al.'s finding may have simply been a false-positive」 |
| 33 | 更正格式的重要性有限 | L1272–1274 | 「in general it is more important that a myth is corrected than what specific format is used」 |
| 34 | 前言對新穎錯誤資訊的說法：有人主張熟悉度反效果主要出現在讀者從沒聽過的錯誤說法上，但證據「mixed at best」 | L118–120 | 「Some have argued that familiarity backfire effects are mainly a concern with novel misinformation, because a correction may then introduce a person to a false claim they have never encountered before… However, evidence for this is also mixed at best [31–33].」 |

## 作者自己列的限制

- 檢定力不足以偵測小效果；有些不顯著的效果落在 .01 < ηp² < .02，檢定力更高時可能顯著（L1021–1024、L1260–1261）。
- 線上樣本，對兒童疫苗的疑慮偏低（L1318–1320）。作者認為對熟悉度效果影響不大，因為熟悉度效果應與態度無關。
- 只量接種意願，沒有量實際接種行為（L1325–1329）。
- 有些條件的介入材料與量測不對應（例：恐懼訴求沒有談自閉症），因為是直接複製而無法調整，可能威脅內部效度；各條件受需求特徵的影響未必相同（L1329–1336）。
- 控制組誤信程度低，其實會讓反效果更容易被觀察到（量尺上方還有空間）（L1267–1269）——作者把這一點當成支持結論的理由，不是限制。
- 效果量的事前設定「somewhat arbitrarily」（L225）。

## 與摘要說法不一致的地方

逐項對過，有三處摘要比正文寬：

1. 摘要：「We found that the myths vs. facts condition reduced vaccine misconceptions.」（L63）沒有寫時間點。正文：相對控制組，校正後只有 **T1** 顯著（#3、#8）；T2 兩個依變項 p = .017 與 .026，在事前訂的校正方式下都不顯著（#5、#10）；前後測分數對控制組比，T2 也不顯著（#23，p = .079）。相對自己的基準線則 T1、T2 都顯著（#21）。
2. 摘要：「None of the conditions increased vaccine misconceptions relative to control at either timepoint, or relative to a pre-intervention baseline」（L63–64）說的是各組平均。個人層次上，每個條件都有 5%–20% 的人分數在數值上上升（Table 4），正文表頭就把這一欄叫 Backfire。摘要沒有提這張表。
3. 討論段（不是摘要）有一句與結果段不完全對得上：L1020 說 myths vs. facts 是唯一「led to a significantly stronger reduction than control, without belief regression back to baseline after a week」。前半句在 T2 不成立（#23）；後半句（沒有回到基準線）成立。

另外，摘要沒有提接種猶豫完全沒有被任何介入改變（#11），正文與討論都有寫。

## 與清單「要撐的結論」不合的地方

清單寫：「『提起誤解會讓它更熟悉、更被相信』沒有複製出來。反向／無效（對 #3 的事後解釋而言）」。

- 核心說法撐得住：五個條件、兩個時間點、三個依變項、高疑慮子樣本、家長子樣本、原版單題量尺，都沒有任何一組平均顯著高於控制組或自己的基準線。
- 要補上的範圍限制，文章引用時不能省：
  1. **領域不同**。受試者是英國成人，讀的是 10 條疫苗迷思（公衛宣導格式），量的是信念與接種意願，不是學習成果。這不是教學文、不是概念學習，也沒有測理解或遷移。拿它來談「教學文的常見誤解段落會不會把誤解種進去」是跨領域類推。
  2. **受試者多半本來就聽過這些迷思**。前言明說熟悉度反效果最被擔心的情況是讀者從沒聽過的錯誤說法，而那方面的證據「mixed at best」（#34）。本研究沒有操弄讀者是否先聽過迷思，所以**沒有回答「對原本沒有這個誤解的人提起誤解會怎樣」**——而清單裡 #3（Dersch 等 2026）的事後解釋談的正是這群人。把本篇當成對 #3 的反證，只能反到「熟悉度機制在這個樣本沒出現」，反不到「對沒有誤解的讀者無害」。
  3. **是「沒有顯著差異」，不是「證明沒有」**。作者自己說檢定力不足以偵測小效果。
  4. 一週後，連 myths vs. facts 相對控制組的優勢在校正後也不顯著；只標「這是迷思」不給事實的條件從頭到尾相對控制組都不顯著。「提起並更正有用」的證據在本篇只限立即測量。
  5. 作者自己保留了但書：不必要的重複仍應避免、沒什麼人信的錯誤說法不必去更正（#31）。只引「重提無害」會漏掉這一句。
- 個人層次有 5%–20% 的人分數上升，但控制組也是 10%–20%，所以這不能拿來當反效果的證據，也不能拿來和清單 #3 的「12.5% 後測更差」直接對比（量尺、題數、基準都不同）。

## 讀取紀錄

依序讀完 `ecker2023_plos.txt` 全檔：

- L1–67：標題頁、作者與單位、出版資訊、摘要。
- L69–205：前言、The present study。
- L207–339：方法（受試者、材料五條件、量測、程序）。
- L341–636：結果——排除與信度、主要分析、Table 1。
- L638–970：補充分析（疫苗態度、家長身分、原版題目、前後測）、Table 2。
- L972–1336：討論（含 Table 3、Table 4）與限制。
- L1338–1376：結論、支援資訊、致謝、作者貢獻。
- L1378–1798：參考文獻 73 條，掃過。

對過 PDF 版面的表：Table 1（第 9 頁，另直接看過頁面影像）、Table 2（第 13 頁）、Table 3 與 Table 4（第 17 頁）。做法是 `pdftotext -layout` 單頁輸出逐列比對；文字檔裡 Table 2–4 的分組標題被排到表尾，數字順序本身沒有錯。Fig 1–3（第 8、10、11 頁）與 Fig 7（第 16 頁）看過頁面影像；Fig 4–6（第 12、14、15 頁）沒有看圖，只讀了圖說與正文敘述。

沒有讀的東西：S1 File（補充檔，在 OSF；內含 10 對迷思與事實的全文 S1 Table、家長子樣本的 S2 Table、原版題目分析的 S3 Table）。正文引用到 S2、S3 的地方只有「沒有反效果」一句結論，具體數字我沒有看到。
