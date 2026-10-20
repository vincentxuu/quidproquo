# 審稿紀錄：2026-10-19-climbing-travel-luggage（order 4 托運主袋與登機包）

- 檔案：`src/content/posts/climbing/2026-10-19-climbing-travel-luggage.md`、`-en.md`
- 日期：2026-10-19
- 研究依據：`.work/climbing-gear-travel/research-v2/parts/A-duffels.md`、`B-travel-packs.md`、`C-crag-packs.md`、`D1-multipitch.md`、`airline-rules.md`、`community-examples.md`；另補兩份研究（scratchpad `dims/duffel-dims.md` 裝備袋三邊尺寸、`bigpacks/big-packs.md` 55–75 L 大背包），本檔下方列出寫稿時採用的關鍵數字來源。
- 工具降級：Groundlane MCP 不在本 session（ToolSearch 無結果）、Groundlane 直接 HTTP 回 401 → Keenable 搜尋、curl／Shopify .js、Jina、Exa。

## post-verify

抽查關鍵事實（自己重新打開）：

| 主張 | 來源 | 結論 |
|---|---|---|
| NEMO Double Haul 55L US$169.95、有可收背帶 | nemoequipment.com .js（價格、description「Self-contained, low-profile backpack straps」） | ✅ |
| Arc'teryx Carrier 75 US$300 | arcteryx.com/us HTML `"price":300` | ✅ |
| Rab Expedition II 80L 74×36×33 cm、1.08 kg | rab.equipment/us HTML | ✅ |
| Metolius 四種拖包價格 189.95／219.95／279.95／299.95 | metoliusclimbing.com/products/haul-bag.js | ✅ |
| Rab Hyperon 65：82×37×46 cm、2.605 kg、只附防雨罩 | rab.equipment/us/rab-hyperon-65l-trekking-pack | ✅（研究檔沒有網址，寫稿時原本猜的網址 404，已改成正確頁面） |
| Deuter Duffel Pro 60／90 尺寸與重量 | deuter.com/us-en/duffel-pro-60/4046051167329、duffel-pro-90/4046051167367 | ❌→修正：研究檔的 p1712311／p1712338 網址 404；新頁面寫 60 L 1,300 g、30/66/32 cm（128 cm，原寫 130），90 L 1,500 g、34/80/40 cm（154 cm，原寫 152）。價格 US$165／US$195 未稅不變 |
| Climbing.com「split the rack—better to lose half than all of it」 | climbing.com/travel/flying-with-climbing-gear-faqs/（2025-10-14） | ✅ 逐字找到 |
| Climbing.com「~40L crag pack … draws, rope, harness, two or three pairs of shoes, and a small rack」 | climbing.com/skills/how-to-fly-with-a-crashpad/ | ✅ 逐字找到 |
| Switchback 2026 duffel 清單含 Alpaca、Transporter、Base Camp、Stonehauler、Black Hole；OGL 2026 含 Base Camp、Black Hole | Part A 原始抓取 sbt.md／ogl.md 關鍵字比對 | ✅ |
| 長榮托運 158 cm「包含腳輪和把手」、登機 56×36×23 或 115 cm、個人物品 40×30×10／80 cm；華航個人物品 40×30×15／85；ANA 55×40×25、個人物品 40×30×20；虎航 30 kg／203 cm／單邊 100 cm、登機 54×38×23 | airline-rules.md 原文摘錄 | ✅ |
| 社群實例數字（滾輪 7、duffel 6、拖包 1、岩場包當登機 8、Black Hole 3 例、Quarter Dome 約 20 趟、Creek 50 背帶被扯壞、MHW 比 Black Hole 耐用） | community-examples.md、order 3 正文 | ✅ |

刪掉的無來源句：「差 1 kg 就是一雙攀岩鞋加一個確保器」「兩人同行常見做法」（改成引 Climbing.com 建議）、「軟包塞半滿比較容易過」「量框量的是實際尺寸」（改成中性描述）、「14 條快扣＋繩＋衣物 13–14 kg」（order 3 的 13–14 kg 是繩＋衣物，不含快扣，已改正）、「60–80 L 裝得下」（改成「表上 60–80 L 每款都在 158 cm 內」，由表格支撐）。

排除不寫成現行款：Mystery Ranch Mission Duffel（官網 Page not found）、Salewa Dry Back 60（缺貨＋深度折扣）、Fish Products（目錄頁無購物訊號）、Mammut Cargon、BD Stonehauler Pro 45、Arc'teryx Carrier 55／80（前一代，文中只提醒二手市場）、Gregory Tetrad 60（官網 410）、Lowe Alpine AT Voyager（404）、Deuter Traveller（只剩出清，文中帶一句後繼款）、Patagonia Black Hole Wheeled 70（查不到官方價格，不列）。Thule 依品牌規則不收。

保留但標註：BD Stonehauler 65／95 三邊尺寸「原廠未標」；BD Mission 130 與 Wall Hauler 70 尺寸用 REI 商品頁（表前說明）；TNF Base Camp Voyager 重量與尺寸是 REI 標示；Osprey Farpoint 40 價格是 F22 舊版缺貨價，標「換代中」；Mission Rover 45、TNF Base Camp Duffel Roller 標缺貨；Gregory Alpaca 80 官網重量疑似抄 60 的數字，留「—」。

評測：只列 2020 後。The Broke Backpacker 的 Farpoint Trek 評測原文 2019 首發、2026-04 更新，標「2026-04 更新」；Adventure Pending 與 Live for the Outdoors 標前一代／女款。

## post-review

- 機械檢查：`pnpm check:references` 0 error（本檔只有一條 WARN：參考資料與標題關鍵詞重疊低，屬啟發式，參考資料以評測與航司頁為主，型號官方頁在表內 inline）；`pnpm check:tw` 0 blocking；`check-process-leak` 中英皆通過。`pnpm check:links`：Deuter Duffel Pro 兩條 404 已修；ANA 逾時、Osprey／TNF／MHW／Decathlon／長榮 403 為擋機器人，研究時已用 Jina／Exa 讀過。
- frontmatter：category climbing、tags 沿用既有 `climbing, climbing-gear, travel, outdoor-climbing, sport-climbing`（與 order 2 一致），series 中文「出國攀岩裝備」、英文「Climbing Travel Gear」order 4，與 `src/utils/series.ts` 一致。
- 結構對照範圍卡：三類主袋各適合哪種行程（表＋mermaid）→ 158 cm／23 kg → 三類現行款比較（裝備袋分軟袋／拖包／滾輪；大背包；旅行背包）→ 登機包兼岩場包的三條件＋多繩距包當個人物品 → 組合範例與出發前動作。讀完能依交通方式選主袋＋登機包，符合範圍卡。
- 系列不重疊：實例只引用數字並連 order 3；航司規定只引用尺寸重量並連 order 2；岩場包、多繩距包型號比較交給 order 5、6（只用 4 款岩場包的空重／尺寸說明登機條件）；繩長、租借連 order 1。沒有寫鞋、吊帶、確保器怎麼挑。
- 品牌：16 個攀岩／戶外品牌（Patagonia、The North Face、Black Diamond、Mammut、Osprey、Gregory、Rab、Deuter、Petzl、NEMO、Mountain Hardwear、Arc'teryx、Metolius、Lowe Alpine、Decathlon Forclaz、Mystery Ranch），無都市旅行品牌。
- 內文連結：每個型號第一次出現都連官方頁；站內連 order 1、2、3、5、6 中英版。
- 修正：原稿 `上一篇的實例` 段把「岩場包當登機約 8 例」和三類主袋統計混在一句，拆開，岩場包數字移到登機包節。

## post-polish

- `register-scan.sh`：長句 3 句（>60 字）→ 全部斷句；但書 0%；引述 0；模板化轉折 0；一般英文術語 0；姓名當主詞 0。
- 數字密度：8 段命中「單段 ≥4 個數字」。表前說明與挑選重點的數字是讀者比較用的尺寸、重量，保留；把「二手市場前一代型號」段的型號容量串（原 10 個數字）縮成系列名稱。
- `scan-ledger.sh`：無命中。
- 可執行動作：結尾給「裝好、捲尺量三邊、行李秤秤重，超過就換小一號或把繩移給同伴、登機超重先移衣服」。
- 範圍：bounded，未刪段落；中文正文（不含表格）約 2,150 字。
- 英文版：照中文定稿改寫，中文來源標 (in Chinese)、法文評測標 (in French)，站內連結全換成 `-en`。
