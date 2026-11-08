# Post KR5 事實表：韓劇｜人生、家庭與時代劇（14 部）

- 查核日：2026-11-08。順序照 `post-kr5-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取（非即時）；**partial** 表示只讀到一部分（例如頁面標題列被吃掉、只靠順序對應）；**snippet** 表示只看到搜尋摘要或 highlight，不能當成讀過。
- 欄位 1、8（台灣片名、台灣串流）照抄 `tw-availability-1.md`／`tw-availability-2.md`（兩檔查核日都是 2026-11-08），原判定照抄（英文）。台灣片名一律以那兩份檔案的台灣來源為準，沒有自行翻譯。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），每類留 2–4 個，得獎排在提名前。已刪：`A SDA-K`（awards 檔自己註明「probably not a pure jury award」）、`C Douban`（只有 snippet）、`G(轉譯)`（韓國媒體轉譯）、所有負評為主的提及（例如 Dcard Z.Y 給 2 分、3 分的評語、PTT「棄劇」）。
- **MDL 排名注意**：ratings 檔的「MDL #N」是「Top Korean Dramas」韓劇榜名次；本表欄位 5 的「Ranked #N」是這次從 MDL 劇頁讀到的全站總排名，兩者不是同一個榜，不能混用。
- **IMDb Parents Guide 是使用者投稿與投票**，不是官方分級；括號內是「X of Y found this …」票數。多數韓劇票數只有個位數到幾十票，**參考性很低**，各劇都會寫明。IMDb Certifications 欄的國家分級也是使用者提交（有些標 self-applied 或 Netflix self-rating），不是各國分級機構的原始資料。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、集數、首末播日、電視台、片長、類型、原著 | 英文 Wikipedia 條目 wikitext（`action=raw`）：infobox `genre`／`num_episodes`／`runtime`／`network`／`first_aired`／`last_aired`／`based_on`／`related`、導言首段、Synopsis／Premise 段 | Groundlane `web_extract`（pattern） | read（14/14；`Mr._Sunshine_(2018_TV_series)` 是 redirect，改讀 `Mr._Sunshine_(South_Korean_TV_series)`） |
| Reply 系列是否獨立 | `Reply_(TV_series)` wikitext 導言 | Groundlane `web_extract` | read |
| IMDb ID、MDL ID | Wikidata SPARQL（P345、P3868），以 enwiki 條目反查 | Groundlane `web_fetch` | read（14/14 有 IMDb ID；MDL ID 只有 5 部有，其餘用 MDL 站內搜尋找頁） |
| 分級細項、韓國分級 | IMDb Parents Guide `https://www.imdb.com/title/<id>/parentalguide/`（五類＋Certifications） | jina `read_url`（無 key，回全文） | read 12/14；**partial 2/14**（Reply 1988、Mr. Sunshine：jina 回傳的版本沒有類別標題，只能依 IMDb 固定順序 Sex → Violence → Profanity → Alcohol → Frightening 對應） |
| IMDb 評分與票數 | IMDb 標題頁 | jina `read_url` | read（14/14） |
| MDL 分數、評分人數、總排名 | MyDramaList 劇頁 `ratingValue`、「scored by N users」、「Ranked: #N」 | Groundlane `web_extract`（render=never） | read（14/14） |
| Rotten Tomatoes | RT 系列頁 `[slot=critics-score]`、`[slot=critics-reviews]`、`[slot=audience-score]` | Groundlane `web_extract` | read 9/14；5 部 slug 猜錯被導回首頁（未確認） |
| Disney+ TW 分級（正年） | Disney+ TW 劇頁 | Groundlane `web_fetch` | read（頁面讀到，但「分級：」欄位是空的） |

---

## 1. When Life Gives You Tangerines

1. **片名**：**苦盡柑來遇見你**（Netflix Taiwan YT 預告標題，tw-availability-1）／폭싹 속았수다／*When Life Gives You Tangerines*。韓文片名是濟州話，Wikipedia 譯作「Thank You for Your Hard Work」（read）。
2. **劇情**：1951 年生於濟州、想當詩人的窮女孩愛純，和一心愛著她的青年寬植，一起走過一生的起落；故事由他們的女兒金明旁白。Wikipedia Synopsis：「the adventurous life and many trials of Ae-sun …, a poor girl wanting to become a poet who was born in Jeju in 1951」。來源：https://en.wikipedia.org/wiki/When_Life_Gives_You_Tangerines （read）
3. **季數與狀態**：單季、16 集，Netflix 原創，2025-03-07 到 03-28 播畢，**已完結**。片長 49–85 分鐘。**分 4 批每週上線**：Wikipedia 導言「released on Netflix every Friday, from March 7, 2025, to March 28, 2025」，集數表註腳「Four episodes were released weekly, for four weeks」。年代：1950 年代起的濟州，橫跨數十年。製作費 600 億韓元（infobox）。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 12**、**Taiwan 12+**、US TV-14（read）。Netflix TW 頁沒有讀（Netflix 依 IP 給頁面）。Parents Guide：Sex & Nudity **None**（44/65）、Violence & Gore **None**（39/43）、Profanity **Mild**（26/37）、Alcohol, Drugs & Smoking **Mild**（28/39）、Frightening & Intense **Mild**（20/35）。投稿提到：幾場輕度吻戲、一句英文「what the f*ck」、有人在第 7 集抱怨褻瀆用語。**票數 35–65，參考性有限**。來源：https://www.imdb.com/title/tt26471411/parentalguide/ （read）
5. **觀眾評分**：MDL **9.3**（85,683 人評分，全站 Ranked #7）https://mydramalist.com/735043-life （read）。IMDb **9.0**（44K）https://www.imdb.com/title/tt26471411/ （read）。RT 系列頁 Tomatometer **100%（9 則影評）**、Popcornmeter 98%：https://www.rottentomatoes.com/tv/when_life_gives_you_tangerines （read；只有 9 則，樣本小）。
6. **推薦 tag**：
   - A：Baeksang Drama win 2025；BlueDragon Grand Prize 2025；BlueDragon Drama nom 2025
   - B：Time-K2025 (Burt) #1；Cine21-2025 #3
   - C：IMDb 9.0（44K）；MDL Top Korean #1 9.3（85,683）
   - D：Netflix H1 2025 35M views
   - E：FUNdex Awards 2025 grand prize + OTT original drama + lead actor/actress；Parrot GDA 2025 finalist（series debut + Asian original）
   - F：PTT 2025 印象串 原 PO #1；PTT 2025 最愛串 約 24 人；Dramabeans 2025 Best Drama
   - G：LINE TODAY 聚光賞 2025 十大追劇榜 #1；DailyView 2025 聲量 #1；Netflix TW Top10 2025-03-17～23 #1（累計 11 週）；遠見 2025 #1
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。Wikipedia 導言說它常被拿來和《請回答1988》比較（同為朴寶劍主演、懷舊溫情），但兩者無劇情關係。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81681535 — **confirmed (official channel)**。證據：Netflix Taiwan YT「《苦盡柑來遇見你》| 正式預告 | Netflix」2025-02-21；另有風傳媒 2026-09-09「可於Netflix觀看」。Netflix 原創，無授權到期風險。
- **類型核對**：Wikipedia infobox genre = Romance、Slice-of-life；導言「romance slice-of-life」。符合「人生／年代家庭劇」，但 Wikipedia 把 romance 放第一位。

## 2. Our Unwritten Seoul

1. **片名**：**未知的首爾**（Netflix Taiwan YT，tw-availability-1）／미지의 서울／*Our Unwritten Seoul*
2. **劇情**：個性相反的同卵雙胞胎美知與美來，一個因傷放棄短跑、在鄉下照顧奶奶，一個在首爾公營企業被職場霸凌，兩人決定互換身分過幾個月。Wikipedia：「she suggests that they swap places for a few months」。來源：https://en.wikipedia.org/wiki/Our_Unwritten_Seoul （read）
3. **季數與狀態**：單季、12 集，tvN 2025-05-24 到 06-29，每週六日播出，Netflix 同步。片長 70 分鐘。**已完結**。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**；IMDb Summary「not yet rated」；沒有台灣分級資料（read）。Parents Guide：Sex & Nudity **None**（7/9）、Violence & Gore **None**（7/8）、Profanity **None**（6/7）、Alcohol, Drugs & Smoking **Mild**（5/8）、Frightening & Intense **Mild**（6/9）。投稿只寫「Some kissing」。**每類只有 7–9 票，幾乎沒有參考性**。來源：https://www.imdb.com/title/tt36724865/parentalguide/ （read）
5. **觀眾評分**：MDL **8.7**（36,530 人，Ranked #262）https://mydramalist.com/762921-unknown-seoul （read）。IMDb **7.9**（6K）（read）。RT 系列頁 Tomatometer **100%（6 則）**，Popcornmeter 未顯示（read，樣本很小）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2026
   - B：Cine21-2025 #1；Time-K2025 (Burt) #5
   - E：FUNdex 2025 TV-OTT ending-drama buzz top 10
   - F：PTT 2025 最愛串 約 55 人（全串最多）；PTT 2025 印象串 原 PO #2；PTT 2026 入坑串 原 PO；Dramabeans Best Writing
   - G：LINE TODAY 2025 韓劇年度榜 #2；LINE TODAY 十大追劇榜 #3；Netflix TW 2025-06-23～29 #3（累計 7 週）；遠見 #5
7. **前置作品**：沒有，原創劇（infobox `based_on` 留空）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/82024805 — **confirmed (official channel)**。證據：Netflix Taiwan YT「《未知的首爾》 | 正式預告 | Netflix」2025-05-14（描述連到 82024805）。
- **類型核對**：Wikipedia infobox genre = Coming-of-age、Romance（read），沒有標 family 或 slice-of-life。劇情核心是雙胞胎換身分、職場與家人，屬「人生劇」可以說得通，但 **Wikipedia 的主類型是成長＋愛情**，寫文時別寫成純家庭劇。

## 3. You and Everything Else

1. **片名**：**妳和其餘的一切**（Netflix Taiwan YT，tw-availability-1）／은중과 상연／*You and Everything Else*。PTT 也有人寫「你和其餘的一切」（fans 檔）。
2. **劇情**：殷重與尚妍兩個女人從少女時代到中年、交織著欣賞、嫉妒與誤解的一生友誼；42 歲的尚妍確診末期癌症，請殷重陪在身邊。Wikipedia：「two lifelong friends as they confront envy, rivalry, and reconciliation when one of them faces a terminal illness」。來源：https://en.wikipedia.org/wiki/You_and_Everything_Else （read）
3. **季數與狀態**：單季、15 集，Netflix 原創，2025-09-12 上線（Wikipedia 只寫上線日，沒寫是否分批；infobox 片長欄空白）。**已完結**。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15 與 19 兩筆**、**Taiwan 13+**、US TV-MA（read；韓國同時兩筆，原因不明，可能是不同集或不同版本，未查證）。Parents Guide：Sex & Nudity **Mild**（2/3）、Violence & Gore **Mild**（1/1）、Profanity **No data**（沒有投票）、Alcohol, Drugs & Smoking **Mild**（1/1）、Frightening & Intense **None**（1/1）。投稿提到自殺是劇情的一部分、會一再被談到。**每類 0–3 票，等於沒有資料**。來源：https://www.imdb.com/title/tt31014107/parentalguide/ （read）
5. **觀眾評分**：MDL **8.5**（7,586 人，Ranked #594）https://mydramalist.com/750717-eun-jung-and-sang-yeon （read）。IMDb **8.0**（2.6K）（read）。RT 系列頁 0 則影評、**沒有 Tomatometer**（read）。
6. **推薦 tag**：
   - A：Baeksang Drama win 2026；BlueDragon Drama nom 2026；IntlEmmy Actress nom 2026（朴智炫，頒獎 2026-11-23，結果未出）
   - B：Cine21-2025 #2；Time-K2025 (Burt) honorable mention
   - F：PTT 2025 最愛串 約 24 人；Dcard 777果 6💡（「下半年最喜歡」）
   - G：LINE TODAY 十大追劇榜 #4；LINE TODAY 韓劇年度榜 #3；Netflix TW 2025-09-15～21 #3
7. **前置作品**：沒有，原創劇（Wikipedia 未見原著）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81687254 — **confirmed (official channel)**。證據：Netflix Taiwan YT「《妳和其餘的一切》| 正式前導預告 | Netflix」2025-08-12。
- **類型核對**：Wikipedia infobox 與導言都寫「romance coming-of-age」（read）。但 Synopsis 寫的是兩個女人的友誼與生死，看不到愛情主線。**類型標籤和劇情描述對不上**，寫文時以 Synopsis 為準描述成「友誼／人生劇」，並注意 Wikipedia 的 romance 標籤可能不準。

## 4. The Good Bad Mother

1. **片名**：**壞媽媽**（Netflix Malaysia/@netflixasia YT、ELLE TW，tw-availability-1）／나쁜엄마／*The Good Bad Mother*
2. **劇情**：野心勃勃的檢察官因一場意外變得只剩孩童心智、下半身癱瘓，他和母親被迫踏上修補母子關係的旅程。Wikipedia Synopsis：「A tragic accident leaves an ambitious prosecutor with the mind of a child and paraplegic」。來源：https://en.wikipedia.org/wiki/The_Good_Bad_Mother （read）
3. **季數與狀態**：單季、14 集，JTBC 2023-04-26 到 06-08，每週三四播出；Netflix 部分地區上架。片長 70–80 分鐘。**已完結**。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、US TV-MA（self-applied）、UK 15；沒有台灣資料（read）。Parents Guide：Sex & Nudity **None**（8/13）、Violence & Gore **None**（7/10）、Profanity **Moderate**（4/11）、Alcohol, Drugs & Smoking **Mild**（4/6）、Frightening & Intense **Mild**（5/8）。投稿提到只有輕吻戲、髒話多。**每類 6–13 票，參考性很低**。注意：IMDb 把它的類型標成 Action, Adventure, Biography，明顯不準。來源：https://www.imdb.com/title/tt27042206/parentalguide/ （read）
5. **觀眾評分**：MDL **8.9**（52,250 人，Ranked #115）https://mydramalist.com/733003-bad-mother （read）。IMDb **8.4**（8K）（read）。RT 系列頁 0 則影評、**沒有 Tomatometer**（Popcornmeter 90%，read）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2024
   - B：Time-K2023 (de Guzman, Netflix-only, unranked)
   - C：MDL Top Korean #25 8.9
   - D：NielsenKR cable #32 12.032%
   - G：LINE TODAY 2023 網友投票 #8
7. **前置作品**：沒有，原創劇（Wikipedia 未見原著）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81669775 — **confirmed (official channel, Asia zh)**，tw-availability-1 原註：「This is a licensed JTBC title and the evidence is from 2023.」證據：Netflix Malaysia（亞洲繁中頻道）「壞媽媽 | 精選 片段 | Netflix」2023-05-01；ELLE TW 2023-04。⚠️ **授權劇、最新台灣證據是 2023 年，有下架風險**，發文前建議用台灣裝置確認一次。
- **類型核對**：Wikipedia infobox genre = Family、Comedy drama、Slice-of-life（read）。符合「家庭劇」。

## 5. Reply 1988

1. **片名**：**請回答1988**（Netflix 寫作「請回答 1988」，tw-availability-1）／응답하라 1988／*Reply 1988*
2. **劇情**：1988 年，住在首爾雙門洞同一條巷子的五個兒時好友和他們的家人，彼此扶持度過艱難的青春期。Wikipedia Premise：「five childhood friends who all reside in Seoul's Ssangmun-dong district with their families rely on one another」。來源：https://en.wikipedia.org/wiki/Reply_1988 （read）
3. **季數與狀態**：單季、20 集＋特別篇，tvN 2015-11-06 到 2016-01-16，每週五六播出。片長 90–110 分鐘（infobox）。**已完結**。年代：1988 年前後（導言「Set in the 1980s when South Korea underwent major political and economic changes」）。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、Taiwan 13+（self-applied）、Singapore PG13（Netflix）（read）。IMDb Summary「not yet rated」。Parents Guide（**partial**：jina 回傳的版本沒有類別標題，以下依 IMDb 固定順序對應）：Sex & Nudity **Mild**（13/28）、Violence & Gore **None**（9/16）、Profanity **Mild**（12/26）、Alcohol, Drugs & Smoking **Mild**（14/18）、Frightening & Intense **None**（11/18）。投稿提到：第 2 集高中女生看情色小說的搞笑橋段、第 7 集父母看電視時擁抱、德善遇到暴露狂（沒有露出）。**每類 16–28 票，參考性有限**。來源：https://www.imdb.com/title/tt5182866/parentalguide/ （partial）
5. **觀眾評分**：MDL **9.0**（74,064 人，Ranked #54）https://mydramalist.com/13544-reply-1988 （read）。IMDb **9.0**（20K）（read）。RT：`/tv/reply_1988` 被導回首頁，**沒有找到 RT 頁**（未確認有無 Tomatometer）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2016
   - C：IMDb 9.0（20K）；MDL Top Korean #9 9.0（74,064）
   - D：NielsenKR cable all-time #6 18.803%（final 2016-01-16）
   - F：PTT 2026 入坑串 3 人（都說要撐過第一集）；PTT 2021 入坑串 4 人
7. **前置作品**：是 tvN《請回答》系列第三部（前作《Reply 1997》《Reply 1994》）。Wikipedia：「the third installment of the Reply anthology series」；系列條目導言稱它是「anthology television series」（read：https://en.wikipedia.org/wiki/Reply_(TV_series) ）。**Wikipedia 沒有直接寫「各季獨立」這句話**，只用了 anthology（選集）一詞；演員表顯示有前作角色客串（例如《Reply 1994》的 Trash、Sung Na-jung）。寫文時可說「選集形式、角色與故事各自獨立，不必先看前兩部」，但「不必先看」是依 anthology 定義推論，不是 Wikipedia 原句。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/80188351 — **confirmed (Taiwan media, 2026-09-09)**。證據：風傳媒 2026-09-09 Netflix 韓劇片單 #7。
- **類型核對**：Wikipedia infobox genre = Slice-of-life、Family drama、Coming-of-age（read）。完全符合。

## 6. My Mister

1. **片名**：**我的大叔**（Disney+／HBO Max TW 頁，tw-availability-2）／나의 아저씨／*My Mister*
2. **劇情**：背負債務、照顧生病奶奶的派遣女孩李至安，遇上同樣被背叛、職場打壓與家庭重擔壓著的中年男人朴東勳，兩人在彼此身上找到慰藉。Wikipedia：「they form a bond that offers solace, understanding, and the possibility of healing」。來源：https://en.wikipedia.org/wiki/My_Mister （read）
3. **季數與狀態**：單季、16 集，tvN 2018-03-21 到 05-17，每週三四播出。片長 90 分鐘（infobox）。**已完結**。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、US TV-14、Taiwan 0+（read；台灣 0+ 和平台分級差很多，可能是錯誤投稿）。**Disney+ TW 頁 15+、HBO Max TW 頁 16+**（tw-availability-2，2026-11-08 讀到，read）。Parents Guide：Sex & Nudity **None**（25/45）、Violence & Gore **Mild**（19/25）、Profanity **Mild**（15/20）、Alcohol, Drugs & Smoking **Moderate**（16/27）、Frightening & Intense **Mild**（8/17）。投稿提到幾乎每集都有喝酒場面、主角常醉著離開酒館。**每類 17–45 票，參考性有限**。來源：https://www.imdb.com/title/tt7923710/parentalguide/ （read）
5. **觀眾評分**：MDL **8.9**（39,014 人，Ranked #88）https://mydramalist.com/25172-my-ajusshi （read）。IMDb **9.0**（17K）（read）。RT：`/tv/my_mister` 被導回首頁，**沒有找到 RT 頁**。
6. **推薦 tag**：
   - A：Baeksang Drama win 2019
   - C：IMDb 9.0（17K）；MDL Top Korean #17 8.9（39,014）
   - F：PTT 標題〈差點錯過的神劇-我的大叔〉35 推（2023）；PTT 2026 入坑串 2 人（「人生第一名劇」）
7. **前置作品**：沒有，原創劇（Wikipedia 未見原著）。
8. **台灣串流**：Disney+ https://www.disneyplus.com/zh-tw/browse/entity-1a039f11-52aa-496b-b4f7-87a0159af889 、HBO Max https://www.hbomax.com/tw/zh/show/8c299dc3-588c-459a-9ad3-b5ef5c791e8f （皆訂閱）— **confirmed (service page): Disney+ and HBO Max**（兩頁 2026-11-08 皆可讀）。Netflix https://www.netflix.com/tw/title/81267691 只有 JustWatch 資料。
- **類型核對**：Wikipedia infobox genre = Psychological drama、Tragedy（read），沒有標 family 或 slice-of-life。劇情是底層生活、職場與家庭重擔，放在「人生劇」說得通，但**Wikipedia 的主類型是心理劇／悲劇**，基調偏沉重。

## 7. Our Blues

1. **片名**：**我們的藍調時光**（Netflix Malaysia/@netflixasia YT 預告標題，tw-availability-2；TSV 提示的「我的藍調時光」是錯的）／우리들의 블루스／*Our Blues*。⚠️ **撞名**：台灣翻拍版也叫《我們的藍調時光》（周渝民、張鈞甯），**2026-12-03 上 Netflix**，是不同的 Netflix ID（83172504；Netflix Taiwan 預告 https://www.youtube.com/watch?v=udJZ-WRWHWk ）。寫文時要標「韓版」或「2022」。MDL 也已有台版條目（https://mydramalist.com/763093-wo-men-te-lan-tiao-shih-kuang ，只看到搜尋結果連結，未讀）。
2. **劇情**：以濟州島為背景，用單元接力（omnibus）的方式，講處在人生終點或起點的一群人苦甜交織的生活。Wikipedia：「depicts their stories in an omnibus format against the backdrop of Jeju Island」。來源：https://en.wikipedia.org/wiki/Our_Blues （read；這個條目沒有 Synopsis 段，用導言）
3. **季數與狀態**：單季、20 集，tvN 2022-04-09 到 06-12，每週六日播出。片長 60 分鐘（infobox）。**已完結**。名列韓國有線電視收視率最高的劇之一（導言，read）。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、Taiwan 16+（self-applied）、US TV-MA（read）。Parents Guide **五個類別全部「No data／No voting data」——完全沒有投票**。來源：https://www.imdb.com/title/tt19115260/parentalguide/ （read）
5. **觀眾評分**：MDL **8.6**（23,373 人，Ranked #416）https://mydramalist.com/697585-our-blues （read）。IMDb **8.6**（5.8K）（read）。RT 系列頁（頁面標題是韓文「우리들의 블루스」）0 則影評、**沒有 Tomatometer**，Popcornmeter 85%（read）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2023
   - D：NielsenKR cable #20 14.597%；KDF 2022 #5 14.6%
   - F：PTT 2026 入坑串 3 人；Dcard Z.Y 留言「心中無法超越的神劇」
7. **前置作品**：沒有，原創劇（Wikipedia 未見原著）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81568842 — **confirmed (official channel, Asia zh channel, 2022)**。證據：Netflix Malaysia/@netflixasia「我們的藍調時光 | 官方預告 | Netflix」2022-03-31（「4月9日，Netflix獨家」）；JustWatch TW 2026-11-08 仍列 Netflix。⚠️ **tvN 授權劇、官方證據是 2022 年的亞洲頻道**，只有 JustWatch 支持「現在仍在架上」。
- **類型核對**：Wikipedia infobox genre = Melodrama（read）；導言寫單元接力的濟州人生群像。符合「人生劇」，Wikipedia 的類型詞是 melodrama。

## 8. My Liberation Notes

1. **片名**：**我的出走日記**（Netflix Malaysia/@netflixasia YT，tw-availability-2）／나의 해방일지／*My Liberation Notes*（IMDb 用 *My Liberation Diary*）
2. **劇情**：住在首爾近郊虛構小鎮山浦的三兄妹，每天長途通勤進首爾，加上在他們父親那裡打工的神祕外地人，四個人都想從一成不變的人生逃出去。Wikipedia：「All of them wish to escape from their dead-end lives」。來源：https://en.wikipedia.org/wiki/My_Liberation_Notes （read）
3. **季數與狀態**：單季、16 集，JTBC 2022-04-09 到 05-29，每週六日播出（infobox 片長欄空白）。**已完結**。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、US TV-14 與 TV-MA（Netflix self-rating）（read）；沒有台灣資料。Parents Guide：Sex & Nudity **None**（6/7）、Violence & Gore **Mild**（4/5）、Profanity **Mild**（3/4）、Alcohol, Drugs & Smoking **Moderate**（6/7）、Frightening & Intense **Mild**（2/4）。投稿：「No sexual scenes at all」。**每類只有 4–7 票，幾乎沒有參考性**。來源：https://www.imdb.com/title/tt15146130/parentalguide/ （read）
5. **觀眾評分**：MDL **8.5**（31,765 人，Ranked #615）https://mydramalist.com/685441-my-liberation-notes （read）。IMDb **8.2**（7.8K）（read）。RT 系列頁 0 則影評、**沒有 Tomatometer**，Popcornmeter 93%（read）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2023
   - B：Cine21-2022 #3
   - F：PTT 2026 入坑串 3 人
7. **前置作品**：沒有，原創劇（infobox `based_on` 留空）。編劇朴海英也寫了《我的大叔》，但兩劇無關。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81568411 — **confirmed (official channel, Asia zh channel, 2022)**。證據：Netflix Malaysia/@netflixasia「我的出走日記 | 正式預告 | Netflix」2022-03-22；JustWatch TW 2026-11-08 仍列 Netflix。⚠️ **JTBC 授權劇、官方證據是 2022 年**，只有 JustWatch 支持現況。
- **類型核對**：Wikipedia infobox genre = Slice-of-life（read）。完全符合。

## 9. Castaway Diva

1. **片名**：**無人島的 Diva**（Netflix Taiwan YT，tw-availability-2）／무인도의 디바／*Castaway Diva*
2. **劇情**：夢想當歌手的徐木河在去首爾參加選秀途中意外漂流到無人島，15 年後才回到社會；她遇上已經過氣的偶像，決定當對方的經紀人，幫她重回巔峰。Wikipedia：「gets stranded on an uninhabited island due to an unfortunate accident and returns to the world after 15 years」。來源：https://en.wikipedia.org/wiki/Castaway_Diva （read）
3. **季數與狀態**：單季、12 集，tvN 2023-10-28 到 12-03，每週六日播出，Netflix 部分地區上架。片長 80 分鐘。**已完結**。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、US TV-MA、UK 15（read）；沒有台灣資料。Parents Guide：Sex & Nudity **None**（9/10）、Violence & Gore **Severe**（8/15）、Profanity **Mild**（4/9）、Alcohol, Drugs & Smoking **Moderate**（4/9）、Frightening & Intense **Moderate**（6/11）。投稿提到「some graphic scenes of violent child abuse」與多場暴力。**每類 9–15 票，參考性很低**；但 Violence 被評 Severe 這點值得在文章提醒（劇情有家暴）。來源：https://www.imdb.com/title/tt28348835/parentalguide/ （read）
5. **觀眾評分**：MDL **8.3**（36,807 人，Ranked #1223）https://mydramalist.com/745215-diva-of-the-deserted-island （read）。IMDb **7.8**（5.4K）（read）。RT 系列頁 Tomatometer **100%（5 則）**、Popcornmeter 78%（read；只有 5 則）。
6. **推薦 tag**：
   - B：Time-K2023 (de Guzman, Netflix-only, unranked)
   - F：PTT 2023 徵文 9 推
   - G：LINE TODAY 2023 網友投票 #13
7. **前置作品**：沒有，原創劇（Wikipedia 未見原著）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81701128 — **confirmed (official channel)**。證據：Netflix Taiwan YT「無人島的 Diva | 正式預告 | Netflix」2023-10-17（「10 月 28 日, Netflix 獨家」）；JustWatch TW 列 Netflix。⚠️ **tvN 授權劇、官方證據是 2023 年**（雖然是台灣專屬頻道），有下架風險。
- **類型核對**：⚠️ Wikipedia infobox genre = Coming-of-age、Musical、Romantic comedy（read）。**主類型是音樂／愛情喜劇，不是人生或家庭劇**；IMDb 也標 Comedy, Drama, Music。放進這篇需要理由（例如家暴創傷與重返社會的主線），或考慮移到別篇。

## 10. Sky Castle

1. **片名**：**SKY Castle 天空之城**（LINE TV／myVideo 標題；Netflix 列為「天空之城」，tw-availability-2）／SKY 캐슬／*Sky Castle*（官方寫作 *SKY Castle*）
2. **劇情**：住在首爾近郊高級社區「SKY Castle」的醫師、教授太太們，不擇手段要讓孩子考進頂尖大學，諷刺韓國上流家庭的物質慾望與教育狂熱。Wikipedia：「A satirical series that closely looks at the materialistic desires of upper-class parents in South Korea」。來源：https://en.wikipedia.org/wiki/Sky_Castle （read）
3. **季數與狀態**：單季、20 集＋特別篇，JTBC 2018-11-23 到 2019-02-01，每週五六播出。片長 60–80 分鐘。**已完結**。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、Australia M（read）；IMDb Summary「not yet rated」；沒有台灣資料。Parents Guide：Sex & Nudity **None**（7/8）、Violence & Gore **Moderate**（3/5）、Profanity **Moderate**（4/5）、Alcohol, Drugs & Smoking **Moderate**（4/6）、Frightening & Intense **Moderate**（2/5）。投稿提到小打鬧、b*tch／slut 等罵人字眼、角色常喝醉。**每類只有 5–8 票，幾乎沒有參考性**。來源：https://www.imdb.com/title/tt9151274/parentalguide/ （read）
5. **觀眾評分**：MDL **8.7**（38,376 人，Ranked #254）https://mydramalist.com/30740-sky-castle （read；劇頁 Native Title「SKY 캐슬」，確認是韓版）。IMDb **8.4**（5.3K）（read）。RT：`/tv/sky_castle` 被導回首頁，**沒有找到 RT 頁**。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2019
   - D：NielsenKR cable #4 23.779%；KDF 2018 #10 12.3%（只算 2018 年那段）
   - F：Dcard Z.Y 4 分（「神劇」級）
7. **前置作品**：沒有，原創劇（Wikipedia 未見原著）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81030062 — **JustWatch only**。LINE TV、myVideo 頁都寫授權到期／因授權因素無法觀看；HBO Max TW 頁回傳錯誤頁；KKTV 已於 2026-01-01 停止服務。**目前沒有任何台灣官方證據**，寫文時建議寫「台灣目前沒有確認的正版串流（JustWatch 顯示 Netflix，未經官方證實）」。
- **類型核對**：⚠️ Wikipedia infobox genre = Satire、Black comedy、Family、Mystery、Psychological drama（read）；Synopsis 第一句就是「A satirical series」。**主類型是諷刺黑色喜劇＋懸疑**，家庭只是其中一項。放在「家庭劇」要寫明是諷刺劇，或考慮移到別篇。

## 11. Mr. Sunshine

1. **片名**：**陽光先生**（台灣媒體，Netflix，tw-availability-1）／미스터 션샤인／*Mr. Sunshine*
2. **劇情**：生為朝鮮奴婢之子的 Eugene Choi，在 1871 年辛未洋擾時逃到美國、成為美國海軍陸戰隊軍官，後來以美國公使館上尉身分回到漢城，愛上暗中當義兵狙擊手的士大夫孫女高愛信。Wikipedia：「Eugene Choi, who was born into slavery in Joseon」。來源：https://en.wikipedia.org/wiki/Mr._Sunshine_(South_Korean_TV_series) （read）
3. **季數與狀態**：單季（infobox `num_seasons = 1`）、24 集，tvN 2018-07-07 到 09-30，每週六日播出，Netflix 國際首播。infobox 片長欄空白（IMDb 一則使用者評論寫每集約 75 分鐘，非官方）。**已完結**。年代：1900 年代初的漢城（導言「set in Hanseong … in the early 1900s, and focuses on activists fighting for Korea's independence」），開場回溯到 1871 年；劇中提到 1905 年乙巳條約等真實事件。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、Taiwan 16+（self-applied）、US TV-MA（self-applied）（read）。Parents Guide（**partial**：沒有類別標題，依 IMDb 固定順序對應）：Sex & Nudity **None**（45/58）、Violence & Gore **Moderate**（29/41）、Profanity **Mild**（21/30）、Alcohol, Drugs & Smoking **Mild**（26/33）、Frightening & Intense **Moderate**（19/32）。投稿提到：「Lots of strong violence but not graphic」、「Blood is briefly seen」。**每類 30–58 票，參考性有限**。來源：https://www.imdb.com/title/tt7094780/parentalguide/ （partial）
5. **觀眾評分**：MDL **8.8**（37,656 人，Ranked #181）https://mydramalist.com/23920-mr.-sunshine （read）。IMDb **8.7**（15K）（read）。RT 系列頁 https://www.rottentomatoes.com/tv/mr_sunshine_2018 0 則影評、**沒有 Tomatometer**，Popcornmeter 96%（read）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2019
   - C：IMDb 8.7（15K）；MDL Top Korean #46 8.8
   - D：NielsenKR cable #9 18.129%；KDF 2018 #2 18.1%
   - F：PTT 2026 入坑串 約 16 人「一生推」；PTT 標題〈神劇推薦 Mr. Sunshine〉爆（2020）；Dcard Z.Y 留言 ×2「心中無法超越的神劇」
7. **前置作品**：沒有，原創劇（Wikipedia 未見原著）。看懂劇情不需要先看別的作品；**知道朝鮮末年、日本吞併韓國的歷史會有幫助**（編輯判斷）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/80991107 — **confirmed (Taiwan media, 2026-09-09)**。證據：風傳媒 2026-09-09「Netflix 10部…韓劇」#10。
- **類型核對**：Wikipedia infobox genre = Historical、Romance、Melodrama（read）。符合「時代劇」，但愛情線是主軸之一。

## 12. Jeongnyeon: The Star Is Born

1. **片名**：**正年**（Disney Plus TW YT、Disney+ TW 頁，tw-availability-1）／정년이／*Jeongnyeon: The Star Is Born*
2. **劇情**：韓戰剛結束的 1950 年代，天生好嗓子的木浦少女正年加入女性國劇團，在競爭中成長。Wikipedia：「Jeong-nyeon, a girl born with a talent for singing, entered the Yeoseong Gukgeuk troupe and grew up in it」。來源：https://en.wikipedia.org/wiki/Jeongnyeon:_The_Star_Is_Born （read）
3. **季數與狀態**：單季、12 集，tvN 2024-10-12 到 11-17，每週六日播出；Disney+ 部分地區串流。片長 70 分鐘。**已完結**。年代：1950 年代（Wikipedia 分類「Television series set in the 1950s」；Disney+ TW 簡介寫「1956年木浦」，read）。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、US TV-PG（self-applied）、Singapore NC16（read）。Disney+ TW 頁（「觀看正年 | Disney+」）讀到了，但「分級：」欄位是空的，**台灣分級未知**（read）。Parents Guide：五類全部 **None**，**每類只有 2 票（2/2）**——等於沒有資料。來源：https://www.imdb.com/title/tt28197611/parentalguide/ （read）
5. **觀眾評分**：MDL **8.3**（5,059 人，Ranked #1172）https://mydramalist.com/707587-jung-nyeon （read）。IMDb **8.3**（2.2K）（read）。RT 系列頁 0 則影評、**沒有 Tomatometer**（read）。
6. **推薦 tag**：
   - B：Time-K2024 (Burt) #2；NYT-Intl2024 (Hale)「10 more equally deserving」（unranked）
   - D：NielsenKR cable #17 16.458%
   - E：FUNdex 2024 TV ending-drama buzz #3；FUNdex Awards TV drama finalist + supporting（辛藝恩）
   - F：PTT 2024 徵文 6 推；Dcard 777果 5💡
7. **前置作品**：**改編自 Naver 網路漫畫《정년이》**（徐伊來、NAMON 作，infobox `based_on`，read）。Wikipedia 沒說要不要先看；IMDb 一則使用者評論說這部網漫「not available internationally」（read，使用者說法，未查證）。不必先看（編輯判斷）。
8. **台灣串流**：Disney+ https://www.disneyplus.com/zh-tw/browse/entity-ad06e18a-8afa-4271-9643-ab9f00dc36c1 — **confirmed (official channel)**。證據：Disney Plus TW YT「《正年》| 正式預告 | 10 月 12 日 Disney+ 精彩上線」2024-10-09。**補充**：這次另外直接讀到 Disney+ TW 劇頁，標題「觀看正年 | Disney+」、「2024 • 1 季」（2026-11-08，read），可升級為 service page 證據。
- **類型核對**：Wikipedia 沒有 genre 欄位；導言與 Synopsis 寫的是 1950 年代少女學國劇的成長故事，IMDb 標 Drama, Music, Musical（read）。屬「時代＋表演藝術成長劇」，放時代劇可以，但不是家庭劇。

## 13. The Tale of Lady Ok

1. **片名**：**玉氏夫人傳**（Hami Video 頁、台灣媒體，tw-availability-1）／옥씨부인전／*The Tale of Lady Ok*
2. **劇情**：朝鮮時代，女奴具德冒用「玉太英」的名字、身分甚至丈夫，一路成為替弱者打官司的訟師。Wikipedia：「a female slave named Goo Deok, whose name "Ok Tae-young", status, and even her husband were fake」。來源：https://en.wikipedia.org/wiki/The_Tale_of_Lady_Ok （read）
3. **季數與狀態**：單季、16 集，JTBC 2024-11-30 到 2025-01-26，每週六日播出。片長 70–85 分鐘。**已完結**。年代：朝鮮時代（Synopsis「Set in the Joseon period」）。注意：Hami Video 頁寫「全32集」，和 Wikipedia 的 16 集不同，應該是平台把每集拆成兩段（未查證）。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、US 16+、Argentina 16、Singapore NC16（read）；沒有台灣資料。Parents Guide **五類全部「No data」——沒有任何投票**。來源：https://www.imdb.com/title/tt33980640/parentalguide/ （read）
5. **觀眾評分**：MDL **8.5**（7,852 人，Ranked #462）https://mydramalist.com/752481-the-life-of-mrs-ock （read）。IMDb **8.1**（1.2K）（read）。RT：`/tv/the_tale_of_lady_ok` 被導回首頁，**沒有找到 RT 頁**。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2025
   - B：Time-K2025 (Burt) #8
   - D：NielsenKR cable #25 13.575%
   - F：Dcard 777果 4💡；PTT 2025 最愛串 1 人
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：Hami Video（訂閱）https://hamivideo.hinet.net/product/279408.do?cs=2 （「全32集」）、Netflix https://www.netflix.com/tw/title/81943794 — **confirmed (service page for Hami; Taiwan media 2024-12 for Netflix)**。證據：Hami 劇頁 2026-11-08 可讀；Yahoo TW 2024-12-04「在台由Netflix、Hami Video播出」。Netflix 那條證據是 2024 年的台灣媒體，比較舊。
- **類型核對**：Wikipedia infobox genre = Historical drama（Sageuk）、Romantic thriller（read）。符合「時代劇」，但另一個標籤是愛情驚悚，不是家庭劇。

## 14. The Red Sleeve

1. **片名**：**衣袖紅鑲邊**（friDay 頁、NOWnews，tw-availability-2）／옷소매 붉은 끝동／*The Red Sleeve*（IMDb 寫 *Red Sleeve*）
2. **劇情**：以正祖李祘與宜嬪成氏為藍本的虛構故事，講把國家放在愛情前面的朝鮮君王，和想守住自己選擇的人生的宮女之間的宮廷愛情，從宮女的視角敘述。Wikipedia：「a royal court romance between the king of Joseon who places his duty to his country above love, and a court lady who wants to protect the life she has chosen」。來源：https://en.wikipedia.org/wiki/The_Red_Sleeve （read）
3. **季數與狀態**：單季、17 集，MBC 2021-11-12 到 2022-01-01，每週五六播出。片長 70 分鐘。**已完結**。年代：朝鮮英祖末年到正祖時期（18 世紀後半；導言「a fictionalised account of the lives of King Jeongjo and Consort Ui」，演員表有英祖）。來源：同上（read）
4. **分級**：IMDb Certifications 列 **South Korea 15**、US TV-14、Singapore NC16（Netflix）（read）；沒有台灣資料。Parents Guide：Sex & Nudity **Mild**（5/6）、Violence & Gore **Moderate**（1/2）、Profanity **None**（1/1）、Alcohol, Drugs & Smoking **Mild**（1/1）、Frightening & Intense **Moderate**（2/2）。投稿提到「Sexual assault and harassment; extended kissing scenes; implied sex」。**每類 1–6 票，等於沒有資料**。來源：https://www.imdb.com/title/tt14687200/parentalguide/ （read）
5. **觀眾評分**：MDL **8.7**（27,671 人，Ranked #215）https://mydramalist.com/61399-dress-sleeved-red （read）。IMDb **8.4**（4.5K）（read）。RT：`/tv/the_red_sleeve` 被導回首頁，**沒有找到 RT 頁**。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2022
   - B：Cine21-2022 #4
   - C：MDL Top Korean #54 8.7
   - D：Nielsen nationwide 17.4%（final 2022-01-01，per WRC 部落格彙整，非一手）
   - F／G：fans 檔沒有這部的訊號
7. **前置作品**：**改編自姜美江的小說《옷소매 붉은 끝동》**（infobox `based_on`「The Red Sleeve Cuff」，Wikipedia 分類同時列「based on South Korean novels」與「web novels」，read）。不必先看（編輯判斷）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81588190 （訂閱）— **confirmed (Taiwan media, 2025-01-01)**。證據：NOWnews 2025-01-01「古裝韓劇《衣袖紅鑲邊》今（1）日於Netflix上線」；JustWatch TW 列 Netflix。⚠️ friDay影音 https://video.friday.tw/drama/detail/2134 是「數位珍藏」買斷，頁面標 **「即將下架」**，tw-availability-2 註明不要推薦 friDay。
- **類型核對**：Wikipedia infobox genre = Romance、Historical drama（read），Romance 排第一。符合「時代劇」，但本質是宮廷愛情劇。

---

## 總結

- 14 部全部是**單季、已完結**的作品，沒有續訂或續作消息（Wikipedia 都沒有提到第二季）。《苦盡柑來遇見你》16 集分 4 批、每週五上 4 集。
- 時代／年代劇 6 部：苦盡柑來（1950 年代起的濟州）、請回答1988（1988 年首爾）、陽光先生（1900 年代初漢城）、正年（1950 年代）、玉氏夫人傳（朝鮮）、衣袖紅鑲邊（18 世紀朝鮮正祖時期）。其中玉氏夫人傳、衣袖紅鑲邊、陽光先生是傳統古裝劇（sageuk），苦盡柑來、請回答1988、正年是近現代年代劇。
- 改編作品只有 2 部：正年（Naver 網漫）、衣袖紅鑲邊（小說）。其餘都是原創。請回答1988 是《請回答》選集系列第三部。
- 韓國分級：14 部在 IMDb Certifications 都列 **South Korea 15**；唯一例外是《苦盡柑來遇見你》列 12，《妳和其餘的一切》同時列 15 和 19。這些是 IMDb 使用者提交的資料，不是韓國放送通訊審議委員會原文。
- IMDb Parents Guide：**Our Blues 與玉氏夫人傳完全沒有投票**；正年每類 2 票、衣袖紅鑲邊與妳和其餘的一切每類 0–6 票、未知的首爾／我的出走日記／SKY Castle 每類 4–9 票，都不能拿來下判斷。只有苦盡柑來、請回答1988、我的大叔、陽光先生有 20–65 票。值得提醒讀者的內容：無人島的 Diva 的暴力（含兒童受虐）被評 Severe；我的大叔、我的出走日記飲酒場面多；妳和其餘的一切涉及自殺題材。
- RT 有 Tomatometer 的只有 3 部，而且影評數都很少：苦盡柑來 100%（9 則）、未知的首爾 100%（6 則）、無人島的 Diva 100%（5 則）。不建議在文章裡用 RT。
- **類型需要人拍板**：
  - ⚠️ **SKY Castle**：Wikipedia 第一類型是 Satire／Black comedy，Synopsis 開頭就是「A satirical series」。
  - ⚠️ **無人島的 Diva**：Wikipedia 是 Coming-of-age／Musical／Romantic comedy，不是人生家庭劇。
  - 較輕微：妳和其餘的一切（Wikipedia 標 romance，但劇情是友誼）、未知的首爾（成長＋愛情）、我的大叔（心理劇／悲劇）、玉氏夫人傳（另標 romantic thriller）、衣袖紅鑲邊（愛情排第一）。
- **台灣串流風險**：
  - SKY Castle：**只有 JustWatch**，其他台灣平台都已下架。文章不能寫「Netflix 可看」。
  - 壞媽媽：JTBC 授權劇，最新官方證據是 2023 年。
  - 無人島的 Diva：tvN 授權劇，最新官方證據是 2023 年。
  - 我們的藍調時光、我的出走日記：授權劇，官方證據是 2022 年亞洲頻道預告，只有 JustWatch 支持現況。
  - 衣袖紅鑲邊：friDay 版「即將下架」，只推薦 Netflix。
  - 我們的藍調時光：台灣翻拍版同名，2026-12-03 上 Netflix，文章要標「韓版（2022）」。
  - 正年：這次直接讀到 Disney+ TW 劇頁，可以從 official channel 升為 service page。

## 無法查證的事實

1. 各劇的韓國官方播出分級（放送通訊審議委員會／電視台標示）——只有 IMDb Certifications 的使用者提交資料；《妳和其餘的一切》列了 15 和 19 兩筆，原因不明。
2. Netflix TW 的年齡分級——Netflix 依 IP 給頁面，沒讀；IMDb 的 Taiwan 欄位（苦盡柑來 12+、妳和其餘的一切 13+、請回答1988 13+、我的大叔 0+、我們的藍調時光 16+、陽光先生 16+）是使用者提交，我的大叔 0+ 和 Disney+ TW 15+／HBO Max TW 16+ 明顯衝突。
3. 正年在 Disney+ TW 的分級——頁面「分級：」欄位抽出來是空的。
4. Reply 1988 與 Mr. Sunshine 的 Parents Guide 類別對應——jina 回傳的版本沒有類別標題，依 IMDb 固定順序推定（partial）。
5. 請回答1988「各季獨立、不必先看前作」——Wikipedia 只寫「anthology series」，沒有直接這樣說。
6. 《妳和其餘的一切》在 Netflix 是一次上線還是分批——Wikipedia 只寫上線日。
7. 《妳和其餘的一切》、《我的出走日記》、《陽光先生》的單集片長——Wikipedia infobox 片長欄空白。
8. 玉氏夫人傳在 Hami Video 寫「全32集」與 Wikipedia 16 集的差異原因。
9. Reply 1988、我的大叔、SKY Castle、玉氏夫人傳、衣袖紅鑲邊有沒有 RT Tomatometer——RT slug 猜錯被導回首頁，Groundlane 搜尋也沒找到。
10. 壞媽媽、無人島的 Diva、我們的藍調時光、我的出走日記目前是否仍在 Netflix TW——官方證據都是 2022–2023 年；SKY Castle 是否在 Netflix TW——只有 JustWatch。
11. 正年原作網漫在台灣能不能看——只有 IMDb 使用者評論說「not available internationally」。

## toolDegradation

- Groundlane MCP（deferred，用 ToolSearch 載入）：Wikipedia `action=raw` 的 `web_extract` pattern 正常（14/14）。第一次 pattern 用了巢狀量詞被拒（`extract.pattern.high_risk`），改成有界的單層量詞後成功；pattern 欄位要指定 `group: 0` 才會回整段比對，否則只回第一個 capture group。Wikidata SPARQL 用 `web_fetch` 正常。MyDramaList 劇頁與站內搜尋用 `web_extract`（render=never）正常（14/14）。RT 系列頁 9/14 讀到，5 個 slug 被導回首頁。Groundlane `web_search` 這次 tavily、exa 兩個 provider 顯示 unavailable，只剩 brave、you 回結果。
- IMDb：沒有用 Groundlane 讀（依指示，Groundlane 常拿到機器人驗證頁），改用 jina `read_url`（無 key）。Parents Guide 14/14、標題頁 14/14 讀到；其中 Reply 1988、Mr. Sunshine 的 Parents Guide 回傳版本缺類別標題（partial）。jina 的 `question` 參數沒有 API key 時不生效，會回全文；一次 5 個標題頁的輸出超過上限，存成檔案後用 python 抽「評分 票數」。
- Exa：已載入但這次不需要。Tavily：沒有載入（前面的工具已足夠）。Firecrawl：額度用完，沒用。終端機 curl：被擋，沒用。
- Netflix TW 劇頁：沒有抓（Netflix 依 IP 給頁面，不算證據）。
