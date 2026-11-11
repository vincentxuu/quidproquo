# JP3 評價資料表：日劇｜職人、家庭與時代劇 16 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-11。片單來自 `post-jp3-shows.txt`。IMDb／MDL／Video Research 收視／Netflix 觀看數沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、台灣 PTT／平台熱度沿用 `candidates-fans-taiwan.md`（三檔已標 read），這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（asura、unmet、doctor x、shinjuku、emergency call、grand maison、the royal family、mikami、dragon zakura、where does the sea begin、when spring comes、housekeeping、household、diamond、anpan、berabou、unbound、dear radiance）；有頁面的再讀作品頁 | Groundlane `web_extract`（render=never，抓 `/tv/` 連結、`aria-label="Metascore …"`、`Based on N Critic Reviews`、`/publication/` 連結、`User score`） | 16/16 read：**只有宛如阿修羅有頁面（89，5 篇）**。搜尋頁前 10 個 `/tv/` 連結是站方熱門推薦（It Gets Worse、Black Doves 等），每次都出現，不算結果；`/tv/emergency-call/` 是 Luke Wilson 主持的美國 911 紀錄片，不是本劇 |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；豆瓣 subject 頁沒有讀，沒有繞過 sec.douban.com | Exa search／fetch | 2 部有媒體引述（宛如阿修羅 7.9：風傳媒；海中沉睡的鑽石 8.3：公視+ 自家媒體「劇夠」，未署名）。其他看到的分數都來自聚合站、豆瓣小組或自媒體，不採用 |
| 英文評論 | 署名評論，讀全文或大半 | Groundlane `web_fetch`、Exa `web_search_exa`／`web_fetch_exa` | 清單內媒體只有宛如阿修羅（Guardian、RogerEbert read；NYT、Decider partial）與大膽狂徒（Japan Times partial，付費牆、首集後的介紹）。清單外 8 部（The Star、scrmbl×2、Asian Movie Pulse、The Blossom Review×4、BusinessMirror）。6 部沒有找到 |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、上報、500輯、獨立評論＠天下、公視+、換日線、VERSE 等 | Groundlane `web_search`（domains 限定 news.agentm.tw／stars.udn.com／mirrormedia.mg／thenewslens.com／filmaholic.com.tw／500times.udn.com／verse.com.tw／opinion.cw.com.tw／upmedia.mg）＋ `web_fetch`；獨立評論、關鍵評論網、換日線改用 Exa | 9 部有評論性文章（其中新宿野戰醫院只評首集、海中沉睡的鑽石是議題評論）；3 部只有介紹或劇情整理（派遣女醫X、紅豆麵包、致光之君）；4 部沒有可用文章（119緊急呼叫只有 snippet、大膽狂徒只有 snippet、御上老師、春暖花開的那一天） |

標記說明：**read** = 工具讀到頁面內文；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段或一半，或只看到 Exa 搜尋結果裡的長摘要；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：清單內只有 Guardian、RogerEbert、NYT（partial）、Decider（partial）各 1（全在宛如阿修羅），Japan Times 1（大膽狂徒，partial）。**清單外**：The Blossom Review 4（榮耀家族、119緊急呼叫、海的開始、對岸的家事，**同一位作者 Karen Mansoldo**，超過上限，正文最多挑 3 篇）、scrmbl 2（型男主廚三星夢／Patrick St. Michel、紅豆麵包／Alicia Haddick，東京在地的英文流行文化網站）、Asian Movie Pulse 1（型男主廚，partial）、The Star 1（派遣女醫X，馬來西亞報紙，文末有串流平台訂閱導流，帶推廣性質）、BusinessMirror 1（御上老師，菲律賓財經報紙的專欄）。
>
> **大河劇、晨間劇、民放職人劇幾乎沒有英文大媒體評論**：致光之君、海中沉睡的鑽石、Unmet、春暖花開的那一天、東大特訓班2、新宿野戰醫院這 6 部，清單內外都沒找到署名英文劇評，只有個人部落格（Dorama World、zdorama、BeansSpilled、10nineteen 等）、MDL／Letterboxd 使用者評論、MANTANWEB 英文版的新聞稿式報導，不收。致光之君另有一篇韓文學術論文（全南大學，조아라／Cho A-ra，KCI，摘要讀到，非英文劇評）；新宿野戰醫院另有一篇義大利文 AnimeClick 劇評（Hachi194，2025-04-03），都不計入。
>
> 台灣中文評論：**雪奈仍然是最大宗，但這輪有分散**。9 篇評論性文章裡 5 篇是雪奈（娛樂有評或電影神搜「雪奈日劇部屋」：Unmet、東大特訓班2、海的開始、對岸的家事；另有兩篇介紹型：派遣女醫X、紅豆麵包，皆刊上報），其餘作者：**雀雀**（娛樂有評，宛如阿修羅）、**米果**（獨立評論＠天下，宛如阿修羅、榮耀家族）、**龍貓大王通信**（電影神搜，新宿野戰醫院首集）、**文青&宅男の觀影筆記**（500輯〈青宅愛看劇〉筆名，型男主廚三星夢）、**福澤喬**（公視+〈觀點同不同〉，海中沉睡的鑽石，議題評論）、**凱莉的廢話練習簿**（電影神搜，致光之君劇情整理）。御上老師、春暖花開的那一天、大膽狂徒找不到台灣媒體的署名評論；119緊急呼叫只有雪奈一篇談富士台醜聞的 snippet。所有讀到的文章都沒有「合作／贊助」標記，但海中沉睡的鑽石兩篇都刊在公視+ 自家網站（公視+ 是本劇在台灣唯一的串流平台），屬有利害關係的媒體。

---

## 1. アンメット ある脳外科医の日記 Unmet－某腦外科醫的日記－（関西テレビ／フジテレビ，2024）

1. **Metacritic**：沒有頁面（站內搜尋「unmet」沒有任何相關 TV 結果，read）。
2. **豆瓣**：沒有找到媒體引述的分數。搜尋結果只有百度卡片、片源站（外劇窩）、豆瓣小組使用者年度盤點寫 8.2／8.3（不是媒體，不採用）。
3. **英文評論**：**沒有找到**。搜尋過：Groundlane「Unmet A Neurosurgeon's Diary Japanese drama review」、Exa「critic review of Japanese drama Unmet」，只找到 MyDramaList 使用者評論、Letterboxd、BeansSpilled 部落格（snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2024-06-29，〈年度神作預定《Unmet－某腦外科醫的日記－》分分秒秒引爆觀眾淚腺的最終回！〉。https://stars.udn.com/star/story/10093/8060572 （read；完結後評全季）
   - 摘要：她認為主線（小雅面對自己的記憶障礙）比每集的病例支線好，後勁很強；稱讚杉咲花幾乎素顏、若葉龍也的「臭臉」三瓶醫生，以及「Unmet＝未被滿足」的劇名意涵。後半大量篇幅在講兩位主演戲外的互動與緋聞。立場：推。
   - 原文：「編劇不落俗套、巧妙安排與穿插，使情節可以流暢地進行下去，一集比一集更精彩。雖然有時候步調比較緩慢，但不至於讓人感到沉悶」
   - 同作者在上報〈【2024年10大日劇推薦】〉（2024-12-29，https://www.upmedia.mg/tw/popularity/chinese-dramas/220561 ，partial：Exa 摘要）把本劇列第 1。關鍵評論網〈2024春季檔精選10部日劇推薦〉是開播前介紹（snippet）。沒有找到雪奈以外的台灣署名評論。
5. **分歧**：**評審、劇評家、台灣劇迷一致高分；即時收視只算普通、海外評論缺席**。MDL #30 8.4、VR24 只進時移榜（#20，最終回 7.2%）、Filmarks Awards 2024 入圍（ratings 檔）；ザテレビジョン 2024 春最優秀、東京ドラマアウォード 2024 優秀、民放連賞 2025 最優秀、Real Sound 2024 五位評論家有四位列入前十（awards 檔）；PTT 2024「春季王者，完全橫掃」、年度回顧 #1、KKTV 2024 多項年度獎（fans 檔）。Real Sound 年末座談裡木俣冬把本劇列年度第 1（vocus 翻譯轉貼，partial）。

## 2. ドクターX～外科医・大門未知子～ 派遣女醫X（テレビ朝日，2012–2021 七季；劇場版 2024）

1. **Metacritic**：沒有頁面（站內搜尋「doctor x」只有 Doctor Who、The X-Files 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Star（馬來西亞），Michael Cheang，2016-11-16，〈Review: Doctor-X〉。https://www.thestar.com.my/lifestyle/entertainment/2016/11/16/review-doctor-x （read (Exa)；作者看完 S1–S3 與 S4 播出中的前 4 集）。**注意**：The Star 不在原清單；文章開頭與結尾都在導流 dimsum.my 串流平台（「sign up and watch shows」），帶推廣性質，引用時要標明。清單內媒體沒有找到署名評論。
   - 摘要：他把本劇比作《怪醫黑傑克》與《怪醫豪斯》，承認每集公式化（院方輕視自由業醫師→大門出手→「我不會失敗」），配角幾乎只是工具人，但米倉涼子撐起整部劇。立場：推。
   - 原文：「while the stories may be formulaic and the medical procedures just a little too incredulous at times, Doctor-X is still great fun to watch thanks to its electric leading lady.」
   - 其餘英文多是個人部落格（OishiiThoughts「not that interesting」、jekert）與 MDL 使用者評論（snippet，不收）。
4. **中文評論（台灣）**：上報，雪奈，2025-02-23（搜尋結果日期；頁面本身未顯示），〈米倉涼子日劇《派遣女醫X》爆紅12年 電影版攜手內田有紀、西田敏行精彩完結〉。https://www.upmedia.mg/tw/popularity/chinese-dramas/224411 （read；**系列回顧＋米倉涼子人物介紹，屬介紹型，不是完整劇評**）
   - 摘要：她整理系列設定、招牌台詞由來、岸部一德與西田敏行的對手戲，大半篇幅是米倉涼子的經歷（芭蕾、百老匯、低腦壓頭痛）。幾乎沒有批評。立場：推。
   - 原文：「這部日劇的賣點是看大門未知子如何衝破腐敗守舊的制度，將醫院的毒瘤連根拔除，努力拯救患者的生命。」
   - 電影神搜有兩篇《劇場版派遣女醫X FINAL》影評（2025-02-20 https://news.agentm.tw/328457/ 、2025-02-21 https://news.agentm.tw/328550/ ，snippet，評的是電影）；娛樂有評 2025-03-08 有一篇說「電影版的劇本不算出色，賣情懷的成分比較高」（https://stars.udn.com/star/story/10093/8585033 ，snippet，作者未確認）。沒有找到針對連續劇本身的台灣完整劇評。
5. **分歧**：**收視霸主、評論界幾乎不談**。IMDb 7.6（1.1K）、2019 年最終回總合 31.0%、2012–2021 六度拿下年度平均收視第 1（ratings 檔）；awards 檔完全沒有它。台灣 DailyView 2026-10 月聲量 #1、負評 33%（fans 檔）。英文部落格與 MDL 使用者一再說「formulaic」「repetitive」（snippet），和 The Star 的評語一致：好看在主角，不在劇本。

## 3. 新宿野戦病院 新宿野戰醫院（フジテレビ，2024）

1. **Metacritic**：沒有頁面（站內搜尋「shinjuku」沒有任何相關 TV 結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「review Shinjuku Field Hospital Kudo Kankuro drama 2024」，只找到義大利文 AnimeClick（Hachi194，2025-04-03，partial (Exa)，非英文，不計入）、toy-people 英譯網友心得、MDL／Letterboxd 使用者評論、note.com 英譯部落格（snippet，不收）。
4. **中文評論（台灣）**：電影神搜，龍貓大王通信，2024-07-08，〈【開箱】KKTV 日劇《新宿野戰醫院》：我歧視你的歧視！砲火四射的歧視鏈喜劇，讓你看到進步社會的虛偽與真心話〉。https://news.agentm.tw/284524/ （read，讀到約七成；**只評第 1 集**）
   - 摘要：他把本劇讀成宮藤官九郎對「歌舞伎町一丁目再開發」的反諷，劇中每個角色都背著某種階級意識，Yoko 則是站在歧視鏈頂端、又會利用政治正確的美國人；醫療場面只是帶過，本劇也在諧仿《派遣女醫X》。他對小池榮子的英語台詞有保留。立場：推（保留主演英語表現）。
   - 原文：「這次，宮藤的劇本確實犀利，比起《極度不妥！》甚至更加偏激、也更加無情。」
   - 原文：「小池榮子要演這樣的雙聲道角色，特別還是英語台詞大量多過日語台詞的角色，著實有點勉強。」
   - 電影神搜另有橋本愛人物特寫（2024-08-26，snippet，非評論）。沒有找到完結後的台灣署名劇評。
5. **分歧**：**日本收視與評審肯定，台灣劇迷褒貶互見**。VR24 總合 #8 17.9%、時移 #3、Filmarks Awards 2024 入圍（ratings 檔）；awards 檔沒有它，但 AnimeClick 文中寫它拿下第 121 屆ザテレビジョンドラマアカデミー賞最優秀作品與脚本賞、2024-09 ギャラクシー賞月間賞（snippet，待查證）。PTT 2024 推薦串推文正 4／負 2、原 PO 第 5 集棄劇；KKTV 2024 熱播 #3（fans 檔）。PTT 年度無雷推薦（episold，2024-12-30）也列為「中途棄劇（～5集）」，推文多人回「後面比較好看」「岡山腔英文實在是……」（Disp BBS 轉貼，snippet）。前段的英語台詞門檻是棄劇主因，台灣首集評論與觀眾反應一致。

## 4. 119エマージェンシーコール 119緊急呼叫（フジテレビ 月9，2025）

1. **Metacritic**：沒有頁面（站內搜尋「emergency call」只有同名美國紀錄片 `/tv/emergency-call/`，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Blossom Review，Karen Mansoldo，2025-09-17，〈119 Emergency Call: An Optimistic, Unique Take on an Oft-Forgotten Profession〉。https://theblossomreview.com/119-emergency-call-drama-fuji-tv-viki-review/ （**partial (Exa)**：讀到前約三分之一，結論段只在 Exa 搜尋摘要看到；評全 11 集，Viki 上架後）。**注意**：The Blossom Review 是小型 J／K-drama 評論站，不在原清單；同一作者本表共 4 篇。
   - 摘要：她說在警察劇與動作驚悚劇氾濫的時候，把焦點放在接線員這個被忽略的職業很新鮮；本劇借用警察程序劇的單元結構，但讓角色的個人衝突成為主幹，清野菜名與瀨戶康史的師徒線最好看。立場：推。
   - 原文：「in an ocean of police procedurals and action-heavy thrillers, Fuji TV's 119 Emergency Call offers a breath of fresh air.」
   - 另有 Anime Atelier，Demelza Ward，2025-02-21〈J-Drama Spotlight: 119 Emergency Call〉，播出中的介紹（snippet）。清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有可用的評論**。只找到聯合報〈娛樂有評〉，雪奈，2025-01-23，〈清野菜名首主演富士黃金檔《119緊急呼叫》 卻面臨電視台醜聞巨大危機〉（https://stars.udn.com/star/story/10093/8509672 ，snippet，開播初期、主題是富士台醜聞，未讀）。另有噓！星聞電視新聞（2025-04-01，snippet，非評論）。
5. **分歧**：**收視中上、劇迷口碑好，評論界與獎項幾乎缺席**。VR25 總合 #11 14.7%（ratings 檔）；首播 7.3%（劍心．回憶 2025-01-20，snippet）；awards 檔沒有它。PTT 2025 回顧列為「遺珠（冬季檔第二喜歡）」、ELLE 2025 預告片單 #9（fans 檔）。開播正逢富士電視台中居正廣事件與廣告撤出，台灣、英文評論都把醜聞當背景提起（Anime Atelier snippet、雪奈 snippet）。

## 5. グランメゾン東京 型男主廚三星夢（TBS 日曜劇場，2019；SP 與電影《巴黎篇》2024）

1. **Metacritic**：沒有頁面（站內搜尋「grand maison」只有 La Maison 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：scrmbl，Patrick St. Michel，2025-03-06，〈The fine-dining of La Grande Maison Tokyo is J-Drama comfort food〉。https://scrmbl.com/post/the-fine-dining-of-le-grand-maison-tokyo-is-j-drama-comfort-food （read (Exa)；評連續劇全 11 集，順帶評 2024 SP 與電影《巴黎篇》）。**注意**：scrmbl 是東京的英文流行文化網站，不在原清單；作者也是 The Japan Times 的固定撰稿人。
   - 摘要：他把本劇比作日本版《The Bear》：同樣是跌落神壇的主廚衝米其林，但《The Bear》走 prestige TV 的小尺度家庭衝突，本劇則是「J-drama 式的過剩」，起點就是一場國際外交事件；劇情老套、轉折誇張，但做得比同類好，食物拍得令人垂涎。電影《巴黎篇》前半的黑道與爆炸「well beyond over the top」。立場：推（明說不是傑作）。
   - 原文：「Grande Maison isn't a great drama per se. Yet it is an absolutely mouth-watering J-drama.」
   - 另有 Asian Movie Pulse，Adriana Rosati，2025-02-27，〈Series Reviews: La Grande Maison Tokyo (2019)〉（https://asianmoviepulse.com/2025/02/series-reviews-la-grande-maison-tokyo/ ，partial (Exa)：讀到約六成）。她說本劇骨子裡是「a sports movie in disguise」，配樂「bordering on intrusive」。清單外，立場推。
4. **中文評論（台灣）**：500輯〈青宅愛看劇〉，文青&宅男の觀影筆記（筆名），2020-07-21，〈日劇《型男主廚三星夢》：不落俗套，女性主廚獨樹一格的職人精神〉。https://500times.udn.com/wtimes/story/12672/4718819 （read；評全劇）
   - 摘要：作者原以為是「賣臉蛋的追夢美食故事」，看完反而最被鈴木京香飾演的近 50 歲主廚倫子打動；她的強項是組織與領導，本劇講的是團隊而非天才個人。立場：推。
   - 原文：「動人的女性故事不需要透過轟轟烈烈的愛情來堆疊，也無需用說教式的手法敘說女性如何突破職場天花板。」
   - 上報〈2019年秋季日劇初回短評（下）〉也談到首集（2019-10-26，snippet，作者未確認）。鏡週刊〈【影評】《型男主廚三星夢：巴黎篇》多顆星這麼難？〉（2025-04-01，https://www.mirrormedia.mg/story/20250331inf001 ，snippet）評的是電影，說「對初接觸的電影觀眾來說……是稍嫌空泛的」。
5. **分歧**：**少數同時橫跨收視與海外串流的作品，連續劇與電影評價落差大**。IMDb 7.8（1.5K）、MDL #50 8.3、最終回總合 26.3%（ratings 檔）；ザテレビジョン 2019 秋最優秀（awards 檔）；2024-09 Netflix 台灣週榜 #6、#7，累計 5 週（fans 檔）。連續劇在英文、台灣評論都是推；電影版被鏡週刊與 scrmbl 都點出誇張或空泛。

## 6. ザ・ロイヤルファミリー 榮耀家族（TBS 日曜劇場，2025；Netflix 英文名 Passing the Reins）

1. **Metacritic**：沒有頁面（站內搜尋「the royal family」只有 The Royals 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Blossom Review，Karen Mansoldo，2026-04-01，〈Passing the Reins: Giving Full Rein to Our Far-Fetched Dreams〉。https://theblossomreview.com/passing-the-reins-the-royal-family-netflix-review/ （**partial (Exa)**：讀到約一半，結論只在 Exa 搜尋摘要看到；評全 10 集，Netflix 上架後）。**注意**：清單外，同一作者本表共 4 篇。
   - 摘要：她說這是跨近二十年的賽馬史詩，真正動人的是韌性與人的連結；劇本不花時間在瑣碎支線或煽情反派，山王與椎名兩位馬主是互相理解的對手，父子世代衝突寫得不偏袒任何一方。JRA 全面協拍讓每場比賽都緊張。立場：推。
   - 原文：「Passing the Reins truly shines in its heartfelt portrayal of resilience, persistence, and human bonds.」
4. **中文評論（台灣）**：獨立評論＠天下（台北捌玖零專欄），米果，2026-01-16（Exa 抓到的頁面同時顯示 01-15、01-16），〈日劇《榮耀家族》，以及台灣曾有的競馬場〉。https://opinion.cw.com.tw/blog/profile/57/article/16988 （read (Exa)；完結後評全劇，後半轉談日治時期台灣競馬場）
   - 摘要：她原以為會是《白色巨塔》《華麗家族》式的豪門鬥爭，結果是一部「獻給人生與馬的情書」；稱讚妻夫木聰、佐藤浩市、黑木瞳、澤村一樹四位主角級演員對戲，以及 JRA 實賽畫面加 CG 的賽事段落。立場：推。
   - 原文：「我真的被這部日劇感動了，不光是這群出色的資深演員，還有馬，馬的眼睛真是充滿感情，絕對無法背叛馬的眼神。」
   - **注意**：她文中寫「拍攝成8集日劇」，與 MDL、Blossom 寫的 10 集不符，正文不要引這個數字。
   - 聯合報〈娛樂有評〉另有雪奈〈《榮耀家族》精彩完結〉（2025-12-19，https://stars.udn.com/star/story/10093/9207548 ，snippet：「若要選出年度必看日劇……絕對是我的首選」），未讀。
5. **分歧**：**收視與台灣劇迷熱度高，獎項記錄偏少（播出時程晚）**。VR25 總合 #3 最終回 18.5%、DRM 2025 秋季 #1 10.6%、ORICON 2025 滿意度 #7 3.49（ratings 檔）；awards 檔只有一位評論家個人前五（EC2025）；PTT 2025 回顧原 PO #1、秋季推薦 #5、VERSE 2025 必看十部（fans 檔）。2025 年 10 月播出，趕不上東京ドラマアウォード 2025（10 月頒獎），獎項欄偏少不代表評價差。

## 7. 御上先生 御上老師（TBS 日曜劇場，2025）

1. **Metacritic**：沒有頁面（站內搜尋「mikami」沒有任何相關 TV 結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：BusinessMirror（菲律賓），Tito Genova Valiente，2026-02-20（Exa metadata 誤寫 2026-07-31），〈Japan, dark and serious: 'Mr. Mikami's Classroom'〉。https://businessmirror.com.ph/2026/02/20/japan-dark-and-serious-mr-mikamis-classroom/ （**partial (Exa)**：讀到約一半，後段截斷；評全劇）。**注意**：BusinessMirror 是菲律賓財經報紙，作者是長期寫亞洲影劇的專欄作家，不在原清單。清單內媒體沒有找到署名評論。
   - 摘要：他用很長篇幅解釋日本的「天下り」、班導（担任）制度、補習班與東大考試，把御上看成一個不討好任何人的新型男主角；讀到的部分以劇情與文化背景說明為主，評價性語句不多。立場：偏正面（因只讀到一半，保留）。
   - 原文：「The series by its nature has complex and complicated stories and yet it remains an interesting discourse on education.」
4. **中文評論（台灣）**：**沒有找到**台灣媒體署名評論。搜尋過：Groundlane 站內限定電影神搜、娛樂有評、上報、關鍵評論網、獨立評論、釀電影、鏡週刊（「御上老師 松坂桃李 日劇 評論」「御上老師 日曜劇場 教育 文部科學省」），Exa「《御上老師》日劇 評論」。只找到 VERSE〈2025年必看十部日劇〉的編輯部介紹（read (Exa)，非署名評論）、PTT〈[閒聊] 御上老師，E1-10〉（zzauber，2025-03-26，使用者文，不收），以及 vocus「episold的沙龍」翻譯的 FRaU 田幸和歌子專訪編劇詩森ろば（訪談，非評論）。
5. **分歧**：**收視、評審、觀眾滿意度三高，爭議在支線與「思想傾向」**。VR25 總合 #2 20.0%、即時 #2、時移 #1、TVerアワード2025 優秀賞、ORICON 2025 滿意度 #2 3.55、Filmarks 入圍（ratings 檔）；ザテレビジョン 2025 冬最優秀、東京ドラマアウォード 2025 優秀（awards 檔），同屆並拿主演男優賞（松坂桃李）與脚本賞（詩森ろば）（ORICON NEWS 2025-10-28，partial (Exa)）。首播 12.2% 為日 9 近兩年最高（劍心．回憶，snippet）。PTT 推文多說「支線有些粗糙，但主軸沒跑掉」（snippet）；詩森ろば在 FRaU 專訪說教科書審查那集「仍然收到不少觀眾認為我有『思想傾向』的回應」（vocus 翻譯轉貼，partial）。

## 8. ドラゴン桜（2021） 東大特訓班2（TBS 日曜劇場，2021）

1. **Metacritic**：沒有頁面（站內搜尋「dragon zakura」只有 House of the Dragon 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「"Dragon Zakura" 2021 sequel Abe Hiroshi drama review」，只找到 Asiantv4u（署名欄位是類型標籤，無作者）、10nineteen、LiveJournal、HamsapSukebe 部落格與 MDL 使用者評論（snippet，不收）。MDL 使用者對「施暴的家長與教練最後被輕易原諒」有強烈批評（snippet）。
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2021-07-01，〈【劇評】《東大特訓班 2》: 半澤式的逆轉勝＋青春熱血校園劇＝令和時代的龍櫻〉。https://news.agentm.tw/181299/ （read；完結後評全季）
   - 摘要：她說第二季換成福澤克雄執導，把《半澤直樹》的慷慨激昂帶進校園劇；學生演員雖不如第一季耀眼，但每人的故事都動人，讀書方法也實用；最大亮點是完結篇第一季原班人馬回歸、長澤雅美與新垣結衣同框。她也承認「半澤化」讓評價兩極。立場：推（保留商戰化）。
   - 原文：「老實說，福澤克雄用他擅長的《半澤直樹》風格來拍攝《東大特訓班 2》，得到的評價很兩極化，因為清新校園劇多了複雜的商戰情節，同伴裡面有內奸、敵軍裡面有臥底，一下子搞陷害、一下子來暗算。」
   - 同作者在娛樂有評另有開播介紹（2021-05-14，snippet）。沒有找到其他作者的台灣署名劇評。
5. **分歧**：**收視高、校園劇被「日曜劇場化」的評價分歧**。IMDb 7.7（2.1K，兩季合計）、令和總合 #4、最終回即時 20.4%（ratings 檔）；ザテレビジョン 2021 春最優秀（awards 檔）；fans 檔沒有它。雪奈本人、MDL 使用者（snippet）都點到「半澤化」和「惡人被原諒」兩個爭議點。英文評論界完全缺席。

## 9. 海のはじまり 海的開始（フジテレビ 月9，2024）

1. **Metacritic**：沒有頁面（站內搜尋「where does the sea begin」沒有相關結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Blossom Review，Karen Mansoldo，2024-12-18，〈The Beginning of the Sea Analysis: A Cautionary Tale on Life-Changing Decisions〉。https://theblossomreview.com/the-beginning-of-the-sea-viki-review/ （**partial (Exa)**：讀到約三分之一，到「Situation #1」一節截斷；含劇透，評全劇，Viki 上架後）。**注意**：清單外，同一作者本表共 4 篇；這是本表唯一明確負評的英文文章。
   - 摘要：她認為本劇名義上是目黑蓮的故事，實際上是「水季秀」：水季瞞著夏生下孩子、自行決定一切，劇本卻把她當成獨立女性歌頌、從不讓她負責，反而讓尊重她選擇的夏被責備；她批評本劇「扭曲」女性主義訊息。立場：不推。
   - 原文：「despite its apparent cuteness and sentimentality, The Beginning of the Sea is a brutal and realistic cautionary tale. It's a story in which the villain gets what they want and never has to feel guilt or regret.」
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2024-09-26，〈【完結劇評】《海的開始》：不夠完美的我們，展開漫長的療傷之旅〉。https://news.agentm.tw/302786/ （read，讀到約七成五；完結後評全劇）
   - 摘要：她稱讚導演風間太樹不煽情的拍法、生方美久「不要說太多」與「大膽地說」的台詞平衡、有村架純與大竹忍的表演，也整理生方美久對避孕與墮胎爭議的回應；但她直說劇情過度理想化，水季「偏偏要走上一條最艱難的道路，連累身邊所有的人」。立場：推，但保留劇本。
   - 原文：「不過，我認為生方美久還是太過於理想和天真，劇情有很多不合理的編排。」
   - 同作者另有娛樂有評〈就是要逼哭觀眾！富士月9連三季悲戀故事〉（2024-09-07，https://stars.udn.com/star/story/10093/8208449 ，read；播出中的三劇比較）。沒有找到其他作者的台灣署名劇評。
5. **分歧**：**串流與評審肯定，角色爭議兩極**。MDL #31 8.4、VR24 總合 #10 16.8%、TVerアワード2024 ドラマ大賞（總再生 7,200 萬以上）、Filmarks 入圍（ratings 檔）；Real Sound 2024 三位評論家列入前十，成馬零一 #3（awards 檔）。雪奈寫「有人說全都是水季的錯、有人說是夏太軟弱、有人說彌生很自私」，Blossom 則把水季定為反派；台灣與英文評論都對水季這條線有保留，差別只在批評的強度。

## 10. 春になったら 春暖花開的那一天（関西テレビ／フジテレビ，2024）

1. **Metacritic**：沒有頁面（站內搜尋「when spring comes」沒有相關結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「Haru ni Nattara 2024 Fuji TV Nao Kinashi Noritake review」，只找到 Dorama World（Chiaki，8.5/10）、zdorama 部落格、Letterboxd 使用者評論、葡萄牙文部落格（snippet，不收）。
4. **中文評論（台灣）**：**沒有找到**。搜尋過：Groundlane 站內限定電影神搜、娛樂有評、上報、關鍵評論網、獨立評論、釀電影、鏡週刊（「春暖花開的那一天 奈緒 木梨憲武 日劇 評論」「春暖花開的那一天 春になったら 日劇」），結果全是同名無關文章。只在痞客邦部落格「JPK+81 日劇聊聊手札」看到作者把它列入自己的 2024 前十（snippet，非媒體）。
5. **分歧**：**收視低、評審高、海內外評論幾乎空白**。VR24 總合 #20 13.2%、Filmarks 入圍（ratings 檔）；關東即時平均 5.7%（DramaWiki，snippet）；民放連賞 2024 最優秀、Real Sound 2024 田幸和歌子 #6（awards 檔）；fans 檔沒有它。本表唯一沒有任何可用評論的現代劇。

## 11. 対岸の家事〜これが、私の生きる道！〜 對岸的家事～這就是我的生存之道！～（TBS 火曜ドラマ，2025）

1. **Metacritic**：沒有頁面（站內搜尋「housekeeping」「household」都沒有相關 TV 結果，read）。
2. **豆瓣**：沒有找到媒體引述的分數。豆瓣站內一篇剧評標題寫「豆瓣7.1」（2025-05-06，https://movie.douban.com/review/16703653/ ，「文章首发公号：分派电影」），屬自媒體轉載，不採用。
3. **英文評論**：The Blossom Review，Karen Mansoldo，2025-07-09，〈Who Does Housework Anymore? (Taigan no Kaji) Review: A Rare Gem〉。https://theblossomreview.com/who-does-housework-anymore-taigan-no-kaji-review/ （**partial (Exa)**：讀到約四成，結論只在 Exa 搜尋摘要看到；評全 10 集，播畢後、尚未上國際串流時）。**注意**：清單外，同一作者本表共 4 篇；她在 2025 年終回顧把本劇列為個人最愛。
   - 摘要：她說本劇不靠戲劇化事件，而是在平凡家務裡找美與勇氣；多部未華子的全職主婦詩穗是串起職業婦女、請育嬰假的官僚爸爸的樞紐，劇本不分對錯、只主張互相理解，同時把家務當成討論性別分工的敘事工具。立場：推。
   - 原文：「Who Does Housework Anymore? is a rare, remarkable story about respect and kindness, proposing an extraordinarily perceptive account of modern domesticity, gender issues, and human nature.」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2025-06-07，〈超暖心日劇《對岸的家事》：探討育兒與家務勞動帶來的孤獨感〉。https://stars.udn.com/star/story/10093/8787000 （read；完結後評全劇）
   - 摘要：她解釋劇名來自「対岸の火事」（隔岸觀火）的諧音，核心是詩穗願意跨過河去幫助價值觀不同的人；也引用原作者朱野歸子擔心育兒題材沒人看、結果連男性觀眾都接受的說法。立場：推（幾乎沒有批評）。
   - 原文：「描寫的面向多元而廣泛，角色形象立體而細緻，展現出對各種人生困境的包容視角。」
   - 換日線〈2025 春季日劇攻略〉（宋思彤、李雨莘，2025-04-18，https://crossing.cw.com.tw/article/19810 ，partial (Exa)）是開播前導讀，屬介紹型。沒有找到其他作者的台灣署名劇評。
5. **分歧**：**即時收視低、串流與評論高**。VR25 總合 #17 13.0%（ratings 檔）；關東即時平均 6.0%（AsianWiki，snippet）；但首集 8 天總再生超過 300 萬，是 TBS 火 10 時段史上最高（MANTANWEB 英文版評論，2025-05-06，partial）。Real Sound 2025 兩位評論家列入前十（awards 檔）；PTT 2025 回顧「好險沒棄劇，很好看」、MDL 使用者清單 #12、LINE TODAY 2025 日劇年度榜前十（fans 檔）。

## 12. 阿修羅のごとく Asura 宛如阿修羅（Netflix，2025）

1. **Metacritic**：**89 分**（5 篇評論）。https://www.metacritic.com/tv/asura/ （read：Groundlane `web_extract`）。評論來源依頁面順序為 The New York Times 100、Slate 100、The Daily Beast 90、Decider 80、RogerEbert.com 75（分數與媒體依頁面出現順序對應，平均正好 89）。使用者分數 6.4（評分人數頁面未擷取到）。
2. **豆瓣**：**7.9**（人數不明；截至 2026-10-07），風傳媒〈風生活〉，魏甫丞，2026-10-08，〈《地面師》《宛如阿修羅》都不是第一！近3年Netflix最強日劇TOP10冠軍是它〉。https://www.storm.mg/lifestyle/11170472 （read (Exa)；排 2024–2026 年 Netflix 日本真人劇第 2，僅次《地獄占星師》8.2）。同文寫「有人嫌它『很浪費卡司』」。
3. **英文評論**：The Guardian，Rebecca Nicholson，2025-01-29，〈'Asura is the best Netflix drama in years': this strikingly beautiful show will leave you salivating〉。https://www.theguardian.com/tv-and-radio/2025/jan/29/asura-netflix-drama-hirokazu-kore-eda （read；評全 7 集）
   - 摘要：她不解 Netflix 為何完全不宣傳；每集都美得驚人，食物與電話是兩條敘事軸，喜劇感比預期強，所以悲傷時更動人；核心問題是報上那封投書：「像我們這樣的女人不興風作浪地活著，真的是幸福嗎？」立場：推。
   - 原文：「this is a fantastic television series, and it would be criminal to let it pass you by.」
   - RogerEbert.com，Brian Tallerico，2025-01-10，〈Asura〉。https://www.rogerebert.com/reviews/asura-tv-review-2025 （read (Exa)；「Whole series screened for review」）。他說前三集幾乎可以當一部完整電影，第五、六集重複角色節奏、失去動力，七小時略長；但演員沒有一個弱點，尾野真千子最好。立場：推（保留長度）。原文：「His gentle touch with character holds together a project that sometimes feels longer than it needs to be.」
   - 另有 The New York Times，2025-01-30，〈'Asura' Is a First-Class Domestic Drama〉（https://www.nytimes.com/2025/01/30/arts/television/asura-netflix-hirokazu-kore-eda.html ，partial：Exa 只拿到前三段，Groundlane 回 403；作者署名未讀到）；Decider〈Stream It Or Skip It〉，Liz Kocan，2025-01-09（https://decider.com/2025/01/09/asura-netflix-review/ ，partial (Exa)；從「Opening Shot」格式看主要評首集，結論 STREAM IT）。清單外的 The Hindu（Pallavi Keswani，2025-01-11，partial：Exa 摘要）是少數保留意見：「It eventually leads the script towards a feeble finale.」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雀雀，2025-03-08，〈雀雀／「宛如阿修羅」：是枝裕和的「女人真命苦」〉。https://stars.udn.com/star/story/10093/8593224 （read；評全 7 集）
   - 摘要：她把是枝裕和與李安、奉俊昊並列，說本劇把丈夫外遇、男友背叛都拍成喜劇，喜劇感藏在女人的猜疑與男人的彆扭裡；近半世紀前的文本「甚至還多了份沈澱思釀的韻味」。立場：推。
   - 原文：「是枝裕和果然是繼山田洋次之後，最能把日本常民故事拍成猶如你我身邊親友故事的日常派導演。」
   - 另有獨立評論＠天下，米果，2025-01-17，〈女人啊，宛如阿修羅：一部戲劇橫越46年後的跨世代傳奇〉（https://opinion.cw.com.tw/blog/profile/57/article/15767 ，read (Exa)）。她比較 2003 年森田芳光電影版四姊妹，說「向田出手犀利，是枝裕和則是保留餘地」；原文：「腳本很強，演員很強，每一幕都是實力盡出的演技大決鬥。」立場：推。
   - 電影神搜〈【日劇開箱】……狗血版的《海街日記》〉（2025-01-10，https://news.agentm.tw/323128/ ）、〈【劇評】……是枝裕和的溫柔改編〉（2025-01-16，https://news.agentm.tw/325847/ ）與關鍵評論網 https://www.thenewslens.com/article/247715 只看到摘要（snippet），作者未確認。
5. **分歧**：**影評一面倒，觀眾分數明顯偏低**。Metacritic 評論 89 vs 使用者 6.4；豆瓣 7.9；IMDb 7.6（2K）（ratings 檔）。獎項：Seoul Drama Awards 2025 最佳導演（是枝裕和）、Real Sound 2025 明日菜子 #4、NYT 國際劇 2025 年度十大（awards 檔）。台灣：LINE TODAY 2025 日劇年度榜 #2、十大追劇榜 #9、VERSE 2025 必看十部，但 PTT 年終文都沒提、Netflix 台灣週榜沒進（fans 檔）。Guardian、RogerEbert 都抱怨 Netflix 沒宣傳；風傳媒引述觀眾嫌「浪費卡司」，The Hindu 嫌結局無力。

## 13. 海に眠るダイヤモンド 海中沉睡的鑽石（TBS 日曜劇場，2024）

1. **Metacritic**：沒有頁面（站內搜尋「diamond」沒有相關結果，read）。
2. **豆瓣**：**8.3**（人數不明），劇夠（公視+ 旗下網站），未署名，2025-09-24，〈影評《海中沉睡的鑽石》｜沉睡的鑽石，未眠的夢：跨越七十年的生命之歌〉。https://dramago.ptsplus.tv/articles/23113/ （partial：Exa 摘要含全文大半）。**注意**：公視+ 是本劇在台灣唯一的串流平台，文章屬平台自家宣傳性質，且沒有署名。聚合站 Moovie 顯示 8.4、豆瓣使用者年度盤點寫 8.1（都不是媒體，不採用）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「Umi ni Nemuru Diamond / Diamond in the Sea TBS 2024 review」、Groundlane 限定 japantimes.co.jp（Japan Times 2024 年終回顧〈2024 was the year Japanese TV found its prestige〉read，沒有提到本劇）。只找到 Dorama World（Chiaki，9/10）部落格與 MDL 使用者評論（snippet，不收）。
4. **中文評論（台灣）**：公視+〈觀點同不同〉，福澤喬，2025-09-01，〈端島（軍艦島）象徵日本文明結晶，也乘載朝鮮勞工遭殖民壓迫的多重歷史〉。https://issues.ptsplus.tv/articles/11348/ （**partial (Exa)**：Exa 摘要含大半全文；**議題評論**，前半評劇、後半談端島世界遺產的日韓歷史爭議）。**注意**：刊在本劇台灣播出平台公視+ 的自家網站。
   - 摘要：他肯定劇組訪談舊島民、以實景加 VFX 重建端島，說本劇描寫了危險的炭礦勞動、缺水、社區凝聚與歧視；接著指出戰時朝鮮半島勞工被動員到端島的歷史，說日本居民記憶中的「溫情社區」和朝鮮勞工經歷的「監獄生活」是並行的多重面向。劇本身沒碰這段，他沒有直接批評劇，但把它放進更大的歷史框架。立場：推（附歷史補充）。
   - 原文：「從危險的炭礦勞動、缺水與空間匱乏，到緊密如一家般的社區凝聚力，以及遭遇本土歧視與身份排斥的現實，成為一部關於「勞動尊嚴」與「歷史被遺忘者」的真誠描寫。」
   - 沒有找到台灣傳統影劇媒體（電影神搜、娛樂有評、關鍵評論網、獨立評論）的署名劇評；電影神搜只有野木亞紀子人物特寫（2024-11-08，snippet）。台灣 2024 年播出時沒有串流，2025-03 才在緯來日本台、之後在公視+ 上架，可能是台灣評論少的原因。
5. **分歧**：**評審大獎與網路口碑極高，即時收視低迷**。ザテレビジョン 2024 秋最優秀、東京ドラマアウォード 2025 グランプリ（共 4 冠，ORICON NEWS 2025-10-28，partial (Exa)）、Real Sound 2024 四位評論家列入前十、杉咲花ギャラクシー賞個人賞（awards 檔）；PTT「會在歷史上留名的那種作品」「必是年度前五，但臺灣沒有串流播」（fans 檔）。但即時收視首集 11.0%、全 9 集平均 8.3%，為日曜劇場偏低（中文維基收視表，snippet；ratings 檔記 VR24 總合 #5 17.3%）。日本サイゾー長野辰次（2024-12-29，partial (Exa)）說網路絕讚但收視不振，並批評劇中沒碰端島的朝鮮勞工與遊郭等陰暗面——這和福澤喬補充的歷史面向一致。

## 14. あんぱん 紅豆麵包（NHK 連続テレビ小説，2025 上半期）

1. **Metacritic**：沒有頁面（站內搜尋「anpan」沒有任何相關 TV 結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：scrmbl，Alicia Haddick，2025-06-23，〈NHK's Anpan puts a face to the creation of Japan's beloved children's mascot〉。https://scrmbl.com/post/nhks-anpan-puts-a-face-to-the-creation-of-japans-beloved-childrens-mascot （read (Exa)；**寫於播到一半、劇情仍在戰時時**）。**注意**：清單外（東京的英文流行文化網站）。清單內媒體沒有找到署名評論；The Japan Times、NHK World 以外也沒有找到。
   - 摘要：她說本劇善用每日 15 分鐘的播出形式累積時間感，戰時軍國主義滲入鄉村的描寫有份量，把妻子暢設成主角、探討戰後女記者，呼應富士台醜聞後日本對媒體的關注；缺點是隔天要閃回補前情、衝突被迫簡化、片頭太長、旁白過度解說。立場：推（保留形式限制）。
   - 原文：「It just so happens that Anpan is also one of the better shows to take advantage of the format in recent years.」
4. **中文評論（台灣）**：上報，雪奈，2025-05-18，〈今田美櫻打敗3千名試鏡者演出日劇《紅豆麵包》 攜手北村匠海共度人生悲喜充滿正能量〉。https://www.upmedia.mg/tw/popularity/chinese-dramas/230502 （read；**開播約七週時的介紹＋今田美櫻人物特寫，屬介紹型，不是劇評**）
   - 摘要：介紹晨間劇首度在台灣串流同步跟播、故事原型與豪華卡司，後半整篇是今田美櫻的出道經歷。沒有評價性內容。
   - 原文：「多年來膾炙人口、帶來滿滿正能量的NHK晨間劇一直廣受日劇迷的好評，大家期盼好久，終於等到晨間劇首度登上台灣的影音串流平台。」
   - 換日線〈2025 春季日劇攻略〉（2025-04-18，partial (Exa)）、VERSE〈2025年必看十部日劇〉（編輯部，read (Exa)）都是介紹或片單。沒有找到台灣媒體的署名劇評。
5. **分歧**：**收視與串流創紀錄、評論界評價「中等」**。Filmarks 入圍、Yahoo!検索大賞2025 ドラマ部門（ratings 檔）；awards 檔沒有它（Real Sound 2025 年度榜無人選）。VERSE 寫它是 2025 上半年收視冠軍、NHK Plus 首集 76.1 萬觀看創晨間劇與大河劇最高（read (Exa)）；friDay 2025 日劇 #6、VERSE 必看十部 #1、PTT「整體來說還不錯」（fans 檔）。日本評論方面，堀井憲一郎〈『あんぱん』は凡作だったのか〉（Yahoo!ニュース エキスパート，2025-09-30，snippet）說平均 16.1% 在近 10 作排第 6、世評「まずまず良かった」；木俣冬（ダイヤモンド・オンライン，2025-09-25，snippet）說最終週「まるで打ち切り番組のように駆け足」。

## 15. べらぼう〜蔦重栄華乃夢噺〜 大膽狂徒〜蔦重繁華如夢故事〜（NHK 大河ドラマ，2025）

1. **Metacritic**：沒有頁面（站內搜尋「berabou」「unbound」都沒有相關 TV 結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Japan Times，Mark Schilling，2025-01-10，〈'Unbound' breaks NHK period drama tradition with a hero of the common folk〉。https://www.japantimes.co.jp/culture/2025/01/10/tv-streaming/nhk-taiga-drama-unbound/ （**partial**：付費牆，Exa 只拿到前四段；寫於第 1 集播出後，讀到的部分是介紹，不是完整評論）。
   - 讀到的部分只說明本作打破大河劇以戰國武將為主的模板，主角是吉原出身的平民出版商；**評價性正文沒讀到，不能當評論用**。
   - 原文：「"Unbound," the 64th and latest taiga drama (which aired its first episode on Jan. 5) marks a departure from this series' template.」
   - The Blossom Review〈Year In Review: The 2025 Japanese Dramas〉（Karen Mansoldo，2025-12-24，partial：Exa 摘要）只引 Schilling 這段並說「has been mostly well-received」，屬年終片單。Tonboriday（Nathan，2025-12-15）的結局解析給 4.0/5，是部落格（snippet，不收）。
4. **中文評論（台灣）**：**沒有可用的評論**。搜尋過：Groundlane 站內限定電影神搜、娛樂有評、上報、關鍵評論網、獨立評論（「大膽狂徒 蔦重 大河劇」），Exa「《大膽狂徒》大河劇 蔦屋重三郎 橫濱流星 劇評 台灣」。只找到電影神搜，凱莉的廢話練習簿，2025-02-10〈前 5 集劇情重點整理與江戶中期背景知識全解析〉（https://news.agentm.tw/327450/ ，snippet，劇情整理型）、開播前介紹（電影神搜 2025-01-05，snippet）、MyVideo 與 KKTV 平台部落格的劇情人物介紹（平台自家，不算評論）、Dcard 個人文（Leon，2025-12-20，非媒體）。
5. **分歧**：**評論家年度榜首、收視為大河劇低檔**。東京ドラマアウォード 2025 優秀、Real Sound 2025 藤原奈緒與麦倉正樹兩人都列年度 #1、岡山天音ギャラクシー賞個人賞（awards 檔）；ORICON 2025 滿意度 #10 3.40、DRM 2025 夏季 #2 8.9%（ratings 檔）；PTT 2025 推薦列第一、年度回顧 #3、VERSE 必看十部（fans 檔）。全 48 集平均世帯 9.5%、個人 5.3%（MANTANWEB 英文版 2025-12-15，partial）。VERSE 寫本作「創下大河劇歷年來收視人數最高紀錄」（read (Exa)），應是含串流的總觸及人數，與 9.5% 的即時收視口徑不同，不能並列。PRESIDENT Online 香原斗志（2025-10-12，snippet）批評主角蔦重「イマイチパッとしない」，因為他不是創作者本人。

## 16. 光る君へ 致光之君（NHK 大河ドラマ，2024）

1. **Metacritic**：沒有頁面（站內搜尋「dear radiance」只有 Dear White People 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「Japan Times review of NHK taiga drama Dear Radiance」「japantimes.co.jp "Dear Radiance"」、Groundlane 限定 japantimes／nippon.com／theguardian／nytimes／asianmoviepulse／theblossomreview／scrmbl。只找到 Zoom Japan 的製作人與編劇訪談（2024-05-03，非評論）、nippon.com 大河劇介紹、MANTANWEB 英文版新聞、Substack 個人觀劇筆記（snippet，不收）。另有一篇韓文學術論文〈NHK대하드라마「빛나는 그대에게(光る君へ)」 고찰〉（Cho A-ra／조아라，全南大學，KCI，partial：只讀到摘要），結論說全劇重心偏向「身分差」而非女性議題，「이야기가 일관되지 않는 인상」（故事給人不一致的印象）；非英文、非劇評，只供參考。
4. **中文評論（台灣）**：電影神搜，凱莉的廢話練習簿，2024-06-17，〈【期中點評】一口氣跟上《致光之君》最新劇情進度：真尋與道長漸行漸遠？平安時代的歷史爭鬥、紫式部與清少納言的友情〉。https://news.agentm.tw/281962/ （read，讀到約七成；**只到第 23 集，劇情與史實整理為主，屬介紹型，不是劇評**）
   - 摘要：整理寬和之變、長德之變等史實與 23 集為止的劇情，再挑出月下幽會、清少納言崇拜定子、貓咪小麻呂等「看點」。幾乎沒有評價。
   - 原文：「在貴族權力鬥爭中，清少納言始終堅定不移的陪伴定子，兩人之間主僕情深，也能從《枕草子》窺見一二。」
   - 聯合報〈娛樂有評〉雪奈〈吉高由里子主演大河劇《致光之君》：揭開紫式部與平安時代的神秘面紗〉（2024-02-07，https://stars.udn.com/star/story/10093/7753353 ，snippet，開播介紹）。沒有找到台灣媒體的完結劇評。
5. **分歧**：**評論家與日本評審肯定、收視中等、台灣劇迷兩極**。Real Sound 2024 四位評論家列入前十，麦倉正樹與藤原奈緒都排 #2（awards 檔）；2024-12 ギャラクシー賞月間賞，放送批評懇談會評語說「There were few battle scenes and it was said that the storyline was difficult to follow, but Oishi Shizuka's portrayal of human relationships was superb.」（MANTANWEB 英文版 2025-01-20，partial：Exa 摘要）。全 48 集關東平均 10.7%（英文維基，snippet）；ratings 檔沒有它。PTT 2024 推薦「後期看完幾乎沒有印象」、但年度回顧 #2，KKTV 2024 熱播 #7（fans 檔）。

---

## 總表

| # | 劇名 | Metacritic | 豆瓣（媒體引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | Unmet | 無 | 無可用 | 沒有找到 | — | 娛樂有評／雪奈 | read | 評審與劇迷一致高分 vs 即時收視普通 |
| 2 | 派遣女醫X | 無 | 未找 | The Star／Michael Cheang（清單外，帶平台推廣） | read (Exa) | 上報／雪奈（系列回顧，介紹型） | read | 收視霸主 vs 評論與獎項缺席 |
| 3 | 新宿野戰醫院 | 無 | 未找 | 沒有找到（只有義大利文） | — | 電影神搜／龍貓大王通信 | read（ep1） | 日本收視與評審肯定 vs 台灣劇迷前段棄劇 |
| 4 | 119緊急呼叫 | 無 | 未找 | The Blossom Review／Karen Mansoldo（清單外） | partial (Exa) | 沒有可用評論（雪奈 snippet） | — | 劇迷口碑好 vs 評論、獎項缺席 |
| 5 | 型男主廚三星夢 | 無 | 未找 | scrmbl／Patrick St. Michel（清單外）；AMP／Adriana Rosati | read (Exa)；partial | 500輯／文青&宅男の觀影筆記 | read | 連續劇好評 vs 電影版空泛 |
| 6 | 榮耀家族 | 無 | 未找 | The Blossom Review／Karen Mansoldo（清單外） | partial (Exa) | 獨立評論／米果 | read (Exa) | 收視與劇迷高 vs 獎項偏少（時程） |
| 7 | 御上老師 | 無 | 未找 | BusinessMirror／Tito Genova Valiente（清單外） | partial (Exa) | 沒有找到 | — | 三高 vs 支線粗糙、「思想傾向」批評 |
| 8 | 東大特訓班2 | 無 | 未找 | 沒有找到 | — | 電影神搜／雪奈日劇部屋 | read | 收視高 vs「半澤化」兩極 |
| 9 | 海的開始 | 無 | 未找 | The Blossom Review／Karen Mansoldo（清單外，負評） | partial (Exa) | 電影神搜／雪奈日劇部屋 | read | 串流與評審肯定 vs 水季角色爭議 |
| 10 | 春暖花開的那一天 | 無 | 未找 | 沒有找到 | — | 沒有找到 | — | 收視低、評審高、評論空白 |
| 11 | 對岸的家事 | 無 | 無可用（自媒體 7.1 不採用） | The Blossom Review／Karen Mansoldo（清單外） | partial (Exa) | 娛樂有評／雪奈 | read | 即時收視低 vs 串流與評論高 |
| 12 | 宛如阿修羅 | **89（5 篇）**，使用者 6.4 | 7.9（風傳媒 2026） | Guardian／Rebecca Nicholson；RogerEbert／Brian Tallerico | read；read (Exa) | 娛樂有評／雀雀；獨立評論／米果 | read；read (Exa) | 影評一面倒 vs 觀眾分數偏低 |
| 13 | 海中沉睡的鑽石 | 無 | 8.3（公視+ 劇夠，未署名、平台自家） | 沒有找到 | — | 公視+／福澤喬（議題評論，平台自家） | partial (Exa) | 大獎與口碑 vs 即時收視低迷 |
| 14 | 紅豆麵包 | 無 | 未找 | scrmbl／Alicia Haddick（清單外，播出一半時） | read (Exa) | 上報／雪奈（介紹型） | read | 收視串流紀錄 vs 評論「中等」 |
| 15 | 大膽狂徒 | 無 | 未找 | Japan Times／Mark Schilling | partial（付費牆，首集後介紹） | 沒有可用評論（凱莉 snippet） | — | 評論家年度榜首 vs 大河低收視 |
| 16 | 致光之君 | 無 | 未找 | 沒有找到 | — | 電影神搜／凱莉的廢話練習簿（期中劇情整理，介紹型） | read | 評論家肯定 vs 劇迷兩極、收視中等 |

「未找」= 這次沒有為該劇另外搜尋豆瓣新聞；「無可用」= 搜過但只有用戶文、聚合站、自媒體或沒有分數。

## 缺口

1. **Metacritic**：只有宛如阿修羅有頁面（89，5 篇；使用者 6.4）。其餘 15 部都沒有頁面，包括同樣在 Netflix 上架的型男主廚三星夢、榮耀家族、東大特訓班2。
2. **豆瓣**：只有 2 部有媒體引述。宛如阿修羅 7.9 來自風傳媒 2026-10 排行（同一篇也是 JP2 地面師 7.2 的來源）；海中沉睡的鑽石 8.3 來自公視+ 自家「劇夠」，未署名、有利害關係，正文最好寫「約 8 分出頭」並標來源性質，或不寫。對岸的家事「7.1」是自媒體，不能用。其他 12 部沒有另外搜尋或只有聚合站數字。
3. **英文評論覆蓋極不平均**：清單內媒體只評到 Netflix 原創宛如阿修羅（Guardian、RogerEbert read，NYT、Decider partial），大膽狂徒只有 Japan Times 付費牆前四段。8 部靠清單外來源，其中 **The Blossom Review 的 Karen Mansoldo 一人包辦 4 部**（榮耀家族、119緊急呼叫、海的開始、對岸的家事），超過同媒體 3 次的上限，而且 4 篇都只讀到 partial；正文挑 3 篇時，海的開始那篇是唯一明確負評，建議保留。The Star（派遣女醫X）帶串流平台推廣，引用要說明。致光之君、海中沉睡的鑽石、Unmet、春暖花開的那一天、東大特訓班2、新宿野戰醫院 6 部完全沒有英文署名劇評，正文不要寫「外媒評」。
4. **只評首集或播出中**：新宿野戰醫院（台灣，ep1）、紅豆麵包（scrmbl，播到一半）、大膽狂徒（Japan Times，ep1 後）、致光之君（台灣，只到 23 集）、宛如阿修羅的 Decider（首集格式）。引用時要寫明。
5. **台灣中文評論**：9 部有評論性文章，雪奈 5 篇（另有 2 篇介紹型、1 篇 snippet），比 JP2（17 篇中 12 篇）分散。非雪奈作者：雀雀、米果×2、龍貓大王通信、文青&宅男の觀影筆記、福澤喬、凱莉的廢話練習簿（後者只有劇情整理）。御上老師、春暖花開的那一天、大膽狂徒、119緊急呼叫沒有可用的台灣署名評論；派遣女醫X、紅豆麵包、致光之君只有介紹或整理。宛如阿修羅、新宿野戰醫院的電影神搜其他篇、關鍵評論網 247715 只看到 snippet，要補可以先讀。
6. 「分歧」欄裡的 ORICON NEWS、MANTANWEB 英文版、サイゾー、PRESIDENT、Yahoo!エキスパート、ダイヤモンド・オンライン、劍心．回憶、DramaWiki、AsianWiki、中英文維基收視表、AnimeClick 的獎項資訊多是 **partial 或 snippet**，正文引用前要再讀原文。新宿野戰醫院的ザテレビジョン最優秀與ギャラクシー月間賞只來自義大利文 AnimeClick，awards 檔沒有，必須查證。大膽狂徒「大河劇歷年收視人數最高」（VERSE）與 9.5% 平均收視是不同口徑。米果文中榮耀家族「8集」與實際 10 集不符。

## toolDegradation

- **Groundlane MCP**（`web_extract`／`web_fetch`／`web_search`）為主：Metacritic 18 次站內搜尋與 2 個作品頁（`/tv/asura/`、`/tv/emergency-call/`）用 `web_extract` pattern 讀到；台灣評論（娛樂有評 5 篇、電影神搜 4 篇、上報 2 篇、500輯 1 篇）與 Guardian、Japan Times 2024 年終回顧用 `web_fetch` 讀到。Groundlane 搜尋內部 tavily／exa provider 多次回 unavailable、brave 偶爾 unavailable，由 brave／you 補上。NYT 用 `web_fetch` 回 403（瀏覽器 fallback 也是空白頁）。
- **Exa**：`web_search_exa` 用來找英文評論、豆瓣新聞與 Groundlane 找不到的台灣文章；`web_fetch_exa` 讀到 RogerEbert、NYT（只有前三段）、Japan Times（前四段，付費牆）、scrmbl 兩篇、Asian Movie Pulse（截斷）、The Blossom Review 四篇（皆截斷）、BusinessMirror（截斷）、The Star、Decider（截斷）、風傳媒、獨立評論兩篇（米果）。The Guardian 用 Exa 只拿到開頭，改用 Groundlane 讀到全文。
- **jina**、**Tavily**：未使用（Groundlane 加 Exa 已足夠；Tavily 已知額度不足）。**Firecrawl**：額度用完，未使用。**終端機 curl**：被擋，未使用。**Groundlane 直接 HTTP／Keenable／You.com keyless**：未需要。
