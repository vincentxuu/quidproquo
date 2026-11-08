# KR3 評價資料表：韓劇｜動作、生存與超能力 11 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-08。片單來自 `post-kr3-shows.txt`。IMDb／MDL／韓國收視／Netflix 觀看數沿用 `candidates-ratings-viewing-buzz.md`（該檔已標 read），這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic S1 | 先試 `metacritic.com/tv/<slug>/season-N/`（squid-game S1–S3 有頁；kingdom-2019、moving、dp 回 Page Not Found；bloodhounds、a-shop-for-killers、the-uncanny-counter、moving-2023 也 404），再用站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（kingdom、moving、d.p.、bloodhounds、shop for killers、weak hero、teach you a lesson、study group、uncanny counter、death's game） | Groundlane `web_extract`（render=never，抓 `title="Metascore N"`、`See All N Critic Reviews`、`/tv/` 連結） | 11/11 read：**只有《魷魚遊戲》有頁面**（S1 69／13 則、S2 62／36 則、S3 67／26 則）。`/tv/kingdom/` 轉到 2014 年美國 MMA 劇 `kingdom-2014`，`kingdom-2025` 是 BBC 自然紀錄片，都不是本劇 |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；沒有去抓 douban subject 頁，沒有繞過 sec.douban.com | Exa search／`web_fetch_exa` | 7 部有媒體引述（魷魚遊戲、異能、鐵拳教育、殺人者的購物中心、屍戰朝鮮、死期將至、D.P.）；其中 2 個只有 snippet |
| 英文評論 | 署名評論，讀全文或大半 | Groundlane `web_fetch` 為主；Decider 兩篇用 Exa `web_fetch_exa`（Groundlane OUTPUT_LIMIT） | 12 read（含《魷魚遊戲》S1＋S3 兩篇；其中 4 篇只評前幾集）；2 篇不在指定清單（流氓讀書會、死期將至） |
| 台灣中文評論 | 釀電影、鳴人堂、關鍵評論網、報導者、轉角國際、電影神搜、聯合報〈娛樂有評〉 | 關鍵評論網用 Exa `web_fetch_exa`；其餘 Groundlane `web_fetch` | 11 read（2 篇是 Groundlane 前半＋Exa 搜尋全文拼讀，見各條） |

標記說明：**read** = 工具讀到頁面內文（若輸出在最後一節被截斷會註明）；**read (Exa cache)** = Exa 快取副本；**partial** = 只讀到前段或一半；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：NME 3（D.P.、獵犬、殺人者的購物中心）、The Hindu 2（異能、鐵拳教育）、Decider 2（弱美男英雄 Class 2、驅魔麵館）、Polygon 1（魷魚遊戲 S1）、Variety 1（魷魚遊戲 S3）、Vulture／New York 1（屍戰朝鮮）；不在清單的 Jae-Ha Kim 個人站 1（流氓讀書會）、India Today 1（死期將至）。
>
> SCMP 的 Pierce Conran 對《流氓讀書會》《殺人者的購物中心》《死期將至》《弱美男英雄 Class 2》《驅魔麵館》《D.P.》都有評論，但付費牆，只在「分歧」欄當 snippet 引用。
>
> 台灣中文評論：電影神搜 4（弱美男英雄、流氓讀書會、殺人者的購物中心、獵犬）；聯合報〈娛樂有評〉2（驅魔麵館／芮塔、死期將至／雀雀）；關鍵評論網 1、釀電影 1、鳴人堂 1、報導者 1、轉角國際 1。電影神搜作者多為筆名（推坑人妻、芮塔的看劇筆記本）或編輯（黃小惠、潘光中），屬粉絲／編輯型劇評。11 篇都沒有「合作／贊助」標記。台灣中文劇名：魷魚遊戲、MOVING 異能、弱美男英雄、鐵拳教育、流氓讀書會、殺人者的購物中心、獵犬、驅魔麵館、屍戰朝鮮、死期將至、D.P：逃兵追緝令。

---

## 1. Squid Game 魷魚遊戲（Netflix，2021／2024／2025）

1. **Metacritic**：**S1 69（13 則）**、**S2 62（36 則）**、**S3 67（26 則）**。https://www.metacritic.com/tv/squid-game/season-1/ 、/season-2/ 、/season-3/ （read，Groundlane `web_extract` 取 `title="Metascore N out of 100"` 第一個值與 `See All N Critic Reviews`）。S1 只有 13 則，因為 2021 年上線時英文媒體多半後補評論。
2. **豆瓣**：S1 **7.7**（近 60 萬人，虎嗅 2024-12-31 文提到，snippet）；S3 **6.4**，同文寫 S1 7.7。快科技（轉新浪科技）〈《鱿鱼游戏》第三季豆瓣仅6.4分〉，2025-07-08。https://finance.sina.com.cn/tech/roll/2025-07-08/doc-infeurty6343019.shtml （read (Exa cache)）。S2 **開分 6.7**（蓝鲸新闻，記者汤诗韵，2024-12-27，同文說 S1 開播時 8.7），https://news.qq.com/rain/a/20241227A08L2A00 （snippet）；S2 **兩天後跌到 6.4**（羊城派，2024-12-30，https://news.qq.com/rain/a/20241230A051WZ00 ，snippet）。
3. **英文評論（S1）**：Polygon，Quinci LeGardye，2021-09-24，〈Squid Game review: Netflix’s Battle Royale-esque show packs a surprising punch〉。https://www.polygon.com/22692220/squid-game-review-netflix/ （read）
   - 摘要：她認為殺人遊戲類型不新，本劇勝在把重點放在每個角色「生存還是保有人性」的抉擇；畫面把童年符號和血腥並置，主辦方調查支線反而不如遊戲本身好看。觀看的不適感正是在確認觀眾自己的同理心。
   - 原文：「Squid Game is exciting, and startling, and tense, but that care is what really makes it worth watching.」
   - **英文評論（S3 最終季）**：Variety，Aramide Tinubu，2025-06-27，〈’Squid Game’ 3 Review: The Netflix Series Concludes〉。https://variety.com/2025/tv/reviews/squid-game-season-3-review-netflix-1236440570/ （read；含結局劇透）
     - 摘要：她認為 S3 遊戲結構重複、新角色少，不如前兩季震撼，但嬰兒出生後改變了最後幾關的賭注，奇勳以自我犧牲收尾，李政宰的表演撐起整個系列；結尾 Cate Blanchett 的洛杉磯場景為「西方版」鋪路。Metacritic 把這篇記為 80。
     - 原文：「much more of a continuation of the second season than a distinct entity」
4. **中文評論（台灣）**：關鍵評論網（藝文），傅紀鋼，2021-09-30，〈【韓劇】《魷魚遊戲》：「殺人遊戲」的東西方文化差異，融入通俗劇的情感調度堪稱完美〉。https://www.thenewslens.com/article/156927 （read (Exa cache)；評 S1，無雷）
   - 摘要：他把殺人遊戲類型分成美式（重遊戲機制、角色空白）和日式（福本伸行式，三分之一篇幅寫角色遊戲外的生活），認為黃東赫走日式路線，以《熔爐》式通俗劇調度讓遊戲前後的文戲不悶；001 號與 456 號的「剛布」情節是全劇最佳。瑕疵是李秉憲角色動機未交代、通俗劇結構讓結局好猜。（另有關鍵評論網 TNL+ 徐佑德評 S2〈動機和弧線雙雙陷入迷霧〉https://www.thenewslens.com/article/246984 、評 S3〈其實從未跑偏〉https://www.thenewslens.com/article/255151 ，都只看到 Exa 搜尋摘要，snippet，可能是 TNL+ 會員內容。）
5. **分歧**：**評論與觀眾都隨季數下滑，但觀眾掉得更兇。** Metacritic 69→62→67（S3 小回升）；東亞日報中文版 2025-06-30 引爛番茄：影評新鮮度 S1 95%、S2 83%、S3 83%，觀眾爆米花 84%→63%→51%（https://www.donga.com/cn/article/all/20250630/5693722/1 ，Exa 搜尋結果含全文，視為 read (Exa)）；同文轉述 Guardian「暴力场面连绵不绝，讽刺意味却日渐消退」、THR「令人失望的结局」與 TIME、Telegraph 正評。豆瓣 7.7→6.4→6.4。NYT S3 評論標題〈‘Squid Game’ Review: Game Over〉（2025-06-27，snippet），Observer 的 Barbara Ellen 說「Heavy-handed messaging and the laborious nihilism」（RT 摘要，snippet）。觀看數仍是 Netflix 非英語劇 #1–#3（ratings 檔）。Guardian 2025-06-23 專訪中李政宰說 S2、S3 連拍，無法依 S2 批評修改（Shaad D'Souza，snippet）。

## 2. Moving MOVING 異能（Disney+，2023）

1. **Metacritic S1**：沒有 Metascore（`/tv/moving/season-1/`、`moving-2023` 都 404；站內搜尋「moving」只有 Moving Wallpaper、Moving Up，read）。
2. **豆瓣**：**開分 8.1 → 漲到 8.9**（人數不明），毒眸（轉騰訊新聞）〈韩漫来袭：画得丑，但管用〉，2023-09-22。https://news.qq.com/rain/a/20230922A07TS000 （read (Exa cache)）。另：界面新聞轉娛樂資本論寫「从8.2一路涨到8.9」（snippet）。豆瓣 2023 年度榜「评分最高韩国剧集」第 3（腾讯新闻轉載，snippet）。
3. **英文評論**：The Hindu，S. Poorvaja，2023-10-01，〈‘Moving’ K-Drama review: A stunningly original, complex superhero saga with a terrific ensemble〉。https://www.thehindu.com/entertainment/movies/moving-k-drama-review-a-stunningly-original-complex-superhero-saga-with-a-terrific-ensemble/article67368804.ece （read；評全 20 集）
   - 摘要：她稱之為年度最佳韓劇：不只寫超能力，而是寫家庭、脆弱與被國家當棋子的人；兩韓掌權者才是真反派。柳承龍的父女線、韓孝周與趙寅成的過去線最動人；缺點是 20 集太長、暴力段落拖。
   - 原文：「this expansive superhero saga might as well be the most stunningly original show to come out this year」
4. **中文評論（台灣）**：釀電影，劉芷妤，2023-09-23，〈《異能》：獻給每一步都是降落的你〉。https://filmaholic.tw/series/650e6a43fd89780001b2b928/ （read：Groundlane 讀到前半〔我設的輸出上限截斷〕，後半由 Exa 搜尋結果的全文補齊）
   - 摘要：她認為美式英雄是「英雄也有人性」，《異能》則是「因為有人性而被迫成為英雄」；九龍浦與黃智熙一線是「不講武德」的催淚手法；兩代異能者透過家庭關係互相映照，連北韓與美方角色也只想「平凡地活下去」。（另有釀電影黃彥瑄〈敘事的超能力〉、報導者王子榮法律人追劇、風傳媒魏玓觀點，未讀，snippet。）
5. **分歧**：**大致一致**。RT 100%（9 則）、觀眾 97%（snippet）；IMDb 8.4、MDL 9.0、FUNdex 2023 劇集大賞（ratings 檔）。少數批評集中在節奏：Poorvaja 本人說 20 集太長；風傳媒魏玓說打鬥「太多太長」、自己無法二刷（snippet）；部落客 Kat Turner 抱怨第 8–15 集轉去父母線、孩子消失（snippet，非媒體）。Disney+ 方面稱是平台觀看時數最高的韓劇（關鍵評論網王祖鵬 2023-08-25，snippet）。

## 3. Weak Hero Class 1 / Class 2 弱美男英雄（Wavve 2022／Netflix 2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「weak hero」只有 Weakest Link 等，read）。
2. **豆瓣**：沒有可用來源。只找到一篇 2022 年轉載文說 D.P. 豆瓣 9.1，沒有弱美男英雄分數（morko.net，snippet，內容農場）；MK 中文 2026-03-13 寫 Class 1 在 Wavve「9.9」，那是 Wavve 不是豆瓣（snippet）。
3. **英文評論**：Decider，Johnny Loftus，2025-05-01，〈Stream It Or Skip It: ‘Weak Hero Class 2’ On Netflix, Where Si-Eun’s New High School Is Full Of The Same Old Bullying〉。https://decider.com/2025/05/01/weak-hero-class-2-netflix-review/ （read (Exa cache)；只評 Class 2 第 1 集；Groundlane 回 OUTPUT_LIMIT）
   - 摘要：他把 Class 2 的看點放在時恩更冷的姿態、由青少年自建的犯罪組織「聯盟」，以及大人全面缺席；內心獨白與突發暴力之間的張力是本劇調性。結論 STREAM IT。
   - 原文：「In this series, the bullies are monstrous. But they can’t stuff the power of self-confidence in a locker entirely.」
4. **中文評論（台灣）**：電影神搜，推坑人妻，2025-04-28，〈【劇評】《弱美男英雄：Class 2》：校園暴力不是轉個學就能逃避這麼簡單？結局竟埋第三季伏筆！〉。https://news.agentm.tw/356313/ （read；含劇透）
   - 摘要：她整理 Class 2 的設定（銀章高中、聯盟、那白真與朴厚敏的童年關係、背後黑道），說第二季打鬥更多、娛樂性更高、原著還原度高，但也轉述觀眾的疑問：以暴制暴是否只是代理滿足。結局秀浩甦醒、金成帝被黑幫招攬，替第三季鋪路。偏劇情整理，評論性較弱。（電影神搜另有 Class 1 劇評 https://news.agentm.tw/290771/ ，snippet。）
5. **分歧**：**Class 2 普遍被認為不如 Class 1**。MDL Class 1 9.1（132,323 人）vs Class 2 8.8；Netflix 2025 上半年兩季合計 42M views（ratings 檔）。英文評論：But Why Tho 的 Sarah Musnicky 說 Class 2「pulls its punches」、8 集撐不起擴張的角色群（2025-04-27，snippet）；Indian Express 的 Aditi Shivi 稱「manhwa misfire」、節奏倉促（snippet）；DramaRecs 指 MDL 分數 8.8 但文字評論平均 6.6（snippet，非媒體）。MK 中文報導 Class 2「評價略顯兩極」（snippet）。SCMP Conran 有 Class 2 評論（付費牆，snippet）。

## 4. Teach You a Lesson 鐵拳教育（Netflix，2026）

1. **Metacritic S1**：沒有 Metascore（搜尋「teach you a lesson」只有 A Teacher、Lessons in Chemistry 等，read）。
2. **豆瓣**：**8.7（超過 13.2 萬人；五星 52.3%、四星 35.7%）**，快科技（轉新浪科技）〈爆火韩剧《铁拳教育》豆瓣8.7分〉，2026-07-03。https://finance.sina.com.cn/tech/roll/2026-07-03/doc-inifpyys3529035.shtml （snippet：Exa 搜尋結果含大半內文，但沒有單獨 fetch）。開分也是 8.7（2.3 萬人時，虎嗅 2026-06-12，snippet）；風傳媒 2026-08-26 寫截至 8/26 仍 8.7（snippet）。全 10 集一次上架，所以不是播出中數字。
3. **英文評論**：The Hindu，S. Poorvaja，2026-06-27（6-30 更新），〈‘Teach You A Lesson’ K-Drama review: A terrific Kim Mu-yeol powers his way through revenge and reform〉。https://www.thehindu.com/entertainment/movies/teach-you-a-lesson-k-drama-review-a-terrific-kim-mu-yeol-powers-his-way-through-revenge-and-reform/article71152170.ece （read；評全季。注意：該文資訊欄寫 8 集，其他來源都說 10 集）
   - 摘要：她認為本劇是單元式的義警復仇劇，不只打霸凌者，也處理恐龍家長、誣告老師的網紅、逼兒子考醫學院的母親；方法「大致上是駭人的」，在韓國也因描寫體罰引發爭議，但寫作與金武烈「生涯最佳」的表演讓人相信這套幻想解方。
   - 原文：「this is the no-frills entertainment that has been missing from K-Dramas for a while now」
4. **中文評論（台灣）**：報導者（影評），許景雅，2026-07-04，〈為何我們渴望凌駕法律的正義英雄：《鐵拳教育》反映的韓國集體焦慮〉。https://www.twreporter.org/a/opinion-teach-you-a-lesson （read；含劇透）
   - 摘要：她把本劇放進《模範計程車》《熱血司祭》《犯罪都市》的「制度失靈─英雄登場─教訓壞人」公式，回溯江南站殺人、N 號房、教師自殺等事件累積的集體焦慮；認為羅華鎮的「反省要用身體」是應報式正義，鏡頭把男性身體與暴力奇觀化。結論：問題不在鼓吹暴力，而是把正義交給凌駕法律的強人後，誰來保證它永遠是我們期待的正義。
5. **分歧**：**觀眾熱度極高，爭議集中在原作與體罰**。Netflix 非英語劇歷來第 10（67.2M）、2026 上半年最高韓劇（48.2M）、IMDb 8.4、MDL 9.0（ratings 檔）。原作網漫《極權教師》曾因 N-word 與種族描寫被北美 Webtoon 下架（美麗佳人 TW、Vogue TW，snippet）；原定男主金南佶因爭議辭演（Vogue TW 2026-06-11，snippet）；韓國教總發表評論，既肯定寫實又擔心私刑（Vogue TW 轉述，snippet）。英文：Decider Joel Keller 首集 STREAM IT 但提醒是逃避主義（2026-06-05，snippet）；Loveispop 批後段結局荒謬（snippet，非媒體）。香港 Cinespot 7/10，嫌後段「虎頭蛇尾」、大反派草草收場（snippet）。

## 5. Study Group 流氓讀書會（TVING，2025）

1. **Metacritic S1**：沒有 Metascore（搜尋「study group」只有 Supergroup，read）。
2. **豆瓣**：沒有可用來源。只有豆瓣用戶長評標題寫「豆瓣8.7还在涨」（movie.douban.com/review/16496874/，2025-02-11，用戶文，不採用）。
3. **英文評論**：Jae-Ha Kim（個人網站，同文發在她的 Substack；她也為 Teen Vogue 寫年度榜），2025-02-28，〈“Study Group” (스터디그룹)〉，☆☆☆½。https://www.jaehakim.com/2025/02/study-group-kdrama-review/ （read；**不在指定媒體清單**——清單內的 NME、Decider、The Hindu、韓國三大英文報都沒找到署名評論；Korea Times 2025-02-26 那篇署名「KTimes」，偏新聞稿；SCMP 有 Conran 兩篇但付費牆）
   - 摘要：她從韓國補習班與修能文化切入，說本劇少見地讓主角自己想讀書、母親反而不逼；最喜歡的是嘉敏拉起被學校放棄的「可丟棄的青少年」，反派也有成因但不被開脫。
   - 原文：「It’s this kindness and desire to help his friends (and even foes) that makes Ga-min a true winner」
4. **中文評論（台灣）**：電影神搜，芮塔的看劇筆記本，2025-02-03，〈【劇評】《流氓讀書會》1-4集：韓劇版GTO？顛覆韓劇教育體制：「沒有人活該被放棄！」〉。https://news.agentm.tw/326852/ （read；只評第 1–4 集）
   - 摘要：她把本劇比作《麻辣教師GTO》《極道鮮師》，說韓劇教育題材多設在上流家庭（《SKY Castle》），本劇改設在職業高中，更有共感；黃旼炫的呆萌與武打反差合角色，特殊運鏡增添漫畫感，但暴力畫面多。
5. **分歧**：**評論與觀眾都偏好，主要爭議是暴力**。導演李章焄受訪時承認校園劇的暴力疑慮，說本劇刻意誇張、不做社會評論（Korea Herald 2025-01-23，Lee Yoon-seo，snippet）；TVING 連三週新增付費訂戶第 1、Viu 東南亞多國第 1（Korea Times 2025-02-26，snippet）；MDL 8.8（ratings 檔）。The Fangirl Verdict 說後半更暴力、不如前半溫暖（snippet，非媒體）；Fkan 轉載的豆瓣用戶長評說 9–10 集「滑坡」（snippet）。

## 6. A Shop for Killers 殺人者的購物中心（Disney+，2024）

1. **Metacritic S1**：沒有 Metascore（`/tv/a-shop-for-killers/` 404；搜尋「shop for killers」沒有本劇，read）。
2. **豆瓣**：**7.3**（人數不明），TVBS 女人我最大〈2024韓劇推薦豆瓣評分TOP10〉，2024-05-13。https://woman.tvbs.com.tw/entertainment/49146 （snippet）。一篇豆瓣用戶長評也寫 7.3（不採用）。第 2 季（2026）另有 7.7／8.2 等數字（Beauty321、超小厨，snippet），與 S1 無關。
3. **英文評論**：NME，Puah Ziwei，2024-01-17，〈‘A Shop for Killers’ review: plot holes don’t detract from this gripping thriller〉。https://www.nme.com/reviews/tv-reviews/a-shop-for-killers-review-plot-holes-gripping-thriller-3572796 （read；只評前 2 集）
   - 摘要：她說開場就把命案、嫌疑人、線索、局外主角都放好，但前兩集有明顯邏輯洞（叔姪沒改名、智安從不懷疑叔叔的槍和防彈衣）；李棟旭、金惠埈把緊湊劇本撐起來，沒有一分鐘是填充。
   - 原文：「makes for a fun and appealing popcorn watch, one that fires all the right synapses in your brain」
4. **中文評論（台灣）**：電影神搜，潘光中，2024-02-15，〈【完結劇評】《殺人者的購物中心》第一季：諸多謎團未解？進灣與智安的叔姪冒險還得繼續〉。https://news.agentm.tw/286604/ （read）
   - 摘要：他認為串流平台讓這種過去不會在無線台播出的類型有機會；介紹姜智英原著與韓國現實中幾乎不可能存在的 PMC「巴比倫」、波士頓動力機器狗，指出男主第一集就「領便當」的騷操作，以及第一季留下太多未解謎團。偏背景解析。（聯合報〈娛樂有評〉雀雀 2024-02-24〈動作戲與異國情調有看頭〉https://stars.udn.com/star/story/10093/7787923 ，Exa 搜尋結果含全文，未單獨 fetch。）
5. **分歧**：**評論對敘事結構分歧**。SCMP Conran 完結評說「marred by a muddled storyline」（2024-02-11，snippet）；But Why Tho 說第 7 集重走舊路（7.5/10，snippet）；Gulf News 2025 回顧稱「criminally underrated」（snippet）。IMDb 8.0、MDL 8.7、FUNdex 2024 OTT 原創劇入圍（ratings 檔）；鏡週刊 2026-08-13 說第一季入選 NYT 年度國際劇集（snippet，未查證 NYT 原文）。

## 7. Bloodhounds 獵犬（Netflix，2023）

1. **Metacritic S1**：沒有 Metascore（`/tv/bloodhounds/` 404；搜尋「bloodhounds」沒有結果，read）。
2. **豆瓣**：沒有可用來源。百度搜尋結果顯示豆瓣頁「6.8，7245 人」（snippet，是搜尋引擎抓的豆瓣頁，不是新聞，不採用）。第 2 季（2026）7.7（Beauty321，snippet）。
3. **英文評論**：NME，Hidzir Junaini，2023-06-08，〈‘Bloodhounds’ review: turn off your brain and enjoy the thrilling action scenes〉（搜尋結果標題為「sit back and enjoy…」，頁面現在的標題是這個）。https://www.nme.com/reviews/tv-reviews/bloodhounds-review-kdrama-3452955 （read；評全 8 集）
   - 摘要：他說最大優點是動作設計，像《原罪犯》加 Netflix《夜魔俠》，寫實且主角會受傷；但故事肉太少，「轉折」老早被猜到，演員也沒什麼戲可演。不是看情感或社會評論的劇，就是動作驚悚片。
   - 原文：「this K-drama might have been better served as a more compact two-hour film」
4. **中文評論（台灣）**：電影神搜，黃小惠，2023-06-15，〈【劇評】Netflix《獵犬》：禹棹奐、李相二近身肉搏對抗惡勢力，後半劇情稍嫌可惜〉。https://news.agentm.tw/289078/ （read (Exa 搜尋全文)：Exa 搜尋結果包含全文，未另行 fetch）
   - 摘要：她肯定兩位男主為角色健身、拳拳到肉的打戲與兄弟情，崔始源的富三代反差也演得好；但因金賽綸酒駕，導演停拍一個月改寫結尾，讓女主遠走、加入新角色，最後兩集和前六集氛圍銜接不上，是全劇最可惜處；崔社長的過去也沒交代。（聯合報〈娛樂有評〉雀雀 2023-06-24〈馬東石接班人〉https://stars.udn.com/star/story/10093/7255604 ，snippet。）
5. **分歧**：**好看的動作 vs 被迫改寫的結局**。英文評論多認為動作一流、故事單薄（NME、The Hindu Pallavi Keswani「moral simplification」、Ready Steady Cut 說「much too long」，後兩者 snippet）。女主金賽綸 2022 年酒駕，戲份被刪、最後兩集換角（電影神搜 read；AVForums、雀雀 snippet）。觀眾端：Netflix 非英語劇上線三天全球第 2（雀雀，snippet）、IMDb 8.2、MDL 8.7（ratings 檔）；豆瓣搜尋結果僅 6.8（未採用）。

## 8. The Uncanny Counter 驅魔麵館（OCN，2020–21；S2 2023）

1. **Metacritic S1**：沒有 Metascore（`/tv/the-uncanny-counter/` 404；搜尋「uncanny counter」只有 Counterpart，read）。
2. **豆瓣**：沒有可用來源（Exa 搜尋未找到引述豆瓣分數的新聞）。
3. **英文評論**：Decider，Joel Keller，2020-12-09，〈Stream It Or Skip It: ‘The Uncanny Counter’ On Netflix, A Korean Series Where Four Noodle Shop Employees Fight Evil Spirits〉。https://decider.com/2020/12/09/the-uncanny-counter-netflix-review/ （read (Exa cache)；只評第 1 集；Groundlane 回 OUTPUT_LIMIT）
   - 摘要：他說這是穿紅色運動服、在麵店上班的《X 戰警》／《Heroes》；首集動作場面做得好，但結尾解釋設定處拖，其他 Counter 的背景還沒展開；對看膩愛情公式的觀眾是清新選擇。結論 STREAM IT。
   - 原文：「a fine, light sci-fi series that will help you take your mind off heavier dramas」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），芮塔，2021-01-30，〈芮塔／《驅魔麵館》小兵立大功！兼具驅魔、刑偵推理的娛樂片〉。https://stars.udn.com/star/story/10093/5217967 （read；評全 16 集）
   - 摘要：她說沒有大卡司、首集收視 2%，第 12 集衝到 10%，創 OCN 紀錄；劇中「人比惡鬼可怕」的主題、家人羈絆最動人。也列出爭議：原編劇呂芝娜在第 12 集後退出，13 集起由導演和金新春接手，觀眾嫌後段荒謬、末集業配多；她個人認為「該收的都有收」，當娛樂爽片看就好。
5. **分歧**：**收視創紀錄 vs 後段換編劇被批爛尾**。最高收視 10.999%（ratings 檔）、OCN 史上最高；IMDb 8.0、MDL 8.8（ratings 檔）。Seoulbeats〈Ep. 7-16: When a Commercial Hit Becomes a Critical Miss〉（2021-01-31，snippet）、聯合報 500 輯田育志把它和《梨泰院 Class》並列為「黑馬變落馬」（2021-02-25，snippet）；SCMP Conran 3.5/5，「late-season lull」（snippet）。Decider 只看了首集，無法反映後段問題。

## 9. Kingdom 屍戰朝鮮（Netflix，2019–20）

1. **Metacritic S1**：沒有 Metascore（`/tv/kingdom-2019/season-1/` 404；`/tv/kingdom/` 轉到美國 MMA 劇 `kingdom-2014`；`kingdom-2025` 是 BBC 自然紀錄片；站內搜尋「kingdom」列出的都不是本劇，read）。
2. **豆瓣**：**S1 8.6（14 萬人）、S2 8.4（10 萬人）**，數位時代（轉 PingWest）〈《李屍朝鮮》改名《屍戰朝鮮》，劇中這些典故你都看懂了嗎？〉，2020-03-31。https://www.bnext.com.tw/article/57134/netflix-kingdom （read (Exa cache)）。S2 是播出一個多月時的數字。
3. **英文評論**：Vulture／New York，Matt Zoller Seitz，2019-03-15（3-18 紙本），〈Zombie Epic Kingdom Is Remarkable and Resonant〉。https://www.vulture.com/2019/03/kingdom-tv-review.html （read；評 S1）
   - 摘要：他說多數喪屍故事只寫小團體的道德抉擇，本劇罕見地全景呈現社會崩解，像骨牌秀；美學更接近布紐爾、芬奇的諷刺驚悚，不是單純血肉恐怖。「燒平民、埋貴族」、只載貴族的船等場面，讓它成為一則關於腐敗與階級的寓言。
   - 原文：「a parable about a society with a death wish that allows rot to spread a bit further every day」
4. **中文評論（台灣）**：鳴人堂（社會文化），林運鴻，2020-04-21，〈喪屍版農奴革命？向貴族與禮教宣戰的《屍戰朝鮮》〉。https://opinion.udn.com/opinion/story/120617/4505734 （read：Groundlane 讀到前四節〔我設的輸出上限截斷〕，結尾一節由 Exa 搜尋結果全文補齊；評 S1–S2）
   - 摘要：他把喪屍讀成貴族視角下「被飢餓驅動的農民起義」，國王吸血式統治才是瘟疫源頭；李蒼、趙學柱、武英各自被封建身分綁住。S2 末李蒼讓平民血脈的「弟弟」繼位，他讀作一場東亞未曾發生的平民革命寓言。
5. **分歧**：**幾乎沒有分歧**。RT S1 94%（17 則）、觀眾 96%（snippet）；IMDb 8.3、MDL S2 8.9／S1 8.8（ratings 檔）；豆瓣 8.6／8.4。少數保留：Decider Keller（2019-01-25，snippet）與 TellTale TV 說 S1 結尾設定多、收束少；台灣部落客「拾光」說 S1 進展太慢（snippet，非媒體）。沒有 S3 是唯一的觀眾抱怨（2021《雅信傳》是特別篇）。

## 10. Death's Game 死期將至（TVING／Prime Video，2023–24）

1. **Metacritic S1**：沒有 Metascore（搜尋「death's game」只有 Love Death + Robots 等，read）。
2. **豆瓣**：**8.4**（人數不明），NOWnews〈名家論壇〉柯志遠〈《死期將至》向死而生的暗黑啟示錄〉，2024-01-20。https://www.nownews.com/news/6349921 （read (Exa cache)；評論專欄，不是新聞報導，數字是作者引述）。豆瓣 2023 年度「评分最高韩国剧集」第 9（腾讯新闻轉載，snippet）。
3. **英文評論**：India Today，Bhavna Agarwal，2024-01-05，〈Death's Game Review: Seo In-guk's reincarnation drama is emotional and thrilling〉。https://www.indiatoday.in/entertainment/television/story/deaths-game-review-seo-in-guk-park-so-dam-star-in-a-fantastic-fantasy-kdrama-2484919-2024-01-05 （read；評全 8 集；**不在指定媒體清單**——NME 只有預告新聞、The Hindu 只有上架清單、Korea JoongAng Daily 只有徐仁國訪談，Decider 沒找到；SCMP Conran Part 2 評論付費牆）
   - 摘要：她說群星輪番演出 12 次轉生是最大強項，朴素丹的死神冷而帶黑色幽默，VFX 與節奏少有冷場；但全劇談自殺時只強調「選擇活下去」，不處理把人逼到絕境的社會壓力，結尾近乎說教。
   - 原文：「the show appears somewhat harsh towards those who opt to end their lives」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雀雀，2024-01-27，〈雀雀／韓劇「死期將至」展示年度最強求生欲！〉。https://stars.udn.com/star/story/10093/7736057 （read）
   - 摘要：她說八集像八部類型不同、風格一致的電影；本劇不像其他韓劇讓厭世角色被拯救或復仇，而是用後設觀點讓主角看見自己的死亡對親友的蝴蝶效應，最後遺書隨風飄走，有「用十二輩子換平庸一生」的寓言與禪意；十二段人生最終都指向一個財閥惡人，是韓國人對吸金富人的控訴。（另：關鍵評論網 2024-01-09 一篇是部落客 Wayne 的精選轉載、以劇情整理為主，read (Exa cache) 但不當主評；電影神搜有兩篇劇評，snippet；Vogue TW Inna Chou 評論，snippet，生活風格媒體。）
5. **分歧**：**娛樂性一致叫好 vs 自殺議題處理爭議**。IMDb 8.4、MDL Part 1／2 都 8.8（ratings 檔）、豆瓣 8.4。批評集中在結局「鸡汤」與審判自殺者：India Today（read）、澎湃有戲 2024-01-11（「搞得韩国也有个广电总局在审片似的」，snippet）、hallyureviews「victim-blaming」（snippet，非媒體）。SCMP Conran Part 2 標題「just don’t think too much about the story」（snippet）。

## 11. D.P. D.P：逃兵追緝令（Netflix，2021／2023）

1. **Metacritic S1**：沒有 Metascore（`/tv/dp/season-1/` 404；搜尋「d.p.」只有 Chicago P.D. 等，read）。
2. **豆瓣**：**S1 9.1；S2 開分 8.7、文章發布時 8.6**（人數不明），万达电影生活（騰訊新聞，撰稿人 C 酱）〈终于等到这部「年度敢拍」〉，2023-08-07。https://view.inews.qq.com/a/20230807A02W4Y00 （read (Exa cache)；影城官方號文章，不是新聞社）。S2 後來 8.5（風傳媒 2026-01-27、腾讯 2023-09-18 轉載文，snippet）。
3. **英文評論**：NME，Hidzir Junaini，2021-08-27，〈‘D.P.’ review: military police procedural sheds disturbing light on bullying in the South Korean army〉。https://www.nme.com/reviews/tv-reviews/dp-k-drama-review-jung-haein-kim-sung-kyun-3030699 （read；評 S1 全 6 集）
   - 摘要：他說安俊浩與韓浩烈的「搭檔警探」默契是最迷人處，讓沉重題材有喘息；每集逃兵的故事揭露前輩霸凌與高層掩蓋，處理得有同理心。缺點：三位主角背景太薄，結尾突然升級成綁架、特種部隊的通俗動作劇。
   - 原文：「these fictional depictions of hazing are sadly far from exaggerated」
4. **中文評論（台灣）**：轉角國際（文化視角），吳文哲，2021-10-15，〈軍中虐死或殺人？南韓「真男人」背後的部隊霸凌地獄〉。https://global.udn.com/global_vision/story/8664/5818610 （read；結尾一段因輸出上限截斷，前段已讀到結論句的大部分；**議題分析文，不是傳統劇評**）
   - 摘要：他以本劇為引，整理 2021 年後備軍人問卷（7 成目擊霸凌、近 6 成被霸凌）、被視為原型的尹一兵與林兵長事件、國防部「已大幅改善」的回應與之後的海軍、空軍自殺案，引編劇金普通：「現在已經好很多了」不應被歸結為「這樣就夠了」。指出「旁觀」才是陋習延續的主因。（沒有在釀電影、鳴人堂、關鍵評論網找到署名劇評；GQ TW Amber Chan／溫蒂穿著紅白拖 2021-09-03 有一篇，snippet，生活風格媒體；CTWANT 菜記士多評 S2，snippet。）
5. **分歧**：**S1 幾乎一致叫好，S2 評價下降但沒崩**。豆瓣 9.1→8.6／8.5；IMDb 8.2、MDL 8.7（ratings 檔）。S2：NME Junaini 說「avoids a sophomore slump」（2023-08-02，snippet）、Decider Loftus STREAM IT（snippet）；澎湃有戲 2023-08-04 批 S2 靠 USB、法庭最後一刻翻盤，落入「爽剧的幼稚病」（snippet）；台灣部落客也說 S2「口碑不如第一季」（vocus，snippet）。韓國國防部稱劇中環境已是過去式、D.P. 組 2022 年廢除（轉角國際 read）。韓國專欄作家위근우批評本劇容易被當成男性自憐的燃料（京鄉新聞 2021-09-10，snippet）。Vulture 2024 Geoffrey Bunting〈Netflix K-Drama ‘D.P.’ Had Bad Timing〉說本劇被《魷魚遊戲》同期蓋過（snippet）。

---

## 總表

| # | 劇名 | Metacritic | 豆瓣（媒體引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | 魷魚遊戲 | **S1 69（13）／S2 62（36）／S3 67（26）** | S1 7.7、S2 開 6.7→6.4、S3 6.4（快科技 read；其餘 snippet） | Polygon／LeGardye（S1）＋Variety／Tinubu（S3） | read／read | 關鍵評論網／傅紀鋼（S1） | read (Exa) | 季數下滑；RT 觀眾 84→63→51% |
| 2 | MOVING 異能 | 無 | 8.1→8.9（毒眸） | The Hindu／Poorvaja | read | 釀電影／劉芷妤 | read（拼讀） | 大致一致；20 集太長 |
| 3 | 弱美男英雄 C1/C2 | 無 | 無可用 | Decider／Loftus（C2） | read（ep1） | 電影神搜／推坑人妻（C2） | read | C2 不如 C1；MDL 9.1→8.8 |
| 4 | 鐵拳教育 | 無 | 8.7（13.2 萬人，快科技） | The Hindu／Poorvaja | read | 報導者／許景雅 | read | 爆紅 vs 原作種族爭議、體罰／私刑 |
| 5 | 流氓讀書會 | 無 | 無可用 | Jae-Ha Kim 個人站（不在清單） | read | 電影神搜／芮塔 | read（ep1–4） | 暴力尺度；後段滑坡（用戶） |
| 6 | 殺人者的購物中心 | 無 | 7.3（TVBS，snippet） | NME／Puah Ziwei | read（ep1–2） | 電影神搜／潘光中 | read | 結構混亂（SCMP）vs 被低估 |
| 7 | 獵犬 | 無 | 無可用 | NME／Junaini | read | 電影神搜／黃小惠 | read (Exa) | 動作好 vs 女主酒駕、結尾改寫 |
| 8 | 驅魔麵館 | 無 | 無可用 | Decider／Keller | read（ep1） | 聯合報〈娛樂有評〉／芮塔 | read | OCN 收視紀錄 vs 換編劇爛尾 |
| 9 | 屍戰朝鮮 | 無 | S1 8.6（14 萬）、S2 8.4（10 萬）（數位時代） | Vulture／Matt Zoller Seitz | read | 鳴人堂／林運鴻 | read（拼讀） | 幾乎無 |
| 10 | 死期將至 | 無 | 8.4（NOWnews 專欄） | India Today／Agarwal（不在清單） | read | 聯合報〈娛樂有評〉／雀雀 | read | 自殺議題處理、結局說教 |
| 11 | D.P. | 無 | S1 9.1、S2 8.7→8.6（万达电影生活） | NME／Junaini（S1） | read | 轉角國際／吳文哲（議題文） | read | S2 較弱；國防部回應 |

「無可用」= 搜過但只有用戶長評、搜尋引擎抓的豆瓣頁或非豆瓣平台分數。

## 缺口

1. **Metacritic**：只有《魷魚遊戲》有頁面，且 S1 只有 13 則評論，比 S2（36）、S3（26）少——S1 的 69 是「上線時沒人預期會爆紅」的樣本，不宜直接和 S2/S3 比。其他 10 部這個欄位沒有用。
2. **豆瓣**：7 部有媒體引述，但來源參差：快科技、蓝鲸、羊城派屬新聞；毒眸、万达电影生活屬自媒體／企業號；NOWnews 是專欄；TVBS 女人我最大與《鐵拳教育》快科技那篇只有 snippet。《魷魚遊戲》S2 6.7→6.4 都是 snippet。弱美男英雄、流氓讀書會、獵犬、驅魔麵館沒有可用新聞引述。
3. **英文大媒體覆蓋**：除了《魷魚遊戲》與《屍戰朝鮮》，NYT、Guardian、Variety、THR 幾乎沒有單篇評論；能用的主要是 NME、The Hindu、Decider（Decider 只評首集）。**只評前幾集的**：弱美男英雄（Decider ep1）、殺人者的購物中心（NME ep1–2）、驅魔麵館（Decider ep1）——驅魔麵館後段換編劇的問題因此不在主評論中。
4. **不在指定清單的英文評論**：流氓讀書會（Jae-Ha Kim 個人站／Substack）、死期將至（India Today）。若正文要引，優先 Polygon、Variety、Vulture、NME、The Hindu 這幾篇。
5. **台灣中文評論**：電影神搜占 4 部，多為粉絲／編輯型、偏劇情整理（弱美男英雄、殺人者的購物中心尤其明顯）。有評論深度的是報導者（鐵拳教育）、鳴人堂（屍戰朝鮮）、釀電影（異能）、關鍵評論網傅紀鋼（魷魚遊戲）。D.P. 用的是轉角國際議題文，**沒有在指定清單中找到傳統劇評**。《流氓讀書會》台灣評論只評前 4 集。
6. **魷魚遊戲 S2／S3 的台灣評論**（關鍵評論網徐佑德兩篇）只看到 snippet，疑似 TNL+ 會員內容，沒讀。
7. 「分歧」欄裡的 SCMP、Seoulbeats、澎湃、But Why Tho、Indian Express、Vogue TW、Korea Herald、Korea Times、NYT S3 等多是 **snippet**，正文引用前要再讀原文。東亞日報（RT 數字）與轉角國際有讀到內文。
8. 《鐵拳教育》集數：The Hindu 資訊欄寫 8 集，其他多數來源（Marie Claire TW、快科技、Jae-Ha Kim Substack 摘要）寫 10 集；以 10 集為準前要查 Netflix 頁。

## toolDegradation

- **Groundlane MCP**（`web_extract`／`web_fetch`／`web_search`）為主：Metacritic 3 個季頁＋10 次站內搜尋＋7 個 slug 測試、Polygon、Variety、Vulture、The Hindu ×2、NME ×3、India Today、Jae-Ha Kim、釀電影、鳴人堂、報導者、轉角國際、電影神搜 ×3、聯合報 ×2 都讀到。失敗：Decider 兩篇回 OUTPUT_LIMIT。釀電影、鳴人堂、轉角國際是我設的 `maxOutputChars` 截斷，前兩篇以 Exa 搜尋結果的全文補齊。Groundlane 搜尋內部的 tavily／exa／brave provider 偶有 unavailable，由 brave／you 補上。
- **Exa**：`web_search_exa` 用來找英文評論、台灣評論與豆瓣新聞（摘要很長，部分直接含全文，這些已逐條標註）；`web_fetch_exa` 讀關鍵評論網 2 篇、Decider 2 篇、新浪、騰訊 ×2、數位時代、NOWnews 成功。沒有抓豆瓣 subject 頁。
- **jina `read_url`**：未使用。**Tavily**：未使用（已知限流）。**Firecrawl**：額度用完，未使用。**Groundlane 直接 HTTP／Keenable／You.com keyless**：未需要。
