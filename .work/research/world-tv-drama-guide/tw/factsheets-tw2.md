# 台劇 2 事實表：社會、職人與時代（15 部）

- 查核日：2026-11-26（初稿 2026-11-13 是 MCP 斷線期間的 snippet 草稿，本輪逐部回讀原文升級）。順序照 `post-tw2-shows.txt`，但依 `split-proposal.md`「待處理」段改片單：**一把青移出**（放到檔尾「已移出」），**火神的眼淚從第 1 篇移入**（排第 15），共 15 部。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取或搜尋結果裡的頁面內容（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。本輪 zh.wikipedia、MDL、IMDb Parents Guide 全部是 read；IMDb 分數是 cache；新聞類細節多半仍是初稿的 snippet（逐項標註）。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。這輪 15 部沒有遇到業配標示。本輪在 zh.wikipedia 讀到的獎項（例如金鐘個人獎、最具人氣獎）**不回填成 tag**，只在各劇附註。
- **金鐘獎算 A 類**（評審是業界獨立評審團，不是官方榜；見 awards 檔開頭說明）。台劇沒有陸劇那種「官方榜」欄。金鐘個人獎、最具人氣獎照 awards 檔規則不計。
- **「不計」與「只算一次」的規則**：
  - **awards 檔 B 類的 LINE TODAY 聚光賞（LINE2024／LINE2025）不計入 B**；LINE TODAY 只在 fans 檔算 G（merge.py 同規則）。所以 聽海湧、人生清理員、華麗計程車行 沒有 B。
  - ratings 檔 §5：同一資料家族只算一個——IMDb、MDL、豆瓣（DB*）、Netflix（NFG＋NF*）、Nielsen（TDI）、Google（GYS*）、DailyView／KEYPO（DV*）。同一家族的 tag 並列在同一個括號裡。
  - fans 檔：PTT 推文數是「提到該劇的帳號數」；負評、「看不下去」不算推薦，另外附註。遠見（S21）、S14、S22、S23 不計。**fans 檔標「範圍外」的條目不計 F**（一把青因此移出）。
- **欄位 4 分級要分三層看**：
  1. **台灣有電視節目分級**（普／護／輔12／輔15／限）。兩份 tw-availability 檔對本篇 15 部都沒有記錄分級；zh.wikipedia 15 個條目的資訊框都沒有分級欄，正文也沒有分級字樣（read）；公視+ 節目頁是單頁應用，渲染後只有分集簡介、沒有分級欄（Groundlane 瀏覽器渲染＋jina 讀 與惡 頁，read）。**唯一讀到的台灣平台分級是 Apple TV 台灣店的 我們與惡的距離 S1 頁：「分級為 PG-15」（＝輔15）、內容警告「不雅言語」（read）**。Apple TV 不在 tw-availability 的平台清單裡，只算旁證。其餘 14 部台灣分級「讀不到」。
  2. IMDb Certifications 是**使用者可編輯**資料，Taiwan 列只算旁證；有 Taiwan 列的只有 5 部：與惡 12+、人選之人 16+（self-applied）、茶金 13+（self-applied）、做工的人 6+、天橋上的魔術師 0+。IMDb Parents Guide 是使用者投稿與投票，不是官方分級；嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是票數。**本篇 15 部的 Parents Guide 五類全部是「No data／No voting data」**（jina 讀全頁，read）。
  3. MDL Content Rating 也是使用者／編輯填的，一併列出但同樣只是旁證。
  - 「需要提醒的內容」只寫來源說到的題材，不寫尺度判斷。
- **欄位 5 豆瓣**：沒有碰豆瓣頁面。分數只用 candidates 檔已記的；本篇只有 與惡 II 有分數（DB25 #3，8.4）。新聞引用值沒有讀到原文，不採用。

## 這份資料的限制

1. **MDL／IMDb 樣本都很小**。MDL 人數過百的只有 與惡 S1（535）、監所男子（224）、人選之人（203）、暴走女外科（191）、火神的眼淚（189）；聽海湧 7 人、華麗計程車行 4 人，**星空下的黑潮島嶼、牛車來去 MDL 是 N/A（0 人，2026-11-26 現值，不是舊快取）**。IMDb 過千票只有 與惡（3.3K，S1+II 同一條目）、人選之人（1.7K）；牛車來去 16 票、華麗計程車行 26 票、黑潮島嶼 41 票、監所男子 47 票。**這些分數幾乎不能拿來互相比較**。ratings 檔也提醒 MDL 台劇榜偏 BL／偶像劇，本篇這類公視寫實劇在 MDL 人數本來就少。
2. **IMDb 加權分與未加權平均差很大的例子**：化外之醫 加權 7.5（518 票）、未加權平均 9.4（ratings 頁，cache）；單集 1–6 集各 9.6–9.7（30 多票）。IMDb 自己說加權是為了穩定分數。文章引用時只用加權分。
3. **IMDb 分數全部是 cache**（Exa `web_fetch_exa` 讀標題頁或 ratings 頁、或 Exa 搜尋結果裡的頁面內容），與 2026-11-13 ratings 檔讀的值多半一致；**火神的眼淚例外**：Exa 快取 7.9（474 票），ratings 檔 2026-11-13 讀 7.9（502 票）——票數以較新的 502 為準，兩者都列。
4. **分級幾乎全缺**：台灣分級只讀到 1 筆（與惡 S1 Apple TV 台灣店 輔15）；IMDb Taiwan 列 5 筆是使用者填的，而且和平台分級對不上（與惡 IMDb 寫 12+，Apple TV 寫 PG-15）；Parents Guide 15 部全空。文章不要寫分級，或只寫「台灣平台頁未標分級」。
5. **豆瓣只有一筆**（與惡 II 8.4，DB25，cn 輪 read）。
6. **MDL 與 zh.wikipedia 的播出日有出入**（以 zh.wikipedia 為準、兩者都列）：斯卡羅 MDL 寫到 2021-09-04，zh.wikipedia 寫到 09-18（12 集每週連播兩集，09-18 才對得上）；做工的人 MDL 寫到 2020-06-14，zh.wikipedia 寫到 06-07；監所男子 台視起播日 zh.wikipedia 自己前後不一（資訊框 2026-01-16，內文 2025-12-14）。
7. **台灣串流**照抄 tw-availability（沒有台灣 IP 驗證）。
8. **類型核對**：15 部都可以放進「社會、職人與時代」。時代劇 6 部（茶金、聽海湧、斯卡羅、星空下的黑潮島嶼、牛車來去、華麗計程車行——後者 zh.wikipedia 類型寫「時代劇」，背景 1999 年），半時代的魔幻寫實 1 部（天橋上的魔術師），社會議題 2 部（與惡、化外之醫），職人 6 部（人選之人、做工的人、監所男子、人生清理員、暴走女外科、火神的眼淚）。**暴走女外科、監所男子 是喜劇調性**；人生清理員 zh.wikipedia 寫「職人、情感、療癒劇」、MDL genre 含 Comedy，調性比初稿判斷的「沉重」輕。見各劇「類型核對」。
9. **候選 tag 偏誤**：awards 檔的 B 類台灣影評榜很薄（KM2025、TNL2023、500輯2022），集中在 2023–2025；AACA 只完整讀了 2024–2025 的台灣各類別，所以 2018–2023 的劇在 A 類被低估。**火神的眼淚** zh.wikipedia 寫「第57屆金鐘獎入圍戲劇節目的六個獎項以及奪得最具人氣戲劇節目獎」（read），awards 檔只把它列在鄭秉泓 2021 回顧的「提及」，沒有列金鐘入圍——六項入圍是否含「戲劇節目獎」本身，zh.wikipedia 這句沒有寫清楚，**沒有回填 A**，建議 awards 檔補查第 57 屆入圍名單。fans 檔 PTT 樣本小、懸疑串偏推理劇。G 類 LINE TODAY 2021–2023 是大眾票選、2024–2025 是打光團，性質不同。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播／完結日、平台、片長、類型、原作、製作公司、劇情、續作 | zh.wikipedia wikitext（`?action=raw`）：`我們與惡的距離`、`我們與惡的距離II`、`人選之人—造浪者`（破折號是「—」，用「－」會 404）、`化外之醫`、`茶金`、`聽海湧`、`斯卡羅_(電視劇)`、`星空下的黑潮島嶼`、`做工的人_(電視劇)`、`天橋上的魔術師`（電視劇條目，不帶括號）、`牛車來去`、`監所男子囚生記`、`人生清理員_(電視劇)`、`華麗計程車行`、`村裡來了個暴走女外科`、`火神的眼淚`；條目名用 zh.wikipedia `opensearch`／`list=search` API 確認 | Groundlane `web_fetch`（text，截前 2,500–5,000 字）／`web_extract`（pattern 抽段落） | read（15/15） |
| 英文條目 | en.wikipedia | 沒有用（zh.wikipedia 已足夠，未讀） | — |
| MDL 分數、人數、集數、播出日、片長、Content Rating、Original Network、genre、簡介 | MDL 作品頁 `ratingValue">X</b>/10 from N users`、`Episodes:`、`Aired:`、`Duration:`、`Content Rating:`、`li.show-genres`、`div.show-synopsis`；無分數者讀 `Score:` 欄 | Groundlane `web_extract`（render=never） | read（15/15） |
| IMDb 評分與票數 | IMDb 標題頁或 `/ratings/` 頁；化外之醫 ID（tt35669102）、華麗計程車行 分數用 Exa 搜尋取得 | Exa `web_fetch_exa`（maxCharacters 500–900）／`web_search_exa` | cache（15/15）。牛車來去、華麗計程車行、黑潮島嶼、做工的人 標題頁第一次 `CRAWL_LIVECRAWL_TIMEOUT`，改讀 `/ratings/` 頁或重試後取得 |
| Parents Guide 五類別 + 各國 Certifications | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文；`question` 參數無 key 時無效） | read（15/15，與惡 S1／II 同條目） |
| 台灣電視分級 | tw-availability 檔；zh.wikipedia 資訊框；公視+ 節目頁；Apple TV 台灣店 | 抄檔／Groundlane `web_fetch`／`web_extract`（render=always）／jina／Groundlane `web_search`（keenable） | 1 筆 read（與惡 S1 Apple TV TW PG-15）；其餘讀不到 |
| 豆瓣 | ratings 檔 DB25 | 抄檔 | read（cn 輪；只有與惡 II） |
| 推薦 tag | 三份 candidates 檔＋merged | 本機讀檔 | 沿用各檔標記 |
| 台灣串流 | tw-availability-1／2 | 本機讀檔，照抄 | 沿用各檔判定 |

toolDegradation：
- **2026-11-13 初稿**：MCP 網路工具全部斷線（Groundlane、Exa、Tavily、jina、firecrawl、linkup 都回 502 `CLIENT_HTTP_NOT_IMPLEMENTED`）；WebFetch 對 zh.wikipedia.org、mydramalist.com、www.imdb.com 回 `getaddrinfo ENOTFOUND`；只用內建 WebSearch（約 40 次），所有網路欄位是 snippet。
- **2026-11-26 本輪**：MCP 已恢復，照 fallback 鏈依序使用：
  - 第 1 層 Groundlane MCP（ToolSearch 載入 deferred 工具）是主力：zh.wikipedia raw wikitext、zh.wikipedia API、MDL（`web_extract` pattern）全部 read。Groundlane `web_search` 內部 tavily、exa、brave、you、parallel provider 都回「unavailable」，只有 keenable（public endpoint）與 browserbase 回結果。Groundlane 讀 IMDb Parents Guide（render=never，selector `main`）不匹配，沒有再試；公視+ 是單頁應用，render=always 只回「頁面載入中」。
  - 第 5 層 Exa（`web_fetch_exa`、`web_search_exa`）讀 IMDb 標題頁／ratings 頁（cache）。部分頁面 `CRAWL_LIVECRAWL_TIMEOUT`，改 ratings 頁或搜尋後取得。
  - 第 5 層 jina `read_url` 讀 IMDb Parents Guide 全頁（read）與公視+ 頁（read，無分級）。無 API key 時 `question` 參數回「requires a Jina API key; returning full content」。
  - Tavily、Firecrawl、linkup 沒用到（前面幾層已讀到）。沒有用終端機 curl，沒有碰豆瓣頁面。第 2–4 層（Groundlane 直接 HTTP、Keenable、You.com keyless）沒有單獨試，因為第 1 層 MCP 可用。

---

## 1. 我們與惡的距離（含 II）

1. **片名**：**我們與惡的距離 (+ II)**／*The World Between Us*（S1）、*The World Between Us: After the Flames*（S2，CATCHPLAY+ 文章用名）（tw-availability-1）。MDL S1 條目頁名 *The World between Us*（slug 仍是 `28709-no-outsiders`），S2 條目名 *The World between Us Season 2*（read）。IMDb S1 與 II 同一條目 tt10073114（zh.wikipedia 兩個條目的 imdb_id 都是 10073114，read；IMDb 頁標「TV Series 2019–」，cache）。
2. **劇情**：
   - S1：zh.wikipedia：「全劇以2010年代台灣的多起社會事件為題材，描述一起隨機殺人案件發生後，加害者、加害者家屬、被害人家屬、辯護律師、精神疾病患者等各方人物的心境與糾葛，是台灣第一部以隨機殺人為主題的電視劇，還涉及新聞媒體困境及思覺失調症等議題」（read）。IMDb 簡介寫「the aftermath of a mass shooting」（cache）——**和 zh.wikipedia「隨機殺人」用詞不同，文章用 zh.wikipedia 的說法**。
   - II：MDL 簡介：「The story begins with an arson at a supermarket, where a 24-year-old suspect claims five lives and injures twelve others… potentially resulting in the first death sentence under the newly implemented citizen judges system. The fire unravels a complex web of connections among six families」（read）。zh.wikipedia：「劇情橫跨三個年代，涵蓋公共衛生、法律、政治與精神疾病等議題」（read）。公視+ 分集簡介：精神科醫師馬亦森「走不出喪妻喪子的陰霾」（ep1），第 10 集「冠駿案正式進入國民法庭審判」（read）。
3. **季數與狀態**（zh.wikipedia，read）：
   | 季 | 播出 | 集數 | 平台 | 片長 |
   |---|---|---|---|---|
   | 我們與惡的距離（S1） | 2019-03-24 到 04-21 | 10（CATCHPLAY+ 為 11＋1 幕後特輯） | 公視主頻；HBO Asia 同日；CATCHPLAY+ | 50 分鐘（zh.wikipedia）；MDL 60 min、IMDb 55m |
   | 我們與惡的距離II | 2025-06-07 到 07-05 | 10 | 公視主頻 | 50 分鐘（zh.wikipedia）；MDL 60 min |
   - **兩季都已完結**。**I 與 II 首播相隔約 6 年（2019-03 → 2025-06）**；II 於 2023-12 開拍、2024-04 殺青；主創同為編劇呂蒔媛、導演林君陽（zh.wikipedia，read）。
   - II 的同步上架平台（CATCHPLAY+、公視+、愛奇藝國際版）與海外 Prime Video 只有初稿的 TVBS 摘要（snippet）。
   - 沒有讀到第三季消息。
4. **分級**：
   - 台灣分級：**Apple TV 台灣店 S1 頁「分級為 PG-15」（＝輔15）、內容警告「不雅言語」**（https://tv.apple.com/tw/show/%E6%88%91%E5%80%91%E8%88%87%E6%83%A1%E7%9A%84%E8%B7%9D%E9%9B%A2/umc.cmc.827aym4bvmedp59hsrov5ehk ，read；Apple TV 不在 tw-availability 平台清單，旁證）。II 沒有讀到。
   - IMDb Certifications（使用者可編輯，tt10073114）：**Taiwan 12+**；Singapore NC16（另註 PG13 some episodes）（read）。和 Apple TV 的 PG-15 不一致。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt10073114/parentalguide/ ）：**五類都沒有投票**；摘要寫「not yet rated」。
   - MDL Content Rating：S1 13+；II Not Yet Rated（read）。
   - 需要提醒：S1 以隨機殺人案為核心，涉及思覺失調症（zh.wikipedia，read）；II 以超市縱火案（5 死 12 傷）、喪妻喪子、精神疾病為核心（MDL／公視+，read）。具體畫面尺度沒有來源。
5. **觀眾評分**：
   - MDL：S1 **8.4**（535 人，https://mydramalist.com/28709-no-outsiders ）；II **7.7**（35 人，https://mydramalist.com/781982-the-world-between-us-season-2 ）（皆 read）。
   - IMDb：**8.8**（3.3K，S1+II 同條目，cache；與 ratings 檔 read 值相同）。
   - 豆瓣：II **8.4**（DB25 #3，ratings 檔，cn 輪 read）。S1 沒有分數。
6. **推薦 tag**（merged：ABCEFG，6 類）：
   - A：**GB 戲劇節目獎 2019（win）**；**GB 戲劇節目獎 2026（win，II）**；AACA 台灣區 Best Drama Series 2019；GOTT 2019 Best Writer（呂蒔媛，win）；AACA 2025 台灣區 Best Actor（周渝民）＋Best Screenplay（呂蒔媛）（II）
   - B：KM2025 台劇 #1（II）；500輯2022（鄭秉泓「三部關鍵台劇」）
   - C：IMDb 8.8（3.3K，台劇 #1）；MDL #11 8.4（535）；豆瓣 DB25 #3（II，8.4）
   - E：Google（2019 快速竄升關鍵字總榜 #1，史上第一部戲劇；2025 快速竄升台灣戲劇 #3，II）——算一次；DailyView 2025 #7（II）
   - F：PTT 2019 鄉民票選 #1（514 票）；PTT 2020 經典票選 #1（174 票）；PTT 2025 前三串 推文 4（II）；另有 S20 BUE「沒有當年的氣勢」（II 負評）
   - G：LINE TODAY 聚光賞 2025 台劇 #3（II）
   - （已刪：awards 檔 B LINE2025 #3，依規則不計 B。）
7. **前置作品**：**原創劇本**（zh.wikipedia 資訊框「原作」欄空白；劇本由呂蒔媛田調後創作，read）。**II 可以不看 S1 直接看**：zh.wikipedia II 條目寫「製作團隊選擇全面更換演員陣容，不延續前一季的角色脈絡，期望從全新的角色群體與議題出發」；只有賈靜雯（宋喬安）、温昇豪（劉昭國）以同角色客串（身分改為新聞主播與名嘴），施名帥（林一駿）仍是精神科醫師（read）。注意 zh.wikipedia S1 條目另寫「第一季部分主演以相同角色演出第二季」，指的就是這幾位客串。
8. **台灣串流**：公視+ (both seasons on one program page): https://www.ptsplus.tv/zh/programs/55585715-e0e9-4e9f-8956-112319ecd7ac (S2 season page …/seasons/109c97b9-2c1f-44f9-937d-99cd6aecfb7f). CATCHPLAY+ (S1 and S2). TaiwanPlus (S1, free, English subs). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 我們與惡的距離」. CATCHPLAY+ 編看編談, 2026-10-26 (https://edsays.catchplay.com/tw/article-4865-mjaa6gxm): 「全集集數可在 CATCHPLAY+ 線上看」, with a free week from 10/26 to 10/31. Mirror Media, 2024-10-22 (https://www.mirrormedia.mg/story/20241022insight004): S1 on TaiwanPlus. — **confirmed (service page + platform's own article, 2026-10)**（tw-availability-1）
- **類型核對**：zh.wikipedia 兩季類型都是「社會寫實」；MDL II genre Crime／Political。**符合本篇（社會）**。
- **合作方**：S1 公視 × CATCHPLAY × HBO Asia（zh.wikipedia 首句，read）；製作 大慕影藝，製作費 4,300 萬（前瞻計畫）。II 出品 文化內容策進院、公視、CATCHPLAY、大慕可可；製作 大慕影藝、時間軸影像（zh.wikipedia，read）。不是外國合拍（HBO Asia 是播出與出品夥伴）。

## 2. 人選之人－造浪者

1. **片名**：**人選之人－造浪者**／*Wave Makers*（Netflix trailer keywords）（tw-availability-1）。zh.wikipedia 條目名用破折號「人選之人—造浪者」（read）。
2. **劇情**：zh.wikipedia：「台灣電視史上第一部講述政黨幕僚的職人劇」（read）。MDL／IMDb 簡介（同一段 Netflix 文案）：「A heated election is on the horizon. A team of campaign staffers must confront tough choices while navigating a cutthroat political landscape.」（MDL read、IMDb cache）。初稿的「總統大選前約十個月、文宣部日常、職場性騷擾與同志議題」與候選人由賴佩霞飾演，仍只有新聞摘要（snippet）。
3. **季數與狀態**（zh.wikipedia，read）：1 季 8 集，每集約 44–56 分鐘（MDL 50 min）；**2023-04-28 Netflix 全球上線**（中國內地除外）；公視主頻資訊框列 2023-10-28 起每週六 21:00–22:00（「公視開播與否 公眾正反激辯無結論」的中央社 2023-09-22 報導是 zh.wikipedia 的出處）。導演林君陽，編劇簡莉穎、厭世姬，主演謝盈萱、黃健瑋、王淨、戴立忍、陳姸霏。**已完結**，資訊框「續作」空白，沒有讀到續季。
   - 後續效應：zh.wikipedia：劇中性騷擾情節與台詞「我們不要就這樣算了，好不好？」引起共鳴，「形成了2023年臺灣#MeToo運動」（read）。
4. **分級**：
   - 台灣分級：tw-availability 無記錄 → **讀不到**。
   - IMDb Certifications（使用者可編輯）：**Taiwan 16+（self-applied）**；United States TV-MA；Singapore M18；Argentina 16（Netflix rating）；Hong Kong 16+、Japan 16+、Italy VM14、France 13、Netherlands 12（皆 self-applied）（read）。IMDb 標題頁也標 TV-MA（cache）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26687035/parentalguide/ ）：**五類都沒有投票**；摘要寫「rated TV-MA」。
   - MDL Content Rating：**15+**（read）。
   - 需要提醒：職場性騷擾情節（zh.wikipedia「後續效應」段，read）。
5. **觀眾評分**：MDL **7.4**（203 人，https://mydramalist.com/745619-the-wave-makers ，read）；IMDb **8.2**（1.7K，tt26687035，cache；與 ratings 檔相同）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABCDEG，6 類）：
   - A：**GB 迷你劇集獎 2023（win）**；AACA 台灣區 Best Drama Series 2023；GOTT 2023 nom（陳妤 Buffy Chen 得獎，類別未確認）
   - B：The Economist 2023 年度最佳電視（ECON2023）；TNL2023 徐佑德年度五大最佳台劇 第 1 部（partial，付費牆）
   - C：IMDb 8.2（1.7K）
   - D：Netflix NF23H1 820 萬小時（台劇 #2、全球 #2441）
   - E：Google 2023 快速竄升台灣戲劇 #6；DailyView 2023 #1
   - G：LINE TODAY 2023 網友最愛 #3（10.1%）；Netflix 台灣週榜 2023-05-07 #1
   - （F 無：fans 檔說 PTT 幾乎沒有推薦推文，只有 1 人「沒看造浪」。）
7. **前置作品**：原創劇本（zh.wikipedia「原作」欄空白，read）。可直接看。
8. **台灣串流**：Netflix (global exclusive since 2023-04-28). Not found on 公視+: no `ptsplus.tv/programs` page surfaced, only 公視 articles about the 2023 broadcast controversy. Linear: 公視. — 證據：beauty321, 2025-09-14 (https://www.beauty321.com/post/67277): its 「2025Netflix台劇推薦」 list includes 《人選之人－造浪者》. The 2023 trailer is on the Netflix Malaysia/Asia channel (https://www.youtube.com/watch?v=A2VMwf58M3I), so it is not counted. — **confirmed (Taiwan media, 2025-09-14)**（tw-availability-1）
- **類型核對**：zh.wikipedia 類型「劇情、政治劇」，稱「政黨幕僚的職人劇」；MDL genre Drama／Political。**符合本篇（職人＋社會）**。
- **合作方**：製作公司 大慕影藝、公共電視文化事業基金會；發行 Netflix（zh.wikipedia，read）。不是外國合拍（Netflix 是首播與發行窗口）。

## 3. 化外之醫

1. **片名**：**化外之醫**／*The Outlaw Doctor*（公視+ / Hami titles）（tw-availability-1）
2. **劇情**：zh.wikipedia：外籍移工及醫療體系困境下，「越南籍整形外科醫師范文寧（連炳發飾）為籌措母親的巨額醫療費飛赴臺灣，暗地裡從事非法醫療」，經人力仲介劉天誠（楊一展）踏入失聯移工的地下社會，捲入威大醫院神經外科醫師鄭琬平（張鈞甯）引發的醫療糾紛（read）。初稿說 MDL 對他國籍寫法不一，本輪 MDL 主頁簡介只寫「foreign doctor」，zh.wikipedia 明寫越南籍——**以 zh.wikipedia 為準**。
3. **季數與狀態**（zh.wikipedia，read）：11 集，**2025-03-08 到 04-12 公視主頻，每週六 21:00–23:00 連播兩集**；公視+、Hami Video、愛奇藝國際版、越南 K+、印尼 CATCHPLAY+ 每週六 22:00 上架。片長 zh.wikipedia 未填（MDL 60 min）。MDL 另記 2024-11-07 第 1–2 集影展放映（read）。導演廖士涵、詹淳皓，編劇張世嫺、溫郁芳，監製湯昇榮等。**已完結**。
   - **續季：未確認**。資訊框「續作」空白（read）；製作人湯昇榮說「可能推出第二季」仍只有初稿的關鍵評論網摘要（snippet）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt35669102/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：Not Yet Rated（read）。需要提醒：失聯移工、人口販運（IMDb 第 10 集簡介「suspected of human trafficking」，cache）、非法醫療、醫療糾紛（zh.wikipedia，read）。
5. **觀眾評分**：MDL **7.4**（44 人，https://mydramalist.com/758383-the-outlaw-doctor ，read）；IMDb **7.5**（516 票標題頁／518 票 ratings 頁，tt35669102，cache；**未加權平均 9.4**，見限制 2）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABCEFG，6 類）：
   - A：**GOTT 2025 Best Asian Contents（win）**；GB 戲劇節目獎 2025（nom；個人獎 連炳發 男主角、楊一展 男配角，awards 檔規則不計）
   - B：KM2025 台劇 #6
   - C：IMDb 7.5（517）
   - E：Google 2025 快速竄升台灣戲劇 #9；DailyView 2025 #10（DV 註：公視首播週日華語劇收視冠軍）
   - F：PTT 2025 前三串 推文 約 11（年度最多）；PTT 2025 懸疑串 推文 1；Dcard 2025 回覆 2（「討論好像比較少」）
   - G：LINE TODAY 聚光賞 2025 台劇 #5；Hami 2025 年度戲劇榜（名次不明；中華電信出品，有平台效應）
   - （已刪：awards 檔 B LINE2025 #5，依規則不計 B；Hami 上半年 TOP10，S14 snippet。）
7. **前置作品**：zh.wikipedia 資訊框「based_on」空白（read），沒有讀到原著。可直接看。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/0e5ad353-29e5-4e8c-a014-009333bcf81e. Hami Video (some episodes free): https://hamivideo.hinet.net/product/286712.do?cs=2 (下架時間 2030-03-07). Netflix per beauty321 (2025-09, lead). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| The Outlaw Doctor化外之醫」; the Hami page loaded with the title and licence date. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia 類型「懸疑、犯罪、醫療劇」；MDL genre Crime／Medical。**符合本篇（社會＋職人）**，但懸疑犯罪成分重，文章可提一句。
- **合作方**：製作 瀚草文創（zh.wikipedia，read）；merged 檔記 公視／中華電信／瀚草。越南演員與越南語台詞不代表外國合拍（tw-availability-1）；IMDb 製作公司欄列 Greener Grass Productions（＝瀚草，cache）。

## 4. 茶金

1. **片名**：**茶金**／*Gold Leaf*（Hami ep page）（tw-availability-1）
2. **劇情**：MDL 簡介：「In 1949, the only daughter of the largest tea factory in Taiwan… After she divorced… she intervenes in the family business that was in high debt… she led the crumbling tea factory to the world in the "tea wars"」（read）。zh.wikipedia：「為台灣首部海陸腔客語劇」（read）。以北埔茶商姜阿新為靈感、在姜阿新洋樓取景，只有初稿的新聞摘要；zh.wikipedia 引用的客家電視台影片標題是「茶商姜阿新故事翻拍」（read 引用標題）。
3. **季數與狀態**（zh.wikipedia，read）：12 集，**2021-11-13 到 12-18 公視主頻**；片長 zh.wikipedia 未填（MDL 60 min）。導演林君陽，編劇徐彥萍、黃國華，主演連俞涵、郭子乾、温昇豪、薛仕凌、許安植、黃健瑋、李杏。語言以海陸客家語為主，另有台語、華語、粵語、滬語、英語、法語、日語。**已完結**，沒有讀到續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications（使用者可編輯）：**Taiwan 13+（self-applied）**、Singapore PG、South Korea All（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt15678308/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：**G - All Ages**（read）。需要提醒：沒有可引用的內容提醒（題材是戰後經濟與家族事業）。
5. **觀眾評分**：MDL **7.7**（35 人，https://mydramalist.com/705569-gold-leaf ，read）；IMDb **8.3**（307 票，tt15678308，cache）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABEFG，5 類）：
   - A：GB 戲劇節目獎 2022（nom）
   - B：500輯2022（鄭秉泓「三部關鍵台劇」）
   - E：Google 2022 快速竄升台灣戲劇 #9
   - F：PTT 2022 成功台劇串 推文 5（其中 1 則「看不下去」）
   - G：LINE TODAY 2021 最推薦台劇 #4（6.88%）；Netflix 台灣週榜 2021-12-26 #2
   - （鄭秉泓〈2021台劇回顧〉只是提及，awards 檔本來就不計。）
7. **前置作品**：取材真人（姜阿新），角色與情節有虛構（初稿新聞摘要，snippet）；zh.wikipedia 資訊框沒有原作欄。**不需要先看任何作品**。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/1075b4c1-de46-4255-94e3-e22272dcddbe. LINE TV https://www.linetv.tw/drama/12800/eps/1 shows 「授權到期」 and 「即將上線」 (**lapsed**). Hami ep page https://hamivideo.hinet.net/product/176003.do?cs=2 showed 下架時間 2025-11-12 (**lapsed**). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 茶金」. 劇夠 2023-07-28: 「《茶金》公視+線上全集收看」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia 類型「時代劇」；MDL genre Drama。**符合本篇（時代＋商戰職人）**。
- **合作方**：製作 瀚草影視、公共電視台；發行 公視、客家委員會（zh.wikipedia，read）。沒有外國合拍。

## 5. 聽海湧

1. **片名**：**聽海湧**／*Three Tears in Borneo*（tw-availability-2）。IMDb 原名 *Thiann hái-íng*（cache）。
2. **劇情**：zh.wikipedia 劇情大綱：太平洋戰爭末期，日本從殖民地臺灣徵召台籍青年充當軍屬，前往婆羅洲監管盟軍戰俘；戰後澳洲軍隊接管戰俘營，「發現營地壕溝曾發生屠殺，42人橫尸」，台籍戰俘監視員被指控虐待和屠殺戰俘，送上澳大利亞軍事法庭（read）。MDL 簡介：「In 1942, under Japanese rule, young Taiwanese were recruited to guard Allied POWs. Some became involved in a brutal massacre…」（read）。IMDb 簡介把三人寫成「brothers」（cache），和 zh.wikipedia 不同，不採用。
3. **季數與狀態**（zh.wikipedia，read）：5 集，**2024-08-17 到 08-31 公視**；**2025-10 起 LINE TV 播出**。片長 zh.wikipedia 未填（MDL 60 min）。由蔡雨氛創作、孫介珩執導，主演吳翰林、黃冠智、朱宥丞、連俞涵、施名帥、周厚安、Runa。**已完結**，沒有讀到續季。初稿的五集標題（黑鳶、赤陽…）仍是 snippet。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt31502667/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：Not Yet Rated（read）。
   - **需要提醒：戰俘虐待、戰俘營屠殺、戰犯審判**（zh.wikipedia、MDL，read）。具體畫面尺度沒有來源。
   - **爭議**：zh.wikipedia：「此劇播出後曾遭質疑扭曲史實、醜化原型人物。公視為此舉辦座談會，導演孫介珩在座談會表示劇集啟發自歷史事件，劇中人物皆為虛構」（read；出處為中國時報 2024-09-12、公視「觀點同不同」2024-10-30）。
5. **觀眾評分**：MDL **8.4**（**7 人**，https://mydramalist.com/771803-three-tears-in-boreno ，read；slug 拼成 boreno）；IMDb **8.3**（176 票，tt31502667，TV Mini Series，cache）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEFG，4 類）：
   - A：**GB 迷你劇集獎 2025（win）**；Series Mania 2024 International Panorama 競賽入選（入選不是得獎；文化部稱是台灣影集首次入選，partial）
   - E：DailyView 2024 #7
   - F：PTT 2025 懸疑串 推文 4（「懸疑氣氛塑造得很好」）；PTT 2025 前三串 推文 2；PTT 2025 中空串 lupins「很讚」
   - G：LINE TODAY 聚光賞 2024 台劇 #2（awards 檔記為十大追劇榜 #3）；Netflix 台灣週榜 2024-11-24 #10
   - （已刪：awards 檔 B LINE2024，依規則不計 B；遠見 2024 #6，S21 不計。）
7. **前置作品**：**取材真實歷史**（台籍戰俘監視員、盟軍審判），導演說劇中人物皆為虛構（zh.wikipedia，read）；資訊框「based_on」空白。不需要先看什麼；文章可補一句歷史背景，並提到史實爭議。
8. **台灣串流**：公視+ (free, 「開放全球觀看」): https://www.ptsplus.tv/zh/programs/63b046d9-794e-41df-a76b-cd96a3e330fd. zh-Wikipedia also lists Netflix (from 2024-11) and LINE TV (from 2025-10); neither was checked. — 證據：The 公視+ page loaded on 2026-11-13. 聯合報 (udn), 2026-08-14 (https://stars.udn.com/star/story/10091/9692686): 「也已於公視+免費上架」. — **confirmed (service page + Taiwan media, 2026-08-14)**（tw-availability-2）
- **類型核對**：zh.wikipedia「戰爭電視劇」；MDL genre Historical／War。**符合本篇（時代）**。
- **合作方**：製作 看不見電影、回甘映像；播出 公共電視（zh.wikipedia，read）。沒有外國合拍。

## 6. 斯卡羅

1. **片名**：**斯卡羅**／*Seqalu: Formosa 1867*（tw-availability-2）
2. **劇情**：zh.wikipedia：「改編自記述羅發號事件及南岬之盟的歷史小說《傀儡花》，劇名源自曾存在於臺灣瑯嶠（今恆春一帶地區）的本土政權——斯卡羅王國」（read）。MDL 簡介：「Set in 1867 following the shipwreck of The Rover… worked to bridge the gap between the American Consul and the aboriginal chieftains of southern Taiwan tribes in an effort to uncover what happened to the survivors of the wreck」（read）。**事件名稱改正**：初稿寫「羅妹號事件」，zh.wikipedia 條目名是「羅發號事件」。
3. **季數與狀態**（zh.wikipedia，read）：12 集，每集約 48–54 分鐘（MDL 50 min）；**2021-08-14 到 09-18 公視主頻，每週六 21:00–23:00 連播兩集**；公視+、LINE TV 每週六 22:00；Netflix 台灣、MyVideo、中華電信 MOD、Hami Video 每週日 18:00 上架兩集；Taiwan+ 2021-08-30 起英文字幕上架。**完結日改正**：初稿與 MDL 都寫 09-04，zh.wikipedia 寫 09-18（12 集每週兩集，09-18 對得上）。導演曹瑞原，編劇黃世鳴，主演查馬克·法拉屋樂、雷斌·金碌兒、吳慷仁、温貞菱、法比歐等。**已完結**，沒有續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt15207176/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：**13+**（read）。
   - **需要提醒：歷史暴力**——船難倖存者遇害、族群衝突（MDL 簡介「uncover what happened to the survivors」；IMDb 簡介「massacre by indigenous tribes」，cache）。具體尺度沒有來源。
5. **觀眾評分**：MDL **7.9**（32 人，https://mydramalist.com/40121-lady-the-butterfly ，read；slug 與片名不符）；IMDb **7.3**（300 票，tt15207176，TV Mini Series，cache）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：**GB 戲劇節目獎 2022（win）**（zh.wikipedia 也寫「2022年第57屆電視金鐘獎榮獲最佳戲劇節目獎」，read）
   - E：Google 2021 快速竄升戲劇 #10（不分國別總榜）
   - G：LINE TODAY 2021 台劇票選 #8（4.05%）（fans 檔 S7 列表；初稿誤寫「名次不明」，本輪重讀 fans 檔 S7 列表已有分開名次）
   - （鄭秉泓〈2021台劇回顧〉只是提及，不計。三類剛好達門檻。）
7. **前置作品**：**改編小說**（陳耀昌《傀儡花》，zh.wikipedia 資訊框 based_on，read）。取材真實事件（羅發號事件）。不需要先讀原著。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/96a5ec69-7327-4d5f-ada8-53e210e34b94. In 2021 it was also on Netflix TW, LINE TV, myVideo and Hami (zh-Wikipedia); none was checked. — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. — **confirmed (service page)**（tw-availability-2）。另：zh.wikipedia 寫 Taiwan+ 2021-08-30 起英文字幕上架（read；tw-availability 沒有記錄現況，不計）。
- **類型核對**：zh.wikipedia 類型「時代劇、劇情」；MDL genre Historical／Drama。**符合本篇（時代）**。
- **合作方**：出品 公共電視台、威聖投資、台北市電影委員會；製作 台北創造電影；發行 公共電視台、智軒文化（zh.wikipedia，read）。沒有外國合拍。

## 7. 星空下的黑潮島嶼

1. **片名**：**星空下的黑潮島嶼**／*Black Tide Island*（tw-availability-2）
2. **劇情**：IMDb 簡介：「A group of top medical doctors managed to set up a leading medical facility, survive hardships and conduct surgery with extremely limited resources while in jail on Taiwan's outlying Green Island during the 1950s」（cache）。MDL 簡介：1950 年韓戰爆發，「the top 1% of Taiwanese elites gathered on Bonfire Island… They brought medical care, education, agriculture, engineering, and art」（read）。zh.wikipedia：在台南岸內影視基地「耗資新臺幣六千萬元搭景，重現當時的綠島新生訓導處」（read）。中央社「台灣第一部聚焦於綠島新生訓導處時期政治受難者的電視劇」的說法仍是初稿 snippet。
3. **季數與狀態**（zh.wikipedia，read）：9 集，60 分鐘（含廣告；MDL 50 min）；**客家電視台 2025-03-30 到 04-27，每週日 21:00**，Hami Video 網路獨家首播；**台視 2025-04-05 到 05-31 每週六 22:00** 重播。導演王傳宗，主演王識賢、黃河、曹佑寧、吳念軒、夏騰宏。**已完結**（IMDb 標「TV Series 2025–」，但沒有讀到續季）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt28687392/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：Not Yet Rated（read）。需要提醒：白色恐怖、政治犯監禁（IMDb／MDL 簡介，題材）。
5. **觀眾評分**：MDL **N/A**（**0 人**，2026-11-26 讀頁面 `Score: N/A (scored by 0 users)`，https://mydramalist.com/772385-black-tide-island ，read——初稿懷疑是舊快取，**本輪確認現值就是 0 人**）；IMDb **8.4**（41 票，tt28687392，cache；初稿 snippet 8.3／22 票已過時）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABFG，4 類）：
   - A：**AACA 2025 Grand Best Cinematography (Fiction)＋Grand Best VFX**（另有台灣區剪輯、音效）；GB 迷你劇集獎 2025（nom）
   - B：KM2025 台劇 #2
   - F：PTT 2025 前三串 推文 5；PTT 2025 中空串 skysilver「大推」
   - G：LINE TODAY 聚光賞 2025 台劇 #1、十大追劇榜 #6（唯一入榜台劇）
   - （已刪：awards 檔 B LINE2025，依規則不計 B；Hami 上半年 TOP10，S14 snippet。）
7. **前置作品**：**取材真實歷史**（綠島新生訓導處），資訊框 based_on 空白（read）。不需要先看什麼。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/c2a25464-d569-410f-a776-539d1c0746fc. Hami Video (some episodes free): https://hamivideo.hinet.net/product/288397.do?cs=2 (下架時間 2028-03-29). LINE TV: https://www.linetv.tw/drama/18031/eps/1. myVideo 3/30930 exists (inconclusive). — 證據：All three pages loaded on 2026-11-13. LINE TV shows 「已完結」 with no lapse notice. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「時代劇」；MDL genre Historical／Political。白色恐怖時代劇＋醫療職人。**符合本篇（時代）**。
- **合作方**：製作 客家電視台、過癮科技；發行 客家電視台（zh.wikipedia，read）；merged 檔記 客家電視台／中華電信。沒有外國合拍。

## 8. 做工的人

1. **片名**：**做工的人 [co-pro: HBO Asia]**／*Workers*（HBO Max URL slug）（tw-availability-2）。zh.wikipedia、MDL、IMDb 都用 *Workers*（read／cache）；初稿的 *We, the Laborers* 只出現在 MDL slug `55019-we-the-laborers`。
2. **劇情**：MDL 簡介談工地裡的水泥工、焊工、外籍移工、女工與營建工人（read）。IMDb 簡介：三個朋友想蓋廟、向泰國商人買神像來募款（cache）。zh.wikipedia：「台灣首部在大型工地實景拍攝的電視劇集」（read）。
3. **季數與狀態**（zh.wikipedia，read）：6 集，60 分鐘（MDL 45 min）；**HBO 與 MyVideo 2020-05-10 起播，zh.wikipedia 寫到 06-07**（MDL 寫到 06-14，見限制 6）。導演鄭芬芬，編劇鄭芬芬、洪茲盈，主演李銘順、柯叔元、游安順、苗可麗、薛仕凌、曾珮瑜。MyVideo 全劇觀看超過百萬次、平台 2020 上半年戲劇類冠軍（zh.wikipedia 引中央社，read）。**已完結**，沒有讀到第二季；**電影版《做工的人》2023-03-31 上映**（zh.wikipedia，read）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications（使用者可編輯）：**Taiwan 6+**、Singapore M18（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt11092582/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：**G - All Ages**（read）。需要提醒：沒有可引用的來源（初稿的 MDL tag「Illness」本輪沒有再讀）。
5. **觀眾評分**：MDL **7.5**（36 人，https://mydramalist.com/55019-we-the-laborers ，read）；IMDb **8.1**（279 票，tt11092582，cache）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEF，3 類）：
   - A：**GB 迷你劇集獎 2021（win）**
   - E：Google 2020 快速竄升戲劇 前十（未標名次，partial 讀取）
   - F：PTT 2020 經典票選 #16（49 票）；PTT 2022 成功台劇串 推文 4；PTT 2023 懸疑串 原 PO「既好笑又感人」；Dcard 2021 個人清單
7. **前置作品**：**改編散文集**（林立青《做工的人》，zh.wikipedia 資訊框＋MDL，read）。不需要先讀。另有 2023 電影版（後續作品，不是前置）。
8. **台灣串流**：HBO Max TW: https://www.hbomax.com/tw/zh/show/0b4fa3a3-ab03-4c4b-9634-3e9d3922146d. myVideo was the co-premiere platform (inconclusive). — 證據：The HBO Max TW page loaded on 2026-11-13 as 「觀看 做工的人 \| HBO Max」. UpToGo, 2026-05-17, names MyVideo and HBO GO. — **confirmed (service page). This is an HBO Asia original co-production.**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「劇情」；MDL genre Drama；ratings 檔標 working-class comedy-drama。**符合本篇（職人＋社會）**。
- **合作方（合拍）**：**HBO Asia 原創合製**（tw-availability-2）；製作 大慕影藝（zh.wikipedia，read）；awards 檔另記凱擘／台灣大哥大。

## 9. 天橋上的魔術師

1. **片名**：**天橋上的魔術師**／*The Magician on the Skywalk*（zh-Wikipedia，經 tw-availability-2）
2. **劇情**：zh.wikipedia：「改編自作家吳明益同名小說，重現1980年代臺灣台北市中華商場榮景的魔幻寫實劇作」，「探討生死、白色恐怖等嚴肅議題，並傳達『消失』的核心概念」（read）。MDL 簡介：1985 年夏天，中華商場皮鞋店的小學四年級生小不點，遇見天橋上神秘的魔術師（read）。
3. **季數與狀態**（zh.wikipedia，read）：10 集；**2021-02-20 到 03-20 公視主頻、MyVideo 同步首播，每週六 21:00 兩集連播**；公視+ 每週六 23:00 以 4K 上架；2021-05-29 LINE TV 全劇上架；2023-08-24 LiTV 全劇上架。片長 zh.wikipedia 未讀到（MDL 50 min）。主演莊凱勛、孫淑媚、楊大正、朱軒洋；編導楊雅喆。**已完結**，沒有續季。
   - **預算改正**：初稿寫「總投資逾 2 億」（snippet）。zh.wikipedia：「2018年初，公視以新臺幣1.55億元預算徵求製作團隊」（read）；中華商場場景 8,000 萬只出現在 zh.wikipedia 引用的遠見〈8000萬打造的中華商場…〉標題（read 引用標題）。總投資金額沒有讀到可靠數字。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications（使用者可編輯）：**Taiwan 0+**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt14238838/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：**G - All Ages**（read）。需要提醒：白色恐怖、生死議題（zh.wikipedia，read）。
5. **觀眾評分**：MDL **7.4**（22 人，https://mydramalist.com/686349-the-magician-on-the-skywalk ，read）；IMDb **7.8**（279 票，tt14238838，cache）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AFG，3 類）：
   - A：**GB 戲劇節目獎 2021（win）**
   - F：PTT 2022 成功台劇串 推文 2（其中 1 則負評）
   - G：LINE TODAY 2021 台劇票選 #6（4.2%）
   - （已刪：PTT〈天橋上的魔術師為何不是神劇？〉18 推，S22 不計。F 類證據偏弱且褒貶互見。）
7. **前置作品**：**改編小說**（吳明益《天橋上的魔術師》，zh.wikipedia＋MDL，read）。不需要先讀。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/6b6894e2-92ec-4932-827b-0ed10a482234. In 2021 it was also on Netflix TW, LINE TV and myVideo; LiTV added it in 2023 (zh-Wikipedia). None of these was checked. — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. — **confirmed (service page). This is a 公視 × myVideo co-production.**（tw-availability-2）
- **類型核對**：zh.wikipedia「魔幻寫實」；MDL genre Mystery／Drama／Fantasy；IMDb Supernatural Fantasy。放「時代」可以，但奇幻成分要在文章裡講明。
- **合作方（合拍）**：**公視 × MyVideo 共同出品**，原子映象製作（zh.wikipedia，read）。

## 10. 牛車來去

1. **片名**：**牛車來去**／英文片名：tw-availability-2 寫「no English title found from a reliable source」——**照抄**。註：zh.wikipedia 資訊框 original_name 與首句都寫 *Oxcart Trails*（read），MDL 也用 *Oxcart Trails*（read）；IMDb 原名 *Gû tshia lâi khì*（read，Parents Guide 頁標題）。tw-availability 檔可考慮更新。
2. **劇情**：MDL 簡介：「In 1943 rural Tainan, unflappable A Chun agrees to be a surrogate for the Tien Tou family in exchange for an ox… she begins to develop feeling for Chen Po Wen」（read）。zh.wikipedia 演員表：農婦許逢春「為了完成日生有一頭牛的心願，答應田頭家陳進丁借腹生子的要求」，陳博文死於 228 事件（read）。
3. **季數與狀態**（zh.wikipedia，read）：30 集，60 分鐘；**2023-01-14 到 04-22 公視主頻、中華電信 MOD、Hami Video 首播，每週六 21:00–23:00**；大結局收視「超過3」。2022-03-29 開鏡、2022-10-06 殺青。導演李岳峰、張志鴻，主演安心亞、蔡昌憲、楊烈、游安順、米可白、楊子儀；台語。**已完結**。
   - **年份更正：2023**（首播 2023-01-14；merged 檔寫的 2022 是拍攝年）。
   - **續作**：初稿的《火車來去》（華視與公視台語台合作、2025 開春播出）仍是 yam 摘要（snippet）；zh.wikipedia 本條資訊框「followed_by」空白（read）。不在本篇清單。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt25382986/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：**G - All Ages**（read）。需要提醒：借腹生子題材、228 事件（zh.wikipedia／MDL，read）。
5. **觀眾評分**：MDL **N/A**（**0 人**，2026-11-26 讀頁面現值，https://mydramalist.com/747291-oxcart-trails ，read）；IMDb **7.1**（**16 票**，未加權平均 7.2，tt25382986 ratings 頁，cache；初稿 snippet 7.2 是未加權值）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：GB 戲劇節目獎 2023（nom）
   - E：DailyView 2023 #3；Google 2023 快速竄升台灣戲劇 #10（不同家族，類別只算一次）
   - G：LINE TODAY 2023 網友最愛 #8
7. **前置作品**：zh.wikipedia 資訊框沒有原作欄（read），沒有讀到原著。不需要先看什麼。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/6ace5111-0637-435c-bc35-d5c8b80f1d14. Hami Video: https://hamivideo.hinet.net/product/210517.do?cs=2 (下架時間 2028-01-13). — 證據：Both pages loaded on 2026-11-13. — **confirmed (service page). This is a 公視 × 中華電信 co-production.**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「時代劇」；MDL genre Life。日治到戰後的鄉村時代劇。**符合本篇（時代）**。
- **合作方（合拍）**：**公視 × 中華電信**（tw-availability-2）；製作 禾豐傳播（zh.wikipedia，read）。

## 11. 監所男子囚生記

1. **片名**：**監所男子囚生記**／*Oops! I'm in Jail*（tw-availability-2）。zh.wikipedia 英文名寫 *OOPS!I'M IN JAIL*（read）。
2. **劇情**：zh.wikipedia：跆拳道明日之星阿耀（陳澤耀）因傷退役後沉迷賭博，「為了還債被迫成為監所管理員，負責照顧獄中老大吉娃娃（楊祐寧 飾）」；教誨師姜一傑（劉以豪）「盯緊他和吉娃娃的『特殊關係』」（read）。**角色改正**：初稿寫劉以豪是「警校出身的官二代」（snippet），zh.wikipedia 寫他是教化科**教誨師**（典獄長姜國城由郭子乾飾演，read）。
3. **季數與狀態**（zh.wikipedia，read）：12 集，每集 45 分鐘（MDL 49 min）；**2025-11-15 到 12-13 MyVideo、愛奇藝國際版首播**；八大戲劇台 2025-11-23 到 12-28；台視起播日 zh.wikipedia 前後不一（資訊框 2026-01-16 到 03-01，內文 2025-12-14 起）；八大綜合台 2026-01-16 起。導演高炳權，監製楊祐寧。**已完結**；沒有讀到續季消息。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt38628094/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：Not Yet Rated（read）。需要提醒：賭債、黑道、監所暴動（MDL 簡介「beaten during riot control」「prisoners even threaten to commit suicide」，read）。
5. **觀眾評分**：MDL **7.7**（224 人，https://mydramalist.com/802450-oops-i-m-in-jail ，read）；IMDb **7.6**（**47 票**，未加權平均 7.4，tt38628094 ratings 頁，cache；初稿 snippet 7.7／14 票已過時）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABFG，4 類）：
   - A：GB 戲劇節目獎 2026（nom）
   - B：KM2025 台劇 #5
   - F：PTT 2025 前三串 推文 2（「節奏笑點感人都有」）
   - G：MyVideo 2025 戲劇榜 前十（名次在圖片裡，不明；MyVideo 是首播平台之一，有平台效應）
7. **前置作品**：zh.wikipedia 資訊框沒有原作欄（read），沒有讀到原著。可直接看。
8. **台灣串流**：CATCHPLAY+: https://www.catchplay.com/tw/video/3053b6c1-aee4-434d-80e3-aab05fcafa05 (redirected to the homepage for our IP; inconclusive). myVideo was the 2025 premiere platform (inconclusive). iq.com also carries it (not counted). — 證據：CATCHPLAY ED Says, 2026-05-07 (https://www.catchplay.com/tw/ed-says/article-5068-uxzugmir): 「5/16在CATCHPLAY+全集上架，首兩集免費觀看」. myVideo blog, 2025-12-15 (https://blog.myvideo.net.tw/oops-im-in-jail-01/): 「MyVideo 11月15日正式開播」. — **confirmed (service editorial, 2026-05-07)**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「職人劇、群像、喜劇」，首句稱「臺灣職人喜劇」；MDL genre Comedy。放「職人」可以，但調性是喜劇，文章要講明。
- **合作方**：**愛奇藝國際站 × 壹壹影業 聯合出品**（zh.wikipedia，read）；MDL Original Network 寫 iQiyi。不是外國合拍，但是 iQIYI 國際站出品——台灣合法收看照 tw-availability 的 CATCHPLAY+ 判定，iq.com 不算。

## 12. 人生清理員

1. **片名**：**人生清理員（影集版）**／*The Cleaner*（zh-Wikipedia English title）（tw-availability-2）。IMDb 條目名 *Ren sheng qing li yuan*（cache）。
2. **劇情**：zh.wikipedia：「故事描述從事特殊現場清潔的『明日清潔社』五位成員們的故事。透過走入一個個現場，清掃每個逝者與親友間的關係與遺憾」，「用較輕鬆幽默的調性帶出大家的人生故事」（read）。MDL 簡介：「A former underworld crime boss now runs a company that cleans up death scenes… Things becomes complicated when his daughter returns」（read）。主演金士傑（社長龍哥）、鳳小岳、宋芸樺、黃冠智、蔡嘉茵（zh.wikipedia，read）。
3. **季數與狀態**（zh.wikipedia，read）：9 集，45 分鐘（MDL 46 min）；**2024-09-07 到 10-05**；公共電視每週六 21:00–23:00 播 2 集，9/8 起每週日 20:00–21:00 播 1 集（zh.wikipedia 沒寫週日是哪一台；初稿摘要說是八大戲劇台，snippet）；Netflix、Hami Video 9/7 起每週六 22:00 上架。導演陳大璞，製作人楊凱婷，果陀娛樂製作。**已完結**，沒有讀到續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt33268748/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：Not Yet Rated（read）。需要提醒：死亡現場、孤獨死、命案現場清理（zh.wikipedia／MDL，read）。
5. **觀眾評分**：MDL **7.8**（20 人，https://mydramalist.com/766083-the-cleaner ，read）；IMDb **7.8**（**76 票**，tt33268748，cache）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AFG，3 類）：
   - A：GB 迷你劇集獎 2025（nom）（zh.wikipedia 另列第 60 屆金鐘 6 項入圍、鳳小岳獲迷你劇集男主角獎，read；個人獎照規則不計）
   - F：Dcard 2025 回覆 1（弱訊號）
   - G：LINE TODAY 聚光賞 2024 台劇 #5
   - （已刪：遠見 2024 #3，S21 不計。F 只有一則 Dcard，類別數剛好 3，偏弱。）
7. **前置作品**：**有同名電視電影**：zh.wikipedia「相關節目」欄列《人生清理員》（电视电影）（read）。影集版沿用班底、是全新故事的說法只有初稿鏡週刊摘要（snippet）。**判斷：不需要先看電視電影版**。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/1fd797a3-b9c8-4949-b8de-a4324eb22d3a. Netflix: https://www.netflix.com/tw/title/81927215 (lead). Hami https://hamivideo.hinet.net/product/272428.do?cs=2 is now a bare 「HamiVideo」 shell (**lapsed**). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 人生清理員（影集版）」. udnSTYLE / Cosmopolitan TW, 2024-09-27 (https://style.udn.com/style/story/121034/8251825): it topped the Netflix TW chart. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「職人、情感、療癒劇」；MDL genre Comedy／Crime／Drama。**符合本篇（職人）**。**調性改正**：初稿寫「調性沉重」，zh.wikipedia 寫「較輕鬆幽默的調性」，題材沉重但筆調是療癒輕鬆。
- **合作方**：製作 果陀娛樂；播出 公共電視、八大電視、Netflix、Hami Video（zh.wikipedia，read）；MDL Original Network 寫 GTV、PTS。沒有外國合拍。

## 13. 華麗計程車行

1. **片名**：**華麗計程車行**／*A Wonderful Journey*（tw-availability-2）。IMDb 原名 *Hua li ji cheng che hang*（cache）。
2. **劇情**：zh.wikipedia：「1999年臺灣921大地震過後……在嘉義的華麗車行裡，陳柏文、陳柏翰兩兄弟正面臨是否接班計程車行的人生分岔路口」，車行有「處理不完的負債與呆帳」（read）。**人名改正**：初稿寫「博文、博翰」（IMDb 摘要），zh.wikipedia 寫「柏文、柏翰」。MDL 簡介：每集探索嘉義的文化、事件與人（read）。
3. **季數與狀態**（zh.wikipedia，read）：10 集；**華視主頻 2024-02-18 到 04-14，每週日 22:00**；八大戲劇台 2/24 起每週六 20:00；台視主頻每週六 22:00；LINE TV 2/18 起；Netflix 線上播出。2023-07 殺青（製作年份 2023）。**導演改正：莊景燊、黃常祚**（zh.wikipedia；初稿的「莊絢維／John Chuang」來自 MDL 摘要，不採用）；編劇林佳慧、林美慧；主演曹佑寧、黃冠智、郭子乾、楊麗音。**已完結**，沒有續季。
   - **年份更正：2024**（首播 2024-02-18；awards 檔寫的 2023 是製作年）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt30765097/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：Not Yet Rated（read）。需要提醒：沒有可引用的來源。
5. **觀眾評分**：MDL **7.5**（**4 人**，https://mydramalist.com/760177-a-wonderful-journey ，read）；IMDb **7.4**（**26 票**，tt30765097，cache；IMDb 使用者清單頁另顯示 7.4／25 票）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：AACA 2024 台灣區 Best Original Production by a Streamer (Fiction)；GB 戲劇節目獎 2024（nom）
   - E：DailyView 2024 #8
   - G：LINE TODAY 聚光賞 2024 台劇 #9；金鐘 59 人氣票選期中 #9
7. **前置作品**：**改編陳俊文《華麗計程車》**（zh.wikipedia 資訊框 based_on，read；MDL 寫 novel）。文類（散文或小說）zh.wikipedia 沒有寫，初稿 yam 摘要說是散文（snippet）。不需要先讀。
8. **台灣串流**：LINE TV (co-producer): https://www.linetv.tw/drama/15286/eps/2 — 證據：The page loaded on 2026-11-13 as 「華麗計程車行第1集 無常才是正常」, with VIP badges and neither 「授權到期」 nor 「即將上線」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「時代劇」（1999–2000 年背景）；MDL genre Drama；ratings 檔標 family workplace drama。放「時代」或「職人」都可以，偏溫情家庭。
- **合作方（合拍）**：**LINE TV × 華視 共同出品**（zh.wikipedia 首句，read）；merged 檔記製作 巧克。不是外國合拍。

## 14. 村裡來了個暴走女外科

1. **片名**：**村裡來了個暴走女外科**／*Mad Doctor*（ELLE TW URL slug; unofficial）（tw-availability-2）。zh.wikipedia 資訊框 eng_name、MDL、IMDb 也都用 *Mad Doctor*（read／cache）。
2. **劇情**：MDL 簡介：失去動力的女外科醫師逃離黑暗過去，到鄉村小醫院工作，遇上「patients injured by a crush of a pig to a bite from a penguin」等荒謬病例，逐漸找回行醫熱情（read）。IMDb 簡介：Dr. Liu 調到鄉下的 Sunshine Hospital，「harbors deep, hidden scars」（cache）。中段醫療糾紛情節仍是初稿 Marie Claire 摘要（snippet）。
3. **季數與狀態**（zh.wikipedia，read）：第一季 10 集，60 分鐘（含廣告；MDL 50 min）；**公視主頻 2022-05-07 到 06-04，每週六 21:00–23:00 連播二集**；衛視中文台 05-08 到 06-05；民視無線台 2023-03-04 到 05-06；公視+、MOD、Hami、MyVideo、LINE TV 同步，Netflix 5/8 起。導演賴孟傑，主演蔡淑臻、朱軒洋等。
   - **狀態改正：第二季已開拍**。zh.wikipedia：「第二季於2025年8月開拍，劇情描述醫師被正規醫療系統踢出，轉到地下醫院行醫」，資訊框季數 2、續作「村裡來了個暴走女外科2」（read；出處 ETtoday 2025-08-23〈《女外科2》…班底全翻新〉）。**播出日沒有讀到**。初稿寫「沒有續季」是錯的。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications：**沒有任何國家的資料**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt19655892/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：**13+**（read）。需要提醒：手術、受傷病患（MDL 簡介，題材）。
5. **觀眾評分**：MDL **7.5**（191 人，https://mydramalist.com/709165-mad-doctor ，read）；IMDb **7.2**（**204 票**，tt19655892，「TV Series 2022–」，cache；初稿 snippet 7.3／約 185 票已過時）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：**GB 戲劇節目獎 2023（win）**（zh.wikipedia：2023 年另得戲劇女主角、戲劇導演、最具潛力新人獎，read；個人獎不計）
   - E：Google 2022 快速竄升台灣戲劇 #5
   - G：LINE TODAY 2022 年度期中 #1（14.6%；只有期中結果，最終名次沒找到）
7. **前置作品**：**改編劉宗瑀的同名作品**（zh.wikipedia 資訊框「原著」，read）。不需要先讀。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/a3f838da-d613-4d6b-a0b0-2c5a048dba5f. Hami https://hamivideo.hinet.net/product/188605.do?cs=2 is a bare shell (**lapsed**). LiTV VOD00296163 and ofiii 64649 are inconclusive. — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. In 2022 it was also on Netflix TW (Marie Claire TW, 2022-05-26). — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「醫療劇」，首句稱「台灣職人劇」；MDL genre Comedy／Medical。放「職人」可以，但調性輕鬆，文章要講明（split-proposal 也列它「歸類最不確定」）。
- **合作方**：製作 十三月股份有限公司；出品人 陳郁秀（公視）；發行 牽猴子（zh.wikipedia，read）。不是合拍。

## 15. 火神的眼淚（自第 1 篇移入）

1. **片名**：**火神的眼淚**／*Tears on Fire*（2021 / 公視）（tw-availability-2）。IMDb 原名 *Huo Shen De Yan Lei*（cache）。
2. **劇情**：zh.wikipedia：「故事著重於探討台灣消防員在執勤中面臨的生死關頭，以及在職場和家庭間的困境，並揭露消防體系中的沉痾弊端，是台灣首部消防員題材職人劇」；創作起心動念是 2015 年桃園市新屋保齡球館火災多位消防員殉職（read）。MDL 簡介：大員市消防局同安分隊的消防員——邱漢誠（妻子即將生產）、隊上唯一女性徐子玲、隱藏過去的張知遠、護隊友的林義陽——「Together, they face a fire that will alter their fates」（read）。
3. **季數與狀態**（zh.wikipedia，read）：10 集，每集約 48 分鐘（MDL 60 min、IMDb 50m）；**2021-05-01 到 05-29 公視主頻**，MyVideo 同步；LiTV 2023-08-11 上架。導演蔡銀娟，編劇蔡銀娟、李志薔、曾群芳，主演温昇豪、陳庭妮、林柏宏、劉冠廷。預算新台幣 9,400 萬（其中 8,000 萬由公視與 MyVideo 合資）。**已完結**，資訊框沒有續作，沒有讀到續季。初稿的「首播平均收視 1.11」仍是 snippet。
4. **分級**：台灣分級 **讀不到**（tw-availability 無記錄）；IMDb Certifications（使用者可編輯）：只有 Singapore PG13，**沒有 Taiwan 列**（read）；IMDb Parents Guide（read，https://www.imdb.com/title/tt14597334/parentalguide/ ）：**五類都沒有投票**；MDL Content Rating：**13+**（read）。需要提醒：火災、救災傷亡、消防員殉職背景（zh.wikipedia「火災場面都被認為極度寫實」，read）。
5. **觀眾評分**：
   - MDL：**7.7**（189 人，https://mydramalist.com/60883-tears-on-fire ，read）
   - IMDb：**7.9**（502 票，ratings 檔 2026-11-13 read；Exa 標題頁快取 474 票，較舊，tt14597334）
   - 豆瓣：candidates 檔沒有。（MDL 使用者清單寫豆瓣 8.9，不採用。）
6. **推薦 tag**（merged：CEFG，4 類；沒有 A）：
   - C：IMDb 7.9（502）
   - E：Google 2021 快速竄升戲劇 #3（全國別）
   - F：PTT 2023 懸疑串 推文 2（推文者自己標「職人劇」）；PTT 2022 成功台劇串 推文 3（其中 monday10079「看預告就轉台」是負評）；PTT 2025 懸疑串 推文 1
   - G：LINE TODAY 2021 最推薦台劇 #3（14.49%）
   - （不計：鄭秉泓 2021 台劇回顧點名，awards 檔標不計。zh.wikipedia 寫第 57 屆金鐘「入圍戲劇節目的六個獎項以及奪得最具人氣戲劇節目獎」（read）——最具人氣獎照 awards 檔規則不計；六項入圍的類別沒有讀到，見限制 9。）
7. **前置作品**：**原創劇本**（zh.wikipedia 資訊框「原作」欄空白；劇本來自田野調查，read）。不需要先看任何作品。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/bd0f4e04-7123-4f38-981f-0b461c9284d9. 公視 YouTube playlist PLLhKX7btG59d59RjseCUbtGO6xkB7rC5j 「【火神的眼淚】｜消防職人電視劇」 (contents not readable; lead). — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. A search snippet of the same page mentioned 「限時免費觀看至10/31」, with the year unknown. The show was also on Netflix TW in 2021 (Netflix newsroom, 2022-03-20). — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia 類型「職人劇」；MDL genre Action／Thriller／Life；ratings 檔「firefighter drama」。**符合本篇（職人）**，移入正確。
- **合作方**：**公共電視台 × 台灣大哥大 MyVideo 共同製作**（zh.wikipedia 首句，read）；製作公司 冬候鳥電影。不是外國合拍。

---

## 總結一覽

| # | 片名 | 集數／首播（zh.wikipedia） | MDL（人數） | IMDb（票數） | 豆瓣 | merged 類別 | 台灣串流判定 |
|---|---|---|---|---|---|---|---|
| 1 | 我們與惡的距離（I／II） | 10／2019-03-24；10／2025-06-07 | 8.4（535）；II 7.7（35） | 8.8（3.3K，同條目） | II 8.4（DB25） | ABCEFG | confirmed |
| 2 | 人選之人－造浪者 | 8／2023-04-28 Netflix | 7.4（203） | 8.2（1.7K） | — | ABCDEG | confirmed (Taiwan media) |
| 3 | 化外之醫 | 11／2025-03-08 | 7.4（44） | 7.5（516） | — | ABCEFG | confirmed |
| 4 | 茶金 | 12／2021-11-13 | 7.7（35） | 8.3（307） | — | ABEFG | confirmed |
| 5 | 聽海湧 | 5／2024-08-17 | 8.4（7） | 8.3（176） | — | AEFG | confirmed |
| 6 | 斯卡羅 | 12／2021-08-14 | 7.9（32） | 7.3（300） | — | AEG | confirmed |
| 7 | 星空下的黑潮島嶼 | 9／2025-03-30 | N/A（0） | 8.4（41） | — | ABFG | confirmed |
| 8 | 做工的人 | 6／2020-05-10 | 7.5（36） | 8.1（279） | — | AEF | confirmed（HBO Max） |
| 9 | 天橋上的魔術師 | 10／2021-02-20 | 7.4（22） | 7.8（279） | — | AFG | confirmed |
| 10 | 牛車來去 | 30／2023-01-14 | N/A（0） | 7.1（16） | — | AEG | confirmed |
| 11 | 監所男子囚生記 | 12／2025-11-15 | 7.7（224） | 7.6（47） | — | ABFG | confirmed (service editorial) |
| 12 | 人生清理員 | 9／2024-09-07 | 7.8（20） | 7.8（76） | — | AFG | confirmed |
| 13 | 華麗計程車行 | 10／2024-02-18 | 7.5（4） | 7.4（26） | — | AEG | confirmed |
| 14 | 村裡來了個暴走女外科 | 10／2022-05-07（S2 2025-08 開拍） | 7.5（191） | 7.2（204） | — | AEG | confirmed |
| 15 | 火神的眼淚 | 10／2021-05-01 | 7.7（189） | 7.9（502） | — | CEFG | confirmed |

MDL 全部 read（2026-11-26）；IMDb 全部 cache（火神的眼淚 502 票取自 ratings 檔 read）；豆瓣一筆來自 ratings 檔。台灣分級只讀到 與惡 S1 一筆（Apple TV 台灣店 PG-15）；IMDb Parents Guide 15 部全空（read）。

---

## 已移出

### 一把青（移出主片單，列候補說明）

- **移出原因**：fans 檔把本劇標「範圍外」（2015 首播，早於 2016 的蒐集窗口），F 類不該計入；merge.py 誤把 F 計入。扣掉 F 後只剩 A（GB 戲劇節目獎 2016 win）、C（IMDb 8.4／509）兩類，**未達三類門檻**（split-proposal「待處理」段，2026-11-13）。另外台灣串流是 `licensed-old`（Netflix 2018 舊證據；公視+、LINE TV 已下架），本來就要標「可能已下架」。
- 片名：**一把青**／*A Touch of Green*（tw-availability-2）。
- 保留的初稿資料（本輪沒有回讀，維持原狀態）：31 集，2015-12-19 到 2016-04-02 公視，每集 52 分鐘（MDL 摘要，snippet）；改編白先勇短篇〈一把青〉（MDL 摘要，snippet）；MDL 8.0（102 人，snippet）；IMDb 8.4（509，ratings 檔 read）。
- 台灣串流：None confirmed. 公視+ https://www.ptsplus.tv/zh/programs/f342823d-1eb7-4dc0-a4c6-ffa02ef189ba returns 「公視+ \| 404」 (**lapsed**). LINE TV https://www.linetv.tw/drama/12579/eps/20 shows 「此戲劇因授權到期，已下架」 (**lapsed**). LiTV VOD00295464 and ofiii 64603 are inconclusive. Netflix: https://www.netflix.com/tw/title/80233859 is indexed (lead). — 證據：Epoch Times, 2018-04-03 (https://www.epochtimes.com/b5/18/4/2/n10271177.htm): 公視 put 《一把青》 on Netflix. No later Taiwan evidence was found. — **licensed-old (Netflix, 2018; 公視+ and LINE TV lapsed)**（tw-availability-2）
- 若文章想提經典台劇，可以在「延伸」段一句帶過，不放資料卡。
