# 美劇在台灣的合法觀看管道 — batch 1（31 部）

查核日期：2026-11-05。來源：`tw-batch-1.tsv`。

## 方法與證據等級

1. **JustWatch TW**：每部劇都先用 `https://www.justwatch.com/tw/search?q=<title>` 找到 TW 條目頁，再讀條目頁（`/tw/節目/<slug>`）。頁面上寫著「我們於 2026年11月5日 … 查看了 44 個串流服務」，並列出各服務（逐字引用頁面句子「目前你可以在 X 上观看 …」）。JustWatch 導向各服務的 deep link 也一併抽出來（這些 link 都帶 `uct_country=TW`）。
2. **服務頁**：用 Groundlane `web_extract`/`web_fetch` 直接打開。
   - **HBO Max**（`hbomax.com/tw/zh/show/...`）和 **Apple TV**（`tv.apple.com/tw/show/...`）是 TW 市場頁，價格用台幣顯示（HBO Max「每月僅需NT$183」；Apple TV「免費 7 天，之後 $250.00/月」）。**LINE TV** 只在台灣營運。這三種都算 **confirmed on service page**。注意：HBO Max 頁另有一行「Oh no! This title currently isn't available…」，那是爬蟲出口 IP 不在台灣造成的，跟台灣片庫無關。這裡驗的是 TW 市場頁有沒有列這部劇，不是登入後實際播放。
   - **Disney+**（`disneyplus.com/zh-tw/browse/entity-...`）和 **Prime Video**（`primevideo.com/-/zh_TW/detail...`）：頁面會顯示 zh-TW 片名，但不寫地區可用性，也不顯示台幣價格。這種歸為 **JustWatch + 服務 zh-TW 頁（地區未證）**。
   - **Netflix**：`/tw/title/<id>` 頁的內容依「請求來源國」決定，不看 URL 裡的 `/tw/`。實測同一頁從美國、巴西、墨西哥出口，分別看到 USD、BRL、MXN 價格；Rick and Morty 在美國出口下還顯示「This title currently isn't available to watch in your country」。所以從這個環境沒辦法證實 Netflix 台灣片庫，Netflix 一律只能算 JustWatch 層級。
   - **CATCHPLAY+**：從非台灣 IP 打開 `catchplay.com/tw/video/...` 會被轉回 `catchplay.com/` 首頁，所以沒驗到。
3. **台灣官方譯名**優先採用服務的 TW／zh-TW 頁。JustWatch TW 的片名常常是簡體或港譯（例如「风骚律师」「诚实治疗法」），不能當成台灣譯名。沒有服務頁可對的，標成「未驗」，並寫出 JustWatch 顯示的片名。

證據等級：
- **A**：confirmed on service page（TW 市場頁或台灣專屬服務）
- **B**：JustWatch TW + 服務 zh-TW 頁（片名有對到，地區可用性沒有證實）
- **C**：JustWatch only
- **D**：not found

方案類型：全部是訂閱制（SVOD），另有註明的例外。JustWatch TW 這 31 部都沒有列出租借或購買選項。

## 結果表

| English title | 台灣官方譯名 | services (offer type) | title-page URL(s) | evidence status | notes |
|---|---|---|---|---|---|
| Stranger Things | 怪奇物語 | Netflix（訂閱） | https://www.netflix.com/tw/title/80057281 ；JW: https://www.justwatch.com/tw/節目/stranger-things | B（Netflix 頁有渲染出 zh-TW 片名，但出口在美國） | 片名用 firecrawl 以 zh-TW 語系取得：「Watch 怪奇物語 \| Netflix Official Site」。JustWatch 的 deep link 指向另一個 id `82939566`，這裡改用主條目 id 80057281。 |
| Rick and Morty | 瑞克和莫蒂 | HBO Max（訂閱，9 季）；Netflix（訂閱，JW 寫 8 季） | https://www.hbomax.com/tw/zh/show/ab553cdc-e15d-4597-b65f-bec9201fd2dd ；https://www.netflix.com/tw/title/80014749 | A（HBO Max）／C（Netflix） | HBO Max TW 頁：「觀看 瑞克和莫蒂 \| HBO Max」，9 季，NT$183。Netflix 部分只有 JustWatch。 |
| The Bear | 大熊餐廳 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-05eb6a8e-90ed-4947-8c0b-e6536cbddd5f | B | Disney+ zh-tw 頁：「觀看大熊餐廳 \| Disney+」，2022–2026。 |
| Pluribus | 萬中選一 | Apple TV（訂閱，7 天免費試用後 $250/月） | https://tv.apple.com/tw/show/%E8%90%AC%E4%B8%AD%E9%81%B8%E4%B8%80/umc.cmc.37axgovs2yozlyh3c2cmwzlza | A | Apple TV TW 頁：「觀看《萬中選一》」。 |
| Ted Lasso | 泰德拉索：錯棚教練趣事多 | Apple TV（訂閱，7 天免費試用後 $250/月） | https://tv.apple.com/tw/show/%E6%B3%B0%E5%BE%B7%E6%8B%89%E7%B4%A2%E9%8C%AF%E6%A3%9A%E6%95%99%E7%B7%B4%E8%B6%A3%E4%BA%8B%E5%A4%9A/umc.cmc.vtoh0mn0xn7t3c643xqonfzy | A | zh_hint 原本是空的。JustWatch 顯示 4 季。 |
| House of Cards | 紙牌屋（未驗；JW 顯示簡體「纸牌屋」） | Netflix（訂閱，6 季） | https://www.netflix.com/tw/title/70178217 | C | |
| Alien: Earth | 異形：地球 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-ac314a24-c615-48ee-8e24-b26de75e64ef | B | Disney+ zh-tw 頁：「觀看異形：地球」。 |
| Better Call Saul | 絕命律師 | Netflix（訂閱，6 季） | https://www.netflix.com/tw/title/80021955 | C | 譯名有 about.netflix.com/zh_tw 的新聞稿佐證：「《絕命律師》(Better Call Saul)」。JW 顯示的是陸譯「风骚律师」。 |
| True Detective | 無間警探（HBO Max）／真探（LINE TV） | HBO Max（訂閱，4 季）；LINE TV（免費看，有 VIP 方案；JW 寫 1 季） | https://www.hbomax.com/tw/zh/show/9a4a3645-74e0-4e4d-9f35-31464b402357 ；https://www.linetv.tw/drama/18655/eps/1 | A | 兩個平台用的譯名不同。LINE TV 頁標題是「真探第1集｜免費線上看｜LINE TV」。JW 那句「HBO Max 免费带广告」應該是把 LINE TV 的免費方案混進去了。HBO Max 本身是訂閱制。 |
| The Last of Us | 最後生還者 | HBO Max（訂閱，2 季） | https://www.hbomax.com/tw/zh/show/93ba22b1-833e-47ba-ae94-8ee7b9eefa9a | A | HBO Max TW 頁：「觀看 最後生還者」，NT$183。 |
| The Big Bang Theory | 宅男行不行 | HBO Max（訂閱，12 季） | https://www.hbomax.com/tw/zh/show/c8ea8e19-cae7-4683-9b62-cdbbed744784 | A | JW 顯示陸譯「生活大爆炸」。 |
| Dexter: Resurrection | —（未上架，無台灣譯名可查） | 無 | 嘗試過：JW 搜尋 https://www.justwatch.com/tw/search?q=Dexter%20Resurrection ；https://www.justwatch.com/tw/節目/dexter-resurrection（會被轉到節目總表） | D | JustWatch TW 沒有這個條目。服務網域搜尋（CATCHPLAY、friDay、KKTV、Hami、myVideo、LINE TV、HBO Max、Disney+）也沒找到。Prime Video 頁只顯示「免費試用 Paramount+」，那是出口地區的頻道，不是台灣方案。原系列 Dexter 在 Netflix TW 上有（JW 寫 8 季）。 |
| The Queen's Gambit | 后翼棄兵（未驗；JW 顯示簡體「后翼弃兵」） | Netflix（訂閱） | https://www.netflix.com/tw/title/80234304 | C | zh_hint 原本是空的。 |
| 3 Body Problem | 3 體（未驗；JW 顯示「3 体」） | Netflix（訂閱） | https://www.netflix.com/tw/title/81024821 | C | zh_hint 原本是空的。 |
| The Marvelous Mrs. Maisel | 漫才梅索太太 | Prime Video（訂閱，5 季） | https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.7f187a13-f9c4-405d-b822-c56aab133be4 | B | Prime zh_TW 頁標題：「Prime Video：漫才梅索太太第一季」。JW 顯示陸譯「了不起的麦瑟尔夫人」。 |
| This Is Us | 這就是我們 | Disney+（訂閱，6 季） | https://www.disneyplus.com/zh-tw/browse/entity-9dc170da-85db-475d-9df4-6572f15ffb00 | B | JW 顯示陸譯「我们这一天」。 |
| The Handmaid's Tale | 使女的故事 | HBO Max（訂閱，6 季） | https://www.hbomax.com/tw/zh/show/858582f7-55e3-45e0-810d-3fc449e9938f | A | HBO Max TW 頁：「觀看 使女的故事」，6 季，NT$183。 |
| South Park | 南方公園（未驗；JW 顯示簡體「南方公园」） | South Park Studios 官方網站（免費有廣告） | https://www.southparkstudios.com/ （JW deep link: https://www.southparkstudios.com/episodes/er4a32/south-park-weight-gain-4000-SE-1-EP-2 ）；JW: https://www.justwatch.com/tw/節目/south-park | C | 這是官方站，不是盜版。JW TW 寫「免费带广告观看」，標 21 季。從台灣能不能播，這裡沒辦法驗證。 |
| Dying for Sex | 死前慾望清單 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-423f6320-b55b-453b-a85f-dea05bd495d9 | B | zh_hint 原本是空的。 |
| Pose | 艷放80 | Disney+（訂閱，3 季） | https://www.disneyplus.com/zh-tw/browse/entity-6bf318d8-f506-4e7f-a58f-0c5cc09b6c90 | B | Disney+ zh-tw 頁標題：「觀看艷放80」。JW 顯示「姿态」。 |
| A Man on the Inside | 未驗（JW 顯示簡體「卧底老绅士」） | Netflix（訂閱，2 季） | https://www.netflix.com/tw/title/81677257 ；JW: https://www.justwatch.com/tw/節目/a-classic-spy | C | JW 的 slug 是 `a-classic-spy`。台灣 Netflix 譯名需要台灣 IP 才能確認。 |
| BoJack Horseman | 馬男波傑克（未驗；JW 顯示簡體「马男波杰克」） | Netflix（訂閱，6 季） | https://www.netflix.com/tw/title/70300800 | C | |
| Landman | 石油天王（JW TW 寫法；Prime zh_TW 頁顯示英文「Landman」） | Prime Video（訂閱，2 季）；CATCHPLAY+（訂閱，2 季）；Netflix（訂閱，JW 寫 1 季） | https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.c6bb2607-7148-4525-8763-0f65ef40daa4 ；https://www.catchplay.com/tw/video/97248ae3-5df6-44c6-ba19-a132df01f177 ；https://www.netflix.com/tw/title/81946384 | B（Prime）／C（CATCHPLAY、Netflix） | 從非台灣 IP 打開 CATCHPLAY 頁會被轉回首頁。 |
| Shrinking | 誠實診療室 | Apple TV（訂閱，3 季） | https://tv.apple.com/tw/show/%E8%AA%A0%E5%AF%A6%E8%A8%BA%E7%99%82%E5%AE%A4/umc.cmc.apzybj6eqf6pzccd97kev7bs | A | JW 顯示的「誠實治療法」是香港 Apple TV 的譯名。台灣譯名是「誠實診療室」。 |
| The Office (US) | 辦公室瘋雲（Prime）／我們的辦公室（HBO Max） | HBO Max（訂閱，9 季）；Prime Video（訂閱，9 季）；Netflix（訂閱，9 季）；CATCHPLAY+（訂閱，JW 寫 5 季） | https://www.hbomax.com/tw/zh/show/78e15665-f6c8-4b58-8786-e0d9e2b65ced ；https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.54a9f77b-9a3d-01d5-83b3-c30531685e9f ；https://www.netflix.com/tw/title/70136120 ；https://www.catchplay.com/tw/video/6ac78695-a902-4274-be84-a700a7a1d28c | A（HBO Max）／B（Prime）／C（Netflix、CATCHPLAY） | 不同平台用的譯名不同。 |
| Homeland | 反恐危機 | Netflix（訂閱，8 季）；Disney+（訂閱，8 季） | https://www.disneyplus.com/zh-tw/browse/entity-d5779fa8-8bac-419b-8539-38a8cfeb1505 ；https://www.netflix.com/tw/title/70180387 | B（Disney+）／C（Netflix） | |
| Reacher | 神隱任務 | Prime Video（訂閱，4 季） | https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.41f71162-2344-4089-accf-5ce0e9c12535 | B | Prime zh_TW 頁標題：「Prime Video：神隱任務-第一季」。JW 顯示「侠探杰克」。 |
| The Walking Dead: The Ones Who Live | 陰屍路：生存者 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-8468b2fd-8a22-4bf7-8810-040894061359 | B | 原系列 The Walking Dead 在 Netflix 與 Disney+ 上（JW 寫 11 季）。 |
| High Potential | 潛能探案組 | Disney+（訂閱，2 季） | https://www.disneyplus.com/zh-tw/browse/entity-d58ab636-473f-4276-b421-d27825b42fce | B | |
| Sirens | 未驗（JW 顯示簡體「妖惑心计」） | Netflix（訂閱，限定影集） | https://www.netflix.com/tw/title/81589551 ；JW: https://www.justwatch.com/tw/節目/yao-huo-xin-ji | C | 搜尋 JW 時，Sirens 條目下還出現 Artiflix，看起來是同名的另一部作品，已排除。 |
| Zero Day | 零日風暴（JW TW 寫法） | Netflix（訂閱，限定影集） | https://www.netflix.com/tw/title/81598435 | C | JW 另有一部台灣劇《零日攻擊》（LINE TV／PTS+），是不同作品。 |

## 統計

- A（confirmed on service page）：9 部 — Rick and Morty、Pluribus、Ted Lasso、True Detective、The Last of Us、The Big Bang Theory、The Handmaid's Tale、Shrinking、The Office (US)
- B（JustWatch + 服務 zh-TW 頁，地區未證）：12 部 — Stranger Things、The Bear、Alien: Earth、The Marvelous Mrs. Maisel、This Is Us、Dying for Sex、Pose、Landman、Homeland、Reacher、TWD: The Ones Who Live、High Potential
- C（JustWatch only）：9 部 — House of Cards、Better Call Saul、The Queen's Gambit、3 Body Problem、South Park、A Man on the Inside、BoJack Horseman、Sirens、Zero Day
- D（not found）：1 部 — Dexter: Resurrection

## 沒有找到合法管道

- **Dexter: Resurrection (2025, Paramount+ with Showtime)**
  - JustWatch TW：搜尋只找到 Dexter（Netflix）、Dexter: New Blood 和 Dexter: Original Sin，後兩者都沒有串流服務。直接打 `/tw/節目/dexter-resurrection` 會被轉到節目總表。
  - 台灣服務網域搜尋（catchplay.com、video.friday.tw、kktv.me、hamivideo.hinet.net、myvideo.net.tw、linetv.tw、hbomax.com、disneyplus.com）：沒有找到。
  - Prime Video 頁（https://www.primevideo.com/-/zh_TW/detail/Dexter-Resurrection/0FWFT7BJR1JMSXUS45MHBYXA79）：只顯示「免費試用 Paramount+」，是出口地區的頻道方案，不代表台灣有。
  - 搜尋結果裡出現的只有盜版站，已排除。
  - Paramount+ 在台灣沒有上線。Paramount 的影集在台灣常透過 CATCHPLAY+ 播出（Landman 就是一例），值得之後用台灣 IP 再查一次 CATCHPLAY+。

## 限制與待辦

- **地區驗證**：Netflix、Prime Video、Disney+、CATCHPLAY+ 的頁面都依出口 IP 決定內容。這個環境的出口在美國、巴西、墨西哥，沒有台灣，所以這些平台都只做到 B 或 C。要升到 A，需要用台灣 IP 的瀏覽器重開表中的 URL。
- **Firecrawl**：第 2 次呼叫後每日額度就用完了（訊息附在最後）。另外，一個帶 `proxy: enhanced` 的請求被 auto-mode 判定為「Bot Check Circumvention」而拒絕。之後沒有再嘗試任何地區代理。
- **Netflix 台灣譯名**：House of Cards、Queen's Gambit、3 Body Problem、BoJack、A Man on the Inside、Sirens 的台灣譯名都沒有從服務頁驗證到，表中標「未驗」。
- **Groundlane `web_fetch` 抓 Netflix 頁**：回 `OUTPUT_LIMIT`（上游超過 byte 上限），改用 jina 和 Tavily 讀取。

Your Firecrawl credits ran out. Daily MCP credits refresh in 3h 31m. Add credits or upgrade to keep going: https://www.firecrawl.dev/billing/1cscjebvah18y5jxykvsw4ve0tn9fxgs
