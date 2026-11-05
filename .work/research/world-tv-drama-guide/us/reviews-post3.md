# Reviews & ratings：post 3「美劇｜職人、歷史與人生劇情」（19 部）

查核日期：2026-11-05。資料檔，不是文章稿。爛番茄見 `factsheets-post3.md`，這裡不重抓。

## 讀法

- **read**：實際讀到頁面內容（Groundlane `web_fetch` / `web_extract`，或 Exa `web_fetch_exa` 回傳的頁面快取全文）。
- **read (Exa cache)**：Exa 回傳的頁面快取，內容是原頁文字，但不是即時抓取。豆瓣直接抓會被導到 `sec.douban.com` 人機驗證頁，**沒有繞過**；能讀到的都是 Exa 快取。
- **read (partial)**：只讀到開頭或付費牆前的段落。
- **snippet**：只看到搜尋摘要，不算讀過。
- Metacritic：`metacritic.com/tv/<slug>/season-N/` 頁的 Metascore 與 Positive/Mixed/Negative 評論數加總（= critic reviews 數）。全部 read（Groundlane）。
- IMDb：series 主頁的 IMDb RATING。Groundlane 直抓回 202 空頁，改用 Tavily extract（advanced）讀到。全部 read (chunks)。
- 英文影評的 verbatim 短句都是我在頁面上讀到的（標題、副標或內文）；標 *(MC excerpt)* 的是 Metacritic 頁面上的節錄，不是原文頁。

### toolDegradation

- Groundlane `web_fetch`：Metacritic、Guardian、Variety、Vulture、Slate、New Yorker、LA Times、THR、IndieWire OK。Telegraph 回 402（TollBit token），The Atlantic 回 Cloudflare 403，NYT 回 403 空頁 → 改用 Exa 快取（NYT 兩篇）或換媒體。
- 豆瓣：Groundlane / Tavily extract / jina 全部失敗（sec.douban.com 驗證、Tavily "Failed to fetch"、jina 422）。Exa `web_fetch_exa` 能讀部分 subject 頁快取（但多半沒有評分人數），其餘 403 / timeout → 用 Tavily / Exa 搜尋摘要（標 snippet）。
- Tavily search 中途 429 一次，稍後恢復。
- Firecrawl 本輪沒用到。

---

## 1. The Pitt｜匹茲堡醫魂（S1）

- **Metacritic S1**：**78**（32 critic reviews：27 正／5 中／0 負）；user 7.8 — https://www.metacritic.com/tv/the-pitt/season-1/ （read）
- **IMDb（series）**：**8.9/10，179K** — https://www.imdb.com/title/tt31938062/ （read (chunks)）
- **豆瓣 S1**：**9.5/10，75,801 人評價**（No.1 豆瓣 2025 評分最高英美新劇）— https://movie.douban.com/subject/36831851/ （read (Exa cache)）
- **英文影評**：The Guardian｜Benjamin Lee｜2025-01-09｜"The Pitt review – real-time medical drama puts Noah Wyle back in ER" — https://www.theguardian.com/tv-and-radio/2025/jan/09/the-pitt-review-noah-wyle （read (partial)）
  - 判語：認為它卡在 ER 的陰影裡，在寫實與黃金時段肥皂劇之間拿不定主意，整體不如 ER。MC 給 40，是 S1 最低分。
  - 原句："soapy acting and thinly written characters ultimately derail"（副標）
- **中文影評**：豆瓣影評「目前为止最佳医疗剧没有之一」— https://m.douban.com/movie/review/16582947 （snippet；作者、讚數、日期未讀到）
  - 判語：稱是「豪斯醫生之後醫療劇巔峰之作」，特別推第 12 集。地區：中國（豆瓣）。
  - 台灣來源沒找到正式劇評（釀電影／關鍵評論網搜尋無 S1 劇評）。台灣端可參考 VERSE〈最狂美劇《匹茲堡醫魂》的五大重要看點〉2026-07-10 https://www.verse.com.tw/article/emmyaward-the-Pitt （snippet，偏介紹文）。
- **分歧**：Guardian 40 分是明顯異議；豆瓣 9.5 比 IMDb 8.9 還高，屬少見的「中國觀眾更愛」案例。

## 2. The Bear｜大熊餐廳（S1）

- **Metacritic S1**：**88**（24 reviews：24 正／0／0，must-watch）；user 8.2 — https://www.metacritic.com/tv/the-bear/season-1/ （read）
- **IMDb**：**8.5/10，330K** — https://www.imdb.com/title/tt14452776/ （read (chunks)）
- **豆瓣 S1**：**8.4/10，43,725 人評價**（好於 85% 剧情片）— https://movie.douban.com/subject/35900652/ （read (Exa cache)，來自 m.douban.com 頁快取）
- **英文影評**：Vulture｜Jen Chaney｜2022-06-23｜"Review: 'The Bear' Is Gorgeously, Addictively Stressful"（頁內標題 "The Bear Never Stops Moving"）— https://www.vulture.com/article/the-bear-fx-hulu-series-review.html （read (partial)）
  - 判語：不解釋行話、不鋪背景，把觀眾直接丟進廚房的旋轉木馬，節奏就是它的運作原則。
  - 原句："'The Bear' Is Gorgeously, Addictively Stressful"（標題）
  - 備註：原本選 Telegraph（Anita Singh，MC 100）但 402 讀不到；The Atlantic 也被擋。
- **中文影評**：關鍵評論網（方格子直送轉載）｜作者未在摘要顯示｜「【影評】零負評美劇《大熊餐廳》：粗俗的米其林大廚，縱橫混亂廚房理解『人生』這道難題」— https://www.thenewslens.com/article/195717 （snippet）
  - 判語：髒話滿天飛但角色互動溫馨，讀成一部「在混亂中找平衡」的人生劇。地區：台灣。
  - 備用（第三季）：釀電影〈《大熊餐廳》第三季：一封寫給餐飲從業人員的情書〉https://filmaholic.tw/series/66b9e8c2fd89780001eaa2e5 （snippet；作者為釀電影專欄作者，姓名未在摘要出現）
- **分歧**：評論一面倒；豆瓣 8.4 相對其他高分美劇偏低（短評有「好吵」「lip 演啥都躁鬱症味兒」等抱怨）。

## 3. Succession｜繼承之戰（S1）

- **Metacritic S1**：**70**（29 reviews：20 正／8 中／1 負）；user 8.1 — https://www.metacritic.com/tv/succession/season-1/ （read）
- **IMDb**：**8.8/10，372K** — https://www.imdb.com/title/tt7660850/ （read (chunks)）
- **豆瓣 S1**：**8.4/10**，評分人數 **67,838**（人數來自同劇分集頁摘要）— https://movie.douban.com/subject/26813224/ （分數 read (Exa cache)；人數 snippet）
- **英文影評**：The New Yorker｜Troy Patterson｜2018-06-01｜"'Succession,' Reviewed: An Irresistible Family Power Struggle, Told Through Soap and Satire" — https://www.newyorker.com/culture/on-television/succession-reviewed-an-irresistible-family-power-struggle-told-through-soap-and-satire （read (partial)）
  - 判語：用肥皂劇加諷刺的輕快混搭，把一家人的權力關係畫得清楚又不說破。
  - 原句："demonstrates an elliptical elegance in clearly diagramming these relationships"
- **中文影評**：關鍵評論網｜作者未在摘要顯示（自介為前大學助理教授、托爾金研究者，旅居赫爾辛基）｜「【劇評】HBO《繼承之戰》橫掃艾美獎：莎士比亞式豪門家族鬥爭，角色心境全解析」— https://www.thenewslens.com/article/162754 （snippet；涵蓋 S1–S3，日期約 2022）
  - 判語：把 Logan Roy 讀成後現代李爾王，影射梅鐸與川普家族。地區：台灣。
- **分歧**：S1 的 Metascore 只有 70（28% mixed），遠低於後幾季的口碑與 IMDb 8.8；第一季評論普遍「慢熱」。

## 4. The Morning Show｜晨間直播秀（S1）

- **Metacritic S1**：**61**（37 reviews：16 正／18 中／3 負）；user 7.0 — https://www.metacritic.com/tv/the-morning-show/season-1/ （read）
- **IMDb**：**8.1/10，153K** — https://www.imdb.com/title/tt7203552/ （read (chunks)）
- **豆瓣 S1**：**8.6/10**；評分人數 **45,286**（豆列摘要）— https://movie.douban.com/subject/27099158/ （分數 read (Exa cache)；人數 snippet https://m.douban.com/doulist/154610973/）
- **英文影評**：The Guardian｜Lucy Mangan｜2019-11-01｜"The Morning Show review – Jennifer Aniston returns in a masterwork for the #MeToo era" — https://www.theguardian.com/tv-and-radio/2019/nov/01/the-morning-show-review-jennifer-aniston （read (partial)）
  - 判語：#MeToo 讓整個製作有種急迫感，偶有笨拙處但被活力蓋過，Aniston 表現最好。MC 給 100，是正面極端。
  - 原句："a slick, sophisticated venture stuffed with powerhouse performances"
- **中文影評**：關鍵評論網｜「餵電影 WEi MOViE」專欄｜2021-09-01｜「【串流推片單】《晨間直播秀》呈現有毒厭女文化、《婚姻場景》改編柏格曼大師經典」— https://www.thenewslens.com/article/155184 （snippet）
  - 判語：認為成功不只是議題搭上 #MeToo 的運氣，劇本結構縝密、對白犀利。地區：台灣。（片單式短評，以 S2 開播為由談 S1。）
- **分歧**：美國評論分裂（Metascore 61、近半 mixed），但 Guardian 給滿分；豆瓣 8.6、IMDb 8.1 都明顯高於評論。

## 5. Landman｜石油天王（S1）

- **Metacritic S1**：**60**（20 reviews：10 正／7 中／3 負）；user **8.4** — https://www.metacritic.com/tv/landman/season-1/ （read）
- **IMDb**：**8.2/10，120K** — https://www.imdb.com/title/tt14186672/ （read (chunks)）
- **豆瓣 S1**：**8.3/10**（人數未取得）— https://m.douban.com/movie/subject/35930321 （snippet；Exa 403）
- **英文影評**：Variety｜Alison Herman｜2024-11-17｜"'Landman' Review: Taylor Sheridan Oil Drama Engrosses" — https://variety.com/2024/tv/tv-reviews/landman-review-taylor-sheridan-billy-bob-thornton-1236204963/ （read (partial)）
  - 判語：有《黃石》的陽剛與保守底色，但對二疊紀盆地油田的細節描寫讓它站得住，Thornton 是最大支柱。
  - 原句："builds an immersive, detailed world in the sun-baked Permian Basin"
- **中文影評**：豆瓣「石油天王第一季 全部影評」頁，熱門影評標題「泰勒谢里丹又押对宝」— https://m.douban.com/movie/subject/35930321/reviews （snippet；作者、讚數未讀到）
  - 地區：中國。台灣只找到 vocus「Simon's 娛樂隨筆」心得文（非知名評論人，依規則不採用）https://vocus.cc/article/6a0f19fefd897800013a216a
- **分歧**：典型「評論 vs 觀眾」落差：Metascore 60，但 MC user 8.4、IMDb 8.2、豆瓣 8.3。

## 6. Shōgun｜幕府將軍（S1）

- **Metacritic S1**：**85**（41 reviews：39 正／2 中／0 負，must-watch）；user 8.8 — https://www.metacritic.com/tv/shogun-2024/season-1/ （read；slug 是 `shogun-2024`）
- **IMDb**：**8.6/10，255K** — https://www.imdb.com/title/tt2788316/ （read (chunks)）
- **豆瓣 S1**：**7.8/10**（另一則摘要寫 7.9；人數未取得）— https://m.douban.com/movie/subject/30291334 （snippet；Exa 403/timeout）
- **英文影評**：Slate｜Geoffrey Bunting｜2024-02-27｜"After Years of Development, FX's Sweeping New Historical Epic Is Here. It's Exceptional."（頁內標題 "Shōgun Improves On a Notorious Orientalist Blockbuster"）— https://slate.com/culture/2024/02/shogun-series-fx-hulu-book-james-clavell.html （read (partial)）
  - 判語：把一本充滿刻板印象與東方主義的原著，改成給當代全球觀眾的史詩，同時忠於原作情節。
  - 原句："The new adaptation of James Clavell's 1975 book of the same name is a true feat."
- **中文影評**：豆瓣影評「《幕府将军》更像是一场『权力的游戏』」— https://m.douban.com/movie/review/15899936 （snippet；作者、讚數未讀到）
  - 判語：十集幾乎全是政鬥、沒什麼大場面，作者反而欣賞它的克制與不靠尺度討好。地區：中國。
  - 台灣：關鍵評論網只找到艾美獎新聞（無劇評）。
- **分歧**：豆瓣 7.8 明顯低於 IMDb 8.6 與 Metascore 85（豆瓣影評指「國外觀眾更喜歡它」，結局「沒頭沒尾」引來中差評）。

## 7. The Gilded Age｜鍍金年代（S1）

- **Metacritic S1**：**68**（38 reviews：25 正／12 中／1 負）；user **5.9** — https://www.metacritic.com/tv/the-gilded-age/season-1/ （read）
- **IMDb**：**8.1/10，56K** — https://www.imdb.com/title/tt4406178/ （read (chunks)）
- **豆瓣 S1**：**8.6/10**（人數未在快取中）— https://movie.douban.com/subject/26361853/ （read (Exa cache)）
- **英文影評**：Variety｜Daniel D'Addario｜2022-01-20｜"Gilded Age From Downton Abbey Creator Conjures a Bygone World: Review" — https://variety.com/2022/tv/reviews/gilded-age-hbo-review-1235157550/ （read (partial)）
  - 判語：Fellowes 的台詞陳腔濫調到極致，但演員（尤其 Carrie Coon）與美術讓它過關。
  - 原句："A stodgily written costume drama lets in verve, irony, and passion on its margins"
- **中文影評**：豆瓣影評「美剧《镀金时代》剧情精解+背景拓展」— https://m.douban.com/movie/review/14173756 （snippet；偏背景解說，作者名未讀到）
  - 地區：中國。台灣來源未找到。**品質偏弱，建議文章不要引用為「評論」。**
- **分歧**：MC user 5.9 遠低於 IMDb 8.1 與豆瓣 8.6；評論 68 屬溫和。

## 8. Chernobyl｜核爆家園（miniseries）

- **Metacritic S1**：**82**（27 reviews：24 正／3 中／0 負，must-watch）；user 9.2 — https://www.metacritic.com/tv/chernobyl/season-1/ （read）
- **IMDb**：**9.3/10，1.1M** — https://www.imdb.com/title/tt7366338/ （read (chunks)）
- **豆瓣**：**條目自 2019-05 起無法存取**。V2EX 2019-05-17 貼文指 https://movie.douban.com/subject/27098632/ 「你想访问的页面不存在」；開播時摘要 9.6–9.7、約 15 萬人評價（2019-08 部落格截圖描述）。— https://www.v2ex.com/t/564893 、https://m.douban.com/doulist/118239493/ （snippet；本輪 Exa 抓 27098632 為 403/timeout）
- **英文影評**：Los Angeles Times｜Lorraine Ali｜2019-05-03｜"Review: HBO's haunting 'Chernobyl' focuses on the truth tellers who paid dearly" — https://www.latimes.com/entertainment/tv/la-et-st-chernobyl-hbo-review-jared-harris-20190503-story.html （read (partial)）
  - 判語：不是恐怖片，而是關於體制腐敗、無能，以及人民一次次把國家從邊緣拉回來的懸疑悲劇。
  - 原句："a suspenseful, tragic and illuminating drama about government corruption"
- **中文影評**：關鍵評論網｜2019-06-28｜「宛如日常的疏忽與官僚殺人，直接呈現車諾比核災的恐怖感」— https://www.thenewslens.com/article/121381 （snippet；作者未讀到）
  - 判語：成功在氣氛，事故線與「官僚殺人」線交錯。地區：台灣。
- **分歧**：評論與觀眾都極高；豆瓣條目被移除本身就是值得寫的事（中國不引進、條目不可見）。

## 9. Band of Brothers｜諾曼第大空降（miniseries）

- **Metacritic S1**：**86**（28 reviews：23 正／5 中／0 負，must-watch）；user 9.3 — https://www.metacritic.com/tv/band-of-brothers/season-1/ （read）
- **IMDb**：**9.4/10，612K** — https://www.imdb.com/title/tt0185906/ （read (chunks)）
- **豆瓣**：**9.6/10，142,270 人評價**（分集頁摘要；豆瓣搜尋頁摘要另寫 139,913）— https://movie.douban.com/subject/1307847/ （snippet；Exa 403）
- **英文影評**：The New York Times｜Caryn James（署名來自 Wikipedia 引述，原頁快取未顯示署名）｜2001-09-07｜"TV WEEKEND; An Intricate Tapestry Of a Heroic Age" — https://www.nytimes.com/2001/09/07/movies/tv-weekend-an-intricate-tapestry-of-a-heroic-age.html （read (Exa cache, partial)）
  - 判語：片頭的浪漫化讓人擔心，但很快轉入戰爭的感官恐怖，兼顧英雄理想與暴力。
  - 原句："this misleading introduction soon gives way to the visceral horror of war"
- **中文影評**：**未找到**（台灣媒體與豆瓣長評本輪都沒搜到可用條目）。
- **分歧**：無明顯分歧，各平台都 9 分以上。

## 10. Dopesick｜毒疫（miniseries）

- **Metacritic S1**：**68**（25 reviews：17 正／8 中／0 負）；user 8.1 — https://www.metacritic.com/tv/dopesick/season-1/ （read）
- **IMDb**：**8.6/10，96K** — https://www.imdb.com/title/tt9174558/ （read (chunks)）
- **豆瓣**：**9.3/10**（人數未取得）— https://m.douban.com/movie/subject/35101436 （snippet；Exa 快取頁有讀到但沒有分數區塊）
- **英文影評**：The New York Times｜Mike Hale（署名見 NYT 主題頁摘要）｜2021-10-12｜"Review: 'Dopesick' Depicts the Opioid Crisis From All Sides" — https://www.nytimes.com/2021/10/12/arts/television/review-dopesick-hulu.html （read (Exa cache, partial)）
  - 判語：有企圖心但只是斷續地好看，全劇以「痛」為主題串起每個角色。
  - 原句："Hulu's ambitious and intermittently compelling mini-series"
  - 另一極：THR Daniel Fienberg（2021-10-06）"An important topic marred by questionable storytelling choices and performances." — https://www.hollywoodreporter.com/tv/tv-reviews/dopesick-review-1235023711/ （read (Exa search highlight)）
- **中文影評**：豆瓣影評｜weezer｜2022-01-14｜「Dopesick观感」— https://movie.douban.com/review/14140537/ （read (Exa search highlight)；讚數未讀到）
  - 判語：節奏慢、非線性敘事要專心看，但把資本、醫藥銷售、監管失職寫得真實，看完很震撼。地區：中國。
- **分歧**：美國評論只有 68 且 THR 偏負，但豆瓣 9.3、IMDb 8.6 很高——評論與觀眾落差大。

## 11. American Primeval｜馴荒記（miniseries）

- **Metacritic S1**：**58**（29 reviews：13 正／12 中／4 負）；user 7.9 — https://www.metacritic.com/tv/american-primeval/season-1/ （read）
- **IMDb**：**8.0/10，89K** — https://www.imdb.com/title/tt24069848/ （read (chunks)）
- **豆瓣**：**7.7/10**（好於 18% 剧情片；人數未在快取中；1,504 條短評）— https://movie.douban.com/subject/36197206/ （read (Exa cache)）
- **英文影評**：Variety｜Aramide Tinubu｜2025-01-09｜"'American Primeval' Review: Taylor Kitsch Shines In Netflix Series" — https://variety.com/2025/tv/reviews/american-primeval-review-netflix-taylor-kitsch-1236267125/ （read (partial)）
  - 判語：極度暴力但引人入勝，描繪一個至今仍沒擺脫暴力傾向的國家。
  - 原句："a brutal, fascinating depiction of a culture and a country"
- **中文影評**：豆瓣影評「一集上头，Netflix新剧真生猛」（作者自稱「院长」）｜2025-01-20 — https://movie.douban.com/review/16438572/ （snippet）
  - 判語：尺度生猛、一集就上頭，偏推薦文。地區：中國。
- **分歧**：Metascore 58（評論最低之一）vs IMDb 8.0；豆瓣 7.7 居中。

## 12. This Is Us｜這就是我們（S1）

- **Metacritic S1**：**76**（34 reviews：28 正／6 中／0 負）；user 7.8 — https://www.metacritic.com/tv/this-is-us/season-1/ （read）
- **IMDb**：**8.7/10，178K** — https://www.imdb.com/title/tt5555260/ （read (chunks)）
- **豆瓣 S1**：**9.5/10，183,066 人評價**（「豆瓣9.0+電視劇排行榜」豆列摘要）— https://movie.douban.com/subject/26794215/ （snippet；Exa 403）
- **英文影評**：Slate｜Willa Paskin｜2016-09-19｜"NBC's This Is Us, reviewed."（副標 "NBC's new drama is emotional uplift at its most oppressive."）— https://slate.com/culture/2016/09/nbcs-this-is-us-reviewed.html （read (Exa search highlight)）
  - 判語：手藝高超但自以為是，把憤怒、悲傷都當成通往正能量的短暫中繼站。強烈負評。
  - 原句："emotional uplift at its most oppressive"
  - 對照：NYT 2016-09-19 "Review: 'This Is Us' Is Skillful, Shameless Tear-Jerking" https://www.nytimes.com/2016/09/20/arts/television/review-this-is-us-is-skillful-shameless-tear-jerking.html （read (Exa, partial)；署名未在快取中顯示）
- **中文影評**：豆瓣影評｜白羊先生｜2016-10-23｜「这部美剧鸡汤味浓重，我却看的无法自拔」— https://movie.douban.com/subject/26794215/reviews （snippet；讚數未讀到）
  - 地區：中國。
- **分歧**：最強烈的「評論 vs 觀眾」落差之一：Slate 痛批，豆瓣卻 9.5、18 萬人評分。

## 13. The Queen's Gambit｜后翼棄兵（miniseries）

- **Metacritic S1**：**79**（28 reviews：24 正／4 中／0 負）；user 8.5 — https://www.metacritic.com/tv/the-queens-gambit/season-1/ （read）
- **IMDb**：**8.5/10，684K** — https://www.imdb.com/title/tt10048342/ （read (chunks)）
- **豆瓣**：**約 9.0–9.2**（2020-11 影評內文提到「評分已經達到9.2分」「豆瓣評分高達9.0分」；**目前分數與人數未取得**）— https://movie.douban.com/subject/32579283/ （snippet；Exa 403）
- **英文影評**：The Hollywood Reporter｜Daniel Fienberg｜2020-10-20｜"'The Queen's Gambit': TV Review" — https://www.hollywoodreporter.com/tv/tv-reviews/the-queens-gambit-tv-review-4078272/ （read (partial)）
  - 判語：Anya Taylor-Joy 的眼神撐起整部劇，像《王冠》那樣聰明、製作精良、給大人看的電視。
  - 原句："Smart, well-produced TV for grownups, anchored by a fantastic Anya Taylor-Joy."（Bottom Line）
- **中文影評**：豆瓣影評｜楊時暘（中國影評人）｜「弃兵只能孤独向前」— https://m.douban.com/movie/subject/32579283/reviews （snippet；日期未讀到，77 有用）
  - 地區：中國。另：該頁最熱門影評為「我复原了女主下过的10盘棋」（12,222 有用，作者名未在摘要中）。
- **分歧**：大致一致；豆瓣小組有「看完覺得一般般」「爽劇」的異議。

## 14. Pose｜艷放80（S1）

- **Metacritic S1**：**75**（27 reviews：24 正／3 中／0 負）；user 7.9 — https://www.metacritic.com/tv/pose/season-1/ （read）
- **IMDb**：**8.6/10，37K** — https://www.imdb.com/title/tt7562112/ （read (chunks)）
- **豆瓣 S1**：**9.2/10，26,429 人評價** — https://m.douban.com/movie/subject/26997983 （snippet；人數見 wap 影評頁摘要）
- **英文影評**：IndieWire｜Ben Travers｜2018-06-03｜"'Pose' Review: Ryan Murphy's Enticing LGBTQ Series Earns Glamour and Glory for the House of FX" — https://www.indiewire.com/criticism/shows/pose-fx-review-ryan-murphy-trans-cast-tv-show-1201970601/ （read (partial)：標題＋副標）
  - 判語：核心故事出奇地傳統，但它把這份熟悉轉成優勢；跨性別演員陣容本身就具里程碑意義。
  - 原句："uses that familiarity to its advantage"（副標）
- **中文影評**：**未找到**（台灣媒體、豆瓣長評本輪沒搜到署名可用條目）。
- **分歧**：豆瓣 9.2 明顯高於 Metascore 75。

## 15. Dying for Sex｜死前慾望清單（miniseries）

- **Metacritic S1**：**83**（29 reviews：27 正／2 中／0 負，must-watch）；user **6.7** — https://www.metacritic.com/tv/dying-for-sex/season-1/ （read）
- **IMDb**：**7.6/10，14K** — https://www.imdb.com/title/tt30252752/ （read (chunks)）
- **豆瓣**：**8.1/10**（人數未取得；大陸譯名《死前欲望清单》）— https://m.douban.com/movie/subject/36666121 （snippet）
- **英文影評**：Los Angeles Times｜Mary McNamara｜2025-04-03｜"'Dying for Sex' review: This century's kinky, horny 'Love Story'" — https://www.latimes.com/entertainment-arts/tv/story/2025-04-03/dying-for-sex-fx-review （read (partial)）
  - 判語：Michelle Williams 的展示舞台，好笑、心碎又深具人性，可能是這個世紀的《愛的故事》。
  - 原句："Sex and death have never been such bittersweet bedmates."
- **中文影評**：豆瓣影評「五星推荐，美国的医疗太先进了」— https://m.douban.com/movie/review/16629616 （snippet；作者、讚數未讀到）
  - 地區：中國。台灣來源未找到正式劇評。
- **分歧**：Metascore 83 vs MC user 6.7、IMDb 7.6——評論明顯比觀眾熱。

## 16. Euphoria｜高校十八禁（S1 與 S3）

- **Metacritic S1**：**67**（27 reviews：15 正／11 中／1 負）；user 7.1 — https://www.metacritic.com/tv/euphoria/season-1/ （read）
- **Metacritic S3**：**57**（28 reviews：9 正／18 中／1 負）；user **4.8** — https://www.metacritic.com/tv/euphoria/season-3/ （read）
- **IMDb（series）**：**8.1/10，328K** — https://www.imdb.com/title/tt8772296/ （read (chunks)）
- **豆瓣**：S1 **8.1/10** — https://m.douban.com/movie/subject/30181462 （snippet）；S3 **6.2/10** — https://movie.douban.com/subject/35758798/ （分數 snippet；Exa 快取頁有讀到但無分數；人數皆未取得）。S2 7.9（snippet）。
- **英文影評 S1**：The Hollywood Reporter｜Tim Goodman｜2019-06-05｜"'Euphoria': TV Review" — https://www.hollywoodreporter.com/tv/tv-reviews/euphoria-review-1215681/ （read (partial)）
  - 判語：比主創名單看起來更厲害，Zendaya 是天啟般的表現；家長會被觸發，但很出色。
  - 原句："Triggering for parents — but excellent."（Bottom Line）
- **英文影評 S3**：Slate｜Nadira Goffe｜2026-04-10｜"One of HBO's Most Divisive Shows Is Finally Back. It's Completely Different." — https://slate.com/culture/2026/04/euphoria-season-3-zendaya-sydney-sweeney-alexa-demie-jacob-elordi.html （read (partial)）
  - 判語：時間跳躍後更黑暗、完全不同；MC 節錄說這季最貼近劇名的殘酷反諷（MC 給 80，偏正面）。
  - 原句："the divisive HBO hit is darker than ever"（副標）
- **中文影評**：關鍵評論網｜「餵電影」【串流推片單】｜2022-01（S2 開播前回顧 S1）— https://www.thenewslens.com/article/161070 （snippet）
  - 判語：剝去青春片的糖衣，焦慮迷茫與劇名「亢奮」互為表裡。地區：台灣。（片單短評，非完整劇評。）
- **分歧**：S3 明顯崩：Metascore 57、MC user 4.8、豆瓣 6.2（S1 8.1）；Slate 屬少數正面。

## 17. The White Lotus｜白蓮花大飯店（S1）

- **Metacritic S1**：**82**（39 reviews：39 正／0／0，must-watch）；user 7.5 — https://www.metacritic.com/tv/the-white-lotus/season-1/ （read）
- **IMDb**：**8.0/10，338K** — https://www.imdb.com/title/tt13406094/ （read (chunks)）
- **豆瓣 S1**：**8.0/10**（人數未取得）— https://m.douban.com/movie/subject/35506348 （snippet）；S2 8.4、S3 6.8（snippet）
- **英文影評**：The New Yorker｜Naomi Fry｜2021-07-21（雜誌 2021-08-02 期）｜"The Brilliant, Biting Social Satire of 'The White Lotus'" — https://www.newyorker.com/magazine/2021/08/02/the-brilliant-biting-social-satire-of-the-white-lotus （read (partial)）
  - 判語：幾近完美的悲喜劇，看社交禮貌的表層溶解後，種族、階級、性別的權力鬥爭如何浮上來。
  - 原句："a near-note-perfect tragicomedy"
- **中文影評**：關鍵評論網「【劇評】《白蓮花大飯店》第二季：從帝國主義到階級批判，我們為何仇富？」— 只在標籤頁看到，文章 URL 未取得：https://www.thenewslens.com/tag/289198 （snippet；**是 S2 不是 S1**）
  - 地區：台灣。S1 的中文劇評未找到。
- **分歧**：評論 100% 正面，但豆瓣 S1 只有 8.0，低於 S2。

## 18. Orange Is the New Black｜勁爆女子監獄（S1）

- **Metacritic S1**：**79**（32 reviews：28 正／3 中／1 負）；user 8.4 — https://www.metacritic.com/tv/orange-is-the-new-black/season-1/ （read）
- **IMDb**：**8.0/10，339K** — https://www.imdb.com/title/tt2372162/ （read (chunks)）
- **豆瓣 S1**：**8.5/10**（好於 88% 剧情片；人數未在快取中）— https://movie.douban.com/subject/20506276/ （read (Exa cache)）
- **英文影評**：The Hollywood Reporter｜Tim Goodman｜2013-07-01｜"Orange Is the New Black: TV Review" — https://www.hollywoodreporter.com/tv/tv-reviews/orange-is-new-black-tv-578162/ （read (partial)）
  - 判語：前提聽起來處處是紅旗，結果出乎意料地強，喜劇與正劇拿捏得宜，Schilling 表現出色。
  - 原句："expertly balances humor and drama"（Bottom Line）
- **中文影評**：豆瓣影評「[人物分析]监狱女子图鉴：底层疯狂，中产迷惘，上层冷漠」— https://m.douban.com/movie/review/9070346 （snippet；**掛在第五季條目下**，作者、讚數未讀到）
  - 地區：中國。S1 中文劇評未找到。
- **分歧**：大致一致。

## 19. Sirens｜妖惑心計（miniseries）

- **Metacritic S1**：**66**（33 reviews：19 正／14 中／0 負）；user 7.5 — https://www.metacritic.com/tv/sirens-2025/season-1/ （read；slug 是 `sirens-2025`）
- **IMDb**：**6.7/10，42K** — https://www.imdb.com/title/tt31429675/ （read (chunks)）
- **豆瓣**：**6.8/10，4,023 人評價**（大陸譯名同為《妖惑心计》）— https://m.douban.com/movie/subject/36783468 （snippet）
- **英文影評**：The Guardian｜Lucy Mangan｜2025-05-22｜"Sirens review – Julianne Moore's utterly addictive cult drama is preposterously fun" — https://www.theguardian.com/tv-and-radio/2025/may/22/sirens-review-julianne-moore-cult-drama-netflix （read (partial)）
  - 判語：《白蓮花》遇上妮可基嫚系列劇再加一點 Ryan Murphy 式 camp，荒謬但好看，靠姊妹關係撐住。
  - 原句："This endlessly entertaining study in class and family is a witty, star-packed treat"（副標）
- **中文影評**：豆瓣影評｜Ramona（Vera）｜2025-05-24｜4 星｜「还不错的一部女性群像剧！浅谈该剧的人物形象」— https://m.douban.com/movie/review/16734609/ （read (Exa search highlight)；讚數未讀到）
  - 判語：三位女主演技好，Meghann Fahy 最出彩；屬 Netflix 成熟的商業迷你劇。地區：中國。另一篇「这剧到底在骂男人还是骂女人？」（生就灿烂，2025-05-23）稱「算不上什麼高品質好劇，但可看性還是有」。
- **分歧**：各平台一致偏溫（MC 66、IMDb 6.7、豆瓣 6.8）；Guardian 100 分是明顯高點。

---

## 總表

| Show | Metacritic S1（reviews） | IMDb | 豆瓣 S1（人數） | EN 影評 | ZH 影評 |
|---|---|---|---|---|---|
| The Pitt | 78 (32) | 8.9 (179K) | 9.5 (75,801) | The Guardian | 豆瓣影評（snippet） |
| The Bear | 88 (24) | 8.5 (330K) | 8.4 (43,725) | Vulture | 關鍵評論網（TW） |
| Succession | 70 (29) | 8.8 (372K) | 8.4 (67,838 snippet) | The New Yorker | 關鍵評論網（TW） |
| The Morning Show | 61 (37) | 8.1 (153K) | 8.6 (45,286 snippet) | The Guardian | 關鍵評論網（TW，片單短評） |
| Landman | 60 (20) | 8.2 (120K) | 8.3 snippet (—) | Variety | 豆瓣影評頁（snippet） |
| Shōgun | 85 (41) | 8.6 (255K) | 7.8 snippet (—) | Slate | 豆瓣影評（snippet） |
| The Gilded Age | 68 (38) | 8.1 (56K) | 8.6 (—) | Variety | 豆瓣影評（snippet，偏解說） |
| Chernobyl | 82 (27) | 9.3 (1.1M) | 條目已不可存取（2019 摘要 9.6–9.7） | Los Angeles Times | 關鍵評論網（TW） |
| Band of Brothers | 86 (28) | 9.4 (612K) | 9.6 snippet (142,270) | The New York Times | — 缺 |
| Dopesick | 68 (25) | 8.6 (96K) | 9.3 snippet (—) | The New York Times | 豆瓣影評 weezer |
| American Primeval | 58 (29) | 8.0 (89K) | 7.7 (—) | Variety | 豆瓣影評（snippet） |
| This Is Us | 76 (34) | 8.7 (178K) | 9.5 snippet (183,066) | Slate | 豆瓣影評 白羊先生（snippet） |
| The Queen's Gambit | 79 (28) | 8.5 (684K) | ~9.0–9.2（2020 摘要；現值缺） | The Hollywood Reporter | 豆瓣影評 楊時暘（snippet） |
| Pose | 75 (27) | 8.6 (37K) | 9.2 snippet (26,429) | IndieWire | — 缺 |
| Dying for Sex | 83 (29) | 7.6 (14K) | 8.1 snippet (—) | Los Angeles Times | 豆瓣影評（snippet） |
| Euphoria | S1 67 (27)／S3 57 (28) | 8.1 (328K) | S1 8.1／S3 6.2 snippet | THR (S1)／Slate (S3) | 關鍵評論網（TW，片單短評） |
| The White Lotus | 82 (39) | 8.0 (338K) | 8.0 snippet (—) | The New Yorker | 關鍵評論網 S2 劇評（URL 缺） |
| Orange Is the New Black | 79 (32) | 8.0 (339K) | 8.5 (—) | The Hollywood Reporter | 豆瓣影評（S5 條目，snippet） |
| Sirens | 66 (33) | 6.7 (42K) | 6.8 snippet (4,023) | The Guardian | 豆瓣影評 Ramona |

英文媒體使用次數：The Guardian 3、Variety 3、Slate 3、The Hollywood Reporter 3、The New Yorker 2、Los Angeles Times 2、The New York Times 2、Vulture 1、IndieWire 1（都在 4 次以內）。

## 值得寫進文章的分歧

1. **評論低、觀眾高**：Landman（MC 60 vs IMDb 8.2／MC user 8.4／豆瓣 8.3）、Dopesick（MC 68、THR 負評 vs 豆瓣 9.3）、The Morning Show（MC 61 vs 豆瓣 8.6）、This Is Us（Slate 痛批 vs 豆瓣 9.5／18 萬人）、American Primeval（MC 58 vs IMDb 8.0）。
2. **評論高、觀眾冷**：Dying for Sex（MC 83 vs MC user 6.7、IMDb 7.6）、The Gilded Age 的 MC user 5.9（但豆瓣 8.6 反而高）。
3. **豆瓣明顯低於 IMDb**：Shōgun（7.8 vs 8.6；評論 85）、The White Lotus S1（8.0，且 S2 比 S1 高）。
4. **豆瓣高於 IMDb**：The Pitt（9.5 vs 8.9）、Pose（9.2 vs 8.6）、This Is Us（9.5 vs 8.7）。
5. **季間崩盤**：Euphoria S3（MC 57、user 4.8、豆瓣 6.2，S1 豆瓣 8.1）。
6. **單篇異議**：Guardian 給 The Pitt 40（全場最低）；Guardian 給 The Morning Show 和 Sirens 各 100（整體只有 61／66）。
7. **Chernobyl 的豆瓣條目自 2019-05 起不可存取**，只能引用當時的摘要數字。

## 缺口

- **豆瓣評分人數**：只取得 9/19（Pitt、Bear、Succession*、TMS*、BoB*、This Is Us*、Pose*、Sirens*；*= snippet）。缺：Landman、Shōgun、Gilded Age、Dopesick、AP、QG、DFS、Euphoria S1/S3、White Lotus、OITNB。
- **豆瓣分數屬 snippet 的**：Landman、Shōgun、BoB、Dopesick、This Is Us、QG（只有 2020 舊值）、Pose、DFS、Euphoria S1/S3、White Lotus、Sirens。Chernobyl 條目不可存取。
- **中文影評**：缺 Band of Brothers、Pose（0 條）。White Lotus 只有 S2 劇評且沒有文章 URL；OITNB 用的是 S5 條目長評；Gilded Age 那篇偏劇情解說。台灣來源只有 6 部（Bear、Succession、TMS、Chernobyl、Euphoria、White Lotus S2），其中 TMS 與 Euphoria 是片單式短評；放映週報、端傳媒、報導者、Openbook 本輪沒找到任何一部的劇評。多數豆瓣長評的作者名與讚數沒讀到（豆瓣擋抓取）。
- **英文影評署名**：BoB（Caryn James）與 Dopesick（Mike Hale）的署名來自旁證（Wikipedia／NYT 主題頁），原頁快取沒顯示署名。This Is Us 的 Slate 是 Exa 搜尋 highlight，不是 fetch。Telegraph、The Atlantic、BBC Culture 本輪都沒用上（前兩者擋抓取）。
- **IMDb 票數**是四捨五入的 K/M 顯示值。
