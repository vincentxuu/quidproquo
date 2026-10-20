# Review: 2026-10-19-italy-crag-salento（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-salento.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-salento.md`。系列〈義大利岩場〉order 1602。作者自審（依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane MCP 可用（偶發 CONCURRENCY_LIMIT，重試成功）；Gulliver 用 Exa web_fetch_exa 讀；公園步道 PDF 以 curl＋pdftotext 讀；fseonline.it 502，改讀 fssudest.it；Guardia Costiera 1530 頁 Groundlane／jina／curl 皆 403、Exa 逾時，只有搜尋摘要。

## post-verify

封閉、禁攀、交通、救援全數對照原頁；路線抽查 14 條。

- 🟢 UKClimbing：46 條、NE、57 m、「The major climbing venue in Salento」、2013 Ragni di Lecco 重打、膨脹錨栓、25–30 m、4–7b+、全年可爬。
- 🟢 falesia.it：56 條（37＋19）、4b/7b+、方位南但 14 點後陰影、風大、2020 編修錨栓大多「ottima」少數生鏽、位於自然公園內。
- 🟢 Gulliver（2022-07-03）：Tetto Marino「dal 2022 accesso vietato」、Paretone 50 條、東、4–7c、橋邊停車夏天難停、Leuca 約 6 km、Thai garden／Alligator「Sconsigliata!」、Roten zolen／Dritto pé dritto／Via latina／Zanzare 評語原文核對。
- 🟢 theCrag Ciolo：89 條、分區數字、夏天 12 點起陰影、「Climbing is tollerated」、鎮上 Sentiero il Ciolo 入口、Fico Ninja 6a+ 三星、6a+ 16／6b+ 12／8a 1。
- 🟢 Climbook Tetto marino：6 條、2026-05 依 Puglia Rock 2024 更新、無封閉註記。
- 🟢 Salentoverticale：「Over 100 climbing routes」、告示在峽谷底酒吧免費索取、DWS 約 10 km、約一百條線、Leuca／Novaglie 租船、5–10 月、五個步行可達點與步行時間。
- 🟢 Ragni di Lecco／climbingcasuals／Planetmountain 2013：Mannute 各路線難度與打線人、35 m、平均 10–12 快扣、下降環、東向 11:30 陰影、km 47 停車、紅點、固定繩、暴露岩棚、不適合新手與小孩、Local Hero「il primo 8a della zona」。
- 🟢 la Repubblica 2013、Up-Climbing 2013：NOE、PAI 紅區、缺 Autorità di bacino 許可、市長禁攀令。
- 🟢 Quotidiano di Puglia 2023：PG3 禁游泳航行釣魚下錨、Ciolo 岩壁前 100 m 禁區、Grotta del Fiume–Tre Porte。2024：全市禁露營、罰款扣押、起因露營車。
- 🟢 Il Gallo／Ozanews 2026-10-10：SP358 km 43+400–44+450、10/12 起、平日 7:00–15:30、約 30 天、居民與住戶可通行、SP195 路口到 SS275。
- 🟢 FS Sud Est：3 號線經 Nardò–Casarano、6 號線經 Maglie–Tricase 到 Gagliano L.；2026 夏季 6 號線平日逐筆數得 8 班到站。
- 🟢 Comune Sentiero del Ciolo：約 4 km、1 小時、T、攀岩者使用。CNSAS：112。Versante Sud：Puglia Rock 2024、208 頁、ISBN、前版 A Sud 2006。Climb Europe：15 處、8 處 DWS「no actual routes」、點名 Porto Ciolo。CAI Lo Scarpone：A Sud 絕版且過時。
- 🔵→已修：Settebelloalex 備註原寫「2013 年 Salento Verticale 期間整理（Planetmountain 2013）」，Planetmountain 清單沒標這條重打，改成只列 Gulliver、salentooutdoor。
- 🔵→已修：No reti al ciolo 原寫「2013 年 Davide Schiantarelli 打」，climbingcasuals 沒寫年份，拿掉年份。
- 🔵→已修：「每條約 10–12 個快扣」「scalata in strapiombo」原歸 Ragni di Lecco，實際出自 climbingcasuals，改正出處。
- 🔵→已修：tldr 原寫「多在 5c 到 7b+」，各站範圍是 4b–7b+，改成「難度 4b 到 7b+」；「Ciolo 最難只到 7b+」改「約 7b+/7c」（Cannes 在兩份清單標 7b+/7c）。
- 🔵→已修：YDS 欄原手填，7 列與腳本對照表不符（5c+ 應為約 5.9+、6c 為 5.11a/b、6c+ 為 5.11c 等），清空後用 `--write` 重填。Fico ninja 的 5a+ 不在腳本對照表，欄位維持「—」。
- 🟡 二手標註：Tetto Marino 禁入（Gulliver，無原始命令）、2013 禁攀令（新聞）、海上禁區（2023 新聞）、2026 封路（新聞）、跳水禁止與禁露營（新聞），正文都已寫「二手」並給一手查詢入口。
- 🟡 1530 只讀到海岸警衛隊頁的搜尋摘要（頁面 403），正文未附連結。

本次只檢查了文中已提出的宣告，覆蓋交 post-review。

## post-review

- 機械檢查：`climbing-grade-convert --check` 中英 44 列通過；`check-tw-terms` 0 blocking（「玩法」已改「攀登方式」）；`check-lang-parity` OK；`check-post-references`／`check-post-quality` 本篇唯一錯誤是連到同批的 `2026-10-19-italy-crag-statte(-en)`，該篇由同批另一份工作產出，檔案落地後即消失。
- 結構照契約：導言（位置＋這篇幫你決定什麼）→ 這是什麼樣的岩場（風格表、規模表）→ 什麼季節去（來源表）→ 怎麼去（大眾運輸／開車／停車）→ 規範 → 依程度挑路線（四級＋DWS 段）→ 查資料的入口（含指南書 bullet，第一句照固定句）→ 參考資料 ✅。
- tldr 先講岩場再講最會改變行程的兩件事（Tetto Marino、2026 封路）✅；description 列主題不重複 tldr ✅；tags 6 個含 deep-water-solo、puglia ✅。
- 每級都有路線；高手級只有一條可爬，已說明另一條在禁區 ✅。DWS 沒有路線難度，照實寫「來源沒列」✅。
- 中英對等：結構、表格、二手標註一致。

## post-polish

- 第一輪掃描：長句集中在規範段（2013 禁攀令、海上禁區兩段各 3 句超過 60 字）。
- 已改：2013 禁攀令段拆成「發生什麼／同年評論／沒找到撤銷／現況」四句；海上禁區段把「命令每年檢討」與「深水獨攀就在這種海崖下」拆成兩句；交通段把封路的公里數與「11 月中以前改走步道」分開，給讀者可直接照做的動作。
- 保留：義大利文原句引用（Gulliver 評語、命令字樣）不改；數字密集的封路段是查表資訊，保留。
