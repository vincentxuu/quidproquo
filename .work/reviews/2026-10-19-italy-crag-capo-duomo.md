# Review: 2026-10-19-italy-crag-capo-duomo（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-capo-duomo.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-capo-duomo.md`。系列〈義大利岩場〉order 903。作者自審（依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane web_search 可用（brave 間歇不可用）；頁面改用 Exa web_fetch_exa（Planetmountain、Montagna.TV、theCrag、AT）與 curl（市政府、Climbing Spot Factory）。Firecrawl 未用。

## post-verify

本 session 打開 12 個來源，抽 30 條宣告逐條對照（交通、出入規定、bolt、防火、救援全數檢查）。

- 🟢 Planetmountain 岩場頁：15 條、5c–7a、30 m、SSE、「una delle più belle falesie affacciate sul mare d'Italia」、灰白石灰岩 a gocce/buchi/concrezioni、技巧與持續、1990 年代中期羅馬與在地攀登者打 bolt、海風鏽蝕、Meraldi 與 CAI Grosseto 不鏽鋼重打、入山路線（第一個圓環左轉、Vallone del Campone 3.5 km、鞍部停車、碎石路 300 m、大轉彎、稜線往塔、陡下）15–20 分、「Andateci in tutte le stagioni」；路線表長度與難度對過；Magnificat 6b+ 80 m（2016、紀念 Iannilli）。
- 🟢 Planetmountain Spigolo Bonatti：Meraldi 2012-08/09、SSE、240 m／350 m、6a、必要 5b、7 段 6a/5c/3c/5b/3a/5c/3a、61＋16 個不鏽鋼錨栓、15 快扣、頭盔、第 5 段易碎、暴露橫渡、第 4 段可左側脫離、第 6 段可繞、碎石下坡、30 分、紀念 Walter Bonatti。
- 🟢 Montagna.TV 2025-01-26：18 條原線＋10 條（3 條月底完成）、新線在左側 19–38 m、舊線 5c–6c+、新線到 8a、評級沿用舊標準、摩擦力好、E/SE 朝向與四季時段、多段冬天只限無風日、1985–86 Rustici/Pozzi、2012 Meraldi、多段 12 mm 316L、2021 Profico Gechi di Maremma 5c–6a、中義天氣差時週末擠滿拉齊奧攀登者、Masala 自費加捐款。
- 🟢 theCrag：38 條、Grosseto 40 分／羅馬約 2 小時、兩區、1985–1995、2012 304 不鏽鋼、2022 春與 2025 冬 316 不鏽鋼 bolt 與鏈條、「Cars are not allowed on the dirt road」、停車座標、300 m 處柵欄擋車不擋人、15–18 分；表內 20 條路線的難度、長度、星等對過。
- 🟢 Climbing Spot Factory：Masala 更新 topo（2025-04）。
- 🟢 Autolinee Toscane 0O1：Orbetello Stazione FS → Porto S. Stefano Molo Garibaldi／Lungomare Navigatori。維基百科：第勒尼安線、區間車與 InterCity、站外巴士。
- 🟢 Monte Argentario 市政府：2025 年火災風險期 6/21 起、延到 9/21、全區禁止燃燒植物、800 425 425。SAST：112、轉 CNSAS。Versante Sud 兩本書頁欄位。
- 🔵→已修：季節表多段區夏天原寫「太熱」，沒有來源 → 改「來源沒寫」。中英同步。
- 🔵→已修：指南書段原寫「新線出在兩本書付印之後或同時」是推測 → 改「Masala 2025 年 1 月前後完成的新線不一定收進書裡」。中英同步。
- 🔵→已記：舊線數量來源不一（Planetmountain 15、Montagna.TV 18）→ 規模表並列。
- 🟡 「港口到停車處約 3.5 公里沒有巴士」：AT 0O1 只到港口，Vallone del Campone 沒有找到巴士路線；正文寫「這段沒有巴士」，依據是路線停靠站。
- 未查到：Capo d'Uomo 鳥類繁殖或保護區限制（未找到任何公告）；0O1 逐班時刻（PDF 未讀，連結附在入口）。

本次只檢查了文中已提出的宣告，覆蓋交 post-review。

## post-review

- 機械檢查：`check-tw-terms` 0 blocking、0 to review；`check-process-leak` 中英皆過；`climbing-grade-convert --check` 中英 44 列通過，YDS 欄中英一致。
- frontmatter：series order 903、名稱中英正確；tags 6 個；tldr 先講岩場（朝向、規模、新線、Spigolo Bonatti）再講會改變行程的事（冬季岩場、週末擠、最後 3.5 km 沒巴士）。
- 結構對照契約：七個 H2 齊全且順序正確；四級路線表都有路線（高手級 1 條，照實寫「只有一條」）；多段在 bolt 運攀表內，Spigolo Bonatti 另附逐段說明；指南書條目首句照固定寫法。
- 停車：用 `### 開車與停車` 合併，含座標與柵欄說明。
- 連結：導言連系列總覽與同批的卡馬約雷、厄爾巴島；Autolinee Toscane、市政府、SAST 首次出現都有 inline 連結。
- 中英對等：所有修正中英同步。

## post-polish

- register-scan：長句 2 句（都在指南書條目）、但書段落 0%、引述區塊 0、姓名當主詞 0、模板化轉折 0、英文術語 0。
- 保留：兩句長句是書目資訊，拆開不利查找。
- 保護片段（引號原文、座標、數字、連結）回讀未變。
