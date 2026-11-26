# 審稿紀錄：2026-10-24-prusik-cord（攀岩裝備 order 9，獨立審稿）

檔案：`src/content/posts/climbing/2026-10-24-prusik-cord.md`、`-en.md`
日期：2026-10-24
審稿者：獨立審稿 agent（沒有參與寫稿）。研究檔 `.work/prusik-cord/R-*.md` 只當線索，以下每條都重新打開原始來源。

工具降級（toolDegradation）：Groundlane MCP `web_fetch` 回「server is not connected」→ Groundlane 直接 HTTP 回 401（未授權）→ 原廠頁改用 curl＋去標籤 grep（Shopify `.json`、WooCommerce Store API 讀價格變體）；Decathlon 對 curl 回 403、firecrawl MCP 未連線 → Exa `web_fetch_exa` 讀到；找零售頁用 Keenable keyless 搜尋，再 curl／Exa 打開頁面確認。影片標題與頻道用 YouTube oEmbed 重查；字幕用研究目錄 `tmp-yt/subs/*.c20`（yt-dlp 自動字幕）與 `json/*.desc.txt`（說明欄）。

## post-verify

結果：Confirmed 41／Outdated 1／Unverifiable 0／Contradicted 6（含 2 條 Misframed，全部已直接修）。

### Contradicted／Misframed（已修）

| # | 原句 | 來源 | 處理 |
|---|---|---|---|
| C1 | 「比主繩細 2–3 mm」：「這條我們查不到原廠或協會的出處」 | AAC〈Know the Ropes: Lowering〉（2013，Mike Poborsky）：「As a general rule, a cord or cordelette needs to be 2–3mm smaller than the climbing rope」。系列內〈下放還是垂降〉〈自我救援入門〉也引這篇 | 改成「原廠都沒這樣寫；找得到的出處是 AAC 2013…寫成『一般規則』」，參考資料補這篇。tldr 只說「查不到原廠出處」，仍正確，未改 |
| C2 | Simond Autoblok「最便宜、30 g 最輕」 | Beal Jammy 原廠頁：35 cm 版 20 g；Edelrid Aramid 30 cm 22 g（EpicTV）；Edelrid 零售約 USD 12，比 GBP 12.99 低 | 改「便宜、30 g」 |
| C3 | Sterling 6 mm Auto Block「強度全表最低」 | BlueWater 6.5 mm Sewn Prusik 12.4 kN；VT 7 mm 端到端 2,500 lbf（約 11.1 kN），都比 12.5 kN 低 | 改「強度在表中偏低」 |
| C4 | Maxim Prusik Cord「USD 0.58／呎」（同列 g/m、強度寫 6 mm） | Shopify 變體：5 mm 0.58、6 mm 0.75、9 mm 1.40／呎 | 改「USD 0.58／呎起」 |
| C5 (Misframed) | HowNOT2「他自己說這是娛樂性質的測試，樣本很少」 | 字幕 [668]：「this is entertainment more than it is true science」，沒說樣本少 | 改「這比較像娛樂，不是嚴謹的科學」 |
| C6 (Misframed) | Petzl「繩結最多讓強度減半」 | Petzl CORD 說明書：「A knot can reduce the cord's initial strength by half.」 | 改「可能讓強度減半」 |

### Outdated

| 宣稱 | 來源 | 結論 |
|---|---|---|
| Edelrid Aramid Cord Sling「原廠沒標；零售約 USD 12–14」 | 研究檔的 Karst Sports USD 13.95 頁面現在 404；EpicTV US 定價 USD 12.08（缺貨） | 🟠 沒有一家可開、有庫存的零售頁。沒改，列入「需要人判斷」 |

### Confirmed

| 宣稱 | 來源 | 結論 |
|---|---|---|
| Petzl：1.5 m、6 mm；直徑要「sufficient difference」，沒給比例 | Petzl Tech Tip 頁 | ✅ |
| Petzl CORDS：說明書要求雙漁人結做普魯士繩環 | technical-notice-CORD-1.pdf | ✅ |
| Petzl CORDS 6 mm：24 g/m、10 kN、CE EN 564、只賣 120 m、尼龍 | Petzl 產品頁 | ✅ |
| Petzl 零售 USD 140.95／120 m | Karst Sports 頁（curl） | ✅（已補零售店名） |
| HollowBlock2：6.8 mm、100% Technora、中空編織、7 mm 以上、prusik／Klemheist、USD 29.99／30.99、14.0 kN、13.5／19 吋 | Sterling 產品頁 | ✅；長度原廠頁就有，已刪「零售頁」 |
| HollowBlock2 汰換：任一根紗斷、套內縫線磨損、塑膠套不在就不能用；曬三個月強度掉 50%；不可當唯一或主要連接點；2023-11-02 | Sterling Retirement Guidelines | ✅ |
| Beal Jammy：芳綸＋聚醯胺外皮、22 kN、EN 566:2017、35／50／60 cm、EUR 13.88／16.07／17.09 | Beal 產品頁＋Shopify 變體 | ✅ |
| Jammy 長度／圈數表（35 cm 3／2 圈；50 cm 5 圈／建議更長；60 cm 建議更短／6 圈／5 圈） | Beal 產品頁 | ✅ 逐格相符 |
| Beal 100% Dyneema 5 mm：熔點 145 °C、不可打 Prusik 類套結 | Beal 產品頁 | ✅；原文「約 140–145 °C」的 140 沒來源，改成「Beal 寫 145 °C」 |
| Beal Cordelette 6 mm：6.1 mm、22.8 g/m、8.2 kN、雙漁人結 11.5 kN、EN 564／UIAA、聚醯胺、5.5 m×10 GBP 80.27 | Beal UK 頁＋變體 | ✅ |
| BlueWater VT 7 mm：Technora 皮＋尼龍芯、8–9.5 mm、2,500 lbf、33″、USD 30.95；8 mm：8–13 mm、USD 32.95 | BlueWater 兩頁＋Store API | ✅（另有 8 mm 黑色 USD 37.95，未列） |
| BlueWater Sewn Prusik Loops：12.4／17.7／17.7 kN、11–68 吋、USD 16.14–22.06 | 三個繩徑頁＋Store API | ✅ |
| BlueWater 6 mm：6.1 mm、24.9 g/m、9.1 kN、CE／UIAA、30 ft 起、USD 15.95 起 | BlueWater 頁 | ✅ |
| BlueWater Dynamic Prusik：26.3 g/m 起、9.3–11.1 kN、只賣 60 m、USD 119.95 起、「hold higher loads before slippage」 | BlueWater 頁＋Store API | ✅ |
| Edelrid Aramid Cord Sling：22 kN、EN 566、30–120 cm、「Stiff」、30 cm 適合當普魯士環 | Edelrid 產品頁 | ✅ |
| Edelrid HMPE Cord Sling：聚酯外皮、30 cm 可當普魯士環 | Edelrid 產品頁 | ✅ |
| Edelrid PES CORD 6 mm：聚酯、30 g/m、9 kN、EN 564 | Edelrid 產品頁 | ✅ |
| PES 零售 EUR 14.36 起 | Bergfreunde 頁（curl） | ✅（已補零售店名） |
| Fixe Tou：聚醯胺外皮＋芳綸芯、22 kN、EN 566、Machard／Prusik、「Prusik … best suited for rigid or icy ropes」 | Fixe 產品頁 | ✅ |
| Fixe 長度原廠頁前後不一致 | 內文寫 30–180 cm，變體表只有 45／60／90／120 | ✅ |
| Fixe 零售 Bolas Sport EUR 13.95–15.95 | bolassportcuenca.com 產品頁 | ✅ |
| Simond Autoblok：GBP 12.99、30 g、2200 daN、EN 566:2017、「even the narrowest diameters」、外皮材質自相矛盾（標題寫 Polyester、內文寫 polyamide、成分寫 100% polyester） | Decathlon UK（Exa） | ✅ |
| Sterling 6 mm Auto Block：6 mm、13.5 吋、prusik／Klemheist、12.5 kN、USD 18.99 | Sterling 產品頁 | ✅ |
| Sterling 6 mm：尼龍、8.2 kN、EN 564、25′ 起、USD 19.99、「6–8 mm are great for prusiks」 | Sterling 產品頁 | ✅ |
| Sterling 7 mm：12.3 kN、EN 564、18′ 起、USD 22.99 | Sterling 產品頁 | ✅ |
| Sterling 5 mm 歸在 non-life-safety | Sterling 5 mm 頁 | ✅ |
| Mammut 5.0 Cord：綁背包、營繩 | Mammut 5.0 頁 | ✅ |
| Mammut 6.0 Cord 7 m：聚醯胺、22 g/m、7.5 kN、EN 564／UIAA、USD 17.95、「ideal for tying a prusik knot」 | Mammut 產品頁 | ✅ |
| Maxim 6 mm：尼龍、25.3 g/m、1,750 lbf（約 7.8 kN）、不是主繩認證 | Maxim 產品頁規格表 | ✅ |
| Singing Rock 6 mm：聚醯胺、23.2 g/m、9 kN、EN 564、100 m 卷 | Singing Rock 頁 | ✅ |
| Singing Rock 零售 EUR 117.04／100 m | fallprotection.cz 頁 | ✅（已補零售店名） |
| PowerCord：Technora 芯＋尼龍皮、定位是架固定點和拖吊 | Sterling 產品頁 | ✅ |
| Mountain Project：PowerCord 太硬不適合打套結 | MP 論壇串 | ✅ |
| DAV 2020：繩越細越可能咬不住；咬不住多纏一圈；Kevlar 芯的硬輔繩反應明顯較差；動態測試較硬較粗的失效好幾次；事故用的是「relativ steife 6-mm-Reepschnur」；30 cm 縫製 Dyneema 扁帶＋FB 交叉套結反應最好；亂纏的普魯士結強度「streut immens」 | DAV Panorama 4/2020 文章 | ✅ |
| AAC 2012 Rob Hess（UIAGM/IFMGA）：autoblock 繩環太長頂到垂降器會滑 | AAC publications 頁 | ✅ |
| Climbing.com 2019（AMGA 嚮導 Elaina Arenz）：40 吋 5 mm、戴頭盔能套過頭；尼龍受熱 glazing／熔化 | Climbing.com | ✅ |
| Alpinesavvy：30 cm Edelrid Aramid 打 autoblock 不好用 | Alpinesavvy 2021 | ✅ |
| 影片 gL0s9JdJIwE：標題、頻道 Dave Searle、2025-08-27；8:58（start 538）字幕正好講到 Jammy 60 cm 是 go-to；帶團帶兩條 [968–989]；6 mm 尼龍硬、咬繩不如 Jammy [700–721]；HB2 歐洲不好買、認證不同 [761]；Dyneema 太滑、不耐熱 [803–825]；細繩約主繩一半 [825]；35–40 cm 下限、最好不超過 60 cm [887–907]；說明欄推自己的課程與折扣碼，沒有器材贊助 | oEmbed＋字幕＋說明欄 | ✅ |
| 影片 R0YSxPKfk8g：標題、頻道 JB Mountain Skills、2023-09-17；4:55 Simond 縫製款 [295]；7:19（start 439）HollowBlock [439]；沒有外皮、磨損後強度掉快、要常換 [524–546]；貴的手感較好但看個人 [568–588] | oEmbed＋字幕 | ✅；說明欄有攝影器材 Amazon 聯盟連結，原文沒揭露 → 已補 |
| 影片 lmy6W30mXqU：標題、頻道 Climbing Clean、2024-03-03；3:54 HollowBlock 在較粗的繩咬得較好 [234]、VT 幾乎只在救援用 [257] | oEmbed＋字幕 | ✅；說明欄無贊助 → 已補一句 |
| 影片 0fdOn2futNc：標題、頻道 HowNOT2、2021-06-16；10.5 mm 動力繩 [24]；「general rule」細 3 mm [149–169]、說明欄「supposedly」；5 mm autoblock 3 圈 0.36 kN、4 圈 3.62 kN（10 倍）；9:43（start 583）開始測 Hollow Block，3 圈 0.42、4 圈 1.38 kN；舊樣品 [646] | oEmbed＋字幕＋說明欄 | ✅；說明欄有自家商店與 Rocky Talkie 折扣連結，原文沒揭露 → 已補 |
| 影片 Mzsunee0giI：標題、頻道 JB Mountain Skills、2022-09-27；1:50（start 110）講縫製款塑膠套兩側鼓起、外皮軟、芯很快露出；他的做法是剪短塑膠套 [110–153] | oEmbed＋字幕 | ✅ |

全篇歸因標籤（「原廠沒寫」「原廠說」類）多，但都是表格欄位定義，不算正文但書堆疊。

## post-review

- frontmatter：必填齊；type guide；series 攀岩裝備／Climbing Gear order 9，與 plan.md 相符；tags 5 個都是既有 tag。description 與 tldr 不重複。✅
- tldr 與正文：Petzl 1.5 m 6 mm、HB2 7 mm 以上、Jammy 7.3–10 mm、VT 7 mm 8–9.5 mm、Beal Dyneema 禁止、DAV 芳綸芯反應較差，都與正文一致。✅
- 結構：兩條路 → 四個判準（每節有「今晚就能做的事」）→ 縫製 8 款＋按米 10 款（共 18，與標題一致）→ 耐熱 tech cord 排除說明 → 5 支影片 → 三種情境 → 檢查與汰換（連 order 12）→ 3 題練習（details）→ 下一步（order 10 岩楔）→ 參考資料。符合 writer-brief。✅
- 站內連結：lower-or-rappel、self-rescue-basics、multi-pitch-basics、climbing-gear-inspection-retirement、climbing-nuts 中英檔都存在；英文版都帶 `-en`。`check:references` 對本篇 0 錯。✅
- 中英對應：表格 24 列對 24 列，數字、型號、影片、起播秒數一致；英文版多一句解釋龍洞，合理。本次修正兩邊同步。✅
- 影片：5 支都 2021 年後、都有字幕依據；`check-youtube-embeds` 只做 inventory（沒有 API key，未驗嵌入可播），oEmbed 五支都回 200。
- 系列一致性：本篇原說 2–3 mm 規則「查不到協會出處」，與〈下放還是垂降〉〈自我救援入門〉引 AAC 2013 互相矛盾 → 已依 AAC 原文改本篇。
- `check:tw`：0 blocking；1 個 WARN「打法」（「VT、Schwabisch 這類打法」，指繩結打法，口語可留）。

### 需要人判斷

1. Edelrid Aramid Cord Sling 的零售價「約 USD 12–14」沒有可開的來源（Karst 頁 404、EpicTV 缺貨 USD 12.08）：換一家有庫存的零售店並寫店名，或改成「原廠沒標」。
2. DAV 2020 拿來對照的「軟輔繩」原文是 Dyneema 芯（「weiche Reepschnüre (Dyneema-Kern)」），本文材質段說「第一條買尼龍」、又引 Dave Searle 不建議 Dyneema；要不要補這個細節由作者決定。
3. JB Mountain Skills 說 Simond 縫製款是 5.5 mm，Decathlon 頁寫 6 mm；表格照原廠寫 6 mm，看要不要加註。
4. BlueWater VT 8 mm 另有黑色款 USD 37.95，表格價格區間沒算進去；要不要列進去。
5. 練習題 1「7 mm 輔繩配 8.9 mm 主繩，直徑差約 2 mm」剛好落在 AAC 的 2–3 mm 規則內；答案說「可能咬不住」是合理提醒，但和改過的出處段落放在一起讀起來可能矛盾，看要不要換成直徑差更小的情境。

## post-polish

- `register-scan.sh`（修改後）：長句 0（原 2 句：Dave Searle 段 105 字、DAV 段 74 字，已在分號處斷成句號；英文版 DAV 句同步斷開）；但書 6／82 段（7%）；引述區塊 0；模板化轉折 0；英文術語 0。
- 數字密集段 8 段（VT 相容範圍、「細 2–3 mm 當起點」、Dyneema、普魯士繩環長度、縫製繩環長度、HowNOT2 圈數、EN 564 強度、5 mm）：都是讀者挑繩要用的門檻，保留。「圈數跟長度綁在一起」那段（8 個數字）可再拆，但拆了會讓 3 圈／4 圈的對照分開，暫留。
- 語氣：直接對讀者說話，沒有稽核 memo 腔；章節標題像台灣文章。台灣脈絡在開頭（岩友叫法）、龍洞情境、ZA 課程、登山用品店剪繩，足夠。

### 本次直接修改（中英同步）

1. 「2–3 mm」出處改為 AAC 2013〈Know the Ropes: Lowering〉的「一般規則」；參考資料補這篇。
2. Simond「最便宜、30 g 最輕」→「便宜、30 g」。
3. Sterling Auto Block「強度全表最低」→「強度在表中偏低」。
4. Maxim 價格「USD 0.58／呎」→「USD 0.58／呎起」。
5. HowNOT2「樣本很少」刪除，改成講者原話「比較像娛樂，不是嚴謹的科學」。
6. Petzl「最多讓強度減半」→「可能讓強度減半」（en「by up to half」→「by half」）。
7. HollowBlock2 長度刪「（零售頁）」標註（原廠頁就有 13.5／19 吋），表格與內文各一處。
8. Dyneema 熔點「約 140–145 °C」→「Beal 寫 145 °C」。
9. Petzl、Singing Rock、Edelrid PES 的零售價補上零售店名（Karst Sports USD 140.95、fallprotection.cz、Bergfreunde）。
10. 補贊助／聯盟揭露：HowNOT2（自家商店、對講機折扣）、JB Mountain Skills 兩支（攝影器材 Amazon 聯盟）、Climbing Clean（無）。
11. 斷句：Dave Searle 段（105 字）、DAV 段（74 字）；英文 DAV 句同步。
