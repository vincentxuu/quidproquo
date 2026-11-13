# 抽取紀錄：Wang、Ribeiro、Robinson、Loeb、Demszky，〈Tutor CoPilot: A Human-AI Approach for Scaling Real-Time Expertise〉，arXiv:2410.03017v2

## 檔頭

- **完整書目**：Rose E. Wang、Ana T. Ribeiro、Carly D. Robinson、Susanna Loeb、Dora Demszky（後兩位標「Equal advising」）。〈Tutor CoPilot: A Human-AI Approach for Scaling Real-Time Expertise〉。arXiv:2410.03017，**第 2 版，版面日期 2025-01-26**（L9）。作者姓名與順序對過 PDF 首頁；單位只寫 Stanford University。沒有 DOI，沒有期刊或研討會刊登資訊。預先註冊：https://osf.io/8d6ha（L48，沒有打開讀）。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/wang2024tutorcopilot.txt`（1,626 行、122,312 字元，含附錄 A–M）；PDF 同名 `.pdf`，33 頁。單欄版面，段落沒有交錯。
- **讀取日期**：2026-10-14
- **版本**：預印本（arXiv v2），未經同儕審查。清單寫 2024（v1 的年份），手上的檔是 2025 年 1 月的 v2。
- **供哪幾篇用**：order 28（清單 28#8）。
- **清單說附錄是 A–L**；實際是 A–M（M 是成本）。

## 研究設計

- **類型**：隨機對照試驗，預先註冊。**隨機分派的單位是家教，不是學生**（L262）。學生會遇到不同的家教，所以同一個學生可能有些堂次遇到實驗組家教、有些遇到對照組家教。學生怎麼配到家教，原文沒有說明。
- **介入**：Tutor CoPilot 是嵌在線上家教平台裡的一個按鈕。家教按下後，系統把最近 10 則對話、課程主題與選定的策略送給語言模型，回傳幾則「專家會怎麼回」的建議；家教可以編輯、重新產生、或換策略（提供解答、範例、小修正、類似題、簡化題目、肯定正確答案、鼓勵學生）（L191–236）。建議只給家教看，由家教決定要不要送給學生。平台是**文字聊天**加共用白板（L193、L571）。
- **對照**：家教沒有這個按鈕，照常上課（L265）。實驗組家教事前受過工具訓練（投影片加兩兩角色扮演，全體完成約 2–3 週，L922–931）；對照組家教受的是家教公司原有的標準訓練單元（L273–275）。
- **場域**：美國南部一個大型學區與線上家教公司 FEV Tutor 合作的校內線上數學家教。9 所學校（8 所小學、1 所國中，Table 7）。
- **期間**：2024 年 3 月底開始，為期兩個月（L247）。
- **學生**：學區指定 1,787 人（L255），3–8 年級，前一年春天州測驗低於年級水準才有資格（L256–258）。Hispanic 80.5%，經濟弱勢 67%，英語能力有限方案 31%（Table 8，PDF 第 23 頁）。實際有資料的堂次只有 3–6 年級：三年級 676 堂、四年級 1,828、五年級 357、六年級 1,275，七、八年級是 0（Table 7，PDF 第 22 頁）。
- **家教**：全職家教。人數原文有三種寫法（見「內部不一致」）：摘要「900」、內文「874」與「初始分派 900（各 450）」、附錄 Table 3–4 寫對照 450、實驗 429。研究開始時有上課紀錄的是 782 人（實驗 386、對照 396）（L271、Table 4）。平均年資 21–22 個月、品質評分 0.41–0.42（範圍 −1 到 1）、女性 52–56%，兩組平衡（Table 3、5）。
- **每位家教的劑量很小**：研究期間每位家教平均上 5 堂、總時數約 199 分鐘（對照）與 193 分鐘（實驗）（Table 5，PDF 第 20 頁）。
- **分析樣本**：4,136 堂課、55 萬則以上聊天訊息、2,000 次以上的工具使用（L301–303）。排除了兼職家教的堂次（L958–959）。
- **量了什麼**：
  1. **主要結果：exit ticket 通過與否**（堂次層級）。exit ticket 是每堂課快結束時的小測驗，家教不能幫忙（Table 9 的定義，L1227–1231）；通過才能進下一課（L292–298）。屬於當堂、緊接在教學之後的測量。
  2. 參與分數（participation points）、學生課後問卷（5 題，5 點量尺）（Table 2）。
  3. **NWEA MAP 數學與閱讀**（標準化測驗，一年考三次）：研究前的期中分數當基線，研究後的期末分數當結果（L287–289、L952–954）。
  4. 家教用了哪些教學策略：用分類器標註全部訊息（見下）。
  5. 家教研究後問卷（4 題，n = 766）（Table 14）。
  6. 研究結束一週後與約 20 位實驗組家教的訪談（L360–364）。
- **主要模型**（L320–333）：意向治療（ITT）迴歸，堂次層級結果對家教的分派指標，控制學生共變項（性別、族裔、免費與減價午餐、特教、英語能力有限、研究前 MAP 數學分數），加學校 × 年級固定效果；殘差「clustered at the student-tutor pair level」。家教與學生的缺漏共變項有補值（註腳 4，L314–316）。
- **教學策略分類器**（L343–358、附錄 I）：抽 3,000 則家教訊息，先由 GPT-4 依分類表標一輪，再由兩位共同作者檢查修正；微調 RoBERTa-large 做多個二元分類；測試集 F1 在 0.65–0.90。事前訂的門檻是 F1 ≥ 0.60 才納入，因此「explanation of concept」與「provide hint」兩個策略被剔除（L1442–1445）。兩組的差用 z 分數化的 log-odds ratio（Monroe 等 2008 的 Fightin' Words）。

## 結果（逐項）

### RQ1：堂次層級的結果（ITT，Table 2，PDF 第 10 頁逐格對過）

括號內是標準誤。星號是原表的：+ p < 0.1、* p < 0.05、** p < 0.01。

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | Exit ticket 通過（不設條件，沒作答算沒過） | +0.04**（0.01）；對照組平均 0.62；n = 4,136 堂 | 家教被分到可用 Tutor CoPilot vs 不可用 | Table 2 Panel A、§6 RQ1 | L411–413、L426–430 | 「Students working with treatment tutors were 4 percentage points (p.p.) more likely to pass their exit tickets (p< 0.01, 62% → 66% student passing rate from control to treatment).」 |
| 2 | Exit ticket 有作答 | +0.02+（0.01），p < 0.1；對照組 0.84；n = 4,136 | 同上 | Table 2 | L413–414 | 「students were 2 p.p. more likely to attempt the exit ticket (p< 0.1)」 |
| 3 | Exit ticket 通過（以有作答為條件） | +0.03*（0.01）；對照組 0.73；n = 3,521。**表上是一顆星（p < 0.05），內文寫 p < 0.01** | 同上 | Table 2 | L414–415、L426 | 「conditional on their attempt, they were 3 p.p. more likely to pass the exit ticket (p< 0.01)」 |
| 4 | 參與分數 | +0.09（0.27），對照組 14.07；標準化後 +0.01（0.03）。**不顯著** | 同上 | Table 2 | L426–430、L415–451 | 「We found positive estimates of the treatment assignment on the participation points … These estimates are not significant.」 |
| 5 | 學生問卷「家教在乎我理解數學勝過背解法」 | −0.004（0.055），對照組 4.19，n = 1,931。不顯著 | 同上 | Table 2 Panel B | L437–441 | 表列 |
| 6 | 學生問卷「家教在乎我數學學得好不好」 | +0.02（0.05），對照組 4.31，n = 1,931。不顯著 | 同上 | Table 2 Panel B | 同上 | 表列 |
| 7 | 學生問卷「數學難的時候我知道我學得會」 | +0.02（0.06），對照組 4.24，n = 1,931。不顯著 | 同上 | Table 2 Panel B | 同上 | 表列 |
| 8 | 學生對該堂的評分 | −0.002（0.036），對照組 4.77，n = 1,948。不顯著 | 同上 | Table 2 Panel B | 同上 | 表列 |
| 9 | 學生對家教的評分 | +0.03（0.04），對照組 4.74，n = 1,952。不顯著 | 同上 | Table 2 Panel B | 同上 | 表列 |

### 附錄 K：年終測驗（學生層級，Table 12，PDF 第 32 頁逐格對過）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 10 | MAP 數學（基線有補值） | 係數 **−0.35**（SE 0.88），n = 1,001。沒有星號，不顯著 | 自變項是「treatment exposure」＝該生遇到實驗組家教的堂數占他全部堂數的比例（0 到 1） | 附錄 K、Table 12 | L1509–1514、L1560–1562 | 「We find no significant effect on the test scores, though with math scores trending negative and reading scores trending positive.」 |
| 11 | MAP 閱讀（基線有補值） | +1.44（1.45），n = 1,002。不顯著 | 同上 | Table 12 | L1560–1562 | 表列 |
| 12 | MAP 數學（基線沒補值） | **−0.59**（0.86），n = 959。不顯著 | 同上 | Table 12 | 同上 | 表列 |
| 13 | MAP 閱讀（基線沒補值） | +1.56（1.42），n = 959。不顯著 | 同上 | Table 12 | 同上 | 表列 |
| 14 | 曝露量的分布 | 原文說「多數學生曝露量接近零」「變異有限」，並說因此事前就預期年終結果不會顯著。Figure 6 的直方圖（PDF 第 31 頁，目測）：比例為 0 的那一格約 285 人，比例為 1 的約 57 人，其餘散在 0.1–0.85 之間，0.25 與 0.5 附近各有一個約 140 與 100 人的高峰 | — | 附錄 K、Figure 6 | L1516–1519 | 「We find that few students had high exposure to Tutor CoPilot, and overall, there was limited variation in treatment exposure across the student population, with most students showing near-zero exposure. We therefore expected that the impact on end-of-the-year outcomes would not be significant.」 |
| 15 | 作者對不顯著的解釋 | 曝露量變異有限、曝露不足；正文另加「研究只有兩個月」 | — | 附錄 K、§7 | L1549–1551、L553–558 | 「The lack of significance may be attributed to the limited variation in treatment exposure among students and insufficient exposure to the treatment, which likely constrained the potential for detecting an effect.」 |
| 16 | 樣本 | 只含研究期間至少上過一堂家教的學生 | — | 附錄 K | L1511–1514 | 「we removed students from our sample who did not participate in any tutoring sessions during the study period.」 |

附錄 K 的注意事項（我讀的時候的判斷，不是原文的說法）：
- 這個分析的自變項是曝露比例，不是隨機分派的組別。學生沒有被隨機分派（作者在限制一節自己說「Future research would benefit from randomizing students」，L557–558），所以這四個係數不是「有 Tutor CoPilot 對沒有」的實驗比較。原文寫「We instrument treatment exposure as the proportion…」，但表上只有一個迴歸係數，沒有交代第一階段或工具變數是什麼。
- 係數的單位是 MAP 分數的點數（學生期中數學平均 201.4，Table 8）。原文沒有換算成標準差。
- 「most students showing near-zero exposure」與 Figure 6 目測的分布不太一致（零那一格約占三成，不是多數）。圖上沒有印數字，這是目測。
- 附錄內文把這張表叫「Table 9」（L1547），實際是 Table 12。

### 附錄 F：exit ticket 與年終測驗的關聯（Table 6，PDF 第 21 頁對過）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 17 | exit ticket 通過率預測年終數學分數 | 係數 0.06***（0.01）；期中數學分數的係數 0.93***（0.01）；R² = 0.864；n = 959 | 觀察性迴歸，控制期中分數 | 附錄 F、Table 6 | L966–978 | 「We find that the exit ticket passing rate is statistically significant in predicting students' end-of-year test scores, suggesting that improvements in short-term learning outcomes measured by the exit ticket are associated with improvements in long-term academic performance.」 |

這是相關，不是因果；作者用它來說明 exit ticket 是有意義的指標。正文對同一個數字的描述是「完成的 exit ticket 數量每多一張，測驗多 0.06 分」（L298–300），附錄寫的是「通過率」，兩處講的自變項不同。

### 附錄 H：實際有用的效果（2SLS，Table 11，PDF 第 27 頁逐格對過）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 18 | Exit ticket 通過（不設條件） | +0.14**（0.05）；對照組 0.62；n = 4,136 | 以分派為工具變數，估「該堂有用 Tutor CoPilot」的效果 | 附錄 H、Table 11 | L1287–1289、L1319–1323 | 「Students are 14 p.p. more likely to pass their exit tickets when tutor use Tutor CoPilot (p<0.01), resulting in a 62% → 76% passing rate.」 |
| 19 | Exit ticket 有作答 | +0.06+（0.04），p < 0.1 | 同上 | Table 11 | L1289–1290 | 「We also find that the exit ticket attempt rate increases by 6 p.p.」（內文沒有註明這一項只到 p < 0.1） |
| 20 | Exit ticket 通過（有作答為條件） | +0.10*（0.05），n = 3,521 | 同上 | Table 11 | L1319–1323 | 表列 |
| 21 | 參與分數 | +0.32（0.93）；標準化 +0.035（0.095）。不顯著 | 同上 | Table 11 | 同上 | 表列 |
| 22 | 學生問卷五題 | −0.01（0.19）、+0.09（0.18）、+0.06（0.19）、−0.005（0.127）、+0.09（0.13）。全部不顯著 | 同上 | Table 11 Panel B | L1330–1334 | 表列 |

### RQ2：依家教原本的水準（Figure 2，PDF 第 11 頁）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 23 | 品質評分最低的三分之一 | +9 個百分點（56% → 65%） | 同一層內，實驗組 vs 對照組的 exit ticket 通過率 | §6 RQ2、Figure 2(a) | L457–458 | 「lower-rated tutors experienced a 9 p.p. increase in student's passing their exit ticket (56% → 65% student passing rate from control to treatment).」 |
| 24 | 年資最淺的三分之一 | +7 個百分點（61% → 68%） | 同上 | §6 RQ2、Figure 2(b) | L458–459 | 「lower-experienced tutors experienced a 7 p.p. increase (61% → 68%).」 |
| 25 | 水準越高效果越小 | 只有圖，沒有數字。圖上高評分那一層兩組的線幾乎重疊、誤差線重疊；年資中、高兩層差距很小 | 同上 | Figure 2 | L459–463 | 「We saw these treatment effects diminish with increasing tutor effectiveness, but notably, students of lower-rated or less-experienced tutors in the treatment group performed at or above the level of students with higher-rated or more experienced tutors in the control group.」 |

RQ2 沒有表，沒有報告交互作用項的係數、標準誤或 p 值；9 與 7 這兩個數字只出現在內文。圖上有誤差線（沒有說明是標準誤還是信賴區間）。中、高兩層的數字原文沒有給。

### RQ3：家教用的策略（Figure 3，PDF 第 11 頁；Table 1，PDF 第 9 頁對過）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 26 | 實驗組較常用的策略 | 「要學生解釋」「用問題引導思考」的 z 分數約 +2（圖上目測：要學生解釋約 +2.2、問題引導約 +1.75、肯定學生的正確嘗試約 +1.7） | 實驗組家教的全部訊息 vs 對照組家教的全部訊息 | §6 RQ3、Figure 3 | L468–471 | 「"prompting the student to explain" and "asking questions to guide thinking" were used approximately 2 standard deviations more frequently on a log-odds scale in treatment sessions compared to control sessions.」 |
| 27 | 對照組較常用的策略 | 圖上目測：直接給答案或解釋約 −1.7、給解題策略約 −1.95、泛泛的鼓勵約 −4.8。內文沒有給數字 | 同上 | Figure 3 | L526–529 | 「control tutors tended to rely on strategies that focus on directly leading students to the solution or providing passive support.」 |
| 28 | 沒有差別的策略 | 「要學生再試一次」z 分數低於 1（圖上灰色，約 +0.3） | 同上 | Figure 3 | L519–520 | 「Strategies with a z-score below 1 standard deviation are shaded in gray.」 |
| 29 | 各策略在標註資料裡的頻率與分類器 F1 | 要學生解釋 2%／0.89；問題引導 5%／0.90；肯定正確嘗試 9%／0.65；要學生重試 1%／0.73；直接給答案或解釋 9%／0.76；給解題策略 11%／0.79；泛泛鼓勵 12%／0.81 | — | Table 1 | L372–393 | 表列 |
| 30 | 作者對策略與成績關係的用詞 | 「might」 | — | §6 RQ3 | L532–533 | 「These findings provide evidence that treatment tutors might have achieved better student learning outcomes through the use of more expert-like teaching strategies.」 |

策略這一段要留意的三件事（原文有、但作者沒有討論）：
- 被標成「低品質」的「Give Away the Solution Strategy」，在附錄 I.1 列出的專家偏好策略裡有對應項（「provide a problem-solving strategy」，L1385–1386）；Tutor CoPilot 自己提供的策略選項也含「providing a solution」與「encouraging the student」（L231–232）。
- Tutor CoPilot 最核心的兩種建議，「解釋概念」與「給提示」，因為分類器 F1 不到 0.60 被排除在分析之外（L1442–1445），所以圖上看不到這兩種策略在兩組的差別。
- 標註由 GPT-4 先標、兩位共同作者修正；沒有報告人工標註者之間的一致性。

### 使用情形（附錄 G、C、M）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 31 | 實驗組堂次裡有用到的比例 | 約 29%（至少用一次）。逐日在 0%–57% 之間（Figure 4） | 實驗組內 | 附錄 G、Figure 4 | L1004–1006 | 「On average, we find that about 29% of treatment sessions used Tutor CoPilot.」 |
| 32 | 每堂使用次數 | 含零次的堂次約 3 次；只算有用的堂次約 10 次 | 實驗組內 | 附錄 G、Figure 5 | L1007–1010 | 「Overall, we find these high usage patterns suggest that tutors adopted the tool and integrated it well into their workflow. We did not send any reminders to tutors to use Tutor CoPilot.」 |
| 33 | 什麼時候用 | 學生解題中 49.5%、學生解完之後 42.1%；其餘時刻各不到 5%（各類不互斥） | 工具使用紀錄 | Table 9 | L1214–1247 | 「tutors use Tutor CoPilot mostly during the moments of student learning」 |
| 34 | 誰用得多（Table 10，n = 2,014 堂，PDF 第 26 頁對過） | 是否使用：女性 +0.01（0.03）、年資每月 −0.002+（0.001）、品質評分 +0.12（0.08）。使用次數：女性 +1.36**（0.51）、年資 −0.03+（0.02）、品質評分 +1.69（1.41） | 實驗組內 | 附錄 G、Table 10 | L1108–1112、L1267–1276 | 「tutors who have more tutoring experience … are less likely to use Tutor CoPilot, and female tutors use Tutor CoPilot one click more than male tutors.」（年資那一項只到 p < 0.1） |
| 35 | 對照組誤用 | 4 位對照組家教的 6 堂課用了工具；查出有 6 位對照組家教在家教公司端被誤設成實驗組。分析照原始分派 | — | 附錄 C | L906–912 | 「for our results section, we will report all results based on our original assignment to the tutor.」 |
| 36 | 流失 | 對照 450 → 396（11%）、實驗 429 → 386（10%），差異不顯著。流失的定義是資料裡沒有任何一堂課 | — | Table 4 | L879–885 | 表列 |
| 37 | 成本 | 429 位實驗組家教兩個月的 API 費用共 1,419.66 美元，推估每位家教每年 20 美元 | — | 附錄 M | L1596–1597 | 「The total API cost for 429 treatment tutors over the 2-month study was $1,419.66, resulting in an estimated annual cost of $20 per tutor.」 |
| 38 | 前導測試 | 兩次前導，各 10–20 位家教；第一次發現回應超過 30 秒，修正後才上線 | — | 附錄 A | L844–853 | 「tutors surfaced frustrations that the tool took longer than 30 seconds to respond.」 |

成本那一項：20 美元只含語言模型的 API 費用，照研究期間的用量（約三成堂次有用、每位家教兩個月約 5 堂）外推；分母是 429 人，不是實際有上課的 386 人。開發、嵌入平台、2–3 週訓練的成本不在裡面。這是我照原文數字的整理，原文沒有討論成本包含什麼。

### RQ4 與家教層級（附錄 J、L）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 39 | 家教研究後問卷四題（n = 766） | 「學生從犯錯學得更多」−0.02（0.06），對照組 3.48；「辨認學生犯哪種數學錯誤的信心」+0.05（0.06），3.37；「幫學生改錯的效能」+0.03（0.03），3.81；「和三個月前比」+0.005（0.05），4.60。**全部不顯著** | 實驗組 vs 對照組家教 | 附錄 L、Table 14（PDF 第 33 頁對過） | L1591–1593、L1613–1617 | 「We find no significant changes between the treatment and control groups.」 |
| 40 | 問卷回覆率 | 兩組沒有差異（係數 −0.01，SE 0.02） | 同上 | Table 13 | L1571–1576 | 表列 |
| 41 | 訪談：覺得有幫助的地方 | 現場給出措辭好的解釋、把複雜概念拆開（舉例：平均數與中位數的差別） | 無對照；約 20 位實驗組家教 | §6 RQ4 | L536–539 | 「Tutors generally found Tutor CoPilot helpful, particularly for its ability to provide well-phrased explanations and break down complex concepts on the spot.」 |
| 42 | 訪談：問題 | 建議有時不符合學生的年級，被形容為「too smart」，家教要自己簡化 | 同上 | §6 RQ4 | L540–542 | 「A common issue was that the responses were sometimes perceived as "too smart," requiring tutors to simplify and adapt them for clarity.」 |

訪談的實際形式（附錄 J，L1471–1505）：不是一對一訪談，是**一場一小時的線上團體討論**，約 20 位家教，主持人是本文第一作者，在場的還有家教公司的營運團隊成員與一位工程主管；家教先在共用文件上寫 7 分鐘，再一起討論。原文沒有給任何逐字引述、人數統計或編碼方式。正文 §5 寫的是「conducted interviews with approximately 20 treatment tutors」。

## 作者自己列的限制（§7，L545–589）

1. **教育內的可推廣性**：對象是新手家教，學生是美國南部一個學區、多數 Hispanic 的弱勢社區年幼學生；其他族群、地區、國家或較富裕環境的需求可能不同（L549–553）。
2. **年終測驗沒有顯著進步**：「while we observed substantial improvements in students' proximal learning gains (i.e., the students' exit ticket performance), we did not find statistically significant improvements in end-of-year math test scores; please refer to Appendix K for this analysis. This may be due to the little variation in students' exposure to the treatment and the relatively short duration of the study (two months). Future research would benefit from randomizing students to better assess the impact of the intervention.」（L553–558）
3. **其他領域的可推廣性**：法律、醫療能不能套用，要看任務與流程（L560–569）。
4. **只有文字聊天**：沒有語音、白板影像等其他形式（L571–578）。
5. **使用者安全**：只去識別姓名，其他個資仍可能外洩；傳給外部 API 的對話長度與品質之間有取捨（L580–589）。

作者沒有列、但原文看得出來的事：
- 第一作者在研究期間兼職任職於合作的家教公司，並與該公司的工程、設計、營運、課程團隊一起做出這個工具（L185–188）；訪談也由她主持。全文沒有利益衝突聲明。
- 隨機分派在家教層級，模型的殘差卻寫成叢集在「學生與家教的配對」層級（L330）。一般做法是叢集在分派的單位。這一點會影響標準誤，原文沒有討論。這是我的判斷。
- 學生問卷、參與分數、家教問卷全部沒有差異；唯一顯著的學習結果是當堂的 exit ticket。
- 沒有延宕測驗；exit ticket 在同一堂課結束時考。
- 分類器分析是用同一批作者訂的分類表與標註。

## 與摘要說法不一致的地方

1. **摘要完全沒有提年終測驗**。摘要寫「students … are 4 percentage points (p.p.) more likely to master topics (p<0.01)」，結論寫「Tutor CoPilot improves student learning」（L595–596）；年終 MAP 數學不顯著、係數為負這件事只出現在 §7 限制的一句話與附錄 K。
2. **「master topics」＝通過當堂的 exit ticket**。摘要沒有說這是每堂課結束時的小測驗。
3. **人數**：摘要與導言寫「900 tutors and 1,800 K-12 students」。內文是學區指定 1,787 名學生、874 位全職家教；研究開始時有上課的家教 782 位；年終分析的學生約 1,000 位（n = 959–1,002）；堂次層級分析是 4,136 堂。「K-12」實際是 3–8 年級入選、有資料的只有 3–6 年級。
4. **「improving mastery by 9 p.p.」**（低評分家教）：內文沒有表、沒有檢定統計量，只有一句話與一張圖。導言寫成「up to 9 percentage points」（L97）。
5. **「Tutor interviews」**：實際是一場團體討論（見上）。
6. **「costs only $20 per-tutor annually」**：只有 API 費用（見上）。
7. 摘要的 4 個百分點（p < 0.01）、55 萬則訊息、策略方向，都對得上內文與表。

## 原文內部不一致（照實記錄，不猜哪個對）

- **實驗組家教人數**：§4.1 寫初始分派「treatment = 450, control = 450」（L267–268）；Table 3、Table 4 與附錄 M 寫實驗組 429。流失率 10% 配 386 人，對得上的是 429。另外 §4.1 同一段先寫「874 full-time tutors」再寫「900 tutors」；450 + 429 = 879，三個數字都對不起來。
- **以作答為條件的通過率**：內文「p< 0.01」（L415），Table 2 是一顆星（p < 0.05）。
- **RQ2 內文兩次都寫「In Figure 2a」**（L457、L458），第二次指的是 2(b)。
- **附錄 K 內文引「Table 9」**，實際是 Table 12。
- **Table 9 圖說**說「after exit ticket attempt」的分類器 F1 太低所以略去頻率；表上 F1 是 0.0、沒有頻率的是「During exit ticket attempt」，「After exit ticket attempt」的 F1 是 0.90、頻率 4.6%。附錄 I.2 寫被剔除的是「during exit ticket attempt」。
- **exit ticket 與年終測驗的關聯**：正文說自變項是「完成的 exit ticket 數量」（L298–300），附錄 F 與 Table 6 說是「通過率」。
- **使用次數**：正文說共「2,000+ uses」（L303、L963）；附錄 G 說實驗組每堂平均約 3 次，而 Table 10 的實驗組堂次是 2,014 堂，照這兩個數字算會是六千次左右。「2,000+」是下限寫法，不一定矛盾，但兩處給人的規模印象不同。Figure 5 的平均可能是逐日平均再平均，原文沒有說明。
- **RQ2 的方法敘述**寫「interacted these indicators with the student's exit ticket passing rate」（L338–339），exit ticket 通過率是結果變項；照上下文應是與分派指標交互，原文沒有寫清楚。
- **附錄 K 的文字**說多數學生曝露量接近零，Figure 6 目測零那一格約三成（見上）。
- 年級：內文「grades 3-8」，Table 7 七、八年級的堂次是 0。

## 與清單「要撐的結論」不合的地方

清單（28#8）寫：「AI 給真人家教用：小測 +4 個百分點、年終測驗不顯著」。

- **「小測 +4 個百分點」**：撐得住（Table 2：+0.04，SE 0.01，p < 0.01，62% → 66%）。要連著寫的條件：
  1. 「小測」是每堂課結束時的 exit ticket，家教不能幫忙，當堂考；不是隔一段時間後的測驗。
  2. 這是意向治療效果：實驗組只有約 29% 的堂次真的用了工具。用 2SLS 估「該堂有用」的效果是 +14 個百分點（附錄 H）。
  3. 單位是堂次（4,136 堂），不是學生。
  4. 每位家教在兩個月裡平均只上 5 堂、約 200 分鐘。
- **「年終測驗不顯著」**：撐得住，但清單的寫法少了三件事，寫進文章時要補：
  1. 年終數學的係數是**負的**（−0.35，SE 0.88；不補基線時 −0.59，SE 0.86），閱讀是正的（+1.44、+1.56），四個都不顯著。作者原話是「math scores trending negative」。只寫「不顯著」會讓人以為是「正向但不夠大」。
  2. 這個分析不是隨機分派的組間比較。學生沒有被隨機分派，自變項是「遇到實驗組家教的堂數比例」。所以它不能當成「長期效果是零」的證據，也不能當成「長期有效」的證據；準確的說法是「這個設計沒辦法回答年終測驗有沒有進步」。作者自己說未來要隨機分派學生。
  3. 作者事前就預期這一項不會顯著（「We therefore expected that the impact on end-of-the-year outcomes would not be significant」）。
- **「AI 給真人家教用」**：撐得住。補充：建議只給家教看，家教可改可不用；平台是文字聊天；家教事前受過 2–3 週的工具訓練；工具是用專家放聲思考資料調整過的（引 Wang 等 2024a 的 Bridge 方法，那一篇沒有讀），不是直接把通用聊天模型丟給家教。
- **清單沒寫、但同樣是這篇的結果**：學生課後問卷五題、參與分數、家教問卷四題全部沒有差異；低評分家教 +9 個百分點那一項沒有檢定統計量；第一作者任職於合作的家教公司。
- 清單寫 arXiv 2024；讀的是 2025-01-26 的 v2，沒有比對 v1 與 v2。有沒有後續的期刊版，沒有查。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–420 | 標題、作者、摘要、§1 導言、§2 相關研究（2.1–2.3）、§3 Tutor CoPilot（含 Figure 1 圖說）、§4 研究設計（4.1 參與者與隨機分派、4.2 資料）、§5 方法（RQ1–RQ4）、Table 1、§6 結果 RQ1 開頭、註腳 1–6 |
| 2 | L420–839 | Table 2、RQ1 其餘、RQ2、Figure 2、RQ3、Figure 3、RQ4、§7 限制、§8 結論與討論、致謝；L620–837 是參考文獻（掃過） |
| 3 | L839–1238 | 附錄 A 前導測試、B 平衡與流失（Table 3–5）、C 順從、D 訓練、E 資料、F exit ticket 的意義（Table 6）、Table 7、G 描述統計（Figure 4、Table 8、Figure 5）、H 開頭、Table 9 |
| 4 | L1238–1626 | Table 9 圖說、H 其餘（Table 10、式 2–3、Table 11）、I 分類器（I.1–I.3）、J 訪談流程、**K 學生層級分析（Figure 6、Table 12）全文**、L 家教層級分析（Table 13–14）、M 成本 |

對過 PDF 版面的：第 9 頁（Table 1）、第 10 頁（Table 2）、第 11 頁（Figure 2、Figure 3）、第 19–21 頁（Table 3、4、5、6）、第 22–25 頁（Table 7、Figure 4、Table 8、Figure 5、Table 9）、第 26–27 頁（Table 10、Table 11）、第 31–33 頁（Figure 6、Table 12、13、14）。表格數字逐格與文字檔一致。Figure 2、3、6 的數字圖上沒有印，上面凡寫「目測」的都是從圖讀的近似值，不能當精確數字引用。

沒有讀的：OSF 預先註冊文件；v1；Bridge 方法的原論文（Wang 等 2024a）；本文引用的其他研究。
