# Review: 2026-10-19-italy-crag-palermo（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-palermo.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-palermo.md`。系列〈義大利岩場〉order 1902。作者自審（同一個 agent 寫稿與審稿，非獨立審稿）。

工具降級（toolDegradation）：見研究筆記。主要靠 Exa web_fetch 讀頁、Groundlane web_search 找頁、curl 抓 Climbook、本地 tesseract OCR 掃描檔命令。

## post-verify

本 session 對文中每條事實回到研究筆記的來源核對（來源都是 2026-10-19 本 session 開啟）；封閉／禁令類逐條對一手。

- 🟢 巴勒摩市 Ordinanza Sindacale 157/OS（2020-11-25）：命令 PDF 為掃描檔，本地 OCR 後確認涵蓋 Monte Pellegrino 與 Monte Gallo 的 P4/R4 區、有效至「cessate esigenze」；附件 A 的三種禁止進入情形（橙／紅警報、異常大雨後 24 小時、INGV 確認有感地震後 24 小時）與「È VIETATO L'ACCESSO PER LA FRUIZIONE E PER LE ATTIVITÀ DI TEMPO LIBERO」原文一致。
- 🟢 Ordinanza 80/2019（市府新聞頁）：Favorita 公園 Viale Diana／Viale Regina Margherita 側 P4 區，黃／橙／紅警報時限制。保護區公告頁 2026-10 仍列此命令。
- 🟢 Via Monte Ercta：la Repubblica 2020 寫 2011 年底起封閉；保護區公告頁列 Ordinanza Dirigenziale 407（2019-04-01）標題「chiusura al transito pedonale e veicolare」。命令全文未開（研究筆記 Dropped），正文只寫標題所示內容。CSF「il divieto è ignorato da tutti」原文一致。
- 🟢 PalermoToday 2025-12-29：10/14、11/14 落石、人行道與自行車道封閉路段、限速 30、Piano Landolina 步道封閉；Ordinanza 233/2025 的號碼與日期出自保護區公告頁標題。
- 🟢 Ordinanza 1040/2026：Vergine Maria、Addaura 上方岩壁鞏固工程，兩側全天禁停。
- 🟢 保護區守則 PDF：無醫療、飲水、廁所；禁露營、過夜、生火；惡劣天氣勿經岩壁下。Amica News（標二手）Ferragosto 2026 禁令。
- 🟢 內政部 2019：NUE 112，113/115/118 轉入，免費、多語。
- 🟢 Mountain Project、theCrag（Palermo 499／1,311；Pellegrino 327、各區數字；Bauso Rosso 105 與四區）、Climbook（各區路線數與重複榜、更新說明 2024-01 依 2022 版指南）、CSF Valdesi（150+、30–40 車位、海拔 100 m、秋冬春、806、Via Monte Ercta 路線）、UKC Logbook Schiavo（86 條、W、123 m、1940 年代、上段未知、重新打過 bolt）。
- 🟢 Planetmountain：Pompa Funebre（2011、150 m、8b／7a+、下雨可爬）、Kaos（325 m、7c／7a+、8 段分段、12 快扣、60 m 繩、6 次垂降、燈塔 25 分、Mondello 45 分、2009 年 5 歐元）、Mona Lisa（360 m、7c+／7a+、南風、S2/3、Totem）、Vento d'estate（290 m、6c／6b+、9 段分段、補 cam/nut、Sferracavallo、Sentiero del Gabbiano、40 分、蜱）。Gulliver Canto del Gallo（400 m、6a+／6a、NW、幾乎全程自放、bolt 確保站、第 8 段鬆石）。
- 🟢 AMAT 806 路線頁（路線站序、4 月週末、5 月起每日、頁面無年份）；AMAT 公告頁 10/17–18 改道列 806。
- 🟢 Rockfax（2021-03、ISBN、Palermo 四章、新版準備中）、Versante Sud（2022、560 頁、ISBN、多段另冊）、climbing-guide.eu（Friedl、tmms、2021、136 頁、Capo Gallo、5b–6c、缺貨）；theCrag 的 Grill／Kluckner 說明。
- 🔵→已修：正文原寫「保護區官網的公告頁仍列著同系列命令」放在 157/OS 段落，實際公告頁列的是 80/2019，不是 157/OS → 改成「2026 年 10 月查沒有找到撤銷公告」，並把「公告頁仍掛著」移到 80/2019 那句。中英同步。
- 🔵→已修：「大區民防的氣象警報」連結實為巴勒摩市民防轉載大區警報的頁面 → 改寫為「市民防的大區警報頁」，並補進參考資料。中英同步。
- 🔵→已修：5c+ 換算原寫 5.9，腳本對照表是「約 5.9+」，三列改正（中英）。
- 🟡 Schiavo 是否落在 Ordinanza 80/2019 的 Favorita 範圍、各岩區是否在 P3/P4：沒有開 PAI 地圖，正文明寫要看命令附圖，不下判斷。

本次只檢查了文中已提出的宣告，未評估覆蓋是否完整（覆蓋交 post-review）。

## post-review

- 機械檢查：`node scripts/climbing-grade-convert.mjs --check` 中英兩篇通過；`check-tw-terms` 0 blocking、0 to review；`check-lang-parity` OK；`check-process-leak` 無輸出；`check-post-quality` 本篇無警告。
- 結構對照契約：導言末句交代本篇幫讀者決定什麼 → 這是什麼樣的岩場（含規模表）→ 什麼季節去（來源表）→ 怎麼去（大眾運輸／開車／停車）→ 去之前要知道的規範（含 112）→ 依程度挑路線（四級 H3，標題用 HEAD 寫法，換算說明固定句）→ 查資料的入口（含「指南書」條目，第一句固定）→ 參考資料，對齊 ✅。
- frontmatter：date 2026-10-19、category climbing、type guide、series 中「義大利岩場」／英「Italy Climbing Crags」、order 1902；tags 照範本風格以 sicily 收尾（與既有 San Vito 篇一致）；tldr 先講岩場本身，再講最會改變行程的一件事。
- 連結：導言連系列總覽（英文連 `-en`）；只連已存在的聖維托篇與同批由我寫的西西里篇；首次出現的來源、營運者、公園都有 inline 連結。
- 中英對等：英文版逐段對應，引號原文保留，義大利文來源在英文參考資料標 (in Italian)。
- 覆蓋：兩座山分開介紹，規模表並列 theCrag、Climbook、CSF；季節表標每列出處；交通把公車可到與只能開車的地點分開；規範把一手命令與二手報導分開標示。
- 讀者位置：沒車的人可以只靠 806 到 Valdesi 一帶；Via Monte Ercta 封閉與 CSF 說「大家都無視」並列，給出「到現場問在地人目前合法走法」的動作。
- 已補：四級表每級都有路線，另開傳攀表（Canto del Gallo）；Fatti non foste 只有新聞摘要，放在表外一句。

## post-polish

- register-scan 第一輪：長句 18 句、但書段落 3/48（6%）、引述區塊 0、姓名當主詞 1、模板化轉折 0、一般英文術語 0；數字密集段 8（最高 806 公車段 11 個）。
- 已改：UKC Logbook 談 Schiavo 的 80 字長句拆成三句；806 公車段拿掉「4 月」「5 月 1 日」「10 月 17、18 日」這些細日期，改成「春天先只開週末、5 月起每天開」「10 月中改道公告仍列 806」，數字降到一半，並保留「出發當天查 AMAT」的具體動作。中英同步。
- 保留：開車接近方式三個 bullet 各 65–73 字，是逐步路線指示，拆開反而難照做；落石命令段數字密集，屬命令條文（日期、警報色、24 小時），保留。
- 姓名當主詞 1 處（Pompa Funebre 首攀者）出現在報導轉述句，主詞是 Planetmountain，保留。
- 保護片段（引號原文、數字、連結）回讀未變；改後重跑 grade check、check-tw 皆通過。
