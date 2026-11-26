# TW2 評價資料表：台劇｜社會、職人與時代 15 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-13 初版（MCP 斷線，全部 snippet）；**2026-11-26 補讀**（MCP 恢復，逐條讀原文並升級標記）。片單來自 `post-tw2-shows.txt`，本輪依使用者指示**移出一把青**（見檔尾「已移出」）、**加入火神的眼淚**（線索原在 `reviews-tw1.md` 第 15 條），共 15 部。IMDb／MDL／Google 年度搜尋／DailyView／Netflix 週榜沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、PTT／LINE TODAY 票選／Dcard 沿用 `candidates-fans-taiwan.md`，這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查，抓 `/tv/` 連結（the world between us、wave makers、outlaw doctor、gold leaf、three tears in borneo、seqalu、black tide island、workers、magician on the skywalk、oxcart trails、oops i'm in jail、the cleaner、a wonderful journey、mad doctor、tears on fire） | Groundlane `web_extract`（render=never，pattern 抓 `/tv/` 連結；後 10 部用含關鍵字的 pattern 縮小輸出） | **15/15 read：全部沒有頁面**。搜尋頁前 7 個 `/tv/` 連結（blade-runner-2099、dig-2026、melania-the-series、the-altruists、cunk-on-cinema、12-12-12、the-good-daughter）是站方推薦，每次都出現，不算結果。the world between us 只命中德劇 *Maxton Hall – The World Between Us*；the cleaner 命中的 `/tv/the-cleaner/` 已開頁確認是 2008 年 A&E 美劇（William Banks，Metascore 41，30 篇評論），**不是人生清理員** |
| 豆瓣 | 只採用媒體引述的分數；沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com | Groundlane `web_extract`（pattern 抓文中「豆瓣」前後文與排行小標）、Exa fetch | 12 部有媒體引述的分數並讀到原文。來源以台灣**美妝網站 BEAUTY美人圈（beauty321.com）**的豆瓣排行清單為大宗（準媒體，非評論；11 部用到它）；做工的人另有澎湃新聞（大陸媒體）。化外之醫、星空下的黑潮島嶼、監所男子囚生記、牛車來去沒找到；人選之人在豆瓣「已經看不到」（三立新聞，snippet） |
| 英文評論 | 署名評論，讀全文或大半 | Exa `web_search_exa`／`web_fetch_exa`；jina `read_url`（SCMP）；Groundlane `web_search` | **6 部讀到署名劇評**（我們與惡、人選之人、茶金、斯卡羅、做工的人、天橋）；聽海湧只有署名評析／特稿（Ketagalan Media、Taiwan Gazette），不是劇評。使用者指定的清單（SCMP、Foreign Policy、/Film、The Diplomat、Taipei Times、Focus Taiwan、TNL International、Taiwan Gazette）讀到 5 家 6 篇：SCMP、FP（人選之人）、/Film（我們與惡）、Taipei Times（斯卡羅，James Baron 書評裡的劇評段落＋社論）、Taiwan Gazette（聽海湧特稿）。**The Diplomat、Focus Taiwan 沒有劇評**；TNL International 天橋那篇網址現在轉到首頁、Wayback 讀不到 |
| 台灣中文評論 | 台灣媒體署名評論（電影神搜、聯合報〈娛樂有評〉／500輯、天下獨立評論、報導者、鏡週刊、關鍵評論網、釀電影、風傳媒評論、NOWnews〈名家論壇〉、ETtoday〈雲論〉、客新聞專欄） | Exa fetch（主力）；Groundlane `web_search`（找新線索） | **14/15 讀到台灣媒體署名評論**（read 或 partial）。牛車來去只有公視自家「劇夠」的評論（不算獨立評論）。作者集中見下方 |

標記說明：**read** = 工具讀到頁面內文（全文或大半）；**partial** = 只讀到前段（付費牆、截斷或只讀到搜尋長摘要）；**snippet** = 只看到搜尋結果，不算讀過、不當評論用。

> 英文評論的媒體使用次數（清單外上限 3）：
> - **使用者指定清單**：SCMP 1（人選之人，James Marsh，付費牆 partial）、Foreign Policy 1（人選之人，Clarissa Wei，評析）、/Film 1（我們與惡，Adam Wescott，〈Daily Stream〉推薦欄）、Taipei Times 1 篇署名（斯卡羅，James Baron；是小說書評，開頭一段評影集只看到第 2 集）＋ 1 篇社論（斯卡羅，未署名）、Taiwan Gazette 1（聽海湧，阿潑原文、Shi-Liu 英譯的特稿，非劇評）。The Diplomat 0、Focus Taiwan 0（只有新聞）、TNL International 0（讀不到）。
> - **清單外**：nomanisanis.land（Brian Hioe）**3，已滿**（斯卡羅、茶金、天橋，**三篇都只評第 1–2 集**；人選之人那篇不用）。sinema.sg 1（做工的人，Matthaeus Choo）、Philippine Daily Inquirer 1（做工的人，Rito P. Asilo）、Cinema Escapist 1（我們與惡，Anthony Kao）、Asian Movie Pulse 1（天橋，Teresa Vena，只評前 2 集）、Ketagalan Media 1（聽海湧，Ledo Li，評析）、Taiwan Lit 1（斯卡羅，Jason McGrath，學術評論，partial）、Lingua Sinica 1（聽海湧，訪談，不是評論）、PTS Plus Medium 1（茶金，公視自家帳號翻譯劇夠文章，不算獨立評論）、Counterarts／Medium 1（茶金，Sheng-mei Ma，付費牆 partial）。
> - **9 部沒有英文署名劇評**：化外之醫、星空下的黑潮島嶼、牛車來去、監所男子囚生記、人生清理員、華麗計程車行、村裡來了個暴走女外科、火神的眼淚、聽海湧（只有評析與特稿）。前 8 部只有新聞或 MyDramaList／Letterboxd 使用者評論（不收）。
>
> 台灣中文評論作者：
> - **雀雀**（聯合報〈娛樂有評〉／500輯）在本片單仍出現 **9 部**（我們與惡 II、人選之人、茶金、聽海湧、斯卡羅、監所男子囚生記、人生清理員、華麗計程車行、暴走女外科）；本輪讀了監所男子與暴走女外科兩篇，其餘仍是 snippet。**監所男子囚生記只有雀雀**（遠見那篇是專訪）；暴走女外科本輪找到第二位作者雪影（ETtoday〈雲論〉）。
> - **米果**（獨立評論〈台北捌玖零〉）仍是 **5 部**（我們與惡 S1／S2、化外之醫〔金鐘綜論〕、斯卡羅、星空下的黑潮島嶼），本輪都沒讀，正文不需要用到她。
> - 本輪建議選用的作者分布：徐佑德 3（我們與惡 II〔關鍵評論網〕、聽海湧〔電影神搜〕、黑潮島嶼〔關鍵評論網〕；聽海湧建議改用陳姝蓉，讓他降到 2）、傅紀鋼 2（人選之人、茶金，都是關鍵評論網）、潘光中 2（斯卡羅、華麗計程車行，都是電影神搜）、呂文慧 2（我們與惡 S1、人選之人，都是獨立評論）；其餘各 1：王子榮（報導者，我們與惡 II；另有火神一篇 snippet）、林孟皇（報導者，茶金）、膝關節（NOWnews，化外之醫）、陳姝蓉（獨立評論，聽海湧）、魏玓（風傳媒，斯卡羅）、羅世宏（客新聞，黑潮島嶼）、馬欣（娛樂有評，做工的人）、盧郁佳（鏡週刊，天橋）、潘怡豪（獨立評論，人生清理員）、雪影（ETtoday，暴走女外科）、Kristin（釀電影，火神）、柯志遠（NOWnews，火神）。
>
> 業配與導流：讀到的文章都沒有「合作／贊助」標記。電影神搜〈開箱〉系列都是播出初期只看前 2–3 集的首評（化外之醫、華麗計程車行）。公視「劇夠」（dramago.ptsplus.tv）是公視+ 平台自家內容，牛車來去、茶金（英文版經 PTS Plus Medium 轉載）只找到它，**不算獨立評論**。關鍵評論網 117950 是「精選轉載」的工作室部落格文，不是 TNL 編輯部或專欄。遠見〈監所男子囚生記〉是監製與製作人專訪。

---

## 1. 我們與惡的距離（含 II）（公視／HBO Asia，2019；II：公視／CATCHPLAY+，2025；英文 The World Between Us／After the Flames）

1. **Metacritic**：沒有頁面（站內搜尋「the world between us」只命中德劇 *Maxton Hall – The World Between Us* 等，read）。
2. **豆瓣**：**S1 9.4**。BEAUTY美人圈〈近十年豆瓣評分年冠台劇！《俗女2》9.3分《與惡》9.4分上榜…〉（2025-01-06）：「近十年「豆瓣評分年冠」台劇：2019年 《我們與惡的距離》9.4」。https://www.beauty321.com/post/65546 （read；美妝網站排行清單）。同站〈公視台劇豆瓣評分TOP10〉（2024-04）也列 TOP1 9.4（read）。2019 播出期間的 9.3（關鍵評論網 117460）本輪讀不到（Cloudflare 擋，snippet）。II：ratings 檔記「豆瓣 2025 評分最高華語劇 #3」，沒找到媒體引述的分數。
3. **英文評論**：
   - Cinema Escapist，Anthony Kao，2019-10-07，〈Review: HBO's "The World Between Us" Showcases Taiwan's Democratic Norms〉。https://cinemaescapist.com/?p=11712 （read (Exa)，讀到約八成；評 S1 全季）。**清單外**。
     - 摘要：他說本劇沒有單一主角，卻把大量角色編得井然有序；拋開偶像劇的甜膩與生硬演技，改走社會寫實，談死刑、精神疾病污名與媒體煽情，對華語主流電視「前所未見」；並把它讀成台灣民主規範的展示。立場：推。
     - 原文：「At no point does The World Between Us' plot progression feel confused or overburdened, and that's a testament to its tight screenwriting.」
   - /Film，Adam Wescott，2023-03-03，〈The Daily Stream: The World Between Us Measures The Distance Between Ourselves And Evil〉。https://www.slashfilm.com/1215144/heres-where-you-can-stream-the-world-between-us （read (Exa)，讀到約七成；評 S1）。**使用者指定清單內**，但〈Daily Stream〉是編輯群的串流推薦欄，不是正式劇評。
     - 摘要：他說台劇向來以愛情幻想為主，本劇轉向社會寫實；真正的反派是制度；賈靜雯的宋喬安是全劇最難忘的角色，吳慷仁的王赦則「less nuanced」。立場：推。
     - 原文：「But the true villains are systemic, and are far too powerful for our heroes to manage alone, much less defeat.」
   - 非評論：Taipei Times，Candice Chiang（contributing reporter），2019-06-25 特稿〈Taiwanese dramas go global〉（partial (Exa)，談產業與外銷，正面）；Focus Taiwan 收視與金鐘新聞（snippet）。
   - II：沒有找到英文署名評論（The Straits Times 介紹文、ContentAsia 產業稿，snippet）。
4. **中文評論（台灣）**：
   - S1，推：獨立評論〈料理心靈〉，呂文慧，2019-04-23，〈《我們與惡的距離》：我們都是好人，要選擇「正義」，還是仁慈？〉。https://opinion.cw.com.tw/blog/profile/423/article/7983 （read (Exa)；評全 10 集）
     - 摘要：她把本劇讀成亞里斯多德式的悲劇淨化，觀眾在同情角色時也「撞見」自己的惡；她承認巧合比現實多、結局比現實圓滿，但認為這是戲劇必要。立場：推。
     - 原文：「雖然在現實世界裡，難題未必都能化解得如此圓滿，但艱難的故事終於在淚光中隱現微笑，自沈重中迎來希望。」
   - S1，反方：關鍵評論網（精選轉載），家有囍事工作室，2019-04-26，〈評《我們與惡的距離》：前半打著「社會寫實」的招牌，後半卻急轉直下〉。https://www.thenewslens.com/article/117950 （read (Exa)；評全季）。**注意**：TNL 轉載的工作室部落格文，作者自稱新聞業出身，非 TNL 編輯部。
     - 摘要：他說最後四集把所有問題包上糖衣，思聰突然好轉、李家父母突然被接納；新聞台改革與化身採訪的描寫不懂新聞業。立場：批評。
     - 原文：「問題是前六集打著社會寫實的招牌，到了後四集突然變成社教宣導片般的完美清新，所有人物背後都綻放聖潔光芒」
   - II：關鍵評論網〈TNL+ 影劇〉，徐佑德（製片、《Mapless Vision》創辦人），2025-07-07，〈《我們與惡的距離II》全劇總評：堪稱台劇頂天立作，「沒有人是局外人」的深刻剖析〉。https://thenewslens.com/article/255411 （partial (Exa)，讀到前三成，後段付費；評全 10 集）
     - 摘要：他說 II 以網狀敘事同時處理綠能、鐵道公安、精神病患襲警、國民法官與國會政治，編劇不輕易下定論，把判斷留給觀眾。立場：強推。
     - 原文：「它延續了公共電視作為社會良心的風骨，堅定地將社會意義置於娛樂性之上，展開了一場規模宏大的紙上社會實驗。」
   - II：報導者〈法律人追劇〉，王子榮，2026-01-30，〈《我們與惡的距離2》：國民法官的火盃試煉〉。https://www.twreporter.org/a/saturday-features-legal-profession-the-world-between-us-after-the-flames （read (Exa)，讀到約六成；評全季）。從量刑與國民法官制度談劇情，對作品本身是肯定的。原文：「這讓《我們與惡2》不僅僅只是戲劇，相信足以成為這一代台灣人共同的記憶。」
   - 其餘仍是 snippet：同站〈打著社會寫實的招牌，無法掩飾其內涵的膚淺〉（117873，可能是 117950 的另一版本）、電影神搜〈劇評+操盤團隊深度全解析〉（47302）、米果 S1／S2 三篇、雀雀〈台灣感性…〉（8820874）、電影神搜〈1&2 集開箱〉（356976）、關鍵評論網〈首兩集與第一季差異〉（254075）。
   - 建議正文：S1 呂文慧（推）＋家有囍事工作室（反，要註明是轉載部落格）；II 徐佑德或王子榮。
5. **分歧**：**台灣共識最強的一部，反方集中在 S1 結局「太理想化」**。IMDb 8.8（3.3K，台劇第 1）、MDL #11 8.4、Google 2019 快速竄升總榜 #1、豆瓣 2025 年度華語劇 #3（II）、DailyView 2025 #7（II）（ratings 檔）；金鐘戲劇節目獎 2019（S1）與 2026（II）、AACA 2019 台灣最佳劇集、2025 周渝民最佳男主角＋呂蒔媛最佳編劇（II）；500輯 鄭秉泓 2022 列為三部關鍵台劇之一（awards 檔）；PTT 2019 年度台劇票選第 1（514 票）、2020 PTT 經典台劇第 1、LINE 2025 十大台劇 #3（II）（fans 檔）。落差只在評論內部：家有囍事工作室說後四集變「社教宣導片」，呂文慧也承認結局比現實圓滿但認為值得。英文評論（Cinema Escapist、/Film）兩篇都推。

## 2. 人選之人－造浪者（Netflix／公視＋大慕影藝，2023；英文 Wave Makers）

1. **Metacritic**：沒有頁面（站內搜尋「wave makers」只有 Makers: Women Who Make America、100 Foot Wave 等，read）。
2. **豆瓣**：**沒有分數**。三立新聞網報導本劇在豆瓣「已經看不到」（https://www.setn.com/news/1288595 ，snippet，本輪沒重讀）。
3. **英文評論**：
   - South China Morning Post，James Marsh，2023-04-26，〈Netflix drama review: Wave Makers – Taiwanese election drama by The World Between Us director is an engaging watch that brings up important political issues〉。https://www.scmp.com/lifestyle/entertainment/article/3218237/ （partial：付費牆，Exa 與 jina 只讀到標題、導言兩點、評分與前四段；評全 8 集）。**使用者指定清單內**。
     - 摘要：給 **4/5**；導言說本劇在很多方面成功，尤其呈現由普通人組成、有自主力的選民有多重要；戴立忍的花心政客「in fine villainous form」。後段的批評沒讀到。立場：推。
     - 原文：「The series is successful in many ways, particularly in how it illustrates the importance of an empowered voting body composed of ordinary people」（SCMP 導言）
   - Foreign Policy，Clarissa Wei（駐台北的台裔美籍自由記者），2023-08-12，〈How a Netflix Show Sparked a #MeToo Wave in Taiwan〉。https://foreignpolicy.com/2023/08/12/wave-makers-netflix-taiwan-metoo-sexual-harassment-dpp-china/ （read (Exa)，讀到約六成）。**使用者指定清單內**；評析文，不是劇評，但有明確評價。
     - 摘要：她說本劇觸發台灣政壇 #MeToo，是台灣第一部描寫當代基層選戰的影集；批評它沒有政治驚悚劇的機鋒，劇情可預測、劇本甜膩，但作為理解台灣政治文化的窗口很清楚。立場：有保留的推。
     - 原文：「Generously described as Taiwan's answer to The West Wing or House of Cards, Wave Makers lacks the witty banter of great political thrillers.」
   - 非評論：Los Angeles Times，Stephanie Yang、David Shen，2023-06-13，〈Inside the no-China universe of Taiwan's 'West Wing'-like TV hit〉（partial (Exa)，報導，談本劇刻意不提兩岸）；TNL International〈Taiwanese Election Drama Is a Subversive Hit in China〉（snippet）。
   - 備用（清單外，不用）：nomanisanis.land（Hioe，已滿 3）、The Envoy、Ready Steady Cut（snippet）。The Economist 2023 年度最佳影集上榜（awards 檔，榜單）。
4. **中文評論（台灣）**：
   - 獨立評論〈料理心靈〉，呂文慧，2023-05-06，〈《人選之人－造浪者》：自然如日常呼吸，又熱血得剛剛好的政治幕僚職人劇〉。https://opinion.cw.com.tw/blog/profile/423/article/13587 （read (Exa)，讀到約六成；她一天看完全 8 集）
     - 摘要：她說幕僚群戲寫實、對白無劇場感，公共議題（性別、同志、能源、新住民）自然融進劇情；並談「政治大局」與「個人理念」的拉扯。立場：推。
     - 原文：「我停不下來，是因為《人選之人》進行自然如同呼吸、順暢得不像是戲劇，親切得就像日常。」
   - 關鍵評論網〈TNL+ 影劇〉，傅紀鋼（詩人，《前進》文學誌發行人），2023-05-13，〈Netflix《人選之人－造浪者》：對白不尷尬媲美鄉土劇，可惜架空的設定扁平化政治複雜度〉。https://www.thenewslens.com/article/185264 （partial (Exa)，讀到前段，後段付費；評全季）
     - 摘要：他稱讚劇本把焦點縮到文宣部，節奏與台詞拿捏得好；批評架空政黨讓人有隔閡，公正黨明顯是民進黨的正面版本。立場：推，有保留。
     - 原文：「因為是台劇，照理說應該在講台灣藍綠大戰，但本劇卻以架空的虛擬政黨：公正黨跟民和黨展開的總統大選，讓人看了有隔閡感。」
   - 其餘 snippet：關鍵評論網〈「中國因素」卻被刻意隱形了〉（184901）、〈擺脫台劇不協調演技與脫節台詞〉（184874）；電影神搜（254819）；500輯 雀雀（7130155）。風傳媒 lifestyle 三篇是網友整理，不算。
   - 年度榜：關鍵評論網 徐佑德〈2023年度五大最佳＆五大失望台劇〉列第 1（awards 檔）。
5. **分歧**：**評審與評論都高，豆瓣缺席，PTT 冷淡**。IMDb 8.2（1.7K）、Netflix 2023 上半年台灣 820 萬小時（台灣 #2）、Google 2023 #6、DailyView 2023 #1（ratings 檔）；金鐘迷你劇集獎 2023、AACA 2023 台灣最佳劇集、Economist 2023 年度榜、TNL 2023 第 1（awards 檔）；LINE TODAY 2023 網友最愛 #3、Netflix 台灣週榜 #1，但 PTT 板上幾乎沒有推薦推文（fans 檔）。中英評論的保留點一致：**架空政黨、迴避中國**（傅紀鋼、TNL 184901、LA Times），以及 FP 說的「劇本甜膩、缺乏機鋒」。

## 3. 化外之醫（公視／中華電信／瀚草，2025；英文 The Outlaw Doctor）

1. **Metacritic**：沒有頁面（站內搜尋「outlaw doctor」只有 The Good Doctor、The Outlaws 等，read）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：**沒有找到英文署名評論。** Exa 搜「review of Taiwanese medical drama The Outlaw Doctor」只回中文部落格、越南影評聚合站、IMDb 使用者評論；IMDb 頁顯示「1 Critic review」但沒列出處。Focus Taiwan 只有獲獎新聞（snippet）。
4. **中文評論（台灣）**：
   - NOWnews〈名家論壇〉，膝關節（影評人），2025-05-07，〈《化外之醫》非法行醫是符合人道的轉型正義嗎〉。https://www.nownews.com/news/6679922 （read (Exa)；播畢後，評全 11 集）
     - 摘要：他把本劇放在《八尺門的辯護人》《九槍》以來的移工題材脈絡，說它從經濟階級出發看移工醫療人權，張鈞甯「表現極度出色」，檢察官與外事警察的轉變也寫得好。立場：推。
     - 原文：「《化外之醫》帶來了從經濟階級劃分出來的溫柔凝視，且體現兩造平等的可能性。」
   - 電影神搜〈【開箱】《化外之醫》：張鈞甯披白袍！寫實扣人心弦的醫療移工新品種台劇〉，2025-03-07，專欄名「人文電影的追尋」（作者名沒讀到）。https://news.agentm.tw/329618/ （read (Exa)；**只評前 2 集**）。原文：「前兩集的《化外之醫》，我們看到兩位導演經由對醫療專業和移工議題的充足田調，而能將這兩個題材融合得很好。」文末附各平台播出資訊。立場：推。
   - 其餘 snippet：關鍵評論網〈連炳發…新住民形象〉（260130）、米果金鐘綜論（16706）。非評論：獨評〈真人圖書館〉湯昇榮訪談、關鍵評論網〈推薦序〉、VERSE 專訪、風傳媒 lifestyle 網友整理。
5. **分歧**：**評審與 KOL 榜單一致，英文媒體完全缺席**。IMDb 7.5（516）、Google 2025 #9、DailyView 2025 #10（ratings 檔）；金鐘 2025 戲劇節目獎入圍、連炳發得男主角獎、GOTT 2025 最佳亞洲內容、今敏木木 2025 劇評人榜 #6、LINE 2025 十大台劇 #5（awards 檔）；Hami Video 年度榜（fans 檔）。讀到的兩篇台灣評論都正面；批評只出現在風傳媒網友整理（「2 敗筆」，snippet）與個人部落格（嫌人口販賣陰謀收得太簡單、檢察官一角演得弱，不收）。

## 4. 茶金（公視／瀚草，2021；英文 Gold Leaf）

1. **Metacritic**：沒有頁面（站內搜尋「gold leaf」只有 The Golden Girls、The Gold 等，read）。
2. **豆瓣**：**8.4**。BEAUTY美人圈〈公視台劇豆瓣評分TOP10！《暴走女外科》第七…〉（2024-04）：「公視台劇豆瓣評分TOP9：《茶金》8.4」。https://www.beauty321.com/post/61322 （read；美妝網站排行清單）。
3. **英文評論**：nomanisanis.land，Brian Hioe，2021-11-23，〈Gold Leaf Succeeds Where SEQALU and Island Nation Did Not〉（副題〈A Review of Episodes One and Two of Gold Leaf〉）。https://nomanisanis.land/gold-leaf-review/ （read (Exa)，全文；**只評第 1–2 集**）。**清單外**，Hioe 個人網站（他也是 New Bloom 創刊編輯）。
   - 摘要：他說茶金把角色放在前面，主線支線、主角配角平衡得好，英語戲也不像斯卡羅、國際橋牌社那樣尷尬；美國專家被寫成有自身利益的外來者，而非文明使者。缺點是張薏心總以「女性的同理心」化解父親的爭執，落入性別刻板。立場：推。
   - 原文：「However, to this extent, Gold Leaf is a much more capable work than SEQALU or Island Nation.」
   - 其他（都不當主評）：PTS Plus（公視自家 Medium 帳號），2022-10-18，〈GBA Race: Gold Leaf is the uplifting warmth among Taiwan dramas | Opinion〉，原文出自劇夠，作者 Cheercut（read (Exa)）：「when it comes to the part that involves political and commercial conflicts, Gold Leaf is far too elegant.」——公視自家平台，不算獨立評論。Counterarts／Medium，Sheng-mei Ma，2026-08-12，〈'Gold Leaf' — Hakka Tongue and Tea〉（partial，付費牆，只讀到開頭兩段，偏從語言政治批判 TaiwanPlus 與客語定位）。
   - 使用者指定清單（Taipei Times、Diplomat、SCMP、TNL International、Focus Taiwan、Taiwan Gazette）都沒有茶金劇評；Taipei Times 2026-09-04 Ming-yeh T. Rawnsley 特稿〈Beyond Netflix〉只把它列為代表作（partial，非評論）。
4. **中文評論（台灣）**：
   - 關鍵評論網，傅紀鋼，2021-12-31，〈【劇評】《茶金》：隱晦處理黨國陰影，台灣影視圈的「多力多滋人文主義」可惜了一齣好劇〉。https://www.thenewslens.com/article/160894 （partial (Exa)，讀到前四成；播畢後評全 12 集）
     - 摘要：他從「四萬換一元」切入，說把發行新台幣的責任從國民政府改到美方，只造成「國民政府沒那麼壞」的效果；全劇對黨國悲劇高舉輕放。立場：有保留（肯定製作，批評史觀處理）。
     - 原文：「把發行新台幣並與中國貨幣切割的責任，從國民政府改到美國，唯一的效果，就是讓觀眾忽略、模糊了「國民政府在1945-1949年間，掏空台灣的歷史責任」。」
   - 報導者〈法律人追劇〉，林孟皇，2022-02-19，〈《茶金》：生意就是政治，但國家不該與民爭利〉。https://www.twreporter.org/a/saturday-features-legal-profession-drama-gold-leaf （read (Exa)，讀到約八成）
     - 摘要：他從化肥換穀、複式匯率、保安司令部等制度細節解讀劇中政商關係，說本劇呈現威權時期「政治掛帥」下人民的掙扎。立場：推。
     - 原文：「如此雋永又富時代意義的戲劇，勢必會在台灣影劇史上留下不可抹滅的一頁。」
   - 其餘 snippet：娛樂有評 雀雀〈炎上「茶金」？〉（5917204）、關鍵評論網〈四萬換一元…徹頭徹尾的造假〉（159365，爭議評論）、風傳媒 馮賢賢投書（4065053，為劇組辯護）。鏡週刊兩篇是爭議新聞。
   - 年度榜：500輯 鄭秉泓 2022 列為三部關鍵台劇之一（awards 檔，read）。
5. **分歧**：**作品評價高，被「四萬換一元」史實爭議蓋過**。Google 2022 #9（ratings 檔）；金鐘 2022 入圍 16 項（最多），只拿下女配角與剪輯（Taipei Times 2022-10-24 確認李杏女配角，snippet→partial），戲劇節目獎輸給斯卡羅（awards 檔）；LINE TODAY 2021 最推薦台劇 #4、Netflix 台灣週榜 #2、PTT 推文 5 則（1 則「看不下去」）（fans 檔）。Hioe（只看兩集）、林孟皇推；傅紀鋼與公視自家的劇夠文章都說它對政治衝突「太優雅」「高舉輕放」——連自家平台都這樣說，這個批評可以放心寫。

## 5. 聽海湧（公視／看不見電影，2024；英文 Three Tears in Borneo）

1. **Metacritic**：沒有頁面（站內搜尋「three tears in borneo」只有 Three Pines、True Tears 等，read）。
2. **豆瓣**：**8.4（約 1,700 人評分）**。BEAUTY美人圈，Kristen，2024-11-20，〈近三年豆瓣最高分台劇TOP10！《影后》7.9分《聽海湧》8.4分…〉：「近三年「豆瓣最高分」台劇TOP6：吳翰林、黃冠智《聽海湧》8.4」「豆瓣評分人數：約1700人評分」。https://www.beauty321.com/post/64955 （read；美妝網站排行清單）。評分人數少，正文若用要註明。
3. **英文評論**：**沒有找到英文署名劇評。** 讀到的都是評析、特稿或訪談：
   - Taiwan Gazette，阿潑（A-Po）著、Shi-Liu 英譯，網址日期 2026-02-15、頁面標 Mar 19，〈"Who Doesn't Want to Be Good in War?" — Three Tears in Borneo Revisits Taiwan's WWII War Crimes Trials〉。https://www.taiwangazette.org/news/2026/2/15/who-doesnt-want-to-be-good-in-war-three-tears-in-borneo-revisits-taiwans-wwii-war-crimes-trials （partial (Exa)，讀到約四成）。**使用者指定清單內**；是含導演、製作人訪談的歷史特稿（原文應出自報導者，本輪未對照），不是劇評。原文：「What makes it unique is its clear portrayal of the difficult position Taiwanese POW camp guards were situated in」。
   - Ketagalan Media，Ledo Li，2024-11-30，〈Reflecting on the Motherlands of the Taiwanese: Three Tears in Borneo〉。https://ketagalanmedia.com/2024/11/30/reflecting-on-the-motherlands-of-the-taiwanese-three-tears-in-borneo/ （partial (Exa)，讀到前半）。**清單外**；以本劇引出台籍日本兵的國族認同與補償史，政治評論，不評作品優劣。
   - Lingua Sinica（China Media Project 旗下 Substack），Ryan Ho Kilpatrick、田間，2024-09-16，〈Televising Taiwan's Painful Past〉（read (Exa)）：導演孫介珩、製作人林佳儒**訪談**，不是評論。
   - 其他：Screen Daily 2024-03-12 Series Mania 產業新聞（snippet）；Inside Taïwan（法文網誌，Luc，2024-09-23，五星，文末標「Contenu Sponsorisé」，不收）。
4. **中文評論（台灣）**：
   - 獨立評論〈家園。風〉，陳姝蓉，2025-11-06，〈戰場上，沒有人是贏家：從《聽海湧》反思戰爭對心理健康的衝擊〉。https://opinion.cw.com.tw/blog/profile/513/article/16737 （read (Exa)；金鐘後看完全 5 集）
     - 摘要：她從德仔、阿輝、阿遠三人的處境談戰爭對青少年心智與國族認同的扭曲，連到台灣當下的認知戰與戰爭焦慮。是觀後反思，對作品是肯定的。立場：推。
     - 原文：「我很喜歡看時代劇，但有時那個時代的沈重份量讓我覺得難以承受，而《聽海湧》正給我這種感覺。」
   - 電影神搜〈【劇評】《聽海湧》：遠在天邊、近在眼前的複雜台灣身分認同問題〉，神搜特約 徐佑德，2024-09-09。https://news.agentm.tw/300740/ （partial (Exa)，讀到前四成，多是歷史背景；播畢後）。原文：「就會明白《聽海湧》劇集的歷史田調之紮實，跟編導多想把歷史的沉痛與荒謬細節都放進劇中」。立場：推。
   - 其餘 snippet：關鍵評論網〈1－2集〉首映評（206552）、娛樂有評 雀雀（9031978）、風傳媒〈點教育〉史實批評（5265829）、獨立評論投書 蔡如音（16337）。
   - 建議正文用陳姝蓉，讓徐佑德不超過 2 部。
5. **分歧**：**評審與劇評人叫好，史學與藍營有爭議**。DailyView 2024 #7（ratings 檔）；金鐘 2025 迷你劇集獎（陳姝蓉文提到「最佳戲劇、編劇、男配角等5項大獎」，與 awards 檔的獎名要再對）、Series Mania 2024 入選、LINE 2024 十大追劇榜 #3（awards 檔）；LINE 2024 台劇年度榜 #2、遠見 2024 #6（fans 檔）。爭議已有一手材料：公視研究員程宗明的 IAMCR 2025 論文（https://info-material.pts.org.tw/staff_paper/2025/2025_011_a.pdf ，partial (Exa)）記錄徐宗懋 2024-09-17 在聯合報批評羅領事一角影射卓還來、柯景星後人不滿虛實混雜，公視後來在片頭片尾加上「角色均經虛構」聲明。豆瓣 8.4 但只有約 1,700 人評分。

## 6. 斯卡羅（公視／台北創造，2021；英文 Seqalu: Formosa 1867）

1. **Metacritic**：沒有頁面（站內搜尋「seqalu」只有站方推薦，沒有任何結果，read）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：
   - nomanisanis.land，Brian Hioe，2021-08-17，〈A Competent but Problematic Adaptation〉（副題〈A Review of Episodes One and Two of SEQALU〉）。https://nomanisanis.land/seqalu-review/ （read (Exa)，全文；**只評第 1–2 集**）。**清單外**。
     - 摘要：他說場景服裝用心、原住民演員多，但角色太多難以分辨、情節靠巧合；西方角色演得「stiff, amateurish」；更大的問題是把當代政治（陳耀昌與蔡政府的台灣主體論述）投射到 1867 年，浪漫化李仙得。立場：有保留（「passable」）。
     - 原文：「But it is probable that the series' political underpinnings will eventually come to undo any of virtues that could be ascribed to the show.」
   - Taipei Times，James Baron（contributing reporter），2023-02-23，〈Book review: Nuanced depiction of a formative Formosa〉。https://www.taipeitimes.com/News/feat/archives/2023/02/23/2003794876 （read (Exa)）。**使用者指定清單內**；是原著《Puppet Flower》英譯本書評，開頭兩段評影集，**他自己說只看到第 2 集**。
     - 摘要：他說影集畫面好看、台灣主演表現不錯，但部分西方演員「dreadful」，把必麒麟寫成酒鬼浪子是「shameful defamation」；小說處理得公允得多。立場：批評。
     - 原文：「Episode two was as far as I got with Seqalu: Formosa 1867. … The acting from some of the Western cast, on the other hand, was dreadful.」
   - Taiwan Lit，Jason McGrath，2026-09-26，〈Becoming Settler Colonial〉。https://www.taiwanlit.org/indigenous-becomings-for-the-new-millennium/becoming-settler-colonial （partial (Exa)，讀到開頭與搜尋長摘要）。**清單外**，學術評論。原文：「Seqalu simultaneously centers Taiwan's indigenous peoples in its narration of Taiwan history while also serving as an example of how contemporary Taiwanese nationalism co-opts and instrumentalizes indigeneity for its own purposes.」立場：批判性分析。
   - 非署名：Taipei Times 社論〈EDITORIAL: Series highlights lack of opportunity〉（2021-09-04，read (Exa)）：承認「well directed, has excellent cinematography and an engaging story」，但批評從外來者視角講原住民歷史、拿它類比《風中奇緣》。Taipei Times 2021-09-14 何來美投書（partial）、2021-08-25 首播紀錄新聞（觀眾抱怨角色長得像、字幕太小，partial）。
4. **中文評論（台灣）**：
   - 反方：風傳媒〈評論〉，魏玓（初版註記為陽明交大傳播學者，本輪未查證），2021-12-19，〈魏玓觀點：失敗的史詩與觀賞的痛苦─《斯卡羅》啟示錄〉。https://www.storm.mg/article/4104217 （read (Exa)，讀到前四成；評全 12 集）
     - 摘要：他說自己看到第五、六集就慢下來，十月才斷斷續續看完；最大問題是「不好看」，根源是故事主題猶豫不決——原住民視角、國際關係、族群寓言、兒女情長都想要。立場：批評。
     - 原文：「在媒體針對外界批評聲音訪問導演曹瑞原，他的回答是，「請看完再說」。但《斯卡羅》的最大問題，正在於觀眾沒有辦法看完。」
   - 正方：電影神搜〈【劇評】情理中、意料外？論《斯卡羅》落幕後的那些完美與不完美〉，潘光中，2021-09-24。https://news.agentm.tw/194221/ （read (Exa)，讀到約六成；完結後評全劇）
     - 摘要：他說撇開爭議、單看製作，是近年台劇傑作；但配樂過滿喧賓奪主、演出表現問題更嚴重。立場：推，有保留。
     - 原文：「撇開紛議、單論製作品質，耗費鉅資、動員廣大人力物力的《斯卡羅》，的確是近年台劇中的傑作。」
   - 其餘 snippet：關鍵評論網〈…成就一部有正面意義的爛劇〉（156782）、〈激起更多人認識本土的熱情〉（155422）、娛樂有評 雀雀（5685308）、米果（11310）、風傳媒投書〈斯卡羅，是在寫誰的歷史？！〉（3929864）。
5. **分歧**：**15 部裡評論分歧最大的一部**。首播創公視 21 年戲劇首播紀錄（Taipei Times，partial）、Google 2021 快速竄升戲劇 #10（ratings 檔）；金鐘 2022 戲劇節目獎等 4 座（Taipei Times 2022-10-24，partial；awards 檔）；LINE TODAY 2021 只排 #8（fans 檔）。評審頒最高獎，但中英文署名評論多數負面：魏玓「失敗的史詩」、Hioe「problematic」、Baron「dreadful」、Taipei Times 社論、McGrath 的學術批判；只有潘光中以製作面稱「傑作」。英文的批評集中在**西方演員與原住民視角**，台灣的批評集中在**主題與敘事**。

## 7. 星空下的黑潮島嶼（客家電視台／中華電信，2025；英文 Black Tide Island）

1. **Metacritic**：沒有頁面（站內搜尋「black tide island」只有 Fantasy Island 等，read）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：**沒有找到英文署名評論。** 只有 Variety 2023-08-18 開拍新聞（Patrick Frater，partial (Exa)）、ContentAsia 製作人訪談影片（partial）。
4. **中文評論（台灣）**：
   - 反方：關鍵評論網〈隨點隨看串流+〉，徐佑德，2025-04-12，〈旗艦台劇《星空下的黑潮島嶼》：白色恐怖該怎麼拍？時代劇為何逐漸失去與當代觀眾的連結？〉。https://www.thenewslens.com/column/streaming/251386 （partial (Exa)，讀到前三成，後段付費；**只看前 4 集**）
     - 摘要：他肯定規格與片場建設，但說看完前四集「非常挫折與失望」；雖號稱跳脫悲情，仍是熟悉的悲憤控訴，議題壓過內容。立場：批評。
     - 原文：「但在看完前四集的我，感到非常挫折與失望，我不禁要問：「我們的時代劇究竟走到了什麼地方？是進步了，還是迷失了？」」
   - 正方：客新聞 HakkaNews〈羅世宏專欄〉，羅世宏，2025-10-02，〈從《星空下的黑潮島嶼》看記憶政治和語言正義〉。https://hakkanews.tw/2025/10/02/232210/ （read (Exa)；金鐘入圍 16 項後）。**注意**：客新聞是客家媒體，本劇由客家電視台出品；羅世宏的評論重點在記憶政治與語言政策，不談戲劇技法。原文：「它不是把白恐簡化為受害者／加害者的二元對立，而是轉化為一種身體實踐的生存試煉」。立場：推。
   - 報導者，阿潑，2025-03-29，〈機智醫生的綠島白恐生活：《星空下的黑潮島嶼》怎麼衡量歷史重量與戲劇張力〉。https://www.twreporter.org/a/black-tide-island （read (Exa)，讀到約七成）。**是製作特稿**（立委凍預算事件、編導與製作人訪談），不是評論。
   - 其餘 snippet：獨立評論 米果（15957）。GQ Taiwan（CY）介紹文不算。
5. **分歧**：**劇評人榜單第 1，徐佑德專欄失望**。金鐘 2025 入圍 16 項（羅世宏文，read；awards 檔記迷你劇集獎入圍、技術獎大贏）、AACA 2025 最佳攝影與最佳視覺特效、今敏木木 2025 劇評人榜 #2、LINE 2025 十大台劇 #1（awards 檔）；Hami／MOD 上半年 TOP 10、PTT「大推」（fans 檔）；ratings 檔沒有收視或搜尋數據。徐佑德只看前 4 集就給負評，與年底榜單不同調——跟華麗計程車行的情況相同（早評負、後來口碑翻）。

## 8. 做工的人（大慕影藝／凱擘／台灣大哥大／HBO Asia，2020；英文 Workers）

1. **Metacritic**：沒有頁面（站內搜尋「workers」只有 Miracle Workers，read）。
2. **豆瓣**：**8.8**。澎湃新聞〈有戲〉〈《做工的人》：重新认识劳动者的价值〉：「该剧目前在豆瓣分数达到8.8分。」https://www.thepaper.cn/newsDetail_forward_7699998 （read，只抽了含「豆瓣」的句子；大陸媒體，2020 年播出期間）。初版記的 beauty321「9.0」本輪沒有讀到，**以 8.8 為準**。
3. **英文評論**：
   - sinema.sg，Matthaeus Choo，2020-05-11，〈Lighthearted and Hopeful, 'Workers' Details the Antics of a Trio Determined to Get Rich Quick〉。https://www.sinema.sg/2020/05/11/workers-review/ （read (Exa)，讀到約七成；**只評前 2 集**）。**清單外**，新加坡電影網站。
     - 摘要：他說三人組像情境喜劇的典型組合，李銘順以自身做工經驗演得可信；但觀眾得吞得下主角們明顯被騙的盲目樂觀。立場：推。
     - 原文：「Fronted by a likeable cast, the lighthearted series highlights the trials and tribulations labourers face, and how their hopes for a better life always shines through.」
   - Philippine Daily Inquirer，Rito P. Asilo（娛樂版主編），2020-05-08，〈'Workers' transcends mindless comedy〉。https://entertainment.inquirer.net/374465/workers-transcends-mindless-comedy （read (Exa)，全文；**只看前 2 集**）。**清單外**主流報紙。
     - 摘要：他把劇中「尊嚴只屬於有穩定收入的人」連到菲律賓 ABS-CBN 停播後的失業潮；說幽默不平均，但議題沒有被稀釋。立場：推。
     - 原文：「the pertinence of its intersecting issues and themes isn't dissipated by the uneven humor that helps leaven the grim repercussions of the characters' desperate actions.」
   - Taipei Times 2023-04-07 評的是**電影版**，作者說沒看過影集（snippet），不能用。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉，馬欣（資深評論人），2020-06-06，〈《做工的人》描述中年的集體失落與被尋回〉。https://stars.udn.com/star/story/10093/4615559 （read (Exa)；播畢後，評全 6 集；500輯同文 12672/4619483）
   - 摘要：她把本劇和《我的大叔》《未生》並列，說它少見地拍出藍領中年的處境；節奏像散文，前段慢，到第四、五集把過勞、世襲貧窮、職災拍成突發的大浪。立場：推。
   - 原文：「台灣太少拍攝這樣描寫生活磨損氣味的劇。這是《做工的人》在書與劇裡都有的醍醐味，它沒有煽情，就是讓你體會生活的粗礪，如此才有餘韻」
   - 其餘 snippet：電影神搜（113906、108518）、關鍵評論網反方〈對片中略顯拙劣的溫情感到失望〉（137334）、報導者〈生猛現身〉（workers-tv-drama-series）。噓！星聞〈網評有雷〉是網友整理。
5. **分歧**：**口碑一致、豆瓣高分，但只有 6 集、獎項只有一座**。Google 2020 快速竄升戲劇 TOP 10（ratings 檔）；金鐘 2021 迷你劇集獎（awards 檔）；PTT 推薦串常被列在「已看過」、Dcard 推薦（fans 檔）。兩篇英文評論與馬欣都推，英文那兩篇都只看了 HBO 首播的前兩集；唯一明確的反方是關鍵評論網 137334 批評結尾溫情（snippet）。

## 9. 天橋上的魔術師（公視／原子映象，2021；英文 The Magician on the Skywalk）

1. **Metacritic**：沒有頁面（站內搜尋只有 The Magicians，read）。
2. **豆瓣**：**8.7**。BEAUTY美人圈〈公視台劇豆瓣評分TOP10〉（2024-04）：「公視台劇豆瓣評分TOP5：《天橋上的魔術師》8.7」。https://www.beauty321.com/post/61322 （read；美妝網站排行清單）。初版的 TVBS 2356675 本輪讀了，**是〈2023豆瓣華語電視劇排行〉，跟天橋無關**，已刪除。
3. **英文評論**：
   - nomanisanis.land，Brian Hioe，2021-02-23，〈Review: The Magician on the Skywalk〉。https://nomanisanis.land/magician-skywalk-review/ （read (Exa)，全文；**只評第 1–2 集**）。**清單外**。
     - 摘要：他說中華商場搭景用心，但太依賴預算：CGI 斑馬、過多空拍；主角都是小學生，成人觀眾難以投入；單元結構缺乏貫穿全劇的主線。立場：批評。
     - 原文：「After two episodes, the characters of The Magician on the Skywalk fail to come to life, something that is not helped by that its central characters are all elementary school students」
   - Asian Movie Pulse，Teresa Vena，2021-07-10，〈Series Review: The Magician on the Skywalk (2020) by Gilles Yang〉。https://asianmoviepulse.com/2021/07/series-review-the-magician-on-the-skywalk-2020-by-gilles-yang/ （read（Exa 搜尋結果含全文）；**只看 Neuchâtel 影展放映的前 2 集**）。**清單外**。原文：「For a young audience, the pace seems too slow and for adults, the story lacks thrill. … Overall, the series is surely very well crafted, but lacks of a precise and unique profile.」立場：有保留。
   - **使用者指定清單**：TNL International〈The Magician on the Skywalk: A Magical Realist Lens on Taiwan〉（維基百科註腳記為 2021-01-21，作者未知）。https://international.thenewslens.com/article/146354 現在轉到 TNL 中文首頁；Wayback 經 Groundlane（瀏覽器錯誤）、jina（web.archive.org 封鎖匿名存取）、Exa（CONTENT_NOT_CACHED）都讀不到。**仍是 snippet，不能用。**
   - Focus Taiwan 首播與金鐘新聞（snippet）；Taiwan Post New Wave（英國）只有放映資訊。
4. **中文評論（台灣）**：鏡週刊，盧郁佳，2021-03-23，〈【盧郁佳劇評】惡從何來？ 解碼《天橋上的魔術師》受害者的罪惡〉。https://www.mirrormedia.mg/story/20210322web012/ （read (Exa)，讀到約五成；播畢後）
   - 摘要：她從街坊圍罵受害者談劇中的惡，指出 Nori、阿派都是先受性別壓迫再轉嫁傷害；批評小蘭阿猴線「有形無魂」，真正有靈魂的西服店同志線卻有頭無尾。立場：有保留（肯定題旨，批評敘事取捨）。
   - 原文：「短短兩場調情戲，遠比拍阿猴、小蘭拍得有靈魂，為什麼有頭無尾，反而轉去鋪陳猴蘭戀的空殼子？」
   - 其餘 snippet：鏡週刊〈【劇評】…台灣影劇新海拔〉（20210209cnt002，首播前後，作者未知）、關鍵評論網〈EP.1、3短評〉（146247）、VERSE 楊雅喆導讀兩篇。
5. **分歧**：**金鐘大贏家，觀眾與早期英文評論嫌悶**。金鐘 2021 戲劇節目獎等 6 座（awards 檔）；LINE TODAY 2021 #6、PTT 2022 成功台劇串推文 2 則（1 則看不下去）、PTT〈天橋上的魔術師為何不是神劇？〉18 推（fans 檔）；豆瓣 8.7。兩篇英文評論都只看前兩集，都嫌兒童主角與節奏難以投入（Hioe「fail to come to life」、Vena「lacks thrill」）；盧郁佳看完全劇，批評的是敘事重心放錯地方。

## 10. 牛車來去（公視／禾豐，2022–23；英文 Oxcart Trails，片名出自 MDL 與官方 FB，非官方片名清單）

1. **Metacritic**：沒有頁面（站內搜尋「oxcart trails」，含 oxcart／trail 的 `/tv/` 連結一個都沒有，read）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：**沒有找到英文署名評論**；MDL 頁「沒有評論」（snippet）。
4. **中文評論（台灣）**：**沒有找到台灣獨立媒體的署名評論。** 本輪 Groundlane 搜「《牛車來去》 劇評」只找到：
   - 劇夠（公視+ 自家平台），2023-04-20，〈《牛車來去》讓台語散發文學香味，下鉤手法傳統但超級有用〉。https://dramago.ptsplus.tv/articles/9845 （read (Exa)，讀到約五成；完結時；作者名沒讀到）。**公視自家平台，不算獨立評論**，只當背景。原文：「《牛車來去》下鉤子的做法其實是非常傳統的電視劇寫法，但收視率卻證明老把戲十足有效。」
   - 個人部落格（dearhan.blog EP15–30 觀後感、udn 部落格 blackjack 談結局問題）、Marie Claire 介紹、上報與中時新聞，都不算。
   - 初版的鏡週刊〈娛樂透視〉特稿、電影神搜劇情導流文（249580）維持原判，不算評論。
5. **分歧**：**收視強、評論圈沉默**。Google 2023 快速竄升 #10、DailyView 2023 #3（ratings 檔）；金鐘 2023 戲劇節目獎入圍（awards 檔；Marie Claire 標題說米可白獲女配角、入圍八項，snippet）；LINE TODAY 2023 網友最愛 #8（fans 檔）；結局收視攻頂（中時、上報新聞，snippet）。劇夠的說法是它以晨間劇式的傳統鉤子拿下週末收視冠軍；評論圈和英文圈都沒有討論，這本身可以寫。

## 11. 監所男子囚生記（壹壹影業，2025；英文 Oops! I'm in Jail）

1. **Metacritic**：沒有頁面（站內搜尋只有 Jail、Las Vegas Jailhouse，read）。
2. **豆瓣**：**沒找到媒體引述的分數**；BEAUTY美人圈 2025 台劇 IMDb 排行列 7.7（snippet，不是豆瓣）。
3. **英文評論**：**沒有找到英文署名評論**；MDL 7.7（211 人）與使用者評論（不收）。本輪沒有另做英文搜尋。
4. **中文評論（台灣）**：500輯〈質青評論〉，雀雀，2026-01-24，〈「監所男子囚生記」、「陽光女子合唱團」：生命之苦 以唱跳解憂〉。https://500times.udn.com/wtimes/story/120840/9285053 （read (Exa)，全文；娛樂有評同文改題〈台劇「監所男子」和台片「陽光女子」為何要唱跳？〉）。**和電影並談，不是單篇劇評。**
   - 摘要：她說本劇不拍監獄風雲，而像「社會大學宿舍」的日常打鬧；中生代領銜、資深演員鎮場的格式像賀歲片；唱跳是苦悶中的精神酒精。立場：推。
   - 原文：「人物和故事一起共振，不搞監獄風雲，更像是社會大學宿舍的日常打鬧情境，讓舍監與室友群一起培養感情」
   - **仍只有雀雀一篇。** 本輪新搜到的：遠見 魯皓平〈楊祐寧玩出…最幽默的喜劇氛圍〉（2025-12-05，read）是監製與製作人**專訪**；劇夠幕後稿（公視自家）；MyVideo〈映画案內所〉（平台自家部落格）；Dream & Hunter、udnSTYLE 看點文；香港 Now 新聞〈影評及推介〉（非台灣媒體，snippet）。都不算。
5. **分歧**：**劇評人榜單看好，評論圈只有一篇**。金鐘 2026 入圍 11 項、今敏木木 2025 劇評人榜 #5（awards 檔）；MyVideo 2025 戲劇榜前十、PTT 推文 2 則「節奏笑點感人都有」（fans 檔）；ratings 檔沒有數據。MDL 長評說它「不太平均」、看到第 10 集棄劇（snippet，不收）。

## 12. 人生清理員（果陀娛樂，2024；英文 The Cleaner）

1. **Metacritic**：**沒有本劇頁面**。站內搜尋「the cleaner」唯一相關結果 `/tv/the-cleaner/` 已開頁確認：Metascore 41（30 篇評論）屬於 2008 年 A&E 美劇（主角 William Banks，「From the creator of … American Dreams」），**不是本劇，41 分不能用**（read）。
2. **豆瓣**：**7.6**。BEAUTY美人圈〈2024台劇豆瓣評分排行TOP10！《影后》8.0第三…〉（2024-12-19）：「2024台劇豆瓣評分TOP7：《人生清理員》7.6」。https://www.beauty321.com/post/65315 （read；美妝網站排行清單）。
3. **英文評論**：**沒有找到英文署名評論**；MDL 7.8（17 人）（不收）。本輪沒有另做英文搜尋。
4. **中文評論（台灣）**：獨立評論〈看看〉，潘怡豪，2024-09-06，〈如果孤獨死是我們共同的未來：《人生清理員》直觸你不敢正視的社會現實〉。https://opinion.cw.com.tw/blog/profile/385/article/15249 （partial (Exa)，讀到前四成；播畢後）
   - 摘要：前段大量引用美術指導陳韋中、顧問盧拉拉談現場氣味與擬真陳設，偏議題導讀加幕後；對作品是肯定的，評價句集中在後段，本輪沒讀到。立場：推。
   - 原文：「影集《人生清理員》首當被拉出討論的議題，就是「孤獨死」。畫面中已不是新聞上或社會議題所談論的想像情境，也非為了美化視覺而盡量避開寫實的一面」
   - 其餘 snippet：電影神搜〈開箱劇評〉（301888，看到第 4 集）、娛樂有評 雀雀（8331820）。鏡週刊〈娛樂透視〉、關鍵評論網開播介紹兩篇不是評論。
5. **分歧**：**評論一致正面，豆瓣中等**。金鐘 2025 迷你劇集獎入圍（awards 檔）；LINE 2024 十大台劇 #5、遠見 2024 最紅台劇 #3（fans 檔）；ratings 檔沒有數據。豆瓣 7.6 在 2024 台劇排第 7，beauty321 同文說它「熱度沒有到非常高，但超高品質也獲得觀眾稱讚」（read）。

## 13. 華麗計程車行（華視／巧克／LINE TV，2024；英文 A Wonderful Journey，對應無來源，見 awards 檔 †）

1. **Metacritic**：沒有頁面（站內搜尋「a wonderful journey」只有 Journeyman 等，read）。
2. **豆瓣**：**7.3**。BEAUTY美人圈〈2024台劇豆瓣評分排行TOP10〉（2024-12-19）：「2024台劇豆瓣評分TOP8：《華麗計程車行》7.3」。https://www.beauty321.com/post/65315 （read；美妝網站排行清單）。
3. **英文評論**：**沒有找到英文署名評論。** 本輪沒有另做英文搜尋。
4. **中文評論（台灣）**：電影神搜〈【開箱劇評】《華麗計程車行》：挫折就像是地震，你不知道它何時會來，但熬著熬著總會過去〉，潘光中，2024-03-01。https://news.agentm.tw/274787/ （read (Exa)，讀到約七成；**只評前 3 集**）
   - 摘要：他說卡司整齊得像半個金鐘後台，但旁白太頻繁干擾入戲；該好好交代動機的戲模糊帶過，冗戲卻一絲不苟，「生活化還是流水帳」分不清。立場：批評（只看前三集）。
   - 原文：「這種「什麼都想呈現給觀眾，可每個部分也沒有確實到位」的尷尬感受，對觀眾去理解、認同主角們的心理活動及未來抉擇，其實是種顯著的妨礙。」
   - 其餘 snippet：娛樂有評 雀雀〈郭子乾、游安順…與人生角色相遇〉（7971071，推）、關鍵評論網〈推薦四部話題台劇〉（199929，多部合評）。風傳媒 lifestyle〈無雷影評／…為何爆紅？〉是導流稿。
5. **分歧**：**前期劇評保留，後期觀眾與榜單接受**。DailyView 2024 #8（ratings 檔）；金鐘 2024 戲劇節目獎入圍、AACA 2024 最佳串流原創（awards 檔）；LINE 2024 十大台劇 #9、金鐘人氣票選期中 #9（fans 檔）；結局收視連續 9 週同時段無線台第一（iqilin.com，單一來源，snippet）。潘光中只看前三集就嫌「流水帳」，跟後來的收視與口碑不同調。

## 14. 村裡來了個暴走女外科（公視／十三月，2022；英文 Mad Doctor）

1. **Metacritic**：沒有頁面（站內搜尋「mad doctor」只有 Mad Men 等，read）。
2. **豆瓣**：**8.5（約 5.1 萬人評分）**。BEAUTY美人圈〈公視台劇豆瓣評分TOP10〉（2024-04）：「公視台劇豆瓣評分TOP7：《村裡來了個暴走女外科》8.5」（https://www.beauty321.com/post/61322 ，read）；同站 Kristen〈近三年豆瓣最高分台劇TOP10〉（2024-11-20）列 TOP5 8.5、「約5.1萬人評分」（https://www.beauty321.com/post/64955 ，read）。美妝網站排行清單。
3. **英文評論**：**沒有找到英文署名評論**；MDL 約 7.5（約 180 人）（不收）。本輪沒有另做英文搜尋。
4. **中文評論（台灣）**：
   - 聯合報〈娛樂有評〉，雀雀（影評人），2022-06-11，〈《村裡來了個暴走女外科》遠看是喜劇，但你可以再靠近一點〉。https://stars.udn.com/star/story/10093/6378890 （read (Exa)，全文；完結後；500輯同文改題〈不只是喜劇，也是拍給台灣醫護的一封情書〉）
     - 摘要：她說蔡淑臻放下尺度、朱軒洋可塑性高；喜劇糖衣包著評鑑、地下電台藥品、防禦性醫療等醫護困境，雖沒明講健保制度。立場：推。
     - 原文：「醫師的使命是救人，戲劇的使命則是救心。《村裡來了個暴走女外科》不只是拍給觀眾、也是拍給台灣醫護職人的一封情書」
   - ETtoday〈雲論〉，雪影（自介「愛戲劇、好動漫」，非專業影評人），2022-06-25，〈《女外科》蔡淑臻詮釋有血有淚的小劉醫師　粉絲敲碗第二季！〉。https://forum.ettoday.net/news/2280111 （read (Exa)，全文）
     - 摘要：他說喜劇包裝讓題材好入口、對醫護過勞的描寫獨特；但愛情線與床戲沒必要，小劉「不做沒執照的事」只是一句口號。立場：推，有保留。
     - 原文：「劇中小劉醫生也曾跟日劇《Doctor-X》中的大門未知子（米倉涼子飾）一樣，說過不做沒醫師執照的事，但卻沒在劇情中反映出來，變了好像只是一句口號，略嫌可惜。」
   - 不算：鏡週刊〈娛樂透視〉特稿、ELLE／誠品〈7件引人省思的事〉（Christy Deng，介紹文）、Vogue 首播新聞、Marie Claire 看點。
5. **分歧**：**觀眾票選第 1、金鐘大贏，豆瓣高分，評論圈只有兩篇**。Google 2022 快速竄升 #5（ratings 檔）；金鐘 2023 戲劇節目獎與女主角（beauty321 61322，read；awards 檔）；LINE TODAY 2022 年度台劇期中 #1（14.6%）（fans 檔）；豆瓣 8.5（約 5.1 萬人，15 部中有人數資料者最多）。評審、觀眾、豆瓣一致，缺的是專業評論。

## 15. 火神的眼淚（公視／蔡銀娟導演，2021；英文 Tears on Fire）

> 原在 TW1（懸疑犯罪）片單，消防職人劇，2026-11-13 拆篇時移到本篇（`split-proposal.md`）。線索原在 `reviews-tw1.md` 第 15 條，當時台灣評論「搜尋未命中」。

1. **Metacritic**：沒有頁面（站內搜尋「tears on fire」只有 World on Fire、True Tears 等，read）。
2. **豆瓣**：**9.0**。BEAUTY美人圈〈公視台劇豆瓣評分TOP10〉（2024-04）：「公視台劇豆瓣評分TOP4：《火神的眼淚》9.0」。https://www.beauty321.com/post/61322 （read；美妝網站排行清單）。factsheets-tw1 記的「MDL 使用者清單 8.9」不採用。
3. **英文評論**：**沒有找到英文署名評論。** Exa 搜「Tears on Fire Taiwanese firefighter drama PTS review」只回中文部落格、MyDramaList 使用者評論、Letterboxd 使用者短評（不收）。Taipei Times 只有語言學習版新聞〈'Tears on Fire,' 'Word of Honor' attract high ratings〉（2021-06-09，snippet）；Taiker Magazine 介紹（清單外，snippet）；Taiwan News 2023-01-21 產業特稿只提到片名（partial）。
4. **中文評論（台灣）**：
   - 釀電影，Kristin（關鍵評論網書評專欄作者，經營《Let Me Sing You A Waltz》），2021-06-04，〈《火神的眼淚》：當戲劇成為社會的良心〉。https://filmaholic.tw/series/60b99315fd89780001ec010c （read (Exa)，讀到約四成；播畢後，評全 10 集）
     - 摘要：她說本劇源自 2015 年新屋保齡球館大火，是少見敢批判官僚體制的職人劇；英雄主義路線出於對整個群體的敬意，並逐一分析四位主角的心魔。立場：推。
     - 原文：「一齣罕有的職人劇《火神的眼淚》，於疫情最嚴峻的時刻真正引領了主流話題，再度拓展本土戲劇的廣度與深度，不僅映照現實、敢於批判、直面社會議題、還針砭官僚體制」
   - NOWnews〈名家論壇〉，柯志遠，2021-05-20，〈《火神的眼淚》渡劫也歷劫的肉身群像〉。https://www.nownews.com/news/5272829 （read (Exa)，讀到約五成；播出中，看到第 2 集以後）
     - 摘要：他說本劇「職場刻劃、生命價值、人性挖掘、社會批判」四線並行，避開打火英雄片的立碑套路，改寫火場之外的磨難；並拿韓劇《我是遺物整理師》相比。立場：強推。
     - 原文：「《火神的眼淚》卻罕見地迴避了過往慣用的「英雄立碑」的戲劇套路，另闢蹊徑，以消防員之所以為消防員的「火場之外」所承受的磨難、煎熬、挫敗做為情節述說的落點」
   - 其餘 snippet（本輪新找到，未讀）：報導者〈法律人追劇〉王子榮〈健全法律制度，火神才不用拭淚〉（2021-09-17）、鳴人堂〈現實裡的「火神的眼淚」：別為消防員悲傷，也別再稱英雄〉（張賢龢，2021-06-11）、ETtoday〈雲論〉沈政男（2021-05-10）、關鍵評論網〈消防隊員子女的告白〉（151631，投書）。個人部落格（如履的電影筆記、珊迪瘋美劇、vocus）不收。
5. **分歧**：**豆瓣與觀眾票選高，獎項資料薄，英文圈零評論**。IMDb 7.9（502）、Google 2021 快速竄升戲劇 #3（ratings 檔）；LINE TODAY 2021 最推薦台劇 #3（14.49%）、PTT 2022 成功台劇串推文 3（1 則負評）、PTT 2023／2025 懸疑串各被提到（fans 檔）；awards 檔只在鄭秉泓 2021 文章中被提及，沒有排名或得獎紀錄；豆瓣 9.0 是本片單除我們與惡外最高。台灣評論一致推崇它的體制批判；鳴人堂標題「也別再稱英雄」提示另一種讀法（snippet，可補讀）。

---

## toolDegradation

- **2026-11-26（本輪）**：
  - **Groundlane MCP**：已用 ToolSearch 載入，可用。`web_search` 多數時候只有 serpapi／keenable／browserbase 成功（tavily、exa、brave、you、parallel 回 unavailable），`domains` 參數對 serpapi 似乎沒生效，回來的結果不限網域。`web_extract`（pattern 引擎）用來做 Metacritic 站內搜尋與 beauty321／澎湃的分數抽取，很穩。`web_fetch` 讀 SCMP 卡在 browser-challenge；讀 Wayback 回瀏覽器錯誤；`web_extract` 讀關鍵評論網 117460 卡在 browser-challenge。
  - **Exa**：主力。`web_fetch_exa` 讀到大部分文章（TNL、獨評、報導者、電影神搜、聯合報、鏡週刊、風傳媒、NOWnews、ETtoday、釀電影、nomanisanis.land、Cinema Escapist、/Film、FP、sinema.sg、Inquirer、Taipei Times、Taiwan Gazette、Ketagalan）。TNL TNL+ 專欄只回前段（付費）；SCMP 只回導言；TNL International 146354 回 TNL 中文首頁；`thenewslens.com/article/160894/fullpage` 回 CRAWL_NOT_FOUND（去掉 /fullpage 就讀得到）；Wayback 回 CONTENT_NOT_CACHED。
  - **jina**：SCMP 第一次讀到評分（4/5）與前四段，第二次帶 `question` 時回 Cloudflare 驗證頁，且 `question` 需要 API key；web.archive.org 對匿名存取封鎖到 2026-11-26 12:35 UTC。
  - **Tavily**：沒用到（Exa 與 Groundlane 已足夠）。
  - 終端機 `curl` 依指示不用。沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com。
- **2026-11-13（初版）**：MCP 全部斷線（502），內建 `WebFetch` 對所有網域回 `getaddrinfo ENOTFOUND`，只靠內建 `WebSearch` 的標題與摘要，全部 snippet。

## 待補與注意

- **讀不到、仍是 snippet 的關鍵條目**：TNL International 天橋（146354，清單內唯一可能的天橋英文署名評論）；SCMP 人選之人後半段（付費牆）；關鍵評論網 117460（我們與惡 2019 豆瓣 9.3）。
- **英文評論缺口 9 部**：化外之醫、黑潮島嶼、牛車來去、監所男子、人生清理員、華麗計程車行、暴走女外科、火神的眼淚沒有任何英文署名劇評；聽海湧只有評析與特稿。本輪只對聽海湧、斯卡羅、茶金、我們與惡、化外之醫、黑潮島嶼、火神做了新的英文搜尋；監所男子、人生清理員、華麗計程車行、暴走女外科、牛車來去沿用初版結論，沒重搜。
- **只評首集或前幾集的**：Hioe 三篇（斯卡羅、茶金、天橋）都是第 1–2 集；Baron（斯卡羅）只看到第 2 集；sinema.sg、Inquirer（做工的人）、Asian Movie Pulse（天橋）都是前 2 集；電影神搜〈開箱〉化外之醫前 2 集、華麗計程車行前 3 集；徐佑德黑潮島嶼前 4 集。正文引用時要寫明。
- **雀雀與米果**：雀雀仍出現 9 部，本輪只讀兩篇（監所男子、暴走女外科）；監所男子沒有第二位台灣作者。米果 5 部都沒讀，其他作者已足夠，正文可以不用她。
- **徐佑德**在本表出現 3 次（我們與惡 II、聽海湧、黑潮島嶼），加上 awards 檔的 TNL 2023 年度榜共 4 處；聽海湧建議改用陳姝蓉。
- 豆瓣分數 11 部來自 BEAUTY美人圈（美妝網站排行清單，作者多為編輯 Kristen 或未署名），做工的人來自澎湃新聞。正文建議寫「據台灣美妝媒體整理的豆瓣排行」並註明文章日期，或改用 ratings 檔的豆瓣年度榜位置。聽海湧 8.4 只有約 1,700 人評分。
- 牛車來去沒有獨立媒體評論，只有公視自家劇夠；正文可以把「收視冠軍但評論沉默」當成重點。
- 英文片名：牛車來去 Oxcart Trails、人生清理員 The Cleaner、暴走女外科 Mad Doctor、做工的人 Workers、華麗計程車行 A Wonderful Journey 仍沒有公視或官方英文頁面確認（本輪沒查）。

---

## 已移出

### 一把青（公視／台北創造，2015；英文 A Touch of Green）

2026-11-26 依使用者指示移出本篇片單。原因見 `split-proposal.md`：fans 檔標「範圍外」，F 類不計，只剩 A、C 兩類，未達三類門檻；串流也只有舊證據。以下保留初版線索（本輪只順手讀到豆瓣分數，其餘仍是 snippet），供日後若改列候補時使用。

1. **Metacritic**：初版 `WebSearch` 網域搜尋沒有頁面（snippet）；本輪沒做站內搜尋。
2. **豆瓣**：**9.2**。BEAUTY美人圈〈近十年豆瓣評分年冠台劇〉（2025-01-06）：「近十年「豆瓣評分年冠」台劇：2016年 《一把青》9.2」；同站〈公視台劇豆瓣評分TOP10〉列 TOP2 9.2。https://www.beauty321.com/post/65546 、/post/61322 （read；美妝網站排行清單）。
3. **英文評論**：沒有找到英文署名評論（snippet）。Taipei Times 2026-09-04 Rawnsley 特稿說公視高層訪談中把它和 Wake Up 視為擺脫偶像劇印象的起點（partial，非評論）。
4. **中文評論（台灣）**（snippet）：獨立評論 魏宏晉〈一把青──當靈魂已成往事〉（opinion.cw.com.tw/blog/profile/359/article/4917）；關鍵評論網〈是「時代劇」而非「歷史劇」〉（29115）；風傳媒 胡又天專欄談主題曲（76806，不是劇評）。
5. **分歧**（初版）：獎項與豆瓣極高、當年收視不佳；IMDb 8.4（509）（ratings 檔）；金鐘 2016 戲劇節目獎等 6 座（awards 檔）。
