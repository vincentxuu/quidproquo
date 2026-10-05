export const speakingScenarios = [
  { id: 'travel', title: '旅遊', subtitle: '地點與移動' },
  { id: 'surf', title: '衝浪', subtitle: '看浪況、問下水位置' },
  { id: 'climbing', title: '攀岩', subtitle: '聊路線、請人確保' },
  { id: 'work', title: '工作', subtitle: '軟體與 AI 開發協作' },
  { id: 'daily', title: '日常聊天', subtitle: '近況與約見面' },
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
] as const;
export type SpeakingEvidence = {
  expression: 'direct' | 'adapted';
  support: string;
  usageNote?: string;
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
