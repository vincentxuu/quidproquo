# 抽取紀錄：King-Shepard、Walker、Nokes-Malach、Carpenter、Fraundorf 2025，Educational Psychology Review 37:115

合法公開來源：https://shacarp.wixsite.com/mysite/published-articles （共同作者 Shana Carpenter 的個人網站，著作清單該篇的「pdf」連到 https://664ef278-1723-43c6-bbe1-3bd4e65a87fe.filesusr.com/ugd/f4b9f1_014e1ee2d25147e992507927aed1f0b3.pdf ；Springer 排版的刊出版，2026-10-14 核對）。重新下載與手上的 `.work/teaching-text-research/src/prequestions_meta2025.pdf` 位元組完全相同（1,616,631 位元組）。原文檔取得網址原本沒記，現已補上；出版者頁 Unpaywall 標 closed。

原文檔：/Users/vincent/Work/study/quidproquo/.work/teaching-text-research/seq/prequestions_meta2025.txt（3,531 行、152,783 位元組）
PDF：/Users/vincent/Work/study/quidproquo/.work/teaching-text-research/src/prequestions_meta2025.pdf（55 頁）
讀取日期：2026-10-13／14

表格還原方式：文字檔裡 Table 1–9 都被拆成一行一格，而且欄位順序倒置（原表是橫排頁面）。我用 `pdftotext -layout` 重抽第 24–32 頁（Table 1–6）與第 45–48 頁（Table 7–9），下面的表格數字以 `-layout` 輸出為準，再和內文敘述逐格對過；表與內文不一致的地方另列。Fig. 1–5（實驗流程、PRISMA 流程圖、年份分布、兩張漏斗圖）是圖片，文字檔只有圖說，圖的內容我沒有讀到。

## 研究設計

- **研究類型**：預先註冊（OSF）的三層統合分析，遵循 PRISMA 2020（第 486–497 行）。註冊後有新增調節變項（原文說「noted below」），並把「post-question」改稱「repeated question」。
- **prequestion 的定義**（第 83–84 行）：「questions introduced before engaging with a subsequent learning resource or placed prior to material that contains the answers or solutions to those prequestions」。包含全部放在最前面，也包含**插在教材中間但在對應內容之前**的題目。
- **典型實驗**（第 113–119 行）：隨機分派到讀前提問組或控制組；提問組「typically begin the study by answering prequestion(s) without receiving feedback」。**註 1（第 129–134 行）**：「Feedback is not typically given in experiments on prequestion design because giving feedback reduces the ability to isolate the prequestion effect. For instance, if there is a positive learning benefit observed, it would be unclear if the learning benefit occurred from the prequestions themselves or simply from being given the answer in the feedback. Further, giving feedback may encourage learners to simply remember the correct answer rather than engage with the to-be-learned content.」
- **兩種後測題目**（第 120–127 行）：repeated questions（「assess the same information as the prequestions (most often instantiated with verbatim wording and format to the prequestions)」）；new questions（「assess information that the prequestions did not assess but can also be found in the learning resource」）。
- **檢索**（第 499–506 行）：2021 年 7 月 19 日；ProQuest（APA PsycInfo、APA Psychnet、Psychology Database、ProQuest Thesis and Dissertations）與 ERIC；檢索式（照文字檔抄，前兩項印出來一模一樣，可能是轉檔掉了連字號，我無法確定）“Prequest*” OR “Prequest*” OR “Adjunct-quest*” OR “Adjunct quest*” OR (“pretest” AND “learning” AND “retrieval practice”)。「3,116 records… 213 duplicates… leaving 2,993 records to be screened」（**3,116 − 213 = 2,903，和原文寫的 2,993 對不上；原文沒有說明**）。沒有做向前與向後的引文追溯，也沒收研討會摘要（第 462–465 行，這是和 St. Hilaire 等 2024 的差別）。
- **納入標準**（第 507–538 行）：摘要階段三項——(1) 原創實證研究，文獻回顧排除；(2) 把讀前提問當實驗變項，而不是測先備知識的前測；(3) 英文。全文階段加兩項——(4) 要交代題目的位置；(5) 結果量數必須是重複題和／或新題的表現。評分者一致性 kappa：摘要 .988、全文前 25 篇 .905。篩掉 2,895 筆，剩 98 筆。
- **資格審查**（第 544–551 行）：再排除 41 筆（12 筆沒報統計量、16 筆統計量無法使用、3 筆重複、**10 筆沒有控制組**），剩 57 筆、206 個比較（第 572–573 行）。編碼核對時又發現 2 個研究沒有做正確的提問對控制比較，**最後 55 筆紀錄、204 個比較**（第 590–592 行）。註 9：被排除的裡面有 7 筆在 St. Hilaire 等 2024 的分析裡。
- **編碼信度**（第 576–589 行）：第二輪抽 39 個比較（20%）獨立編碼，kappa 從 .18 到 1.00；**學習時間、題目類型、題目數量、呈現方式四個調節變項一開始一致性低**，討論後重訂規則並重編其餘 80%。
- **受試者**（第 852–853 行、註 24）：12,003 人（實驗組 6,704、控制組 5,299）。年齡分三級：兒童（幼稚園到六年級）、青少年（七到十二年級）、成人（大學以上）（第 808–810 行）。
- **研究年代**（第 850–852 行、Fig. 3 圖說）：1970–1989 年最多，2010–2021 年回升；2021 年只含 1–7 月。
- **效果量與模型**（第 600–641 行）：Hedges' g；Level 1 是各比較，Level 2 是研究內，Level 3 是研究間；REML；R 的 metafor 與 robumeta。子群分析檢驗調節變項，用 F 檢定。p < .05 算顯著，.05 < p < .10 算 marginal（第 853–854 行）。k < 10 的類別一律丟掉不比。
- **調節變項的編碼**（第 644–847 行）：
  - 題目類型：factual（答案可以從教材的原句找到）；conceptual（「cannot be answered with verbatim information from the learning resource and instead requires the generation of new words, phrases, or sentences」）；both。
  - 呈現方式五級：prequestions alone（讀題並作答，沒有其他材料，最常見）；prequestions minus（「prequestions were given but participants were specifically instructed not to generate an answer to them」）；prequestions optional（作答與否自選，k = 4，被丟掉，註 27）；prequestions plus feedback（「participants were presented the solution to prequestions regardless of answering correctly or incorrectly」）；prequestions plus supplemental activity。註 12 列出 supplemental activity 包含：記筆記、小組討論、學習時手邊有讀前題、學習前後憑記憶寫出讀前題、作答時可以回看課文、內容地圖、關鍵資訊粗體、另外給學習目標。
  - 位置：before learning；interspersed（在教材中間、目標內容之前）；both（k 太少被丟，註 28）。
  - 題目數量四分位：small 少於 2 題（M = 1.06）；medium 2–4 題；large 5–12 題；very large 13–64 題。**插入式的只算每一段前面的題數**（第 690–696 行）。
  - 傳遞方式：text；audiovisual（含錄音、影片、現場講課）。
  - 學習時間四分位：short 1–5 分鐘（M = 1.73）；medium 6–8 分鐘；long 9–16 分鐘；extended 17–100 分鐘（M = 30.8，Mdn = 30）。**指的是緊接在題目之後那一段教材的時間**；例如 Carpenter 與 Toftness（2017）三段影片各 2.5 分鐘，編成 2.5 分鐘（第 710–742 行）。
  - 文本量四分位：small 1–358 字（M = 232.81）；medium 359–710 字；large 711–1,696 字（M = 955.35）；very large 1,697–15,000 字（M = 3,366，Mdn = 2,230）。同樣只算緊接在題目之後那一段（第 743–761 行）。註 17：以頁或段為單位的，用每段 150 字、每頁 500 字估。
  - 控制組：standard（什麼都沒多給）；active-related（多的讀書時間、學習目標）；active-unrelated（別的主題的讀前題）。
  - 內容：STEM；non-STEM expository；non-STEM narrative。
  - 後測形式：free recall；cued recall；recognition；varied（丟掉，註 30）。
  - 保留間隔：immediate；同一天、做完干擾作業之後；1 天以上。
  - 先備知識：controlled／uncontrolled；研究者沒說明的歸 undefined 並移除（註 23）。
  - 場域：laboratory／school；學校研究再分教材與課程相關或無關。
- **出版偏誤三種方法**（第 594–598 行）：PET-PEESE、漏斗圖目視、把出版狀態（已發表／未發表）當調節變項。

## 結果（逐項）

對照條件：除非另註，都是讀前提問組對沒有讀前提問的控制組，Hedges' g。

### 整體（Table 1，第 977–1054 行；`-layout` 第 24 頁）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 重複題 | g = .66，SE = .07，95% CI [0.52, 0.81]，df = 45，k = 181，p < .0001 | RQ1／Table 1 | 935–938 | 「The pooled effect size of the true effect of prequestions on repeated question performance was g =.66, CI [0.52, 0.81], (df = 45, k = 181), p < .0001.」 |
| 2 | 新題 | g = 0.01，SE = .05，95% CI [−0.09, 0.12]，df = 45，k = 175，p = .80 | RQ1／Table 1 | 939–942 | 「This result shows that, across comparisons, there is no effect of prequestions on new question performance.」 |
| 3 | 重複題的異質性 | τ² level 2 = 0.01 [0.00, 0.06]；τ² level 3 = 0.14 [0.07, 0.27]；I² level 1 = 61.05%、level 2 = 3.26%、level 3 = 35.68% | RQ1 | 943–948、961–962 | 「the between-cluster heterogeneity was significantly different from 0 while our within-cluster heterogeneity was not」 |
| 4 | 新題的異質性 | τ² level 2 = 0.00 [0.00, 0.01]；τ² level 3 = 0.05 [0.01, 0.12]；I² level 1 = 82%、level 2 = 0%、level 3 = 17.93% | RQ1 | 963–968、1056–1060 | 「a significant but low level of heterogeneity between studies」 |

Table 1 的 k：重複題第二層 179、第三層（研究群集）46；新題第二層 175、第三層 46。

### 出版偏誤（第 880–932 行）

| # | 方法 | 重複題 | 新題 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 5 | PET-PEESE | PEESE 校正後 g = .68，95% CI [.53, .83]，p < .001；判定可能有偏誤 | PET g = .03，CI [−0.16, 0.22]，p = .74；判定不太可能有 | 885–894 | 「The results of our PEESE test suggest that publication bias is likely to exist in our model of performance on repeated question performance.」 |
| 6 | 漏斗圖 | 不對稱 | 對稱 | 895–901 | 「This visual inspection may indicate that papers displaying an effect of prequestions on repeated question performance are published more often than papers that do not display an effect.」 |
| 7 | 出版狀態當調節變項 | 已發表 g = .77（k = 76）、未發表 g = .56（k = 105）；F(1, 179) = 2.07，p = .15，不顯著 | 已發表 g = .10（k = 68）、未發表 g = −0.05（k = 107）；F(1, 173) = 2.13，p = .14，不顯著 | 902–909 | 「publication status is not a significant moderator」 |
| 8 | 作者的總結 | 三種裡兩種顯示有偏誤 | 三種都沒有 | 910–919 | 「The presence of publication bias in two out of three measures raises the concern that there is potential overestimation of effect sizes found in our repeated question performance outcomes. When interpreting the results of our overall repeated question model, interpretations may need to be made using the adjusted true effect size calculated by our PEESE model.」 |

### 調節變項：重複題（Table 2–6；`-layout` 第 25–32 頁）

| # | 調節變項 | 各級 g（k） | 檢定 | 行號 | 作者判定／原文一句 |
|---|---|---|---|---|---|
| 9 | 題目類型 | Factual 0.71（148）；Conceptual 0.45（18）；Both 0.38（10） | F(2, 173) = 1.70，p = .18 | 1072–1074、2197–2198 | 不顯著 |
| 10 | 呈現方式 | Alone 0.60（110）；Minus（看題不作答）0.65（17）；Plus supplemental activity 0.84（24）；Plus feedback 1.25（26） | F(3, 173) = 6.20，p < .001 | 2205–2216 | **唯一顯著的調節變項**。回饋對 alone：t(173) = 7.64，p < .001；SA 對 alone：t(173) = 1.79，p = .07（marginal）；minus 對 alone：t(173) = .36，p = .71。「the magnitude of the prequestion effect on repeated questions was significantly greater when prequestions were given with feedback」 |
| 11 | 位置 | Before learning 0.65（88）；Interspersed 0.67（91） | F(1, 177) = 0.01，p = .91 | 2223–2226 | 不顯著 |
| 12 | 題目數量 | Small 0.68（44）；Medium 0.71（44）；Large 0.65（48）；Very large 0.60（40） | F(3, 172) = 0.13，p = .94 | 2246–2248 | 不顯著 |
| 13 | 傳遞方式 | Text 0.67（155）；Audiovisual 0.64（26） | F(1, 179) = 0.02，p = .88 | 2254–2256 | 不顯著 |
| 14 | 學習時間 | Short 0.67（20）；Medium 0.62（27）；Long 0.66（15）；Extended 0.71（18） | F(3, 76) = 0.07，p = .97 | 2259–2261 | 不顯著。只有 80 個比較有時間資料 |
| 15 | 文本量 | Small 0.57（38）；Medium 0.54（28）；Large 0.58（36）；Very large 0.79（35） | F(3, 133) = .59，p = .62 | 2266–2269 | 不顯著 |
| 16 | 控制組類型 | Standard 0.68（147）；Active-related 0.54（23）；Active-unrelated 0.75（11） | F(2, 178) = 0.41，p = .66 | 2272–2289 | 不顯著 |
| 17 | 內容 | 表：STEM 0.72（47）；Non-STEM exp. 0.66（97）；Non-STEM narr. 0.62（30）；STEM & Non-STEM 0.40（10） | F(3, 177) = 0.61，p = .60 | 2292–2295 | 不顯著。**內文寫的 k 是 STEM 55、expository 87，和表（47、97）不一致** |
| 18 | 後測形式 | Free recall 0.73（33）；Cued recall 0.58（45）；Recognition 0.65（100） | F(2, 175) = 0.42，p = .65 | 2299–2301 | 不顯著 |
| 19 | 保留間隔 | Immediate 0.64（103）；干擾作業後 0.58（45）；1 天以上 0.87（33） | F(2, 178) = 2.06，p = .13 | 2305–2307 | 不顯著 |
| 20 | 年齡 | Children 0.52（19）；Teens 0.51（27）；Adults 0.71（135） | F(2, 178) = 0.69，p = .50 | 2312–2330 | 不顯著。註 32：兒童與青少年合併（g = .51，k = 46）對成人，F(1, 179) = 1.43，p = 0.23 |
| 21 | 先備知識 | Controlled 0.66（46）；Uncontrolled 0.80（21） | F(1, 65) = .36，p = .54 | 2334–2336 | 不顯著。只有 67 個比較可編碼 |
| 22 | 場域 | Laboratory 0.71（87）；School 0.62（93） | F(1, 178) = 0.36，p = .54 | 2342–2344 | 不顯著 |
| 23 | 學校研究：教材與課程 | Related 0.46（18）；Not related 0.68（75） | F(1, 91) = .67，p = .41 | 2344–2346 | 不顯著 |

### 調節變項：新題

| # | 調節變項 | 各級 g（k） | 檢定 | 行號 | 作者判定／原文一句 |
|---|---|---|---|---|---|
| 24 | 題目類型 | 表：Factual 0.002（137）；Conceptual 0.34（18）；Both −0.40（10） | F(2, 166) = 5.39，p < .01 | 2198–2204 | **唯一顯著的調節變項**。Both 顯著低於 factual（t(166) = 2.12，p < .05）與 conceptual（t(166) = 3.23，p < .01）；conceptual 大於 factual（t(157) = 2.23，p < .05）。「the magnitude of the prequestion effect was greater for conceptual prequestions (g = 0.33) than factual (g = 0.003)」。**內文 factual 的 k 寫 141、表寫 137；內文同一段 conceptual 先寫 0.34 後寫 0.33，factual 先寫 0.002 後寫 0.003** |
| 25 | 呈現方式 | Alone 0.03（114）；Minus −0.06（15）；Plus SA 0.05（17）；**Plus feedback −0.04（25）** | F(3, 167) = 0.22，p = .88 | 2217–2222 | 不顯著 |
| 26 | 位置 | Before learning 0.06（85）；Interspersed −0.04（89） | F(1, 172) = 1.14，p = .28 | 2227–2245 | 不顯著 |
| 27 | 題目數量 | 表：Small −0.13（38）；Medium 0.002（45）；Large 0.09（46）；Very large 0.001（41） | F(3, 166) = 0.81，p = .48 | 2249–2251 | 不顯著。內文把 medium 寫成 0.00、very large 寫成 0.01 |
| 28 | 傳遞方式 | Text −0.005（153）；Audiovisual 0.10（22） | F(1, 173) = 0.73，p = .39 | 2256–2258 | 不顯著 |
| 29 | 學習時間 | Short 0.18（14）；Medium 0.11（23）；Long 0.04（10）；Extended 0.10（20） | F(3, 63) = 0.08，p = .96 | 2261–2265 | 不顯著 |
| 30 | 文本量 | Small −0.03（23）；Medium 0.05（39）；Large −0.02（32）；Very large −0.03（39） | F(3, 129) = .14，p = .92 | 2269–2271 | 不顯著 |
| 31 | 控制組類型 | Standard 0.01（145）；Active-related −0.23（18）；Active-unrelated 0.29（12） | F(2, 172) = 2.68，p = .07 | 2289–2291 | marginal。內文這句寫「did not significantly differ」 |
| 32 | 內容 | 表：STEM 0.12（52）；Non-STEM expo. −0.05（90）；Non-STEM narr. −0.08（27） | F(2, 166) = 1.46，p = .23 | 2295–2297 | 不顯著。**內文 k 寫 STEM 60、expository 80，和表（52、90）不一致**。STEM 與非 STEM 混合的（k = 9）被丟掉（註 29） |
| 33 | 後測形式 | Free recall −0.03（24）；Cued recall −0.006（40；表印 –0.00）；Recognition 0.01（109） | F(2, 170) = 0.06，p = .93 | 2301–2304 | 不顯著 |
| 34 | 保留間隔 | Immediate −0.01（106）；干擾作業後 0.11（41）；1 天以上 −0.06（28） | F(2, 172) = 1.21，p = .30 | 2307–2309 | 不顯著 |
| 35 | 年齡 | Children 0.001（24）；Teens 0.08（28）；Adults 0.002（123） | F(2, 172) = 0.14，p = .86 | 2330–2333 | 不顯著。註 32：合併後 g = .04（k = 52），F(1, 173) = .12，p = 0.72 |
| 36 | 先備知識 | Controlled −0.00（47）；Uncontrolled 0.16（17） | F(1, 62) = .71，p = .40 | 2336–2339 | 不顯著 |
| 37 | 場域 | Laboratory 0.08（82）；School −0.06（92） | F(1, 172) = 2.09，p = .14 | 2346–2348 | 不顯著 |
| 38 | 學校研究：教材與課程 | Related −0.03（13）；Not related −0.07（79） | F(1, 90) = .06，p = .80 | 2348–2351 | 不顯著 |

### 附錄的相關表

- **Table 7（Spearman's rho，第 2751–2791 行；`-layout`）**：年齡 × 文本量 .173*；年齡 × 學習時間 −.368*；年齡 × 題數 .014；文本量 × 學習時間 .572*；文本量 × 題數 .537*；學習時間 × 題數 .687*。*p < .05。
- **Table 8（Cramér's V，第 2801–2895 行；`-layout`）**：十個名目變項兩兩的關聯。顯著的包括：場域 × 內容 .407、場域 × 位置 .449、場域 × 控制組 .314、場域 × 保留間隔 .592、場域 × 後測形式 .487、先備知識 × 呈現方式 .342、先備知識 × 位置 .502、呈現方式 × 位置 .262、呈現方式 × 題目類型 .197、呈現方式 × 保留間隔 .202、呈現方式 × 後測形式 .225 等。「場域 × 先備知識」那一格印的是「0.52」，沒有星號，格式和其他格不同；我無法確定是否漏了星號。作者在內文只說「Several factors were found to have significant associations」（第 2745–2747 行），沒有討論這些關聯對調節分析的影響。
- **Table 9（第 2897–3144 行；`-layout` 第 47–48 頁）**：和 St. Hilaire 等（2024）共用的調節變項對照。欄位是：本研究的變項、St. Hilaire 的變項、兩邊的級別、級別定義是否對得上（M／NM）、結果是否一致（M／NM）、本研究新增的級別。結果不一致（NM）的有：題目類型的新題；位置的新題；傳遞方式的新題；年齡的重複題；後測形式的重複題。其餘標 M。

## 作者自己的解釋與保留

- **附回饋的 1.25：作者明說不做直接解讀**（第 2433–2444 行）：「This finding may not be surprising, as feedback is well documented to significantly improve the encoding of correct information (Cai et al., 2023; Wisniewski et al., 2020). However, we pause to make straightforward interpretations about the effect of prequestions plus feedback in this instance. In the typical prequestion design, learners do not receive immediate feedback because if given, feedback takes away the ability to make interpretable results between the effects of prequestions or feedback. For instance, if there is a positive learning benefit observed, it may not be clear if the prequestions promoted learning or if learners just memorized the given answer from the feedback. Further, giving feedback may encourage learners to simply remember the correct answer rather than engage with the to-be-learned content. In this instance, rather than learners being oriented to engage with learning material, either to search for the solution or to confirm their answer, they again simply memorize the given solution.」導言註 1（第 129–134 行）是同一個意思。
- **附回饋對新題沒有幫助**：Table 2 新題模型，plus feedback g = −0.04（k = 25），alone 0.03，整體 F 不顯著（第 2217–2222 行）。作者沒有把這一格拿出來討論。
- **搭配其他活動（0.84，p = .07）**（第 2445–2449 行）：「the marginal difference of prequestions plus a supplemental activity suggests that receiving two learning aids that work congruently could potentially engage multiple cognitive processes more than one alone.」
- **只看不答（0.65 對 0.60）：作者沒有下「不必作答」的結論**（第 2450–2491 行）。
  - 這個結果符合注意力機制：「If prequestions primarily direct participants' attention to the specific information in those questions, then we would not expect differences between prequestions alone and prequestions minus」。
  - 但受試者可能在心裡作答了：「Nevertheless, it is possible that participants in the prequestion minus conditions may have covertly answered the questions even though they were not explicitly asked for a response」。
  - 接著引 Sana 等（2020）實驗二：把題目改成不能作答的目標敘述之後，效果就沒了；「The result of Sana et al.'s (Experiment 2) study provides support for the metacognitive-based mechanism in that it suggests the act of answering prequestions does contribute to increased later performance.」
  - 小結（第 2492–2495 行）：「our results appear to best align with expectations for an attention-based explanation of the prequestion effect; however, evidence from situations where participants are unable to covertly answer questions also suggests a possible metacognitive mechanism.」
- **新題的調節變項：概念型題目**（第 2420–2427、2511–2534 行）：「For the effect of prequestion on new questions, the only significant moderator was the type of prequestion… While we discuss the variation across prequestion type below, these interpretations should be contextualized by the fact that the effect was relatively small (g < .35).」作者原本預期概念型題目不會幫到新題，結果相反；解釋是推測：「Perhaps requiring participants to generate an answer from the learning material pushes an individual to encode information more generally rather than searching for a specific bit of information.」混合題型為負的三個解釋也都標成 hypotheses。建議未來直接比較三種題型。
- **新題沒有進步，也沒有代價**（第 2374–2376、2651–2654 行）：「Although there was not an overall benefit of prequestions on new question performance, there was also no cost relative to a control condition.」「This result is relevant to practice in that it assuages the concern that prequestions would lead learners to focus only on the prequestioned information at the expense of the nonprequestioned information.」
- **機制**（第 2378–2395 行）：新題沒有效果「is inconsistent with explanations based on curiosity and metacognition at the general topic level」；讀前題的編碼「is very specific to the particular question(s)」。作者在導言已說明這份分析不打算分離機制（第 204–232 行）。
- **控制組類型的 marginal 結果**（第 2535–2544 行）：控制組做了和教材相關的活動（多的讀書時間、學習目標）時，差距縮小（−0.23）；做無關活動時差距變大（0.29）。
- **和 St. Hilaire 等（2024）的差異**（第 2554–2625 行）：主要結果一致（重複題有效、新題沒有，第 2376–2377 行）。調節變項有出入：St. Hilaire 發現新題的效果在題目全放最前面、影音教材時較強；重複題的效果在成人、簡答題後測時較強；本研究都沒有發現。作者說原因不明，可能是納入的紀錄不同（本研究 55 筆、對方 76 筆，共有 35 筆；本研究多 84 個比較）、編碼定義不同。「we believe that it should not be a concern that results between analyses do not align perfectly.」
- **作者沒有分析閱讀是自控步調還是實驗者控制**（第 2618–2620 行）：「we did not include moderators that specifically assessed whether the duration of learning was experimenter-paced or self-paced… as it was not a feature that appeared when we were considering moderators.」
- **教學建議**（Implications for Practice，第 2626–2668 行）：
  - 「prequestions can be an effective learning tool for specific information related to the prequestion content and can be easily implemented with relatively low cost to instructors.」
  - 「even a small dosage of prequestions, within STEM or non-STEM content areas, over short or longer periods of learning, can result in learning benefits on information specific to the prequestions.」
  - 「Moreover, if prequestions are paired alongside a supplemental activity or aid, such as note-taking or learning goals, these benefits increase even more.」（依據是 p = .07 的 marginal 差異。）
  - **教學建議一節沒有建議附回饋**，全節沒有出現 feedback。
  - 把重複題比作近遷移、新題比作遠遷移；未來可試對比案例或要求自我解釋來讓讀前題有較廣的效果；「for now, it must suffice to say that prequestions are an educational tool that boosts the learning of prequestioned information without being a detriment to nonprequestioned information.」
- **結論**（第 2716–2741 行）：「there is little evidence for abstraction」；讀前提問是「a simple yet powerful tool to promote the learning of prequestioned information」。

## 作者列的限制

Limitations 節（第 2670–2713 行）共三條：

1. **出版偏誤可能影響重複題的結果**（第 2672–2693 行）。三種方法裡兩種顯示有偏誤，第三種「non-significant but numerically consistent with the other tests」。但校正後 .68 對原估計 .66，「indeed the adjusted effect size was larger」；作者認為這表示三層模型「is sensitive enough to capture the overall true effect size despite publication bias」。新題沒有偏誤的證據。
2. **沒有分析被問與未被問內容之間的關聯**（第 2694–2704 行）：「we were unable to make clean assessments of this variable due to the insufficient number of studies that specifically report this level of relatedness.」舉 Little 與 Bjork（2016）把讀前選擇題的錯誤選項設計成新題的正解。St. Hilaire 等（2024）有分析這一項，發現它調節新題的效果（k = 15，p = .02）。
3. **沒有分析答案在教材裡的位置**（第 2705–2713 行）：Sana 與 Carpenter（2023）發現，被問到的資訊放在教材開頭時，讀前題只幫到重複題；放在教材結尾（未被問到的資訊在前）時，重複題與新題都受益。

散在別處的限制：

4. 編碼一致性一開始很低的四個變項（第 581–589 行），之後靠討論解決。
5. 檢索只到 2021 年 7 月，只查 ProQuest 與 ERIC，沒有引文追溯（第 457–465、499–503 行）。
6. 學習時間只有 80／181 個比較有資料；先備知識只有 67 個（Table 3、5 的 k 加總）。
7. 文本量有一部分是用每頁 500 字、每段 150 字估的（註 17）。
8. 機制無法分離（第 226–229、2734–2739 行）。
9. 作者沒有把「調節分析是跨研究比較」列為限制；附錄的相關表顯示多個調節變項彼此關聯，內文沒有討論其影響。

## 與摘要不一致的地方

1. **附回饋**。摘要（第 26–28 行）：「conditions that provided feedback in addition to the prequestions led to better specific learning than receiving prequestions alone」，沒有保留。內文（第 2435–2444 行）：「we pause to make straightforward interpretations」，並說明分不清效果來自提問還是來自記住答案。教學建議一節也沒有建議附回饋。摘要比內文肯定。
2. **摘要沒提新題唯一顯著的調節變項**（題目類型：概念型 0.34、混合 −0.40）。摘要只說新題「no evidence of a general learning benefit」。
3. **教學建議比結果肯定**（不是摘要，但屬於同類問題）：「these benefits increase even more」對應的是 p = .07。
4. **討論段與結果段的 p 值**：回饋對 alone，結果段寫 p < .001（第 2210 行），討論段寫 p < .01（第 2431 行）。
5. **表與內文的 k、g 不一致**：內容（重複題 STEM 47 對 55、expository 97 對 87；新題 52 對 60、90 對 80）；新題的題目類型 factual k 137 對 141；題目數量 medium／very large 的小數。見上表各列。
6. **檢索筆數的算術**：3,116 − 213 ≠ 2,993。
7. **紀錄重疊的百分比**：「35 records shared across analyses (roughly 64% of total records) and 20 records (35%) unique」（第 466–467 行），64% + 35% = 99%。
8. 摘要的兩個主要數字（.66、.01）與「robust… across variations in the learning event, participant sample, and assessment conditions」逐項對過，與內文相符。

## 與現有文章稿不一致的地方

### 第 1 篇（2026-10-13-teaching-text-evidence.md）

1. **第 9 行（tldr）**「讀前先給問題只幫到被問的內容（0.66 對 0.01）」；**第 35 行（結論表）**「被問到的內容 g = 0.66，沒被問到的 0.01｜強，但只幫到被問的內容」→ 兩個數字相符（第 935–942 行）。**漏掉一個會改變說法的調節結果**：新題的效果依題目類型而不同，概念型讀前題對新題是 g = 0.34（k = 18），顯著大於事實型（0.002）；事實與概念混在一起是 −0.40（k = 10）（第 2198–2204 行）。這是新題模型唯一顯著的調節變項。作者自己的保留是效果「relatively small (g < .35)」。「只幫到被問的內容」對事實型題目成立；對概念型題目，這份統合分析的資料不是這樣。→ 建議改成「事實型的讀前題只幫到被問的內容；要推論才答得出來的概念型讀前題，對沒被問到的內容有小幅幫助（0.34，18 個比較）」。
2. **第 111 行**「彙整 204 個比較，結論很乾脆：對事先被問到的內容，g = 0.66；對同一份教材裡沒被問到的內容，g = 0.01，等於沒有效果。這個結果不隨教材是文字或影片、學習時間長短、題目多寡而變。」→ 三個調節變項都相符（p = .88／.39；.97／.96；.94／.48）。三個出入：
   - 「這個結果不隨……而變」只挑了不顯著的三項，沒提顯著的兩項（重複題：呈現方式；新題：題目類型）。
   - 0.66 是所有呈現方式合起來的平均，裡面包含附回饋（1.25）與搭配其他活動（0.84）的條件。最典型、也最接近「文章開頭放一題、不給答案」的 prequestions alone 是 **0.60**（k = 110，第 2211–2212 行）。
   - 「學習時間長短」在這份分析裡指的是**緊接在題目後面那一段教材**的時間（第 710–736 行），最長一級是 17–100 分鐘（平均 30.8）；而且只有 80 個比較有時間資料。和文章更直接相關的是文本量：最長一級 1,697–15,000 字（平均 3,366 字）g = 0.79（k = 35），四級之間不顯著（p = .62）。稿子沒有用這一項。
3. **第 115 行**「沒被問到的內容沒有變好，但也沒有變差。……Hamaker……當時的結果是小幅變差（少答對 5 個百分點）；新的統合分析沒有重現這個損害。」→ 前半與原文相符（第 2374–2376、2651–2654 行）。「沒有重現這個損害」是稿子自己把兩份來源接起來的說法；King-Shepard 在這裡沒有提 Hamaker 的 −.05（他們只在定義段引 Hamaker，第 89–90 行）。整體平均確實是 0.01；但子群裡有負值：混合題型 −0.40（顯著低於其他兩類）、控制組做相關活動時 −0.23（marginal）。→ 建議標明這個對比是作者的整理，並加「混合事實與概念題時是負的」。
4. **第 116 行**「只看題目不作答，效果和作答沒有顯著差別。網頁文章沒辦法要求讀者作答，這一點是好消息。」→ 數字相符（0.65 對 0.60，p = .71）。**漏掉作者的保留，而且保留的方向和「好消息」相反**：作者說受試者可能在心裡作答了，並引 Sana 等（2020）實驗二說明「the act of answering prequestions does contribute to increased later performance」（第 2474–2491 行）。另外這個條件的定義是「specifically instructed not to generate an answer」（第 656–658 行），只有 17 個比較，是跨研究比較。同一份 Sana 實驗二稿子自己在第 103 行引過（題目 67% 對目標敘述 53%），兩處沒有接起來。→ 建議改成「統合分析裡只看不答的 17 個比較，效果和作答的差不多；但原作者提醒受試者可能在心裡作答了，而且 Sana 的實驗二顯示把題目換成不能作答的敘述，效果就消失」，拿掉「好消息」。這一句也和第 2 篇第 60 行「題目要寫明先寫下答案」的推論方向不一致，兩處要對齊。
5. **第 121 行**「讀前問題挑這一節最核心的那一個……它只會幫到它問的那件事。」→ 同第 1 條；「只會」對事實型題目成立。原文另有一個相關的限制稿子只在附錄提：答案在教材裡的位置（Sana 與 Carpenter 2023：被問到的內容放在後面時，新題也受益，第 2705–2713 行）。
6. **第 153 行**「King-Shepard 等人的統合分析裡，題目附回饋的條件在『之後再考同一題』的成績上最好（g = 1.25），優於只給題目。Sana 等人的第三個實驗裡……兩者量的考題不一樣：一個是重複題，一個是新的應用題。附答案可能讓讀者記住那一題的答案，卻少了到正文裡找答案的動機；這句是 Sana 等人的解釋，沒有被直接檢驗。」→ 1.25 相符。四個問題：
   - **(a) 漏掉作者的保留**。審稿者建議修 1 說的對，引句逐字相符（第 2435–2436 行）。
   - **(b) 只取了一半的表**。King-Shepard 自己就有「附回饋 × 新題」的數字：g = −0.04（k = 25），和只給題目的 0.03 沒有差別（Table 2，第 2217–2222 行）。但 Sana 實驗三的期末考不是新題：每一題都對應讀前題問過的那條事實，只是換成應用題型（`sana2020.txt` 第 83–85 行「Each question corresponded to an LO fact, and therefore targeted the same content」），照本篇的定義（第 120–127 行）比較接近重複題，只是本篇的重複題多半逐字相同。所以該拿來對的是附回饋 × 重複題（1.25）：兩份在被問過的內容上方向相反。附回饋 × 新題（−0.04）在 Sana 那邊沒有對應的資料。稿子寫成「一個是重複題，一個是新的應用題」，把 Sana 的考題歸錯了類。（2026-10-14 更正，見檔尾）審稿報告第 213 行說這一組「準確交代了兩邊量的東西不同」，漏了這一格。
   - **(c) 歸屬**。「附答案讓讀者記住答案、少了去正文找答案的動機」不只是 Sana 的解釋；King-Shepard 自己在註 1 與討論段寫了幾乎同樣的話（第 133–134、2440–2444 行）。
   - **(d)** 原作者的教學建議一節沒有建議附回饋。
   → 建議重寫：「統合分析裡附回饋的 26 個比較在重複題上效果最大（1.25），但原作者明說不對這個數字做直接解讀，因為分不清是提問有效還是記住了答案；同一張表裡，附回饋對新題沒有幫助（−0.04）。Sana 的實驗三考的是讀前題問過的事實（換成應用題），附答案的組較差。所以在被問過的內容上兩份方向相反；差別可能在考題是逐字重複還是換成應用題，沒有研究直接比過。」這一組要留在「來源說法不同的地方」。（2026-10-14 更正，見檔尾）
7. **第 175 行**「兩份統合分析檢驗過學習時間長短，都沒有發現效果隨時間改變（King-Shepard 等人的讀前提問……）」→ 相符，但見第 2 條第三點（時間的定義、只有 80 個比較、最長一級平均 30.8 分鐘）。同一行「我讀到的實驗沒有一個用數千字、要讀半小時以上的文章當材料」→ 這份統合分析的文本量最長一級是 1,697–15,000 字（平均 3,366 字，35 個比較），學習時間最長一級是 17–100 分鐘。稿子沒有直接讀那些實驗，但引的統合分析涵蓋了它們。→ 建議改成「我直接讀的實驗裡沒有」，並補上文本量這一項調節結果。
8. **第 179 行**「King-Shepard 等人在被問內容的模型裡偵測到偏誤，校正後的估計沒有變小」→ **相符**（.68 對 .66，第 2678–2679 行）。可補：三種方法裡兩種顯示有偏誤；已發表 .77 對未發表 .56（不顯著）；105 個重複題比較來自未發表來源（多為博士論文）。
9. **第 185 行**「另有一份讀前提問的統合分析（St. Hilaire 等 2023）我拿不到全文，摘要的方向和 King-Shepard 等人一致。」→ King-Shepard 引作 St. Hilaire、Chan、Ahn（2024），Psychonomic Bulletin & Review 31(2), 411–441（第 3480–3482 行；DOI 是 s13423-023-02353-8）。審稿者建議修 15 說的對。「方向一致」只對主要結果成立（第 2376–2377 行）；調節變項有四項不一致（第 2555–2562 行），而且 St. Hilaire 發現被問與未被問內容的關聯程度會調節新題的效果（k = 15，p = .02，第 2700–2704 行）。→ 年份統一成 2024，並把「方向一致」限定在主要結果。
10. **第 211 行（附錄）**逐項：
    - 「55 筆紀錄、204 個比較，三層模型」→ 相符（第 591–592 行）。
    - 「重複題 g = 0.66（95% CI 0.52–0.81，181 個比較）；新題 g = 0.01（−0.09 到 0.12，175 個比較）」→ 相符。
    - 「文字教材 0.67（155 個）與影音教材 0.64（26 個）沒有差別」→ 相符。
    - 「學習時間分四級，0.62 到 0.71，沒有差別」→ 相符。
    - 「相對於只給題目：附回饋 1.25（顯著較大）、搭配其他活動 0.84（p = 0.07）、只看不答 0.65（p = 0.71）」→ 相符；漏了基準值「只給題目 0.60（110 個）」與回饋的保留。
    - 「重複題的模型有出版偏誤的跡象，校正後估計 0.68；新題的模型沒有」→ 相符。
    - 「作者列的限制：沒有分析被問與未被問內容之間的關聯程度，也沒有分析答案在教材裡的位置」→ 相符（限制第 2、3 條）；漏了第 1 條出版偏誤（已在前一句）。
    - 附錄沒寫：12,003 人；檢索到 2021 年 7 月；新題的題目類型調節（0.002／0.34／−0.40）；附回饋對新題 −0.04；文本量；位置（放最前面 0.65 對插在中間 0.67）；105／181 個比較來自未發表來源。
11. **第 238 行（參考資料）**「讀了摘要、整體結果、呈現方式／教材類型／時間／題量的調節分析、出版偏誤與限制」→ 照這個範圍，題目類型的調節（Table 2 第一列、結果段第一段）與討論段沒有讀，正好是第 1、4、6 條漏掉的地方。
12. **第 36、107、169 行**（學習目標改成先猜的問題）沒有直接引 King-Shepard，但審稿報告第 46 行把 King-Shepard 列為這個建議的支持。可以補的原文依據：控制組拿到學習目標等相關活動時，讀前題在新題上的相對效果是 −0.23（marginal，第 2535–2543 行）；位置調節顯示放最前面與插在各段前沒有差別（0.65 對 0.67）。後者和「拆到各節」直接相關：就讀前題而言，集中與分散沒有差。

### 第 2 篇（2026-10-13-teaching-text-questions-feedback.md）

13. **第 48 行**「第 1 篇談的讀前提問也是同一個型態：2025 年的統合分析裡，被問到的內容 g = 0.66，沒被問到的 0.01。」→ 數字**相符**；同第 1 條，少了概念型題目的例外。這一段接著談題目層次（第 50 行），King-Shepard 的「概念型讀前題對新題 0.34」正是同一個論點的近年資料，比 Hamaker 的高階題結果新，稿子沒有用到。
14. **第 60 行**「題目本身要寫明『先寫下你的答案再往下看』。讀者如果只是讀題目、再讀答案，做的事接近『讀一段現成的解釋』。這是我把兩項結果合起來的推論。」→ King-Shepard 有直接相關的資料（只看不答 0.65 對作答 0.60），第 1 篇拿它當「好消息」，這裡的推論方向相反，兩篇互相牴觸。原作者的立場在兩者之間（見第 4 條）。→ 建議在這裡引 King-Shepard 的這一格與原作者的保留。
15. **第 152 行**「**讀前題目要不要附答案**。細節在第 1 篇：一份統合分析裡附回饋的條件在重複題上成績最好，一個實驗裡附答案的組在新的應用題上成績較差。兩者量的考題不同。」→ 同第 6 條：少了作者的保留，也少了「附回饋 × 新題 −0.04」。
16. **第 185 行（待解問題）**「讀前題目旁邊要不要放答案（兩個來源在不同考法上方向相反）。」→ 同第 6 條。在新題上兩個來源沒有方向相反；統合分析的作者自己不把 1.25 當成支持附回饋的證據。
17. **第 162、179 行**（建議 5：目標分到各節、至少一項改成先猜的問題）→ 見第 12 條。
18. **第 267 行**把 King-Shepard 列為「依據寫在第 1 篇」→ 相符。

### 審稿報告的說法核對

- 建議修 1（1.25 少了作者的保留）：**對**，引句逐字相符（第 2435–2436 行）。
- 建議修 15（St. Hilaire 年份）：**對**，King-Shepard 引作 2024。
- 審稿報告第 209 行（King-Shepard 數字核對相符）：數字本身對。
- 審稿報告第 213 行（「King-Shepard 對 Sana 的寫法都準確交代了兩邊量的東西不同」）：**不完整**，漏了 Table 2 裡附回饋對新題的 −0.04。
- **審稿者沒找到的**：概念型讀前題對新題 0.34（第 1 條）；0.66 混了回饋條件、純題目是 0.60（第 2 條）；只看不答的保留與 Sana 實驗二（第 4 條）；兩篇在「要不要作答」上互相牴觸（第 14 條）；學習時間的定義與文本量調節（第 2、7 條）；教學建議沒有建議回饋（第 6 條 d）。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | 1–400 | 標題、摘要、導言、術語、典型實驗設計與註 1、四種假設機制、Potential Moderators（題目、學習事件、評量、受試者）前半 |
| 2 | 401–800 | 先備知識、場域、Present Study（與 St. Hilaire 2024 的差別）、Methods（預註冊、檢索、篩選、資格、抽取、編碼、出版偏誤方法、統計模型）、各調節變項的編碼定義與註 11–19 |
| 3 | 801–1200 | 後測形式、保留間隔、年齡、先備知識、場域的編碼；Results 開頭；Publication Bias；RQ1 整體效果；Table 1；RQ2 開頭；Table 2 前半（碎片） |
| 4 | 1201–1600 | Table 2 後半、Table 3 前半（碎片） |
| 5 | 1601–2000 | Table 3 後半、Table 4、Table 5 前半（碎片） |
| 6 | 2001–2400 | Table 5 後半、Table 6（碎片）；調節變項結果的內文全部（題目、學習事件、評量、受試者、場域）；Discussion 開頭；RQ1 的討論；RQ2 的討論開頭 |
| 7 | 2401–2800 | 重複題與新題調節變項的討論、Discrepancies Between Outcomes、Addressing Unique Moderators、Implications for Practice、Limitations、Conclusion、Appendix 開頭、Table 7 |
| 8 | 2801–3200 | Table 8、Table 9（碎片）、致謝、經費、資料可得性、利益衝突；References 開頭（第 3164 行起，書目，掃過） |
| 9 | 3201–3531 | References 其餘（到第 3524 行，書目，掃過）、出版者聲明 |

表格另用 `pdftotext -layout` 重抽 PDF 第 15、24–32、45–48 頁核對；這是對表格，不是代替閱讀。沒有用 grep 讀原文。Fig. 1–5 的圖面內容沒有讀到（文字檔只有圖說）。

## 補記（2026-10-14，複審後整理）

原文檔最後一行沒有換行符號，`wc -l` 少算一行；多出的那一行只有換頁字元，沒有內容。

## 2026-10-14 更正

比對節第 6 條 (b) 與建議重寫句原本把 Sana 等（2020）實驗三的期末考當成「新題」，據此說兩份來源在新題上一致、都不支持附答案。回原文確認：Sana 的期末 15 題每題都對應一條 LO 事實（`.work/teaching-text-research/seq/sana2020.txt` 第 84 行「Each question corresponded to an LO fact, and therefore targeted the same content」），沒有考 LO 以外的內容；本篇對 new questions 的定義是「assess information that the prequestions did not assess」（第 120–127 行）。所以 Sana 的考題屬於被問過的資訊、換成應用題型，應對照本篇的重複題（附回饋 1.25），兩者方向相反。已改正第 6 條 (b) 與建議句；第 1 篇 L184 已依此修正。
