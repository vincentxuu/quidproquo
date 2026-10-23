# R-rope-B：Beal／Edelrid／Edelweiss／Tendon／Singing Rock 現行動力單繩

查核日期：2026-10-23。範圍：五個品牌各 3–4 款，分三段：輕量細繩 ≤9.2 mm、中間 9.3–9.6 mm、耐用粗繩 ≥9.7 mm。規格一律取原廠頁或原廠 PDF。價格取原廠官網商店；原廠沒有標價時，改用美國代理站，並在該欄寫明。

## toolDegradation

- (1) Groundlane MCP（`mcp__claude_ai_groundlane__web_search` / `web_fetch`）：用 ToolSearch 載入後可以用。搜尋全部走這裡（實際後端是 brave＋you；tavily、exa 回 unavailable）。`web_fetch render=always` 抓 Edelrid 頁面時，回來的大多是導覽列，規格表抓不到，所以 Edelrid 改用 curl。
- 頁面讀取主力是直接 `curl` 原廠頁，再在本機解析：
  - Beal、Edelweiss、Tendon 三家是 Shopify：`/products.json`、`/collections/<c>/products.json`、`/products/<h>.js`，可以拿到變體、價格、庫存。
  - Edelrid 規格內嵌在頁面 HTML，變體 JSON 在 HTML 屬性裡。
  - Singing Rock 是靜態 HTML，另有 2026 年版技術參數 PDF。
  - Tendon 的技術資料表 PDF 用 `pdftotext` 轉文字。
  - Edelweiss 2025 型錄 PDF 的規格是圖片，所以用 `pdftoppm` 轉 PNG 後讀圖。
- 沒有用到第 2–4 層（Groundlane 直接 HTTP、Keenable、You.com）。原因是第 1 層加 curl 已經足夠。
- 第三方評測：Evening Sends 用 curl 回 403，Groundlane `web_fetch` 回 202 空內容，最後改用 Jina reader（`r.jina.ai`）keyless 讀到。讀到後發現發佈日是 2019-06-11，早於 2020，所以不收。Liberty Mountain 部落格（Singing Rock Icon Dry 影評）curl 回 403，沒再往下試；那篇作者是 Singing Rock 品牌大使、發在美國代理商部落格，本來就不算第三方，不收。
- 原廠頁打不開或已下架的：
  - Edelrid `swift-48-pro-dry-8-9mm`（curl 與 Groundlane 都被導到 `/eu-en/404`）。
  - Edelrid `canary-pro-dry-8-8mm`（sitemap 裡還有，但 curl 導到 404）。
  - 細節見文末〈候選清單處理〉。

---

## Beal（法國，Shopify 官網 beal-planet.com，價格 EUR，頁面標 Tax included）

Beal 用語：
- **Dry Cover**：原廠技術頁 https://www.beal-planet.com/en/pages/fabricant 寫「Ce traitement chimique renforce la résistance de nos cordes aux frottements, notamment en conditions humides」，意思是強化耐磨，特別是在潮濕條件下。頁面沒有寫它是 UIAA Water Repellent。
- **Golden Dry**：同一頁寫「excelle au test UIAA Water Repellent」。
- **Unicore**：同一頁寫「rend l'âme et la gaine de la corde solidaires」，也就是把繩芯和外皮結合在一起。
- **Black Limit**、**Safe Control**：產品頁只把它們列為「Marquage milieu／Middle marking」選項，沒有定義。美國代理 Liberty Mountain 零售頁的說明是：Black Limit = 中點標記；SC = Safe Control（bi pattern）。這段說明屬於代理商，不是原廠。

### 1. Beal Opera 8.5mm Unicore – Dry Cover（輕量細繩）

- 原廠頁：https://www.beal-planet.com/en/products/opera-8-5mm-unicore-dry-cover
- 繩徑 8.5 mm，48 g/m。70 m ≈ 3.36 kg，80 m ≈ 3.84 kg（以 g/m 換算，不含包裝）。
- 認證：single / half / twin。標準 EN 892:2012+A3:2023、UIAA 101。
- UIAA 衝擊墜落次數：單繩 5 次（guarantee）／5 次（lab）。衝擊力 7.3 kN（guarantee）／7.1 kN（lab）。半繩 16 次，雙子繩 lab >25 次。
- 外皮比例：38 %（原廠頁「Sheath percentage」）。Unicore：有。
- 防水：本款是 Dry Cover，原廠只說強化耐磨、潮濕時也耐磨，沒有標 UIAA WR。另有 Golden Dry 版（opera-8-5mm-unicore-golden-dry，原廠寫 UIAA Water Repellent）。
- 長度：50 / 60 / 70 / 80 / 100 / 200 m。**70 m 有，80 m 有**。
- 中點標記：50–80 m 是 Black Limit 中點標記。100 m 只有 Safe Control。200 m 盤裝無標記。
- 雙色：80 m 以下沒有雙色選項。Safe Control 只出現在 100 m。
- 官方價格（2026-10-23，EUR，Tax included，Dry Cover）：
  - 60 m €235.13
  - 70 m €274.32
  - 80 m €313.51
  - Blue 與 Green 兩色 50–80 m 全部 In stock。
- 第三方評測：Alpinist，Whitney Clark，2020-08-21，https://alpinist.com/mountain-standards/the-beal-opera-an-8-5mm-rope-that-is-as-strong-and-waterproof-as-it-is-light/
  - 作者認為細繩徑沒有影響耐用度，是「one of the most versatile ropes on the market」。缺點是要搭配適合 8.5 mm 的確保器，也需要熟悉操作。
  - 注意：該文測的是 Golden Dry 版。
- 適合誰／缺點：80 m 不到 3.9 kg，又有三重認證，適合要壓托運或登機重量、也想拿兩條做雙股垂降的人。8.5 mm 對確保器與確保者要求高；在石灰岩上每天上下放，外皮總量比粗繩少。

### 2. Beal Joker 9.1mm Unicore – Dry Cover（輕量細繩）

- 原廠頁：https://www.beal-planet.com/en/products/joker-9-1mm-unicore-dry-cover
- 繩徑 9.1 mm，52 g/m。70 m ≈ 3.64 kg，80 m ≈ 4.16 kg。
- 認證：single / half / twin。原廠頁標準寫 EN 892:2012+A1:2016、UIAA 101。
- 單繩：衝擊墜落 5 次（guarantee）／5 次（lab），衝擊力 7.4／7.2 kN。半繩 15／24 次。雙子繩 lab >25 次。
- 外皮比例：35 %。Unicore：有。
- 防水：Dry Cover（同上，沒有標 UIAA WR）。另有 Golden Dry 版，也有 Joker Soft 版。
- 長度：50 / 60 / 70 / 80 / 100 / 200 m。**70 m 有，80 m 有**。
- 中點標記：50–80 m 是 Black Limit。100 m 只有 Safe Control。
- 雙色：80 m 以下沒有雙色選項。
- 官方價格（2026-10-23，EUR，Tax included，Dry Cover）：
  - 60 m €235.13
  - 70 m €274.32
  - 80 m €313.51
  - 庫存：Blue／Purple 50–80 m In stock。Orange 50／60／70 m 缺貨，80 m 有貨。
- 第三方評測：OutdoorGearLab，Jeff Dobronyi，2024-10-30 更新，https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/beal-joker
  - 評為多繩距首選。
  - 但測完 80 多段後，外皮「a lot of abrasions」，且「we don't recommend this rope for day-in, day-out cragging」。
- 適合誰／缺點：比 Opera 粗一點，一樣有三重認證，適合偶爾會爬多繩距的旅行者。但外皮只占 35 %，原廠只標 Dry Cover；第三方也不建議天天上下放，不適合兩週運攀行程當主繩。

### 3. Beal Zenith 9.5mm（中間）

- 原廠頁：https://www.beal-planet.com/en/products/zenith-9-5mm
- 繩徑 9.5 mm，60 g/m。70 m ≈ 4.20 kg，80 m ≈ 4.80 kg。
- 認證：single。EN 892:2012+A3:2023、UIAA 101。
- 衝擊墜落 5 次（guarantee）／7 次（lab）。衝擊力 7.5／7.3 kN。外皮滑移 1.0 mm。
- 外皮比例：38 %。Unicore：產品名與頁面都沒有寫。
- 防水：產品名與頁面都沒有寫任何處理（屬 Active Line）。
- 長度：50 / 60 / 70 / 80 / 200 m。**70 m 有，80 m 有**。
- 中點標記：原廠未標。頁面沒有中點標記選項，文字也沒提。
- 雙色：沒有選項。
- 官方價格（2026-10-23，EUR，Tax included）：
  - 60 m €166.01
  - 70 m €193.69
  - 80 m €221.34
  - Blue／Pink 50–80 m 全部 In stock。
- 第三方評測：沒找到 2020 年以後的媒體評測。搜到的只有 ExpertVoice、Bergfreunde 用戶評論與論壇，不收。
- 適合誰／缺點：這是 Beal 四款裡同長度最便宜的一款，適合想要 9.5 mm 運攀繩、預算有限的人。缺點是沒有防水處理、沒有 Unicore，原廠也沒標中點。60 g/m 也比 Booster III 9.7（61 g/m）輕不了多少。

### 4. Beal Booster III 9.7mm Unicore – Dry Cover（耐用粗繩）

- 原廠頁：https://www.beal-planet.com/en/products/booster-iii-9-7mm-unicore-dry-cover
- 繩徑 9.7 mm，61 g/m。70 m ≈ 4.27 kg，80 m ≈ 4.88 kg。
- 認證：single。EN 892:2012+A3:2023、UIAA 101。
- 衝擊墜落 6 次（guarantee）／8 次（lab）。衝擊力 7.5／7.3 kN。
- 外皮比例：**42 %**，是本檔 Beal 四款裡最高的。Unicore：有。
- 防水：Dry Cover（沒有標 UIAA WR）。另有 Golden Dry 版。
- 長度：50 / 60 / 70 / 80 / 200 m。**70 m 有，80 m 有**。
- 中點標記：Black Limit。另有 Safe Control 選項（Anise 色，60／70／80 m）。
- 雙色：有，指 Safe Control 選項。原廠頁沒定義，零售說明寫 bi-pattern。
- 官方價格（2026-10-23，EUR，Tax included，Dry Cover）：
  - Anise／Blue＋Black Limit：60 m €210.12、70 m €245.14、80 m €280.16
  - Anise＋Safe Control：60 m €237.64、70 m €272.65、80 m €307.67
  - Metal 色：60 m €189.11、70 m €220.62、80 m €252.14（80 m Metal 缺貨）
  - 其餘 In stock。
- 第三方評測：沒找到 2020 年以後的媒體評測。UKC 2016、ClimbGB 2013 都早於 2020，不收。
- 適合誰／缺點：外皮 42 %，加上 Unicore 和 80 m 雙色選項，是 Beal 這批裡最適合「兩週天天上下放的石灰岩運攀」的一條。缺點是 80 m 接近 4.9 kg，而且 Dry Cover 不是 UIAA WR。

（另查到但未收錄：Beal Karma 9.8mm，https://www.beal-planet.com/en/products/karma-9-8mm。58 g/m、外皮 33 %、5 次、70／80 m 有，80 m €211.63。外皮比例低於 Booster III，所以沒有列為耐用代表。）

---

## Edelrid（德國，官網 edelrid.com/eu-en，價格 EUR incl. VAT）

Edelrid 用語：
- **Eco Dry**：原廠寫「PFC- and PFAS-free Eco Dry finish」，以及「Significantly lower water absorption in the UIAA water-repellency test compared to ropes without ECO treatment」。產品頁沒有寫處理範圍（外皮或繩芯）。
- **Thermo Shield**：熱處理，原廠說全系列都有。
- **Duo Tec**：「patented braiding process … bicolor ropes … change in pattern halfway」，也就是中點換編織花紋的雙色繩。

### 5. Edelrid Swift 48 Eco Dry 8.9 mm（輕量細繩）

- 原廠頁：https://edelrid.com/eu-en/sport/ropes/swift-48-eco-dry-8-9mm
- 繩徑 8.9 mm，54 g/m。70 m ≈ 3.78 kg，80 m ≈ 4.32 kg。
- 認證：single / half / twin。EN 892、UIAA 101。
- 衝擊墜落：單繩 6／半繩 20／雙子繩 22 次。衝擊力：8.7／6.5／10.8 kN。
- 外皮比例：**41 %**（原廠頁另外寫「sheath proportion of 41% is designed to withstand the external stresses」）。外皮是 48 錠編織。
- 防水：Eco Dry（說明同上）。
- 長度：30 / 40 / 50 / 60 / 70 / 80 m，200 m 只有其中一色。**70 m 有，80 m 有**。
- 中點標記：有（技術資訊列「Middle marking」）。
- 雙色：原廠未標（沒有 Duo Tec）。
- 官方價格（2026-10-23，EUR incl. VAT）：
  - 60 m €230
  - 70 m €250
  - 80 m €270
  - 兩色都有庫存（頁面 stockQty：60 m 50/53、70 m 31/41、80 m 19/17）。
- 第三方評測：沒找到 2020 年以後針對 Swift 48 Eco Dry 的媒體評測。UKC 2019 評的是前代 Swift Eco Dry，不收。
- 適合誰／缺點：三重認證的細繩裡，外皮比例 41 % 算高，80 m 約 4.3 kg，適合「想帶一條細繩、又擔心磨損」的旅行者。價格比同長度的 Heron 9.8 貴 €20。

### 6. Edelrid Tommy Caldwell Eco Dry DT 9.6 mm（中間）

- 原廠頁：https://edelrid.com/eu-en/sport/ropes/tommy-caldwell-eco-dry-dt-9-6mm
- 繩徑 9.6 mm，62 g/m。70 m ≈ 4.34 kg，80 m ≈ 4.96 kg。
- 認證：single。EN 892、UIAA 101。
- 衝擊墜落 8 次，衝擊力 9.1 kN。
- 外皮比例：40 %。原廠寫「high sheath proportion makes it suitable for projecting and big-wall climbing」。
- 防水：Eco Dry。技術資訊的「Impregnation」欄列 UIAA。
- 長度：60 / 70 / 80 m。**70 m 有，80 m 有**。
- 中點標記：有。原廠寫「Duo Tec for permanent middle marking」。
- 雙色：**有（Duo Tec）**。
- 官方價格（2026-10-23，EUR incl. VAT）：
  - 60 m €250
  - 70 m €280
  - 80 m €310
  - **70 m 兩色都缺貨**（stockQty 0）。80 m 只有一色有貨。60 m 有貨。
- 第三方評測：Climbing Gear Reviews，2023-09-07，https://climbinggearreviews.com/2023/09/07/edelrid-tommy-caldwell-eco-dry-dt-9-6-review/
  - 用了一年後「no flat spots, no furring of the sheath」。
  - 新繩很滑，用舊 GriGri 要小心，約一個月後趨緩。
- 適合誰／缺點：有雙色中點、外皮 40 %，也有 UIAA WR 標示，適合重視找中點與耐磨的運攀旅行者。缺點是 80 m 接近 5 kg，是本檔中間段最重的；70 m 目前官網缺貨。

### 7. Edelrid Heron Eco Dry 9.8 mm（耐用粗繩）

- 原廠頁：https://edelrid.com/eu-en/sport/ropes/heron-eco-dry-9-8mm
- 繩徑 9.8 mm，63 g/m。70 m ≈ 4.41 kg，80 m ≈ 5.04 kg。
- 認證：single。EN 892、UIAA 101。
- 衝擊墜落 **10 次**，衝擊力 9.3 kN。
- 外皮比例：39 %。
- 防水：Eco Dry。原廠寫「in line with the UIAA standard for water-repellent ropes」。
- 長度：50 / 60 / 70 / 80 m，200 m 只有一色。**70 m 有，80 m 有**。
- 中點標記：原廠未標（技術資訊沒列 Middle marking）。
- 雙色：無。
- 官方價格（2026-10-23，EUR incl. VAT）：
  - 60 m €210
  - 70 m €230
  - 80 m €250
  - 兩色都有庫存。
- 第三方評測：沒找到 2020 年以後的媒體評測。只有 Backcountry 用戶評論，不收。
- 適合誰／缺點：本檔衝擊墜落次數最高（10 次），有防水處理，80 m €250，適合把耐用和預算放前面的人。缺點是 80 m 超過 5 kg，原廠也沒標中點。

### 8. Edelrid Boa 9.8 mm（耐用粗繩，無防水）

- 原廠頁：https://edelrid.com/eu-en/sport/ropes/boa-9-8mm
- 繩徑 9.8 mm，62 g/m。70 m ≈ 4.34 kg，80 m ≈ 4.96 kg。
- 認證：single。EN 892、UIAA 101。
- 衝擊墜落 7 次，衝擊力 8.8 kN。
- 外皮比例：40 %。
- 防水：無。原廠只寫 Thermo Shield，沒有 Eco Dry。
- 長度：40 / 50 / 60 / 70 / 80 / 200 m。**70 m 有，80 m 有**。
- 中點標記：有（Middle marking）。
- 雙色：無。
- 官方價格（2026-10-23，EUR incl. VAT）：
  - 60 m €165
  - 70 m €185
  - 80 m €205
  - 兩色都有庫存。
- 第三方評測：沒找到 2020 年以後針對現行 Boa 9.8 的媒體評測。OutdoorGearLab 2017 評的是 Boa Pro Dry；Gripped 2016、Hike The Planet 2020-01 評的是 Boa Eco（舊款，用回收紗線）。三篇都是不同產品，不收。
- 適合誰／缺點：本檔 Edelrid 最便宜的 80 m（€205），有中點、外皮 40 %，適合乾季運攀、預算有限的人。缺點是沒有任何防水處理。

---

## Edelweiss（法國，Shopify 官網 edelweiss-ropes.com，價格 EUR）

注意：
- 官網橫幅寫「We are currently updating the article database for each collection」，Curve、Energy 的產品頁是空的，沒有規格。
- 規格改取原廠 2025 型錄 PDF：https://cdn.shopify.com/s/files/1/0644/6347/0730/files/Edelweiss_25_SPORT-PRO.pdf 。型錄只有重量、標準、代碼、圖示（HD Cover／Perform3／mid rope／everdry）。
- 墜落次數與衝擊力，取美國代理站 edelweiss-us.com（Liberty Mountain 經營），屬代理資料，不是原廠。
- 原廠站、型錄與美國代理站都沒寫外皮比例。

### 9. Edelweiss Performance 9.2 mm Unicore（Everdry／Supereverdry）（輕量細繩）

- 原廠頁：https://www.edelweiss-ropes.com/products/performance-9-2mm
- 繩徑 9.2 mm，52 g/m（原廠頁與 2025 型錄一致）。70 m ≈ 3.64 kg，80 m ≈ 4.16 kg。
- 認證：single / half / twin（原廠頁「Type Single / Half / Twin」）。
- 衝擊墜落 5／20／>25 次。衝擊力 8.20／6／9.5 kN（原廠頁）。
- 外皮比例：原廠未標。Unicore：有。
- 防水：
  - Everdry 版與 Supereverdry 版。原廠頁寫「The Everdry/Supereverdry treatment makes this rope water and abrasion resistant」。
  - 規格表寫「UIAA Water Repellent 1.1 % (Option supereverdry)」。
  - 處理範圍（外皮或繩芯）原廠沒寫。
- 長度：50 / 60 / 70 / 80 / 90 / 100 / 200 m。**70 m 有，80 m 有**，另有 90 m。
- 中點標記：有（2025 型錄 Performance 兩版都有「mid rope」圖示；美國代理站寫 Mid Rope Indicator）。
- 雙色：無。
- 官方價格：原廠站所有變體都標 €0.00，等於沒有線上售價。改列美國代理站 https://edelweiss-us.com/dynamic-rope/ntn16098-edelweiss-performance-92mm-unicore.html（2026-10-23，USD，Unicore Everdry）：
  - 60 m $294.99
  - 70 m $334.99–339.99
  - 80 m $379.99
  - 90 m $399.99–419.99
  - 部分顏色缺貨。
- 第三方評測：沒找到 2020 年以後的媒體評測。Evening Sends 實際發佈日是 2019-06-11，UKC 評測沒有標年份。兩篇都不收。
- 適合誰／缺點：三重認證，又有 90 m，適合要用長繩下降的石灰岩長路線。缺點是原廠不標外皮比例、官網沒有售價，在歐洲要另找店家。

### 10. Edelweiss Energy 9.5 mm（Perform3／Unicore）（中間）

- 原廠頁（官網商店）：https://www.edelweiss-ropes.com/products/xcorde-energy-9-5mm 。頁面沒有規格，品名「ENERGY 9,5MM」，SKU C3P95。依 2025 型錄，C3P95 是 Perform3 版。
- 繩徑 9.5 mm，58 g/m（2025 型錄，Unicore 版 C3P95U 與 Perform3 版 C3P95 都是 58 g/m）。70 m ≈ 4.06 kg，80 m ≈ 4.64 kg。
- 認證：single（型錄「1」圖示）。
- 衝擊墜落 7 次，衝擊力 8.1 kN。這兩個數字取自美國代理站 https://edelweiss-us.com/dynamic-rope/ntn10971-edelweiss-energy-95mm.html ，原廠頁沒有。
- 外皮比例：原廠未標。型錄寫 Perform3 系列「associate thick sheath and HDCover braiding」，也就是厚外皮加 HD Cover 編織，但沒有數字。
- 防水：
  - 2025 型錄的 Energy 兩版都沒有 everdry 圖示。
  - 美國代理站寫有 Everdry／Supereverdry 選項（UIAA Certified Water Repellent – Supereverdry）。
  - 原廠官網目前販售的 C3P95 沒寫任何防水處理。
- 長度：50 / 60 / 70 / 80 / 200 m（原廠官網）。**70 m 有，80 m 有**。
- 中點標記：有（型錄「mid rope」圖示；美國代理站寫 Mid Rope Indicator）。
- 雙色：原廠 2025 型錄未列。美國代理站另有 Energy ARC 9.5 bi-pattern 獨立商品：https://edelweiss-us.com/dynamic-rope/ntn22813-energy-arc-9-5mm-bi-pattern-dynamic-rope.html
- 官方價格（2026-10-23，EUR，頁面沒標含稅與否，Red 色，C3P95）：
  - 70 m €193.20
  - 80 m €220.80
  - 60 m 標 €241.92，比 70 m 還貴，疑似原廠資料錯誤，照錄。
  - 庫存全部 available。
- 第三方評測：Adventure Rig，2020-06-30，https://www.adventurerig.com/energy95/
  - 測的是 70 m Unicore Supereverdry 版，文中說「broke in well, and quickly」，也肯定中點標記。
  - 文中有聯盟分潤連結。
- 適合誰／缺點：58 g/m 是本檔 9.5 mm 級最輕的，有中點標記，適合想要中間粗細又要壓重量的人。缺點是官網販售版的防水與外皮比例都沒寫清楚，60 m 的價格疑似標錯。

### 11. Edelweiss Curve 9.8 mm Unicore（耐用粗繩）

- 原廠頁（官網商店）：https://www.edelweiss-ropes.com/products/curve-9-8mm 。頁面沒有規格，品名「CURVE 9,8MM UNICORE」，SKU C3P98U。
- 繩徑 9.8 mm，64 g/m（2025 型錄）。70 m ≈ 4.48 kg，80 m ≈ 5.12 kg。
- 認證：single。
- 衝擊墜落 8 次，衝擊力 8.1 kN（美國代理站 https://edelweiss-us.com/ntn16095-edelweiss-curve-98mm.html ）。
- 外皮比例：原廠未標。Perform3 系列「thick sheath」，沒有數字。Unicore：有。
- 防水：2025 型錄 Curve Unicore 沒有 everdry 圖示。美國代理站提到另有 Unicore Supereverdry 版，但原廠官網沒有販售。
- 長度：50 / 60 / 70 / 80 / 200 m。**70 m 有，80 m 有**。
- 中點標記：有（型錄「mid rope」圖示）。
- 雙色：原廠 2025 型錄未列。美國代理站文字提到有 ARC bi-pattern 選項。
- 官方價格（2026-10-23，EUR，Yellow，Unicore）：
  - 60 m €187.20
  - 70 m €218.40
  - 80 m €249.60
  - 全部 available。
  - 另有非 Unicore 的「CURVE 9,8MM」（Turquoise，C3P98，Perform3）：80 m €230.40。
- 第三方評測：沒找到 2020 年以後的媒體評測。Climbing Zine 2016、OutdoorProLink 2017 都早於 2020，不收。
- 適合誰／缺點：Unicore、厚外皮、中點齊全，80 m 不到 €250，適合重耐用與預算的人。缺點是 64 g/m，80 m 超過 5.1 kg；外皮比例與防水，原廠都沒寫。

---

## Tendon（捷克 Lanex，Shopify 官網 mytendon.com／mytendon.cz）

注意：
- 國際站 mytendon.com 會依 IP 換算幣別。US 地區顯示 USD，而且所有變體都顯示 available=False。
- 價格改取捷克站 mytendon.cz（CZK，頁面標「Včetně DPH」＝含增值稅，「Odešleme do 5 pracovních dnů」＝5 個工作天內出貨）。
- 下列各款的商店 SKU 結尾是 `C`，原廠規格欄寫「Finish: Complete Shield」。另有「standard」版獨立商品。
- **Complete Shield**：原廠技術頁 https://mytendon.com/pages/complete-shield 寫「A Teflon treatment applied to both the sheath and the core」。也就是外皮加繩芯都有處理，原廠並寫「meet the requirements of the UIAA 101 standard」。注意：原廠沒有寫「UIAA Water Repellent」。
- 外皮比例取自各款原廠 Technical Data Sheet PDF 的「Sheath mass (%)」。

### 12. Tendon Master 8.6（輕量細繩）

- 原廠頁：https://mytendon.com/products/lano-tendon-master-8-6
- 技術資料表：https://mytendon.com/cdn/shop/files/1749453319Technical-data-sheet-Master-8-6-2.pdf
- 繩徑 8.6 mm，50 g/m。70 m ≈ 3.50 kg，80 m ≈ 4.00 kg。
- 認證：single / half / twin。EN 892、CE 1019。
- 衝擊墜落：單 5／半 13／雙子 30 次。衝擊力：9.9／7.2／11.5 kN。
- 外皮比例：34 %（技術資料表），48 錠編織。
- 防水：Complete Shield（外皮＋繩芯 Teflon 處理）。
- 長度：30 / 40 / 50 / 60 / 70 / 80 / 100 / 200 m。**70 m 有，80 m 有**。
- 中點標記：原廠未標。
- 雙色：無。
- 官方價格（mytendon.cz，2026-10-23，CZK 含 DPH，Complete Shield）：
  - 60 m 5,285 Kč
  - 70 m 6,166 Kč
  - 80 m 7,047 Kč
  - 兩色 available。
- 第三方評測：沒找到 2020 年以後的媒體評測。
- 適合誰／缺點：本檔第二輕（50 g/m，僅次於 Opera 48 g/m），三重認證，處理範圍包含繩芯。缺點是單繩衝擊力 9.9 kN，是本檔單繩最高；外皮 34 % 偏低，原廠也沒標中點。

### 13. Tendon Master 9.4（中間）

- 原廠頁：https://mytendon.com/products/lano-tendon-master-9-4
- 技術資料表：https://mytendon.com/cdn/shop/files/1749795163Technical-Data-Sheet-Tendon-Master-9-4.pdf
- 繩徑 9.4 mm，58 g/m。70 m ≈ 4.06 kg，80 m ≈ 4.64 kg。
- 認證：single。
- 衝擊墜落 6 次，衝擊力 7.9 kN。
- 外皮比例：37.2 %（技術資料表）。外皮是 SBS 編織。
- 防水：Complete Shield。
- 長度：30–80、100、200 m。**70 m 有，80 m 有**。
- 中點標記：原廠未標。
- 雙色：無。
- 官方價格（mytendon.cz，2026-10-23，CZK 含 DPH）：
  - 60 m 5,272 Kč
  - 70 m 6,151 Kč
  - 80 m 7,030 Kč
  - available。
- 第三方評測：Climbing（climbing.com）Field Tested，2021-08-03，https://www.climbing.com/gear/field-tested-tendon-master-9-4/
  - 優點：操作手感好。
  - 缺點寫「Not the most durable」，重度使用約兩個月後外皮起毛、需要剪掉繩尾。
- 適合誰／缺點：重量與手感平衡，適合以紅點運攀為主的人。第三方實測耐磨普通，石灰岩天天上下放要有剪繩尾的心理準備。

### 14. Tendon Master 9.7（耐用粗繩）

- 原廠頁：https://mytendon.com/products/lano-tendon-master-9-7
- 技術資料表：https://mytendon.com/cdn/shop/files/1753422177Technical-data-sheet-Master-9-7.pdf
- 繩徑 9.7 mm，61 g/m。70 m ≈ 4.27 kg，80 m ≈ 4.88 kg。
- 認證：single。
- 衝擊墜落 7 次，衝擊力 7.9 kN。
- 外皮比例：40.9 %（技術資料表）。外皮是 SBS 編織，結構欄另列「secure」。
- 防水：Complete Shield。
- 長度：30–80、100、200 m。**70 m 有，80 m 有**。
- 中點標記：原廠未標。
- 雙色：
  - 原廠〈Kód a barvy lan〉頁（https://mytendon.com/pages/kod-a-barvy-lan ）列有 Master 9.7「D097TV45S000C bicolor」。
  - 但官網商店的選項只有 yellow／green／neon，沒有販售雙色。
- 官方價格（mytendon.cz，2026-10-23，CZK 含 DPH）：
  - 60 m 4,962 Kč
  - 70 m 5,790 Kč
  - 80 m 6,617 Kč
  - available。
- 第三方評測：沒找到 2020 年以後的媒體評測。Weigh My Rack 2015 早於 2020，不收。
- 適合誰／缺點：外皮約 41 %，處理範圍包含繩芯，比 Master 9.4 便宜，適合兩週天天上下放的運攀行程。缺點是官網買不到雙色款，中點也沒標。

### 15. Tendon Ambition 9.8（耐用粗繩）

- 原廠頁：https://mytendon.com/products/lano-tendon-ambition-9-8
- 技術資料表：https://mytendon.com/cdn/shop/files/1750059326Technical-data-sheet-Ambition-9-8.pdf
- 繩徑 9.8 mm。重量 **64 g/m（產品頁）／65 g/m（技術資料表）**，兩處不一致。70 m ≈ 4.48–4.55 kg，80 m ≈ 5.12–5.20 kg。
- 認證：single。
- 衝擊墜落 9 次。衝擊力 **7.4 kN（產品頁）／7.7 kN（技術資料表）**，兩處不一致。
- 外皮比例：39.4 %（技術資料表）。原廠寫「coarser sheath makes the rope slower in the belay device and increases its durability」。
- 防水：Complete Shield。另有 standard 版獨立商品。
- 長度：30–80、100、200 m。**70 m 有，80 m 有**。
- 中點標記：原廠未標。
- 雙色：原廠代碼頁列有「D098TR45S000C bicolour」，但商店選項只有 lilac／yellow／green／vivid yellow。
- 官方價格（mytendon.cz，2026-10-23，CZK 含 DPH）：
  - 60 m 4,731 Kč
  - 70 m 5,519 Kč
  - 80 m 6,308 Kč
  - available。
- 第三方評測：沒找到 2020 年以後的媒體評測。
- 適合誰／缺點：Tendon 這批最便宜，墜落次數 9 次，外皮刻意做粗，適合常掛繩試攀、反覆上下放的人。缺點是 80 m 超過 5.1 kg；原廠頁和技術資料表的重量與衝擊力不一致。

---

## Singing Rock（捷克，官網 singingrock.com，原廠不販售、無價格）

注意：
- 規格取原廠產品頁，另以 2026 年版技術參數 PDF 交叉比對：https://www.singingrock.com/data/downloads/pdf4/Technical_parameters_ROPES_2026.pdf
- 原廠沒有標價，改列美國代理站 singingrock-usa.com（Liberty Mountain 經營）的 USD 價格。
- DRY 版原廠寫法：「UIAA water repellent treatment achieved by revolutionary nanotechnology」。處理範圍（外皮或繩芯）原廠沒寫。
- 原廠各款長度頁都列 30／40／50／60／70／80／100 m 加 200 m 盤裝。

### 16. Singing Rock DNA 8.9 DRY（輕量細繩）

- 原廠頁：https://www.singingrock.com/dna-dry-89
- 長度與代碼頁：https://www.singingrock.com/dna-dry-89-lengths-and-codes
- 繩徑：**產品頁規格欄寫 9.1 mm，品名與 2026 技術參數 PDF 寫 8.9 mm**，兩處不一致。
- 重量：產品頁 55.9 g/m，2026 PDF 56 g/m（美國代理站寫 51 g/m，與原廠不符，不採用）。70 m ≈ 3.91 kg，80 m ≈ 4.47 kg。
- 認證：single / half / twin。EN 892、CE 1019、UIAA。
- 衝擊墜落：單 5／半 15／雙子 30 次。衝擊力：9／7.2／11 kN。
- 外皮比例：34 %。
- 防水：UIAA water repellent treatment。
- 長度：30–80、100、200 m。**70 m 有，80 m 有**。
- 中點標記：有（middle marking）。
- 雙色：無。只有 pink 單色。
- 價格：原廠沒標價。美國代理站 https://singingrock-usa.com/climbing/ntn22829-dna-dry-dynamic-rope-8-9mm.html（2026-10-23，USD）：
  - 60 m $309.99
  - 70 m $359.99
  - 80 m $409.99（缺貨）
- 第三方評測：沒找到 2020 年以後的媒體評測。
- 適合誰／缺點：三重認證，有 UIAA WR 處理和中點，適合需要雙股垂降的旅行者。缺點是原廠自己的繩徑數字不一致（8.9／9.1），外皮 34 % 偏低，美國售價也偏高。

### 17. Singing Rock Icon 9.3 DRY（中間）

- 原廠頁：https://www.singingrock.com/icon-93-dry 。另有無防水版：https://www.singingrock.com/icon-93
- 長度頁：https://www.singingrock.com/icon-93-dry-lengths-and-codes
- 繩徑 9.3 mm，57.6 g/m。70 m ≈ 4.03 kg，80 m ≈ 4.61 kg。
- 認證：single。
- 衝擊墜落 5 次，衝擊力 8.6 kN。
- 外皮比例：34.6 %。外皮採原廠專利 ROUTE 44 編織。
- 防水：UIAA water repellent treatment（DRY 版）。無防水版規格相同。
- 長度：30–80、100、200 m。**70 m 有，80 m 有**。
- 中點標記：有。
- 雙色：無（DRY 版 red，無防水版 yellow）。
- 價格：原廠沒標價。美國代理站 https://singingrock-usa.com/climbing/ntn12678-singing-rock-icon-dry-93mm.html（2026-10-23，USD）：
  - 60 m $264.99
  - 70 m $314.99
  - 80 m 未列。
- 第三方評測：沒找到 2020 年以後的獨立媒體評測。Liberty Mountain 部落格 2022 年的影評，作者是 Singing Rock 品牌大使，發在代理商網站，不算第三方，不收。
- 適合誰／缺點：9.3 mm 不到 58 g/m，有 WR 處理和中點，適合輕量運攀。缺點是外皮 34.6 %、只有 5 次墜落；美國代理站沒有 80 m。

### 18. Singing Rock Kata 9.7 DRY（耐用粗繩）

- 原廠頁：https://www.singingrock.com/kata-dry-97 。另有無防水版：https://www.singingrock.com/kata-97
- 長度頁：https://www.singingrock.com/kata-dry-97-lengths-and-codes
- 繩徑 9.7 mm，61 g/m。原廠頁欄名誤植為「Width」。70 m ≈ 4.27 kg，80 m ≈ 4.88 kg。
- 認證：single。
- 衝擊墜落 5 次，衝擊力 7.7 kN。
- 外皮比例：38.6 %。有原廠專利 InterCore，原廠寫「provides maximum safety even in case of a damaged sheath」。
- 防水：UIAA water repellent treatment。
- 長度：30–80、100、200 m。**70 m 有，80 m 有**。
- 中點標記：有。
- 雙色：無（blue）。
- 價格：原廠沒標價。美國代理站 https://singingrock-usa.com/climbing/ntn22830-kata-dry-dynamic-rope-9-7mm.html（2026-10-23，USD）：
  - 60 m 特價 $189.99（MSRP $299.99）
  - 70 m 特價 $209.99（MSRP $339.99）
  - 80 m 未列。
- 第三方評測：沒找到 2020 年以後的媒體評測。
- 適合誰／缺點：9.7 mm 加 InterCore（外皮受損時的保護）和 WR 處理，適合石灰岩邊角多的岩場。缺點是 9.7 mm 卻只有 5 次墜落，在同級裡偏低；美國代理站沒有 80 m。

### 19. Singing Rock Score 10.1（耐用粗繩）

- 原廠頁：https://www.singingrock.com/score-101 。另有 DRY 版：https://www.singingrock.com/score-dry-10
- 長度頁：https://www.singingrock.com/score-101-lengths-and-codes
- 繩徑 10.1 mm，66 g/m。70 m ≈ 4.62 kg，80 m ≈ 5.28 kg。
- 認證：single。
- 衝擊墜落 8 次，衝擊力 9.5 kN。
- 外皮比例：36.9 %。ROUTE 44 編織。
- 防水：本款無。另有 Score 10.1 DRY 版（原廠列表寫 water repellent）。
- 長度：30–80、100、200 m。**70 m 有，80 m 有**。
- 中點標記：有。
- 雙色：無（green）。
- 價格：原廠沒標價。美國代理站 https://singingrock-usa.com/climbing/ntn09854-singing-rock-score-101mm.html（2026-10-23，USD，非 DRY）：
  - 40 m $159.99
  - 60 m $234.99
  - 70 m $269.99
  - 80 m 未列。
- 第三方評測：沒找到 2020 年以後的媒體評測。
- 適合誰／缺點：原廠定位是攀岩館與運攀通用繩，粗、墜落次數 8 次，適合把耐用放第一的人。缺點是 80 m 超過 5.2 kg，是本檔最重；外皮比例 36.9 % 也不比 9.7 mm 級高。

---

## 候選清單處理（指派的候選 → 實際收錄）

| 指派候選 | 處理 |
|---|---|
| Beal Joker 9.1、Opera 8.5、Booster III 9.7、Zenith 9.5 | 收錄（Dry Cover 版） |
| Beal Karma 9.8 | 原廠仍在賣。因 Beal 只收 4 款，未收錄，規格見 Beal 段末 |
| Edelrid Swift 48 Pro Dry 8.9 | **原廠頁 404**（curl 與 Groundlane browser fetch 都導到 /eu-en/404）。sitemap 已改為 Swift 48 Eco Dry 8.9，改收這款 |
| Edelrid Canary Pro Dry 8.6 | sitemap 只剩 `canary-pro-dry-8-8mm`，curl 也導到 404。int-en 有 canary-eco-dry-8-8mm 的搜尋結果，但沒有驗證。未收錄 |
| Edelrid Boa Eco 9.8 | sitemap 沒有 Boa Eco，只有「BOA 9.8MM」（Thermo Shield，無防水），改收 Boa 9.8 |
| Edelrid Tommy Caldwell Eco Dry DT 9.6 | 收錄 |
| Edelrid Heron Pro Dry 9.8 | 現行是 Heron Eco Dry 9.8，改收 |
| Edelweiss Curve 9.8、Energy | 收錄（原廠頁沒有規格，以 2025 型錄＋美國代理站補） |
| Edelweiss Performance 9.5 | 原廠沒有 9.5 mm 的 Performance；現行是 Performance 9.2，改收 |
| Tendon Master 9.4、9.7、Ambition 9.8 | 收錄 |
| Tendon Smart Lite 9.8 | **官網動態繩系列（products.json）與代碼頁都找不到**，視為非現行款，未收錄 |
| Singing Rock Score 10.1、Icon 9.3 | 收錄（Icon 收 DRY 版） |
| Singing Rock Gaia 8.9 | **官網動態繩列表沒有這款**，改收 DNA 8.9 DRY（同樣是三重認證細繩） |
| 新增 | Tendon Master 8.6（三重認證細繩）、Singing Rock Kata 9.7 DRY |

---

## 彙整表

重量欄是以原廠 g/m 換算的繩身重，不含包裝。價格是 2026-10-23 的查價。

| # | 型號 | 段 | mm | g/m | 70 m kg | 80 m kg | 認證 | 外皮 % | 防水（原廠寫法） | 70/80 m | 中點 | 雙色 | 參考價（80 m，沒有 80 m 就列 70 m） |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Beal Opera 8.5 Unicore DC | 輕 | 8.5 | 48 | 3.36 | 3.84 | 1/½/∞ | 38 | Dry Cover（耐磨，非 WR）；另有 Golden Dry 版 | 有/有 | Black Limit | 無（僅 100 m 有 Safe Control） | €313.51 原廠 |
| 2 | Beal Joker 9.1 Unicore DC | 輕 | 9.1 | 52 | 3.64 | 4.16 | 1/½/∞ | 35 | Dry Cover | 有/有 | Black Limit | 無 | €313.51 原廠 |
| 3 | Beal Zenith 9.5 | 中 | 9.5 | 60 | 4.20 | 4.80 | 1 | 38 | 未標處理 | 有/有 | 原廠未標 | 無 | €221.34 原廠 |
| 4 | Beal Booster III 9.7 Unicore DC | 粗 | 9.7 | 61 | 4.27 | 4.88 | 1 | 42 | Dry Cover；另有 Golden Dry 版 | 有/有 | Black Limit | Safe Control 選項 | €280.16（SC €307.67）原廠 |
| 5 | Edelrid Swift 48 Eco Dry 8.9 | 輕 | 8.9 | 54 | 3.78 | 4.32 | 1/½/∞ | 41 | Eco Dry（PFC/PFAS-free） | 有/有 | 有 | 原廠未標 | €270 原廠 |
| 6 | Edelrid TC Eco Dry DT 9.6 | 中 | 9.6 | 62 | 4.34 | 4.96 | 1 | 40 | Eco Dry（Impregnation 欄列 UIAA） | 有/有（70 m 缺貨） | 有 | Duo Tec | €310 原廠 |
| 7 | Edelrid Heron Eco Dry 9.8 | 粗 | 9.8 | 63 | 4.41 | 5.04 | 1 | 39 | Eco Dry，「in line with UIAA WR standard」 | 有/有 | 原廠未標 | 無 | €250 原廠 |
| 8 | Edelrid Boa 9.8 | 粗 | 9.8 | 62 | 4.34 | 4.96 | 1 | 40 | 無（只有 Thermo Shield） | 有/有 | 有 | 無 | €205 原廠 |
| 9 | Edelweiss Performance 9.2 Unicore | 輕 | 9.2 | 52 | 3.64 | 4.16 | 1/½/∞ | 原廠未標 | Everdry／Supereverdry（SE：UIAA WR 1.1 %） | 有/有（另有 90 m） | 有 | 無 | $379.99 美國代理（原廠 €0.00） |
| 10 | Edelweiss Energy 9.5（Perform3） | 中 | 9.5 | 58 | 4.06 | 4.64 | 1 | 原廠未標 | 官網款未標；美國代理有 Supereverdry 選項 | 有/有 | 有 | 原廠未列（美國代理有 ARC） | €220.80 原廠 |
| 11 | Edelweiss Curve 9.8 Unicore | 粗 | 9.8 | 64 | 4.48 | 5.12 | 1 | 原廠未標 | 官網款未標 | 有/有 | 有 | 原廠未列 | €249.60 原廠 |
| 12 | Tendon Master 8.6 | 輕 | 8.6 | 50 | 3.50 | 4.00 | 1/½/∞ | 34 | Complete Shield（外皮＋繩芯 Teflon） | 有/有 | 原廠未標 | 無 | 7,047 Kč 原廠 |
| 13 | Tendon Master 9.4 | 中 | 9.4 | 58 | 4.06 | 4.64 | 1 | 37.2 | Complete Shield | 有/有 | 原廠未標 | 無 | 7,030 Kč 原廠 |
| 14 | Tendon Master 9.7 | 粗 | 9.7 | 61 | 4.27 | 4.88 | 1 | 40.9 | Complete Shield | 有/有 | 原廠未標 | 代碼頁有，商店未售 | 6,617 Kč 原廠 |
| 15 | Tendon Ambition 9.8 | 粗 | 9.8 | 64（TDS 65） | 4.48 | 5.12 | 1 | 39.4 | Complete Shield | 有/有 | 原廠未標 | 代碼頁有，商店未售 | 6,308 Kč 原廠 |
| 16 | Singing Rock DNA 8.9 DRY | 輕 | 8.9（頁面規格欄 9.1） | 55.9 | 3.91 | 4.47 | 1/½/∞ | 34 | UIAA water repellent | 有/有 | 有 | 無 | $409.99 美國代理（缺貨） |
| 17 | Singing Rock Icon 9.3 DRY | 中 | 9.3 | 57.6 | 4.03 | 4.61 | 1 | 34.6 | UIAA water repellent | 有/有 | 有 | 無 | 70 m $314.99 美國代理 |
| 18 | Singing Rock Kata 9.7 DRY | 粗 | 9.7 | 61 | 4.27 | 4.88 | 1 | 38.6 | UIAA water repellent | 有/有 | 有 | 無 | 70 m $209.99 特價（MSRP $339.99）美國代理 |
| 19 | Singing Rock Score 10.1 | 粗 | 10.1 | 66 | 4.62 | 5.28 | 1 | 36.9 | 無（另有 DRY 版） | 有/有 | 有 | 無 | 70 m $269.99 美國代理 |

### 2020 年後第三方評測一覽（已逐篇開啟核對）

| 型號 | 媒體 | 日期 | URL | 一句結論（照原文） |
|---|---|---|---|---|
| Beal Opera 8.5（測 Golden Dry 版） | Alpinist | 2020-08-21 | https://alpinist.com/mountain-standards/the-beal-opera-an-8-5mm-rope-that-is-as-strong-and-waterproof-as-it-is-light/ | 作者認為細徑不影響耐用，「one of the most versatile ropes on the market」；要配適合 8.5 mm 的確保器 |
| Beal Joker 9.1 | OutdoorGearLab | 2024-10-30 | https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/beal-joker | 多繩距首選；外皮磨損明顯，「don't recommend this rope for day-in, day-out cragging」 |
| Edelrid TC Eco Dry DT 9.6 | Climbing Gear Reviews | 2023-09-07 | https://climbinggearreviews.com/2023/09/07/edelrid-tommy-caldwell-eco-dry-dt-9-6-review/ | 一年後「no furring of the sheath」；新繩很滑，約一個月後趨緩 |
| Tendon Master 9.4 | Climbing | 2021-08-03 | https://www.climbing.com/gear/field-tested-tendon-master-9-4/ | 手感好；「Not the most durable」，重度使用約兩個月就得剪繩尾 |
| Edelweiss Energy 9.5（測 Unicore Supereverdry 版） | Adventure Rig（含聯盟連結） | 2020-06-30 | https://www.adventurerig.com/energy95/ | 「broke in well, and quickly」；肯定中點標記 |

其餘 14 款沒找到 2020 年以後的獨立媒體評測。
