# 台劇 1 事實表：懸疑、犯罪與驚悚（13 部）

- 查核日：2026-11-26（回讀原文）；初稿 2026-11-13（MCP 斷線期間，只有 snippet）。順序照 `post-tw1-shows.txt`，但照 `split-proposal.md`「待處理」段**移出 3 部**：忘了我記得、此時此刻 → 第 3 篇（18 愛情家庭）；火神的眼淚 → 第 2 篇（17 社會職人）。三部的初稿原文保留在檔尾「已移出」小節，沒有刪改。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了（Groundlane 直接抓、jina 即時抓）；**cache** 表示 Exa 回傳的頁面快取或搜尋結果裡的頁面內容（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。這一輪回讀後，凡是還標 snippet 的，都是原文沒有讀到、只剩初稿 2026-11-13 `WebSearch` 摘要的欄位。
- 標 **（候選檔，read）** 的數字與名次，是照抄 `candidates-*.md` 裡原本標 read 的資料，不是這一輪重新讀的。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫；這一輪讀到的平台 ID 或分級另列「補充」，不改原判定。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。C 類裡的 IMDb／MDL 數字維持候選檔當時的值（tag 是「當時上榜」的記錄），最新值寫在欄位 5。
  - **金鐘獎算 A 類**（awards 檔開頭說明：評審團是業界人士，不是政府選），所以台劇**沒有「官方榜」欄**。
  - **B 類裡的 LINE TODAY 聚光賞（`LINE2024`／`LINE2025`）不計**（merged 檔規則）；聚光賞只在 fans 檔當 G 類算。本篇 13 部的 B 類只用到 `KM2025`（台灣劇評人年度榜）與 `TNL2023`（關鍵評論網徐佑德）。
  - 金鐘個人獎（演技、編劇等）awards 檔沒有收成 tag，只在備註提到，這裡也只附註。
- **「只算一次」的規則**：ratings 檔 §5 的資料家族——IMDb、MDL、豆瓣（DB*）、Netflix（NFG＋NF23H1／NF25／NF26H1）、Google（GYS*）、DailyView／KEYPO（DV*）——同一家族在同一部劇只算一個，並列在同一個括號裡。fans 檔裡 S2、S3、S17 的「原 PO 看過清單」強度弱，照 fans 檔備註寫明。
- **欄位 4 分級要分三層看**：
  1. **台灣分級**（普／護／輔12／輔15／限）：只採台灣平台頁本身標的（Hami Video `meataRating`／`data-rating`、LINE TV「內容標籤」、Disney+「分級：」）。這輪讀到 4 部：死了一個娛樂女記者之後（Hami 輔12）、零日攻擊（Hami 護、LINE TV 輔12，**兩平台不一致**）、八尺門的辯護人（LINE TV 輔15）、台灣犯罪故事（Disney+ 15+，Disney+ 自家年齡標，不是普護輔限，且抓取 IP 不在台灣，只算旁證）。公視+ 頁要 JS 渲染，讀不到分級。Netflix 頁沒有台灣 IP 不算證據，所以 9 部 Netflix 劇**沒有台灣分級資料**。
  2. IMDb Certifications 的 Taiwan 列是**使用者可編輯**資料，只算旁證（例如模仿犯 Taiwan 18+、太陽 15+，不等於台灣官方分級）。IMDb Parents Guide 是使用者投稿與投票，嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。
  3. MDL Content Rating 也是使用者／編輯填的，一併列出但只是旁證。
- **Parents Guide 多半是空的**：13 部裡有投票的只有 模仿犯（每類 3–8 票）、回魂計（1–5 票）、乩身（1–5 票）。其餘 10 部五類全是「No data／No voting data」。
- **欄位 5 豆瓣**：sec.douban.com 與豆瓣頁面本體都沒有碰。只用候選檔已有的（DB22／DB23 年度榜位置，沒有分數）。本篇 13 部只有 八尺門（DB23 #6）、她和她的她（DB22 #2）有豆瓣資料；其餘 11 部候選檔沒有，**也沒有讀到媒體引述**，欄位寫「無」。

## 這份資料的限制

1. **MDL 與 IMDb 的樣本差很多**。MDL 人數最多的是 太陽 Pt1（3,209）、模仿犯（3,176）、誰是被害者 S1（2,739）、太陽 Pt2（2,404）；最少的是 死了一個娛樂女記者之後（17）、八尺門（47）、零日攻擊（48）、台灣犯罪故事（86）——這四部的 MDL 分數幾乎不能用。IMDb 只有 模仿犯（3K）、誰是被害者（2.4K）、華燈初上（1.8K）過千；死了一個娛樂女記者之後 只有 111 票、台灣犯罪故事 275 票。
2. **八尺門的辯護人 MDL「7.7／47 人」是真的**（2026-11-26 讀 MDL 原頁），初稿懷疑是舊快取而「不採用」，這輪改為採用，但要寫明樣本很小。它的口碑主要在金鐘（2024 迷你劇集獎）與 IMDb 8.1（552），不在 MDL。
3. **零日攻擊 IMDb 4.9（884）是本篇最低**，MDL 7.0 只有 48 人；兩平台方向相反、政治題材可能有刷分（推論，沒有查證）。分數不要拿來代表作品品質，要寫明評價兩極。台灣分級兩個平台也不一致（Hami 護、LINE TV 輔12）。
4. **MDL「Ranked」是全站名次**（例如模仿犯全站 #2,020，候選檔 Top Taiwanese 是 #21），**不是**候選檔的「Top Taiwanese」名次；本檔欄位 5 寫的 MDL 名次一律標明是哪一種。
5. **IMDb 分數讀取方式不一**：Exa `web_fetch_exa`（cache）讀 8 部、Exa 搜尋結果裡的頁面內容（cache）3 部、jina `read_url`（read）1 部（死了一個娛樂女記者之後）。Parents Guide 與 Certifications 13 部都是 jina 讀全頁（read）。讀取時間不同，票數可能差幾票。
6. **分級沒有官方來源可以普遍引用**：台灣平台頁只有 4 部有標，而且零日攻擊兩平台互相矛盾；IMDb 各國 certification 都是使用者填的，不要直接寫成「台灣分級」。
7. **台灣串流沒有台灣 IP 驗證**（沿用 tw-availability 的規則）；Netflix 劇多半只有官方 YouTube／新聞稿／台灣媒體證據。這輪從 zh.wikipedia infobox 與 Exa 搜尋結果看到幾個 tw-availability 沒有的 Netflix title ID（模仿犯 81461539、華燈初上 81477952、回魂計 81715542、乩身 81477955、她和她的她 81622630），以及 太陽 的另一個 ID（81766274，tw-availability 寫 81766275），都只當線索，沒有改欄位 8。
8. **類型核對**：13 部都可放進「懸疑、犯罪與驚悚」，但三部要寫明調性：**乩身**（zh.wikipedia 類型只寫「奇幻」，Netflix genre「Fantasy」；重心是奇幻動作）、**正港分局**（犯罪喜劇）、**零日攻擊**（zh.wikipedia「架空歷史、反烏托邦、戰爭」，是政治戰爭劇，懸疑成分有限）。
9. **候選 tag 偏誤**：fans 檔 F 類主要來自兩串 PTT「懸疑推理推薦」（S2、S3），主題本身就偏推理劇，會把誰是被害者、模仿犯、台灣犯罪故事 的 F 訊號拉高；G 類的 Netflix 台灣週榜只抽 21 週，可能漏掉 誰是被害者 S2、正港分局 的上榜週。
10. **年份更正**：乩身是 **2026**（zh.wikipedia：原定 2023 年首播後延期，2026-04-02 上線；merged 與 awards 檔寫 2024 是錯的）；死了一個娛樂女記者之後是 **2025**（zh.wikipedia、MDL、IMDb 都是 2025-02-08 首播；fans 檔寫 2023 是錯的）。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播／完結日、平台、每集片長、原作、劇情、類型 | zh.wikipedia wikitext（`?action=raw`）：`模仿犯 (2023年電視劇)`、`誰是被害者`、`誰是被害者2`、`華燈初上 (電視劇)`、`回魂計`、`如果我不曾見過太陽`、`乩身 (電視劇)`、`正港分局`、`台灣犯罪故事`、`八尺門的辯護人`、`零日攻擊 (電視劇)`、`百萬人推理`、`死了一個娛樂女記者之後`、`她和她的她`；條目名先用 MediaWiki API `action=query&titles=…&redirects=1` 確認（`華燈初上` 會轉到天文條目「藍色時刻」，要用 `華燈初上 (電視劇)`） | Groundlane `web_fetch`（text，截前 4,500–5,000 字） | read（13/13，infobox＋導言／劇情段；演員表後半與獎項段多半被截掉，沒讀） |
| 英文條目導言 | en.wikipedia API `prop=extracts&exintro`（11 部；Port of Lies 沒有 en 條目，Tabloid 轉到同名美國節目，不是本劇） | Groundlane `web_fetch` | read（導言） |
| MDL 分數、人數、全站名次、集數、播出日、片長、Content Rating、genre、簡介 | MDL 作品頁 `Ratings: <b>X</b>/10 from N users`、`Ranked:`、`Episodes:`、`Aired:`、`Duration:`、`Content Rating:`、`li.show-genres`、`div.show-synopsis`；太陽用 MDL 站內搜尋找到正確 slug（`763383-ju-kuo-wo-pu-tseng-chien-kuo-tai-yang`、`802468-had-i-not-seen-the-sun-part-2`） | Groundlane `web_extract`（render=never） | read（16 個作品頁，含續季／分部） |
| IMDb 評分與票數、IMDb 片長與美國分級 | IMDb 標題頁；太陽（tt35671636）、乩身（tt23220752）、百萬人推理（tt27850500）的 ID 用 Exa 搜尋找到 | Exa `web_fetch_exa`（maxCharacters 900–1,200）／`web_search_exa`；死了一個娛樂女記者之後 Exa 抓取逾時（CRAWL_LIVECRAWL_TIMEOUT），改用 jina | cache（12/13）；read（1/13） |
| Parents Guide 五類別＋各國 Certifications | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文）；Groundlane `web_fetch` 對 IMDb 回 202 空頁（`js_empty_document`） | read（13/13） |
| 台灣分級 | Hami Video 產品頁（`meataRating`）、LINE TV 劇頁（`feature-tags__list`）、Disney+ 劇頁（「分級：」） | Groundlane `web_extract`（pattern） | read（4 部 5 頁）；公視+ 頁要 JS 渲染，Groundlane 只拿到「頁面載入中」 |
| 豆瓣 | 候選檔 ratings 檔（DB22／DB23） | — | 候選檔 read |
| 推薦 tag | 三份 candidates 檔＋merged 檔 | 本機讀檔 | 照抄候選檔的讀取狀態 |
| 台灣串流 | tw-availability-1／2 | 本機讀檔 | 照抄 |

toolDegradation：
- **2026-11-26 回讀**：Groundlane MCP 已恢復，是主力（zh.wikipedia、en.wikipedia、MDL、Hami、LINE TV、Disney+）。Groundlane `web_fetch` 對 imdb.com 回 HTTP 202 空頁（`js_empty_document`），對公視+ 回「頁面載入中」（JS 渲染），這兩類改走 Exa／jina 或放棄。Groundlane `web_search` 這輪沒用到（條目名用 Wikipedia API 查）。
- Exa `web_fetch_exa` 讀 IMDb 標題頁（cache），`web_search_exa` 找 3 個 IMDb ID；tt35321198 抓取逾時。
- jina `read_url` 讀 IMDb Parents Guide 13 頁＋死了一個娛樂女記者之後 IMDb 標題頁（read）。
- Tavily、Firecrawl、linkup 沒用到。沒有用終端機 curl，沒有碰 sec.douban.com 或豆瓣頁面本體。
- **2026-11-13 初稿**（已被這輪取代的部分不再沿用）：MCP 全斷（Groundlane、Exa、Tavily、jina、firecrawl、linkup 回 502）；Groundlane 直接 HTTP 與內建 `WebFetch` 都是 `ENOTFOUND`；只剩內建 `WebSearch`（約 30 次），全部標 snippet。

---

## 1. 模仿犯

1. **片名**：**模仿犯**／*Copycat Killer*（About Netflix）（tw-availability-1）。IMDb 原名 *Mo fang fan*（tt18382028）。
2. **劇情**：1990 年代虛構的「松延市」（zh.wikipedia；en.wikipedia 寫「1990s Taipei」）發生連續殺人案，偵辦「Noh 拐殺案」的檢察官郭曉其（吳慷仁；原著沒有的檢察官視角）與刑警林尚勇（庹宗華）追查兇手，兇手利用媒體操弄受害者家屬、警方與輿論。zh.wikipedia：「故事講述1990年代松延市發生的連續殺人命案，揉合檢警辦案與媒體亂象」；MDL 簡介：「A serial killer taps into the media's interest in his murders and ruthlessly manipulates their victims, the police and the media like a puppet master」。來源：https://zh.wikipedia.org/wiki/模仿犯_(2023年電視劇) （read）、https://mydramalist.com/722595-copycat-killer （read）
3. **季數與狀態**：1 季 10 集，2023-03-31 Netflix 全劇上線（zh.wikipedia、MDL，read）；每集約 1 小時（MDL 60 min、IMDb 1h，read／cache）。導演張榮吉、張亨如；瀚草影視、南方電影製作（zh.wikipedia，read）。**已完結**。IMDb 條目標「2023–」只是格式，沒有讀到續季消息。第 58 屆金鐘入圍 16 項，zh.wikipedia 稱「金鐘獎史上入圍最多獎項的戲劇」（read；得獎數沒讀到，初稿「拿 4 個獎」仍是 snippet）。
4. **分級**：
   - 台灣平台頁：沒有（Netflix 獨播，沒有台灣 IP 不算）。
   - IMDb Certifications（使用者可編輯）：Taiwan **18+**；美國 TV-MA、英國 15、日本 R15+、新加坡 NC16、香港 IIB；中國標「Banned」（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt18382028/parentalguide/ ）：Sex & Nudity **Mild**（3 of 8）、Violence & Gore **Moderate**（2 of 7）、Profanity **Mild**（2 of 3）、Alcohol, Drugs & Smoking **Mild**（2 of 4）、Frightening & Intense **Severe**（2 of 4）。投稿說明：「Several murder scenes are shown throughout the series」「Multiple murder scenes are shown with victims dismembered」。
   - MDL Content Rating：15+（read）。
   - 需要提醒：連續殺人、分屍畫面（Parents Guide 投稿，read）；主角童年家人遇害（zh.wikipedia 角色介紹，read）。
5. **觀眾評分**：
   - MDL：**8.1**（3,176 人，全站 #2,020；候選檔 Top Taiwanese #21），https://mydramalist.com/722595-copycat-killer （read）
   - IMDb：**7.0**（3K），tt18382028（cache）
   - 豆瓣：無（候選檔沒有，也沒讀到媒體引述）。
6. **推薦 tag**（merged：ABCDEFG，7 類）：
   - A：GB 2023 戲劇節目獎 nom（第 58 屆入圍 16 項，zh.wikipedia read；個人獎 awards 檔沒收）
   - B：TNL2023（徐佑德年度五大最佳台劇，只確認標題點名「打下高標準」，內文沒讀到，partial）
   - C：IMDb 7.0（3K）；MDL #21 8.1
   - D：Netflix 家族（NFG 全球非英語週榜 #2，2023-04-09 週 1,774 萬小時，台劇第一次進全球榜；#5 次週；NF23H1 4,560 萬小時，台劇第一）——算一次
   - E：Google 2023 快速竄升台灣戲劇 #1＋戲劇影集 #1；DailyView 2023 #2
   - F：PTT 2023 懸疑串 原 PO 清單（「最近版上熱烈討論」）；PTT 2025 懸疑串、Dcard 2025 原 PO 清單（弱）
   - G：LINE TODAY 2023 網友最愛台劇 #1（12.77%）；Netflix 台灣週榜 2023-04-23 #3、05-07 #9
7. **前置作品**：**改編**宮部美幸推理小說《模仿犯》（2001；zh／en.wikipedia、MDL，read）。檢察官主角是改編新增的視角（中央社 2023-01-16 標題「檢察官新視角破案」，zh.wikipedia 引用，read），不必先讀原著（判斷）。
8. **台灣串流**：Netflix (Netflix original, 瀚草). No TW title ID was found. — 證據：beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦7：《模仿犯》」. About Netflix zh_tw, 2022-03-03 (https://about.netflix.com/zh_tw/news/netflix-assembles-all-star-cast-to-do-justice-to-copycat-killer-adaptation). The 2023 trailers are on Netflix Malaysia/Asia (https://www.youtube.com/watch?v=Sk-XhCaz5M0), so they are not counted. — **confirmed (Taiwan media, 2026-02-14)**（tw-availability-1）
   - 補充（不改判定）：zh.wikipedia infobox 官方網站寫 `https://www.netflix.com/tw/title/81461539`（read，線索）。
- **類型核對**：zh.wikipedia「劇情、懸疑推理、犯罪、驚悚」；MDL Thriller／Mystery／Psychological／Drama。**符合本篇**。

## 2. 誰是被害者（第 1–2 季）

1. **片名**：**誰是被害者 (+ 2)**／*The Victims' Game*（YT keyword）（tw-availability-1）。zh.wikipedia 第二季條目名《誰是被害者2》。IMDb 兩季同一條目 tt12079212。
2. **劇情**：患有亞斯伯格症的鑑識官方毅任（張孝全）發現女兒（李沐飾江曉孟）牽涉命案，和社會記者徐海茵（許瑋甯）追查一連串「遺願」命案。zh.wikipedia：「一名患有亞氏保加症的鑑識人員在發現自己女兒牽涉命案後，跟社會記者一同追查由這宗案件引發的連續遺願命案」；全劇「題材涉及性別平權、勞工權益、精神疾病等社會議題」。S2：方毅任迎回出少年觀護所的女兒，卻成為一連串死亡的頭號嫌疑人，也牽出 15 年前他經手的情殺案（MDL S2 簡介，read）。來源：https://zh.wikipedia.org/wiki/誰是被害者 、https://zh.wikipedia.org/wiki/誰是被害者2 、https://mydramalist.com/693453-the-victims-game-season-2 （read）
3. **季數與狀態**（zh.wikipedia infobox、MDL，read）：
   | 季 | 上線 | 集數 | 平台 | 片長 |
   |---|---|---|---|---|
   | 第 1 季 | 2020-04-30 | 8 | Netflix | 62–68 分鐘（含每集結尾約 10 分鐘製作特輯；MDL 60 min） |
   | 第 2 季 | 2024-06-21 | 8 | Netflix | 同上（infobox 沿用）；MDL 60 min |
   - 兩季都**已完結**。2020-09 Netflix 宣布續訂，zh.wikipedia 稱是「Netflix首部擁有第二季的原創華語影集」；S2 2023-04-22 開拍（read）。
   - 第 3 季：沒有讀到任何定案消息（zh.wikipedia S2 引用 udnSTYLE 標題「會有《誰是被害者》第三季？」只是問句）。
   - **原著已確認**：改編台灣推理小說家**天地無限**長篇《第四名被害者》（zh.wikipedia、MDL，read）。初稿寫的「Liang Shuting、Xu Ruilang」是**編劇梁舒婷、徐瑞良**，不是原著作者（更正）。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：Taiwan **12+（festival rating, season 2）／16+（self-applied）**；美國 TV-MA、英國 18、新加坡 M18、紐西蘭 S1 R18／S2 R16（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt12079212/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：S1 15+；S2 **18+ Restricted (violence & profanity)**（read）。
   - 需要提醒：命案、自殺式「遺願」死亡；IMDb 第 1 集簡介用「grisly crime」（cache）。
5. **觀眾評分**：
   - MDL：S1 **8.1**（2,739 人，全站 #2,244，https://mydramalist.com/53745-the-victims-game ）；S2 **8.0**（834 人，全站 #2,904，https://mydramalist.com/693453-the-victims-game-season-2 ）（皆 read；候選檔 Top Taiwanese S1 #27、S2 #37）
   - IMDb：**7.3**（2.4K，兩季同條目；S1 單集平均 7.8，549 票）（cache）
   - 豆瓣：無。
6. **推薦 tag**（merged：ACDEFG，6 類）：
   - A：AACA 台灣區 Best Drama Series 2020＋2024（S2）；GOTT 2020 Best Actor（張孝全，得獎）；GB 2020 戲劇節目獎 nom；GB 2025 迷你劇集獎 nom（S2）。另：第 55 屆金鐘 李沐 獲最具潛力新人獎（zh.wikipedia，個人獎不另計）
   - C：IMDb 7.3（2.4K）；MDL S1 #27 8.1、S2 #37 8.0
   - D：NF23H1 S1 190 萬小時
   - E：DailyView 2024 #6
   - F：PTT 2023 懸疑串 推文 7；PTT 2020 經典台劇票選 #23（34 票）
   - G：LINE TODAY 聚光賞 2024 台劇榜 #6（S2）
   - （不計：遠見 2024 #4，fans 檔標不計。）
7. **前置作品**：**改編天地無限《第四名被害者》**（read）。**S2 接續 S1 的人物與父女關係，必須先看第一季**（MDL S2 簡介寫女兒出少年觀護所、搭檔趙承寬延續，read；「必須」是判斷）。
8. **台灣串流**：Netflix (Netflix original): https://www.netflix.com/tw/title/81318134 (ID from the Netflix Taiwan S2 trailer description; one title page covers both seasons). — 證據：https://www.youtube.com/watch?v=7RfsUh-VjEo 「《誰是被害者》第2季 \| 正式預告 \| Netflix」, Netflix Taiwan, 2024-06-02. Also About Netflix zh_tw, 2024-06-03, and beauty321, 2026-02-14 (S1 and S2 listed as Netflix). — **confirmed (official channel 2024-06; Taiwan media 2026-02)**（tw-availability-1）
   - 補充（不改判定）：zh.wikipedia infobox 官方網站寫 `netflix.com/title/81227121`，與 tw-availability 的 81318134 不同（線索，沒查哪個是現行頁）。
- **類型核對**：zh.wikipedia「犯罪劇情、懸疑推理、驚悚、社會議題」；MDL Thriller／Mystery／Crime。**符合本篇**。

## 3. 華燈初上（三部）

1. **片名**：**華燈初上**／*Light the Night*（TSV）（tw-availability-1）。en.wikipedia：曾用名 *Blue Hour*。IMDb tt15808044。
2. **劇情**：1988 年 10 月 6 日，台北雞南山發現一具無名女屍，身上有條通日式酒店「光」的遺物；隨警方追查，帶出條通文化、陪酒小姐的愛恨與兩位媽媽桑（林心如、楊謹華）的友情恩怨（zh.wikipedia 劇情簡介，read）。zh.wikipedia：「第一部內容圍繞在命案發生前的故事，第二部內容將探索背後的兇手及犯案動機，第三部內容描述被害者及兇手之間的鋪陳」（read）。「紅鞋女屍」一詞出自 zh.wikipedia 引用的 HK01 報導標題（read）。來源：https://zh.wikipedia.org/wiki/華燈初上_(電視劇) （read）
3. **季數與狀態**（zh.wikipedia、MDL，read）：Netflix 全球獨家，三部共 24 集（每部 8 集），每集約 45–55 分鐘（MDL：一、二部 60 min，三部 45 min）。
   | 部 | 上線 |
   |---|---|
   | 第一部 | 2021-11-26（首兩集 2021-11-22 台北金馬影展首映） |
   | 第二部 | 2021-12-30 |
   | 第三部 | 2022-03-18 |
   - **已完結**（初稿第二部日期是 snippet，這輪已由 zh.wikipedia＋MDL 確認）。導演連奕琦，編劇杜政哲、洪立妍、林紹謙；原作欄空白（原創）（read）。
   - 第 57 屆金鐘入圍 11 項、**0 得獎**（zh.wikipedia，read）。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：Taiwan **12+（festival rating）／16+（self-applied）**；美國 TV-MA、英國 15、新加坡 R21、南韓 19（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt15808044/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：三部都是 15+（read）。
   - 需要提醒：命案、酒店與幫派題材（zh.wikipedia 劇情，read；尺度沒有來源）。
5. **觀眾評分**：
   - MDL（皆 read）：第一部 **8.0**（931 人，全站 #2,841，https://mydramalist.com/75551-light-the-night ）；第二部 **8.0**（682 人，#2,724，https://mydramalist.com/715993-light-the-night-season-2 ）；第三部 **7.9**（592 人，#3,515，https://mydramalist.com/720655-light-the-night-season-3 ）。候選檔 Top Taiwanese #34／#32／#48。
   - IMDb：**7.4**（1.8K，三部同條目）（cache）
   - 豆瓣：無。
6. **推薦 tag**（merged：ACDEFG，6 類）：
   - A：AACA 2022 台灣區 Best Drama Series；AACA 2022 Grand Best Supporting Actor（吳慷仁）；GB 2022 戲劇節目獎 nom（金鐘 57 入圍 11 項 0 得獎，zh.wikipedia）
   - C：IMDb 7.4（1.8K）；MDL 三部 7.9–8.0
   - D：NF23H1（三部 150／100／100 萬小時）
   - E：Google 2022 快速竄升台灣戲劇 #1
   - F：PTT 2022「成功台劇」串 推文 4（NICKSHOW「挺多負評」但承認成功）；PTT 2023 懸疑串 原 PO「追到天亮」
   - G：LINE TODAY 2021 最推薦台劇 #1（16.84%）；Netflix 台灣週榜 2021-12-26 #3
7. **前置作品**：原創劇本（zh.wikipedia 原作欄空白，read）。**三部是同一個故事，要從第一部依序看**（zh.wikipedia 三部內容分工，read；判斷）。衍生節目《光露營就很忙了》《光開門就很忙了》（zh.wikipedia 相關節目，read），不必看。
8. **台灣串流**：Netflix (Netflix original, three parts). No TW title ID was found. — 證據：beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦6：《華燈初上》」. 造咖, 2025-10-15 (https://cava.tw/entertainment/moviestv/261142). The 2021 trailers are on Netflix Malaysia/Asia, so they are not counted. — **confirmed (Taiwan media, 2026-02-14)**（tw-availability-1）
   - 補充（不改判定）：zh.wikipedia 官方網站 `netflix.com/title/81477952`（線索）。
- **類型核對**：zh.wikipedia「懸疑推理、犯罪、驚悚、劇情、時代劇」；MDL Thriller／Romance／Life／Drama。**符合本篇（年代懸疑）**。

## 4. 回魂計

1. **片名**：**回魂計**／*The Resurrected*（TSV）（tw-availability-1）。IMDb tt32150413。合製：zh.wikipedia 寫「台、泰合拍」、國家欄列台灣＋泰國，語言含泰語、馬來語（read）；en.wikipedia 只寫「Taiwanese Netflix original series」（read）；tw-availability-1 記錄 Netflix 新聞稿沒有列泰國製作方。**合製說只有 zh.wikipedia 一處**，寫文章時要保守（例如「部分在泰國取景／有泰國演員」不要寫成合製，除非另查到製作方）。
2. **劇情**：虛構城市「班佧」五年前的詐騙綁架案中，一名少女喪命、另一名成了植物人；兩位母親汪慧君（舒淇）與趙靜（李心潔）透過神女儀式讓已伏法的死刑犯張士凱（傅孟柏）「七日回魂」，親手施以酷刑與審判，背後還藏著更大的黑手（zh.wikipedia 劇情簡介，read）。MDL：「two mothers united by hatred… With help from a mysterious goddess, they revive the deceased ringleader of the fraud scheme to punish him」（read）。導演陳正道、許肇任。來源：https://zh.wikipedia.org/wiki/回魂計 、https://mydramalist.com/768391-the-resurrected （read）
   - 更正：初稿寫「張世凱」，正確是**張士凱**；初稿寫「兩位女兒受害」，正確是**一死一植物人**（zh／en.wikipedia）。
3. **季數與狀態**：9 集，2025-10-09 Netflix 全球獨家；首兩集 2025-09-18 在第 30 屆釜山影展首映（en.wikipedia、MDL，read）。每集約 45–50 分鐘（zh.wikipedia；MDL 50 min）。製作公司固力果影業（zh.wikipedia）。**已完結**；美麗佳人報導標題問「結局替第2季留伏筆？」（zh.wikipedia 引用，read），沒有讀到續季消息。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：Taiwan **16+**；美國 TV-MA、英國 15、新加坡 M18、南韓 19（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32150413/parentalguide/ ）：Sex & Nudity **Mild**（1 of 5）、Violence & Gore **Severe**（2 of 2）、Profanity **Moderate**（1 of 1）、Alcohol, Drugs & Smoking **Severe**（2 of 2）、Frightening & Intense **Moderate**（1 of 1）。投稿說明含「Several graphic depictions of r4pe. Do not watch if this subject matter triggers you.」與口交、性行為畫面描述。
   - MDL Content Rating：**18+ Restricted (violence & profanity)**（read）。
   - 需要提醒：**性侵畫面**（Parents Guide 投稿，使用者內容，read）、酷刑、詐騙綁架、毒品（Severe 票）；票數很少，但性侵提醒要寫。
5. **觀眾評分**：
   - MDL：**7.7**（550 人，全站 #5,157），https://mydramalist.com/768391-the-resurrected （read）。不在候選檔 MDL Top 60。
   - IMDb：**7.0**（983）（cache；候選檔當時 976）
   - 豆瓣：無。
6. **推薦 tag**（merged：ABCDEFG，7 類）：
   - A：GB 2026 迷你劇集獎 nom
   - B：KM2025 #7
   - C：IMDb 7.0（976）
   - D：Netflix 家族（NF25 華語劇 #5，240 萬次；NF26H1 台劇 #7，40 萬次）——算一次
   - E：Google 2025 快速竄升台灣戲劇 #8；DailyView 2025 #5
   - F：PTT 2025 前三好看台劇串 推文 2；另有 PTT〈[心得] 回魂計〉75 推（2026-11，列表頁，fans 檔不計）
   - G：LINE TODAY 聚光賞 2025 台劇榜 #2；Netflix 台灣週榜 2025-10-26 #1
   - （不計：LINE2025 在 B 類的同一個名次。）
7. **前置作品**：原創（zh.wikipedia 原作欄空白，read）。不需要先看任何作品。
8. **台灣串流**：Netflix (Netflix original). No title ID was found. — 證據：About Netflix (zh_tw, 全球台灣), 2025-09-02: https://about.netflix.com/zh_tw/news/chinese-language-revenge-thriller-the-resurrected-unveils-main-trailer 「2025年10月9日於Netflix全球獨家播出」. Taiwan media: beauty321, 2026-02-14 (https://www.beauty321.com/post/71268), lists it among 「Netflix燒腦懸疑台劇」. — **confirmed (official newsroom 2025-09; Taiwan media 2026-02)**（tw-availability-1）
   - 補充（不改判定）：zh.wikipedia 官方網站 `netflix.com/browse?jbv=81715542`（線索）。
- **類型核對**：zh.wikipedia「劇情、懸疑推理、犯罪」；MDL Thriller／Mystery／Crime／Supernatural。**符合本篇（超自然復仇驚悚）**。

## 5. 如果我不曾見過太陽（第一部／第二部）

1. **片名**：**如果我不曾見過太陽**／*Had I Not Seen the Sun*（About Netflix URL slug, YT keyword）（tw-availability-1）。IMDb tt35671636（兩部同條目，Exa 搜尋找到）。
2. **劇情**：25 歲的李壬曜（曾敬驊）向警方自首，承認涉及多起高中同學命案，被媒體稱為「暴雨殺人魔」；獄中接受紀錄片團隊採訪時，紀錄片企劃周品瑜（江齊）開始被夢境、記憶與真相交錯的線索牽引，神祕少女江曉彤（李沐）的出現把過往校園事件與現實串起來（zh.wikipedia 劇情概要，read）。第二部回到 2014–2023 年，李壬曜出獄後以新身分在台北生活，遇到一位神似江曉彤的盲女，並對過去的施暴者展開報復（MDL Part 2 簡介，read）。作品主題「心理創傷、校園霸凌及刑事心理學議題」（zh.wikipedia，read）。來源：https://zh.wikipedia.org/wiki/如果我不曾見過太陽 （read）
   - 更正：初稿寫「訪問者江齊（周品瑜）」，正確是**江齊飾演紀錄片企劃周品瑜**；初稿說李壬曜「被媒體稱為連續殺人犯」，原文是**主動自首**並被稱「暴雨殺人魔」。「家暴背景」原文沒有讀到（zh.wikipedia 寫校園霸凌），維持 snippet。
3. **季數與狀態**：Netflix 發行，分兩部上線——**第一部 2025-11-13、第二部 2025-12-11**（zh.wikipedia，read）；**各 10 集、共 20 集**，每集 50–55 分鐘（MDL 兩部條目各 10 集 55 min；zh.wikipedia 20 集 50 分鐘，read）。zh.wikipedia infobox 寫「季數 2」，en.wikipedia 寫「This comprises a single season」——**算一季兩部**比較穩妥。《想見你》團隊、一諾影視製作；導演蔣繼正、簡奇峯；編劇林欣慧、簡奇峯（read）。2025-11-10 台北金馬影展有放映（IMDb release info，cache）。**已完結**，沒有讀到續作消息。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：Taiwan **15+**；美國 TV-MA、英國 S1 18／S2 15、新加坡 M18、南韓 19；中國「Banned」（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35671636/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：兩部都是 **18+ Restricted (violence & profanity)**（read）。
   - 需要提醒：連續殺人、校園霸凌、暴力復仇（zh.wikipedia／MDL，read）；IMDb 第 9 集簡介寫江曉彤「hurt and in pain」、母親要討公道（cache）——初稿說「第一部尾聲女主角遭侵害」與「結局角色走入海中（自殺暗示）」**原文沒有讀到，仍是 snippet**，寫進文章前要再查。
5. **觀眾評分**：
   - MDL（read）：第一部 **8.5**（3,209 人，全站 #571，https://mydramalist.com/763383-ju-kuo-wo-pu-tseng-chien-kuo-tai-yang ）；第二部 **8.5**（2,404 人，全站 #627，https://mydramalist.com/802468-had-i-not-seen-the-sun-part-2 ）。候選檔 Top Taiwanese #4／#5（當時 3,176／2,378 人）。**網址這輪已取得**（初稿沒有）。
   - IMDb：**7.7**（772）（cache；候選檔當時 768）。單集最高 S1.E9 9.4、E10 9.1（cache）。
   - 豆瓣：無。
6. **推薦 tag**（merged：ABCDFG，6 類）：
   - A：**SDA 2026 首爾國際電視節 Best Series**；GOTT 2026 Best Lead Actor（曾敬驊，得獎）＋江齊 nom
   - B：KM2025 #3
   - C：MDL 第一部 #4 8.5、第二部 #5 8.5；IMDb 7.7（768）
   - D：Netflix 家族（NF25 華語劇 #4，290 萬次；NF26H1 台劇 #3／#4）——算一次
   - F：PTT 2025 前三好看台劇串 推文 2
   - G：LINE TODAY 聚光賞 2025 台劇榜 #9（一部曲）；Netflix 台灣週榜 2025-11-30 #4
   - （已刪：DailyView 2026-06 月榜 #10，snippet＋月榜不計；金鐘 2026 個人獎 6 項提名，awards 檔沒收成 tag，只附註。）
7. **前置作品**：原創（zh.wikipedia 原作欄空白；製作人麻怡婷說構想在《想見你》拍攝前就成形，read）。**兩部是同一個故事，要先看第一部**（判斷）。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81766275 (ID from the Netflix Taiwan trailer description). Part 1 launched 2025-11-13 and part 2 on 2025-12-11. — 證據：https://www.youtube.com/watch?v=67aW34TI9V0 「《如果我不曾見過太陽》 \| 正式前導預告 \| Netflix」, Netflix Taiwan (per Exa; no date exposed). About Netflix zh_tw, 2025-10-21 (https://about.netflix.com/zh_tw/news/had-i-not-seen-the-sun-drops-main-trailer-and-key-art). 今周刊/LINE TODAY, 2025-12-19: Netflix Taiwan top 10. — **confirmed (official channel, 2025-10)**（tw-availability-1）
   - 補充（不改判定）：Exa 搜尋結果裡的 Netflix 頁是 `netflix.com/title/81766274`（cache），與 tw-availability 的 81766275 差 1；文章連結前要再對一次。
- **類型核對**：zh.wikipedia「懸疑」；en.wikipedia「coming-of-age romantic thriller」；MDL Thriller／Psychological／Romance／Crime。**符合本篇**，但愛情與青春線很重，要寫明。

## 6. 乩身

1. **片名**：**乩身**／*Agent from Above*（TSV）（tw-availability-1）。zh.wikipedia 另名《乩身：踏火伏魔的罪人》。IMDb tt23220752（原名 *Ji Shen*，Exa 搜尋找到）。fans 檔寫「台灣官方中文劇名待查」，tw-availability-1 的 Netflix 台灣官方預告標題就是《乩身》，已確認。
2. **劇情**：從小在三太子宮廟長大的韓杰（柯震東），因少時犯錯導致宮廟被燒、父母身亡，成為三太子（王柏傑飾哪吒）的乩身替神明在人間處理靈異案件以贖罪；同伴有罹患血癌的女大生葉芝苓（陳姸霏）與有陰陽眼的刑警張泯（楊銘威），對手是通曉邪術的富二代吳天機（薛仕凌）與地獄魔王六梵（戴立忍）（zh.wikipedia 角色介紹，read）。MDL：「Han Chieh is a spirit medium bound to serve the Third Crown Prince to atone for a childhood mistake by resolving supernatural disturbances」（read）。導演管偉傑、賴俊羽；編劇李佳穎（zh.wikipedia）。來源：https://zh.wikipedia.org/wiki/乩身_(電視劇) 、https://mydramalist.com/746387-agent-from-above （read）
3. **季數與狀態**：1 季 **8 集**，**2026-04-02** Netflix 全球獨家一次上架（zh／en.wikipedia、MDL，read；初稿 NOWnews「6 集」是錯的）。每集 37–45 分鐘（Netflix 頁各集片長，Exa 搜尋結果 cache；MDL 42 min、IMDb 45m）。zh.wikipedia：「原定於2023年在Netflix首播，之後延期」；預算新台幣 1.8 億元（read）。**已完結**，沒有讀到第二季消息。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：Taiwan **18+**；美國 TV-MA、英國 15、新加坡 M18、南韓 19（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt23220752/parentalguide/ ）：Sex & Nudity **Moderate**（1 of 5）、Violence & Gore **Moderate**（1 of 1）、Profanity **Mild**（2 of 3）、Alcohol, Drugs & Smoking **Mild**（1 of 1）、Frightening & Intense **Mild**（1 of 1）。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：妖魔、鬼怪、打鬥；角色死亡與地獄情節（zh.wikipedia 角色介紹，read）；IMDb 簡介稱主角是「former drug addict」（cache）。
5. **觀眾評分**：
   - MDL：**7.8**（1,474 人，全站 #4,009；候選檔 Top Taiwanese #55），https://mydramalist.com/746387-agent-from-above （read）
   - IMDb：**6.3**（861）（cache；候選檔當時 849）
   - 豆瓣：無。
6. **推薦 tag**（merged：ACDG，4 類）：
   - A：GOTT 2026 Best Visual Effects（得獎）；GB 2026 迷你劇集獎 nom
   - C：IMDb 6.3（849）；MDL #55 7.8
   - D：Netflix 家族（NFG 全球非英語週榜 #6，2026-04-05 週 810 萬小時——台劇第二部進全球榜；NF26H1 台劇 #1，490 萬次）——算一次
   - G：Netflix 台灣週榜 2026-04-26 #3
   - （已刪：ETtoday「Netflix 台劇原創新高」，ratings 檔標 snippet、不計。）
7. **前置作品**：**改編星子（Teensy）小說《乩身》**（zh.wikipedia、MDL、IMDb trivia，read；en.wikipedia 寫系列名 *The Oracle Comes*）。初稿「漫畫與小說」只出現在摘要一次，原文只寫小說。不必先讀原著（判斷）。
8. **台灣串流**：Netflix (Netflix original; launched 2026-04-02). No title ID was found. — 證據：https://www.youtube.com/watch?v=aNycdiA6t74 「《乩身》\| 正式前導預告 \| Netflix」, Netflix Taiwan, 2026-03-03. Also 「特別版預告：泥娃娃篇」, Netflix Taiwan, 2026-04-02. 青年日報 2026-03-17: 「Netflix《乩身》即將於4月2日上線」. — **confirmed (official channel, 2026-03)**（tw-availability-1）
   - 補充（不改判定）：Exa 搜尋結果裡的 Netflix 頁 `netflix.com/title/81477955`（cache，線索）。
- **類型核對**：zh.wikipedia 類型只寫「奇幻」；MDL Action／Thriller／Mystery／Fantasy；Netflix「Fantasy」、標籤含 Suspenseful、Thriller（cache）。重心是奇幻動作，懸疑犯罪成分有限。**放本篇勉強可以**，要寫明是「奇幻動作」。merged 檔年份 2024 應為 **2026**（已更正，見限制 10）。

## 7. 正港分局

1. **片名**：**正港分局**／*GG Precinct*（YT keyword）（tw-availability-2）。IMDb tt31158593。
2. **劇情**：電影《關於我和鬼變成家人的那件事》（*Marry My Dead Body*）的衍生影集。菜鳥分局長林子晴（王淨）與怪咖警員吳明翰（許光漢）帶著一群「拐瓜劣棗」的警員，偵辦「寫錯成語就有可能被殺」的連續殺人案「成語殺人事件」（zh.wikipedia，read）。MDL：「a trail of murders staged as chilling Chinese idioms word games」（read）。導演程偉豪、殷振豪；編劇周汶儒、程偉豪、殷振豪（zh.wikipedia）。來源：https://zh.wikipedia.org/wiki/正港分局 （read）
3. **季數與狀態**：1 季 6 集，2024-08-22 Netflix 全集上線（zh／en.wikipedia、MDL，read）；每集 38–50 分鐘（zh.wikipedia；MDL 43 min、IMDb 45m）。製作 金盞花大影業、隨身遊戲、文策院（read）。**已完結**，沒有讀到續季消息。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：Taiwan **16+**；美國 TV-MA、英國 15、新加坡 M18（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31158593/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：15+（read）。
   - 需要提醒：連續殺人，zh.wikipedia 形容「殺人手法荒謬又獵奇」，但以喜劇呈現（read）。
5. **觀眾評分**：
   - MDL：**7.3**（778 人，全站 #8,604），https://mydramalist.com/764639-gg-precinct （read）。不在候選檔 MDL Top 60。
   - IMDb：**5.9**（525）（cache；候選檔當時 519）——本篇第二低
   - 豆瓣：無。
6. **推薦 tag**（merged：ACEFG，5 類）：
   - A：AACA 2025 台灣區 Best Comedy Programme＋Best Comedy Performance（許光漢）；GOTT 2024 nom（作品、許光漢）
   - C：IMDb 5.9（519）
   - E：DailyView 2024 #5；Google 2024 快速竄升戲劇 #9（全國別）
   - F：PTT 2025 懸疑串 推文 1（弱）
   - G：LINE TODAY 聚光賞 2024 台劇榜 #8
   - （不計：遠見 2024 #5。awards 檔註記「正港分局」中文名來自搜尋摘要 †；tw-availability-2 的 Netflix 台灣官方預告與 zh.wikipedia 已確認中文名。）
7. **前置作品**：**電影《關於我和鬼變成家人的那件事》衍生**（zh／en.wikipedia、MDL，read）。電影年份：zh.wikipedia 寫 2023 年電影，en.wikipedia 寫 2022 film——**兩邊不一致，沒查**（推論：可能一邊用台灣上映年、一邊用其他日期）。時間線設在吳明翰出院回警局之後，電影角色毛毛（林柏宏）不回歸（zh.wikipedia 引 About Netflix，read）。**看過電影比較有感，但不是必要**（判斷）。
8. **台灣串流**：Netflix (Netflix exclusive): https://www.netflix.com/tw/title/81740096 (ID from the Netflix Taiwan trailer description). — 證據：https://www.youtube.com/watch?v=YN8w0CGRMws 「《正港分局》 \| 正式預告 \| Netflix」, Netflix Taiwan, 2024-08-04. About Netflix zh_tw, 2024-08-05. — **confirmed (official channel, 2024-08)**. Netflix exclusive, so lapse risk is low.（tw-availability-2）
- **類型核對**：zh.wikipedia「喜劇、犯罪、警匪、懸疑」；MDL Mystery／Comedy。**警察犯罪喜劇**：有連續殺人案主線，放本篇可以，但要寫明調性是喜劇。

## 8. 台灣犯罪故事

1. **片名**：**台灣犯罪故事**／*Taiwan Crime Stories*（tw-availability-1）。IMDb tt14113482。
2. **劇情**：四個單元——〈出軌〉〈生死困局〉〈惡有引力〉〈黑潮之下〉，以 2000 年代為背景，改編台灣真實犯罪案件，「包含滅門血案、姦殺案、詐保案與冤獄案」（zh.wikipedia，read）；〈出軌〉原型是臺鐵南迴線連續破壞事件（zh.wikipedia 分集表，read）。MDL：「The stories probe the motives behind crimes, while also exploring themes of faith, temptation, redemption and obligation」（read）。來源：https://zh.wikipedia.org/wiki/台灣犯罪故事 （read）
   - 更正：初稿寫「火車出軌案、滅門案、冤獄案等」，原文是**滅門血案、姦殺案、詐保案、冤獄案**四類，加上〈出軌〉的南迴鐵路破壞事件原型。
3. **季數與狀態**：12 集（4 單元×3 集），Disney+ **2023-01-04 到 2023-01-25**（zh.wikipedia、MDL，read）；每集約 43–60 分鐘（zh.wikipedia；MDL 50 min）。台灣犢影、香港陸匠、美國 Imagine Entertainment 合製，朗·霍華、布萊恩·葛瑟等監製；文化部補助 2,700 萬元（zh.wikipedia，read）。各單元導演：蕭力修、洪子烜、范揚仲、徐瑞良。**已完結**；zh.wikipedia 續作欄空白、IMDb 標「2023」（cache），沒有讀到第二季消息。
4. **分級**：
   - 台灣平台頁：**Disney+ 頁「分級：15+」**（Groundlane 讀 https://www.disneyplus.com/zh-tw/browse/entity-0e22e97a-9295-490a-b798-0c612c4815cf ，read）。注意：這是 Disney+ 自家年齡標，不是普／護／輔／限；抓取不是台灣 IP，只算旁證。
   - IMDb Certifications（使用者可編輯）：Taiwan **16+**；美國 TV-MA、新加坡 NC16、澳洲 MA 15+（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt14113482/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：取材真實滅門案、姦殺案（zh.wikipedia，read）。
5. **觀眾評分**：
   - MDL：**7.4**（86 人，全站 #50,288），https://mydramalist.com/722417-taiwan-fan-zui-gu-shi （read）——樣本小
   - IMDb：**6.4**（275）（cache）；不到 500 票，不在候選檔清單。
   - 豆瓣：無。
6. **推薦 tag**（merged：AEFG，4 類）：
   - A：GB 2023 戲劇節目獎 nom；GOTT 2023 nom（薛仕凌得獎）
   - E：Google 2023 快速竄升台灣戲劇 #9
   - F：PTT 2023 懸疑串 原 PO 清單＋推文 1；PTT 2025 懸疑串、Dcard 2025 原 PO（弱）
   - G：LINE TODAY 2023 網友最愛台劇 #11
7. **前置作品**：原創單元劇（取材真實案件），各單元獨立，可以挑單元看（判斷）。
8. **台灣串流**：Disney+ (original): https://www.disneyplus.com/zh-tw/browse/entity-0e22e97a-9295-490a-b798-0c612c4815cf — 證據：The page loaded on 2026-11-13 as 「觀看台灣犯罪故事 \| Disney+」 (2023, 1 season, 12 episodes). Disney Plus TW trailer https://www.youtube.com/watch?v=o_lTvsOjOdk (2022-12-04). — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia「真實犯罪、劇情、單元劇」；MDL Mystery／Crime／Drama。**符合本篇**。

## 9. 八尺門的辯護人

1. **片名**：**八尺門的辯護人**／*Port of Lies*（TaiwanPlus / Mirror）（tw-availability-1）。IMDb tt26690684。en.wikipedia 沒有條目。
2. **劇情**：印尼漁工 Abdul-Adl 被控殺害阿美族船長一家三口；與死者同部落的公設辯護人佟寶駒（李銘順）被迫為他辯護，和法助連晉平、印尼看護 Leena 追查，證據指向漁業老闆，過程遭遇證人被干擾、司法偏見，佟寶駒還得找昔日戀人、法務部長陳靈秋幫忙（MDL 簡介、公視+ 頁 meta description，read）。zh.wikipedia：「以法律題材為主軸的政治驚悚影集，涉及原住民、外籍移工、死刑存廢、官商勾結等議題，劇情主線以1986年命案『湯英伸事件』為原型」（read）。來源：https://zh.wikipedia.org/wiki/八尺門的辯護人 、https://mydramalist.com/723521-ba-chi-men-de-bian-hu-ren （read）
3. **季數與狀態**：1 季 8 集，**2023-07-02 到 2023-07-23**，公視主頻、中華電信 MOD、Hami Video 播出（zh.wikipedia infobox，read；IMDb 第 8 集日期 2023-07-23，cache，一致）。MDL 寫 Jul 2 – Aug 20（read），**和 zh.wikipedia 不一致，以 zh.wikipedia＋IMDb 的 07-23 為準**（推論：MDL 可能把其他平台的播出算進去）。每集約 50–56 分鐘（zh.wikipedia；MDL 52 min）。鏡文學、中華電信出品，監製董成瑜，**原著作者唐福睿自任導演兼編劇**，鏡文學首部自製影集；文化部補助 2,000 萬元（read）。**已完結**。
4. **分級**：
   - 台灣平台頁：**LINE TV「輔導十五歲級」**（https://www.linetv.tw/drama/16600/eps/1 ，內容標籤，read）。公視+ 頁要 JS 渲染，沒讀到分級。
   - IMDb Certifications（使用者可編輯）：只有 Singapore NC16，沒有 Taiwan 列；IMDb 標「not yet rated」（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26690684/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：15+（read）。
   - 需要提醒：滅門兇殺、死刑議題（zh.wikipedia、MDL，read）。
5. **觀眾評分**：
   - MDL：**7.7**（**47 人**，全站 #46,168），https://mydramalist.com/723521-ba-chi-men-de-bian-hu-ren （read）。初稿懷疑是舊快取而不採用；**原頁確認就是 47 人**，改為採用，但樣本太小。
   - IMDb：**8.1**（552）（cache；候選檔當時 551）——本篇 IMDb 最高
   - 豆瓣：豆瓣 2023 評分最高華語劇集 **#6**（DB23，候選檔 read；沒有分數）
6. **推薦 tag**（merged：ACEFG，5 類）：
   - A：**GB 2024 迷你劇集獎（得獎）**；同屆另得編劇、男主角、音效、配樂、創新獎、最具人氣等個人獎（awards 檔備註，不另計；IMDb 標「4 wins & 5 nominations」，cache）
   - C：IMDb 8.1（551）；豆瓣 DB23 #6
   - E：Google 2023 快速竄升台灣戲劇 #2；DailyView 2023 #4
   - F：PTT 2025 中空串 sabinetwn「印象還停留在 2023 年的八尺門」；PTT 2025 懸疑串 推文 1（原 PO「劇情沒有很喜歡」）
   - G：LINE TODAY 2023 網友最愛台劇 #4（10.08%）；金鐘 59 人氣票選期中 #1（9.77%）
   - （不計：PTT〈八尺門的辯護人：我的年度台劇〉60 推，只讀到列表頁。）
7. **前置作品**：**改編唐福睿同名小說**（zh.wikipedia，read）：原名《最刑島》，獲第二屆鏡文學百萬影視小說大獎首獎，2021 年以《八尺門的辯護人》出版，獲金鼎獎、台灣文學金典獎、台北國際書展大獎等。不必先讀原著（判斷）。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/9d9bd8cd-83cb-4119-9a70-35ec815fa131. LINE TV: https://www.linetv.tw/drama/16600/eps/1. TaiwanPlus (free, English subs). Netflix per beauty321 (2025-09, lead). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 八尺門的辯護人」. The LINE TV page loaded with the title and no 「授權到期」. Mirror Media, 2024-10-22: TaiwanPlus. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia「劇情、律政、刑偵」、「政治驚悚影集」；MDL Mystery／Law／Drama。**符合本篇（法庭懸疑）**。

## 10. 零日攻擊

1. **片名**：**零日攻擊**／*Zero Day Attack*（tw-availability-2）。IMDb tt33083565（TV Mini Series）。
2. **劇情**：以解放軍對台灣採取軍事行動為假想前提：總統大選後、新總統就職前，一架運-8 反潛機在台灣東南海域墜落，中方以搜救為名封鎖台灣並準備登島，台灣出現股災、擠兌、撤僑、假訊息、深偽總統投降影片、監獄囚犯被放出等亂象（zh.wikipedia 劇情大綱，read）。Hami 頁：「透過十個彼此交織的人物視角，逐步揭露台灣在戰爭陰影下可能面臨的各種混合式威脅。從媒體滲透、網路攻擊到社會動盪」，十集各有主題（詐騙青年、晶片商之女、網紅與 AI 男友、宮廟爐主、假離婚台商、死囚越獄、外島士兵等）（read）。製作人兼主要編劇鄭心媚；導演羅景壬、洪伯豪、吳季恩、蘇奕瑄、趙暄、劉易、鄭心媚、林志儒、Akira（zh.wikipedia、Hami，read）。來源：https://zh.wikipedia.org/wiki/零日攻擊_(電視劇) 、https://hamivideo.hinet.net/product/299663.do?cs=2 （read）
3. **季數與狀態**：10 集，**2025-08-02 到 2025-10-04** 每週六 21:00（zh.wikipedia、MDL，read）；公視主頻、民視無線台播出，公視+、LINE TV、中華電信 MOD／Hami Video、台灣大 MyVideo 上架（zh.wikipedia infobox，read）。每集約 1 小時（zh.wikipedia；MDL 60 min）。預算 2.3 億新台幣（zh.wikipedia，read）。日本 Amazon Prime 2025-08-15 播出（en.wikipedia，read）。**已完結**，類單元劇結構（zh.wikipedia 格式欄「獨立單元劇、迷你影集」）。
   - 初稿的「民視 08-24 起播」「22:00 公視+」沒有在這輪原文裡讀到，維持 snippet。
4. **分級**：
   - 台灣平台頁（read，**兩平台不一致**）：**Hami Video「保護級」**（產品頁 `meataRating`）；**LINE TV「輔導十二歲級」**（https://www.linetv.tw/drama/17706/eps/1 內容標籤）。寫文章時兩個都列，或寫「各平台標護級至輔12」。
   - IMDb Certifications：**沒有任何國家的分級**；IMDb 標「not yet rated」（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt33083565/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：戰爭、恐攻、假訊息、詐騙情節（zh.wikipedia、Hami，read）；Hami 單集簡介提到招妓致死（read）。**政治爭議大**（BBC 中文標題「為何引發激烈辯論」，zh.wikipedia 引用，read；初稿「立委質疑補助 1.1 億」仍是 snippet）。
5. **觀眾評分**：
   - MDL：**7.0**（48 人，全站 #57,157），https://mydramalist.com/774351-zero-day （read）——樣本小。初稿說「單集分數 1.0–1.2、疑似洗分」沒有回讀單集頁，維持 snippet，不採用。
   - IMDb：**4.9**（884）（cache；候選檔當時 4.8／881）——**本篇最低**；單集 E1 5.4（cache）。政治題材可能有刷分，沒有查證（推論）。
   - 豆瓣：無。
6. **推薦 tag**（merged：CEG，3 類）：
   - C：IMDb 4.8（881）
   - E：DailyView 2025 #1（討論量第一，其中「政治」占 39.5%；聲量不等於好評）
   - G：LINE TODAY 聚光賞 2025 台劇榜 #7；MyVideo 2025 年度戲劇榜 #1
   - （不計：LINE2025 在 B 類；AACA 2025 台灣區 Best Promo/Trailer，是預告片獎。）
7. **前置作品**：原創（zh.wikipedia 原作欄空白，read）。2024 年先釋出的前導預告引起國際報導（zh.wikipedia 引 SCMP、BBC 2024-07／08，read），不是必看。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/605db3ed-d546-4e30-85b3-869fa25e94ba. Hami Video (some episodes free): https://hamivideo.hinet.net/product/299663.do?cs=2 (下架時間 2031-08-01). LINE TV: https://www.linetv.tw/drama/17706/eps/1. myVideo 1/31273 exists (inconclusive). — 證據：All three pages loaded on 2026-11-13. LINE TV shows 「已完結」 with no lapse notice. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia「架空歷史、反烏托邦、戰爭」；MDL genre 只有 Political；en.wikipedia「speculative fiction」。**政治戰爭驚悚，放本篇可以**，但懸疑推理成分少，評價兩極，都要寫明。

## 11. 百萬人推理

1. **片名**：**百萬人推理**／*Million-Follower Detective*（2026 / Netflix）（tw-availability-2）。IMDb tt27850500（原名 *Bai wan ren tui li*，Exa 搜尋找到）。
2. **劇情**：故事從 2022 年 10 月 1 日開始：知名網紅魏言在警局前開槍，被資深刑警陳家任（鄭伊健）反擊中槍；之後接連發生網紅相關命案，線索都指向以預言著稱的網紅「巴巴女巫」（zh.wikipedia 分集概要，read）。MDL：「Detective Chen Chia Jen races to unmask Baba the Witch, the viral tarot reader who accurately predicts the deaths of influencers」（read）。蘇文聖執導兼編劇，《華燈初上》原班團隊（百聿數碼、天予電影）製作；主演鄭伊健、婁峻碩（飾林廷佑）、李霈瑜、王柏傑、李李仁、陳姸霏、程予希（zh.wikipedia，read）。來源：https://zh.wikipedia.org/wiki/百萬人推理 （read）
3. **季數與狀態**：8 集，**2026-02-12** Netflix 全球獨家上線（zh／en.wikipedia、MDL，read）；每集約 45 分鐘（MDL 46 min、IMDb 45m）。2022 年 5 月開鏡（zh.wikipedia 引鏡週刊 2022-05-05，read），拍完到上線隔了近 4 年。**已完結**，沒有讀到續季消息。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：**沒有 Taiwan 列**；美國 TV-MA、英國 15、新加坡 NC16、南韓 19；中國、伊朗「Banned」（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt27850500/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：連續命案、槍擊（zh.wikipedia，read）；zh.wikipedia 演員表有「家暴男友」角色（read，情節細節沒讀）。
5. **觀眾評分**：
   - MDL：**7.6**（1,052 人，全站 #6,190），https://mydramalist.com/742993-million-follower-detective （read）
   - IMDb：**6.0**（628）（cache）。（另一個 Exa 結果是 IMDb 手機版評分頁的舊快取 5.7／133，較舊，不採用。）
   - 豆瓣：無。
6. **推薦 tag**（merged：CDG，3 類）：
   - C：IMDb 6.0（628）
   - D：NF26H1 台劇 #2（300 萬次）
   - G：Netflix 台灣週榜 2026-02-15 #1
7. **前置作品**：原創（zh.wikipedia 沒有原作欄，read）。不需要先看任何作品。
8. **台灣串流**：Netflix (global exclusive): https://www.netflix.com/tw/title/81939587 (indexed as 「百萬人推理」; lead) — 證據：Netflix newsroom, 2026-01-05 (https://about.netflix.com/zh_tw/news/taiwanese-series-million-follower-detective-launches-on-february-12): 「2026年2月12日Netflix全球獨家上線」. Harper's Bazaar TW, 2026-02-12 (https://www.harpersbazaar.com/tw/culture/filmandmusic/a70293390/netflix-million-follower-detective/). — **confirmed (official channel + Taiwan media, 2026)**（tw-availability-2）
   - 補充：Exa 搜尋結果裡的 Netflix 頁也是 `netflix.com/title/81939587`（cache），ID 一致。
- **類型核對**：zh.wikipedia「犯罪、懸疑」；MDL Thriller／Mystery／Crime。**符合本篇**。只有 3 類，訊號最弱之一。

## 12. 死了一個娛樂女記者之後

1. **片名**：**死了一個娛樂女記者之後**／*Tabloid*（2025 / —）（tw-availability-2；英文名 *Tabloid* 已由 zh.wikipedia、MDL、IMDb AKA 確認，read）。IMDb tt35321198（原名 *Si le yi ge yu le nü ji zhe zhi hou*）。
2. **劇情**：資深娛樂記者劉知君（林予晞）得知自己帶的菜鳥記者林姵亭（王渝萱）死在一場性與毒品派對，週刊聲譽重創；身為主管的她拿著林姵亭留下的筆記重走她的路，發現林姵亭曾假扮性工作者臥底調查娛樂圈性醜聞，而這只是冰山一角（MDL 簡介，read；角色名與職稱見 zh.wikipedia）。搭檔是資深攝影記者莊大海（薛仕凌）（zh.wikipedia，read）。zh.wikipedia 類型「懸疑、犯罪、職人劇」。來源：https://zh.wikipedia.org/wiki/死了一個娛樂女記者之後 、https://mydramalist.com/753975-tabloid （read）
   - 初稿說劇情牽出「政商勾結」，原文只讀到性醜聞與性交易；演員表有市長、市長秘書長、建設公司董事長、檢察長等角色（zh.wikipedia，read），**「政商勾結」是推論**，寫文章前要再查。
3. **季數與狀態**：8 集，**2025-02-08 到 2025-03-01**，每週六播兩集：21:00 公視主頻、新加坡 Singtel；22:00 Netflix、中華電信 MOD、Hami Video、CATCHPLAY+ 上架；八大戲劇台 2025-02-09 起每週日 21:00（zh.wikipedia，read）。每集約 45–60 分鐘（TMDB 第 8 集 45m，Exa 搜尋結果 cache；MDL 60 min）。導演梁秀紅、吳旻炫；真相娛樂製作，鏡文學等發行，總監製董成瑜（zh.wikipedia，read）。**已完結**。
   - **年份更正**：2025（zh.wikipedia、MDL、IMDb 都是 2025-02-08）；fans 檔與 merged 相關欄寫 2023 是錯的。初稿寫「公視購片播出」原文沒讀到，刪去。
4. **分級**：
   - 台灣平台頁：**Hami Video「輔12級」**（https://hamivideo.hinet.net/product/284561.do?cs=2 ，產品頁 `meataRating` 與 8 集 `data-rating`，read）。
   - IMDb Certifications：**沒有任何國家的分級**；IMDb 標「not yet rated」（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35321198/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：性與毒品派對、性醜聞、臥底性交易（MDL、IMDb 簡介，read）。
5. **觀眾評分**：
   - MDL：**7.8**（**17 人**，全站 #45,160），https://mydramalist.com/753975-tabloid （read）——樣本太小
   - IMDb：**6.8**（111）（jina 讀標題頁，read）。初稿 6.9 是 snippet，更正為 6.8。
   - 豆瓣：無。
6. **推薦 tag**（merged：BEF，3 類）：
   - B：KM2025 #8
   - E：Google 2025 快速竄升台灣戲劇 #6
   - F：PTT 2025 懸疑串 原 PO 清單＋推文 1；Dcard 2025 原 PO 清單（都偏弱）
7. **前置作品**：**改編柯映安同名小說**（zh.wikipedia、MDL、DramaWiki，read／cache；MDL 把作者名寫成「Kei Ying An (映安柯)」，是 MDL 的排序錯誤）。初稿「鏡文學 2019 年出版」「作者加入編劇團隊」：DramaWiki 的編劇欄列了 Ke Ying An（Exa 搜尋結果 cache），出版年沒讀到，維持 snippet。不必先讀原著（判斷）。
8. **台灣串流**：Hami Video: https://hamivideo.hinet.net/product/284561.do?cs=2 (下架時間 2028-02-07). Netflix: https://www.netflix.com/tw/title/81994325 (ID from the Netflix Taiwan video description). — 證據：The Hami page loaded on 2026-11-13. https://www.youtube.com/watch?v=RDA5aORQwO4 「《死了一個娛樂女記者之後》｜精彩片段」 is on the Netflix Taiwan channel, 2025-03 (search date 2025-03-11). TVBS, 2025-03-10 (https://news.tvbs.com.tw/entertainment/2783850) names 公視、Netflix、Hami Video、Catchplay+、中華電信MOD、八大電視. — **confirmed (service page + official channel)**（tw-availability-2）
   - 補充：TaiwanPlus 有 *Tabloid* 節目頁（https://www.taiwanplus.com/shows/drama-and-movie/tv-series/686/tabloid ，Exa 搜尋結果 cache），tw-availability-2 沒有列；是否全集可看沒查。
- **類型核對**：zh.wikipedia「懸疑、犯罪、職人劇」；MDL Mystery；IMDb Crime／Drama／Mystery。**符合本篇**（帶媒體職人劇色彩）。

## 13. 她和她的她

1. **片名**：**她和她的她**／*Shards of Her*（TSV）（tw-availability-2）。IMDb tt22399058（TV Mini Series）。
2. **劇情**：在獵人頭公司擔任顧問的林晨曦（許瑋甯）車禍醒來後，發現自己回到家鄉宜蘭，周遭生活和記憶裡完全不同，而這一切似乎與她國中老師在養護院遭殺害的事件有關（zh.wikipedia，read）。zh.wikipedia 角色表寫明：國中理化老師謝志忠（陳以文）「幫晨曦補課時對其性侵，性侵對象不只一人」，晨曦的另一個世界是「解離」（read）。MDL：「The story of a girl who was violated when she was studying in middle school… pushed into the endless abyss of trauma」（read）。劇中長照員跳樓一段取材林于仙事件（zh.wikipedia 註，read）。編劇溫郁芳，導演卓立。來源：https://zh.wikipedia.org/wiki/她和她的她 、https://mydramalist.com/726467-ta-he-ta-de-ta （read）
   - 更正：初稿說「童年創傷是否涉及性侵沒有讀到來源，不能寫」——**這輪 zh.wikipedia 與 MDL 都明確寫國中時遭老師性侵**，可以寫，但要放內容提醒。
3. **季數與狀態**：1 季 9 集，**2022-10-28 Netflix 全球上線**（zh／en.wikipedia、MDL，read）；每集約 45–51 分鐘（zh.wikipedia；MDL 50 min、IMDb 45m）。製作公司 華文創、四方四隅、八大電視；總監製葉如芬（zh.wikipedia，read）。**已完結**。
   - **電視首播台**：zh.wikipedia infobox 頻道只寫 Netflix，**沒有台視**；候選檔的「台視」說法找不到來源，建議刪去（初稿「待查」→ 這輪結論：只有 Netflix 有證據）。
4. **分級**：
   - 台灣平台頁：沒有（Netflix）。
   - IMDb Certifications（使用者可編輯）：Taiwan **16+（self-applied）**；美國 TV-MA、德國 18、加拿大 18、新加坡 NC16（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt22399058/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：15+（read）。
   - 需要提醒：**兒少性侵**、解離、性愛影片外流、偷拍、職場性別霸凌、長照員跳樓（zh.wikipedia 角色表與註，read）。
5. **觀眾評分**：
   - MDL：**8.1**（979 人，全站 #2,072；候選檔 Top Taiwanese #24），https://mydramalist.com/726467-ta-he-ta-de-ta （read）
   - IMDb：**6.9**（923）（cache；候選檔當時 926）
   - 豆瓣：豆瓣 2022 評分最高華語劇集 **#2**（DB22，候選檔 read；沒有分數）
6. **推薦 tag**（merged：ACDEFG，6 類）：
   - A：GB 2023 迷你劇集獎 nom（IMDb 標「4 wins & 6 nominations」，cache，獎項細節沒讀）
   - C：豆瓣 DB22 #2；MDL #24 8.1；IMDb 6.9（926）
   - D：NF23H1 150 萬小時
   - E：Google 2022 快速竄升台灣戲劇 #3
   - F：PTT 2025 懸疑串 原 PO 清單＋推文 1；PTT 2023 懸疑串 推文 1（都偏弱）
   - G：LINE TODAY 2022 年度台劇票選 期中 #2（10.98%；只有期中結果）
7. **前置作品**：原創（zh.wikipedia 原作欄空白，read）。不需要先看任何作品。
8. **台灣串流**：Netflix (Netflix global exclusive per 劇夠 2023). No TW title ID was found. — 證據：beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦8：《她和她的她》」. 劇夠 (公視+), 2023-09-14 (https://dramago.ptsplus.tv/articles/8255/): 「Netflix全球獨家華語懸疑劇」. Site-restricted searches of Hami, LINE TV, friDay, CATCHPLAY+, 公視+ and Disney+ found no page. — **confirmed (Taiwan media, 2026-02-14)**（tw-availability-2）
   - 補充（不改判定）：zh.wikipedia 官方網站 `netflix.com/title/81622630`（線索）。
- **類型核對**：zh.wikipedia「劇情、懸疑推理、犯罪、驚悚」；MDL Thriller／Mystery／Psychological／Drama；IMDb Crime Drama Mystery Thriller。**女性心理懸疑，符合本篇**。

---

## 總結

| # | 劇 | MDL（分數／人數，read） | IMDb（分數／票數） | 台灣平台分級 | 類型核對 |
|---|---|---|---|---|---|
| 1 | 模仿犯 | 8.1／3,176 | 7.0／3K（cache） | 無（Netflix） | 符合 |
| 2 | 誰是被害者 | S1 8.1／2,739；S2 8.0／834 | 7.3／2.4K（cache） | 無 | 符合 |
| 3 | 華燈初上 | 8.0／931；8.0／682；7.9／592 | 7.4／1.8K（cache） | 無 | 符合 |
| 4 | 回魂計 | 7.7／550 | 7.0／983（cache） | 無 | 符合 |
| 5 | 如果我不曾見過太陽 | Pt1 8.5／3,209；Pt2 8.5／2,404 | 7.7／772（cache） | 無 | 符合（愛情線重） |
| 6 | 乩身 | 7.8／1,474 | 6.3／861（cache） | 無 | 勉強（奇幻動作） |
| 7 | 正港分局 | 7.3／778 | 5.9／525（cache） | 無 | 可以（犯罪喜劇） |
| 8 | 台灣犯罪故事 | 7.4／86 | 6.4／275（cache） | Disney+ 15+（旁證） | 符合 |
| 9 | 八尺門的辯護人 | 7.7／47 | 8.1／552（cache） | LINE TV 輔15 | 符合 |
| 10 | 零日攻擊 | 7.0／48 | 4.9／884（cache） | Hami 護／LINE TV 輔12（不一致） | 可以（政治戰爭） |
| 11 | 百萬人推理 | 7.6／1,052 | 6.0／628（cache） | 無 | 符合 |
| 12 | 死了一個娛樂女記者之後 | 7.8／17 | 6.8／111（read） | Hami 輔12 | 符合 |
| 13 | 她和她的她 | 8.1／979 | 6.9／923（cache） | 無 | 符合 |

13 部都可放本篇；乩身、正港分局、零日攻擊 要註明調性。MDL 人數低於 100 的 4 部（死了一個娛樂女記者之後、八尺門、零日攻擊、台灣犯罪故事）不要拿 MDL 分數比較。

---

## 已移出（2026-11-26，照 `split-proposal.md`「待處理」段）

以下三部的 2026-11-13 初稿原文照抄保留，**沒有回讀、沒有改**（全部網路欄位仍是 snippet）。忘了我記得、此時此刻 移到第 3 篇（18 愛情、家庭與青春）；火神的眼淚 移到第 2 篇（17 社會、職人與時代），要在那兩篇的事實表重做。原編號照舊。


### 原 6. 忘了我記得

1. **片名**：**忘了我記得**／*Forget You Not*（YT keywords）（tw-availability-1）
2. **劇情**：想當脫口秀演員的程樂樂（謝盈萱）白天在便利商店打工，一邊處理婚姻問題，一邊照顧逐漸失智的父親程光齊（秦漢），把辛酸寫成笑話。劉若英導演。（Netflix 新聞稿、bella 摘要，snippet）
3. **季數與狀態**：8 集，2025-05-23 Netflix 全球獨家上線（Netflix 台灣官方預告，tw-availability-1）。每集約 1 小時（IMDb 摘要，snippet）。**已完結**，沒有續季消息。
4. **分級**：台灣平台頁沒有記錄。IMDb Certifications：摘要出現 **TV-14**（snippet）；Parents Guide 讀不到。MDL 沒有看到。需要提醒：失智、照護題材，尺度輕（判斷）。
5. **觀眾評分**：
   - MDL：**7.8**（#52，候選檔 read）；人數 235–260（snippet），https://mydramalist.com/766733-forget-you-not
   - IMDb：**7.5**（308）或 7.3（124），兩個快取不一致（snippet，tt31909033）；不到 500 票，不在候選檔清單（DailyView 引 IMDb 8.1，候選檔備註）。
   - 豆瓣：**8.3**（豆瓣 2025 評分最高華語劇集 #4，DB25，候選檔 read）
6. **推薦 tag**（merged：ABCEFG，6 類）：
   - A：GB 2026 迷你劇集獎 nom
   - B：KM2025 #4
   - C：豆瓣 DB25 #4 8.3；MDL #52 7.8
   - E：Google 2025 快速竄升台灣戲劇 #4；DailyView 2025 #2
   - F：PTT 2025 前三好看台劇串 原 PO 前三＋推文 3（1 則「略嫌單薄」）；PTT 2025 中空串 原 PO 批評劇本「平台流水線」——褒貶互見
   - G：LINE TODAY 聚光賞 2025 台劇榜 #4
7. **前置作品**：原創，沒有看到原著（snippet）。不需要先看任何作品。
8. **台灣串流**：Netflix (Netflix exclusive): https://www.netflix.com/tw/title/81730394 (ID from the Netflix Taiwan trailer description). — 證據：https://www.youtube.com/watch?v=s-iH3SucfjA 「《忘了我記得》\| 正式前導預告 \| Netflix」, Netflix Taiwan, 2025-04-07: 「2025年5月23日於Netflix全球獨家播出」. Also beauty321, 2025-09-14. — **confirmed (official channel, 2025-04)**（tw-availability-1）
- **類型核對**：ratings 檔「family drama (dementia)」（候選檔）；搜尋摘要也說「比較像療癒的家庭劇」、資料不支持「懸疑」（snippet）。**不符本篇**，建議移到 17 或 18。


### 原 14. 此時此刻

1. **片名**：**此時此刻**／*At the Moment*（2023 / Netflix / 百聿 / 天予）（tw-availability-2）
2. **劇情**：疫情期間，十段彼此交錯的愛情故事，透過一檔交友實境節目的製作串在一起。（Netflix 英文新聞稿摘要，snippet）
3. **季數與狀態**：1 季 10 集，2023-11-10 Netflix 全球獨家上線；每集約 47–60 分鐘（TheTVDB 摘要，snippet）。**已完結**。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到。MDL Content Rating：**15+**（snippet）。需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：
   - MDL：**7.5**（999 人，snippet），https://mydramalist.com/747289-at-the-moment
   - IMDb：**6.9**（520）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ACEG，4 類）：
   - A：GB 2024 戲劇節目獎 nom；AACA 2024 台灣區 Best Supporting Actress（徐熙娣）
   - C：IMDb 6.9（520）
   - E：Google 2023 快速竄升台灣戲劇 #5；DailyView 2023 #6
   - G：LINE TODAY 2023 網友最愛台劇 #6；金鐘 59 人氣票選期中 #10
7. **前置作品**：無；單元劇，可跳著看（判斷）。
8. **台灣串流**：Netflix (Netflix global exclusive): https://www.netflix.com/tw/title/81701115 (ID from search; lead) — 證據：https://www.youtube.com/watch?v=0uHME-cEVKc 「《此時此刻》\| 正式預告 \| Netflix」 is on the Netflix Taiwan channel, 2023-10 (per Exa). Netflix newsroom, 2023-11-14 (https://about.netflix.com/zh_tw/news/at-the-moment-rides-the-wave-of-love-taiwanese-anthology-series-cast): 「現正於Netflix全球獨家熱播中」. — **confirmed (official channel). The evidence is from 2023, but Netflix commissioned it as a global exclusive.**（tw-availability-2）
- **類型核對**：**不是災難劇**。ratings 檔 genre「romance anthology」（候選檔）；Netflix 新聞稿網址寫「rides the wave of love … anthology series」（tw-availability-2）；搜尋摘要也寫「愛情選集影集」「疫情背景」（snippet）。**不符本篇**，建議移到 18（愛情）。

### 原 15. 火神的眼淚

1. **片名**：**火神的眼淚**／*Tears on Fire*（2021 / 公視）（tw-availability-2）
2. **劇情**：大員市消防局同安分隊的消防員（溫昇豪、陳庭妮、林柏宏、劉冠廷），面對火場、誤報、民眾刁難與家庭壓力。（Marie Claire、TheTVDB 摘要，snippet）
3. **季數與狀態**：10 集，2021-05-01 到 05-29，每週六 21:00 公視首播，myVideo 同步；首播平均收視 1.11（snippet）。**已完結**。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到。MDL Content Rating：**13+**（snippet）。需要提醒：火災、傷亡場面（判斷）。
5. **觀眾評分**：
   - MDL：**7.7**（186–189 人，snippet），https://mydramalist.com/60883-tears-on-fire
   - IMDb：**7.9**（502）（候選檔，read）
   - 豆瓣：候選檔沒有。（MDL 使用者清單寫豆瓣 8.9，不採用。）
6. **推薦 tag**（merged：CEFG，4 類；沒有 A）：
   - C：IMDb 7.9（502）
   - E：Google 2021 快速竄升戲劇 #3（全國別）
   - F：PTT 2022 成功台劇串 推文 3（1 則負評）；PTT 2023 懸疑串 推文 2（推文者自己標「職人劇」）
   - G：LINE TODAY 2021 最推薦台劇 #3（14.49%）
   - （不計：鄭秉泓 2021 台劇回顧點名，awards 檔標不計。）
7. **前置作品**：原創，不需要先看任何作品（判斷）。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/bd0f4e04-7123-4f38-981f-0b461c9284d9. 公視 YouTube playlist PLLhKX7btG59d59RjseCUbtGO6xkB7rC5j 「【火神的眼淚】｜消防職人電視劇」 (contents not readable; lead). — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. A search snippet of the same page mentioned 「限時免費觀看至10/31」, with the year unknown. The show was also on Netflix TW in 2021 (Netflix newsroom, 2022-03-20). — **confirmed (service page)**（tw-availability-2）
- **類型核對**：**消防職人劇**（ratings 檔「firefighter drama」；公視 YouTube 播放清單標題「消防職人電視劇」，tw-availability-2）。**不符本篇**，建議移到 17（職人）。

