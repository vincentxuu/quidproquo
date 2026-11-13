⚠ 來源版本不合規：手上的 PDF 是帶 Science 下載戳記的刊出版，來自 `uploads-ssl.webflow.com` 的檔案 CDN，掛在哪個網站查不到，來源不明；2026-10-14 核對 重查，science.org 文章頁要購買或登入，Unpaywall 與 OpenAlex 都標 closed；第一作者個人網站（rene.kizilcec.com/publications）掛的是 Science 的作者推薦連結，點過去現在同樣是付費頁，拿不到全文。本紀錄的數字不得引用、不得列入參考資料，文章裡只能寫「這篇研究存在」。（2020 年 PNAS 那篇大規模重做是開放取用，見 `kizilcec2020-scaling-interventions.md`，其中 Table 1 轉述了本篇的 n = 64、24 pp，可以從那裡引。）

# 抽取紀錄：Kizilcec、Saltarelli、Reich、Cohen 2017，Closing global achievement gaps in MOOCs

- **書目**：René F. Kizilcec（Stanford University）、Andrew J. Saltarelli（Stanford University）、Justin Reich（Massachusetts Institute of Technology）、Geoffrey L. Cohen（Stanford University）。作者名與單位對 PDF 首頁核過。*Science* 355(6322)，251–252，2017-01-20（線上 2017-01-19）。DOI：10.1126/science.aag2063。**欄目是 Policy Forum**，副題「Brief interventions address social identity threat at scale」，正文兩頁，沒有摘要。
- **原文檔**：
  - PDF：`.research/raw/learning-content/q5-social/kizilcec2017-science.pdf`（3 頁：正文 2 頁＋出版者資訊頁 1 頁；`q1-learner/kizilcec2017science.pdf` 是同一個檔，位元組相同）。**這次讀的是這個 PDF 的版面。**
  - 清單指的文字檔：`q4-time/kizilcec2017-science-global-gaps.txt`（240 行、31,940 字元，`pdftotext -layout`，三欄交錯）。檔頭註記來源是 `uploads-ssl.webflow.com/…/Kizilcec et al 2017.pdf`。這個檔因為欄位交錯沒有拿來讀，只讀了檔頭。
- **版本**：刊出版（頁緣有 Science 的下載戳記，2017-01-24）。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 19（清單 D 第 19#11 列）
- **表格對照**：正文沒有表，有兩張圖。兩張圖都在 PDF 頁面上看過；第二張圖（長條圖）只有圖形，沒有印出各格數值，下面的數字都取自內文。
- **⚠ 補充材料沒有讀到，這一篇標為「正文讀完、方法未完成」。** 正文把方法、樣本排除、介入教材、穩健性分析全部指向註 5「Materials and methods are available as supplementary materials」。出版者頁面列了兩個補充檔：`kizilcec-sm.pdf` 與 `datasets-and-analysis.zip`（`https://www.science.org/doi/suppl/10.1126/science.aag2063/suppl_file/…`）。直接下載與用瀏覽器開都被出版者擋下（403），Wayback 沒有存檔，本機也沒有。需要有人用一般瀏覽器手動下載後再補讀。

位置用「頁碼＋欄（左／中／右）」標示，因為讀的是 PDF 版面。

## 研究設計

（以下只有正文交代的部分；細節在沒讀到的補充材料裡。）

- **類型**：兩個隨機實驗（第二個是第一個的複製），個人層級隨機分派到三個條件。
- **第一個實驗**（p.251 右欄）：Stanford 2014 年的一門電腦科學相關 MOOC；自訂進度、**不能拿完成證書**；教材共 286 個講課與測驗。結果變項是學習者接觸過的教材數（作者稱為 persistence）。分析樣本 2,286 人，其中 16% 在較低度發展國家。
- **複製實驗**（p.251 右欄）：一年後，Harvard 的一門美國公共政策 MOOC；梯次制、固定開課日、六週、八個依序的「章」。結果變項是接觸過的章數；另外可以量完成率（在多次評量拿到夠高的成績）。分析樣本 1,165 人，其中 7.4% 在較低度發展國家。
- **合計** N = 3,451（第二張圖的圖說）。
- **分組依據**（p.252 左欄）：國別由 IP 位址判定；依聯合國人類發展指數，HDI > 0.7 為較高度發展國家（MDC），HDI < 0.7 為較低度發展國家（LDC）。人數最多的 LDC 是印度、巴基斯坦、埃及；MDC 是美國、加拿大、英國。
- **三個條件**（p.251 中欄到右欄），都是放在課程開頭問卷裡的寫作活動：
  1. **價值關聯的自我肯定（value relevance affirmation）**：寫下修這門課如何反映並服務自己重視的價值。
  2. **社會歸屬（social-belonging）**：讀幾段自稱來自進階學習者的見證（一開始擔心自己屬不屬於這門課，後來自在了），摘要其中主題，再寫一封給未來學習者的短信。原文用的字是「ostensible testimonials」。
  3. **控制**：讀並寫讀書技巧，「an activity shown to have no impact on performance」（引 Conway 與 Ross 1984）。
- **花的時間**（p.251 右欄）：75% 的參與者在 10 分鐘內做完，中位數 4.5 分鐘。
- **分析**（p.252 左欄）：線性迴歸、robust 標準誤，比較 LDC 與 MDC 在三個條件下的結果。「Results were robust to alternative analytic techniques (5).」細節在補充材料。
- **何時量**：課程期間的行為記錄；沒有課後追蹤。
- **正文沒有交代的**：多少人被分派、多少人被排除、分析樣本怎麼定義（是否只含完成寫作活動的人）、各條件各群的人數、是否預先註冊、persistence 與完成率的原始平均數。

## 結果（逐項）

對照條件：以下「落差」都是 MDC 減 LDC；「效果」都是介入條件對控制條件（讀寫讀書技巧）。

### 背景相關（第一張圖，p.251）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 1 | 各國平均完成率與 HDI 的相關 | r = 0.78，P < 0.001；180 萬名學習者、55 門 Stanford 在 Coursera 上的 MOOC（2013–2015）；每點一個國家，n < 100 的國家排除；加權配適線 | p.251 圖說 | 「A weighted best-fit line is shown (r = 0.78, P < 0.001) (5).」 |
| 2 | 先前調查 | LDC 的人比 MDC 的人更擔心因國籍被負面看待 | p.251 左欄末到中欄 | 「An initial survey found that members of LDCs expressed greater concern about being seen negatively in MOOCs on the basis of their nationality than did members of more-developed countries (MDCs) (5).」（數字在補充材料） |

這是國家層級的相關，圖上縱軸的完成率大約落在 2% 到 12% 之間（目測）。

### 第一個實驗：持續量（接觸的教材數），N = 2,286（p.252 左欄）

| # | 結果 | 數字 | 原文一句 |
|---|---|---|---|
| 3 | 社會歸屬對 LDC | 持續量加倍；z = 2.68，P = 0.007 | 「both interventions doubled persistence for learners in LDCs (social belonging: z = 2.68, P = 0.007; affirmation: z = 2.82, P = 0.005)」 |
| 4 | 自我肯定對 LDC | 持續量加倍；z = 2.82，P = 0.005 | 同上 |
| 5 | 兩種介入對 MDC | 沒有影響；z 值都小於 0.36，P 值都大於 0.71 | 「as predicted, did not affect persistence for learners MDCs (z values < 0.36, P values > 0.71]」 |
| 6 | 控制條件的落差 | 95% CI (2.29, 6.17)，z = 4.28，P < 0.001（單位是教材數） | 「the significant global gap in persistence in the control condition」 |
| 7 | 社會歸屬條件的落差 | 95% CI (−4.22, 3.10)，z = −0.30，P = 0.765 | 「was closed both in the social-belonging condition」 |
| 8 | 自我肯定條件的落差 | 95% CI (−0.94, 3.29)，z = 1.09，P = 0.276 | 「and in the affirmation condition」 |

第二張圖（目測，圖沒有印數值）：控制條件下 MDC 約 8 個教材、LDC 約 3.5 個，總數 286 個。也就是說「加倍」是從 286 個教材裡的約 3.5 個到約 7–9 個。這是我看圖估的，不確定。

### 複製實驗：持續量（接觸的章數），N = 1,165（p.252 左欄到中欄）

| # | 結果 | 數字 | 原文一句 |
|---|---|---|---|
| 9 | 控制條件的落差 | 95% CI (0.74, 2.33)，z = 3.78，P < 0.001（單位是章數，共八章） | 「the gap in persistence in the control condition」 |
| 10 | 社會歸屬條件的落差 | 95% CI (−1.29, 0.93)，z = −0.32，P = 0.749 | 「was again closed in both the social-belonging condition」 |
| 11 | 自我肯定條件的落差 | 95% CI (−1.78, 0.22)，z = −1.52，P = 0.128 | 「and the affirmation condition」 |
| 12 | 社會歸屬對 LDC | +51%；z = 2.09，P = 0.036 | 「The socialbelonging intervention increased persistence for LDC learners by 51%」 |
| 13 | 社會歸屬對 MDC | 不顯著；**z = −1.67**，P = 0.094（方向為負） | 「without significantly affecting persistence for MDC learners [z = –1.67, P = 0.094]」 |
| 14 | 自我肯定對 LDC | +67%；z = 2.91，P = 0.004 | 「it increased persistence for LDC learners by 67%」 |
| 15 | **自我肯定對 MDC** | **−12%；z = −2.66，P = 0.008（顯著的負向）** | 「Although the affirmation intervention reduced persistence for MDC learners by 12%」 |

### 複製實驗：完成率（p.252 中欄）

| # | 結果 | 數字 | 原文一句 |
|---|---|---|---|
| 16 | 控制條件的落差 | 15 個百分點；95% CI (1, 30)，z = 2.12，P = 0.034 | 「The global gap in course completion in the control condition was 15 percentage points」 |
| 17 | 社會歸屬條件的落差 | 2 個百分點；95% CI (−17, 21)，z = 0.19，P = 0.847 | 「this gap was reduced to 2 pp」 |
| 18 | **社會歸屬對完成率的效果** | **對 LDC 不顯著（z = 0.91，P = 0.364）；對 MDC 不顯著（z = −0.84，P = 0.404）** | 「although the intervention's effect was not significant for LDC learners [z = 0.91, P = 0.364] or MDC learners [z = –0.84, P = 0.404].」 |
| 19 | 自我肯定條件的落差 | 反轉成 −18 個百分點；95% CI (−35, −1)，z = −2.04，P = 0.042 | 「the global gap in completion was reversed to –18 pp」 |
| 20 | **自我肯定對 MDC 的完成率** | **從 32% 降到 23%；z = −2.60，P = 0.009** | 「Although the affirmation intervention reduced the completion rate in MDCs from 32% to 23%」 |
| 21 | 自我肯定對 LDC 的完成率 | 從 17% 升到 41%；z = 2.26，P = 0.024 | 「it increased completion for LDC learners from 17% to 41%」 |

### 這些數字背後的人數（我算的，原文正文沒有給各格人數）

- 第一個實驗 LDC：2,286 × 16% ≈ 366 人，分到三個條件，每格約 120 人。
- 複製實驗 LDC：1,165 × 7.4% ≈ 86 人，分到三個條件，**每格約 29 人**。「17% → 41%」與「落差 15 個百分點」都建立在這個量級的人數上；控制條件落差的信賴區間是 1 到 30 個百分點。
- 同一批已完成的抽取紀錄 `kizilcec2020-scaling-interventions.md` 記的是：2020 年那篇把這項先前研究的樣本數列為 n = 64（24 個百分點的效果）。64 人與「兩格各約 29–32 人」對得上；精確人數要等補充材料。

## 作者自己列的限制與保留

正文沒有限制節。作者自己寫出來的保留只有這些（p.252 中欄）：

1. **自我肯定在複製實驗裡對 MDC 學習者有負面效果**：「Although the affirmation had a consistent positive effect for LDC learners, it had a negative effect in MDC learners in the replication experiment.」
2. 作者對這個負面效果的解釋是推測：先前研究指出肯定可能讓沒有受到心理威脅、或覺得沒有進步空間的人抽離（引 Vohs 等 2013）；「These effects have proved inconsistent in field research (10), but insofar as they occur, several reasons are plausible.」沒有檢定。
3. 作者提出的因應：「as these interventions are brief and involve private writing activities, they can be delivered only to learners expected to benefit.」（只對預期會受益的人投放）
4. 結尾說還需要更多研究：「The design of inclusive digital learning environments requires more research on the experiences and cues that trigger and alleviate social identity threat.」

**正文沒有提的**：LDC 樣本很小（尤其複製實驗）；兩門課、兩所學校、都是英語授課；第一個實驗沒有完成率可量，量的是接觸的教材數；社會歸屬的見證是「ostensible」（看起來像真的）而正文沒有討論這一點的倫理或效度；用 IP 判定國別；HDI 0.7 這個切點是否事先決定；有沒有預先註冊；分析樣本怎麼從註冊者篩出來。這些可能在補充材料裡有交代，沒讀到，不能下判斷。

## 與摘要說法不一致的地方

這篇沒有摘要。把標題、副題、導言末句、圖題當成作者的摘要性說法來對：

1. **標題「Closing global achievement gaps」、圖題「Interventions closed the average global gap」、導言「eliminating the global achievement gap」**：統計上的根據是「介入條件下的落差不顯著」（例如社會歸屬條件完成率落差 2 個百分點，95% CI −17 到 21）。區間寬到同時容得下「完全沒有落差」與「落差比控制條件還大」。「落差不顯著」與「落差被消除」不是同一件事；在每格約 29 個 LDC 學習者的複製實驗裡尤其如此。
2. **導言說介入「caused substantial improvements in MOOC persistence and completion rates among learners in LDCs」**：完成率只在複製實驗量過，兩種介入裡只有自我肯定對 LDC 的完成率顯著（17% → 41%，P = 0.024）；社會歸屬對 LDC 的完成率不顯著（P = 0.364）。「completion rates」這個複數說法只有一半成立。
3. **自我肯定條件下落差是「反轉」而不是「消除」**（−18 個百分點，P = 0.042），而且反轉有一半來自 MDC 學習者的完成率下降（32% → 23%）。也就是說「落差消失」部分是因為人數占九成以上的那一群變差了。以複製實驗的組成（MDC 占 92.6%）粗算，自我肯定讓全體的完成率是下降的；這是我依正文數字推的（0.926 × (23 − 32) + 0.074 × (41 − 17) ≈ −6.6 個百分點），原文沒有報告全體的效果，各格實際人數也不知道，只能當方向參考。
4. **副題「at scale」**：兩門課、合計 3,451 人，其中 LDC 約 450 人。
5. 正文說結果「consistent with predictions」「as predicted」，但沒有說預測是否事先登錄；自我肯定對 MDC 的負面效果顯然不在預測內（作者用「Although」帶過）。
6. 第一個實驗的課「no option to earn a certificate for completion」，所以該實驗沒有完成率；第二張圖三格裡只有最右一格是完成率，圖題卻寫「Course persistence and completion outcomes of two randomized experiments」。
7. 出版者資訊頁的版權年印 2016，刊期是 2017 年 1 月；照抄。

## 與清單「要撐的結論」不合的地方

清單寫：「被第 3 列複製失敗的原始研究之一」（第 3 列是 Kizilcec 等 2020，PNAS）。

- **大方向對，但「複製失敗」要寫細，而且只涉及這篇兩種介入裡的一種。** 依同批的 `kizilcec2020-scaling-interventions.md`：2020 年那篇測的是價值關聯（即本篇的自我肯定），沒有再測社會歸屬。結果是在全部課程裡對 LDC 學習者沒有效果（兩年 β = 0.14 與 −0.04 個百分點），只在「事後判定有全球落差」的課裡有約 2.8 個百分點，約為本篇 24 個百分點的十分之一；在沒有落差的課反而降低完成率。所以比較準的寫法是「價值關聯那一項沒有照原樣複製，剩下的效果限於一部分課程、約為原來的十分之一」；社會歸屬那一項在這條線上沒有後續檢驗。
- **本篇自己就有反向結果，不必等 2020 年才出現。** 自我肯定在複製實驗裡讓 MDC 學習者的持續量少 12%（P = 0.008）、完成率從 32% 降到 23%（P = 0.009）。2020 年那篇「在沒有落差的課反而降低完成率」的結果，方向和這裡一致。文章如果要寫「輕量介入可能有害」，這是原始研究裡就有的數字。
- **「17% → 41%」這個常被引用的數字，分母很小。** 複製實驗的 LDC 學習者合計約 86 人，每格約 29 人（我算的）。引用時要帶人數與「單一課程」。
- **這是 Policy Forum 短文，方法全在補充材料，而補充材料這次沒有讀到。** 在補讀之前，不能替它寫分析樣本的定義、排除比例、是否只含完成寫作活動的人、是否預先註冊。清單把它當成「原始研究」來和 2020 年對照是可以的，但只能引正文有的數字。
- 清單「之前讀到哪」寫「只讀到前言（雙欄轉文字交錯）」：這次改讀 PDF 版面，正文兩頁全部讀完。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | PDF 第 1 頁（期刊 p.251），左欄→中欄→右欄 | 標題、副題、作者與單位、導言、社會認同威脅的背景、兩種介入的做法、兩個實驗的課程與結果變項、三個條件、完成時間、樣本數；第一張圖與圖說 |
| 2 | PDF 第 2 頁（期刊 p.252），左欄→中欄→右欄 | 國別與 LDC／MDC 的定義、分析方法、第一個實驗結果、複製實驗的持續量與完成率結果、對自我肯定負面效果的討論、政策含意與結語；參考文獻與註 1–18（書目，掃過；註 5 指向補充材料）；致謝；補充材料連結；第二張圖與圖說 |
| 3 | PDF 第 3 頁 | 出版者資訊頁（引用格式、權限、版權聲明），沒有內容 |
| 對圖 | PDF 第 1、2 頁 | 兩張圖都在版面上看過；第二張圖沒有印數值，各格高度只做目測 |

**沒有讀到**：補充材料（`kizilcec-sm.pdf`，含 Materials and Methods、介入教材與受試者回應摘錄、初步調查、穩健性分析）與資料檔（`datasets-and-analysis.zip`）。原因：出版者網站擋自動下載（403），沒有公開存檔。`q4-time/kizilcec2017-science-global-gaps.txt` 因三欄交錯沒有拿來讀；`q5-social/kizilcec2017-science.txt`（239 行）也沒有另外讀，兩者都是同一份 PDF 的轉檔。
