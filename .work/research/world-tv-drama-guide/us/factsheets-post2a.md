# Post 2a 事實表：美劇｜犯罪、懸疑與政治（上半，12 部）

- 查核日：2026-11-05。順序照 `post2a-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**partial** 表示只讀到前段（輸出截斷）；**cache** 表示 Exa 索引內的快取副本；**snippet** 表示只看到搜尋摘要，不能當成讀過。
- 欄位 6（推薦 tag）直接取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），每類只留 2–4 個最有資訊量的。已刪掉：反面意見（例如 Mindhunter「也有人因為沒有第三季而不推」）、範圍外的 PTT GOAT 串（Fargo 只出現在「範圍外經典」清單，不算）。這 12 部在 D（收視數據）與 E（需求聲量）兩類都沒有任何條目。
- 欄位 8（台灣串流）照抄 `tw-availability-1/2/3.md`；不是「服務頁確認」的 5 部（Better Call Saul、House of Cards、Narcos、Ripley、Fargo）本輪另找台灣官方或台灣媒體證據，寫在「本輪補查」。沿用 `tw-availability-official.md` 的判準：Netflix `/tw/title/` 頁依請求端 IP 顯示，不能當證據；「Netflix Malaysia」（@netflixasia）是 Netflix 官方繁中亞洲頻道，但不是台灣專屬頻道。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、季數、狀態、S1 集數、前置作品 | 英文 Wikipedia wikitext（`action=raw`），抽 infobox 的 `num_seasons` / `num_episodes` / `first_aired` / `last_aired`、`episodes1` 與導言；The Wire / True Detective / Fargo 的 S1 集數改讀各自的 `…_season_1` 條目 | Groundlane `web_extract`（pattern） | read（12/12） |
| IMDb ID | Wikidata `wbgetentities`（P345） | Groundlane `web_extract` | read |
| 分級細項 | IMDb Parents Guide `https://www.imdb.com/title/<id>/parentalguide/` | Jina `read_url`（12 頁；Breaking Bad 那頁先用 Tavily extract 只抽到片段，再用 Jina 讀全頁） | read |
| 美國分級（標題列） | IMDb 標題頁 | Exa `web_fetch_exa` | read（12/12 都是 TV-MA）；Parents Guide 頁另有 Certifications 區塊的，以該區塊為準 |
| Tomatometer / Popcornmeter / Critics Consensus | RT 季頁 `/tv/<slug>/s01`（與差異大的後期季），選取 `slot=critics-score` / `audience-score` / `critics-reviews` / `audience-reviews`、`#critics-consensus p` | Groundlane `web_extract`（render=never） | read（12/12） |
| 台灣管道補查 | Netflix 繁中 YouTube 頻道、台灣媒體（DramaQueen 電視迷） | Groundlane `web_search` / `web_extract`（YouTube 頁的 `meta[name=title]`、`link[itemprop=name]`、`meta[itemprop=datePublished]`） | 見各劇欄位 8 |

嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號內是頁面顯示的「X of Y found this …」票數。**Parents Guide 是使用者投稿與投票**，不是官方分級。

---

## 1. Breaking Bad

1. **片名**：絕命毒師（Netflix TW 頁標題「觀賞《絕命毒師》｜Netflix」，見 tw-availability-3）／*Breaking Bad*
2. **劇情**：新墨西哥州阿布奎基的高中化學老師 Walter White（Bryan Cranston）被診斷出第三期肺癌後，和以前的學生 Jesse Pinkman（Aaron Paul）合作製造、販賣冰毒，想替家人留下錢。來源：https://en.wikipedia.org/wiki/Breaking_Bad （read）
3. **季數與狀態**：5 季、62 集，2008-01-20 到 2013-09-29，**已完結**。第 1 季 7 集（`episodes1=7`）。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt0903747/ ）。Sex & Nudity **Moderate**（1601/4064）、Violence & Gore **Severe**（1846/2348）、Profanity **Moderate**（1311/2346）、Alcohol, Drugs & Smoking **Severe**（2230/2377）、Frightening **Severe**（1542/2083）。投稿特別提到：只有兩集有性相關裸露（S1E1、S3E5 脫衣舞俱樂部）；槍戰、處決、用砍刀斬首、ATM 壓碎頭部；冰毒、古柯鹼、海洛因的製造與吸食是主線；S1 的 f-word 最多，AMC 播出版有消音。來源：https://www.imdb.com/title/tt0903747/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **86%**（43 則），Popcornmeter **95%**（5,000+）。Consensus：「Though at times it feels forced and its imagery can be gruesome, Breaking Bad is darkly gripping and features a strong sympathetic lead in Bryan Cranston.」來源：https://www.rottentomatoes.com/tv/breaking_bad/s01 （read）。最終季 S5 為 **97% / 98%**（99 則）：https://www.rottentomatoes.com/tv/breaking_bad/s05 （read），是「越後面越好」的典型。
6. **推薦 tag**：
   - B：BBC2021 #3；NYT2026 #1
   - C：IMDb 9.5（#1）
   - F：PTT 2026 推薦串 ×2；PTT GOAT 串 (2023)
   - G：GQ TW 10 部馬拉松影集
7. **前置作品**：沒有，系列起點。衍生作有前傳《絕命律師》（2015–2022）和續篇電影《續命之徒：絕命毒師電影》（*El Camino*，2019），都不必先看。來源：Better Call Saul 條目導言「a spin-off of Gilligan's previous series, *Breaking Bad*」（read）；*El Camino* 的資訊取自 關鍵評論網 2019-10-20 文章標題（snippet），電影細節未另查。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/70143836 ；JW：https://www.justwatch.com/tw/節目/jue-ming-du-shi — **confirmed on service page**（以台灣地區代理打開，共 5 季；tw-availability-3）

## 2. Better Call Saul

1. **片名**：絕命律師（tw-availability-1 記 about.netflix.com/zh_tw 新聞稿用「《絕命律師》(Better Call Saul)」；本輪 DramaQueen 報導也用此名，read）／*Better Call Saul*
2. **劇情**：《絕命毒師》的衍生前傳，講曾是騙子的律師 Jimmy McGill（Bob Odenkirk）想靠公設辯護人工作翻身，卻一步步變成《絕命毒師》裡那個替罪犯辦事的 Saul Goodman。來源：https://en.wikipedia.org/wiki/Better_Call_Saul （read；Wikipedia：「primarily a prequel that focuses on Jimmy McGill, a former con artist aiming to gain respectability as a public defender」）
3. **季數與狀態**：6 季、63 集，2015-02-08 到 2022-08-15，**已完結**。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（Parents Guide 摘要「is rated TV-MA」）。Sex & Nudity **Mild**（620/1024）、Violence & Gore **Moderate**（286/596）、Profanity **Moderate**（301/502）、Alcohol, Drugs & Smoking **Moderate**（281/464）、Frightening **Moderate**（211/527）。投稿特別提到：比《絕命毒師》溫和很多，前三季暴力少，第 4–6 季的槍戰與流血明顯增加；全劇約 23 次 f-word；有冰毒、古柯鹼交易但很少直接吸食畫面。IMDb 沒有列台灣分級。來源：https://www.imdb.com/title/tt3032476/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **97%**（291 則），Popcornmeter **95%**（5,000+）。Consensus：「Better Call Saul is a quirky, dark character study that manages to stand on its own without being overshadowed by the series that spawned it.」來源：https://www.rottentomatoes.com/tv/better_call_saul/s01 （read）
6. **推薦 tag**：
   - A：Emmy Drama nom 2016、2017、2019、2020、2022、2023（六度提名都沒得獎）；GG Drama nom 2023
   - B：BBC2021 #23；NYT2026 #27
   - C：IMDb 9.0（#25）
   - F：PTT 2026 推薦串 ×3；PTT GOAT 串
7. **前置作品**：**建議先看《絕命毒師》**，但不是必要條件。它是前傳，部分場景發生在《絕命毒師》期間與之後。Wikipedia：「it serves primarily as a prequel, with some scenes taking place during and after the events of *Breaking Bad*」。來源：同欄位 2（read）。「建議先看」是編輯判斷；Guardian 有一篇〈how to enjoy AMC's spin-off without watching Breaking Bad〉（2015-02-21，snippet），可當「不看也行」的佐證。
8. **台灣串流**：Netflix（訂閱，6 季）https://www.netflix.com/tw/title/80021955 — **C（JustWatch only）**（tw-availability-1）。
   - **本輪補查**：DramaQueen 電視迷 2022-04-15〈《絕命律師》最終季走向難料！…〉：「《絕命律師》最終季共 13 集並分為兩部分，台灣觀眾可在 Netflix 收看」（read，Groundlane `web_extract` 抽到原句）：https://www.dramaqueen.com.tw/news/20220414/001.html 。同站 2022-03-30〈Netflix台灣2022年4月片單〉列「4 月 19 日《絕命律師》最終第六季，每周二與美國同日」（snippet）。Brave 搜尋摘要另顯示 netflix.com/tw/title/80021955 頁有「絕命律師…starting at $290…16+」（snippet；NT$290 是台灣方案價，但仍屬搜尋摘要）。沒有找到 Netflix Taiwan 官方 YouTube 上傳；搜到的「《絕命律師》最終季中文預告」是個人頻道「caesar」上傳的（read，不採用）。
   - **判定：likely → 台灣媒體佐證**（2022 年台灣新聞明寫台灣 Netflix 上架；授權片，新聞已超過 3 年，下架風險無法排除）。

## 3. The Wire

1. **片名**：火線重案組（HBO Max TW）／*The Wire*
2. **劇情**：David Simon 為 HBO 創作的犯罪劇，以巴爾的摩為舞台，從警察與毒販兩邊看一場毒品戰爭，之後每季擴及港口、市政、學校與媒體。來源：https://en.wikipedia.org/wiki/The_Wire （read；導言：「a police drama loosely based on the experiences of Simon's writing partner Ed Burns」）。「每季擴及港口、市政、學校、媒體」是編輯概括，Wikipedia 這次只抽了導言，沒有逐季讀。
3. **季數與狀態**：5 季、60 集，2002-06-02 到 2008-03-09，**已完結**。第 1 季 13 集。來源：同上；S1：https://en.wikipedia.org/wiki/The_Wire_season_1 （read）
4. **分級**：美國 **TV-MA**（另有 TV-14 syndicated 版）。Sex & Nudity **Severe**（310/615）、Violence & Gore **Severe**（157/205）、Profanity **Severe**（189/214）、Alcohol, Drugs & Smoking **Severe**（171/193）、Frightening **Severe**（115/205）。投稿特別提到：脫衣舞俱樂部的全裸、停屍間的裸屍；12–16 歲少年被當成殺手；S1E4 兩位警探三分鐘內只講 f-word 約 38 次；吸毒畫面全都拍出來，但有強烈反毒訊息。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt0306414/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **86%**（37 則），Popcornmeter **96%**（1,000+）。Consensus：「Though it takes its time getting started, The Wire is worth the wait, spinning a connective web of characters and delivering no-holds-barred commentary on some of America's unsettling societal problems.」來源：https://www.rottentomatoes.com/tv/the_wire/s01 （read；會轉址到 `/tv/the-wire/s01`）
6. **推薦 tag**：
   - B：BBC2021 #1；NYT2026 #2
   - C：IMDb 9.3（#7）
   - F：PTT 2026 推薦串 ×6；PTT GOAT 串「警匪」
7. **前置作品**：沒有。來源：同欄位 2（read）
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/1bc3aff5-0d6a-4c0b-8ed0-5716ca30ab3b ；JW：https://www.justwatch.com/tw/節目/huo-xian-zhong-an-zu — **已在服務商頁面確認**（5 季；tw-availability-2）

## 4. True Detective

1. **片名**：無間警探（HBO Max TW）／真探（LINE TV）／*True Detective*。兩個平台用不同譯名（tw-availability-1）。
2. **劇情**：Nic Pizzolatto 為 HBO 創作的犯罪選集劇，每一季都是獨立故事，換一批演員與場景。第 1 季是 Matthew McConaughey 與 Woody Harrelson 飾演的兩名路易斯安那州警探，橫跨 17 年追查一樁儀式殺人案。來源：https://en.wikipedia.org/wiki/True_Detective （read；導言：「each season of the series is structured as a self-contained narrative」）。S1 的劇情細節取自 New Yorker 評論（read，見 reviews 檔）。
3. **季數與狀態**：已播 4 季、30 集（2014-01-12 起；第 4 季《闇夜國度》*Night Country* 2024 年播出）。2024 年 2 月 HBO **已續訂第 5 季**，Issa López 續任 showrunner，背景在紐約牙買加灣，**預計 2027 年播出**。第 1 季 8 集。來源：同上（read）；S1：https://en.wikipedia.org/wiki/True_Detective_season_1 （read）
4. **分級**：美國 **TV-MA**。Sex & Nudity **Severe**（532/733）、Violence & Gore **Severe**（195/257）、Profanity **Severe**（204/252）、Alcohol, Drugs & Smoking **Severe**（192/253）、Frightening **Severe**（198/261）。投稿特別提到：S1 每集片頭有性化的女性身體畫面、外遇性愛場面有全裸、被害者裸屍；S1 約 276 次 f-word；兒童誘拐、戀童與獻祭主題；S2 的暴力最重。IMDb 列出的台灣分級是 18+（S3 為 15+）。來源：https://www.imdb.com/title/tt2356777/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **91%**（99 則），Popcornmeter **93%**（1,000+）。Consensus：「In True Detective, performances by Woody Harrelson and Matthew McConaughey reel the viewer in, while the style, vision and direction make it hard to turn away.」來源：https://www.rottentomatoes.com/tv/true_detective/s01 （read）。**各季落差很大**：S2 **47% / 31%**（126 則，https://www.rottentomatoes.com/tv/true_detective/s02 ，read）；S4《闇夜國度》**93% / 55%**（210 則，https://www.rottentomatoes.com/tv/true_detective/s04 ，read）。
6. **推薦 tag**：
   - A：Emmy Limited nom 2024；GG Limited nom 2025（兩者都是 S4《闇夜國度》）
   - B：BBC2021 #31；NYT2026 #35；Vulture2024（Jen Chaney #10）；THR2024（Angie Han #9）
   - C：IMDb 8.8（#50）；RT 2024 Night Country 93% / Popcorn 55%
   - F：PTT 2026 推薦串 ×2（推的是 S1/S2）；PTT GOAT 串推文
7. **前置作品**：沒有。選集劇，每季獨立，可以只看 S1。來源：同欄位 2（read）。「可以只看 S1」是編輯判斷。
8. **台灣串流**：HBO Max（訂閱，4 季）https://www.hbomax.com/tw/zh/show/9a4a3645-74e0-4e4d-9f35-31464b402357 ；LINE TV（免費看，有 VIP 方案；JW 寫 1 季）https://www.linetv.tw/drama/18655/eps/1 — **A（confirmed on service page）**（tw-availability-1）

## 5. Fargo

1. **片名**：冰血暴（JW TW 頁 h1「冰血暴 (2014)」；Prime Video 頁沒有中文化，見 tw-availability-2）／*Fargo*
2. **劇情**：Noah Hawley 為 FX 打造的黑色幽默犯罪選集劇，靈感來自柯恩兄弟 1996 年同名電影，每季在美國中西部講一樁不同年代、不同角色的犯罪故事。來源：https://en.wikipedia.org/wiki/Fargo_(TV_series) （read；導言：「It is based on the 1996 film written and directed by Joel and Ethan Coen」）。「選集」性質由 LA Times 評論佐證（read）與 IMDb 簡介「Various chronicles of deception, intrigue, and murder」（read）。
3. **季數與狀態**：已播 5 季、51 集（2014-04-15 起；第 5 季 2023 年）。**第 6 季尚未正式續訂**：Wikipedia 寫 2026 年製作人 Warren Littlefield 表示「despite the series not yet officially being renewed」，希望很快宣布。第 1 季 10 集。來源：同上；S1：https://en.wikipedia.org/wiki/Fargo_season_1 （read）。IMDb 標題列寫「2014–2024」（read），與 Wikipedia「present」不一致，以 Wikipedia 內文為準。
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt2802850/ ）。Sex & Nudity **Moderate**（123/394）、Violence & Gore **Severe**（124/153）、Profanity **Moderate**（64/131）、Alcohol, Drugs & Smoking **Mild**（61/116）、Frightening **Severe**（74/121）。投稿特別提到：槍殺、刺殺都帶血，S1 有用鐵鎚殺妻（畫面外，但看得到屍體）；S1–S2 幾乎沒有 f-word，S4–S5 髒話變多；投稿說 S1 是最暴力血腥的一季。使用者建議分級：「Rated TV-MA for strong violence and bloody images, some sexual content, language and drug use.」來源：https://www.imdb.com/title/tt2802850/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **97%**（140 則），Popcornmeter **97%**（5,000+）。Consensus：「Based on the film of the same name in atmosphere, style and location only, Fargo presents more quirky characters and a new storyline that is expertly executed with dark humor and odd twists.」來源：https://www.rottentomatoes.com/tv/fargo/s01 （read）。最新 S5 為 **93% / 89%**（55 則，https://www.rottentomatoes.com/tv/fargo/s05 ，read）。
6. **推薦 tag**：
   - A：Emmy Limited nom 2016、2017、2024；GG Limited nom 2016、2018、2024
   - B：BBC2021 #35；Vulture2024（other highlights，未排名）
   - C：IMDb 8.8（#52）
   - F、G：無（fans 檔只把 Fargo 列在「範圍外經典」，不算）
7. **前置作品**：**不必先看 1996 年電影**。每季是獨立故事，和電影只有氛圍與少數連結。LA Times 評論：「Neither prequel, sequel or remake, this “Fargo” is instead a tonal accompaniment」（read，見 reviews 檔）。
8. **台灣串流**：Prime Video（訂閱）https://www.primevideo.com/detail?gti=amzn1.dv.gti.3aa9f7ba-7328-4bc4-422f-a20ba2ad9584 ；JW：https://www.justwatch.com/tw/節目/bing-xie-bao — **僅 JustWatch**（Prime 頁從美國出口讀取；tw-availability-2）。
   - **本輪補查**：沒有找到台灣官方或台灣新聞說 Fargo 在台灣哪個平台上架。搜尋到的 `primevideo.com/-/zh_TW/detail/0P9EK24RWP34IFGBAYYKI75GZE` 頁內容是葡萄牙文分集名、標「訂閱 Prime Video 或 MGM+」（snippet），屬語言版頁，不是台灣證據（同 tw-availability-official 的 Prime 判準）。zh-Hant Wikipedia 的「海外播出」只記 S1 2015-05-21 在公視播出（snippet，已過時）。Disney+ zh-tw 頁沒有搜到（FX 作品在亞洲多半上 Disney+，但本劇沒有找到）。Apple TV TW 搜到的「冰血暴」是 1996 年電影，不是影集。
   - **判定：unconfirmed（僅 JustWatch TW）**。

## 6. Mindhunter

1. **片名**：破案神探（Netflix TW；tw-availability-2 以台灣出口讀取）／*Mindhunter*
2. **劇情**：改編自 John E. Douglas 與 Mark Olshaker 1995 年的真實犯罪書，講 1970 年代末兩名 FBI 探員訪談在押的連續殺人犯、建立犯罪側寫方法的過程；David Fincher 是最主要的導演與實質 showrunner。來源：https://en.wikipedia.org/wiki/Mindhunter_(TV_series) （read）；「1970 年代末」取自 IMDb 簡介「In the late 1970s, two FBI agents…」（read）。
3. **季數與狀態**：2 季、19 集，2017-10-13 到 2019-08-16。**第 3 季無限期擱置**：2020 年 1 月 Netflix 解除演員合約，2020 年 10 月 Fincher 證實「done for now」，Netflix 發言人說「maybe in five years」。實質上**未完結、停在第 2 季**。第 1 季 10 集。來源：同上（read）。電影神搜 2025–2026 年另有報導說可能以三部電影形式回歸（snippet，未查證）。
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt5290382/ ）。Sex & Nudity **Severe**（369/699）、Violence & Gore **Severe**（252/350）、Profanity **Moderate**（144/363）、Alcohol, Drugs & Smoking **Mild**（156/317）、Frightening **Moderate**（107/311）。投稿特別提到：畫面上的暴力不多，但殺人犯在訪談中詳細描述姦屍、亂倫等性犯罪；S1E1 開場有遠景的男性正面全裸；S2 圍繞兒童謀殺案，畫面出現兒童屍體；片頭穿插腐屍特寫。來源：https://www.imdb.com/title/tt5290382/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **96%**（103 則），Popcornmeter **95%**（2,500+）。Consensus：「Mindhunter distinguishes itself in a crowded genre with ambitiously cinematic visuals and a meticulous attention to character development.」來源：https://www.rottentomatoes.com/tv/mindhunter/s01 （read）。Wikipedia 另記 S2 為 99%（70 則，read，未另開 RT 頁核對）。
6. **推薦 tag**：
   - B：BBC2021 #79
   - C：IMDb 8.6（#150）
   - F：PTT 2026 推薦串 ×7；PTT GOAT 串推文
7. **前置作品**：沒有。**寫作時要提醒讀者劇情停在第 2 季、沒有結局**。來源：同欄位 3（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/80114855 ；JW：https://www.justwatch.com/tw/節目/po-an-shen-tan — **已在服務商頁面確認**（以台灣出口讀取；2 季；tw-availability-2）

## 7. Narcos

1. **片名**：毒梟（tw-availability-2 譯名取自搜尋摘要「觀賞《毒梟》｜Netflix 正式網頁」；本輪 Netflix Malaysia 繁中頻道影片標題「《毒梟》- 花絮 - Netflix」，read）／*Narcos*
2. **劇情**：在哥倫比亞拍攝的犯罪劇，第 1、2 季講麥德林販毒集團首領 Pablo Escobar（Wagner Moura）的崛起與美國緝毒局（DEA）的追捕，第 3 季轉向卡利集團。來源：https://en.wikipedia.org/wiki/Narcos （read；導言：「seasons 1 and 2 are about Colombian narcoterrorist and drug lord Pablo Escobar」）。「第 3 季轉向卡利集團」未在本次抽取的段落中，屬背景知識，寫作前要再查。
3. **季數與狀態**：3 季、30 集，2015-08-28 到 2017-09-01，**已完結**。原訂的第 4 季改為獨立新劇《毒梟：墨西哥》（*Narcos: Mexico*，2018-11-16 起）。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt2707408/ ）。Sex & Nudity **Severe**（448/616）、Violence & Gore **Severe**（238/271）、Profanity **Severe**（217/269）、Alcohol, Drugs & Smoking **Severe**（224/258）、Frightening **Severe**（194/252）。投稿特別提到：S1 有多場全裸性愛，一場輪姦；汽車炸彈、客機爆炸、商場爆炸造成兒童死亡、五馬分屍、電鋸斬首；穿插真實新聞畫面的屍體；古柯鹼製造流程拍得很細。使用者建議分級：「Rated R for strong brutal bloody violence including scenes of torture, …, graphic nudity, pervasive language, and drug content throughout.」來源：https://www.imdb.com/title/tt2707408/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **78%**（50 則），Popcornmeter **95%**（2,500+）。Consensus：「Narcos lacks sympathetic characters, but pulls in the viewer with solid acting and a story that's fast-paced enough to distract from its familiar outline.」來源：https://www.rottentomatoes.com/tv/narcos/s01 （read）。本批評論與觀眾落差最大的之一。
6. **推薦 tag**：
   - A：GG Drama nom 2016
   - B：BBC2021 #84=
   - C：IMDb 8.7（#83）
7. **前置作品**：沒有。續作《毒梟：墨西哥》是另一部劇，不必一起看。來源：同欄位 3（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/80025172 ；JW：https://www.justwatch.com/tw/節目/du-xiao — **僅 JustWatch**（Netflix 頁只讀到非台灣出口版本；tw-availability-2）。
   - **本輪補查**：Netflix Malaysia（@netflixasia 繁中亞洲頻道）2016-09-20 上傳「《毒梟》- 花絮 - Netflix」：https://www.youtube.com/watch?v=DJ4xiCZlG7s （read；頻道名與日期由 `link[itemprop=name]`、`meta[itemprop=datePublished]` 抽出）。同頻道另有「《毒梟：墨西哥》| 單挑對決 | Netflix」（snippet）。DramaQueen 的劇頁把本劇列在「Netflix台灣片單」相關文章下（snippet）。沒有找到 Netflix Taiwan 專屬頻道或 2024 年後的台灣新聞。
   - **判定：likely**（Netflix 原創品牌、官方繁中亞洲頻道有宣傳，但證據是 2016 年、且不是台灣專屬頻道；比照 tw-availability-official 對 OITNB 的處理）。

## 8. Ozark

1. **片名**：黑錢勝地（Netflix TW 頁「觀賞《黑錢勝地》｜Netflix 正式網頁」，見 tw-availability-3）／*Ozark*
2. **劇情**：芝加哥理財顧問 Marty Byrde（Jason Bateman）替墨西哥販毒集團洗錢出了差錯，為了保命提議到密蘇里州歐札克湖區建立更大的洗錢網，帶著妻子 Wendy（Laura Linney）和孩子連夜搬家。來源：https://en.wikipedia.org/wiki/Ozark_(TV_series) （read；「After a money laundering scheme for a Mexican drug cartel goes wrong, financial advisor Marty Byrde proposes to make amends by offering to set up a bigger laundering operation in the Lake of the Ozarks」）
3. **季數與狀態**：4 季、44 集，2017-07-21 到 2022-04-29，**已完結**。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt5071412/ ）。Sex & Nudity **Severe**（448/856）、Violence & Gore **Severe**（251/357）、Profanity **Severe**（286/373）、Alcohol, Drugs & Smoking **Severe**（226/334）、Frightening **Severe**（186/319）。投稿特別提到：S1 有多場露骨性愛；暴力不頻繁，但一發生就很血腥（割喉、霰彈槍打爛手、水刑）；未成年飲酒、強制注射海洛因偽裝過量；投稿形容「Level of dark: 9/10」。來源：https://www.imdb.com/title/tt5071412/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **70%**（69 則），Popcornmeter **92%**（2,500+）。Consensus：「Ozark hasn't yet reached the same level as the classic crime dramas to which it will inevitably be compared, but its satisfyingly complex plot - and a gripping performance from Jason Bateman - suggest greater potential.」來源：https://www.rottentomatoes.com/tv/ozark/s01 （read）。最終季 S4 為 **85% / 72%**（66 則，https://www.rottentomatoes.com/tv/ozark/s04 ，read）：評論變好、觀眾變冷。
6. **推薦 tag**：
   - A：Emmy Drama nom 2019、2020、2022；GG Drama nom 2021、2023
   - B：NYT2026 #68
   - F：PTT 2026 推薦串 ×4
7. **前置作品**：沒有。來源：同欄位 2（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/80117552 ；JW：https://www.justwatch.com/tw/節目/ozark — **confirmed on service page**（以台灣地區代理打開，共 4 季；tw-availability-3）

## 9. Mare of Easttown

1. **片名**：東城奇案（HBO Max TW）／*Mare of Easttown*
2. **劇情**：Brad Ingelsby 為 HBO 創作的犯罪迷你影集，Kate Winslet 飾演費城郊外小鎮的警探 Mare，在調查一名少女命案的同時面對自己破碎的家庭。來源：https://en.wikipedia.org/wiki/Mare_of_Easttown （read；「It stars Kate Winslet in the title role, who investigates a murder in a small town outside Philadelphia」）
3. **季數與狀態**：**迷你影集**（RT 標為 Limited Series），7 集，2021-04-18 到 05-30，已完結。來源：同上（read）
4. **分級**：美國 **TV-MA**（Parents Guide Certifications，read）。Sex & Nudity **Moderate**（141/395）、Violence & Gore **Moderate**（80/145）、Profanity **Moderate**（61/168）、Alcohol, Drugs & Smoking **Moderate**（74/137）、Frightening **Mild**（68/146）。投稿特別提到：短暫胸部裸露、女屍；腹部中槍與突然的爆頭；賣淫、毒癮、自殺主題。IMDb 列出的台灣分級是 18+。來源：https://www.imdb.com/title/tt10155688/parentalguide/ （read）
5. **RT**：Tomatometer **95%**（131 則），Popcornmeter **94%**（1,000+）。Consensus：「Grounded by a career-best Kate Winslet, Mare of Easttown's ambitions at times exceed its reach, but its central mystery is supported by such strong sense of place and character it hardly matters.」來源：https://www.rottentomatoes.com/tv/mare_of_easttown/s01 （read）
6. **推薦 tag**：
   - A：Emmy Limited nom 2021；GG Limited nom 2022
   - B：BBC2021 #66；NYT2026 #65
   - F：PTT 2026 推薦串 ×6
7. **前置作品**：沒有。和《特遣任務》由同一位創作者打造、設定在同一地區，《特遣任務》第 2 季會和本劇交叉（見 Task 欄位 7），但互不需要先看。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/c1517b80-50ab-4733-8208-ae2c2765c0e7 ；JW：https://www.justwatch.com/tw/節目/mare-of-easttown — **已在服務商頁面確認**（tw-availability-2）

## 10. Task

1. **片名**：特遣任務（HBO Max TW）／*Task*
2. **劇情**：背景在費城郊區的勞工階級社區，一名 FBI 探員（Mark Ruffalo）帶領特遣小組，追查一連串洗劫毒窟的暴力搶案，主謀是表面上顧家的垃圾清運工（Tom Pelphrey）。來源：https://en.wikipedia.org/wiki/Task_(TV_series) （read；「an FBI agent heads a Task Force to put an end to a string of violent robberies of drug houses」）；搶匪身分取自 Variety 評論（read）。
3. **季數與狀態**：1 季、7 集，2025-09-07 首播。原本以迷你影集宣傳，2025-11-20 **已續訂第 2 季**；2026 年陸續公布新卡司（Mahershala Ali、Harry Melling、Édgar Ramírez 等）與導演。**第 2 季首播日未查到**。來源：同上（read）
4. **分級**：美國 **TV-MA**（Parents Guide Certifications，read）。Sex & Nudity **Mild**（54/123）、Violence & Gore **Moderate**（21/48）、Profanity **Severe**（36/48）、Alcohol, Drugs & Smoking **Moderate**（26/45）、Frightening **Moderate**（24/39）。投稿特別提到：槍擊有血、保鮮膜悶死、把人按進池塘淹死；f-word 非常多；酗酒、心理健康主題。IMDb 列出的台灣分級是 18+。票數都很少（<130 票），參考性較低。來源：https://www.imdb.com/title/tt28013708/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **96%**（83 則），Popcornmeter **78%**（1,000+）。Consensus：「Mark Ruffalo and Tom Pelphrey are superb in Task, a culturally-specific crime story that's unrelentingly bleak but equally riveting.」來源：https://www.rottentomatoes.com/tv/task/s01 （read）
6. **推薦 tag**：
   - B：CT10-2025 agg #11
   - C：RT 2025 S1 96% / Popcorn 78%
   - F：PTT 2025 年度最佳串 ×2；PTT 2026 推薦串 ×2；RedRecs #6
7. **前置作品**：沒有。Variety 評論提到劇中徵才博覽會出現「Easttown PD」攤位，是向《東城奇案》致意（read）；Wikipedia 的 Variety 引用標題為「task-season-2-mare-of-easttown-crossover-julianne-nicholson」（read，只讀到引用標題），代表第 2 季會和《東城奇案》交叉。都不必先看。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/86bc816f-97a7-4cd6-8d53-08d5e6337063 ；JW：https://www.justwatch.com/tw/節目/te-qian-ren-wu — **已在服務商頁面確認**（tw-availability-2）

## 11. Ripley

1. **片名**：雷普利（JW TW；本輪 DramaQueen 2024-01-23 報導也用此名，read；Netflix TW 頁搜尋摘要「雷普利」，snippet）／*Ripley*
2. **劇情**：改編自 Patricia Highsmith 1955 年小說《天才雷普利》，1960 年代在紐約靠小詐騙度日的 Tom Ripley（Andrew Scott）受富商之託，到義大利勸其子 Dickie 回家，從此踏上冒名與謀殺之路；全劇黑白攝影，由 Steven Zaillian 一人編導。來源：https://en.wikipedia.org/wiki/Ripley_(TV_series) （read）；劇情句取自 IMDb 簡介「A grifter named Ripley living in New York during the 1960s is hired by a wealthy man to bring his vagabond son home from Italy.」（read）
3. **季數與狀態**：**迷你影集**（Wikipedia：「the eight-episode limited series」；RT 標 Limited Series），8 集，2024-04-04 在 Netflix 一次上線，已完結。原本為 Showtime 製作，2023 年 2 月改由 Netflix 播出。來源：同上（read）；Showtime 轉 Netflix 取自 DramaQueen 2023-02-13 標題（snippet）與 Vulture 評論（read）。
4. **分級**：美國 **TV-MA**（Parents Guide Certifications，read）。Content rating 摘要：Sex & Nudity **Mild**（61/144）、Violence & Gore **Moderate**（24/56）、Profanity **Mild**（24/43）、Alcohol, Drugs & Smoking **Moderate**（18/42）、Frightening **Moderate**（17/43）。投稿特別提到：只有男性背面裸露與裸女畫作；少數幾場殘暴毆打；抽菸喝酒。是本批分級最輕的一部。IMDb 列出的台灣分級是 15+。來源：https://www.imdb.com/title/tt11016042/parentalguide/ （read）
5. **RT**：Tomatometer **86%**（136 則），Popcornmeter **82%**（500+）。Consensus：「Bathed in opulent black and white with a reptilian Andrew Scott holding the screen hostage, Steven Zaillian's sumptuous reinterpretation of Ripley draws fresh blood from Patricia Highsmith's insidious social climber.」來源：https://www.rottentomatoes.com/tv/ripley/s01 （read）
6. **推薦 tag**：
   - A：Emmy Limited nom 2024；GG Limited nom 2025
   - B：Vulture2024（Jen Chaney #2、Roxana Hadadi #2、Kathryn VanArendonk #7）；THR2024（Daniel Fienberg #2、Angie Han #4）；CT10-2024 agg #6
   - C：RT 2024 86% / Popcorn 82%
7. **前置作品**：沒有，不必先看 1999 年麥特戴蒙版電影。來源：Wikipedia「the first adaptation of Highsmith's novel to a series」（read）。「不必先看」是編輯判斷。
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81678765 ；JW：https://www.justwatch.com/tw/節目/lei-pu-li — **JustWatch only**（Netflix 頁打開時是美國版；tw-availability-3）。
   - **本輪補查**：DramaQueen 電視迷 2024-01-23〈Netflix新劇《雷普利》曝前導預告！…〉：「Netflix 原創新劇《雷普利》（Ripley）…《雷普利》將於 4 月 4 日在 Netflix 上線。」（read）https://www.dramaqueen.com.tw/news/20240123/004.html 。電影神搜 2024-04-10 劇評開頭即寫「Netflix 影集《雷普利》」（read）。報導引用的預告來源是 Netflix 英文總頻道「Ripley | Official Teaser | Netflix」（https://www.youtube.com/watch?v=UE0byWSKp0E ，2024-01-22，read），不是台灣頻道；找到的中文字幕預告是第三方頻道「Yumu movie trailer」（不採用）。沒有找到 Netflix Taiwan 頻道上傳。
   - **判定：confirmed（台灣媒體，Netflix 品牌原創、全球同步上線）**，比照 tw-availability-official 對 Sirens 的處理：台灣譯名只出現在台灣媒體，沒有 Netflix Taiwan YouTube 佐證。

## 12. House of Cards

1. **片名**：紙牌屋（Netflix Malaysia 繁中頻道影片標題「《紙牌屋》| 前導預告：墓地 | Netflix [HD]」，read；tw-availability-1 記 JW 顯示簡體「纸牌屋」）／*House of Cards*
2. **劇情**：Netflix 第一部由片廠為其製作的影集，改編自 Michael Dobbs 小說與 1990 年 BBC 同名影集；南卡羅來納州民主黨眾議員 Frank Underwood（Kevin Spacey）沒拿到承諾的國務卿職位，和同樣野心勃勃的妻子 Claire（Robin Wright）聯手報復、一路奪權。來源：https://en.wikipedia.org/wiki/House_of_Cards_(American_TV_series) （read）
3. **季數與狀態**：6 季、73 集，2013-02-01 到 2018-11-02，**已完結**。2017 年 Spacey 遭性騷擾指控後被 Netflix 解約，最終季改由 Robin Wright 主演、縮為 8 集。第 1 季 13 集（Wikipedia 導言「The first 13-episode season」）。來源：同上（read）
4. **分級**：美國 **TV-MA**（Parents Guide 摘要，read）。Sex & Nudity **Moderate**（155/474）、Violence & Gore **Moderate**（68/176）、Profanity **Moderate**（76/162）、Alcohol, Drugs & Smoking **Moderate**（88/139）、Frightening **Moderate**（65/130）。投稿特別提到：性愛場面多但裸露有限；主角夫妻殺人或下令殺人，暴力不頻繁但有幾次令人震驚；抽菸、酗酒、古柯鹼。是本批唯一五項都是 Moderate 的劇。IMDb 列出的台灣分級是 18+（S4 為 12+；串流分級 16+）。來源：https://www.imdb.com/title/tt1856010/parentalguide/ （read）
5. **RT（S1）**：Tomatometer **87%**（47 則），Popcornmeter **97%**（2,500+）。Consensus：「Bolstered by strong performances -- especially from Kevin Spacey -- and surehanded direction, House of Cards is a slick, engrossing drama that may redefine how television is produced.」來源：https://www.rottentomatoes.com/tv/house_of_cards/s01 （read；轉址到 `/tv/house-of-cards/s01`）。**最終季 S6 為 65% / 19%**（68 則，https://www.rottentomatoes.com/tv/house_of_cards/s06 ，read）：觀眾分數崩跌。
6. **推薦 tag**：
   - A：Emmy Drama nom 2016、2017
   - B：BBC2021 #60；NYT2026 #48
   - C：IMDb 8.6（#152）
   - F：PTT 2026 推薦串；PTT GOAT 串推文
   - G：GQ TW 10 部馬拉松影集
7. **前置作品**：沒有，不必先看 1990 年 BBC 版。來源：同欄位 2（read）。**寫作時要說明主演 Spacey 在最終季前被解約，S6 評價大跌**（欄位 3、5）。
8. **台灣串流**：Netflix（訂閱，6 季）https://www.netflix.com/tw/title/70178217 — **C（JustWatch only）**（tw-availability-1）。
   - **本輪補查**：Netflix Malaysia（@netflixasia 繁中亞洲頻道）2018-09-05 上傳「《紙牌屋》| 前導預告：墓地 | Netflix [HD]」，說明寫「《紙牌屋》最後一季，2018 年 11 月 2 日，Netflix 首播」：https://www.youtube.com/watch?v=fhvgRqRhOG4 （read）。同頻道另有「《紙牌屋》| 前導預告 | Netflix [HD]」（https://www.youtube.com/watch?v=l68KYce4wXo ，snippet）。這也確認了繁中官方譯名「紙牌屋」。沒有找到 Netflix Taiwan 專屬頻道或近年台灣新聞。
   - **判定：likely**（Netflix 原創、官方繁中亞洲頻道宣傳，但證據是 2018 年、不是台灣專屬頻道）。

---

## 結果摘要

- 12 部都有讀到的來源（read），涵蓋欄位 2、3、4、5、7。分級細項 12/12 都從 Parents Guide 全頁讀到。
- 欄位 8 在服務頁確認（A／confirmed／已確認）的有 7 部：Breaking Bad、The Wire、True Detective、Mindhunter、Ozark、Mare of Easttown、Task。
- 本輪補查後：
  - **confirmed（台灣媒體）**：Ripley（DramaQueen 2024，Netflix 原創全球上線）
  - **likely**：Better Call Saul（DramaQueen 2022「台灣觀眾可在 Netflix 收看」，授權片）、Narcos（Netflix Malaysia 繁中頻道 2016）、House of Cards（Netflix Malaysia 繁中頻道 2018）
  - **unconfirmed**：Fargo（只有 JustWatch TW 的 Prime Video；沒有任何台灣官方或新聞證據）

## 無法查證或尚待確認的事實

1. **Fargo 在台灣的合法管道**：只有 JustWatch TW 列 Prime Video。Prime 的 zh_TW 頁只是語言版（頁內是葡萄牙文分集名、MGM+ 頻道），不能當台灣證據。建議用台灣 IP 開 Prime Video 與 Disney+ 人工確認；若仍無法確認，文章只寫「JustWatch 台灣列出 Prime Video（2026-11-05 查）」或改列候補。
2. **Better Call Saul、Narcos、House of Cards 的現況**：證據分別是 2022、2016、2018 年。BCS 是 Sony 授權片，下架風險最高。三部都沒有 Netflix Taiwan 專屬頻道上傳。
3. **Task 第 2 季首播日**：Wikipedia 只寫續訂與 2026 年選角，沒有首播日。
4. **Fargo 第 6 季**：截至 Wikipedia 本次版本仍「not yet officially being renewed」；IMDb 標題列卻寫「2014–2024」，兩者不一致。
5. **Mindhunter 的未來**：電影神搜有「可能以三部電影形式回歸」的報導（snippet），沒有讀原文，也沒有官方確認。
6. **Narcos 第 3 季的主題（卡利集團）**：本次抽取的 Wikipedia 段落沒有寫到，屬背景知識，動筆前要補查。
7. **The Wire 每季主題（港口、市政、學校、媒體）**：同上，是編輯概括，沒有逐季讀 Wikipedia。
8. **Mindhunter S2 的 RT 分數**：只讀到 Wikipedia 轉述的 99%，沒有開 RT S2 頁。
9. **Parents Guide 票數偏少**：Task（<130 票）、Ripley（<150 票）的嚴重度參考性較低。
10. **Fargo 在 2014 年的 Emmy 得獎**：candidates 檔只涵蓋 2016 年後的獎項，所以 tag 只有提名；S1 在 2014 年的得獎紀錄沒有收進來，要寫的話需另查。

## 工具降級紀錄（toolDegradation）

- 直接 `curl`：容器代理拒絕 CONNECT（wikipedia、rottentomatoes、metacritic、wikidata 都 403），全部改走 Groundlane。
- Groundlane `web_extract`（render=never）：Wikipedia wikitext、Wikidata、RT、YouTube watch 頁全部成功，沒有降級。Wikidata 的 P345 用 JSON 結構 pattern 抓不到，改用 `"(tt\d{7,8})"` 寬鬆 pattern。
- IMDb Parents Guide：Tavily extract（advanced + query）只回片段、缺兩個類別 → Jina `read_url`（不帶 key，回傳全頁）讀 12 頁，成功。
- IMDb 標題頁：Exa `web_fetch_exa`（maxCharacters 500–900），12/12 成功。
- Groundlane `web_search`：後段兩次回 `RATE_LIMITED`（brave），改用 Tavily / Exa 搜尋。
- 沒有使用 Firecrawl、cloudflare `get_url_markdown`，也沒有使用台灣地區代理或任何繞過人機驗證的方法。
