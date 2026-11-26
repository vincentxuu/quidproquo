# R-rope-A：Petzl／Black Diamond／Mammut／Sterling 現行動力單繩

查價／查規格日期：2026-10-23。價格一律為原廠美國官網的 USD 標價（Petzl US、BD US、Mammut US、SterlingRope.com），不含稅與運費。依 brief 規定，不寫台灣售價，也不換算台幣。

## toolDegradation

- **Groundlane MCP**（`mcp__claude_ai_groundlane__web_fetch` / `web_search` / `web_extract`）：可用，是主力工具。Petzl 四個產品頁、Mammut 分類頁、所有評測搜尋都走這裡。搜尋時 `brave`、`tavily`、`exa` 子 provider 偶爾回 unavailable，fusion 改由 `you` 單獨回傳，結果仍可用。
- **Bash `curl` 直接打原廠站**：用來拿 Groundlane 單頁抓不到的變體資料：
  - Petzl SFCC 的 `Product-Variation` JSON（70／80 m 價格、庫存）
  - BD Shopify 的 `/products/<handle>.json` 與 `.js`（價格、`available`）
  - Mammut 各長度產品頁的 schema.org availability
  - Sterling BigCommerce 的 `/remote/v1/product-attributes/<id>`（各顏色、長度的價格與 instock）
  - 這一步不在 brief 的優先鏈裡；資料都直接取自原廠端點。
- **評測頁**：
  - `eveningsends.com`、`feedthehabit.com`、`climbsmith.com`：curl 回 403，Groundlane（http 與 render=always）被 SiteGround captcha 擋下（轉址到 `/.well-known/sgcaptcha/`）。降級到 **Exa `web_fetch_exa`** 才讀到全文。
  - `gearjunkie.com`：curl 回 403，Groundlane 的 browser fallback（challenge_response）讀得到。
- Keenable、You.com keyless、Tavily、linkup、jina、firecrawl、內建 WebFetch：都沒用到，因為上一層已經成功。

## 候選清單的替換說明（原廠現行目錄不符）

- **BD 9.0 Dry**：BD 官網 ropes collection 沒有這款。現行輕量款是 **8.8 Dry**（另有 7.4 Dry 半繩），所以改收 8.8 Dry。
- **Mammut**：
  - 「Alpine Sender 9.0」「Crag Sender 9.5」「9.5 Gym?」在 US 站都不存在。
  - 現行輕量款是 **9.0 Crag Sender Dry** 與 **8.7 Alpine Sender Dry**；中段是 **9.5 Crag Dry**（另有 9.5 Crag Classic 非 dry 版）。
  - 9.5 Gym Classic 是 40 m 室內繩，不收。
- **Sterling**：
  - 「Fusion Nano IX」「Evolution Helix」的舊網址（`/store/climb/ropes/dynamic/...`）會 302 到 climbing-ropes 分類頁；猜測的新網址回 404；現行分類頁也沒有這兩款。所以判定已不在現行目錄。
  - 現行對應款是 **Nano 8.9 XEROS**、**Aero 9.2 XEROS**、**IonR 9.4 XEROS**、**Velocity 9.8 XEROS**（另有 Quest 9.6、VR9 9.8、T10 10.0 等）。

---

## Petzl

### Petzl VOLTA 9.2 mm（輕量）
- URL：https://www.petzl.com/us/en/sport/products/single-ropes/volta-9.2-mm/VOLTA-9-2-mm_SPO_a2m20000000HeFHAA0.html
- 繩徑 9.2 mm；**55 g/m**
- 認證：Multi-type：single／half／twin（CE EN 892、UIAA、GB/T 23268）
- UIAA 墜落次數：6（single）、>20（half）、>30（twin）。衝擊力：8.6 kN（single）／6.8（half）／10.5（twin）
- 外皮比例：**42 %**
- 防水：Duratec Dry。原廠寫法是 "water repellent treatment makes the rope more resistant to water, dirt, and abrasion"。頁面沒寫是只處理外皮還是含繩芯，也沒寫 UIAA Water Repellent；另註明 free from intentionally added PFAS。
- 長度：30／50／60／**70**／**80**／100 m（橘）；50／60／70／80 m（灰）
- 中點標記：有（Middle Mark）。雙色：無（原廠只列單色款）
- 官方價（USD，2026-10-23）：
  - 30 m $169.95
  - 70 m $334.95（橘、灰皆 In Stock）
  - 80 m $359.95（灰 In Stock；橘 "This item is currently not available"）
- 70 m 約 3.85 kg；80 m 約 4.40 kg（55 g/m 換算）
- 第三方評測：Climbing Gear Reviews，2025-10-30，https://climbinggearreviews.com/2025/10/30/petzl-volta-9-2-rope-review/ 。結論原文："my go to single rope for multipitch and alpine rock climbing… despite the initial surface wear, it's proving to be durable."
- 適合誰／缺點：
  - 適合：想帶一條就能單繩運攀，又能和夥伴的繩組成雙股垂降的人；三重認證，55 g/m 在 80 m 版也低於 4.5 kg。
  - 缺點：細徑在石灰岩每天上下放的條件下，耐磨裕度比 9.5 mm 以上的繩少（外皮 42 % 已經偏高，但繩徑本身小）。

### Petzl ARIAL 9.5 mm（中間）
- URL：https://www.petzl.com/us/en/sport/products/single-ropes/arial-9.5-mm/ARIAL-9-5-mm_SPO_a2m1r000002bkvoAAA.html
- 繩徑 9.5 mm；**58 g/m**
- 認證：Single（CE EN 892、UIAA、GB/T 23268）
- UIAA 墜落次數 7；衝擊力 8.8 kN
- 外皮比例：**40 %**
- 防水：Duratec Dry（寫法同 VOLTA，範圍未標）
- 長度：60／**70**／**80** m（紅、藍）
- 中點標記：有。雙色：無
- 官方價（USD）：60 m $279.95；70 m $314.95；80 m $349.95（紅 70／80 m 皆 In Stock）
- 70 m 約 4.06 kg；80 m 約 4.64 kg
- 第三方評測：
  - GearJunkie，2026-07-31，https://gearjunkie.com/climbing/petzl-arial-9-5mm-review 。"The Petzl Arial 9.5 strikes a great balance between performance and durability."
  - Rock+Run，2020-11-27，https://rockrun.com/blogs/the-flash-rock-run-blog/petzl-arial-9-5mm-climbing-rope-review 。作者對它當主力繩的壽命有保留："I'd be more inclined to save mine for tricky redpoints."
- 適合誰／缺點：
  - 適合：要 80 m、帶 Duratec Dry，又想比 9.2 mm 多一點耐磨裕度的人。
  - 缺點：單繩認證，不能當雙股垂降的半繩用；比 VOLTA 每公尺重 3 g。

### Petzl CONTACT 9.8 mm（耐用粗繩）
- URL：https://www.petzl.com/us/en/sport/products/single-ropes/contact-9.8-mm/CONTACT-9-8-mm_SPO_a2m1r000002bwrFAAQ.html
- 繩徑 9.8 mm；**60 g/m**
- 認證：Single（CE EN 892、UIAA）
- UIAA 墜落次數 7；衝擊力 8.4 kN
- 外皮比例：**41 %**
- 防水：原廠頁未列任何防水處理（只列 EverFlex 熱處理與 UltraSonic Finish），等同非 dry 款
- 長度：60／**70**／**80** m（藍、綠）
- 中點標記：有。雙色：無
- 官方價（USD）：60 m $269.95；70 m $299.95；80 m $334.95（藍 70／80 皆 In Stock）
- 70 m 約 4.20 kg；80 m 約 4.80 kg
- 第三方評測：沒找到 2020 年以後的可信媒體評測。找到的只有 Blister 2015、Backpacker 2015、Test4Outside 2017（皆早於 2020，不收），以及零售／彙整頁。
- 適合誰／缺點：
  - 適合：有 80 m、價格比 ARIAL 低的耐用款。
  - 缺點：沒有防水處理，雨季或潮濕的岩場（例如泰國雨季）弄濕後不會有原廠宣稱的防水效果。

### Petzl MAMBO 10.1 mm（耐用粗繩）
- URL：https://www.petzl.com/us/en/sport/products/single-ropes/mambo-10.1-mm/MAMBO-10-1-mm_SPO_a2m1r000002bySvAAI.html
- 繩徑 10.1 mm；**65 g/m**
- 認證：Single（CE EN 892、UIAA、GB/T 23268）
- UIAA 墜落次數 7；衝擊力 8.5 kN
- 外皮比例：**37 %**
- 防水：原廠頁未列（非 dry）
- 長度：50／60／**70** m。**沒有 80 m**
- 中點標記：有。雙色：無
- 官方價（USD）：50 m $229.95；70 m $279.95（Turquoise 70 m In Stock）
- 70 m 約 4.55 kg
- 第三方評測：沒找到 2020 年以後的可信媒體評測（只有 Amazon、零售店與彙整站）
- 適合誰／缺點：
  - 適合：主要在健身房或短路線、重視握感的人。
  - 缺點：旅行用不利，沒有 80 m，是四款中最重的（65 g/m），外皮比例也最低（37 %）。

---

## Black Diamond

（BD 規格欄位沒有 UIAA 墜落次數，以下一律寫「原廠未標」。「庫存」取自 Shopify `.js` 的 `available` 欄位。）

### BD 8.8 Dry Rope（輕量）
- URL：https://www.blackdiamondequipment.com/products/8-8-dry-rope
- 繩徑 8.8 mm；**54 g/m**。原廠列總重：50 m 2.7 kg、70 m 3.75 kg、80 m 4.32 kg
- 認證：Single, Half, Twin（EN892、UIAA101）
- UIAA 墜落次數：原廠未標。衝擊力 7.2 kN、7.2 kN、7.4 kN（順序原廠未標，對應 Single／Half／Twin 的推測未經原廠確認）
- 外皮比例（Sheath Mass）：**30 %**
- 防水：原廠寫 "dry treated core and sheath"（外皮與繩芯都有處理）。頁面沒提 UIAA Water Repellent 認證
- 長度：50／**70**／**80** m（沒有 60 m）
- 中點標記：有（Half Mark: Yes）。雙色：無
- 官方價（USD）：50 m $289.95；70 m $309.95；80 m $339.95（三個長度 `available`=true）
- 第三方評測：沒找到 2020 年以後針對 8.8 的媒體評測。搜到的都是前代 8.9 Dry（2018）或零售頁
- 適合誰／缺點：
  - 適合：要最輕的三重認證 80 m 繩（4.32 kg）的人。
  - 缺點：外皮比例 30 %，在本檔 16 款中僅高於 Sterling Nano（29 %）。石灰岩上反覆上下放時，外皮耐磨裕度偏少。

### BD 9.4 Dry Rope（中間）
- URL：https://www.blackdiamondequipment.com/products/9-4-dry-rope
- 繩徑 9.4 mm；**60 g/m**。原廠總重 60／70／80 m：3.6／4.2／4.8 kg
- 認證：Single（EN892、UIAA101）
- UIAA 墜落次數：原廠未標。衝擊力 8.2 kN
- 外皮比例：**38 %**
- 防水："dry-treated core and sheath"
- 長度：60／**70**／**80** m（另有 9.4 Non-Dry：40／60／70 m）
- 中點標記：有。雙色：無
- 官方價（USD）：60 m $289.95；70 m $309.95；80 m $319.95（皆 `available`=true）
- 第三方評測：OutdoorGearLab，經 WeighMyRack 轉載，2023-12-08，https://weighmyrack.com/node/44108 。"Our testers, however, were disappointed with its handling and durability."
  - OGL 原個別評測網址 `/reviews/.../black-diamond-9-4-dry` 現在會轉到 OGL 2026-08-19 的總表頁，沒有獨立頁面。
- 適合誰／缺點：
  - 適合：要 80 m dry 繩、在意總價的人。BD 80 m 只比 70 m 貴 $10。
  - 缺點：60 g/m 和 9.5 mm 級的 Mammut Crag Dry 一樣重。上面那篇評測對耐用性評價偏低。

### BD 9.6 Bipattern Dry Rope（中間）
- URL：https://www.blackdiamondequipment.com/products/9-6-bipattern-dry-rope
- 繩徑 9.6 mm；**63 g/m**。原廠總重 4.55 kg（70 m）
  - 注意：63 g/m × 70 m = 4.41 kg，和原廠總重不一致，兩個數字都照抄原廠
- 認證：Single（EN892、UIAA101）
- UIAA 墜落次數：原廠未標。衝擊力 6.8 kN
- 外皮比例：**36 %**
- 防水："Dry treated for weather protection and durability"，Rope Treatment: Yes。這頁沒有寫是否含繩芯
- 長度：只有 **70 m**（Features 寫 70M，變體名稱是 "One Size"）。沒有 80 m
- 中點標記：Half Mark: No（以雙花紋取代）。**雙色：有（Bi-pattern）**
- 官方價（USD）：70 m $339.95，**缺貨**（`available`=false，頁面顯示 Notify Me When Available）
- 第三方評測：沒找到 2020 年以後的媒體評測。Evening Sends 那篇 BD 9.6 是 2017-07-31，不收
- 適合誰／缺點：
  - 適合：要雙花紋找中點、方便多繩距垂降的人。
  - 缺點：查價當天缺貨，也只有 70 m。

### BD 9.9 Rope（耐用粗繩）
- URL：https://www.blackdiamondequipment.com/products/9-9-rope
- 繩徑 9.9 mm；**66.9 g/m**。原廠總重 2.56／3.84／4.48 kg
  - 注意：換算約 64 g/m，和標示的 66.9 g/m 不一致，兩個數字都照抄原廠
- 認證：Single（EN892、UIAA101）
- UIAA 墜落次數：原廠未標。衝擊力 8.9 kN
- 外皮比例：**34 %**
- 防水：**無**（Rope Treatment: No）
- 長度：40／60／**70** m。沒有 80 m
- 中點標記：有。雙色：無（顏色 Dual Blue，原廠沒說明是不是雙花紋，不推論）
- 官方價（USD）：40 m $139.95；60 m $199.95；70 m $219.95（70 m `available`=false，缺貨）
- 第三方評測：
  - OutdoorGearLab，2026-08-19 更新，https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/black-diamond-9-9 。"Even with moderate use, the sheath started to soften and show signs of wear… best suited for lead climbing in the gym."
  - ClimbSmith（2019 發表、2020-12 更新）測的是 35 m 室內版，結論是 "hard to recommend… for anything other than gym climbing"。
- 適合誰／缺點：
  - 適合：預算優先的入門者。
  - 缺點：旅行用不利，最重、沒有防水、沒有 80 m、70 m 缺貨，評測也說外皮耐用性不佳。

---

## Mammut

（Mammut US 站每個長度是一個獨立商品頁，下面列出的長度就是 US 站分類頁找得到的商品頁。庫存取自頁面 schema.org availability。）

### Mammut 9.0 Crag Sender Dry Rope（輕量）
- URL：https://www.mammut.com/us/en/products/2010-06270-5925/9-0-crag-sender-dry-rope-80m （60 m：…/2010-06250-5925/9-0-crag-sender-dry-rope-60m）
- 繩徑 9.0 mm；**54 g/m**
- 認證：Triple-certified：single、twin、double（half）
- UIAA 墜落次數：原廠寫 "UIAA falls (single rope 55 kg) 20"、"(single rope 80 kg) 5"，照抄原廠標籤。衝擊力 7.8／5.9／9.4 kN（順序原廠未標）
- 外皮比例：**39 %**
- 防水：Dry，標 **UIAA Water Repellent**，"Achieves <1.5% in UIAA water absorption tests"，PFC-free DWR。頁面沒寫是否含繩芯
- 長度：US 站有 60 m、**80 m**。**沒找到 70 m 商品頁**（REI 有 70 m 版，但不是原廠頁）
- 中點標記：有（"Abrasion-resistant center mark"）。雙色：無
- 官方價（USD）：60 m $259.95；80 m $339.95（InStock）
- 80 m 約 4.32 kg
- 第三方評測：Evening Sends（Andrew Bisharat），2025-08-31，https://eveningsends.com/mammut-crag-sender-9-0-a-quiver-of-one-climbing-rope/ 。作者說用了兩季才開始剪繩尾；結論 "If you're seeking a performance rope… and don't need a thick, hard-wearing daily trainer—this is an exceptional choice."
- 適合誰／缺點：
  - 適合：要 80 m、三重認證、UIAA WR 的人。三個條件都符合的組合裡，它是最輕的之一（54 g/m）。
  - 缺點：US 站沒有 70 m；評測者自己也說它不是拿來每天頂繩磨的訓練繩。

### Mammut 8.7 Alpine Sender Dry Rope（輕量，補充）
- URL：https://www.mammut.com/us/en/products/2010-06600-2285/8-7-alpine-sender-dry-rope-70m
- 繩徑 8.7 mm；**51 g/m**
- 認證：Triple（single、twin、double）
- UIAA 墜落次數：(single rope 55 kg) 16／(80 kg) 5。衝擊力 7.8／5.8／9.3（單位與順序原廠未標）
- 外皮比例：**36 %**
- 防水：Dry，UIAA Water Repellent，<1.5 %，PFC-free DWR
- 長度：US 站只看到 **70 m**（兩個配色）
- 中點標記：有。雙色：無
- 官方價（USD）：70 m $299.95（一個配色 InStock、一個 OutOfStock）
- 70 m 約 3.57 kg
- 第三方評測：沒找到 2020 年以後的可信媒體評測（找到的是 skimo.co 店家頁與 OpticSale，不收）
- 適合誰／缺點：
  - 適合：重量優先、兼走高山路線的人。
  - 缺點：在本檔中最細；運攀石灰岩天天上下放的耐磨裕度最少；US 站也沒有 80 m。

### Mammut 9.5 Crag Dry Rope（中間）
- URL：https://www.mammut.com/us/en/products/2010-07040-40315/9-5-crag-dry-rope-70m （50 m：2010-07020；60 m：2010-07030；80 m：2010-07050）
- 繩徑 9.5 mm；**60 g/m**
- 認證：Single
- UIAA 墜落次數 8（80 kg）；衝擊力 8 kN
- 外皮比例：**40 %**
- 防水：Dry，UIAA Water Repellent，<1.5 %，PFC-free DWR
- 長度：50／60／**70**／**80** m
- 中點標記：原廠頁的特色列表沒提到（記為「原廠未標」）。雙色：無（US 站分類頁沒看到 Crag Dry Duodess；有 Duodess 的是 9.5 Crag Classic，非 dry）
- 官方價（USD）：60 m $264.95；70 m $304.95；80 m $334.95（80 m InStock；70 m 一個配色 OutOfStock）
- 70 m 約 4.20 kg；80 m 約 4.80 kg
- 第三方評測：FeedTheHabit（Nate Fearer），2025-07-11，https://www.feedthehabit.com/mammut-9-5-crag-dry-duodess-rope-review/ 。測的是 Duodess 版，用於 North Cascades 的首攀清線工作："No soft spots, minor sheath cuts, or even fraying really. So far, I'm prepared to call this a durable rope."
- 適合誰／缺點：
  - 適合：要 80 m、UIAA WR、外皮比例 40 % 的單繩「主力繩」。
  - 缺點：單繩認證；原廠頁沒列中點標記（要另外確認或自己做記號）。

### Mammut 9.8 Crag Classic Rope（耐用粗繩）
- URL：https://www.mammut.com/us/en/products/2010-05870-2107/9-8-crag-classic-rope-70m ；Duodess 80 m：https://www.mammut.com/us/en/products/2010-05950-2237/9-8-crag-classic-rope-duodess-80m
- 繩徑 9.8 mm；**61 g/m**
- 認證：Single
- UIAA 墜落次數 8（80 kg）；衝擊力 8.5 kN
- 外皮比例：**40 %**
- 防水：無。Classic 款，"UIAA dry test 46.00 %"，也就是非 dry
- 長度：
  - 一般版：40／60／**70** m
  - **Duodess 版：70／80 m**（80 m 只有 Duodess 版）
- 中點標記：有（"Abrasion-resistant center mark"）。Duodess 版另寫 "durable and always visible center mark"
- 雙色：Duodess 版是 Mammut 的雙花紋款。FeedTheHabit 說 "Duodess… is just Mammut's fancy feature word for bi-pattern"；原廠頁本身沒用 bicolor 這個字
- 官方價（USD）：
  - 一般版 60 m $199.95、70 m $229.95
  - Duodess 70 m $249.95、80 m $289.95
  - 皆 InStock
- 70 m 約 4.27 kg；80 m 約 4.88 kg
- 第三方評測：沒找到 2020 年以後的可信媒體評測（只有 YouTube、REI 用戶評論、論壇）
- 適合誰／缺點：
  - 適合：要 80 m 加雙花紋、預算有限的人。Duodess 80 m 是本檔 80 m 雙色選項中最便宜的。
  - 缺點：沒有防水處理；61 g/m 讓 80 m 接近 4.9 kg。

---

## Sterling

（SterlingRope.com 同一款繩，價格依顏色不同：BiColor 明顯較貴，部分單色也較貴。下面價格是向 BigCommerce 變體 API 逐一查的。查到回傳母 SKU、`instock=False` 的組合，判定為該組合無貨或不存在。）

### Sterling Nano 8.9 mm XEROS（輕量）
- URL：https://sterlingrope.com/nano-8-9-mm-xeros-rope/
- 繩徑 8.9 mm；**52 g/m**
- 認證：Single／Half／Twin（UIAA 101、EN 892）
- UIAA 墜落次數 6／16／>20；衝擊力 8.5／6.6／10.4 kN（single／half／twin）
- 外皮比例：**29 %**
- 防水：原廠寫 "UIAA Dry certified built with Sterling XEROS technology"。Sterling 站上的說明是 "both the core and sheath are protected with XEROS"
- 長度：30／40／60／**70**／**80** m
- 中點標記：單色款 60 m 以上有中點標記（"Non bicolor options include a middle mark for lengths 60 m and longer"）。**雙色：有 BiColor 選項**
- 官方價（USD）：
  - 單色 70 m $269.99、80 m $299.99（橘、藍 instock）
  - BiColor 70 m $445.99（Olive Drab，instock）
  - BiColor 80 m：三個 BiColor 色都查無貨
- 70 m 約 3.64 kg；80 m 約 4.16 kg
- 第三方評測：
  - AMGA guide blog（Ted Teegarden），2025-10-22，https://www.amga.com/resources/guide-blog/sterling-nano 。"if your priority is a lightweight, durable rope with excellent weather resistance and triple certification, the Nano 8.9mm Xeros is a solid, dependable choice."
  - GearJunkie，2023-02-21，https://gearjunkie.com/climbing/sterling-nano-8-9-xeros-review 。結論 "the perfect lightweight adventure rope"；作者在西班牙 Chulilla 的路線上觀察外皮磨損（文中附有繩尾附近起毛的照片）。
- 適合誰／缺點：
  - 適合：要 80 m 三重認證、全繩 dry 的人。80 m 約 4.16 kg，是本檔中有 80 m 選項裡最輕的；單色 80 m 價格也最低。
  - 缺點：外皮比例 29 %，在本檔最低，石灰岩天天上下放時要有磨耗較快的心理準備。

### Sterling Aero 9.2 mm XEROS（輕量）
- URL：https://sterlingrope.com/aero-9-2-mm-xeros/
- 繩徑 9.2 mm；**56 g/m**
- 認證：Single／Half／Twin（UIAA 101、EN 892）
- UIAA 墜落次數 7／21／>20；衝擊力 8.8／8.6／10.1 kN
- 外皮比例：**41 %**
- 防水：UIAA Dry certified，XEROS（外皮與繩芯，同上）
- 長度：40／60／**70**／**80** m
- 中點標記：單色款 ≥60 m 有。**雙色：有 BiColor**
- 官方價（USD）：
  - 藍 70 m $312.99、80 m $356.99
  - BiColor Neon Green 70 m $400.99、80 m $456.99
  - 皆 instock
- 70 m 約 3.92 kg；80 m 約 4.48 kg
- 第三方評測：OutdoorGearLab，2024-10-30，https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/sterling-aero-9-2-xeros 。"we think this is the most versatile rope on the market"；但也寫 "The major downside to this rope is limited durability, as we chewed up this rope during a fairly average summer"。
- 適合誰／缺點：
  - 適合：一條繩要同時應付運攀、多繩距雙股垂降的人。三重認證、外皮 41 %，有 80 m 雙色。
  - 缺點：OGL 實測耐用性有限；BiColor 80 m 比單色貴 $100。

### Sterling IonR 9.4 mm XEROS（中間）
- URL：https://sterlingrope.com/ion-r-9-4-mm-xeros/
- 繩徑 9.4 mm；**57 g/m**
- 認證：Single（UIAA 101、EN 892）
- UIAA 墜落次數 5；衝擊力 8.7 kN
- 外皮比例：**39 %**
- 防水：UIAA Dry certified，XEROS
- 長度：40／60／**70**／**80** m
- 中點標記：單色款 ≥60 m 有。**雙色：有 BiColor**
- 官方價（USD）：
  - 藍／黃 60 m $283.99、70 m $317.99、80 m $367.99
  - Olive Drab 70 m $361.99；Olive Drab 80 m 無貨
  - BiColor Yellow 80 m $445.99；BiColor Olive Drab 70 m $389.99
- 70 m 約 3.99 kg；80 m 約 4.56 kg
- 第三方評測：OutdoorGearLab，2026-08-19，https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/sterling-ionr-9-4-xeros 。"our favorite bi-pattern rope thanks to a durable, tight weave, excellent versatility, and a protective dry treatment"。
- 適合誰／缺點：
  - 適合：要 80 m 雙色、全繩 dry 的中段主力繩；57 g/m 在 9.4 mm 級偏輕。
  - 缺點：單繩認證；UIAA 墜落次數 5，在本檔單繩中最低（只記錄，正文可能不用）。

### Sterling Velocity 9.8 mm XEROS（耐用粗繩）
- URL：https://sterlingrope.com/velocity-9-8-mm-xeros/
- 繩徑 9.8 mm；**62 g/m**
- 認證：Single（UIAA 101、EN 892）
- UIAA 墜落次數 6；衝擊力 8.6 kN
- 外皮比例：**35 %**
- 防水：UIAA Dry certified，XEROS
- 長度：40／（50）／60／**70**／**80** m。下拉選單有 50m；頁面文字寫 "Available Lengths: 40, 60, 70, 80 m"
- 中點標記：單色款 ≥60 m 有。**雙色：有 BiColor**
- 官方價（USD）：
  - 藍 60 m $267.99、70 m $323.99、80 m $367.99；綠 80 m $367.99
  - BiColor Neon Green 70 m $489.99、80 m $556.99（本檔最貴）
  - 皆 instock
- 70 m 約 4.34 kg；80 m 約 4.96 kg
- 第三方評測：OutdoorGearLab，2022-12-22，https://www.outdoorgearlab.com/reviews/climbing/climbing-rope/sterling-velocity-xeros-9-8 。"a durable and smooth rope that makes a perfect workhorse for heavy use"；缺點是和細繩相比 "feels a little more cumbersome… feeding slack through an assisted-braking belay device"。
- 適合誰／缺點：
  - 適合：粗繩又要全繩 dry、要 80 m 的人。
  - 缺點：80 m 接近 5 kg，是本檔 80 m 最重；BiColor 80 m 價格最高。

---

## 彙整表

70／80 m 重量 = 原廠 g/m × 長度（kg，四捨五入至 0.01）。「—」表示原廠沒有該長度。價格為 USD，查價日 2026-10-23。

| 品牌 型號 | mm | g/m | 認證 | 外皮 % | 防水（原廠寫法） | 70 m kg | 80 m kg | 有 80 m | 中點 | 雙色 | 70 m 價 | 80 m 價 | 第三方評測（≥2020） |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Petzl VOLTA 9.2 | 9.2 | 55 | S/H/T | 42 | Duratec Dry（範圍未標） | 3.85 | 4.40 | 是 | 有 | 無 | $334.95 | $359.95（灰有貨，橘無） | Climbing Gear Reviews 2025 |
| Petzl ARIAL 9.5 | 9.5 | 58 | S | 40 | Duratec Dry | 4.06 | 4.64 | 是 | 有 | 無 | $314.95 | $349.95 | GearJunkie 2026；Rock+Run 2020 |
| Petzl CONTACT 9.8 | 9.8 | 60 | S | 41 | 未列（非 dry） | 4.20 | 4.80 | 是 | 有 | 無 | $299.95 | $334.95 | 未找到 |
| Petzl MAMBO 10.1 | 10.1 | 65 | S | 37 | 未列（非 dry） | 4.55 | — | 否 | 有 | 無 | $279.95 | — | 未找到 |
| BD 8.8 Dry | 8.8 | 54 | S/H/T | 30 | Dry，core＋sheath | 3.78（原廠 3.75） | 4.32 | 是 | 有 | 無 | $309.95 | $339.95 | 未找到 |
| BD 9.4 Dry | 9.4 | 60 | S | 38 | Dry，core＋sheath | 4.20 | 4.80 | 是 | 有 | 無 | $309.95 | $319.95 | OGL（經 WMR）2023 |
| BD 9.6 Bipattern Dry | 9.6 | 63 | S | 36 | Dry（範圍未標） | 4.41（原廠 4.55） | — | 否 | 雙花紋代替 | 有 | $339.95（缺貨） | — | 未找到 |
| BD 9.9 | 9.9 | 66.9 | S | 34 | 無 | 4.68（原廠 4.48） | — | 否 | 有 | 無 | $219.95（缺貨） | — | OGL 2026；ClimbSmith 2020 |
| Mammut 8.7 Alpine Sender Dry | 8.7 | 51 | S/H/T | 36 | UIAA WR，<1.5 % | 3.57 | — | 否（US 站） | 有 | 無 | $299.95 | — | 未找到 |
| Mammut 9.0 Crag Sender Dry | 9.0 | 54 | S/H/T | 39 | UIAA WR，<1.5 % | — （US 站無 70 m） | 4.32 | 是 | 有 | 無 | — | $339.95 | Evening Sends 2025 |
| Mammut 9.5 Crag Dry | 9.5 | 60 | S | 40 | UIAA WR，<1.5 % | 4.20 | 4.80 | 是 | 原廠未標 | 無 | $304.95 | $334.95 | FeedTheHabit 2025（Duodess 版） |
| Mammut 9.8 Crag Classic | 9.8 | 61 | S | 40 | 無（dry test 46 %） | 4.27 | 4.88 | 是（只有 Duodess） | 有 | Duodess 版 | $229.95／Duodess $249.95 | Duodess $289.95 | 未找到 |
| Sterling Nano 8.9 XEROS | 8.9 | 52 | S/H/T | 29 | UIAA Dry，XEROS core＋sheath | 3.64 | 4.16 | 是 | 單色有 | BiColor | $269.99／BiColor $445.99 | $299.99（BiColor 無貨） | AMGA 2025；GearJunkie 2023 |
| Sterling Aero 9.2 XEROS | 9.2 | 56 | S/H/T | 41 | UIAA Dry，XEROS | 3.92 | 4.48 | 是 | 單色有 | BiColor | $312.99／BiColor $400.99 | $356.99／BiColor $456.99 | OGL 2024 |
| Sterling IonR 9.4 XEROS | 9.4 | 57 | S | 39 | UIAA Dry，XEROS | 3.99 | 4.56 | 是 | 單色有 | BiColor | $317.99／BiColor $389.99 | $367.99／BiColor $445.99 | OGL 2026 |
| Sterling Velocity 9.8 XEROS | 9.8 | 62 | S | 35 | UIAA Dry，XEROS | 4.34 | 4.96 | 是 | 單色有 | BiColor | $323.99／BiColor $489.99 | $367.99／BiColor $556.99 | OGL 2022 |

### 讀不到／資料缺口
- 16 款原廠產品頁全部讀到；沒有型號因為頁面打不開而缺漏。
- 原廠沒提供的欄位：
  - BD 全系列沒有 UIAA 墜落次數
  - Mammut 9.5 Crag Dry 頁沒有中點標記敘述
  - Petzl Duratec Dry 與 BD 9.6、Mammut Dry 沒寫處理是否含繩芯
  - BD 9.6、9.9 的原廠總重和 g/m 換算不一致
- 沒找到 2020 年以後可信第三方評測的型號：Petzl CONTACT 9.8、Petzl MAMBO 10.1、BD 8.8 Dry、BD 9.6 Bipattern Dry、Mammut 8.7 Alpine Sender Dry、Mammut 9.8 Crag Classic。
- 候選名單中已停產或不存在、改收替代款的：BD 9.0 Dry、Mammut「Alpine Sender 9.0／Crag Sender 9.5／9.5 Gym」、Sterling Fusion Nano IX、Evolution Helix。
