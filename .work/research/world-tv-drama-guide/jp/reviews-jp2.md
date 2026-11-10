# JP2 評價資料表：日劇｜懸疑、犯罪與動作 18 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-10。片單來自 `post-jp2-shows.txt`。IMDb／MDL／Video Research 收視／Netflix 觀看數沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、台灣 PTT／平台熱度沿用 `candidates-fans-taiwan.md`（三檔已標 read），這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（vivant、miu404、unnatural、criminal lawyer、don't call it mystery、your turn to kill、tokyo swindlers、gannibal、last man blind、go home、interrogation room、school lawyer、light of my lion、tokyo salad bowl、happy marriage、last samurai standing、alice in borderland、yu yu hakusho）；有頁面的再讀各季頁 | Groundlane `web_extract`（render=never，抓 `/tv/` 連結、`aria-label="Metascore …"`、`Based on N Critic Reviews`、`/publication/` 連結）＋ `web_fetch` | 18/18 read：**只有 3 部有頁面**（武士生死鬥 78、幽遊白書 70、今際之國三季都 tbd）。地面師、噬亡村都沒有頁面 |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；豆瓣 subject 頁沒有讀，沒有繞過 sec.douban.com | Exa search／fetch、Groundlane fetch | 5 部有媒體引述（法醫女王、99.9 第二季、地面師、武士生死鬥、今際之國 S1）；MIU404、今際之國只有「年度榜名次」；其餘沒有可用來源 |
| 英文評論 | 署名評論，讀全文或大半 | Exa `web_fetch_exa`、Groundlane `web_fetch`、jina `read_url` | 清單內媒體 read 5 部（RogerEbert、IndieWire、Decider×3，其中 Decider 三篇都只評首集）；清單外媒體 5 部（Asian Movie Pulse、MyDramaList News、The Blossom Review×2、Tokyo Prism 3CK）；VIVANT 只有 Japan Times partial（付費牆）；7 部沒有找到署名英文評論 |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、VERSE 等 | Groundlane `web_search`（domains 限定 agentm／stars.udn／mirrormedia／thenewslens／filmaholic／500times／japaholic／verse／gq.com.tw／elle.com）＋ `web_fetch` | 17 部有東西：13 篇有評論性（其中東京沙拉碗只評首集）、4 篇屬介紹／開箱／年度片單（地面師、女王偵訊室、校規、武士生死鬥）；99.9 沒有找到 |

標記說明：**read** = 工具讀到頁面內文；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段或一半，或只看到 Exa 搜尋結果裡的長摘要；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：Decider 3（地面師、噬亡村 S2、幽遊白書，三篇都是〈Stream It Or Skip It〉首集評論）；RogerEbert、IndieWire 各 1；Japan Times 1（VIVANT，partial）。**清單外**：Asian Movie Pulse（法醫女王）、MyDramaList News（MIU404，粉絲向新聞站）、The Blossom Review 2（勿說是推理、獅子的藏身處，小型 J／K-drama 評論站）、Tokyo Prism 3CK（東京沙拉碗，東京在地作者的部落格型網站）。
>
> **民放台劇幾乎沒有英文大媒體評論**：VIVANT、99.9、輪到你了、Last Man、GO HOME、女王偵訊室、校規、幸福的婚姻這 8 部，清單內媒體只找到 Japan Times（付費牆）或完全沒有，英文署名文章多是個人部落格（HamsapSukebe、Dorama World、eveningteamusings 等）或 MyDramaList 使用者評論，不收。Netflix／Disney+ 原創才有 Decider、Collider、THR、RogerEbert 這類固定評論。
>
> **Japan Times 付費牆**：Tokyo Swindlers（James Hadfield，2024-07-25）、VIVANT S1 回顧（Gabriella Geisinger，2026-07-25）、Last Samurai Standing（Patrick St. Michel，2025-11-21）三篇，Groundlane、Exa、jina 都只拿到前兩段與副標，只能當 partial。
>
> 台灣中文評論：**集中度很高**——聯合報〈娛樂有評〉與電影神搜共 17 篇裡，有 12 篇出自同一位作者「雪奈」（電影神搜署名「雪奈日劇部屋」，臉書粉專經營者，作者自介寫「沒有一針見血的犀利評論」），立場普遍溫和、偏推；評論性較強的是潘光中（今際之國 S1、幽遊白書，專業編劇）、電影神搜「重點就在括號裡」（MIU404）、娛樂有評「卡爬」（法醫女王）。關鍵評論網、釀電影、500輯有相關文章但這次只看到 snippet，沒有讀。17 篇都沒有「合作／贊助」標記；GQ／ELLE／marie claire 台灣版的文章都是介紹或盤點，不算評論。

---

## 1. VIVANT（TBS 日曜劇場，2023；S2 2026）

1. **Metacritic**：沒有頁面（站內搜尋「vivant」沒有任何 TV 結果，read）。
2. **豆瓣**：沒有找到媒體引述的分數。什麼值得買社群文（2026-10-27）寫「豆瓣基本持平」，用戶文，不採用（snippet）。
3. **英文評論**：The Japan Times，Gabriella Geisinger，2026-07-25，〈The bittersweet nostalgia of the first season of 'Vivant'〉。https://www.japantimes.co.jp/culture/2026/07/25/tv-streaming/vivant-season-one-recap/ （**partial**：付費牆，Groundlane、Exa 都只拿到前兩段與副標；第二季開播時回顧第一季，含劇透）
   - 可讀到的部分只有劇情介紹與副標，副標的立場是「第一季描繪的寬容日本，和今天的現實愈來愈不合」，屬保留；正文論點沒讀到，**不能當完整評論用**。
   - 副標原文：「Taking place in a version of Japan that espouses tolerance and acceptance, the espionage drama's first season feels increasingly at odds with today's reality.」
   - 清單內其他媒體（Decider、NME、Guardian 等）沒有找到；英文只有個人部落格與 MDL 使用者評論（後者有人批評結局「long moralizing and nationalistic speeches」，用戶文，snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2023-09-21，〈堺雅人主演《VIVANT》：話題熱度、娛樂性、收視率全都達成！〉。https://stars.udn.com/star/story/10093/7452917 （read；完結後評全季）
   - 摘要：她說第一集人物多、資訊量大、大量蒙古語「令人頭昏腦脹」，中段回到日本後最好看；後半把恐怖組織 TENT 揭露成用犯罪所得養孤兒的慈善機構，是「為了反轉而反轉」，結尾很多不合理之處，但演員撐得住。結論仍肯定 TBS 燒錢突破日劇框架。立場：推，但保留結局。
   - 原文：「徹底把TENT洗白的情節發展，為了反轉而反轉，加上不斷的親情攻勢，究竟好不好看，那就見仁見智了。」
5. **分歧**：**收視與獎項極高、國際影評幾乎缺席、續集變成外交爭議**。第一季最終回關東總合 29.8%、2023 年平均收視 #1 14.3%、TVer 特別賞（ratings 檔）；東京ドラマアウォード 2024 グランプリ、民放連賞優秀（awards 檔）；但 IMDb 前 100、MDL 前 60 都沒有它（ratings 檔）。台灣 DailyView 2026-10 月聲量 #2，負評 56%（fans 檔）。第二季 2026-07 首播 18.8%（上報 2026-07-28，snippet），劇中以真實國名「中國」的秘密情報組織為反派，遭央視、環球時報批評，TBS 社長 10-28 記者會說「無意敵視或貶低任何特定國家」，最終回加上免責字幕（共同社中文版 2026-10-29，https://china.kyodonews.net/articles/-/17585 ，partial：Exa 摘要；有線新聞 2026-11-09，snippet）。台灣評論與 Japan Times 副標都對「民族主義／洗白」敘事有保留，日本國內收視則一路走高。

## 2. MIU404（TBS 金曜ドラマ，2020）

1. **Metacritic**：沒有頁面（站內搜尋「miu404」只有 Code 404，read）。
2. **豆瓣**：沒有找到媒體引述的分數。數英網 2020-12-21 轉述豆瓣 2020 年度榜「評分最高日本劇集」，《機動搜查隊404》排第 6（只有名次、沒有分數，https://www.digitaling.com/articles/385623.html ，partial：Exa 摘要）。豆瓣用戶長評說播出中曾低到 7.6、後回升到 8.5（用戶文，不採用）。
3. **英文評論**：MyDramaList News，Orangevine，2020-09-14（2026-04-02 更新），〈Currently Watching: Buddy Cop J-Drama MIU404〉。https://news.mydramalist.com/article/currently-watching-buddy-cop-j-drama-miu404-011015463 （read (Exa)，讀到約八成；**寫於播到第 9 集時**）。**注意**：MyDramaList News 是亞洲劇資料庫的粉絲向新聞欄，不在原清單。清單內媒體沒有找到署名評論。
   - 摘要：她列出四個理由：《法醫女王》原班女性主創（野木亞紀子、塚原亞由子、新井順子）、把老派 buddy cop 類型翻新（主角是只管案發後 24 小時的機動搜查隊、女隊長面對職場歧視）、把罪犯寫成「走錯分岔路的人」、綾野剛與星野源的演技。立場：推。
   - 原文：「MIU404 is constructed as masterfully as Unnatural but hides that behind tons of fun stuff.」
4. **中文評論（台灣）**：電影神搜，重點就在括號裡（筆名），2020-09-16，〈寫在《MIU404》最終話之後：我們與惡的距離，究竟到底有多遠？〉。https://news.agentm.tw/132620/ （read；完結後評全季）
   - 摘要：他認為第 8 集是全劇核心，《MIU404》與《法醫女王》主題一致：野木亞紀子把主角放在「想帥卻熱血不起來的職位」，一集一個社會問題（教育、外籍勞工），問的是「我們要怎麼接住社會裡的弱勢」。他也點出疫情把 14 集砍成 11 集造成的瑕疵：最終回刑警脫困太草率、反派久住靠網路輿論逃脫鋪陳不足。立場：推，但指出結尾瑕疵。
   - 原文：「擁有瑕疵的《MIU404》確實以誠實的態勢，拍出日本國家的問題」
5. **分歧**：大致一致，**開播平淡、後勁強**。MDL #22 8.5、最終回關東總合 24.8%（ratings 檔）；ザテレビジョンドラマアカデミー賞最優秀、東京ドラマアウォード 2021 優秀（awards 檔）；KKTV 2020 年度日劇賞 6 項（鏡週刊 2021-01-21，snippet）。電影神搜另一篇（2025-01-12 頁面日期）寫「從略顯平淡的第一集」到後段爆點（snippet），與豆瓣用戶說首播評分偏低一致。英文媒體幾乎沒評。

## 3. アンナチュラル Unnatural 法醫女王（TBS 金曜ドラマ，2018）

1. **Metacritic**：沒有頁面（站內搜尋「unnatural」只有 Unnatural History，read）。
2. **豆瓣**：**9.3**（178,528 人），新浪娛樂，2018-12-25，〈內地最喜愛日劇排名 石原里美《非自然死亡》奪冠〉（轉述香港媒體報導的豆瓣 2018 年度評分最高十大日劇）。https://ent.sina.cn/tv/tv/2018-12-25/detail-ihqhqcis0153022.d.html （partial：Exa 摘要含榜單全文）。其他引述：中國青年報（中新網轉載）2018-03-27 寫「豆瓣評分高達9.2」（https://www.chinanews.com.cn/m/yl/2018/03-27/8476908.shtml ，partial）；南方周末 2020-08-03 寫 9.4、「近十年來評分最高的日劇」（https://www.infzm.com/contents/189021 ，partial）。三個數字是不同時間點的快照。
3. **英文評論**：Asian Movie Pulse，Adriana Rosati，2025-07-02，〈Series Review: Unnatural (2018) by Ayuko Tsukahara〉。https://asianmoviepulse.com/2025/07/series-review-unnatural-2018-by-ayuko-tsukahara/ （read (Exa)；評全劇，Netflix 上架後的回顧評論）。**注意**：Asian Movie Pulse 是亞洲電影評論網站，不在原清單。清單內媒體沒有找到署名評論。
   - 摘要：她說這部被稱為「日本版 CSI」，原創性不算突出，但兩個選擇讓它高出同類：先以單元劇起步、再不知不覺拉進主線懸疑；角色之間的互動真實、有人性。另外點名劇中對霸凌、過勞、性別偏見（女法醫出庭作證被輕視）的批判，以及日本遺體多半火化帶來的時間壓力。立場：推。
   - 原文：「although it doesn't shine for originality, a few clever choices earn it some extra credit and elevate it above many of its peers」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），卡爬，2020-03-24，〈新冠病毒映射出的灰暗人心 《法醫女王》寫下的警世寓言〉。https://stars.udn.com/star/story/10093/4432994 （read；**議題評論**，聚焦第 1 集 MERS 案）
   - 摘要：她說日本醫療劇很少碰流行病學，野木亞紀子卻用「無名之毒」開場：死者先被當成帶原者遭媒體與網友獵巫，最後揭露是院內感染受害者。她把這段對照 2020 年新冠疫情下台灣與日本的網路出征，說瘟疫像照妖鏡。立場：推。
   - 原文：「瘟疫其實就像一面照妖鏡，映射出人類最原始的劣根性」
5. **分歧**：**評審、豆瓣、國際粉絲一致高分，收視只算中上**。IMDb 8.1（3K）、MDL #8 8.5（5,968）（ratings 檔）；ザテレビジョン最優秀、東京ドラマアウォード優秀、ギャラクシー賞優秀（awards 檔）；豆瓣 9.2–9.4。但平均收視 11.06%「在冬季檔屬中上」，話題度遠超收視冠亞軍（中國青年報，partial）。新京報（新浪 2018-02-09，partial）提到第 3 集處理職場性別歧視，收視是當時全劇最低，但引發年輕女性共鳴。

## 4. 99.9-刑事専門弁護士- 99.9 刑事專門律師（TBS 日曜劇場，2016；S2 2018）

1. **Metacritic**：沒有頁面（站內搜尋「criminal lawyer」只有 The Lincoln Lawyer 等，read）。
2. **豆瓣**：第一季沒有找到。**第二季 8.4**（12,552 人），新浪娛樂 2018-12-25 同上榜單，列為《0.1無罪真相2》第 4 名（partial）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「99.9 Criminal Lawyer Matsumoto Jun drama review」，只找到 MyDramaList 使用者評論、Dramas with a Side of Kimchi 與 Ritsu no Dorama Land 部落格（snippet，不收）。
4. **中文評論（台灣）**：**沒有找到**。搜尋過：Groundlane 站內限定 agentm、stars.udn、mirrormedia、thenewslens、filmaholic、500times、japaholic、verse、GQ、ELLE（「99.9 刑事專門律師 松本潤 日劇 評論」）。只找到鏡週刊電影版新聞（2021-12、2022-05）、GQ 電影版介紹、娛樂有評談松本潤演大河劇的人物文（雪奈，2023-05-30，snippet，非本劇評論）。
5. **分歧**：**收視高、評論界幾乎沒寫**。第二季 2018 年平均收視 #1 17.4%（ratings 檔；鏡週刊 2021-12-23 snippet 寫兩季平均都超過 17%）；MDL S2 #46 8.3（ratings 檔）；ザテレビジョンドラマアカデミー賞最優秀 2016 春（awards 檔）。MDL 使用者評論反覆提到冷笑話與誇張喜劇「too much」（snippet），是國際觀眾的主要門檻。

## 5. ミステリと言う勿れ 勿說是推理（フジテレビ 月9，2022）

1. **Metacritic**：沒有頁面（站內搜尋「don't call it mystery」沒有相關結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Blossom Review，Karen Mansoldo，2024-05-08，〈Don't Call It Mystery Review: The Enigma of Who We Are〉。https://theblossomreview.com/dont-call-it-mystery-viki-j-drama-review/ （**partial (Exa)**：讀到約前三分之一，「The Main Difference Between Totonou and Other Sherlock Holmes-esque Characters」一節開頭後截斷；評全劇，Viki 上架後）。**注意**：The Blossom Review 是小型 J／K-drama 評論站，不在原清單。清單內媒體沒有找到署名評論。
   - 摘要：她把主角久能整看成「不想當福爾摩斯的福爾摩斯」，比前輩更有人性：像孩子一樣直言社會的荒謬與偽善，又不能用玫瑰色眼鏡看世界；也稱讚導演把漫畫的剪影式思考畫面轉成動畫段落。立場：推。
   - 原文：「we do have a pearl of a live-action adaptation」
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2022-03-31，〈【劇評】《勿說是推理》完結：跳脫日劇傳統框架，用「對話」堆疊出精彩內容，成功的漫改作品！〉。https://news.agentm.tw/216506/ （read，結尾總結段截斷；評全劇）
   - 摘要：她說本劇靠對話堆疊，主角是「金句製造機」，大膽採用跨集銜接、擺脫單元劇框架；引用菅田將暉說這是他台詞量最多的角色，以及作者田村由美關心的兒童虐待、親權、霸凌等議題。立場：推。
   - 原文：「我認為這是一部「療癒為主、推理為輔」的懸疑劇，沒有故弄玄虛，也沒有驚人反轉，多的是人性的剖析。」
5. **分歧**：**收視、串流、評審都高；推理本身與結局有爭議**。令和以來總合收視 #12 25.8%（時移 #2）、TVer 特別賞與 2025 名作ドラマ賞、MDL #19 8.5（ratings 檔）；東京ドラマアウォード優秀、民放連優秀、AACA 日本最佳劇集（awards 檔）。關鍵評論網〈《勿說是推理》：推理劇滲出倫理學、心理學與哲學〉摘要寫「推理部分的確較弱，有不少跳躍思維」（https://www.thenewslens.com/article/164687 ，snippet）；鏡週刊 2022-04-01 報導最終兩集主角幾乎不出場，網友稱「勿說是完結篇」（snippet）。MDL 使用者也說推理靠偽科學、過於跳躍（snippet）。

## 6. あなたの番です 輪到你了（日本テレビ，2019，兩部共 20 集）

1. **Metacritic**：沒有頁面（站內搜尋「your turn to kill」沒有相關結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「"Your Turn to Kill" Anata no Ban Desu Japanese drama review」，只找到個人部落格（eveningteamusings、Aoyama Coffee、That Japanese Drama Guy、Medium）與 MDL 使用者評論（snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2019-09-09，〈秋元康的勝利！《輪到你了》夯爆看點 驚悚、戀愛都令人悸動〉。https://stars.udn.com/star/story/10093/4037676 （read；完結後評全劇）
   - 摘要：她說臉書日劇社團一半的發文都在推理這部，網友的分析比劇情本身更精彩；把推理劇拆成兩季、第一部結尾殺掉女主角很大膽，是秋元康企劃的勝利。但她直說最終犯人沒有懸念、是為了力捧西野七瀨，結局漏洞百出、虎頭蛇尾。立場：保留（肯定話題操作，不肯定劇本）。
   - 原文：「儘管這樣的結局根本沒有懸念，而且漏洞百出、劇情鬆散，故弄玄虛但虎頭蛇尾」
5. **分歧**：**收視與話題爆表、結局被批爛尾**。反撃編最終回關東總合 25.0%、即時 19.4%，Yahoo!検索大賞 2019 ドラマ部門（ratings 檔）；東京ドラマアウォード 2020 優秀（awards 檔）。首播只有 8.3%（Aoyama Coffee 部落格，snippet），最終回 19.4%（娛樂有評同文）。日本與台灣都是「看考察、討論」大於「看劇本」的作品，英文圈幾乎只在部落格流傳。

## 7. 地面師たち Tokyo Swindlers 地面師（Netflix，2024）

1. **Metacritic**：沒有頁面（站內搜尋「tokyo swindlers」只有 Tokyo Vice 等，read）。
2. **豆瓣**：**7.2**（人數不明；截至 2026-10-07），風傳媒〈風生活〉，魏甫丞，2026-10-08，〈《地面師》《宛如阿修羅》都不是第一！近3年Netflix最強日劇TOP10冠軍是它〉。https://www.storm.mg/lifestyle/11170472 （read (Exa)；排 2024–2026 年 Netflix 日本真人劇第 4）。搜狐自媒體 2025-02-21 同樣寫 7.2（snippet，不採用）。
3. **英文評論**：Decider，Joel Keller，2024-07-29，〈Stream It Or Skip It: 'Tokyo Swindlers' On Netflix, A Different Kind of Heist Series〉。https://decider.com/2024/07/29/tokyo-swindlers-netflix-review/ （read (Exa)；**只評第 1 集**）
   - 摘要：他把本劇看成「規模像《紙房子》的搶案劇」，特別之處是首領哈里森山中做詐騙是為了刺激而非錢；第一場詐騙示範團隊多專業，也鋪好後面百億日圓的大案；但他覺得哈里森的伎倆「被剪接弄得比實際更戲劇化」。結論 STREAM IT。
   - 原文：「Tokyo Swindlers is basically a heist show, but it's a heist show that has set up a pretty interesting heist with an interesting team of con artists trying to make the big score.」
   - 另有 The Japan Times，James Hadfield，2024-07-25，〈Netflix's 'Tokyo Swindlers' is this summer's guiltiest pleasure〉（https://www.japantimes.co.jp/culture/2024/07/25/tv-streaming/tokyo-swindlers/ ，partial：付費牆，Groundlane、Exa、jina 都只拿到前兩段；副標寫「a ridiculous treat to watch」）。
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2024-07-26，〈【日劇開箱】Netflix《地面師》: 主角是不動產詐欺師！貪婪與慾望交織的寫實犯罪故事〉。https://news.agentm.tw/296680/ （read，後段導演介紹截斷；**上線隔天的開箱文，以劇情、名詞與導演大根仁介紹為主，屬介紹型，不是完整劇評**）
   - 摘要：她解釋什麼是「地面師」、整理角色與劇情，說本劇不是《信用詐欺師JP》那種歡樂喜劇，而是寫實的犯罪故事，並把成功歸功於大根仁。立場：推（但幾乎沒有批評）。
   - 原文：「《地面師》並不是像《信用詐欺師 JP》那種歡樂喜劇，而是以寫實畫面刻劃出緊張刺激的犯罪故事，光看一集就被深深吸引，恨不得一口氣追完。」
   - 同作者在〈娛樂有評〉2024-08-10 的〈《地面師》瞞天過海挑戰史上最高金額詐騙！盤點日劇中的詐欺師〉是盤點文（https://stars.udn.com/star/story/10093/8145974 ，read，非評論）；GQ Taiwan〈6 大觀影前必讀要點〉是介紹文（snippet）；關鍵評論網 https://www.thenewslens.com/article/206398 只看到摘要（snippet）。清單內沒有找到完結後的署名劇評。
5. **分歧**：**日本與台灣串流爆紅，豆瓣中等、西方大媒體評論少**。Netflix 2024 下半年 12M views、Filmarks Awards 2024 配信ドラマ部門最優秀（ratings 檔）；Real Sound 2024 麦倉正樹年度第 1（awards 檔）；Netflix 台灣週榜累計 6 週，是抽樣中最久的日劇（fans 檔）；マイナビニュース 2026-02 會員調查「最好看的 Netflix 日本原創劇」第 1（https://news.mynavi.jp/article/20260309-4155274/ ，snippet）。但豆瓣只有 7.2，風傳媒同文說「後半段不是人人滿意，也有人嫌收得粗糙」；英國 Japan Society 的原著書評順帶說劇版是「an average TV adaptation」（snippet，非劇評）。Metacritic 連頁面都沒有。

## 8. ガンニバル Gannibal 噬亡村（Disney+，S1 2022–23、S2 2025）

1. **Metacritic**：沒有頁面（站內搜尋「gannibal」沒有任何 TV 結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：Decider，Johnny Loftus，2025-03-31，〈Stream It Or Skip It: 'Gannibal' Season 2 on Hulu, The Continuation Of This Dark (And Hangry) Japanese Horror Series〉。https://decider.com/2025/03/31/gannibal-season-2-hulu-review/ （read (Exa)；**只評第二季首集**；第一季沒有找到清單內媒體評論）
   - 摘要：他說劇裡的邪教與活人獻祭設定很吸引人，柳樂優彌、笠松將都好，但大量換視角的閃回讓人迷失，第一季結尾的懸念也因此令人挫折；期待第二季能解開謎團。結論 Stream It（「For the unease!」）。
   - 原文：「Cult stuff: we usually love it. And Gannibal's version is intriguing. But the fact is that the formatting of its story is extremely trying.」
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2023-02-02，〈【劇評】《噬亡村》: 這部 Disney+ 驚悚懸疑線上日劇，帶領觀眾陷入深不見底的血腥與瘋狂！〉。https://news.agentm.tw/247405/ （read，讀到約七成；**第一季完結劇評**）
   - 摘要：她把本劇列為 2023 年度必看，稱讚柳樂優彌的「怪演」、第 3 集隧道飛車追逐媲美好萊塢，以及後藤家內鬥、村民監控、主角內心糾結三條線並行的多線敘事。立場：推。
   - 原文：「本劇結合懸疑推理、暴力美學，以及獨特敘事手法，增添故事的深度和內涵，緊張刺激的氣氛掌握得很好，速度感更是絕佳」
   - 第二季另有電影神搜〈更為殘虐的尺度只是佐料，人性黑暗才是這場食人宴的主菜〉（2025-03-20，https://news.agentm.tw/330587/ ，snippet）與釀電影〈第二季完結心得〉（2025-04-25，snippet），未讀。
5. **分歧**：**日本是 Disney+ 最大真人劇，西方影評幾乎沒有**。IMDb 7.4（3.2K）、MDL #55 8.3、Filmarks 2023 日本ドラマ #4、Parrot 2025 漫改真人需求第 2（ratings 檔）；MDL 使用者 2025 清單 #1（fans 檔）。The Hollywood Reporter 2025-04-15 報導第二季成為日本 Disney+ 史上最多觀看、9 天破百萬小時（snippet）；但 Rotten Tomatoes 頁面顯示 0 篇評論（snippet），/Film 2026-11-08 也寫「There are no "top critic" reviews for the series on Rotten Tomatoes」（snippet）。Decider 嫌敘事結構難跟，台灣評論反而稱讚多線敘事。

## 9. ラストマン－全盲の捜査官－ Last Man -全盲搜查官-（TBS 日曜劇場，2023）

1. **Metacritic**：沒有頁面（站內搜尋「last man blind」只有 The Last Man on Earth 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「"Last Man" blind FBI agent Fukuyama Masaharu Japanese drama review 2023」，只找到部落格（Dorama World 首集心得、HamsapSukebe 首集心得）、TBS 片目錄與 MANTANWEB（日本媒體英文版，2025-12 特別篇介紹，非評論）（snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2023-06-30，〈痛快刑偵劇《Last Man -全盲搜查官-》：最佳搭檔福山雅治、大泉洋火花四射〉。https://stars.udn.com/star/story/10093/7266903 （read；完結後評全劇）
   - 摘要：她說最大賣點是兩人互動：劇本其實沒有太多喜劇元素，化學反應來自共演時的即興；製作人想傳達「殘障不是缺陷而是特色」；最後兩集好好收回 41 年前案件的伏筆，津田健次郎的父親角色是最後亮點。立場：推。
   - 原文：「福山雅治負責耍帥，大泉洋就認真吐槽，一搭一唱、默契十足，根本是在表演雙口相聲」
5. **分歧**：**收視高、獎項與英文評論都缺席**。2023 年民放單集總合 #2 24.2%、年平均 #3 12.9%、Filmarks 2023 #14（ratings 檔）；awards 檔沒有任何獎項或影評年度榜。台灣 PTT 2023 回顧 #3、KKTV 2023 熱播 #3（fans 檔）。英文部落格把主角形容成無所不能的超級英雄（HamsapSukebe，snippet），全盲辦案的寫實度在英文圈有疑問，台灣評論則當成優點看。

## 10. GO HOME〜警視庁身元不明人相談室〜（日本テレビ，2024）

1. **Metacritic**：沒有頁面（站內搜尋「go home」只有 Homeland 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「"Go Home" Koike Eiko Ohshima Yuko unidentified bodies drama review 2024」，只找到 MDL 使用者評論、ZDORAMA AGAIN 部落格與 DramaWiki（snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2024-10-05，〈小芝風花主演《GO HOME～帶往生者回家～》：缺乏推理元素但催淚效果十足〉。https://stars.udn.com/star/story/10093/8260788 （read；完結後評全劇）
   - 摘要：她說這部取材真實部門，一集一具無名遺體，幾乎每集都催淚；但故事平淡、沒有驚人反轉，不適合喜歡刺激推理的觀眾；最期待的兩位女主角創傷主線「最後有點草草收尾」，反而不如每集支線感人。立場：保留偏推（當暖心小品看）。
   - 原文：「本來最期待的主線劇情（小櫻和小真的創傷以及她們想要找的人），最後有點草草收尾，反而沒有每一集的支線那麼感人」
5. **分歧**：差距小，屬「小品」。2024 民放單集總合 #17 14.4%（ratings 檔；DramaWiki 寫平均 5.9%，snippet，兩者口徑不同：前者是單集總合含時移，後者是即時平均）；沒有獎項或影評年度榜（awards 檔）。台灣 KKTV 2024 熱播 #10、PTT 2024 回顧列為遺珠（fans 檔）。MDL 使用者評論給 9 分以上、稱「Top drama of 2024 for me」（snippet），與台灣評論說主線收得草率略有落差。

## 11. 緊急取調室 女王偵訊室（テレビ朝日，2014–2025 共五季＋2026 電影版）

1. **Metacritic**：沒有頁面（站內搜尋「interrogation room」只有 Interrogation 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。Exa 與 Groundlane 搜尋都沒有英文署名評論或部落格以外的文章。
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2023-12-14，〈【經典回顧】天海祐希代表作日劇《女王偵訊室》系列：就是要讓犯人無所遁形！〉。https://news.agentm.tw/269869/ （read，讀到約七成；**系列介紹型文章，以劇情設定、電影版延期風波和幕後趣聞為主，不是第四季評論**）
   - 摘要：她介紹天海祐希的真壁有希子以心理戰偵訊嫌犯，每集犯人都是知名演員；也記錄電影版因市川猿之助被捕延期、特別篇因永山絢斗被捕延期。屬介紹，評價性內容少。
   - 原文：「《女王偵訊室》表面上是辦案的刑偵劇，實際上卻在探討層出不窮的社會問題以及人性的黑暗面。」
5. **分歧**：**長壽收視劇，評審只給第四季一次肯定**。第四季東京ドラマアウォード 2022 優秀（awards 檔）；第五季 2025 民放單集總合 #7 16.5%、ORICON 2025 年間滿意度 #8（3.45）（ratings 檔）。台灣有 friDay 跟播與 2026 電影版上映新聞（鏡週刊 2026-03-04、噓！星聞 2026-03-05，snippet）。中英文都沒有像樣的單季評論，這部適合用收視與獎項描述，不適合引評論。

## 12. 僕達はまだその星の校則を知らない 我們還不懂那顆星球的校規（関西テレビ／フジテレビ，2025）

1. **Metacritic**：沒有頁面（站內搜尋「school lawyer」只有 The Lincoln Lawyer 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「"Boku-tachi wa Mada Sono Hoshi no Kosoku wo Shiranai" OR "School Lawyer" Isomura Hayato drama review」，只找到 MANTANWEB 英文版欄目（2025-08-11，未署名個人作者，snippet）、note.com 心理師個人文章（英譯頁）與 MDL 法文使用者評論（不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2025-07-19，〈磯村勇斗主演《我們還不懂那顆星球的校規》：用法律知識解決校園問題〉。https://stars.udn.com/star/story/10093/8876226 （read；**開播第一週的介紹文**，以劇情、角色、演員經歷為主，只涵蓋第 1 集）
   - 摘要：介紹主角是有獨特感官、曾經拒學的駐校律師，第一個難題是男女校合併後的「性別友善制服」，並提到宮澤賢治的世界觀。評價性內容只有結尾一句。立場：推（介紹型）。
   - 原文：「相信《我們還不懂那顆星球的校規》可以成為這個夏季最動人的日劇。」
5. **分歧**：**日本影評與台灣 PTT 重度劇迷很愛，大眾面不明**。ザテレビジョンドラマアカデミー賞最優秀 2025 夏、Real Sound 2025 兩位影評年度榜（藤原奈緒 #3、明日菜子 #1）、映画チャンネル兩位寫手前五（awards 檔）；PTT 2025 回顧 #4、MDL 使用者 2025 清單 #2（fans 檔）。ratings 檔沒有收視數字。CREA 2025-09-22 文說「その一筋縄ではいかない作風ゆえに、もしかしたら途中で視聴をやめてしまった人もいるかもしれません」（https://crea.bunshun.jp/articles/-/55521 ，snippet），暗示風格門檻高。

## 13. ライオンの隠れ家 Light of My Lion 獅子的藏身處（TBS 金曜ドラマ，2024）

1. **Metacritic**：沒有頁面（站內搜尋「light of my lion」沒有相關結果，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Blossom Review，Karen Mansoldo，2025-01-01，〈Light of My Lion Review: TBS's Latest Drama Is A Roaring Success〉。https://theblossomreview.com/light-of-my-lion-netflix-review/ （**partial (Exa)**：讀到約三分之二，「Light of My Lion & The Miraculous Power of a Child」一節中段截斷；結論段只在 Exa 搜尋摘要看到；評全劇）。**注意**：清單外小型評論站。清單內媒體沒有找到署名評論；Common Sense Media（Joly Herman）有家長向短評（snippet）。
   - 摘要：她說本劇選擇當家庭劇而不是驚悚劇，懸疑線只是推動成長的工具；自閉症弟弟美路人不是常見的「天才」或「冷漠」刻板形象，有自己的夢想與情緒，坂東龍汰的表演「awe-inspiring」；照顧者哥哥洸人的掙扎也寫得誠實。立場：推。
   - 原文：「But the real star of the season and the entire year was TBS's heartfelt Light of My Lion」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2024-12-28，〈《獅子的藏身處》：散發苦澀氣息的治癒系家庭劇，迎來精彩大結局！〉。https://stars.udn.com/star/story/10093/8443474 （read，結尾截斷；完結後評全劇）
   - 摘要：她把本劇列為個人 2024 秋季最愛，說前半懸疑、後半深入人性；柳樂優彌內斂、坂東龍汰「連手指都在演戲」；多拍一集讓故事從救出獅子轉到兄弟各自為自己而活。立場：推。
   - 原文：「本劇最引人入勝之處，在於順利把溫馨療癒和沉重壓抑這兩種氛圍，掌握得恰到好處」
5. **分歧**：大致一致，**口碑高於收視**。MDL #15 8.5（3,211）、最終回總合 15.4%（ratings 檔）；民放連賞 2025 優秀、Real Sound 2024 田幸和歌子 #2、Japan Times 2024 年度文提及（awards 檔）；PTT 2024 回顧 #5、KKTV 2024 最佳男配角坂東龍汰（fans 檔）。中英評論都把自閉症角色的呈現當優點，這點與韓劇《非常律師禹英禑》的再現爭議相反，未見反方評論（只搜到這兩篇）。

## 14. 東京サラダボウル Tokyo Salad Bowl 東京沙拉碗（NHK，2025）

1. **Metacritic**：沒有頁面（站內搜尋「tokyo salad bowl」只有 Tokyo Vice 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：Tokyo Prism 3CK，Olivier Fabre，2025-08-01，〈Tokyo Salad Bowl – Food for Thought, Queerbait Crumbs or Just Patronizing?〉。https://tokyoprism3ck.com/2025/08/tokyo-salad-bowl-food-for-thought-queerbait-crumbs-or-just-patronizing-2/ （read (Exa)，結尾幾句截斷；評全劇）。**注意**：Tokyo Prism 3CK 是在東京的外國作者經營的部落格型網站，不在原清單；作者自承是酷兒觀眾，文中提到與劇組顧問相識。清單內媒體沒有找到署名評論；Midgard Times（Anjali Sharma，2026-06-21）有正面評論但網址是轉載站（moviesr.net），未採用（snippet）。
   - 摘要：他說本劇對外國居民的描寫「戴著手套」：外國人幾乎都是等日本好警察拯救的受害者，種族歧視被直白解釋；男主角已故男友只當背景，看不到親密，是「See? We included queerness. Now let's move on.」式的再現；最有意思的是警察通譯這個少見職業，但對日本「人質司法」只輕輕帶過。立場：保留偏不推。
   - 原文：「it plays like something served with plastic gloves – sanitized, cautious, and slightly over-rehearsed」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2025-01-11，〈《東京沙拉碗》：「萵苣頭」奈緒 X「厭世臉」松田龍平攜手挑戰國際案件！〉。https://stars.udn.com/star/story/10093/8478556 （read；**只評第 1 集**）
   - 摘要：她介紹第一集中國留學生失蹤案，稱讚奈緒、松田龍平與異國料理元素，但也說以日本人角度看在日外國人犯罪，難免有刻板印象。立場：推，帶保留。
   - 原文：「因為是以日本人角度來看在日的外國人犯罪，難免會出現一些刻板印象或者刻意醜化，我在觀賞的時候心情會感到比較複雜。」
5. **分歧**：**日本評審肯定、外國人與酷兒觀點有批評**。東京ドラマアウォード 2025 優秀、Real Sound 2025 田幸和歌子 #2、映画チャンネル苫とり子前五（awards 檔）；Filmarks Awards 2025 入圍（ratings 檔）；PTT 2025 推薦與回顧遺珠（fans 檔）；MDL 7.9（584 人，snippet），使用者評論 9.5 分稱「the most human look at Tokyo」（snippet）。Fabre 與台灣評論都點到「從日本人角度看外國人」的限制，日本評審則把它當多元社會題材加分。

## 15. しあわせな結婚 幸福的婚姻（テレビ朝日，2025）

1. **Metacritic**：沒有頁面（站內搜尋「happy marriage」只有 Scenes From A Marriage 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：**沒有找到**。搜尋過：Exa「"Shiawase na Kekkon" Abe Sadawo Matsu Takako 2025 drama review」，只找到 Dorama World 部落格（2026-02-15，給 5/10，說懸疑太好猜、刑警角色動機混亂）、Tokyo Unfolded（Substack，前兩集心得）、HamsapSukebe 部落格與 MANTANWEB 未署名介紹（snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2025-09-20，〈《幸福的婚姻》：阿部貞夫與松隆子共譜愛情和秘密交織的懸疑故事〉。https://stars.udn.com/star/story/10093/9006391 （read；完結後（最終回 9-11 播出）評全劇）
   - 摘要：她說本劇反轉「女方嫁入男方家」的傳統，由不婚律師搬進妻子家族；但編劇大石靜在懸疑與家庭倫理之間沒有拿捏好，導演節奏也有點怪，賣點還是阿部貞夫與松隆子的表演與大量「留白」。立場：保留。
   - 原文：「感覺大石靜在「懸疑推理」與「家庭倫理」兩個題材之間，還沒有拿捏得很精準，而導演在節奏的掌握方面也有點怪。不過，這部日劇的賣點，應該還是演員們的精采表現。」
5. **分歧**：**收視與影評年度榜都有，但劇本評價分歧**。2025 民放單集總合 #12 15.5%、Filmarks Awards 2025 入圍（ratings 檔）；Real Sound 2025 麦倉正樹 #3（awards 檔）。台灣評論與英文部落格（Dorama World 5/10）都嫌懸疑與家庭兩條線不協調；日本 MANTANWEB 報導觀眾對結局「很滿意」的社群留言（snippet）。

## 16. イクサガミ Last Samurai Standing 武士生死鬥（Netflix，2025）

1. **Metacritic**：**78**（Generally Favorable，7 篇評論：Collider、RogerEbert、Vulture、Decider、The Daily Beast、THR、Screen Rant）；使用者分數 6.3。https://www.metacritic.com/tv/last-samurai-standing/season-1/ （read）
2. **豆瓣**：**7.3**（人數不明；截至 2026-10-07），風傳媒，魏甫丞，2026-10-08（同第 7 部，read (Exa)；2024–2026 Netflix 日本真人劇第 3）。
3. **英文評論**：RogerEbert.com，Rendy Jones，2025-11-13，〈Netflix's "Last Samurai Standing" is One of the Best Action Shows of the Year〉。https://www.rogerebert.com/streaming/last-samurai-standing-netflix-tv-review-2025 （read (Exa)；文末註明「Whole season screened for review」，評全季）
   - 摘要：他說這是明治維新版的《大逃殺》，在社會評論與血腥娛樂之間取得平衡；每集刀戰都拍得、編得、剪得極好，岡田准一兼任動作設計。缺點是六集塞太多角色，很多人一出場就被殺；部分動作與角色設計像《真人快打》一樣卡通化。立場：推。
   - 原文：「Ultimately, "Last Samurai Standing" is a fully realized, epic action series that seamlessly integrates some of the most intricate action filmmaking to be seen on television in years, with a beating human heart that makes us care.」
   - 另有 THR（Daniel Fienberg，「More action than character, but viewers won't complain」）、Collider（Jeff Ewing）、Decider（Johnny Loftus，首集 STREAM IT）、SCMP（James Marsh，4/5），都只看到 Exa 摘要（partial），未當主評論。
4. **中文評論（台灣）**：VERSE，葉聖博，2026-01-06，〈2025年必看十部日劇——《榮耀家族》、《武士生死鬥》與《紅豆麵包》之外還有哪些？〉。https://www.verse.com.tw/article/2025-j-drama （read；**年度十大片單的短評，一段約 200 字，不是單篇劇評**）
   - 摘要：編輯部把它列第 7，說雖沒有《神劍闖江湖》那樣多的華麗劍鬥，但有武士版《魷魚遊戲》的闖關緊張感，讓人反思武士在新時代的掙扎。立場：推。
   - 原文：「劇中的美術及攝影都深具水準，尤其是開場一鏡到底的戰爭畫面、一刀斃命的戲碼都非常精彩。」
   - 清單內沒有找到單篇署名劇評：Groundlane 站內搜尋 agentm、filmaholic、thenewslens、500times、stars.udn、GQ、ELLE，只找到 GQ〈真實歷史背景解析〉（科普型）、噓！星聞女主角藤崎由美亞介紹（2025-11-22，snippet）、marie claire 台灣〈5大亮點〉（lifestyle 介紹，snippet，文中提到「劇集雖然因節奏、配樂與部分對白而引發議論」）、個人部落格 Netflix追劇筆記本。
5. **分歧**：**影評高、觀眾分數中等**。Metacritic 78 vs 使用者 6.3；Rotten Tomatoes 第一季 12 篇 100%、觀眾 86%（snippet）；IMDb 7.5（23K）、Netflix 2025 下半年 21M views（ratings 檔）；豆瓣 7.3。首週名次說法不一：ContentAsia 寫首週全球非英語第 2（31.7M 小時，ratings 檔，snippet），VERSE 寫「推出後立刻登上Netflix全球冠軍」，未查證，正文不要引 VERSE 這句。Real Sound 2025 麦倉正樹 #4（awards 檔）；PTT 2025 秋季推薦 #3、Netflix 台灣週榜 #10（fans 檔）。

## 17. 今際の国のアリス Alice in Borderland 今際之國的闖關者（Netflix，S1 2020、S2 2022、S3 2025）

1. **Metacritic**：有頁面，**三季都沒有 Metascore（tbd）**：S1 0 篇評論（使用者 8.2）、S2 2 篇（Collider、Decider；使用者 7.7）、S3 3 篇（Decider、Screen Rant、Radio Times；使用者 6.6）。https://www.metacritic.com/tv/alice-in-borderland/ （read；各季頁 read）
2. **豆瓣**：**S1 8.7**（人數不明；上線約一週時），電影神搜，潘光中，2020-12-14（同下方台灣評論，read）。S3：風傳媒 2026-10-08 寫第 3 季「沒擠進前十」（前十最低 6.5 分），只能推論低於或接近 6.5，**沒有明確分數**。數英網 2020-12-21 轉述豆瓣 2020「評分最高日本劇集」第 8 名（partial，沒有分數）。
3. **英文評論**：IndieWire，Steve Greene，2022-12-22，〈Netflix's Survival Drama 'Alice in Borderland' Is One of TV's Most Impressive Spectacles〉（URL 標題：Season 2 Review）。https://www.indiewire.com/criticism/shows/alice-in-borderland-season-2-review-netflix-show-1234794167/ （read (Exa)；**評第二季**）
   - 摘要：他說第二季畫面規模依然驚人（開場飛車追逐、跨樓層的鬼抓人），也像疫情寓言；缺點是角色常停下來把策略與哲理講出口，「What is life, really?」式的哲學迴圈重複，但 Chishiya（村上虹郎）成了最大亮點。立場：推，有保留。
   - 原文：「But it's that spectacle that pretty much makes up for all the other shortcomings.」
   - 第一季沒有找到清單內媒體評論（Ars Technica，Jennifer Ouellette，2020-12-20，正面，partial，清單外）；第三季有 Collider（Elisa Guimarães，「by far the weakest link」）、The Hindu（Pallavi Keswani，「a season struggling to justify its existence」）、Decider（Johnny Loftus，首集 STREAM IT），都只看到 Exa 摘要（partial）。
4. **中文評論（台灣）**：電影神搜，潘光中（專業編劇），2020-12-14，〈【劇評】網飛漫改劇《今際之國的闖關者》第一季：以命相賭的生存遊戲，你敢挑戰嗎？〉。https://news.agentm.tw/149891/ （read；評第一季全 8 集）
   - 摘要：他把本劇放在《大逃殺》《飢餓遊戲》等生存遊戲脈絡，說題材面臨「冷飯熱炒」，但人物鮮明、會揭露角色在現實世界的不堪並控訴社會不公；特效由《少年Pi》奧斯卡得主操刀「與大螢幕相比毫不遜色」；友情與犧牲是重點。立場：推。
   - 原文：「幸而在主創團隊的努力下，將所有人物都呈獻的非常鮮明、厚度十足」
   - 另有釀電影第一季、第二季評論（2021-07-12、2023-02-14，snippet）、〈娛樂有評〉戴天易（2021-01-10，snippet）、GQ 第三季介紹（介紹型），未讀。
5. **分歧**：**觀看量最大、影評網站幾乎不收錄、第三季口碑下滑**。IMDb 7.8（154K）、MDL S1 #3 8.9（99,760）、S2 #2 8.9（61,941）、Netflix 2025 下半年 S3 25M views（ratings 檔）；Variety 報導 S2 曾是 Netflix 日本最多觀看作品（ratings 檔，snippet）。但 Metacritic 三季都湊不滿 4 篇評論；使用者分數從 8.2、7.7 掉到 6.6，豆瓣 S1 8.7 到 S3 掉出前十，第三季（脫離原作）英文評論多說是最弱一季。台灣 Netflix 週榜 S3 #3（fans 檔）；PTT 有〈這樣改保證今際之國變神劇〉負面串（fans 檔）。

## 18. 幽☆遊☆白書 Yu Yu Hakusho 幽遊白書（真人版，Netflix，2023）

1. **Metacritic**：**70**（Generally Favorable，4 篇評論：Decider、IGN、Collider、Paste）；使用者 6.6（44 人）。https://www.metacritic.com/tv/yu-yu-hakusho-2023/ （read；頁面另列 Season 2「1 Episode • 2027」tbd）
2. **豆瓣**：沒有找到可用來源。搜狐自媒體 2025-02-21 片單有本劇點評但沒看到分數（snippet，不採用）。
3. **英文評論**：Decider，Johnny Loftus，2023-12-16，〈Stream It Or Skip It: 'Yu Yu Hakusho' on Netflix, A Live Action Adaptation Of A Famous Manga Title Where Humans And Demons Fight It Out〉。https://decider.com/2023/12/16/yu-yu-hakusho-netflix-review/ （read (Exa)；**只評第 1 集**）
   - 摘要：他說北村匠海的幽助有詹姆斯．狄恩式的冷酷，Scanline 的特效（寄生蟲在皮膚下蠕動）很出色，古川琴音的牡丹俏皮。結論 STREAM IT。
   - 原文：「Fans of the original Yu Yu Hakusho manga will definitely want to check how this energetic live action version realizes its classic characters. But there's plenty to enjoy for the rest of us, too」
   - 看完全季的評論多半較負面：Paste（Elijah Gonzalez，「these characters feel flattened」）、The Verge（Ash Parrish，「my hope was woefully misplaced」，清單外）、Tokyo Weekender（Cezary Jan Strusiewicz，「A Disappointing Adaptation」，清單外），都只看到 Exa 摘要或 GamesRadar 轉引（partial）。
4. **中文評論（台灣）**：電影神搜，潘光中，2023-12-18，〈【劇評】《幽遊白書》真人版第一季：奇葩選角×情節魔改×簡陋特效……還好武打很像一回事〉。https://news.agentm.tw/270176/ （read；評全 5 集）
   - 摘要：他說五集塞進原作約 12 卷，四聖獸篇大幅精簡、雪菜篇與暗黑武術會被揉在一起，主角群的革命情感幾乎消失；主角與女角選角、造型「慘不忍睹」，反派反而還原度高；大內貴仁的動作設計拳拳到肉是唯一亮點，但最終戰仍靠簡陋特效硬推。立場：不推（只推打戲）。
   - 原文：「感覺上就很像是一群空有熱情、但眼界有限的在校學子，盡了最大努力交出來的畢業製作。」
   - 關鍵評論網另有兩篇（〈選角崩壞，但現代特效跟武打拯救了這次改編〉https://www.thenewslens.com/article/196330 ；〈劇本改動與問題〉196977），只看到摘要（snippet）。
5. **分歧**：**觀看量高、首集評論正面、看完全季的評論與原作粉絲偏負面**。Netflix 2023 下半年 17M、2024 上半年 8M、Filmarks Awards 2024 配信入圍（ratings 檔）；Real Sound 2023 成馬零一 #2（awards 檔）；Netflix 台灣週榜 #1 累計 3 週（fans 檔）；マイナビニュース 2026 會員調查 Netflix 日本原創第 2（snippet）。Metacritic 70 但使用者只有 6.6。Decider 首集 STREAM IT 與潘光中「畢業製作」評語是最明顯的對照，兩者看的集數不同。

---

## 總表

| # | 劇名 | Metacritic | 豆瓣（媒體引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | VIVANT | 無 | 無可用 | Japan Times／Gabriella Geisinger | partial（付費牆） | 娛樂有評／雪奈 | read | 高收視與大獎 vs 結局洗白、S2 中國爭議 |
| 2 | MIU404 | 無 | 只有年度榜 #6（數英） | MDL News／Orangevine（清單外） | read (Exa, 至第 9 集) | 電影神搜／重點就在括號裡 | read | 開播平淡、後勁強 |
| 3 | 法醫女王 | 無 | 9.3（新浪 2018）；9.2–9.4 | Asian Movie Pulse／Adriana Rosati（清單外） | read (Exa) | 娛樂有評／卡爬（議題評論） | read | 一致高分，收視中上 |
| 4 | 99.9 | 無 | S2 8.4（新浪 2018） | 沒有找到 | — | 沒有找到 | — | 高收視、評論缺席 |
| 5 | 勿說是推理 | 無 | 未找 | The Blossom Review／Karen Mansoldo（清單外） | partial (Exa) | 電影神搜／雪奈日劇部屋 | read | 推理偏弱、結局「勿說是完結篇」 |
| 6 | 輪到你了 | 無 | 未找 | 沒有找到 | — | 娛樂有評／雪奈 | read | 收視爆表 vs 結局爛尾 |
| 7 | 地面師 | 無 | 7.2（風傳媒 2026） | Decider／Joel Keller | read (Exa, ep1) | 電影神搜／雪奈日劇部屋（開箱，介紹型） | read | 串流爆紅 vs 豆瓣中等、收尾粗糙 |
| 8 | 噬亡村 | 無 | 未找 | Decider／Johnny Loftus（S2） | read (Exa, S2 ep1) | 電影神搜／雪奈日劇部屋（S1） | read | 日本 Disney+ 最大 vs 西方影評缺席 |
| 9 | Last Man | 無 | 未找 | 沒有找到 | — | 娛樂有評／雪奈 | read | 高收視、無獎無英文評論 |
| 10 | GO HOME | 無 | 未找 | 沒有找到 | — | 娛樂有評／雪奈 | read | 小品，主線收得草率 |
| 11 | 女王偵訊室 | 無 | 未找 | 沒有找到 | — | 電影神搜／雪奈日劇部屋（系列介紹型） | read | 長壽收視劇，評論缺席 |
| 12 | 校規 | 無 | 未找 | 沒有找到 | — | 娛樂有評／雪奈（首播介紹型） | read（ep1） | 影評與重度劇迷熱、大眾面不明 |
| 13 | 獅子的藏身處 | 無 | 未找 | The Blossom Review／Karen Mansoldo（清單外） | partial (Exa) | 娛樂有評／雪奈 | read | 大致一致，口碑高於收視 |
| 14 | 東京沙拉碗 | 無 | 未找 | Tokyo Prism 3CK／Olivier Fabre（清單外） | read (Exa) | 娛樂有評／雪奈 | read（ep1） | 評審肯定 vs 外國人、酷兒再現批評 |
| 15 | 幸福的婚姻 | 無 | 未找 | 沒有找到 | — | 娛樂有評／雪奈 | read | 懸疑與家庭兩線不協調 |
| 16 | 武士生死鬥 | 78（7 篇） | 7.3（風傳媒 2026） | RogerEbert／Rendy Jones | read (Exa) | VERSE／葉聖博（年度片單短評） | read | 影評 78 vs 使用者 6.3 |
| 17 | 今際之國 | tbd（S1 0／S2 2／S3 3 篇） | S1 8.7（電影神搜 2020） | IndieWire／Steve Greene（S2） | read (Exa) | 電影神搜／潘光中（S1） | read | 觀看量最大 vs S3 口碑下滑 |
| 18 | 幽遊白書 | 70（4 篇） | 無可用 | Decider／Johnny Loftus | read (Exa, ep1) | 電影神搜／潘光中 | read | 首集好評 vs 全季與原作粉絲負評 |

「未找」= 這次沒有為該劇另外搜尋豆瓣新聞；「無可用」= 搜過但只有用戶文、社群文或沒有分數。

## 缺口

1. **Metacritic**：只有 Netflix 原創三部有頁面（武士生死鬥 78、幽遊白書 70、今際之國 tbd）。地面師、噬亡村這兩部串流大作連頁面都沒有，民放台劇全部沒有。
2. **豆瓣**：只有 5 部有媒體引述分數。法醫女王有三個時點的數字（9.2／9.3／9.4）；地面師、武士生死鬥來自同一篇風傳媒 2026-10 排行；今際之國 S1 8.7 是上線一週時；99.9 只有第二季。VIVANT S2 在中國引發官方批評，豆瓣分數狀態不明，正文不要寫分數。
3. **英文評論覆蓋極不平均**：清單內媒體只評到 Netflix／Disney+ 原創，而且 Decider 三篇都只評首集。民放台劇 8 部只有 VIVANT 有 Japan Times（付費牆，只有副標）。用到的 5 個清單外來源（Asian Movie Pulse、MDL News、The Blossom Review×2、Tokyo Prism 3CK），正文引用時寫「海外評論一例」，不要寫成「外媒評」。Japan Times 的地面師、VIVANT、武士生死鬥三篇如果能取得全文，是最好的補件。
4. **只評首集或前幾集**：Decider 三篇（地面師、噬亡村 S2、幽遊白書）、MDL News（MIU404 寫到第 9 集）；台灣的東京沙拉碗、校規只評第 1 集。引用時要寫明。
5. **台灣中文評論作者集中**：17 篇裡 12 篇出自雪奈（雪奈日劇部屋），立場普遍溫和偏推。評論性最強的是潘光中（今際之國 S1、幽遊白書）。99.9 沒有找到；地面師、女王偵訊室、校規、武士生死鬥只有介紹、開箱或片單短評。關鍵評論網（勿說是推理、幽遊白書、地面師）、釀電影（今際之國、噬亡村 S2）有文章但這次只看到 snippet，要補可以優先讀這幾篇。
6. 「分歧」欄裡的 THR、/Film、Rotten Tomatoes、共同社、有線新聞、上報、CREA、マイナビニュース、Paste、The Verge、Collider、The Hindu 等多是 **partial 或 snippet**，正文引用前要再讀原文。武士生死鬥首週「全球冠軍」（VERSE）與「非英語第 2」（ContentAsia）兩說未對齊；GO HOME 收視 14.4%（單集總合）與 5.9%（即時平均）口徑不同，不能並列比較；今際之國 S3 豆瓣只能推論低於 6.5，不是確定數字。

## toolDegradation

- **Groundlane MCP**（`web_extract`／`web_fetch`／`web_search`）為主：Metacritic 18 次站內搜尋與 6 個作品頁、全部台灣評論（娛樂有評 10 篇、電影神搜 7 篇、VERSE）都讀到。Groundlane 搜尋內部的 tavily／exa provider 多次 unavailable，由 brave／you 補上；兩次 `web_fetch`（東京沙拉碗、VERSE）第一次回「upstream closed the stream」，重試成功。Metacritic 作品頁用 `web_fetch` 只拿到導覽列，改用 `web_extract` 的 pattern（`aria-label="Metascore …"`、`/publication/`）才拿到分數與評論來源。Japan Times 兩篇只回前兩段（付費牆）。
- **Exa**：`web_search_exa` 用來找英文評論、豆瓣新聞（摘要長，多數只當 partial）；`web_fetch_exa` 讀到 RogerEbert、IndieWire、Decider 三篇、Asian Movie Pulse、The Blossom Review 兩篇（截斷）、MDL News、Tokyo Prism 3CK、風傳媒。Japan Times 兩篇同樣只回前兩段。
- **jina `read_url`**：試 Japan Times（Tokyo Swindlers）一次，只回導覽與付費牆提示。
- **Tavily**：未使用（已知額度不足）。**Firecrawl**：額度用完，未使用。**終端機 curl**：被擋，未使用。**Groundlane 直接 HTTP／Keenable／You.com keyless**：未需要。
