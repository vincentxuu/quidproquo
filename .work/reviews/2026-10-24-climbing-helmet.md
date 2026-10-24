# 審稿紀錄：2026-10-24-climbing-helmet（攀岩裝備 order 6，拆自 2026-10-19-climbing-harness-helmet）

檔案：`src/content/posts/climbing/2026-10-24-climbing-helmet.md`、`-en.md`
日期：2026-10-24
審稿者：獨立審稿（未參與寫稿），依 `.work/climbing-gear-models/review-brief.md`

工具降級（toolDegradation）：Groundlane MCP 本 session 未連線（`MCP server "claude.ai Groundlane" is not connected`）→ 原廠頁與評測頁改用 Exa `web_fetch_exa`；Switchback、Climbing.com、OutdoorGearLab、Treeline、BD 尺寸表、迪卡儂規格、Petzl US Sirocco 價格用 curl＋去標籤 grep；UKC 評測 curl 被擋（61 bytes）→ Exa；UIAA Ten things 頁 Exa 逾時、curl 空白 → Exa search 抽出頁面全文段落。UIAA 106 圖解 PDF 是圖片檔，直接讀圖。影片字幕用研究目錄 `tmp-helmet/txt`、`tmp-helmet/vtt`（Hard Is Easy 用人工字幕 `en-en.vtt`），說明欄用 `tmp-helmet/desc`。

## post-verify

### 原廠規格與價格

| 宣稱 | 來源 | 結論 |
|---|---|---|
| Boreo 300／330 g、48–58／53–61 cm、USD 74.95、ABS 殼＋EPP、EPS 雙層、TOP AND SIDE PROTECTION | Petzl US 產品頁 | ✅ |
| Petzl 美國官網把 Boreo 寫成「hybrid construction」 | Petzl US 產品頁（「Robust hybrid construction with thick ABS shell…」）；Petzl 台灣產品頁也寫「Hybrid結構」 | ✅ |
| Boreo 台灣 NT$2,980（優惠 NT$2,280） | Petzl 台灣產品頁 | ✅ |
| Meteor（2026）235／245 g、52–59／57–61 cm、USD 114.95、EPS 射入 PC 殼、不符合 EN 18100:2024 | Petzl US 產品頁 | ✅ |
| Meteor 台灣 NT$3,980（優惠 NT$3,180） | Petzl 台灣產品頁：價格對，但上架的是舊版（A071CA／AA、225／240 g、48–58／53–61 cm、仍寫 CE 登山滑雪認證） | 🟠 Outdated → 已在價格欄註明「台灣官網上架的是舊版」 |
| Sirocco 160／170 g、48–58／53–61 cm、側 EPP 頂 EPS＋薄 PC、USD 169.95 | Petzl US 產品頁（價格用 curl 抓） | ✅ |
| Sirocco 台灣 NT$5,800（優惠 NT$4,480） | Petzl 台灣產品頁 | ✅ |
| Capitan E 320／350 g、USD 89.95、頂 EPS 側 EPP、兩件式殼、「meets the proposed UIAA increased side and back protection requirements」 | BD 產品頁 | ✅ |
| Capitan E 頭圍 53–59／58–63 cm | BD 產品頁沒抓到尺寸表；Treeline 規格表 | ✅（single-source，二手） |
| Vision 220／230 g、USD 119.95；MIPS 250 g、USD 159.95；頭圍 53–59／58–63 cm；「meets proposed UIAA requirements」 | BD 兩個產品頁＋尺寸表 | ✅ |
| MIPS「intended to reduce the rotational force that can cause concussions」 | BD MIPS Vision 頁 | ✅ |
| Half Dome USD 69.95 | BD 產品頁 | ✅ |
| Crag Sender 199／219 g、52–57／56–61 cm、USD 99.95、EPS＋Kevlar、前後側額外保護；台灣 NT$3,980、210／220 g | Mammut US、Mammut 台灣產品頁 | ✅ |
| Simond Rock 350 g（M）、NT$849、ABS＋聚苯乙烯、50–57 cm | 迪卡儂台灣產品頁（curl 讀頁面 JSON） | ✅；M/L 54–61 cm 沒在頁面資料裡找到 → 🟡 |
| Wall Rider 2.0 180／200 g、原廠頁沒列認證欄 | Mammut US 產品頁 | ✅ |
| Salathe：EPP 核心＋上方、前方 ABS 部分硬殼 | Edelrid 產品頁 | ✅ |
| BD 台灣官網有 Capitan E、Vision | 未查 | 🟡 Unverifiable |

### 判準來源

| 宣稱 | 來源 | 結論 |
|---|---|---|
| Petzl 台灣三分法（硬殼 300 多克／發泡殼 200 多克／混合殼不到 200 克；親民／中間／最高；Boreo、Borea／Meteor／Sirocco） | Petzl 台灣頭盔指南（2026-07-01） | ✅ |
| Petzl 台灣：頭圍量法、多數兩個尺寸、預留空間加頭巾、有些狹長有些圓要試戴、CE 或 UIAA 其一即可、發泡變形後必須淘汰 | 同上 | ✅ |
| REI 兩種構造、多繩距／登山選泡棉殼、涼天單繩距運攀可選硬殼、三步試戴、Y 字帶、天冷重調 | REI Expert Advice | ✅（REI 另寫「hardshell 也叫 suspension／hybrid helmets」，正好支持文中 Boreo 命名的例子） |
| DAV：硬殼耐落石與多次撞擊、泡棉單次吸能最好；「Styropor eher für alpines Sportklettern, Hartschale für klassisches alpines Gelände」 | DAV Panorama 5/2010 PDF | ✅ |
| UIAA 106／EN 12492 圖解五項（5 kg／2 m、EN ≤10 kN／UIAA ≤8 kN；側向 0.5 m／60°；3 kg／1 m 穿刺；下巴帶 500 N、≤25 mm；滑脫） | UIAA 2020 圖解 PDF | ✅ |
| Petzl 2020 年起所有休閒頭盔標 TOP AND SIDE PROTECTION，保護超過 EN／UIAA 標準 | Petzl US News 2020-01-14 | ✅ |
| UIAA：合身影響頭盔和吊帶的保護能力、各品牌尺寸差很多、看原廠尺寸表 | UIAA Ten things（2026-02-24） | ✅ |

### 評測結論

| 宣稱 | 來源 | 結論 |
|---|---|---|
| Switchback：Boreo 最便宜也最耐用之一；Capitan E 合身令人失望；Salathe 可能是輕和耐用兼顧最好；Half Dome 因比 Boreo 重又不耐用被移出；舊版 Meteor 首頂 CE 登山滑雪認證 | Switchback 2026 | ✅ |
| Climbing.com：Boreo 測過最重之一；Sirocco 2024 改版後大頭不舒服；Half Dome 合身與襯墊被抱怨；Wall Rider 2.0 適合整天在大岩壁 | Climbing.com 2026-10-08 | ✅ |
| OGL：Capitan 正成為新手第一頂；泡棉頭盔模壓定形、頭帶改不了形狀；Meteor「light enough for all-day use, yet durable enough to withstand plenty of abuse」；Sirocco 外露泡棉凹痕累積；MIPS「reportedly」 | OGL 2025-09-10 | ✅ |
| Vision 被三份評比列最佳整體／全能 | OGL（Vision Mips Best Overall）、Switchback（Best Overall）、Climbing.com（Best All-Around） | ✅ |
| Treeline：Capitan E 偏小；Crag Sender 適合小頭 | Treeline 2026 | ✅（Treeline 同段也寫 Crag Sender「Runs large」，見需要人判斷） |
| UKC：Crag Sender 可能不是最耐用、耳邊帶子不好調 | UKC 2024-12-15 | ✅ |

### 影片（9 支，逐支對字幕與說明欄）

| 影片 | 核對 | 結論 |
|---|---|---|
| s5ZLd-kCCRs Hard Is Easy | 8:45 起兩類頭盔、11:15 前後朋友頭盔飛機上裂、5:42「shitty science」、Mammut 贊助（片中＋說明欄） | ✅；「10:00 前後他建議看泡棉有沒有延伸到殼邊」→ 字幕 10:20 Ben 講「看頭盔往下包多低」，「泡棉延伸到殼邊」是接著以 Mammut 頭盔為例的「we」段 → 🔴 已改歸因與時間 |
| kPF_Cq6HN-8 こうたろ | 24:00 起 Grivel Japan fit；26:15 店員「欧米系の人の頭の形…日本の人頭丸い」；30:45 貼紙下藏傷；說明欄附店家連結、無業配聲明 | ✅（頭型那句在 26:15，仍在 24:00 起的段落內） |
| yF1mFLjZ43U WeighMyRack Sirocco 2024 | 2:30 起後方→耳邊 Y 字→下巴帶；講者用「we」是 Petzl 的人；片中 USD 130 與原廠 169.95 不同 | ✅ |
| BNOFCW-aPQo ヤマノ（只連結） | 3:00 欧米ブランド縦長寄り、試着省略しない；11:15 試戴清單；說明欄 Amazon アソシエイト | ✅ |
| 2ILJc9c0nAw UKClimbing | 標題、頻道、2024-05-07；4:30「90 95% of climbers」；7:00 偏好 Capitan cradle、Vapor 細繩磨耳；說明欄無揭露 | ✅；「2:30 起 Vapor 要小心收」實際在 3:30 → 已改成「2:30 起 Capitan 較耐用，3:30 起 Vapor 要小心收」 |
| 853ikVs_Njc TREEfool | 片頭十年前朋友墜落撞岩階、直升機吊離；1:00 Boreo；2:00 塞毛帽；2:45 Meteor 凹痕；說明欄「I AM NOT SPONSORED! I paid for this gear myself」 | ✅ |
| 3nzf-BeP8jc EpicTV | 1:00 Capitan、2:00「Black Diamond gave me the Capitan…before it was even released」、2:30 側後包得低／後方系統戴手套難調；3:00 Boreo；4:00「bulbous」；4:30 丟車後；說明欄 EpicTV 商店短網址 | ✅ |
| a1tyi6J52O0 Adventure Rig | 0:30 MIPS、1:30 包覆與毛帽、2:30 泡棉回彈與頂殼刮痕、3:30 頭燈扣 | ✅；揭露 🔴：文中「說明欄有 Amazon 連結，沒寫是否為聯盟」，說明欄實寫「we get a small kickback」與「We received the Vision MIPS for free in exchange for a review」→ 已改 |
| 2ApEUY53nYs Ryan Tilley | 0:00 Petzl 寄新品；0:45–1:30 只認證頂部的錯誤說法；3:45 看側邊；4:30 四個凹痕一道裂；6:00 輪流用；12:45 Meteor 比 Sirocco 緊、找不到合頭的 Petzl | ✅；壽命 🔴：原文「大約撐五年」，字幕是「three or four years, maybe five」→ 已改「三到五年」 |
| 2YiaTqWOypo WeighMyRack 5 Lightest | 1:00 EPP 回彈；3:00 實秤有重有輕、「no reason to assume malintent」；結尾改戴 Salathe Lite（文中寫「另一頂」）；說明欄比價連結 | ✅ |

### 統計

- 🟢 Confirmed：32（原廠規格價格 14、判準來源 7、評測 6、影片 9 支中的其餘描述合計計入）
- 🟠 Outdated：1（Meteor 台灣價對應舊版）
- 🟡 Unverifiable：2（Simond M/L 頭圍、BD 台灣官網上架款）
- 🔴 Contradicted：3（Adventure Rig 揭露、Ryan Tilley 壽命、Hard Is Easy 10:00 段歸因）＋1 處時間碼偏移（UKC 2:30）

歸因標籤：正文「這是原廠說法」「這些都是廠商說法」「是個人看法，不是量測資料」等共約 4 處，集中在 MIPS 與側面保護兩段，屬必要但書；不建議再加。

## post-review

- frontmatter：title／description／tldr／series order 6／type guide／tags（皆既有 tag）齊全；glossary 帶過原文的「EPS 頭盔」（aliases 多「發泡殼」），另加 EPP、MIPS。✅
- tldr 與內文一致：三分法、Boreo／Capitan E／Meteor／Crag Sender／Sirocco 的建議、試戴三步、亞洲頭型提醒都在正文有出處。✅
- 結構：開頭情境＋系列定位 → 四個判準（每節有「今晚就能做的事」）→ EN／UIAA 摺疊 → 7 款比較表＋讀規格注意＋三款只帶一句 → 影片 → 三種情況 → 檢查與汰換（連 order 12）→ 4 題練習 → 下一步（order 7 快扣）→ 延伸觀看 → 參考資料。符合 writer-brief。✅
- 系列連結：第 0 篇、第 3 篇吊帶、第 7 篇快扣、最後一篇檢查汰換，slug 與 plan.md 一致；英文版全部 `-en`，跨語言連結正確。✅
- 拆分比對（原文 `2026-10-19-climbing-harness-helmet.md` 頭盔半）：REI 兩分表的內容併入新三分法段（REI 兩分法、優缺點保留）；DAV／REI 兩派建議、Hard Is Easy s5ZLd-kCCRs（start 525）與說明、REI 試戴三步、戶外確保連結、今晚動作、EN 12492／UIAA 106 摺疊全文、練習題 4（頭盔那題，改成第 1 題）、EPS glossary、Hard Is Easy 頻道介紹全部帶過來。HowNOT2 頻道介紹改指向第 3 篇（原文是因吊帶影片才介紹，合理）。無遺漏。✅
- 中英對應：數字、型號、影片 ID 與 start、連結一致（英文引言「under 1,000 to nearly 6,000 Taiwan dollars」對中文「八百多到五千多」，等價）。本次 5 處修改中英同步。✅
- `check:tw`：0 blocking、0 to review。

## post-polish

`register-scan.sh`（修改後）：
- 長句 18 句（最長 107 字 Hard Is Easy 段、102 字側面保護段）：Hard Is Easy 段資訊多（分類、裂盔、看包覆、個人偏好、爛科學、贊助），可考慮在「Ben 自己偏好泡棉殼」前斷段；其餘 66–81 字多為來源轉述，可讀。未改。
- 但書密度 8%，正常。引述區塊 0。模板化轉折 0。英文術語 0。
- 數字密度 4–6 個的 8 段，全是影片時間碼段與標準測試值，讀者要用來跳轉，保留。
- 研究者姓名當主詞 1 處（Ryan Tilley 段），是影片主角，保留。

## 直接修改（中英同步，共 5 處）

1. Hard Is Easy 段：「10:00 前後他建議看泡棉有沒有延伸到殼的邊緣」→「10:20 前後他建議看頭盔往下包得多低；接著片中拿 Mammut 自家頭盔說明，泡棉要延伸到殼的邊緣」。
2. Adventure Rig 段：揭露改為「說明欄寫明頭盔是免費提供、換取評測，Amazon 連結有分潤」。
3. Ryan Tilley 壽命：「大約撐五年」→「撐三到五年」。
4. Meteor 價格欄：補「台灣官網上架的是舊版」。
5. UKClimbing 段：「2:30 起 Vapor 要小心收」→「2:30 起 Capitan 較耐用，3:30 起 Vapor 要小心收」。

## 需要人判斷

- Treeline 對 Crag Sender 同時寫「適合小頭」與「Runs large」，表格只引前者；要不要並列。
- Meteor 台灣官網賣的是舊版（225／240 g、48–58／53–61 cm、有 CE 登山滑雪認證），表格規格是 2026 新版；是否在「讀規格注意」加一句提醒台灣買到的可能是舊版。
- UIAA Ten things 2.4 明寫頭盔不應買二手；練習題 4 目前只引 Petzl 退役條件，可考慮補 UIAA 這句（屬加內容，未改）。
- Hard Is Easy 段 107 字，是否在「Ben 自己偏好泡棉殼」前斷段。
