# TW3 評價資料表：台劇｜愛情、家庭與青春 16 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-26 開工、**2026-11-28 完成**（中途遇用量上限，重置後續做）。片單來自 `post-tw3-shows.txt`，共 16 部；此時此刻、忘了我記得兩部原在 `reviews-tw1.md` 檔尾「已移出」，那裡的線索全是 snippet，本輪重新讀過（火神的眼淚不在本篇）。IMDb／MDL／Google 年度搜尋／DailyView／Netflix 榜沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、PTT／LINE TODAY 票選／Dcard 沿用 `candidates-fans-taiwan.md`，這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。**沒有 git commit。**

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（someday or one day、imperfect us、i am married but、let's talk about chu、the making of an ordinary woman、born for the spotlight、holiday、mom don't do that、more than blue、adrift in love、lovely villain、the six of us、living、the teenage psychic、at the moment、forget you not） | Groundlane `web_extract`（render=never，pattern 抓含關鍵字的 `/tv/` 連結） | **16/16 read：全部沒有頁面**。命中的都是同名或近似字的美劇（Imperfect Women、The Moment、Married、Living Single、Psychic Detectives、Daisy Jones & the Six 等）。Netflix 劇（想見你、影后、此時此刻、愛愛內含光、媽別鬧了、比悲傷、童話故事下集、忘了我記得）也沒有 |
| 豆瓣 | 只採用媒體文章引述的分數；沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com | Groundlane `web_extract`（beauty321 排行小標）、Exa 搜尋全文 | **13 部有媒體引述的分數**。來源以 **BEAUTY美人圈（beauty321.com，美妝網站）** 的豆瓣排行清單為大宗（9 部用到）；另有 **Cosmopolitan 台灣（時尚雜誌）**、**TVBS 新聞網〈觀點〉楊起鳳**、大陸媒體 **澎湃新聞**（曾于里）、**三聯生活周刊**（曾于里）、**1905 電影網轉人民日報客戶端**（Sir電影）。親愛壞蛋、我們六個、通靈少女**沒找到媒體引述**（Exa 搜尋結果直接回了豆瓣頁或百度摘要，依規定不採用） |
| 英文評論 | 署名評論，讀全文或大半 | Exa `web_search_exa`（搜尋結果附長段全文摘錄，主力）；Groundlane `web_extract`（Metacritic） | **9 部讀到署名英文評論**（不夠善良、愛愛內含光、影后、媽別鬧了、比悲傷、通靈少女、此時此刻、忘了我記得、童話故事下集；想見你只有部落格，不算）。清單內媒體：**Decider**（Joel Keller 5 篇、Johnny Loftus 1 篇，**全部只評首集**）、**SCMP**（James Marsh 3 篇，付費牆 partial；Stephen McCarty 1 篇 partial）、**Taipei Times**（Deanna Durben，媽別鬧了，全季，read）。NYT、Guardian、Variety、Collider、RogerEbert、THR、IndieWire、Focus Taiwan 都沒有找到 |
| 台灣中文評論 | 台灣媒體署名評論（獨立評論、關鍵評論網、聯合報〈娛樂有評〉、電影神搜、釀電影、換日線、NOWnews、TVBS〈觀點〉；清單外：PUNCHLINE、Marie Claire 美麗佳人） | Exa 搜尋全文（主力） | **15/16 讀到台灣媒體署名評論**（read 或 partial）。比悲傷更悲傷的故事：影集版只有未署名或作者不明的轉載（不算）。作者分布見下方 |

標記說明：**read** = 工具讀到頁面內文（全文或大半；本輪多數是 Exa 搜尋結果附的長段全文摘錄，標 **read (Exa)**）；**partial** = 只讀到前段（付費牆、TNL+ 前半、或摘錄截斷）；**snippet** = 只看到搜尋結果標題或一兩句，不算讀過、不當評論用。

> 英文評論的媒體使用次數（清單外上限 3）：
> - **清單內**：Decider 6（影后、愛愛內含光、媽別鬧了、此時此刻、忘了我記得：Joel Keller；比悲傷：Johnny Loftus）——**六篇都是〈Stream It Or Skip It〉首集評**，正文引用一定要註明。SCMP 4（愛愛內含光、媽別鬧了、忘了我記得：James Marsh；比悲傷：Stephen McCarty〈What a view〉專欄）——**都只讀到導言或前兩段，看不到星等**（tw1 的 SCMP 至少還讀到星等，這次沒有）。Taipei Times 1（媽別鬧了，Deanna Durben，contributing reporter，**全季、read**）；另有 Taipei Times 社論版 Mike Chang 談俗女2（作者是會計師，投書，不是劇評）。
> - **清單外**：The Straits Times（Jan Lee）2（不夠善良、影后；媽別鬧了那篇只看到標題，不用）；But Why Tho（Sarah Musnicky）2（童話故事下集、忘了我記得）；Ready Steady Cut（Jonathon Wilson）1（此時此刻）；The Review Geek（Greg Wheeler）1（比悲傷）；Cinema Escapist（Anthony Kao）1（通靈少女）。備用不用：Autostraddle（影后，Rendy Jones）、Leisurebyte、DMTalkies、K-waves and Beyond、Midgard Times、Film Fugitives（都清單外，且已有更好的）。
> - **7 部沒有英文署名劇評**：想見你（只有 The Fangirl Verdict、Paneurasian 等個人部落格）、俗女養成記、拜六禮拜、人浮於愛、親愛壞蛋、我們六個、有生之年（Taipei Times 只有金鐘新聞）。其中想見你與俗女的知名度和英文評論量完全不成比例。
>
> 台灣中文評論作者（照實寫）：
> - **雀雀**（聯合報〈娛樂有評〉）在本片單讀到 **7 部**（愛愛內含光、媽別鬧了、人浮於愛、親愛壞蛋、我們六個、有生之年；拜六禮拜另有她個人站 cheercut.com 一篇，不算媒體）。其中**人浮於愛、親愛壞蛋、我們六個三部只有她**（或只有她是清單內媒體），所以建議正文仍用 3 次。
> - **米果**（獨立評論〈台北捌玖零〉）讀到 **6 部**（不夠善良、俗女2、拜六禮拜、此時此刻、有生之年；另 2019 兩篇俗女 S1 只在她文中被提到，未讀）。前兩篇正文沒用過她，本篇建議用 **2 次**（俗女2、此時此刻）。
> - **潘光中**（電影神搜）讀到 2 部（有生之年、此時此刻〔反方〕），建議用 1 次（有生之年）。**徐佑德**（關鍵評論網 TNL+）讀到 3 部（不夠善良 2 篇、童話故事下集、忘了我記得），建議只用 1 次（忘了我記得；童話當反方備用）。
> - 本輪建議選用的作者分布：雀雀 3、米果 2、其餘各 1——唐肇陽（釀電影，想見你）、芬多經（關鍵評論網，不夠善良）、雪奈（娛樂有評，童話故事下集）、劉沐恩（換日線，愛愛內含光）、王鼎棫（獨立評論，影后）、楊起鳳（TVBS〈觀點〉，拜六禮拜）、穆光光（Marie Claire，媽別鬧了，清單外）、潘光中（電影神搜，有生之年）、柯志遠（NOWnews，通靈少女）、徐佑德（關鍵評論網，忘了我記得）。
>
> 業配與導流：讀到的文章都沒有「合作／贊助」標記。**不算評論、已排除**：公視「劇夠」幕後專訪（不夠善良、拜六禮拜、人浮於愛，平台自家內容）；鏡週刊〈娛樂透視〉（俗女、想見你、有生之年、拜六禮拜，是記者特稿與幕後報導，不是劇評）；ELLE、Cosmopolitan、Harper's BAZAAR、VOGUE、GQ、女人我最大、styletc 的「看點整理」（導流介紹文）；遠見魯皓平〈童話故事下集〉（導演專訪）；中央社、緯來、自由時報（新聞）；大愛電視官網與 tcnews（平台自家新聞稿）；PTT、Dcard、方格子、痞客邦、popdaily（網友心得）。**轉載要註明**：關鍵評論網 135582〈想見你〉是方格子 Skywalker_J 的授權轉載；風傳媒 4884998〈有生之年〉是方格子轉載；關鍵評論網 193487〈有生之年〉是「雞湯來了」組織專欄；陌熙（女人迷、方格子）與劉沐恩（換日線）的〈愛愛內含光〉文字幾乎相同，可能是同一作者不同筆名或轉載，正文引用換日線版即可。

---

## 1. 想見你（華視／八大／三鳳，2019–2020；英文 Someday or One Day）

1. **Metacritic**：沒有頁面（站內搜尋「someday or one day」只有 One Day、Nikki Glaser: Someday You'll Die 等，read）。
2. **豆瓣**：**播出期間 8.5 → 9.2**。1905 電影網轉載人民日報客戶端，作者 Sir電影（公號），2020-02-04，〈8.5到9.2，還不承認這是今年華語頭號惊喜〉：「從8.5到9.1到9.2，我看結局還會更高。」https://www.1905.com/news/20200204/1437594.shtml （read (Exa)；**大陸媒體轉載的公號文**，正文若用要寫「播出期間」）。beauty321〈近十年豆瓣評分年冠台劇〉（2025-01-06）只說 2019 年《想見你》「評價都很高」，沒給分數（https://www.beauty321.com/post/65546 ，read）。
3. **英文評論**：**沒有找到媒體署名劇評。** 讀到的都是部落格：The Fangirl Verdict（kfangurl，2020-12-22，A+，read）、Paneurasian（Matthew Franklin Cooper，2020-12-22，個人網誌，read）、Celluloid（Kaiser Khan，2026-07-22，自稱 founder & editor 的小站，read）。都不收。SCMP 只有 Pierce Conran 評韓國翻拍版 *A Time Called You*（2023-09-11，partial），開頭一句提到原作，不是本劇劇評。
4. **中文評論（台灣）**：
   - 推：釀電影，唐肇陽，2020-09-10，〈《想見你》：無限循環的唯一破口〉。https://filmaholic.tw/series/5f59d6dafd89780001dc178b/ （read (Exa)，讀到大半；播畢後評全 13 集）
     - 摘要：他逐一拆解劇中的「時空法則」與「意識與肉身」兩套規則，說這部結構極複雜的作品依自身邏輯檢視「幾乎毫無破綻」；結尾用托爾斯泰《人生論》解讀黃雨萱放棄記憶是打破循環的唯一出口。唯一批評在註腳：次要角色選角「不適任的情形顯然過半」。立場：強推。
     - 原文：「若依照作品本身所設定的邏輯逐一檢視，會驚訝地發現這部在結構上極為複雜的作品幾乎毫無破綻。」
   - 推（清單外，播出中）：PUNCHLINE 娛樂重擊，Maple，2019-12-16，〈台劇《想見你》劇評：台灣偶像劇轉型的誠懇嘗試，奇幻懸疑怎麼解開愛情的謎底？〉。https://punchline.asia/archives/55423 （read (Exa)；**只看到第 5 集左右**）。她說本劇把懸疑解謎放在愛情「裡面」而不是「旁邊」；柯佳嬿演高中生陳韻如「稍微顯得吃力」。原文：「《想見你》卻不只是把懸疑解謎放在愛情「旁邊」，而是放在了愛情「裡面」，這是它非常獨特的設計。」
   - 反方（轉載，不當主評）：關鍵評論網 135582，方格子 Skywalker_J，2020-05-27，〈《想見你》：保有你自己最初的形狀〉（read (Exa)）。說 1998 台南的時代感像「cosplay」、霸凌與家庭議題草草帶過。原文：「先說結論，這是一部非常粗糙的連續劇」。是方格子授權轉載，要註明。
   - 其他：500輯 鄭秉泓〈三部關鍵劇集〉（2022-03-25，read (Exa)）把本劇稱為「偶像劇天花板」，是年度回顧專文；釀電影另有甜寒、希米露、吳思恩三篇劇評（只看到專題頁的摘句，snippet）。鏡週刊兩篇是幕後特稿。
   - **建議正文用**：唐肇陽（推）；若要反方，引 Skywalker_J 並註明是轉載部落格。
5. **分歧**：**台灣評審、豆瓣、PTT 三方一致高，英文主流媒體缺席**。IMDb 8.4（2.6K）、MDL #1 8.8（11K 人）、豆瓣 2020 年度華語劇 #1、Netflix 2023 上半年 220 萬小時、Google 2020 戲劇 #4（ratings 檔）；金鐘 2020 戲劇節目獎＋編劇、女主角、創新共 4 項（Taipei Times 新聞確認，snippet→read）、500輯 鄭秉泓 2022 三部關鍵台劇（awards 檔）；PTT 2020 經典台劇票選 #2（146 票）、2022 成功台劇串推文約 12「現象級作品」（fans 檔）。落差在英文圈：MDL 上萬人評分、Netflix 韓國翻拍，卻找不到一篇英文媒體劇評。台灣內部唯一的強烈反方是部落格轉載（嫌時代感假）。

## 2. 不夠善良的我們（公視／台灣大哥大 MyVideo／有花影業，2024；英文 Imperfect Us）

1. **Metacritic**：沒有頁面（站內搜尋「imperfect us」只命中 *Imperfect Women*，read）。
2. **豆瓣**：**播出中 9.0，完結後 8.3**。BEAUTY美人圈〈公視台劇豆瓣評分TOP10！…《不夠善良的我們》第三〉（2024-04，播出期間）列 TOP3、**9.0**。https://www.beauty321.com/post/61322 （read；美妝網站排行）。同站 Kristen〈近三年豆瓣最高分台劇TOP10〉（2024-11-20）列 TOP7、**8.3**（https://www.beauty321.com/post/64955 ，read）；Cosmopolitan 台灣 Lily Chang、Mai Wang〈近期15部高分台劇推薦〉（2025-10-16）也寫 8.3（https://www.cosmopolitan.com/tw/entertainment/movies/a69038197/taiwanese-drama-recommendation-list/ ，read (Exa)；時尚雜誌）。徐佑德 TNL 201555（2024-04-17）說當時「破萬評分的9分神劇」（partial）。**分數從 9.0 掉到 8.3，是結局爭議的直接證據**。
3. **英文評論**：The Straits Times，Jan Lee，2024-04-24，〈Binge-worthy: Imperfect Us elevates love triangle trope to centre on complex female leads〉。https://www.straitstimes.com/life/entertainment/binge-worthy-imperfect-us-elevates-love-triangle-trope-to-centre-on-complex-female-leads （read (Exa)；**清單外**；寫於 4/27 完結前，看到第 6 集左右）。
   - 摘要：給 **4 星**；她說本劇把三角戀套路提升為「選擇」的討論，最好的地方是敢寫刻薄、不討喜的複雜女性；林依晨因戲份最「肉」而最亮眼，賀軍翔演疲憊中年脫胎換骨。立場：推。
   - 原文：「The best thing about Imperfect Us is how unafraid it is to centre on complicated female characters who are at times bitter, unkind and sad.」
   - 其他（不用）：DramaPanda（Vic，前 4 集）、Reel Thoughts、Global Granary（部落格）。清單內媒體都沒找到。
4. **中文評論（台灣）**：
   - 有保留：關鍵評論網〈TNL+ 影劇〉，芬多經，2024-04-10，〈台劇《不夠善良的我們》：典型的「徐譽庭」作品，但刻意金句的說教意味真的太重〉。https://www.thenewslens.com/column/streaming/201231 （partial (Exa)，讀到前段；**只評第 1–2 集**）
     - 摘要：她說徐譽庭「文字精準犀利，人物刻劃細膩」，但旁白「刻意營造金句感」；直言林依晨「每部戲都是林依晨演林依晨」，許瑋甯在餐廳對店員抱怨的戲冗長直白。立場：有保留。
     - 原文：「林依晨在《不夠善良的我們》掛頭牌，但她的表情動作張揚做作，平鋪直述的口條演出，平淡不吸引人的聲調語氣，旁白文字也是充滿刻意營造金句感，確實不夠吸引人。」
   - 推：獨立評論〈台北捌玖零〉，米果，2024-05-03，〈從《我可能不會愛你》到《不夠善良的我們》，編劇站在C位的台劇時代來臨了〉。https://opinion.cw.com.tw/blog/profile/57/article/14828 （read (Exa)，讀到大半；播畢後）。偏編劇論。原文：「徐譽庭的腳本比較溫柔，但溫柔之中也能刀刀見骨。」
   - 強推（作者集中，備用）：關鍵評論網，徐佑德，2024-04-29，〈台劇《不夠善良的我們》解析：徐譽庭生涯最佳作品…〉https://www.thenewslens.com/column/streaming/202055 （partial (Exa)；評全 8 集）。說本劇與《我們與惡的距離》並列他心中台劇最佳，結局「非常勇敢」。另一篇 1–4 集分析 201555（partial）。
   - 不算或清單外：女人迷 陌熙〈劇評：情敵久別重逢〉（2024-05-15，read，清單外）；udn 女子漾 欸冷（部落格轉載）；釀電影方格子〈夢境解析〉（作者不明，read）；放言 劉修齊（編輯部介紹）；公視劇夠幕後專訪。
   - **建議正文用**：芬多經（首兩集的保留）＋米果（播畢後的肯定）；要談「台劇最佳」的極端評價時才引徐佑德。
5. **分歧**：**評審與平台一致推，觀眾在結局後掉分**。MDL #50 7.9、豆瓣 2024 年度華語劇 #8、Google 2024 戲劇 #3、DailyView 2024 #3（ratings 檔）；金鐘 2024 迷你劇集入圍、AACA 2024 台灣區最佳女主角（許瑋甯）、男配角（柯震東）、導演、剪輯；GOTT 2024 女主角（林依晨）（awards 檔）；LINE TODAY 聚光賞 2024 台劇 #3、金鐘人氣票選期中 #2（fans 檔）。豆瓣 9.0 → 8.3；豆瓣長評（不收）罵「把 Rebecca 寫死真的是一件很殘忍的事」。評論內部的分歧在「金句」：芬多經說說教，米果、徐佑德說刀刀見骨。

## 3. 童話故事下集（Netflix／打勾勾娛樂等，2025；英文 I Am Married... But!）

1. **Metacritic**：沒有頁面（站內搜尋「i am married but」只有 *Married with Children*、*Married at First Sight* 等，read）。
2. **豆瓣**：**7.1**。BEAUTY美人圈，Eve，2025-03-15，〈近年Netflix台劇豆瓣評分TOP10！《童話故事下集》7.1落榜，《影后》8.1，冠軍高達8.8〉。https://www.beauty321.com/post/66671 （read (Exa)，標題與各段小標；美妝網站）。同站 66818（2025-03-23）列近五年愛情台劇第 10、7.1；Cosmopolitan 台灣（2025-10-16）也寫 7.1（read (Exa)）。
3. **英文評論**：But Why Tho，Sarah Musnicky，2025-02-15，〈I Am Married But Review: An Oddly Satisfying Watch〉。https://butwhytho.net/2025/02/i-am-married-but-review-netflix-jasper-liu/ （read (Exa)；評全 12 集）。**清單外**。
   - 摘要：她說本劇不是浪漫觀眾會在情人節選的題材，卻讓人看到婚姻的真實面；柯佳嬿撐起全劇，柯淑勤的婆婆是搶戲擔當；缺點是長了一兩集，衝突重複。立場：推。
   - 原文：「I Am Married But runs a little longer than necessary. An episode or two could have been cut out to give a tighter finish」
   - 清單內沒有：Decider 只有週末片單列名（Liz Kocan，snippet），沒有〈Stream It or Skip It〉；SCMP 沒找到。其他清單外：DMTalkies、K-waves and Beyond、Leisurebyte、Common Sense Media（不用）。
4. **中文評論（台灣）**：
   - 推：聯合報〈娛樂有評〉（噓！星聞），雪奈，2025-02-19，〈Netflix《童話故事下集》：不忍直視的真實婚姻生活〉。https://stars.udn.com/star/story/10093/8553588 （read (Exa)；評全劇，有劇透）
     - 摘要：她逐一拆解劇中的婚姻危機——與公婆同住、原生家庭的生活習慣、生育壓力、精神出軌、手機秘密，說已婚者看完會「產生強烈共鳴」；交友軟體上夫妻互為靈魂伴侶是「全劇最浪漫的安排」。也直說無法接受宜玲與前男友單獨出差、學友與女同事喝醉過夜。立場：推。
     - 原文：「現實當中爭吵不休的夫妻，在網路世界卻變成靈魂伴侶，這是全劇最浪漫的安排。」
   - 反方（作者集中，備用）：關鍵評論網〈TNL+ 影劇〉，徐佑德，2025-02-18，〈【劇評】《童話故事下集》：婚姻與職場描寫缺乏喜劇張力…〉。https://www.thenewslens.com/article/249188 （partial (Exa)，讀到前段）。點出「角色塑造不夠厚實」「婚姻與職場描寫缺乏喜劇張力」「敘事結構略顯頭重腳輕」，並說李念修從短片跳長劇，有「不太『連續』的連續劇狀況」。
   - 不算：遠見魯皓平專訪、中央社洪素津專訪、鏡週刊〈婚姻喜劇藏幸福真諦〉系列（特稿）、GQ／ELLE 看點、愛德華部落格。
   - **建議正文用**：雪奈（推）；若需要反方，引徐佑德的三點缺點並註明他是製片業者。
5. **分歧**：**收視熱、評審冷、豆瓣低**。Netflix 2025 華語劇 #7（210 萬次觀看）、Google 2025 台劇快速竄升 #1、DailyView 2025 #3（ratings 檔）；金鐘 2025 戲劇節目入圍（沒得）、今敏木木 2025 劇評人榜 #9、LINE 聚光賞 2025 台劇 #6（awards 檔）；PTT 2025 前三串推文 5「雖然金鐘摃龜」，另有原 PO「沒有任何驚豔之處」（fans 檔）。豆瓣 7.1 在 beauty321 的 Netflix 台劇榜「落榜」。英文清單外評論都推但都嫌長；台灣評論是雪奈推、徐佑德嫌喜劇張力不足。

## 4. 愛愛內含光（Netflix／麻吉砥加，2024；英文 Let's Talk About CHU）

1. **Metacritic**：沒有頁面（站內搜尋「let's talk about chu」只有 *Chuck*、*Chucky*，read）。
2. **豆瓣**：**7.6（2024-03）→ 7.7（2025）**。BEAUTY美人圈〈Netflix原創台劇豆瓣評分TOP10！…〉（2024-03-07）列 TOP4、7.6（https://www.beauty321.com/post/60663 ，read）；同站 Eve 66671（2025-03-15）列 TOP7、7.7（read (Exa)）；Cosmopolitan 台灣（2025-10-16）也寫 7.7。三聯生活周刊曾于里（2025-12-15）把本劇與此時此刻並稱「普遍6-7分」（read (Exa)，大陸媒體，與 beauty321 有出入）。
3. **英文評論**：
   - Decider，Joel Keller，2024-02-02，〈'Let's Talk About CHU' Netflix Review: Stream It Or Skip It?〉。https://decider.com/2024/02/02/lets-talk-about-chu-netflix-review/ （read (Exa)，讀到大半；**只評第 1 集**）。**清單內**。
     - 摘要：他說這是一家人都性生活不滿足的劇，比只講性的劇更寫實；全家關係讓它不只是一群關係卡住的人；希望多看女主角的衛教影片與她自己生活的對照。給 STREAM IT。立場：推。
     - 原文：「Let's Talk About CHU is light and funny and its family dynamic makes it more than just an exploration of people frustrated in their relationships.」
   - SCMP，James Marsh，2024-02-01，〈Netflix drama review: Let's Talk About Chu – Taiwanese sex comedy starring Chan Tzu-hsuan is a fun and surprisingly honest look at relationships〉。https://www.scmp.com/lifestyle/entertainment/article/3250373/ （partial (Exa)：導言兩點與前兩段，星等沒讀到；評全 8 集）。**清單內**。原文（導言）：「The show's frank approach to sexuality is refreshing, the characters feel real and their approaches to hot-button talking points are honest and relatable」。立場：推。
   - 備用（清單外，不用）：Film Fugitives（Ruchika Bhat，3/5）、Midgard Times（Vikas Yadav，6/10）、The Review Geek、Leisurebyte。
4. **中文評論（台灣）**：
   - 推：換日線（天下雜誌集團）〈轉角的光影沙龍〉，劉沐恩，2024-02-17，〈以「性」之名攻克華語觀眾！Netflix 台劇《愛愛內含光》如何大膽談性說愛？〉。https://crossing.cw.com.tw/article/18634 （read (Exa)；評全劇）
     - 摘要：他用 Giddens「純粹關係」解讀砲友關係的不確定性，說本劇以「性」作為引子，重點在角色由性而生的焦慮與家庭連結；呈現世代差異卻不塑造世代對立。並說本劇不是台版《性愛自修室》。立場：推。
     - 原文：「本劇在形塑世代差異時，並沒有明顯的褒貶、善惡劃分，編導純粹是再現了兩代間對性、愛情與婚姻觀念的落差與衝突。」
   - 有保留：聯合報〈娛樂有評〉，雀雀，2024-03-09，〈台灣性喜劇「愛愛內含光」輔15以上、限制級未滿〉。https://stars.udn.com/star/story/10093/7818252 （read (Exa)）。說講著講著「仍是台灣愛情偶像劇的體質」，詹子萱的性愛戲「顯得較為入門或說點到即止」，最好看的是林哲熹與巫建和的男男線。原文：「故事講著講著，仍是台灣愛情偶像劇的體質，是此劇的整體輪廓樣貌。」
   - 不算：VOGUE 導演專訪、方格子陌熙（與劉沐恩文同）、大陸骨朵（新浪，形式大膽內核保守，大陸媒體）。
   - **建議正文用**：劉沐恩（推）＋雀雀（偶像劇體質的保留）。
5. **分歧**：**Netflix 數據最好的台劇之一，評價中等**。IMDb 7.1（935）、Netflix 2024 上半年台劇第一（230 萬次觀看，TAICCA）、Google 2024 #6、DailyView 2024 #10（ratings 檔）；金鐘 2024 迷你劇集入圍（awards 檔）；LINE 聚光賞 2024 台劇 #7、金鐘人氣票選期中 #11（推文「也太低了」）、Netflix 台灣週榜 #2（fans 檔）。英文 Decider、SCMP 都推；台灣評論與大陸評論的共同保留是「形式大膽、內核偶像劇／保守」。

## 5. 俗女養成記（含 2）（華視／公視／百戲，2019、2021；英文 The Making of an Ordinary Woman）

1. **Metacritic**：沒有頁面（站內搜尋只有 *No Ordinary Family*、*Ordinary Joe*，read）。
2. **豆瓣**：**S1 9.1–9.2、S2 9.3**。S1：澎湃新聞，曾于里，2019-09-18，〈《俗女養成記》：這才是治癒心靈的電視劇啊〉：「《俗女养成记》的豆瓣评分高达9.1分」。https://www.thepaper.cn/newsDetail_forward_4441431 （read (Exa)；大陸媒體，播畢兩週）。BEAUTY美人圈〈近年豆瓣「高評分」台劇Top10〉（2022-10）：「《俗女養成記》第一季在豆瓣有9.2」「《俗女養成記2》9.3」（https://www.beauty321.com/post/51339 ，read）。S2：同站〈近十年豆瓣評分年冠台劇〉（2025-01-06）「2021年 《俗女養成記2》9.3」（https://www.beauty321.com/post/65546 ，read）。
3. **英文評論**：**沒有找到英文署名劇評。** Taipei Times 2021-08-21 社論版 Mike Chang〈TV show celebrates Taiwanese womanhood〉（read (Exa)）是投書（作者自述會計師），談 S2 首集收視壓過奧運閉幕，不是劇評；The Blue & Gold（學生報，2021-11-24）不收；其餘是 MyDramaList 使用者評論。
4. **中文評論（台灣）**：
   - S2，強推：獨立評論〈台北捌玖零〉，米果，2021-10-13，〈有一種障礙叫做俗女2〉。https://opinion.cw.com.tw/blog/profile/57/article/11496 （read (Exa)；評全季）
     - 摘要：她說第二季不輸第一季，「樹立了一道難以超越的俗女障礙」；這是一部沒有主角配角之分的戲，編導掌握了「講重點、不說教、不拖磨」的節奏；她也揭露嚴藝文曾私訊她，說主創看了她 S1 的兩篇文章很開心（**作者與主創有私下往來**，引用時可註明）。立場：強推。
     - 原文：「編導和演員掌握了講重點、不說教、不拖磨的節奏，台詞與演技濃縮到一口shot，入喉之後產生餘韻，讓觀眾各自去品出人生氣味。」
   - S1：米果在文中提到自己 2019 年寫過〈像陳晉文這樣的台灣男人〉〈我也是被養成俗女的陳嘉玲啊！〉兩篇（snippet，未讀）。關鍵評論網 135380、鏡週刊 20190823insight001 都是導演專訪或特稿（read，不算評論）。小人物雜誌 UNBIGGIE（柳繪雨，授權轉載，清單外）說一開始「因為帶入舞臺劇的手法而略感不適應」，看著看著被說服（read (Exa)）。
   - **建議正文用**：米果（S2）。**S1 沒有讀到清單內媒體的署名劇評**，正文寫 S1 時可改用金鐘與豆瓣數據，或註明只找到專訪。
5. **分歧**：**台灣與大陸觀眾、評審都很高，英文圈幾乎零**。IMDb 8.5（980）、豆瓣 2021 年度華語劇 #2（S2，snippet）（ratings 檔）；金鐘 2020 迷你劇集獎（S1）、2022 戲劇節目入圍並得編劇獎（S2）（awards 檔；編劇獎由 UNBIGGIE 文確認，read）；PTT 2019 鄉民票選 #2（463 票）、2020 經典票選 #3、LINE TODAY 2021 最推薦台劇 #2（S2，14.6%）（fans 檔）。英文只有一篇投書和學生報，與它在華語圈的地位落差最大。台灣唯一讀到的保留是「舞台劇式誇張表演」一開始不習慣。

## 6. 影后（Netflix／良人行影業，2024；英文 Born for the Spotlight）

1. **Metacritic**：沒有頁面（站內搜尋「born for the spotlight」沒有任何含 spotlight 的 `/tv/` 結果，read）。
2. **豆瓣**：**7.9（2024-11）→ 8.1 → 8.2**。BEAUTY美人圈，Kristen，2024-11-20，〈近三年豆瓣最高分台劇TOP10！《影后》7.9分…〉列 TOP10、7.9（https://www.beauty321.com/post/64955 ，read）；同站 Eve 66671（2025-03-15）列 TOP6、8.1（read (Exa)）；TVBS 新聞網〈觀點〉楊起鳳（2025-08-12）與 Cosmopolitan 台灣（2025-10-16）都寫 **8.2**（read (Exa)）。分數隨時間上升。
3. **英文評論**：
   - Decider，Joel Keller，2024-11-08，〈'Born For The Spotlight' Netflix Review: Stream It Or Skip It?〉。https://decider.com/2024/11/08/born-for-the-spotlight-netflix-review/ （read (Exa)，讀到大半；**只評第 1 集**）。**清單內**。
     - 摘要：他說這部台灣娛樂圈女演員群像近乎「hang out show」，主線不是強烈的戲劇衝突，核心是薛亞之與周凡的友誼；首集跳來跳去略散。給 STREAM IT。立場：推。
     - 原文：「As soapy as Born For The Spotlight is, it has an amiable charm that comes from the friendship between its leads and the chemistry that comes with it.」
   - The Straits Times，Jan Lee，2024-11-20，〈Binge-worthy: Born For The Spotlight is a perfect platonic love story〉。https://www.straitstimes.com/life/entertainment/binge-worthy-born-for-the-spotlight-is-a-perfect-platonic-love-story （read (Exa)；**清單外**；評全 12 集）。給 **5 星**；說真正的愛情故事是周凡與薛亞之的友誼，敢讓女性角色不討喜，並比作法劇《Call My Agent!》。原文：「It is incredibly romantic, and highlights all the ways in which female friendships are intimate, life-affirming and devastating.」
   - 備用（清單外，不用）：Autostraddle（Rendy Jones，2024-12-05，partial：說同志主題「not explored nearly as much as the marketing promised」）、Leisurebyte、Martin Cid（嫌節奏與結構）。英文維基另提 Esquire（Kwok Ching-yin）與天下雜誌（Wang Tin-yu）兩篇（snippet，原文沒找到）。
4. **中文評論（台灣）**：
   - 批評：獨立評論〈特約作者〉，王鼎棫（挑興文化主編、大學法律系兼任講師），2024-11-21，〈《影后》說出女演員群像，但每個人的結局，最終還是回到男性身上……〉。https://opinion.cw.com.tw/blog/profile/486/article/15546 （read (Exa)；播畢後評全劇）
     - 摘要：他說劇中女演員的最大挑戰依舊圍繞男性，周凡最後追回男友、黎芯妮息影出國，都沒充分鋪陳內心轉折；若只忠實再現壓迫而不嘗試超越，就只是延續既有框架。拿嚴藝文前作《俗女養成記》對照。立場：批評。
     - 原文：「過往演藝圈的女性，往往自限於「成功」或「退出」的二元論，《影后》若能趁機探索更多中間地帶…俗女可以，影后為何不行？」
   - 推：換日線〈小資媽媽今天也很厭世〉（Mio Liang），2025-10-16，〈金鐘大熱門《影后》劇評：奪最佳戲劇、導演、女主配！台灣影視對「群像劇」的新嘗試〉。https://crossing.cw.com.tw/article/20255 （read (Exa)，讀到大半；原文 2024-11-16 首發於方格子）。說本劇沒有雌競，是療癒群像，「戲是假的，而情緒卻都是真實的」。
   - 不算：關鍵評論網 246379 穗波心理師（精選轉載的心理分析）、自由時報影射盤點（新聞）、騰訊等大陸自媒體。
   - **建議正文用**：王鼎棫（性別框架批評）＋小資媽媽／換日線（群像劇肯定）。
5. **分歧**：**獎項大勝、英文高分，台灣與大陸的性別批評集中**。IMDb 7.8（830）、Google 2024 戲劇 #4；DailyView 2024 因時間窗不收（ratings 檔）；金鐘 2025 戲劇節目獎、AACA 2025 台灣區最佳劇集與女主角（楊謹華）、LINE 聚光賞 2024 台劇 #1（awards 檔）；Netflix 台灣週榜多週 #1，但 PTT「幾乎沒有正面推文」、原 PO 嫌「調性弄成陸劇」（fans 檔，G 強 F 弱）。英文 Straits Times 5 星、Decider 推；台灣王鼎棫與英文維基轉述的天下雜誌、大陸豆瓣短評都指向「女性最後還是圍著男人轉」。Autostraddle 則嫌同志線行銷大於內容。

## 7. 拜六禮拜（公視台語台／華視，Netflix 同步，2025；英文 Holiday）

1. **Metacritic**：沒有頁面（站內搜尋「holiday」只有各種 Holiday Special，read）。
2. **豆瓣**：**8.2–8.3**。TVBS 新聞網〈觀點〉，記者楊起鳳，2025-08-12，〈觀點／《拜六禮拜》打敗《影后》 台語劇跨海掀起「鬆弛感」熱潮〉：「它在豆瓣竟拿下8.3高分，打敗了金鐘大熱《影后》的8.2分，創下台灣純台語劇最高紀錄」。https://news.tvbs.com.tw/entertainment/2958110 （read (Exa)）。Cosmopolitan 台灣（2025-10-16）寫 8.2（read (Exa)，時尚雜誌）。
3. **英文評論**：**沒有找到英文署名劇評。** Exa 只回 DramaWiki、MyDramaList（0 則評論）、BL Watcher（BL 劇部落格，不收）。
4. **中文評論（台灣）**：
   - 推：TVBS 新聞網〈觀點〉，楊起鳳，2025-08-12（同上，read (Exa)；播出後期）
     - 摘要：她分析本劇能在大陸取得口碑，是因為結合了豎屏劇的快節奏（精簡敘事、場景集中、情緒快速切換）與台劇的生活鬆弛感；把小三、母胎單身、同志等議題用輕巧幽默處理；並把杜政哲從《若是一個人》《有生之年》到本劇的風格稱為台劇「新鬆弛感」。立場：推（產業觀點）。
     - 原文：「語言不是阻礙是特色；文化不是牆是橋。杜政哲正在用台式「新鬆弛感」為台劇開啟了新的可能性。」
   - 推（作者集中，備用）：獨立評論〈台北捌玖零〉，米果，2025-06-27，〈《拜六禮拜》，正苦也正好的中年〉。https://opinion.cw.com.tw/blog/profile/57/article/16299 （read (Exa)；**播出前幾集，她說「還沒看到結局」**）。原文：「這部劇最偉大的地方，就是給鍾欣凌這麼好的角色，不用超齡去演婆婆。」
   - 不算：雀雀〈抓馬也感性…〉在她的個人站 cheercut.com（2025-06-22，read，非媒體）；鏡週刊〈娛樂透視〉（特稿）；公視劇夠杜政哲專訪；ELLE、Marie Claire、Cosmopolitan 看點文。
   - **建議正文用**：楊起鳳（TVBS 觀點，含豆瓣數據）；要談演員表演時引米果並註明是播出中所寫。
5. **分歧**：**台語劇的豆瓣紀錄，獎項與英文圈還沒有反應**。Google 2025 台劇快速竄升 #7、DailyView 2025 #8（ratings 檔）；今敏木木 2025 劇評人榜 #10、LINE 聚光賞 2025 台劇 #8（awards 檔）；PTT 2025 前三串推文 4（1 人「我的第一名」）、Netflix 台灣週榜 #1（fans 檔；TVBS 文說蟬聯五週）。豆瓣 8.3 高於影后，是本片單「豆瓣與台灣獎項落差」最明顯的一部；讀到的評論都正面，沒有反方。

## 8. 媽，別鬧了！（Netflix，2022；英文 Mom, Don't Do That!）

1. **Metacritic**：沒有頁面（站內搜尋只有 *Mom*、*Dance Moms* 等，read）。
2. **豆瓣**：**6.8**。BEAUTY美人圈〈Netflix原創台劇豆瓣評分TOP10！…〉（2024-03-07）列 TOP8、6.8。https://www.beauty321.com/post/60663 （read；美妝網站）。
3. **英文評論**：
   - Taipei Times，Deanna Durben（Contributing Reporter），2022-08-09，〈Series review: Mom Don't Do That〉。https://www.taipeitimes.com/News/feat/archives/2022/08/09/2003783210 （read (Exa)，全文；評全 11 集）。**清單內，本篇唯一讀到的 Taipei Times 全季劇評**。
     - 摘要：她說最好看的是三母女關係的寫實——用嘮叨與互嗆表達愛是很台灣的方式；不喜歡同學會支線；大女兒最後保持單身「沒有被當成失敗」很重要。立場：推。
     - 原文：「It's not a happy ever after tale, but it feels real. This warm-hearted comedy is definitely worth a watch.」
   - Decider，Joel Keller，2022-07-16，〈'Mom, Don't Do That!' Netflix Review: Stream It Or Skip It?〉。https://decider.com/2022/07/16/mom-dont-do-that-netflix-review/ （read (Exa)；**只評第 1 集**）。給 STREAM IT，但嫌東亞喜劇用音效與配樂提示笑點「distracting」。原文：「Mom, Don't Do That! is a cute show about three women who are really hurting after the death of the family patriarch, and also ready for love.」
   - SCMP，James Marsh，2022-07-15，〈Netflix drama review: Mom, Don't Do That! – Billie Wang, Alyssa Chia lead Taiwanese story about grief, loss and dating〉（partial (Exa)，導言兩點與前兩段）。導言：「The series is about filling a void, and tells the story with sincerity, punctuated with crazy antics and dramatic moments」。
   - 不用：Straits Times Jan Lee（2022-07-20，只看到標題）、Leisurebyte、Asiantv4u。
4. **中文評論（台灣）**：
   - 推（清單外）：Marie Claire 美麗佳人〈觀點〉，穆光光，2022-07-25，〈Netflix《媽，別鬧了！》：看起來像是荒謬搞笑，但卻反映出了不少人的生活、心情，還有那些笑與淚水〉。https://www.marieclaire.com.tw/community/opinion/67217 （read (Exa)；評全劇）
     - 摘要：他說本劇以荒謬喜劇手法處理，情節卻有相當寫實效果；沒有忽略三位主角的缺點，爭執戲能「像一把刀一樣，猝不及防地刺進觀眾內心」；也不打算替觀眾指出明確解答。立場：推。
     - 原文：「《媽，別鬧了！》最為奇妙的地方，也就在於這部影集並沒有要為你指出什麼明確的道路，甚至不認為一切真有什麼正確解答。」
   - 強推（作者集中，備用）：聯合報〈娛樂有評〉，雀雀，2022-07-23，〈好男人好女人都畢業《媽，別鬧了》破格喜劇關照銀髮議題〉。https://stars.udn.com/star/story/10093/6480968 （read (Exa)）。稱「年度最動人銀髮族議題台劇」。
   - 不算：Harper's BAZAAR 香港（劇情整理）。
   - **建議正文用**：穆光光（清單外雜誌，要註明）；若要清單內，用雀雀。
5. **分歧**：**台灣與英文評論一致推，豆瓣偏低**。Netflix 2023 上半年 220 萬小時、Google 2022 台劇快速竄升 #2（ratings 檔）；LINE TODAY 2022 年度台劇票選期中 #3（10.97%）（fans 檔）；awards 檔沒有得獎或年度榜紀錄。豆瓣 6.8 在 Netflix 台劇榜倒數第三。英文三家（Taipei Times、Decider、SCMP）都推，唯一共同的保留是誇張喜劇手法（Decider 嫌音效，MyDramaList 網友也嫌，不收）。

## 9. 比悲傷更悲傷的故事：影集版（Netflix／好好看／滿滿額，2021；英文 More Than Blue: The Series）

1. **Metacritic**：沒有頁面（站內搜尋「more than blue」只有 *Blue Bloods*、*Blue Planet* 等，read）。Rotten Tomatoes 有 2 篇（Decider、Ready Steady Cut），Tomatometer 未成立（read (Exa)，參考）。
2. **豆瓣**：**7.4**。BEAUTY美人圈〈Netflix原創台劇豆瓣評分TOP10！…〉（2024-03-07）列 TOP6、7.4（https://www.beauty321.com/post/60663 ，read）；同站 Eve 66818（2025-03-23）近五年愛情台劇 TOP8、7.4（read (Exa)）。
3. **英文評論**：
   - Decider，Johnny Loftus，2021-10-25，〈'More Than Blue The Series' Netflix Review: Stream It or Skip It?〉。https://decider.com/2021/10/25/more-than-blue-the-series-netflix-review/ （read (Exa)；**只評第 1 集**）。**清單內**。說本劇把一件悲傷疊在另一件上，疊到「developed its own weather system made of sadness」。給 STREAM IT。原文：「More Than Blue is made of the sweet, sad stuff romance junkies will pay money, or at least their monthly Netflix fee, to inject straight into their veins.」立場：推（帶揶揄）。
   - The Review Geek，Greg Wheeler，2021-10-24，〈More Than Blue Season 1 Review – A poignant and well-written remake〉。https://www.thereviewgeek.com/morethanblue-s1review/ （read (Exa)；評全 10 集；**清單外**）。7.5/10；說是扎實的翻拍與催淚劇，但太長、支線多餘，「could easily have been 6 or 7 episodes」。原文：「While the show is a tad overlong and has a few subplots that don't add much to the story, overall this is a solid remake and a real tear-jerker from start to finish.」
   - SCMP Post Magazine〈What a view〉，Stephen McCarty，2022-01-23（partial (Exa)，只讀到前三段），稱本劇「A series to be welcomed by suckers for sentimentality」。
4. **中文評論（台灣）**：**沒有讀到台灣媒體的署名劇評。** 讀到的只有：Togayther〈【劇評】…忠於原著的煽情虐戀，恰到好處的註釋延伸〉（文末註「轉載出處：電影神搜」，作者名沒顯示，read (Exa)，正面）；民視新聞網（2021-12-29，未署名，read）；女人我最大 彭梓瑜（看點整理）；聯合早報（新加坡，演員訪問）。電影神搜原文與作者本輪沒找到（Exa 只回轉載）。
   - **建議正文用**：沒有可用的署名台灣劇評；若必須引用，可用 Togayther 轉載的電影神搜劇評並註明「原作者不明」，或改用金鐘入圍與 MDL 數據。
5. **分歧**：**MDL 粉絲極高、評審與評論中等、台灣評論圈幾乎沉默**。IMDb 8.2（720）、MDL #9 8.4（3,994 人）、Netflix 2023 上半年 110 萬小時（ratings 檔）；金鐘 2022 迷你劇集入圍（awards 檔）；LINE TODAY 2021 最推薦台劇 #9、PTT 推文 1（fans 檔）。豆瓣 7.4；英文評論都推但都說太長或太煽情。MDL 上也有網友直接說「miseryporn」（不收）。是本片單「國際粉絲熱、台灣劇評冷」最極端的一部。

## 10. 人浮於愛（公視／MyVideo／瀚草等，2025；英文 Adrift in Love）

1. **Metacritic**：沒有頁面（站內搜尋「adrift in love」沒有任何含 adrift 的 `/tv/` 結果，read）。
2. **豆瓣**：**7.4**。三聯生活周刊（微信公號），曾于里，2025-12-15，〈今年最大尺度台劇，戳破了當代人的病態「愛欲」〉：「《人浮于爱》豆瓣评分7.4分，在“豆瓣er”对台剧有较厚滤镜的背景下，这个评分中规中矩。」https://www.lifeweek.com.cn/h5/article/detail.do?artId=257644 （read (Exa)；大陸媒體）。百度百科寫 7.3（不採用）。
3. **英文評論**：**沒有找到英文署名劇評**（只有 DramaWiki、MyDramaList 1 則使用者評論）。
4. **中文評論（台灣）**：
   - 推（帶問號）：聯合報〈娛樂有評〉，雀雀，2026-01-10，〈「人浮於愛」愛到發瘋證明愛情最浪漫的事？〉。https://stars.udn.com/star/story/10093/9253363 （read (Exa)；播畢後）
     - 摘要：她說楊祐寧與簡嫚書這對「驚世情侶」讓全劇的瘋狂程度「衝出了台劇新高度」；大階梯邂逅拍得堪比韓劇且帶王家衛氣息；全劇最唯美的愛情其實是范月姣、顧厚澤和魏大為的三角；也點出全劇沒講出來的反派是「麵包」。立場：推。
     - 原文：「愛能載舟亦能覆舟，只是愛的前提沒有麵包是不行的，這大概是全劇沒講出來卻又是最血淋淋的幕後大反派。」
   - 其他：公視劇夠幕後專訪（2025-11-26，平台自家）、高雄電影節映後座談側記（活動紀錄）、popdaily 網友心得，都不算。大陸三聯（同上）是批評：說主線狗血、支線老套，缺乏「當代性」。
   - **建議正文用**：雀雀（唯一讀到的台灣媒體署名評論）；反方引三聯曾于里並註明是大陸媒體。
5. **分歧**：**平台數據好，評論極少，大陸評論給負評**。Google 2025 台劇快速竄升 #5、Netflix 2026 上半年台劇 #9（ratings 檔）；MyVideo 2025 戲劇榜前十（平台自家出品）、PTT 2025 前三串原 PO＋推文 1（fans 檔）；awards 檔沒有紀錄（百度百科說簡嫚書得第 61 屆金鐘女配角，**未核實，snippet**）。台灣只有雀雀一篇；大陸三聯 7.4 分「中規中矩」、批「沉溺於奇觀化展演」。

## 11. 親愛壞蛋（TVBS 原創，LINE TV／Netflix，2023；英文 Lovely Villain）

1. **Metacritic**：沒有頁面（站內搜尋「lovely villain」只有 *House of Villains*、*Lovely Complex*，read）。
2. **豆瓣**：**沒找到媒體引述的分數。**（Exa 搜尋結果直接回了豆瓣 subject 頁與百度摘要，依規定不採用。）
3. **英文評論**：**沒有找到英文署名劇評。** The Straits Times，Jan Lee，2023-05-24，〈In fighting form: Taiwanese actress Sonia Sui feuds with difficult neighbours in Lovely Villain〉只讀到開頭（snippet→partial），看起來是演員特稿，不是劇評。其餘是 MyDramaList 使用者評論。
4. **中文評論（台灣）**：
   - 推：聯合報〈娛樂有評〉，雀雀，2023-06-03，〈「親愛壞蛋」是台版「寄生上流」還是現代大觀園？〉。https://stars.udn.com/star/story/10093/7208695 （read (Exa)；播出後段）
     - 摘要：她說本劇跟上韓劇富豪鬥爭類型，用清水模豪宅、一幅畫、一台生日禮物車點出階級，「聰明極簡」；荒唐轉折像倒吃甘蔗，是「年度台劇群中最具韓劇體質的一齣戲」；項婕如、林暉閔的青少年線讓本劇掙脫狗血鬥爭劇。也嫌上流生活細節不夠多。立場：推。
     - 原文：「窮得只剩下錢不可悲，可悲的是都已財富自由了心靈還得不到自由」
   - 推（清單外，播出中）：Marie Claire 美麗佳人〈觀點〉，潘怡豪，2023-05-04 更新，〈以虛榮慾望與魔鬼牽手！宮鬥影集《親愛壞蛋》刻畫表面光鮮亮麗人們的真實本性〉。https://www.marieclaire.com.tw/community/opinion/72482 （read (Exa)；只到前幾集，含播出平台導流句）。
   - 其他（不算台灣）：聯合早報（新加坡）蔡欣盈，2023-05-15，看完 4 集，說「太過典型」「少了驚喜」（read (Exa)）。PTT、痞客邦、adaymag（香港生活誌）不收。
   - **建議正文用**：雀雀；反方可引聯合早報並註明是新加坡媒體、只看 4 集。
5. **分歧**：**串流有量，口碑薄**。Netflix 2023 上半年 210 萬小時、DailyView 2023 #10（ratings 檔）；LINE TODAY 2023 網友最愛 #17、PTT 2023 懸疑串推文 1「還不錯」（fans 檔）；awards 檔沒有紀錄。豆瓣頁（不採用）顯示 3 星佔多數。台灣雀雀推「韓劇體質」，新加坡聯合早報嫌「熟口熟臉」——同一個「像韓劇」，一正一反。

## 12. 我們六個（大愛電視，2025；英文 The Six of Us）

1. **Metacritic**：沒有頁面（站內搜尋「the six of us」只有 *Daisy Jones & the Six* 等，read）。
2. **豆瓣**：**沒找到媒體引述的分數。**（只有百度摘要與盜版站，不採用。）
3. **英文評論**：**沒有找到英文署名劇評。**
4. **中文評論（台灣）**：
   - 推：聯合報〈娛樂有評〉，雀雀，2025-08-30，〈「我們六個」悲慘卻勵志的戲劇複合體〉。https://stars.udn.com/star/story/10093/8971749 （read (Exa)；播畢後評全 12 集）
     - 摘要：她說大愛劇不會拍得嗜血聳動，幾乎避開所有特殊化妝能大作文章的畫面，轉而把鏡頭對準家人面對慘劇時的表情，所以演技至關重要；馬志翔的父親「想當好人卻終究無能與無力」，大姐游珈瑄、大哥潘親御的線最有戲。立場：推。
     - 原文：「真實故事翻拍成影視作品的魅力，在於創作者加入的觀點，能更有效觸動觀眾反思同理而不再只是停留在看戲層級」
   - 其他：Cheers 快樂工作人（南希不設限書房，編劇林佳慧專訪）、鏡報、中央社（新聞）、ELLE／Harper's BAZAAR／Marie Claire／styletc 看點文、崑山科大轉方格子（導演介紹）都不算。聯合早報（新加坡，2025-08-27，作者未顯示）說孩子成年後的戲「演繹方式流於表面」（read (Exa)，不算台灣）。
   - **建議正文用**：雀雀（唯一讀到的台灣媒體署名評論）。
5. **分歧**：**YouTube 與口碑聲量大，評論與英文圈極少**。Google 2025 台劇快速竄升 #2、DailyView 2025 #6（第 9 集收視 1.05）（ratings 檔）；金鐘 2026 戲劇節目入圍、LINE 聚光賞 2025 台劇 #10（awards 檔）；聯合報〈2025 年度十大台劇〉列 #6，並記 Google 影視關鍵字週榜第一（read (Exa)）。大愛 YouTube 首播、無 Netflix，英文圈與豆瓣都幾乎沒有覆蓋。

## 13. 有生之年（TVBS／八大／華視，Netflix 同步，2023；英文 Living）

1. **Metacritic**：沒有頁面（站內搜尋「living」只有 *Living Single*、*Living with Yourself* 等，read）。
2. **豆瓣**：**8.8**。BEAUTY美人圈，Kristen，2024-11-20，〈近三年豆瓣最高分台劇TOP10〉列 TOP2、8.8（https://www.beauty321.com/post/64955 ，read）；同站 Eve 66671（2025-03-15）列近三年 Netflix 台劇 TOP1、8.8（read (Exa)）；鏡週刊〈娛樂透視〉（2023-10-27）也寫「獲豆瓣評分8.8推薦」（read (Exa)，特稿）。
3. **英文評論**：**沒有找到英文署名劇評。** Taipei Times 只有金鐘六項新聞（2024-10-21，read (Exa)）；其餘是 MyDramaList 1 則使用者評論與片庫網站。
4. **中文評論（台灣）**：
   - 推：電影神搜，潘光中，2023-09-27，〈【劇評】《有生之年》：藏在滿滿生活感背後，都是三無青年求生哀歌〉。https://news.agentm.tw/264892/ （read (Exa)；**播出第 2 集後所寫，他說不知道結局**）
     - 摘要：他說本劇乍看是家庭喜劇，內核卻是嚴肅甚至殘酷的命題——成年人活在社會上的價值是什麼；杜政哲擅長寫親密關係中的疏離；笑鬧處有《俗女養成記》《我的婆婆怎麼那麼可愛》的影子，撇掉嬉鬧更像《大債時代》。立場：推。
     - 原文：「真要說起來，《有生之年》其實是一部逼著觀眾去發掘瑕疵的寫實劇。」
   - 推（作者集中，備用）：聯合報〈娛樂有評〉，雀雀，2023-10-14，〈「有生之年」，吳慷仁的年度成績單算不錯了〉（https://stars.udn.com/star/story/10093/7503396 ，read (Exa)，偏演員論）；獨立評論，米果，2023-10-13，〈在有生之年看了《有生之年》，真好！〉（https://opinion.cw.com.tw/blog/profile/57/article/14152 ，read (Exa)，看到第 10 集，坦言部分人物與情節「會讓我感覺出戲」）。
   - 反方（大陸媒體）：澎湃新聞，曾于里，2023-10-16，〈《有生之年》：台劇的現實感與理想化〉（http://www.thepaper.cn/newsDetail_forward_24945537 ，read (Exa)）。說它「呈現殘酷的現實，訴諸最理想化、最溫情化的解決」。
   - 不算：鏡週刊〈娛樂透視〉（特稿）、關鍵評論網 193487「雞湯來了」（家庭教育組織專欄，偏知識科普）、風傳媒 4884998（方格子轉載）、方格子 R級影評。
   - **建議正文用**：潘光中（播出初期，要註明）；完整版評價可補米果或雀雀，反方用澎湃曾于里（註明大陸媒體）。
5. **分歧**：**獎項、豆瓣、台灣觀眾三方最高，英文零**。豆瓣 2023 年度華語劇 #5、Google 2023 台劇快速竄升 #3、DailyView 2023 #7（ratings 檔）；金鐘 2024 戲劇節目獎＋男女主角、男配角、導演、新人共 6 項，AACA 2024 台灣區男主角、編劇、音效（awards 檔）；LINE TODAY 2023 網友最愛 #2（10.18%）、金鐘人氣票選期中 #4，PTT 有 1 則「最爛的，爛到爆」（fans 檔）。豆瓣 8.8 是本片單最高。分歧只在台灣與大陸評論之間：台灣三位都推，澎湃與方格子 R級影評都說結局「太理想化」。

## 14. 通靈少女（公視／HBO Asia／IFA，2017；英文 The Teenage Psychic）

1. **Metacritic**：沒有頁面（站內搜尋「the teenage psychic」只有 *Psychic Kids*、*Psychic Detectives* 等，read）。Rotten Tomatoes 列 1 篇（Cinema Escapist）。
2. **豆瓣**：**沒找到媒體引述的分數。**
3. **英文評論**：Cinema Escapist，Anthony Kao，2017-11-27，〈HBO's "Teenage Psychic" Actually Feels Taiwanese…and That's Pretty Special〉。https://www.cinemaescapist.com/2017/11/hbo-teenage-psychic-feels-taiwanese/ （read (Exa)，全文；**清單外**；是 HBO 美國上架前的預看評論，看了幾集沒寫明，舉例只到第 2 集）。
   - 摘要：他說本劇最可貴的是處處是台灣味——棒球、媽祖、教官，以及宮廟裡講台語、學校講華語的語言切換；女主角其實是個心理輔導者，很像《深夜食堂》；校園線則是台灣青春劇老套路，但套路之所以存在是因為有效。立場：推。
   - 原文：「If anything, the show demonstrates how a story can be both universally appealing yet quintessentially Taiwanese; it's not one or the other.」
   - 其他：Rappler 印尼版 Nadia Vetta Hamid（2017-04-02，印尼文，只看前 2 集，不收）；Asia Times 劉秀文（產業報導，snippet）。
4. **中文評論（台灣）**：NOWnews〈柯志遠劇評〉，柯志遠，2017-04-24，〈通靈少女：鑿通活水源頭的新型好戲〉。https://www.nownews.com/news/2496564 （read (Exa)，全文；**播出中，看到第 3 集後**）
   - 摘要：他說本劇是「娛樂性」與「人文性」兼具的好戲，用宮廟文化強化「題材辨識度」但不譁眾取寵，「通靈」碰觸鬼的世界、體現的卻是人的故事；郭書瑤是全劇的靈魂，蔡凡熙基本功仍有成長空間但自然生動。立場：強推。
   - 原文：「《通靈少女》是一齣「娛樂性」與「人文性」兼俱，「通俗性」與「文學性」都強的，好看的好戲。」
   - 其他：黑手黨〈黑電視〉（電影推薦王轉載，部落格，不收）。中文維基提到傳播學者羅慧雯、作家曹銘宗、學者祁立峰的專文（snippet，未讀）。
   - **建議正文用**：柯志遠（要註明是播出中所寫）。
5. **分歧**：**收視創紀錄，結局引發觀眾不滿**。TDI 最高收視 4.40（2017-04-30）（ratings 檔）；公視新聞稿寫完結篇瞬間收視 4.61、同時 128 萬人收看（read (Exa)，平台自家）；金鐘 2017 迷你劇集獎＋李千娜女配角，另入圍女主角、新人、導演、編劇（awards 檔；中文維基確認）；PTT／Dcard 討論弱（fans 檔，強度弱）。中文維基記載完結篇阿樂車禍死亡引發網友不滿，也有評論認為宮廟與金老師最後沒發揮作用（snippet）。英文只有一篇清單外預看評論。

## 15. 此時此刻（Netflix／百聿數碼／天予，2023；英文 At the Moment）

1. **Metacritic**：沒有頁面（站內搜尋「at the moment」只有 *The Moment*、*Moment of Truth* 等，read）。
2. **豆瓣**：**6.7**。BEAUTY美人圈〈Netflix原創台劇豆瓣評分TOP10！…〉（2024-03-07）列 TOP9、6.7（https://www.beauty321.com/post/60663 ，read；tw1 檔尾線索相符）。三聯生活周刊曾于里（2025-12-15）也說「普遍6-7分」（read (Exa)）。
3. **英文評論**：
   - Ready Steady Cut，Jonathon Wilson，2023-11-11，〈At the Moment Season 1 Review – A sweet but longwinded Taiwanese anthology〉。https://readysteadycut.com/2023/11/11/at-the-moment-season-1-review/ （read (Exa)；評全 10 集；**清單外**）。
     - 摘要：他說本劇不是真正的疫情劇；甜、偶爾悲傷、明星陣容撐起大半；最大問題是每集約一小時「altogether too long」，不適合一口氣追。立場：有保留的推。
     - 原文：「The makers of this series knew what they were doing – they just seemed so excited by the prospect that they forgot to end every episode half an hour earlier.」
   - Decider，Joel Keller，2023-11-10，〈'At The Moment' Netflix Review: Stream It Or Skip It?〉。https://decider.com/2023/11/10/at-the-moment-netflix-review/ （read (Exa)；**只評第 1 集**；**清單內**）。給 STREAM IT，但說疫情背景「distracting」，口罩戴脫不一致。原文：「If you can get past the distracting pandemic part of each story, At The Moment should give viewers some entertaining, albeit light, love stories to watch.」
   - 備用（清單外）：The Review Geek（Greg Wheeler，6.5/10，「well-written but poorly-timed」）、Leisurebyte、The Envoy、BusinessMirror。
4. **中文評論（台灣）**：
   - 推：獨立評論〈台北捌玖零〉，米果，2023-11-17，〈看完台劇《此時此刻》，像讀完10部短篇小說〉。https://opinion.cw.com.tw/blog/profile/57/article/14264 （read (Exa)；全劇完食後）
     - 摘要：她把本劇比作日本式連作短篇小說集，十集互為主配角最後繞成一個圓；逐集點評，最愛第 8 集〈一家之主〉，也承認情節「大概猜得到大半」、第 5、9 集「有點普通」，定位為「大眾文學的直木賞」。立場：推。
     - 原文：「愛情題材原本就很吸引人，《此時此刻》感覺起來就像讀了大眾文學路線的10個短篇小說，純粹被戲劇討好，順順地看下去，其實也不錯。」
   - 反方：電影神搜，潘光中，2023-11-15，〈【劇評】Netflix《此時此刻》：名為「浪漫」的奢侈，其實是一種不可原諒的「浪費」〉。https://news.agentm.tw/268119/ （read (Exa)）。說十個故事拿去拍 MV 都行，拉成一小時單元「太單薄無力」，製作費破億（含文化部 2,000 萬獎助）卻「這麼稀爛的成品」。原文：「打著「浪漫」之名行「浪費」之實，對已經相當不容易的華劇製作環境，是一種不可原諒的奢侈啊你們知道嗎？」
   - 其他：方格子〈第九、十集〉（作者不明）、Harper's BAZAAR 香港（Tracy Chan，香港雜誌，推）不算。
   - **建議正文用**：米果（推）＋潘光中（強烈反方）並列——是本片單台灣評論分歧最大的一部。
5. **分歧**：**卡司與評審肯定，評論兩極，豆瓣最低**。IMDb 6.9（520）、Google 2023 台劇快速竄升 #5、DailyView 2023 #6（ratings 檔）；金鐘 2024 戲劇節目入圍、AACA 2024 台灣區女配角（徐熙娣）（awards 檔）；LINE TODAY 2023 網友最愛 #6、金鐘人氣票選期中 #10（fans 檔）。豆瓣 6.7 是本片單有分數者中最低。英文 RSC、Decider、Review Geek 的共同保留是「太長」與「疫情設定多餘」；台灣米果推、潘光中狠批，連「浪漫」與「浪費」都成了對立的標題。

## 16. 忘了我記得（Netflix／奇幻娛樂，2025；英文 Forget You Not）

1. **Metacritic**：沒有頁面（站內搜尋「forget you not」只有 *Don't Forget the Lyrics*，read）。
2. **豆瓣**：**8.3**。Cosmopolitan 台灣，Lily Chang，2025-06-06，〈Netflix《忘了我記得》越紅越有爭議？為何評價兩極？…〉：「在豆瓣有8.3高分，IMDb也有7.3的優秀評價」。https://www.cosmopolitan.com/tw/entertainment/movies/g64985856/forget-you-not-issue/ （read (Exa)；時尚雜誌）；同媒體 2025-10-16 也寫 8.3。ratings 檔記「豆瓣 2025 評分最高華語劇 #4（8.3）」相符。
3. **英文評論**：
   - But Why Tho，Sarah Musnicky，2025-05-25，〈Forget You Not Review: It Finds Hope In Impermanence〉。https://butwhytho.net/2025/05/forget-you-not-review-netflix/ （read (Exa)；評全 8 集；**清單外**）。
     - 摘要：她說本劇在父女二人的存在處境與片刻喜悅之間取得平衡，秦漢「astoundingly good」，謝盈萱的悲傷歷程真實可感；某些照護場面讓人不適但可以理解，不是容易看的劇卻是必要的。立場：強推。
     - 原文：「This makes Forget You Not not an easy watch, but a necessity. In a way, it prepares us for the end.」
   - Decider，Joel Keller，2025-05-23，〈'Forget You Not' Netflix Review: Stream It Or Skip It?〉。https://decider.com/2025/05/23/forget-you-not-netflix-review/ （read (Exa)；**只評第 1 集**；**清單內**）。給 STREAM IT，但說劇中單口喜劇透過字幕看不出好笑在哪。原文：「Forget You Not is a sweet, emotional take on caring for aging parents, told through the perspective of a woman's stand-up act.」
   - SCMP，James Marsh，2025-05-18/19，〈Netflix drama Forget You Not: Hsieh Ying-xuan, Chin Han lead Rene Liu-directed melodrama〉（partial (Exa)：只讀到前兩段，星等與評價沒讀到）。tw1 標「評論或前瞻未確認」——本輪看到 Lead cast 欄位格式，像評論，但評價段落沒讀到，**仍不能當評論用**。
   - 備用（清單外）：Midgard Times（Vikas Yadav，5/10，「Should Have Been A Film」）、Common Sense Media（嫌謝盈萱「doesn't fully rise to the emotional demands」）、K-waves and Beyond。
4. **中文評論（台灣）**：
   - 推，有保留：關鍵評論網〈TNL+ 影劇〉，徐佑德，2025-05-26，〈【劇評】Netflix劉若英《忘了我記得》：謝盈萱與秦漢教科書級演繹，並非無懈可擊卻真誠溫柔〉。https://www.thenewslens.com/article/253417 （partial (Exa)，讀到前三成；評全 8 集）
     - 摘要：他說本劇逆著平台強情節、快節奏的潮流，選擇沉潛慢燉，某種程度很「公視」或「金鐘劇」；前期敘事稍嫌溫吞，靠最後三集導演與演員「拉尾盤」，以情感大於工整劇本取勝。立場：推，有保留。
     - 原文：「這或許不是一部在情節上無懈可擊的完美劇集，甚至在某些時刻會挑戰觀眾的耐性。不過它擁有一顆真誠而溫柔的心」
   - 其他：雀雀〈台劇《忘了我記得》為秦漢預約人生首座金鐘影帝獎座〉（https://stars.udn.com/star/story/10093/8775172 ，tw1 線索，本輪沒讀到，snippet）。Cosmopolitan 2025-06-06（爭議整理，含家庭照顧者關懷總會陳景寧的批評，導流文）、自由時報與緯來（抄襲爭議新聞）、劉若英貼文都不算評論。
   - **建議正文用**：徐佑德（本片單他唯一一次建議選用）；抄襲與長照爭議用新聞處理，不當評論。
5. **分歧**：**豆瓣與評審高，台灣社群兩極，還有抄襲與長照兩個場外爭議**。MDL #52 7.8、豆瓣 2025 年度華語劇 #4（8.3）、Google 2025 台劇快速竄升 #4、DailyView 2025 #2（ratings 檔）；金鐘 2026 迷你劇集入圍、今敏木木 2025 劇評人榜 #4、LINE 聚光賞 2025 台劇 #4（awards 檔）；PTT 2025 前三串原 PO 第一名，但也有「略嫌單薄」「已經是平台流水線的一部」（fans 檔）。場外：作家唐墨指與《了不起的麥瑟爾夫人》相似（Netflix 否認）、家庭照顧者團體批評長照描寫脫離現實（劉若英承認「稍微浪漫化」）（自由時報、Cosmopolitan，read (Exa)）。英文 But Why Tho 強推、Midgard Times 嫌太長；Decider 與 Common Sense Media 都說單口喜劇不好笑——這一點中英評論與台灣網友一致。

---

## toolDegradation

- **2026-11-26 → 11-28（本輪；中途遇用量上限，重置後續做）**：
  - **Groundlane MCP**（ToolSearch 載入 `web_search`、`web_fetch`、`web_extract`）：可用。只用了 `web_extract`：Metacritic 16 部站內搜尋、beauty321 五篇排行小標（60663、64955、65546、51339、61322）都順利。第一次 pattern 用了捕捉群組，只回群組字串，改成不含群組的 pattern 後正常（不是工具故障）。`web_search`、`web_fetch` 本輪沒用到。
  - **Exa**（`web_search_exa`）：主力。搜尋結果本身附長段全文摘錄，大多數評論都從這裡讀到（標 read (Exa)）。限制：SCMP 只附導言與前兩段（付費牆）；關鍵評論網 TNL+ 只附前段；Douban 與百度頁會混在結果裡，已全部捨棄。`web_fetch_exa` 本輪沒用到。
  - **jina**、**Tavily**、**firecrawl**：本輪沒用到（Exa 已足夠；firecrawl 依指示可能沒額度，未試）。
  - 終端機 `curl` 依指示不用。沒有讀豆瓣 subject 頁，沒有繞過 sec.douban.com。

## 待補與注意

1. **Decider 六篇全是首集評**（影后、愛愛內含光、媽別鬧了、比悲傷、此時此刻、忘了我記得）。正文用 Decider 時一律寫「首集評」，或改用全季評（Taipei Times 媽別鬧了、RSC 此時此刻、But Why Tho 忘了我記得、Straits Times 影后）。
2. **SCMP 四篇只讀到導言**（愛愛內含光、媽別鬧了、忘了我記得、比悲傷），連星等都沒讀到，正文只能引導言句，不能寫分數。忘了我記得那篇仍無法確認是不是評論。
3. **播出中或只看前幾集的台灣評論**：芬多經（不夠善良，第 1–2 集）、Maple（想見你，約第 5 集）、潘光中（有生之年，第 2 集後）、柯志遠（通靈少女，第 3 集後）、米果（拜六禮拜，播出中）、潘怡豪（親愛壞蛋，前幾集）。Cinema Escapist（通靈少女）是預看，集數不明。
4. **仍找不到**：比悲傷更悲傷的故事：影集版 的台灣署名劇評（電影神搜原文作者未找到）；想見你、俗女養成記、拜六禮拜、人浮於愛、親愛壞蛋、我們六個、有生之年 的英文署名劇評；親愛壞蛋、我們六個、通靈少女 的媒體引述豆瓣分數；俗女養成記 S1 的清單內台灣署名劇評（只有專訪與 S2 評論）。
5. **只有一位作者的劇**：人浮於愛、親愛壞蛋、我們六個 都只有雀雀（清單內）；若正文想再分散，只能改用新加坡聯合早報或大陸三聯作反方，並註明地區。
6. 豆瓣分數大多來自 beauty321（美妝網站）與 Cosmopolitan（時尚雜誌）的排行清單，建議正文寫成「據台灣媒體整理」並註明時間點；不夠善良（9.0→8.3）、影后（7.9→8.2）分數有明顯變動，要寫明是哪個時間點。
7. 未核實：人浮於愛「第 61 屆金鐘女配角」只見於百度百科；英文維基轉述的影后 Esquire 與天下雜誌評論原文沒找到。
