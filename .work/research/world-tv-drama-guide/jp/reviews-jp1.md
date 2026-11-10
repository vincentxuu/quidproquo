# JP1 評價資料表：日劇｜愛情、喜劇與 BL 17 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-10。片單來自 `post-jp1-shows.txt`。日本收視（Video Research）、TVer、IMDb／MDL、Filmarks、ORICON 數字沿用 `candidates-ratings-viewing-buzz.md`；獎項與評論家年度榜沿用 `candidates-awards-critics.md`；台灣 PTT／平台熱度沿用 `candidates-fans-taiwan.md`。這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic S1 | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（then you try making it、hot spot、calm sea、silent、escapist、incurable case of love、eye love you、ossan、what did you eat yesterday、chosen home、second to last love、extremely inappropriate、saionji、espers、favorite flower、glass heart、chihayafuru） | Groundlane `web_extract`（render=never，抓 `/tv/` 連結）；Glass Heart 再用 `web_fetch` 讀頁面 | 17/17 read：**只有 Glass Heart 有頁面**（Metascore tbd，3 則評論），其餘 16 部沒有 |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；沒有開豆瓣 subject 頁，沒有繞過 sec.douban.com | Exa search | 3 部有媒體或入口網站引述（silent、月薪嬌妻、昨日的美食），其中兩部是自媒體文章刊在入口網站；其餘只看到微博博主、豆列或購物指南，不採用 |
| 英文評論 | 署名評論，讀全文或大半 | Groundlane `web_fetch`、Exa `web_search_exa`／`web_fetch_exa`、jina `read_url`（Japan Times） | 13 部有署名評論（2 read、11 partial，其中 Japan Times 2 篇被付費牆擋住）；4 部找不到（戀愛可以持續到天長地久、再續．倒數第二次戀愛、西園寺小姐不做家事、至愛之花，後兩部只有部落格） |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、鏡週刊、關鍵評論網、釀電影；清單外：天下獨立評論、La Vie、Tatler | Groundlane `web_search`（限定網域）＋`web_fetch`；關鍵評論網與天下獨立評論用 Exa `web_fetch_exa`（Groundlane 遇 browser challenge） | 15 部有（13 read、2 partial）；2 部沒找到（Eye Love You、西園寺小姐不做家事） |

標記說明：**read** = 工具讀到頁面內文；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段（付費牆或截斷），或只看到 Exa 搜尋結果裡的長摘要；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> **英文評論覆蓋很薄**：清單內媒體只有 Collider、Decider（玻璃之心）和 The Japan Times（小鎮星熱點、極度不妥！）。Japan Times 的 TV 專欄（Patrick St. Michel）有付費牆，Groundlane、Exa、jina 都只拿到前 2–3 段，所以標 partial，只能當「立場未確認」。其餘 13 部都是清單外媒體或評論站：**The Blossom Review（Karen Mansoldo）4 部當主評論、2 部當補充或對照**（主評：有本事換你來做啊！、宛如粼光夫婦日和、被選中的家、一點點超能力；補充：極度不妥！、Eye Love You），超過韓劇版「同媒體上限 3」，原因是這幾部找不到其他署名英文評論；另有 Asian Movie Pulse、The Review Geek、North American Post、Future of the Force、Japan Gay Guide、Magdalene、scrmbl 各 1。
>
> 只評首集或前幾集的英文評論：Decider（玻璃之心，只評第 1 集）、Future of the Force（Eye Love You，分兩篇評第 1–5、6–10 集）。Japan Times 的小鎮星熱點文章是播出中（2025-02-10）寫的。
>
> **台灣中文評論**：釀電影 5 部（作者都不同：Yusmoke、倉鼠球営業中、吳思恩、鈺玟、范亦昕）；聯合報〈娛樂有評〉3 部；電影神搜 2 部；關鍵評論網 2 部；鏡週刊〈馬欣專欄〉1 部；清單外 2 部（天下獨立評論 米果、La Vie）。**筆名「雪奈／雪奈日劇部屋」一人寫了 5 篇**（聯合報〈娛樂有評〉：粼光、昨日的美食 S2、花牌情緣：巡；電影神搜：再續、至愛之花），立場幾乎都是推，正文引用時要注意來源集中。業配或介紹文另外標明，不算評論：Harper's BAZAAR 台灣（有本事，friDay 影音提供素材）、ELLE 台灣（小鎮星熱點「7 看點」）、GQ 台灣（玻璃之心黑膠）、Japaholic（多篇是 friDay 提供的新聞稿）。

---

## 1. じゃあ、あんたが作ってみろよ 有本事換你來做啊！（TBS 火曜，2025 秋）

1. **Metacritic S1**：沒有頁面（站內搜尋「then you try making it」只有 Making It 等，read）。
2. **豆瓣**：沒有可用的媒體引述。豆列「2025年日韩剧集」寫 7.9（18,546 人，用戶豆列，snippet，不採用）；微博博主「春天情書Haru」2025-12-27 年度榜列第 10、7.9（新浪轉載微博，snippet，不採用）。
3. **英文評論**：The Blossom Review（**清單外**），Karen Mansoldo，2026-01-14，〈Then You Try Making It!: Bravely Breaking the Chains of the Patriarchy〉。https://theblossomreview.com/tbs-then-you-try-making-it-review/ （read，Groundlane；讀到約一半，後段截斷；評全劇）
   - 摘要：她說這是一部不怕說自己想說的故事的「romantic comedy」，角色寫得完整，由角色自己決定結局，而不是照「傳統快樂結局」走；以料理當作通往獨立與自我的橋樑；竹內涼真是全劇核心，透過勝男拆解父權如何同時困住男人與女人。立場：推。
   - 原文：「a "romantic comedy" that defies the expectations of its genre to convey a revolutionary and timely message about equality, self-confidence, and self-reliance」
   - 清單內媒體（Japan Times、NME、Decider 等）沒有找到署名單篇評論；其他英文多是 MyDramaList 用戶評論與 YouTube 心得（snippet）。
4. **中文評論（台灣）**：釀電影，Yusmoke，2026-01-08，〈《有本事換你來做啊！》：一場終極的追求，請把「我」還給我〉。https://filmaholic.tw/series/695fbc9ffd89780001f91770/ （read，Groundlane；結尾幾段截斷）
   - 摘要：作者肯定劇沒有走「還是要相信愛情」的老路，用料理寫勝男的轉變、用名字寫兩人的命運；但也提出批評：分手後的勝男很快變成「看似不可或缺的完美男人」，劇有「惜男情節」，「社會總是更加輕易、容易地原諒男性」，如果換成鮎美走同樣的成長路，觀眾的共鳴不會一樣。立場：推，但有保留。
   - 另有：聯合報〈娛樂有評〉2025-12-11〈竹內涼真完美演繹「化石男」蛻變 搭檔夏帆上演「分手教科書」〉（https://stars.udn.com/star/story/10093/9195448 ，snippet，未讀）；Tatler Asia（**清單外，lifestyle**），Edgar Chang，2025-12-16（https://www.tatlerasia.com/lifestyle/entertainment/2025-fall-japan-drama-antaga-comment-zh-hant ，partial：Exa 長摘要，稱竹內「擺脫了過去被詬病的油裡油氣」）；Harper's BAZAAR 台灣 Sylvia Cheng 2025-11-15 是 friDay 影音提供素材的**介紹文**，不算評論。
5. **分歧**：**評審、收視、台灣口碑一致叫好，豆瓣相對冷**。VR25 總合 #5、最終回 16.1%，TVer アワード 2025 ドラマ大賞（總再生 6,100 萬超），ORICON 2025 滿意度 #4（ratings 檔）；映画チャンネル 2025 三位寫手一致選為年間大賞、Real Sound 2025 三位評論家選入十大（awards 檔）；台灣 PTT 2025 推薦文原 PO「今年只推一部就是這部」、friDay 2025 日劇 #2（fans 檔）。豆瓣只看到用戶豆列 7.9（不採用），明顯低於同年小鎮星熱點、再續（同樣只有非媒體列表）。評論內部的分歧在「男主角的轉變是否被過度獎賞」：釀電影 Yusmoke 點出惜男情節；中國豆瓣式影評站「萌映」的熱門短評也說竹內是「本色出演」（snippet，不採用）。

## 2. ホットスポット 小鎮星熱點（日本テレビ，2025 冬；Netflix）

1. **Metacritic S1**：沒有頁面（站內搜尋「hot spot」只有 The Hot Zone、Blind Spot 等，read）。
2. **豆瓣**：沒有媒體引述。微博博主「春天情書Haru」2025-12-27 列豆瓣 2025 日劇第 1、8.8（新浪轉載，snippet，不採用）；豆列寫 8.8（51,260 人，用戶豆列，snippet，不採用）。
3. **英文評論**：The Japan Times，Patrick St. Michel，2025-02-10，〈'The Hot Spot': Close encounters of the mundane kind〉。https://www.japantimes.co.jp/culture/2025/02/10/tv-streaming/the-hot-spot/ （**partial**：付費牆，Groundlane、Exa 都只讀到前兩段；播出中撰寫，含劇透警告）
   - 讀到的內容：他說外星人設定原本指向星際大戲，但劇沒有變成動作冒險或懸疑，而是用超能力處理「把卡在體育館屋頂的排球弄下來」這類日常小事。副標寫日劇「taking bolder risks recently」。**完整立場未確認**。
   - 原文：「The bulk of a single episode primarily revolves around funny chitchat.」
   - 補充（清單外）：Asian Movie Pulse，Danica QP，2025-08-30，〈The Hot Spot (2025) by Itaru Mizuno Drama Review〉。https://asianmoviepulse.com/2025/08/the-hot-spot-2025-by-itaru-mizuno-drama-review/ （partial：Exa 長摘要，含結論段；評全劇）。她說前四集「Nothing much happens」，後段新角色與衝突沒有充分發展，但整體是溫暖的 found family 喜劇，認為是笨蛋節奏最好笑的作品。原文：「a comforting, quirky, and memorable sci-fi comedy which is also a wonderful depiction of found family」。立場：推。AMP 2026-01-13〈The Best Asian Dramas of 2025〉也收錄本劇（partial）。
4. **中文評論（台灣）**：釀電影，倉鼠球営業中，2025-04-04，〈《小鎮星熱點》：當他者不再是他者，秘密不再是秘密〉。https://filmaholic.tw/series/67ef894afd89780001afc07c/ （partial：Exa 長摘要，涵蓋開頭到結語）
   - 摘要：作者坦言前半段「較難抓到重點，也讓我更難推坑給其他人」，因為笨蛋節奏是逐集寫作、第六七集才定下後續，真正主題到第八集才出現；但最後三集把伏筆收回，結合「他者」、開發與環保、官商勾結，是笨蛋節奏「政治性最鮮明的一部」。作者自稱是笨蛋節奏鐵粉，本季最愛。立場：推，承認結構鬆散。
   - 另有：琅琅悅讀（聯合報系書評平台），詹氏瞻視電影院，2025-04-02，〈《小鎮星熱點》影評：只要不妨礙日常，異常就能成幽默〉（https://reading.udn.com/read/story/124409/8638977 ，partial：Exa 長摘要），從富士山信仰與「不說破」的說話藝術解讀幽默。ELLE 台灣 Juju Chen 2025-02-06〈7 看點〉是**介紹文**。
5. **分歧**：**評審與觀眾都高，評論只對「前半段太慢」有保留**。Filmarks Awards 2025 TVドラマ部門最優秀賞、2025 冬季滿意度 #1（★4.21，snippet）、ORICON 2025 #6、IMDb 7.9（1.4K），但世帯收視只有 VR25 總合 #17、12.7%（ratings 檔）；東京ドラマアウォード與民放連盟優秀、Real Sound 2025 三位評論家入選（awards 檔）；台灣 PTT 2025 回顧 #2、LINE TODAY 日劇年度榜 #1（fans 檔）。收視中段、口碑頂尖，是「慢熱型」的典型。英文唯一完整讀到的評論（AMP）和台灣釀電影都提到前段「沒什麼事發生」。

## 3. 波うららかに、めおと日和 宛如粼光夫婦日和（フジテレビ 木曜劇場，2025 春；2026 秋續篇播出中）

1. **Metacritic S1**：沒有頁面（站內搜尋「calm sea」只有 A World of Calm 等，read）。
2. **豆瓣**：沒有找到可用來源（dealmoon 指南只列劇名，未給分數）。
3. **英文評論**：The Blossom Review（**清單外**），Karen Mansoldo，2025-08-27，〈A Calm Sea and Beautiful Days with You: Sweet, Simple, and... Unexpectedly Egalitarian?〉。https://theblossomreview.com/a-calm-sea-and-beautiful-days-with-you-review/ （partial：Exa 長摘要，含結論段；評全劇）
   - 摘要：她說故事「就是這樣」，沒有反轉、沒有反派，只是一對包辦婚姻的夫妻如何從零建立關係；兩人建立的家庭反而違背當時的性別慣例。缺點是視覺平淡、特效粗糙、配樂太孩子氣，女主角的反應「anime-like」很誇張。立場：推，有保留。
   - 原文：「A Calm Sea and Beautiful Days with You can be a tad saccharine, but it's still a wholesome, gentle, and inspiring love story.」
   - 另有 8Asians（無署名，2025-08-10，partial）指出劇刻意不碰 1936 年後的戰爭，但「constant sadness and quiet tragedy strung through everything」。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2025-05-10，〈春季最甜日劇《宛如粼光夫婦日和》：純度百分之百的新婚故事！〉。https://stars.udn.com/star/story/10093/8729696 （read (Exa)；**只評前 3 集**）
   - 摘要：她說以先婚後愛的通俗題材而言，本劇「算是耳目一新的出色作品」，昭和時代與海軍設定讓純愛成分更濃；稱讚芳根京子「靈動鬆弛」；也提醒時代背景是二戰前夕，「夏美的眼淚還要繼續流下去」。立場：推。
   - 另有：Japaholic 2025-07-09〈超甜純愛日劇《宛如粼光夫婦日和》完結劇評＆幕後製作解析！〉（https://www.japaholic.com/tw/article/detail/942040 ，partial：Exa 長摘要，頁面未顯示作者）。
5. **分歧**：**滿意度第一、世帯收視很低**。ORICON 2025 年間滿意度 #1（3.61）、Filmarks 2025 春季 #1（★4.28，snippet），但 VR25 只有 TS 榜 #18、最終回 6.1%（ratings 檔）；ザテレビジョン ドラマアカデミー賞 監督賞、東京ドラマアウォード優秀（awards 檔）；台灣 friDay 2025 日劇 #1（fans 檔）。台灣 PTT 用戶 episold 的年度心得說「佈景大概只贏過《如果世界是舞台那後台在哪》的美脫劇場」、本田響矢「跟芳根一比差距明顯」（方格子個人文，partial，不算媒體）。英文與 MDL 用戶評論的保留點一致：表演太誇張、預算低；部落格 Bitches Over Dramas 則從戰爭責任角度批評美化帝國海軍軍官（snippet）。

## 4. silent Silent（フジテレビ 木曜劇場，2022 秋）

1. **Metacritic S1**：沒有頁面（站內搜尋「silent」只有 Silent Witness、Silent Library 等，read）。
2. **豆瓣**：**開分 9.0，播出中降到 8.5–8.6**（人數不明）。三聯生活周刊（微信公號文），2022-11-26，〈豆瓣开分9.0，这部纯爱日剧太好哭了〉寫「豆瓣评分9.0，现在已经降到了8.6」（https://www.lifeweek.com.cn/h5/article/detail.do?artId=187861 ，partial：Exa 摘要）；1905 電影網，蓮理枝，2022-12-19，〈《Silent》迎最终话!编剧能力不足令好牌高开低走〉寫開播三周拿下 9.0、「目前豆瓣评分以降至8.5」（https://www.1905.com/news/20221219/1607396.shtml ，partial：Exa 摘要）。完結後分數未找到媒體引述。
3. **英文評論**：The Review Geek（**清單外**），Kristen Lazur，2023-04-30，〈silent Season 1 Review – A heartfelt Japanese romance drama〉。https://www.thereviewgeek.com/silent-s1review/ （read，Groundlane；評全劇，給 7.5/10；同站另有目黑蓮專訪）
   - 摘要：她說這是「a sweet, slow-moving tale」，細節多、很有個人感；悲劇雖然讓每個角色都挫折，但處理得「very respectful and positively yet sensitively done」，手語對白下了功夫。缺點是不完全出人意料。立場：推。
   - 原文：「While the drama isn't entirely unpredictable, it's still a lovely, heartfelt watch」
   - 清單內媒體沒有找到署名評論。
4. **中文評論（台灣）**：釀電影，吳思恩，2022-12-24，〈《silent》：用雙手穿越寂靜，找到彼此能領會的語言〉。https://filmaholic.tw/series/63a6a923fd8978000132a06a/ （read，Groundlane；評全劇）
   - 摘要：作者說本劇在聾人設定下給每場對手戲「足夠寬闊與溫柔的留白」，用聲音設計切換聽人與聾人的視角；男二湊斗的角色深度是最大驚喜，沒有落入爭搶愛人的窠臼；也點出現實限制：在不習慣看字幕的日本，聾人觀眾反而看不懂劇中大部分口語對話。立場：推。
   - 另有：聯合報〈娛樂有評〉，卡爬，2022-10-29〈虐戀《silent》成秋季黑馬並非偶然〉（https://stars.udn.com/star/story/10093/6720554 ，partial：Exa 長摘要，播出前 4 集時寫）；電影神搜 2022-12-26 完結劇評（https://news.agentm.tw/244585/ ，snippet）。
5. **分歧**：**串流破紀錄、評論多數叫好，但當事者與中國影評有質疑**。TVer アワード 2022 ドラマ大賞（再生 7,300 萬超，TVer 史上最高）、MDL 8.5（9,422 人）（ratings 檔）；東京ドラマアウォード、民放連盟優秀（awards 檔）；KKTV 第 4 屆 K劇大賞拿 4 獎（鏡週刊 2023-01-12，snippet）。世帯收視只有 5–7%（東方日報報導第 4 集從 7.1% 跌到 5.2%，partial），不在 VR 年度表。爭議：環境媒體オルタナ（吉田広子，2022-12-23）轉載聾人 NPO 理事長伊藤芳浩意見，批評第 8 話嬰兒取名「優生」構成微歧視，並有團體準備向 BPO 提意見書（https://www.alterna.co.jp/63855/ ，partial：Exa 長摘要）；1905 電影網說新人編劇「将一手好牌打得稀烂」、第 5 集花一整集處理男二線「主次不分」（partial）；Sir電影（騰訊新聞自媒體，2022-10-21）質疑「被捧成今年的日剧第一爆款？」（partial）。

## 5. 逃げるは恥だが役に立つ 月薪嬌妻（TBS 火曜，2016 秋）

1. **Metacritic S1**：沒有頁面（站內搜尋「escapist」沒有任何電視結果，read）。
2. **豆瓣**：**8.4（超過 13 萬人）**，鳳凰網娛樂（轉載自媒體「四味毒叔」，文：愛貓小說家），2022-05-16，〈《逃避虽可耻但有用》：那不如干脆结婚吧？〉。https://ent.ifeng.com/c/8G4791g3YAX （partial：Exa 摘要；入口網站轉載自媒體，不是新聞報導，引用要註明）。
3. **英文評論**：North American Post（**清單外**，西雅圖日裔社區報），David Yamaguchi，2017-03-02，〈"Nigeru wa Haji"〉。https://napost.com/2017/nigeru-wa-haji/ （partial：Exa 長摘要；評全劇）
   - 摘要：他推薦讀者看這部 11 集愛情喜劇，提到它上過 Japan Times，顯示文化影響力；故事前提「flaky」（打掃一房公寓、買菜做飯根本不是全職工作），但角色讓它成立；最出色的是從輕喜劇隨時轉進現實議題（父母對女兒結婚的感受、父子對話、新婚夫妻的坦白溝通）。立場：推。
   - 原文：「Truly outstanding is the way that the drama repeatedly turns on a dime from light romantic comedy to real-life issues」
   - 清單內媒體的 2016 年署名評論沒有找到（Japan Today 2016-12-08 是戀舞熱潮報導，無署名；AP 2021 是兩人結婚新聞）。
4. **中文評論（台灣）**：關鍵評論網，陳韻竹，2016-12-05，〈領你的月薪當你的嬌妻：日劇背後的玻璃天花板與「絕食系男子」〉。https://www.thenewslens.com/article/55901 （read (Exa)；**評論兼議題文**，播出中撰寫，夾雜作者訪問日本友人）
   - 摘要：她說劇在青春浪漫外表下揭露日本女性在婚姻與職場的處境：家庭主婦年勞動 2,199 小時約值 304.1 萬日圓、百合子阿姨代表職場女強人的玻璃天花板；男主角平匡的自卑則對應「絕食系男子」。她認為火紅原因是「少了爭吵只擷取愛情甜蜜的另類婚姻公式」。立場：推（議題導向）。
5. **分歧**：**大致一致**。東京ドラマアウォード 2017 グランプリ、ザテレビジョン 2016 秋季最佳（awards 檔）；IMDb 7.8（2.9K），2021 新春 SP 拿 TVer 特別賞（ratings 檔）；台灣 DailyView 2026-10 月榜仍排 #6（fans 檔）。收視數字不在本專案讀到的 VR 表內（ratings 檔註明「缺席不等於低」），鳳凰網文寫峰值 20.8%（未查原始資料，不引用）。評論只在「契約婚姻前提太理想化」上有保留（North American Post）。

## 6. 恋はつづくよどこまでも 戀愛可以持續到天長地久（TBS 火曜，2020 冬）

1. **Metacritic S1**：沒有頁面（站內搜尋「incurable case of love」只有 The Pursuit of Love 等，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：**沒有找到署名媒體評論**。Exa 搜尋只回傳個人部落格（evening tea musings 2020-05-02、Dramas with a Side of Kimchi 2021-10-22、AlphaGirl Reviews 等，snippet）與 MDL 用戶評論。清單外的 Asian Movie Pulse、Blossom Review 也沒有這部。
4. **中文評論（台灣）**：關鍵評論網，Shel Lin（美國維吉尼亞大學法學博士），2020-04-11，〈漫改劇《戀愛可以持續到天長地久》：潛藏性別偏差意涵，是「真甜寵」抑或自我麻痺？〉。https://www.thenewslens.com/article/133658 （read (Exa)；評全劇）
   - 摘要：她說本劇在一干漫改劇珠玉在前的情況下，「不僅未能增添一些變化性的元素，甚至在情節橋段和拍攝手法上也未見突破，卻收穫了如潮的好評」；大量吻戲、壁咚卻欠缺敘事邏輯，「男醫生（強者）vs. 女護士（弱者）」的結構複製男主外女主內，這種性別設定早在 1996 年《惡作劇之吻》後就被日劇揚棄。她把熱潮解讀為疫情下觀眾躲進甜寵幻夢的「自我麻痺」。立場：不推。
   - 對照：聯合報〈娛樂有評〉雪奈 2020-12-10〈2020大冒粉紅泡泡的5對日劇螢幕情侶〉以「每一集我都在螢幕前尖叫」盛讚（https://stars.udn.com/star/story/10093/5078906 ，snippet，盤點文）。
5. **分歧**：**全表最明確的「收視爆紅 vs 評論批評」**。VRR 令和版總合 #21（最終回 25.3%）、TS #12，TVer アワード 2020 ドラマ大賞（partial：meta description），MDL 8.3、IMDb 7.4（2.6K）（ratings 檔）；ザテレビジョン 2020 冬季最佳、東京ドラマアウォード優秀（awards 檔）。台灣唯一讀到的署名評論（關鍵評論網）是否定的；英文圈只有粉絲部落格，MDL 用戶 ginzarhapsody 也說劇情「at times, misogynistic」（snippet）。

## 7. Eye Love You Eye Love You（TBS 火曜，2024 冬；Netflix）

1. **Metacritic S1**：沒有頁面（站內搜尋「eye love you」只有 I Love You, You Hate Me 等，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：Future of the Force（**清單外**，影視網站），Thomas Storai，2024-03-11〈TV Review | Eye Love You (Episodes 1-5)〉https://thefutureoftheforce.com/2024/03/11/tv-review-eye-love-you-episodes-1-5/ 與 2024-04-18〈(Episodes 6-10)〉https://thefutureoftheforce.com/2024/04/18/tv-review-eye-love-you-episodes-6-10/ （兩篇都 partial：Exa 長摘要；**分前後五集評**）
   - 摘要：他說這是「sweet and fun rom-com」，蔡鍾協的魅力是最大賣點，第 6 集一集內就解決三角戀危機、沒有拖戲；後五集甜又催淚。立場：大力推。
   - 原文：「Eye Love You is undoubtedly the best rom-com of 2024.」
   - 對照：The Blossom Review，Karen Mansoldo，2024-06-12（https://theblossomreview.com/eye-love-you-netflix-viki-review/ ，partial），說女主角「a bit of a weak female lead」、男主角背景發展不足，是「overly sweet Korean drama, but with a Japanese soul」，立場保留。
4. **中文評論（台灣）**：**沒有找到**。限定網域搜尋（電影神搜、聯合報、鏡週刊、關鍵評論網、釀電影、Japaholic）只有電影神搜 2025-04-14 的日韓 CP 盤點（https://news.agentm.tw/286269/ ，snippet，非評論）；其餘是方格子個人文（momoge 毛毛牙 2024-08-18，partial）與 PTT 分集心得。
5. **分歧**：**國際獎與粉絲熱、劇本評價普遍不高**。首爾國際電視劇大賞 2024 評審團特別獎（awards 檔）；Filmarks Awards 2024 TVドラマ入圍（ratings 檔）；Japan Times 年度回顧提到但未列入佳作（awards 檔 JT2024）。MDL 7.7（8,449 人，Exa 頁面摘要，partial），明顯低於同表多數；MDL 熱門用戶評論直說「The story needs a lot of work」、Filmarks 上日本觀眾也批評女主演技（snippet）；日本部落格「ドラマでポン」批評讀心設定後半「ザル」（snippet）。英文評論兩極：Future of the Force「年度最佳愛情喜劇」，Blossom Review 認為女主角薄弱。

## 8. おっさんずラブ 大叔的愛（テレビ朝日，2018；續篇 -リターンズ- 2024）

1. **Metacritic S1**：沒有頁面（站內搜尋「ossan」沒有任何電視結果，read）。
2. **豆瓣**：沒有找到可用來源（只有影音站列表，snippet）。
3. **英文評論**：Japan Gay Guide（**清單外**，LGBT 旅遊／文化網站），Tobias Waters，2024-12-26，〈Ossan's Love: My Honest Review!〉。https://japangayguide.com/gay-lesbian-movies/ossans-love-my-honest-review/ （partial：Exa 長摘要；評 2018 第一季）
   - 摘要：他提醒西方觀眾，演員（尤其田中圭）用誇張、近乎動畫的方式表演，一開始會有點卻步，但這種風格讓極端場面與嚴肅時刻都更突出；林遣都的牧是喜劇與戲劇的混合，比較內斂。結論是 BL 類型的里程碑。立場：推。
   - 原文：「Ossan's Love is a landmark in BL programming, and should not be missed by aficionados of the genre.」
   - 清單內媒體沒有找到署名評論；2024 續篇沒有找到英文評論。
4. **中文評論（台灣）**：鏡週刊〈馬欣專欄〉，馬欣，2018-06-08，〈《大叔的愛》成為最心動演員NO.1 林遣都的萬年成功路〉。https://www.mirrormedia.mg/story/20180608web001 （read；**演員論，但含對全劇的評價**）
   - 摘要：她說這齣僅七集的深夜劇攻陷各大社群，最後一集灌爆朝日電視台網站；「一個人物設定是素人的愛情連續劇幾乎沒有紅的可能」，卻喚醒觀眾對純愛的熱血。林遣都把「說反話」的牧凌太演出意在言外，讓 BL 角色不再「流於人物蒼白，不然就要背負使命的苦情」。立場：推。
   - 2024 續篇只有電影神搜 2024-01-15〈【日劇開箱】《大叔的愛－Returns－》〉（https://news.agentm.tw/271753/ ，snippet，首集開箱）。
5. **分歧**：**2018 評審與熱度一致；2024 續篇熱度明顯下滑**。2018 版拿東京ドラマアウォード 2018 グランプリ、ザテレビジョン 2018 春季最佳（awards 檔）；收視不在 VR 表內（ratings 檔：缺席不等於低）。2024 續篇只入圍 Filmarks Awards 2024（ratings 檔），台灣只在 PTT 2024 回顧列為遺珠（fans 檔）。英文評論（Japan Gay Guide）把誇張演技列為門檻，台灣馬欣反而強調演技細膩，兩邊看的是不同演員。

## 9. きのう何食べた? 昨日的美食（テレビ東京，S1 2019、season2 2023）

1. **Metacritic S1**：沒有頁面（站內搜尋「what did you eat yesterday」只有 I Know What You Did Last Summer 等，read）。
2. **豆瓣**：**S1 開播兩集 8.7**（人數不明），搜狐（自媒體「妖猴影視」），2019-04-25，〈《昨日的美食》填饱肚子治愈孤独〉。https://www.sohu.com/a/310228028_521246 （partial：Exa 摘要；入口網站自媒體，播出中的數字）。S2 沒有找到。
3. **英文評論**：Magdalene（**清單外**，印尼女性主義媒體），Devi Asmarani，2021-09-17，〈'What Did You Eat Yesterday?' Portrays Realistic Mature Gay Relationship〉。https://magdalene.co/story/what-did-you-eat-yesterday-portrays-realistic-mature-gay-relationship/ （partial：Exa 長摘要；評 S1）
   - 摘要：她說看片名會以為主角是食物，但這部 30 分鐘劇的核心「neither on the frying pan nor on the plate」，而是不落俗套地呈現中年男同志伴侶在當代日本的生活：初遇、雙人約會、老同志請史朗替伴侶處理法律問題，都加深了角色。立場：推。
   - 原文：「the frank and nuanced depiction of life as coupled middle-aged gay men in contemporary Japan without the usual cliches」
   - 學術期刊 QED（Keisuke Kimura，2023，https://doi.org/10.14321/qed.10.2.0191 ，partial）評的是 2021 **電影版**，不是劇。S2 沒有找到英文評論。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2023-12-27，〈西島秀俊X內野聖陽 《昨日的美食2》夫夫生活－食譜和菜單是獻給彼此的情書〉。https://stars.udn.com/star/story/10093/7663886 （read，Groundlane；結尾一小段截斷；**評 S2**）
   - 摘要：她說第二季更深入面對變老與身後事（靈骨塔、婆媳同住的玩笑），及川光博客串的前男友那集「帶來極大的衝擊」；導演中江和仁放大膽改編、讓演員把情緒演出來；整部劇「更為柔和舒服、自然寫實」，史朗是改變最大的人，從害怕被發現到不再糾結同志身分。立場：推。
5. **分歧**：**評審、台灣觀眾、評論家一致正面**。S1 拿ザテレビジョン 2019 春季最佳、東京ドラマアウォード優秀；S2 入選 Real Sound 2023 兩位評論家十大（awards 檔）；台灣 KKTV 2023 最佳日劇 #2、男主角 #1，PTT 2023 回顧 #2（fans 檔）。深夜劇，沒有 VR 收視數字。唯一的保留來自個人部落格（filmbeats 2020 說「not a must-watch」，snippet）。

## 10. ぼくたちん家 被選中的家（日本テレビ 日曜，2025 秋；Netflix）

1. **Metacritic S1**：沒有頁面（站內搜尋「chosen home」只有 The Chosen 等，read）。
2. **豆瓣**：沒有媒體引述。「美麗影視」網站榜單寫 8.9（站方榜單，snippet，不採用）。
3. **英文評論**：The Blossom Review（**清單外**），Karen Mansoldo，2026-02-04，〈Chosen Home: A Gentle Tale about Being Human〉。https://theblossomreview.com/ntv-chosen-home-netflix-review/ （partial：Exa 長摘要，含結論段；評全劇）
   - 摘要：她說及川光博演的 50 歲同志玄一「marvellous」，白鳥玉季「extraordinary」；每集各有主題（性別期待、同志偏見、女性被看輕），用開放、慈悲的對話處理，「silly humour that somehow works」。立場：推。
   - 原文：「Chosen Home is a genuine, heartwarming, and humane celebration of love, diversity, and community.」
4. **中文評論（台灣）**：天下雜誌〈獨立評論〉（**清單外**，台灣評論平台），米果（作家，專欄「台北捌玖零」），2026-01-02，〈日劇《被選中的家》，還有我不想寫新年新希望了〉。https://opinion.cw.com.tw/blog/profile/57/article/16941 （read (Exa)；隨筆型評論，評全劇；Groundlane 遇 browser challenge）
   - 摘要：她說編劇松本優紀的「故事角色布局有野心」，納入同性戀、職場性別歧視、逃學孩子、親子與夫妻關係、買房，但「不複雜，也不沉重，輕喜劇表現淡化了人物原本該有的悲苦」；動漫式的誇張表演反而讓疲憊的年末「似乎被療癒、被理解了」。也說「不是熱門劇，甚至有點冷門」。立場：推。
5. **分歧**：**評論家與重度劇迷喜歡、大眾熱度低**。Real Sound 2025 兩位評論家入選十大（awards 檔）；MDL 8.3（ratings 檔），但沒有進 VR 收視表；台灣只在 PTT 2025 回顧列為遺珠（fans 檔），米果也自承「有點冷門」。台灣清單內媒體沒有找到署名評論，只有 Japaholic／LINE TODAY 的跟播介紹（snippet）。

## 11. 続・続・最後から二番目の恋 再續．倒數第二次戀愛（フジテレビ 月9，2025 春）

1. **Metacritic S1**：沒有頁面（站內搜尋「second to last love」只有 First Love, Second Chance 等，read）。
2. **豆瓣**：沒有新聞引述。北美省錢快報（dealmoon）購物指南，Wendy百變小溫，2025-06-05 寫 9.1、「豆瓣9分神剧」（https://www.dealmoon.com/guide/1008533 ，partial；商業導購文，不採用）；「美麗影視」站方榜單 9.0（snippet，不採用）。
3. **英文評論**：**沒有找到**。Exa 只回傳部落格（HamsapSukebe 首集心得 2025-04-18）、MDL 舊季用戶評論與旅遊網站（snippet）。
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2025-06-26，〈【劇評】《再續・倒數第二次戀愛》：溫暖完結，幕後解析＆編劇的創作過程〉。https://news.agentm.tw/359781/ （read；評全劇）
   - 摘要：她說千明與和平最後仍沒有結婚或同居，「持續保持的曖昧就是最自然、最舒服的相處之道」；岡田惠和把「一起過日子」變成戲劇核心。也承認「有些觀眾會認為對話太長了」，但資深演員帶來舞台劇般的臨場感；「即使是賣情懷也好、回饋老粉絲也罷」都讓人感動。立場：推（老粉絲角度）。
5. **分歧**：**收視與滿意度都高，但幾乎沒有外媒評論**。VR25 總合 #6（16.5%）、ORICON 2025 滿意度 #3（ratings 檔）；Real Sound 2025 一位評論家入選、映画チャンネル兩位寫手 top 5（awards 檔）；台灣 VERSE 2025 必看十部、LINE TODAY 年度榜前十（fans 檔）。英文圈幾乎無人評，因為系列 2012 年起就沒有正式國際發行。批評集中在節奏：電影神搜引述的「對話太長」，PTT 推文也有人問為何不看（fans 檔）。

## 12. 不適切にもほどがある! 極度不妥！（TBS 金曜，2024 冬）

1. **Metacritic S1**：沒有頁面（站內搜尋「extremely inappropriate」沒有任何電視結果，read）。
2. **豆瓣**：沒有媒體引述（只有 bilibili 影片標題「豆瓣8.2」，snippet，不採用）。
3. **英文評論**：The Japan Times，Patrick St. Michel，2024-04-05，〈'Extremely Inappropriate!' took a big swing. TV is better for it.〉。https://www.japantimes.co.jp/culture/2024/04/05/tv-streaming/extremely-inappropriate-series/ （**partial**：付費牆，jina、Exa 都只讀到前三段；完結後撰寫）
   - 讀到的內容：他說本劇首集就確立是「conceptually highwire」，時空旅行之外還是音樂劇；同時諷刺昭和與令和兩個時代的社會問題。標題的立場是肯定（「TV is better for it」），內文細節未讀到。
   - 原文：「"Extremely Inappropriate!" which wrapped last week, stands as the most ambitious and divisive Japanese TV show of the year so far.」
   - 補充（清單外）：The Blossom Review，Karen Mansoldo，2024-09-04（https://theblossomreview.com/extremely-inappropriate-netflix-review/ ，partial：Exa 長摘要），說 1986 和 2024「seem to be two extremes of the same problem」，最後的寬容主題曲是「straightforward "lesson"」，但小川的角色弧線傳達得更細膩。立場：推。
4. **中文評論（台灣）**：釀電影，鈺玟，2024-07-19，〈《極度不妥！》：願我們都擁有那不上不下的溫柔〉。https://filmaholic.tw/series/6683b955fd897800016c35b0/ （read，Groundlane；評全劇）
   - 摘要：作者說行為的定義「沒辦法完全還原事情的脈絡」，劇用職權騷擾、離婚等情節提醒「如果太過講理，就會遺忘了情」；歌舞橋段一開始「覺得有些胡來」，習慣後反被說服；宮藤官九郎的惡趣味底下有對人的關懷。立場：推。**注意**：文中把小渚寫成「小川的女兒」，劇中設定是孫女，引用時要更正。
   - 另有：電影神搜，雪奈日劇部屋，2024-04-07〈【劇評】《極度不妥！》：把穿越劇玩出最高境界，惡搞與說教的完美結合〉（https://news.agentm.tw/276861/ ，read），說歌舞是「用歌舞表演的方式來緩和說教帶來的嚴肅感」，立場推；關鍵評論網（思想坦克）2024-12-19 討論它拿下流行語大賞（https://www.thenewslens.com/article/246428 ，snippet）。
5. **分歧**：**收視、評審、評論都高，但「說教／為昭和辯護」的爭議一直在**。VR24 總合 #5（17.3%）、TS #1，Filmarks Awards 2024 TVドラマ部門最優秀賞（ratings 檔）；ギャラクシー賞特別賞、東京ドラマアウォード優秀、Real Sound 2024 三位評論家入選、Japan Times 年度回顧稱「one of the year's best」（awards 檔）；台灣 KKTV 2024 最佳日劇與人氣、LINE TODAY 2024 十大追劇榜唯一日劇（fans 檔）。Japan Times 本身用「divisive」形容；Real Sound 木俣冬（2024-03-28）說宮藤的構成「まとまり過ぎ」（partial：Exa 摘要）；NYT 2024-05-29 報導年輕觀眾因此懷念 1980 年代（新聞，partial）；MDL 用戶說「the social critique did not work as well as intended」（snippet）。

## 13. 西園寺さんは家事をしない 西園寺小姐不做家事（TBS 火曜，2024 夏）

1. **Metacritic S1**：沒有頁面（站內搜尋「saionji」沒有任何電視結果，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：**沒有找到署名媒體評論**。只有部落格（ZDORAMA, AGAIN 2024-07-23，首集心得，snippet）與 MDL 用戶評論（partial）。MDL 熱門評論說劇的核心「aligns more with family than romance」、結尾處理西園寺家族線「struggled a little」（snippet）。
4. **中文評論（台灣）**：**沒有找到**。限定網域搜尋只找到 Japaholic 的穿搭文、聯合報〈娛樂有評〉的松本若菜人物特寫（2026-01-10，snippet，非單劇評論）。其餘是個人部落格（dearhan.blog，Han，2024-09-21，partial：說有些段落「聽起來沒什麼問題，但又好像哪裡怪怪的」，但整體推）與 PTT 首集心得。
5. **分歧**：**日本評論家看重議題，台灣與英文圈幾乎沒有正式評論**。VR24 TS #13（7.3%）、Filmarks Awards 2024 入圍（ratings 檔）；ザテレビジョン 2024 夏季最佳、Real Sound 2024 一位評論家入選（awards 檔）。成馬零一在民放online 2024 夏劇總評（2024-10-21）說它看似歡樂的家庭喜劇，其實是「新しい家族のあり方を模索する思考実験的な作品」（https://minpo.online/article/2024-44.html ，partial：Exa 摘要）；Real Sound 藤原奈緒（2024-08-05）稱讚第 1 集「全肯定」單身主角的開場很革新（partial）。台灣聲量主要在 PTT 心得與 KKTV 跟播，fans 檔未列入主要榜單。

## 14. ちょっとだけエスパー 一點點超能力（テレビ朝日 火曜，2025 秋；Netflix）

1. **Metacritic S1**：沒有頁面（站內搜尋「espers」沒有任何電視結果，read）。
2. **豆瓣**：沒有媒體引述。豆瓣用戶長評（分派電影公眾號，石安浅，2025-12-20）寫「至现在，该剧豆瓣评分7.5」（https://m.douban.com/movie/review/17351243/ ，用戶文，不採用）。
3. **英文評論**：The Blossom Review（**清單外**），Karen Mansoldo，2026-02-18，〈Just a Bit Espers: A Deceptively Simple Sci-fi Satire〉。https://theblossomreview.com/just-a-bit-espers-netflix-review/ （partial：Exa 長摘要，含結論段；評全劇）
   - 摘要：她自稱野木亞紀子的崇拜者；說本劇從超級英雄與職場劇的戲仿開始，笑點「strangely subtle」，接著用一連串轉折把觀眾的預期丟出窗外，從簡單諷刺長成探討歸屬、自我與連鎖效應的人性劇。立場：推。
   - 原文：「From a simple satire, Just a Bit Espers slowly blossoms into a complex human drama」
4. **中文評論（台灣）**：釀電影，范亦昕 Eartha Fan，2026-01-08，〈《一點點超能力》：當小小的光，從心的裂痕中長出〉。https://filmaholic.tw/series/695f87dafd897800019cc8f2/ （read，Groundlane；評全劇）
   - 摘要：作者把全劇讀成一群「早就不想活的人」重新學會活著的故事：每個人的一點點超能力都來自缺席的愛（文太想聽見冷淡父親的心聲、櫻介想讓兒子看見花開）；劇用分歧樹談未來不是注定，而是「由活著的人所共同創造的」。立場：推，沒有提出批評。
5. **分歧**：**全表口碑最分裂的一部**。VR25 總合 #13（14.1%）（ratings 檔）；Real Sound 2025 兩位評論家入選（awards 檔）；台灣 PTT 2025 秋季推薦 #6、LINE TODAY 年度榜 #10（fans 檔）。但 PTT 用戶 episold 年度心得只給「還行」，完結心得推文說「這劇本和結局真的有失野木編的水準」「收尾很亂」（fans 檔 S2；PTT 心得串 partial）；馬來西亞星洲日報〈左眼饞〉專欄（2026-01-26）說「这部剧虽然不错，但我挺失望的」，第六集後失衡、「很 lazy writing」（https://www.sinchew.com.my/news/20260126/supplement/7211560 ，partial；**非台灣媒體**）；新加坡聯合早報（2025-11-15，播出中）偏正面（partial）。MDL 7.7（450 人，Exa 頁面摘要，partial）。英文（Blossom）與台灣（釀電影）的署名評論都是正面，負評集中在觀眾與東南亞華文專欄。

## 15. いちばんすきな花 至愛之花（フジテレビ 木曜劇場，2023 秋）

1. **Metacritic S1**：沒有頁面（站內搜尋「favorite flower」只有 God's Favorite Idiot 等，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：**沒有找到署名媒體評論**。只有部落格 ZDORAMA, AGAIN（2023-10-23，首集心得，snippet）；FRIDAY DIGITAL 英文版兩篇（2023-11-04、2023-11-30）是日本週刊的翻譯報導，無署名，內容是把本劇和《四重奏》比較、以及 TVer 收藏登錄數第一（partial）。
4. **中文評論（台灣）**：電影神搜，雪奈日劇部屋，2023-12-29，〈《至愛之花》日劇完結！幕前幕後看《silent》團隊如何精雕細琢這部鮮明討喜，笑淚交織的文青風群像劇〉。https://news.agentm.tw/270712/ （read，Groundlane；前半，後段幕後花絮截斷；**評論兼幕後介紹**）
   - 摘要：她說一開始四人相遇「不免覺得有點突兀和牽強」，但看完以美鳥為主軸的第七集，所有伏線串在一起，「忍不住要讚嘆編劇的用心安排」；以「對話」推動劇情，四人分享不喜歡的人事物、互相療傷。立場：推。
   - 另有：關鍵評論網 2024-01-28〈《いちばんすきな花》至愛之花｜寫給人際關係苦手的一部暖心日劇〉（https://www.thenewslens.com/article/197280 ，read (Exa)），但這是方格子 Celine 的轉載文，作者是部落客；文中說美鳥那段「雖然安排的很刻意，但卻不令人討厭」。
5. **分歧**：**評論家第一、收視低迷**。成馬零一把它列為 Real Sound 2023 年度第 1（awards 檔）；Filmarks 2023 日本ドラマ #20、VR23 TS #17（7.9%）（ratings 檔）；DramaWiki 記平均收視 5.1%（snippet）。FRIDAY DIGITAL（2023-11-30）報導 TVer 收藏登錄數第一但收視「低迷」（partial）。台灣沒有進 fans 檔主要榜單。評論面的共同保留是「相遇設定刻意」，但都認為後段收得好。

## 16. グラスハート 玻璃之心（Netflix 原創，2025-07-31）

1. **Metacritic S1**：**有頁面但沒有 Metascore**（tbd，需 4 則評論；目前 3 則都是 80：Screen Rant Nick Bythrow、Collider Kelcie Mattson、Decider Johnny Loftus；User score 也是 tbd）。https://www.metacritic.com/tv/glass-heart/ （read，Groundlane）。Rotten Tomatoes 頁面 80%（5 則）（https://www.rottentomatoes.com/tv/glass_heart/s01 ，snippet）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：Collider，Kelcie Mattson，2025-07-20，〈'Glass Heart' Review: Netflix's Spectacular New Drama Series Is an Intense Thrill〉。https://collider.com/glass-heart-netflix-review/ （partial：Exa 長摘要，涵蓋開頭到結論段；**上線前評全 10 集**）
   - 摘要：她說本劇把音樂當作能療癒表演者與聽眾的力量，用演唱會電影的語言拍出數萬名臨演的現場；女性編劇團隊偶爾用說明性台詞交代情緒；後半段「does embrace more obvious clichés」，戀情發展「can be seen from a mile away」，但宮﨑優的表演讓角色無可挑剔。立場：推。
   - 原文：「Between its triumphant sincerity, spectacular visuals, and compulsive energy, Glass Heart is altogether watchable and oddly comforting to boot」
   - 另有：Decider，Johnny Loftus，2025-08-02，〈Stream It Or Skip It: 'Glass Heart' on Netflix…〉（https://decider.com/2025/08/02/stream-it-or-skip-it-glass-heart-on-netflix-a-rousing-japanese-series-with-a-great-ear-for-melody-and-a-few-beats-of-romance/ ，partial：Exa 長摘要；**只評第 1 集**），結論「a big STREAM IT」，稱讚演員看起來真的在演奏。But Why Tho?（Allyson Johnson，2025-07-22，清單外，partial）說戀情「devoid of any heat」。
4. **中文評論（台灣）**：La Vie（**清單外**，台灣設計／生活風格雜誌），Ning Chi，2025-08-18，〈佐藤健《玻璃之心》值得看嗎？5個隱藏亮點 X 5個主創親曝幕後故事〉。https://www.wowlavie.com/article/250026119 （partial：Exa 長摘要；評論兼幕後整理，評全劇）
   - 摘要：她承認「影評多指本劇劇情毫無新意，情節發展完全可以預知」，但認為漫改劇看點本來就在「現實化」的過程而非劇情，像漢堡的標配組合；肯定佐藤健挖出角色「執拗靈魂」、四位演員零基礎學樂器的成果。立場：推，為俗套辯護。
   - 清單內媒體只找到新聞與人物稿（聯合報〈娛樂有評〉2025-08-16 高石明里人物特寫、鏡週刊 2025-08-06 幕後新聞，snippet）；GQ 台灣 2025-09-13 是黑膠專輯**介紹文**。
5. **分歧**：**國際評論與海外觀眾一致好評，日本觀眾評價中等**。IMDb 8.1（1.9K）、MDL #11 8.5（7,693 人）（ratings 檔）；台灣 Dcard「下半年最火紅的日劇」、VERSE 2025 必看十部（fans 檔）。英文評論分數集中 80 分；但方格子 awwrated 整理稱 Filmarks 上日本觀眾評價「中等」、批評「過時」「尷尬」（vocus 個人文，partial，不算媒體）。主要分歧點是劇情老套（Collider、La Vie 都承認）vs 音樂與演出（全部肯定）。日本評審獎項沒有入列（awards 檔無此劇）。

## 17. ちはやふる－めぐり－ 花牌情緣：巡（日本テレビ 水曜，2025 夏；Netflix）

1. **Metacritic S1**：沒有頁面（站內搜尋「chihayafuru」沒有任何電視結果，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：scrmbl（**清單外**，日本流行文化網站），Alicia Haddick，2025-12-18，〈Chihayafuru: Full Circle is a rare legacy sequel that works〉。https://scrmbl.com/post/chihayafuru-full-circle-review （partial：Exa 長摘要，涵蓋開頭到結論段；評全劇）
   - 摘要：她說這是少見成功的「legacy sequel」，主角巡是前作的反面（把青春當作最佳化、讀投資書），前兩集「Insufferable to the point of distaste」很難熬，但她放下書本後的成長真的動人；不需要看過電影版也能入戲。立場：推，有保留（前兩集）。
   - 原文：「It's far from perfect, those first two episodes being a challenge to overcome」
   - 另有 Midgard Times（Anjali Sharma，2025-07-20，清單外，partial：前四集評論）說「mostly does」延續前作的火花，但節奏與情感深度偶有失誤。
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雪奈，2025-09-27，〈《花牌情緣：巡》－熱血與詩意交織，新世代演員的青春物語〉。https://stars.udn.com/star/story/10093/9028637 （read，Groundlane；評全劇）
   - 摘要：她說小巡「缺乏主角的光環與自信，她的成長速度也非常緩慢」，對應前作反而像奏而不是千早，但從膽怯到覺醒正是最耐人尋味之處；父母支持她玩歌牌的親子和解是最溫馨的一場戲；「我很久沒有被如此純粹的青春物語所打動了」。立場：推。
5. **分歧**：**評論與劇迷好評、大眾數字低調**。Filmarks Awards 2025 入圍（ratings 檔）；Real Sound 2025 兩位評論家入選、映画チャンネル一位寫手 top 5（awards 檔）；台灣 PTT 2025 回顧並列 #5，推文「遠超乎預期」（fans 檔）。沒有進 VR 收視表；MDL 8.2 但只有 609 人評分（Exa 頁面摘要，partial），國際觀眾少。英文與台灣評論都指出同一件事：主角前期刻意不討喜，是門檻也是重點。

---

## 總表

| # | 劇名 | Metacritic S1 | 豆瓣（媒體引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | 有本事換你來做啊！ | 無 | 無可用（豆列 7.9 不採用） | Blossom Review／Mansoldo（清單外） | read（約一半） | 釀電影／Yusmoke | read | 全面叫好；惜男情節質疑 |
| 2 | 小鎮星熱點 | 無 | 無可用（博主 8.8 不採用） | Japan Times／St. Michel＋AMP／Danica QP | partial（付費牆）＋partial | 釀電影／倉鼠球営業中 | partial | 收視中段 vs 口碑頂尖；前半慢 |
| 3 | 宛如粼光夫婦日和 | 無 | 未找到 | Blossom Review／Mansoldo（清單外） | partial | 聯合報娛樂有評／雪奈 | read (Exa, ep1–3) | 滿意度 #1 vs 收視 6% |
| 4 | silent | 無 | 9.0→8.5–8.6（三聯、1905 電影網，播出中） | The Review Geek／Lazur（清單外） | read | 釀電影／吳思恩 | read | 串流紀錄 vs 聾人團體與中國影評批評 |
| 5 | 月薪嬌妻 | 無 | 8.4（鳳凰網轉載自媒體） | North American Post／Yamaguchi（清單外） | partial | 關鍵評論網／陳韻竹（議題文） | read (Exa) | 大致一致 |
| 6 | 戀愛可以持續到天長地久 | 無 | 未找到 | 沒有找到 | — | 關鍵評論網／Shel Lin | read (Exa) | 收視爆紅 vs 性別刻板批評 |
| 7 | Eye Love You | 無 | 未找到 | Future of the Force／Storai（清單外） | partial（分 1–5、6–10 集） | 沒有找到 | — | 國際獎 vs 劇本評價低 |
| 8 | 大叔的愛 | 無 | 未找到 | Japan Gay Guide／Waters（清單外） | partial | 鏡週刊／馬欣（演員論） | read | 2018 一致；2024 續篇冷 |
| 9 | 昨日的美食 | 無 | 8.7（S1 開播兩集，搜狐自媒體） | Magdalene／Asmarani（清單外，S1） | partial | 聯合報娛樂有評／雪奈（S2） | read | 一致正面 |
| 10 | 被選中的家 | 無 | 無可用 | Blossom Review／Mansoldo（清單外） | partial | 天下獨立評論／米果（清單外） | read (Exa) | 評論家喜歡 vs 冷門 |
| 11 | 再續．倒數第二次戀愛 | 無 | 無可用（導購文 9.1 不採用） | 沒有找到 | — | 電影神搜／雪奈日劇部屋 | read | 高收視、無外媒；對話太長 |
| 12 | 極度不妥！ | 無 | 無可用 | Japan Times／St. Michel＋Blossom Review | partial（付費牆）＋partial | 釀電影／鈺玟 | read | 全面高分但「divisive」 |
| 13 | 西園寺小姐不做家事 | 無 | 未找到 | 沒有找到（只有部落格） | — | 沒有找到 | — | 日本評論家看重；台英無正式評論 |
| 14 | 一點點超能力 | 無 | 無可用（用戶長評 7.5 不採用） | Blossom Review／Mansoldo（清單外） | partial | 釀電影／范亦昕 | read | 評論正面 vs 觀眾與星洲專欄批評結局 |
| 15 | 至愛之花 | 無 | 未找到 | 沒有找到（只有部落格、FRIDAY 翻譯稿） | — | 電影神搜／雪奈日劇部屋（兼幕後） | read（前半） | 評論家年度第 1 vs 收視 5% |
| 16 | 玻璃之心 | **頁面 tbd（3 則皆 80）** | 未找到 | Collider／Mattson＋Decider／Loftus | partial＋partial（ep1） | La Vie／Ning Chi（清單外） | partial | 國際好評 vs 日本觀眾中等；劇情老套 |
| 17 | 花牌情緣：巡 | 無 | 未找到 | scrmbl／Haddick（清單外） | partial | 聯合報娛樂有評／雪奈 | read | 好評但國際觀眾少 |

「未找到」= 有搜尋，沒有任何媒體或列表數字；「無可用」= 只找到用戶豆列、微博博主、導購文或用戶長評，依規則不採用。

## 缺口

1. **Metacritic**：17 部只有玻璃之心有頁面，而且分數 tbd（只收 3 則，都 80）。這個欄位對日劇幾乎沒用。
2. **豆瓣**：只有 silent 有正式媒體引述（三聯生活周刊、1905 電影網，都是播出中的數字，且之後下滑）；月薪嬌妻 8.4、昨日的美食 8.7 是入口網站上的自媒體文章，引用要註明。小鎮星熱點 8.8、再續 9.0–9.1、有本事 7.9、一點點超能力 7.5 只在微博、豆列、導購或用戶長評看到，沒有採用。豆瓣 subject 頁沒有直接讀取。
3. **英文大媒體幾乎缺席**：清單內只有 Collider、Decider（玻璃之心）與 Japan Times（小鎮星熱點、極度不妥！，都被付費牆擋住，只讀到前 2–3 段，**立場未確認**）。其餘都靠清單外，其中 The Blossom Review 一人包了 4 部主評論。正文引用時建議寫成「海外評論一例」，不要寫成「外媒評」。**戀愛可以持續到天長地久、再續．倒數第二次戀愛、西園寺小姐不做家事、至愛之花** 找不到任何署名英文評論。
4. **只評首集或部分集數**：Decider（玻璃之心，第 1 集）、Future of the Force（Eye Love You 分兩篇）、聯合報雪奈（粼光，前 3 集）、聯合報卡爬（silent，前 4 集）、Japan Times（小鎮星熱點，播出中）。
5. **台灣中文評論**：Eye Love You、西園寺小姐不做家事兩部在清單內媒體沒有找到署名評論。筆名「雪奈」寫了 5 部、立場都是推，來源集中。月薪嬌妻（關鍵評論網）是夾雜訪問的議題文，大叔的愛（鏡週刊馬欣）是演員論。被選中的家（天下獨立評論）、玻璃之心（La Vie）是清單外。釀電影鈺玟的極度不妥評論把孫女小渚誤寫成女兒。
6. 「分歧」欄裡的 NYT、Real Sound、民放online、オルタナ、1905 電影網、星洲日報、聯合早報、8Asians、But Why Tho?、MDL／PTT 用戶意見多是 **partial 或 snippet**，正文引用前要再讀原文。月薪嬌妻「收視峰值 20.8%」只出自鳳凰網自媒體，未查證，不要引用。

## toolDegradation

- **Groundlane MCP**：`web_extract` 跑完 17 次 Metacritic 站內搜尋；`web_fetch` 讀到 Metacritic 玻璃之心頁、The Blossom Review（有本事）、The Review Geek、釀電影 5 篇、電影神搜 3 篇、聯合報〈娛樂有評〉2 篇、鏡週刊馬欣專欄；`web_search`（限定台灣媒體網域）找台灣評論效果最好。失敗：關鍵評論網、天下獨立評論回 browser-challenge；Japan Times 只回付費牆前兩段。Groundlane 搜尋內部的 tavily、exa provider 多次 unavailable，由 brave、you、keenable 補上。
- **Exa**：`web_search_exa` 用來找英文評論、豆瓣新聞與部分中文評論（長摘要多半只當 partial）；`web_fetch_exa` 讀到關鍵評論網 3 篇、天下獨立評論、聯合報（粼光）全文；Japan Times 只回付費牆前兩段。
- **jina**：`read_url` 讀 Japan Times（極度不妥！），一樣只拿到付費牆前三段；`search_web` 回「需要 API key」，無法使用。
- **Tavily**：未使用（已知額度不足）。**Firecrawl**：額度用完，未使用。**終端機 curl**：被擋，未使用。
