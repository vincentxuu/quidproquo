# Post kr5 評價資料表：韓劇｜人生、家庭與時代劇 14 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-08。片單來源：`post-kr5-shows.txt`。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic S1 Metascore＋評論數 | `metacritic.com/tv/<slug>/season-1/`，抓 `title="Metascore N out of 100"`、`See All N Critic Reviews` | Groundlane `web_extract`（render=never） | 14 部全測；只有《苦盡柑來》有頁面（tbd，2 則）；`mr-sunshine` 是 2011 年 ABC 同名喜劇，不是本劇；其餘 12 個猜測 slug 皆 404 |
| 豆瓣 | 只收 (a) Exa 快取的豆瓣頁面、(b) 新聞文章引用 | Exa `web_fetch_exa` | subject 頁直抓：`movie.douban.com` 回 CRAWL_HTTP_403、`m.douban.com` 逾時，**沒有讀到任何 subject 頁**；改用 Exa 快取的**豆列頁**（豆瓣自動帶出該劇分數與人數，快取日期不明）＋新聞。豆列頁不是 subject 頁，標 **cache（豆列）**，寫文前請決定要不要採用。沒繞 sec.douban.com |
| 英文評論 | 具名評論者、主要媒體 | Exa 搜尋→`web_fetch_exa` 讀原文；Groundlane 試 SCMP | SCMP 全部付費牆（只讀到導言），所以 SCMP 不當主評 |
| 台灣中文評論 | 釀電影、鳴人堂、關鍵評論網、電影神搜、聯合報〈聯合好評〉等 | Exa 搜尋／`web_fetch_exa`；Groundlane 確認作者 meta | 見各條 |

標記：**read** = 工具讀到內文全文或幾乎全文；**read (Exa cache)** = Exa 快取副本；**partial** = 只讀到一部分；**snippet** = 只有搜尋摘要，**不算讀到、不採用**。

> 英文媒體使用次數（上限 3）：NME 3、Korea Herald 2、Decider 1、RogerEbert.com 1、The New Yorker 1、The Hindu 1、Korea Times 1、Korea JoongAng Daily 1、The Straits Times 1、India Today 1。

---

## 1. When Life Gives You Tangerines 苦盡柑來遇見你（Netflix, 2025）

1. **Metacritic S1**：**no Metascore（tbd）**，只有 2 則評論：RogerEbert.com 80、Decider 60。https://www.metacritic.com/tv/when-life-gives-you-tangerines/season-1/ （read）
2. **豆瓣**：**9.4（324,956 人）**，豆列 https://www.douban.com/doulist/160360660/ （cache（豆列），快取時間約 2025-07 之後）。新聞：游民星空 2025-03-29〈《苦尽柑来遇见你》豆瓣涨至9.5分 近年来韩剧最高分〉，同文引述 MyDramaList 9.0、IMDb 9.3。https://www.gamersky.com/news/202503/1904705.shtml （read，Exa）。subject id 36053256（由獲獎頁網址得知，subject 頁本身沒讀到）。
3. **英文評論**：RogerEbert.com，Sherin Nicole，2025-03-07，〈The Sweet and Sour K-Drama "When Life Gives You Tangerines" Measures Life in Four Seasons of Love〉。https://www.rogerebert.com/streaming/when-life-gives-you-tangerines-korean-netflix-tv-review-2025 （read (Exa cache)；根據前 4 集）
   - 摘要：說它不屬於任何單一類型，是鬧劇、日常、愛情與懸疑的總和；提醒只看過《魷魚遊戲》的觀眾要準備好慢節奏，並稱讚夜景攝影與廉惠蘭的母親角色。
   - 原文：「I cried as much as I giggled, and I hope it's the same for you.」
4. **台灣中文評論**：釀電影，Yin（作者欄自介「出版社主編」），2025-05-15，〈《苦盡柑來遇見你》：她為我揚起帆，我想與她一同航向遠方〉。https://filmaholic.tw/series/6824a2abfd89780001af6c8a/ （read (Exa cache)；作者經 Groundlane meta 確認）
   - 摘要：把全劇讀成「女性三代的血淚史」——光禮的依附、愛純的壓抑、金明終於能選擇；最動人的一幕是金明先跳上「女人上船會觸霉頭」的漁船；結尾讓光禮轉世成出版社長，是要觀眾「活出自己所選擇的自己」。
5. **分歧**：
   - 評論內部有落差：Decider（Joel Keller）給 60，認為 slice-of-life 沒有衝突、第一集「snail-like」，「your enjoyment of the series will fully depend on your tolerance of shows that are more dependent on slice-of-life stories than plot and conflict」（https://decider.com/2025/03/07/when-life-gives-you-tangerines-netflix-review/ ，partial，Exa 摘錄）；觀眾端豆瓣 9.4–9.5、IMDb 9.3。
   - 華語圈有逆向批評：Openbook 閱讀誌〈東亞情勒三寶：吃苦、犧牲、內疚——評《苦盡柑來遇見你》〉（2025-04-25，作者未讀到）批評全劇美化代際犧牲，「離現代意義上的女性主義似乎還很遠」。https://www.openbook.org.tw/article/p-70882 （partial：Exa 摘錄；直連被 bot 驗證頁擋，未繞過）

## 2. Our Unwritten Seoul 未知的首爾（tvN／Netflix, 2025）

1. **Metacritic**：no Metascore（`our-unwritten-seoul` 404）。
2. **豆瓣**：**8.6（58,876 人）**，豆列 https://m.douban.com/doulist/161789607/ （cache（豆列）；豆列建立於 2025-06-18，播出未完，人數是播出中途的）。虎嗅轉載 Sir電影 2025-06-06 文稱「豆瓣8.8，評分還在上漲」（https://www.huxiu.com/article/4432420.html ，partial，Exa 摘錄）。
3. **英文評論**：Decider，Joel Keller，2025-05-27，〈Stream It Or Skip It: 'Our Unwritten Seoul' On Netflix…〉。https://decider.com/2025/05/27/our-unwritten-seoul-netflix-review/ （read (Exa cache)；只評第 1 集）
   - 摘要：第一集長達 80 分鐘，但朴寶英一人分飾雙胞胎（實際是四種狀態）演得像兩個演員；判定 STREAM IT，稱是「heartfelt story of twin sisters」。
   - 原文：「we weren't 100% sure that both sisters were being played by the same actor」
4. **台灣中文評論**：聯合報〈聯合好評〉，雀雀（影評人），2025-07-13，〈雀雀／韓劇「未知的首爾」朴寶英 接力柯佳嬿「想見你」成雙面女王〉。https://udn.com/news/story/7341/8868686 （read，Exa；短評全文）
   - 摘要：視為《我的出走日記》的變形——換身分帶來的解脫感本身就是救贖；姊妹吵架像自己和自己對話，呈現「當代人的精神內耗」；稱讚以時間累積的愛情線，並指出它與導演朴信宇前作一樣帶有防自殺宣導意味。
5. **分歧**：首播收視低（Khan 英文版稱首集 3.6%、第 10 集 7.7%，snippet 未讀全文，不採用），但口碑一路上升；MK 2026-03-03 報導編劇李江被列入 CJ ENM「Visionary」並稱本劇被拿來與《我的大叔》《我的出走日記》《我們的藍調時光》並列（https://www.mk.co.kr/en/culture/11977458 ，partial）。沒有找到具名評論的明顯負評。

## 3. You and Everything Else 妳和其餘的一切（Netflix, 2025）

1. **Metacritic**：no Metascore（`you-and-everything-else` 404）。
2. **豆瓣**：沒有讀到（subject 頁 403；未找到引用分數的新聞或豆列快取）。
3. **英文評論**：The Korea Herald，Lee Yoon-seo，2025-09-30，〈Kim Go-eun, Park Ji-hyun unpack emotional layers of 'You and Everything Else'〉。https://www.koreaherald.com/article/10586793 （read (Exa cache)）
   - ⚠ 性質：開頭四段是記者評析，後半是兩位主演的專訪；不是純評論。
   - 摘要：認為本劇不靠劇情鉤子，而靠記憶、悔恨、渴望慢慢累積，不是可以隨手狂刷的劇；伏筆要重看才浮現。
   - 原文：「the series is less about plot twists than it is about the subtle accumulation of memory, regret and longing」
   - 補充（負評，partial）：SCMP，James Marsh，2025-09-12，3/5，副標稱「melodramatic and infuriating K-drama」。https://www.scmp.com/lifestyle/k-drama/k-drama/article/3325109/ （partial：Groundlane 只讀到星等與導言，其餘付費牆）
4. **台灣中文評論**：聯合報〈聯合好評〉，雀雀（影評人），2025-11-02，〈雀雀／「妳和其餘的一切」愛恨昇華閨密情〉。https://udn.com/news/story/7341/9111778 （read，Exa）
   - 摘要：放在《小婦人》到《七月與安生》的女性情誼譜系裡讀；兩人的雌競是「超越和自證」，真正在乎的只有彼此，男主角結局沒交代也沒人在意。
   - 備選：風傳媒，季凡，2025-09-26，〈把嫉妒磨成路標——《妳和其餘的一切》劇評〉（用「折現率」比喻關係）。https://app.storm.mg/article/11070345 （read，Exa）
5. **分歧**：英文評論兩極——Korea Herald 讚其沉靜；SCMP 3/5 嫌其通俗劇化。英文長評（LoveIsPop，Michael McCarthy，小媒體）也說後段把兩位女主都寫得難以同情、安樂死主線像「grafted onto a different type of drama」（partial）。

## 4. The Good Bad Mother 壞媽媽（JTBC／Netflix, 2023）

1. **Metacritic**：no Metascore（`the-good-bad-mother` 404）。
2. **豆瓣**：只有 snippet（百度摘要「8.1 分，27,828 人評價」），**不採用**。
3. **英文評論**：NME，Carmen Chin，2023-05-05，〈'The Good Bad Mother' review: authentic and unapologetically raw〉。https://www.nme.com/reviews/tv-reviews/the-good-bad-mother-kdrama-netflix-review-lee-do-hyun-ra-mi-ran-3439849 （read (Exa cache)；根據前 4 集）
   - 摘要：羅美蘭把母親的強悍與脆弱演到極致，與李到晛的對手戲真實得可怕；劇本裡連反派都不落入 K-drama 刻板角色。
   - 原文：「The Good Bad Mother is unapologetically raw and heartfelt」
4. **台灣中文評論**：電影神搜，黃小惠，2023-06-10，〈【完結劇評】羅美蘭x李到晛《壞媽媽》：添加犯罪復仇來調味的溫馨親情劇〉。https://news.agentm.tw/289133/ （read (Exa cache)）
   - 摘要：「集韓劇三寶」的催淚作，主線是母親從七歲心智的兒子身上反省錯誤教養；稱讚李到晛在成人與七歲之間切換、恢復記憶後「裝七歲」的細微差異；嫌滲識一角太薄。結局 12.0%，JTBC 水木劇第一。
5. **分歧**：英文圈有尖銳的身障再現批評——Digital Spy〈The Good Bad Mother doubles down on a terrible trend in TV〉（2023-05-25，Exa 結果未顯示署名）指本劇把癱瘓與心智退化當成母親贖罪的工具、「abuse apologism」。https://www.digitalspy.com/tv/a44000799/the-good-bad-mother-netflix/ （partial，Exa 摘錄）。與 NME 和台灣評論的溫情解讀方向相反。

## 5. Reply 1988 請回答1988（tvN, 2015–16）

1. **Metacritic**：no Metascore（`reply-1988` 404）。
2. **豆瓣**：**9.7（1,063,880 人）**，豆列 https://www.douban.com/doulist/1553529/ （cache（豆列））；另一豆列「韓劇豆瓣評價人數排名」也列為第 1 名，9.7（1,063,588 人）https://www.douban.com/doulist/153342039/ （cache（豆列））。
3. **英文評論**：The New Yorker，Matthew Trammell，2016-05-29，〈The Power of Pop Culture in "Reply 1988"〉。https://www.newyorker.com/culture/culture-desk/a-korean-television-show-about-the-power-of-pop-culture （partial：Exa 快取讀到約前七成，含主要論點）
   - 摘要：把本劇放在美國「憤怒、陰鬱」的高峰電視對照下看，它的笑點與鄰里情本身就是一種懷舊；1988 奧運年讓流行文化成為孩子們看見世界的窗口。
   - 原文：「Good gags prevail over plot twists: there are no dramatic deaths, scenes of infidelity, or fixed villains.」
4. **台灣中文評論**：**沒有找到**台灣作者的具名評論。搜尋：「《請回答1988》 劇評 釀電影／鳴人堂／端傳媒／電影神搜」、「請回答1988 台灣 評論 專欄」（Exa）。
   - 退而求其次（⚠ 非台灣作者）：關鍵評論網 2017-11-10 書摘〈《請回答1988》懷舊系列：以嚴謹考證的生活史來重現時代氛圍〉，作者李昇翰（韓國評論者），譯者張琪惠，摘自《讀取時代欲望的企劃力》（不二家）。https://www.thenewslens.com/article/82414 （read，Exa）。重點：從青春劇轉成家庭劇、拉進 40 世代觀眾；也承認「一味美化過去，也是某種程度的退步」。
5. **分歧**：結局爭議——The Korea Times〈As we say goodbye to 'Reply 1988'〉（2016-01-17，未署名）記錄觀眾不滿正煥（柳俊烈）由男主角降為配角、德善最後選阿澤「unconvincing」，受訪者猜編劇因劇透外流臨時改結局。https://www.koreatimes.co.kr/entertainment/shows-dramas/20160117/as-we-say-goodbye-to-reply-1988 （partial，Exa 摘錄）。收視 19.6% 是當時有線台紀錄（同文）。

## 6. My Mister 我的大叔（tvN, 2018）

1. **Metacritic**：no Metascore（`my-mister` 404）。
2. **豆瓣**：只有 snippet（豆列摘要「9.4（193,471 人）」，約 2019 年資料；百度百科「9.4」），**不採用**。
3. **英文評論**：**沒有找到主要媒體的具名評論**。搜尋：Exa「My Mister review IU Lee Sun-kyun NME/Guardian/Polygon/SCMP/JoongAng/Paste」、「My Ajusshi column critic Korea Times/JoongAng/Guardian」；Groundlane web_search（you.com）。
   - 退而求其次（⚠ 非主要媒體）：3 Quarks Daily，Brooks Riley，2020-07-13，〈The 'beauty of sorrow' in the TV masterpiece, My Mister〉。https://3quarksdaily.com/3quarksdaily/2020/07/the-beauty-of-sorrow-in-the-tv-masterpiece-my-mister.html （partial，Exa 摘錄）。原文：「This is no May-December story.」
   - 背景（非評論）：The Korea Herald，Im Eun-byel，2018-04-12，〈Comforting life through meeting 'My Mister'〉，記者會報導，記錄開播前的年齡差爭議。https://www.koreaherald.com/article/1643217 （partial）
4. **台灣中文評論**：釀電影，怒怒心理師，2022-07-02，〈《我的大叔》：在痛苦裡鑿光，直到不幸消亡〉。https://filmaholic.tw/series/62c06138fd89780001bc8ff4/ （partial：Exa 摘錄前半；作者以 Groundlane meta 確認）
   - 摘要：把朴東勳寫成「良心先行」而被職場與婚姻擠壓的人，「沒有什麼大不了」讓他放下；李至安代表貧窮線上的邊緣人，劇集以細節描寫貧窮而不流於奇觀消費；政治鬥爭支線「稍嫌枯燥、樣板」。
   - 備選：關鍵評論網（方格子轉載），高紹沖，2023-12-28，〈《我的大叔》：李善均、IU困在名為「人生」的牢籠…〉。https://www.thenewslens.com/article/196676 （read，Exa）
5. **分歧**：開播前因 45 歲與 21 歲主角設定被批「大叔—少女」戀，IU 又背負〈Chat-shire〉的爭議（Korea Herald 2018-04-12，partial）；Cine21 문강형준（2018-04-12，〈로맨스의 불가능성〉）反駁說本劇恰恰「不存在羅曼史」，核心是新自由主義下的債務與派遣（https://cine21.com/news/view/?mag_id=89870 ，partial）。播出後成為「人生劇」，2019 百想最佳電視劇（維基 snippet，未核）。

## 7. Our Blues 我們的藍調時光（tvN／Netflix, 2022）

1. **Metacritic**：no Metascore（`our-blues` 404）。
2. **豆瓣**：澎湃號·新周刊 黎塞普 2022-05-03 稱「《我們的藍調》在豆瓣上獲得8.5的評分」（播出中途）。https://www.thepaper.cn/newsDetail_forward_17917810 （read，Exa）。人數未知。
3. **英文評論**：NME，Tanu I. Raj，2022-04-21，〈'Our Blues' review: people can be unhappy in the happiest of places〉。https://www.nme.com/reviews/tv-reviews/our-blues-review-k-drama-netflix-tvn-3209396 （read (Exa cache)；根據前 4 集）
   - 摘要：擔心群像劇常貪多，但本劇以「誰和誰」分章，讓每段故事有空間展開；盧熙京與金圭泰營造社區感，預言它會成為「understated, silent winner」。
   - 原文：「people can be unhappy in the happiest of places」
4. **台灣中文評論**：釀電影，Kristin，2022-06-26，〈沒有人是一座孤島──《我們的藍調時光》〉。https://vocus.cc/article/62b7d12ffd89780001b1c4a4 （read (Exa cache)；釀電影 vocus 鏡像）
   - 摘要：稱讚以兩兩人名分集的「教科書等級」敘事；把憂鬱症、唐氏症、未婚媽媽等議題融進通俗情節；終章玉冬與東昔的和解，取材自盧熙京與亡父的真實關係。
5. **分歧**：高中生懷孕支線在中文觀眾間有反彈（4kcine 聚合頁轉錄的豆瓣熱門短評，snippet，不採用）；台灣 PTT 網友討論《藍調》與《出走》孰優（網路溫度計 DailyView 2022-05-27，非評論）。豆瓣播出中 8.5，比同期《我的出走日記》9.1 低（澎湃同文）。

## 8. My Liberation Notes 我的出走日記（JTBC／Netflix, 2022）

1. **Metacritic**：no Metascore（`my-liberation-notes` 404）。
2. **豆瓣**：澎湃號·新周刊 2022-05-03，「評分高達9.1」，「64.7%的觀看者給出五星好評」（播出中途）。https://www.thepaper.cn/newsDetail_forward_17917810 （read，Exa）。
3. **英文評論**：The Hindu，Prabalika M. Borah，2022-05-07，〈'My Liberation Notes' review: A mature, empathetic K-Drama that keeps you wanting more〉。https://www.thehindu.com/entertainment/movies/my-liberation-notes-review-a-mature-empathetic-k-drama-that-keeps-you-wanting-more/article65384579.ece （read (Exa cache)；根據前 8 集）
   - 摘要：細膩寫內向者的挫折，「解放」同好會只有三個彼此自在的成員；三兄妹不直說的手足愛在第 8 集一場戲中自然流露；通勤日常拍得不重複。
   - 原文：「A thought-provoking drama that shows the life of a simple hard-working family」
4. **台灣中文評論**：鳴人堂，彭紹宇，2022-06-16，〈《我的出走日記》：如何解放受社會束縛的自我？一段關係與情感的自白〉。https://opinion.udn.com/opinion/story/120973/6392665 （read，Exa）
   - 摘要：指出劇名直譯應是「解放日誌」；從「他人期待」「自我恐懼」「情感」三層談解放；美貞要具氏「崇拜我」的 추앙 更接近「景仰」，最好的關係是彼此仰慕。
5. **分歧**：收視不高但口碑極高（新浪轉載稱首播收視約 3%，snippet）；英文部落格 The Drama Corner 嫌後半具氏黑道線「very poorly done」、拖沓（小媒體，partial）。

## 9. Castaway Diva 無人島的DIVA（tvN／Netflix, 2023）

1. **Metacritic**：no Metascore（`castaway-diva` 404）。
2. **豆瓣**：只有 snippet（豆列摘要「7.3（7,497 人）」），**不採用**。
3. **英文評論**：NME，Hidzir Junaini，2023-11-09，〈'Castaway Diva' review: 'Survivor' meets 'Idol' in this flawed yet likeable K-drama〉。https://www.nme.com/reviews/tv-reviews/castaway-diva-review-survivor-meets-idol-3534684 （read (Exa cache)；播出初期）
   - 摘要：情節不合理（荒島 15 年仍完美無瑕、宇學的妄想）、黑暗家暴前史與 rom-com 語調衝突，但角色討喜、節奏快、演員撐起不協調的元素。
   - 原文：「the series is a surprisingly smooth ride」
4. **台灣中文評論**：關鍵評論網（方格子 vocus 轉載），抱城，2023-12-09，〈【韓劇】《無人島的DIVA》大結局：部分收尾讓人疑惑，精彩度下滑好險有壞到底的反派〉。https://www.thenewslens.com/article/195870 （read (Exa cache)）⚠ 方格子創作者轉載，非 TNL 編輯部
   - 摘要：前 4 集是巔峰，第 5 集後陷入平板來回；三位父親（兩個家暴、一個守護）構成全劇骨架；木河一出場歌唱實力就頂尖，沒有「實力不足需要成長」，讓故事近似童話。整體「尚可，清新且結局圓滿」。
5. **分歧**：豆瓣 7.3（snippet）明顯低於本表其他劇；前段好評、後段下滑是中英評論共同看法（NME「flawed」、抱城「精彩度下滑」）。kdramastars 報導朴恩斌被批「禹英禑式演技」（小媒體，partial）。

## 10. SKY Castle 天空之城（JTBC, 2018–19）

1. **Metacritic**：no Metascore（`sky-castle` 404）。
2. **豆瓣**：只有 snippet（百度摘要「8.8 分，139,766 人」；V2EX 帖給 subject 30304087），**不採用**。
3. **英文評論**：The Korea Times，Emanuel Pastreich，2019-01-22，〈'Sky Castle' and the deep fissures in Korean society〉。https://www.koreatimes.co.kr/opinion/20190122/sky-castle-and-the-deep-fissures-in-korean-society （partial：Exa 快取讀到前約七成，結論段見 Exa 摘錄）⚠ 評論版專欄（作者為美籍學者），不是影評版
   - 摘要：「SKY Castle」本質是階級劇，把升學寫成精英家族的戰爭；但鏡頭在豪宅間流連，又有奢侈品贊助，批判與炫耀界線模糊。
   - 原文：「Ultimately the series serves as much as a celebration of the lives of the wealthy as it does as a criticism.」
4. **台灣中文評論**：換日線，紀遠林／東方見聞錄，2019-02-20，〈韓國影集《天空之城》背後的教育悲歌（上）：寫實描繪升學之苦〉。https://crossing.cw.com.tw/article/11368 （read (Exa cache)）⚠ 換日線（天下雜誌旗下）不在指定清單，屬評論／觀察專欄
   - 摘要：作者在韓國研究室聽韓國人說「雖然有些誇大，但都是真的」；以特目高、私教育支出、17 歲每天讀 11.5 小時等數據，說明劇中的升學競爭是現實。
5. **分歧**：**結局反彈**——第 20 集 23.8%（全國）創當時非無線台紀錄，但多家韓媒記錄觀眾不滿「突然大家都變好人」：首爾經濟 이정민 2019-02-02〈'스카이캐슬' 결말 "왜 갑자기 모두가 착해지고 행복해지는건데"〉（https://www.sedaily.com/NewsView/1VF5NL9883 ，read，Exa）；國民日報 신은정 2019-02-02 引「용두사미」（虎頭蛇尾）評語（https://www.kmib.co.kr/article/view.asp?arcid=0013039498 ，read，Exa）；甚至有青瓦台請願要求「重拍最後一集」（Insight 2019-02-02，partial）。連合新聞 2019-01-19 也記錄「與막장劇無異」的批評（partial）。

## 11. Mr. Sunshine 陽光先生（tvN／Netflix, 2018）

1. **Metacritic**：no Metascore。⚠ `metacritic.com/tv/mr-sunshine/season-1/` 顯示 **54（23 則）**，但描述是 Matthew Perry 主演的 2011 年 ABC 喜劇，**不是本劇，勿引用**（read）。
2. **豆瓣**：**9.0（56,643 人）**，豆列 https://www.douban.com/doulist/144727784/ （cache（豆列），豆列最後更新 2023-11）。
3. **英文評論**：The Korea Herald，Kim So-hyun，2018-08-21，〈[Herald Review] 'Mr. Sunshine' offers ray of hope with mesmerizing fantasy〉。https://www.koreaherald.com/article/1758418 （read (Exa cache)；播到第 14 集時）
   - 摘要：承認美國從未派陸戰隊駐朝鮮，崔有鎮是「wishful imagination」；本劇重點不是朝鮮階級，而是普通人如何建立更好的社會；儘管被批誤導歷史，仍以演員、劇情與美學打動觀眾。
   - 原文：「It is a fantasy created to inspire viewers living today's deep-rooted political and socioeconomic divisions.」
4. **台灣中文評論**：想想論壇，丹青（作者欄：主修中國及英法文學、曾任英文日報記者與大學講師），2018-12-17，〈《陽光先生》：歷史劇的嶄新敘事〉。https://www.thinkingtaiwan.net/content/7352 （read (Exa cache)）⚠ 想想論壇不在指定清單
   - 摘要：最新鮮的是用幽默與現代價值審視複雜歷史、敢批判自身文化；崔有鎮質問「閣下想要拯救的朝鮮可以讓誰存活？」是對階級社會的控訴；作者感嘆台灣、中國歷史劇做不到這種誠實口吻。
5. **分歧**：
   - **歷史描寫爭議**：Korea JoongAng Daily〈[FICTION VS. HISTORY] The fact and fiction in 'Mr. Sunshine'〉（2018-10-14）記錄 7 月 16 日有人上青瓦台請願要求管制「歷史扭曲」，理由是 Netflix 全球播出會讓外國人誤解；製作組道歉，第 5 集起把黑龍會改虛構名並加註「根據史實改編的虛構作品」。https://www.koreajoongangdaily.com/korea/fiction-vs-history-the-fact-and-fiction-in-mr-sunshine-historical-sweep-is-captured-but-some-anachronisms-and-motivations-irk-viewers/10827792 （partial，Exa 摘錄）
   - The Korea Times 2018-08-02〈'Japs are bad, Yanks are good, kinda'〉（Exa 未顯示署名）批評日美角色的刻板二分。（partial）
   - 台灣熱度偏低：KCI 論文 황선미〈대만 한류의 한계 ― <미스터 션샤인> PTT를 중심으로〉以 PTT 討論分析本劇在台未能進入「偏好韓劇 Top 10」的原因。https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002616591 （partial：只讀到摘要）
   - 英文評論本身也冷：Decider（Joel Keller，2018-07-10）嫌美國場景「doesn't look like America」、第一集混亂，但仍給 Stream It（partial）。

## 12. Jeongnyeon: The Star Is Born 正年（tvN／Disney+, 2024）

1. **Metacritic**：no Metascore（`jeongnyeon-the-star-is-born` 404）。
2. **豆瓣**：沒有讀到（未找到 subject 快取、豆列或引用新聞）。
3. **英文評論**：The Straits Times，Joanne Soh，2024-10-23，〈Binge-worthy: Kim Tae-ri is the shining light in Jeongnyeon: The Star Is Born〉，4/5。https://www.straitstimes.com/life/entertainment/binge-worthy-kim-tae-ri-is-the-shining-light-in-jeongnyeon-the-star-is-born （read (Exa cache)；根據前 4 集）
   - 摘要：以三點推薦：金泰梨的全面演技（第 3 集盤索里初登台）、姊妹情誼與競爭、保存被電視電影淘汰的女性國劇文化。
   - 原文：「Kim never fails to impress.」
   - 補充：SCMP，Pierce Conran，2024-11-21，3.5/5，標題「soaring performances save the show」、副標「good ideas but fails to follow through on them」（partial：標題與 RT 引文 snippet，正文付費牆）。
4. **台灣中文評論**：聯合報〈娛樂有評〉（噓！星聞），雀雀（影評人），2025-01-18，〈雀雀／金泰梨「正年」以少年感、一秒變換氣質術再創演技巔峰〉。https://stars.udn.com/star/story/10093/8497601 （partial：Exa 摘錄，中間有缺段）
   - 摘要：金泰梨讓觀眾看見演員「自省不足、理解角色、做出調整」的過程，打破「氣質是天生的」迷思；拿台灣歌仔戲（楊麗花、陳亞蘭）比較，感嘆是韓國先拍出這種題材。
   - 備選：電影神搜，Winnie，2024-10-15，【首播劇評】（read 部分，Exa）；同站專欄作者阿揪西的長評發表在其 vocus 沙龍（2024-11-23），提到 MBC 製作費變卦改由 tvN 接手、劇本書原有兩場吻戲被刪。
5. **分歧**：**改編刪角爭議**——韓劇版刪去原著網漫的權芙蓉（與正年發展同性戀情）與高社長。Hankyoreh 2024-11-03 專文〈정년이라는 별천지…〉批評刪掉芙蓉等於刪掉「她所代表的世界」，讓劇集退回《大長今》式天才成長敘事（https://www.hani.co.kr/arti/culture/culture_general/1165578.html ，partial，未見署名）。觀眾端收視從 4.8% 升到結局 16%（Korea Times 2024-11-19，partial）。評論（SCMP 3.5/5）比觀眾熱度保守。

## 13. The Tale of Lady Ok 玉氏夫人傳（JTBC／Netflix, 2024–25）

1. **Metacritic**：no Metascore（`the-tale-of-lady-ok` 404）。
2. **豆瓣**：沒有讀到（subject 36409552 的劇評頁有出現在搜尋，但分數未讀到）。
3. **英文評論**：India Today，Bhavna Agarwal，2025-02-03（頁面時間戳 2025-02-04 IST），〈The Tale of Lady Ok review: Lim Ji-yeon stars in a standout historical K-drama〉。https://www.indiatoday.in/entertainment/ott/story/the-tale-of-lady-ok-review-lim-ji-yeon-stars-in-a-standout-historical-k-drama-2674122-2025-02-03 （read (Exa cache)）
   - 摘要：不寫宮廷、國王從不露面，把焦點放在平民與階級；林智妍的智慧與脆弱兼具；但秋泳宇一人分飾兩角的處理令人困惑，結尾兩個男角的英雄救美「slightly forced」。
   - 原文：「The Tale of Lady Ok breathes new life into the historical drama genre.」
4. **台灣中文評論**：**沒有找到**符合條件的具名評論。搜尋：「《玉氏夫人傳》林智妍 秋泳宇 劇評 電影神搜／關鍵評論網／鳴人堂／釀電影」「電影神搜 玉氏夫人傳 劇評」（Exa）。找到的只有：Marie Claire 美麗佳人台灣〈《玉氏夫人傳》劇情看點〉（2026-05-21 更新，署名「Text/ R」，⚠ 生活風格媒體、近似劇情介紹）https://www.marieclaire.com.tw/entertainment/tvshow/83447 （read，Exa）；部落格「霧風誌Mona」vocus 劇評（非媒體）。
5. **分歧**：**同志支線反應**——第 4 集揭露成允謙是「斷袖」、形式婚姻；Marie Claire 台灣稱韓網覺得突兀、台灣 PTT 多持正面（上列，⚠ 二手轉述）；豆瓣劇評「分派電影」說本劇第 4 集起「口碑兩極分化」（https://movie.douban.com/review/16362346/ ，read，Exa；作者為中國公號）。收視則一路上升到結局首都圈 14.0%、全國 13.6%（每日經濟 MK 中文版 2025-01-27，read，Exa）。

## 14. The Red Sleeve 衣袖紅鑲邊（MBC, 2021–22）

1. **Metacritic**：no Metascore（`the-red-sleeve` 404）。
2. **豆瓣**：沒有讀到。
3. **英文評論**：Korea JoongAng Daily，Yim Seung-hye，2022-03-13，〈[FICTION VS. HISTORY] MBC's 'The Red Sleeve' combines fact and fiction, leaving some confused〉。https://www.koreajoongangdaily.com/lifestyle/fiction-vs-history-mbcs-the-red-sleeve-combines-fact-and-fiction-leaving-some-confused/11621166 （partial：Exa 快取讀到約前八成）⚠ 史實對照專題，不是一般劇評
   - 摘要：依正祖親撰〈宜嬪墓誌銘〉核對：德任拒絕兩次是史實，但兩人少年才偶遇、18 歲後才相戀是虛構（史料顯示 15 歲時已被拒）；劇中幾乎不提孝懿王后；史實上德任是在侍從被責罰後才「從命」。
   - 原文：「the drama is also heavily fictionalized leaving some viewers confused about what's fact and what's fiction」
4. **台灣中文評論**：電影神搜，臺灣歐妮，2022-01-03，〈【有雷】《衣袖紅鑲邊》細緻的史實改編，開放式結局留白的曖昧恰到好處〉。https://news.agentm.tw/293809/ （read (Exa cache)）
   - 摘要：歷史本身就是最大劇透，但結局用夢境留白，可解為「一切只是夢」或「死後重聚」，兩種都是 happy ending；德任始終沒說愛，「小小叛逆」藏在動作裡。收視從 5.7% 到 17.4%。
5. **分歧**：
   - 史實 vs 浪漫化：除 JoongAng Daily 外，澎湃「私家歷史」轉載文（豆瓣劇評 https://movie.douban.com/review/14094722/ ，read，Exa）引正祖原文「責罰其私屬，然後乃從命」，指成氏是「迫於王命」，與劇中雙向戀愛不同；豆瓣小組也有「歷史上的正祖和宜嬪其實有點強制愛」的討論（snippet 層級，僅作脈絡）。
   - 原本 16 集、因收視加開第 17 集，有觀眾嫌第三幕倉促（部落格 Gwenchanoona，小媒體，partial）。
   - 韓國評論正面：경향신문 김선영〈로맨스사극에 대한 편견이 깨졌다〉（2021-12-02，partial）。

---

## 總表

| # | 劇 | MC S1 | 豆瓣 | 英文評論（媒體／評論者） | 台灣中文評論 | 主要分歧 |
|---|---|---|---|---|---|---|
| 1 | 苦盡柑來遇見你 | tbd（2 則：80／60） | 9.4（324,956）cache豆列；9.5 新聞 | RogerEbert.com／Sherin Nicole（read） | 釀電影／Yin（read） | Decider 60 vs 觀眾 9+；「吃苦美學」批評 |
| 2 | 未知的首爾 | 無 | 8.6（58,876，播出中）cache豆列 | Decider／Joel Keller（read，第1集） | 聯合報／雀雀（read） | 低收視起步、口碑後來居上 |
| 3 | 妳和其餘的一切 | 無 | 無 | Korea Herald／Lee Yoon-seo（read，半專訪）；SCMP 3/5（partial） | 聯合報／雀雀（read） | 英文評論兩極 |
| 4 | 壞媽媽 | 無 | snippet 不採用 | NME／Carmen Chin（read，前4集） | 電影神搜／黃小惠（read） | Digital Spy 身障再現批評 |
| 5 | 請回答1988 | 無 | 9.7（1,063,880）cache豆列 | The New Yorker／Matthew Trammell（partial） | 沒有找到（TNL 書摘為韓國作者） | 正煥 vs 阿澤結局反彈 |
| 6 | 我的大叔 | 無 | snippet 不採用 | 沒有找到主要媒體（3QD 退而求其次） | 釀電影／怒怒心理師（partial） | 年齡差開播前爭議 |
| 7 | 我們的藍調時光 | 無 | 8.5（播出中，新聞） | NME／Tanu I. Raj（read，前4集） | 釀電影／Kristin（read） | 高中生懷孕支線反彈（snippet） |
| 8 | 我的出走日記 | 無 | 9.1（播出中，新聞） | The Hindu／Prabalika M. Borah（read，前8集） | 鳴人堂／彭紹宇（read） | 低收視高口碑；後段黑道線被嫌 |
| 9 | 無人島的DIVA | 無 | snippet 不採用 | NME／Hidzir Junaini（read） | 關鍵評論網（方格子）／抱城（read） | 前高後低 |
| 10 | SKY Castle 天空之城 | 無 | snippet 不採用 | Korea Times／Emanuel Pastreich（partial，專欄） | 換日線／紀遠林（read，⚠清單外） | 結局「虎頭蛇尾」反彈 |
| 11 | 陽光先生 | 無（slug 撞名 2011 喜劇） | 9.0（56,643）cache豆列 | Korea Herald／Kim So-hyun（read） | 想想論壇／丹青（read，⚠清單外） | 歷史扭曲請願、黑龍會改名；台灣熱度低 |
| 12 | 正年 | 無 | 無 | The Straits Times／Joanne Soh（read，前4集）；SCMP 3.5/5（partial） | 聯合報／雀雀（partial） | 刪除芙蓉（同志線）爭議 |
| 13 | 玉氏夫人傳 | 無 | 無 | India Today／Bhavna Agarwal（read） | 沒有找到（Marie Claire 生活風格、未具全名） | 同志支線兩極 |
| 14 | 衣袖紅鑲邊 | 無 | 無 | Korea JoongAng Daily／Yim Seung-hye（partial，史實專題） | 電影神搜／臺灣歐妮（read） | 浪漫化 vs 史料「從命」 |

## 缺口

- **Metacritic**：只測了猜測的 slug（`<英文片名小寫連字號>`），12 部 404。有可能有不同 slug（例如加年份），沒有再用站內搜尋確認；但依過往經驗 K-drama 多半沒有頁面。
- **豆瓣**：沒有讀到任何 subject 頁（Exa 對 movie.douban.com 403、m.douban.com 逾時）。目前的數字來自豆列快取（日期不明）和新聞（多為播出中途），寫文時要標「約」或註明時間點。《妳和其餘的一切》《正年》《玉氏夫人傳》《衣袖紅鑲邊》完全沒有；《壞媽媽》《我的大叔》《無人島》《天空之城》只有 snippet。
- **MDL／IMDb 觀眾分數**：這輪沒有系統抓，分歧欄只用豆瓣與少數新聞轉述（《苦盡柑來》MDL 9.0、IMDb 9.3 來自游民星空）。需要的話另跑一輪 IMDb（Exa 快取 title 頁）。
- **英文**：《我的大叔》找不到主要媒體具名評論；SCMP（Pierce Conran 幾乎每部都有）全部付費牆讀不到正文，只能當 partial 補充。《妳和其餘的一切》主評是半專訪。《紅袖》主評是史實專題，非一般劇評。
- **台灣中文**：《請回答1988》《玉氏夫人傳》沒有找到台灣作者的具名評論。《天空之城》（換日線）、《陽光先生》（想想論壇）用了指定清單外的台灣媒體；《無人島》《我的大叔》備選是方格子創作者轉載到 TNL，不是 TNL 編輯部。雀雀（聯合報）用了三次（《未知的首爾》《妳和其餘的一切》《正年》）。
- 未檢查任何一篇是否業配：已讀到的台灣文章都沒有出現「#Partner／媒體採購」字樣，但沒逐頁核對頁尾。

## toolDegradation

- **Groundlane**：`web_extract` 正常（Metacritic、filmaholic 作者 meta、SCMP 付費牆偵測）。`web_search` 回報 tavily／exa／brave unavailable，只有 you.com 回應。`web_fetch` 對 SCMP 只拿到導言（付費牆）。Openbook 被 bot 驗證頁擋（未繞過）。
- **Exa**：主力。`web_search_exa` 正常；`web_fetch_exa` 對豆瓣 subject 頁 CRAWL_HTTP_403（movie.douban.com）與 CRAWL_LIVECRAWL_TIMEOUT（m.douban.com），對豆列頁、媒體文章正常。
- **Tavily、jina**：這輪未使用（Exa＋Groundlane 已足夠）。
- **Firecrawl**：依指示未使用（額度用盡）。
- 終端機 curl：依指示未使用。
