# 韓劇 2 事實表：犯罪、懸疑與復仇（18 部）

- 查核日：2026-11-08。順序照 `post-kr2-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取（非即時）；**partial** 表示只讀到部分（例如 IMDb Parents Guide 頁面少了類別標題或認證區塊）；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 2 的中文劇情句是依英文 Wikipedia 改寫；角色名一律保留英文拼音，因為讀到的來源沒有台灣官方的角色中譯。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md` 的類別字母。每類只留 2–4 個最有資訊量的，得獎排在提名前面。已刪掉：`A SDA-K`（模範計程車、黑暗榮耀各一筆）、`C Douban`（本篇 18 部沒有遇到）、`G(轉譯)`（本篇沒有遇到）、負評為主的提及（暴風圈的 DailyView 聲量 #8；Dcard Z.Y 給 1–2 分的評價）。這輪沒有遇到業配標示。**拆列說明**：和我老公結婚吧（#17）的 `F Dcard Z.Y 4分` 是從 fans 檔第 173 行「Dcard Z.Y 4 分、只有單一來源的作品」合併列拆出來的（該列寫作「請和我老公結婚吧」）。
- **欄位 4 分級的兩種來源要分開看**：「韓國播出分級」是電視台／平台標示（15세 이상 시청가＝15 歲以上；19세 이상＝19 歲以上，韓國的成人級）；IMDb Parents Guide 是**使用者投稿與投票**，不是官方分級。嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。**本篇的 Parents Guide 票數普遍很少，多數類別 5–35 票，只有黑暗榮耀超過 75 票；財閥家的小兒子完全沒有投票資料**，寫文時不宜當成強證據。
- **本篇是犯罪劇，內容提醒比韓劇 1 重得多**：韓國分級有 **8 部是 19 歲以上**（見總結）。各劇欄位 4 的「投稿提到」只摘錄和暴力、性暴力、自殺、霸凌、家暴有關的具體描述。
- **欄位 5 RT**：只猜了 18 個 slug 裡的 15 個；**有 Tomatometer 的 7 部，影評數都只有 5–11 則**，樣本很小。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 英文維基條目名、Wikidata ID | Wikipedia API `action=query&prop=pageprops`（兩輪試條目名） | Groundlane `web_fetch` | read（18/18；Mask Girl、Signal、Flower of Evil、Stranger、Tempest、Karma、Marry My Husband、The Worst of Evil 的條目名和第一次猜的不同） |
| 劇情、類型、集數、首播／完結日、電視台、片長、前置作品 | 英文 Wikipedia wikitext（`action=raw`），抽 infobox `genre` / `based_on` / `num_seasons` / `num_episodes` / `runtime` / `network` / `first_aired` / `last_aired`、導言、Synopsis／Plot；模範計程車另抽 `series overview` | Groundlane `web_extract`（pattern） | read（18/18） |
| 韓國播出分級、集數 | 韓文 Wikipedia wikitext（`시청 등급`、`방송 횟수`、分級圖示文字） | Groundlane `web_extract` | read（12/18 有分級；6 部沒有：假面女郎、操控遊戲、無赦之仇、血謎拼圖、暴風圈、財閥家的小兒子） |
| IMDb ID、MDL ID | Wikidata SPARQL（P345、P3868） | Groundlane `web_fetch` | read（18/18 有 IMDb ID；9/18 有 MDL ID，其餘用 MDL 站內搜尋找到） |
| Parents Guide 五類別 + 各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文）；假面女郎、你旁觀的罪另用 Exa `web_fetch_exa` 補 | read（18/18）；其中 5 頁（黑暗榮耀、假面女郎、惡鬼、無赦之仇、你旁觀的罪）jina 只回內容不回類別標題（標 partial，見各劇），假面女郎、你旁觀的罪的認證區塊與類別標題由 Exa 快取補上 |
| IMDb 評分與票數 | IMDb 標題頁 | Exa `web_fetch_exa` | cache（18/18） |
| MyDramaList 分數與評分人數 | `mydramalist.com/<id>` 的「Score: X (scored by N users)」 | Groundlane `web_extract`（render=never） | read（18 部共 22 個條目：黑暗榮耀 Part 1/2、模範計程車 S1–S3、秘密森林 S1/S2 分開） |
| Rotten Tomatoes | `rottentomatoes.com/tv/<slug>`，選取 `rt-text[slot=critics-score]`、`rt-link[slot=critics-reviews]`、`rt-text[slot=audience-score]` | Groundlane `web_extract` | read（15 個 slug 試過：10 個有頁面，4 個 404 回首頁，`karma` 頁無法確認是本劇） |
| 續作狀態（信號、模範計程車） | 韓文維基「두 번째 시그널」條目；聯合新聞 2026-11-06；Groundlane 搜尋摘要 | Groundlane `web_extract`／`web_fetch`／`web_search` | read（信號續作）；snippet（模範計程車 S4） |

---

## 1. The Glory

1. **片名**：**黑暗榮耀**（Netflix YT；tw-availability-1）／더 글로리／*The Glory*
2. **劇情**：少女時期遭校園霸凌、身心留下傷疤的 Moon Dong-eun，多年後成為霸凌主謀孩子就讀小學的班導師，一步步展開復仇。Wikipedia Synopsis：「a former victim of school violence, plans and seeks revenge on her bullies after taking up a job as a homeroom teacher at the elementary school of the bully leader's child」。另寫部分場景取材自 2006 年清州國中生集體施暴的真實事件。來源：https://en.wikipedia.org/wiki/The_Glory_(TV_series) （read）
3. **季數與狀態**：1 季 16 集，**分兩部上線**：Part 1（8 集）Netflix 2022-12-30、Part 2（8 集）2023-03-10（英文維基導言；韓文維基「파트1: 8부작／파트2: 8부작（총 16부작）」，read）。**已完結的單季完整故事**。片長 47–72 分鐘。Netflix 原創，沒有讀到特別篇。編劇金銀淑（Kim Eun-sook）。來源：同上（read）
4. **分級**：
   - 韓國：**19세 이상 시청가**（韓文維基分級圖示，read）。IMDb Certifications 寫 South Korea「18 original rating, withdrawn／19 2024, re-rating」（read）。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒有標平台）。美國 TV-MA。
   - IMDb Parents Guide（**partial**：jina 回傳只有嚴重度與票數、沒有類別標題，以下依頁面固定順序對應；https://www.imdb.com/title/tt21344706/parentalguide/ ）：Sex & Nudity **Moderate**（81/193）、Violence & Gore **Severe**（62/97）、Profanity **Severe**（55/79）、Alcohol, Drugs & Smoking **Moderate**（38/75）、Frightening & Intense **Severe**（57/82）。投稿提到：**霸凌是主線**，被捲髮棒燙傷、被針刺、拳打腳踢與勒頸，「The violence can be brutal and bloody」；**主角站在頂樓邊緣想自殺**；家暴；一名角色有毒癮；第 13 集有短暫裸露。**本篇票數最多的一部（75–193 票）。**
5. **觀眾評分**：MDL 分兩個條目：Part 1 **8.9**（120,801 人，https://mydramalist.com/685237-the-glory ，read）、Part 2 **8.9**（89,583 人，https://mydramalist.com/745581-the-glory-season-2 ，read）；IMDb **8.2**（48K，cache）。RT：Tomatometer **82%**（11 則）、Popcornmeter **93%**（https://www.rottentomatoes.com/tv/the_glory ，read；本篇影評數最多，但仍是小樣本）。
6. **推薦 tag**：
   - A：Baeksang Drama win 2023；AACA Best Drama Series grand WIN 2023（+KR national）；BlueDragon Drama nom 2023
   - B：Cine21-2023 #2；Time-K2023（de Guzman，Netflix 限定、未排名）
   - C：IMDb 8.2（48K）；MDL Part 2 #16 8.9（89,577）、Part 1 #24 8.9
   - D：Netflix H1 2023 全站 #3（622.8M 小時）；曾進 Netflix 非英語影集歷來前十（後來掉出）
   - E：FUNdex Awards 2023 OTT drama best + 新聞 + VON + 2 個演技獎（5 冠）
   - F：Dcard Z.Y 4 分
   - G：LINE TODAY 2023 網友投票 #1（第 2 部，10.33%）；Netflix TW 2025-03-17～23 #5（舊劇重新進榜）
   - （已刪：`A SDA-K Excellence 2023`。）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`，read）。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81519223 — 證據 https://www.youtube.com/watch?v=pL9FrqLPB7s 「《黑暗榮耀》| 正式預告 | Netflix」，Netflix Malaysia (Asia zh channel)，2022-12-15。JustWatch TW lists Netflix with this ID (checked 2026-11-08) — **confirmed (official channel, Asia zh)**（tw-availability-1）。Netflix 原創，下架風險低；官方頻道證據是 2022 年，JustWatch 2026 只算佐證。
- **類型核對**：infobox genre＝Revenge / Psychological thriller；導言「revenge psychological thriller」（read）。**符合本篇（復仇）**。

## 2. Mask Girl

1. **片名**：**假面女郎**（Netflix YT；tw-availability-1）／마스크걸／*Mask Girl*
2. **劇情**：對外貌自卑的上班族 Kim Mo-mi 晚上戴面具當網路直播主，一連串意外與惡運接著吞沒她的人生；同一角色由三名演員分飾不同時期。Wikipedia Synopsis：「an office worker who is insecure about her looks, becomes a masked internet personality by night—until a chain of unexpected, ill-fated events begins to overtake her life」。來源：https://en.wikipedia.org/wiki/Mask_Girl （read）
3. **季數與狀態**：**7 集迷你劇**，Netflix 2023-08-18 上線，**已完結的單季完整故事**（infobox 只有 `first_aired`，沒有續季資訊）。片長 51–65 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**19**（IMDb Certifications，Exa cache；韓文維基沒有分級欄）。
   - 台灣：IMDb Certifications「Taiwan 16+」（cache，沒有標平台）。美國 TV-MA。
   - IMDb Parents Guide（**partial**：jina 版本沒有類別標題，類別由 Exa 快取對上；https://www.imdb.com/title/tt26258200/parentalguide/ ）：Sex & Nudity **Moderate**（26/73）、Violence & Gore **Severe**（26/32）、Profanity **Moderate**（10/20）、Alcohol, Drugs & Smoking **Moderate**（12/23）、Frightening & Intense **Moderate**（11/24）。投稿提到：**強暴場面（施暴者在過程中被刺死，「Very bloody」）**；冰箱裡的殘缺屍體；直播中脫衣與裸露；兒童閱讀色情刊物；槍擊、跳樓。**票數 20–73，參考性有限。**
5. **觀眾評分**：MDL **7.6**（25,328 人，https://mydramalist.com/715503-mask-girl ，read；本篇與善意的競爭並列最低）；IMDb **7.3**（11K，cache）。RT：Tomatometer **100%**（9 則）、Popcornmeter **79%**（https://www.rottentomatoes.com/tv/mask_girl ，read；樣本很小）。
6. **推薦 tag**：
   - A：BlueDragon Drama nom 2024
   - B：Cine21-2023 #6
   - D：Netflix H2 2023 18.5M（該半年韓劇 #2）
   - E：FUNdex Awards 2023 OTT drama finalist
   - F：PTT 2023 徵文 5 推
   - G：LINE TODAY 2023 網友投票 #14
7. **前置作品**：改編自 Naver 網漫《마스크걸》（作者 Mae-mi、Hee-se，2015–2018 連載；導言，read）。不必先看。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81516491 — 證據 https://www.youtube.com/watch?v=0Fu9qVutMA0 「《假面女郎》| 正式預告 | Netflix」，Netflix Malaysia (Asia zh channel)，2023-08-03（「NETFLIX 獨家」）— **confirmed (official channel, Asia zh)**（tw-availability-1）。Netflix 原創；最新證據是 2023 年，但原創劇下架風險低。
- **類型核對**：infobox genre 第一項 Black comedy（後續項目被 ref 截斷）；導言「black comedy crime thriller」（read）。**符合本篇（犯罪驚悚）**，基調帶黑色喜劇。

## 3. Taxi Driver

1. **片名**：**模範計程車**／**模範計程車３**（第 3 季，全形「３」；friDay pages；tw-availability-1）／모범택시／*Taxi Driver*
2. **劇情**：前特種部隊軍人 Kim Do-gi 在「彩虹計程車」開車，這家公司其實是匿名的私刑復仇集團，替法律沒能懲罰加害者的受害者討公道。Wikipedia Season 1：「a secret and anonymous vigilante group that offers victims seeking revenge call for justice to people that have not been punished by the law」。導言另寫故事取材自韓國真實重大犯罪。來源：https://en.wikipedia.org/wiki/Taxi_Driver_(South_Korean_TV_series) （read）
3. **季數與狀態**：**3 季，共 48 集 + 2 集特別篇**（infobox「48 + 2 special」），SBS，片長 70 分鐘。各季（`series overview`，read）：
   - **S1**：16 集，2021-04-09 到 05-29，週五六 22:00。
   - **S2**：16 集，2023-02-17 到 04-15，週五六 22:00；**特別篇 1** 2023-02-16（週四）、**特別篇 2** 2023-03-04。
   - **S3**：16 集，2025-11-21 到 2026-01-10，週五六 22:00。
   - **目前狀態**：S3 已播完。**S4 沒有讀到官方確認**：英文維基沒有第 4 季字樣（read）；wikitree 2026-08-21 寫「SBS와 제작사 측은 아직 시즌4 제작을 공식 확정하지 않았다」（**snippet**）。可寫「三季已完結，第四季未官方確認」。
4. **分級**：
   - 韓國：韓文維基（S1 條目）`시청 등급 = 15`，另有註記「본방송과 밤 시간대 재방송은 19세 이상 관람가로 방송」，白天重播才是 15 歲（read；**註記沒寫是哪幾集，partial**）。IMDb Certifications 寫 South Korea **19**（read）。**兩者不一致，文章建議寫「部分播出以 19 歲以上分級」**。
   - 台灣：IMDb Certifications 沒有台灣列；friDay 頁分級沒有讀。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt13759970/parentalguide/ ，三季共用一頁）：Sex & Nudity **Mild**（12/37）、Violence & Gore **Moderate**（8/18）、Profanity **Mild**（6/9）、Alcohol, Drugs & Smoking **Moderate**（2/3）、Frightening & Intense **Moderate**（6/12）。投稿提到：**性侵題材**（「Not much is explicitly shown, but a lot is implied」）、綁架女性拍色情片的情節；第一季「People are constantly being tortured for revenge」；鐵鎚砸手指、車禍血腥畫面。**票數 3–37，參考性有限。**
5. **觀眾評分**：MDL 分三個條目：S1 **8.8**（57,318 人，https://mydramalist.com/52921-model-taxi ）、S2 **8.9**（31,561 人，https://mydramalist.com/705589-taxi-driver-2 ）、S3 **8.7**（12,991 人，https://mydramalist.com/750961-taxi-driver-season-3 ）（皆 read）；IMDb **8.1**（10K，三季合一，cache）。RT：`/tv/taxi_driver` 頁面存在（演員有李帝勳）但 **0 則影評、沒有 Tomatometer**（read）。
6. **推薦 tag**：
   - A：無（唯一的 A 是 SDA-K Excellence 2021，已刪）
   - C：IMDb 8.1（10K）；MDL S2 #22 8.9、S1 #38 8.8
   - D：KDF 2023 #2 21%（S2）、2021 #10 16%（S1）；S3 Nielsen 全國 14.2%（2026-01-03，據 WRC 部落格整理）
   - E：FUNdex Awards 2023 actor finalist（李帝勳，S2）+ 配角 finalist
   - F：PTT 2025 最愛串 S3 5 人；Dcard Z.Y S1–S3 都 3 分
   - G：friDay 2025 戲劇 #4（S3，創平台戲劇紀錄）；LINE TODAY 2023 網友投票 #4（S2，5.77%）
7. **前置作品**：改編自 Carlos、李在進（Lee Jae-jin）的網漫 *The Deluxe Taxi*（《Red Cage》；infobox `based_on`，read）。不必先看。**三季要照順序看**，S2、S3 延續同一組角色。
8. **台灣串流**：friDay影音 (free with ads, or the 影劇 pack): S1+S2 at https://video.friday.tw/drama/detail/1798 (「全32集」, i.e. 16+16) and S3 at https://video.friday.tw/drama/detail/4408 (「全16集」). Netflix TW title 81552615 is indexed (lead only). — 證據：Both friDay title pages loaded on 2026-11-08, showing 「適用方案：免費／影劇」. zh-Wikipedia says friDay bought S3 as the TW exclusive. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：infobox genre＝Action / Crime / Vigilante / Black comedy / Revenge（read）。**符合本篇（犯罪＋復仇）**；也帶動作，和韓劇 3 有重疊。

## 4. Revenant

1. **片名**：**惡鬼**（Disney+ TW page；tw-availability-1）／악귀／*Revenant*
2. **劇情**：一名年輕女子被不明存在附身，和看得見鬼的民俗學教授聯手追查城市裡接連發生的離奇自殺。Wikipedia Synopsis：「a young woman possessed by an entity and a professor of folklore who can see ghosts. Together they seek the truth behind mysterious suicides」。來源：https://en.wikipedia.org/wiki/Revenant_(TV_series) （read）
3. **季數與狀態**：1 季 12 集，SBS 2023-06-23 到 07-29（週五六 22:00），**已完結的單季完整故事**（韓文維基「12부작」，read）。infobox 沒寫片長。沒有讀到特別篇。編劇金銀姬（Kim Eun-hee，也是《信號》編劇）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상 시청가**（韓文維基 `시청 등급 = 15` 與圖示，read）。
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-1，2026-11-08）。
   - IMDb Parents Guide（**partial**：沒有類別標題，依頁面順序對應；https://www.imdb.com/title/tt22263470/parentalguide/ ）：Sex & Nudity **None**（4/6）、Violence & Gore **Moderate**（2/5）、Profanity **None**（3/3）、Alcohol, Drugs & Smoking **Mild**（3/4）、Frightening & Intense **Severe**（3/4）。投稿提到：**許多角色被惡靈附身後以各種方式自殺**；吊死者鬼魂聚集的樹；**父母虐待孩子、女子刺死孩童（畫面外，有血跡）**；流產。**每類只有 3–6 票，幾乎不能當證據。**
5. **觀眾評分**：MDL **8.5**（20,418 人，https://mydramalist.com/717539-the-devil ，read）；IMDb **7.8**（4.5K，cache）。RT：沒有查。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2024
   - B：Cine21-2023 #8
   - E：FUNdex Awards 2023 TV drama finalist + search finalist
   - F：PTT 2023 徵文 35 推
   - G：LINE TODAY 2023 網友投票 #11
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`，read）。
8. **台灣串流**：Disney+: https://www.disneyplus.com/zh-tw/browse/entity-f601e974-92be-406f-a07c-e860ab7335a6 — 證據：The service page loads as 「觀看惡鬼 | Disney+」, 15+, 2026-11-08. Also Harper's Bazaar TW, 2023-07-17: 「線上看平台：Disney+」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：infobox genre＝Mystery / Thriller / Horror（read）。**符合「懸疑」**，但核心是**靈異附身恐怖**，不是寫實犯罪；介紹時要先講明有超自然元素。

## 5. Signal

1. **片名**：**信號**（TW media, Netflix；tw-availability-1）／시그널／*Signal*
2. **劇情**：2015 年的犯罪側寫師 Park Hae-young 撿到一台無線電，另一頭竟是 1989 年起的刑警 Lee Jae-han，兩人跨時空合作偵破懸案。Wikipedia Synopsis：「finds a mysterious discarded walkie talkie; inexplicably, the person at the other end … is from the past」。導言寫劇情受韓國真實刑案啟發，包括華城連續殺人案。來源：https://en.wikipedia.org/wiki/Signal_(South_Korean_TV_series) （read）
3. **季數與狀態**：**第 1 季** 16 集，tvN 2016-01-22 到 03-12（週五六 20:30），片長 64–80 分鐘（read）。**續作即將播出**：
   - 續作韓文名《두번째 시그널》（第二個信號），tvN「12월 7일부터 오후 10시에 월화드라마로 편성」，即 **2026-12-07 起週一二 22:00**，第 1、2 集連播（聯合新聞 2026-11-06，https://www.yna.co.kr/view/AKR20261106106000005 ，read）。金惠秀、趙震雄、李帝勳原班回歸。
   - 原訂 2025 年底播出，因演員趙震雄被揭露少年時期犯罪、宣布退出演藝圈而無限期延後；tvN 曾測試 AI 換臉但「한계가 있어」放棄（同上，read）。
   - 韓文維基續作條目寫「8부작」、播出期間「미정」（未更新，read）；《시그널》條目寫「2026년 11월 방영 예정」（也未更新，read）。**以聯合新聞 12-07 為準。**
   - 台灣平台**未查**（續作還沒播）。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）。
   - 台灣：IMDb Certifications 沒有台灣列。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt5332206/parentalguide/ ）：Sex & Nudity **None**（5/9）、Violence & Gore **Moderate**（7/8）、Profanity **Mild**（5/6）、Alcohol, Drugs & Smoking **Mild**（5/8）、Frightening & Intense **Moderate**（7/7）。投稿提到：**少女遭性侵（畫面外，只有窗後模糊影子），之後多次被討論**；暴力類說明標成 Spoilers，沒展開。**每類 6–9 票，參考性有限。**
5. **觀眾評分**：MDL **8.8**（44,555 人，https://mydramalist.com/13239-signal ，read）；IMDb **8.4**（13K，cache）。RT：`/tv/signal` 頁面存在（演員有李帝勳）但 **0 則影評、沒有 Tomatometer**（read）。
6. **推薦 tag**：
   - A：Baeksang Drama win 2016
   - C：IMDb 8.4（13K）；MDL #35 8.8
   - D：NielsenKR cable #29 12.544%
   - F：PTT 2021 入坑串 約 17 人（「很多厭韓的男生看了都稱讚」）；PTT 標題〈看完Signal…比神劇還神劇〉爆（2016）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。看續作前**要先看第 1 季**。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/80987077 — 證據 https://www.storm.mg/lifestyle/11163194 Storm Media, 2026-09-09: Netflix list, #6 — **confirmed (Taiwan media, 2026-09-09)**（tw-availability-1）
- **類型核對**：infobox genre＝Crime / Police procedural / Serial drama / Sci-Fi / Thriller / Mystery（read）。**符合本篇**；帶奇幻（跨時空無線電）設定。

## 6. Flower of Evil

1. **片名**：**惡之花**（HBO Max TW page；tw-availability-2）／악의 꽃／*Flower of Evil*
2. **劇情**：Baek Hee-sung 對身為刑警的妻子 Cha Ji-won 隱瞞身分與過去，兩人看似完美的家庭，在 Ji-won 追查一連串懸案時開始動搖。Wikipedia Synopsis：「a man who hides his identity and past from his wife Cha Ji-won, a detective」。來源：https://en.wikipedia.org/wiki/Flower_of_Evil_(South_Korean_TV_series) （read）
3. **季數與狀態**：1 季 16 集，tvN 2020-07-29 到 09-23（週三四），**已完結的單季完整故事**（韓文維基「16부작」，read）。片長 61–79 分鐘。MDL 站內搜尋另列有「Flower of Evil Special」條目（https://mydramalist.com/69467-flower-of-evil-special ，只看到搜尋列表，沒有點進去，partial）。英文維基另列菲律賓、印度（*Duranga*）、中國（*Deceit*）翻拍版（read）。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상 시청가**（韓文維基，read；IMDb South Korea 15，read）。
   - 台灣：HBO Max TW 頁標 **16+**（tw-availability-2）；IMDb Certifications 卻寫「Taiwan 13+ self-applied」（read）。**兩者不一致，以 HBO Max 頁為準。** 美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt11691684/parentalguide/ ）：Sex & Nudity **Mild**（28/56）、Violence & Gore **Moderate**（11/21）、Profanity **Mild**（8/15）、Alcohol, Drugs & Smoking **Mild**（12/18）、Frightening & Intense **Moderate**（7/12）。投稿提到：一段女方明顯不舒服、落淚的短暫性愛場面；角色被綁在泳池底幾乎溺死、滿臉是血；「One character is crazy, another one lacks feelings, another is a killer」。**票數 12–56，參考性有限。**
5. **觀眾評分**：MDL **9.0**（101,010 人，https://mydramalist.com/54625-flower-of-evil ，read；本篇與黑暗榮耀並列 MDL 最高、評分人數第三多）；IMDb **8.5**（20K，cache；本篇最高）。RT：`/tv/flower_of_evil` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2021
   - C：IMDb 8.5（20K）；MDL #8 9.0（101,007）
   - F：PTT 標題〈今年心中最佳神劇-惡之花〉85 推（2020，列表頁）；Dcard Z.Y 4 分；PTT 2021 入坑串 1
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**HBO Max** https://www.hbomax.com/tw/zh/show/092af411-59c4-4748-933d-8660542eb028 (subscription). Netflix https://www.netflix.com/tw/title/81357268 (JustWatch only) — 證據：The HBO Max TW page 「觀看 惡之花 | HBO Max」 (16+) was live 2026-11-08. LINE TV was the original 2020 「全台獨播」 platform. — **confirmed (service page): HBO Max**（tw-availability-2）。文章先寫 HBO Max；Netflix 只有 JustWatch。
- **類型核對**：infobox genre＝Romance / Mystery / Thriller（read）。**符合本篇（懸疑驚悚）**；愛情是主軸之一。

## 7. Stranger

1. **片名**：**秘密森林**（Netflix trailer; TW media；tw-availability-2）／비밀의 숲／*Stranger*（又名 *The Forest of Secrets*）
2. **劇情**：因手術失去同理心的檢察官 Hwang Si-mok，和熱血女警 Han Yeo-jin 聯手查案，揭開檢察體系與財閥之間的貪腐共謀；第 2 季則轉向檢警爭奪偵查權。Wikipedia Synopsis：「their efforts are continually being obstructed by participants in a major corruption conspiracy between the Prosecutors' Office and a private chaebol」。來源：https://en.wikipedia.org/wiki/Stranger_(TV_series) （read）
3. **季數與狀態**：**2 季，共 32 集**，tvN，片長 63–86 分鐘（read）：
   - **S1**：16 集，2017-06-10 到 07-30；韓文維基 S1 條目另寫「스페셜 1부작」（**+1 集特別篇**，read）。
   - **S2**：16 集，2020-08-15 到 10-04。
   - 兩季都由李秀妍（Lee Soo-yeon）一人編劇；英文維基寫本劇「developed as a potential multi-seasonal program」（read）。**沒有讀到第 3 季的消息**，可寫「兩季已播完」。
4. **分級**：
   - 韓國：**15세 이상 시청가**（韓文維基，read；IMDb South Korea 15，read）。
   - 台灣：IMDb Certifications 沒有台灣列。美國 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt6461346/parentalguide/ ）：Sex & Nudity **None**（18/24）、Violence & Gore **Mild**（11/15）、Profanity **Mild**（7/15）、Alcohol, Drugs & Smoking **Mild**（12/14）、Frightening & Intense **Mild**（10/13）。投稿提到：談及未成年賣淫；數次刺殺、勒頸；S2 有人被綁架、用鐵管毆打。「less profanity than the usual Netflix program」。**本篇內容最溫和的一部**；票數 13–24。
5. **觀眾評分**：MDL S1 **8.7**（29,956 人，https://mydramalist.com/21934-stranger ）、S2 **8.5**（12,776 人，https://mydramalist.com/27361-stranger-2 ）（皆 read）；IMDb **8.4**（13K，兩季合一，cache）。RT：`/tv/stranger` slug 404，**沒有找到 RT 頁面**（不排除用別的 slug）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2018
   - C：IMDb 8.4（13K）；MDL #55 8.7
   - F：PTT 2021 入坑串 5；PTT 2026 入坑串 1
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。第 2 季接第 1 季，**要照順序看**。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/80187302 — 證據 https://www.youtube.com/watch?v=WJNlQrvb2_o (「秘密森林 第 2 季 | 前導預告 | Netflix」, Netflix Malaysia/@netflixasia), 2020-08-10. Also the TW media agentm https://news.agentm.tw/101378/ (「第一季共 16 集已在台灣 Netflix 上線」; written 2020, page dated 2025-01-05). JustWatch TW: Netflix. — **confirmed (official channel, Asia zh channel, 2020). The evidence is old; JustWatch backs it as current.**（tw-availability-2）
   - ⚠ **授權劇、最新台灣證據是 2020 年**（agentm 頁面日期 2025-01-05 但內文寫於 2020），需台灣裝置確認。
- **類型核對**：導言「crime thriller」（read；infobox genre 是多行 Plainlist，抽取只拿到開頭）。**符合本篇**。

## 8. The Manipulated

1. **片名**：**操控遊戲**（Disney+ TW page；tw-availability-2）／조각도시／*The Manipulated*
2. **劇情**：平凡男子 Park Tae-jung 被冤枉犯下重罪入獄，發現一切是 An Yo-han 一手設計後展開復仇。Wikipedia Synopsis：「he is wrongfully accused of a heinous crime and sent to prison. After discovering that everything was orchestrated by An Yo-han, he sets out on a path of revenge」。來源：https://en.wikipedia.org/wiki/The_Manipulated （read）
3. **季數與狀態**：1 季 12 集，Disney+（Hulu 品牌原創）2025-11-05 首播 4 集，到 2025-12-03 播完，**已完結的單季完整故事**（韓文維基「12부작」，read）。片長 50 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**19**（IMDb Certifications，read；韓文維基沒有分級欄）。
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-2）。美國 TV-14（IMDb）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt36188448/parentalguide/ ）：Sex & Nudity **Mild**（19/33）、Violence & Gore **Severe**（14/16）、Profanity **Severe**（8/11）、Alcohol, Drugs & Smoking **Severe**（11/14）、Frightening & Intense **Severe**（9/13）。投稿提到：提及強暴犯罪與部分細節；其餘類別沒有文字說明。**票數 11–33，參考性有限。**
5. **觀眾評分**：MDL **8.5**（19,149 人，https://mydramalist.com/759665-sculpture-city ，read）；IMDb **7.7**（5.9K，cache）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**；Popcornmeter 88%（read，不建議引用）。
6. **推薦 tag**：
   - B：Time-K2025（Burt）honorable mention
   - F：PTT 2025 最愛串 3（「今年唯一一集接一集等的劇」）；Dcard Z.Y 4 分
   - G：遠見 2025 年度 10 大 #4；ELLE TW 片單 #9
   - （fans 檔註記：PTT S2 原 PO 說最後兩集「收得很微妙」，屬保留意見，沒列為 tag。）
7. **前置作品**：改編自 2017 年電影《偽造都市》（*Fabricated City*，朴光賢導演；編劇吳尚浩也是本劇編劇；infobox `based_on` 與導言，read。電影中文名是背景知識）。不必先看。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-5c49a8a7-8236-436c-918b-15b0aa9ae0ab (subscription; the entity-22e8ccc0… URL in udn redirects here) — 證據：The Disney+ TW page 「觀看操控遊戲 | Disney+」 (15+) was live 2026-11-08. udn https://stars.udn.com/star/story/10088/9184596 (2025-12-05): 「Disney+獨家韓劇」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：導言「revenge action crime thriller」（read）。**符合本篇（復仇）**；動作比重高，也可放韓劇 3。

## 9. Little Women

1. **片名**：**小女子**（Netflix trailer；tw-availability-2）／작은 아씨들／*Little Women*
2. **劇情**：家境貧窮的三姊妹 In-joo、In-hye、In-kyung 各自追求金錢、獨立與愛情，大姊意外得到「已故」同事留下的 700 億韓元，卻因此和韓國首富家族對上。Wikipedia Synopsis：「The supposedly dead friend of one of the sisters left her 70 billion won but the people behind it, Korea's richest family, will do anything to stop them」。來源：https://en.wikipedia.org/wiki/Little_Women_(2022_TV_series) （read）
3. **季數與狀態**：1 季 12 集，tvN 2022-09-03 到 10-09（週六日 21:10），**已完結的單季完整故事**（韓文維基「12부작」，read）。片長 77 分鐘。部分地區在 Netflix 串流。編劇鄭瑞景（Jeong Seo-kyeong），導演金熙元（和暴風圈同一組編導）。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상 시청가**（韓文維基，read；IMDb「South Korea 15 self-applied」）。
   - 台灣：IMDb Certifications「Taiwan 13+ self-applied」（read；self-applied 是平台自填）。美國 TV-MA self-applied；IMDb 列越南「(Banned)」。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt21828868/parentalguide/ ）：Sex & Nudity **Mild**（16/34）、Violence & Gore **Mild**（7/13）、Profanity **Moderate**（1/5）、Alcohol, Drugs & Smoking **Mild**（9/12）、Frightening & Intense **Moderate**（7/10）。投稿提到：車禍死亡、大量血跡；姊妹之一酗酒；一場寬衣、暗示性關係的吻戲。**Profanity 只有 5 票，其他 10–34 票，參考性有限。**
5. **觀眾評分**：MDL **8.4**（42,863 人，https://mydramalist.com/704957-little-women ，read）；IMDb **7.7**（9.9K，cache）。RT：「Little Women (2022)」頁面 Tomatometer **100%**（6 則）、Popcornmeter **70%**（https://www.rottentomatoes.com/tv/little_women_2022 ，read；只核對了頁面標題，沒有核對演員，樣本很小）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2023
   - B：Cine21-2022 #2
   - D：NielsenKR cable #40 11.105%；KDF 2022 #10 11.5%
   - F／G：無
7. **前置作品**：infobox 沒有 `based_on`（read）；劇名借用奧爾柯特小說，但讀到的英文維基段落沒有說是改編，**不寫成改編作品**。不必先看任何作品。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81610895 — 證據 https://www.youtube.com/watch?v=7Fi84j1gsAE (「小女子 | 正式預告 | Netflix」, Netflix Malaysia/@netflixasia, 「NETFLIX 獨家」), 2022-09-04. udn 2022-08-10 says it is on Netflix. JustWatch TW: Netflix. — **confirmed (official channel, Asia zh channel)**（tw-availability-2）
   - ⚠ **授權劇（tvN）、最新台灣證據是 2022 年**，JustWatch 2026-11-08 仍列 Netflix 只算線索，需台灣裝置確認。
- **類型核對**：infobox genre＝Mystery / Family drama（read）。**部分符合**：懸疑成分足，但主類型含家庭劇；ratings 檔標「thriller」。介紹時以「懸疑＋財閥陰謀」切入較合適。

## 10. Mercy for None

1. **片名**：**無赦之仇**（Netflix Taiwan trailer；tw-availability-2）／광장／*Mercy for None*
2. **劇情**：前黑幫打手 Nam Gi-jun 退出江湖 11 年後，弟弟 Nam Gi-seok 慘遭殺害，他重回黑道追查真相、展開殘酷復仇。Wikipedia Synopsis：「his younger brother, Nam Gi-seok, is brutally murdered, forcing Gi-jun back into the world of crime to uncover the truth and seek brutal revenge」。來源：https://en.wikipedia.org/wiki/Mercy_for_None （read）
3. **季數與狀態**：**7 集迷你劇**，Netflix 2025-06-06 上線，**已完結的單季完整故事**（韓文維基「7부작」，read）。片長 37–49 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**19**（IMDb Certifications，read；韓文維基沒有分級欄）。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒有標平台）。美國 TV-MA。
   - IMDb Parents Guide（**partial**：沒有類別標題，依頁面順序對應；https://www.imdb.com/title/tt29650530/parentalguide/ ）：Sex & Nudity **None**（27/32）、Violence & Gore **Severe**（29/30）、Profanity **Severe**（15/27）、Alcohol, Drugs & Smoking **Mild**（18/24）、Frightening & Intense **Severe**（18/23）。投稿提到：**整季都是血腥打鬥**，刀、斧頭、球棒；有一場切斷手指；「a violent and bloody show but not extremely over the top or realistic gore」。**暴力類 29/30 票意見一致。**
5. **觀眾評分**：MDL **8.3**（20,983 人，https://mydramalist.com/748031-plaza-wars ，read）；IMDb **7.5**（12K，cache）。RT：Tomatometer **88%**（8 則）、Popcornmeter **90%**（https://www.rottentomatoes.com/tv/mercy_for_none ，read；樣本很小）。
6. **推薦 tag**：
   - B：Time-K2025（Burt）honorable mention
   - F：PTT 2025 最愛串 2；Dcard 777果 5💡
   - G：Netflix TW 2025-06-23～29 #6（累計 6 週；2026-07 又進榜 #8）
   - （已刪：Dcard Z.Y 2 分。）
7. **前置作品**：改編自 *Plaza Wars: Mercy for None*（原作者 Oh Se-hyung、Kim Gyun-tae；infobox `based_on`，read）。讀到的段落沒寫原作是網漫還是其他形式。不必先看。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81702777 — 證據 https://www.youtube.com/watch?v=LDpmTk7PwJ0 (「《無赦之仇》|正式預告 | Netflix」, Netflix Taiwan), 2025-05-21 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Action / Noir / Revenge drama（read）。**符合本篇（復仇）**；動作比重高。

## 11. Nine Puzzles

1. **片名**：**血謎拼圖**（Disney+ TW page；tw-availability-2）／나인 퍼즐／*Nine Puzzles*
2. **劇情**：高中時發現叔叔遇害、現場留有拼圖片的 Yoon E-na，十年後成為犯罪側寫師，當同樣留下拼圖的連續殺人案出現，她被迫和一直懷疑她的刑警 Kim Han-saem 合作。Wikipedia：「a ten-year-old cold case that involves a new string of baffling murders, all related to mysterious puzzles」。來源：https://en.wikipedia.org/wiki/Nine_Puzzles （read）
3. **季數與狀態**：1 季 11 集，Disney+ 2025-05-21 到 06-04，**已完結的單季完整故事**（韓文維基「11부작」，read）。infobox 沒寫片長。導演尹鍾彬（Yoon Jong-bin）。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：IMDb Certifications「South Korea **15** 2025, self-applied」（read；韓文維基沒有分級欄）。
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-2）。美國 TV-MA。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt29927351/parentalguide/ ）：Sex & Nudity **None**（10/11）、Violence & Gore **Severe**（10/12）、Profanity **Mild**（6/11）、Alcohol, Drugs & Smoking **Moderate**（7/8）、Frightening & Intense **Severe**（8/8）。投稿沒有暴力的具體描述（只寫「I.」）；有偶爾的 f-word。**每類 8–12 票，參考性有限。**
5. **觀眾評分**：MDL **8.4**（16,544 人，https://mydramalist.com/752975-nine-puzzle ，read）；IMDb **7.6**（5K，cache）。RT：Tomatometer **100%**（5 則；https://www.rottentomatoes.com/tv/nine_puzzles ，read；沒有 Popcornmeter；樣本極小）。
6. **推薦 tag**：
   - B：Time-K2025（Burt）honorable mention
   - F：PTT 2025 最愛串 1；PTT 2025 印象串 1
   - G：ELLE TW 片單 #15
   - （fans 檔註記：PTT S2 原 PO 說「不難看但不深刻」。）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-b29d5852-c94c-4d05-beb9-bfd2f227fd12 (subscription) — 證據：The Disney+ TW page 「觀看血謎拼圖 | Disney+」 (15+) was live 2026-11-08. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre＝Mystery / Crime thriller（read）。**符合本篇**。

## 12. Tempest

1. **片名**：**暴風圈**（Disney+ TW page；tw-availability-2）／북극성／*Tempest*
2. **劇情**：前聯合國大使 Seo Mun-ju 的總統候選人丈夫遭一名軍人殺害，她和國籍成謎的特務 Paik San-ho 追查真相，捲入威脅朝鮮半島穩定的核危機陰謀。Wikipedia Synopsis：「After an army soldier kills Mun-ju's presidential candidate husband, she and San-ho try to uncover the truth behind his murder」。來源：https://en.wikipedia.org/wiki/Tempest_(TV_series) （read）
3. **季數與狀態**：1 季，Disney+ 2025-09-10 到 10-01，**已完結的單季完整故事**。**集數有出入**：英文維基與 MDL 都寫 **9 集**（read），韓文維基寫「8부작」（read）；文章建議寫 9 集或避開集數。片長 50–60 分鐘。編劇鄭瑞景、導演金熙元（和小女子同一組）；全智賢、姜棟元主演。來源：同上（read）
4. **分級**：
   - 韓國：**15**（IMDb Certifications，read；韓文維基沒有分級欄）。
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-2）；IMDb 也列 Taiwan 15+（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt27368147/parentalguide/ ）：Sex & Nudity **Mild**（8/17）、Violence & Gore **Moderate**（5/11）、Profanity **Mild**（4/7）、Alcohol, Drugs & Smoking **Mild**（4/8）、Frightening & Intense **Severe**（4/8）。投稿內容被折疊或標 Spoilers，沒展開。**每類 7–17 票，參考性有限。**
5. **觀眾評分**：MDL **8.1**（12,079 人，https://mydramalist.com/750097-polaris ，read）；IMDb **6.8**（11K，cache；**本篇最低**）。RT：Tomatometer **100%**（7 則）、Popcornmeter **60%**（https://www.rottentomatoes.com/tv/tempest ，read；頁面有全智賢、姜棟元，確認是本劇）。**影評與觀眾落差大**，和台灣負評聲量一致。
6. **推薦 tag**：
   - B：Time-K2025（Burt）#4
   - F：PTT 2025 最愛串 1
   - G：遠見 2025 年度 10 大 #6；ELLE TW 片單 #6
   - （已刪：`G DailyView 聲量 #8`，fans 檔註明「以負評、爭議為主」。PTT S2 說後段不好、Dcard Z.Y 棄劇，也都是負評，沒列。）
7. **前置作品**：沒有，原創劇（infobox `based_on` 欄只有註解，read）。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-37943af7-e966-42b6-ae61-95c911d012d9 (subscription) — 證據：The Disney+ TW page 「觀看暴風圈 | Disney+」 (15+, 全智賢／姜棟元) was live 2026-11-08. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre＝**Spy / Romance / Action**；導言「spy romance television series」（read）。⚠ **不太符合本篇**：Wikipedia 沒有把它歸成犯罪、懸疑或復仇，主軸是諜報與愛情（雖然起點是謀殺案調查）。**需要人工判斷**，可考慮移到韓劇 3（動作）。

## 13. As You Stood By

1. **片名**：**你旁觀的罪**（Netflix Taiwan trailer；「妳旁觀的罪」 is not the official form；tw-availability-2）／당신이 죽였다／*As You Stood By*
2. **劇情**：兩名被逼到絕境的女性，在「不殺就被殺」的殘酷現實裡選擇殺人，卻掉進意想不到的命運轉折。Wikipedia Synopsis：「two women who, trapped in a brutal reality where survival demands either killing or being killed, choose to kill」。角色表顯示其中一人的丈夫施暴是主線。來源：https://en.wikipedia.org/wiki/As_You_Stood_By （read）
3. **季數與狀態**：**8 集迷你劇**，Netflix 2025-11-07 上線（前兩集先在 2025-09-18 第 30 屆釜山影展 On Screen 單元首映），**已完結的單季完整故事**（韓文維基「8부작」，read）。片長 56–71 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**19세 이상**（韓文維基 `시청 등급 = 19`，read）。
   - 台灣：IMDb Certifications 沒有讀到（jina 版沒有認證區塊，Exa 快取在認證標題處截斷）。
   - IMDb Parents Guide（**partial**：jina 版沒有類別標題，類別由 Exa 快取對上；https://www.imdb.com/title/tt33550045/parentalguide/ ）：Sex & Nudity **Mild**（10/18）、Violence & Gore **Severe**（9/16）、Profanity **Moderate**（5/8）、Alcohol, Drugs & Smoking **Moderate**（9/12）、Frightening & Intense **Moderate**（6/10）。投稿提到：**「Numerous instances of severe domestic abuse, as the plot revolves around that」**、「EXTREMELY brutal domestic violence … should consider twice before watching」；**妻子被毆打後遭強迫性交（未直接拍出）**；幼童死亡、寵物貓死亡、推人墜樓。**家暴題材敏感的讀者要先提醒；票數 8–18，參考性有限。**
5. **觀眾評分**：MDL **8.2**（16,442 人，https://mydramalist.com/777688-as-you-stood-by ，read）；IMDb **7.5**（4.6K，cache）。RT：Tomatometer **71%**（7 則）、Popcornmeter **86%**（https://www.rottentomatoes.com/tv/as_you_stood_by ，read；樣本很小）。
6. **推薦 tag**：
   - B：Time-K2025（Burt）honorable mention
   - F：PTT 2025 印象串推文推薦 1
   - G：Netflix TW 2025-11-10～16 #1（累計 3 週）
   - （已刪：Dcard Z.Y 1 分。）
7. **前置作品**：改編自奧田英朗 2014 年日本小說《ナオミとカナコ》（*Naomi and Kanako*；infobox `based_on`，read）。該小說 2016 年在日本拍過劇版（背景知識，未查證）。不必先看。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81900129 — 證據 https://www.youtube.com/watch?v=K2LHRLDFVN8 (「《你旁觀的罪》| 正式預告 | Netflix」, Netflix Taiwan, 「11 月 7 日上線，Netflix 獨家」), 2025-10-23 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Crime thriller（read）。**符合本篇**。

## 14. Worst of Evil

1. **片名**：**惡中之惡**（Disney+ TW page；tw-availability-2）／최악의 악／*The Worst of Evil*
2. **劇情**：1990 年代，被岳家看不起的鄉下刑警 Park Jun-mo 為了升官，臥底潛入橫跨韓中日的販毒組織「江南聯合」。Wikipedia Plot：「follows undercover police investigators who infiltrate a massive criminal organization responsible for the illegal drug trade between Korea, China and Japan」。來源：https://en.wikipedia.org/wiki/The_Worst_of_Evil （read）
3. **季數與狀態**：1 季 12 集，Disney+ 2023-09-27 到 10-25，**已完結的單季完整故事**（韓文維基「12부작」，read）。片長 52–69 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**19세 이상 시청가**（韓文維基分級圖示，read；IMDb South Korea 19，read）。
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-2）。美國 TV-MA。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt20600022/parentalguide/ ）：Sex & Nudity **Mild**（22/37）、Violence & Gore **Severe**（23/25）、Profanity **Severe**（13/16）、Alcohol, Drugs & Smoking **Severe**（17/23）、Frightening & Intense **Severe**（11/18）。投稿提到：「Frequent gang fights which ends up with extremely bloody results. People get stabbed, shot and mutilated」；每集都有人抽菸；第 7 集夜店男子對女子毛手毛腳。**票數 16–37。**
5. **觀眾評分**：MDL **8.6**（24,155 人，https://mydramalist.com/723885-the-worst-evil ，read）；IMDb **8.3**（8.7K，cache）。RT：`/tv/the_worst_of_evil` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - E：FUNdex Awards 2023 OTT drama finalist
   - F：PTT 2023 徵文 18 推
   - G：LINE TODAY 2023 網友投票 #28（推文 2 人說被低估）
7. **前置作品**：沒有，原創劇（infobox 無 `based_on`）。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-3fde2818-1be7-41ab-b405-1fc217423713 (subscription) — 證據：The Disney+ TW page 「觀看惡中之惡 | Disney+」 (15+) was live 2026-11-08. udn (2025-12) also calls it a Disney+ title. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre 第一項 Crime action；導言「crime action thriller noir」（read）。**符合本篇**。

## 15. Karma

1. **片名**：**惡緣**（Netflix Taiwan trailer；tw-availability-2）／악연／*Karma*
2. **劇情**：欠下高利貸的兒子雇人殺父騙保，屍體又被一對開車的情侶撞上，幾個陌生人被一連串錯誤綁在一起、為了各自的慾望互相毀滅。Wikipedia：「people who are entangled in an unexpected ill-fated relationship and destroy each other while pursuing their own desires」。來源：https://en.wikipedia.org/wiki/Karma_(South_Korean_TV_series) （read）
3. **季數與狀態**：**6 集迷你劇**，Netflix 2025-04-04 上線，**已完結的單季完整故事**（韓文維基「6부작」，read）。片長 47–61 分鐘。編導李一衡（Lee Il-hyung）。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**19세 이상 시청가**（韓文維基圖示，read；IMDb South Korea 19，read）。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒有標平台）。美國 TV-MA。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt29921070/parentalguide/ ）：Sex & Nudity **Mild**（24/32）、Violence & Gore **Severe**（12/18）、Profanity **Moderate**（9/13）、Alcohol, Drugs & Smoking **Moderate**（12/13）、Frightening & Intense **Severe**（9/14）。投稿提到：**一名少女回憶曾被三名蒙面少年企圖強暴**（無裸露）；其餘暴力類別沒有文字說明。**票數 13–32。**
5. **觀眾評分**：MDL **8.1**（15,252 人，https://mydramalist.com/757147-bad-relationship ，read）；IMDb **7.6**（8.5K，cache）。RT：`/tv/karma` 頁面 0 則影評，但頁面上沒有找到本劇演員名，**無法確認是不是本劇**，不引用。
6. **推薦 tag**：
   - A：BlueDragon Drama nom 2025
   - F：PTT 2025 最愛串 約 10 人；Dramabeans 2025 Best Directing honorable mention
   - G：Netflix TW 2025-04-28～05-04 #9（累計 5 週）；LINE TODAY 2025 韓劇年度榜（前十）
   - （已刪：Dcard Z.Y 2 分。）
7. **前置作品**：改編自 Kakao 網漫《악연》（作者 Choi Hee-seon；導言，read）。不必先看。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81703410 (JustWatch ID; the trailer description links 81703411) — 證據 https://www.youtube.com/watch?v=TdxRorORZ-8 (「《惡緣》 | 正式預告 | Netflix」, Netflix Taiwan, Netflix 獨家), 2025-03-18 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Crime thriller（read）。**符合本篇**。

## 16. Friendly Rivalry

1. **片名**：**善意的競爭**（Hami Video page；tw-availability-2）／선의의 경쟁／*Friendly Rivalry*
2. **劇情**：孤兒院長大的 Woo Seul-gi 轉進全國前 1% 的明星女高，在殘酷的大考競爭中，捲入擔任學測出題委員的父親離奇死亡之謎。Wikipedia Plot：「she gets entangled in the mystery surrounding the suspicious death of her father, who was a member of the CSAT committee」。來源：https://en.wikipedia.org/wiki/Friendly_Rivalry （read）
3. **季數與狀態**：1 季 **16 集、每集約 30 分鐘**，U+ Mobile TV 2025-02-10 到 03-06（週一到週四每天 00:00 各上 1 集；韓文維基註「회당 약 30분 분량을 매주 4회씩 공개」，read）。**第 1 季已完結。續作**：MDL 另有條目《페어플레이》（*Peeopeullei*），別名「선의의 경쟁 시즌2」，同樣改編自原網漫，**沒有播出日期**（https://mydramalist.com/807442-friendly-rivalry-season-2 ，read）。續作是否已正式確認製作、何時播出，**沒有查到官方來源**。
4. **分級**：
   - 韓國：**19세 이상**（韓文維基 `시청 등급 = 19`，read；IMDb South Korea 19，read）。
   - 台灣：IMDb Certifications「Taiwan 13+ self-applied」（read）。Hami／Netflix 頁分級沒有讀。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35683421/parentalguide/ ）：五類全部 **Moderate**——Sex & Nudity（11/33）、Violence & Gore（7/18）、Profanity（4/12）、Alcohol, Drugs & Smoking（7/15）、Frightening & Intense（7/14）。投稿提到：**校園霸凌，女學生被菸頭燙、被毆打**；多場穿著衣服的自慰場面、偷窺者；兩名女孩接吻。**票數 12–33，參考性有限。**
5. **觀眾評分**：MDL **7.6**（22,179 人，https://mydramalist.com/764499-friendly-competition ，read；本篇與假面女郎並列最低）；IMDb **7.6**（7.1K，cache）。RT：沒有查。
6. **推薦 tag**：
   - B：Cine21-2025 #9
   - F：PTT 2025 最愛串 2；PTT 2025 印象串 1（「好喜歡」）
   - G：Netflix TW 2025-04-28～05-04 #10（累計 4 週）
7. **前置作品**：改編自宋彩允（Song Chae-yoon）、沈在榮（Shim Jae-young）的同名網漫（導言，read；中文姓名為音譯，未查官方譯名）。不必先看。
8. **台灣串流**：**Hami Video** https://hamivideo.hinet.net/product/285483.do (subscription, 「部分免費」). **Netflix** https://www.netflix.com/tw/title/82036243 — 證據：The Hami page loads (全16集), checked 2026-11-08. Netflix: Cosmopolitan TW https://www.cosmopolitan.com/tw/entertainment/movies/g46666463/friendly-rivalry-netflix/ (「現已上線Netflix啦」), 2025-04-12; JustWatch TW also lists Netflix. — **confirmed (service page): Hami. Netflix confirmed (Taiwan media, 2025-04-12).**（tw-availability-2）
- **類型核對**：infobox genre＝Teen drama / Mystery / Thriller（read）。**符合本篇（懸疑）**；是校園青春題材。

## 17. Marry My Husband

1. **片名**：**和我老公結婚吧**（TW media；tw-availability-1）／내 남편과 결혼해줘／*Marry My Husband*
2. **劇情**：罹患胃癌末期的 Kang Ji-won 撞見丈夫和閨密偷情、在爭執中被丈夫殺死，醒來回到 2013 年，決定讓閨密嫁給丈夫來轉移自己的厄運並復仇。Wikipedia Synopsis：「She then resolves to have Su-min marry Min-hwan in order to exact revenge and escape her miserable fate」。來源：https://en.wikipedia.org/wiki/Marry_My_Husband （read）
3. **季數與狀態**：1 季 16 集，tvN 2024-01-01 到 02-20（週一二 20:50），**已完結的單季完整故事**（韓文維基「16부작」，read）。片長 70 分鐘。韓國在 TVING 串流，韓中以外地區由 Amazon Prime Video 播出（導言，read）。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）。
   - 台灣：IMDb Certifications 沒有台灣列。IMDb 美國列「13+」。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26628595/parentalguide/ ）：Sex & Nudity **Mild**（12/25）、Violence & Gore **Mild**（7/14）、Profanity **Mild**（5/12）、Alcohol, Drugs & Smoking **Moderate**（6/13）、Frightening & Intense **Mild**（8/13）。投稿提到：**丈夫多次言語（有時肢體）虐待妻子**；第 1 集有暗示性愛的吻戲。**票數 12–25，參考性有限。**
5. **觀眾評分**：MDL **8.5**（78,489 人，https://mydramalist.com/747733-marry-my-husband ，read；本篇評分人數第四多）；IMDb **7.8**（13K，cache）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**；Popcornmeter 93%（read，不建議引用）。
6. **推薦 tag**：
   - B：Time-K2024（Burt）#8
   - D：NielsenKR cable #34 11.951%；KDF 2024 #6 12%
   - E：FUNdex 2024 TV ending-drama buzz #4；Awards 2024 TV drama finalist
   - F：Dcard Z.Y 4 分（拆自合併列，原寫「請和我老公結婚吧」）
7. **前置作品**：改編自 Sung So-jak 的同名網路小說，也有網漫版（導言，read）。不必先看。
8. **台灣串流**：Prime Video: https://www.primevideo.com/-/zh_TW/detail/0U9LVA2T8NCPW1W1B51AGU7KCR (language page; link only) — 證據 https://today.line.me/tw/v3/article/60qjp2X LINE TODAY, 2026-02-02 (Taiwan Mobile's Prime Video plan; names 《和我老公結婚吧》). Also the Yahoo TW 「台灣Prime Video訂閱攻略」 article (dated 2026-05-27 in search): 「Prime Video獨家熱播韓劇《和我老公結婚吧》」. — **confirmed (Taiwan media, 2026-02-02)**（tw-availability-1）
- **類型核對**：infobox genre＝Romantic comedy / Fantasy / Revenge / Workplace（read）。⚠ **部分符合**：有復仇，但 Wikipedia 第一項是浪漫喜劇、還有穿越回到過去的奇幻設定（SCMP 形容「breezy time-travel workplace romcom」，見 genre 引註）。**需要人工判斷**是放本篇（復仇）還是韓劇 1（穿越愛情）；放本篇的話，介紹時要說明它是輕鬆的爽劇路線。

## 18. Reborn Rich

1. **片名**：**財閥家的小兒子**（friDay / Hami pages；tw-availability-1）／재벌집 막내아들／*Reborn Rich*
2. **劇情**：替順陽集團賣命的員工 Yoon Hyun-woo 被財閥家族成員殺害滅口，醒來發現自己重生為 1987 年該家族的么孫 Jin Do-jun，於是利用未來的記憶謀劃奪取集團、展開復仇。Wikipedia Synopsis：「he has been reincarnated into the body of Jin Do-jun, youngest grandson of the Soonyang family … he starts his revenge by plotting a hostile takeover of Soonyang Group」。來源：https://en.wikipedia.org/wiki/Reborn_Rich （read）
3. **季數與狀態**：1 季 16 集，JTBC 2022-11-18 到 12-25（週五六日 22:30，一週三集），**已完結的單季完整故事**（韓文維基「16부작」，read）。片長 60–87 分鐘。沒有讀到特別篇。來源：同上（read）
4. **分級**：
   - 韓國：IMDb Certifications「South Korea **15** self-applied」（read；韓文維基沒有分級欄）。
   - 台灣：IMDb Certifications「Taiwan G self-applied」（read；self-applied，不是台灣主管機關分級，和劇情內容不太相符，**不建議引用**）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt18352538/parentalguide/ ）：**五個類別全部「No data」，沒有投票。**
5. **觀眾評分**：MDL **8.5**（28,268 人，https://mydramalist.com/79607-youngest-son-of-a-conglomerate ，read）；IMDb **8.1**（6.2K，cache）。RT：`/tv/reborn_rich` slug 404，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - A：IntlEmmy TV Movie/Miniseries nom 2023（awards 檔標 `*`：典禮年份由正則視窗推定，需再核對）；SDA Mini-series runner-up 2023
   - B：Cine21-2023 #9
   - D：NielsenKR cable #2 26.948%；KDF 2022 #1 26.9%
   - E：Good Data 2022-12 週榜 #1 劇集 + 演員（ratings 檔標 **snippet**，只當線索）
   - F／G：無
7. **前置作品**：改編自山景（San Gyung）的網路小說《재벌집 막내아들》（infobox `based_on`，read）。不必先看。
8. **台灣串流**：friDay影音 (free with ads, or the 影劇 pack): https://video.friday.tw/drama/detail/2657. Hami Video: https://hamivideo.hinet.net/product/260346.do?cs=2 (page title 「免費線上看」). — 證據：Both title pages loaded on 2026-11-08. friDay shows 「適用方案：免費／影劇」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：infobox genre＝Fantasy / Period / Revenge（read）。**符合本篇（復仇）**；帶重生奇幻設定。

---

## 總結

- **季數與狀態**：
  - **多季**：模範計程車 3 季（48 集 + 2 特別篇，S3 於 2026-01-10 播完，S4 未官方確認）；秘密森林 2 季（32 集，S1 另有 1 集特別篇）。
  - **續作在即**：**信號**的續作《두번째 시그널》2026-12-07 起在 tvN 播出（聯合新聞，read），文章發佈時可能正在播。善意的競爭在 MDL 有續作條目《페어플레이》，但沒有日期、沒有官方確認。
  - **分段上線**：黑暗榮耀 Part 1（2022-12-30）／Part 2（2023-03-10），各 8 集。
  - 其他 13 部都是**已完結的單季完整故事**。
- **集數**：16 集 6 部（信號、惡之花、善意的競爭〔每集約 30 分鐘〕、和我老公結婚吧、財閥家的小兒子、黑暗榮耀〔8+8〕）；12 集 4 部（惡鬼、操控遊戲、小女子、惡中之惡）；11 集 1 部（血謎拼圖）；9 集 1 部（暴風圈，韓文維基寫 8）；8 集 1 部（你旁觀的罪）；7 集 2 部（假面女郎、無赦之仇）；6 集 1 部（惡緣）；多季 2 部（模範計程車、秘密森林）。**短篇（≤ 9 集）有 5 部**，適合推給想一口氣看完的讀者。
- **韓國分級**：**19 歲以上 8 部**——黑暗榮耀、假面女郎、操控遊戲、無赦之仇、你旁觀的罪、惡中之惡、惡緣、善意的競爭（其中假面女郎、操控遊戲、無赦之仇只有 IMDb 來源）；模範計程車兩個來源不一致（韓文維基 15，但註記本播與夜間重播 19；IMDb 寫 19）。其餘 9 部 15 歲以上。
- **台灣平台分級**（服務頁或 IMDb）：Disney+ 惡鬼、操控遊戲、血謎拼圖、暴風圈、惡中之惡都標 15+；HBO Max 惡之花 16+。IMDb 列台灣分級的：黑暗榮耀、無赦之仇、惡緣、暴風圈 15+；假面女郎 16+（cache）；惡之花、小女子、善意的競爭 13+ self-applied；財閥家的小兒子 G self-applied。**惡之花 HBO Max 16+ 和 IMDb 13+ 不一致。**
- **IMDb Parents Guide 內容提醒**（使用者投稿，票數少）：
  - 性暴力：假面女郎（強暴場面）、你旁觀的罪（婚內強迫性交，未直接拍出）、模範計程車（性侵題材、綁架拍色情片）、信號（少女遭性侵，畫面外）、惡緣（強暴未遂的回憶）、操控遊戲（提及強暴罪）。
  - 自殺：惡鬼（多名角色被附身自殺）、黑暗榮耀（主角站上頂樓想輕生）。
  - 霸凌：黑暗榮耀（燙傷、針刺、毆打，主線）、善意的競爭（菸頭燙傷）。
  - 家暴：你旁觀的罪（主線，投稿者特別警告）、黑暗榮耀、和我老公結婚吧（丈夫言語與肢體虐待）、惡鬼（父母虐童）。
  - 血腥暴力：無赦之仇、惡中之惡、操控遊戲、血謎拼圖的 Violence & Gore 都是 Severe。
  - 最溫和：秘密森林（全部 None／Mild）。財閥家的小兒子沒有投票資料。
- **評分**：MDL 全部 7.6–9.0；最高是惡之花與黑暗榮耀（9.0／8.9），評分人數最多是黑暗榮耀 Part 1（120,801）。IMDb 6.8–8.5，**暴風圈 IMDb 6.8、RT 觀眾 60% 偏低**，對照 RT 影評 100%（7 則），口碑兩極。RT 有 Tomatometer 的 7 部：黑暗榮耀 82%（11 則）、假面女郎 100%（9）、無赦之仇 88%（8）、你旁觀的罪 71%（7）、暴風圈 100%（7）、小女子 100%（6）、血謎拼圖 100%（5）。
- **類型核對**：15 部符合「犯罪、懸疑與復仇」。**需要人工判斷 2 部**：暴風圈（Wikipedia 歸類為諜報／愛情／動作，可考慮移到韓劇 3）、和我老公結婚吧（浪漫喜劇＋穿越＋復仇，可考慮移到韓劇 1）。**介紹時要調整說法 3 部**：惡鬼（靈異恐怖，不是寫實犯罪）、小女子（Wikipedia 是懸疑＋家庭劇）、財閥家的小兒子（重生奇幻＋商戰復仇）。操控遊戲、無赦之仇、模範計程車動作成分重，和韓劇 3 有重疊。
- **台灣串流風險**：
  - **授權劇、最新台灣證據在 2023 年或更早**：**秘密森林（2020 亞洲頻道預告；agentm 內文寫於 2020）**、**小女子（2022 亞洲頻道預告、udn 2022）**。兩者 JustWatch TW 2026-11-08 仍列 Netflix，但 JustWatch 只算線索，需台灣裝置確認。
  - Netflix 原創、證據較舊：黑暗榮耀（2022）、假面女郎（2023）。原創劇下架風險低，但官方頻道證據是 Asia zh 頻道，不是台灣頻道。
  - 惡之花：HBO Max 已確認；Netflix 只有 JustWatch。
  - 善意的競爭：Hami 服務頁 + Netflix（2025 台灣媒體）都有。
  - 信號續作《두번째 시그널》的台灣平台**還沒查**；第 1 季在 Netflix（2026-09 台灣媒體）。

## 無法查證的事實

1. 假面女郎、操控遊戲、無赦之仇、血謎拼圖、暴風圈、財閥家的小兒子的**韓國播出分級**：韓文維基沒有分級欄，只有 IMDb Certifications（使用者可編輯；血謎拼圖、財閥家的小兒子還標 self-applied）。沒有查 나무위키。
2. 模範計程車韓國分級：韓文維基 15 加「本播與夜間重播 19」的註記，沒寫是哪幾季哪幾集；IMDb 寫 19。無法確定每季的正式分級。
3. 黑暗榮耀、假面女郎、惡鬼、無赦之仇、你旁觀的罪的 Parents Guide 類別是依頁面順序推定（jina 沒回傳類別標題）；假面女郎、你旁觀的罪已用 Exa 快取對上類別，你旁觀的罪快取的票數比 jina 舊（例如 Sex & Nudity 7/11 vs. 10/18），表內用 jina 較新的數字。你旁觀的罪的台灣分級沒有讀到。
4. 暴風圈集數：英文維基、MDL 寫 9 集，韓文維基寫 8 集，未找到官方來源核對。
5. 模範計程車 S4：只有 wikitree 搜尋摘要寫「尚未官方確認」（snippet）；粉絲社群與部落格的「確定製作」說法沒有官方出處，未採用。
6. 善意的競爭續作《페어플레이》：只有 MDL 條目（read），製作是否已官方確認、播出平台與日期都沒有查到。
7. 信號續作集數：韓文維基寫 8 集，但該條目播出日期仍寫「미정」，可能未更新；聯合新聞沒寫總集數。
8. 無赦之仇原作 *Plaza Wars: Mercy for None* 的形式（網漫或其他）：讀到的 Wikipedia 段落沒寫。
9. 操控遊戲原作電影的中文片名《偽造都市》、你旁觀的罪原作 2016 年日劇版：背景知識，未查證。善意的競爭原作者的中文姓名是音譯。
10. 財閥家的小兒子 `A IntlEmmy TVMovie/Mini nom 2023*`：awards 檔自己標註典禮年份由正則推定，需回 Wikipedia 表格核對。`E Good Data 週榜 #1` 在 ratings 檔標為 snippet。
11. RT：惡鬼、善意的競爭沒有查；`karma` 頁無法確認是本劇；惡之花、秘密森林、惡中之惡、財閥家的小兒子的 slug 猜測 404，不排除 RT 用別的 slug 收錄。小女子 RT 頁只核對標題「Little Women (2022)」，沒核對演員。
12. 所有 Netflix TW 上架狀態：沒有台灣 IP，netflix.com/tw 頁不是證據（沿用 tw-availability 規則）。

## toolDegradation

- **Groundlane `web_extract`**：英文／韓文 Wikipedia raw、Wikidata SPARQL、MyDramaList（含站內搜尋）、Rotten Tomatoes 都正常。英文維基的 genre 欄多是多行 Plainlist／ubl 夾大量 `<ref>`，第一版 pattern（`genre\s*=([\s\S]{0,300}?)\n\s*\|`）對 Mask Girl、Revenant、Flower of Evil 抓不到，改成直接取 `genre\s*=` 後 400–1,600 字元再人工讀；Stranger、The Manipulated 的 genre 仍只拿到開頭，改用導言判斷。模範計程車 `{{Series overview` 大小寫不同，第二次用 `[Ss]eries overview` 才抓到。
- **英文維基條目名**：第一輪 18 個猜測有 6 個不存在、3 個導到消歧義頁（Signal、Flower of Evil、Karma），第二輪才全部找到。
- **IMDb 標題頁**：沿用韓劇 1 的做法，直接用 Exa `web_fetch_exa`（cache，18/18 成功；Groundlane 在韓劇 1 只拿到機器人頁，這次沒再試）。
- **IMDb Parents Guide**：jina `read_url`（無 key）18/18 有回應；其中 5 頁（黑暗榮耀、假面女郎、惡鬼、無赦之仇、你旁觀的罪）回傳精簡版，缺類別標題，假面女郎、惡鬼、你旁觀的罪也缺認證區塊。jina 沒有 API key，每次都回全文。假面女郎、你旁觀的罪改用 Exa `web_fetch_exa` 補（cache；你旁觀的罪的認證區塊在快取中被截斷）。
- **Groundlane `web_search`**：Tavily、Exa 兩個後端回報 unavailable，結果來自 Brave／You.com。只用於信號續作、模範計程車 S4 兩個狀態查詢；信號續作再用 Groundlane `web_fetch` 讀聯合新聞原文（read）。
- **Rotten Tomatoes**：4 個 slug 猜測 404（回首頁）。`karma` 這種通用 slug 會對到別的作品，要用演員名核對；`tempest` 已用演員名核對是本劇。
- **沒有使用**：Tavily MCP（限流）、Firecrawl（額度用完）、나무위키（本輪沒有需要補的關鍵欄位，未嘗試）、終端機 curl（環境封鎖）。
