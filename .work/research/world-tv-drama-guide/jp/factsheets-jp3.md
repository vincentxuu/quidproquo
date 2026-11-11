# 日劇 3 事實表：職人、家庭與時代劇（16 部）

- 查核日：2026-11-11。順序照 `post-jp3-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取或搜尋摘要裡的頁面內容（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。這輪 16 部沒有遇到業配標示。
- **兩個「只算一次」的規則**（同 jp2）：
  - ratings 檔 §5：VR23／VR24／VR25、VRR、ドラマン（DRM）都是 Video Research 關東資料。同一部劇同時有 VR 與 DRM tag 時，D 類只算一個家族，下面把同家族的 tag 並列在同一個括號裡。TVer 各年（TVA24、TVA25）是另一個家族（TVer 總再生數）。
  - fans 檔 §4：PTT 使用者 pemberley 連寫多年回顧（S3 2025、S5 2024、S6 2023），同一部劇被他多篇提到時只算一聲。本篇只有**海中沉睡的鑽石**同時出現在 S5（2024 回顧）與 S3（2025 回顧），已合併。
- **欄位 4 分級要分三層看**：
  1. 日本電視劇**沒有統一分級**，無線台與 NHK 播出不標年齡。本篇只有《宛如阿修羅》是串流原創（Netflix）。
  2. 台灣平台頁分級：`tw-availability` 檔對本篇 16 部**都沒有記錄**平台頁分級（該檔只記了噬亡村 Disney+ 18+ 一筆），這輪也沒有另外抓（沒有台灣 IP，Netflix 頁不算證據）。
  3. IMDb Certifications 的 Japan／Taiwan 列是**使用者可編輯**資料，只算旁證。IMDb Parents Guide 是使用者投稿與投票，不是官方分級；嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。
- **Parents Guide 幾乎是空的**：16 部裡只有**宛如阿修羅**（Netflix 原創）有投票（每類 4–6 票）。其餘 15 部五類全是「No voting data」；東大特訓班有 1 則投稿但沒有投票。
- **欄位 5 RT**：只有宛如阿修羅有 Rotten Tomatoes 頁（Tomatometer 100%／21 則影評，觀眾 91%、少於 50 人）。其他 15 部是無線台／NHK 劇，沒有查 RT。
- **欄位 5 Filmarks**：從 Filmarks 站內搜尋結果頁讀到 ★ 平均分（read），**Mark 數沒有讀到**（同 jp2，前端渲染）。同名作品（阿修羅のごとく 1979／2025、あんぱん 韓國劇／2025 朝ドラ）用搜尋結果的「公開日」與製作國分開。

## 這份資料的限制

1. **日劇在國際評分網站的樣本很小**，本篇比 jp2 更明顯。兩部大河劇在 MDL 只有 19 人（大膽狂徒）、69 人（致光之君）評分，IMDb 只有 19 票、60 票；晨間劇紅豆麵包 MDL 138 人、IMDb 27 票。春暖花開的那一天 IMDb 27 票、對岸的家事 21 票、119 緊急呼叫 29 票。這些分數幾乎不能拿來跨劇比較。票數最多的是 IMDb 東大特訓班（2.1K，2005＋2021 兩季合併成一個條目）、宛如阿修羅（2K）、型男主廚三星夢（1.5K）。
2. **NHK 晨間劇、大河劇在國際評分站被嚴重低估**：日本國內的大河劇、晨間劇觀眾量很大，但 MDL／IMDb 的評分人數極少。日本國內只查了 Filmarks ★，沒有查 Yahoo!テレビ、みんなの感想等站；Filmarks 也只讀到平均分、沒有 Mark 數。
3. **分級沒有官方統一來源**。台灣平台頁分級 tw-availability 一筆都沒記到本篇的劇；IMDb 的 Japan 列（派遣女醫X「7+ streaming」、春暖花開「13+ streaming」、宛如阿修羅「PG12」）與 Taiwan 列（宛如阿修羅「12+」）都是使用者填的，不要直接寫進文章。
4. **劇情欄**：有英文維基條目的 7 部（Unmet、派遣女醫X、型男主廚、東大特訓班、紅豆麵包、大膽狂徒、致光之君）優先用英文維基；其餘用日文維基「あらすじ」（read）。御上老師、119 緊急呼叫、對岸的家事的日文維基「あらすじ」是空的（`{{要あらすじ}}`），劇情改用日文維基人物設定（read）加 IMDb／MDL 簡介（cache），已在各劇註明。
5. **IMDb 分數來源混雜**：一半讀到 IMDb 頁（jina `read_url`，read），一半是 Exa 快取或 Exa 搜尋結果裡的頁面內容（cache）。Exa `web_fetch_exa` 這輪多次 `CRAWL_LIVECRAWL_TIMEOUT`。各劇已標明。
6. **台灣串流沒有台灣 IP 驗證**（沿用 tw-availability 的規則）。
7. **候選 tag 偏誤**：A/B 類偏好 TBS／NHK 與關西テレビ的作品；G 類受平台獨家影響（friDay、KKTV 榜單只反映自家用戶）；DailyView 是聲量不是好評（派遣女醫X 負評 33%）。merge.py 沒有把 awards 檔的「ロイヤルファミリー」（EC2025）和 ratings／fans 檔的「ザ・ロイヤルファミリー」合併，本篇判斷是同一部並補進 B 類，已註明。
8. **兩部近期有續作消息**：Unmet 第 2 季（2027 年 1 月期）、119 緊急呼叫 SEASON2（2027 年 4 月期），都只來自日文維基 infobox 與其引用的新聞（read 維基；新聞本身沒有另讀）。
9. **類型核對**：16 部裡 13 部可直接放進「職人、家庭與時代劇」；**御上老師**偏社會派校園劇、**東大特訓班2**是校園升學劇，算在「職人」的教師職業劇勉強可以；**對岸的家事**是家事／育兒的生活劇，放「家庭」可以。見各劇「類型核對」與文末總結。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播／完結日、電視台、時段、片長、原作、特別篇、電影版、續季 | 日文 Wikipedia wikitext（`action=raw`），抽 `基礎情報 テレビ番組` 的 `ジャンル`／`原作`／`脚本`／`放送期間N`／`放送時間N`／`放送枠N`／`放送分N`／`放送回数N`／`ヘッダN`，電影抽 `作品名`／`公開` | Groundlane `web_extract`（pattern, group 0） | read（16/16）。條目名要注意：アンメット 轉址到原作漫畫條目 `アンメット-ある脳外科医の日記-`；ドクターX 用波浪號 `〜`；ドラゴン桜 是 `ドラゴン桜 (テレビドラマ)`；春になったら 是 `春になったら (テレビドラマ)`；対岸の家事 是原作小說條目內的「テレビドラマ」段；あんぱん 是 `あんぱん (2025年のテレビドラマ)`（`(連続テレビ小説)` 404，用 prefixsearch 找到）；阿修羅のごとく 是 1979 年原作劇條目內的「Netflix」段 |
| 英文條目對應、Wikidata ID | MediaWiki API `prop=langlinks|pageprops` | Groundlane `web_fetch` | read |
| 劇情、genre | 英文 Wikipedia wikitext：`Unmet:_A_Neurosurgeon's_Diary`、`Doctor-X:_Surgeon_Michiko_Daimon`、`La_Grande_Maison_Tokyo`、`Dragon_Zakura_(TV_series)`、`Anpan_(TV_series)`、`Unbound_(TV_series)`、`Dear_Radiance` | Groundlane `web_extract` | read（7 個條目；其餘 9 部沒有英文條目） |
| IMDb ID | Wikidata SPARQL（P345）；缺的 5 部（Unmet、119、榮耀家族、對岸的家事、宛如阿修羅 2025）用 Exa 搜尋 | Groundlane `web_fetch`／Exa `web_search_exa` | read／cache |
| MDL ID、分數與評分人數 | MDL 站內搜尋 `mydramalist.com/search?q=` 取連結；作品頁 `Ratings: <b>X</b>/10 from N users` | Groundlane `web_extract`（render=never） | read（16/16；派遣女醫X 7 季分開讀） |
| IMDb 評分與票數 | IMDb 標題頁或 `/ratings/` 頁 | jina `read_url`（read）／Exa `web_fetch_exa`、`web_search_exa`（cache） | 見各劇 |
| Parents Guide 五類別 + 各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文） | read（16/16；新宿野戰醫院第一次 30 秒逾時，重試成功）。Groundlane 讀 IMDb 只回 1,997 bytes 空殼 |
| Filmarks ★ | `filmarks.com/search/dramas?q=<日文名>`，選取 `h3.p-content-cassette__title` 與 `.p-content-cassette__rate .c-rating__score`；同名作品另抽卡片的「公開日」 | Groundlane `web_extract` | read（16/16 找到條目；Mark 數沒讀到） |
| Rotten Tomatoes | `rottentomatoes.com/tv/asura`，選取 `rt-text[slot=critics-score]`、`rt-link[slot=critics-reviews]`、`rt-text[slot=audience-score]` | Groundlane `web_extract` | read（頁面簡介與導演欄確認是是枝版） |

---

## 1. Unmet: A Neurosurgeon's Diary

1. **片名**：**Unmet－某腦外科醫的日記－**（LINE TV）；Hami 寫作 Unmet–某腦外科醫的日記–（tw-availability-1）／アンメット ある脳外科医の日記／*Unmet: A Neurosurgeon's Diary*
2. **劇情**：一名腦外科醫師因事故腦部受傷，無法形成新記憶，只能做護理助手；一位古怪的醫師幫她找回手術能力，也揭開她失去的記憶。英文維基 Synopsis：「A neurosurgeon suffers a brain injury in an accident and develops progressive amnesia, meaning she is no longer able to form new memories. She now works as a nurse until a strange doctor helps her uncover the secrets of her past and regain her surgical skills.」來源：https://en.wikipedia.org/wiki/Unmet:_A_Neurosurgeon%27s_Diary （read）
3. **季數與狀態**：關西テレビ制作・フジテレビ系「月曜22時枠」（週一 22:00–22:54，54 分鐘）（日文維基，read）。
   - 第 1 季：11 集，2024-04-15 到 06-24。關西テレビ英文目錄頁寫「#1:69min, #2-#11: 54min」（Exa 搜尋結果裡的 ktv.jp 頁，cache）。
   - **第 2 季：2027 年 1 月期起同枠播出（預定）**。日文維基 infobox「放送期間2 = 2027年1月 - （予定）」，導言引 Real Sound〈『アンメット』続編、2027年1月期放送決定〉與映画ナタリー 2026-11-04〈杉咲花主演ドラマ「アンメット」続編決定〉（維基 read；兩篇新聞沒有另讀）。MDL 已有「Season 2」條目（2027，未評分）。
   - 第 1 季已完結。
   - 來源：https://ja.wikipedia.org/wiki/アンメット-ある脳外科医の日記- （read）
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Hami／LINE TV 頁分級。
   - IMDb Certifications（使用者可編輯）：**沒有任何國家的資料**（「don't have any certifications」）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32662383/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：醫療劇，有腦外科手術場面（題材本身，判斷）；主角有記憶障礙。投稿空白，沒有可引用的內容提醒。
5. **觀眾評分**：MDL **8.4**（1,216 人，https://mydramalist.com/765129-unmet-aru-nogekai-no-nikki ，read）；IMDb **7.7**（138 票，`/ratings/` 頁，read；Groundlane 搜尋摘要另寫 7.8，以 read 為準）；Filmarks ★**4.4**（read，本篇與海中沉睡的鑽石並列最高）。RT：沒有查。
6. **推薦 tag**：
   - A：DA best 2024Q2（#120）；TDA 優秀 2024；Minpo 最優秀 2025
   - B：RS2024 4/5（田幸 #5、麦倉 #6、明日 #7、藤原 #1）
   - C：MDL #30 8.4；Filmarks Awards 2024 TVドラマ nominee
   - D：VR24 TS #20 7.2%（最終回）
   - F：PTT 2024 推薦「春季王者，完全橫掃」＋推文 1（episold）；PTT 2024 回顧 #1「今年最愛」（pemberley）
   - G：KKTV 2024 K劇大賞 改編劇本／女主角／主題曲／最愛 CP／名場面、熱播 #6
   - （不計：Galaxy-indiv 2024年度 杉咲花，awards 檔規則個人賞不計。）
7. **前置作品**：**改編漫畫**（原作 子鹿ゆずる、作畫 大槻閑人，講談社《モーニング》連載，全 17 卷）（日文維基，read）。不必先看漫畫（判斷）。2027 年第 2 季接第 1 季，**看續季前要先看第 1 季**（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/257957.do?cs=2 (下架時間 2027-04-15). LINE TV: https://www.linetv.tw/drama/18198/eps/1. — 證據：Both pages loaded on 2026-11-09 with the title; no lapse notice on LINE TV. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Medical drama（read）；日文維基 `ジャンル = 連続ドラマ / 医療ドラマ`。**符合本篇（職人：醫療）**。

## 2. Doctor-X（系列）

1. **片名**：**派遣女醫X**（friDay 頁；zh-Wikipedia 台灣譯名）（tw-availability-1）／ドクターX〜外科医・大門未知子〜／*Doctor-X: Surgeon Michiko Daimon*（英文維基）；IMDb 寫 *Doctor X*
2. **劇情**：自由接案的外科醫師大門未知子在各大學醫院之間接案動刀，不屬於任何醫局。英文維基 Plot：「The show follows Daimon Michiko, a freelance surgeon who works at university hospitals in Japan.」導言：「a Japanese medical drama that premiered in October 2012 on TV Asahi. It stars Japanese actress Ryoko Yonekura.」來源：https://en.wikipedia.org/wiki/Doctor-X:_Surgeon_Michiko_Daimon （read）
3. **季數與狀態**：テレビ朝日「木曜ドラマ」（週四 21:00–21:54，54 分鐘），共 **7 季 69 集**＋單集特別篇＋電影，**系列已完結**（日文維基 infobox，read）。
   | 季 | 播出期間 | 集數 |
   |---|---|---|
   | 第 1 期 | 2012-10-18 到 12-13 | 8 |
   | 第 2 期 | 2013-10-17 到 12-19 | 9 |
   | 第 3 期 | 2014-10-09 到 12-18 | 11 |
   | 第 4 期 | 2016-10-13 到 12-22 | 11 |
   | 第 5 期 | 2017-10-12 到 12-14 | 10 |
   | 第 6 期 | 2019-10-17 到 12-19 | 10 |
   | 第 7 期 | 2021-10-14 到 12-16 | 10 |
   - 特別篇：2016-07-03（日曜 21:00–23:10，130 分鐘）、2018-09-30（日曜 21:00–23:14）；2024-12-06（金曜 20:00–21:54）是「劇場版公開記念」特別編（日文維基，read）。
   - **電影《劇場版ドクターX FINAL》**：2024-12-06 上映。日文維基：「第7シリーズ放送から3年後の2024年12月に、初の劇場作品『劇場版ドクターX FINAL』が公開され、この作品をもってシリーズは完結した」，引 ORICON 2024-10-08〈『ドクターX』劇場版で12年にわたるシリーズ完結へ〉（read）。
   - 另：2026 年韓國有同名但無關的韓劇《Doctor X: Age of the White Mafia》（MDL 搜尋結果），Filmarks 也有「ドクターX ～白衣のマフィア～」★3.8，寫文時不要混。
   - 來源：https://ja.wikipedia.org/wiki/ドクターX〜外科医・大門未知子〜 （read）
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 friDay 頁分級。
   - IMDb Certifications（使用者可編輯）：**Japan 7+ streaming**；沒有 Taiwan 列；South Korea 15、Singapore PG13、India 13 self-applied、US Not Rated（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt2349912/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：外科手術畫面是每集固定內容（判斷）；黃金時段無線台醫療劇。
5. **觀眾評分**：MDL S1 **8.2**（2,920 人）、S2 **8.2**（2,024）、S3 **8.3**（1,599）、S4 **8.2**（1,134）、S5 **8.3**（954）、S6 **8.1**（657）、S7 **7.9**（444）（皆 read；網址 https://mydramalist.com/5432-doctor-x 、/7974-doctor-x-2 、/11107-doctor-x-3 、/19140-doctor-x-4 、/24623-doctor-x-5 、/37253-doctor-x-6 、/700881-doctor-x-7 ）；IMDb **7.5**（1K，系列合併，cache；ratings 檔 2026-11-09 記 7.6／1.1K）；Filmarks 第 1–6 シリーズ ★**4.1**、第 7 シリーズ ★**4.0**、2016 スペシャル ★**4.0**（read）。RT：沒有查。
6. **推薦 tag**：
   - C：IMDb 7.6（1.1K）
   - D：VR 家族（VRR 總合 #5 最終回 31.0%〔2019〕；DRM 年間平均 #1：2012 18.9%、2014 22.8%、2016 21.5%、2017 20.7%、2019 18.4%、2021 16.4%）——同屬 Video Research，算一次
   - F：PTT〈日劇入坑作是哪部?〉2 人寫 Doctor X
   - G：DailyView 2026-10 月榜 #1（1～7 季，**負評 33%**，聲量不等於好評）
   - （沒有 A/B 類；merged 檔 CDFG。）
7. **前置作品**：**原創劇**（`原作 =` 空白，read）。單元劇形式，**可以從任何一季開始**；電影 FINAL 是完結篇，要看過前作才有感（判斷）。
8. **台灣串流**：friDay影音 (影劇), with seasons as separate pages: S1 https://video.friday.tw/drama/detail/2091, S4 https://video.friday.tw/drama/detail/2094, S5 https://video.friday.tw/drama/detail/2095, S6 https://video.friday.tw/drama/detail/1052. S2/S3 are listed in friDay's catalogue filter. S7 (2021) was on friDay (friDay article https://video.friday.tw/article/9/1438) and Hami (product 177046); neither was rechecked. — 證據：S1 and S6 pages loaded on 2026-11-09 with the title; the S4 page showed 「適用方案：影劇」 via Exa. — **confirmed (service page; S1–S6)**（tw-availability-1）
   - **台灣能看哪幾季**：S1、S4、S5、S6 有 friDay 單季頁（S1、S6 頁面 2026-11-09 載入；S4 經 Exa）；S2、S3 只出現在 friDay 目錄篩選；**S7 沒有重新確認**；電影 FINAL 不在 tw-availability 範圍。寫文時寫「friDay 有第 1–6 季」，S7 另查。
- **類型核對**：日文維基 `ジャンル = 医療ドラマ`；英文維基導言 medical drama（read）。**符合本篇（職人：醫療）**。

## 3. 新宿野戦病院

1. **片名**：**新宿野戰醫院**（Hami 頁；tw-availability-1）／新宿野戦病院／英文 *Shinjuku Field Hospital*（Wikidata 英文標籤、MDL 頁名；沒有官方英文名出處）
2. **劇情**：新宿歌舞伎町一家老舊、被戲稱「新宿野戰醫院」的「聖まごころ病院」，來了一位講岡山腔英語、當過軍醫的美籍外科醫師ヨウコ（小池榮子），她沒有日本醫師執照，卻被院長硬留下來；醫院面對各種有難言之隱的病患。日文維基あらすじ：「岡山弁混じりの英語を喋る謎の女ヨウコ・ニシ・フリーマンが、軍医として本物の野戦病院を経験した凄腕の外科医であることが判明し…ヨウコが日本の医師免許を持っていないという問題を握り潰し、半ば強引に聖まごころ病院に雇い入れる」。來源：https://ja.wikipedia.org/wiki/新宿野戦病院 （read；沒有英文維基條目）
3. **季數與狀態**：1 季 11 集，フジテレビ「水曜22時枠」，2024-07-03 到 09-11（週三 22:00–22:54，54 分鐘），宮藤官九郎原創劇本（日文維基，read）。**已完結**；日文維基 infobox 只有這一輪播出，沒有續作欄。IMDb 標成「2024–」（cache），但沒有讀到續季消息。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Hami 頁分級。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32731577/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：IMDb 簡介（cache）寫角色包含「hosts, hostesses, homeless, Tokoyoko kids, and refugees」；舞台是歌舞伎町，有急性酒精中毒、手術等場面（日文維基あらすじ，read）。具體尺度沒有來源。
5. **觀眾評分**：MDL **7.6**（306 人，https://mydramalist.com/770539-shinjuku-yasen-byoin ，read）；IMDb **6.9**（138 票，cache）；Filmarks ★**3.8**（read）。RT：沒有查。
6. **推薦 tag**：
   - C：Filmarks Awards 2024 TVドラマ nominee
   - D：VR24 總合 #8 17.9%；TS #3
   - F：PTT 2024 回顧 正評「有夠鬧」（pemberley）＋nacheong17 前三；PTT 2024 推薦 推文 正 4／負 2（原 PO episold 第 5 集棄劇）——褒貶互見
   - G：KKTV 2024 熱播 #3
7. **前置作品**：**原創劇**（宮藤官九郎，`原作 =` 空白，read）。不必先看任何作品。
8. **台灣串流**：Hami Video: https://hamivideo.hinet.net/product/265696.do?cs=2 (下架時間 2027-07-03). It was on KKTV in 2024 but is not on LINE TV's move list. — 證據：The Hami page loaded on 2026-11-09 with the title. 電影神搜 2024-07-08 named KKTV, MOD and Hami. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；ratings 檔標「medical comedy」；IMDb genre Medical Drama（cache）。**符合本篇（職人：醫療，喜劇色彩重）**。

## 4. 119エマージェンシーコール

1. **片名**：**119緊急呼叫**（tw-availability-2；Hami 英文名 119 Emergency Call）／119エマージェンシーコール／*119 Emergency Call*
2. **劇情**：橫濱市消防局司令課的指令管制員，接聽 119 通報、判斷狀況並調派救護車與消防車。日文維基人物欄：主角粕原雪「横浜市消防局司令課3係の指令管制員…前職は港南銀行職員。通報を受け気になった現場には、退勤後に出向いて通報時の様子を想像して検証する」（read；日文維基あらすじ是空的 `{{要あらすじ}}`）。IMDb 簡介（cache）：「Yuki Kasuhara is a command and control officer in Section 3 of the Yokohama City Fire Department's Command Section. She used to work in a bank」。來源：https://ja.wikipedia.org/wiki/119エマージェンシーコール （read）
3. **季數與狀態**：フジテレビ「月9」（週一 21:00–21:54，54 分鐘）（日文維基，read）。
   - 第 1 季：11 集，2025-01-13 到 03-31。
   - 特別篇《119エマージェンシーコール2026 YOKOHAMA BLACKOUT》：2026-01-03（週六 21:30–23:40，130 分鐘，1 集）。
   - **SEASON2：2027 年 4 月起同枠（預定）**（infobox「放送期間2 = 2027年4月 - （予定）」，read；MDL 也有 2027 條目）。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 friDay／Hami 頁分級。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35433979/parentalguide/ ）：**五類都沒有投票**（摘要寫「not yet rated」）。
   - 需要提醒：通報內容包含火災、事故與急救（題材本身，判斷）；投稿空白。
5. **觀眾評分**：MDL **7.7**（303 人，https://mydramalist.com/780936-119-emergency-call ，read）；IMDb **7.4**（29 票，cache；樣本極小）；Filmarks ★**3.8**、2026 特別篇 ★**3.8**、SEASON2 未評分（read）。RT：沒有查。
6. **推薦 tag**：
   - D：VR25 總合 #11 14.7%（ratings 檔第 184 列，6 部合併的一列）
   - F：PTT 2025 回顧 遺珠「冬季檔第二喜歡」（pemberley）
   - G：ELLE TW 2025 日劇推薦 #9（**預告片單，不是年度回顧**；fans 檔 S23 partial）
   - （merged 檔 DFG 3 類，是本篇證據最薄的一部；沒有 A/B/C。）
7. **前置作品**：**原創劇**（`原作 =` 空白，脚本 橋本夏、小柳啓伍，read）。2026 特別篇與 2027 SEASON2 接第 1 季（判斷）。
8. **台灣串流**：friDay影音 (free or 影劇): https://video.friday.tw/drama/detail/3893. Hami Video: https://hamivideo.hinet.net/product/283797.do?cs=2. Also the 2026 special 「119緊急呼叫－2026橫濱大停電－」 on Hami: https://hamivideo.hinet.net/product/314648.do?cs=2 (全2集). — 證據：Both title pages loaded on 2026-11-09. friDay shows 「適用方案：免費／影劇」, 「全11集」. LINE TV's KKTV migration list (2026-01-22) also names 119緊急呼叫; no LINE TV page was checked. — **confirmed (service page)**（tw-availability-2）
   - 注意：日本播出的特別篇是 1 集 130 分鐘，Hami 上分成「全2集」（tw-availability-2 記錄），兩者不矛盾。
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；IMDb 把它歸在 action series（parentalguide 頁摘要，read）；Prime Video 頁標 Action／Drama／Suspense（cache）。**符合本篇（職人：消防指令員）**。

## 5. グランメゾン東京

1. **片名**：**型男主廚三星夢**（LINE TV／friDay／Hami 頁；tw-availability-1）／グランメゾン東京／*La Grande Maison Tokyo*
2. **劇情**：在巴黎拿過米其林二星、因事件身敗名裂的主廚尾花夏樹（木村拓哉），和女主廚早見倫子在東京合開新餐廳「グランメゾン東京」，目標三星。英文維基 Premise：「Japanese chef Natsuki Obana trained at the restaurant L'Ambroisie in Paris…opened his own restaurant Escoffille in Paris and won two stars from Michelin Guide」，之後在日法高峰會午宴事件中被捕、失去餐廳。日文維基：「東京で自分たちの新しいレストラン『グランメゾン東京』を開店させ、三つ星獲得を目指して動き出す」。來源：https://en.wikipedia.org/wiki/La_Grande_Maison_Tokyo 、https://ja.wikipedia.org/wiki/グランメゾン東京 （皆 read）
3. **季數與狀態**：TBS「日曜劇場」（週日 21:00–21:54，54 分鐘）（日文維基，read）。
   - 連續劇：11 集，2019-10-20 到 12-29。**已完結**。
   - 衍生網路劇《グラグラメゾン♥東京〜平古祥平の揺れる思い〜》：11 集，2019-10-21 到 12-30。
   - **特別篇**：2024-12-29（21:00–23:05，125 分鐘）。
   - **電影《グランメゾン★パリ》**：2024-12-30 上映（日文維基 infobox `公開`，read）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Japan、Taiwan 列；Singapore PG13、UK 12（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt10845290/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：沒有可引用的內容提醒；料理職人劇（判斷）。
5. **觀眾評分**：MDL **8.3**（1,482 人，https://mydramalist.com/36289-nichiyo-gekijo ——MDL 網址 slug 是 nichiyo-gekijo，頁名是 La Grande Maison Tokyo，read）；IMDb **7.8**（1.5K，read）；Filmarks ★**4.2**、スペシャル ★**3.9**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：DA best 2019Q4（#103）
   - C：IMDb 7.8（1.5K）；MDL #50 8.3
   - D：VRR 總合 #9 最終回 26.3%；TS #4 14.3%
   - F：PTT 2025 回顧「SP 看了兩次＋連續劇重刷」（pemberley）
   - G：Netflix TW Top 10 2024-09-22 #6、09-29 #7（累計 5 週）；ELLE TW 2025 預告片單 #4（特別篇；預告片單）
7. **前置作品**：**原創劇**（脚本 黒岩勉，`原作 =` 空白，read）。**要看 2024 特別篇與電影《グランメゾン★パリ》，先看 2019 連續劇**（判斷）。
8. **台灣串流**：Series: LINE TV https://www.linetv.tw/drama/21217/eps/1 (moved from KKTV). Special: friDay https://video.friday.tw/drama/detail/3888 and Hami https://hamivideo.hinet.net/product/282762.do?cs=2 (下架時間 2027-01-06). Netflix TW page 81918362 is indexed (lead). — 證據：All three pages loaded on 2026-11-09 with the title. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Japanese television drama；ratings 檔標 culinary drama；IMDb genre Drama／Family（read）。**符合本篇（職人：主廚）**。

## 6. ザ・ロイヤルファミリー

1. **片名**：**榮耀家族**（friDay／LINE TV 頁；tw-availability-1）／ザ・ロイヤルファミリー／英文 *Passing the Reins*（IMDb、MDL、TBS 國際目錄 tbscontents.com；Wikidata 英文標籤寫 The Royal Family）
2. **劇情**：分兩部。1997 年，喪父後失意的稅理士栗須榮治被人力派遣公司社長、賽馬馬主山王耕造收為秘書；耕造的夢想是讓冠名「ロイヤル」的馬贏下有馬紀念，栄治陪他追夢二十年。日文維基あらすじ：「本作は2部構成となっている」「（耕造の）夢があった。それは中央競馬の馬主として『ロイヤル』冠の馬で有馬記念を制覇すること」。TBS 國際目錄（cache）：「An epic, 20-year story of miracles and the unbreakable bonds between family, friends and horses.」來源：https://ja.wikipedia.org/wiki/ザ・ロイヤルファミリー （read）
3. **季數與狀態**：1 季 10 集，TBS「日曜劇場」，2025-10-12 到 12-14（週日 21:00–21:54，標準 54 分鐘）（日文維基，read）。**已完結**。TBS 國際目錄寫國際版「75min × 3eps, 60min × 7eps」（cache），即有延長集。沒有讀到續作消息。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 friDay／LINE TV 頁分級。
   - IMDb Certifications（使用者可編輯）：沒有 Japan、Taiwan 列；Argentina 13、Singapore PG、South Korea 15（2025, self-applied）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt38629276/parentalguide/ ）：**五類都沒有投票**（「not yet rated」）。
   - 需要提醒：沒有可引用的內容提醒；賽馬題材（判斷）。
5. **觀眾評分**：MDL **7.8**（288 人，https://mydramalist.com/798582-the-royal-family ，read；頁名 Passing the Reins）；IMDb **7.6**（159 票，cache）；Filmarks ★**4.1**（read；同一搜尋頁另有一部「ロイヤルファミリー」★3.5，不是本劇）。RT：沒有查。
6. **推薦 tag**：
   - B：EC2025（まっつ top 5）——awards 檔寫作「ロイヤルファミリー」2025 TBS，merge.py 沒有與本劇合併（merged 檔 #264 另列）；本篇判斷是同一部，**未經來源確認**
   - D：VR 家族（VR25 總合 #3 最終回 18.5%；DRM 2025-10 cour #1 10.6%）——算一次
   - E：ORICON 2025 満足度 #7（3.49）
   - F：PTT 2025 回顧 原 PO #1＋另 2 人推文前五（pemberley）；PTT 2025 秋季推薦 #5＋推文「值得 6 星」（Roy34）；PTT 2025 推薦「不錯」但原 PO「get 不到」（episold）
   - G：VERSE 2025 必看十部（編輯精選）
7. **前置作品**：**改編小說**（原作 早見和真『ザ・ロイヤルファミリー』，read）。不必先讀原作（判斷）。
8. **台灣串流**：friDay影音 (影劇): https://video.friday.tw/drama/detail/4327. LINE TV: https://www.linetv.tw/drama/21239/eps/1 (moved from KKTV). Netflix also carried it (換日線; no ID found). — 證據：Both pages loaded on 2026-11-09 with the title. 換日線, 2025-10-22 (https://crossing.cw.com.tw/article/20270): 「《榮耀家族》，Netflix、KKTV、friDay 影音跟播」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；MDL genre Business／Drama／Family／Sports（cache）；ratings 檔標 horse-racing family saga。**符合本篇（家庭／職人：馬主與秘書）**。

## 7. 御上先生

1. **片名**：**御上老師**（friDay／Hami 頁；tw-availability-1）／御上先生／*Mr. Mikami's Classroom*（MDL 頁名；Wikidata 寫 Mr.Mikami's Classroom）；IMDb 寫 *Mikami sensei*
2. **劇情**：東大畢業的文部科學省官僚御上孝（松坂桃李），透過官僚派遣制度被派到私立高中當高三班導，從教育現場挑戰權力。日文維基人物欄：「東大卒の文科省官僚。官僚派遣制度によって私立高校への出向が命じられ、3年2組の担任となった」（read；あらすじ欄是空的）。IMDb 簡介（cache）：「Takashi Mikami, a Tokyo University graduate, joins the Ministry of Education to reform Japan's education system…and challenges authorities.」來源：https://ja.wikipedia.org/wiki/御上先生 （read）
3. **季數與狀態**：1 季 10 集，TBS「日曜劇場」，2025-01-19 到 03-23（週日 21:00–21:54，54 分鐘）（日文維基，read）。**已完結**。另有短篇衍生劇《御上先生には内緒。》7 集（2025-01-20 到 03-17，週一 18:00 起）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Japan、Taiwan 列；Netherlands 13+ streaming、Singapore PG13（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35477667/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：MDL **7.9**（432 人，https://mydramalist.com/781948-mikami-sensei ，read）；IMDb **7.6**（78 票，cache）；Filmarks ★**3.9**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：DA best 2025Q1（#123）；TDA 優秀 2025
   - C：Filmarks Awards 2025 TVドラマ nominee
   - D：VR25 總合 #2 20.0%（TS #1）；TVerアワード2025 ドラマ優秀賞（TVer 家族，與 VR 分開）
   - E：ORICON 2025 満足度 #2（3.55）
   - F：PTT 2025 推薦「喜歡」＋推文 3（episold）；PTT 2025 回顧 friDay 片段「好看」（pemberley）
   - G：friDay 2025 日劇收視 #8；VERSE 2025 必看十部
   - （已刪：MDL 使用者清單 #4，fans 檔標「弱」。）
7. **前置作品**：**原創劇**（脚本 詩森ろば，`原作 =` 空白，read）。不必先看任何作品。
8. **台灣串流**：friDay影音 (影劇): https://video.friday.tw/drama/detail/3891. Hami Video: https://hamivideo.hinet.net/product/283637.do?cs=2 (下架時間 2027-01-20). — 證據：Both pages loaded on 2026-11-09; friDay shows 「適用方案：影劇／全10集」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；ratings 檔標 school / bureaucracy drama。**部分符合**：主角是官僚兼教師，可歸「職人（教師）」，但劇本主軸是教育體制與政治，偏社會派校園劇。

## 8. ドラゴン桜（2021）

1. **片名**：**東大特訓班2**（Hami, friDay）；Netflix 寫「東大特訓班 2」（tw-availability-2）／ドラゴン桜（第2シリーズ）／*Dragon Zakura*（英文維基）；IMDb 寫 *Dragon Sakura*；MDL 寫 *Dragon Sakura Season 2*
2. **劇情**：第 1 季在龍山高校成功後，前暴走族律師櫻木建二因學生落榜自殺未遂的醜聞消失；他的學生、現在是律師的水野直美，接下千葉私立龍海學園的重建，條件是隔年出 5 名東大合格者，她找回櫻木。日文維基第2シリーズあらすじ：「水野はかつての龍山高校に匹敵する千葉県の私立高校・龍海学園高校から『翌年に東京大学合格者を5名出す。』という条件で、再建を引き受ける…福井県で自堕落な生活をして落ちぶれていた桜木を見つけた水野は、彼を再び教育の場へと連れ出そうとする」。英文維基導言只寫「a Japanese live action television series based on the manga of the same name」。來源：https://ja.wikipedia.org/wiki/ドラゴン桜_(テレビドラマ) （read）
3. **季數與狀態**：TBS（日文維基，read）。
   - 第 1 シリーズ：11 集，2005-07-08 到 09-16，「金曜ドラマ」（週五 22:00–22:54，54 分鐘）。
   - **第 2 シリーズ（本篇對象）**：10 集，2021-04-25 到 06-27，「日曜劇場」（週日 21:00–21:54，54 分鐘）。
   - **已完結**；沒有讀到第 3 季消息。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications（使用者可編輯；IMDb 把 2005、2021 合成一個條目）：只有 Singapore M18（read）。沒有 Japan、Taiwan 列。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt0873992/parentalguide/ ）：**五類都沒有投票**；Alcohol 類有 1 則投稿「A mother of one of the characters is seen drinking with men on multiple occasions」（沒有標是哪一季）。
   - 需要提醒：第 2 季開場有學生自殺未遂的情節（日文維基あらすじ，read）。
5. **觀眾評分**：MDL S2 **8.1**（901 人，https://mydramalist.com/58089-dragon-zakura-2 ，read）；IMDb **7.7**（2.1K，**2005＋2021 合併條目**，read）；Filmarks「ドラゴン桜（2021）」★**3.9**（2005 版也是 ★3.9）（read）。RT：沒有查。
6. **推薦 tag**：
   - A：DA best 2021Q2（#108）
   - C：IMDb 7.7（2.1K；2005＋2021 合併）
   - D：VRR 總合 #4 最終回 28.9%；RT #3 20.4%（VRR 範圍 2019-05 以後，所以是 2021 版）
   - （沒有 F/G 類；merged 檔 ACD。）
7. **前置作品**：**改編漫畫**（原作 三田紀房『ドラゴン桜』與『ドラゴン桜2』，read）。**是 2005 年版的續篇**：櫻木與水野（長澤正美）延續第 1 季角色，水野是第 1 季的學生。可以單看，但看過 2005 版更有感（判斷）。2005 版台灣串流狀態不在 tw-availability 範圍。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81488898 (lead). friDay (https://video.friday.tw/drama/detail/1819) returns HTTP 400 and Hami (https://hamivideo.hinet.net/product/150217.do?cs=2) returns the 404 shell, so it has lapsed on both. — 證據：Nahoko TW (JustWatch data), 2026-11-09, https://nahoko.si/zh/tv/dragon-sakura-2005?country=tw: 「正在Netflix（台湾）播出」. UpToGo (SEO site), 2026-03-19, lists Netflix for S2, but the same table still lists the closed KKTV, so it is unreliable. — **licensed-old (JustWatch-derived only)**（tw-availability-2）
   - 寫文時要標「JustWatch 台灣列出」，不能寫成「確認可看」（split-proposal 的處理方式）。
- **類型核對**：英文維基 genre＝School drama（read）。**部分符合**：律師當升學教練的校園劇，放在「職人（教師／律師）」勉強可以；嚴格說是校園升學劇。

## 9. 海のはじまり

1. **片名**：**海的開始**（tw-availability-2）／海のはじまり／*Where Does the Sea Begin*（MDL 頁名；IMDb 寫 *The Beginning of the Sea*）
2. **劇情**：月岡夏（目黑蓮）得知大學時代的前女友南雲水季過世，在葬禮上遇見女孩「海」，發現她是自己的親生女兒，開始學著當父親。日文維基あらすじ：「彼女の葬儀に赴いた夏は海という少女と出会うがその子が夏の実娘であることが判明。娘の存在を知った夏は父としての役割を果たそうと海と向き合っていく」。來源：https://ja.wikipedia.org/wiki/海のはじまり （read；沒有英文維基條目）
3. **季數與狀態**：1 季，フジテレビ「月9」，2024-07-01 到 09-23（週一 21:00–21:54，54 分鐘）（日文維基，read）。
   - 集數：日文維基 infobox「放送回数 = 13（特別編を含む）」；friDay 頁「全12集」（tw-availability-2）；MDL 12 集＋另列特別篇 1 集；IMDb 12 集。**本篇 12 集＋特別編 1**。
   - 衍生劇：《兄とのはじまり》4 集（2024-07-15 起）、《親子は道半ば》1 集（2024-09-23）。
   - **已完結**，沒有續季消息。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 friDay 頁分級。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32813736/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：題材涉及前女友病逝、單親與親子關係（日文維基，read）；沒有投稿。
5. **觀眾評分**：MDL **8.4**（2,779 人，https://mydramalist.com/769563-umi-no-hajimari ，read；本篇 MDL 人數最多的單季劇）；IMDb **8.0**（297 票，cache）；Filmarks ★**3.8**、衍生劇《兄とのはじまり》★4.2（read）。RT：沒有查。
6. **推薦 tag**：
   - B：RS2024 3/5（麦倉 #9、成馬 #3、藤原 #10）
   - C：MDL #31 8.4；Filmarks Awards 2024 TVドラマ nominee
   - D：VR24 總合 #10 16.8%（TS #5）；TVerアワード2024 ドラマ大賞（總再生 7,200 萬以上）——VR 與 TVer 是兩個家族
   - （沒有 F/G 類；merged 檔 BCD。）
7. **前置作品**：**原創劇**（脚本 生方美久，`原作 =` 空白，read）。不必先看任何作品；同編劇有《silent》（判斷，不是前作）。
8. **台灣串流**：friDay影音 (free or 影劇): https://video.friday.tw/drama/detail/3575 — 證據：The friDay page loaded on 2026-11-09 with 「適用方案：免費／影劇」, 「全12集」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；ratings 檔標 family drama。**符合本篇（家庭）**。

## 10. 春になったら

1. **片名**：**春暖花開的那一天**（Hami 頁；zh-Wikipedia）（tw-availability-1）／春になったら／*When Spring Comes*（關西テレビ英文目錄；MDL 頁名同）
2. **劇情**：2024 年元旦，當助產師的女兒椎名瞳宣布「三個月後結婚」，父親雅彥同時宣布「三個月後會死」——他是末期胰臟癌，決定不治療；父女各自列出想做的事，度過三個月。日文維基あらすじ：「二人は同時に『3か月後に結婚します』『3か月後に死んじゃいます』と報告する…雅彦は既に骨や肝臓にも転移する末期の膵臓癌を治療せず」。來源：https://ja.wikipedia.org/wiki/春になったら_(テレビドラマ) （read；沒有英文維基條目）
3. **季數與狀態**：1 季 11 集，關西テレビ制作・フジテレビ系「月曜22時枠」，2024-01-15 到 03-25（週一 22:00–22:54，54 分鐘），脚本 福田靖（日文維基，read）。**已完結**，沒有續作。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Hami 頁分級。
   - IMDb Certifications（使用者可編輯）：**Japan 13+ streaming**；沒有 Taiwan 列（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31890285/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：主軸是末期癌症與臨終（日文維基，read），適合事先提醒觀眾題材沉重。
5. **觀眾評分**：MDL **7.8**（83 人，https://mydramalist.com/760071-haru-ni-nattara ，read）；IMDb **6.8**（27 票，read）；Filmarks ★**4.0**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：Minpo 最優秀 2024
   - B：RS2024 1/5（田幸 #6）
   - C：Filmarks Awards 2024 TVドラマ nominee
   - D：VR24 總合 #20 13.2%（TS #20）
   - （沒有 F/G 類；merged 檔 ABCD。）
7. **前置作品**：**原創劇**（`原作 =` 空白，read）。不必先看任何作品。
8. **台灣串流**：Hami Video: https://hamivideo.hinet.net/product/250303.do?cs=2 (下架時間 2027-01-15) — 證據：The Hami page loaded on 2026-11-09 with the title. The English title comes from https://www.ktv.jp/en/catalog/drama/when_spring_comes.html. — **confirmed (service page)**（tw-availability-1）
   - 注意：Hami 下架時間 2027-01-15，文章發布後約兩個月就到期。
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；ratings 檔標 family drama。**符合本篇（家庭）**。

## 11. 対岸の家事〜これが、私の生きる道！〜

1. **片名**：**對岸的家事～這就是我的生存之道！～**（friDay 頁；tw-availability-1）／対岸の家事〜これが、私の生きる道！〜／英文 *Who Does Housework Anymore?*（MDL 頁名、AsianWiki；IMDb 德國 AKA 同）；Wikidata 英文標籤寫 On the Other Side
2. **劇情**：選擇當全職主婦的村上詩穗（多部未華子），在職業媽媽成為主流的時代很少遇到同類；她和「對岸」的人——職業媽媽、請育嬰假的厚勞省菁英爸爸——相遇，一起面對家事與育兒的難題。MDL 簡介（TBS 原文翻譯，cache）：「Due to an incident in her past, Shiho decided to become a full-time housewife…she begins to interact with people she would never have met, including a working mother and an elite government official father on parental leave.」日文維基あらすじ是空的（`{{要あらすじ}}`，read）。來源：https://mydramalist.com/785840-taigan-no-kaji-kore-ga-watashi-no-ikiru-michi （cache）
3. **季數與狀態**：1 季 10 集，TBS「火曜ドラマ」，2025-04-01 到 06-03（週二 22:00–22:57，57 分鐘）（日文維基，read）。**已完結**，沒有續作。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt36411233/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：MDL **7.6**（170 人，read）；IMDb **7.2**（21 票，read）；Filmarks ★**3.8**（read）。RT：沒有查。
6. **推薦 tag**：
   - B：RS2025 2/5（明日 #7、麦倉 #7）；EC2025（まっつ top 5）
   - D：VR25 總合 #17 13.0%（ratings 檔第 184 列合併列；同列 PJ 也標 #17 13.3%，名次寫法有疑問，未核）
   - F：PTT 2025 回顧 遺珠「好險沒棄劇，很好看」（pemberley）
   - G：LINE TODAY 2025 日劇年度榜（前十，名次不明；fans 檔 S13 partial）
   - （已刪：MDL 使用者清單 #12，fans 檔標「弱」。）
7. **前置作品**：**改編小說**（原作 朱野帰子『対岸の家事』，講談社 2018，read）。不必先讀原作（判斷）。
8. **台灣串流**：friDay影音 (影劇): https://video.friday.tw/drama/detail/4026 — 證據：The page loaded on 2026-11-09 with 「適用方案：影劇／全10集」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；MDL genre Comedy／Life／Drama（cache）；MANTANWEB 稱「新たな『お仕事ドラマ』」（cache）。**符合本篇（家庭；也可說家事是一種職業）**。

## 12. 阿修羅のごとく（2025，Netflix）

1. **片名**：**宛如阿修羅**（Netflix; TW media）（tw-availability-2）／阿修羅のごとく／*Asura*（Netflix、IMDb、MDL）
2. **劇情**：1979 年的東京，竹澤家四姊妹發現年邁的父親有外遇和私生子，各自隱藏的婚姻與感情問題也一一浮上檯面。Netflix 頁（cache）：「In 1979 Tokyo, four distinct sisters uncover their aging father's affair, causing their happy facades and bottled-up emotions to slowly unravel.」Netflix Tudum 2025-02-07（cache）：「It's based on writer Kuniko Mukōda's 1970s miniseries Like Asura.」日文維基：「2025年1月9日から是枝裕和の監督・脚色によるリメイクがNetflixシリーズとして配信。四姉妹役は宮沢りえ、尾野真千子、蒼井優、広瀬すずが演じる」。來源：https://ja.wikipedia.org/wiki/阿修羅のごとく （read）
3. **季數與狀態**：**Netflix 原創，7 集，2025-01-09 全球一次上線**（日文維基 infobox「放送期間 = 2025年1月9日」「放送回数 = 7」，read）。片長：Netflix 頁各集 55 分到 1 小時 6 分（第 1 集 57 分、第 7 集 1 小時 6 分）（cache）；Filmarks 寫「再生時間 59分」（read）。**限定劇，已完結**，沒有讀到續季消息。
   - 原作是向田邦子編劇的 NHK 劇（1979–1980），2003 年森田芳光拍過電影（日文維基，read）。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 Netflix 頁分級（沒有台灣 IP）。
   - IMDb Certifications（使用者可編輯）：**Japan PG12**；**Taiwan 12+**；US TV-14、UK 12、Singapore PG13、Germany 12、Canada 14+（read）。Netflix 頁（cache，非台灣）標 TV-14。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt34570673/parentalguide/ ）：Sex & Nudity **None**（5 of 6）、Violence & Gore **None**（4 of 5）、Profanity **None**（5 of 5）、Alcohol, Drugs & Smoking **Mild**（3 of 5）、Frightening & Intense **Mild**（2 of 4）。投稿：E1 小妹開玩笑說喜歡「brimming with lust」的男人；E1 換衣服場面「Absolutely no nudity is shown」；有人抽菸。
   - 需要提醒：外遇、婚外情是主題（劇情本身）；沒有裸露（Parents Guide 投稿）。
5. **觀眾評分**：MDL **7.7**（832 人，https://mydramalist.com/762793-asura-no-gotoku ，read）；IMDb **7.6**（2K，cache）；Filmarks 2025 版 ★**3.9**（1979 NHK 版 ★4.2，不要混）（read）；**RT Tomatometer 100%（21 則影評）、觀眾 91%（少於 50 人）**（https://www.rottentomatoes.com/tv/asura ，read）。
6. **推薦 tag**：
   - A：SDA Best Director 2025（是枝裕和）
   - B：NYT-Intl2025（Mike Hale 年度國際劇 top 10，partial，來自 yearendlists.com 索引）；RS2025 1/5（明日 #4）
   - C：IMDb 7.6（2K）
   - G：LINE TODAY 2025 日劇年度榜 #2；LINE TODAY 2025 十大追劇榜 #9；VERSE 2025 必看十部
   - （不計：Filmarks 2025 監督Fan!賞 是枝裕和，ratings 檔標 creator award 不計；ELLE TW 預告片單 #3 屬上檔預告，略。）
7. **前置作品**：**改編**向田邦子原作（1979 年 NHK 劇）。**不必先看 1979 版**（判斷）；是枝版是重新改編，不是續篇。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81759233 — 證據：ELLE Taiwan, 2025-01-08, https://www.elle.com/tw/entertainment/drama/g63354828/asura-2025-netflix/ (「Netflix《宛如阿修羅》」). Beauty321, 2025-05-07, https://www.beauty321.com/post/67519 (Netflix 日劇 list, #2). — **confirmed (Taiwan media, 2025)**（tw-availability-2）
- **類型核對**：日文維基 Netflix 段 `ジャンル = 連続ドラマ`；ratings 檔標 family drama；Netflix genre TV Dramas（cache）。**符合本篇（家庭）**。

## 13. 海に眠るダイヤモンド

1. **片名**：**海中沉睡的鑽石**（friDay 頁；公視+）（tw-availability-1）／海に眠るダイヤモンド／*The Diamond Sleeping in the Sea*（IMDb、MDL；IMDb AKA *Diamonds in the Sea*）
2. **劇情**：戰後長崎端島（軍艦島）煤礦島上的年輕人，與現代東京的人物，跨越數十年的愛情、夢想與家族故事。IMDb 簡介（read）：「In post-war Japan, lives intertwine across decades between bustling Hashima Island's coal mines and modern Tokyo, as generations navigate love, dreams, and family bonds」。日文維基あらすじ只導向エピソードリスト（read）。來源：https://www.imdb.com/title/tt34224473/ （read）
3. **季數與狀態**：1 季，TBS「日曜劇場」，2024-10-20 到 12-22（週日 21:00–21:54，標準 54 分鐘），脚本 野木亞紀子（日文維基，read）。
   - **集數寫法**：日文維基「放送回数 = 9(10)」——電視播出 9 集；最終話延長 56 分鐘（21:00–22:50），在串流與 TVer 改成導演剪輯版的第 9、10 話分開上架。初回延長 25 分鐘；10-27 停播一次（日文維基特記事項，read）。IMDb 9 集、MDL 10 集，就是這個差異。
   - **已完結**，沒有續作。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 friDay 頁分級。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt34224473/parentalguide/ ）：**五類都沒有投票**（「not yet rated」）。
   - 需要提醒：舞台是戰後煤礦島（IMDb 簡介）；沒有可引用的內容投稿。
5. **觀眾評分**：MDL **8.3**（170 人，https://mydramalist.com/773627-umi-ni-nemuru-diamond ，read）；IMDb **8.1**（70 票，read）；Filmarks ★**4.4**（read，本篇與 Unmet 並列最高）。RT：沒有查。
6. **推薦 tag**：
   - A：TDA グランプリ 2025；DA best 2024Q4（#122）
   - B：RS2024 4/5（田幸 #3、麦倉 #7、成馬 #10、藤原 #8）
   - D：VR24 總合 #5 17.3%（RT #6）
   - F：PTT 2024 推薦「會在歷史上留名」＋推文 3（episold）；pemberley（PTT 2024 回顧「必是年度前五，但臺灣沒有串流播」＋2025 回顧 正評＋推文 2）——**同一人兩篇，算一聲**
   - （不計：Galaxy-indiv 2024年度 杉咲花。沒有 G 類：fans 檔 §4 說 2024 年底台灣沒有串流，G 類被低估。）
7. **前置作品**：**原創劇**（`原作 =` 空白，read）。不必先看任何作品。
8. **台灣串流**：friDay影音 (影劇, ep1 free): https://video.friday.tw/drama/detail/5291. 公視+ (free from 2025-09-01) https://www.ptsplus.tv/programs/da52e6ae-5f8d-4155-b5e4-6369168efdd0 now returns 「公視+ | 404」 (**lapsed**). — 證據：The friDay page loaded on 2026-11-09 with the title. Linear: 緯來日本台 from 2025-03-18. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`；IMDb genre Drama／History／Romance（read）；ratings 檔標 period family saga。**符合本篇（家庭＋昭和年代劇）**。

## 14. あんぱん（連続テレビ小説）

1. **片名**：**紅豆麵包**（friDay／Hami／LINE TV 頁；tw-availability-1）／あんぱん／*Anpan*
2. **劇情**：以《麵包超人》作者柳瀨嵩的妻子小松暢為靈感的虛構故事：深受軍國思想影響的朝田暢經歷戰爭後價值觀翻轉，戰後和丈夫嵩一起追尋「不會翻轉的正義」，嵩最後創作出傳世繪本。英文維基 Plot：「Nobu Asada, who was deeply influenced by militaristic ideology, experienced the horrors of war, which completely changed her values. After the war, she and her husband, Takashi, pursued "a justice that never overturns." Takashi eventually created a masterpiece picture book.」導言：「inspired by Nobu Komatsu, the wife of Takashi Yanase…but it is a fictional and original work」。來源：https://en.wikipedia.org/wiki/Anpan_(TV_series) （read）
3. **季數與狀態**：**NHK「連続テレビ小説」（晨間劇）第 112 作，全 130 集，每集 15 分鐘**，2025-03-31 到 09-26，週一到週五 8:00–8:15（NHK 總合）（日文維基 infobox 與導言，read）。**已完結**。
   - 最終回隔週有 4 夜連續的「特別編」（每晚 23:00–23:25，含本篇沒演的衍生故事與座談；日文維基引 MANTANWEB 2025-09-19，read）；Filmarks 另列「あんぱん 特別編」★3.8。
   - 總集編：前半 2025-07-12（總合），後半與未公開場面 2025-12-30。另有 NHK-FM 廣播劇衍生作（2026-01-03）。
   - friDay 頁「全130集」與日文維基一致（tw-availability-1）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt38517422/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：**戰爭**——中段有主角經歷戰爭、丈夫從軍的情節（英文維基 Plot「experienced the horrors of war」，read）；具體戰爭場面尺度沒有來源。
5. **觀眾評分**：MDL **7.9**（138 人，https://mydramalist.com/758859-anpan ，read）；IMDb **8.1**（27 票，cache）；Filmarks ★**4.1**（2025-03-31 公開、15 分的那筆；同名韓劇 ★3.8 不是本劇）（read）。RT：沒有查。
6. **推薦 tag**：
   - C：Filmarks Awards 2025 TVドラマ nominee
   - E：Yahoo!検索大賞2025 ドラマ部門
   - F：PTT 2025 推薦「不錯」（episold）；PTT 2025 回顧「整體來說還不錯」（pemberley）
   - G：friDay 2025 日劇收視 #6；VERSE 2025 必看十部（文章第 1 部，VERSE 編號是文章順序不是名次）
   - （已刪：MDL 使用者清單 #14，fans 檔標「弱」。另 PTT S3 提到「臺灣串流平台首次跟播晨間劇」，是背景不是推薦。）
7. **前置作品**：**原創劇**（`原作 =` 空白；以柳瀨嵩夫婦為靈感，read）。不必先看任何作品；看過《麵包超人》會認出許多致敬（判斷）。
8. **台灣串流**：friDay影音 (free tier + 影劇, 全130集): https://video.friday.tw/drama/detail/4023. Hami Video: https://hamivideo.hinet.net/product/289843.do?cs=2 (下架時間 2028-03-30). LINE TV: https://www.linetv.tw/drama/20753/eps/1. myVideo 30364 exists (inconclusive). — 證據：All three pages loaded on 2026-11-09. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = テレビドラマ`；英文維基 genre＝Drama；Filmarks ジャンル ドラマ／伝記（read）。**符合本篇（家庭＋昭和年代劇）**。

## 15. べらぼう〜蔦重栄華乃夢噺〜（大河ドラマ）

1. **片名**：**大膽狂徒〜蔦重繁華如夢故事〜**（Hami / LINE TV / myVideo 頁；tw-availability-1 註明 hint「蔦重如夢繁華故事」是錯的）／べらぼう〜蔦重栄華乃夢噺〜／*Unbound*（英文維基、NHK Enterprises、MDL）
2. **劇情**：18 世紀中葉的江戶，出身吉原的出版人蔦屋重三郎（橫濱流星），在老中田沼意次重商的寬鬆風氣中崛起，到松平定信改革收緊娛樂時仍不退縮，發掘歌麿、北齋、寫樂等人。英文維基 Plot：「One of the central figures in this cultural movement was Tsutaya Jūzaburō, a publisher. However, when the era transitioned to Matsudaira Sadanobu's governance from Tanuma's, stricter controls on entertainment were imposed…he remained undeterred, discovering and making talents such as Utamaro, Hokusai and Sharaku」。來源：https://en.wikipedia.org/wiki/Unbound_(TV_series) （read）
3. **季數與狀態**：**NHK 大河劇第 64 作，全 48 集**，2025-01-05 到 12-14，**週日 20:00–20:45（每集 45 分鐘），全年播出**，NHK 總合（日文維基 infobox 與導言，read）。脚本 森下佳子（第 28、29 回與三谷昌登連名）。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Hami／LINE TV 頁分級。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt38784676/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：**性產業題材**——舞台是江戶吉原遊廓，日文維基あらすじ開頭寫「場末では多くの女郎が病や飢えに苦しんでいた」，第 1 回有遊女遺體被丟棄在投げ込み寺、讓重三郎受衝擊的場面（日文維基，read）；劇組名單有インティマシー・コーディネーター（浅田智穂）（read）。具體裸露尺度沒有可引用來源；IMDb、MDL 都沒有投稿。
5. **觀眾評分**：MDL **7.5**（**19 人**，https://mydramalist.com/751569-berabo-tsuta-ju-eika-osamu-yume-hanashi ，read）；IMDb **6.8**（**19 票**，`/ratings/` 頁，read）；Filmarks ★**4.1**（read）。RT：沒有查。**國際樣本極小，分數不具代表性。**
6. **推薦 tag**：
   - A：TDA 優秀 2025
   - B：RS2025 2/5（藤原 #1、麦倉 #1）
   - D：DRM 2025-07 cour #2 8.9%
   - E：ORICON 2025 満足度 #10（3.40）
   - F：PTT 2025 推薦「喜歡」列第一＋推文 1（episold）；PTT 2025 回顧 #3（pemberley）
   - G：VERSE 2025 必看十部
   - （不計：Galaxy-indiv 2025年度 岡山天音。）
7. **前置作品**：**原創劇**（`原作 =` 空白，read）。不必先看任何作品；對江戶出版文化、浮世繪有基本認識會更好懂（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/283079.do?cs=2 (下架時間 2028-01-05). LINE TV: https://www.linetv.tw/drama/20964/eps/1. myVideo https://myvideo.net.tw/details/3/29518 exists (inconclusive). — 證據：The Hami and LINE TV pages loaded on 2026-11-09 with the title. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基導言「a Japanese historical drama television series」，連結 Jidaigeki；日文維基 `ジャンル = テレビドラマ`（read）。**符合本篇（時代劇）**。

## 16. 光る君へ（大河ドラマ）

1. **片名**：**致光之君**（tw-availability-2）／光る君へ／*Dear Radiance*（英文維基、NHK Enterprises、MDL）
2. **劇情**：平安時代中期，《源氏物語》作者紫式部（吉高由里子，劇中名まひろ）的一生，以及她與藤原道長的關係。英文維基導言：「a Japanese historical drama television series starring Yuriko Yoshitaka as Murasaki Shikibu」（read）。日文維基あらすじ：下級貴族之女まひろ幼時與右大臣家三男三郎（藤原道長）相識，母親被道長之兄道兼殺害（read）。來源：https://en.wikipedia.org/wiki/Dear_Radiance 、https://ja.wikipedia.org/wiki/光る君へ （皆 read）
3. **季數與狀態**：**NHK 大河劇第 63 作，全 48 集**，2024-01-07 到 12-15，**週日 20:00–20:45（每集 45 分鐘），全年播出**，NHK 總合，脚本 大石静（日文維基，read）。日文維基引用的サンスポ標題寫「初回は15分拡大版」（read）。**已完結**。LINE TV 頁「已完結 / 共 48 集」（tw-availability-2）。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 LINE TV／myVideo 頁分級。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31624534/parentalguide/ ）：**五類都沒有投票**（「not yet rated」）。
   - 需要提醒：第 1 回就有主角母親被殺的場面（日文維基あらすじ，read）；宮廷政爭、毒殺情節。沒有投稿。
5. **觀眾評分**：MDL **7.8**（**69 人**，https://mydramalist.com/728023-hikaru-kimi-e ，read）；IMDb **7.8**（60 票，cache）；Filmarks ★**4.2**（read）。RT：沒有查。**國際樣本極小。**
6. **推薦 tag**：
   - B：RS2024 4/5（田幸 #10、麦倉 #2、成馬 #8、藤原 #2）
   - F：PTT 2024 回顧 #2（pemberley）；PTT 2024 推薦（episold，「後期看完幾乎沒有印象」）＋推文 1
   - G：KKTV 2024 熱播 #7（另有推文說「竟然沒有致光之君」得獎）
   - （沒有 A/C/D/E 類；merged 檔 BFG。）
7. **前置作品**：**原創劇**（`原作 =` 空白，read）。不必先讀《源氏物語》（判斷）。
8. **台灣串流**：LINE TV (VIP): https://www.linetv.tw/drama/20965/eps/1 (「已完結 / 共 48 集」). myVideo: https://www.myvideo.net.tw/details/3/26246 (live, with no `expired` class). — 證據：Both pages were live on 2026-11-09. myVideo blog, 2024: 「1月9日起 MyVideo 跟播」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：英文維基「Japanese historical drama」（Jidaigeki）；日文維基 `ジャンル = テレビドラマ`（read）。**符合本篇（時代劇）**。

---

## 總結

- **評分一覽**（MDL 人數／IMDb 票數；Filmarks 只有 ★）：

| # | 劇 | MDL | IMDb | Filmarks ★ |
|---|---|---|---|---|
| 1 | Unmet | 8.4（1,216） | 7.7（138） | 4.4 |
| 2 | 派遣女醫X | S1 8.2（2,920）…S7 7.9（444） | 7.5（1K，合併） | 4.0–4.1 |
| 3 | 新宿野戰醫院 | 7.6（306） | 6.9（138） | 3.8 |
| 4 | 119緊急呼叫 | 7.7（303） | 7.4（29） | 3.8 |
| 5 | 型男主廚三星夢 | 8.3（1,482） | 7.8（1.5K） | 4.2 |
| 6 | 榮耀家族 | 7.8（288） | 7.6（159） | 4.1 |
| 7 | 御上老師 | 7.9（432） | 7.6（78） | 3.9 |
| 8 | 東大特訓班2 | 8.1（901） | 7.7（2.1K，2005＋2021 合併） | 3.9 |
| 9 | 海的開始 | 8.4（2,779） | 8.0（297） | 3.8 |
| 10 | 春暖花開的那一天 | 7.8（83） | 6.8（27） | 4.0 |
| 11 | 對岸的家事 | 7.6（170） | 7.2（21） | 3.8 |
| 12 | 宛如阿修羅 | 7.7（832） | 7.6（2K） | 3.9（RT 100%／21） |
| 13 | 海中沉睡的鑽石 | 8.3（170） | 8.1（70） | 4.4 |
| 14 | 紅豆麵包 | 7.9（138） | 8.1（27） | 4.1 |
| 15 | 大膽狂徒 | 7.5（19） | 6.8（19） | 4.1 |
| 16 | 致光之君 | 7.8（69） | 7.8（60） | 4.2 |

- **集數與播出形式**（寫文時最容易寫錯的）：
  - 晨間劇紅豆麵包：130 集 × 15 分鐘，週一到週五早上，半年（2025-03-31 到 09-26）。
  - 大河劇大膽狂徒（2025）、致光之君（2024）：各 48 集 × 45 分鐘，週日晚間，一整年（1 月到 12 月中）。
  - 派遣女醫X：7 季 69 集（2012–2021）＋特別篇＋2024 電影 FINAL（系列完結）；台灣 friDay 確認第 1–6 季，第 7 季未重新確認。
  - 海中沉睡的鑽石：電視播 9 集，串流版 10 集。
  - 海的開始：12 集＋特別編（維基寫 13 含特別編）。
- **續作（2027）**：Unmet 第 2 季（2027 年 1 月期）、119 緊急呼叫 SEASON2（2027 年 4 月期）。型男主廚三星夢已有 2024 特別篇與電影《グランメゾン★パリ》。
- **分級提醒重點**：
  - 只有宛如阿修羅有 Parents Guide 投票（全部 None／Mild）。其餘 15 部完全沒有投票。
  - 要特別提醒的題材：**大膽狂徒**（江戶吉原遊廓，女郎的病苦與死亡；有親密場面協調員）、**紅豆麵包**（戰爭）、**春暖花開的那一天**（末期癌症）、**東大特訓班2**（學生自殺未遂）、**醫療三部**（手術場面）、**宛如阿修羅**（外遇題材，無裸露）。
- **類型核對**：
  - **符合**（14）：Unmet、派遣女醫X、新宿野戰醫院（醫療）、119緊急呼叫（消防指令員）、型男主廚三星夢（主廚）、榮耀家族（馬主＋家族）、海的開始、春暖花開的那一天、對岸的家事、宛如阿修羅（家庭）、海中沉睡的鑽石、紅豆麵包（家庭＋年代劇）、大膽狂徒、致光之君（時代劇）。
  - **部分符合**（2）：**御上老師**（官僚教師，偏社會派校園劇）、**東大特訓班2**（校園升學劇，律師當教練）。歸「職人：教師」可行。
- **台灣串流風險**：
  - **東大特訓班2 是 licensed-old**：friDay、Hami 已下架，只有 JustWatch 類資料說 Netflix 台灣有；寫文要標「JustWatch 台灣列出」。
  - 春暖花開的那一天 Hami 下架時間 2027-01-15、御上老師 Hami 2027-01-20、型男主廚特別篇 Hami 2027-01-06，都在發文後兩三個月內到期。
  - 派遣女醫X 第 7 季台灣狀態沒有重新確認。
  - 宛如阿修羅的台灣證據是 2025 年媒體，但是 Netflix 原創，下架風險低。

## 無法查證的事實

1. **Unmet 第 2 季、119 SEASON2 的播出時間**只讀到日文維基 infobox 與引用標題（Real Sound、映画ナタリー 2026-11-04），新聞原文沒有另讀。
2. **榮耀家族的 B 類 tag（EC2025「ロイヤルファミリー」）**是否就是本劇：awards 檔寫法少了「ザ・」，merge.py 沒合併；本篇判斷是同一部，沒有回讀映画チャンネル原文確認。
3. **對岸的家事 VR25 名次**：ratings 檔合併列寫「#17 13.0%」，同列 PJ 也寫 #17 13.3%，名次可能有誤，未回讀 Video Research 原表。
4. **派遣女醫X 第 2、3、7 季的台灣頁面**：tw-availability-1 只確認 S1、S6（S4 經 Exa），S2/S3 只在目錄篩選，S7 未重查。
5. **Filmarks Mark 數**：16 部都沒讀到（前端渲染）。
6. **台灣平台分級**：16 部都沒有記錄。
7. **IMDb 分數**：派遣女醫X、新宿野戰醫院、119、榮耀家族、御上老師、海的開始、宛如阿修羅、紅豆麵包、致光之君是 Exa cache（含搜尋結果內的頁面內容）；Exa `web_fetch_exa` 多次逾時，沒有全部改用 read。派遣女醫X cache 寫 7.5／1K，ratings 檔（2026-11-09）寫 7.6／1.1K。
8. **御上老師、119 緊急呼叫、對岸的家事、宛如阿修羅、海中沉睡的鑽石的劇情**：日文維基あらすじ空白或只導向集數表，劇情改用日文維基人物欄（read）＋IMDb／MDL／Netflix 簡介（cache 或 read，各劇已標）。
9. **大膽狂徒的裸露尺度**：只讀到日文維基寫第 1 回女郎遺體的場面與親密場面協調員名單，沒有讀到具體描述；IMDb、MDL 沒有投稿。
10. **新宿野戰醫院 IMDb 標「2024–」**，但沒有讀到續季消息；日文維基只有一輪播出。
11. 所有 Netflix TW 上架狀態：沒有台灣 IP，netflix.com/tw 頁不是證據（沿用 tw-availability 規則）。

## toolDegradation

- **Groundlane `web_extract`**：日文／英文 Wikipedia raw、MyDramaList（站內搜尋與作品頁）、Filmarks 搜尋頁、Rotten Tomatoes 都正常。
  - pattern 欄位預設只回第 1 個 capture group，第一次只拿到欄位名；改加 `group: 0` 後回整行。
  - `あんぱん_(連続テレビ小説)` 404；用 MediaWiki `prefixsearch` 找到 `あんぱん (2025年のテレビドラマ)`。`アンメット_ある脳外科医の日記` 是轉址頁，改讀原作條目。
  - MDL「Ratings: X/10 from N users」中間有 `<b>` 標籤，pattern 改成 `Ratings: <b[^>]*>[0-9.]+</b>/10 from [0-9,]+ users`。
  - IMDb parentalguide 頁回 1,997 bytes 空殼，讀不到。
- **Groundlane `web_fetch`**：Wikidata SPARQL、Wikipedia API 正常。
- **Groundlane `web_search`**：Tavily、Exa 後端回 unavailable，結果來自 Brave／You.com；只用來找 Unmet 的 IMDb 分數（snippet 7.8，最後以 read 的 7.7 為準）。
- **Exa `web_search_exa`**：找到 Unmet、119、榮耀家族、宛如阿修羅、對岸的家事的 IMDb ID，搜尋結果內容含 IMDb 分數（cache）。
- **Exa `web_fetch_exa`**：IMDb 標題頁 16 次請求中 7 次 `CRAWL_LIVECRAWL_TIMEOUT`（型男主廚、東大特訓班、春暖花開、對岸的家事、海中沉睡的鑽石各一到兩次），Unmet 回空內容、大膽狂徒沒有分數欄；改用 jina。
- **jina `read_url`**（無 key，`question` 參數無效、回全文）：IMDb Parents Guide 16/16 讀到（新宿野戰醫院第一次 30 秒逾時，重試成功）；也補讀了型男主廚、東大特訓班、春暖花開、對岸的家事、海中沉睡的鑽石的標題頁，以及 Unmet、大膽狂徒的 `/ratings/` 頁。
- **沒有使用**：Tavily MCP（任務說明可能額度不足，Groundlane 內部的 Tavily 也 unavailable）、Firecrawl（額度用完）、終端機 curl（環境封鎖）。
