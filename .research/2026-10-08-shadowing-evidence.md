# Research: 跟讀法（shadowing）對練口說有沒有用

訪問日一律 2026-10-08。這份紀錄對應文章 `src/content/posts/learning/2026-10-08-shadowing-evidence.md` 與它的英文版。

## 子問題

1. 跟讀法的定義與來源（口譯訓練、日本的英語教學研究、Alexander Arguelles）。
2. 研究支持它改善什麼、不支持什麼；證據的限制。
3. 中文文章的流行說法與研究之間的落差（要有實際例子）。
4. 不同社群是否都推薦跟讀（重新確認 Reddit r/languagelearning 的 FAQ 與指南）。
5. Arguelles 自己的做法和「跟著影片唸」差在哪。
6. 回音法、聽了再重複和跟讀的差別。
7. 想練口說的人該怎麼用。

## 讀取工具實測

| 工具 | 這次的結果 |
| --- | --- |
| curl 加瀏覽器 UA | GitHub raw、wgtn.ac.nz 的 PDF、台大 PDF、British Council English Online、alexanderarguelles.com、mondecast.com、網頁存檔、PTT 以外的多數中文與日文網站可讀。tandfonline、ingentaconnect、sagepub 回 403；learnenglish.britishcouncil.org 連線失敗；erudit.org 回「Making sure you're not a bot」的檢查頁（HTTP 200 但不是內容） |
| Exa `web_fetch_exa` | tandfonline 全文、ingentaconnect 全文（Foote & McDonough 的整篇論文）、learnenglish.britishcouncil.org、sagepub 的摘要頁都讀到。erudit 回 SOURCE_NOT_AVAILABLE；sagepub 其中一頁逾時 |
| Tavily `tavily_extract` | 單獨送 Reddit FAQ 網址，回傳部分正文（不是整頁） |
| Tavily `tavily_search` | 用來找中文與日文的流行說法；結果只當線索，引用前另外抓原頁 |
| 網頁存檔 | Reddit wiki 的四頁、Arguelles 舊網站都靠它 |
| Crossref API | Hamada (2019) 的摘要 |
| Firecrawl、Jina | 沒有用到 |

## 來源表

| # | 來源 | 類型 | 讀取工具 | 讀取範圍 |
| --- | --- | --- | --- | --- |
| S1 | Whitworth & Rose (2025), A Systematic Review of Research on the use of Shadowing for Second Language Pronunciation Teaching. https://www.tandfonline.com/doi/full/10.1080/29984475.2025.2546827 | 系統性回顧（期刊論文，Pages 239-269） | curl 403 → Exa | ✅ 全文（摘要到結論；表格與圖的內容沒有被擷取，只有標題；參考文獻只看了與本題有關的條目） |
| S2 | Foote & McDonough (2017), Using shadowing with mobile technology to improve L2 pronunciation. *Journal of Second Language Pronunciation* 3(1), 34–56. https://www.ingentaconnect.com/content/jbp/jslp/2017/00000003/00000001/art00003?crawler=true&mimetype=application%2Fpdf | 實驗研究 | curl 403 → Exa | ✅ 全文（含方法、結果兩張表、討論、限制、附錄） |
| S3 | Foote (2017), Shadowing: A useful pronunciation practice activity. https://www.pronunciationforteachers.com/uploads/6/0/5/9/60596853/teaching_techniques_shadowing_jfoote.pdf | 研究者寫給教師的三頁說明 | curl + pdftotext | ✅ 全文 |
| S4 | Hamada (2016), Shadowing: Who benefits and how? *Language Teaching Research* 20(1). https://journals.sagepub.com/doi/10.1177/1362168815597504 | 實驗研究 | curl 403 → Exa | 🟡 只讀到摘要與參考文獻（付費牆） |
| S5 | Hamada (2019), Shadowing: What is It? How to Use It. Where Will It Go? *RELC Journal* 50(3). https://journals.sagepub.com/doi/10.1177/0033688218771380 | 回顧文章 | curl 403、Exa 逾時 → Crossref API | 🟡 只讀到摘要 |
| S6 | Kehoe-Seamons, Tanner, Hartshorn & Martinsen (2026), The Effect of Text Shadowing on English Language Learners' Pronunciation Development: A Quasi-Experimental Study. *Language Teaching Research*. https://journals.sagepub.com/doi/10.1177/13621688261462581 | 準實驗研究，有對照組 | curl 403 → Exa | 🟡 只讀到摘要與參考文獻 |
| S7 | Lambert (1992), Shadowing. *Meta* 37(2), 263–273. https://www.erudit.org/en/journals/meta/1992-v37-n2-meta339/003378ar/ | 口譯研究 | curl（機器人檢查頁）、Exa（SOURCE_NOT_AVAILABLE）、網頁存檔（404） | 🔴 未讀。文章只以「S1 引用它」的方式提到 |
| S8 | Alexander Arguelles 舊網站 Foreign Language Expertise 的自學頁（頁面標示 Last updated: 25 March 2010）。https://web.archive.org/web/20160106172408/http://www.foreignlanguageexpertise.com/foreign_language_study.html | 提出者自己的說明 | 網頁存檔（2016-01-06 快照）+ curl | ✅ 全文（Shadowing 與 Scriptorium 兩節） |
| S9 | Arguelles, Roadmap for Language Study. https://www.alexanderarguelles.com/question-answer/roadmap-for-language-study/ | 讀者 Stephen Harris 整理、Arguelles 修訂並回覆認可的學習路線 | curl | ✅ 全文 |
| S10 | Arguelles, Shadowing Step by Step（YouTube 影片）https://www.youtube.com/watch?v=130bOvRpt24 | 影片 | 沒有嘗試 | 🔴 未看。清單裡「每次約三十分鐘、每天加一課」出自這支影片，我沒有確認，文章沒有用 |
| S11 | 史嘉琳，〈提升聽力秘訣：每天請聽「回音」十分鐘〉（上）（下）。https://homepage.ntu.edu.tw/~karchung/pubs/CET6970.pdf | 學者發表在教學刊物的文章 | curl + pdftotext | ✅ 全文。PDF 內沒有看到刊登日期 |
| S12 | Karen Chung, How to use the "Echo Method" to learn to speak English（TEDxNTUST，2018 年 10 月）。https://www.ted.com/talks/jan_2018_47dcaf8d-b6df-4a6b-9922-4712d6bebf59 | 演講 | Exa | 🟡 只讀到頁面的簡介，沒有逐字稿。文章沒有引用演講內容 |
| S13 | byoungd/up〈口语篇：让意思清楚到达〉。https://github.com/byoungd/up/blob/master/docs/threads/part-1/5-speaking.md | GitHub 上的學習指南 | curl（raw.githubusercontent.com）；星數用 GitHub API 查 | ✅ 全文（十二節與來源）。星數 67,812 |
| S14 | Paul Nation, What do you need to know to learn a foreign language?（2014-08-11 版）。https://www.wgtn.ac.nz/lals/resources/paul-nations-resources/paul-nations-publications/publications/documents/foreign-language_1125.pdf | 學者寫給學習者的書 | curl + pdftotext | 🟡 全書轉成文字後搜尋 shadow（0 次）；讀了二十項活動的表、第四章口說部分、發音一節、4/3/2 一節。其餘章節沒有逐頁讀 |
| S15 | Paul Nation (2018), Keeping it practical and keeping it simple. *Language Teaching* 51(1). https://www.wgtn.ac.nz/__data/assets/pdf_file/0008/1882088/2018-keeping_it_practical_and_keeping_it_simple.pdf | 學者的回顧文章 | curl + pdftotext | 🟡 讀了談四股與常識判斷的段落（第 140–141 頁） |
| S16 | British Council, How to improve your English speaking. https://learnenglish.britishcouncil.org/level/improve-your-english-level/how-improve-your-english-speaking | 機構的學習建議 | curl 連線失敗 → Exa | ✅ 正文全文（四個建議） |
| S17 | British Council English Online, 8 Practical Ways to Practise Speaking English. https://englishonline.britishcouncil.org/blog/articles/8-practical-ways-to-practise-speaking-english/ | 機構的部落格 | curl | ✅ 正文全文（八個做法） |
| S18 | r/languagelearning wiki FAQ。https://www.reddit.com/r/languagelearning/wiki/faq | 社群 FAQ | 網頁存檔兩個快照：old.reddit 2022-01-23（約 15 萬字元，含頁面兩種呈現）、www.reddit 2025-07-24（約 8.4 萬字元）；Tavily 讀現行頁只回部分正文 | 🟡 兩個快照全文搜尋 shadow 都是 0 次；逐段讀了談對話、發音、Benny Lewis 的幾節。現行頁沒有讀到整頁 |
| S19 | r/languagelearning wiki 指南頁。https://www.reddit.com/r/languagelearning/wiki/guide | 導覽頁 | 網頁存檔 2024-10-08 快照 | ✅ 全文。搜尋 shadow 0 次 |
| S20 | sajforbes, How To Learn a Foreign Language。https://mondecast.com/language-guide/introduction/ 與 before-you-start、activities、resources、routine | Reddit 版主寫的指南，線上版五章 | curl | 🟡 五章全文都抓下來搜尋 shadow（0 次）；逐段讀了 activities 章與 resources 章的課程部分。wiki 頁提到指南還有中階主題與附錄，線上版的 activities 章也提到「Chapter 12」，這些我沒有找到、沒有讀 |
| S21 | r/languagelearning wiki 資源表。https://www.reddit.com/r/languagelearning/wiki/resources | 社群資源表 | 網頁存檔 2026-01-30 快照 | 🟡 全文搜尋 shadow 0 次；搜尋 Arguelles 出現三處（Babel No More 書介、Polyglot Conference、他的一篇閱讀文章）。沒有逐段讀 |
| S22 | VoiceTube〈【英文口說】一起學會跟讀法 Shadowing，讓你說出標準英文！〉https://tw.blog.voicetube.com/archives/46230/ | 台灣英語學習平台的部落格 | curl | ✅ 全文 |
| S23 | PREP〈什麼是 Shadowing 跟讀法？5 步驟提升英文口說與聽力〉https://prepedu.com/zh-hant/blog/shadowing-technique | 考試準備平台的部落格 | curl | 🟡 讀了開頭、原理與結論各段；中段的步驟教學只掃過 |
| S24 | TutorABC〈英文口說流利度怎麼練？Shadowing、詞塊法與 12 週訓練計畫〉https://www.tutorabc.com/blog/zh-tw/post/68436 | 線上英語教學業者的部落格 | curl | 🟡 讀了談 Shadowing 的段落與小標 |
| S25 | 104 學習〈「影子跟讀法」介紹〉https://nabi.104.com.tw/posts/nabi_post_1d53ffcb-07ac-4356-8fa4-3860a430fae4 | 學習平台的貼文 | curl | ✅ 全文（短文） |
| S26 | 創勝文教〈影子跟讀法這種練習怎麼做？有效 Shadowing 的 4 大要件〉https://ntetaiwan.com/blog/article-20231124/ | 台灣補教業者的文章 | curl | ✅ 全文 |
| S27 | VoiceTube〈科技人必學！提升英文口說力的 5 大實用方法〉https://tw.blog.voicetube.com/archives/86106/tech-english-speaking-method | 九月那篇文章引用的來源 | curl | 🟡 讀了「聽力回音學習法」一節與頁尾延伸閱讀 |
| S28 | 空中美語〈Shadow Reading 影子跟讀法 英聽口說進步魔法〉https://www.amconline.com.tw/web/blog/article.aspx?id=1909 | 補教業者的部落格 | curl | ✅ 全文。文章沒有引用，列在備用例子 |
| S29 | サイマル・アカデミー〈英語上達のコツ「シャドーイング」とは〉https://www.simulacademy.com/column/tips/shadowing | 日本口譯學校的文章 | curl | 🟡 讀了定義與效果兩節 |
| S30 | The Past〈シャドーイングは意味ない？〉https://thepast.jp/column/english-shadowing-imi-nai | 日本英語教練業者的文章 | curl | 🟡 讀了起源一節與結論。文章沒有引用，只當成「日文圈也有保留看法」的線索 |
| S31 | 站上九月的文章 `src/content/posts/learning/2026-09-03-work-english-speaking-tips.md` | 自己的舊文 | 本機檔案 | ✅ 跟讀與回音法兩段 |
| S32 | 練習區程式 `src/components/EnglishSpeaking/EnglishSpeaking.tsx` | 自己的程式 | 本機檔案 | 🟡 只搜尋介面文字，確認有錄音對照、小抄、再練一次、對話扮演與再演一次，沒有跟讀 |

清單第八節列的其他推薦清單（Programmer's Guide、Ask HN 兩則、PTT 兩篇與精華區、Stack Exchange 等）這次沒有重讀。文章提到「七份清單提到跟讀」時，寫明那是先前的統計。

## 事實與出處對照

只放來源說了什麼。引號內是逐字原文。

| 事實 | 出處 | 狀態 |
| --- | --- | --- |
| 跟讀原本是訓練初學口譯員同時聽與說的方法；語言學習上最早的發表是 1990 年代 Tamai 用來訓練日本英語學習者的聽力 | S1 前言：「Originally developed to train beginner interpreters for the cognitively challenging task of listening and speaking simultaneously (Lambert Citation 1992), the first published accounts of the application of the technique in a language learning context were in the 1990s, when Tamai (Citation 1992; Citation 1997) applied the method to help train listening skills amongst Japanese learners of English.」 | ✅（Lambert 與 Tamai 的原文沒讀，屬轉引） |
| 標準的跟讀是不看稿、聽短音檔、盡量同時複述 | S1：「The technique involves listening to a short audio text, without a script, and repeating what is heard as simultaneously as possible.」 | ✅ |
| 跟讀和聽了再重複不同，後者的延遲較長 | S1：「This focus makes the technique different to classical listen-and-repeat exercises, which involve a more prolonged lag between stimulus and repetition.」 | ✅ |
| 跟讀的研究大多在練聽力 | S1：「To date, most of the research on shadowing has focused on its application as a tool to train listening skills (Hamada Citation 2021).」；S2 前言也說多數研究關心聽力理解 | ✅ 兩源 |
| 回顧搜尋六個資料庫，納入 44 篇 | S1 摘要：「Six databases were searched for eligible studies, with a total of 44 studies included after screening.」 | ✅ |
| 44 篇裡 8 篇其實沒有用跟讀（用的是單字或單字元的延遲複述），另有 2 篇學位論文與期刊論文重複，實際描述 34 篇 | S1：「a total of 34 studies, rather than the original 44, are described in the sections that follow」 | ✅ |
| 直接探討發音改善的是 26 篇 | S1：「A total of 26 studies directly explored how shadowing can improve learner pronunciation」 | ✅ |
| 結論：能改善可理解度、清晰度、口音程度與流暢度；韻律的證據較保留；個別音沒有定論 | S1 結論：「Results suggest that shadowing can help improve comprehensibility, intelligibility, accentedness, and fluency. There is also evidence to suggest, albeit more tentatively, that shadowing can help develop specific elements of prosodic control」；摘要：「Research into the impact of shadowing on segmental pronunciation control was, however, inconclusive.」 | ✅ |
| 8 篇測流暢度的研究都回報進步 | S1：「All eight studies related to fluency reported positive results.」 | ✅ |
| 31 篇有測發音的研究裡，20 篇只用受控作業，4 篇只用即席作業，4 篇兩種都用，4 篇不明 | S1：「with 20 studies employing controlled tasks only. Four studies used only spontaneous tasks, and four studies used a combination of controlled and spontaneous tasks. In a further four studies, the task used was unclear.」 | ✅ |
| 受控作業的進步未必轉移到真實口說 | S1：「improved performance in controlled tasks, such as read-aloud tests, may not directly translate into meaningful improvement in real-world speaking」 | ✅ |
| 只有一篇研究做了延後測驗 | S1：「only one study in the sample (Hori Citation 2008) included a delayed post-test」 | ✅ |
| 幾乎沒有研究拿跟讀和其他發音教法比較，所以無法斷定它比其他方法有效 | S1：「there was an absence of literature comparing shadowing to other common pronunciation teaching methods, with only one study (Yavari and Shafiee Citation 2018) comparing shadowing to another technique described as ‘tracking'. Without this evidence base it becomes impossible to definitively elucidate the effectiveness of shadowing as a pedagogical technique compared to other pronunciation teaching approaches」 | ✅ |
| 研究集中在亞洲：亞洲 20 篇，其中日本 10、台灣 6；27 篇的學習目標語是英語 | S1：「a large number of studies were conducted in Asia (n = 20), particularly in Japan (n = 10) and Taiwan (n = 6)」「The majority of studies involved participants learning English as an L2 (n = 27)」 | ✅ |
| 跟讀目前在亞洲流行 | S1：「shadowing is currently popular in Asia and, as such, much research to date has been conducted with Asian learners (Kadota Citation 2019)」 | ✅（Kadota 原書沒讀） |
| 回顧只收英文論文，作者承認可能漏掉日文研究 | S1 限制一節 | ✅ |
| S1 內部有一處數字不一致：全面性指標一節寫「Ten out of eleven studies (90%) reported positive results, with only one study (Hori 2008) reporting no improvements」，討論一節寫「seven out of nine studies reporting positive results」 | S1 | ⚠️ 兩處對不上，文章沒有用這兩個比例 |
| Foote & McDonough：招募 22 人、16 人完成；八週；每週至少四次、每次至少十分鐘；素材是情境喜劇的一分鐘左右對話，附文字稿與影片連結 | S2 方法 | ✅ |
| 測驗兩種：跟讀作業，以及看圖說故事（The Suitcase Story），後者取開頭 20 秒，由 22 位英語母語者評分 | S2 方法 | ✅ |
| 結果：模仿能力、可理解度、流暢度顯著進步，口音程度沒有 | S2：「the participants improved significantly on all speaking measures apart from accentedness」；可理解度平均 653.05 → 682.69（1–1000 分） | ✅ |
| 沒有對照組、受試者自願報名且有領酬勞 | S2：「due to participant self-selection and a lack of a control group, the results must be interpreted with caution.」 | ✅ |
| 作者說不能取代課堂的發音教學 | S2：「there is not sufficient evidence to suggest that shadowing alone can help learners improve all aspects of speech that may impact comprehensibility.」 | ✅ |
| 受試者是在蒙特婁就讀英語授課大學的進階學習者，多數同時在上 ESL 課 | S2 方法與限制 | ✅ |
| Hamada (2016)：43 位日本大學生、九堂課；音素感知兩組都進步，只有低程度組的聽力題分數進步 | S4 摘要 | 🟡 摘要 |
| Hamada (2019)：建議初學者先用跟讀練聽力，再進到用跟讀練口說 | S5 摘要：「beginner level learners should start from shadowing for listening and proceed to shadowing for speaking」 | 🟡 摘要 |
| Kehoe-Seamons 等 (2026)：十週、中級學習者、有對照組；兩組都進步，組間沒有統計差異 | S6 摘要：「the analysis showed no statistical difference between the groups in any of the four measures」 | 🟡 摘要 |
| Arguelles 稱跟讀為「my technique」，定義是邊聽邊同時複述一份雙語對照教材附的錄音 | S8：「my technique of shadowing or listening to and simultaneously echoing a recording of foreign language audio that accompanies a manual of bilingual texts」 | ✅ |
| 他的三個要點：戶外快走、挺直、大聲清楚 | S8：「1. Walk outdoors as swiftly as possible. 2. Maintain perfectly upright posture. 3. Articulate thoroughly in a loud, clear voice.」 | ✅ |
| 每次 15 分鐘大概最理想，可從 5 或 10 分鐘開始，最多到 30 分鐘 | S8：「15 minute sessions are probably ideal, though you may want to start with only 5 or 10 and you may work up to 30」 | ✅ |
| 路線圖把跟讀放在第一階段（跟讀第一本入門教材），最後一個階段是大量閱讀，標為目標 | S9：「PHASE 1: Shadowing Your First Introductory Manual」「PHASE 6: Extensive Reading (The Goal)」 | ✅ |
| British Council 的文章把跟讀說成 Arguelles 發展的技巧，並說不要暫停音檔 | S17：「For shadowing to work best, don’t stop the audio before you repeat the words. Try to keep up. Why? Because this is the technique developed by linguist Alexander Argüelles」 | ✅ |
| British Council 另一篇的四個建議沒有跟讀 | S16：開口用、找人對話、錄音、練聽力 | ✅ |
| 回音法：一次播四到五個字、暫停、先聽心裡的回音再模仿；每天十分鐘 | S11 步驟 4–8 | ✅ |
| 史嘉琳對照的是傳統的「跟著念」，文章沒有出現 shadowing 這個字 | S11 | ✅ |
| 史嘉琳的依據是教學經驗，文章沒有引用實驗 | S11：「依照教學多年的經驗」；提到 Echoic Memory 但沒有引用研究 | ✅ |
| up：跟讀負責觀察和模仿，複述、追問與協作才負責生成；五級練法 | S13 速覽與第 6 節 | ✅ |
| up 的來源是 Derwing & Munro (2005)、Levis (2005)、Saito (2012)，沒有引用跟讀的研究 | S13 來源與邊界 | ✅ |
| Nation 的二十項活動沒有跟讀；口說有背句子或對話、角色扮演、準備過的短講、4/3/2 | S14 活動表；全書搜尋 shadow 0 次 | ✅ |
| Nation 的書提到反覆模仿電影片段有助發音 | S14：「repeatedly imitating clips from movies can help with pronunciation」 | ✅ |
| 角色扮演演完檢討、立刻再演一次 | S14 Activity 4.2 | ✅ |
| 四股各佔等份沒有研究證據 | S15：「There is no research evidence to support this equal division of the teaching and learning time, and the research and advocacy on comprehensible input go against it.」 | ✅ |
| Reddit FAQ、指南頁、指南線上版五章、資源表都搜尋不到 shadow | S18–S21 | ✅（範圍見來源表） |
| 指南把對話練習稱為最好的練習之一，建議佔 0–10% | S20：「One of the best language exercises you can do is conversation practice with a native speaker.」「Conversation practice: ~0–10%」 | ✅ |
| 指南推薦「聽了再重複」的課程給要旅行或重視溝通的人 | S20 resources 章 | ✅ |
| VoiceTube：跟讀由 Arguelles 發明 | S22：「跟讀法的起源是由一位知名美國教授 Alexander Argüelles 所發明。」 | ✅ |
| PREP：被驗證為最有效的主動訓練法之一；Arguelles 是學術奠基者 | S23：「目前已被全球無數語言學習者驗證為提升口說流暢度最有效的主動訓練法之一」「Shadowing 跟讀法的學術奠基者是美國語言學家 Alexander Arguelles 教授」 | ✅ |
| TutorABC：小標稱它是流利度訓練最有效的方法之一；內文說最早用在口譯訓練 | S24 | ✅ |
| 104 學習：由日本語言學家井上敏明在 1980 年代提出 | S25：「這種方法由日本語言學家井上敏明在1980年代提出」 | ✅ 原文如此；我讀到的研究文獻沒有這個名字 |
| 創勝文教：跟讀主要用來練聽力，可能輔助口說 | S26：「影子跟讀法 (Shadowing) 這種主要用來練習聽力的方法」 | ✅ |
| VoiceTube 的回音學習法一節沒有寫出處，頁尾延伸閱讀有一篇史嘉琳 Echo Method 的文章 | S27 | ✅ |

## 清單第八節的說法，重新確認後不符或需要補充的地方

1. **「納入 44 篇研究」是對的，但實際拿來分析的是 34 篇。** 8 篇被回顧作者判定沒有用到真正的跟讀，2 篇重複。直接談發音改善的是 26 篇。
2. **「跟讀能改善可理解度、流暢度與韻律」少了兩項。** 回顧的結論還包括 intelligibility 與 accentedness（聽起來多接近母語者）；韻律的證據作者特別標為較保留。
3. **回顧的題目是發音，不是口說能力。** 清單寫成「跟讀法用於發音教學的系統性回顧」是對的，但「對練習區與文章的含意」把它當成口說的證據來用，範圍要縮小。
4. **Foote & McDonough 的「16 人」是完成人數，招募 22 人；沒有對照組。** 「即席口說」是看圖說故事取開頭 20 秒，不是對話。清單沒寫這幾點。
5. **Arguelles 的「每次約三十分鐘」和他網站寫的不同。** 網站寫 15 分鐘大概最理想、最多到 30 分鐘。清單的數字出自影片，我沒有看影片，無法判斷影片怎麼說。
6. **史嘉琳的文章對照的是「跟著念」（聽了再重複），不是跟讀。** 清單寫「和跟讀的差別是聽完先停一下」，是整理者自己的對照。文章標題談的是聽力。
7. **「Reddit 的 FAQ 與指南完全沒提 shadowing」確認成立**，資源表也沒有。但我讀到的 FAQ 是兩個存檔快照（2022 與 2025），現行頁只讀到一部分。指南線上版只有五章，後面的章節沒有找到。
8. **「跟讀在華語與日語學習圈特別流行，可能不是普遍的共識」這個推論，Reddit 的 FAQ 撐不起來。** 比較直接的依據是回顧本身寫的「currently popular in Asia」和研究地點的分布。另外 Arguelles 是美國人，他的跟讀在英語的多語學習圈有名；Tavily 的搜尋結果裡也出現 r/languagelearning 討論跟讀的貼文（只看到標題，沒讀）。所以只能說「FAQ 與指南沒有收」，不能說英語社群不用。
9. **British Council 那篇把跟讀歸給 Arguelles**，和回顧寫的口譯訓練來源不一致。清單只記了「明寫是 Arguelles 發展的方法」，沒有標出這個不一致。
10. **九月的文章說回音學習法「只有 VoiceTube 一個來源提出」**，其實出處是史嘉琳。這是舊文的問題，這次沒有改舊文，只在新文章交代。
11. **dailynotes 那篇**，清單寫「引用的研究沒有給出處」。我只搜尋了該頁的關鍵字，看到它提到「2025 年一篇整理了近三十年研究的系統性回顧」但沒有連結或作者名。沒有細讀，文章沒有引用它。

## 流行說法的實例

找的方法：Tavily 搜尋中文關鍵字（跟讀、影子跟讀法、最有效、研究證實），再用 curl 抓原頁確認句子。這是便利取樣，不能代表中文文章的整體。

| 說法 | 出處 | 對照 |
| --- | --- | --- |
| 「跟讀法的起源是由一位知名美國教授 Alexander Argüelles 所發明。」 | S22 VoiceTube | S1 寫來源是口譯訓練；Arguelles 自己稱「my technique」，指的是他那一套做法 |
| 「目前已被全球無數語言學習者驗證為提升口說流暢度最有效的主動訓練法之一」 | S23 PREP | S1 說沒有和其他教法比較的研究，無法斷定相對效果 |
| 「Shadowing 跟讀法的學術奠基者是美國語言學家 Alexander Arguelles 教授」 | S23 PREP | S1 的研究脈絡是 Lambert、Tamai、Kadota、Hamada，沒有引用 Arguelles |
| 小標「Shadowing 是什麼？為什麼它是流利度訓練最有效的方法之一？」 | S24 TutorABC | 同上；同一篇的來源說明（口譯訓練）和 S1 一致 |
| 「這種方法由日本語言學家井上敏明在1980年代提出」 | S25 104 學習 | 我讀到的文獻沒有這個名字；S1 寫語言學習上最早的發表是 Tamai 1992 |
| 「練習口語最好的方法就是 跟唸 (Shadow Reading)。」 | http://www.scs.or.kr/chou/201705235.pdf（一份中文講義，作者不明） | 沒有引用研究。文章沒有用這個例子，因為查不到作者與出處 |

**沒有找到的：** 任務說明裡舉的「研究證實是最有效的單一練習」這種字面說法，我沒有找到原句。找到的是「最有效的方法之一」「被驗證為」「效果備受學界認可」這類寫法，以及把來源歸給單一個人的寫法。文章照實際找到的句子寫。

另外兩個只在搜尋結果看到、抓了原頁確認句子但沒有放進文章的例子：18kenglish.com「跟讀法由多語學者 Alexander Arguelles 推廣，是訓練口說流暢度與聽力的最強方法之一」；happylandedu.com「影子跟讀法最初由語言學家Alexander Arguelles推廣，效果備受學界認可」。

## 我的推論（與上表分開）

| 推論 | 依據 | 可能錯在哪 |
| --- | --- | --- |
| 跟讀適合拿來練節奏、語調與「把已經會的句子說順」，不適合當成練對話的主要方法 | S1 的結論與限制；S2 作者自己的保留；S13 的區分；跟讀時內容與詞序都由音檔決定 | 沒有研究直接比較「跟讀」與「對話練習」對自然對話的效果。這是從缺少證據推出來的，不是有證據顯示無效 |
| 有對照組的研究沒看到組間差異，代表沒有對照組的研究可能高估了效果 | S6 摘要；S2 自己承認沒有對照組 | S6 只讀到摘要，不知道樣本數與對照組在做什麼；單一研究 |
| 中文文章把跟讀歸給 Arguelles，可能是幾篇文章互相參考 | S17（British Council）與 S22、S23 的說法相近 | 沒有查這些文章的寫作時間與彼此的引用關係，純屬猜測，文章沒有寫 |
| 跟讀在亞洲比較流行 | S1 的敘述與研究地點分布；清單裡中文清單多數提到跟讀 | 研究地點多在日本與台灣，也可能只是研究者在那裡，不等於學習者比較常用 |
| 回音法介於跟讀與聽了再重複之間 | S11 的步驟、S1 對兩者的區分 | 史嘉琳沒有這樣定位自己的方法；沒有讀到比較回音法與跟讀的研究 |
| 練習區沒做跟讀是合理的取捨 | 上面第一條推論；S14、S20 對主動回想與角色扮演的建議 | 練習區的做法本身也沒有經過效果驗證 |

## 沒查到或不確定的

- Lambert (1992)、Tamai (1992; 1997)、Kadota (2019) 的原文都沒有讀，全部是 S1 的轉引。
- Hamada 的兩篇、Kehoe-Seamons 等 (2026) 只讀到摘要。
- Arguelles 的影片沒看。
- 史嘉琳的 TEDx 演講沒有逐字稿，文章只引用她的書面文章。
- 沒有找日文的研究論文；日文方面只讀了兩篇業者的文章，沒有放進正文的論證。
- 史嘉琳文章的刊登日期沒有查到。
