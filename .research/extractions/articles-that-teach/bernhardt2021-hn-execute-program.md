# 抽取紀錄：Gary Bernhardt 2021，Hacker News 留言 26349754（Execute Program 的每日上限）與底下的回覆串

- **書目**：Hacker News 帳號 `gary_bernhardt`，留言編號 26349754，2021-03-04 23:03 UTC。網址 `https://news.ycombinator.com/item?id=26349754`。這是一則回覆，所在的討論串是「"User engagement" is code for "addiction"」（HN 26346688，原文連到 Medium 的同名文章，整串 266 則留言）。留言者在文中自稱「I own https://www.executeprogram.com」（L5）。帳號名與留言內容相符；我沒有另外查證帳號是否為本人，以下一律當成「創辦人自報」。
- **原文檔**：`.research/raw/learning-content/q4-time/bernhardt-hn-execute-program.md`，169 行（`wc -l`；最後一行沒有換行，實際 170 行）、20,489 位元組。這份檔把整個回覆樹攤平成一段接一段，**沒有留言者名稱、時間、層級**，引言行（`>` 開頭）與回覆也混在一起。
- **這次補抓的檔**：`.research/raw/learning-content/q4-time/bernhardt-hn-execute-program-api.json`，HN 的公開 API（`https://hn.algolia.com/api/v1/items/26349754`），有每一則的作者、時間與父子關係。用它核對過：這則留言加上底下的回覆共 **44 則**，44 則的開頭文字都在原文檔裡，原文檔是完整的。下面每一則的作者與時間都取自這份 JSON。
- **讀取日期**：2026-10-14
- **版本**：網路論壇留言原文。不是研究，沒有資料、沒有方法。
- **供哪幾篇用**：order 17（第 8 列）。

## 研究設計

不適用。這是一位產品擁有者在論壇上講自己產品的設計與他收到的使用者來信。沒有樣本數、沒有量測、沒有對照。所有數字都是留言者自己說的，沒有附出處。

## 結果（逐項）

這裡的「結果」是留言裡可能被引用的陳述。Bernhardt 本人在這一串裡共 4 則：頂層留言（L4–23）、L27、L126–127、L147。

### 創辦人自己說的（頂層留言，L4–23）

| # | 陳述 | 行號 | 原文一句 |
|---|---|---|---|
| 1 | 產品是什麼 | L5 | 「interactive in-browser courses on various software development technologies. Currently they all cover languages, more or less: TypeScript, SQL, various JS topics, regexes.」 |
| 2 | 收費方式（自己揭露） | L5 | 「(Disclosure: it costs money after you finish your 16th lesson.)」 |
| 3 | 他對競爭者的說法（自己加了保留） | L7 | 「Almost all (maybe literally all) of our competitors are amenable to binging. It's true of books, video learning platforms, and most/all other interactive learning platforms.」 |
| 4 | **每日上限的做法** | L9 | 「When you start a course, you get 5 lessons on the first day, then it stops you and tells you to come back tomorrow. On the next day, you get some brief reviews of yesterday's lessons, then a few new lessons, then it stops you again until the next day. That cadence repeats until you finish the course. You can't binge/cram even if you want to.」 |
| 5 | 排程機制 | L11 | 「it's a spaced repetition system with exponential review intervals, similar to those used for language learning in e.g. WaniKani and Anki. But it also has a lot of fine-grained knowledge of its own course structure, so it can use reviews to intelligently unlock different lessons depending on how the user performed on their reviews.」 |
| 6 | **新使用者的抱怨** | L13 | 「Occasionally, we get support email from new users who don't like this. They want to cram a whole course in a day.」 |
| 7 | 他對抱怨的回應（主張，沒有附證據） | L13 | 「But cramming is a very time-inefficient way to learn, so this is self-defeating!」 |
| 8 | 抱怨有減少（沒有數字） | L13 | 「Since launch, we've had good success adjusting the app's behavior and internal explanations to reduce these complaints.」 |
| 9 | 長期使用者來信肯定，理由一 | L17 | 「Users like that an enforced break before the reviews provides tangible evidence that "yes, I genuinely understood yesterday's lessons". If we allowed cramming, that reassurance wouldn't exist; it's too easy to succeed at a review when you just finished the lesson 30 seconds ago.」 |
| 10 | 長期使用者來信肯定，理由二 | L19 | 「Users like that the usage limits remove a source of anxiety and worry. … There's no temptation to think "I really should've done 10 lessons today instead of 5; I'm so lazy".」 |
| 11 | 完成一門課要幾天（唯一的數字） | L21 | 「(Median course start-to-finish time is 8-18 days depending on the course.)」 |
| 12 | 不會讓人多付錢的說法 | L21 | 「It's still possible for a very dedicated user to do all of our courses in parallel within their first monthly billing cycle. … So this scheme doesn't make users pay us more than they would otherwise.」 |
| 13 | 「同樣時間、記得更牢」的主張（沒有附資料） | L21 | 「And they're spending the same amount of wall-clock time that they'd spend if they crammed all of the lessons in one day. That makes it pure win: they memorize the topics more deeply, they worry less, and they get those benefits for no extra time expenditure.」 |
| 14 | 他承認的例外 | L21 | 「The only exception I can think of would be people who think "I must get exposure to all TypeScript syntax and semantics before tomorrow morning, even if that significantly reduces my ability to remember what I learned."」 |
| 15 | 他自己說有偏頗 | L23 | 「Obviously I'm very biased here, and the goals that we're optimizing for don't even exist in most other product spaces.」 |

### 創辦人在回覆裡補的話

| # | 陳述 | 行號 | 原文一句 |
|---|---|---|---|
| 16 | 回應「這也是成癮設計」：差別是產品會叫你停 | L27（2021-03-04 23:54） | 「The critical difference is that both WaniKani and Execute Program quickly tell you "go home, you're done", so it's difficult to dump hours of low-quality time into them.」 |
| 17 | **「不能一次看完」這件事很難向人說清楚** | L126（2021-03-04 23:59） | 「We've struggled with communicating the non-binge aspect, and usually approach it from the other side: by talking about reviews, spaced repetition, remembering, etc.」 |
| 18 | 收費常被抱怨 | L127 | 「A lot of people will complain when someone dares to charge money for learning resources … I think that's worn me down a fair bit!」 |
| 19 | 答應改首頁與加新課通知 | L147（2021-03-05 00:57） | 「An upcoming landing rework will get the first two」 |

### 其他人的回覆（使用者反應）

共 40 則，來自 30 個左右的帳號。與「強制間隔」直接有關的只有下面幾則，其餘在談成癮設計、遊戲、行銷。**沒有任何一則自稱是 Execute Program 的付費或長期使用者並描述使用經驗。**

| # | 反應 | 留言者、時間 | 行號 | 原文一句 |
|---|---|---|---|---|
| 20 | **不想被強制**（反對） | donmcronald，2021-03-05 04:30 | L137–138 | 「my favorite thing was being able to blast through the simple concepts that I already understood and to slow down on the new stuff. I think a recommended pace that's easy to achieve would make a nice goal, but I would balk at the idea of it being enforced if I were paying money for it.」 |
| 21 | **質疑替使用者決定怎麼學**（反對） | jcelerier，2021-03-05 09:47 | L156–157 | 「who are you to judge how I learn ?」 |
| 22 | 對某些人集中學可能是唯一可行的方式 | TeMPOraL，2021-03-05 10:00 | L162–163 | 「for people with ADHD-PI, cramming may in fact be the only way in which they can learn the stuff they're not currently being obsessive about. That said, you can't optimize for everyone simultaneously.」 |
| 23 | 替 Bernhardt 辯護，引 Putnam 等 2016 | Zebrakopf，2021-03-05 10:22 | L159–160 | 「one thing we are rather certain of is that cramming is usually the worst way to retain information」 |
| 24 | **「每天鎖住、明天再來」與手機遊戲的留存手法相同**（最長的一條支線） | pixelbro，2021-03-05 02:44 | L45–48 | 「to me it looks exactly like what mobile games have been doing as a mechanism for maximizing engagement. … So you lock them out with a timer, forcing them to come back later. Then you reward them for coming back every day.」 |
| 25 | 訂閱制下，讓人每天回來本身就是商業利益 | charcircuit，2021-03-04 23:31；asutekku，2021-03-05 10:48 | L25、L29 | 「Optimizing your product so users come every day (and hence every month paying for a subscription) you care that users engage every day more than the amount that they engage every day.」 |
| 26 | 差別在於遊戲賣的是「付錢跳過等待」 | oarsinsync、stoolpigeon，2021-03-05 | L86、L88 | 「They mobile games don't want you to wait and come back tomorrow. They want you to pay to remove the blocks and just keep playing」 |
| 27 | 同行的說法：間隔重複系統同時是最佳學習法與習慣養成手法 | wahnfrieden（自稱做日文學習 app），2021-03-05 05:46 | L96 | 「the same kind of SRS system I was building is both optimal for learning and habit-forming in the same way as game dark patterns.」 |
| 28 | 首頁的間隔示意圖看不懂 | bostonvaulter2，2021-03-05 00:29 | L140 | 「The graphic for "Review Exponentially" [1] was a little difficult to grok initially. My first thought was that time was flowing downwards.」 |
| 29 | 行銷建議：把「不能狂看」當賣點 | pedalpete，2021-03-04 23:33 | L118 | 「I like your thinking of non-binge learning, and think you could really use that as a differentiator, in your marketing.」 |
| 30 | 單純表示有興趣或讚賞 | feralimal、torgian、teraku、JetAlone | L151、L168、L165、L154 | 「Great approach, Kudos!」 |

## 作者自己列的限制

- 「Obviously I'm very biased here」（L23）。
- 對競爭者的概括自己加了「maybe literally all」「most/all」（L7）。
- 承認有一種人不適用：隔天早上之前就要看過全部內容的人（L21）。
- 承認「不能一次看完」這點很難溝通（L126）。
- 開頭自己把這則留言定位成「an anecdote」（L4）。

## 與摘要說法不一致的地方

這則來源沒有摘要。改對留言內部前後是否一致，逐項對過，有兩處要留意：

1. L21 先說使用者「spending the same amount of wall-clock time that they'd spend if they crammed all of the lessons in one day」，同一段又說完成一門課的中位數是 8–18 天。他指的顯然是累計學習時數相同，不是日曆時間相同；「wall-clock time」這個詞用得不精確，引用時不要照字面寫成「花的時間一樣」而不說明。
2. L13 說抱怨「Occasionally」出現、而且已經減少，L15 卻用「However, we still get emails from long-term users who appreciate」承接。兩邊都只有「偶爾」「有來信」這種說法，沒有次數或比例，無法比較哪一種多。

## 與清單「要撐的結論」不合的地方

清單寫的是「強制間隔的商業做法與使用者反應（創辦人自報）」。

- 「商業做法」撐得住：第一天 5 課、之後每天先複習再開幾課新課、做完就擋住、複習間隔呈指數拉長、照複習表現解鎖課程，都有原文（L9、L11）。
- 「使用者反應（創辦人自報）」撐得住，但只能寫到這個程度：**新使用者偶爾來信抱怨想一天讀完；長期使用者來信說喜歡，理由是隔天還答得出來才算真懂，以及不用再煩惱今天讀得夠不夠**。全部是創辦人轉述，沒有次數、比例、留存率或完課率。
- **原文沒有、不能寫的**：沒有任何學習成效資料。「they memorize the topics more deeply」「cramming is a very time-inefficient way to learn」是他的主張，不是 Execute Program 的資料。唯一的數字是完課時間中位數 8–18 天（L21），沒有說樣本與期間。
- **底下回覆不能當成「使用者反應」**：40 則回覆是 HN 的路人，沒有人自稱是這個產品的使用者。可以引的是「論壇上有人當場表示不願被強制」（donmcronald，L137–138；jcelerier，L156–157），以及「有人指出每天鎖住再叫你回來，手法與手機遊戲的留存設計相同」（pixelbro，L45–48）。後面這條在清單的結論裡沒有，是這一串裡篇幅最大的反對意見，文章若引這則留言，應該一併交代。
- 時間點：這是 2021 年 3 月的說法，產品現在是否還這樣運作，這份來源答不了。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–23 | 檔頭、Bernhardt 頂層留言全文 |
| 2 | L25–43 | charcircuit 支線（成癮與訂閱制），含 Bernhardt 的回覆 L27 |
| 3 | L45–115 | pixelbro 支線（手機遊戲的留存手法），含各層回覆 |
| 4 | L117–135 | pedalpete 支線（行銷與收費），含 Bernhardt 的回覆 L126–127 |
| 5 | L137–149 | donmcronald 的反對、bostonvaulter2 對首頁的意見，含 Bernhardt 的回覆 L147 |
| 6 | L151–170 | feralimal、JetAlone、jcelerier 支線（含 Zebrakopf、TeMPOraL）、teraku、torgian、cesarvarela |
| 7 | API JSON | 逐則核對作者、時間、層級；44 則全部在原文檔裡找得到 |

沒有表、圖或附錄。原文檔的段落順序與 API 的樹狀順序不同（原文檔看起來是照頁面顯示的排序攤平），所以上表各支線的行號範圍是照原文檔的順序寫的。沒有讀這則留言以外、同一討論串的其餘約 220 則留言，也沒有讀被討論的那篇 Medium 文章。
