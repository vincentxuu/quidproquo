# 台灣合法觀看管道：美劇 batch 2（30 部）

查核日：2026-11-05。來源清單：`tw-batch-2.tsv`。

## 方法與證據等級

- **JustWatch TW**：每部都用 Groundlane `web_extract` 直接讀 `https://www.justwatch.com/tw/節目/<slug>`，取「目前你可以在 X 上观看」那句和導出連結（click-out）。JustWatch TW 頁面自己標示「於 2026年11月5日 … 查看了 44 個串流服務」。注意：JustWatch TW 的 slug 是台灣片名的拼音（例如 `he-bao-jia-yuan` = 核爆家園），頁面 h1 卻是簡體中文，所以**片名一律以服務商頁面為準**。
- **服務商頁面**：
  - **HBO Max**：`https://www.hbomax.com/tw/zh/show/<uuid>`，用 Groundlane 讀取。回應的是台灣版頁面（zh-TW 標題與簡介、NT$183/月方案），但抓取出口不在台灣。每一頁的靜態 HTML 都有「This title currently isn't available to watch in your country」這段文字，包括 JustWatch TW 也有列出的作品，所以它是模板文字，**不能**用來判斷是否可看。判斷依據是：台灣地區頁面存在且已中文化，再加上 JustWatch TW 有列出。
  - **Disney+**：`https://www.disneyplus.com/zh-tw/browse/entity-<id>`，用 Groundlane 讀取，頁面標題為 zh-TW。
  - **Apple TV**：`https://tv.apple.com/tw/show/...`，用 Groundlane 讀取，頁面標題為 zh-TW。
  - **Netflix**：Groundlane 讀不了（OUTPUT_LIMIT）。改用 Firecrawl（指定 TW 地區、basic proxy），有 3 頁回應是台灣出口：`timezone: Asia/Taipei`、`og:locale zh-TW`、頁面關鍵字含「線上觀賞台灣」。之後 Firecrawl 的額度用完。其餘 Netflix 頁面用 Tavily／Exa 讀到，但那是美國／德國等地的出口，只能證明作品頁存在，不能證明台灣可看。
  - **Prime Video**：`primevideo.com/detail/...` 用 Groundlane 讀到，但出口在美國（顯示 US$ 價格、Sold by Amazon.com Services LLC），所以**沒有**確認到台灣可看。
- 優惠類型：除另行註明者外，JustWatch TW 列出的全是「串流」（月費訂閱）。這批作品在台灣都沒有找到購買、租借或免費含廣告的選項。

證據等級說明：
- **已在服務商頁面確認**：讀過台灣地區的服務商頁面，片名取自該頁，且 JustWatch TW 也一致。
- **僅 JustWatch**：只有 JustWatch TW 列出；服務商頁面存在，但不是從台灣讀取，或無法以台灣出口讀取。
- **未找到**：沒有找到可確認的台灣合法管道。

## 一覽表

| English title | 台灣官方譯名 | services (offer type) | title-page URL(s) | evidence status | notes |
|---|---|---|---|---|---|
| The Pitt | 匹茲堡醫魂 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/e6e7bad9-d48d-4434-b334-7c651ffc4bdf ・ JW: https://www.justwatch.com/tw/節目/the-pitt | 已在服務商頁面確認 | HBO TW 頁面顯示 2 季；JW 已列出第 3 季第 1 集 |
| Paradise | 極樂凶間 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-2b4b8988-50c9-4097-bf93-bc34a99a5b4f ・ JW: https://www.justwatch.com/tw/節目/paradise-2025 | 已在服務商頁面確認 | Hulu 原創，台灣在 Disney+ |
| Shōgun | 幕府將軍 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-5422a5f9-e4f1-475e-9217-65e8249388d0 ・ JW: https://www.justwatch.com/tw/節目/mu-fu-jiang-jun | 已在服務商頁面確認 | |
| The Gilded Age | 鍍金年代 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/2537da31-ff99-4195-a53e-e0e1ddb1d67e ・ JW: https://www.justwatch.com/tw/節目/the-gilded-age | 已在服務商頁面確認 | HBO TW 顯示 4 季 |
| The Mandalorian | 曼達洛人 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-422f6dcc-226f-44e7-98d4-22de69b31cf3 ・ JW: https://www.justwatch.com/tw/節目/the-mandalorian | 已在服務商頁面確認 | |
| It: Welcome to Derry | 牠：歡迎來到德利鎮 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/6c39354a-c52d-46d7-982c-b5d196988189 ・ JW: https://www.justwatch.com/tw/節目/welcome-to-derry | 已在服務商頁面確認 | JW h1 為「小丑回魂：欢迎来到德里镇」，不是台灣譯名 |
| House of the Dragon | 龍族前傳 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/c68e69d7-9317-428a-a615-cdf8fe5a2e06 ・ JW: https://www.justwatch.com/tw/節目/house-of-the-dragon | 已在服務商頁面確認 | HBO TW 顯示 3 季 |
| Succession | 繼承之戰 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/a8484031-f244-4661-9fb7-0932bd1ba872 ・ JW: https://www.justwatch.com/tw/節目/succession | 已在服務商頁面確認 | 4 季 |
| Wednesday | 星期三 | Netflix（訂閱） | https://www.netflix.com/tw/title/81231974 ・ JW: https://www.justwatch.com/tw/節目/wednesday | 已在服務商頁面確認 | 以台灣出口讀取（Firecrawl，Asia/Taipei）；共 2 季 |
| Chernobyl | 核爆家園 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/396999a6-3fff-4af3-802b-10c46d10deff ・ JW: https://www.justwatch.com/tw/節目/he-bao-jia-yuan | 已在服務商頁面確認 | 迷你影集，5 集 |
| The Morning Show | 晨間直播秀 | Apple TV（訂閱） | https://tv.apple.com/tw/show/umc.cmc.25tn3v8ku4b39tr6ccgb8nl6m ・ JW: https://www.justwatch.com/tw/節目/the-morning-show | 已在服務商頁面確認 | zh_hint「晨間直播室」有誤；官方譯名是「晨間直播秀」 |
| Fallout | 異塵餘生 | Prime Video（訂閱） | https://www.primevideo.com/detail/0HAQAA7JM43QWX0H6GUD3IOF70 ・ JW: https://www.justwatch.com/tw/節目/fallout | 僅 JustWatch | Prime 頁面是從美國出口讀取；譯名取自 `primevideo.com/-/zh_TW/` 的頁面標題「異塵餘生–第一季」。Amazon 原創，第 2 季已於 2025-12～2026-02 播出 |
| A Knight of the Seven Kingdoms | 七王國的騎士 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/3507a932-eace-46ea-bfe1-638ae819fa12 ・ JW: https://www.justwatch.com/tw/節目/a-knight-of-the-seven-kingdoms-the-hedge-knight | 已在服務商頁面確認 | 1 季 |
| Hacks | 天后與草莓 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/67e940b7-aab2-46ce-a62b-c7308cde9de7 ・ JW: https://www.justwatch.com/tw/節目/hacks | 已在服務商頁面確認 | HBO TW 顯示 5 季；JW h1「绝望写手」不是台灣譯名 |
| Fargo | 冰血暴 | Prime Video（訂閱） | https://www.primevideo.com/detail?gti=amzn1.dv.gti.3aa9f7ba-7328-4bc4-422f-a20ba2ad9584 ・ JW: https://www.justwatch.com/tw/節目/bing-xie-bao | 僅 JustWatch | Prime 頁面從美國出口讀取（美國頁面顯示購買單集）；zh_TW 頁面沒有中文化；譯名取自 JW TW（h1「冰血暴 (2014)」，slug 也是同一個名稱） |
| Curb Your Enthusiasm | 人生如戲 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/18a0993f-209a-4653-8f94-f3fb8422e678 ・ JW: https://www.justwatch.com/tw/節目/curb-your-enthusiasm | 已在服務商頁面確認 | 12 季 |
| What We Do in the Shadows | 吸血鬼家庭屍篇 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-0b10c46a-12f0-4357-8a00-547057b49bac ・ JW: https://www.justwatch.com/tw/節目/what-we-do-in-the-shadows | 已在服務商頁面確認 | |
| The Good Place | 良善之地 | — | JW: https://www.justwatch.com/tw/節目/liang-shan-zhi-di ・（舊）https://www.netflix.com/tw/title/80113701 | 未找到 | JW TW 明寫「我们在台灣找不到任何流媒体选项」，頁面上的 Amazon 連結是美國推廣。Exa 有一份 zh-TW 的 Netflix TW 快取頁（片名良善之地、NT$290/380/460 方案、沒有集數列表），快取日期不明，無法證明現在可看。需要人工用台灣 IP 開 Netflix 確認 |
| Euphoria | 高校十八禁 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/4ffd33c9-e0d6-4cd6-bd13-34c266c79be0 ・ JW: https://www.justwatch.com/tw/節目/gao-xiao-shi-ba-jin | 已在服務商頁面確認 | 3 季 |
| The Penguin | 企鵝人 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/5756c2bf-36f8-4890-b1f9-ef168f1d8e9c ・ JW: https://www.justwatch.com/tw/節目/the-penguin | 已在服務商頁面確認 | |
| Arcane | 奧術 | Netflix（訂閱） | https://www.netflix.com/tw/title/81435684 ・ JW: https://www.justwatch.com/tw/節目/arcane | 已在服務商頁面確認 | 以台灣出口讀取；Netflix TW 片名是「奧術」（JW 寫「奧術：英雄聯盟」）；2 季 |
| Dopesick | 毒疫 | Disney+（訂閱） | https://www.disneyplus.com/zh-tw/browse/entity-227de06a-d3d4-42e0-9df1-bb5495e1738d ・ JW: https://www.justwatch.com/tw/節目/dopesick | 已在服務商頁面確認 | |
| Mare of Easttown | 東城奇案 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/c1517b80-50ab-4733-8208-ae2c2765c0e7 ・ JW: https://www.justwatch.com/tw/節目/mare-of-easttown | 已在服務商頁面確認 | |
| Task | 特遣任務 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/86bc816f-97a7-4cd6-8d53-08d5e6337063 ・ JW: https://www.justwatch.com/tw/節目/te-qian-ren-wu | 已在服務商頁面確認 | |
| The Wire | 火線重案組 | HBO Max（訂閱） | https://www.hbomax.com/tw/zh/show/1bc3aff5-0d6a-4c0b-8ed0-5716ca30ab3b ・ JW: https://www.justwatch.com/tw/節目/huo-xian-zhong-an-zu | 已在服務商頁面確認 | 5 季 |
| Mindhunter | 破案神探 | Netflix（訂閱） | https://www.netflix.com/tw/title/80114855 ・ JW: https://www.justwatch.com/tw/節目/po-an-shen-tan | 已在服務商頁面確認 | 以台灣出口讀取；2 季 |
| The Beast in Me | 獸藏我心 | Netflix（訂閱） | https://www.netflix.com/tw/title/81427733 ・ JW: https://www.justwatch.com/tw/節目/the-beast-in-me | 僅 JustWatch | Netflix 頁面只讀到非台灣出口的英文版（以台灣出口讀取時 Firecrawl 回 403，之後額度用完）。譯名只有搜尋摘要：台灣媒體（stufftaiwan.com 2025-11-10、livio.com.tw）寫《獸藏我心》；JW 的 h1「兽藏我心」一致 |
| American Primeval | 馴荒記 | Netflix（訂閱） | https://www.netflix.com/tw/title/81457507 ・ JW: https://www.justwatch.com/tw/節目/american-primeval | 僅 JustWatch | Netflix 頁面只讀到非台灣出口的版本。譯名取自搜尋摘要（ELLE 台灣），JW 的 h1「驯荒记」一致 |
| Narcos | 毒梟 | Netflix（訂閱） | https://www.netflix.com/tw/title/80025172 ・ JW: https://www.justwatch.com/tw/節目/du-xiao | 僅 JustWatch | Netflix 頁面只讀到非台灣出口的版本。譯名取自搜尋摘要「觀賞《毒梟》｜Netflix 正式網頁」（Netflix 台灣 staging 網域），JW slug 也是 du-xiao |
| The Residence | 白色官邸殺人事件 | Netflix（訂閱） | https://www.netflix.com/tw/title/81005297 ・ JW: https://www.justwatch.com/tw/節目/bai-se-guan-di-sha-ren-shi-jian | 僅 JustWatch | Netflix 頁面只讀到非台灣出口的版本（德國版）。譯名依 JW TW slug（就是這個片名的拼音）加 zh_hint，沒有讀到台灣頁面標題 |

## 統計

- 已在服務商頁面確認：23 部（HBO Max 14、Disney+ 5、Netflix 3、Apple TV 1）
- 僅 JustWatch：6 部（Netflix 4：The Beast in Me、American Primeval、Narcos、The Residence；Prime Video 2：Fallout、Fargo）
- 未找到：1 部（The Good Place）

## 沒有找到台灣合法管道

- **The Good Place（良善之地）**：JustWatch TW（2026-11-05）明說台灣沒有串流選項。試過：JW TW 頁面、Prime Video（美國出口，只有美國的購買選項）、Netflix TW 標題頁 80113701（Groundlane 讀不了；Tavily 的出口是烏克蘭／巴西；Exa 有一份日期不明的 zh-TW 快取頁，沒有集數列表）。另外搜尋了 friDay／CATCHPLAY／KKTV，沒有找到正版頁面；搜尋結果中有盜版站，已排除、不列出。建議用台灣 IP 人工開 Netflix TW 確認是否已下架。

## zh_hint 修正

- The Morning Show：晨間直播室 → **晨間直播秀**（Apple TV TW）
- Arcane：Netflix TW 片名是 **奧術**（不是「奧術：英雄聯盟」）
- Hacks：**天后與草莓**（HBO Max TW）
- Curb Your Enthusiasm：**人生如戲**（HBO Max TW）
- The Penguin：**企鵝人**（HBO Max TW）
- Fallout：**異塵餘生**（Prime Video zh_TW）
- Fargo：**冰血暴**（JW TW；Prime 沒有中文化）
- The Beast in Me：**獸藏我心**（搜尋摘要）
- Narcos：**毒梟**（搜尋摘要）
- 其餘 zh_hint 與服務商頁面一致（匹茲堡醫魂、極樂凶間、幕府將軍、鍍金年代、曼達洛人、牠：歡迎來到德利鎮、龍族前傳、繼承之戰、星期三、核爆家園、七王國的騎士、良善之地、高校十八禁、毒疫、東城奇案、特遣任務、火線重案組、破案神探、馴荒記、白色官邸殺人事件）

## 工具降級紀錄（toolDegradation）

- Groundlane `web_fetch`／`web_extract` 讀 Netflix 一律 OUTPUT_LIMIT（maxBytes 調到 20MB 也一樣）。
- Firecrawl：stealth proxy 會被導到美國版頁面；basic proxy 加 TW location 成功 3 頁，同時送出時 4 頁回 403，之後 hosted MCP 的每日額度用完（約 3.5 小時後重置）。Your Firecrawl credits ran out. Daily MCP credits refresh in 3h 32m. Add credits or upgrade to keep going: https://www.firecrawl.dev/billing/1cscjebvah18y5jxykvsw4ve0tn9fxgs
- Tavily extract、Exa fetch、Jina read_url：出口在美國／歐洲，Netflix 回當地版本，不能拿來證明台灣可看。
- JustWatch TW 的 slug 是台灣片名拼音，英文 slug 常常 404（回 19 bytes）；改用 `https://www.justwatch.com/tw/search?q=<英文片名>` 取得正確 slug（例如 Fargo → bing-xie-bao、Derry → welcome-to-derry）。
