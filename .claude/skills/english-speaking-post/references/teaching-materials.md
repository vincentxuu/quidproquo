# 可參考的教材與來源清單

擬句子之前先查這份清單，看這個情境教材教哪些功能、用哪些說法，再對照使用者的真實場面。教材沒有涵蓋的，才回到 [source-selection.md](source-selection.md) 的字典做法。

2026-10-08 整理並逐一讀過。**只有讀過正文、確認內容有用的來源才列在主表**；讀了發現只是入口頁的另外標示；讀了不適用的移到文末「讀過後排除」，附理由，避免下次又加回來。

## 維護這份清單的規則

這三條都是 2026-10-08 被使用者指出的錯誤換來的：

1. **沒讀正文不能列入。** 第一版把一百多個只確認「網址有回應、標題正確」的來源列成可參考，讀過之後有二十多個是首頁新聞、行銷頁或已停辦的服務。新增來源時，先讀到實際內容再寫進來，並寫明讀了哪一頁、讀到多少。
2. **不能只試直接請求就說讀不到。** 第一版把二十多個來源標成「擋」，其實只試過 curl；換 Exa 幾乎全部讀得到，還有幾個是網址猜錯。標「讀不到」前，依序試直接請求、Exa `web_fetch_exa`、Tavily `tavily_extract`（一次一個網址）、Firecrawl、網頁存檔的快照，並寫出試過哪些。網址 404 先搜尋正確網址。回傳 200 不代表讀到了，要看內容是不是登入頁或空殼。
3. **來源要多元且有指標性代表。** 每個情境的類別要分散（語言教材、官方定義、組織規範、政府或大學指引、社群資源），地區要分散，並說得出為什麼有代表性。只因為搜尋到而選的，標成便利取樣。

## 怎麼用

1. 依情境從各類別各挑至少一個，共 3–5 個以上。記下選了哪些、哪些想讀但讀不到。
2. 讀正文，列出各來源在這個情境教的功能，做成「功能 × 來源 × 現有卡片 × 使用者場面」對照表。
3. 同一個說法在兩個以上來源出現的，優先做成卡片；卡片與 evidence 寫明出自哪幾個來源。
4. 教材原句標 direct；依教材句型改寫標 adapted。教材沒有的句子用字典做法補，並在文章交代。

數來源時只能寫「這次讀的 N 個裡有 M 個」，不能寫成「多數教材」。教材的整段對話不能照搬；單句與常用說法可以引用並標出處，文章裡的對話自己寫並標為練習示例。書面規範不能直接當成口頭說法的依據。

## 讀取工具實測（2026-10-08）

| 工具 | 結果 |
| --- | --- |
| Groundlane | 這個 session 沒有掛載；直接 HTTP 回 401 |
| 直接請求（curl 加瀏覽器 UA） | BBC、VOA、Oxford Learner's、Longman、多數工程文件與政府網站可讀；British Council、Cambridge、Merriam-Webster、Collins、REI、theCrag、多數衝浪網站被擋 |
| Exa `web_fetch_exa` | 被擋的幾乎都讀得到；可批次、可設字數上限。搜尋 `web_search_exa` 也會回傳大段正文 |
| Tavily `tavily_extract` | 可用，但同批多個網址只回傳了一個，要一次送一個 |
| 網頁存檔（web.archive.org） | 直接組快照網址可讀；Reddit 的 wiki 靠它讀到。查詢快照清單的介面當時在限流 |
| Firecrawl | 可用，帳號額度偏低 |
| Jina `read_url` | 全部回 HTTP 402 |

## 一、通用英語教材

### 讀過、有可用內容

| 來源 | 地區 | 讀了什麼 | 實際內容 |
| --- | --- | --- | --- |
| [BBC Real Easy English](https://www.bbc.co.uk/learningenglish/english/features/real-easy-english) | 英 | 機場一集（2026-10-02）整頁 | 兩人用簡單英文聊機場，附詞彙表：check in、boarding pass、go through security、boarding gate、catch／miss a flight。是閒聊，不是櫃檯對話 |
| [VOA Let's Learn English](https://learningenglish.voanews.com/z/4729) | 美 | 第 3、10、23 課的對話稿 | 完整對話。第 3 課 *Is there a supermarket near here?*；第 10 課指路 *turn right… walk straight ahead*；第 23 課點餐 *I'll have the shrimp*、*You're out of chicken* |
| [VOA: Words to Travel With](https://learningenglish.voanews.com/a/words-to-travel-with-part-1/4687812.html) | 美 | 整頁 | 旅行片語動詞附解說：check in、check into、pick up、take off、get in、drop off |
| [Premier Skills English: Travel & Tourism](https://premierleague.britishcouncil.org/english/podcasts/travel-and-tourism)（British Council × Premier League） | 英 | 餐廳、飯店兩課的用語整理；交通一課只讀到公車段 | 餐廳：*Do you think you might be able to squeeze us in?*、*Does it have any dairy products in it?*、*I'm going to have the…*、*Shall we split the bill?*。飯店：*We have a reservation for five nights*、*I'm afraid there is a problem with my TV*。直連轉址，Exa 可讀全文 |
| [British Council LearnEnglish: Speaking](https://learnenglish.britishcouncil.org/skills/speaking) | 英 | 總覽頁與 B1、B2 的課程列表（Exa） | 依 CEFR 分級的口說影片課，場景在辦公室。B1：同意與不同意、請人幫忙、接話、回應消息。B2：質疑別人的想法、處理問題、討論利弊、給建議、說服。**各課的用語還沒讀**，要用時讀該課 |
| [LearnEnglish Teens: Travelling abroad](https://learnenglishteens.britishcouncil.org/skills/listening/a2-listening/travelling-abroad) | 英 | 聽力稿 | 五則機場與機上廣播：延誤、登機、最後登機呼叫。是聽得懂用，不是要說的話 |
| [美國國務院 Dialogs for Everyday Use](https://americanenglish.state.gov/resources/dialogs-everyday-use) | 美 | 轉載版的 28 段對話；官方 PDF 的語言註解沒讀 | 情境短對話：點餐 *I'll have tomato soup, roast beef…*、問路 *Could you tell me which way … is?*、購物、交通。1972 年寫成，部分用語偏舊 |
| [onestopenglish](https://www.onestopenglish.com/)（Macmillan） | 英 | 飯店與機場報到的一份教案 | 服務人員一方的問句：*Are you checking in any bags?*、*Would you like a window seat or an aisle seat?*。多數內容要訂閱 |
| [Oxford Online English](https://www.oxfordonlineenglish.com/) | 英 | 機場報到、行李遺失、飯店、點餐、付帳五課的對話 | 完整對話。*do I have to pick up my bag in Dubai?*、*I have a reservation; the name's…*、*There's an issue with…*、*what does it come with?*、*shall we split it?*、*is service included?*。是語言學校，和牛津大學出版社無關 |
| [Espresso English](https://www.espressoenglish.net/travel-english-conversations-in-the-airport/) | 美 | 機場一課 | 報到、安檢、機上對話與問句：*How many bags can I check?*、*Will my luggage go straight through?*、*Is the flight on time?*。個人教師的商業網站 |

### 讀過、只是入口頁

內容在子頁；要用時讀對應的子頁，再把它移到上表。

| 來源 | 地區 | 入口頁顯示什麼 |
| --- | --- | --- |
| [BBC The English We Speak](https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak) | 英 | 每集一個口語說法，三分鐘內。是慣用語，不是情境用語 |
| [VOA English in a Minute](https://learningenglish.voanews.com/z/3619) | 美 | 每集一個慣用語，例如 On the Ball、Stuck in a Rut |
| [ABC Education: Learn English](https://www.abc.net.au/education/learn-english) | 澳 | 有 Business English 系列，第 1 集職場自我介紹、第 4 集面試。各集的頁面還沒找到網址 |
| [elllo](https://www.elllo.org/) | 多國 | 自稱三千多課，多數有逐字稿，依程度分級；是各國說話者的自然對話 |
| [Randall's ESL Cyber Listening Lab](https://www.esl-lab.com/) | 美 | 依主題與程度分的情境聽力，有飲食、旅遊等主題 |
| [TalkEnglish: Speaking Basics](https://www.talkenglish.com/speaking/listbasics.aspx) | 美 | 自稱 90 課、九百多個音檔的基礎句型。商業網站 |
| [British Council TeachingEnglish: Airport check-in](https://www.teachingenglish.org.uk/teaching-resources/teaching-adults/activities/pre-intermediate-a2/airport-check) | 英 | A2 教案的說明頁；逐字稿在 PDF 附件，沒讀 |
| [Oxford University Press: English File 學生網站](https://elt.oup.com/student/englishfile/) | 英 | 各級別的練習入口；第四版要登入碼。只有 Tavily 讀得到 |

## 二、字典、搭配與語料

| 來源 | 用途 | 讀取與使用經驗 |
| --- | --- | --- |
| [Oxford Learner's Dictionaries](https://www.oxfordlearnersdictionaries.com/us/) | 字義、句型、英美差異 | 已用於七十多個詞條。直接請求可讀。網址 `/us/definition/english/<字>`，同形異詞性加 `_1`、`_2` |
| [Longman](https://www.ldoceonline.com/) | 例句多 | 直接請求可讀；抓回的正文混有動詞變化表，要過濾。還沒用於卡片 |
| [Cambridge Dictionary 與 English Grammar Today](https://dictionary.cambridge.org/us/) | 文法頁最完整 | 已用於第一批卡片。直連擋，Exa 與 Firecrawl 可讀 |
| [Merriam-Webster](https://www.merriam-webster.com/) | 美式用法、非正式用字 | 用過 lowball 一條。直連擋，Exa 可讀 |
| [Britannica Dictionary](https://www.britannica.com/dictionary/)（原 Merriam-Webster Learner's） | 美式學習字典 | 讀過 stuck 一條的摘要。直連擋，Firecrawl 可讀 |
| [Collins（COBUILD）](https://www.collinsdictionary.com/) | 整句式定義，標頻率級別 | 讀過 stuck 一條開頭。直連擋，Exa 可讀 |
| [YouGlish](https://youglish.com/) | 搜尋某個說法在影片中的實際出現 | 查過 walk me through，結果頁顯示出現次數。次數只能當「有人這樣說」的線索，不是常見度 |

**讀不到：** COCA 與 BNC 語料庫是要登入的互動查詢介面，直接請求被擋、Exa 回傳不相干內容、Jina 402。所以「哪一句比較常用」目前沒有任何依據。

## 三、軟體工作

| 類別 | 來源 | 讀了什麼 | 實際內容與可用的說法 |
| --- | --- | --- | --- |
| 職場英文教材 | [BBC Office English](https://www.bbc.com/learningenglish/english/features/office-english) | 全系列 37 集裡 21 集的完整逐字稿（subagent 讀；其中 11 集的引文由主 session 重抓原頁逐句比對），13 集沒讀 | 請人幫忙（Help）：*Have you got a second to help me out?*、*I think I need another pair of eyes on this*、*Sorry to bother you, but would you mind helping me for a moment?*。婉拒（Saying no）：*I'm snowed under at the moment*、*how firm is our deadline on this?*。確認理解（Misunderstandings、Clear communication）：*Can I just check that I've understood that right?*、*I'm not sure I follow you*、*can you walk me through how you usually do this?*、*are we on the same page?*。不同意（Conflict）：*Hmm, I'm not sure about that, I think...*。認錯（Mistakes、Apologies）：*I've accidentally …, but I have a plan to fix the problem*、*that's on me*、*I need to give you a heads up*。催進度（Chasing people）：*have you had a chance to...*。開會（Meetings）：*Could I add a thought?*、*I think we're getting a bit off topic*。主持人多次說明委婉說法是英國職場習慣。**沒有任何一集教站立會議報進度** |
| 職場英文教材 | [British Council LearnEnglish: Speaking](https://learnenglish.britishcouncil.org/skills/speaking) | B1 的 Asking a favour、Agreeing and disagreeing，B2 的 Challenging someone's ideas、Dealing with a problem：四課逐字稿與片語清單全文（Exa） | 每課是一段辦公室對話加八到九句片語。請人幫忙：*Have you got a minute?*、*Is there any chance you could…?*、*I would if I could, but I can't*。不同意：*I'm not so sure*、*I see what you mean, but…*、*I'm not convinced by that idea*。質疑：*How exactly do you see this working?*、*I take your point, but…*、*Have you considered the fact that…?*。出問題：*I've got a bit of a problem*、*I've made a mistake*。B1 其他三課與 B2 其他三課還沒讀 |
| 方法論的定義來源 | [The Scrum Guide](https://scrumguides.org/scrum-guide.html) | Daily Scrum 一節 | 定義：十五分鐘、檢視朝 Sprint Goal 的進度、產出隔天的計畫；形式由開發者自己決定。**沒有規定三個問題，也沒有任何口語句子**，只能支持這個會議的目的 |
| 工程組織的公開規範 | [Google Engineering Practices: 寫 review 留言](https://google.github.io/eng-practices/review/reviewer/comments.html) | 整頁 | 留言對事不對人，附好壞對照；解釋理由；看到好的也要說。標籤用法：*Nit:*（小問題）、*Optional* 或 *Consider:*（建議）、*FYI:*（不要求這次改） |
| 工程組織的公開規範 | [Google Engineering Practices: 回應 review](https://google.github.io/eng-practices/review/developer/handling-comments.html) | 整頁 | 不同意時的示範句：*I went with X because of [these pros/cons]… My understanding is that using Y would be worse because of [these reasons]. Are you suggesting that Y better serves the original tradeoffs…?* |
| 工程組織的公開規範 | [GitLab Code Review Guidelines](https://docs.gitlab.com/development/code_review/) | 給作者與 reviewer 的原則段落 | *Ask questions. Make suggestions, not demands.*、*Be explicit.*、*Be humble.*；提替代做法的問法：*What do you think about using a custom validator here?* |
| 工程組織的公開規範 | [Chromium: Respectful Code Reviews](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/cr_respect.md) | 大部分內容 | 不要說 *This is wrong*，要說明對的做法與理由。可用的句子：*Maybe I'm missing something, but…*、*I'm curious, why did you decide to do it that way?*、*This is a good start, but it could use some work*。說明 *LGTM* 是 looks good to me；外出時標 *OOO* |
| 工程組織的公開規範 | [37signals Guide to Internal Communication](https://basecamp.com/guides/how-we-communicate) | 原則列表的前半 | 非同步溝通的原則，例如 *Meetings are the last resort*、*If you want an answer, you have to ask a question*。是原則，不是可以照說的句子 |
| 社群慣例 | [Conventional Comments](https://conventionalcomments.org/) | 整頁 | 留言格式 `<label> [decorations]: <subject>`。標籤：praise、nitpick、suggestion、issue、todo、question、thought、chore、note。例句：*suggestion: Let's avoid using this specific function…*、*question (non-blocking): At this point, does it matter which thread has won?* |
| 事故處理 | [PagerDuty Incident Response](https://response.pagerduty.com/)：During an Incident、[Incident Commander 訓練](https://response.pagerduty.com/training/incident_commander/)、Call Etiquette、SME、Scribe、Deputy | 六頁整頁（subagent 讀；Incident Commander 頁的引文主 session 核對過） | 有示範對話。被指派的人回覆：*Understood, I'll get back with an update in 20 minutes*。指揮官：*Are there any strong objections to this plan?*（文件解釋為什麼不問 Does everyone agree?）、*Bob, please investigate… I'll come back to you for an answer in 3 minutes*。規則：不確定就說不知道、不要猜；不要說 *Can someone…*，要指名 |
| 事故處理 | [Google SRE Book 第 15 章](https://sre.google/sre-book/postmortem-culture/) | 開頭與「Postmortem 的理念」一節；範例報告（附錄 D）沒讀 | 事後檢討的定義與觸發條件；術語 postmortem、root cause、rollback、on-call |
| 事故處理 | [Atlassian: Incident Postmortem](https://www.atlassian.com/incident-management/postmortem) | 開頭的重點摘要 | 定義 blameless 的事後檢討；與 post-incident review 同義 |
| 站立會議說明 | [Atlassian: Stand-ups](https://www.atlassian.com/agile/scrum/standups) | 定義與三個問題的段落 | *What did I work on yesterday? What am I working on today? What issues are blocking me?* 已用於卡片 |
| 技術文字的語氣 | [Google developer documentation style guide: Voice and tone](https://developers.google.com/style/tone) | 開頭段落 | 語氣要 conversational、friendly、respectful，避免行話與文化特定的說法，考慮英文程度不一的讀者。是寫文件的準則 |
| 技術術語 | [Mozilla Bug Writing Guidelines](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html)、[GitHub Docs](https://docs.github.com/en)、[MDN](https://developer.mozilla.org/en-US/) | 相關段落 | 只支持術語存在：*steps to reproduce*、*If you can't reproduce the problem*、*locally*、timeout。已用於卡片 |

偏誤：工程規範全是美國公司或開源專案寫的書面語，適合支持 review 留言與書面溝通，不能直接當成站立會議的口頭說法。口說教材只有 BBC 與 British Council，都是英國機構，沒有美式的職場口說教材。還沒取樣的類別是可追溯的真實工程對話（大型開源專案的公開 PR 討論）；站立會議報進度的說法這次讀的來源都沒有。第一批工作卡片（2026-10-07）只用了最後兩列，是逐句缺什麼補什麼的便利取樣。

## 四、面試

| 類別 | 來源 | 讀了什麼 | 實際內容與可用的說法 |
| --- | --- | --- | --- |
| 語言教材 | [BBC Job Applications](https://www.bbc.com/learningenglish/english/features/job-applications) 與 BBC Office English 的 Describing your job、Selling yourself | Interviews part 1、part 2、After the interview、Preparing for an interview 與上述兩集的整頁逐字稿 | 請 BBC World Service 的招募人員受訪。句子：*sorry, can you repeat the question*、*from my research I know this about the company and therefore I think I would be a good fit*、*Can I just ask, following up, what the outcome of the interview is*。說明職責：正式用 *I'm responsible for*、非正式用 *I mostly work on*；*I have a background in …, which in practice means …*；*I'd like to apply my skills to a new challenge*。講成就：*I put a lot of work into…*、*through my actions we saw a ten percent increase in productivity* |
| 語言教材 | [British Council: How to prepare for a job interview in English](https://learnenglish.britishcouncil.org/level/improve-your-english-level/how-prepare-job-interview-english) | 整頁（Exa） | 六個常見題目、一個示範回答（*In my last role I organised our office relocation… Because of this, the relocation was completed on time and on budget*）、四個可以反問的問題（*What do you think the challenges will be for this role?*、*What's the next step in the recruitment process after this interview?*）。談失敗只給建議：說學到什麼、怎麼避免再犯 |
| 語言教材 | British Council [You're Hired](https://learnenglish.britishcouncil.org/sites/podcasts/files/LearnEnglish-You-re-hired-Episode-05.pdf) 系列 | 第 4、5、9、10 集的 PDF 全文（第 5 集主 session 讀過）；第 1、3、6、8 集只有搜尋摘錄；第 2、7 集沒讀 | 一個求職故事的影集，每集有逐字稿與練習。第 5 集是面試本身：*it's very nice to meet you both*、*I've come as far as I can in my current position… would love to take on some more responsibility*、*the thing I'm most proud of professionally*、*So, I sat down with them and we talked about…*、*I was wondering whether you are planning to…*。情境是業務主管，不是工程 |
| 語言教材 | 澳洲 [ABC Education: Business English Ep4 Interviews](https://www.abc.net.au/education/learn-english/business-english-ep4-interviews/101876886) | 整頁逐字稿 | 面試的語調與時態。*I'm really excited to be speaking with you today. Thank you so much for the opportunity*、*Since I graduated, I've been working for the local city council* |
| 政府的就業與任用指引 | 英國 National Careers Service 的 [STAR method](https://nationalcareers.service.gov.uk/careers-advice/interview-advice/the-star-method)與[常見題目頁](https://nationalcareers.service.gov.uk/careers-advice/top-10-interview-questions) | 兩頁整頁 | STAR 的定義與三個逐段標示的完整示範回答：*in my previous digital marketing job, the company wanted to…*、*my job was to find a way of…*、*I organised a meeting with… and I led…*、*over a period of 3 months, there was an 25% increase in…*（原文就是 an 25%）。常見題目頁有題目與示範，例如弱點：*I struggle with time management on projects. To make sure I stick to the time frame I'm creating a timetable…*；反問：*what does a typical day involve?* |
| 政府的就業與任用指引 | 英國公務員 [Success Profiles: Civil Service behaviours](https://www.gov.uk/government/publications/success-profiles/success-profiles-civil-service-behaviours) | 搜尋回傳的摘錄 | 英國政府的行為面試評分架構，明文建議用 STAR 回答；說明會被要求舉出展現某種行為的實例 |
| 大學就業中心 | [MIT CAPD: STAR method](https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/) | 主要段落 | 行為題原文：*Tell me about a time when you worked as part of a team…*、*What is a project that you are most proud of?*、*Tell me about a time you failed.*。建議各段比例（情境 20%、任務 10%、行動 60%），用 *I* 而不是 *we* 說明自己的角色，封閉式問題也要舉例 |
| 雇主的官方說明 | [Microsoft Careers: Interview tips](https://careers.microsoft.com/v2/global/en/hiring-tips/interview-tips.html) | 主要段落 | 建議準備具體例子，說明 *the situation, what you did, the outcome, and what you learned*；會問怎麼運用回饋、與人合作、調整做法；看重 growth mindset |
| 軟體面試的社群資源 | Tech Interview Handbook 的[行為面試](https://www.techinterviewhandbook.org/behavioral-interview/)、[常見題目](https://www.techinterviewhandbook.org/behavioral-interview-questions/)、[反問的問題](https://www.techinterviewhandbook.org/final-questions/)、[自我介紹](https://www.techinterviewhandbook.org/self-introduction/) | 四頁整頁 | 行為題原文三十多題；一個用 STAR 回答衝突題的完整示範。反問：*What would be the most important problem you would want me to solve if I joined your team?*、*What are the engineering challenges that the company/team is facing?*、*What does a typical day look like in this role?*。自介示範：*I'm interested in the Front End Engineer role at Meta because…*。這是這次讀到唯一帶工程內容示範的來源 |
| 管理類刊物 | HBR〈38 Smart Questions to Ask in a Job Interview〉的[轉載頁](https://www.physicianleaders.org/articles/38-smart-questions-to-ask-in-a-job-interview) | 轉載頁整頁；hbr.org 原文在付費牆後，四種工具都只拿到摘要 | 反問的問題清單：*Can you tell me about the team I'll be working with?*、*What's the most important thing I should accomplish in the first 90 days?*、*What are the biggest challenges that I might face in this position?*、*What are the next steps in the hiring process?*。確切用字無法對回 hbr.org |
| 雇主的官方說明 | [Amazon: Interviewing at Amazon](https://www.amazon.jobs/content/en/how-we-hire/interviewing-at-amazon)、Leadership Principles、Interview loop；Google 的 Interview prep | subagent 讀：正文藏在頁面內嵌的資料裡，Exa 只回標題，要用 curl 取回後抽出來。主 session 沒有自行核對 | 說明行為面試怎麼進行；兩家都寫可以請面試官釐清題目，但沒有給句子 |
| 商業求職網站 | [Indeed: STAR Interview Response Technique](https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique) | 四個部分的說明；示範回答沒讀到 | STAR 各段該講多少；同樣建議用 *I* 不用 *we*。直連擋，Exa 可讀 |
| 商業求職網站 | [The Muse: 51 Interview Questions You Should Be Asking](https://www.themuse.com/advice/51-interview-questions-you-should-be-asking) | 職位、成功衡量、團隊三組問題 | 反問面試官的問題原文。已用於卡片 |

這一節 2026-10-08 補讀過一輪（由 subagent 讀、主 session 逐句核對引文），原本列為「只有入口」的 BBC、British Council You're Hired、ABC、Amazon、HBR 都已讀到正文，見上表。

偏誤與缺口：語言教材全是英國與澳洲機構，沒有美式口說教材；示範回答的情境是行銷、業務、行政，帶工程內容的只有 Tech Interview Handbook。**六個來源都列了「講一次失敗」的題目，沒有一個示範怎麼回答。** 為什麼想來、強項、弱點也是題目多、示範少。前兩批面試卡片只用了 The Muse 一個情境來源，屬於便利取樣。

## 五、旅遊的實務來源

| 來源 | 讀了什麼 | 實際內容 |
| --- | --- | --- |
| 美國 [TSA: Sporting and Camping](https://www.tsa.gov/travel/security-screening/whatcanibring/sporting-and-camping) | 表格的前十列（Exa） | 逐項列出能否隨身、能否託運，欄位是 *Carry on bags*／*Checked bags*，常見說法 *Check with Airline*。攀岩裝備的列還沒讀到 |
| [Mountain Project: Gozen-iwa](https://www.mountainproject.com/area/120393050/gozen-iwa) | Access Issue 段落 | 見攀岩 |

其餘旅遊情境的來源是第一部分的教材。航空公司官網的行李與運動器材規定還沒整理。

## 六、攀岩

| 類別 | 來源 | 地區 | 讀了什麼 | 實際內容與可用的說法 |
| --- | --- | --- | --- | --- |
| 戶外用品商的教學 | [REI: Rock Climbing Commands & Communication](https://www.rei.com/learn/expert-advice/communication-climbing.html) | 美 | 整頁 | 美式口令逐條說明：*Belay on!*、*Slack!*、*Up rope!*、*Climbing!*、*Climb on!*、*Watch me!*、*Falling!*、*Off belay!*、*Take!*。提醒離開地面前先和繩伴約好。已用於卡片 |
| 戶外用品商的教學 | [REI: Rock Climbing Terms & Lingo Guide](https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html) | 美 | 八個詞條的片段 | crag、lead、lower、multi-pitch、pitch、quickdraw、sport climbing、top rope 的定義。已用於卡片 |
| 英式口令 | [Ipswich Mountaineering Club: Climbing Calls](https://ipswich-m-c.co.uk/other/climbing-calls/) | 英 | 搜尋回傳的長摘錄，涵蓋整個流程 | 英式口令與使用時機：*Climb when ready*、*Climbing*、*OK*、*Take in*、*Tight!*、*Safe*、*Off belay*、*That's me*。說明不要說 *Take in the slack*，因為前半被風蓋掉會被聽成 slack。是地方登山會，不是全國性組織 |
| 裝備廠商 | [Salewa: Mountaineering Skills](https://www.salewa.com/en-us/expertise/mountaineering-skills-and-techniques) | 義 | 搜尋回傳的口令一節 | 列出 *On Belay*、*Climbing*、*Slack*、*Take*、*Watch Me!*、*Rock!*、*Safe* 或 *Off belay*，並寫明各國口令略有不同 |
| 英美對照 | [Wikipedia: Belaying](https://en.wikipedia.org/wiki/Belaying) | — | 搜尋回傳的口令表 | 美式與英式並列，含 *Lower me.*／*Lowering.*、*Got you.*。維基百科只當線索，要回查它引用的來源才能用 |
| 岩場資料庫 | [Mountain Project](https://www.mountainproject.com/) | 北美為主 | Railay／Tonsai 與 Gozen-iwa 兩頁的 Access Issue | 岩栓警告 *Stainless steel bolts are suspect near the coast*、*rebolted*；*Please register your name… in the notebook*、*paid the access fees*。已用於卡片 |
| 進入與倫理 | [Access Fund: The Climber's Pact](https://www.accessfund.org/learn/the-climbers-pact) | 美 | 整份公約 | 十二條行為準則的用字：*Respect regulations and closures*、*Learn the local ethics for the places you climb*、*Clean up chalk and tick marks*、*Use, install, and replace bolts responsibly* |
| 國家級組織 | American Alpine Club [Know the Ropes: Belaying](https://publications.americanalpineclub.org/articles/13201214178.pdf) | 美 | 搜尋回傳的開頭 | 確保的三個原則，術語 brake hand、brake position。是技術文章 |
| 裝備廠商 | [Petzl: Belaying with the GRIGRI](https://www.petzl.com/INT/en/Sport/Belaying-with-the-GRIGRI) | 法 | 開頭的警語與錯誤操作列表 | 術語 giving slack、brake side of the rope。是操作說明，不是對話 |

偏誤：做卡片時只讀了美國來源。英式口令現在有三個來源互相印證，但還沒有全國性組織的官方頁面（英國登山協會 BMC 的口令頁試了兩個網址都失效）；亞洲岩場的口令沒有依據。theCrag 直連擋、Exa 可讀，但只確認過一個岩場頁的開頭。

## 七、衝浪

| 類別 | 來源 | 地區 | 讀了什麼 | 實際內容與可用的說法 |
| --- | --- | --- | --- | --- |
| 浪況預報與媒體 | [Surfline: Surf Etiquette](https://www.surfline.com/lp/surf-etiquette) | 美 | 搜尋回傳的長摘錄 | 浪點禮儀與術語定義：lineup、drop in、snake、paddle wide、whitewater、right-of-way |
| 衝浪媒體 | [Surfer: Rules of Surf Etiquette](https://www.surfer.com/culture/surfing-rules-surf-etiquette)（2026） | 美 | 搜尋回傳的長摘錄 | 規則之外，列了水中會喊的話：*Going left*、*Going right*、*You're ok, stay there*；犯錯時用 sincere apology 解決 |
| 衝浪媒體 | [Wavelength: Surfing Etiquette](https://wavelengthmag.com/surfing-etiquette-beginners-guide/) | 英 | 搜尋回傳的長摘錄 | 新手禮儀；被搶浪時 *give a little whistle or a friendly 'yo'*，自己搶到別人的浪要 *kick out as soon as you can and apologise* |
| 衝浪媒體 | [Surfer Today: The basic rules of surf etiquette](https://www.surfertoday.com/surfing/the-basic-rules-of-surf-etiquette) | 葡 | 前六條規則（Exa） | 規則用字：right of way、don't drop in、don't snake、paddle wide、the furthest out gets priority |
| 海域安全 | 英國 [RNLI: Surfing](https://rnli.org/safety/choose-your-activity/surfing) | 英 | 安全清單與裝備清單（Exa） | 九條安全檢查的用字：*surf between the black and white chequered flags*、*rip currents*、*check weather and tides*、*always wear a leash* |

偏誤：這五個都是禮儀與安全規則，教的是術語，不是在浪點和人對話的句子；既有兩張衝浪卡片用的是兩個衝浪學校的文章。租板、問浪點狀況的說法還沒有來源。

## 八、口說練習方法的資源文章

教「怎麼練口說」的文章、指南與研究，用來決定練習區該怎麼設計、文章該建議讀者怎麼練；不是句子的來源。

這一節做了兩輪。第一輪（下面「我點名去找的」）是我拿自己知道的名字去搜尋，等於預設了誰有名。第二輪改成先找「大家在哪裡推薦資源」，讀那些推薦清單，再統計哪些被重複提到。兩輪的結果差很多，所以分開列。

### 怎麼找的（第二輪）

1. 找推薦清單：GitHub 上星數最高的英語學習指南與資源表（用 GitHub 搜尋 API 依星數排序）、Hacker News 的相關提問（Algolia API 依分數排序）、Stack Exchange 語言學習站票數最高的問題、PTT Eng-Class 板的高推文章、Reddit 兩個板的 wiki。
2. 讀每份清單的口說部分，記下它推薦什麼。
3. 統計同一個資源或做法在幾份獨立清單出現。

### 讀了哪些推薦清單

| 清單 | 規模 | 讀了什麼 | 口說方面的內容 |
| --- | --- | --- | --- |
| [byoungd/up](https://github.com/byoungd/up)（原 English-level-up-tips） | GitHub 6.7 萬星 | [口說章](https://github.com/byoungd/up/blob/master/docs/threads/part-1/5-speaking.md)的前四節全文、其餘各節標題與文末來源 | 不列資源，講方法：先把口說任務定義成說明、問答、修復、協作；保存沒有講稿的錄音當基線，讓真人聽眾複述聽到什麼；把口音、可理解度、理解難度分開，不以消除口音為目標；跟讀只負責模仿，複述與追問才負責生成；每輪只修一到三個影響最大的問題。文末引用 Derwing & Munro (2005)、Levis (2005)、Saito (2012) |
| [ZuodaoTech/everyone-can-use-english](https://github.com/ZuodaoTech/everyone-can-use-english)（李笑來《人人都能用英語》與 Enjoy App） | GitHub 3.9 萬星 | README、「一千小時」的簡要說明與「是什麼」兩頁；訓練任務各頁沒讀 | 主張用注意力填滿一千小時、每天至少三小時，目標是「用一年把英語練成第一語言」。讀到的兩頁是理念，沒有給研究依據；具體練法在沒讀的訓練任務裡。附一個跟讀與錄音的 App |
| [yujiangshui/A-Programmers-Guide-to-English](https://github.com/yujiangshui/A-Programmers-Guide-to-English) | GitHub 1.7 萬星 | 訓練方法頁的前兩節、資源頁的口說相關條目 | 先測現況並設目標（作者後悔沒先做）；對老師與網路資料保持懷疑。資源：Rachel's English、賴世雄的發音教材、影子跟讀用「每日英語聽力」或 Aboboo，素材提到 BBC、VOA |
| [knowledgefxg/learning-english](https://github.com/knowledgefxg/learning-english) | GitHub 4.5 千星 | 目錄與「口語練習」一節、YouTube 頻道列表 | 口說工具：ChatGPT 語音、Cambly、Speechling、SmallTalk2Me、Duolingo。頻道：Speak English With Vanessa、Rachel's English、mmmEnglish、EnglishAnyone、English Like A Native、engVid、A.J. Hoge |
| [interaminense/learning-english](https://github.com/interaminense/learning-english) | GitHub 780 星 | 口說相關條目 | BBC Learning English、elllo、EnglishCentral、FluentU、Forvo、Speak24、Tandem |
| [epalatov/learning-english](https://github.com/epalatov/learning-english) | GitHub 585 星 | Speaking 兩節 | EnglishClub、italki |
| [awesome-english](https://github.com/awesome-english/awesome-english) | GitHub 114 星 | Speaking、Pronunciation 兩節 | English Central、ELSA、Billie English、The Sound of English、Tandem、italki、HiNative、TED、English Speaking Success |
| [Ventsislav-Yordanov/Learning-English](https://github.com/Ventsislav-Yordanov/Learning-English) | GitHub 55 星 | 全表的口說條目 | speaking24、My Language Exchange、EnglishClub、BBC The English We Speak、Fluent in 3 Months 的一篇、FluentU 兩篇、engVid 繞口令 |
| [Ask HN: How to improve spoken and written English skills rapidly?](https://news.ycombinator.com/item?id=10572449)（2015） | 25 分 | 全部 7 則第一層留言的開頭 | 找母語者多講；朗讀；跟著影集或 TED 複述；一位前譯者推薦跟讀；找口音教練；聽口才好的 Podcast |
| Ask HN: How did you improve your communication skill in second language?（2021） | 8 分 | 8 則第一層留言的開頭 | 持續開口、找人糾正、對鏡子朗讀新聞再回想句子、把影片放慢再逐步加速 |
| [Language Learning Stack Exchange: How to practice speaking a language with no speakers?](https://languagelearning.stackexchange.com/questions/250) | 問題 21 票、最高答案 11 票 | 最高票答案的前半 | 先找到語音樣本、對自己講、錄音檢查；工具提到 RhinoSpike、Forvo |
| PTT Eng-Class [長期在國外學習，一些心得和學習技巧](https://www.ptt.cc/bbs/Eng-Class/M.1573249584.A.8FB.html)（2019） | 27 推 | 前 2,600 字 | 用英文思考與自言自語；偷聽母語者怎麼說、心裡默念、在家練，正式場合前先模擬；提到史嘉琳的發音課，說自己的方法和她的一樣；推薦 Merriam-Webster 的學習字典 |
| PTT Eng-Class [朋友的英文突飛猛進](https://www.ptt.cc/bbs/Eng-Class/M.1550213297.A.288.html)（2019） | 25 推 | 全文 | 轉述朋友的做法：大量聽讀加跟述，平日六小時、連續兩年。是二手轉述 |
| [r/EnglishLearning wiki](https://www.reddit.com/r/EnglishLearning/wiki/index) | 板上 49.8 萬成員 | 整頁（只有 Tavily 讀得到） | **沒有口說練習資源**，只列字典、寫作格式手冊、語料庫。字典那段和本清單第二部分幾乎相同，另外多了 OZDIC 搭配字典與 Google Books Ngram |

| [r/languagelearning wiki](https://www.reddit.com/r/languagelearning/wiki/index) 的[FAQ](https://www.reddit.com/r/languagelearning/wiki/faq) | 板上 25.2 萬成員；FAQ 約 8 萬字 | 首頁整頁；FAQ 的大綱全部，以及學得快、三個月流利、Benny Lewis、AI、每天學多久、記不住、不敢語言交換、進步變慢等十多節的內容（約全文三成） | **整份 FAQ 沒有出現 shadowing，也沒有 Pimsleur、Assimil、HelloTalk、Tandem。** 口說方面的主張：決定進度的主要是花在語言上的有品質時間；盡量多練對話；學自然的片語與填充語；發音值得早點練；想快速能對話就砍掉進階文法與罕用字，專注聽說。對 Benny Lewis 的評價持平：核心就是早開口、多開口，適合目標是對話與旅行的人，代價是其他能力較弱。找語伴推薦 iTalki 與 r/Language_exchange。忘記是正常的，要靠間隔越來越長的重複，而且不要等全記熟才往下學。提到的長篇指南有 Iversen 在 A Language Learner's Forum 的指南，沒讀 |
| PTT Eng-Class [精華區](https://www.ptt.cc/man/Eng-Class/index.html)「英語學習能力培養 › 口說」 | 版主收錄 15 篇，2004–2006 年 | 分類目錄四層；口說區讀了 6 篇、學習經驗分享區 1 篇 | 做法：找一分鐘有稿的音檔反覆聽、模仿後錄音、和原音比較（一位網友轉述語音學老師的練習）；每天朗讀並錄音；寫英文日記、自言自語或一人分飾多角；朗讀要配合情境自問自答，不然只是照本宣科；上台講二到五分鐘，只能帶沒有完整句子的大綱；跟著 CNN 光碟一句一句暫停跟著唸。資源：Raymond Murphy 的文法書、English Vocabulary in Use、空中英語教室、看 DVD 切換中英字幕 |

**之前寫錯的地方：** 這一節第一版把 r/languagelearning 的 wiki 列為「讀不到」，其實是我把兩個網址一起送給 Tavily、只回來一個，就沒有再單獨送。單獨送就讀到了。PTT 精華區也是直接請求就能讀，第一版只用了板內搜尋。

| r/languagelearning wiki 的[資源表](https://www.reddit.com/r/languagelearning/wiki/resources) | 約 37 萬字，絕大部分是各語言的資源 | 網頁存檔 2026-01-30 的快照；讀了「理論與實務」「語言交換」「English (ESL)」三節全文與全頁大綱 | **推薦書單的第一本就是 Paul Nation 的《What do you need to know to learn a foreign language?》**，說明是免費、短、著重使用內容。其他書：Krashen、Pimsleur、Fluent Forever、Babel No More（書介提到 Alexander Arguelles）等。部落格與頻道：Steve Kaufmann、Luca Lampariello、Olly Richards。語言交換列了 italki、HelloTalk、HiNative、Lang-8、My Language Exchange、The Mixxer 等 14 個。English (ESL) 一節列 British Council、English Club、Voice of America、News in Levels 等，沒有口說專用的資源 |
| r/languagelearning wiki 的[學習指南頁](https://www.reddit.com/r/languagelearning/wiki/guide)與它指向的 [How To Learn a Foreign Language](https://mondecast.com/language-guide/introduction/)（版主 sajforbes 寫的指南） | 指南共五章公開在網站上 | wiki 頁讀存檔 2024-10-08 的快照全文（它只是導覽，內容在外部網站）；指南的 Activities 與 Resources 兩章讀了口說相關各節，其餘三章只看大綱 | 六項核心活動：跟課程學、背單字卡、學關鍵片語、大量輸入、對話練習、精讀。**學關鍵片語的做法是卡片先顯示母語、自己說出外語、確認說對才按過關**，並建議用整句、挑旅行這類實際需要的句子。對話練習被形容為最好的練習之一，但經驗豐富的學習者通常只花 0–10% 的時間在上面，因為找語伴不容易。要旅行的人建議用聽了跟著說的課程。指南全文沒有出現 shadowing。發音工具推薦 Forvo、YouGlish、Wiktionary；語言交換推薦 Tandem、HelloTalk。片語手冊「只讀不會記住，要搭配單字卡」 |

**為什麼之前讀不到：** Reddit 會把沒有登入的請求導到登入頁。舊版介面（old.reddit.com）回傳的其實是登入頁，所以看起來「有回應但沒有內容」；新版介面直接請求回 403 或一個空殼；JSON 端點也一樣被擋。Tavily 偶爾讀得到（首頁與 FAQ 成功，另外兩頁回空白），Exa 直接拒絕。最後是用網頁存檔讀到的：`https://web.archive.org/web/2025/https://old.reddit.com/r/<板名>/wiki/<頁名>`，存檔保存的是舊版介面的完整內容。存檔的查詢介面當時在限流，但直接組出快照網址可以讀。另外，wiki 的「指南頁」本身只是導覽，真正的指南放在版主的個人網站，後來又搬到另一個網域，要跟著連結走兩次。

**讀取 Reddit 的順序：** 先試 Tavily（單一網址）；不行就用網頁存檔的 old.reddit 快照，並記下快照日期。

樣本的偏誤：GitHub 的清單偏工程師；星數高的三份都是中文寫的；Hacker News 的口說提問分數都很低，代表性有限；PTT 精華區的口說文章都是 2004–2006 年的，反映的是那時候的做法與資源。

### 被重複推薦的做法

| 做法 | 在幾份清單出現 | 出處 |
| --- | --- | --- |
| 跟讀、跟述、跟著影片複述 | 7 | up、Programmer's Guide、兩則 Ask HN、PTT「朋友的英文突飛猛進」、PTT 精華區；up 特別提醒跟讀只是模仿，不等於能生成。**Reddit 的 FAQ 完全沒提** |
| 自言自語、用英文思考、自問自答 | 5 | PTT 兩篇、PTT 精華區、Stack Exchange、Ask HN |
| 錄音後和原音比較 | 4 | up、Stack Exchange、Ask HN（對鏡子）、PTT 精華區 |
| 找真人對話並請對方糾正 | 8 | up、兩則 Ask HN、epalatov、awesome-english、Reddit FAQ、Reddit 指南、PTT 精華區（以語言交換、家教、外籍老師的形式） |
| 朗讀 | 3 | 兩則 Ask HN、PTT 精華區（留言有人提醒只朗讀沒有用，要配合情境） |
| 學整句的片語、用卡片主動回想 | 3 | Reddit FAQ、Reddit 指南、第一輪的 British Council India |
| 有間隔的重複 | 2 | Reddit FAQ、第一輪的 Paul Nation |
| 先測現況、設定可檢查的任務 | 2 | up、Programmer's Guide |

### 被重複推薦的資源

以下是推薦次數的統計。**這些資源本身我都還沒讀或看過**，列在這裡是為了說明「社群實際推薦什麼」，不是推薦它們當來源。

| 資源 | 類型 | 出現在幾份清單 |
| --- | --- | --- |
| BBC Learning English（含 The English We Speak） | 機構教材 | 3（Programmer's Guide、interaminense、Yordanov） |
| Rachel's English | 發音教學頻道 | 2（Programmer's Guide、knowledgefxg） |
| italki | 家教平台 | 4（epalatov、awesome-english、Reddit FAQ、Reddit 資源表） |
| Tandem | 語言交換 | 3（interaminense、awesome-english、Reddit 指南） |
| HelloTalk | 語言交換 | 2（Reddit 資源表、Reddit 指南） |
| YouGlish | 影片例句 | 1 份清單（Reddit 指南），本清單第二部分也用過 |
| Paul Nation 的免費電子書 | 學習方法 | 1 份清單（Reddit 資源表，列在書單第一本） |
| TED | 演講 | 2（awesome-english、Ask HN 2015） |
| EnglishClub | 教學網站 | 2（epalatov、Yordanov） |
| engVid | 教學頻道 | 2（knowledgefxg、Yordanov） |
| English Central | 影片跟讀 | 2（interaminense、awesome-english） |
| FluentU | 教學部落格 | 2（interaminense、Yordanov） |
| Forvo | 發音字典 | 3（interaminense、Stack Exchange、Reddit 指南） |
| speaking24 | 找人對話 | 2（interaminense、Yordanov） |
| English Speaking Success | 教學頻道 | 2（knowledgefxg、awesome-english） |
| 史嘉琳的回音法 | 台灣學者的方法 | 1 份清單（PTT），另在一篇個人經驗文出現 |

只出現一次的有：VOA、ELSA、Cambly、Speechling、ChatGPT 語音、Duolingo、HiNative、Fluent in 3 Months、賴世雄的發音教材、mmmEnglish、Speak English With Vanessa 等。

### 兩輪對照出來的事

- **我第一輪點名的三個名字，在英語學習的資源表裡幾乎沒出現，但在語言學習板有。** GitHub 的英語資源表與 PTT 都沒有提 Paul Nation 與 Alexander Arguelles；Fluent in 3 Months 只在一份 55 星的清單出現一次。可是 Reddit 語言學習板的資源表把 Nation 那本書列在書單第一本，FAQ 也用兩節討論 Benny Lewis。**這一條我寫過一個錯的版本**：在讀到 Reddit 資源表之前，我寫成「Nation 一次都沒有出現」，那是因為當時還沒讀到最該讀的那一頁。
- **練習區現在的做法，和 Reddit 指南的「學關鍵片語」幾乎一樣。** 指南建議卡片先顯示母語、自己說出外語、確認說對才過關，用整句、挑實際需要的情境。這是目前對練習區設計最直接的一份旁證。指南也提醒這種卡比認字卡難很多，句子要盡量簡單。
- **社群推薦的大多是工具、頻道與平台，不是文章。** 「有名的口說練習文章」如果指大家會轉貼的單篇文章，這一輪沒有找到被兩份以上清單引用的。最接近的是 up 的口說章（單一指南的一章，但該指南有 6.7 萬星）。
- **跟讀是重複最多的做法，但最多星的指南對它最保留。** up 明寫跟讀負責模仿、生成要靠複述與追問，和第一輪讀到的系統性回顧結論一致。
- **台灣的脈絡裡，史嘉琳被獨立提到兩次**（PTT 一篇高推文、一篇個人經驗文），而且都是讀者自己提的，不是我搜尋她才出現。
- **Reddit 語言學習板的 FAQ 與指南都完全沒提跟讀。** 中文世界的清單與文章幾乎都把跟讀放在第一位，這份英文社群最大的 FAQ 講的卻是對話時間、片語與發音。跟讀在華語與日語學習圈特別流行，可能不是普遍的共識；這是我的推論。
- **二十年前 PTT 精華區的做法，和現在的清單幾乎一樣**：聽有稿的短音檔、模仿、錄音比較、自言自語、找人對話。變的是工具，不是方法。
- **r/EnglishLearning 的 wiki 沒有口說資源**，但它列的字典和本清單第二部分一致，可以當成字典選擇的旁證；它列的 OZDIC 搭配字典之前試過讀不到。

### 我點名去找的（第一輪）

以下是拿已知的名字去搜尋得到的。內容讀過，但「有名」是我的認定，沒有推薦清單佐證。除非另外註明，都是 Exa 搜尋回傳的長摘錄，沒有抓整頁。

#### 機構與學者

| 來源 | 性質 | 讀到的內容 |
| --- | --- | --- |
| [British Council: How to improve your English speaking](https://learnenglish.britishcouncil.org/level/improve-your-english-level/how-improve-your-english-speaking) | 機構的學習建議 | 四個建議：開口用（包含自言自語）、找人對話（語言交換、聚會）、錄下自己的聲音回聽、練聽力。提到錄音後同一個主題下次會講得更順，也能訓練自己注意並修正錯誤 |
| [British Council: Five tips for busy learners](https://learnenglish.britishcouncil.org/english-levels/improve-your-english-level/five-tips-busy-learners-listening-speaking)（2022） | 機構的學習建議 | 給沒時間的人：通勤時聽、在家放背景聲、自言自語、錄音回聽並注意「不確定的說法」 |
| [British Council English Online: 8 Practical Ways to Practise Speaking English](https://englishonline.britishcouncil.org/blog/articles/8-practical-ways-to-practise-speaking-english/)（2022） | 機構的部落格 | 八種做法：自言自語、對鏡子或錄影、用英文描述日常、跟讀、朗讀、和朋友練、線上遊戲、上課。跟讀一段明寫是 Alexander Argüelles 發展的方法，並強調不要暫停音檔 |
| [British Council India: Top tips to improve speaking](https://www.britishcouncil.in/blog/top-tips-improve-speaking) | 機構的部落格 | 學整句片語而不是單字；錄音回聽；朗讀；出門前為可能的對話準備一張「小抄」寫下關鍵句並先練過 |
| [Paul Nation: What do you need to know to learn a foreign language?](https://www.wgtn.ac.nz/lals/resources/paul-nations-resources/paul-nations-publications/publications/documents/foreign-language_1125.pdf)（免費電子書） | 應用語言學者寫給學習者的書 | 四股平衡（four strands）：有意義的輸入、有意義的輸出、刻意學習語言、流暢度練習，四者時間大致相等。口說相關的活動：角色扮演、準備過的短講、背句子或對話、4/3/2。角色扮演的做法：演完檢討、立刻再演一次，之後在**間隔越來越長**的場次再練一兩次；情境列成清單逐一練。只讀到目錄、摘要與角色扮演一節 |
| [Paul Nation: Keeping it practical and keeping it simple](https://www.wgtn.ac.nz/__data/assets/pdf_file/0008/1882088/2018-keeping_it_practical_and_keeping_it_simple.pdf)（2018） | 學者的回顧文章 | 作者自己說明：四股「各佔四分之一」**沒有研究證據支持**，是常識判斷。引用四股時要連這個限制一起寫 |
| 4/3/2 流暢度練習（Maurice 1983；Nation 1989） | 研究與教學法 | 讀到的是一篇[西班牙文研究](https://dialnet.unirioja.es/descarga/articulo/6065023.pdf)的轉述：同一個主題對三個不同的人各講 4、3、2 分鐘。有效的三個原因是重複、時間壓力、換聽眾。Nation 1989 的原文沒有讀到 |
| [史嘉琳：回音法（Echo Method）](https://homepage.ntu.edu.tw/%7Ekarchung/pubs/CET6970.pdf)（台大外文系；另有 [TEDxNTUST 演講](https://www.ted.com/talks/jan_2018_47dcaf8d-b6df-4a6b-9922-4712d6bebf59)） | 台灣學者發表的方法 | 八個步驟：選一到三分鐘有文字稿的音檔、聽熟、讀懂、一次只播四到五個字就暫停、**先聽腦中的回音再開口**、重複到很順、每天十分鐘。和跟讀的差別是聽完先停一下，不立刻跟著唸。演講版濃縮成 Listen、Echo、Repeat，之後再進到緊跟著唸、同時唸 |
| [Whitworth & Rose (2025): 跟讀法用於發音教學的系統性回顧](https://www.tandfonline.com/doi/full/10.1080/29984475.2025.2546827) | 系統性回顧，納入 44 篇研究 | 跟讀能改善可理解度、流暢度與韻律；對個別音的效果沒有定論。限制：多數研究只用受控的口說作業，改善未必能轉移到自然對話。跟讀原本是口譯訓練，多數研究其實是在練聽力 |
| [Foote & McDonough (2017): 用行動裝置跟讀](https://www.ingentaconnect.com/content/jbp/jslp/2017/00000003/00000001/art00003?crawler=true&mimetype=application%2Fpdf) | 實驗研究，16 人、八週 | 每週至少四次、每次至少十分鐘。即席口說的可理解度與流暢度進步，口音沒有改善 |
| [Alexander Arguelles: Shadowing Step by Step](https://www.youtube.com/watch?v=130bOvRpt24) 與 [Roadmap for Language Study](https://www.alexanderarguelles.com/question-answer/roadmap-for-language-study/) | 提出這套跟讀法的人自己的說明 | 每次約三十分鐘、每天加一課、同一份教材分階段循環；強調複習最重要。他的做法是配課本從頭學一個語言，和網路上流傳的「跟著影片唸」差很多 |

#### 個人與商業作者

可以參考做法，但主張的效果沒有另外查證，不能當成依據。

| 來源 | 性質 | 讀到的內容 |
| --- | --- | --- |
| [Benny Lewis: Fluent in 3 Months](https://www.fluentin3months.com/learn-a-language/)（多篇） | 知名語言學習部落格，有販售課程 | 主張「第一天就開口」：從兩句話的交流開始、設定小任務、錄一兩分鐘回聽並一次只改一項、找家教或語言交換。文章開頭都有課程宣傳 |
| [ELT：Shadowing 教材與 App 推薦](https://www.eltschool.jp/zh-hant/column/shadowing-material-selection)（2026） | 日本英語學校的文章 | 選教材三條件：有準確文字稿、看稿能懂八到九成、符合目標。依程度推薦 VOA Learning English、Rachel's English、TED、CNN 10 |
| [創勝文教：有效 Shadowing 的 4 大要件](https://ntetaiwan.com/blog/article-20231124/)（2023） | 台灣補教業者的文章 | 教材不能難且要有逐字稿、先用 0.75 倍速、重質不重量、邊唸邊想意思與語言形式 |
| [dailynotes：影子跟讀法怎麼練](https://dailynotes.live/shadowing-technique/)（2026） | 內容網站 | 把跟讀分成有稿或無稿、逐句或同步四種；五個步驟；每次十分鐘、每週至少四次；跟讀後要接摘要或回答問題。整理得清楚，但引用的研究沒有給出處 |
| [RosyArts：3 方法自學提升英文口說](https://rosy-arts.com/life/learning-english/)（2023） | 留學生的個人經驗 | 多輸入、回音法、練習一分鐘回答問題並錄音修正；把常講的主題整理成自己的 word bank，修順後反覆練 |

你站上 2026-09-03 那篇口說練習文引用的六篇（PTT、Preply、EnggleTalk、英文探長J、eatthebook、VoiceTube）屬於這一小類，當時讀過全文，紀錄在 `.research/2026-09-03-english-speaking-improvement.md`。

### 對練習區與文章的含意

這是我讀完後的推論，不是來源的原話：

- 練習區目前的做法是看中文、試著說、再揭示參考說法，屬於 Nation 說的「背句子或對話」加上有間隔的重複。它涵蓋四股裡的「刻意學習」，沒有涵蓋流暢度練習與有意義的輸出。
- 多個來源都建議錄音回聽，練習區沒有這個功能。
- British Council 建議出門前準備關鍵句的小抄，Nation 建議把會遇到的情境列成清單逐一角色扮演；這和「依行程準備情境卡」的方向一致。
- 跟讀的研究證據集中在聽力與韻律，轉移到自然對話的證據不足；文章提到跟讀時不能寫成對口說一定有效。
- up 的做法（保存無稿錄音當基線、讓真人複述聽到什麼、每輪只修一到三個問題）比練習區現有的自評更接近「有沒有把意思傳到」。練習區的自評目前只問說得順不順。

## 讀過後排除

讀了正文，確認對口說卡片沒有用。不要再加回主表，除非找到它底下具體有用的頁面。

| 來源 | 排除的理由 |
| --- | --- |
| CBC Learning English | 頁面公告服務已於 2020 年 11 月結束，由 Mauril 取代 |
| USA Learns | 內容是美國生活適應、入籍考試、護理助理課程 |
| Cambridge English: Activities for learners | 首頁列的是文法與單字練習 |
| English Profile、Pearson Global Scale of English | 首頁抓回來沒有正文，或只有行銷介紹；量表本身沒讀到 |
| TOEFL、Cambridge B2 First 的測驗說明 | 是測驗形式介紹。IELTS 口說頁有四項評分標準的說明，要自評時可回頭讀 |
| Coursera 的兩門英語課 | 只有課程介紹頁，影片內容讀不到 |
| The Agile Manifesto、Stack Overflow Developer Survey、Write the Docs、Microsoft Writing Style Guide、Atlassian Team Playbook | 與口說無關，或只讀到入口 |
| Microsoft Engineering Playbook、Kubernetes PR Process、Firefox Reviewer Checklist、Rust Review Policy | 讀到的是流程與檢查清單，沒有溝通用語 |
| 美國 OPM: Structured Interviews | 給面試官的制度說明 |
| Harvard、UC Berkeley 就業中心 | 一般性的準備建議，沒有題目原文或示範回答 |
| 美國勞工部 CareerOneStop | 一般性的準備建議 |
| SHRM 面試題庫 | 題目在子頁，而且明文限制轉載 |
| interviewing.io、LinkedIn Talent Blog、Levels.fyi | 談面試制度與薪資，不是語言 |
| IATA、Lonely Planet、japan-guide.com、Heathrow | 讀到的是首頁或組織介紹 |
| Surfing Australia、Surfing NSW、Surfing England、Surfrider、World Surf League、International Surfing Association | 首頁是賽事新聞與會員資訊 |
| Mountain Training、Climbing Magazine、World Climbing、Black Diamond、UIAA、AMGA | 首頁是機構資訊或文章列表；其中 UIAA 與 AMGA 是抓回的檔案沒有正文，沒有再試其他工具 |
| Etsy Debriefing Facilitation Guide | Exa 只讀到標題 |

仍然沒找到正確網址：Open University OpenLearn、Stanford 與 CMU 就業中心、英國登山協會的口令頁。Glassdoor 試了直接請求、Exa、Tavily 都拿不到。付費課本（English File、Headway、Speakout）讀不到內文。

## 已做過的對照

| 情境 | 日期 | 讀了哪些 | 結果 |
| --- | --- | --- | --- |
| 旅遊 | 2026-10-08 | Premier Skills English（餐廳、飯店、交通）、BBC Real Easy English 機場篇、VOA 四課、TeachingEnglish 與 LearnEnglish Teens 的說明頁、onestopenglish、Oxford Online English 五課、Espresso English | 教材教十一項功能，當時的 9 張旅遊卡只涵蓋「問路」一項；機場報到、飯店入住、點餐、付帳、轉機行李都沒有卡片。跨來源重複的說法：I'll have the …、I have a reservation、Shall we split the bill?、Do I have to pick up my bag in …?、There's a problem with … |

| 軟體工作 | 2026-10-08 | BBC Office English 21 集、British Council 口說四課、PagerDuty 六頁；code review 四個來源沿用先前的紀錄 | 教材教的是請人幫忙、婉拒、確認理解、委婉不同意、認錯、催進度；**站立會議報進度沒有任何來源教**，而當時 12 張工作卡有 5 張落在這裡。舊卡只有 work-walkthrough 和教材幾乎同句。跨 BBC 與 British Council 重複的說法：先承認再轉折（*I see what you mean, but…*）、用不確定代替不同意（*I'm not so sure*）、先問有沒有空（*Have you got a minute?*）。完整報告：`.work/english-speaking/work-teaching-materials/research.md` |
| 面試 | 2026-10-08 | 十一個來源：BBC 兩個系列、British Council 文章與 You're Hired、ABC、National Careers Service、MIT、Tech Interview Handbook、Amazon、Google、HBR 轉載頁 | 整理出 53 題面試題。涵蓋來源最多的功能是反問面試官（8 個）與為什麼想來（7 個）。當時 24 張面試卡完全沒涵蓋：寒暄、離職原因、想來的原因、強項、弱點、STAR 的任務、請對方重複題目、問下一步、道謝、跟進。跨來源重複：反問挑戰、典型的一天、下一步流程；proud of；good fit；背景句用 In my … job／role 開頭。完整報告：`.work/english-speaking/interview-teaching-materials/research.md` |

做完新的情境對照後，在這張表加一列，並把新讀的來源補進對應的表。

**用 subagent 做對照時：** 它的報告只當線索。做成卡片的每一句引文，主 session 都要重抓原頁、用完整字串比對過，才能標成原句；沒核對的要在 evidence 寫明。2026-10-08 這兩批共核對 50 多句，全部吻合。
