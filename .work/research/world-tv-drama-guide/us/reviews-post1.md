# Post 1 評價資料表：美劇 18 部（Metacritic／IMDb／豆瓣／英文評論／中文評論）

研究日期：2026-11-05。RT 分數已在 `factsheets-post1.md`，這裡不重抓，只在「分歧」欄引用。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態標記 |
|---|---|---|---|
| Metacritic S1 Metascore＋評論數 | `metacritic.com/tv/<slug>/season-1/`，抓 `title="Metascore N out of 100"` 和 `See All N Critic Reviews` | Groundlane `web_extract`（render=never） | 18/18 read |
| IMDb 用戶評分（**整部劇**，非單季） | `imdb.com/title/<id>/` 標題列 `IMDb RATING x.x/10 N` | Groundlane 被 WAF 擋（2 KB 空頁）→ Jina `read_url`（5 部）＋Exa `web_fetch_exa`（13 部） | 18/18 read |
| 豆瓣 S1 評分 | `movie.douban.com/subject/<id>/` | Groundlane 直抓被導到 `sec.douban.com` 驗證頁（不繞過）。改用 Exa 索引內的快取頁（標 **cache**，快照日期不明）；其餘用豆列／搜尋摘要（標 **snippet**，附摘要裡的日期） | 4 cache、14 snippet |
| 英文評論 | Metacritic critic-reviews 頁列出的連結 → 讀原文 | Groundlane `web_fetch`；被擋時改 Exa | 16 read、2 partial |
| 中文評論 | 台灣媒體優先 | Exa search（回傳內文 highlights）、Groundlane `web_fetch`／`web_extract` | 見各條 |

標記說明：**read** = 工具實際讀到頁面內文；**partial** = 只讀到前段或付費牆前；**cache** = Exa 快取副本（非即時）；**snippet** = 只看到搜尋摘要，不算讀到原頁。

> 注意：IMDb 是整部劇的總評分，Metacritic 與豆瓣是第 1 季。比較時不能直接對齊，尤其多季劇（GoT、Handmaid、ST、Boys）。

---

## 1. Game of Thrones 權力遊戲

1. **Metacritic S1**：**80**（28 則評論；22 正面、6 褒貶、0 負面）。https://www.metacritic.com/tv/game-of-thrones/season-1/ （read）
2. **IMDb**：**9.2/10**（2.7M 票）。https://www.imdb.com/title/tt0944947/ （read，Jina）
3. **豆瓣 S1**：**9.5**。subject 頁快取顯示 9.5，但沒有評分人數（https://movie.douban.com/subject/3016187/ ，cache）；人數 **502,760** 來自豆列「豆瓣美剧TOP150」2026-07-06 摘要（https://www.douban.com/doulist/164449217/ ，snippet）。
4. **英文評論**：The Hollywood Reporter，Tim Goodman，2011-04-15，〈Game of Thrones: Review〉。https://www.hollywoodreporter.com/tv/tv-reviews/game-thrones-review-174120/ （read）
   - 摘要：認為宣傳沒有誇大，這部奇幻劇有《黑道家族》那種吸引觀眾的元素，劇情複雜卻不拖沓。
   - 原文：「exceptional storytelling, strong writing, superb acting and some stunning visual effects」
5. **中文評論（台灣）**：GQ Taiwan，馬欣，2014-05-23，〈2大超夯美劇點評：《紙牌屋》VS.《冰與火之歌》 人賤怎能不矯情？〉。https://www.gq.com.tw/entertainment/content-17944 （partial，Exa highlights）
   - 摘要：把《冰與火之歌》和《紙牌屋》並看，說它推翻了「好人與主角不會死」的慣例，亂世裡不懂權術就是原罪，觀眾在劇中看見自己處於「賤勢」的處境。注意：這篇是第 4 季時期的雙劇比較，不是第 1 季專評。
6. **分歧**：豆瓣（9.5）高於 IMDb（9.2）和 Metacritic（80）。S1 評論裡 WSJ 只給 40 分（Metacritic 頁 read），評論界一開始並非一面倒。IMDb 總分已經包含第 8 季的負評，S1 單季分數更高（IMDb 頁顯示 S1 各集平均 9.0）。

## 2. House of the Dragon 龍族前傳

1. **Metacritic S1**：**69**（43 則）。https://www.metacritic.com/tv/house-of-the-dragon/season-1/ （read）
2. **IMDb**：**8.2/10**（577K）。https://www.imdb.com/title/tt11198330/ （read，Jina）
3. **豆瓣 S1**：**8.7**（**109,500** 人）。數字來自 Exa 快取的第 9 集頁側欄（https://movie.douban.com/subject/34825964/episode/9/ ，cache，頁尾 ©2025）。subject：https://movie.douban.com/subject/34825964/
4. **英文評論**：The Guardian，Lucy Mangan，2022-08-19，〈House of the Dragon first look review – this epic Game of Thrones prequel is a roaring success〉。https://www.theguardian.com/tv-and-radio/2022/aug/19/house-of-the-dragon-review-game-of-thrones-prequel-got （read；根據第 1 集寫成）
   - 摘要：第一集就把棋子都擺好，看起來會和前作巔峰期一樣好看、好入門。
   - 原文：「the game of political seven-dimensional chess that its predecessor was」
5. **中文評論（台灣）**：關鍵評論網，明蒂小姐（袁民慧），2026-08-23，〈HBO《龍族前傳》第三季解析：火與血、生與死，配樂與編劇共舞的權力遊戲〉。https://www.thenewslens.com/article/269739 （partial，Exa highlights）
   - 摘要：她認為第一季時間線跳太快、第二季太慢、高潮無疾而終，第三季以陸海空大戰開場，「或可一掃前兩季陰霾」。（評的是最新的第 3 季。）
6. **分歧**：RT S1 90%，但 Metacritic 只有 69，代表多數評論是「正面但不熱烈」。豆瓣 8.7 和 IMDb 8.2 都比 Metacritic 高。

## 3. A Knight of the Seven Kingdoms 七王國的騎士

1. **Metacritic S1**：**75**（38 則）。https://www.metacritic.com/tv/a-knight-of-the-seven-kingdoms/season-1/ （read）
2. **IMDb**：**8.6/10**（293K）。https://www.imdb.com/title/tt27497448/ （read，Jina）
3. **豆瓣 S1**：**9.0**（**31,203** 人，豆列「2026剧集」2026-03-01 摘要）。https://www.douban.com/doulist/163372052/ （snippet）。subject ID 從評論頁網址得知：https://movie.douban.com/subject/35341071/
4. **英文評論**：IndieWire，Ben Travers，2026-01-13，〈'A Knight of the Seven Kingdoms' Review: 'Game of Thrones' Spinoff Chooses Kindness Over Carnage〉。https://www.indiewire.com/criticism/shows/knight-of-the-seven-kingdoms-review-game-of-thrones-series-1235172708/ （read，Exa；Groundlane 逾時）
   - 摘要：稱讚它刻意縮小規模，把權遊的冷酷換成同情心，是值得肯定的創作選擇。
   - 原文：「a lighter perspective is just what the maester ordered」
5. **中文評論（台灣，媒體待商榷）**：大紀元，蔡宜霖，2026-04-09，〈《七王國的騎士》影評：平民騎士與王室結下深厚緣分〉。https://www.epochtimes.com/b5/26/4/9/n14738065.htm （partial，Exa highlights）
   - 摘要：以平民騎士視角補足系列少見的庶民觀點，騎士生活細節寫實，品質「稱得上傑出」。⚠ 大紀元不在指定名單內，立場鮮明；釀電影／關鍵評論網沒有找到本劇的專評。替代：豆瓣影評〈豆瓣9.0，《权游》宇宙回归〉（分派电影，2026-02-11，https://movie.douban.com/review/17442135/ ，按讚數不明）。
6. **分歧**：RT 94%、豆瓣 9.0，但 Metacritic 只有 75，Popcornmeter 79%（factsheet）。Marie Claire TW 報導提到部分觀眾嫌節奏慢、低俗笑點多。

## 4. Andor 安道爾

1. **Metacritic S1**：**74**（31 則）。https://www.metacritic.com/tv/andor/season-1/ （read）
2. **IMDb**：**8.6/10**（290K）。https://www.imdb.com/title/tt9253284/ （read，Jina）
3. **豆瓣 S1**：**9.0**（**34,090** 人）。https://movie.douban.com/subject/30376895/ （cache，Exa 快取的 subject 頁；頁內討論串最新日期 2026-08-01）
4. **英文評論**：The Atlantic，Shirley Li，2022-09-21，〈Andor Is Star Wars at Its Most Mature〉。https://www.theatlantic.com/culture/archive/2022/09/andor-star-wars-disney-tv-show-review/671497/ （partial：Groundlane 遇到 Cloudflare 403，Exa 只讀到前段）
   - 摘要：認為《安道爾》放棄盧卡斯式的善惡二分，是星戰系列最成熟的一部。
   - 原文（副標）：「leans less on lightsaber showdowns and more on the messier interactions between good and evil」
5. **中文評論（台灣）**：釀電影，黃郁書，2025-05-30，〈《安道爾》全系列：革命的暗影，反抗的火光〉。https://filmaholic.tw/series/68382af2fd897800015edba9 （read，Groundlane `web_extract` 確認標題、日期、作者與引句）
   - 摘要：沒有原力和光劍，卻是「有史以來最精彩動人的一部『星際大戰』」，拆解了革命的代價與反抗者的創傷。（評兩季全劇。）
6. **分歧**：觀眾（IMDb 8.6、豆瓣 9.0）比 Metacritic S1 的 74 熱烈。IMDb 使用者評論說 S1 開場幾集慢（E1–E2 只有 7.4／7.3）。

## 5. The Mandalorian 曼達洛人

1. **Metacritic S1**：**70**（29 則）。https://www.metacritic.com/tv/the-mandalorian/season-1/ （read）
2. **IMDb**：**8.6/10**（669K）。https://www.imdb.com/title/tt8111088/ （read，Jina）
3. **豆瓣 S1**：**9.2**（**122,316** 人，豆列 2024-11-21 摘要）。https://www.douban.com/doulist/160345957/ （snippet）。subject：https://movie.douban.com/subject/30344167/ （Exa 抓 m.douban 回 403）
4. **英文評論**：Slate，Sam Adams，2019-11-12，〈Disney's Live-Action Star Wars Show Looks Great, but So Far It Isn't〉。https://slate.com/culture/2019/11/the-mandalorian-review-star-wars-series-disney-plus.html （read；**只評第 1 集**）
   - 摘要：預算很大、想像力很少，第一集處處照搬熟悉元素，角色像還沒寫成劇本的提案。
   - 原文：「39 minutes of mediocre Star Wars」
5. **中文評論（台灣）**：關鍵評論網，傅紀鋼，2021-11-29，〈【劇評】Disney+《曼達洛人》：不需龐大背景知識、也能享受觀影樂趣的《星際大戰》系列佳作〉。https://www.thenewslens.com/article/159368 （partial，Exa highlights）
   - 摘要：Favreau 以單元劇和「父子情」主線取代天行者大敘事，像太空版《帶子狼》，不懂星戰的人也看得懂。（回顧前兩季。）
6. **分歧**：本表最明顯的評論對觀眾落差之一。Slate 對試播集給負評，Metacritic 70；豆瓣 9.2、IMDb 8.6、Popcornmeter 93%（factsheet）。英文評論使用的是首集評論，中文評論則看完兩季，引用時要說明時間點不同。

## 6. Peacemaker 和平使者

1. **Metacritic S1**：**70**（26 則）。https://www.metacritic.com/tv/peacemaker/season-1/ （read；已確認這是 James Gunn 版，同名頁描述為「'The Suicide Squad' spinoff」）
2. **IMDb**：**8.2/10**（202K）。https://www.imdb.com/title/tt13146488/ （read，Exa）
3. **豆瓣 S1**：**8.7**（**54,219** 人，m.豆列 2025-11-27 摘要）。https://m.douban.com/doulist/147453791/ （snippet）。subject ID 35209701（取自 moovie 鏡像站，豆瓣頁本身未讀到）
4. **英文評論**：IndieWire，Ben Travers，2022-01-13，〈'Peacemaker' Review: James Gunn's HBO Max Series Soars Like an Eagly〉。https://www.indiewire.com/criticism/shows/peacemaker-review-hbo-max-james-gunn-1234689873/ （partial，Exa 讀到前段，含副標）
   - 摘要：John Cena 的投入和 Gunn 的金屬搖滾配樂讓這部暴力劇意外靈活，副標也承認後段比較搖晃。
   - 原文：「it moves surprisingly well」；副標「wobblier as it goes along」
5. **中文評論（台灣）**：鳴人堂（聯合新聞網），林運鴻，2022-03-08，〈《和平使者》：蠢笨直男和左膠覺青的神奇友誼！〉。https://opinion.udn.com/opinion/story/120617/6146526 （partial，Exa highlights）
   - 摘要：主線稍嫌平面，但人物描寫絕妙，把「白垃圾」式男子氣概的功過並陳，並對好萊塢的政治正確提出溫和異議。
6. **分歧**：Metacritic 70，但 RT 93%、豆瓣 8.7，評論普遍正面但給分不高。

## 7. The Boys 黑袍糾察隊

1. **Metacritic S1**：**74**（19 則）。https://www.metacritic.com/tv/the-boys/season-1/ （read）
2. **IMDb**：**8.5/10**（1M）。https://www.imdb.com/title/tt1190634/ （read，Exa）
3. **豆瓣 S1**：**8.6**（**181,105** 人）。https://movie.douban.com/subject/3703650/episode/1/ （cache，Exa 快取的第 1 集頁側欄）
4. **英文評論**：Slate，Matthew Dessem，2019-08-15，〈Amazon's Superhero Satire The Boys Is Wonderfully Tasteless and Occasionally Timely〉。https://slate.com/culture/2019/08/the-boys-amazon-series-comic-book-adaptation-trump-marvel.html （read）
   - 摘要：拆解超級英雄敘事的執行力很強，但這部 2006 年的漫畫改編，有些地方跟不上川普時代。
   - 原文：「an expert deconstruction of superhero stories」
5. **中文評論（中國大陸，替代來源）**：北京青年報（中國青年網轉載），楊時暘，2019-08-02，〈黑袍纠察队：把超级英雄拉下神坛〉。https://s.cyol.com/articles/2019-08/02/content_r29Le6C3.html （partial，Exa highlights）
   - 摘要：把超英寫成財團旗下的簽約藝人，是「漫畫款的《1984》」，批判造神與庸眾狂歡。⚠ 台灣媒體只找到關鍵評論網編輯部片單短評（張博丞，2025-01-27，https://www.thenewslens.com/article/248259 ，不算完整劇評）。
6. **分歧**：三方大致一致（74／8.5／8.6）。S1 在 Metacritic 只有 19 則評論，是 18 部裡樣本最少的。

## 8. The Penguin 企鵝人

1. **Metacritic S1**：**72**（41 則）。https://www.metacritic.com/tv/the-penguin/season-1/ （read）
2. **IMDb**：**8.6/10**（254K）。https://www.imdb.com/title/tt15435876/ （read，Exa）
3. **豆瓣**：**8.6**（**31,816** 人）。https://movie.douban.com/subject/35604181/ （cache，Exa 快取的 subject 頁；頁內小組討論最新日期 2026-08-27）
4. **英文評論**：Variety，Aramide Tinubu，2024-09-12，〈'The Penguin' Review: HBO's New Series That Expands Batman Universe〉。https://variety.com/2024/tv/reviews/the-penguin-review-1236133718/ （read）
   - 摘要：不只是反派的起源故事，而是對犯罪的精湛描寫，Farrell 與 Milioti 都很出色。
   - 原文：「the show is twisted, disturbing and deeply enthralling」
5. **中文評論（台灣）**：電影神搜，出前一廷，2024-11-18，〈【劇評】HBO 影集《企鵝人》：不賣弄同情，也不畏懼觀眾討厭主角，以真正屬於反派的個性直球對決〉。https://news.agentm.tw/308060/ （partial，Exa highlights）
   - 摘要：延續《蝙蝠俠》的寫實幫派劇路線，三大角色刻劃出色，不刻意替反派討同情，獨立成篇也完整。⚠ 電影神搜不在指定名單內，但作者出前一廷（劉韋廷）是台灣資深影評人／譯者。
6. **分歧**：Metacritic 72 偏保守，RT 95%、IMDb 8.6、豆瓣 8.6 都更高。

## 9. Severance 人生切割術

1. **Metacritic S1**：**83**（36 則）。https://www.metacritic.com/tv/severance/season-1/ （read）
2. **IMDb**：**8.6/10**（415K）。https://www.imdb.com/title/tt11280740/ （read，Exa）
3. **豆瓣 S1**：**9.0**（**183,540** 人）。https://m.douban.com/movie/subject/34885342/ （cache，Exa 快取）。較早的豆列摘要是 9.1（165,530 人）。
4. **英文評論**：Vulture，Roxana Hadadi，2022-02-17，〈Prepare to Give Yourself Over to Severance〉。https://www.vulture.com/article/severance-apple-tv-series-review.html （read）
   - 摘要：延續 Philip K. Dick 對企業抹除個人的警告，每集都扣進整體謎題，看了會沉浸其中。
   - 原文：「a confidently written, stylishly directed first season of television」
5. **中文評論（台灣，媒體待商榷）**：Vogue Taiwan，Yi Chang，2022-04-19，〈Apple TV+ 社畜驚悚神劇《人生切割術 Severance》 寫實劇情網友驚呼：「確定不是實境劇？」〉。https://www.vogue.com.tw/entertainment/article/series-severance （partial，Exa highlights）
   - 摘要：冷冽視覺加上反烏托邦職場寓言，一直在抨擊地獄般的企業文化。⚠ 這篇偏介紹，不是嚴肅劇評。比較深入的替代來源（中國大陸）：豆瓣影評〈《人生切割术》：用后即弃的人〉，Enlightening（首發陀螺电影），2022-03-09，https://movie.douban.com/review/14264905/ （partial），從「新奴隸制」與後人類角度解讀。
6. **分歧**：沒有明顯落差，評論和觀眾都很高（83／8.6／9.0）。

## 10. Pluribus 萬中選一

1. **Metacritic S1**：**87**（38 則）。https://www.metacritic.com/tv/pluribus/season-1/ （read）
2. **IMDb**：**7.9/10**（183K）。https://www.imdb.com/title/tt22202452/ （read，Exa）
3. **豆瓣 S1**：**8.2**（**54,466** 人；豆瓣譯名《同乐者》）。https://movie.douban.com/subject/36352371/ （cache，Exa 快取）
4. **英文評論**：Vulture，Nicholas Quah，2025-11-06，〈'Pluribus' Review: Trust in Vince Gilligan and Rhea Seehorn〉。https://www.vulture.com/article/pluribus-apple-tv-series-review-vince-gilligan-rhea-seehorn.html （read；評論者看了 9 集中的 7 集）
   - 摘要：節奏刻意緩慢，可能讓人卻步，但信任這個過程就會被它吞沒，Rhea Seehorn 撐起全劇。
   - 原文：「Something glorious is gestating inside this entrancing piece of television」
5. **中文評論（台灣）**：釀電影，張硯拓（釀電影總編輯），2026-01-30，〈《萬中選一》：這不是真愛的故事，而是文斯．吉利根的科幻版「戀夏 70 日」〉。https://filmaholic.tw/series/697b3891fd897800011a2f69 （read，Groundlane 確認標題、日期與引句；內文由 Tavily 搜尋結果帶出）
   - 摘要：「2025 年最讓我興奮的新劇」。他把卡蘿和佐夏的關係讀成科幻版浪漫喜劇，並拿群體意識類比 AI 的討好與沒有自我。
6. **分歧**：**評論對觀眾落差最大的一部**。Metacritic 87、RT 99%，但 Popcornmeter 只有 68%（factsheet）、IMDb 7.9、豆瓣 8.2。Vulture 也預告了這種兩極：「There's a good chance Pluribus will alienate you」。

## 11. 3 Body Problem 3 體

1. **Metacritic S1**：**70**（42 則）。https://www.metacritic.com/tv/3-body-problem/season-1/ （read）
2. **IMDb**：**7.5/10**（187K）。https://www.imdb.com/title/tt13016388/ （read，Exa）
3. **豆瓣 S1**：**6.7**（**53,346** 人，截至 2024-03-24 19:30；極目新聞／潇湘晨报 2024-03-25 報導，https://www.ctdsb.net/c1664_202403/2091470.html ，snippet）。聯合早報 2024-03-27 報導 6.8（https://www.zaobao.com.sg/realtime/china/story20240327-3223712 ，snippet）。⚠ Exa 快取的豆瓣 subject 頁（https://m.douban.com/movie/subject/35196946/ ，cache）**沒有顯示評分區塊**，可能已隱藏或改為不顯示。目前分數無法查證。
4. **英文評論**：The New Yorker，Inkoo Kang，2024-03-18（雜誌 3/25 期），〈"3 Body Problem" Is a Rare Species of Sci-Fi Epic〉。https://www.newyorker.com/magazine/2024/03/25/3-body-problem-tv-review-netflix （read）
   - 摘要：把艱深的理論問題和真正的奇觀與情感結合起來，Zine Tseng 飾演的葉文潔表現出色。
   - 原文：「the narrative unspools with delightful unpredictability」
5. **中文評論（台灣）**：釀電影，黃彥瑄，2024-06-01，〈彼此苦旅，以抵群星──《3體》如何描繪人類的宇宙之愛？〉。https://filmaholic.tw/series/6659e67efd89780001f8ea83 （read）
   - 摘要：不談改編優劣，而是從葉文潔、程慬、威爾道寧的選擇，讀出驅動人類冒險的「以愛為名的燃料」。
6. **分歧**：**豆瓣遠低於其他平台**（6.7 vs IMDb 7.5、RT 78%）。同時期報導指出，中國網友不滿角色改動（汪淼拆成「牛津五人組」）、壓縮三部曲，並和 8.7 分的騰訊版比較。這是本表最明顯的華語圈和西方評價落差。

## 12. Fallout 異塵餘生

1. **Metacritic S1**：**73**（33 則）。https://www.metacritic.com/tv/fallout/season-1/ （read）
2. **IMDb**：**8.3/10**（407K）。https://www.imdb.com/title/tt12637874/ （read，Exa）
3. **豆瓣 S1**：**8.5**，評分人數不明。數字來自豆瓣影評〈单集最高9.1分！Amazon打出一手王炸〉（天天美剧吧，2024-05-13）內文「豆瓣8.5分」（https://movie.douban.com/review/15937898/ ，snippet）。subject：https://movie.douban.com/subject/35128081/ （未讀到評分區）
4. **英文評論**：The Guardian，Lucy Mangan，2024-04-11，〈Fallout review – an absolute blast of a TV show〉。https://www.theguardian.com/tv-and-radio/2024/apr/11/prime-fallout-review-an-absolute-blast-of-a-tv-show （read）
   - 摘要：和《最後生還者》一樣，沒玩過遊戲也能完全投入，有趣、自覺又緊張。
   - 原文：「intelligent, drily witty, immaculately constructed series」
5. **中文評論（台灣）**：電影神搜，龍貓大王通信，2024-04-12，〈【劇評】影集《異塵餘生》第一季：還原系列遊戲的暴力與黑色幽默，揭開遊戲背後的黑暗新內幕〉。https://news.agentm.tw/277384/ （partial，Exa highlights）
   - 摘要：三位主角的視角有效展開龐大世界觀，忠實保留遊戲的黑色幽默與暴力，老玩家不會失望，新觀眾也能進入。⚠ 電影神搜不在指定名單內，但龍貓大王通信是台灣知名影評人。
6. **分歧**：Metacritic 73 偏低，RT 93%、Popcornmeter 95%、IMDb 8.3。觀眾比評論更熱烈。

## 13. The Last of Us 最後生還者

1. **Metacritic S1**：**84**（44 則）。https://www.metacritic.com/tv/the-last-of-us/season-1/ （read）
2. **IMDb**：**8.4/10**（756K）。https://www.imdb.com/title/tt3581920/ （read，Exa）
3. **豆瓣 S1**：**9.0**（**205,883** 人，豆列摘要）。https://www.douban.com/doulist/153582585/ （snippet）。subject ID 25848328（來自第三方站轉錄，豆瓣頁回 403）
4. **英文評論**：Los Angeles Times，Lorraine Ali，2023-01-13，〈'The Last of Us' review: HBO masters the game adaptation〉。https://www.latimes.com/entertainment-arts/tv/story/2023-01-13/the-last-of-us-hbo-review （read）
   - 摘要：雖然是熟悉的末日題材，但這是根據高水準遊戲拍成的高水準劇，在殘酷中保留溫柔；Pedro Pascal 演得極好。
   - 原文：「an underlying beauty and grace」
5. **中文評論（台灣）**：關鍵評論網，明蒂小姐（袁民慧），2023-03-17，〈【美劇】《最後生還者》：瘟疫後活屍末日災難，宛如金剛老狼的西部片公路之旅〉。https://www.thenewslens.com/article/182564 （partial，Exa highlights）
   - 摘要：用一組組二人關係映照互相依存的人性，在電玩式的爽快殺戮中，同時要觀眾承受大量苦難；Bella Ramsey 的表現幾乎超出「電視劇表演」的範疇。
6. **分歧**：評論和觀眾都很高（84／8.4／9.0）。IMDb 總分被第 2 季拉低的可能性，沒有另外查證。

## 14. The Handmaid's Tale 使女的故事

1. **Metacritic S1**：**92**（41 則）—— **本表最高**。https://www.metacritic.com/tv/the-handmaids-tale/season-1/ （read）
2. **IMDb**：**8.3/10**（307K）。https://www.imdb.com/title/tt5834204/ （read，Exa）
3. **豆瓣 S1**：**8.9**（snippet：百度摘要顯示豆瓣 S1 8.9；評分人數 115,299 只見於盜版站轉錄，**不採用**）。https://www.baidu.com/s?wd=使女的故事第一季豆瓣评分 （snippet）。2021 年《北京青年報》寫 S1「8.8分」。豆瓣 subject ID 未取得。
4. **英文評論**：Vulture，Jen Chaney，2017-04-13，〈Hulu's The Handmaid's Tale Is Your Must-Watch Show This Spring〉。https://www.vulture.com/2017/04/the-handmaids-tale-hulu-review.html （read；根據前 3 集）
   - 摘要：忠於原著又加了新層次，可能是年度最佳劇集之一，在川普時代特別有急迫感。
   - 原文：「meticulously paced, brutal, visually stunning」
5. **中文評論（中國大陸，替代來源）**：北京青年報（中新網轉載），唐山，2021-05-14，〈《使女的故事》跑偏 渐成慢版《神奇女侠》〉。https://www.chinanews.com.cn/m/yl/2021/05-14/9476843.shtml （partial，Exa highlights）
   - 摘要：第一季因為貼近原著而得到原著粉認同，第二季起逐漸「跑偏」成好萊塢式爽劇，背離愛特伍對極權的深刻反省。⚠ 台灣媒體只找到第 4 季宣傳稿（VERSE，署名 HBO GO）和人物專題（翁煌德），沒有正式劇評。
6. **分歧**：S1 評論分數最高（MC 92），但 IMDb 總分 8.3 已經被後幾季拉低。中文評論的典型看法是「第一季最好、之後跑偏」，這和 IMDb 總分偏低的現象一致，可以互相印證。

## 15. Stranger Things 怪奇物語

1. **Metacritic S1**：**76**（34 則）。https://www.metacritic.com/tv/stranger-things/season-1/ （read）
2. **IMDb**：**8.6/10**（1.8M）。https://www.imdb.com/title/tt4574334/ （read，Exa）
3. **豆瓣 S1**：**9.1**（**511,918** 人，豆列摘要）。https://www.douban.com/doulist/163263442/ （snippet）。subject ID 未取得。
4. **英文評論**：Variety，Maureen Ryan，2016-07-11，〈'Stranger Things' Review: Winona Ryder's creepy, retro return to TV〉。https://variety.com/2016/tv/reviews/stranger-things-review-winona-ryder-netflix-matthew-modine-1201808737/ （read）
   - 摘要：大量致敬 Spielberg 與 80 年代作品，原創性不足，但驚嚇有效，對失落的純真也有更深的思考，整體是「promising」。
   - 原文：「originality is not exactly its strong suit」
5. **中文評論（台灣）**：關鍵評論網，胡芩，2025-11-28，〈【劇評】Netflix《怪奇物語》最終季第一輯：顛倒世界其實一直存在於現實？〉。https://www.thenewslens.com/article/261716 （partial，Exa highlights）
   - 摘要：回看全劇，真正的魅力不在懷舊或驚悚，而在對角色內心、恐懼與家庭情感的細膩描繪；顛倒世界就是角色壓抑的創傷。（評最終季。）
6. **分歧**：Metacritic S1 76 偏保守（Variety 的評語也是褒中帶保留），觀眾端很高：RT Popcornmeter 96%、豆瓣 9.1、IMDb 8.6。

## 16. It: Welcome to Derry 牠：歡迎來到德利鎮

1. **Metacritic S1**：**61**（30 則）—— **本表最低**。https://www.metacritic.com/tv/it-welcome-to-derry/season-1/ （read）
2. **IMDb**：**7.9/10**（124K）。https://www.imdb.com/title/tt19244304/ （read，Exa）
3. **豆瓣 S1**：**8.4**（**50,283** 人，豆列 2025-12-24 摘要；豆瓣譯名《小丑回魂：欢迎来到德里镇》）。https://www.douban.com/doulist/147370945/ （snippet）。subject：https://movie.douban.com/subject/35819117/ 。開播時曾到 8.8（豆瓣影評 2025-10-29 內文），12 月有短評提到 8.6，分數一路下滑。
4. **英文評論**：Variety，Aramide Tinubu，2025-10-22，〈'It: Welcome to Derry' Review: HBO Series Is Outstanding〉。https://variety.com/2025/tv/reviews/it-welcome-to-derry-review-hbo-1236557304/ （read；評論者看了 8 集中的 5 集）
   - 摘要：結合歷史、種族與超自然的心理恐怖，童星群表現特別好。
   - 原文：「a masterfully woven and terrifying tale」
5. **中文評論（台灣）**：關鍵評論網（Readmoo 閱讀最前線供稿），出前一廷（劉韋廷），2025-12-20，〈《牠：歡迎來到德利鎮》：不只是童年故里的陰暗過往，也是血跡斑斑的美國歷史〉。https://www.thenewslens.com/article/262649 （partial，Exa highlights）
   - 摘要：影集終於回到原著常被忽略的主題，把德利鎮當成美國社會縮影，有機會呈現電影沒拍到、更真實的恐怖。（主要根據首集與原著寫成。）
6. **分歧**：Metacritic 61 是本表最低，但 Variety 給高度好評，RT 81%，豆瓣 8.4、IMDb 7.9 也明顯偏高。豆瓣短評同時出現「高開低走、主角團降智」的批評，觀眾端也有分歧。

## 17. Alien: Earth 異形：地球

1. **Metacritic S1**：**85**（41 則）。https://www.metacritic.com/tv/alien-earth/season-1/ （read）
2. **IMDb**：**7.1/10**（112K）。https://www.imdb.com/title/tt13623632/ （read，Exa）
3. **豆瓣 S1**：**6.4**（**31,177** 人，豆列摘要）。https://www.douban.com/doulist/161657151/ （snippet）。2025-09-27 豆瓣廣播也顯示 6.4。開分 7.5（豆瓣影評〈年度最狠科幻，7.5分低了？〉2025-08-19，https://movie.douban.com/review/16978118/ ，snippet）。subject ID 未取得。
4. **英文評論**：The Hollywood Reporter，Angie Han，2025-08-05，〈'Alien: Earth' Review: FX's Sci-Fi Prequel Is an Intriguingly Ambitious, Eventually Thrilling Journey Into the Semi-Known〉。https://www.hollywoodreporter.com/tv/tv-reviews/alien-earth-timothy-olyphant-sydney-chandler-noah-hawley-fx-1236335484/ （read）
   - 摘要：Hawley 不只是重複《異形》的外殼，而是把它當跳板，談人格、傲慢與被太空怪物痛宰的原始快感。
   - 原文：「heady, sprawling, occasionally unwieldy but eventually thrilling epic」
5. **中文評論（台灣／亞洲，媒體待商榷）**：Tatler Asia（繁中版），Irene Chen，2025-08-14，〈《異形：地球》被稱為最好看的影集之一？9點評價〉。https://www.tatlerasia.com/lifestyle/entertainment/alien-earth-review-zh-hant （partial，Exa highlights）
   - 摘要：重點放在企業壟斷與人工生命倫理，8 集慢慢累積壓力；有人嫌節奏慢、設定直白，但「不要快轉」才能享受。⚠ 生活風格媒體，不是影評專業媒體。
6. **分歧**：**評論對觀眾落差最大的一部（與 Pluribus 並列）**。Metacritic 85、RT 94%，但 Popcornmeter 65%（factsheet）、IMDb 7.1、豆瓣從 7.5 跌到 6.4。豆瓣高讚短評拿它和《德利鎮》比較並給負評（「《异形地球》快跪下叫爹」，《德利鎮》短評頁，snippet）。

## 18. Wednesday 星期三

1. **Metacritic S1**：**66**（26 則）。https://www.metacritic.com/tv/wednesday/season-1/ （read）
2. **IMDb**：**8.0/10**（514K）。https://www.imdb.com/title/tt13443470/ （read，Exa）
3. **豆瓣 S1**：**7.8**（**166,652** 人，m.豆列 2025-09-04 摘要）。https://m.douban.com/doulist/162497857/ （snippet）。subject：https://movie.douban.com/subject/35364243/
4. **英文評論**：Los Angeles Times，Lorraine Ali，2022-11-23，〈Netflix's 'Wednesday': the 'Addams Family' spinoff we deserve〉。https://www.latimes.com/entertainment-arts/tv/story/2022-11-23/wednesday-netflix-addams-family （read）
   - 摘要：Burton 歡樂又陰森的改編很成功，Jenna Ortega 的冷面演出（包括學校舞會那段）是年度電視名場面。
   - 原文：「Ortega kills as the gifted, nihilistic teen」
5. **中文評論（台灣）**：關鍵評論網，明蒂小姐（袁民慧），2025-08-13，〈【劇評】Netflix《星期三》第二季1-4集：冷面笑將的闇黑魅力，以「Woe」押韻有什麼含義？〉。https://www.thenewslens.com/column/streaming/257030 （partial，Exa highlights）
   - 摘要：拆解第二季的愛倫坡致敬、連環殺手典故與押頭韻的標題遊戲，肯定劇集的高度文學性。（評第 2 季；同作者 2022-12-10 也寫過 S1 彩蛋解析，未讀。）
6. **分歧**：**和多數劇相反，觀眾比評論熱烈**：Metacritic 66、RT 74%（共識語氣褒貶參半），但 Popcornmeter 86%、IMDb 8.0。豆瓣 7.8 是本表倒數第三低，高讚長評批評它「失去靈魂的亞當斯一家」、像校園戀愛劇（豆瓣劇評頁，snippet）。

---

## 總表

| 劇 | Metacritic S1（評論數） | IMDb（票數） | 豆瓣 S1（人數） | 英文評論 | 中文評論（地區） |
|---|---|---|---|---|---|
| 權力遊戲 | 80（28） | 9.2（2.7M） | 9.5（502,760）snippet | The Hollywood Reporter | GQ Taiwan 馬欣（台） |
| 龍族前傳 | 69（43） | 8.2（577K） | 8.7（109,500）cache | The Guardian | 關鍵評論網 明蒂小姐（台） |
| 七王國的騎士 | 75（38） | 8.6（293K） | 9.0（31,203）snippet | IndieWire | 大紀元 蔡宜霖（台，⚠） |
| 安道爾 | 74（31） | 8.6（290K） | 9.0（34,090）cache | The Atlantic（partial） | 釀電影 黃郁書（台） |
| 曼達洛人 | 70（29） | 8.6（669K） | 9.2（122,316）snippet | Slate | 關鍵評論網 傅紀鋼（台） |
| 和平使者 | 70（26） | 8.2（202K） | 8.7（54,219）snippet | IndieWire（partial） | 鳴人堂 林運鴻（台） |
| 黑袍糾察隊 | 74（19） | 8.5（1M） | 8.6（181,105）cache | Slate | 北京青年報 楊時暘（陸，⚠） |
| 企鵝人 | 72（41） | 8.6（254K） | 8.6（31,816）cache | Variety | 電影神搜 出前一廷（台） |
| 人生切割術 | 83（36） | 8.6（415K） | 9.0（183,540）cache | Vulture | Vogue Taiwan Yi Chang（台，⚠）＋豆瓣 Enlightening（陸） |
| 萬中選一 | 87（38） | 7.9（183K） | 8.2（54,466）cache | Vulture | 釀電影 張硯拓（台） |
| 3 體 | 70（42） | 7.5（187K） | 6.7（53,346，2024-03）snippet；現頁無分數 | The New Yorker | 釀電影 黃彥瑄（台） |
| 異塵餘生 | 73（33） | 8.3（407K） | 8.5（人數不明）snippet | The Guardian | 電影神搜 龍貓大王通信（台） |
| 最後生還者 | 84（44） | 8.4（756K） | 9.0（205,883）snippet | Los Angeles Times | 關鍵評論網 明蒂小姐（台） |
| 使女的故事 | 92（41） | 8.3（307K） | 8.9（人數未採用）snippet | Vulture | 北京青年報 唐山（陸，⚠） |
| 怪奇物語 | 76（34） | 8.6（1.8M） | 9.1（511,918）snippet | Variety | 關鍵評論網 胡芩（台） |
| 牠：歡迎來到德利鎮 | 61（30） | 7.9（124K） | 8.4（50,283）snippet | Variety | 關鍵評論網 出前一廷（台） |
| 異形：地球 | 85（41） | 7.1（112K） | 6.4（31,177）snippet | The Hollywood Reporter | Tatler Asia Irene Chen（台／亞洲，⚠） |
| 星期三 | 66（26） | 8.0（514K） | 7.8（166,652）snippet | Los Angeles Times | 關鍵評論網 明蒂小姐（台） |

英文媒體分布（每家最多 3 部）：Variety 3、Vulture 3、The Guardian 2、The Hollywood Reporter 2、IndieWire 2、Slate 2、Los Angeles Times 2、The Atlantic 1、The New Yorker 1。NYT、Telegraph、BBC Culture 沒有用到（見缺口）。

中文媒體分布：關鍵評論網 6、釀電影 3、電影神搜 2、GQ TW／鳴人堂／Vogue TW／Tatler／大紀元各 1、北京青年報 2（陸）。明蒂小姐一人寫了 3 篇。

## 重點分歧（給寫作參考）

1. **評論高、觀眾低**：《萬中選一》（MC 87／Popcorn 68／IMDb 7.9）、《異形：地球》（MC 85／Popcorn 65／豆瓣 6.4）。兩部都是「慢、概念先行」的作品。
2. **觀眾高、評論低**：《星期三》（MC 66 vs IMDb 8.0）、《曼達洛人》（MC 70、Slate 首集負評 vs 豆瓣 9.2）、《牠：歡迎來到德利鎮》（MC 61 vs 豆瓣 8.4）、《異塵餘生》《企鵝人》（MC 72–73 vs RT 93–95%）。
3. **豆瓣明顯低於西方**：《3 體》（6.7，涉及原著改編與中國題材的民族情緒）、《異形：地球》（6.4）。
4. **豆瓣明顯高於 IMDb**：《權力遊戲》9.5、《曼達洛人》9.2、《怪奇物語》9.1、《最後生還者》9.0（豆瓣只算 S1，IMDb 是全劇總分；長壽劇後期季數拉低 IMDb，是主要原因之一）。
5. **Metacritic 和 RT 落差**：多部劇 RT 90% 以上，但 MC 只有 69–75（HotD、AKOTSK、Penguin、Peacemaker、Fallout）。RT 算的是正評比例，MC 是加權平均分，寫文時不要把兩者混成「好評度」。

## 缺口

1. **豆瓣評分人數多是 snippet**：14/18 來自豆列或搜尋摘要，摘要日期從 2023 到 2026 都有，人數不是當前值。豆瓣 subject 頁直抓會導到 `sec.douban.com` 驗證頁（沒有繞過），Exa 抓 m.douban 回 403 或逾時。只有 GoT（無人數）、HotD、Andor、Boys、Penguin、Severance、Pluribus 有 cache 頁。
2. **《3 體》豆瓣目前分數無法查證**：快取的 subject 頁沒有評分區塊，6.7／6.8 是 2024 年 3 月開播一週內的新聞數字。
3. **豆瓣 subject ID 未取得**：怪奇物語 S1、使女的故事 S1、異形：地球 S1。使女的故事 S1 的評分人數沒有可信來源（只有盜版站轉錄，未採用）。異塵餘生 S1 沒有人數。
4. **中文評論不符「台灣優先」或媒體名單**：黑袍糾察隊、使女的故事只找到中國大陸報紙（北京青年報）；七王國的騎士用大紀元；人生切割術、異形：地球用生活風格雜誌（Vogue TW、Tatler）。這 5 部都建議人工再找放映週報、端傳媒或 Openbook。端傳媒和放映週報這次都沒有搜到相關劇評。
5. **中文評論多為 partial**：除釀電影 3 篇（Groundlane read）外，其餘來自 Exa 搜尋回傳的內文 highlights，沒有逐頁用 fetch 確認全文。關鍵評論網的作者頁、列表頁被 browser challenge 擋住（未繞過）。
6. **評論季數不一**：中文評論有 6 篇評的是最新季或全劇（HotD S3、Andor 全劇、ST S5、Wednesday S2、Mando S1–2、Handmaid S4 視角），英文《曼達洛人》（Slate）和《龍族前傳》（Guardian）只評首集。
7. **被擋的英文媒體**：The Telegraph 回 402（TollBit），原本預定給 Mandalorian、Alien: Earth、Wednesday，已改用其他媒體。NYT 回 403，Exa 只拿到付費牆前的前言，沒有用。The Atlantic（Andor）只讀到前段。
8. **IMDb 是全劇分數**：沒有抓 S1 單季分數。IMDb 頁有「S1 Episodes x.x Average」，部分已讀到：GoT 9.0、HotD 8.7、AKOTSK 8.9、Andor 8.3、Peacemaker 8.5、Boys 8.5、Penguin 8.9、Pluribus 8.0、3BP 7.6、Fallout 8.3。要做單季對照的話可以用這些。

## 工具降級紀錄（toolDegradation）

- Metacritic：Groundlane `web_extract`（render=never），18/18 成功，沒有降級。
- IMDb：Groundlane 回 WAF 空頁（約 2 KB）→ Jina `read_url`（不帶 API key，回傳全文，5 部）→ Exa `web_fetch_exa`（maxCharacters 700–1200，13 部）。
- 豆瓣：Groundlane 導到 `sec.douban.com` 驗證頁，停止直抓 → Exa `web_fetch_exa`（GoT 成功；m.douban 多數回 CRAWL_HTTP_403 或 LIVECRAWL_TIMEOUT）→ Exa `web_search_exa`（豆列、快取的 subject 頁與 episode 頁）。
- 英文評論：Groundlane `web_fetch` 成功讀到 Guardian、Variety、Vulture、THR、LAT、Slate、New Yorker。Telegraph 402（TollBit）、NYT 403、Atlantic 403（Cloudflare），未繞過。IndieWire 用 Groundlane 只抽到副標或逾時 → Exa `web_fetch_exa`。
- 中文評論：Groundlane `web_search`（tavily）＋Exa `web_search_exa`。關鍵評論網作者頁 `render=always` 遇到 browser-challenge，未繞過。
- 沒有用到 Tavily 直連、Firecrawl、cloudflare `get_url_markdown`。
