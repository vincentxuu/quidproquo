# 審稿紀錄：2026-10-24-climbing-nuts（攀岩裝備 order 10，新篇）

檔案：`src/content/posts/climbing/2026-10-24-climbing-nuts.md`、`-en.md`
日期：2026-10-24
審稿者：獨立審稿（未參與寫稿），照 `.work/climbing-gear-models/review-brief.md`。
已知待決（`review-todo.md` climbing-nuts 四項）不重報。

工具降級（toolDegradation）：Groundlane MCP 本 session 回 `not connected`（試一次即降級）→ Exa `web_fetch_exa`／`web_search_exa` 讀全文；BD、DMM 價格與各號規格用 curl 讀 Shopify `products/<handle>.json` 與產品頁 HTML；UIAA 轉載的 WC 安全通知、BD 舊版說明書用 curl 下載 PDF＋`pdftotext`；BD 台灣頁用 curl＋固定字串 grep。影片字幕與說明欄用研究時 yt-dlp 抓的 `.work/climbing-gear-models/tmp-trad/subs/*.txt`、`desc/*.txt`、`meta.txt`，逐段對起播時間。

## post-verify

### 文字宣告

| # | 宣稱（位置） | 來源（全文讀過） | 結論 |
|---|---|---|---|
| 1 | Superlight Rock 型號 40-RSL、套組 40-RSLSET；原因：海邊環境腐蝕、變弱而斷（召回段） | CPSC 23-247（2023-07-20） | ✅ Confirmed |
| 2 | 「召回範圍是 2017 年 1 月到 2023 年 2 月售出的批次」（召回段、練習題 3） | CPSC 寫的是**美國**售出期間；WC 安全通知（UIAA PDF）定義範圍是「2022-12-31 以前生產的全部 40-RSL／40-RSLSET」，腐蝕在接頭（ferrule）內部、使用者看不出來，新批號開頭 06 以上並有 UKCA 標誌 | 🔴 Contradicted（Misframed）→ **已修** |
| 3 | 一般 Rock、Superlight Offset 不在召回範圍；品名與批號在接頭上 | WC 安全通知列 NOT SUBJECT：40-RWA、40-OFFROCK 等；CPSC：batch code on the swage | ✅ |
| 4 | 練習題 3「在召回範圍內就不要買，也不要拿去龍洞用」 | WC：strongly recommend stopping using immediately（不限地點） | 🔴 縮小了原廠要求 → **已修**為「不要買，也不要用」 |
| 5 | TOCC：BD、DMM、WC 是台灣最普遍三牌；Stopper 最便宜、造型平整、常被繩牽動位移甚至脫出；Wallnut 與 Alloy Offset 有凹槽，「可說是市面上使用效果最好的產品」 | TOCC〈如何打造第一套傳攀裝備〉（陳震宇，2024-07-12，Exa 全文） | ✅ 引述逐字相符 |
| 6 | TOCC nut tool 判準：厚實、硬、不易生鏽不鏽鋼，尾端平面可用手掌敲；該文另講六角岩楔與 Tricam | 同上 | ✅ |
| 7 | BD Stopper #1–2 2 kN、#3 5 kN、#4–5 6 kN、#6–13 10 kN；單顆 USD 13.95–16.95；#5–11 套組 USD 99.95 | BD 產品頁＋Shopify JSON（13 個 variant 價格） | ✅ |
| 8 | （補）BD Stopper #1–2 原廠註明 for direct aid only／should not be used as fall arrest | BD 產品頁、BD 舊版說明書 | 原文漏寫，正文與練習題 4 會讓讀者以為 2 kN 小號可以當保護 → **已補一句**（見下） |
| 9 | BD Offset Stopper #7–11 全部 10 kN；USD 19.95；套組 USD 94.95 | BD 產品頁＋JSON | ✅ |
| 10 | BD Wiregate Nut Tool USD 23.95；尾端可敲 | BD 產品頁（rounded heel for pounding） | ✅ |
| 11 | DMM Wallnut #1 7、#2 9、#3 11、#4–11 12 kN；單顆 GBP 14.50–15.50；1–11 套組 GBP 130 | DMM 產品頁規格表＋JSON | ✅ |
| 12 | DMM Alloy Offset 全部 12 kN；GBP 15.50；7–11 套組 GBP 71 | DMM 產品頁＋JSON | ✅ |
| 13 | DMM Peenut 最小號 4 kN | DMM 產品頁規格表 | ✅ |
| 14 | Trango Offset Nuts #7–11 每顆 7 kN | Trango 產品頁 | ✅ |
| 15 | WC Rock 單顆 GBP 12、14 個尺寸、1–10 套組 GBP 115、原廠頁未列各號強度 | WC UK 兩個產品頁 | ✅ |
| 16 | OGL 三種形狀；offset 正變成最受歡迎、原因是小號 cam 進步；直錐幾乎淘汰、最好判斷最好拆、外開／平行／大結晶較不穩；彎曲三點接觸、仍最常見 | OGL Best Climbing Nuts（Ian Nicholson，2024-10-31） | ✅ |
| 17 | OGL：Alloy Offset Best Overall、平行裂隙較差、難拆；Stopper 受繩拉易走位、pin scar 差；Pro Nut 最好拆、7 個尺寸不足以單獨成套；粗糙岩面偏好 DMM 勝過 BD Offset；Peenut 最佳小號 | 同上（Peenut 獎項原名 Best for All-Around Small Nuts） | ✅ |
| 18 | OGL nut tool：Metolius Torque Best Overall、2.30 oz、USD 20、握把圓、頭窄、孔可鎖螺帽；Wiregate 1.64 oz | OGL Best Nut Tools（2023-05-19） | ✅（OGL 表格另寫 1.62 oz，文字寫 1.64，差異可忽略） |
| 19 | BD 指南「把一套彎曲岩楔排在第一；offset 之後再加」（判準 1） | BD〈How to Build Your First Trad Rack〉：先講 cam；說第一套「definitely include a set of Stoppers, even if it's just a few offset Stoppers」；它的 off-sets 段講的是 Z4 Offset **cam** | 🔴 Misframed → **已修**：UKC 留原句，BD 改成「第一套 rack 一定要有一套 Stopper」 |
| 20 | 艾格單繩距傳攀課清單 BD Stopper #5–11、nut tool | 艾格課程頁裝備清單 | ✅ |
| 21 | tldr「台灣傳攀課用的就是這組」 | 只查到艾格一家 | 作者概括超出來源 → **已改**「艾格探險的傳攀課」（表格「台灣課程」同改） |
| 22 | Mountain Project：多數路線一套 cam 到 3 吋；想全爬要加一套岩楔含 offset 與小號；石英質變質礫岩、大結晶、摩擦大 | MP 龍洞頁 | ✅ |
| 23 | UKC 2014 群測：Wallnut 凹槽偶爾較難拆；Alloy Offset 難拆 | UKC Gear Nuts review 2014-10-15 | ✅ |
| 24 | BD 舊版說明書：每次用前用後檢查、退役條件、別反覆銳角彎折鋼索、碰海水海風要洗晾乾、強烈不建議二手 | WeighMyRack 轉存 PDF | ✅ |
| 25 | 百合搖滾：每次回家濕布擦、金屬器材溫水泡洗 | 原文：濕布擦是每次的「基本清潔」；溫水浸泡是每 2–3 個月的「深度清潔」 | 🔴 Misframed → **已修** |
| 26 | BD 台灣官網把 C4 寫成「CAMALOT C4 .4 岩楔」 | blackdiamondequipment.com.tw 產品列表（固定字串 grep） | ✅ |
| 27 | Climbing Technology Carved Chocks 只找到 CE 聲明 | 未重查 | 🟡 Unverifiable |
| 28 | 中日韓文沒有 2020 後評比岩楔型號的影片；Wallnut、Rock 2020 後無專文評測 | 否定句，未重查 | 🟡 Unverifiable |

### 影片（字幕逐段核對）

| 影片 | URL／標題／頻道 | 起播與文中描述 | 贊助揭露 | 結論 |
|---|---|---|---|---|
| UKClimbing〈Buying your first Trad Rack〉 | ✅（meta：2025-09-01） | 1:31「no moving parts…obvious from visual inspection」「for the price of 11…a single camming device」✅；1:06 起「first…a set of wires, sizes 1 to 11」、2:16「at the very least one full set…second set」✅；11:13 Alloy Offset：leader 最滿意、second 要多搖、替換一套 Wallnut 對應號數、對應 Wallnut 4–8 ✅；start 91＝1:31 ✅ | 說明欄連 DMM 官網、未寫贊助 ✅ | ✅ |
| JB Mountain Skills〈Building a Trad Climbing Rack in 2025!〉 | ✅ | 9:55 早期混帶 Wallnut＋Rocks ✅；「現在只帶兩套 Wallnut」→ 原話「1 to 11 and then another set of 1 to 7」 | 只有咖啡打賞、T 恤 ✅ | 🔴 小錯 → **已修**「一套完整、一套只到 7 號」；16:36「starting out in the UK, buy that set of nuts…cams if you got the money」✅；start 595 ✅ |
| EpicTV〈Nuts Or Cams? James Pearson…〉 | ✅ | 0:00 預算有限先買 nuts、便宜、學放置 ✅；6:28 Pembrokeshire「double if not triple rack of nuts」、Indian Creek 幾乎不帶 ✅ | 說明欄：Wild Country athlete、EpicTV Shop WC 商品連結 ✅ | ✅ |
| JB Mountain Skills〈Half Nuts vs Offsets〉 | ✅ | start 89＝1:29 開始比較 ✅；2:15 窄端先放、寬頂擋視線 ✅；4:26 單股鋼索、多數尺寸 6 kN ✅；結論二擇一、預設 Offset ✅ | 說明欄兩款 bit.ly 短網址 ✅（另有相機器材 amzn.to 連結，與岩楔無關） | ✅ |
| Valhalla〈How to Build a Standard Trad Rack〉 | ✅ | start 107＝1:47「big nuts…standard Black Diamond set…heavy…#5 up through #11」✅ | 只連自家部落格 ✅ | ✅ |
| HowNOT2〈Climbing Nut & Hex Break Tests〉 | ✅ | 3:20 6 kN 組：8.8／7.2／7.98 kN 都超過；brassy「broke where it met the carabiner」✅；4:57 10 kN 組全部超過 ✅；說明欄「rated based on the wire」✅ | 自家商店、會員折扣 ✅ | ✅ |
| Ryan Tilley〈Beginner trad rack remake〉（只連結） | ✅ | 7:49「I do really like the ones with the clipper…don't have to have a separate carabiner」✅ | — | ✅ |
| Skills for Climbing〈Trad Climbing Rack for Beginners and Experts〉（只連結） | ✅（meta 標題後綴 "(and equipment)"，可接受） | 8:44 不帶大號岩楔，原因「smaller size cams are faster to place, faster to remove」；文中寫「小號 cam 已經取代了它們」比原話強 | — | 🔵 Misframed → **已修**「同樣尺寸用小號 cam 放得快、拆得快」 |

### 統計
- Confirmed 31（文字 24＋影片 7，其中 JB 2025 一支部分修正後計入 Contradicted）
- Outdated 0
- Unverifiable 2（#27、#28；review-todo 已列的 CAMP Pro Nut、Metolius Torque 不重算）
- Contradicted 6（含 Misframed：#2 召回範圍、#4 召回處置、#19 BD 指南、#25 百合搖滾、JB 兩套 Wallnut、SfC 取代）——全部已修
- 另：#8 漏寫安全限制（已補）、#21 概括超出來源（已改）

全篇歸因標籤（「OGL 說」「TOCC 說」類）約 10 處，型號評比文本來就靠來源，屬必要；未建議合併。

### 直接修改清單（中英同步，共 12 處）
1. tldr：「台灣傳攀課」→「艾格探險的傳攀課」／"Adventure Taiwan's trad course"。
2. 型號表 BD Stopper：「號數和台灣課程一致」→「艾格課程」。
3. 判準 1 結尾：BD 指南歸因改寫（UKC 原句保留；BD 改為「第一套 rack 一定要有一套 Stopper」）。
4. 判準 2：Skills for Climbing 的理由改回原話。
5. 判準 3：BD Stopper #1–2 補「原廠註明只用於人工攀登，不當墜落保護」。
6. 召回段：範圍改為「2022 年底以前生產的全部」，美國售出期間改成括號附註；補「腐蝕在接頭裡、看不出來」「新批號 06 以上＋UKCA」；拆成兩段（數字密度）。
7. 召回段末：UIAA 連結移到段首，句尾改「對照上面那份 UIAA 轉載的原廠通知」（避免同段兩次同連結）。
8. JB 2025 影片：「兩套 Wallnut」→「一套完整、一套只到 7 號」。
9. UKC 11:13 段：69 字長句斷開。
10. 檢查與汰換：百合搖滾的清潔頻率改正。
11. 練習題 3：召回範圍、看不出腐蝕、「不要買也不要用」、新批號判斷。
12. 練習題 4：補「有些原廠註明 2 kN 小號只用於人工攀登（例 BD #1–2）」；英文另把 "one Taiwanese guide" 改 "one Taiwanese article"（避免讀成嚮導本人）。

### 需要人判斷
- WC Rock 各號強度：原廠頁沒列，但 UKC 2014 群測寫 #1 7 kN、#2 以上 10 kN；WC 說明書／DoC 可能有。要不要補（標來源年份），還是維持「原廠頁未列」。
- TOCC 自己的「預算有限」配置是 cam 7 支＋**DMM Wallnut 1–11**；本篇 tldr 第一推薦是 BD Stopper #5–11（依艾格課程）。兩者都有來源，是否在情境段點出 TOCC 這組。
- 練習題 4 補了 BD #1–2 的限制，屬安全補充而非數字更正；若作者想保持題目簡潔可再調字。

## post-review

- frontmatter：title／date／category／type guide／series 攀岩裝備 order 10 ✅；tags 用既有 tag ✅（加 taiwan 已在 todo）。glossary 四條，中英對應；英文 nut tool 少一條 context（台灣叫法），對英文讀者不需要 ✅。
- tldr 與正文一致（修正後「艾格」用詞同步）✅。
- 結構：開頭兩段（是什麼、只回答買哪套、技術連 trad-protection）→ 四個判準各有「今晚就能做的事」→ nut tool 小節＋表 → 6 款主表＋未列理由＋召回 → 影片 6 支＋2 支只連結 → 依情境 → 檢查與汰換（連 order 12）→ 練習題 4 題 details → 下一步（order 11 cams）→ 參考資料 ✅。
- 系列連結：上一篇 prusik-cord 結尾連到本篇「第 10 篇」✅；本篇下一步連 `2026-10-24-climbing-cams` ✅；inspection-retirement、trad-protection、crack-climbing-technique 檔案都存在，英文版連 `-en` ✅。
- 中英對應：型號、價格、kN、影片 ID、start 秒數、連結逐列對過一致 ✅。
- 技術不重講：放置、拆法只連 trad-protection；HowNOT2 夏威夷實測指向該文而不重嵌 ✅。
- 新篇，非拆分篇，無原合併文要比對。
- `pnpm -s check:references` 無 nuts 相關錯誤；`check:tw` 0 blocking。

## post-polish

- `register-scan.sh`（修改後）：長句 1 → 0（UKC 11:13 段已斷）；但書 6/86 段（6%）；引述區塊 0；模板化轉折 0；研究者姓名當主詞 0；一般英文術語 0。
- 數字密集段 8 段：判準 2 兩派號數、號碼對照、判準 3 兩條 kN、召回段（日期）、HowNOT2 兩段、練習題 4。都是讀者要拿去比對的門檻值或日期，保留；召回段已拆成兩段，JB 段已把「1–11、1–7」改成文字減少數字。
- `check:tw`：1 個 WARN「頭部」（物理語境，指岩楔頭，不改）。
- 讀起來的問題：沒有明顯卡住的段落。判準 3「來源不一致時」那條（CAMP Pro Nut）屬 todo 待決，未動。
