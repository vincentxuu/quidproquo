# 抽取紀錄：Google，Technical Writing One：Audience（課程單元網頁）

書目：Google for Developers，〈Audience〉，Technical Writing One 課程（For Students）的一個單元。網頁沒有署名作者，文內自稱「The course designers」（L65）。頁尾「Last updated 2025-03-28 UTC」（L344）。授權：內容 CC BY 4.0、程式範例 Apache 2.0（L342）。沒有 DOI。
網址：https://developers.google.com/tech-writing/one/audience
原文檔：`.research/raw/learning-content/q1-learner/google_tw_audience.txt`（349 行、13,119 位元組）；同目錄有 `google_tw_audience.html`（81,387 位元組，原頁）。
讀取日期：2026-10-14
版本：2026-10-13 存下的網頁文字版，頁面自標最後更新 2025-03-28。
供哪幾篇使用：order 12（先備知識）。
文件性質：業界教學課程的一頁，**不是研究**。全頁沒有引用任何研究、資料或出處；每一條都是課程設計者的主張與示範。

## 研究設計

不適用。這是一個標示「Estimated Time: 10 minutes」（L63）的課程單元，內容是原則、虛構範例與兩題練習（附答案）。沒有受試者、沒有比較、沒有量測。

## 結果（逐項）

這裡列的是「頁面主張了什麼」，不是研究發現。

| # | 主張 | 所在段落 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 好文件的等式：讀者做一件事所需的知識與技能，減去讀者現有的知識與技能 | 單元開頭 | L68–69 | 「good documentation = knowledge and skills your audience needs to do a task − your audience's current knowledge and skills」 |
| 2 | 等式的白話版：提供讀者需要但還沒有的資訊 | 單元開頭 | L71–72 | 「make sure your document provides the information that your audience needs but doesn't already have.」 |
| 3 | 單元的三個步驟：定義讀者、決定讀者需要學什麼、讓文件貼合讀者 | 單元開頭 | L75–79 | 「Define your audience. / Determine what your audience needs to learn. / Fit documentation to your audience.」 |
| 4 | 認真的文件工作會用問卷、使用者研究、焦點團體、文件測試來定義讀者；本單元因為讀者多半沒那麼多時間，改用較簡單的做法 | Define your audience | L85–89 | 「These efforts might involve surveys, user experience studies, focus groups, and documentation testing. You probably don't have that much time, so this unit takes a simpler approach.」 |
| 5 | 第一步是辨認讀者的角色；列了七種範例角色（軟體工程師、技術性非工程師職務、科學家、科學領域專業人員、大學部工程學生、研究所工程學生、非技術職） | Define your audience | L91–105 | 「Begin by identifying your audience's role(s).」 |
| 6 | 角色只是一階近似；同角色的人通常共有某些基礎技能 | Define your audience | L107–110 | 「roles remain an essential first-order approximation in defining your audience. People within the same role generally share certain base skills and knowledge.」 |
| 7 | 例子：可以假設軟體工程師懂 O(n)，不能假設非技術職懂 | Define your audience | L112–116 | 「you can depend on software engineers knowing what O(n) means, but you can't depend on non-technical roles knowing O(n).」 |
| 8 | 同一角色內的知識很快就分歧（各人熟不同語言、不同作業系統） | Define your audience | L125–128 | 「Unfortunately, knowledge within the same role quickly diverges.」 |
| 9 | 只靠角色不夠，還要考慮讀者與該知識的「距離」（proximity） | Define your audience | L130–131 | 「Roles, by themselves, are insufficient for defining an audience. That is, you must also consider your audience's proximity to the knowledge.」 |
| 10 | 時間也影響距離：幾乎所有軟體工程師都學過微積分，但工作上不用就逐漸忘掉；反過來，資深工程師對目前專案的了解遠多於新進工程師 | Define your audience | L137–141 | 「most software engineers don't use calculus in their jobs, so their knowledge of calculus gradually fades.」 |
| 11 | 讀者分析的範例格式（虛構的 Project Zylmon）：先列角色，再列三條「已知什麼／不熟什麼／需要複習什麼」 | Sample audience analysis | L145–162 | 「My target audience took linear algebra in university, but many members of the team need a refresher on matrix multiplication.」 |
| 12 | 寫下讀者為達成目標需要學會的每一件事；有時是「讀完會做的任務」清單 | Determine what your audience needs to learn | L166–177 | 「Write down a list of everything your target audience needs to learn to accomplish goals.」 |
| 13 | 有些任務必須依特定順序學會（例：先學會在新環境建置與執行程式，才學寫特定類型的程式） | 同上 | L179–182 | 「Note that your audience must sometimes master tasks in a certain order.」 |
| 14 | 設計規格類文件的清單改列「讀者該得知的資訊」而不是任務 | 同上 | L184–192 | 「then your list should focus on information your target audience should learn rather than on mastering specific tasks.」 |
| 15 | 貼合讀者需要同理心；作者明說沒有簡單答案，只提供幾個可留意的面向 | Fit documentation to your audience | L196–200 | 「Unfortunately, we can offer no easy answers. We can, however, offer a few parameters to focus on.」 |
| 16 | 讀者範圍越廣，就要假設得解釋越多（以團隊縮寫為例） | Vocabulary and concepts | L206–209 | 「As your target audience widens, assume that you must explain more.」 |
| 17 | 除非只寫給團隊裡的資深成員，通常得解釋得比預期多；新進成員也算不懂的一方 | Vocabulary and concepts | L211–216 | 「Unless you are writing specifically for other experienced members of your team, you typically must explain more than you expect.」 |
| 18 | 知識的詛咒：專家的理解會毀掉他對新手的解釋，因為容易忘記新手不知道自己已知的東西 | Curse of knowledge | L220–225 | 「Experts often suffer from the curse of knowledge, which means that their expert understanding of a topic ruins their explanations to newcomers.」 |
| 19 | 從新手角度看的比喻：知識的詛咒像是模組還沒編譯造成的「File not found」連結錯誤 | Curse of knowledge | L227–228 | 「the curse of knowledge is a "File not found" linker error due to a module not yet compiled.」 |
| 20 | 練習一：一段介紹 C 語言的文字，若讀者是沒寫過程式的醫師，答案列出 9 個不適當或陌生的詞（Language、Mid-level language、Assembly language、Python、Java、Program、C Standard Library、Allocate and free blocks of memory、Pointers） | Exercise | L232–268 | 「This paragraph suffers immensely from the curse of knowledge.」 |
| 21 | 同一段文字換成「會 Python、剛學 C 的資工大學生」仍然有知識的詛咒；建議改成拿 C 與 Python 對照 | Exercise | L270–273 | 「The average Python programmer is unaware of manipulating memory or pointers. A better introductory paragraph would compare and contrast C with Python.」 |
| 22 | 用簡單的字：相當比例的技術讀者慣用語言不是英文 | Simple words | L277–282 | 「a significant percentage of technical readers are more comfortable in languages other than English.」（沒有給數字或來源） |
| 23 | 文化中立：不要讓讀者得懂 NASCAR、板球或相撲才看得懂軟體說明；慣用語是知識的詛咒的另一種形式 | Cultural neutrality and idioms | L286–309 | 「idioms are another form of the curse of knowledge.」 |
| 24 | 有些讀者用翻譯軟體讀文件，翻譯軟體處理文化典故與慣用語比處理平實英文吃力 | Cultural neutrality and idioms | L311–313 | 「Translation software tends to struggle more with cultural references and idioms than with plain, simple English.」（沒有給來源） |
| 25 | 練習二：三個含俚語或慣用語的句子（kosher、sticky wicket、Be that as it may）與改法 | Exercise | L317–336 | 「A sticky wicket is British slang, which does not travel well.」 |

頁面沒有談到的事（讀完全頁確認）：沒有談文章開頭要不要列先備知識清單；沒有談同一份文件怎麼同時服務程度不同的讀者；沒有談怎麼驗證自己對讀者的假設對不對（只在 L85–87 提到別人會做問卷與測試，本單元不教）。

## 作者自己列的限制

- 定義讀者的正規做法（問卷、使用者研究、焦點團體、文件測試）本單元沒有採用，改用較簡單的做法（L85–89）。
- 角色只是一階近似，承認非技術職裡也有很多技術與數學能力很好的人（L107–109）。
- 怎麼跳出自己的觀點去貼合讀者，「we can offer no easy answers」（L199–200）。

## 與摘要說法不一致的地方

頁面有一個「Page Summary」區塊（L51–61，四點）。逐項對過：前三點與正文一致。第三點寫「explaining potentially unfamiliar abbreviations and implementation details」，正文對應 L206–216，一致。第四點（國際讀者、文化中立）與 L284–313 一致。沒有不一致。要留意的是這個區塊的來源不明（頁面沒說是人寫還是自動產生），引用時引正文，不引 Page Summary。

## 與清單「要撐的結論」不合的地方

清單寫：「實務做法：文件 = 讀者需要的 − 讀者已有的；先定義讀者角色；知識的詛咒」。

- 三項原文都有，撐得住（L68–69、L91、L220–225）。
- 要補的精確度：等式左邊是「good documentation」，右邊兩項都是「knowledge and skills」，而且第一項有「to do a task」的限定。寫成「文件 = 讀者需要的 − 讀者已有的」時不要漏掉「做某件事所需」。
- 「先定義讀者角色」之後原文緊接著說角色不夠，還要看「proximity to the knowledge」，包括時間造成的遺忘（L130–141）。只引「角色」會漏掉原文自己加的但書。
- 這一頁只能當「業界課程這樣教」的出處，不能當「這樣做有效」的證據：全頁零引用。

## 讀取紀錄

- L1–63：頁首導覽、語言選單、Page Summary、預估時間。
- L65–81：開頭等式與三步驟。L81 提到一段影片（「As the following video suggests」），文字檔沒有影片內容，沒看。
- L83–162：Define your audience 與 Sample audience analysis。
- L164–192：Determine what your audience needs to learn。
- L194–273：Fit documentation to your audience、Vocabulary and concepts、Curse of knowledge、練習一與答案。
- L275–336：Simple words、Cultural neutrality and idioms、練習二與答案。
- L338–349：下一單元連結、授權、最後更新日期、回饋元件的 JSON。

全檔 349 行依序讀完。沒有表格。沒有對照 HTML 原頁（文字檔已含收合的練習答案）。
