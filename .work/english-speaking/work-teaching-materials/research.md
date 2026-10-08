# work-teaching-materials：軟體工程師工作英文口說的教材研究

研究日期：2026-10-08（Asia/Taipei）。做法依 `.agents/skills/english-speaking-post/references/teaching-materials.md` 的「怎麼用」：先讀教材、列出教材教的功能，再對照現有 12 張工作卡。這份檔案只是研究紀錄，沒有改任何卡片或文章。

工具路徑：Groundlane 這個 session 沒有掛載。BBC、PagerDuty、四個 code review 來源用 curl 加瀏覽器 User-Agent 直接抓整頁 HTML，在本機轉成純文字後閱讀；British Council 用 Exa `web_fetch_exa`。**不算 Groundlane 驗證。** Tavily、Firecrawl 這次沒有用到（沒有遇到 Exa 讀不到的頁面）。

本文所有英文引文都是從抓回的正文複製的。BBC 逐字稿開頭註明 *This is a transcript of a spoken conversation and is not a word-for-word script*，所以它和實際錄音可能有出入。

## 1. 來源表

### 1.1 讀到正文的來源

| # | 來源 | 性質 | 地區 | 工具 | 讀了哪些頁 | 讀到多少 |
| --- | --- | --- | --- | --- | --- | --- |
| A | [BBC Learning English: Office English](https://www.bbc.com/learningenglish/english/features/office-english) | 機構教材（公共廣播的英語教學 podcast，附逐字稿） | 英 | curl | 系列頁列出 37 集。**整份逐字稿讀完 21 集**（見 1.2）。另有 3 集只讀片段、13 集沒讀 | 21 集為整頁逐字稿；片段與未讀的集數見 1.2 |
| B | [British Council LearnEnglish: Speaking B1／B2](https://learnenglish.britishcouncil.org/skills/speaking) | 機構教材（影片課的逐字稿與 useful phrases） | 英 | Exa | B1 [Agreeing and disagreeing](https://learnenglish.britishcouncil.org/skills/speaking/b1-speaking/agreeing-disagreeing)、B1 [Asking a favour](https://learnenglish.britishcouncil.org/skills/speaking/b1-speaking/asking-favour)、B2 [Challenging someone's ideas](https://learnenglish.britishcouncil.org/skills/speaking/b2-speaking/challenging-someones-ideas)、B2 [Dealing with a problem](https://learnenglish.britishcouncil.org/free-resources/speaking/b2/dealing-problem)，以及 B1、B2 兩個列表頁 | 四課的逐字稿與結尾的跟讀片語清單都完整讀到。各課的 Preparation、Task 1–3 互動練習與 Worksheet PDF 沒讀。「Dealing with a problem」原網址會轉址到 `/free-resources/speaking/b2/dealing-problem`，Exa 第一次只回傳轉址訊息，改抓新網址才讀到 |
| C | [PagerDuty Incident Response](https://response.pagerduty.com/) | 工程組織規範（公司公開的內部事故處理文件） | 美 | curl | [During an Incident](https://response.pagerduty.com/during/during_an_incident/)、[Incident Commander 訓練](https://response.pagerduty.com/training/incident_commander/)、[Call Etiquette](https://response.pagerduty.com/before/call_etiquette/)、[Subject Matter Expert 訓練](https://response.pagerduty.com/training/subject_matter_expert/)、[Scribe 訓練](https://response.pagerduty.com/training/scribe/)、[Deputy 訓練](https://response.pagerduty.com/training/deputy/) | 這六頁的 `<article>` 正文整頁讀完。[Different Roles](https://response.pagerduty.com/before/different_roles/) 只讀了 Scribe 職責那一段（約十行）。External Communication Guidelines 抓了但沒讀 |
| D | [Google Engineering Practices: 寫 review 留言](https://google.github.io/eng-practices/review/reviewer/comments.html)、[回應 review](https://google.github.io/eng-practices/review/developer/handling-comments.html) | 工程組織規範（書面） | 美 | curl | 兩頁 | **這次沒有重讀整頁。** 只抓回正文，用關鍵字找到清單裡記的句子並讀了前後幾行，確認原文一字不差 |
| E | [GitLab Code Review Guidelines](https://docs.gitlab.com/development/code_review/) | 工程組織規範（書面） | 美（全遠端公司） | curl | 一頁 | 同上，只核對清單記的四句與其前後 |
| F | [Chromium: Respectful Code Reviews](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/cr_respect.md) | 開源專案規範（書面） | 美（開源） | curl（`?format=TEXT` 取原始 markdown） | 一頁 | 同上，只核對清單記的句子所在段落（五段） |
| G | [Conventional Comments](https://conventionalcomments.org/) | 社群慣例（書面） | — | curl | 一頁 | 同上，只核對標籤清單與兩個例句 |

D–G 的內容摘要沿用清單第三節既有的紀錄；這次做的只是把要引用的句子對回原文。

### 1.2 BBC Office English 各集的讀取範圍

**整份逐字稿讀完（21 集）：** Help（250519）、Chasing people（240205）、Misunderstandings（250428）、Suggestions and advice（260413）、Mistakes（240219）、Conflict（240311）、Disagreements（260316）、Apologies（260302）、Bad news（240304）、Saying no（250407）、Delegating（250421）、Feedback（250512）、Deadlines and logistics（250526）、Describing your job（260330）、Clear communication（260420）、Calls and instant messages（240212）、Extra work（260427）、Ideas（260406）、Goals（260309）、Plans and strategies（260817）、Organising meetings（260216）。括號內是網址結尾的編號，網址格式 `https://www.bbc.com/learningenglish/english/features/office-english/<編號>`。

**只讀片段（3 集）：**

- Cold calls（250505）：只讀了談後續追蹤的三段。
- Client management（250602）：只讀了談交付時間的三段。
- Meetings（240130）：清單已有摘要；這次只用關鍵字核對了三句（*Can I just ask...?*、*Could I add a thought?*、*I think we're getting a bit off topic*）確實在原文，沒有重讀整集。

**抓了但沒讀（13 集）：** Introducing Office English、Emails、Work events、Negotiating、Selling yourself、Presentations、Pitching、Small talk、Rules、Socialising、Writing notes、Career development、Formal or informal?。這 13 集只在全系列關鍵字搜尋時被掃過（見第 5 節），不能當成讀過。

讀的時候為了省篇幅，第二、三批（Conflict 之後的 16 集）把說話者姓名那幾行濾掉了，所以這份報告不區分某句是 Pippa 還是 Phil 說的，一律寫「主持人」。

### 1.3 沒讀或讀不到的

| 來源 | 狀況 |
| --- | --- |
| British Council 四課的 Worksheet PDF 與互動練習 | 沒有嘗試。Exa 回傳的頁面只有下載連結的文字 |
| British Council 直接請求 | **這次沒有重試 curl**，直接照清單的實測紀錄（直連被擋）改用 Exa。所以「被擋」是沿用清單的紀錄，不是這次自己驗到的 |
| PagerDuty `during/etiquette/`、`during/complex_incidents/` | 我猜的網址，兩個都回 404。從 During an Incident 頁面的導覽連結找到正確網址在 `before/call_etiquette/`（已讀）與 `before/complex_incidents/`（沒讀） |
| Google SRE Book 第 15 章附錄 D 範例報告 | 選讀項目，沒有讀 |
| 美式或其他地區的職場口說教材 | 這次沒有找。口說教材只有 BBC 與 British Council，兩個都是英國機構 |

## 2. 功能對照表

「來源」欄的字母對應 1.1。A 後面的括號是 BBC 的集名。卡片 id 是 `src/lib/english-speaking.ts` 裡 `scenario: 'work'` 的 12 張。

數法說明：這次讀到正文的口說教材只有 A、B 兩個；C 是事故通話的規範（口頭，但情境很窄）；D–G 是書面規範。下面寫「兩個來源」時指的是這七個裡的兩個，不代表一般教材的情況。

| 功能 | 哪些來源有教 | 現有工作卡 |
| --- | --- | --- |
| 請人幫忙（開口、先道歉、問有沒有空） | A（Help、Calls and instant messages）、B（Asking a favour）——2 個 | `work-review`（請人看 PR）部分涵蓋 |
| 主動提供協助 | A（Help）——1 個 | 沒有 |
| 婉拒別人的請求、說自己太忙 | A（Help、Saying no）、B（Asking a favour）——2 個 | 沒有 |
| 確認自己有沒有聽懂、請對方再說明 | A（Misunderstandings、Clear communication、Feedback）、B（Challenging someone's ideas 的 *I'm a bit lost*）——2 個 | `work-walkthrough` |
| 確認對方有沒有聽懂 | A（Misunderstandings、Delegating）——1 個 | 沒有 |
| 提建議而不失禮 | A（Suggestions and advice、Feedback、Ideas）、E（GitLab，書面）——2 個 | `work-unsure` 的後半句、`work-ai`（勉強算） |
| 委婉不同意、質疑做法 | A（Conflict、Disagreements、Meetings）、B（Agreeing and disagreeing、Challenging someone's ideas）、D（Google 回應 review，書面）——3 個 | `work-unsure` 的前半句 |
| 表示同意、讓步、找折衷 | A（Disagreements）、B（Agreeing and disagreeing）——2 個 | 沒有 |
| 承認錯誤、道歉、負責 | A（Mistakes、Apologies）、B（Dealing with a problem）——2 個 | 沒有 |
| 提早預告壞消息 | A（Apologies、Bad news、Mistakes）——1 個 | 沒有 |
| 催進度、提醒 | A（Chasing people、Cold calls 片段）——1 個 | 沒有 |
| 交辦工作、給指示 | A（Delegating、Clear communication）、C（PagerDuty 指派任務）——2 個 | 沒有 |
| 談期限：給期限、問期限多硬、要求延後 | A（Deadlines and logistics、Saying no、Client management 片段）——1 個 | `work-deadline`、`work-duration`、`work-estimate` |
| 設界線：工作量、下班時間、額外工作 | A（Saying no、Extra work）——1 個 | 沒有 |
| 給回饋與回應回饋（口頭） | A（Feedback）——1 個 | 沒有 |
| review 留言（書面） | D、E、F、G——4 個 | 沒有（`work-review` 是請人 review，不是留言） |
| 回應 review 的不同意（書面） | D；A（Feedback）有口頭的對應說法——2 個 | 沒有 |
| 視訊會議的技術狀況（靜音、斷訊） | A（Calls and instant messages）——1 個 | 沒有 |
| 即時訊息的開頭與回覆 | A（Calls and instant messages）——1 個 | `work-review` 用到 *when you have a moment* |
| 主持會議、收尾列出待辦 | A（Organising meetings、Ideas、Meetings）——1 個 | 沒有 |
| 事故通話：宣告角色、指派、徵求反對、狀態更新、交接 | C——1 個 | 沒有 |
| 介紹自己的職責 | A（Describing your job）——1 個 | 沒有 |
| 績效面談談成果與目標 | A（Goals）——1 個 | 沒有 |
| **站立會議報進度（昨天做了什麼、正在做什麼、卡在哪）** | **0 個。** 這次讀的七個來源都沒有教 | `work-bug`、`work-fixed`、`work-waiting`、`work-stuck`、`work-repro` 五張都在這一項 |

### 重點

1. **現有 12 張卡有 5 張落在這次讀的教材完全沒教的功能（站立會議報進度）。** 這不代表那 5 張錯，而是它們的依據只能是清單裡的 Atlassian 三個問題與技術術語來源，教材幫不上忙。
2. **教材最集中教的是「人際上難開口」的功能**：請人幫忙、婉拒、確認理解、委婉不同意、承認錯誤、催進度、設界線。這些現有卡片幾乎都沒有。
3. **跨來源重複最明顯的三組說法**（都在 A、B 兩個口說教材出現）：
   - 先承認對方再轉折：B 的 *I see what you mean, but…*、*I take your point, but…*、*I see where you're coming from*；A 的 *that's a good point, Pippa, but in this instance, I think we should...*、*I can see why you want to do it this way. But in this case I agree with...*
   - 用「不確定」代替「不同意」：B 的 *I'm not so sure.*、*I'm not convinced by that idea.*；A 的 *Hmm, I'm not sure about that, I think...*
   - 問有沒有空再開口：B 的 *Have you got a minute?*；A 的 *Have you got a second to help me out?*
4. **口頭與書面在「不同意時先講自己的理由」上有對應**：A（Feedback）的 *I think my reasoning for doing it this way is...* 與 D（Google）的 *I went with X because of [these pros/cons]…*。一個是口說教材、一個是書面規範，句型不同，只能說做法一致。
5. BBC 主持人在多集反覆說明這些委婉說法是英國職場的習慣。Conflict 一集的原話：*it's important to say that we're speaking from a British cultural context*。Chasing people 一集提到 *certainly in the UK and probably also in the US there is this kind of culture of politeness and informality*。Clear communication 一集則提醒討論階段可以委婉，做決定與交辦時要直接：*ask, 'can you do this?' not 'would it be okay if you did this?'*

## 3. 候選句清單

共 29 句。「原句」指英文欄和來源正文一字不差（只去掉引號，或把句尾的省略號換成具體內容時會標成改寫）。「改寫」指依來源句型換了受詞或情境，來源原文另外列出。

英式或美式：A、B 都是英國機構的教材，來源沒有逐句標示英美差異，下表只在來源自己有說明時才寫；其餘寫「來源未說明」。

### 3.1 請人幫忙、提供協助、婉拒

| # | 中文情境 | 英文 | 來源與網址 | 來源原文 | 原句／改寫 | 口語／書面 | 英美 | 第二個來源 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 你卡住了，走到同事旁邊請他幫忙 | Have you got a second to help me out? I'm having some trouble with this. | A [Help](https://www.bbc.com/learningenglish/english/features/office-english/250519) | 'Have you got a second to help me out? I'm having some trouble with this'. | 原句 | 口語；主持人說這句 informal | 來源未說明 | B Asking a favour 有同樣的開場：*Have you got a minute?* |
| 2 | 你想請同事幫你再看一次你寫的東西 | I think I need another pair of eyes on this. | A Help（同上） | You can say 'I think I need another pair of eyes on this'. It just means, could you have a look for me? | 原句 | 口語 | 來源未說明 | 沒有 |
| 3 | 你要打擾主管，請他幫忙 | Sorry to bother you, but would you mind helping me for a moment? | A Help（同上） | 'Sorry to bother you, but would you mind helping me for a moment?' | 原句 | 口語；主持人說這句 quite formal，可以對主管用 | 來源未說明 | A Calls and instant messages 也教訊息開頭用 *sorry to bother you*（同一來源的另一集）；B 的句型是 *Would you be able to work this afternoon?* |
| 4 | 你需要同事今天就幫你 review，知道這是在麻煩他 | Is there any chance you could review this today? | B [Asking a favour](https://learnenglish.britishcouncil.org/skills/speaking/b1-speaking/asking-favour) | Is there any chance you could work late? | 改寫（換成 review this today） | 口語 | 來源未說明 | 沒有 |
| 5 | 你看到同事很忙，主動問能不能分擔 | I have some free time, and you seem to have a lot on at the moment. Is there anything that I can take off your hands? | A Help（同上） | 'I have some free time, and you seem to have a lot on at the moment. Is there anything that I can take off your hands?' | 原句 | 口語 | 來源未說明（*have a lot on* 的英美差異我沒有查） | 沒有 |
| 6 | 同事請你幫忙，但你手上有事，想問能不能晚一點 | Can it wait until later? I'd love to help, but I have a few other things I need to sort out. | A Help（同上） | 'Can it wait until later? I'd love to help, but I have a few other things I need to sort out'. | 原句 | 口語 | 來源未說明 | B Asking a favour 的婉拒句：*I would if I could, but I can't.* 意思相近，句型不同 |
| 7 | 主管又丟一件事給你，你已經忙不過來 | I'm snowed under at the moment. Is there anyone else that can help? | A [Saying no](https://www.bbc.com/learningenglish/english/features/office-english/250407) | 'I'm snowed under at the moment. Is there anyone else that can help?' | 原句 | 口語 | 來源未說明 | 沒有 |
| 8 | 主管加了新任務，你願意做，但要讓他知道別的事會延後 | I can get that done for you. It might mean that we have to push back another deadline though. | A Saying no（同上） | 'I can get that done for you. It might mean that we have to push back another deadline though.' | 原句 | 口語 | 來源未說明 | 沒有 |

### 3.2 確認理解

| # | 中文情境 | 英文 | 來源與網址 | 來源原文 | 原句／改寫 | 口語／書面 | 英美 | 第二個來源 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | 主管交代完任務，你想確認自己沒聽錯 | Can I just check that I've understood that right? | A [Misunderstandings](https://www.bbc.com/learningenglish/english/features/office-english/250428) | 'Can I just check that I've understood that right?' | 原句 | 口語 | 來源未說明 | A Clear communication 有幾乎相同的 *can I just check I understood something*（同一來源的另一集） |
| 10 | 會議上同事講了一段，你沒跟上 | I'm not sure I follow you. Can you just talk me through that again? | A Misunderstandings（同上） | 'I'm not sure I follow you. Can you just talk me through that again? ' | 原句 | 口語 | 來源未說明 | B Challenging someone's ideas：*I'm a bit lost. What are you talking about?*；A Feedback：*I'm not sure if I follow your reasoning here* |
| 11 | 你想把對方的意思用自己的話說一次，確認沒誤會 | I just want to be sure I've got you 100% right. Do you mean we should roll it back first? | A Misunderstandings（同上） | 'I just want to be sure I've got you 100% right. Do you mean...' | 改寫（補上 *we should roll it back first?*） | 口語 | 來源未說明 | A Feedback：*When you say… whatever… Do you mean that I should…?*；A Clear communication：*when you say this, do you mean this?*（都是同一來源） |
| 12 | 你講完一段技術說明，想確認大家有跟上 | Does that make sense? | A Misunderstandings（同上） | Well, we can always ask other people 'Does that make sense? Or invite questions maybe. | 原句 | 口語 | 來源未說明 | A Delegating：*Let me know if everything makes sense to you.*（同一來源） |
| 13 | 討論完，你想確認兩邊的理解一致 | Are we on the same page? | A [Clear communication](https://www.bbc.com/learningenglish/english/features/office-english/260420) | 'are we on the same page? I want to make sure that we understand things the same way'. | 原句 | 口語 | 來源未說明 | C PagerDuty 的說明文字用到同一個片語：*This makes sure everyone is on the same page.* 那是文件的敘述，不是示範要說的話 |

### 3.3 提建議、委婉不同意

| # | 中文情境 | 英文 | 來源與網址 | 來源原文 | 原句／改寫 | 口語／書面 | 英美 | 第二個來源 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 14 | 會議上你有個想法，不想說得太直接 | Would it be worth thinking about adding a cache here? | A [Suggestions and advice](https://www.bbc.com/learningenglish/english/features/office-english/260413) | 'would it be worth thinking about this?' | 改寫（把 this 換成具體內容） | 口語；主持人說這是 indirect 的說法 | 來源未說明 | 沒有 |
| 15 | 你想提醒同事一件事，但他可能早就想過 | You've probably already thought of this, but have you checked the retry logic? | A Suggestions and advice（同上） | 'you've probably already thought of this, but...' | 改寫（補上後半句） | 來源把它放在 email 的段落，偏書面；口頭也說得通是我的判斷 | 來源未說明 | E GitLab 有同一個原則，但沒有這句話：*Offer alternative implementations, but assume the author already considered them.* |
| 16 | 同事提了一個做法，你有疑慮 | Hmm, I'm not sure about that. I think we should test it on staging first. | A [Conflict](https://www.bbc.com/learningenglish/english/features/office-english/240311) | Hmm, I'm not sure about that, I think... | 改寫（補上後半句） | 口語 | 主持人說明整集是 British cultural context | B Agreeing and disagreeing：*I'm not so sure.*、*I'm not convinced by that idea.* |
| 17 | 你聽懂對方的理由，但還是覺得有問題 | I see what you mean, but I don't think it fits the requirements. | B [Agreeing and disagreeing](https://learnenglish.britishcouncil.org/skills/speaking/b1-speaking/agreeing-disagreeing) | I see what you mean, but it looks a bit empty. | 改寫（換掉 but 之後的內容） | 口語 | 來源未說明 | B Challenging someone's ideas：*I take your point, but be imaginative.*、*I see where you're coming from.*；A Conflict：*that's a good point, Pippa, but in this instance, I think we should...*；A Disagreements：*I can see why you want to do it this way. But in this case I agree with...* |
| 18 | 你想指出對方的方案漏掉一個前提 | Have you considered the fact that this endpoint is public? | B [Challenging someone's ideas](https://learnenglish.britishcouncil.org/skills/speaking/b2-speaking/challenging-someones-ideas) | Have you considered the fact that we're a branding agency, not a pet shop? | 改寫（換掉 that 之後的內容） | 口語。來源對話裡這句帶點挖苦，實際用的語氣要自己拿捏 | 來源未說明 | A Ideas：*Have you thought about this or how will we deal with this?* |
| 19 | 你想請對方把方案講得更具體 | How exactly do you see this working? | B Challenging someone's ideas（同上） | How exactly do you see this working? | 原句 | 口語 | 來源未說明 | 沒有 |
| 20 | 雙方僵住，你提議先小範圍試試看 | Why don't we try it for a couple of weeks and see if there's any impact? | B Challenging someone's ideas（同上） | Why don't we try it for a couple of weeks and see if there's any impact? | 原句（對話裡的台詞，不在結尾的片語清單裡） | 口語 | 來源未說明 | 沒有 |
| 21 | reviewer 建議換做法，你想說明當初為什麼這樣做 | I did think about doing that, but I was worried it would impact performance. | A [Feedback](https://www.bbc.com/learningenglish/english/features/office-english/250512) | 'I did think about doing this, but I was worried it would impact this' | 改寫（換掉 this） | 口語 | 來源未說明 | D Google 回應 review 有書面的對應做法：*I went with X because of [these pros/cons] with [these tradeoffs]*。句型不同 |

### 3.4 承認錯誤、預告壞消息、催進度、期限

| # | 中文情境 | 英文 | 來源與網址 | 來源原文 | 原句／改寫 | 口語／書面 | 英美 | 第二個來源 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 22 | 你發現自己部署錯了，去跟主管說，而且已經想好怎麼補救 | I've accidentally deployed the wrong branch, but I have a plan to fix the problem. | A [Mistakes](https://www.bbc.com/learningenglish/english/features/office-english/240219) | I've accidentally sent the email out early, but I have a plan to fix the problem. | 改寫（換掉出錯的事） | 口語 | 來源未說明 | B Dealing with a problem：*I've got a bit of a problem.*、*I've made a mistake.* |
| 23 | 出包的是你，你要明講責任在自己 | That's on me. | A [Apologies](https://www.bbc.com/learningenglish/english/features/office-english/260302) | you say "that's on us" or "that's on me". You're saying 'it's my fault, that was down to me, I'm taking responsibility'. | 原句 | 口語 | 來源未說明 | 沒有 |
| 24 | 你忘了做主管交代的事，對方人不錯、事情不大 | Sorry, I let this slip. | A Apologies（同上） | "sorry, I let this slip" and 'let this slip' means I just forgot or I wasn't as organised as I should have been, but it's more informal. | 原句 | 口語；主持人說這句 more informal | 來源未說明 | 沒有 |
| 25 | 你發現時程估錯，要提早讓對方知道 | I need to give you a heads up. | A Apologies（同上） | "I need to give you a heads up", and a heads up is like a warning. | 原句 | 口語 | 來源未說明 | 沒有 |
| 26 | 你請同事 review 的 PR 兩天沒動靜，第一次提醒 | Have you had a chance to look at my PR? | A [Chasing people](https://www.bbc.com/learningenglish/english/features/office-english/240205) | have you had a chance to... look at the report | 改寫（the report 換成 my PR） | 來源的情境是 email，偏書面；主持人後面提到也可以當面說 | 主持人說這種委婉的第一次提醒是英國的習慣，並說 *probably also in the US* | A Cold calls 片段：*just following up to see if you'd had a chance to consider this*（同一來源的另一集） |
| 27 | 主管問某件事要多久，你給了估計，想確認對方能不能接受 | If we delivered it by next week, does that sound reasonable? | A [Deadlines and logistics](https://www.bbc.com/learningenglish/english/features/office-english/250526) | 'if we delivered the report by next week, does that sound reasonable?' | 改寫（the report 換成 it） | 口語 | 來源未說明 | A Client management 片段：*we're looking to deliver the first part of the project to you by the end of the month. Is that in line with your expectations?*（同一來源） |
| 28 | 需求一直加，你想知道期限能不能動 | How firm is our deadline on this? | A Saying no（同 #7） | 'how firm is our deadline on this?' | 原句 | 口語 | 來源未說明 | A Deadlines and logistics：*do we have a hard deadline on this?*（同一來源） |

### 3.5 事故通話

| # | 中文情境 | 英文 | 來源與網址 | 來源原文 | 原句／改寫 | 口語／書面 | 英美 | 第二個來源 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 29 | 事故通話中，指揮官請你去查一件事並限定時間，你回覆收到 | Understood, I'll get back with an update in 20 minutes. | C [Incident Commander 訓練](https://response.pagerduty.com/training/incident_commander/) | Anne: Understood, I'll get back with an update in 20 minutes. | 原句 | 口語（文件裡寫的示範對話） | 美國公司的文件；沒有說明英美差異 | 沒有 |

統計：29 句，其中 **18 句原句、11 句改寫**。

- 原句 18 句：#1、#2、#3、#5、#6、#7、#8、#9、#10、#12、#13、#19、#20、#23、#24、#25、#28、#29。
- 改寫 11 句：#4、#11、#14、#15、#16、#17、#18、#21、#22、#26、#27。

在另一個獨立來源（不是同一來源的另一集）有對應的共 10 句：#1、#3、#6、#10、#15、#16、#17、#18、#21、#22。其中只有 #1、#16、#17 是說法本身重複；其餘 7 句是功能相同、句子不同，#15 與 #21 的第二個來源還是書面規範。

### 3.6 沒放進候選、但讀到的其他說法

事故通話中由指揮官說的句子（C，Incident Commander 訓練頁，都是原文）。一般工程師比較常是聽的一方，所以沒放進候選句，列在這裡備查：

- 宣告角色：*This is [NAME], I am the Incident Commander for this call.*
- 指派並限時：*Bob, please investigate the high latency on web app boxes. I'll come back to you for an answer in 3 minutes.*
- 徵求反對意見：*Are there any strong objections to this plan?* 文件解釋為什麼不問 *Does everyone agree?*
- 狀態更新：*While we wait for [X], here's an update of our current situation.*
- 交接：*Everyone on the call, be advised, at this time I am handing over command to [X].*
- 結束通話：*Ok everyone, we're ending the call at this time. Please continue any follow-up discussion on Slack. Thanks everyone.*
- 文件明講不要說 *Can someone...*，因為會造成旁觀者效應。
- Call Etiquette 頁對一般參與者的要求（是規則，不是示範句）：*Answering that you "don't know" something is perfectly acceptable. Do not try to guess.*；需要更多時間可以說，但要給估計。

視訊會議（A，Calls and instant messages，原文）：*you're on mute*、*could you mute, please?*、*Ooh sorry, you're breaking up. I didn't catch that.*、*could I stop you for just a moment*。

即時訊息（同一集，原文）：開頭用 *when you have a moment* 或 *sorry to bother you*；沒空時回 *I'm in a meeting right now, I'll get back to you later*。

設界線（A，Saying no，原文）：*are you happy for me to park this and pick it up in the morning?*、*I'm keen to get away on time today. Is there anything I can do to get ahead?*

會議收尾（A，Organising meetings 與 Ideas，原文）：*let's make a list of action points from this discussion*、*we'll check in on this in a week's time*、*what are the deliverables?*

書面 review 留言（D–G，句子都已對回原文）：

- Google：標籤 *Nit:*、*Optional (or Consider):*、*FYI:*。
- GitLab：*What do you think about using a custom validator here?*
- Chromium：*Maybe I'm missing something, but…*、*I'm curious, why did you decide to do it that way?*、*This is a good start, but it could use some work*
- Conventional Comments：*suggestion: Let’s avoid using this specific function…*、*question (non-blocking): At this point, does it matter which thread has won?*

## 4. 現有 12 張工作卡的檢查

「教材」指這次讀到正文的七個來源。沒找到不等於這句不自然，只表示這次的教材不能替它背書。

| 卡片 id | 現有英文 | 教材裡有沒有對應 | 教材怎麼說、差在哪 |
| --- | --- | --- | --- |
| `work-bug` | I'm looking into why the API is timing out. | **沒有。** 全部抓回的文字裡找不到 *looking into* 用在「調查問題」的句子 | 最接近的是 A（Mistakes）的 *Let me investigate the problem and get to the bottom of how that happened*，情境是對客戶道歉後承諾調查，不是站立會議。C 的 SME 步驟寫 *Simply state that you are investigating and provide regular updates to the IC*，是規則的敘述。兩處用的動詞都是 investigate |
| `work-ai` | I'd like to test this model with a few real examples first. | 沒有直接對應 | 功能上接近「提議先小規模試」，B 有 *Why don't we try it for a couple of weeks and see if there's any impact?*。教材用的是邀請對方的句型（*Why don't we…*），卡片是陳述自己想做什麼（*I'd like to…*） |
| `work-fixed` | I fixed the login flow yesterday. | **沒有。** 教材沒有教報告昨天完成什麼 | A（Goals）有談成果的說法，如 *this year I've made real progress in...*，那是績效面談，時間尺度與場合都不同 |
| `work-waiting` | I'm still waiting for the backend API. | **沒有** | 教材從另一邊教：怎麼去催那個讓你等的人（A Chasing people 的 *have you had a chance to...*）。「告訴團隊我在等誰」沒有教 |
| `work-deadline` | I can finish this by the end of the day. | 有相關、沒有同句 | A（Deadlines and logistics）教的是給別人期限：*I need this work from you by the end of the day tomorrow*；以及自己提期限時加一句確認：*if we delivered the report by next week, does that sound reasonable?*。差別：教材建議提期限後反問對方能不能接受，並提醒不要 overpromise（原話 *It's best to under promise and overdeliver*）；卡片是單方面承諾 |
| `work-stuck` | I'm stuck on the permission settings. | **沒有。** *stuck* 在教材裡只出現在別的意思（A Bad news 的 *if you're stuck for how to start the conversation*；C 的 *stuck lock*） | 教材教的是卡住之後的下一步：開口求助。A（Help）的 *I'm having some trouble with this*、*I think I need another pair of eyes on this*。可以考慮把這張卡和求助句配成一組 |
| `work-repro` | I can't reproduce the issue locally. | **沒有。** 全部抓回的文字裡沒有 *reproduce* | 清單記的依據是 Mozilla Bug Writing Guidelines 等技術術語來源，這次沒有重讀 |
| `work-review` | Could you take a look at this PR when you have a moment? | **有，分兩半** | *when you have a moment* 是 A（Calls and instant messages）教的訊息用語，原文：*it's quite good to use phrases when you're sending it saying when you have a moment or sorry to bother you*。*take a look* 在教材裡沒有當成請求句教；A（Help）用的是 *could you have a look for me?*（主持人解釋 *another pair of eyes* 時的說法）。B 的請求句型是 *Would you be able to…?*、*Is there any chance you could…?*。差別：教材用 *have a look*，卡片用 *take a look*；這可能是英美差異，但來源沒有說，我也沒有查 |
| `work-walkthrough` | Could you walk me through how this part works? | **有，幾乎同句** | A（Misunderstandings）：*can you walk me through how you usually do this?* 主持人說這句對新人特別有用。同一集另有 *Can you just talk me through that again?*。差別只有 *Could* 與 *can*、以及受詞 |
| `work-unsure` | I'm not sure about this approach. Could we try it on a smaller scale first? | **有，兩半都有對應，而且前半跨兩個來源** | 前半：A（Conflict）*Hmm, I'm not sure about that, I think...*；B *I'm not so sure.*。後半：B *Why don't we try it for a couple of weeks and see if there's any impact?*。差別：教材的後半用 *Why don't we…*；*on a smaller scale* 教材沒有 |
| `work-duration` | This will probably take two to three days. | 沒有同句 | A（Deadlines and logistics）談估時間的說法是 *realistically, we need a while to do this properly. I would suggest...*，後面接 *Does that fit in with your timeline?*。同一集教了 *ballpark figure*（粗估）。差別：教材的句子不直接說天數，重點在給建議後確認對方的時程 |
| `work-estimate` | I need to confirm the requirements before I give you an estimate. | 沒有同句 | A（Deadlines and logistics）遇到「不確定該估多久」時教的是把問題丟回去：*when would you like it finished ideally?*；以及先問期限的彈性：*do we have a hard deadline on this?*。差別：教材的做法是反問對方的期待，卡片是說明自己要先確認需求。*estimate* 當名詞的用法教材沒有示範（只有 C 的規則敘述 *give the Incident Commander an estimate of how much time*） |

小結：12 張裡，教材有幾乎同句的 1 張（`work-walkthrough`），有明確對應說法的 2 張（`work-unsure`、`work-review`），有相關但句型不同的 4 張（`work-deadline`、`work-duration`、`work-estimate`、`work-ai`），完全沒有的 5 張（`work-bug`、`work-fixed`、`work-waiting`、`work-stuck`、`work-repro`）。

## 5. 沒找到的

以下是工程師常需要、但這次讀的教材裡沒有的。判斷「沒有」的方式：讀完的頁面裡沒看到，再對全部抓回的文字（含沒讀的 13 集 BBC）搜尋關鍵字。關鍵字搜尋只能證明那幾個字沒出現，不能證明沒有別的說法。

- **站立會議報進度**：昨天做了什麼、今天要做什麼、卡在哪、在等誰。搜尋 *yesterday*、*waiting for／on*、*blocker*、*reproduce*、*looking into* 都沒有對應的教學句。
- **技術問題的描述**：逾時、失敗、偶發、只在某環境出現。教材是一般辦公室情境，沒有技術內容。
- **重現問題、要重現步驟**：沒有。
- **說明技術取捨**（這樣做比較快但比較難維護）：口說教材沒有；B2 有一課 Discussing advantages and disadvantages，這次沒讀。
- **1 on 1 向主管反映狀況**：只有 A（Extra work）談工作量超出職責的幾句，沒有談卡關、需要資源或成長。
- **結對寫程式、邊看螢幕邊說**（「往下捲」「這一行」「先跑一次看看」）：沒有。
- **口頭做技術展示或 demo**：A 有 Presentations 與 Pitching 兩集，這次沒讀。
- **事故通話中一般工程師怎麼回報發現**：C 只給了規則（*Announce all findings to the incident commander*）與指揮官的句子，沒有示範 SME 的回報句。候選句 #29 是唯一讀到的回應句。
- **事後檢討會議上的口頭說法**：沒讀（SRE Book 附錄 D 是書面報告，而且這次沒讀）。
- **review 的口頭討論**：D–G 都是書面留言。當面或視訊討論 PR 時怎麼說，只能借用 A（Feedback）的一般回饋用語。
- **美式職場口說教材**：這次完全沒有取樣。

## 6. 不確定的地方

1. **BBC 逐字稿不等於錄音。** 頁面註明不是逐字腳本。我沒有聽音檔，引用的是頁面上的文字。
2. **D–G 四個 code review 來源這次沒有重讀整頁**，只把清單記的句子對回原文與前後文。清單對它們的摘要我沒有重新驗證。
3. **BBC Meetings 一集**同樣只核對了三句；清單摘要裡的 *I like that idea, but my thinking is a bit different* 與 *I'm sorry, but I think we need to talk about…* 這次沒有核對到，所以這份報告沒有引用它們。
4. **英美差異幾乎沒有依據。** 兩個口說教材都是英國的。*have a look* 對 *take a look*、*have a lot on*、*snowed under*、*Have you got…?* 對 *Do you have…?* 在美式職場是否一樣自然，來源沒說，我沒有查字典。做卡片前要查。
5. **委婉程度是否適合使用者的職場。** BBC 主持人自己多次說這是英國習慣，並提醒各地、各公司不同。工程團隊（尤其跨國遠端團隊）是否用這麼多緩衝語，這次讀的來源無法回答。清單提到的缺口——大型開源專案的公開 PR 討論——仍然沒有取樣。
6. **改寫句沒有另外查證。** 第 3 節標成改寫的 11 句，替換進去的技術內容（如 *deployed the wrong branch*、*roll it back*、*retry logic*）是我自己放的，沒有查搭配是否自然。
7. **B 的對話是為教學寫的戲劇**，有些句子在劇中帶玩笑或挖苦（如 #18）。片語清單列出的說法可以用，但語氣要看場合。
8. **「第二個來源」的認定偏寬。** 我把「功能相同、句子不同」也記進去並逐句註明了；如果只算說法本身重複，跨 A、B 兩個獨立來源的只有三組（見第 2 節重點 3）。同一來源不同集的重複不算獨立印證。
9. **British Council 直連被擋**是沿用清單的實測紀錄，這次沒有自己重試 curl。
10. **功能對照表的「現有工作卡」欄**有主觀判斷，例如把 `work-ai` 算進「提建議」、把 `work-review` 算進「請人幫忙」。
