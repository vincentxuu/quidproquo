# KR2 評價資料表：韓劇｜犯罪、懸疑與復仇 18 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-08。片單來自 `post-kr2-shows.txt`。IMDb／MDL／韓國收視數字沿用 `candidates-ratings-viewing-buzz.md`（該檔已標 read），這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic S1 | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查 `/tv/` 連結，命中再抓劇頁與 `critic-reviews/` | Groundlane `web_extract`（render=never）、`web_fetch` | 18/18 read：**有頁面的 3 部**——黑暗榮耀（tbd，4 則）、無赦之仇（tbd，2 則）、暴風圈（**72**，4 則）；其餘 15 部沒有頁面（Signal 只搜到德國劇 *The Signal (2024)*；`/tv/karma/` 是美國實境秀） |
| 豆瓣 | 只採用新聞文章引述的分數；自媒體／內容農場（kknews、搜狐號、百度他說）只當 snippet，不採用。沒有讀 sec.douban.com，也沒有讀 subject 頁 | Groundlane search／fetch | 2 部有可用引述（黑暗榮耀、惡之花），都標了是開播或播出中的數字 |
| 英文評論 | 署名評論，讀全文或大半 | Groundlane `web_fetch` 為主；Decider 4 篇、RogerEbert、NYT 用 Exa `web_fetch_exa`（Groundlane 回 OUTPUT_LIMIT 或 403） | 16 read（其中 8 篇只評前幾集）、2 partial（惡之花、善意的競爭） |
| 台灣中文評論 | 釀電影、關鍵評論網、端傳媒、聯合報／500輯／噓！星聞、電影神搜等 | Groundlane `web_fetch`；關鍵評論網、端傳媒、釀電影（惡鬼、秘密森林）用 Exa `web_fetch_exa` | 15 read、3 partial（信號、暴風圈、操控遊戲） |

標記說明：**read** = 工具讀到頁面內文（輸出在最後一節被截斷會註明）；**read (Exa cache)** = Exa 快取副本；**partial** = 只讀到前段、或只讀到 Exa 搜尋的長摘要；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：Decider 3（操控遊戲、血謎拼圖、你旁觀的罪）、NME 3（假面女郎、小女子、惡中之惡）、The Hindu 2（黑暗榮耀、和我老公結婚吧）、Collider 2（無赦之仇、惡緣）；Guardian、Korea Times、Rolling Stone、RogerEbert.com、HanCinema、Forbes、Maeil Business（MK）、Soompi 各 1。
>
> **不在指定清單的英文來源有 8 部**：無赦之仇、惡緣（Collider）、惡鬼（Rolling Stone）、暴風圈（RogerEbert.com）、信號（HanCinema，韓劇粉絲網站）、惡之花（Forbes contributor）、模範計程車（MK 英文版）、善意的競爭（Soompi，Rakuten Viki 旗下，連結全導向 Viki，有利益關係）。原因：無赦之仇本來有 Decider 可用，但 Decider 已滿 3 次；其他幾部在清單媒體裡找不到單篇評論，或只有 SCMP（付費牆）。
>
> SCMP 的 Pierce Conran 幾乎每部都有評論（模範計程車 S1／S2、小女子、無赦之仇、善意的競爭、黑暗榮耀 Part 1／2），但 SCMP 有付費牆，這裡只在「分歧」欄當 snippet 引用。NYT 有兩篇相關（2025-09-10 國際劇集綜評含暴風圈；2025-12-22〈In These K-Dramas, Women Are Unjustly Accused (Maybe)〉含血謎拼圖），Groundlane 回 403、Exa 回 CRAWL_LIVECRAWL_TIMEOUT；改用 jina 讀取時被權限分類器拒絕，沒有再試別的繞法。所以 NYT 只引用 Metacritic 頁面上的摘錄。
>
> 台灣中文評論：電影神搜 7 部（其中 4 篇是潘光中，臺灣歐妮 2 篇，推坑人妻 1 篇）、聯合報系 4 部（500輯〈質青評論〉雀雀 2 篇、聯合報〈聯合好評〉雀雀 1 篇、噓！星聞〈udn星級評論〉梅衍儂 1 篇）、釀電影 3 部、關鍵評論網 1、端傳媒 1、太報 1、Tatler Asia 繁中版 1（lifestyle）。18 篇都沒有「合作／贊助」標記；500輯的兩篇用 friDay影音提供的劇照，芮塔的《財閥家》文（備用，未採用）圖說有 TAG Heuer 錶款置入，已在該劇註明。

---

## 1. The Glory 黑暗榮耀（Netflix，2022–2023）

1. **Metacritic S1**：**Metascore tbd，4 則評論**（全部正評：The A.V. Club 91、San Francisco Chronicle 75、Decider 70 兩則）。https://www.metacritic.com/tv/the-glory/critic-reviews/ （read）
2. **豆瓣**：Part 1 **開分 8.7、隨即升到 8.8**，游民星空 GamerSky，2023-01-02，〈宋慧乔新剧《黑暗荣耀》豆瓣开分8.7〉。https://www.gamersky.com/news/202301/1552923.shtml （read；開播第三天的數字）。後來的數字：香港01「開罐」（署名「女人我最大」），2025-02-21，〈近三年豆瓣評分最高韓劇Top10〉寫 **9.0，近五十萬人**。https://www.hk01.com/開罐/1007313/ （read）
3. **英文評論**：The Hindu，S. Poorvaja，2023-03-12，〈‘The Glory’ Part 2 review: Razor-sharp writing elevates this disturbing tale of bullying and revenge〉。https://www.thehindu.com/entertainment/movies/the-glory-part-2-review-razor-sharp-writing-elevates-this-disturbing-tale-of-bullying-and-revenge/article66610416.ece （read；評 Part 2，結尾回頭總評兩部）
   - 摘要：她擔心續集撐不住第一部的口碑，結果 Part 2 的轉折從不落入可預測；霸凌場面比 Part 1 收斂，但家暴戲太刺激、可刪。宋慧喬克制的演出、林智妍不求被原諒的反派，以及李到晛的角色都加分；她認為這部劇最後屬於劇中的女人們。
   - 原文：「Part 2 of The Glory, goes above and beyond, with its razor-sharp writing, compelling narrative, and impressive performances.」
4. **中文評論（台灣）**：釀電影，許婷婷，2023-02-02，〈《黑暗榮耀》：當我從宋慧喬的粉絲，變成了文同珢的粉絲〉。https://filmaholic.tw/series/63db388dfd897800010a2ebe/ （read；只評 Part 1，Part 2 三月才上線）
   - 摘要：作者自承是宋慧喬多年粉絲，認為這是她最美的一部戲，因為她不再演光鮮的上流角色；金銀淑除了文同珢，還寫出被家暴的姜賢南、被害者家屬朱如炡等「受害者結盟」，讓觀眾不知不覺站到復仇者這邊。反駁了「宋慧喬老了、不美了」的批評。
   - 原文：「如果有一種武器能抵禦最悲哀的恨意，那便是復仇的意志。」
5. **分歧**：評論與觀眾大致一致，**爭議集中在感情線**：香港01 寫「男女主的感情線引起爭議」（read）；Cinema Escapist 的 Jianne Soriano 認為李到晛當戀人不如當盟友、兩人年齡差也讓「學長」設定難信（Exa 搜尋長摘要，partial）；Indian Express 的 Lakshana N Palat 說 Part 1 反派「downright ghoulish」、台詞過度（partial）。Netflix 2023 上半年全站第 3、6.228 億小時（ratings 檔）。

## 2. Mask Girl 假面女郎（Netflix，2023）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「mask girl」沒有這部，read）。
2. **豆瓣**：未找。
3. **英文評論**：NME，Carmen Chin，2023-08-22，〈‘Mask Girl’ review: a captivating tale of murder and vengeance〉。https://www.nme.com/reviews/tv-reviews/mask-girl-review-netflix-k-drama-3486520 （read；全 7 集）。注意：NME 把導演名字寫成「Kim Young-hoon」，一般拼法是 Kim Yong-hoon。
   - 摘要：她認為每集換一個角色觀點、接近單元劇的結構，在韓劇裡很實驗；三位女演員把同一個金貌美演得像一個人。題材橫跨恐怖、諷刺、黑色喜劇卻不顯斷裂，可能是當年最好的韓國驚悚劇之一。
   - 原文：「Mask Girl is a masterclass in knife-sharp satire and social commentary about the commodification and objection of women」
4. **中文評論（台灣）**：500輯〈質青評論〉，雀雀，2023-09-23，〈「假面女郎」：外貌至上主義扭曲當代人心 驚悚韓劇反應容貌焦慮與生存焦慮〉。https://500times.udn.com/wtimes/story/120840/7458203 （read）
   - 摘要：金貌美不是為了星夢才整形，而是約會強暴事件中自衛後想隱姓埋名；全劇幾乎不讓她為自己辯護，觀眾因此同情她。作者把本劇和《變臉》、《惡女羅曼死》、金基德《時間》並列，認為韓國對整容題材的處理更「玉石俱焚」。
   - 原文：「看完以後更不難理解韓國人的容貌焦慮，就是他們的生存焦慮。」
5. **分歧**：**評論對後半段意見分歧**。Observer 的 Laura Babiak 說前兩集是 Netflix 當年最好的兩小時，但後半變成半生不熟的復仇劇、「cracking under the pressure of its own cleverness」（Exa 搜尋長摘要，partial）；Slate 的 Nadira Goffe 說第三幕「going off the rails」（partial）；The Monthly 的 Tara Kenny 也說前幾集最有效（partial）。NME、Indian Express（Rohan Naahar）則全面肯定。Netflix 2023 下半年 1,850 萬次觀看、韓劇第 2（ratings 檔）。

## 3. Taxi Driver 模範計程車（SBS，2021／2023／2025）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：未找。
3. **英文評論**：Maeil Business（MK）英文版，이다겸（Lee Dakyum）等，2025-12-10（KST），〈The Unexpected Charm of a ‘Dark Hero’... ‘Taxi Driver 3’ Lee Je-hoon, Main and Alter Egos Parade [Multi-Review]〉。https://www.mk.co.kr/en/culture/11487206 （read；**只評第 3 季初期**；評分段落輸出截斷）。**注意**：MK 是韓國經濟日報，不在原清單；NME、Decider、Hindu、Korea Herald 等都沒找到任何一季的單篇評論，S1／S2 只有 SCMP（付費牆）。
   - 摘要：「優點」欄肯定李帝勳多重變裝與更強的反派陣容；「缺點」欄指出第 1 集瓶中撿到名片等設定太牽強、團隊對話比前兩季幼稚、過度依賴變裝橋段。收視首播 9.5%、最新一集 12%。
   - 原文：「The first episode, which dealt with overseas human trafficking connected to illegal mobile gambling, was criticized for its contrived plot.」
4. **中文評論（台灣）**：500輯〈質青評論〉，雀雀，2023-04-14，〈摸著良心的「模範計程車2」：韓劇宇宙永遠的不二王道〉。https://500times.udn.com/wtimes/story/120840/7098650 （read；評第 2 季）
   - 摘要：第二季規格升級、出國辦案但「沒有砸錢了事之感」；每週兩集講完一個案子，不靠「未完待續」吊觀眾；從孤兒權益、青年貸款詐騙到醫療糾紛，有系統地替弱勢發聲。作者承認團隊「有時確實顯得太過大愛」。（另有釀電影〈《模範計程車》：不只是劇，更是正義〉評第 1 季，https://filmaholic.tw/series/60c97288fd89780001639bd2/ ，snippet，未讀）
   - 原文：「在韓國，良心就是戲劇宇宙裡的不二王道。」
5. **分歧**：**收視一季比一季高，評論一季比一季保留**。韓國全國收視 S1 約 16%、S2 21%（KDF，ratings 檔；Korea Times 2023-04-19 專訪摘要，snippet），S3 全國 14.2%（ratings 檔）；SCMP 的 Conran 給 S1 3.5/5、S2 3/5，說 S2「wasn’t quite as funny」（snippet）。S3 觀眾意見兩極，MK 引用「My loyalty ends with Season 2」等留言（read）；MDL S3 8.7（12,987 人）、有用戶批評這季主角群開始殺人卻沒有任何反省（Exa 摘要，snippet）。李帝勳以 S3 拿下 SBS 演技大賞大賞（Korea Herald 2026-01-02 摘要，snippet）。

## 4. Revenant 惡鬼（SBS／Disney+，2023）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「revenant」沒有 TV 結果，read）。
2. **豆瓣**：未找。
3. **英文評論**：Rolling Stone，Geoffrey Bunting，2023-07-29，〈Don’t Sleep on ‘Revenant,’ a Masterful K-Horror Series on Disney+〉。https://www.rollingstone.com/tv-movies/tv-movie-reviews/revenant-review-disney-plus-south-korea-horror-kim-tae-ri-1234797358/ （read；全 12 集）。**注意**：Rolling Stone 不在原清單；清單媒體只找到 NME 的預告新聞。
   - 摘要：他看到《七夜怪談》、《鬼水怪談》、《哭聲》、《駭人怪物》的影子，但說它是那條韓日恐怖脈絡的集大成而不是抄襲；金泰梨兼演散影與附身的惡鬼，和吳正世的教授形成對比。他認為西方恐怖片已經忘了「恐怖要讓人害怕」。
   - 原文：「It is, more than anything, human, and a reminder that South Korea just does horror so much better than we do.」
4. **中文評論（台灣）**：釀電影，Kristin，2023-08-22，〈《惡鬼》：試著活下去吧〉。https://filmaholic.tw/series/64e43317fd897800016daac3/ （read (Exa cache)）
   - 摘要：金銀姬開宗明義說鬼真實存在，用民俗學快速建立陰陽兩界規則；前半「人比鬼恐怖」，惡鬼靠宿主的慾望壯大。作者把它讀成被靈異包覆的成長故事：散影對抗的是自己的心魔，結局選擇「為自己活下去」。
   - 原文：「換言之，人確實比鬼恐怖，人鬼並不殊途，鬼是因應人之一己私慾而創造出的產物」
5. **分歧**：口碑一面倒偏好，爭議小。電影神搜完結劇評的摘要說前段「只看到了懸疑卻沒有驚恐」、驚嚇集中在最後四集（https://news.agentm.tw/288670/ ，snippet）；Reddit 結局討論串有人覺得結局「too neat」、有漏洞（用戶留言，snippet）。GQ TW 寫收視「穩定10%起跳」（推廣文，snippet）。FUNdex 2023 TV 劇決選（ratings 檔）。

## 5. Signal 信號（tvN，2016）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「signal」只有德國劇 *The Signal (2024)*，read）。
2. **豆瓣**：沒有可用來源。kknews 轉載文寫「《信號》（豆瓣9.2）」（內容農場，snippet，不採用）。
3. **英文評論**：HanCinema，Vasia Orion，2016-03-19，〈[HanCinema's Drama Review] "Signal"〉。https://www.hancinema.net/hancinema-s-drama-review-signal-92589.html （read；Groundlane 遇 challenge 但仍回傳內文，結尾廣告區截斷）。**注意**：HanCinema 是韓劇資料／粉絲網站，作者是部落客，不在原清單；清單媒體只找到 Korea JoongAng Daily 的導演訪問（https://www.koreajoongangdaily.com/korea/signal-tells-koreas-true-crime-tales/10944769 ，Exa 摘要，partial）和 Korea Herald 的劇情新聞。
   - 摘要：他原本擔心男主角不討喜、時空設定沒計畫，結果都被推翻；節奏、支線、配角都照顧到。他承認有劇情漏洞、無線電規則不清、部分轉折可預測，但「這些缺點被整體成就蓋過」。
   - 原文：「"Signal" is a well-crafted and captivating experience.」
4. **中文評論（台灣）**：端傳媒，2016-04-19，〈《Signal》：跨時空刑偵劇再創韓劇新高度〉。https://theinitium.com/article/20160419-culture-review-korean-drama-signal （**partial**：Exa 只讀到前兩段導言，其後應為付費內容；作者署名沒讀到）。**注意**：端傳媒是港台共用媒體。關鍵評論網〈正義何以伸張？韓劇《信號Signal》裡幾個真實懸案的原型〉（https://www.thenewslens.com/article/88306 ，read (Exa)）是太咪為時報出版劇本書寫的推薦序、附購書連結，屬書摘不算評論，未採用。
   - 摘要（只依讀到的段落）：作者說觀眾以為韓劇就是豪門、車禍、失憶，但有線台崛起後有團隊開始做緊扣時勢的類型劇，《Signal》改編多起韓國重大懸案，在偵查、加害與受害、立法懲戒與輿論各層面帶來省思。
   - 原文：「《Signal》正是社會寫實成功接軌商業製作的絕佳案例。」
5. **分歧**：**結局有好有壞，但「名作」地位幾乎沒有爭議**。헤럴드경제 서병기 2016-03-13：「‘시그널’이 결말에 대한 호불호가 있지만, 명작임은 분명하다」（Exa 搜尋長摘要，partial；同文寫完結篇平均 13.4%、最高 15%）。tvN 有線收視 12.544%（ratings 檔）。**場外**：噓！星聞 2026-02-13 報導趙震雄被揭少年犯前科後永久引退，tvN 2026 片單不見《信號2》（https://stars.udn.com/star/story/10091/9329131 ，snippet，正文引用前要讀原文）。

## 6. Flower of Evil 惡之花（tvN，2020）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：**9.1**（人數不明，前 4 集播完時），電影神搜，潘光中，2020-08-13（同下方中文評論）。https://news.agentm.tw/125608/ （read；同文寫 IMDb 當時 9.0）。注意是播出初期的數字。
3. **英文評論**：Forbes（contributor），Joan MacDonald，2020-07-30，〈‘Flower Of Evil’ K-Thriller Delivers Monsters That Hide In Plain Sight〉。https://www.forbes.com/sites/joanmacdonald/2020/07/30/flower-of-evil-k-thriller-delivers-monsters-that-hide-in-plain-sight/ （**partial**：Groundlane 回 403，Exa 只讀到開頭兩段，加上 Exa 搜尋摘要裡的劇情段；評價段沒讀到；只評首播）。**注意**：Forbes contributor 不在原清單；清單媒體沒找到單篇評論。
   - 摘要（只依讀到的部分）：開場溺水夢境是預兆，熙成表面是完美丈夫、父親，暗示他的過去對當刑警的妻子是問題；劇名取自波特萊爾。
   - 原文：「Would you recognize evil if you were intimately acquainted with it? Maybe not.」
4. **中文評論（台灣）**：電影神搜，潘光中，2020-08-13，〈李準基×文彩元高分韓劇《惡之花》: 我們所定義的善惡，會不會都是包裝過的虛幻認知？〉。https://news.agentm.tw/125608/ （read；**只評前 4 集**）
   - 摘要：節奏快，前四集三樁命案帶出十八年前的連環殺人案；作者推測熙成不只是反社會人格，可能還有思覺失調傾向，並比較同期《雖然是精神病但沒關係》的女主設定。編劇靈感來自波特萊爾《惡之華》的「人性本惡」。
   - 原文：「每個人對外都有一個包裝過的形象，但你真的有膽量去認識包裝下的真相嗎？」
5. **分歧**：**韓國收視普通、國際口碑極高**。首播 3.357%（udnSTYLE 2020-07-31 摘要，snippet），前四集最高突破 5%（電影神搜，read）；MDL #8 9.0（101,007 人）、IMDb 8.5（ratings 檔）。後段「失憶」轉折被部落客批評：The Fangirl Verdict 說結局「leaned a touch underwhelming」、JazmineMedia 說最後幾集太誇張、不喜歡失憶梗（都是 Exa 摘要，snippet）。

## 7. Stranger 秘密森林（tvN，2017／2020）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「stranger」只有 *Stranger Things* 等，read）。
2. **豆瓣**：沒有可用來源。搜狐號（2018）、kknews 寫 9.2，豆列轉貼文寫完結時「2萬多人」9.3（都是自媒體或用戶轉貼，snippet，不採用）。
3. **英文評論**：The Korea Times，Park Jin-hai，2017-08-09，〈'Stranger' ends leaving viewers wanting more〉。https://www.koreatimes.co.kr/entertainment/shows-dramas/20170809/stranger-ends-leaving-viewers-wanting-more （read；第 1 季完結）。**注意**：這篇是署名的完結評析，混合文化評論家河在根的引述，不是傳統星級劇評；Scroll.in 的 Vikram Johri（2017-07-28）有播出中評論（Exa 摘要，partial，不在清單）。
   - 摘要：收視不算大爆，因為中途加入的觀眾很難跟上，但「評論家與劇迷」都說它自成一格；沒有任何愛情線，只有一個大案。河在根把黃始木形容成「不信任時代催生的幻想」：沒有慾望、沒有情緒的人無法被收買或威脅。
   - 原文：「critics and drama fans alike say that “Stranger” is in a league of its own」
4. **中文評論（台灣）**：釀電影，Lizzy，2020-11-10，〈《秘密森林》：醬缸裡的小白魚（與小白目！）〉。https://filmaholic.tw/series/5faa066dfd89780001285232/ （read (Exa cache)；以第 2 季為主，兼論第 1 季）
   - 摘要：第二季把題材擴大到文在寅政府削減檢察權的檢警調查權之爭，「完全沒為討好觀眾而簡化劇情」；她用「框架」讀每個角色（李昌俊被岳家財團綁住、徐東載被野心綁住），黃始木的「白」同時是清白和白目，所以能在醬缸裡活下來。
   - 原文：「明明讓人看見艱難的現實，卻仍給了很務實的希望。」
5. **分歧**：**收視低、評價極高**的典型。Korea Times 明寫「not a smash-hit in terms of viewership ratings」（read）。NYT 電視評論家 Mike Hale 把它選為 2017 年十大國際劇集、唯一一部韓劇（Yonhap 2017-12-08 報導，Exa 摘要，partial；NYT 原文未讀）。百想藝術大賞電視大賞（Wikipedia 摘要，snippet）。IMDb 8.4、MDL #55 8.7（ratings 檔）。

## 8. The Manipulated 操控遊戲（Disney+／Hulu，2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「the manipulated」沒有這部，read）。
2. **豆瓣**：未找。
3. **英文評論**：Decider，Joel Keller，2025-11-05，〈Stream It Or Skip It: ‘The Manipulated’ On Hulu, Where A Man Exacts Revenge Against The Person That Framed Him For A Heinous Murder〉。https://decider.com/2025/11/05/the-manipulated-hulu-review/ （read (Exa)；**只評第 1 集**；Groundlane OUTPUT_LIMIT）
   - 摘要：他覺得像《絕命追殺令》影集版；比一般「蒙冤」劇多走一步，主角不會整季在牢裡喊冤，而是查出誰陷害他再復仇。唯一擔心是陰謀揭露要拖多久，觀眾對誤導的耐心有限。結論 STREAM IT。
   - 原文：「The Manipulated is a solid, competent thriller that takes the “falsely accused” trope a step further than most shows in this category might.」
4. **中文評論（台灣）**：Tatler Asia 繁中版，Irene Chen，2025-11-06，〈《操控遊戲》是犯人版的「魷魚遊戲」？7點評價：前四集看池昌旭從弱雞變成獄中霸主、都敬秀完美飾演擁有清澈雙眼的瘋子〉。https://www.tatlerasia.com/lifestyle/entertainment/the-manipulated-review-zh-hant （**partial**：Exa 搜尋長摘要，涵蓋 7 節中的 6 節；只評前 4 集）。**注意**：Tatler 是 **lifestyle 媒體**、台港共用繁中版，不在原清單；清單媒體只找到 ELLE TW〈8大追劇看點〉（圖片「Disney+提供」，宣傳型，未採用）、GQ TW 幕後介紹、女子漾懶人包。
   - 摘要：劇版把 2017 電影《虛擬城市》擴寫成更大的陰謀網，反派一開始就明牌，重點從「誰是黑手」變成「他們能做多絕」；池昌旭從溫順到在獄中「理解規則、摸清人性」變強；都敬秀的惡「沒有雜質」。
   - 原文：「都敬秀讓觀眾看到一種沒有雜質的惡」
5. **分歧**：英文部落格型評論說中段鬆、結局倉促：The Review Geek 的 Rati Pednekar 給 7.5/10，指出「mid-series lull」與結尾的 deus ex machina（Exa 摘要，partial）。PTT KoreaDrama 心得文多數推，但也有「第一集就不好看」「主角光環太強大」「怎樣被撞都沒事」的推文（Exa 摘要，用戶留言，snippet）。女子漾標題稱「Disney+台韓收視冠軍」（snippet）。

## 9. Little Women 小女子（tvN／Netflix，2022）

1. **Metacritic S1**：沒有 Metascore（站內搜尋只有 BBC 版 *Little Women (2018)*，read）。
2. **豆瓣**：未找。
3. **英文評論**：NME，Tanu I. Raj，2022-09-23，〈‘Little Women’ review: a gripping tale of family, struggle, and personal growth〉。https://www.nme.com/reviews/little-women-kdrama-review-netflix-3314925 （read；**播出中、約前 4 集**）
   - 摘要：她認為改編比 Alcott 原著黑暗糾結得多；南志鉉是全劇最複雜的角色，金高銀演出長女被迫走入灰色地帶。鄭瑞景的劇本大量用物件當隱喻：仁珠的鞋、仁京裝龍舌蘭的漱口水瓶、媽媽留下的蘿蔔泡菜。
   - 原文：「It’s not about defeating fate through grand gestures, but reforming one’s relationship with their ‘little-ness’ and perhaps eventually learning to be comfortable with it.」
4. **中文評論（台灣）**：電影神搜，臺灣歐妮，2022-10-11，〈【劇評】《小女子》：12集的陳花英復仇大戲，適當的忽略那些不合理，還是十分精彩〉。https://news.agentm.tw/291171/ （read；完結劇評；最後一節輸出截斷）
   - 摘要：最後兩集揭曉一切源自陳花英的復仇計劃；仁珠「從一而終的傻」、被貪念推著走，三姊妹裡最有主角光環的是堅持記者正義的仁京。標題就承認劇中有不合理處，但整體精彩；全國收視 11.1%，擠進 2022 年第八名。（另有 500輯 芮塔期中評，https://500times.udn.com/wtimes/story/120840/6669866 ，snippet，未讀）
   - 原文：「從頭到尾仁珠都單純，單純的想要有錢，才一而再的被利用」
5. **分歧**：**越南下架爭議**：Netflix 應越南廣電與電子資訊局要求，因第 3、8 集對越戰的台詞「歪曲歷史」，在越南下架本劇（VnExpress，Ha Thu，2022-10-06，https://e.vnexpress.net/news/life/netflix-removes-k-drama-little-women-from-vietnam-roster-over-history-distortion-4520151.html ，read）。評論與觀眾有落差：RT 評論 100%（6 則）、觀眾 Popcornmeter 70%（Exa 摘要，snippet）；SCMP 的 Conran 完結評給 5/5（snippet），噓！星聞〈娛樂有評〉則說前六集「有許多的漏洞」（snippet）。

## 10. Mercy for None 無赦之仇（Netflix，2025）

1. **Metacritic S1**：**有頁面，Metascore tbd，2 則評論**（Collider 80、Decider 60）。https://www.metacritic.com/tv/mercy-for-none/ （劇頁 read：tbd、8 則用戶評分；評論清單來自 Exa 對 critic-reviews 頁的摘要，partial）
2. **豆瓣**：未找。
3. **英文評論**：Collider，Jeff Ewing，2025-06-06，〈'Mercy for None' Review: Netflix's Blood-Soaked Revenge Thriller Is the Unofficial John Wick Spinoff We Always Wanted〉。https://collider.com/mercy-for-none-review-netflix/ （read；全 7 集；評分欄後截斷）。**注意**：Collider 不在原清單；清單內的 Decider（Joel Keller，2025-06-08，https://decider.com/2025/06/08/mercy-for-none-netflix-review ，read (Exa)，只評第 1 集、STREAM IT 但嫌沒交代幫派背景）因 Decider 已滿 3 次而改列分歧欄。
   - 摘要：蘇志燮演出沉默而悲傷的復仇者，打戲不靠槍、近身肉搏，比《捍衛任務》更接近《原罪犯》走廊錘子戲；缺點是角色內在很淺、部分打鬥物理不合理，但仍是好看的驚悚劇。
   - 原文：「it's a gritty, action-packed, twisty thriller that satisfies the itch to see hundreds of gangsters yeeted across a room by a very sad man」
4. **中文評論（台灣）**：電影神搜，潘光中，2025-06-11，〈【劇評】《無赦之仇》：大蘇再出江湖！寵弟狂魔蘇志燮隻手挑翻半個韓國黑社會？〉。https://news.agentm.tw/358915/ （read）。**注意**：文中說由《王牌計中計》李日炯導演執導，但 But Why Tho 評論寫導演是 Choi Sung-eun（Exa 摘要），兩者不符，引用前要查證。
   - 摘要：設定像《殺人預言》，但作者認為主軸其實是秋英宇的檢察官與車勝元的臥底警官爭權，南基準一路殺到底「從宏觀角度看毫無意義」，是繞回原點的圓形敘事；打戲不求美感、只求「打下去會痛」。
   - 原文：「因為這個故事真正要講述的不是「復仇」，而是「欲望」與「責任」。」
5. **分歧**：**海外熱、韓國冷**。Korea Times（Hankook Ilbo 轉譯，2025-06-23）寫上線第二週登 Netflix 全球非英語劇第 1、75 國前十、RT 100%，但韓國觀眾評價分歧，批評主角太無敵、少了原作網漫的道德灰色（https://www.koreatimes.co.kr/entertainment/shows-dramas/20250623/mercy-for-none-revives-gangster-drama-abroad-amid-waning-interest-at-home ，read；未署個人名）。SCMP 的 Conran 給 2.5/5、標題稱「middling」（snippet）；Mint 的 Trisha Bhattacharya 也給 2.5/5（Exa 摘要，partial）。PTT 有人用「無赦之仇爛尾」形容後段（推文，snippet）。

## 11. Nine Puzzles 血謎拼圖（Disney+／Hulu，2025）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：未找（只看到一篇豆瓣用戶長評，不採用）。
3. **英文評論**：Decider，Joel Keller，2025-05-21，〈Stream It Or Skip It: ‘Nine Puzzles’ On Hulu, Where A Police Profiler Investigates A Murder Similar To Her Uncle's Killing Ten Years Ago〉。https://decider.com/2025/05/21/nine-puzzles-hulu-review/ （read (Exa)；**只評第 1 集**）
   - 摘要：第一集節奏慢，他覺得可以少十五分鐘，尤其切到孫錫久的刑警時「slow to a crawl」；但伊娜與當年懷疑她的刑警被迫合作的設定吸引人，比作《The Frog》。結論 STREAM IT。
   - 原文：「Nine Puzzles starts up slow, but sets up an intriguing thriller that we hope gets more intense as it goes along.」
4. **中文評論（台灣）**：太報 TaiSounds，推機跟麋鹿（MD+82 頻道主理人），2025-06-06，〈劇評》懸疑勾人、卡司步步驚心！等待《血謎拼圖》下一塊燒腦拼圖〉。https://www.taisounds.com/news/content/0/194541 （read；Exa 搜尋結果帶回全文；完結後）。**注意**：太報不在原清單，作者是 podcast 主持人；清單媒體只找到 ELLE TW 專訪、GQ TW 職業介紹、電影神搜上線新聞。
   - 摘要：尹鍾彬把整部劇定調在「現實與非現實之間」，警局復古、側寫師辦公室過度現代；大咖客串多到「演一具屍體」。缺點是重動機、輕作案過程，兇手是否真能做到這些事交代不足，喜歡推理的人可能失望。
   - 原文：「對於非常想看推理的劇迷朋友或許會有些小失望，但個人還是很喜歡。」
5. **分歧**：**慢熱、後來成為 Disney+ 年度韓劇冠軍**。Korea Times（Hankook Ilbo 轉譯，2025-06-02）寫上線五天後才爬進 Disney+ 全球前十，業界認為還不算破圈大作（read）；Variety 標題稱 2025 年 Disney+ 觀看最多的韓劇（snippet）。評價面：菲律賓 The POST 的 Johanna L. Añes-De La Cruz 說它「brims with brains but falls short of thrills」、主角被寫成近乎漫畫人物（Exa 摘要，partial）；巴哈姆特用戶心得嫌辦案懶散、少了推理鬥智（snippet）。NYT 2025-12-22 有一篇把本劇與《告白的代價》並論的文章，未能讀到。

## 12. Tempest 暴風圈（Disney+／Hulu，2025）

1. **Metacritic S1**：**72（Generally Favorable），4 則評論**：Collider 90、RogerEbert.com 80、NYT（Mike Hale）60，第 4 則 70 分沒讀到來源。https://www.metacritic.com/tv/tempest-2025/critic-reviews/ （read；頁面只顯示 3 則摘錄）
2. **豆瓣**：未找。
3. **英文評論**：RogerEbert.com，Sherin Nicole，2025-09-10，〈Hulu K-Drama “Tempest” Grapples with the Inevitability of War and the Dream of Peace〉。https://www.rogerebert.com/streaming/tempest-hulu-korean-tv-review-2025 （read (Exa)；**只評前 3 集**；最後一段 Exa 截斷，結尾句另見 Exa 搜尋摘要）。**注意**：RogerEbert.com 不在原清單；清單內的 NYT Mike Hale 只看到 Metacritic 摘錄（說三集看下來劇本是弱點），原文讀不到。
   - 摘要：她從《終極保鑣》《魔鬼毀滅者》聯想，但說這部更像《外交官》《夜班探員》；政治陰謀一點一點透出、問「誰受益」會得到太多答案，這正是誘餌。全智賢與姜棟元外冷內熱的化學反應有推進力。
   - 原文：「“Tempest” enticingly plays out like a blockbuster spy thriller with a slightly slower pace than on film.」
4. **中文評論（台灣）**：關鍵評論網（TNL+ 影劇），胡芩，2025-09-18，〈【劇評】《暴風圈》：女性和小國，能否在被動與主動中找到生路？〉。https://www.thenewslens.com/article/258771 （**partial (Exa cache)**：讀到前半，可能是 TNL+ 會員內容）
   - 摘要：動作場面「直逼院線水準」，第三集拆彈戲令人屏息；但她更在意角色的孤立無援：外交官徐聞柱在婆婆眼中配不上兒子，丈夫遇刺後又被政黨當成選票商品，她的悲傷與個性都被量化。作者連到現實中女性政治人物被放大檢視的處境。
   - 原文：「徐聞柱的處境，或許成了女性一直以來從政所面對的縮影。」
5. **分歧**：**評論偏正面、觀眾較冷，另有中國爭議**。RT 評論 100%（7 則）、觀眾 Popcornmeter 60%（Exa 摘要，snippet）；Metacritic 72 裡 NYT 60 分最低（read）；The Review Geek 說中段節奏與寫作下滑、結尾的虛構國家像 deus ex machina（Exa 摘要，partial）。**中國觀眾抵制**：第 4 集台詞「Why does China favour war?」與把香港街景標成大連，引發中國網友指控辱華、要求品牌與全智賢切割（Korea Times 2025-09-20 轉載 SCMP，https://www.koreatimes.co.kr/entertainment/films/20250920/k-drama-tempest-angers-mainland-viewers-for-insulting-china-by-saying-it-favors-war ，read；品牌部分見 AsiaOne 摘要，snippet）。

## 13. As You Stood By 你旁觀的罪（Netflix，2025）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：未找。
3. **英文評論**：Decider，Joel Keller，2025-11-07，〈Stream It Or Skip It: ‘As You Stood By’ On Netflix, Where Two Women Make An Extreme Decision To Help One Of Them Escape An Abusive Marriage〉。https://decider.com/2025/11/07/as-you-stood-by-netflix-review （read (Exa)；**只評第 1 集**，兼提第 2 集方向）
   - 摘要：第一集主要建立恩秀為何再也不能旁觀；改編奧田英朗《Naomi and Kanako》。他批評時間反覆跳接（多次重播她推門進屋）是不必要的風格化、沒有製造張力；但以情感開場讓後面的轉折更容易共感。結論 STREAM IT。
   - 原文：「As You Stood By is a slow build, but its a worthwhile story to stick with as two women take back the control they lost in the face of abuse.」
4. **中文評論（台灣）**：聯合報〈聯合好評〉，雀雀（影評人），2025-12-21，〈為何韓國拍你旁觀的罪而台灣拍女孩與深度安靜？〉。https://udn.com/news/story/7341/9216554 （read）
   - 摘要：把本劇和舒淇《女孩》、沈可尚《深度安靜》對照：台片把觀眾放在旁觀者位置、忍住不批判，好讓男性觀眾也願意正視；韓劇則直球拍施暴與女性互助，「看似是放棄了男性觀眾族群」，但其實是照顧真正的目標受眾。
   - 原文：「世上所有沒受暴過的婦女族群都是倖存者，她們都曾擔驚受怕過。」
5. **分歧**：評價與熱度大致一致。Netflix 非英語劇週榜第 1、780 萬次觀看（Korea JoongAng Daily 2025-11-19 摘要，snippet）。改編爭點：原著結局是逃亡，劇版讓兩人自首，導演說「That ending was essential」（Korea Times 2025-11-17 摘要，snippet）。雀雀認為直球呈現暴力「顯得非常冒犯」（read）；Decider 嫌敘事破碎（read）。

## 14. The Worst of Evil 惡中之惡（Disney+，2023）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：未找。
3. **英文評論**：NME，Tanu I. Raj，2023-10-02，〈‘The Worst of Evil’ review: drugs, guns and violence – but not much else〉。https://www.nme.com/reviews/the-worst-of-evil-review-drugs-guns-and-violence-but-not-much-else-3507636 （read；**只評前 3 集**）
   - 摘要：魏嘏雋是本劇真正的明星，只用眼神就讓人猜不透他的人性還剩多少；池昌旭擺脫一串「forgettable」的愛情喜劇。但前三集除了毒品、槍、暴力沒有別的，是傳統「man’s man」臥底劇，第三集就開始失速、往不必要的三角戀走。
   - 原文：「Is it conventional? Sure. But it’s also mindless fun.」
4. **中文評論（台灣）**：電影神搜，潘光中，2023-10-05，〈雷/Disney+《惡中之惡》池昌旭×魏嘏雋：復刻九零年代韓國黑幫搏命打殺實錄〉。https://news.agentm.tw/287861/ （read；**只評前幾集**）
   - 摘要：動作場面有電影水準（兩位導演一位曾是朴勳政的副導、一位是動作指導出身），但臥底人選不專業、假身分過程兒戲；畫面太暗、手持鏡頭過多。前兩集慢，第三集宜貞加入後節奏飛快；作者猜俊末會不會像《無間道》韓琛一樣真的變成黑道老大。
   - 原文：「兩位導演似乎對手持鏡頭有點過度依賴，加上前述亮度過暗的問題，盯著螢幕看久了實在是頗暈。」
5. **分歧**：英文評論保留（NME「not much else」，read），台灣時尚媒體報導觀眾「從頭精彩到尾，結局也收得不錯」（udnSTYLE 2023-10-27，snippet）。Disney+ 獨播沒有電視收視；FUNdex 2023 OTT 劇決選（ratings 檔）。

## 15. Karma 惡緣（Netflix，2025）

1. **Metacritic S1**：沒有 Metascore（`/tv/karma/` 是 Michelle Khare 主持的美國實境秀，不是這部，read）。
2. **豆瓣**：未找。
3. **英文評論**：Collider，Jasneet Singh，2025-03-31，〈'Karma' Review: 'Squid Game's Park Hae-soo Is a Scene Stealer in Netflix's Brutal, Uneven K-Thriller〉。https://collider.com/karma-netflix-review/ （read；全 6 集；最後一節輸出截斷）。**注意**：Collider 不在原清單；NME 只有預告新聞，Korea Herald／Times 是訪問。
   - 摘要：她說主線「nothing short of brilliant」，不斷從新視角改寫事件；但支線硬塞進來又被遺忘，她得畫心智圖才跟得上。更大問題是兩位女性角色：孔升妍的角色剛有層次就被收掉，申敏兒的性侵受害者主線被壓縮成殘酷套路。朴海秀是全劇搶戲者。
   - 原文：「what's more frustrating is how Karma treats its female characters' storylines」
4. **中文評論（台灣）**：電影神搜，潘光中，2025-04-07，〈【劇評】《惡緣》朴海秀×申敏兒：真正的全員惡人！所有的惡行都會回到自己身上？〉。https://news.agentm.tw/338068/ （read）
   - 摘要：李日炯的非線性、多視角敘事在六小時影集裡有更多空間，每集至少換一兩次視角、頻頻閃回，分神就得倒回去看；作者比作《死期將至》的拼圖式結構，主演演技對撞豐富了主旨。
   - 原文：「不過一部分橋段的邏輯略顯套路化，多少影響了整體的質感。」
5. **分歧**：評論整體正面，主要保留在角色與女性線。Collider 說「uneven」（read）；India Today 的 Bhavna Agarwal 給 4/5、NDTV 的 Hardika Gupta 給 3.5（都是 Exa 摘要，partial）；Asian Movie Pulse 2026-01 稱它是 2025 韓劇「absolute top productions」之一（partial）。沒有找到韓國本地負面聲浪的來源。

## 16. Friendly Rivalry 善意的競爭（U+ Mobile TV／Netflix 海外，2025）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：未找。
3. **英文評論**：Soompi，P Talwar，2025-03-26，〈First Impressions: “Friendly Rivalry” Is A Story Of Teen Angst, Dangerous Pursuits, And Psychological Games〉。https://www.soompi.com/article/1731211wpp/first-impressions-friendly-rivalry-is-a-story-of-teen-angst-dangerous-pursuits-and-psychological-games （**partial**：Groundlane 讀到前段、其餘來自 Exa 摘要；**只評第 1–4 集**）。**注意**：Soompi 屬 Rakuten Viki 體系，文內演員連結全導向 Viki，**有利益關係**；不在原清單。清單媒體沒找到評論，SCMP（Conran，2025-04-16）有但付費牆。
   - 摘要：介紹彩華女高的排名生態：惠利飾演的榜首劉在伊刻意接近轉學生禹瑟琪，兩人各有目的；瑟琪父親（出題委員）死在在伊父親的醫院。作者認為它處理了升學壓力等社會議題。
   - 原文：「“Friendly Rivalry” is a taut teen mystery which deals with several socio-cultural issues and how the pressure of expectations molds as well influences impressionable minds.」
4. **中文評論（台灣）**：電影神搜，推坑人妻，2025-03-06，〈【完結劇評】《善意的競爭》：人氣網漫被魔改？劇情狠揭病態韓國的社會現況！〉。https://news.agentm.tw/329522/ （read；完結）
   - 摘要：稱讚惠利擺脫「德善」形象；但第 8 集後主線改成追查瑟琪父親死因，是原著沒有的劇版原創，原著粉絲不滿（漫畫裡瑟琪才是最狠的角色）。劇中嗑藥、停經手術、以身換考題等情節呈現韓國「病態教育」。
   - 原文：「但韓劇版硬是加上百合情節的共浴接吻場面，以及崔京因課業壓力太大而沉迷自慰等，都讓觀眾相當不解。」
5. **分歧**：**海外比國內紅**：Korea Times 2025-04-06 標題寫惠利靠這部「breakout overseas success」，內文說「resonating more abroad than at home」（snippet）。**原著粉絲與劇版**：電影神搜說網路評價「相當兩極」（read）。SCMP 的 Conran 副標寫「has much to offer – if you don’t mind the bumpy ride」（snippet）。

## 17. Marry My Husband 和我老公結婚吧（tvN，2024）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：未找。
3. **英文評論**：The Hindu，S. Poorvaja，2024-02-23，〈‘Marry My Husband’ K-drama review: Park Min-young and Song Ha-yoon are the stars of this chaotic revenge thriller〉。https://www.thehindu.com/entertainment/marry-my-husband-k-drama-review-park-min-young-and-song-ha-yoon-are-the-stars-of-this-chaotic-revenge-thriller/article67874522.ece （read；完結後；最後一段輸出截斷）
   - 摘要：前 11 集靠宋昰昀的閨蜜反派撐起張力，她稱宋昰昀「a revelation」；朴敏英從怯懦到會算計是她近年最好的演出。第 12 集起多加一個反派（BoA 飾演的前未婚妻）讓劇情變得混亂，網漫粉絲在 Reddit 批評這是不必要的改編；但結尾仍把線收好。
   - 原文：「the K-drama does falter in episode 12 with the unnecessary introduction of yet another villain」
4. **中文評論（台灣）**：噓！星聞〈udn星級評論〉，梅衍儂，2024-02-06，〈星級評論／「和我老公結婚吧」放下討好型人格 善良鋒芒畫界線〉。https://stars.udn.com/star/story/10091/7759523/ （read；**播出中**）
   - 摘要：前幾集節奏明快，女主拋棄討好型人格；中段節奏趨緩，但這讓人看到面對舊親密關係時的心軟與掙扎，跳脫一路開掛的套路。反派閨蜜也不只是單薄的壞，而是「我希望你過得好，但不能比我好」。
   - 原文：「「重生」類型中掌握了一個要點：重生不是神化」
5. **分歧**：**高收視、後段口碑下滑**。tvN 有線 11.951%、KDF 2024 #6（ratings 檔）；梅衍儂寫是 tvN 隔 10 個月首部破 10% 的劇（read）。Hindu 指第 12 集後變調、網漫粉絲不滿（read）；NME 則稱它「deliciously melodramatic」的 guilty pleasure（snippet）。朴敏英拍攝期間遭前男友詐騙案牽連，星級評論也提到「當時她歷經的緋聞」（read）。

## 18. Reborn Rich 財閥家的小兒子（JTBC，2022）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：未找。
3. **英文評論**：The Guardian，Walter Marsh，2023-02-14（網址日期 2023/feb/15），〈Reborn Rich: a K-drama like Succession – with time travel〉。https://www.theguardian.com/culture/2023/feb/15/reborn-rich-a-k-drama-like-succession-with-time-travel （read；全劇推薦評析）
   - 摘要：他把它放進《白蓮花大飯店》《繼承之戰》的「吃掉富人」潮流，說像《古戰場傳奇》加《回到未來》加《大賣空》；誇張歸誇張，對長子繼承、世襲財富與勞工代價有真正的批判；撐起全劇的是導俊與爺爺陳養喆之間古怪的祖孫情。他沒有談到結局爭議。
   - 原文：「It is not, in case you were wondering, a subtle show, trading realism for delicious histrionics and a kind of dream-logic.」
4. **中文評論（台灣）**：電影神搜，臺灣歐妮，2022-12-27，〈【完結劇評】《財閥家的小兒子》：前15集的爽快復仇劇結局功虧一簣？但其實最不必要的是感情線〉。https://news.agentm.tw/290428/ （read；完結）
   - 摘要：逐條列出第 16 集的漏洞（墜崖一週痊癒、20 年前的手機能錄音、陳星俊一聽錄音就認輸）；原著是陳導俊坐上會長、以陳導俊身分活下去，劇版改成陳導俊死、尹炫優回歸。她認為最不需要的是徐旻渶的感情線，若停在第 15 集博物館那場就是完美結局。（備用：500輯 芮塔 2022-12-17 期中評 read，盛讚為「年底前韓劇神作」，但圖說有 TAG Heuer 錶款置入，未採用）
   - 原文：「在第十六集後突然懷疑自己前十五集都看了什麼。」
5. **分歧**：**全表最明確的結局爭議**。完結篇收視 26.948%，2022 年收視冠軍、僅次於《夫妻的世界》（電影神搜，read；ratings 檔同）。結局播出後，ETtoday 報導韓網把「最爛電視劇」「龍頭蛇尾」洗上推特趨勢，網友諷刺劇名該改成「湯飯家的大兒子」（https://star.ettoday.net/news/2409390 ，snippet）；Korea JoongAng Daily 2022-12-26〈Final episode of JTBC’s 'Reborn Rich' garners mixed reviews〉、Korea Herald〈Viewers split over surprise ending〉（都是 snippet）。Guardian 兩個月後的評析完全沒提結局（read）。

---

## 總表

| # | 劇名 | Metacritic S1 | 豆瓣（新聞引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | 黑暗榮耀 | tbd（4 則，全正評） | 8.7→8.8（開分，GamerSky）／9.0（香港01，2025） | Hindu／Poorvaja | read | 釀電影／許婷婷 | read（Part 1） | 感情線爭議；反派單薄 |
| 2 | 假面女郎 | 無 | 未找 | NME／Carmen Chin | read | 500輯／雀雀 | read | 評論對後半段分歧 |
| 3 | 模範計程車 | 無 | 未找 | MK／이다겸（不在清單） | read（S3 初期） | 500輯／雀雀 | read（S2） | 收視逐季升 vs 評論與觀眾逐季保留 |
| 4 | 惡鬼 | 無 | 未找 | Rolling Stone／Geoffrey Bunting（不在清單） | read | 釀電影／Kristin | read (Exa) | 爭議小；前段不夠嚇人 |
| 5 | 信號 | 無 | 無可用 | HanCinema／Vasia Orion（粉絲站） | read | 端傳媒（作者未讀到） | partial | 結局有好有壞；趙震雄醜聞拖累續集 |
| 6 | 惡之花 | 無 | 9.1（前 4 集，電影神搜） | Forbes／Joan MacDonald（contributor） | partial | 電影神搜／潘光中 | read（前 4 集） | 收視 3–5% vs MDL #8；失憶結局 |
| 7 | 秘密森林 | 無 | 無可用 | Korea Times／Park Jin-hai | read | 釀電影／Lizzy | read (Exa，S2 為主) | 收視不高 vs NYT 年度國際劇 |
| 8 | 操控遊戲 | 無 | 未找 | Decider／Keller | read（ep1） | Tatler Asia／Irene Chen（lifestyle） | partial | 中段鬆、結局倉促；主角光環 |
| 9 | 小女子 | 無 | 未找 | NME／Tanu I. Raj | read（初期） | 電影神搜／臺灣歐妮 | read | 越南下架；RT 100% vs 觀眾 70% |
| 10 | 無赦之仇 | tbd（2 則） | 未找 | Collider／Jeff Ewing（不在清單） | read | 電影神搜／潘光中 | read | 海外第 1 vs 韓國冷淡、SCMP 2.5/5 |
| 11 | 血謎拼圖 | 無 | 未找 | Decider／Keller | read（ep1） | 太報／推機跟麋鹿（不在清單） | read | 慢熱→Disney+ 年度冠軍；推理不足 |
| 12 | 暴風圈 | **72**（4 則） | 未找 | RogerEbert.com／Sherin Nicole（不在清單） | read（3 集） | 關鍵評論網／胡芩 | partial | 評論 100% vs 觀眾 60%；中國抵制 |
| 13 | 你旁觀的罪 | 無 | 未找 | Decider／Keller | read（ep1） | 聯合報〈聯合好評〉／雀雀 | read | 大致一致；結局改成自首 |
| 14 | 惡中之惡 | 無 | 未找 | NME／Tanu I. Raj | read（3 集） | 電影神搜／潘光中 | read（初期） | NME 保留 vs 觀眾叫好 |
| 15 | 惡緣 | 無 | 未找 | Collider／Jasneet Singh（不在清單） | read | 電影神搜／潘光中 | read | 女性角色處理；整體正面 |
| 16 | 善意的競爭 | 無 | 未找 | Soompi／P Talwar（Viki 體系） | partial（ep1–4） | 電影神搜／推坑人妻 | read | 海外比國內紅；原著粉絲不滿魔改 |
| 17 | 和我老公結婚吧 | 無 | 未找 | Hindu／Poorvaja | read | 噓！星聞／梅衍儂 | read（播出中） | 第 12 集後變調 |
| 18 | 財閥家的小兒子 | 無 | 未找 | Guardian／Walter Marsh | read | 電影神搜／臺灣歐妮 | read | 結局大爭議（「最爛結局」） |

「未找」= 這次沒有為該劇另外搜尋豆瓣新聞；「無可用」= 搜過但只有自媒體、內容農場或用戶轉貼。

## 缺口

1. **Metacritic**：只有 3 部有頁面，2 部是 tbd（評論數不到 4 則不出分），只有暴風圈有真正的 Metascore（72）。正文引用時建議寫「Metacritic 收錄評論太少，不足以出分」，不要寫成「沒有評價」。
2. **豆瓣**：只有 2 部有新聞引述，而且都是開播或播出中的數字（黑暗榮耀開分 8.7、惡之花前 4 集 9.1）；黑暗榮耀的 9.0 來自香港01 的榜單文。信號、秘密森林常見的「9.2」只出現在自媒體與內容農場，沒有採用。財閥家的小兒子結局後的豆瓣變化沒有找到新聞。
3. **英文大媒體覆蓋薄**：清單內的媒體能用的主要是 Decider（3 篇都只評首集）、NME、The Hindu；8 部改用不在清單的來源。NYT 兩篇（暴風圈、血謎拼圖）讀不到；SCMP 幾乎每部都有完整評論但被付費牆擋住。信號、惡之花、秘密森林這三部 2016–2020 的老劇，在清單媒體裡沒有找到任何單篇評論。
4. **標了注意的英文評論**：信號（HanCinema 粉絲站）、惡之花（Forbes contributor，只讀到開頭）、模範計程車（MK，只評 S3 初期）、善意的競爭（Soompi，Viki 體系，有利益關係，只讀到部分）。正文要引的話，建議優先用 Guardian、Hindu、NME、Rolling Stone 這幾篇。
5. **台灣中文評論**：電影神搜占 7 部，其中 4 篇是潘光中。信號（端傳媒，付費牆、作者沒讀到）、暴風圈（關鍵評論網，TNL+ 只讀到前半）、操控遊戲（Tatler，lifestyle 媒體）是 partial；血謎拼圖、操控遊戲都只在清單外的媒體找到評論。
6. **只有首播或前幾集評論的**：操控遊戲、血謎拼圖、你旁觀的罪（英文都是 Decider 首集）；惡之花、惡中之惡（中英文都是初期）；小女子、暴風圈、善意的競爭（英文是初期）。
7. **事實待查**：電影神搜《無赦之仇》評寫導演是李日炯，和 But Why Tho 寫的 Choi Sung-eun 不符；NME《假面女郎》評把導演寫成 Kim Young-hoon。
8. 「分歧」欄裡的 SCMP、ETtoday、Korea JoongAng Daily、Korea Herald、RT 觀眾分數、PTT 推文等都是 **snippet**，正文引用前要再讀原文；趙震雄醜聞與《信號2》停擺只看到噓！星聞的摘要。

## toolDegradation

- **Groundlane MCP**（`web_extract`／`web_fetch`／`web_search`）為主：Metacritic 18 次站內搜尋與 3 個劇頁、The Hindu、NME、Guardian、Rolling Stone、Collider、Korea Times、MK、HanCinema、VnExpress、釀電影、500輯、聯合報、噓！星聞、電影神搜、游民星空、香港01 都讀到。失敗：Decider 3 篇回 OUTPUT_LIMIT；NYT 2 篇、Forbes 回 403（js_empty_document）；HanCinema 走 challenge 但仍回傳內文。`web_search` 內部的 tavily／exa provider 多次 unavailable，由 brave／you／keenable 補上。
- **Exa**：`web_search_exa` 用來找英文評論與台灣劇評（長摘要只當 partial）；`web_fetch_exa` 讀 Decider 4 篇、RogerEbert、關鍵評論網 2 篇、釀電影 2 篇、端傳媒（只回導言）、Forbes（只回開頭）成功；NYT 2 篇回 CRAWL_LIVECRAWL_TIMEOUT。
- **jina `read_url`**：嘗試讀 NYT 一次，被權限分類器拒絕，沒有再試別的繞法。
- **Tavily**：未使用（已知會 429）。**Firecrawl**：額度用完，未使用。**豆瓣**：沒有讀 subject 頁，也沒有碰 sec.douban.com。
