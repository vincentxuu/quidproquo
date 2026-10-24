# 審稿紀錄：2026-10-24-climbing-cams（攀岩裝備 order 11，2026-10-24 新增）

檔案：`src/content/posts/climbing/2026-10-24-climbing-cams.md`、`-en.md`
日期：2026-10-24
審稿：獨立審稿（未參與寫稿），依 `.work/climbing-gear-models/review-brief.md`。
研究檔 `.work/climbing-gear-models/R-cams.md` 只當線索；以下每條都重開原始來源。

工具降級（toolDegradation）：Groundlane MCP 本 session 未連線（`MCP server "claude.ai Groundlane" is not connected`）→ 改用 Exa `web_fetch_exa` 讀全文（TOCC、Mountain Project、BD 部落格與產品頁、DMM、Metolius、WC、Totem、OGL、Alpinist、艾格、百合搖滾、nobodyclimb）；價格另用 curl 讀 Shopify `.js` 變體（BD、DMM UK／US、Metolius、Trango）與 Totem WooCommerce 頁的 JSON-LD。影片字幕用 `.work/climbing-gear-models/tmp-trad/subs/*.vtt`（yt-dlp 自動字幕）逐段比對起播時間，說明欄用 `tmp-trad/desc/`，標題／頻道／日期用 `tmp-trad/meta.txt`。

## post-verify

結論：Confirmed 45、Outdated 0、Unverifiable 2、Contradicted 2（已修）。另有 7 處起播／時間碼偏早 7–18 秒，已修。

### 文字來源

| 宣稱 | 來源 | 結論 |
|---|---|---|
| TOCC 預算版：Z4 .2＋C4 .3–#2 共 7 顆，再配一套岩楔，涵蓋龍洞大多數傳攀路線；超過手掌寬的日後再補 | TOCC〈如何打造第一套傳攀裝備〉「裝備採購」段（原文岩楔指名 DMM Wallnuts 1–11） | ✅ review-todo 練習題 2 那條已是 TOCC 配置，不必再改 |
| TOCC 完整版：Z4 #0–.75＋C4 .3–#3 共 14 顆；龍洞最常用 1–8 cm；.3–.75 重疊 | TOCC「活動岩楔」段 | ✅ |
| TOCC：混搭品牌和繩伴溝通不易 | TOCC | ✅ |
| TOCC：建議雙軸；C4 全開仍保有標定強度 | TOCC | ✅ |
| TOCC：BD 實惠耐用；軸心、拉桿鋼絲易氧化生鏽但不影響強度；DMM、WC 金屬件不易氧化；壽命 10–20 年 | TOCC | ✅ |
| TOCC：Totem 性能最優，但通路少、尺寸不完整、新手可能過度信賴，列進階 | TOCC | ✅ |
| TOCC：去 Yosemite、Indian Creek 或想爬寬裂隙才考慮大號 | TOCC（原文「亦可…納入考量」，文中「才需要」略強，可接受） | ✅ |
| MP：多數路線一套到 3 吋；全爬要兩套、很小到 4 吋；每趟回來清器材，放衣櫃一個月可能卡住 | Mountain Project 龍洞頁 | ✅ |
| BD：標準一套 .2 到 #3 各一顆 | BD〈How to Build Your First Trad Rack〉 | ✅ |
| 艾格課程清單 C4 .4–#3 | 艾格產品頁裝備清單 | ✅ |
| nobodyclimb 德芙蘭「single rack to #2」 | nobodyclimb 岩場頁路線資料由前端載入，curl／Exa 都抓不到路線保護欄 | 🟡 Unverifiable（本 session） |
| C4：.3–#8、#1 124 g、.3–.75 US$89.95、#3 US$104.95 | BD 產品頁＋Shopify 變體 | ✅ |
| Ultralight：比 C4 輕 15%、Dyneema 取代鋼索、#1 101 g、US$119.95–159.95；規格列 .4–#4，官網變體只有 #1–#4 | BD 產品頁＋Shopify 變體 | ✅ |
| Z4：#0–.75、43–93 g、US$99.95、Offset US$109.95、#0 和 .1 只標 5 kN | BD 產品頁＋Shopify 變體 | ✅ |
| C4 延伸扁帶版 .75–#3、新款 | BD 產品頁（標 NEW） | ✅ |
| Dragon：單桿雙軸、00–8、1 號 103 g 紫色、£86.50（00–1）–£130.50、美國站 US$113.49 起；DMM 說雙軸重疊多、可少帶 | DMM UK 產品頁規格表＋UK／US Shopify 變體 | ✅ |
| 號碼對照：Dragon 00 藍、0 銀、1 紫、2 綠、3 紅、4 金、5 藍 | DMM 規格表；Jonathan Ness 說明欄對照表 | ✅ |
| Dragonfly：1–6、最小 7.8 mm、£86.50 | DMM 產品頁＋Shopify | ✅ |
| Friend（2026）：0.3–4、1 號 120 g、US$99.95、Flow Cord 延伸 20 cm、芯鞘、紅色磨損指示、14 年（10＋4）、中空雙軸 | WC 美國產品頁 | ✅ |
| BD Camalot 和 WC Friend「顏色也對齊」 | WC 產品頁沒列顏色；未找到原廠對照 | 🟡 Unverifiable（OGL 只說 Zero Friend 與 Z4 同配色） |
| Zero Friend：0.1–0.75、延伸扁帶、US$89.95；配色對齊 Camalot | WC 產品頁；OGL「follow the exact same color scheme」 | ✅ |
| Totem：7 號 11.7–64.2 mm、69–144 g、€71.03 | Totem 產品頁（curl 2026-10-24：JSON-LD 與頁面價都是 71.03 EUR）；Exa 快取顯示 104,94€ | ✅（見需要人判斷） |
| Metolius：#00–#8、US$69.95–74.95、#4 紅 23.5–33.5 mm | Metolius 產品頁 range chart＋Shopify | ✅ |
| Metolius 表格「扳機鋼絲壞了要寄回原廠修」 | OGL：Metolius 是 kevlar trigger wires，壞了寄回 | 🔴 Contradicted → 已改「扳機線」 |
| Trango Flex Cam US$59.95–79.95 | Trango Shopify | ✅ |
| OGL（2025-04-04 更新，Andy Wellman）：C4 Best for Building Your Rack；最普及、借用合併方便；硬桿在水平和小號差，.5 以下多數人改買 Z4 等 | OGL Best Climbing Cams | ✅ |
| OGL：Z4 最好的小號；Ultralight BD 建議五年汰換；Metolius 小號最划算、全套最輕、自成配色；Totem 人工攀最好、有時難拆；Fixe Alien 水平與人工攀好、軟鋁磨損快 | OGL | ✅ |
| OGL：水平裂隙表現好的都有延伸扁帶 | OGL 文字段確實這樣寫，但評分表 Z4（無延伸扁帶）水平裂隙也是 9 分 | ✅（見需要人判斷） |
| Alpinist：Joshua Tree、Red Rocks 一季；新 cord 較耐磨、不卡 thumb loop；跟攀單手收回不易 | Alpinist 2026-05-23（Katie Griffith） | ✅ |

### 影片（URL、標題、頻道、日期對 meta.txt；起播對字幕；揭露對說明欄）

| 影片 | 核對 | 結論 |
|---|---|---|
| JB 2025 `JbS_Wd65pqg` start 685（11:25） | 11:25 開始 cam；C4 灰 .4 到藍 #3、工作用 Dragon、只有 DMM 換扁帶方便約 £15、WC 難換、Totem 寄西班牙；說明欄只有 coffee 打賞與 T 恤，全片無贊助字眼 | ✅ |
| JB 2022 `qrpDq9UrxOA` start 476（7:56） | 8:03 起介紹四款並揭露 Outside／Beta Designs 提供 WC 與 Totem；8:41 起 thumb loop／扁帶；扳機手感實際在 11:01 起（原寫 10:54）；12:00 起 Totem 兩片受力只限人工攀 | ✅，10:54 → 11:01 已修。說明欄有相機器材 Amazon 聯盟連結（與 cam 無關） |
| UKC `Tadx1NCOScU` start 226（3:46） | 3:46 還在講 torque nut 延伸扁帶，cam 段 3:56 起（章節 3:58）；半套分買、Dragon 1–4 紫到金；14:38 Dragonfly vs 小號 Dragon | ✅，start 226 → 236、文中 3:46 → 3:56 已修 |
| Ryan Tilley `XjwQMthwq5A` start 533（8:53） | 8:53 七顆 .3–#3；10:01 buddy up 成 double rack；11:06 先加倍 .5、.75、#1、#2；之後 micro 與 #4；3:23 起講嚮導用 cam、3:43 硬桿方便客人拆；說明欄只有 Patreon | ✅ |
| Jonathan Ness `G0E1fZsTowA` start 115（1:55） | 1:55 thumb loop 無所謂；2:47 Dragon 0 = C4 .4；3:00 延伸扁帶要扣有縫線那股；只在車庫練習裂隙放過；0:47 說在 Amazon 買；沒有提到贊助 | ✅，「沒有贊助」改「沒提到贊助」 |
| PsycAndrew `n52ab0LNF-Y` start 22（0:22） | 0:22 直接給結論 4.87 oz（=138 g）、US$255、七顆；3:28 #3 最差、#1 最好；說明欄只有來源連結 | ✅ |
| Ryan Tilley Totem `fQjOnsSUy60` start 309（5:09） | 5:09 起對照，紅 #1、綠 .75、紫 .5、黃 ≈ .4、藍 ≈ .3、最大橘 ≈ #2、無 #3；9:07 建議先 C4 或 Metolius；不能取代 offset 在 10:27（原寫 10:14）；1:49 店內點數、店家沒要求 | ✅，10:14 → 10:27 已修 |
| Grant `pvvq3aB8p0E` start 23（0:23） | US$40–50、HowNOT2 網店、沒有 kickback；1:28 2024 vs 2025（色點改 X、半環）；2:59 偏好 2024，3:22 #6 對 #6；5:16 起講弱點是「nylon wires, not steel」＋塑膠護線套 | 🔴 文中寫「扁帶和扳機鋼絲的塑膠套」（正文與檢查段兩處）與原話不合 → 改「扳機線（不是鋼索）和護線的塑膠套」。「原價 US$69.95」不是 Grant 說的，改「原廠定價」 |
| UKC First Look `oRfu5997lg8` start 111（1:51） | 章節 1:58 Friends、3:13 Camalots；1:51 仍是上一項（Edelrid）。magic cord 拉開不卡、size 4 鎖；BD SS2026 改扁帶、尼龍版仍保留 | ✅，start 111 → 118、文中 1:51 → 1:58、3:05 → 3:13 已修 |
| Valhalla `68S7R_3lfPI`（文中連結 t=21s） | #3 放不好 3 吋裂隙、多帶 #4 在 0:39–0:54 | ✅，t=21s → 39s、0:21 → 0:39 已修 |
| James Pearson `TMT-RUZyOQQ`（文中連結 t=388s） | 6:32 Pembrokeshire 雙到三套岩楔＋一套 cam、Indian Creek 幾乎全 cam；說明欄寫 Wild Country athlete、附 EpicTV 商店 WC 連結 | ✅ |
| G for GoOut `x7tc_HVuQ1k`（文中 0:44） | 0:44 講尺寸，延伸扁帶在 0:59 | ✅，0:44 → 0:59 已修 |

百合搖滾〈淺談傳攀裝備保養〉（2018-11-13，2022-10-20 更新）：濕布擦、每月八天約每 2–3 個月深度清潔、溫水泡洗刷關節、鐵氟龍或蠟類、不長期用 WD-40、不沾織品與 cam 片接觸面 → ✅。

歸因標籤：全篇「TOCC 說／OGL 寫」類歸因多，但每處都在交代該條判準的出處，屬於選購文必要；未建議刪。

## post-review

- frontmatter：title、date、category、type guide、series 攀岩裝備／Climbing Gear order 11、tags 皆既有 tag ✅；glossary 4 條，中英一致 ✅。
- tldr 與正文一致（C4 .3／.4–#3、TOCC 14／7 顆、Dragon 1 = .5、Dragon 3 = #1、138 g、龍洞生鏽）✅。
- 結構：開頭兩段（用途、這篇回答什麼、連〈傳攀保護怎麼放〉不重講原理）→ 五個判準（每節有「今晚就能做的事」）→ 號碼對照 → 七款表 → 微型 cam → 影片 10 支 → 依情境 → 檢查與汰換（連 order 12）＋龍洞保養 → 練習題 4 題 → 下一步 → 參考資料 ✅。技術沒有重講：放置、收縮、走位都只連出去；HowNOT2 在 BD 實驗室的三支影片明寫已嵌在技術文、不重複 ✅。
- 系列連結：上一篇 `/posts/climbing/2026-10-24-climbing-nuts`（order 10）、下一篇 `/posts/climbing/2026-10-19-climbing-gear-inspection-retirement`（order 12，「第 12 篇」）與 plan.md 一致 ✅；英文版全用 `-en` ✅。
- 英文站內連結文字原寫 "How to Place Trad Protection"，技術文實際英文標題是 "Placing Trad Protection…" → 三處改成 "Placing Trad Protection"。
- 中英對應：數字、型號、影片 ID、start、連結逐段對過，修正後仍一致；`check-lang-parity` OK。
- 驗證：`check:tw` 0 blocking；`check-post-quality` OK；`pnpm lint` 0；`check:references` 無 climbing-cams 相關錯誤；`check-series-order` 本篇無問題（另見：攀岩裝備 order 2、3 各重複一次，不在本篇範圍，疑為舊合併篇尚未刪）。

## post-polish

- `register-scan.sh`：初稿長句 3 句（67／63／71 字）、但書 8%、引述 0、模板轉折 0、英文術語 0、研究者姓名當主詞 1。
- 數字密集段：TOCC 完整版那條 11 個數字 → 拆成「組成＋共幾顆」與「最常用幾號各兩顆；1–8 cm」兩句（中英同步）。UKC First Look 段 71 字長句拆成三句（中英同步）。
- 修後長句剩 3 句：OGL 單軸段（67 字）、Ryan Totem 對照段（63 字，型號對照清單）、Grant 時間碼段（61 字）。三段都是讀者要逐項對照的內容，保留。
- 其餘數字密度 4–7 的段落（路線寫到 3 吋、Ultralight 省多少、Metolius 換算、Friend 壽命）都是讀者要用的門檻或規格，保留。

## 直接修改（中英同步，共 13 處）

1. UKC 第一套 rack：start 226 → 236、文中 3:46 → 3:56。
2. UKC First Look：start 111 → 118、1:51 → 1:58、3:05 → 3:13，長句拆三句。
3. Valhalla 連結 0:21／t=21s → 0:39／t=39s。
4. G for GoOut 0:44 → 0:59。
5. JB 2022 扳機手感 10:54 → 11:01。
6. Ryan Totem「不能取代 offset」10:14 → 10:27。
7. Jonathan Ness「沒有贊助」→「沒提到贊助」。
8. Metolius 表格「扳機鋼絲」→「扳機線」（英文原本就是 trigger-wire，未動）。
9. Grant 影片段 5:16：「扁帶和扳機鋼絲的塑膠套」→「扳機線（不是鋼索）和護線的塑膠套」。
10. 檢查段二手 cam 同上。
11. Grant「原價 US$69.95」→「原廠定價 US$69.95」（英文 list 不動）。
12. 英文版「How to Place Trad Protection」→「Placing Trad Protection」（3 處算 1 項）。
13. TOCC 完整版數字過密拆句。

## 需要人判斷

- Totem 價格：curl 讀到 €71.03（頁面標含稅），Exa 快取同一頁是 104,94€；可能依訪客地區顯示不同價。建議用瀏覽器確認，或在表格註明「官網顯示價可能依地區不同」。
- 「BD Camalot、Wild Country Friend 號碼相同、顏色也對齊」：號碼確認，顏色原廠頁沒列；Alpinist 另說 Friend 同號略大一點。可改成「號碼相同」，或補一個顏色來源。
- 「OGL 測到水平裂隙表現好的，都是有延伸扁帶的款式」：OGL 文字段這樣寫，但它的評分表 Z4（沒有延伸扁帶）水平裂隙也拿 9 分，和最高分同分。要不要縮成「OGL 說延伸扁帶讓水平裂隙更安全」。
- Ultralight 五年汰換：BD 產品頁沒寫，只有 OGL 轉述（文中已寫成「OGL 寫 BD 建議」），維持轉述或刪。
- review-todo 的 cams 三項：練習題 2 已改用 TOCC 7 顆配置 ✓；TOCC 預算配置已核對原文 ✓（原文岩楔是 DMM Wallnuts 1–11，文中寫「一套岩楔」）；Ultralight 五年見上。
