# 抽取紀錄：Guo 2018，Non-Native English Speakers Learning Computer Programming

- **合法公開來源**：https://pg.ucsd.edu/publications/non-native-english-speakers-learning-programming_CHI-2018.pdf （作者個人頁上的定稿，2026-10-14 核對；重新下載與手上的 `guo2018-nonnative.pdf` 位元組完全相同，211,403 位元組）；刊出版在 https://dl.acm.org/doi/10.1145/3173574.3173970（ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS），另存 `.research/raw/learning-content/q2-interactive/guo2018-nonnative-acm-dl.pdf`。兩版比對：作者定稿的 11,866 個詞有 11,838 個與 ACM 版逐詞對上，差別只有 ACM 版每頁多的頁眉（「CHI 2018 Paper … Paper 396 Page n」）與參考文獻在雙欄裡的抽字順序；正文與數字沒有差異。下面「版本」寫的「刊出版」應讀作「作者自存的定稿」。

- **書目**：Philip J. Guo（UC San Diego）。Non-Native English Speakers Learning Computer Programming: Barriers, Desires, and Design Opportunities. *Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems*（CHI 2018，2018 年 4 月 21–26 日，Montreal）。DOI 10.1145/3173574.3173970。單一作者；作者、會議、DOI 對過首頁（L1–6、L41–44）。致謝提到 Hsien-che (Charles) Chen 協助資料分析（L1024–1026）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/guo2018-nonnative.txt`（1,486 行、81,232 字元）；PDF `guo2018-nonnative.pdf`，14 頁（正文到第 10 頁，其餘是參考文獻）。這份 `.txt` 是不帶 `-layout` 轉的（我另外重轉一次，行數與字元數完全相同），段落沒有左右交錯；但 Table 1、2 被拆成一行一格、欄位順序打散，Table 3–5 的標籤與數字分離，五張表都改讀 PDF 版面。
- **讀取日期**：2026-10-14
- **版本**：刊出版（ACM 版權頁，ISBN 978-1-4503-5620-6/18/04）。
- **供哪幾篇使用**：order 4（記號、行話與術語）；清單註明與 order 24（語言、翻譯與手機）重疊，兩篇要先分好誰用。

## 研究設計

- **類型**：線上問卷，開放式題目的質性編碼加上各類別的百分比。沒有操弄、沒有測量學習成果。作者自己的定位：「instead of quantitatively measuring learning gains like prior studies, our study instead focuses on obtaining qualitative perceptions from learners」（L158–160）。
- **在哪裡發**：程式教學網站 pythontutor.com（作者自己做的 Python Tutor，L186–193、參考文獻 33）。在網站最下方放一句話與 Google Forms 連結（L217–221）。自願填答、不付酬；2016 年 12 月開放，2017 年 8 月關閉（L222–223）。
- **受試者**：840 份回應（條件是第 5–8 題至少有一題不是空白、不是垃圾訊息，L247）。
  - 依第 1 題（最先學會說的語言）分成英語母語者 184 人（22%）、非英語母語者 656 人（78%）（L248–249、L434–436）。
  - 來自 86 個國家（以 IP 定位，MaxMind GeoLite2）；英語母語者來自 40 國、非母語者來自 82 國（L447–450）。
  - 第 1–3 題合計提到 74 種語言（L432–433）。
  - 沒有蒐集年齡、性別、程式經驗。原文給的年齡與性別分布是 Python Tutor 整個網站的使用者，不是這 840 人（L207–214）。
- **問卷**：八題，除第 4 題外都是開放式，全部可以不答（L224–244）。
  1. 最先學會說的語言
  2. 現在說得最自在的語言
  3. 用什麼語言讀程式相關教材
  4. 自評英文閱讀流利度：Beginner／Intermediate／Proficient／Fully Fluent
  5. （英語母語者）看非母語者學程式時注意到什麼困難？你怎麼幫過他們？
  6. （非母語者）英文程度在哪些方面（如果有）讓你學程式更難？你怎麼克服？
  7. （非母語者）程式教材可以怎麼改進來幫你學得更好？
  8. （非母語者）學程式或讀程式相關的東西，在哪些方面（如果有）提升了你的英文？
- **各題作答人數**：184 位母語者中 97% 答了第 5 題（Table 3 寫 N = 178）；656 位非母語者中 59% 答了第 6 題（Table 3 寫 N = 384）、71% 答了第 7 題（464 人）、73% 答了第 8 題（L248–250、L701–702）。
- **編碼方式**：研究團隊（教授加一位研究助理）一起讀全部回應，由下而上歸納出類別，定案後再一起走一遍，每則回應可貼一個以上的標籤（L361–368）。兩人是一起編的，原文沒有獨立編碼，也沒有評分者一致性的數字。
- **語言處理**：14 則非英文回應（葡萄牙文 6、中文 5、南非語 1、法文 1、俄文 1）先用 Google Translate 處理（L369–371）；文中引用的句子原本都是英文（L421–422）。
- **比較對象**：沒有對照組。第 5 題（母語者的旁觀）與第 6 題（非母語者的自述）並列在 Table 3，但兩題問法不同、作答的人不同，作者沒有做檢定。

## 結果（逐項）

Table 1–5 都對過 PDF 版面（第 4、5、7、8 頁）。百分比的分母要看清楚：Table 3–4 是「有回答那一題的人」，不是全部 840 人或全部 656 人。

### 受試者的語言背景（Table 1、Table 2；L428–494）

| # | 結果 | 數字 | 分母／條件 | 表／節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 母語（第 1 題）前十名 | English 22%、Spanish 9%、Chinese 8%、French 7%、Russian 6%、Portuguese 5%、German 5%、Hindi 4%、Dutch 3%、Italian 2% | N = 840 | Table 1（PDF 第 4 頁） | L257–359 | 表題：「Percent of respondents (N=840) that reported top 10 most common languages for Questions 1–3」 |
| 2 | 現在說得最自在的語言（第 2 題） | English 37%、Spanish 8%、Chinese 7%、French 6%、Russian 5%、Portuguese 5%、German 5%、Hindi 3%、Dutch 3%、Italian 3% | N = 840，可複選 | Table 1 | 同上 | 「37% of respondents are now most comfortable speaking English, and 7% reported being most comfortable speaking multiple languages」（L438–440） |
| 3 | 用什麼語言讀程式教材（第 3 題） | English 96%、Chinese 3%、French 2%、Russian 2%、German 1%、Portuguese 1%、Spanish 1%、Polish 0.5%、Dutch 0.5%、Italian 0.5%；8% 用一種以上的語言 | N = 840，可複選 | Table 1 | L443–446 | 「Almost all respondents (96%) read programming-related instructional materials in English. However, 8% reported reading in more than one language」 |
| 4 | 非母語者自評英文閱讀流利度（第 4 題） | Beginner 3%、Intermediate 14%、Proficient 44%、Fully Fluent 39% | 非母語者（656 人） | Language Backgrounds | L435–438 | 「Of the remaining 78% of non-native English speakers, 3% self-rated their level of English reading fluency as Beginner, 14% as Intermediate, 44% as Proficient, and 39% as Fully Fluent」 |
| 5 | 所在國家前十名，英語母語者 | United States 42%、United Kingdom 9%、India 6%、Canada 5%、Germany 4%、Australia 3%、Singapore 3%、South Korea 2%、Kenya 2%、Japan 1% | 英語母語者（184 人） | Table 2（PDF 第 4 頁） | L313–417 | 表列 |
| 6 | 所在國家前十名，非母語者 | United States 16%、India 7%、France 5%、Brazil 5%、Germany 4%、Canada 3%、United Kingdom 3%、Ukraine 3%、Netherlands 3%、China 3% | 非母語者（656 人） | Table 2 | 同上 | 表列 |
| 7 | 作者對樣本的描述 | 樣本的英文程度偏高，仍然回報了許多障礙 | — | Language Backgrounds | L489–494 | 「despite our sample likely being more English-literate than their non-English-speaking peers, respondents still reported many learning barriers due to being non-native speakers.」 |

### 障礙（Table 3，PDF 第 5 頁；第 5、6 題）

每則回應可以歸到一類以上，所以各欄加起來超過 100%。

| # | 障礙類別 | 非母語者自述（第 6 題，N = 384） | 母語者旁觀（第 5 題，N = 178） | 行號 |
|---|---|---|---|---|
| 8 | 讀教材有困難（Problems w/ Reading Instructional Materials） | 35% | 29% | L458–480 |
| 9 | 技術溝通有困難（聽與說） | 24% | 49% | 同上 |
| 10 | 讀程式碼有困難 | 16% | 38% | 同上 |
| 11 | 寫程式碼有困難 | 11% | 28% | 同上 |
| 12 | 同時學英文與程式很難 | 17% | 8% | 同上 |

- 表題原文：「The five kinds of barriers that non-native English speakers faced when learning programming, reported both by non-native (NN†) speakers (Question 6, N=384) and by native English speakers observing non-native peers (Question 5, N=178). Percentages add up to more than 100% since each response can mention more than one kind of barrier.」（L476–480）
- 兩群人合計的數字散在內文：讀教材 34%（L504「The most commonly-reported barrier (34% of all responses)」）、技術溝通 31%（L869）、讀程式碼 23% 與寫程式碼 17%（L878–879）。
- 第 6 題的問法是「in what ways (if any)」。原文沒有報告有多少人回答「沒有影響」，也沒有報告不屬於這五類的回應有多少。

各類別底下作者引的回應（都是單一受訪者的話，作者挑來當代表）：

| # | 類別 | 重點 | 行號 | 原文一句 |
|---|---|---|---|---|
| 13 | 讀教材 | 母語教材少、舊、只講基礎 | L507–518 | 葡萄牙語者：「There are not many materials about programming … in portuguese. The ones we can find usually are very out of date.」 |
| 14 | 讀教材 | 翻譯過的教材把術語也翻了，反而看不懂 | L520–527 | 羅馬尼亞語者：「I find it harder to read [programming] books and such in Romanian because they sometimes translate the terms and I get confused.」波蘭語者：「everything [about programming] is pretty outdated, covers only the basics or is funky translated.」 |
| 15 | 讀教材 | 讀得慢、花更多時間 | L528–532 | 中文母語者：「It makes me to learn less effectively. … I have to spend more time in reading, understanding and listening lectures [sic].」 |
| 16 | 讀教材 | 一個術語可以讓整句看不懂 | L533–539 | 法語者：「The technical vocabulary linked to programming can be complicated to assimilate, especially in the middle of explanatory sentences if you don't know the equivalent word in your native language. Sometime a single technical word can blur the meaning of an entire sentence.」 |
| 17 | 讀教材 | 口語化、不正式的寫法較難讀（母語者的觀察） | L540–544 | 「we [native speakers] often miss that non-native English speakers won't understand nuance or less formal descriptions.」 |
| 18 | 技術溝通 | 用英文下搜尋關鍵字很難 | L561–568 | 德語者：「I'll also have to guess the most common way to express the problem in English and, if that doesn't work, find some mostly synonymic ways to describe the problem.」 |
| 19 | 讀程式碼 | 關鍵字是英文，翻回母語有多個意思 | L573–578 | 葡萄牙語者：「the translation of "while" in portuguese has more meanings than what is used in a code」 |
| 20 | 讀程式碼 | 相近的術語分不清 | L578–580 | 西班牙語者：「It is difficult for me to understand the differences between objects, classes and instances.」 |
| 21 | 讀程式碼 | 縮寫與慣用命名看不出意思（母語者的觀察） | L581–592 | 「if a non native English speaker saw num list they might not figure that it's a list of numbers.」 |
| 22 | 讀程式碼 | 範例預設英文的字元與排序規則 | L593–600 | 斯洛伐克語者：字串依字典順序比較、字只含 A–Z 的前提「is another lie for my language. So it is hard to follow when premises are 'wrong'.」 |
| 23 | 寫程式碼 | 變數命名、輸出字串的文法拼字（主要是母語者的觀察；非母語者自己較少提） | L603–629 | 「Non-native English speakers also mentioned similar barriers, albeit less frequently.」 |
| 24 | 同時學兩樣 | 兩邊都進步得慢 | L632–643 | 阿拉伯語者：「I expect 90% will quit because I have to learn English and coding at the same time」（這是受訪者個人的估計，不是資料） |

### 怎麼克服（第 5、6 題的後半；L644–697）

| # | 結果 | 數字 | 分母 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 25 | 回答裡提到克服方法的比例 | 母語者 25%；非母語者 58% | 各自有回答第 5、6 題的人 | L648–650 | 「25% of native speakers mentioned ways to overcome barriers, and 58% of non-native speakers mentioned it.」 |
| 26 | 母語者的做法：先把關鍵字講清楚 | 無數字 | — | L668–678 | 「It's important as a teacher to frontload the key words and language before teaching a concept.」「not knowing what some of the more obscure words used (like concatenate) mean in regular English … Usually a description or replacement word fixes it.」 |
| 27 | 非母語者的做法：把英文學好；查字典、翻譯、Google | 無數字（原文只說 Many、People also） | — | L685–697 | 德語者：「the word 'append'. I just googled the meaning in my native language and was right back on course.」 |

### 想要教材怎麼改（Table 4，PDF 第 7 頁；第 7 題，N = 464）

| # | 類別 | 比例 | 行號 |
|---|---|---|---|
| 28 | 用簡化的英文，不要帶文化色彩的俚語 | 36% | L657–666 |
| 29 | 多用圖與多媒體 | 23% | 同上 |
| 30 | 多給範例，範例不要綁特定文化 | 21% | 同上 |
| 31 | 內嵌字典（inline dictionaries） | 21% | 同上 |
| 32 | 寧可讀英文原文，不要翻譯版 | 7% | 同上 |

- 表題原文：「The five kinds of desires for improving programming-related instructional materials, as reported by non-native English speakers (Question 7, N=464). Percentages add up to more than 100% since each response can mention more than one kind of desire.」
- 分母是有回答第 7 題的 464 人（非母語者的 71%，L701–702），不是全部 656 位非母語者。
- #32 作者說它不算「想要」，是一類不想要翻譯版的回應（L774–776「The final class of responses was not direct desires but rather was how non-native speakers in our respondent population did not want translated versions of English materials.」）。

各類別底下的回應：

| # | 類別 | 重點 | 行號 | 原文一句 |
|---|---|---|---|---|
| 33 | 簡化英文 | 字小、句子簡單、少俚語、少文化典故 | L707–715 | 「use simplified English: smaller words, simpler sentences, fewer colloquialisms, and less culturally-specific references」；印地語者：「I had to look up the meaning of a nickel, dime etc. while reading about dynamic programming on a blog.」 |
| 34 | 簡化英文 | 術語在程式裡的意思和日常意思不同，要先講清楚 | L716–724 | 祖魯語者：「explaining the important terms that have a different meaning when used in a computer programming field than in ordinary English.」西班牙語者：「The concept, for example, of what means an 'assignment statement' could be more intuitive to an English speaker, but this doesn't necessarily translate into the rest of speakers.」 |
| 35 | 簡化英文 | 請非母語者試讀 | L725–727 | 「Test the books with non native english speaker in order to detect possible overcomplicated sentences.」 |
| 36 | 圖與多媒體 | 圖比文字好懂；有人偏好影片 | L730–739 | 印地語者：「Diagrams & interactive tutorials beat all text.」作者的解釋用的是 presumably：「presumably because visuals can more easily transcend languages」 |
| 37 | 範例 | 少字多例；例子不要預設讀者懂美國的事 | L742–753 | 尼泊爾語者：「Less text, more examples.」中文母語者：「Please don't assume all the cultural and political jokes and celebrity stories used in the programming examples can be understood by all non-native speakers.」 |
| 38 | 範例 | 範例要處理編碼與多語言 | L754–756 | 「character encoding, need to support multiple languages」 |
| 39 | 內嵌字典 | 不離開原文就能查字；術語的字源或由來；像電影字幕那樣對照 | L760–771 | 波蘭語者：「the option to translate words 'inline' from the text (without opening a separate browser window or application) I have in my ebook reader is giving me a lot」；西班牙語者：「including a section on some kind of 'etymology of the terms', or a section on history of the term.」 |
| 40 | 不要翻譯版 | 語法與術語本來就是英文，翻譯版更亂 | L776–780 | 韓語者：「I felt translated Korean version of all the explanations were more confusing since syntax is in English anyway.」另一位：「lot of phrases are misinterpreted.」 |
| 41 | 不要翻譯版 | 英文是共同語言，翻譯浪費資源又難維護 | L781–794 | 德語者：「It would be a massive waste of resources if every non-native english speaking programmer would start to translate documentation, let alone keep it up to date.」 |

### 學程式有沒有幫到英文（Table 5，PDF 第 8 頁；第 8 題，N = 656）

| # | 類別 | 比例 |
|---|---|---|
| 42 | 沒有回答這一題 | 27% |
| 43 | 有回答，但說沒有明顯進步 | 14% |
| 44 | 程式提供了練英文的情境 | 34% |
| 45 | 程式讓人對語言的邏輯想得更清楚 | 14% |
| 46 | 說英文有進步但沒說原因 | 11% |

五列加起來 100%，分母是全部 656 位非母語者（L804–812）。這一張表的分母和 Table 3、4 不同。

### 討論裡的設計建議（L850–926；都是提議，沒有驗證）

作者依 Guzdial 的 learner-centered design 七點提出：雙語結對程式設計；在例題（worked examples）上加雙語標籤（L879–881）；IDE 外掛解讀識別字的縮寫、建議更好的命名；教材用簡化英文，可參考 Simple English Wikipedia（L898–899）；範例示範 Unicode 與各地的貨幣、日期、數字格式；瀏覽器外掛在技術文件裡插入英文理解練習。作者自己對這些提議的保留在 L923–926：「it is important not to overgeneralize these design ideas or to implicitly claim that there is some sort of optimal design for everyone around the world. These ideas should be viewed as starting points to provide impetus for future work.」

「普遍設計」的主張（L930–935）：為非母語者改的東西也會幫到所有人，例如「using simplified English helps even native speakers」。這是作者的論述，這份研究沒有量。

## 作者自己列的限制

Study Design Limitations 一節（L372–427）：

1. **樣本偏向英文程度高的人**：問卷放在美國做的英文網站上，受試者的英文識字程度很可能高於一般人；「it may not fully reflect challenges faced by people with very low levels of English literacy or those who exclusively use non-English resources」（L375–385）。
2. **自陳資料**：「we may be missing latent barriers that people fail to self-report」（L386–387）。
3. **只看語言背景**，沒有考慮文化、社經地位、教育程度、年齡、性別、種族等交織的因素（L388）。
4. **沒有分語言或語系**，只分母語者與非母語者（L389–390）。
5. **機器翻譯**：1.6% 的回應經 Google Translate，可能替人工分類的計數多加約 1.6% 的誤差（L419–421）。
6. **樣本偏向自學型、懂科技、有動機、會反思的人**；「our findings may not reflect the challenges faced by those who are solely taking in-person courses」（L423–427）。

散在別處的：

7. 所有非母語者被當成一群，沒有控制學習者的程式程度（L919–923「we did not control for learner expertise levels」）。
8. 有些讀程式碼的障礙不是非母語者才有，英文流利的學習者也分不清 or、while 的口語意思與程式語意，以及 instance、object 這類相近的詞（L941–947；引的就是 Stefik 與 Siebert 2013 和 Sorva 的迷思目錄）。「Future work here could aim to tease apart which terms disproportionately impede non-native English speakers.」
9. 有些讀教材與溝通的障礙不是程式才有，別的領域也有（L948–951）。
10. 沒有直接問學習動機（L861）。

原文沒有談的：填答率（網站有多少訪客看到連結沒有填）；編碼沒有獨立的第二位編碼者與一致性數字；第 6 題有 41% 的非母語者沒有回答，沒有回答的人和有回答的人差在哪裡；回答「沒有困難」的比例；作者同時是發問卷那個網站的經營者。

## 與摘要說法不一致的地方

逐項對過，數字沒有不一致。措辭上有三處：

1. **「74 native languages」**：摘要與結論寫「840 responses spanning 86 countries and 74 native languages」（L14–15、L1003–1004）。方法與結果節寫的是第 1–3 題**合計**提到 74 種語言（L432–433「collectively mentioning 74 total languages in Questions 1–3」），第 1–3 題分別是母語、最自在的語言、讀教材用的語言。74 是不是全部都是「母語」，原文沒有分開給數字。
2. **摘要沒有帶樣本的偏向**：摘要寫「non-native English speakers faced barriers …」，沒有說這群人 83% 自評英文閱讀是 Proficient 或 Fully Fluent、96% 用英文讀教材（#3、#4），也沒有說是單一網站的自願填答者。限制節有寫。
3. **摘要把「偏好英文原文」那一類略掉**：摘要列了四種想要（簡化英文、圖與多媒體、文化中立的範例、內嵌字典），沒有列 Table 4 的第五類「寧可讀英文、不要翻譯版」（7%）。內文說這一類不算想要，但它是直接和「該不該翻譯」有關的結果。

另外兩處內文用詞要留意，不是摘要的問題：

- 討論節把合併的比例寫成「reported by 31% of all respondents as a barrier」（L869）。分母其實是有回答第 5 或第 6 題的人（178 + 384 = 562），不是全部 840 位受訪者。同一個數字在結果節寫的是「34% of all responses」（L504），用詞是 responses。
- 「讀教材 34%」我用 Table 3 的兩欄加權回算是約 33%（35% × 384 加 29% × 178，除以 562）；差距在四捨五入的範圍內，原文沒有給原始人數，無法確定。

## 與清單「要撐的結論」不合的地方

清單那一句：「非英語母語者讀英文教材卡在哪、想要什麼」。

撐得住，但只能當成「一群英文程度不錯、自己上網學程式的人怎麼說」，而且有幾處要改寫或補上：

1. **這是自述與旁觀，不是測量**。沒有任何一項量過理解、學習成果或閱讀時間。「卡在哪」是受訪者回想的困難；「想要什麼」是他們認為會有幫助的做法。Table 4 的 21% 想要內嵌字典，不能寫成「內嵌字典有幫助」。
2. **百分比的分母要寫對**。障礙的 35%、24%、16%、11%、17% 是 384 位有回答第 6 題的非母語者（非母語者的 59%）；想要的 36%、23%、21%、21%、7% 是 464 位有回答第 7 題的人。這些是「開放式回答裡提到這一類」的比例，沒提不代表沒有這個困難。
3. **樣本是英文好的人**。83% 自評 Proficient 或 Fully Fluent，96% 已經在用英文讀教材。文章若要拿它談「中文讀者讀英文教材」，要說明這份資料看不到英文程度低或只讀母語教材的人；作者自己也這麼說（L383–385）。
4. **「讀教材」只是五類之一**。清單寫「讀英文教材卡在哪」，原文的五類障礙還有聽與說、讀程式碼、寫程式碼、同時學兩樣。和教學文章直接相關的是「讀教材」與「讀程式碼」兩類。
5. **翻譯那一類方向相反，清單沒提**。有 7% 的回應表示寧可讀英文、不要翻譯版，理由是術語被翻譯後反而混淆、翻譯版過時（#14、#32、#40、#41）。這對本站「術語要不要中英並列」「要不要翻」直接相關：這群受訪者抱怨的是把術語翻掉，想要的是讀原文時就地查得到字。但要連著樣本偏向一起寫：會這樣說的本來就是選擇讀英文的人。
6. **和記號／術語那一篇（order 4）對得上的具體內容**，都是個別受訪者的話，沒有數字：一個術語可以糊掉整句（#16）；術語在程式裡的意思和日常英文不同要先說（#34）；先把關鍵字交代清楚再教概念（#26，這是母語者教別人的經驗）；縮寫的識別字看不出意思（#21）；cultural reference 要查（#33）。引用時要標明是受訪者的說法。
7. **有些障礙不是非母語者才有**。作者在討論裡自己說，or、while、instance、object 這類混淆連英文母語的學習者也有（L941–947）。所以不能把 #19、#20 寫成語言隔閡造成的。
8. **「簡化英文也幫到母語者」是作者的主張**（L932–935），這份研究沒有資料支持，不能當結果引。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–40 | 標題、作者、摘要、關鍵字、導言開頭、版權聲明 |
| 2 | L40–599 | 版權頁、Figure 1（L46–60）、導言、Background and Related Work、Methodology（網站、問卷八題、資料概況與分析）、Table 1–2（文字版已打散）、Study Design Limitations、Language Backgrounds、Table 3、障礙五類的前三類與第四類開頭之前 |
| 3 | L599–1487 | 讀程式碼末段、寫程式碼、同時學兩樣、怎麼克服、Table 4、想要的五類、Table 5、學程式對英文的幫助、Discussion（七點、普遍設計、推廣性與未來研究、功利目的之外）、Conclusion、致謝；L1028–1486 參考文獻（81 筆，掃過；第 70 筆就是 Stefik 與 Siebert 2013） |

對過 PDF 版面的表：

- PDF 第 3 頁：問卷八題與 Data Overview，與文字版相符。
- PDF 第 4 頁：Table 1（三欄各十列）、Table 2（兩欄各十列）。文字版把欄位打散，上面 #1–3、#5–6 的數字全部依 PDF 版面抄。
- PDF 第 5 頁：Table 3，逐格對過。
- PDF 第 6 頁：讀程式碼到「怎麼克服」開頭，與文字版相符。
- PDF 第 7 頁：Table 4，逐列對過。
- PDF 第 8 頁：Table 5，逐列對過。

原文沒有附錄。Figure 1 是一段 Python 的 sqlite3 範例程式（PDF 第 1 頁），文字版是字母間帶空格的版本，內容讀得出來，沒有另外看圖。
