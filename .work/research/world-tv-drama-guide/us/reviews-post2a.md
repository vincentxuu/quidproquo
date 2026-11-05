# Post 2a 評價資料表：美劇 12 部（Metacritic／IMDb／豆瓣／英文評論／中文評論）

研究日期：2026-11-05。RT 分數已在 `factsheets-post2a.md`，這裡不重抓，只在「分歧」欄引用。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態標記 |
|---|---|---|---|
| Metacritic S1 Metascore＋評論數 | `metacritic.com/tv/<slug>/season-1/`，抓 `Metascore N out of 100` 和 `Based on / See All N Critic Reviews` | Groundlane `web_extract`（render=never） | 12/12 read |
| IMDb 用戶評分（**整部劇**，非單季） | `imdb.com/title/<id>/` 標題列 `IMDb RATING x.x/10 N` | Exa `web_fetch_exa` | 12/12 read |
| 豆瓣 S1 評分 | `movie.douban.com/subject/<id>/` | 沒有直抓（post1／post3 已確認會導到 `sec.douban.com` 驗證頁，不繞過）。改用 Exa 索引內的快取 subject 頁（標 **cache**，快照日期不明）；其餘用豆列／搜尋摘要（標 **snippet**，附摘要裡的日期） | 4 cache（含 1 部只有分數）、8 snippet |
| 英文評論 | Metacritic `critic-reviews/?season=season-1` 頁 HTML 裡的外部連結 → 讀原文；MC 列表沒有的改用 Tavily 搜尋 | Groundlane `web_fetch`；IndieWire 改 Exa | 10 read、2 partial |
| 中文評論 | 台灣指定媒體優先（釀電影、關鍵評論網、鳴人堂、電影神搜、放映週報、端傳媒、報導者） | Tavily search（include_domains）、Groundlane `web_search`、Exa search；讀文用 Groundlane `web_fetch`，關鍵評論網用 Tavily `tavily_extract` | 見各條 |

標記說明：**read** = 工具實際讀到頁面內文；**partial** = 只讀到前段（輸出截斷）；**cache** = Exa 快取副本（非即時）；**snippet** = 只看到搜尋摘要，不算讀到原頁。

> 注意：IMDb 是整部劇的總評分，Metacritic 與豆瓣是第 1 季。迷你劇（Mare、Ripley）三者對得上；長壽劇（BCS、HoC、True Detective、Fargo）差很多。
>
> **Metacritic slug 陷阱**：`/tv/house-of-cards/` 是 1990 年 BBC 原版（85 分／11 則，頁面描述「This four-episode British miniseries…」），美版要用 `/tv/house-of-cards-2013/`。

---

## 1. Breaking Bad 絕命毒師

1. **Metacritic S1**：**73**（27 則）。https://www.metacritic.com/tv/breaking-bad/season-1/ （read）
2. **IMDb**：**9.5/10**（2.7M 票）。https://www.imdb.com/title/tt0903747/ （read，Exa）
3. **豆瓣 S1**：**9.2**（**384,785** 人）。Exa 快取的 m.douban subject 頁（https://m.douban.com/movie/subject/2373195/ ，cache，「No.7高分經典美劇榜」）。豆列「EN TV」2026-02-20 摘要為 382,224 人（snippet），數字一致。
4. **英文評論**：Slate，Troy Patterson，2008-01-25，〈No Country for Old Meth Dealers〉（網址標題 Breaking Bad reviewed.）。https://slate.com/culture/2008/01/breaking-bad-reviewed.html （read）
   - 摘要：像柯恩兄弟執導的《單身毒媽》（*Weeds*），是只看得見一半笑點的黑色喜劇；Cranston 把好爸爸形象翻成畏縮的中年男；整體野心大於成果，但還是好看。
   - 原文：「Its achievement rarely matches its ambitions, but the effect is still pretty dope.」
5. **中文評論（台灣）**：關鍵評論網，守夜人電影報（專欄筆名），2016-05-22，〈《絕命毒師》沃特與《新鐵金剛：智破天凶城》龐德的中年危機〉。https://www.thenewslens.com/article/40311 （read，Tavily extract）
   - 摘要：專談前兩季的沃特懷特。作者承認很多人嫌第二季沉悶，但認為前兩季成功打造出掙扎、絕望的中年男人，讓觀眾同情主角；把劇名比作台語的「走針」。（評的是 S1–S2。作者是筆名專欄，不是真名。）
6. **分歧**：本表「開局最弱、口碑最高」的例子。S1 的 Metacritic 只有 73、RT 86%，Slate 也是保留的正評；但 IMDb 9.5（IMDb Top 250 TV #1）、豆瓣 9.2，最終季 RT 97%／98%（factsheet）。寫作時可提醒讀者「第一季是暖身」。

## 2. Better Call Saul 絕命律師

1. **Metacritic S1**：**78**（43 則）。https://www.metacritic.com/tv/better-call-saul/season-1/ （read）
2. **IMDb**：**9.0/10**（876K）。https://www.imdb.com/title/tt3032476/ （read，Exa）
3. **豆瓣 S1**：**9.3**（**185,100** 人，豆列「陈小姐的十五楼'影单」2024-03-22 摘要）。https://m.douban.com/doulist/158206906/ （snippet）。subject ID 從劇評頁網址得知：https://movie.douban.com/subject/25726259/ 。澎湃新聞 2022-04-28 寫豆瓣「從第一季的 9.3 分上漲到第六季的 9.9 分」（https://www.thepaper.cn/newsDetail_forward_17843912 ，snippet）。
4. **英文評論**：The Hollywood Reporter，Tim Goodman，2015-01-21，〈'Better Call Saul': TV Review〉。https://www.hollywoodreporter.com/tv/tv-reviews/better-call-saul-tv-review-765600 （read）
   - 摘要：提醒觀眾這不是喜劇、也不是《絕命毒師》；第一集比預期慢，但結尾的懸念很好，是一部有自己節奏的新劇。（根據前兩集寫成。）
   - 原文（Bottom Line）：「starts with a slow burn but is full of promise and potential」
5. **中文評論（台灣）**：電影神搜，重點就在括號裡（作者筆名），2020-05-18，〈【劇評】《絕命律師》第五季：在已知結局的命運之前，仍然向前行〉。https://news.agentm.tw/109771/ （read）
   - 摘要：認為本劇不只是前傳，而是「真切地活出了自己的生命」，核心是命運；第五季最可貴的是 Kim Wexler 承認自己身上的灰色。（評的是 S5；作者是筆名。）
6. **分歧**：評論與觀眾一致偏高（RT S1 97%、Popcorn 95%），但 Metacritic 只有 78，是「普遍正評、少數滿分」的分布。豆瓣逐季上升到 9.9（snippet），常被拿來和《絕命毒師》比高下。Emmy 劇情類六度提名、零得獎（factsheet tag），可當「最被獎項虧待的劇」話題。

## 3. The Wire 火線重案組

1. **Metacritic S1**：**79**（22 則）。https://www.metacritic.com/tv/the-wire/season-1/ （read）
2. **IMDb**：**9.3/10**（444K）。https://www.imdb.com/title/tt0306414/ （read，Exa）
3. **豆瓣 S1**：**9.4**。Exa 快取的 subject 頁顯示 9.4，但沒有評分人數（https://movie.douban.com/subject/1418199/ ，cache）；人數 **42,000** 來自豆列「IMDB-Top 250 电视剧」2025-09-23 摘要（https://m.douban.com/doulist/162615435/ ，snippet）。
4. **英文評論**：Variety，Steven Oxman，2002-05-31，〈The Wire〉。https://variety.com/2002/tv/reviews/the-wire-4-1200549294/ （read）
   - 摘要：不如 HBO 其他原創劇那麼搶眼，因為它刻意在官僚的細節裡找戲劇；不無聊，反而很好看，是「成熟而重要」的電視劇。
   - 原文：「this police show rather boldly seeks drama in dullness」
5. **中文評論（台灣）**：**沒有找到指定媒體的專評**。最接近的是鳴人堂 林運鴻 2021-06-09 評《東城奇案》時提到本劇是「不朽經典」（read，但不是本劇專評，見第 9 部）。電影神搜〈影集界的無冕王！5 部未得艾美獎但絕不能錯過的…〉（https://news.agentm.tw/302607 ，snippet）是清單文。替代：方格子 漫步筆記〈關於火線重案組(The Wire)〉2024-07-30（https://vocus.cc/article/66a7abf9fd89780001b34ad8 ，snippet，個人部落格）。
6. **分歧**：首播時的評價是「好，但不驚艷」：Metacritic 79、RT S1 86%，共識還說「takes its time getting started」。二十年後卻是 BBC 2021 #1、NYT 2026 #2、IMDb 9.3、豆瓣 9.4。電影神搜清單文說它播出時「不叫好也不叫座」（snippet），是「事後封神」的典型。

## 4. True Detective 無間警探

1. **Metacritic S1**：**87**（41 則）。https://www.metacritic.com/tv/true-detective/season-1/ （read）
2. **IMDb**：**8.8/10**（778K）。https://www.imdb.com/title/tt2356777/ （read，Exa）
3. **豆瓣 S1**：**9.3**（**209,660** 人，豆列「True Detective」2023-08-22 摘要）。https://m.douban.com/doulist/156203088/ （snippet）。百度搜尋摘要轉錄 subject 頁為 9.3／221,247 人（snippet）；subject ID 未取得。
4. **英文評論**：The New Yorker，Emily Nussbaum，2014-02-23 上線（2014-03-03 刊），〈Cool Story, Bro〉（副標 The shallow deep talk of "True Detective."）。https://www.newyorker.com/magazine/2014/03/03/cool-story-bro （partial：讀到前段約 5,000 字元，輸出截斷）
   - 摘要：**這是反對意見**。她承認單看風格是一部好劇，但批評劇中女性角色全是紙片人、Rust 的哲學獨白是「宿舍深夜談話」，整部劇愛上了自己的推銷話術。
   - 原文（圖說）：「Though the show has movie-star charisma, it reeks of macho nonsense.」
   - 備註：MC 列表上的 THR、Variety、Slate 評論都是正評（連結已抽到，未讀）。選這篇是因為它是 S1 最有名的異議，寫作時要說明它不代表主流。
5. **中文評論（台灣）**：**沒有找到指定媒體的專評**。釀電影〈永遠不要當一個半吊子──馬修．麥康納〉（https://filmaholic.tw/people/61223fedfd897800019a1b47 ，snippet）是人物文，只提到本劇一段。替代：痞客邦 異界嚮導〈《無間警探》第一季隨筆雜記〉2018-04-24（https://drfive.pixnet.net/blog/posts/8225051758 ，partial，Exa highlights，個人部落格）：認為本劇讓一個虛無、厭世的主角完成「向理想人性的光輝面朝聖的翻轉之旅」。
6. **分歧**：選集劇各季落差是本表最大的。S1 MC 87、RT 91%，但 S2 RT 跌到 47%／31%；S4《闇夜國度》評論 93% 卻只有 55% 觀眾分數（factsheet）。S1 本身也有 Nussbaum 這種強烈異議。IMDb 8.8 是全劇平均，寫作時建議只推 S1（PTT 推薦串也只推 S1/S2）。

## 5. Fargo 冰血暴

1. **Metacritic S1**：**85**（40 則）。https://www.metacritic.com/tv/fargo/season-1/ （read）
2. **IMDb**：**8.8/10**（478K）。https://www.imdb.com/title/tt2802850/ （read，Exa）
3. **豆瓣 S1**：**8.9**（**118,661** 人，豆列「IMDb欧美电视剧排名 20251210更新」摘要）。https://m.douban.com/doulist/1461637/ （snippet）。subject：https://m.douban.com/movie/subject/24297912 （ID 取自搜尋結果網址）。
4. **英文評論**：Los Angeles Times，Mary McNamara，2014-04-15，〈Review: 'Fargo' blazes a dark new trail on TV〉。https://www.latimes.com/entertainment/tv/showtracker/la-et-st-fargo-review-20140415-story.html （read）
   - 摘要：一開始像做了一場「熟悉卻偏了幾格」的夢，很快就站穩腳步；Billy Bob Thornton 的殺手是「自由接案的路西法」；不是前傳、續集或翻拍，而是電影的「調性伴奏」。
   - 原文：「a little more than kin, a little less than kind and a whole new breed of television」
5. **中文評論（台灣）**：**沒有找到指定媒體的專評**。關鍵評論網 葉郎〈【電影冷知識】《冰血暴》謀殺道具界的奧斯卡影帝〉（https://www.thenewslens.com/article/38579 ，snippet）談的是 1996 年電影的碎木機，不是影集。替代：豆瓣影評〈豆瓣9.6，当之无愧的神剧！〉天天美剧吧，2024-09-26（https://movie.douban.com/review/16204607/ ，partial，Exa highlights，地區：中國）。
6. **分歧**：本表評論與觀眾最一致的劇：RT S1 97%／97%、MC 85、豆瓣 8.9。S5 仍有 93%／89%（factsheet）。唯一的落差在豆瓣後期季（百度摘要：S4 7.7、S5 8.3，snippet），以及台灣端幾乎沒有討論（PTT 只出現在範圍外清單），和它在英美的地位不相稱。

## 6. Mindhunter 破案神探

1. **Metacritic S1**：**79**（25 則）。https://www.metacritic.com/tv/mindhunter/season-1/ （read）。正負分布 24 正、1 褒貶、0 負取自 Exa 搜尋回傳的同頁快取（cache）。
2. **IMDb**：**8.6/10**（409K）。https://www.imdb.com/title/tt5290382/ （read，Exa）
3. **豆瓣 S1**：**8.9**（人數不明）。界面新聞〈當深淵回以凝視：大衛·芬奇新劇《心靈獵人》如何成8.9分神作？〉寫「第一季豆瓣8.9分…第二季豆瓣8.8分」（https://www.jiemian.com/article/3462701.html ，snippet，日期不明）。豆瓣譯名《心灵猎人》。subject ID 未取得。
4. **英文評論**：IndieWire，Ben Travers，2017-10-12，〈'Mindhunter' Review: David Fincher's Netflix Return Debates the Origins of Evil — And It's Pretty Funny, Too〉。https://www.indiewire.com/criticism/shows/netflix-mindhunter-review-season-1-david-fincher-1201886179/ （partial：Groundlane 只抽到副標，Exa 讀到前段）
   - 摘要：像話很多、帶黑色幽默版的《索命黃道帶》；試播集冗長笨重，看兩集還不確定長期潛力，但方向純粹、美學出色、鉤子讓人放不下。（根據前兩集寫成。）
   - 原文：「its mission is pure, aesthetic outstanding, and hook undeniable」
5. **中文評論（台灣）**：釀電影，黃以曦，2020-11-17，〈《破案神探》：惡也是從小長大〉。https://filmaholic.tw/series/5fb358d6fd89780001f9729a （read）
   - 摘要：認為劇集真正的主題不是兇手的心靈奇觀，而是探員霍頓在一次次密室訪談中被動搖、改變的過程——「研究者無法是機器」；最迷人的是那些「洩漏真實抑或只是高明的表演」難以定奪的對話場面。（評兩季。）
6. **分歧**：評論（RT 96%、S2 99%）與觀眾（Popcorn 95%、PTT 推薦串 ×7）都很高，Metacritic 79 偏保守，原因是開頭慢（IndieWire 與 MC 上 Variety 都說試播集拖沓）。真正的爭議不在品質而在「沒有結局」：PTT 有人因此不推（candidates 檔，已從 tag 刪除）。

## 7. Narcos 毒梟

1. **Metacritic S1**：**77**（20 則）。https://www.metacritic.com/tv/narcos/season-1/ （read）
2. **IMDb**：**8.7/10**（539K）。https://www.imdb.com/title/tt2707408/ （read，Exa）
3. **豆瓣 S1**：**9.3**（**116,168** 人）。百度搜尋摘要轉錄的 subject 頁數字（snippet，日期不明）。subject：https://movie.douban.com/subject/25850640/ （ID 取自劇評頁網址）。另有盜版站轉錄 121,623 人，未採用。
4. **英文評論**：Variety，Brian Lowry，2015-08-18，〈'Narcos' Traces Strange History of Pablo Escobar on Netflix〉。https://variety.com/2015/tv/reviews/narcos-review-pablo-escobar-drama-netflix-1201570440/ （read）
   - 摘要：既是歷史課也是好看的劇，大量旁白像《四海好傢伙》；穿插真實新聞畫面很聰明；角色扁平，但「不是關於玩家，而是關於這場遊戲」。（根據前三集寫成。）
   - 原文：「the kind of binge-worthy TV addiction that Netflix was born to import」
5. **中文評論（台灣）**：**沒有找到指定媒體的專評**。DramaQueen 有劇頁與〈從《毒梟》到《創造安娜》！8部Netflix真人實事改編影集推薦〉（snippet，推薦清單，非署名劇評）。替代：豆瓣影評〈《毒枭》：交织的魔幻与现实〉，載於《电影世界》2015 年 10 月（https://movie.douban.com/review/7640749/ ，partial，Exa highlights，作者未讀到，地區：中國）：以「魔幻現實主義」定位本劇，稱其敘事格局比《絕命毒師》大、更外化。
6. **分歧**：**觀眾遠高於評論**：RT S1 只有 78%（共識說「lacks sympathetic characters」），Popcornmeter 卻是 95%；豆瓣 9.3、IMDb 8.7。評論嫌角色扁平、套路熟悉，觀眾愛它的節奏和真實事件。

## 8. Ozark 黑錢勝地

1. **Metacritic S1**：**66**（29 則）。https://www.metacritic.com/tv/ozark/season-1/ （read）
2. **IMDb**：**8.4/10**（402K）。https://www.imdb.com/title/tt5071412/ （read，Exa）
3. **豆瓣 S1**：**8.4**（**26,020** 人）。分數來自 Exa 快取的 subject 頁（https://movie.douban.com/subject/26735549/ ，cache，無人數）；人數來自同 subject 第 3 集頁側欄的快取（https://movie.douban.com/subject/26735549/episode/3/ ，cache）。
4. **英文評論**：Vulture，Jen Chaney，2017-07-19，〈Netflix's Ozark Falls Somewhere Between Bloodline and Breaking Bad〉。https://www.vulture.com/2017/07/ozark-tv-review.html （read，前段約 5,000 字元）
   - 摘要：很多元素像借來的（Scorsese 式旁白、《絕命毒師》式墮落），中段情節越疊越多、有點累；但 Bateman 與 Laura Linney 的層次演出讓它仍然好看。
   - 原文：「sometimes leaning more toward the contrived than the believable」
5. **中文評論（台灣）**：**沒有找到指定媒體的專評**。電影神搜只有新聞與艾美獎報導（snippet）。替代：澎湃新聞〈《黑钱胜地》：普通人的堕落〉（https://m.thepaper.cn/kuaibao_detail.jsp?contid=6847794 ，partial，Exa highlights，作者與年份未讀到，內文談第 3 季，地區：中國）：認為它是「後毒師時代」風格上最接近《絕命毒師》的作品。
6. **分歧**：**本表評論最低、觀眾差距最大的一部**：MC S1 66、RT 70%，但 Popcornmeter 92%、IMDb 8.4。之後評論逐季回升（S4 RT 85%）、觀眾反而下滑（S4 Popcorn 72%）（factsheet）。Emmy 劇情類三度提名，代表業界比 S1 影評更買單。

## 9. Mare of Easttown 東城奇案

1. **Metacritic S1**：**81**（42 則）。https://www.metacritic.com/tv/mare-of-easttown/season-1/ （read）
2. **IMDb**：**8.4/10**（230K）。https://www.imdb.com/title/tt10155688/ （read，Exa）
3. **豆瓣**：**8.8**（人數不明）。百度搜尋摘要轉錄 subject 頁「犯罪類美劇榜 No.12 8.8」（snippet）；一篇 2025-03-23 的轉載清單寫「8.8分/17万+」（snippet，未採用為人數）。開播期間曾到 9.0–9.1（澎湃 2021-06-09、杭州網 2021-06-11，snippet）。豆瓣譯名《东城梦魇》。subject：https://m.douban.com/movie/subject/30441731/ （ID 取自劇評頁網址）。
4. **英文評論**：The Guardian，Lucy Mangan，2021-04-19，〈Mare of Easttown review – Kate Winslet triumphs in a moreish murder mystery〉。https://www.theguardian.com/tv-and-radio/2021/apr/19/mare-of-easttown-review-kate-winslet-hbo-murder-mystery （read）
   - 摘要：一部刻意不光鮮的美國小鎮劇，社區研究和主線命案同樣重要；Winslet 在生涯後段交出代表作；每個角色都真實，讓人在乎每個小細節。
   - 原文：「a millefeuille of misery, as exquisitely layered and as moreish as the real thing」
5. **中文評論（台灣）**：鳴人堂，林運鴻，2021-06-09，〈沒落小鎮的真正罪惡：《東城奇案》中的賣淫、毒癮與家庭失能〉。https://opinion.udn.com/opinion/story/120617/5518457 （read）
   - 摘要：把本劇讀成鐵鏽帶藍領社區的結構性失能——男性暴力、毒癮、自殺在小鎮裡代代相傳；Mare 不討喜、有道德瑕疵，「罪惡很可能不是個人因素，而是美國社區的結構性失能」。
6. **分歧**：各方都高（RT 95%／94%、MC 81、豆瓣 8.8），是本表最沒有爭議的一部。唯一的雜音在結局：RT 共識說「ambitions at times exceed its reach」；豆瓣高讚劇評有〈狗血结局崩塌，可惜了凯特的演技〉（snippet）。豆瓣分數從 9.1 回落到 8.8，也可能反映這點。

## 10. Task 特遣任務

1. **Metacritic S1**：**77**（34 則）。https://www.metacritic.com/tv/task/season-1/ （read）
2. **IMDb**：**7.9/10**（83K）。https://www.imdb.com/title/tt28013708/ （read，Exa）
3. **豆瓣 S1**：**8.2**（**6,509** 人，豆列「HBO电视网原创剧集」摘要，日期不明）。https://m.douban.com/doulist/1350845/ （snippet）。豆瓣譯名《特别小组》；豆瓣影評 2025-11-25 寫「豆瓣评分目前也从7.2暴涨至8.2」（snippet）。subject ID 未取得。
4. **英文評論**：Variety，Alison Herman，2025-08-28，〈'Task' Review: 'Mare of Easttown' Follow-Up Is Riveting〉。https://variety.com/2025/tv/reviews/task-review-hbo-mark-ruffalo-1236499057/ （read，前段約 5,000 字元）
   - 摘要：不是單一主角的角色研究，也不是推理劇，而是 FBI 探員與搶匪的貓捉老鼠；角色在紙上有點套路，但演員和整個群戲把它撐起來，張力十足。
   - 原文：「Like “Mare” before it, “Task” can be unrelentingly grim」
5. **中文評論（台灣）**：**沒有找到指定媒體的專評**。找到的台灣文章：宅宅新聞〈來顆爛番茄｜《特遣任務（Task)》馬克魯法洛主演 不期不待中好評破表的黑馬劇〉2025-10-08（https://news.gamme.com.tw/1772413 ，snippet，非指定媒體、作者未讀到）；Vanny's Note〈HBO神劇《特遣任務》…〉2025-11-22（https://vannyma.com/posts/hbo-show-mission-human-nature/ ，snippet，個人部落格）。
6. **分歧**：**評論高、觀眾明顯較冷**：RT 96% 但 Popcornmeter 78%、IMDb 7.9（本表最低）、豆瓣 8.2（開播時 7.2）。RT 觀眾留言也兩極，有人說節奏慢、劇情「confusing」（RT 頁，cache）。Variety 和 RT 共識都提到「unrelentingly bleak」，可能是觀眾分數較低的原因之一（推論）。

## 11. Ripley 雷普利

1. **Metacritic S1**：**76**（43 則）。https://www.metacritic.com/tv/ripley/season-1/ （read）
2. **IMDb**：**8.1/10**（71K）。https://www.imdb.com/title/tt11016042/ （read，Exa）
3. **豆瓣**：**8.4**（人數不明）。豆瓣影評〈一口气看完，Netflix高分新作爽翻了〉2024-04-11 寫「目前豆瓣评分 8.4」（https://movie.douban.com/review/15871047/ ，snippet）；另一個網站寫 8.6（howgo.cc，snippet，未採用）。兩個來源都是上線一週左右的數字，現值未查證。subject ID 未取得。
4. **英文評論**：Vulture，Roxana Hadadi，2024-04-04，〈The Remorseless Mr. Ripley〉（頁面標題 'Ripley' Review: A Deliciously Mean Adaptation）。https://www.vulture.com/article/ripley-netflix-series-review-andrew-scott.html （read，前段約 5,000 字元）
   - 摘要：Andrew Scott 演得情感疏離到近乎外星人；黑白攝影令人著迷；不是單純的吃掉富人故事，但對上流社會的冷嘲很過癮；建議不要一次追完，慢慢看。
   - 原文：「its sneering meanness toward the upper class is delicious」
5. **中文評論（台灣）**：電影神搜，艾米希莉 Amesily，2024-04-10，〈【劇評】Netflix《雷普利》：犯罪經典再現！不只劇情更忠於原著，新版雷普利更危險迷人〉。https://news.agentm.tw/277272/ （read）
   - 摘要：比 1999 年電影版更貼近原著，節奏慢但更細膩，「像在讀文學著作」；黑白攝影讓每格都像畫；Andrew Scott 是湯姆雷普利的最佳選角。
6. **分歧**：評論界的年度榜單很愛它（Vulture、THR 共 5 位評論人排進前 7，factsheet tag），但 Metacritic 只有 76、RT 86%，觀眾 82%，屬於「榜單愛、平均分普通」。慢節奏與黑白影像是主要分歧點：電影神搜說它「削弱犯罪懸疑片該有的驚悚刺激感」。

## 12. House of Cards 紙牌屋

1. **Metacritic S1**：**76**（25 則）。https://www.metacritic.com/tv/house-of-cards-2013/season-1/ （read；**不是** `/tv/house-of-cards/`，那是 BBC 原版）
2. **IMDb**：**8.6/10**（565K）。https://www.imdb.com/title/tt1856010/ （read，Exa）
3. **豆瓣 S1**：**9.3**。Exa 快取的 subject 頁顯示 9.3、短評 50,022 條，但沒有評分人數（https://movie.douban.com/subject/6037429/ ，cache）；人數 **236,467** 來自豆列「世界各国高分电视剧」2014-11-22 摘要（https://www.douban.com/doulist/20992352/ ，snippet，數字很舊）。另一個聚合站寫 9.2／167,711 票（wmdb.tv，snippet，未採用）。
4. **英文評論**：The Hollywood Reporter，Tim Goodman，2013-01-26，〈House of Cards: TV Review〉。https://www.hollywoodreporter.com/tv/tv-reviews/house-cards-netflix-tv-review-415589/ （read，前段約 5,000 字元）
   - 摘要：Netflix 第一部重量級原創，製作像 HBO、Showtime 一樣光鮮；Spacey 用南方口音把每句台詞都說到位；打破第四面牆是冒險的選擇。（根據 Fincher 執導的前兩集寫成。）
   - 原文（Bottom Line）：「Kevin Spacey shines in this heavyweight new contender in the drama category」
5. **中文評論（台灣，媒體不在名單內）**：博客來 OKAPI 閱讀生活誌，何曼莊，2015-04-22，〈【政治太可怕，掀開紙牌屋】何曼莊：狐狸先生的自白〉。https://okapi.books.com.tw/article/3604 （partial，Exa highlights）
   - 摘要：把 Underwood 夫妻比作只偷最好的雞的狐狸；打破第四面牆讓觀眾不知不覺成了他的同謀；指出他的錯誤是太成功、沒朋友。（寫於前三季時期。）⚠ OKAPI 不在指定名單內。替代：GQ Taiwan 馬欣 2014-05-23〈2大超夯美劇點評：《紙牌屋》VS.《冰與火之歌》〉，但已在 reviews-post1 用於《權力遊戲》，不重複使用。
6. **分歧**：S1 是「觀眾比評論熱」：MC 76、RT 87%，Popcornmeter 97%、豆瓣 9.3。真正的分歧在結尾：S6 RT 65%、Popcornmeter 只剩 19%（factsheet），是本表最大的崩盤，和 Spacey 遭解約、最終季改寫直接相關。寫作時建議說明「前四季為主，最終季可視情況跳過」（編輯判斷）。

---

## 總表

| 劇 | Metacritic S1（評論數） | IMDb（票數） | 豆瓣 S1（人數） | 英文評論 | 中文評論（地區） |
|---|---|---|---|---|---|
| 絕命毒師 | 73（27） | 9.5（2.7M） | 9.2（384,785）cache | Slate | 關鍵評論網 守夜人電影報（台，筆名） |
| 絕命律師 | 78（43） | 9.0（876K） | 9.3（185,100）snippet | The Hollywood Reporter | 電影神搜 重點就在括號裡（台，筆名） |
| 火線重案組 | 79（22） | 9.3（444K） | 9.4（42,000）cache＋snippet | Variety | ⚠ 無專評（替代：方格子部落格，snippet） |
| 無間警探 | 87（41） | 8.8（778K） | 9.3（209,660）snippet | The New Yorker（partial，異議） | ⚠ 無專評（替代：痞客邦 異界嚮導，partial） |
| 冰血暴 | 85（40） | 8.8（478K） | 8.9（118,661）snippet | Los Angeles Times | ⚠ 無專評（替代：豆瓣 天天美剧吧，陸） |
| 破案神探 | 79（25） | 8.6（409K） | 8.9（人數不明）snippet | IndieWire（partial） | 釀電影 黃以曦（台） |
| 毒梟 | 77（20） | 8.7（539K） | 9.3（116,168）snippet | Variety | ⚠ 無專評（替代：豆瓣／《电影世界》，陸） |
| 黑錢勝地 | 66（29） | 8.4（402K） | 8.4（26,020）cache | Vulture | ⚠ 無專評（替代：澎湃新聞，陸） |
| 東城奇案 | 81（42） | 8.4（230K） | 8.8（人數不明）snippet | The Guardian | 鳴人堂 林運鴻（台） |
| 特遣任務 | 77（34） | 7.9（83K） | 8.2（6,509）snippet | Variety | ⚠ 無專評（替代：宅宅新聞，snippet） |
| 雷普利 | 76（43） | 8.1（71K） | 8.4（人數不明，2024-04）snippet | Vulture | 電影神搜 艾米希莉 Amesily（台） |
| 紙牌屋 | 76（25） | 8.6（565K） | 9.3（236,467，2014）cache＋snippet | The Hollywood Reporter | OKAPI 何曼莊（台，⚠ 非名單） |

英文媒體分布（每家最多 3 部）：Variety 3、The Hollywood Reporter 2、Vulture 2、Slate 1、The New Yorker 1、Los Angeles Times 1、IndieWire 1、The Guardian 1。NYT、Atlantic、Telegraph、BBC 沒有用到（見缺口）。

中文媒體分布：電影神搜 2、關鍵評論網 1、釀電影 1、鳴人堂 1、OKAPI 1（非名單）；6 部沒有台灣指定媒體專評。

## 重點分歧（給寫作參考）

1. **評論低、觀眾高**：《黑錢勝地》（MC 66／RT 70% vs Popcorn 92%）、《毒梟》（RT 78% vs Popcorn 95%、豆瓣 9.3）、《紙牌屋》S1（MC 76 vs Popcorn 97%）。評論多嫌角色扁平或套路熟悉。
2. **評論高、觀眾低**：《特遣任務》（RT 96% vs Popcorn 78%、IMDb 7.9）、《無間警探：闇夜國度》（RT 93% vs Popcorn 55%）。
3. **開局普通、事後封神**：《絕命毒師》（S1 MC 73 → S5 RT 97%）、《火線重案組》（S1 MC 79、共識說慢熱 → BBC 2021 #1）。寫作時適合提醒「撐過第一季」。
4. **後期崩盤**：《紙牌屋》S6 Popcorn 19%；《無間警探》S2 RT 47%／31%。
5. **兩邊都穩**：《冰血暴》S1 97%／97%、《東城奇案》95%／94%、《破案神探》96%／95%。
6. **豆瓣普遍比 IMDb 高或持平**：本批 12 部豆瓣 S1 都在 8.2–9.4；最低是《特遣任務》8.2，和 IMDb 7.9 的「最低」一致。
7. **台灣討論度落差**：《冰血暴》《毒梟》在英美地位高，但 PTT／台灣媒體幾乎沒有討論（candidates 檔沒有 F／G tag，本輪也找不到台灣劇評）；《破案神探》《東城奇案》則是 PTT 推薦串 ×6–7 的熱門。

## 缺口

1. **6 部沒有台灣指定媒體的署名專評**：火線重案組、無間警探、冰血暴、毒梟、黑錢勝地、特遣任務。都試過 Tavily（include_domains 七家）、Groundlane、Exa；只找到新聞、清單文、人物文或個人部落格。建議人工再查放映週報、端傳媒、報導者的紙本／付費區，或接受「台灣部落格／PTT 心得」標註後使用。
2. **兩位中文作者是筆名**：絕命毒師（守夜人電影報）、絕命律師（重點就在括號裡）。都是指定媒體的專欄或投稿作者，但不是真名。
3. **中文評論的季數不一**：絕命毒師評 S1–S2、絕命律師評 S5、破案神探評兩季、紙牌屋評前三季時期；只有東城奇案、雷普利是單季全評。
4. **豆瓣多為 snippet**：8/12 的分數或人數來自豆列、百度摘要或新聞，日期從 2014 到 2025 都有；破案神探、東城奇案、雷普利沒有人數。豆瓣 subject ID 沒取得的有：無間警探 S1、破案神探 S1、特遣任務、雷普利。紙牌屋的 236,467 人是 2014 年的數字。
5. **英文評論多根據前幾集**：Better Call Saul（前 2 集）、Mindhunter（前 2 集）、Narcos（前 3 集）、House of Cards（前 2 集）。True Detective 選的是異議評論，引用時要說明。
6. **被擋或未使用的英文媒體**：NYT（Narcos 的 NYT 評論連結在 MC 列表上，post1／post3 都回 403，本輪沒試）、Telegraph（402 TollBit，沒試）、The Atlantic（Cloudflare，沒試）。MC 的 critic-reviews 頁在 render=never 下只帶出部分評論卡片，BCS 與 The Wire 抽不到任何目標媒體連結，改用搜尋。
7. **IMDb 是全劇分數**：沒有抓 S1 單季平均。

## 工具降級紀錄（toolDegradation）

- Metacritic：Groundlane `web_extract`（render=never），12/12 成功。`/critic-reviews/` 舊路徑回 404，改用 `/tv/<slug>/critic-reviews/?season=season-1`。
- IMDb 標題頁：Exa `web_fetch_exa`，12/12 成功（沒有先試 Groundlane，因 post1／post3 已確認會回 WAF 空頁）。
- 豆瓣：沒有直抓；Exa `web_search_exa` 取快取 subject 頁與豆列摘要。
- 英文評論：Groundlane `web_fetch` 讀到 Slate、THR、Variety、New Yorker、LA Times、Vulture、Guardian。IndieWire 只抽到副標 → Exa `web_fetch_exa`。Variety 2008 年 Breaking Bad 舊網址回 404，改用 Slate。
- 中文評論：Tavily search（include_domains）＋ Groundlane `web_search`（後段兩次 `RATE_LIMITED`）＋ Exa search。關鍵評論網用 Tavily `tavily_extract`（成功）；電影神搜、釀電影、鳴人堂用 Groundlane `web_fetch`（成功）。
- 沒有使用 Firecrawl、cloudflare `get_url_markdown`、Jina（本檔）；沒有使用盜版站資料或任何繞過人機驗證的方法。
