# 抽取紀錄：Yang、Zhao、Yuan、Luo、Shanks 2023，Review of Educational Research 93(2)

## 檔頭

- **書目**：Chunliang Yang、Wenbo Zhao、Bo Yuan、Liang Luo、David R. Shanks（2023）。Mind the Gap Between Comprehension and Metacomprehension: Meta-Analysis of Metacomprehension Accuracy and Intervention Effectiveness. *Review of Educational Research*, 93(2), 143–194。DOI 10.3102/00346543221094083。作者共五位，對過稿件首頁（L11）與 Crossref 紀錄，兩邊一致；清單寫的「Yang, Zhao, Yuan, Luo, Shanks 等」多了「等」字，沒有第六位。通訊作者是 Liang Luo（L31–35）。卷期頁碼與年份取自 Crossref（線上刊出 2022-05-26，紙本 2023 年 4 月），稿件本身沒有印。
- **原文檔**：`.research/raw/learning-content/q1-learner/yang2023_ucl.txt`，3,928 行、176,119 位元組（175,837 字元）；同目錄 `yang2023_ucl.pdf` 69 頁。`q4-time/yang2023-mind-the-gap-meta.txt` 是同一份稿件的另一次下載，沒有讀。
- **版本**：作者接受稿（UCL Discovery，Word 排版，PDF 建立日期 2022-06-28），不是刊出版。頁碼是稿件頁碼 1–69，不是期刊頁碼。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 15（讀者知不知道自己懂了）。
- **沒讀到的部分**：正文多處指到 Supplemental Information（相關—準確率模擬的方法、受試者樣本／測驗形式／學習到測驗間隔／相關係數種類／設計品質等控制變項的結果、編碼程序）。這份接受稿不含 SI；OSF 專案（osf.io/ed4ac）只有資料檔與 R 腳本兩個檔，沒有 SI；Sage 的補充資料頁對 curl 回 403。**SI 沒有讀到**，下面凡是靠 SI 的地方都另外標出。

行號一律是原文檔（`yang2023_ucl.txt`）的行號。這份文字檔是單欄稿件，隔行空白，段落沒有左右交錯。

## 研究設計

- **類型**：統合分析（多層次隨機效果模型，R metafor），只做「相對準確度」。
- **量的是什麼**：相對後設理解準確度，也就是同一個人跨多篇文本的「理解判斷」與「測驗成績」的個人內相關，再對受試者取平均。各研究用的相關係數不一樣（Gamma 最多，其次 Pearson r，少數 point-biserial），所以作者一律稱 MC（mean correlation），不稱 r（L294–310）。絕對準確度（高估或低估多少）不在這份分析裡（L134–163）。
- **典型實驗流程**（L165–185）：受試者讀多篇文本，每篇讀完或全部讀完後對每篇做理解判斷或預測成績（常用 1–7 分量表），之後考所有文本，算每個人跨文本的相關。
- **檢索**（L997–1015）：30 個電子資料庫，含 Web of Science、ProQuest（26 個資料庫）、中國知網 CNKI、萬方、Google Scholar；檢索詞 `[metacomprehension OR meta-comprehension OR judgment* of comprehension OR comprehension judgment* OR calibration of comprehension]`；另篩 21 篇回顧文章的參考文獻。沒有寫檢索日期；納入研究的出版年是 1985–2020（L1970）。
- **納入與排除**（L1022–1095，八條）：
  1. 只收以文本為主要材料的研究；講課影片、西洋棋殘局、單句排除。**文本裡插了裝飾性或輔助性圖片的研究或效果排除**，「in order to maintain a focus on metacomprehension accuracy for plain texts」（L1030–1034）。
  2. 只收報告個人內相關的實證研究；錯誤偵測典範、只報絕對準確度的排除。
  3. 只收事前（prospective）判斷；事後信心判斷排除。
  4. 資料不足以算效果量的排除。
  5. 有神經疾病或身體障礙的受試者排除。四個年齡群都收：小學童、中學青少年、年輕成人、年長成人。
  6. 只收對整篇文本的整體判斷；逐項判斷（item-specific）因效果數太少而排除。
  7. 各種設計都收：隨機對照、準實驗、受試者內、無介入研究；設計當控制變項。
  8. 只收英文與中文研究。
- **篩選流程**（Figure 1，L3859–3894；對過 PDF 第 66 頁）：資料庫 2,998 筆、參考文獻 97 筆；標題與摘要篩選後 601 筆；全文階段排除 486 筆（拿不到 38、重複 55、非英文或中文 29、不相關 316、非實證 22、資料不足 26）；合格 115 篇。
- **最終資料**：115 篇研究、k = 502 個效果、15,889 位受試者（L1191–1193）。其中無介入效果 k = 243、介入效果 k = 259（L1261–1265）。未發表來源不少：學位論文貢獻 k = 166 個效果（L2412–2414）。
- **比較對象**：不是每個介入各自對它原研究裡的對照組，而是把全部效果放進一個多層次多變量後設迴歸，介入類別當預測變項，**每一類介入與「全體無介入效果」的 MC 差**就是該介入的效果（L1310–1320）。所以 Table 2 的「Difference」是跨研究的比較，不是同一實驗內的介入—對照差。
- **介入分類**：18 類＝無介入＋17 類介入（Table 1，L3759–3821）。被研究不到五次的介入併成一類；概念圖、概念圖表完成、概念圖表繪製、畫圖、心智圖併成一類（L1124–1136）。
- **控制變項**（L1284–1308）：受試者樣本、測驗形式、學習到測驗的間隔、相關係數種類、設計品質、缺失資料偏誤。這些變項的結果「are reported in the SI」，我沒讀到。
- **理解程度怎麼量**：用每個效果對應的測驗成績當理解的指標。k = 70 個效果沒報測驗成績，作者先用其餘 k = 432 個效果跑後設迴歸，再用線性內插補上（L1138–1155）。
- **偏誤風險**（L1157–1175）：依 Cochrane RoB 2 與 WWC 4.1 編三項——隨機化、缺失結果資料（流失率）、選擇性報告（以基準線是否均等編碼）。註 2：因多數研究沒報是否盲化，「偏離預定介入」與「結果測量」兩種偏誤沒有評（L1201–1204）。
- **編碼**：第一作者與一位受過訓練的研究助理各自抽取與編碼，分歧討論解決（L1101–1105）。原文沒有報告編碼者間信度。
- **變異數**：VMC = SD²／N；沒報 SD 或 SE 的從 t 與 N 推（L1107–1120）。註 1：各原研究都直接平均原始相關、沒有做 Fisher Z 轉換，本分析拿不到原始資料，也沒做（L197–202）。

## 結果（逐項）

### 準確度本身

| # | 結果 | 數字 | 對照／條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 全部效果合併 | MC = 0.242 [0.220, 0.265]，k = 502，p < .001 | 介入與無介入效果混在一起 | Metacomprehension accuracy | L1223–1227 | 「across the k = 502 effects, the weighted MC was 0.242 [0.220, 0.265], p < .001, indicating that although metacomprehension is somewhat accurate, its level is far from impressive.」 |
| 2 | 換算成解釋變異 | R² = 5.9% | 同上（MC = 0.242） | 同上 | L1227–1233 | 「actual comprehension only accounts for about R2 = 5.9% of the variance in comprehension judgments.」 |
| 3 | 換算成判斷正確率 | 約 56.1%（機率水準 50%） | MC = 0.242；作者自己的模擬，方法在 SI | 同上 | L1233–1237 | 「the accuracy value corresponding to MC = 0.242 is about 56.1%, which is barely better than a coin toss (50%).」 |
| 4 | 異質性 | Q(501) = 3279，p < .001 | 全部效果 | 同上 | L1239 | 「Heterogeneity among the effects was substantial, Q(501) = 3279, p < .001」 |
| 5 | **無介入條件** | **MC = 0.178 [0.155, 0.200]，k = 243，p < .001** | 沒有任何介入的條件 | 同上 | L1259–1265 | 「intervention effects (k = 259, MC = 0.332 [0.309, 0.356], p < .001) larger than non-intervention effects (k = 243, MC = 0.178 [0.155, 0.200], p < .001).」 |
| 6 | 介入條件 | MC = 0.332 [0.309, 0.356]，k = 259 | 有任一種介入的條件；兩類差異 Q(1) = 259，p < .001 | 同上 | L1259–1265 | 同上 |
| 7 | 0.178 換算成正確率 | 54.5% | 作者的模擬 | 同上；總討論重述 | L1272–1278、L2140–2153 | 「It equates to accuracy of 54.5% according to the simulation described previously.」 |
| 8 | 校正測量信度後的「真」相關 | MCtrue = 0.312，對應正確率約 58.0% | 信度取自 Kelemen 等 2000 兩個實驗（判斷 rjj = 0.638、成績 rpp = 0.509），作者自稱粗估 | General Discussion | L2181–2210 | 「we can roughly estimate that the “true” intra-individual correlation … is MCtrue = 0.312 … the estimated judgment accuracy corresponding to G = 0.312 is about 58.0%, still quite poor.」 |
| 9 | 與前人數字的差別 | 前人 0.27（Maki 1998c；Dunlosky & Lipko 2007；Thiede 等 2009）與 0.24（Prinz 等 2020a）都混進了介入條件 | — | 前言與結果 | L318–339、L865–916、L1272–1276 | 「the weighted MC = 0.24 observed by Prinz et al. (2020a) is likely to overestimate metacomprehension accuracy in standard non-intervention situations.」 |

前言用來說明 0.27 意義的例子（L355–377）：G = 0.27 對應正確率 56.9%；讀了 40 節課本、想重讀最不懂的 20 節的人，預期會挑到 20 節不懂的裡面的 11 節，加上 20 節已懂的裡面的 9 節。這個例子是對 0.27 算的，不是對 0.178 算的。

### 各介入與無介入效果的差（Table 2，L3826–3853；對過 PDF 第 65 頁）

整體：18 類之間異質，Q(17) = 430，p < .001（L1310–1314）。下表每列的「差」都是「該類介入的 MC − 全體無介入效果的 MC」，屬跨研究比較。k 是效果數，17 類加起來 259。

| # | 介入 | k | 差 | 95% CI | Z | p | 內文行號 |
|---|---|---|---|---|---|---|---|
| 10 | 多種介入併用 | 30 | 0.316 | [0.269, 0.362] | 13.25 | < .001 | L1683–1687 |
| 11 | 延後寫摘要（全部文本讀完後才寫） | 9 | 0.210 | [0.164, 0.255] | 9.00 | < .001 | L1409–1411 |
| 12 | 概念圖／概念圖表完成／繪製／畫圖／心智圖 | 11 | 0.196 | [0.131, 0.262] | 5.89 | < .001 | L1468–1472 |
| 13 | 延後列關鍵詞（全部文本讀完後才列） | 40 | 0.184 | [0.147, 0.220] | 9.87 | < .001 | L1365–1367 |
| 14 | 自我解釋（邊讀邊做） | 7 | 0.179 | [0.110, 0.248] | 5.08 | < .001 | L1443–1449 |
| 15 | 練習測驗（讀完後、判斷前先考一次） | 47 | 0.169 | [0.131, 0.208] | 8.61 | < .001 | L1553–1557 |
| 16 | 刪字母（讀缺字母的文本） | 7 | 0.112 | [0.022, 0.202] | 2.43 | .015 | L1604–1606 |
| 17 | 測驗預期一致（事先告知會考記憶還是推論，且真的那樣考） | 8 | 0.090 | [0.024, 0.157] | 2.67 | .008 | L1335–1339 |
| 18 | 短暫延後重讀 | 22 | 0.063 | [0.015, 0.111] | 2.56 | .010 | L1498–1502 |
| 19 | 自己出題（question generation）——**無效** | 7 | 0.042 | [-0.057, 0.141] | 0.83 | .406 | L1620–1624 |
| 20 | 立即寫摘要——**無效** | 9 | 0.030 | [-0.019, 0.080] | 1.21 | .225 | L1411–1415 |
| 21 | 其他介入（動機操弄、畫重點、長延後重讀等）——**無效** | 21 | 0.023 | [-0.012, 0.058] | 1.30 | .194 | L1726–1728 |
| 22 | 提供類比——**無效** | 6 | 0.010 | [-0.098, 0.118] | 0.18 | .855 | L1657–1661 |
| 23 | 立即列關鍵詞——**無效** | 17 | 0.009 | [-0.037, 0.054] | 0.37 | .710 | L1367–1371 |
| 24 | 讀現成的題目與答案——**不顯著，方向為負** | 6 | −0.095 | [-0.196, 0.006] | −1.85 | .065 | L1565–1571 |
| 25 | 讀實驗者給的關鍵詞——**方向為負，邊緣** | 6 | −0.096 | [-0.192, 0.000] | −1.96 | .050 | L1371–1375 |
| 26 | 測驗預期不一致（告知會考 A，實際考 B）——**反向** | 6 | −0.117 | [-0.214, -0.019] | −2.34 | .019 | L1339–1343 |

Table 2 裡 question generation 的 p 值印成「.4.06」，是稿件筆誤；內文寫 p = .406（L1622）。

介入之間的直接比較（同一個後設迴歸裡的對比，仍是跨研究）：

| # | 比較 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 27 | 預期一致 vs 預期不一致 | 差 0.207，Z = 4.38，p < .001 | L1343–1347 | 「monitoring accuracy was better when test expectancy was consistent with the criterion test compared to when it was inconsistent, difference in MC = 0.207」 |
| 28 | 延後 vs 立即列關鍵詞 | 差 0.175，Z = 7.38，p < .001 | L1377–1381 | 「metacomprehension judgments were more accurate in the delayed-keyword-generation condition than in the immediate-keyword-generation condition, difference in MC = 0.175」 |
| 29 | 延後列關鍵詞 vs 讀現成關鍵詞 | 差 0.280，Z = 5.74，p < .001 | L1381–1387 | 「confirming that active keyword generation is required to improve metacomprehension accuracy, compared to passive reading of experimenter-provided ones.」 |
| 30 | 延後 vs 立即寫摘要 | 差 0.179，Z = 6.88，p < .001 | L1415–1419 | 「metacomprehension judgments were more accurate in the delayed- than in the immediate-summary-writing condition, difference in MC = 0.179」 |
| 31 | 練習測驗 vs 讀現成題目與答案 | 差 0.264，Z = 5.15，p < .001 | L1571–1577 | 「these findings imply that covertly answering practice questions, but not passively reading questions and answers, boosts metacomprehension accuracy.」 |
| 32 | 重新分三類：單一介入 vs 無介入 | 差 0.101，Z = 9.56，p < .001；三類異質 Q(2) = 202 | L1687–1701 | 「both single interventions (difference in MC = 0.101, Z = 9.56, p < .001) and intervention combinations (difference in MC = 0.299, Z = 12.94, p < .001) improved judgment accuracy」 |
| 33 | 併用 vs 單一介入 | 差 0.198，Z = 8.92，p < .001 | L1701–1705 | 「intervention combinations were more effective than single interventions, difference in MC = 0.198」 |

各類介入的定義（Table 1，對過 PDF 第 63–64 頁），寫作時容易用錯的幾條：
- 「延後」指**全部文本讀完之後**才列關鍵詞或寫摘要（L3773–3774、L3787–3788）；「立即」指每篇讀完就做。延後多久，Table 1 沒有給時間。
- 練習測驗：「After reading but before making judgments, participants undertake practice tests on the studied texts.」（L3811–3813）
- 讀題目與答案：「several questions and their corresponding answers are presented for participants to read」（L3814–3816）
- 測驗預期一致：「Participants are pre-informed about the nature of the criterion test (e.g., whether it is a memory or inference test), and their expectancy is consistent with the criterion test.」（L3801–3804）
- 自我解釋：邊讀邊對自己解釋每句或每段對全文目的的意義與關聯（L3795–3798）。
- 併用介入的例子（L1673–1679）：重讀加自我解釋、延後列關鍵詞加合作學習、測驗預期加自我解釋。每一種組合被研究不到五次（L2473–2475）。
- 短暫延後重讀的「短」：每篇讀完後、全部讀完後、或 6 分鐘填充作業後（L1514–1520）。唯一做過長延後（一週）的是 Dunlosky & Rawson 2005，結果長延後沒效，該條件被歸到「其他介入」（L1520–1531）。

### 理解程度與準確度的關係（後設迴歸，測驗成績為預測變項）

| # | 資料子集 | 斜率 b | 95% CI | Z、p | 行號 |
|---|---|---|---|---|---|
| 34 | 全部 k = 502（含 70 個內插的成績） | 0.298 | [0.246, 0.350] | Z = 11.25，p < .001 | L1736–1742 |
| 35 | 去掉內插的，k = 432 | 0.482 | [0.370, 0.595] | Z = 8.42，p < .001 | L1750–1754 |
| 36 | 只留無介入效果，k = 202 | 0.329 | [0.155, 0.502] | Z = 3.72，p < .001 | L1764–1773 |
| 37 | 再只留選擇題，k = 140（占 202 的 69.3%） | 0.472 | [0.242, 0.702] | Z = 4.02，p < .001 | L1799–1811 |
| 38 | 再只留立即測驗，k = 133 | 0.454 | [0.218, 0.690] | Z = 3.77，p < .001 | L1827–1842 |
| 39 | 再只留年輕成人，k = 115（占 133 的 86.5%） | 0.500 | [0.252, 0.747] | Z = 3.96，p < .001 | L1844–1852 |

原文對第 34 列的解讀：「every increase of 10% in test performance increases MC by 0.030.」（L1740–1742）。這是**效果層級**的關係（一個研究條件的平均成績對該條件的平均 MC），不是同一個人理解越好就判斷越準。作者自己說測驗成績是不完美的理解指標（L971–977、L1775–1779）。作者也提到與 Prinz 等 2020a「文本難度與準確度無關」的結果不一致，並歸因於對方用 Flesch-Kincaid 年級分數量難度（L2299–2311）。

### 偏誤風險

| # | 項目 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 40 | 隨機化偏誤 | 高風險 k = 22（MC = 0.321）、低風險 k = 480（MC = 0.239）；Q(1) = 1.70，p = .192 | L1862–1878 | 「There was no statistically detectable difference in MC between these two categories」 |
| 41 | 缺失結果資料（流失） | 低 MC = 0.289、有疑慮 0.228、高 0.191；Q(2) = 17.57，p < .001；只看無介入效果時 Q(2) = 13.14，p = .001，型態相同 | L1880–1899 | 「readers should be cautious about bias arising from missing outcome data when interpreting results of the current meta-analysis, although it is noteworthy that MCs decreased as bias increased.」 |
| 42 | 選擇性報告（基準線均等） | 含介入 Q(2) = 2.68，p = .262；不含 Q(2) = 3.09，p = .213 | L1901–1911 | 「was not statistically detectable」 |

### 出版偏誤（只對 k = 243 個無介入效果做，六種方法）

| # | 方法 | 數字 | 行號 |
|---|---|---|---|
| 43 | 已發表 vs 未發表 | 已發表 k = 185，MC = 0.189 [0.164, 0.214]；未發表 k = 58，MC = 0.153 [0.112, 0.195]；Q(1) = 2.12，p = .145 | L1941–1953 |
| 44 | 出版年份（1985–2020） | b = −0.001 [−0.003, 0.002]，Z = −0.521，p = .603 | L1966–1974 |
| 45 | PET-PEESE | MC 與變異數呈**負**相關，b = −2.860 [−5.475, −0.245]，p = .032；校正後 MC = 0.201 [0.172, 0.230] | L1990–2000 |
| 46 | Trim-and-Fill（一般隨機效果模型） | 補 k = 42 個效果，多在漏斗圖**右側**；校正後 MC = 0.229 [0.208, 0.249] | L2014–2025 |
| 47 | 3PSM（一般隨機效果模型） | χ²(1) = 0.50，p = .481；校正後 MC = 0.196 [0.167, 0.224] | L2027–2037 |
| 48 | 介入研究的對照組 vs 純無介入研究 | 介入研究的對照 k = 112，MC = 0.169 [0.139, 0.199]；純無介入研究 k = 131，MC = 0.190 [0.160, 0.221]；差 −0.022 [−0.065, 0.022]，Z = −0.98，p = .330 | L2073–2094 |

作者的總結：六種方法四種沒有訊號；PET-PEESE 與 Trim-and-Fill 有弱訊號，但方向是缺少**較大**的效果，校正後的估計值都比 0.178 高（L2039–2045、L2096–2110）。也就是說，三個校正值是 0.196、0.201、0.229。

## 作者自己列的限制（L2404–2526）

1. 不確定是否找齊所有相關研究（L2406–2414）。
2. 多數研究在實驗室做，生態效度可能不足：「even though all included studies employed educationally-relevant materials (e.g., expository texts), these materials were not part of students’ coursework.」（L2414–2420）
3. 只處理相對準確度，絕對準確度（高估、低估）沒有分析（L2430–2454）。
4. 有些介入研究次數很少（類比、讀題目與答案）；重讀時間點只有一篇研究探討過（L2459–2469）。
5. 每一種介入組合被評估不到五次；單一介入的效果「relatively small」；併用之後的 MC 仍遠低於 1。「additive」只是描述，實際可能有交互作用，要高檢定力的研究才分得出來（L2471–2491）。
6. 準確度高不保證學得好：重讀不一定提高理解，重讀時分心更多（Phillips 等 2016）（L2493–2509）。
7. 有效的介入多半要額外花心力，學習者自學時可能不願意用（L2511–2526）。

散在正文裡的其他保留：
- 統合分析檢驗理論是鈍器，納入研究在許多方面不同，可能混淆，理論意涵「suggestive rather than conclusive」（L2345–2353）。
- 練習測驗支持 TAM 只算「suggestive」，因為練習測驗還有別的作用路徑（回饋、察覺落差）（L2254–2262）。
- 「其他介入」這一類內部異質，解讀要小心（L1728–1732）。
- 無效果的幾項是統計上偵測不到，要考慮檢定力，有些只有少數效果（L2379–2383）。
- 讀現成關鍵詞的負向結果，作者歸為可能的抽樣誤差，不再討論（註 3，L1391–1394）。
- 缺失資料偏誤確實與 MC 有關（第 41 列）。

## 與摘要說法不一致的地方

逐項對過，有兩處：

1. **效果數**：摘要與結果都寫 502 個效果（L59、L1193），但前言「Rationale」一節寫「k = 508 effects (data from 15,889 participants extracted from 115 studies) were included here」（L812–814）。502 與 508 在同一份稿件裡並存；結果、Table 2 的 k 加總（243 + 259 = 502）都支持 502。刊出版是否改過我沒有查到。
2. **「additive」**：摘要寫「combining different interventions tended to generate additive benefits」（L65–67），限制一節自己承認「additive」只是描述，可能其實是交互作用（L2485–2491）。資料只顯示併用類的 MC 比單一介入類高 0.198，沒有檢驗相加性。

其餘（0.178、延後寫摘要與延後列關鍵詞有效、三個理論得到支持）與正文相符。摘要沒提的是：自己出題、讀現成題目與答案、類比、立即版的摘要與關鍵詞都沒有效果，以及缺失資料偏誤。

## 與清單「要撐的結論」不合的地方

清單那句：「沒有介入時，判斷與實際表現的相關只有 0.178（約 55% 正確率）；哪些介入有效；理解越好判斷越準」。

- **0.178**：撐得住，但要連著三件事寫。(a) 這是個人內、跨文本的相關的加權平均，量的是「分不分得出哪篇懂、哪篇不懂」，不是高估或低估多少。(b) 三種出版偏誤校正給的是 0.196、0.201、0.229，都比 0.178 高；作者另外估了校正測量信度後的 0.312。(c) 只收純文字、整體判斷、事前判斷的研究，有插圖的文本被排除。
- **「約 55% 正確率」**：原文是 54.5%，而且出自作者自己的模擬，方法在我沒讀到的 SI 裡。寫「約 55%」可以，但不能寫成實測的正確率。
- **「哪些介入有效」**：清單下方「找不到來源」一段說「統合分析裡有效的介入是讓讀者自己延後寫摘要、列關鍵詞，或事先告知會被怎麼考」，**漏了三項**：練習測驗（差 0.169，k = 47，是效果數最多的一類）、自我解釋（0.179）、概念圖類（0.196）。另外「事先告知會被怎麼考」在這份分析裡是有效介入中偏小的一項（0.090），不是最有效的。
- **「作者替讀者準備題目……我沒有找到直接測它的研究」**：這份分析有兩列直接相關。讀者在判斷前**實際作答**練習題，準確度提高（0.169）；只**讀**現成的題目與答案沒有幫助，方向還是負的（−0.095，p = .065，k = 6）；兩者差 0.264。所以原文能撐的是「題目要讀者自己答過才有用，把題目和答案擺出來給人看沒有用」。限制是：這些都是實驗室研究、練習測驗在讀完後判斷前做，不是嵌在文章裡。
- **「理解越好判斷越準」**：方向撐得住（b = 0.298，各子集 0.329–0.500），但這是跨研究條件的關係，用測驗平均成績當理解的代理指標；不能寫成「同一個讀者理解越好就判斷越準」。
- **與 Prinz 等 2020（清單 #2）衝突的一項**：清單說自我解釋在 Prinz 的分析裡不顯著；在這份分析裡自我解釋顯著（0.179，k = 7，p < .001）。兩篇放在一起寫時不能只寫「自我解釋無效」。

## 讀取紀錄

依序讀完，首尾相接：

| 段 | 原文檔行號 | 內容 |
|---|---|---|
| 1 | L1–600 | 首頁、作者註、摘要、前言（準確度的兩種量法、典型程序、為什麼重要、0.27 的意義、TAM、SMAM 前半） |
| 2 | L601–1736 | SMAM 後半、poor-comprehension、介入概觀、本研究理由與研究問題、方法全節、結果（準確度、各介入逐節、併用、其他介入） |
| 3 | L1736–2786 | 理解程度的後設迴歸、偏誤風險、出版偏誤六法、總討論、理論意涵、實務意涵、限制、結語、參考文獻開頭 |
| 4 | L2788–3755 | 參考文獻其餘（掃過，沒有夾帶附錄或註腳） |
| 5 | L3759–3928 | Table 1、Table 2、Figure 1 流程圖文字、Figure 2–4 圖說 |

- 對過 PDF 版面的表：Table 1（PDF 第 63–64 頁）、Table 2（第 65 頁，逐列對過 k、差、CI、Z、p）、Figure 1 流程圖（第 66 頁）。
- Figure 2–4 是圖，只讀了圖說，沒有從圖上讀數字。
- Supplemental Information 沒有讀到（見檔頭）。
- 四個註腳都讀了（L197–202、L1201–1204、L1391–1394、L2324–2330）。
