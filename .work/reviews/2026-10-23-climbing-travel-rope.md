# 審稿紀錄：2026-10-23-climbing-travel-rope（出國攀岩裝備 order 2，2026-10-23 新增）

檔案：`src/content/posts/climbing/2026-10-23-climbing-travel-rope.md`、`-en.md`
日期：2026-10-23
緣起：使用者問系列頁為什麼沒有繩子型號，指出「出國考量的跟在台灣的不太一樣」，同意在出國系列加一篇。「攀岩裝備」系列不推薦型號的規則不變。
來源：`.work/climbing-gear-travel/research-v2/parts/R-rope-brief.md`（研究規格）、`R-rope-A.md`（Petzl／BD／Mammut／Sterling 16 款）、`R-rope-B.md`（Beal／Edelrid／Edelweiss／Tendon／Singing Rock 19 款）、`R-rope-C.md`（評測彙整、Maxim／BlueWater／Kailas／Fixe、判準原廠依據）、`R-rope-D.md`（評測得獎補充 6 款）。

工具降級（toolDegradation）：subagent 以 Groundlane MCP 搜尋與讀頁為主；GearJunkie、UKClimbing 個別頁 Groundlane 只抽到側欄 → Exa web_fetch 讀全文；原廠價格與庫存另用 curl 讀 Shopify／BigCommerce／WooCommerce 變體資料（不在鏈上，研究檔有記錄）。主 session 抽查用 curl＋去標籤 grep，UKClimbing、GearJunkie 用 Exa。

## post-verify

主 session 2026-10-23 親自重開核對：

| 宣稱 | 來源 | 結論 |
|---|---|---|
| VOLTA 55 g/m、外皮 42%、有 80 m | Petzl US 產品頁 | ✅ |
| ARIAL 58 g/m、外皮 40% | Petzl US 產品頁 | ✅ |
| BD 9.4 Dry 80 m USD 319.95、70 m 309.95、Sheath Mass 38% | BD 產品頁 | ✅ |
| Mammut 9.5 Crag Dry 60 g/m | Mammut US | ✅ |
| Sterling 非雙色款 60 m 以上才有中點、有 80 m | Sterling Velocity 頁 | ✅ |
| Joker 52 g/m、外皮 35%、80 m EUR 313.51 | Beal 產品頁 | ✅ |
| Swift 48 Eco Dry 外皮 41%、54 g/m | Edelrid EU | ✅ |
| Tendon Master 9.4 58 g/m | mytendon.com | ✅ |
| Singing Rock Icon 9.3 DRY 57.6 g/m | singingrock.com | ✅ |
| BlueWater Xenon 外皮 33%、80 m 有 | BlueWater 產品頁 | ✅ |
| OGL：Joker「don't recommend … day-in, day-out cragging」 | OGL Joker 評測 | ✅ |
| Climbing.com：9.4 mm 以上一般較耐用；外皮比例是指標但紗線數、編織也有影響；Xenon 在砂岩＋內華達石灰岩，繩尾約 10 ft 輕微起毛；BD 9.4 Dry 最佳傳攀、外皮 grippy 下放較慢；Fixe 中點會褪色 | Climbing.com 2026 | ✅ |
| Switchback：Crag Dry 最佳綜合、Swift Eco Dry 最佳紅點、Velocity 最佳岩場主力、Alpine Core Protect 最佳抗切割、Lightning Pro floppy／非雙色無中點 | Switchback 2026 | ✅ |
| OGL：We Care Classic Best Budget、VR9 Best Workhorse、Opera Best Ultralight Alpine、Joker Best Multi-Pitch、某款中點標記很快磨掉 | OGL 2026 總表 | ✅ |
| OGL：Aero「major downside … limited durability」；IonR「favorite bi-pattern rope」 | OGL 個別評測 | ✅ |
| GearJunkie：Alpine Core Protect 最佳綜合、We Care 最佳預算、Arial 最佳運攀、TC DT 9.6 最佳主力、Siskin 最佳高山 | GearJunkie 2026（Exa） | ✅ |
| UKC Siskin：選 80 m 爬歐陸長路線；繩伴遇特別粗糙岩石改帶粗繩；西班牙時繩伴的 Eddy 不支援 8.6 mm；GriGri 接近 8.5 mm 下限 | UKC 2025（Exa） | ✅ |
| UKC Swift Protect：旅行時在單繩與雙繩技術之間切換很方便 | UKC 2020（Exa） | ✅ |
| CGR TC DT 9.6：新繩很滑，約一個月後趨緩 | CGR 2023 | ✅ |
| Climbing.com Tendon Master 9.4：約兩個月 regular use 後開始剪繩尾 | Climbing.com 2021 | ✅；初稿寫「重度使用」，已改「經常使用」 |
| 其餘原廠規格、價格、Petzl／Edelrid／Mammut／UIAA／Sterling 判準依據 | R-rope-A～D | 未逐筆重開，沿用研究檔（研究檔逐條附 URL） |

初稿修正：tldr 與正文把 Tendon Ambition（5.12 kg）寫成 80 m 最重，實際最重是 BlueWater Lightning Pro（5.15 kg）；Swift 48 與 VOLTA 同時被寫成「細繩外皮比例最高」，改成只有 VOLTA；We Care Classic 42% 與 VOLTA、Booster III 並列；「歐洲零售常見」（Fixe）、「預算有限」（Tendon 8.6）、「回來要洗繩」無來源，刪改；運攀推薦清單原含外皮 35% 的 Velocity，與「外皮接近 40%」條件衝突，換成 Heron Eco Dry。
主 session 對使用者的先前說法更正：三重認證不能取代第二條繩，正文第 6 節明寫。

## post-review

- 範圍：只寫出國才放大的判準（重量換算、80 m、耐磨、中點／雙色、確保器、三重認證）；繩端標示、EN 892、確保器分類連 climbing-gear order 3；各目的地繩長、第二條繩時機、旅途保養連 order 1；行李規定連 order 3。✅
- 型號表：12 品牌 32 款，比照岩場包格式（連原廠頁、2020 後評測、適合誰／缺點）；價格標日期與幣別、原廠未標價改列零售店；Kailas 排除理由寫明。✅
- 結構（guide）：情境 → 要不要帶 → 六個判準（各有一個今晚能做的動作或連結）→ 三段型號表 → 三種行程 → 四步驟 → 下一篇。✅
- 系列回填：order 2–6 改為 3–7（10 檔 frontmatter）；導讀中英「第 N 篇」、閱讀路線、tldr、參考資料補新篇；order 1 中英「粗細」段與結尾加連結；order 3（flying）中英開頭「上一篇」改指名篇名；`series.ts` 描述加「挑哪一條繩」；規劃表加 order 2 與範圍卡、後續 order 與前置順延。
- `check:tw` 0 blocking；`check-post-quality` 只有 tag `multi-pitch` 對應詞警告（中文寫「多繩距」，保留）；`check-series-order`、`check-lang-parity`、`check-process-leak` 無錯；`check-external-links` 59 條 0 壞，GearJunkie 3 條 403（擋機器人，Exa 讀得到）。

## post-polish

- `register-scan.sh`：初稿長句 3 句（81／64／65 字）全部斷開；但書 11%；引述區塊 0；模板化轉折 0；英文術語 0。數字密集段：重量比較、繩長縮短、確保器繩徑、表格說明，都是讀者要用的門檻，保留；繩長段拆成兩段。
- `scan-ledger.sh`：0 命中。`check:tw` 抓到「抓手」，改「外皮摩擦大」。
- 英文版：與中文同步斷句；站內連結用各篇實際英文標題；series name 用 "Climbing Travel Gear"。
