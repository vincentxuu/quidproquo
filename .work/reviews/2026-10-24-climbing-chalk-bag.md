# 審稿紀錄：2026-10-24-climbing-chalk-bag（攀岩裝備 order 2，獨立審稿）

檔案：`src/content/posts/climbing/2026-10-24-climbing-chalk-bag.md`、`-en.md`
日期：2026-10-24
審稿者：獨立 reviewer（未參與寫稿），依 `.work/climbing-gear-models/review-brief.md`。
研究線索：`.work/climbing-gear-models/R-chalk-bag.md`、`tmp-chalk/`（字幕、說明欄）。研究檔只當線索，下表每條都重開原始來源。

工具降級（toolDegradation）：Groundlane MCP `web_fetch` 回 `MCP server "claude.ai Groundlane" is not connected`（試一次即降級）→ Groundlane 直接 HTTP（POST /mcp）回 401 → Keenable keyless 只用於搜尋 HANCHOR 舊評測（成功）→ 讀頁改用 curl（原廠 Shopify `.js`、Mammut 頁內 JSON、Petzl／Edelrid／Simond／Treeline／99Boulders／岩館頁 HTML 去標籤 grep）；REI 被 curl 擋（連線 000）→ Exa `web_fetch_exa` 讀全文；Carryology、Trailspace 也用 Exa。影片 metadata 用 `yt-dlp --cookies-from-browser chrome --print` 重抓 7 支（含只引用不嵌入的やむラジ），字幕用 tmp-chalk 既有 vtt／txt 逐段核對。

## post-verify

結論統計（下列 40 列）：Confirmed 36／Outdated 0／Unverifiable 1／Contradicted 3（Caleb 贊助揭露位置、Grundkurs 免費提供揭露位置、Gym Basic 規格，皆已直接修）

### 原廠規格與價格（2026-10-24 重抓）

| 宣稱 | 來源 | 結論 |
|---|---|---|
| BD Mojo 75 g、US$23.95、S/M 與 M/L、圓筒形、鐵絲邊可捏形 | BD 產品頁＋`.js` | ✅ |
| Mojo Zip US$29.95 | BD `.js` | ✅ |
| BD Mondo 177 g、US$34.95、磁扣、兩個拉鍊口袋；Mondito 170 g、US$24.95、沒有磁扣 | BD 產品頁＋`.js` | ✅ |
| Mammut Crag 57 g、原價 US$19.95、多數顏色特價（15.95／18.80）、斜切加強袋口 | Mammut US 頁內 JSON（originalPrice 19.95，discounted true） | ✅ |
| Mammut Gym Basic 47 g、US$25、袋口不塌、絨毛內襯 | Mammut US | ✅；原稿「厚絨毛內襯，抽繩腰帶」→ 原廠是 fleece lining（沒說厚）、drawstring closure＋可調腰帶，**已改**（見直接修改 3） |
| Mammut Alpine 140 g、US$49.95、2 拉鍊袋＋1 網袋、腰帶扣雙重鎖 | Mammut US（"double-closure system on the belt buckle"） | ✅ |
| Petzl BANDI 75 g、US$26.95、硬邊口、內襯縫在袋底 | Petzl US | ✅ |
| BANDI「兩個刷子插槽」 | Petzl 寫 "Double textile brush slot"；99Boulders "a few brush slots" | ✅（兩來源合讀成立，單看 Petzl 可讀成「雙層布插槽」） |
| Petzl SAKAB 205 g、US$54.95、磁吸捲口、半硬側邊與底座、兩個提把 | Petzl US | ✅ |
| SAKAB 提把「一長一短」 | Petzl 只寫 two handles（提著走、掛在手的高度）；影片未提 | 🟡 Unverifiable（列需要人判斷） |
| Organic Large US$29.00、4 oz、1200D Cordura、Mini–XL 四種、XL 直徑 5.5 吋 | Organic 產品頁（尺寸表：XL 8"–5.5"–17.27"，周長換算吻合） | ✅ |
| HANCHOR HULA NT$1,190、120 g、CORDURA 420D、360 度粉襪、台灣專利（M460553、M472541）、不用找粉球／比粉球好補／粉不會飄到確保者眼睛 | hanchor.com HULA 頁 | ✅ |
| HULA「只有 2014 年的評測」 | Keenable 搜尋＋Exa 讀 Carryology（2014-07-04）、Trailspace（2014-05-05，評者標 BRAND REP，Hula 7/10） | ✅ |
| Simond Vertika £12.99 英國建議售價、摔落或打翻少掉 55% 的粉、重量原廠沒寫 | simond.com en-GB | ✅ |
| Edelrid Herkules €32.00、深 21 cm（Depth 210 mm）、重量原廠沒寫 | Edelrid EU | ✅ |
| Herkules「魔鬼氈收口、5 個刷子插槽」 | 原廠寫 roll closure、various brush holders；影片 11:40 Klettverschluss、12:20「gleich fünf Stück」 | ✅（影片來源） |
| 原岩萬華租粉袋 NT$80 | tupclimbing.tw/pricing/84（粉袋 $80，內含碳酸鎂粉） | ✅ |
| 登山補給站有上架 Gym Basic | keepon 商品頁（$790／$750，按鈕為「貨到通知」） | ✅ 有上架；但當天這個顏色顯示缺貨，列需要人判斷 |

### 評測與文章

| 宣稱 | 來源 | 結論 |
|---|---|---|
| 99Boulders：粉袋最有用在繩攀、可單手在牆上補粉 | 99Boulders（Willis Kuelthau，2022-09-14；頁面標題 2026） | ✅ |
| 99Boulders：Crag 第二名、尺寸剛好、爬時會忘了它、束扣硬單手難用、錐形比 BANDI 好用 | 同上 | ✅ |
| 99Boulders：BANDI 抽繩位置好單手開、沒口袋、手大不友善 | 同上 | ✅ |
| 99Boulders：Static 袋口會塌、Metolius Competition 邊不夠硬 | 同上 | ✅ |
| 99Boulders：Ion 第一名、收口最緊（poof test）、機關難開、最貴 | 同上 | ✅ |
| 99Boulders 轉述 BD：溫水＋不含清潔劑的肥皂 | 同上 | ✅ |
| Treeline：Mojo 最划算、收口可以更好；Organic 最耐用、偏窄手大會卡；Alpine 多繩距最佳、鎖扣腰帶、兩口袋都放不下手機；Static 帆布會塌；非攀登鉤環不上吊帶；cordelette 當腰帶；散粉要緊收口；手大要寬袋握粉球；一年洗 2–3 次、先倒粉、單獨洗；2026-04-09 更新 | Treeline Review | ✅ |
| REI：三種大小、粉桶適合團體抱石、圓筒適合長路線、錐形適合短運動攀登、硬邊、絨毛內襯、束扣防漏、腰帶可左右滑或改扣吊帶當備用鉤環、散粉／粉球／液態粉優缺點 | REI Expert Advice（Exa） | ✅ |
| BD Gear Myths：掛拖曳環＋鉤環多出約 6.5 吋、陡壁會晃、腰帶可左右滑、配件鉤環別混攀登器材 | BD 部落格 | ✅ |
| Cove 2024-01-01 起禁散粉，粉要裝在粉球／粉彈／粉襪，液態粉可用 | Cove 頁 | ✅；中文原只寫「粉球、粉襪」，英文有 bomb，已補齊（直接修改 4） |
| BlocHaus 只准液態粉與粉球 | BlocHaus Haus Rules | ✅ |
| Whistler Core 不准粉球與散粉，只准液態粉 | Whistler Core rules | ✅ |
| IndiRock：手在袋口上方抹、不要拍手 | IndiRock Part 2 | ✅ |
| 原岩萬華、爬森守則沒寫粉的規定 | 兩頁全文 grep「粉／鎂／止滑」0 命中（頁面本體有載入） | ✅ |

### 影片（URL／標題／頻道／日期以 yt-dlp 重抓；內容對字幕）

| 影片 | 核對 | 結論 |
|---|---|---|
| C1geX1ksOCw Send Edition（2020-09-18）start 40 | 0:40 開始講粉袋優缺點；1:00–1:40 往後摔粉會倒、爬前先收口；3:40 起粉桶、兩手一起、手懸桶上省粉；5:20 陌生人小孩伸手；3:00 刷子插槽大小不合；講者自稱 Sarah；說明欄無贊助，有教練課程與推薦裝備頁 | ✅ |
| exLiITQRIdo Caleb J. Ross（2026-06-21）start 100 | 1:20 個人喜好；1:40 起第一個問題（岩館禁不禁散粉）；2:00 用粉球就買粉袋；3:20 第二個問題、3:40–3:50 繩攀者幾乎一定要粉袋；5:06–8:45 隨身包 | 🔴 原稿「說明欄寫…不是贊助商」：說明欄只有 Chalkd 連結，「Not a sponsor」是 8:20 口頭說的 → **已改**；「3:20 起講上攀…」改寫成 3:20 第二個問題（直接修改 1） |
| xydOpfK0Dfk Grundkurs Bouldern（2023-03-29）start 360 | 6:00 SAKAB 磁扣好開關緊、小巧；8:20 缺點、8:40 口袋小手機勉強；11:20 起 Herkules；12:00 手到手肘、zu tief；12:20 五個刷子插槽；14:20 裝多會倒 | 🔴 原稿「說明欄寫明 Bergzeit 免費提供」：說明欄只有聯盟連結註記，免費提供是 0:20 口頭說的 → **已改**（直接修改 2） |
| ggHKVUp_wEQ jim（2025-04-11）start 40 | 0:40 開始介紹 Mondito；2:00 Mondo 磁扣自己闔上；3:40 自購價 $30／$20；4:00 Mondito 捲好仍漏粉；說明欄 "Not sponsored by black diamond" | ✅ |
| VK3jOfM6Dzs EpicTV Climbing Daily（2021-06-11）start 120 | 1:00 CAMP 寄粉、之後拍 sponsored video；2:00 起粉袋與粉球；5:00–6:00 粉桶、抱石偏粗粉、超細粉會噴；說明欄有「All EpicTV climbing chalk」商店連結 | ✅ |
| cgX5yQR03QE rayne's cøsmøs（2022-02-03）start 240 | 4:00「下一個…粉袋」；4:20 岩館可租；4:40 有些岩館免費粉；5:00 抹完粉才上牆、帶子纏起來；5:20 BD 袋；5:40 不推薦可回填粉球（束口漏）；說明欄只有商品連結 | ✅ |
| 6_BCSvyv_4w やむラジ（2026-04-03，只引用） | 12:20「內側有毛氈，放夾鏈袋就沒意義」 | ✅ |

標題與頻道：7 支都與 yt-dlp 一致（rayne 與やむラジ文中用縮短標題，參考資料列完整日期）。

### 直接修改（中英同步）

1. Caleb J. Ross 段：「說明欄寫影片裡的手工粉袋品牌不是贊助商」→「8:20 他推薦一個手工粉袋品牌時，口頭說明不是贊助商」；「3:20 起講上攀的人幾乎一定要粉袋」→「3:20 起是第二個問題：要不要在牆上補粉？上攀的人幾乎一定要粉袋」（同時拆掉 62 字長句）。
2. Grundkurs Bouldern 段：「說明欄寫明三款是 Bergzeit 免費提供，商品連結是聯盟連結」→「影片開頭說三款是 Bergzeit 免費提供；說明欄註明商品連結是聯盟連結」。
3. Mammut Gym Basic 表格：「厚絨毛內襯，抽繩腰帶」→「絨毛內襯，抽繩收口，可調腰帶」（英文 "thick fleece lining, drawcord belt" 同改）。
4. Cove 規定：中文補「粉彈（chalk bomb）」，與原文及英文版一致。
5. rayne's cøsmøs 段：70 字長句在分號處斷成兩句（中英）。

## post-review

- frontmatter：title／description／tldr 齊；type guide；series 攀岩裝備／Climbing Gear order 2（符合 plan.md）；tags 皆既有（bouldering 站上已有 108 篇使用）。✅
- tldr 與內文一致（三個判準、BD vs REI、國外岩館、入門款價格與表格一致）。✅
- 結構：開頭兩段（是什麼／這篇回答什麼／連 conditions-friction、skin-care）→ 兩條路 → 五個判準（每節都有「今晚就能做的事」）→ 用粉方式與岩館規定 → 兩張型號表 → 6 支影片（每支有看點、mm:ss 與 `start:` 一致、揭露）→ 三種情境 → 檢查與汰換（連 order 12）→ 練習題 3 題（details）→ 下一步（order 3 吊帶）→ 參考資料。✅
- 站內連結：conditions-friction、skin-care、inspection-retirement、climbing-harness 中英檔皆存在；英文版全用 `-en`；`check:references` 對本篇 0 錯。✅
- 中英對應：型號、價格、重量、影片、起播秒數、連結一致。差異只剩英文 rayne 段多一句 "in Chinese with uploaded subtitles"（無害，保留）。
- `check:tw` 0 blocking、0 to review。
- 小建議（未改）：開頭說「通常和攀岩鞋同一批買」，可順手連上一篇 order 1〈攀岩鞋〉；目前全文沒有回連上一篇。

### 需要人判斷

- HANCHOR HULA：唯一找到的評測是 2014 年 Trailspace（評者是品牌代表，Hula 7/10，說「實際用起來不如預期，概念比較適合粉桶」）和 Carryology；表格只寫「只有 2014 年的評測」，沒寫評測說了什麼。要留的話，建議把 Trailspace 的保留意見寫進「評測怎麼說」；或照 review-todo 拿掉（review-todo 已列，這裡補上評測內容供判斷）。
- Mammut Gym Basic 在登山補給站這一頁（鮮橙色）當天按鈕是「貨到通知」，等於現在買不到；文中兩處寫「想在台灣直接買／門市直接買」可能誤導，要不要改成「有上架，現貨先問」。
- SAKAB「兩個提把一長一短」：原廠只寫兩個提把（提著走、掛在手的高度），長短沒有來源；改成原廠說法或刪「一長一短」。
- review-todo 的 Herkules「太深」：字幕 12:00 講者原話就有「ein bisschen zu groß und zu tief」（有點太大、太深），現稿「很深，手要伸到手肘」有來源，可結案。

## post-polish

- `register-scan.sh`（修後）：長句 3 句（68／65／61 字：Sarah 段、BD Gear Myths 段、文字評測開頭），都在可讀範圍，可再斷但不急；但書 6%；引述 0；研究者姓名當主詞 0；模板化轉折 0；英文術語 0。
- 數字密度 4–5 的 8 段，有 6 段是影片段的時間碼（mm:ss 是讀者要用的跳轉點，保留）；開頭段（NT$80＋查價日）與文字評測段（年份）各 4 個，屬日期註記，不拆。
- 語氣：短句、第二人稱、每節有動作，讀起來順；「今晚就能做的事」每節都有具體動作，符合範本。
