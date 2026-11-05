# Post 2b 評價資料表：美劇 12 部（Metacritic／IMDb／豆瓣／英文評論／中文評論）

研究日期：2026-11-05。RT 分數已在 `factsheets-post2b.md`，這裡不重抓，只在「分歧」欄引用。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態標記 |
|---|---|---|---|
| Metacritic S1 Metascore＋評論數 | `metacritic.com/tv/<slug>/season-1/`，抓 `title="Metascore N out of 100"` 和 `See All N Critic Reviews` | Groundlane `web_extract`（render=never） | 12/12 read |
| IMDb 用戶評分（**整部劇**，非單季） | `imdb.com/title/<id>/` 標題列 `IMDb RATING x.x/10 N` | Exa `web_fetch_exa`（maxCharacters 700–900） | 12/12 read |
| 豆瓣 S1 評分 | 豆瓣 subject 頁沒有直抓（post1 已確認會被導到 `sec.douban.com` 驗證頁，不繞過）。改用 Exa 搜尋：豆瓣自己的快取頁（豆列、廣播、subject 頁，標 **cache**）、新聞報導（標 **news**）、第三方鏡像站與百度摘要（標 **snippet**） | Exa `web_search_exa` | 3 cache、1 news、8 snippet |
| 英文評論 | 依各劇 Metacritic 評論名單與 Exa 搜尋選出 → 讀原文 | Groundlane `web_fetch`（12/12 打開原頁，確認標題、署名、日期）＋Exa 搜尋回傳的內文 | 12 read（其中 3 篇引句取自 Exa 內文，見各條） |
| 中文評論 | 台灣指定媒體優先（釀電影、關鍵評論網、鳴人堂、電影神搜、放映週報、端傳媒、報導者） | Groundlane `web_search`（domains 限定上述網站）、Exa、Tavily search（include_domains）；讀全文用 Groundlane `web_fetch` | 7 部找到（6 read、1 partial）；5 部沒有找到指定媒體的署名劇評 |

標記說明：**read** = 工具實際讀到頁面內文；**partial** = 只讀到前段或只看到搜尋回傳的段落；**cache** = 搜尋引擎快取副本（非即時）；**news** = 可信新聞報導引述的數字；**snippet** = 只看到搜尋摘要或第三方轉錄，不算讀到原頁。

> 注意：IMDb 是整部劇的總評分，Metacritic 與豆瓣是第 1 季。多季劇（Homeland 8 季、Reacher 4 季、Diplomat 4 季、Night Agent 3 季）比較時不能直接對齊。

---

## 1. Homeland 反恐危機

1. **Metacritic S1**：**92**（28 則；28 則全為正面，0 褒貶、0 負面）。https://www.metacritic.com/tv/homeland/season-1/ （read）
2. **IMDb**：**8.3/10**（390K）。https://www.imdb.com/title/tt1796960/ （read，Exa；頁面另顯示「S1 Episodes 8.2 Average」）
3. **豆瓣 S1**：**8.4**（**70,784** 人，豆列「美国动作犯罪电视剧系列」摘要，豆列留言日期 2026-02）。https://www.douban.com/doulist/154102929/ （snippet）。另一個鏡像站 easyoo 顯示 8.4、291,296 人（snippet，人數兩來源不一致，未採用）。subject ID 未取得。
4. **英文評論**：Los Angeles Times，Mary McNamara，2011-09-30，〈Television review: 'Homeland'〉。https://www.latimes.com/entertainment/tv/la-xpm-2011-sep-30-la-et-homeland-review-20110930-story.html （read，Groundlane）
   - 摘要：她認為這是當季最好的新劇，也是第一部把後 911 故事說好的作品；製作群雖然來自《24 反恐任務》，但這部劇更直接、更以角色為核心，兩位主角的演出好到「像天空有兩個太陽」。她也挑出副局長角色單薄等小缺點。
   - 原文：「politically resonant, emotionally wrenching and plain old thrilling to watch」
5. **中文評論（台灣，媒體待商榷）**：報導者，何榮幸，2019-02-02，〈10部英美劇的視野：媒體、政治、情報戰〉。https://www.twreporter.org/a/lunar-new-year-2019-drama-series-press-politics-action （read：Groundlane `web_extract` 讀到 Homeland 段落開頭「談到中情局CIA，你怎麼能不看《反恐危機》？」，全文與署名由 Groundlane 搜尋回傳的頁面內容確認）
   - 摘要：《反恐危機》讓遙遠的中東反恐戰爭「就在眼前」，撐起全劇的是 Claire Danes 的演技，讓 CIA 的危機處理充滿人性掙扎；他認為這部劇每季都能維持水準、推陳出新，比《指定倖存者》穩。⚠ 這是過年片單文，不是單劇專評；作者自稱「並非影劇專業人士的內行評價」，是資深記者的觀劇心得。替代來源（香港）：端傳媒〈《國土安全》第七季：理想主義愛國者，如今只能在熒幕上尋覓〉，2018-05-15，https://theinitium.com/20180515-opinion-lijiajia-homeland-patriot （snippet，付費牆，評的是第 7 季）。
6. **分歧**：本表**評論與觀眾最一致、分數最高**的一部（MC 92、RT 100%、Popcorn 93%、IMDb 8.3、豆瓣 8.4）。IMDb 是 8 季總分，中後段（第 3 季前後）口碑有起伏，LA Times 2014 年的評論也寫到「its troubled third」季，寫文時可註明「前兩季口碑最好」（Wikipedia 導言：「its first two seasons gaining near-universal praise」）。

## 2. The Diplomat 頭號外交官

1. **Metacritic S1**：**74**（23 則）。https://www.metacritic.com/tv/the-diplomat-2023/season-1/ （read；slug 是 `the-diplomat-2023`，`the-diplomat` 是 404）
2. **IMDb**：**8.1/10**（108K）。https://www.imdb.com/title/tt17491088/ （read，Exa）
3. **豆瓣 S1**：**7.6**（人數不明）。來源是百度搜尋結果中的豆瓣卡片「头号外交官 第一季 - 电视剧 - 豆瓣 … 7.6」與鏡像站 mxgxt（2025-08-14，7.6，五星 20.1%、四星 45.5%）。https://m.mxgxt.com/news/view/1679200 （snippet）。較早的部落格寫 7.5（2023-11、2024-05，snippet）。subject ID 未取得。
4. **英文評論**：The Guardian，Lucy Mangan，2023-04-20，〈The Diplomat review – this political drama's star is as great as Martin Sheen in The West Wing〉。https://www.theguardian.com/tv-and-radio/2023/apr/20/the-diplomat-review-this-political-dramas-star-is-as-great-as-martin-sheen-in-the-west-wing （read，Groundlane 全文）
   - 摘要：劇本本身比《美國諜夢》粗糙，但 Keri Russell 演得甚至更好，把一個被規矩綁住、又被要求「打扮漂亮」的女大使演得真實，避開所有刻板印象；全劇最豐富的部分是她和丈夫那段「過了巔峰但沒毀掉」的婚姻。
   - 原文：「After a slightly turgid opening episode, The Diplomat becomes a hugely enjoyable ride」
5. **中文評論（台灣）**：鳴人堂（聯合新聞網），彭紹宇，2023-05-31，〈沒有煙硝的「關係戰場」：美劇《頭號外交官》揭示國家利益與婚姻困境〉。https://opinion.udn.com/opinion/story/120973/7202173 （read，Groundlane）
   - 摘要：他認為本劇在台灣的話題不如歐美，但很適合關心國際時事的觀眾；表面談外交，其實寫各種「關係」——英美特殊關係、大國不再的狼狽，以及主角名存實亡的婚姻；也點出女性外交官被期待「活潑又優雅」的服裝政治。評的是第 1 季。
6. **分歧**：S1 評論（RT 84%、MC 74）高於觀眾（Popcorn 61%），但 IMDb 總分 8.1，後面幾季觀眾分數上升（S4 Popcorn 87%，見 factsheet）。**口碑隨季數變好**的例子。豆瓣 7.6 明顯低於 IMDb 8.1。

## 3. Zero Day 零日風暴

1. **Metacritic S1**：**52**（39 則）。https://www.metacritic.com/tv/zero-day/season-1/ （read）
2. **IMDb**：**7.0/10**（67K）。https://www.imdb.com/title/tt23872886/ （read，Exa）
3. **豆瓣**：**7.4**（人數不明；鏡像站 dyoo 標「48744人評分，更新 2026-08-03」，可能是 IMDb 人數，未採用）。百度搜尋卡片「零日风暴 (豆瓣) … 7.4」。https://dyoo.com/tv/9n4N （snippet）。另一聚合站 ysdb 寫 7.3（snippet）。
4. **英文評論**：The Hollywood Reporter，Daniel Fienberg，2025-02-20，〈'Zero Day' Review: Robert De Niro and a Tremendous Supporting Cast Are Wasted in Netflix's Self-Serious Political Thriller〉。https://www.hollywoodreporter.com/tv/tv-reviews/zero-day-review-robert-de-niro-netflix-1236141441/ （read，Groundlane＋Exa 全文）
   - 摘要：卡司太強所以還看得下去，但劇本自以為比實際聰明：故事既想影射現實又不肯碰任何具體政治，節奏怪、角色弧線薄，De Niro 像沒在跟任何人對戲。他另外說 Netflix 同類政治驚悚中《頭號外交官》最好。
   - 原文：「wastes an undeniably spectacular cast on a fundamentally silly and unrealistic story」
5. **中文評論（台灣）**：電影神搜，艾米希莉 Amesily，2025-02-24，〈【劇評】Netflix《零日風暴》：空有重量級卡司陣容，卻雷聲大雨點小的政治劇〉。https://news.agentm.tw/328659 （read，Groundlane）
   - 摘要：她肯定題材呼應現實——網路戰隱憂、高齡政治、網紅散播謠言、侵蝕公民自由——但劇情鋪陳枯燥、支線與主軸連結牽強「像一盤散沙」，角色表情少、壓抑，白白浪費黃金陣容，認為比起迷你劇更適合拍成電影。⚠ 電影神搜在指定名單內；作者是該站編輯群。
6. **分歧**：**評論普遍偏負面**（MC 52、RT 53%），觀眾也不熱（Popcorn 53%、IMDb 7.0），但收視很高（Netflix H1 2025 #4、61.3M）。評論界內部也分裂：Gold Derby 整理指 Guardian 的 Lucy Mangan 給 80 分、稱「an astonishing amount of fun」，THR、Variety 則是負評（snippet，Gold Derby 2025-02-20）。豆瓣 7.4 反而高於 IMDb 7.0。

## 4. Paradise 極樂凶間

1. **Metacritic S1**：**69**（36 則）。https://www.metacritic.com/tv/paradise-2025/season-1/ （read；slug 是 `paradise-2025`）
2. **IMDb**：**7.9/10**（93K）。https://www.imdb.com/title/tt27444205/ （read，Exa；頁面另顯示「S1 Episodes 8.1 Average」）
3. **豆瓣 S1**：**6.7**（**1,065** 人）。https://m.douban.com/movie/subject/36350234/ （cache：Exa 快取的 subject 頁，抓取時間顯示 2025-01-28，**是開播當週的數字，已過時**）。聚合站 ysdb 顯示目前約 7.2（snippet，人數不明）。
4. **英文評論**：Variety，Alison Herman，2025-01-26（美西時間；頁面 UTC 2025-01-27），〈Sterling K. Brown's 'Paradise' Is a Twisty Thriller That Still Puts Feelings First: TV Review〉。https://variety.com/2025/tv/tv-reviews/paradise-review-sterling-k-brown-hulu-1236283549/ （read，Groundlane＋Exa）
   - 摘要：她一直覺得 Fogelman 在《This Is Us》用懸念是「為驚喜而藏資訊」，但這次換到驚悚類型就對了；不斷揭曉的轉折讓人上癮，只是劇集對「天堂」這個社會實驗本身的細節不太在意，更像人物劇而不是科幻劇。（評論者看了 8 集中的 7 集。）
   - 原文：「the steady beat of shoes dropping makes for a propulsive, addicting watch」
5. **中文評論**：**指定媒體沒有找到署名劇評**（Groundlane、Exa、Tavily 在釀電影、關鍵評論網、鳴人堂、電影神搜、放映週報、端傳媒、報導者都只搜到艾美獎入圍名單）。替代（非指定媒體，⚠）：個人部落格 Vanny's Note，馬大文，2025-04-23，〈不只是末日劇，這次，和之前不一樣——《極樂凶間》〉，https://vannyma.com/posts/not-just-apocalypse-drama/ （partial，Exa highlights）；她把它列為當年前三名，特別稱讚 James Marsden 的總統與第 7 集。
6. **分歧**：RT 86% 但 MC 只有 69，屬於「正面但不熱烈」。觀眾（Popcorn 85%、IMDb 7.9）與評論接近。豆瓣開播週只有 6.7（樣本千人），是本表少數**豆瓣明顯低於 IMDb** 的劇，但數字可能已變動。

## 5. The Night Agent 暗夜情報員

1. **Metacritic S1**：**69**（14 則）。https://www.metacritic.com/tv/the-night-agent/season-1/ （read）
2. **IMDb**：**7.4/10**（166K）。https://www.imdb.com/title/tt13918776/ （read，Exa）
3. **豆瓣 S1**：**7.6**（人數不明）。聚合站 ysdb「豆瓣 7.6/10」（https://www.ysdb.cc/titles/1239850 ，snippet）；奈飛推薦網 2024-12-17 文章也寫豆瓣 7.6（snippet）。豆瓣影評頁 2023-04-04 的一篇轉述「豆瓣评分也只有7.3分」（開播時）。subject：https://movie.douban.com/subject/35558659/ （ID 取自影評頁網址）
4. **英文評論**：Los Angeles Times，Robert Lloyd，2023-03-23，〈'The Night Agent' and 'Agent Elvis': A double dose of spies〉。https://www.latimes.com/entertainment-arts/tv/story/2023-03-23/the-night-agent-netflix-agent-elvis-review （read，Groundlane；與動畫《Agent Elvis》合評）
   - 摘要：典型陰謀驚悚，「不特別、也不糟」，正是很多人想看的電視；角色都很套路，靠兩位主角的親和力撐住一連串追逐與槍戰，但十集篇幅開始重複，幕後動機揭曉時顯得很「meh」。
   - 原文：「no worse than workmanlike but, also, workmanlike」
5. **中文評論（台灣）**：電影神搜，艾米希莉 Amesily，2024-01-03，〈【年度回顧】Netflix《暗夜情報員》第一季劇評：爆紅不是沒有原因的〉。https://news.agentm.tw/271124 （read，Groundlane 全文）
   - 摘要：題材沒有創新、都是典型套路，但劇情緊湊、動作戲有誠意，主角搭檔有魅力，反派與內鬼的心理攻防讓人疑神疑鬼，十集「體感不長」、每集懸念都讓人想追完；她也提到首播在台灣排行榜空降。
6. **分歧**：**評論中等、收視極高**的代表：MC 69、RT 74%，但 Nielsen 2023 年串流原創第 2 名（factsheet）。英文與中文評論的判斷其實一致（套路但好追），差在評價高低。S2 Popcorn 只有 40%（候選檔），觀眾對續集反應差。

## 6. Reacher 神隱任務

1. **Metacritic S1**：**69**（19 則）。https://www.metacritic.com/tv/reacher/season-1/ （read）
2. **IMDb**：**8.0/10**（328K）。https://www.imdb.com/title/tt9288030/ （read，Exa）
3. **豆瓣 S1**：**8.1**（**26,085** 人，豆列「侠探杰克剧版」摘要）。https://www.douban.com/doulist/164636516/ （snippet）。百度摘要另寫「约有 24947 人参与评分，数据更新至 2026 年 2 月」（snippet）。subject：https://movie.douban.com/subject/30378897/ （ID 取自影評頁網址；豆瓣譯名《侠探杰克》）
4. **英文評論**：Variety，Joshua Alston，2022-02-03，〈'Reacher' Is a Brutal Thriller With a Void at its Center: TV Review〉。https://variety.com/2022/tv/reviews/reacher-amazon-prime-video-1235171424/ （read，Groundlane＋Exa）
   - 摘要：Ritchson 的選角「近乎奇蹟」，打鬥場面精彩；但 Reacher 這個角色本來就是一出場就完整、沒什麼內在變化，撐一部連續八小時的劇太勉強，劇集永遠不會比主角本人有趣。
   - 原文：「a serialized eight-hour series might be too much real estate」
5. **中文評論（台灣）**：電影神搜，龍貓大王通信，2025-03-27，〈Prime Video 影集《神隱任務》第三季：真正爽劇再登高峰，最強神探孤身挑戰臥底任務〉。https://news.agentm.tw/331223 （read，Groundlane）
   - 摘要：他認為在每年上百部刑偵劇的神探裡，李奇是最優秀的一位；第三季沒有陷入公式化，開場二十分鐘連續三個爆點，節奏與「製造屍體」的速度都更快，結論是「必追不可」。⚠ 評的是**第 3 季**，不是 S1；龍貓大王通信是台灣資深影評部落客。
6. **分歧**：**評論低、觀眾高**：MC 69（19 則），但 RT 92%、Popcorn 91%、IMDb 8.0、豆瓣 8.1。英文評論挑的是結構問題（Variety），中文評論看的是爽度，立場不同。後期觀眾分數下滑（S4 Popcorn 64%，factsheet）。

## 7. The Beast in Me 獸藏我心

1. **Metacritic S1**：**71**（29 則）。https://www.metacritic.com/tv/the-beast-in-me/season-1/ （read）
2. **IMDb**：**7.4/10**（85K）。https://www.imdb.com/title/tt31974367/ （read，Exa）
3. **豆瓣**：**7.4**（**4,659** 人，資源站 yuanpan 轉錄，2026-06-04）。https://www.yuanpan.cc/25906.html （snippet；另一鏡像站 dyoo 標 49,463 人，疑為 IMDb 人數，未採用）。subject：https://movie.douban.com/subject/36832958/ （ID 取自轉錄與影評頁網址）
4. **英文評論**：The Guardian，Lucy Mangan，2025-11-13，〈The Beast in Me review – Claire Danes's astonishing new thriller is instant top–tier TV〉。https://www.theguardian.com/tv-and-radio/2025/nov/13/the-beast-in-me-review-claire-danes-thriller-netflix （read，Groundlane 全文）
   - 摘要：她很驚訝這是主創 Gabe Rotter 第一部大型影視作品，劇本的風格與自信本身就很美；加上 Danes 與 Rhys 兩人的對手戲，這部八集心理驚悚就是頂級電視，「獎一定會來」。
   - 原文：「this clever, taut eight-part psychological thriller moves seamlessly into top-tier television」
5. **中文評論**：**指定媒體沒有找到署名劇評**（電影神搜只有艾美獎新聞）。替代（⚠，非指定媒體、未署真名）：台灣部落格「Netflix追劇筆記本」2025-11-14 評價文（https://screenpotatoes.com/2025/11/14/the-beast-in-me/ ，partial）；Mobile01 用戶「盲狙先生」2025-12-05（https://www.mobile01.com/topicdetail.php?f=421&t=7201172 ，partial）。中國大陸有鳳凰網評論〈奈飞热剧《兽藏我心》：富豪杀人案噱头下，对人性的苍白探讨〉（2025-11-24，https://na.ifeng.com/c/8oXLCP4EZFo ，partial，未署名）。
6. **分歧**：**英文評論界嚴重分裂**：Guardian 盛讚「top-tier」，THR 的 Daniel Fienberg 標題直接寫「an Exercise in Prestige TV Monotony」（Exa highlight，snippet），Variety 說它是《The Jinx》翻版、角色研究失衡（Exa，snippet）。MC 71 反映這個分裂；RT 85%。Matthew Rhys 後來拿下 Emmy（factsheet）。IMDb 7.4 與豆瓣 7.4 一致。

## 8. Untamed 荒境狂途

1. **Metacritic S1**：**62**（24 則）。https://www.metacritic.com/tv/untamed/season-1/ （read；頁面有 Eric Bana，確認是這部）
2. **IMDb**：**7.1/10**（75K）。https://www.imdb.com/title/tt31710822/ （read，Exa）
3. **豆瓣 S1**：**7.2**（**6,733** 人，鏡像站 miniyingshi）。https://www.miniyingshi.com/tv/Yb3KBu （snippet）。豆瓣上一篇 2025-08-12 的劇評內文寫「IMDb7.2分，豆瓣7.3分」（https://m.douban.com/movie/review/16960643/ ，cache）。subject ID 未取得。
4. **英文評論**：Vulture，Roxana Hadadi，2025-07-17，〈'Untamed' on Netflix Has a Killer Opening—Don't Fall for It〉。https://www.vulture.com/article/untamed-review-netflix-eric-bana-yosemite-series.html （read：Groundlane 讀到標題、署名、日期與開頭；引句取自 Exa 回傳的內文）
   - 摘要：開場屍體墜落 El Capitan 那一幕很震撼，但之後就是一堆警匪劇老套；故事幾乎可以設在任何地方，對美國公有地與自然沒有觀點，而且顯然不是在優勝美地拍的。她也認為 Bana 演脆弱的部分不夠可信。
   - 原文：「The series' first scene is a banger, and it's all downhill from there.」
5. **中文評論**：**指定媒體沒有找到署名劇評**。替代（⚠，中國大陸）：豆瓣劇評〈收视登顶！近期必看悬疑王炸〉，作者「软饼干」，2025-08-12，https://m.douban.com/movie/review/16960643/ （cache），認為完成度不錯、風景美，但節奏不快，追求爽劇的觀眾要降低期待。
6. **分歧**：**評論分裂、觀眾冷淡、收視超高**：Vulture 與 IndieWire（Ben Travers：「too often sacrifices what makes it unique」，Exa snippet）偏負面，Variety（Aramide Tinubu 稱「a brilliant detective tale」，Exa snippet）大讚並列入年度十大。MC 62 是本表第二低，RT 83%；但 Netflix H2 2025 第 3 名、92.8M 觀看（factsheet）。

## 9. All Her Fault 都是她的錯

1. **Metacritic S1**：**63**（18 則）。https://www.metacritic.com/tv/all-her-fault/season-1/ （read）
2. **IMDb**：**7.5/10**（53K）。https://www.imdb.com/title/tt31314751/ （read，Exa）
3. **豆瓣**：**9.1**（**近 15 萬人**），出自澎湃新聞〈豆瓣9.1，好久没看过这么高开疯走的美剧了〉，2025-12-15。https://m.thepaper.cn/newsDetail_forward_32175529 （news，Exa highlight）。開播時豆瓣影評引「1.8万人打分9.2」（2025-11-16，https://movie.douban.com/review/17203952/ ，cache）；鏡像站 wmdb 顯示 9.2、42,355 票（snippet）。subject ID 未取得。
4. **英文評論**：The Hollywood Reporter，Angie Han，2025-11-05，〈'All Her Fault' Review: Sarah Snook, Dakota Fanning and Jake Lacy Anchor Peacock's Satisfying Domestic Mystery〉。https://www.hollywoodreporter.com/tv/tv-reviews/all-her-fault-review-peacock-sarah-snook-jake-lacy-1236414777/ （read，Groundlane＋Exa）
   - 摘要：雖然還不到《美麗心計》那種頂級家庭驚悚的水準，但轉折聰明，對母職愧疚、父權傲慢、保護與控制的界線觀察銳利；Snook 演出強烈情緒卻不顯做作。缺點是配角像是為了討論議題而存在。
   - 原文（Bottom Line）：「Solidly constructed, sharply observed.」
5. **中文評論（台灣，媒體待商榷）**：Harper's BAZAAR Taiwan，Charlie Lee，2025-12-03，〈《都是她的錯》結局寫下女性無法逃離的現實：小孩不見，社會卻先質問母親？〉。https://www.harpersbazaar.com/tw/culture/a69589826/all-her-fault/ （partial，Exa highlights）
   - 摘要：片名乍看在怪罪女人，整部劇其實在說錯從來不是一個人的；它把母職、婚姻、事業的社會期待變成懸疑核心，Marissa 與 Jenny 的對手戲是亮點。⚠ 時尚雜誌、編輯署名，偏介紹，不在指定名單內；指定媒體沒有找到署名劇評。替代（香港）：虛詞，葉紫婷，2026-01-16，〈《都是她的錯》：到底是誰的錯？〉，https://p-articles.com/critics/5742.html （partial）。
6. **分歧**：**本表豆瓣與西方落差最大**：豆瓣 9.1（近 15 萬人），IMDb 7.5，MC 只有 63（18 則）。英文評論也分裂：Vulture 的 Roxana Hadadi 稱它「a misandrist masterpiece」（Exa，snippet），Variety 的 Alison Herman 則說「laboriously paced, clunkily plotted」（Exa，snippet）。RT 80%、Popcorn 74%。

## 10. The Hunting Wives 獵豔嬌妻

1. **Metacritic S1**：**73**（12 則）。https://www.metacritic.com/tv/the-hunting-wives/season-1/ （read；12 則是本表最少）
2. **IMDb**：**6.8/10**（21K）。https://www.imdb.com/title/tt31038430/ （read，Exa）。**本表 IMDb 最低。**
3. **豆瓣 S1**：**7.2**（人數不明）。豆瓣用戶廣播頁快取（2026-02-19）顯示「狩猎之妻 第一季 … 7.2」。https://www.douban.com/people/66328593/status/8034088424/ （cache）。2025-09 的文章寫 7.1（snippet）。subject：https://movie.douban.com/subject/36587788/ （ID 取自短評頁網址；豆瓣譯名《狩猎之妻》）
4. **英文評論**：The Hollywood Reporter，Angie Han，2025-07-20，〈'The Hunting Wives' Review: Malin Akerman and Brittany Snow Get Hot and Bothered in Netflix's Deliciously Trashy Drama〉。https://www.hollywoodreporter.com/tv/tv-reviews/the-hunting-wives-review-brittany-snow-netflix-1236319841/ （read，Groundlane）
   - 摘要：這部劇永遠把香豔場面放在合理劇情前面、把爽快轉折放在深刻情感前面，Akerman 演得極盡誘惑；要拍出這麼「好看的蠢」其實需要很多聰明。（評論者只看了 8 集中的 3 集。）
   - 原文：「It might all be incredibly frustrating, if it were not also so wildly entertaining.」
5. **中文評論**：**指定媒體沒有找到署名劇評**。台灣只找到 PTT EAseries 心得文（2025-10-13，https://www.ptt.cc/bbs/EAseries/M.1760362331.A.55D.html ，snippet）與部落格「Netflix追劇筆記本」（2025-10-12，partial），都不是署名影評人。
6. **分歧**：**評論高於觀眾**：MC 73、RT 81%，但 Popcorn 65%、IMDb 6.8、豆瓣 7.2。英文評論普遍把它當「好看的爛片」（THR「Deliciously Trashy」、Variety「Very Zany」），Vulture 兩位評論者還列入年度十大（候選檔）。

## 11. High Potential 潛能探案組

1. **Metacritic S1**：**72**（16 則）。https://www.metacritic.com/tv/high-potential/season-1/ （read）
2. **IMDb**：**7.5/10**（55K）。https://www.imdb.com/title/tt22091076/ （read，Exa）
3. **豆瓣 S1**：**7.7**（人數不明，鏡像站 moovie 標「豆瓣: 36413494 … 豆瓣评分 7.7」）。https://moovie.c2v2.com/movie/36413494 （snippet）。subject：https://movie.douban.com/subject/36413494/ （ID 取自鏡像站，豆瓣頁本身未讀到；豆瓣譯名《潜能探案组》或《高度潜力》）
4. **英文評論**：Slate，Nadira Goffe，2024-10-02，〈A Hit New Detective Show Isn't Anything Novel. That's What Makes It So Good.〉（頁內標題〈High Potential and the Pleasures of Letting TV Be TV〉）。https://slate.com/culture/2024/10/high-potential-tv-show-kaitlin-olson-abc-hulu.html （read，Groundlane＋Exa）
   - 摘要：它就是一部「每週一案」的公式警探劇，和《Psych》《White Collar》同一個模子，但這正是它的價值——不是每部劇都要高概念、要拿「prestige」標籤，有時候觀眾就是想在結束前知道答案、知道手銬會銬對人。
   - 原文：「Plainly, it's nothing new—but that's exactly what makes High Potential a must-watch.」
5. **中文評論**：**指定媒體沒有找到署名劇評**（搜尋只回到不相關的韓劇與電影評論）。
6. **分歧**：RT 96% 高、MC 72 中等，典型的「沒人討厭、但也不是神作」；觀眾 Popcorn 81%、IMDb 7.5、豆瓣 7.7 都在同一區間。THR 的 Fienberg 說它是「A great star vehicle with a half-baked premise」（Exa highlight，snippet），評論主要稱讚 Kaitlin Olson。

## 12. Mr. & Mrs. Smith 史密斯任務

1. **Metacritic S1**：**75**（40 則）。https://www.metacritic.com/tv/mr-mrs-smith/season-1/ （read；頁面有 Maya Erskine，確認是 2024 年版）
2. **IMDb**：**7.0/10**（56K）。https://www.imdb.com/title/tt14044212/ （read，Exa）
3. **豆瓣 S1**：**7.9**（人數未顯示；五星 27.1%、四星 46.8%）。https://movie.douban.com/subject/35361158/ （cache：Exa 快取的 subject 頁；短評 10,505 條）。豆瓣用戶廣播頁 2026-02-25 也顯示 7.9（cache）。豆瓣譯名《史密斯夫妇》。
4. **英文評論**：Variety，Alison Herman，2024-02-01，〈'Mr. & Mrs. Smith' Review: Donald Glover and Maya Erskine Improve on the Original〉。https://variety.com/2024/tv/tv-reviews/mr-and-mrs-smith-review-donald-glover-maya-erskine-1235892231/ （read：Groundlane 讀到標題、署名、日期與前三段；引句取自 Exa 回傳的內文）
   - 摘要：2005 年電影更像八卦素材而不是好電影，這個概念其實更適合電視；影集把每集命名為「第一次約會」「第一次度假」這類戀愛里程碑，間諜任務只是背景，暴力不是消解情感而是放大戲劇，比原作經得起推敲。
   - 原文：「more melancholy and minor-key than its logline may suggest」
5. **中文評論（台灣）**：電影神搜，龍貓大王通信，2024-02-07，〈【開箱】《史密斯任務》線上影集版：它補足了舊版省略的篇幅，反映新世代婚姻關係的生與死細節〉。https://news.agentm.tw/273482 （read：Groundlane 讀到標題、署名、日期與前段；中後段由 Groundlane 搜尋回傳的頁面內容補足）
   - 摘要：他認為少了明星光環、看似政治正確的主角組合，反而真正致敬了電影版；全劇的主題是「孤獨」，帶光暈的復古攝影讓它像一部愛情電影，Glover 與 Erskine 從陌生到針鋒相對之間確實有化學反應。
6. **分歧**：**評論高、觀眾低**：RT 90%、MC 75，但 Popcorn 66%、IMDb 7.0。豆瓣 7.9 反而高於 IMDb；豆瓣短評顯示選角（非裔男主、亞裔女主）在中文網路引起爭議，熱門短評多在反駁這類批評（cache）。

---

## 總表

| 劇名 | Metacritic S1（則數） | IMDb（票數） | 豆瓣 S1 | 英文評論 | 中文評論 |
|---|---|---|---|---|---|
| 反恐危機 | 92（28） | 8.3（390K） | 8.4（70,784）snippet | Los Angeles Times | 報導者 何榮幸（台，⚠片單文） |
| 頭號外交官 | 74（23） | 8.1（108K） | 7.6（人數不明）snippet | The Guardian | 鳴人堂 彭紹宇（台） |
| 零日風暴 | 52（39） | 7.0（67K） | 7.4（人數不明）snippet | The Hollywood Reporter | 電影神搜 艾米希莉（台） |
| 極樂凶間 | 69（36） | 7.9（93K） | 6.7（1,065，開播週）cache；現約 7.2 snippet | Variety | 缺（部落格替代 ⚠） |
| 暗夜情報員 | 69（14） | 7.4（166K） | 7.6（人數不明）snippet | Los Angeles Times | 電影神搜 艾米希莉（台） |
| 神隱任務 | 69（19） | 8.0（328K） | 8.1（26,085）snippet | Variety | 電影神搜 龍貓大王通信（台，評 S3） |
| 獸藏我心 | 71（29） | 7.4（85K） | 7.4（4,659）snippet | The Guardian | 缺（部落格替代 ⚠） |
| 荒境狂途 | 62（24） | 7.1（75K） | 7.2（6,733）snippet | Vulture | 缺（豆瓣劇評替代，陸 ⚠） |
| 都是她的錯 | 63（18） | 7.5（53K） | 9.1（近 15 萬）news | The Hollywood Reporter | Harper's BAZAAR TW Charlie Lee（台，⚠） |
| 獵豔嬌妻 | 73（12） | 6.8（21K） | 7.2（人數不明）cache | The Hollywood Reporter | 缺（只有 PTT 心得） |
| 潛能探案組 | 72（16） | 7.5（55K） | 7.7（人數不明）snippet | Slate | 缺 |
| 史密斯任務 | 75（40） | 7.0（56K） | 7.9（人數未顯示）cache | Variety | 電影神搜 龍貓大王通信（台） |

英文媒體分布（每家最多 3 部）：The Hollywood Reporter 3（Zero Day、All Her Fault、Hunting Wives）、Variety 3（Paradise、Reacher、Mr. & Mrs. Smith）、Los Angeles Times 2、The Guardian 2、Vulture 1、Slate 1。NYT（付費牆，post1 已確認 403）、Atlantic、New Yorker、IndieWire、Telegraph、BBC 沒有用到。評論者重複：Alison Herman（Variety）2 篇、Angie Han（THR）2 篇、Lucy Mangan（Guardian）2 篇。

中文媒體分布：電影神搜 4（艾米希莉 2、龍貓大王通信 2）、鳴人堂 1、報導者 1、Harper's BAZAAR TW 1（⚠）；**5 部缺**（極樂凶間、獸藏我心、荒境狂途、獵豔嬌妻、潛能探案組）。

## 重點分歧（給寫作參考）

1. **評論低、收視高**：《零日風暴》（MC 52，Netflix H1 2025 #4）、《荒境狂途》（MC 62，Netflix H2 2025 #3）、《暗夜情報員》（MC 69，Nielsen 2023 #2）、《神隱任務》（MC 69，Nielsen 2025 #5）。這類劇適合寫成「好追的爆米花劇」，不要寫成「影評一致好評」。
2. **評論高、觀眾低**：《史密斯任務》（RT 90% vs Popcorn 66%、IMDb 7.0）、《獵豔嬌妻》（MC 73 vs IMDb 6.8）、《頭號外交官》S1（RT 84% vs Popcorn 61%，後季觀眾回升）。
3. **英文評論內部分裂**：《獸藏我心》（Guardian「top-tier」vs THR「monotony」）、《荒境狂途》（Variety 年度十大 vs Vulture／IndieWire 負評）、《都是她的錯》（Vulture「masterpiece」vs Variety「clunkily plotted」）、《零日風暴》（Guardian 80 vs THR 負評）。引用單一評論時要說明「評論兩極」。
4. **豆瓣明顯高於西方**：《都是她的錯》（豆瓣 9.1 vs IMDb 7.5、MC 63），是全系列落差最大的一部之一。
5. **全面一致的高分**：只有《反恐危機》S1（MC 92、RT 100%、豆瓣 8.4）。
6. **Metacritic 和 RT 落差**：《神隱任務》（69 vs 92%）、《極樂凶間》（69 vs 86%）、《潛能探案組》（72 vs 96%）。RT 是正評比例，MC 是加權平均，不要混成「好評度」。

## 缺口

1. **中文評論 5 部缺**：極樂凶間、獸藏我心、荒境狂途、獵豔嬌妻、潛能探案組在指定 7 家媒體都沒有找到署名劇評（Groundlane domains 限定搜尋、Exa、Tavily include_domains 都試過）。關鍵評論網這次的搜尋結果全是艾美獎名單，沒有需要用 Tavily extract 讀全文的劇評。建議人工到放映週報、鏡週刊、GQ／ELLE TW 再找，或接受「台灣影評界未評論」的事實。
2. **中文評論的媒體或範圍問題**：反恐危機用的是報導者的片單文（作者自稱非專業影評）；都是她的錯用 Harper's BAZAAR TW（時尚雜誌、偏介紹）；神隱任務評的是第 3 季，不是 S1。
3. **豆瓣全部沒有直讀 subject 頁**：8/12 是 snippet（鏡像站、百度卡片、豆列摘要），3 是 cache，1 是新聞。人數有 6 部不明或來源互相矛盾（Homeland 70,784 vs 291,296；Beast 4,659 vs 49,463，後者疑似 IMDb 數字）。極樂凶間的 6.7 是開播週快取，已過時。
4. **豆瓣 subject ID 未取得**：Homeland S1、頭號外交官 S1、零日風暴、荒境狂途、都是她的錯。
5. **英文評論引句**：Untamed（Vulture）、Mr. & Mrs. Smith（Variety）的引句來自 Exa 回傳的內文；Groundlane 只讀到前段（輸出上限）。All Her Fault 用 THR 的 Bottom Line 一行，是 Groundlane 直接讀到的。
6. **評論集數**：Paradise（Variety 看 7/8 集）、Hunting Wives（THR 看 3/8 集）不是看完全季。

## 工具降級紀錄（toolDegradation）

- Metacritic：Groundlane `web_extract`（render=never）12/12 成功。`the-diplomat`、`paradise` slug 404 → 改用 `the-diplomat-2023`、`paradise-2025`。Metacritic critic-reviews 子頁只渲染前 10 則、外部連結沒抓到，所以評論是另外搜尋選出的。
- IMDb：Exa `web_fetch_exa` 讀標題頁 12/12 成功（Parents Guide 用 Jina，見 factsheet）。
- 豆瓣：沒有直抓（避免 `sec.douban.com` 驗證頁），全部走 Exa `web_search_exa`。
- 英文評論：Groundlane `web_fetch` 12/12 打開原頁；LA Times、Guardian、THR、Variety、Vulture、Slate 都沒有被擋。
- 中文評論：Groundlane `web_search`（tavily／brave；exa 後端數次 unavailable）＋Exa＋Tavily search。報導者頁的作者欄是前端渲染，pattern 抓不到，改由 Groundlane 搜尋回傳的頁面內容確認「文字 何榮幸」。
- 沒有用到 Firecrawl、cloudflare `get_url_markdown`、Tavily extract（沒有需要讀的關鍵評論網劇評）。
