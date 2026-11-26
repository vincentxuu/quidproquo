# R-haulbags：拖包怎麼挑＋推薦款（研究筆記）

- 研究 ID：`2026-10-24-haulbags`；pool 類別 climbing／gear
- 查核日：全部 2026-10-24（價格、庫存為當日官網；可變）
- 用途：補進 `src/content/posts/climbing/2026-10-24-multipitch-hauling.md` 的「拖包怎麼挑＋推薦款」段；表格欄位比照 `2026-10-19-multipitch-climbing-backpacks.md`（型號｜容量｜空重｜特色｜官方價格｜評測｜適合誰／缺點；幣別照官網不換算；評測欄只列合格日期的第三方評測，「—」表示沒有）
- 日期門檻：評測、影片、價格只收 2024-01-01 以後；原廠頁、協會／嚮導教學不受限但要寫年份
- 標記：**[opened]** 本次實際打開並讀到該段文字；**[snippet]** 只看到搜尋摘要或零售商轉貼；**[not opened]** 抓不到
- 讀取方式：Shopify `/products/<handle>.js`（價格、上架日、描述）＋ curl HTML 轉文字；JS 頁用 r.jina.ai 或 Exa web_fetch。原始擷取存在 scratchpad `hb/`（raw、txt、jn、js、subs），未入版控

## 0. 工具鏈紀錄（toolDegradation）

1. Groundlane MCP：本 session 只有 `authenticate`／`complete_authentication`，沒有 web_search／web_fetch → 不可用
2. Groundlane 直接 HTTP（POST `https://groundlane.vincent-xu-work.workers.dev/mcp`，tools/list）→ HTTP 401
3. Keenable keyless：可用，主要搜尋工具（約 50 次查詢）
4. You.com keyless：未用到（Keenable 與 Exa 已足夠）
5. Exa：web_search_exa、web_fetch_exa 可用（Grivel Grand Cap 40、GearJunkie、Blister、Rock Empire、BananaFingers 都靠它）；對 Fixe 回 CRAWL_HTTP_401，對 Kailas、Decathlon 舊網址回 CRAWL_NOT_FOUND，對 Mammut 只回標題
6. Tavily extract：Mammut 頁只回導覽列
7. r.jina.ai：BD 規格區、Grivel、G7、Blue Ice、Metolius 分類頁都靠它；CAMP `camp.it/info/item/2775` 只回「下載技術規格」殼
8. curl：Fixe Hardware 401（curl、jina、Exa 全部 401，**Fixe 未讀**）；Blister、GearJunkie 403（改 Exa 讀到）

## 1. 小拖包／sub-bag（約 20–55 L，自由攀多繩距輕量拖包）

| 型號 | 容量 | 空重 | 材質與特色 | 官方價格（2026-10-24） | 合格評測 | 來源 |
|---|---|---|---|---|---|---|
| Metolius Mescalito Haul Pack | 24 L | 0.85 kg | 輕版 Durathane；兩條 3 格 daisy chain、haul-bag style clip-in points、肩帶可收、腰帶可拆、頂蓋內拉鍊袋、鋁扣 | USD 119.95 | —（Blister 2015 測的是 Express，不合格） | [opened] https://www.metoliusclimbing.com/products/haul-packs |
| Metolius Express Haul Pack | 39 L | 1.2 kg | 同上 | USD 139.95 | — | 同上 |
| Black Diamond Wall Hauler 40 | 40 L | 1.99 kg | TPU 塗層布、S 形肩帶、偏置提把、捲頂加跨頂壓縮帶、外側小袋、重新設計的開口邊緣減少卡住；產地菲律賓；含 PFAS（不出貨 CA／NY／CO 等州） | USD 219.95 | OutdoorGearLab 2024-10-30：72 分，「Difficult to clip gear or a poop tube underneath」 | [opened] https://www.blackdiamondequipment.com/products/wall-hauler-40-haul-bag |
| Metolius Sentinel | 46 L（+4" 領口） | 2.1 kg | Durathane、RF 熔接主縫、雙層 ballistic 頂蓋附內袋、背負系統可收、鋁扣、頂部壓縮帶、偏置拖點；官方定位「shorter walls or as a sub-bag」 | USD 189.95 | OGL 2024：85 分，「Most people better served by a bigger haul bag or daypack」 | [opened] https://www.metoliusclimbing.com/products/haul-bag |
| Edelrid KURT HAULBAG 55 | 55 L | 1390 g（頁面商品資料欄 `weight`，非規格表） | Tarpaulin（100% polyester）、背負系統可整組拆下收起（裝滿也能拆）、兩條不同長度拖環、兩條側壓縮帶、底部四個掛點；65×37×23 cm | EUR 140 | Vertical Life 2024-06-25（評者寫約 1.3 kg、拆背負約 1.0 kg；評的版本有正面全長拉鍊，對應官網 KURT HAULBAG PRO 55） | [opened] https://edelrid.com/eu-en/sport/backpacks-and-rope-bags-shop/kurt-haulbag-55 ；PRO 55：https://edelrid.com/int-en/sport/backpacks-and-rope-bags-shop/kurt-haulbag-pro-55 （EUR 140、1460 g、「long, abrasion-resistant front zipper」） |
| Climbing Technology AZIMUT | 25 L（延伸 35 L） | 1200 g | 聚酯 PVC 塗層布、不同長度吊帶含 daisy chain、捲頸開口、肩帶可拆並可收進包內、2 個內裝備環；53×29×20 cm；原廠定位「short big walls, multipitch routes」 | 官網未標 | — | [opened] https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/azimut |
| Climbing Technology CRAGGY | 40 L（延伸 50 L） | 1900 g | 同布料、兩種長度拖帶、捲頂、可拆背負與腰帶、底部交叉織帶可掛 portaledge 或 sub-bag；57×34×22 cm；「big-wall day climbing」 | 官網未標 | — | [opened] https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/craggy |
| Grivel Grand Cap 40 | 40 L | 1500 g | Tarpaulin、捲頂加正面全長開口、肩帶與腰帶可收、補強拖拉結構 | EUR 170，歐洲官網「currently out of stock」；美國官網 404 | — | [opened via Exa] https://grivel.com/products/grand-cap-40 （curl 被轉到首頁） |
| KONG Genius II | 30 L | 850 g | PVC、兩個強化吊環（後、上）、雙重抽繩、肩帶可收、斜切開口可掛開 | USD 150.95（kongusa .js；搜尋摘要曾見 141.95） | — | [opened] https://www.kongusa.com/products/genius-ii （偏工作／洞穴用，KONG 標籤含 Climbing） |
| Fish Atom Smasher／Deluxe Atom Smasher | 21" 高、12" 底；Deluxe 加領口共 51 L | 未標 | 28 oz RBS vinyl，肩帶腰帶可拆；Deluxe 有內袋、領口 | USD 99／129（頁面無日期，價格可能過時；電郵訂購） | — | [opened] http://fishproducts.com/catalog/haul_bags.html |
| Wallpinist Haul Bag（High Mountain Gear，經 HowNOT2 販售） | 45／65 L | 1.9 lb／2.2 lb | Challenge Ultra 800TX 帆布、Dyneema 偏置拖帶、背負全可拆、捲頂；設計是兩個包、第二個塞進第一個 | USD 499／599.99，兩款皆缺貨 | — | [opened] https://hownot2.com/products/wallpinist-haul-bag （上架 2025-02-07） |

**明確標示可拖、但其實是背包的款（和背包文分工：只引用、不重做）**

| 型號 | 容量 | 空重 | 重點 | 官方價格 | 評測 | 來源 |
|---|---|---|---|---|---|---|
| Blue Ice Alpine Hauler | 45 L | 575 g | ALUULA Durlyte、3 點快拆拖拉系統、肩帶可全收、捲頂；原廠：「hauled up difficult passages but where free climbing with the pack remains the main technique」 | EUR 360（EU）／USD 439.95（US） | **Climbing.com 2026-06-18（Anthony Walsh）**：低角度路段拖兩段就破六個洞，「It's a backpack, not a haulbag」 | [opened] https://blueice.com/products/alpine-hauler ；https://us.blueice.com/products/alpine-hauler ；評測 https://www.climbing.com/gear/blue-ice-alpine-hauler-backpack-review |
| Grade VII（G7）HAUL PACK | 22／36／55 L | 商品資料欄 475／610／740 g（可能是運送重量） | 專利複合布、整合拖帶、防割彈力繩；22 L 腰帶 1.27 cm，36／55 L 腰帶 3.81 cm | 顯示 USD 390／510／670；頁面「Sold Out」「Expected Fulfillment: Summer 2026」（.js 卻標 available，衝突） | 只有 Climbing.com 2022-08-24、GearJunkie 2022-09-20（**不合格**；當時售價 USD 255／345／425） | [opened] https://grade7.com/products/haul-pack ；https://grade7.com/pages/g7-haul-pack |
| Edelrid Rubi、Osprey Mutant 22、Patagonia Ascensionist 35L、Petzl BUG、Blue Ice Wadi | — | — | 背包文已列（拖拉環／拖拉系統） | — | — | 見 `2026-10-19-multipitch-climbing-backpacks.md` 判準 4 與表格 |

## 2. 大岩壁拖包袋（60–160 L）

| 型號 | 容量 | 空重 | 材質與特色 | 官方價格 | 合格評測 | 來源 |
|---|---|---|---|---|---|---|
| Metolius Quarter Dome | 69 L（+5.5" 領口） | 2.3 kg | Sentinel 的放大版 | USD 219.95 | OGL 2024：81 | [opened] https://www.metoliusclimbing.com/products/haul-bag |
| Metolius Half Dome | 125 L（+15" 領口） | 3.4 kg | Durathane、RF 熔接、結構縫線再包 3" 織帶、river-bag 式封口、雙頂壓縮帶、偏置拖點、**排水孔**、3 個內裝備環、頂蓋內袋 | USD 279.95 | OGL 2024 Best Overall：87，「most common haul bag that you'll see on El Capitan」 | 同上 |
| Metolius El Capitan | 157 L（+16" 領口） | 3.6 kg | Half Dome 放大版 | USD 299.95 | OGL 2024：84（認為長圓筒太大） | 同上 |
| Black Diamond Wall Hauler 70 | 70 L | 2.46 kg | 同 WH40 系列；腰帶可當 bosun chair（Shane Borza 影片） | USD 259.95 | OGL 2024 Best Buy：83；下東壁時金屬扣一直鬆、頂部金屬鉤拖拉時脫開；Shane Borza 2024-07-24 YouTube 開箱 | [opened] https://www.blackdiamondequipment.com/products/wall-hauler-70-haul-bag |
| Black Diamond Wall Hauler 140 | 140 L | 3.11 kg | 同系列，「meant for expeditions」 | USD 319.95 | OGL 2024：78 | [opened] https://www.blackdiamondequipment.com/products/wall-hauler-140-haul-bag |
| Black Diamond Wall Hauler 125 | 125 L | — | — | 官網網址轉到 Haul Bags & Duffels 分類頁，分類只剩 40／70／140 | — | [opened 轉址] https://blackdiamondequipment.com/products/wall-hauler-125-haul-bag ；REI 清倉價 USD 199.73（原 279.95）[snippet] https://www.rei.com/c/haul-bags → **推定停產** |
| Climbing Technology ZENITH | 70 L（延伸 85 L） | 2700 g | 聚酯 PVC 塗層布、兩種長度拖帶、捲頂、可拆背負腰帶、底部交叉織帶 | 官網未標 | — | [opened] https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/zenith |
| C.A.M.P. SUPERCARGO 70／40 | 70／40 L | 3400／2900 g（零售商表格） | Tarpaulin TPU 4500D、肩帶收進專用隔層、腰帶可拆、拖帶「guaranteed for loads up to 80 kg」、手套可用的提把、捲頂、4 個內裝備環 | 官網未標（camp.it 是 JS 殼）；AU 零售 AUD 479.99 | — | [not opened 官網] https://www.camp.it/info/item/2775 ；規格表 [snippet] https://www.climbinganchors.com.au/c.a.m.p.-supercargo ；一家美國工業零售商標 70 L「discontinued」[snippet] → 現況未確認 |
| Edelrid LYNN HAULBAG 95 | 95 L | 2500 g（商品資料欄） | Tarpaulin、環繞泡棉墊防穿刺、背負可拆；歸在 Professional 線 | EUR 240 | — | [opened] https://edelrid.com/int-en/professional/transport/lynn-haulbag-95 |
| KONG OMNIBAG | 50 L（延伸 60 L） | 未標 | PVC、不同長度拖環、內捲封口加鋁扣、側拉鍊、可選底墊 | USD 175.95 | — | [opened] https://www.kongusa.com/products/omnibag （繩索作業取向） |
| Fish Grade V／Deluxe／Budget | 84 L／36" 高 18" 底／123 L | 未標 | 32 oz（Budget 28 oz）RBS vinyl、內建可調 daisy chain、Grade V 有補強排水孔 | USD 189／199／未讀到（頁面無日期） | — | [opened] http://fishproducts.com/catalog/haul_bags.html |
| Fixe TITAN（77 L）／MOAB | — | — | 摘要：「40oz urethane body」「full urethane roll top」 | — | — | [not opened] https://fixehardware.com/index.php/titan-haulbag.html （curl／jina／Exa 皆 401） |
| Cassin Torre 70 | 70 L | — | — | — | — | [snippet] backcountry.com 零售頁，未開 |

配件：Metolius Nose Cone（套在拖包上方的錐形罩，減少卡住、防暴雨、附 daisy chain）USD 119.96 [opened] https://www.metoliusclimbing.com/products/nose-cone ；bergundsteigen 2022 也提到這類罩子（見 §5）。Mammut Trion Haul Cover：把 2–3 個背包一起罩住拖，Patrick Gabarrou 的點子 [opened meta description] https://www.mammut.com/us/en/products/2530-00190-0731/trion-haul-cover ；價格 USD 69.95 只見分類頁摘要 [snippet]。

## 3. 查過、目前沒有攀岩拖包的品牌（或只有非攀岩用途）

| 品牌 | 查到什麼 | 判讀 |
|---|---|---|
| Petzl | 運動線無拖包（BUG 有拖拉環，見背包文）；PORTAGE 30 L 是洞穴背包（零售商：800 g、TPU、「Upper loop for hauling」，官網頁沒打開）；EXPERT 40／55 是專業裝備包 | 無攀岩拖包；PORTAGE 只能寫「洞穴包」 |
| Mammut | Cargon 是旅行袋；只有 Trion Haul Cover（罩子配件） | 無拖包 |
| Wild Country | Crag Hauler 25／40 是「haul-bag inspired」岩場背包，Stamina 41 L gear bag | 無拖包（Crag Hauler 名字有 haul，別誤列） |
| Beal | 舊「haul-bags」分類網址 404；`collections/sacs` 只有繩袋、工具桶、Pro Rescue／Combi Pro 工作袋 | 無攀岩拖包 |
| Sterling | 只有 Carrier 繩袋（17／45 L） | 無 |
| Ocun | 2026 型錄 PDF 全文 grep "haul" 只命中吊帶拖繩環（9 kN） | 無 |
| Singing Rock | 背包與裝備袋清單：Rockwall 20、Rocking 40、Tarp Duffle、Gear Bag 35／50（工作與洞穴） | 無拖包 |
| Simond（Decathlon） | `decathlon.com/products/climbing-bigwall-bag`（Big wall 40L）現在 404；摘要曾寫「suitable for hauling」 | **推定下架**；現行只有 Alpinism 背包與 Duffel |
| Arc'teryx | Carrier duffles；攀岩包見背包文 | 無 |
| Mountain Hardwear | Camp 4 duffels | 無 |
| Trango | Crag Pack 2.0（文案「Ditch your haul bag」） | 無 |
| Yates | yatesgear.com 只見舞台吊掛與繩袋；Rock Sac 只出現在 OGL 舊評測 | 無現行攀岩拖包（只看搜尋結果，未逐頁翻站） |
| CiloGear | 45L／65L Hauly 放在「Historic WorkSacks」，缺貨 | 不算現行 |
| Hound Dog | 搜尋只回寵物包 | 找不到此品牌 |
| Kailas（凱樂石） | kailasclimb.com 列 Arco 40L Haul Bag、KEG Hauling 20／35／45 L；俄羅斯零售商：KEG 20 L、PVC、637 g；kailasgear.com 舊網址 404 | 有，但只有 [snippet]，未確認 kailasclimb.com 是否原廠站 |
| 日本品牌 | 日本店（Blue Sheep、楽天）賣 Metolius、BD；KEM Japan 型錄是 Singing Rock 代理 | 沒找到日本自有拖包品牌 |
| 韓國品牌 | 搜「홀백 빅월」只有技術部落格 | 沒找到 |

## 4. 第三方評測（日期逐筆核對）

合格（2024-01-01 以後）：

1. **OutdoorGearLab〈Best Haul Bags for Big Wall Climbing〉** — Trish Matheny；頁首「Updated October 30, 2024」、Editor's Note「updated … to include an updated haul bag from Black Diamond」、JSON-LD datePublished／dateModified 皆 2024-10-30 [opened] https://www.outdoorgearlab.com/topics/climbing/best-haul-bag
   - 8 款分數：Half Dome 87、Sentinel 85、El Cap 84、WH70 83、Quarter Dome 81、WH140 78、WH40 72、Waste Case 65
   - 「Metolius bags to provide the best values」；BD「more affordable … however, they do not offer the same durability」
   - 限制：Metolius 部分測試是舊版累積（創辦人 McNamara 110 次大岩壁），只有 Metolius 和 BD 兩牌
   - 選購篇同日：https://www.outdoorgearlab.com/topics/climbing/best-haul-bag/buying-advice （§5 引用）
2. **Vertical Life〈The Ultimate Edelrid Kurt 55L Haulbag Review〉** 2024-06-25 [opened] https://verticallifemag.com/articles/edelrid-kurt-55l/ ：「roughly half the weight of the 40L BD Wall Hauler & 46L Metolius Sentinel」；拆背負比 Metolius Express 順；塑膠扣具；正面拉鍊只在平放時好用。
3. **Climbing.com〈The Alpine Hauler Is One of the Best Packs I've Used (With One Major Caveat)〉** Anthony Walsh，2026-06-18（修改 2026-06-25）[opened] https://www.climbing.com/gear/blue-ice-alpine-hauler-backpack-review ：「At the second pitch, I counted six new holes in the pack」「It's a backpack, not a haulbag.」
4. **Shane Borza〈Ledgelife 1 - Black Diamond Haul Bag Review〉** YouTube 2024-07-24，10:29 [opened 字幕＋說明欄] https://www.youtube.com/watch?v=Nd5R_UBfrJg ：新版 WH70 的偏置提把、紅藍色碼拖帶、金屬鉤、腰帶當 bosun chair、內袋反向可掛；個人使用，非測試。
5. **EpicTV Climbing Daily〈The Lightest And Most Durable Climbing Pack Blue Ice Has EVER Made〉** 2025-06-27 [metadata＋說明欄] https://www.youtube.com/watch?v=YnFmFvfP-R4 ：Blue Ice 總部訪談設計者，**器材店頻道、等同廠商介紹**，不能當評價。
6. **Climbing Gear Reviews（UK 部落格）〈To Haul Or Not To Haul?〉** 2026-05-05 [opened] https://climbinggearreviews.com/2026/05/05/equipment-for-multipitch-and-alpine-rock-climbing-part-two-packs-and-bags-to-haul-or-not-to-haul-that-is-the-question/ ：分工策略（不背包／跟攀者背／兩人各背、難段用半繩拖）；寫 Alpine Hauler 575 g 對 WH40 1.99 kg「almost 4 times」。個人部落格。

不合格（排除，留紀錄）：Climbing.com G7 Haul Pack 2022-08-24；GearJunkie G7 2022-09-20；Blister Metolius Express 2015-04-15；WeighMyRack〈3 Hauling Methods〉2018-03-05；HowNOT2〈My Haul Bag Exploded〉2023-04-26、〈Packing Haul Bags〉2022-09-21、〈Hauling Giant Big Wall Bags〉2022-11-09；Shane Borza〈Tech Tip 12〉2018；Up & Under 2012；Altri Monti BD Touchstone 2021；WesSpur Kurt 2020；OGL 個別 Yates Rock Sac、Fish Deluxe 舊評測（未查日期，頁面是舊版型號）。Blister Half Dome 403、未讀。

**結論**：2024+ 的拖包群測只有 OGL 一篇，而且只比 Metolius 與 BD；Edelrid、CT、Grivel、CAMP、Kong 沒有找到 2024+ 第三方評測。

## 5. 選購判準（附來源）

1. **布料：PU／Durathane ＞ TPU ＞ vinyl（PVC）塗層**
   - OGL 選購篇 2024：「we prefer urethane/Durethane … Urethane also doesn't seem to break down as much over time, whereas vinyl seems to get more crackly … Vinyl is generally less expensive and also lighter.」[opened]
   - bergundsteigen〈How to Bigwall (2/3): Richtig Haulen〉2022-12-15：「Haulbags sind große, zylinderförmige Säcke aus abriebfestem Material (Polyurethan-Harz- oder, weniger gut, Vynil-beschichtetes Nylon)」「raten wir hier von den günstigeren Haulbag-Varianten ab」[opened] https://www.bergundsteigen.com/artikel/how-to-bigwall-2-3-richtig-haulen/
   - Metolius：Durathane「10 times more abrasion resistant than the vinyl-coated nylon used in most other haul bags」（廠商說法）
   - 背包撐不住：Achey（Climbing.com 2023-06-14）「Pick a bag specifically designed for hauling, or it will get shredded after only one or two outings.」[opened] https://www.climbing.com/skills/how-to-haul-pack-climbing/ ；bergundsteigen 2021-12-09（Zangerl、Larcher）「am besten eignet sich ein Haulbag. Denn der ist viel robuster als ein Rucksack.」[opened] https://www.bergundsteigen.com/artikel/die-tagline-wie-haule-ich-richtig-tipps-von-babsi-zangerl-jacopo-larcher/ ；Alpine Hauler 實例（Climbing 2026）
2. **縫線：熔接主縫比縫製耐用**：OGL「Of all the haul bag failures that we've tested, it has always been the sewn seams that blew out first」（但多在 15+ 次後、保養不佳）；Metolius 主縫 RF 熔接
3. **拖帶：兩條、偏置、不同長度** → 拖拉時只掛一條、另一條可打開包不掉包。Metolius「offset haul points」；BD「Off-set handles」；Edelrid「haul loops of different lengths allow one side to be detached easily」；CT「haul webbing in two different lengths」。Petzl 舊 tech tip（Wayback）：「Only one of the bag's two haul straps is attached … This way it is easy to open the bag without dropping it.」（pool 既有紀錄）。CAMP 拖帶標 80 kg（零售商轉貼）
4. **背負系統能收或拆**：Achey「Waistbelts and shoulder straps will snag, so remove or tuck them away. Never tie anything to the side of a haul pack—hang below, if at all.」[opened]；各款：Metolius「tucks away in seconds」、Edelrid 裝滿也能整組拆、Kong「foldaway」、CAMP 肩帶收進隔層。OGL：背負「all equally uncomfortable when you have an 80+ pound load」，BD 金屬扣下山時會鬆
5. **開口與取物**：OGL：超過 32 吋高的包要整個人鑽進去才拿得到底部；river-bag 封口最防水但最慢；寬開口重要。正面全長拉鍊（Edelrid KURT PRO、Grivel Grand Cap）平放時方便，懸吊時用不上（Vertical Life 2024）
6. **排水孔**：Metolius Half Dome 有；Fish Grade V「reinforced drain hole」；Fish 頁：「If it is really dumping rain … punch a hole in the bottom … for drainage.」；Rock Empire Cargo 有。小包多半沒有（Sentinel、WH40 官網未提）
7. **底部掛點**：用來掛 sub-bag、portaledge、poop tube。CT Craggy／Zenith「bag-bottom cross webbing」；OGL 說 WH40 底部難掛；Fish 警告底部 daisy chain 只能吊繩、不能當上升繩固定點；Treestuff 轉貼 Metolius「Under bag haul points: 1.3 kN」[snippet]
8. **容量看路線長度與隊伍**：OGL：The Nose 這類低角度多橫渡路線用一個大包，Zodiac 這類懸垂路線用兩個中包好輪替；小包「can … be totally unnecessary」，適合 Nose-in-a-day、Half Dome 一日。OGL 分級：haul pack 1,500–3,000 cu in（約 25–49 L）、small 3,000–5,000、medium 5,000–8,000、large 8,000–10,000。bergundsteigen：兩人五天、每人每天 4 L 水 → 60–70 kg；Petzl 舊 tech tip：拆成 30–40 kg 的幾個包（pool 既有）
9. **sub-bag 概念**：Metolius Sentinel「as a sub-bag under your main haul bag」；Fish Atom Smasher「overflow and gear management … on the zip line」；Wallpinist 兩包一套
10. **背包拖 vs 拖包**：Kirkpatrick（2008 上線、1990 年代寫成、器材過時）「Hauling should be avoided where possible」「Make sure no hard objects are pressing directly against the fabric」[opened] https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies ；Blue Ice 原廠也寫 Alpine Hauler 以背著爬為主；判準：整條路線要拖就買拖包，只拖一兩段難段用原廠標明有拖拉環的攀登包（背包文判準 4）
11. **包內襯**：bergundsteigen「Um den Inhalt des Haulbags zu schützen, sollte man den Sack innen polstern」；Shane Borza 用單層紙箱做內襯兼地墊；Edelrid LYNN 內建泡棉
12. **PFAS**：BD Wall Hauler 官網標「contains PFAS and cannot be shipped to California, New York, or Colorado」；Metolius Nose Cone 標「zero PFAS」

## 6. 台灣通路（2026-10-24）

- **KONG Genius II 30 L**：Concordia（concordia.com.tw）上架，庫存「預購」，頁面沒看到價格 [opened] https://concordia.com.tw/index.php?route=product/product&product_id=3869
- **Black Diamond 台灣官網**（blackdiamondequipment.com.tw）：產品列表首頁沒有 Wall Hauler（只看第一頁、站內搜尋網址 404）[opened 部分]
- **城市綠洲 metroasis.com.tw**：有 Climbing Technology（FALESIA 岩場包 NT$2,800 特價）、Singing Rock，但沒看到 CT 拖包 [snippet]
- **睿瀧 RayLong**：Notch Hauler 70L 繩袋裝備背包 NT$9,900（攀樹用裝備包，不是拖包）[snippet]
- **alpinedirect.com.tw** 繩袋／背包分類：只有繩筒袋、拋繩袋 [opened]
- Petzl 台灣、迪卡儂台灣：無拖包可賣（Petzl 本身沒有、Simond 已下架）
- **結論**：台灣沒找到 Metolius、BD Wall Hauler、Edelrid KURT、CT 拖包的現貨頁；實務上是國外網購（REI、BananaFingers、Oliunid、EpicTV 等）或代購。依本站慣例，台灣資料少不列為研究缺口

## 7. 建議放進文章的推薦款（草案）

- **自由攀多繩距、偶爾拖難段**：先用原廠標明有拖拉環的攀登包（背包文）；要整條拖再買小拖包。小拖包首選 Metolius Express 39 L（1.2 kg、USD 139.95，最輕的 Durathane）或 Mescalito 24 L；要更大、要背得舒服選 Edelrid KURT 55（約 1.4 kg、EUR 140，背負整組可拆，Vertical Life 2024 好評）；BD Wall Hauler 40（1.99 kg、USD 219.95）與 Metolius Sentinel（2.1 kg、USD 189.95）是「重但耐操」的選擇，OGL 2024 認為多數人改用大一號或背包更好。
- **輕量但不耐拖**：Blue Ice Alpine Hauler（575 g）要附 Climbing 2026 的破洞警告；G7 Haul Pack 只有 2022 評測、目前缺貨。
- **大岩壁**：Metolius Half Dome 125 L（OGL 2024 最佳）；預算或一兩晚選 BD Wall Hauler 70（OGL Best Buy）；最大容量 El Cap 157 L 或 WH140。歐洲通路可看 CT Zenith 70–85 L、CAMP Supercargo 70（現況待確認）。

## 8. 缺口與未查證

- CAMP 官網規格 PDF 沒讀到（JS 殼）；Supercargo 是否仍在產未確認
- Fixe 全部 401，未讀
- Kailas 只有摘要；kailasclimb.com 是否原廠站未確認
- Edelrid 重量取自商品資料欄、G7 重量取自 Shopify weight 欄（可能是運送重量），文章要寫「官網商品資料」或改用評測數字
- BD Wall Hauler 125 停產是推定（轉址＋REI 清倉），BD 沒有公告
- Grivel Haul Bag（30／60／90 L）推定下架（官方網址轉分類頁、BananaFingers「Not available」）
- 小拖包（Mescalito、Express、KURT、CT、Grivel、Kong）沒有 2024+ 群測
- Petzl PORTAGE 官網頁沒打開
- 台灣通路只找到 Kong Genius II（預購、無價）
