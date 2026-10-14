---
title: "把間隔複習做進教學文章：Quantum Country 的資料、線上課程的實驗與沒普及的原因"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, spaced-repetition, retrieval-practice, self-learning, course-guide, blog]
lang: zh-TW
description: "整理把間隔複習放進文章或課程的作品與研究：Quantum Country 的內嵌題與寄信排程、延後複習的非正式實驗、MOOC 推送複習題的隨機實驗、排進上課時間的個人化複習、Duolingo 排程實驗量的是什麼、Execute Program 的每日上限、醫學生用 Anki 的系統性回顧，以及做的人自己列出的採用障礙。"
tldr: "做得最完整的 Quantum Country 在一篇約四小時的文章裡嵌了 112 題，之後寄信排複習；作者自評「不複習會記得少很多」只有初步證據，推廣到其他領域沒有證據。把複習題推給 MOOC 學習者，約八成的人一次都沒碰，成績沒有測到差異；有效的例子是把複習排進上課時間的課堂實驗。"
series:
  name: "教學文章怎麼寫"
  order: 17
draft: false
---

> 🌏 [English version](/posts/learning/2026-10-14-spaced-review-in-teaching-articles-en)

這是「教學文章怎麼寫」系列的第 17 篇，屬於第四部分「隔一段時間之後」。[第 16 篇](/posts/learning/2026-10-14-spaced-practice-in-real-courses)查了分散練習離開實驗室、放進真實課程之後還剩多少效果。這篇往下問一步：如果間隔複習有用，寫文章的人能不能把它直接做進文章裡，讓讀者幾天、幾週後再回來答一次？

起因是本站的課程導讀。規格要求每個主要小節結尾放一題自我檢查，附答案或判準；實際寫出來，答案多半收在要點一下才展開的區塊裡（[第 9 篇](/posts/learning/2026-10-13-teaching-text-questions-feedback)談題目怎麼出，[第 10 篇](/posts/learning/2026-10-14-do-readers-answer-embedded-questions)談讀者會不會答）。這些題目都是讀到那裡當場答。讀者讀完一篇之後，文章就和他們沒有關係了；同一個系列的下一篇什麼時候被讀，本站也不知道。

有人試過把這一段補起來。最有名的是 Andy Matuschak 與 Michael Nielsen 2019 年做的 [Quantum Country](https://numinous.productions/ttft/)：一篇講量子計算的長文，題目嵌在正文裡，讀者讀完幾天後會收到電子郵件，請他們回來複習。兩位作者把這種形式叫做 mnemonic medium（下面寫成「記憶媒介」）。這篇整理它公布了哪些資料，再看同一個想法搬到線上課程、語言 app、程式教學網站和醫學生自修時的結果，最後整理做的人自己說它為什麼難推廣。

先講一個缺口。本站沒有任何閱讀行為的資料，網站沒有載入分析工具，所以我不知道本站讀者會不會回頭讀、隔多久回來。我也沒找到研究教學型網頁文章讀者回訪的文獻。下面的資料全部來自別的情境。

**這批來源怎麼選的**。我先做了一輪掃描，再挑 11 份從頭讀到尾。挑的標準是有沒有公布「把複習放進教材之後實際發生什麼」。挑出來的來源有兩個明顯的偏向。第一，最詳細的資料多半由做產品的人自己公布：Quantum Country 的作者、Duolingo 的員工、Execute Program 的創辦人；其中 Matuschak 的工作筆記與 Execute Program 的論壇留言沒有經過同儕審查。第二，有隨機分派的只有線上課程、語言 app 和一間中學的課堂。Matuschak 後來在給贊助者的信裡寫過更多 Quantum Country 的資料，那些信標明不得分享或引用，這裡不用。

## 先看結論

| 問題 | 目前讀到的答案 | 證據的性質 |
|---|---|---|
| 做進文章的複習，做完的人記得多少 | Quantum Country 做到第 6 次複習的讀者，平均每題約 54 天的「已驗證保留時間」，累計複習約 95 分鐘，文章本身約 4 小時（[Matuschak 與 Nielsen 2019](https://numinous.productions/ttft/)） | 作者對自家後台的描述；只算做完的人，作者自己問這是不是存活者效應 |
| 不複習會差多少 | 延後兩週不複習的組，8 題的正確率 91% 降到 87%；照常複習的組 89% 升到 96% | 作者自稱的非正式實驗，延後組 25 人、照常組 16 人，沒有寫分組方式、沒有檢定 |
| 題目放在文章裡，還是事後另給一包 | 作者主張嵌在敘事裡是這個形式能處理概念性知識的原因；沒有公開資料比較過兩種做法 | 作者的主張，沒有資料 |
| 作者自己怎麼評 | 「做完複習的人記得住」證據強；「不複習會記得少很多」只是初步證據；推廣到其他領域沒有證據 | 作者自評 |
| 把複習題推給線上學習者 | 被分到實驗組的 523 人裡，102 人至少碰過一次；成績沒有測到差異（[Davis 等 2018](https://doi.org/10.1145/3170358.3170383)） | 一門 MOOC 的隨機實驗，遵從率低 |
| 把複習排進上課時間 | 個人化排程的項目，寒假後的考試比集中複習高 16.5%（依圖判讀是相對比例）；章末小考則是集中複習最高（[Lindsey 等 2014](https://doi.org/10.1177/0956797613504302)） | 一所中學、179 人、受試者內隨機分派 |
| 大規模的排程實驗量了什麼 | Duolingo 換排程演算法的兩個實驗只量隔天回訪；新演算法對舊規則，練習的隔天回訪下降 7.3%，仍全面上線（[Settles 與 Meeder 2016](https://doi.org/10.18653/v1/P16-1174)） | 將近 100 萬人與 330 萬人的兩個隨機實驗，沒有學習指標 |
| 強制間隔 | Execute Program 第一天只開 5 課，之後每天先複習再開新課；新使用者偶爾來信抱怨，長期使用者來信稱讚（[Bernhardt 2021](https://news.ycombinator.com/item?id=26349754)） | 創辦人在論壇上自報，沒有成效資料 |
| 學生自己用間隔重複軟體 | 醫學生用 Anki 的 11 個研究沒有一個隨機分派；Step 1 的正向結果都來自橫斷問卷（[Frappa 等 2026](https://doi.org/10.1007/s40670-026-02643-5)） | 系統性回顧，納入研究多為觀察性 |
| 為什麼沒有變成普遍做法 | 做的人自己列的原因：讀者要養成回來的習慣、好題目難寫、讀者覺得像作業、需要帳號與排程系統 | 沒有研究直接檢驗過；都是做的人的說法 |

表裡的「沒有測到差異」不等於「沒有效果」。這批研究裡，做的是隔一段時間的複習、有隨機分派、又量了學習成果的只有兩個：MOOC 那個沒有測到差異，課堂那個有效，但課堂那個的複習是老師排進上課時間的，學生不用自己決定要不要回來。

## 「把複習做進文章」做過的幾種樣子

同樣叫「間隔複習」，下面幾個來源做的事差很多。差別主要在兩點：誰決定什麼時候複習，讀者需不需要自己回來。

| 形式 | 誰決定何時複習 | 讀者要不要自己回來 | 來源 |
|---|---|---|---|
| 題目嵌在正文，讀完幾天後寄信請讀者回來複習 | 系統排程 | 要，靠電子郵件提醒 | Quantum Country |
| 線上課程的影片頁自動跳出題目，題目抽自前幾週的內容 | 系統，在學習者開影片時出題 | 學習者本來就要回課程看新影片 | Davis 等 2018 |
| 課堂用的閃卡軟體，複習時段由老師排在上課時間 | 老師排時段，演算法選題 | 不用，上課就會做 | Lindsey 等 2014 |
| 語言 app 依演算法決定練習時出哪些字 | 演算法 | 要，app 本身就靠每天回來 | Settles 與 Meeder 2016 |
| 程式教學網站每天只開幾課，隔天先複習再開新課 | 系統，而且強制 | 要，不回來就不能往下學 | Bernhardt 2021 |
| 學生自己用 Anki 之類的軟體做卡、自己排 | 學生自己 | 要，全靠自己 | Frappa 等 2026 |

還有一種常被混在一起的做法：影片播到某處就出一題，考的是剛看完的內容。[Kovacs 2016](https://doi.org/10.1145/2876034.2876041) 分析的 Coursera 課程就是這樣，第 10 篇已經整理過它的作答率。那種題目是讀到那裡當場答，沒有「隔一段時間」，所以這篇不把它算成間隔複習。本站各節的自我檢查也屬於這一類。

## Quantum Country 公布了什麼

### 做法

Quantum Country 的第一篇文章〈Quantum Computing for the Very Curious〉內嵌 112 題。讀者要建帳號，讀到一處就答一題；題目和答案成對，介面上叫卡片。讀完幾天後，讀者收到電子郵件，請他們登入複習。

排程是這樣：文內答過之後，答對就把間隔拉到 5 天，再來 2 週、1 個月，依此類推；作者寫連續答對五次，間隔就到 4 個月。答錯就降一級，例如 2 週降回 5 天。作者在旁註說，首次複習隔 5 天是後來才改的，Quantum Country 大部分時間用的是比較保守的排程。

兩位作者在 [〈How can we develop transformative tools for thought?〉](https://numinous.productions/ttft/)（2019 年 10 月）裡交代這些。這篇是自行發表的長文，不是研究報告，沒有方法節，裡面的數字都是作者對自家後台資料的敘述。

### 做完複習的人記得多少

作者用的指標叫「demonstrated retention」，我譯成「已驗證的保留時間」：一張卡片某次答對的複習，和它前一次複習之間的最長間隔。也就是說，排程把間隔拉到 1 個月、讀者那次也答對了，這張卡就算有 1 個月的已驗證保留時間。它不是另外做的保留測驗。

做到第 6 次複習的使用者，作者從圖上讀出「most users」112 張卡加總約 6,000 天，換算成每題約 54 天。達到這裡通常花約 95 分鐘的總複習時間，而讀完文章約 4 小時，所以作者說額外的時間不到一半。Matuschak 的[工作筆記](https://notes.andymatuschak.org/z4biJ7i6da3exh3qmXXohjh)寫的是 90 分鐘、額外 35% 到 50%，和長文的數字略有出入。

這個數字有兩個條件，作者自己在[另一則筆記](https://notes.andymatuschak.org/zRxhtQqHvLpatPLB4BvzMRB)交代了：

- 資料只算第一次複習前、在文內答了八成以上題目的讀者，用的是 2019 上半年較保守的排程。
- 作者自己問：「But is this just a survivorship effect?」接著問這些讀者是不是不複習也會記得，或者是不是本來就記得這些內容。

另一個常被引用的數字是 195 人：原型發布六個月後，有 195 位使用者在這篇文章至少八成的卡片上達到一個月的已驗證保留時間。原文沒有寫總共多少人讀過、多少人建了帳號，所以這個數字換算不出比例。作者稱之為「an extraordinary level of commitment to the process」。

### 不複習會差多少

能回答這個問題的，是作者在長文裡稱為「informal experiment」的一次比較。挑 8 張卡，一部分使用者初讀時答過之後，至少兩週不能複習它們；其他使用者照常複習。原文沒有寫怎麼決定誰在哪一組。

- 延後組 25 人：正確率從初讀的 91% 降到兩週後的 87%。
- 照常組 16 人：從 89% 升到 96%。
- 逐人看：照常組每個人都持平或進步；延後組 40% 的人變差。

這次比較用的是更早的排程（1 天、3 天、1 週、2 週），沒有做顯著性檢定。延後組前後兩個數字的信賴區間（作者給的是 91 ± 4% 與 87 ± 5%）互相重疊，這是我對照數字看到的，作者沒有提。作者另外說，延後組這段期間仍在複習其他卡，內容和那 8 張有重疊，幾乎一定拉高了他們最後的表現。

### 題目放在文章裡，還是事後另給一包

寫文章的人最可能想問的是：題目一定要嵌在正文裡嗎？附一份可以下載的題庫，讓讀者事後再複習，少了什麼？我讀到的公開資料沒有回答這個問題。長文的主張是，把間隔重複嵌進敘事裡，是這個形式能處理抽象、概念性知識的原因；但文中沒有拿「嵌在文章裡」和「另附題庫」比過。兩位作者另外提到，他們先前主張卡片要由使用者自己寫，Quantum Country 改由作者寫，作者說初步的使用者回饋顯示「it has worked out adequately」，以後還要再深入看。

### 作者自己怎麼評

Matuschak 在[一則筆記](https://notes.andymatuschak.org/zqetsQERteJhyPitmRoaeE)裡列出想說的四句話：做完複習就能可靠地記住讀過的東西；不做複習會記得少很多；花的時間不多；這個效果能推廣到很多領域。接著是自己的評分：

> Within Quantum Country, we have strong evidence of 1, moderate evidence of 3, and emerging evidence of 2. We have no evidence of 4 yet.

這句話要讀清楚：作者認為證據強的只有「做完複習的人記得住」。「不複習會記得少很多」這個因果比較只是初步，推廣到其他領域沒有證據。長文裡同樣的保留也在：「These are preliminary results, and need more investigation.」作者最強的一句結論是「At a minimum, it seems likely the mnemonic medium is genuinely helping people remember.」

長文還有兩件引用時要注意的事。第一，原本有一條設計原則「開頭的題目要出得很簡單」，2019 年 12 月作者加註撤回，說它來自資料分析的錯誤；同一篇後面列三條原則時還保留著這一條，沒有同步改。第二，長文的總結說得比正文滿：總結寫可以把有效的記憶提高一個數量級、可以建立真正的概念理解，正文對應的地方則是「we don't quite mean those numbers literally」，以及作者還不清楚讀者到底學到了什麼。

## 搬到課程與產品之後

### 推給 MOOC 學習者的複習題

Dan Davis、René Kizilcec、Claudia Hauff、Geert-Jan Houben [2018 年的實驗](https://doi.org/10.1145/3170358.3170383)最接近「系統替學習者排複習」。地點是 edX 上一門地球科學 MOOC，至少進過課程一次的 1,047 人隨機分成兩組。實驗組在第 2 到 6 週的講課影片頁上，會自動跳出一個小視窗，題目從前幾週的題庫隨機抽，右上角可以直接關掉，不計分。對照組沒有跳出的題目，但兩組每週都拿到同一頁說明，講自我測驗的好處與做法。同一個實驗另有期刊擴充版（[Davis 等 2018，JLA](https://doi.org/10.18608/jla.2018.53.3)），第 10 篇引的是那一版，作答率的細節在那裡。

實驗組 523 人裡，只有 102 人至少碰過一次跳出的題目。以分派的組別比，取得證書、拿到非零成績、連續成績三項都沒有測到差異；用分派當工具變數估計實際使用者的效果，也沒有。作者的結論框寫：

> The causal analysis yields no evidence that ARPS raised learning, performance, or self-regulatory outcomes in this course.

有碰題目的 102 人，通過率 34%，遠高於對照組全體的 8%。作者明說這不能當因果，因為是拿自己選擇去作答的人和對照組所有人比；作者也把沒測到效果歸因於樣本小與遵從率低。我的判斷是這個實驗的檢定力很低：兩組通過率都只有 7% 到 8%，成績中位數是 0。所以它說的是「沒有證據顯示有效」，不是「證明無效」。

這篇另有一組和「隔一段時間」直接相關的探索性資料。通過課程的人答這些舊題，答對率（分母含略過）從第 2 週的 67% 降到第 6 週的 49%；依題目出自幾週前算，隔 1 週答對 65%，隔 5 週 42%。作者給的原因是每週要考的內容變多，以及時間一久就忘。

同一團隊 [2016 年在另外兩門 MOOC 的實驗](https://doi.org/10.1007/978-3-319-45153-4_5)常被一起引用，但做的是另一件事：每週看完最後一支影片後，請學習者寫 3 到 5 句重點，當下寫，沒有延遲。被分到這一組的人裡 22% 點過任何一個提示；另一門課的讀書計畫提示，14.7% 點過。作者報告在投入較高的學習者之間，寫重點的組成績沒有顯著差異，但沒有給任何統計量。它不能拿來說「間隔複習無效」，能說的只是放在課程裡、不強制的提示，多數人不會點。

### 排進上課時間的複習

Robert Lindsey、Jeffery Shroyer、Harold Pashler、Michael Mozer [2014 年的實驗](https://doi.org/10.1177/0956797613504302)是這批來源裡唯一有隨機分派、量了延後考試、而且結果正向的。地點是美國一所中學，同一位老師的 6 個班、179 位八年級生，一學期的西班牙文單字。學生在課堂上用一套網頁閃卡軟體，每章的項目隨機分成三份，各交給一種複習排程：一直練本章（集中）、固定複習上一章（一般間隔）、由模型估每個學生每個項目的遺忘程度再挑題（個人化間隔）。三種排程拿到的複習次數一樣。

學期結束 28 天後的累積考試，個人化排程的項目比集中複習的相對高 16.5%，比一般間隔的高 10.0%（原文沒有說明這是百分點還是相對比例，從圖上的長條看較像相對比例，這是我的判讀）。但章末小考是集中複習最高（89.4%，另兩種是 87.2% 與 88.1%），因為它在被考的那一章上練得最多。同一份資料裡，當下的考試集中較好，延後的考試分散較好。

搬到文章時要注意三件事：

- 複習時段是老師排進上課時間的，每週約 30 分鐘，占學生投入這門課的時間約一成。學生不用自己決定要不要回來。
- 個人化排程用的是全體學生對全體項目、帶時間的每一次作答，還要一台伺服器持續重跑模型。學期末一次推論要半小時，後端至少當機三次。
- 作者承認個人化和「複習間隔拉得比較開」兩件事分不開：「We acknowledge that our design confounded personalization and the coarse temporal distribution of review」。所以能說的是這套個人化排程勝過固定複習上一章，不能說個人化本身帶來多少。

### Duolingo 的排程實驗量的是回訪

Burr Settles 與 Brendan Meeder [2016 年的論文](https://doi.org/10.18653/v1/P16-1174)提出一個預測每個字遺忘速度的模型，並在 Duolingo 上做了兩個使用者實驗。兩位作者做這項研究時都在 Duolingo，受測的是自家產品。

兩個實驗量的都只是隔天回訪：某天做了某項活動的學生，隔天回來再做的比例。全文沒有量學習成果。

- 第一個實驗，新模型對原本的規則，六週、將近 100 萬名學生。整體活動與新課的隔天回訪都是 +0.3%，不顯著；練習的隔天回訪下降 7.3%，顯著。實驗前，不少學生說會為了讓技能樹維持金色而練習，但練習時複習的不是自己最需要的；加上新模型組對強度條品質的正面軼事回饋，作者判斷新模型對參與比較好，「so we deployed it for all students.」
- 第二個實驗在幾個月後，比的是拿掉一組特徵的簡化版對完整版新模型，因為上線後學生抱怨某些字怎麼練都衰退得很快，作者判斷是過度擬合。簡化版的整體活動隔天回訪 +12.0%。

摘要寫的「improve Duolingo daily student engagement by 12%」來自第二個實驗，比的是修掉自家模型的問題，不是新模型對舊規則。原文沒有說這些百分比是相對變化還是百分點。

### 強制每天只能讀幾課

Gary Bernhardt 經營的程式教學網站 Execute Program 走另一個方向：直接限制讀者。Bernhardt 2021 年 3 月在 Hacker News 一則[談成癮設計的討論串](https://news.ycombinator.com/item?id=26349754)裡描述：開始一門課的第一天只能讀 5 課，之後每天先做前一天的簡短複習，再開幾課新課，做完就擋住到隔天。「You can't binge/cram even if you want to.」複習間隔呈指數拉長，而且會依複習表現決定解鎖哪些課。

Bernhardt 說新使用者偶爾來信抱怨，想一天讀完一門課；長期使用者則來信說喜歡，理由是隔天還答得出來才算真的懂，以及不用再煩惱今天讀得夠不夠。唯一的數字是完成一門課的中位數 8 到 18 天，依課程而定。Bernhardt 自己說「Obviously I'm very biased here」，也說「不能一次讀完」這一點很難向人說清楚。

這則留言沒有任何學習成效資料。底下的回覆裡，有人說付了錢就不願意被強制配速，有人問「who are you to judge how I learn ?」；篇幅最長的一條反對意見是：每天鎖住、叫你明天再來，正是手機遊戲拉留存的手法。回覆的人沒有一個自稱是這個產品的付費或長期使用者。

### 學生自己用 Anki

最後一種是讀者自己動手。Nicholas Frappa 等人 [2026 年的系統性回顧](https://doi.org/10.1007/s40670-026-02643-5)收了 11 個研究醫學生使用 Anki 與考試成績的研究，合計 1,135 人。

- 11 個研究沒有一個是隨機分派。5 個是橫斷研究，其餘是世代研究、準實驗與混合方法。
- 「使用 Anki」怎麼量各不相同：5 個用軟體紀錄，4 個靠學生自報，2 個由老師發牌組、沒有量個人用量。
- 美國醫師執照考試第一階段（Step 1）的三個正向結果都來自橫斷的自報問卷；唯一看第二階段的研究沒有測到差異。
- 有對照組的兩個準實驗方向相反：老師發四週牌組的那個有進步（d = 0.8），用前一屆當對照的那個沒有測到差異。

作者的結論是：「these findings should not be interpreted as causal」，而且觀察到的關聯比較可能反映提取與間隔的學習策略，不是 Anki 這個軟體本身。用量越多成績越好，作者說可能有一部分是自我選擇：原本程度好、動機強、時間多的學生比較會持續用。

## 為什麼沒有變成普遍做法

我沒有找到統計這類做法採用率的資料。Matuschak 與 Nielsen 2020 年在 [〈Timeful Texts〉](https://numinous.productions/timeful/)裡寫的是間隔重複系統「not yet widely adopted」。下面的原因都是做的人自己的說法，或我從上面的資料推的，沒有研究直接比較過採用與不採用的原因。

**讀者要養成固定回來的習慣**。這是最多來源指向的一點。Matuschak 的[筆記](https://notes.andymatuschak.org/z3DiwZKDuLxMV17mt2nWH7y)說「adopting any new regular habit is a burden for most people」，而做閃卡複習讓人想起高中，好處又不會很快顯現，「So people churn.」〈Timeful Texts〉設想在複習裡出一題考讀者讀過的書，作者自己承認這種題目單獨看可能顯得累贅，成立的前提是一個目前不存在的狀況：

> Such prompts might seem onerous or strange on their own, but what if most educated people maintained a regular review practice of the kind we’ve described?

資料上的對應是 Davis 的實驗：系統已經把題目送到學習者正在看的頁面，被分派的人裡仍有約八成一次都沒碰。

**好題目難寫**。〈Timeful Texts〉：「One important barrier to adoption is that it’s surprisingly difficult to write good prompts.」Matuschak 的[總索引筆記](https://notes.andymatuschak.org/Mnemonic_medium)在作者端的障礙裡列了替別人寫題可能比替自己寫更難。長文另外描述一種失敗：文中唯一一題以「Who」開頭的題目，很多使用者學會看到「Who」就背出答案，「This is a common failure mode in memory systems, and it's deadly to understanding.」作者說要試用多種等價問法來對付，當時還沒做。

**讀者覺得像作業**。Matuschak 把記憶媒介用在非技術文章時收到的讀者留言（作者自己標為軼事），作者把其中一類歸為「像作業、有壓力」。一位讀者說文中的題目「reminds me of school homework」；另一位讀到約三成就離開，說「it felt strangely stressful」，但同一則留言也說「I totally recognize that my retention of the core concepts is likely to increase from going through those prompts」，最後的結論是「Definitely not a bad thing, albeit uncomfortable.」[另一則筆記](https://notes.andymatuschak.org/z8kPkXQZ3wVR5DfJ79uhnuz)的開頭是「The initial mnemonic medium is implicitly authoritarian in premise」，作者認為現行做法妨礙瀏覽與跳讀，讓人覺得題目不是自己的，主張讓讀者自己決定收哪些題。Execute Program 的新使用者抱怨與 Hacker News 上的反對，是同一類反應。

**需要帳號、寄信與排程系統**。Quantum Country 要讀者建帳號，還要寄信；Lindsey 那套個人化排程要持續重跑模型的伺服器。Matuschak 的總索引另外列了一條使用者端的障礙：上手需要累積夠多的內容，否則複習會很無聊。

**證據本身還不夠**。做得最完整的作者自評因果只是初步；Duolingo 的大規模實驗沒有量學習；Anki 的研究沒有隨機分派。對寫文章的人來說，要付出不小的成本，換到的效果還說不準。這一點是我從上面各節的資料推的。

**適用的範圍可能很窄**。Matuschak 認為這個媒介特別適合成熟領域的線性入門讀物：讀者知道得還不夠多，願意照作者排好的路走；「I think it’s also important that the primer be covering a well-established field, so that its table of contents is broadly not up for much dispute or authorial idiosyncrasy.」這一則筆記全是作者的推論，沒有資料。在總索引筆記「提取練習與遷移」這一項旁邊，作者自註「I don’t think the MM performs very well here」。

## 來源說法不同的地方

以下幾組結果方向不同，或看起來衝突、其實量的東西不一樣。我把它們並列，不選邊。

**Quantum Country 的總結與正文**。長文總結說可以把有效的記憶提高一個數量級、可以建立概念理解；正文說那些倍數不是字面意思，也還不清楚讀者學到了什麼；Matuschak 後來的筆記把因果評為初步、推廣評為沒有證據。

**強制間隔是學習設計還是留存手法**。Bernhardt 主張讀者花的時間和一次讀完一樣（原文寫 wall-clock time，從上下文看指的是累計時數），卻記得更牢，但沒有附資料。Hacker News 上的反對者說每天鎖住再叫人回來就是手機遊戲的手法。Duolingo 的實驗裡，排程換了之後練習的隔天回訪反而下降，公司仍依軼事回饋上線。三者都沒有學習成效的資料。

**有作答的人表現好**。Davis 的實驗裡，碰過題目的人通過率 34%，對照組 8%；Davis 2016 年那篇裡，真的填了讀書計畫的人成績也較高。兩篇的作者都提醒這是自我選擇。Quantum Country 的 54 天也只算做完的人。三個來源的「做完的人很好」是同一種資料。

**當下考試與延後考試**。Lindsey 的資料裡，章末小考集中複習最高，寒假後的考試個人化間隔最高。

**Anki 對不同考試**。執照考試第一階段的三個正向結果都來自橫斷問卷；學校課程考試的 6 個研究裡有 3 個沒有測到差異，第 4 個整體也沒有差異。回顧作者在討論的第一句寫「modest but consistent improvements」，「一致」只說得上部分研究。

## 對照本站的做法

| 本站現在的做法 | 相關的證據 | 性質 |
|---|---|---|
| 每個主要小節結尾一題自我檢查，讀到那裡當場答 | 相當於 Quantum Country 的文內作答；文內作答比事後另給題目多幫到多少，沒有公開資料 | 本站的選擇；本站沒有之後的那幾次複習 |
| 文末放跨節的綜合題 | 和正文在同一次閱讀裡作答，沒有隔一段時間，這是我的判斷 | 本站的選擇 |
| 系列文章，後篇有時會用到前篇 | 後篇要不要刻意回頭考前篇，沒有研究直接測過；系列怎麼排，之後的篇會談 | 缺 |
| [英文口說練習頁](/english)有排程：自評「說得順」的句子至少 3 天後再出現，連續說得順就拉到 6、12、24 天，上限 30 天；「有點卡」隔天；「還說不出來」在同一輪的最後再練一次，下一輪才是 10 分鐘後 | 進度存在讀者自己的瀏覽器，不需要帳號；沒有寄信提醒，要讀者自己回來 | 本站的設計；沒有資料知道多少人回來 |
| 沒有讀者帳號；除了 RSS 之外沒有提醒讀者回來的機制；沒有分析工具 | 不知道讀者會不會回來、隔多久回來 | 缺 |

本站的課程導讀其實已經做了 Quantum Country 的第一層：題目嵌在正文裡，讀到就答。缺的是之後的那幾次。英文口說頁補上了排程，但它和 Quantum Country 一樣要讀者自己回來，而且少了寄信這一步。

## 可以做的事

下面每一條都是本站的判斷，依據寫在後面。

1. **目前不在文章頁加排程系統**。依據：做得最完整的作品，作者自評因果只有初步證據；推給 MOOC 學習者的版本被分派的人約八成沒碰、成績沒有測到差異；有效的課堂實驗靠的是上課時間、全體作答資料與一台伺服器。本站目前也沒有讀者帳號與寄信的機制，除了 RSS 之外沒有通知讀者的管道。做法：把力氣放在文內的題目本身（第 9、10 篇）。

2. **系列的後一篇，開頭放一兩題考前一篇的核心概念**。這是[第 16 篇](/posts/learning/2026-10-14-spaced-practice-in-real-courses)第 2 條建議的延續，題數也一樣。它是我能想到最便宜的「隔一段時間再答一次」：不用帳號，不用寄信；前提是讀者真的讀到下一篇，而第 16 篇也提醒過，不要把讀者會自己回來當成前提。依據很薄：Matuschak 的[筆記](https://notes.andymatuschak.org/zJaSxZHpWr5fq7vQtHUVuMp)設想把文章分小節連載、配合讀者的回想時機，這是設想，沒有資料；Lindsey 的「固定複習上一章」對集中複習只有小幅差距，原文沒有單獨檢定；Davis 推送前幾週的題目，沒有測到成績差異。所以這是低成本的嘗試，不是有證據的做法。做法：題目後面放回前篇的連結，答案照樣收在摺疊區塊裡。

3. **題目避免讀者看到某個字就能背出答案**。依據：Quantum Country「Who」題的觀察，作者的描述，沒有量化。做法：同一個概念如果在系列裡考兩次，第二次換一種問法，例如第一次問定義，第二次給一個情境問該用哪個方法。

4. **如果以後要評估英文口說頁的排程，量答得出來，不只量回來**。依據：Duolingo 的實驗只量回訪；Davis 與 Quantum Country 的「做完的人表現好」都可能是自我選擇。做法：比較同一張卡在排定時間回來時答不答得出來，並記住看到的只是回來的人。

5. **不要強制讀者照間隔讀**。依據：Execute Program 新使用者的抱怨（創辦人自報）、論壇上的反對、Matuschak 主張讓讀者控制。這些都不是成效資料，但強制間隔的效果目前也沒有資料。本站本來就沒有這麼做，這一條是提醒以後不要往這個方向加。

## 今晚可以做的三件事

挑一個自己寫過的系列，照下面改，大約一小時：

1. 在第二篇的開頭加一題考第一篇核心概念的題目，答案收進摺疊區塊，附回第一篇的連結。
2. 把文章裡的自我檢查讀一遍，找出只要看到題目裡某個詞就能背出答案的題，換一種問法。
3. 把第 1 件事加的回頭題，寫成選一個選項或填一兩個字就能答的形式，不要求讀者算出數字或寫一段話。依據是 Davis 2018 的資料：跳出的題目裡，選擇題約七成有人作答，要輸入數字的約四成；但兩種題型的題目不同、不是隨機分派，作答多也不代表學得多（見第 10 篇）。

## 這些證據的限制

- **沒有研究測過教學型網頁文章的讀者會不會回來**。本站沒有任何閱讀行為的資料。把 MOOC、語言 app、中學課堂的結果搬到文章，是我的推論。
- **最詳細的資料由做的人自己公布**。Quantum Country 的數字來自作者的長文與工作筆記，沒有同儕審查，工作筆記會被作者持續改寫；Duolingo 的論文作者是公司員工；Execute Program 只有創辦人的論壇留言。
- **Quantum Country 的數字多數沒有分母**。195 人、54 天、95 分鐘都只算做到某一步的人，沒有交代總共多少人讀過或建了帳號。長文的圖沒有進到我讀的版本，「從圖讀出」的數字只能依作者在正文的轉述。
- **Quantum Country 的延後實驗很小**：8 張卡、41 人，沒有寫分組方式，沒有檢定，用的是更早的排程。
- **文內作答比事後另給題庫多幫多少、讀者隔太久才複習會怎樣**，Quantum Country 的公開資料都沒有回答。
- **做隔一段時間的複習、有隨機分派又量了學習的只有兩個**：Davis 2018（沒有測到差異，檢定力低是我的判斷）與 Lindsey 2014（有效，但複習排在上課時間）。Davis 2016 的提取提示是當下寫重點，不是隔一段時間的複習；Duolingo 的兩個實驗沒有學習指標；Anki 的 11 個研究沒有一個隨機分派。
- **Lindsey 的兩個主要 t 值在刊出版就印得和 p 值對不上**，我沒有引；要引檢定，用的是補充材料裡的變異數分析，數字在附錄。百分比是相對還是百分點，原文沒有說。
- **時間點**。Execute Program 的做法是 2021 年 3 月的描述，現在是否還這樣不知道；Duolingo 的實驗是 2016 年以前。
- **Frappa 等人的回顧本身**沒有預先註冊，沒有統合分析，正文有幾處數字前後不一（例如橫斷研究寫成 5 個又寫成 6 個），摘要的「4–13 points」在正文與表裡找不到 13 分的出處。
- **我的推論與判斷**：文末綜合題不算間隔；把各來源的採用障礙歸納成六類；證據不足是沒普及的原因之一；Davis 2018 的檢定力很低；Lindsey 的百分比較像相對比例；可以做的事五條；今晚三件事。正文都當場標了。
- **不用的資料**：Matuschak 給贊助者的信標明不得分享或引用。Matuschak 有幾則分析 Quantum Country 資料的工作筆記（2019 年的非正式實驗、文內作答、太晚複習、對讀者的整體影響），作者網站上目前打不開（404），這裡不用；不用的只是那則談 2019 年實驗的筆記，長文裡對同一個實驗的描述仍然引用。Matuschak 有一則筆記的標題寫了 2019 上半年的續留比例，那則筆記我拿到的檔是空的，沒有引。
- **讀取上的缺口**：Davis 2018 的預先註冊文件沒有讀；Frappa 等人的出版者 PDF 版面沒有取得，表格讀自 PubMed Central 的結構化全文；Execute Program 那則留言所在的討論串其餘約 220 則沒有讀；Matuschak 筆記裡連到的其他筆記，多數只讀到標題。
- **沒有找到的**：教學文章讀者回訪的研究；記憶媒介的同儕審查實驗；把同一批題目放在文內與另附題庫直接隨機比較的研究；採用率的統計。

## 附錄：各研究的設計與數字

正文每項只留一兩個數字，其餘放在這裡。

**Matuschak 與 Nielsen（2019），〈How can we develop transformative tools for thought?〉**，自行發表的長文，CC BY 4.0。Quantum Country 第一篇文章內嵌 112 題；讀完約 4 小時。排程：文內 → 5 天 → 2 週 → 1 個月……，答錯降一級。第 6 次重複時，已做到這一步的使用者「most users」約 6,000 天（112 張加總），每題約 54 天；第 1 次複習後每張卡平均略多於 2 天。達到第 6 次約 95 分鐘的總複習時間，作者說額外時間不到 50%。發布六個月後 195 人在至少 80% 的卡片上有一個月的已驗證保留時間，沒有分母。延後實驗：8 張卡；延後組 25 人 91%（± 4%）→ 87%（± 5%），照常組 16 人 89%（± 5%）→ 96%（± 3%）；信賴區間假設二項分布、獨立同分布，作者說只是近似；照常組 100% 持平或進步，延後組 40% 變差、60% 持平或進步；排程是較早的 1 天、3 天、1 週、2 週。「開頭的題目要簡單」於 2019-12-09 撤回。作者引的 Duolingo 2,500 萬月活躍使用者、Quizlet 5,000 萬是外部數字，不是本文資料。

**Matuschak 公開工作筆記**，notes.andymatuschak.org，沒有日期與同儕審查，2026-10-13 的版本。證據自評：1 強、3 中等、2 初步、4 沒有。90 分鐘與 35% 到 50% 出自 2019 上半年的讀者；同一則說 2019 下半年的讀者（排程較積極）也許已把成本降了 25%。54 天只算第一次複習前在文內答了 80% 以上題目的讀者。2020 年第一季有「several hundred」位使用者達到一個月以上。

**Matuschak 與 Nielsen（2020），〈Timeful Texts〉**，2020 年 7 月，收入《The Future of Text》，CC BY-NC 4.0。全文沒有資料。作者在訪談讀者時注意到，定期複習不只建立細節的保留，還讓讀者持續接觸內容，改變了他們和內容的關係；沒有交代訪談人數與方法。Quantum Country 最後一章加了一種會照排定順序隨時間變化的題目。

**Davis、Kizilcec、Hauff、Houben（2018）**，LAK '18，頁 1–10。edX GeoscienceX，2017-05-23 到 07-26；註冊 2,324 人，至少進入一次的 1,047 人分成對照 524、實驗 523；預先註冊，但因樣本小與遵從率低改了分析，也沒有套用原訂的排除條件。題庫 132 題（112 題選擇、20 題數值）。實驗組 102 人至少互動一次。意向處理：證書 logOR = −0.215（p = 0.357）、非零成績 logOR = 0.143（p = 0.280）、連續成績 p = 0.442；工具變數估計 p = 0.371、0.267、0.374。遵從者對對照全體：通過率 34% 對 8%，作者說沒有因果解讀。兩組通過率 7% 與 8%，成績四分位都是 [0, 0, 2]。以題目為單位：選擇題 69% 作答、數值題 41%；略過的中位數 7 秒。通過者答對率（含略過）第 2 週 67% → 第 6 週 49%，答錯率 4% → 25%；未通過者略過率 47% → 61%。依題目延遲：通過者隔 1 週答對 65% → 隔 5 週 42%；未通過者略過率 50% → 72%。課後兩週 10 題測驗：對照 6.2、實驗 6.6，N = 20（回卷率 7.3% 與 8.8%，兩組寄送對象不同），p = 0.66。期刊擴充版（JLA 5(3)）是同一個實驗。

**Davis、Chen、van der Zee、Hauff、Houben（2016）**，EC-TEL 2016，LNCS 頁 57–71，讀的是作者稿。兩門台夫特理工大學的 MOOC，用 edX 的分組功能隨機分派。提取練習：Functional Programming，進入分組 9,836 人，三組（無介入、寫 3–5 句重點、讀現成摘要）；寫重點組 3,262 人中 66.4% 看過影片、22% 點過提示。只在第 1 週看影片超過平均的子樣本裡比，作者報告週測驗與期末成績沒有顯著差異，沒有統計量。讀書計畫：Industrial Biotechnology，實驗組 998 人中 14.7% 點過計畫模組；曝光本身沒有顯著差異；真的填了計畫的 146 人期末成績 46.42，對照組高投入者 36.44，是自我選擇下的比較。22% 與 14.7% 的分母是整組，原文的句子讀起來像是只算看過影片的人。

**Lindsey、Shroyer、Pashler、Mozer（2014）**，Psychological Science 25(3)。丹佛郊區一所中學，179 位八年級生、6 個班、同一位老師，第三學期西班牙文；409 個字詞併成 221 個知識元件。三種排程複習次數相同（每項約 8 次），複習之間的平均天數：集中 0.12、一般間隔 1.69、個人化 4.70。學期末考試：個人化對集中高 12.4%（d = 1.38），對一般間隔高 8.3%（d = 1.05）；28 天後：16.5%（d = 1.42）與 10.0%（d = 0.88）。寒假期間的遺忘率 18.1%、17.1%、15.7%，原文沒有定義也沒有檢定。補充材料的變異數分析，排程主效果：考試一 F(2, 328) = 52.3，考試二 F(2, 340) = 55.1，都是 p < .001。兩次都考的學生裡，只有 22.3% 在一般間隔的項目上得分高於個人化，13.5% 在集中的項目上高於個人化。章末小考：集中 89.4%、一般間隔 87.2%、個人化 88.1%（156 人）。效果集中在學期前段的章節。全學期 597,990 題作答。

**Settles 與 Meeder（2016）**，ACL 2016，頁 1848–1858。歷史資料：兩週、1,290 萬筆學生與單字的紀錄；預測答對率的平均絕對誤差，新模型 0.128，原本的 Leitner 規則 0.235，一律猜平均 0.175；排序品質（AUC）Leitner 0.542 最高，新模型 0.538，都只略高於隨機的 0.5。使用者實驗一（新模型對 Leitner，六週，將近 100 萬人）：任何活動 +0.3、新課 +0.3、練習 −7.3（只有最後一項 p < 0.001）。實驗二（簡化版對完整版，兩週，330 萬人）：+12.0、+1.7、+9.5，都 p < 0.001。表題寫「Change (%) in daily student retention」，沒有基準回訪率、各組人數與信賴區間。

**Bernhardt（2021）**，Hacker News 留言 26349754，2021-03-04。創辦人自報：第一天 5 課，之後每天先複習再開新課；指數拉長的複習間隔，依複習表現解鎖課程；完成一門課的中位數 8 到 18 天；讀完 16 課之後收費。底下 40 則回覆來自約 30 個帳號，沒有人自稱是這個產品的付費或長期使用者。

**Frappa、Chernov、Dillon、Alben（2026）**，Medical Science Educator 36(2)。七個資料庫，檢索到 2025-10-12，只收英文；4,600 筆篩到 11 個研究，2015 到 2025 年，美國 9、愛爾蘭 1、巴基斯坦 1，每個研究 25 到 206 人。品質分數（MERSQI，滿分 18）8 到 11.5，全部單一機構。Step 1：自報大量使用 241.1 對 235.5（p = 0.012）；每天用 238 對 233.5（中位數，p = 0.039）；看過的卡片數可預測分數。Step 2 CK：252.5 對 247.0（p = 0.440），控制 Step 1 後不是獨立預測因子。課程考試：Durrani 2024 準實驗 115 人，d = 0.8；Gilbert 2023 自願參加訓練的學生較高；Levy 2023、Sun 2021、Magro 2024（p = 0.43）沒有測到差異或關聯；Haughey 2025 整體沒有差異、生理學一科有。

**Kovacs（2016）**，L@S 2016，頁 31–40。Coursera Machine Learning 第四期的紀錄分析，影片內測驗緊接剛看完的內容；有一題測驗的 92 支影片，開始看的人 74% 作答。沒有隨機分派、沒有統計檢定、沒有學習成果。詳細數字見第 10 篇。

## 參考資料

每一條都從頭讀到尾並留有抽取紀錄；讀不到的部分寫在括號裡。

- [Matuschak & Nielsen (2019), How can we develop transformative tools for thought?](https://numinous.productions/ttft/)（作者網站的公開版；圖片與影片沒有讀到）。
- [Matuschak & Nielsen (2020), Timeful Texts](https://numinous.productions/timeful/)（作者網站的公開版）。
- Andy Matuschak 的公開工作筆記（2026-10-13 的版本）：[Mnemonic medium](https://notes.andymatuschak.org/Mnemonic_medium)、[Effects of the mnemonic medium on reader memory](https://notes.andymatuschak.org/zqetsQERteJhyPitmRoaeE)、[Mnemonic essays may offer detailed retention of their contents in exchange for 35-50% reading time overhead](https://notes.andymatuschak.org/z4biJ7i6da3exh3qmXXohjh)、[Quantum Country readers reliably develop detailed retention for embedded questions](https://notes.andymatuschak.org/zRxhtQqHvLpatPLB4BvzMRB)、[Lessons learned from applying the mnemonic medium to non-technical texts](https://notes.andymatuschak.org/zG29usta2L9LLjkVbnvCzcV)、[The mnemonic medium works well for linear primers in established fields](https://notes.andymatuschak.org/zP8MVDmomB7UrTddVY34E1B)、[The mnemonic medium should give readers control over the prompts they collect](https://notes.andymatuschak.org/z8kPkXQZ3wVR5DfJ79uhnuz)、[Regular spaced repetition memory practice is an onerous habit to adopt](https://notes.andymatuschak.org/z3DiwZKDuLxMV17mt2nWH7y)、[Mnemonic texts could be serialized in small sections over time, timed to reader recall](https://notes.andymatuschak.org/zJaSxZHpWr5fq7vQtHUVuMp)、[Substantive examples of the mnemonic medium](https://notes.andymatuschak.org/z7tvoovbepeoM99XZCSntef)、[Execute Program](https://notes.andymatuschak.org/zSsjk5UvNPGrYp8B6DEFCMS)（各則連到的其他筆記多數只讀到標題）。
- [Davis, Kizilcec, Hauff & Houben (2018), The Half-Life of MOOC Knowledge: A Randomized Trial Evaluating Knowledge Retention and Retrieval Practice in MOOCs](https://doi.org/10.1145/3170358.3170383)（[第一作者網站上的 ACM 排版版](https://dan7davis.github.io/papers/LAK18_Half_Life.pdf)；預先註冊文件沒有讀）。
- [Davis, Kizilcec, Hauff & Houben (2018), Scaling Effective Learning Strategies: Retrieval Practice and Long-Term Knowledge Retention in MOOCs](https://doi.org/10.18608/jla.2018.53.3)（同一實驗的期刊擴充版，刊出版，開放取用）。
- [Davis, Chen, van der Zee, Hauff & Houben (2016), Retrieval Practice and Study Planning in MOOCs: Exploring Classroom-Based Self-regulated Learning Strategies at Scale](https://doi.org/10.1007/978-3-319-45153-4_5)（[共同作者 Hauff 網站上的作者稿](https://chauff.github.io/documents/publications/ECTEL2016-davis.pdf)）。
- [Lindsey, Shroyer, Pashler & Mozer (2014), Improving Students' Long-Term Knowledge Retention Through Personalized Review](https://doi.org/10.1177/0956797613504302)（[通訊作者 Mozer 網站上的刊出版抽印本](https://home.cs.colorado.edu/~mozer/Research/Selected%20Publications/reprints/LindseyShroyerPashlerMozer2014Published.pdf)，含補充材料；補充材料的模型公式沒有逐式核對）。
- [Settles & Meeder (2016), A Trainable Spaced Repetition Model for Language Learning](https://doi.org/10.18653/v1/P16-1174)（[Duolingo 研究頁的刊出版](https://research.duolingo.com/papers/settles.acl16.pdf)）。
- [Bernhardt (2021), Hacker News 留言：Execute Program 的每日上限](https://news.ycombinator.com/item?id=26349754)（連同底下的回覆共 44 則；同一討論串的其他留言沒有讀）。
- [Frappa, Chernov, Dillon & Alben (2026), Anki Use and Academic Performance in Medical Education: A Systematic Review of Evidence and Learning Theory](https://doi.org/10.1007/s40670-026-02643-5)（刊出版，開放取用；出版者 PDF 版面沒有取得，表格讀自 PubMed Central 全文）。
- [Kovacs (2016), Effects of In-Video Quizzes on MOOC Lecture Viewing](https://doi.org/10.1145/2876034.2876041)（L@S 2016 刊出版，ACM 版面）。
- 本站文章：[教學文章裡的問題與用語怎麼寫](/posts/learning/2026-10-13-teaching-text-questions-feedback)、[讀者會不會做文章裡的題目](/posts/learning/2026-10-14-do-readers-answer-embedded-questions)、[間隔複習在真實課程裡還剩多少](/posts/learning/2026-10-14-spaced-practice-in-real-courses)、[英文口說練習](/english)。
