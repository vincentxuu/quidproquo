# Speak／Praktika：從開始到隔天回來的練習旅程
日期：2026-10-26
定位：公開文件中的完整練習旅程分析。14份官方頁文字已抓取閱讀（至少3頁新help全文要求已完成）；沒有登入使用、沒有觀看影片、沒有做音訊/視覺驗收。不能把多頁文件拼成的旅程稱為一次已實測流程。
讀者痛點：缺持續練習動力；同事感冒、做飯、面試經驗時找不到字/組不出句子。
工具：完整callable inventory查無Groundlane；Exa MCP公開search/fetch fallback。未用退役工具，未送私密資料。
原始資料與逐頁讀取範圍：ai-raw.json。範圍長度單位為JavaScript UTF-16 code units（emoji可能佔兩單位），與原始回傳文字一一核對。

## 證據標記
[D] 官方文件正文：只能說設計/功能/規則如此描述，不證明習慣或口說效果。
[M] 官方demo頁的文字描述：未播放/操作，不是實測。
[P] 官方產品頁或發佈說明：產品自述，有商業利益。
[S] 搜尋摘要：只作候選/反證方向，不下事實結論。
[T] 登入實測：本輪沒有。

## 1. Speak：兩條入口，錯誤可接成下一段任務
下表「課程路線」與「自訂情境路線」分開；Free Talk有舊Chat/新Immersive分支，不能把hands-free等規則混用。

| 段落 | 文件描述的使用者旅程 | 人實際被要求做什麼 | 留下/銜接什麼 | 證據與尚未驗證 |
|---|---|---|---|---|
| 首次開始／選內容 | 課程路線：Home顯示今日課程與進度，可展開不同程度/商務課程。自訂路線：從Home或Practice進Speak Tutor，說出想練主題，點生成課程；Free Talk也可Create Your Own選角色/情境 | 接受預排課程，或自行說清楚需求，例如「與同事聊最近感冒」；這是研究測試用情境，非官方既有課名 | 有課程路徑或保存的自訂課程，不必每次重寫完整教案 | [D]A2/A12，[M]A14；A12韓國市場、A14日本市場，台灣入口/排課不能照搬；尚未核對完整onboarding題目、預設難度與是否能跳過 |
| 實際練習要求 | 既有產品頁說Learn phrases→repeat patterns→apply in conversation；公開demo頁有真人錄製video lesson跟說與AI自由情境。Immersive/Chat可在課前選，Immersive仍需tap送句 | 跟著表達說、反覆練句型，再在對話中回覆；自訂課程與自由對話要求不同。不能說所有課都先照念或所有課都是自由組句 | 以課程/情境累積進度；沉浸人物與背景不是任務完成證據 | 既有official-pages.txt，[D]A3/A12，[M]A14；A12四種活動細節在圖片內，Exa沒讀圖，不能自行補全微步驟。實際提示撤除、句型替換是否要求新內容尚待測 |
| 卡住與回饋 | Tutor可問文法/字詞/發音，Free Talk有按需hints/corrections與Translate；Immersive Retry可退回最近一輪重答。不能開口時Today's Lesson有Can't Speak，Free Talk可打字，Smart Review可只聽 | 求助、讀改寫、決定要不要重說；也可改打字/聽力繼續。官方說Free Talk corrections不影響XP | 留下可修正的回合，能繼續任務；但繼續使用不等於有口頭輸出 | [D]A2/A3/A4/A11；Immersive中途打斷AI會使該輪Replay/Translation不能用（A3）。A5承認語音辨識/權限/裝置問題，不能把不通過都歸因發音 |
| 結束留下什麼 | Made For You：Course錯誤→Course中的Targeted Practice；Free Talk/Roleplay錯誤→課末Takeaways；已教過詞彙低熟練/誤用模式也可產生練習。Free Talk可從歷史保存問題與修正句；Tutor生成課程可重訪 | 選擇是否保存/重練，回看建議；不只有「完成一課」 | 特定錯誤變成後續練習，是文件中明確的跨次銜接。另有收藏分流：課程/FreeTalk→Profile Saved Lines；Tutor→Tutor tab，不同地方 | [D]A1/A2/A13；課末Takeaways兩方案可見，Made For You集中頁是Plus限定，不能把所有人描述成同一旅程。未驗證每次都觸發或錯誤選擇品質 |
| 隔天回來／練什麼 | Home今日課程/進度提供下一步；Review有Smart Review；Targeted Practice/Takeaways提供針對昨天錯誤的路徑；streak在Home/Profile/當天首課後呈現。漏一天可依條件補救，Streak2.0仍beta | 選下一課或補弱點；也可能為保streak完成一堂易課。官方規則任何有學習內容的課（Video/Drill/Made For You/Jump-in等）都可計streak | 有「接哪一課」與「為什麼回來」兩層機制，但活動完成/點數不證明脫提示表達 | [D]A1/A9/A12；Smart Review精確排程、是否優先昨錯、收藏是否自動變複習未查得獨立完整說明。不把「智慧」自行解成已驗證SRS |

### Speak具體取捨
- [推論] 系統課程與自訂題目減少開練前的安排工作；自訂仍需使用者表達需求，且客製額度/畫面依方案不同。應測「今天下班很累」仍能否迅速開始有用的一課。
- [推論] Can't Speak/打字/只聽讓無法開口的一天仍可參與，照顧情境限制；其代價是連續天數可能代表參與，而非持續口頭組句。不能因此批判替代模式無用，也不能拿streak證明口說已練。
- [推論] 錯誤→Takeaways的旅程比單次糾錯多一條返場路，但若修正偏離原意、只要求照念，仍可能沒有練到使用者要講的感冒/做飯經驗。
- [推論] 收藏分散兩處會增加「昨天那句在哪裡」的尋找成本；這是可觀察風險，不是本人已遇到的困擾。

### Speak可反駁的判斷候選
判斷候選：Speak較值得肯定的不是「隨時可聊天」，而是替開始、課後整理和再練接好了部分路徑。
可能推翻：實際課末未產生相關Takeaways；復習只重覆系統句而不回到原意；自訂句/錯誤找不到；連續天數靠低負擔替代活動維持卻不願再開口。
檢查法：同一主題練一天，隔天在不重寫prompt下尋回重點並換一個新限制回答；分別記打開時間、找資料步驟、本人開口與提示依賴，不以XP當結論。

## 2. Praktika：計畫與人物帶你進場，課後紀錄保留在哪裡
2026-02-19 4.0已改版；主要流程依2026-07-30 Learning Process，不沿用2024人物故事當當前介面。

| 段落 | 文件描述的使用者旅程 | 人實際被要求做什麼 | 留下/銜接什麼 | 證據與尚未驗證 |
|---|---|---|---|---|
| 首次開始／選內容 | 選語言後quick onboarding輸入程度/目標/偏好→個人study plan；Lessons頂部banner可改目標/練習時間。4.0 Practice按興趣、程度、目標提供scenario/roleplay，也可自由對話 | 選目標、接受計畫或選貼近自己的情境，不必從空白聊天框設計全部流程 | 一條可返回的學習計畫及自由練習入口 | [D]A6，[P]A8；計畫是否真的捕捉「閒聊感冒/自己做飯」細節、第一次放到哪一課未實測；官方目標/難度適配是宣稱 |
| 實際練習要求 | Lesson中按住mic說話，向上鎖定可說長段；另有video-call模式，等avatar說完再回。可改導師/口音/速度；4.0角色更有動態表情，Practice場景可變 | 對問題自行回覆、在情境中產出，而非只觀看角色；但完整單課內跟讀/選擇/自由回覆的比例未文件化 | 一次對話與課程紀錄；角色提供社交呈現，不能視作真人關係或效果證明 | [D]A6，[P]A8；官方首頁多技能/模式只當描述；未確認默認課程是否每次完整問答、何時完成/可中斷 |
| 卡住與回饋 | 即時grammar分析/vocab suggestions；點自己訊息?看總體/逐字pronunciation/fluency/completeness/rhythm分數，可播放導師版本與自己錄音、Try Again。速度可調，初學困難可開Study in native language，之後可關 | 找求助、比較說法/錄音、決定重答；不是官方每輪一定口頭打斷糾錯 | 回饋與重說機會；詞/片語點一下存Profile dictionary | [D]A6；A10記載mic按鈕、背景聲、Bluetooth/CarPlay可造成辨識問題，因此分數/聽不懂不能直接當語言診斷。沒查到提示逐步撤除/關閉所有語法提示的現行完整文件 |
| 結束留下什麼 | Profile→Completed lessons保存所有課，可下載PDF；點過的詞/片語進Profile字典；可回查完成內容 | 回看/保存/自行決定複習，不必讓對話消失 | 履歷式課程紀錄、PDF、個人字典；可以再開，但文件沒有證明字典自動排程或每課錯誤自動變新任務 | [D]A6；PDF具體包含對話/錯誤/單字哪些欄位未看樣本，不能虛構完整feedback report；是否重開等於重新練一課未明 |
| 隔天回來／練什麼 | Lessons的study plan提供下次入口；4.0官方稱持續依進度更新plan；有streak/progress機制，支持文件承認可能同步錯誤顯示遺失，可請客服還原 | 選計畫下一段，或回Completed lessons/字典；若紀錄未存/課顯示locked，需另找支援 | 角色延續＋計畫/進度形成回訪線索；無需每天從零安排，但是否讓本人願意回來待測 | [D]A6/A7，[P]A8；確切推播/提醒規則、隔天自動選昨錯或自選、字典主動召回均缺；streak遺失不是學習能力歸零 |

### Praktika具體取捨
- [推論] 同一人物、可改速度/母語支援與計畫讓開練更有陪伴和方向；角色外觀或動作是否增加回訪，不能由擬人設計直接推得。
- [推論] ?按鈕讓糾錯有使用者控制，減少每次打斷；但需要自己發現並點開，可能漏看；是否真的每輪顯示/預設自動展示待測。
- [推論] Completed lessons/PDF留下可攜的材料；若隔天仍需使用者自己決定哪句重說，「有紀錄」和「有下一個練習」有距離。未找到字典自動重用的證據，不能說完全沒有。
- [推論] 計畫隨進度適應可以降低安排成本，但若學習指標把辨識/完成當主要依據，未必等於找到最該練的找詞/組句；這是待查模型，不是掌握了內部演算法。

### Praktika可反駁的判斷候選
判斷候選：Praktika在開始與課中回覆提供支援，文件對「昨天卡住的具體表達如何變成明天的任務」交代較少；不能把這說成產品一定沒有。
可能推翻：實測隔天計畫能主動帶回昨天個人詞/句並要求自主用；課末PDF能直接開對應復習；或使用者只需回看一次就能在新情境調用，無需額外任務。
檢查法：同一導師/同一目標連兩天，保存一個感冒症狀詞和一段面試經驗的修正；記隔天是主動出現、需進字典搜尋或完全重問。分開記回訪動機和新情境能否表達。

## 3. 反證與失敗／中斷邊界
至少一個反證已關閉成官方正文，不靠競品摘要：
1. [D] A7 Praktika承認sync error會讓課程沒存、streak顯示遺失，舉「完成Lesson4卻locked」案例；這直接挑戰「完成後一定能無縫接續」假設。是存在可能性，沒有頻率資料。
2. [D] A10 Praktika音訊故障和A5 Speak辨識故障：環境、硬體/權限/路由可中斷開口；不能把卡住全部歸因英文程度，也不能說兩家今天一定有故障。
3. [D] A3 Speak打斷AI後，該輪Replay/Translation停用；打斷自由與回看完整性有具體取捨，不能用「可隨時插話」概括無成本。
4. [D] A9 Speak任何學習內容都能計streak；[D]A11可用系統聲音替說/改只聽。這反駁「連勝就是每天自己組句開口」，不反駁它可能有助學習習慣。
5. [S] 搜到LanguaTalk競品Praktika review稱無post-lesson breakdown、errors不影響未來課。但其商業利益明確，且與Praktika4.0「adaptive path」相衝；未全文讀，不採現行產品不存在的證據。
6. [S] Medium具名教師Oh Yeah Sarah描述2026-03測試：非每次口頭糾錯、詞義不合語境等；作者同時經營Spoken競品，未全文讀，不以其「unbiased」自稱當獨立事實。
7. [S] App Store找到短詞辨識失敗、被迫打字/放棄訂閱等具名自述；本輪只讀搜尋片段，不採可重現bug或比率，僅保留後續實測問題。

## 4. 同一痛點如何沿旅程查，而非只看提示
- 首次：同事感冒/做飯屬日常聊天，「面試經驗」可能是和同事講過去經驗，不必誤設成正式模擬面試。測前先說清楚目的。
- 課中：是想不到內容、找不到字、組句慢，還是系統沒聽到？各記一次，不能讓自動分數替代診斷。
- 結束：今天改過的那句去哪？是否可保存原話與修正、是否保留個人意思、是否有下一段任務？
- 隔天：誰負責挑要練的東西？要幾步才找到昨天材料？是否帶回昨天卡點？
- 新情境：把感冒換成症狀已改善、把做飯換成煮太多、把面試經驗換成被追問後如何處理。這是後續研究自擬測法，非產品實測結果。
- 持續動機與口說能力分開記：回來/完成/愉悅是一組；不用原句仍能表達/換問題可接話是另一組。

## 5. 缺口與下一步最小驗證
| 缺口 | 目前能說 | 尚不能說 | 下步 |
|---|---|---|---|
| Speak台灣版和市場差異 | 英文help與繁中模式文件流程一致；韓國總覽/日本demo補課程形態 | 台灣每個tab/四活動順序全相同 | 只核對台灣帳號入口與一課，不拿跨市場拼接當驗收 |
| Speak課末→隔天 | 文件明確Targeted Practice/Takeaways及再訪入口 | 每人每天自動排到最該練的句子 | 實測一課後紀錄錯誤去向、下次出現時機 |
| Praktika課末PDF | 有Completed lessons與下載 | PDF含完整分類錯誤或自動安排複習 | 看一份公開/帳號樣本；無權限就保留待驗 |
| Praktika字典→再用 | 點詞可保存 | 保存後必定SRS/自動進下一次對話，或完全沒有 | 核對字典入口及隔天計畫，勿憑沒搜到當不存在 |
| 回訪提醒/長期動機 | 有streak/plan/角色設計 | 讓人持續、降低流失的實證 | 記一週實際回訪理由，或讀有方法的產品研究；不引官網見證 |
| 提示撤除與轉移 | 有支援與重答 | 支援會自動適度撤去、真人口說一定進步 | 同情境提示少一次、換情境測試；分開技術故障 |

## 6. 公開示範與讀取紀錄
A14是Speak日本官方app-demo頁，已讀文字（含課程、FreeTalk、Feedback示例），沒有播放demo或操作免註冊對話。當成官方展示[M]，不是[T]。Praktika本輪沒有取得並觀看完整可追旅程demo。
A12韓文總覽文字完整，但四活動等主要說明可能位於圖片，未讀圖；它只能支持Home/Review/Challenge/Profile的文字描述。沒有從圖片空缺補寫細節。
所有A1–A14 Exa回傳均低於字元上限，逐頁正文已順序讀；原始內容、字元總長與範圍在ai-raw.json。這代表文字完整讀取，不代表所有互動/圖片/影片都看過。

## 來源索引
- [A1](https://help.speak.com/en/articles/11565779-what-are-made-for-you-custom-lessons) — official_document；文字0–1348字元，read_text
- [A2](https://help.speak.com/en/articles/11396739-what-is-speak-tutor) — official_document；文字0–2235字元，read_text
- [A3](https://help.speak.com/en/articles/13182402-free-talk-immersive-roleplay) — official_document；文字0–3898字元，read_text
- [A4](https://help.speak.com/en/articles/7969186-what-are-hands-free-mode-and-i-can-t-speak-mode) — official_document；文字0–2320字元，read_text
- [A5](https://help.speak.com/en/articles/5358707-voice-recognition-isn-t-working) — official_document；文字0–3530字元，read_text
- [A6](https://intercom.help/praktika-ai/en/articles/10707916-learning-process) — official_document；文字0–4580字元，read_text
- [A7](https://intercom.help/praktika-ai/en/articles/12008344-i-suddenly-lost-my-streak-or-progress-in-the-app) — official_document；文字0–2240字元，read_text
- [A8](https://praktika.ai/blog/praktika-4-0) — official_document；文字0–2986字元，read_text
- [A9](https://help.speak.com/en/articles/11645358-streak-101-how-streaks-work-how-to-keep-them) — official_document；文字0–6263字元，read_text
- [A10](https://intercom.help/praktika-ai/en/articles/12008322-i-am-having-audio-issues-in-the-praktika-app) — official_document；文字0–3239字元，read_text
- [A11](https://help.speak.com/zh-TW/articles/7969186-什麼是-免手持-模式和-現在無法開口說-模式) — official_document；文字0–927字元，read_text
- [A12](https://help.speak.com/ko/articles/11791215-앱-이용-가이드) — official_document；文字0–2201字元，read_text
- [A13](https://help.speak.com/en/articles/7969167-how-can-i-save-lines-and-words) — official_document；文字0–1585字元，read_text
- [A14](https://www.speak.com/jp/app-demo) — official_demo_page_text_not_played；文字0–4031字元，read_text
