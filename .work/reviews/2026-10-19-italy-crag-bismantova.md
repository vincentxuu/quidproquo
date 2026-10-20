# Review: 2026-10-19-italy-crag-bismantova（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-bismantova.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-bismantova.md`。系列〈義大利岩場〉order 801。作者自審（同一 agent，依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane MCP 可用（falesia.it、Montagna.TV、Gazzetta di Reggio、SETA）；theCrag 用 Exa web_fetch_exa；thetopo、Climbook、montagneterne、Stecchezzini 只用 Exa 搜尋回傳的頁面摘錄；Versante Sud 用 curl；SAER 頁 upstream closed 沒讀到。

## post-verify

- 🟢 theCrag：475 條、「Mostly Sport climbing」、「The biggest and most iconic crag of the region」、「Brittle when wet」「Wet in rain」、接近 5–10 分鐘、Piazzale Dante 一早滿、路邊停車、Rifugio La Pietra 與 Foresteria San Benedetto、兩條鐵索。Gare Vecchie：東南向、午後陽光、「Smeary climbing on slopers」、baby 區、Uccelli di rovo 6a ★★ 20m、Silver Cat 6a+ 25m、Porco Spit 6b+ 10m 4 bolt、Babu e panone 7a 15m、Via degli Svizzeri 5 130m 4 段 Voltolini 1922。
- 🟢 falesia.it：更新 04/09/2026、30 區 452 條、2a/8c、930 m、「la più interessante e completa」、FERLE 與不鏽鋼鍊、Fisher、下降鉤環磨損警告（原文照引）、「arenaria compatta, sovente levigata dall'acqua」、平衡與技術、12 個月、主朝東、14 點後北／東北陰影、上半部邊緣落石與週末不要頂繩、5–15 分鐘、三條公路距離、招待所與酒吧。Danger in Trip：A2/A4+、1998、4 段、「La roccia é la TENERA!! arenaria」、人工器材清單。Fiorirosa：8a/8b、22 m。
- 🟢 Montagna.TV 2023：1 km／240 m／300 m、calcarenite、泥灰岩、1,500 萬年、872 m 停車、約 3 km、697 號步道遊隼築巢與落石、1922 Voltolini、Levati 七級、80 年代重打與鑿點爭議、「oltre 300」「la più grande palestra」、鐵索 1971／2017。
- 🟢 Montagna.TV 2021：頂部禁極限運動與登山車／電動車、ZSC、本篤會借用、BASE 2018 死亡、電動車壓出路徑。Gazzetta di Reggio 2025：Nucleo Parco 巡查、Legge 6/1989 嚮導、Delibera 10/2021。
- 🟢 SETA 44 路：2026-09-15 起、CIM 06:05、07:11、08:15、09:45、10:30。Versante Sud：Filippi、Bertolotti、第 2 版、2021、ISBN 9788855470346、義文、空拍照、Available。CNSAS：112。
- 🟢 路線表：thetopo 與 Climbook 逐條對照（並列處：Minnie 5a／5、Nino Marchi L2 5b／5+、Svicolone 5c／5+、Pronto soccorso 5c／6a、Silver Cat 6a+／6a、Passeri e penne 6b／6a+、Rainbow warrior 6c+／7a）；長度對 montagneterne；多段資料對 montagneterne 與 Stecchezzini（Zuffa-Modoni 1960 第一條人工攀登）。
- 🔵→已改：Nino Marchi L2 備註原寫「留言另有人標 5c」，Climbook 原文是「5c in un'altra relazione」，改「另一份 topo 標 5c」。
- 🔵→已改：Danger in Trip 岩壁原寫「東側岩壁」，來源沒寫，改「來源沒列」；Via degli Svizzeri 原寫「Gare Vecchie 上方」，改成 theCrag 的寫法（從 Gare Vecchie 區起攀、東南面）。
- 🔵→已刪：「適合冬季以外」與 falesia.it「12 個月」矛盾，改成「Parma、Reggio Emilia、Modena 一小時車程內」；「砂岩吸水後點會斷」超出 theCrag「Brittle when wet」，改成「變脆」；「Reggio Emilia 有火車站」沒有開到來源，刪掉。中英同步。
- 🔵→已改：Crolling stones 原始難度欄原寫「6a+、6b、6b+、V」，換算腳本在傳攀表會先抓 UIAA 的 V（5.6），改寫成「最難 6b+（…）」讓換算對到 5.10d。
- 🟡 國家公園規定只找到媒體報導（Montagna.TV、Gazzetta di Reggio），正文標「二手」並請讀者看公園官網；沒有找到針對岩壁的遊隼繁殖期封閉命令。

## post-review

- 機械檢查：`climbing-grade-convert --check` 中英各 31 列通過；`check-tw-terms` 0 blocking；`check-process-leak` exit 0；`check-lang-parity` OK。
- 結構對齊契約：導言 → 這是什麼樣的岩場（規模表）→ 什麼季節去（朝向表）→ 怎麼去（大眾運輸、開車與停車、接近）→ 規範（公園、嚮導法、遊隼、bolt、頂部落石、人工攀登岩質、救援）→ 依程度挑路線（四級各 5–7 條＋短多段／人工表 7 條）→ 查資料的入口（「指南書」條目第一句照契約）→ 參考資料。
- 運攀為主，四級表都有兩個 DB 交叉；8c 只有 thetopo 單一出處，備註已寫。
- 跨篇連結：系列總覽（中連中、英連 -en）；同批其他兩篇是多羅米蒂高山岩壁，地區與風格不同，不硬連。
- tags 新增 `emilia-romagna`（站上第一篇該大區），其他沿用既有。

## post-polish

- register-scan 第一輪：長句 7 句、但書段落 11%、引述 0、姓名當主詞 0、模板化轉折 0、英文術語 0。
- 已改：歷史段（77 字）拆兩句；bolt 段（83 字）在引述前斷句。
- 保留：SETA 時刻句、公園與嚮導法兩句、表格前導句、指南書條目，多為出處＋時間的查表資訊。
