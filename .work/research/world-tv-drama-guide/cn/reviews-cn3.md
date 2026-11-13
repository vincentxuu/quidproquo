# CN3 評價資料表：陸劇｜都市愛情、家庭與時代 21 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-13。片單來自 `post-cn3-shows.txt`（大陸原名｜台灣譯名）。IMDb／MDL／豆瓣年度榜／雲合／燈塔／貓眼沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、台灣 PTT／LINE TODAY／DailyView／Netflix 台灣週榜／Hami／myVideo 沿用 `candidates-fans-taiwan.md`，這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。早春晴朗已在 `reviews-cn2.md` 第 15 條做過（2026-11-12），本表沿用並註明。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | 站內搜尋 `metacritic.com/search/<詞>/?category=1`，用正式英文片名逐部查（the first frost、love's ambition、hidden love、when i fly towards you、amidst a snowstorm of love、the story of rose、a better life、me and my family、flight to you、sniper butterfly、the early spring、go ahead、blossoms shanghai、northward、meet yourself、romance in the alley、this thriving land、a lifelong journey、to the wonder、legend of the magnate、uncle） | Groundlane `web_extract`（render=never；前幾部抓全部 `/tv/` 連結，後面改用 pattern 只抓含片名關鍵字的 `/tv/` slug） | 21/21 read。**只有繁花有頁面**：`/tv/blossoms-shanghai/`，Metascore **77**（6 篇：5 正評、1 中評），User score 6.7，以 2025-11-24 Criterion Channel 美國上架為首播日。其餘 20 部沒有頁面。搜尋頁固定出現的站方推薦（12-12-12、The Good Daughter、The Body、Black Doves S2 等）不算結果 |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；豆瓣 subject 頁沒有讀，沒有繞過 sec.douban.com | Groundlane `web_search`；ratings 檔已讀過的年度榜新聞轉載 | 20/21 有媒體或準媒體引述的分數。來源分三層：大陸新聞（騰訊新聞轉載燈塔榜、中國婦女報、新浪）；台灣媒體（風傳媒〈風生活〉排行清單、世界新聞網、聯合報系）；台灣美妝生活網站 beauty321／Beauty美人圈（Yahoo 奇摩轉載），標明「準媒體」。180天重啟計劃沒有找到具體數字 |
| 英文評論 | 署名評論，讀全文或大半 | Exa `web_search_exa`／`web_fetch_exa`（後段 401 失效）；Groundlane `web_search`／`web_fetch` | **清單內媒體只有繁花**（NYT、RogerEbert.com、IndieWire、Collider、Boston Globe，全部在 Metacritic 頁上）；Netflix 都市劇有 India Today 3 部（難哄、許我耀眼、偷偷藏不住）＋早春晴朗（cn2 沿用）、Gulf News 1 部（難哄）。清單外：The China Project（人世間）、The World of Chinese（小巷人家）、The Little Hawk（當我飛奔向你，高中校刊）與部落格。**找不到**：180天重啟計劃、北上、老舅 |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、500輯、天下獨立評論、風傳媒、鏡週刊、關鍵評論網、VERSE、Harper's BAZAAR、Vogue、udn 女子漾 | Groundlane `web_search`（domains 限定上列網域）＋`web_fetch`；獨立評論改用 Exa、jina | **清單內媒體署名評論 10 部**（繁花、人世間、難哄、玫瑰的故事、小巷人家、去有風的地方、生萬物、蠻好的人生、以家人之名、我的阿勒泰〔udn 女子漾，邊界〕）。另有 1 部只有網紅創作者文（許我耀眼）、1 部是風傳媒轉載方格子自媒體（偷偷藏不住）、3 部只有 udn 女子漾無署名或創作者短文（在暴雪時分、當我飛奔向你、狙擊蝴蝶）。**完全沒找到**：180天重啟計劃、向風而行、早春晴朗、北上、大生意人、老舅 |

標記說明：**read** = 工具讀到頁面內文；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段或一半，或只看到 Exa 搜尋結果裡的長摘要（highlights）；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> **英文評論的媒體使用次數**：清單內 NYT 1、RogerEbert.com 1、IndieWire 1、Collider 1、Boston Globe 1（都只有繁花）；India Today 3＋1（難哄、許我耀眼、偷偷藏不住；早春晴朗沿用 cn2，作者都是 Bhavna Agarwal，**作者高度集中**）；Gulf News 1（難哄，Lakshana N Palat）。清單外主流／專業刊物：The China Project 1（人世間，Brian Wu；該站 2024 年已停刊）、The World of Chinese 1（小巷人家，Venla Tang）、Bleeding Cool 1（繁花，Adi Tantimedh，附帶）。**清單外小站／部落格**：Chasing Dramas 3（去有風的地方、生萬物、大生意人；Karen and Cathy，到上限）、The Fangirl Verdict 2（在暴雪時分、狙擊蝴蝶；kfangurl）、The Odd Apple 1（玫瑰的故事，Elle Morie）、Cnovelholic 1（蠻好的人生，Iya Moyya）、cyn lynn 1（向風而行）、Guavarama 1（以家人之名）、Active Faults 1（我的阿勒泰，Substack，署名 Em）、The Little Hawk 1（當我飛奔向你，美國愛荷華市高中校刊，學生 Claire Hartwig）。
>
> **與 cn2 的差別**：這一篇的英文評論量比權謀古裝篇多，主因是 Netflix 全球上架的現偶劇（難哄、許我耀眼、偷偷藏不住、早春晴朗）在印度與中東英文媒體有固定劇評欄，以及繁花透過 Criterion Channel 在美國上架、被當成王家衛作品評。年代／現實題材（人世間、小巷人家、我的阿勒泰）英文圈多是「現象報導」（Sixth Tone、WSJ、Irish Times 談阿勒泰帶動新疆觀光），真正的評論只出現在中國觀察型刊物。
>
> **台灣中文評論作者集中**：**潘光中** 2 部當主評（生萬物、蠻好的人生）＋2 部副評（繁花〔電影神搜〕、以家人之名〔電影神搜〕）；**廖芳潔**（獨立評論〈主播台聽不到的聲音〉）2 部（玫瑰的故事、小巷人家；她在 cn2 也寫了漫長的季節）。其他作者各 1：李明軒（獨立評論特約，中山大學政經系教授，繁花）、麥若愚（娛樂有評，人世間）、雀雀（500輯〈質青評論〉，難哄）、王瑋（娛樂有評，去有風的地方）、海那Hannah（娛樂有評，以家人之名）、曾箏（udn 女子漾，我的阿勒泰）、柒默lisa（udn 女子漾創作者、2022 臺北十大網紅，許我耀眼）。udn 女子漾是聯合報系的「創作者」平台，文章多為部落客投稿，本表把它列為邊界來源，不算正式媒體劇評。所有讀到的文章都沒有「合作／贊助」標記；Harper's BAZAAR、udn 女子漾的陸劇文多掛「Netflix 線上看」「必追亮點」，屬介紹兼導流，正文不用。

---

## 1. 难哄｜難哄（優酷，2025-02；32 集；英文 The First Frost；Netflix 全球上架）

1. **Metacritic**：沒有頁面（「the first frost」只有 Murder in the First、A Touch of Frost 等，read）。
2. **豆瓣**：**開分 5.4，之後 5.5（約 12 萬人）**。Yahoo 奇摩（轉載 Beauty美人圈），曾心奕，2025-03-10，〈豆瓣高分陸劇Top 10推薦｜《難哄》評分掀熱議！〉：「《難哄》目前有約12萬筆評價，拿到5.5分」。https://tw.news.yahoo.com/%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86%E9%99%B8%E5%8A%87top-10%E6%8E%A8%E8%96%A6%EF%BD%9C%E3%80%8A%E9%9B%A3%E5%93%84%E3%80%8B%E8%A9%95%E5%88%86%E6%8E%80%E7%86%B1%E8%AD%B0%EF%BC%81%E3%80%8A180%E5%A4%A9%E9%87%8D%E5%95%9F%E8%A8%88%E5%8A%83%E3%80%8B%E5%8F%A3%E7%A2%91%E7%88%86%E6%A3%9A%E5%BF%85%E8%BF%BD-103651441.html （snippet；**準媒體**）。開分 5.4：騰訊新聞（rain 自媒體頻道），2025-03-03，〈白敬亭《难哄》赢了热度输了口碑，开分5.4〉，https://news.qq.com/rain/a/20250303A02MUB00 （snippet；**大陸自媒體**，文中稱「40%的低分来自未观看剧集的用户」，未查證）。
3. **英文評論**：
   - Gulf News，Lakshana N Palat，2025-06-15，〈The First Frost, C-Drama review: A profound tale of love and healing — one of the best romances in recent times〉。https://gulfnews.com/entertainment/the-first-frost-c-drama-rewind-a-breathtaking-tale-of-love-and-trauma-that-rewrites-the-rules-of-romance-1.500164071 （partial (Exa)：讀到後半與結論；**評全 32 集**，回顧型）。**注意**：Gulf News 不在原清單，是杜拜英文大報。
     - 摘要：她把本劇當成「創傷與療癒」的故事來讀，稱讚章若楠把溫以凡「壓抑情緒」演得細，白敬亭的桑延是「complete green flag」；結局的醫院告白細節精緻。立場：強推。
     - 原文：「It's a tale that sweeps you into the storm of trauma, healing, and a powerful love that die-hard romantics would seek.」
   - India Today，Bhavna Agarwal，2025-02-19，〈The First Frost review: Love, trauma, longing - new Chinese drama delivers it all〉。https://www.indiatoday.in/entertainment/ott/story/the-first-frost-review-love-trauma-longing-new-chinese-drama-delivers-it-all-2682428-2025-02-19 （partial (Exa)；**只評前 6 集**，給 3.5/5）。
     - 摘要：說它不是《偷偷藏不住》那種甜，而是「把你的心撕開」的遺憾與創傷；稱讚每集「女主視角開場、男主視角收尾」的雙 POV 結構與瞿友寧的構圖。立場：推。
     - 原文：「The First Frost is not an easy watch, but it's a deeply rewarding one.」
   - 另有 Mashable ME（Mamta Raut，2025-02-20，只評前 6 集，4/5）、Indiatimes（Shivani Negi，2025-02-22，評前 12 集）、OTTPlay（Shaheen Irani）（partial (Exa)，不採用）。
4. **中文評論（台灣）**：500輯〈質青評論〉，雀雀，2025-03-15，〈《難哄》：純愛劇進入「細節時代」 觸動更多觀眾的心〉。https://500times.udn.com/wtimes/story/120840/8608497 （read；完結後）
   - 摘要：她說劇情「講起來無聊」，卻因為精細捕捉角色心境變化的溫度細節而有悸動感；拿《不完美受害人》對照，認為本劇以輕盈方式處理性侵創傷、保留受害者尊嚴，是「高明的關懷力召喚」。缺點是集數：她認為最好的結局在第 22 集，硬撐到 32 集「戲很難唱下去」，原著外新增的配角線也填不滿。立場：推（保留後段）。
   - 原文：「劇情講起來無聊卻被「難哄」拍出滿滿悸動感，最大關鍵在於劇組精細捕捉到角色心境微妙變化時刻的溫度細節……從此宣告純愛劇該進入「細節時代」。」
   - 原文：「劇集被拓展到三十二集，戲很難唱下去。」
   - 上報〈白敬亭、章若楠《難哄》首播熱度奪冠 卻因「2選角敗筆」評價慘輸姐妹作〉（2025-02-19，snippet，新聞）；Harper's BAZAAR〈10大劇情差異〉（2025-03-13，snippet，介紹型，帶 Netflix 導流）。
5. **分歧**：**全片單中豆瓣與國際評分落差最大的現偶之一**。豆瓣 5.4–5.5 vs IMDb 8.4（5.1K）、MDL #14 8.8（47,537 人）；雲合 2025 上新劇 top20、微博 2025 年度大眾喜愛作品（ratings 檔）；LINE TODAY 2025 陸劇 #1、DailyView 2025 #1（89,454 筆）、MDL 使用者年度清單 #1、Dcard 米米 5/5、PTT kamenatsumi「完成度相當高」（fans 檔）。豆瓣 vs MDL 落差約 3.3 分。大陸自媒體把低分歸因於粉黑戰與「未看先評」；Yahoo 整理的大陸網友批評集中在「女主被騷擾次數過多、把女主改得太慘」，與雀雀「把創傷拍得輕盈」的正評正好是同一處的兩種讀法。

## 2. 许我耀眼｜許我耀眼（騰訊視頻／東方衛視，2025-09；32 集；英文 Love's Ambition；Netflix 上架）

1. **Metacritic**：沒有頁面（「love's ambition」只有 Ambitions，read）。
2. **豆瓣**：**6.5**。燈塔 2025 國產劇全網播放量 TOP10 新聞（騰訊新聞，2025-12-29）印出「#5 19.64亿（豆瓣 6.5）」（ratings 檔，read）。
3. **英文評論**：India Today，Bhavna Agarwal，2025-10-09，〈'Love's Ambition' review〉。https://www.indiatoday.in/entertainment/ott/story/loves-ambition-chinese-drama-zhao-lusi-romance-ambition-2800188-2025-10-09 （partial (Exa)；播出後段時刊出，未註明集數）。
   - 摘要：她說趙露思是全劇核心，脫離一貫的活潑角色、演出「strong yet vulnerable」的層次；陳偉霆「underwhelming」；劇本處理階級、野心與情感獨立比單純愛情有意思，但角色反應常寫歪。立場：推（有保留）。
   - 原文：「It's not a perfect love story, but it's one that lingers long after the episode ends.」
   - 原文：「William Chan, on the other hand, feels a bit underwhelming as the male lead.」
   - 另有 Mashable ME（Mamta Naik，2025-09-29，只評前 7 集）、The Odd Apple（Elle Morie，2025-10-30，「Fun but Flawed」）、The Fangirl Verdict（2026-03-02，「uneven watch」）（partial (Exa)，未採用）。
4. **中文評論（台灣）**：**沒有清單內媒體的署名評論**。最接近的是 udn 女子漾，柒默lisa，2026-02-14，〈《許我耀眼》劇評｜假面之下藏真心，這部都市劇夠真、夠痛、夠清醒〉。https://woman.udn.com/woman/story/123164/9330973 （read (jina)；完結後）。**注意**：女子漾是聯合報系創作者平台，作者自介「2022臺北十大網紅」，屬網紅心得文，不算正式劇評。
   - 摘要：她說這不是無瑕疵的劇，但不鼓吹「嫁入豪門即圓滿」；趙露思把自卑與倔強演得有層次，陳偉霆擺脫油膩霸總套路；後段節奏偏快、商戰線浮。立場：推。
   - 原文：「後期雖有節奏偏快、商戰線略浮的小瑕疵，但勝在不迴避缺點，不強行圓滿。」
   - Harper's BAZAAR〈趙露思《許我耀眼》好看嗎？〉（2025-09-28）、〈陳偉霆上演「追妻火葬場」〉（2025-10-07）（snippet，介紹型，帶 Netflix 導流）；udn 女子漾另一篇〈五大魅力〉（2025-10-07，snippet，介紹型）。
5. **分歧**：**台灣串流聲量高、豆瓣不及格邊緣**。豆瓣 6.5；雲合 2025 #3（熱播期集均 6328 萬）、燈塔 2025 #5、貓眼都市劇有效播放雙冠、騰訊 2025 熱度 #1（ratings 檔）；awards 檔只有新周刊 2025 年度熱劇（人氣型）；LINE TODAY 2025 陸劇 #3、DailyView 2025 #3、Netflix 台灣 2025-10-26 #2（7 週）、MDL 使用者年度清單 #7（fans 檔）。英文評論與台灣心得一致指向「前半精彩、後半變成追妻火葬場與商戰」，對陳偉霆的評價則分歧（India Today 嫌弱、柒默lisa 說擺脫油膩）。

## 3. 偷偷藏不住｜偷偷藏不住（優酷，2023-06；25 集；英文 Hidden Love；Netflix 上架）

1. **Metacritic**：沒有頁面（「hidden love」只有 Hidden Palms 及一串 Love 開頭節目，read）。
2. **豆瓣**：**6.7**。beauty321（台灣美妝生活網站），2025-03-11，〈10部「低於6分」熱門甜寵陸劇！〉：「《偷偷藏不住》評分有6.7呢！」https://www.beauty321.com/post/66586 （snippet；**準媒體**，作者未署名）。
3. **英文評論**：India Today，Bhavna Agarwal，2023-07-13，〈Why Chinese drama 'Hidden Love' should be on your binge-watch list this season〉。https://www.indiatoday.in/entertainment/ott/story/why-chinese-drama-hidden-love-should-be-on-your-binge-watch-list-this-season-2405778-2023-07-13 （partial (Exa)；播出結束一週後；**推薦型評析，不是標準劇評格式**）。
   - 摘要：她說劇集不急著建立暗戀線、用柔焦鏡頭捕捉細節，處理五歲年齡差的方式「gentle and intelligent」；並指出本劇在印度反應熱烈。立場：推。
   - 原文：「the sensitive approach to the story is what makes it a definite binge-watch.」
   - 另有 Celluloid（Kaiser Khan，2026-07-25，4/5，說後半靠家庭反對製造衝突、張力下降）、Cnovelholic（Iya Moyya，2023-07-10，9.3）（partial (Exa)，未採用；Cnovelholic 本表另用 1 次）。
4. **中文評論（台灣）**：風傳媒〈風生活〉轉載方格子 Vocus 文章，作者欄只標「方格子 Vocus」，2023-09-11（原文 2023-07 播出中），〈影評／Netflix《偷偷藏不住》劇情單純的甜寵劇為何爆紅？〉。https://www.storm.mg/lifestyle/4829065 （read；**寫於第 17 集上架前，只評前半**）。**注意**：**自媒體轉載**，不是風傳媒編輯部或簽約作者。
   - 摘要：作者自承不喜歡原著（「台詞真的油到一個不行」），認為原著沒把段嘉許對未成年桑稚的「邊界感」拿捏好；但電視劇刪改台詞、加鏡頭鋪墊轉折，陳哲遠用眼神做出邊界感，問題「明顯被改善非常多」。立場：推。
   - 原文：「一個成年人對未成年人說油膩的話本就多少有鼓勵犯罪的疑慮……然而在電視劇裡，這個問題就明顯被改善非常多。」
   - Harper's BAZAAR〈6大看點〉（2023-06-19）、〈25個甜蜜瞬間〉（2023-07-07）（snippet，介紹型）。
5. **分歧**：**MDL 前段班、豆瓣 6 分出頭，爭議都在年齡差**。豆瓣 6.7 vs MDL #4 9.0（97,375 人）、IMDb 8.6（9.8K）（ratings 檔）；南方都市報 NDY 2023 #10（awards 檔）；PTT 2023 最喜歡串約 32 推（fans 檔）。豆瓣 vs MDL 落差 2.3 分。中英文評論都主動處理「14 歲與 19 歲初識」的年齡差，結論都是「劇集處理得比原著好」，但英文部落格 DramaQueen（Substack）記錄了部分觀眾仍覺得不適（snippet）。

## 4. 当我飞奔向你｜當我飛奔向你（優酷，2023-06；24 集；英文 When I Fly Towards You；Netflix 上架）

1. **Metacritic**：沒有頁面（只有 Agatha Christie's Towards Zero、I'll Fly Away 等，read）。
2. **豆瓣**：**沒有找到新聞直接引述的豆瓣分數**。風傳媒〈風生活〉魏甫丞，2026-07-01，〈Netflix「口碑最強」甜寵陸劇TOP10〉列本劇第 1、「評價分數：8.0」，https://www.storm.mg/lifestyle/11146091 （snippet；排行清單，摘要沒寫明是豆瓣分數，**不要當豆瓣分數引用**）。
3. **英文評論**：The Little Hawk，Claire Hartwig（Assistant Culture Editor），2023-09-07，〈When I Fly Towards You Review〉。https://www.thelittlehawk.com/62229/culture/when-i-fly-towards-you-review/ （read (Exa)；評全劇）。**注意**：清單外，是美國愛荷華市 City High School 的學生校刊，作者是高中生。
   - 摘要：她喜歡從國中到成年的時間跨度與配角背景的完整度；唯一批評是張妙怡主演的校園劇設定都很像（都在 2012 年、都有末日恐慌那一集）。立場：強推（10/10）。
   - 原文：「When I Fly Towards You is a must watch for all hopeless romantics.」
   - 清單內與主流媒體都沒有找到；Netflix 上架但沒有 India Today、Decider 劇評。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只有 udn 女子漾〈【劇評】2023必追青春校園陸劇《當我飛奔向你》〉（2025-09-18，snippet，創作者文，作者未在摘要中出現）、風傳媒魏甫丞排行清單（見豆瓣欄，snippet）。
5. **分歧**：**國際粉絲極高、評論界缺席**。MDL #2 9.0（62,689 人）、IMDb 8.5（4.4K）（ratings 檔）；awards 檔沒有它；PTT 2023 最喜歡串約 34 推、Netflix 台灣 2023-08-27 #8（1 週）（fans 檔）。MDL 排名在 21 部中最高，但沒有任何主流媒體評論、豆瓣也沒有可靠引述——是「粉絲訊號單一來源」的典型，正文引用時要說清楚。

## 5. 在暴雪时分｜在暴雪時分（騰訊視頻／東方衛視，2024-02；30 集；英文 Amidst a Snowstorm of Love）

1. **Metacritic**：沒有頁面（pattern 抓不到任何含 snow／amidst 的 `/tv/` slug，read）。
2. **豆瓣**：**6.8**。beauty321，2024-02-29，〈吳磊主演陸劇評分榜TOP10！《在暴雪時分》6.8分〉。https://www.beauty321.com/post/60440 （snippet；**準媒體**；播出中）。
3. **英文評論**：The Fangirl Verdict，kfangurl，2024-06-30，〈Review: Amidst A Snowstorm Of Love [China]〉。https://thefangirlverdict.com/2024/06/30/review-amidst-a-snowstorm-of-love-china/ （partial (Exa)：讀到 Short Verdict 與 Final Verdict；評全 30 集）。**注意**：清單外部落格，本表用 2 次。
   - 摘要：她把本劇定位為「不急不徐的日常戀愛＋自我追尋＋撞球運動劇」，承認評價兩極，但只要能接受陸劇「日常戀愛」次類型就會喜歡；吳磊、趙今麥都好。立場：推。
   - 原文：「Low-key, pleasant and warm, provided you are able to tune in to Show's wavelength.」
   - 另有 Drama Slot（Drama Addict，2024-02-24）、Cnovelholic（2024-03-17，「I felt that this drama lacked something」）（partial (Exa)，未採用）。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只有 udn 女子漾〈閱劇｜吳磊、趙今麥甜甜的《在暴雪時分》〉（2024-02-04，snippet，創作者文，只看前幾集）、鏡週刊與噓！星聞的八大首播宣傳新聞（2024-11-21，snippet）。
5. **分歧**：**熱播與口碑兩極**。豆瓣 6.8；IMDb 7.9（2.0K）、雲合 2024 #19 11.9 億（ratings 檔）；新京報 2024 年度劇集（awards 檔）；PTT 2024 最喜歡串 5 推（fans 檔）。PTT 心得文（2024-02-25，snippet）有人說「暴雪是有史以來黑得最誇張的一次」，豆瓣短評則批吳磊演技「程式化」（snippet），粉黑戰訊號明顯；英文部落格也一致說「opinions are very divided」。

## 6. 玫瑰的故事｜玫瑰的故事（CCTV-8／騰訊視頻，2024-06；38 集；英文 The Story of Rose／The Tale of Rose）

1. **Metacritic**：沒有頁面（只有 The Name of the Rose 等，read）。
2. **豆瓣**：**開分 7.1，結局後 7.4**。Yahoo 奇摩（轉載 Beauty美人圈），Bella，2024-10-26，〈結局後「豆瓣評分上漲」2024好評陸劇Top10〉：「《玫瑰的故事》豆瓣開分就有7.1，後續也漲分來到7.4」。https://tw.news.yahoo.com/%E7%B5%90%E5%B1%80%E5%BE%8C%E3%80%8C%E8%B1%86%E7%93%A3%E8%A9%95%E5%88%86%E4%B8%8A%E6%BC%B2%E3%80%8D2024%E5%A5%BD%E8%A9%95%E9%99%B8%E5%8A%87top10%E3%80%8A%E7%8E%AB%E7%91%B0%E7%9A%84%E6%95%85%E4%BA%8B%E3%80%8B71%E6%BC%B2%E5%88%B074%EF%BC%8C%E5%86%A0%E8%BB%8D%E7%9C%9F%E6%98%AF%E7%B2%BE%E5%93%81%E5%8A%87-024510064.html （snippet；**準媒體**）。開分 7.1：新浪（2024-06-21，snippet，大陸自媒體）。
3. **英文評論**：The Odd Apple，Elle Morie，2025-12-02，〈Review: "The Tale of Rose" Is a Beautiful Drama〉。https://theoddapple.com/the-tale-of-rose/ （partial (Exa)：讀到前段與 Final Thoughts；評全劇）。**注意**：清單外小站。
   - 摘要：她原本不欣賞劉亦菲，看完改觀，說這是她近年最好的演出；萬茜的蘇更生「layered and gut-wrenching」；提醒本劇處理情緒操控與創傷，比較適合成熟觀眾。立場：強推（3 顆蘋果，Excellent）。
   - 原文：「Liu Yifei gave one of her best performances in recent years.」
   - 另有 The Fangirl Verdict（2024-08-25，「very solid and worthwhile」，但嫌弧線太多）、Chasing Dramas（前 13 集 7/10，說「too real」；本表 Chasing Dramas 已滿 3 次）（partial (Exa)，未採用）。清單內沒有找到。
4. **中文評論（台灣）**：獨立評論＠天下〈主播台聽不到的聲音〉，廖芳潔，2024-07-07，〈花落總有花開時：《玫瑰的故事》，做自己的鏗鏘玫瑰〉。https://opinion.cw.com.tw/blog/profile/517/article/15044 （read (jina)；完結後）。**注意**：作者本表用 2 次。
   - 摘要：她坦言開播前覺得是「漂亮女孩的成長流水帳」，看完後把重點放在觀眾對「戀愛腦」的過敏：她區分「戀愛腦」與「勇於愛人」，並把黃亦玫與蘇更生讀成現代女性的兩種面向。立場：推。
   - 原文：「說到底，《玫瑰的故事》重點從來不在戀愛，而是關於人生中會出現的所有選擇」
   - 電影神搜〈5 大推薦劇情亮點〉（2024-12-12，snippet，看點型）；udn 女子漾〈一部個人久久不敢點閱的戲劇〉（2024-07-11，snippet，創作者文，反面）。
5. **分歧**：**收視與獎項都有、豆瓣 7 分出頭，豆瓣長評兩極**。雲合 2024 #5 22.9 億、燈塔 2024 電視劇 #3、都市劇冠軍（ratings 檔）；白玉蘭 2025 提名、金鷹 2026 提名、首屆製作產業大會年度推優（awards 檔）；PTT 2024 最喜歡串僅 1 推、LINE TODAY 2024 點名（fans 檔）。豆瓣劇評頁有人直接說是「男性視角的現實主義和瑪麗蘇結合的失敗作品」（snippet），台灣觀眾端（PTT）聲量很低，與大陸收視落差明顯。

## 7. 蛮好的人生｜蠻好的人生（CCTV-8／優酷，2025-04；36 集；英文 A Better Life）

1. **Metacritic**：沒有頁面（只有 Better Call Saul、Friends with Better Lives 等，read）。
2. **豆瓣**：**6.4**。燈塔 2025 全網播放 TOP10 新聞（騰訊新聞，2025-12-29）：「#8 14.61亿（豆瓣 6.4）」（ratings 檔，read）。
3. **英文評論**：Cnovelholic，Iya Moyya，2025-05-19，〈A Better Life Drama Review〉。https://cnovelholic.com/drama-review/romance/a-better-life-drama-review/ （partial：Groundlane 讀到前段與劇情簡介，評語只讀到頁面描述與搜尋摘要；評全 36 集）。**注意**：清單外部落格。
   - 摘要：她說孫儷的演技撐起全劇，劇本好看；但胡曼黎做保險的手法有時不真實，她選擇不深究。立場：推。
   - 原文（頁面描述）：「A Better Life is a great drama that truly deserves praise and Sun Li's acting is what makes it shine.」
   - 原文（搜尋摘要）：「Hu Man Li's insurance policies sometimes seemed unrealistic.」
   - 另有 DramaKaffe（2025-05-05，snippet）。清單內沒有找到。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），潘光中，2025-05-10，〈孫儷大女主限時返場！「蠻好的人生」當人生猝不及防賞了你一耳光〉（同文另見 500輯〈質青評論〉2025-05-12）。https://stars.udn.com/star/story/10093/8729509 （read；播出期間）。**注意**：潘光中本表主評第 2 篇。
   - 摘要：他用「困境論」與「擬劇論」分析：開局就讓胡曼黎丈夫出軌、被陷害停牌；導演與編劇每集都製造幾次讓觀眾代入的情境。對網路批評角色「庸俗」，他反駁說胡曼黎本來就是白領女性的平均值。立場：推。
   - 原文：「相似的情境場景，導演和編劇每集都能來個好幾次，簡直是玩弄觀眾於股掌之間。」
   - 鏡週刊〈董子健《蠻好的人生》面癱惹議〉（snippet，新聞）；Harper's BAZAAR 金句整理、udn 女子漾 5 大原因（snippet，介紹型）。
5. **分歧**：**電視收視、獎項提名與豆瓣分數倒掛**。豆瓣 6.4；雲合 2025 #18 11 億、燈塔 2025 #8、微博 2025 年度優秀作品、CCTV-8 2.3%（ratings 檔）；白玉蘭 2026 提名、金鷹 2026 提名（awards 檔）；Netflix 台灣 2025-07-13 #6（6 週）、Hami 2025 戲劇 #6、PTT 推薦串 2（fans 檔）。台灣串流表現穩、評論正面，豆瓣低分主要指向男主角董子健（鏡週刊引述網友「面癱」）。

## 8. 180天重启计划｜180天重啟計劃（芒果TV／湖南衛視，2025-02；27 集；英文 Me and My Family）

1. **Metacritic**：沒有頁面（「me and my family」只有 Modern Family、Meet the Family 等，read）。
2. **豆瓣**：**沒有找到媒體引述的具體分數**。Yahoo 奇摩（曾心奕，2025-03-10，見第 1 條網址）把本劇列入「近期豆瓣高分陸劇 Top 10」、標題寫「口碑爆棚」（snippet，沒看到分數）。豆瓣 subject 頁片段提到本劇「播出成绩已经盖棺定论扑街」（使用者長評，snippet，不採用）。
3. **英文評論**：**沒有找到**。搜尋只得到 MyDramaList 頁與評論、Reddit r/CDrama 討論串、shushengbar 原著介紹（snippet）。英文片名有 Me and My Family／180 Days Paternity Plan 兩種，兩種都搜過。
4. **中文評論（台灣）**：**沒有找到**。只找到 MyVideo 官方部落格新聞稿（2025-03-04，snippet，**平台新聞稿**）、世界新聞網演員訪談（2025-02-25，snippet）。大陸媒體背景：中國日報網（2025-03-04，snippet）稱本劇「以轻喜外衣包裹尖锐议题」，屬收官宣傳稿。
5. **分歧**：**評審青睞、播放冷**。微博 2025 年度突破創新作品（ratings 檔）；南方周末 2025 年度劇集提名（awards 檔）；PTT 2025 最喜歡串 1、推薦串 1、jpeg 稱李漠是「都市劇的神」（fans 檔）。南方周末提名與 PTT 少數劇迷的強推，對上豆瓣使用者長評說的「扑街」，是本篇「小眾佳作」型的例子，但缺評論來源，正文只能寫成「獲南方周末提名」。

## 9. 向风而行｜向風而行（愛奇藝，2022-12～2023-01；英文 Flight to You）

1. **Metacritic**：沒有頁面（只有 The Flight Attendant、Flight of the Conchords 等，read）。
2. **豆瓣**：**6.9**。風傳媒〈風生活〉，2026-09-16，〈不只《蘭香如故》好看！譚松韻最強陸劇TOP10〉：「譚松韻最強陸劇推薦第3名：《向風而行》｜豆瓣評價：6.9分」。https://www.storm.mg/lifestyle/11164804 （snippet；排行清單；作者欄未出現在摘要）。
3. **英文評論**：cyn lynn（部落格，署名即站名），2022-12-30，〈Flight to You | Recap and Review〉。https://cyn-lynn.blogspot.com/2022/12/flight-to-you-recap-and-review.html （partial：Groundlane 讀到頁首評分，評論段只看到搜尋摘要；評全劇）。**注意**：清單外個人部落格。
   - 摘要：她說故事沒什麼特別，看是為了王凱與譚松韻；批評男主「九集都在否認」、「misogyny is a plot device」、兩人只當了一集情侶。頁首 First Impression 2.85/5，標籤 2/5。立場：不推。
   - 原文：「I don't think there's anything special about the story. I'm shamelessly in this for Wang Kai and Tan Song Yun.」
   - 原文：「Apologies if you enjoyed it. I really couldn't.」
   - 清單內沒有找到。
4. **中文評論（台灣）**：**沒有找到**。只有鏡週刊〈王凱穿機長制服迷死人〉（2023-01-11，snippet，新聞）、噓！星聞譚松韻訪談（2022-12-29，snippet）。風傳媒排行清單另提到「航空從業者對專業細節、人物職場行為提出批評」（snippet，轉述網友）。
5. **分歧**：**台灣串流平台排行高、評論冷**。雲合 2023 愛奇藝全網 top10（ratings 檔）；awards 檔沒有它；愛奇藝台灣站 2023 #9、myVideo 2023 戲劇 #2、PTT 2023 最喜歡串 7（fans 檔）。台灣 myVideo 年度第 2 名對上豆瓣 6.9 與唯一一篇英文部落格 2/5，落差主要在「看演員」與「看劇本」的觀眾分流。

## 10. 狙击蝴蝶｜狙擊蝴蝶（騰訊視頻，2025-12；英文 Sniper Butterfly；Netflix 上架）

1. **Metacritic**：沒有頁面（只有 Butterfly、Butterfly (2025)，read）。
2. **豆瓣**：**6.8**。世界新聞網（聯合報系北美），2025-12-25，〈新劇豆瓣評分榜TOP10出爐 「老舅」衝第二〉，轉引搜狐：「陳妍希、周柯宇主演「狙擊蝴蝶」同樣拿下6.8分」。https://www.worldjournal.com/wj/story/121617/9225208 （snippet）。
3. **英文評論**：The Fangirl Verdict，kfangurl，2026-04-06，〈Review: Sniper Butterfly [China]〉。https://thefangirlverdict.com/2026/04/06/review-sniper-butterfly-china/ （partial (Exa)：讀到 Short Verdict；評全劇）。**注意**：清單外部落格，本表第 2 次。
   - 摘要：她說開播前聲量低，但很早就被情感主線吸住；最後一段的敘事決定讓情感深度沒到位。立場：推。
   - 原文：「Not perfect, but a solidly good watch that I would still recommend.」
   - Netflix 上架但沒有找到 India Today、Decider、Collider 劇評。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只有 udn 女子漾〈不愛看愛情劇的我，迷上《狙擊蝴蝶》了！〉（2026-01-06，snippet，創作者文，摘要說「劇情雖然很普通，但好看的地方是有很多細膩的內心戲」）、Harper's BAZAAR〈7亮點〉（2025-12-10，snippet，介紹型，帶 Netflix 導流）、Vogue 美容文、風傳媒魏甫丞播放量新聞（snippet）。
5. **分歧**：**題材爭議大於作品討論**。新京報 2025 年度劇集榜（awards 檔）；PTT 2025 最喜歡串 7、kamenatsumi 與 jpeg 正評、Netflix 台灣 2025-12-21 #10（2 週）（fans 檔）。豆瓣 6.8；豆瓣劇評頁首條說網上輿論「更像是一種大型的社會實驗，一種深深的厌女的风气」（snippet），台灣主演陳妍希 42 歲、周柯宇 23 歲的年齡差是台灣媒體報導的主軸。英文 MDL 長評一致嫌前 20 集回憶線太長（snippet）。

## 11. 早春晴朗｜早春晴朗（優酷，2026-08；24 集；英文 The Early Spring；Netflix 上架）

> 本條沿用 `reviews-cn2.md` 第 15 條（2026-11-12 研究），只補 Metacritic 複查。

1. **Metacritic**：沒有頁面（2026-11-13 複查，只有 The Early Show、Early Edition 等，read）。
2. **豆瓣**：**開分 6.7**。世界新聞網，2026-09-12，〈熱度不等於口碑？ 爆款劇「早春晴朗」豆瓣開分才6.7〉。https://www.worldjournal.com/wj/story/121478/9749991 （snippet；見 cn2）。
3. **英文評論**：India Today，Bhavna Agarwal，2026-09-09，〈The Early Spring review: Jing Boran, Sun Qian shine in a deliciously messy romance〉。https://www.indiatoday.in/entertainment/ott/story/the-early-spring-review-jing-boran-sun-qian-mature-workplace-romance-netflix-2991074-2026-09-09 （read (Exa)，見 cn2；評全 24 集）。原文：「The romance is built on chemistry, but The Early Spring does not confuse chemistry with compatibility.」立場：推。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**（見 cn2）。
5. **分歧**：IMDb 8.2 vs 豆瓣 6.7，Netflix 全球週榜連兩週 #2（ratings 檔）；DailyView 2026-10 月榜 #7（fans 檔）。詳見 cn2。

## 12. 以家人之名｜以家人之名（湖南衛視／芒果TV，2020-08；40 集；英文 Go Ahead）

1. **Metacritic**：沒有頁面（pattern 抓不到含 ahead 的 `/tv/` slug，read）。
2. **豆瓣**：**開播最高 8.6，完結後跌到 7.0**。電影神搜，潘光中，2020-09-14（見下）：「豆瓣評分上衝 8.6 的現象級神劇；現在下檔才不過一個多禮拜……豆瓣評分下洗 7.0」（read）。
3. **英文評論**：Guavarama（部落格，署名即站名），2021-12-24，〈[Cdrama Review] 以家人之名 Go Ahead〉。https://www.guavarama.com/2021/12/24/go-ahead/ （partial：讀到 TLDR、劇情與評論開頭；評全劇）。**注意**：清單外個人部落格。
   - 摘要：她三天看完 30 小時，說本劇「really had heart」；提醒觀眾把它當愛情劇看，否則滿口「哥哥」會不自在；後段原生家庭回來搶人「goes all makjang」。立場：推。
   - 原文：「30 hours of drama watched in 3 days! That's how good this drama was for me. It really had heart.」
   - 另有 A Fangirl's Heart（2020-12，snippet）。清單內沒有找到。
4. **中文評論（台灣）**：
   - 聯合報〈娛樂有評〉（噓！星聞），海那Hannah，2020-09-03，〈《以家人之名》－用最溫暖的故事講最殘酷的生活情節〉。https://stars.udn.com/star/story/10093/4829907 （read；完結前後）
     - 摘要：她說本劇不像《請回答1988》，而是談「有血緣的不一定能成為家人」；凌霄面對的是精神層面的情緒勒索，賀子秋面對的是「用錢養小孩」。立場：推。
     - 原文：「以最溫暖的情節包裝述說這一個在社會中層出不窮的社會問題，是《以家人之名》最高明的說故事技巧」
   - 電影神搜，潘光中，2020-09-14，〈陸劇《以家人之名》從高分神作淪落狗血爛尾 是蓄意操作或非戰之罪？〉。https://news.agentm.tw/131944/ （read；完結後）。**注意**：潘光中本表副評。
     - 摘要：前半像華語版《請回答1988》，後半生母生父回來搶人、九年不回家再上演三角戀，「反智」；他以編劇身分把原因歸到陸劇 40 集的規格與審查。立場：前推後否。
     - 原文：「有網友說這部很像是華語版的《請回答 1988》，的確像；可惜只有前半部像，後半部整個大走鐘。」
5. **分歧**：**前後半口碑斷崖，國際評分沒有跟著掉**。豆瓣 8.6→7.0（潘光中）vs MDL #15 8.8（39,503 人）、IMDb 8.5（2.5K）（ratings 檔）；首爾電視劇節 2021 最佳連續劇亞軍（awards 檔）；PTT 2020 最愛三部串約 28 推（fans 檔）。台灣兩篇評論、英文部落格、風傳媒譚松韻排行（snippet）都說「後半愛情線削弱家庭題材」，只有 MDL 仍維持高分。

## 13. 繁花｜繁花（CCTV-8／騰訊視頻，2023-12～2024-01；30 集；英文 Blossoms Shanghai；美國 Criterion Channel 2025-11 上架）

1. **Metacritic**：**有頁面，Metascore 77**（6 篇：RogerEbert.com 90、Boston Globe 90、IndieWire 83、The A.V. Club 83、Collider 70、The New York Times 50；User score 6.7）。https://www.metacritic.com/tv/blossoms-shanghai/ （read）。**21 部中唯一有 Metacritic 頁面的陸劇**；首播日以 Criterion Channel 上架日計。
2. **豆瓣**：**8.7（約 42 萬人）**。知乎回答轉述官方微博 2024-02-26 海報：「42万人的支持，凝聚豆瓣8.7分成绩」。https://www.zhihu.com/question/646022429/answer/3412129596 （snippet；**官方宣傳經自媒體轉述**）。豆瓣 2024 年度評分最高華語劇集 #4（ratings 檔）。
3. **英文評論**：
   - The New York Times，Mike Hale，2025-11-27，〈Blossoms Shanghai review〉。https://www.nytimes.com/2025/11/27/arts/television/blossoms-shanghai-review.html （partial：Exa 抓取逾時，只讀到 Metacritic 頁上的摘錄；Metacritic 評 50）。
     - 摘要：他認為王家衛進入通俗劇的世界後「手感不對」，有畫面但沒有獨特的情緒與調性。立場：不推。**清單內媒體唯一一篇負評**。
     - 原文（Metacritic 摘錄）：「Wong is in the world of conventional melodrama here rather than the rarefied, allusive landscape of his films, and his touch is off.」
   - RogerEbert.com，Peter Sobczynski，2025-11-24，〈Wong Kar-wai's Gorgeous, Captivating "Blossoms Shanghai" Arrives on the Criterion Channel〉。https://www.rogerebert.com/streaming/blossoms-shanghai-criterion-review （read (Exa)，讀到約六成；評 Criterion 首批前幾集，文中說還有 18 集未播）。
     - 摘要：他把本劇當作「每週一部新的王家衛電影」，說擔心電視框架會犧牲王家衛風格的人可以放心。立場：強推（90）。
     - 原文（Metacritic 摘錄）：「anyone worrying about Wong having to sacrifice his usual cinematic approach in order to work within the parameters of the television world will be relieved that this is indeed a Wong vehicle through and through」
   - IndieWire，Ben Travers，2025-11-24，〈'Blossoms Shanghai' Review: Wong Kar Wai Series Is a Swanky Whirlwind〉（partial (Exa)；**只看 6 集**，B+）：「It's sly and funny, charming and fierce, even while the series may lack the subtle grace of the artist's finest films」。https://www.indiewire.com/criticism/shows/blossoms-shanghai-review-wong-kar-wai-series-1235162538/
   - Collider，Therese Lacson，2025-11-24（partial (Exa)；**只看 6 集**；她是上海話家庭出身，特別肯定滬語原音）：「Between dense dialogue and inconsistencies in filming, Blossoms Shanghai is flawed.」https://collider.com/blossoms-shanghai-review-wong-kar-wai/
   - 另：Boston Globe（Chris Vognar，前 6 集，partial (Exa)）；Bleeding Cool（Adi Tantimedh，2024-01-22，**看完 30 集**，partial (Exa)，說「thirty episodes where not that much happens is just too much」，清單外）。Guardian、Variety、THR、Screen Daily、SCMP 沒有找到署名劇評。
4. **中文評論（台灣）**：獨立評論＠天下，李明軒（特約作者，國立中山大學政治經濟系教授），2024-01-23，〈從《繁花》看中國的「高人解厄」幻想，期許一個更完善的法治社會〉。https://opinion.cw.com.tw/blog/profile/486/article/14483 （read (Exa)；播出期間）。**注意**：以劇論政的評論文，前半談劇、後半談台灣法治，不是完整劇評。
   - 摘要：他指出全劇 57 首港台金曲、黃河路霓虹讓人以為在看 80 年代港劇；並把劇情的成功讀成「人治社會」的投射：角色遇困境，總有「高人」一通電話解圍，觀眾藉此「過遇上高人的癮」。立場：中性偏推（肯定藝術表現，批判題材反映的社會）。
   - 原文：「有時一走神，會恍然以為自己正在觀看1980年代的香港電視劇。」
   - 副評：電影神搜，潘光中，2024-01-18，〈【劇評】王家衛《繁花》：十年磨一劇！帶起的是「似錦」或「落盡」？〉，https://news.agentm.tw/272231/ （read）。立場：推，但指出「雖說總免不了外在形式優先於敘事內容的曖昧尷尬」。另有獨立評論林正二、風傳媒〈觀點投書〉兩篇讀者投書（2024-02，snippet）與 VERSE 配樂整理（2024-06-19，snippet，非評論）。
5. **分歧**：**中外評審最一致的一部，但 Metacritic 內部 50 到 90 分裂**。白玉蘭 2024 最佳中國電視劇、飛天 2024 優秀電視劇、金鷹 2024、亞洲內容大獎 2024 最佳創意與最佳男主（胡歌）、南方周末 2023 提名、新周刊 2024 年度文化貢獻（awards 檔）；豆瓣 DB24 #4、雲合 2024 #4 22.9 億、燈塔都市劇 #2（ratings 檔）；LINE TODAY 2024 陸劇 #3（MyVideo）、PTT 2024 最喜歡串僅 1 推（fans 檔）。IMDb 只有 7.8（1.4K），比豆瓣 8.7 低——21 部中少數「國際評分低於豆瓣」的例子；Metacritic 使用者分 6.7 也低於評論家 77。分歧點都是「30 集太長、太多對白」（NYT、Collider、Bleeding Cool）vs「就是王家衛」（RogerEbert、Boston Globe）。台灣 PTT 聲量很低。

## 14. 北上｜北上（CCTV-1／愛奇藝，2025-03；英文 Northward）

1. **Metacritic**：沒有頁面（只有 North of North，read）。
2. **豆瓣**：**7.0**。風傳媒〈風生活〉，魏甫丞，2026-09-16，〈白鹿演過評價最高陸劇TOP10〉：「白鹿最強陸劇推薦第3名：《北上》｜豆瓣評價：7.0」。https://www.storm.mg/lifestyle/11164825 （snippet；排行清單，非評論）。
3. **英文評論**：**沒有找到**。只有 MyDramaList 頁與使用者評論（Le Ho 等）、Reddit r/CDrama 討論串（snippet）。
4. **中文評論（台灣）**：**沒有找到**。只有 Harper's BAZAAR〈2025愛情＋職場陸劇線上看推薦〉片單段落（2025-07-30，snippet，介紹型）與風傳媒排行清單（見上）。
5. **分歧**：**電視收視創紀錄、評論全面缺席**。CVB 2025 CCTV-1 3.615%（「有統計以來電視劇收視第三」）、雲合 2025 top20、微博 2025 年度影視化文學 IP（ratings 檔）；金鷹 2026 提名、亞洲內容大獎 2025 最佳導演（姚曉峰）（awards 檔）；愛奇藝台灣 2025 上半年 #10（推文「北上相當不錯」）、PTT 2025 最喜歡串 1（fans 檔）。央視收視極高 vs 豆瓣 7.0 vs 中英文都沒有一篇署名評論，是本篇「主旋律大劇評論真空」的例子。

## 15. 去有风的地方｜去有風的地方（湖南衛視／芒果TV，2023-01；40 集；英文 Meet Yourself）

1. **Metacritic**：沒有頁面（只有 Living with Yourself、Meet the Press 等，read）。
2. **豆瓣**：**從 8.1 漲到 8.7**。Yahoo 奇摩（Beauty美人圈，Bella，2024-10-26，網址見第 6 條）：「《去有風的地方》更是從8.1漲到8.7分」（snippet；**準媒體**）。豆瓣 2023 年度評分最高華語劇集 #3（ratings 檔）。
3. **英文評論**：Chasing Dramas，Karen and Cathy，日期未標（初評＋終評），〈Review: Meet Yourself (2023) 去有风的地方〉。https://www.chasingdramas.com/reviews/currently-watching-meet-yourself-2022-%E5%8E%BB%E6%9C%89%E9%A3%8E%E7%9A%84%E5%9C%B0%E6%96%B9/ （partial (Exa)；評全 40 集）。**注意**：清單外部落格，本表第 1 次。
   - 摘要：她們說這是可兼作雲南觀光廣告的療癒劇，劉亦菲與李現是「兩個成年人建立關係」；肯定劇集觸及村落醫療、人口外流，但配角支線不如主線、節奏慢到適合當背景播放。初評、終評都 7/10。立場：中性偏推。
   - 原文：「Final Score: 7/10 – A drama that will help cure depression, it's an interesting show that is both grounded in reality but also almost too idealistic.」
   - Sixth Tone（2024-05-15，談阿勒泰的新聞）順帶提本劇帶動大理觀光（partial (Exa)，非評論）。清單內沒有找到。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），王瑋，2023-05-27，〈去有風的地方——剛剛好的甜美與療癒〉。https://stars.udn.com/star/story/10093/7193239 （read；完結後，配合台灣愛爾達／MyVideo 播出）
   - 摘要：他說在「張牙舞爪」的劇海中，本劇讓俊男美女談一場舒緩的戀愛，四十集甜而不膩；編劇在舒緩調性中仍掌握明快節奏。但他也點出：在大陸尺度下演不出真正的黑暗，靜好歲月的設定「顯得有些刻意」。立場：推（有保留）。
   - 原文：「在中國大陸的「尺度」下，本來也就演不出真正的「黑暗」，所以許多情節也就是點到為止，更沒有大奸大惡，靜好歲月的設定自然顯得有些刻意，就看觀眾是要較真，還是一起被療癒！」
   - 另有娛樂有評〈星級評論／紅豆生南國尋幸福人生〉（2023-02-09，snippet）、關鍵評論網〈平衡慾望與需要〉（snippet，作者未見）、udn 女子漾兩篇（snippet，創作者文）。
5. **分歧**：**21 部中中外、評審、觀眾最一致的一部**。豆瓣 8.7、IMDb 8.2（1.2K）、MDL #19 8.8（13,388 人）（ratings 檔）；飛天 2024 優秀電視劇、金鷹 2024、首爾電視劇節 2023、南方都市報 NDY 2023 #4（awards 檔）；PTT 2023 最喜歡串約 65 推（21 部中最多）、myVideo 2023 戲劇 #1、愛奇藝台灣站 2023 #10（fans 檔）。唯一的保留都指向同一點：「太理想化」（王瑋、Chasing Dramas）。

## 16. 小巷人家｜小巷人家（湖南衛視／騰訊視頻，2024-10；英文 Romance in the Alley）

1. **Metacritic**：沒有頁面（只有 Ricky Gervais: Alley Cats，read）。
2. **豆瓣**：**8.3**。雲合數據《2024年長劇集網播年度觀察》PDF 的豆瓣頁（東方財富轉載，ratings 檔 DB24／YH24，read）：小巷人家 8.3，DB24 #9。
3. **英文評論**：The World of Chinese，Venla Tang，2024-12-12，〈"Romance in the Alley" Highlights Womanhood During China's Reform Era〉。https://www.theworldofchinese.com/2024/12/chinese-series-romance-in-the-alley-highlights-womanhood-chinas-reform-era/ （read (Exa)，讀到約四成；播完後）。**注意**：TWOC 是北京出版的英文中國文化雜誌，不在原清單。
   - 摘要：她說英文片名誤導，本劇的力量在黃玲與宋瑩兩位女性的鄰里情誼；劇集一方面販賣改革開放「黃金年代」的懷舊，一方面寫出三代女性從維護父權到尋求獨立的掙扎。立場：推。
   - 原文：「In fact, much of what makes the show powerful is that it's not about romance at all.」
   - 另有 Chasing Dramas（snippet）、cyn lynn（2024-10，3/5，snippet）。清單內沒有找到。
4. **中文評論（台灣）**：獨立評論＠天下〈主播台聽不到的聲音〉，廖芳潔，2025-04-26，〈比起《苦盡柑來》，《小巷人家》更是時代洪流中最熟悉的煙火人間〉。https://opinion.cw.com.tw/blog/profile/517/article/16067 （read；完結後，配合《苦盡柑來遇見你》熱播）。**注意**：廖芳潔本表第 2 篇。
   - 摘要：她認為本劇在她心中超越《請回答1988》與《苦盡柑來遇見你》，因為壓迫來自社會環境與親人的情緒勒索、更真實；也意外劇情觸及知青下鄉的傷害還能過審。立場：強推。
   - 原文：「這也是它竟然能在我心中超越《請回答1988》的原因。」
   - udn 女子漾〈5大看點〉（2024-12-31，snippet，介紹型；標題把劇名誤植為「小巷家人」）。
5. **分歧**：**評審、豆瓣、收視一致，國際評分缺席**。豆瓣 DB24 #9 8.3、雲合 2024 #15、燈塔年代劇播放冠軍、微博 2025 年度影響力作品、CSM 2024 #16（ratings 檔）；飛天 2026 優秀電視劇、白玉蘭 2025 提名、金鷹 2026 提名（awards 檔）；PTT 2024 最喜歡串 6（「意外的好看」）、kamenatsumi「完成度高但不是她的菜」（fans 檔）。ratings 檔沒有 IMDb／MDL 數字可對照；台灣評論者拿韓劇比較，是正文可用的切角。

## 17. 生万物｜生萬物（CCTV-8／愛奇藝，2025-08；英文 This Thriving Land）

1. **Metacritic**：沒有頁面（只有 This England、Landman 等，read）。
2. **豆瓣**：**7.2（約 22 萬人）**。燈塔 2025 全網播放 TOP10 新聞（騰訊新聞，2025-12-29）：「#2 21.35亿（豆瓣 7.2/22万）」（ratings 檔，read）。
3. **英文評論**：Chasing Dramas，署名欄未讀到（站方兩位作者 Karen and Cathy），2025-08-27 前後，〈Drama Review This Thriving Land (2025) 生万物〉。https://www.chasingdramas.com/reviews/currently-watching-this-thriving-land-2025-%E7%94%9F%E4%B8%87%E7%89%A9/ （read：Groundlane 讀到主要評論段；播出期間寫，評到中後段）。**注意**：清單外，本表第 2 次。
   - 摘要：她說前十集很精彩，把封建社會對女性「失貞」的壓迫攤開；但越往後越不滿：敘事又把聚光燈給男人、佃農常被寫成懶惰不講理，她甚至同情起地主；楊冪有進步但被老戲骨蓋過。立場：中性偏負。
   - 原文：「The first ten episodes are riveting, with strong character introductions and layered portrayals of how different people adapt or fail to adapt to the times. But as the story progresses, my frustrations mounted.」
   - 另有 cyn lynn（2025-08-14，3/5，snippet）。清單內沒有找到。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），潘光中，2025-09-21，〈種田文學正當道！ 楊冪憑藉「生萬物」殺回頂流層圈〉。https://stars.udn.com/star/story/10093/9018706 （read；播出後）。**注意**：潘光中本表主評第 1 篇。
   - 摘要：他說本劇有別於紅色樣板劇，以平頭百姓視角重現時代，聚焦「有土斯有財」；女性角色不走非黑即白；楊冪「總算有了突破」。也直說央視國慶檔選它「除了符合政治正確」也因卡司強。立場：推。
   - 原文：「本劇能成為央視定檔在國慶節期的重點大戲，除了符合政治正確，另一方面也因為卡司夠強大。」
   - Harper's BAZAAR〈7亮點〉（2025-08-14，snippet，介紹型）、udn 女子漾演員盤點（snippet）。
5. **分歧**：**播放量與獎項雙冠、豆瓣中上、IMDb 被粉黑戰拉低**。雲合 2025 #4、燈塔 2025 #2、貓眼電視劇集均冠軍、愛奇藝 2025 熱度 #1、微博年度影響力作品（ratings 檔，ratings 檔稱它是 6 個來源的最多來源劇之一）；飛天 2026 優秀電視劇、金鷹 2026 優秀電視劇、白玉蘭 2026 提名、新周刊 2025 年度劇集（awards 檔）；fans 檔沒有它。IMDb 搜尋摘要顯示 3.3 分（snippet，頁面有使用者留言說「may have been underestimated by Yang Mi's anti-fans」），對上 MDL 使用者長評多為 10 分——國際分數被楊冪粉黑戰扭曲，不能引用。英文部落格對階級敘事的批評，與潘光中「不走紅色樣板」的讀法正好相反。

## 18. 人世间｜人世間（CCTV-1／愛奇藝，2022-01；58 集；英文 A Lifelong Journey；Disney+ 上架）

1. **Metacritic**：沒有頁面（「a lifelong journey」只有 Journeyman 等，read）。
2. **豆瓣**：**8.1**。中國婦女報（新華網轉載），鍾玲，2022-03-03，〈《人世間》：時代巨輪中，平凡人的命運浮沉錄〉：「豆瓣網評分8.1」。https://www.news.cn/culturepro/20220303/fd9b63c2c0194fc49deea1e76084f96a/c.html （partial (Exa)；**大陸官方媒體**）。英文 The China Project（見下）也寫 8.1。DB22 #4（ratings 檔）。
3. **英文評論**：The China Project，Brian Wu，2022-06-24，〈'A Lifelong Journey': A family saga through China's past five decades〉。https://thechinaproject.com/2022/06/24/a-lifelong-journey-a-family-saga-through-chinas-past-five-decades/ （read (Exa)，讀到約九成；評全 58 集）。**注意**：The China Project（前身 SupChina）是紐約的中國觀察媒體，2024 年停刊，不在原清單。
   - 摘要：他肯定接地氣的風格、立體人物與跨世代共鳴；缺點是節奏拖、在家庭劇與年代劇之間擺盪，文革只被寫成青春冒險，後半周秉義的仕途線「像《人民日報》特稿」。結論是「rough edges」需要打磨。立場：中性偏推。
   - 原文：「However, for some viewers, myself included, where the drama falls short is pacing.」
   - 原文：「Almost like a People's Daily feature in screenplay form, Bingyi's exploits on-screen are supposed to reflect the Party's responsible and competent governance.」
   - Global Times、China Daily、chinaculture.org 有英文介紹（官媒，非評論）；RADII（Weiyu Qian，2022-04-06）談 Disney+ 上架（新聞）。清單內沒有找到。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），麥若愚（資深媒體人、影評人；網頁作者欄標「噓！星聞」，標題署名麥若愚），2022-06-25，〈賺人熱淚的「人世間」 帶觀眾回到老三台連續劇的時代記億〉。https://stars.udn.com/star/story/10093/6413251 （read；完結後）
   - 摘要：他拿公視《茶金》對照，說本劇能延續台灣看老三台長大觀眾的記憶；主張以「理解」看待「主旋律」三字，把大陸改革開放類比台灣十大建設；雷佳音「應該是今年的大陸視帝」；也點出劇集隱晦保留了原著的同性情節。立場：推。
   - 原文：「59集的「人世間」讓4年級以上的觀眾穿梭時光回憶（滿庭芳、親情），重溫傳統老三台的戲劇表達與演繹方式」
   - 上報〈央視大戲《人世間》登Disney+ 小粉紅怒「洋人只會看到貧窮」〉（2022-03-10，snippet，新聞）。
   - 背景（大陸媒體，不算台灣評論）：聯合早報〈毛尖：只是傷痕太密集〉（2022-04-21，partial (Exa)；新加坡報紙刊大陸學者專欄），批評「此劇依賴各種傷痕推進劇情，因此造成傷痕過密」。
5. **分歧**：**官方獎項大滿貫、國際平台幾乎無聲**。白玉蘭 2023 最佳中國電視劇（與《縣委大院》並列）、飛天 2024、金鷹 2022、南方周末 2022 年度劇集（awards 檔）；DB22 #4、愛奇藝熱度破萬（ratings 檔）；風傳媒魏甫丞 2026-09 引雲合稱累計有效播放 54.7 億、年代劇第一（snippet）；fans 檔沒有它。RADII 2022-04 提到 IMDb 一度 9.1（snippet），ratings 檔沒有 IMDb／MDL 現值。英文 China Project 與毛尖都說「節奏與傷痕堆疊」，台灣麥若愚則從老三台懷舊肯定，三者對同一「傳統通俗劇手法」評價相反。

## 19. 我的阿勒泰｜我的阿勒泰（CCTV-1／愛奇藝，2024-05；8 集；英文 To the Wonder）

1. **Metacritic**：沒有頁面（「to the wonder」只有 The Wonder Years 等，read）。
2. **豆瓣**：**8.9**（開分 8.5→8.7→8.8→8.9）。雲合 2024 PDF 豆瓣頁：8.9（ratings 檔 DB24 #2，read）。播出期間：Sixth Tone，2024-05-15，〈China's TV Hit of the Year Is a Drama About Kazakh Nomads〉：「an average rating of 8.7, the highest score of any Chinese drama released this year」，https://www.sixthtone.com/news/1015150 （partial (Exa)；署名欄只寫 Sixth Tone）。
3. **英文評論**：**沒有找到清單內或主流媒體的署名劇評**。英文主流媒體寫的都是現象：Sixth Tone（2024-05-15，新聞特稿，無個人署名，見上）、WSJ〈From Xinjiang With Love: China Show Tries to Give Region a Rosier Image〉（2024-06-16，snippet，署名未見）、Irish Times（Denis Staunton，2024-10-12，談新疆觀光，partial (Exa)）、RADII（Rachel Lu，2024-08-02，談觀光潮）、BBC（Kelly Ng，2025-11-01，談新疆觀光，提到本劇「funded by the government and promoted on state media」）。最接近劇評的是：
   - Active Faults（Substack），署名 Em，2024-05-17，〈09. Nomadland〉。https://activefaults.substack.com/p/09-nomadland （partial (Exa)：讀到長摘要約六成；看完 8 集）。**注意**：清單外個人電子報。
     - 摘要：她一開始因片頭的廣電總局扶持標誌警覺，看完認為本劇同時是軟宣傳與軟抵抗：大量哈薩克語、對「巫術」與信仰的辯護、對普通話化與現代化的質疑，以及女性群像。立場：推，但保留政治警覺。
     - 原文：「To the Wonder is as much soft propaganda as it is soft resistance.」
4. **中文評論（台灣）**：udn 女子漾（聯合新聞網），曾箏，2024-05-14，〈質樸真誠又深刻的《我的阿勒泰》〉。https://woman.udn.com/woman/story/123164/7963864 （partial (Exa)：讀到大半；看完 8 集）。**注意**：女子漾為創作者平台，列為邊界來源。
   - 摘要：她逐集回顧，讚許劇集不渲染愛情、以接近紀錄片的平淡打動人；特別引用張鳳俠「啥叫有用」與「哈薩克人有自己跟世界相處的方式……不可以居高臨下地改變他們」兩段。立場：強推。
   - 原文：「平淡如紀錄片的影片，在毫無防備之下，深深戳中人心，久久難以忘懷。」
   - 關鍵評論網轉載中央社〈《華爾街日報》：中國電視劇《我的阿勒泰》美化新疆形象〉（2024-06-19，snippet，新聞）；風傳媒〈台人海外旅遊首選竟是這裡〉（2025-07-04，snippet，說有台灣旅客因本劇去新疆）。
   - 背景（大陸媒體，不算台灣評論）：澎湃〈有戲〉曾於里〈《我的阿勒泰》：遠方再美，也有疼痛〉（2024-05-08，partial (Exa)，只評前三集）；《中國文藝評論》鄒贊（2024-08，partial (Exa)，學術論文，結論扣回「文化潤疆」）。
5. **分歧**：**獎項與豆瓣最高、政治解讀最兩極**。白玉蘭 2025 最佳中國電視劇、飛天 2026、金鷹 2026、AACA 2024 中國區最佳劇集、南方周末與新周刊 2024 年度劇集、坎城劇集節 2024 長劇競賽入圍（awards 檔，awards 檔稱它是唯一同時拿國內評審獎、國外評審獎與兩份評論榜第一的劇）；DB24 #2 8.9、MDL #22 8.8（ratings 檔）；fans 檔沒有它。中文評論（台灣曾箏、大陸澎湃）都談「遠方的美與疼痛」；英文媒體幾乎只談新疆形象與觀光，Active Faults 是少數兩邊都看的。正文引用英文時要說明「沒有主流英文劇評」。

## 20. 大生意人｜大生意人（CCTV-8／愛奇藝，2025-11；英文 Legend of the Magnate；Netflix 上架）

1. **Metacritic**：沒有頁面（「legend of the magnate」只有 The Legend of Vox Machina 等，read）。
2. **豆瓣**：**開分 7.3**。udn 女子漾，2025-12-16，〈朱亞文《大生意人》配角爆紅！〉：「豆瓣評分開出 7.3 分」。https://woman.udn.com/woman/story/123164/9206125 （snippet；**準媒體**）。
3. **英文評論**：Chasing Dramas，署名欄未讀到，日期未標，〈Legend of the Magnate (2025) 大生意人〉。https://www.chasingdramas.com/reviews/legend-of-the-magnate-2025-%E5%A4%A7%E7%94%9F%E6%84%8F%E4%BA%BA/ （partial：Groundlane 讀到前段約三成；評全劇）。**注意**：清單外，本表第 3 次（到上限）。
   - 摘要：她說本劇走出橫店、到寧古塔、蒙古草原、徽州茶園實景拍攝，第 18–19 集的「鬥茶」是她最喜歡的場面；晚清商人、亂黨、洋人交織，是少見的時代背景。立場：推。
   - 原文：「Yay! Another drama where we're not stuck in the same old Hengdian sets.」
   - 清單內沒有找到。
4. **中文評論（台灣）**：**沒有找到**。只有風傳媒〈風生活〉魏甫丞兩篇（2025-12-08 亮點整理、2026-02-08 Netflix 上線新聞，snippet）、Harper's BAZAAR 線上看推薦（snippet，導流）、鏡週刊與 udn 女子漾演員新聞（snippet）。
5. **分歧**：**電視收視高、數位熱度落後**。貓眼 2025 熱度 #4、微博 2026 年度品質作品、CCTV-8 2.288%（ratings 檔）；白玉蘭 2026 提名（awards 檔）；PTT 2025 推薦串 5、最喜歡串 1（fans 檔）。英文 Wikipedia 引用一篇〈Why Legend of the Magnate Leads Ratings but Lags Digitally〉（snippet，未讀），正好說明央視收視與網路熱度的落差。

## 21. 老舅｜老舅（CCTV-8／騰訊視頻／愛奇藝，2025-12；27 集；英文 Uncle）

1. **Metacritic**：沒有頁面（「uncle」搜尋有 `/tv/uncle/`，是英國同名喜劇，不是本劇；read）。
2. **豆瓣**：**開分 7.6**。世界新聞網，2025-12-25（網址見第 10 條）：「郭京飛、王佳佳主演的家庭年代喜劇「老舅」開出7.6分」（snippet；轉引搜狐）。
3. **英文評論**：**沒有找到**。只有 MyDramaList、IMDb、Feyno、CPOP HOME 資料頁與 Reddit 討論串（snippet）。
4. **中文評論（台灣）**：**沒有找到**。只有 udn 女子漾〈劇拋臉演員TOP10〉提到郭京飛（2026-06-05，snippet，非評論）。
5. **分歧**：**評審與豆瓣中上、國際與台灣完全無聲**。貓眼 2025 熱度 #7（ratings 檔）；白玉蘭 2026 提名（＋郭京飛最佳男主角提名）、金鷹 2026 提名、新京報 2025 年度劇集榜（awards 檔）；fans 檔沒有它。百度百科稱首播 4 集收視 2.7%（snippet，未查證）。與漫長的季節同樣是東北下崗題材，正文若要比較，只有豆瓣與獎項可引。

---

## toolDegradation

- **Groundlane MCP**：先用 ToolSearch 載入 `web_search`、`web_fetch`、`web_extract`，全程可用。Metacritic 21 部全部用 `web_extract`（render=never）；台灣媒體站內搜尋（domains 限定）與聯合報系、電影神搜、500輯、風傳媒、獨立評論（廖芳潔〈小巷人家〉走 browser fallback）全文都用 Groundlane。子供應商 tavily、exa、brave 多次標示 unavailable，fusion 自動退回 brave／you。
- **Exa**：英文評論搜尋（India Today、Gulf News、IndieWire、Collider、Boston Globe、The China Project、Sixth Tone、Active Faults 等）與 RogerEbert、TWOC、Little Hawk、獨立評論李明軒全文用 Exa。**研究後段 `web_fetch_exa` 回 401（Invalid API key）**，之後改走 jina。NYT（Mike Hale）Exa 抓取 CRAWL_LIVECRAWL_TIMEOUT，只用 Metacritic 摘錄。
- **jina**：`read_url` 讀獨立評論廖芳潔〈玫瑰的故事〉與 udn 女子漾柒默lisa〈許我耀眼〉（無 API key，回傳全文）。
- **Tavily**：沒有用到。
- Groundlane 讀 udn 女子漾頁面會把相鄰文章混進內文（第一次讀柒默lisa 文拿到的是秦漢金鐘文），已改用 jina 確認作者與內文。
- 沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com；搜尋結果中出現的豆瓣短評、劇評頁只當背景，不採用為分數來源。
- 終端機沒有連網，沒有使用。

## 待補與注意

- **英文找不到署名評論**：180天重啟計劃、北上、老舅（3 部）。我的阿勒泰只有現象報導與一篇 Substack，沒有主流劇評。
- **台灣找不到署名評論**：180天重啟計劃、向風而行、早春晴朗、北上、大生意人、老舅（6 部）；在暴雪時分、當我飛奔向你、狙擊蝴蝶只有 udn 女子漾創作者文（未讀全文）；許我耀眼只有網紅文；偷偷藏不住是方格子自媒體轉載。
- **NYT 繁花評論只讀到 Metacritic 摘錄**，若正文要引用 NYT，需另讀全文或只引摘錄並註明。
- **作者集中**：英文 India Today 4 篇都是 Bhavna Agarwal；台灣潘光中 2 主評＋2 副評、廖芳潔 2 篇；正文分配引用時注意。
- **豆瓣分數來源品質**：難哄、玫瑰的故事、去有風的地方、偷偷藏不住、在暴雪時分、大生意人只來自美妝／女性生活網站或 Yahoo 轉載；繁花 8.7 只來自官方微博經知乎轉述；當我飛奔向你與 180天重啟計劃沒有可引用的豆瓣數字。若正文要引，建議寫成「據台灣媒體整理」並註明時間點。
- **生萬物的 IMDb 3.3** 是搜尋摘要看到的數字，頁面使用者留言指向反粉打分，不要引用。
- 早春晴朗本表沿用 cn2，沒有重新搜尋英文與台灣評論。
