export const speakingScenarios = [
  { id: 'travel', title: '旅遊', subtitle: '問路、機場、住宿與用餐' },
  { id: 'surf', title: '衝浪', subtitle: '看浪況、問下水位置' },
  { id: 'climbing', title: '攀岩', subtitle: '問岩場、租裝備、找繩伴' },
  { id: 'work', title: '工作', subtitle: '軟體與 AI 開發協作' },
  { id: 'daily', title: '日常聊天', subtitle: '近況、求職與約見面' },
  { id: 'interview', title: '面試', subtitle: '介紹工程經驗' },
] as const;
export type SpeakingScenario = typeof speakingScenarios[number]['id'];
export const speakingCards = [
  { id: 'map', scenario: 'travel', family: 'have', context: '你手上有地圖，想告訴朋友。', zh: '我這裡有一份地圖。', en: 'I have a map here.', swap: '把「地圖」換成「一支筆」：I have a pen here.' },
  { id: 'ticket-present', scenario: 'travel', family: 'present', context: '進站時，你向站務人員出示自己的票。', zh: '這是我的票。', en: 'Here’s my ticket.', swap: '換成護照：Here’s my passport.' },
  { id: 'charger', scenario: 'travel', family: 'have', context: '朋友手機快沒電，你可以幫忙。', zh: '我這裡有充電器。', en: 'I have a charger here.', swap: '換成行動電源：I have a power bank here.' },
  { id: 'cafe', scenario: 'travel', family: 'there', context: '朋友想喝咖啡，你知道附近有一家店。', zh: '這附近有一家咖啡店。', en: 'There’s a café near here.', swap: '換成藥局：There’s a pharmacy near here.' },
  { id: 'bus', scenario: 'travel', family: 'there', context: '你指著馬路對面的站牌。', zh: '那邊有一個公車站。', en: 'There’s a bus stop over there.', swap: '換成便利商店：There’s a convenience store over there.' },
  { id: 'toilet', scenario: 'travel', family: 'there', context: '你想確認附近有沒有廁所。', zh: '這附近有廁所嗎？', en: 'Is there a restroom near here?', swap: '換成 ATM：Is there an ATM near here?' },
  { id: 'station', scenario: 'travel', family: 'go', context: '你在飯店門口，想向路人問路。', zh: '從這裡怎麼到車站？', en: 'How do I get to the station from here?', swap: '換成機場：How do I get to the airport from here?' },
  { id: 'museum', scenario: 'travel', family: 'go', context: '你告訴朋友接下來想去哪裡。', zh: '我想從這裡去博物館。', en: 'I want to get to the museum from here.', swap: '換成飯店：I want to get to the hotel from here.' },
  { id: 'walk', scenario: 'travel', family: 'go', context: '你想知道走路去是否方便。', zh: '我可以從這裡走到那裡嗎？', en: 'Can I walk there from here?', swap: '換成車站：Can I walk to the station from here?' },
  { id: 'surf-waves', scenario: 'surf', family: 'surf', context: '你剛到海邊，想問今天的浪況。', zh: '今天的浪怎麼樣？', en: 'How are the waves today?', swap: '再問風向「今天是離岸風嗎？」：Is the wind offshore today?' },
  { id: 'surf-entry', scenario: 'surf', family: 'surf', context: '第一次來這個浪點，想問划出去的位置。', zh: '從哪裡划出去比較好？', en: 'Where’s the best place to paddle out?', swap: '再問注意事項「有什麼需要注意的嗎？」：Is there anything I should watch out for?' },
  { id: 'climb-belay', scenario: 'climbing', family: 'climbing', context: '有繩攀登前，你想請夥伴幫忙確保。', zh: '你可以幫我確保嗎？', en: 'Could you belay me?', swap: '補充想爬哪條「我想試這條路線」：I’d like to try this route.' },
  { id: 'climb-beta', scenario: 'climbing', family: 'climbing', context: '朋友剛才完成了這個動作，你想問他怎麼做的。', zh: '這一步你是怎麼過的？', en: 'How did you do this move?', swap: '追問「你剛才左腳放在哪裡？」：Where did you put your left foot?' },
  { id: 'work-bug', scenario: 'work', family: 'work', context: '站會時，你要說明正在處理的問題。', zh: '我正在查 API 為什麼會逾時。', en: 'I’m looking into why the API is timing out.', swap: '換成失敗：I’m looking into why the request is failing.' },
  { id: 'work-ai', scenario: 'work', family: 'work', context: '你向同事解釋下一個測試步驟。', zh: '我想先用幾個真實案例測試這個模型。', en: 'I’d like to test this model with a few real examples first.', swap: '換成流程：I’d like to test this workflow with a few real examples first.' },
  { id: 'daily-weekend', scenario: 'daily', family: 'daily', context: '週末已經結束，你想問朋友剛過去的週末。', zh: '你週末過得怎麼樣？', en: 'How was your weekend?', swap: '接著問：Did you do anything fun?' },
  { id: 'daily-coffee', scenario: 'daily', family: 'daily', context: '你想找朋友喝咖啡。', zh: '你這週有空一起喝咖啡嗎？', en: 'Are you free for coffee sometime this week?', swap: '換成午餐：Are you free for lunch sometime this week?' },
  { id: 'interview-scope', scenario: 'interview', family: 'interview', context: '假設你負責後端與 AI 整合，練習回答面試官；請依自己的經歷修改。', zh: '我主要做後端開發和 AI 功能整合。', en: 'I mainly work on backend development and integrating AI features.', swap: '補充工作方式：I work closely with the product team.' },
  { id: 'interview-debug', scenario: 'interview', family: 'interview', context: '面試官問你怎麼處理系統問題。', zh: '我會先重現問題，再檢查系統紀錄。', en: 'I start by reproducing the issue, then I check the logs.', swap: '補充下一步：Once I find the cause, I test the fix.' },
  { id: 'job-found', scenario: 'daily', family: 'daily', context: '朋友也在找工作，你想問他到目前為止的進度。', zh: '你有找到用英文工作的公司嗎？', en: 'Have you found any companies where people work in English?', swap: '換成遠端工作：Have you found any companies that allow remote work?' },
  { id: 'job-applied', scenario: 'daily', family: 'daily', context: '你想知道朋友有沒有投大公司。', zh: '你有投大公司嗎？', en: 'Have you applied to any big companies?', swap: '換成新創：Have you applied to any startups?' },
  { id: 'job-visited', scenario: 'daily', family: 'daily', context: '你跟朋友分享上週的事。', zh: '我上週去參觀了朋友在東京的辦公室。', en: 'I visited my friend’s office in Tokyo last week.', swap: '換成昨天和台北：I visited my friend’s office in Taipei yesterday.' },
  { id: 'job-interviewed', scenario: 'daily', family: 'daily', context: '朋友問你最近求職的狀況，你是去面試的人。', zh: '我面試了好幾個職缺。', en: 'I’ve interviewed for several jobs.', swap: '換成三個後端職缺：I’ve interviewed for three backend jobs.' },
  { id: 'job-other', scenario: 'daily', family: 'daily', context: '你在比較不同公司的工作方式。', zh: '其他公司還在用舊方法做事。', en: 'Other companies are still doing things the old way.', swap: '換成其他團隊：Other teams are still doing things the old way.' },
  { id: 'job-because', scenario: 'daily', family: 'daily', context: '你向朋友解釋某家公司為什麼工具選擇很少。', zh: '他們只用一種工具，因為有資安顧慮。', en: 'They only use one tool because of security concerns.', swap: '原因換成句子：They only use one tool because they’re worried about security.' },
  { id: 'job-familiar', scenario: 'daily', family: 'daily', context: '你想問朋友對刷題熟不熟。', zh: '你熟 LeetCode 嗎？', en: 'Are you familiar with LeetCode?', swap: '換成框架：Are you familiar with this framework?' },
  { id: 'job-lowball', scenario: 'daily', family: 'daily', context: '你拿到一個 offer，但金額偏低，你在猜對方的想法。', zh: '他們可能只是想壓低 offer。', en: 'They might just be lowballing the offer.', swap: '換成估價：They might just be lowballing the estimate.' },
  { id: 'job-colleague', scenario: 'daily', family: 'daily', context: '朋友提到一家公司，你剛好有認識的人在那裡。', zh: '我有個前同事在那家公司。', en: 'I have a former colleague at that company.', swap: '換成朋友：I have a friend at that company.' },
  { id: 'job-says', scenario: 'daily', family: 'daily', context: '你轉述一位在大公司工作的朋友的看法。', zh: '他說要看你分到哪個專案。', en: 'He says it depends on the project you get.', swap: '換成團隊：He says it depends on the team you get.' },
  { id: 'job-based', scenario: 'daily', family: 'daily', context: '你轉述 HR 解釋為什麼要用英文面試。', zh: '她說有些同事在國外。', en: 'She said some colleagues are based abroad.', swap: '換成具體地點：She said some colleagues are based in Japan.' },
  { id: 'job-interview-english', scenario: 'daily', family: 'daily', context: '你想知道朋友有沒有用英文面試的經驗。', zh: '你有用英文面試過嗎？', en: 'Have you had a job interview in English?', swap: '換成電話面試：Have you had a phone interview in English?' },
  { id: 'job-conversation', scenario: 'daily', family: 'daily', context: '你向朋友解釋 HR 為什麼先用英文問了幾題。', zh: 'HR 只是想確認我能不能用英文對話。', en: 'HR just wanted to check whether I could hold a conversation in English.', swap: '換成日文：HR just wanted to check whether I could hold a conversation in Japanese.' },
  { id: 'job-rounds', scenario: 'daily', family: 'daily', context: '你跟朋友描述某家公司的面試流程。', zh: '面試總共有五輪。', en: 'There were five rounds of interviews.', swap: '換成三輪：There were three rounds of interviews.' },
  { id: 'job-reapply', scenario: 'daily', family: 'daily', context: '你轉述一位朋友每年都去應徵同一家公司的做法。', zh: '他說沒上的話，隔年再投一次。', en: 'He says if he doesn’t get in, he reapplies the next year.', swap: '換成自己：If I don’t get in, I’ll reapply next year.' },
  { id: 'job-ask', scenario: 'daily', family: 'daily', context: '朋友對某家公司有興趣，你認識裡面的人。', zh: '我可以幫你問他一些建議。', en: 'I can ask him for some advice.', swap: '換成資訊：I can ask him for some information.' },
  { id: 'work-fixed', scenario: 'work', family: 'work', context: '站立會議上，你報告昨天完成的事。', zh: '我昨天把登入流程修好了。', en: 'I fixed the login flow yesterday.', swap: '換成上週和付款流程：I fixed the payment flow last week.' },
  { id: 'work-waiting', scenario: 'work', family: 'work', context: '站立會議上，你說明進度被別人的工作卡住。', zh: '我還在等後端的 API。', en: 'I’m still waiting for the backend API.', swap: '換成測試結果：I’m still waiting for the test results.' },
  { id: 'work-deadline', scenario: 'work', family: 'work', context: '主管問你什麼時候可以做完。', zh: '這個今天下班前可以完成。', en: 'I can finish this by the end of the day.', swap: '換成明天之前：I can finish this by tomorrow.' },
  { id: 'work-stuck', scenario: 'work', family: 'work', context: '你向同事說明自己卡在哪一步。', zh: '我卡在權限設定這一步。', en: 'I’m stuck on the permission settings.', swap: '換成部署：I’m stuck on the deployment step.' },
  { id: 'work-repro', scenario: 'work', family: 'work', context: '同事回報了一個問題，你在自己的電腦上試不出來。', zh: '我在本機重現不出這個問題。', en: 'I can’t reproduce the issue locally.', swap: '換成偶爾才出現：I can only reproduce the issue occasionally.' },
  { id: 'work-review', scenario: 'work', family: 'work', context: '你開了一個 PR，想請同事有空時幫忙看。', zh: '你有空可以幫我看一下這個 PR 嗎？', en: 'Could you take a look at this PR when you have a moment?', swap: '換成文件：Could you take a look at this doc when you have a moment?' },
  { id: 'work-walkthrough', scenario: 'work', family: 'work', context: '你看不懂一段別人寫的程式，想請對方說明。', zh: '你可以跟我說明一下這段是怎麼運作的嗎？', en: 'Could you walk me through how this part works?', swap: '換成部署流程：Could you walk me through the deployment process?' },
  { id: 'work-unsure', scenario: 'work', family: 'work', context: '討論做法時，你有疑慮，想提議先小規模試。', zh: '我不太確定這個做法，我們可以先試小一點的範圍嗎？', en: 'I’m not sure about this approach. Could we try it on a smaller scale first?', swap: '換成時程：I’m not sure about this timeline.' },
  { id: 'work-duration', scenario: 'work', family: 'work', context: '主管問這個任務要做多久。', zh: '這個大概需要兩到三天。', en: 'This will probably take two to three days.', swap: '換成一週左右：This will probably take about a week.' },
  { id: 'work-estimate', scenario: 'work', family: 'work', context: '需求還不清楚，你不想太早給時間。', zh: '我需要先確認需求，再給你時間估計。', en: 'I need to confirm the requirements before I give you an estimate.', swap: '先給粗估：I can give you a rough estimate now.' },
  { id: 'interview-years', scenario: 'interview', family: 'interview', context: '面試開場自我介紹；年數是範例，請換成自己的。', zh: '我有五年後端開發的經驗。', en: 'I have five years of experience in backend development.', swap: '換成職稱：I have five years of experience as a backend engineer.' },
  { id: 'interview-current', scenario: 'interview', family: 'interview', context: '你介紹目前的工作。', zh: '我目前在一家做 AI agent 平台的公司工作。', en: 'I currently work for a company that builds an AI agent platform.', swap: '換成公司做的東西：I currently work for a company that builds payment systems.' },
  { id: 'interview-owned', scenario: 'interview', family: 'interview', context: '面試官請你講一個專案，你說明自己負責的部分。', zh: '我負責設計並實作了這個功能。', en: 'I was responsible for designing and building this feature.', swap: '只講設計：I was responsible for designing this API.' },
  { id: 'interview-result', scenario: 'interview', family: 'interview', context: '你說明專案的成果；數字是範例，請換成自己的。', zh: '我們把回應時間從三秒降到一秒以內。', en: 'We reduced the response time from three seconds to under one second.', swap: '只講降幅：We reduced the error rate by 20%.' },
  { id: 'interview-hardest', scenario: 'interview', family: 'interview', context: '面試官問這個專案最難的地方。', zh: '最難的部分是在不停機的情況下搬移資料。', en: 'The hardest part was migrating the data without downtime.', swap: '換成找原因：The hardest part was finding the cause.' },
  { id: 'interview-underestimate', scenario: 'interview', family: 'interview', context: '面試官請你講一次判斷錯誤的經驗。', zh: '我當時低估了這件事的複雜度。', en: 'I underestimated how complex it was.', swap: '換成時間：I underestimated how long it would take.' },
  { id: 'interview-disagree', scenario: 'interview', family: 'interview', context: '面試官問你怎麼處理和同事意見不同。', zh: '我跟同事意見不同，後來我們用資料來決定。', en: 'I disagreed with a colleague, so we used data to make the decision.', swap: '補上主題：A colleague and I disagreed on the approach.' },
  { id: 'interview-since', scenario: 'interview', family: 'interview', context: '你說明那次經驗之後改變的做法。', zh: '從那次之後，我會先寫測試再改程式。', en: 'Since then, I’ve always written tests before I change the code.', swap: '換成確認需求：Since then, I’ve always confirmed the requirements first.' },
  { id: 'interview-ask-team', scenario: 'interview', family: 'interview', context: '面試最後，面試官問你有沒有問題。', zh: '團隊平常是怎麼分工的？', en: 'How does the team divide up the work?', swap: '問得更廣：Can you tell me about the team I’ll be working with?' },
  { id: 'interview-ask-goals', scenario: 'interview', family: 'interview', context: '你想知道到職初期會被期待做到什麼。', zh: '這個職位前三個月最重要的目標是什麼？', en: 'What are the most important goals for this role in the first three months?', swap: '換成第一年：What are the most important goals for this role in the first year?' },
  { id: 'climb-titanium', scenario: 'climbing', family: 'climbing', context: '你在海邊的岩場，上去前想問當地人這條路線的岩栓材質。', zh: '這條路線的岩栓是鈦的嗎？', en: 'Are the bolts on this route titanium?', swap: '換成問有沒有重打過：Has this route been rebolted?' },
  { id: 'climb-sun', scenario: 'climbing', family: 'climbing', context: '你在選岩壁，想避開下午的太陽。', zh: '這面牆下午會曬到太陽嗎？', en: 'Does this wall get the sun in the afternoon?', swap: '換成早上：Does this wall get the sun in the morning?' },
  { id: 'climb-dry', scenario: 'climbing', family: 'climbing', context: '昨天下過雨，你想知道岩壁多久會乾。', zh: '下雨之後這裡要多久才會乾？', en: 'How long does it take to dry after rain?', swap: '問現在乾了沒：Is the rock dry yet?' },
  { id: 'climb-open', scenario: 'climbing', family: 'climbing', context: '你聽說這個岩場關閉過，想先確認。', zh: '這個岩場現在開放嗎？', en: 'Is the crag open right now?', swap: '換成週末：Is the crag open on weekends?' },
  { id: 'climb-register', scenario: 'climbing', family: 'climbing', context: '有些岩場要先登記才能爬，你想確認。', zh: '爬之前需要先登記嗎？', en: 'Do I need to register before climbing?', swap: '問在哪裡登記：Where do I register?' },
  { id: 'climb-fee', scenario: 'climbing', family: 'climbing', context: '你知道這個岩場要收費，但不知道在哪裡付。', zh: '入場費在哪裡付？', en: 'Where do I pay the access fee?', swap: '問多少錢：How much is the access fee?' },
  { id: 'climb-rent', scenario: 'climbing', family: 'climbing', context: '你在岩場旁的攀岩店想租裝備。', zh: '我想租一條繩子和十二支快扣。', en: 'I’d like to rent a rope and twelve quickdraws.', swap: '換成安全帽：I’d like to rent a helmet.' },
  { id: 'climb-rope-length', scenario: 'climbing', family: 'climbing', context: '你只帶了一條六十米的繩子，想確認夠不夠。', zh: '六十米的繩子夠長嗎？', en: 'Is a 60-meter rope long enough?', swap: '換成七十米：Is a 70-meter rope long enough?' },
  { id: 'climb-guidebook', scenario: 'climbing', family: 'climbing', context: '你想在當地買路線指南。', zh: '哪裡買得到最新的指南書？', en: 'Where can I buy the latest guidebook?', swap: '問有沒有賣：Do you sell the latest guidebook?' },
  { id: 'climb-partner', scenario: 'climbing', family: 'climbing', context: '你一個人到岩場或岩館，想找人一起爬。', zh: '我在找繩伴。', en: 'I’m looking for a climbing partner.', swap: '加上時間：I’m looking for a climbing partner for tomorrow.' },
  { id: 'climb-recommend', scenario: 'climbing', family: 'climbing', context: '你想請當地攀岩者推薦路線。', zh: '可以推薦一條 6a 左右的多段路線嗎？', en: 'Can you recommend a multi-pitch route around 6a?', swap: '換成單段：Can you recommend a single-pitch route around 6a?' },
  { id: 'climb-gym-first', scenario: 'climbing', family: 'climbing', context: '你第一次到國外的岩館，在櫃檯。', zh: '我第一次來，需要填表嗎？', en: 'It’s my first time here. Do I need to fill out a form?', swap: '問費用：It’s my first time here. How much is it?' },
  { id: 'climb-slack', scenario: 'climbing', family: 'climbing', context: '你正在爬，需要確保者多給一點繩。', zh: '給繩！', en: 'Slack!', swap: '加上名字避免混淆：Anne, slack!' },
  { id: 'climb-up-rope', scenario: 'climbing', family: 'climbing', context: '你正在爬，繩子太鬆，想請確保者收繩。', zh: '收繩！', en: 'Up rope!', swap: '加上名字避免混淆：Anne, up rope!' },
  { id: 'climb-take', scenario: 'climbing', family: 'climbing', context: '你在岩館爬到頂，想請確保者撐住你並放你下來。', zh: '撐住我，放我下來！', en: 'Take!', swap: '加上名字避免混淆：Anne, take!' },
  { id: 'interview-optimize', scenario: 'interview', family: 'interview', context: '面試官請你用一句話說明現在的工作。', zh: '我負責優化公司的 AI agent 產品。', en: 'I work on improving our company’s AI agent product.', swap: '換成可靠性：I work on improving the reliability of our AI agent product.' },
  { id: 'interview-areas', scenario: 'interview', family: 'interview', context: '面試官追問你做的範圍。', zh: '我做的範圍包含 agent 的 runtime、工具、評估、記憶和成本控制。', en: 'My work covers the agent runtime, tools, evaluation, memory, and cost control.', swap: '只講兩項：My work covers evaluation and cost control.' },
  { id: 'interview-changed', scenario: 'interview', family: 'interview', context: '面試官請你講一次需求變動很大的經驗。', zh: '這個功能四個月內方向改了五次。', en: 'The direction of this feature changed five times in four months.', swap: '換成需求：The requirements changed three times in two months.' },
  { id: 'interview-prod-data', scenario: 'interview', family: 'interview', context: '你說明當時怎麼讓團隊接受比較務實的上限。', zh: '我查了正式環境的資料，才說服團隊把上限定在 10 MB。', en: 'I checked the production data, and that convinced the team to set the limit at 10 MB.', swap: '換成逾時：That convinced the team to set the timeout at 180 seconds.' },
  { id: 'interview-slow-file', scenario: 'interview', family: 'interview', context: '你用一個實測結果說明原本的做法行不通。', zh: '一個 27 MB 的檔案跑了 29 分鐘，只有前 20 頁進到模型。', en: 'A 27 MB file took 29 minutes, and only the first 20 pages reached the model.', swap: '只講時間：A 27 MB file took 29 minutes.' },
  { id: 'interview-forgot', scenario: 'interview', family: 'interview', context: '你說明記憶功能要解決的問題。', zh: '使用者換一個對話，agent 就什麼都不記得。', en: 'When users started a new conversation, the agent forgot everything.', swap: '換成現在的狀況：Now the agent remembers users across conversations.' },
  { id: 'interview-silent', scenario: 'interview', family: 'interview', context: '面試官問這個專案最難找的問題。', zh: '這個 bug 沒有任何錯誤訊息，也沒有 log。', en: 'There were no errors and no logs.', swap: '補上怎麼找到的：I only found it by checking the production data.' },
  { id: 'interview-recoverable', scenario: 'interview', family: 'interview', context: '面試官問你設計 agent 工具時的原則。', zh: '可以恢復的錯誤要回給 agent，不要直接丟進錯誤追蹤。', en: 'Recoverable errors should go back to the agent instead of going straight to error tracking.', swap: '講原因：The agent can shorten the prompt and try again.' },
  { id: 'interview-prompt', scenario: 'interview', family: 'interview', context: '你說明為什麼不能只靠 prompt 控制行為。', zh: '用 prompt 要求模型做的事，不等於保證。', en: 'Telling the model to do something in a prompt is not a guarantee.', swap: '講做法：If it has to happen, I enforce it in code.' },
  { id: 'interview-flag', scenario: 'interview', family: 'interview', context: '面試官問你最大的失誤。', zh: '我改了旗標的語意，卻沒有同步前端。', en: 'I changed the meaning of a flag but didn’t update the frontend.', swap: '講教訓：Now I check every place that writes the flag, not only the places that read it.' },
  { id: 'interview-found-late', scenario: 'interview', family: 'interview', context: '你說明那次失誤多久後才被發現。', zh: '我們在合併兩個月後才發現。', en: 'We only found out two months after the merge.', swap: '換成上線後：We only found out a week after the release.' },
  { id: 'interview-honest', scenario: 'interview', family: 'interview', context: '面試官問到你還沒做好的部分。', zh: '老實說，這部分我們還沒有系統性的評估。', en: 'To be honest, we don’t have a systematic evaluation for this yet.', swap: '補上計畫：It’s the first thing on our roadmap.' },
  { id: 'travel-checkin-bag', scenario: 'travel', family: 'airport', context: '機場報到櫃檯，地勤問你有沒有行李要託運。', zh: '我有一件行李要託運。', en: 'I have one bag to check in.', swap: '沒有託運行李：I don’t have any bags to check in.' },
  { id: 'travel-seat', scenario: 'travel', family: 'airport', context: '地勤問你要靠窗還是靠走道的座位。', zh: '請給我靠走道的座位。', en: 'An aisle seat, please.', swap: '換成靠窗：A window seat, please.' },
  { id: 'travel-transfer-bag', scenario: 'travel', family: 'airport', context: '你要在曼谷轉機，想確認行李會不會直掛到目的地。', zh: '我需要在曼谷領行李嗎？', en: 'Do I have to pick up my bag in Bangkok?', swap: '換成首爾：Do I have to pick up my bag in Seoul?' },
  { id: 'travel-on-time', scenario: 'travel', family: 'airport', context: '你在櫃檯想確認班機有沒有延誤。', zh: '這班飛機準時嗎？', en: 'Is the flight on time?', swap: '問登機門：Which gate does it leave from?' },
  { id: 'travel-reservation', scenario: 'travel', family: 'hotel', context: '你到飯店櫃檯辦理入住。', zh: '我有訂房，訂了三個晚上。', en: 'I have a reservation for three nights.', swap: '報上名字：I have a reservation. The name’s Vincent.' },
  { id: 'travel-room-problem', scenario: 'travel', family: 'hotel', context: '房間的冷氣壞了，你打電話到櫃檯。', zh: '不好意思，我房間的冷氣有問題。', en: 'I’m afraid there’s a problem with the air conditioning in my room.', swap: '換成蓮蓬頭：I’m afraid there’s a problem with the shower in my room.' },
  { id: 'travel-bite', scenario: 'travel', family: 'hotel', context: '你很晚才到飯店，想問櫃檯哪裡還能吃東西。', zh: '附近有地方可以吃點東西嗎？', en: 'Is there anywhere I could get a bite to eat?', swap: '換成買水：Is there anywhere I could buy some water?' },
  { id: 'travel-shuttle', scenario: 'travel', family: 'hotel', context: '你隔天一早要去機場，想問飯店有沒有接駁車。', zh: '你們有到機場的接駁車嗎？', en: 'Do you offer a shuttle service to the airport?', swap: '換成洗衣：Do you offer a laundry service?' },
  { id: 'travel-order', scenario: 'travel', family: 'restaurant', context: '服務生來點餐，你決定好了。', zh: '我要雞肉。', en: 'I’ll have the chicken.', swap: '換成牛肉：I’ll have the beef.' },
  { id: 'travel-sold-out', scenario: 'travel', family: 'restaurant', context: '店員說雞肉賣完了，你改點別的。', zh: '好，那我改點牛肉。', en: 'Okay, I’ll have the beef then.', swap: '換成魚：Okay, I’ll have the fish then.' },
  { id: 'travel-comes-with', scenario: 'travel', family: 'restaurant', context: '你想知道這道主餐有附什麼配菜。', zh: '這個有附什麼？', en: 'What does it come with?', swap: '問有沒有附飯：Does it come with rice?' },
  { id: 'travel-dairy', scenario: 'travel', family: 'restaurant', context: '你有飲食限制，想確認一道菜的成分。', zh: '這道菜裡面有奶製品嗎？', en: 'Does it have any dairy products in it?', swap: '換成花生：Does it have any peanuts in it?' },
  { id: 'travel-split', scenario: 'travel', family: 'restaurant', context: '和朋友吃完飯，帳單來了。', zh: '我們平分帳單好嗎？', en: 'Shall we split the bill?', swap: '說這次我請：I’ll get this.' },
  { id: 'travel-service', scenario: 'travel', family: 'restaurant', context: '你看著帳單，不確定要不要另外給小費。', zh: '服務費有包含在裡面嗎？', en: 'Is service included?', swap: '問早餐：Is breakfast included?' },
  { id: 'travel-which-way', scenario: 'travel', family: 'transport', context: '你在街上向路人問方向。', zh: '請問車站往哪個方向？', en: 'Could you tell me which way the station is?', swap: '換成碼頭：Could you tell me which way the pier is?' },
  { id: 'travel-exact-fare', scenario: 'travel', family: 'transport', context: '你上公車要付現金，手上只有大鈔。', zh: '車資需要剛好的零錢嗎？', en: 'Do I need the exact fare?', swap: '問能不能刷卡：Can I pay by card?' },
] as const;
export type SpeakingEvidence = {
  expression: 'direct' | 'adapted';
  support: string;
  usageNote?: string;
  alternatives?: { en: string; when: string }[];
  article?: string;
  sources: { title: string; url: string }[];
};
const cambridgeGrammar = (slug: string, title: string) => ({ title: `Cambridge：${title}`, url: `https://dictionary.cambridge.org/us/grammar/british-grammar/${slug}` });
const cambridgeWord = (slug: string, title: string) => ({ title: `Cambridge：${title}`, url: `https://dictionary.cambridge.org/us/dictionary/english/${slug}` });
const hereSource = cambridgeGrammar('here-and-there', 'here / there');
const haveSource = cambridgeGrammar('have-got-and-have', 'have');
const thereSource = cambridgeGrammar('there-is-there-s-and-there-are', 'there is / are');
const getSource = cambridgeWord('get', 'get（到達）');
const surfSource = { title: 'Corky Carroll’s Surf School：衝浪用語', url: 'https://www.surfschool.net/blog/surf-lingo-for-beginners/' };
const paddleSource = { title: 'WB Surf Camp：觀察浪點與 paddle-out', url: 'https://wbsurfcamp.com/surfing-new-breaks-how-to-read-the-lineup-before-you-paddle-out/' };
const climbSource = { title: 'REI：攀岩用語', url: 'https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html' };
const fluentuSource = { title: 'FluentU：日常英文例句（商業教學網站）', url: 'https://www.fluentu.com/blog/english/simple-english-sentences/' };
const smalltalkSource = { title: 'British Council：週末閒聊', url: 'https://learnenglish.britishcouncil.org/free-resources/learning-hub/2-small-talk-conversation' };
const perfectSource = cambridgeGrammar('present-perfect-simple-i-have-worked', 'present perfect');
const pastSource = cambridgeGrammar('past-simple-or-present-perfect', 'past simple 或 present perfect');
const applySource = cambridgeWord('apply', 'apply');
const interviewSource = cambridgeWord('interview', 'interview');
const otherSource = cambridgeGrammar('other-others-the-other-or-another', 'other / others');
const becauseSource = cambridgeGrammar('because-because-of-and-cos-cos-of', 'because / because of');
const merriamLowball = { title: 'Merriam-Webster：lowball', url: 'https://www.merriam-webster.com/dictionary/lowball' };
const britishCouncilInterview = { title: 'British Council：How to prepare for a job interview in English', url: 'https://learnenglish.britishcouncil.org/level/improve-your-english-level/how-prepare-job-interview-english' };
const oald = (slug: string, title: string) => ({ title: `Oxford Learner’s：${title}`, url: `https://www.oxfordlearnersdictionaries.com/us/definition/english/${slug}` });
const oaldCould = oald('could', 'could（請求與提議）');
const standupSource = { title: 'Atlassian：站立會議的三個問題', url: 'https://www.atlassian.com/agile/scrum/standups' };
const museSource = { title: 'The Muse：可以問面試官的問題（商業求職網站）', url: 'https://www.themuse.com/advice/51-interview-questions-you-should-be-asking' };
const reiCommands = { title: 'REI：攀岩口令', url: 'https://www.rei.com/learn/expert-advice/communication-climbing.html' };
const mpRailay = { title: 'Mountain Project：Railay／Tonsai（岩栓警告）', url: 'https://www.mountainproject.com/area/105894664/laem-phra-nang-railay-tonsai' };
const mpGozen = { title: 'Mountain Project：Gozen-iwa（登記與費用）', url: 'https://www.mountainproject.com/area/120393050/gozen-iwa' };
const commandNote = 'REI 提醒：離開地面前要先和繩伴約好口令；聽不清楚時加上對方名字。各地、各岩館用法可能不同，這張卡只練說法，不能取代你和繩伴的確認。';
const adapted = (sources: SpeakingEvidence['sources'], support: string, usageNote?: string): SpeakingEvidence => ({ expression: 'adapted', sources, support, usageNote });
const premierRestaurants = { title: 'British Council × Premier League：Travel & Tourism: Restaurants', url: 'https://premierleague.britishcouncil.org/english/podcasts/travel-and-tourism/travel-tourism-restaurants' };
const premierHotels = { title: 'British Council × Premier League：Travel & Tourism: Hotels', url: 'https://premierleague.britishcouncil.org/english/podcasts/travel-and-tourism/travel-tourism-hotels' };
const premierTransport = { title: 'British Council × Premier League：Travel & Tourism: Transport', url: 'https://premierleague.britishcouncil.org/english/podcasts/travel-and-tourism/travel-tourism-transport' };
const voaLesson23 = { title: 'VOA Let’s Learn English 第 23 課：What Do You Want?', url: 'https://learningenglish.voanews.com/a/lets-learn-english-lesson-23-what-do-you-want/3413753.html' };
const stateDialogs = { title: '美國國務院：Dialogs for Everyday Use', url: 'https://americanenglish.state.gov/resources/dialogs-everyday-use' };
const ooeCheckin = { title: 'Oxford Online English（語言學校）：Checking In At The Airport', url: 'https://www.oxfordonlineenglish.com/checking-in-airport' };
const ooeHotel = { title: 'Oxford Online English（語言學校）：Hotel English', url: 'https://www.oxfordonlineenglish.com/hotel-english' };
const ooeOrdering = { title: 'Oxford Online English（語言學校）：Ordering in a Restaurant', url: 'https://www.oxfordonlineenglish.com/ordering-in-a-restaurant-listening-lesson-b1-b2' };
const ooeBill = { title: 'Oxford Online English（語言學校）：Paying a Restaurant Bill', url: 'https://www.oxfordonlineenglish.com/paying-a-restaurant-bill-listening-lesson-a2' };
const espressoAirport = { title: 'Espresso English（個人教師網站）：Airport English', url: 'https://www.espressoenglish.net/travel-english-conversations-in-the-airport/' };
const onestopCheckin = { title: 'onestopenglish（Macmillan）：報到流程教案', url: 'https://www.onestopenglish.com/download?ac=20999' };
const direct = (sources: SpeakingEvidence['sources'], support: string, usageNote?: string): SpeakingEvidence => ({ expression: 'direct', sources, support, usageNote });
export const speakingEvidence: Record<typeof speakingCards[number]['id'], SpeakingEvidence> = {
  map: adapted([haveSource, hereSource], '來源支持 have 表示持有、here 表示說話者所在地；地圖與筆的例句依此改寫。'),
  'ticket-present': adapted([hereSource, haveSource], '來源示範 Here’s + 物品，以及找到物品時的 Here it is；票與護照是改寫例句。', '這裡是在出示票，可以說 Here’s my ticket / Here is my ticket。剛找到票時可說 Here it is!；交給對方時可說 Here you are。My ticket is here 強調位置，I have my ticket here 強調自己持有票。'),
  charger: adapted([haveSource, hereSource], '來源支持 have 與 here 的用法；充電器與行動電源是改寫例句。'),
  cafe: adapted([thereSource, hereSource], '來源支持介紹某處有某物，以及 near / around here；店家例句依此改寫。'),
  bus: adapted([thereSource, hereSource], '來源支持 there is 表示存在、over there 指另一處；站牌與店家例句依此改寫。'),
  toilet: adapted([thereSource, hereSource], '來源支持 there is / here 的用法；問附近設施的句子依此改寫。'),
  station: adapted([getSource, hereSource], '來源支持 get to 表示到達，以及 here 指目前位置；車站與機場問路句是組合改寫。'),
  museum: adapted([getSource, hereSource], '來源支持 get to 的到達意思；博物館與飯店句是表達目的地的改寫。', '這句對朋友說自己的目的地。若想請人指路，改問 How do I get to the museum from here?'),
  walk: adapted([hereSource, cambridgeWord('walk', 'walk')] , '來源支持 here / there 的地點用法；步行詢問是改寫例句。', 'there 已經表示「到那裡」，說 walk there；具名目的地則說 walk to the station。'),
  'surf-waves': adapted([surfSource], '來源說明浪況與 offshore 的衝浪用語；兩個完整問句是自行改寫。', '追問離岸風是在問風向，與問浪況是不同問題；風向本身不能判斷是否適合下水。'),
  'surf-entry': adapted([paddleSource], '來源直接建議向當地人詢問 paddle-out 位置；完整問句與注意事項追問是改寫。', 'paddle out 是趴在板上划出去，不只是在岸邊下水。「best」是請對方提供建議，不能保證安全。'),
  'climb-belay': adapted([climbSource, { title: 'British Council：could you 請求', url: 'https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/requests-offers-invitations' }, cambridgeGrammar('would-like', 'would like'), { title: 'REI：攀岩溝通', url: 'https://www.rei.com/learn/expert-advice/communication-climbing.html' }], '來源支持 belay / route 用語與 could you 請求句型；完整例句是改寫。', '這是在請人擔任確保者，不是確認準備完成的攀登口令，也不是抱石的 spotting。補充想爬哪條不能取代確保請求。'),
  'climb-beta': adapted([climbSource, { title: 'REI：攀岩動作與腳點', url: 'https://www.rei.com/learn/expert-advice/climbing-techniques.html' }], '來源支持 move 與腳點的專業意思；詢問朋友剛才動作的問句是改寫。', 'did 問朋友已經做過的動作；腳點句是更具體的追問。'),
  'work-bug': adapted([cambridgeWord('look-into', 'look into'), { title: 'MDN：逾時的技術意思', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/504' }], '來源支持 look into 表示調查，以及 timeout 用語；API 與 request 句是改寫。', '逾時不一定是 HTTP 504；這裡只練習描述正在調查的問題。'),
  'work-ai': adapted([cambridgeGrammar('would-like', 'would like'), { title: 'Cloudflare：AI models', url: 'https://developers.cloudflare.com/workers-ai/models/' }], '來源支持 would like to 表達想做某事，以及 model 技術用語；測試句是改寫。', '這是提出下一步的例句，沒有宣稱這是模型評估的最佳方法。'),
  'daily-weekend': { expression: 'direct', sources: [fluentuSource, smalltalkSource, cambridgeWord('anything', 'anything')], support: 'FluentU 有主句原文；British Council 支持聊已結束的週末。追問是依 anything 用法改寫。', usageNote: 'was 問剛過去的週末；要問未來計畫，需要換句子。' },
  'daily-coffee': adapted([cambridgeWord('free', 'free（有空）'), fluentuSource], '來源支持 free 表示有空，以及咖啡、午餐邀約；完整句是組合改寫。', 'sometime this week 沒有指定時間；對方答應後再約日期。'),
  'interview-scope': adapted([{ title: 'MDN：後端開發', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction' }, { title: 'Cambridge：work closely', url: 'https://dictionary.cambridge.org/us/dictionary/learner-english/closely' }], '來源支持 backend 與 work closely 的意思；完整職責介紹是自行編寫的角色練習。', '請依自己的真實工作修改；這不是已核對的履歷敘述。'),
  'interview-debug': adapted([cambridgeWord('start', 'start by'), cambridgeGrammar('once', 'once'), { title: 'Cloudflare：Workers Logs', url: 'https://developers.cloudflare.com/workers/observability/logs/workers-logs/' }], '來源支持 start by + -ing、once 表示某事之後，以及 logs 用語；除錯步驟句是改寫。', '這是示範如何描述自己的流程，不代表所有問題都必須先重現。'),
  'job-found': { ...adapted([perfectSource], '來源說明 present perfect 用來談到目前為止的經驗，並有 Have you ever tried… 例句；找公司的問句是改寫。', '問到目前為止的進度用 Have you found，不用 Do you find。'), alternatives: [{ en: 'Did you find any last month?', when: '問一段已經結束的時間，意思不同' }] },
  'job-applied': { ...adapted([applySource, perfectSource], '字典列出 apply to sb/sth 與 apply for a job；套用到公司的問句是改寫。', 'apply to 接公司，apply for 接職缺。'), alternatives: [{ en: 'Have you applied for any jobs at big companies?', when: '同一情境，重點放在職缺' }] },
  'job-visited': adapted([pastSource], '來源說明有明確過去時間（如 last week）時用 past simple；辦公室句是改寫。', '有 last week 就用過去式 visited，不用 visit。'),
  'job-interviewed': { ...adapted([interviewSource, perfectSource], '字典有 I interviewed for several jobs…；這裡改成 present perfect 表示到目前為止。', 'interview 後面直接接人，意思是你在面試對方。自己去面試用 interview for + 職缺。'), alternatives: [{ en: 'I’ve interviewed for jobs with several companies.', when: '同一情境，補上公司；字典有 interviewed for a number of jobs with banks…' }, { en: 'I’ve had interviews with several companies.', when: '同一情境，用名詞 interview；依字典名詞例句改寫' }, { en: 'I’ve interviewed several candidates.', when: '你是面試官，意思相反' }] },
  'job-other': { ...adapted([otherSource], '來源說明 other 當限定詞沒有複數形、後面接複數名詞；公司句是改寫。', '不說 others companies。'), alternatives: [{ en: 'Others are still doing things the old way.', when: '前面已經提過公司時，others 單獨當代名詞' }] },
  'job-because': { ...adapted([becauseSource], '來源說明 because of 是介系詞、後面接名詞；because 後面接子句。資安句是改寫。', 'because of 後面不接完整句子。'), alternatives: [{ en: 'They only use one tool because they’re worried about security.', when: '同一個意思，原因改用句子表達' }] },
  'job-familiar': adapted([cambridgeWord('familiar', 'be familiar with')], '字典列出 be familiar with something/someone；問句是改寫。', 'familiar 是形容詞，問句用 Are you，不用 Do you。'),
  'job-lowball': { ...adapted([cambridgeWord('lowball', 'lowball'), merriamLowball, cambridgeGrammar('might', 'might')], 'Cambridge 標 lowball 為美式非正式，例句受詞是 offers；Merriam-Webster 另有接人的定義與例句 lowballed him in contract negotiations。might 表示較弱的可能性。整句是改寫。', '英文要有主詞 they。lowball 是非正式用字，適合朋友之間。'), alternatives: [{ en: 'They might just be lowballing me.', when: '同一情境，受詞從金額換成被壓價的人' }] },
  'job-colleague': adapted([cambridgeGrammar('at-on-and-in-place', 'at / on / in（地點）')], '來源說明 at 用於公司與工作場所，例句 working at Microsoft；前同事句是改寫。', '在某家公司工作用 at，不用 in。'),
  'job-says': adapted([cambridgeGrammar('present-simple-i-work', 'present simple')], '來源說明第三人稱單數動詞加 -s；轉述句是改寫。', 'says 和 depends 都要加 -s。'),
  'job-based': adapted([cambridgeWord('based', 'based')], '字典有 be based in 的例句；based abroad 是依此套用。', 'colleagues 要複數，後面要有 are。'),
  'job-interview-english': { expression: 'direct', sources: [britishCouncilInterview, cambridgeWord('in', 'in（語言）'), perfectSource], support: 'British Council 教材直接問學習者 Have you had a job interview in English?；Cambridge 的 in 有 They spoke in Russian the whole time。', usageNote: '語言前面用 in。問到目前為止的經驗用 Have you had。' },
  'job-conversation': adapted([cambridgeWord('conversation', 'conversation'), cambridgeWord('in', 'in（語言）')], '字典列出 hold/carry on a conversation；整句是改寫。', 'HR 是過去做的事，用 wanted。'),
  'job-rounds': adapted([cambridgeWord('round', 'round')], '字典有 another round of talks、a round of meetings；套用到面試是改寫。', 'rounds 要複數。'),
  'job-reapply': adapted([cambridgeWord('reapply', 'reapply'), cambridgeGrammar('present-simple-i-work', 'present simple')], '字典定義 reapply 為再次正式申請（例如職缺），例句 reapplying for the job；整句是改寫。', 'says、reapplies 都是第三人稱單數。'),
  'job-ask': adapted([cambridgeWord('ask', 'ask')], '字典句型 ask someone for something，例句 ask your accountant for some financial advice；整句是改寫。', 'ask 後面先接人，再用 for 接想要的東西。'),
  'work-fixed': { ...adapted([oald('fix_1', 'fix'), standupSource], '字典有 I’ve fixed the problem、find and fix the bug；Atlassian 列出站立會議會講昨天做了什麼。登入流程句是改寫。', '有 yesterday 就用過去式 fixed。'), alternatives: [{ en: 'I’ve fixed the login flow.', when: '沒有提時間，重點是現在已經修好；不能再加 yesterday' }] },
  'work-waiting': adapted([oald('wait_1', 'wait')], '字典有 I’m still waiting for the results of my blood test；等 API 的句子是改寫。', 'wait 後面要有 for 才能接等的東西。'),
  'work-deadline': adapted([oald('by_1', 'by（期限）')], '字典定義 by 為不晚於提到的時間，例句 Can you finish the work by five o’clock?、I’ll have it done by tomorrow；下班前的句子是改寫。', 'by 是期限，表示在那個時間點之前完成。'),
  'work-stuck': { ...adapted([oald('stuck_1', 'stuck'), standupSource], '字典列出 stuck (on something)，例句 I got stuck on the first question；權限設定句是改寫。', 'stuck 是形容詞，前面要有 I’m。'), alternatives: [{ en: 'The permission settings are blocking me.', when: '同一情境，主詞換成擋住你的東西；依 Atlassian 的 What issues are blocking me? 改寫' }] },
  'work-repro': { ...adapted([{ title: 'Mozilla：Bug Writing Guidelines', url: 'https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html' }, { title: 'GitHub Docs：Checking out pull requests locally', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/checking-out-pull-requests-locally' }], 'Mozilla 指引有 If you can’t reproduce the problem、If you can reproduce occasionally；GitHub 文件用 locally 指自己的機器。整句是改寫。', '這兩個是技術文件，支持術語；學習字典的 reproduce 沒有收軟體問題的用法。'), alternatives: [{ en: 'I can only reproduce the issue occasionally.', when: '有時候可以重現，意思不同' }] },
  'work-review': adapted([oald('moment', 'moment'), oald('look_2', 'look（名詞）'), oaldCould], '字典有 Could you look through this report when you have a spare moment? 與 Take a look at these figures!；PR 句是組合改寫。', 'Could you 是請對方幫忙；when you have a moment 表示不急。'),
  'work-walkthrough': adapted([{ title: 'Cambridge：walk someone through something', url: 'https://dictionary.cambridge.org/us/dictionary/english/walk-through' }, oaldCould], 'Cambridge 定義為慢慢仔細地解釋或示範，例句 He’ll walk you through the procedure；整句是改寫。Cambridge 這頁只讀到詞條片段，未讀整頁。', 'walk 後面先接人，再接 through。'),
  'work-unsure': adapted([oald('sure_1', 'sure'), oald('scale_1', 'scale'), oaldCould], '字典有 I’m not so sure about that one、on a small scale、Could we stop by next week?；整句是組合改寫。', '先說自己不確定，再用 Could we 提議。語氣比較緩和是自己的判斷，字典只支持句型。'),
  'work-duration': adapted([oald('take_1', 'take（時間）'), oald('probably', 'probably')], '字典說 take 用來講做某事需要的時間，例句 That should only take you ten minutes；probably 例句 It’ll probably be OK。整句是改寫。', 'take 後面一定要有時間。'),
  'work-estimate': { ...adapted([oald('estimate_2', 'estimate（名詞）'), oald('before_2', 'before（連接詞）'), oald('requirement', 'requirement')], '字典有 I can give you a rough estimate of…、Do it before you forget、meet your requirements；整句是組合改寫。', 'before 後面接完整句子；requirements 通常用複數。'), alternatives: [{ en: 'I can give you a rough estimate now.', when: '還沒確認需求，但願意先給粗估，意思不同' }] },
  'interview-years': { ...adapted([oald('experience_1', 'experience')], '字典有 experience in the field of artificial intelligence、I have over ten years’ experience as a teacher、years of experience；整句是改寫。', '領域用 in，職稱用 as。年數是範例，請換成自己的。'), alternatives: [{ en: 'I have five years of experience as a backend engineer.', when: '同一情境，重點從領域換成職稱' }] },
  'interview-current': { ...adapted([oald('work_1', 'work'), oald('currently', 'currently'), oald('build_1', 'build'), oald('at', 'at')], '字典有 She works for an engineering company、We build computer systems for large companies；整句是改寫。'), alternatives: [{ en: 'I currently work at a company that builds an AI agent platform.', when: '同一情境；字典說 at 用來講某人在哪裡工作' }] },
  'interview-owned': { ...adapted([oald('responsible', 'responsible'), oald('design_2', 'design'), oald('implement_1', 'implement')], '字典有 Mike is responsible for designing the entire project、He designed and built his own house；整句是改寫。', 'responsible for 後面接 V-ing。字典的 implement 只有政策、決策的例句，所以主句用 build。'), alternatives: [{ en: 'I designed and built this feature.', when: '同一情境，直接說自己做了，比較短' }] },
  'interview-result': { ...adapted([oald('reduce', 'reduce'), oald('under_1', 'under')], '字典有 The number of employees was reduced from 40 to 25、Costs have been reduced by 20%；under 表示少於。整句是改寫。', '數字是範例，請換成自己的真實數字。'), alternatives: [{ en: 'We reduced the response time by two seconds.', when: '只講降了多少，沒有前後的數字' }] },
  'interview-hardest': adapted([oald('part_1', 'part'), oald('migrate', 'migrate'), oald('downtime', 'downtime')], '字典有 The worst part was having to wait three hours in the rain、the hard part；migrate 有電腦領域的意思，downtime 是電腦沒有運作的時間。整句是改寫。', '字典的 migrate 受詞是程式或硬體，用在資料上是套用。'),
  'interview-underestimate': adapted([oald('underestimate_1', 'underestimate')], '字典列出 underestimate what, how, etc.，例句 We underestimated how long it would take；複雜度句是改寫。', 'how 後面接形容詞再接主詞和動詞：how complex it was。'),
  'interview-disagree': { ...adapted([oald('disagree', 'disagree'), oald('decision', 'decision')], '字典有 I must respectfully disagree with my colleague、Victoria and I obviously disagree on this issue、made the decision；整句是改寫。', 'disagree with 接人，disagree on 接主題。'), alternatives: [{ en: 'A colleague and I disagreed on the approach.', when: '同一情境，補上意見不同的主題' }] },
  'interview-since': adapted([oald('since_1', 'since'), oald('before_2', 'before（連接詞）')], '字典說 since 搭配現在完成式，例句 That was years ago. I’ve changed jobs since then；整句是改寫。', 'since then 表示從那時到現在，這裡用現在完成式 I’ve always written。'),
  'interview-ask-team': { ...adapted([oald('divide_1', 'divide'), museSource], '字典有 We divided the work between us、Profits were divided up among the staff；The Muse 建議面試時問團隊相關問題。整句是改寫。'), alternatives: [{ en: 'Can you tell me about the team I’ll be working with?', when: '問得比較廣，不只分工；The Muse 原句' }] },
  'interview-ask-goals': { ...adapted([museSource, oald('role', 'role'), oald('goal', 'goal')], 'The Muse 有 What are the most important things you’d like to see someone accomplish in the first 30, 60, and 90 days on the job?；這句是比較短的改寫。字典支持 role 與 goal 的字義。'), alternatives: [{ en: 'What are the most important things you’d like to see someone accomplish in the first 30, 60, and 90 days on the job?', when: '同一情境，問得更細；The Muse 原句' }] },
  'climb-titanium': adapted([mpRailay, climbSource, oald('titanium', 'titanium')], 'Mountain Project 警告海岸附近的不鏽鋼岩栓不可信，並說多數熱門路線已重打（rebolted）；REI 定義 sport climbing 使用預先設置的 bolts。完整問句是改寫。', '這句只是練習怎麼問。對方的回答和書上的標示都可能過時，上去前要自己確認。'),
  'climb-sun': adapted([oald('sun_1', 'sun')], '字典有 This room gets the sun in the mornings；把 room 換成 wall、早上換成下午是改寫。', 'get the sun 是「曬得到太陽」。'),
  'climb-dry': adapted([oald('take_1', 'take（時間）'), oald('dry_3', 'dry（動詞）')], '字典有 It takes about half an hour to get to the airport、hung it out to dry；整句是組合改寫。', 'dry 在這裡是動詞「變乾」。'),
  'climb-open': adapted([oald('open_1', 'open'), climbSource], '字典有 Is the museum open on Sundays?；REI 定義 crag 為小岩壁或攀岩區。整句是改寫。', 'crag 是攀岩者對岩場的說法。'),
  'climb-register': adapted([mpGozen, oald('register_1', 'register')], 'Mountain Project 的岩場說明寫 Please register your name and starting time in the notebook；字典有 You can also register online。問句是改寫。', '各岩場規定不同，這句只是練習怎麼問。'),
  'climb-fee': { ...adapted([mpGozen, oald('fee', 'fee'), oald('pay_1', 'pay')], 'Mountain Project 的岩場說明寫 paid the access fees；字典有 There is no entrance fee to the gallery。問句是改寫。'), alternatives: [{ en: 'Where do I pay the entrance fee?', when: '同一情境；岩館或園區常說 entrance fee' }] },
  'climb-rent': { ...adapted([oald('rent_2', 'rent（動詞）'), climbSource, cambridgeGrammar('would-like', 'would like')], '字典有 to rent a house、We’re looking for a house to rent；REI 定義 quickdraw。整句是改寫。', '字典說英式英語短期租用常說 hire。'), alternatives: [{ en: 'I’d like to hire a rope and twelve quickdraws.', when: '同一情境，英式說法；字典例句 We can hire bikes for a day' }] },
  'climb-rope-length': adapted([oald('enough_3', 'enough（副詞）')], '字典有 This house isn’t big enough for us、long enough；繩長問句是改寫。', 'enough 放在形容詞後面：long enough。'),
  'climb-guidebook': adapted([oald('latest_1', 'latest'), oald('guidebook', 'guidebook'), oald('buy_1', 'buy')], '字典有 his latest book；guidebook 是旅遊或活動指南。整句是改寫。', 'latest 是「最新的」，不是「最晚的」。'),
  'climb-partner': adapted([oald('look_1', 'look for'), oald('partner_1', 'partner'), reiCommands], '字典有 Are you still looking for a job?、a dance/tennis partner；REI 文章用 climbing partner 稱呼繩伴。整句是改寫。', '找到繩伴不代表對方的確保能力已確認，開始前仍要互相檢查。'),
  'climb-recommend': adapted([oald('recommend', 'recommend'), climbSource, oald('around_2', 'around（大約）')], '字典有 Can you recommend a good hotel?、He arrived around five o’clock；REI 定義 multi-pitch 為超過一個繩長的路線。整句是改寫。', 'around 放在難度前面表示「大約」。'),
  'climb-gym-first': adapted([oald('first_1', 'first'), oald('form_1', 'form')], '字典有 for the first time、to fill out a form（北美說法）；整句是改寫。', '字典標 fill in a form 是英式說法。'),
  'climb-slack': { expression: 'direct', sources: [reiCommands], support: 'REI 原文：Climber: Slack! The climber needs extra rope…', usageNote: commandNote },
  'climb-up-rope': { expression: 'direct', sources: [reiCommands], support: 'REI 原文：Climber: Up rope! The climber no longer needs the slack in the rope. Asks belayer to take it in.', usageNote: commandNote },
  'climb-take': { expression: 'direct', sources: [reiCommands], support: 'REI 原文：Take! Used in climbing gyms by the climber at the top of a route, it asks the belayer to take the climber’s weight on the rope and lower him down. REI 也寫傳統攀登不用 Take。', usageNote: commandNote },
  'interview-optimize': adapted([oald('improve', 'improve'), oald('work_1', 'work')], '字典定義 improve 為讓某物比以前更好；整句是改寫。', '產品本來就存在，所以用 improve，不用 build。'),
  'interview-areas': adapted([oald('cover_1', 'cover')], '字典有 cover something：to include something，例句 The survey covers all aspects of the business；整句是改寫。', 'runtime、evaluation 等是技術用語，字典只支持 cover 的句型。'),
  'interview-changed': adapted([oald('direction', 'direction'), oald('time_1', 'time（次數）')], '字典有 a radical change of direction、He failed his driving test three times；整句是改寫。', '次數用 times，期間用 in。'),
  'interview-prod-data': adapted([oald('convince', 'convince'), oald('limit_1', 'limit')], '字典有 I’ve been trying to convince him to see a doctor、The EU has set strict limits on levels of pollution；整句是改寫。', 'convince 後面先接人，再接 to + 動詞。set the limit at + 數字 的 at 沒有查到例句。'),
  'interview-slow-file': adapted([oald('take_1', 'take（時間）'), oald('only_2', 'only'), oald('reach_1', 'reach')], '字典有 It took her three hours to repair her bike、Only five people turned up；reached the model 是把 reach 的「到達」套用到技術情境。', '數字來自自己的實測，換情境時要換成自己的。'),
  'interview-forgot': adapted([oald('forget', 'forget'), oald('conversation', 'conversation')], '字典有 forget 的過去式 forgot 與 a phone conversation；整句是改寫。', '描述過去的問題用過去式 started、forgot。'),
  'interview-silent': adapted([oald('error', 'error'), thereSource], '字典有 There are too many errors in your work；log 的軟體用法字典沒有收。整句是改寫。', '過去的事用 There were。'),
  'interview-recoverable': adapted([oald('instead', 'instead'), oald('error', 'error')], '字典有 instead 的用法與 error 的字義；recoverable、error tracking 是技術用語，字典沒有查。整句是改寫。', 'instead of 後面接 V-ing。'),
  'interview-prompt': adapted([oald('tell', 'tell'), oald('guarantee_1', 'guarantee')], '字典說 tell 可用來給指示，例句 The doctor told me to stay in bed；guarantee 是承諾某事會發生。整句是改寫。', 'tell 後面先接對象，再接 to + 動詞。'),
  'interview-flag': adapted([oald('meaning', 'meaning'), oald('update_1', 'update')], '字典有 What’s the meaning of this word?、It’s about time we updated our software；flag 的軟體用法字典沒有收。整句是改寫。', 'but 後面的 didn’t 也是過去式。'),
  'interview-found-late': adapted([oald('find_1', 'find out'), oald('only_2', 'only')], '字典列出 find out (about something)；merge 的軟體用法字典只有「合併」的一般義。整句是改寫。', 'only 放在動詞前，表示「直到那時才」是自己的套用。'),
  'interview-honest': adapted([oald('honest', 'honest'), oald('yet_1', 'yet'), oald('systematic', 'systematic'), oald('evaluation', 'evaluation')], '字典有 To be honest, it was one of the worst books I’ve ever read、I haven’t received a letter from him yet、a systematic approach；整句是組合改寫。', 'yet 放在否定句的句尾。'),
  'travel-checkin-bag': adapted([ooeCheckin, onestopCheckin, espressoAirport], '三份教材都教報到時的行李問答：How many bags will you be checking in?（Oxford Online English）、Are you checking in any bags?（onestopenglish）、How many bags can I check?（Espresso English）。這張卡是旅客的回答，依這些問句改寫。', 'check in 可以接行李；美式也說 check a bag。'),
  'travel-seat': adapted([onestopCheckin], '教材列出地勤會問的 Would you like a window seat or an aisle seat?；這張卡是旅客的回答，自行組成。', '直接說座位加 please 就可以。'),
  'travel-transfer-bag': { ...adapted([ooeCheckin, espressoAirport], 'Oxford Online English 的對話有 do I have to pick up my bag in Dubai?；Espresso English 有 Will my luggage go straight through, or do I need to pick it up in [Chicago]?。這張卡只換了城市。', '對方可能回答 It’s checked through（直掛到目的地）。'), alternatives: [{ en: 'Will my luggage go straight through?', when: '同一情境，換個問法；Espresso English 的說法' }] },
  'travel-on-time': direct([espressoAirport], 'Espresso English 原句：Is the flight on time?，並說明對方會回答 Yes 或 There’s a 20-minute delay。只有這一份來源，而且是個人教師網站。'),
  'travel-reservation': { ...adapted([premierHotels, ooeHotel], 'British Council 的角色扮演有 We have a reservation for five nights；Oxford Online English 有 I have a reservation; the name’s Sarah Banks。這張卡把主詞與天數換掉。'), alternatives: [{ en: 'I have a reservation. The name’s Vincent.', when: '同一情境，直接報名字；依 Oxford Online English 的說法' }] },
  'travel-room-problem': { ...adapted([premierHotels, ooeHotel], 'British Council 的角色扮演有 I’m afraid there is a problem with my TV；Oxford Online English 教 There’s an issue with the sink in the bathroom。這張卡把東西換成冷氣。', 'I’m afraid 讓抱怨比較委婉。'), alternatives: [{ en: 'There’s an issue with the air conditioning in my room.', when: '同一情境；Oxford Online English 的說法' }] },
  'travel-bite': direct([premierHotels], 'British Council 的角色扮演原句：Is there anywhere we could get a bite to eat?。這張卡只把 we 換成 I。', 'a bite to eat 是口語，指簡單吃點東西。'),
  'travel-shuttle': adapted([ooeHotel], 'Oxford Online English 的對話有 I need to go to the airport on Wednesday morning. Do you offer a shuttle service?；這張卡加上 to the airport。只有這一份來源，是語言學校。', 'shuttle 是往返兩地的接駁車。'),
  'travel-order': { ...direct([espressoAirport, voaLesson23, stateDialogs], '三份教材都用 I’ll have 點餐：Espresso English 原句 I’ll have the chicken；VOA 第 23 課 I’ll have the shrimp；美國國務院的對話 I’ll have tomato soup, roast beef…。'), alternatives: [{ en: 'I’m going to have the chicken.', when: '同一情境；British Council 的角色扮演用 I’m going to have the…' }] },
  'travel-sold-out': direct([voaLesson23], 'VOA 第 23 課原句：Oh, you’re out of shrimp. Okay, I’ll have the beef then.。店員的說法是 We’re out of chicken。', '聽到 We’re out of… 就是賣完了。'),
  'travel-comes-with': direct([ooeOrdering], 'Oxford Online English 的對話原句：what does it come with?，服務生回答 You get chips and a salad。只有這一份來源，是語言學校。'),
  'travel-dairy': direct([premierRestaurants, ooeOrdering], 'British Council 的角色扮演原句：Does it have any dairy products in it?。Oxford Online English 的對話則是服務生問 are there any dietary requirements I need to know about?'),
  'travel-split': { ...direct([premierRestaurants, ooeBill], 'British Council 的角色扮演原句：Shall we split the bill?；Oxford Online English 的對話是 shall we split it?。兩份教材都出現。', 'British Council 同一段對話裡，對方回答 I’ll get this. My treat.'), alternatives: [{ en: 'Shall we split it?', when: '同一情境，帳單已經在眼前' }] },
  'travel-service': direct([ooeBill], 'Oxford Online English 的對話原句：is service included?。只有這一份來源，是語言學校。', '英國常把服務費直接算進帳單；美國的做法不同，這句不一定適用。這是自己的補充，教材沒有寫。'),
  'travel-which-way': adapted([stateDialogs], '美國國務院的對話有 Could you tell me which way Dobson’s bookstore is?；這張卡把地點換成車站。那份教材寫於 1972 年；讀的是轉載版。', '子句裡的語序是 the station is，不是 is the station。'),
  'travel-exact-fare': adapted([premierTransport], 'British Council 的角色扮演有 they only accept the exact fare if you pay in cash，並說明 bus fare、change 這些字；問句是自行組成。', 'fare 是車資；exact fare 是不找零的剛好金額。'),
};
export type Rating = 0 | 1 | 2;
export type CardProgress = { due: number; reviewed: number; rating: Rating; streak: number };
export type SpeakingProgress = Record<string, CardProgress>;
export const SPEAKING_STORAGE_KEY = 'quidproquo-speaking-v1';
const day = 86_400_000;
export function scheduleReview(previous: CardProgress | undefined, rating: Rating, now: number): CardProgress {
  const streak = rating === 2 ? (previous?.streak ?? 0) + 1 : 0;
  const delay = rating === 0 ? 10 * 60_000 : rating === 1 ? day : Math.min(30, 3 * 2 ** Math.min(streak - 1, 4)) * day;
  return { due: now + delay, reviewed: now, rating, streak };
}
export function parseProgress(raw: string | null): SpeakingProgress {
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const result: SpeakingProgress = {};
    for (const card of speakingCards) {
      const entry = value[card.id];
      if (entry && Number.isSafeInteger(entry.due) && entry.due >= 0 && Number.isSafeInteger(entry.reviewed) && entry.reviewed >= 0 && [0, 1, 2].includes(entry.rating) && Number.isSafeInteger(entry.streak) && entry.streak >= 0 && entry.streak <= 100_000) result[card.id] = { due: entry.due, reviewed: entry.reviewed, rating: entry.rating, streak: entry.streak };
    }
    return result;
  } catch { return {}; }
}
export function selectSession(progress: SpeakingProgress, now: number, mode: 'due' | 'all', scenario?: SpeakingScenario) {
  return speakingCards.filter(card => (!scenario || card.scenario === scenario) && (mode === 'all' || !progress[card.id] || progress[card.id].due <= now)).map(card => card.id);
}
