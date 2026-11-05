# Post 4a 評價資料表：美劇｜喜劇與成人動畫 12 部（Metacritic／IMDb／豆瓣／英文評論／中文評論）

研究日期：2026-11-05。RT 分數已在 `factsheets-post4a.md`，這裡不重抓，只在「分歧」欄引用。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態標記 |
|---|---|---|---|
| Metacritic S1 Metascore＋評論數 | `metacritic.com/tv/<slug>/season-1/`，抓 `title="Metascore N out of 100"` 和 `Based on N Critic Reviews`／`See All N Critic Reviews` | Groundlane `web_extract`（render=never） | 11/12 read；Arcane S1 季頁是 tbd，改記整部劇分數 |
| IMDb 用戶評分（**整部劇**，非單季） | `imdb.com/title/<id>/` 標題列 | Exa `web_fetch_exa`（11 部）；Curb 抓不到，改用 ratings 檔的 IMDb Top 250 讀值 | 11 read、1 read（間接） |
| 豆瓣 S1 評分 | `movie.douban.com/subject/<id>/` | 不直抓（post1 已確認會導到 `sec.douban.com` 驗證頁，不繞過）。Exa 快取 subject 頁（標 **cache**）；其餘用 Tavily 搜尋摘要（標 **snippet**） | 4 cache、7 snippet、1 無 |
| 英文評論 | Metacritic critic-reviews 頁列出的連結 → 讀原文；1997／2000 年的舊評論用 Exa 搜尋找到 | Groundlane `web_fetch`；IndieWire、Atlantic 用 Exa | 10 read、2 partial／cache |
| 中文評論 | 台灣媒體（釀電影、關鍵評論網、電影神搜等） | Groundlane `web_extract`、Tavily extract／search、Exa search | 見各條 |

標記說明：**read** = 工具實際讀到頁面內文；**partial** = 只讀到前段；**cache** = Exa 快取副本（非即時）；**snippet** = 只看到搜尋摘要，不算讀到原頁。

> 注意：IMDb 是整部劇的總評分，Metacritic 與豆瓣是第 1 季。長壽劇（South Park 29 季、Simpsons 38 季）的 S1 分數和整體評價差很多，比較時不能直接對齊。

---

## 1. Rick and Morty 瑞克和莫蒂

1. **Metacritic S1**：**85**（8 則）。https://www.metacritic.com/tv/rick-morty/season-1/ （read；網址是 `rick-morty`，`rick-and-morty` 會 404）
2. **IMDb**：**9.0/10**（718K）。https://www.imdb.com/title/tt2861424/ （read，Exa）
3. **豆瓣 S1**：**9.7**（人數不明）。https://m.douban.com/movie/subject/11537954 （snippet，Tavily 摘要「瑞克和莫蒂第一季豆瓣评分：9.7」）。另：第 9 季 9.3（snippet，https://m.douban.com/movie/subject/36508123 ）。
4. **英文評論**：Vulture，Matt Zoller Seitz，2013-12-02，〈Seitz on Dan Harmon's Rick and Morty: The Unhinged Quality of Community Meets the Sci-fi Stylings of Futurama〉。https://www.vulture.com/2013/12/tv-review-dan-harmons-rick-and-morty.html （read；根據前兩集）
   - 摘要：說這部劇能填補《飛出個未來》留下的空缺，荒誕笑點都扎根在角色心理；他特別指出 Rick 和 Morty 的關係，其實是很準確的酗酒家長操控家人的寫照。
   - 原文：「one of the more accurate portrayals of how charismatic alcoholics bamboozle meek family members」
5. **中文評論（台灣）**：釀電影，香功堂主，約 2020-06-30（日期由網址的 ObjectId 推算，頁面上沒讀到日期欄），〈《瑞克和莫蒂》：如果有無限個時空，能不能逃脫親情（與人性）的糾纏？〉。https://filmaholic.tw/series/5efab2ddfd89780001205ba1 （read，Groundlane `web_extract` 讀到標題、作者 meta 與內文段落）
   - 摘要：認為星際冒險只是包裝，全劇真正的主線是瑞克與女兒貝絲、莫蒂與姊姊之間「剪不斷理還亂」的家庭情感。他最喜歡第 3 季第 7 集〈大本營的故事〉，並用第 2 季〈看誰在殺戮〉說明編劇對人性嗜血的悲觀。（評到第 4 季。）
6. **分歧**：評論和觀眾都很高（MC 85、RT 97%、IMDb 9.0、豆瓣 9.7）。但 Metacritic S1 只有 8 則評論，樣本小。最新的 S9 RT 100%、Popcorn 83%，觀眾比評論冷一點；換配音後（S7 起）觀眾反應沒有在這次查到的資料裡出現，要引用的話需要另找。

## 2. BoJack Horseman 馬男波傑克

1. **Metacritic S1**：**59**（13 則）。https://www.metacritic.com/tv/bojack-horseman/season-1/ （read）
2. **IMDb**：**8.8/10**（241K）。https://www.imdb.com/title/tt3398228/ （read，Exa）
3. **豆瓣 S1**：**9.2**（人數不明）。https://m.douban.com/movie/subject/25900177 （snippet）。另：第 6 季 9.6（26,879 人，劇評頁側欄摘要，snippet，https://m.douban.com/movie/subject/30366464 ）。
4. **英文評論**：Slate，Willa Paskin，2014-08-22，〈Netflix Made a Bleak, Brilliant Comedy About a Talking Horse〉（內頁標題〈The Longest Face〉）。https://slate.com/culture/2014/08/bojack-horseman-on-netflix-will-arnett-comedy-cartoon-is-bleak-and-brilliant.html （read，Groundlane）
   - 摘要：BoJack 是 Will Arnett 慣演的那種討人喜歡的爛人，劇集對低階名氣的荒謬觀察很準，也有比一般卡通更強的連續性；它點出大議題卻不必真的表態。
   - 原文：「a little more clever than it is uproariously funny」
5. **中文評論（台灣）**：關鍵評論網，傅紀鋼，日期頁面上沒讀到（文章評完結篇，完結篇 2020-01-31 上線，應是 2020 年初），〈《馬男波傑克》完結篇：你以為自己的人生可以得到救贖，其實根本不行〉。https://www.thenewslens.com/article/131650 （read，Tavily extract 讀到作者與內文）
   - 摘要：他把每個配角都讀成 BoJack 的鏡子——凱洛琳公主代表一般好萊塢從業者、花生醬先生是屢屢受挫的世俗善良、黛安阮是他最想逃避的自我；BoJack 在第六季以為自己改過，其實只是自我催眠。同一作者 2019-10-31 也寫過第六季前半（https://www.thenewslens.com/article/126693 ，snippet）。
6. **分歧**：**本表評論對觀眾落差最大的一部**：MC S1 只有 59、RT S1 71%，但 Popcornmeter 90%、豆瓣 9.2、IMDb 8.8。評論界是後來才翻盤，S6 RT 已到 96%（factsheet）。寫文時要說明「第一季評價普通，越後面越好」。

## 3. Common Side Effects 常見副作用

1. **Metacritic S1**：**80**（6 則）。https://www.metacritic.com/tv/common-side-effects/season-1/ （read）
2. **IMDb**：**8.5/10**（23K）。https://www.imdb.com/title/tt28093628/ （read，Exa）
3. **豆瓣 S1**：**8.6**（評分人數未顯示；短評 4,571 條）。https://movie.douban.com/subject/36650558/ （cache，Exa 快取的 subject 頁）
4. **英文評論**：Los Angeles Times，Robert Lloyd，2025-01-31，〈'Common Side Effects' review: Adult Swim thriller delivers〉。https://www.latimes.com/entertainment-arts/tv/story/2025-01-31/common-side-effects-adult-swim-review （read，Groundlane；根據前 4 集）
   - 摘要：畫風更像地下漫畫，角色頭大身小卻很有表情；它把 Mike Judge、Greg Daniels《King of the Hill》式的生活喜劇改成陰謀驚悚，用動畫保住了人性。
   - 原文：「a semi-comical conspiracy thriller, with heart」
5. **中文評論（台灣）**：**沒有找到指定媒體的署名劇評**。釀電影、關鍵評論網、鳴人堂、電影神搜都沒有搜到。替代線索（都不符合條件）：PTT C_Chat〈[閒聊] 常見副作用S1〉，2025-03-29（snippet，https://www.pttweb.cc/bbs/C_Chat/M.1743215568.A.5C8 ，網友心得）；中國大陸澎湃新聞〈《常见副作用》：若能改变世界，你愿让人永生不死吗？〉，2025-06-29（snippet，https://www.thepaper.cn/newsDetail_forward_31027807 ，未署名）。
6. **分歧**：評論與觀眾一致偏高（RT 100%／Popcorn 91%、MC 80、豆瓣 8.6、IMDb 8.5）。但 MC 只有 6 則評論，樣本很小。

## 4. South Park 南方四賤客

1. **Metacritic S1**：**64**（17 則）。https://www.metacritic.com/tv/south-park/season-1/ （read）
2. **IMDb**：**8.7/10**（453K）。https://www.imdb.com/title/tt0121955/ （read，Exa）
3. **豆瓣 S1**：**沒有可用來源**。沒有搜到豆瓣第一季的 subject 頁。唯一有分數的是盜版站轉錄（「豆瓣 9.1，14675票」），**不採用**。
4. **英文評論**：Variety，Ray Richmond，1997-08-17，〈South Park〉。https://variety.com/1997/tv/reviews/south-park-1200450719/ （read，Groundlane；Exa 搜尋也回傳全文）
   - 摘要：說它是「卡通界的地獄」，像《史努比》撞上《發條橘子》，粗俗又褻瀆，但創作者讓天真外表和惡毒台詞形成反差，是一次瘋狂的啟示。
   - 原文：「as comedy, however, it's gloriously subversive art」
   - 補充：同一天 THR（Miles Beller）和 Washington Post（Tom Shales）都給負評（Exa highlights，cache），S1 首播時評論界是分裂的。
5. **中文評論（台灣）**：關鍵評論網，傅紀鋼，2019-10-23，〈「Band in China」：三層嘲諷的反覆迴旋，《南方四賤客》經典敘事代表作〉。https://www.thenewslens.com/article/126405 （partial，Exa highlights，含全文大部分段落）
   - 摘要：他把本劇的編劇結構拆成「三層嘲諷」：小鎮居民的故事、副線的時事諷刺、以及大量次文本細節，以 S23E02〈Band in China〉諷刺美國企業為了中國市場自我審查為例，稱它「影像與編劇的技藝才氣縱橫，堪稱世界電視史上最強」。（評的是第 23 季單集，不是第 1 季。）
6. **分歧**：S1 評論很保守（MC 64、RT 71%），但 IMDb 8.7 是長年累積的整體評價。1997 年首播時評論兩極（Variety 正評、THR／WaPo 負評）。

## 5. The Simpsons 辛普森家庭

1. **Metacritic S1**：**80**（6 則）。https://www.metacritic.com/tv/the-simpsons/season-1/ （read）
2. **IMDb**：**8.6/10**（475K）。https://www.imdb.com/title/tt0096697/ （read，Exa）
3. **豆瓣 S1**：**9.1**（**25,489** 人）。https://movie.douban.com/subject/1418197/ （cache，Exa 快取；頁首導覽列有「2024年度报告」，快照應在 2025 年前後）
4. **英文評論**：Los Angeles Times，Howard Rosenberg，1990-01-12，〈'The Simpsons': The Weird and the Wonderful〉。https://www.latimes.com/archives/la-xpm-1990-01-12-ca-68-story.html （read，Groundlane；評的是正式首播集，前一個月的聖誕特輯他另有一篇 1989-12-16 的好評）
   - 摘要：說它是 1989–90 年度最好、最聰明的新節目，寫作、畫面和配音「像馬諦斯一樣」契合；能同時傳達黑暗的怪誕和家庭的真實溫情，又不流於廉價煽情。
   - 原文：「Suburbia has rarely been stranger or sweeter.」
   - 補充：Metacritic 列的 NYT（John J. O'Connor，1990-02-21）用 Exa 只讀到付費牆前的第一句，沒有採用。
5. **中文評論（台灣，媒體待商榷）**：轉角國際（聯合新聞網），林齊晧，2016-02-04，〈辛普森家庭：刻劃美國時代記憶的第一家庭〉。https://global.udn.com/global_vision/story/8664/1487168 （partial，Exa highlights）
   - 摘要：從「為什麼是黃色的」談到 Homer 這個丑角為何受歡迎，認為它透過中產家庭諷刺美國夢，無意間記錄並塑造了美國大眾文化的時代記憶；也提到 2005 年〈姑姑雞飯〉一集嘲諷天安門，讓本劇在中國被封殺 8 年。⚠ 轉角國際不在指定名單（它是聯合新聞網的國際專欄，鳴人堂的姊妹站），而且是文化介紹文，不是單季劇評。釀電影、關鍵評論網沒有找到本劇的署名評論。
6. **分歧**：評論與觀眾都高（RT S1 100%、MC 80、豆瓣 9.1）。MC 只有 6 則評論；IMDb 8.6 是 38 季的總分，被後期季數拉低（ratings 檔沒有分季資料）。

## 6. Arcane 奧術

1. **Metacritic S1**：**tbd**。S1 季頁只有 2 則評論（「Available after 4 critic reviews」；頁面上第一個 `Metascore 90` 是其他推薦作品，不是本劇）。**整部劇（主頁）是 86（9 則）**：https://www.metacritic.com/tv/arcane/ （read）。季頁：https://www.metacritic.com/tv/arcane/season-1/ （read）
2. **IMDb**：**9.0/10**（461K）。https://www.imdb.com/title/tt11126994/ （read，Exa）
3. **豆瓣 S1**：**9.0**（**232,356** 人）。https://movie.douban.com/subject/34867871/ （cache，Exa 快取；頁首有「2025」年度榜連結，快照在 2025 年底之後）。2021 年 12 月時是 9.2（電影神搜劇評提到「豆瓣累積超過11萬用戶打出 9.2」，read）。
4. **英文評論**：The Atlantic，Jordan Calhoun，2021-12-17，〈Perfection Exists and Its Name Is 'Arcane'〉。https://www.theatlantic.com/newsletters/archive/2021/12/perfection-exists-and-its-name-is-arcane/676475/ （partial，Exa 只讀到前段；Groundlane 未試，post1 已確認 Atlantic 會回 Cloudflare 403）
   - 摘要：承認「成人動畫劇」和「改編自遊戲」這兩道門檻會讓人卻步，但他說忽略它是錯誤，推薦它是一份禮物。⚠ 這是 Atlantic 的電子報推薦文，不是正式的劇評專欄。
   - 原文：「Arcane is—and I do not say this lightly—perfect.」
5. **中文評論（台灣）**：電影神搜，潘光中，2021-12-22，〈【劇評】Netflix 動畫《奧術》：拜託拳頭社給每個英雄都出套起源三部曲！〉。https://news.agentm.tw/204969 （read，Groundlane `web_extract` 讀到作者、日期 meta 與內文）
   - 摘要：遊戲改編一直卡在「還原度」和「好懂」的兩難，《奧術》用九集、六小時的影集量體讓每個角色有完整動機，同時討好老玩家和一般觀眾。後半用精神分析解讀爆爆與吉茵珂絲，認為她們不是雙重人格，而是同一個創傷人格的兩面。⚠ 電影神搜不在指定名單內，但列為可用媒體。
6. **分歧**：評論與觀眾都極高（RT S1 100%／93%、豆瓣 9.0、IMDb 9.0）。S2 觀眾分數下滑（Popcorn 81%，factsheet），Wikipedia 也寫 S2 節奏評價分歧。Metacritic 的評論樣本很少（S1 只有 2 則）。

## 7. X-Men '97 X 戰警 '97

1. **Metacritic S1**：**82**（14 則）。https://www.metacritic.com/tv/x-men-97/season-1/ （read）
2. **IMDb**：**8.7/10**（61K）。https://www.imdb.com/title/tt16026746/ （read，Exa）
3. **豆瓣 S1**：**8.7**（**6,524** 人）。https://movie.douban.com/subject/35659891/ （cache，Exa 快取，快照日期不明）。較新的劇評頁側欄摘要是 8.7、7,067 人（snippet）。另：第 2 季 7.1（snippet，https://m.douban.com/movie/subject/36010991 ）。
4. **英文評論**：The Hollywood Reporter，Angie Han，2024-03-20，〈'X-Men '97' Review: Disney+'s Series Strikes a Winning Balance Between Fond Nostalgia and Fresh Pizzazz〉。https://www.hollywoodreporter.com/tv/tv-reviews/x-men-97-tv-review-1235854909/ （read，Groundlane；根據 10 集中的前 3 集）
   - 摘要：不必補 90 年代的設定就能看；政治隱喻有點模糊，但肥皂劇式的角色互動既真誠又有趣，沒有漫威真人片那種自我嘲諷。
   - 原文：「so vintage, it comes all the way back around to feeling fresh again」
5. **中文評論（台灣）**：電影神搜，龍貓大王通信，2024-03-14，〈【開箱】Disney+ 影集《X 戰警 '97》: 繼承 90 年代動畫傳奇，新世代動畫技術與風格優化後的升級版本〉。https://news.agentm.tw/275601/ （cache，Exa 回傳全文；根據前 3 集）
   - 摘要：直接接續 1997 年原作結局〈畢業日〉，保留片頭與原配音員，用電腦繪圖仿 90 年代手繪；X 教授之死讓團隊失去方針，劇情比原作複雜，分級也從 TV-7 升到 TV-14。結論是「傳承並優化之作」。⚠ 這是首播前的「開箱」文，不是看完整季的劇評。
6. **分歧**：S1 評論與觀眾一致（RT 99%／91%、MC 82、豆瓣 8.7）。**S2 觀眾明顯下滑**：RT Popcorn 76%、豆瓣 7.1，但 Tomatometer 仍有 98%（factsheet）。

## 8. Hacks 天后與草莓

1. **Metacritic S1**：**82**（24 則）。https://www.metacritic.com/tv/hacks/season-1/ （read）
2. **IMDb**：**8.3/10**（72K）。https://www.imdb.com/title/tt11815682/ （read，Exa）
3. **豆瓣 S1**：**分數未讀到**。Exa 快取的 subject 頁（https://movie.douban.com/subject/35445834/ ，cache）有星等分布（5 星 51.0%、4 星 39.4%、3 星 8.7%），但分數和人數那一段沒有被擷取；這頁「又名」欄確認台灣譯名「天后與草莓(台)」。另：第 2 季 9.4（snippet，https://m.douban.com/movie/subject/35524211 ）。
4. **英文評論**：Variety，Daniel D'Addario，2021-05-10，〈'Hacks' Review: Jean Smart Shines as Aging Comedian〉。https://variety.com/2021/tv/reviews/jean-smart-hacks-hannah-einbinder-hbo-max-review-1234967197/ （read，Groundlane；讀到大部分內文）
   - 摘要：Deborah 像 Joan Rivers 式的喜劇女王，劇集寫的是她「不安穩的統治」，而不是崛起；兩人關係既有溫度又有層次，對「酷」這件事的觀察特別犀利。
   - 原文：「Smart has a lead role worthy of her prodigious intellect and ferocious delivery」
5. **中文評論（台灣）**：**沒有找到指定媒體的署名劇評**。釀電影、關鍵評論網、鳴人堂、電影神搜只有得獎名單或上架新聞（例如電影神搜 2026 艾美獎入圍名單，snippet）。替代：Bella 儂儂 Yui 2025-05-23 的主演專訪（partial，https://www.bella.tw/articles/movies&culture/51848/hacks ），是訪談不是評論。
6. **分歧**：沒有明顯落差（RT S1 100%／89%、MC 82、IMDb 8.3）。IMDb 8.3 在本表偏低，可能和觀眾群較窄有關（推測，未查證）。

## 9. Curb Your Enthusiasm 人生如戲

1. **Metacritic S1**：**80**（20 則）。https://www.metacritic.com/tv/curb-your-enthusiasm/season-1/ （read）
2. **IMDb**：**8.8/10**（票數未讀到）。標題頁 Exa 兩次 LIVECRAWL_TIMEOUT、Tavily extract 失敗；數字取自 `candidates-ratings-viewing-buzz.md` 同日讀取的 IMDb Top 250（#69，read，間接）。
3. **豆瓣 S1**：**8.7**（人數不明）。https://m.douban.com/movie/subject/1428366 （snippet）
4. **英文評論**：Variety，Phil Gallo，2000-10-12，〈Curb Your Enthusiasm〉。https://variety.com/2000/tv/reviews/curb-your-enthusiasm-3-1200464815/ （read，Groundlane；根據前 4 集）
   - 摘要：Larry David 的角色自私、表裡不一、極度覺得自己應得一切，但每集結尾都有大爆笑；稱讚 HBO 願意開綠燈做這種不討好、靠「不從眾」吸引觀眾的角色研究。
   - 原文：「No one has created a funnier TV character this fall.」
5. **中文評論（台灣）**：**沒有找到指定媒體的署名劇評**。只找到個人部落格〈《人生如戲》 (Curb Your Enthusiasm)〉（艾莉正在爬格子，2026-03-26，cache，https://elliecat.blog/2026/03/26/%e3%80%8a%e4%ba%ba%e7%94%9f%e5%a6%82%e6%88%b2%e3%80%8b-curb-your-enthusiasm/ ），不符合條件。
6. **分歧**：一致偏高（MC 80、RT S1 89%／90%、IMDb 8.8、豆瓣 8.7）。補充：同期 NY Magazine 的 John Leonard（2000-10-16）給負評，說它「goes nowhere on purpose」（Exa highlight，cache）。

## 10. Ted Lasso 泰德拉索：錯棚教練趣事多

1. **Metacritic S1**：**71**（21 則）。https://www.metacritic.com/tv/ted-lasso/season-1/ （read）
2. **IMDb**：**8.7/10**（479K）。https://www.imdb.com/title/tt10986410/ （read，Exa）
3. **豆瓣 S1**：**9.0**（人數不明，豆瓣譯名《足球教练》）。https://m.douban.com/movie/subject/34843220 （snippet）。另：第 4 季 8.4（snippet，https://m.douban.com/movie/subject/37018941 ）。
4. **英文評論**：IndieWire，Ben Travers，2020-08-14，〈'Ted Lasso' Review: Jason Sudeikis' Sweet Spin on 'Major League' Is Downright Delightful〉。https://www.indiewire.com/criticism/shows/ted-lasso-review-jason-sudeikis-apple-tv-plus-1234579113/ （read，Exa；Groundlane 只抽到標題和副標）
   - 摘要：承認前提幾乎照抄 1989 年電影《大聯盟》，但把原本的蠢蛋廣告角色改寫成真誠樂觀的「好爸爸型」領袖，Sudeikis 讓這種樂觀可信，而不是漫畫化。
   - 原文：「the new light comedy from Apple TV+ that's… really, really good」
5. **中文評論（台灣）**：關鍵評論網，丁肇九，2021-12-08，〈【串流哈燒片】Apple TV+《泰德拉索》打破艾美獎紀錄，但隨便一位大叔就能當英超教練嗎？〉。https://www.thenewslens.com/article/159023 （partial，Exa highlights，含大部分內文）
   - 摘要：用足球實務檢驗劇情：現實中執教英超要有 UEFA Pro 級證照，Ted、Nate、Roy 的空降都不可能；也解釋 Manager 和各級教練的分工、降級對財務的衝擊。結論是細節可能讓資深球迷皺眉，「但仍不掩整部影集的精緻」。⚠ 這篇是從足球知識切入的專欄，不是完整劇評。
6. **分歧**：**Metacritic 71 偏低**，但 RT S1 92%、Popcorn 95%、豆瓣 9.0、IMDb 8.7。RT Consensus 也說它「not particularly hilarious」。最新 S4 觀眾冷掉：Popcorn 65%、豆瓣 8.4（factsheet）。

## 11. Shrinking 誠實診療室

1. **Metacritic S1**：**68**（34 則）。https://www.metacritic.com/tv/shrinking/season-1/ （read）
2. **IMDb**：**8.2/10**（134K）。https://www.imdb.com/title/tt15677150/ （read，Exa）
3. **豆瓣 S1**：**8.4**（人數不明，豆瓣譯名《诊疗中》）。https://m.douban.com/movie/subject/35745805 （snippet）
4. **英文評論**：The Guardian，Lucy Mangan，2023-01-27，〈Shrinking review – finally, Harrison Ford proves he can do TV comedy〉。https://www.theguardian.com/tv-and-radio/2023/jan/27/shrinking-review-harrison-ford-jason-segel-jessica-williams （read，Groundlane）
   - 摘要：第一集很糟，Jimmy 接近「討人厭」，但之後找到「稍微粗糙一點的《泰德拉索》」這個定位；Ford 乾冷的台詞是全劇的定錨，平衡了快要滿出來的煽情。
   - 原文：「The opening episode is, however, a clunker.」／「a slightly grittier Ted Lasso」
5. **中文評論（台灣）**：電影神搜，龍貓大王通信，2023-07-24，〈【劇評】《誠實診療室》: 內心創傷比病人還痛苦的心理諮商師，還有哈里遜福特，能給你溫暖微笑正能量的 Apple TV+ 影集〉。https://news.agentm.tw/260300 （read，Groundlane `web_extract` 讀到作者、日期與內文）
   - 摘要：多數心理諮商題材其實是偽裝成職人劇的推理劇，本劇的關鍵是「救人的諮詢師，才是全劇裡最需要被救的病人」；它刻意不往煽情或獵奇的方向走，整部劇本身就成了一個療傷空間。
6. **分歧**：**Metacritic 68 是本表最低之一**，但 RT S1 91%／89%、豆瓣 8.4、IMDb 8.2。評論普遍說「正面但不熱烈」，RT Consensus 也說它「darker ideas … than its earnest approach can often translate」。

## 12. The Studio 片廠風雲

1. **Metacritic S1**：**80**（42 則）。https://www.metacritic.com/tv/the-studio/season-1/ （read）
2. **IMDb**：**8.0/10**（72K）。https://www.imdb.com/title/tt23649128/ （read，Exa）
3. **豆瓣 S1**：**8.6**（人數不明）。數字來自豆瓣影評〈奥斯卡大导演被好莱坞气哭了，这部8.6分的新剧…〉（2025-04-15，cache：https://movie.douban.com/review/16661339/ ）與〈2025年度最佳讽刺美剧选出来了！〉（snippet：https://m.douban.com/movie/review/16670876 ）的正文；subject 頁沒讀到，ID 不明。豆瓣譯名《片厂风云》。
4. **英文評論**：The Hollywood Reporter，Angie Han，2025-03-08，〈'The Studio' Review: Seth Rogen's Apple TV+ Hollywood Comedy Is So Hilarious It Hurts〉。https://www.hollywoodreporter.com/tv/tv-reviews/the-studio-review-seth-rogen-apple-tv-1236158297/ （read，Groundlane）
   - 摘要：說它的尷尬喜劇讓人坐立難安，長鏡頭拍法把觀眾直接拖進主角的恐慌發作；不是每個人都受得了，也不適合當背景播放。
   - 原文：「this is a strong contender for the best new comedy of 2025」
5. **中文評論（台灣，媒體待商榷）**：PAR 表演藝術雜誌（國家表演藝術中心），簡莉穎（劇作家）專欄「關於戲劇的五四三」，2025-08-04，〈《片廠風雲》、《日落大道》、《Sunset Blvd.》的選角〉。https://par.npac-ntch.org/article/tag/1754278701122024 （partial，Exa highlights，只讀到談《片廠風雲》的前段）
   - 摘要：稱讚節奏緊湊、諷刺連發、一鏡到底的喜劇設計機智，找真實好萊塢編導演自己，「內行外行的門道熱鬧都顧到了」；她在皮克斯工作的朋友說「一切都太真實了」。⚠ PAR 不在指定名單，而且這是專欄隨筆，後半談的是《日落大道》。指定媒體裡只找到關鍵評論網、電影神搜的上架新聞與艾美獎名單。
6. **分歧**：**評論高、觀眾低**：RT 92% 但 Popcornmeter 77%（factsheet），IMDb 8.0 在本表偏低；MC 80、豆瓣 8.6。可能和「好萊塢內行梗」的門檻有關（推測）。

---

## 總表

| 劇 | Metacritic S1（評論數） | IMDb（票數） | 豆瓣 S1（人數） | 英文評論 | 中文評論（地區） |
|---|---|---|---|---|---|
| 瑞克和莫蒂 | 85（8） | 9.0（718K） | 9.7（不明）snippet | Vulture | 釀電影 香功堂主（台） |
| 馬男波傑克 | 59（13） | 8.8（241K） | 9.2（不明）snippet | Slate | 關鍵評論網 傅紀鋼（台） |
| 常見副作用 | 80（6） | 8.5（23K） | 8.6（不明）cache | Los Angeles Times | 無（缺口） |
| 南方四賤客 | 64（17） | 8.7（453K） | 無可用來源 | Variety | 關鍵評論網 傅紀鋼（台，評 S23） |
| 辛普森家庭 | 80（6） | 8.6（475K） | 9.1（25,489）cache | Los Angeles Times | 轉角國際 林齊晧（台，⚠） |
| 奧術 | tbd（2）；全劇 86（9） | 9.0（461K） | 9.0（232,356）cache | The Atlantic（partial） | 電影神搜 潘光中（台） |
| X 戰警 '97 | 82（14） | 8.7（61K） | 8.7（6,524）cache | The Hollywood Reporter | 電影神搜 龍貓大王通信（台，開箱） |
| 天后與草莓 | 82（24） | 8.3（72K） | 未讀到 | Variety | 無（缺口） |
| 人生如戲 | 80（20） | 8.8（不明，Top 250 間接） | 8.7（不明）snippet | Variety | 無（缺口） |
| 泰德拉索 | 71（21） | 8.7（479K） | 9.0（不明）snippet | IndieWire | 關鍵評論網 丁肇九（台，⚠ 專欄） |
| 誠實診療室 | 68（34） | 8.2（134K） | 8.4（不明）snippet | The Guardian | 電影神搜 龍貓大王通信（台） |
| 片廠風雲 | 80（42） | 8.0（72K） | 8.6（不明）cache／snippet | The Hollywood Reporter | PAR 簡莉穎（台，⚠） |

英文媒體分布（每家最多 3 部）：Variety 3、The Hollywood Reporter 2、Los Angeles Times 2、Vulture 1、Slate 1、The Atlantic 1、IndieWire 1、The Guardian 1。NYT、The New Yorker、Telegraph、BBC 沒有用到（見缺口）。

中文媒體分布：電影神搜 4（龍貓大王通信 2）、關鍵評論網 3（傅紀鋼 2）、釀電影 1、轉角國際 1、PAR 1；缺 3 部。

## 重點分歧（給寫作參考）

1. **評論低、觀眾高**：《馬男波傑克》（MC S1 59／RT 71% vs Popcorn 90%、豆瓣 9.2）最明顯，評論界後來翻盤（S6 RT 96%）。《泰德拉索》（MC 71 vs Popcorn 95%、豆瓣 9.0）、《誠實診療室》（MC 68 vs RT 91%）也是「評論正面但給分不高」。
2. **評論高、觀眾低**：《片廠風雲》（RT 92% vs Popcorn 77%、IMDb 8.0）。
3. **後期季數觀眾冷掉**：《泰德拉索》S4 Popcorn 65%、豆瓣 8.4；《X 戰警 '97》S2 Popcorn 76%、豆瓣 7.1；《奧術》S2 Popcorn 81%。這三部的 Tomatometer 都還在 90% 以上。
4. **長壽劇 S1 和整體評價要分開講**：《南方四賤客》S1 MC 64、RT 71%，首播時有 THR／WaPo 負評；《辛普森家庭》S1 評價很好，但 IMDb 是 38 季總分。
5. **Metacritic 樣本很小**：《常見副作用》6 則、《辛普森家庭》6 則、《瑞克和莫蒂》8 則、《奧術》S1 只有 2 則（tbd）。寫文時建議以 RT 為主，Metacritic 只當參考。

## 缺口

1. **中文評論缺 3 部**：《常見副作用》《天后與草莓》《人生如戲》在釀電影、關鍵評論網、鳴人堂、電影神搜、放映週報、端傳媒、報導者都沒有搜到署名劇評。另有 3 部用的是名單外或非正式劇評：《辛普森家庭》（轉角國際，文化介紹文）、《片廠風雲》（PAR 專欄隨筆）、《泰德拉索》（關鍵評論網足球知識專欄）。建議人工再找 Openbook、方格子付費作者，或接受「台灣評論缺席」的事實。
2. **中文評論評的季數不一**：《南方四賤客》評 S23 單集、《馬男波傑克》評完結篇、《瑞克和莫蒂》評到 S4；《X 戰警 '97》是首播前根據 3 集的開箱文。
3. **中文評論日期**：釀電影《瑞克和莫蒂》與關鍵評論網《馬男波傑克》完結篇的日期，頁面上沒讀到。前者用網址 ObjectId 推算（約 2020-06-30），後者只能推定 2020 年初。
4. **豆瓣**：沒有一部讀到 subject 頁的即時資料（不繞過 `sec.douban.com`）。人數只有 4 部（Simpsons、Arcane、X-Men 是 cache；常見副作用沒有人數）。《南方四賤客》S1 沒有任何可用來源；《天后與草莓》S1 快取頁沒擷取到分數；《片廠風雲》subject ID 不明，分數只來自豆瓣影評正文。
5. **IMDb**：《人生如戲》標題頁讀不到，分數來自同日 Top 250（沒有票數）。
6. **英文評論**：《奧術》用的是 Atlantic 電子報推薦文，只讀到前段；MC 上 Arcane 沒有 Big-outlet 的 S1 評論連結。NYT（Simpsons 1990、Common Side Effects 2025、Shrinking 2023）都只能讀到付費牆前，沒有採用。
7. **Metacritic slug**：Rick and Morty 是 `rick-morty`，不是 `rick-and-morty`；Arcane S1 季頁的第一個 Metascore 屬於推薦欄位的其他作品，抓取時要小心。

## 工具降級紀錄（toolDegradation）

- Metacritic：Groundlane `web_extract`（render=never），12/12 讀到頁面。`rick-and-morty` 404 → Tavily search 找到正確 slug `rick-morty`。Arcane S1 季頁為 tbd → 改讀主頁。
- IMDb：Exa `web_fetch_exa`（11 部成功）；Curb 兩次 CRAWL_LIVECRAWL_TIMEOUT → Tavily extract「Failed to fetch」→ 改用 ratings 檔的 Top 250 讀值。
- 豆瓣：沒有直抓（post1 已記錄 `sec.douban.com` 驗證頁，不繞過）。Exa `web_fetch_exa` 讀到 4 頁快取（Arcane、Simpsons、X-Men、常見副作用，另 Hacks 部分）；m.douban 與部分 movie.douban 回 CRAWL_HTTP_403 或 CRAWL_TIMEOUT → Tavily search（include_domains=douban.com）摘要。
- 英文評論：Groundlane `web_fetch` 讀到 Vulture、Slate、LA Times（2 篇）、THR（2 篇）、Variety（3 篇）、Guardian。IndieWire 用 Groundlane 只抽到標題 → Exa。The Atlantic、NYT 沒有用 Groundlane 重試（post1 已記錄 403），改用 Exa，只讀到前段。1997、2000 年的舊評論用 Exa search 找到。
- 中文評論：Tavily search 在後段回 429（rate limit）→ 改用 Groundlane `web_search`（domains 篩選）與 Exa search。關鍵評論網用 Tavily extract 讀到 1 篇全文；其他兩篇是 Exa highlights。電影神搜作者頁 `news.agentm.tw/author/...` 回 5 KB 空頁（疑似擋爬，未繞過）→ 改用 Exa search 找文章網址。
- Firecrawl、cloudflare `get_url_markdown`、linkup 沒有用到。
