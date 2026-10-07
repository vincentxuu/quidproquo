export const speakingScenarios = [
  { id: 'travel', title: '旅遊', subtitle: '地點與移動' },
  { id: 'surf', title: '衝浪', subtitle: '看浪況、問下水位置' },
  { id: 'climbing', title: '攀岩', subtitle: '聊路線、請人確保' },
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
  { id: 'interview-current', scenario: 'interview', family: 'interview', context: '你介紹目前的工作；公司類型是範例，請換成自己的。', zh: '我目前在一家做 AI 客服的公司工作。', en: 'I currently work for a company that builds AI customer service tools.', swap: '換成公司做的東西：I currently work for a company that builds payment systems.' },
  { id: 'interview-owned', scenario: 'interview', family: 'interview', context: '面試官請你講一個專案，你說明自己負責的部分。', zh: '我負責設計並實作了這個功能。', en: 'I was responsible for designing and building this feature.', swap: '只講設計：I was responsible for designing this API.' },
  { id: 'interview-result', scenario: 'interview', family: 'interview', context: '你說明專案的成果；數字是範例，請換成自己的。', zh: '我們把回應時間從三秒降到一秒以內。', en: 'We reduced the response time from three seconds to under one second.', swap: '只講降幅：We reduced the error rate by 20%.' },
  { id: 'interview-hardest', scenario: 'interview', family: 'interview', context: '面試官問這個專案最難的地方。', zh: '最難的部分是在不停機的情況下搬移資料。', en: 'The hardest part was migrating the data without downtime.', swap: '換成找原因：The hardest part was finding the cause.' },
  { id: 'interview-underestimate', scenario: 'interview', family: 'interview', context: '面試官請你講一次判斷錯誤的經驗。', zh: '我當時低估了這件事的複雜度。', en: 'I underestimated how complex it was.', swap: '換成時間：I underestimated how long it would take.' },
  { id: 'interview-disagree', scenario: 'interview', family: 'interview', context: '面試官問你怎麼處理和同事意見不同。', zh: '我跟同事意見不同，後來我們用資料來決定。', en: 'I disagreed with a colleague, so we used data to make the decision.', swap: '補上主題：A colleague and I disagreed on the approach.' },
  { id: 'interview-since', scenario: 'interview', family: 'interview', context: '你說明那次經驗之後改變的做法。', zh: '從那次之後，我會先寫測試再改程式。', en: 'Since then, I’ve always written tests before I change the code.', swap: '換成確認需求：Since then, I’ve always confirmed the requirements first.' },
  { id: 'interview-ask-team', scenario: 'interview', family: 'interview', context: '面試最後，面試官問你有沒有問題。', zh: '團隊平常是怎麼分工的？', en: 'How does the team divide up the work?', swap: '問得更廣：Can you tell me about the team I’ll be working with?' },
  { id: 'interview-ask-goals', scenario: 'interview', family: 'interview', context: '你想知道到職初期會被期待做到什麼。', zh: '這個職位前三個月最重要的目標是什麼？', en: 'What are the most important goals for this role in the first three months?', swap: '換成第一年：What are the most important goals for this role in the first year?' },
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
const adapted = (sources: SpeakingEvidence['sources'], support: string, usageNote?: string): SpeakingEvidence => ({ expression: 'adapted', sources, support, usageNote });
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
  'interview-current': { ...adapted([oald('work_1', 'work'), oald('currently', 'currently'), oald('build_1', 'build'), oald('at', 'at')], '字典有 She works for an engineering company、We build computer systems for large companies；整句是改寫。', '公司類型是範例，請換成自己的。'), alternatives: [{ en: 'I currently work at a company that builds AI customer service tools.', when: '同一情境；字典說 at 用來講某人在哪裡工作' }] },
  'interview-owned': { ...adapted([oald('responsible', 'responsible'), oald('design_2', 'design'), oald('implement_1', 'implement')], '字典有 Mike is responsible for designing the entire project、He designed and built his own house；整句是改寫。', 'responsible for 後面接 V-ing。字典的 implement 只有政策、決策的例句，所以主句用 build。'), alternatives: [{ en: 'I designed and built this feature.', when: '同一情境，直接說自己做了，比較短' }] },
  'interview-result': { ...adapted([oald('reduce', 'reduce'), oald('under_1', 'under')], '字典有 The number of employees was reduced from 40 to 25、Costs have been reduced by 20%；under 表示少於。整句是改寫。', '數字是範例，請換成自己的真實數字。'), alternatives: [{ en: 'We reduced the response time by two seconds.', when: '只講降了多少，沒有前後的數字' }] },
  'interview-hardest': adapted([oald('part_1', 'part'), oald('migrate', 'migrate'), oald('downtime', 'downtime')], '字典有 The worst part was having to wait three hours in the rain、the hard part；migrate 有電腦領域的意思，downtime 是電腦沒有運作的時間。整句是改寫。', '字典的 migrate 受詞是程式或硬體，用在資料上是套用。'),
  'interview-underestimate': adapted([oald('underestimate_1', 'underestimate')], '字典列出 underestimate what, how, etc.，例句 We underestimated how long it would take；複雜度句是改寫。', 'how 後面接形容詞再接主詞和動詞：how complex it was。'),
  'interview-disagree': { ...adapted([oald('disagree', 'disagree'), oald('decision', 'decision')], '字典有 I must respectfully disagree with my colleague、Victoria and I obviously disagree on this issue、made the decision；整句是改寫。', 'disagree with 接人，disagree on 接主題。'), alternatives: [{ en: 'A colleague and I disagreed on the approach.', when: '同一情境，補上意見不同的主題' }] },
  'interview-since': adapted([oald('since_1', 'since'), oald('before_2', 'before（連接詞）')], '字典說 since 搭配現在完成式，例句 That was years ago. I’ve changed jobs since then；整句是改寫。', 'since then 表示從那時到現在，這裡用現在完成式 I’ve always written。'),
  'interview-ask-team': { ...adapted([oald('divide_1', 'divide'), museSource], '字典有 We divided the work between us、Profits were divided up among the staff；The Muse 建議面試時問團隊相關問題。整句是改寫。'), alternatives: [{ en: 'Can you tell me about the team I’ll be working with?', when: '問得比較廣，不只分工；The Muse 原句' }] },
  'interview-ask-goals': { ...adapted([museSource, oald('role', 'role'), oald('goal', 'goal')], 'The Muse 有 What are the most important things you’d like to see someone accomplish in the first 30, 60, and 90 days on the job?；這句是比較短的改寫。字典支持 role 與 goal 的字義。'), alternatives: [{ en: 'What are the most important things you’d like to see someone accomplish in the first 30, 60, and 90 days on the job?', when: '同一情境，問得更細；The Muse 原句' }] },
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
