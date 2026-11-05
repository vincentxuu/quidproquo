# Post 4b 評價資料表：美劇喜劇 12 部（Metacritic／IMDb／豆瓣／英文評論／中文評論）

研究日期：2026-11-05。RT 分數已在 `factsheets-post4b.md`，這裡不重抓，只在「分歧」欄引用。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態標記 |
|---|---|---|---|
| Metacritic S1 Metascore＋評論數 | `metacritic.com/tv/<slug>/season-1/`，抓第一個 `Metascore N out of 100` 和 `See All N Critic Reviews`，並核對 `<title>` 是「… season 1 Reviews」 | Groundlane `web_extract`（render=never） | 12/12 read（WWDITS 的 slug 是 `what-we-do-in-the-shadows-2019`） |
| IMDb 用戶評分（**整部劇**，非單季） | `imdb.com/title/<id>/` 標題列 `x.x/10 N` | Exa `web_fetch_exa` | 12/12 read |
| 豆瓣 S1 評分 | `movie.douban.com/subject/<id>/` 或 `m.douban.com/movie/subject/<id>` | 沒有直抓（post1 已確認會導到 `sec.douban.com` 驗證頁，不繞過）。改用 Groundlane `web_search`（`domains=douban.com`，Tavily／Brave 後端）的搜尋摘要 | 12/12 **snippet**（快照日期不明；只有 2 部摘要帶評分人數） |
| 英文評論 | Exa `web_search_exa` 找原文 → Groundlane `web_fetch` 讀原文；IndieWire 用 Groundlane 只抽到副標，改用 Exa `web_fetch_exa` | 見各條 | 10 read、2 partial |
| 中文評論 | 台灣媒體優先：關鍵評論網、鳴人堂、電影神搜、釀電影、放映週報、端傳媒、報導者 | Groundlane `web_search`（domains 篩選）、Exa `web_search_exa`（回傳內文）、Tavily `tavily_extract`（關鍵評論網）、Groundlane `web_fetch`（電影神搜） | 見各條；**5 部找不到** |

標記說明：**read** = 工具實際讀到頁面內文；**partial** = 只讀到前段、單一段落或付費牆前；**snippet** = 只看到搜尋摘要，不算讀到原頁。

> 注意：IMDb 是整部劇的總評分，Metacritic 與豆瓣是第 1 季。長壽劇（BBT 12 季、The Office 9 季、Cobra Kai 6 季、WWDITS 6 季）尤其不能直接對齊。

---

## 1. Only Murders in the Building 破案三人行

1. **Metacritic S1**：**76**（34 則）。https://www.metacritic.com/tv/only-murders-in-the-building/season-1/ （read）
2. **IMDb**：**8.0/10**（208K）。https://www.imdb.com/title/tt11691774/ （read，Exa）
3. **豆瓣 S1**：**8.2**（人數不明）。〈大楼里只有谋杀第一季〉https://m.douban.com/movie/subject/35169965 （snippet，Tavily 摘要）
4. **英文評論**：Variety，Caroline Framke，2021-08-30，〈'Only Murders in the Building' Lets Selena Gomez, Steve Martin, Martin Short Make True Crime Charming: TV Review〉。https://variety.com/2021/tv/reviews/only-murders-in-the-building-selena-gomez-steve-martin-martin-short-review-1235050152/ （read，Groundlane；看過 8 集寫成）
   - 摘要：三位主角的化學反應是最大賣點，Martin 和 Short 一拍即合，Gomez 和 Martin 的友情線最動人；模仿真實犯罪 podcast 的段落有時流於平板，但劇集找到自己「好笑、怪、又有同理心」的位置時最好看，作者一晚看完 8 集。
   - 原文：「Their subsequent adventures, alternately screwball and soulful」
5. **中文評論（台灣）**：**未找到符合條件的評論**。關鍵評論網只有艾美獎名單提到本劇（snippet）；電影神搜 2023-08-11〈不敢相信 Prada 惡魔「梅姨」…《破案三人行》第三季 Disney+ 線上熱播中〉是署名「電影神搜」的宣傳稿，不是評論（https://news.agentm.tw/261753/ ，read）。找到的有內容的中文評論都是 vocus 個人部落格（雲緋gring、槑有想法），不在名單內，未採用。
6. **分歧**：RT S1 100%，Metacritic 76，代表「幾乎每篇都正面、但很少有人給滿分」。The Guardian 的 Adrian Horton 標題寫「hit-and-miss whodunnit」（Exa highlight，snippet），TVLine 說「As a murder mystery, it's just OK」（snippet）：多篇評論都說喜劇強過推理。觀眾端 IMDb 8.0、豆瓣 8.2 和評論界大致一致。

## 2. Atlanta 亞特蘭大

1. **Metacritic S1**：**90**（36 則）。https://www.metacritic.com/tv/atlanta/season-1/ （read）
2. **IMDb**：**8.6/10**（101K）。https://www.imdb.com/title/tt4288182/ （read，Exa）
3. **豆瓣 S1**：**9.0**（人數不明）。https://m.douban.com/movie/subject/26417192 （snippet）。同一組搜尋結果另顯示第 2 季 9.4（snippet）。
4. **英文評論**：Los Angeles Times，Robert Lloyd，2016-09-06，〈Review: Donald Glover's new FX series, 'Atlanta,' is a beautifully played comedy of place and character〉。https://www.latimes.com/entertainment/tv/la-et-st-donald-glover-atlanta-review-20160831-snap-story.html （read，Groundlane 全文；根據前 4 集）
   - 摘要：比 *Community* 寫實得多，調性略帶憂鬱但不悲觀；Glover 和編劇不喜歡交代背景，亞特蘭大的街景、濕熱感都很具體；它是一部關於音樂的劇，卻幾乎沒拍音樂創作，作者希望主角別太快成功。
   - 原文：「subtle and human, a beautifully played comedy of place and character」
5. **中文評論（台灣）**：**未找到**。關鍵評論網、電影神搜只有提到本劇的人物報導（例如 LaKeith Stanfield 側寫，snippet），沒有專評。
6. **分歧**：本批評價最一致的一部：MC 90、RT 98%、Popcorn 91%、IMDb 8.6、豆瓣 9.0。少數保留意見：Slate 的 Willa Paskin 認為 Glover 刻意壓抑自己的魅力（Exa highlight，snippet）；IndieWire 的 Ben Travers 說步調慢、女性角色不夠立體（snippet）。

## 3. Nobody Wants This 天作不合的我們

1. **Metacritic S1**：**73**（27 則）。https://www.metacritic.com/tv/nobody-wants-this/season-1/ （read）。注意：Exa 抓到的 critic-reviews 頁摘要寫「positive 38 (67%) / mixed 16 / negative 3」，和季頁的 27 則對不上，可能是全劇彙整頁（snippet，未採用）。
2. **IMDb**：**7.7/10**（88K）。https://www.imdb.com/title/tt26933824/ （read，Exa）
3. **豆瓣 S1**：**7.6**（人數不明）。〈天作不合的我们第一季〉https://m.douban.com/movie/subject/36291042 （snippet）。PTT 心得文 2024-10-02 推文寫「豆瓣 7.4 imdb 8.2」（https://www.ptt.cc/bbs/EAseries/M.1727840266.A.526.html ，Exa highlight），是開播初期數字。
4. **英文評論**：The Guardian，Lucy Mangan，2024-09-26，〈Nobody Wants This review – Kristen Bell and Adam Brody's joyous romcom is as funny as When Harry Met Sally〉。https://www.theguardian.com/tv-and-radio/2024/sep/26/nobody-wants-this-review-kristen-bell-and-adam-brodys-joyous-romcom-is-as-funny-as-when-harry-met-sally （read，Groundlane；結尾一小段截斷）。Metacritic 列為 100 分（Exa highlight）。
   - 摘要：把兩位主角的相遇和《當哈利碰上莎莉》並列；Bell 和 Brody 的拌嘴戲最有火花，配角 Justine Lupe、Timothy Simons 都很出色；跨宗教戀愛的難處寫得真實，沒有標準答案。
   - 原文：「the funniest, sweetest, most scabrous, most romantic, most real thing」
5. **中文評論（台灣，媒體待商榷）**：ELLE Taiwan，Allie Hsieh、Queenie Shih，2024-10-24，〈Netflix《天作不合的我們》爛番茄新鮮度94％！原來真愛就是即使天作不合，仍勇於接納彼此的不同〉。https://www.elle.com/tw/entertainment/drama/g62660207/netflix-nobody-want-this/ （read，Exa 搜尋回傳全文）
   - 摘要：稱它是 2024 最甜的 Netflix 愛情喜劇，用「拉比 × 無神論者」探討現代關係裡的接納與表達感受，Joanne 的逃避型依附和 Noah 的成熟互相治癒。⚠ ELLE 是生活風格雜誌，不在指定名單；文章偏看點整理，不是批評性劇評。名單內媒體只找到艾美獎名單（關鍵評論網，snippet）。
6. **分歧**：RT 95% 但 MC 73、IMDb 7.7、豆瓣 7.6，**評論正面比例高、熱度不高**。IndieWire 的 Proma Khosla 批評劇本明顯偏向 Noah，Joanne 的生活被寫得很單薄（Exa highlight，snippet）；PTT 心得文也說後兩三集「高高拿起輕輕落下」（snippet）。

## 4. A Man on the Inside 臥底老紳士

1. **Metacritic S1**：**75**（23 則）。https://www.metacritic.com/tv/a-man-on-the-inside/season-1/ （read）
2. **IMDb**：**7.6/10**（48K）。https://www.imdb.com/title/tt26670955/ （read，Exa）
3. **豆瓣 S1**：**8.2**（**9,504** 人）。〈新手老卧底 第一季〉https://movie.douban.com/subject/36237131/ （snippet，Brave 摘要，摘要日期 2024-11-21；另一筆豆瓣劇評 2024-12-01 也寫「豆瓣8.2分」）
4. **英文評論**：The Hollywood Reporter，Daniel Fienberg，2024-11-21，〈'A Man on the Inside' Review: Ted Danson Earns Laughter and Tears in Mike Schur's Nursing-Home Comedy for Netflix〉。https://www.hollywoodreporter.com/tv/tv-reviews/a-man-on-the-inside-review-ted-danson-mike-schur-netflix-1236068002/ （read，Groundlane 前約 5,000 字；Exa highlight 補到結尾）
   - 摘要：說它是「養老院版《破案三人行》」不是貶義而是讚美；少見的電影（紀錄片）改編成影集而且延長得有道理；老年笑點守規矩、不刻薄，失智與喪偶的悲傷是全劇最認真的部分。
   - 原文（Bottom Line）：「A great cast walks the line between humor and heart.」
5. **中文評論（台灣，作者待確認）**：關鍵評論網編輯部，〈《關鍵評論網》編輯部的2025過年追劇片單（下）：六人行、魔術師、阿修羅——那些摩登家庭的大小事〉（前言署名王祖鵬，2025 年春節前）。https://www.thenewslens.com/article/248259 （read，Tavily extract）
   - 摘要：推薦人是《良善之地》迷，說本劇比 Schur 舊作平實冷靜，whodunnit 只是引子，真正要講的是老人之間的溫情、溝通與善終；稱它是「更加美化、髒話比較少，但同樣溫馨的《看護德瑞克》」，連結台灣的長照與失智議題。⚠ 這篇是 7 位編輯的合輯，**本劇段落的推薦人姓名沒有出現在擷取到的文字裡**（可能在圖片或小標），所以還不算「具名評論」。
6. **分歧**：RT 96%、豆瓣 8.2，但 MC 75、IMDb 7.6。第 2 季 Popcornmeter 掉到 70%（candidates 檔）。Rolling Stone 的 Alan Sepinwall 說它「isn't as laugh-out-loud funny」不如 Schur 前作好笑（Exa highlight，snippet）：多數評論把它當溫情劇而不是爆笑喜劇在誇。

## 5. The Big Bang Theory 宅男行不行

1. **Metacritic S1**：**57**（23 則）。https://www.metacritic.com/tv/the-big-bang-theory/season-1/ （read）。Exa 摘要顯示分布 8 正面、11 褒貶、4 負面，WaPo 的 Tom Shales 給 90、LA Times 的 Robert Lloyd 給 60（snippet）。
2. **IMDb**：**8.1/10**（950K）。https://www.imdb.com/title/tt0898266/ （read，Exa）
3. **豆瓣 S1**：**9.5**（人數不明）。〈生活大爆炸第一季〉https://m.douban.com/movie/subject/2156528 （snippet）。豆瓣頁「又名」欄列「宅男行不行 第一季(台)」（Brave 摘要，snippet）。
4. **英文評論**：Variety，Brian Lowry，2007-09-19，〈The Big Bang Theory〉。https://variety.com/2007/film/awards/the-big-bang-theory-2-1200556192/ （read，Groundlane 全文；根據試播集）
   - 摘要：大笑點不多但小笑點夠，是 CBS 週一喜劇時段「有希望」的新成員；Galecki 和 Parsons 討喜，劇本敢拿「聰明」做笑點；擔心 Leonard 追 Penny 這條線撐不久，四個宅男的互動比較有潛力。
   - 原文：「its colliding elements do generate enough little ones」
5. **中文評論（台灣）**：鳴人堂，周芷萱（沃草烙哲學），2019-09-25，〈周芷萱／《生活大爆炸》：令人著迷的不只是金髮波霸的幸運〉。https://opinion.udn.com/opinion/story/6685/4067559 （read，Exa 搜尋回傳全文）
   - 摘要：回應另一篇把 Penny 讀成「靠幸運嫁入菁英」的文章，認為劇集反覆用 Penny、Bernadette、Amy 打臉自以為是的高學歷異性戀男性，Penny 的轉職靠的是女性友誼與工作能力；同時承認劇中仍有刻板印象與對同性戀的問題。替代：關鍵評論網，傅紀鋼，2019-06-28，〈《宅男行不行》：本系列堪稱完美的結局，在於謝耳朵自戀了12季後終於覺醒〉（https://www.thenewslens.com/article/121348 ，read，Exa 全文；傅紀鋼也寫了本批 Cobra Kai，所以主選鳴人堂）。
6. **分歧**：**本批評論與觀眾落差最大**。S1 評論偏低（MC 57、RT 59%），AV Club 的 Scott Tobias 給 D+（Exa highlight，snippet）；觀眾卻很高（Popcorn 84%、IMDb 8.1、豆瓣 9.5），收視上 Nielsen 2023–2026 都在串流總榜前十（candidates 檔）。英文評論評的是 2007 年試播集，中文評論是完結後回顧，引用時要說明時間點不同。

## 6. The Office (US) 我們的辦公室／辦公室瘋雲

1. **Metacritic S1**：**62**（30 則）。https://www.metacritic.com/tv/the-office/season-1/ （read）
2. **IMDb**：**9.0/10**（858K）。https://www.imdb.com/title/tt0386676/ （read，Exa；IMDb Top rated TV #26）
3. **豆瓣 S1**：**8.6**（人數不明）。〈办公室第一季〉https://m.douban.com/movie/subject/10529476 （snippet）
4. **英文評論**：Slate，Dana Stevens，2005-03-22，〈What Have You Done With My Office?〉（副標「NBC body-snatches the BBC series.」）。https://slate.com/news-and-politics/2005/03/what-have-you-done-with-my-office.html （read，Groundlane；結尾截斷；根據試播集與第 2 集）
   - 摘要：英版粉絲看美版會像《安妮霍爾》裡重演抓龍蝦的場面一樣失落；Carell 把 Michael Scott 從頭重新詮釋，演得很好，但其他選角幾乎都失算，Jim／Pam 的感情線被縮成平淡的調情；第 2 集〈Diversity Day〉比照搬英版的試播集好，代表這部劇可能會越來越好。
   - 原文：「Carell understands the needy, unlovable Michael Scott from the inside out.」
5. **中文評論（台灣）**：**未找到**。關鍵評論網、鳴人堂、電影神搜、釀電影都沒有搜到本劇專評。
6. **分歧**：S1 評論普通（MC 62、RT 71%），IMDb 全劇卻是 9.0。S1 只有 6 集，而且試播集照搬英版，這是長壽喜劇「第一季最弱」的典型例子。Variety 的 Brian Lowry 也認為 Carell 演得比 Gervais 大、比較難忍受（Exa highlight，snippet）。寫文時建議提醒讀者撐過第 1 季。

## 7. Emily in Paris 艾蜜莉在巴黎

1. **Metacritic S1**：**58**（18 則）。https://www.metacritic.com/tv/emily-in-paris/season-1/ （read）
2. **IMDb**：**6.8/10**（146K）。https://www.imdb.com/title/tt8962124/ （read，Exa）
3. **豆瓣 S1**：**7.3**（人數不明）。〈艾米丽在巴黎第一季〉https://m.douban.com/movie/subject/30319440 （snippet）。同一組結果第 5 季 6.9（snippet）。
4. **英文評論**：Slate，Willa Paskin，2020-10-15，〈Emily in Paris Is the Hate Watch We Can't Stop Watching〉。https://slate.com/culture/2020/10/emily-in-paris-netflix-hate-watch.html （read，Groundlane；結尾截斷）
   - 摘要：這部劇在社群上幾乎被罵翻，但大家還是看完；它的特別之處是主角很「脆」：Emily 在職場上不是迷人的 Carrie Bradshaw 而是推土機；劇中的自我批評（Emily 很 basic、美國人愛俗套結局）其實是在替自己脫罪。
   - 原文：「There is only Emily, perkily focused on her uninspired work」
5. **中文評論（台灣）**：電影神搜，電影文學希米露，2020-10-10，〈【劇評】《艾蜜莉在巴黎》：瘋狂亞洲富豪的刻板醜陋印象〉。https://news.agentm.tw/137548/ （read，Exa 搜尋回傳全文）
   - 摘要：把 Emily 看成致敬奧黛麗赫本的都會仕女圖，但指出劇中對法國人的刻板印象，以及把華裔角色敏迪和她的上海姊妹淘寫成夜店灑香檳的「瘋狂亞洲富豪」，是調侃而不是讚美。
6. **分歧**：評論與觀眾都不高（MC 58、RT 61%、Popcorn 54%、IMDb 6.8），但 Netflix 收視一直很好（H2 2024 #4，candidates 檔）：**「大家邊罵邊看」**正是 Slate 那篇的主題。Vulture 的 Jen Chaney 反而說它「a treat」（Exa highlight，snippet），評論界意見分裂。第 5 季 Popcornmeter 37%（candidates 檔），觀眾口碑後期再下滑。

## 8. Cobra Kai 眼鏡蛇道館

1. **Metacritic S1**：**72**（**11 則**，樣本很小）。https://www.metacritic.com/tv/cobra-kai/season-1/ （read）
2. **IMDb**：**8.4/10**（248K）。https://www.imdb.com/title/tt7221388/ （read，Exa）
3. **豆瓣 S1**：**8.2**（人數不明）。〈眼镜蛇第一季〉https://m.douban.com/movie/subject/27188562 （snippet）。另一筆摘要顯示第 1 集頁「8.2 (1205人評價)」，那是單集評分人數，不是整季（snippet，未採用）。
4. **英文評論**：IndieWire，Hanh Nguyen，2018-05-02，〈'Cobra Kai' Review: 'Karate Kid' Sequel Series Perpetuates Orientalism While Telegraphing All of Its Punches〉。https://www.indiewire.com/criticism/shows/cobra-kai-review-karate-kid-youtube-red-1201959553/ （partial：Groundlane 只抽到標題與副標；Exa `web_fetch_exa` 讀到前段約 5,000 字，結尾未讀）
   - 摘要：情節高度可預測，從致敬滑向照抄原片；但 Johnny 這個「學到教訓卻不夠勵志」的前反派很新鮮，兩位老演員敢演得脆弱又可笑；問題是劇集跟著角色一起性別歧視（Sam 被邊緣化），東方主義也比原片更重。副標仍說它有「bumbling and earnest '80s throwback appeal」。
   - 原文：「comfortably predictable to the point where most of the plot points are telegraphed」
5. **中文評論（台灣）**：關鍵評論網，傅紀鋼，2020-09-26，〈影集《眼鏡蛇道館》：延續80年代《小子難纏》系列，懷舊重開機的必看佳作〉。https://www.thenewslens.com/article/141115 （partial：Tavily extract 讀到作者欄與大部分正文，中段有省略）
   - 摘要：編劇讓原片反派強尼變成真正主角、和拉魯索互換處境，再帶入美國青少年霸凌與被霸凌的複雜狀態，兼顧懷舊老影迷和新世代觀眾，「成為本世紀的影集經典之一」。（評前兩季。）同作者 2022-01-28 也寫過第 4 季劇評（https://www.thenewslens.com/article/162042 ，Exa highlight，作者欄未在摘要中顯示）。
6. **分歧**：RT S1 100% / Popcorn 95%、IMDb 8.4，但 MC 只有 72 而且只有 11 則：大報影評當年很少評 YouTube Red 的劇。IndieWire 的批評（東方主義、可預測）和台灣影評的「本世紀影集經典」形成明顯對比；Variety 的 Mekeisha Madden Toby 則肯定 Zabka「arguably delivering the most layered performance」（Exa highlight，snippet）。

## 9. The Marvelous Mrs. Maisel 漫才梅索太太

1. **Metacritic S1**：**80**（27 則）。https://www.metacritic.com/tv/the-marvelous-mrs-maisel/season-1/ （read）
2. **IMDb**：**8.6/10**（161K）。https://www.imdb.com/title/tt5788792/ （read，Exa）
3. **豆瓣 S1**：**8.8**（人數不明）。〈了不起的麦瑟尔夫人第一季〉https://m.douban.com/movie/subject/26813221 （snippet）。第 2 季 8.7（snippet）。
4. **英文評論**：Vulture，Jen Chaney，2017-11-28，〈Can We Talk About How Charming The Marvelous Mrs. Maisel Is?〉。https://www.vulture.com/2017/11/the-marvelous-mrs-maisel-review.html （read，Groundlane；結尾截斷；根據前 4 集）
   - 摘要：Midge 一開始像《Gilmore Girls》Lorelai 的反面，被丈夫拋棄後醉醺醺上台講了一段即興段子，劇集從這裡活起來；Sherman-Palladino 的快嘴對白、Donna Zakowska 的服裝和老電影氣質都到位，丈夫 Joel 是最平淡的角色。
   - 原文：「ignites every fire inside as Miriam」
5. **中文評論（台灣）**：電影神搜，龍貓大王通信，2020-02-19，〈進軍台灣！Amazon Prime Video 台灣區大哉問（中）：最推薦的 7 部 Prime Video 自製劇！〉第 6 則。https://news.agentm.tw/96242/ （partial：Groundlane pattern 抽到本劇段落與作者欄，這是 7 部推薦合輯）
   - 摘要：看似勵志劇，其實傳達更多，不只是女權浪潮；「充滿機智、風趣、與許多黃色笑話，所有成年觀眾都能樂在其中」；Brosnahan 是成功關鍵，唯一可抱怨的是好像沒有困境能難倒梅索太太，降低了緊張感。⚠ 是合輯中的一段，不是單篇專評。
6. **分歧**：本批第二一致的一部：MC 80、RT 94% / Popcorn 95%、IMDb 8.6、豆瓣 8.8。Variety 的 Maureen Ryan 說它「uneven」、家庭戲重複（Exa highlight，snippet）；LA Times 的 Lorraine Ali 說「a bit too whimsical」（snippet）；中文評論也提到缺乏緊張感，保留意見方向一致。

## 10. What We Do in the Shadows 吸血鬼家庭屍篇

1. **Metacritic S1**：**80**（30 則）。https://www.metacritic.com/tv/what-we-do-in-the-shadows-2019/season-1/ （read；`/tv/what-we-do-in-the-shadows/season-1/` 是 404）
2. **IMDb**：**8.5/10**（130K）。https://www.imdb.com/title/tt7908628/ （read，Exa；IMDb Top rated TV #195）
3. **豆瓣 S1**：**8.6**（人數不明）。〈吸血鬼生活第一季〉https://m.douban.com/movie/subject/30122624 （snippet）。第 5 季 8.8（snippet）。
4. **英文評論**：Vulture，Matt Zoller Seitz，2019-03-27，〈If You Liked What We Do in the Shadows As a Movie, You'll Love It As a TV Show〉。https://www.vulture.com/2019/03/what-we-do-in-the-shadows-fx-review.html （read，Groundlane；結尾截斷）
   - 摘要：保留電影的概念、調性和手持鏡頭，卻重寫故事與角色，新觀眾不用先看電影；「能量吸血鬼」Colin Robinson 是最大笑點來源；笑話常常走最直白的路線，但這正是觀眾想要的。
   - 原文：「an appealingly low-stakes series that's content to be silly and mildly perverse」
5. **中文評論（台灣）**：**未找到**。關鍵評論網的〈先別管《暮光之城》和《黑影家族》了，你看過真正厲害的吸血鬼喜劇嗎?〉（https://www.thenewslens.com/feature/film/18967 ，snippet）摘要內容是 2014 年電影（四個男吸血鬼、紐西蘭），不是影集，未採用。
6. **分歧**：評論與觀眾一致（MC 80、RT 95% / Popcorn 95%、IMDb 8.5、豆瓣 8.6），最終季 S6 仍 92% / 87%（candidates 檔）。NPR 的 Glen Weldon 說試播集開頭幾分鐘「map too neatly over the film's」；Slate 的 Dan Kois 說劇集沒有替原作神話添多少新東西，起初也嫌 Colin Robinson 這個角色拖戲，到第 3 集才轉為最愛（兩篇都是 Exa highlight，snippet）。

## 11. The Chair Company 椅子公司

1. **Metacritic S1**：**82**（26 則）。https://www.metacritic.com/tv/the-chair-company/season-1/ （read）
2. **IMDb**：**7.3/10**（20K）。https://www.imdb.com/title/tt31987295/ （read，Exa）
3. **豆瓣 S1**：**6.8**（**720** 人）。〈椅子公司 第一季〉https://movie.douban.com/subject/36839056/ （snippet，Brave 摘要）；同一 subject 的 m.douban 摘要寫 6.7（snippet，快照不同）。
4. **英文評論**：IndieWire，Ben Travers，2025-10-09，〈'The Chair Company' Review: Tim Robinson's Superb HBO Series Digs a Hilarious, Hypnotic Rabbit Hole〉。https://www.indiewire.com/criticism/shows/the-chair-company-review-tim-robinson-hbo-series-1235154393/ （partial：Exa `web_fetch_exa` 讀到前段約 5,000 字，後段來自 Exa highlight；看過 8 集中的 7 集）
   - 摘要：Robinson 把《I Think You Should Leave》裡各種暴躁、困惑的角色收斂成一個可以共感的 Ron；劇情像在一連串短劇外面套一條陰謀主線；作者最喜歡的讀法是「迷失在網路兔子洞」，也有《雙峰》式的夢境感。
   - 原文：「an HBO comedy that won't stop getting weirder」
5. **中文評論（台灣）**：**未找到**。名單內媒體都沒有專評；中文搜得到的只有豆瓣影評與 mtgamer 新聞稿。其中一篇豆瓣影評說「仅用六集」（實際 8 集），內容有誤，未採用。
6. **分歧**：**評論遠高於觀眾**：RT 100%、MC 82，但 Popcornmeter 68%、IMDb 7.3、豆瓣 6.8（本批最低）。Variety 的 Alison Herman 標題就寫「Will Polarize」，說它「not the most relaxing watch」（Exa highlight，snippet）；THR 的 Angie Han 也說「a tough sit」（snippet）。適合喜歡尷尬喜劇的讀者，寫文時要提醒門檻。

## 12. The Residence 白色官邸殺人事件

1. **Metacritic S1**：**67**（28 則）。https://www.metacritic.com/tv/the-residence/season-1/ （read）
2. **IMDb**：**7.7/10**（66K）。https://www.imdb.com/title/tt8740614/ （read，Exa）
3. **豆瓣**：**8.4**（人數不明）。〈白宫杀人事件〉https://m.douban.com/movie/subject/36230209 （snippet）；movie.douban 摘要另標「No.7 豆瓣2025評分最高英美新劇」（snippet）。
4. **英文評論**：The Guardian，Lucy Mangan，2025-03-20，〈The Residence review – this joyful murder mystery is eight hours of gorgeous, gleeful escapism〉。https://www.theguardian.com/tv-and-radio/2025/mar/20/the-residence-review-netflix-white-house-mystery-uzo-aduba （read，Groundlane 全文）
   - 摘要：132 個房間、150 多名嫌犯的「超級阿嘉莎」，Uzo Aduba 好笑到骨子裡；用國會聽證會的倒敘結構串起調查，處理得很聰明；不會改變世界，但能給你八小時的逃離。
   - 原文：「moreish, bingeable, a complete tonic」
5. **中文評論（台灣）**：電影神搜，艾米希莉 Amesily，2025-04-05，〈【劇評】Netflix《白色官邸殺人事件》：荒謬至極卻充滿言外之意，幽默諷刺的推理小品〉。https://news.agentm.tw/336976 （read，Groundlane；結尾截斷）
   - 摘要：像「政治版《白蓮花大飯店》遇上《破案三人行》」，以賞鳥技巧辦案很有特色，荒謬角色影射現實中仗勢作威作福的人；最可惜的是單集近一小時、資訊量過大，前半段冗長，但收尾漂亮。
6. **分歧**：MC 67 是本批第三低，但 RT 84%、豆瓣 8.4 偏高。評論分裂：Guardian 滿口稱讚，Radio Times 的 David Craig 說它「the most gimmicky, loud and annoying entry into the "cosy crime" genre」（Exa highlight，snippet），Variety 的 Aramide Tinubu 說它像「1000-piece puzzle」要有耐心（snippet）。中文評論和 Variety 一樣嫌長。Nielsen 2025 收視是新原創劇亞軍，Netflix 仍在 2025-07 取消（factsheet）。

---

## 總表

| 劇 | Metacritic S1（評論數） | IMDb（票數） | 豆瓣 S1（人數） | 英文評論 | 中文評論（地區） |
|---|---|---|---|---|---|
| 破案三人行 | 76（34） | 8.0（208K） | 8.2 snippet | Variety | **缺** |
| 亞特蘭大 | 90（36） | 8.6（101K） | 9.0 snippet | Los Angeles Times | **缺** |
| 天作不合的我們 | 73（27） | 7.7（88K） | 7.6 snippet | The Guardian | ELLE Taiwan Allie Hsieh、Queenie Shih（台，⚠） |
| 臥底老紳士 | 75（23） | 7.6（48K） | 8.2（9,504）snippet | The Hollywood Reporter | 關鍵評論網 編輯部合輯（台，⚠ 段落作者未具名） |
| 宅男行不行 | 57（23） | 8.1（950K） | 9.5 snippet | Variety | 鳴人堂 周芷萱（台） |
| 我們的辦公室／辦公室瘋雲 | 62（30） | 9.0（858K） | 8.6 snippet | Slate | **缺** |
| 艾蜜莉在巴黎 | 58（18） | 6.8（146K） | 7.3 snippet | Slate | 電影神搜 電影文學希米露（台） |
| 眼鏡蛇道館 | 72（11） | 8.4（248K） | 8.2 snippet | IndieWire（partial） | 關鍵評論網 傅紀鋼（台，partial） |
| 漫才梅索太太 | 80（27） | 8.6（161K） | 8.8 snippet | Vulture | 電影神搜 龍貓大王通信（台，partial 合輯） |
| 吸血鬼家庭屍篇 | 80（30） | 8.5（130K） | 8.6 snippet | Vulture | **缺** |
| 椅子公司 | 82（26） | 7.3（20K） | 6.8（720）snippet | IndieWire（partial） | **缺** |
| 白色官邸殺人事件 | 67（28） | 7.7（66K） | 8.4 snippet | The Guardian | 電影神搜 艾米希莉 Amesily（台） |

英文媒體分布（每家最多 3 部）：Variety 2、The Guardian 2、Slate 2、IndieWire 2、Vulture 2、The Hollywood Reporter 1、Los Angeles Times 1。NYT、The New Yorker、The Atlantic、Telegraph、BBC 沒有用到（New Yorker 只找到 Emily 的 Goings On 短評，篇幅太短，改用 Slate）。

中文媒體分布：電影神搜 3、關鍵評論網 2、鳴人堂 1、ELLE Taiwan 1（⚠）；缺 5 部。

## 重點分歧（給寫作參考）

1. **評論低、觀眾高**：《宅男行不行》（MC 57／RT 59% vs Popcorn 84%、豆瓣 9.5、Nielsen 前十）是最明顯的例子；《我們的辦公室》S1 MC 62 但全劇 IMDb 9.0（第一季最弱型）。
2. **評論高、觀眾低**：《椅子公司》（RT 100%、MC 82 vs Popcorn 68%、IMDb 7.3、豆瓣 6.8），尷尬喜劇的門檻。
3. **兩邊都不高、收視卻高**：《艾蜜莉在巴黎》（MC 58、IMDb 6.8，但 Netflix 收視前段）——「邊罵邊看」。
4. **兩邊都高而且一致**：《亞特蘭大》（MC 90）、《漫才梅索太太》（MC 80）、《吸血鬼家庭屍篇》（MC 80）。
5. **RT 和 Metacritic 落差大**：《破案三人行》（100% vs 76）、《臥底老紳士》（96% vs 75）、《天作不合的我們》（95% vs 73）、《眼鏡蛇道館》（100% vs 72，只有 11 則）。RT 是正評比例，MC 是加權平均，寫文時不要混成「好評度」。
6. **豆瓣高於 IMDb**：《宅男行不行》9.5 vs 8.1、《白色官邸殺人事件》8.4 vs 7.7、《臥底老紳士》8.2 vs 7.6；**豆瓣低於 IMDb**：《椅子公司》6.8 vs 7.3。

## 缺口

1. **中文評論 5 部找不到**：破案三人行、亞特蘭大、我們的辦公室、吸血鬼家庭屍篇、椅子公司。名單內媒體（關鍵評論網、鳴人堂、電影神搜、釀電影、放映週報、端傳媒、報導者）都只搜到新聞、名單或宣傳稿。建議人工再找：放映週報站內搜尋、釀電影作者頁、Openbook、或接受 vocus 具名作者（品質不一）。
2. **中文評論有 ⚠ 的 3 部**：天作不合的我們（ELLE TW 生活風格雜誌）、臥底老紳士（編輯部合輯、段落作者未具名）、漫才梅索太太（7 部推薦合輯中的一段）。
3. **豆瓣 12/12 都是 snippet**：沒有讀 subject 頁（不繞過 `sec.douban.com`），這次也沒有用 Exa 快取頁；只有臥底老紳士（9,504）、椅子公司（720）有人數，其餘沒有。
4. **評論季數不一**：中文評論中，宅男行不行（完結後回顧）、眼鏡蛇道館（評前兩季）、漫才梅索太太（Prime 進台時的推薦）不是 S1 專評；英文評論 OMITB、Office、Maisel、Atlanta 是根據前幾集寫的。
5. **IndieWire 兩篇只有 partial**：Groundlane 只抽到副標，Exa 讀到前段約 5,000 字。
6. **Nobody Wants This 的 Metacritic 評論數**：季頁 27 則 vs Exa 摘要的 57 則，取季頁（read）。
7. **IMDb 單季分數沒抓**：全部是整部劇的總評分。

## 工具降級紀錄（toolDegradation）

- Metacritic：Groundlane `web_extract`（render=never）12/12 成功；WWDITS 的預設 slug 回「Page Not Found」，改用 `what-we-do-in-the-shadows-2019`。
- IMDb：Exa `web_fetch_exa` 12/12 標題頁成功，沒有降級。
- 豆瓣：沒有直抓（post1 已記錄會被導到驗證頁）。Groundlane `web_search`（`domains=douban.com`）回 Tavily／Brave 摘要；Exa 後端在 Groundlane 內回報 unavailable。
- 英文評論：Groundlane `web_fetch` 讀到 Variety ×2、LA Times、Guardian ×2、THR、Slate ×2、Vulture ×2、New Yorker（未採用）；IndieWire ×2 只抽到副標 → Exa `web_fetch_exa`。
- 中文評論：關鍵評論網用 Tavily `tavily_extract`（照指示，Groundlane 會被擋）；電影神搜用 Groundlane `web_fetch`／`web_extract`；鳴人堂、ELLE、電影神搜（希米露）用 Exa `web_search_exa` 回傳的全文。
- Groundlane `web_search` 一次 `RATE_LIMITED`（brave），改用 Tavily `tavily_search`。
- 沒有用 Firecrawl、cloudflare `get_url_markdown`、Jina（評論部分）。
