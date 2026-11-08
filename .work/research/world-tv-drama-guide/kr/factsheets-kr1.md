# 韓劇 1 事實表：愛情、穿越與奇幻浪漫（18 部）

- 查核日：2026-11-08。順序照 `post-kr1-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取（非即時，日期以頁面「最近修正」為準）；**partial** 表示只讀到部分（例如 IMDb 頁面少了類別標籤或認證區塊）；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），每類只留 2–4 個最有資訊量的。已刪掉：`A SDA-K`（首爾國際電視劇獎韓國單元，awards 檔自己也說可能不是評審獎）、`C Douban`（只有 snippet）、`G(轉譯)`（Joynews24 韓國業內票選轉譯）、負評為主的提及。這輪 18 部沒有遇到業配標示。**拆列說明**：King the Land（#6）、Crash Course in Romance（#9）的 `G LINE TODAY 2023 網友投票` 是從 fans 檔第 151 行「LINE TODAY 2023 網友投票其他上榜作」合併列拆出來的；fans 檔第 173 行「Dcard Z.Y 4 分、只有單一來源」合併列裡沒有本篇的劇。
- **欄位 4 分級的兩種來源要分開看**：「韓國播出分級」是電視台／平台標示（15세 이상 시청가＝15 歲以上）；IMDb Parents Guide 是**使用者投稿與投票**，不是官方分級。嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。**韓劇的 Parents Guide 票數普遍很少（多數 10–50 票），5 部完全沒有投票資料**，寫文時不宜當成強證據。
- **欄位 5 RT**：只有 7 部有 Tomatometer，而且影評數都只有 5–8 則，樣本很小。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、類型、集數、首播／完結日、電視台、片長、前置作品 | 英文 Wikipedia wikitext（`action=raw`），抽 infobox `genre` / `based_on` / `num_episodes` / `runtime` / `network` / `first_aired` / `last_aired`、導言、Synopsis／Plot／Premise | Groundlane `web_extract`（pattern） | read（18/18；Love in the Big City 用 `Love_in_the_Big_City_(TV_series)`） |
| 韓國播出分級、特別篇集數 | 韓文 Wikipedia wikitext（`시청 등급`、`방송 횟수`） | Groundlane `web_extract` | read（12/18 有分級欄） |
| 韓文維基缺分級的補查 | 나무위키（namu.wiki） | Groundlane（瀏覽器逾時）→ jina（Cloudflare 驗證頁）→ Exa `web_fetch_exa` | cache（4 部讀到）；另 2 部只有部落格 snippet |
| IMDb ID、MDL ID | Wikidata SPARQL（P345、P3868） | Groundlane `web_fetch` | read（18/18 有 IMDb ID；12/18 有 MDL ID，其餘 6 部用 MDL 站內搜尋找到） |
| Parents Guide 五類別 + 各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文） | read（18/18）；其中 5 頁只回內容不回類別標題（標 partial，見各劇） |
| IMDb 評分與票數 | IMDb 標題頁 | Groundlane 拿到 2KB 機器人頁 → Exa `web_fetch_exa` | cache（18/18） |
| MyDramaList 分數與評分人數 | `mydramalist.com/<id>` 的「Score: X (scored by N users)」 | Groundlane `web_extract`（render=never） | read（18/18） |
| Rotten Tomatoes | `rottentomatoes.com/tv/<slug>`，選取 `rt-text[slot=critics-score]`、`rt-link[slot=critics-reviews]`、`rt-text[slot=audience-score]` | Groundlane `web_extract` | read（11 個 slug 有頁面；7 個 slug 猜測 404） |

---

## 1. Bon Appétit, Your Majesty

1. **片名**：**暴君的廚師**（Netflix Taiwan YT，tw-availability-1）／폭군의 셰프／*Bon Appétit, Your Majesty*
2. **劇情**：在巴黎拿下大獎的法式料理主廚延智英，回國班機上因日蝕穿越到朝鮮，被以暴君著稱、味覺極挑剔的國王李獻任命為御廚，靠融合料理在宮廷權鬥裡求生。Wikipedia：「a South Korean French cuisine chef who … time-slips to the past and encounters the king, who is regarded as both the best gourmet and the worst tyrant」。來源：https://en.wikipedia.org/wiki/Bon_App%C3%A9tit,_Your_Majesty （read）
3. **季數與狀態**：1 季 12 集，tvN 2025-08-23 到 09-28（週六日 21:10），**已完結的單季完整故事**。片長 80 分鐘（infobox）。韓國以外在 Netflix 串流。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb Certifications 也列 South Korea 15，read）
   - 台灣：IMDb Certifications 列「Taiwan 13+ Netflix rating」（read）；Netflix TW 頁沒有直接讀（IP 決定內容）。美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt37600136/parentalguide/ ）：Sex & Nudity **None**（20/22）、Violence & Gore **Mild**（11/20）、Profanity **Mild**（8/16）、Alcohol, Drugs & Smoking **Mild**（12/19）、Frightening & Intense **None**（11/18）。投稿提到：第 5 集有親吻；「"mild" torture scenes, murder and some bloody fights」。**票數約 20，參考性有限。**
5. **觀眾評分**：MDL **8.4**（52,054 人評分，https://mydramalist.com/777998-the-tyrant-s-chef ，read）；IMDb **8.0**（16K 票，cache）。RT：Tomatometer **80%**（5 則）、Popcornmeter **95%**（https://www.rottentomatoes.com/tv/bon_appetit_your_majesty ，read；樣本很小）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2026
   - B：Time-K2025（Burt）honorable mention
   - C：IMDb 8.0（16K）
   - D：NielsenKR cable #12 17.107%；Netflix H2 2025 38M
   - E：FUNdex Awards 2025 TV drama best + global star（林允兒）
   - F：PTT 2025 最愛串 約 9 人
   - G：Netflix TW 2025-09-15～21 #1（累計 9 週）；LINE TODAY 韓劇年度榜（前十）；遠見 #2
   - （已刪：`G(轉譯) Joynews24 #2`。DailyView 聲量 #3 的原 tag 註明「爭議也多」，屬聲量不是好評，沒保留。）
7. **前置作品**：改編自朴國載（Park Kook-jae）的網路小說《연산군의 셰프로 살아남기》（英文 *Surviving as Yeonsangun's Chef*，infobox `based_on`，read）。不必先看原作。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/82024853 — 證據 https://www.youtube.com/watch?v=pRhkMobjKts 「《暴君的廚師》 | 最終預告 | Netflix」，Netflix Taiwan，2025-09-22（「只在Netflix」）— **confirmed (official channel)**（tw-availability-1）
- **類型核對**：infobox genre＝Historical / Fantasy / Romantic / Time travel；導言「fantasy romantic television series with elements of time travel」（read）。**符合本篇（奇幻穿越愛情）**。

## 2. Lovely Runner

1. **片名**：**背著善宰跑**（TW media, Netflix；tw-availability-1）／선재 업고 튀어／*Lovely Runner*
2. **劇情**：鐵粉林率在偶像柳善宰猝逝後，意外穿越回 2008 年兩人都 19 歲的高中時期，決心改寫兩人的命運。Wikipedia Synopsis：「Sol is devastated and is transported to fifteen years into the past, in 2008」。來源：https://en.wikipedia.org/wiki/Lovely_Runner （read）
3. **季數與狀態**：1 季 16 集，tvN 2024-04-08 到 05-28（週一二 20:50），**已完結的單季完整故事**。片長 70 分鐘。韓國在 TVING 串流。沒有讀到特別篇（韓文維基 pattern 沒抓到「스페셜」）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb Certifications South Korea 15，read）
   - 台灣：IMDb Certifications 沒有台灣列；沒有找到 Netflix TW 分級來源。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31324295/parentalguide/ ）：Sex & Nudity **None**（19/32）、Violence & Gore **Mild**（16/23）、Profanity **Mild**（6/16）、Alcohol, Drugs & Smoking **Mild**（16/19）、Frightening & Intense **Moderate**（11/20）。投稿提到：有流血的打鬥；英文字幕有數次 f-word（「Was very surprised as usually dramas are more clean」）。Frightening 的說明標成 Spoilers，沒展開。**票數 16–32，參考性有限。**
5. **觀眾評分**：MDL **8.9**（113,035 人，https://mydramalist.com/750099-time-walking-on-memory ，read；MDL 網址用的是拍攝期暫名）；IMDb **8.5**（18K，cache）。RT：`/tv/lovely_runner` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2025
   - B：Time-K2024（Burt）#1；Cine21-2024 #10=
   - C：IMDb 8.5（18K）；MDL #15 8.9
   - E：FUNdex 2024 TV ending-drama buzz #1；Awards 2024 TV drama finalist + actor grand prize（邊佑錫）
   - F：PTT 2026 入坑串 3（「劇名很雷但是寶藏神劇」）；Dcard Z.Y 3 分
   - G：LINE TODAY 聚光賞 2024 十大 #6、熱門劇評 #4、聲量 #3
7. **前置作品**：改編自 Kim Bbang（김빵）的網路小說《明日的頂尖》（*Tomorrow's Best*，韓文《내일의 으뜸》），也有 Doong Doong 繪製的網漫版（導言，read；韓文原名未在讀到的段落出現，是背景知識，待查）。不必先看。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81914565 。愛奇藝是 2024 年台灣獨家（https://www.iq.com/album/%E7%8D%A8%E5%AE%B6-%E8%83%8C%E8%91%97%E5%96%84%E5%AE%B0%E8%B7%91-2024-fbjju2hnrh?lang=zh_tw ），目前台灣狀態未查。證據：風傳媒 2026-06-02 https://www.storm.mg/lifestyle/11137723 「2026 年 5 月 31 日終於正式登陸 Netflix 台灣」；另見風傳媒 2026-09-09 Netflix 片單 https://www.storm.mg/lifestyle/11163194 — **confirmed (Taiwan media, 2026-06-02)**（tw-availability-1）
- **類型核對**：infobox genre＝Time slip / Romantic comedy / Fantasy（read）。**符合本篇（穿越浪漫喜劇）**。

## 3. Twenty-Five Twenty-One

1. **片名**：**二十五，二十一**（Netflix YT；tw-availability-1）／스물다섯 스물하나／*Twenty-Five Twenty-One*
2. **劇情**：1998 年亞洲金融風暴下，擊劍少女羅希度與家道中落的白易辰各自追夢，故事橫跨 1998 到 2021 年，描寫五個角色的青春與愛情。Wikipedia：「The series depicts the romantic lives of five characters spanning from 1998 to 2021」。來源：https://en.wikipedia.org/wiki/Twenty-Five_Twenty-One （read）
3. **季數與狀態**：1 季 16 集，tvN 2022-02-12 到 04-03（週六日 21:10），**已完結的單季完整故事**。片長 80 分鐘。**另有 1 集特別篇**（韓文維基「16부작 + 스페셜 1부작」，read）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청등급 = 15` 與 15세 이상 시청가 圖示，read；IMDb 列 South Korea 15 self-applied）
   - 台灣：IMDb Certifications「Taiwan 13+ self-applied」（read；self-applied 是平台自填，不是台灣主管機關分級）。美國 TV-14。
   - IMDb Parents Guide（**partial**：jina 回傳只有分數與票數、沒有類別標題，以下依頁面固定順序對應；https://www.imdb.com/title/tt17513352/parentalguide/ ）：Sex & Nudity **None**（41/44）、Violence & Gore **None**（28/33）、Profanity **Mild**（20/30）、Alcohol, Drugs & Smoking **Mild**（23/30）、Frightening & Intense **None**（22/24）。投稿提到：「Some mild swearing throughout the show」；角色偶爾喝酒。
5. **觀眾評分**：MDL **8.8**（101,281 人，https://mydramalist.com/695149-twenty-five-twenty-one ，read）；IMDb **8.5**（24K，cache）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**；Popcornmeter 98%（read，不建議引用）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2022；AACA Best Drama Series grand WIN 2022（+KR national）
   - B：Cine21-2022 #6
   - C：IMDb 8.5（24K）；MDL #47 8.8
   - D：NielsenKR cable #37 11.513%；KDF 2022 #9 11.5%
   - F：PTT 標題〈我心中的韓劇第一神劇〉59 推（2022）；Dcard Z.Y 4 分；PTT 2026 入坑串 1
   - G：無
7. **前置作品**：沒有，原創劇（infobox `based_on` 欄空白，read）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81517168 — 證據：風傳媒 2026-09-09 Netflix 韓劇片單 #5 https://www.storm.mg/lifestyle/11163194 ；另 https://www.youtube.com/watch?v=FhWBssPtZ4k 「二十五，二十一 | 正式預告 | Netflix」，Netflix Malaysia，2022-02-08 — **confirmed (Taiwan media, 2026-09-09)**（tw-availability-1）
- **類型核對**：infobox genre 第一項 Romance（後續項目被 ref 截斷，沒讀完）；導言寫「romantic lives of five characters」（read）。**符合本篇（青春愛情）**；也帶運動、成長元素。

## 4. Queen of Tears

1. **片名**：**淚之女王**（Netflix Taiwan YT；tw-availability-1）／눈물의 여왕／*Queen of Tears*
2. **劇情**：皇后集團財閥三代洪海仁與農家出身的丈夫白賢祐結婚三年、瀕臨離婚，海仁卻被診斷出腦瘤，兩人被迫面對積壓的心結、重新相愛。Wikipedia：「The series explores the nuances of a married couple going through a difficult time together」。來源：https://en.wikipedia.org/wiki/Queen_of_Tears （read）
3. **季數與狀態**：1 季 **16 集 + 2 集特別篇**（infobox「16 + 2 special」；나무위키「16부작 + 스페셜 2부작」，cache），tvN 2024-03-09 到 04-28（週六日 21:20），**已完結的單季完整故事**。片長 80～90 分鐘。導言另寫：大結局 Nielsen 全國收視 24.850%，成為 tvN 收視最高的劇（超越《愛的迫降》）；Netflix 2024 年 9 月報告稱它是 Netflix 史上觀看時數最多的韓國電視劇（682.6M 小時）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상 시청가**（나무위키 infobox，cache；韓文維基沒有分級欄；IMDb Certifications South Korea 15，read）
   - 台灣：IMDb Certifications「Taiwan 12+」（read，沒有標註是哪個平台）。美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt27668559/parentalguide/ ）：Sex & Nudity **None**（37/46）、Violence & Gore **Mild**（18/28）、Profanity **Mild**（14/27）、Alcohol, Drugs & Smoking **Mild**（21/26）、Frightening & Intense **Mild**（15/25）。投稿提到：親吻；不常出現的 Hell、Damn、S--- 等輕度髒話；一般的喝酒、喝醉場面。
5. **觀眾評分**：MDL **8.7**（97,956 人，https://mydramalist.com/725367-queen-of-tears ，read）；IMDb **8.2**（29K，cache）。RT：Tomatometer **100%**（6 則，https://www.rottentomatoes.com/tv/queen_of_tears ，read；英文維基也寫「100% of 6 critics' reviews」）。Popcornmeter 頁面上有多組相關作品分數，第一組是 75%，**不確定是否就是本劇，partial，不建議引用**。
6. **推薦 tag**：
   - A：無（唯一的 A 是 SDA-K Excellence 2024，已刪）
   - C：IMDb 8.2（29K）
   - D：NielsenKR cable #3 24.850%；KDF 2024 #1 24.8%；Netflix H1 2024 29M（該半年最高韓劇）
   - E：FUNdex Awards 2024 grand prize + TV drama best；2024 TV ending-drama buzz #2
   - F：PTT 2024 徵文 8 推
   - G：LINE TODAY 聚光賞 2024 十大 #7、熱門劇評 #2、聲量 #1；Netflix TW 2024-04-08～14 #2（累計 15 週，抽樣中最長）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。編劇朴智恩也寫了《愛的迫降》，不必先看。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81707951 — 證據 https://www.youtube.com/watch?v=oEzMOiEkU2A 「淚之女王 | 最終預告 | Netflix」，Netflix Taiwan，2024-04-25 — **confirmed (official channel)**（tw-availability-1）
- **類型核對**：infobox genre＝Romantic comedy；導言「romantic comedy television series」（read）。**符合本篇**。注意劇情有絕症與家族鬥爭，情緒比典型浪漫喜劇重。

## 5. Crash Landing on You

1. **片名**：**愛的迫降**（TW media, Netflix；tw-availability-1）／사랑의 불시착／*Crash Landing on You*
2. **劇情**：南韓財閥千金尹世理玩滑翔傘被龍捲風吹過邊界、迫降北韓，被北韓軍官李正赫藏匿保護，兩人跨越分裂的國界相戀。Wikipedia：「a South Korean chaebol heiress who is swept across the border by a tornado while paragliding and lands in North Korea」。來源：https://en.wikipedia.org/wiki/Crash_Landing_on_You （read）
3. **季數與狀態**：1 季 16 集，tvN 2019-12-14 到 2020-02-16，**已完結的單季完整故事**。片長 70–110 分鐘。**特別篇**：2020-01-04～05 停播改播〈사랑의 불시착 스페셜 - 사랑불을 켜라〉（韓文維基，read）；農曆年另播〈설 선물세트〉（英文維基：1 月 25 日播出的「Lunar New Year Gift Set」，read）。製作預算約 2,000 萬美元，在瑞士、蒙古、南韓拍攝（導言，read）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청등급 = 15`，read；IMDb South Korea 15）
   - 台灣：IMDb Certifications「Taiwan 13+ self-applied」（read）。美國 TV-14 self-applied。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt10850932/parentalguide/ ）：Sex & Nudity **None**（113/135）、Violence & Gore **Mild**（46/77）、Profanity **Mild**（38/58）、Alcohol, Drugs & Smoking **Mild**（48/65）、Frightening & Intense **Mild**（39/63）。投稿提到：槍戰、刺傷、徒手打鬥，有一場大槍戰、少數流血槍擊；英文字幕有一次「motherf**ker」；多集有喝酒、喝醉。**本篇票數最多的一部（58–135 票）。**
5. **觀眾評分**：MDL **9.0**（170,265 人，https://mydramalist.com/35729-emergency-lands-of-love ，read；頁面同時顯示 Ranked #68、Popularity #4）；IMDb **8.7**（62K，cache）。RT：Tomatometer **100%**（6 則）、Popcornmeter **96%**（https://www.rottentomatoes.com/tv/crash_landing_on_you ，read；樣本很小）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2020；AACA Best Drama Series grand WIN 2020（+KR national）
   - C：IMDb 8.7（62K）；MDL #13 9.0（170,265）
   - D：NielsenKR cable #5 21.683%；KDF 2020 #4 21.7%
   - F：PTT 2021 入坑串 6；Dcard Z.Y 4 分
   - G：無
7. **前置作品**：沒有，原創劇。編劇朴智恩的靈感來自一名南韓女演員漂流到北韓水域的事件（導言，read）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81159258 — 證據：風傳媒 2026-09-09 Netflix 片單 #1 https://www.storm.mg/lifestyle/11163194 — **confirmed (Taiwan media, 2026-09-09)**（tw-availability-1）
- **類型核對**：infobox genre＝Romantic comedy；導言同（read）。**符合本篇**。

## 6. Twinkling Watermelon

1. **片名**：**閃亮的西瓜**（Netflix TW page title in search；tw-availability-1）／반짝이는 워터멜론／*Twinkling Watermelon*
2. **劇情**：在聽障家庭長大、熱愛音樂的 CODA 少年河恩結，和父親大吵後穿越回 1995 年，和年輕時的父親等人組成樂團「Watermelon Sugar」。Wikipedia：「a CODA boy with a natural talent for music … travels back in time to 1995」。來源：https://en.wikipedia.org/wiki/Twinkling_Watermelon （read）
3. **季數與狀態**：1 季 16 集，tvN 2023-09-25 到 11-14（週一二 20:50），**已完結的單季完整故事**。片長 70 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15）
   - 台灣：IMDb Certifications 沒有台灣列。美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt27446493/parentalguide/ ）：Sex & Nudity **None**（28/32）、Violence & Gore **Mild**（10/20）、Profanity **Mild**（11/18）、Alcohol, Drugs & Smoking **Mild**（14/17）、Frightening & Intense **Moderate**（10/18）。投稿特別提到：**多次出現對孩子的身體與言語虐待，「might be hard to watch」**；提到自殺數次（不寫實，但有幾次出現絞索）；對聽障者的歧視言論；英文字幕有 f-word。**票數 17–32，參考性有限。**
5. **觀眾評分**：MDL **9.2**（120,308 人，https://mydramalist.com/739603-sparkling-watermelon ，read；本篇最高）；IMDb **8.8**（17K，cache）。RT：`/tv/twinkling_watermelon` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - C：IMDb 8.8（17K）；MDL #2 9.2（120,308）
   - E：FUNdex Awards 2023 TV drama finalist
   - F：PTT 2026 入坑串 原 PO＋約 17 人（「被片名耽誤」）；PTT 2023 徵文 22 推；Dcard Z.Y 4 分
   - G：LINE TODAY 2023 網友投票 #25（推文約 20 人說它被低估）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/82006291 。friDay 舊頁（https://video.friday.tw/drama/detail/3122 ）回 HTTP 400，授權已到期。證據：Dcard Netflix 板 2026-01-01「推新上架閃亮的西瓜」（https://www.dcard.tw/f/netflix/p/260435923 ），以及 2025 年一則 Threads 貼文「11/14會在Netflix上架」；只有台灣論壇與社群貼文，沒有官方或媒體來源 — **likely (TW forum/social only). This is not a full confirmation.**（tw-availability-1）。**⚠ 寫文前需要台灣裝置確認。**
- **類型核對**：infobox genre＝Fantasy / Romance / Coming-of-age / Time travel（read）。**大致符合本篇（穿越）**，但故事主軸是父子關係、聽障家庭與樂團，愛情是支線之一；放本篇可以，介紹時應寫成「穿越青春音樂劇」而不是愛情劇。

## 7. Crash Course in Romance

1. **片名**：**浪漫速成班**（Netflix TW page title; TW media；tw-availability-1）／일타 스캔들／*Crash Course in Romance*
2. **劇情**：女兒投入韓國大考戰場的小菜店老闆南幸善，和補教界頂尖名師崔致烈之間的苦甜關係。Wikipedia：「the bittersweet relationship between a banchan shop owner … and a top hagwon instructor」。來源：https://en.wikipedia.org/wiki/Crash_Course_in_Romance （read）
3. **季數與狀態**：1 季 16 集，tvN 2023-01-14 到 03-05（週六日 21:10），**已完結的單季完整故事**。片長 70 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15` 與 15세 이상 시청가 圖示，read；IMDb South Korea 15 self-applied）
   - 台灣：IMDb Certifications 沒有台灣列。美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt24578016/parentalguide/ ）：**五個類別全部「No data / No voting data」**，沒有投票，無法引用。
5. **觀眾評分**：MDL **8.3**（48,345 人，https://mydramalist.com/723711-one-shot-scandal ，read）；IMDb **7.7**（7.1K，cache）。RT：Tomatometer **100%**（8 則）、Popcornmeter **94%**（https://www.rottentomatoes.com/tv/crash_course_in_romance ，read；樣本很小）。
6. **推薦 tag**：
   - B：Time-K2023（de Guzman，Netflix-only，unranked）
   - D：NielsenKR cable #13 17.038%；KDF 2023 #6 17%；Netflix H1 2023 #16 234.8M hours（⚠ 這個數字和 ratings 檔 §4 的 Physical: 100「H1 2023 #15, 234.8M h」完全相同，疑似抄錯，引用前要回 Netflix 報告核對）
   - E：FUNdex Awards 2023 TV drama best + supporting（盧尹書）
   - G：LINE TODAY 2023 網友投票 #9（從合併列拆出）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81649877 — 證據：上報 2023-02-06 https://www.upmedia.mg/tw/popularity/upviewpoint/165128 「勇奪Netflix台灣收視冠軍」；另 GQ Taiwan 2023-02-24 — **confirmed (Taiwan media, 2023-02). The evidence is old.**（tw-availability-1）。**⚠ 授權劇（tvN），最新台灣證據是 2023 年，有下架風險；tw-availability-1 也列入「Older evidence, so lapse risk」。**
- **類型核對**：infobox genre＝Romantic comedy（read）。**符合本篇**；題材另含補教與升學競爭，中段有懸疑支線（未讀到 Wikipedia 細節，不寫）。

## 8. Welcome to Samdal-ri

1. **片名**：**歡迎回到三達里**（Netflix Taiwan YT；tw-availability-1）／웰컴투 삼달리／*Welcome to Samdal-ri*
2. **劇情**：在首爾闖出名號的攝影師曹三達事業一夕崩盤，回到濟州老家，和從小一起長大、當上氣象預報員的曹容弼重逢，舊情復燃。Wikipedia：「when her life suddenly falls apart, she returns to her hometown, where she reconnects with Yong-pil」。來源：https://en.wikipedia.org/wiki/Welcome_to_Samdal-ri （read）
3. **季數與狀態**：1 季 16 集，JTBC 2023-12-02 到 2024-01-21（週六日 22:30），**已完結的單季完整故事**。片長 70 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상 시청가**（나무위키，cache；韓文維基沒有分級欄；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications 沒有台灣列。美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26653824/parentalguide/ ）：Sex & Nudity **Mild**（8/13）、Violence & Gore **None**（5/7）、Profanity **Mild**（3/7）、Alcohol, Drugs & Smoking **Moderate**（6/9）、Frightening & Intense **Mild**（3/6）。投稿提到：第 16 集暗示兩人發生關係（同床醒來，沒有裸露，以喜劇處理）；整部劇大量喝酒；第 12 集有一場街頭攻擊與辱罵。**每類只有 6–13 票，參考性很低。**
5. **觀眾評分**：MDL **8.5**（62,386 人，https://mydramalist.com/743267-welcome-to-samdalri ，read）；IMDb **8.0**（11K，cache）。RT：`/tv/welcome_to_samdalri` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - C：IMDb 8.0（11K）
   - D：NielsenKR cable #30 12.399%；KDF 2024 #5 12.4%
   - F：PTT 2023 徵文 6 推
   - G：LINE TODAY 2023 網友投票 #20；Netflix TW 2024-01-01～07 #3（累計 10 週）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81697983 — 證據 https://www.youtube.com/watch?v=NAJTcZ8AGI8 「歡迎回到三達里 | 正式預告 | Netflix」，Netflix Taiwan，2023-11-21（「Netflix 獨家」）— **confirmed (official channel)**（tw-availability-1）。**⚠ 授權劇（JTBC），tw-availability 的證據是 2023 年**；fans 檔另有 Netflix Tudum 台灣 Top 10 2024-01-01～07 #3（2024，read 於 fans 檔），最新證據約 2024 年初，建議寫文前再確認。
- **類型核對**：infobox genre＝Comedy drama / Romantic comedy（read）。**符合本篇**。

## 9. Hotel del Luna

1. **片名**：**德魯納酒店**（Disney+ TW page；tw-availability-2）／호텔 델루나／*Hotel del Luna*
2. **劇情**：只接待鬼魂的神秘飯店「德魯納」，由被詛咒困在這裡上千年的社長張滿月經營，菁英飯店人具燦星被迫成為新任經理。Wikipedia：「a supernatural hotel that caters exclusively to ghosts」。來源：https://en.wikipedia.org/wiki/Hotel_del_Luna （read）
3. **季數與狀態**：1 季 16 集，tvN 2019-07-13 到 09-01，**已完結的單季完整故事**。片長 73–94 分鐘。編劇洪氏姊妹。沒有讀到特別篇（韓文維基「16부작」，read）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청등급= 15` 與圖示，read；IMDb South Korea 15）
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-2，2026-11-08 讀到）；IMDb Certifications 卻列「Taiwan 13+ self-applied」（read）。**兩者不一致，文章以 Disney+ TW 頁的 15+ 為準。**
   - IMDb Parents Guide（**partial**：沒有類別標題，依頁面固定順序對應；Summary 寫「not yet rated」；https://www.imdb.com/title/tt10220588/parentalguide/ ）：Sex & Nudity **None**（24/29）、Violence & Gore **Moderate**（7/14）、Profanity **Mild**（7/9）、Alcohol, Drugs & Smoking **Moderate**（9/13）、Frightening & Intense **Mild**（11/20）。投稿提到：有些鬼魂死狀慘烈，「When there is blood, there is a lot」，鬼妝嚇人；幾乎每集都在喝酒；孕婦流血受苦的畫面。**票數很少。**
5. **觀眾評分**：MDL **8.5**（117,752 人，https://mydramalist.com/32925-hotel-del-luna ，read）；IMDb **8.1**（19K，cache）。RT：`/tv/hotel_del_luna` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - A：AACA Best Drama KR national 2019
   - C：IMDb 8.1（19K）
   - D：NielsenKR cable #33 12.001%
   - F：PTT 2021 入坑串 4
   - （已刪：Dcard Z.Y 2 分，偏負評。）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-55025af9-5fb7-46a1-a6c3-3e27626652ca （訂閱）。Netflix https://www.netflix.com/tw/title/81205849 （JustWatch only）。證據：Disney+ TW 頁「觀看德魯納酒店 | Disney+」，15+，2026-11-08 仍上架（service page）；Netflix 部分只有 JustWatch TW 與一則 2024 Dcard 貼文說 9/2 上 Netflix TW；HBO Max TW 舊頁 df6b8125… 已回錯誤頁 — **confirmed (service page): Disney+. Netflix is JustWatch only.**（tw-availability-2）。文章建議寫「Disney+（Netflix 亦可能有）」。
- **類型核對**：infobox genre＝Dark fantasy / Romantic comedy / Tragicomedy（read）。**符合本篇（奇幻浪漫）**；帶恐怖鬼魂元素。

## 10. Guardian: The Lonely and Great God（Goblin）

1. **片名**：**孤單又燦爛的神－鬼怪**（Disney+ TW page；HBO Max TW 寫「孤單又燦爛的神-鬼怪」；tw-availability-2）／쓸쓸하고 찬란하神 – 도깨비／*Guardian: The Lonely and Great God*（通稱 *Goblin*）
2. **劇情**：高麗武將金信遭年輕君王誣陷處死，被詛咒成永生不死的鬼怪，只有「鬼怪新娘」能拔出他胸口的劍結束生命；能看見鬼魂的高中生池恩倬就是那位新娘。Wikipedia：「The only person that can end his immortality is the Goblin's bride, who can pull the sword that has been embedded in him」。來源：https://en.wikipedia.org/wiki/Guardian:_The_Lonely_and_Great_God （read）
3. **季數與狀態**：1 季 **16 集 + 3 集特別篇**（infobox「16 + 3 specials」；韓文維基「16부작+스페셜 3부작(전 19부작)」，read），tvN 2016-12-02 到 2017-01-21，**已完結的單季完整故事**。片長 60–90 分鐘（第 1、2 集 90 分鐘特別編排）。編劇金銀淑。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청등급 = 15`，read）
   - 台灣：Disney+ TW 頁標 **12+**、HBO Max TW 頁標 **13+**（tw-availability-2，2026-11-08）。
   - IMDb Parents Guide（**partial**：沒有類別標題、也沒有回傳 Certifications，依頁面固定順序對應；https://www.imdb.com/title/tt5994364/parentalguide/ ）：Sex & Nudity **None**（36/48）、Violence & Gore **Mild**（17/23）、Profanity **None**（6/7）、Alcohol, Drugs & Smoking **Mild**（7/9）、Frightening & Intense **Mild**（4/6）。投稿提到：約九成的暴力在高麗戰爭倒敘（刀劍砍殺、短暫噴血）；三次掐脖子；暗示丈夫把妻子推下高樓；「When there are emotional scenes, expect to cry」。**後三類只有 6–9 票。**
5. **觀眾評分**：MDL **8.8**（175,311 人，https://mydramalist.com/18452-goblin ，read；本篇評分人數最多）；IMDb **8.5**（39K，cache）。RT：`/tv/goblin` 頁面存在但 **0 則影評、沒有 Tomatometer**；Popcornmeter 94%（read，不建議引用）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2017
   - C：IMDb 8.5（39K）；MDL #44 8.8
   - D：NielsenKR cable #7 18.680%
   - F／G：無（fans 檔沒有這部）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-e62ac894-f6b0-4580-8fcc-da30de683560 、**HBO Max** https://www.hbomax.com/tw/zh/show/4b094f1c-f494-43e5-92d4-d35e2dcc04a0 （皆訂閱）。Netflix https://www.netflix.com/tw/title/81012510 （JustWatch only）。證據：Disney+ TW 頁（12+）與 HBO Max TW 頁（13+）2026-11-08 都在架；JustWatch TW 列 Netflix、Disney Plus、HBO Max — **confirmed (service page): Disney+ and HBO Max**（tw-availability-2）
- **類型核對**：infobox genre＝Fantasy / Romantic comedy / Drama（read）。**符合本篇（奇幻浪漫）**。

## 11. Love Scout

1. **片名**：**我的完美秘書**（Hami Video page；tw-availability-2）／나의 완벽한 비서／*Love Scout*
2. **劇情**：工作狂的獵頭公司 CEO 姜智允，遇到能幹又是單親爸爸的秘書柳恩浩，兩人在職場上互相照顧、逐漸相愛。Wikipedia：「The series is about the romance between the CEO and secretary」。來源：https://en.wikipedia.org/wiki/Love_Scout （read）
3. **季數與狀態**：1 季 **12 集 + 2 集特別篇**（infobox「12 + 2 special」；韓文維基「12부작 + 스페셜 2부작」，read），SBS 2025-01-03 到 02-14（週五六 22:00），**已完結的單季完整故事**。infobox 片長欄空白；IMDb 標題頁寫 1h 10m（cache）。韓國在 Wavve 串流。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（IMDb Certifications South Korea 15，read）。韓文維基與 나무위키 都沒讀到分級文字；韓國部落格寫「15세 이상 시청가」（snippet，tistory／naver blog，只當旁證）。
   - 台灣：沒有找到台灣分級來源（Hami 頁沒讀分級）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt34730468/parentalguide/ ）：**五個類別全部「No data」，沒有投票**；Summary「not yet rated」。Certifications 只有 Singapore PG13、South Korea 15、Spain 16。
5. **觀眾評分**：MDL **8.4**（30,987 人，https://mydramalist.com/756733-greetings ，read）；IMDb **7.7**（3.4K，cache）。RT：`/tv/love_scout` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - B：Time-K2025（Burt）honorable mention
   - F：PTT 2025 最愛串 約 13 人；Dramabeans 2025 Best Romance
   - G：Hami Video 2025 戲劇收視 #1；LINE TODAY 韓劇年度榜（前十）；DailyView 聲量 #7
   - （已刪：Dcard Z.Y 2 分。）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`；部落格寫「지은 작가의 오리지널 창작물」，snippet）。
8. **台灣串流**：**Hami Video** https://hamivideo.hinet.net/product/281919.do （訂閱方案或單集；頁面有「更多訂閱方案」和單次選項，但沒寫這部屬於哪個方案）；另有中華電信 MOD。證據：Hami 頁 2026-11-08 正常載入（全12集，演員韓志旼／李浚赫）；TVBS 2025-01-20 https://news.tvbs.com.tw/entertainment/2755684 「Hami Video全台獨家播出」；Netflix TW 沒有（Netflix 只在港新馬上架，JustWatch 無台灣條目）— **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre＝Romance drama / Workplace（read）。**符合本篇（職場愛情）**。

## 12. Hometown Cha-Cha-Cha

1. **片名**：**海岸村恰恰恰**（Netflix trailer；tw-availability-2）／갯마을 차차차／*Hometown Cha-Cha-Cha*
2. **劇情**：首爾牙醫尹惠真人生出狀況，在亡母生日那天來到海邊小村公辰開診所，認識了什麼都會做的萬事通「洪班長」洪斗植，兩人慢慢相戀。Wikipedia Premise：「The romantic drama depicts the growing romance between the two, as well as the lives of other residents of Gongjin」。來源：https://en.wikipedia.org/wiki/Hometown_Cha-Cha-Cha （read）
3. **季數與狀態**：1 季 16 集，tvN 2021-08-28 到 10-17（週六日 21:00），**已完結的單季完整故事**。片長 60 分鐘（infobox）。最高全國收視 12.665%。沒有讀到特別篇（韓文維基「16부작」）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청등급 = 15`，read；IMDb South Korea 15）
   - 台灣：IMDb Certifications「Taiwan 12+」（read，沒有標平台）。美國 TV-14。
   - IMDb Parents Guide（**partial**：沒有類別標題，依頁面固定順序對應；https://www.imdb.com/title/tt14518756/parentalguide/ ）：Sex & Nudity **None**（17/24）、Violence & Gore **Mild**（9/20）、Profanity **Mild**（15/18）、Alcohol, Drugs & Smoking **Mild**（16/19）、Frightening & Intense **Mild**（9/18）。投稿提到：一場性騷擾（男子非自願摟女子腰）；男主角反覆做血手抓人的噩夢；有恐懼、創傷與自殺的情節；「No F-bombs whatsoever」。
5. **觀眾評分**：MDL **8.7**（117,234 人，https://mydramalist.com/683929-mr-hong ，read；MDL 網址用的是拍攝期暫名）；IMDb **8.3**（31K，cache）。RT：頁面存在（`/tv/seaside_village_cha_cha_cha`）但 **0 則影評、沒有 Tomatometer**；Popcornmeter 96%（read，不建議引用）。
6. **推薦 tag**：
   - C：IMDb 8.3（31K）
   - D：NielsenKR cable #28 12.665%
   - F：PTT 2021 入坑串 約 7 人；PTT 2026 入坑串 1；Dcard Z.Y 3 分
   - G：無
7. **前置作品**：**翻拍自 2004 年韓國電影《洪班長》**（*Mr. Handy, Mr. Hong*，infobox `based_on` 與導言，read）。不必先看。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81473182 — 證據 https://www.youtube.com/watch?v=40ln5uRFgmk 「海岸村恰恰恰 | 正式預告 | Netflix」，Netflix Malaysia/@netflixasia，2021-08-11；JustWatch TW（2026-11-08）只列 Netflix — **confirmed (official channel, Asia zh channel). The evidence is old; JustWatch backs it as current.**（tw-availability-2）。**⚠ 授權劇（tvN），官方證據是 2021 年亞洲頻道，2026 年只有 JustWatch 佐證。**
- **類型核對**：infobox genre＝Comedy drama / Romantic comedy（read）。**符合本篇**。

## 13. Mr. Queen

1. **片名**：**哲仁王后**（HBO Max TW page；tw-availability-2）／철인왕후／*Mr. Queen*
2. **劇情**：青瓦臺的花花公子主廚張峰煥落水後，靈魂醒在朝鮮哲宗的王后金素容身上，一邊在宮中求生，一邊和想當好君主的哲宗周旋。Wikipedia：「Queen Cheorin finding herself with the soul of a modern-day man inside her body」。來源：https://en.wikipedia.org/wiki/Mr._Queen （read）
3. **季數與狀態**：1 季 20 集，tvN 2020-12-12 到 2021-02-14，**已完結的單季完整故事**。片長 70–90 分鐘。**另有衍生短篇《Mr. Queen: The Secret》**（韓文名《哲仁王后：竹林》），補完哲宗與王后的愛情線，在第 19、20 集後**只在 TVING 播出**（英文維基，read）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청등급 = 15` 與圖示，read；IMDb South Korea 15）
   - 台灣：HBO Max TW 頁標 **13+**（tw-availability-2，2026-11-08）。IMDb 另列美國 **TV-MA**、新加坡 HBO Max PG13／Netflix NC16（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt13400006/parentalguide/ ）：Sex & Nudity **Mild**（10/12）、Violence & Gore **None**（5/7）、Profanity **Mild**（3/5）、Alcohol, Drugs & Smoking **Mild**（3/4）、Frightening & Intense **Mild**（2/4）。投稿提到：熱烈的吻戲與暗示的床戲；一閃而過、打馬賽克的春宮書頁；一段暗示女性群交的夢境；主角被描寫成花花公子。**每類只有 4–12 票，參考性很低。**
5. **觀眾評分**：MDL **8.9**（79,656 人，https://mydramalist.com/58365-queen-cheorin ，read）；IMDb **8.5**（17K，cache）。RT：`/tv/mr_queen` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - C：IMDb 8.5（17K）；MDL #18 8.9（79,656）
   - D：NielsenKR cable #11 17.371%；KDF 2020 #9 12.4%（只算 2020 年部分）
   - F：PTT 2021 入坑串 3
   - G：無
7. **前置作品**：**改編自中國網劇《太子妃升職記》**（*Go Princess Go*，原作小說作者鮮橙；infobox `based_on`，read）。不必先看。衍生篇見欄位 3。
8. **台灣串流**：**HBO Max** https://www.hbomax.com/tw/zh/show/80826f60-468a-4ac2-aaee-466e7889fd72 （訂閱）。Netflix https://www.netflix.com/tw/title/81422314 （JustWatch only）。證據：HBO Max TW 頁「觀看 哲仁王后 | HBO Max」（13+）2026-11-08 在架；JustWatch TW 列 Netflix、HBO Max — **confirmed (service page): HBO Max**（tw-availability-2）
- **類型核對**：infobox genre＝Historical / Romantic comedy / Fantasy / Body swap（read）。**符合本篇（奇幻古裝喜劇）**。注意「穿越」在這裡是靈魂互換，不是時空旅行。

## 14. King the Land

1. **片名**：**歡迎來到王之國**（Netflix trailer；tw-availability-2）／킹더랜드／*King the Land*
2. **劇情**：被捲入繼承權之爭的飯店集團繼承人具元，和總是帶著笑容的飯店員工千思朗相遇。Wikipedia：「Gu Won who is the heir of The King Group … and Cheon Sa-rang, a hotelier who always has a smile on her face」。來源：https://en.wikipedia.org/wiki/King_the_Land （read）
3. **季數與狀態**：1 季 16 集，JTBC 2023-06-17 到 08-06（週六日 22:30），**已完結的單季完整故事**。片長 70 分鐘。**另有 1 集特別篇**（韓文維基「16부작 + 스페셜 1부작」，read）。韓國在 TVING 串流。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 15세 이상 시청가 圖示，read；IMDb South Korea 15）
   - 台灣：IMDb Certifications 沒有台灣列。美國 TV-14。
   - IMDb Parents Guide（**partial**：沒有類別標題，依頁面固定順序對應；https://www.imdb.com/title/tt26693803/parentalguide/ ）：Sex & Nudity **None**（9/16）、Violence & Gore **None**（10/11）、Profanity **None**（10/13）、Alcohol, Drugs & Smoking **Mild**（11/13）、Frightening & Intense **None**（10/12）。投稿提到：有吻戲；英文台詞偶有搞笑式的「What the f#%*」；一般的喝酒場面。**本篇最「乾淨」的一部，但票數只有 11–16。**
5. **觀眾評分**：MDL **8.3**（105,321 人，https://mydramalist.com/726273-king-the-lander ，read）；IMDb **5.9**（**144K 票**，cache）。RT：Tomatometer **75%**（8 則）、Popcornmeter **24%**（https://www.rottentomatoes.com/tv/king_the_land ，read）。**⚠ IMDb 票數是其他 17 部的 2–60 倍、分數卻最低，RT 觀眾分也只有 24%，和 MDL 8.3 差很多；英文維基沒有讀到相關爭議段落（pattern 搜 controversy／review bomb／Arab 都沒命中），原因未查證。寫文時不要直接引用 IMDb 5.9，或要說明分數異常。**
6. **推薦 tag**：
   - D：NielsenKR cable #24 13.789%；Netflix H2 2023 33M（該半年最高韓劇）
   - E：FUNdex Awards 2023 actor grand prize（李俊昊）+ TV actress（林允兒）；TV drama finalist
   - G：LINE TODAY 2023 網友投票 #6（從合併列拆出）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81671440 — 證據 https://www.youtube.com/watch?v=wAzrXU7N3yM 「歡迎來到王之國 | 正式預告 | Netflix」，Netflix Malaysia/@netflixasia，「6 月 17 日, Netflix獨家」，2023-06-05；JustWatch TW：Netflix — **confirmed (official channel, Asia zh channel)**（tw-availability-2）。**⚠ 授權劇（JTBC），官方證據是 2023 年亞洲頻道，2026 年只有 JustWatch 佐證。**
- **類型核對**：infobox genre＝Romantic comedy（read）。**符合本篇**。

## 15. Love in the Big City

1. **片名**：**大都市的愛情法**（friDay page; Netflix TW；tw-availability-2）／대도시의 사랑법／*Love in the Big City*
2. **劇情**：同志青年高英和異性戀女生崔美愛同居成為摯友，之後他展開十年的自我探索，面對拒絕接受他性向的母親、因社會壓力與戀人分手，再到泰國旅行重新認識自己。Wikipedia：「it depicts the journey of a gay man as he navigates life and love in Seoul」。來源：https://en.wikipedia.org/wiki/Love_in_the_Big_City_(TV_series) （read）
3. **季數與狀態**：1 季 8 集，**TVING 原創**，2024-10-21 上線（導言；infobox 沒有 first_aired／last_aired 欄，read），**已完結的單季完整故事**。片長 47–53 分鐘。導言另提到首播前曾有團體以「美化同性戀」為由反對政府補助（read）。來源：同上（read）
4. **分級**：
   - 韓國：**19세 이상**（韓文維基 19세 이상 시청가 圖示，read；IMDb Certifications 只有一列 South Korea 19，read）。**本篇唯一的 19 禁。**
   - 台灣：沒有找到台灣分級來源（friDay 頁沒讀分級）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt30143510/parentalguide/ ）：**五個類別全部「No data」，沒有投票。**
5. **觀眾評分**：MDL **8.3**（19,413 人，https://mydramalist.com/758821-love-in-the-big-city ，read）；IMDb **8.7**（2.5K，cache）。RT：`/tv/love_in_the_big_city` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - B：Time-K2024（Burt）#3；Cine21-2024 #4
   - F：PTT 2024 徵文 20 推
   - G：LINE TODAY 2024 十大 #4（韓劇最高）
7. **前置作品**：**改編自朴相映（Sang Young Park）的同名小說**，劇本也由朴相映執筆（infobox `based_on` 與導言，read）。不必先看。
8. **台灣串流**：**friDay影音** https://video.friday.tw/drama/detail/3787 （數位珍藏＝買斷）。**Netflix** https://www.netflix.com/tw/title/81988253 。證據：friDay 頁 2026-11-08 正常載入並顯示「購買數位珍藏版」；Netflix：ELLE TW 2024-12-30 https://www.elle.com/tw/entertainment/drama/g62797927/bl-drama-love-in-the-big-city/ （「Netflix《大都市的愛情法》」）；JustWatch TW：Netflix — **confirmed (service page): friDay purchase. Netflix confirmed (Taiwan media, 2024-12-30).**（tw-availability-2）
- **類型核對**：⚠ **infobox genre＝Melodrama / Coming-of-age / Slice of life，導言也是「melodrama coming-of-age slice of life」，Wikipedia 沒有把它歸成 romance／romcom**（read）。愛情是重要主線，但主軸是同志青年十年的成長與家庭關係。**建議人工判斷：留在本篇並寫明「成長劇」，或移到「韓劇 5 人生、家庭與時代劇」。**

## 16. Melo Movie

1. **片名**：**我們的浪漫電影**（Netflix Taiwan trailer；tw-availability-2）／멜로무비／*Melo Movie*。**不要和 SBS《我們的電影》（Our Movie，本篇第 18 部）混淆**（fans 檔也提醒）。
2. **劇情**：夢想看完世上所有電影的影評人高謙，和背負過去、立志當導演的金無妃，因一場神秘事件分開，五年後成了鄰居、重新面對舊情與舊傷。Wikipedia：「They reconnect 5 years later, with Ko Gyeom moving next door to Kim Mu-bee」。來源：https://en.wikipedia.org/wiki/Melo_Movie （read）
3. **季數與狀態**：1 季 10 集，**Netflix 原創**，2025-02-14 一次上線，**已完結的單季完整故事**。片長 57–74 分鐘（infobox）；나무위키 寫全 10 集共 10 小時 13 分（cache）。導演吳忠煥（也執導《德魯納酒店》）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상 관람가**（나무위키「시청 등급 15세 이상 관람가」，cache；韓文維基分級欄空白；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications「Taiwan 12+」（read，未標平台；Netflix 原創，推測是 Netflix 分級，未證實）。美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35450649/parentalguide/ ）：**五個類別全部「No data」，沒有投票。**
5. **觀眾評分**：MDL **8.1**（30,246 人，https://mydramalist.com/758615-melo-movie ，read）；IMDb **7.2**（5.3K，cache）。RT：Tomatometer **100%**（6 則），沒有 Popcornmeter（https://www.rottentomatoes.com/tv/melo_movie ，read；樣本很小）。
6. **推薦 tag**：
   - B：Time-K2025（Burt）honorable mention
   - F：Dcard 777果 5💡；PTT 2025 最愛串 1
   - G：LINE TODAY 韓劇年度榜（前十）
   - （fans 檔註記：PTT S2 有 2 人說看不下去，屬負評，沒列為 tag。）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81720593 — 證據 https://www.youtube.com/watch?v=1_8A5gue19k 「《我們的浪漫電影》| 正式預告 | Netflix」，Netflix Taiwan，Netflix 獨家，2025-01-30 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Romantic comedy（read）。**符合本篇**；나무위키 genre 另寫「로맨스, 드라마, 청춘, 힐링, 가족」（cache）。

## 17. Love Next Door

1. **片名**：**媽媽朋友的兒子**（Netflix Taiwan trailer；tw-availability-2）／엄마친구아들／*Love Next Door*
2. **劇情**：在海外過著完美人生的裴碩柳突然回到韓國，重遇從小一起長大、如今是頂尖建築師的「媽媽朋友的兒子」崔勝孝。Wikipedia：「a woman who lives the perfect life abroad … suddenly returns to Korea. Her mother's friend's son … is a top architect in Korea」。來源：https://en.wikipedia.org/wiki/Love_Next_Door （read）
3. **季數與狀態**：1 季 16 集，tvN 2024-08-17 到 10-06（週六日 21:20），**已完結的單季完整故事**。片長 70–80 分鐘。沒有讀到特別篇（韓文維基「16부작」）。導演柳濟元、編劇申河恩，和《海岸村恰恰恰》同一組（導言列出兩人，read；「與《海岸村恰恰恰》同組」出自 나무위키，cache）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상 시청가**，標示理由「주제, 언어, 모방위험」（主題、語言、模仿危險）（나무위키，cache；韓文維基沒有分級欄；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications 沒有台灣列。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt30446769/parentalguide/ ）：Sex & Nudity **Mild**（11/26）、Violence & Gore **None**（7/12）、Profanity **Mild**（6/9）、Alcohol, Drugs & Smoking **Mild**（13/14）、Frightening & Intense **None**（11/12）。投稿提到：吻戲；接吻後兩人在床上、只拍到肩膀以上，地上散落衣服，暗示發生關係；男主角赤裸上身。**票數 9–26，參考性有限。**
5. **觀眾評分**：MDL **8.3**（81,934 人，https://mydramalist.com/758259-mom-s-friend-s-son ，read）；IMDb **7.6**（13K，cache）。RT：Tomatometer **83%**（6 則）、Popcornmeter **78%**（https://www.rottentomatoes.com/tv/love_next_door ，read；樣本很小）。
6. **推薦 tag**：
   - D：Netflix H2 2024 20M
   - E：FUNdex 2024 TV ending-drama buzz #5
   - G：Netflix TW 2024-09-30～10-06 #3（累計 10 週）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81739044 （ID 取自搜尋索引的 netflix.com/tw 頁；預告描述連到 81739045；JustWatch 沒有台灣條目）— 證據 https://www.youtube.com/watch?v=D1QLK7VVlIQ 「媽媽朋友的兒子 | 正式預告 | Netflix」，Netflix Taiwan，「8 月 17 日, NETFLIX 獨家」，2024-08-11 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Romantic comedy（read）。**符合本篇**。

## 18. Our Movie

1. **片名**：**我們的電影**（Disney+ TW page；tw-availability-2）／우리 영화（韓文維基與 Wikidata 寫法，有空格；tw-availability-2 與 나무위키 寫「우리영화」）／*Our Movie*。**不要和 Netflix《我們的浪漫電影》（Melo Movie）混淆。**
2. **劇情**：困在低潮的電影導演李帝河，和罹患重病、時日無多的演員新人李多音合作拍片，兩人在拍攝中相愛。Wikipedia：「a film director and an aspiring actress who are both dealing with personal health issues, feel their time is running out」。來源：https://en.wikipedia.org/wiki/Our_Movie （read）
3. **季數與狀態**：1 季 12 集，SBS 2025-06-13 到 07-19（週五六 21:50），**已完結的單季完整故事**（英文 infobox 仍留著「Value is incremented when new episodes air」註解，但 last_aired 已填 2025-07-19；韓文維基「12부작」，read）。片長沒有寫。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（IMDb Certifications South Korea 15，read）。韓文維基與 나무위키（cache，前 2,500 字）都沒讀到分級文字；韓國部落格寫「15세 이상 관람가」（snippet）。
   - 台灣：Disney+ TW 頁標 **12+**（tw-availability-2，2026-11-08）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt36807294/parentalguide/ ）：**五個類別全部「No data」，沒有投票。**
5. **觀眾評分**：MDL **8.3**（6,896 人，https://mydramalist.com/773365-our-movie ，read；本篇評分人數最少）；IMDb **8.6**（2.7K，cache）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**（read）。
6. **推薦 tag**：
   - B：Time-K2025（Burt）honorable mention
   - F：PTT 2025 最愛串 4
   - G：ELLE TW 片單 #17
7. **前置作品**：沒有（infobox 無 `based_on`）。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-69a4e2d0-0618-42d3-9f78-7d9f267594a0 （訂閱）— 證據：Disney+ TW 頁「觀看我們的電影 | Disney+」（12+）2026-11-08 在架；JustWatch TW 只列 Disney Plus — **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre＝Melodrama；導言「melodrama television series」，Synopsis 是兩人「start to fall in love」（read）。**符合本篇（愛情通俗劇）**；題材是絕症，基調偏悲。

---

## 總結

- **全部 18 部都是已完結的單季完整故事**，沒有續訂。有特別篇的：淚之女王（+2）、鬼怪（+3）、我的完美秘書（+2）、二十五，二十一（+1）、歡迎來到王之國（+1）、愛的迫降（停播週與農曆年特輯）。哲仁王后另有 TVING 獨播衍生短篇。
- **集數**：16 集 11 部；12 集 3 部（暴君的廚師、我的完美秘書、我們的電影）；20 集 1 部（哲仁王后）；10 集 1 部（我們的浪漫電影）；8 集 1 部（大都市的愛情法）。
- **韓國分級**：17 部是 15 歲以上；**大都市的愛情法是 19 歲以上**。
- **台灣平台分級**（服務頁或 IMDb 列出）：Disney+ 德魯納酒店 15+、鬼怪 12+、我們的電影 12+；HBO Max 鬼怪 13+、哲仁王后 13+；IMDb 列台灣 13+ 的有暴君的廚師（Netflix rating）、二十五，二十一、愛的迫降、德魯納酒店（self-applied），12+ 的有淚之女王、海岸村恰恰恰、我們的浪漫電影。**德魯納酒店的 Disney+ 15+ 和 IMDb 13+ 不一致。**
- **IMDb Parents Guide**：5 部完全沒有投票（浪漫速成班、我的完美秘書、大都市的愛情法、我們的浪漫電影、我們的電影）；其他 13 部多數每類 10–50 票，只有愛的迫降超過 50 票。內容提醒較明顯的：閃亮的西瓜（兒童受虐、提到自殺）、德魯納酒店（血腥鬼魂）、哲仁王后（性暗示，美國 TV-MA）、海岸村恰恰恰（性騷擾、自殺情節）。
- **評分**：MDL 全部 8.1–9.2；最高是閃亮的西瓜 9.2，評分人數最多是鬼怪（175,311）。IMDb 多在 7.2–8.8，**歡迎來到王之國 5.9／144K 票是明顯異常值**。RT 只有 7 部有 Tomatometer（5–8 則影評）。
- **類型核對**：16 部符合「愛情、穿越與奇幻浪漫」。**需要人工判斷 1 部**：大都市的愛情法（Wikipedia 歸成 melodrama／coming-of-age／slice of life，可考慮移到韓劇 5）。**介紹時要調整說法 1 部**：閃亮的西瓜（主軸是父子與樂團，愛情是支線）。
- **台灣串流風險**：
  - 閃亮的西瓜只有論壇證據（likely），需台灣裝置確認。
  - 授權劇最新台灣證據在 2023 年或更早：**浪漫速成班（2023-02 媒體）、歡迎來到王之國（2023-06 亞洲頻道）、海岸村恰恰恰（2021-08 亞洲頻道）**；歡迎回到三達里官方證據是 2023-11，fans 檔有 2024-01 Tudum 台灣榜。後三者 JustWatch TW 2026-11-08 仍列 Netflix，但 JustWatch 只算線索。
  - 背著善宰跑：Netflix 2026-05-31 上架；愛奇藝目前狀態未查。
  - 德魯納酒店、鬼怪、哲仁王后的 Netflix 只有 JustWatch，文章應先寫已確認的 Disney+／HBO Max。

## 無法驗證的事實

1. 我的完美秘書、我們的電影的**韓國播出分級**：韓文維基與 나무위키 都沒讀到，只有 IMDb Certifications（read）和部落格（snippet）。IMDb 的韓國分級是使用者可編輯資料，屬旁證。
2. 淚之女王、歡迎回到三達里、我們的浪漫電影、媽媽朋友的兒子的韓國分級只來自 나무위키 的 Exa 快取（cache）加 IMDb。
3. 二十五，二十一、德魯納酒店、鬼怪、海岸村恰恰恰、歡迎來到王之國的 Parents Guide 類別是依頁面順序推定（jina 沒回傳類別標題）；鬼怪頁沒有回傳 Certifications。
4. 淚之女王的 RT Popcornmeter：頁面有多組分數，無法確定哪個是本劇。
5. 歡迎來到王之國 IMDb 5.9／144K 票、RT 觀眾 24% 的原因：沒有找到來源，未查證。
6. 浪漫速成班「Netflix H1 2023 #16 234.8M hours」：和 Physical: 100 的數字相同，疑似抄錯，未回 Netflix 報告核對。
7. 背著善宰跑原作的韓文書名《내일의 으뜸》：讀到的導言只有英文名 *Tomorrow's Best*，韓文名是背景知識。
8. 台灣平台分級中，IMDb 列的「Taiwan 12+／13+」多數沒有標平台或標 self-applied，不等於台灣主管機關分級。
9. MDL 部分評分人數（愛的迫降、背著善宰跑、閃亮的西瓜、哲仁王后）和 ratings 檔同日早先讀到的數字完全相同，可能是站方快取，但本次確實是 Groundlane 即時抓取。
10. 所有 Netflix TW 上架狀態：沒有台灣 IP，netflix.com/tw 頁不是證據（沿用 tw-availability 規則）。

## toolDegradation

- **Groundlane `web_extract`**：英文／韓文 Wikipedia raw、Wikidata SPARQL、MyDramaList（含站內搜尋）、Rotten Tomatoes 都正常。第一次的 genre pattern 因巢狀量詞被拒（`extract.pattern.high_risk`），改成有界的 `[\s\S]{0,N}` 後成功。
- **IMDb 標題頁**：Groundlane 回 1,997 bytes 的機器人頁 → 改用 Exa `web_fetch_exa`（cache，18/18 成功）。
- **IMDb Parents Guide**：jina `read_url`（無 key）18/18 成功；其中 5 頁（二十五，二十一、德魯納酒店、鬼怪、海岸村恰恰恰、歡迎來到王之國）回傳的版本缺類別標題，鬼怪缺 Certifications。jina 沒有 API key，`question` 參數無效，每次都回全文。
- **나무위키**：Groundlane 瀏覽器導覽逾時（DEADLINE_EXCEEDED）→ jina 拿到 Cloudflare「Performing security verification」頁 → Exa `web_fetch_exa` 成功（cache）。媽媽朋友的兒子第一次抓到同名詞條「엄마 친구 아들」，改抓「엄마친구아들(드라마)」才對。
- **Groundlane `web_search`**：Tavily、Exa 兩個後端回報 unavailable，Brave 一次 unavailable；結果來自 Brave／You.com。只用於找韓國分級旁證（snippet）。
- **Rotten Tomatoes**：7 個 slug 猜測 404（回首頁）。這只代表那個網址不存在，不完全排除 RT 用別的 slug 收錄（例如海岸村恰恰恰實際網址是 `seaside_village_cha_cha_cha`）。
- **沒有使用**：Tavily MCP（限流）、Firecrawl（額度用完）、終端機 curl（環境封鎖）。
