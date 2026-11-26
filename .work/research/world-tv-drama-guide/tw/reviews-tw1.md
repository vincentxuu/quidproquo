# TW1 評價資料表：台劇｜懸疑、犯罪與驚悚 13 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-13 建線索表（MCP 斷線，全部 snippet）；**2026-11-26 就地升級**（MCP 恢復，逐條讀原文）。片單：原 `post-tw1-shows.txt` 16 部，此時此刻、忘了我記得、火神的眼淚移出本篇（線索留在檔尾「已移出」）。IMDb／MDL／豆瓣年度榜／Netflix 榜沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、PTT／LINE TODAY／DailyView 沿用 `candidates-fans-taiwan.md`，這裡不重抓，只在「分歧」欄引用並標「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（copycat killer、victims game、light the night、the resurrected、had i not seen the sun、agent from above、gg precinct、taiwan crime stories、port of lies、zero day attack、million follower detective、tabloid、shards of her） | Groundlane `web_extract`（render=never，抓 `/tv/` 連結）；有頁面的再用 `web_fetch` 開頁 | 13/13 read：**只有《如果我不曾見過太陽》有頁面**（2 篇評論，未達 4 篇，沒有 Metascore）。其餘 12 部沒有頁面。搜尋頁前 9 個 `/tv/` 連結（Blade Runner 2099、Dig 2026、The Good Daughter 等）是站方推薦，每次都出現，不算結果 |
| 豆瓣 | 只採用媒體文章引述的分數；豆瓣頁沒有讀，沒有繞過 sec.douban.com | Groundlane `web_fetch`／`web_extract` | 只有 beauty321（美妝網站，準媒體）兩篇排行清單讀到：〈Netflix原創台劇豆瓣評分TOP10〉（2024-03-07，模仿犯 7.4、誰是被害者 8.0、華燈初上 8.1、她和她的她 8.6）、〈2024上半年台劇豆瓣評分TOP10〉（Eve，2024-07-12，誰是被害者2 7.1）。**舊版寫的「八尺門 8.7」在 beauty321/62695 裡找不到**（那篇是 2024 上半年榜），已刪除。其餘以 ratings 檔豆瓣年度榜為準 |
| 英文評論 | 署名評論，讀全文或大半 | Groundlane `web_fetch`（Ready Steady Cut、Heaven of Horror、nomanisanis.land、But Why Tho、Screen Rant、Metacritic）；Exa `web_fetch_exa`（SCMP、Decider、Taipei Times、Leisurebyte）；jina `read_url`（SCMP 對照） | **13 部中 12 部有讀到的署名英文評論**（死了一個娛樂女記者之後 沒有）。清單內媒體：Decider（如果我不曾見過太陽，read，只評第 1 集）、Taipei Times（乩身，read，但是社會評析不是劇評）。SCMP 全部是付費牆，只讀到前 2–4 段與星等（partial） |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、500輯、關鍵評論網、天下雜誌 | Groundlane `web_search`（domains 限定）＋ `web_fetch`；關鍵評論網、天下雜誌 Groundlane 被擋（browser-challenge），改用 Exa `web_fetch_exa` | **13 部中 12 部有讀到的台灣媒體署名評論**（百萬人推理 沒有）。關鍵評論網是 TNL+ 付費文，Exa 只拿到前半（partial） |

標記說明：**read** = 工具讀到頁面內文（全文或大半）；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段（付費牆或擷取截斷）；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> **英文媒體使用次數（清單外上限 3，以下是建議正文用的分配）**：
> - SCMP（James Marsh，三篇都是他）：誰是被害者 S2、正港分局、如果我不曾見過太陽（後者當分歧用）＝ **3，到上限**。模仿犯、華燈初上、台灣犯罪故事×2 的 SCMP 篇不用。
> - Ready Steady Cut：模仿犯（Jonathon Wilson）、華燈初上（Jonathon Wilson）、台灣犯罪故事（M.N. Miller）＝ **3，到上限**。回魂計（Wilson，只看前兩集）、誰是被害者 S1（Wilson）兩篇讀到但不用。
> - Heaven of Horror（Karina Adelgaard，兩篇都是她）：回魂計、百萬人推理 ＝ 2。
> - Leisurebyte（Pooja Darade）：她和她的她 ＝ 1。**Leisurebyte 網站目前停用**（Groundlane 回 402「pending subscription renewal」），全文來自 Exa 副本；正文引用要附存檔連結或改用別篇。
> - nomanisanis.land（Brian Hioe，New Bloom 主編個人站）：八尺門（只評前兩集）、零日攻擊（全季）＝ 2。
> - 其他各 1：Decider（Joel Keller）、Screen Rant（Nick Bythrow）、But Why Tho（Charles Hartford）、Taipei Times（Nigel P Daly，評析）。
> - **作者集中**：英文主力是 James Marsh（SCMP 3）、Jonathon Wilson（RSC 2，另 2 篇備用）、Karina Adelgaard（2）、Brian Hioe（2）。
>
> **台灣中文評論作者（照實寫）**：雀雀 5 部（模仿犯、誰是被害者2、如果我不曾見過太陽、八尺門、她和她的她）；**潘光中** 4 部（模仿犯、華燈初上、台灣犯罪故事、她和她的她，都在電影神搜）——舊版標「作者未讀到」的電影神搜劇評，多數其實是他；徐佑德 2（誰是被害者2、死了一個娛樂女記者之後，關鍵評論網）；胡芩 2（如果我不曾見過太陽、乩身，關鍵評論網）；人海邊的離島 2（正港分局、死了一個娛樂女記者之後，電影神搜）。其他各 1：地下電影、白鐵仔、awwrated、楊晴翔、艾瑞克、凱特C。下方各條的「建議正文用」已盡量分散：雀雀 2、潘光中 2、徐佑德 2，其餘各 1。
>
> **利益關係**：鏡週刊與鏡文學同集團，鏡文學是八尺門的辯護人、死了一個娛樂女記者之後的出品方；本檔讀到的評論**沒有一篇來自鏡週刊**，舊版列的鏡週刊〈娛樂透視〉維持 snippet、不採用。另外徐佑德是製片公司「無垠」共同創辦人，屬業內人士評同業作品，引用時可註明身分。

---

## 1. 模仿犯（Netflix，2023；英文 Copycat Killer）

1. **Metacritic**：沒有頁面（站內搜尋「copycat killer」只有 Conversations with a Killer 系列等，read）。
2. **豆瓣**：**7.4**。beauty321〈Netflix原創台劇豆瓣評分TOP10！《模仿犯》7.4分，《華燈初上》8.1分，冠軍達8.6高分〉，2024-03-07，列第 5。https://www.beauty321.com/post/60663 （read，標題與各段小標；準媒體排行清單，作者欄沒有）。
3. **英文評論**：Ready Steady Cut，Jonathon Wilson，2023-03-31，〈'Copycat Killer' Season 1 Review – A High-Quality But Longwinded Whodunit〉。https://readysteadycut.com/2023/03/31/copycat-killer-season-1-review/ （read；評全 10 集）。清單外。
   - 摘要：他說本劇其實是向其他犯罪劇「模仿」來的，但品質高、懸疑抓得住人；十小時太長，不適合一口氣追；對媒體與司法體制提出尖銳問題，讓它不只是推理劇。給 4/5。立場：推（嫌冗長）。
   - 原文：「Copycat Killer is a bit of a copycat itself where other crime fiction TV titans are concerned, but it's nonetheless a high quality and engaging whodunit.」
   - SCMP，James Marsh，2023-03-29，〈Netflix drama Copycat Killer: Taiwanese whodunit about a media-savvy murderer…keeps viewers guessing〉（partial (Exa)：付費牆，只讀到前三段，看不到評價；SCMP 已用滿 3 部，不用）。
4. **中文評論（台灣）**：
   - 電影神搜，潘光中，2023-04-05，〈Netflix《模仿犯》：勇於挑戰經典改編值得鼓勵，但製作面的極端優劣全都被放大呈現〉。https://news.agentm.tw/252333/ （read；看完全劇）
     - 摘要：他說本劇是「把台灣戲劇製作環境的優點和缺點全部極大化」的作品：技術細緻、演員互補；但故事邏輯常不自洽，女性議題改得半途而廢，真兇曝光到落網一段最難信服。給 65 分。立場：有保留。
     - 原文：「要是給《模仿犯》評分的話，我應該只會給剛過及格線的六十五分。」
   - 聯合報〈娛樂有評〉，雀雀，2023-04-01，〈重口味破格台劇 「模仿犯」樹立台灣影集新標竿〉。https://stars.udn.com/star/story/10093/7070402/ （read）
     - 摘要：她說原著極難影視化，台版把文本「台灣化」後仍保留事件連結；攝影、美術、剪輯「皆達到卓絕執行」，張榮吉與張亨如兩位導演表現出色，放在全亞洲刑偵劇中名列前茅。立場：強推。
     - 原文：「值得驕傲的是，它最終還是被拍成了一部優秀的台灣影集。」
   - 電影神搜〈【劇評】Netflix《模仿犯》：一念之間〉https://news.agentm.tw/252630/ （snippet，沒讀）。
   - **建議正文用**：雀雀（推）＋潘光中（65 分）並列，正好呈現分歧。
5. **分歧**：**收視與獎項極高、台灣劇評兩極**。IMDb 7.0（3K）、MDL #21 8.1、Netflix 全球非英語 #2（首部進全球前十的台劇）、Google 2023 快速竄升台灣戲劇 #1（ratings 檔）；金鐘 2023 戲劇節目提名、關鍵評論網徐佑德〈2023年度五大最佳台劇〉標題點名（awards 檔）；LINE TODAY 2023 網友最愛台劇 #1（12.77%）（fans 檔）。同一週內，雀雀說「新標竿」、潘光中只給 65 分；英文 RSC 4/5 但嫌冗長；豆瓣 7.4 在 Netflix 台劇裡只排第 5。

## 2. 誰是被害者（第 1–2 季）（Netflix，2020／2024；英文 The Victims' Game）

1. **Metacritic**：沒有頁面（站內搜尋「victims game」只有 Law & Order: SVU、Squid Game 等，read）。
2. **豆瓣**：**第一季 8.0、第二季 7.1**。第一季：beauty321 Netflix 原創台劇榜（2024-03-07）列第 3、8.0（https://www.beauty321.com/post/60663 ，read）。第二季：beauty321，Eve，2024-07-12，〈2024上半年台劇豆瓣評分TOP10！《誰是被害者2》7.1…〉列第 5、7.1，文中說第二季「被大家吐槽」藤岡靛、劉俊謙口音與「大魔王復仇過程很像八點檔」（https://www.beauty321.com/post/62695 ，read；準媒體）。
3. **英文評論**：
   - S2：SCMP，James Marsh，2024-06-18，〈Netflix drama review: The Victims' Game season 2 – unconvincing Taiwanese murder thriller〉（jina 抓到的標題改為〈illogical Taiwanese murder thriller〉）。https://www.scmp.com/lifestyle/entertainment/article/3267003/netflix-drama-review-victims-game-season-2-unconvincing-taiwanese-murder-thriller （partial (Exa／jina)：付費牆，讀到星等、導言與前三段劇情）。清單外。
     - 摘要：給 **2/5**。導言說本季「為了精緻製作犧牲了說故事」；讀到的部分只有劇情介紹，正文批評沒讀到。立場：負評。
     - 原文：「Joseph Chang's detective seeks answers to a 15-year-old murder mystery in series that sacrifices storytelling in favour of slick production」（文章導言）
   - S1：Ready Steady Cut，Jonathon Wilson，2020-04-30，〈The Victims' Game Season 1 Review – a grisly Taiwanese crime drama〉。https://readysteadycut.com/2020/04/30/the-victims-game-netflix-review/ （partial：擷取只拿到摘要與前兩段；3/5）。RSC 已用滿 3 部，備用。原文摘要句：「another solid entry into the odd-couple forensic thriller canon」。
   - Decider：只有二手引述，原文沒找到，不採用。
4. **中文評論（台灣）**：
   - S1：電影神搜，地下電影，2020-05-01，〈【劇評】《誰是被害者》：將台劇推向另一高峰，替無法發聲的社會底層殺出血路〉。https://news.agentm.tw/107151/ （read；評全 8 集）
     - 摘要：他先釐清本劇是瀚草主導、Netflix 只買播映權；說劇本、演員、美術、攝影「將台劇推向另一高峰」，以社會底層為基底，拋出自殺與否的辯證；缺點是「有過於說教之嫌」。立場：強推。
     - 原文：「先說結論，《誰是被害者》從劇本、演員、美術、攝影、剪接等面向來看，將台劇推向另一高峰，會是今年的金鐘大熱」
   - S2：關鍵評論網〈TNL+ 影劇〉，徐佑德（無垠有限公司共同創辦人、《Mapless Vision 浩瀚影視產業報》創辦人），2024-06-25，〈【劇評】Netflix《誰是被害者：第2季》：製作是國際水準，但劇本仍有瑕疵就看觀眾能否接受〉。https://www.thenewslens.com/article/204351 （partial (Exa)：讀到前半）
     - 摘要：他說導演與製作仍是 A 級、蘇慧倫是本季 MVP；但本格派推理迷會在辦案過程中「一頭霧水」，劇本細節有 bug 沒處理；編劇大換血下「能夠維持平盤也是相當盡力」。立場：有保留。
     - 原文：「如果是本格派的影迷，可能在辦案中間會有點一頭霧水，真的要抓是有許多細節的bug，沒有在劇本裡被處理到。」
   - S2：500輯，雀雀，2024-07-27，〈誰是被害者2／雀雀劇評：台式懸疑犯罪劇迎戰第二季 眾星鬥戲引話題〉。https://500times.udn.com/wtimes/story/120840/8122145 （read；看完全 8 集）。立場：推。原文：「以追完整部第二季全 8 集為前提，「誰是被害者2」其實不負它備受期待之使命。」
   - S2：電影神搜 https://news.agentm.tw/282931/ 、/283640/ （snippet，沒讀）。
   - **建議正文用**：地下電影（S1）＋徐佑德（S2）。
5. **分歧**：**S1 口碑穩、S2 英文大報看衰**。IMDb 7.3（2.4K）、MDL S1 #27 8.1／S2 #37 8.0、DailyView 2024 #6（ratings 檔）；金鐘 2020 戲劇提名、2025 迷你劇集提名（S2）、亞洲影藝創意大獎台灣區最佳劇集 2020＋2024、張孝全 2020 亞洲電視大獎男主角（awards 檔）。豆瓣從 8.0 掉到 7.1；SCMP 給 S2 2/5，台灣劇評則是「維持平盤」（徐佑德）到「不負使命」（雀雀）。

## 3. 華燈初上（三部）（Netflix，2021–2022；英文 Light the Night）

1. **Metacritic**：沒有頁面（站內搜尋「light the night」只有 Friday Night Lights、The Night Of 等，read）。
2. **豆瓣**：**8.1**。beauty321 Netflix 原創台劇榜（2024-03-07）列第 2。https://www.beauty321.com/post/60663 （read；準媒體；沒有分部數）。
3. **英文評論**：Ready Steady Cut，Jonathon Wilson，2021-11-26，〈'Light the Night' Review – A Soapy East Asian Character Drama〉。https://readysteadycut.com/2021/11/26/light-the-night-review-a-soapy-east-asian-character-drama/ （read；**只評第一部 8 集**）。清單外。
   - 摘要：他說本劇比開場的棄屍畫面所暗示的更「肥皂劇」，節奏怪、套路多、支線不知所終，但兩位媽媽桑的友誼撐得起，懸疑也足以讓人看到結尾；懷疑觀眾會不會回來看第二、三部。給 3/5。立場：中性偏保留。
   - 原文：「Light the Night is a soapy and lightly melodramatic character drama that'll probably divide audiences, but there's enough mystery to keep one engaged just about to the end.」
   - SCMP Post Magazine 篇（snippet）、Sportskeeda 第二部（snippet）不用。學術：Global Storytelling 期刊論文（snippet，未讀）。
4. **中文評論（台灣）**：電影神搜，潘光中，2021-11-29，〈【劇評】台劇新標竿！Netflix 復刻年代劇《華燈初上》第一季：你還能找出更完美的組合嗎？〉。https://news.agentm.tw/203102/ （read；評第一部 8 集）
   - 摘要：他說本劇是「台灣戲劇圈的天花板」，杜政哲的人性刻畫遇上連奕琦的懸疑節奏，卡司是「只有在金鐘或金馬後台才能看見的豪華名單」；把第一部看成三幕劇的「鋪陳」。立場：強推。
   - 原文：「第一季八集可以一口氣追完，幾乎找不到任何一個無謂的表演細節，每一顆鏡頭都藏著飽滿的情緒。」
   - 電影神搜第二部劇評 https://news.agentm.tw/207285/ （snippet，沒讀）。
5. **分歧**：IMDb 7.4（1.8K）、MDL 三部 7.9–8.0、Google 2022 快速竄升台灣戲劇 #1（ratings 檔）；金鐘 2022 戲劇提名、吳慷仁 AACA 最佳男配角（awards 檔）。**第一部就分歧**：RSC 嫌「肥皂劇、節奏怪」給 3/5，潘光中說「天花板」。兩篇都只評第一部，第二、三部沒有讀到署名評論。

## 4. 回魂計（Netflix，2025；英文 The Resurrected）

1. **Metacritic**：沒有頁面（站內搜尋「the resurrected」沒有相符結果，read）。
2. **豆瓣**：沒有找到媒體引述的分數。
3. **英文評論**：Heaven of Horror，Karina "ScreamQueen" Adelgaard，2025-10-09，〈The Resurrected – Series Review | Netflix〉。https://www.heavenofhorror.com/reviews/the-resurrected-2025-netflix-series/ （read；文中沒寫看了幾集，首播當天刊出）。清單外，恐怖類型站。
   - 摘要：她說製作品質「very impressive」，台灣類型劇常卡在情節與節奏，這部沒有；拿朴贊郁《親切的金子》比，演員表現出色。立場：推。
   - 原文：「The production quality of this Taiwanese series is very impressive. … The struggle can, however, come from the actual plot and pace. Fortunately, not this one!」
   - 備用：Ready Steady Cut，Jonathon Wilson，2025-10-09，〈'The Resurrected' Review – A Unique, Twisted Take On The Revenge Drama〉，4/5（read；**明寫只看了 Netflix 給媒體的前兩集**：「at least in the couple of episodes Netflix provided to press for review」）。RSC 已用滿，不用。
4. **中文評論（台灣）**：
   - 關鍵評論網〈TNL+ 影劇〉，白鐵仔（資深社群觀察家），2025-10-24，〈Netflix《回魂計》：舒淇演活台灣女性的堅韌、勇武與內斂，堪稱近年台劇天花板〉。https://www.thenewslens.com/article/260153 （partial (Exa)：讀到前三分之一，多在談「台劇天花板」的標準）
     - 摘要（導言）：國際級製作與演技「堪稱台劇天花板」；缺點是為多季鋪陳，首季敘事稍嫌複雜。立場：推。
     - 原文：「惟其為多季鋪陳的架構，使首季敘事稍嫌複雜，但瑕不掩瑜。」
   - 天下雜誌，署名「awwrated」（非個人名，看起來是內容合作帳號），2025-11-05，〈Netflix《回魂計》影評：當體制無法撫慰傷痛，什麼才是真正的正義？〉。https://www.cw.com.tw/article/5138176 （partial (Exa)；全劇劇透）。文中整理國際評論「搖擺不定」「為了反轉而反轉」的批評，但引述沒有標出處，**不要轉引那些國際評論**。
5. **分歧**：IMDb 7.0（976）、Netflix 2025 華語劇 #5、DailyView 2025 #5（ratings 檔）；金鐘 2026 迷你劇集提名、今敏木木劇評人榜 2025 #7、LINE 聚光賞 2025 台劇 #2（awards 檔）。merged-candidates 排序第 1（7 類來源）。讀到的英文、台灣評論都偏正面，唯一的保留是「首季敘事複雜」；天下文說國際評價兩極，但沒給來源。

## 5. 如果我不曾見過太陽（第一部／第二部）（Netflix，2025；英文 Had I Not Seen the Sun）

1. **Metacritic**：**有頁面，沒有 Metascore**。https://www.metacritic.com/tv/had-i-not-seen-the-sun/ （read）：「Available after 4 critic reviews」，目前 2 篇，都是 70——Screen Rant（Nick Bythrow）、Decider（Joel Keller）；User score 也是 tbd。
2. **豆瓣**：沒有找到媒體引述的分數。
3. **英文評論**：
   - **Decider（清單內）**，Joel Keller，2025-11-13，〈Stream It Or Skip It: 'Had I Not Seen The Sun' On Netflix…〉。https://decider.com/2025/11/13/had-i-not-seen-the-sun-netflix-review （read (Exa)；**只評第 1 集**，Stream It Or Skip It 欄的固定格式）。
     - 摘要：他說第一集開局有趣，殺手不輕易透露動機，像《沉默的羔羊》加《怵目驚魂28天》；曾敬驊「charming and menacing」。結論 STREAM IT。立場：推（只看首集）。
     - 原文：「The first episode of Had I Not Seen The Sun sets up an interesting dual story about a serial killer's high school years and how a filmmaker connects with one of his victims years later.」
     - 同欄另有第二部（2025-12-11，https://decider.com/2025/12/11/had-i-not-seen-the-sun-part-2-netflix-review ，snippet，同樣 STREAM IT，作者未讀到）。
   - Screen Rant，Nick Bythrow，2025-11-13，〈Had I Not Seen The Sun Part 1 Review: Emotional Taiwanese Drama Made Me Sympathize With A Killer〉。https://screenrant.com/had-i-not-seen-the-sun-part-1-review/ （partial：讀到約六成；評第一部全 10 集）。清單外。
     - 摘要：他說本劇像兩部劇並行，但平衡得好；曾敬驊是真正的主角，演出讓他對殺手產生同情。立場：推。
     - 原文：「This does make Had I Not Seen the Sun feel like two different shows sometimes — or, rather, a series about Jen-yao with Pin-yu's story tacked on to make it feel unique. However, this balance works in the series' favor as a whole.」
   - SCMP，James Marsh，2025-11-13，〈Netflix drama Had I Not Seen the Sun review: ridiculous serial killer romance from Taiwan〉。https://www.scmp.com/lifestyle/entertainment/article/3332574/netflix-drama-had-i-not-seen-sun-review-ridiculous-serial-killer-romance-taiwan （partial (Exa／jina)：付費牆，只讀到 **2.5/5** 與前四段劇情；批評內容沒讀到，只能引標題與星等）。
4. **中文評論（台灣）**：
   - 聯合報〈娛樂有評〉，雀雀，2026-01-03，〈「如果我不曾見過太陽」柯佳嬿演技再進化〉。https://stars.udn.com/star/story/10093/9241128 （read；兩部看完後寫）
     - 摘要：她說第一部所有詭異敘事在第二部揭密後「串連銜接成為一場令人心疼的療傷之旅」，是全劇超越其他劇本的創意；細寫 #MeToo 受害者的二度傷害；柯佳嬿多重人格的表演「自證了『太陽』是只有『想見你』團隊才能拍得出來」。立場：推。
     - 原文：「而這也是「如果我不曾見過太陽」（以下簡稱「太陽」）全劇最精彩、並超越其他電視劇劇本的創意部分。」
   - 關鍵評論網〈TNL+ 影劇〉，胡芩（爾思出版共同創辦人），2025-11-15，〈【劇評】Netflix《如果我不曾見過太陽》：「問題少年」的故事，原來懸疑復仇只是外殼？〉。https://www.thenewslens.com/article/261131 （partial (Exa)：讀到前三分之一；只評第一部）。立場：推。原文：「這並非一部追求快節奏或劇情反轉的作品，而是一場對青春靈魂的靜默解剖。」
   - 關鍵評論網〈五大看點〉（https://www.thenewslens.com/article/261012）是介紹文，不算評論。
   - **建議正文用**：雀雀（胡芩留給乩身）。
5. **分歧**：**獎項與 MDL 很高、SCMP 只給 2.5**。MDL 兩部都 8.5（#4／#5）、IMDb 7.7（768）、Netflix 2025 華語劇 #4（ratings 檔）；首爾國際電視劇獎 2026 最佳劇集、亞洲電視大獎 2026 曾敬驊最佳男主角、今敏木木 2025 #3（awards 檔）。Metacritic 兩篇 70（其中 Decider 只看首集）vs SCMP 2.5/5、標題「ridiculous」；雀雀的稿件也提到柯佳嬿與曾敬驊的 CP 感「有兩極化討論」（圖說）。

## 6. 乩身（Netflix，2026；英文 Agent from Above）

1. **Metacritic**：沒有頁面（站內搜尋「agent from above」只有 Marvel's Agent Carter 等，read）。
2. **豆瓣**：沒有找到。
3. **英文評論**：
   - But Why Tho，Charles Hartford，2026-04-05，〈REVIEW: 'Agent From Above' Falls Short Of Greatness〉。https://butwhytho.net/2026/04/agent-from-above-review-netflix/ （read；評到最終戰，全季）。清單外。
     - 摘要：他說角色討喜但不難忘，單元故事聰明、特效與打鬥搶眼；但主線的超自然設定交代不足、張力打折，最終戰讓三太子接手，削弱了主角弧線。給 6/10。立場：中性。
     - 原文：「The visual effects and cool combat encounters help to give the series some extra pop, making for some exciting highlights. A solid watch, but certainly not a must-watch.」
   - **Taipei Times（清單內）**，Nigel P Daly（Contributing Reporter），2026-04-29，〈Netflix's 'Agent from Above': A parable for Taiwan's AI-anxious generation?〉。https://www.taipeitimes.com/News/feat/archives/2026/04/29/2003856420 （read (Exa)；Groundlane 回 403）。**注意**：Features 版社會評析，用乩身的「與神簽約」比喻青年失業、房價與 AI 焦慮，**不評戲本身好壞**，不能當劇評用，只能當「本劇引發的社會討論」。原文：「That may be why Agent from Above has struck such a nerve.」
   - Leisurebyte〈An Enjoyable, Albeit Obvious Fantasy Thriller〉（snippet；網站已停用）、Northwest Asian Weekly、Plugged In（snippet）。
4. **中文評論（台灣）**：關鍵評論網〈TNL+ 影劇〉，胡芩，2026-04-12，〈【劇評】Netflix《乩身》：神明不負責收尾，人終究要為業障承擔後果〉。https://www.thenewslens.com/article/266475 （partial (Exa)：讀到前三分之一）
   - 摘要：她說本劇把台灣民間信仰重組成「成熟的類型作品」，特別之處是把敘事核心從「神明介入」改成「凡人承擔」。立場：推。
   - 原文：「我認為《乩身》特別的地方，在於它改變了這種安排：那些原本可以向神明請求、向命運交付的部分，最後還是得由人自己承擔。」
   - 風傳媒〈風生活〉「好看嗎？網友真實評價」是網友反應整理，不算評論。
5. **分歧**：**收視創紀錄、評分平平**。Netflix 2026 上半年台劇 #1（4.9M 觀看）、全球非英語 #6；IMDb 6.3、MDL 7.8（ratings 檔）；金鐘 2026 迷你劇集提名（awards 檔）。But Why Tho 6/10 嫌主線與結局，胡芩肯定類型化；Taipei Times 把它讀成世代焦慮寓言。

## 7. 正港分局（Netflix，2024；英文 GG Precinct）

> **注意**：犯罪喜劇，與本篇懸疑主題有距離。

1. **Metacritic**：沒有頁面（站內搜尋「gg precinct」零結果，read）。
2. **豆瓣**：沒有找到。
3. **英文評論**：SCMP，James Marsh，2024-08-26，〈Netflix drama GG Precinct review: Greg Hsu, Gingle Wang play goofball cops in crime comedy〉。https://www.scmp.com/lifestyle/entertainment/article/3275883/netflix-drama-gg-precinct-review-greg-hsu-gingle-wang-play-goofball-cops-crime-comedy （partial (Exa)：付費牆，只讀到導言與前三段；**星等沒讀到**，舊版「2/5」是搜尋摘要，未核實）。清單外。
   - 讀到的部分：說本劇大量借用《沉默的羔羊》，警察向被關的連續殺人犯求助。沒有讀到評價段落，**正文只能引標題的 goofball 描述**。
   - 原文：「Drawing heavily from Jonathan Demme's Oscar-winning classic The Silence of the Lambs, the increasingly desperate detectives turn for help to the incarcerated killer whose crimes are now being mimicked」
   - 另有 DVDfever、DMTalkies、Heaven of Horror（snippet，沒讀；HoH 若要用會是第 3 部）。
4. **中文評論（台灣）**：電影神搜，人海邊的離島，2024-08-30，〈【劇評】Netflix《正港分局》：從萬眾矚目到評價兩極，類型混搭卻淪為調性不統一的僵局〉。https://news.agentm.tw/299922/ （read；評全季）
   - 摘要：她／他說懸疑線與無厘頭搞笑「兩面不討好」，主角群相較電影前作「全部走回頭路」，甚至有「過度冒犯與厭女的危機」；優點是演員、邰智源反派與動作場面。結論是「打發時間綽綽有餘的輕鬆小品」，但缺後勁。立場：有保留偏負評。
   - 原文：「一方面致力編寫殺人案的劇情線，營造恐怖懸疑的張力，一方面又想追求無厘頭搞笑，結果就是兩面不討好。」
5. **分歧**：IMDb 5.9（519）、DailyView 2024 #5、Google 2024 快速竄升 #9（ratings 檔）；AACA 2025 台灣區最佳喜劇、許光漢喜劇男演員（awards 檔）。**得獎（喜劇獎）vs 劇評「調性不統一」、IMDb 不及 6**。

## 8. 台灣犯罪故事（Disney+／公視，2023；英文 Taiwan Crime Stories）

1. **Metacritic**：沒有頁面（站內搜尋「taiwan crime stories」只有 American Crime Story 等，read）。
2. **豆瓣**：沒有找到。
3. **英文評論**：Ready Steady Cut，M.N. Miller，2023-02-02，〈'Taiwan Crime Stories' Season 1 Review – An Intriguing Anthology Series with Obvious Flaws〉。https://readysteadycut.com/2023/02/02/taiwan-crime-stories-season-1-review/ （read；四個單元全評）。清單外。
   - 摘要：他說四個單元品質落差大，〈生死困局〉最懸疑；常見毛病是角色憑空冒出推論、互動生硬；但卡司與幾段短篇夠強，切成單元劇反而比一條長線有趣。給 3/5。立場：中性偏推。
   - 原文：「While the series has put together a fine cast, the stories are uneven, ranging wildly from intricate to unencumbered.」
   - SCMP，James Marsh 兩篇（首單元〈出軌〉、第二單元，各只評一個單元；snippet，沒讀；SCMP 已滿）。
4. **中文評論（台灣）**：電影神搜，潘光中，2023-01-09，〈Disney+ 台劇《台灣犯罪故事》〈出軌〉：事實只有一個，真相卻可以各取所需〉。https://news.agentm.tw/245765/ （read；**只評第一單元〈出軌〉3 集**）
   - 摘要：他說〈出軌〉多為原創改編，與南迴搞軌原案大相逕庭；撇開原案，故事設計「很有美感」，製作有國際水準；但剪輯過緊、邏輯漏洞與無關支線減損了犯罪實錄的驚悚度。立場：有保留。
   - 原文：「整體來說，在美方團隊的加持下，〈出軌〉的製作品質的確具備國際水準，演員們的演技表現也不落人後，但在故事完成度上還存在精進空間。」
   - 舊版列的關鍵評論網 https://www.thenewslens.com/article/178681 **已讀（Exa），是 Disney+ 贊助的「廣編企劃」**，不能用。Bella、Marie Claire 是介紹文。
5. **分歧**：金鐘 2023 戲劇提名、亞洲電視大獎 2023 提名（薛仕凌得獎）（awards 檔）；Google 2023 快速竄升 #9（ratings 檔）。英文 RSC 與台灣潘光中都說「單元品質不均、有國際水準」，沒有明顯分歧；但台灣這邊只有一個單元的評論。

## 9. 八尺門的辯護人（公視／Netflix，2023；英文 Port of Lies）

> **利益關係**：本劇由鏡文學出品；鏡週刊與鏡文學同集團。下列評論都不是鏡週刊。

1. **Metacritic**：沒有頁面（站內搜尋「port of lies」只有 House of Lies、Big Little Lies 等，read）。
2. **豆瓣**：豆瓣 2023 評分最高華語劇集 #6（ratings 檔）。舊版寫 beauty321 8.7，**原文核對後找不到**，刪除。
3. **英文評論**：nomanisanis.land，Brian Hioe（New Bloom 雜誌主編；本站是他的個人站），2023-08-13，〈"Port of Lies" Dramatizes Charged Racial Issues in Taiwanese Society〉。https://nomanisanis.land/port-of-lies-review/ （read；**只評前兩集**：「from just two episodes」）。清單外。
   - 摘要：他說本劇試圖處理原住民與東南亞移工之間的衝突，取材自真實的遠洋漁業；問題是印尼移工角色「只被描繪成沒有主體性的受害者」，進步價值有時寫在臉上；李銘順的表演撐起全劇，節奏與轉場生硬。立場：推（有保留）。
   - 原文：「If Port of Lies is somewhat problematic, it is in that its depiction of Indonesian migrants is always as passive victims.」
   - Global Voices 是報導；Taipei Times 只有金鐘新聞。清單內沒有找到。
4. **中文評論（台灣）**：
   - 聯合報〈娛樂有評〉，雀雀，2023-08-12，〈2023台劇功德劇「八尺門的辯護人」〉。https://stars.udn.com/star/story/10093/7362921 （read；播畢後寫）
     - 摘要：她說這是「高濃度律政劇」，讓觀眾無痛認識原住民、移工、漁業官商勾結、廢死等最硬的議題；「介於壓抑的日劇與張狂的韓劇之間」；預言李銘順金鐘「毫無懸念」。立場：強推。
     - 原文：「以此來看，「八尺門的辯護人」堪稱為 2023 台灣影視作品群裡的一大重點功德劇。」
   - 關鍵評論網（精選轉載），楊晴翔律師，2023-08-04，〈《八尺門的辯護人》：在多語族群混居的台灣，語言使用的本身就是權力階級的展現〉。https://www.thenewslens.com/article/189712 （read (Exa)；原載「家事法官沒告訴你的事」，對照原著小說）
     - 摘要：律師作者從死刑與語言權力切入，說佟寶駒在偵查庭全程講阿美族語是「有聲的不合作抗爭」，影劇比小說更深刻；結論是「編、導、演都很優異」。立場：推。**注意**：是轉載的律師個人觀後感，非媒體編輯部或專職劇評人。
     - 原文：「只要一個土地上存在不同語言的族群，語言使用的本身就是權力階級的展現」
   - 關鍵評論網〈在牌桌上喬事喬人喬生死〉https://www.thenewslens.com/article/190345 （snippet，沒讀）。
   - **建議正文用**：楊晴翔（雀雀已用在模仿犯、太陽）；若要更像劇評，用雀雀。
5. **分歧**：IMDb 8.1（551）、豆瓣 DB23 #6、DailyView 2023 #4（ratings 檔）；金鐘 2024 迷你劇集獎＋6 項個人獎（awards 檔）；LINE TODAY 2023 網友最愛 #4（fans 檔）。**評審、豆瓣、IMDb 一致高**；唯一的異聲是 Brian Hioe 對移工「被動受害者」描寫的批評（只看前兩集）。英文主流媒體缺席。

## 10. 零日攻擊（公視＋／myVideo，2025；英文 Zero Day Attack）

1. **Metacritic**：沒有本劇頁面。站內搜尋「zero day attack」命中的 `/tv/zero-day/` 應是 2025 年美國 Netflix 同名劇，未開頁確認，不要混用（read）。
2. **豆瓣**：沒有找到。
3. **英文評論**：nomanisanis.land，Brian Hioe，2026-03-08，〈"Zero Day Attack" is in Final Evaluation a Mixed Bag〉。https://nomanisanis.land/zero-day-attack-overall-review/ （read；全 10 集總評）。清單外。
   - 摘要：他說本劇比較像推想小說，不是台灣遭入侵的預言藍圖；描寫不同立場的〈蛇仔〉〈愛你一萬年〉最好，網紅被 AI 洗腦的單元不寫實、杜汶澤的角色沒交代完、〈投豬一票〉帶有對越南人的種族刻板印象；像香港的《十年》，是時代的產物。立場：中性（褒貶互見）。
   - 原文：「If the series has some insightful, even moving episodes, others are far less successful. In this sense, the series is, in final evaluation, something of a mixed bag.」
   - 同作者另有〈First Two Episodes…〉（只評前兩集，snippet，不用）。Foreign Policy、Taipei Times、ORCA、ASPI 是政治報導或智庫評析，非劇評。
4. **中文評論（台灣）**：關鍵評論網〈TNL特稿〉，艾瑞克，2025-10-08，〈【劇評】《零日攻擊》總結：不是所有篇章都有同等完成度，但仍是難以忽視的里程碑〉。https://www.thenewslens.com/column/streaming/259515 （partial (Exa)：讀到前三分之一；全季總評）
   - 摘要：他說十個單元分成「極端寫實」與「科幻寓言」兩條光譜，互為表裡，是近年台劇「最大膽、也最值得深思的作品」；部分篇章收尾倉促，但首尾兩集拓展了台劇邊界。立場：推。
   - 原文：「它不只是一部劇集，更像是一本寫給台灣未來的「可能性之書」。」
   - 同站另有第一集、第二集單集劇評（snippet，沒讀）。報導者英文報導（snippet）。
5. **分歧**：**話題第一、評分最低**。DailyView 2025 #1（政治討論占 39.5%）、IMDb 4.8（881，疑似政治性負評）（ratings 檔）；LINE 2025 台劇榜 #7（awards 檔）。兩篇署名評論都說「單元不均」，但台灣這篇以「里程碑」作結、Brian Hioe 以「mixed bag」作結。

## 11. 百萬人推理（Netflix，2026；英文 Million-Follower Detective）

1. **Metacritic**：沒有頁面（站內搜尋「million follower detective」只有 True Detective 等，read）。
2. **豆瓣**：沒有找到媒體引述的分數（搜尋結果裡的豆瓣頁摘要不採用）。
3. **英文評論**：Heaven of Horror，Karina "ScreamQueen" Adelgaard，2026-02-12，〈Million-Follower Detective – Review | Netflix Crime-Thriller Series〉。https://www.heavenofhorror.com/reviews/million-follower-detective-netflix-series/ （read；**明寫只看了前幾集**：「For this review, I only watched the first few episodes」）。清單外。
   - 摘要：她說本劇剪接極碎，每幾秒就切一次，想模仿社群媒體卻不適合長篇敘事；八集太長；前提有趣，但她不喜歡風格與故事。星等圖示 2/5。立場：負評。
   - 原文：「It's made with a social media approach, which makes sense for the plot, but does not make for good television or storytelling.」
   - Leisurebyte、Kwaves and Beyond、Filmzzine（snippet）；Hello! Magazine 是觀眾反應報導。
4. **中文評論（台灣）**：**沒有找到台灣媒體署名評論**。搜過 Groundlane（domains 限定電影神搜、娛樂有評、500輯、關鍵評論網、獨立評論、釀電影、風傳媒、上報、VERSE、天下）與 Exa。只找到：NOWnews（2026-02-19，記者張一笙，綜合網友負評的新聞）、JUKSY（網友評價整理）、ELLE 台灣（Wei Wu，2026-02-16，「省思」整理，介紹型）、風傳媒〈風生活〉兩篇 PTT 反應整理、onlinemoviesworld「戲院線上」（Amelie，網路評價綜整）、個人部落格 waynesan.com、shungyeung.com（港人部落格）——都不算台灣媒體劇評。
5. **分歧**：**Netflix 台灣上半年 #2（3.0M 觀看）vs IMDb 6.0**（ratings 檔）；PTT 與新聞整理的網友評價兩極（「兇手太好猜」「剪輯重複畫面」），與 Heaven of Horror 批評的剪接一致。

## 12. 死了一個娛樂女記者之後（公視／Netflix，2025；英文 Tabloid）

> **利益關係**：本劇由鏡文學出品（改編鏡文學小說），鏡週刊與鏡文學同集團。

1. **Metacritic**：沒有頁面（站內搜尋「tabloid」只有 Tabloid Wars，read）。
2. **豆瓣**：沒有找到。
3. **英文評論**：**沒有找到署名英文評論**。Groundlane 與 Exa 搜尋只有 MyDramaList（0 篇評論）、TMDB、TaiwanPlus、TAICCA 展館頁（片商資料，日內瓦影展國際影集競賽入圍）、C21Media 市場頁，都不是評論。
4. **中文評論（台灣）**：
   - 關鍵評論網〈TNL+ 影劇〉，徐佑德，2025-03-11，〈Netflix《死了一個娛樂女記者之後》：雖有諸多「不夠好」，但已是媒體劇的模範生了〉。https://www.thenewslens.com/column/streaming/250009 （partial (Exa)：讀到前三分之一；播畢後寫）
     - 摘要：他說本劇勇敢揭露娛樂圈與媒體的白手套、封口費，「少了熱血記者的光明天真，多了更多黑暗面跟寫實面」；整體「略顯力猶未逮，但確實能讓普羅大眾接受」。文中自己點出劇本有不少鏡週刊、壹週刊資深記者參與。立場：推（有保留）。
     - 原文：「整體而言，《死了一個娛樂女記者之後》略顯力猶未逮，但確實能讓普羅大眾接受。」
   - 電影神搜〈開箱〉，人海邊的離島，2025-02-12，〈【開箱】《死了一個娛樂女記者之後》：在一條人命背後，是娛樂界及媒體產業的千瘡百孔〉。https://news.agentm.tw/327643/ （read；**只評前兩集**：「目前僅播出兩集，仍有待觀察」）
     - 摘要：劇情緊湊、人物鮮明、對話自然；但台語使用者不是甘草就是罪犯，「隱含的偏見不是台劇第一遭」。立場：推。
     - 原文：「人物對話十分流暢，沒有諸多台劇的詬病（例如文青台詞或尷尬金句），是值得嘉許的點。」
   - 鏡週刊〈娛樂透視〉https://www.mirrormedia.mg/story/20250117insight002 （snippet，沒讀）——**同集團、介紹型專題，不採用**。
   - **建議正文用**：徐佑德（人海邊的離島 已用在正港分局，且這篇只評兩集）。
5. **分歧**：今敏木木 2025 #8（awards 檔）、Google 2025 快速竄升 #6（ratings 檔）；MDL 7.8（17 人，Exa 搜尋結果頁）。劇評說「不夠好但已是模範生」，國際媒體完全缺席。

## 13. 她和她的她（台視／Netflix，2022；英文 Shards of Her）

1. **Metacritic**：沒有頁面（站內搜尋「shards of her」只有 The Shards、Pieces of Her 等，read）。
2. **豆瓣**：**8.6**。beauty321 Netflix 原創台劇榜（2024-03-07）列第 1、8.6。https://www.beauty321.com/post/60663 （read；準媒體）。另有豆瓣 2022 評分最高華語劇集 #2（ratings 檔）。
3. **英文評論**：Leisurebyte，Pooja Darade，2022-10-29，〈Shards of Her Review: Mystery Thriller That's Intense and Painfully Slow〉。https://leisurebyte.com/shards-of-her-review-intense-painfully-slow/ （read (Exa)；全 9 集。**網站目前停用**，Groundlane 回 402）。清單外。
   - 摘要：她說本劇處理性侵議題的場面令人不忍，但花太多時間在謀殺謎團，第 4–6 集失去抓力、第 7 集才回溫；6 集會更好；許瑋甯用眼神撐起角色。給 2.5。立場：負評偏中性。
   - 原文：「It's a serious subject, but the screenplay is bumpy, and the pace is painfully slow.」
   - The China Project 年度清單（清單型，snippet）、40somethingahjumma（Substack，snippet）。
4. **中文評論（台灣）**：
   - 聯合報〈娛樂有評〉，凱特C，2022-11-01，〈《她和她的她》／用懸疑包裝沉重議題 在虛實之間正視傷痛〉。https://stars.udn.com/star/story/10093/6730267 （read）
     - 摘要：她說本劇把兩個世界的虛實界線模糊，讓觀眾跟主角一樣困惑；性侵題材容易說教，但解離世界的設定讓誇張情節都得到解答。立場：推。
     - 原文：「關於性侵、性騷擾的主題，處理不當很容易就會朝著說教意味濃厚的方向走，甚至出現不合常理的情節，但在劇中，由於解離世界的設定，讓看似誇張化的情節都得到了解答。」
   - 聯合報〈娛樂有評〉，雀雀，2022-11-05，〈《她和她的她》以驚悚懸疑劇型面對人類文明史上最大黑洞〉。https://stars.udn.com/star/story/10093/6739920 （read）。拿今敏《藍色恐懼》比，說本劇「選擇不獵奇聚焦在性侵細節」。立場：推。
   - 電影神搜，潘光中，2022-10-31，〈【劇評】《她和她的她》：妳不必是誰的誰，請好好愛自己〉。https://news.agentm.tw/239364/ （partial：擷取只到劇情介紹，評價段沒讀到）。
   - **建議正文用**：凱特C（分散雀雀、潘光中）。
5. **分歧**：**豆瓣與評審高、IMDb 不到 7、英文小站嫌慢**。豆瓣 8.6（Netflix 台劇第 1）、DB22 #2、MDL #24 8.1、IMDb 6.9（926）（ratings 檔）；金鐘 2023 迷你劇集提名、許瑋甯視后（awards 檔）。Leisurebyte 2.5「painfully slow」vs 台灣兩篇都推。

---

## 已移出本篇（線索保留，未讀）

以下三部 2026-11-26 移出 TW1。內容是 2026-11-13 的 snippet 線索，**全部沒讀過**，移到別篇時要重讀。

- **此時此刻**（Netflix，2023；At the Moment）：Decider，Joel Keller（Stream It or Skip It，網址未取得，可能只評首集）；Ready Steady Cut，2023-11-11，〈At the Moment Season 1 Review – A sweet but longwinded Taiwanese anthology〉https://readysteadycut.com/2023/11/11/at-the-moment-season-1-review/ 。台灣只有 Bella、Marie Claire、beauty321 介紹文。beauty321 Netflix 台劇榜（2024-03-07，read 標題層）列第 9、豆瓣 6.7。分歧：IMDb 6.9、金鐘 2024 戲劇提名、徐熙娣 AACA 女配角、LINE TODAY 2023 #6。
- **忘了我記得**（Netflix，2025；Forget You Not）：SCMP〈Netflix drama Forget You Not: Hsieh Ying-xuan, Chin Han lead Rene Liu-directed melodrama〉https://www.scmp.com/lifestyle/entertainment/article/3310611/ （評論或前瞻未確認）；關鍵評論網〈【劇評】Netflix劉若英《忘了我記得》：謝盈萱與秦漢教科書級演繹，並非無懈可擊卻真誠溫柔〉https://www.thenewslens.com/article/253417 ；聯合報〈娛樂有評〉雀雀〈台劇《忘了我記得》為秦漢預約人生首座金鐘影帝獎座〉https://stars.udn.com/star/story/10093/8775172 。Screen Rant Nick Bythrow 在太陽評論開頭提到本劇是「sentimental comedy-drama」。分歧：豆瓣 2025 #4（8.3）、抄襲《漫才梅索太太》爭議（新聞）。
- **火神的眼淚**（公視，2021；Tears on Fire）：英文、台灣署名評論都沒找到。beauty321〈近年豆瓣「高評分」台劇Top10〉（2022-10-23，read 標題層）列第 2、**豆瓣 9.0**（https://www.beauty321.com/post/51339）。IMDb 7.9、Google 2021 快速竄升戲劇 #3（ratings 檔）。

---

## toolDegradation

- **2026-11-13（線索表）**：MCP 全部斷線（Groundlane、Exa、Tavily、jina、firecrawl、linkup 回 502）；內建 WebFetch 對非白名單網域 ENOTFOUND；只用內建 WebSearch，全檔 snippet。
- **2026-11-26（本次升級）**：
  - **Groundlane MCP**（ToolSearch 載入 `web_search`、`web_fetch`、`web_extract`）：主力。Metacritic 13 部 `web_extract`、開 1 個 `/tv/` 頁；Ready Steady Cut、Heaven of Horror、nomanisanis.land、But Why Tho、Screen Rant、電影神搜、聯合報系、500輯、beauty321 都讀到。失敗：SCMP、關鍵評論網、天下雜誌回 `browser-challenge`（UPSTREAM_ERROR）；Taipei Times 回 403；Leisurebyte 回 402（網站停用）。`web_search` 子供應商 tavily、exa、brave、you、parallel 多次 unavailable，fusion 退回 keenable／browserbase／serpapi。
  - **Exa**（`web_fetch_exa`、`web_search_exa`）：補 SCMP（付費牆，只有前幾段）、關鍵評論網（TNL+ 只有前半）、天下雜誌、Decider、Taipei Times、Leisurebyte 副本；搜尋百萬人推理台灣評論、Tabloid 英文評論。
  - **jina**（`read_url`）：SCMP 兩篇對照，同樣只拿到付費牆前段（星等確認：太陽 2.5/5、誰是被害者2 2/5）。
  - **Tavily**：`tavily_extract` 回 432（方案用量上限），無法用。
  - **firecrawl**：`firecrawl_scrape` 回額度用完（每日 MCP 額度約 5 小時後重置），沒有用到。
  - 沒有讀豆瓣頁，沒有繞過 sec.douban.com。終端機 curl 被擋，沒有用。

## 待補與注意

1. **SCMP 三篇只讀到付費牆前段**：誰是被害者2（2/5）、太陽（2.5/5）可以引星等與導言；**正港分局連星等都沒讀到**，正文不要寫 2/5。若要完整讀，需要有 SCMP 訂閱的瀏覽器。
2. **只評首集／前幾集的評論**：Decider（太陽，第 1 集）、Brian Hioe（八尺門，前兩集）、Heaven of Horror（百萬人推理，前幾集）、人海邊的離島（死了一個娛樂女記者之後，前兩集）、潘光中（台灣犯罪故事，只評〈出軌〉單元）、RSC Wilson（華燈初上第一部；回魂計前兩集，備用）。正文引用時要註明。
3. **仍找不到**：死了一個娛樂女記者之後 的英文署名評論；百萬人推理 的台灣媒體署名評論。
4. **TNL+ 文章都只讀到前半**（徐佑德×2、胡芩×2、白鐵仔、艾瑞克）；引用的原文句都在讀到的範圍內，但文末結論沒讀到。
5. Leisurebyte 網站停用，她和她的她 的英文評論只有 Exa 副本；正文若要給連結，建議附 Wayback 存檔或改用別篇。
6. 豆瓣分數全部來自 beauty321（美妝網站）兩篇排行清單，建議正文寫成「據台灣媒體整理」並註明 2024 年的時間點。
