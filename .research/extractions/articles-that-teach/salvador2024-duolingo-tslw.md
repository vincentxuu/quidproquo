# 抽取紀錄：Salvador 2024，Duolingo Blog〈Behind the metric: how we developed "Time Spent Learning Well"〉

**書目**：Rachel Salvador (2024-06-13). Behind the metric: how we developed "Time Spent Learning Well". *Duolingo Blog*. https://blog.duolingo.com/time-spent-learning-well/。頁面中繼資料：`article:published_time` 2024-06-13T11:00:00Z、`article:modified_time` 2024-12-02T16:29:41Z（改了什麼頁面沒有說明）；作者欄 Rachel Salvador；標籤 Product、Company、Life at Duolingo。

**標題要注意**：清單寫的〈Understanding Duolingo's Time Spent Learning Well Metric〉是網頁的 `<title>`（瀏覽器分頁標題）；頁面上顯示的文章標題（h1 與 og:title）是〈Behind the metric: how we developed "Time Spent Learning Well"〉。引用時用後者。作者姓名清單上原本沒有，這次補上。

**原文檔**（這次另存）：
- `.research/raw/learning-content/q6-evaluate/duolingo2024-tslw.html`：2026-10-14 用 curl 直接從 blog.duolingo.com 抓的原頁（HTTP 200，120,867 位元組）。
- `.research/raw/learning-content/q6-evaluate/duolingo2024-tslw.txt`：由上檔轉出的純文字，圖片保留 alt 與網址（403 行、17,765 位元組）。下面行號是這個檔的行號。
- 三張圖（每課平均時間長條圖、TSLW 公式、XP 實驗折線圖）另外下載看過，沒有存進 raw 目錄；網址在 txt 檔 L185、L204、L218。

**讀取日期**：2026-10-14
**版本**：公司官方部落格文章（非研究、未經審查）；讀的是 2024-12-02 修改後、2026-10-14 當下線上的版本。
**供**：order 25

## 這篇是什麼

產品團隊的自述文章，講 Duolingo 內部用來在 A/B 測試裡代表「學習」的代理指標怎麼演變。**不是研究**：沒有方法、沒有樣本數、沒有統計檢定、沒有任何獨立量測的學習成果。全文正文約 60 行（L162–L235）。

## 研究設計

不適用。文中提到的資料只有兩張圖：
- 圖一（L185）：各內容等級的每課平均時間長條圖，三根柱（Intro、A level、B level）。**縱軸沒有刻度數字**，只看得出 Intro < A < B。圖片 alt 寫「average seconds per lesson」，圖上軸標是「Average time per lesson」。
- 圖三（L218）：「Experiment results for "rebalancing XP"」，縱軸「percent lift in minutes」（Time Spent Learning Well），橫軸 2 月初到 3 月 11 日（**沒有年份**）。兩條線：partial_adjustment 多在 0.8–1.3% 之間、圖例寫「approx. +1,100,000 minutes / day」；full_adjustment 多在 1.3–1.9% 之間、圖例寫「approx. +1,800,000 minutes / day」。沒有信賴區間、沒有樣本數、沒有說對照組是什麼、沒有說這是哪個使用者母群。百分比區間是我看圖目測的。

## 結果（逐項）

這篇沒有研究結果；下面逐項列它**說了什麼**，每項標明依據是什麼。

| # | 說法 | 依據（文中給的） | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 為什麼需要代理指標：正式的成效研究沒辦法用在日常 A/B 測試 | 作者陳述 | L176 | 「Our Efficacy Lab conducts rigorous research to measure the efficacy of Duolingo, but these studies aren't helpful in conducting A/B tests on a daily basis. It's extremely important that we have a proxy metric for learning」 |
| 2 | 第一個指標 **Total Sessions**：完成的 session 總數；想法是做越多學越多 | 作者陳述 | L179 | 「The idea was more sessions = better for learning. If you do more, you learn more, right? Not quite!」 |
| 3 | 換掉的理由：session 長度差很多，難的課比較久；指標偏向反覆刷短而簡單 session 的人 | 作者陳述＋圖一（無數字） | L181–L183 | 「The metric wasn't accurately measuring engagement or learning—we were biased towards people who were grinding on shorter, easier sessions.」 |
| 4 | 舉例：一天 15 分鐘可以是 5 個簡單 session 或 3 個難的 | 假設性例子，不是資料 | L183 | 「that might be 5 easier sessions (faster to complete) or 3 harder sessions (longer to complete)」 |
| 5 | 第二個指標 **Time Spent Learning (TSL)**：花在學習活動上的時間 | 作者陳述 | L188 | 「This focused on time learners spent in learning activities ... The challenge: we had to figure out how to make it relatively resistant to outliers.」 |
| 6 | TSL 總量的問題：被一小群很用功的人拉動；改動排行榜這類競爭功能時，總量成長主要來自這群人 | 作者陳述，沒有數字 | L190 | 「Total TSL ended up being skewed to a small set of studious learners. And if we changed features that impacted competitiveness—like Leaderboards—Total TSL grew mostly due to these very active learners.」 |
| 7 | 因此改成最佳化「每天至少花 15 分鐘的學習者比例」 | 「several formal studies」、內部專家討論、現有行為——三者都沒有引用或連結 | L192 | 「after conducting several formal studies, discussions with our internal learning and curriculum experts, and assessing current learner behavior, we decided to optimize for a higher percentage of learners spending at least 15 minutes/day on Duolingo.」 |
| 8 | 第三個指標 **Time Spent Learning Well (TSLW)**：不是所有學習時間等值，往下走學習路徑的課比較有價值 | 作者陳述＋第 9 列的引文 | L194、L200 | 「we realized not all learning time is equal—after all, lessons on the path are the ones that teach you new concepts, skills, and vocabulary!」 |
| 9 | 支持「路徑課較有價值」的外部依據 | 引 Northern Arizona University 與 East Carolina University 研究者的白皮書一句話（連結檔名 Plonsky_etal_whitepaper_language_learning_grit_motivation_2023.pdf，放在 duolingo-papers 的 S3） | L200 | 「an independent study from researchers at Northern Arizona University and East Carolina University found that "the number of completed lessons was the strongest predictor of learning gains."」 |
| 10 | 路徑課與其他課的定義 | 作者陳述 | L196–L198 | 路徑課：「any lesson node that moves you down the path, including: personalized practice, Stories, and Unit Review」；其他：「Practice Hub exercises, level review, Legendary, Side Quests, Match Madness, and Ramp Up challenges」 |
| 11 | **公式**（作者稱「rough formula」）：TSLW = 路徑上的學習分鐘數 + 其他課的學習分鐘數 ÷ 2 | 公式圖（看過圖）；0.5 這個權重怎麼來的**沒有交代** | L202–L204 | alt：「TSLW= Minutes Learning on Path + 0.5*Minutes Learning in Other Lessons」 |
| 12 | 用來拉高 TSLW 的功能：每日任務（順序由易到難、偏重往前推進的活動）、每月挑戰（從 XP 制改成任務制，理由是 XP 制會讓人月底集中刷分）、排行榜（提高路徑上的 XP） | 作者陳述；只有排行榜附圖三 | L210–L216 | 「When learners were focused on gaining XP for a Monthly Challenge, they could spend the last few days of the month gaming the system to earn XP in bulk.」 |
| 13 | XP 重新配置實驗：partial 約 +110 萬分鐘／日、full 約 +180 萬分鐘／日的 TSLW | 圖三；量的是 TSLW 本身，不是學習成果 | L216–L218 | 圖例：「partial_adjustment approx. +1,100,000 minutes / day」「full_adjustment approx. +1,800,000 minutes / day」 |
| 14 | **反向結果**：把課縮短，原本希望大家多做幾課，結果 TSLW 反而下降 | 作者陳述，沒有數字 | L225 | 「We tried out making lessons shorter in the hopes that learners might be motivated to do more lessons, and TSLW would go up. Overall, this wasn't the case, and ultimately the shorter sessions hurt TSLW.」 |
| 15 | 增加新內容（把路徑拉長）對 TSLW「always」有正面影響；原因是作者的假設 | 作者陳述，沒有數字 | L228 | 「We hypothesize that learners enjoy making progress and engaging with fresh content」 |
| 16 | 不是每個功能都要拉高 TSLW；留存優先 | 作者陳述 | L231 | 「Our philosophy is: "they can't learn if they churn,"」 |
| 17 | 指標仍在修 | 作者陳述 | L235 | 「We're still refining TSLW」 |

## 作者自己列的限制

文中沒有限制一節。散在文中、算得上保留的只有三句：公式是「rough formula」（L202）；「most of the time, for most learners, going down the path is the most helpful」（L200，不是所有人所有時候）；「We're still refining TSLW」（L235）。

原文沒有說、但讀完可見的：
- **全文沒有任何一處拿 TSLW 去對照獨立量測的學習成果**。唯一的外部依據是第 9 列那句引文，講的是「完成的課數」預測學習增益——而「課數」正是文章第一段說已被淘汰的那類指標（Total Sessions 數的是 session），引文支持的是「多上課」，不是「TSLW 這個加權時間公式」。
- 那份白皮書文中稱「independent study」，但檔案放在 Duolingo 自己的儲存空間；經費來源與是否獨立，這次**沒有讀那份白皮書**，不能判斷，也不能轉引它的結論。
- 0.5 的權重、15 分鐘的門檻，都沒有給出推導或資料。
- 文中每一次「換指標」的理由都是「舊指標會被某種行為灌水」（刷短課、少數重度使用者、月底刷 XP），是從指標被玩壞的角度修，不是從指標與學習的相關去驗證。
- 圖三的成功標準就是 TSLW 自己上升：用代理指標證明拉高代理指標的功能有效，是循環的。

## 與摘要說法不一致的地方

這篇沒有摘要。把開頭兩段（L162–L164）當導言對過：
- 導言稱 TSLW 是「an essential quality metric that helps us optimize for learning alongside growth」。正文沒有提供它與學習成果相關的資料（見上）。「optimize for learning」是主張，不是文中證明過的事。
- 導言說「TSLW has evolved over several years」；正文沒有給任何年份，三個指標各用了多久、何時換的都沒寫。
- 其餘（三段演變、公式、三個測試心得）導言的預告與正文一致。

## 與清單「要撐的結論」不合的地方

清單寫：「實務端怎麼選代理指標、為什麼換過兩次」。

- 「換過兩次」撐得住：Total Sessions → Time Spent Learning → Time Spent Learning Well，三個指標、兩次更換。可以再精確一點：第二階段內部還有一次調整（從 TSL 總量改成「每天至少 15 分鐘的學習者比例」），文章沒有把它算成換指標。
- 「為什麼換」：第一次是因為 session 長短不一、獎勵刷短課；第二次是因為不同活動的學習價值不同。這兩個理由原文都有，但都是**作者陳述**，沒有數字。寫的時候要寫成「Duolingo 自己說」。
- 「怎麼選」要小心：這篇只說了他們選了什麼、為什麼丟掉前一個，**沒有說明或示範 TSLW 與實際學習的關係有沒有被驗證過**。不能寫成「Duolingo 找到了與學習相關的指標」。對 order 25 的論點（讀者說好或投入高，不代表學到）而言，這篇是「連把成效研究做得最認真的公司，日常決策用的也是時間類代理指標」的例子，而不是「代理指標有效」的證據。
- 可引的具體內容：公式（路徑分鐘數＋其他分鐘數的一半）、15 分鐘／日門檻、縮短課程反而讓指標下降。XP 實驗的 +110 萬、+180 萬分鐘／日可以引，但要說明沒有年份、沒有基數、量的是指標本身。
- 清單把它列為 2024 年；刊出日 2024-06-13 正確，另有 2024-12-02 的修改。

## 讀取紀錄

`duolingo2024-tslw.txt` 行號，依序讀完整個檔：

- L1–L74：頁面中繼資料（標題、作者、發布與修改時間、標籤）
- L75–L147：站台導覽列（無內容）
- L148–L235：文章本體，全部讀完（日期、作者、h1、副標、導言、How we arrived at TSLW、How we influence TSLW、Testing everything、Keep learning!）
- L236–L403：標籤、分享連結、相關文章區塊（空的，由腳本載入）、頁尾（無內容）

圖：三張圖都下載看過原圖（每課平均時間長條圖、公式、XP 實驗折線圖）；兩張產品截圖與首圖只讀 alt。文中三個外連（growth-model-duolingo、Efficacy Lab 研究頁、Plonsky 等白皮書）**都沒有點進去讀**。原頁用 curl 直接取得，沒有經過搜尋服務或第三方轉貼；和先前的 Exa 摘錄沒有逐字比對。
