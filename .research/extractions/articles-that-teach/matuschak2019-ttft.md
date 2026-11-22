# 抽取紀錄：Matuschak & Nielsen 2019，How can we develop transformative tools for thought?

- **書目**：Andy Matuschak、Michael Nielsen，〈How can we develop transformative tools for thought?〉，自行發表的網頁長文，https://numinous.productions/ttft ，San Francisco，2019 年 10 月（L11「October 2019」）。作者姓名與引用格式對過文末 Citation 節（L2698–2703），該節註明「Authors are listed alphabetically」。沒有 DOI，沒有同儕審查。授權 CC BY 4.0（L2707–2711）。
- **原文檔**：`.research/raw/learning-content/q4-time/matuschak-nielsen2019-ttft.md`，共 2,711 行、131,928 位元組（`wc -c`；全文幾乎都是 ASCII，字元數略少於此）。
- **讀取日期**：2026-10-14
- **版本**：作者網站的公開版轉成的 Markdown。檔內含一則 2019-12-09 加上的撤回註記（L689–692），所以抓的是 2019 年 12 月之後的版本。**所有圖片與影片都沒有進檔**（L155「Here's an excerpt:」、L202、L206、L222、L258 的圖、L1522 起的影片、L1598、L1602、L1610、L1629 的示意圖後面都直接接下一段），圖上的數值無法核對，下面凡是「從圖讀出」的數字都只有作者在正文裡轉述的那一句。
- **供哪幾篇使用**：order 17（把複習做進文章）。
- **文體**：這不是研究報告，是一篇立場鮮明的長文，沒有方法節、沒有結果表。裡面的數字都是作者對自己產品後台資料的敘述。

## 研究設計

全文分兩部。Part I（L126–1503）談記憶系統與 Quantum Country；Part II（L1505–2559）談別的構想（mnemonic video、executable books）與為什麼這類工具沒人做；最後是總結（L2561–2683）。

和「資料」有關的只有 Part I 的一節〈The early impact of the prototype mnemonic medium〉（L252–484），裡面有三樣東西：

1. **後台使用資料的描述**（L254–296、L376–386）：對象是 Quantum Country 第一篇文章〈Quantum Computing for the Very Curious〉的讀者。文章內嵌 112 題（L197–199）。沒有對照組，沒有說總讀者數、註冊數或流失數。量的是作者自訂的「demonstrated retention」。
2. **使用者回饋三則**（L335–374）：一則推特回覆、一位有量子資訊博士學位的使用者、一位新手的訪談。
3. **一個作者自稱非正式的實驗**（L400–450）：延後一小組題目的複習兩週，與照常複習的人比。細節見下。

Quantum Country 的機制（L192–233）：
- 站上當時有三篇 mnemonic essay（L193–195）。
- 讀者要建帳號，邊讀邊被問嵌在文中的題目（L199–202）；題目與答案成對的介面元件叫 card（L208–209）。
- 讀完幾天後收到電子郵件，請讀者登入做複習（L212–218）。
- 排程（L224–233）：間隔從「in-text」開始，答對升到 5 天，再到 2 週、1 個月，依此類推；「After just five successful reviews the interval is at four months」；答錯就降一級（例如 2 週降回 5 天）。
- 旁註（L284–290）：首次複習隔 5 天是「最近」才改的，Quantum Country 大部分時間用的是比較保守的排程。

## 結果（逐項）

### A. 後台資料的描述

| # | 結果 | 數字與條件 | 位置 | 原文一句 |
|---|---|---|---|---|
| A1 | 「demonstrated retention」的定義 | 一張卡片某次答對的複習，與它前一次複習之間的最長間隔 | L260–263 | 「By a card's “demonstrated retention” we mean the maximum time between a successful review of that card, and the prior review of that card.」 |
| A2 | 第 6 次重複時的 demonstrated retention | 「most users」約 6,000 天（112 張卡加總），作者換算成每題約 54 天；只看**已經做到第 6 次重複**的使用者，一個點一個人；數字是從圖上讀的，沒有給人數、平均或中位數的算法 | L264–273 | 「after 6 repetitions, we see from the graph that most users are up around 6,000 days of demonstrated retention. That means an average of about 6,000 / 112 ~ 54 days per question in the essay.」 |
| A3 | 作者對 A2 的轉述 | 「nearly two months of demonstrated retention across 112 detailed questions」 | L276–278 | 同左 |
| A4 | 第 1 次複習後 | 每張卡平均「just over 2 days」；旁註解釋這是因為早期排程比較保守 | L281–290 | 「After the first review, users typically have an average of just over 2 days of demonstrated retention, per card」 |
| A5 | 達到 A2 花的複習時間 | 「typically」約 95 分鐘的總複習時間 | L290–293 | 「But by the sixth review that rises to an average of 54 days of demonstrated retention. That typically takes about 95 minutes of total review time to achieve.」 |
| A6 | 文章閱讀時間與額外負擔 | 文章讀完「about 4 or so hours」；作者由此說「a less than 50% overhead」 | L293–296 | 「Given that the essay takes about 4 or so hours to read, this suggests that a less than 50% overhead in time commitment can provide many months or years of retention for almost all the important details in the essay.」 |
| A7 | 195 人 | 原型發布六個月後，195 位使用者在這篇文章至少 80% 的卡片上有滿一個月的 demonstrated retention。**沒有分母**（多少人讀過、多少人註冊都沒寫）；旁註說沒有試著擴大規模 | L376–383 | 「Six months after release of the prototype, 195 users had demonstrated one full month of retention on at least 80% of cards in the essay, demonstrating an extraordinary level of commitment to the process」 |
| A8 | 作者不知道這些人學到什麼 | — | L383–386 | 「We don't yet have a good model of exactly what those people are learning, but it seems plausible they are taking away considerably more than from a conventional essay, or perhaps even from a conventional class.」 |
| A9 | 「10x」的說法作者自己說不是字面意思 | — | L306–310 | 「you may get 10x as much out of it. Of course, we don't quite mean those numbers literally.」 |

注意 A2、A5、A6 這條推論的落差（這是我對原文的觀察，不是作者的話）：54 天是「已做到第 6 次重複者」每題的 demonstrated retention，它量的是排程排出過多長的間隔而且那次答對，不是另外做的保留測驗；「many months or years of retention」（L295–296）是作者的外推，文中沒有對應的資料。

### B. 延後兩週的非正式實驗（L400–450）

- **做法**（L400–409）：挑 8 張卡。一部分使用者初讀時答過這 8 張，之後至少兩週不能複習它們；其他使用者照常複習。沒有寫是不是隨機分派，原文只說「some users」「Other users」。作者稱之為「informal experiment」（L400、L435、L448）。
- **當時的排程**（L430–433 旁註）：這是在較早版本的 Quantum Country 做的，間隔是 1 天、3 天、1 週、2 週，不是上面寫的 5 天起跳。
- **人數**（L423–425 旁註）：照常複習 16 人，延後複習 25 人。

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| B1 | 延後組的正確率 | 初讀 91% → 兩週後 87%（n = 25；95% CI 91 ± 4%、87 ± 5%） | L411–413、L425–427 | 「for those users whose reviews were delayed, accuracy dropped from 91% (upon the initial read) to 87% (after two weeks).」 |
| B2 | 照常組的正確率 | 89% → 96%（n = 16；95% CI 89 ± 5%、96 ± 3%） | L419–420、L425–427 | 「For users who were asked to review the cards as normal, accuracy improved from 89% to 96%.」 |
| B3 | 作者的一句話摘要 | 沒複習掉 4%、有複習升 7%。原文寫「%」，實際是百分點 | L420–423 | 「when users didn't review the cards, accuracy dropped by 4%; when they did review the cards, accuracy increased by 7%」 |
| B4 | 信賴區間的假設 | 把每個變項當成二項分布、獨立同分布；作者自己說這只是近似 | L425–430 | 「assuming each variable is binomial, independent and identically distributed. This latter assumption is approximate, since we'd expect some user- and question-dependent effects.」 |
| B5 | 逐人看 | 照常組 100% 持平或進步；延後組 40% 變差、60% 持平或進步 | L435–442 | 「every single user (100%) who reviewed cards on the regular schedule saw their performance either stay the same or improve. By contrast, 40% of the users whose reviews were delayed saw their performance get worse, while 60% saw it stay the same or improve.」 |
| B6 | 作者解釋掉得少的原因 | 延後組仍在複習其他卡，內容有重疊，幾乎一定拉高了最後表現 | L413–419 | 「users continued to review other cards, which almost certainly boosted their final performance, since those other cards had some overlap in content with the delayed cards.」 |

原文沒有做任何顯著性檢定。延後組前後兩個區間（91 ± 4、87 ± 5）互相重疊，這一點作者沒有提，是我對照數字看到的。

### C. 使用者回饋（軼事）

- C1（L343–351）：一位讀完第一篇的使用者在推特上說能看懂量子遙傳的證明。
- C2（L356–361）：一位有量子資訊博士學位、讀之前就懂全部內容的使用者說複習卡片「significantly improved my understanding」。
- C3（L363–374）：一位新手說原本預期聽技術演講十分鐘就會跟不上，結果跟了 40 到 45 分鐘。
- C4（L1161–1167）：一位使用者說讀起來意外放鬆，因為「no longer had to worry」會不會記得。
- C5（L2147–2150）：作者訪談過「apparently unaware of the incredible level of recall they have」的使用者。

### D. 作者對這個做法提出的設計主張（沒有資料支持，是作者的經驗與推論）

- D1 卡片要原子化（L663–684）：例子是 `ln -s` 拆成兩張卡，來源是其中一位作者個人的 Anki 經驗。
- D2 **「開頭的題目要出得很簡單」這一條已被作者撤回**（L686–707）。L689–692：「Note added December 9, 2019: This claim appears to be based on an error in our data analysis, and is now retracted. We've left the text in for historic reasons, but we no longer believe the claim.」被撤回的內容是：使用者在開頭幾題極簡單的題目上答得比後面較難的題目差，作者原先猜這是喚醒注意力。L735–736 仍把它列為三原則之一（未同步修改）。
- D3 避免孤兒卡（L709–718）。
- D4 「記憶系統等於間隔重複」是錯的想法（L740–743）：「it's common for people to have the simplistic model “good memory system = spaced repetition”. That's false, and an actively unhelpful way of thinking.」
- D5 作者先前主張使用者要自己做卡，Quantum Country 違反了這一條（L764–787）：「preliminary user feedback suggests it has worked out adequately」，作者給的解釋是「A possible explanation」，並說以後要再深入。
- D6 敘事嵌入是能處理抽象概念知識的原因（L541–553、L2592–2597）：這是主張，文中沒有比較「嵌在文章裡」與「另附題庫」的資料。
- D7 由專家寫卡比較能擴散（L571–576）。

### E. 作者引的外部數字（都不是本文的資料）

- Duolingo 自稱 2,500 萬月活躍使用者（L513–515）；Quizlet 5,000 萬（L527–530）。作者對 Duolingo 的成效說「Reports are mixed」（L515），並說公司「of course, touts research showing that it's incredibly successful」（L520–522）。
- Smith、Glenberg、Bjork 1978：在兩個不同地點各讀一次，比同一地點讀兩次，之後的回想好 40%（L923–932）。作者緊接著說這類結果「It's not necessarily clear how robust the results are, or how reproducible」（L939–943）。
- Chase & Simon 1973：西洋棋大師認得 25,000 到 100,000 個棋型（L1237–1241）。
- Sanderson（3Blue1Brown）私下告訴作者，他不認為超過一小部分觀眾從影片帶走多少細部的數學理解（L1566–1571）；作者由此推測高情感影片通常不太改變細部理解（L1571–1575）。這是轉述的談話，不是資料。
- MOOC 影片中穿插小測驗的做法，作者形容整體情感經驗「disjointed, almost repellent」（L1593–1607）。純屬作者評語。

### F. Part II 與教學文章寫法有關的主張（無資料）

- F1 mnemonic video 的構想（L1577–1656）：作者說「we plan to develop」，是計畫不是成品；題目的頻率與密度要比文章低（L1631–1636）。
- F2 好的思考工具多半是做嚴肅原創工作的副產品（L2373–2387）；對「教育用玩具」式工具的批評（L2347–2358）。
- F3 倒過來的寫作結構（L2468–2559）：技術書通常由下而上從細節堆起；作者認為只靠類比的科普寫法「reasoning won't scale out」（L2503–2515），並設想可執行的書能從讀者在意的現象開場（L2517–2549）。最後說「To our knowledge this kind of project has never been seriously pursued」（L2558–2559）。

## 作者自己列的限制

- L325–326：「These are preliminary results, and need more investigation.」接著舉例：如果一開始就把間隔設成 2 個月而使用者也記得住，圖一開始就會很高，看不到指數成長（L326–331）。意思是圖上的成長有一部分是排程本身造成的。
- L388–391：「this kind of feedback and these kinds of results should be taken with a grain of salt. The mnemonic medium is in its early days, has many deficiencies, and needs improvement in many ways」。
- L394–395：作者最強的一句結論只有「At a minimum, it seems likely the mnemonic medium is genuinely helping people remember.」
- L444–450：實驗結果是「small-but-promising」，只做兩週，卡片重疊可能削弱效果，「suggests more comprehensive studies」。
- L468–484：作者明說前面是熱情的一面，之後要退後一步懷疑：「is this medium really working? What effect is it actually having on people? … are there blockers that make this an irredeemably bad or at best mediocre idea?」
- L795–806：只認題目表面特徵的失敗模式。文中唯一一題「Who…?」題，很多使用者學會看到「Who」就背出答案；「This is a common failure mode in memory systems, and it's deadly to understanding.」用多種等價題型的對策是「plan to trial soon」，還沒做。
- L1289–1309：記憶系統不幫人決定該記什麼；「Even some users of Quantum Country seem to be going through the motions out of some misplaced sense of duty.」
- L1311–1336：在系統裡答得出不等於需要時想得起來；「memory is not an end-goal in itself」；「We don't yet understand very well how to ensure they're enablers, rather than crutches.」
- L1260–1263：能加速累積專家的 chunk 這件事「seems plausible, though needs further study」。
- L1491–1497：「we've got a long way to go with Quantum Country. It's not yet generating nearly deep enough ideas about memory and cognition」。
- L2671–2674：「Although it's very early days, we believe the mnemonic medium shows much promise. It needs to be developed much further … and likely requires additional powerful ideas.」
- L1214–1224：很多人說對間隔重複系統「repulsed」；作者的回應是不喜歡就不要用，「Using memory systems is not a moral imperative!」

## 與摘要說法不一致的地方

這篇沒有摘要。拿開頭的自我介紹（L38–50）與總結（L2561–2683）對正文：

- 開頭說 Part I 是「detailing both encouraging progress as well as many challenges and opportunities」（L44–46），正文確實兩者都有，一致。
- 總結寫「it is possible to increase effective human memory by an order of magnitude, even beyond what existing memory systems do」（L2574–2578），語氣是肯定句。正文沒有任何資料支持「一個數量級」，前面相對應的地方是問句（L188–190「is it possible to 2x what people remember? 10x?」）與「we don't quite mean those numbers literally」（L308–309）。總結比正文說得滿。
- 總結寫「Memory systems can be used to build genuine conceptual understanding, not just learn facts」（L2592–2593）。正文的依據是使用者回饋三則（C1–C3）與作者的主張，而正文同一節自己說「We don't yet have a good model of exactly what those people are learning」（L383–384）。總結比正文說得滿。
- L735–736 仍把「making early questions trivial」列為三個原則之一，但 L689–692 已撤回。檔內前後不一致。

## 與清單「要撐的結論」不合的地方

清單寫：「Quantum Country 的設計、54 天與 95 分鐘、195 人、延後兩週的非正式實驗、作者自己的保留語氣」。五項在原文都找得到，但引用時要補上條件，否則會說過頭：

1. **54 天**不是保留測驗的結果，是「demonstrated retention」（A1），而且只算已經做到第 6 次重複的人、是「most users」從圖上讀出的約數（A2）。不能寫成「讀者平均記得 54 天」，也不能寫成全體讀者。
2. **95 分鐘**是達到上面那個狀態「typically」的總複習時間，對照的是約 4 小時的閱讀時間（A5、A6）；「不到 50% 的額外時間」是作者算的。
3. **195 人**沒有分母（A7），不能換算成比例或完成率。門檻是「至少 80% 的卡片滿一個月」，時間點是發布後六個月。
4. **延後兩週的實驗**：16 人對 25 人、8 張卡、沒寫隨機分派、沒有檢定、用的是更早的排程（1 天、3 天、1 週、2 週）。差距是百分點（−4 對 +7）。延後組自己的前後差在作者給的信賴區間內重疊。只能寫成作者口中的「非正式實驗」。
5. **保留語氣**撐得住，而且比清單寫的更多：有一條設計主張已正式撤回（D2），這一點掃描階段沒有記到，文章若提「開頭題目要簡單」這個做法就必須寫明已撤回。
6. 清單沒列但原文有、文章可能想引的：「嵌在文章裡比另附題庫好」在這篇只是主張（D6），沒有資料；資料在 Matuschak 的筆記 `am-in-essay-prompts-boost.md`（抽取紀錄見 `matuschak-nd-working-notes.md` 的 N4）。
7. 54 天那組資料的選樣，TTFT 沒有交代，作者的筆記有：只算文內答了 80% 以上題目的讀者、用的是 2019 上半年較保守的排程，而且作者自己問這是不是存活者或選擇效應（`matuschak-nd-working-notes.md` 的 N7）。筆記裡複習時間寫 90 分鐘，這篇寫約 95 分鐘，兩處不一致。

## 讀取紀錄

用 Read 依序讀完，四段首尾相接：L1–699、L700–1399、L1400–2099、L2100–2711（檔尾）。沒有用關鍵字跳讀。

- 沒有表格。數字都在正文與旁註裡；旁註在轉檔時被併進正文句子中間（例如 L284–290、L423–433），讀的時候逐句拆開確認過。
- 圖沒有進檔，A2 的 6,000 天無法對圖。
- 文末參考文獻以旁註形式散在各處，都看過。
- 沒有對線上版逐字比對；檔尾到 License 節為止，章節順序連貫，沒有發現缺節。
