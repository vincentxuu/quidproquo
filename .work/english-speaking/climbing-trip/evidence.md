# climbing-trip：來源核對紀錄

核對日期：2026-10-07（Asia/Taipei）。文章：`src/content/posts/learning/2026-10-07-climbing-trip-english.md`（與 `-en.md`），目前 `draft: true`。句子依使用者兩份攀岩行程筆記（東南亞、首爾東京；本機檔案，未進 repo）會遇到的場面擬出，不是真實對話，沒有 `corrections.md`。

## 工具路徑

與 `../work-standup/evidence.md` 相同：Groundlane 未掛載、直接 HTTP 回 401；Cambridge 對直接請求回 403。OALD 與 Mountain Project 以 curl 抓公開頁面落到 session 暫存檔後本機擷取。REI 對 curl 無回應，改用 Firecrawl（帳號額度偏低）：口令頁抓整頁正文，名詞表頁只取問答式片段。以下核對**不算 Groundlane 驗證**。

未取得：railay.com 換栓頁（抓回無正文）、justclimbthailand 租借頁（抓回無正文）、theCrag 華富里頁（403）。因此「鈦栓」一詞沒有攀岩來源的原文，只有使用者行程筆記的轉述與 Mountain Project 的 rebolted／Thaitanium Project。

### 每頁讀取範圍

| 頁面 | 讀取範圍 |
| --- | --- |
| REI：Rock Climbing Commands & Communication | 整頁正文 |
| REI：Rock Climbing Terms & Lingo Guide | 只有問答式片段（crag、lead、lower、multi-pitch、pitch、quickdraw、sport climbing、top rope），**未讀整頁** |
| Mountain Project：Railay／Tonsai、Gozen-iwa | 整頁抓回，只讀 Access Issue 與相關段落 |
| OALD：sun、take、dry（動詞）、open、register、fee、pay、rent（動詞）、enough（副詞）、latest、guidebook、buy、look、partner、recommend、around（副詞）、first、form、titanium、crag | 整頁抓回，本機以關鍵字擷取相關義項與例句，未逐行讀完 |

## Evidence 表

| 卡片 ID | 來源與段落 | 支持範圍 | evidenceType | contextEvidenceType | 未支持的部分 |
| --- | --- | --- | --- | --- | --- |
| climb-titanium | [MP Railay](https://www.mountainproject.com/area/105894664/laem-phra-nang-railay-tonsai)：Warning! Stainless steel bolts are suspect near the coast!；Thaitanium Project has already rebolted the vast majority of popular routes。REI：sport climbing—pre-placed protection such as bolts | 問岩栓的理由、bolts／rebolted 用字 | adapted | adapted | titanium bolts 一詞沒有取得攀岩來源原文；整句無原文 |
| climb-sun | [OALD sun](https://www.oxfordlearnersdictionaries.com/us/definition/english/sun_1)：This room gets the sun in the mornings | get the sun in the + 時段 | adapted | adapted | 岩壁情境是套用 |
| climb-dry | OALD take：It takes about half an hour to get to the airport；[OALD dry](https://www.oxfordlearnersdictionaries.com/us/definition/english/dry_3)：hung it out to dry | take + 時間 + to V；dry 當不及物動詞 | adapted | adapted | 無 |
| climb-open | [OALD open](https://www.oxfordlearnersdictionaries.com/us/definition/english/open_1)：Is the museum open on Sundays?；REI：Crag—A small cliff, or the term for a climbing area | open 表營業／開放；crag | adapted | adapted | right now 未查 |
| climb-register | [MP Gozen-iwa](https://www.mountainproject.com/area/120393050/gozen-iwa)：Please register your name and starting time in the notebook；OALD register：You can also register online | register 用於岩場登記 | adapted | adapted（來源是岩場說明，非對話） | 問句無原文 |
| climb-fee | MP Gozen-iwa：When you have registered your name and paid the access fees；[OALD fee](https://www.oxfordlearnersdictionaries.com/us/definition/english/fee)：There is no entrance fee to the gallery | access fee／entrance fee、pay | adapted | adapted | 問句無原文 |
| climb-rent | [OALD rent](https://www.oxfordlearnersdictionaries.com/us/definition/english/rent_2)：We're looking for a house to rent；British/American 說明 We can hire bikes for a day；REI：Quickdraw 定義 | rent／hire、quickdraw | adapted | adapted | 字典 rent 例句的受詞是房屋，租裝備是套用；would like 沿用既有卡片的 Cambridge 來源，本次未重讀 |
| climb-rope-length | [OALD enough](https://www.oxfordlearnersdictionaries.com/us/definition/english/enough_3)：This house isn't big enough for us；long enough to know | 形容詞 + enough | adapted | adapted | 60-meter rope 的寫法未查 |
| climb-guidebook | [OALD latest](https://www.oxfordlearnersdictionaries.com/us/definition/english/latest_1)：his latest book；OALD guidebook 詞條 | latest + 名詞 | adapted | adapted | 無 |
| climb-partner | [OALD look](https://www.oxfordlearnersdictionaries.com/us/definition/english/look_1)：Are you still looking for a job?；[OALD partner](https://www.oxfordlearnersdictionaries.com/us/definition/english/partner_1)：a dance/tennis partner；REI 口令頁：your climbing partner | look for、climbing partner | adapted | adapted | 無 |
| climb-recommend | [OALD recommend](https://www.oxfordlearnersdictionaries.com/us/definition/english/recommend)：Can you recommend a good hotel?；REI：Multi-pitch—A climb longer than one rope length；[OALD around](https://www.oxfordlearnersdictionaries.com/us/definition/english/around_2)：He arrived around five o'clock | 句型、multi-pitch、around | adapted | adapted | around + 難度級數是套用；single-pitch（swap）未查 |
| climb-gym-first | OALD first：It was the first time they had ever met；[OALD form](https://www.oxfordlearnersdictionaries.com/us/definition/english/form_1)：(especially North American English) to fill out a form | first time、fill out a form | adapted | adapted | It's my first time here 整句無原文 |
| climb-slack | [REI 口令頁](https://www.rei.com/learn/expert-advice/communication-climbing.html)：Climber: Slack! The climber needs extra rope… | 口令與意思 | direct | direct | 美式用法；其他地區未查 |
| climb-up-rope | REI 口令頁：Climber: Up rope! The climber no longer needs the slack in the rope. Asks belayer to take it in. | 口令與意思 | direct | direct | 同上 |
| climb-take | REI 口令頁：Take! Used in climbing gyms by the climber at the top of a route, it asks the belayer to take the climber's weight on the rope and lower him down. Take is not used in traditional climbing… | 口令、適用場合 | direct | direct | 同上；戶外運動攀登是否通用，REI 沒有寫 |

口令卡的 usageNote 取自 REI 同頁：Most importantly, decide on a system with your climbing partner before you leave the ground!；Use names to avoid confusion when more than one team is within earshot。

## 仍待核對（未放進練習卡）

- 「放我下來」的單獨口令（REI 名詞表有 lower 定義，口令頁沒有對應口令）
- 英國、歐洲、亞洲岩場的口令
- 「你們還缺一個人嗎」、岩館單日票
- 常見度比較：未做語料庫查詢

## 範圍聲明

語言練習不等於安全操作指示。岩栓、開放狀態、確保能力都以現場確認為準；卡片與文章都有標註。
