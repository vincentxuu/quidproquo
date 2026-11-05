# Post 1 事實表：美劇｜奇幻、科幻、恐怖與超級英雄（19 部）

- 查核日：2026-11-05。順序照 `post1-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**snippet** 表示只看到搜尋摘要或 highlight，不能當成讀過。
- 欄位 6（推薦 tag）直接取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），每類只留 2–4 個最有資訊量的。已刪掉：TEEPR×HBO Max 業配（#HBOMaxPartner）和所有反面意見（例如「長期很悶」「S2 不如 S1」「太慢」「第 3 季起都是套路」）。
- 欄位 8（台灣串流）照抄 `tw-availability-1/2/3.md`。三份檔案的證據等級寫法不一樣：batch 1 用 A/B/C/D，batch 2 寫「已在服務商頁面確認／僅 JustWatch」，batch 3 寫英文。**另外，三份檔案對 Disney+ 頁面的判定標準不一致**：batch 1 把 Disney+ zh-tw 頁算 B（地區未證），batch 2/3 把同類頁面算「已確認」。這裡照抄原等級，同時在備註標出來。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、季數、狀態、S1 集數、前置作品 | 英文 Wikipedia 條目的 wikitext（`action=raw`），抽 infobox 的 `num_seasons` / `num_episodes` / `last_aired`、Series overview 的 `episodes1`，加上導言段落 | Groundlane `web_extract`（pattern） | read |
| 分級細項 | IMDb Parents Guide `https://www.imdb.com/title/<id>/parentalguide/` | Groundlane 被 AWS WAF 擋（202 空頁）→ Tavily extract（advanced）讀 4 頁，之後 Tavily 回 429 → Jina `read_url` 讀其餘 15 頁；Exa `web_fetch_exa` 補讀 6 頁的 Content rating 摘要 | read |
| 美國分級（標題列） | IMDb 標題頁 `https://www.imdb.com/title/<id>/` | Exa `web_fetch_exa` | read（只限 GoT、ST、Pluribus、Fallout、Boys、Wednesday 這 6 部，它們在 Parents Guide 讀取時沒有抓到 Certifications 區塊） |
| IMDb ID | Wikidata API `wbgetentities`（P345） | Groundlane `web_extract` | read |
| Tomatometer / Popcornmeter / Critics Consensus | RT 季頁 `https://www.rottentomatoes.com/tv/<slug>/s01`，選取 `#critics-consensus p`，以及 `slot="critics-score"` / `slot="audience-score"` / `slot="critics-reviews"` | Groundlane `web_extract`、`web_fetch`（`#main-page-content`） | read（19/19） |
| 台灣管道重新查核 | 服務頁 | Groundlane `web_extract`；Tavily search | 見各劇欄位 8 |

嚴重度用 IMDb 的原文詞（None / Mild / Moderate / Severe），括號內是頁面顯示的「X of Y found this …」票數。**Parents Guide 的內容是使用者投稿與投票**，不是官方分級。每部劇有 5 個類別：性與裸露、暴力與血腥、髒話、菸酒與藥物、驚嚇與緊張場面。

---

## 1. Game of Thrones

1. **片名**：權力遊戲（HBO Max TW）／*Game of Thrones*。GQ TW 寫作「冰與火之歌：權力遊戲」。
2. **劇情**：根據 George R. R. Martin 的《冰與火之歌》改編，主線是維斯特洛各大貴族家族爭奪鐵王座、流亡的坦格利安後裔計畫奪回王位，以及守夜人在北方邊境抵禦威脅。來源：https://en.wikipedia.org/wiki/Game_of_Thrones （read）
3. **季數與狀態**：8 季、73 集，2011-04-17 到 2019-05-19，**已完結**。第 1 季 10 集。來源：同上（infobox `num_seasons=8`、`num_episodes=73`）；S1 集數：https://en.wikipedia.org/wiki/Game_of_Thrones_season_1 （read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt0944947/ ）。Parents Guide：Sex & Nudity **Severe**（10598/12050）、Violence & Gore **Severe**（5196/5675）、Profanity **Severe**（4361/5221）、Alcohol, Drugs & Smoking **Moderate**（2211/5869）、Frightening & Intense **Severe**（3986/4860）。投稿特別提到：大量全裸與性愛場面、針對女性的性暴力（包括被描繪為未成年的角色）、亂倫、斬首、酷刑；有人說第 3 季最殘酷。來源：https://www.imdb.com/title/tt0944947/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **90%**（215 則影評），Popcornmeter **96%**（5,000+ 則評分）。Critics Consensus：「Its intricate storytelling and dark themes may overwhelm some viewers, but *Game of Thrones* is a transportive, well-acted, smartly written drama even non-genre fans can appreciate.」來源：https://www.rottentomatoes.com/tv/game_of_thrones/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama win 2016、2018、2019（Wikipedia 導言另寫 2015 年也得獎，總共 59 座 Emmy）
   - B：BBC2021 #5；NYT2026 #6
   - C：IMDb 9.2（#13）
   - E：GWR2026 most in-demand TV show overall 89.0x
   - F：PTT 2026 推薦串 ×4；PTT GOAT 串「奇幻類」(2023)
   - G：HBO Max TW 首頁熱門經典 (snippet)；GQ TW 10 部馬拉松影集
7. **前置作品**：沒有，這部是整個系列的起點。Wikipedia：「the first in what would become the *Game of Thrones* franchise」，前傳是《龍族前傳》（2022）和《七王國的騎士》（2026）。來源：同欄位 2（read）
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/4f6b4985-2dc9-4ab6-ac79-d60f0860b0ac ；JW：https://www.justwatch.com/tw/節目/bing-yu-huo-zhi-ge-quan-li-you-xi — **confirmed on service page**（tw-availability-3）

## 2. Peacemaker

1. **片名**：和平使者（HBO Max TW）／*Peacemaker*
2. **劇情**：James Gunn 為 HBO Max 打造的 DC 超級英雄劇，延續電影《自殺突擊隊：集結》裡那位滿腦子「為和平不惜殺人」的反英雄 Chris Smith／和平使者（John Cena 飾）。來源：https://en.wikipedia.org/wiki/Peacemaker_(TV_series) （read）
3. **季數與狀態**：2 季、16 集，2022-01-13 到 2025-10-09，**已完結**。第 2 季官方稱為「second and final season」，Gunn 也表示沒有第 3 季的計畫。第 1 季 8 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Severe**（688/1095）、Violence & Gore **Severe**（381/451）、Profanity **Severe**（399/455）、Alcohol, Drugs & Smoking **Moderate**（192/501）、Frightening **Severe**（241/412）。投稿特別提到：S2E1 有男女全裸的雜交場面；血腥爆頭；酷刑；S1E2 出現 92 次 f-word；使用古柯鹼與大麻。使用者建議比照電影分級：「Rated R for strong bloody violence, language throughout, strong sexual content, some graphic nudity and drug use.」IMDb 列出的台灣分級是 15+／18+（self-applied）。來源：https://www.imdb.com/title/tt13146488/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **93%**（91 則），Popcornmeter **87%**（2,500+）。Consensus：「John Cena's still in solid form in *Peacemaker*, leading a bloody good time that gives writer-director James Gunn full permission to let his freak flag fly.」來源：https://www.rottentomatoes.com/tv/peacemaker_2022/s01 （read）。注意：`/tv/peacemaker` 是另一部芬蘭劇，不要用錯。
6. **推薦 tag**：
   - A/B：無。awards 檔明寫 Peacemaker 不在任何評審獎或榜單裡。Wikipedia 只提到 Creative Arts Emmy 提名。
   - C：RT 2025 S2 94% / Popcorn 79%
   - E：Parrot GDA 2025 superhero finalist（輸給 Invincible）
   - F：PTT 2026 推薦串 ×2；PTT GOAT 串推文 (2023)；RedRecs #8 (S2)
   - G：Yahoo TW 2025-08 美劇推薦 TOP10（上檔預告性質）
7. **前置作品**：**建議先看電影 *The Suicide Squad*（2021）**。第 1 季是這部電影的衍生作。第 2 季併入新的 DCU，劇情接在電影 *Superman*（2025）之後。Wikipedia：「The first season is a spin-off of the film *The Suicide Squad* (2021)… [season 2] taking place after the events of the film *Superman* (2025).」來源：同欄位 2（read）
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/a939d96b-7ffb-4481-96f6-472838d104ca ；JW：https://www.justwatch.com/tw/節目/peacemaker — **confirmed on service page**。JW 另外列的 LINE TV 連結是錯的資料，不列為管道（tw-availability-3）。

## 3. House of the Dragon

1. **片名**：龍族前傳（HBO Max TW）／*House of the Dragon*
2. **劇情**：《權力遊戲》前傳，時間大約在《權力遊戲》之前 200 年，講坦格利安家族由盛轉衰，以及王位繼承戰爭「血龍狂舞」。來源：https://en.wikipedia.org/wiki/House_of_the_Dragon （read）
3. **季數與狀態**：已播 3 季、26 集。第 3 季 2026-06-21 首播，共 8 集。**第 4 季（最終季）開發中**，預計 2028 年播出。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Severe**（1642/2428）、Violence & Gore **Severe**（859/1012）、Profanity **Severe**（528/843）、Alcohol **Mild**（505/899）、Frightening **Severe**（581/842）。投稿特別提到：亂倫、性派對與全裸；剖腹取子的血腥生產場面；多次流產；龍焰燒死士兵；斬首與斷肢。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt11198330/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **90%**（873 則），Popcornmeter **82%**（10,000+）。Consensus：「Covering an era of tenuous peace with ferocious -- albeit abbreviated -- focus, House of the Dragon is an impressive prequel that exemplifies the court intrigue that distinguished its predecessor.」來源：https://www.rottentomatoes.com/tv/house_of_the_dragon/s01 （read）
6. **推薦 tag**：
   - A：GG Drama win 2023；Emmy Drama nom 2023
   - C：RT 2024 S2 84% / Popcorn 71%
   - E：Parrot GDA 2024 World's Choice + Drama
   - F：PTT 2026 推薦串
   - G：HBO Max TW 首頁橫幅 (snippet)
7. **前置作品**：《權力遊戲》的前傳。故事發生在 GoT 之前，**技術上不必先看 GoT**，但看過比較容易理解維斯特洛和坦格利安家族的背景。Wikipedia：「A prequel to *Game of Thrones* (2011–2019)」。來源：同欄位 2（read）。「不必先看」是編輯判斷，不是來源原文。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/c68e69d7-9317-428a-a615-cdf8fe5a2e06 ；JW：https://www.justwatch.com/tw/節目/house-of-the-dragon — **已在服務商頁面確認**（HBO TW 頁顯示 3 季；tw-availability-2）

## 4. A Knight of the Seven Kingdoms

1. **片名**：七王國的騎士（HBO Max TW）／*A Knight of the Seven Kingdoms*
2. **劇情**：改編自 Martin 的《Dunk 與 Egg》中篇小說系列，從《雇傭騎士》開始，講雇傭騎士「高個子」鄧肯爵士和他的侍從伊蒙「蛋」坦格利安的冒險。來源：https://en.wikipedia.org/wiki/A_Knight_of_the_Seven_Kingdoms_(TV_series) （read）
3. **季數與狀態**：1 季、6 集，2026-01-18 在 HBO 首播。2025 年 11 月**已續訂第 2 季**（改編《誓言騎士》），預計 2027 年播出。第 1 季 6 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Moderate**（232/726）、Violence & Gore **Severe**（184/296）、Profanity **Moderate**（103/254）、Alcohol **Mild**（136/207）、Frightening **Moderate**（70/217）。投稿特別提到：男性正面全裸（包括小便）、短暫女性胸部裸露；第 5 集的暴力「near GOT level」（馬被長槍刺穿、木刺穿眼）；整體「Carries a much lighter tone compared to other shows from the same universe」。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt27497448/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **94%**（180 則），Popcornmeter **79%**（2,500+）。Consensus：「A Knight of the Seven Kingdoms is a welcome return to Westeros that works better in the buddy-comedy arena rather than solely slaying its competition.」來源：https://www.rottentomatoes.com/tv/a_knight_of_the_seven_kingdoms/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2026（Wikipedia：第 78 屆共 9 項提名）
   - C：IMDb 8.6（#161）
   - F：PTT 2026 推薦串 ×2
   - G：ELLE/Cosmo TW (desc/snippet)
7. **前置作品**：《權力遊戲》前傳，時間大約在 GoT 之前一百年（RT 簡介：「A century before the events of "Game of Thrones"」）。**不必先看**，故事是獨立的。Wikipedia：「A prequel to *Game of Thrones*」。來源：欄位 2 與欄位 5 的 URL（read）
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/3507a932-eace-46ea-bfe1-638ae819fa12 ；JW：https://www.justwatch.com/tw/節目/a-knight-of-the-seven-kingdoms-the-hedge-knight — **已在服務商頁面確認**（1 季；tw-availability-2）

## 5. Stranger Things

1. **片名**：怪奇物語（Netflix 頁標題「Watch 怪奇物語 | Netflix Official Site」，見 tw-availability-1）／*Stranger Things*
2. **劇情**：1980 年代印第安納州霍金斯鎮，一名有念力的女孩「Eleven」意外在政府祕密研究所打開了通往「顛倒世界」的蟲洞，鎮上居民和一群孩子被捲進超自然危機。來源：https://en.wikipedia.org/wiki/Stranger_Things （read）
3. **季數與狀態**：5 季、42 集，2016-07-15 到 2025-12-31（第 5 季分三部分上線），**已完結**。第 1 季 8 集。來源：同上；S1：https://en.wikipedia.org/wiki/Stranger_Things_season_1 （read）
4. **分級**：IMDb 標題頁顯示 **TV-MA**（read：https://www.imdb.com/title/tt4574334/ ）。Parents Guide 有投稿說各季不同（「Season 1/2/3 - Rated PG-13/R … Season 4/5 - Rated R」），這是使用者建議分級，不是官方分級。Sex & Nudity **Mild**（2308/3856）、Violence & Gore **Severe**（1740/3159）、Profanity **Moderate**（1581/2712）、Alcohol, Drugs & Smoking **Mild**（1530/2318）、Frightening **Severe**（1540/2759）。投稿特別提到：怪物吃人、身體融化、孩子被拿來做實驗、短暫看到受實驗兒童的屍體；使用菸、酒、大麻。來源：https://www.imdb.com/title/tt4574334/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **97%**（92 則），Popcornmeter **96%**（10,000+）。Consensus：「Exciting, heartbreaking, and sometimes scary, *Stranger Things* acts as an addictive homage to Spielberg films and vintage 1980s television.」來源：https://www.rottentomatoes.com/tv/stranger_things/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2017、2018、2020、2022；GG Drama nom 2017、2018
   - B：BBC2021 #68；NYT2026 #53
   - C：IMDb 8.6（#184）；RT 2025 S5 83% / Popcorn 52%
   - D：Nielsen 2025 #1 streaming original 39.54B min；Netflix all-time English #3 (S4 140.7M) & #4 (S5 133.8M)；Nielsen H1 2026 #1 overall 23.26B min
   - E：Parrot GDA 2025 World's Choice + Drama + Horror；GWR2026 most in-demand sci-fi drama 53.8x
   - F：PTT 2026 推薦串 ×7；PTT 2025 年度最佳串
   - G：Netflix TW Top10 2025-11-24～30 #1 (ST5)；GQ TW 10 部馬拉松影集
7. **前置作品**：沒有，是原創劇。另有動畫衍生劇 *Tales from '85*（2026）和舞台劇前傳，都不必先看。來源：同欄位 2（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/80057281 ；JW：https://www.justwatch.com/tw/節目/stranger-things — **B（JustWatch TW + 服務 zh-TW 頁，地區未證）**（tw-availability-1）。**重新查核**：Groundlane `web_extract` 讀這一頁回 `OUTPUT_LIMIT`。Firecrawl（TW location）沒有額度。等級維持 B。另外，fans 檔有 Netflix Tudum 台灣 Top 10 的讀取紀錄（ST5 在 2025-11-24～30 週拿 #1，https://www.netflix.com/tudum/top10/taiwan/tv ），這是 Netflix 官方的台灣榜單，**間接**證明這部劇在台灣有上架。

## 6. The Last of Us

1. **片名**：最後生還者（HBO Max TW）／*The Last of Us*
2. **劇情**：改編自 Naughty Dog 的同名遊戲，背景是真菌感染讓社會崩潰數十年後，走私客 Joel（Pedro Pascal）護送少女 Ellie（Bella Ramsey）橫越美國。來源：https://en.wikipedia.org/wiki/The_Last_of_Us_(TV_series) （read）
3. **季數與狀態**：2 季、16 集（2023-01-15 起；第 2 季 2025-04-13 首播）。**第 3 季拍攝中**，預計 2027 年播出。第 1 季 9 集。來源：同上（read）
4. **分級**：美國 **TV-MA LV**。Sex & Nudity **Mild**（1032/2735）、Violence & Gore **Severe**（930/1134）、Profanity **Severe**（825/1146）、Alcohol **Mild**（702/1011）、Frightening **Severe**（838/1049）。投稿特別提到：感染者咬人、被感染的孩子遭處決；有非性意味的男性正面全裸；感染者的外型可能嚇到敏感觀眾。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt3581920/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **96%**（489 則），Popcornmeter **86%**（10,000+）。Consensus：「Retaining the most addictive aspects of its beloved source material while digging deeper into the story, *The Last of Us* is bingeworthy TV that ranks among the all-time greatest video game adaptations.」來源：https://www.rottentomatoes.com/tv/the_last_of_us/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2023、2025；GG Drama nom 2024（Wikipedia：已拿 9 座 Emmy）
   - C：RT 2025 S2 92% / Popcorn 37%（觀眾分數兩極，引用時要小心）
   - E：Parrot GDA 2023 most in-demand drama；Parrot GDA 2025 World's Choice/Drama/Horror finalist
   - G：HBO Max TW 首頁「創新話題劇集」(snippet)；風傳媒/IMDb 2025 #2 (snippet)
7. **前置作品**：不必先玩遊戲。第 1 季改編 2013 年的第一代遊戲，第 2 季改編 *Part II* 的前半段。來源：同欄位 2（read）。「不必先玩」是編輯判斷。
8. **台灣串流**：HBO Max（訂閱，2 季）https://www.hbomax.com/tw/zh/show/93ba22b1-833e-47ba-ae94-8ee7b9eefa9a — **A（confirmed on service page）**（tw-availability-1）

## 7. Severance

1. **片名**：人生切割術（Apple TV TW）／*Severance*
2. **劇情**：Lumon 公司的員工接受「切割」手術，工作和私生活的記憶完全分開，變成只活在辦公室裡的「innie」和對工作一無所知的「outie」兩個身分。來源：https://en.wikipedia.org/wiki/Severance_(TV_series) （read）
3. **季數與狀態**：2 季、19 集（S1 2022-02-18～04-08；S2 2025-01-17～03-21）。**已續訂第 3 季**（Apple 2025-03-21 新聞稿）。第 1 季 9 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（self-applied）。Sex & Nudity **Mild**（355/800）、Violence & Gore **Mild**（187/389）、Profanity **Moderate**（179/408）、Alcohol **Mild**（224/308，包括吸乙醚）、Frightening **Moderate**（161/307）。投稿特別提到：幾場腦部手術畫面；把意識一分為二的設定本身就可能讓人不安。使用者建議分級：「Rated R for language throughout, some violence including bloody images, and brief sexual content.」IMDb 列出的台灣分級是 PG-15。來源：https://www.imdb.com/title/tt11280740/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **97%**（118 則），Popcornmeter **86%**（2,500+）。Consensus：「Audacious, mysterious, and bringing fresh insight into the perils of corporate drudgery, *Severance* is the complete package.」來源：https://www.rottentomatoes.com/tv/severance/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2022、2025；GG Drama nom 2023、2026（Wikipedia：41 項 Emmy 提名，Britt Lower、Tramell Tillman 得獎）
   - B：NYT2026 #30；CT10-2025 agg #6
   - C：IMDb 8.6（#128）
   - F：RedRecs #4；Reddit 2025 survey 61.3% (snippet)；PTT 2026 推薦串
   - G：ELLE TW 2025 #6；風傳媒/IMDb 2025 #3 (snippet)
7. **前置作品**：沒有，是原創劇。
8. **台灣串流**：Apple TV（訂閱，原 Apple TV+）https://tv.apple.com/tw/show/人生切割術/umc.cmc.1srk2goyh2q2zdxcx605w8vtx ；JW：https://www.justwatch.com/tw/節目/severance — **confirmed on service page**（tw-availability-3）

## 8. Pluribus

1. **片名**：萬中選一（Apple TV TW 頁「觀看《萬中選一》」）／*Pluribus*
2. **劇情**：Vince Gilligan 為 Apple TV 打造的科幻劇。外星病毒把全人類變成平和、滿足的集體意識，小說家 Carol Sturka（Rhea Seehorn）是少數免疫的人，而這個集體意識想把她也同化。來源：https://en.wikipedia.org/wiki/Pluribus_(TV_series) （read）
3. **季數與狀態**：1 季、9 集，2025-11-07 首播。**已訂第 2 季**（「A second season has been ordered」）。第 1 季 9 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt22202452/ ）。Sex & Nudity **Mild**（166/401）、Violence & Gore **Mild**（77/146）、Profanity **Moderate**（63/165）、Alcohol, Drugs & Smoking **Moderate**（61/135，包括暗示使用海洛因）、Frightening **Moderate**（60/131）。投稿特別提到：約 2 分鐘的浴缸裸體場面（重點部位有遮擋）；因為集體意識的設定，性同意有疑慮；悲傷與自殺念頭；末日畫面。來源：https://www.imdb.com/title/tt22202452/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **99%**（187 則），Popcornmeter **68%**。Consensus：「Genuinely original science-fiction fare from television veteran Vince Gilligan, Pluribus leads Rhea Seehorn through a brave new world with plentiful returns.」來源：https://www.rottentomatoes.com/tv/pluribus/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2026；GG Drama nom 2026（Wikipedia：拿下 6 座 Emmy，包括 Seehorn 的劇情類最佳女主角和 Gilligan 的編劇獎，另獲 Peabody）
   - B：CT10-2025 agg #3；Vulture2025（McHenry #4、VanArendonk #4）；THR2025（Han #6）
   - C：RT 2025 S1 99% / Popcorn 68%
   - F：PTT 2025 年度最佳串 原 PO #1；RedRecs #13；Reddit 117 lists #4 (snippet)
   - G：釀電影 張硯拓「2025 最讓我興奮的新劇」
7. **前置作品**：沒有，是原創劇。
8. **台灣串流**：Apple TV（訂閱，7 天免費試用後 $250/月）https://tv.apple.com/tw/show/%E8%90%AC%E4%B8%AD%E9%81%B8%E4%B8%80/umc.cmc.37axgovs2yozlyh3c2cmwzlza — **A**（tw-availability-1）

## 9. Andor

1. **片名**：安道爾（Disney+ 頁「觀看安道爾｜Disney+」）／*Andor*
2. **劇情**：《星際大戰》系列劇，講小偷 Cassian Andor 在《俠盜一號》之前五年間，如何被激化成為反抗軍間諜，以及反抗軍聯盟的成形過程。來源：https://en.wikipedia.org/wiki/Andor （read）
3. **季數與狀態**：2 季、24 集（S1 2022-09-21～11-23；S2「second and final season」2025-04-22～05-13），**已完結**。第 1 季 12 集。來源：同上（read）
4. **分級**：美國 **TV-14**。Sex & Nudity **Mild**（227/456）、Violence & Gore **Moderate**（167/261）、Profanity **Mild**（182/253）、Alcohol **Mild**（154/216）、Frightening **Moderate**（144/246）。投稿特別提到：處決與行刑隊、畫面外的自殺；性侵未遂（台詞「he tried to rape me」）；播放孩童被殺的錄音；「Easily the darkest installment in the "Star Wars" franchise next to "Revenge of the Sith"」。使用者建議分級 PG-13。IMDb 列出的台灣分級是 12+。來源：https://www.imdb.com/title/tt9253284/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **96%**（607 則），Popcornmeter **88%**。Consensus：「A gritty adventure told from the ground perspective of the Empire's reign, Andor is an exceptionally mature and political entry into the Star Wars mythos -- and one of the best yet.」來源：https://www.rottentomatoes.com/tv/andor/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2023、2025（Wikipedia：2025 年拿 5 座 Emmy，包括劇情類編劇獎；Peabody 2022、2025）
   - B：Variety2025（Alison Herman #1）；Vulture2025（Hadadi #1、Quah #1）；THR2025（Angie Han #1）；NYT2026 #32
   - C：IMDb 8.6（#160）；RT 2025 S2 97% / Popcorn 90%
   - F：Reddit r/television 2025 survey Best Received #1 86.8% (snippet)；RedRecs #1；PTT 2025 年度最佳串 ×3
   - G：GQ TW Disney+ 神級影集
7. **前置作品**：是電影《俠盜一號》（2016）的前傳，劇情結束在《俠盜一號》開始的地方。**不必先看**；看完再看《俠盜一號》是常見的順序。Wikipedia：「a prequel to the anthology film *Rogue One: A Star Wars Story* (2016)… ends where the events of *Rogue One* begin」。來源：同欄位 2（read）。觀看順序是編輯判斷。
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-faba988a-a9f5-45f2-a074-0775a7d6f67a ；JW：https://www.justwatch.com/tw/節目/andor — **confirmed on service page**（tw-availability-3。注意：batch 1 對同類 Disney+ 頁的判定是 B）

## 10. The Mandalorian

1. **片名**：曼達洛人（Disney+ TW）／*The Mandalorian*
2. **劇情**：《星際大戰》第一部真人影集，時間在《絕地大反攻》之後五年，一名獨行的曼達洛賞金獵人保護具原力天賦的孩子 Grogu，躲避帝國殘黨的追殺。來源：https://en.wikipedia.org/wiki/The_Mandalorian （read）
3. **季數與狀態**：3 季、24 集（2019-11-12 到 2023-04-19）。**沒有第 4 季**：原本在開發的第 4 季改成電影《曼達洛人與古古》（*The Mandalorian and Grogu*，2026 年 5 月上映），作為影集的延續。第 1 季 8 集。來源：同上（read）
4. **分級**：美國 **TV-14 V**。Sex & Nudity **None**（1007/1108）、Violence & Gore **Moderate**（468/828）、Profanity **None**（538/894）、Alcohol **None**（587/767）、Frightening **Moderate**（378/718）。投稿特別提到：幾乎不見血，角色被腰斬或燒死都發生在畫面外；巨型蜘蛛那集可能嚇人。使用者建議分級 PG-13。IMDb 列出的台灣分級是 12+。來源：https://www.imdb.com/title/tt8111088/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **93%**（338 則），Popcornmeter **93%**。Consensus：「Action-packed and expertly-crafted -- if at times a bit too withholding -- The Mandalorian is a welcome addition to the Star Wars universe that benefits greatly from the cuteness of its cargo.」來源：https://www.rottentomatoes.com/tv/the_mandalorian/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2020、2021；GG Drama nom 2021
   - C：IMDb 8.6（#157）
   - D：Nielsen 2023 #8 streaming original 12.3B min
   - F：PTT 2026 推薦串 ×2；PTT D+ 推薦串
   - G：GQ TW Disney+ 神級影集
7. **前置作品**：不必先看星戰電影，劇情設定在《絕地大反攻》（1983）之後。後續故事接到電影《曼達洛人與古古》（2026），衍生劇有《波巴·費特之書》《亞蘇卡》《骷髏戰隊》。來源：同欄位 2（read）
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-422f6dcc-226f-44e7-98d4-22de69b31cf3 ；JW：https://www.justwatch.com/tw/節目/the-mandalorian — **已在服務商頁面確認**（tw-availability-2。Disney+ 判定標準見檔頭說明）

## 11. Alien: Earth

1. **片名**：異形：地球（Disney+ zh-tw 頁「觀看異形：地球」）／*Alien: Earth*
2. **劇情**：Noah Hawley 創作的《異形》系列第一部影集，時間在 1979 年電影《異形》之前兩年，背景搬到地球。來源：https://en.wikipedia.org/wiki/Alien:_Earth （read）。導言沒有寫更細的劇情，可以另用 RT 簡介補充。
3. **季數與狀態**：1 季、8 集，2025-08-12 首播（美國在 FX／Hulu，國際在 Disney+）。2025 年 11 月**已續訂第 2 季**，預計 2026 年中到 2027 年初開拍。第 1 季 8 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（90/215）、Violence & Gore **Severe**（108/134）、Profanity **Moderate**（46/123）、Alcohol **Mild**（55/110）、Frightening **Severe**（82/116）。投稿特別提到：異形咬碎下顎、被腰斬的人還在爬、異形從眼窩鑽出、手術畫面裡有寄生蟲；隨時都有死亡威脅。使用者建議分級：「Rated R for strong bloody violent content, gore, some sexual content, strong language, some drug use, and disturbing imagery.」IMDb 列出的台灣分級是 15+。來源：https://www.imdb.com/title/tt13623632/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **94%**（201 則），Popcornmeter **65%**。Consensus：「Stylistically bold and scary as hell, Noah Hawley's Alien: Earth transplants the Xenomorph mythos into the television medium with its cinematic grandeur intact while staking out a unique identity of its own.」來源：https://www.rottentomatoes.com/tv/alien_earth/s01 （read）
6. **推薦 tag**：
   - B：CT10-2025 agg #12
   - C：RT 2025 94% / Popcorn 65%
   - E：Parrot GDA 2025 series-debut finalist
   - F：RedRecs #15
   - G：GQ TW Disney+ 神級影集；Yahoo TW 2025-08
7. **前置作品**：不必先看。這部是 1979 年《異形》的前傳，看過電影會比較懂異形的設定。來源：同欄位 2（read）
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-ac314a24-c615-48ee-8e24-b26de75e64ef — **B（JustWatch + 服務 zh-TW 頁，地區未證）**（tw-availability-1）。**重新查核**：Groundlane `web_extract` 讀到頁面標題「觀看異形：地球 | Disney+」，但頁面沒有台幣價格，也沒有地區欄位，所以等級仍是 B。Wikipedia 寫明國際版在 Disney+ 上線（read）。

## 12. Fallout

1. **片名**：異塵餘生（Prime Video zh_TW 頁標題「Prime Video：異塵餘生–第一季」）／*Fallout*
2. **劇情**：改編自同名角色扮演遊戲系列，時間在 2077 年核戰「大戰」後兩百年，文明崩潰後的廢土世界。來源：https://en.wikipedia.org/wiki/Fallout_(American_TV_series) （read）
3. **季數與狀態**：2 季、16 集（S1 2024-04-10；S2 2025-12-16 首播）。2025 年 5 月**已續訂第 3 季**。第 1 季 8 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt12637874/ ）。Sex & Nudity **Moderate**（409/1147）、Violence & Gore **Severe**（446/523）、Profanity **Moderate**（232/488）、Alcohol, Drugs & Smoking **Moderate**（203/401）、Frightening **Severe**（289/442）。投稿特別提到：肢解、多次刺眼、腳被炸斷；S1E6 邪教儀式中有上半身裸露；類似冰毒的藥物和迷幻藥；巨型輻射蠍，怕蜘蛛的人要小心。使用者建議分級 R。來源：https://www.imdb.com/title/tt12637874/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **93%**（131 則），Popcornmeter **95%**。Consensus：「An adaptation that feels like a true extension of the games, Fallout is a post-apocalyptic blast for newcomers and longtime fans alike.」來源：https://www.rottentomatoes.com/tv/fallout/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2024（Wikipedia：另有 Goggins 男主角提名、2 座 Creative Arts Emmy）
   - B：CT10-2024 agg #8=
   - C：RT 2024 S1 93% / Popcorn 95%；RT 2025 S2 96% / Popcorn 96%
   - D：Nielsen 2024 top new original drama 11.95B min；Nielsen H1 2026 #9 original 7.98B min
7. **前置作品**：不必先玩遊戲。Wikipedia：「Critics have deemed it one of the best video game adaptations」，而且 RT 共識說新觀眾也能看。來源：欄位 2 與欄位 5 的 URL（read）
8. **台灣串流**：Prime Video（訂閱）https://www.primevideo.com/detail/0HAQAA7JM43QWX0H6GUD3IOF70 ；JW：https://www.justwatch.com/tw/節目/fallout — **僅 JustWatch**（tw-availability-2）。**重新查核**：Groundlane 讀 `?language=zh_TW` 版本，片名是「異塵餘生–第一季」，但價格顯示 US$36.04／US$41.32、「Amazon.com Services LLC 銷售」，出口在美國，所以等級仍是「僅 JustWatch」。

## 13. 3 Body Problem

1. **片名**：**3 體**（未在服務頁驗證）／*3 Body Problem*。tw-availability-1 原本標「未驗；JW 顯示『3 体』」。這次找到的旁證：ELLE Taiwan 的文章標題寫「Netflix《3體》…」（read：https://www.elle.com/tw/entertainment/drama/g60280956/about-3-body-problem ）；中文維基百科「各地節目名稱：台灣 3 體」（snippet：https://zh.wikipedia.org/zh-tw/三体_(2024年电视剧) ）。建議用「3 體」，但仍不是服務頁驗證。
2. **劇情**：改編自劉慈欣的《地球往事》三部曲（《三體》），一群以科學家為主的角色接觸到外星文明，人類面臨一連串威脅與巨變。來源：https://en.wikipedia.org/wiki/3_Body_Problem_(TV_series) （read）
3. **季數與狀態**：1 季、8 集，2024-03-21 上線。2024 年 5 月**已續訂第 2、3 季**，Wikipedia 寫第 2 季「set to premiere in 2026」，但截至 2026-11-05 infobox 仍是 1 季。第 1 季 8 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Moderate**（137/436）、Violence & Gore **Severe**（99/181）、Profanity **Moderate**（48/160）、Alcohol, Drugs & Smoking **Moderate**（69/139）、Frightening **Severe**（76/142）。投稿特別提到：S1E1 文革批鬥中有人被當眾打死；多處自殺描寫；短暫的男女正面全裸；第 1 季共 117 次 f-word；大麻與 LSD。IMDb 列出的台灣分級是 16+。來源：https://www.imdb.com/title/tt13016388/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **78%**（115 則），Popcornmeter **76%**。Consensus：「Tackling its ambitious source material with impressive gusto, 3 Body Problem's first season proves a solid start that should leave sci-fi fans eager for more.」來源：https://www.rottentomatoes.com/tv/3_body_problem/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2024（Wikipedia：共 6 項 Emmy 提名）
   - B：Vulture2024 (other highlights, unranked)
   - C：RT 2024 S1 78% / Popcorn 76%
   - D：Netflix H1 2024 #8 (52.4M)
7. **前置作品**：不必先讀原著。另有中國騰訊的真人版《三體》（2023），和這部是不同的改編。來源：同欄位 2（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81024821 — **C（JustWatch only）**（tw-availability-1）。**重新查核**：Groundlane `web_extract` 回 `OUTPUT_LIMIT`；Tavily search（country=Taiwan）抓到的 Netflix 頁是巴西出口（BRL 價格），不能用。Firecrawl 沒有額度。等級維持 C。

## 14. The Boys

1. **片名**：黑袍糾察隊（Prime Video 頁加 zh_TW 參數後顯示「黑袍糾察隊-第一季」）／*The Boys*
2. **劇情**：改編自 Garth Ennis 和 Darick Robertson 的漫畫，一群義警對抗濫用超能力、替 Vought 公司賣命的超級英雄「Supes」，以及 Homelander 領導的「七人隊」。來源：https://en.wikipedia.org/wiki/The_Boys_(TV_series) （read）
3. **季數與狀態**：5 季、40 集。第 5 季是最終季，2026-04-08 首播、2026-05-20 完結，**已完結**。前傳 *Vought Rising* 預計 2027 年播出。第 1 季 8 集（「first season of eight episodes」）。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt1190634/ ）。五個類別全部 **Severe**：Sex & Nudity（2885/3806）、Violence & Gore（2261/2439）、Profanity（1965/2210）、Alcohol, Drugs & Smoking（1320/2265）、Frightening（1405/1940）。投稿特別提到：第 3 季有一集以雜交為主線、多次正面全裸、性脅迫與性侵場面；極端血腥（爆頭、肢解、雷射眼切人）；五季合計約 2383 次 f-word；海洛因、古柯鹼、芬太尼等多種毒品；有人說「should not be viewed by anyone under 18」。來源：https://www.imdb.com/title/tt1190634/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **85%**（106 則），Popcornmeter **90%**。Consensus：「Though viewers' mileage may vary, The Boys' violent delights and willingness to engage in heavy, relevant themes are sure to please those looking for a new group of antiheroes to root for.」來源：https://www.rottentomatoes.com/tv/the_boys_2019/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2021
   - C：IMDb 8.5（#232）；RT 2024 S4 92% / Popcorn 53%
   - D：Nielsen 2024 #3 streaming original 13.58B min
   - E：GWR2026 most in-demand action & adventure + superhero show 67.8x；Parrot GDA 2024 most in-demand superhero series
   - F：PTT 2026 推薦串 (OP)；PTT GOAT 串「超英」
7. **前置作品**：不必先看其他作品。同一個宇宙還有《Gen V》（2023）和動畫《Diabolical》。Wikipedia 只寫它們是「shared universe」，沒寫主劇需要先看哪一部；《Gen V》和主劇第 4 季的劇情交集**未查證**。來源：同欄位 2（read）
8. **台灣串流**：Prime Video（訂閱，含在 Prime）https://www.primevideo.com/detail/0S1FYJ3LY9KTL9C7WFFAGA9F6F?language=zh_TW ；JW：https://www.justwatch.com/tw/節目/the-boys — **JustWatch only**（tw-availability-3）。**重新查核**：Groundlane 讀到 US$35.99、「Amazon.com Services LLC 銷售」，出口在美國，等級不變。

## 15. It: Welcome to Derry

1. **片名**：牠：歡迎來到德利鎮（HBO Max TW）／*It: Welcome to Derry*（RT 寫成 *IT: Welcome to Derry*）
2. **劇情**：根據 Stephen King 1986 年的小說《牠》改編，是電影《牠》（2017）和《牠：第二章》（2019）的前傳，Bill Skarsgård 再次演出 Pennywise。來源：https://en.wikipedia.org/wiki/It_–_Welcome_to_Derry （read；英文條目實際的標題用破折號）
3. **季數與狀態**：1 季、9 集，2025-10-26 在 HBO 首播。2026-10-31 在 HBO Max 上了一集特別前傳。2026 年 8 月**已續訂第 2 季**，預計 2027 年底或 2028 年播出。第 1 季 9 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（201/448）、Violence & Gore **Severe**（246/280）、Profanity **Moderate**（127/222）、Alcohol **Mild**（132/196）、Frightening **Severe**（195/222）。投稿特別提到：Pennywise 咬掉人頭、吃臉；角色自己切掉眼睛；「The violence and gore is about 10 times more than the movies」；頻繁 jump scare，還有直戳角色恐懼的心理恐怖。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt19244304/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **81%**（171 則），Popcornmeter **82%**。Consensus：「While scattered plotting occasionally drains the fear from its chilling premise, IT: Welcome to Derry compellingly deepens the myth of Pennywise through sharp social commentary, a dreadful atmosphere, and committed performances.」來源：https://www.rottentomatoes.com/tv/it_welcome_to_derry/s01 （read）
6. **推薦 tag**：
   - B：Variety2025（Aramide Tinubu #5）；CT10-2025 agg #23=
   - C：RT 2025 81% / Popcorn 82%
   - E：Parrot GDA 2025 most in-demand series debut (winner)
   - F：PTT 2025 年度最佳串 ~9 推（推文最多的美國劇）
   - G：FlixPatrol HBO Max TW 2026-11-05 #10；HBO Max TW 首頁「創新話題劇集」(snippet)
7. **前置作品**：是電影《牠》（2017）和《牠：第二章》（2019）的前傳。**不必先看**，但看過電影比較能體會 Pennywise 的設定。來源：同欄位 2（read）。「不必先看」是編輯判斷。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/6c39354a-c52d-46d7-982c-b5d196988189 ；JW：https://www.justwatch.com/tw/節目/welcome-to-derry — **已在服務商頁面確認**（tw-availability-2）

## 16. The Walking Dead: The Ones Who Live

1. **片名**：陰屍路：生存者（Disney+ zh-tw 頁「觀看陰屍路：生存者 | Disney+」）／*The Walking Dead: The Ones Who Live*
2. **劇情**：AMC 的末日恐怖迷你影集，時間在原版《陰屍路》完結之後，Andrew Lincoln、Danai Gurira 和 Pollyanna McIntosh 回歸飾演 Rick Grimes、Michonne 和 Anne。來源：https://en.wikipedia.org/wiki/The_Walking_Dead:_The_Ones_Who_Live （read）
3. **季數與狀態**：**迷你影集**，6 集，2024-02-25 到 03-31，已完結。來源：同上（read）
4. **分級**：美國 **TV-MA L, V**。Sex & Nudity **Mild**（45/91）、Violence & Gore **Severe**（55/60）、Profanity **Moderate**（39/65）、Alcohol **Mild**（38/53）、Frightening **Severe**（50/65）。投稿特別提到：大量殺喪屍的血腥場面，第 1 集 Rick 連續刺穿喪屍頭部；有一場收得很含蓄的性愛戲。來源：https://www.imdb.com/title/tt9859436/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **88%**（55 則），Popcornmeter **76%**。Consensus：「A Walking Dead spinoff that balances past and present without skimping on blockbuster scope, The Ones Who Live is a consistent treat for longtime fans.」來源：https://www.rottentomatoes.com/tv/the_walking_dead_the_ones_who_live/s01 （read）
6. **推薦 tag**：
   - C：RT 2024 S1 88% / Popcorn 76%
   - G：ELLE TW 2025 #2（衍生劇本身）
   - F（**屬於母劇 The Walking Dead**，fans 檔把兩部合成一列）：PTT 2026 推薦串；PTT GOAT 串「末日劇」(2023)
7. **前置作品**：**需要先看原版《陰屍路》**（*The Walking Dead*，2010–2022，11 季），至少要看到 Rick 離開的第 9 季和 Michonne 離開的第 10 季。Wikipedia：「It is set after the conclusion of the original *The Walking Dead* series」；RT 共識也說是給「longtime fans」看的。來源：欄位 2 與欄位 5 的 URL（read）。「至少看到第 9、10 季」是編輯建議，來源沒寫季數。
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-8468b2fd-8a22-4bf7-8810-040894061359 — **B**（tw-availability-1；原版 TWD 在 Netflix 與 Disney+，JW 寫 11 季）。**重新查核**：Groundlane 讀到頁面標題，但沒有地區或價格資訊，等級仍是 B。

## 17. Wednesday

1. **片名**：星期三（Netflix TW）／*Wednesday*
2. **劇情**：以 Charles Addams 筆下的 Wednesday Addams 為主角（Jenna Ortega 飾），她進入新學校後，試著解開一連串謀殺謎案，部分集數由 Tim Burton 執導。來源：https://en.wikipedia.org/wiki/Wednesday_(TV_series) （read）
3. **季數與狀態**：2 季、16 集（S1 2022-11-23 上線；S2 2025-08-06 和 09-03 分兩部分上線）。2025 年 7 月**已續訂第 3 季**。第 1 季 8 集。來源：同上（read）
4. **分級**：美國 **TV-14**（IMDb 標題頁，read：https://www.imdb.com/title/tt13443470/ ）。Sex & Nudity **None**（600/1025）、Violence & Gore **Moderate**（386/688）、Profanity **Mild**（391/581）、Alcohol, Drugs & Smoking **None**（368/520）、Frightening **Moderate**（303/557）。投稿特別提到：車禍斷頸、殘缺屍體、眼睛被挖出的畫面；多次 jump scare；怪物 Hyde 的近景。使用者建議分級 PG-13。來源：https://www.imdb.com/title/tt13443470/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **74%**（102 則），Popcornmeter **86%**。Consensus：「Wednesday isn't exactly full of woe for viewers, but without Jenna Ortega in the lead, this Addams Family-adjacent series might as well be another CW drama.」來源：https://www.rottentomatoes.com/tv/wednesday/s01 （read）。這句共識褒貶參半，引用時注意語氣。
6. **推薦 tag**：
   - A：Emmy Comedy nom 2023；GG Comedy nom 2023（Wikipedia：拿下 4 座 Emmy，都是技術類）
   - C：RT 2025 S2 87% / Popcorn 76%
   - D：Netflix all-time English #1 (S1 252.1M)；Nielsen 2025 #3 original 20B min；Netflix H2 2025 #1 (S2 123.9M)
   - G：Netflix TW Top10 2025-08-04～10 #1 (S2)；LINE TODAY 聚光賞 2025 前十 (S2)
7. **前置作品**：不必先看任何《阿達一族》作品。來源：同欄位 2（read）。這是編輯判斷。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81231974 ；JW：https://www.justwatch.com/tw/節目/wednesday — **已在服務商頁面確認**（Firecrawl 以台灣出口讀到，Asia/Taipei；共 2 季；tw-availability-2）

## 18. The Handmaid's Tale

1. **片名**：使女的故事（HBO Max TW）／*The Handmaid's Tale*
2. **劇情**：改編自 Margaret Atwood 1985 年的小說，第二次美國內戰後，神權極權國家基列把仍有生育能力的女性（「使女」）當作生育奴隸。來源：https://en.wikipedia.org/wiki/The_Handmaid%27s_Tale_(TV_series) （read）
3. **季數與狀態**：6 季、66 集，2017-04-26 到 2025-05-27，**已完結**。續作《證言》（*The Testaments*）2026 年 4 月在 Hulu 首播。第 1 季 10 集（「straight-to-series order of ten episodes」）。來源：同上（read）。`The_Handmaid's_Tale_season_1` 條目的 raw 抓取回 404，所以 S1 集數取自主條目的這句話。
4. **分級**：美國 **TV-MA**。Sex & Nudity **Severe**（612/1018）、Violence & Gore **Severe**（369/489）、Profanity **Moderate**（224/441）、Alcohol, Drugs & Smoking **Mild**（297/388，只有菸）、Frightening **Severe**（339/437）。投稿特別提到：制度化的強暴與性暴力、女性生殖器殘割、吊屍、剜眼、斷手刑罰；家暴與奴役主題。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt5834204/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **94%**（260 則），Popcornmeter **90%**。Consensus：「Haunting and vivid, The Handmaid's Tale is an endlessly engrossing adaptation of Margaret Atwood's dystopian novel that's anchored by a terrific central performance from Elisabeth Moss.」來源：https://www.rottentomatoes.com/tv/the_handmaids_tale/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama win 2017（第一部拿下這個獎的串流影集）；GG Drama win 2018
   - B：BBC2021 #38；NYT2026 #67
   - C：RT 2025 S6 87% / Popcorn 44%
   - G：Cosmo TW 2025 上檔預告 (snippet)
7. **前置作品**：沒有，不必先讀原著。續作是《證言》（2026）。來源：同欄位 2（read）
8. **台灣串流**：HBO Max（訂閱，6 季）https://www.hbomax.com/tw/zh/show/858582f7-55e3-45e0-810d-3fc449e9938f — **A**（tw-availability-1）

## 19. The Penguin

1. **片名**：企鵝人（HBO Max TW）／*The Penguin*
2. **劇情**：DC 犯罪迷你影集，是電影《蝙蝠俠》（*The Batman*，2022）的衍生作，講 Oz Cobb（Colin Farrell）在高譚市黑幫世界奪權崛起。來源：https://en.wikipedia.org/wiki/The_Penguin_(TV_series) （read）
3. **季數與狀態**：**迷你影集（RT 標為 Limited Series）**，8 集，2024-09-19 到 11-10，已完結。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（285/539）、Violence & Gore **Severe**（169/225）、Profanity **Severe**（183/227）、Alcohol, Drugs & Smoking **Severe**（161/213）、Frightening **Severe**（116/230）。投稿特別提到：槍殺、刀刺、酷刑、有人被淋汽油活活燒死；毒品製造與販賣是主線；第 1 集有不到 5 秒的胸部裸露。使用者建議分級：「rated R for strong brutal violence, bloody images, pervasive language, and drug content.」IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt15435876/parentalguide/ （read）
5. **RT**：Tomatometer **95%**（212 則），Popcornmeter **85%**。Consensus：「Depicting Gotham through bone-breaking punches rather than popping onomatopoeia, The Penguin is a grounded crime saga given gravitas by Colin Farrell and a scene-stealing Cristin Milioti.」來源：https://www.rottentomatoes.com/tv/the_penguin/s01 （read）
6. **推薦 tag**：
   - A：Emmy Limited nom 2025；GG Limited nom 2025（Wikipedia：24 項 Emmy 提名，Farrell 和 Milioti 都有表演獎得獎；**Wikipedia 沒寫是哪個獎**，見待查清單）
   - B：Variety2024（Aramide Tinubu #1）；CT10-2024 agg #5
   - C：IMDb 8.6（#173）；RT 2024 95% / Popcorn 85%
7. **前置作品**：是電影《蝙蝠俠》（2022）的衍生作。**建議先看電影**，但不是必要條件。Wikipedia：「it serves as a spin-off from the 2022 film *The Batman*」，Farrell 也是「reprising his role」。來源：同欄位 2（read）。「建議先看」是編輯判斷。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/5756c2bf-36f8-4890-b1f9-ef168f1d8e9c ；JW：https://www.justwatch.com/tw/節目/the-penguin — **已在服務商頁面確認**（tw-availability-2）

---

## 結果摘要

- 19 部都有讀到的來源（read），涵蓋欄位 2、3、4、5、7。
- 欄位 8 在服務頁確認（A／confirmed／已確認）的有 13 部：GoT、Peacemaker、HotD、KotSK、TLOU、Severance、Pluribus、Andor、Mandalorian、Derry、Wednesday、Handmaid's Tale、Penguin。其中 Andor 和 Mandalorian 是 Disney+ 頁，判定標準和 batch 1 不一致。
- 沒在服務頁確認的有 6 部：Stranger Things（B）、Alien: Earth（B）、TWD: TOWL（B）、3 Body Problem（C）、Fallout（僅 JW）、The Boys（僅 JW）。這次都重新查過一次，等級沒有變。

## 無法查證或尚待確認的事實

1. **台灣串流地區可用性（6 部）**：Stranger Things、3 Body Problem（Netflix）、Alien: Earth、TWD: TOWL（Disney+）、Fallout、The Boys（Prime Video）。這個環境的出口不在台灣：Netflix 用 Groundlane 讀回 `OUTPUT_LIMIT`，用 Tavily 讀是巴西出口；Prime Video 是美國出口（US$）；Disney+ zh-tw 頁不顯示地區。Firecrawl（TW location）今天的 MCP 額度已用完，錯誤訊息說約 2 小時 52 分後重置，到時候還沒重試。建議用台灣 IP 人工確認，或等 Firecrawl 額度重置後用 `location.country=TW` 重抓。
2. **3 Body Problem 的台灣官方譯名**：只有 ELLE TW 的「3體」（read）和中文維基「台灣：3 體」（snippet），沒有 Netflix TW 頁可對。
3. **Disney+ 證據等級不一致**：Andor、Mandalorian（記為「已確認」）和 Alien: Earth、TOWL（記為 B）用的是同一種 Disney+ zh-tw 頁。要嘛統一降為 B，要嘛統一升級，需要人來決定。
4. **美國電視分級的層級**：IMDb 的分級欄是使用者和平台資料混合，Severance 還標「self-applied」。Stranger Things 的 IMDb 標題頁寫 TV-MA，但 Netflix 各季實際的分級（是否有某幾季是 TV-14）沒有用 Netflix 官方頁查證。GoT、ST、Pluribus、Fallout、Boys、Wednesday 的美國分級只讀到 IMDb 標題頁，沒有讀到 Parents Guide 的 Certifications 區塊。
5. **Common Sense Media**：沒有使用，因為 IMDb Parents Guide 19 部都讀到了。若要提供「家長向」的建議年齡，還需要另外查。
6. **Parents Guide 本質上是使用者投稿與投票**，描述可能有誤或帶主觀判斷，例如 GoT 那段措辭強烈的投稿。文章引用時建議只用嚴重度詞，不要直接引用個別投稿。
7. **The Penguin 的表演獎**：Wikipedia 導言只寫「wins for both Farrell and Milioti's performances」，沒有指出是哪個獎（Emmy 或 Golden Globe）。要寫成 tag 的話，需要回頭查 awards 檔或 Wikipedia 的 accolades 段落。
8. **The Boys 和 Gen V 的劇情交集**：沒有查證是否需要先看 Gen V 才看得懂第 4、5 季。
9. **Alien: Earth 的一句話劇情**：Wikipedia 導言只有時間設定（電影《異形》之前兩年、在地球），沒有更細的劇情，可以考慮改用 FX／Disney+ 官方簡介補。
10. **3 Body Problem 第 2 季是否已在 2026 年上線**：Wikipedia 寫「set to premiere in 2026」，infobox 仍是 1 季。截至 2026-11-05 有沒有排定上線日，沒有另外查證。

## 工具降級紀錄（toolDegradation）

- Groundlane 讀 IMDb 回 202 空頁（js_empty_document，被 WAF 擋）→ 改用 Tavily extract（讀 4 頁後回 429）→ Jina `read_url`（15 頁；有 5 頁沒抓到 Certifications 區塊）→ Exa `web_fetch_exa` 補標題頁的分級。
- Groundlane `web_fetch` 用 `render=always` 讀 RT 逾時（browser-challenge）→ 改用 `render=never` 加 selector，成功。
- Firecrawl：「Your Firecrawl credits ran out. Daily MCP credits refresh in 2h 52m. Add credits or upgrade to keep going: https://www.firecrawl.dev/billing/1cscjebvah18y5jxykvsw4ve0tn9fxgs」
- 英文 Wikipedia 用 `It:` 開頭的標題會被當成跨語言連結導到義大利文維基，改用條目實際的標題 `It – Welcome to Derry`。
