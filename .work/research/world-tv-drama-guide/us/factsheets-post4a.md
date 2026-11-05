# Post 4a 事實表：美劇｜喜劇與成人動畫（12 部）

- 查核日：2026-11-05。順序照 `post4a-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取（非即時）；**partial** 表示只讀到前段；**snippet** 表示只看到搜尋摘要或 highlight，不能當成讀過。
- 欄位 6（推薦 tag）直接取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），每類只留 2–4 個最有資訊量的。已刪掉：TEEPR×HBO Max 業配（#HBOMaxPartner，Rick and Morty 的 G 訊號原本主要來自這篇）、所有反面意見、只有 snippet 又已過時的項目（例如 Roomie 2025-12「Common Side Effects 台灣無」）。
- 欄位 8（台灣串流）照抄 `tw-availability-1/2/3.md`，原等級寫法照抄（batch 1：A/B/C；batch 2：「已在服務商頁面確認」；batch 3：英文）。三部原本沒在服務頁確認的（Rick and Morty 的 Netflix、BoJack、South Park）這次另找台灣官方證據，結果寫在各劇欄位 8。
- **範圍提醒**：Arcane 是 Riot Games（美）監製、Fortiche（法）製作的合製作品。awards 檔把它當美國合製保留，fans 檔把它當「法美」排除（所以沒有 F/G tag）。要不要收進「美劇」系列，需要人拍板。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、季數、狀態、集數、前置作品 | 英文 Wikipedia 條目 wikitext（`action=raw`），抽 infobox `num_seasons` / `num_episodes` / `first_aired` / `last_aired`、Series overview、導言 | Groundlane `web_extract`（pattern） | read（12/12；`Hacks_(TV_series)`、`Shrinking_(TV_series)` 是 redirect，改用 `Hacks`、`Shrinking`） |
| IMDb ID | Wikidata SPARQL（P345） | Groundlane `web_fetch` | read |
| 分級細項 | IMDb Parents Guide `https://www.imdb.com/title/<id>/parentalguide/` | Tavily extract（advanced，3 頁，但 query 重排會漏掉部分類別）→ Jina `read_url`（無 key，回全文，11 頁） | read |
| 美國分級 | Parents Guide 的 Summary／Certifications 區塊；Rick and Morty 另用 IMDb 標題頁 | Jina；Exa `web_fetch_exa` | read |
| Tomatometer / Popcornmeter / Consensus | RT 季頁 `/tv/<slug>/s01`，選取 `[slot=critics-score]` 等 | Groundlane `web_extract`（render=never） | read（12/12 + 5 個最新季） |
| 台灣管道重新查核 | YouTube 官方頻道、JustWatch TW、台灣新聞、South Park 官方站 | Groundlane `web_extract`／`web_search`／`web_fetch`；Exa；Tavily search | 見各劇欄位 8 |

嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號內是「X of Y found this …」票數。**Parents Guide 是使用者投稿與投票**，不是官方分級。

---

## 1. Rick and Morty

1. **片名**：瑞克和莫蒂（HBO Max TW 頁「觀看 瑞克和莫蒂 | HBO Max」，tw-availability-1）／*Rick and Morty*。PTT 也寫「瑞克與莫帝」「瑞克和莫帝」（fans 檔，PTT 用法）。
2. **劇情**：Adult Swim 成人動畫科幻喜劇，憤世嫉俗的瘋狂科學家 Rick Sanchez 帶著膽小善良的孫子 Morty，在家庭日常和無限多重宇宙的冒險之間來回奔波。來源：https://en.wikipedia.org/wiki/Rick_and_Morty （read）
3. **季數與狀態**：已播 9 季、91 集（2013-12-02 首播）。第 9 季 2026-05-24 到 07-26 播出。**仍在播出**：2018 年 Cartoon Network 長約加訂 70 集，到 2024 年 11 月已續訂到第 12 季；另有電影版開發中，衍生劇《Rick and Morty: The Anime》2024 年播出。第 1 季 11 集（Metacritic 季列表「Season 1 · 11 Episodes」，snippet）。來源：同上（read）
   - **配音換角**：原本由共同創作者 Justin Roiland 一人配 Rick 和 Morty。2023 年 Adult Swim 因家暴指控與他切割；**自第 7 季（2023-10-15 首播）起由 Ian Cardoni（Rick）與 Harry Belden（Morty）接手**。Wikipedia：「Ian Cardoni and Harry Belden were recast in his roles beginning with the seventh season」。來源：同上（read）。（電影神搜 2023 報導說 Roiland 的家暴案後來不起訴，snippet：https://news.agentm.tw/251607 ）
   - **艾美獎**：Primetime Emmy 最佳動畫節目 **2018、2020 兩度得獎**。awards 檔另列 2022、2023、2026 提名；但 Wikipedia 導言寫「nominated for three … won the award twice」，兩者對不上（導言可能沒更新），寫文時建議只寫「兩度得獎」。另有 2 座 Annie 獎（Wikipedia 導言，read）。
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt2861424/ ；Parents Guide 的 Certifications 這次沒讀到美國那一列）。Sex & Nudity **Moderate**（524/1140）、Violence & Gore **Severe**（604/782）、Profanity **Severe**（686/844）、Alcohol, Drugs & Smoking **Severe**（460/726）、Frightening & Intense **Moderate**（280/736）。投稿特別提到：內臟外露、斬首、Saw 式陷阱的血腥處決（S3E4）、〈Pickle Rick〉（S3E3）的血腥打鬥；S8E4 有露骨的雜交場面；全劇 600 多次 f-word（電視播出會消音，HBO Max 版不消音）；古柯鹼、海洛因、MDMA 等多種毒品；Rick 對孫子的言語虐待可能讓人難受。使用者建議分級：「Rated R for Animated Sequences of Strong bloody violence/gore and language throughout…」。澳洲 MA15+（S1–6）。來源：https://www.imdb.com/title/tt2861424/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **97%**（29 則），Popcornmeter **97%**（2,500+）。Consensus：「Rick and Morty zaps onto screens and makes an instant impression with its vivid splashes of color, improvisational voice acting, and densely-plotted science fiction escapades -- bringing a surprising amount of heart to a cosmically heartless premise.」來源：https://www.rottentomatoes.com/tv/rick_and_morty/s01 （read）。**最新季 S9**：Tomatometer **100%**（10 則）、Popcornmeter **83%**（250+），無 Consensus：https://www.rottentomatoes.com/tv/rick_and_morty/s09 （read）
6. **推薦 tag**：
   - A：Emmy Animated win 2018、2020；Emmy Animated nom 2022、2023、2026
   - B：BBC2021 #76
   - C：IMDb 9.0（#22）
   - E：GWR2026 most in-demand sitcom 47.0x；Parrot GDA 2025 comedy finalist
   - F：PTT GOAT 串推文「動畫沒有 rick and morty」(2023)；PTT 板內 S8/S9 心得串 (2025–26)
   - G：無。唯一的 G 訊號是 TEEPR×HBO Max 業配，已刪。fans 檔註明 2024–2026 的推薦串裡沒有人主動推。
7. **前置作品**：沒有，是原創劇。起源是 Roiland 為 Channel 101 做的《回到未來》惡搞短片，不必先看。後期季數有連續主線（例如邪惡莫蒂），建議從第 1 季看起是編輯判斷。來源：欄位 2（read）
8. **台灣串流**：HBO Max（訂閱，9 季，NT$183）https://www.hbomax.com/tw/zh/show/ab553cdc-e15d-4597-b65f-bec9201fd2dd — **A（confirmed on service page）**；Netflix https://www.netflix.com/tw/title/80014749 — **C（JustWatch only，JW 寫 8 季）**（tw-availability-1）。**重新查核**：Netflix 部分沒有找到 Netflix Taiwan 的官方上架證據；Tavily 搜到的 Netflix 頁是英文、非台灣出口，不算數。文章建議只寫 HBO Max。

## 2. BoJack Horseman

1. **片名**：**馬男波傑克**（Netflix 官方繁中頻道預告標題「《馬男波傑克》| 第 6 季最終預告 | Netflix」，read，見欄位 8）／*BoJack Horseman*。tw-availability-1 原本標「未驗；JW 顯示簡體『马男波杰克』」，這次以官方繁中預告確認。
2. **劇情**：在人類與擬人動物共存的「好萊塢」，90 年代情境喜劇過氣明星、馬男 BoJack 想靠代筆自傳翻紅，同時和經紀人、對手與室友糾纏，心理狀態一路下滑。來源：https://en.wikipedia.org/wiki/BoJack_Horseman （read）
3. **季數與狀態**：6 季、76 集（另有 1 集特別篇），2014-08-22 到 2020-01-31，**已完結**。第 1 季集數這次沒讀到（Wikipedia overview 未抽出）。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Moderate**（250/431）、Violence & Gore **Mild**（239/360）、Profanity **Moderate**（235/386）、Alcohol, Drugs & Smoking **Severe**（345/372）、Frightening & Intense **Severe**（231/395）。投稿特別提到：幾乎沒有真人裸露，性內容集中在第 1 季；大量酗酒與古柯鹼、海洛因、處方藥濫用，S2 有少女酒精中毒；「Frightening」高分不是因為恐怖，而是情緒沉重——憂鬱、自殺念頭、「may in fact be the most depressing cartoon of all time」。全劇 f-word 只有 6 次（每季一次）。IMDb 列出的台灣分級是 16+。來源：https://www.imdb.com/title/tt3398228/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **71%**（28 則），Popcornmeter **90%**（1,000+）。Consensus：「It's intermittently funny, but in most respects, BoJack Horseman pales in comparison to similar comedies.」來源：https://www.rottentomatoes.com/tv/bojack_horseman/s01 （read）。**最終季 S6**：Tomatometer **96%**（55 則）、Popcornmeter **96%**：https://www.rottentomatoes.com/tv/bojack_horseman/s06 （read）。**S1 和後期落差很大，寫文時要說明「越後面評價越高」**。
6. **推薦 tag**：
   - A：Emmy Animated nom 2019、2020
   - B：BBC2021 #11；NYT2026 #44
   - C：IMDb 8.8（#67）
   - F：PTT GOAT 串「成人動畫」(2023，PTT 用法「馬男波傑克」)
7. **前置作品**：沒有，是原創劇。
8. **台灣串流**：Netflix（訂閱，6 季）https://www.netflix.com/tw/title/70300800 — 原等級 **C（JustWatch only）**（tw-availability-1）。**重新查核（新證據）**：Netflix 官方繁中亞洲頻道（頻道名 Netflix Malaysia／@netflixasia，描述導向 Netflix Taiwan）的預告 https://www.youtube.com/watch?v=67ePiNt8s2A ，標題「《馬男波傑克》| 第 6 季最終預告 | Netflix」，2020-01-15，描述「最終集數將於 1 月 31 日上線，Netflix 獨家。」（Groundlane `web_extract` 讀 meta，read）。第 5 季預告 https://www.youtube.com/watch?v=mHR5xpVOc0Y （2018-09-04，snippet）。依 tw-availability-official 對同類證據（后翼棄兵）的判法：**likely→confirmed（Netflix 原創；證據是亞洲繁中頻道、不是台灣專屬頻道，且年份較舊）**。電影神搜 2019 年報導也寫「Netflix《馬男波傑克》第六季上架」（snippet：https://news.agentm.tw/84684 ）。

## 3. Common Side Effects

1. **片名**：常見副作用（HBO Max TW，tw-availability-3）／*Common Side Effects*
2. **劇情**：高中同學 Marshall 和 Frances 重逢後，Marshall 發現一種能治好所有疾病與傷害的「藍天使蘑菇」，兩人因此捲入大藥廠 Reutical 與政府聯手封鎖這種蘑菇的陰謀。來源：https://en.wikipedia.org/wiki/Common_Side_Effects （read，Premise 段）
3. **季數與狀態**：1 季、10 集，2025-02-02 在 Adult Swim 首播（隔天上 HBO Max）。**已續訂第 2 季，預定 2027-01-24 首播**。由 Bandera Entertainment 製作，《King of the Hill》的核心班底參與。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**，多數單集 **TV-14**（Certifications：「TV-MA」「TV-14 most episodes」）。Sex & Nudity **Mild**（25/37）、Violence & Gore **Moderate**（19/40）、Profanity **Moderate**（25/35）、Alcohol, Drugs & Smoking **Severe**（36/41）、Frightening & Intense **Moderate**（16/32）。投稿特別提到：槍傷、刀傷；整部劇的主題就是種植有致幻效果的療癒藥物，也有 MDMA、LSD；突然的殺戮與令人不安的畫面。**票數很少（30–40 票），參考性有限**。來源：https://www.imdb.com/title/tt28093628/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **100%**（28 則），Popcornmeter **91%**（250+）。Consensus：「An addictive mix of expressive animation, heady concepts, and an offbeat sense of humor, Common Side Effects is a must-have prescription.」來源：https://www.rottentomatoes.com/tv/common_side_effects/s01 （read）
6. **推薦 tag**：
   - A：Emmy Animated nom 2025
   - B：Vulture2025（Roxana Hadadi #2）；THR2025（Angie Han #4）；CT10-2025 agg #18=
   - C：RT 2025 S1 100% / Popcorn 91%
   - F：RedRecs #10
   - G：FlixPatrol HBO Max TW 2026-11-05 #9（單日快照）
7. **前置作品**：沒有，是原創劇。共同創作者 Joe Bennett 的前作是《Scavengers Reign》，不必先看。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/eaa21376-a54d-4245-95d6-a86dce6313c8 ；JW：https://www.justwatch.com/tw/節目/chang-jian-fu-zuo-yong — **confirmed on service page**（tw-availability-3）

## 4. South Park

1. **片名**：**南方四賤客**（台灣慣用譯名，未在台灣服務頁驗證）／*South Park*。證據：台灣媒體 DramaQueen 電視迷 2019-10-31〈《南方四賤客》前進HBO Max！〉（snippet：https://www.dramaqueen.com.tw/news/20191030/003.html ）；關鍵評論網 傅紀鋼 2019-10-23 標題用「南方四賤客」（partial，見 reviews 檔）；中文維基第一季條目的網址是「南方四賤客_(第一季)」（snippet）；轉角國際 2016 也寫「當年在台灣紅極一時的《南方四賤客》」中文配音版（partial）。JW TW 顯示簡體「南方公园」，是中國譯名。台灣也有人寫「南方公園」（例如關鍵評論網 tag）。建議用「南方四賤客」，括號附「南方公園」。
2. **劇情**：Trey Parker 與 Matt Stone 為 Comedy Central 創作的動畫情境喜劇，講四個男孩 Stan、Kyle、Cartman、Kenny 在科羅拉多州小鎮的冒險，以髒話和黑色超現實幽默諷刺各種時事。來源：https://en.wikipedia.org/wiki/South_Park （read）
3. **季數與狀態**：**29 季、342 集（infobox）**，1997-08-13 首播，**仍在播出**。第 29 季 2026-09-16 首播（IMDb 標題頁另寫「Season 29 returns November」，表示季中休息，read）。HBO Max 串流約 2025 年 6 月底到期後，2025-07-21 與 Paramount+ 簽五年獨家串流約、每年產出 10 集（LA Times 報導標題「$1.5-billion streaming deal」）。第 1 季 13 集（Variety 1997 評論「13 somewhat toned-down editions」，read；中文維基第一季，snippet）。來源：同上（read）
4. **分級**：美國 **TV-MA**（部分單集 TV-14 DLSV；聯播版剪輯後 TV-14）。五個類別全部 **Severe**：Sex & Nudity（603/803）、Violence & Gore（523/697）、Profanity（659/743）、Alcohol, Drugs & Smoking（404/616）、Frightening & Intense（371/667）。投稿特別提到：大量粗俗性笑話、自慰與色情題材，少數集有短暫全裸；頭部中槍的血腥畫面、Kenny 每集死一次（S1–5）；串流與 DVD 版髒話不消音；種族歧視言論（多半出自 Cartman）是刻意的諷刺，但可能冒犯人；第 22 季起 Randy 經營大麻農場。「This show's main characters are kids … this is FAR from a kids show」。IMDb 列出的台灣分級：**18+（新分級），S1–7 為 12+**。中國、伊朗等地禁播。來源：https://www.imdb.com/title/tt0121955/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **71%**（24 則），Popcornmeter **85%**（250+）。Consensus：「South Park is gallingly crude in both its humor and art style, but this upstart cartoon is blisteringly funny as it blasphemes against conservative and liberal attitudes alike.」來源：https://www.rottentomatoes.com/tv/south_park/s01 （read）。S29 頁目前只有 1 則影評、沒有 Tomatometer，Popcornmeter 53%（read，樣本太小不建議引用）。
6. **推薦 tag**：
   - A：Emmy Animated win 2026；Emmy Animated nom 2016、2017、2018、2021
   - C：IMDb 8.7（#86）
   - E：Parrot GDA 2025 comedy finalist
   - F：PTT GOAT 串「成人動畫」(2023)
7. **前置作品**：沒有。由 1992、1995 年的兩支《The Spirit of Christmas》短片發展而來，不必先看。各集大多可獨立看；近年部分季數有連續劇情（編輯判斷，未查證）。來源：欄位 2（read）
8. **台灣串流**：tw-availability-1 原列「South Park Studios 官方網站（免費有廣告）https://www.southparkstudios.com/ — **C**」，JW TW 寫「免费带广告观看」、21 季。**重新查核**：
   - JW TW 頁今天仍寫「目前你可以在 South Park 免费带广告观看」，但頁面上寫「我們於 2022年7月2日 … 查看了 44 個串流服務的更新」，資料是 2022 年的（read：https://www.justwatch.com/tw/節目/south-park ）。
   - 官方站 southparkstudios.com 標題是「South Park Studios Global」（Groundlane search，snippet），但從這個環境無法驗證台灣 IP 能否播放；南方公園中文維基的觀看指引（2026-10-20，read：https://southpark.wiki.gg/zh/wiki/南方公园中文维基:南方公园观看指引 ）寫官方站可免費看「第一季到第二十六季的大多數劇集」，第 27–29 季鎖定，且「本文提供的正版觀看渠道在部分地區無法訪問或者不提供服務」。官方站沒有中文字幕（未驗證，依該指引推斷）。
   - Paramount+ 現在的獨家約不涵蓋台灣：同一份指引列出的 Paramount+ 服務區是美、加、拉美、澳、波蘭、匈牙利、中東、北歐（read，fan wiki，非官方）。一則台灣創作者的 Threads 貼文（2025-07，snippet）也說「台灣要訂 P+ 有點困難，因為它沒有中文字幕」。
   - **結論：unconfirmed。目前沒有找到任何台灣合法、有中文字幕的串流管道。官方免費站是否在台灣可播未證。** 建議文章寫「台灣目前沒有正式代理；官方網站 southparkstudios.com 提供部分舊集免費觀看（英文、無中文字幕，地區可用性以實際連線為準）」，並請人用台灣 IP 確認一次。

## 5. The Simpsons

1. **片名**：辛普森家庭（Disney+ 頁「觀看辛普森家庭｜Disney+」，tw-availability-3）／*The Simpsons*
2. **劇情**：Matt Groening 創作的 Fox 動畫情境喜劇，透過住在虛構小鎮春田市的辛普森一家五口（Homer、Marge、Bart、Lisa、Maggie）諷刺美國生活與社會。來源：https://en.wikipedia.org/wiki/The_Simpsons （read）
3. **季數與狀態**：**38 季、814 集（infobox 註記「as of November 1, 2026」）**，1989-12-17 首播，**仍在播出**。2025-04-02 Fox 續訂第 37–40 季，播到 2028–29 年度（40 週年），每季 15 集，另有最多 4 集 Disney+ 特別篇。它是美國播出最久的動畫、情境喜劇與黃金時段劇本影集。第 1 季 13 集（豆瓣第一季頁「集數: 13」，cache）。IMDb 標題頁顯示下一集 2026-11-08（read）。來源：同上（read）
4. **分級**：美國**以 TV-PG 為主，部分單集 TV-14**（Certifications：「TV-PG most episodes」「TV-14 some episodes」；IMDb Summary 寫 TV-14）。Sex & Nudity **Moderate**（288/637）、Violence & Gore **Moderate**（258/487）、Profanity **Mild**（230/498）、Alcohol, Drugs & Smoking **Moderate**（239/398）、Frightening & Intense **Mild**（216/393）。投稿特別提到：喜劇性的背面裸露；第 14–19 季左右性暗示最多；《Itchy & Scratchy》與每年萬聖節〈Treehouse of Horror〉的誇張血腥；Homer 掐 Bart 的招牌笑點；酒館場景與酗酒笑話很多。「Out of the big four adult animations … The Simpsons is the tamest and the least offensive.」來源：https://www.imdb.com/title/tt0096697/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **100%**（18 則），Popcornmeter **88%**（250+）。Consensus：「The Simpsons' first season proves a quickly addictive introduction to America's animated first family with a run of entertaining episodes that set the stage for a groundbreaking series.」來源：https://www.rottentomatoes.com/tv/the_simpsons/s01 （read）
6. **推薦 tag**：
   - A：Emmy Animated win 2019、2023；2016–2026 其餘每年都有提名（IMDb 標題頁：Won 37 Primetime Emmys，read）
   - C：IMDb 8.6（#114）
   - E：Parrot GDA 2025 comedy finalist
   - F：PTT GOAT 串「成人動畫」(2023)
7. **前置作品**：沒有。最早是 1987 年起《The Tracey Ullman Show》裡的短片，不必先看。單元式為主，可以從任何一季開始（編輯判斷）。來源：欄位 2（read）
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-cac75c8f-a9e2-4d95-ac73-1cf1cc7b9568 — **confirmed on service page**（tw-availability-3。Disney+ 頁的判定標準見 post1 檔頭說明）。另：台灣福斯頻道 2014 年起播出加入台灣時事梗的中文配音版（關鍵評論網 2019 報導，snippet：https://www.thenewslens.com/article/115596 ），和 Disney+ 版是不同版本，寫文時不要混用。

## 6. Arcane

1. **片名**：奧術（Netflix TW 片名，tw-availability-2：「Netflix TW 片名是『奧術』，JW 寫『奧術：英雄聯盟』」）／*Arcane*（片頭標題 *Arcane: League of Legends*）
2. **劇情**：以 Riot Games《英雄聯盟》世界觀為背景的動畫影集，姊妹 Vi 和 Powder／Jinx 捲入地下城祖安與上層城市皮爾特沃夫之間的衝突，最後站到彼此的對立面。來源：https://en.wikipedia.org/wiki/Arcane_(TV_series) （read）
3. **季數與狀態**：2 季、18 集，2021-11-06 到 2024-11-23，**已完結**（第 2 季官方稱「second and final season」）。Wikipedia 導言另寫第 2 季節奏「saw a mixed response」。第 1 季 9 集（豆瓣第一季頁「集數: 9」，cache）。製作：法國 Fortiche 動畫，Riot Games 監製，Netflix 發行。來源：同上（read）
4. **分級**：美國 **TV-14**（self-applied）。Sex & Nudity **Mild**（668/1403）、Violence & Gore **Severe**（453/893）、Profanity **Mild**（406/843）、Alcohol, Drugs & Smoking **Mild**（373/734）、Frightening & Intense **Moderate**（373/731）。投稿特別提到：斬首、鐵條穿胸、怪物殺人等血腥畫面；有非露骨的性愛場景與短暫胸部；虛構毒品「Shimmer」；自殺、情緒虐待、遺棄、成癮等主題，有角色因創傷產生幻覺。使用者建議分級 PG-13。IMDb 列出的台灣分級是 16+。來源：https://www.imdb.com/title/tt11126994/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **100%**（30 則），Popcornmeter **93%**（5,000+）。Consensus：「Arcane makes an arresting first impression, combining a spectacular mix of 2D and 3D animation with an emotionally compelling story to deliver a video game adaptation that could become legendary.」來源：https://www.rottentomatoes.com/tv/arcane_league_of_legends/s01 （read；`/tv/arcane/s01` 會轉址到這裡）。S2 是 100% / Popcorn 81%（ratings 檔，RT24）。
6. **推薦 tag**：
   - A：Emmy Animated win 2022、2025
   - B：CT10-2024 agg ~#27
   - C：IMDb 9.0（#27）；RT 2024 S2 100% / Popcorn 81%
   - F/G：無（fans 檔把 Arcane 列為「法美」非美國作品而排除，不是沒有訊號）
7. **前置作品**：**不必玩過《英雄聯盟》**。The Verge（Andrew Webster，2021-11-07）：「you don't have to know anything about League to get into it」（cache，Exa highlight：https://www.theverge.com/22763818/netflix-league-of-legends-arcane-review ）；NYT 2021-12-21 也寫「newbies can jump in cold」（snippet）。
8. **台灣串流**：Netflix（訂閱，2 季）https://www.netflix.com/tw/title/81435684 ；JW：https://www.justwatch.com/tw/節目/arcane — **已在服務商頁面確認**（tw-availability-2：「以台灣出口讀取」）

## 7. X-Men '97

1. **片名**：X 戰警 '97（Disney+ 頁「觀看X 戰警 ‘97｜Disney+」，tw-availability-3）／*X-Men '97*。豆瓣「又名」欄也寫「X战警 ’97(台)」（cache）。
2. **劇情**：Marvel Studios Animation 為 Disney+ 製作的 *X-Men: The Animated Series*（1992–1997）復興版，直接接續原作，講失去 X 教授的 X 戰警在人類敵意升高下繼續保護一個恨他們的世界。來源：https://en.wikipedia.org/wiki/X-Men_%2797 （read）
3. **季數與狀態**：2 季、19 集。第 1 季 10 集（2024-03-20 首播）；第 2 季 9 集，2026-07-01 到 08-12。**第 3 季開發中**（Wikipedia 隱藏段落寫「A third season was in development」；豆瓣已建「X战警97 第三季（2027）」條目，snippet）。主創 Beau DeMayo 在 2024 年 3 月被撤換，第 3 季改由 Matthew Chauncey 擔任首席編劇。來源：同上與 https://en.wikipedia.org/wiki/X-Men_%2797_season_2 （read）
4. **分級**：美國 **TV-14**。Sex & Nudity **None**（56/101）、Violence & Gore **Moderate**（52/78）、Profanity **Mild**（58/76）、Alcohol, Drugs & Smoking **Mild**（50/59）、Frightening & Intense **Moderate**（40/70）。投稿特別提到：角色受傷流血、斷肢，萬磁王扯出攻擊者脊椎的血腥畫面；髒話只到 bastard、crap；比原作更成人。IMDb 列出的台灣分級是 12+。來源：https://www.imdb.com/title/tt16026746/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **99%**（81 則），Popcornmeter **91%**（1,000+）。Consensus：「Pulling off the x-traordinary feat of staying true to its beloved predecessor while charting a path forward for the franchise, X-Men '97 is simply x-cellent.」來源：https://www.rottentomatoes.com/tv/x_men_97/s01 （read）。**S2**：Tomatometer **98%**（43 則）、Popcornmeter **76%**：https://www.rottentomatoes.com/tv/x_men_97/s02 （read）。觀眾分數在 S2 下滑。
6. **推薦 tag**：
   - A：Emmy Animated nom 2024
   - B：Vulture2024（Roxana Hadadi #7）；CT10-2024 agg ~#18
   - C：IMDb 8.7（#108）；RT 2024 S1 99% / Popcorn 91%
7. **前置作品**：是 1992–1997 年動畫《X 戰警》（台灣舊譯《特異功能組》）的直接續作。**不必先看**：THR：「thankfully does not require brushing up on intricate lore from the tail end of the last century」（read，見 reviews 檔）。看過原作第 5 季結局〈畢業日〉會比較懂開場（電影神搜，cache）。
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-8dc91ed4-cdca-4fab-9723-d3d42f382d34 ；JW：https://www.justwatch.com/tw/節目/x-men-97 — **confirmed on service page**（tw-availability-3）。補充：Exa 快取的同一頁顯示「2024 – 2026 • 2 季」，列出第 2 季 9 集（cache）。

## 8. Hacks

1. **片名**：天后與草莓（HBO Max TW，tw-availability-2）／*Hacks*。JW 的「绝望写手」是中國譯名，港譯「職業槍手」。台灣最早在 HBO GO 上架（DramaQueen 2021-10-07，cache）。
2. **劇情**：拉斯維加斯傳奇脫口秀天后 Deborah Vance（Jean Smart）為了保住駐場檔期，被迫雇用因爭議推文失業的年輕喜劇編劇 Ava（Hannah Einbinder），兩人從互看不順眼到成為複雜的工作搭檔。來源：https://en.wikipedia.org/wiki/Hacks （read，導言與 Premise）
3. **季數與狀態**：5 季、47 集，2021-05-13 到 2026-05-28，**已完結**（「concluded on May 28, 2026, after five seasons and 47 episodes」）。第 1 季 10 集（豆瓣第一季頁「集數: 10」，cache）。Jean Smart 以本劇拿下 5 座 Emmy，是第一位在多季劇每一季都得獎的女演員；Einbinder 2025 年得獎。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Moderate**（93/293）、Violence & Gore **None**（52/72）、Profanity **Moderate**（49/112）、Alcohol, Drugs & Smoking **Moderate**（40/80）、Frightening & Intense **Mild**（29/62）。投稿特別提到：大量性笑話與模擬性行為；第 3 季有兩段女性上半身裸露；f-word；大量飲酒、抽菸，偶爾大麻、搖頭丸、古柯鹼；自殺、性騷擾、喪親等議題。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt11815682/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **100%**（75 則），Popcornmeter **89%**（500+）。Consensus：「A prickling debut that pulls few punches, Hacks deftly balances its sharp critiques of the comedy world with more intimate moments, all the while giving the incomparable Jean Smart a role worthy of her talents -- and an excellent partner in Hannah Einbinder.」來源：https://www.rottentomatoes.com/tv/hacks/s01 （read）
6. **推薦 tag**：
   - A：Emmy Comedy win 2024（另 2021、2022、2025、2026 提名）；GG Comedy win 2022、2025
   - B：NYT2026 #42；THR2024（Daniel Fienberg #8）；CT10-2025 agg #14=；CT10-2024 agg #11
   - C：RT 2025 S4 98% / Popcorn 75%；RT 2024 S3 98% / Popcorn 89%
7. **前置作品**：沒有，是原創劇。
8. **台灣串流**：HBO Max（訂閱，5 季）https://www.hbomax.com/tw/zh/show/67e940b7-aab2-46ce-a62b-c7308cde9de7 ；JW：https://www.justwatch.com/tw/節目/hacks — **已在服務商頁面確認**（tw-availability-2）

## 9. Curb Your Enthusiasm

1. **片名**：人生如戲（HBO Max TW，tw-availability-2；Exa 快取的 HBO Max TW 第 8 季頁標題「Watch 人生如戲 Season 8 | HBO Max」，cache）／*Curb Your Enthusiasm*
2. **劇情**：《歡樂單身派對》（*Seinfeld*）共同創作者 Larry David 飾演虛構版的自己，一個半退休的電視編劇，在洛杉磯的日常社交小事裡不斷鑽牛角尖、得罪人；對白大多是演員依大綱即興演出。來源：https://en.wikipedia.org/wiki/Curb_Your_Enthusiasm （read）
3. **季數與狀態**：12 季、120 集（另有 1999-10-17 的一小時特別篇），2000 到 2024 年，**已完結**（最終季第 12 季 2024-04-07 播完，中文維基，cache）。第 1 季 10 集（Variety 2000 評論「HBO's new 10-episode cinema verite comedy」，read）。來源：同上（read）
4. **分級**：美國 **TV-MA**（第 9 季 TV-14）。Sex & Nudity **Moderate**（82/182）、Violence & Gore **None**（70/97）、Profanity **Severe**（100/127）、Alcohol, Drugs & Smoking **Mild**（64/86）、Frightening & Intense **None**（66/83）。投稿特別提到：每集都有性笑話，但幾乎沒有裸露（第 1 季有一次）；Leon、Susie 的 f-word 密集，偶有 c-word 和歧視字眼；涉及種族、身障、宗教的冒犯性笑話。來源：https://www.imdb.com/title/tt0264235/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **89%**（18 則），Popcornmeter **90%**（250+）。Consensus：「Playing an exaggerated version of himself, Larry David proves that his comic genius is at full force both behind and in front of the camera.」來源：https://www.rottentomatoes.com/tv/curb_your_enthusiasm/s01 （read）
6. **推薦 tag**：
   - A：Emmy Comedy nom 2018、2020、2022、2024
   - B：BBC2021 #21；NYT2026 #9
   - C：IMDb 8.8（#69）；RT 2024 S12 94% / Popcorn 71%
7. **前置作品**：沒有必要。1999 年 HBO 特別篇《Larry David: Curb Your Enthusiasm》是起點，不必先看。看過《歡樂單身派對》比較懂某些梗，第 7 季還有《歡樂單身派對》重聚情節（編輯判斷）。來源：欄位 2（read）
8. **台灣串流**：HBO Max（訂閱，12 季）https://www.hbomax.com/tw/zh/show/18a0993f-209a-4653-8f94-f3fb8422e678 ；JW：https://www.justwatch.com/tw/節目/curb-your-enthusiasm — **已在服務商頁面確認**（tw-availability-2）。補充：Exa 快取的 HBO Max TW 頁顯示「18+」「12 季」「每月僅需NT$183」（cache）。

## 10. Ted Lasso

1. **片名**：泰德拉索：錯棚教練趣事多（Apple TV TW，tw-availability-1）／*Ted Lasso*
2. **劇情**：美國大學美式足球教練 Ted Lasso 被請去執教英格蘭足球隊 AFC Richmond，老闆暗中希望他把球隊搞垮，沒想到他樂觀、溫暖的領導方式反而改變了整支球隊。來源：https://en.wikipedia.org/wiki/Ted_Lasso （read）
3. **季數與狀態**：4 季、44 集。S1 10 集（2020-08-14～10-02）、S2 12 集（2021）、S3 12 集（2023，原本打算是最終季）。2025 年 3 月續訂第 4 季，**第 4 季 10 集，2026-08-05 到 10-07 播出**（劇情改為 Ted 執教女子足球隊）。截至 2026-11-05 Wikipedia 沒有第 5 季續訂或完結的資訊，**狀態未定**。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（424/960）、Violence & Gore **None**（425/539）、Profanity **Severe**（580/826）、Alcohol, Drugs & Smoking **Mild**（373/516）、Frightening & Intense **None**（362/503）。投稿特別提到：更衣室男性臀部裸露、暗示性的性行為；髒話很多，Roy Kent 一人全劇約 300 次 f-word，「Way worse in season 4」；酒吧場景；恐慌症發作、自殺、心理疾病、喪禮等情緒沉重的情節。IMDb 列出的台灣分級是 PG-15（self-applied）。來源：https://www.imdb.com/title/tt10986410/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **92%**（74 則），Popcornmeter **95%**（2,500+）。Consensus：「Warm and winsome, if not particularly hilarious, Ted Lasso fleshes out its promo premise with unrelenting optimism and a charming turn from Jason Sudeikis.」來源：https://www.rottentomatoes.com/tv/ted_lasso/s01 （read）。**最新季 S4**：Tomatometer **90%**（159 則）、Popcornmeter **65%**：https://www.rottentomatoes.com/tv/ted_lasso/s04 （read）。**觀眾分數比 S1 低 30 個百分點**。
6. **推薦 tag**：
   - A：Emmy Comedy win 2021、2022；Emmy Comedy nom 2023；GG Comedy nom 2021、2022、2024
   - B：NYT2026 #75
   - C：IMDb 8.7（#95）
   - D：Nielsen 2023 #1 streaming original 16.9B min
   - E：Parrot GDA 2023 most in-demand comedy
7. **前置作品**：沒有。角色源自 2013 年 NBC Sports 英超轉播的宣傳短片，不必先看。來源：欄位 2（read）
8. **台灣串流**：Apple TV（訂閱，7 天免費試用後 $250/月）https://tv.apple.com/tw/show/%E6%B3%B0%E5%BE%B7%E6%8B%89%E7%B4%A2%E9%8C%AF%E6%A3%9A%E6%95%99%E7%B7%B4%E8%B6%A3%E4%BA%8B%E5%A4%9A/umc.cmc.vtoh0mn0xn7t3c643xqonfzy — **A**（tw-availability-1；當時 JW 顯示 4 季）

## 11. Shrinking

1. **片名**：誠實診療室（Apple TV TW，tw-availability-1；JW 的「誠實治療法」是香港譯名）／*Shrinking*。豆瓣譯名《诊疗中》。
2. **劇情**：喪妻後陷入嚴重悲傷的心理治療師 Jimmy（Jason Segel）開始打破專業倫理，直接對病人說出真心話，徹底改變了病人和自己的生活；Harrison Ford 飾演他罹患帕金森氏症的資深上司。來源：https://en.wikipedia.org/wiki/Shrinking （read，導言與 Premise）
3. **季數與狀態**：3 季、33 集。S1 2023-01-27 首播；S2 2024-10-16 首播；S3 11 集，2026-01-28 首播。**2026 年 1 月已續訂第 4 季**。第 1 季 10 集（Digital Trends 評論「first nine of the season 1's 10 episodes」，cache）。由 Bill Lawrence、Jason Segel、Brett Goldstein 共同創作（Lawrence、Goldstein 也是《泰德拉索》班底）。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Mild**（93/245）、Violence & Gore **Mild**（66/95）、Profanity **Severe**（119/160）、Alcohol, Drugs & Smoking **Moderate**（62/102）、Frightening & Intense **None**（59/93）。投稿特別提到：第 1 集約 35 次 f-word，「Probably the most profane Apple TV+ series」；幾乎不間斷的露骨性笑話，但裸露很少；有 PTSD 退伍軍人打人的情節；許多角色在處理喪親之痛。IMDb 列出的台灣分級是 PG-15。來源：https://www.imdb.com/title/tt15677150/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **91%**（94 則），Popcornmeter **89%**（1,000+）。Consensus：「Shrinking has darker ideas on its mind than its earnest approach can often translate, but Jason Segel and Harrison Ford's sparkling turns make these characters worth close analysis.」來源：https://www.rottentomatoes.com/tv/shrinking/s01 （read）
6. **推薦 tag**：
   - A：Emmy Comedy nom 2025、2026
   - B：THR2024（Daniel Fienberg #7）；CT10-2024 agg ~#23
   - C：RT 2024 S2 97% / Popcorn 89%
7. **前置作品**：沒有，是原創劇。和《泰德拉索》共用創作者，但劇情無關；2026 年有沒有正式跨劇聯動沒有查證。
8. **台灣串流**：Apple TV（訂閱，3 季）https://tv.apple.com/tw/show/%E8%AA%A0%E5%AF%A6%E8%A8%BA%E7%99%82%E5%AE%A4/umc.cmc.apzybj6eqf6pzccd97kev7bs — **A**（tw-availability-1）

## 12. The Studio

1. **片名**：片廠風雲（Apple TV TW 頁「觀看《片廠風雲》- Apple TV」，tw-availability-3）／*The Studio*。港譯「鬥戲影業」。
2. **劇情**：Seth Rogen 飾演好萊塢老牌片廠「大陸影業」新上任的掌門人，他真心熱愛電影，卻得在企業賺錢的要求和自己想拍好片的慾望之間不斷妥協；許多真實導演與明星本人客串。來源：https://en.wikipedia.org/wiki/The_Studio_(TV_series) （read）
3. **季數與狀態**：1 季、10 集，2025-03-26 首播。**2025 年 5 月已續訂第 2 季**；截至 2026-11-05 Wikipedia infobox 仍是 1 季，第 2 季播出日期沒有查證。Rogen 與 Evan Goldberg 執導全部 10 集，以大量長鏡頭聞名。Catherine O'Hara 在本劇是她過世前最後一次演出（Wikipedia 導言，read）。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Moderate**（58/171）、Violence & Gore **Mild**（28/56）、Profanity **Severe**（64/82）、Alcohol, Drugs & Smoking **Moderate**（23/63）、Frightening & Intense **Mild**（22/47）。投稿特別提到：E5 有一場露骨的性愛場面；髒話密集，包括 c-word；一整集圍繞大量嗑藥（吸古柯鹼）；第 1 集「very anxiety inducing」。使用者建議分級：「Rated R for pervasive strong language, drug use, and brief sexuality/nudity.」IMDb 列出的台灣分級是 PG-15。來源：https://www.imdb.com/title/tt23649128/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **92%**（130 則），Popcornmeter **77%**（1,000+）。Consensus：「Savvy enough to impress even the most studious of film buffs, The Studio fights the good fight for a better Hollywood while eliciting huge laughs at its expense.」來源：https://www.rottentomatoes.com/tv/the_studio/s01 （read）
6. **推薦 tag**：
   - A：Emmy Comedy win 2025；GG Comedy win 2026
   - B：Variety2025（Alison Herman #10）；THR2025（Angie Han #5）；CT10-2025 agg #5
   - F：PTT 2025 年度最佳串 ×5；RedRecs #11
   - G：LINE TODAY 聚光賞 2025 歐美劇 #2；ELLE TW (desc)；Cosmo TW (snippet)
7. **前置作品**：沒有，是原創劇。熟悉好萊塢產業與影迷梗會更好笑（編輯判斷）。
8. **台灣串流**：Apple TV（訂閱）https://tv.apple.com/tw/show/片廠風雲/umc.cmc.7518algxc4lsoobtsx30dqb52 ；JW：https://www.justwatch.com/tw/節目/the-studio — **confirmed on service page**（tw-availability-3）

---

## 結果摘要

- 欄位 2、3、4、5 共 12/12 都有 read 的來源。欄位 3 的第 1 季集數有 11/12 有來源（read 或 cache／snippet），BoJack S1 集數沒讀到。
- 欄位 4：12 部 Parents Guide 都讀到 5 個類別。美國分級 12/12 有（Rick and Morty 來自 IMDb 標題頁）。
- 欄位 5：12 部 S1 都讀到；另外讀了 5 個最新季（R&M S9、BoJack S6、X-Men S2、Ted Lasso S4、South Park S29）。差距大的有 BoJack（S1 71% → S6 96%）、Ted Lasso（Popcorn 95% → 65%）、X-Men（Popcorn 91% → 76%）。
- 欄位 8：在服務頁確認的有 10 部：Rick and Morty（HBO Max）、Common Side Effects、Simpsons、Arcane、X-Men '97、Hacks、Curb、Ted Lasso、Shrinking、The Studio。BoJack 這次找到 Netflix 官方繁中亞洲頻道預告，升為 **likely→confirmed（Netflix 原創，證據非台灣專屬頻道）**。South Park **仍未確認**，而且很可能沒有台灣正式管道。

## 無法查證或尚待確認的事實

1. **South Park 台灣可用性**：沒有台灣正式代理的證據。官方免費站 southparkstudios.com 從台灣能不能播、是否鎖區，這個環境沒辦法驗證（出口不在台灣，也沒繞過）。JW TW 的「免費觀看」資料停在 2022-07-02。需要台灣 IP 人工確認。
2. **South Park 台灣譯名**：「南方四賤客」來自台灣媒體與舊台配版的用法，沒有台灣串流服務頁可以對。
3. **BoJack 的 Netflix 證據**是 2020 年的亞洲繁中頻道預告，不是 Netflix Taiwan 專屬頻道，也沒有 2026 年的台灣上架證據。Netflix 原創下架風險低，但仍不是服務頁確認。
4. **Rick and Morty 的 Netflix 台灣上架**：只有 JustWatch，沒有官方證據。建議文章只寫 HBO Max。
5. **Rick and Morty 艾美獎提名次數**：awards 檔列 5 次（2 勝 3 提名：2018、2020 勝；2022、2023、2026 提名），Wikipedia 導言寫「nominated for three」。要回頭讀 Emmy 動畫節目條目確認。
6. **Ted Lasso 第 5 季**、**The Studio 第 2 季播出日**、**X-Men '97 第 3 季播出日**都沒有查證。
7. **BoJack 第 1 季集數**沒讀到（一般資料是 12 集，未驗證）。
8. **Arcane 是否算「美劇」**：法美合製，候選檔之間判定不同，需要人拍板。
9. **Common Side Effects 的 Parents Guide 票數只有 30–40 票**，嚴重度參考性比其他劇低。
10. **The Simpsons 的台灣版本**：福斯台灣中文配音版（加入台灣時事梗）和 Disney+ 版是不同的東西；Disney+ TW 是否提供中文配音版沒有查證。

## 工具降級紀錄（toolDegradation）

- 終端機 `curl` 連 en.wikipedia.org、rottentomatoes.com 都被代理擋（CONNECT 403），全部改用 Groundlane。
- Wikidata `wbgetentities` 一次抓 12 部超過 Groundlane pattern 輸入上限（OUTPUT_LIMIT）→ 改用 Wikidata SPARQL，成功。
- IMDb Parents Guide：Tavily extract 帶 query 時重排會漏掉部分類別（R&M、BoJack 缺 2 類）→ Jina `read_url`（無 API key，question 參數無效，回全文），11 頁全部讀到。
- IMDb 標題頁：Exa `web_fetch_exa` 讀到 11 部；Curb 回 CRAWL_LIVECRAWL_TIMEOUT 兩次，Tavily extract 回 Failed to fetch → Curb 的 IMDb 分數改用 ratings 檔的 Top 250 讀取值（見 reviews 檔）。
- RT：Groundlane `web_extract`（render=never）12/12 成功，沒有降級。
- 台灣串流：Netflix title 頁依請求 IP 回應，不採用；YouTube 用 Groundlane `web_extract` 讀 meta。Tavily search 後段回 429（rate limit），改用 Groundlane `web_search` 與 Exa。
- Firecrawl、cloudflare `get_url_markdown` 沒有用到。
