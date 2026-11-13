依據版本（2026-10-14 換版重對後）：本紀錄的數字、原文句與行號一律對 ACM 刊出版（`ericson2023-parsons-wg-acm-dl.txt`，5,941 行），已從頭依序整份重讀；原本讀的出版前作者稿不再當來源，只在作者稿出現的內容已標「合法版本無此內容，不得引用」。

# 抽取紀錄：Ericson 等 2023，Multi-Institutional Multi-National Studies of Parsons Problems（ITiCSE-WGR '23）

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3623762.3633498（刊出版，gold OA，2026-10-14 核對）。原文檔 `.research/raw/learning-content/q2-interactive/ericson2023-parsons-wg-acm-dl.pdf`（51 頁）與 `.txt`。
- **舊版本的去處**：2026-10-14 以前本紀錄讀的是取得網址查不到的作者稿（`ericson2023-parsons-wg.pdf`／`.txt`，110 頁，首頁 DOI 套錯成 2022 年報告的 `10.1145/3571785.3574127`，留有佔位句「a total of x participants」）。那份檔仍在 raw 目錄，不得當來源。兩版差異見檔尾「2026-10-14 換版重對」。

## 檔頭

- **作者（對刊出版首頁 L1–72 與 ACM Reference Format L172–178 核過，共 12 人）**：Barbara J. Ericson（University of Michigan，共同召集人）、Janice L. Pearce（Berea College／Ashesi University，共同召集人）、Susan H. Rodger（Duke University，共同召集人）、Andrew Csizmadia（Newman University）、Rita Garcia（Victoria University of Wellington）、Francisco J. Gutierrez（University of Chile）、Konstantinos Liaskos（University of Strathclyde）、Aadarsh Padiyath（University of Michigan）、Michael James Scott（Falmouth University）、David H. Smith IV（University of Illinois at Urbana-Champaign）、Jayakrishnan M Warriem（IIT Madras）、Angela Zavaleta Bernuy（University of Toronto）。
- **刊物**：Proceedings of the 2023 Working Group Reports on Innovation and Technology in Computer Science Education（ITiCSE-WGR 2023），July 7–12, 2023, Turku, Finland，ACM，51 頁（L172–178）。
- **DOI**：10.1145/3623762.3633498（首頁 L126；Crossref 先前查過：頁碼 57–107，出版日 2023-12-22）。版權行「© 2023 Copyright held by the owner/author(s). Publication rights licensed to ACM.」（L124）。
- **版本：刊出版（ACM 出版者 PDF）。** 雙欄排版，文內印的頁碼 57–107；PDF 第 N 頁＝印的頁碼 56＋N。刊出版沒有作者稿的附錄 A（題目截圖），改指向補充材料網站 parsonsproblems.github.io（L5510–5513，L2152–2153）；該網站本紀錄**沒有讀**。
- **原文檔**：`.research/raw/learning-content/q2-interactive/ericson2023-parsons-wg-acm-dl.pdf`（51 頁）、`.research/raw/learning-content/q2-interactive/ericson2023-parsons-wg-acm-dl.txt`（5,941 行、244,437 字元）。`.txt` 是不帶 `-layout` 的抽字，雙欄段落在分欄處前後交錯（例如摘要後半在 L76–91、前半在 L93–110；6.2.1 開頭在 L4538，接續段落在 L4502–4532），表格拆成一行一格。下面行號一律是這份 `.txt` 的行號；「p.N」是文內印的頁碼。
- **讀取日期**：2026-10-14（作者稿首讀）；2026-10-14 依刊出版整份重讀。
- **供哪幾篇使用**：order 3（程式碼），清單 A 第 3#4 列。

## 這份報告實際包含什麼

不是一篇單一實驗，是工作小組報告，四塊內容：

1. Parsons 題文獻的增補回顧（2022 回顧之後到 2023 年 8 月的 20 篇，第 2 節，L389–606、Table 1–4）。
2. 電腦科學教育裡「多機構、多國」（MIMN）研究的文獻回顧（第 3 節，L548–1890）。
3. 自己跑的放聲思考觀察（6.1 節，L3362–4498，四所學校，26 人次）。
4. 自己跑的量化研究（6.2 節，L4500–4797）：python-swap（單組、無對照）、class-exp（有干擾項對無干擾項）、p3pt（Parsons 題對寫程式題）、jspt（西班牙文 JavaScript 版，只按自我效能高低比，沒有報告條件間比較）。

設計了但**沒有報告任何結果**的研究：class-tog（寫程式題附 Parsons 題當鷹架對不附）、p3dnd（較難題目的有無干擾項）、cdnd、c-swap。多倫多大學收了 c-swap 51 份、c3-dnd 67 份回應（L3326–3332、Table 9 L2874–2887），結果節完全沒出現。

## 研究設計

### 共同流程（第 4 節，L2043–2047、Figure 2 L1965–1985）

- 每項研究都有：說明頁 → 前問卷 → 題型介紹（含示範影片與練習題）→ 練習題（實驗操弄在這裡）→ 後測；另有選用的前測（10 題選擇題，L2122–2153）與選用的後問卷（L2172–2229）。
- 平台：Runestone Academy 互動電子書（L2412–2413）；智利大學因教學語言是西班牙文，改用自己的系統（L2576–2577、L5163–5165），而且**智利版的 Parsons 題不是 adaptive**（L3153–3155「However, these Parsons problems were not adaptive.」）。
- 分派：「In between-subjects studies, students were pseudo-randomly placed in condition A or B.」（L2057–2058）。怎麼產生「偽隨機」原文沒寫。
- 說明頁告訴學生一題卡住多久就放棄：五分鐘（L2053–2055）。
- **沒有用前測比較兩組起點**，改用前問卷的自評（L2074–2076、L2154–2156「To compare groups, we instead used the self-evaluation ratings on particular concepts.」）：6 題電腦自我效能（Wiggins 等 [119] 的量表，1–5 分，L2064–2073）加上各研究指定概念的熟悉度自評（5 點，L2074–2077、L2103–2110）。前測若要用，建議另一天做（L2156–2158）。
- **後測在同一次活動裡緊接著練習做**：三個受試者間研究（p3pt、class-exp、class-tog）全程 50–70 分鐘，python-swap 20–30 分鐘（L2011–2013）；沒有延宕後測。原文沒有寫任何隔天或隔週的測量。
- 「adaptive Parsons problems」：題目難度可依學習者表現動態調整（L142–143、L154–156），有「Help Me」按鈕，按下會拿掉一個干擾項或把兩塊合成一塊（L4327–4328，出自 p3dndta 的描述）；完整調整規則本報告沒有說明，只引 [26, 29]。

### 各研究

| 研究 | 類型 | 比較 | 題數 | 教材概念 | 出處 |
|---|---|---|---|---|---|
| p3pt | 受試者間 | 練習時解「有干擾項的 adaptive Parsons 題」對「寫等價的程式」 | 刊出版只附第一題練習題（Figure 8，L2245）；題數在 Table 20、21 看得出後測 4 題（Q1–Q4，兩題改錯、兩題寫程式由 Table 21 欄位推得） | Python 基礎：變數、取餘、字串（含切片）、迴圈、條件、串列、帶參數的函式、單元測試；約 50 分鐘 | L2191–2207 |
| jspt | p3pt 的 JavaScript、西班牙文版 | 設計同 p3pt；結果節沒有報條件間比較 | 4 題 Parsons、4 題寫程式（Table 15） | 同上 | L2231–2265 |
| class-exp | 受試者間 | 練習時解「有干擾項」對「無干擾項」的 adaptive Parsons 題 | 密西根大學 4 題練習、4 題後測（class-exp-4q）；其他學校各 5 題（class-exp-5q）；後測混合「改錯」與「寫程式」題（Table 16–17） | Python 類別：`__init__`、`__str__`、`self`、實例變數；先給一段類別的簡短教學；約 60 分鐘 | L2292–2304、L2332–2336、L3233–3235、L4577–4580 |
| class-tog | 受試者間 | 寫程式題可叫出 Parsons 題當鷹架，對不可叫出 | 同 class-exp | 同 class-exp | L2345–2353；**無結果** |
| python-swap | **單組、無對照**。原文稱它「within-subject study」（L2012），又說「this study did not involve the random assignment of students to conditions」（L2288–2289） | 無 | 3 題 Parsons（只有虛擬碼註解 → 註解加程式 → 只有程式），後測 2 題寫程式（第 1 題變數名同練習 x、y、temp，第 2 題換成 a、b、temp 測近遷移） | 交換兩個變數的值；20–30 分鐘 | L2267–2285、L2011–2013 |
| c-swap | python-swap 的 C 版 | 無 | 第 3 題與後測第 2 題改成交換字串 | 同上 | L2305–2330；**無結果** |
| p3dnd／cdnd | 受試者間 | 有無干擾項，題目取自 LeetCode、CodingBat，比 p3pt 難 | 刊出版只附第一題（Figure 18） | Python／C 基礎；約 60 分鐘 | L2355–2376、L2386–2390；**無結果** |
| class-exp-ta（class-ta）、p3dnd-ta | 放聲思考版 | 同一人交替做有、無干擾項的題 | — | — | L2030–2042、L2337–2344、L2378–2384 |

- class-exp-ta 的 A、B 兩個順序，第 4 節開頭（L2034–2035：A＝ND, WD, ND, WD, TP）與 4.6.4（L2341–2342：A＝WD, ND, WD, ND, TP）寫的相反。

### 參與學校與受試者（第 5 節、Table 7–9；Table 8–9 對過 PDF p.80 版面）

- 第 5 節開頭寫「each of the 11 institutions」（L2415），與 Table 7（L2428–2572）列的 11 所一致：Ashesi（迦納）、Berea（美）、Duke（美）、Falmouth（英格蘭）、IIT Madras（印度）、University of Chile、UIUC（美）、Michigan（美）、Strathclyde（蘇格蘭）、Toronto（加）、Victoria University of Wellington（紐西蘭）。DePaul University 貢獻了 class-exp 與 p3pt 的資料（L4565、L4663、致謝 L5504–5506）但不在 Table 7、8、9。
- Table 9（修課人數／參與人數／參與方式／研究，L2743–2923）：
  - Ashesi：290／212 | 212／必做／python-swap、p3pt。文字：六個班 290 人，268 人交了部分作業，212 人同意，只分析這 212 人（L2946–2949）；作業計分，沒解出來的題只要花滿 5 分鐘就給分（L2943–2944）。
  - Berea：31／25 | 2 | 1／必做／class-exp、class-ta、p3pt-ta。文字：25 人同意，只有 14 人做完可分析（L2976–2979）；17 人的放聲思考名單裡依時間方便選 3 人，經學校工讀制度付時薪 9.50 美元（L2979–2996）。
  - Duke：217／130／必做／class-exp。整堂實驗課、依參與計分；約 60%（130 人）同意（L3030–3045）。
  - Falmouth：85／32／自願／python-swap、p3pt、class-exp。線上同步課，不計分（L3049–3052）。
  - IIT Madras：1,632／**50**／自願／p3pt。**文字寫「A total of 152 students provided consent for this study.」（L3093–3094），結果節寫 N = 152（L4663–4664），與表上的 50 不合。** 這批學生是前一期沒通過必考程式測驗、重修的人（L3073–3075）；課程全線上；很多人跳過中間頁面直接做後測，或看過開頭就離開（L3148–3151）。5–8 月那一批想重做，1,639 人只來 7 人，放棄（L3172–3176）。
  - University of Chile：35／35／必做／jspt。線上 bootcamp 的學員，24–55 歲，沒有 STEM 背景（L3245–3249）；必做但不計分（L3155–3158）。
  - UIUC：989／5／自願／python-swap（放聲思考，時薪 15 美元，L3194–3198）。
  - Michigan：191／155／必做／class-exp（早期版，4 題，L3233–3235、L3259–3261）。
  - Strathclyde：86／6／自願／python-swap（放聲思考，L3338–3341、L3274–3299）。
  - Toronto：150／51 | 67／有加分／c-swap、p3-dnd。
  - VUW：169／7／自願／p3pt。參與率 4%，原因沒查（L3215–3221）。
- 學生先前碰過 Parsons 題的情況各校不同：Ashesi（L2939–2943）、Berea（L2972–2974）、Duke（少量，L3033–3035）、UIUC（L3192–3193）、Michigan（L3241–3257）的學生都用過；Falmouth（L3121–3123）、IIT Madras（L3080–3081）、Strathclyde（L3273、L3296）的學生沒用過；智利的學員上課時用過非 adaptive 的版本（L3153–3155）。

## 結果（逐項）

### A. p3pt：Parsons 題練習對寫程式練習（6.2.3 節，L4662–4720；Table 20–21 對過 PDF p.100、Table 22 對過 p.101 版面）

| # | 結果 | 數字與對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| A1 | 樣本 | Ashesi 168、DePaul 39、Falmouth 10、VUW 7、IIT Madras 152，原文寫合計 369。**五校相加是 376，不是 369。** | 6.2.3 | L4662–4665 | 「Quantitative studies of p3pt were conducted at Ashesi University (𝑁 = 168), DePaul University (𝑁 = 39), Falmouth University (𝑁 = 10), Victoria University of Wellington (𝑁 = 7), and IIT Madras (𝑁 = 152), with a total of 369 participants contributing to this study.」 |
| A2 | 分組人數 | 自我效能高 175、低 226；先備知識高 133、低 268。**兩種分法各自相加都是 401，與 369、376 都不合。** 每個條件各幾人原文沒寫。切點怎麼定原文沒寫。 | 6.2.3 | L4666–4673 | 「those with high (𝑁 = 175, 𝑀 = 18.77, 𝑆𝐷 = 2.42) and low (𝑁 = 226, 𝑀 = 11.74, 𝑆𝐷 = 3.2) self-efficacy, and those with high (𝑁 = 133, 𝑀 = 13.99, 𝑆𝐷 = 1.60) and low (𝑁 = 268, 𝑀 = 9.01, 𝑆𝐷 = 1.92) preexisting knowledge」 |
| A3 | 兩組起點 | 自我效能 U = 17862.0，p = 0.72；先備知識 U = 6384.5，p = 0.80。量表 Cronbach's α = 0.870。這句把條件寫成「with and without distractors」，是從 class-exp 那段複製過來沒改。 | 6.2.3 | L4672–4675、L4700–4702 | 「We used Mann-Whitney U Tests to check if the conditions (with and without distractors) were comparable … Therefore, the conditions are comparable.」 |
| A4 | **後測成績：無差別** | Parsons 練習組平均 107/400，寫程式練習組平均 111/400；Mann-Whitney U = 20648.0，p = 0.60。沒有給標準差、效果量、信賴區間。兩組平均都只有滿分的 27–28%。 | 6.2.3 | L4703–4704 | 「We found no significant difference in comparing students’ performance in the posttest by their practice condition using a Mann-Whitney U-test (𝑈 = 20648.0, 𝑝 = 0.60). Students in the Parsons problems practice condition scored on average 107/400, and students in the write-code condition scored on average 111/400.」 |
| A5 | 後測有沒有去做：無差別 | Table 21（wc＝寫程式練習，pp＝Parsons 練習）。全體：四題都做 0.25 對 0.22（χ² = 0.38，p = 0.53）；至少做一題 0.47 對 0.51（χ² = 0.55，p = 0.45）；改錯題都做 0.35 對 0.37（p = 0.87）；寫程式題都做 0.28 對 0.26（p = 0.73）。**也就是兩組都只有約一半的人碰過任何一題後測，四題做完的約四分之一。** | Table 21 | L4928–4946、L5013–5016、L4704–4706 | 「We also found no significant difference in condition of whether students attempted all or any of the posttest problems, as shown in Table 21.」 |
| A6 | Table 21 各子群 | 低自我效能：都做 0.21 對 0.21（p = 1.0）；至少一題 0.41 對 0.56（χ² = 3.48，p = 0.06）；改錯 0.31 對 0.41（p = 0.17）；寫程式 0.23 對 0.27（p = 0.69）。高自我效能：0.29 對 0.23（p = 0.40）；0.52 對 0.48（p = 0.59）；0.40 對 0.33（p = 0.39）；0.32 對 0.25（p = 0.32）。低先備：0.30 對 0.26（p = 0.53）；0.52 對 0.54（p = 0.81）；0.42 對 0.39（p = 0.73）；0.33 對 0.30（p = 0.73）。高先備：0.16 對 0.14（p = 0.89）；0.39 對 0.47（p = 0.49）；0.24 對 0.32（p = 0.38）；0.19 對 0.17（p = 0.95）。全部不顯著。 | Table 21 | L4947–5012 | 表列 |
| A7 | 答對前的嘗試次數（Table 22） | 全體：寫程式組 6.32 次、Parsons 組 9.82 次，U = 21438.0，**p = 0.21（不顯著）**，Cliff's δ = 0.067。低自我效能：3.55 對 8.61，U = 4541.5，p = 0.018，δ = 0.19。高自我效能：8.69 對 10.66，U = 6189.5，p = 0.68，δ = −0.030。低先備：7.15 對 11.15，U = 9424.5，p = 0.45，δ = 0.050。高先備：4.77 對 6.91，U = 2403.5，p = 0.31，δ = 0.092。內文只說低自我效能子群顯著（L4706–4709），與表一致。表題沒說是練習題還是後測的嘗試次數。 | Table 22 | L5064–5100、L4706–4709 | 表題「Number of attempts students in p3pt study took until passing all unit tests, separated by whether the students practiced using write-code problems (wc) or Parsons problems (pp), alongside a Mann-Whitney 𝑈-test of statistical significance, its respective p-value, and its Cliff’s 𝛿 effect size.」 |
| A8 | **練習時間：無差別** | Parsons 組平均總時間 1783 秒，寫程式組 1600 秒，獨立樣本 t 檢定 p = 0.58。數值上 Parsons 組多花 183 秒。 | 6.2.3 | L4710–4715 | 「We found no significant difference between the average total time to completion of students with Parsons problems (1783 seconds) to the average total time to completion of students with write-code problems (1600 seconds) with an independent t-test value of p=0.58.」 |
| A9 | 後測作答時間（Table 20） | 總時間：寫程式練習組 1270 秒、Parsons 練習組 1882 秒，p = 0.068。Q1：292 對 566 秒，**p = 0.017（Parsons 練習組較慢）**。Q2：307 對 445，p = 0.16。Q3：229 對 350，p = 0.15。Q4：435 對 431，p = 0.98。表題把寫程式組誤標成「(wd)」。 | Table 20 | L4906–4926、L5022–5036、L5055–5056、L4716–4720、L4696–4698 | 「There was a broad trend in those shown write-code questions completing the problems faster. This was found to not be significant in the posttest altogether, as well as separately for each posttest question, excluding the first question, as shown in Table 20.」 |
| A10 | 作者在討論節的總結 | 成績無差別「重現先前發現」；練習時間無差別「與先前研究明顯不同」。這裡寫「four institutions」，結果節列的是五所。 | 7.3.2 | L5387–5391、L5293–5297 | 「There was no significant difference in learning performance by condition which replicates prior findings. However, there was also no significant difference in practice time. This is notably different from previous research which found students can often complete Parsons problems significantly faster than writing the equivalent code, unless a Parsons problem solution is unusual [26, 29]. More work needs to be done to test the learning efficiency of solving Parsons problems versus writing the equivalent code.」 |

### B. class-exp：有干擾項對無干擾項（6.2.2 節，L4565–4618、L4677–4687；Table 16–17 對過 PDF p.97、Table 18–19 對過 p.100 版面）

| # | 結果 | 數字與對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| B1 | 樣本 | DePaul 42、Duke 130、Berea 14、Falmouth 20、Michigan 155，合計 361（相加相符）。Michigan 做 4 題版，其餘 206 人做 5 題版。每個條件各幾人原文沒寫。 | 6.2.2 | L4565–4580 | 「with a total of 361 participants contributing to this study」 |
| B2 | 兩組起點 | 自我效能 U = 16638.5，p = 0.70；先備知識 U = 16638.5，p = 0.92。兩個檢定的 U 值一模一樣，可能是筆誤，無從判斷。原文說用 Mann-Whitney 是因為資料不符常態（L4585）。 | 6.2.2 | L4581–4585 | 「for self-efficacy, 𝑈 = 16638.5, 𝑝 = 0.70; for pre-existing knowledge 𝑈 = 16638.5, 𝑝 = 0.92. Therefore, the conditions are comparable.」 |
| B3 | **後測成績：無差別** | 5 題版：有干擾項 335/500（67%）對無干擾項 311/500（62%），p = 0.56。4 題版：304/400（76%）對 276/400（69%），p = 0.45。這兩個 p 值沒有附檢定統計量；檢定法依同段 L4585 的說明推定為 Mann-Whitney。 | 6.2.2 | L4586–4592 | 「The difference in the averages (with distractors: 335/500, 67%; without distractors: 311/500, 62%) were not statistically significant (𝑝 = 0.56). For the class-exp-4q group too, the average posttest score differences (with distractors: 304/400, 76%; without distractors: 276/400, 69%) were statistically not significant (𝑝 = 0.45).」 |
| B4 | 分組 | 自我效能高 153（M 19.12，SD 2.56）、低 208（M 11.52，SD 3.90）；先備高 155（M 10.81，SD 2.95）、低 206（M 2.67，SD 1.91）。α = 0.877。切點怎麼定原文沒寫。 | 6.2.2 | L4593–4603 | 「There were 153 students in the high self-efficacy group (𝑀 = 19.12, 𝑆𝐷 = 2.56) and 208 students in the low self-efficacy group (𝑀 = 11.52, 𝑆𝐷 = 3.90)」 |
| B5 | 後測流失（Table 16、17） | Michigan 以外（N = 206）各題有作答的人數：Q1 改錯 173、Q2 改錯 142、Q3 寫程式 149、Q4 寫程式 139、Q5 改錯 118。Michigan（N = 155）：Q1 改錯 131、Q3 寫程式 116、Q4 寫程式 112、Q5 改錯 108。 | Table 16、17 | L4626–4660、L4604–4605 | 「In this study, we found a decline in participation in the posttest, as shown in Tables 16 and 17.」 |
| B6 | 有沒有去做後測：全體無差別（Table 18，wd＝有干擾項，nd＝無） | 全部都做 0.63 對 0.55（χ² = 2.22，p = 0.14）；改錯題都做 0.65 對 0.57（p = 0.16）；寫程式題都做 0.73 對 0.65（p = 0.16）。 | Table 18 | L4817–4826、L4605–4608 | 「the students who were provided with the distractors were generally more likely to attempt problems on the posttest, although none were statistically significant, as shown in Table 18.」 |
| B7 | 低自我效能子群 | 全部都做 0.55 對 0.37（χ² = 3.83，**p = 0.05**）；改錯題 0.55 對 0.41（p = 0.13）；寫程式題 0.68 對 0.46（χ² = 6.15，p = 0.013）。 | Table 18 | L4827–4836 | 「we found students with lower self-efficacy or lesser preexisting knowledge demonstrated a significantly higher likelihood of attempting all problems on the posttest, particularly the write-code problems, when exposed to distractors during practice」（L4608–4612） |
| B8 | 低先備子群 | 全部都做 0.66 對 0.51（χ² = 4.12，p = 0.04）；改錯題 0.66 對 0.54（p = 0.10）；寫程式題 0.77 對 0.62（χ² = 4.49，p = 0.03）。 | Table 18 | L4848–4857 | 同上 |
| B9 | 高自我效能、高先備子群 | 高自我效能：0.70 對 0.68（p = 1.0）；0.72 對 0.69（p = 0.78）；0.76 對 0.80（p = 0.63）。高先備：0.60 對 0.61（p = 1.0）；0.63 對 0.61（p = 0.95）；0.68 對 0.70（p = 0.90）。全部不顯著，方向也不一致。 | Table 18 | L4837–4847、L4858–4868 | 表列 |
| B10 | 後測作答時間（Table 19，5 題版，獨立樣本 t 檢定） | 總時間：有干擾項 1002 秒對無干擾項 1127 秒，p = 0.44。Q1 154 對 143（p = 0.78）；Q2 200 對 218（p = 0.61）；Q3 232 對 305（**p = 0.016**）；Q4 158 對 183（p = 0.41）；Q5 192 對 201（p = 0.65）。內文說顯著的是「Movie」那題、快一分鐘；表上顯著的是 Q3、差 73 秒。刊出版沒有附後測題目，**Movie 是哪一題在刊出版裡對不出來**。 | Table 19 | L4874–4904、L5018–5020、L4613–4618、L4677–4678 | 「we did not find a significant difference in time taken to complete the posttest, except for with the Movie posttest problem, in which students who were shown the distractors completed the problem a minute faster (on an average) than those who were not shown them」 |
| B11 | **後測語法錯誤數：有干擾項的較少** | 5 題版：平均 18 個對 23 個，Mann-Whitney U = 4352.0，p = 0.03，Cliff's δ = −0.18。4 題版：13 個對 19 個，U = 2160.5，p = 0.003，δ = −0.28。「語法錯誤」怎麼計數（哪些題、每次送出還是最後一版、有沒有除以作答題數）原文沒寫；沒有標準差。 | 6.2.2 | L4679–4687 | 「Those who were shown distractors (class-exp-5q: 18 average errors, class-exp-4q: 13 average errors) made significantly fewer errors in the posttest, compared to those who were not shown distractors (class-exp-5q: 23 average errors, class-exp-4q: 19 average errors). These comparisons were conducted following a Mann-Whitney 𝑈 test (class-exp-5q: 𝑝 = 0.03, 𝑈 = 4352.0, Cliff’s 𝛿 = -0.18; class-exp-4q: 𝑝 = 0.003, 𝑈 = 2160.5, Cliff’s 𝛿 = -0.28).」 |
| B12 | 密西根早期版 | 刊出版只寫密西根跑的是 class-exp 的早期版、4 題練習 4 題後測、155 人做完、作答就給分（L3233–3235、L3259–3261）。**作者稿裡「早期版沒有發現顯著差異，因此加一題練習與一題後測」那句，合法版本無此內容，不得引用。** | 5.9 | L3232–3261 | 「We ran an early version of class-exp with four practice problems and four posttest problems」 |
| B13 | 作者在討論節的總結 | 五校 361 人；成績差異不顯著；寫程式時錯誤較少；「進一步支持」干擾項有助於辨認並避開常見錯誤的假設；低自我效能與低先備的學生較願意做後測。 | 7.3.2 | L5316–5328 | 「While those in the distractor condition had a higher average score on the posttest than those in the no distractor condition, the difference was not statistically significant. However, students in the Parsons problems with distractors condition had significantly less errors while writing code for the posttest questions … This further supports the hypothesis that solving Parsons problems with distractors can help students recognize and avoid common errors.」 |

### C. python-swap 量化（6.2.1 節，L4538–4555、L4502–4532；Figure 19–24 看過 PDF p.95–99 頁面影像）

| # | 結果 | 數字與條件 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| C1 | 設計 | Falmouth 與 Ashesi 兩校，單組、沒有對照組。**量化分析的人數刊出版完全沒寫**（6.2.1 與 7.3.2 都只寫兩校）。Table 9 上兩校的同意人數是 212 與 32。作者稿那句佔位句「a total of x participants」合法版本無此內容，不得引用。 | 6.2.1、7.3.2 | L4538、L5341–5343 | 「Quantitative studies were conducted at Falmouth and Ashesi Universities.」 |
| C2 | 兩校自我效能 | 無顯著差異，t = −0.56，p = 0.57。 | 6.2.1 | L4542–4545 | 「though this was not a statistically significant difference (𝑡 = −0.56, 𝑝 = 0.57)」 |
| C3 | 最後一題寫程式的完成率 | 內文：「超過 80%」。Figure 21（縱軸 0.8–1，我目測）：Ashesi 約 0.86、Falmouth 約 0.84。圖題寫「Drop-off rate」，圖內標題與畫的其實是完成比例。**沒有不做 Parsons 題直接寫的對照。** | 6.2.1、Figure 21 | L4508–4510、L4574 | 「More than 80% of participants successfully completed the final code-writing exercises.」 |
| C4 | 只有虛擬碼註解的那題 Parsons | 完成率明顯掉（Figure 21 目測：Ashesi 約 0.885、Falmouth 約 0.87）；平均嘗試次數兩校都超過 6 次（Figure 22 目測：Falmouth 約 8.6、Ashesi 約 6.6）；Ashesi 平均約 190 秒（Figure 23 目測），是所有題裡最久的。 | 6.2.1、Figure 21–23 | L4511–4518 | 「there is a noticeable increase in the number of attempts required to complete the pseudocode comment blocks Parsons problem, requiring an average more than six attempts in both cohorts.」 |
| C5 | 相關 | 自我效能與最後寫程式題分數 r = 0.41，p = 0.024。自評熟悉度與 Parsons 題嘗試次數 r = −0.37，原文印「𝑝 < 0.5」（應是筆誤）。熟悉度與寫程式嘗試次數 r = 0.1，p = 0.38。熟悉度與最後寫程式題是否成功 r = 0.054，p = 0.77。Figure 20 圖例寫的是 Spearman 相關。 | 6.2.1、Figure 20 | L4546–4555、L4502–4504 | 「Crucially, there was no correlation between those students succeeding on the final code-writing task and their familiarity with the value-swapping problem (𝑟 = 0.054, 𝑝 = 0.77).」 |
| C6 | 作者對 C5 的推論 | 「這表示 Parsons 題練習能拉平有無經驗者的差距」。這是從一個不顯著的相關、在沒有對照組的情況下推出來的；兩校學生多數自評熟悉（Figure 19 兩校最高那格人數最多）。 | 6.2.1 | L4505–4506、L4539–4541 | 「This implies the Parsons problem practice was able to close the experience gap between those who were familiar with the algorithm and those who were not.」 |
| C7 | 後測兩題 | 完成第一題的人多半也完成第二題；第二題（近遷移）花的時間比第一題少（Figure 23 目測 Ashesi：約 133 秒對約 58 秒；Figure 24 目測 Falmouth：約 45 秒對約 23 秒）。 | 6.2.1 | L4521–4532 | 「students tended to complete the second code writing problem designed to verify near transfer in less time than the firsts」 |
| C8 | 討論節的說法 | 「多數學生（80%）」能在解三題 Parsons 之後寫出交換程式；「加強了」Parsons 題能幫學生學會重現常見演算法的證據；虛擬碼題平均約六次嘗試。另寫「寫程式題通常比 Parsons 題用更少次嘗試、更少時間」。對照 Figure 23（目測）：Ashesi 第一題寫程式約 133 秒，比第二題 Parsons（約 100 秒）與第三題 Parsons（約 48 秒）都久，只比第一題 Parsons 短。 | 7.3.2 | L5341–5362 | 「Most students (80%) could successfully write code to swap the values of two variables after solving three Parsons problems … This finding strengthens the evidence that solving Parsons problems can help students learn to reproduce common algorithms.」 |

### D. jspt 量化（6.2.4 節，L4721–4741、L4750–4752、L4791–4797；Figure 25 看過 PDF p.99）

| # | 結果 | 數字與條件 | 行號 | 原文一句 |
|---|---|---|---|---|
| D1 | 樣本與分組 | N = 31（修課 35 人），依自我效能中位數 3.5 分成高 16、低 15；α = 0.91。**只比自我效能高低，沒有報 Parsons 對寫程式的條件比較。** | L4721–4726 | 「we divided the study sample (𝑁 = 31, 𝑀𝑒𝑑 = 3.5) into two groups」 |
| D2 | 解完的 Parsons 題數 | 高自我效能中位數 4 題、低自我效能 2 題，U = 161.5，p = 0.086，不顯著；Cliff's δ = 0.346（原文稱中等效果量）。 | L4731–4741 | 「We did not observe a statistically significant difference in the number of correctly completed problems (𝑈 = 161.5, 𝑝 = 0.086)」 |
| D3 | 四題全對者的平均完成時間 | 高自我效能 9 人（56.25%）M = 437.76、SD = 158.89；低自我效能 5 人（33.3%）M = 519.66、SD = 141.19；Welch t(9.3055) = 0.9938，p = 0.3455；d = 0.534（原文稱中等）。單位原文沒寫。 | L4791–4797、L4750–4752 | 「we did not observe a statistically significant difference in the mean time to completion」 |

### E. 放聲思考觀察（6.1 節，L3362–4498）

- **人數**：Table 10 列 26 人次——class-ta 2、p3dnd-ta 1、python-swap 11、jspt 12（L3402–3427）。在 Berea、UIUC、Strathclyde、智利大學四校做（L3366–3367）。
- **python-swap（11 人，L3672–4022；Table 12 對過 PDF p.89 版面）**
  - 各題嘗試次數（Parsons 1／2／3／寫程式 1／2）：1 號 5/2/1/1/1；2 號 4/1/1/1/1；3 號 1/1/1/1/1；4 號 5/2/2/5/1；5 號 3/1/1/1/1；6 號 9/4/1/8/1；7 號 1/1/1/1/1；8 號 2/1/1/1/1；9 號 6/2/2/2/1；10 號 1/1/1/1/1；11 號 2/1/1/1/1。第二題寫程式 11 人都一次過。
  - Table 12 表題自己下了一句結論（L3768–3771）：「for students with a higher number of attempts on the first Parsons problem, the number of attempts on the subsequent two decreased, and these students were very successful on subsequent code-writing tasks」。對照表上數字：第一題 Parsons 次數最多的 6 號（9 次）、9 號（6 次）、1 號與 4 號（5 次）裡，6 號第一題寫程式試了 8 次、4 號試了 5 次，「very successful」只對第二題寫程式成立。
  - 三個主題（L3795–3799）：對 temp 變數的角色困惑、對交換演算法的理解增加、排列虛擬碼註解積木有困難。
  - 「三位」參與者對 temp 困惑（L3800–3802），但逐一點名的是 1、4、6、8 號四位（L3803–3926）。
  - 1 號：做完三題 Parsons 之後，寫程式時仍先不用 temp，用 CodeLens 逐步執行才發現錯，而且想不起 Parsons 題的解法，最後用兩個暫存變數（L3813–3827）。原文印的那段程式最後一行是 `x = temp1`，照字面並不會完成交換，原文沒有說明。
  - 4 號的自述：「I just felt really annoyed because I wanted to do it how the Parsons problems were … But because it wasn’t making sense to me before and then I forgot everything that I had done.」（L3834–3839）。作者接著說 4 號最後是回想起 Parsons 題裡的 temp 才在寫程式時解掉誤解（L3840–3844）。
  - 6 號在寫程式題只寫一行 `x = y`，訪談者提示他回想前一頁有幾個步驟（L3845–3869）。
  - 正面自述（1、7、8、5、9 號，L3859–3863、L3871–3936、L3938–3968）。7 號：「Had you just given me this last bit at the start [the code writing problems]. I would have got it wrong at least once then had to work out what I’d done wrong. But by doing the blocks [Parsons problems] before hand has made it a lot clearer in my head.」（L3965–3968、L3859–3863）。8 號說的是另一個方向：沒有程式在眼前、得自己想出來，才想得比較透（L3898–3908）。
  - 虛擬碼註解積木：2、5、4、10、8、9、11 號都說只有文字描述的那題最難、有程式的比較好懂（L3953–4016）。作者自己提醒這題同時也是第一題，分不出是形式難還是第一次碰到難（L3994–3995）。
  - 小節結語寫「solving Parsons problems **with distractors** can help students overcome common misconceptions」（L4018–4019）；4.6.6 對 python-swap 的描述（L2267–2285）沒有提到這三題有干擾項，是否有，不確定。
- **class-ta（2 人，L4023–4163）**
  - 1 號：第一題同時選了成對的干擾項，試 7 次才過；第二題 2 次、第三四題 1 次（L4054–4063）。**但寫程式題一題都沒解出來**，把 `self` 與型別轉換搞混（L4078–4081）。
  - 2 號：在 `Class Song:`／`class Song:` 這組選錯，檢查後說「I will never forget that ever again!」（L4096–4110）。作者據此說「an effective distractor may have encouraged his recollection of the correct syntax」（L4115–4116）。這是全報告對「干擾項有助於記住語法」最直接的質性證據，樣本一人。他沒發現寫程式題可以叫出 Parsons 題當鷹架，直到訪談者幫忙（L4144–4152、L4160–4163）；作者認為「toggle」這個詞不夠清楚。
- **p3dndta（1 人，L4164–4175、L4300–4341）**：題型介紹頁的寫程式練習試了 5 次才過（L4300–4302）；六題 Parsons 都解出，各花 2 到 13 次嘗試（L4325–4326）；很喜歡「Help Me」按鈕（L4327–4331）；第一題寫程式題寫出 `for num[i] in len(num)`，錯誤訊息指到下一行，沒解出來，之後的寫程式題沒有再試（L4332–4341）。這一節開頭把 p3dndta 說成「a version of p3pt that introduces students to Parsons problems both with and without distractors」（L4164–4166），4.6.9 則說它是 p3dnd 的放聲思考版（L2378–2384），兩處說它衍生自不同研究。
- **jspt（12 人，L4305–4350、L4489–4498；Table 15 對過 PDF p.94 版面）**
  - 12 人裡 4 人做完全部（L4309–4310）。Table 15：寫程式第 4 題只有 5 號解出；Parsons 第 4 題有數字（解出）的只有 3、5、10 號。
  - 沒做完的原因：時間不夠、對串列與陣列的知識不穩、焦慮（L4343–4350）。6 號：「I felt quite overwhelmed by the end, so I decided to drop out and let it go」。
  - 有一位參與者說解 Parsons 題時比較不焦慮，對寫程式題沒興趣（L4490–4492）。
  - **沒有任何一位參與者發現 Parsons 題與後面的寫程式題是同構的**（L4493–4496「none of the participants— even those who completed the study, reported high self-efficacy, and a medium-to-high pre-knowledge of the concepts covered— realized that problems in both parts of the study were isomorphic」）。
- **7.3.1 的總評**（L5211–5215）說放聲思考中學生做問卷與練習頁時「沒有觀察到困惑」；6.1.1 卻用一整段寫 python-swap-6 在題型介紹頁因縮排連續失敗五次、訪談者兩度介入（L3676–3791）。
- 7.3.1 對 p3dndta 與 class-ta 的總評（L5302–5314）：樣本 n = 3，學生對 Parsons 題有好感，**但練習後寫程式題仍有困難**；干擾項是否讓題目明顯變難「從訪談看不出來」。
- 作者從 python-swap 得到的保留結論（L5270–5276）：「These findings suggests there may be some contexts in which Parsons problems alone may be insufficient scaffolding to dislodge certain misconceptions and additional measures may be needed.」建議先讓學生預測並執行那段錯的程式。

### F. Parsons 題文獻增補（第 2 節，L389–606；Table 1–2 對過 PDF p.61 版面）

- 2022 工作小組回顧：從一千多篇找出 141 篇（L395–396）。本報告用同樣的檢索式查 ACM DL、IEEE Xplore、Scopus 到 2023 年 8 月，三個資料庫各得 10 到 28 篇，扣掉已收的與套用納入排除條件後新增 20 篇（L397–412），列在 Table 3、4。
- 主題標籤次數（Table 1，L447–506）：學程式 17、以 Parsons 題為主的研究 14、認知負荷 7、介入式鷹架 6、教師觀感 4、非 Parsons 為主的研究 4，其餘各 1–2。
- 討論（7.1，L4763–4781、L4917–4918）：研究仍多半在單一機構；作者多在美國。
- 第 1 節與第 4 節引述的既有發現（都是轉述別人的研究，不是本報告的結果）：
  - Denny 等 [18]：Parsons 題與紙筆考試寫程式題的表現高度相關（L218–219）。
  - Ericson 等 [31]：Parsons 題比改錯題與寫程式題「通常學習效率較好、認知負荷較低」（L219–221）。
  - 不是人人受益：有些學生寧願從頭寫；遇到不常見的解法會卡住 [44]（L139–141）。
  - 干擾項：Denny 等 [18] 發現干擾項讓題目變難、每個正確積木配一個干擾項會壓垮學生、成對呈現比隨機混入容易（L1914–1918）。Harms 等 [42] 報告干擾項提高自陳認知負荷、降低成功率、增加時間，但測的是語意干擾項，而且用沒有干擾項的 Parsons 題當學習測量（L1921–1926）。Smith 與 Zilles [100] 建議總結性評量不要用干擾項，因為明顯拉長作答時間而鑑別力沒有明顯提高（L381–383）。
  - 作者自己對現況的評估：「there is evidence for and against using distractors」（L1910）。
  - 先前「Parsons 題較快、學習成效相當」的研究都是單一機構、單一國家、單一語言、入門概念 [27, 29, 31, 123]（L1902–1907）。

### G. MIMN 文獻回顧（第 3 節，L548–1890；Figure 1 對過 PDF p.64 版面）

- 檢索：ACM Digital Library，2013 年 1 月到 2023 年 7 月，兩組檢索式，得 97 與 81 篇，合併 135 篇（L585–600、Figure 1 L949–994）。
- 篩選（L933–1005）：去重複 11 篇、不是多機構 80 篇、不是多國 15 篇、與電腦科學教育無關 8 篇、沒做實證研究 4 篇，合計排除 118 篇（87%），剩 17 篇；另外加 4 篇 2013 年以前的重要研究 [35, 56, 64, 118]，共 21 篇。
- 2013–2023 的 17 篇：國家數中位數 3、機構數中位數 6.5、參與人數中位數 357（L1183–1186、L1222–1224）；13 篇（76%）出自 ACM 會議（L1169–1170）；3 篇（18%）沒有寫明國家（L1230）。工具以問卷最多（n = 13，45%），其次程式測驗（n = 7，24%）（L1209–1218）。研究目標：學生 11（L1492 寫 64%，L1451 寫 65%，原文前後不一）、教師 3、產出物 3（L1491–1493）。
- 參與國家多是美國、愛爾蘭、英國，非洲、亞洲、南美很少（L1160–1163）。
- 整理出的注意事項（3.5 節，L1480–1890）：團隊協調、機構差異（選修／必修、成績不可跨校比、倫理審查時程）、研究與資料完整性（先做前導、資料蒐集一致、翻譯）。

## 作者自己列的限制

第 8 節（L5364–5399）只列兩類：

1. **時程**：工作小組提案 1 月才通過、成員加到 3 月，大洋洲與南美的學期對不上，這些學校會議後才蒐集分析資料；倫理審查應更早開始。
2. **兩份文獻回顧**：只查特定資料庫；MIMN 回顧靠論文自己標示是多機構多國研究，可能漏掉。

第 8 節**沒有**提到量化研究的任何效度威脅。散在其他節、作者自己寫到的問題：

- 自願參與的學生遇到工作量大的部分（例如寫程式那一組）容易退出，建議以後用較短的活動（L5126–5133）。
- IIT Madras 參與狀況不一致，很多人跳過中間頁面或中途離開（L3148–3151）；下一批重做失敗（L3172–3176）。
- VUW 參與率 4%，原因不明（L3215–3221）。
- python-swap 虛擬碼題的難度與「第一題」混在一起（L5277–5284）。
- 放聲思考樣本小（class-ta 與 p3dndta 合計 n = 3）（L5302–5304、L5309–5311）。
- 7.2.2 說用前問卷蒐集自我效能與熟悉度，「The presurvey enabled us to compare students' performance」（L5118–5121），與第 4 節「改用自評比較組別」一致；結果節沒有任何地方用到選用的前測分數。

我讀到、作者沒寫的（不是作者的話，是讀取時看到的事實）：

- 效果量只有 jspt（D2、D3）、class-exp 語法錯誤數（B11）與 p3pt 嘗試次數（Table 22）有報；p3pt 與 class-exp 的後測成績比較沒有效果量、標準差或信賴區間；每個條件的人數都沒報。
- 子群檢定很多（Table 18 有 15 個、Table 21 有 20 個、Table 22 有 5 個），沒有提多重比較校正。
- p3pt 的 N 三處對不起來（369／376／401）；IIT Madras 的人數 Table 9 寫 50、內文寫 152。
- p3pt 後測：只有約一半的人做了任何一題，平均分數約滿分的 27%。成績「無差別」是在這種流失與低分之下得到的。
- 各校混在一起分析，沒有報分校結果，也沒有把學校當成分析因子。

## 與摘要說法不一致的地方

1. **摘要沒有提兩個主要的無效果結果。** 摘要對自己研究的結果只有一句（L79–82）：「The think-aloud observations and experimental studies provide evidence for using Parsons problems to help students learn common algorithms such as swap, and the usefulness of distractors in helping students learn to recognize, fix, and avoid common errors.」p3pt 的後測無差別（A4）、練習時間無差別（A8）、class-exp 的後測成績無差別（B3）都不在摘要裡。結論節（L5487–5489）也只寫「provide evidence for the benefits of solving Parsons problems with distractors and for learning common algorithms」。
2. **摘要把既有文獻說成「通常比較容易也比較快」，本報告自己的資料沒有重現。** 摘要 L100–102：「typically easier and faster to solve than writing code from scratch, but with equivalent learning gains」。p3pt 練習時間 1783 秒對 1600 秒、p = 0.58，數值上 Parsons 組較慢（A8）；後測第一題 Parsons 練習組還顯著較慢（A9）。這一點只在 7.3.2 承認（A10）。
3. **「幫學生學會 swap」的證據沒有對照組。** python-swap 是單組設計（C1、C3），「超過 80% 完成」沒有比較基準，量化人數也沒報；放聲思考裡同時有說有幫助的自述，也有做完三題 Parsons 仍在第一題寫程式寫出 `x = y`、`y = x` 的例子（E；7.3.1 L5258–5265）。摘要用「experimental studies」統稱，python-swap 不是實驗。
4. **「干擾項有助於辨認、修正、避開常見錯誤」的量化證據只有語法錯誤數一項**（B11，效果量 δ = −0.18 與 −0.28），後測成績（含改錯題）沒有差別（B3）。「修正（fix）」這個詞對應的改錯題成績沒有單獨報告；Table 18 報的是有沒有去做改錯題，全體與各子群都不顯著。
5. 摘要說「ran both revised as well as new experimental studies」（L78–79）；新設計的 p3dnd、cdnd、c-swap 與既有的 class-tog 都沒有報結果。

## 與清單「要撐的結論」不合的地方

清單那句：「**無效果的那一篇**：Parsons 練習對寫程式練習，後測沒有差別，也沒有比較省時間；帶干擾項的版本後測語法錯誤較少」。

- 「Parsons 練習對寫程式練習，後測沒有差別」：**撐得住**（A4：107/400 對 111/400，U = 20648.0，p = 0.60）。要連著寫的條件：是同一堂課裡緊接著的後測，不是延宕測驗；約一半學生沒做任何一題後測，兩組平均分數都只有滿分的四分之一強；五校混合，其中最大的兩群是迦納一所大學的必做作業與印度一門線上課的重修生自願參加；N 在原文三處不一致。
- 「也沒有比較省時間」：**撐得住**（A8：1783 秒對 1600 秒，p = 0.58）。更精確的說法是「沒有顯著差別，數值上 Parsons 組還略久」。作者自己說這與先前單一機構的研究「明顯不同」，並說需要更多研究，沒有說先前結果被推翻。
- 「帶干擾項的版本後測語法錯誤較少」：**撐得住但要補兩件事**。第一，這是另一項研究（class-exp，學 Python 類別），比的是「有干擾項的 Parsons 題」對「沒有干擾項的 Parsons 題」，兩組都做 Parsons 題，不是對寫程式。第二，同一研究的後測成績沒有差別（B3）；語法錯誤怎麼算原文沒交代；效果量是小的（Cliff's δ −0.18、−0.28）。
- 清單沒寫、但寫這條結論時不該漏的：
  - p3pt 用的是「有干擾項的 adaptive Parsons 題」，不是最單純的拖拉排序題。
  - Parsons 練習組在後測第一題顯著較慢（292 對 566 秒，p = 0.017）；低自我效能子群答對前的嘗試次數顯著較多（3.55 對 8.61，p = 0.018，δ = 0.19），全體不顯著（6.32 對 9.82，p = 0.21）。
  - class-exp 裡，低自我效能或低先備的學生若練習時有干擾項，較願意把後測做完（B7、B8）；這是事後切出的子群，沒有校正。
  - 稱它「無效果的那一篇」只說對一半：作者自己的摘要與結論把它寫成支持 Parsons 題的證據。文章若引它當無效果的例子，要引 6.2.3 節與 7.3.2 節，不能引摘要。

## 讀取紀錄

依序讀完刊出版 `.txt` 全文（2026-10-14 重讀），區間首尾相接：

| 段 | 行號 | 內容 |
|---|---|---|
| 1 | L1–1000 | 首頁、摘要、版權與 ACM Reference Format、第 1 節（含 1.1.1–1.1.5 相關理論）、第 2 節 Parsons 文獻增補（Table 1–4）、第 3 節 3.1、Figure 1 |
| 2 | L1001–2000 | 3.1 收尾、3.2–3.5（Table 5–6）、第 4 節開頭（2022 研究問題、干擾項文獻、Figure 2） |
| 3 | L2001–3000 | 4.1–4.6.10、Figure 3–18 圖題、第 5 節、Table 7–9、5.1–5.3 開頭 |
| 4 | L3001–4000 | 5.3–5.11、第 6 節、6.1、Table 10–12、6.1.1 python-swap 放聲思考 |
| 5 | L4001–5000 | 6.1.1 收尾、6.1.2–6.1.4、Table 13–15、6.2.1–6.2.4、Figure 19–25 圖題、Table 16–18、Table 20、Table 21 前段 |
| 6 | L5001–5941 | Table 21 後段、Table 19–20 表題、Table 22、第 7 節討論、第 8 節限制、第 9 節結論、致謝、補充材料、參考文獻 [1]–[125]（掃過） |

對過 PDF 版面的表與圖（2026-10-14 用 Read 看刊出版頁面影像；括號內是文內印的頁碼）：

- PDF 第 5 頁（p.61）：Table 1、Table 2。
- PDF 第 8 頁（p.64）：Figure 1 流程圖。
- PDF 第 24 頁（p.80）：Table 8、Table 9。
- PDF 第 33 頁（p.89）：Table 12。
- PDF 第 38 頁（p.94）：Table 15。
- PDF 第 39–43 頁（p.95–99）：Figure 19–25、Table 16、17。C 節標「目測」的數字是我從圖上讀的近似值，原文沒有給數值，引用時要標明是讀圖。
- PDF 第 44 頁（p.100）：Table 18、19、20、21。
- PDF 第 45 頁（p.101）：Table 22。
- 沒有另外對版面的表：Table 3–7、Table 10、11、13、14（線性文字裡欄位順序清楚，或不含會被引用的結果數字）。Table 5 在 `.txt` 裡欄位交錯嚴重，本紀錄沒有引用它的個別格。
- 刊出版只附每項研究的第一題（Figure 8–18）；各研究完整題目在補充材料網站 parsonsproblems.github.io，本紀錄沒有讀。若文章要描述題目實際內容（含後測哪一題是「Movie」），要另讀該網站。

## 2026-10-14 換版重對

依據改成 ACM 刊出版，整份從頭依序重讀；以下逐條列出相對於作者稿版紀錄改了什麼。行號全部換成刊出版 `.txt` 的行號，不再逐條列。

**檔頭**

1. 檔頭 ⚠ 換成一行「依據版本」說明；刪掉舊的合法來源比對長段，改成兩行（合法來源、舊版本去處）。
2. 版本欄由「作者稿」改為「刊出版」；DOI、版權年（© 2023）、51 頁、頁碼 57–107 都對刊出版首頁核過。
3. 原文檔改為 `ericson2023-parsons-wg-acm-dl.pdf`／`.txt`（5,941 行、244,437 字元），註明雙欄交錯的位置與 PDF 頁碼換算。
4. 註明刊出版沒有附錄 A，題目截圖改在補充材料網站，未讀。

**研究設計**

5. 分派方式：作者稿「based on generating a random number」改成刊出版的「pseudo-randomly placed」。
6. 新增：智利版的 Parsons 題不是 adaptive（L3153–3155）。
7. 新增：python-swap 在刊出版被稱為「within-subject study」，同時又說沒有隨機分派。
8. 研究表的題目出處：作者稿附錄 Figure 38–49、78–92 刊出版沒有，改成只指 Figure 8、18 與補充材料網站；p3pt 的後測題數改由 Table 20、21 推得並註明。
9. 「adaptive」說明補上「Help Me」會拿掉干擾項或合併積木（L4327–4328）。
10. 第 5 節學校數：作者稿寫「13 institutions」與 Table 7 不合；刊出版改成「11 institutions」，與表一致。原本「13 對 11」的不一致刪除。
11. Berea 補上 17 人名單選 3 人的放聲思考招募；IIT Madras 補上下一批重做失敗（7/1,639）。

**結果**

12. A2：補「切點怎麼定原文沒寫」。
13. A4：刊出版多了 U = 20648.0。
14. A7：刊出版 Table 22 多了 U 值與 Cliff's δ 五組；表題改寫。作者稿內文把嘗試次數寫成全體顯著、與表不合；刊出版內文改成只說低自我效能子群，**原本「內文與表不合」那條刪除**。
15. A10：引文改成刊出版字句（「This is notably different from previous research which found…」，文獻號 [26, 29]）。
16. B2：補「用 Mann-Whitney 是因為不符常態」（刊出版新增句）。
17. B3：刊出版拿掉「shown by a Mann-Whitney U-test」，引文跟著改，並註明檢定法是推定。
18. B10：作者稿表上的「Q2 Tank」標籤刊出版沒有，改成 Q2；作者稿附錄 Figure 62（Movie 題排第一）刊出版沒有，改寫成「刊出版對不出 Movie 是哪一題」。
19. B11：刊出版多了 U 值與 Cliff's δ（−0.18、−0.28），「沒有標準差與效果量」改成「沒有標準差」；引文改成刊出版的「significantly fewer errors…」。
20. **B12：作者稿「早期版沒有顯著差異，所以加題」那句刊出版沒有，標「合法版本無此內容，不得引用」**；保留刊出版有的「早期版 4 題」事實。
21. B13：引文改成「This further supports…」，補上「五校 361 人」。
22. **C1：佔位句「a total of x participants」刊出版沒有，標不得引用**；改寫成「刊出版完全沒報 python-swap 的量化人數」。
23. C2、C5、D2、D3：數字寫法改成刊出版（t = −0.56、r = 0.054、p = 0.086、p = 0.3455、δ = 0.346、d = 0.534），值不變；D2、D3 補上原文「medium effect size」的說法與 Welch t。
24. C4：作者稿引文是「increase in the time required」，刊出版是「increase in the number of attempts required」，引文改成刊出版。
25. C6：引文改成刊出版（少了 that）。
26. C8：補「虛擬碼題平均約六次嘗試」（L5352–5353）。
27. Figure 19–24 的目測值重看刊出版頁面影像，數值與先前相同。
28. E：新增 Table 12 表題那句結論與表上數字不合（4、6 號第一題寫程式 5、8 次）。
29. E：python-swap-4 補上作者說她最後回想起 temp 解掉誤解（L3840–3844）。
30. E：python-swap-7 引文改成刊出版原樣（含方括號、「before hand」）；1 號的描述改成刊出版的說法（先試不用 temp）。
31. E：p3dndta 自相矛盾那條改寫。作者稿寫它是「a version of p3pt without distractors」；刊出版改成「both with and without distractors」，剩下的不一致只有「衍生自 p3pt 還是 p3dnd」。另補題型介紹頁試了 5 次。
32. E：python-swap 保留結論的引文改成刊出版的「there may be some contexts」（作者稿是「there are some contexts」）。
33. F：文獻編號改成刊出版（[30]→[31]、[43]→[44]、[41]→[42]、[99]→[100]、[26, 28, 30, 121]→[27, 29, 31, 123]）；7.1 討論的行號原本誤植（L4573–4538），改正。
34. G：新增「學生 11 篇」在 L1451 寫 65%、L1492 寫 64% 的前後不一。

**限制、與摘要不一致、與清單不合**

35. 限制：作者稿 7.2.2 說「提供前測來蒐集程式背景」，與第 4 節不合；刊出版改成「presurvey」，**原本那條不一致刪除**，改成說明現在兩處一致。
36. 「作者沒寫的」第一條：刊出版補了部分效果量，改寫成哪些有、哪些沒有；補 IIT Madras 50／152。
37. 與摘要不一致：摘要引文改成刊出版（「provide evidence」「typically easier and faster…, but with equivalent learning gains」「ran both revised as well as new experimental studies」）；第 4 條補上效果量。
38. 與清單不合：補上 p3pt 嘗試次數的 U、δ 與全體不顯著；語法錯誤補上效果量偏小；刪掉「這份是作者稿、頁碼不能用」那條。

**讀取紀錄**

39. 整段重寫成刊出版的六段區間；PDF 對版面改成看刊出版頁面影像（9 頁），頁碼改成刊出版的。

不得引用的條目：B12 的作者稿句、C1 的佔位句，共 2 條；其餘條目在刊出版都找得到，數字相同。
