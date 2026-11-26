# R-rope-C：評測彙整＋其他品牌單繩＋判準依據

查核日 2026-10-23。依 R-rope-brief.md 的來源規則撰寫。這份由三塊組成：第 1 塊由主 agent 研究；第 2、3 塊由兩個子 agent 研究後併入，各自保留 toolDegradation。

## toolDegradation（總覽）

- 第 1 塊（評測）：
  - Groundlane MCP `web_search`／`web_fetch` 為主，OutdoorGearLab、Switchback、Climbing.com、UKC 列表頁都用它讀到。
  - GearJunkie：Groundlane web_fetch 逾時（DEADLINE_EXCEEDED，卡在 browser-challenge），firecrawl MCP 未連線，改用 Exa `web_fetch_exa` 才讀到。
  - UKC 個別評測頁：Groundlane Reader 只抽到側欄，jina MCP 未連線，改用 Exa 讀到全文。
  - Switchback 舊網址 `/best-climbing-ropes` 回 404，透過搜尋找到現行網址。
  - Groundlane 直接 HTTP、Keenable、You.com keyless 都沒試：MCP 可用，只有個別頁失敗，所以直接跳到雲端 MCP。
- 第 2 塊：見下方第 2 節自己的 toolDegradation。Shopify／WooCommerce 用 curl；Kailas 降級到 Exa；firecrawl、jina 未連線。
- 第 3 塊：見第 3 節自己的 toolDegradation。大型 PDF 用本機 curl 加 pdftotext，這一步不在 brief 的抓取順序內。

## 讀不到的頁（三塊合併）

- 第 1 塊：
  - Switchback 舊網址 `/best-climbing-ropes` 回 404，已改讀現行網址。
  - OutdoorGearLab、Switchback 全文過長，輸出被截斷：OGL 截在 Features 段之後，Switchback 截在「Other favorites」中段，比較表、FAQ、Tested & Dismissed 都沒讀到。
- 第 2 塊：
  - Kailas 中國官網 kailas.com.cn：阿里雲防火牆擋下，回 410。
  - Kailas 京東頁：只拿到 QR code。
  - Kailas 天貓頁：需要登入。
  - Kailas 舊國際站 Soarer 頁：404。
  - rocaropes.com：停放網域，沒有產品。
  - Fixe 原廠價格欄：顯示 0.00。
- 第 3 塊：
  - Beal Unicore 頁：404。
  - Petzl How-to-choose 頁：被轉到產品列表。
  - Petzl CA 洗繩頁：404，改讀 NL 版。
  - 猜測的 Sterling 舊網址：404。

---

## 1. 2020 年後的繩子評測彙整

### OutdoorGearLab — The Best Rock Climbing Ropes of 2026
- URL: https://www.outdoorgearlab.com/topics/climbing/best-climbing-rope
- 作者 Trish Matheny；頁面 publishedAt 2026-08-19（meta）；測 16 款；工具 Groundlane web_fetch（輸出截斷於 Features 段之後）
- 評分權重：Handling 30% / Durability 25% / Versatility 20% / Features 15% / Weight 10%
- 得獎：
  - Editors' Choice（Best Overall）：Mammut 9.5 Crag Classic（59 g/m；50/60/70/80 m）— 手感好、耐用；缺點「染色中點標記很快就磨掉」、偏重；無乾式處理的 Classic 版會吃髒
  - Best Buy：Mammut 9.5 Crag We Care Classic（58 g/m；40–80 m）— 同 Crag Classic 表現；無雙色選項、中點標記不持久
  - Top Pick 主力繩：Sterling VR9 9.8（62 g/m；DryCore）— 一週運攀密集使用後「看起來像新的」；重、通用性低
  - Top Pick 超輕高山：Beal Opera 8.5（48 g/m，三重認證）— 手感最好；「外皮材料較少可吸收磨耗」，天天在岩場用時「磨得較快」；不建議單繩距／健身房
  - Top Pick 頂級傳攀多繩距：Sterling IonR 9.4 XEROS（57 g/m；40/60/70/80 m）— 雙色中點清楚；手感偏硬；雙色繩一端裁掉後要兩端等量裁，否則中點失準
  - Top Pick 多繩距：Beal Joker 9.1（53 g/m，三重認證，Unicore）— 輕滑；「外皮相對容易磨損」、在輔助制動確保器咬得較不明確，不適合長時間頂繩
  - Top Pick 運攀／高山跨界：Sterling Aero 9.2 Xeros（56 g/m；40/70/80 m）— 最通用；缺點「容易起毛」
- 耐用度通則：最粗的繩耐用度最好（材料多、貼岩面接觸較分散）；9.5–9.6 次之；乾式處理也能減緩外皮磨耗；外皮磨損主要來自岩稜與晶體摩擦
- 細繩手感：細繩較好操作但較難握持／確保，差異會互相抵銷
- Unicore（Beal）：能止住外皮破損擴散，但對一般外皮磨耗幫助有限
- Mammut 9.5 Alpine Core Protect Dry：耐割外皮＋乾式處理，一週大岩壁首攀幾乎無磨損
- 中點：Beal Opera 中點標記容易看，但「很快磨掉、要常重畫」；Edelrid Tommy Caldwell Eco Dry ColorTec 9.3 雙色中點最好
- 未提「石灰岩」「旅行」專段（擷取範圍內）；Aero 9.2 文中說「帶去長途攀岩旅行」

### GearJunkie — The Best Climbing Ropes of 2026
- URL: https://gearjunkie.com/climbing/best-climbing-ropes
- 作者 Miya Tsudome、Matt Bento；更新 2026-05-14（Editor's Note）；測試地：Pine Creek Canyon 花崗岩、Owens River Gorge 熔結凝灰岩；工具：Groundlane web_fetch 逾時（DEADLINE_EXCEEDED, browser-challenge）→ firecrawl 未連線 → Exa web_fetch_exa 成功
- 得獎：
  - Best Overall：Mammut Alpine Core Protect 9.5（59 g/m，外皮＋繩芯乾式）— 4 個月後無起毛、中點標記「仍看得到」；外皮含 4% 芳綸
  - Best Budget：Mammut Crag We Care Classic 9.5（58 g/m，無乾式）— 未乾式處理「不會那麼耐久」，乾式處理也防塵土滲入外皮造成磨耗
  - Best Sport：Petzl Arial 9.5（58 g/m，Duratec Dry）— 文中寫外皮比例 40%、UltraSonic Finish 繩尾；缺點：重度使用一個月後外皮輕微起毛
  - Best Workhorse：Edelrid Tommy Caldwell Eco Dry DuoTec 9.6（62 g/m）— 「高外皮比例」耐磨；久用變硬；實秤 70 m 比標示重（標 9.5 lb、秤 11 lb 6 oz）
  - Best Daily Driver：Sterling VR9 9.8（62 g/m，只有繩芯 DryCore）— 有預印中點；非「全乾式」
  - Best Alpine：Edelrid Siskin 8.6 Eco Dry（表 50 g/m；規格欄寫 48）— 三個月後外皮磨痕比粗繩多；不建議頂繩、不建議當日常主繩；GriGri 2／Pinch 下限 8.5 mm，8.6「很接近」，需特別小心防滑
  - 另列：Sterling Aero 9.2 XEROS（新繩時易在 GriGri 滑動；一年後因被磨出溝的固定鉤環裁掉 1 m）、Trango Agility Duo Dry 9.1（1×1 編織較耐磨；「中點標記會褪色」）、Sterling IonR 9.4 BiColor XEROS（雙色比會褪色的中點標記更安全）、Edelrid Boa Eco 9.8（無乾式，建議用繩袋／地布）
- 通則：粗繩較耐用、確保較容易；細繩過確保器快、「需要專注有經驗的確保者」；GriGri 2 適用 9.4–10.3 mm、現行 GriGri 可到 8.5 mm；繩徑公差 ±0.3 mm；新繩較滑，起毛後變粗；建議西班牙等長路線注意長度，80 m 較專門、選細徑可減重

### Switchback Travel — Best Climbing Ropes of 2026
- URL: https://www.switchbacktravel.com/climbing/best-ropes（舊網址 /best-climbing-ropes 回 404）
- 作者 Chris Carter；publishedAt 2026-05-27；工具 Groundlane web_fetch（輸出截斷於「Other favorites」中段，Tested & Dismissed／比較表／FAQ 未讀到）
- 得獎：
  - Best Overall：Mammut 9.5 Crag Dry（60 g/m）— 比細繩耐用得多；乾式處理符合 UIAA 撥水標準、防塵；有雙色版 Crag Duodess
  - Best Budget：Mammut Crag We Care Classic 9.5（59 g/m）— 無乾式，沙土較快滲入外皮磨損
  - Best Redpoint：Edelrid Swift Eco Dry 8.9（54 g/m，三重認證）— 同級中較耐用；延伸率 34%（Opera 36%）
  - Best Cragging Workhorse：Sterling Velocity XEROS 9.8（62 g/m）— 耐用度和 10 mm 繩相當；UIAA 認證乾式
  - Best Ultralight Alpine：Beal Opera Golden Dry 8.5（48 g/m）— 缺點「不夠耐用、很有彈性」；舊版 GriGri 不相容
  - Best Cut-Resistant：Mammut Alpine Core Protect Dry 9.5（59 g/m）— 芳綸層防割；UIAA 墜落次數較低
  - 其他：Mammut 9.8 Crag Classic（64 g/m，無乾式，建議繩袋＋定期清洗）；Sterling Nano 8.9 XEROS（52 g/m，耐磨好；黑色中點在藍繩上難辨識）；BlueWater Lightning Pro Double Dry 9.7（64 g/m，UIAA 8 次；很快變軟塌，繩尾打結處磨較快；非雙色款無中點）
- 乾式說明：有的只處理外皮、有的外皮＋繩芯（Beal Dry Cover vs Golden Dry）；UIAA 2014 起有撥水認證（搜尋摘要）
- 未見「石灰岩」「旅行」專段（擷取範圍內）

### Climbing.com — The Best Climbing Ropes of 2026, Tested and Reviewed
- URL: https://www.climbing.com/gear/best-climbing-ropes/
- 作者 Matt Samet；發布 2026-04-27，更新 2026-08-05（「refreshed pricing and availability」）；測 9–10 條，四個月、5 位測試者；測試地含內華達 Mormon Mountains 沙漠石灰岩、Red River Gorge 雨雪；工具 Groundlane web_fetch（全文）
- 得獎：
  - Best All-Around：BlueWater Xenon 9.2 Standard（60 g/m；60/70/80 m）— 拉斯維加斯 Red Rock 砂岩＋內華達石灰岩使用；僅繩尾約 3 m 輕微起毛、未需裁繩；缺點：標準款無中點、以繩徑來說偏重
  - Best Gym & Crag：Sterling VR Eco 9.6（61 g/m；40/60/70/80 m）— 耐磨不錯（扛過傷過同級繩的偉晶岩尖唇）；新繩手感「塑膠感」
  - Best Lightweight Cragging：Mammut Crag Eco Dry 9.5（60 g/m；30–80 m）— 一年測試後兩端各裁幾公尺；在尖銳晶體岩唇頂繩會磨傷外皮；PFC-free 乾式處理在雨中有效
  - Best Sport：Metolius Monster 9.8（65 g/m；僅 70 m）— 耐用；中點為編入外皮的橘色紗線
  - Best Alpine：Fixe Pedraforca 8.8（54 g/m；40–200 m）— 耐用、撥水；三條紋中點＋8 m 繩尾警示帶「都會隨使用褪色」；以繩徑來說偏重
  - Best Trad：Black Diamond 9.4 Dry（58 g/m；僅 70 m）— 1×1 編織，數月後幾乎無磨損；外皮抓手、下放較慢
- FAQ 重點：>9.4 mm 一般比 ≤9.4 mm 耐用，但外皮編織與處理改善了細繩；外皮比例是耐用度指標，但紗線數、編織、處理會讓它不那麼可靠，外皮太厚會變硬；濕繩吸能「最多下降 30%」；UIAA 撥水認證：15 分鐘測試吸水 <5% 自重，未處理繩可吸到 50%；避免高溫與 UV 存放（如車內）；繩磨損要裁端，裁短後更要繩尾打結

### UKClimbing 個別評測（2020 後的動力單繩／三重認證繩）
索引頁：https://www.ukclimbing.com/gear/climbing/ropes/（Groundlane web_fetch extract=full 讀到列表）。個別頁 Groundlane Reader 只抽到側欄（extract 失敗）→ jina 未連線 → Exa web_fetch_exa 成功讀全文。

1. Tendon Master Pro 9.2mm — Tim Hill，2025-08-15，https://www.ukclimbing.com/gear/climbing/ropes/tendon_master_pro_92mm-16493
   - 手感軟、像 9.4–9.5；大量使用後外皮看起來仍好，但「繩芯局部變扁」；評者經驗：軟繩長期較不耐用，重度使用要盯；Complete Shield 外皮＋繩芯乾式，宣稱也防塵增耐磨；長度 40–100 m
2. Edelrid Siskin Eco Dry 8.6mm — John McKenna，2025-05-19，https://www.ukclimbing.com/gear/climbing/ropes/edelrid_siskin_eco_dry_86mm_-_the_lightest_single_rope_on_the_market-16343
   - 為歐陸長路線選 80 m；48 g/m，80 m 收起來像 70 m；缺點：比粗繩不耐用、不是所有確保器相容、下放時很敏感、墜落後繩結變緊
   - 「較不適合磨蝕性岩石或重度使用」；同伴去特別粗糙的岩場時改帶粗繩；外皮編織緊密，耐磨尚可，但扛不住持續墜落與高摩擦地形
   - 西班牙行時同伴的 Edelrid Eddy 未核可 8.6 mm；GriGri 可用但貼近 8.5 mm 下限，「最好由有經驗的確保者操作」，不放心讓新手確保
   - 中點標記明顯好認；Eco Dry 防水防塵延長壽命
3. Edelrid Eagle Lite Protect Pro Dry 9.5mm — John McKenna，2023-10-12，https://www.ukclimbing.com/gear/climbing/ropes/edelrid_eagle_lite_protect_pro_dry_95mm-15316
   - 59 g/m，外皮含芳綸，Edelrid 切割長度 28.5 cm（同款無芳綸 Eagle Lite 20 cm、10.3 Cobra 21 cm）；Pro Dry 吸水 1–2%；出廠即有中點標記；手感偏硬、確保時要多注意；推薦用在尖銳／磨蝕性岩石；出國阿爾卑斯花崗岩多繩距配輔助繩
4. Edelrid Swift Protect Pro Dry 8.9（三重認證）— Tom Ripley，2020-11-03，https://www.ukclimbing.com/gear/climbing/ropes/edelrid_swift_protect_pro_dry_triple-rated_rope-13054
   - 評者：三重認證繩為了夠細，廠商常把外皮做薄，一般不耐用、近銳利邊緣時會緊張；「外皮比例低的細單繩很快起毛」；本款含芳綸，近 2000 m 阿爾卑斯花崗岩後僅輕微起毛
   - 三重認證在「旅行時要在雙繩技術與單繩之間切換、又不想帶很多條繩」很方便；60 m 三重認證＋60 m 半繩適合美西公路旅行
   - 通過 UIAA 撥水測試（吸水 1–2%）
- 2020 前（不列入）：Petzl Volta 9.2（2019-09）、Ocun Spirit 9.5（2019-05）、Mammut Infinity 9.5（更早）
- UKC 列表上 2021–2022 的 Beal Opera／Tiger／Mammut We Care 條目屬「Latest News（廠商公告）」，非 UKC 評測，不列入

---

## 2. 其他品牌現行單繩


查價與查規格日期：2026-10-23。規格只採原廠頁，零售頁只用來查價。

### toolDegradation

- **Groundlane MCP**（`mcp__claude_ai_groundlane__web_search` / `web_fetch` / `web_extract`）：ToolSearch 載入成功，是主要工具。搜尋時 tavily、exa 常回 unavailable，brave 偶爾也是，實際多半由 brave＋you 回結果。`web_fetch` 的 render=always 能打開 Fixe（PrestaShop，前端用 JS 渲染）的商品列表和商品頁。
- **curl 直接抓**（不在降級鏈上，算輔助）：用在 Shopify 的 `<product>.json`／`.js`（Maxim 美國商店、kailasgear.com）、WooCommerce 的 `data-product_variations` 與 Store API（BlueWater、Maxim 歐洲站），再用本機 Python 解析。抓下來的原始檔放在 scratchpad 的 `rope/` 資料夾。
- **Exa**（`web_search_exa`）：Kailas 走 Groundlane 查不到原廠 9.x mm 規格頁，降級改用 Exa，只找到零售頁。
- **firecrawl**（`firecrawl_search`）：失敗，錯誤訊息「MCP server "claude.ai firecrawl" is not connected」。
- **jina**（`read_url`）：失敗，錯誤訊息「MCP server "claude.ai jina" is not connected」。
- 沒用到：Groundlane 直接 HTTP、Keenable、You.com keyless、Tavily、linkup、內建 WebFetch。原因是 Groundlane MCP 能用；Kailas 中國官網那一關，伺服器端用 Groundlane 瀏覽器渲染試過，回應碼一樣是 410。

### 讀不到的頁

| 頁面 | 用過的工具 | 失敗原因 |
|---|---|---|
| Kailas 中國官網 `http://www.kailas.com.cn/Home/Goods/goodsList/id/0.html`（找 Soarer 9.1 等 9.x 動力繩） | curl、Groundlane web_fetch（render=always）、jina read_url | curl 拿到阿里雲 WAF 攔截頁；Groundlane 回 HTTP 410，頁面寫「Alibaba Cloud Web Application Firewall… website is temporarily inaccessible」；jina 未連線 |
| Kailas 京東旗艦店 `https://kailas.jd.com/view_search-68410-0-99-1-24-1.html` | Groundlane web_fetch（render=always） | 只回 QR code 圖（「京東APP扫一扫」），沒有商品內容；42 個子請求被擋 |
| Kailas 天貓旗艦店 `kailas.tmall.com` | curl | 被轉址到 `kailas.world.tmall.com/shop/view_shop.htm`，沒有可讀的商品規格；沒再深挖（要登入） |
| Kailas 舊國際站頁 `kailasgear.com/92mm-super-dry-climbing-dynamic-rope-soarer_p2624.html` | curl | 404 |
| Roca 原廠站 `https://www.rocaropes.com` | curl、Groundlane 搜尋 | 網域已停放（轉到 `/lander`，GoDaddy parking 頁），沒有產品 |
| Fixe 原廠站價格 | curl、Groundlane web_fetch（render=always） | 頁面讀得到，但價格欄位是 `"price":"0.00"`，畫面上沒有價格；改用零售店價格 |

---

### Maxim（Teufelberger 集團；美國商店 shop.maximropes.com，歐洲站 maximropes.com）

> 原廠在兩個站都寫：「The Pinnacle range has now transitioned to a highly durable 9.4mm rope」。另一個 Maxim 頁面還寫「The new 9.4mm Pinnacle construction will replace the existing 9.4 and 9.5mm ropes」。**派工單寫的 Pinnacle 9.5 已被 9.4 取代；Airliner 目前是 9.0 mm，不是 9.1。**

#### Maxim Pinnacle 9.4

- 原廠頁：https://shop.maximropes.com/products/9-4mm-pinnacle-climbing-rope ；歐洲站：https://www.maximropes.com/produkt/pinnacle/
- 繩徑 9.4 mm；重量 57.0 g/m（3.60 lbs/100 ft）
- 認證：Single rope（EN 892、UIAA 101）
- UIAA 墜落次數「6-10」（原廠寫成區間）；最大衝擊力 9.0 kN；外皮滑移 0 mm；動態延伸 32.5%；靜態延伸 8.0%
- 外皮比例：原廠未標
- 防水處理：所有 Maxim 動力繩的繩芯都有 Endura DRY。外皮處理依顏色不同，歐洲站寫 Blue Ocean 2x-DRY、Community STD-DRY、Yellowjacket 2x-DRY | Bi-Pattern。原廠對 2x-DRY 的說法是「dry core and a specially treated dry cover…fulfill the requirements of UIAA water-repellency」。歐洲站本文另有一句「All Pinnacle ropes have an Endura DRY-treated core and a 2x-DRY cover」，跟 Community 標的 STD-DRY 對不上；美國站則寫「some versions features a 2x-DRY cover」。外皮 TPT 織紋；原廠寫「PFC/PFAS free sheath」
- 長度（美國站以英尺販售）：200 ft（約 61 m）、230 ft（約 70 m）、265 ft（約 81 m）、660 ft（整卷），另有按英尺零切。**70 m 有、80 m 有**（以 265 ft 對應）。Yellow Jacket 雙色版只有 230 ft、265 ft
- 中點標記：有。原廠原文「regular pattern with middle mark and bi-pattern」，表示單色款有中點標記、Yellow Jacket 是雙色
- 雙色：有（Yellow Jacket | Bi-Pattern）
- 官方價格（USD，2026-10-23，美國原廠商店；Shopify JSON 顯示 available=true）：
  - Blue Ocean（2x-DRY）：200 ft $278.00／230 ft $323.00／265 ft $370.00
  - Community（STD-DRY）：200 ft $258.06／230 ft $293.00／265 ft $335.00
  - Yellow Jacket 雙色（2x-DRY）：230 ft $358.00／265 ft $408.00
  - 換算總重（以 57 g/m 計）：70 m 約 3.99 kg，80 m 約 4.56 kg
- 2020 年後第三方評測：**沒找到針對 9.4 新版的媒體評測。** 找到的都是 9.5 舊版、而且在 2020 年前：OutdoorGearLab（2017-09-11，https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/maxim-pinnacle）、Gear Institute（2017-11-12）。兩篇都不符合「2020 年後」，只列出不採用
- 適合誰／缺點：9.4 mm、57 g/m，有 80 m 也有雙色，適合出國運攀想帶 80 m 又不想太重的人。缺點是原廠沒標外皮比例，耐磨程度無從比較；STD-DRY 款的外皮處理也和 2x-DRY 款不同，要看清楚顏色

#### Maxim Airliner 9.0

- 原廠頁：https://shop.maximropes.com/products/maxim-airliner-dynamic-climbing-rope ；歐洲站：https://www.maximropes.com/produkt/airliner/
- 繩徑 9.0 mm；重量 54.0 g/m（3.63 lbs/100 ft，原廠寫法如此）
- 認證：single、twin、half 三重認證（EN 892、UIAA 101）
- 單繩／半繩／雙子繩數據：墜落次數 5-9／18／28；衝擊力 8.9／6.9／10.3 kN；動態延伸 33.5／31.0／29.5%；靜態延伸 10.0／10.0／7.5%；外皮滑移 0 mm
- 外皮比例：原廠未標
- 防水處理：2x-DRY，原廠原文「we dry treat the core and the sheath…This level of treatment meets the UIAA Dry standard」；PFC & PFAS free
- 長度：200 ft、230 ft、265 ft（約 61／70／81 m）。**70 m 有、80 m 有**
- 中點標記：原廠未標（只寫「regular rope pattern」）
- 雙色：無（只有 Carnival 2x-DRY、Jungle 2x-DRY 兩種顏色）
- 官方價格（USD，2026-10-23，美國原廠商店）：Carnival 230 ft $312.00／265 ft $355.00；Jungle 200 ft $267.00／230 ft $312.00／265 ft $355.00。**所有規格的 Shopify `available` 都是 false，查價當下美國原廠缺貨。** 換算總重：70 m 約 3.78 kg，80 m 約 4.32 kg
- 2020 年後第三方評測：沒找到媒體評測。Gear Institute 2017-11-11 評的是 9.1 舊版（https://gearinstitute.com/gear-review/maxim-airliner-9-1/），原文「offered the stiffest handling and fared the poorest in terms of overall handling in this group」，在 2020 年前且型號不同，只列出不採用
- 適合誰／缺點：54 g/m、三重認證、UIAA Dry，適合想用一條繩兼顧運攀和多繩距雙股垂降的人（第二條同款可當半繩／雙子繩用）。缺點：9.0 mm 偏細，原廠自己寫「Designed for expert level climbing」；沒標中點，也沒有雙色；美國原廠目前全缺

---

### BlueWater Ropes（美國；bluewaterropes.com）

> 派工單提到的「Lightning Pro 9.2」「Icon 9.1」在原廠 Store API 搜尋結果裡都沒有。目前在賣的單繩是 **Lightning Pro 9.7** 和 **Xenon 9.2**（三重認證）。另有 8.8 Argon，這次沒收。
>
> 中點標記：原廠 FAQ 明寫不做出廠中點標記，原文「Why does BlueWater not use factory middle marks on dynamic ropes? … We prefer the end user to make all marks」（https://www.bluewaterropes.com/faq/）。

#### BlueWater 9.7mm Lightning Pro Dynamic Single Rope

- 原廠頁：https://www.bluewaterropes.com/product/9-7mm-lightning-pro-dynamic-single-rope/
- 繩徑 9.7 mm；重量 64.42 g/m
- 認證：single
- 墜落次數 8；衝擊力 7.9 kN；靜態延伸 8.8%；動態延伸 31.2%；外皮滑移 0 mm
- 外皮比例：37%（原廠寫「Sheath Mass」）
- 防水處理：分 Standard 和 Double-Dry 兩種版本。原廠商品頁沒說明 Double-Dry 處理的範圍（外皮或繩芯），也沒寫有沒有 UIAA WR，所以寫「原廠只寫 Double-Dry，範圍未標」
- 長度：商品頁「Available in」文字只列 30／40／60／70 m，但下拉選單實際能選到 80 m Standard、80 m Double-Dry、80 m Double-Dry Bi-Color。**70 m 有、80 m 有**（以實際販售選項為準，文字敘述是舊的）
- 中點標記：無（FAQ 說明不做出廠中點標記）
- 雙色：有（Double-Dry Bi-Color，只有 Fluorescent/Sprout 色）
- 官方價格（USD，2026-10-23，WooCommerce 變體資料，全部 is_in_stock=true）：
  - 60 m Standard $250.95／Double-Dry $271.95／DD Bi-Color $315.95
  - 70 m Standard $291.95／Double-Dry $314.95／DD Bi-Color $358.95
  - 80 m Standard $333.95／Double-Dry $358.95／DD Bi-Color $365.95
  - 換算總重：70 m 約 4.51 kg，80 m 約 5.15 kg
- 2020 年後第三方評測：Switchback Travel，「Best Climbing Ropes of 2026」，標示 Updated: May 27, 2026，https://www.switchbacktravel.com/best-rock-climbing-ropes 。原文「What we like: Super supple and rated for 8 UIAA falls. What we don't: Can get floppy; no middle mark on non-bi-pattern model.」另外 OutdoorGearLab 2017-09-11 的評測在 2020 年前，不採用
- 適合誰／缺點：外皮 37%、墜落 8 次，偏耐用，適合兩週天天上下放的石灰岩行程。缺點是 64.42 g/m，80 m 就超過 5 kg，對登機行李不友善；也沒有中點標記，要自己畫

#### BlueWater 9.2mm Xenon Dynamic Single, Half, & Twin Rope

- 原廠頁：https://www.bluewaterropes.com/product/9-2mm-xenon/
- 繩徑 9.2 mm；重量 59.64 g/m
- 認證：single、half、twin
- 單繩／半繩／雙子繩數據：衝擊力 7.7／6／8.9 kN；墜落 7／21／42；靜態延伸 4.7／4.7／3.2%；動態延伸 29.3／30.0／24.5%；外皮滑移原廠寫「0%」
- 外皮比例：33%
- 防水處理：Standard 或 Double-Dry；範圍原廠未標（同 Lightning Pro）
- 長度：60／70／80 m 都有，Standard、Double-Dry、Bi-Color 都有。**70 m 有、80 m 有**
- 中點標記：無（同上 FAQ）
- 雙色：有（Standard Bi-Color、Double-Dry Bi-Color，只有 Red Orange/Black 色）
- 官方價格（USD，2026-10-23）：
  - 60 m Standard $237.95／DD $256.95／Std Bi $276.95／DD Bi $295.95
  - 70 m Standard $276.95／DD $295.95／Std Bi $314.95／DD Bi $334.95
  - 80 m Standard $314.95／DD $334.95／Std Bi $353.95／DD Bi $372.95
  - 80 m Double-Dry Red Orange/Black 缺貨，同規格其他顏色有貨
  - 換算總重：70 m 約 4.17 kg，80 m 約 4.77 kg
- 2020 年後第三方評測：OutdoorGearLab，「Bluewater Xenon 9.2 Review」，編者註寫 updated December 22nd, 2022，https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/bluewater-xenon-9-2 。結論原文「it failed to distinguish itself from other ropes near the same diameter… we can't recommend this rope at full MSRP. However, it could become a decent value if you can find it on sale.」（OGL 實秤 56 g/m，跟原廠的 59.64 不同，這裡只是轉述）
- 適合誰／缺點：80 m 雙色版加三重認證，可以一條繩兼顧運攀和多繩距雙股垂降。缺點：外皮只有 33%，OGL 也點名「Minimal sheath」，在銳利石灰岩上耐磨可能不如外皮比例高的繩；沒有中點標記

---

### Kailas 凱樂石（中國；國際站 kailasgear.com，中國官網 kailas.com.cn）

> 國際官方商店 kailasgear.com 的整份 `products.json`（翻了 4 頁、每頁 250 筆）只有一款動力繩 **MAGMA 10.1**，加上一條 Dynamic Sling。9.x mm 的 Soarer 系列在國際站沒有商品頁；中國官網被 WAF 擋，京東、天貓也讀不到（見上方「讀不到的頁」）。所以符合「9.0–9.8 mm」的 Kailas 繩款**沒辦法用原廠頁核實**。

#### Kailas MAGMA 10.1mm Dynamic Rope（目前唯一能用原廠頁核實的款）

- 原廠頁：https://kailasgear.com/products/kailas-magma-10-1mm-x-50m-dynamic-rope ；https://kailasgear.com/products/kailas-magma-10-1mm-x-100m-dynamic-rope
- 繩徑 10.1 mm；重量 69 g/m
- 認證：Single Rope（CE0082 EN892:2004 UIAA）
- 墜落 5 次；首次衝擊力 8 kN；外皮滑移 0 mm；首次墜落延伸 35%；靜態延伸 6.2%；48 股編織
- 外皮比例：原廠未標
- 防水處理：原廠未標（頁面只寫 ENDURANCE 編織和 COMPACT treatment，沒提防水）
- 長度：原廠寫「50m, 70m, 100m」。**70 m 有、80 m 無**
- 中點標記：有，原文「Special black marking at the rope midpoint」
- 雙色：原廠未列
- 官方價格（kailasgear.com，幣別推測為 USD，2026-10-23）：50 m Crystal Purple $300.00（有貨）；100 m Yellow 和 Crystal Purple 都是 $125.00（缺貨）。**50 m 比 100 m 貴，價格明顯不合理，可能是商店資料有誤，不建議引用。** 70 m 在國際站沒有商品
- 2020 年後第三方評測：沒找到
- 適合誰／缺點：10.1 mm、69 g/m，原廠定位是頂繩、戶外和岩館，不是旅行輕量繩。70 m 約 4.83 kg，沒有 80 m，**不適合本篇的出國運攀判準**；收錄只是為了說明 Kailas 國際站現況

#### Kailas Soarer 9.1mm（原廠頁讀不到，只列出供主 session 判斷要不要追）

- 有人在賣的證據：京東價格頁 snippet 出現「凯乐石 Soarer高飞9.1mm动力绳 ER103A ER103B ER103C」；淘寶店鋪列表 snippet 出現「KAILAS凯乐石Soarer 高飞 9.1mm动力绳」。這兩個都是搜尋 snippet，沒打開商品頁
- 零售頁（**非原廠，未核實，不能當規格來源**）：俄羅斯 Alpindustria，https://krasnoyarsk.alpindustria.ru/product/verevka-dinamicheskaya-kailas-soarer-9.1-mm-80-m_-61356/ ，標示 52 g/m、三重認證、外皮 34%、Super Dry 符合 UIAA、有中點黑標、款號 ER103C、80 m，售價 49,175 RUB（原價 70,250 RUB，有貨）
- 結論：**原廠規格未核實，不建議寫進正文**，除非之後能打開 kailas.com.cn 或旗艦店的商品頁

---

### Roca（西班牙）

- 原廠站 rocaropes.com：網域已停放（GoDaddy parking，轉到 `/lander`），**沒有在賣的 Roca 品牌繩**
- 品牌現況（來源：Fixe 官網歷史頁 https://www.fixeclimbing.com/en/content/36-ropes）：「In 2012…Roca filed bankruptcy proceedings… Tech Rock S.L. (now Fixe Climbing S.L.) decided to buy the brand」；「ropes are still being produced today…under the Fixe brand」；「In 2023…[Fixe] has renewed its entire catalogue of dynamic ropes」
- 舊 Roca 型號名稱有些還留在 Fixe 目錄，例如 Fixe 單繩列表裡有「RAINBOW 9,6MM」，名稱沿用 Roca 舊款 Rainbow；Siurana、Oliana 也是舊 Roca／Fixe-Roca 用過的名字。這些現在都掛 Fixe 品牌，規格以 Fixe 頁為準，見下一節
- 本節**收錄 0 款**。正文如果要提 Roca，建議寫成「Roca 已併入 Fixe」，不要列成獨立品牌

---

### Fixe（西班牙；fixeclimbing.com）

> 原廠 ADR Series 單繩列表（2026-10-23 用 Groundlane render 讀取）：9,6 NARGÓ、9,6 SIURANA、9,4 RODELLAR、9,4 MONTSERRAT、9,2 OLIANA、9,6 MARGALEF、9,8 SADERNES、9,8 FOIXARDA、10,0 ROCCO、RAINBOW 9,6MM、8,8 PEDRAFORCA。
> 原廠頁沒有價格（`"price":"0.00"`），價格改用零售店。

#### Fixe 9,2 Oliana

- 原廠頁：https://www.fixeclimbing.com/en/climbing-ropes/1530-580-92-oliana-8435654700907.html （另一個商品 ID：https://www.fixeclimbing.com/en/inicio/1572-92-oliana-8435654700891.html）
- 繩徑 9.2 mm；重量 58 g/m
- 認證：triple standardisation（single、double、twin）
- 墜落 5／5／12（單繩／半繩／雙子繩）。衝擊力在同一頁有兩組數字：Technical information 寫「7.1/7.1/7.4KN」，規格表寫「7,2 kN single / 7,2kN half / 5,4kN twin」，**原廠頁自相矛盾**。動態延伸 37／37／27%；靜態延伸 8／8／7%；滑移 0 mm
- 外皮比例：40%
- 防水處理：**無**，原文「Nature treatment: It does not have a water-repellent treatment… 100% PFC-free」。注意：英國零售店 Rock+Run 寫「Dry treatment: Water-repellent treatment on the sheath」，跟原廠不一致，以原廠為準
- 長度：50、60、70、80、100、200 m。**70 m 有、80 m 有**
- 中點標記：有（Middle Mark 黑色）；另有 8 Mark（距繩尾 8 m 處紅色標記）、兩端反光標
- 雙色：原廠未列（顏色只有 Blue、Green）
- 價格（非原廠，零售店）：
  - Climbers Zone（西班牙，EUR）80 m €245.00，2026-10-23 標示 Out-of-Stock，https://climberszone.com/ropes/993-oliana-92mm-80m-fixe.html
  - The BackCountry（美國，USD）頁面抓到 $269.95 和 $299.95 兩個價格，搜尋 snippet 顯示「Size: 80m… $299.95」，各規格庫存沒逐一確認，https://www.thebackcountry.com/fixe-92-oliana-climbing-rope.html
  - 換算總重：70 m 約 4.06 kg，80 m 約 4.64 kg
- 2020 年後第三方評測：沒找到。Climbing.com 2019-05-15 評的是 Fixe/Roca 9.0 Monkey，型號不同而且在 2020 年前，不採用
- 適合誰／缺點：58 g/m、外皮 40%、三重認證、有中點也有 8 m 尾端警示，這組規格對兩週石灰岩運攀很平衡。缺點：完全沒有防水處理，遇到雨季或潮濕岩場（例如泰國）容易吸水、沾泥；原廠衝擊力數字也前後不一

#### Fixe 9,4 Rodellar

- 原廠頁：https://www.fixeclimbing.com/en/climbing-ropes/1529-579-94-rodellar-8435654701140.html （另一個商品 ID：https://www.fixeclimbing.com/en/inicio/1601-94-rodellar-8435654701126.html）
- 繩徑 9.4 mm；重量 60 g/m
- 認證：simple（single）
- 墜落 6；衝擊力 7.6 kN；滑移 0 mm；動態延伸 37%；靜態延伸 8%
- 外皮比例：38%
- 防水處理：Dry，**只處理外皮**，原文「Water-repellent treatment on the sheath. Provides resistance to oil, grease, and water」。原廠沒寫 UIAA WR。另有 Fusion 構造（外皮和繩芯結合，防止外皮滑移）
- 長度：60、70、80、100 m。**70 m 有、80 m 有**
- 中點標記：有（黑色 Middle Mark）；另有 8 Mark、反光標
- 雙色：原廠未列
- 價格（非原廠，零售店）：
  - Climbers Zone（EUR）70 m €230.00，2026-10-23 標示 Out-of-Stock，https://climberszone.com/ropes/949-rodellar-94mm-70m.html
  - The BackCountry（USD）頁面價格 $239.95，snippet 顯示 60 m 特價 $215.95，各規格庫存沒逐一確認，https://www.thebackcountry.com/fixe-94-rodellar-climbing-rope-dry-fusion-enduranc.html
  - 換算總重：70 m 約 4.20 kg，80 m 約 4.80 kg
- 2020 年後第三方評測：沒找到
- 適合誰／缺點：外皮 38%、外皮有防水、有中點和 8 m 尾端警示，有 80 m，是 Fixe 運攀款裡最貼近出國運攀需求的一款。缺點：只有單繩認證，多繩距雙股垂降時第二條繩不能當半繩用；防水只處理外皮，原廠沒寫 UIAA WR

#### （備查，未列入彙整表）Fixe 9,6 Siurana

- 原廠頁：https://www.fixeclimbing.com/en/climbing-ropes/1521-571-96-siurana-8435654701386.html
- 單繩；重量在同一頁有兩個數字，Technical 寫 60 g/m、規格表寫 62 g/m，**原廠自相矛盾**；衝擊力 8.8 kN；墜落 6；外皮 36%；Nature treatment（無防水）；長度 60／70／80／100 m；有中點標記和 8 Mark
- 零售價：fixehardware.com 搜尋 snippet 顯示「Fixe 9.6 Siurana 70m- Red · $229.95」，頁面沒打開核實

---

### 彙整表

| 型號 | mm | g/m | 認證 | 外皮% | 防水（原廠寫法） | 70m / 80m | 中點 | 雙色 | 價格（查價 2026-10-23） |
|---|---|---|---|---|---|---|---|---|---|
| Maxim Pinnacle | 9.4 | 57.0 | Single | 原廠未標 | 繩芯 Endura DRY；外皮依顏色分 2x-DRY（UIAA WR）或 STD-DRY | 有（230 ft）／有（265 ft） | 有（單色款） | 有（Yellow Jacket） | 原廠 USD $293–358（230 ft）、$335–408（265 ft）；有貨 |
| Maxim Airliner | 9.0 | 54.0 | Single／Half／Twin | 原廠未標 | 2x-DRY，繩芯＋外皮，UIAA Dry | 有／有 | 原廠未標 | 無 | 原廠 USD $312（230 ft）、$355（265 ft）；**全缺貨** |
| BlueWater Lightning Pro | 9.7 | 64.42 | Single | 37 | Standard 或 Double-Dry（範圍未標） | 有／有 | 無（原廠政策） | 有（DD Bi-Color） | 原廠 USD 70 m $291.95–358.95；80 m $333.95–365.95；有貨 |
| BlueWater Xenon | 9.2 | 59.64 | Single／Half／Twin | 33 | Standard 或 Double-Dry（範圍未標） | 有／有 | 無（原廠政策） | 有（Std 或 DD Bi-Color） | 原廠 USD 70 m $276.95–334.95；80 m $314.95–372.95；大多有貨 |
| Kailas MAGMA | 10.1 | 69 | Single | 原廠未標 | 原廠未標 | 有（原廠列出，國際站沒有商品）／無 | 有 | 原廠未列 | kailasgear.com 50 m $300（有貨）、100 m $125（缺貨），價格疑似有誤 |
| Fixe Oliana | 9.2 | 58 | Single／Half／Twin | 40 | 無（Nature，PFC-free） | 有／有 | 有＋8 m Mark | 原廠未列 | 原廠未標價；Climbers Zone 80 m €245（缺貨）；The BackCountry 80 m $299.95 |
| Fixe Rodellar | 9.4 | 60 | Single | 38 | Dry，只處理外皮（未寫 UIAA） | 有／有 | 有＋8 m Mark | 原廠未列 | 原廠未標價；Climbers Zone 70 m €230（缺貨）；The BackCountry $215.95–239.95 |

注意事項：
- Maxim 美國站以英尺販售：230 ft ≈ 70.1 m，265 ft ≈ 80.8 m。
- Roca 收錄 0 款，品牌已併入 Fixe，rocaropes.com 是停放網域。
- Kailas 的 9.x mm 款（Soarer 9.1）原廠頁讀不到，沒列入彙整表。

---

## 3. 判準的原廠／權威依據


### toolDegradation

- 搜尋：Groundlane MCP `web_search`（`mcp__claude_ai_groundlane__*`，ToolSearch 載入成功），全程可用。Groundlane 內部 provider 偶爾回報 `tavily/exa/brave unavailable`，自動改用 you/brave，不影響結果。
- 讀頁：Groundlane `web_fetch` 用在 Petzl tech tips、Petzl 洗繩頁、Beal Unicore 頁、Petzl 選繩頁。大型 PDF 與 HTML 改用本機 `curl` 下載，再用 `pdftotext` 或 Python 去標籤後 grep 關鍵詞（這一步不在 brief 的抓取鏈裡，是 Groundlane 之外的本機補充，為了不把整份多語 PDF 塞進 context）。沒有用到 Keenable／You.com keyless／Exa／Tavily／linkup／jina／firecrawl／WebFetch。
- 打不開／內容不對的頁：
  - Beal「Unicore – BEAL」`https://www.beal-planet.com/en/unicore-2/`：HTTP 404（curl 與 Groundlane web_fetch 都是 404；Beal 已換成 Shopify 站，舊頁沒有搬過去）。Unicore 說法改引 Beal 產品頁和使用說明書。
  - Petzl「Choosing Your Rope」`https://www.petzl.com/INT/en/Sport/Ropes/How-to-choose`：Groundlane web_fetch 被轉到產品列表頁 `/int/en/sport/products/ropes-cords`，原本的選繩指南內容已經不在。
  - Petzl CA「How do I wash a rope?」`https://www.petzl.com/CA/en/Sport/News/2026-6-3/How-do-I-wash-a-rope-`：curl 拿到 HTTP 404。改讀 NL 版同文（Groundlane web_fetch 成功，見 (d)）。
  - Sterling `https://sterlingrope.com/evolution-velocity-9-8mm-dry-xp/`（我猜的舊網址）：404。改讀現行 `velocity-9-8-mm-xeros/` 頁。
- 備註：有幾份原廠文件沒有標日期或比較舊，各條會註明：Mammut 說明書 PDF（搜尋結果日期 2018）、Edelrid Ropebook（沒標日期，文中稱 Pro Dry 是「new」）、UIAA 通告（2002 年 4 月）、Sterling 部落格（2015–2017）。

---

### (a) 外皮比例與耐磨、外皮處理

- Edelrid｜Rope basics: braiding principles｜https://edelrid.com/us-en/knowledge/knowledge-base/rope-basics-braiding-principles｜要讓繩子更耐磨，原廠舉了兩條路：降低外皮摩擦，或提高外皮比例（"increase the sheath proportion"），兩者各有缺點，所以沒有「最好的繩」，只有最適合情境的繩。
- Edelrid｜Rope basics: braiding principles（同頁）｜同上 URL｜加撚紗（twisted yarn）可以用來提高外皮比例，而且比平行排列的紗耐磨；代價是強度略降、靜態延伸增加。
- Edelrid｜Rope basics: braiding principles（同頁）｜同上 URL｜斜紋編（twill）表面滑順，理論上較耐磨，但外皮滑動（sheath slippage）傾向較大；平紋編握感較好、問題較少。
- Edelrid｜ROPEBOOK（PDF，未標日期）｜https://edelrid.com/040-downloads/Seilfibel_EN_ANSICHT-2.pdf｜單繩越粗通常越強、可承受的墜落次數越多，但也越重；要重度使用（反覆嘗試同一條線、頂繩）可以選「外皮比例較高」的耐用單繩。大岩壁攀登者重視磨損與銳緣，也會挑外皮比例高的繩。
- Edelrid｜ROPEBOOK（同上）｜同上 URL｜Pro Dry 是先浸漬繩芯紗、編好後再整條（芯＋皮）浸漬一次、最後熱定型；原廠說這個處理改善纖維滑動，「makes the rope more abrasion-resistant and extends its lifespan」；UIAA 防水測試吸水 1–2%。
- Edelrid｜ROPEBOOK（同上）｜同上 URL｜Sports Braid（皮紗二壓一）讓外皮特別緊實滑順、特別耐磨，原廠點名適合頂繩與高強度運動攀登這類長期磨耗的用途。
- Edelrid｜SWIFT PROTECT PRO DRY 8.9mm 產品頁｜https://edelrid.com/us-en/sport/ropes/swift-protect-pro-dry-8-9mm｜外皮加入芳綸，配上「higher sheath content」，目的是提高受力時的抗切割性；規格表列 Sheath proportion 36%、Core proportion 64%、53 g/m。
- Edelrid｜EDELRID Technologies｜https://edelrid.com/eu-en/vertical-freedom/edelrid-expertise/edelrid-technologies｜Cut Protect 是把芳綸編進外皮；原廠內部比較 Swift Pro Dry 與 Swift Protect Pro Dry，後者抗切割約接近兩倍。Thermo Shield 是所有繩都有的基本熱處理，用來減少縮短與變硬。
- Beal｜DIABLO 10.2MM UNICORE 產品頁｜https://www.beal-planet.com/en/products/diablo-10-2mm-unicore｜Unicore 把繩芯與外皮綁定，原廠說這「reinforcing your safety as well as its resistance to friction and abrasion」；規格表直接列 Sheath percentage 40%。
- Beal｜DYNAMIC ROPE 使用說明書 EN892+A3:2023（PDF，檔名日期 20250210）｜https://www.beal-planet.com/cdn/shop/files/Dynamiques-20250210_dcce4ad3-fc06-4038-b419-428913a7b103.pdf｜Beal 動力繩的皮紗都有耐久處理，用來提高耐磨與抗濕、延長使用壽命；標籤上的處理代碼 STD／DC（Dry Cover）／GD（Golden Dry），開頭字母 U 代表 Unicore；規格表欄位有「% Sheath」。
- Beal｜GULLY 7.3MM UNICORE - GOLDEN DRY 產品頁（只讀了搜尋摘要，沒有全文抓取）｜https://us.beal-planet.com/products/gully-7-3mm-unicore-golden-dry｜Unicore 讓芯皮成為一體；Golden Dry 是「a treatment against water and abrasion」。
- Mammut｜9.5 Alpine Core Protect Dry Rope 產品頁｜https://www.mammut.com/us/en/products/2010-05450-1287/9-5-alpine-core-protect-dry-rope-60m｜在聚醯胺外皮與繩芯之間多一層芳綸，提高在銳緣上的抗切割；Dry finishing 帶來「Optimized abrasion resistance」；規格列 Sheath proportion 36%、UIAA dry test 2%。
- Petzl｜ARIAL 9.5 mm 產品頁｜https://www.petzl.com/int/en/sport/products/single-ropes/arial-9.5-mm/ARIAL-9-5-mm_SPO_a2m1r000002bkvoAAA.html｜「Thick sheath provides excellent abrasion resistance」；Duratec Dry 處理延長繩子壽命；UltraSonic Finish 在繩尾把芯皮熔合，減少繩尾散開。
- Petzl｜MAMBO 10.1 mm 產品頁｜https://www.petzl.com/US/en/Sport/Ropes/MAMBO-10-1-mm｜「Large diameter provides great durability」＋「Thick sheath provides excellent abrasion resistance」，也就是原廠把粗繩徑和厚外皮當作耐用的理由。
- Petzl｜TECHNICAL NOTICE CORDES DYNAMIQUES R0005800E (251124)｜https://media.petzl.com/sfc/servlet.shepherd/version/download/068Tx00000AQeFjIAL｜濕或結冰的繩較不耐磨（"less abrasion resistant"），在確保／垂降器裡也較難控制。（說明書裡沒有提外皮比例。）
- Sterling｜Velocity 9.8 mm XEROS 產品頁｜https://sterlingrope.com/velocity-9-8-mm-xeros/｜XEROS 讓芯與皮都得到處理，沒有「sticky, vulnerable-to-wear outer coating」，原廠說可以減少外皮滑動造成的問題；UIAA Dry 認證。（頁面沒有列外皮比例 %。）
- Sterling（官網轉載第三方）｜A Review of the Evolution Aero｜https://sterlingrope.com/sterling-solid/a-review-of-the-evolution-aero｜評測說 Aero 外皮佔 41%（以質量計），舊款 Nano 9.2 約 24%，並且說 Aero 明顯更耐磨。注意：這是 Blister Gear Review 2015 年的文章，由 Dave Alie 撰寫、Sterling 官網轉載，不是 Sterling 自己的技術聲明，也早於 2020。
- 結論（不是主張，是查找結果）：這次找到的原廠文件裡，Edelrid 是唯一明確寫出「提高外皮比例能提升耐磨」這條因果的；Beal、Mammut、Edelrid 產品頁都把 Sheath %／proportion 列成規格；Petzl 只說「厚外皮→耐磨」，沒有標 %。

### (b) 中點標記、雙色、麥克筆

- UIAA｜Notification about the marking of ropes by end-users (climbers)（2002 年 4 月）｜https://theuiaa.org/documents/safety/Notification_about_the_marking_of_ropes_by_climbers.pdf｜UIAA 安全委員會與部分繩廠的測試顯示，用氈頭筆類的液體標記繩子可能造成損傷，連專門賣來標繩的筆也包括在內；吸能能力（標準測試的墜落次數）最多下降 50%。所以 UIAA 警告：不要用「沒有被該繩廠特別認可」的任何物質標繩；而且不同品牌的繩，效果似乎也不同。
- Beal｜DYNAMIC ROPE 使用說明書（2025）｜https://www.beal-planet.com/cdn/shop/files/Dynamiques-20250210_dcce4ad3-fc06-4038-b419-428913a7b103.pdf｜保固排除條款寫明：繩子如果被「markers or with stickers that are not authorized by the manufacturer」標記，就不在保固範圍。另外說明書建議垂降時把繩尾打結；把繩子裁成數段時，要在每個新繩端複製原有標示。
- Beal｜ROPE MARKER 產品頁｜https://www.beal-planet.com/en/products/rope-marker｜Beal 自家的中點標記墨水，原廠「strongly advise against using non-specialized markers」，說一般筆可能損傷繩子；頁面也聲稱墨水耐水耐磨、不會讓繩變硬。（頁面沒有列出哪些品牌的繩適用。）
- Mammut｜Ropes（care instructions）｜https://www.mammut.com/be/en/support/product-support/care-instructions/ropes｜裁掉繩尾受損段之後，要重新量長度並重畫中點；Mammut 指定用 Edding 3000，說它「has been tested to last while not compromising your rope」。也提醒：受損處如果在中點附近，裁掉後繩會太短，應該直接退役。
- Mammut｜9.5 Alpine Core Protect Dry Rope 產品頁｜https://www.mammut.com/us/en/products/2010-05450-1287/9-5-alpine-core-protect-dry-rope-60m｜特色列表寫「Abraision-resistant center mark」（原文拼法如此），也就是原廠把中點標記的耐磨程度當成賣點。
- Mammut｜Ropes 分類頁（只讀了搜尋摘要）｜https://www.mammut.com/us/en/category/5867/ropes｜有些繩是雙花紋（bi-patterned）或有中點標記，用來指出繩的中點。
- Petzl｜Change in the length of my rope after use（Tech Tip）｜https://www.petzl.com/us/en/sport/tech-tips/basic-techniques/change-in-the-length-of-my-rope-after-use/CORDES-evolution-de-la-longeur-de-ma-corde_SPO_a77w0000000PCKLAA4.html｜繩會隨使用變粗變短，前幾次就縮 2–3%，整個壽命最多縮 10%，而且兩半可能不對稱（例如一半縮 5%、一半縮 10%），這時「the rope's middle mark is no longer in the correct location」；裁掉繩尾也會讓繩變短。建議定期檢查中點標記：把兩端對齊，雙股一起過手找中點；定期量繩長。濕了沒有張力就晾乾，縮得更多。
- Petzl｜Length of my new rope and the middle of the rope（Tech Tip）｜https://www.petzl.com/us/en/sport/tech-tips/product-information-and-specifications/length-of-my-new-rope-and-the-middle-of-the-rope/CORDES-Longueur-de-ma-corde-neuve-et-milieu-de-cor_SPO_a77w0000000PCKQAA4.html｜新繩裁切長度有約 4% 的變動；Petzl 保證至少達到標稱長度（70 m 新繩約 70–73 m）；中點位置也可能有偏差，兩端之間可能差到 1.2 m。
- Petzl｜Rope too short: warning - danger!（Tech Tip）｜https://www.petzl.com/us/en/sport/tech-tips/basic-techniques/rope-too-short--warning---danger-/CORDES-Corde-trop-courte---attention-danger--_SPO_a77w0000000PCKGAA4.html｜繩長不夠是許多下放、垂降事故的原因；單繩距攀登「ALWAYS tie a knot in the end of the rope」；可以考慮帶比預估需求長 5 m 的繩。
- Petzl｜TECHNICAL NOTICE CORDES DYNAMIQUES (251124)｜https://media.petzl.com/sfc/servlet.shepherd/version/download/068Tx00000AQeFjIAL｜繩端打結在很多情況下是必要的預防措施；把繩裁短後，使用者要自己負責重新量長度、重做標示，建議照 UIAA 流程並多留 3% 的縮短餘量。（說明書沒有提中點標記，也沒有提麥克筆。）
- Petzl｜VOLTA 9.2 mm 產品頁｜https://www.petzl.com/US/en/Sport/Ropes/VOLTA-9-2-mm｜「Middle Mark: indicates the middle of the rope for easier rope management」。
- Petzl｜How do I wash my rope or harness?（Petzl Pulse，2026-04-20 更新）｜https://www.petzl.com/nl/en/professional/we-are-petzl/rescue/how-do-i-wash-my-rope-or-harness-/-NEWS--PRO-Comment-laver-ma-corde-ou-mon-harnais_PRO_a7CbK0000000hGHUAY.html｜洗繩可能讓繩變短，洗完要量長度、必要時重新標示，並確認標示在洗後仍清楚可見。
- Edelrid｜EDELRID Technologies｜https://edelrid.com/eu-en/vertical-freedom/edelrid-expertise/edelrid-technologies｜Duo Tec 用雙色編帶，在繩中點自動翻面換色，「permanent center mark」，原廠說這對垂降、盤繩、估計剩餘繩長特別有用；ColorTec 也是「permanent middle marking」。
- Edelrid｜ROPEBOOK（未標日期）｜https://edelrid.com/040-downloads/Seilfibel_EN_ANSICHT-2.pdf｜裁掉一端繩尾後，「you will need to adjust the middle marking to prevent accidents when abseiling or lowering」。TouchTec 讓繩尾 5 m 的外觀與手感不同，讓確保者看得到也摸得到繩尾接近。另外 Edelrid 建議依路線長度選繩長，例如西班牙長運動路線用 70 m。
- Edelrid｜DYNAMIC ROPE MANUAL（PDF，EN 892:2012+A3:2023）｜https://avs.edelrid.com/images/attribut/54517_GAL_Dynamic_Ropes_ANSICHT_DINA4_Homepage.pdf｜確保與垂降時，繩的自由端必須打止滑結（Fig. 4a–b）；裁段後的標示條要用防水筆填寫，這是指繩端標籤條，不是中點。（說明書沒有談使用者自行用筆畫中點。）
- Sterling｜Frequently Asked Questions about Middle Marks（2017）｜https://sterlingrope.com/sterling-solid/frequently-asked-questions-about-middle-marks｜Sterling 說攀登者常用油漆、染料、Sharpie 之類的 DIY 方法，可能損傷纖維，所以改由原廠用水性染料上中點標記，符合 UIAA 對中點標記的要求；標記的設計是和外皮紗一樣耐色。黑色與橄欖綠繩、半繩／雙子繩、不到 50 m 的繩都不做中點標記；雙色、雙花紋繩也不做，因為換色、換花紋本身就指出中點。
- Sterling｜Bicolor and Bipattern Bumps Explained（2017）｜https://sterlingrope.com/sterling-solid/bicolor-and-bipattern-bumps｜原廠說判斷中點的最好方式是雙色或雙花紋繩；換色處可能有小凸點，那不是瑕疵，強度和有中點標記的繩一樣。
- Sterling｜Velocity 9.8 mm XEROS 產品頁｜https://sterlingrope.com/velocity-9-8-mm-xeros/｜非雙色款在 60 m 以上才有中點標記。
- 沒有找到：沒有原廠文件逐字寫「中點標記會褪色，所以不能當唯一依據」。最接近的是 Petzl 說中點會因不對稱縮短而失準、要定期檢查，以及 Mammut／Edelrid／Petzl 都說裁短或洗後要重做標記。「雙色在裁短繩尾後失準」也沒有找到原廠直接說法；Edelrid 只說裁掉一端後要調整中點標記（沒有區分墨水標記和雙色）。

### (c) 細繩手感與確保器相容

- Petzl｜TECHNICAL NOTICE GRIGRI D0015500K (051124)｜https://media.petzl.com/sfc/servlet.shepherd/version/download/068Tx000009YCjEIAW｜相容 8.5–11 mm 的 EN 892 單繩，8.9–10.5 mm 運作最佳；8.5 到 8.9 mm 的細繩「harder to grip」，下放、垂降或墜落時較難控制，要「greater vigilance and a high level of experience with belay techniques」；有外皮處理、新繩、結冰、濕或泥污的繩可能較滑，降低制動效果；繩徑標稱公差可到 ±0.2 mm。
- Petzl｜GRIGRI 產品頁（只讀了搜尋摘要）｜https://www.petzl.com/us/en/sport/products/belay-devices-with-cam-assisted-blocking/grigri/GRIGRI_SPO_a2mw0000002a0uIAAQ.html｜「Compatible with 8.5 to 11 mm dynamic single ropes and optimized for those 8.9 to 10.5 mm」。
- Petzl｜TECHNICAL NOTICE CORDES DYNAMIQUES (251124)｜https://media.petzl.com/sfc/servlet.shepherd/version/download/068Tx00000AQeFjIAL｜細繩「more difficult for the hand to grip」，下放、垂降、墜落時較難控制；新繩可能較滑，會降低確保／垂降器的效果。
- Edelrid｜OHM II USER MANUAL（PDF）｜https://avs.edelrid.com/images/attribut/54738_GAL_OHM_II_ANSICHT.pdf｜適用繩徑 8.9–11.0 mm；搭配細繩或很重的先鋒者時，「recommended only for skilled and experienced belayers」；用 10 mm 以上的繩時，確保者至少 25 kg；先鋒者低於 40 kg 不可使用。
- Edelrid｜OHM（第一代）User manual（PDF）（只讀了搜尋摘要）｜https://avs.edelrid.com/images/attribut/54575_GAL_OHM_Ansicht.pdf｜繩徑範圍 8.9–11.0 mm；實際繩徑可能和標稱差 ±0.2 mm。
- Edelrid｜DYNAMIC ROPE MANUAL（EN 892:2012+A3:2023）｜https://avs.edelrid.com/images/attribut/54517_GAL_Dynamic_Ropes_ANSICHT_DINA4_Homepage.pdf｜「Thin ropes require special precautions, as it is not easy to hold on to them with the brake hand」；新繩可能較滑，制動與確保器的效果可能降低。
- Beal｜DYNAMIC ROPE 使用說明書（2025）｜https://www.beal-planet.com/cdn/shop/files/Dynamiques-20250210_dcce4ad3-fc06-4038-b419-428913a7b103.pdf｜細繩要選適合的確保器；用機械式器材前，要確認繩徑和器材相容；新繩會讓確保器的制動效果明顯下降。
- Mammut｜DYNAMIC CLIMBING ROPES User Manual（PDF，約 2018）｜https://static.mammut.com/file/User_Manual_HI-MAM-026-7_Bergseile.pdf｜和繩直接接觸的器材要配合繩徑與類型；細繩碰到銳緣，受損或斷裂會比粗繩快得多，所以高性能細繩應該只用在可以排除過緣受力的情況。
- Edelrid｜ROPEBOOK（未標日期）｜https://edelrid.com/040-downloads/Seilfibel_EN_ANSICHT-2.pdf｜單繩越粗通常越強、越耐墜，但越重；書裡的使用者案例：有人另外買一條極細的 80 m 單繩專門用來 redpoint 長運動路線，重度日常使用則用耐用的粗繩。
- 沒有找到：原廠逐字寫「細繩較不耐磨」的句子沒有找到。最接近的原廠說法是 Mammut 的細繩過銳緣更快受損，以及 Petzl Mambo 的「Large diameter provides great durability」（反過來說，就是粗繩比較耐用）。

### (d) 濕熱／海邊環境

- Petzl｜TECHNICAL NOTICE CORDES DYNAMIQUES (251124)｜https://media.petzl.com/sfc/servlet.shepherd/version/download/068Tx00000AQeFjIAL｜退役條件提到，特殊事件可能讓產品只用一次就要退役，例子包括「harsh environments, marine environments, sharp edges, extreme temperatures, chemicals」。濕的繩較不耐磨，也較難控制。
- Petzl｜How do I wash my rope or harness?（2026-04-20 更新）｜https://www.petzl.com/nl/en/professional/we-are-petzl/rescue/how-do-i-wash-my-rope-or-harness-/-NEWS--PRO-Comment-laver-ma-corde-ou-mon-harnais_PRO_a7CbK0000000hGHUAY.html｜用中性皂水手洗，最高 30°C，再「rinse thoroughly with fresh tap water」；只用家用肥皂，不要用溶劑或去漬劑，也不要用高壓水柱；在通風處陰乾，避開 UV 和熱源。（文中沒有特別提海水或鹽分。）
- Beal｜DYNAMIC ROPE 使用說明書（2025）｜https://www.beal-planet.com/cdn/shop/files/Dynamiques-20250210_dcce4ad3-fc06-4038-b419-428913a7b103.pdf｜「Abrasion, UV exposure and humidity gradually degrade the properties of the rope」；繩濕或結冰時對磨損更敏感、強度下降；存放或使用溫度絕不能超過 80°C；存放要避光、避濕、避塵、避熱源，溫度約 20°C ±15°C；清潔用清水（最高 30°），之後用不加清潔劑的清水沖淨，自然陰乾。
- Mammut｜DYNAMIC CLIMBING ROPES User Manual（約 2018）｜https://static.mammut.com/file/User_Manual_HI-MAM-026-7_Bergseile.pdf｜最佳存放條件是陰涼、乾燥、黑暗；運送時放在繩袋或背包，避免直射陽光、化學品、熱和機械損傷；潮濕和凍結會明顯降低強度，下雨等情況建議用 Dry 處理的繩；繩長會因天候（熱、濕）、地形（灰塵、沙）、用途縮短 5–10%，極端情況會更多。
- Mammut｜How to Wash & Clean a Climbing Rope » Full Guide（2025-12-11）｜https://www.mammut.com/us/en/stories-guides/how-to-wash-and-clean-a-climbing-rope-full-guide｜不要放在暖氣上或曬太陽晾乾，原廠說「UV rays and heat trash the fibers」；繩袋可以擋灰塵、UV、濕氣和磨損；要完全乾了才收納。
- Mammut｜Ropes（care instructions）｜https://www.mammut.com/be/en/support/product-support/care-instructions/ropes｜不要把繩長期放在車上，因為車廂溫度變化很大；繩濕的時候，繩袋打開通風，等乾了再收。
- Edelrid｜How to wash and care for a climbing rope｜https://edelrid.com/us-en/knowledge/knowledge-base/looking-after-your-climbing-rope｜存放在乾燥、陰暗、陰涼處，避開直射陽光、化學品和熱；長期放後車廂不好，因為溫差大；手洗用溫水，或洗衣機 30°C 羊毛程序、不脫水；晾乾不要吊掛、不要曬太陽。
- Edelrid｜DYNAMIC ROPE MANUAL（EN 892:2012+A3:2023）｜https://avs.edelrid.com/images/attribut/54517_GAL_Dynamic_Ropes_ANSICHT_DINA4_Homepage.pdf｜乾燥狀態下的長期使用溫度約 -35°C 到 +55°C；合成纖維即使不用也會老化，原因包括 UV 和環境影響；濕氣與結冰會大幅削弱紡織品；濕氣等使用條件會讓繩縮短；在大量灰塵、沙、chalk 和粗糙尖銳岩石上頻繁頂繩或垂降，可能幾週就要換繩。
- Edelrid｜ROPEBOOK（未標日期）｜https://edelrid.com/040-downloads/Seilfibel_EN_ANSICHT-2.pdf｜未處理的繩最多可吸收自重 50% 的水，變重、難操作，安全餘裕下降；Pro Dry 的 UIAA 防水測試吸水 1–2%（UIAA Water Repellent 的門檻是 ≤5%）。
- Sterling｜Four Easy Rope Care Techniques（2015）｜https://sterlingrope.com/sterling-solid/four-easy-rope-care-techniques/｜攀登會讓繩暴露在磨損、疲勞、陽光和持續負載下；曝露在過量 UV 光下就應該立即退役（原文「exposed to excessive UV light ... retire the rope immediately」）。
- Sterling｜How to Wash Your Rope（2021）｜https://sterlingrope.com/sterling-solid/how-to-wash-your-rope｜洗完要沖兩次，把肥皂沖乾淨；晾乾要避開直射陽光，不要用烘乾機。
- 沒有找到：Beal、Petzl、Mammut、Edelrid、Sterling 都沒有原廠文件明講「海邊攀登後要用清水沖掉鹽分」。最接近的是 Petzl 把 marine environments 列進可能提早退役的環境，以及各家通用的清水沖洗、陰乾指引。搜尋結果裡的「Mammut 建議海崖用繩約四次沖一次」出自 UKC 論壇轉述（https://www.ukclimbing.com/forums/gear/ropes_and_salt_water-517750），不是原廠文件，所以不列入依據。
