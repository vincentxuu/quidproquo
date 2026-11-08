# 韓劇 3 事實表：動作、生存與超能力（11 部）

- 查核日：2026-11-08。順序照 `post-kr3-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取（非即時，日期以頁面「最近修正」或發布日為準）；**partial** 表示只讀到部分（例如 IMDb 頁面少了類別標籤或認證區塊）；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），`merged-candidates.md` 用來核對類別。每類只留 2–4 個最有資訊量的，得獎排在入圍前面。已刪掉：`A SDA-K`（Moving 的 SDA-K Excellence 2024）、`C Douban`（本篇無）、`G(轉譯)`（魷魚遊戲的 Joynews24 S2&3 #7）、聲量型或負評為主的提及（魷魚遊戲3 的 DailyView 聲量 #2 註明「口碑兩極」，改成另列一行說明）。這輪 11 部沒有遇到業配標示。**拆列說明**：獵犬、驅魔麵館（第 2 季）、D.P.（第 2 季）的 `G LINE TODAY 2023 網友投票` 是從 fans 檔第 151 行「LINE TODAY 2023 網友投票其他上榜作」合併列拆出來的。
- **欄位 4 分級的兩種來源要分開看**：「韓國分級」優先用韓文維基 `시청등급` 欄或標題旁的分級圖示；Netflix／Disney+ 原創劇在韓文維基多半沒有這一欄，改用 나무위키（Exa cache）的「관람등급／시청 등급」或 IMDb Certifications 的 South Korea 列（使用者可編輯，屬旁證）。**這 11 部有 10 部在韓國是 19 歲以上（청소년 관람불가）**，例外是驅魔麵館（來源互相矛盾，見該劇）。IMDb Parents Guide 是**使用者投稿與投票**，不是官方分級；嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。
- **欄位 5 RT**：8 部有 Tomatometer。魷魚遊戲每季 77–96 則影評，其他都在 5–17 則，樣本很小。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、類型、季數、集數、上線日、平台、片長、前置作品、續訂 | 英文 Wikipedia wikitext（`action=raw`），抽 infobox `genre` / `based_on` / `num_seasons` / `num_episodes` / `runtime` / `network` / `first_aired` / `last_aired` / `released`、導言、Series overview、Synopsis／Plot／Premise | Groundlane `web_extract`（pattern） | read（11/11；弱美男英雄用 `Weak_Hero`、獵犬用 `Bloodhounds_(TV_series)`、Kingdom: Ashin of the North 轉址到 Kingdom 主條目） |
| 韓國分級 | 韓文 Wikipedia wikitext（`시청등급`、分級圖示檔名） | Groundlane `web_extract` | read（3 部有：무빙、킬러들의 쇼핑몰、경이로운 소문(드라마)；오징어 게임、이재, 곧 죽습니다 沒有分級欄；약한영웅 兩個標題都回 Wikimedia Error） |
| 韓國分級補查 | 나무위키（오징어 게임、약한영웅 Class 1、약한영웅 Class 2、참교육(드라마)、무빙(드라마)） | Exa `web_fetch_exa` | cache（5 頁） |
| IMDb ID、MDL ID | Wikidata SPARQL（P345、P3868） | Groundlane `web_fetch` | read（11/11 有 IMDb ID；8/11 有 MDL ID，其餘與續季用 MDL 站內搜尋） |
| Parents Guide 五類別 + 各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文）；缺類別標題的 3 頁再用 Exa 補 | read（11/11）；6 頁 jina 只回內容不回類別標題，其中 3 頁用 Exa cache 補到類別順序；3 頁（魷魚遊戲、弱美男英雄、鐵拳教育）兩邊都沒有 Certifications |
| IMDb 評分與票數 | IMDb 標題頁 | Exa `web_fetch_exa`；李屍朝鮮 Exa 逾時，改 jina 讀 `/ratings/` | cache（10/11）；read（李屍朝鮮） |
| MyDramaList 分數與評分人數 | `mydramalist.com/<id>` 的「Score: X (scored by N users)」 | Groundlane `web_extract`（render=never） | read（11 部 + 各續季共 19 頁） |
| Rotten Tomatoes | `rottentomatoes.com/tv/<slug>[/sNN]`，選取 `rt-text[slot=critics-score]`、`rt-link[slot=critics-reviews]`、`rt-text[slot=audience-score]` | Groundlane `web_extract` | read（16 頁有頁面；`deaths_game`、`study_group`、`weak_hero_class_2` 404 回首頁） |
| 續季現況（Moving 2、鐵拳教育 2、李屍朝鮮 3） | Deadline、KStarTrend、스타뉴스、CNN Indonesia | Exa `web_search_exa` 找 → `web_fetch_exa` 讀 | cache |

---

## 1. Squid Game

1. **片名**：**魷魚遊戲**（Netflix Taiwan YT；tw-availability-1）／오징어 게임／*Squid Game*
2. **劇情**：456 名債台高築的人受邀參加一連串兒童遊戲，輸了就會死，贏家可拿 456 億韓元獎金。Wikipedia：「456 players, all of whom are in deep financial hardship, risk their lives to play a series of children's games that result in death if eliminated」。來源：https://en.wikipedia.org/wiki/Squid_Game （read）
3. **季數與狀態**：**3 季 22 集，已完結**。第 1 季 9 集（2021-09-17）、第 2 季 7 集（2024-12-26）、第 3 季 6 集（2025-06-27），Netflix 原創，每季一次上架。導言寫第 3 季是「third and final season」，第 2、3 季背對背拍攝（back-to-back）。片長 33–76 分鐘。來源：同上 infobox 與 Series overview（read）。나무위키提到美國版衍生劇的傳聞與報導（cache），**未確認，不寫進文章**。
4. **分級**：
   - 韓國：**청소년 관람불가（19 歲以上）**——나무위키「시즌 1 … 관람등급 청소년 관람불가」（cache；第 2、3 季那兩列在快取裡是空白）。韓文維基沒有分級欄（read）。IMDb 頁沒有回傳 Certifications。
   - 台灣：沒有讀到台灣平台分級（IMDb Certifications 沒回傳，Netflix TW 頁依 IP 回傳內容，不讀）。IMDb 標題頁標 TV-MA（cache）。
   - IMDb Parents Guide（read，類別順序以 Exa cache 補齊，https://www.imdb.com/title/tt10919420/parentalguide/ ）：Sex & Nudity **Moderate**（1198/2717）、Violence & Gore **Severe**（1472/1643）、Profanity **Moderate**（711/1306）、Alcohol, Drugs & Smoking **Mild**（811/1255）、Frightening & Intense **Severe**（1124/1350）。投稿提到：「Frequent sequences of strong bloody violence, ranging from stabbings, shootings and brutal beatings」；第 2 季角色反覆服藥、暗示海洛因成癮；**有自傷疤痕、角色拿槍對著自己考慮自殺**；第 3 季有嬰兒（CGI）身陷險境。**本篇票數最多（1,255–2,717 票）。**
5. **觀眾評分**：MDL 分季計分：第 1 季 **8.4**（169,082 人，https://mydramalist.com/40257-round-six ）、第 2 季 **8.1**（76,993 人，https://mydramalist.com/714529-squid-game-season-2 ）、第 3 季 **7.6**（50,456 人，https://mydramalist.com/771707-squid-game-season-3 ），全部 read。IMDb **7.9**（783K，cache；三季合計）。RT（read）：第 1 季 Tomatometer **95%**（77 則）、Popcornmeter 85%；第 2 季 **83%**（96 則）、64%；第 3 季 **79%**（78 則）、Popcornmeter **51%**（https://www.rottentomatoes.com/tv/squid_game/s01 、/s02、/s03）。英文維基（access 2026-05-25）寫的是 95/84/78，和今天讀到的差 1 個百分點，以今天 read 為準。
6. **推薦 tag**：
   - A：Primetime Emmy 2022 **WIN** Lead Actor（李政宰）、Directing（黃東赫）、Guest Actress（李侑美），共 14 提名 6 勝；Golden Globe 2022 Supporting Actor TV **WIN**（吳永洙）；Baeksang TV 大賞 2022；Golden Globe Best Drama nom 2022、2025
   - B：NYT 21 世紀百大影集（2026）#72；Guardian 2021 年度 #5；Time-K2025（Burt）#3〔S3〕
   - C：IMDb 7.9（783K）
   - D：Netflix 非英語影集歷來 #1 S1 265.2M／#2 S2 192.6M／#3 S3 145.8M；Netflix H2 2024 S2 87M（該半年最高）
   - E：Parrot GDA 2021 series debut + revolutionary series（winner）；GWR：Netflix 原創首播觀看最多（142M 戶）
   - F：Dcard Z.Y S1 4 分
   - G：Netflix TW S3 2025-06-23～29 #1、S2 2025-01 #5；遠見 2025 必看韓劇 #3（S3）
   - （已刪：`G(轉譯) Joynews24 S2&3 #7`、`G DailyView 聲量 #2`，後者註明 S3 口碑兩極。）
   - **口碑另記**：第 2、3 季評價明顯低於第 1 季——英文維基導言「generally positive reviews from critics but were considered inferior to the first season」（read）；RT Popcornmeter 由 85% 降到 64%、51%；MDL 由 8.4 降到 7.6；Dcard Z.Y 給 S2 2 分、S3 1 分；fans 檔記「PTT 推薦串裡沒人主動推 S2/S3」。
7. **前置作品**：沒有，黃東赫原創（infobox 無 `based_on`）。三季是連續故事，**要從第 1 季照順序看**。英國實境節目 *Squid Game: The Challenge* 是另一個作品，不必看。
8. **台灣串流**：Netflix (subscription): https://www.netflix.com/tw/title/81040344 — 證據 https://www.youtube.com/watch?v=naMtAcdqnNk 「《魷魚遊戲》第 3 季 | 正式預告 | Netflix」, Netflix Taiwan, 2025-06-01. JustWatch TW also lists Netflix (checked 2026-11-08). — **confirmed (official channel)**（tw-availability-1）
- **類型核對**：infobox genre＝Dystopian / Survival（後續被 ref 截斷）；導言「dystopian survival thriller drama」（read）。**符合本篇（生存）**。

## 2. Moving

1. **片名**：**Moving 異能**（Disney+ TW page；tw-availability-1）／무빙／*Moving*
2. **劇情**：三名隱藏超能力的高中生和他們同樣身懷異能、背負過去祕密的父母，在國家情報機構與北韓特工的追殺下保護家人。Wikipedia：「a supernatural drama that depicts the familial story of three teenage high school students and their parents who discover their super powers」。來源：https://en.wikipedia.org/wiki/Moving_(South_Korean_TV_series) （read）
3. **季數與狀態**：第 1 季 **20 集**，Disney+ 2023-08-09 到 09-20（infobox `last_aired = present`，因為續季已在製作）。片長 infobox 沒寫；나무위키 寫第 1 季總長 965 分鐘（cache）。導言：上線 7 天成為 Disney+ 全球觀看最多的韓國原創、美國 Hulu 同樣第一（read）。**第 2 季製作中、未定檔**：2024-11-21 Disney 亞太宣布開發（英文維基，read）；Deadline 2026-05-18「Moving Season 2 Begins Production」，導演換成《李屍朝鮮》的金成勳，編劇仍是姜草，李正河因入伍由元圭彬接演金峰石（cache）；KStarTrend 2026-10-20 引《Harper's Bazaar Korea》11 月號高允貞受訪確認正在拍攝，「An official premiere date … has not yet been announced」（cache）。나무위키 第 2 季欄位「미정」（cache）。
4. **分級**：
   - 韓國：**19 歲以上**——韓文維基標題旁分級圖示 `Rating System(19).svg`（read；`시청등급` 欄本身空白）；나무위키「청소년 관람불가」（cache）。IMDb Certifications 寫 South Korea **18**（read，和前兩者不一致，以韓文來源為準）。
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-1，2026-11-08）；IMDb Certifications「Taiwan 15+ self-applied」（read）。美國 TV-MA。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt24640580/parentalguide/ ）：Sex & Nudity **None**（37/46）、Violence & Gore **Severe**（36/39）、Profanity **Moderate**（18/27）、Alcohol, Drugs & Smoking **Mild**（17/28）、Frightening & Intense **Moderate**（16/33）。投稿提到：「Many disturbing, graphic, gory scenes from the get-go」，臉被打到全毀、扭斷脖子、小孩為了生存殺害另一個小孩；「should not be watched by non-adult audiences」。**外表是家庭超能力劇，但血腥度在本篇屬最高一級。**
5. **觀眾評分**：MDL **9.0**（60,100 人，https://mydramalist.com/25560-moving ，read）；IMDb **8.4**（18K，cache）。RT：第 1 季 Tomatometer **100%**（9 則）、Popcornmeter **97%**（https://www.rottentomatoes.com/tv/moving_2023/s01 ，read；樣本很小）。
6. **推薦 tag**：
   - A：Blue Dragon Series Awards 大賞 2024；Baeksang Drama nom 2024；Blue Dragon Drama nom 2024
   - B：Cine21-2023 #1
   - C：IMDb 8.4（18K）；MDL #10 9.0（60,095）
   - E：FUNdex Awards 2023 drama grand prize
   - F：PTT 2023 徵文 17 推；Dcard Z.Y 3 分（推文另有 2 人說「還好」「後面打鬥過多」）
   - G：LINE TODAY 2023 台灣網友投票 #2（8.03%）
   - （已刪：`A SDA-K Excellence 2024`。）
7. **前置作品**：改編自姜草（Kang Full）的同名 Kakao 網漫（infobox `based_on`，read）。不必先看。英文維基提到劇中金英卓一角出自姜草舊作《Timing》（read），屬彩蛋；Variety（cache）說第 2 季延續姜草從 Moving 擴展到《照明商店》的串流宇宙，**也不必先看**。
8. **台灣串流**：Disney+ (subscription): https://www.disneyplus.com/zh-tw/browse/entity-a775613d-a93c-4be4-bef5-654f6b752699 — The service page loads as 「觀看Moving 異能 | Disney+」, 15+, 2026-11-08. Also https://www.youtube.com/watch?v=qMw_5HA9viA 「奇幻韓劇《#MOVING #異能》| 第十六、十七集預告 | Disney+ 每週三獨家更新」, Disney Plus TW, 2023-09-11. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：infobox genre 第一項 Action（後續被 ref 截斷）；導言「action fantasy sci-fi television series」「discover their super powers」（read）。**符合本篇（超能力）**。

## 3. Weak Hero Class 1 / Class 2

1. **片名**：**弱美男英雄：Class 1**／**弱美男英雄：Class 2**（Netflix Taiwan YT；tw-availability-1；Netflix 標題用全形冒號）／약한영웅 Class 1 / Class 2／*Weak Hero Class 1* / *Class 2*
2. **劇情**：瘦弱但成績頂尖的模範生延時恩，靠臨場判斷、物理知識和身邊的物品反擊校園霸凌；Class 2 他轉學到恩長高中，面對跨校犯罪集團「聯合」。Wikipedia Synopsis：「Though physically weak, he does not back down from the bullies in his classroom」。來源：https://en.wikipedia.org/wiki/Weak_Hero （read）
3. **季數與狀態**：**2 季（Class 1、Class 2）各 8 集，兩季在不同平台**。Class 1：Wavve 2022-11-18 上線（前 3 集先在第 27 屆釜山影展放映）；나무위키 另記 Channel S 2023-02-17～03-10 電視播出（cache）。Class 2：**Netflix 原創**，2025-04-25 上線。片長 36–54 分鐘。infobox `num_seasons = 2`（read）。英文維基沒有讀到第 3 部的消息；나무위키 Class 2 目錄有「후속작 떡밥」（續作伏筆）一節，內文沒讀，**不寫續訂**。來源：同上（read）
4. **分級**：
   - 韓國：**청소년 관람불가（19 歲以上）**——나무위키 Class 1、Class 2 頁 infobox 都寫「청소년 관람불가」（cache）。韓文維基 `약한영웅`、`약한영웅_(드라마)` 都回 Wikimedia Error，沒讀到。IMDb 頁沒有回傳 Certifications。
   - 台灣：沒有讀到台灣平台分級。IMDb 標題頁標 TV-MA（cache）。
   - IMDb Parents Guide（IMDb 把兩季放在同一個條目 tt20234568，標題叫「Weak Hero Class 1 (2022– )」；jina read 只有分數，類別順序由 Exa cache 補齊，https://www.imdb.com/title/tt20234568/parentalguide/ ）：Sex & Nudity **None**（91/104）、Violence & Gore **Severe**（74/100）、Profanity **Moderate**（40/88）、Alcohol, Drugs & Smoking **Moderate**（46/89）、Frightening & Intense **Moderate**（29/74）。投稿提到：**大量霸凌與打鬥**（筆、球棒、花盆、椅子當武器，用窗簾包頭毆打到滲血）；**一段男對男性侵擾場景**（「Short but distressing」）；高中生抽菸、喝酒、買毒品，有人被下藥；粗口極多（有投稿逐季計數）。
5. **觀眾評分**：MDL Class 1 **9.1**（132,335 人，https://mydramalist.com/702267-weak-hero ）、Class 2 **8.8**（70,698 人，https://mydramalist.com/702271-weak-hero-season-2 ），都 read。IMDb **8.4**（31K，cache；兩季同一條目）。RT：`/tv/weak_hero` 轉到 `weak_hero_class_1`，Tomatometer **80%**（5 則，read，樣本很小）；`/tv/weak_hero_class_2` 404，**沒找到 Class 2 的 RT 頁**。
6. **推薦 tag**：
   - A：Blue Dragon Drama nom 2023（Class 1）
   - B：Cine21-2022 #10（Class 1）；Time-K2025（Burt）honorable mention（Class 2）
   - C：IMDb Class 1 8.4（31K）；MDL Class 1 #4 9.1、Class 2 #33 8.8
   - D：Netflix H1 2025 Class 1 22M + Class 2 20M
   - E：FUNdex Awards 2025 performer award（李俊榮）+ global star（朴志訓）
   - G：Netflix TW 2025-04-28～05-04 Class 2 #2（Class 1 同週 #5）
7. **前置作品**：改編自 Seopass（서패스）原作、金振錫（Razen）作畫的 Naver 網漫《弱美男英雄》（infobox `based_on`，read）。**Class 2 直接接 Class 1（延時恩轉學、帶著前一季的創傷），一定要先看 Class 1**。原作網漫不必先看。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81742615 (the indexed TW page lists both Class 1 and Class 2). Class 1 also has its own ID, 81751309. — 證據 Class 2: https://www.youtube.com/watch?v=vLRi8fc3OT8 「《弱美男英雄：Class 2》| 正式預告 | Netflix」, Netflix Taiwan, 2025-04-11. Class 1: https://www.youtube.com/shorts/nsPt4WNiLCo 「《弱美男英雄：Class 1》｜精彩片段」, Netflix Taiwan, 2025-05-19. — **confirmed (official channel)**（tw-availability-1）。注意：Class 1 原本是 Wavve 原創、在 Netflix 是授權，最新台灣證據 2025-05，下架風險高於 Class 2。
- **類型核對**：infobox genre＝Coming-of-age / Action / Drama thriller（read）。**符合本篇（校園動作）**。

## 4. Teach You a Lesson

1. **片名**：**鐵拳教育**（Netflix Taiwan YT；tw-availability-1）／참교육／*Teach You a Lesson*
2. **劇情**：校園暴力氾濫、教權崩壞，政府成立「教權保護局」，督察羅華鎮獲准用武力與非常手段整頓問題學生、家長和腐敗教師。Wikipedia：「an inspector from the Educational Rights Protection Bureau (ERPB) who is authorized by the government to use physical intervention and unconventional methods to discipline delinquent students」。來源：https://en.wikipedia.org/wiki/Teach_You_a_Lesson （read）
3. **季數與狀態**：1 季 **10 集**，Netflix 原創，**2026-06-05 一次上架**（infobox `released`，read）。片長 infobox 空白；나무위키 寫總長 636 分鐘（cache）。**第 2 季未確認**：英文維基導言寫 2026 年 7 月「a second season was under discussion」（read）；Netflix 2026-07-21 對 스타뉴스 表示「정해진 바가 없다」（沒有定案，cache）。Netflix Top 10 網站把它列為「Limited Series」（candidates-ratings 檔 read 過的 What's on Netflix 報導）。
4. **分級**：
   - 韓國：**청소년 관람불가（19 歲以上）**——나무위키 infobox「시청 등급 청소년 관람불가」（cache）。韓文維基沒有查。IMDb 頁沒有回傳 Certifications。
   - 台灣：沒有讀到台灣平台分級。IMDb 頁標 TV-MA（read）。
   - IMDb Parents Guide（**partial**：jina 只回分數，類別依 Exa cache 的段落內容對應，https://www.imdb.com/title/tt34809853/parentalguide/ ）：Sex & Nudity **None**（41/52）、Violence & Gore **Moderate**（26/35）、Profanity **Moderate**（20/33）、Alcohol, Drugs & Smoking **Moderate**（16/28）、Frightening & Intense **Mild**（14/29）。投稿提到：幾乎每集都有血；學生販毒是整集主題；言語與網路霸凌；**有自殺未遂和自殺相關對話**；第 9 集約 19 分鐘有成人影片畫面一閃而過。
5. **觀眾評分**：MDL **9.0**（53,508 人，https://mydramalist.com/778658-get-schooled ，read；MDL 網址用原作英文名 Get Schooled）；IMDb **8.4**（22K，cache）。RT：Tomatometer **90%**（10 則）、Popcornmeter **94%**（https://www.rottentomatoes.com/tv/teach_you_a_lesson/s01 ，read）。
6. **推薦 tag**：
   - C：IMDb 8.4（22K）；MDL #12 9.0（53,496）
   - D：Netflix 非英語影集歷來 #10 67.2M（Limited Series）；Netflix H1 2026 48.2M（該半年最高韓劇）
   - F：Dcard Z.Y 4 分
   - G：Netflix TW 2026-07 #3（累計 8 週）
7. **前置作品**：改編自蔡龍澤、韓佳嵐的 Naver 網漫《참교육》（英文 *Get Schooled*，infobox `based_on`，read；나무위키 說網漫仍在連載，cache）。不必先看。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81947300 — 證據 https://www.youtube.com/watch?v=9kNEns0OcH0 「《鐵拳教育》| 正式預告 | Netflix」, Netflix Taiwan, 2026-05-20. Also Storm 2026-09-09 (11162785). — **confirmed (official channel)**（tw-availability-1）
- **類型核對**：infobox genre＝Action / School drama / Comedy（read）。**符合本篇（動作）**，但基調是爽劇加喜劇。英文維基導言提到「despite controversy surrounding the original webtoon」（read）；나무위키 目錄有「全國教職員勞動組合的抗議」一節（cache，內文沒讀）。寫文時若提爭議，要先回原文查清楚。

## 5. Study Group

1. **片名**：**流氓讀書會**（friDay page；tw-availability-1）／스터디그룹／*Study Group*
2. **劇情**：只有打架天分的尹佳民一心想考上大學，在惡名昭彰的流星工業高中組了讀書會，一邊讀書一邊用拳頭保護同學。Wikipedia Synopsis：「Yoon Ga-min, who is only talented in fighting, trying to study hard to achieve his goal of entering university by forming a study group」。來源：https://en.wikipedia.org/wiki/Study_Group_(TV_series) （read）
3. **季數與狀態**：第 1 季 **10 集**，TVING 2025-01-23 到 02-20。片長 42–43 分鐘（read）。**2025 年 8 月續訂第 2 季**（英文維基導言，read）；MDL 的「Study Group Season 2」頁寫 TVING、10 集、「Airs: 2026 - ?」，還沒有評分（read）——**截至查核日看起來尚未開播，播出日未確認**。
4. **分級**：
   - 韓國：**19**（IMDb Certifications South Korea 19，read）。韓文維基、나무위키 沒有查。
   - 台灣：friDay 頁的分級沒有記錄在 tw-availability（未讀）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35304338/parentalguide/ ）：Sex & Nudity **None**（32/34）、Violence & Gore **Moderate**（10/23）、Profanity **Severe**（11/20）、Alcohol, Drugs & Smoking **Moderate**（11/18）、Frightening & Intense **Moderate**（9/16）。投稿提到：「A lot of fight scenes」「Bones are broken in fights」；「In almost every sentence they say the f word」。**票數 16–34，參考性有限。**
5. **觀眾評分**：MDL **8.8**（59,501 人，https://mydramalist.com/752799-study-group ，read）；IMDb **8.2**（8.2K，cache；本篇 IMDb 票數最少）。RT：`/tv/study_group` 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - B：Time-K2025（Burt）#7
   - C：MDL #32 8.8
   - F：PTT 2025 最愛串 5；PTT 2025 印象串推文「今年個人最喜歡」
   - G：friDay 2025 年度大勢戲劇 #6（PTT 轉貼串約 6 人推）
7. **前置作品**：改編自申亨旭（Shin Hyung-wook）的同名網漫（infobox `based_on`，read）。不必先看。
8. **台灣串流**：friDay影音 (free tier): https://video.friday.tw/drama/detail/3956. A LINE TV page (https://www.linetv.tw/drama/17063/eps/1) is indexed but its status was not checked. — 證據：The friDay title page loaded on 2026-11-08 with 「適用方案：免費」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：infobox genre＝Action comedy / Teen / Coming-of-age（read）。**符合本篇（校園動作）**，基調偏喜劇。

## 6. A Shop for Killers

1. **片名**：**殺人者的購物中心**（Disney+ TW page；tw-availability-2）／킬러들의 쇼핑몰／*A Shop for Killers*
2. **劇情**：從小被神祕舅舅鄭振萬養大的大學生鄭知安，接到舅舅「自殺」的消息後回家，隨即遭殺手圍攻，才發現舅舅經營的網路商城是賣武器給殺手的暗網市集。Wikipedia：「a girl who lost her parents and grew up in the hands of her uncle who runs a suspicious online shop」。來源：https://en.wikipedia.org/wiki/A_Shop_for_Killers （read）
3. **季數與狀態**：**2 季各 8 集**。第 1 季 Disney+ 2024-01-17 到 02-07；**第 2 季 2026-07-22 到 08-12**（Series overview 的 network2 寫 Hulu，美國平台），infobox `last_aired = 2026-08-12`。片長 44–62 分鐘。英文維基沒有讀到第 3 季消息（read）。Disney+ TW 首頁推「殺人者的購物中心第 2 季 | 現正熱播」（tw-availability-2）。
4. **分級**：
   - 韓國：**19세 이상 시청가**——韓文維基 `시청등급 = 19` 與分級圖示（read）；IMDb Certifications South Korea 19（read）。
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-2，2026-11-08）；IMDb Certifications「Taiwan 15+」（read）。美國 TV-MA。
   - IMDb Parents Guide（**partial**：jina 回分數與 Certifications，沒有類別標題，依頁面固定順序對應，https://www.imdb.com/title/tt26450613/parentalguide/ ）：Sex & Nudity **Mild**（16/33）、Violence & Gore **Severe**（16/22）、Profanity **Severe**（11/15）、Alcohol, Drugs & Smoking **Mild**（14/18）、Frightening & Intense **Moderate**（12/19）。投稿提到：狙擊爆頭、割喉、用斧頭砍斷手、年輕女子被狗攻擊拖行；第 2 季有更重的髒話。**票數 15–33，參考性有限。**
5. **觀眾評分**：MDL 第 1 季 **8.7**（43,970 人，https://mydramalist.com/744135-the-killer-s-shopping-mall ）、第 2 季 **8.5**（11,663 人，https://mydramalist.com/783100-a-shop-for-killers-season-2 ），都 read。IMDb **8.0**（13K，cache；兩季同一條目）。RT：系列頁 Tomatometer **100%**（6 則）、Popcornmeter 90%（https://www.rottentomatoes.com/tv/a_shop_for_killers ，read；頁面沒標是哪一季，英文維基 2026-01 引用同數字，應是第 1 季）；第 2 季頁 0 則影評。
6. **推薦 tag**：
   - B：NYT 2024 最佳國際影集（Mike Hale）前十；Time-K2024（Burt）#4；Cine21-2024 #8
   - C：IMDb 8.0（13K）；MDL #50 8.7
   - E：FUNdex Awards 2024 OTT original drama finalist
7. **前置作品**：改編自姜智英的小說《킬러들의 쇼핑몰》（英文 *A Killer's Shopping Mall*，infobox `based_on`，read）。不必先看。infobox `related` 列了《The Killer's Shopping List》，沒有讀該條目，關係未查。第 2 季接第 1 季結局，要先看第 1 季。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-7d607023-2f51-40f8-9316-b554b7a05c41 (subscription) — 證據：The Disney+ TW page title 「觀看殺人者的購物中心 | Disney+」, 15+, live 2026-11-08. The Disney+ TW home page also promotes 「殺人者的購物中心第 2 季 | 現正熱播」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre＝Action drama（read）。**符合本篇（動作）**。劇情起點是舅舅的「自殺」，寫文時注意用語。

## 7. Bloodhounds

1. **片名**：**獵犬**（Netflix Taiwan trailer；tw-availability-2）／사냥개들／*Bloodhounds*
2. **劇情**：拳擊新秀金健宇為了救被高利貸集團盯上的母親，和前海軍陸戰隊戰友洪宇進、一名老派放貸人聯手對抗高利貸組織。Wikipedia：「a young boxer who teams up with a delinquent and a moneylender to fight against a loan shark organization」。來源：https://en.wikipedia.org/wiki/Bloodhounds_(TV_series) （read）
3. **季數與狀態**：**2 季共 15 集**，Netflix 原創。第 1 季 2023-06-09 上線；**第 2 季 2026-04-03 上線**（導言引 Netflix Newsroom 2026-03-04 新聞稿，read），MDL 第 2 季頁寫 7 集（read），所以第 1 季是 8 集（15 − 7，推算）。第 2 季主角換成對抗經營非法拳賽的跨國集團，Rain（鄭智薰）首度演反派（read）。片長 49–75 分鐘。英文維基沒有讀到第 3 季消息。
4. **分級**：
   - 韓國：**19**（IMDb Certifications South Korea 19，read）。韓文維基沒有查。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒標平台）。美國 TV-MA；中國列為 Banned。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26315487/parentalguide/ ）：Sex & Nudity **Mild**（66/130）、Violence & Gore **Severe**（73/97）、Profanity **Moderate**（31/60）、Alcohol, Drugs & Smoking **Moderate**（35/60）、Frightening & Intense **Severe**（47/64）。投稿提到：「Mostly all episodes have blood drawn」；**第 3 集有很長的刑求與水刑（waterboarding）場面，之後被迫脫衣並錄影**。
5. **觀眾評分**：MDL 第 1 季 **8.7**（65,588 人，https://mydramalist.com/701881-hounds ）、第 2 季 **8.7**（21,357 人，https://mydramalist.com/769141-bloodhounds-season-2 ），都 read。IMDb **8.2**（32K，cache；ratings 檔記 33K）。RT：第 1 季 Tomatometer **89%**（9 則）、Popcornmeter 91%（read）；第 2 季只有 3 則影評、**還沒有 Tomatometer**，Popcornmeter 85%（read）。
6. **推薦 tag**：
   - B：Time-K2023（de Guzman，Netflix-only，未排名）
   - C：IMDb 8.2（33K）；MDL #59 8.7
   - G：LINE TODAY 2023 台灣網友投票 #32（32 名中最後一名）
7. **前置作品**：改編自鄭燦（Jeong Chan）的同名 Naver 網漫（infobox `based_on`，read）。不必先看原作；第 2 季延續第 1 季兩位主角，建議照順序看。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81444051 — 證據 https://www.youtube.com/watch?v=drz8tTLXKzg （「《獵犬》第 2 季 | 正式預告 | Netflix」, Netflix Taiwan）, 2026-03-18. S1 trailer https://www.youtube.com/watch?v=ljVadpe53PA (Netflix Malaysia, 2023-05-25). — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Action drama / Crime thriller（read）。**符合本篇（動作）**。

## 8. The Uncanny Counter

1. **片名**：**驅魔麵館**（Netflix trailer; Netflix TW listing；tw-availability-2）／경이로운 소문／*The Uncanny Counter*
2. **劇情**：腿有殘疾的高中生昭文被招進「Counter」，白天在麵館打工、晚上和夥伴獵捕從陰間逃出來害人的惡靈。Wikipedia：「a group of paranormal hunters who search for and fight against evil spirits that escape from the afterlife to prey on humans」。來源：https://en.wikipedia.org/wiki/The_Uncanny_Counter （read）
3. **季數與狀態**：**2 季共 28 集，兩季在不同電視台**。第 1 季 OCN 2020-11-28 到 2021-01-24（週六日 22:30）16 集；第 2 季（副標 *Counter Punch*）tvN 2023-07-29 到 09-03（週六日 21:20）12 集。片長 70 分鐘。部分地區在 Netflix 串流（read）。英文維基沒有讀到第 3 季消息。MDL 搜尋另列一個「The Uncanny Return」條目（special），**沒有讀內容，不確定是否為官方特別篇**。
4. **分級**：**韓國分級來源互相矛盾**。
   - 韓國：韓文維基 `경이로운_소문_(드라마)` 的標題分級圖示檔名是 `Rating System(15).svg`、但圖示替代文字寫「19세 이상 시청가」，infobox `시청등급 = 19`（read，條目自相矛盾）；IMDb Certifications South Korea **15**（read）。**目前無法判定是 15 還是 19，也可能兩季不同**，寫文前要再查（例如 나무위키 分季頁）。
   - 台灣：IMDb Certifications「Taiwan 16+ Netflix rating」（read）。美國 TV-14 self-applied。
   - IMDb Parents Guide（**partial**：jina 回分數與 Certifications，沒有類別標題，依頁面順序對應，https://www.imdb.com/title/tt13273826/parentalguide/ ）：Sex & Nudity **None**（20/29）、Violence & Gore **Severe**（12/19）、Profanity **Mild**（7/11）、Alcohol, Drugs & Smoking **None**（8/11）、Frightening & Intense **Moderate**（8/17）。投稿提到：「quite a bit of fighting scenes and blood shown, people often die and/or get murdered」；有刺殺、霸凌。**票數 11–29，參考性有限。**
5. **觀眾評分**：MDL 第 1 季 **8.8**（81,956 人，https://mydramalist.com/62085-a-wonderful-rumor ）、第 2 季 **8.4**（32,726 人，https://mydramalist.com/684221-the-uncanny-counter-2 ），都 read。IMDb **8.0**（16K，cache）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**（https://www.rottentomatoes.com/tv/the_uncanny_counter ，read）。
6. **推薦 tag**：
   - C：IMDb 8.0（16K）；MDL #45 8.8
   - D：NielsenKR cable #41 10.999%
   - G：LINE TODAY 2023 台灣網友投票 #18（第 2 季）——同一串推文有人說驅魔麵館2 是「爛劇」，入榜是因為平台大；**這個 tag 只代表投票名次，不是好評**
7. **前置作品**：改編自張怡（Jang Yi）的 Kakao 網漫《경이로운 소문》（英文 *Amazing Rumor*，infobox `based_on`，read）。不必先看原作；第 2 季接第 1 季，要先看第 1 季。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81323551 (S1 + S2) — 證據 https://www.youtube.com/watch?v=2L71jyUFmfo （「驅魔麵館：第 2 季 | 正式預告 | Netflix」, Netflix Malaysia/@netflixasia, 「Netflix獨家」）, 2023-07-18. JustWatch TW: Netflix. — **confirmed (official channel, Asia zh channel)**（tw-availability-2）。**授權劇、官方證據停在 2023-07**（JustWatch TW 2026-11-08 仍列 Netflix，但只算線索），發文前要在台灣裝置確認。
- **類型核對**：infobox genre 第一項 Fantasy（後續被 ref 截斷）；導言寫獵捕惡靈的團隊，各成員有特殊能力（read；IMDb 簡介「the Counters use special abilities」，cache）。**符合本篇（超能力／奇幻動作）**。

## 9. Kingdom

1. **片名**：**李屍朝鮮**（Netflix YT；tw-availability-1）／킹덤／*Kingdom*
2. **劇情**：壬辰倭亂結束三年後的朝鮮，世子李蒼在宮廷權謀中發現殭屍瘟疫正吞沒鄉間，只能一邊奪回王權一邊求生。Wikipedia Premise：「finds a zombie apocalypse is ravaging the countryside amidst a brewing political conspiracy」。來源：https://en.wikipedia.org/wiki/Kingdom_(South_Korean_TV_series) （read）
3. **季數與狀態**：**2 季各 6 集 + 1 部特別篇**，Netflix 第一部韓國原創影集。第 1 季 2019-01-25、第 2 季 2020-03-13；**特別篇《Kingdom: Ashin of the North》2021-07-23**，講女真女子阿信的身世與「生死草」的來源，編劇金銀姬說它是通往第 3 季的「stepping stone」（read；特別篇在英文維基沒有獨立條目，轉址到主條目）。片長 36–56 分鐘；特別篇片長沒讀到。**第 3 季沒有續訂**：主演全智賢 2026-05 受訪表示「proyek ini akhirnya tidak diproduksi」（這個企劃最後沒有製作），CNN Indonesia 2026-05-29 轉述 JoyNews（cache）；Netflix 沒有正式宣布取消（Exa 搜尋摘要，snippet）。
4. **分級**：
   - 韓國：**19**（IMDb Certifications South Korea 19，read）。韓文維基沒有查。
   - 台灣：IMDb Certifications「Taiwan 16+」（read，沒標平台）。美國 TV-MA；英國 18（第 2 季 15）。
   - IMDb Parents Guide（**partial**：jina 回分數與 Certifications，沒有類別標題，依頁面順序對應，https://www.imdb.com/title/tt6611916/parentalguide/ ）：Sex & Nudity **None**（206/251）、Violence & Gore **Severe**（183/203）、Profanity **None**（88/118）、Alcohol, Drugs & Smoking **None**（82/128）、Frightening & Intense **Severe**（122/142）。投稿提到：殭屍撕咬吃人「in details」、斬首、人頭滾落、殘缺屍體、**食人場景**；「Rated R for bloody violence throughout」。**血腥與驚嚇度高，但幾乎沒有性與髒話。**
5. **觀眾評分**：MDL 第 1 季 **8.8**（53,963 人，https://mydramalist.com/22806-kingdom ）、第 2 季 **8.9**（40,058 人，https://mydramalist.com/32220-kingdom-2 ），都 read。IMDb **8.3**（66K，read，jina 讀 `/ratings/` 頁；Exa 兩次逾時）。RT：第 1 季 Tomatometer **94%**（17 則）、Popcornmeter 96%；第 2 季 **100%**（10 則）、95%（https://www.rottentomatoes.com/tv/kingdom_2019/s01 、/s02，read）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2020
   - B：NYT 2010 年代最佳國際影集 30 部（Mike Hale，2019）#20；Cine21-2021 #10（並列，特別篇 Ashin of the North）
   - C：IMDb 8.3（66K）；MDL S2 #31 8.9、S1 #43 8.8
   - F：PTT 2021 入坑串 4（範圍外舊串，只作經典口碑）
7. **前置作品**：改編自金銀姬編劇、梁慶一作畫的網漫《神의 나라: 버닝헬》（英文 *The Kingdom of the Gods*，infobox `based_on`，read）。不必先看原作。**順序：第 1 季 → 第 2 季 → 特別篇**；特別篇是前傳性質，但伏筆接在第 2 季結尾，建議放最後看。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/80180171 — 證據 https://www.youtube.com/watch?v=KpLRkMXQOII 「《李屍朝鮮》第 2 季 | 主要預告 | Netflix」, Netflix Malaysia (Asia zh channel), 2020-03-05 (「Netflix 獨家」) — **confirmed (official channel, Asia zh). It is a Netflix original, so lapse risk is low.**（tw-availability-1）。特別篇在台灣的片名與上架狀態，tw-availability 沒有記錄。
- **類型核對**：infobox genre＝Sageuk / Political drama / Action / Horror-thriller；導言「zombie sageuk action horror thriller」（read）。**符合本篇（殭屍生存）**；恐怖與血腥程度要提醒。

## 10. Death's Game

1. **片名**：**死期將至**（TW media；tw-availability-1）／이재, 곧 죽습니다／*Death's Game*
2. **劇情**：求職七年失敗、被詐騙、被趕出租屋的崔伊在選擇自殺，觸怒了「死亡」，被罰輪迴到 12 個即將死去的人身上，只要能在其中一世活下來，就能繼續那段人生。Wikipedia：「forces him to experience 12 cycles of reincarnation and death」。來源：https://en.wikipedia.org/wiki/Death%27s_Game （read）
3. **季數與狀態**：1 季 **8 集**，TVING 2023-12-15 到 2024-01-05（韓文維基「8부작」，read）。MDL 把它拆成 Part 1、Part 2 兩個條目；兩部各幾集沒讀到。片長 38–64 分鐘。韓國以外部分地區在 Amazon Prime Video 串流（導言，read）。**已完結的單季完整故事**，沒讀到續訂。
4. **分級**：
   - 韓國：**19**（IMDb Certifications South Korea 19，read）。韓文維基沒有分級欄（read）。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒標平台）。美國 TV-MA。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26225038/parentalguide/ ）：Sex & Nudity **None**（35/38）、Violence & Gore **Severe**（25/30）、Profanity **Mild**（16/27）、Alcohol, Drugs & Smoking **Mild**（21/28）、Frightening & Intense **Severe**（22/28）。投稿提到：「Scenes of suicide, gory accidents, and murder」。**整部劇以自殺為起點，必須加自殺議題警語**；英文維基導言也寫評論批評它「a simplified approach to mental health」（read）。
5. **觀眾評分**：MDL Part 1 **8.8**（58,061 人，https://mydramalist.com/733445-i-will-die-soon ）、Part 2 **8.8**（45,597 人，https://mydramalist.com/761313-death-s-game-part-2 ），都 read。IMDb **8.4**（26K，cache）。RT：`/tv/deaths_game` 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - B：Time-K2024（Burt）#9
   - C：IMDb 8.4（26K）；MDL Part 2 #40 8.8、Part 1 #42 8.8
   - F：PTT 2023 年度韓劇徵文 36 推（該次徵文最高）；Dcard Z.Y 4 分；PTT 2026 入坑串 1
   - G：LINE TODAY 聚光賞 2024 十大追劇榜 #10
7. **前置作品**：改編自李元植、꿀찬（Ggulchan）的同名網漫（infobox `based_on`，read）。不必先看。
8. **台灣串流**：Prime Video (subscription): https://www.primevideo.com/-/zh_TW/detail/0ST2GP2VV9J9AKW7YJ6PZ67UYN (language page; link only) — 證據 https://today.line.me/tw/v3/article/60qjp2X LINE TODAY, 2026-02-02. The article is about Taiwan Mobile's Prime Video telecom plan and lists 《死期將至》 among Prime Video's Korean titles. Also Yahoo TW 2024-01-12 「在 Prime Video 熱播」. — **confirmed (Taiwan media, 2026-02-02)**（tw-availability-1）。授權劇，證據 2026-02，尚可，但 Prime Video 連結只是語言頁。
- **類型核對**：infobox genre＝Fantasy / Anthology / Mystery（read）。**類型偏離本篇**：主軸是奇幻輪迴與生死觀，不是動作或超能力；「每一世都要想辦法活下來」可勉強算生存元素。**需要人工判斷是否留在本篇**，或移到奇幻類。

## 11. D.P.

1. **片名**：**D.P：逃兵追緝令**（Netflix YT；tw-availability-1；Netflix Taiwan 標題 P 後面沒有句點）／디피／*D.P.*
2. **劇情**：2014 年，二等兵安俊浩被編入憲兵隊的逃兵追緝組（D.P.），和上兵韓浩烈一起追捕逃兵，看見每個逃兵背後的軍中霸凌與虐待。Wikipedia Synopsis：「The widespread bullying and hazing as well as the mindset for the "survival of the fittest" are rife」。來源：https://en.wikipedia.org/wiki/D.P._(TV_series) （read）
3. **季數與狀態**：**2 季各 6 集**，Netflix 原創。第 1 季 2021-08-27、第 2 季 2023-07-28，第 2 季直接接第 1 季（read）。片長 41–64 分鐘。英文維基 infobox `num_seasons = 2`，沒讀到第 3 季消息。
4. **分級**：
   - 韓國：**19**（IMDb Certifications South Korea 19，read）。韓文維基沒有查。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒標平台）。美國 TV-MA；中國列為 Banned。
   - IMDb Parents Guide（**partial**：jina 回分數與 Certifications，沒有類別標題，依頁面順序對應，https://www.imdb.com/title/tt13024974/parentalguide/ ）：Sex & Nudity **Mild**（30/52）、Violence & Gore **Severe**（21/26）、Profanity **Severe**（18/24）、Alcohol, Drugs & Smoking **Moderate**（13/21）、Frightening & Intense **Moderate**（14/22）。投稿提到：反覆揍臉、用鋼盔打臉、拳套手銬毆打；上級逼士兵脫褲子（**軍中霸凌與性羞辱**）。**票數 21–52，參考性有限。**
5. **觀眾評分**：MDL 第 1 季 **8.7**（49,802 人，https://mydramalist.com/59001-d-p-dog-day ）、第 2 季 **8.7**（26,243 人，https://mydramalist.com/713549-d-p-season-2 ），都 read。IMDb **8.2**（13K，cache）。RT：第 1 季 Tomatometer **100%**（5 則）、Popcornmeter 93%；第 2 季 **100%**（6 則）、86%（https://www.rottentomatoes.com/tv/dp/s01 、/s02，read；樣本很小）。
6. **推薦 tag**：
   - A：Baeksang Drama **WIN** 2022；Blue Dragon Series Awards Drama **WIN** 2022
   - B：Cine21-2021 #3；Cine21-2023 #10（S2）；Time-K2023（de Guzman）〔S2〕
   - C：IMDb 8.2（13K）；MDL #51 8.7
   - E：FUNdex Awards 2023 OTT drama finalist（S2）
   - G：LINE TODAY 2023 台灣網友投票 #24（第 2 季）
7. **前置作品**：改編自金普通（Kim Bo-tong）的 Lezhin 網漫《D.P 개의 날》（英文 *D.P Dog's Day*，infobox `based_on`，read）；金普通也是共同編劇。不必先看原作；第 2 季是第 1 季的直接延續，要先看第 1 季。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81280917 — 證據 https://www.youtube.com/watch?v=1uScion-1OY 「《D.P：逃兵追緝令》第 2 季 | 正式預告 | Netflix」, Netflix Malaysia (Asia zh channel), 2023-07-13 — **confirmed (official channel, Asia zh)**（tw-availability-1）。Netflix 原創，下架風險低。
- **類型核對**：infobox genre 第一項 Military drama；導言寫「military action television series」（read）。**類型偏離本篇**：有追捕與打鬥，但核心是軍中霸凌的社會寫實劇。**需要人工判斷**；若留在本篇，介紹時要說清楚它不是爽快動作劇。

---

## 總結

- **季數與狀態**：
  - 已完結：魷魚遊戲（3 季 22 集，官方稱第 3 季為最終季）、死期將至（1 季 8 集）。
  - 沒有續訂消息、可視為目前完結：李屍朝鮮（2 季 + 特別篇；第 3 季未製作）、D.P.（2 季）、驅魔麵館（2 季）、弱美男英雄（Class 1、2）、獵犬（2 季，第 2 季 2026-04-03 上線）、殺人者的購物中心（2 季，第 2 季 2026-07～08 上線）。
  - **續季製作中或已續訂、尚未播出**：Moving 異能第 2 季（2026-05 開拍，未定檔）、流氓讀書會第 2 季（2025-08 續訂，MDL 寫 2026 年、尚未開播）。
  - **續季未確認**：鐵拳教育（Netflix 2026-07-21 稱「沒有定案」，Top 10 網站標為 Limited Series）。
- **跨平台**：弱美男英雄 Class 1 是 Wavve、Class 2 是 Netflix；驅魔麵館 S1 是 OCN、S2 是 tvN。台灣目前兩部都整合在 Netflix。
- **韓國分級**：10 部是 19 歲以上（청소년 관람불가／19세 이상）；驅魔麵館來源矛盾（IMDb 15、韓文維基同一條目同時出現 15 和 19）。Moving 的 IMDb 寫 18，和韓文來源的 19 不一致。
- **台灣平台分級**：Disney+ TW 服務頁 Moving 15+、殺人者的購物中心 15+；IMDb 列 Netflix rating 的只有驅魔麵館 16+；其他（獵犬、死期將至、D.P. 15+，李屍朝鮮 16+，Moving 15+ self-applied）沒標平台。魷魚遊戲、弱美男英雄、鐵拳教育、流氓讀書會沒有讀到台灣分級。
- **內容警語重點**（IMDb Parents Guide，使用者投稿）：
  - 自殺：死期將至（劇情起點）、魷魚遊戲（角色舉槍考慮自殺、自傷疤痕）、鐵拳教育（自殺未遂與相關對話）；殺人者的購物中心以舅舅「自殺」開場。
  - 霸凌：弱美男英雄（含一段男對男性侵擾）、D.P.（軍中霸凌）、鐵拳教育（校園與網路霸凌）、驅魔麵館。
  - 重度血腥：Moving 異能、李屍朝鮮（含食人）、魷魚遊戲、殺人者的購物中心、獵犬（第 3 集水刑）。
  - 毒品與未成年：弱美男英雄、鐵拳教育（學生販毒）。
- **評分**：MDL 第一季或主條目全部 8.4–9.1；最高是弱美男英雄 Class 1 9.1（132,335 人，本篇評分人數最多）。魷魚遊戲是唯一逐季下滑的（8.4 → 8.1 → 7.6）。IMDb 7.9–8.4；魷魚遊戲 783K 票，比其他 10 部加總還多。RT 有 Tomatometer 的 8 部全部 ≥79%，但除了魷魚遊戲外都只有 5–17 則影評。
- **類型核對**：9 部符合「動作、生存與超能力」。**需要人工判斷 2 部**：死期將至（Wikipedia 歸類 fantasy／anthology／mystery）、D.P.（military drama，核心是軍中霸凌寫實）。**介紹時要調整說法 2 部**：鐵拳教育、流氓讀書會（基調偏喜劇爽劇）。
- **台灣串流風險**：
  - 驅魔麵館：授權劇，官方證據停在 2023-07（Asia 頻道），只有 JustWatch 2026-11-08 旁證，**需台灣裝置確認**。
  - 弱美男英雄 Class 1：原為 Wavve 原創、在 Netflix 是授權，證據 2025-05；Class 2 是 Netflix 原創。
  - 李屍朝鮮（2020）、D.P.（2023）證據較舊，但都是 Netflix 原創，風險低。李屍朝鮮特別篇的台灣片名與上架未查。
  - 死期將至：Prime Video 證據是 2026-02 媒體，平台連結只是語言頁。
  - 流氓讀書會：friDay 免費方案，服務頁 2026-11-08 在架；LINE TV 頁狀態未查。

## 無法查證的事實

1. 驅魔麵館的韓國分級：韓文維基同一 infobox 出現 15（圖示檔名）與 19（`시청등급` 欄、圖示替代文字），IMDb 寫 15。沒有找到可判定的第三來源，也不確定是否兩季分級不同。
2. 魷魚遊戲、弱美男英雄、鐵拳教育的韓國分級只來自 나무위키 Exa 快取（cache；魷魚遊戲第 2、3 季那兩列是空白）；流氓讀書會、獵犬、李屍朝鮮、死期將至、D.P. 的韓國分級只有 IMDb Certifications（使用者可編輯，屬旁證）；只有殺人者的購物中心是韓文維基與 IMDb 一致。Moving 的 IMDb South Korea「18」與韓文來源的「19」不一致。
3. 魷魚遊戲、弱美男英雄、鐵拳教育的 IMDb Certifications 沒有回傳（jina 與 Exa 都缺），所以沒有台灣列。
4. Parents Guide 類別依頁面順序推定（jina 沒回傳類別標題）的有：殺人者的購物中心、驅魔麵館、李屍朝鮮、D.P.；鐵拳教育由 Exa 段落內容對應。弱美男英雄的票數 jina（91/104）和 Exa（90/103）差 1 票，採 jina。
5. 獵犬第 1 季 8 集是用總集數 15 減 MDL 第 2 季 7 集推算，沒有直接讀到第 1 季集數。
6. 死期將至 Part 1／Part 2 各幾集、各自上線日沒讀到；只讀到整體 2023-12-15 到 2024-01-05。
7. 李屍朝鮮第 3 季：全智賢「沒有製作」的說法來自 CNN Indonesia 轉述 JoyNews（cache）；Netflix 是否正式宣布取消，只有搜尋摘要（snippet）說沒有。特別篇片長沒讀到。
8. 流氓讀書會第 2 季播出日：只有 MDL「Airs: 2026 - ?」，沒有官方定檔來源。
9. 殺人者的購物中心 RT 系列頁 100%（6 則）沒標季別；推定是第 1 季。infobox `related` 的《The Killer's Shopping List》與本劇的關係沒有查。
10. MDL「The Uncanny Return」條目是否為驅魔麵館官方特別篇，沒有讀內容。
11. 鐵拳教育原作網漫爭議、全教組抗議的內容沒有讀（只讀到英文維基一句與 나무위키 目錄）。
12. 所有 Netflix TW 上架狀態：沒有台灣 IP，netflix.com/tw 頁不是證據（沿用 tw-availability 規則）。

## toolDegradation

- **Groundlane `web_extract`**：英文 Wikipedia raw、韓文 Wikipedia raw（部分）、Wikidata SPARQL（`web_fetch`）、MyDramaList（含站內搜尋，render=never）、Rotten Tomatoes 都正常。`Weak_Hero_Class_1`、`Bloodhounds_(South_Korean_TV_series)`、`Kingdom:_Ashin_of_the_North` 是轉址頁，改抓目標條目。
- **韓文 Wikipedia**：`약한영웅`、`약한영웅_(드라마)` 回 Wikimedia Error（3,187 bytes 錯誤頁），改用 나무위키。`경이로운_소문` 是網漫條目，改抓 `경이로운_소문_(드라마)`。
- **나무위키**：沿用 kr1 的經驗直接走 Exa `web_fetch_exa`（cache，5/5 成功），沒有再試 Groundlane／jina。
- **IMDb Parents Guide**：jina `read_url`（無 key，`question` 參數無效、回全文）11/11 有內容；其中 6 頁缺類別標題、3 頁缺 Certifications。魷魚遊戲、弱美男英雄、鐵拳教育改用 Exa `web_fetch_exa` 補類別標題（cache），Certifications 仍缺。
- **IMDb 標題頁**：沿用 kr1 經驗（Groundlane 回機器人頁）直接用 Exa `web_fetch_exa`，10/11 成功（cache）；李屍朝鮮兩次 `CRAWL_LIVECRAWL_TIMEOUT`，改 jina 讀 `/ratings/` 頁成功（read）。
- **Rotten Tomatoes**：`deaths_game`、`study_group`、`weak_hero_class_2` 三個 slug 猜測 404（回首頁）；`weak_hero` 自動轉到 `weak_hero_class_1`。404 只代表那個網址不存在，不完全排除 RT 用別的 slug。
- **新聞查核**（Moving 2、鐵拳教育 2、李屍朝鮮 3）：Exa `web_search_exa` 找到後用 `web_fetch_exa` 讀原文（cache）。沒有用 Groundlane `web_search`。
- **沒有使用**：Tavily MCP（限流）、Firecrawl（額度用完）、終端機 curl（環境封鎖）。
