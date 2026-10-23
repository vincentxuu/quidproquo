# 同事聊天：感冒與午餐

原始需求：和同事聊自己感冒、喉嚨很痛、不能講話；也聊到同事自己準備午餐。沒有原始英文句子，不做錯句診斷、不編造對方經歷。

## 方法與覆蓋

完整 callable inventory 未掛載 Groundlane；公開來源使用 Exa search → fetch，正文 maxCharacters 40000/45000。主 session 回讀所有採用來源，午餐原句六句逐字比對均符合。完整第三方頁面快照僅保留原工作目錄供本機核對，不納入提交；可重查的 URL 與必要引文列在下表。hurt 的正文另由主 session 讀取。字典與教材沒有證明任何句子的口語頻率排名。

| 教材 | 功能 | 舊卡片覆蓋 | 本次用途 |
| --- | --- | --- | --- |
| Oxford Online English: Talk About Illness and Medicine | 描述症狀、問持續時間 | 既有日常卡無此主題 | 確認 sore throat 與症狀場景；醫病情境不假裝成同事實錄 |
| BBC Real Easy English: Talking about lunch | 今天午餐、平常習慣、剩菜 | 既有 daily 是週末、求職、邀約 | 今日、習慣、帶剩菜三卡 |
| ELLLO 625: What's for Lunch? | 從家裡帶、晚餐自己煮 | 同上 | 確認自帶與延伸聊晚餐 |
| ELLLO 474: Cooking Tips | 請推薦簡單料理 | 同上 | 請同事推薦入門料理 |

以上四份教材中，BBC 與 ELLLO625 都談午餐來源及習慣；本次優先採用兩者的完整句。症狀補 Cambridge voice/throat/hurt。所有自寫對話的 contextEvidenceType 為 adapted。

## 逐句映射

| 卡片 ID | URL | 核對日期 | 同骨架 support | 分類 | 支持邊界 |
| --- | --- | --- | --- | --- | --- |
| daily-health-cold | https://dictionary.cambridge.org/dictionary/english/voice | 2026-10-23 | `I have a cold and I think I'm losing my voice (= becoming unable to speak).` | direct; context adapted | 只描述感冒；不要用 I am cold 表達這個意思。 |
| daily-health-throat | https://dictionary.cambridge.org/dictionary/english/throat | 2026-10-23 | `I have a sore throat.` | direct; context adapted | sore throat 是喉嚨痛；並不表示已經失聲。 |
| daily-health-hurts | https://dictionary.cambridge.org/dictionary/english/hurt | 2026-10-23 | `My head hurts.` | adapted; context adapted | 依 My head hurts 換部位；這一句沒有額外表達「很痛」的程度。 |
| daily-health-losing-voice | https://dictionary.cambridge.org/dictionary/english/voice | 2026-10-23 | `I have a cold and I think I'm losing my voice (= becoming unable to speak).` | direct; context adapted | 正在失去聲音；用在聲音快出不來，不是只因為忙而不能聊天。 |
| daily-lunch-today | https://www.bbc.co.uk/learningenglish/features/real-easy-english/250801 | 2026-10-23 | `What have you got for lunch today?` | direct; context adapted | 問今天這一餐，不是平常的習慣。 |
| daily-lunch-home | https://www.elllo.org/english/0601/T625-Tom-Lunch.htm | 2026-10-23 | `You brought it from home?` | direct; context adapted | 回應前面已提到的午餐；從家裡帶不代表一定親手做。 |
| daily-lunch-usually | https://www.bbc.co.uk/learningenglish/features/real-easy-english/250801 | 2026-10-23 | `What do you usually have for lunch?` | direct; context adapted | usually 問習慣；不要求對方回答今天的菜色。 |
| daily-lunch-leftovers | https://www.bbc.co.uk/learningenglish/features/real-easy-english/250801 | 2026-10-23 | `Sometimes I have leftovers that I bring in.` | direct; context adapted | leftovers 指前一餐剩下的食物；沒有說一定是昨天或一定親手煮。 |
| daily-lunch-cook-dinner | https://www.elllo.org/english/0601/T625-Tom-Lunch.htm | 2026-10-23 | `What do you do for dinner, do you cook?` | direct; context adapted | 這一句已把話題轉到晚餐；不是問今天的午餐誰煮。 |
| daily-lunch-easy-cook | https://elllo.org/english/0451/474-Akane-Cooking.htm | 2026-10-23 | `Can you recommend something that is very, very easy to cook?` | adapted; context adapted | 刪除教材重複的 very；something 讓對方自己推薦料理。 |

## 補查原始需求

第五份教材為日本語言學校 b わたしの英会話，作者署名大山俊輔；主 session 用 Exa 完整讀正文，5129 字元。它直接列出 My throat really hurts.、I’ve lost my voice.、I can barely speak.，三句逐字比對符合；屬於教學示例而非職場對話或頻率證據。Oxford voice 的 lost his voice = could not speak 補語義。沒有採用該教材「最自然／定番」等頻率比較，也不引用醫療建議。

| 卡片 ID | URL | 核對日期 | support | 分類 | 邊界 |
| --- | --- | --- | --- | --- | --- |
| daily-health-really-hurts | https://www.b-cafe.net/newsletter/2026/08/sore-throat-english.php | 2026-10-23 | My throat really hurts. | direct; context adapted | really 加強痛的程度，不等於失聲。 |
| daily-health-lost-voice | https://www.b-cafe.net/newsletter/2026/08/sore-throat-english.php | 2026-10-23 | I’ve lost my voice. | direct; context adapted | 描述已經出現的失聲，和正在變啞的 losing my voice 分開。 |
| daily-health-barely-speak | https://www.b-cafe.net/newsletter/2026/08/sore-throat-english.php | 2026-10-23 | I can barely speak. | direct; context adapted | barely 表示勉強能，不等於完全不能出聲。 |

## 未加入的替代句

上一輪 Did you make that yourself?、早上還是前晚煮、rest my voice、barely talk 暫不沿用為已查證卡；不是判定句子錯，只是這次沒有同骨架教材依據。採用有完整例句的 barely speak。

## 交付範圍

雙語文章為 draft:true；十四張卡是完整草稿契約，尚未接入 speakingCards。現有網站支援來源、替代說法與文章入口；為避免卡片連到未發佈的文章，本次將文章與卡片保留成同一批可審閱成果。沒有新增網站朗讀句子，也沒有生成新語音；這十四張草稿卡尚無預製音檔。未 commit/push/deploy。

## 獨立審閱與午餐補查

獨立 agent 發現原稿只教從家裡帶，沒有直接問誰做；主 session 補讀第六份教材 All Ears English: American Culture and Food at Work，全文 6117 字元，署名 Aubrey Carter。原句 That looks delicious! Did you make it? 逐字比對符合，原情境正是同事午餐，故新增 daily-lunch-made-it 的 expression/context 皆 direct。自寫短對話仍為 adapted。來源限定看起來像自己做的午餐，不把外帶午餐也套進來。原需求「很痛、講不出話、同事自己做午餐」均已有對應卡。
