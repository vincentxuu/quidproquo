# 審稿紀錄：2026-10-24-climbing-harness（攀岩裝備 order 3，拆自 2026-10-19-climbing-harness-helmet）

檔案：`src/content/posts/climbing/2026-10-24-climbing-harness.md`、`-en.md`
日期：2026-10-24
審稿者：獨立審稿（未參與寫稿）。依 `.work/climbing-gear-models/review-brief.md`。
已知待決事項見 `.work/climbing-gear-models/review-todo.md`（climbing-harness 三條），本紀錄不重報。

工具降級（toolDegradation）：
- Groundlane MCP：`MCP server "claude.ai Groundlane" is not connected`。
- Groundlane 直接 HTTP（POST `/mcp`）：HTTP 401。
- Keenable keyless：可用，只用在台灣通路搜尋。
- 讀頁：jina reader（`curl https://r.jina.ai/<url>`）讀 Petzl US ×6、Mammut US、GearJunkie、Switchback、OGL ×2、Climbing.com、UKC、REI、Petzl 台灣、艾格探險、UIAA；REI 商品頁 jina 回 403 → Exa `web_fetch_exa`（快取無日期）。jina MCP、firecrawl MCP 皆 `not connected`。
- BD：curl 讀 Shopify `products/<handle>.json`（價格）與 HTML（重量、尺寸表）。
- UIAA 105 圖解 PDF 是純圖：curl 下載 → `pdftoppm` → `tesseract` OCR，並人工看圖核對 15 kN 欄位。
- YouTube：`yt-dlp --cookies-from-browser chrome` 重抓 10 支影片的中繼資料、說明欄與字幕（沒用寫稿者的 tmp 檔）。
- Petzl 台灣上架：`curl https://www.petzltw.com/products/<model>` 六頁 200、標題正確；BD 台灣代理 Momentum 頁可開。

## post-verify

全部 2026-10-24 由審稿者自己重開原始來源核對。研究檔只當線索。

| # | 宣稱 | 來源 | 結論 |
|---|---|---|---|
| 1 | BD Momentum USD 74.95、350 g、男 XS–XXL 61–114 cm、女 XS–XL 66–99 cm、4 個硬環＋haul loop | BD 原廠 JSON＋HTML 尺寸表 | 🟢 Confirmed |
| 2 | Petzl CORAX USD 79.95、470–520 g、2 號 65–107 cm、前 2 硬後 2 軟、腰帶兩個扣 | Petzl US CORAX | 🟢 Confirmed |
| 3 | Mammut Ophir 4 Slide 2.0 USD 84.95、375–435 g、4 硬環＋1 小軟環、確保環有磨損指示、2 號沒列腰圍 | Mammut US 產品頁 | 🟢 Confirmed |
| 4 | BD Solution USD 99.95；男 316–440 g、XXS–XL 56–99 cm；女 314–406 g、XXS–L 61–91 cm；4 側環＋背後第 5 環 | BD 原廠 JSON＋HTML | 🟢 Confirmed |
| 5 | SAMA／SELENA USD 94.95、310–375 g、SAMA S–XL 71–100、SELENA XS–L 65–92、4 環前硬後軟 | Petzl US SAMA、SELENA | 🟢 Confirmed |
| 6 | ADJAMA／LUNA USD 104.95、365–435 g（ADJAMA 370–435、LUNA 365–420）、尺寸、5 環配置 | Petzl US ADJAMA、LUNA | 🟢 Confirmed |
| 7 | SITTA USD 184.95、250–290 g、XS–L 65–92、5 環＋2 個扣槽（原廠叫 CARITOOL slots） | Petzl US SITTA | 🟢 Confirmed |
| 8 | 女款差在腰帶形狀、rise、腰腿比例 | Petzl SELENA「Waistbelt shape, rise, and waistbelt-to-leg-loop ratio」 | 🟢 Confirmed |
| 9 | GearJunkie：Solution 最佳整體、腿環固定要先試、沒有冰錐扣槽；Momentum 最佳平價、襯墊不透氣；Corax 最佳入門、比 Ophir 4 Slide 2.0 裝備環大、扣具好調 | GearJunkie 2026-05-14 | 🟢 Confirmed |
| 10 | Switchback：Adjama 最佳整體、可調腿環「almost mandatory for muscular legs」；Momentum 布料比多數容易磨；Solution「Small gear loops」；CAMP Energy CR 3 最佳平價 | Switchback 2026-05-28 | 🟢 Confirmed |
| 11 | OGL（男）：Sitta Best All-Around、長時間吊掛不如有襯墊款；Sama 掛確保很舒服、腰帶吊著會往上跑 | OGL 2025-04-04 | 🟢 Confirmed |
| 12 | OGL（女）：Corax 布質裝備環耐用度沒把握；「Mammut 4 Slide」Best Bang for the Buck、兩個腰扣調整較費時；運動員體型不一定符合腰細腿粗 | OGL 2025-08-26 | 🟢 Confirmed |
| 13 | Climbing.com：Mammut Ophir 3 Slide 2.0 是最不舒服的幾條之一 | Climbing.com 2026-10-07 | 🔴 Contradicted（中文版）→ 已修。中文寫「說 Mammut 的吊帶很不舒服」「Ophir 3 Slide」；原文只針對 Ophir 3 Slide 2.0，同一清單還推薦 Mammut Sender。英文版原本就對 |
| 14 | UKClimbing：新款 Solution 裝備環比舊款大很多、背後有第五個環、評測品來自品牌 | UKC 2026-08-28 文字評測 | 🟡 部分 Unverifiable → 已修。原文沒說第五環是新增的（只說「Alongside the four … there's a fifth on the back」）；揭露是站方通用聲明「We receive free products for review from brands」，不是針對這件評測品。兩處改寫成來源原意 |
| 15 | REI：確保環最強點；腰帶在髂骨頂端稍上方、多數人約肚臍高度；空隙不超過兩根手指；扣具反扣（自動扣除外）；不吊起來無法知道舒不舒服；吊帶三類特徵；腿環鬆緊取捨 | REI Expert Advice（2025-08-29 更新） | 🟢 Confirmed |
| 16 | Petzl 台灣：五個部位、繫繩點兩個環都要穿、裝備環不能承重、裝備環 2／4／6、腰帶在髖骨上方、可調腿環冬天好用、認證「CE 的 EN 12277 Type C（坐式），以及 UIAA 105」、2026-07-16 發布 | Petzl 台灣吊帶指南 | 🟢 Confirmed |
| 17 | 艾格探險：約與肚臍同高、平放一個手掌但不能翻轉、較新款通常不用反扣、Danger 字樣要反扣 | 艾格探險 | 🟢 Confirmed |
| 18 | UIAA 購買建議（2026 年 2 月）：合身影響吊帶與頭盔的保護能力、看原廠尺寸表 | UIAA advice 1.3 | 🟢 Confirmed |
| 19 | UIAA 105／EN 12277：坐式 15 kN、垂降環 15 kN（小體型 10 kN）、扣具滑移 ≤ 20 mm、標製造年、縫線對比、UIAA 加碼 50% | UIAA 圖解 PDF（OCR＋看圖） | 🟢 Confirmed |
| 20 | CAMP Energy CR 3：REI 標價 USD 54.95、可調腿環、4 個裝備環 | REI 商品頁（Exa 快取，無日期）；Switchback 寫「$55」 | 🟢 Confirmed（兩源，REI 為無日期快取） |
| 21 | 台灣：Petzl 台灣官網有 Corax、Sama、Selena、Adjama、Luna、Sitta；BD 台灣代理有 Momentum | petzltw.com/products/<model> 六頁、blackdiamondequipment.com.tw | 🟢 Confirmed（有上架頁；頁面多處「售完」字樣，是否有貨未判斷） |

### 影片（URL、標題、頻道、上傳日、起播、內容、揭露）

標題、頻道、上傳日都用 yt-dlp 重抓，10 支全部與文中、參考資料一致。

| 影片 | 起播 | 文中描述 vs 字幕 | 揭露 | 結論 |
|---|---|---|---|---|
| yxNYyCONYGo HowNOT2 Intro to Sport Climbing（2025-01-09） | 394＝6:34 | 6:37 開始講吊帶、6:53 岩館吊帶縫成單一連接點；9:43 起「welcome to howto.com」商店廣告 | 文中已寫商店廣告 | 🟢 |
| uXhneYRiGqw Hard Is Easy Ep.7（2021-09-29） | 35＝0:35 | 0:36 開始、0:50–1:06 收在髖骨上、倒掛不滑出；2:30「a hand or two」講腿環；6:06 起定位帶 | 7:15「mammoth is sponsoring this video」；說明欄列 Mammut 吊帶 | 🟢 |
| auH3uSmXdUc HowNOT2 I tried these on（2024-07-27） | 350＝5:50 | 5:50–6:00 還在講 Cadillac，6:01 起 Titan 雙扣、6:17「O 是 open、C 是 closed」 | 文中寫商店在賣 | 🟢（Titan 段實際在 6:01，起播早 11 秒，承自原文，可接受） |
| BcR7IlwDzkk EpicTV CD Ep.2098（2023-05-19） | 60＝1:00 | 1:02 起四件事（可調、至少 4 環、價格、耐用）；Momentum 4 個一樣大的硬環、moderate rack；片中 302 g（原廠 350 g）；Corax 最重、「no idea … great first harness」 | 片中報 Epic TV shop 價格、說明欄有購買連結 | 🟢 |
| f4qqR2I-mNE UKClimbing Solution or Zone?（2026-10-23） | 40＝0:40 | 0:40 起裝備環 massive improvement、前後都放得下 big trad lead；1:21「reaching for throughout most of the routes … in 2026」；3:44 只買一條選 Solution；Zone 適合紅點 | 文字評測頁有站方聲明 | 🟢 |
| 2ex48x4dv60 JB Mountain Skills（2025-03-26） | 15 | Corax「harness we all need」、兩個腰扣置中、「would work for everything」；3:04 起不該買的；4:22 起 Sitta、「they sent me this」、腿環不可調、吊著舒服 | 片中自述 Petzl 寄測，說明欄沒寫 | 🔴 Contradicted → 已修：文中寫「無牌吊帶」，片中那條是 Amazon 上 £3 的「Mad Mountain」牌，改「雜牌」／off-brand（中英、EN 12277 詳解段與影片段兩處） |
| XjiZFheCHuA PUMP2（2025-07-29） | 150＝2:30 | 2:10–2:27「ペツルジャパン様の方からハーネスの試し履き会」；2:42 起 Sama／Selena 岩館到岩場都能用、襯墊厚吊著不痛；3:22 起 Adjama＝Sama 加更多更大的環＋可調腿環；20:18 起吊著比較，Sama 腿環襯墊 | 文中已寫廠商合作（說明欄未寫） | 🟢 |
| 0xZ3cRBVFWI WeighMyRack（2025-05-27） | 320＝5:20 | 0:00 自介「Ben Eaton … national marketing manager … Petzl America」；0:36 女款差異；5:29 起尺碼：以前收到最緊置中、現在離最緊約 2 cm；L 換 M、考慮降一號 | 文中寫品牌簡報；說明欄是 WeighMyRack 比價連結 | 🟢 |
| hHtGWqRiMmc Kellen Erickson（2025-10-21） | 200＝3:20 | 0:00「past few months」、0:59 開發 dry tooling 路線；3:28 起後方第五環與重疊、常一次掛到兩個；9:13 起尺寸、11:01 冰攀介於兩號建議選大 | 說明欄無贊助 | 🟢 |
| ryWo-fep_5E UKClimbing Spotlight Mammut 4 Slide（2021-03-15，只引用） | — | 0:58 兩個腰扣＋兩個腿扣＝4 Slide；2:13 確保環磨到露出紅色就換 | — | 🟢 |

統計：🟢 Confirmed 29（21 條宣稱＋8 支影片無誤）／🟠 Outdated 0／🟡 Unverifiable 1（#14 Solution 第五環是否新增）／🔴 Contradicted 2（#13 中文版 Climbing.com 說法、JB 影片「無牌」）。

### 直接修正（中英同步）

1. Climbing.com 句：中文「說 Mammut 的吊帶很不舒服，但它測的是三個扣的 Ophir 3 Slide」→「把一條 Mammut 吊帶列為最不舒服的幾條之一，但它測的是三個扣的 Ophir 3 Slide 2.0，不是表裡四個扣的 Ophir 4 Slide 2.0」（對齊來源與英文版）。
2. OGL「Mammut 4 Slide」名稱：中文「名稱沒有寫 Ophir」與英文「isn't named Ophir 2.0」不一致 → 兩邊都改成「名稱沒有 Ophir 也沒有 2.0」／has neither "Ophir" nor "2.0" in its name。
3. UKC Solution：「背後也多了一個環」／「there's now a fifth loop」→「兩側 4 個環之外，背後還有第五個環」／「besides the four side loops there's a fifth at the back」（來源沒說是新增）。
4. UKC 揭露：「評測品是品牌提供的，頁面有揭露」→「UKClimbing 頁面註明，他們的評測品由品牌免費提供」（站方通用聲明）。
5. JB 影片「無牌吊帶」→「雜牌吊帶」／unbranded → off-brand（兩處×兩語）。
6. WeighMyRack 段補 inline 連結（影片 URL），並把 86 字長句在「尺碼範圍沒變」後斷開（中英同步）。
7. 檢查與汰換段「UKClimbing 2021 年訪問 Mammut」補 inline 連結到 ryWo-fep_5E（中英）。

範圍聲明：本次只檢查了文中已提出的宣告（21 組事實、10 支影片），未評估文章對主題的覆蓋是否完整（覆蓋另見 post-review）。
下一步（未完成前不能 commit）：post-review、post-polish（本紀錄下兩節）。

## post-review

機械檢查（2026-10-24，修改後重跑）：
- `check:tw` 中文版 0 blocking、0 to review。
- `check:references`：兩個新檔沒有錯誤或警告；站內連結 helmet、belay-device、buying-order、gym-top-rope-belay、inspection-retirement 中英檔都存在。
- `check:lang-parity`、`check:post-quality`、`check:process-leak`、`check:glossary`：本篇無命中。
- `check:series-order`：紅，但起因是舊檔。舊 `2026-10-19-climbing-rope-belay-device(-en)` 還是 order 3，和本篇撞號；舊 `harness-helmet` 是 order 2，和 chalk-bag 撞號。plan.md 已排「刪除舊兩篇」，刪掉就會消失。本篇不用改。
- `check:links`（中文版 34 條）：REI、GearJunkie 403（擋機器人，審稿時 jina 讀得到）；UIAA 兩條 Timeout，但審稿時 jina／curl 都抓得到，判為暫時性。

結構與內容：
- frontmatter：必填齊全，type guide，series 攀岩裝備／Climbing Gear order 3（照 plan）；7 個既有 tag。✅
- tldr 與正文一致（2／4／6 環出自 Petzl 台灣；Momentum／Corax、Solution／Sama／Selena、Adjama／Luna 三段推薦都和「三種情況怎麼挑」相符）。✅
- 結構照 writer-brief：開頭兩段 → 五個部位 → 四個判準（每節都有「今晚就能做的事」）→ 7 款比較表（價格寫查價日與幣別）→ 實測影片 6 支（每支寫看點、起播、揭露）→ 三種情況 → 檢查與汰換（連系列最後一篇）→ 練習題 4 題 → 下一步（order 4 確保器）→ 延伸觀看 → 參考資料。✅
- 拆分完整性：和原合併文中英對照過。吊帶部分的五個部位、REI 類型表、Petzl 台灣環數、腿環可調／固定、試穿三個來源、吊起來試、扣具反扣、EN 12277／UIAA 105 詳解、3 支嵌入影片（yxNYyCONYGo 394、uXhneYRiGqw 35、auH3uSmXdUc 350，起播與說明文字原樣）、glossary 4 條（另加 rise）、吊帶練習題 3 題（第 4 題原本是頭盔，換成新題）、延伸觀看兩頻道、參考資料（吊帶相關 5 條）都帶過來了，沒有遺漏。原文「更新紀錄」照規則不帶。✅
- 中英對應：數字、型號、影片、起播、連結一致（修正 1–2 之後）。✅
- 站內連結都是 `/posts/climbing/<slug>`，英文版加 `-en`。✅
- inline 來源：WeighMyRack 與 UKC 2021 原本只在參考資料，已補 inline（修正 6–7）。

需要人判斷（沒改）：
1. Kellen Erickson 在 10:23 說，他後來不太穿 Adjama 了，原因是多穿衣服時裝備環不置中，冰攀時拿冰錐很麻煩。文中只寫了「建議冰攀者選大號」，表格的 Adjama 缺點沒有這一點。要不要補進缺點欄？
2. Corax 有沒有冰錐扣槽，來源互相矛盾：OGL 女款說「included ice clipper slots」，EpicTV 說有「ice screw carry slots」，JB 說網站寫可裝 Caritool，但「hasn't got any actual slots」。表格沒寫，所以目前沒錯；如果之後要加，先查 Petzl 原廠頁。
3. Momentum「尺碼最齊」：Momentum 和 Solution 男款都是 6 個尺碼。Momentum 贏在腰圍範圍最寬（61–114 cm）。要不要改成「腰圍範圍最寬」？
4. Petzl 台灣六款頁面多處出現「售完」字樣，可能只是模板文字。文中只寫「有上架」，沒寫有貨；看稿時可順手確認。

## post-polish

`register-scan.sh`（中文版，修改後）：
- 長句 > 60 字：8 句，含頻道介紹 2 句與表格說明。已斷開 Ben Eaton 那句（86 字）；其餘多是影片看點的連續描述，拆開會失去時間碼和內容的對應，保留。
- 但書密度 11%（綠）；引述區塊 0；姓名當主詞 0；模板化轉折 0；一般英文術語 0。
- 數字密度：8 段 ≥ 4 個數字，全部在影片看點段，多數是時間碼（mm:ss）。review-todo 已列（接受或微調），這裡不重報。
- `scan-ledger.sh`：0 命中。
- 可執行動作：四個判準各有一句「今晚就能做的事」，都做得出來；三種情況各有一個「試摸／吊起來試」的動作。✅
- 台灣讀者位置：開頭用台灣兩個來源（Petzl 台灣、艾格探險）起手；比較表後交代台灣通路；英文來源的判準都接回「在店裡怎麼試」。✅
- 英文版：和中文版同步改了修正 1–7，句子節奏不必另外調。
