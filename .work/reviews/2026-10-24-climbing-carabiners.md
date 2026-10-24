# 審稿紀錄：2026-10-24-climbing-carabiners（攀岩裝備 order 5，拆自 rope-belay-device）

檔案：`src/content/posts/climbing/2026-10-24-climbing-carabiners.md`、`-en.md`
日期：2026-10-24
審稿者：獨立審稿 subagent（沒有參與寫稿）
線索：`.work/climbing-gear-models/R-carabiners.md`、`tmp-biners/`（字幕 vtt、說明欄、meta.txt）。研究檔只拿來找線索；下表結論都來自重新打開的原始頁面或字幕。

工具降級（toolDegradation）：Groundlane MCP `web_fetch` 回「needs you to sign in again」→ 依規格試一次就降級。原廠頁（Petzl、BD、DMM、Edelrid、Mammut）、評測頁（OutdoorGearLab、99Boulders、Treeline）、Ascent Outdoors 搜尋頁用 curl 全頁抓回後去標籤 grep；BD、DMM 價格另讀 Shopify `.js` 變體資料。UIAA 121 圖解 PDF 是圖片，沒有文字層，用 `pdftoppm` 轉圖後直接看。影片用研究目錄現有的 yt-dlp 字幕（`tmp-biners/vtt`）與 `.description`。

## post-verify

| # | 宣稱 | 來源 | 結論 |
|---|---|---|---|
| 1 | UIAA 121／EN 12275 型別表（B／T／X／H／K／Q 與用途；K 型必須自動鎖） | UIAA 圖解 p.1 | ✅ |
| 2 | 開口寬度：K 型 ≥21 mm、其他 ≥15 mm；開門力 ≤5 N 門要保持關閉 | UIAA 圖解 p.1 | ✅ |
| 3 | 「標準要求每顆鉤環橫向至少 7 kN」 | UIAA 圖解 p.2：B／H／K／X 7 kN、Q 10 kN、**T 型沒有要求** | 🔴 → 已改「H 型鉤環」（中英，含練習題 1）。HIE 影片原話是 "every carabiner"，同樣說太寬 |
| 4 | Attache 58 g／23 mm／21-7-6 kN／USD 25.95；BAR USD 8.95 | Petzl US 產品頁 | ✅ |
| 5 | Attache 原廠頁：只有放繩處圓斷面、其他部分 H 斷面；「好處在管狀確保器、義大利半扣與**引導模式**最明顯」 | Petzl 頁：round-stock basket for VERSO、REVERSO、Munter；Partial H-frame。沒提引導模式 | 🔵 → 已縮回原廠說法（VERSO、REVERSO、義大利半扣）；中英同步 |
| 6 | RockLock 85 g／25 mm／24-8-8／USD 19.95；另有 Twistlock | BD 產品頁＋Shopify 變體 | ✅ |
| 7 | Rhino 73 g／20 mm／27-9-7／GBP 19.50；另有 Kwiklock、Locksafe | DMM 產品頁 Tech Specs＋Shopify 變體 | ✅。review-todo「£19.50 沒標版本」：Shopify 變體顯示 £19.50 就是 Titanium／Matt Grey Screwgate，Kwiklock £22.50、Locksafe £24.00 → 與表格「螺旋款」一致，可以結案 |
| 8 | GridLock 82 g／22 mm／26-8-8／USD 29.95 | BD 產品頁＋Shopify 變體 | ✅ |
| 9 | HMS Strike Slider 60 g／19 mm／22-8-7；原廠沒標價、Ascent Outdoors USD 32.95 | Edelrid US 頁（60 g 在描述文）；Ascent 搜尋頁 | ✅ |
| 10 | Smart HMS 2.0 27.5 mm／28-11-6／USD 27.95；safety gate 扣上才能用；93 g | Mammut US 頁（未列重量）；Treeline 表 93 g；研究檔記 Rock+Run 也是 93 g | ✅ |
| 11 | Bulletproof Triple FG 24 mm／25-9-9；anti-twist；OGL 87 g、定價 USD 47 | Edelrid INT 頁；OGL 總表 | ✅ |
| 12 | OGL（2025-05-07 更新）：Attache 最佳整體、Rhino 配 GRIGRI 最佳、Bulletproof 最耐用、Belay Master 2 在 15 款排最後 | OGL 總表 | ✅ |
| 13 | OGL：Attache「螺旋套容易卡住，**配 GRIGRI 會轉，要加 BAR**」 | OGL 只寫 "Screw gate gets stuck relatively easily"（轉太緊）；GRIGRI／BAR 的說法不在 OGL，是 Petzl 回 Hard Is Easy 的話 | 🔴 → 已拆開歸屬（中英） |
| 14 | OGL：Rhino 擋不住管狀確保器 | OGL："doesn't prevent carabiner rotation when paired with tube-style belay devices" | ✅ |
| 15 | 99Boulders：Attache Top Pick、RockLock Best Value、85 g 是最輕款兩倍多、Strike Slider 計時最快、「almost too easy to trust」 | 99Boulders 頁 | ✅ |
| 16 | Treeline（2026-09-28）：Attache 最佳整體有鎖、GridLock 最佳確保、GridLock 沒有上鎖指示、Smart HMS 配 ATC 好用配 GRIGRI 不順 | Treeline 頁 | ✅ |
| 17 | 練習題 4：43 g 輕量 D 型鎖；OGL 說不如 HMS 萬用 | OGL Photon Lock 43 g、"Less versatile than HMS/pear shaped lockers" | ✅ |
| 18 | HIE：鎖太緊或沙會卡；小石頭輕敲、扁帶繞套筒、清潔上油（10:23 起） | H3ojYSq_NFY 字幕 10:43–11:14 | ✅ |
| 19 | HIE：兩段式自動鎖不要只靠一顆 | 字幕 11:36 | ✅ |
| 20 | HIE：HMS 名稱由來（4:00） | 字幕 3:55–4:49 | ✅ |
| 21 | HIE：確保者端約 2 kN、「totally no need to panic」（t=1107） | 字幕 18:27–19:27 | ✅（正文）；tldr 中文「**很少超過** 2 kN」與練習題 1「很少超過」是放大，原片是一次大墜落實驗量到約 2 kN → 🔵 已改（中英）。中文 tldr 原本也和英文不一致 |
| 22 | HIE 說明欄聯盟連結 | 說明欄 "Above links might be affiliate" | ✅ |
| 23 | JB Mountain Skills：6:39 起 Attache、蒙眼引導模式分得出、先鋒／半扣／垂降差距較小；12:13 前後說 GRIGRI 選 Rhino；Petzl 寄送、自己會再買 | 0XMFM9FdI88 字幕 6:31–9:11、12:05–13:00 | ✅（Attache 段實際 6:31 開始，起播 399 可接受） |
| 24 | HIE GridLock：0:38 說明書混淆、去信 BD 與 Petzl 都沒說不行；Petzl 說梨形配 GRIGRI 較易轉；3:50 HowNOT2 拉力實驗、反過來扣不卡；9:30 落錘、約 1.5 kN 鼻子斷、利邊；結論照說明書掛小格最穩；無贊助揭露 | _-WC1jYHxVM 字幕 0:38–3:20、3:50–4:35、9:30–11:47、12:39–13:13；說明欄無贊助 | ✅ |
| 25 | たけちゃんねる：自己買、螺旋鎖被管狀確保器帶開與忘鎖、4:04 起原本想買 Belay Master、BAR 扣上後套筒轉不到開的位置、加購約 800 日圓 | AdEgkoFUkPU ja 字幕 0:00–1:33、4:04–5:43；說明欄 880 円 | ✅ |
| 26 | Dave Searle：片頭說 Petzl 寄鉤環；6:25 起 GridLock Magnetron | kkj2Q2jfN9Y 字幕 0:56、6:32 | ✅（Magnetron 實際約 6:32 出現，差幾秒） |
| 27 | Yann Camus：防橫向「a bag of problems」（t=1229）；測 GridLock＋GRIGRI 等 | OKxZxk0mDuw 字幕 1:32、20:29–21:14 | ✅ |
| 28 | 影片日期（參考資料）2021-08-04／2021-10-08／2021-10-21／2022-07-17／2024-07-09／2024-09-25 | meta.txt（yt-dlp upload_date） | ✅ |
| 29 | Petzl William、CT Concept SGL「原廠還在賣、近年沒有獨立評測」 | 未重開 | 🟡 Unverifiable（沿用研究檔） |
| 30 | 頻道介紹（Ryan Jenks 2016 起家、Ben 前軟體工程師、Tonsai 事件、JB 北威爾斯 Jez）、Dave Searle 是 IFMGA 嚮導 | 自原合併文帶過來，未重開 | 🟡 Unverifiable（本輪未查） |

合計：Confirmed 26、Outdated 0、Unverifiable 2、Contradicted 2（另 Misframed 2，都已修）。

範圍聲明：本次只檢查了文中已提出的 30 條宣告，未評估文章對主題的覆蓋是否完整。
歸因標籤：全篇「OutdoorGearLab 說／Treeline 說／Hard Is Easy 說」類歸因約 10 處，多在表格與相容性清單，屬評測來源標示，不建議再加。

## post-review

- 機械檢查：`check:tw` 0 blocking／0 to review；`check:references` 本篇無錯誤或警告；`register-scan`、`scan-ledger` 見下節。
- frontmatter：title／date／category／type guide／series 攀岩裝備 order 5／tags 5 個（既有 tag）✅。glossary 三條；HMS 條目從原文帶過來並補了名稱由來 ✅。description 與 tldr 不重複 ✅。
- tldr 與正文：數字（58 g、US$25.95、7 kN、2 kN）一致；修正後中英一致 ✅。
- 結構：開頭兩段（是什麼、回答什麼、讀完能做什麼，連確保技術文與確保器、快扣篇）→ 四個判準（每節有「今晚就能做的事」）→ 7 款表（價格日期、幣別、原廠沒標的零售店註明）→ 三支影片＋延伸觀看 → 依情境 → 檢查與汰換（連 order 12）→ 練習題 4 題 → 下一步 → 頻道介紹 → 參考資料 ✅。
- 系列連結：上一篇 order 4 確保器在開頭段有連 ✅；下一步連 order 6 頭盔 ✅；「本系列最後一篇」指 inspection-retirement（plan order 12）✅。站內連結全為 `/posts/climbing/<slug>`，英文版加 `-en`，目標檔都存在 ✅。
- 中英對應：標題層級數相同（16／16）、7 款型號、數字、影片 ID 與 start、連結一致 ✅（本輪修正前，中文 tldr「很少超過 2 kN」與英文 "only about 2 kN" 不一致，已修）。
- 拆分完整性（對照 `2026-10-19-climbing-rope-belay-device.md`）：「鉤環：確保用 H 型」節的 UIAA 型別表、H 型結論句、開口／開門力規定、HMS glossary 全部帶過來 ✅；原文快扣小節與 HowNOT2 Ts5bK_luHl8 屬快扣篇（review-todo 已確認）✅；原文練習題 4 題都是繩子／確保器，沒有鉤環題，本篇 4 題為新寫 ✅；頻道介紹 HowNOT2、Hard Is Easy 兩條逐字帶過來，另加 JB Mountain Skills ✅；參考資料 UIAA 121 圖解帶過來 ✅。沒有遺漏。
- 中文影片缺口句：meta.txt 有「樹の攀岩資料庫 DMM」與 Climbing Taiwan 19 秒短片，都不是確保鉤環型號評比，句子成立。

需要人判斷：
- review-todo 已列的「短軸強度約主軸三分之一」：表內 7 款比值 0.31–0.39，glossary 寫「大約三分之一」站得住。
- 判準 2「Hard Is Easy 去信 Petzl 問 GRIGRI 該配哪種鉤環」：影片裡他問的是 GridLock 上 GRIGRI 掛哪一格，Petzl 順帶提梨形易轉。意思沒錯，要不要改寫交作者。
- Smart HMS 93 g 標「零售頁」，實際本輪讀到的是 Treeline 評測表（研究檔記 Rock+Run 零售也寫 93 g），可考慮改標「Treeline、零售頁」。

## post-polish

- `register-scan.sh`（修正後）：長句 4 句（60／69／64 字，一句 74 字是本輪改稿造成，已斷開）；其中兩句在頻道介紹（從原文逐字帶過來），保留。但書 7%；引述區塊 0；姓名主詞 0；模板化轉折 0；一般英文術語 0。
- 數字密度：延伸觀看 HIE 那條 6 個（三個時間碼＋連結），HowNOT2 頻道介紹 4 個；都是讀者要用的時間碼／背景，保留。
- `scan-ledger.sh`：0 命中。
- 人工回讀：判準段每節都有可執行動作；表格「適合誰／缺點」都能從評測或規格推出。語氣像在跟要買第一顆鉤環的人說話，沒有研究 memo 腔。

### 本輪直接修改（中英同步）

1. tldr：「量到確保者端很少超過 2 kN」→「在一次大墜落實驗量到確保者端只有約 2 kN」（英文同步為 "in one hard-fall experiment … only about 2 kN at the belayer"）。
2. 判準 2：Petzl 原廠頁的好處縮回原廠說法（VERSO、REVERSO 管狀確保器與義大利半扣），拿掉原廠沒寫的「引導模式」；中文順便斷成兩句。
3. 判準 4：「標準要求每顆鉤環」→「H 型鉤環」。
4. 型號表 Attache「適合誰／缺點」：OGL 只說螺旋套易卡；GRIGRI 會轉改標為 Petzl 回覆 Hard Is Easy 的說法。
5. 練習題 1 答案：7 kN 改 H 型、2 kN 改成「大墜落實驗量到約 2 kN」。
