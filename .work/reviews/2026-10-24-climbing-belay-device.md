# 審稿紀錄：2026-10-24-climbing-belay-device（攀岩裝備 order 4，拆自 rope-belay-device）

檔案：`src/content/posts/climbing/2026-10-24-climbing-belay-device.md`、`-en.md`
日期：2026-10-24
審稿者：獨立審稿（未參與寫稿），依 `.work/climbing-gear-models/review-brief.md`。
線索（不算來源）：`.work/climbing-gear-models/R-belay-device.md`；字幕與轉錄：`.work/climbing-gear-models/tmp-belay/yt/subs/*.vtt`、`tr-Ft3JRwguRBI/transcript.raw.vtt`（Whisper）、`txt-EyYnnqoa7bE.txt`。

工具降級（toolDegradation）：Groundlane MCP `web_fetch` 回「MCP server not connected」→ 跳過 Groundlane 直接 HTTP 與 keyless 搜尋（只需讀已知 URL）→ 原廠頁用 curl＋去標籤（BD、Trango、DMM 用 Shopify `.js`／HTML、Petzl HTML、Wild Country HTML、DAV HTML、Petzl GRIGRI 說明書 PDF 用 pdftotext）；Edelrid 重量要 JS，改用 jina keyless reader（`r.jina.ai`＋`X-Engine: browser`）；Edelrid 規格、Mammut、CT、UIAA 2009、OutdoorGearLab、Climbing.com、UKClimbing、REI 用 Exa `web_fetch_exa`；UIAA 2026 建議 Exa 逾時 → jina reader。影片字幕用研究時 yt-dlp 下載的 vtt，逐一以起播秒數 ±35 秒視窗比對。

## post-verify

| 宣稱 | 來源 | 結論 |
|---|---|---|
| ATC-XP 7.7–11 mm、64 g、USD 34.95 | BD 產品頁（metafield、spec、.js） | ✅ |
| ATC-Guide 8.1–11 mm、80 g、USD 54.95 | BD 產品頁 | ✅ |
| ATC Pilot 8.7–10.5 mm、86 g、USD 54.95 | BD 產品頁 | ✅ |
| REVERSO 單 8.5–11／半 7.1–9.2／雙子 6.9–9.2 mm、57 g、USD 49.95 | Petzl US 頁 | ✅ |
| GRIGRI 8.5–11（最佳 8.9–10.5）、175 g、USD 104.95；GRIGRI+ 200 g、USD 134.95；NEOX 235 g、USD 154.95 | Petzl US 頁 | ✅ |
| DMM Pivot 單 8.7–11、半／雙子 7.3–9.2 mm、72 g、GBP 37.50 | dmmwales.com（store currency GBP） | ✅ |
| Smart 2.0 8.7–10.5 mm、80 g、USD 54.95、建議配 Smart HMS | Mammut US 頁 | ✅ |
| Jul² 8.9–11 mm、105 g；Giga Jul 7.1–10 mm、121 g；Pinch 8.5–10.5 mm、234 g、EN 15151-1、防恐慌、可直接扣確保環 | Edelrid us-en（規格 Exa、重量 jina browser） | ✅ |
| Click Up+ 8.5–11 mm、110 g、原廠分類「manual braking」、須配 CONCEPT SGL HC | CT 產品頁 | ✅ |
| Trango Vergo 8.9–10.7 mm、195 g、USD 99.95 | trango.com | ✅ |
| Wild Country Revo USD 199.95 | wildcountry.com | ✅ |
| GRIGRI 說明書：EN 15151-1 type 6 原文、±0.2 mm、外皮處理／新／結冰／濕／泥的繩降低鎖定 | Petzl 說明書 PDF | ✅ |
| DAV 半自動測試：A 型 EN 15151-1、B 型（Autotube）EN 15151-2 | alpenverein.de/halbautomatentest | ✅；但 DAV 原文寫 EN 15151-2 是「Manuelle Bremsgeräte」，文中只寫「屬於 EN 15151-2」易讀成「EN 15151-2＝輔助管狀」。Pivot（DMM 頁）、Click Up+（CT 頁「EN 15151-2:2012 type 2」）也是 15151-2 → 🔵 Misframed，**已補一句**（見下） |
| DAV 確保器建議：岩館／單繩距建議半自動；多繩距 HMS 與管狀仍是標準；最弱一環是確保者；2023-03-01 | DAV 頁（轉址至 artikel/sicherungsgeraete-empfehlung…） | ✅ |
| UIAA 129（2009-09-19）四類：manual、locking-assisted、abseil、abseil with panic | UIAA 2009 新聞稿 | ✅ |
| UIAA 2026 購買建議：9–10 mm 確保器配 11 mm 繩可能無法正常運作；2026 年 2 月 | UIAA 頁（jina） | ✅（文中「第二條」＝原文 1.2 節，可接受） |
| OGL 2025-05-05：GRIGRI「Best Overall for Experienced Climbers」、GRIGRI+「Best for New Climbers」且切換模式易忘、Giga Jul「Most Versatile」、ATC Guide「Best Bang for the Buck」、Smart 2.0 需學新技巧 | OGL 清單 | ✅ |
| Climbing.com 2025-08-15：Pilot「Best for Guides and Instructors」、NEOX「Smoothest Operator」、Vergo「Most Intuitive」 | Climbing.com | ✅ |
| UKC 2025-04-21：Pinch 直接扣吊帶「absolute game-changer」 | UKClimbing | ✅ |
| Jul²／Giga Jul／Pinch 的 REI 價格 | REI 搜尋頁 Exa 快取（Jul 2 $49.95、Giga Jul $69.95；Pinch 未在快取片段中） | 🟡 Unverifiable（日期不明；文章已註明「快取頁，查價日不明」→ review-todo 該項已處理）。附帶：OGL 與 Climbing.com 都列 Pinch $119.95–120，與 REI $129.95 不同 |
| Click Up+ EpicTV US USD 82.65；台灣通路（Petzl 台灣、登山補給站） | 未重開 | 未查（不計入） |

### 影片（標題、頻道、日期對 yt-dlp metadata；看點對字幕）

| 影片 | 起播 | 結論 |
|---|---|---|
| qx3x5MMqGUg Hard Is Easy Complete Guide（2022-04-26） | 127＝2:07 管狀段開頭；8:30 輔助管狀手抬高不鎖；說明欄「9.0mm Mammut Sender」 | ✅ |
| UjYLsya1T9E HowNOT2（2021-07-14） | 100＝1:40，接近下限細繩 2.98 kN 滑 | ✅ |
| v8pEe5X1-Lc Hard Is Easy When Assistance Fails（2023-06-20） | 374＝6:14；Click Up／Pilot 不鎖、Edelrid「Jul」立即鎖（文中寫「一台 Edelrid 的輔助管狀」，措辭與字幕不確定性相符）、Giga Jul 最差、Smart＋Smarter 改善；17:48 Click Up+ 易著地；20:38 結論；Revo 約 1.5 m（17:00）；說明欄 Brilliant 業配 | ✅ |
| tHcQHLmBXyY WeighMyRack（2024-04-11） | 20＝0:20；價格約一半（0:50）；4:10 多繩距；5:32 不再推無 guide mode 的普通管狀 | ✅ |
| FMj1fCvnCOs JB Mountain Skills（2026-06-09） | 25＝0:25 西班牙推 GRIGRI 類；1:35 英國半繩；3:09 不推 Giga Jul；3:29 ATC Guide | ✅ |
| NzG68z5nxoI JB Giga Jul 一年（2022-08-25） | 67＝1:07（「以為會收進箱子」實際在 1:48，同一段，可接受）；1:27「I got this from outside」；2:49、5:12、7:14 | ✅ |
| oLB0PdEP6g4 Hard Is Easy NEOX（2024-06-15） | 147＝2:27；0:23 Petzl 提供、非贊助；7:42；10:29；Brilliant | ✅ |
| 1ytFcTHETUQ Hard Is Easy Pinch（2025-04-13） | 583＝9:43（9.5 mm GRIGRI 卡、NEOX 最順）；10:30 拉繩費力；19:06 GRIGRI＞Pinch＞NEOX；說明欄無器材來源、有 Brilliant | ✅ |
| b1ZgscEO0E0 Outside.co.uk GRIGRI+（2026-03-30） | 144＝2:24 頂繩模式；0:40 三台分工；5:08 防恐慌；零售商頻道 | ✅ |
| D2YzrH2jQdA たけちゃんねる（2024-07-07） | 41＝0:41 無贊助、推薦新手與管狀轉換者；4:53 說明書拿掉壓凸輪；9:49 放手測試多次沒鎖；12:41 | ✅ |
| 只連結：mqo2islEEBs（JB Pilot，4:56「beginner… pick this up really quickly」）、LhGhdxZh2vE（EpicTV 5:51 look after；2:44 唸單繩 8.5–10.5） | — | ✅ |
| EyYnnqoa7bE I'm 阿湯（頻道在 yt-dlp 英文 metadata 是 I'm Scorpio，中文名 I'm 阿湯）：「右手沒拉住」「不想認真確保的老手」「很少看到」「從國外買」 | Whisper 轉錄 | ✅ |
| Ft3JRwguRBI 徐暘：鋁製磨出溝、變銳利、GRIGRI 溝槽也會磨（8:05–8:26）；EN 認證（6:23–6:43）；輔助制動裝反沒自鎖＋實例（10:51–12:14） | Whisper 轉錄 | ✅；但原句「會傷繩」轉錄裡沒有 → 🔴 超出來源，**已刪** |

小計：Confirmed 40（含影片 13 列）、Outdated 0、Unverifiable 1、Contradicted 1（「會傷繩」歸在徐暘名下，已修）＋ Misframed 1（EN 15151-2，已修）。

範圍聲明：本次只檢查了文中已提出的 42 條宣告，未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish（本檔下兩節已完成）。

## post-review

- frontmatter：title／date 2026-10-24／category climbing／type guide／lang／series `攀岩裝備`／`Climbing Gear` order 4 ✅；tags 7 個皆既有；沒有 `outdoor-climbing`（review-todo 已列，不重報）。
- tldr 與正文：分類、DAV／WeighMyRack 建議、半價、Pilot 抬手不鎖、GRIGRI 8.5–11／8.9–10.5、Pilot／Smart 上限 10.5 皆與正文一致 ✅。
- 結構：開頭兩段 → 分類 → 四個判準（各有「今晚就能做的事」）→ 三張型號表 → 讀評測注意 → 8 支影片 → 三種情況 → 檢查與汰換（連 order 12）→ 練習題 4 題（details）→ 下一步（order 5 鉤環）→ 延伸觀看 → 參考資料 ✅。
- 系列連結：下一篇 `/posts/climbing/2026-10-24-climbing-carabiners`（-en）✅；繩子連 order 8 ✅。上一篇（order 3 吊帶）原本沒連，且開頭寫「繼吊帶之後第二個該買的裝備」與系列順序（鞋、粉袋、吊帶、確保器）對不上 → **已改**為「買完〈吊帶〉，接著就該買它」並連 order 3（中英）。
- 中英對應：影片 ID、起播、型號、價格、表格逐列一致；站內連結英文版全是 `-en`，無 `/en/posts` ✅。`check:references` 無本篇錯誤。
- 拆分完整度（對照 `2026-10-19-climbing-rope-belay-device.md`）：確保器兩大類段、UIAA 129／EN 15151 段、Hard Is Easy qx3x5MMqGUg（start 127）、相容繩徑段＋GRIGRI 說明書四點與兩個提醒、HowNOT2 UjYLsya1T9E（start 100）、「今晚就能做」、練習題 2 題（11 mm 繩、8.7 mm 新繩）、glossary「輔助制動確保器」、延伸觀看兩頻道、相關參考資料全部帶過來 ✅。唯一差異：原 glossary 別名 `cam-assisted`、`EN 15151-1` 從「輔助制動確保器」移到「凸輪式確保器」（只帶 cam-assisted，`EN 15151-1` 別名沒了），影響小。

需要人判斷：
1. 表格標題「輔助管狀（EN 15151-2）」與 glossary 別名 `EN 15151-2` 仍讓人以為該標準只涵蓋輔助管狀；正文已補說明，標題／別名要不要改由作者決定。
2. Pinch 價格：REI 快取 USD 129.95，但 OGL、Climbing.com 2025 都是 USD 119.95–120；是否換成有日期的來源。
3. 「會傷繩」刪掉後，檢查段少了「為什麼要汰換」的理由；若要保留，需補原廠檢查說明（Petzl／BD）當來源。

## post-polish

- `register-scan.sh`（修改後）：長句 5 句（HowNOT2 段 76 字已在分號處拆成兩句；其餘 60–69 字在表格說明、讀評測、頻道介紹，保留）；但書 3%；引述 0；模板化轉折 0；英文術語 0。
- 數字密度 ≥4 的 8 段：UIAA／EN 標準段、影片段的時間碼（mm:ss 是讀者跳轉用）、HowNOT2 段（kN 與繩徑是讀者判斷依據），屬必要；不再拆。
- `check:tw` 0 blocking；21 個「凸輪」警告都是確保器內部零件，規則本身註明不用改。
- 姓名當主詞 1 處、可執行動作每個判準都有，語氣自然。

### 本次直接修改（中英同步）

1. 「屬於 EN 15151-2。」→ 補「這份標準的名稱是『手動制動器』，一般管狀也歸在這一類。」（en 同步）
2. 檢查段刪「會傷繩」（en 刪 “enough to damage rope”）。
3. 開頭「繼吊帶之後第二個該買的裝備」→「買完〈吊帶〉，接著就該買它」並連 order 3（en：“Buy it right after your harness”）。
4. zh HowNOT2 段 76 字長句在分號處拆成兩句（en 原本已分句）。
