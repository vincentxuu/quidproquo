# Review: 2026-10-19-italy-crag-rocche-del-crasto（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-rocche-del-crasto.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-rocche-del-crasto.md`。系列〈義大利岩場〉order 1904。作者自審（同一個 agent 寫稿與審稿，非獨立審稿）。

工具降級（toolDegradation）：見研究筆記。主要靠 Exa web_fetch 讀頁、Groundlane web_search 找頁、curl 抓 Climbook、本地 tesseract OCR 掃描檔命令。

## post-verify

本 session 開啟的來源逐條對照（2026-10-19）。

- 🟢 內布羅迪公園分區頁（一手）：A 區 24,546.513 公頃，含「alcuni affioramenti rocciosi (Rocche del Crasto)」；A 區允許的活動清單（步行、騎馬、既有道路開車、放牧、農林）——沒有提到攀岩，正文照此寫。
- 🟢 公園兀鷲頁：復育在 Rocche del Crasto、約 35 隻、那一年 9 個巢、7–8 月離巢（頁面無年份，正文寫「那一年」）。公園巢穴監測頁：金鵰與兀鷲巢旁攝影機。公園 Rocche del Crasto 頁：岩性描述、三個村、A 區步道、牲畜、聯絡電話 0921 333015。
- 🟢 L.R. 98/1981（經 14/88 修正）條文：禁止捕捉、傷害、驚擾動物，禁止野外生火。
- 🟢 Planetmountain Artino's Wall：16 條、4a–8b（頁首）、朝南、70 m 繩、slab、2012 年 Flaccavento 與 Barbagallo 由上往下開、難度多未確認、A20 Sant'Agata 出口 15 km、Portella Gazzana 路況差、Artino 小館停車可問資訊、10 分、頭盔；16 條逐列名稱、長度、難度對照。
- 🟢 Planetmountain 2012：Il Paradiso all'improvviso 7c、180 m、6 段、2009–2012、2012-04-15 首次自由攀登；Sognatori 6b、110 m、2011。Sognatori 路線頁：SW、110 m、1,054 m、6b／必要 6a、4 段分段、器材、17 km、S. Nicolò、Il Grifone、Contrada Cammara、10 分、L1 roccia delicata。Planetmountain 2017（Traura）：落差 350 m 以上、岩質不一定好、2015 年 1 月積雪、沒有難度。
- 🟢 Militello Rosmarino 市府交通頁（2024-02 發布）：Sberna 週一到週六，8:00 車站、8:35 Alcara。
- 🟢 UKC、VisitSicily 引句、內政部 112。
- 🔵→已修：3a、4a、4c 的 YDS 原手填 5.3／5.5／5.7，腳本對照表是 5.2／5.4／5.6 → 改正（中英）。
- 🔵→已修：Il Paradiso all'improvviso 的連結路徑誤打成 `/it/notizies/` → 改為 `/it/notizie/`。
- 🔵→已刪：「關好經過的柵門」來源沒寫，刪除改成「不要驚擾」。中英同步。
- 🟡 季節沒有直接來源，正文明寫是由朝向、海拔與 UKC 全島說明推測。

本次只檢查了文中已提出的宣告，未評估覆蓋是否完整（覆蓋交 post-review）。

## post-review

- 機械檢查：`node scripts/climbing-grade-convert.mjs --check` 中英兩篇通過；`check-tw-terms` 0 blocking、0 to review；`check-lang-parity` OK；`check-process-leak` 無輸出；`check-post-quality` 本篇有 1 個 WARN：tag `multi-pitch` 在中文版找不到對應英文字（中文寫「多段」，英文版有 multi-pitch），判定 tag 貼切、保留。
- 結構對照契約：導言末句交代本篇幫讀者決定什麼 → 這是什麼樣的岩場（含規模表）→ 什麼季節去（來源表）→ 怎麼去（大眾運輸／開車／停車）→ 去之前要知道的規範（含 112）→ 依程度挑路線（四級 H3，標題用 HEAD 寫法，換算說明固定句）→ 查資料的入口（含「指南書」條目，第一句固定）→ 參考資料，對齊 ✅。
- frontmatter：date 2026-10-19、category climbing、type guide、series 中「義大利岩場」／英「Italy Climbing Crags」、order 1904；tags 照範本風格以 sicily 收尾（與既有 San Vito 篇一致）；tldr 先講岩場本身，再講最會改變行程的一件事。
- 連結：導言連系列總覽（英文連 `-en`）；只連已存在的聖維托篇與同批由我寫的西西里篇；首次出現的來源、營運者、公園都有 inline 連結。
- 中英對等：英文版逐段對應，引號原文保留，義大利文來源在英文參考資料標 (in Italian)。
- 覆蓋：網路資料很少，正文開頭就交代；規模直說沒有總數；季節表只列有來源的朝向與海拔，最佳月份標明是推測；高手級寫「來源沒列」並說明頁首 8b 與表內最高 7c/7c+ 的落差。
- 讀者位置：給出 Sberna 巴士的實際班次（標市府轉載），也直說村子到岩場沒有步行資訊。
- 規範：公園 A 區、兀鷲金鵰築巢、牲畜都用一手公園頁；沒找到攀岩專屬規定就直說並給聯絡電話。

## post-polish

- register-scan 第一輪：長句 9 句（最長 120 字的開車路線、112 字的 Rocca Traura 句）、但書段落 3/28（10%）、引述區塊 0、姓名當主詞 0、模板化轉折 0、一般英文術語 0；數字密集段 3。
- 已改：Rocca Traura 句拆成「落差與外觀」「岩質不一定好」「他們開的路線」三句；開車路線 120 字拆成三句；導言 UKC 句與官方觀光網站句分成兩句。
- 已刪查證過程字樣：「山區手機訊號這次沒查到」改成具體動作「出發前跟住處或 Artino 小館說好行程與回程時間」；指南書條目刪掉「到 2026 年 10 月還沒查到」。中英同步。
- 保留：Militello Rosmarino 交通段 88 字，是時刻表轉述；保護片段未動。改後 grade check、check-tw、check-process-leak 通過。
