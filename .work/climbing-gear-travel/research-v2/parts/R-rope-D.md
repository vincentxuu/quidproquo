# R-rope-D：評測得獎但前面沒收的 6 款現行繩（Mammut ×3、Sterling ×1、Edelrid ×2）

查規格／查價日期：2026-10-23。規格以原廠頁為準。價格優先用原廠美國站 USD（不含稅與運費）；原廠美國站沒有標價時，改列一家美國零售店並註明店名。依 brief 規定，不寫台灣售價、不換算台幣。這次不另查第三方評測（主 session 指示）。

## toolDegradation

- **(1) Groundlane MCP**（`mcp__claude_ai_groundlane__web_search` / `web_fetch`，用 ToolSearch 載入）：
  - `web_search`：可用，用來找 6 款的原廠網址與零售店。後端實際是 brave、you、browserbase；tavily、exa 回 unavailable，最後一次查詢時 you 回 "budget exhausted"。
  - `web_fetch`：抓 REI（`rei.com/product/167826`）時回 `DEADLINE_EXCEEDED`（connect 階段）。REI 只是備用價格來源，所以沒往下試。
- **Bash `curl` 直接打原廠站，再在本機解析**。這一步不在 brief 的優先鏈裡，但資料都直接來自原廠端點：
  - Mammut US：每個長度是一個獨立商品頁，從 schema.org `Product`／`AggregateOffer` 讀價格與 availability。頁面沒渲染出商品區塊時，改讀頁內嵌的 Next.js 資料（`price`、`stock`、`inStock`、`attributes`、`sellingPoints`）。
  - Sterling：用 BigCommerce `/remote/v1/product-attributes/371`，逐一查每個顏色×長度組合的 SKU、價格、`instock`。
  - Edelrid：規格與變體 JSON 都內嵌在頁面 HTML（`data-product-detail-description-variants-value`）。
  - 零售店（HowNot2、RopesGear）是 Shopify，用 `/products/<handle>.js` 讀價格與 `available`。
- 第 2–6 層（Groundlane 直接 HTTP、Keenable、You.com keyless、Exa／Tavily／linkup／jina／firecrawl、內建 WebFetch）都沒用到，因為第 1 層加 curl 已經夠用。

## 型號名稱與現行狀態（先看這段）

| 主 session 給的名稱 | 原廠現行名稱／狀態 |
|---|---|
| Mammut 9.5 Alpine Core Protect Dry | 名稱相同。US 站 60／70／80 m 商品頁都還在，但 **三個長度全部 OutOfStock**；50 m 商品頁回 404。US 分類頁前 36 筆（共 96 筆）沒有出現這款（有出現的是 8.0 Alpine Core Protect）。 |
| Mammut 9.5 Crag We Care Classic | 名稱相同：**9.5 Crag We Care Classic Rope**。US 站 40–80 m 都有頁，多數有庫存。 |
| Mammut 9.5 Crag Eco Dry | **跟 9.5 Crag Dry 是不同型號編號**：Eco Dry 是 2010-0609x～0612x，Crag Dry 是 2010-0702x～0705x。但兩者在原廠資料裡的規格數字完全相同（見下）。Eco Dry 的 US 商品頁網址還在，但頁面不渲染商品區塊，內嵌資料是 `stock:0`、`inStock:false`，US 分類頁也只列 Crag Dry。**推測**：Eco Dry 已經被 9.5 Crag Dry 取代。原廠頁沒有寫「取代」，這是依上述三點推論的。 |
| Sterling VR9 9.8（DryCore 版） | 名稱：**VR9 9.8 mm**。現行，原廠頁寫 "DryCore Technology"、"Not available in DryXP"。 |
| Edelrid Siskin Eco Dry 8.6 | 名稱：**SISKIN ECO DRY 8,6MM**。現行。 |
| Edelrid Swift Protect Pro Dry 8.9 | 名稱：**SWIFT PROTECT PRO DRY 8,9MM**。US、EU 頁都還在，但 EU 官網只剩 60 m 有價有貨。原廠另有 **SWIFT PROTECT ECO DRY 8,9MM**（新料號 7138…），EU 官網 30–200 m 都有貨。**推測**：Eco Dry 是後繼款；原廠頁沒有寫「取代」。後繼款的規格附在該節末尾。 |

---

## Mammut

### 1. Mammut 9.5 Alpine Core Protect Dry Rope

- URL：
  - 60 m：https://www.mammut.com/us/en/products/2010-05450/9-5-alpine-core-protect-dry-rope-60m
  - 70 m：https://www.mammut.com/us/en/products/2010-05460/9-5-alpine-core-protect-dry-rope-70m
  - 80 m：https://www.mammut.com/us/en/products/2010-05470/9-5-alpine-core-protect-dry-rope-80m
  - 不分長度的母頁 https://www.mammut.com/us/en/products/2010-04600/9-5-alpine-core-protect-dry-rope 打得開，但沒有規格也沒有價格。
- 繩徑 9.5 mm；**59 g/m**
- 結構：原廠寫 "there is an extra aramid sheath between the polyamide outer sheath and core"。材質 "95% Polyamide, 5% Aramide"。
- 認證：**原廠頁自相矛盾**。
  - 副標寫 "dynamic single rope"，特色列表也寫 "Certified as a single rope"。
  - 但同一個列表又寫 "Double certified half and twin rope"。
  - 規格表只有單繩數據（"UIAA falls (single rope 80 kg)"、"Static elongation single rope"）。
  - 符合性聲明 PDF（2010-05450_doc）只寫 EN892:2012 + A3:2023，沒寫繩種。使用手冊是 9.5 與 8.0 Alpine Core Protect 共用一份。
  - 結論：能確認的只有單繩。半繩／雙子繩這一行，**可能是從 8.0 款複製過來的文字**（推測），正文不要寫成三重認證。
- UIAA 墜落次數 5（single rope 80 kg）；衝擊力 8.9（原廠沒寫單位）
- 外皮比例：**36 %**
- 防水：Dry，標 **UIAA Water Repellent**。原廠寫法：
  - "Achieves < 2% in UIAA water absorption tests"（規格表的 UIAA dry test 也是 2.00 %）
  - "Lasting effectiveness in repelling water and dirt according to UIAA"
  - 頁面沒寫處理是只在外皮，還是含繩芯。
- 長度：60／**70**／**80** m（50 m 頁 404）。US 站只有一個配色：Halo-vibrant orange。
- 中點標記：有（"Abraision-resistant center mark"，原廠拼字照抄）。雙色：無（只有單一配色，沒有 Duodess 版）。
- 官方價（USD，Mammut US，2026-10-23）：
  - 60 m $299.95
  - 70 m $349.95
  - 80 m $389.95
  - 三個長度都是 **OutOfStock**
- 總重：70 m 約 4.13 kg；80 m 約 4.72 kg
- 適合誰／缺點：
  - 適合：在意外皮被岩角割傷、多帶一層 aramid 保護的人；有 80 m 和 UIAA WR。
  - 缺點：
    - 外皮比例 36 %，在 9.5 mm 這級偏低。
    - 衝擊力 8.9 偏高。
    - 原廠認證寫法互相矛盾。
    - US 官網全長度缺貨。

### 2. Mammut 9.5 Crag We Care Classic Rope

- URL：
  - 80 m：https://www.mammut.com/us/en/products/2010-06170/9-5-crag-we-care-classic-rope-80m
  - 40 m：2010-06130；50 m：2010-06140；60 m：2010-06150；70 m：2010-06160
  - 不分長度的母頁：https://www.mammut.com/us/en/products/2010-04470/9-5-crag-we-care-classic-rope
- 繩徑 9.5 mm；**58 g/m**（70 m 頁的規格表漏了 Weight 這一列，其他長度都寫 58 g/m）
- 認證：Single（"Certified as a single rope"）
- UIAA 墜落次數 6（single rope 80 kg）；衝擊力 7.7 kN
- 外皮比例：**42 %**
- 外皮材料：原廠寫 "Sheath made of 100% residual yarn"，也就是換色時剩下的紗。配色標示 "Assorted"，每條繩顏色不同。
- 防水：**沒有 dry 處理**。
  - 原廠標 "Classic"，特色列表寫 "PFC-free"。
  - 規格表 "UIAA dry test 46.00 %"。這是原廠數字，正文引用時照抄。
- 長度：40／50／60／**70**／**80** m
- 中點標記：有（"Abraision-resistant center mark"）。雙色：原廠未標（沒有 Duodess 版；外皮是隨機的剩紗配色）。
- 官方價（USD，Mammut US，2026-10-23，配色 Assorted）：
  - 40 m $134.95（InStock）
  - 50 m $164.95（**OutOfStock**）
  - 60 m $184.95（InStock）
  - 70 m $219.95（InStock）
  - 80 m $249.95（InStock）
- 總重：70 m 約 4.06 kg；80 m 約 4.64 kg
- 適合誰／缺點：
  - 適合：預算優先、要 70／80 m、看重外皮比例（42 %）的單繩使用者。80 m 價格是本檔 Mammut 三款最低。
  - 缺點：
    - 沒有 dry 處理（UIAA dry test 46 %）。在潮濕、海邊或下雨的岩場會吸水變重。
    - 顏色隨機，沒辦法挑跟同伴的繩做區隔。

### 3. Mammut 9.5 Crag Eco Dry Rope（與 9.5 Crag Dry 的關係）

- URL：
  - 50 m：https://www.mammut.com/us/en/products/2010-06090/9-5-crag-eco-dry-rope-50m
  - 60 m：2010-06100；70 m：2010-06110；80 m：2010-06120
  - 這些頁打得開（HTTP 200），但畫面不渲染商品區塊。下面的數字都取自頁內嵌的商品資料。
- **跟 9.5 Crag Dry 比**：
  - 型號編號不同（Crag Dry 是 2010-07020～07050）。
  - 原廠資料的規格完全相同：9.5 mm、60 g/m、衝擊力 8.0 kN、UIAA dry test 1.50 %、UIAA falls 8、外皮比例 40 %、static elongation 6 %、first-fall stretch 30 %。
  - 兩者的 selling points 寫法不同：
    - Eco Dry 寫 "Abrasion-resistant PFC-free Eco Dry treatment"，還有 "Abraision-resistant center mark"。
    - Crag Dry（2010-07040）寫 "PFC-free DWR treatment"、"Certified as a single rope"，**沒有**提中點標記。
  - 判定：**是不同型號，但規格數字相同**。Eco Dry 在 US 站已不可購（推測已被 Crag Dry 取代）。9.5 Crag Dry 已收在 R-rope-A，這裡不重複。
- 認證：Single（規格欄位是 "UIAA falls (single rope 80 kg)"）
- 外皮比例：**40 %**
- 防水：PFC-free Eco Dry。原廠寫法 "Achieves < 1.5% in UIAA water absorption tests"、"Lasting effectiveness in repelling water and dirt according to UIAA"。頁面沒寫處理範圍（外皮或繩芯）。
- 長度：50／60／**70**／**80** m
- 中點標記：有（原廠 selling points）。雙色：原廠未標。
- 官方價（USD，Mammut US 內嵌資料，2026-10-23）：
  - 50 m $209.95
  - 60 m $259.95
  - 70 m $299.95
  - 80 m $329.95
  - 全部 `stock:0`／`inStock:false`，頁面也沒有可購買的商品區塊
- 總重：70 m 約 4.20 kg；80 m 約 4.80 kg
- 適合誰／缺點：
  - 規格和 9.5 Crag Dry 一樣（80 m、40 % 外皮、UIAA dry test 1.5 %）。
  - 但 US 官網已經買不到，正文建議直接寫 9.5 Crag Dry。評測提到「Crag Eco Dry」時，可以註明是同規格的前一個型號編號。

---

## Sterling

### 4. Sterling VR9 9.8 mm

- URL：https://sterlingrope.com/vr9-9-8-mm/
- 繩徑 9.8 mm；**62 g/m**
- 認證：Single（"Full UIAA and CE Certified Single Rope"；EN 892）
- UIAA 墜落次數 6；衝擊力 8.6 kN；dynamic elongation 28.8 %；static 8.8 %
- 外皮比例：**35 %**
- 防水：原廠寫 "DryCore Technology" 和 "Not available in DryXP"。
  - Sterling 自家文章（2017-11-16，https://sterlingrope.com/sterling-solid/what-goes-into-the-dryxp-uiaa-water-repellent-treatment ）說明：DryCore 是處理繩芯，"alone won't pass the harsh UIAA 'Dry' test, because the sheath has to be treated as well"。
  - 也就是說，這款**只有繩芯處理，外皮沒處理，也沒有 UIAA Water Repellent**。
- 長度：40／50／60／**70** m。**沒有 80 m**。（頁面文字寫 "Available Lengths: 60 m, 70 m"，但下拉選單和變體 API 有 40／50／60／70 m。）
- 中點標記：有（"Includes Middle Mark"）；40 m 沒有（"*40M length does NOT come with a middle mark"）。
- 雙色：無。只有 GREEN、ORANGE 兩個單色。
- 官方價（USD，SterlingRope.com BigCommerce 變體 API，2026-10-23）：

  | 長度 | GREEN | ORANGE | 庫存 |
  |---|---|---|---|
  | 40 m | $129.99 | $129.99 | 兩色 instock |
  | 50 m | $169.99 | $169.99 | 兩色 instock |
  | 60 m | $189.99 | $189.99 | 兩色 instock |
  | 70 m | $219.99 | $219.99 | 兩色 instock |

- 總重：70 m 約 4.34 kg
- 適合誰／缺點：
  - 適合：預算有限、只需要 60／70 m 的運攀者。70 m $219.99，是本檔官網價最低的 70 m。
  - 缺點：
    - 沒有 80 m。
    - 62 g/m，本檔最重。
    - 外皮沒有防水處理。
    - 外皮比例 35 % 不算高。

---

## Edelrid

Edelrid US 站（edelrid.com/us-en）**沒有線上商店**：頁面沒有加入購物車，也沒有標價。頁內嵌的變體資料仍是 EUR 欄位，庫存一律是佔位值 1。EU 站（eu-en）有商店，標 EUR incl. VAT。所以 USD 價格改用美國零售店：RopesGear.com（Shopify，currency USD、country US），Siskin 另附 HowNot2。

### 5. Edelrid Siskin Eco Dry 8.6 mm

- URL：https://edelrid.com/us-en/sport/ropes/siskin-eco-dry-8-6mm （EU：https://edelrid.com/eu-en/sport/ropes/siskin-eco-dry-8-6mm ）
- 繩徑 8.6 mm；**48 g/m**。原廠寫 "Lightest single rope on the market"。
- 認證：single／half（原廠標 "Double rope"）／twin。EN 892、UIAA 101。原廠寫 "Triple certification for additional use as a half and twin rope"。
- UIAA 墜落次數 5／18／≥25；衝擊力 8.5／6.6／10.7 kN
- 外皮比例：**38 %**（core 62 %）
- 防水：Eco Dry。原廠寫法：
  - "Durably water repellent and dirt resistant thanks to the PFC- and PFAS-free Eco Dry finish"
  - "Significantly lower water absorption in the UIAA water-repellency test compared to ropes without ECO treatment"
  - 沒寫處理範圍，也沒標 UIAA Water Repellent 數值。
- 長度：
  - US 頁只列 60／**70** m
  - EU 頁列 50／60／**70**／**80**／100 m（icemint、neon green 兩色）
- 中點標記：有（"Middle marking"）。雙色：原廠未標（沒提到 Duo Tec）。
- 價格（2026-10-23）：
  - 原廠 US：沒有標價
  - **RopesGear（美國零售）**：60 m $329.95、70 m $359.95（available）
  - **HowNot2（美國零售）**：60 m $329.95、70 m $359.95（available）
  - 參考用，原廠 EU（EUR incl. VAT）：60 m €250、70 m €270、80 m €290、100 m €360，兩色都有庫存（80 m 庫存 53／22）
- 總重：70 m 約 3.36 kg；80 m 約 3.84 kg
- 適合誰／缺點：
  - 適合：重量第一的人。本檔最輕，80 m 不到 3.9 kg，又是三重認證，雙股垂降不用另帶第二條。
  - 缺點：
    - 8.6 mm 最細，石灰岩天天上下放的耐磨裕度最少。
    - 細繩跟確保器的相容性要先確認。
    - 美國零售只看到 60／70 m；要買 80 m 得找 EU 通路。

### 6. Edelrid Swift Protect Pro Dry 8.9 mm

- URL：https://edelrid.com/us-en/sport/ropes/swift-protect-pro-dry-8-9mm （EU：https://edelrid.com/eu-en/sport/ropes/swift-protect-pro-dry-8-9mm ）
- 繩徑 8.9 mm；**53 g/m**
- 結構：外皮含 aramid（"Material: Polyamide/Aramid"）；原廠標 "Sharp edge approved"、"Cut value: 30"
- 認證：single／half／twin（"Certified as a single, half, and twin rope"）。EN 892、UIAA 101。
- UIAA 墜落次數 6／18／30；衝擊力 9.9／7.3／11.8 kN
- 外皮比例：**36 %**（core 64 %）
- 防水：Pro Dry。原廠寫法 "Durably water repellent and dirt resistant thanks to the Pro Dry finish"，以及 "Significantly lower water absorption in the UIAA water-repellency test compared to ropes without ECO treatment"。沒寫處理範圍。
- 長度：
  - US 頁：night-green 60／**70**／**80** m；night-fire 60／70 m
  - EU 頁列 30–200 m，但只有 60 m 有價有貨（€270，庫存 4／16），其他長度沒有價格、庫存 0
- 中點標記：有（"Middle marking"）。雙色：原廠未標。
- 價格（2026-10-23）：
  - 原廠 US：沒有標價
  - **RopesGear（美國零售）**：
    - night-green：60 m $329.95、70 m $359.95、80 m $389.95
    - night-fire：60 m $329.95、70 m $359.95
    - 全部 available
- 總重：70 m 約 3.71 kg；80 m 約 4.24 kg
- 適合誰／缺點：
  - 適合：要三重認證細繩、又擔心銳利岩角割繩的人。外皮含 aramid，有 80 m 版。
  - 缺點：
    - 衝擊力 9.9 kN，本檔最高。
    - 外皮比例 36 %。
    - 原廠 EU 站多數長度已無貨，可能正被 Swift Protect Eco Dry 取代（推測）。
- **後繼款：SWIFT PROTECT ECO DRY 8,9MM**（https://edelrid.com/us-en/sport/ropes/swift-protect-eco-dry-8-9mm ）
  - 53 g/m；外皮比例 **37 %**；衝擊力 9／7／11.5 kN；墜落次數原廠頁沒列；Polyamid/Aramid；"Sharp edge approved"
  - 特色列表寫 "Certified as a single, half, and twin rope"，但技術資訊只列 "Single Rope"、"Double rope"，沒有 "Twin Rope"（照抄，不判斷）
  - 防水：PFC- and PFAS-free Eco Dry；中點標記：有
  - 長度：US 頁 60／70／80 m；EU 30–200 m
  - EU 價（EUR incl. VAT）：60 m €270、70 m €290、80 m €310，兩色都有庫存
  - 沒查美國零售價

---

## 彙整表

總重 = g/m × 長度，原廠沒標，是自己換算的。價格是 2026-10-23 的 USD 標價；「零售」表示原廠美國站沒標價，改用零售店。

| 型號 | 繩徑 mm | g/m | 認證 | 外皮 % | 防水（原廠寫法） | 長度（70／80） | 中點／雙色 | 70 m 價 | 80 m 價 | 庫存 | 70 m kg | 80 m kg |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mammut 9.5 Alpine Core Protect Dry | 9.5 | 59 | Single（頁面另寫 half/twin，自相矛盾） | 36 | Dry、UIAA Water Repellent、<2 % | 60／70／80（70 有、80 有） | 有／無 | $349.95 | $389.95 | US 官網全長度 OutOfStock | 4.13 | 4.72 |
| Mammut 9.5 Crag We Care Classic | 9.5 | 58 | Single | 42 | 無（Classic；UIAA dry test 46 %） | 40／50／60／70／80（70 有、80 有） | 有／原廠未標（隨機剩紗配色） | $219.95 | $249.95 | 70、80 InStock；50 OOS | 4.06 | 4.64 |
| Mammut 9.5 Crag Eco Dry | 9.5 | 60 | Single | 40 | PFC-free Eco Dry、<1.5 %、UIAA | 50／60／70／80（70 有、80 有） | 有／原廠未標 | $299.95 | $329.95 | US 官網 stock 0，不可購（規格同 9.5 Crag Dry） | 4.20 | 4.80 |
| Sterling VR9 9.8 mm | 9.8 | 62 | Single | 35 | DryCore（只處理繩芯；非 DryXP、非 UIAA Dry） | 40／50／60／70（70 有、**80 無**） | 有（40 m 除外）／無 | $219.99 | — | 全組合 instock | 4.34 | — |
| Edelrid Siskin Eco Dry 8.6 | 8.6 | 48 | Single／Half／Twin | 38 | PFC/PFAS-free Eco Dry | US 60／70；EU 50–100（70 有、80 EU 有） | 有／原廠未標 | $359.95（零售：RopesGear、HowNot2） | 美國零售無；EU €290 | 零售 available；EU 有貨 | 3.36 | 3.84 |
| Edelrid Swift Protect Pro Dry 8.9 | 8.9 | 53 | Single／Half／Twin | 36 | Pro Dry | US 60／70／80（70 有、80 有） | 有／原廠未標 | $359.95（零售：RopesGear） | $389.95（零售：RopesGear） | 零售 available；EU 官網只剩 60 m | 3.71 | 4.24 |

### 讀不到／資料缺口

- **Mammut 9.5 Crag Eco Dry**：US 商品頁打得開，但不渲染商品區塊。數字是從頁內嵌資料讀的，不是畫面上看得到的文字。
- **Mammut 9.5 Alpine Core Protect Dry**：50 m 頁 404。認證寫法自相矛盾，PDF（符合性聲明、手冊）也沒有解開。
- **Mammut US 分類頁**：nbHits 96，但 HTML 只帶前 36 筆；`?page=` 與 `?p=` 參數都無效。所以「不在分類頁」只能代表「不在前 36 筆」。
- **Edelrid**：US 站沒有官方價，改用美國零售價。Siskin 80 m、Swift Protect Pro Dry night-fire 80 m 在美國零售沒看到。
- **REI**（Swift Protect Pro Dry 70 m 備用價格來源）：Groundlane `web_fetch` 回 DEADLINE_EXCEEDED；已有 RopesGear 價格，所以沒往下試。
