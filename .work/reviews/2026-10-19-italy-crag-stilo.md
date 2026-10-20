# Review: 2026-10-19-italy-crag-stilo（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-stilo.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-stilo.md`。系列〈義大利岩場〉order 1802。作者自審（依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane 搜尋可用；大區觀光網 www 網址 404，改用 Exa 搜尋摘要讀非 www 版；Planetmountain、falesia.it、Climbing Spot Factory、RFI PDF 用 Exa；Climbook 路線表以 curl 抓 PDF 再 pdftotext。

## post-verify

- 🟢 Planetmountain Grotta：22 條、6b–8b、SE、80 m 繩、作者 Cammara、「one of the finest of its kind…」、東向曬到 14 點、下雨可爬、長雨後滲水乾得快；開車與停車（第五個髮夾彎 4–5 台、5 分鐘到 Grotta、墓園步行 10 分鐘到 Gaia）；表內 12 條路線長度與難度逐條核對。
- 🟢 Planetmountain 2013：2006 第一屆 Calabria Rock、Filocamo 與 Vitale 帶隊、出身卡拉布里亞、之後 Faletti、Cammara 等人開新區。
- 🟢 falesia.it：75 條、4a/9a、386 m、東南、6 月 15 點全區陰影、Gaia 整天陰影、8 區數字、Cattivi Poppanti 10 條 5a/6a、4 條多段長度與難度、石板路封閉就停墓園。
- 🟢 theCrag：74 條、7 區、500–689 m、無警告、代表路線 Senza uscita 4a 三星、Calabria Rock 7b 三星。
- 🟢 Climbook：6 區合計 103 條；Grotta 2025 年 8 月更新；表內 Climbook 難度、星等、重複次數逐條核對（Antz 9 次、Laura non c'è 8 次、Gaia 7 次、Calabria rock 五星 3 次、La collera del turco 備註舊資料 7b、DG22 9a 0 次）。
- 🟢 Climbing Spot Factory：Filocamo 編、季節標示、四級皆 Ok、適合小孩、100+、550 m、墓園 20–30 台、Cattolica 路牌、第五個髮夾彎 5–8 台、never crowded、植物與每年整理兩次、10 mm 不鏽鋼錨栓與 Gaia 三條 8 mm、鏈條與 10 mm 快速鏈環、訊號好、Monasterace 再 12 km。
- 🟢 大區觀光網：「one of the most beautiful of its kind in all of southern Italy」、「can be climbed in all seasons, even in the rain」、「always contact the official guides and the local authorities」。
- 🟢 RFI：2025-12-14～2026-06-13、Trenitalia 區間車往 Catanzaro Lido 與 Reggio C. Centrale。Autolinee Federico：區域路線 PDF、Monasterace Marina–Lamezia 機場線。
- 🟢 A Sud：2014、Montel／Radassao、Versante Sud、義英雙語、約 240 頁、ISBN 9788898609024、31 處岩場；CAI 說絕版且過時。
- 🔵→已修：Le ali della libertà、Calabria rock、La collera del turco、Meno male 的難度欄原把 Planetmountain 寫在前面，腳本取第一個級數換算，會讓 Le ali della libertà（6c+/7a）掉到中級；改成 Climbook 在前並重跑 `--write`，路線所在等級與 YDS 一致。
- 🔵→已修：多段路線原試寫「最難 6b+」，腳本的 YDS 欄不接受「最難」前綴；改成原級數，備註寫「只給整條難度」（來源沒有分段）。
- 🔵→已修：「Climbook（各區 2020–2025 年更新）」只核到 Grotta 的 2025 年 8 月，改成只寫 Grotta。
- 🔵→已修：DG22「falesia.it 的 9a 應該就是這條」改成「推測」；「2014 年之後沒有新的紙本」改成「我們沒找到」。
- 🟡 二手：Monasterace–Stilo 巴士只有訂票站資料，正文已標二手。
- 🟡 沒找到任何封閉、禁攀或保護區規定，正文照實寫查了哪些來源。

本次只檢查了文中已提出的宣告，覆蓋交 post-review。

## post-review

- 機械檢查：`climbing-grade-convert --check` 中英 60 列通過；`check-tw-terms` 0 blocking、0 to review；`check-lang-parity` OK。連到同批的 `2026-10-19-italy-crag-orsomarso(-en)` 由本批產出。
- 結構照契約七個 H2 ✅；導言末句說幫讀者決定什麼 ✅；tldr 先講岩場再講交通 ✅；「查資料的入口」有指南書 bullet 且第一句照固定句 ✅。
- 四級都有路線；多段放在對應等級並在備註說明 ✅。高手級說明 Climbook 幾乎沒有重複紀錄 ✅。
- 中英對等：表格列數與內容一致。

## post-polish

- 第一輪：交通段「車站到鎮上」原本一句塞了營運者、二手註記與機場線，拆成三句；停車段把墓園、石板路、封閉時的走法分成三段。
- 數字密集的規模表、季節表是查表資訊，保留；義大利文與英文原句引用保留。
