# TW1 評價資料表：台劇｜懸疑、犯罪與驚悚 16 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-13。片單來自 `post-tw1-shows.txt`。IMDb／MDL／豆瓣年度榜／Netflix 榜沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、PTT／LINE TODAY／DailyView 沿用 `candidates-fans-taiwan.md`，這裡不重抓，只在「分歧」欄引用並標「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

> **⚠ 本檔是「線索表」，不是完成的評價表。** 這個 session 的 MCP 網路工具（Groundlane、Exa、Tavily、jina、firecrawl、linkup）全部斷線（502）。內建 `WebFetch` 只能連到環境白名單內的網域：metacritic.com、scmp.com、taipeitimes.com、nomanisanis.land 全部 DNS 解析失敗（`ENOTFOUND`，即不在 Allowed domains），依工具指示不再嘗試其他站。唯一可用的是內建 `WebSearch`（只回標題、網址與搜尋模型的摘要）。因此 **本檔每一條都是 snippet，沒有任何一篇讀到內文**，依規則 **不能當評論用、也不附原文引述**（搜尋摘要裡的引號句是搜尋模型轉述，未經原文核對，一律不收）。下面列的是「已確認存在、標題與網址可用、待下一輪讀全文」的候選。作者欄只在標題或網址本身帶出作者時才寫，否則寫「作者未讀到」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | `WebSearch` 限定 `metacritic.com` 網域，用英文片名搜 | WebSearch（WebFetch 對 metacritic.com 回 ENOTFOUND） | snippet。**只有《如果我不曾見過太陽》確認有 `/tv/` 頁面**（https://www.metacritic.com/tv/had-i-not-seen-the-sun/ ；摘要稱 2 篇評論、Decider 70、Screen Rant 70，未達 4 篇所以沒有 Metascore）。模仿犯、誰是被害者、乩身逐部單獨搜過，沒有找到 `/tv/` 頁；其餘 12 部是合併查詢，沒有命中，**不能據此斷定沒有頁面**。模仿犯在 Metacritic 2023 首播日曆頁（https://www.metacritic.com/feature/tv-premiere-dates?page=1）有出現，但沒有看到評分頁 |
| 豆瓣 | 只找媒體引述的分數；沒有讀豆瓣頁，沒有繞過 sec.douban.com | WebSearch | snippet。只找到 beauty321（美妝網站，準媒體）豆瓣台劇排行清單提到八尺門 8.7、華燈初上 8.1、模仿犯排第 5；沒有讀到內文核對。其餘以 ratings 檔的豆瓣年度榜（DB22／DB23／DB25）為準 |
| 英文評論 | 署名評論 | WebSearch（限定 variety／hollywoodreporter／collider／rogerebert／indiewire 搜過；`decider.com`、`nytimes.com`、`theguardian.com` 被 WebSearch 拒絕作為網域篩選） | snippet。**清單內媒體**：沒有找到 Variety／THR／Collider／RogerEbert／IndieWire 的劇評（只有產業新聞）；Decider 只在 Metacritic 摘要中出現（如果我不曾見過太陽，70 分）與二手引述（誰是被害者）；Taipei Times 有 1 篇乩身 feature、零日攻擊相關新聞與社論。清單外：SCMP（7 部有評論，上限 3）、Ready Steady Cut、Leisurebyte、Heaven of Horror、Brian Hioe 的 New Bloom 系 nomanisanis.land 等 |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉／500輯、關鍵評論網、鏡週刊 等 | WebSearch（限定網域） | snippet。**16 部中有 12 部找到清單內媒體的署名或標為【劇評】的文章**（標題可見）；此時此刻、火神的眼淚、台灣犯罪故事只找到 Bella、Marie Claire 等女性時尚網站的介紹文；乩身另有關鍵評論網劇評 |

標記說明：**read** = 讀到內文；**partial** = 讀到一部分；**snippet** = 只看到搜尋結果（標題／網址／搜尋模型摘要），不算讀過、不當評論用。本檔全部是 snippet。

> 英文媒體使用次數（清單外上限 3，下一輪讀全文時照此分配）：SCMP 候選 7 部（模仿犯、誰是被害者 S1／S2、華燈初上、正港分局、如果我不曾見過太陽、忘了我記得、台灣犯罪故事），正文最多選 3；Ready Steady Cut 候選 6 部（模仿犯、華燈初上、回魂計、台灣犯罪故事、此時此刻、誰是被害者 S1；作者 Jonathon Wilson、M.N. Miller）；Leisurebyte 候選 6 部；Heaven of Horror 候選 5 部。
>
> 台灣中文評論作者：**雀雀**（聯合報〈娛樂有評〉／500輯）一人就出現在 6 部（模仿犯、八尺門、她和她的她、如果我不曾見過太陽、忘了我記得、誰是被害者2），作者高度集中；電影神搜與關鍵評論網的【劇評】作者沒讀到。

---

## 1. 模仿犯（Netflix，2023；英文 Copycat Killer）

1. **Metacritic**：沒有找到 `/tv/` 頁（metacritic.com 限定搜尋兩次，只命中同名 EP 與 1995 年電影；首播日曆頁有列出本劇，snippet）。無法直接開 Metacritic 確認。
2. **豆瓣**：beauty321〈2023 台劇豆瓣評分 TOP10〉類清單把模仿犯列第 5，分數沒看到（https://www.beauty321.com/post/62695 或 /post/60663，snippet；準媒體排行清單）。
3. **英文評論**（全部 snippet，待讀）：
   - SCMP，James Marsh（搜尋摘要所示），〈Netflix drama Copycat Killer: Taiwanese whodunit about media-savvy murderer starring Wu Kang-ren〉。https://www.scmp.com/lifestyle/entertainment/article/3215215/netflix-drama-copycat-killer-taiwanese-whodunit-about-media-savvy-murderer-starring-wu-kang-ren （清單外；星等未見）
   - Ready Steady Cut，2023-03-31，〈Copycat Killer Season 1 Review – A high-quality but longwinded whodunit〉。https://readysteadycut.com/2023/03/31/copycat-killer-season-1-review （清單外；標題立場：肯定但嫌冗長）
   - Sportskeeda〈Copycat Killer review: A chilling Taiwanese crime mystery…〉、Heaven of Horror、The Envoy Web 亦有，清單外。
4. **中文評論（台灣）**（snippet，待讀）：
   - 電影神搜〈【劇評】Netflix台劇《模仿犯》：勇於挑戰經典改編值得鼓勵，但製作面的極端優劣全都被放大呈現〉。https://news.agentm.tw/252333/ （作者未讀到；標題立場：有保留）
   - 電影神搜〈【劇評】Netflix《模仿犯》：一念之間〉。https://news.agentm.tw/252630/ （作者未讀到）
   - 聯合報〈娛樂有評〉，雀雀，〈重口味破格台劇 「模仿犯」樹立台灣影集新標竿〉。https://stars.udn.com/star/story/10093/7070402/ （標題立場：推）
5. **分歧**：**收視與獎項極高、台灣劇評有保留**。IMDb 7.0（3K）、MDL #21 8.1、Netflix 全球非英語 #2（首部進全球前十的台劇）、Google 2023 快速竄升台灣戲劇 #1（ratings 檔）；金鐘 2023 戲劇節目提名（awards 檔）；LINE TODAY 2023 網友最愛台劇 #1（12.77%）（fans 檔）。電影神搜劇評標題說「極端優劣全都被放大」，與雀雀的「新標竿」形成對照（均 snippet）。

## 2. 誰是被害者（第 1–2 季）（Netflix，2020／2024；英文 The Victims' Game）

1. **Metacritic**：沒有找到 `/tv/` 頁（單獨搜尋，只命中 The Victim、The Game (2025) 等，snippet）。
2. **豆瓣**：沒有找到媒體引述的分數。
3. **英文評論**（snippet）：
   - S1：SCMP〈Taiwanese crime drama The Victims' Game gets off to a grisly start on Netflix〉。https://www.scmp.com/magazines/post-magazine/arts-music/article/3081408/taiwanese-crime-drama-victims-game-gets-grisly （清單外；標題看來只評開頭幾集）
   - S2：SCMP〈Netflix drama review: The Victims' Game season 2 – unconvincing Taiwanese murder thriller〉。https://www.scmp.com/lifestyle/entertainment/article/3267003/netflix-drama-review-victims-game-season-2-unconvincing-taiwanese-murder-thriller （清單外；摘要稱 2/5 星，未核對）
   - S1：Ready Steady Cut，2020-04-30，〈The Victims' Game Season 1 Review – a grisly Taiwanese crime drama〉。https://readysteadycut.com/2020/04/30/the-victims-game-netflix-review ；Cinema Escapist（https://www.cinemaescapist.com/?p=13671）；S2：Leisurebyte。均清單外。
   - Decider：只有 Taiwan Scene 綜整文二手提到 Decider 說本劇像「一整季的 CSI」，原文未找到，不採用。
4. **中文評論（台灣）**（snippet）：
   - S1：電影神搜〈【劇評】《誰是被害者》：將台劇推向另一高峰，替無法發聲的社會底層殺出血路〉。https://news.agentm.tw/107151/ （作者未讀到；推）
   - S2：關鍵評論網〈【劇評】Netflix《誰是被害者：第2季》：製作是國際水準，但劇本仍有瑕疵就看觀眾能否接受〉。https://www.thenewslens.com/article/204351 （有保留）
   - S2：電影神搜兩篇：https://news.agentm.tw/282931/ （「不只是表現足夠出色的續篇」）、https://news.agentm.tw/283640/ （「裹著懸疑外殼的親情大戲，維持水準」）
   - S2：500輯，雀雀〈誰是被害者2／雀雀劇評：台式懸疑犯罪劇迎戰第二季 眾星鬥戲引話題〉。https://500times.udn.com/wtimes/story/120840/8122145
5. **分歧**：**S1 口碑穩、S2 英文大報看衰**。IMDb 7.3（2.4K）、MDL S1 #27 8.1／S2 #37 8.0、DailyView 2024 #6（ratings 檔）；金鐘 2020 戲劇提名、2025 迷你劇集提名（S2）、亞洲影藝創意大獎台灣區最佳劇集 2020＋2024、張孝全 2020 亞洲電視大獎男主角（awards 檔）。SCMP 給 S2 2/5（snippet）vs 台灣劇評「維持水準」。

## 3. 華燈初上（三部）（Netflix，2021–2022；英文 Light the Night）

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：beauty321 Netflix 原創台劇豆瓣排行把華燈初上列第 2、8.1（https://www.beauty321.com/post/51339，snippet；準媒體排行清單，部數未標明）。
3. **英文評論**（snippet）：
   - Ready Steady Cut，Jonathon Wilson，2021-11-26，〈Light the Night review – a soapy East Asian character drama〉。https://readysteadycut.com/2021/11/26/light-the-night-review-a-soapy-east-asian-character-drama （清單外；第一部）
   - SCMP Post Magazine〈Netflix murder mystery series Light the Night set…〉。https://www.scmp.com/magazines/post-magazine/arts-music/article/3162486/netflix-murder-mystery-series-light-night-set （清單外）
   - Sportskeeda（第二部，標題稱「turns tedious whodunnit」）；Global Storytelling 期刊（密西根大學出版，學術論文）https://journals.publishing.umich.edu/gs/article/4288/galley/2498/view
4. **中文評論（台灣）**（snippet）：
   - 電影神搜〈【劇評】台劇新標竿！Netflix 復刻年代劇《華燈初上》第一季：你還能找出更完美的組合嗎？〉。https://news.agentm.tw/203102/ （作者未讀到；推）
   - 電影神搜〈【劇評】《華燈初上》第二季：真相愈發撲朔，兇手不只一人？〉。https://news.agentm.tw/207285/
5. **分歧**：IMDb 7.4（1.8K）、MDL 三部 7.9–8.0、Google 2022 快速竄升台灣戲劇 #1（ratings 檔）；金鐘 2022 戲劇提名、吳慷仁 AACA 最佳男配角（awards 檔）。英文評論一致指出「肥皂劇質感、第二部後推理變拖沓」（snippet），台灣劇評第一季稱「新標竿」。

## 4. 回魂計（Netflix，2025；英文 The Resurrected）

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：沒有找到媒體引述的分數。
3. **英文評論**（snippet）：Ready Steady Cut，Jonathon Wilson，2025-10-09，〈'The Resurrected' Review – A Unique, Twisted Take On The Revenge Drama〉。https://readysteadycut.com/2025/10/09/the-resurrected-review （清單外；摘要稱 4 分）。另 Heaven of Horror。清單內沒有找到。
4. **中文評論（台灣）**（snippet）：
   - 關鍵評論網〈Netflix《回魂計》：舒淇演活台灣女性的堅韌、勇武與內斂，堪稱近年台劇天花板〉。https://www.thenewslens.com/article/260153 （作者未讀到；推）
   - 天下雜誌 https://www.cw.com.tw/article/5138176 （標題未見，摘要談「體制無法療癒時的正義」，性質未確認）
5. **分歧**：IMDb 7.0（976）、Netflix 2025 華語劇 #5、DailyView 2025 #5（ratings 檔）；金鐘 2026 迷你劇集提名、今敏木木劇評人榜 2025 #7、LINE 聚光賞 2025 台劇 #2（awards 檔）。merged-candidates 排序第 1（7 類來源）。英文、台灣劇評目前都偏正面，沒看到明顯分歧。

## 5. 如果我不曾見過太陽（第一部／第二部）（Netflix，2025；英文 Had I Not Seen the Sun）

1. **Metacritic**：**有頁面**。https://www.metacritic.com/tv/had-i-not-seen-the-sun/ （snippet；摘要稱只有 2 篇評論——Decider 70、Screen Rant 70——未達 4 篇，無 Metascore；頁面以 season-1／season-2 分兩季）。
2. **豆瓣**：沒有找到媒體引述的分數。
3. **英文評論**（snippet）：
   - Decider（清單內）：只在 Metacritic 摘要中看到 70 分，原文網址未找到。**下一輪優先補讀。**
   - SCMP〈Netflix drama Had I Not Seen the Sun review: ridiculous serial killer romance…〉。https://www.scmp.com/lifestyle/entertainment/article/3332574/netflix-drama-had-i-not-seen-sun-review-ridiculous-serial-killer-romance-taiwan （清單外；標題立場：負評）
   - Leisurebyte、Heaven of Horror（第一部）、Soap Central 指南文，清單外。
4. **中文評論（台灣）**（snippet）：
   - 關鍵評論網〈【劇評】Netflix《如果我不曾見過太陽》：「問題少年」的故事，原來懸疑復仇只是外殼？〉。https://www.thenewslens.com/article/261131
   - 聯合報〈娛樂有評〉，雀雀，〈「如果我不曾見過太陽」柯佳嬿演技再進化〉。https://stars.udn.com/star/story/10093/9241128
   - 關鍵評論網〈五大看點〉（https://www.thenewslens.com/article/261012）是介紹文，不算評論。
5. **分歧**：**獎項與 MDL 很高、SCMP 標題嗆「荒謬」**。MDL 兩部都 8.5（#4／#5）、IMDb 7.7（768）、Netflix 2025 華語劇 #4（ratings 檔）；首爾國際電視劇獎 2026 最佳劇集、亞洲電視大獎 2026 曾敬驊最佳男主角、今敏木木 2025 #3（awards 檔）。SCMP 標題「ridiculous serial killer romance」vs Decider／Screen Rant 70（均 snippet）。

## 6. 忘了我記得（Netflix，2025；英文 Forget You Not）

> **注意**：本劇是失智症家庭劇，不屬於「懸疑、犯罪與驚悚」主題，是否留在本篇請主文章決定。

1. **Metacritic**：合併查詢沒有命中，未單獨確認。（Rotten Tomatoes 有頁面，非本欄要求。）
2. **豆瓣**：豆瓣 2025 評分最高華語劇集 #4（8.3）（ratings 檔）；沒有另找到媒體引述。
3. **英文評論**（snippet）：SCMP〈Netflix drama Forget You Not: Hsieh Ying-xuan, Chin Han lead Rene Liu-directed melodrama〉。https://www.scmp.com/lifestyle/entertainment/article/3310611/netflix-drama-forget-you-not-hsieh-ying-xuan-chin-han-lead-rene-liu-directed-melodrama （清單外；評論或前瞻未確認）。另 DVDfever、Kwaves and Beyond、DMTalkies（標題稱「被太多支線拖垮」），清單外小站。
4. **中文評論（台灣）**（snippet）：
   - 關鍵評論網〈【劇評】Netflix劉若英《忘了我記得》：謝盈萱與秦漢教科書級演繹，並非無懈可擊卻真誠溫柔〉。https://www.thenewslens.com/article/253417
   - 聯合報〈娛樂有評〉，雀雀，〈台劇《忘了我記得》為秦漢預約人生首座金鐘影帝獎座〉。https://stars.udn.com/star/story/10093/8775172
   - 噓！星聞〈劉若英「忘了我記得」爆抄襲美劇！Netflix回應曝光〉（https://stars.udn.com/star/story/10091/8773616）是新聞。
5. **分歧**：豆瓣 8.3、MDL 7.8、DailyView 2025 #2（ratings 檔）；金鐘 2026 迷你劇集提名、今敏木木 #4、LINE 2025 台劇 #4（awards 檔）。抄襲《漫才梅索太太》爭議（2025-03，新聞）是觀眾面的主要雜音。

## 7. 乩身（Netflix，2026；英文 Agent from Above）

1. **Metacritic**：沒有找到 `/tv/` 頁（單獨搜尋，snippet）。
2. **豆瓣**：沒有找到。
3. **英文評論**（snippet）：
   - Taipei Times（清單內），〈Netflix's 'Agent from Above': A parable for Taiwan's AI-anxious generation?〉，2026-04-29。https://www.taipeitimes.com/News/feat/archives/2026/04/29/2003856420 （Features 版；是評析還是報導未確認；WebFetch 被擋）
   - But Why Tho（https://butwhytho.net/2026/04/agent-from-above-review-netflix）、Leisurebyte〈An Enjoyable, Albeit Obvious Fantasy Thriller〉、Northwest Asian Weekly（Kai Curry）、Plugged In，清單外。
4. **中文評論（台灣）**（snippet）：關鍵評論網〈【劇評】Netflix《乩身》：神明不負責收尾，人終究要為業障承擔後果〉。https://www.thenewslens.com/article/266475 。風傳媒〈風生活〉多篇「好看嗎？網友真實評價」是網友反應整理，不算評論。
5. **分歧**：**收視創紀錄、評分平平**。Netflix 2026 上半年台劇 #1（4.9M 觀看）、全球非英語 #6；IMDb 6.3、MDL 7.8（ratings 檔）；金鐘 2026 迷你劇集提名（awards 檔）。英文小站多說「好看但可預測、結局失手」（snippet）。

## 8. 正港分局（Netflix，2024；英文 GG Precinct）

> **注意**：犯罪喜劇，與本篇懸疑主題有距離。

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：沒有找到。
3. **英文評論**（snippet）：SCMP〈Netflix drama GG Precinct review: Greg Hsu, Gingle Wang play goofball cops in crime comedy〉。https://www.scmp.com/lifestyle/entertainment/article/3275883/netflix-drama-gg-precinct-review-greg-hsu-gingle-wang-play-goofball-cops-crime-comedy （清單外；摘要稱 2/5）。另 DVDfever、DMTalkies、Heaven of Horror、moviesr.net。
4. **中文評論（台灣）**（snippet）：電影神搜〈【劇評】Netflix《正港分局》：從萬眾矚目到評價兩極，類型混搭卻淪為調性不統一的僵局〉。https://news.agentm.tw/299922/ （負評）
5. **分歧**：IMDb 5.9（519）、DailyView 2024 #5、Google 2024 快速竄升 #9（ratings 檔）；AACA 2025 台灣區最佳喜劇、許光漢喜劇男演員（awards 檔）。**得獎（喜劇獎）vs 劇評兩極、IMDb 不及 6**。

## 9. 台灣犯罪故事（Disney+／公視，2023；英文 Taiwan Crime Stories）

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：沒有找到。
3. **英文評論**（snippet）：
   - SCMP，James Marsh（摘要所示），兩篇：首單元〈Derailment…unconvincing〉https://www.scmp.com/lifestyle/entertainment/article/3205832/derailment-first-true-life-thriller-anthology-taiwan-crime-stories-disney-unconvincing-theres-still ；第二單元〈definite improvement, jury still out〉https://scmp.com/magazines/post-magazine/arts-music/article/3208032/taiwan-crime-stories-second-instalment-definite-improvement-jury-still-out-disney-thriller-series 。**都只評單一單元**。清單外。
   - Ready Steady Cut，M.N. Miller，2023-02-02，〈'Taiwan Crime Stories' Season 1 Review – An Intriguing Anthology Series with Obvious Flaws〉。https://readysteadycut.com/2023/02/02/taiwan-crime-stories-season-1-review/ （清單外；摘要稱 3/5，全季）
4. **中文評論（台灣）**：**沒有找到清單內媒體的署名評論**。只找到 Bella、Marie Claire 台灣版逐單元介紹（https://www.bella.tw/articles/movies&culture/38284 、https://www.marieclaire.com.tw/entertainment/tvshow/70795 ，介紹型）；關鍵評論網 https://www.thenewslens.com/article/178681 性質未確認。
5. **分歧**：金鐘 2023 戲劇提名、亞洲電視大獎 2023 提名（薛仕凌得獎）（awards 檔）；Google 2023 快速竄升 #9（ratings 檔）。英文評論說單元品質不均（snippet）。

## 10. 八尺門的辯護人（公視／Netflix，2023；英文 Port of Lies）

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：豆瓣 2023 評分最高華語劇集 #6（ratings 檔）；beauty321 清單稱 8.7（https://www.beauty321.com/post/62695 一帶，snippet，準媒體）。
3. **英文評論**（snippet）：Brian Hioe，nomanisanis.land（New Bloom 主編個人站），〈"Port of Lies" Dramatizes Charged Racial Issues in Taiwanese Society〉。https://nomanisanis.land/port-of-lies-review/ （清單外；WebFetch 被擋）。Global Voices（https://globalvoices.org/2023/07/27/new-taiwan-tv-series-tackles-sensitive-issue-of-race-and-makes-it-to-netflix/）是報導。Taipei Times 只有金鐘新聞。清單內沒有找到。
4. **中文評論（台灣）**（snippet）：
   - 聯合報〈娛樂有評〉，雀雀，〈2023台劇功德劇「八尺門的辯護人」〉。https://stars.udn.com/star/story/10093/7362921
   - 關鍵評論網兩篇評析：〈在多語族群混居的台灣，語言使用的本身就是權力階級的展現〉https://www.thenewslens.com/article/189712 ；〈在牌桌上喬事喬人喬生死〉https://www.thenewslens.com/article/190345 （議題評析，作者未讀到）
5. **分歧**：IMDb 8.1（551）、豆瓣 DB23 #6、DailyView 2023 #4（ratings 檔）；金鐘 2024 迷你劇集獎＋6 項個人獎（awards 檔）；LINE TODAY 2023 網友最愛 #4（fans 檔）。**評審、豆瓣、IMDb 一致高**，國際媒體幾乎缺席。

## 11. 零日攻擊（公視＋／myVideo，2025；英文 Zero Day Attack）

1. **Metacritic**：合併查詢沒有命中（注意同年有美國 Netflix《Zero Day》，搜尋容易混淆）。
2. **豆瓣**：沒有找到。
3. **英文評論**（snippet）：
   - Brian Hioe，nomanisanis.land，兩篇：〈First Two Episodes of "Zero Day Attack" are a Mixed Bag…〉https://nomanisanis.land/zero-day-attack-review （只評前兩集）；〈"Zero Day Attack" is in Final Evaluation a Mixed Bag〉https://nomanisanis.land/zero-day-attack-overall-review/ （全季）。清單外。
   - Foreign Policy，2025-11-26，〈zero-day-attack-taiwan-politics-divided〉https://foreignpolicy.com/2025/11/26/zero-day-attack-taiwan-politics-divided/ （政治報導／評析，非劇評）。
   - Taipei Times：〈TV series about Chinese invasion of Taiwan gets rave reviews at preview〉2025-07-29（新聞）、〈War drama 'wake-up call'…〉2025-05-14（feature），都不是劇評。ORCA、ASPI Strategist 為智庫評析。
4. **中文評論（台灣）**（snippet）：關鍵評論網〈【劇評】《零日攻擊》總結：不是所有篇章都有同等完成度，但仍是難以忽視的里程碑〉https://www.thenewslens.com/column/streaming/259515 ；另有第一集、第二集單集劇評（https://www.thenewslens.com/article/256704 、/257033）。報導者有英文報導 https://www.twreporter.org/a/taiwanese-tv-series-zero-day-attack （性質未確認）。
5. **分歧**：**話題第一、評分最低**。DailyView 2025 #1（政治討論占 39.5%）、IMDb 4.8（881，疑似政治性負評）（ratings 檔）；LINE 2025 台劇榜 #7（awards 檔）。劇評一致「單元品質不均但具里程碑意義」（snippet）。

## 12. 百萬人推理（Netflix，2026；英文 Million-Follower Detective）

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：沒有找到。
3. **英文評論**（snippet）：Heaven of Horror（https://www.heavenofhorror.com/reviews/million-follower-detective-netflix-series/）、Leisurebyte〈An Extremely Enjoyable Watch With Shocking Moments〉、Kwaves and Beyond、Filmzzine；Hello! Magazine〈Netflix viewers heavily divided…〉是觀眾反應報導。全部清單外。
4. **中文評論（台灣）**：**沒有找到清單內媒體的署名評論**。風傳媒〈風生活〉兩篇（https://www.storm.mg/lifestyle/11103352 、/11104214）是 PTT 網友反應整理，不算評論。
5. **分歧**：**Netflix 台灣上半年 #2（3.0M 觀看）vs IMDb 6.0**（ratings 檔）；台灣網友評價兩極（風傳媒整理，snippet）。

## 13. 死了一個娛樂女記者之後（公視／Netflix，2025；英文 Tabloid）

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：沒有找到。
3. **英文評論**：**沒有找到**署名英文評論（只有 GIFF 影展介紹、部落格）。
4. **中文評論（台灣）**（snippet）：
   - 關鍵評論網〈Netflix《死了一個娛樂女記者之後》：雖有諸多「不夠好」，但已是媒體劇的模範生了〉https://www.thenewslens.com/column/streaming/250009
   - 電影神搜〈【開箱】《死了一個娛樂女記者之後》：在一條人命背後，是娛樂界及媒體產業的千瘡百孔〉https://news.agentm.tw/327643/ （開箱文，可能只評前兩集）
   - 鏡週刊〈娛樂透視〉https://www.mirrormedia.mg/story/20250117insight002 ——**鏡週刊與出品方鏡文學同集團**，且屬介紹型專題，不算評論，要標利益關係。
5. **分歧**：今敏木木 2025 #8（awards 檔）、Google 2025 快速竄升 #6（ratings 檔）。劇評說「不夠好但已是模範生」，網友稱「預言神劇」（鏡週刊新聞，有利益關係）。

## 14. 此時此刻（Netflix，2023；英文 At the Moment）

> **注意**：疫情愛情單元劇，不屬於懸疑犯罪主題。

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：沒有找到。
3. **英文評論**（snippet）：Decider，Joel Keller（清單內，Stream It or Skip It；只在搜尋摘要中出現，網址未取得，可能只評首集）；Ready Steady Cut，2023-11-11，〈At the Moment Season 1 Review – A sweet but longwinded Taiwanese anthology〉https://readysteadycut.com/2023/11/11/at-the-moment-season-1-review/ （清單外）。
4. **中文評論（台灣）**：**沒有找到清單內媒體的署名評論**。只有 Bella、Marie Claire、beauty321 的介紹／金句整理（介紹型）。
5. **分歧**：IMDb 6.9（520）、DailyView 2023 #6（ratings 檔）；金鐘 2024 戲劇提名、徐熙娣 AACA 女配角（awards 檔）；LINE TODAY 2023 網友最愛 #6（fans 檔）。

## 15. 火神的眼淚（公視，2021；英文 Tears on Fire）

> **注意**：消防職人劇，不屬於懸疑犯罪主題。

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：沒有找到。
3. **英文評論**：**沒有找到**。Taipei Times 只有語言學習版新聞〈'Tears on Fire,' 'Word of Honor' attract high ratings〉2021-06-09（https://www.taipeitimes.com/News/lang/archives/2021/06/09/2003758817，新聞）；Taiker Magazine 有一篇介紹（清單外）。
4. **中文評論（台灣）**：**沒有找到**（搜尋未命中，可能需換關鍵字或改用 MCP 工具重搜）。
5. **分歧**：IMDb 7.9（502）、Google 2021 快速竄升戲劇 #3（ratings 檔）。評價資料稀少。

## 16. 她和她的她（台視／Netflix，2022；英文 Shards of Her）

1. **Metacritic**：合併查詢沒有命中，未單獨確認。
2. **豆瓣**：豆瓣 2022 評分最高華語劇集 #2（ratings 檔）；沒有另找到媒體引述分數。
3. **英文評論**（snippet）：Leisurebyte〈Shards of Her Review: Mystery Thriller That's Intense and Painfully Slow〉https://leisurebyte.com/shards-of-her-review-intense-painfully-slow/ ；The China Project 年度清單（https://thechinaproject.com/2022/11/14/the-best-chinese-language-drama-series-with-english-subtitles-you-can-stream-right-now/ ，清單型）；40somethingahjumma（Substack）。全部清單外。
4. **中文評論（台灣）**（snippet）：
   - 聯合報〈娛樂有評〉，雀雀，〈《她和她的她》以驚悚懸疑劇型面對人類文明史上最大黑洞〉https://stars.udn.com/star/story/10093/6739920
   - 聯合報〈娛樂有評〉〈《她和她的她》／用懸疑包裝沉重議題 在虛實之間正視傷痛〉https://stars.udn.com/star/story/10093/6730267 （作者未讀到；可分散雀雀集中）
   - 電影神搜〈【劇評】《她和她的她》：妳不必是誰的誰，請好好愛自己〉https://news.agentm.tw/239364/
5. **分歧**：豆瓣 DB22 #2、MDL #24 8.1、IMDb 6.9（926）（ratings 檔）；金鐘 2023 迷你劇集提名、許瑋甯視后（awards 檔）。**豆瓣與評審高、IMDb 不到 7**；英文小站嫌節奏慢（snippet）。

---

## toolDegradation

- **MCP 全部斷線**：Groundlane、Exa、Tavily、jina、firecrawl、linkup 啟動時回 502（CLIENT_HTTP_NOT_IMPLEMENTED）。
- **Groundlane 直接 HTTP**：沒有試。內建 `WebFetch` 只能 GET、不能 POST，且對非白名單網域一律 `ENOTFOUND`。
- **WebFetch**：對 metacritic.com、scmp.com、nomanisanis.land、taipeitimes.com 都回 `getaddrinfo ENOTFOUND`（不在環境 Allowed domains）。依工具提示停止嘗試其他網域。**全檔沒有讀到任何一頁內文。**
- **WebSearch**：可用，共約 35 次查詢。限定網域時，`decider.com`、`nytimes.com`、`theguardian.com` 被拒（"not accessible to our user agent"）。搜尋結果的摘要由搜尋模型改寫，引號句不可信，全部不收。
- Keenable、You.com keyless API：需要 WebFetch 連到 api.keenable.ai／api.you.com，沒有試（同屬非白名單網域，預期同樣 ENOTFOUND）。
- 沒有讀豆瓣頁，沒有繞過 sec.douban.com。終端機 curl 被擋，沒有用。

## 待補與注意

1. **下一輪必須在 MCP 恢復或把網域加進 Allowed domains 後，逐篇讀全文**，才能補上作者、日期、引述與「是否只評首集」。最少需要開放：`www.metacritic.com`、`www.scmp.com`、`readysteadycut.com`、`www.taipeitimes.com`、`decider.com`、`nomanisanis.land`、`news.agentm.tw`、`www.thenewslens.com`、`stars.udn.com`、`500times.udn.com`、`leisurebyte.com`、`www.heavenofhorror.com`。
2. Metacritic 只有模仿犯、誰是被害者、乩身、如果我不曾見過太陽做過單獨查詢；其餘 12 部要逐部重查。
3. 優先補讀清單內媒體：Decider（如果我不曾見過太陽、此時此刻）、Taipei Times（乩身 feature）。
4. 作者集中：雀雀出現在 6 部，正文挑選時改用關鍵評論網、電影神搜的篇章分散。
5. 主題不符：忘了我記得、此時此刻、火神的眼淚（以及喜劇取向的正港分局）不屬於懸疑犯罪，建議主文章確認是否移篇。
6. 鏡週刊與鏡文學同集團（死了一個娛樂女記者之後、八尺門的辯護人皆為鏡文學 IP），引用鏡週刊時要揭露。
