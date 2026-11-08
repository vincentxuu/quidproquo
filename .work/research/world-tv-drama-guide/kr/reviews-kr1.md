# KR1 評價資料表：韓劇｜愛情、穿越與奇幻浪漫 18 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-08。片單來自 `post-kr1-shows.txt`。IMDb／MDL／韓國收視數字沿用 `candidates-ratings-viewing-buzz.md`（該檔已標 read），這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic S1 | 先試 `metacritic.com/tv/<slug>/season-1/`（crash-landing-on-you、queen-of-tears、love-in-the-big-city 都回 Page Not Found），再用 Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查 | Groundlane `web_extract`（render=never，抓 `/tv/` 連結） | 18/18 read：**18 部都沒有 Metacritic 頁面** |
| 豆瓣 | 只採用新聞文章引述的分數。subject 頁：Exa `web_fetch_exa` 對 `movie.douban.com/subject/36117731/` 回 CRAWL_HTTP_403、`m.douban.com` 回 timeout；沒有繞過 sec.douban.com | Exa search／fetch、Groundlane fetch | 3 部有新聞引述；其餘沒有可用來源 |
| 英文評論 | 署名評論，讀全文或大半 | Groundlane `web_fetch` 為主；Decider 2521 用 jina `read_url`（Groundlane OUTPUT_LIMIT） | 17 read（其中 6 篇只評前幾集）、1 partial（哲仁王后） |
| 台灣中文評論 | 釀電影、關鍵評論網、鳴人堂、電影神搜等 | Groundlane `web_fetch`；關鍵評論網用 Exa `web_fetch_exa`（Groundlane 遇 browser challenge） | 16 read、2 partial |

標記說明：**read** = 工具讀到頁面內文（若輸出在最後一節被截斷會註明）；**read (Exa cache)** = Exa 快取副本；**partial** = 只讀到前段或一半；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：Decider 3（暴君的廚師、二十五二十一、海岸村）、NME 3（閃亮的西瓜、三達里、王之國）、The Hindu 3（浪漫速成班、我的完美秘書、我們的浪漫電影）、TIME 2（淚之女王、背著善宰跑）；Guardian、Korea Herald、/Film、Collider、The Gay & Lesbian Review、Gulf News、Mashable Middle East 各 1。
> 
> SCMP 的 Pierce Conran 幾乎每部都有完整評論，但 SCMP 有付費牆：Groundlane 只讀到標題、副標和第一段，Exa 也一樣。所以 SCMP 只在「分歧」欄當 snippet 引用，不當主評論。
>
> 台灣中文評論：電影神搜（news.agentm.tw）占 11 部。其中署名「臺灣歐妮」的文章原本發在姊妹站「歐搜哇」（ohsowow.agentm.tw），後來搬到電影神搜，所以搜尋結果的日期（多半顯示 2025-03／04）是搬站時間；這裡寫的是頁面 `publishedAt` 的原始日期。作者多是筆名（臺灣歐妮、夜間看劇筆記、芮塔的看劇筆記本、JC酒依絲、Winnie），屬於粉絲型劇評，深度不如釀電影或鳴人堂。18 篇都沒有「合作／贊助」標記。

---

## 1. Bon Appétit, Your Majesty 暴君的廚師（tvN，2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「your majesty」沒有這部，read）。
2. **豆瓣**：沒有可用來源。Exa 搜尋只找到一篇豆瓣用戶長評說開播時「豆瓣目前评分7.1」（https://movie.douban.com/review/17040888/ ，2025-09-04，不是新聞）和一個盜版站寫「6.7/10 from 859 users」（不採用）。
3. **英文評論**：Decider，Joel Keller，2025-08-25，〈Stream It Or Skip It: 'Bon Appétit, Your Majesty' On Netflix, Where A Modern-Day Chef Travels Back To The Joseon Dynasty To Cook For A Tyrant〉。https://decider.com/2025/08/25/bon-appetit-your-majesty-netflix-review/ （read；只評第 1 集）
   - 摘要：把它比作「有美食的《古戰場傳奇》」；第一集就把相遇、衝突、被迫綁在一起的元素都放好了，每集以一道菜命名是聰明的結構。擔心「現代人驚嘆古代沒有超市」的笑點會用膩。結論 STREAM IT。
   - 原文：「doubles down on interesting K-drama wrinkles, couching the romcom structure around both time-travel and cooking」
4. **中文評論（台灣）**：關鍵評論網（TNL+ 影劇／隨點隨看串流+），胡芩，2025-09-09，〈【劇評】Netflix《暴君的廚師》：從米其林到御膳房，現代職人如何在歷史中反擊？〉。https://www.thenewslens.com/article/258385 （partial (Exa cache)：讀到前兩節，「舌尖上的權力轉喻」之後沒讀到，可能是 TNL+ 會員內容；Groundlane 遇 browser challenge）
   - 摘要：她認為穿越只是包裝，重點是專業倫理在極權體制下的「功能性崩解」：現代主廚的料理原本是表達與身分認同，到了御膳房變成服從與求生的語言；延志永的冷靜是職場歷練，不是主角光環。她把這部讀成女性專業者在父權體制下的處境。
5. **分歧**：收視與串流都爆（韓國有線 17.107%、Netflix 2025 下半年 38M views，ratings 檔），但評論與觀眾口碑比較分裂。英文部落格／書評型評論多半說後段拖、結局太趕（The Review Geek、K-Drama Fans substack，Exa 搜尋結果摘要，**snippet**）；Jae-Ha Kim（substack，2025-12-21，snippet）提醒男主原型燕山君是真實暴君，劇把他浪漫化。豆瓣開播約 7.1（用戶長評引述，不是新聞，僅供參考）。

## 2. Lovely Runner 背著善宰跑（tvN，2024）

1. **Metacritic S1**：沒有 Metascore（搜尋「lovely runner」只有 Blade Runner 等，read）。
2. **豆瓣**：**9.0**（人數不明），TVBS〈韓劇豆瓣評分TOP10！《淚之女王》僅第10〉，鄭維寧、曾郁淇，2024-05-14。https://news.tvbs.com.tw/entertainment/jk-pop/2485090 （read）。注意：這是播出中（完結在 2024-05-28）的數字。
3. **英文評論**：TIME，Kayti Burt，2024-05-31，〈How Lovely Runner Nailed Its Finale to Become the Year's Best K-Drama (So Far)〉。https://time.com/6983798/lovely-runner-ending-explained/ （read；評全劇與結局；最後一節「Do Sol and Sun-jae have a happy ending?」輸出被截斷）
   - 摘要：她認為這部把懷舊、愛情、殺人犯支線和反覆穿越的情緒折磨，混成「大於套路總和」的作品；第 2 集揭露男主早就暗戀女主，把「粉絲救偶像」改寫成兩人被命運綁住的故事。她拿它和同年收尾失敗的《淚之女王》對照。
   - 原文：「sticking its landing by prioritizing heart over plot mechanics」
4. **中文評論（台灣）**：關鍵評論網（轉載自歐搜哇），文：芮塔的看劇筆記本，2024-05-05，〈【劇評】《背著善宰跑》首播分析：CP邊佑錫、金惠奫讓人發出姨母笑，但輕生等嚴肅議題該怎麼解？〉。https://www.thenewslens.com/article/201685 （read (Exa cache)；只評第 1–2 集）
   - 摘要：原以為是無腦追星劇，第 2 集結尾的雙向暗戀反轉很驚喜；劇中碰觸偶像輕生、身障者被歧視等議題，作者連到現實中韓星輕生事件，認為反映韓流光鮮背後的黑暗；2008 年的掀蓋手機、Cyworld 細節有「請回答」系列的懷舊感。（另有電影神搜〈【期中劇評】《背著善宰跑》…真正韓版《想見你》來了〉https://news.agentm.tw/286027/ ，snippet，未讀）
5. **分歧**：**韓國電視收視低、網路熱度與國際口碑極高**。全國收視最高只有完結篇 5.8%（Korea Times 專訪 2024-06-03 摘要，snippet；Vogue TW 2024-05-29 摘要也寫全國平均 5.8%，snippet），但 FUNdex 2024 完結劇話題度第 1、MDL 8.9（113,035 人）、IMDb 8.5（ratings 檔）、豆瓣 9.0、TIME 稱年度最佳（Kayti Burt 的 TIME 2024 韓劇榜 #1，awards 檔）。國際串流是較小眾的 Viki，不是 Netflix，Jae-Ha Kim 認為因此被英文媒體低估（substack 2024-07-20，snippet）。

## 3. Twenty-Five Twenty-One 二十五，二十一（tvN，2022）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：結局後從 **9.1 跌到 8.2**（人數不明）。澎湃新聞‧澎湃號（原創：看理想編輯部），2022-04-09，〈从豆瓣9.1降到8.2，因为他们没有在一起〉。https://www.thepaper.cn/newsDetail_forward_17536603 （partial：Exa 搜尋結果的長摘要，未完整 fetch）。同一數字也見虎嗅轉載《新周刊》林辣，2022-04-06，〈从9.1跌回8.2，火到烂尾？〉https://m.huxiu.com/article/522783.html （partial，Exa 摘要）。百度摘要寫「8.2 125761人评价」（snippet，不採用）。
3. **英文評論**：Decider，Joel Keller，2022-02-15，〈Stream It Or Skip It: 'Twenty-Five Twenty-One' On Netflix, Where A Teen Makes Her Fencing Dreams Happen And Falls For An Older Guy〉。https://decider.com/2022/02/15/twenty-five-twenty-one-netflix-review/ （read，jina 讀全文；只評第 1 集）
   - 摘要：他覺得這部的甜味和一般韓式愛情劇不同，真正的愛情故事是女主和擊劍；最想看的是女主與冷漠母親的關係，並稱讚金泰梨的肢體喜劇。結論 STREAM IT。
   - 原文：「defies most of the clichés we see in romantic K-dramas and sets up a series with an expansive but very intimate storyline」
4. **中文評論（台灣）**：鳴人堂，阿潑，2022-05-11，〈即使全力以赴，一切都只是練習：《二十五，二十一》的新聞記者成長痛〉。https://opinion.udn.com/opinion/story/5754/6304138 （read；最後一節輸出截斷）
   - 摘要：作者承認很多人批評結局破壞前面的精彩，但她「認可這種殘酷」，認為那才是真實人生。她從自己當過新聞系學生的經驗，讀白易辰的「記者成長之路」與羅希度的「擊劍競技之路」如何互相對話：從 B.B.CALL 搶公用電話、要不要報朋友的獨家，到 911 現場讓他決定當紐約特派員。（另有釀電影〈《二十五，二十一》：我們之所以是我們…〉https://filmaholic.tw/series/627be2ccfd8978000146c1cc/ ，snippet，未讀）
5. **分歧**：**結局爭議是全表最明確的一部**。前 15 集口碑極高，第 16 集男女主分手，豆瓣一夜從 9.1 掉到 8.2，不少人改打一星（澎湃、虎嗅，partial）。TIME 的 Geoffrey Bunting 在《淚之女王》結局評論裡反過來說 2521 是「a rare series that did stick the landing with an unconventional ending, only to be review-bombed for the trouble」（https://time.com/6972568/queen-of-tears-finale-netflix/ ，read）。SCMP Pierce Conran 的標題寫「makes up for climactic misstep」、4/5（https://www.scmp.com/lifestyle/k-pop/k-drama/article/3173193/ ，只讀到標題與第一段，partial）。MDL 8.8、IMDb 8.5（ratings 檔）。

## 4. Queen of Tears 淚之女王（tvN，2024）

1. **Metacritic S1**：沒有 Metascore（`/tv/queen-of-tears/season-1/` 404；站內搜尋無，read）。
2. **豆瓣**：**7.2**（超過 6 萬人），每日經濟新聞，2024-04-30。https://www.nbd.com.cn/articles/2024-04-30/3373406.html （partial：Exa 搜尋摘要內的新聞內文）。TVBS 2024-05-14 寫 **7.1**（read，同第 2 部的 TVBS 文）。百度摘要寫開分 7.6、年底 6.9（snippet，不採用）。
3. **英文評論**：TIME，Geoffrey Bunting，2024-04-30，〈Queen of Tears Is Yet Another K-Drama That Doesn't Stick the Landing〉（URL slug 標題為 Finale Fails to Stick the Landing）。https://time.com/6972568/queen-of-tears-finale-netflix/ （read；評全劇與結局）
   - 摘要：他說這是「兩半」的劇：前半是創新的韓式婚姻愛情，後半在孤兒院身世、謀殺陰謀等巧合裡失控；一旦腦瘤被「奇蹟手術」解決，後面三小時就失去賭注，車禍、綁架、槍擊都只是走流程，最後連字卡都寫「Happy Ending」。他認為原本可以是很好的 10 集劇。同一作者 2024-03-29 寫過期中分析，給前半很高評價（Wayback 版，partial）。
   - 原文：「in fixing Hae-in’s brain, Queen of Tears loses its heart」
4. **中文評論（台灣）**：電影神搜（原刊歐搜哇），臺灣歐妮，2024-04-30，〈【完結劇評】《淚之女王》：結局引兩極評價，金秀賢x金智媛CP感彌補劇本遺憾〉。https://news.agentm.tw/286040/ （read；最後一節「CP超越劇本的好作品」輸出截斷）。關鍵評論網也轉載過（https://www.thenewslens.com/article/202205 ，snippet）。
   - 摘要：她整理結局：反派黑化、車禍又中槍「被部分觀眾吐槽過於狗血」、說好的愛情喜劇變黑色復仇，甜蜜時刻全被快轉，「即使是 HE，卻是滿滿空虛」；但也有人喜歡薰衣草田的收尾。結論是雙金 CP 的化學反應彌補了劇本。
5. **分歧**：**收視創紀錄，結局評價兩極**。完結篇 24.85%，超越《愛的迫降》成 tvN 史上最高（ratings 檔；電影神搜同文），Netflix 2024 上半年 29M views；但 TIME 說結局「loses its heart」，豆瓣播出中就從開分高點掉到 7.1–7.2。鏡週刊 2024-04-29 報導韓國 blind 論壇有人爆料「原結局是海仁 2034 年死亡，因輿論改掉」（https://www.mirrormedia.mg/story/20240429edi043 ，snippet；這是網路傳言，未證實，不要當事實寫）。

## 5. Crash Landing on You 愛的迫降（tvN，2019–20）

1. **Metacritic S1**：沒有 Metascore（`/tv/crash-landing-on-you/` 與 `/season-1/` 都 404；站內搜尋無，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Guardian，Jo Walker，2020-05-11，〈Crash Landing On You: parachute into this addictively romantic South Korean soap opera〉。https://www.theguardian.com/culture/2020/may/11/crash-landing-on-you-parachute-into-this-addictively-romantic-south-korean-soap-opera （read；全劇）
   - 摘要：疫情封城期間的推薦文。她說劇情看似言情小說，實際「更豐富也更怪」，樂趣大多來自北韓士兵小隊和村裡大嬸團；劇中的北韓大致溫和，物資短缺、停電、一黨專政都輕輕帶過，重點在共同的韓國人身分。
   - 原文：「it is brave and optimistic in its portrayal of the North」
4. **中文評論（台灣）**：釀電影，雀雀，2020-02-19，〈集韓劇大成、灑高級狗血的《愛的迫降》，是進步還是退步？〉。https://filmaholic.tw/series/5e4d0217fd897800012376e1/ （read）
   - 摘要：她說這部把韓劇三寶「車禍、癌症、治不好」進化成「迫降、槍傷、統一不了」，敘事方式完全可預期，但靠玄彬、孫藝真的化學反應和支線撐起來。她分析南北韓「是家人」的想像、資本與共產的對照，也指出女主「先事業、再愛情、最後家庭」看似進步，卻只能在最奇幻的設定裡實現。最後問：這種集大成的成功，對韓劇是進步還是退步？
5. **分歧**：口碑與收視一致偏高：韓國有線 21.683%（當時 tvN 最高）、MDL 9.0（170,265 人）、IMDb 8.7（ratings 檔）。爭議點在題材：Al Jazeera（2020-05-14，snippet）與 The Conversation（2020-02-25，snippet）都提到它美化北韓軍官、但也被脫北者說日常細節相當準。

## 6. Twinkling Watermelon 閃亮的西瓜（tvN，2023）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有可用來源。找到 subject ID 36117731（豆瓣劇評頁，Exa 搜尋），但 subject 頁 Exa 回 403／timeout；第三方鏡像站 moovie.c2v2.com 寫 8.7（snippet，不是新聞，不採用）。
3. **英文評論**：NME，Gladys Yeo，2023-10-09，〈'Twinkling Watermelon' review: a touching tale of time travel〉。https://www.nme.com/reviews/twinkling-watermelon-review-a-touching-tale-of-time-travel-3509726 （read；根據前 4 集）
   - 摘要：設定繞太遠，前幾集花太多時間才把角色送到 1995 年；但角色關係把劇拉穩，崔顯旭的少年爸爸最亮眼；結論是「夠好看、也動人」，看後段能否補上。
   - 原文：「regrettably spends far too much time getting its characters where they need to be」
4. **中文評論（台灣）**：電影神搜（原刊歐搜哇），臺灣歐妮，2023-11-16（2026-07 有更新，加了主演近況、FAQ 等段落），〈《閃亮的西瓜》為什麼讓人一路哭到最後一集？從穿越回 1995 的樂團夏天，拆解這部青春劇的後勁〉（原標題為結局劇評）。https://news.agentm.tw/287399/ （read；後段截斷）
   - 摘要：她說前半像輕盈的音樂喜劇，後勁來自 CODA 少年恩傑替聽障家人「翻譯世界」的重擔；劇本沒給廉價的圓滿，爸爸還是失聰，但家境因為兒子在過去的努力而翻轉；核心訊息是「聽不見不代表不能溝通」。
5. **分歧**：**韓國收視低、觀眾評分極高**。完結篇收視 4.46%（電影神搜同文引 Nielsen），但 MDL 9.2（120,308 人，MDL 韓劇總榜 #2）、IMDb 8.8（ratings 檔）。台灣 PTT 推文常說「被片名耽誤」（fans 檔）。NME 只看了 4 集就給「設定太繞」的保留評價，和完結後的觀眾口碑落差大。

## 7. Crash Course in Romance 浪漫速成班（tvN，2023）

1. **Metacritic S1**：沒有 Metascore（搜尋只有 `/tv/crash-course/`，非同一部，read）。
2. **豆瓣**：沒有可用來源（dealmoon 導購頁寫開播後 7.9，snippet，不採用）。
3. **英文評論**：The Hindu，S. Poorvaja，2023-03-06，〈'Crash Course in Romance' series review: Love in the time of academic pressure, competition, and parental trauma〉。https://www.thehindu.com/entertainment/movies/crash-course-in-romance-series-review-love-in-the-time-of-academic-pressure-competition-and-parental-trauma/article66587125.ece （read；全劇）
   - 摘要：四十多歲的主角 CP 很清新，全度妍和鄭敬淏的對手戲有火花；但補習班媽媽、升學壓力、連環殺人犯等支線太多，殺人案拖到最後又草草收尾，後半調性跳來跳去。
   - 原文：「there are constant tonal jumps in the show, especially during its latter half」
4. **中文評論（台灣）**：電影神搜（原刊歐搜哇），臺灣歐妮，2023-03-07，〈【完結劇評】《浪漫速成班》：唯一守住的只有「浪漫」，亂開支線又草草結束實在可惜〉。https://news.agentm.tw/289867/ （read；最後一節截斷）
   - 摘要：她批評後半「亂開支線」：智室長以自殺收場等於「自殺就可以不用解決他的問題」、極端媽媽們反而得到好結局、硬配的配角 CP、消失十幾年的生母突然現身；只有主副 CP 的浪漫守住了。（另有關鍵評論網〈【隨點隨看串流+】…如雞蛋糕般甜而不膩〉https://www.thenewslens.com/feature/streaming/182238 ，snippet）
5. **分歧**：**收視高、後半劇情普遍被批**。完結 17.038%（tvN 第 6 高，ratings 檔），Netflix 2023 上半年 234.8M 小時；但英文（The Hindu、Indian Express Lakshana N Palat 2023-03-07，snippet）和台灣評論都說殺人犯支線多餘、最後兩集倉促。電影神搜的標題直接寫「和高收視不同的負面迴響」。

## 8. Welcome to Samdal-ri 歡迎回到三達里（JTBC，2023–24）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：NME，Tanu I. Raj，2023-12-13，〈'Welcome to Samdal-ri' review: end the year with this comfort watch〉。https://www.nme.com/reviews/welcome-to-samdal-ri-review-3558304 （read；根據開播初期）
   - 摘要：她最稱讚編劇權惠周的寫法：像朋友間的回憶敘述，不把議題丟給觀眾，而是慢慢引導；全鎮都知道兩人還相愛，只有當事人不承認。
   - 原文：「an intimate, beautiful and flawed depiction of love」
4. **中文評論（台灣）**：電影神搜（原刊歐搜哇），臺灣歐妮，2024-01-24，〈【完結劇評】《歡迎回到三達里》：溫暖療癒人心的結局—「真正的認識自己才能拯救自己」〉。https://news.agentm.tw/286769/ （read）
   - 摘要：她特別提到女主被指控為職場霸凌「加害者」而不是受害者，而且她先反省、確認對方是否因自己而尋死，再談澄清，這讓劇有不同的魅力；支線收得乾淨，因果報應的結局雖老套但溫暖。
5. **分歧**：沒有明顯分歧。收視穩定上升到 12.399%（ratings 檔），評論與觀眾都偏正面。SCMP Pierce Conran 的完結評論標題寫「fulfilling until the end」（2024-01-23，snippet）。

## 9. Hotel del Luna 德魯納酒店（tvN，2019）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：The Korea Herald，Im Eun-byel，2019-07-29，〈[Herald Review] 'Hotel Del Luna' wins over viewers with spooky romance〉。https://www.koreaherald.com/article/2059566 （read；播出中段，約第 8 集時寫）
   - 摘要：洪氏姊妹前兩部《花遊記》等表現普通、呂珍九也被看衰，但劇在《阿斯達年代記》中場空檔逆襲；她指出這部把《鬼怪》的「全能男主保護脆弱女主」關係倒過來，由 IU 的不老老闆保護年輕男經理；呂珍九起初演得用力，後來慢慢融入。
   - 原文：「IU exhibits a sense of eternal loneliness hidden beneath a cranky and grumpy temper」
4. **中文評論（台灣）**：電影神搜，夜間看劇筆記，2021-09-02，〈【經典回顧】IU x 呂珍九《德魯納酒店》：重新品味、全盤重整對生與死的意念〉。https://news.agentm.tw/190494/ （read）
   - 摘要：疫情第二年重看，作者把它讀成關於「憾」（한）與放下執念的生死觀；男女主「可以說是少數韓劇中最沒有 CP 感的一對主角」，反而前世的青明與滿月更有 CP 感，但她認為這段「舒服的關係」也成立。
5. **分歧**：tvN 2019 年度收視冠軍（有線 12.001%，ratings 檔；IMDb 8.1），但「男女主沒有化學反應」是中英文評論共同的抱怨（台灣電影神搜同文；英文粉絲評論站 The Fangirl Verdict 2020-02-15 給 B-，snippet）。

## 10. Guardian: The Lonely and Great God (Goblin) 孤單又燦爛的神－鬼怪（tvN，2016–17）

1. **Metacritic S1**：沒有 Metascore（搜尋「goblin」無結果，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：/Film（SlashFilm），Hoai-Tran Bui，2021-10-05，〈The Daily Stream: It's Time To Ring In Cozy Gong Yoo Season With The Fantasy K-Drama Goblin〉。https://www.slashfilm.com/623832/the-daily-stream-its-time-to-ring-in-gong-yoo-season-with-the-fantasy-k-drama-goblin/ （read）。**注意**：這是「每日推薦」專欄，不是正式評論；找不到 2016–17 年英文大報的署名評論（Korea Herald／Korea Times 當時只有收視新聞與未署名的爭議報導）。
   - 摘要：她說《鬼怪》代表這波韓流的頂點：有舊韓劇的浪漫與煽情，也有大製作預算，樹立了後來韓劇的畫面標準；它同時是愛情劇、雙男主喜劇、奇幻劇和古裝動作史詩，還會問來世、命運與信仰的問題。
   - 原文：「it's the epitome of the K-drama」
4. **中文評論（台灣）**：關鍵評論網，陳慶德（韓國文化研究者、靜宜大學），2017-02-10，〈《鬼怪》背後的鬼怪（一）：新羅鬼怪篇〉。https://www.thenewslens.com/article/61097 （partial (Exa cache)：讀到前約 2,800 字）。**注意**：這是民俗與歷史考據系列（共四篇），不是一般劇評。
   - 摘要：他考據金信的原型可能是高麗名將崔瑩，並說明編劇金銀淑筆下的「도깨비」和韓國民間傳說的鬼怪不同，介於鬼神與守護神之間，所以英文片名才譯成 Guardian；他也稱讚劉寅娜的演技和金銀淑的台詞幽默。
5. **分歧**：當時有線收視紀錄（完結 20.5%，Korea Times 2017-02-08 snippet；ratings 檔記 18.680%，兩者口徑不同）。The Korea Herald 2017-01-04〈'Guardian,' popular but controversial〉（https://www.koreaherald.com/article/1198527 ，partial：Exa 摘要；作者未顯示）引用韓國劇評人批評「女高中生 × 900 歲男人」的年齡差與灰姑娘公式，例如 Hwang Jin-mi：「The system of fantasy blocks any guilt and allows viewers to accept, without being repulsed, the romance between a minor and an older man」。

## 11. Love Scout 我的完美秘書（SBS，2025）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：The Hindu，S. Poorvaja，2025-02-16，〈'Love Scout' K-Drama review: Han Ji-min, Lee Jun-hyuk lead a mature, refreshing workplace romance〉。https://www.thehindu.com/entertainment/movies/love-scout-k-drama-review-han-ji-min-lee-jun-hyuk/article69222536.ece （read；全劇；最後一段輸出截斷）
   - 摘要：她稱讚編劇金智恩把「男老闆配女秘書」翻轉成女 CEO 配單親爸爸秘書，而且處理得很有分寸：男主不當救世主，兩人遇事就溝通；男二女二也有自己的故事線。
   - 原文：「At 12 episodes, Love Scout is the rare K-Drama that leaves you wishing there were a few more episodes.」
4. **中文評論（台灣）**：電影神搜，臺灣歐妮，2025-01-06，〈【首播劇評】《我的完美秘書》：韓志旼x李浚赫養眼組合！上演工作狂CEO與全能秘書的羅曼史〉。https://news.agentm.tw/322843/ （read；只評前 2 集）
   - 摘要：她說這是熟悉的上司與秘書職場愛情，性別翻轉只是「打開這部戲的鑰匙」；韓志旼演出高傲又迷糊的 CEO，李浚赫難得演愛情劇男主「一出現就全項滿足」。沒有找到完結後的台灣署名劇評。
5. **分歧**：評論界有分歧：The Hindu 很喜歡，SCMP Pierce Conran 的標題卻是「modern princess and unicorn man make for a shallow show」（2025-02-18，snippet）。台灣在 Hami Video 獨播，熱度高（鏡週刊 2025-01-20 報導全台設立牌，snippet）。

## 12. Hometown Cha-Cha-Cha 海岸村恰恰恰（tvN，2021）

1. **Metacritic S1**：沒有 Metascore（搜尋「hometown」無結果，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：Decider，Joel Keller，2021-08-30，〈Stream It Or Skip It: 'Hometown Cha-Cha-Cha' On Netflix, A K-Drama About A Dentist And A Jack-Of-All-Trades In A Seaside Town〉。https://decider.com/2021/08/30/hometown-cha-cha-cha-netflix-review/ （read：Groundlane 讀到「Most Pilot-y Line」為止，最後的 Our Call 段由 Exa 搜尋摘要補上；只評第 1 集）
   - 摘要：離開首爾的海邊小鎮設定讓人耳目一新，鎮民群像是重點；但女主一開始太平面，「這裡要笑」的配樂很煩。結論 STREAM IT，但節奏太慢。
   - 原文：「But it moves so slowly at times, the momentum comes close to grinding to a halt.」
4. **中文評論（台灣）**：關鍵評論網，雪影劇場，2021-10-21，〈韓劇《海岸村恰恰恰》不只海與愛情，還有由孩童至老年，人生每階段濃縮故事〉。https://www.thenewslens.com/article/157942 （read (Exa cache)）
   - 摘要：作者原以為只是男女主愛情加小鎮日常，結局前才看出編劇把童年、青少年、戀愛、婚姻、育兒、老年、同性戀、人生遺憾都放進配角線，並舉電影《孤味》《婚姻故事》等對照。
5. **分歧**：完結後男主金宣虎爆出私生活爭議，The Hindu 2021-10-21 評論提到「raging controversy」（Exa 摘要，partial）。SCMP 完結評論標題寫「despite hokey finale」（snippet）。The Hindu 也說沉重議題都塞在最後兩集。IMDb 8.3、韓國有線 12.665%（ratings 檔）。

## 13. Mr. Queen 哲仁王后（tvN，2020–21）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：Collider，Kelcie Mattson，2023-03-10（2024-03-01 更新），〈'Mr. Queen' Is the Gender-Bending Time Travel K-Drama to Watch Next〉。https://collider.com/netflix-mr-queen/ （partial：讀到約一半，「Impressive Cast」一節後截斷；是 Netflix 上架後的推薦評論）
   - 摘要：她說這部把宮廷權謀、彆扭愛情、靈魂穿越和「某種程度的酷兒」愛情全塞進來，Studio Dragon 的製作讓喜劇和嚴肅切換自如；申惠善把現代渣男廚師演進王后身體裡，「說是 revelation 都太輕描淡寫」。摘要另說劇中的酷兒暗示沒有處理完。
   - 原文：「couldn't offer more delights if it tried (and oh, does it try)」
4. **中文評論（台灣）**：女人迷 womany（性別力 Gender Power 專欄），Vivier Citygirl，2021-03-04，〈韓劇《哲仁皇后》：父權的時代，渣男卻成為女性正義代言人〉。https://womany.net/read/article/26581 （read；結尾截斷）。**注意**：女人迷不在指定的評論媒體清單，是台灣性別議題媒體；釀電影、關鍵評論網、鳴人堂都沒找到這部的劇評，電影神搜只有爭議新聞。
   - 摘要：作者說它比原作陸劇《太子妃升職記》下了更多功夫：渣男穿進皇后身體，被迫體會加在女性身上的束縛，因此成了替後宮女性發聲的人；但她也問，讓「心理男性」當挑戰父權的角色，是否讓真正的女性角色仍處在被代言、被拯救的位置？她用酷兒理論讀這段靈魂交融的愛情。
5. **分歧**：**歷史扭曲爭議與高收視並存**。開播時因台詞說《朝鮮王朝實錄》是「八卦報」、原作作者有辱韓言論、真實人物的設定，被投訴到放送通信審議委員會，青瓦台也出現停播請願，劇組道歉並刪改片段（電影神搜 2020-12-18〈…屢遭投訴…〉https://news.agentm.tw/151240/ ，snippet；ZAPZEE 2021-01-25 評論，Exa 摘要，partial）。但收視不降反升，完結 17.371%（ratings 檔），MDL 8.9、IMDb 8.5。2021-03 同編劇的《朝鮮驅魔師》停播後，又被翻舊帳（鏡週刊 2021-03-26，snippet）。

## 14. King the Land 歡迎來到王之國（JTBC，2023）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：NME，Hidzir Junaini，2023-06-19，〈'King the Land' review: check into this cute but cliched rom-com〉。https://www.nme.com/reviews/tv-reviews/king-the-land-review-girls-generation-yoona-2pm-junho-netflix-3457889 （read；根據開播初期）
   - 摘要：最大優點是兩位偶像主演的親和力與化學反應，也肯定劇對服務業員工的同理；但劇情是樣板、節奏拖、喜劇時好時尷尬。他認為套路之所以成為套路是因為有效，能否滿意要看結局。
   - 原文：「boilerplate plotting, sluggish pacing and hit-or-miss comedy」
4. **中文評論（台灣）**：電影神搜（原刊歐搜哇），臺灣歐妮，2023-08-08，〈【劇評】李俊昊x林潤娥《歡迎來到王之國》結局：不意外的完美收尾，收視證明主演魅力〉。https://news.agentm.tw/288571/ （read）
   - 摘要：結局把母子誤會和姊弟繼承戰都溫情收尾，最後兩集是全劇最好看的；但中段劇情好猜、無厘頭搞笑沒趣，「讓不少觀眾中途棄劇」，評價兩極，作者笑稱「虎頭虎尾」。
5. **分歧**：**收視與串流成功，評論偏冷**。完結 13.789%（JTBC 第 7 高）、Netflix 2023 下半年 33M、韓國最受歡迎韓劇（ratings 檔）；但 SCMP 標題寫「tacky, dated and unimaginative romcom」（2023-06-22，snippet），The Hindu 2023-08-09 說「chemistry and charm aplenty… but little else」，並提到阿拉伯王子那兩集被批評文化歪曲、製作方道歉（Exa 摘要，partial）。電影神搜 2024-03 轉述韓媒票選「2023 最爛韓劇」，《王之國》上榜（https://news.agentm.tw/287423/ ，snippet）。

## 15. Love in the Big City 大都市的愛情法（TVING，2024）

1. **Metacritic S1**：沒有 Metascore（`/tv/love-in-the-big-city/season-1/` 404；搜尋無，read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：The Gay & Lesbian Review，Tae Ho Kim，2024-11-21，〈Gay Korean Culture in Love in the Big City〉。https://glreview.org/gay-korean-culture-in-love-in-the-big-city/ （read；全劇）。**注意**：G&LR 是美國的同志文化雙月刊，不是主流大媒體；Korea Herald／Korea Times／JoongAng Daily 只有記者會與專訪報導，沒有署名評論（search，snippet）；NME、Variety、TIME 沒找到單篇評論（TIME 只在年度榜單列 #3，awards 檔）。
   - 摘要：作者說原著作者朴相映親自改編，忠實保留「在喜劇與悲劇之間懸浮」的風格；他拿它和《慾望城市》比，但指出主角的問題從來不只是個人問題，而是韓國社會普遍缺乏信任：朋友出櫃他、教會長老母親送他進精神病院、男友為了意識形態放棄他。主角自己也不比別人好，這份反諷讓劇沒那麼灰暗。
   - 原文：「one wonders whether a more apt title for the series would be No Love in the Big City」
4. **中文評論（台灣）**：電影神搜，臺灣歐妮，2024-11-12，〈【劇評】《大都巿的愛情法》：愛情的寫實相遇與傷痕，一場觸動人心的成長旅程〉。https://news.agentm.tw/307625/ （read；第四段戀情之後截斷）
   - 摘要：她強調這不是包裝唯美的 BL 劇，而是現實人生：逐段整理主角與美愛的友情，以及和南圭、英洙、圭浩等人的戀情；把 HIV 取名「凱莉」，最後成了圭浩與高煐之間的「第三者」。
5. **分歧**：**評論界高度肯定，韓國國內有保守團體抗議**。開播前保守團體要求停播（Korea Times 2024-10-18，snippet），但 TIME 2024 韓劇榜 #3、Cine21 2024 #4（awards 檔），台灣 LINE TODAY 2024 十大 #4（fans 檔）。Dramabeans 留言區有人說最後兩集收尾較弱（snippet）。

## 16. Melo Movie 我們的浪漫電影（Netflix，2025）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：The Hindu，S. Poorvaja，2025-03-06，〈'Melo Movie' K-Drama review: Choi Woo-shik, Park Bo-young are stellar in this endearing series〉。https://www.thehindu.com/entertainment/melo-movie-k-drama-review-choi-woo-shik-park-bo-young-are-stellar-in-this-endearing-series/article69272118.ece （read；全劇）
   - 摘要：電影無所不在，每集標題都是經典台詞；最大成就是處理哀傷，包括失去親人與失去關係；編劇李娜恩沒有只寫愛情，兄弟線、母女線都想看更多；李濬榮是驚喜。她也承認和《那年，我們的夏天》很像。
   - 原文：「a mature slice-of-life series that isn’t afraid of nuance and going beyond textbook romance」
4. **中文評論（台灣）**：電影神搜，JC酒依絲，2025-02-19，〈【劇評】Netflix《我們的浪漫電影》：到頭來才發現人生並非電影，浪漫也可能夾雜苦澀〉。https://news.agentm.tw/328423/ （read；後段截斷）
   - 摘要：她整理劇中對《新天堂樂園》《八月照相館》等的致敬，說「人生比電影漫長多了」：高謙把愛電影變成照顧哥哥的工具，哥哥死後沒有電影式的獨白，只有朋友笨拙地塞物資；「浪漫電影」既是武飛的童年傷口，也被重新定義為沒有圓滿結局的浪漫。
5. **分歧**：評論界分歧：The Hindu、電影神搜偏正面；NME 2025-02-14 的評論說它「does little to deliver anything beyond from what we're used to getting from the genre」（snippet）；The Blossom Review 標題說兄弟線比愛情線好（snippet）。TIME 2025 韓劇榜只列榮譽提名（awards 檔）。台灣 Dcard、LINE TODAY 年度榜有上（fans 檔）。

## 17. Love Next Door 媽媽朋友的兒子（tvN，2024）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：Gulf News，Lakshana N Palat，2026-03-29，〈K-Drama Rewind, Love Next Door: Jung Hae-in and Jung So-min lead a moving story of love, burnout and hope〉。https://gulfnews.com/entertainment/k-drama-rewind-love-next-door-jung-hae-in-and-jung-so-min-lead-a-moving-story-of-love-burnout-and-hope-1.500489735 （read；全劇回顧）。**注意**：Gulf News 是杜拜英文大報，不在原清單；Decider、NME、The Hindu 都沒找到單篇評論，SCMP 有但被付費牆擋住。
   - 摘要：她說真正的故事是女主的過勞與憂鬱、回家按下重置鍵；這部分比愛情更療癒。男主「snarling and snapping」的老套設定很累，聽到女主要出國學廚藝時的反應很自私；兩人當朋友反而比當戀人可信。
   - 原文：「they were perhaps more convincing, more meaningful, as friends」
4. **中文評論（台灣）**：電影神搜，Winnie，2024-10-09，〈《媽媽朋友的兒子》完結劇評：定位不明的愛情喜劇，親情和夢想更有看點！〉。https://news.agentm.tw/304078/ （read）
   - 摘要：宣傳是愛情喜劇，中後段卻變成家庭群像；媽媽團吵架、爸爸們喝醉的戲重複到疲乏；親情和解與每個角色追夢的線比愛情好看；最後一集穿了婚紗卻沒結婚，開放式結局太倉促，整體像「什麼都加了卻什麼味道都不突出的大雜燴」。
5. **分歧**：收視創自身新高 8.458%（電影神搜同文），Netflix 2024 下半年 20M（ratings 檔），但結局評價兩極（電影神搜）；SCMP 完結評論標題是「cook up a nothing burger」（2024-10-10，snippet）。中英文評論都說親情與過勞線比愛情線好。

## 18. Our Movie 我們的電影（SBS／Disney+，2025）

1. **Metacritic S1**：沒有 Metascore（read）。
2. **豆瓣**：沒有找到可用來源。
3. **英文評論**：Mashable Middle East，Mamta Raut，2025-06-18，〈'Our Movie' review: Jeon Yeo-been and Namkoong Min give us major K-trauma in this devastating story〉。https://me.mashable.com/entertainment/57163/our-movie-review-jeon-yeo-been-and-namkoong-min-give-us-major-k-trauma-in-this-devastating-story （read；評分 3.5/5，**只根據前 2 集**）。**注意**：Mashable ME 是中東地區版。SCMP 有兩篇（開播與完結），但付費牆只讀到副標。
   - 摘要：絕症題材本來容易煽情，靠全余贇的演出才不顯得甜膩；南宮珉「heartbreakingly refined」；最好看的是便利商店外聊天這種日常細節。
   - 原文：「Here is a painful, intimate, impeccably acted if not entirely plausible drama of terminal illness」
4. **中文評論（台灣）**：電影神搜，芮塔的看劇筆記本，2025-06-17，〈南宮珉挑戰悲劇天花板！Disney+ 韓劇《我們的電影》首播心得，如何用「有限生命」詮釋無限之愛〉。https://news.agentm.tw/359204/ （read；只評前 2 集）
   - 摘要：在復仇爽劇當道時反其道拍悲戀；影像像日劇般輕柔、對話像詩；第一集剪接太蒙太奇、全余贇演得有點誇張，第二集漸入佳境。沒有找到完結後的台灣署名劇評。
5. **分歧**：**收視低迷、評論獲肯定**。韓國收視卡在 3% 區間（Korea Times 2025-07-18〈'Our Movie' struggles with low viewership despite star power…〉，snippet），首播 4.2%（電影神搜同文）；但 TIME 2025 韓劇榜榮譽提名（awards 檔），MDL 與台灣 PTT 推文評價很高（fans 檔）。SCMP 完結評論副標說它「shies away from confronting us with its terminally ill character's end」（2025-07-22，snippet）。

---

## 總表

| # | 劇名 | Metacritic S1 | 豆瓣（新聞引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | 暴君的廚師 | 無 | 無可用 | Decider／Keller | read（ep1） | 關鍵評論網／胡芩 | partial | 高收視 vs 暴君浪漫化、結局倉促 |
| 2 | 背著善宰跑 | 無 | 9.0（播出中，TVBS） | TIME／Kayti Burt | read | 關鍵評論網（歐搜哇）／芮塔 | read (Exa, ep1–2) | 全國收視 ≤5.8% vs 話題度＃1、MDL 8.9 |
| 3 | 二十五，二十一 | 無 | 9.1→8.2（澎湃） | Decider／Keller | read（ep1） | 鳴人堂／阿潑 | read | 結局爭議、豆瓣暴跌、TIME 說被 review-bomb |
| 4 | 淚之女王 | 無 | 7.2（6 萬+，每經網）／7.1（TVBS） | TIME／Bunting | read | 電影神搜／臺灣歐妮 | read | tvN 最高收視 vs 結局兩極 |
| 5 | 愛的迫降 | 無 | 未找 | Guardian／Jo Walker | read | 釀電影／雀雀 | read | 大致一致；北韓描寫爭議 |
| 6 | 閃亮的西瓜 | 無 | 無可用 | NME／Gladys Yeo | read（4 集） | 電影神搜／臺灣歐妮 | read | 收視 4.46% vs MDL 9.2 |
| 7 | 浪漫速成班 | 無 | 無可用 | The Hindu／Poorvaja | read | 電影神搜／臺灣歐妮 | read | 高收視 vs 後半支線、殺人犯線 |
| 8 | 歡迎回到三達里 | 無 | 未找 | NME／Tanu I. Raj | read（初期） | 電影神搜／臺灣歐妮 | read | 無明顯分歧 |
| 9 | 德魯納酒店 | 無 | 未找 | Korea Herald／Im Eun-byel | read（中段） | 電影神搜／夜間看劇筆記 | read | 年度收視冠軍 vs 男女主沒 CP 感 |
| 10 | 鬼怪 | 無 | 未找 | /Film／Hoai-Tran Bui（推薦專欄） | read | 關鍵評論網／陳慶德（考據） | partial | 年齡差、灰姑娘公式爭議 |
| 11 | 我的完美秘書 | 無 | 未找 | The Hindu／Poorvaja | read | 電影神搜／臺灣歐妮 | read（首播） | Hindu 讚 vs SCMP「shallow」 |
| 12 | 海岸村恰恰恰 | 無 | 未找 | Decider／Keller | read（ep1） | 關鍵評論網／雪影劇場 | read (Exa) | 男主完結後私生活爭議；結局倉促 |
| 13 | 哲仁王后 | 無 | 未找 | Collider／Kelcie Mattson | partial | 女人迷／Vivier Citygirl（不在清單） | read | 歷史扭曲投訴 vs 收視上升 |
| 14 | 歡迎來到王之國 | 無 | 未找 | NME／Hidzir Junaini | read（初期） | 電影神搜／臺灣歐妮 | read | 高收視、Netflix 熱門 vs 評論冷、韓媒最爛劇票選 |
| 15 | 大都市的愛情法 | 無 | 未找 | The Gay & Lesbian Review／Tae Ho Kim（非大媒體） | read | 電影神搜／臺灣歐妮 | read | 評論高度肯定 vs 保守團體抗議 |
| 16 | 我們的浪漫電影 | 無 | 未找 | The Hindu／Poorvaja | read | 電影神搜／JC酒依絲 | read | Hindu 讚 vs NME「沒有新意」 |
| 17 | 媽媽朋友的兒子 | 無 | 未找 | Gulf News／Lakshana N Palat（不在清單） | read | 電影神搜／Winnie | read | 結局兩極；愛情線最弱 |
| 18 | 我們的電影 | 無 | 未找 | Mashable ME／Mamta Raut（區域版） | read（2 集） | 電影神搜／芮塔 | read（首播） | 收視 3% vs 評論榜單肯定 |

「未找」= 這次沒有為該劇另外搜尋豆瓣新聞；「無可用」= 搜過但只有 snippet、用戶評論或鏡像站。

## 缺口

1. **Metacritic**：18 部都沒有頁面，這個欄位對韓劇沒用。英文評論彙整只能看 RT（多數評論數 <5）或 MDL。
2. **豆瓣**：只有 3 部有新聞引述（2、3、4）；暴君的廚師只有豆瓣用戶長評提到分數，不算。豆瓣 subject 頁 Exa 抓不到（403／timeout），新聞引述多半是播出中或爭議當下的數字，不是最終分數，人數也常缺。要補的話，可找「年度韓劇豆瓣評分榜」類新聞（TVBS、Beauty321、南方+），但都是快照。
3. **英文大媒體覆蓋薄**：NYT、Guardian、Variety、Vulture、THR 對這類愛情韓劇幾乎不寫單篇評論；能用的主要是 Decider（只評首集）、NME（多為前幾集）、TIME（Kayti Burt／Geoffrey Bunting）和 The Hindu。SCMP Pierce Conran 有 15 部以上完整評論，但付費牆讀不到內文。
4. **標了注意的英文評論**：鬼怪（推薦專欄，非正式評論）、哲仁王后（partial）、大都市的愛情法（小眾刊物）、媽媽朋友的兒子（Gulf News，不在原清單）、我們的電影（區域版、只看 2 集）。若正文要引，建議優先用 TIME、Guardian、NME、The Hindu 這幾篇。
5. **台灣中文評論集中在電影神搜**（11/18），多是筆名粉絲劇評。真正有評論深度的只有釀電影（愛的迫降）、鳴人堂（二十五二十一）、關鍵評論網的胡芩、陳慶德、雪影劇場。
6. **只有首播評論、沒有完結評論的**：我的完美秘書、我們的電影（台灣）；背著善宰跑（台灣是首播分析）。
7. **哲仁王后**沒有在指定清單中的台灣媒體找到劇評，改用女人迷。
8. 「分歧」欄裡的 SCMP、Korea Times、鏡週刊、Al Jazeera 等多是 **snippet**，正文引用前要再讀原文；《淚之女王》「原結局被改」是論壇傳言，不能當事實。

## toolDegradation

- **Groundlane MCP**（`web_extract`／`web_fetch`／`web_search`）為主：Metacritic 18 次站內搜尋、Guardian、TIME、NME、The Hindu、Korea Herald、/Film、Collider、Mashable ME、G&LR、Gulf News、TVBS、釀電影、鳴人堂、電影神搜、女人迷都讀到。失敗：Decider 2521 回 OUTPUT_LIMIT；Firstpost 回 403（Access Denied）；SCMP 只回付費牆前段；關鍵評論網回 browser-challenge。Groundlane 搜尋內部的 tavily／exa／brave provider 時有 unavailable，由 brave／you 補上。
- **Exa**：`web_search_exa` 用來找英文評論與豆瓣新聞（摘要長，部分只當 partial 用）；`web_fetch_exa` 讀關鍵評論網 4 篇成功；TIME 頁面在 Exa 版本混入大量不相關的贊助內容（棄用，改用 Groundlane）；SCMP 也只有前段；豆瓣 subject 頁 403／timeout。
- **jina `read_url`**：用一次讀 Decider 2521 全文（沒有 API key，`question` 參數無效，回傳整頁，成本高）。
- **Tavily**：未使用（已知會 429）。**Firecrawl**：額度用完，未使用。**Groundlane 直接 HTTP／Keenable／You.com keyless**：未需要。
