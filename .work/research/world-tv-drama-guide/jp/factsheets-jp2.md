# 日劇 2 事實表：懸疑、犯罪與動作（18 部）

- 查核日：2026-11-10。順序照 `post-jp2-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。已刪掉的 tag 在各劇註明，主要是：ContentAsia、Variety、DailyView 今際之國 #1、Reddit r/JDorama（都是 snippet）；JT2024（候選檔自己標「mention, not counted」）。這輪 18 部沒有遇到業配標示。
- **兩個「只算一次」的規則**：
  - ratings 檔 §5：VR23／VR24／VR25、VRR、ドラマン（DRM）都是 Video Research 關東資料。同一部劇同時有 VR 與 DRM tag 時，D 類只算一個家族；下面會把同家族的 tag 並列在同一個括號裡。TVer 各年（TVA22、TVA25）也是同一家族。
  - fans 檔 §4：PTT 使用者 pemberley 連寫多年回顧（S3 2025、S5 2024、S6 2023），同一部劇被他多篇提到時只算一聲。本篇只有**獅子的藏身處**同時出現在 S5 與 S3，已合併。
- **欄位 4 分級要分三層看**：
  1. 日本電視劇**沒有統一分級**，無線台播出不標年齡。只有串流原創（Netflix、Disney+）在平台上標分級。
  2. 台灣平台頁分級：`tw-availability` 檔**只記錄了一筆**（噬亡村 Disney+ TW 頁 18+）；其他劇的 friDay／Hami／LINE TV／Netflix 頁分級沒有記在檔裡，這輪也沒有另外抓（沒有台灣 IP，Netflix 頁不算證據）。
  3. IMDb Certifications 的 Japan／Taiwan 列是**使用者可編輯**資料，只算旁證。IMDb Parents Guide 是使用者投稿與投票，不是官方分級；嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。
- **Parents Guide 幾乎是空的**：18 部裡只有 6 部有投票（噬亡村、地面師、武士生死鬥、今際之國的闖關者、幽遊白書、Unnatural），全部是 Netflix／Disney+ 原創，再加上 Unnatural（每類 1–2 票）。其餘 12 部無線台日劇完全沒有投票。
- **欄位 5 RT**：只有 4 部有 Tomatometer，全是 Netflix 原創（今際之國 78%／30 則、幽遊白書 83%／12 則、地面師 100%／9 則、武士生死鬥 100%／12 則）。噬亡村頁面存在但 0 則影評。
- **欄位 5 Filmarks**：從 Filmarks 站內搜尋結果頁讀到 ★ 平均分（read），**Mark 數沒有讀到**（Mark 數是前端渲染，伺服器 HTML 只有模板變數 `{{ viewingMarkCount }}`）。只有 VIVANT 另開了作品頁，讀到「10592件のドラマレビュー」。

## 這份資料的限制

1. **日劇在國際評分網站的樣本很小**。無線台日劇在 IMDb 多半只有幾十到幾百票（GO HOME 23 票、校規 17 票），MDL 也常只有一兩百人評分（GO HOME 108 人、校規 101 人、女王偵訊室 S5 15 人）。跨劇比較 IMDb／MDL 分數，對這類劇意義不大。Netflix 原創（今際之國 154K、武士生死鬥 23K）和無線台劇的票數差兩三個數量級。
2. **日本國內評分只用到 Filmarks ★**，而且只讀到平均分、沒有 Mark 數；沒有查 Yahoo!テレビ、みんなの感想等日本站。
3. **分級沒有官方統一來源**。台灣平台頁分級在 tw-availability 檔裡只有噬亡村一筆；其餘劇只能寫「沒有記錄」。IMDb 的 Taiwan 列（例如 VIVANT、勿說是推理、Last Man 都寫 0+）可能是使用者照 friDay／Hami 頁填的，也可能不準，不要直接寫進文章。
4. **劇情欄**：有英文維基條目的 10 部用英文維基（read），另 8 部（MIU404、99.9、Last Man、GO HOME、女王偵訊室、校規、東京沙拉碗、幸福的婚姻）沒有英文條目，改用日文維基「あらすじ／概要」（read）或 IMDb 簡介（cache）。
5. **IMDb 標題頁全部是 Exa cache**。VIVANT 的快取頁還寫著「Next episode November 1, 2026」，表示快取至少是 11 月初以前的版本，票數可能已變。
6. **台灣串流沒有台灣 IP 驗證**（沿用 tw-availability 的規則）；LINE TV 狀態是伺服器 HTML 推測法。
7. **候選 tag 偏誤**：A/B 類偏好 TBS／NHK 的作品；G 類受平台獨家影響（friDay、KKTV 榜單只反映自家用戶）；DailyView 是聲量不是好評（VIVANT 負評 56%）。
8. 這篇有 **3 部類型不完全符合「懸疑、犯罪與動作」**（校規、幸福的婚姻、幽遊白書），另有 1 部（獅子的藏身處）介於家庭劇與懸疑劇之間，見各劇「類型核對」與文末總結。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播／完結日、電視台、時段、片長、原作、特別篇、電影版 | 日文 Wikipedia wikitext（`action=raw`），抽 `基礎情報 テレビ番組` 的 `ジャンル`／`原作`／`放送期間N`／`放送時間N`／`放送枠N`／`放送分N`／`放送回数N`／`ヘッダN`，電影抽 `Infobox Film` 的 `作品名`／`公開` | Groundlane `web_extract`（pattern） | read（18/18；ガンニバル、イクサガミ、東京サラダボウル、幽☆遊☆白書 是原作條目裡的ドラマ段落；ラストマン 條目名用半形連字號 `ラストマン-全盲の捜査官-`） |
| 劇情、genre、續季 | 英文 Wikipedia wikitext：`Vivant_(TV_series)`、`Unnatural_(TV_series)`、`Don't_Call_It_Mystery`、`Your_Turn_to_Kill`、`Tokyo_Swindlers`、`Gannibal_(TV_series)`、`Light_of_My_Lion`、`Last_Samurai_Standing_(TV_series)`、`Alice_in_Borderland_(TV_series)`、`YuYu_Hakusho_(2023_TV_series)` | Groundlane `web_extract` | read（10 個條目；其餘 8 部沒有英文條目，API 回 missing） |
| IMDb ID、MDL ID | Wikidata SPARQL（P345、P3868，用日文標籤與維基連結查） | Groundlane `web_fetch` | read（17/18 有 IMDb ID；Last Man 用 Exa 搜到 tt28023907；MDL ID 7 部來自 Wikidata，其餘用 MDL 站內搜尋） |
| MyDramaList 分數與評分人數 | `mydramalist.com/<id>` 的「Ratings: X/10 from N users」 | Groundlane `web_extract`（render=never） | read（18/18；多季劇分開讀） |
| IMDb 評分與票數 | IMDb 標題頁 | Exa `web_fetch_exa` | cache（18/18；Last Man、緊急取調室第一次逾時，重試成功） |
| Parents Guide 五類別 + 各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文） | read 17/18；今際之國 partial（只回內文段落，沒有類別標題與 Certifications，類別順序依頁面固定順序推定） |
| Filmarks ★ | `filmarks.com/search/dramas?q=<日文名>`，選取 `h3.p-content-cassette__title` 與 `.p-content-cassette__rate .c-rating__score` | Groundlane `web_extract` | read（18/18 找到條目；Mark 數沒讀到） |
| Rotten Tomatoes | `rottentomatoes.com/tv/<slug>`，選取 `rt-text[slot=critics-score]`、`rt-link[slot=critics-reviews]`、`rt-text[slot=audience-score]` | Groundlane `web_extract` | read（5 部 Netflix／Disney+ 原創有頁；`/tv/vivant` 404） |
| 續季消息 | 噬亡村（Disney+ JP 新聞稿、geek-industry、dplus-navi）、幽遊白書（What's on Netflix、Polygon、Yahoo）、地面師（naruhodo-media） | Groundlane `web_search`／`web_extract` | 見各劇 |

---

## 1. VIVANT

1. **片名**：**VIVANT**（friDay／Hami／LINE TV 頁；2026 續篇平台標為 VIVANT（2026））（tw-availability-1）／VIVANT（ヴィヴァン）／*Vivant*
2. **劇情**：一名有隱藏人格的日本商社員被派往中亞，追回公司誤匯出去的鉅款，卻被捲進國際陰謀，警方還把他當成犯罪組織的一員。英文維基 Plot：「A Japanese businessman with a secret personality is sent to central Asia to find and collect the money erroneously transferred out of the company he works for. He gets involved in an international conspiracy」。來源：https://en.wikipedia.org/wiki/Vivant_(TV_series) （read）
3. **季數與狀態**：TBS「日曜劇場」（週日 21:00–21:54，每集標準 54 分鐘，多集延長；英文維基 runtime 54–108 分）。
   - 第 1 季：10 集，2023-07-16 到 09-17。
   - **第 2 季（2026 續篇）**：14 集（第 11–24 話），2026-07-26 到 **11-08 已播完**，同枠。日文維基導言：「2026年7月26日から11月8日に同枠で続編（第2シーズン）が放送された」，引報知 2026-06-14、東スポ 2025-12-26（「異例の2クール」）。
   - **電影版**：2026-12-04 上映（日文維基導言引シネマトゥデイ 2026-11-08〈「VIVANT」映畫化決定 12月4日から異例の劇場公開〉）。
   - 來源：https://ja.wikipedia.org/wiki/VIVANT （read）；英文維基 num_seasons 2、num_episodes 24（read）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 friDay／Hami／LINE TV 頁的分級。
   - IMDb Certifications（使用者可編輯）：**Japan 列沒有**；**Taiwan 0+**；US TV-MA、UK 15、Australia MA15+、Singapore NC16（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt28314144/parentalguide/ ）：**五類都沒有投票（No voting data）**。
   - 需要提醒：無線台黃金時段播出；投稿空白，沒有可引用的內容提醒。US TV-MA 與台灣 0+ 落差很大，原因未查。
5. **觀眾評分**：MDL S1 **8.1**（935 人，https://mydramalist.com/749003-vivant ）、S2 **7.2**（36 人，https://mydramalist.com/797332-vivant ，剛播完、樣本極小）（皆 read）；IMDb **7.0**（1K，兩季合併，cache）；Filmarks S1 ★**4.3**（作品頁「10592件のドラマレビュー」）、第2シーズン ★**4.2**（read）。RT：`/tv/vivant` 404，沒有頁面。
6. **推薦 tag**：
   - A：TDA グランプリ 2024；DA best 2023Q3（#117）；Minpo 優秀 2024
   - B：RS2023 2/5（小田 #10、成馬 #6）
   - C：Filmarks 2023 日本ドラマ #2
   - D：VR 家族（VR23 總合 #1 最終回 世帯 29.8%；DRM 2023 年間平均 #1 14.3%；DRM 2026-07 cour #1 VIVANT2 16.3%）——同屬 Video Research，算一次；TVerアワード2023 特別賞
   - E：Yahoo!検索大賞2023 ドラマ部門
   - F：PTT 2023 回顧 正評（「花大錢有值得」，pemberley）
   - G：friDay 2023 日劇收視 #1；KKTV 2023 熱播 #2；DailyView 2026-10 月榜 #2（**負評 56%**，聲量不等於好評）
   - （已刪：PTT〈Vivant 2026 第十集〉10 推，fans 檔標 S27 不計。）
7. **前置作品**：**原創劇**（`原作 = 福澤克雄`，福澤是導演，日文維基「福澤克雄が原作を手掛けるオリジナルドラマ」，read）。第 2 季接第 1 季，**看 2026 續篇前要先看第 1 季**（判斷）。
8. **台灣串流**：2023 series: friDay影音 (影劇 pack) https://video.friday.tw/drama/detail/3025 and LINE TV https://www.linetv.tw/drama/21211/eps/1. 2026 sequel: friDay https://video.friday.tw/drama/detail/5039, Hami Video https://hamivideo.hinet.net/product/331506.do?cs=2 (下架時間 2028-07-27), LINE TV https://www.linetv.tw/drama/23125/eps/1. Netflix: https://www.netflix.com/tw/title/81726701 (lead). — 證據：All five service pages loaded on 2026-11-09 with the title; friDay 3025 shows 「適用方案：影劇／全10集」. ETtoday 2024-04-22 (https://star.ettoday.net/news/2724278) says VIVANT went onto Netflix in Dec 2023 and entered the Taiwan weekly top 10. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基導言「a Japanese [[spy thriller]] television series」（read；infobox 沒有 genre 欄）；日文維基 `ジャンル = 連続ドラマ`。**符合本篇（諜報動作懸疑）**。

## 2. MIU404

1. **片名**：**MIU404**（LINE TV 頁；tw-availability-1）／MIU404（ミュウ ヨンマルヨン）／*MIU404*
2. **劇情**：綾野剛與星野源飾演性格相反的兩名刑警，在警視廳刑事部第四機動搜查隊，面對背後有各種社會問題的犯人與被害者。日文維基概要：「対照的な気質の刑事二人が…放送当時の日本における社会問題を背景としたさまざまな事情を抱える犯人や被害者と向き合う姿を、警視庁刑事部第四機動捜査隊を舞台に描く刑事ドラマ」。來源：https://ja.wikipedia.org/wiki/MIU404 （read；沒有英文維基條目）
3. **季數與狀態**：1 季 11 集，TBS「金曜ドラマ」，2020-06-26 到 09-04（週五 22:00–22:54，54 分鐘）（日文維基 infobox，read）。**已完結**，沒有續季。
   - 與《Unnatural》、電影《ラストマイル》（2024-08-23 上映）屬於同一世界觀（シェアード・ユニバース）（日文維基概要，read）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 LINE TV 頁分級。
   - IMDb Certifications（使用者可編輯）：**Japan 16+ self-applied**；沒有 Taiwan 列；US TV-MA self-applied、Singapore R21（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt13068006/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：投稿空白。刑事劇，題材涉及社會案件；具體內容沒有來源可引用。
5. **觀眾評分**：MDL **8.5**（3,589 人，https://mydramalist.com/56519-miu-404 ，read）；IMDb **7.3**（1.2K，cache）；Filmarks ★**4.3**（read）。RT：沒有查（非 Netflix 原創）。
6. **推薦 tag**：
   - A：DA best 2020Q2–Q3（#105）；TDA 優秀 2021
   - C：MDL #22 8.5
   - D：VRR 令和 總合 #21 最終回 24.8%
   - F：PTT 2023 回顧（第三刷，pemberley）
   - （fans 檔 S2 只拿來比較，不計。）
7. **前置作品**：**原創劇**（野木亞紀子原創劇本，日文維基，read）。與《Unnatural 法醫女王》共享世界觀；**不必先看 Unnatural**，但兩部都看過的人會認出交叉設定（判斷）。電影《ラストマイル》是兩部之後的延伸。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/23124/eps/1. Netflix TW page 81423571 is indexed (lead). — 證據：The LINE TV page loaded on 2026-11-09 (2026-07 upload) with no lapse notice. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ / 刑事ドラマ`（read）。**符合本篇（刑事）**。

## 3. Unnatural

1. **片名**：**Unnatural 法醫女王**（LINE TV）；簡稱 法醫女王（tw-availability-2）／アンナチュラル／*Unnatural*
2. **劇情**：法醫三澄美琴在厚生勞動省新設的「不自然死因究明研究所（UDI Lab）」工作，和同事一起解開非自然死亡案件。英文維基 Plot：「Mikoto Misumi is a forensic doctor working at the Unnatural Death Investigation Laboratory (UDI Lab)… she solves cases involving deaths arising from unnatural circumstances」。來源：https://en.wikipedia.org/wiki/Unnatural_(TV_series) （read）
3. **季數與狀態**：1 季 10 集，TBS「金曜ドラマ」，2018-01-12 到 03-16（週五 22:00–22:54，54 分鐘）（日文維基，read；英文維基同）。**已完結**，沒有續季。同世界觀延伸：《MIU404》（2020）、電影《ラストマイル》（2024）。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications（使用者可編輯）：**Japan 16+ self-applied**；沒有 Taiwan 列；South Korea 15 self-applied、UK 15（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt7521882/parentalguide/ ）：Sex & Nudity **Mild**（1 of 2）、Violence & Gore **Moderate**（1 of 2）、Profanity **Mild**（1 of 1）、Alcohol, Drugs & Smoking **Mild**（1 of 1）、Frightening & Intense **Mild**（1 of 1）。投稿：有一案是男子意圖性侵女性但未遂身亡，「This is not shown, only spoken of」；有校園霸凌毆打。**每類只有 1–2 票，幾乎沒有參考價值。**
   - 需要提醒：法醫劇，解剖與遺體畫面是題材本身（判斷，投稿沒寫）；性侵未遂只以對話交代。
5. **觀眾評分**：MDL **8.5**（5,969 人，https://mydramalist.com/25422-unnatural ，read）；IMDb **8.1**（3K，cache）；Filmarks ★**4.4**（read，本篇最高）。RT：沒有查。
6. **推薦 tag**：
   - A：DA best 2018Q1（#96）；TDA 優秀 2018；Galaxy 優秀 2017年度
   - C：MDL #8 8.5；IMDb 8.1（3K）
   - F：PTT 入坑串 2 人（「真正完全入坑」）；PTT 2024 推薦「過季無限重刷」（episold）；PTT 2023 回顧 重刷（pemberley）
7. **前置作品**：**原創劇**（野木亞紀子原創，日文維基「脚本は野木亜紀子によるオリジナル作品」，read）。不必先看任何作品。
8. **台灣串流**：LINE TV (VIP): https://www.linetv.tw/drama/21215/eps/1. Netflix: https://www.netflix.com/tw/title/81714729. — 證據：The LINE TV page was live on 2026-11-09, and LINE TV's KKTV migration list (2026-01-22) names 法醫女王. Nahoko TW: 「正在LINE TV、Netflix（台湾）播出」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：英文維基 genre＝Forensic / Drama（read）。**符合本篇（法醫懸疑）**。

## 4. 99.9 Criminal Lawyer

1. **片名**：**99.9 刑事專門律師**（Netflix Taiwan YT；tw-availability-2）／99.9-刑事専門弁護士-／*99.9 Criminal Lawyer*（IMDb：*99.9: Criminal Lawyer*）
2. **劇情**：日本刑事案件的有罪率是 99.9%，主角是專門替刑事被告辯護、追查剩下 0.1% 真相的律師，單元劇形式。日文維基概要：「タイトルの『99.9』は日本の刑事事件における裁判有罪率99.9%を意味しており、残された0.1%の無罪を解き明かす弁護士が本作の主人公」「1話完結形式」。來源：https://ja.wikipedia.org/wiki/99.9-刑事専門弁護士- （read；沒有英文維基條目）
3. **季數與狀態**：TBS「日曜劇場」（週日 21:00–21:54，54 分鐘），主演松本潤（日文維基，read）。
   - 第 1 季：10 集，2016-04-17 到 06-19。
   - 第 2 季（SEASON II）：9 集，2018-01-14 到 03-18。
   - 完全新作特別篇：2021-12-29（週三 21:00–23:27，147 分鐘）。
   - **電影版**《99.9-刑事専門弁護士-THE MOVIE》：2021-12-30 上映（日文維基引映畫ナタリー 2021-09-13，read）。
   - 系列在 2021 年電影後沒有讀到新作消息。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 Netflix 頁分級。
   - IMDb Certifications（使用者可編輯）：沒有 Japan、Taiwan 列；South Korea 15（2025, self-applied）、UK 15（2025）、Singapore PG13（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt5487318/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：投稿空白；無線台黃金時段法庭劇。
5. **觀眾評分**：MDL S1 **8.3**（2,818 人，https://mydramalist.com/16895-99.9-keiji-senmon-bengoshi ）、S2 **8.3**（1,723 人，https://mydramalist.com/24115-99.9-keiji-senmon-bengoshi-season-ii ）（皆 read）；IMDb **7.4**（670，系列合併，cache）；Filmarks S1 ★**4.1**、SEASONII ★**4.1**、完全新作SP ★**3.9**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：DA best 2016Q2（#89）
   - C：MDL S2 #46 8.3
   - D：DRM 2018 年間平均 #1 SEASON II 17.4%
   - F／G：無（fans 檔只有 S1 入坑串 1 人提到，屬範圍外清單，不列）
7. **前置作品**：**原創劇**（infobox `原作` 空白，read）。單元劇，S2 可單看；但特別篇與電影接續 S2（判斷）。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/82072564 — 證據：https://www.youtube.com/watch?v=vcz8ifjr1OE 「《99.9 刑事專門律師》｜精選片段｜Netflix」, Netflix Taiwan, 2025-08-13. Also Beauty321, 2026-08-14, https://www.beauty321.com/post/73029 (Netflix 日劇 list, #7). — **confirmed (official channel)**（tw-availability-2）
   - tw-availability 沒有寫明 Netflix 上的是第幾季；寫文時要確認 S1／S2 是否都在。
- **類型核對**：日文維基 `ジャンル = 連続ドラマ / 法廷もの`（read）。**符合本篇（刑事辯護法庭劇，偏推理）**；也可以放進職人篇，看文章取捨。

## 5. Don't Call It Mystery

1. **片名**：**勿說是推理**（friDay；tw-availability-2）／ミステリと言う勿れ／*Don't Call It Mystery*
2. **劇情**：大學生久能整被警方帶回偵訊，懷疑他殺了同校同學；他在偵訊室裡靠著不停說話，拆解刑警們的盲點。英文維基 Plot：「university student Totonō Kunō was accompanied to the police station to be investigated… in connection with the murder of Sagae… Kuno categorically denies committing the crime」。來源：https://en.wikipedia.org/wiki/Don't_Call_It_Mystery （read；條目是漫畫＋改編合併條目）
3. **季數與狀態**：富士電視台「月9」（週一 21:00–21:54，54 分鐘），主演菅田將暉（IMDb 卡司，cache）。
   - 連續劇：12 集，2022-01-10 到 03-28。
   - 特別篇：1 集，2023-09-09（土曜プレミアム，145 分鐘）。
   - **電影版**：2023-09-15 上映（日文維基 Infobox Film `公開`，read；英文維基 `released = 2023-09-15`，read）。
   - 來源：https://ja.wikipedia.org/wiki/ミステリと言う勿れ （read）。沒有讀到第 2 季消息。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 friDay 頁分級。
   - IMDb Certifications（使用者可編輯）：只有 **Taiwan 0+**；沒有 Japan 列（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt16434892/parentalguide/ ）：**五類都沒有投票**（頁面寫「is not yet rated」）。
   - 需要提醒：投稿空白。原作涉及虐童、連續殺人等題材（判斷，未查來源）。
5. **觀眾評分**：MDL **8.5**（3,628 人，https://mydramalist.com/702507-mystery-to-iunakare ，read）；IMDb **7.6**（679，cache）；Filmarks 連續劇 ★**4.1**、特別編 ★**3.9**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：AACA JP national Best Drama Series 2022；TDA 優秀 2022；Minpo 優秀 2022
   - C：MDL #19 8.5
   - D：VRR 令和 總合 #12 25.8%（TS #2 15.4%）；TVer 家族（TVerアワード2022 特別賞；2025 名作ドラマ賞）算一次
   - F／G：無
7. **前置作品**：改編自**田村由美的漫畫**（2021 年小學館漫畫賞，日文維基導言，read）。不必先看原作。電影接在連續劇之後，**看電影前先看連續劇**（判斷）。
8. **台灣串流**：friDay影音 (free or 影劇): https://video.friday.tw/drama/detail/2275 — 證據：The friDay page loaded on 2026-11-09 with 「適用方案：免費／影劇」, 「全12集」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：日文維基漫畫 infobox `ジャンル = ミステリー`；ドラマ infobox `連続ドラマ`（read）。**符合本篇（推理）**。

## 6. Your Turn to Kill

1. **片名**：**輪到你了**（Netflix; TW media）（tw-availability-2）／あなたの番です（略稱 あな番）／*Your Turn to Kill*（IMDb：*It Is Your Turn*）
2. **劇情**：年齡差距大的新婚夫妻搬進公寓，在住戶會上玩了一場「交換殺人遊戲」，之後住戶接連死亡。日文維基概要：「マンションに引っ越してきた年の差婚の新婚夫婦が住民会で行われた『交換殺人ゲーム』に巻き込まれる姿を描いたミステリードラマ」。來源：https://ja.wikipedia.org/wiki/あなたの番です （read；英文維基沒有 Plot 段）
3. **季數與狀態**：日本電視台「日曜ドラマ」，2019-04-14 到 09-08（週日 22:30–23:25，55 分鐘），**連續兩季度（2 クール）共 20 集＋特別篇**；第 1 章主演原田知世、田中圭，第 2 章「反撃編」（2019-06-30 起）由田中圭主演（日文維基，read）。英文維基 num_episodes 20（read）。
   - **電影版**《あなたの番です 劇場版》：2021-12-10 上映（日文維基 Infobox Film，read）。
   - 企劃・原案：秋元康。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Japan、Taiwan 列；South Korea 15 self-applied、Thailand 13+ self-applied、Singapore NC16、UK 15（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt9679644/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：連續殺人題材（判斷，投稿空白）。
5. **觀眾評分**：MDL 第 1 章 **8.0**（1,582 人，https://mydramalist.com/33145-it-s-your-turn ）、反撃編 **7.9**（991 人，https://mydramalist.com/38051-anata-no-ban-desu-counterattack ）（皆 read；MDL 把兩章分開）；IMDb **7.1**（971，cache）；Filmarks ★**4.0**、反撃編 ★**3.9**、特別編 ★**3.9**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：TDA 優秀 2020
   - D：VRR 令和 總合 #8 最終回 25.0%（RT #4 19.4%）
   - E：Yahoo!検索大賞2019 ドラマ部門
   - F／G：無
7. **前置作品**：**原創劇**（原案秋元康，`原作` 空白，read）。第 1 章、反撃編要連著看；電影是平行設定的另一版本（日文維基沒讀到細節，這句不要寫進文章）。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81506809 (the ID comes from the indexed HK page). KKTV https://www.kktv.me/titles/01000311 says 「授權已到期」. — 證據：Beauty321, 2026-08-14, https://www.beauty321.com/post/73029 (「一追上癮Netflix日劇推薦9：…《輪到你了》」). PTT Japandrama, 2025-12-21: 「NETFLIX 1月2日上架—輪到你了」. — **confirmed (Taiwan media, 2026-08-14)**（tw-availability-2）
- **類型核對**：英文維基 genre 欄空白；日文維基稱「ミステリードラマ」；IMDb 標「Crime Mystery」（cache）。**符合本篇（推理懸疑）**。

## 7. Tokyo Swindlers

1. **片名**：**地面師**（Netflix YT / TW media）（tw-availability-1）／地面師たち／*Tokyo Swindlers*
2. **劇情**：一群「地面師」（冒充地主、詐騙土地交易的集團）盯上價值百億日圓的土地，策劃史上最大的一票。IMDb 簡介：「A team of swindlers gets wind of prime real estate worth 10 billion yen and will stop at nothing to pull off their most ambitious scam yet」（cache；英文維基沒有 Plot 段，read）。
3. **季數與狀態**：Netflix 原創，**2024-07-25 一次上線 7 集**，每集 38–67 分鐘（英文維基，read；日文維基 7 回，read）。
   - **第 2 季：Netflix 沒有正式宣布**。naruhodo-media 2026-08-22：「Netflixからシーズン2制作決定の正式発表はまだない」（snippet）。原作續集小說《地面師たち ファイナル・ベッツ》2024-07 由集英社出版（日文維基，read），只是原作，不是劇集消息。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Netflix 頁分級。
   - IMDb Certifications（使用者可編輯）：**Japan R18+**、**Taiwan 15+**；US TV-MA、Germany 16、UK 15、Singapore M18（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31250132/parentalguide/ ）：Sex & Nudity **Moderate**（19 of 51）、Violence & Gore **Severe**（10 of 16）、Profanity **Severe**（7 of 11）、Alcohol, Drugs & Smoking **Severe**（8 of 11）、Frightening & Intense **Severe**（7 of 10）。各類投稿文字沒有展開。
   - 需要提醒：**本篇唯一五類全在 Moderate 以上的作品**；日本 R18+ 是 IMDb 使用者填寫，不是官方。暴力、毒品、性內容都要提醒。
5. **觀眾評分**：MDL **7.7**（1,218 人，https://mydramalist.com/764581-jimenshitachi ，read）；IMDb **7.3**（3.3K，cache）；Filmarks ★**4.1**（read）；RT Tomatometer **100%**（9 則）、Popcornmeter 90%（https://www.rottentomatoes.com/tv/tokyo_swindlers ，read；樣本很小）。
6. **推薦 tag**：
   - B：RS2024 2/5（麦倉 #1、成馬 #6）
   - C：Filmarks Awards 2024 配信ドラマ部門 最優秀賞
   - D：Netflix H2 2024 12M
   - F：PTT 2024 推薦 推文 1
   - G：Netflix TW 2024-08-04 #2（累計 6 週，抽樣中日劇最長）
   - （已刪：JT2024 mention，候選檔標 not counted。）
7. **前置作品**：改編自**新庄耕的小說**《地面師たち》（英文維基 `based_on`，read）。不必先看原作。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81574118 — 證據：Harper's Bazaar TW, 2024-08-06 (https://www.harpersbazaar.com/tw/culture/drama/g61770056/tokyo-swindlers-behind-the-scene/): 「最近在Netflix上熱播的日劇《地面師》…已全數上架於Netflix」. Trailer https://www.youtube.com/watch?v=onKx8icfoi8 「《地面師》| 正式預告 | Netflix」 (2024-07-15, reposted on PTT Japandrama); the channel could not be read this session. — **confirmed (Taiwan media, 2024-08). Netflix original, so lapse risk is low.**（tw-availability-1）
- **類型核對**：英文維基 genre＝Crime drama / Thriller（read）。**符合本篇（犯罪）**。

## 8. Gannibal

1. **片名**：**噬亡村**（Disney+ TW page, 2 seasons；提示的「噬亡村 第二季」已更正為同一頁兩季）（tw-availability-1）／ガンニバル／*Gannibal*
2. **劇情**：駐在警察阿川大悟調到偏遠山村供花村，村裡流傳「這個村子會吃人」，他在追查一名村民失蹤時，逐步碰觸支配村子的後藤家的祕密。英文維基 Premise：「A remote village hides dark secrets tied to ancient practices, uncovered after a local's mysterious disappearance. As a new officer investigates, the line between truth and terror begins to blur」（read）；IMDb 簡介：「There is a rumor about this beautiful village: people get eaten here」（cache）。來源：https://en.wikipedia.org/wiki/Gannibal_(TV_series)
3. **季數與狀態**：Disney+「スター」日本原創，**2 季共 15 集，已完結**（英文維基 num_seasons 2、num_episodes 15，read）。
   - 第 1 季：7 集，2022-12-28 到 2023-02-01，每集 33–69 分鐘。
   - 第 2 季：8 集，2025-03-19 到 04-30（日文維基 infobox，read），每集 48–62 分鐘。
   - **第 2 季是完結篇**：Disney+ 日本官方新聞稿 2025-02-28「『ガンニバル』はシーズン2で完結」（snippet；直接讀頁面被轉址到 disneyplus.com/explore，讀不到）；dplus-navi 2026-08-29 與 geek-industry 2026-09-01 都說沒有第 3 季計畫（snippet）。dplus-navi 寫最終話 2025-04-23 配信，和日文維基 infobox 的 04-30 不一致，**以維基為準但要再核**。
4. **分級**：
   - 台灣平台頁：**Disney+ TW 頁 18+**（tw-availability-1：「The service page loaded on 2026-11-09 as 『觀看噬亡村 | Disney+』, 18+, 2022–2025, 2 seasons」）。
   - 日本：Disney+ 日本新聞稿稱第 2 季起設定「18＋」，是 Disney+ 日本原創劇首次（snippet）。
   - IMDb Certifications（使用者可編輯）：**Japan R18+**；**Taiwan 15+ self-applied**（**和 Disney+ TW 頁的 18+ 不一致，文章用 18+**）；US TV-MA、South Korea 15／Season 2 為 19、New Zealand R16（S1）／R18（S2）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt22187798/parentalguide/ ）：Sex & Nudity **Mild**（3 of 11；S2 第 5 集有男女背面裸露）、Violence & Gore **Severe**（5 of 7；「Lots of gore and violence throughout the series as it is about a clan of cannibals」）、Profanity **None**（4 of 7）、Alcohol, Drugs & Smoking **Mild**（6 of 6）、Frightening & Intense **Moderate**（2 of 6；「intense scenes of people getting eaten or killed (including kids)」）。
   - 需要提醒：**食人題材、血腥暴力（含兒童遇害）**。票數 6–11。
5. **觀眾評分**：MDL S1 **8.3**（3,646 人，https://mydramalist.com/725959-gannibal ）、S2 **8.1**（1,672 人，https://mydramalist.com/757667-gannibal-season-2 ）（皆 read）；IMDb **7.4**（3.2K，兩季合併，cache）；Filmarks S1 ★**4.2**、S2 ★**4.1**（read）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**；Popcornmeter 86%（https://www.rottentomatoes.com/tv/gannibal ，read，不建議引用）。
6. **推薦 tag**：
   - C：Filmarks 2023 日本ドラマ #4；MDL #55 8.3；IMDb 7.4（3.2K）
   - E：Parrot 2026：2025 年動漫 IP 改編真人劇需求第 2 名推手
   - F：MDL 使用者清單 #1（S2；單一使用者清單，弱訊號）
   - G：ELLE TW 2025 預告片單 #2（上檔預告，不是回顧）
7. **前置作品**：改編自**二宮正明的漫畫**《ガンニバル》（全 13 卷，英文維基 `based_on`，read；卷數來自 dplus-navi，snippet）。不必先看原作；snippet 來源說劇版結局和原作不同（未核）。**第 2 季直接接第 1 季，要依序看**。
8. **台灣串流**：Disney+ (subscription): https://www.disneyplus.com/zh-tw/browse/entity-71a78f9b-14d5-47a9-8ceb-6192d2856c41 — 證據：The service page loaded on 2026-11-09 as 「觀看噬亡村 | Disney+」, 18+, 2022–2025, 2 seasons. Also https://www.youtube.com/watch?v=-90k8SmIF04 「駭人回歸！原創漫改懸疑日劇《#噬亡村》第二季 3月19日 Disney+ 獨家上線」, Disney Plus TW, 2025 (per Exa). — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Horror / Thriller / Suspense（read）；日文維基漫畫 `ジャンル = サスペンス`。**符合本篇（恐怖懸疑）**。

## 9. Last Man

1. **片名**：**Last Man -全盲搜查官-**（LINE TV）；Hami 寫 Last Man —全盲搜查官—（tw-availability-1）／ラストマン-全盲の捜査官-／*Last Man*（MDL：*The Last Man: The Blind Profiler*）
2. **劇情**：全盲的 FBI 特別搜查官皆實廣見（福山雅治）以交流名義來到日本警察廳，被稱為能了結任何案子的「Last Man」；負責照應他的是一心只想抓犯人的刑警護道心太朗（大泉洋），兩人組成搭檔辦案。IMDb 簡介：「a blind FBI investigator known as the "Last Man," is famous for cracking the toughest cases… he travels to Japan」（cache）。日文維基導言主演福山雅治（read）。沒有英文維基條目。
3. **季數與狀態**：TBS「日曜劇場」。
   - 連續劇：10 集，2023-04-23 到 06-25（週日 21:00–21:54，54 分鐘）。
   - 完全新作特別篇《ラストマン-全盲の捜査官- FAKE/TRUTH》：2025-12-28（125 分鐘）。
   - **電影版**《映画ラストマン -FIRST LOVE-》：日本 2025-12-24 上映、**台灣 2026-08-21 上映**（日文維基 Infobox Film，read）。
   - 來源：https://ja.wikipedia.org/wiki/ラストマン-全盲の捜査官- （read）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Hami 頁分級。
   - IMDb Certifications（使用者可編輯）：只有 **Taiwan 0+**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt28023907/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：投稿空白。
5. **觀眾評分**：MDL **7.8**（220 人，https://mydramalist.com/748657-last-man-zenmo-no-sosakan ，read）；IMDb **7.5**（128，cache）；Filmarks 連續劇 ★**3.9**、FAKE/TRUTH ★**3.7**（read）。RT：沒有查。
6. **推薦 tag**：
   - C：Filmarks 2023 日本ドラマ #14
   - D：VR 家族（VR23 總合 #2 最終回 24.2%；VRR #23；DRM 2023 #3 12.9%）算一次
   - F：PTT 2023 回顧 #3（並列，pemberley）
   - G：KKTV 2023 熱播 #3、男配角（大泉洋）
7. **前置作品**：**原創劇**（`原作` 空白，read）。特別篇與電影接連續劇，**要依序看**（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/314916.do?cs=2 (下架時間 2028-01-09). LINE TV https://www.linetv.tw/drama/21225/eps/1 says 「授權到期」 (**lapsed**). The 2025 special 「Last Man ―全盲搜查官－ FAKE/TRUTH」 is on LINE TV https://www.linetv.tw/drama/21250/eps/1 (live) and Hami 314294. — 證據：The Hami page loaded on 2026-11-09 with the title and the licence date. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ / 刑事ドラマ`（read）。**符合本篇（刑事搭檔）**。

## 10. GO HOME

1. **片名**：**GO HOME～警視廳身分不明者諮詢室～**（LINE TV）；Hami 寫 GO HOME–警視廳身分不明者諮詢室–（tw-availability-2）／GO HOME〜警視庁身元不明人相談室〜／*Go Home*（IMDb）
2. **劇情**：三田櫻（小芝風花）在警視廳「身元不明人相談室」工作，從身分不明遺體留下的線索查明死因、找出身分，把遺體送回家人身邊；搭檔是個性相反、大她 10 歲的同期月本真。日文維基あらすじ：「身元不明のご遺体…に残されたわずかな手がかりから死の真相を明らかにして特定し、関係者のもとへ帰す」。來源：https://ja.wikipedia.org/wiki/GO_HOME〜警視庁身元不明人相談室〜 （read；沒有英文維基條目）
3. **季數與狀態**：1 季 10 集，日本電視台「土ドラ9」，2024-07-13 到 09-28（週六 21:00–21:54，54 分鐘）（日文維基，read）。**已完結**，沒有讀到續季。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications：**完全沒有資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32856834/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：遺體是題材核心（判斷）。
5. **觀眾評分**：MDL **7.8**（108 人，https://mydramalist.com/769163-go-home-keishicho-mimoto-fumeinin-sodanshitsu ，read）；IMDb **6.5**（23 票，cache；本篇最低、樣本極小）；Filmarks ★**3.4**（read，本篇最低）。RT：沒有查。
6. **推薦 tag**：
   - D：VR24 總合 #17 14.4%
   - F：PTT 2024 回顧 遺珠＋推文 1（pemberley）
   - G：KKTV 2024 熱播 #10
   - （merged 表只有 DFG 三類，**每類都只有一個弱訊號**，是本篇推薦強度最弱的一部。）
7. **前置作品**：**原創劇**（`原作` 空白，read）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/268346.do?cs=2. LINE TV (VIP): https://www.linetv.tw/drama/22252/eps/1 (「已完結 / 共 10 集」). — 證據：Both pages loaded on 2026-11-09 with the title. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`（read，沒有細分）；內容是警察單位查身分不明遺體。**符合本篇（警察辦案）**，調性偏人情。

## 11. Emergency Interrogation Room

1. **片名**：**女王偵訊室**（S4／第四季）（Hami, myVideo, friDay; zh-Wikipedia lists the Taiwan name as 女王偵訊室）（tw-availability-2）／緊急取調室／*Emergency Interrogation Room*
2. **劇情**：背負失敗責任被調職的女刑警真壁有希子，在警視廳搜查一課「緊急事案對應取調班（キントリ）」，和一群各有毛病的老刑警，靠偵訊室裡的心理攻防讓嫌犯開口。日文維基概要：「失敗の全責任を負わされた刑事・真壁有希子が、左遷先の…（通称・キントリ）で一癖も二癖もある犯人たちと対決する刑事ドラマ」「S2からは取調べとその対象との駆け引きや心理戦が中心の原則一話完結」。來源：https://ja.wikipedia.org/wiki/緊急取調室 （read；沒有英文維基條目）
3. **季數與狀態**：朝日電視台「木曜ドラマ」（週四 21:00–21:54，54 分鐘），主演天海祐希；**5 季＋2 部特別篇＋電影，系列已用電影收尾**（日文維基 infobox，read）：
   - FIRST SEASON：9 集，2014-01-09 到 03-13
   - ドラマスペシャル：2015-09-27（130 分鐘）
   - SECOND SEASON：9 集，2017-04-20 到 06-15
   - 3rd SEASON：10 集，2019-04-11 到 06-20
   - **4th SEASON：9 集，2021-07-08 到 09-16**（候選檔得獎的是這一季）
   - 新春ドラマスペシャル：2022-01-03（125 分鐘）
   - **5th SEASON：9 集，2025-10-16 到 12-18**
   - **電影《劇場版 緊急取調室 THE FINAL》：2025-12-26 上映**
   - 合計連續劇 46 集；IMDb 寫「47 eps 2014–2025」（cache），差異可能是把特別篇算進去。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 Hami／myVideo 頁分級。
   - IMDb Certifications（使用者可編輯）：**Japan 13+ streaming**；沒有 Taiwan 列；South Korea 15 self-applied、Philippines 18+ self-applied（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt3301678/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：投稿空白；以偵訊對話為主（日文維基概要）。
5. **觀眾評分**：MDL S1 **7.6**（439 人，https://mydramalist.com/8406-kinkyu-torishirabeshitsu ）、S4 **7.7**（56 人，https://mydramalist.com/699967-kinkyu-torishirabeshitsu-4 ）、S5 **7.9**（15 人，https://mydramalist.com/798780-kinkyu-torishirabeshitsu-season-5 ）（皆 read；S2、S3 沒讀）；IMDb **7.4**（135，系列合併，cache）；Filmarks S1 ★**4.0**、S2 ★**4.0**、S3 ★**3.9**、S4 ★**3.9**、S5 ★**3.9**、新春SP ★**3.8**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：TDA 優秀 2022（S4）
   - D：VR 家族（VR25 總合 #7 16.5%、RT #6；DRM 2025-10 cour #3 9.0%，皆 S5）算一次
   - E：ORICON 2025 滿足度 #8（3.45，S5）
   - F／G：無
   - 注意：merged 表把 A（S4）與 D/E（S5）合在同一列，**得獎是 S4、收視是 S5**。
7. **前置作品**：**原創劇**（`原作` 空白，read）。單元劇為主，但主角的私人主線（丈夫殉職之謎）貫穿 S1（日文維基概要）。**從 S1 看最好；只看 S4 也看得懂單元案件**（判斷）。電影是系列完結篇。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/321851.do?cs=2 (「女王偵訊室S4」). myVideo: https://www.myvideo.net.tw/details/3/19638 (「女王偵訊室 第四季」, live). — 證據：Both pages loaded on 2026-11-09. LINE TV's KKTV migration list (2026-01-22) also names 女王偵訊室S4; no LINE TV page was checked. — **confirmed (service page)**（tw-availability-2）
   - ⚠️ tw-availability 只確認了 **S4**。S1–S3、S5、電影在台灣的串流狀態沒有查。
- **類型核對**：日文維基 `ジャンル = 刑事ドラマ`（read）。**符合本篇（刑事偵訊）**。

## 12. School Lawyer

1. **片名**：**我們還不懂那顆星球的校規**（tw-availability-2；fans 檔原標「PTT 用法」，LINE TV 頁已確認同名）／僕達はまだその星の校則を知らない（略稱 ぼくほし）／*School Lawyer*（MDL：*School Lawyer: Finding the Colors of the Stars*）
2. **劇情**：膽小的律師白鳥健治，被派到一所因少子化而由男校、女校合併的私立高中，每週駐校三天處理校內問題；他自己因學生時代被霸凌而對學校有陰影。日文維基あらすじ：「臆病な弁護士・白鳥健治は少子化により男子校と女子校が併合した私立高校に週に3日派遣されることになる。学生時代にいじめられた経験から学校にトラウマを持つ」。來源：https://ja.wikipedia.org/wiki/僕達はまだその星の校則を知らない （read；沒有英文維基條目）
3. **季數與狀態**：1 季 11 集，關西電視台製作・富士電視台系「月曜22時枠」，2025-07-14 到 09-22（週一 22:00–22:54，54 分鐘），主演磯村勇斗（日文維基，read）。**已完結**，沒有讀到續季。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications：**完全沒有資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt37577594/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：題材涉及校園霸凌（日文維基あらすじ）。
5. **觀眾評分**：MDL **8.0**（101 人，https://mydramalist.com/793186-bokutachi-wa-mada-sono-hoshi-no-kosoku-wo-shiranai ，read）；IMDb **6.9**（17 票，cache；本篇票數最少）；Filmarks ★**4.1**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：DA best 2025Q3（#125）
   - B：RS2025 2/5（明日 #1、藤原 #3）；EC2025（あまの、まっつ top 5）
   - F：PTT 2025 推薦 喜歡＋推文 約 4（episold）；PTT 2025 回顧 #4＋推文 2（pemberley）；MDL 使用者清單 #2
   - （評論圈很強、國際評分樣本極小，兩者落差大。）
7. **前置作品**：**原創劇**（`原作` 空白，read）。
8. **台灣串流**：LINE TV (VIP): https://www.linetv.tw/drama/18212/eps/1 — 證據：The LINE TV page was live on 2026-11-09 (VIP badges). KKTV was the original 2025 simulcast. — **confirmed (service page)**（tw-availability-2）
   - ⚠️ tw-availability-2 註明：**只靠 LINE TV 一個平台**，而 LINE TV 狀態是伺服器 HTML 推測法，最好用台灣裝置確認。
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`（read）；內容是**校園律師劇**（學校內的法律與人際問題），**不是犯罪懸疑**。放本篇要寫明「校園律師劇」，或移到職人篇。

## 13. Light of My Lion

1. **片名**：**獅子的藏身處**（LINE TV page）（tw-availability-1）／ライオンの隠れ家／*Light of My Lion*
2. **劇情**：茨城縣浦尾市公所職員小森洸人，在父母意外過世後照顧患有自閉症的弟弟美路人，兄弟過著規律的日子；直到一個自稱「獅子」的神祕小男孩出現。英文維基 Premise：「Hiroto Komori… has been living with and caring for his younger autistic brother, Michito」（read）；IMDb 簡介：「The appearance of a mysterious little boy interrupts the quiet, predictable life shared by an artist with autism and his caring older brother」（cache）。來源：https://en.wikipedia.org/wiki/Light_of_My_Lion
3. **季數與狀態**：1 季 11 集，TBS「金曜ドラマ」，2024-10-11 到 12-20（週五 22:00–22:54，54 分鐘），主演柳樂優彌（日文維基，read）。**已完結**，沒有讀到續季。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Japan、Taiwan 列；US **TV-14 Netflix rating**、Singapore PG13、Netherlands 13+（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt33710504/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：投稿空白；故事涉及兒童與家暴／失蹤情節（判斷，未查來源，不要寫進文章）。
5. **觀眾評分**：MDL **8.5**（3,212 人，https://mydramalist.com/773785-lion-no-kakurega ，read）；IMDb **8.0**（696，cache）；Filmarks ★**4.2**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：Minpo 優秀 2025
   - B：RS2024 1/5（田幸 #2）
   - C：MDL #15 8.5
   - D：VR24 總合 #12 最終回 15.4%（TS #7）
   - F：PTT 2024 推薦＋推文 1（episold）；PTT 2024 回顧 #5＋2025 回顧重刷（**皆 pemberley，算一聲**）
   - G：KKTV 2024 最佳男配角（坂東龍汰）
   - （已刪：JT2024 mention，not counted。）
7. **前置作品**：**原創劇**（`原作` 空白，read）。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/21227/eps/1 (moved from KKTV). — 證據：The page loaded on 2026-11-09 with no lapse notice. Linear: 緯來日本台 from 2025-03-03. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：英文維基 genre＝drama（read）；ratings 檔標「family suspense」。**部分符合**：主軸是兄弟家庭劇，懸疑線（神祕男孩的來歷）推動劇情。放本篇要寫明「家庭懸疑」。

## 14. Tokyo Salad Bowl

1. **片名**：**東京沙拉碗**（friDay page）（tw-availability-1）／東京サラダボウル／*Tokyo Salad Bowl*
2. **劇情**：綠頭髮的警察鴻田麻里與前警察口譯員有木野了搭檔，在外國居民愈來愈多的東京處理涉外案件。IMDb 簡介：「Mari, a green-haired cop, and Ryo, a former police interpreter, team up to solve international cases in Tokyo while connecting with foreign residents」（cache）；日文維基原作あらすじ只讀到第一句「外国人による事件や犯罪が多く取り上げられる今の日本」（read）。
3. **季數與狀態**：1 季 9 集，NHK 綜合「ドラマ10」，2025-01-07 到 03-04（週二 22:00–22:45，45 分鐘）（日文維基原作條目的ドラマ infobox，read）。**已完結**，沒有讀到續季。原作漫畫續篇（2nd dish）2026-04-20 起在《コミックDAYS》連載（日文維基導言，read），不是劇集消息。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Japan、Taiwan 列；Singapore M18（部分集 PG）、Argentina 13（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35435312/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：投稿空白。
5. **觀眾評分**：MDL **7.9**（584 人，https://mydramalist.com/778580-tokyo-salad-bowl ，read）；IMDb **7.3**（234，cache）；Filmarks ★**4.0**（read）。RT：沒有查。
6. **推薦 tag**：
   - A：TDA 優秀 2025
   - B：RS2025 1/5（田幸 #2）；EC2025（苫 top 5）
   - C：Filmarks Awards 2025 TVドラマ nominee
   - F：PTT 2025 推薦 喜歡＋推文 3（episold）；PTT 2025 回顧 遺珠（pemberley）；MDL 使用者清單 #15
7. **前置作品**：改編自**黑丸的漫畫**《東京サラダボウル-国際捜査事件簿-》（2021–2024 連載，日文維基，read）。不必先看原作。
8. **台灣串流**：friDay影音: https://video.friday.tw/drama/detail/3926 (全9集). Not found on 公視+. — 證據：The page loaded on 2026-11-09 with the title. 聯合報 2025-01-08: 「每周三在friDay影音上架」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：日文維基漫畫 `ジャンル = 警察漫画`、ドラマ `連続ドラマ`（read）；IMDb「Crime Drama」（cache）。**符合本篇（警察涉外辦案）**。

## 15. Their Marriage

1. **片名**：**幸福的婚姻**（Netflix; TW media）（tw-availability-2）／しあわせな結婚／*Their Marriage*
2. **劇情**：當過檢察官的名律師原田幸太郎（阿部サダヲ）在節目錄影時病倒，出院後與在醫院電梯裡遇見的美術老師鈴木ネルラ閃電結婚，結束 50 年的單身；但ネルラ有一個沒說的大祕密。日文維基あらすじ（read）；IMDb：「Nera has a big secret that she has not revealed」（cache）。來源：https://ja.wikipedia.org/wiki/しあわせな結婚
3. **季數與狀態**：1 季 9 集，朝日電視台「木曜ドラマ」，2025-07-17 到 09-11（週四 21:00–21:54，54 分鐘）（日文維基，read）。**已完結**。Filmarks 另有「しあわせな結婚 スピンオフドラマ」條目（★3.9，read），播出形式沒查。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 Netflix 頁分級。
   - IMDb Certifications（使用者可編輯）：**Taiwan 13+ Netflix rating**；沒有 Japan 列；South Korea 15、Singapore PG13（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt37498110/parentalguide/ ）：**五類都沒有投票**。
   - 需要提醒：投稿空白。
5. **觀眾評分**：MDL **7.2**（275 人，https://mydramalist.com/787848-shiawasena-kekkon ，read；本篇 MDL 最低之一）；IMDb **6.6**（168，cache）；Filmarks ★**3.7**（read）。RT：沒有查。
6. **推薦 tag**：
   - B：RS2025（麦倉 #3）
   - C：Filmarks Awards 2025 TVドラマ nominee
   - D：VR25 總合 #12 15.5%（TS #10）
   - （A／E／F／G 都沒有；merged 表 BCD 三類各一個。）
7. **前置作品**：**原創劇**（`原作` 空白，read；腳本大石静，日文維基導言引 Real Sound 標題，read）。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/82084559 — 證據：udn 噓！星聞, 2025-09-20, https://stars.udn.com/star/story/10093/9006391 (「Netflix獨家跟播的2025年夏季日劇《幸福的婚姻》」) — **confirmed (Taiwan media, 2025-09-20)**（tw-availability-2）
- **類型核對**：日文維基 `ジャンル = 連続ドラマ`（read）；IMDb 標「Drama Romance」（cache）；ratings 檔標「marriage suspense」。**類型不完全符合**：是**婚姻懸疑劇**（妻子的過去之謎），不是犯罪或動作劇，放本篇要說清楚。

## 16. Last Samurai Standing

1. **片名**：**武士生死鬥**（Netflix Taiwan YT）（tw-availability-1）／イクサガミ／*Last Samurai Standing*
2. **劇情**：明治時代，292 名武士為了 10 萬圓獎金聚集在京都天龍寺，規則是搶奪彼此的木牌、一路走到東京，最後到的人獲勝；主角嵯峨愁二郎為了病重的妻兒參加。英文維基 Synopsis：「292 fighters come together at Tenryū-ji Temple in Kyoto… take each other's wooden tags and make it all the way to Tokyo… Shujiro Saga, joins the dangerous contest with a personal mission: to help his sick wife and child」。來源：https://en.wikipedia.org/wiki/Last_Samurai_Standing_(TV_series) （read）
3. **季數與狀態**：Netflix 原創，**第 1 季 6 集，2025-11-13 上線**，每集 47–58 分鐘（英文維基，read；日文維基「2025年11月13日に配信」，read）。主演兼製作岡田准一、導演藤井道人（日文維基引 Real Sound，read）。
   - **第 2 季已確認製作**：英文維基「A second season was confirmed by Netflix Japan」，引 NetflixJP 2025-12-18 推文「Netflixシリーズ『イクサガミ』【シーズン2】制 作 決 定！」（read）。MDL 第 2 季條目集數 0、沒有播出日期（read）。**沒有上線日期**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Netflix 頁分級。
   - IMDb Certifications（使用者可編輯）：**Japan R15+**、**Taiwan 16+**；US TV-MA、UK 15、South Korea 15、China (Banned)（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32237534/parentalguide/ ）：Sex & Nudity **None**（31 of 39）、Violence & Gore **Severe**（34 of 45；「decapitations, mutilations, blood spurting and disembowelments are shown」）、Profanity **Mild**（13 of 22）、Alcohol, Drugs & Smoking **Mild**（15 of 24）、Frightening & Intense **Moderate**（16 of 27）。
   - 需要提醒：**斬首、肢解、開腸等血腥暴力**。本篇 Parents Guide 票數第二多（22–45）。
5. **觀眾評分**：MDL **8.3**（2,755 人，https://mydramalist.com/768543-last-samurai-standing ，read）；IMDb **7.5**（23K，cache）；Filmarks S1 ★**3.9**（read）；RT Tomatometer **100%**（12 則）、Popcornmeter 86%（https://www.rottentomatoes.com/tv/last_samurai_standing ，read）。
6. **推薦 tag**：
   - B：RS2025（麦倉 #4）
   - C：IMDb 7.5（23K）
   - D：Netflix H2 2025 S1 21M
   - F：PTT 2025 秋季推薦 #3（Roy34）；MDL 使用者清單 #10
   - G：Netflix TW 2025-11-30 #10（累計 3 週）；VERSE 2025 必看十部
   - （已刪：ContentAsia 全球非英語第 2 名 31.7M 小時、Reddit r/JDorama 票選留言，皆 snippet。）
7. **前置作品**：改編自**今村翔吾的小說**《イクサガミ》（英文維基 `based_on`，read）。不必先看原作。**第 1 季沒有把故事講完**（第 2 季已確認）；這句是根據續季消息的推論，寫文前最好核對結局。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81607397 — 證據：https://www.youtube.com/watch?v=fpmPNQ_VNQY 「《武士生死鬥》| 正式預告 | Netflix」, Netflix Taiwan, 2025-10 (search date 2025-10-26; the description says 2025-11-13 launch and links title 81607397). — **confirmed (official channel)**（tw-availability-1）
- **類型核對**：英文維基 genre＝Action / Historical drama / Jidaigeki（read）；日文維基小說 `ジャンル = 時代小説、デスゲーム`。**符合本篇（動作，時代劇大逃殺）**。

## 17. Alice in Borderland

1. **片名**：**今際之國的闖關者**（Netflix Taiwan YT）（tw-availability-1）／今際の国のアリス／*Alice in Borderland*
2. **劇情**：沉迷電玩、無所事事的青年有栖良平和兩個朋友，突然被傳送到空無一人的另一個東京，必須參加生死遊戲才能活下去。英文維基 Premise：「Ryōhei Arisu and his two friends are suddenly transported to an alternate, desolate Tokyo, where they must play life-or-death games to survive」。來源：https://en.wikipedia.org/wiki/Alice_in_Borderland_(TV_series) （read）
3. **季數與狀態**：Netflix 原創，**3 季共 22 集，已完結**，每集 41–80 分鐘（英文維基，read）。
   - 第 1 季：8 集，2020-12-10 上線
   - 第 2 季：8 集，2022-12-22 上線
   - 第 3 季：6 集，2025-09-25 上線（日文維基「8+8+6」，read）
   - **第 3 季是最終季**：英文維基「Although the third season was not originally labelled as the last, Netflix stated in a January 2026 article that it had been the show's final」，引 Netflix〈What We Watched the Second Half of 2025〉（read）。
   - 全 22 集由佐藤信介執導（英文維基，read）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Netflix 頁分級。
   - IMDb Certifications：**沒有讀到**（jina 只回傳內文段落，沒有 Certifications 區）。
   - IMDb Parents Guide（**partial**，https://www.imdb.com/title/tt10795658/parentalguide/ ；類別標題沒回傳，以下類別名是依頁面固定順序推定）：Sex & Nudity **Moderate**（352 of 1006）、Violence & Gore **Severe**（381 of 454）、Profanity **Mild**（247 of 356）、Alcohol, Drugs & Smoking **Mild**（266 of 346）、Frightening & Intense **Severe**（303 of 382）。投稿提到：項圈爆炸使脖子炸開的處決方式反覆出現；硫酸；S1 第 6 集有一名女性被壓制、遭威脅性侵（未遂）；有性愛場面；S3 有角色注射毒品的回憶畫面。
   - 需要提醒：**大量死亡遊戲暴力、性侵未遂場面、性愛場面、毒品**。本篇票數最多（346–1006）。
5. **觀眾評分**：MDL S1 **8.9**（99,781 人，https://mydramalist.com/39537-imawa-no-kuni-no-arisu ）、S2 **8.9**（61,952 人，https://mydramalist.com/684373-imawa-no-kuni-no-alice-2 ）、S3 **8.1**（24,022 人，https://mydramalist.com/757971-imawa-no-kuni-no-alice-season-3 ）（皆 read；本篇評分人數最多）；IMDb **7.8**（154K，三季合併，cache）；Filmarks S1 ★**3.9**、S2 ★**4.0**、S3 ★**3.5**（read）；RT Tomatometer **78%**（30 則）、Popcornmeter 79%（https://www.rottentomatoes.com/tv/alice_in_borderland ，read；系列頁，沒有分季）。**S3 在 MDL 與 Filmarks 都明顯低於前兩季。**
6. **推薦 tag**：
   - C：IMDb 7.8（154K）；MDL S2 #2 8.9、S1 #3 8.9
   - D：Netflix H2 2025 S3 25M
   - E：Parrot 2026：2025 年動漫 IP 改編真人劇需求領頭
   - G：Netflix TW 2025-10-05 S3 #3（累計 3 週）
   - （已刪：Variety「S2 200M 小時」、ContentAsia、NF23H1「returning favorite」、DailyView 月榜 #1，皆 snippet；PTT〈這樣改保證今際之國變神劇〉為負評、S27 不計。）
7. **前置作品**：改編自**麻生羽呂的漫畫**《今際の国のアリス》（英文維基 `based_on`，read）。不必先看原作；**三季要依序看**。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81682895 (the link given in the S3 trailer description) — 證據：https://www.youtube.com/watch?v=LLnqph_wKFk 「《今際之國的闖關者》第 3 季 | 正式預告 | Netflix」, Netflix Taiwan, 2025-08-26 (per Exa). Also GQ Taiwan 2025-07-08. — **confirmed (official channel)**（tw-availability-1）
- **類型核對**：日文維基 `ジャンル = SF / サスペンスドラマ / アクション / デスゲーム`（read；英文維基 genre 欄沒抓到）。**符合本篇（生存懸疑動作）**。

## 18. YuYu Hakusho（真人版）

1. **片名**：**幽遊白書**（Netflix Taiwan YT）（tw-availability-1）／幽☆遊☆白書（実写ドラマ）／*Yu Yu Hakusho*（英文維基寫 *YuYu Hakusho*）
2. **劇情**：不良高中生浦飯幽助為了救一個孩子被車撞死，獲得復活機會，條件是替靈界擔任處理超自然事件的「靈界偵探」。英文維基 Premise：「Yusuke Urameshi, a delinquent senior high school student… dies after saving a child in a car accident, and gets resurrected to serve as an investigator of the supernatural」。來源：https://en.wikipedia.org/wiki/YuYu_Hakusho_(2023_TV_series) （read）
3. **季數與狀態**：Netflix 原創，**第 1 季 5 集，2023-12-14 上線**，每集 45–56 分鐘（英文維基，read）。主演北村匠海（ciatr，snippet）。
   - **第 2 季：有報導，Netflix 沒有正式確認**。英文維基導言寫「In August 2026, a second season had been greenlit」（read）；但 What's on Netflix（2026-10 前後）寫「Netflix, however, has yet to officially confirm the show's return」（read）；Polygon 2026-08-12、Yahoo 2026-08-13 都用「Reportedly」（snippet）。IMDb 標題列「2023–2027」（cache）。**寫「據報導已在製作第 2 季、Netflix 尚未正式宣布」**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Netflix 頁分級。
   - IMDb Certifications（使用者可編輯）：**Japan 15**、**Taiwan 16+ self-applied**；US TV-14、UK 15、Singapore NC16（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt13664452/parentalguide/ ）：Sex & Nudity **None**（14 of 20）、Violence & Gore **Severe**（9 of 15；「Blood and gore from combat, monster attacks, supernatural body horror, self-harm, and a dramatic car accident」）、Profanity **Mild**（9 of 15）、Alcohol, Drugs & Smoking **Mild**（6 of 10）、Frightening & Intense **Moderate**（9 of 12）。
   - 需要提醒：**打鬥血腥、怪物身體恐怖、自傷畫面**。
5. **觀眾評分**：MDL **8.1**（5,653 人，https://mydramalist.com/683555-yu-yu-hakusho ，read）；IMDb **7.2**（10K，cache）；Filmarks ★**3.6**（read；搜尋結果第一筆「幽☆遊☆白書」，推定是 Netflix 真人版，沒有另開作品頁確認）；RT Tomatometer **83%**（12 則）、Popcornmeter 82%（https://www.rottentomatoes.com/tv/yu_yu_hakusho ，read）。
6. **推薦 tag**：
   - B：RS2023（成馬 #2）
   - C：Filmarks Awards 2024 配信ドラマ nominee
   - D：Netflix H2 2023 17M（「stand-out」）；Netflix H1 2024 8M
   - G：Netflix TW 2023-12-17 #1（累計 3 週）；DailyView 2026-10 月榜 #8（聲量）
7. **前置作品**：改編自**冨樫義博的漫畫**《幽☆遊☆白書》（英文維基 `based_on`，read）；另有 1992 年的電視動畫（Wikidata 條目 Q286950，read）。英文維基寫第 1 季「was criticized for the plot condensing required to fit five episodes」（read）——**原作只演到一部分，看過漫畫或動畫的人比較容易跟上**（判斷）。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81243969 — 證據：https://www.youtube.com/watch?v=osWZiqbzKCE 「《幽遊白書》| 正式前導預告 | Netflix」, Netflix Taiwan, 2023-11-10 (description links title 81243969). — **confirmed (official channel). The evidence is from 2023, but this is a Netflix original.**（tw-availability-1）
- **類型核對**：英文維基 genre＝Action / Adventure / Comedy drama（read）；ratings 檔標「action fantasy」。**類型不完全符合**：是**奇幻動作**（靈界偵探打妖怪），不是犯罪懸疑；放「動作」可以，但要說明是漫改奇幻。

---

## 總結

- **完成 18/18 部**。每部都有日文維基（集數、時段）、MDL、IMDb、Filmarks ★ 與台灣串流。
- **評分一覽**（MDL 分數／人數；IMDb 分數／票數）：

| # | 劇 | MDL | IMDb | Filmarks ★ | RT |
|---|---|---|---|---|---|
| 1 | VIVANT | S1 8.1（935）；S2 7.2（36） | 7.0（1K） | 4.3／S2 4.2 | 無頁 |
| 2 | MIU404 | 8.5（3,589） | 7.3（1.2K） | 4.3 | — |
| 3 | Unnatural 法醫女王 | 8.5（5,969） | 8.1（3K） | 4.4 | — |
| 4 | 99.9 刑事專門律師 | S1 8.3（2,818）；S2 8.3（1,723） | 7.4（670） | 4.1／4.1 | — |
| 5 | 勿說是推理 | 8.5（3,628） | 7.6（679） | 4.1 | — |
| 6 | 輪到你了 | 8.0（1,582）；反撃編 7.9（991） | 7.1（971） | 4.0 | — |
| 7 | 地面師 | 7.7（1,218） | 7.3（3.3K） | 4.1 | 100%（9） |
| 8 | 噬亡村 | S1 8.3（3,646）；S2 8.1（1,672） | 7.4（3.2K） | 4.2／4.1 | 0 則 |
| 9 | Last Man | 7.8（220） | 7.5（128） | 3.9 | — |
| 10 | GO HOME | 7.8（108） | 6.5（23） | 3.4 | — |
| 11 | 女王偵訊室 | S1 7.6（439）；S4 7.7（56）；S5 7.9（15） | 7.4（135） | 3.9–4.0 | — |
| 12 | 校規 | 8.0（101） | 6.9（17） | 4.1 | — |
| 13 | 獅子的藏身處 | 8.5（3,212） | 8.0（696） | 4.2 | — |
| 14 | 東京沙拉碗 | 7.9（584） | 7.3（234） | 4.0 | — |
| 15 | 幸福的婚姻 | 7.2（275） | 6.6（168） | 3.7 | — |
| 16 | 武士生死鬥 | 8.3（2,755） | 7.5（23K） | 3.9 | 100%（12） |
| 17 | 今際之國的闖關者 | S1 8.9（99,781）；S2 8.9（61,952）；S3 8.1（24,022） | 7.8（154K） | 3.9／4.0／3.5 | 78%（30） |
| 18 | 幽遊白書 | 8.1（5,653） | 7.2（10K） | 3.6 | 83%（12） |

- **季數與續作**：
  - **VIVANT**：S1 10 集（2023）＋S2 14 集（2026-07-26～11-08，剛播完）；**電影 2026-12-04 上映**。
  - **今際之國**：3 季 22 集（2020／2022／2025），**Netflix 2026-01 確認 S3 是最終季**。
  - **噬亡村**：2 季 15 集（2022–23／2025），**S2 是完結篇**（Disney+ 官方新聞稿，snippet），S2 起 18+。
  - **女王偵訊室**：5 季（2014／2017／2019／2021／2025）＋2 部特別篇＋電影《THE FINAL》（2025-12-26），系列完結。
  - **武士生死鬥**：S1 6 集（2025-11-13），**S2 已確認製作**（NetflixJP 2025-12-18），沒有日期。
  - **幽遊白書**：S1 5 集（2023），**S2 只有報導、Netflix 未正式確認**。
  - **地面師**：S2 沒有正式宣布。
  - 有電影版：99.9（2021）、勿說是推理（2023）、輪到你了（2021）、Last Man（2025，台灣 2026-08-21 上映）、女王偵訊室（2025）、VIVANT（2026-12）；MIU404／Unnatural 共享電影《ラストマイル》（2024）。
  - 其他已完結單季：MIU404、Unnatural、GO HOME、校規、獅子的藏身處、東京沙拉碗、幸福的婚姻。
- **原作**：漫畫改編 5 部（勿說是推理、噬亡村、東京沙拉碗、今際之國、幽遊白書）；小說改編 2 部（地面師、武士生死鬥）；其餘 11 部原創（VIVANT、MIU404、Unnatural、99.9、輪到你了、Last Man、GO HOME、女王偵訊室、校規、獅子的藏身處、幸福的婚姻）。
- **分級與內容提醒**：
  - 台灣平台頁分級只有一筆：**噬亡村 Disney+ TW 18+**（IMDb 寫 Taiwan 15+ self-applied，不一致，用 18+）。
  - IMDb 的 Taiwan 列（旁證）：武士生死鬥 16+、幽遊白書 16+ self-applied、地面師 15+、幸福的婚姻 13+ Netflix rating、VIVANT／勿說是推理／Last Man 0+。
  - IMDb 的 Japan 列（旁證）：噬亡村 R18+、地面師 R18+、武士生死鬥 R15+、幽遊白書 15、MIU404 16+ self-applied、Unnatural 16+ self-applied、女王偵訊室 13+ streaming。
  - **要特別提醒**：**噬亡村**（食人、血腥、兒童遇害）、**地面師**（五類全在 Moderate 以上）、**武士生死鬥**（斬首、開腸）、**今際之國**（死亡遊戲暴力、性侵未遂場面、性愛、毒品）、**幽遊白書**（血腥打鬥、自傷）。
  - 12 部無線台日劇 Parents Guide 完全沒有投票（Unnatural 只有 1–2 票）。
- **類型核對**：
  - **符合**（14）：VIVANT（諜報）、MIU404、Last Man、女王偵訊室（刑事）、Unnatural（法醫）、99.9（刑事辯護）、勿說是推理、輪到你了（推理）、地面師（犯罪）、噬亡村（恐怖懸疑）、GO HOME、東京沙拉碗（警察）、武士生死鬥（時代劇動作）、今際之國（生存動作）。
  - **部分符合**（1）：獅子的藏身處——家庭劇為主、懸疑線推動，寫「家庭懸疑」。
  - **不完全符合**（3）：**我們還不懂那顆星球的校規**（校園律師劇）、**幸福的婚姻**（婚姻懸疑）、**幽遊白書**（漫改奇幻動作）。
- **台灣串流風險**：
  - 校規只靠 LINE TV（推測法）。
  - 女王偵訊室只確認 S4（Hami、myVideo）。
  - Last Man 在 LINE TV 已授權到期，連續劇只剩 Hami（下架時間 2028-01-09）；FAKE/TRUTH 特別篇在 LINE TV、Hami。
  - 99.9 在 Netflix，但 tw-availability 沒寫是哪幾季。
  - 幽遊白書、地面師的台灣證據分別是 2023、2024 年，但都是 Netflix 原創。

## 無法查證的事實

1. **噬亡村「S2 完結」與「18+」**：只有 Disney+ 日本新聞稿的搜尋摘要（snippet）；直接讀官方頁被轉址到 disneyplus.com/explore。S2 最終集日期：日文維基 2025-04-30 vs dplus-navi 2025-04-23，未核。
2. **幽遊白書第 2 季**：英文維基寫「greenlit」，但 What's on Netflix 寫 Netflix 尚未正式確認；Polygon、Yahoo 只看到摘要。
3. **今際之國 IMDb Parents Guide**：jina 回傳的版本沒有類別標題與 Certifications，類別名依頁面順序推定（partial）。
4. **Filmarks Mark 數**：18 部都沒讀到（前端渲染）；★ 分數來自搜尋結果頁，幽遊白書沒有開作品頁確認是真人版條目。
5. **台灣平台分級**：tw-availability 只記了噬亡村 Disney+ 18+；其餘 17 部的 friDay／Hami／LINE TV／Netflix 頁分級沒有查。
6. **IMDb 標題頁都是 cache**；VIVANT 快取頁仍顯示 S2 下一集日期，票數可能已過時。
7. **VIVANT US TV-MA vs Taiwan 0+**、**噬亡村 Taiwan 15+ vs Disney+ TW 18+** 的落差，原因未查。
8. **女王偵訊室集數**：日文維基各季加總 46 集，IMDb 寫 47 集，差異沒有核對。
9. **輪到你了劇場版**的劇情設定（平行世界版本）沒有讀到來源，欄位 7 已註明不要寫進文章。
10. **Last Man、東京沙拉碗、地面師的劇情**來自 IMDb 簡介（cache），不是維基。
11. 所有 Netflix TW 上架狀態：沒有台灣 IP，netflix.com/tw 頁不是證據（沿用 tw-availability 規則）。

## toolDegradation

- **Groundlane `web_extract`**：日文／英文 Wikipedia raw、MyDramaList（含站內搜尋）、Filmarks 搜尋頁、Rotten Tomatoes 都正常。
  - 第一次對 VIVANT 用太寬的 pattern 觸發 `OUTPUT_LIMIT`；英文維基 genre 多行 pattern 用到巢狀量詞被拒（`extract.pattern.high_risk`），改成扁平 pattern 後成功。
  - 日文維基 `ラストマン－全盲の捜査官－`（全形連字號）404，用 MediaWiki API 查到正確條目 `ラストマン-全盲の捜査官-`。
  - MDL 頁「Score: X (scored by N users)」pattern 抓不到（HTML 有標籤），改抓「Ratings: X/10 from N users」。
  - Filmarks 作品頁 Mark 數是 Vue 模板變數，伺服器 HTML 讀不到。
  - Disney+ 日本新聞頁被轉址到 disneyplus.com/explore，讀不到內文。
- **Groundlane `web_fetch`**：Wikidata SPARQL、Wikipedia API 正常。
- **Groundlane `web_search`**：Tavily、Exa 後端回 unavailable，結果來自 Brave／You.com（有一次 Brave 也 unavailable，只剩 You.com）。只用來找續季新聞。
- **IMDb 標題頁**：沿用韓劇做法，直接用 Exa `web_fetch_exa`（cache，18/18；Last Man、緊急取調室第一次 `CRAWL_LIVECRAWL_TIMEOUT`，重試成功）。Exa `web_search_exa` 用來找 Last Man 的 IMDb ID。
- **IMDb Parents Guide**：jina `read_url`（無 key，`question` 參數無效、回全文）18/18 有回應，今際之國只回部分內文（partial）。
- **沒有使用**：Tavily MCP（任務說明可能額度不足，Groundlane 內部的 Tavily 也 unavailable）、Firecrawl（額度用完）、終端機 curl（環境封鎖）。
