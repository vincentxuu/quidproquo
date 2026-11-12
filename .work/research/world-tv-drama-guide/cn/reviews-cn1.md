# CN1 評價資料表：陸劇｜古裝愛情與仙俠 19 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-12。片單來自 `post-cn1-shows.txt`。IMDb／MDL／豆瓣年度榜／雲合／燈塔／貓眼／平台熱度沿用 `candidates-ratings-viewing-buzz.md`、獎項與推優沿用 `candidates-awards-critics.md`、台灣 PTT／Dcard／LINE TODAY／Netflix 台灣榜沿用 `candidates-fans-taiwan.md`（三檔已標 read），這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查英文名（shen li、flourished peony、the double、prisoner of beauty、lost you forever、blossoms in adversity、eastern fantasy、ming lan、fairy and devil、pursuit of jade、divine tree、love in the clouds、female general、love like the galaxy、where the mask ends、blossom、feud、the glory、whispers of fate） | Groundlane `web_extract`（render=never，抓 `/tv/` 連結） | 19/19 read：**全部沒有頁面**。搜尋頁前 10 個 `/tv/` 連結（The Good Daughter、It Gets Worse、Black Doves 等）是站方熱門推薦，每次都出現，不算結果。同名誤中：`/tv/blossom/` 是 1990 年代美國情境喜劇、`/tv/feud/` 是 Ryan Murphy 的 FEUD、`/tv/the-glory/` 是韓劇《黑暗榮耀》，都不是本表的劇 |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；豆瓣 subject／doulist 頁沒有讀，沒有繞過 sec.douban.com | Exa search；Groundlane search | 19/19 有媒體引述的分數，但**大多是台港生活娛樂媒體的豆瓣排行文**（COSMOPOLITAN TW、美人計 beauty321、女人我最大、妞新聞、HK01、Mobile01、風傳媒〈風生活〉、上報），少數是英文媒體（Sixth Tone、Global Times）。騰訊新聞「rain」、網易訂閱、新浪 k.sina 等是自媒體帳號，標「自媒體」 |
| 英文評論 | 署名評論，讀全文或大半 | Groundlane `web_search`（domains 限定 scmp／sixthtone／thediplomat／nme／decider／collider／radiotimes／theguardian）、Exa `web_search_exa`／`web_fetch_exa`、jina `read_url` | **清單內媒體只評到蒼蘭訣**（Collider read；SCMP〈What a view〉partial）。清單外 4 篇：India Today（墨雨雲間）、The Diarist.ph（惜花芷）、Screen Rant＋The Citizen（逐玉）。15 部沒有找到署名英文劇評 |
| 台灣中文評論 | 聯合報〈娛樂有評〉（噓！星聞）、500輯〈質青評論〉、電影神搜、獨立評論＠天下、NOWnews〈名家論壇〉、鏡週刊、關鍵評論網、VERSE、風傳媒 | Groundlane `web_search`（domains 限定 news.agentm.tw／500times.udn.com／stars.udn.com／thenewslens.com／opinion.cw.com.tw／verse.com.tw／mirrormedia.mg／filmaholic.com.tw／storm.mg）＋ `web_fetch`；獨立評論與 NOWnews 改用 Exa | 11 部有文章（其中永夜星河是首 3 集開箱、星漢燦爛是演員評論、知否與逐玉只評前段）；8 部沒有找到（與鳳行、惜花芷、仙台有樹、入青雲、嫁金釵、臨江仙、雁回時、水龍吟） |

標記說明：**read** = 工具讀到頁面內文；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段或一半，或只看到 Exa 搜尋結果裡的長摘要；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：清單內 Collider 1、SCMP 1（都是蒼蘭訣）。**清單外**：India Today 1（墨雨雲間，印度主流媒體 OTT 版）、The Diarist.ph 1（惜花芷，菲律賓生活網站，議題短評）、Screen Rant 1（逐玉，美國大型娛樂網站）、The Citizen 1（逐玉，美國喬治亞州地方報）。沒有媒體超過上限。
>
> **陸劇古偶在英文媒體幾乎沒有署名劇評**：清單內的 Decider「Stream It or Skip It」只評到 2018–2021 年 Netflix 早期陸劇（Rise of Phoenixes、Accidentally in Love 等），SCMP〈What a view〉專欄只評到蒼蘭訣（同欄 2018 年評過 Rise of Phoenixes）；Sixth Tone 只有逐玉的新聞（未署名）；The Diplomat、NME、Radio Times、Guardian 對本表 19 部都沒有劇評。可見的英文文字幾乎全是個人部落格（The Fangirl Verdict／kfangurl、Chasing Dramas、subtitledreams、The Tea Lady、DramaBubbleReviews、Kdrama Kisses、Cultivating Dragons 等）與 MDL 使用者評論，不收。The Blossom Review 只評日韓劇，沒有陸劇。
>
> 台灣中文評論：**作者高度集中在三人**。潘光中（專業編劇）4 篇（墨雨雲間 ×2〔電影神搜、500輯〕、國色芳華〔500輯〕、長相思〔娛樂有評〕）；雀雀 3 篇（蒼蘭訣、九重紫、錦月如歌，都在娛樂有評，九重紫一篇同時刊 500輯）；柯志遠 2 篇（知否〔娛樂有評，2019〕、逐玉〔NOWnews 名家論壇，2026〕）。其餘各 1：廖芳潔（獨立評論，折腰）、杜沛學（聯合報記者，udn 星級評論，星漢燦爛，偏演員評論）、白話雯（電影神搜，永夜星河首 3 集開箱）、udn 星級評論一篇未見署名（蒼蘭訣）。所有讀到的文章都沒有「合作／贊助」標記；但娛樂有評、500輯的劇照多由台灣播映方（愛爾達、LINE TV、MyVideo、愛奇藝國際站）提供，文章常搭配台灣首播資訊。

---

## 1. 与凤行 與鳳行（騰訊視頻／芒果TV／湖南衛視，2024；英文 The Legend of Shen Li）

1. **Metacritic**：沒有頁面（站內搜尋「shen li」沒有相關 TV 結果，read）。
2. **豆瓣**：**7.2**。COSMOPOLITAN TW，Lily Chang，2024-06-12〈2024豆瓣高分古裝陸劇8部推薦〉https://www.cosmopolitan.com/tw/entertainment/movies/g61078380/2024-chinese-costume-drama/ （partial (Exa)）；女人我最大，陳亮貽，2024-10-31（https://woman.tvbs.com.tw/entertainment/53514 ，partial (Exa)）；風傳媒〈風生活〉，魏甫丞，2026-10-07 仍寫 7.2（https://www.storm.mg/lifestyle/11170399 ，snippet）。三家同分，播出兩年多分數穩定。
3. **英文評論**：**沒有找到**。搜尋過：Groundlane 限定 scmp／nme／collider／decider 等「The Legend of Shen Li」、Exa「review Legend of Shen Li」。只找到 Shanghai Daily（Lu Feiran，2025-02-19，談陸劇出海的特稿，非劇評，官方背景媒體）、The Drama Dojo 年度片單、The Tea Lady 等部落格（snippet，不收）。
4. **中文評論（台灣）**：**沒有找到**台灣媒體署名評論。搜尋過：Groundlane 站內限定九個台灣媒體「《與鳳行》 評論 OR 劇評 OR 觀點」「與鳳行 趙麗穎 劇評」，Exa「《與鳳行》 劇評 趙麗穎 沈璃 娛樂有評 OR 電影神搜 OR 獨立評論」。只找到上報新聞（收視破紀錄）、噓！星聞電視新聞、個人部落格（warmbookcase「Jamie 的生活閱覽室」）、PTT 心得（mattina，2024-07-22，Disp BBS 轉貼）。
   - 側面：廖芳潔在獨立評論〈《折腰》：她不是戀愛腦，只是不敢輸〉（見第 4 部）順帶批評：「《與鳳行》的沈璃，一開始狠話放盡，後期卻柔情到沒骨頭」（read (Exa)）。
5. **分歧**：**播放量王者、國際粉絲高分，豆瓣中段、大陸媒體評論兩極**。IMDb 8.2（1.4K）、MDL #40 8.6、雲合 2024 上新劇有效播放 #2 31.6 億、燈塔 2024 電視劇榜 #2（ratings 檔）；北京青年報 2024 年度劇集（awards 檔）；PTT 2024 最喜歡串 16 人、LINE TODAY 2024 陸劇 #4（fans 檔）。豆瓣 7.2 對 MDL 8.6。大陸媒體背景：京報網〈看过《第二十条》不明白《与凤行》〉（記者金力维，2024-03-22，播出約 10 集時，partial (Exa)）批評「赵姐这演技，怎么又归零到85花均值了？」與重度磨皮；中國青年報（李丹萍，2024-04-18，partial (Exa)）肯定「反套路」細節，但說「故事本身的苍白和空洞仍难以被掩盖」。

## 2. 国色芳华（含 锦绣芳华） 國色芳華（芒果TV／湖南衛視，2025；英文 Flourished Peony）

1. **Metacritic**：沒有頁面（站內搜尋「flourished peony」只有熱門推薦，read）。
2. **豆瓣**：**7.8**（第一部）。Mobile01，曾心奕，2025-06-16〈2025上半年古裝陸劇推薦TOP 10〉寫「7.8分（約35.4萬筆評價）」，https://www.mobile01.com/topicdetail.php?f=781&t=7133199 （partial (Exa)）；COSMOPOLITAN TW，Lily Chang，2025-06-25（partial (Exa)）；燈塔 2025 播放榜新聞引述 7.8／41 萬（ratings 檔）。**錦繡芳華**：只找到 MyVideo 平台部落格寫 7.8（平台自家，不採用），沒有媒體引述。
3. **英文評論**：**沒有找到**。只有 Shanghai Daily 特稿（Lu Feiran，2025-02-19，引 Viki 9.3 談出海，非劇評）與 newhanfu 片單（snippet）。
4. **中文評論（台灣）**：500輯〈質青評論〉，潘光中，2025-01-25，〈《國色芳華》：高熱度古偶劇 給觀眾提供了什麼樣的情緒價值？〉。https://500times.udn.com/wtimes/story/120840/8513255 （read；**播出中**，本劇 2025-01-07 開播，文中只談前半人物設定）
   - 摘要：他先算製作費（每集約台幣 3,675 萬，約《華燈初上》三倍），再比較同類經商大女主《蜀錦人家》《珠簾玉幕》失利，結論是「角色厚度」決定成敗。立場：推（保留，說「並不是完美無缺的天花板」）。
   - 原文：「簡單歸納也就那麼四個字──『角色厚度』決定了一切。」
   - 原文：「像《國色芳華》這樣『類型之中、主流之外』的古偶劇。或許並不是完美無缺的天花板等集；但能夠順利出圈，也代表作為內娛大宗的古偶劇集，思考如何『落地著陸』的時代，真真切切的來臨了。」
   - 沒有找到錦繡芳華的台灣署名評論。
5. **分歧**：**少數評審、豆瓣、國際分數、播放量都站在同一邊的古偶**。MDL #57 8.5、豆瓣 2025 年度華語劇 #8 7.8、燈塔 2025 #9 12.78 億、貓眼 2025 熱度 #2、芒果 2025 播放量 #2、微博 2025 年度品質作品（ratings 檔）；飛天獎 2026 優秀電視劇（得獎）、金鷹獎 2026 提名（awards 檔）；PTT 2025 推薦串只有 1 人且原 PO 問「沒人推嗎？」、kamenatsumi 對第一季褒貶互見但續作正評、MyVideo 2025 戲劇榜 #2（fans 檔）。分歧在台灣劇迷討論度相對冷，不在分數。

## 3. 墨雨云间 墨雨雲間（優酷，2024；英文 The Double）

1. **Metacritic**：沒有頁面（站內搜尋「the double」沒有相關 TV 結果，read）。
2. **豆瓣**：**播出中 6.9，完結後 6.6**。COSMOPOLITAN TW（Lily Chang，2024-06-12）與 HK01（2024-07-07，未署名）寫 6.9；妞新聞（CY，2024-07-27，https://www.niusnews.com/=P1lnnxlx3 ，partial (Exa)）寫 6.6。騰訊新聞自媒體年終文（2024-12-08）也寫 6.6，並說「如此表现亮眼的收视和热度，但豆瓣只有6.6评分，也是令人唏嘘不已」（自媒體，只作背景）。
3. **英文評論**：India Today，Bhavna Agarwal，2024-08-06，〈'The Double' Review: An intriguing blend of politics, romance and revenge〉。https://www.indiatoday.in/entertainment/ott/story/the-double-review-wu-jin-yan-wang-xiang-yuen-chinese-drama-2578035-2024-08-06 （**partial (Exa)**：讀到大半；評全劇，Netflix 上架後）。**注意**：India Today 不在原清單（印度主流新聞集團的 OTT 版）；文中把王星越拼成 Wang Xiang Yue。
   - 摘要：她認為本劇把女性角色寫成聰明的人，政治、復仇、愛情比例平衡，兩位主演化學反應「restrained」；缺點是太長。給 3.5/5。立場：推（保留篇幅）。
   - 原文：「The right balance of drama and politics is the biggest strength of 'The Double.' However, the runtime is arguably long and could have easily been captured in a 30-episode series.」
   - 其餘英文多是部落格（subtitledreams「Style Over Substance」但給 9/10、Chasing Carefree、My Drama Review 等，snippet，不收）。
4. **中文評論（台灣）**：電影神搜，潘光中，2024-06-28，〈【劇評】《墨雨雲間》：妥妥大女主復仇爽劇，吳謹言重回舒適圈再返巔峰〉。https://news.agentm.tw/283619/ （read；陸播接近尾聲時，未說明看到第幾集）
   - 摘要：他認為女主敘事不靠愛情推動，是復仇爽劇也是女性成長故事，反派也有前因後果；畫面剪裁偏向手機螢幕。結尾直言本劇和微短劇相比差別只在卡司與製作。立場：推（明說不是良心正劇）。
   - 原文：「主角的敘事線並不靠著愛情來推動，而是聚焦在主體意識和個人覺醒之上；一方面維持著『復仇爽劇』的純粹，再者也成就了一套女性成長故事。」
   - 原文：「《墨雨雲間》和目前充斥在各大短影音平台上的微短劇相比，說是只有卡司玉製作精緻度的差別，似乎也不為過。」
   - 同作者 500輯〈質青評論〉，2024-07-06，〈墨雨雲間／潘光中劇評：「于氏商法」再奏效－解析古裝偶像劇的魅力〉（https://500times.udn.com/wtimes/story/120840/8076233 ，read）：從于正選角與「多角關係」分析爆紅，說吳謹言「一貫『瞪眼＋嘟嘴』的一號演技，依然為人所詬病」。**兩篇同一作者**，正文只能算一種台灣評論聲音。
5. **分歧**：**豆瓣與國際分數落差最大的一部之一**。IMDb 8.2（2.4K）、MDL #20 8.8（29,933 人）、雲合 2024 #3 26.7 億、燈塔 2024 網劇榜 #1 33.70 億（ratings 檔）；澳門國際電視節提名、首屆電視劇製作產業大會年度推優（awards 檔）；Netflix 台灣 2024-06-23 #1（累計 9 週）、LINE TODAY 2024 陸劇 #2、PTT 2024 最喜歡串 8 人但多人嫌結局（fans 檔）。豆瓣 6.6 對 MDL 8.8，差 2.2 分。

## 4. 折腰 折腰（騰訊視頻，2025；英文 The Prisoner of Beauty）

1. **Metacritic**：沒有頁面（站內搜尋「prisoner of beauty」只有 The Prisoner、The Beauty 等，read）。
2. **豆瓣**：**開分 6.4，後升到 6.6**。Mobile01，曾心奕，2025-06-16 寫「6.4分（約11.6萬筆評價）」（partial (Exa)）；美人計，Bella，2025-11-04〈Netflix最新古裝陸劇評分TOP10〉寫 6.6（https://www.beauty321.com/post/70144 ，partial (Exa)）。騰訊新聞自媒體（2025-05-26）說「分数不高，很大一部分原因就是男主颜值被吐槽」（自媒體，背景）。
3. **英文評論**：**沒有找到**署名媒體評論。搜尋過：Exa「South China Morning Post review … The Prisoner of Beauty」、Groundlane 限定清單媒體。只找到 The Fangirl Verdict（kfangurl）、Chasing Dramas、devotedtodrama、pettydramawatcher 等部落格與 MDL 使用者評論（snippet，不收）。
4. **中文評論（台灣）**：獨立評論＠天下（主播台聽不到的聲音專欄），廖芳潔，2025-06-08（Exa metadata 寫 06-07，搜尋結果寫 06-06），〈《折腰》：她不是戀愛腦，只是不敢輸〉。https://opinion.cw.com.tw/blog/profile/517/article/16212 （read (Exa)；陸播完結前後，以角色評論為主）
   - 摘要：她替被觀眾罵「不值得被愛」的女主小喬辯護，說那是女性在亂世裡的理性；肯定宋祖兒、劉宇寧的表演，也引同事的批評，承認劇情灌水。立場：推（保留節奏）。
   - 原文：「這樣的角色太難寫，也太難演。但宋祖兒演對了。她不是在討你喜歡，而是在演一個『真正在活下來』的女人。」
   - 原文：「《折腰》的小喬雖然在劇情節奏上有些反覆、灌水、無糖期過長，但她始終是那個能撐住信念的女主角。」
5. **分歧**：**台灣與國際熱度最高、豆瓣最低的一組**。IMDb 8.2（2.6K）、MDL #9 8.9（31,685 人）、騰訊 2025 熱度值 #3、微博 2025 年度優秀作品（ratings 檔）；fans 檔 9 類訊號：Netflix 台灣 2025-05-25 #1（累計 8 週）、LINE TODAY 2025 陸劇 #2、DailyView 2025 聲量 #2、PTT 2025 推薦串約 19 人，負評有 PTT「看劇感覺還好」與 Dcard 棄劇。豆瓣 6.4–6.6 對 MDL 8.9。

## 5. 长相思（S1–S2） 長相思（騰訊視頻，2023／2024；英文 Lost You Forever）

1. **Metacritic**：沒有頁面（站內搜尋「lost you forever」只有 Lost、Forever 等，read）。
2. **豆瓣**：**第一季 7.6→7.8；第二季 6.6**。POPO 筆記（2023-08-19）寫第一季 7.6；美人計，Bella，2024-06-14〈近年「豆瓣最高評分」古裝劇TOP10〉寫 7.8（https://www.beauty321.com/post/62279 ，partial (Exa)）。第二季 6.6 只見於騰訊新聞自媒體年終文（2024-12-08，「它在豆瓣只有6.6评分，实在有些令人费解」），**自媒體，正文要標明或不寫**。
3. **英文評論**：**沒有找到**。只有 MDL 使用者評論與片單（snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉，潘光中（專業編劇），2023-09-16，〈古裝幻想X現實主義完美配搭！《長相思》爆款出圈其來有自〉。https://stars.udn.com/star/story/10093/7442868 （read；第一季完結後）
   - 摘要：他把古偶市場形容為「地獄等級的血海」，認為第一季是認真作戲的例外：平民到王姬的階級議題、四位男角組成的「男友圖鑑」多線 CP，加上現實主義，讓它跨出古偶基本盤。立場：推。
   - 原文：「比方最近剛剛風光下檔的《長相思》，就是一部認認真真憑實力出圈的良心劇。」
   - 原文：「這種仿若韓國熱門戀愛實境綜藝《換乘戀愛》般的多線CP設計，極大程度滿足了古偶劇主力觀眾－18到49歲女性－的幻想」
   - 第二季沒有找到台灣署名劇評；柯志遠在 NOWnews〈名家論壇〉評《某某》時順帶寫「《長相思》、《誰是被害者》的第二季，觀眾打的評價對比上一季，都遜色多了」（2024-08-30，partial (Exa)）。風傳媒〈影評／Netflix陸劇《長相思》為何爆紅？〉是方格子 Vocus 轉載（自媒體，不計）。
5. **分歧**：**第一季口碑與播放雙收，第二季播放仍高、口碑下滑**。MDL #55 8.6、雲合 2024 第二季熱播期集均 #13、燈塔 2024 古偶集均 #3、仙俠劇冠軍（ratings 檔）；南方都市報（NDY）2023 #6（awards 檔）；PTT 2023 最喜歡串約 37 人、Netflix 台灣 2023-09-24 在榜；第二季 Dcard 3★「有多期待失望就有多大」（fans 檔）。

## 6. 惜花芷 惜花芷（優酷，2024；英文 Blossoms in Adversity）

1. **Metacritic**：沒有頁面（站內搜尋「blossoms in adversity」只有《繁花》Blossoms Shanghai 等，read）。
2. **豆瓣**：**完結時 7.1，之後升到 7.4**。COSMOPOLITAN TW（2024-06-12）、HK01（2024-07-07）寫 7.1；妞新聞（CY，2024-07-27）寫 7.2；女人我最大，陳亮貽，2024-10-31 寫 7.4（partial (Exa)）。
3. **英文評論**：The Diarist.ph，Liana Garcellano，2025-05-23，〈Just the point of view we need: Tiger women hold up half the sky in C-dramas〉。https://www.thediarist.ph/just-the-point-of-view-we-need-tiger-women-hold-up-half-the-sky-in-c-dramas/ （**partial (Exa)**；評全劇，與《良辰美景好時光》Perfect Match 合評）。**注意**：菲律賓生活網站，不在原清單；是議題短評，不是完整劇評（Exa metadata 作者欄寫 Alvin Alcantara，頁面署名 Liana Garcellano）。
   - 摘要：她把花芷讀成「木蘭」式人物，肯定本劇不靠仇男、而是寫女性自立、廢奴契、帶家中女眷經商。立場：推。
   - 原文：「Blossoms in Adversity is a 40-episode cinematic homage to the folk tale Mulan.」
   - 原文：「Reality doesn't always equal fiction, but Madam Li and Hua Zhi are reminders that women blossom in adversity and that they hold up half the sky.」
4. **中文評論（台灣）**：**沒有找到**。搜尋過：Groundlane 站內限定九個台灣媒體「《惜花芷》 評論 OR 劇評」；電影神搜有 `tag/惜花芷` 彙整頁（snippet），但沒有找到署名劇評。風傳媒 2026-09 片單文（snippet）不算評論。
5. **分歧**：**播放與口碑都中上、台灣討論度低**。MDL #41 8.6、雲合 2024 #9 16.9 億、燈塔 2024 網劇榜 #3（ratings 檔）；澳門國際電視節最佳女主角提名（張婧儀）（awards 檔）；PTT 2024 最喜歡串 14 人（fans 檔）。豆瓣播完後反而上升（7.1→7.4），是「長尾」型口碑。

## 7. 永夜星河 永夜星河（騰訊視頻，2024；英文 Love Game in Eastern Fantasy）

1. **Metacritic**：沒有頁面（站內搜尋「eastern fantasy」只有 Fantasy Island 等，read）。
2. **豆瓣**：**7.5–7.6**。Global Times，2024-11-06〈Charm of C-dramas: positive values, aesthetics〉寫 Douban 7.5（https://www.globaltimes.cn/page/202411/1322572.shtml ，read (Exa)；署名只寫「a reporter with the Global Times」，官媒、宣傳性質）；風傳媒〈風生活〉，魏甫丞，2026-08-14 寫 7.6、約 47.5 萬人（snippet）。COSMOPOLITAN TW 一篇標 2024-06-12 卻寫 7.4，本劇 2024-11 才開播，文章顯然後來改過，日期不可信，不用。
3. **英文評論**：**沒有找到**署名媒體評論。Global Times 那篇是文化輸出宣傳稿，不算評論；其餘是 MDL 使用者與 DramaBubbleReviews 等部落格（snippet，不收）。
4. **中文評論（台灣）**：電影神搜，白話雯，2024-11-05，〈【開箱】《永夜星河》Netflix 線上熱播中：穿書解任務，攻略「黑蓮花」，譜出互相救贖的四角戀愛？〉。https://news.agentm.tw/306868/ （read；**只看前 3 集，屬開箱介紹型，不是完整劇評**）
   - 摘要：介紹穿書設定、二搭 CP，稱讚第一集「十分鐘就劇終」的大膽剪輯，對特效一體感有保留。立場：介紹型偏正面。
   - 原文：「看到此，只能說導演真的是很大膽。」
   - 原文（圖說）：「看得出來有用心製作，但好像還不是那麼有一體感……」
   - 沒有找到完結後的台灣署名劇評。
5. **分歧**：**國內外熱度一致、結局評價分裂**。IMDb 7.6（1.6K）、雲合 2024 #14 13.4 億（ratings 檔）；產業大會 2024 年度推優（awards 檔）；PTT 2024 最喜歡串約 33 人、Dcard 5★「絕對是大爆款」、Netflix 台灣 2024-12-08 #10（fans 檔）。MDL 高讚使用者評論也說結局「abrupt」（snippet）。

## 8. 知否知否应是绿肥红瘦 知否知否應是綠肥紅瘦（湖南衛視等，2018–2019；英文 The Story of Ming Lan）

1. **Metacritic**：沒有頁面（站內搜尋「ming lan」沒有相關 TV 結果，read）。
2. **豆瓣**：**完結時 7.5，後來漲到 7.8–7.9**。界面新聞，深壹，2019-02-16〈《知否》收官，正午阳光如何用家国叙事塑造人物群像〉寫「豆瓣最终拿下7.5分」（https://www.jiemian.com/article/2866765.html ，read (Exa)）；Vogue Taiwan，Inna Chou，2023-05-19 寫 7.8（partial (Exa)）；美人計，Bella，2024-03-11 寫 7.9（partial (Exa)）。
3. **英文評論**：**沒有找到**。只有 MDL 使用者評論（snippet）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉，柯志遠，2019-01-19，〈又細緻又壯闊 劇型無法歸類的2019好戲開門紅！〉。https://stars.udn.com/star/story/10093/3601350 （read；**播出中，約到第 34 集**）
   - 摘要：他列出「必追的四個理由」：劇型無法歸類、人設反常（顧廷燁是「史上最『糟劣』的男一號」）、電影感攝影與武打、像《紅樓夢》的氣息；稱讚曹翠芬、劉琳，對兩位主演保留。立場：強推（保留主演）。
   - 原文：「這個基調，使得《知否？知否？應是綠肥紅瘦》的『宅鬥』，比諸《延禧攻略》、《如懿傳》的『宮鬥』要更讓人易生共鳴」
   - 原文：「趙麗穎、馮紹峰的演出暫時還看不到『精彩絕倫』的發揮（相對於搭戲的老戲骨們）」
   - 娛樂有評另有梁良〈2019十大網播陸劇〉把本劇列第 1（2020-01-18，snippet，片單）。方格子 vocus「朱先敏的沙龍」（2018-12-29）以原著書迷角度批評改編「直男劇組不懂女性幽微」（自媒體，不計）。
5. **分歧**：**老劇長尾、評價隨時間上升；原著讀者不滿改編**。IMDb 8.3（1.5K）、MDL #26 8.7、雲合 2024 老劇有效播放 #3（ratings 檔）；白玉蘭獎 2019 提名、金鷹獎 2020 優秀電視劇（awards 檔）；PTT 2019 最愛串約 16 人、2020 最愛三部串約 18 人、入坑串 3 人（fans 檔）。大陸媒體背景：光明網（刘冰雅，2019-02-07，read (Exa)）批評改編「没能逃离『求爽』魔咒」；澎湃新聞〈思想市場〉（2019-01-24，未署名）分析劇中嫡庶觀念的保守化。

## 9. 苍兰诀 蒼蘭訣（愛奇藝，2022；英文 Love Between Fairy and Devil）

1. **Metacritic**：沒有頁面（站內搜尋「fairy and devil」只有 God, the Devil and Bob 等，read）。
2. **豆瓣**：**開分 7.7，完結後升到 8.1–8.2**。美人計，Ruo，2023-02-06 寫「當時《蒼蘭訣》開分就有7.7分的好評，沒想到完結近半年，分數再度上漲」到 8.1（https://www.beauty321.com/post/50256 ，partial (Exa)）；Vogue Taiwan（Inna Chou，2023-05-19）8.1；風傳媒〈風生活〉，梁珈瑄，2026-07-15 寫 8.2（snippet）。
3. **英文評論**：Collider，Michele Kirichanskaya，2023-06-13，〈This Epic C-Drama Series About Star-Crossed Lovers Is Worth the Binge〉。https://collider.com/love-between-fairy-and-devil-chinese-drama/ （read；評全劇，屬推薦型特寫，不是傳統評分劇評）
   - 摘要：她把本劇比作「美女與野獸」「冥王與泊瑟芬」「羅密歐與茱麗葉」的混合，稱讚戰爭不分善惡、配角有自己的利害、輕重平衡。立場：推。
   - 原文：「A masterclass of Xianxia storytelling, the show draws much of its star quality from its captivating star-crossed lovers romance」
   - 原文：「Love Between Fairy and Devil is the perfect Xianxia drama with its "opposites attract" story, complicated characters, and strong storytelling.」
   - 另有 SCMP〈What a view〉，Stephen McCarty，2022-10-28，〈Is it Halloween scary? No, but Love Between Fairy and Devil, Netflix Chinese supernatural romantic fantasy, is a wild ride〉（https://www.scmp.com/magazines/post-magazine/arts-music/article/3197423/ ，**partial**：jina 讀到前半，Exa 只拿到前三段，Groundlane 被擋；前半幾乎是劇情介紹，語氣戲謔）。原文：「has all manner of mythological mayhem to recommend it.」立場：偏正面（保留，評價段沒讀到）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉，雀雀，2022-09-03，〈公式中的反套路《蒼蘭訣》 一次洗白3大陸劇罪名〉。https://stars.udn.com/star/story/10093/6584237 （read；完結後）
   - 摘要：她說故事非常公式（交換身體、先吻後愛、兩族對立），但懂得在公式裡「埋進俏皮複方」；王鶴棣的直男本色和角色意外合拍；本劇洗白了陸劇三大罪名（鮮肉不會演、IP 被魔改、服化道審美疲勞）。立場：推。
   - 原文：「然而《蒼蘭訣》竟可一次洗白三種陸劇常被拍成爛劇的罪名元素，實屬難得」
   - 另有 udn〈星級評論〉，2022-09-26，〈女主聒噪、男主反派 「蒼蘭訣」何以擴散「訣症」毒？〉（https://stars.udn.com/star/story/10093/6640273 ，read；**擷取內文未見作者署名**）。原文：「『蒼蘭訣』也沒有要帶給觀眾什麼大道理，不用燒腦、沒有驚悚，就是帶領觀眾浪漫一番」。立場：推。
5. **分歧**：**少數豆瓣、英文媒體、國際分數一致高分的仙俠；台灣劇迷訊號反而弱**。IMDb 8.4（5.5K）、MDL #28 8.7、豆瓣 2022 年度華語劇 #8、雲合 2024 集均破億俱樂部（ratings 檔）；亞洲內容大獎（AACA）2023 中國區最佳劇集（awards 檔）；fans 檔只有 PTT 入坑串 2 人（「我的仙俠天花板」）。

## 10. 逐玉 逐玉（騰訊視頻／愛奇藝，2026；英文 Pursuit of Jade）

1. **Metacritic**：沒有頁面（站內搜尋「pursuit of jade」只有 The Pursuit of Love 等，read）。
2. **豆瓣**：**播出中 6.6，完結後 6.4**。Sixth Tone，2026-03-30〈High Rankings of China's 'Pursuit of Jade' Draw Skepticism〉寫「'Pursuit of Jade' currently stands at 6.6」（https://www.sixthtone.com/news/1018355 ，read；署名欄只寫 Sixth Tone，編輯 Marianne Gunnarsson）；上報，徐郁雯，2026-11-04 寫《逐玉》6.4（https://www.upmedia.mg/tw/popularity/chinese-dramas/273217 ，partial (Exa)）。ratings 檔也記 6.4。
3. **英文評論**：Screen Rant，J.R. Waugh，2026-05-25，〈Netflix's Densest New Revenge Drama Is Too Vast For A Weekend Binge〉。https://screenrant.com/netflix-chinese-drama-pursuit-of-jade-long-binge/ （**partial (Exa)**；評全 40 集）。**注意**：Screen Rant 不在原清單（美國大型娛樂網站）；文章是「該不該追」型推薦。
   - 摘要：他說本劇密度高、40 集不適合一個週末看完，女強男美的配置刻意服務女性觀眾；稱讚攝影、調色、服裝與武打。立場：推。
   - 原文：「While perhaps too lengthy for one singular weekend binge, Pursuit of Jade offers a rewarding romance at its core, a deep revenge plot driven by action and intrigue, and features breathtaking cinematography and color grading.」
   - 另有 The Citizen（美國喬治亞州地方報），Ellie White-Stevens，2026-03-30，〈Pursuit of Jade: C-Drama Demands Your Attention - And Delivers〉（https://thecitizen.com/2026/03/30/pursuit-of-jade-c-drama-demands-your-attention-and-delivers/ ，partial (Exa)；全劇）。原文：「I loved Pursuit of Jade. Now that I've seen it once, I would probably understand who all the side officials and generals are without getting as confused, which is really my only criticism.」清單外。
   - CNA Lifestyle（May Seah，2026-04-14）談男主顏值與女性凝視的評論文、Straits Times（Aw Cheng Wei，2026-04-11）談官方批「粉底液將軍」的新聞分析，都只讀到 snippet／partial，非劇評。負評見於 Karissa Chen 的 Substack（2026-06-08，「Pursuit of Jade is NOT it」，個人電子報，不收）。
4. **中文評論（台灣）**：NOWnews〈名家論壇〉，柯志遠，2026-03-11，〈柯志遠「劇評」／《逐玉》〉。原刊 NOWnews，讀的是 Yahoo 奇摩新聞轉載 https://tw.news.yahoo.com/名家論壇-柯志遠-劇評-逐玉-075815709.html （read (Exa)；**開播後約一週寫成**，文中寫「上檔還不到一個禮拜」，評的是前段）
   - 摘要：他把成功歸功於導演曾慶杰（前作《九重紫》）的畫面經營、編劇前十集的身世懸念、西固巷市井群像與「先婚後愛」的細膩處理，認為角色沒有臉譜化。幾乎沒有批評。立場：強推。
   - 原文：「一個很可能被庸俗化的故事，卻沒有一個角色人設是被『臉譜化』的，兩張青春靓麗的『偶像劇』的臉，卻演出了『文學劇』的深刻、真誠、細膩。」
   - 原文：「《逐玉》的成功恰恰證明了一件事：流量只是開場，內容才是掌聲。」
   - **注意**：他只看前段；後段戰爭與朝堂線正是其他評論的主要批評點（見分歧）。方格子 vocus「凱C的不專業影劇評論」（2026-04-08）說前 18 集極好、後段「開高走低」（自媒體，不計）。
5. **分歧**：**本表最大的豆瓣／國際落差**。MDL #1 9.1（46,913 人）、IMDb 8.7（5.9K）、Netflix 非英語週榜 #6、#8、微博 2026 年度電視劇（ratings 檔）；Netflix 台灣 2026-04-12 #2（累計 13 週）、DailyView 2026-10 聲量 #3（fans 檔）。豆瓣 6.4 對 MDL 9.1，差 2.7 分。Sixth Tone 記錄雲合市占率 55.1%（史上第二）同時有收視造假質疑。大陸媒體背景：羊城晚報（2026-03-23，編輯聂粤，partial (Exa)）標題「皮相惊艳，骨相仍需打磨」，批權謀線扁平、節奏偏緩；澎湃評論（經世界日報轉述，2026-03-28）談「粉底液將軍」與古偶窄化。新加坡聯合早報（2026-06-14，partial (Exa)）說「后面的朝堂对决我觉得处理得未免草率又儿戏」。

## 11. 仙台有树 仙台有樹（愛奇藝，2025；英文 Love of the Divine Tree）

1. **Metacritic**：沒有頁面（站內搜尋「divine tree」只有 Family Tree 等，read）。
2. **豆瓣**：**開分 7.0，升到 7.1**。Mobile01，曾心奕，2025-06-16 寫「7.1分（約11.4萬筆評價）」（partial (Exa)）；風傳媒〈風生活〉，魏甫丞，2026-11 仍寫 7.1（https://www.storm.mg/lifestyle/11179623 ，snippet）。騰訊新聞自媒體（2025-05-26）記「开分7.0分，目前涨到了7.1分」。
3. **英文評論**：**沒有找到**（Groundlane 限定清單媒體、Exa 綜合搜尋都只見 MDL 使用者片單）。
4. **中文評論（台灣）**：**沒有找到**。搜尋過：Groundlane 站內限定九個台灣媒體「《仙台有樹》 OR 《入青雲》 OR 《錦月如歌》 劇評 OR 評論」。只有風傳媒片單文（snippet）。
5. **分歧**：**台灣劇迷熱度遠高於評論與國際排行**。fans 檔 8 類訊號（PTT 2025 推薦串 10 人＋原 PO 二刷、2025 最喜歡串 5 人、愛奇藝台灣 2025 年度 #9、上半年 #7 推文約 28 人正評）；亞洲內容大獎 2025 中國區技術類（視效）（awards 檔）；ratings 檔沒有 IMDb／MDL 排名。評論界完全缺席。

## 12. 入青云 入青雲（騰訊視頻，2025；英文 Love in the Clouds）

1. **Metacritic**：沒有頁面（站內搜尋「love in the clouds」沒有相關 TV 結果，read）。
2. **豆瓣**：**7.0**。美人計，Bella，2025-11-04 寫「豆瓣評分很高呢！有7.0分」（partial (Exa)）；風傳媒〈風生活〉，魏甫丞，2026-11 寫 7.0（snippet）。
3. **英文評論**：**沒有找到**。
4. **中文評論（台灣）**：**沒有找到**（同上搜尋）。
5. **分歧**：**國際分數高、評論缺席**。IMDb 8.3（1.9K）、MDL #17 8.8（29,506 人）（ratings 檔）；PTT 2025 最喜歡串 5 人、kamenatsumi「六顆星，入門劇」、Dcard 吾言少女 CP #1、MDL 使用者 2025 清單 #3、Netflix 台灣 2025-10-26 #9（fans 檔）。豆瓣 7.0 對 MDL 8.8。美人計轉述大陸觀眾說「節奏偏慢」。

## 13. 锦月如歌 錦月如歌（愛奇藝，2025；英文 Legend of the Female General）

1. **Metacritic**：沒有頁面（站內搜尋「female general」只有 Single Drunk Female 等，read）。
2. **豆瓣**：**5.4**。美人計，Bella，2025-11-04 寫「豆瓣評分僅5.4，觀眾都在吐槽劇版魔改」（partial (Exa)）；網易訂閱同文轉載（自媒體）。
3. **英文評論**：**沒有找到**。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉，雀雀，2025-08-23，〈《書卷一夢》女演員《錦月如歌》女將軍都要逆天改命！〉。https://stars.udn.com/star/story/10093/8956760 （read；播出期間，與《書卷一夢》合評，本劇約佔一半篇幅；同文刊 500輯）
   - 摘要：她把兩部劇讀成「逆天改命」類型：女主何晏代兄從軍、被奪功後重來，一路假扮不同身分；再談陸劇過審限制讓劇組只敢拍熱賣公式。立場：中性分析（不推不貶）。
   - 原文：「『錦月如歌』的觀影趣味在於周也演戲也演戲中戲，一如多數觀眾生活中也要透過各種角色扮演來適應環境、找尋出路。」
   - 原文：「但最後，觀眾愛看的劇，卻都還是這些主角逆天改命故事，想想豈不諷刺。」
5. **分歧**：**豆瓣低分、台灣與國際劇迷正評**。貓眼 2025 電視劇熱度 #9（ratings 檔）；PTT 2025 推薦串 6 人、kamenatsumi「私心很想給六顆星」、Dcard 吾言少女 CP #2、MDL 使用者 2025 清單 #6、愛奇藝台灣 2025-08 月冠（fans 檔）。豆瓣 5.4 的主因是原著讀者不滿刪掉重生與前夫線（美人計轉述）。

## 14. 星汉灿烂·月升沧海 星漢燦爛．月升滄海（騰訊視頻，2022；英文 Love Like the Galaxy）

1. **Metacritic**：沒有頁面（站內搜尋「love like the galaxy」沒有相關 TV 結果，read）。
2. **豆瓣**：**7.4 升到 7.6–7.7**。美人計，Ruo，2023-02-06 寫「豆瓣評分從7.4上漲到7.6」（partial (Exa)）；美人計，Bella，2024-06-14 寫 7.7（partial (Exa)）；騰訊新聞自媒體（2022-08-23）寫 7.6、32 萬人。
3. **英文評論**：**沒有找到**署名媒體評論。搜尋過：Groundlane 限定清單媒體、Exa「Love Like the Galaxy review … critic」。只有 The Fangirl Verdict、Chinese Drama World 等部落格；A Koala's Playground（八卦部落格，2022-07-07）寫首播時豆瓣短評多為一、二星，批吳磊太瘦、趙露思原聲台詞（snippet，不收，只作首播口碑背景）。
4. **中文評論（台灣）**：udn〈星級評論〉（聯合報），杜沛學（聯合報影劇記者），2022-09-02，〈「星漢燦爛」奠定當紅流量花旦地位 趙露思憑什麼成就觀眾緣？〉。https://stars.udn.com/star/story/10093/6582858 （read；完結後；**以演員評論為主，談劇的篇幅約三分之一**）
   - 摘要：她從趙露思的作品談到程少商，認為「星」「月」兩部之間的訂親戲是全劇最好看的場面，趙露思「毫不做作地演活角色」。立場：推。
   - 原文：「連接『星』劇與『月』劇的訂親戲碼，堪稱全部戲劇最重要、最有看頭的經典場面」
   - 另有娛樂有評，潘光中，2022-08-27〈看《月升滄海》狂嗑CP、戲外世代交替 吳磊、趙露思躍升頂流〉（https://stars.udn.com/star/story/10093/6567110 ，snippet，也是演員取向）。沒有找到以劇本、改編為主的台灣署名劇評。
5. **分歧**：**開播口碑差、完結後上漲；國際排名高、台灣訊號弱**。IMDb 8.3（2.9K）、MDL 上部 #13 8.9（34,812 人）、下部 #11 8.9、雲合 2024 老劇 #9（ratings 檔）；fans 檔只有 PTT 入坑串 1 人，另有人說「自從星漢燦爛之後就沒什麼古裝劇吸引我了」（不計）。

## 15. 嫁金钗 嫁金釵（優酷，2026；英文名 Where the Mask Ends 為 ratings 檔推定）

1. **Metacritic**：沒有頁面（站內搜尋「where the mask ends」沒有相關 TV 結果，read）。
2. **豆瓣**：**開分 7.0**。上報，徐郁雯，2026-11-04 寫「在中國豆瓣評分拿下7分，完勝她之前與張凌赫演出的《逐玉》6.4分」（partial (Exa)）；美人計，Bella，2026-11-02〈十月陸劇評分榜TOP10〉寫 7.0（partial (Exa)）。新浪 k.sina 自媒體（2026-11-03）補充評分分布與「微博开分一度到8.7」（自媒體）。
3. **英文評論**：**沒有找到**（2026-10-16 才開播，搜尋只有 Netflix 上架資訊）。
4. **中文評論（台灣）**：**沒有找到**。只有風傳媒〈風生活〉江勳紘〈《嫁金釵》Netflix台灣衝第一！田曦薇分飾真假千金卻遭B站群嘲〉（2026-10 下旬，snippet，新聞整理）、噓！星聞電視新聞與恬妞專訪（非評論）。
5. **分歧**：**台灣聲量第一、但負評比例高；豆瓣與微博差 1.7 分**。MDL #50 8.6、Netflix 非英語週榜 #7（ratings 檔）；DailyView 2026-10 陸劇聲量 #1（72,784 筆，負評 30%）（fans 檔）。B 站 UP 主大量吐槽「古代沒律法」（風傳媒轉述，snippet）。播出未滿一個月，所有分數都會再變。

## 16. 九重紫 九重紫（騰訊視頻／浙江衛視，2024；英文 Blossom）

1. **Metacritic**：沒有頁面（站內搜尋「blossom」只有 1990 年代美國情境喜劇 `/tv/blossom/` 與《繁花》，read）。
2. **豆瓣**：**7.5 升到 7.8**。香港環球衛視網站（2024-12-27，未署名，內容像大陸行業稿轉載）寫「《永夜星河》《九重紫》以豆瓣7.5分拿下古偶高分口碑」（partial (Exa)）；風傳媒〈風生活〉，魏甫丞，2026-08-27 寫 7.8（snippet）；豆瓣 2025 年度華語劇 #10 7.8（ratings 檔）。
3. **英文評論**：**沒有找到**署名媒體評論。只有 The Fangirl Verdict、Chasing Dramas、The Tea Lady 等部落格（snippet，不收）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉，雀雀，2025-02-08，〈「九重紫」見證清醒比瘋魔痛苦百倍的時刻〉。https://stars.udn.com/star/story/10093/8533990 （read；陸播完結後、台灣愛爾達首播期間；同文刊 500輯〈質青評論〉）
   - 摘要：她說重生劇已是陸劇「鋼需」，本劇公式不新，但宋墨「清醒，本就比瘋魔痛苦百倍」那場戲奠定高度；對孟子義略嫌面癱，也點出劇中父權角色被懲罰。立場：推。
   - 原文：「稍嫌面癱的表演方式所幸有『喜怒不形於色』的相符人設撐著，仍不失其女主該有的氣勢與觀賞性。」
   - 原文：「幸而最後，惡人受懲，也算是陸劇敢於僭越的一次長進表現。」
5. **分歧**：**小成本黑馬，豆瓣、MDL、台灣劇迷一致正評**。IMDb 7.9（1.2K）、MDL #24 8.8、豆瓣 2025 年度 #10、微博 2025 年度突破創新作品（ratings 檔）；產業大會 2024 年度推優（awards 檔）；PTT 2024 最喜歡串 3 人（播出中）、PTT 標題〈2024年最好看的古裝劇－九重紫〉61 推（不計）（fans 檔）。部落格 Chasing Dramas 指出騰訊熱度破 3 萬可能有行銷推升、集均播放不到 2,500 萬（snippet，存疑）。

## 17. 临江仙 臨江仙（愛奇藝，2025；英文 Feud）

1. **Metacritic**：沒有頁面（站內搜尋「feud」只有 Ryan Murphy 的 FEUD 與 Celebrity Family Feud，read）。
2. **豆瓣**：**6.0**。美人計，Bella，2025-11-04 寫「白鹿主演的《臨江仙》…豆瓣評分6.0」，並轉述「開播後網友都在吐槽製作質感差、造型拉低演員顏值」（partial (Exa)）。
3. **英文評論**：**沒有找到**（只有 MDL 條目）。
4. **中文評論（台灣）**：**沒有找到**。搜尋過：Groundlane 站內限定九個台灣媒體「《臨江仙》 OR 《雁回時》 OR 《水龍吟》 OR 《嫁金釵》 劇評 OR 評論」。
5. **分歧**：**播放冠軍、口碑偏低**。雲合 2025 上新劇有效播放前 20、貓眼 2025 日冠次數最多的網劇（24 次）、微博 2025 年度大眾喜愛作品（ratings 檔）；愛奇藝台灣 2025-06 月冠、上半年 #12，但 PTT 推文 3 則負評、推薦串原 PO「快轉看完」（fans 檔）。豆瓣 6.0。

## 18. 雁回时 雁回時（騰訊視頻／東方衛視，2025；英文 The Glory）

1. **Metacritic**：沒有頁面（站內搜尋「the glory」只有韓劇《黑暗榮耀》`/tv/the-glory/`，read）。
2. **豆瓣**：**開分 7.0，完結後 6.8**。Mobile01，曾心奕，2025-06-16 寫「6.8分（約5.9萬筆評價）」（partial (Exa)）；美人計，Bella，2025-11-04 寫 6.8。騰訊新聞自媒體（2025-05-26）說「开分还有7.0分…但后半段就垮了，前面埋的坑没有填…大结局后又慢慢降低了0.2分」（自媒體）。
3. **英文評論**：**沒有找到**。
4. **中文評論（台灣）**：**沒有找到**（同上搜尋；風傳媒只有「最美千金」片單，snippet）。
5. **分歧**：**小成本高熱度、後段口碑下滑**。騰訊 2025 熱度值 #2、微博 2025 年度大眾喜愛作品（ratings 檔）；PTT 2025 推薦串 1 人、Dcard 米米 3.5/5（fans 檔）。豆瓣 7.0→6.8，與「爛尾」說法一致。

## 19. 水龙吟 水龍吟（芒果TV／湖南衛視，2025；英文 Whispers of Fate）

1. **Metacritic**：沒有頁面（站內搜尋「whispers of fate」只有 The Whispers、Fate: The Winx Saga 等，read）。
2. **豆瓣**：**5.7**。美人計，Bella，2025-11-04 寫「羅雲熙《水龍吟》豆瓣開分了，僅5.7」，並轉述「評價比較兩極」（partial (Exa)）。
3. **英文評論**：**沒有找到**。
4. **中文評論（台灣）**：**沒有找到**（同上搜尋；鏡週刊轉 mnews 一篇談 847 套服裝的製作新聞，非評論）。
5. **分歧**：**播放與國際分數高、豆瓣全表倒數第二**。IMDb 8.2（1.9K）、貓眼 2025 網劇有效播放 #2 18.32 億、武俠劇雙榜冠軍、芒果 2025 播放量 #1（ratings 檔）；PTT 2025 推薦串約 22 人、最喜歡串 4 人（另 1 人長篇負評）、DailyView 2025 #10（fans 檔）。豆瓣 5.7 對 IMDb 8.2。**類型提醒**：ratings 檔標為 wuxia mystery，本劇放在「古裝愛情與仙俠」篇是否合適，split-proposal 已列為歸類最不確定。

---

## 總表

| # | 劇名 | Metacritic | 豆瓣（媒體引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | 與鳳行 | 無 | 7.2（COSMO／女人我最大） | 沒有找到 | — | 沒有找到 | — | 播放王者 vs 豆瓣中段、大陸評論兩極 |
| 2 | 國色芳華 | 無 | 7.8（Mobile01／COSMO）；錦繡芳華無 | 沒有找到 | — | 500輯／潘光中（播出中） | read | 各指標一致，台灣討論偏冷 |
| 3 | 墨雨雲間 | 無 | 6.9→6.6（COSMO／妞新聞） | India Today／Bhavna Agarwal（清單外） | partial (Exa) | 電影神搜、500輯／潘光中 ×2 | read | 豆瓣 6.6 vs MDL 8.8 |
| 4 | 折腰 | 無 | 6.4→6.6（Mobile01／美人計） | 沒有找到 | — | 獨立評論／廖芳潔 | read (Exa) | 台灣熱度最高 vs 豆瓣低 |
| 5 | 長相思 | 無 | S1 7.6→7.8（美人計）；S2 6.6（自媒體） | 沒有找到 | — | 娛樂有評／潘光中（S1） | read | S1 雙收 vs S2 口碑下滑 |
| 6 | 惜花芷 | 無 | 7.1→7.4（COSMO／女人我最大） | The Diarist.ph／Liana Garcellano（清單外，議題短評） | partial (Exa) | 沒有找到 | — | 長尾口碑 vs 台灣討論低 |
| 7 | 永夜星河 | 無 | 7.5–7.6（Global Times／風傳媒） | 沒有找到 | — | 電影神搜／白話雯（首 3 集開箱，介紹型） | read | 熱度一致 vs 結局分裂 |
| 8 | 知否知否應是綠肥紅瘦 | 無 | 7.5→7.9（界面／美人計） | 沒有找到 | — | 娛樂有評／柯志遠（播出中） | read | 長尾上升 vs 原著讀者不滿 |
| 9 | 蒼蘭訣 | 無 | 7.7→8.2（美人計／風傳媒） | Collider／Michele Kirichanskaya；SCMP／Stephen McCarty | read；partial | 娛樂有評／雀雀；udn 星級評論（未署名） | read | 各方一致高 vs 台灣訊號弱 |
| 10 | 逐玉 | 無 | 6.6→6.4（Sixth Tone／上報） | Screen Rant／J.R. Waugh（清單外）；The Citizen／Ellie White-Stevens（清單外） | partial (Exa) | NOWnews／柯志遠（開播一週） | read (Exa) | MDL 9.1 vs 豆瓣 6.4（全表最大） |
| 11 | 仙台有樹 | 無 | 7.0→7.1（Mobile01／風傳媒） | 沒有找到 | — | 沒有找到 | — | 台灣劇迷熱 vs 評論缺席 |
| 12 | 入青雲 | 無 | 7.0（美人計／風傳媒） | 沒有找到 | — | 沒有找到 | — | MDL 8.8 vs 評論缺席 |
| 13 | 錦月如歌 | 無 | 5.4（美人計） | 沒有找到 | — | 娛樂有評／雀雀（與書卷一夢合評） | read | 台灣劇迷正評 vs 豆瓣 5.4 |
| 14 | 星漢燦爛．月升滄海 | 無 | 7.4→7.7（美人計） | 沒有找到 | — | udn 星級評論／杜沛學（演員取向） | read | 開播差評 vs 完結回升 |
| 15 | 嫁金釵 | 無 | 7.0（上報／美人計） | 沒有找到 | — | 沒有找到 | — | 台灣聲量第一 vs 負評 30% |
| 16 | 九重紫 | 無 | 7.5→7.8（香港環球衛視／風傳媒） | 沒有找到 | — | 娛樂有評（500輯同文）／雀雀 | read | 黑馬，各方正評 |
| 17 | 臨江仙 | 無 | 6.0（美人計） | 沒有找到 | — | 沒有找到 | — | 日冠王 vs 豆瓣 6.0 |
| 18 | 雁回時 | 無 | 7.0→6.8（Mobile01／美人計） | 沒有找到 | — | 沒有找到 | — | 熱度高 vs 後段爛尾 |
| 19 | 水龍吟 | 無 | 5.7（美人計） | 沒有找到 | — | 沒有找到 | — | IMDb 8.2 vs 豆瓣 5.7 |

「→」= 不同時間的媒體引述分數不同，前為較早、後為較晚。

## 缺口

1. **Metacritic**：19 部全部沒有頁面。陸劇古偶在 Metacritic 完全空白，正文可以直接寫「沒有 Metacritic 頁面」。
2. **豆瓣**：19 部都有媒體引述，但主力是台港生活娛樂網站的排行文（美人計 Bella 一人就提供近一半劇的分數），不是新聞報導；正文引用時寫「據台灣媒體整理的豆瓣分數」並附時間點較穩。分數會漂移（墨雨雲間 6.9→6.6、蒼蘭訣 7.7→8.2、雁回時 7.0→6.8），要寫「約」或寫時間。長相思第二季 6.6 只有自媒體來源；錦繡芳華沒有可用來源。嫁金釵播出未滿一個月。
3. **英文評論覆蓋極差**：清單內媒體只有蒼蘭訣（Collider read、SCMP partial）。另 3 部靠清單外：墨雨雲間（India Today）、惜花芷（The Diarist.ph，議題短評）、逐玉（Screen Rant、The Citizen）。**15 部完全沒有署名英文劇評**，正文不要寫「外媒評」。India Today、Screen Rant、The Citizen、Diarist 都只讀到 Exa 長摘要（partial），引用前最好再讀全文。
4. **只評首集或播出中**：永夜星河（首 3 集開箱）、知否（約到 34 集）、逐玉（開播一週）、國色芳華（播出中）、錦月如歌（播出中，合評）。引用時要寫明；逐玉的柯志遠強推只涵蓋前段，而所有批評都集中在後段。
5. **台灣中文評論**：11 部有文章，其中可當「劇評」用的 8 部（國色芳華、墨雨雲間、折腰、長相思、知否、蒼蘭訣、逐玉、九重紫）＋ 錦月如歌（分析型）；永夜星河是開箱、星漢燦爛是演員評論。**作者集中**：潘光中 4 篇、雀雀 3 篇、柯志遠 2 篇，三人佔 9／12。與鳳行、惜花芷、仙台有樹、入青雲、嫁金釵、臨江仙、雁回時、水龍吟 8 部沒有找到台灣署名評論；鏡週刊、關鍵評論網、VERSE、釀電影對本表 19 部都只有新聞或片單。
6. 「分歧」欄的大陸媒體評論（京報網、中國青年報、光明網、界面、澎湃、羊城晚報）與新加坡聯合早報多是 partial (Exa)，只作背景；嫁金釵的英文名 Where the Mask Ends 是 ratings 檔推定，上報與風傳媒確認了 Netflix 台灣上架，但英文名仍未直接核對。

## toolDegradation

- **Groundlane MCP**（`web_extract`／`web_search`／`web_fetch`）為主：Metacritic 19 次站內搜尋用 `web_extract` pattern 讀到；台灣評論（娛樂有評 7 篇、500輯 2 篇、電影神搜 2 篇）、Sixth Tone 2 篇、Collider 用 `web_fetch` 讀到。Groundlane 搜尋內部 tavily／exa provider 多次回 unavailable，由 brave／you 補上。SCMP 用 `web_fetch` 回 browser-challenge 錯誤。
- **Exa**：`web_search_exa` 用來找英文評論、豆瓣排行文、獨立評論與 NOWnews；`web_fetch_exa` 讀到獨立評論（廖芳潔）全文、SCMP 前三段。India Today、Screen Rant、The Citizen、The Diarist.ph、羊城晚報、聯合早報、京報網、中青報、光明網、界面、Mobile01、美人計、COSMO 等只用到搜尋結果的長摘要（partial）。柯志遠《逐玉》全文由 Exa 搜尋結果帶出（Yahoo／PChome 轉載）。
- **jina**：`read_url` 讀到 SCMP〈What a view〉蒼蘭訣前半（question 模式需要 API key，回傳全文但文章本身只拿到前半）。
- **Tavily**：未使用（已知額度不足；Groundlane＋Exa＋jina 已足夠）。**Firecrawl**、**終端機 curl**：未使用。**Groundlane 直接 HTTP／Keenable／You.com keyless**：未需要。
