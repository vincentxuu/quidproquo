# 多繩距攀登包（order 6）v2 重寫審稿紀錄

2026-10-19 依 writer-brief 整份重寫中英兩檔（舊版 4 款，使用者嫌品牌少）。舊審稿內容已被本檔取代。

## post-verify

工具：Groundlane 直接 HTTP（POST /mcp tools/list）回空，Groundlane MCP 工具不存在 → 降級 Keenable 搜尋 + Jina reader + curl 官網 HTML/Shopify JSON（toolDegradation 記錄）。

抽查（2026-10-19 重新打開）：
- Petzl BUG：舊 URL 301 到新網址 `petzl.com/us/en/sport/products/climbing-packs-rope-bags/bug/...`；USD 109.95、18 L、665 g、腰帶可拆（另售替換腰帶）、頂部開口。研究檔記為「官方頁離線」，已更正並改用新網址。
- Blue Ice Wadi 15：Shopify JSON 價 USD 99.95；研究檔記美國站缺貨，文中保留「美國官網缺貨」。Dragonfly 18 USD 109.95、415/325 g 確認。
- Osprey Mutant 22：USD 140、22 L、三點式拖拉系統、水袋隔層確認。
- Rab Latok 28 USD 225；Edelrid Rubi EUR 70、498 g、haul loops；Ortovox Trad Zero 24 USD 130、570 g；Mammut Trion 15 USD 169.95、420 g；Hyperlite Summit 30 USD 210、官網 383 g 白／448 g 黑（取代研究檔的 Shopify grams）；Salewa Ortles Climb 25 GBP 130、605 g；Millet Prolighter 22 EUR 100、特價 EUR 75；Deuter Guide Lite 24 GBP 130、670 g；Gregory Alpinisto LT 28 GBP 150／特價 105；Arc'teryx Alpha FL 30 USD 280、665 g：全部官網頁確認。
- BD Rock Blitz 15／Blitz 20：沿用研究檔（同日 BD 官網），Switchback 頁面確認 840D、14.2 oz、頂部抽繩、側袋、可拆腰帶。
- 評測：Switchback 2026-06-23（Rock Blitz 15 最佳跟攀包、Alpha FL 30 最佳超輕高山包、Blitz 20 提及）；Climbing 2026-04-24 更新（Wadi 15 多繩距首選、不防水、偶爾拖拉可以但不當拖包、2 kN 鉤環；Dragonfly 18 雨天替代；Ascensionist 35L 兩個 haul loops；多繩距包 ≤25 L 定義）；Gripped 2026-03-31（BUG 頂開口、正面直立拉鍊、haul loop、「brilliant little carry-on」）；Climbing 2020-04-14 Deuter Guide Lite 24。引文逐字比對過。
- 社群：Mountain Project 2023-01-23「15 liter multipitch as my personal item」原文確認。
- 航空：長榮／華航／星宇 1 件 7 kg 56×36×23 + 個人物品，取自 airline-rules.md 官方來源。

排除（不當現行款推薦）：Patagonia Ascensionist 25L（疑停產）、Mammut Trion 18（疑停產）、Arc'teryx Alpha AR 20、Salewa Apex Climb、Lowe Alpine Alpine Ascent 25、Deuter Guide 30、Ortovox Trad 22 Dry、Rab Ascendor 28（未確認）、Grivel Rapido Evo 18（預購）、CAMP M20（無官方價）、Mystery Ranch（無 15–30 L 攀登包）。OutdoorGearLab 頁面本次未打開，不列。

修正：刪掉三處無來源的缺點描述（Hyperlite「裝重會變形」、Salewa「捲頂開關慢」、Osprey「外掛帶多」改成原廠事實）；「岩場包多在 30 L 以上」改為「容量大」。

## post-review

- 範圍卡對照：窄包型與轉頭抬手、頭盔與吊帶腰帶干涉、可拆腰帶、取水與外套、確保站掛包、拖拉只用原廠拖拉環、耐磨、容量 15–30 L 從水與衣物算，全部各有一節；14 個品牌 16 款分三個容量表（欄位：容量、空重、特色、官方價格含幣別與日期、2020 後評測、適合誰／缺點）；兩人一天分工（先鋒不背、跟攀背、換先鋒在確保站交包）；店內試背 9 項清單；兼當登機包一節連 order 2、order 4；繩子一句連 order 1；吊帶連 climbing-gear 系列。
- 不重疊：沒講吊帶、頭盔怎麼選；沒講航空規則細節（一句加連結）；沒講托運主袋。
- 結構：判準先行 → mermaid 決策流程 → 比較表 → 縮小範圍一段 → 分工 → 試背 → 登機。
- 機械：check:tw 0 blocking；check-process-leak 中英皆過；check:references 本篇唯一錯誤是英文版連到 order 4 英文版 `climbing-travel-luggage-en`（尚未寫好，系列內，可忽略）；中文版無錯。
- 中文正文約 2,830 漢字，英文約 3,100 字；23 個外部來源。

## post-polish

- register-scan 初輪：4 個長句（>60 字）全拆；耐磨段 7 個數字縮成 1 個型號＋文字比較。終輪長句 0、但書段落 2/35、引述區塊 0、模板化轉折 0、英文術語 0；phrase ledger 無命中。
- 剩下的數字密度段（容量判準、價格說明、縮小範圍、航空尺寸）是型號名與規格，留著讀者才能比對。
- 英文版：短句、主動語態，表格欄位與中文一致；長榮連結標 (in Chinese)。
