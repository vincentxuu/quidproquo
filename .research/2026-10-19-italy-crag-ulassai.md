# Research notes: Ulassai／Jerzu（含 Osini、Ussassai）— 2026-10-19

工具：前半段 Groundlane MCP（web_search／web_fetch），中途 Groundlane connector 斷線，改 Keenable keyless 搜尋＋r.jina.ai／jina read_url 讀頁；climbingitaly.com 與 ARST 時刻表用 curl 直接抓再用腳本抽路線表。原始擷取存在 scratchpad/sard/。

## Sources opened

- Climbing Ulassai（Nannai Climbing Home，在地開線與維護團隊）：Climbing https://climbingulassai.com/climbing: 旺季春（3–5 月）與秋（9 月到 11 月中）; Ulassai 海拔 775 m，常比其他岩區低幾度，是全島最好的夏季目的地之一，熱天可到 35 度上下; 冬天可爬但下雨可能連續幾天不能爬; 「Of the 2000 routes around Ulassai, the vast majority are 6's and 7's」，8 字頭到 9a，數十條 5 字頭; 多數岩區從鎮上走不到 30 分鐘、各方向都有; 外傾很少超過 15 度; 「The bolting in Ulassai is safe and well-thought, with crags being maintained regularly by local climbers」; 70 m 繩夠多數路線，Su Casteddu、Bacilli、Scala Ussassa 用 80 m 較好; 至少 16 快扣; 新路線落石機率高，建議戴頭盔; 在地指南涵蓋 Ulassai、Jerzu、Osini、Gairo，在店家、酒吧、民宿買; 超過 35 m 的路線指南會標; 新路線難度主觀; 「Bolting in Ulassai is regulated」，開線前要先聯絡 Nannai、Dirt Bag、Taccu Maccu 或 Bar paninoteca stazione curcuda; 與 Ulassai 市政府一起逐步更新老路線，指南收入用在重打; Dirt Bags 攀岩店可買粉、繩、器材，也租裝備; 有在地 WhatsApp 攀岩群組找繩伴（冬天人少）
- Climbing Ulassai：Ulassai https://climbingulassai.com/ulassai: 卡利亞里機場 115 km、奧爾比亞 180 km、阿蓋羅 220 km; 搭公車要飛卡利亞里; 卡利亞里機場每 20 分鐘有火車到卡利亞里巴士站，再搭約 3 小時 15 分巴士到 Ulassai，最快班次 11:00、14:00 發; 鎮上從一頭到另一頭約 1 公里; 不開車也能爬近鎮的岩區; Canyon Sa Tappara 有 highline，峽谷 120 m 高
- climbingitaly.com（Climbing Sardinia 協會）：Ulassai & Jerzu 區頁 https://climbingitaly.com/area/ulassai/: 「Ulassai and Jerzu are the most popular climbing destination in Sardinia during the summer」; Jerzu 最早的岩區 1989 年由 Oviglia、Dessì、Garippa 等開始打（Il Castello，接著 Isola del Tesoro、Palazzo d'Inverno），三區合計超過 240 條; Palazzo d'Inverno 下午背陰，是全島最好的夏季岩場之一; Ulassai 海拔 775 m，2002 年 Sarti、Piras、Oviglia、Mocci 開始打錨，2011 年六個朋友開 Nannai Climbing Home 後大規模開發; Canyon Sa Tappara 是主岩場，超過 150 條、入門到 8 字頭，推薦給一個人來的攀岩者; Torre dei Venti 是最涼的岩場之一，吹 mistral 要帶外套; 最涼的是朝北的小峽谷 Cave of Dreams，6–10 月天天有人; 7、8 字頭去 Su Casteddu、S'assa Bella、Su Fundu 'e Simone; 多段很少，只有 Su Sussiu 幾條
- climbingitaly.com 各子區路線表（2026-10-19 抓）: Canyon Sa Tappara https://climbingitaly.com/sardegna/canyon-sa-tappara/: 154 條、Vertical、Shade all day、10 min、Sheltered from Mistral、Summer crag; Kajoe 6a 28 m; Sun and bass 6a+ 28 m; Pissenlove 5a 20 m; Zimo 5c 20 m; Vision crack 6a+ 30 m（2002）; Arcipelaghi 6b 22 m（2002）; Educanza 6b+ 22 m（2002）; Non luogo 6c 30 m（2002）; La danza del maestrale 7a 30 m; Savoiardo d'Egitto 7b 25 m（2006）; Bad joke 7c 23 m; Trottolina 8a 30 m; Niagara 8a+ 30 m（2004）; Olieningrado 8b 26 m（2016）; Still alive 8c 25 m
- climbingitaly.com：Cave of Dreams https://climbingitaly.com/sardegna/cave-of-dreams/: 32 條、Overhanging、Shade all day、20 min、Sheltered from all winds、Summer crag; Riglos 6b 15 m; Pink ball 7a+ 30 m; Io chiodo tu paga 8a+ 30 m
- climbingitaly.com：Lecorci https://climbingitaly.com/sardegna/lecorci/: 81 條、Sun in the morning、10 min、Summer crag; La trama del tempo 7a+ 30 m; Canna cinese 8a 35 m; Pugni volanti 8c 30 m; The laughing hearth 8c+ 25 m（2020）
- climbingitaly.com：Torre dei Venti https://climbingitaly.com/sardegna/torre-dei-venti/: 42 條、Sun in the morning、Exposed to all winds、Summer crag; Tenendo per mano il sole 5c 30 m; Un filo nella notte 5c 25 m; Lo scialle della luna 6c+ 40 m; Mondo incandescente 8b+ 35 m
- climbingitaly.com：Su Casteddu https://climbingitaly.com/sardegna/su-casteddu/: 86 條、Sun in the afternoon、15 min、Climb all year; Crazy wedding 8a+ 40 m; Contromisure 8b 34 m
- climbingitaly.com：Il Castello（Jerzu）https://climbingitaly.com/sardegna/il-castello/: 75 條、Sun in the afternoon、5 min、Climb all year; Easy 5c 20 m; Ninetto e Ninetta 5c 20 m; Fix 6a 20 m
- climbingitaly.com：Isola del Tesoro（Jerzu）https://climbingitaly.com/sardegna/isola-del-tesoro/: 63 條、Sun in the afternoon、10 min、Exposed to all winds、Climb all year; Class 5c 27 m
- climbingitaly.com：Marosini https://climbingitaly.com/sardegna/marosini/: 26 條、Overhanging、Sun in the morning、Summer crag
- theCrag：Ogliastra https://www.thecrag.com/en/climbing/italy/sardinia/jerzu-area: Ulassai 983 條、9.6k 筆攀登紀錄、24 子區; Jerzu 359 條、1,323 筆; Gola di San Giorgio (Osini) 25 條; Ussassai 75 條
- theCrag：Ulassai https://www.thecrag.com/en/climbing/italy/sardinia/jerzu-area/area/2097014847: 子區路線數 Canyon Sa Tappara 154（3,554 筆）、Su Casteddu 100（882）、Genobida 78、Lecorci 70、Bau Arena 68、Su Fundu 'e Simone 61、Torre dei Venti 42（616）、Cave of Dreams 34（698）、S'assa Bella 32（711）; Marosini 掛 Warning; 指南條目「covering nearly 1,400 routes」
- theCrag：Jerzu https://www.thecrag.com/en/climbing/italy/sardinia/jerzu-area/area/2097008529: Palazzo d'Inverno 106、Il Castello 76、Isola del Tesoro 66、Calice di Stelle 23; 描述「1300 routes in this lovely area」
- theCrag：Marosini https://www.thecrag.com/en/climbing/italy/sardinia/jerzu-area/area/1645833945: 停車走 10 分鐘，路上有幾段固定繩; Warning「Access: Rope on the rungs — The rope at the top of the rungs is worn down to the core stranded. Needs to be replaced.」（2026-10-19 讀時顯示 12 天前建立）
- UKClimbing：Ulassai - A Sardinian Gem（Daniel Little，2018-03-26）https://www.ukclimbing.com/articles/destinations/ulassai_-_a_sardinian_gem-10041: 4a 到 9a(?); 多數子區朝東，早上慢、下午好; Sa Tappara 4 到 8c+，「limestone but it has a sandstone feel」; Cave of Dreams 鐘乳石; Marosini、Su Casteddu 有 40 m 長路線; 開線要找 Nannai 合作，「some rock is strictly off limits」，只准 316L 不鏽鋼或鈦; 精選路線 Pis & Love 5a、Vision Crack 6a、Riglos 6b、Non Luogo 6c、Lo Scialle della Luna 6c+、La Danza del Maestrale 7a、Pink ball 7a+、La Trama del Tempo 7a+、Savoiardo d'Egitto 7b、Bad Joke 7c、Trottolina 8a、Canna Cinese 8a、Niagara 8a+、Olieningrado 8b; Ulassai Festival 每年 6 月初; 超過 500 條在鎮中心走得到，「you can get away with not having a car」; Baunei 開車 50 分鐘; 4–10 月天氣最穩，春秋條件最好，海拔約 800 m、多數下午背陰，夏天也能爬; 只有卡利亞里有像樣的大眾運輸; 露營車與帳篷免費露營「is tolerated」，最好在 Campo Sportivo; 最近急診在 Lanusei，開車 30 分鐘，Jerzu 有醫院; UKC Logbook 最熱門路線 Arcipelaghi 6b、Vision Crack 6a+、Educanza 6b+、La Danza del Maestrale 7a、Sun and bass 6a+、Non Luogo 6c、Bocabulario 5a、Kajoe 6a
- Planetmountain：The rebirth of Jerzu in Sardinia（Maurizio Oviglia）https://planetmountain.com/en/news/climbing/the-rebirth-of-jerzu-in-sardinia.html: 1980 年 Marco Bernardi 第一個在 Castello di Jerzu 攀登; 1989 年開始有系統打錨; Ulassai 距 Jerzu 5 km; 從卡利亞里走新 SS125 約 1 小時 15 分，Cala Gonone 約 2 小時，Baunei 約 45 分鐘; 海拔約 800 m，春秋最好，夏天是薩丁尼亞最涼的區; 新路線清單（2012）
- Climb Europe：Ulassai and Jerzu Rock Climbing Guidebook https://climb-europe.com/products/ulassai-jerzu-osini-rock-climbing-guidebook: 涵蓋 Ulassai、Jerzu、Osini、Ussassai、Gairo; 約 1,300 條; 最佳季節 3 月到 12 月; 多數路線 F6a–F7c+; 2025 年修訂第 6 版，義英雙語; 收益用在 Ulassai、Jerzu、Osini 的打錨與重打; 238 頁、A5
- climbing-guide.eu：Ulassai - Jerzu - Ussassai - Osini 2025 https://www.climbing-guide.eu/climbing-guidebook-ulassai-jerzu-ussassai-osini-2025-11857/: 2025 版比上一版多 18 頁; 238 頁; 義英雙語; 作者欄 Ruben Becker; 建議 80 m 繩、16 快扣; 同頁另列 Oviglia、Piras《Jerzu Osini Ulassai》2023，112 頁，義英，32 處運攀區＋6 處傳攀區
- Planetmountain：Ulassai Festival 2026 in Sardinia https://www.planetmountain.com/en/events/ulassai-festival-2026-in-sardinia.html: 第六屆，2026 年 5 月 30 日到 6 月 1 日; 攀岩、健行、登山車、瑜伽、highline; Ulassai 市政府主辦，歐盟計畫補助; 免費，5 月 15 日起官網報名
- Ulassai Festival 官網 https://ulassaifestival.com/en/: 「30 maggio – 1 giugno 2026」; Free entry; 節目含 Climbing、Highline and Slackline、Trekking、E-Bike Tour
- ARST 103 線時刻表 https://app.arstspa.it/quadri/103.html: VILLAGRANDE - LANUSEI - TORTOLI - IERZU - TERTENIA - MURAVERA - CAGLIARI; 停 Osini、Ulassai、Ulassai Poste、Jerzu 各站; Ulassai 只有少數班次停
- CNSAS Sardegna：La Richiesta di Soccorso https://cnsas.sardegna.it/la-richiesta-di-soccorso/: 薩丁尼亞撥 112 NUE，請轉 Soccorso Alpino e Speleologico Sardegna
- Keenable 搜尋摘要（STS Ogliastra）：Among the Tacchi d'Ogliastra https://stsogliastra.com/home/en/among-the-tacchi-d-ogliastra-itineraries-in-ogliastra: 從 Tortolì 走 SS125var 往 Tertenia，進村前右轉舊 SS125 跟著 Jerzu 路標（只讀到搜尋摘要，正文沒開，不單獨引用）

## Dropped / not used

- climbingulassai.com/guidebook：404（舊網址）。指南書資訊改用 Climb Europe 與 climbing-guide.eu 商品頁。
- falesia.it Ulassai PDF（2005 年 Lorenzo Cangiano 的舊指南）：太舊，不用。
- villapelau.com、strictlysardinia、anywhereitaly、Mountain Project Ulassai：只看到搜尋摘要，沒有打開，不引用。
- STS Ogliastra 開車路線：只有摘要，正文未讀；開車段改用 Planetmountain 的「新 SS125」說法。
- 免費露營：只有 UKC 2018 年一句，寫進正文時標年份。
- 封閉／禁攀：搜尋「Ulassai falesia chiusa ordinanza」沒有找到任何命令或公告。
- ARST 103 的逐班時刻：表格欄位對不齊，不寫具體時間，改用 Climbing Ulassai 寫的最快班次。

## toolDegradation

- Groundlane MCP 前半段可用；2026-10-19 中途回「MCP server "claude.ai Groundlane" is not connected」。
- 改用 Keenable keyless API（curl）搜尋、r.jina.ai 讀頁（Climbing Ulassai、Planetmountain Jerzu）。
- climb-europe 新聞頁 404 → 改讀商品頁（jina read_url）。
- theCrag：Groundlane web_fetch（html）在斷線前抓到。
- Firecrawl 依 brief 不使用。
