# Post 2b 事實表：美劇｜政治、諜報、動作與懸疑驚悚（12 部）

- 查核日：2026-11-05。順序照 `post2b-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**partial** 表示只讀到前段；**cache** 表示讀到的是搜尋引擎快取副本；**snippet** 表示只看到搜尋摘要或 highlight，不能當成讀過。
- 欄位 6（推薦 tag）直接取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G）。**已刪掉**：所有標 `(snippet)` 的 tag（例如 Roomie/IMDb、Cosmo TW 2025）、反面意見、業配；另外刪掉沒有分數的 `C RT 2025 list (rank 99-121, score not captured)`（沒有資訊量）。候選檔裡沒有 E 類（Parrot、GWR）資料的劇就不列 E。
- 欄位 8（台灣串流）先照抄 `tw-availability-1/2/3.md` 與 `tw-availability-official.md`，再補查台灣官方證據（Netflix Taiwan YouTube、Disney+ zh-tw 頁、台灣媒體）。判定標準沿用 `tw-availability-official.md`：Netflix `netflix.com/tw/title/…` 頁會依請求者 IP 換地區，**不當證據**；Prime Video `zh_TW` 頁只代表語言，**不當證據**；Disney+ `/zh-tw/browse/entity-…` 頁視為 Disney+ 自己的台灣目錄頁（confirmed）。沒有用台灣 IP，也沒有繞過任何驗證。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、季數、狀態、S1 集數、前置作品 | 英文 Wikipedia：MediaWiki API `prop=extracts&exintro`（導言）＋條目 wikitext（`action=raw`）抽 infobox `num_seasons` / `num_episodes` / `last_aired`、`episodes1`、Premise 段落、續訂句 | Groundlane `web_fetch` / `web_extract`（pattern） | read（12/12） |
| IMDb ID | Wikidata SPARQL（P345） | Groundlane `web_fetch` | read |
| 分級細項＋美國分級＋IMDb 列的台灣分級 | IMDb Parents Guide `https://www.imdb.com/title/<id>/parentalguide/` | Exa `web_fetch_exa` 只回標題（空頁）→ Jina `read_url`（無 API key，回全文） | read（12/12；Reacher、The Beast in Me 兩頁沒抓到 Certifications 區塊，美國分級改看標題頁） |
| 美國分級（標題列，補 Reacher、Beast） | IMDb 標題頁 | Exa `web_fetch_exa` | read |
| Tomatometer / Popcornmeter / Critics Consensus | RT 季頁 `slot="critics-score"` / `slot="audience-score"` / `slot="critics-reviews"` / `#critics-consensus p` | Groundlane `web_extract`（render=never） | read（12/12 S1；另讀 6 部最新季） |
| 台灣管道補查 | Netflix Taiwan YouTube 頁（`meta[name=title]`、`link[itemprop=name]`、`meta[itemprop=datePublished]`）、Disney+ zh-tw 頁、台灣新聞 | Groundlane `web_search`（tavily/brave）＋`web_extract`、`web_fetch` | 見各劇欄位 8 |

嚴重度用 IMDb 的原文詞（None / Mild / Moderate / Severe），括號內是頁面顯示的「X of Y found this …」票數。**Parents Guide 的內容是使用者投稿與投票**，不是官方分級。5 個類別：性與裸露、暴力與血腥、髒話、菸酒與藥物、驚嚇與緊張場面。

---

## 1. Homeland

1. **片名**：反恐危機（Disney+ TW 頁標題「觀看反恐危機 | Disney+」，read）／*Homeland*。fans 檔原註「譯名待查」，這次以 Disney+ 頁確認。
2. **劇情**：CIA 探員 Carrie Mathison（Claire Danes）患有躁鬱症，她深信從伊拉克獲救歸國的陸戰隊狙擊手 Nicholas Brody（Damian Lewis）已被蓋達組織「策反」，會威脅美國本土安全。改編自以色列影集《Prisoners of War》。來源：https://en.wikipedia.org/wiki/Homeland_(TV_series) （read）
3. **季數與狀態**：8 季、96 集，2011-10-02 到 2020-04-26，**已完結**（第 8 季為最終季）。第 1 季 12 集。來源：同上（infobox `num_seasons=8`、`num_episodes=96`、`episodes1=12`，read）
4. **分級**：美國 **TV-MA**（另有 TV-14 edited version）。Sex & Nudity **Severe**（152/297）、Violence & Gore **Moderate**（60/127）、Profanity **Severe**（75/147）、Alcohol, Drugs & Smoking **Mild**（67/115）、Frightening **Moderate**（48/124）。投稿特別提到：多場露骨性愛與女性裸露；自殺炸彈攻擊的後果畫面、酷刑倒敘（以第 2–4 季為多）；頻繁 f-word；「This show is more suspenseful than it is violent.」IMDb Certifications 沒有列台灣。來源：https://www.imdb.com/title/tt1796960/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **100%**（32 則），Popcornmeter **93%**（1,000+）。Consensus：「Homeland is an addictive, politically resonant spy thriller and compelling character study that benefits from superb performances.」來源：https://www.rottentomatoes.com/tv/homeland/s01 （read）。最新季 S8：Tomatometer 85%（102 則）/ Popcorn 87%（https://www.rottentomatoes.com/tv/homeland/s08 ，read），沒有明顯落差。
6. **推薦 tag**：
   - A：Emmy Drama nom 2016（awards 檔視窗只到 2016 起；Wikipedia 導言：S1 拿下 **2012 年 Emmy 最佳劇情類影集**，2011、2012 年兩度拿金球獎最佳劇情類影集，Danes 兩座 Emmy 女主角）
   - B：BBC2021 #46；NYT2026 #38
   - F：PTT 2026 推薦串 (OP)
7. **前置作品**：沒有必看前作。改編自以色列劇《Prisoners of War》（*Hatufim*），不必先看。來源：同欄位 2（read）。「不必先看」是編輯判斷。
8. **台灣串流**：**Disney+（訂閱，8 季）** https://www.disneyplus.com/zh-tw/browse/entity-d5779fa8-8bac-419b-8539-38a8cfeb1505 — 原檔 tw-availability-1 記為 B。**重新查核**：Groundlane `web_extract` 讀到頁面標題「觀看反恐危機 | Disney+」、台灣式分級 15+、「8 季」（read）。依 `tw-availability-official.md` 的 Disney+ 標準，升為 **confirmed（official service page）**。Netflix（https://www.netflix.com/tw/title/70180387 ）原記 C（JustWatch only），這次沒有找到 Netflix Taiwan 官方證據，維持 **unconfirmed**，建議文章只寫 Disney+。

## 2. The Diplomat

1. **片名**：頭號外交官（Netflix Taiwan YouTube「《頭號外交官》第 3 季 | 正式預告 | Netflix」，read）／*The Diplomat*
2. **劇情**：國際危機爆發之際，資深外交官 Kate Wyler（Keri Russell）意外被任命為美國駐英大使，這份她並不擅長的高曝光職位，牽動她的婚姻與政治前途。來源：https://en.wikipedia.org/wiki/The_Diplomat_(American_TV_series) （read）
3. **季數與狀態**：4 季、30 集（2023-04-20 起；第 2 季 2024-10、第 3 季 2025-10、第 4 季 2026-10 上線）。**2026-10-29 已續訂第 5 季**。第 1 季 8 集。來源：同上（infobox、`episodes1=8`；續訂句引 THR〈'The Diplomat' Renewed for Season 5 at Netflix〉，read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（151/413）、Violence & Gore **Mild**（55/97）、Profanity **Severe**（118/226）、Alcohol, Drugs & Smoking **Mild**（75/107）、Frightening **None**（57/102）。投稿特別提到：男女背面裸露；肢體衝突。IMDb 列出的台灣分級是 16+。來源：https://www.imdb.com/title/tt17491088/parentalguide/ （read）。主要成人內容是髒話。
5. **RT（S1）**：Tomatometer **84%**（55 則），Popcornmeter **61%**（1,000+）。Consensus：「Keri Russell's scrappy performance negotiates the best possible terms for The Diplomat, a soapy take on statecraft that manages to make geopolitical crises highly bingeable entertainment.」來源：https://www.rottentomatoes.com/tv/the_diplomat/s01 （read）。**最新季差很多**：S4 Tomatometer 97%（29 則）/ Popcorn 87%（https://www.rottentomatoes.com/tv/the_diplomat/s04 ，read）；候選檔另記 S2 95% / 85%。觀眾分數從 S1 的 61% 明顯上升。
6. **推薦 tag**：
   - A：Emmy Drama nom 2025、2026；GG Drama nom 2024、2025、2026（Wikipedia：共 10 項 Emmy 提名，Allison Janney 得一座 Emmy）
   - B：NYT2026 #94；CT10-2025 agg #23=
   - C：RT 2024 S2 95% / Popcorn 85%
7. **前置作品**：沒有，是原創劇。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81288983 ；JW：https://www.justwatch.com/tw/節目/the-diplomat-0 — 原檔記 **JustWatch only**（tw-availability-3；注意 slug 是 `the-diplomat-0`）。**重新查核**：Netflix Taiwan 官方 YouTube「《頭號外交官》第 3 季 | 正式預告 | Netflix」，頻道 Netflix Taiwan，2025-09-18 上傳，說明文字「Netflix 獨家」https://www.youtube.com/watch?v=p9LNMTxKBDw （Groundlane `web_extract` 讀到標題、頻道、日期，read）→ **confirmed（official channel）**。台灣譯名「頭號外交官」也一併確認。

## 3. Zero Day

1. **片名**：零日風暴（Netflix Taiwan YouTube「《零日風暴》| 正式預告 | Netflix」，read）／*Zero Day*。注意：台灣另有一部台劇《零日攻擊》（LINE TV／PTS+），是不同作品。
2. **劇情**：美國遭到毀滅性的「零日」網路攻擊後，一位已卸任的前總統（Robert De Niro）受命主持調查委員會、追查元兇。來源：https://en.wikipedia.org/wiki/Zero_Day_(American_TV_series) （read：「It is about a former president investigating a devastating zero-day cyberattack in the US.」）
3. **季數與狀態**：**迷你影集**（RT 標為 Limited Series），6 集，2025-02-20 在 Netflix 一次上線，**已完結**。Wikipedia 導言寫「received mixed reviews」。來源：同上（`num_episodes=6`，read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **None**（43/77）、Violence & Gore **Mild**（24/45）、Profanity **Moderate**（20/58）、Alcohol, Drugs & Smoking **Mild**（19/36）、Frightening **Mild**（21/43）。投稿特別提到：網攻造成的飛機、火車事故與大規模死亡（多為遠景）；吊掛屍體；每集約 5–6 次 f-word。IMDb 列出的台灣分級是 15+。來源：https://www.imdb.com/title/tt23872886/parentalguide/ （read）
5. **RT**：Tomatometer **53%**（81 則），Popcornmeter **53%**（1,000+）。Consensus：「Zero Day has plenty of gravitas thanks to its all-star cast led by Robert De Niro, but this high-concept series' plotting is a little too goofy for it to take itself so seriously.」來源：https://www.rottentomatoes.com/tv/zero_day/s01 （read）。**本批評價最低的一部**。
6. **推薦 tag**：
   - A/B：無（awards 檔沒有收錄）
   - D：Netflix H1 2025 #4（61.3M）
   - F：PTT 2026 推薦串
   - G：LINE TODAY 聚光賞 2025 前十
7. **前置作品**：沒有，是原創劇。
8. **台灣串流**：Netflix（訂閱，限定影集）https://www.netflix.com/tw/title/81598435 — 原檔記 **C（JustWatch only）**（tw-availability-1）。**重新查核**：Netflix Taiwan 官方 YouTube「《零日風暴》| 正式預告 | Netflix」，頻道 Netflix Taiwan，2025-01-22 上傳 https://www.youtube.com/watch?v=bjDRDdkQU5I （read）→ **confirmed（official channel）**。

## 4. Paradise

1. **片名**：極樂凶間（Disney Plus TW YouTube，見 tw-availability-official）／*Paradise*。早期 Disney+ TW FB 曾寫作「極樂兇間」，現行官方寫法是「極樂凶間」。
2. **劇情**：故事設定在末日浩劫三年後、科羅拉多州一座城市規模的地下碉堡，特勤局探員 Xavier Collins（Sterling K. Brown）追查美國總統遇害的真相，他自己也成了嫌疑人。來源：https://en.wikipedia.org/wiki/Paradise_(2025_TV_series) （Premise 段落，read）。注意：「地下碉堡」是第 1 集結尾的揭曉，Variety 評論者說片商禁止透露，寫文時要決定要不要爆。
3. **季數與狀態**：2 季、16 集（S1 2025-01-26 起；S2 2026-02-23 首播）。**2026 年 3 月已續訂第 3 季，也是最終季**（「renewed for a third and final season」）；IMDb 標題頁寫「Season 3 premiere 2027」。第 1 季 8 集。來源：同上（read）；IMDb：https://www.imdb.com/title/tt27444205/ （read，Exa）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（94/227）、Violence & Gore **Moderate**（46/113）、Profanity **Moderate**（49/122）、Alcohol, Drugs & Smoking **Mild**（53/81）、Frightening **Mild**（32/75）。投稿特別提到：男性背面裸露、兩場不露點的性愛；槍擊、刀刺與大量血跡但沒有內臟級血腥；第 7 集〈The Day〉情緒強烈。IMDb 列出的台灣分級是 15+。來源：https://www.imdb.com/title/tt27444205/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **86%**（81 則），Popcornmeter **85%**（1,000+）。Consensus：「Teeming with heady concepts and themes, Paradise is an overstuffed but addictively ambitious reunion of Sterling K. Brown and creator Dan Fogelman.」來源：https://www.rottentomatoes.com/tv/paradise_2025/s01 （read）。S2：90%（90 則）/ 84%（https://www.rottentomatoes.com/tv/paradise_2025/s02 ，read）。
6. **推薦 tag**：
   - A：Emmy Drama nom 2025、2026（Wikipedia：共 11 項 Emmy 提名）
   - B：Variety2025（Aramide Tinubu #4）；CT10-2025 agg #16
   - C：RT 2025 S1 86% / Popcorn 85%
   - D：Nielsen H1 2026 #14 original 5.66B min
   - F：PTT D+ 推薦串
   - G：ELLE TW 2025 #12
7. **前置作品**：沒有，是原創劇（Dan Fogelman 與 Sterling K. Brown 繼《This Is Us》後再合作，但劇情無關）。
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-2b4b8988-50c9-4097-bf93-bc34a99a5b4f ；JW：https://www.justwatch.com/tw/節目/paradise-2025 — **confirmed（official channel）**：Disney Plus TW YouTube「《極樂凶間》 第二季 | 前導預告 | Disney+ 即將上線」https://www.youtube.com/watch?v=j3zAh5zh3VU （2025-12-10；tw-availability-official）。Hulu 原創，台灣在 Disney+。

## 5. The Night Agent

1. **片名**：暗夜情報員（Netflix Taiwan YouTube「《暗夜情報員》 第 2 季 | 正式預告 | Netflix」，read）／*The Night Agent*
2. **劇情**：FBI 基層探員 Peter Sutherland（Gabriel Basso）在白宮地下室值守一支「從不響」的緊急專線，某夜電話響起，他因此捲入政府最高層有內鬼的龐大陰謀，同時要保護前科技公司執行長 Rose Larkin。改編自 Matthew Quirk 的同名小說。來源：https://en.wikipedia.org/wiki/The_Night_Agent （Premise 段落，read）
3. **季數與狀態**：3 季、30 集（S1 2023-03-23；S2 2025-01-23；S3 2026-02-19）。**已續訂第 4 季，也是最終季**（2026-05-04 宣布；2026-09-30 殺青；Wikipedia：「set to premiere in 2027」）。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（179/409）、Violence & Gore **Moderate**（72/112）、Profanity **Moderate**（64/202）、Alcohol, Drugs & Smoking **Mild**（68/89）、Frightening **Moderate**（59/94）。投稿特別提到：第 3 集短暫男性背面全裸，S2、S3 幾乎沒有性與裸露；槍戰、勒斃、刺殺與血泊；每季約 20–30 次 f-word。使用者建議分級：「Rated R for strong violence, language, and some sexuality.」IMDb 列出的台灣分級是 16+。來源：https://www.imdb.com/title/tt13918776/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **74%**（31 則），Popcornmeter **78%**（1,000+）。Consensus：「Bingeable as a beach read and just as forgettable, The Night Agent is a routine spy thriller told with commendable bravado.」來源：https://www.rottentomatoes.com/tv/the_night_agent/s01 （read）。S3：86%（14 則）/ 82%（https://www.rottentomatoes.com/tv/the_night_agent/s03 ，read）。候選檔另記 S2 86% / Popcorn 40%（觀眾對 S2 評價低，引用時要小心）。
6. **推薦 tag**：
   - C：RT 2025 S2 86% / Popcorn 40%（觀眾分數低，引用要標明季數）
   - D：Nielsen 2023 #2 original 14.4B min；Nielsen 2025 #8 original 13.19B min；Netflix H1 2025 #9（S2 53.2M）
   - F：PTT 2026 推薦串
   - G：ELLE TW 2025 #10
7. **前置作品**：沒有。原著是單本小說，不必先讀；S1 已把原著改完，S2 起是原創劇情。來源：同欄位 2（read）。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81450827 ；JW：https://www.justwatch.com/tw/節目/the-night-agent — 原檔記 **JustWatch only**（tw-availability-3）。**重新查核**：Netflix Taiwan 官方 YouTube「《暗夜情報員》 第 2 季 | 正式預告 | Netflix」，頻道 Netflix Taiwan，2024-12-25 上傳，說明「1 月 23 日回歸，Netflix 獨家」https://www.youtube.com/watch?v=FNMB0GFpbAI （read）→ **confirmed（official channel）**。S1 預告在 Netflix Malaysia（@netflixasia）頻道（https://www.youtube.com/watch?v=BgV-RiThdAc ，snippet），S3 沒有找到台灣頻道版本。

## 6. Reacher

1. **片名**：神隱任務（Yahoo 奇摩 2026-08 美劇片單、Prime Video zh_TW 頁「神隱任務-第一季」）／*Reacher*。JW TW 顯示的「侠探杰克」是中國譯名，不是台灣譯名。
2. **劇情**：改編自 Lee Child 的 Jack Reacher 小說系列，Alan Ritchson 飾演自稱流浪漢的前美國陸軍憲兵 Jack Reacher，他在旅途中一再撞上危險罪犯，捲入深層陰謀。來源：https://en.wikipedia.org/wiki/Reacher_(TV_series) （read）
3. **季數與狀態**：4 季、32 集（S1 2022-02-04；S2 2023-12-15；S3 2025-02-20；S4 2026-08-12 到 09-16）。**已續訂第 5、6 季**（S5 改編《Make Me》）；IMDb 標題頁寫「Season 5 premiere 2027」。衍生劇《Neagley》2026-09-16 首播。第 1 季 8 集（改編第一本《Killing Floor》）。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt9288030/ ）。Sex & Nudity **Moderate**（432/1242）、Violence & Gore **Severe**（324/457）、Profanity **Moderate**（211/418）、Alcohol, Drugs & Smoking **Mild**（244/354）、Frightening **Moderate**（177/365）。投稿特別提到：被閹割釘在牆上的男屍、監獄淋浴間挖眼、為塞進後車廂折斷屍體雙腿、活埋進水泥；女性胸部裸露的淋浴性愛與脫衣舞俱樂部；S2 有吸古柯鹼。使用者建議分級：「Rated R for strong violent content throughout, bloody images, strong language, sexuality and substance use.」來源：https://www.imdb.com/title/tt9288030/parentalguide/ （read；這次沒有抓到 Certifications 區塊）。**本批暴力最重的一部。**
5. **RT（S1）**：Tomatometer **92%**（74 則），Popcornmeter **91%**（2,500+）。Consensus：「Reacher captures the trademark bulk of its titular hero while trading away some of his definition, but fans of the novels will find plenty to love about this faithful adaptation.」來源：https://www.rottentomatoes.com/tv/reacher/s01 （read）。S4：92%（36 則）/ Popcorn **64%**（https://www.rottentomatoes.com/tv/reacher/s04 ，read）；候選檔另記 S3 98% / 75%。觀眾分數一季比一季低。
6. **推薦 tag**：
   - C：RT 2025 S3 98% / Popcorn 75%
   - D：Nielsen 2024 #10 original 10.57B min；Nielsen 2025 #5 original 15.64B min
   - E：Parrot GDA 2025 drama finalist
7. **前置作品**：不必先讀小說或看 Tom Cruise 主演的兩部電影（2012、2016），影集是重新改編。每季改編一本不同的小說，故事大致獨立，但角色關係（如 Neagley）有延續。來源：同欄位 2（read）。「不必先看」與「大致獨立」是編輯判斷。
8. **台灣串流**：Prime Video（訂閱，4 季）https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.41f71162-2344-4089-accf-5ce0e9c12535 — 原檔記 **B**（tw-availability-1；Prime zh_TW 頁只代表語言）。**重新查核**：Yahoo 奇摩〈【2026年8月美劇推薦】…動作爽劇《神隱任務4》〉寫「線上看平台：Prime Video」，海報註明「Prime Video提供」https://tw.news.yahoo.com/【2026年8月美劇推薦】netflix《百年孤寂：第2部》、hbo-max《綠光軍團》dc強檔、disney《青春碎片》、動作爽劇《神隱任務4》-080640920.html （Groundlane `web_extract` 讀到標題與「線上看平台：Prime Video」，read）→ **confirmed（news TW）**，與 `tw-availability-official.md` 對 Fallout 的標準相同。Amazon Original。沒有找到 Prime Video Taiwan 專屬的官方貼文。

## 7. The Beast in Me

1. **片名**：獸藏我心（Netflix Taiwan YouTube「《獸藏我心》 | 正式預告 | Netflix」，read）／*The Beast in Me*。tw-availability-2 原本只有搜尋摘要，這次確認。
2. **劇情**：喪子後陷入寫作瓶頸的作家 Aggie Wiggs（Claire Danes），開始動筆寫新搬來的鄰居、涉嫌殺妻的房地產小開 Nile Jarvis（Matthew Rhys）。來源：https://en.wikipedia.org/wiki/The_Beast_in_Me_(TV_series) （Premise 段落，read）
3. **季數與狀態**：1 季、8 集，2025-11-14 在 Netflix 上線（Wikipedia 寫 11-14；RT、台灣預告寫 11-13，時區差）。原本以迷你影集宣傳，**2026 年 9 月已續訂第 2 季**。來源：同上（read：「Although The Beast in Me was originally billed as a miniseries, it was renewed for a second season in September 2026.」）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt31974367/ ）。Sex & Nudity **Mild**（78/194）、Violence & Gore **Moderate**（26/85）、Profanity **Moderate**（23/77）、Alcohol, Drugs & Smoking **Mild**（31/63）、Frightening **Moderate**（34/68）。投稿特別提到：暴力不多，但出現時非常血腥（以雕像砸爛人臉、用槍托反覆毆打）；塑膠袋悶死的屍體；吸古柯鹼、酗酒。來源：https://www.imdb.com/title/tt31974367/parentalguide/ （read；這次沒有抓到 Certifications 區塊）
5. **RT（S1）**：Tomatometer **85%**（71 則），Popcornmeter **76%**（1,000+）。Consensus：「A cut above the usual murder mystery, The Beast in Me stages a psychological duel that crackles with tension thanks to Claire Danes and Matthew Rhys' superb performances.」來源：https://www.rottentomatoes.com/tv/the_beast_in_me/s01 （read）
6. **推薦 tag**：
   - A：Emmy Limited nom 2026；GG Limited nom 2026（Wikipedia：第 78 屆 Emmy 共 9 項提名，**Matthew Rhys 拿下限定影集男主角**）
   - C：RT 2025 85% / Popcorn 76%
   - D：Netflix H2 2025 #12（43.0M）
7. **前置作品**：沒有，是原創劇。主創班底（showrunner Howard Gordon）來自《反恐危機》，但劇情無關。Variety 指出故事明顯取材自 Robert Durst 與紀錄片《The Jinx》，不必先看。來源：Wikipedia（read）、Variety 評論（見 reviews 檔）。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81427733 ；JW：https://www.justwatch.com/tw/節目/the-beast-in-me — 原檔記 **僅 JustWatch**（tw-availability-2）。**重新查核**：Netflix Taiwan 官方 YouTube「《獸藏我心》 | 正式預告 | Netflix」，頻道 Netflix Taiwan，2025-10-16 上傳 https://www.youtube.com/watch?v=EA30_Rbj8ek （read）→ **confirmed（official channel）**。

## 8. Untamed

1. **片名**：荒境狂途（Netflix Taiwan YouTube「《荒境狂途》| 正式前導預告 | Netflix」，read）／*Untamed*
2. **劇情**：在優勝美地國家公園廣袤的荒野中，一名女子的死亡把一位聯邦探員捲進無法無天的地帶。（IMDb 官方簡介：「In the vast expanse of Yosemite National Park, a woman's death draws a federal agent into lawless terrain, where nature obeys no rules but its own.」，Wikipedia Premise 段落同句，read）主演 Eric Bana、Lily Santiago、Sam Neill。來源：https://en.wikipedia.org/wiki/Untamed_(TV_series) （read）
3. **季數與狀態**：1 季、6 集，2025-07-17 上線。原本以限定影集宣傳（RT 仍標 Limited Series），**2025-07-29 已續訂第 2 季**；2026 年 2 月公布第 2 季新卡司（Shea Whigham 等），上線日期未公布。來源：同上（續訂句引 Variety〈'Untamed' Renewed for Season 2 at Netflix〉，read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（67/156）、Violence & Gore **Moderate**（39/66）、Profanity **Moderate**（35/112）、Alcohol, Drugs & Smoking **Moderate**（45/63）、Frightening **Mild**（39/61）。投稿特別提到：只有男性背面裸露；郊狼攻擊造成的腿部撕裂傷特寫；開場女屍墜落到攀岩者身上。IMDb 列出的台灣分級是 15+。來源：https://www.imdb.com/title/tt31710822/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **83%**（64 則），Popcornmeter **70%**（500+）。Consensus：「Wrangled by Eric Bana's steady star power, Untamed's solid murder mystery is elevated by the visually sumptuous backdrop of its Yosemite National Park milieu.」來源：https://www.rottentomatoes.com/tv/untamed/s01 （read；`/tv/untamed_2025/` 是 404，正確 slug 是 `untamed`）
6. **推薦 tag**：
   - B：Variety2025（Aramide Tinubu #8）
   - C：RT 2025 83% / Popcorn 70%
   - D：Netflix H2 2025 #3（92.8M）
7. **前置作品**：沒有，是原創劇。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81575641 ；JW：https://www.justwatch.com/tw/節目/huang-jing-kuang-tu — 原檔記 **JustWatch only**（tw-availability-3 已註「譯名有 Netflix Taiwan 官方 YouTube 預告佐證」但沒附網址）。**重新查核**：Netflix Taiwan 官方 YouTube「《荒境狂途》| 正式前導預告 | Netflix」，頻道 Netflix Taiwan，2025-06-16 上傳 https://www.youtube.com/watch?v=sod-EttdSLw （read）→ **confirmed（official channel）**。

## 9. All Her Fault

1. **片名**：都是她的錯（HBO Max TW）／*All Her Fault*
2. **劇情**：芝加哥的財富經理 Marissa Irvine（Sarah Snook）去接 5 歲兒子 Milo 結束玩伴聚會時，應門的女人說從沒見過她和她兒子，孩子就此失蹤。改編自 Andrea Mara 2021 年同名小說。來源：https://en.wikipedia.org/wiki/All_Her_Fault （導言與 Plot 段落，read）
3. **季數與狀態**：**迷你影集**，8 集，2025-11-06 在 Peacock 上線，**已完結**（Wikipedia 沒有續訂記載）。來源：同上（`num_episodes=8`，read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **None**（59/68）、Violence & Gore **Mild**（27/43）、Profanity **Moderate**（17/51）、Alcohol, Drugs & Smoking **Mild**（25/38）、Frightening **Mild**（22/35）。投稿特別提到：只有親吻；暴力場面不多血；髒話隨集數增加；「suspenseful with intense child abuse themes」。使用者建議分級：「Rated R for strong language and brief violence.」IMDb Certifications 沒有列台灣。來源：https://www.imdb.com/title/tt31314751/parentalguide/ （read）。**本批性與暴力最輕的一部**，主要是兒童失蹤的心理壓力。
5. **RT**：Tomatometer **80%**（45 則），Popcornmeter **74%**（500+）。Consensus：「A twisty thriller that underscores the societal pressures placed on working mothers, All Her Fault is an addicting watch thanks largely to Sarah Snook and Dakota Fanning's emotionally grounded performances.」來源：https://www.rottentomatoes.com/tv/all_her_fault/s01 （read）
6. **推薦 tag**：
   - A：Emmy Limited nom 2026；GG Limited nom 2026（Wikipedia：金球獎提名最佳限定影集與 Snook 女主角）
   - F：PTT 2026 推薦串 ×2（「2025 最強」）
7. **前置作品**：沒有。原著小說不必先讀。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/00f592d4-b8fc-41db-9ac2-6c55fda37cc6 — **confirmed on service page**（tw-availability-3）。美國是 Peacock 原創，台灣在 HBO Max；JW TW slug 沒找到。

## 10. The Hunting Wives

1. **片名**：獵豔嬌妻（台灣媒體與 PTT 用法，見欄位 8）／*The Hunting Wives*。VoiceTube 有一處寫「獵豔人妻」，不採用。**沒有找到 Netflix Taiwan 官方頻道的預告**，譯名證據等級是台灣媒體／論壇。
2. **劇情**：Sophie 隨丈夫從麻州搬到東德州小鎮 Maple Brook，被社交名媛 Margo 和她的小圈子「Hunting Wives」吸引，捲入執迷、祕密與謀殺；一名少女 Abby 陳屍在這群女人聚會的林地。改編自 May Cobb 同名小說。來源：https://en.wikipedia.org/wiki/The_Hunting_Wives （Premise 段落，read）
3. **季數與狀態**：1 季、8 集，2025-07-21 在美國 Netflix 上線（原為 Starz 訂製、Lionsgate 製作，後由 Netflix 取得）。**第 2 季訂於 2026-11-26 上線**；2026 年 10 月已在第 2 季播出前**續訂第 3 季**。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Severe**（253/488）、Violence & Gore **Moderate**（55/116）、Profanity **Moderate**（45/93）、Alcohol, Drugs & Smoking **Moderate**（52/107）、Frightening **Mild**（45/90）。投稿特別提到：貫穿全劇的露骨男女、女女性愛與女性胸部裸露；被豬啃食的女屍；舉槍自盡；吸食 Xanax、酒駕。IMDb Certifications 沒有列台灣。來源：https://www.imdb.com/title/tt31038430/parentalguide/ （read）。**本批性內容最重的一部**；NPR 評論也說「probably as explicit as anything Netflix has put out there」（Exa highlight，snippet）。
5. **RT（S1）**：Tomatometer **81%**（32 則），Popcornmeter **65%**（250+）。Consensus：「Brittany Snow and Malin Akerman are diabolically fun to watch in The Hunting Wives, a risqué soap that turns bad behavior into highly bingeable fun.」來源：https://www.rottentomatoes.com/tv/the_hunting_wives/s01 （read）
6. **推薦 tag**：
   - B：Vulture2025（Roxana Hadadi #7、Kathryn VanArendonk #10）
   - D：Netflix H2 2025 #22（31.3M）
7. **前置作品**：沒有。原著小說不必先讀。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/82013700 — 原檔記 **search snippet only**（tw-availability-3：Yahoo 奇摩 11 月 Netflix 片單「11月26日《獵豔嬌妻》第二季」、ELLE TW、PTT EAseries）。**重新查核**：沒有找到 Netflix Taiwan YouTube 或 Netflix 台灣新聞稿。新增的佐證都是台灣使用者端：PTT EAseries 心得文（2025-10-13）寫「終於能在海外Netflix看到…Netflix將中譯名最終定為獵豔嬌妻」（https://www.ptt.cc/bbs/EAseries/M.1760362331.A.55D.html ，snippet）；Threads 用戶貼文「台灣區Netflix上The Hunting Wives了」（snippet）；台灣部落格「Netflix追劇筆記本」寫 2025-10-10「全球同步上線」（snippet）。ELLE TW 懸疑劇片單也列入（snippet）。→ **likely**。推論：美國 2025-07 上線，台灣等海外地區約 2025-10 才上架。建議文章寫「Netflix（台灣 2025 年 10 月起上架）」前，用台灣帳號確認一次。

## 11. High Potential

1. **片名**：潛能探案組（Disney+ TW 頁標題「觀看潛能探案組 | Disney+」，read）／*High Potential*
2. **劇情**：Kaitlin Olson 飾演智商過人的單親媽媽 Morgan Gillory，原本在洛杉磯警局當清潔工，因為破解一宗懸案而成為警方顧問。改編自 2021 年法國–比利時影集《HPI》。來源：https://en.wikipedia.org/wiki/High_Potential （read）
3. **季數與狀態**：2 季、31 集（S1 2024-09-17 起，ABC；S2 2025-09-16 首播）。**2026-03-05 已續訂第 3 季**，換由 Nora 與 Lilla Zuckerman 擔任 showrunner；另有一集特別篇訂於 2027-02-14（超級盃後）播出。第 1 季 13 集。來源：同上（infobox、`episodes1=13`，read）
4. **分級**：美國 **TV-14**（RT 頁：TV-14 (V|L)）。Sex & Nudity **None**（36/70）、Violence & Gore **Mild**（20/36）、Profanity **Mild**（10/19）、Alcohol, Drugs & Smoking **Mild**（14/22）、Frightening **Moderate**（12/20）。投稿特別提到：每集都有屍體與少量血跡，有一集冰錐穿頭；人質與綁架（包括兒童）。使用者建議分級 PG-13。IMDb 列出的台灣分級是 12+（self-applied）。來源：https://www.imdb.com/title/tt22091076/parentalguide/ （read）。**本批唯一非 TV-MA 的劇**，是單元破案的電視網劇。
5. **RT（S1）**：Tomatometer **96%**（25 則），Popcornmeter **81%**（500+）。Consensus：「With the ineffable Kaitlin Olson on hand to inject some spiky personality into a familiar formula, High Potential is a solid procedural with plenty of upside.」來源：https://www.rottentomatoes.com/tv/high_potential/s01 （read）。S2：100%（只有 7 則）/ 74%（https://www.rottentomatoes.com/tv/high_potential/s02 ，read）。
6. **推薦 tag**：
   - C：RT 2025 S1 96% / Popcorn 81%
   - F：PTT D+ 推薦串 ×2
7. **前置作品**：改編自法國劇《HPI》，不必先看。來源：同欄位 2（read）。
8. **台灣串流**：Disney+（訂閱，2 季）https://www.disneyplus.com/zh-tw/browse/entity-d58ab636-473f-4276-b421-d27825b42fce — 原檔記 **B**（tw-availability-1）。**重新查核**：Groundlane `web_extract` 讀到頁面標題「觀看潛能探案組 | Disney+」、台灣式分級 12+、「2 季」（read）→ 依 `tw-availability-official.md` 的 Disney+ 標準升為 **confirmed（official service page）**。ABC 是 Disney 旗下，授權風險低。

## 12. Mr. & Mrs. Smith

1. **片名**：史密斯任務（LINE TODAY／DramaQueen 電視迷、電影神搜等台灣媒體；Prime Video 頁標題亦同）／*Mr. & Mrs. Smith*。JW 顯示的「史密斯夫妇」是中國譯名。與 2005 年電影同名，台灣片名也相同。
2. **劇情**：Donald Glover 與 Maya Erskine 飾演兩個素不相識的人，被一家神祕間諜機構配對，以「John 與 Jane Smith」的假名假扮成夫妻執行任務。靈感來自 2005 年同名電影，但不是同一對已婚殺手的故事。來源：https://en.wikipedia.org/wiki/Mr._%26_Mrs._Smith_(2024_TV_series) （read）
3. **季數與狀態**：1 季、8 集，2024-02-02 在 Prime Video 上線。**2024-05-14 已續訂第 2 季**，改由 Anna Ouyang Moench 擔任 showrunner、換一批主角（Glover 改為執導多集）；2025 年 9 月因卡司問題延後製作，2026 年仍在陸續選角，**截至 2026-11-05 沒有上線日期**。屬選集劇（anthology）。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（60/157）、Violence & Gore **Moderate**（32/53）、Profanity **Moderate**（22/54）、Alcohol, Drugs & Smoking **Mild**（26/43）、Frightening **Moderate**（30/47）。投稿特別提到：幾場不露點的性愛；第 2 集有要求兩人學狗爬的戀物場景；槍戰、爆炸、在浴缸折斷屍體四肢（只聞其聲）。IMDb 列出的台灣分級是 15+。來源：https://www.imdb.com/title/tt14044212/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **90%**（124 則），Popcornmeter **66%**（1,000+）。Consensus：「Building on the basic premise of its source material, Mr. & Mrs. Smith anchors its spy hijinks in a relationship drama fueled by the chemistry between its charming leads.」來源：https://www.rottentomatoes.com/tv/mr_and_mrs_smith_2024/s01 （read）。注意：`/tv/mr_and_mrs_smith/` 是 2007 年的另一部劇（13%），不要用錯。
6. **推薦 tag**：
   - A：Emmy Drama nom 2024；GG Drama nom 2025（Wikipedia：S1 共 16 項 Emmy 提名）
   - B：THR2024（Fienberg honorable mention）；CT10-2024 agg #7
   - C：RT 2024 S1 90% / Popcorn 66%
7. **前置作品**：**不必先看 2005 年電影**。影集只借用「假扮夫妻的間諜」這個前提，人物與劇情都是新的。Wikipedia：「inspired by the 2005 film… although instead of following a married couple of competing spies like the film…」。來源：同欄位 2（read）
8. **台灣串流**：Prime Video（訂閱，含在 Prime）https://www.primevideo.com/detail/0PIZV55NTVMF63RT9SF6CE1TN3?language=zh_TW ；JW：https://www.justwatch.com/tw/節目/mr-and-mrs-smith — 原檔記 **JustWatch only**（tw-availability-3）。**重新查核**：LINE TODAY 轉載 DramaQueen 電視迷〈唐納葛洛佛重現經典之作！《史密斯任務》美劇版公開正式預告〉（2024-01-12）寫「影集共八集，將於 2 月 2 日在 Amazon Prime Video 上線」https://today.line.me/tw/v3/article/oqr5PvN （read）；電影神搜龍貓大王通信〈【開箱】《史密斯任務》線上影集版〉（2024-02-07）寫「目前可在 Amazon 的 Prime Video 線上收看」https://news.agentm.tw/273482 （read）→ **confirmed（news TW）**，標準同 Fallout。兩篇都沒有明說「台灣」，但都是台灣媒體、用台灣譯名；Amazon Original 在 Prime Video 全球上架，下架風險低。

---

## 結果摘要

- 12 部的欄位 2、3、4、5、7 都有讀到的來源（read）。分級 12/12 讀到 Parents Guide（Reacher、Beast 的美國分級改看 IMDb 標題頁）。RT S1 12/12 讀到，另讀了 6 部的最新季。
- 欄位 8 台灣串流：
  - **confirmed 11 部**：Homeland（Disney+，由 B 升級）、The Diplomat（Netflix，由 JW only 升級）、Zero Day（Netflix，由 C 升級）、Paradise（Disney+）、The Night Agent（Netflix，由 JW only 升級）、Reacher（Prime Video，由 B 升級，台灣新聞）、The Beast in Me（Netflix，由僅 JW 升級）、Untamed（Netflix，由 JW only 升級）、All Her Fault（HBO Max）、High Potential（Disney+，由 B 升級）、Mr. & Mrs. Smith（Prime Video，由 JW only 升級，台灣新聞）。
  - 其中 Netflix 5 部用 Netflix Taiwan 官方 YouTube 證明；Disney+ 3 部（Homeland、High Potential 用 zh-tw 服務頁；Paradise 用 Disney Plus TW YouTube）；Prime Video 2 部用台灣新聞（等級比官方頻道低一階）；HBO Max 1 部用服務頁。
  - **likely 1 部**：The Hunting Wives（Netflix），只有台灣論壇與社群摘要。
  - **不列為管道**：Homeland 的 Netflix（沒有台灣官方證據）。

## 無法查證或尚待確認的事實

1. **The Hunting Wives 的台灣上架**：沒有 Netflix Taiwan YouTube 或新聞稿，只有 PTT、Threads、部落格（snippet）。台灣上架日（約 2025-10-10）也只來自部落格。建議用台灣帳號確認。
2. **Homeland 是否也在 Netflix 台灣**：JW 列 Netflix 8 季，但沒有官方證據，這次沒有升級。
3. **Prime Video 兩部（Reacher、Mr. & Mrs. Smith）**的證據是台灣新聞，不是 Prime Video Taiwan 官方貼文。標準與 `tw-availability-official.md` 的 Fallout 一致。
4. **Disney+ zh-tw 頁的效力**：Homeland、High Potential 依 `tw-availability-official.md` 的標準算 confirmed；post1 已標出 batch 1 曾把同類頁面算 B，標準要由人統一。
5. **台灣分級**：IMDb 列出 Diplomat 16+、Night Agent 16+、Zero Day／Paradise／Untamed／MMS 15+、High Potential 12+（self-applied）；Disney+ TW 頁另外顯示 Homeland 15+、High Potential 12+。Reacher、Beast、AHF、Hunting Wives、Homeland 的 IMDb 頁沒有台灣分級。這些都不是台灣官方分級資料庫。
6. **Untamed 第 2 季、Mr. & Mrs. Smith 第 2 季、The Beast in Me 第 2 季、High Potential 第 3 季**的上線日期都還沒公布（Wikipedia 截至查核日）。
7. **The Beast in Me 上線日**：Wikipedia 寫 2025-11-14，RT 與 Netflix Taiwan 預告的時間點對應 11-13（美國時間）。寫文用「2025 年 11 月」即可。
8. **Parents Guide 是使用者投稿**。The Hunting Wives、Reacher 的投稿用詞很露骨，文章引用時建議只用嚴重度詞。

## 工具降級紀錄（toolDegradation）

- 容器內 `curl` 連 Wikipedia／RT／Metacritic 都被 proxy 拒絕（connect_rejected）→ 全部改走 Groundlane。
- Wikipedia：`Zero_Day_(miniseries)`、`Paradise_(American_TV_series)` 是錯的標題（前者不存在、後者導向 1988 年劇）→ 用 MediaWiki API 批次解析正確標題（`Zero Day (American TV series)`、`Paradise (2025 TV series)`、`The Beast in Me (TV series)`、`Untamed (TV series)`）。
- IMDb Parents Guide：Exa `web_fetch_exa` 只回頁面標題（內容空）→ Jina `read_url`（無 API key 模式，回全文）。
- RT：`/tv/untamed_2025/s01` 導回首頁 → 正確 slug `untamed`；`/tv/mr_and_mrs_smith/s01` 是 2007 年劇 → 正確 slug `mr_and_mrs_smith_2024`。
- Groundlane `web_search` 的 Exa 後端有時回「exa unavailable」，自動只用 tavily／brave。
- 沒有用到 Firecrawl、cloudflare `get_url_markdown`。
