# TW2 評價資料表：台劇｜社會、職人與時代 15 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-13。片單來自 `post-tw2-shows.txt`。IMDb／MDL／Google 年度搜尋／DailyView／Netflix 週榜沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、PTT／LINE TODAY 票選／Dcard 沿用 `candidates-fans-taiwan.md`，這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

> **⚠ 本檔的證據等級整體只到 snippet。** 這個 session 的 MCP 網路工具全部斷線，內建 `WebFetch` 對所有試過的網域都回 `getaddrinfo ENOTFOUND`（被環境網路白名單擋），終端機 `curl` 也被擋。唯一能用的是內建 `WebSearch`：它只回標題、網址和一段由模型寫的摘要，**沒有讀到任何一篇文章的內文**。所以：
> - 下面所有評論條目都是 **snippet**，依規則**不能當評論用**，只能當「待讀清單」：標題、網址、媒體是真的搜到的，作者只在標題、網址或專欄名稱寫明時才填，日期只在網址或搜尋結果寫明時才填。
> - **沒有任何原文引述。** 搜尋摘要裡的句子是模型改寫，不是原文，一律不收。「立場」欄寫的是「摘要顯示的傾向」，讀全文前不要寫進正文。
> - 下一個有 Groundlane／Exa／WebFetch 的 session 應逐條補讀，把標記升級成 read／partial，並補上引述。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | 原定做法（站內搜尋頁抓 `/tv/` 連結）做不到：`WebFetch` 抓 `metacritic.com` 時被網路擋。改用 `WebSearch` 加 `allowed_domains: ["metacritic.com"]`，查 12 部的英文片名（the world between us、wave makers、seqalu formosa 1867、gold leaf taiwan series、three tears in borneo、the outlaw doctor、a touch of green 2015、the magician on the skywalk、black tide island、oops! i'm in jail、mad doctor 2022 taiwan、workers 2020 taiwan hbo asia） | `WebSearch`（網域限定） | 12/15 snippet：**都沒有搜到頁面**。the world between us 只搜到德劇 Maxton Hall – The World Between Us（不同作品）。牛車來去（Oxcart Trails）、人生清理員（The Cleaner）、華麗計程車行（A Wonderful Journey）沒查，因為片名太常見，網域搜尋分不出來。這不等於站內搜尋查證過；正文要寫「沒有頁面」前建議補做一次站內搜尋 |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com | `WebSearch` | 8 部找到二手引述，**全部 snippet**。來源以台灣美妝網站 **BEAUTY美人圈（beauty321.com）** 的排行清單為大宗（準媒體，非評論）；另有關鍵評論網 2019 播出期間新聞（我們與惡 9.3）、澎湃新聞（做工的人，摘要沒寫清楚是不是澎湃引述的）。7 部沒找到 |
| 英文評論 | 署名評論 | `WebSearch` | **清單內媒體沒有找到任何一部的署名劇評。** 清單內媒體只有新聞／獎項報導（Taipei Times、Focus Taiwan）、一篇 The News Lens International 的天橋文章（作者未知）、The Economist 年度榜單的上榜紀錄（awards 檔）。清單外：SCMP、Foreign Policy（人選之人）、/Film（我們與惡）、nomanisanis.land（Brian Hioe 個人網站，3 部）、Taiwan Gazette、Lingua Sinica（聽海湧）、Cinema Escapist（我們與惡）、sinema.sg、Philippine Daily Inquirer（做工的人）。**全部 snippet** |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、500輯、天下獨立評論、報導者、鏡週刊、關鍵評論網、VERSE、風傳媒 | `WebSearch`（`allowed_domains` 限定 news.agentm.tw／stars.udn.com／mirrormedia.mg／thenewslens.com／filmaholic.com.tw／500times.udn.com／verse.com.tw／opinion.cw.com.tw／twreporter.org／storm.mg） | 14/15 找到清單內媒體看起來是評論的文章（標題含「劇評」「評」「開箱劇評」或屬評論專欄），**全部 snippet**。牛車來去只有新聞、幕後花絮與〈娛樂透視〉特稿，沒有評論。釀電影（filmaholic）一篇都沒搜到 |

標記說明：**read** = 工具讀到頁面內文；**partial** = 只讀到前段或一半；**snippet** = 只看到搜尋結果的標題、網址與摘要，不算讀過、不當評論用。本檔沒有 read 也沒有 partial。

> 英文評論的媒體使用次數（上限 3）：**清單內 0**（沒有署名劇評）。清單內媒體的非評論文章：Taipei Times（新聞／特稿，我們與惡、斯卡羅）、Focus Taiwan（新聞／獎項，天橋、茶金、化外之醫、我們與惡 II）、The News Lens International（天橋，〈The Magician on the Skywalk: A Magical Realist Lens on Taiwan〉，作者未知；另有一篇總論〈The Shows We Loved, the Shows We Love〉，和一篇談人選之人在中國走紅的報導）。**主流但不在清單**：SCMP 1（人選之人）、Foreign Policy 1（人選之人）、/Film 1（我們與惡）、Philippine Daily Inquirer 1（做工的人）。**清單外小站／個人網站**：nomanisanis.land 3（斯卡羅、茶金、天橋，都是 Brian Hioe，已到上限；他另有一篇人選之人沒用）、Cinema Escapist 1（我們與惡）、Taiwan Gazette 1（聽海湧）、Lingua Sinica 1（聽海湧，China Media Project 旗下 Substack）、sinema.sg 1（做工的人）、The Envoy 1（人選之人，備用）。
>
> **8 部連一篇英文評論的線索都沒有**：化外之醫、星空下的黑潮島嶼、牛車來去、一把青、監所男子囚生記、人生清理員、華麗計程車行、村裡來了個暴走女外科（後兩部只有 MyDramaList 使用者評論，不收）。這 15 部裡，英文媒體談台劇多半是「新聞」（收視、金鐘、#MeToo、中國審查）而不是「劇評」，和陸劇版的情況相近。
>
> 台灣中文評論：**作者集中在「雀雀」**（聯合報〈娛樂有評〉，網址 stars.udn.com/star/story/10093/…，同文常轉載到 500輯）：我們與惡 II、人選之人、茶金、聽海湧、斯卡羅、監所男子囚生記、人生清理員、華麗計程車行、暴走女外科，**共 9 部**；其中監所男子囚生記與暴走女外科**只有**雀雀這一篇。其次是 **米果**（天下獨立評論〈台北捌玖零〉）：我們與惡 S1／S2、化外之醫（金鐘綜論）、斯卡羅、星空下的黑潮島嶼，共 5 部。其他具名作者：呂文慧（獨立評論，我們與惡、人選之人）、盧郁佳（鏡週刊，天橋）、魏玓（風傳媒觀點，斯卡羅）、馬欣（娛樂有評／500輯，做工的人）、潘怡豪（獨立評論，人生清理員）、魏宏晉（獨立評論，一把青）、胡又天（風傳媒專欄，一把青主題曲）、王子榮（報導者〈法律人追劇〉，我們與惡 II）、蔡如音（獨立評論投書，聽海湧）。電影神搜、關鍵評論網的劇評多數在搜尋結果看不到作者。正文選用時建議避開雀雀，或至少不要讓她撐起超過 3 部。
>
> 業配與導流：風傳媒 `storm.mg/lifestyle/…` 標題掛「影評／」的文章，摘要看起來多是「網友評價整理＋看點」（例：人選之人〈過譽？他喊缺少2劇情超可惜〉、華麗計程車行〈為何爆紅？3大必看亮點〉），讀全文確認前**先當網友整理，不當評論**。鏡週刊〈娛樂透視〉是特稿（含片方訪談），不是評論。關鍵評論網〈《化外之醫》推薦序〉是出版社書序。電影神搜〈開箱〉系列多是播出前看片的首評，有些可能是片方邀約試映，讀全文時要看文末有沒有合作標記。

---

## 1. 我們與惡的距離（含 II）（公視／HBO Asia，2019；II：公視／CATCHPLAY+，2025；英文 The World Between Us／After the Flames）

1. **Metacritic**：沒有搜到頁面（`WebSearch` 限定 metacritic.com，「The World Between Us」只出現德劇 *Maxton Hall – The World Between Us*，snippet）。
2. **豆瓣**：**S1 9.3（2019 播出期間）**。關鍵評論網 2019 年報導，說本劇「在豆瓣拿下今年華語劇最高評分 9.3」（https://www.thenewslens.com/article/117460 或 /117440，snippet；兩個網址都出現在同一組結果，沒能分辨是哪一篇）。BEAUTY美人圈〈近十年豆瓣評分年冠台劇〉寫 9.4（https://www.beauty321.com/post/65546 ，snippet，美妝網站排行清單）。II：ratings 檔記「豆瓣 2025 評分最高華語劇 #3」，本次沒找到媒體引述的分數。
3. **英文評論**：**清單內媒體沒有找到署名劇評。**
   - Cinema Escapist，2019-10（作者未知），https://cinemaescapist.com/?p=11712 （snippet；清單外網站）。摘要顯示傾向：推，把它讀成台灣民主社會規範的多面呈現，談死刑、精神疾病污名與媒體煽情。評全季與否未知。
   - /Film〈The Daily Stream: The World Between Us Measures The Distance Between Ourselves And Evil〉，https://www.slashfilm.com/1215144/heres-where-you-can-stream-the-world-between-us （snippet；清單外主流網站；〈Daily Stream〉是串流推薦欄，不一定算完整劇評；作者、日期未知）。摘要顯示傾向：推，但提到劇情「不完全寫實」。
   - 清單內媒體的非評論：Taipei Times 特稿〈Taiwanese dramas go global〉（2019-06-25，https://www.taipeitimes.com/News/feat/archives/2019/06/25/2003717525 ，snippet）；Focus Taiwan 收視新聞（2019-04-22）與 II 獲金鐘戲劇節目獎新聞（2026-10-26，https://focustaiwan.tw/culture/202610260015 ，snippet）。
   - II：沒有找到英文署名評論。只有 The Straits Times 的介紹文〈The World Between Us returns with Vic Chou as a grieving dad〉（Magzter 轉載，snippet）、ContentAsia 產業特稿。
4. **中文評論（台灣）**（全部 snippet）：
   - S1，批評：關鍵評論網〈評《我們與惡的距離》：前半打著「社會寫實」的招牌，後半卻急轉直下〉https://www.thenewslens.com/article/117950 ；同站〈打著社會寫實的招牌，無法掩飾其內涵的膚淺〉https://www.thenewslens.com/article/117873 。作者未知。摘要顯示傾向：批評後四集變成「社教宣導片」、新聞業描寫愈到後面愈矯情。
   - S1，推：電影神搜〈《我們與惡的距離》劇評+操盤團隊深度全解析〉https://news.agentm.tw/47302/ ；獨立評論，呂文慧〈料理心靈〉https://opinion.cw.com.tw/blog/profile/423/article/7983 ；獨立評論，米果〈我們與惡的距離，原來這麼近〉https://opinion.cw.com.tw/blog/profile/57/article/7933 。
   - II：關鍵評論網〈《我們與惡的距離II》全劇總評：堪稱台劇頂天立作〉https://thenewslens.com/article/255411 （摘要顯示傾向：強推；評全季）；同站〈首兩集與第一季差異〉https://www.thenewslens.com/article/254075 （只評首 2 集）；娛樂有評／500輯，雀雀〈台灣感性《我們與惡的距離II》為「最美的風景」升級〉https://stars.udn.com/star/story/10093/8820874 ；獨立評論，米果 https://opinion.cw.com.tw/blog/profile/57/article/16267 、/16369 ；報導者〈法律人追劇〉，王子榮〈《我們與惡的距離2》：國民法官的火盃試煉〉https://www.twreporter.org/a/saturday-features-legal-profession-the-world-between-us-after-the-flames ；電影神搜〈1&2 集開箱〉https://news.agentm.tw/356976/ （只評首 2 集）。
   - 報導者〈呂蒔媛X林君陽X吳慷仁〉https://www.twreporter.org/a/drama-insight-the-world-between-us 是訪談，不是評論。
   - 建議正文 S1 用呂文慧或關鍵評論網 117950（反方），II 用關鍵評論網 255411 或王子榮，避開雀雀與米果。
5. **分歧**：**台灣共識最強的一部，S1 的批評集中在結局「太理想化」**。IMDb 8.8（3.3K，台劇第 1）、MDL #11 8.4、Google 2019 快速竄升總榜 #1（第一部登頂的戲劇）、豆瓣 2025 年度華語劇 #3（II）、DailyView 2025 #7（II）（ratings 檔）；金鐘戲劇節目獎 2019（S1）與 2026（II）都得獎、AACA 2019 台灣最佳劇集、2025 周渝民最佳男主角＋呂蒔媛最佳編劇（II）；500輯 鄭秉泓 2022 列為三部關鍵台劇之一（awards 檔）；PTT 2019 年度台劇票選第 1（514 票）、2020 PTT 經典台劇第 1、LINE 2025 十大台劇 #3（II）（fans 檔）。落差只在評論內部：關鍵評論網兩篇 2019 劇評批評後半，跟獎項和觀眾一面倒的好評不同調。II 在台灣評論是「頂天立作」，MDL 使用者分數卻只有 7.9（30 人，搜尋摘要，不收）。

## 2. 人選之人－造浪者（Netflix／公視＋大慕影藝，2023；英文 Wave Makers）

1. **Metacritic**：沒有搜到頁面（網域限定搜尋「Wave Makers」只出現遊戲與音樂，snippet）。
2. **豆瓣**：**沒有分數**。三立新聞網報導本劇在豆瓣「已經看不到」，推測和選舉、政治題材有關（https://www.setn.com/news/1288595 ，snippet）。The News Lens International〈Taiwanese Election Drama Is a Subversive Hit in China〉（https://international.thenewslens.com/article/186099 ，snippet）談它在中國中產階級之間私下流傳。
3. **英文評論**：
   - South China Morning Post〈Netflix drama review: Wave Makers…〉https://www.scmp.com/lifestyle/entertainment/article/3218237/netflix-drama-review-wave-makers-taiwanese-election-drama-world-between-us-director-engaging-watch （snippet；**作者沒有確認**：維基百科摘要說是 James Marsh，SCMP 的搜尋結果沒顯示作者；日期依文章編號推測是 2023-04／05，未確認）。摘要顯示傾向：推（4/5），說它「值得一看」，但為了戲劇效果把敏感議題簡化。**注意**：SCMP 不在原清單。
   - Foreign Policy，2023-08-12，https://foreignpolicy.com/2023/08/12/wave-makers-netflix-taiwan-metoo-sexual-harassment-dpp-china/ （snippet；作者未知；主題是本劇和台灣 #MeToo 的關係，偏評析而不是劇評）。摘要顯示傾向：有保留，說它被比作台灣版 *The West Wing*，卻沒有那種機智對白。
   - 備用（清單外）：nomanisanis.land（Brian Hioe）https://nomanisanis.land/wave-makers-review/ （該作者已用滿 3 部，不用）；The Envoy https://theenvoyweb.com/reviews/wave-makers-2023-review-brilliant/ ；Ready Steady Cut。
   - 清單內只有 **The Economist 2023 年度最佳影集**上榜（awards 檔，榜單不是評論）。
4. **中文評論（台灣）**（全部 snippet）：
   - 獨立評論，呂文慧〈《人選之人－造浪者》：自然如日常呼吸，又熱血得剛剛好的政治幕僚職人劇〉https://opinion.cw.com.tw/blog/profile/423/article/13587 （推）。
   - 關鍵評論網〈對白不尷尬媲美鄉土劇，可惜架空的設定扁平化政治複雜度〉https://www.thenewslens.com/article/185264 （推，有保留）；〈「中國因素」卻被刻意隱形了〉https://www.thenewslens.com/article/184901 （有保留）；〈擺脫台劇不協調演技與脫節台詞〉https://www.thenewslens.com/article/184874 （推）。作者都未知。
   - 電影神搜〈不只是幕僚職人劇，也是台灣女生困境的一頁縮影〉https://news.agentm.tw/254819/ 。
   - 500輯，雀雀〈寫實入骨碰觸政治社會議題〉https://500times.udn.com/wtimes/story/120840/7130155 。
   - 風傳媒 lifestyle 三篇（4787483〈過譽？〉、4785058、4796002）看起來是網友評價整理或生活風格稿，先不當評論。
   - 年度榜：關鍵評論網 徐佑德〈2023年度五大最佳＆五大失望台劇〉列第 1（awards 檔）。
5. **分歧**：**評審與評論都高，豆瓣缺席，PTT 冷淡**。IMDb 8.2（1.7K）、Netflix 2023 上半年台灣 820 萬小時（台灣 #2）、Google 2023 #6、DailyView 2023 #1（ratings 檔）；金鐘迷你劇集獎 2023、AACA 2023 台灣最佳劇集、Economist 2023 年度榜、TNL 2023 第 1（awards 檔）；LINE TODAY 2023 網友最愛 #3、Netflix 台灣週榜 #1，但 **PTT 板上幾乎沒有推薦推文**（fans 檔）。英文評論裡反覆出現的批評是「迴避中國」，台灣評論也有一篇談這件事（184901）。

## 3. 化外之醫（公視／中華電信／瀚草，2025；英文 The Outlaw Doctor）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：**沒有找到任何英文署名評論**，清單內外都沒有。只有 Focus Taiwan 的獲獎新聞（Global OTT Awards，2025-08-25，https://focustaiwan.tw/culture/202508250009 ；金鐘 2025，snippet）與 MyDramaList 使用者評論（不收）。
4. **中文評論（台灣）**（全部 snippet）：
   - 電影神搜〈【開箱】《化外之醫》：張鈞甯披白袍！寫實扣人心弦的醫療移工新品種台劇〉https://news.agentm.tw/329618/ （開箱，大概只評前幾集）。
   - 關鍵評論網〈越南影帝連炳發在《化外之醫》飾演的范文寧，代表台灣影視作品的新住民形象進入新的階段〉https://www.thenewslens.com/article/260130 （評析，作者未知）。
   - 獨立評論，米果〈一個人的金鐘獎：《影后》、《聽海湧》、《星空下的黑潮島嶼》以及《化外之醫》〉https://opinion.cw.com.tw/blog/profile/57/article/16706 （綜論，不是單篇劇評）。
   - 非評論：獨立評論〈獨評真人圖書館〉湯昇榮訪談；關鍵評論網〈推薦序〉（出版社書序）；VERSE 連炳發專訪；噓！星聞（stars.udn.com/star/story/10091/…）新聞；風傳媒 lifestyle〈網封醫療劇天花板…卻揪2敗筆掀兩極評價〉（網友整理）。
5. **分歧**：**評審與 KOL 榜單一致，英文媒體完全缺席**。IMDb 7.5（517）、Google 2025 #9、DailyView 2025 #10（ratings 檔）；金鐘 2025 戲劇節目獎入圍、連炳發得男主角獎、GOTT 2025 最佳亞洲內容、今敏木木 2025 劇評人榜 #6、LINE 2025 十大台劇 #5（awards 檔）；Hami Video 年度榜（fans 檔）。風傳媒的網友整理提到「2 敗筆」與兩極評價，搜尋摘要顯示批評集中在後段與男主角成長太慢（snippet，未讀）。

## 4. 茶金（公視／瀚草，2021；英文 Gold Leaf）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**8.4**。BEAUTY美人圈〈公視台劇豆瓣評分 TOP10〉列「《茶金》8.4」（https://www.beauty321.com/amp/post/61322 ，snippet；美妝網站排行清單，日期未知）。
3. **英文評論**：nomanisanis.land，Brian Hioe，〈Gold Leaf Succeeds Where SEQALU and Island Nation Did Not〉https://nomanisanis.land/gold-leaf-review/ （snippet；日期未知；**清單外**，Hioe 的個人網站，他也是 New Bloom 創刊編輯）。摘要顯示傾向：推，說它的主線與支線、主角與配角都平衡得好。
   - 另有 PTS World（公視國際部）在 Medium 的〈GBA Race: Gold Leaf is the uplifting warmth among Taiwan dramas | Opinion〉（snippet；公視自家帳號，帶宣傳性質，不算獨立評論）。
   - 清單內只有 Focus Taiwan 金鐘入圍新聞（2022-09-07，snippet）。
4. **中文評論（台灣）**（全部 snippet）：
   - 關鍵評論網〈【劇評】《茶金》：隱晦處理黨國陰影，台灣影視圈的「多力多滋人文主義」可惜了一齣好劇〉https://www.thenewslens.com/article/160894/fullpage （作者未知；摘要顯示傾向：有保留，肯定製作，批評把黨國決策推給美方）。
   - 娛樂有評，雀雀〈炎上「茶金」？解析「4萬元換1元」情節的多重指涉性〉https://stars.udn.com/star/story/10093/5917204 。
   - 關鍵評論網〈「四萬換一元」爭議為什麼不能輕輕放下？因為這不是史觀差異，而是徹頭徹尾的造假〉https://www.thenewslens.com/article/159365 （爭議評論，不是全劇劇評）；風傳媒，馮賢賢（前公視總經理）投書 https://www.storm.mg/article/4065053 （為劇組辯護）。
   - 鏡週刊兩篇（20211123edi014、edi030）是爭議新聞，不是評論。
   - 年度榜：500輯 鄭秉泓 2022 列為三部關鍵台劇之一（awards 檔，read）。
5. **分歧**：**作品評價高，被「四萬換一元」史實爭議蓋過**。Google 2022 #9（ratings 檔）；金鐘 2022 入圍 16 項（最多），只拿下女配角與剪輯（Focus Taiwan，snippet），戲劇節目獎輸給斯卡羅（awards 檔）；LINE TODAY 2021 最推薦台劇 #4、Netflix 台灣週榜 #2、PTT 推文 5 則（1 則「看不下去」）（fans 檔）。公視與劇組為史實錯誤道歉；英文與台灣評論都肯定它的完成度，但台灣討論的重心是史實。

## 5. 聽海湧（公視／看不見電影，2024；英文 Three Tears in Borneo）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：**清單內媒體沒有找到署名劇評。**
   - Taiwan Gazette，2026-02-15，〈"Who Doesn't Want to Be Good in War?" — Three Tears in Borneo Revisits Taiwan's WWII War Crimes Trials〉https://www.taiwangazette.org/news/2026/2/15/who-doesnt-want-to-be-good-in-war-three-tears-in-borneo-revisits-taiwans-wwii-war-crimes-trials （snippet；作者未知；**清單外**；偏歷史評析）。
   - Lingua Sinica〈Televising Taiwan's Painful Past〉https://linguasinica.substack.com/p/televising-taiwans-painful-past （snippet；作者、日期未知；**清單外**，China Media Project 旗下 Substack）。
   - Focus Taiwan 只有圖片新聞（Series Mania 2024、展覽）。
4. **中文評論（台灣）**（全部 snippet）：
   - 關鍵評論網〈【劇評】公視《聽海湧》1－2集：在「台籍日本兵」的嚴肅題材下，〈黑鳶〉〈赤陽〉做到了什麼？〉https://www.thenewslens.com/article/206552 （只評首 2 集，看網址推測是 2024-03 Series Mania 前後的首映評）。
   - 電影神搜〈【劇評】《聽海湧》：遠在天邊、近在眼前的複雜台灣身分認同問題〉https://news.agentm.tw/300740/ 。
   - 娛樂有評，雀雀〈「聽海湧」情感煽動力剽悍、演員表現是最大看點〉https://stars.udn.com/star/story/10093/9031978 。
   - 反方：風傳媒〈點教育〉〈《聽海湧》不是歷史，而是帶有杜撰編造的虛構作品〉https://www.storm.mg/article/5265829 （史實批評；作者未知）。
   - 獨立評論投書，蔡如音〈從媒介看《由島至島》與《聽海湧》〉https://opinion.cw.com.tw/blog/profile/52/article/16337 。
   - 非評論：關鍵評論網導演專訪、公視董事長胡元輝談爭議。
5. **分歧**：**評審與劇評人一致叫好，史學界有爭議**。DailyView 2024 #7（ratings 檔）；金鐘 2025 迷你劇集獎、Series Mania 2024 國際全景單元入選、LINE 2024 十大追劇榜 #3（awards 檔）；LINE 2024 台劇年度榜 #2、PTT 推文「很讚」、遠見 2024 #6（fans 檔）。劇中羅進福領事的設定被批評影射並汙名化真實的卓還來領事，公視內部研究報告也談到它和史學家觀點的衝突（snippet）。

## 6. 斯卡羅（公視／台北創造，2021；英文 Seqalu: Formosa 1867）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：nomanisanis.land，Brian Hioe，〈A Competent but Problematic Adaptation〉https://nomanisanis.land/seqalu-review/ （snippet；日期未知；**只評前兩集**；**清單外**）。摘要顯示傾向：有保留，說它把當代政治投射到 19 世紀台灣，處理得有問題。
   - 清單內：Taipei Times 社論（2021-09-04，https://taipeitimes.com/News/editorials/archives/2021/09/04/2003763755 ，談國民黨批評本劇美化李仙得、原劇名「傀儡花」改名，**社論不是劇評**）；Taipei Times 雙語新聞〈smashes PTS debut record〉（2021-08-25）、金鐘新聞（2022-10-24），都是 snippet。
4. **中文評論（台灣）**（全部 snippet）：
   - 反方：關鍵評論網〈【劇評】《斯卡羅》：敘事支離破碎、剪輯混亂失焦、劇情比重失衡，成就一部有正面意義的爛劇〉https://www.thenewslens.com/article/156782 ；風傳媒〈魏玓觀點：失敗的史詩與觀賞的痛苦─《斯卡羅》啟示錄〉https://www.storm.mg/article/4104217 （魏玓是陽明交大傳播學者）。
   - 正方：關鍵評論網〈激起更多人認識本土的熱情，已寫下台灣歷史劇的新頁〉https://www.thenewslens.com/article/155422 ；電影神搜〈【劇評】情理中、意料外？論《斯卡羅》落幕後的那些完美與不完美〉https://news.agentm.tw/194221/ （評全劇）。
   - 其他：娛樂有評，雀雀〈縫合抑或是撕裂台灣歷史？〉https://stars.udn.com/star/story/10093/5685308 ；獨立評論，米果〈為歷史引路的《斯卡羅》效應〉https://opinion.cw.com.tw/blog/profile/57/article/11310 ；風傳媒觀點投書〈斯卡羅，是在寫誰的歷史？！〉https://www.storm.mg/article/3929864 。
   - 建議正文正反各取一篇：魏玓（反）＋電影神搜 194221（正）。
5. **分歧**：**15 部裡評論分歧最大的一部**。首播創公視 21 年來戲劇首播紀錄（Taipei Times／Taiwan News，snippet）、Google 2021 快速竄升戲劇 #10（ratings 檔）；金鐘 2022 戲劇節目獎（awards 檔），但同年入圍數輸給茶金；LINE TODAY 2021 只排 #8（fans 檔）。劇評兩極：關鍵評論網與魏玓稱它「爛劇」「失敗的史詩」，金鐘卻頒給它最高獎；觀眾則抱怨角色長得像、劇情難懂、字幕太小（Taipei Times，snippet）。

## 7. 星空下的黑潮島嶼（客家電視台／中華電信，2025；英文 Black Tide Island）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：**沒有找到任何英文署名評論**。只有 Taiwan News 的開拍與首映新聞（snippet）與 ContentAsia 產業新聞。
4. **中文評論（台灣）**（全部 snippet）：
   - 報導者〈機智醫生的綠島白恐生活：《星空下的黑潮島嶼》怎麼衡量歷史重量與戲劇張力〉https://www.twreporter.org/a/black-tide-island （作者未知）。
   - 反方：關鍵評論網〈串流〉專欄〈旗艦台劇《星空下的黑潮島嶼》：白色恐怖該怎麼拍？時代劇為何逐漸失去與當代觀眾的連結？〉https://www.thenewslens.com/column/streaming/251386 （作者未知；摘要顯示看完前四集，傾向失望，批評支線太多、仍是悲情控訴）。
   - 獨立評論，米果〈戲劇遞給觀眾的歷史入場券〉https://opinion.cw.com.tw/blog/profile/57/article/15957 （推）。
5. **分歧**：**KOL 與劇評人榜單第 1，關鍵評論網專欄失望**。金鐘 2025 迷你劇集獎入圍（技術獎大贏）、AACA 2025 最佳攝影與最佳視覺特效、今敏木木 2025 劇評人榜 #2、LINE 2025 十大台劇 #1（awards 檔）；Hami／MOD 上半年 TOP 10、PTT「大推」（fans 檔）；ratings 檔沒有收視或搜尋數據。英文媒體零評論，觀眾數據也薄，口碑主要來自劇評人。

## 8. 做工的人（大慕影藝／凱擘／台灣大哥大／HBO Asia，2020；英文 Workers）

1. **Metacritic**：沒有搜到頁面（snippet；片名太常見，結果都是 Miracle Workers 等）。
2. **豆瓣**：**8.8 或 9.0（說法不一）**。搜尋摘要說「一篇中文文章引述豆瓣 8.8」，對應的結果是澎湃新聞 https://www.thepaper.cn/newsDetail_forward_7699998 （snippet；分數是不是出自這篇沒確認；大陸媒體）；BEAUTY美人圈排行清單寫 9.0（snippet）。正文不要寫數字，除非補讀確認。
3. **英文評論**：**清單內媒體沒有找到。**
   - sinema.sg，2020-05-11，https://www.sinema.sg/2020/05/11/workers-review/ （snippet；作者未知；**清單外**，新加坡電影網站；看日期只評首集或前兩集）。摘要顯示傾向：推，說它輕鬆，同時寫出勞工的困境與希望。
   - Philippine Daily Inquirer〈'Workers' transcends mindless comedy〉https://entertainment.inquirer.net/374465/workers-transcends-mindless-comedy （snippet；作者、日期未知；**清單外**主流報紙）。
   - Taipei Times 2023-04-07 評的是**電影版**，作者說沒看過影集（snippet），不能用。
4. **中文評論（台灣）**（全部 snippet）：
   - 娛樂有評，馬欣〈《做工的人》描述中年的集體失落與被尋回〉https://stars.udn.com/star/story/10093/4615559 （500輯同文 https://500times.udn.com/wtimes/story/12672/4619483 ）。
   - 電影神搜〈【劇評】《做工的人》: 世上沒有真正的超級英雄，但他們就是真正的英雄〉https://news.agentm.tw/113906/ ；〈打開視野、補足想像〉https://news.agentm.tw/108518/ 。
   - 反方：關鍵評論網〈從意外的「兩百萬」來看，我對片中略顯拙劣的溫情感到失望〉https://www.thenewslens.com/article/137334 。
   - 報導者〈《做工的人》生猛現身：不為控訴，但笑著笑著就哭了〉https://www.twreporter.org/a/workers-tv-drama-series （可能是報導兼評論，要讀全文確認）。
   - 噓！星聞〈網評有雷〉、〈噓！要嗑好戲〉是網友反應整理或推薦短文，不算評論。
5. **分歧**：**零負評口碑、豆瓣高分，但只有 6 集、獎項只有一座**。Google 2020 快速竄升戲劇 TOP 10（ratings 檔）；金鐘 2021 迷你劇集獎（awards 檔）；PTT 推薦串常被列在「已看過」、Dcard 推薦（fans 檔）。唯一的明確反方是關鍵評論網 137334 批評結尾的溫情。

## 9. 天橋上的魔術師（公視／原子映象，2021；英文 The Magician on the Skywalk）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**8.7**。搜尋摘要說「豆瓣 8.7 高分」，來源是 TVBS 新聞或 BEAUTY美人圈（同一組結果：https://news.tvbs.com.tw/entertainment/2356675 、beauty321，snippet；沒能確認是哪一篇）。
3. **英文評論**：
   - **清單內**：The News Lens International〈The Magician on the Skywalk: A Magical Realist Lens on Taiwan〉https://international.thenewslens.com/article/146354 （snippet；作者、日期未知，看文章編號推測是 2021-02 播出時；inkl 有轉載）。摘要顯示傾向：推，談楊雅喆的電影感與 dolly zoom 運鏡。**還不能確定是署名劇評**，要讀全文確認作者。
   - nomanisanis.land，Brian Hioe，〈Review: The Magician on the Skywalk〉https://nomanisanis.land/magician-skywalk-review/ （snippet；**只評前兩集**；清單外）。摘要顯示傾向：批評，認為主角都是小學生，角色立不起來，執行笨拙。
   - Focus Taiwan 首播與金鐘新聞（2021-02-19、2021-10-02，snippet）；Taiwan Post New Wave（英國）有導演 Q&A，不是評論。
4. **中文評論（台灣）**（全部 snippet）：
   - 鏡週刊〈【劇評】《天橋上的魔術師》 以眾人之力鑄造出台灣影劇新海拔〉https://www.mirrormedia.mg/story/20210209cnt002/ （作者未知；看日期是首播前後）。
   - 鏡週刊〈【盧郁佳劇評】惡從何來？ 解碼《天橋上的魔術師》受害者的罪惡〉https://www.mirrormedia.mg/story/20210322web012/ （盧郁佳；摘要顯示傾向：有保留，質疑阿派線有頭無尾）。
   - 關鍵評論網〈EP.1、3短評〉https://www.thenewslens.com/article/146247 （只評第 1、3 集）。
   - VERSE〈楊雅喆影集導讀〉兩篇（https://www.verse.com.tw/article/ya_che_yang_series_taiwan 、/series_the_magician_on_the_skywalk），導讀兼評論。
   - 風傳媒 lifestyle〈影評／…全解析〉https://www.storm.mg/lifestyle/3424770 ，先當生活風格稿。
5. **分歧**：**金鐘大贏家，觀眾嫌悶**。金鐘 2021 戲劇節目獎（共 6 座，Focus Taiwan snippet）（awards 檔）；LINE TODAY 2021 #6、PTT 2022 成功台劇串推文 2 則（1 則看不下去）、PTT〈天橋上的魔術師為何不是神劇？〉18 推（fans 檔）；ratings 檔沒有收視或搜尋數據。英文評論也分歧：TNL International 推、Hioe 批評。

## 10. 牛車來去（公視／禾豐，2022–23；英文 Oxcart Trails，片名出自 MDL 與官方 FB 帳號，非官方片名清單）

1. **Metacritic**：**沒查**（WebFetch 被擋；片名不確定，沒做網域搜尋）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：**沒有找到任何英文署名評論**；MDL 頁面「沒有評論」（snippet）。
4. **中文評論（台灣）**：**沒有找到清單內媒體的評論。** 只找到：
   - 鏡週刊〈【娛樂透視】《牛車來去》打造40年代農村 台語劇講究氣口質感升級〉https://www.mirrormedia.mg/story/20230224insight001 與〈借腹生子換耕牛1〉（特稿，含導演訪談，非評論）。
   - 電影神搜〈老公夢裡想「阿春」安心亞……〉https://news.agentm.tw/249580/ （看標題是劇情介紹或導流文，**不算評論**，要讀文末確認是否合作稿）。
   - 噓！星聞、鏡週刊其餘都是新聞或花絮；鏡週刊「2023 最催淚的生活時代劇」是宣傳用語。
5. **分歧**：**收視強、評論圈沉默**。Google 2023 快速竄升 #10、DailyView 2023 #3（ratings 檔）；金鐘 2023 戲劇節目獎入圍（awards 檔）；LINE TODAY 2023 網友最愛 #8（fans 檔）；結局收視破 3（鏡週刊新聞，snippet）。30 集的台語時代生活劇，觀眾買單，但評論圈和英文圈都沒有討論。

## 11. 一把青（公視／台北創造，2015；英文 A Touch of Green）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**9.2**。BEAUTY美人圈〈近十年豆瓣評分年冠台劇〉列為 2016 年冠軍、9.2（https://www.beauty321.com/post/65546 ，snippet；另一篇說曾經 9.3）。
3. **英文評論**：**沒有找到任何英文署名評論**；只有 MDL、Soompi 論壇的使用者評論（不收）。
4. **中文評論（台灣）**（全部 snippet）：
   - 獨立評論，魏宏晉〈一把青──當靈魂已成往事〉https://opinion.cw.com.tw/blog/profile/359/article/4917 。
   - 關鍵評論網〈是「時代劇」而非「歷史劇」：關於現實中的一把青〉https://www.thenewslens.com/article/29115 （史實考據角度）。
   - 風傳媒，胡又天專欄〈煽情而又疏離的《一把青》主題曲〉https://www.storm.mg/lifestyle/76806 （只評主題曲，不是劇評）。
   - 風傳媒 lifestyle〈為何能奪6座金鐘？〉（78125）、〈11年後才懂，這部台劇後勁為何這麼強〉（11150035，2026 年回顧文）的性質要讀全文確認；鏡週刊〈絕處逢生的資金戰役〉是製作特稿。
5. **分歧**：**獎項與豆瓣極高，當年收視不佳**。IMDb 8.4（509）（ratings 檔）；金鐘 2016 戲劇節目獎（共 6 座）（awards 檔）；PTT 經典台劇榜與 Dcard 推薦（fans 檔）。有文章說它播出時的收視與受歡迎程度「或許不好」（風傳媒，snippet），是 15 部裡「口碑靠時間累積」的例子。

## 12. 監所男子囚生記（壹壹影業，2025；英文 Oops! I'm in Jail）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**沒找到媒體引述的分數**；BEAUTY美人圈 2025 台劇 IMDb 排行列 7.7（snippet，不是豆瓣）。
3. **英文評論**：**沒有找到任何英文署名評論**；MDL 7.7（211 人）與使用者評論（不收）。
4. **中文評論（台灣）**：
   - 500輯，雀雀〈「監所男子囚生記」、「陽光女子合唱團」：生命之苦 以唱跳解憂〉https://500times.udn.com/wtimes/story/120840/9285053 （snippet；和電影並談，不是單篇劇評）。**只有這一篇，作者是雀雀。**
   - 鏡週刊 5 篇、噓！星聞 4 篇都是新聞、花絮、宣傳（例：〈黑暗真相掀熱議〉是網友反應新聞）。
5. **分歧**：**劇評人榜單看好，評論圈只有一篇**。金鐘 2026 入圍 11 項、今敏木木 2025 劇評人榜 #5（awards 檔）；MyVideo 2025 戲劇榜前十、PTT 推文 2 則「節奏笑點感人都有」（fans 檔）；ratings 檔沒有數據。MDL 長評說它「不太平均」、看到第 10 集棄劇（snippet，不收）。

## 13. 人生清理員（果陀娛樂，2024；英文 The Cleaner）

1. **Metacritic**：**沒查**（片名太常見）。**注意**：一個英文搜尋摘要說它在 Metacritic 有「41 分」，出處是二手聚合站，幾乎可以確定是把另一部 *The Cleaner*（英國劇集）混在一起，**不要使用**。
2. **豆瓣**：**7.6**。BEAUTY美人圈〈2024台劇豆瓣評分TOP10〉列「《人生清理員》7.6」（https://www.beauty321.com/post/65315 ，snippet）。
3. **英文評論**：**沒有找到任何英文署名評論**；MDL 7.8（17 人）（不收）。
4. **中文評論（台灣）**（全部 snippet）：
   - 電影神搜〈《人生清理員影集版》 開箱劇評：驚喜的優秀製作水準，自然且舒服的戲感〉https://news.agentm.tw/301888/ （開箱，摘要說看到第 4 集）。
   - 獨立評論，潘怡豪〈如果孤獨死是我們共同的未來：《人生清理員》直觸你不敢正視的社會現實〉https://opinion.cw.com.tw/blog/profile/385/article/15249 。
   - 娛樂有評，雀雀〈台劇「人生清理員」具體描繪正港台灣人情味價值〉https://stars.udn.com/star/story/10093/8331820 。
   - 鏡週刊〈娛樂透視〉特稿、關鍵評論網開播介紹兩篇（241453、241463）都不是評論。
5. **分歧**：**評論一致正面，豆瓣中等**。金鐘 2025 迷你劇集獎入圍（awards 檔）；LINE 2024 十大台劇 #5、遠見 2024 最紅台劇 #3（fans 檔）；ratings 檔沒有數據。豆瓣 7.6 在 2024 台劇裡屬於中段，台灣評論與 LINE、遠見的排名都更高。

## 14. 華麗計程車行（華視／巧克／LINE TV，2024；英文 A Wonderful Journey，對應無來源，見 awards 檔 †）

1. **Metacritic**：**沒查**（片名太常見）。
2. **豆瓣**：**7.3**。BEAUTY美人圈〈2024台劇豆瓣評分TOP10〉列「TOP8：《華麗計程車行》7.3」（https://www.beauty321.com/post/65315 ，snippet）。
3. **英文評論**：**沒有找到任何英文署名評論。**
4. **中文評論（台灣）**（全部 snippet）：
   - 電影神搜〈【開箱劇評】《華麗計程車行》：挫折就像是地震……〉https://news.agentm.tw/274787/ （摘要說只評前三集，傾向批評：旁白太多、「食材豐富、味道寡淡」）。
   - 娛樂有評，雀雀〈郭子乾、游安順在「華麗計程車行」與人生角色相遇〉https://stars.udn.com/star/story/10093/7971071 （推）。
   - 關鍵評論網〈推薦四部話題台劇〉https://www.thenewslens.com/article/199929 （推薦文，多部合評）。
   - 風傳媒 lifestyle〈無雷影評／…為何爆紅？3大必看亮點〉（5041715）先當導流稿；鏡週刊是收視新聞。
5. **分歧**：**前期劇評保留，後期觀眾與榜單接受**。DailyView 2024 #8（ratings 檔）；金鐘 2024 戲劇節目獎入圍、AACA 2024 最佳串流原創（awards 檔）；LINE 2024 十大台劇 #9、金鐘人氣票選期中 #9（fans 檔）；結局收視連續 9 週同時段無線台第一（iqilin.com，單一來源，snippet）。電影神搜的開箱只看前三集就給負評，跟後來的收視與觀眾口碑不同調。

## 15. 村裡來了個暴走女外科（公視／十三月，2022；英文 Mad Doctor）

1. **Metacritic**：沒有搜到頁面（snippet）。
2. **豆瓣**：**沒找到分數**。BEAUTY美人圈〈公視台劇豆瓣評分TOP10〉說它排第 7，但摘要沒有給分數（snippet）。
3. **英文評論**：**沒有找到任何英文署名評論**；MDL 約 7.5（約 180 人）（不收）。
4. **中文評論（台灣）**：
   - 娛樂有評，雀雀〈《村裡來了個暴走女外科》遠看是喜劇，但你可以再靠近一點〉https://stars.udn.com/star/story/10093/6378890 （500輯同文改題〈不只是喜劇，也是拍給台灣醫護的一封情書〉https://500times.udn.com/wtimes/story/120840/6378890 ）。snippet；**只有這一篇，作者是雀雀。**
   - 鏡週刊〈【娛樂透視】《暴走女外科》職人精神 喜劇包裝醫療議題拓收視〉https://www.mirrormedia.mg/story/20220519insight003 （特稿，非評論）；Marie Claire、BEAUTY美人圈、商周、遠見的文章（搜尋結果出現，未限定網域）看標題多是介紹或懶人包。
5. **分歧**：**觀眾票選第 1、金鐘大贏，評論圈幾乎只有一篇**。Google 2022 快速竄升 #5（ratings 檔）；金鐘 2023 戲劇節目獎，與模仿犯並列 4 座最多（關鍵評論網新聞，snippet；awards 檔）；LINE TODAY 2022 年度台劇期中 #1（14.6%）（fans 檔）。評審、觀眾一致，缺的是評論。

---

## toolDegradation

- **MCP 全部斷線**：Groundlane、Exa、Tavily、jina、firecrawl、linkup 都回 502（`CLIENT_HTTP_NOT_IMPLEMENTED`），整個 session 都不能用。
- **Groundlane 直接 HTTP**：沒試成。`WebFetch` 只能發 GET，不能 POST 到 `groundlane.vincent-xu-work.workers.dev/mcp`；終端機 `curl` 依指示不用（查代理狀態的 curl 也被權限分類器拒絕）。
- **Keenable／You.com keyless**：沒試。兩者都需要 `WebFetch` 或 curl，而 `WebFetch` 的網路被擋。
- **內建 `WebFetch`**：試了 `www.metacritic.com`、`www.slashfilm.com`，都回 `getaddrinfo ENOTFOUND`（網域不在環境的 Allowed domains）。工具提示說第二個網域也失敗就停，所以沒再試其他網域。要讀全文，需要把 metacritic.com、slashfilm.com 等網域加進環境白名單，或等 MCP 恢復。
- **內建 `WebSearch`**：可用，本檔全部資料來自它（約 50 次查詢，含 `allowed_domains` 網域限定）。限制：只回標題、網址與模型寫的摘要，所以全部只到 snippet，摘要句子不當原文引述。
- 沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com。

## 待補與注意

- **最優先**：等網路工具恢復後逐條補讀，把 snippet 升級成 read／partial，補上作者、日期、原文引述，並確認首集評還是全季評。建議先讀：SCMP 與 Foreign Policy（人選之人）、TNL International 146354（天橋，清單內唯一可能的英文署名評論）、Hioe 三篇、Taiwan Gazette（聽海湧），和每部各一篇台灣評論（優先非雀雀、非米果）。
- Metacritic 只做了 `WebSearch` 網域搜尋，不等於站內搜尋查證過；牛車來去、人生清理員、華麗計程車行沒查。正文寫「沒有 Metacritic 頁面」前要補站內搜尋。
- 豆瓣分數 6 筆來自 BEAUTY美人圈（美妝網站排行清單），1 筆來自關鍵評論網 2019 新聞，做工的人 8.8／9.0 互相矛盾。正文若要引用，建議寫成「據台灣媒體整理」並註明時間點，或乾脆不寫。
- 人選之人在豆瓣「已經看不到」（三立新聞），這本身就是可以寫進正文的事實，補讀確認後可用。
- 人生清理員「Metacritic 41 分」是其他同名作品的資料，不要用。
- 英文片名：牛車來去 Oxcart Trails、人生清理員 The Cleaner、暴走女外科 Mad Doctor、做工的人 Workers 都來自 MDL 與搜尋結果，沒有公視官方英文頁面確認。
- 監所男子囚生記、暴走女外科的台灣評論只有雀雀一篇；若正文要求每部至少一位不同作者，這兩部要再找（例如 PTS 劇夠、方格子專欄，但那些不在清單內）。
