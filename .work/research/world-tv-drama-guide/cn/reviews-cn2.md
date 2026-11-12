# CN2 評價資料表：陸劇｜權謀、懸疑、武俠與奇幻 15 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-12。片單來自 `post-cn2-shows.txt`（大陸原名｜台灣譯名）。IMDb／MDL／豆瓣年度榜／雲合／燈塔／貓眼沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、台灣 PTT／LINE TODAY／DailyView／Netflix 台灣週榜沿用 `candidates-fans-taiwan.md`，這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（strange tales of tang、joy of life、zang hai、nirvana in fire、dafeng、guardians of the dafeng、vendetta of an、immortal ascension、mortal's journey、i am nobody、blood of youth、blood river、the long season、reborn、trilateral slopes、sleepless、the early spring） | Groundlane `web_extract`（render=never，抓 `/tv/` 連結） | 15/15 read：**全部沒有頁面**。搜尋頁前 9 個 `/tv/` 連結是站方熱門推薦（The Good Daughter、The Body、It Gets Worse、Black Doves S2 等），每次都出現，不算結果。新生的英文片名是 Regeneration、不眠日是 Mobius，兩者是搜完才查到的英文名，Metacritic 只用 reborn／sleepless 查過（見各條） |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；豆瓣 subject 頁沒有讀，沒有繞過 sec.douban.com | Groundlane `web_search`、Exa search／fetch | 15 部都有媒體或準媒體引述的分數，但來源品質落差大：台灣媒體以 **風傳媒〈風生活〉魏甫丞的豆瓣排行清單**為大宗（同一作者 5 部，榜單型文章，非評論）；大陸媒體（澎湃、三聯、中國青年報、Global Times、新浪財經）另記；幾部只有台灣美妝網站 beauty321 或英文部落格引述，標明「準媒體／自媒體」 |
| 英文評論 | 署名評論，讀全文或大半 | Exa `web_search_exa`／`web_fetch_exa`；Groundlane `web_fetch`（Sixth Tone） | **清單內媒體（SCMP、Sixth Tone、Guardian、Variety、Screen Daily、NYT、Diplomat）全部沒有找到署名劇評**；Sixth Tone 有一篇漫長的季節評析，作者欄沒讀到。主流媒體但不在清單：Foreign Policy（漫長的季節）、Asia Times（琅琊榜）、Gulf News（不眠日）、India Today（早春晴朗）。其餘 11 部只有清單外小站或部落格 |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、500輯、天下獨立評論、風傳媒評論、鏡週刊、關鍵評論網、釀電影、VERSE | Groundlane `web_search`（domains 限定 news.agentm.tw／stars.udn.com／mirrormedia.mg／thenewslens.com／filmaholic.com.tw／500times.udn.com／verse.com.tw／opinion.cw.com.tw／storm.mg／upmedia.mg）＋ `web_fetch`；獨立評論、Harper's BAZAAR 台灣改用 Exa | 清單內媒體的署名評論只有 **5 部**（唐朝詭事錄、慶餘年、琅琊榜〔風傳媒投書〕、漫長的季節）。另有 3 部用 Harper's BAZAAR 台灣版（時尚雜誌網站，介紹兼評論，同一作者 Hayley Yu）。其餘 7 部只有新聞、懶人包、網友反應整理或自媒體 |

標記說明：**read** = 工具讀到頁面內文；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段或一半，或只看到 Exa 搜尋結果裡的長摘要；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：**清單內 0**。主流但清單外：Foreign Policy 1（漫長的季節，James Palmer）、Asia Times 1（琅琊榜，George Koo）、Gulf News 1（不眠日，Lakshana N Palat）、India Today 1（早春晴朗，Bhavna Agarwal）。學術：MCLC Resource Center（俄亥俄州立大學，Thomas Chen）1（漫長的季節）。**清單外小站／部落格**：Chasing Dramas 3（唐詭西行、邊水往事、暗河傳；作者都是 Karen and Cathy，到上限；另有慶餘年2 一篇未用）、Cnovelholic 2（長安二十四計、凡人修仙傳，都是 Iya Moyya）、Drama Tea 1（少年歌行，The Tea Lady）、easternkicks 1（慶餘年 S1，Deborah Valentine，英國亞洲電影網站）、Strange Horizons 1（琅琊榜，Erin Horáková，科幻文學評論刊物）、Red Taotie 1（藏海傳，Alessandra，義大利陸劇部落格英文版）、Read Between the Subtitles 1（大奉打更人，Mary，看到第 10 集棄劇）、K & C Drama Musings 1（異人之下，署名只有站名）、40somethingahjumma 1（新生，Substack，匿名）。
>
> **陸劇的英文評論生態跟日劇不同**：英文媒體談這些劇，多是談「現象」而非評「作品」——Sixth Tone 三篇談漫長的季節的東北／下崗議題、SCMP 只在產業報導提到琅琊榜的點閱數。主力是 MyDramaList 使用者評論（PeachBlossomGoddess 一人就寫了唐詭西行、慶餘年2、新生、邊水往事、長安二十四計、暗河傳），不收。英文 Netflix 上架劇（不眠日、早春晴朗）反而有南亞、中東的大報評論，因為 Netflix 有在地推廣。
>
> 台灣中文評論：**作者集中在潘光中**（娛樂有評唐詭、500輯〈質青評論〉慶餘年2、電影神搜〈開箱劇評〉慶餘年2，三篇同一人）與 **Hayley Yu**（Harper's BAZAAR 台灣：不眠日、長安二十四計、暗河傳）。其他作者：麥若愚（娛樂有評，慶餘年 S1）、聽風的先生（風傳媒〈觀點投書〉，琅琊榜，自由撰稿人）、廖芳潔（獨立評論＠天下，漫長的季節）。台灣媒體評陸劇的量明顯少於日韓劇：上報、Vogue、ELLE、Marie Claire、Cosmopolitan、beauty321 的陸劇文章幾乎都是「看點懶人包」或「網友評價整理」，不算評論。所有讀到的文章都沒有「合作／贊助」標記，但 Harper's BAZAAR 的陸劇文章都掛「Netflix 陸劇推薦」並附上架資訊，帶平台導流性質。

---

## 1. 唐朝诡事录之西行（系列）｜唐朝詭事錄之西行（愛奇藝，2022／2024／2025；英文 Strange Tales of Tang Dynasty）

1. **Metacritic**：沒有頁面（站內搜尋「strange tales of tang」只有 Stranger Things: Tales From '85 等，read）。
2. **豆瓣**：**西行 8.6**。風傳媒〈風生活〉，魏甫丞，2026-07-27，〈不只《百花殺》好看！近3年高分古裝陸劇TOP10排行出爐〉，把唐詭西行列第 1、豆瓣 8.6。https://www.storm.mg/lifestyle/11151866 （snippet；排行清單，非評論）。之長安 8.0（燈塔 2025 年度榜新聞轉載，ratings 檔）。
3. **英文評論**：Chasing Dramas，Karen and Cathy，日期未標（第 26 集時寫初評，完結後補終評），〈Review: Strange Tales of Tang Dynasty II To the West (2024)〉。https://www.chasingdramas.com/reviews/currently-watching-strange-tales-of-tang-dynasty-ii-to-the-west-2024-%E5%94%90%E6%9C%9D%E8%AF%A1%E4%BA%8B%E5%BD%95%E8%A5%BF%E8%A1%8C/ （read (Exa)，讀到前半；評全 40 集）。**注意**：清單外部落格，兩位作者合寫。
   - 摘要：她們認為第二季比第一季好看，主角群互動更自然，盧凌風收斂了第一季的傲氣；單元案件有強有弱，但西域風景、歷史細節和武打都在水準之上，「highly re-watchable」。立場：推。
   - 原文：「Definitely an enjoyable watch with beautiful vistas, intriguing cases, decent martial arts, a diverse cast and a healthy amount of history. Though some cases were stronger than others, this drama is highly re-watchable.」
   - 清單內媒體沒有找到。另有 K & C Drama Musings（2024-10-09，snippet）。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），潘光中，2024-08-31，〈打破熱門IP與流量演員迷思《唐朝詭事錄》系列締造新一代良心劇王逆襲傳奇〉。https://stars.udn.com/star/story/10093/8196683 （read；談系列一、二季，西行播出期間）
   - 摘要：他說唐詭沒有熱門 IP 也沒有流量演員，靠「推理邏輯的奇譎、案件進展的奇詭、視覺效果的奇觀」殺出重圍；西行「擺脫了近年每逢續集必爛尾的宿命」。文中拿台灣《戲說台灣》類比單元劇形式，但說預算與製作嚴謹度高出許多。立場：推。
   - 原文：「推理邏輯的奇譎、案件進展的奇詭、視覺效果的奇觀，這三奇成了《唐詭》系列在亂局中殺出一條血路的最大手段」
   - 鏡週刊、上報另有拍攝花絮與造型抄襲爭議新聞（2024-07／08，snippet，非評論）。
5. **分歧**：**評審、豆瓣、收視、台灣劇迷四方一致，英文媒體缺席**。豆瓣年度最高分華語劇集 DB22 #9、DB24 #5（西行 8.6）、DB25 #7（長安 8.0）；雲合 2024 西行 20.2 億、燈塔 2024 網劇榜 #2 懸疑劇冠軍（ratings 檔）；AACA 2025 最佳劇集大獎（西行）、白玉蘭 2026 提名（長安）（awards 檔）；PTT 2024 最喜歡串唐詭2 約 24 推、LINE TODAY 2024 陸劇 #5（fans 檔）。15 部裡跨榜最多的一部，沒有明顯落差；唯一的落差是英文主流媒體完全沒評過。

## 2. 庆余年（S1–S2）｜慶餘年（騰訊視頻／愛奇藝／CCTV-8，2019；第二季 2024；英文 Joy of Life）

1. **Metacritic**：沒有頁面（站內搜尋「joy of life」只有 The Lying Life of Adults 等，read）。
2. **豆瓣**：**第一季 7.9**。風傳媒〈風生活〉，魏甫丞，2026-09-17，〈《慶餘年》輸了！張若昀最強陸劇TOP10冠軍是它〉列「《慶餘年 第一季》｜豆瓣評價：7.9分」。https://www.storm.mg/lifestyle/11164925 （snippet；排行清單）。第二季沒有找到媒體引述的分數；大公報（香港，2024-06-16）說第二季「整體的觀感還是略遜於第一季」（https://www.tkww.hk/epaper/view/newsDetail/1802055695076560896.html ，partial (Exa)，沒有分數）。
3. **英文評論**：easternkicks.com，Deborah Valentine，2023-04-12，〈Series review: Joy Of Life〉。https://www.easternkicks.com/reviews/joy-of-life/ （read (Exa)，讀到約六成；評第一季全 46 集）。**注意**：easternkicks 是英國的亞洲電影評論網站，不在原清單。
   - 摘要：她說這是一部把武俠、宮鬥、科幻與喜劇「像拉太妃糖一樣拉長」的劇，誇張但不淪為惡搞；陳道明的皇帝「unparalleled」；劇情複雜，觀眾要有心理準備。立場：推。
   - 原文：「Does it sometimes verge on ridiculous? Yes! Brilliantly so! … But for all the humour and complications it never falls into the abyss of spoof-dom.」
   - 第二季：The Straits Times〈Film and TV picks〉（Jan Lee、John Lui，2024-06-06，snippet，推薦短文，非完整評論）；Chasing Dramas（Karen and Cathy）給 7.3/10，說「does not surpass season 1」（partial (Exa)，因該站已用滿 3 部，正文不用）。清單內媒體沒有找到。
4. **中文評論（台灣）**：
   - 第一季：聯合報〈娛樂有評〉，麥若愚（資深媒體人、影評人），2020-06-13，〈睿智奇情的「慶餘年」應該要再創「瑯玡榜」高潮〉。https://stars.udn.com/star/story/10093/4631646 （read (Exa)；評第一季全 46 集）
     - 摘要：他把慶餘年和琅琊榜對照：同樣改編網文、架空歷史、皇室權鬥，琅琊榜嚴肅悲情、慶餘年睿智詼諧；穿越只落在「寫紅樓、背詩詞」的文學意境上。立場：推。
     - 原文：「我追看46集 (首季終未完待續)的興味等同當年看「瑯玡榜」……「瑯玡榜」嚴肅悲情，「慶餘年」睿智詼諧 (更精準的形容: 應該是好看的搞笑)。」
   - 第二季：500輯〈質青評論〉，潘光中，2024-05-25，〈《慶餘年第二季》：良心劇王回歸「以今諭古、藉古諷今」〉。https://500times.udn.com/wtimes/story/120840/7985837 （read；播出中，評約前半）
     - 摘要：他說第二季製作精良，無愧「良心劇王」，編劇王倦原創比例大但沒有背離原著精神；缺點是花了近六集處理范閑假死。立場：推（保留前段節奏）。
     - 原文：「耗費了將近六集的篇幅，反覆繞在范閑如何脫出自己設下的假死困局……就推進節奏上來說不可謂不拖沓。」
   - 同作者在電影神搜另有〈【開箱劇評】Disney+《慶餘年第二季》〉（2024-05-22，https://news.agentm.tw/280224/ ，read；只評前幾集），立場相同，正文二選一即可。
5. **分歧**：**第一季的評價與第二季的熱度倒掛**。IMDb 8.2（2.7K）、MDL #7（S1）／#16（S2）；雲合 2024 第二季 45.1 億排第 1、燈塔 2024 電視劇榜 #1（ratings 檔）；白玉蘭 2020 提名、白玉蘭 2025 提名（S2）（awards 檔）；LINE TODAY 2024 陸劇 #1（第二季）、PTT 2019 最愛串約 35 推（fans 檔）。第二季播放量最高，但豆瓣、大公報、英文部落格與 MDL 長評都說「不如第一季」；風傳媒 2026-03 報導中視重播時說第二季「評價卻兩極」（snippet）。

## 3. 藏海传｜藏海傳（CCTV-8／優酷，2025；英文 Legend of Zang Hai）

1. **Metacritic**：沒有頁面（站內搜尋「zang hai」只有 Hairspray Live! 等，read）。
2. **豆瓣**：**7.1**。風傳媒〈風生活〉，魏甫丞，2026-08-04，〈《藏海傳》《陳情令》輸了！肖戰演過評價最高陸劇TOP10〉：「藏海《藏海傳》｜豆瓣評分：7.1分」。https://www.storm.mg/lifestyle/11153799 （snippet；排行清單）。英文站 Maomaohype（2025-07-07）也寫 7.1，並翻譯了幾則豆瓣短評（partial (Exa)，自媒體，不採用為來源）。
3. **英文評論**：Red Taotie，Alessandra，2025-07-04，〈Legend of Zang Hai (2025): Xiao Zhan Returns with a Drama That Lives Up to the Hype? | Review & Ending〉。https://www.redtaotie.com/blog/legend-of-zang-hai-2025/ （partial (Exa)：讀到前段與「In a Nutshell」總評，後段只看到搜尋摘要；評全 40 集）。**注意**：清單外，義大利陸劇部落格的英文版。
   - 摘要：她給 8/10，說強項是複雜的角色、劇本深度和視覺；弱點是節奏起伏、部分敘事元素不協調、愛情線薄弱。藏海的計謀大多事先讓觀眾知道，加上主角不能死，反轉的張力有限。立場：推（有保留）。
   - 原文：「The twists, however, are inevitably limited by the fact that the protagonist can neither die nor be unmasked — otherwise the story would end — and by the fact that his stratagems are almost always revealed to the viewer in advance」
   - 另有 Drama Slot（署名 Drama Addict，2025-06-11，snippet）、cyn lynn 部落格（3/5，snippet）。清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。搜尋過：Groundlane 站內限定電影神搜、娛樂有評、上報、關鍵評論網、獨立評論、釀電影、鏡週刊、風傳媒（「藏海傳 劇評 肖戰」）、Exa「《藏海傳》 劇評 鄭曉龍 肖戰 繁體 評論 台灣」。只找到：上報〈《藏海傳》肖戰演技超越舊作《慶餘年》獲好評 劇情卻因2大敗筆慘遭吐槽〉（2025-05-23，snippet，網友評論整理）、噓！星聞電視新聞兩則（2025-05-25、2026-04-23 台灣電視台首播，snippet，非評論）、TVBS 女人我最大懶人包（陳亮貽，2025-06-04，partial，介紹型，文中「零負評」「IMDb 9.1」等數字未查證，不要引用）。
   - 背景（大陸媒體，不算台灣評論）：國際在線〈台青觀《藏海傳》〉（林卉妤，2025-06-06，partial (Exa)，作者是在大陸工作的台灣青年，刊在官方媒體的「兩岸觀察」欄，有統戰宣傳性質）；潮新聞〈潮劇評〉（崇雪利，浙江傳媒學院研究生，2025-05-28，partial (Exa)，播出過半時寫）。
5. **分歧**：**播放量冠軍、豆瓣 7 分出頭，評分被粉絲戰拉扯**。IMDb 8.2（24K，15 部中票數最多）；雲合 2025 上新劇 #1 22.3 億、燈塔 2025 #1 28.75 億、貓眼雙榜 #1（ratings 檔）；白玉蘭 2026 提名（awards 檔）；PTT 2025 推薦串約 19 推、kamenatsumi「褒貶互見，劇本動機存疑」、DailyView 2025 #5（fans 檔）。豆瓣 7.1 和 IMDb 8.2 落差 1.1 分；Maomaohype 翻譯的豆瓣短評與 MDL 長評都提到「主角靠主角光環」「愛情線沒化學反應」，而肖戰粉絲與反粉的打分戰在多篇英文評論中被點名（cyn lynn、MDL ChineseDramaFan，snippet）。

## 4. 琅琊榜｜琅琊榜（北京衛視／東方衛視，2015；英文 Nirvana in Fire）

1. **Metacritic**：沒有頁面（站內搜尋「nirvana in fire」只有 Halt and Catch Fire 等，read）。
2. **豆瓣**：**9.4**。澎湃新聞〈有戲〉，2025-09-19，〈《琅琊榜》开播十年，还有新粮！胡歌以梅长苏之名献声〉：「正值豆瓣9.4分的古装权谋剧《琅琊榜》开播十周年」。https://www.thepaper.cn/newsDetail_forward_31633582 （snippet；大陸媒體）。網易號自媒體（2025-06-14）也寫 9.4、十年不變（snippet，自媒體，不採用）。
3. **英文評論**：
   - Asia Times，George Koo，2016-06-06，〈Review: 'Nirvana in Fire,' a historical drama from China〉。https://asiatimes.com/2016/06/review-nirvana-in-fire-a-historical-drama-from-china/ （read (Exa)，讀到約七成；在 YouTube 看完全 54 集）。**注意**：Asia Times 不在原清單；文章以作者年少讀武俠連載的懷舊開頭，比較像觀後感式專欄，不是專職影評。
     - 摘要：他把本劇比作年少時追的武俠連載，稱讚攝影、服裝、武打與大卡司表演，角色動機一致，54 集幾乎沒有矛盾。立場：推。
     - 原文：「The script paid careful attention to details. Over the 54 episodes, inconsistencies were rare. Each character had logical reasons and motivation for his/her actions.」
   - Strange Horizons，Erin Horáková，2018-02-12，〈Nirvana in Fire (Lángyá Bǎng)〉。https://strangehorizons.com/wordpress/non-fiction/reviews/nirvana-in-fire-langya-bang/ （partial (Exa)：讀到前四成；評全劇）。**注意**：Strange Horizons 是英文科幻文學評論刊物，清單外。
     - 摘要：她批評英語媒體只追捧美英「prestige TV」卻完全忽略這部 130 億點閱的陸劇；把本劇讀成「超級英雄式武俠」，說它與《權力遊戲》表面相似實則不同，暴力或風格化、或接近 Bondarchuk 與黑澤明的大場面。立場：強推。
     - 原文：「Of course, a Chinese series may have 13 billion "legitimate" views … and yet raise not one whisper in Anglophone media discourse.」
   - 另有 The Cultural Gutter（Guttersnipe，2018-07-19，partial (Exa)），談本劇對政治正義的保留：主角最後仍相信「明君」而非制度改革。清單內媒體沒有找到。
4. **中文評論（台灣）**：風傳媒〈觀點投書〉，聽風的先生（自由撰稿人），2026-07-11，〈《琅琊榜》一部大陸古裝劇，為何能在台灣「靜悄悄」追了十年？〉。https://www.storm.mg/article/11147824 （read）。**注意**：投書，非風傳媒編輯部或專欄作家；談的是本劇在台灣的接受史，評論性高但不是完整劇評。
   - 摘要：他說琅琊榜賣的不是宮鬥，而是「士大夫精神的現代轉譯」，對台灣法律圈、公職圈像「體制內改革者的模擬器」；正午陽光以低飽和色調與克制表演，對上台灣觀眾對陸劇「五毛特效、磨皮濾鏡」的耐受天花板。立場：推。
   - 原文：「《琅琊榜》能破圈，導演孔笙、李雪與製作方正午陽光給出的答案是：把「克制」當美學。」
   - 噓！星聞、上報另有馬拉松直播與胡歌幕後新聞（snippet，非評論）。
5. **分歧**：**豆瓣、IMDb、MDL 全面高分，獎項記錄反而少**。IMDb 8.8（3.7K）、MDL #3 9.0（14,182 人）、雲合 2024 老劇播放 #10（ratings 檔）；awards 檔只有白玉蘭 2016 提名（另有網易號提到飛天獎、華鼎獎，snippet，未查證）；PTT〈大家入坑陸劇的第一部〉約 12 推居首（fans 檔）。豆瓣 9.4 與 MDL 9.0、IMDb 8.8 幾乎沒有落差，是 15 部中中外評價最一致的。The Cultural Gutter 的政治保留是英文評論中唯一的異聲。

## 5. 大奉打更人｜大奉打更人（騰訊視頻／CCTV-8，2024-12～2025-01；英文 Guardians of the Dafeng）

1. **Metacritic**：沒有頁面（站內搜尋「dafeng」「guardians of the dafeng」只有站方推薦與 Guardians of the Galaxy 等，read）。
2. **豆瓣**：**5.6（約 18 萬人）**。燈塔 2025 年度播放量 TOP10 新聞轉載（騰訊新聞，2025-12-29）印出「豆瓣 5.6/18万」（ratings 檔，read）。開分 5.4：A Koala's Playground（ockoala，2025-01-13，〈Guardians of the Dafeng Crosses the Vaunted 30,000 Heat Index in Tencent But Opens with a Low 5.4 on Douban Ratings〉，https://koalasplayground.com/2025/01/13/guardians-of-the-dafeng-crosses-the-vaunted-30000-heat-index-in-tencent-but-opens-with-a-low-5-4-on-douban-ratings/ ，partial (Exa)；英文八卦部落格，作者自稱很愛這部劇）。
3. **英文評論**：Read Between the Subtitles，Mary，2026-08-15，〈Guardians of the Dafeng: Dropped Drama Diaries〉。https://www.readbetweenthesubtitles.com/post/guardians-of-the-dafeng-dropped-drama-diaries （read (Exa)；**只看到第 10 集就棄劇**）。**注意**：清單外部落格，短評。
   - 摘要：她說本劇是「沒人要求的、比較不精緻的慶餘年」，像給武俠加上漫威式改造，好笑但「plastic」；她認為本劇在海外比在中國受歡迎，因為笑點和「復仇者集結」結構迎合西方口味。棄劇原因：女主角寫得煩、沒有情感連結。立場：不推（但承認好玩）。
   - 原文：「Guardians of Dafeng is the glossy, less sophisticated answer to Joy of Life that no one asked for, but it was still fun.」
   - 清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。搜尋過 Groundlane 站內限定（「大奉打更人 王鶴棣 劇評 評價」）、Harper's BAZAAR／Vogue／GQ 台灣。只找到：上報〈王鶴棣《大奉打更人》憑3關鍵口碑起死回生〉（2025-01-13，snippet）、〈《大奉打更人》結局王鶴棣哭戲封神翻轉負評〉（2025-01-22，snippet），兩篇都是網友反應整理；電影神搜〈3 大看點推薦〉（2024-12-26，snippet，上架介紹）；Vogue Taiwan 開播與粉絲福利新聞（snippet）。
5. **分歧**：**15 部中豆瓣與國際評分落差最大**。豆瓣 5.6 vs MDL #42 8.6、IMDb 7.8（1.2K）；雲合 2025 #2 22.1 億、貓眼 2025 熱度 #3、喜劇類雙榜冠軍、微博年度影響力作品（ratings 檔）；awards 檔沒有它。落差 3 分。英文部落格兩派都把原因指向演員（Koala 說大陸網友對王鶴棣台詞「有恨」）與調性（Mary 說海外比國內受歡迎）；上報整理的台灣網友反應是「開高走低、後段翻轉」。正文可以用「國內打 5 分、海外打 8 分」這個落差當例子，但兩邊的解釋都只來自部落格與新聞整理。

## 6. 长安二十四计｜長安二十四計（優酷／CCTV，2025-12；英文 The Vendetta of An）

1. **Metacritic**：沒有頁面（站內搜尋「vendetta of an」只有 Sons of Anarchy 等，read）。
2. **豆瓣**：**沒有找到媒體引述的正式分數**。新浪財經頭條（2025-12，snippet）稱「豆瓣开分传闻为8.9分，但实际开分前已出现评分系统崩溃，疑似因集中打低分导致」；新浪財經、搜狐、中華網（2025-12-17，snippet）報導豆瓣官方回應「處理非正常短評 46491 條」、封禁 3.3 萬個水軍帳號。大陸媒體，只記為背景：**本劇豆瓣分數受刷分事件干擾，不要引用任何單一數字**。
3. **英文評論**：Cnovelholic，Iya Moyya，2026-01-08，〈The Vendetta of An Drama Review〉。https://cnovelholic.com/drama-review/mystery/the-vendetta-of-an-drama-review/ （partial (Exa)：讀到前三成，評分與結論句在頁首；評全 28 集＋特別篇）。**注意**：清單外部落格，同作者本表 2 篇。
   - 摘要：她給 8.8/10，自承平常只看愛情劇，這是她 2025 年最喜歡的陸劇之一；讀到的部分以劇情介紹為主。立場：推。
   - 原文：「The Vendetta of An is a drama you shouldn't miss. Although this one might not be everyone's cup of tea.」
   - 另有 cyn lynn 部落格（2025-12-11，snippet），說前段乾澀難跟、最後「I felt very little」。清單內媒體沒有找到。
4. **中文評論（台灣）**：Harper's BAZAAR 台灣版，Hayley Yu，2025-12-18，〈成毅《長安二十四計》好看嗎？人逢絕境時，活下來、忍下去，然後把帳一筆一筆算清楚〉。https://www.harpersbazaar.com/tw/culture/filmandmusic/a69803343/c-drmam-the-vendetta-of-an/ （read (Exa)；開播一週內）。**注意**：時尚雜誌網站，大半是劇情與角色介紹，評價段落轉述網路聲量；不在原清單。
   - 摘要：她說本劇走「權謀＋復仇＋懸疑探案」路線，資訊密度高；評價段落指出網路聲量「熱度很高、評價兩極」，一派說燒腦、成毅演得好，一派說套路感重，並點到評分結構爭議。立場：中性介紹。
   - 原文：「目前的網路聲量大致呈現「熱度很高、評價兩極」的典型現象。」
   - 另有 Yahoo 奇摩（徐瑞安，2025-12-22，snippet）、ELLE、Marie Claire、beauty321 的看點整理，都是介紹型。PTT〈[心得] 長安二十四計觀後感〉（2026-05-23，網友代貼 69 歲退休長官的 2500 字心得，snippet，使用者文，不收）。
5. **分歧**：**評分被刷分事件污染，熱度與口碑難以分開**。貓眼 2025 電視劇熱度 #5（ratings 檔）；awards 檔沒有它；Netflix 台灣 2025-12-21 週榜 #5、PTT 推文有人稱「2025最強」（fans 檔）。豆瓣分數無法引用；英文部落格一推（8.8）一冷（cyn lynn），MDL 長評給 8.5（PeachBlossomGoddess，snippet）。

## 7. 凡人修仙传（真人剧）｜凡人修仙傳（優酷／浙江衛視，2025；英文 The Immortal Ascension）

1. **Metacritic**：沒有頁面（站內搜尋「immortal ascension」只有 Ascension、Immortalized；「mortal's journey」只有 Journeyman 等，read）。
2. **豆瓣**：**7.5**。噓！星聞（聯合報系）電視新聞，2025-12-20，〈許我耀眼、難哄、折腰爭寶座！2025神回顧十大必看陸劇〉：「豆瓣評分高達7.5分，甚至比《藏海傳》、《大奉打更人》等大男主古裝劇評分都還高」。https://stars.udn.com/star/story/10091/9213372 （snippet；內容引 DailyView／KEYPO 聲量，非評論）。
3. **英文評論**：Cnovelholic，Iya Moyya，2025-10-05，〈The Immortal Ascension Drama Review〉。https://cnovelholic.com/drama-review/wuxia/the-immortal-ascension-drama-review/ （partial (Exa)：讀到前三成；評全 30 集）。**注意**：清單外，同作者本表第 2 篇。
   - 摘要：她給 8.5/10，說自己不是武俠迷也看得下去，劇情「intricate yet fascinating」；搜尋摘要另有一句說楊洋演技比《且試天下》（Who Rules the World）、《特戰榮耀》好。立場：推。
   - 原文：「You should definitely watch The Immortal Ascension drama. The plot is so intricate yet fascinating, that a non-wuxia lover like me could enjoy it.」
   - 另有 Wonderland of Drama（義大利部落格英文版，2025-08-22，snippet）、cyn lynn（2025-07-27，snippet，說「no revenge, no stake」不走近十年仙俠公式）。清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只找到噓！星聞 2025 年度回顧（見上，snippet，聲量整理）、Harper's BAZAAR〈2024古裝陸劇推薦〉片單（2024-12-30，snippet，開播前介紹）。PTT kamenatsumi 年度回顧說「後面有點膩了」（fans 檔，使用者文）。
5. **分歧**：**電視收視、台灣串流與豆瓣都中上，評論界缺席**。貓眼 2025 網路劇有效播放 #3、優酷熱度 #4、微博年度大眾喜愛作品（ratings 檔）；awards 檔沒有它；浙江衛視 2025 年度收視冠軍、PTT 2025 兩串各約 12 推、DailyView 2025 #6、Netflix 台灣 2025-08-17 #3（5 週）、Hami 2025 戲劇 #10（fans 檔）。英文部落格與 MDL 長評一致指出 CGI 落後、最後一段倉促（virgievirgie、PeachBlossomGoddess，snippet）。同名動畫是另一部作品，不要混用分數。

## 8. 异人之下｜異人之下（優酷，2023；第二季《之決戰！碧遊村》2025；英文 I Am Nobody）

1. **Metacritic**：沒有頁面（站內搜尋「i am nobody」只有 Nobody Wants This 等，read）。
2. **豆瓣**：**第二季碧遊村 8.4（約 12.4 萬人）**。風傳媒〈風生活〉，魏甫丞，2026-08-14，〈Netflix近3年最強陸劇TOP10冠軍是它：評價超越《異人之下》〉：「《異人之下之決戰！碧遊村》｜豆瓣評價：8.4分」，並註明評分人數約 12.4 萬。https://www.storm.mg/lifestyle/11156477 （read (Exa)；排行清單）。豆瓣 2025 年度評分最高華語劇集 #2 8.4（ratings 檔）。第一季沒有找到媒體引述的分數。
3. **英文評論**：K & C Drama Musings（署名只有站名「Drama Musings」），2023-09-24，〈"I Am Nobody" Series Review〉。https://kcdramamusings.wordpress.com/2023/09/24/i-am-nobody-series-review/ （partial (Exa)：讀到搜尋結果裡的長摘要；評第一季全 27 集）。**注意**：清單外部落格，沒有個人署名。
   - 摘要：她說這部都市奇幻漫改「ended on a high note」，結合傳統民俗與超能力，主題是被誤導的志向與根深蒂固的父權與狂熱。立場：推。
   - 原文：「It is messy, humorous and heartwarming!」
   - 另有 MovieWeb，Sal Cento，2023-12-29，〈I Am Nobody Cast an AI Actor and Some Fans Didn't Notice〉（https://movieweb.com/ai-actor-lili-ziren-i-am-nobody-worth-it-or-not/ ，partial (Exa)；主題是劇中 AI 演員，順帶稱本劇是「a refreshing blend of martial arts, mystical sorcery, and multi-tiered humor」，不是完整劇評）。清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只找到 vocus「小羊麥仔」〈劇析｜異人之下｜一場自我認同的異旅〉（2023-10-12，partial (Exa)，自媒體，不算媒體評論，可當觀眾聲音背景）；風傳媒排行清單（見豆瓣欄）的段落說第二季「比第一季水準更高了」是引網友話。
5. **分歧**：**第二季豆瓣比第一季高，英文圈卻只談第一季**。MDL #46 8.6（S1）；DB25 #2 8.4（碧遊村）（ratings 檔）；南方都市報 NDY 2023 #8（S1）、亞洲內容大獎 2025 最佳視覺特效（碧遊村）（awards 檔）；PTT 2023 最喜歡串約 11 推、第二季 Netflix 2025-02-28 上線（fans 檔）。第一季開播當天就暫停、之後重新上架，cyn lynn 部落格推測是未取得發行許可、vocus 寫「沒有通過審核就上架」（都是自媒體說法，snippet／partial，未查證），英文 MDL 評論多說後半段 CGI 與劇本變弱（virgievirgie，snippet）。

## 9. 少年歌行｜少年歌行（優酷，2022-12；英文 The Blood of Youth）

1. **Metacritic**：沒有頁面（站內搜尋「blood of youth」只有 Outlander: Blood of My Blood 等，read）。
2. **豆瓣**：**開分 7.3**。beauty321（台灣美妝生活網站），2023-01-22，〈10部古裝武俠劇推薦！《少年歌行》、《山河令》豆瓣開分高〉：「豆瓣更開出了高分7.3」。https://www.beauty321.com/post/52974 （snippet；**準媒體**，作者未署名，片單型文章）。沒有找到新聞媒體引述。
3. **英文評論**：Drama Tea，The Tea Lady（筆名），2024-01-01，〈The Blood of Youth review〉。https://dramatea88.wordpress.com/2024/01/01/the-blood-of-youth-review/ （read (Exa)，讀到約一半；評全 40 集）。**注意**：清單外個人部落格，同作者在 MDL 有濃縮版。
   - 摘要：她本來討厭「電玩式」飛天武俠，結果一口氣追完，列為 2023 年最愛之一；強項是三位少年主角像真的年輕人一樣幼稚衝動、彼此鬥嘴，以及鋪陳懸念的手法（例如一場宴席）。立場：推。
   - 原文：「There is something weirdly addictive about The Blood Of Youth. I usually hate "video game" wuxia with the flying sparkling kung fu, but the characters are compelling.」
   - 另有 Drama Slot（Drama Addict，2023-01-30，partial (Exa)，8/10，說打鬥偏動畫感、反派結局草率、男女主沒火花）、Cnovelholic（The Dewi，9.2，snippet）、40somethingahjumma（Substack，snippet）。清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只找到 beauty321 片單（見上，snippet），文中說「飾演主角的李宏毅演技生澀，無法撐起角色」，非署名評論。Dcard 中國戲劇綜藝板網友給 5★「近幾年最好看的武俠劇」（fans 檔，使用者文）。
5. **分歧**：**國際評分遠高於豆瓣**。MDL #23 8.8、雲合 2024 老劇播放 #8（ratings 檔）；awards 檔沒有它；PTT 2023 最喜歡串約 14 推、Dcard 5★（fans 檔）。豆瓣開分 7.3（準媒體引述）vs MDL 8.8，落差 1.5 分。英文與台灣的保留意見一致落在李宏毅的演技與 CGI；豆瓣短評也有「先看暗河傳再補少年歌行，難以稱得上佳作」的反向意見（snippet，使用者評論，不收）。

## 10. 暗河传｜暗河傳（優酷，2025-10；英文 Blood River；少年歌行系列前傳）

1. **Metacritic**：沒有頁面（站內搜尋「blood river」只有 Riverdale、True Blood 等，read）。
2. **豆瓣**：**開分 7.1、完結後 7.2**。beauty321，2025-11-18，〈10部好看到「豆瓣評分一路上漲」陸劇！〉：「《暗河傳》豆瓣開分7.1，結局又小幅上漲到7.2」。https://www.beauty321.com/post/70238 （snippet；**準媒體**，未署名）。英文 Chasing Dramas 也寫 7.1（partial (Exa)，部落格）。沒有找到新聞媒體引述；豆瓣短評區有「遭惡意打分」「評論被折疊」的粉絲留言（snippet，不收）。
3. **英文評論**：Chasing Dramas，Karen and Cathy，日期未標（第 16 集時的初評），〈Blood River (2025) 暗河传 Review〉。https://www.chasingdramas.com/reviews/currently-watching-blood-river-2025-%e6%9a%97%e6%b2%b3%e4%bc%a0/ （partial (Exa)：讀到搜尋結果長摘要；**只評前 16 集**）。**注意**：清單外，該站本表第 3 篇，到上限。
   - 摘要：初評 6.8/10。她們喜歡「讓殺手組織走向光明」的主題、製作規模與兄弟情，但前幾集角色和派系太多、愛情線弱、部分演員（含龔俊）表演不夠細膩。立場：中性偏保留。
   - 原文：「Overall, I think this is a decent show with many things to like about it, but it is not as captivating a watch as I want it to be.」
   - 另有 Drama Tea（The Tea Lady，2026-04-02，partial (Exa)），說情感衝擊「limp」、遠不如少年歌行。清單內媒體沒有找到。
4. **中文評論（台灣）**：Harper's BAZAAR 台灣版，Hayley Yu，2025-10-24，〈龔俊《暗河傳》好看嗎？以「惡行」出發的善念，也是善的一種嗎？〉。https://www.harpersbazaar.com/tw/culture/filmandmusic/a69116786/what-to-know-about-blood-river/ （read (Exa)；開播約一週，評前幾集）。**注意**：時尚雜誌網站，不在原清單；同作者本表第 3 篇。
   - 摘要：大半篇幅是劇情與角色介紹；評論段落聚焦蘇昌河，把他讀成「以惡之名行善之志」、想推翻讓所有人都成為「刀」的制度的悲劇人物。沒有對製作或表演下判斷。立場：中性介紹（議題式解讀）。
   - 原文：「對他而言，真正的背叛，不是反叛組織，而是繼續沉默。」
5. **分歧**：**台灣熱度高、評論冷**。IMDb 7.6–8.2 區間（分組列，ratings 檔）；awards 檔沒有它；PTT 2025 推薦串約 25 推（全串最多）、2025 最喜歡串 5、jpeg「最喜歡，各種重刷」、Netflix 台灣 2025-10-26 #6（fans 檔）。台灣 PTT 推文數居 15 部之冠，但英文部落格兩篇都偏保留、主要批評龔俊表演與前段資訊量；豆瓣 7.1–7.2 屬中等，且有粉絲刷分與「惡意打分」雙向指控（snippet）。

## 11. 漫长的季节｜漫長的季節（騰訊視頻，2023；英文 The Long Season）

1. **Metacritic**：沒有頁面（站內搜尋「the long season」只有 The Long Road Home、The Long Shadow 等，read）。
2. **豆瓣**：**9.4（逾 90 萬人）**。MCLC Resource Center（俄亥俄州立大學），Thomas Chen，2024-07-08：「On Douban … it has over 900,000 ratings, with an average score of 9.4 out of 10」（read (Exa)，見下）。播出期間：Global Times（2023-05-03，partial (Exa)）說豆瓣開分 9、結局後升到 9.5；澎湃新聞（2023-05-02，partial (Exa)）說「豆瓣开分9.1分……大结局时评分涨到9.5分」。兩者是大陸官方／國營媒體，記為背景。DB23 #1 9.4（ratings 檔）。
3. **英文評論**：
   - Foreign Policy，James Palmer（副主編），2024-02-03，〈'The Long Season' Is the Best TV Show to Come out of China〉（標題另作〈How Did This Brilliant Chinese Rust Belt Noir Get Made Under Xi?〉）。https://foreignpolicy.com/2024/02/03/long-season-tv-review-amazon-prime-china/ （read (Exa)，讀到約八成；評全 12 集，Prime Video 上架後）。**注意**：Foreign Policy 不在原清單，但是主流外交政策雜誌、署名評論。
     - 摘要：他稱本劇是「one of the greatest Chinese dramas ever」，稱讚范偉、秦昊、去老化特效、配樂與東北秋天的攝影；缺點是女性角色只是配角，以及 Prime Video 英文字幕粗糙（例如把居委會成員譯成「elected vigilante」）。後半談為何這樣的作品能在習近平時代拍出來。立場：強推。
     - 原文：「This is a must-watch show, and it's amazing that it got made in today's China.」
     - 原文：「If the show has a flaw, it's in the status of its female characters.」
   - MCLC Resource Center，Thomas Chen，2024-07-08，〈Look Back in Anger: The Long Season (2023)〉。https://u.osu.edu/mclc/online-series/the-long-season/ （read (Exa)，讀到約六成；評全劇）。學術評論，把本劇讀成對「家長式權威」（廠長、沈墨的叔叔、王響）的憤怒，並連結下崗潮與疫情後的社會情緒。立場：推（分析型）。
   - Sixth Tone，2023-06-01，〈A Hit Drama Asks: Who Killed China's Industrial Heartland?〉。https://www.sixthtone.com/news/1013033 （partial：Groundlane 讀到前六成，**作者欄只顯示 Sixth Tone，個人署名在截斷處之後，未確認**）。談本劇如何反轉 1990 年代「下崗是必要之惡」的電影敘事。Sixth Tone 另有 2023-08-23〈The Missing Link in Northeast China's Cultural Revival〉批評本劇女性角色「two-dimensional」（snippet）。
4. **中文評論（台灣）**：獨立評論＠天下（主播台聽不到的聲音專欄），廖芳潔，2025-04-05，〈《漫長的季節》：我們是時代的提線木偶，卻自以為手握人生〉。https://opinion.cw.com.tw/blog/profile/517/article/15978 （read (Exa)；評全劇）
   - 摘要：她說懸疑只是表象，本劇真正講的是「人生」與「選擇」；稱讚秦昊增重演出的龔彪，並預告「10個人裡面我猜有8個人會因為只想知道兇殺案的發展而分心看不下去」。結尾用「很令人不爽（是讚美的意思）」呼應導演名字。立場：推。
   - 原文：「《漫長的季節》僅僅是導演辛爽的第二部長劇，犀利得像是一面鏡子，黏膩得像是口香糖，我至今揮不掉對那些人物每一個無奈舉動的慨歎與共感。」
   - VERSE 另有班宇專訪（snippet，訪談非評論）。
5. **分歧**：**評審、豆瓣、英文評論一致封神，台灣觀眾規模相對小**。IMDb 8.8（1.8K）、豆瓣 9.4、DB23 #1（ratings 檔）；白玉蘭 2024 提名、飛天獎 2024 優秀電視劇、首爾國際電視劇獎 2023 最佳迷你劇列名（與《財閥家的小兒子》並列，awards 檔未分勝負）＋范偉最佳男主角、亞洲內容大獎最佳導演、南方週末與新週刊年度劇集（awards 檔，15 部中獎項來源最多）；PTT 2023 最喜歡串僅 3 推＋原 PO 3 星、2025 推薦串 1 人當標竿（fans 檔）。英文與 Sixth Tone 共同的批評點是女性角色扁平。IMDb 票數只有 1.8K，國際能見度與評價不成比例。

## 12. 新生｜新生（優酷，2024；10 集；英文 Regeneration）

1. **Metacritic**：沒有頁面（站內搜尋「reborn」只有 Heroes Reborn，read）。**注意**：英文官方片名是 Regeneration，搜尋 Metacritic 時用的是 reborn，Regeneration 沒有另外搜。
2. **豆瓣**：**7.0**。風傳媒〈風生活〉，魏甫丞，2026-09-27 與 2026-09-15 兩篇井柏然排行清單都寫「《新生》、豆瓣評價：7.0」。https://www.storm.mg/lifestyle/11160020 、https://www.storm.mg/lifestyle/11163958 （snippet；排行清單）。
3. **英文評論**：40somethingahjumma（Substack，作者匿名），2025-08-16，〈Regeneration 新生 (2025) A Recommendation〉。https://40somethingahjumma.substack.com/p/regeneration-2025-a-recommendation （partial (Exa)：讀到搜尋結果長摘要；評全 10 集）。**注意**：清單外個人電子報，**無署名**，立場帶明顯的保守派文化評論色彩（把本劇讀成對「受害者情結」的批判）。
   - 摘要：她說本劇是阿嘉莎・克莉絲蒂式的孤島推理加《大國民》式多視角，井柏然「at his spectacular best」；她知道結局有爭議，但自己覺得合理。立場：推。
   - 原文：「Once in a while a gem like Regeneration comes along and proves that the C drama industry can succeed with a mini-series underpinned by a good script.」
   - 清單內媒體沒有找到。MDL 使用者評論（featherwing99、PeachBlossomGoddess，snippet）都說前 6 集很強、最後 3 集為了洗白主角而改動原著、出現漏洞。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只找到 Harper's BAZAAR 台灣版，Kelly Hsiao，2024-05-16，〈井柏然《新生》大結局，回顧劇中疑點&名場景！〉（https://www.harpersbazaar.com/tw/culture/drama/g60809806/regeneration-ending/ ，partial (Exa)，**結局回顧＋網友反應整理，屬介紹型**；文中說「大部分網友都認為收官收得太倉促」「從懸疑劇變成勸世劇」）；Tatler Asia 繁中版（Zoe Zw Hsu，2024-05-13，partial，介紹型）；上報兩篇 Netflix 奪冠新聞（snippet）；Netflix追劇筆記本部落格（2024-05-08，partial，自媒體）。
   - 背景（大陸媒體）：北京日報〈羅生門敘事 劇情極限反轉 《新生》找到國產懸疑劇創新點〉（李夏至，2024-05-16，partial (Exa)，偏宣傳）。
5. **分歧**：**台灣 Netflix 冠軍、豆瓣 7 分、結局爭議**。雲合 2024 熱播期集均 #6、燈塔 2024 短劇集榜 #1（ratings 檔）；新週刊 2024 年度劇集＋劇集導演（awards 檔）；PTT 2024 上半年 Netflix 台灣上榜 5 次、最高 #2（fans 檔；上報說曾奪台灣 Netflix 冠軍，snippet，與 fans 檔「最高 #2」不符，正文用 fans 檔）。英文、台灣、MDL 一致的批評落在最後三集：反轉為了替費可平反而改動原著。

## 13. 边水往事｜邊水往事（優酷，2024；21 集；英文 Escape from the Trilateral Slopes）

1. **Metacritic**：沒有頁面（站內搜尋「trilateral slopes」只有站方推薦，read）。
2. **豆瓣**：**開分 8.1 → 播出中 8.2 → 2026 年 7.9**。三聯生活周刊（卡生，2024-08-24）：「该剧在豆瓣开分为8.1」（https://www.lifeweek.com.cn/h5/article/detail.do?artId=234395 ，partial (Exa)，大陸媒體）；中國青年報（沈杰群，2024-08-30）：「豆瓣评分已冲到8.2分」（partial (Exa)，大陸媒體）；風傳媒〈風生活〉魏甫丞 2026-08-14 Netflix 排行：「豆瓣評價：7.9分」（https://www.storm.mg/lifestyle/11156477 ，read (Exa)）。分數兩年間降了 0.3。
3. **英文評論**：Chasing Dramas，Karen and Cathy，日期未標（完結後），〈Review: Escape the Trilateral Slopes (2024) 边水往事〉。https://www.chasingdramas.com/reviews/currently-watching-escape-the-trilateral-slopes-2024-%e8%be%b9%e6%b0%b4%e5%be%80%e4%ba%8b/ （read (Exa)，讀到約一半；評全 21 集）。**注意**：清單外，該站本表第 2 篇。
   - 摘要：7.8/10。她們強調這「NOT an idol drama」而是黑幫劇，題材涵蓋走私、賭博、NGO 的天真、毒品貿易；前半設下極高標準，後半追不上；郭麒麟被配角群壓過。立場：推（保留後半）。
   - 原文：「The first half sets an extremely high bar that the second half doesn't match. Guo Qi Lin, who is fine as Shen Xing, is outshone by the strong supporting cast」
   - 另有 DramaPanda（Chase Shê，2024-08-30，partial，播出中的新聞式介紹）。清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。搜尋過 Groundlane 站內限定、Groundlane 不限網域（排除大陸網站）、Exa。只找到：上報〈《慶餘年》郭麒麟新劇收視超越《柳舟記》奪冠〉（2024-08-22，snippet，網友反應整理）；關鍵評論網轉美國之音〈中國古裝劇與耽美劇搶攻泰國市場〉（2025-02-17，snippet，提到泰國觀眾喜歡本劇，非評論）；Fkan影評（繁體，火神紀，2024-09-12，partial (Exa)，**內容農場式轉貼，原文應是大陸豆瓣使用者，不算台灣媒體**）。
   - 背景（大陸媒體評論）：澎湃新聞，曾於里，2024-08-31，〈《边水往事》：猎奇、恐惧与消解〉（https://www.thepaper.cn/newsDetail_forward_28577088 ，read (Exa)）——批評本劇與《孤注一擲》同樣用「架空東南亞」滿足獵奇，最後強化「外面太亂、我們好安全」的「挺主旋律」訊息；北京青年報，張楊思頡，2024-09-06（partial (Exa)）——稱讚前半的多視角與「全球南方」潛力，批評後半「乏味無聊」。兩篇是本表最有批判性的評論，但都是大陸媒體。
5. **分歧**：**前後半落差是所有評論的共識**。燈塔 2024 懸疑集均 #1、雲合 2024 V30 #18、豆瓣 2024 年度 #10（ratings 檔）；白玉蘭 2025 提名、金鷹 2026 提名、北京青年報年度劇集（awards 檔）；fans 檔沒有它的台灣熱度紀錄（Netflix 台灣有上架，風傳媒排行用 Netflix 台灣片庫）。英文部落格、澎湃、北青三方都說後半弱；豆瓣分數兩年內由 8.2 降到 7.9，與「後半口碑遠不如前半」吻合。

## 14. 不眠日｜不眠日（愛奇藝，2025-09；16 集；英文 Mobius）

1. **Metacritic**：沒有頁面（站內搜尋「sleepless」只有 Sleepless in America，read）。**注意**：英文官方片名是 Mobius，這是搜完 Metacritic 後才確認的，Metacritic 沒有用 mobius 搜。
2. **豆瓣**：**7.6（約 10.2 萬人）**。風傳媒〈風生活〉，魏甫丞，2026-08-14，同上 Netflix 排行第 8 名：「《不眠日》｜豆瓣評價：7.6分」，並寫評分人數約 10.2 萬。https://www.storm.mg/lifestyle/11156477 （read (Exa)）。英文部落格 Chinese with Mina（2025-10-16）寫 7.5（partial，自媒體，不採用）。
3. **英文評論**：Gulf News（阿聯酋），Lakshana N Palat（Assistant Features Editor），2025-09-29，〈Chinese drama Mobius review: Bai Jingting's thriller is brilliant, savage and strangely obsessed with squids〉。https://gulfnews.com/entertainment/chinese-drama-mobius-review-bai-jing-tings-thriller-is-brilliant-savage-and-strangely-obsessed-with-squids-1.500286969 （read (Exa)，讀到約八成；播出第 12 天，**大量引用 Reddit r/CDrama 網友反應**，看的集數未明說）。**注意**：Gulf News 不在原清單，是中東英文大報。
   - 摘要：她說本劇用時間循環破案、偶爾買樂透，緊湊好玩；白敬亭兼具硬派與搞笑；粵語、普通話混用很新鮮；愛情線幾乎不存在，反而是好事；缺點是部分情節荒謬（用烏賊影片恐嚇）。立場：推。
   - 原文：「Mobius works best when it leans into the thriller aspect — suspicious CEOs, midnight resets, everyone being a potential traitor — and not when it tries to cue romantic elevator music.」
   - 另有 India Forums（Urmimala Banerjee，2025-09-18，partial (Exa)，**只評前 5 集**）。清單內媒體沒有找到。
4. **中文評論（台灣）**：Harper's BAZAAR 台灣版，Hayley Yu，2025-09-18，〈白敬亭《不眠日》首波劇評：不可控的時間穿越預示悲劇結局的可能？〉。https://www.harpersbazaar.com/tw/culture/filmandmusic/a66116425/things-to-know-about-mobius-highlights/ （read (Exa)；**開播隔天，只評前幾集**）。**注意**：時尚雜誌網站，不在原清單，同作者本表第 1 篇。
   - 摘要：她稱讚白敬亭的冷靜、配角不降智、爆炸槍戰場面；但說時間循環是雙面刃，人物情感著墨有限，比《開端》更偏刑偵快感而非人性反思。立場：推（保留深度）。
   - 原文：「《不眠日》在敘事上仍然以「案件解謎」為主，對人物情感的深度著墨有限，這使得一些觀眾覺得它更像是一部「爽劇」──緊湊、燒腦，但未必能提供更深層次的情感共鳴。」
   - Marie Claire、Cosmopolitan、ELLE、beauty321、iBeautyReport 另有看點整理（2025-09，snippet，介紹型）。
5. **分歧**：**豆瓣、Netflix、台灣劇迷都推，獎項幾乎沒有**。北京青年報 2025 年度劇集榜（awards 檔）；PTT 2025 推薦串約 16 推、2025 最喜歡串 3、kamenatsumi「很棒的劇本」、LINE TODAY 2025 陸劇前十（fans 檔）；ratings 檔沒有它。英文與台灣評論都在播出初期寫成，共同保留點是愛情線與人物深度。豆瓣 7.6 是 2025 年現代懸疑陸劇中的高分。

## 15. 早春晴朗｜早春晴朗（優酷，2026-08；24 集；英文 The Early Spring）

> **注意**：本劇是都市職場愛情劇，不屬於本篇「權謀、懸疑、武俠與奇幻」的主題。片單照 `post-cn2-shows.txt` 處理，是否保留請主文章決定。

1. **Metacritic**：沒有頁面（站內搜尋「the early spring」只有 The Early Show 等，read）。
2. **豆瓣**：**開分 6.7**。世界新聞網（聯合報系北美），2026-09-12，〈熱度不等於口碑？ 爆款劇「早春晴朗」豆瓣開分才6.7 「低了」衝熱搜〉。https://www.worldjournal.com/wj/story/121478/9749991 （snippet；同站另一版本 https://www.worldjournal.com/wj/story/121233/9750218 ）。英文站 ilovecdrama.com 寫「Douban ⭐8.5」（snippet），與新聞不符，**不要採用**。
3. **英文評論**：India Today，Bhavna Agarwal，2026-09-09，〈The Early Spring review: Jing Boran, Sun Qian shine in a deliciously messy romance〉。https://www.indiatoday.in/entertainment/ott/story/the-early-spring-review-jing-boran-sun-qian-mature-workplace-romance-netflix-2991074-2026-09-09 （read (Exa)，讀到約九成；評全 24 集，大結局當天刊出）。**注意**：India Today 不在原清單，是印度主流媒體。
   - 摘要：她說本劇有趣之處不在讓兩人在一起，而在「在一起之後」：吸引力變成日常、照顧變成期待；不把親密關係當羞恥；職場線讓女主角的野心被認真對待；最大弱點是 24 集的結構讓分手後段落太壓縮。立場：推。
   - 原文：「The romance is built on chemistry, but The Early Spring does not confuse chemistry with compatibility.」
   - 另有 JustWebSeries（Khushi，2026-08-31，**只評前 4–5 集**，partial）、Gergana Toleva 個人站（2026-09-28，snippet）。清單內媒體沒有找到。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。只找到：噓！星聞〈《早春晴朗》戲劇懶人包！〉（2026-09-01，snippet，介紹型）；Harper's BAZAAR〈井柏然《早春晴朗》17句職場、愛情金句台詞〉（snippet，介紹型）；世界新聞網豆瓣開分新聞（見上，新聞）。
5. **分歧**：**全球串流與 IMDb 高、豆瓣不及格邊緣**。IMDb 8.2（2.2K）、Netflix 週榜連續兩週 #2（2.4M／3.2M 觀看，ratings 檔 NF26）、微博 2026 年度影響力作品（ratings 檔）；awards 檔沒有它（播出時間晚）；DailyView 2026-10 月聲量榜 #7（fans 檔）。豆瓣開分 6.7 vs IMDb 8.2，落差 1.5 分；世界新聞網把它稱為「熱度與口碑倒掛」。MDL 長評（Noctis，snippet）指出觀眾爭論男主角「紅旗」與女主角隱瞞，評價本身就兩極。

---

## toolDegradation

- **Groundlane MCP**：先用 ToolSearch 載入 `web_search`、`web_fetch`、`web_extract`，可用。Metacritic 15 部全部用 `web_extract`（render=never）抓 `/tv/` 連結；台灣媒體站內搜尋與聯合報系、電影神搜、500輯、風傳媒、Sixth Tone 全文都用 Groundlane。Groundlane 搜尋時 tavily、exa、brave 子供應商有幾次標示 unavailable，fusion 自動退回 brave／you。
- **Exa**：英文評論搜尋與全文讀取（Foreign Policy、MCLC、Asia Times、Strange Horizons、easternkicks、Gulf News、India Today、各部落格）、獨立評論＠天下、Harper's BAZAAR 台灣版、大陸媒體背景文都用 Exa。
- **jina、Tavily**：沒有用到（Groundlane＋Exa 已足夠）。
- 沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com；搜尋結果裡出現的豆瓣短評與 movie.douban.com/review 頁只當背景，不採用為分數來源。
- 終端機沒有連網。

## 待補與注意

- 新生（Regeneration）、不眠日（Mobius）在 Metacritic 沒有用正式英文片名搜過；兩部都不太可能有頁面，但若要嚴格對齊 JP 版，可補搜。
- 長安二十四計的豆瓣分數受官方確認的刷分事件干擾，正文不要寫任何數字。
- 豆瓣分數有 5 部只來自風傳媒魏甫丞的排行清單（唐詭、慶餘年 S1、藏海傳、新生、不眠日），2 部只來自台灣美妝網站 beauty321（少年歌行、暗河傳）；若正文要引用，建議改寫成「據台灣媒體整理」並註明時間點。
- 早春晴朗不符合本篇主題，建議主文章決定是否移到別篇。
