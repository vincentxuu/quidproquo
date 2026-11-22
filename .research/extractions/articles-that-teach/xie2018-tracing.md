# 抽取紀錄：Xie、Nelson、Ko 2018，An Explicit Strategy to Scaffold Novice Program Tracing（SIGCSE '18）

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3159450.3159527（ACM 現行提供的檔，2026-10-14 核對）；同一個檔也在共同作者 Amy Ko 的教職頁 https://faculty.washington.edu/ajko/papers/Xie2018TracingStrategies.pdf 。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。兩處重新下載的 PDF 都與手上的 `xie2018-tracing.pdf` 位元組完全相同（1,694,482 位元組）。也就是說 ACM 現在提供的就是頁尾印「Most up-to-date version: 06/01/2021」的這一版，原先「與 ACM 刊出版有無差異不確定」的疑慮不成立。

- **書目**（對 PDF 首頁核過）：Benjamin Xie、Greg L. Nelson、Amy J. Ko (2018). An Explicit Strategy to Scaffold Novice Program Tracing. In *Proceedings of the 49th ACM Technical Symposium on Computing Science Education (SIGCSE '18)*, February 21–24, 2018, Baltimore, MD, USA, pp. 344–349（6 頁）。DOI 10.1145/3159450.3159527。三位作者都在 University of Washington（Xie 與 Ko 在 The Information School，Nelson 在 The Allen School）。
- **版本**：ACM 會議論文集的排版（有頁碼 344–349 與 ACM 版權欄），首頁頁尾另印一行「Most up-to-date version: 06/01/2021」。看起來是作者自己放出來、2021 年更新過的稿子；它與 ACM Digital Library 上的刊出版有沒有內容差異，我沒有比對，**不確定**。引用頁碼沒問題，逐字引文若要求嚴格建議再對 ACM 版。
- **原文檔**：`.research/raw/learning-content/q2-interactive/xie2018-tracing.pdf`（6 頁）、`xie2018-tracing.txt`（不帶 `-layout` 的 `pdftotext`，954 行、41,883 字元）。文字檔因為雙欄與圖穿插，段落順序有幾處交錯（摘要被拆成 L24 標題與 L63–77 內文、3.2 節落在 4.1 節之後、Figure 2 的六段程式碼被打散在 L226–559），讀的時候對著 PDF 頁面還原順序。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）#6
- 下文行號是 `xie2018-tracing.txt` 的行號，頁碼是論文頁碼。

## 研究設計

- **類型**：受試者間實驗，作者稱 block-randomized（依自述修過幾門 CS 課、花多少小時寫程式分層隨機），因為有人取消，兩組人數不等且分層不完全（L183–187「We attempted to block randomize participants … Because of cancellations, there were 11 in the control group and 13 in the strategy group.」）。另有質性分析（放聲思考錄音、草稿、訪談、研究者筆記）。
- **受試者**：同一門大學 CS1（Java）的 24 名學生，自願報名；招募說法是「期中考前的準備」，解題後會得到家教輔導；限修過 0 或 1 門 CS 課的人（L160–166）。男 11、女 13；19 人是第一次修 CS 課，1 人重修，1 人在社區大學修過 CS1，1 人修過 AP CS，2 人修過未說明的 CS 課；大一 16 人、大二到大四 7 人、1 人已有碩士學位；CS 主修只有 3 人（L167–175，p.345）。地點是 University of Washington（由作者單位推定，原文沒有明寫課程所在學校）。
- **介入（策略組，13 人）**（第 2 節，L111–151；3.1 節，L200–206）：
  - 策略三步：(1) 讀題，在題目說明末尾打勾；(2) 找到程式開始執行的地方，在那一行畫箭頭；(3) 依 Java 的規則逐行執行——從語法判斷這一行每個部分適用的規則、照規則做、更新記憶表、找下一段程式、重複到程式結束。
  - 記憶表（memory table）：每次呼叫方法就開一張新表，表頭寫方法名；變數建立時加一列（名稱欄、值欄）；變數更新時劃掉舊值寫上新值；方法結束時寫下回傳值並把整張表劃掉（Fig. 1，p.345）。
  - 怎麼教：練完放聲思考之後花約 5 分鐘。給一張寫著步驟的紙、一張有 4 個記憶表範例的紙，研究者帶著走過一遍；做第 1 題時提供怎麼套用策略的協助，通常是重述紙上的步驟，刻意不給語法語意的提示（L200–206「we spent ≈5 minutes after practicing think-aloud to teach the tracing strategy」）。
- **比較對象（對照組，11 人）**：用自己原有的方法追蹤，同樣要放聲思考（L158–159）。
- **程序**：期中考前 3–6 天，一對一與研究者見面。事前問卷（背景、先備知識、自我效能）→ 介紹研究、問幾個問題 → 5–10 分鐘介紹放聲思考 →（策略組）約 5 分鐘教策略 → 依固定順序做 6 題追蹤題並放聲思考，每題做完回想當時在想什麼（平均約 40 分鐘，不限時）→ 訪談自己的策略 → 事後問卷 → **兩組都接受約 30 分鐘家教**，檢討研究題目、期中考形式與小抄（L181–199）。
- **題目**（3.2 節、Fig. 2，p.346）：6 題都是「給定程式、寫出輸出」。第 1 題自編，讓人練記憶表；第 2、3 題來自練習用期中考；第 4、5 題來自 SCS1；第 6 題自編。作者設計時想讓題目比期中考難。
- **量了什麼、何時量**：
  - 當場：6 題得分，滿分 36。評分規準是先依放聲思考筆記訂好、訂完才看作答（L406–410）；原文沒有說評分者是否不知道組別。
  - 期中考（3–6 天後，滿分 100）：考後用線上問卷請受試者**自己回報**成績。24 人中 17 人回覆（對照 8、策略 9，其中 1 人不提供成績）（L411–417）。期中考內容約 50% 追蹤、40% 寫程式、10% 不變式（L605–606）。
- **統計**：各題分數不符常態，用單尾 Mann-Whitney U；總分與期中成績用單尾 Welch t 檢定；效果量用 Common Language 效果量（L568–577）。**全部是單尾檢定**，六題之間沒有多重比較校正。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 當場 6 題總分（滿分 36） | 策略組 M = 30.00（SD 4.91，n = 13）；對照組 M = 24.55（SD 9.16，n = 11）；單尾 Welch t，p = 0.049；Cohen's d = 0.7243；CL 效果量 70% | 教了逐行＋記憶表策略 vs 用自己的方法 | 4.1 節，L593–594、L662–669；Fig. 4，p.347 | 「Figure 4 shows the distributions, where the strategy group performed significantly better (p = 0.049). Ten of the 13 students who learned the strategy performed better than the mean of the control group.」 |
| 2 | 「高 15%、變異少 46%」 | 5.45 分的差距，是滿分 36 的 15.1 個百分點（相對於對照組平均則是高 22%）；SD 4.91 對 9.16，少 46% | 同上 | L593–594 | 「For the total score across all problems, we found that the strategy group performed on average 15% better and with 46% less variability.」（15.1 與 22 是我的換算） |
| 3 | 逐題比較 | 六題中策略組的中位數都大於或等於對照組、IQR 都較小；**只有第 4 題顯著**（p = 0.021，U = 101.5，CL 效果量 71%）；其餘五題原文沒有給 p 值，Fig. 3 只在第 4 題標星號 | 同上 | L581–592；Fig. 3，p.347 | 「For all problems, the median for the strategy group was greater than or equal to the control group's and the IQR was lesser」「Strategy group participants performed significantly better on Problem 4 (p=0.021), which required them to keep track of multiple variables through nested if/else statements.」 |
| 4 | 第 4 題細節 | 策略組 13 人中 11 人滿分，且高於對照組的中位數 | 同上 | L587–589 | 「11 of 13 participants in the strategy group scored perfectly on this problem and above the median score of the control.」 |
| 5 | 期中考（自報，滿分 100） | 策略組 M = 91.5（SD 6.68，n = 8）；對照組 M = 84.5（SD 11.5，n = 8）；單尾 Welch t，**p = 0.083（不顯著）**；全班平均 80.4 | 同上，但兩組在研究結束時都拿到約 30 分鐘家教 | L670–682；Fig. 5，p.347 | 「We found a trend towards significance (p=0.083) that the strategy group performed better than the control group on the midterm.」 |
| 6 | 期中考「高 7%、變異少 42%」 | 差 7 分；SD 6.68 對 11.5 | 同上 | L670–672 | 「Seven of the 8 strategy group participants who provided midterm grades said they used the strategy on the midterm. These 8 scored on average 7% better than the control group and had 42% less variability.」 |
| 7 | 期中考的差距來自哪裡 | 作者說追蹤題較簡單，差距主要來自寫程式題；沒有給分項數字 | — | L680–682 | 「The tracing questions on the midterm were easier, so the difference in performance came largely from the code writing questions which were more challenging.」 |
| 8 | 當場總分與期中成績的相關 | r = 0.91（Pearson） | 不分組 | L565–568 | 「We found a strong linear correlation (r = 0.91, Pearson) between the scores on the study problems and the midterm grades」 |
| 9 | 自我效能的組間差異 | 程式自我效能顯著偏向**對照組**（p < 0.01，雙尾 Welch t） | — | 第 5 節，L837–838 | 「There was a significant difference in average programming self-efficacy [19] favoring the control group (p<0.01, 2-sided Welch t-test).」 |
| 10 | 其他可能的混淆變項 | 研究前的睡眠時數、研究前與期中考前做的練習題數，組間無顯著差異（沒給數字） | — | L834–837 | 「We did not find significant differences between groups relating to fatigue before the study (# hrs slept) or the amount of practice prior to the study or midterm」 |

### 質性結果（4.2 節，p.347–348）

- 11. 對照組最低的兩人：語意知識不完整，常常沒有逐行追蹤（跳過不熟的語法如 `x++`、自己假設控制流程）；會去想「這題像不像以前做過的」；兩人都在好幾題中途放棄（L629–637）。最低分 9/36，做法是想弄懂整段程式的目的、把程式翻成英文，一半的題目沒作答；在第 4、6 題想過「Maybe if I write down the variables?」但沒有寫（L638–657）。
- 12. 對照組最高的六人（30–35 分）：**本來就會逐行追蹤，也會把中間值寫下來**，只是不一定每次都寫；通常是遇到「很多變數」「變數開始更新」這類線索才開始畫表；數值變數會寫、字串變數常略過（L689–695、L737–746）。最高分 35/36。
- 13. 策略組最低的三人（22–23.5 分）：沒有照策略做，仍會跳離逐行追蹤（有意或無意），其中一人後 3 題沒畫記憶表；覺得畫表費時、常常沒必要。但他們「never became overwhelmed or gave up」（L758–767）。最低分 22/36，研究前做過 0 題練習題。
- 14. 策略組最高的四人（34–36 分）：照策略逐行追蹤並完整更新記憶表。受試者的話：「forces you to think through what you're doing...forces you not to skip around」「didn't have to keep thinking about values because they were on paper」。這一群最常見的錯是第 6 題把 double 寫成整數（L816、L707–717）。唯一六題全對的人研究前做過約 100 題練習題（其他人平均不到 10 題），已有碩士學位（L718–735）。
- 15. 作者的歸納：表現好的人能應用語意知識、有系統地逐行追蹤、把中間值寫下來而不是記在腦中，「This was true regardless of whether a student used our strategy, but when a student did, they tended to perform even better.」（L824–828）
- 16. 策略沒有補足語法語意知識的不足：兩組低分者的錯誤都反映語意知識不完整（L848–851）。
- 17. 策略的成本：受試者要另外花力氣記住自己追到哪一行（用手指、劃掉已執行的行）；字串寫起來慢；記憶表對基本型別與字串有效，對陣列、物件未必（L853–857、L745–746）。

## 作者自己列的限制（4.3 節 L790–806；第 5 節 L832–841）

1. 期中考前幾天做，顧慮受試者時間；先備知識只用代理指標（估計的寫程式時數、修過幾門 CS 課）。
2. 成績量尺沒有經過效度驗證（雖然與期中成績高度相關）。
3. 學生自願參加，可能有選擇偏誤。
4. 有人退出，使依先備經驗的分層隨機「slightly favoring the strategy group」。
5. 期中考只在研究後 3–6 天，長期保留不明。
6. 放聲思考與事後回想可能影響受試者的思考。
7. 題目之間有延續效應（carryover），即使沒有給回饋。
8. 統計分析假設策略對每個人效果相同，混合模型可能更合適。
9. 樣本小，只來自一門課；該課老師本來就示範過用表格追蹤、學生用過 jGRASP 除錯器，可能影響受試者怎麼追蹤。
10. 先備知識、自我效能、動機、疲勞、讀書量等混淆變項可能影響結果；「Replication is necessary to increase confidence in the effects of teaching a strategy.」

## 與摘要說法不一致的地方

1. **摘要「We spent only 5-10 minutes introducing the strategy」**（L69）對不上正文。正文裡 5–10 分鐘是介紹**放聲思考**的時間（L190「we spent 5-10 minutes introducing think-aloud」），教策略是「≈5 minutes」（L200），另外還在第 1 題提供套用策略的協助（沒給時間）。寫「約 5 分鐘講解，加上第一題的帶做」比較貼近正文；「5–10 分鐘」只有摘要這樣寫。
2. **摘要「Students who learned the strategy also scored on average 7% higher on the course midterm」**（L74–75）沒有交代這個差異不顯著（單尾 p = 0.083）、只有 16 人（各 8 人）、成績是自報、兩組考前都接受了研究者的家教。正文結論句「our data show that explicitly teaching a strategy can improve tracing performance, even on a midterm」（L683–685）也比資料強；而且作者自己說期中的差距主要來自寫程式題，不是追蹤題（#7）。
3. **摘要「scored on average 15% higher … (p<0.05)」**：p = 0.049 是**單尾**檢定；15% 是滿分的百分點差，不是相對提升。雙尾的話不會過 .05。
4. **摘要「block-randomized experiment」**：正文是「attempted to block randomize」，因取消而不完整，且事後自我效能有顯著組間差異（偏向對照組）。
5. **摘要「in <1 hour」**：指的應是整個解題時段（約 40 分鐘加前置），正文沒有逐項加總；教策略本身約 5 分鐘。
6. 正文內的筆誤：L674–677 算全班平均離兩組多遠時，括號裡的標準差寫成 σc = 9.16、σs = 4.91（那是當場總分的 SD），但 Z = −0.36 與 −1.66 其實是用期中成績的 SD 11.5 與 6.68 算出來的（我驗算：4.1/11.5 = 0.36，11.1/6.68 = 1.66）。數值結論不受影響。
7. Fig. 5 對照組看得到的點數少於 8（有重疊的可能），無法從圖上確認各組確實是 8 人；正文的 17 人回覆、策略組 9 人中 1 人不給成績，推得策略組 8 人、對照組 8 人。

## 與清單「要撐的結論」不合的地方

清單寫：「花幾分鐘教逐行追蹤並把狀態寫下來，追蹤題成績提高」。

- **方向撐得住，強度要降**。能寫的是：24 名 CS1 學生的一個小實驗裡，花約 5 分鐘教這個策略的那組，當場 6 題追蹤題平均 30.0 分對 24.6 分（滿分 36），單尾 p = 0.049。要連著寫的條件：
  1. 樣本 13 對 11，單尾檢定剛好過門檻；六題裡單獨看只有第 4 題（巢狀 if/else、多個變數）顯著。
  2. 量的是教完之後馬上做的題目，一對一、有研究者在場、邊做邊放聲思考。不是延後測驗。
  3. 3–6 天後的期中考差 7 分，不顯著，而且是自報成績、兩組都被家教過。不能寫成「期中考也較好」。
  4. 作者自己說需要複製研究。
- **「花幾分鐘」**：用「約 5 分鐘」而不是摘要的「5–10 分鐘」（見上一節第 1 點）；還包含第 1 題的帶做。
- **「把狀態寫下來」要寫具體**：是每次方法呼叫開一張「名稱／值」兩欄的表、更新時劃掉舊值寫新值、方法結束劃掉整張表，再加上「找到起點、逐行照規則執行」的步驟。這是一份給學習者自己動手做的程序，不是教材上印好的追蹤表。拿它來支持「文章裡附變數追蹤表」是類推：原文測的是學習者自己畫，不是讀作者畫好的。
- **清單沒寫、但會影響怎麼引用的**：
  - 效果看起來集中在低分端：策略組的變異少 46%，最低分 22（對照組最低 9），策略組低分者沒有人放棄。作者的一種解讀是策略幫低分者不放棄、能一步步做下去（L842–847）。
  - 對照組的高分者本來就自己逐行追蹤、自己畫表（#12）。所以比較準確的說法是「把高手本來就在做的事明講出來教給所有人」。
  - 策略補不了語意知識的洞（#16）。
  - 自我效能偏向對照組（#9），這個不平衡對策略組不利，作者沒有據此調整。

## 讀取紀錄

- `xie2018-tracing.txt` 一次從 L1 讀到 L954（全檔）。因為文字檔段落交錯，讀完後對 PDF 頁面確認順序：摘要與第 1 節（p.344）、第 2 節與 3.1 節（p.345）、Fig. 2 與 3.2 節、4.1 節前半（p.346）、4.1 節後半與 4.2.1–4.2.2（p.347）、4.2.2 後半到第 5 節開頭（p.348）、第 5 節後半、致謝、參考文獻（p.349）。
- 對過 PDF 頁面影像：p.344–347 四頁，含 Fig. 1（記憶表實例）、Fig. 2（六題程式）、Fig. 3（各題箱形圖，只有第 4 題標星號）、Fig. 4（總分分布與圖說的 M、SD、p）、Fig. 5（期中成績分布與圖說）。這篇沒有數字表格，所有統計量都在正文與圖說裡。
- p.348–349 只讀文字檔（純文字段落與參考文獻），沒有另外看頁面影像。參考文獻 L864–951 只掃過。
- 致謝提到研究材料存在 `https://github.com/bxie/archive/tree/master/sigcse2018`，沒有去開。
