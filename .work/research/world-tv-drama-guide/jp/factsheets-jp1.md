# 日劇 1 事實表：愛情、喜劇與 BL（17 部）

- 查核日：2026-11-10。順序照 `post-jp1-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取或搜尋 highlights（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。已刪掉：只有 snippet 的 `C Filmarks 季度滿意度`（小鎮星熱點 2025 冬 #1、宛如粼光夫婦日和 2025 春 #1）、`JT2024 mention, not counted`（Eye Love You）、負評為主的提及（西園寺、一點點超能力）、S27 標題訊號（不計）。**PTT 使用者 pemberley 的三篇年終回顧（2023、2024、2025，fans 檔 S6／S5／S3）同一人只算一聲**，在 tag 裡標「pemberley」。這輪 17 部沒有遇到業配標示。

## 這份資料的限制

1. **日本電視劇沒有統一分級制度**。欄位 4 只能拼湊三種旁證：台灣平台頁標示、IMDb Certifications（使用者可編輯）、IMDb Parents Guide（使用者投稿與投票）。三者都不是日本官方分級。
2. **台灣平台頁分級：17 部都沒有資料**。`tw-availability-1/2.md` 查平台頁時沒有記錄這 17 部的分級（只記了上架與授權狀態），本輪也沒有台灣 IP 可以補查。欄位 4 的「台灣平台」一律寫「tw-availability 沒有記錄」。
3. **IMDb Parents Guide 幾乎空白**：17 部只有 2 部有投票（戀愛可以持續到天長地久每類 1–4 票、玻璃之心每類 2–3 票），其餘 15 部五類全部「No data」。所以「需要提醒的內容」多半是從 Wikipedia 劇情、類型分類、IMDb Certifications 的國外分級（例如新加坡 R21／M18）推得的線索，不是有人看過全劇的內容檢核；寫文時最好說明來源性質。
4. **觀眾評分的樣本差很大**：MDL 評分人數從 26 人（再續．倒數第二次戀愛）到 29,444 人（戀愛可以持續到天長地久）；IMDb 票數從 29 票（西園寺）到 2.9K（月薪嬌妻）。日本觀眾的主流平台是 Filmarks，本輪 17 部都讀到 Filmarks（何食べ S1 除外），Mark 數多半比 MDL、IMDb 大一個數量級。**Rotten Tomatoes：17 部都沒有查**（日劇在 RT 幾乎沒有影評頁，沒有逐一猜 slug）。
5. **IMDb 有幾部是多季合併條目**：大叔的愛（2018–2019 兩季合一）、昨日的美食（2019– 合一）、倒數第二次戀愛（2012–2025 三期合一）。MDL 則多半分季，數字不能直接對照。
6. **台灣串流證據強弱不一**：小鎮星熱點、戀愛可以持續到天長地久、被選中的家、一點點超能力、花牌情緣：巡只有台灣媒體證據（Netflix 頁面不能用海外 IP 證明）；被選中的家的 LINE TODAY 證據只讀到搜尋摘要；昨日的美食只有 S2 在 LINE TV，S1 已授權到期。
7. 類型歸屬：17 部裡有 4 部明顯不是愛情喜劇主軸（極度不妥！、一點點超能力、玻璃之心、花牌情緣：巡），另有 2 部是邊界案例（小鎮星熱點、至愛之花），見各劇「類型核對」與總結。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播／完結日、電視台、時段、片長、原作、特別篇、續篇 | 日文 Wikipedia wikitext（`action=raw`），抽 `基礎情報 テレビ番組` 的 `放送期間`／`放送時間`／`放送枠`／`放送分`／`放送回数`／`原作`、導言、あらすじ、含「スペシャル／続編／劇場版」的句子、Category | Groundlane `web_extract`（pattern） | read（17/17；ちはやふる-めぐり- 是重定向到「ちはやふる#テレビドラマ」，從母條目讀；グラスハート 是小說條目，劇集資料在條目內「Webドラマ」段） |
| 劇情、英文 genre | 英文 Wikipedia wikitext（infobox `genre`、導言、Plot／Premise） | Groundlane `web_extract` | read（10 部有英文條目：有本事換你來做啊、小鎮星熱點、宛如粼光夫婦日和、月薪嬌妻、戀愛可以持續、大叔的愛、昨日的美食、被選中的家、倒數第二次戀愛、極度不妥；silent、Eye Love You、西園寺、一點點超能力、至愛之花、玻璃之心、花牌情緣：巡 沒有英文條目，用 en API `titles=` 查證 missing） |
| IMDb ID、MDL ID | Wikidata SPARQL（ja label → P345、P3868） | Groundlane `web_fetch` | read（16/17 有 IMDb ID；silent 用 Exa 搜尋找到 tt23328252）；MDL ID 5 部來自 Wikidata，其餘用 MDL 站內搜尋（`/search?q=…&co=1`） |
| Parents Guide 五類別＋各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文） | read（17/17；15 部五類全部 No data） |
| IMDb 評分與票數 | IMDb 標題頁 | Exa `web_fetch_exa`（silent、倒數第二次戀愛用 Exa 搜尋 highlights） | cache（17/17） |
| MyDramaList 分數與評分人數 | `mydramalist.com/<id>` 的「Score: X (scored by N users)」 | Groundlane `web_extract`（render=never） | read（17/17，多季者分季讀） |
| Filmarks ★與 Mark 數 | `filmarks.com/search/dramas?q=` 取第一筆 → 作品頁 `c2-rating-l__text`（★）與 mark 元件的 `count` | Groundlane `web_extract` | read（17/17；Filmarks 頁的 mark count 與「N件のレビュー」相同；昨日的美食只讀 season2） |
| 續篇消息 | Real Sound、TV ガイド、サンスポ、女性自身、comingsoon.net、モデルプレス、映画ナタリー | Exa `web_search_exa` | cache（見各劇） |
| Rotten Tomatoes | — | — | 沒有查 |

---

## 1. じゃあ、あんたが作ってみろよ

1. **片名**：**有本事換你來做啊！**（friDay / LINE TV pages；tw-availability-1）／じゃあ、あんたが作ってみろよ／*Then You Try Making It!*
2. **劇情**：交往六年、同居的海老原勝男向山岸鮎美求婚，卻被拒絕分手，原因是勝男認為「料理本來就該女人做」；分手後勝男開始自己下廚，一步步看見自己為什麼被甩，鮎美也重新找回自己。英文維基 Plot：「The reason is Katsuo's belief that "it's only natural for women to cook!" Following the breakup, Katsuo starts cooking and gradually changes his values.」來源：https://en.wikipedia.org/wiki/Then_You_Try_Making_It! （read）；日文維基あらすじ同（read）。
3. **季數與狀態**：1 季 10 集，TBS「火曜ドラマ」枠，2025-10-07 到 12-09，週二 22:00–22:57，每集 57 分鐘（日文維基 infobox，read；第 4 話繰下、第 9 話與最終話延長 5 分鐘）。**已完結**。
   - **特別篇已宣布**：英文維基 infobox「episodes = 10 +1（Special episode）」，引山陽新聞 2025-12-24〈『じゃあ、あんたが作ってみろよ』特別編が制作決定〉（read，二手引用）；日文維基寫「2027年1月にスペシャルドラマが放送予定と一部週刊誌が報じた」，引女性自身（read）。**播出日期只有週刊誌報導，沒有電視台公告**。
   - 日文維基：初回免費配信 365 萬次、全話總再生 6,100 萬次以上，TVer アワード 2025 ドラマ大賞（read）。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications：**沒有任何國家**（「It looks like we don't have any certifications for this title yet」，read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt38627818/parentalguide/ ）：**五類全部 No data**；頁面寫「not yet rated」。
   - 提醒：主線是男主角的大男人主義與控制型言行（日文維基：「竹内涼真演じる勝男のモラハラぶりがSNSを中心に話題」，read）。沒有找到暴力或性的描述來源。
5. **觀眾評分**：MDL **8.0**（734 人，https://mydramalist.com/797088-jaa-anta-ga-tsukutte-miro-yo ，read）；IMDb **8.2**（89 票，cache）；Filmarks **★4.2**（27,170 Mark，https://filmarks.com/dramas/16743/22545 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：DA best 2025Q4（#126）
   - B：EC2025 年間大賞（3 位寫手一致）；RS2025 3/5（明日 #3、麦倉 #6、成馬 #3）
   - C：Filmarks Awards 2025 TVドラマ nominee
   - D：TVerアワード2025 ドラマ大賞（總再生 6,100 萬超）；VR25 総合 #5 最終回 16.1%
   - E：ORICON 2025 滿意度 #4（3.54）
   - F：PTT 2025 無雷推薦 原 PO「今年只推一部就是這部」（episold）；PTT 2025 秋季推薦 #4（Roy34）；PTT 2025 回顧 遺珠（pemberley）
   - G：friDay 2025 日劇 #2、戲劇總榜 #8；LINE TODAY 2025 日劇年度榜（前十，名次不明）；VERSE 2025 必看十部
7. **前置作品**：改編自谷口菜津子的漫畫（ぶんか社『comicタント』2023-04 起連載，全 5 卷；日文維基，read）。不必先看原作。
8. **台灣串流**：friDay影音 (影劇): https://video.friday.tw/drama/detail/4325. LINE TV: https://www.linetv.tw/drama/21240/eps/1 (moved from KKTV). — Both pages loaded on 2026-11-09; friDay shows 「適用方案：影劇／全10集」. Linear: 緯來日本台 from 2025-10-11. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Romantic comedy（漫畫 header，read）；日文維基漫畫 infobox ジャンル＝「再生ロマンスコメディ」（read）。**符合本篇（愛情喜劇）**；重點其實是性別分工與價值觀改變，愛情線是分手後各自成長。

## 2. ホットスポット

1. **片名**：**小鎮星熱點**（Netflix TW media；tw-availability-1）／ホットスポット／*The Hot Spot*（英文維基、Netflix）
2. **劇情**：在山梨縣富士山腳下小鎮商務旅館工作、獨自帶女兒的單親媽媽遠藤清美，發現同事高橋其實是外星人，於是被捲進一連串小鎮騷動。英文維基導言：「a Japanese fantasy comedy drama starring Mikako Ichikawa」；Plot：清美差點被卡車撞時被高橋「humanly impossible」地救下（read）。來源：https://en.wikipedia.org/wiki/The_Hot_Spot_(TV_series) （read）；日文維基あらすじ（read）。
3. **季數與狀態**：1 季 10 集，日本テレビ「日曜ドラマ」枠，2025-01-12 到 03-16，週日 22:30–23:25，每集 55 分鐘（日文維基 infobox，read）。原創劇本，編劇バカリズム。**已完結**。
   - **沒有續篇**：サンスポ 2025-03-23，バカリズム被問到電影化或續篇時說「もう終わったから…。30年後やっちゃったから。そういうの言われないようにそういう終わらせ方したんですから」（cache）。日文維基沒有續篇或特別篇記載（read）。Hulu 有出演者「SP座談会」，是座談不是劇（日テレ官網標題，cache）。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：**Taiwan 13+ self-applied**；South Korea 12（2025, self-applied）；United States TV-PG（Netflix rating）；Singapore PG；Argentina 7。**沒有 Japan 列。**（使用者可編輯）
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35377276/parentalguide/ ）：**五類全部 No data**。
   - 提醒：沒有找到需要特別提醒的內容來源；各國分級都在 PG／12–13 區間。
5. **觀眾評分**：MDL **8.2**（977 人，https://mydramalist.com/781372-hot-spot ，read）；IMDb **7.9**（1.4K，cache）；Filmarks **★4.2**（44,227 Mark，https://filmarks.com/dramas/15835/21429 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：TDA 優秀 2025；Minpo 優秀 2025
   - B：RS2025 3/5（藤原 #5、田幸 #6、麦倉 #2）；EC2025（あまの top 5）
   - C：Filmarks Awards 2025 TVドラマ部門 最優秀賞；IMDb 7.9（1.4K）
   - D：VR25 総合 #17 12.7%
   - E：ORICON 2025 滿意度 #6（3.52）
   - F：PTT 2025 回顧 #2（pemberley）＋推文 3；PTT 2025 無雷推薦「不錯」（episold）
   - G：LINE TODAY 2025 日劇年度榜 #1；LINE TODAY 2025 十大追劇榜 #5；Netflix TW 2025-02-16 #10（累計 3 週）
   - （已刪：`C Filmarks 2025冬 滿意度 #1 ★4.21`，ratings 檔標 snippet。）
   - （補充，不在候選檔：映画ナタリー 2025-09-10 寫本作 7 月獲第 51 回放送文化基金賞優秀賞，バカリズム 脚本賞、角田晃広 演技賞，cache。）
7. **前置作品**：原創劇（日文維基沒有 `原作` 欄，read）。不必先看任何作品；與同一團隊的《重啟人生》（ブラッシュアップライフ）沒有劇情關係（映画ナタリー說「ブラッシュアップライフ」の制作チームが集結，cache）。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81985186 (ID from search; lead) — Marie Claire TW, 2026-01-23 (https://www.marieclaire.com.tw/lifestyle/travel/84294/hot-spot-2025): 「台灣則能在 Netflix 平台觀賞」. Also ELLE TW 2025-02-06 (https://www.elle.com/tw/entertainment/drama/g63612983/netflix6-hot-spot/): 「近日也於台灣Netflix平台上線」. — **confirmed (Taiwan media, 2026-01-23)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Comedy；導言「fantasy comedy drama」（read）；IMDb 類型標籤 Alien Invasion／Comedy／Sci-Fi（cache）。**喜劇符合本篇，但不是愛情劇**，是「小鎮外星人喜劇」，介紹時要歸在喜劇。

## 3. 波うららかに、めおと日和

1. **片名**：**宛如粼光夫婦日和**（friDay page；tw-availability-1）／波うららかに、めおと日和／*A Calm Sea and Beautiful Days with You*
2. **劇情**：1936 年（昭和 11 年），關谷夏美被父親安排嫁給帝國海軍中尉江端瀧昌，婚禮當天新郎因訓練缺席；兩人從生疏、誤會開始，一點一點靠近。英文維基 Plot：「Despite these challenges, the two gradually grow closer.」來源：https://en.wikipedia.org/wiki/A_Calm_Sea_and_Beautiful_Days_with_You （read）；日文維基：「初々しくじれったい新婚ラブコメディ」（read）。
3. **季數與狀態**：
   - 第 1 期：10 集，フジテレビ「木曜劇場」枠，2025-04-24 到 06-26，週四 22:00–22:54，每集 54 分鐘（日文維基 infobox，read）。
   - **特別篇**：2025-06-26 FOD 獨家配信《波うららかに、めおと日和～瀧昌の問題ありません!?編～》1 話（日文維基，read）。
   - **第 2 期（續篇）播出中**：同枠 2026-10-15 起播出（日文維基，引 TV LIFE 2026-04-29「続編 今秋放送決定」，read）；日文維基收視表已列到第 4 話（read）。**總集數未知，尚未完結。**
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications：**沒有任何國家**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt36693655/parentalguide/ ）：**五類全部 No data**。
   - 提醒：背景是戰前海軍，續篇的報導標題提到「ただ大切な人の無事を願う日々」（日文維基引 MANTANWEB 第 3 話標題，read），可能帶到戰事陰影；**沒有內容檢核來源**。新婚題材有「初夜」相關的害羞喜劇（日文維基あらすじ「なつ美はピュアで『初夜』が分からない」，read）。
5. **觀眾評分**：MDL 第 1 期 **8.3**（3,786 人，https://mydramalist.com/789108-nami-uraraka-ni-meoto-biyori ，read；第 2 期另有條目 809606，未讀）；IMDb **7.8**（201 票，cache）；Filmarks 第 1 期 **★4.2**（8,998 Mark，https://filmarks.com/dramas/16344/22031 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：DA best 2025Q2（#124）；TDA 優秀 2025
   - B：EC2025（苫、まっつ top 5）；RS2025 1/5（成馬 #4）
   - C：Filmarks Awards 2025 TVドラマ nominee
   - D：VR25 TS #18 最終回 6.1%
   - E：ORICON 2025 滿意度 **#1**（3.61）
   - F：PTT 2025 無雷推薦「不錯」，原 PO「今年最強戀愛劇當之無愧」（episold）＋推文 1；PTT 2025 回顧 #5 並列（pemberley）＋推文 2
   - G：friDay 2025 日劇 **#1**、戲劇總榜 #5
   - （已刪：`C Filmarks 2025春 滿意度 #1 ★4.28`，snippet；2026 續篇心得串 20 推，S27 標題訊號不計。）
7. **前置作品**：改編自西香はち的漫畫（講談社『コミックDAYS』2022-10 起連載中；日文維基，read）。不必先看原作。看第 2 期前要先看第 1 期。
8. **台灣串流**：friDay影音 (free tier + 影劇, friDay exclusive): https://video.friday.tw/drama/detail/4095. The 2026 second series is also on friDay: https://video.friday.tw/drama/detail/5398 (跟播中; not fetched). — The friDay 4095 page loaded on 2026-11-09 with 「適用方案：免費／影劇，全10集」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Historical / Romantic comedy / Slice of life（read）。**符合本篇（年代愛情喜劇）**。

## 4. silent

1. **片名**：**Silent**（friDay styling; LINE TV used 「silent」 in 2022；tw-availability-1）／silent／*Silent*（IMDb）
2. **劇情**：青羽紬高中時和佐倉想交往，畢業後想突然不告而別；八年後紬在人群中再遇見想，才知道他因病逐漸失去聽力。日文維基あらすじ（read）；富士電視台英文官網：「she discovers, is that he had been diagnosed with a condition that causes gradual deafness」（cache）。來源：https://ja.wikipedia.org/wiki/Silent_(テレビドラマ) （read）
3. **季數與狀態**：1 季 11 集，フジテレビ「木曜劇場」枠，2022-10-06 到 12-22，週四 22:00–22:54，每集 54 分鐘（日文維基 infobox，read）。原創劇本（生方美久，日文維基導言，read）。**已完結**；日文維基沒有特別篇或續篇記載（read）。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications：**沒有任何國家**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt23328252/parentalguide/ ）：**五類全部 No data**；頁面寫「The romance series Silent (2022) is not yet rated」。
   - 提醒：以聽覺障礙與手語為主題（日文維基 Category「聴覚障害を扱ったテレビドラマ」，read）。沒有找到其他需提醒內容的來源。
5. **觀眾評分**：MDL **8.5**（9,424 人，https://mydramalist.com/736575-silent ，read）；IMDb **7.9**（935 票，cache）；Filmarks **★4.1**（34,614 Mark，https://filmarks.com/dramas/12598/17369 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：TDA 優秀 2023；Minpo 優秀 2023
   - C：MDL #14 8.5（9,422）
   - D：TVerアワード2022 ドラマ大賞（再生計 7,300 萬超，當時 TVer 歷代最高）
   - F：PTT 2023 回顧「重刷」＋2024 回顧提到「我很喜歡 Silent」（**兩篇都在 pemberley 年終文，只算一聲**；2024 那句 fans 檔沒寫是原 PO 還是推文）
7. **前置作品**：原創劇，不必先看。
8. **台灣串流**：friDay影音: https://video.friday.tw/drama/detail/5300 (relaunched 2026-09-24). — The friDay page loaded on 2026-11-09 as 「Silent - 影劇 線上看」. NIHON MAG 2026-09-15 (friDay promo, https://www.nihonmag.com/96486/). Linear: 緯來日本台 aired it as 說不出口的愛. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：沒有英文維基；日文維基 Category「日本の恋愛ドラマ」（read）。**符合本篇（愛情）**，基調是催淚純愛，不是喜劇。

## 5. 逃げるは恥だが役に立つ

1. **片名**：**月薪嬌妻**（LINE TV page；tw-availability-1）／逃げるは恥だが役に立つ／*The Full-Time Wife Escapist*
2. **劇情**：研究所畢業卻找不到工作的森山實栗，到單身上班族津崎平匡家當家事管理員，兩人為了各自的方便簽下「契約婚姻」，把家事當成有薪工作，假夫妻慢慢變成真感情。IMDb 簡介：「Now she works as a housekeeper for bachelor Tsuzaki Hiramasa…」（cache）。日文維基：劇名標誌寫「We married as a job!」（read）。英文維基條目寫「No plot」，沒有劇情段（read）。來源：https://ja.wikipedia.org/wiki/逃げるは恥だが役に立つ_(テレビドラマ) （read）
3. **季數與狀態**：連續劇 11 集，TBS「火曜ドラマ」枠，2016-10-11 到 12-20，週二 22:00–22:54，每集 54 分鐘（日文維基 infobox，read）。**已完結**。
   - **特別篇**：《逃げるは恥だが役に立つ ガンバレ人類!新春スペシャル!!》2021-01-02 週六 21:00–23:25，145 分鐘 1 集，描寫結婚第三年（日文維基，read）。
   - 2020 年疫情期間另有重新剪輯的《ムズキュン!特別編》重播（日文維基，read），不是新作。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：**Japan 13+ self-applied**；**Taiwan 0+**；South Korea 15 self-applied；Singapore NC16；Australia PG；Argentina 13（Netflix rating）。（使用者可編輯；台灣 0+ 與新加坡 NC16 落差大）
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt5917100/parentalguide/ ）：**五類全部 No data**。
   - 提醒：沒有讀到具體內容來源；新加坡 NC16、韓國 15 可能與成人戀愛與性話題有關（**推測，未查證**）。
5. **觀眾評分**：MDL **8.1**（9,464 人，https://mydramalist.com/19702-nigeru-wa-haji-da-ga-yaku-ni-tatsu ，read；SP 另有條目 72861，未讀）；IMDb **7.8**（2.9K，cache）；Filmarks **★4.2**（68,901 Mark，https://filmarks.com/dramas/834/1951 ，read；本篇 Mark 數最多）。RT：沒查。
6. **推薦 tag**：
   - A：TDA グランプリ 2017；DA best 2016Q4（#91）
   - C：IMDb 7.8（2.9K）
   - D：TVerアワード2021 特別賞（新春 SP，2021 單發劇再生 #1）
   - F：PTT 2023 回顧 重刷「很喜歡」（pemberley）；PTT 入坑串 1 人
   - G：DailyView 2026-10 月榜 #6（聲量榜，不等於好評）
7. **前置作品**：改編自海野つなみ的漫畫《逃げるは恥だが役に立つ》（日文維基 infobox `原作`，read）。不必先看。看 2021 新春 SP 前要先看連續劇。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/21218/eps/1 (moved from KKTV). Netflix TW page 81410833 is indexed as 「觀賞《月薪嬌妻》」 (lead). — The LINE TV page loaded on 2026-11-09 with no lapse notice. — **confirmed (service page)**（tw-availability-1）
   - 註：tw-availability 沒有分開記錄 2021 新春 SP 在台灣的上架狀態。
- **類型核對**：英文維基（漫畫條目）genre＝Romance（read）；ratings 檔標 contract-marriage romcom。**符合本篇（愛情喜劇）**。

## 6. 恋はつづくよどこまでも

1. **片名**：**戀愛可以持續到天長地久**（Netflix TW page title; TW media；tw-availability-2）／恋はつづくよどこまでも／*An Incurable Case of Love*
2. **劇情**：佐倉七瀨因一次偶然愛上一位醫師，為了再見他苦讀成為護理師；五年後重逢，對方天堂浬卻是毒舌的「魔王」，七瀨仍一次次直率示愛，被同事稱作「勇者」。英文維基 Plot：「Nanase's efforts to convey her thoughts and love for her work eventually melt Tendō's heart.」（read）；日文維基あらすじ（read）。來源：https://en.wikipedia.org/wiki/An_Incurable_Case_of_Love （read）
3. **季數與狀態**：1 季 10 集，TBS「火曜ドラマ」枠，2020-01-14 到 03-17，週二 22:00–22:57，每集 57 分鐘（日文維基 infobox，read）。**已完結**。
   - **衍生劇**：《まだまだ恋はつづくよどこまでも》，本篇每集播完後在 Paravi 每週配信的 spin-off（日文維基，read）。
   - 2020 年 4–5 月另播《胸キュン!特別編》《胸キュン!完結編》，是第 7–9 話等的重新剪輯版（日文維基，read），不是新作。日文維基沒有續季記載。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：South Korea 15 self-applied；Singapore NC16；India UA 13+ self-applied；Indonesia 13+ self-applied；Brazil 14；Spain 12；Argentina 13。**沒有 Japan、Taiwan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt11290750/parentalguide/ ）：Sex & Nudity **Mild**（1 of 4，「Kissing romantic scenes」）、Violence & Gore **None**（1 of 1）、Profanity **Mild**（1 of 3，「A lot of uses of "Dimwit" in a comical way」）、Alcohol, Drugs & Smoking **Mild**（1 of 1，喝酒與醉酒場面）、Frightening & Intense **Moderate**（1 of 2，「Bleeding shown. Scary surgery scenes emergencies…」）。**每類只有 1–4 票，幾乎沒有參考價值。**
   - 提醒：醫院場景有出血、手術、急診畫面（上述投稿）。
5. **觀眾評分**：MDL **8.3**（29,444 人，https://mydramalist.com/51965-koi-wa-tsuzuku-yo-doko-made-mo ，read；本篇 MDL 評分人數最多）；IMDb **7.4**（2.6K，cache）；Filmarks **★3.8**（28,635 Mark，https://filmarks.com/dramas/8227/11892 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：DA best 2020Q1（#104）；TDA 優秀 2020
   - C：MDL #54 8.3；IMDb 7.4（2.6K）
   - D：VRR 総合 #21 最終回 25.3%；TVerアワード2020 ドラマ大賞＋ドラマエピソード賞（ratings 檔標 partial：只讀到 meta description，仍計）
   - F／G：無（fans 檔沒有這部的台灣口碑 tag）
7. **前置作品**：改編自円城寺マキ的漫畫（小學館『プチコミック』2016–2019 連載；日文維基，read）。不必先看。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81423569. KKTV https://www.kktv.me/titles/01000356 says 「授權已到期」. — Beauty321, 2026-08-14, https://www.beauty321.com/post/73029 (Netflix 日劇 list, #8) — **confirmed (Taiwan media, 2026-08-14)**（tw-availability-2）
- **類型核對**：日文維基電視劇 infobox ジャンル＝**医療ドラマ**；漫畫ジャンル＝ラブコメディ、医療漫画（read）；英文維基 genre＝Drama, romance（read）。**符合本篇（醫療背景的愛情喜劇）**；醫療只是舞台，主線是戀愛。

## 7. Eye Love You

1. **片名**：**Eye Love You**（tw-availability-2）／Eye Love You／*Eye Love You*
2. **劇情**：能透過對視聽見別人心聲的本宮侑里，因此對戀愛敬而遠之；直到遇見年輕的韓國留學生尹泰吳，因為他心裡講的是韓文、她聽不懂，她開始覺得也許能和他談戀愛。日文維基あらすじ（read）；IMDb 簡介：「a telepathic woman who'd given up on love meets a kindhearted Korean student who thinks in a language she can't understand」（cache）。來源：https://ja.wikipedia.org/wiki/Eye_Love_You （read）
3. **季數與狀態**：1 季 10 集，TBS「火曜ドラマ」枠，2024-01-23 到 03-26，週二 22:00–22:57，每集 57 分鐘（日文維基 infobox，read）。原創劇本。**已完結**；日文維基只記有最終回前的粉絲見面活動，沒有特別篇或續篇（read）。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：United States TV-14（Netflix rating）；United Kingdom 12；Singapore NC16；Argentina 13。**沒有 Japan、Taiwan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31647393/parentalguide/ ）：**五類全部 No data**。
   - 提醒：沒有找到需特別提醒內容的來源。
5. **觀眾評分**：MDL **7.7**（8,449 人，https://mydramalist.com/759591-eye-love-you ，read）；IMDb **6.8**（800 票，cache）；Filmarks **★3.8**（15,496 Mark，https://filmarks.com/dramas/14441/19692 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：SDA（首爾國際電視劇大賞）Jury Special Prize 2024
   - B：RS2024 1/5（明日 #8）
   - C：Filmarks Awards 2024 TVドラマ nominee
   - （已刪：`JT2024 mention, not counted`，awards 檔自己標不計。）
7. **前置作品**：原創劇（日文維基沒有 `原作` 欄，read）。不必先看。
8. **台灣串流**：LINE TV (VIP): https://www.linetv.tw/drama/21226/eps/1 (「已完結 / 共 10 集」, VIP badges). Netflix: https://www.netflix.com/tw/title/81747048. friDay (https://video.friday.tw/drama/detail/3268) now returns HTTP 400, so it has lapsed there. — The LINE TV page was live on 2026-11-09, and LINE TV's KKTV migration list (2026-01-22) names it. Beauty321, 2025-05-07, https://www.beauty321.com/post/67519 (Netflix list, #5). Nahoko TW lists LINE TV and Netflix. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：沒有英文維基；日文維基 Category「日本の恋愛ドラマ」「日本のファンタジードラマ」「超能力を題材としたテレビドラマ」（read）。**符合本篇（奇幻愛情）**；日韓跨國戀是賣點。

## 8. おっさんずラブ（2018；另有 2024 續篇 -リターンズ-）

1. **片名**：**大叔的愛**（愛奇藝 page；2024 續篇台灣名「大叔的愛－Returns－」；tw-availability-2）／おっさんずラブ／*Ossan's Love*
2. **劇情**：33 歲、一直交不到女友的春田創一，意外發現中年上司黑澤偷偷收集自己的照片、深深愛著他，又發現同住的男性後輩也喜歡他，捲入三角關係。英文維基 Plot：「Caught in a love triangle, Haruta navigates through his feelings for his two love interests.」來源：https://en.wikipedia.org/wiki/Ossan%27s_Love （read）
3. **季數與狀態**：テレビ朝日的系列（日文維基 infobox 與導言，read）：
   - 單發版：2016-12-31（30 日深夜）《年の瀬 変愛ドラマ》第 3 夜，1 集 60 分鐘。
   - **第 1 季（本篇主角）**：2018-04-21 到 06-02，「土曜ナイトドラマ」枠，週六 23:15–翌 0:05，每集 50 分鐘，7 集。
   - 第 2 季《おっさんずラブ-in the sky-》：2019-11-02 到 12-21，同枠，8 集（主角群同、舞台改為航空公司；日文維基寫有觀眾不滿舞台不同，read）。
   - 第 3 季《おっさんずラブ-リターンズ-》：2024-01-05 到 03-01，「金曜ナイトドラマ」枠，週五 23:15–翌 0:15，每集 60 分鐘，9 集；日文維基稱「続編となる第3シリーズ」（read）。
   - **電影**：《劇場版 おっさんずラブ 〜LOVE or DEAD〜》2019-08-23 上映（日文維基，read）。
   - 2026 年沒有找到新作消息（沒有專門搜尋）。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read，條目涵蓋 2018–2019）：**Singapore R21**；Philippines 16+ self-applied；United States 13+（streaming）。**沒有 Japan、Taiwan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt8295962/parentalguide/ ）：**五類全部 No data**。
   - 提醒：**新加坡 R21 很可能是當地對同志題材的分級政策**（推測，未查證），不代表有露骨內容；IMDb 沒有內容投稿。
5. **觀眾評分**：MDL 2018 **7.5**（7,576 人，https://mydramalist.com/27866-ossan-s-love ，read）、2016 單發版 7.3（1,811 人，https://mydramalist.com/22055-ossans-love ，read）、リターンズ **8.2**（2,006 人，https://mydramalist.com/758139-ossan-s-love-returns ，read）；in the sky 條目沒讀。IMDb **7.5**（765 票，2018–2019 合併條目，cache）。Filmarks「おっさんずラブ」**★4.1**（35,182 Mark，https://filmarks.com/dramas/1062/2238 ，read；頁面標題沒寫年份，推測是 2018 版，未核對）、-リターンズ- **★4.1**（8,439 Mark，https://filmarks.com/dramas/1062/19472 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：TDA グランプリ 2018；DA best 2018Q2（#97）
   - C：Filmarks Awards 2024 TVドラマ nominee（**是 -リターンズ-**）
   - F：PTT 2024 回顧 遺珠（pemberley）＋推文 1（**是 -リターンズ-**）
   - （merged 把 2018 與 2024 合併成同一列；C、F 都是續篇的訊號，2018 版本身只有 A。）
7. **前置作品**：原創劇（日文維基沒有 `原作` 欄，read）。從 2018 第 1 季開始看即可；in the sky 是平行設定，リターンズ 接第 1 季（日文維基稱續編，read）。
8. **台灣串流**：愛奇藝 (iQ): https://www.iq.com/album/%E5%A4%A7%E5%8F%94%E7%9A%84%E6%84%9B-2018-19rrgxxtzx?lang=zh_tw. The sequel 「大叔的愛－Returns－」 is on Hami (https://hamivideo.hinet.net/product/280363.do?cs=2) and LINE TV (https://www.linetv.tw/drama/18430/eps/1, VIP). — The iQ zh_tw album loaded on 2026-11-09 as 「大叔的愛 (2018)」. The Hami and LINE TV Returns pages also loaded. Nahoko TW lists LINE TV for the 2018 show, but no LINE TV page for S1 was found; `/drama/19876` is the Hong Kong remake. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：英文維基 genre＝Comedy, BL（read）；日文維基 Category 含コメディドラマ（read）。**符合本篇（BL 喜劇）**。

## 9. きのう何食べた?（S1、season2；台灣目前只確認 S2）

1. **片名**：**昨日的美食**／**昨日的美食 S2**（LINE TV pages；tw-availability-1）／きのう何食べた?／*What Did You Eat Yesterday?*
2. **劇情**：住在東京的中年同志伴侶，嚴謹內斂的律師筧史朗與開朗的美髮師矢吹賢二，每集圍繞一頓家常晚餐，帶出家庭、職場與同志在日本的處境。英文維基（漫畫）：「follows Shiro Kakei and Kenji Yabuki, a middle aged gay couple living in Tokyo… often focused around issues of domestic life, workplace humor, and LGBT rights in Japan」（read）。來源：https://en.wikipedia.org/wiki/What_Did_You_Eat_Yesterday%3F （read）
3. **季數與狀態**：テレビ東京「ドラマ24」枠（日文維基 infobox，read）：
   - Season 1：2019-04-06 到 06-29（金曜深夜，土曜 0:12–0:52），每集 40 分鐘，12 集。
   - **特別篇**：《きのう何食べた?正月スペシャル2020》2020-01-01 週三 22:00–23:30，90 分鐘。
   - **電影**：《劇場版「きのう何食べた?」》2021-11-03 上映，是電視劇的續篇（日文維基，read）。
   - Season 2：2023-10-07 到 12-23（同時段），每集 40 分鐘，12 集。
   - 日文維基導言：「テレビドラマとして2シーズンとスペシャルドラマ1作品、映画として1作品」（read）。沒有找到 season 3 消息。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：**Japan 7+ self-applied**；Thailand 7+ self-applied；**Singapore R21**。**沒有 Taiwan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt9657792/parentalguide/ ）：**五類全部 No data**。
   - 提醒：日本 7+、新加坡 R21 落差很大，後者推測與同志題材有關（未查證）。沒有找到需特別提醒的內容來源。
5. **觀眾評分**：MDL S1 **8.0**（3,466 人，https://mydramalist.com/33088-what-did-you-eat-yesterday ，read）、S2 **8.1**（981 人，https://mydramalist.com/752579-kinou-nani-tabeta-season-2 ，read）；IMDb **8.1**（780 票，S1–S2 合併條目，cache）；Filmarks season2 **★4.3**（11,582 Mark，https://filmarks.com/dramas/6031/18684 ，read；S1 沒讀）。RT：沒查。
6. **推薦 tag**：
   - A：DA best 2019Q2（#101）；TDA 優秀 2019
   - B：RS2023 2/5（麦倉 #8、藤原 #9）[season2]
   - F：PTT 2023 回顧 #2（S2），2024、2025 回顧重刷（**三篇都是 pemberley，只算一聲**）
   - G：KKTV 2023 K劇大賞 最佳日劇 #2、人氣 #3、男主角 #1（S2）
   - （補充，不在候選檔：英文維基寫漫畫與真人版合計獲講談社漫畫賞、ギャラクシー賞與多次 Television Drama Academy Awards，read，沒有逐項核對。）
7. **前置作品**：改編自よしながふみ的漫畫《きのう何食べた?》（講談社『モーニング』2007 起連載；日文維基、英文維基，read）。**建議依序看**：S1 → 正月 SP → 電影 → S2（電影是 S1 的續篇，日文維基，read）。台灣目前只確認 S2 可看（見欄位 8），文章要提醒讀者 S1 在台灣已下架。
8. **台灣串流**：S2: LINE TV https://www.linetv.tw/drama/22886/eps/1. S1: LINE TV https://www.linetv.tw/drama/10451/eps/1 now says 「此戲劇因授權到期，已下架」 (**lapsed**). The 2021 film is on Hami (UpToGo 2026-07-02). — The S2 page loaded on 2026-11-09 with no lapse notice. No current TW page for S1 was found. — **confirmed (S2 only, service page); S1 lapsed**（tw-availability-1）
- **類型核對**：日文維基電視劇 ジャンル＝連続ドラマ／深夜ドラマ（read，沒有類型資訊）；英文維基漫畫 genre 第一項 Cooking（read，後面被 ref 截斷，partial）。**符合本篇（同志伴侶生活劇，BL 範疇）**，但它是日常、料理與家庭劇，不是戀愛起步的 BL 甜劇，介紹時要說清楚。

## 10. ぼくたちん家

1. **片名**：**被選中的家**（TW media；tw-availability-2）／ぼくたちん家／*Chosen Home*
2. **劇情**：50 歲、孤單的同志動物園飼育員波多野玄一，和對愛情死心的 38 歲教師作田索偶然相遇，玄一提議兩人一起買房，當作承諾的象徵；沒想到作田的學生楠野螢說要用藏起來的財產幫他們買房。英文維基 Plot（read）。來源：https://en.wikipedia.org/wiki/Chosen_Home_(TV_series) （read）
3. **季數與狀態**：1 季 10 集，日本テレビ「日曜ドラマ」枠，2025-10-12 到 12-14，週日 22:30–23:25，每集 55 分鐘（日文維基 infobox，read）。英文維基：每週日在 Netflix 全球同步上線（read）。原創劇本（英文維基 writer Yuki Matsumoto；日文維基沒有 `原作` 欄，read）。**已完結**，沒有讀到特別篇或續篇。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：South Korea 12（2025, self-applied）；**Singapore M18**；Argentina 13。**沒有 Japan、Taiwan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt38632746/parentalguide/ ）：**五類全部 No data**。
   - 提醒：新加坡 M18 推測與同志題材有關（未查證）；劇情涉及未成年學生拿出「hidden fortune」幫兩人買房（英文維基 Plot，read），IMDb 簡介稱她是「a troubled teen」（cache）；家庭問題的細節沒有讀到。
5. **觀眾評分**：MDL **8.3**（2,225 人，https://mydramalist.com/798778-bokutachinchi ，read）；IMDb **7.6**（218 票，cache）；Filmarks **★3.9**（3,878 Mark，https://filmarks.com/dramas/16808/22629 ，read）。RT：沒查。
6. **推薦 tag**：
   - B：RS2025 2/5（明日 #5、田幸 #5）
   - C：MDL #49 8.3
   - F：PTT 2025 回顧 遺珠（pemberley）；PTT 2025 秋季推薦串 推文 1 人
7. **前置作品**：原創劇，不必先看。
8. **台灣串流**：Netflix (no title ID found) — LINE TODAY / Japaholic, 2025-11-02, https://today.line.me/tw/v3/article/oq9Oo86 (「Netflix跟播日劇《被選中的家》」; read from the search snippet). — **confirmed (Taiwan media, 2025-11-02)**（tw-availability-2）
   - ⚠️ 證據只有搜尋摘要，也沒有 Netflix 片號；寫文前最好再確認。
- **類型核對**：英文維基 genre＝Slice of life / BL / Romance（read）。**符合本篇（BL）**；日本媒體 NEWSポストセブン 標題稱它是「LGBTのラブストーリー」（英文維基引用，read）。

## 11. 続・続・最後から二番目の恋

1. **片名**：**再續．倒數第二次戀愛**（friDay page; full-width 「．」, not 「・」；tw-availability-2）／続・続・最後から二番目の恋／*Second to Last Love* 第 3 期（英文維基寫作 *Zoku Zoku—Saigo Kara Nibanme no Koi*）
2. **劇情**：鎌倉老房子裡的長倉一家與隔壁的電視製作人吉野千明，十一年後千明 59 歲、和平 63 歲已過退休年齡，兩人距離依舊，繼續在中年與老後的煩惱裡過日子。MDL 簡介（Fuji TV 文案翻譯）：「11 years have passed and Chiaki is now 59… Wahei is 63, past retirement age」（read）。系列設定見英文維基：45 歲電視劇製作人千明搬到鎌倉，認識 50 歲鰥夫、市公所職員和平（read）。日文維基：「鎌倉を舞台とした45歳独身女性と50歳独身男性が繰り広げる恋愛青春コメディ」（read）。
3. **季數與狀態**：フジテレビ系列（日文維基 infobox，read）：
   - 第 1 期《最後から二番目の恋》：2012-01-12 到 03-22，「木曜劇場」，週四 22:00–22:54，11 集。
   - 特別篇《最後から二番目の恋 2012秋》：2012-11-02，「金曜プレステージ」，112 分鐘。
   - 第 2 期《続・最後から二番目の恋》：2014-04-17 到 06-26，「木曜劇場」，11 集。
   - **第 3 期（本篇）**：2025-04-14 到 06-23，**月 9（フジテレビ月曜 9 時枠）**，週一 21:00–21:54，每集 54 分鐘，11 集。**已完結**；沒有找到第 4 期消息（沒有專門搜尋）。
   - 另有 2016 年韓國翻拍《倒數第二次戀愛》（日文維基 infobox 最後一列 2016-07-23 起、70 分鐘 20 集；IMDb「Remade as Second to Last Love (2016)」，cache）。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read，系列合併條目 tt2119858）：只有 Argentina Atp。**沒有 Japan、Taiwan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt2119858/parentalguide/ ）：**五類全部 No data**。
   - 提醒：沒有找到需特別提醒內容的來源。
5. **觀眾評分**：MDL 第 3 期 **8.3**（**只有 26 人**，https://mydramalist.com/788884-zoku-zoku-saigo-kara-nibanme-no-koi ，read；樣本太小，不建議引用）；IMDb **8.2**（153 票，2012–2025 三期合併條目，cache）；Filmarks 第 3 期 **★4.2**（3,518 Mark，https://filmarks.com/dramas/1742/22020 ，read）。RT：沒查。
6. **推薦 tag**：
   - B：RS2025 1/5（明日 #2）；EC2025（苫、あまの top 5）
   - D：VR25 総合 #6 16.5%（RT #7、TS #7）
   - E：ORICON 2025 滿意度 #3（3.55）
   - G：LINE TODAY 2025 日劇年度榜（前十，名次不明）；VERSE 2025 必看十部
7. **前置作品**：原創劇（編劇岡田惠和；日文維基，read）。**第 3 期是前兩期的續篇**，主角群與長倉家設定延續；台灣目前只確認第 3 期可看（見欄位 8），前兩期在台灣的上架狀態 tw-availability 沒有查。不看前作也能懂主線（判斷，不是來源），但人物關係累積了 13 年。
8. **台灣串流**：friDay影音 (free with ads, or the 影劇 pack): https://video.friday.tw/drama/detail/4081 — The friDay page loaded on 2026-11-09 with 「適用方案：免費／影劇」, 「全11集」. zh-Wikipedia: 「台灣由friDay影音於2025年4月15日起跟播」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：英文維基 genre＝Romance, Drama（read）；日文維基「恋愛青春コメディ」（read）。**符合本篇（熟齡愛情喜劇）**。

## 12. 不適切にもほどがある!

1. **片名**：**極度不妥！**（LINE TV page；tw-availability-1）／不適切にもほどがある!／*Extremely Inappropriate!*
2. **劇情**：1986 年東京葛飾、作風斯巴達又滿口粗話的國中老師兼棒球教練小川市郎，意外穿越到 2024 年，他的昭和式言行在令和社會處處「不適切」，他也在兩個時代之間來回。英文維基導言：「a man who time travels back-and-forth between 1986 (Showa era) and 2024 (Reiwa era), where he finds that his Shōwa-era way of being conflicts with contemporary Japanese society」（read）。來源：https://en.wikipedia.org/wiki/Extremely_Inappropriate! （read）
3. **季數與狀態**：1 季 10 集，TBS「金曜ドラマ」枠，2024-01-26 到 03-29，週五 22:00–22:54，每集 54 分鐘（日文維基 infobox，read）。原創劇本（宮藤官九郎；Real Sound 標題，日文維基引用，read）。**已完結**。
   - **特別篇**：2025-03-16 宣布、**2026-01-04 播出**的スペシャルドラマ《新年早々 不適切にもほどがある！〜真面目な話、しちゃダメですか？〜》（日文維基，read；スポニチ報導 SP 世帯收視 8.8%，日文維基引用，read）。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：**Taiwan 0+**；United Kingdom 12。**沒有 Japan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31924877/parentalguide/ ）：**五類全部 No data**；頁面寫「not yet rated」。
   - 提醒：劇的笑點就建立在昭和式的粗口、體罰、性別與職場騷擾言論上（英文維基導言說主角 Spartan ideals and harsh words，read）；**沒有讀到具體場景清單**。台灣 0+ 是使用者填的，可能偏低。
5. **觀眾評分**：MDL **7.9**（763 人，https://mydramalist.com/759055-futekisetsu-ni-mo-hodo-ga-aru ，read）；IMDb **7.6**（617 票，cache）；Filmarks **★4.1**（41,219 Mark，https://filmarks.com/dramas/14376/19611 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：DA best 2024Q1（#119）；TDA 優秀 2024；Galaxy 特別賞 2023年度
   - B：RS2024 3/5（麦倉 #8、成馬 #4、藤原 #7）；JT2024 "one of the year's best"
   - C：Filmarks Awards 2024 TVドラマ部門 最優秀賞
   - D：VR24 総合 #5 17.3%；TS #1
   - F：PTT 2024 無雷推薦 原 PO「年度最火紅到出圈」（episold）＋推文 3；PTT 2024 回顧 遺珠（pemberley）
   - G：KKTV 2024 K劇大賞 最佳日劇＋人氣票選＋熱播 #2；LINE TODAY 2024 十大追劇榜 #9（唯一日劇）
7. **前置作品**：原創劇，不必先看。看 2026 SP 前要先看連續劇。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/21230/eps/1; the 2026 special is at https://www.linetv.tw/drama/21249/eps/1 (not fetched). Netflix: https://www.netflix.com/tw/title/81747060 (zh-Wikipedia says Netflix from 2024-02-02; lead only). friDay's page (https://video.friday.tw/drama/detail/3269) now returns 「資料錯誤」, so it has **lapsed** there. — The LINE TV page loaded on 2026-11-09 with no lapse notice. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Drama / Comedy / Musical；導言「comedy musical drama」、時空穿越（read）；日文維基 ジャンル＝連続ドラマ／コメディドラマ（read）。**不是愛情劇，是穿越喜劇（含歌舞橋段）**；放在本篇只能歸「喜劇」。

## 13. 西園寺さんは家事をしない

1. **片名**：**西園寺小姐不做家事**（LINE TV / friDay pages；tw-availability-1）／西園寺さんは家事をしない／*No Domestic Work for Ms. Saionji!*（IMDb）；*Ms. Saionji Doesn't Do Housework*（myTV SUPER HK，tw-availability-1）
2. **劇情**：工作能幹、徹底不做家事的單身女性西園寺一妃買了自己的房子；轉職到同公司的單親爸爸楠見俊直父子因故無家可歸，三人以「偽家族」的形式同住，慢慢交心。日文維基あらすじ：「偽家族として暮らす中で心を通わせていく姿を描くハートフルなラブコメディ」（read）。來源：https://ja.wikipedia.org/wiki/西園寺さんは家事をしない （read）
3. **季數與狀態**：1 季 11 集，TBS「火曜ドラマ」枠，2024-07-09 到 09-17，週二 22:00–22:57，每集 57 分鐘（日文維基，read）。**已完結**，沒有讀到特別篇或續篇。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications：**沒有任何國家**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32485667/parentalguide/ ）：**五類全部 No data**。
   - 提醒：沒有找到需特別提醒內容的來源。
5. **觀眾評分**：MDL **7.6**（477 人，https://mydramalist.com/769127-saionji-san-wa-kaji-wo-shinai ，read）；IMDb **6.7**（**29 票**，cache；樣本太小）；Filmarks **★4.0**（11,636 Mark，https://filmarks.com/dramas/15192/20600 ，read）。RT：沒查。
6. **推薦 tag**：
   - A：DA best 2024Q3（#121）
   - B：RS2024 1/5（藤原 #9）
   - C：Filmarks Awards 2024 TVドラマ nominee
   - D：VR24 TS #13 7.3%
   - G：KKTV 2024 熱播 #8
   - （已刪：PTT 2024 推薦原 PO「棄劇」、PTT 2024 回顧「中後段不夠好」，負評不計。）
7. **前置作品**：改編自ひうらさとる的漫畫（講談社『BE・LOVE』2021-10 到 2024-07 連載；日文維基，read）。不必先看。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/21222/eps/1 (moved from KKTV). friDay https://video.friday.tw/drama/detail/3556 now returns HTTP 400 「資料錯誤」, so it has **lapsed** there (an older snapshot showed 「即將下架」). — The LINE TV page loaded on 2026-11-09 with no lapse notice. Linear: 緯來日本台 from 2024-07-13. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：沒有英文維基；日文維基 Category「日本の恋愛ドラマ」「日本のコメディドラマ」「ロマンティック・コメディ・テレビドラマ」「疑似家族を題材とした作品」（read）。**符合本篇（愛情喜劇）**。

## 14. ちょっとだけエスパー

1. **片名**：**一點點超能力**（TW media；tw-availability-1）／ちょっとだけエスパー／*Just a Bit Espers*
2. **劇情**：被公司開除、失去家庭與存款的上班族文太，接到神秘公司「ノナマーレ」的面試，被錄取後成為「只有一點點超能力」的超能力者，任務是拯救世界；他和一位謎樣的「妻子」住進員工宿舍，卻被規定「不准愛上別人」。MDL 簡介（natalie.mu 翻譯）（read）。Real Sound 2025-12-13：「人生詰んだサラリーマンが“ちょっとだけエスパー”になって世界を救う、完全オリジナルのSFラブロマンス」（cache）。
3. **季數與狀態**：1 季 9 集，テレビ朝日「火曜 9 時枠」，2025-10-21 到 12-16，週二 21:00–21:54，每集 54 分鐘（日文維基 infobox，read）。原創劇本（野木亜紀子，日文維基導言，read）。**已完結**。
   - **沒有正式續篇**：主演大泉洋殺青時說「来月くらいからまた（続編を）撮り始めてもいいんじゃないか」（TVガイド、Real Sound 2025-12-13，cache）；2026-04-17 Real Sound 訪談裡野木亞紀子與大泉洋只是玩笑談續篇（cache）。**沒有電視台公告。**
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：United Kingdom 15；South Korea 15（2025, self-applied）；Singapore PG13；Argentina 13。**沒有 Japan、Taiwan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt38639709/parentalguide/ ）：**五類全部 No data**。
   - 提醒：後半轉為嚴肅——TVガイド 2025-12-13 寫超能力膠囊有「死に至る」副作用、角色「目と耳から血を流して倒れる」、有角色前往復仇（cache）。前半輕鬆、後半有死亡與流血場面，可提醒。
5. **觀眾評分**：MDL **7.7**（451 人，https://mydramalist.com/798830-just-a-bit-espers ，read）；IMDb **6.6**（189 票，cache；本篇 IMDb 最低）；Filmarks **★3.8**（14,498 Mark，https://filmarks.com/dramas/16817/22645 ，read）。RT：沒查。
6. **推薦 tag**：
   - B：RS2025 2/5（藤原 #9、成馬 #7）
   - D：VR25 総合 #13 14.1%（ratings 檔第 184 列 6 部合併，依列內順序拆出第 3 部）
   - F：PTT 2025 秋季推薦 #6（Roy34）；MDL 使用者清單 #5（單一使用者，弱訊號）
   - G：LINE TODAY 2025 日劇年度榜 #10
   - （已刪：PTT 2025 推薦原 PO「還行」＋2 則負評「敗在最後一集」、PTT 2025 回顧「一言難盡」，負評不計。）
7. **前置作品**：原創劇，不必先看。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/82143695 (ID from the Netflix JP page; lead) — 迷誠品 (Eslite), 2026-04-09 (https://meet.eslite.com/tw/tc/article/202604080006): 「Netflix日劇推薦4…《一點點超能力》」. 上報, 2025-10-27 (https://www.upmedia.mg/tw/popularity/chinese-dramas/243194): 「Netflix獨家跟播」. — **confirmed (Taiwan media, 2026-04-09)**（tw-availability-1）
- **類型核對**：沒有英文維基；日文維基 Category「日本のロマンティック・コメディSFドラマ」「日本のスパイドラマ」「日本のサスペンスドラマ」「タイムトラベルを題材としたテレビドラマ」（read）；MDL genres Romance、Drama（read）。**科幻喜劇＋愛情，部分符合本篇**；後半是 SF 懸疑，介紹時要說明「不是單純的愛情喜劇」。

## 15. いちばんすきな花

1. **片名**：**至愛之花**（KKTV, then LINE TV; zh-Wikipedia's article title 「最喜歡的花」 is not the Taiwan release title；tw-availability-2）／いちばんすきな花／*Ichiban Suki na Hana*（IMDb 羅馬拼音）
2. **劇情**：四個對「兩人一組」這件事從小就不擅長的人，各自在異性友誼、戀愛、職場人際裡受傷，偶然相遇後開始交心。日文維基：「『2人組を作ること』に苦手意識を持つ4人が…偶然出会うことで心を通わせていく物語」（read）；IMDb 簡介：「Can friendship be formed among men and women?」（cache）。
3. **季數與狀態**：1 季 11 集，フジテレビ「木曜劇場」枠，2023-10-12 到 12-21，週四 22:00–22:54，每集 54 分鐘（日文維基 infobox，read）。原創劇（日文維基沒有 `原作` 欄；Real Sound 2023-08-23 標題「『silent』チーム集結」，日文維基引用，read）。**已完結**。
   - 特別篇：日文維基有〈『いちばんすきな花』×『キリンチャレンジカップ2023』スペシャルドラマ〉一節（read）；從引用看是配合足球國際賽的特別影片，**長度與播出形式沒有讀到**。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications：**沒有任何國家**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32314710/parentalguide/ ）：**五類全部 No data**。
   - 提醒：沒有找到需特別提醒內容的來源。
5. **觀眾評分**：MDL **8.0**（393 人，https://mydramalist.com/756915-ichiban-sukina-hana ，read）；IMDb **7.9**（49 票，cache；樣本小）；Filmarks **★4.0**（20,846 Mark，https://filmarks.com/dramas/14101/19292 ，read）。RT：沒查。
6. **推薦 tag**：
   - B：RS2023（成馬 #1）
   - C：Filmarks 2023 日本ドラマ #20
   - D：VR23 TS #17 7.9%
   - F／G：無
7. **前置作品**：原創劇，不必先看；和《silent》是同一製作團隊，但沒有劇情關係。
8. **台灣串流**：LINE TV (VIP): https://www.linetv.tw/drama/21032/eps/1 — The LINE TV page was live on 2026-11-09 (VIP badges). LINE TV's KKTV migration list (2026-01-22) names 至愛之花 (上架 2026-01-01). zh-Wikipedia: 「臺灣由KKTV…獨家跟播」. — **confirmed (service page)**（tw-availability-2）
   - ⚠️ tw-availability-2 注明：至愛之花只靠 LINE TV 一個平台，而 LINE TV 狀態是用伺服器 HTML 間接判斷，最好用台灣裝置確認。
- **類型核對**：沒有英文維基；日文維基 Category「日本の恋愛ドラマ」（read）；MDL genre 只有 Life（read）；主題是男女之間能否只當朋友。**邊界案例**：維基分類算愛情劇，但內容是人際關係群像劇，介紹時要說明不是戀愛喜劇。

## 16. グラスハート

1. **片名**：**玻璃之心**（Netflix Taiwan YT；tw-availability-2）／グラスハート／*Glass Heart*
2. **劇情**：大學生鼓手西條朱音在出道前夕被樂團開除，卻被孤高的天才音樂人藤谷直季選進新樂團 TENBLANK，隨著樂團走紅，藤谷的秘密也逐漸浮現。MDL 簡介（Netflix 文案）（read）。日文維基：改編小說原本是以朱音為主角的群像劇，劇集改以佐藤健飾演的藤谷為主角，「ドラマ内で起こる事件や出来事は、ほとんど全てが原作にはない」；藤谷的疾病設定是劇集獨有（read）。
3. **季數與狀態**：**Netflix 原創**，1 季 10 集，2025-07-31 一次上線（日文維基「配信日程」，cache；Instagram 引用「全10話」，read）。每集 33–54 分鐘（日文維基配信日程，cache）。主演佐藤健兼企劃與共同執行製作（日文維基，read）。
   - **第 2 季：沒有宣布**。comingsoon.net 2025-08-01：「neither canceled nor has the series been renewed」（cache）；女性自身 2025-12-10 引製作關係者說續篇有高門檻、將依亞洲人氣「最終判断」（cache）；モデルプレス 2026-04-18 佐藤健被問樂團再結成時說「今のところ予定はないですね」（cache，問的是 TENBLANK 活動，不完全等於劇集續季）。IMDb 標「TV Series 2025– 」（cache），只是條目格式，不是續訂證據。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：**Taiwan 12+**；**Japan PG12**；United States TV-14；South Korea 15；United Kingdom 12；Singapore PG13；Australia M；Canada 14+ 等 15 國。（使用者可編輯）
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31501513/parentalguide/ ）：Sex & Nudity **None**（2 of 2）、Violence & Gore **Moderate**（2 of 3）、Profanity **Mild**（1 of 2，「A few uses of S---, Hell, Fool, Damn it, etc. In each episode」）、Alcohol, Drugs & Smoking **Mild**（2 of 2，「Drinking and drugs shown」）、Frightening & Intense **Mild**（2 of 2）。**每類只有 2–3 票。**
   - 提醒：有飲酒與藥物畫面（上述投稿）；主角罹患腦腫瘤（comingsoon.net 結局整理「Naoki's tumor」，cache）。
5. **觀眾評分**：MDL **8.5**（7,694 人，https://mydramalist.com/765487-glass-heart ，read）；IMDb **8.1**（1.9K，cache）；Filmarks **★3.6**（16,045 Mark，https://filmarks.com/dramas/14902/20260 ，read；本篇 Filmarks 最低）。**海外評分高、日本 Filmarks 偏低，落差明顯。** RT：沒查。
6. **推薦 tag**：
   - C：MDL #11 8.5（7,693）；IMDb 8.1（1.9K）
   - F：Dcard 777果 6💡（「下半年最火紅的日劇」）；MDL 使用者清單 #19（弱訊號）
   - G：VERSE 2025 必看十部
   - （補充，不在候選檔：日文維基列「FILMARKS AWARDS 2025 配信ドラマ部門 優秀賞」，引つみき 2025-12-17 新聞稿，read；**但 ratings 檔說 2025 年 Filmarks Awards 沒有配信部門，兩者矛盾，未核對**。モデルプレス 2026-04-18：佐藤健獲「モデルプレス ベストドラマアワード」プロデュース部門 1 位，cache。）
7. **前置作品**：改編自若木未生的小說系列《グラスハート》（1993 年起，集英社コバルト文庫等；日文維基，read）。劇情大幅改編、結局也不同（原作朱音最後選擇坂本並結婚；日文維基，read），**不必先看原作**，看過原作的讀者要有心理準備。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81517368 — https://www.youtube.com/watch?v=tsFkvs4x1J4 「《玻璃之心》| 正式預告 | Netflix」, Netflix Taiwan, 2025-07-01 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：沒有英文維基；日文維基 Category「日本の恋愛ドラマ」「ポピュラー音楽を題材とした作品」（read）；MDL genres Music、Romance、Drama（read）。**音樂劇（含愛情線）**，不是愛情喜劇；放在本篇要說明主軸是樂團。

## 17. ちはやふる－めぐり－

1. **片名**：**花牌情緣：巡**（Netflix; TW media；tw-availability-2）／ちはやふる－めぐり－／*Chihayafuru: Full Circle*
2. **劇情**：故事設定在電影版十年後，令和時代的高中生接下前一代的熱情，把青春押在競技花牌上。MDL 簡介（日本テレビ節目目錄英文版）：「Set 10 years after the film… High school students of the Reiwa era, having inherited the baton, lay their entire youth on the line as they take on the challenge of competitive karuta」（read）。
3. **季數與狀態**：1 季 10 集，日本テレビ「水曜ドラマ」枠，2025-07-09 到 09-10（日文維基「ちはやふる」條目的電視劇段 infobox，read；`ちはやふる-めぐり-` 條目是重定向）。每集片長：同條目抽到「放送分 60」，但條目內有多個 infobox，**不確定是否屬於本劇（partial）**。MANTANWEB 2025-07-10 標題稱「映画から10年後のオリジナルストーリー」（日文維基引用，read）。**已完結**，沒有讀到續篇或特別篇。
4. **分級**：
   - 台灣平台：tw-availability 沒有記錄。
   - IMDb Certifications（read）：**Taiwan 13+（Netflix rating）**；South Korea 15（2025, self-applied）；Singapore PG13；Argentina 13。**沒有 Japan 列。**
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt37541615/parentalguide/ ）：**五類全部 No data**；頁面寫「The comedy series … is not yet rated」。
   - 提醒：沒有找到需特別提醒內容的來源。
5. **觀眾評分**：MDL **8.2**（609 人，https://mydramalist.com/787378-chihayafuru-meguri ，read）；IMDb **7.6**（158 票，cache）；Filmarks **★4.2**（6,789 Mark，https://filmarks.com/dramas/16234/21896 ，read）。RT：沒查。
6. **推薦 tag**：
   - B：RS2025 2/5（藤原 #4、明日 #6）；EC2025（苫 top 5）
   - C：Filmarks Awards 2025 TVドラマ nominee
   - F：PTT 2025 回顧 #5 並列（pemberley）＋推文 3「遠超乎預期」；MDL 使用者清單 #3（弱訊號）
7. **前置作品**：《ちはやふる》系列——日文維基把本劇放在漫畫《ちはやふる》條目下（read）；ORICON 2025-02-14 標題「広瀬すず主演映画から10年後の世界描く キャスト一新」，Real Sound 2025-04-18 標題「上白石萌音が映画シリーズから続投」（皆為日文維基引用，read）。**卡司全新、原創劇情**，不必先看；看過廣瀨鈴主演的電影版會認出上白石萌音的角色（判斷）。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/82085211 — udn 噓！星聞, 2025-09-27, https://stars.udn.com/star/story/10093/9028637 (「Netflix獨家跟播的2025年夏季日劇《花牌情緣：巡》」). PTT Japandrama, 2025-07-04: 「NETFLIX 7/17上架」. — **confirmed (Taiwan media, 2025-09-27)**（tw-availability-2）
- **類型核對**：沒有英文維基；`ちはやふる-めぐり-` 重定向頁的 Category「青春ドラマ」「高等学校を舞台としたテレビドラマ」（read）；MDL genres Youth、Drama（read）。**青春運動（競技花牌）劇，不符合本篇**。

---

## 總結

- **MDL／IMDb／Filmarks 一覽**（MDL 分數（人數）｜IMDb 分數（票數）｜Filmarks ★（Mark））：

| # | 台灣片名 | MDL | IMDb | Filmarks |
|---|---|---|---|---|
| 1 | 有本事換你來做啊！ | 8.0（734） | 8.2（89） | 4.2（27,170） |
| 2 | 小鎮星熱點 | 8.2（977） | 7.9（1.4K） | 4.2（44,227） |
| 3 | 宛如粼光夫婦日和（第 1 期） | 8.3（3,786） | 7.8（201） | 4.2（8,998） |
| 4 | Silent | 8.5（9,424） | 7.9（935） | 4.1（34,614） |
| 5 | 月薪嬌妻 | 8.1（9,464） | 7.8（2.9K） | 4.2（68,901） |
| 6 | 戀愛可以持續到天長地久 | 8.3（29,444） | 7.4（2.6K） | 3.8（28,635） |
| 7 | Eye Love You | 7.7（8,449） | 6.8（800） | 3.8（15,496） |
| 8 | 大叔的愛（2018）／Returns | 7.5（7,576）／8.2（2,006） | 7.5（765，2018–19 合併） | 4.1（35,182）／4.1（8,439） |
| 9 | 昨日的美食 S1／S2 | 8.0（3,466）／8.1（981） | 8.1（780，合併） | —／4.3（11,582） |
| 10 | 被選中的家 | 8.3（2,225） | 7.6（218） | 3.9（3,878） |
| 11 | 再續．倒數第二次戀愛 | 8.3（**26**） | 8.2（153，三期合併） | 4.2（3,518） |
| 12 | 極度不妥！ | 7.9（763） | 7.6（617） | 4.1（41,219） |
| 13 | 西園寺小姐不做家事 | 7.6（477） | 6.7（**29**） | 4.0（11,636） |
| 14 | 一點點超能力 | 7.7（451） | 6.6（189） | 3.8（14,498） |
| 15 | 至愛之花 | 8.0（393） | 7.9（49） | 4.0（20,846） |
| 16 | 玻璃之心 | 8.5（7,694） | 8.1（1.9K） | 3.6（16,045） |
| 17 | 花牌情緣：巡 | 8.2（609） | 7.6（158） | 4.2（6,789） |

  - MDL 7.5–8.5（最高 Silent、玻璃之心 8.5；最低大叔的愛 2018 7.5）。IMDb 6.6–8.2。Filmarks 3.6–4.3。
  - **口碑落差**：玻璃之心海外高（MDL 8.5、IMDb 8.1）、日本 Filmarks 最低（3.6）；有本事換你來做啊！、小鎮星熱點在日本得獎與 Filmarks 都高，MDL 人數卻不到 1,000。
- **季數與續篇**：
  - 有特別篇：月薪嬌妻（2021 新春 SP）、極度不妥！（2026-01-04 SP）、宛如粼光夫婦日和（2025 FOD 特別編）、昨日的美食（2020 正月 SP＋2021 電影）、大叔的愛（2016 單發、2019 電影）、倒數第二次戀愛（2012 秋 SP）。
  - **播出中**：宛如粼光夫婦日和第 2 期（2026-10-15 起）。
  - **已宣布特別篇、未播**：有本事換你來做啊！（山陽新聞 2025-12-24「特別編制作決定」；女性自身報 2027-01，沒有電視台公告）。
  - 多季：大叔的愛 3 季、昨日的美食 2 季、倒數第二次戀愛 3 期。
  - 明確沒有續篇或沒有宣布：小鎮星熱點（編劇說已完結）、一點點超能力（只有演員表態）、玻璃之心（沒有續訂）。
- **集數**：9 集 1 部（一點點超能力）；10 集 8 部；11 集 5 部（Silent、月薪嬌妻、再續、西園寺、至愛之花）；12 集 1 部（昨日的美食每季）；大叔的愛 7＋8＋9。
- **分級**：17 部台灣平台頁都沒有分級資料。IMDb 台灣列只有 5 部（月薪嬌妻 0+、小鎮星熱點 13+ self-applied、極度不妥！ 0+、玻璃之心 12+、花牌情緣：巡 13+ Netflix rating）；日本列 3 部（月薪嬌妻 13+、昨日的美食 7+、玻璃之心 PG12）。**新加坡對 BL／同志題材給 R21（大叔的愛、昨日的美食）、M18（被選中的家）**，推測是當地政策，寫文時不要當成內容尺度。Parents Guide 只有戀愛可以持續（手術出血）與玻璃之心（飲酒、藥物）有投票。需要提醒的內容：一點點超能力後半的死亡與流血、玻璃之心的藥物與腫瘤、極度不妥！的昭和式粗口與騷擾言論、Silent 的聽障主題（不是負面，是主題說明）。
- **類型核對**：
  - 愛情喜劇／愛情（9）：有本事換你來做啊！、宛如粼光夫婦日和、Silent（純愛）、月薪嬌妻、戀愛可以持續（醫療背景）、Eye Love You（奇幻愛情）、再續．倒數第二次戀愛（熟齡）、西園寺小姐不做家事、至愛之花（邊界：人際群像）。
  - BL／同志（3）：大叔的愛（BL 喜劇）、昨日的美食（同志伴侶生活與料理）、被選中的家。
  - 喜劇但非愛情（2）：小鎮星熱點（外星人喜劇）、**極度不妥！（穿越喜劇）**。
  - **不符合本篇主軸、需寫明性質（3）**：一點點超能力（科幻喜劇＋愛情，後半 SF 懸疑）、玻璃之心（音樂劇）、花牌情緣：巡（青春運動）。
- **台灣串流風險**：
  - 只靠台灣媒體證據：小鎮星熱點、戀愛可以持續、被選中的家（只有搜尋摘要、沒有片號）、一點點超能力、花牌情緣：巡。
  - 只靠 LINE TV 間接判斷：至愛之花。
  - 部分下架：昨日的美食 S1（LINE TV 授權到期）、極度不妥！與西園寺（friDay 已下架，LINE TV 仍在）、Eye Love You（friDay 已下架）。
  - 大叔的愛 2018 在愛奇藝，續篇在 Hami／LINE TV，兩者平台不同。

## 無法查證的事實

1. **台灣平台頁分級**：17 部都沒有（tw-availability 沒記，本輪也沒有台灣 IP）。
2. **有本事換你來做啊！特別篇的播出時間**：只有女性自身「2027年1月放送予定」週刊誌報導（日文維基轉述），山陽新聞只寫「制作決定」。
3. **宛如粼光夫婦日和第 2 期總集數與完結日**：播出中，未知。
4. **花牌情緣：巡的每集片長**：日文維基母條目抽到「放送分 60」，不確定屬於本劇。時段只讀到「水曜ドラマ」枠，沒讀到幾點。
5. **至愛之花×キリンチャレンジカップ特別劇**的長度與形式沒讀到。
6. **玻璃之心 Filmarks Awards 2025 配信ドラマ部門優秀賞**：日文維基有、ratings 檔說 2025 年沒有配信部門，兩者矛盾。
7. **大叔的愛 Filmarks「おっさんずラブ」頁（1062/2238）是哪一版**：頁面標題沒寫年份，推測是 2018 版。
8. **昨日的美食 S1 的 Filmarks**、**宛如粼光夫婦日和第 2 期／大叔的愛 in the sky／月薪嬌妻 SP 的 MDL** 沒讀。
9. **新加坡 R21／M18 與同志題材的關係**是推測，沒有查新加坡 IMDA 規範。
10. 被選中的家的 Netflix 台灣證據只有 LINE TODAY 搜尋摘要（沿用 tw-availability-2 的標示）。
11. Rotten Tomatoes：17 部都沒查。
12. 所有 Netflix TW 上架狀態：沒有台灣 IP，netflix.com/tw 頁不是證據（沿用 tw-availability 規則）。
13. 續篇消息（小鎮星熱點、一點點超能力、玻璃之心）都是 Exa 搜尋 highlights（cache），沒有再用 Groundlane 逐篇讀原文。

## toolDegradation

- **Groundlane MCP**（ToolSearch 載入 `web_search`／`web_fetch`／`web_extract`）是主力：
  - `web_extract` pattern 讀日文／英文維基 raw、MDL（含站內搜尋）、Filmarks（搜尋頁與作品頁）都正常。
  - 一次 `Bad Gateway`、一次「upstream closed the stream」（英文維基 Chosen Home／What Did You Eat Yesterday?），重試成功。
  - pattern 含巢狀量詞時被拒（`extract.pattern.high_risk`），改成有界的 `[^\n]{0,N}` 寫法後成功；多次 `OUTPUT_LIMIT`，改成 `many:false` 或減少欄位後成功。
  - `ちはやふる-めぐり-` 是重定向頁（394 bytes），改讀母條目「ちはやふる」。
  - `web_search` 沒有用到（找 IMDb ID 用 Wikidata SPARQL，找續篇用 Exa）。
- **IMDb**：Parents Guide 用 jina `read_url`（無 key，`question` 參數無效、每次回全文）17/17 成功（Hot Spot 第一次回空白，第二次成功）；標題頁評分用 Exa `web_fetch_exa`（cache），silent 與倒數第二次戀愛用 Exa 搜尋 highlights（cache）。沒有先試 Groundlane 讀 IMDb（沿用韓劇事實表的經驗：會拿到機器人頁）。
- **Exa**：`web_search_exa` 用在 silent／倒數第二次戀愛 IMDb ID、玻璃之心第 2 季、小鎮星熱點續篇、一點點超能力續篇（共 5 次）；`web_fetch_exa` 3 次批次讀 IMDb 標題頁。
- **沒有使用**：Tavily（不需要）、Firecrawl（額度用完）、終端機 curl（環境封鎖）。
