# Review: 2026-10-19-italy-crag-marmolada（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-marmolada.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-marmolada.md`。系列〈義大利岩場〉order 506。作者自審（同一 agent，依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane MCP 可用；Planetmountain 路線資料欄用 web_extract pattern 讀；UKC、theCrag、特倫托新聞稿用 Exa web_fetch_exa；Dolomiti Bus PDF、Versante Sud、funiviemarmolada.com 用 curl。Linea54 夏季 PDF 已 404。

## post-verify

逐句對照研究筆記中實際打開的來源。

- 🟢 Planetmountain 總覽：「1000 metri d'altezza per tre chilometri」、約一小時到 Malga Ciapela、「più di un centinaio di vie」、cengia mediana、「difficili o molto difficili」、1901 Bettega-Zagonel-Tomasson、「è una parete severa」、3300 m 以上與北面冰河助長雷雨、出口季初濕與 vetrato、兩條 60 m 繩＋friends/nut、錯過纜車走冰河「magari in scarpette」；圖例各路線難度、首登年（Bettega-Tomasson IV+、Pisoni-Castiglioni 5°、Sancho Pansa 5°+、Filo di Arianna 7a+/4 p. cliff、Il Minotauro 7c/A3、Steps across the border 8a、Specchio di Sara 9°-/4 p.）。
- 🟢 Planetmountain 路線頁（web_extract 資料欄）：Pesce 900 m、7+, A2 (7b+)、Koller/Sustr 1981、Falier 1 h 15、2×50 m 垂降到冰河＋滑雪道到中站、Kevlar 細繩；Soldà-Conforto 550 m 15/17 段 7-（必要 6, A1）1936；Gogna 800 m 29 段 7（必要 6, A2）1970；Tempi Moderni 850 m 27 段 VII+ 1982；Vinatzer＋Messner 800 m 28 段 VI+（必要 VI, A1）1936/1969；Don Quixote 750 m 20 段 VI 1979、Falier 到起攀約 1 h；Schwalbenschwanz 750 m 19 段 6 1978。
- 🟢 UKC：Marmolada 200 climbs、「over 200 known routes」、沿用 guidebook 難度；Pesce VIII+、920 m 33 段、Rockfax 引句、skyhook、撤退「a major undertaking」。
- 🟢 theCrag：All day sun、約 200 條／5000 段、兩種下山方式（纜車「up until 4pm」、滑雪道到 Fedaia）、停車在「accesso divieto」、Malga d'Ombretta 1904 m、Falier「20 june - 20 sept」、Bivacco dal Bianco 9 床、「pitons are often favoured over bolts」。
- 🟢 Rifugio Falier 官網：「APERTO DAL 10 GIUGNO 2026」、2074 m、CAI Venezia、「oltre 180 vie」、預約規則、電話線路問題。
- 🟢 Funivie Marmolada：2026-06-12～09-27、首班 09:00、Punta Rocca 末班 16:30。
- 🟢 特倫托自治省新聞稿 3556：2022-07-03 崩塌 11 人罹難、Canazei 鎮長撤銷 zona rossa、area di attenzione 範圍、高溫期可再禁入、兩間北面山屋不能用、步道改線。
- 🟢 Dolomiti Bus：3 路 Agordo 06:02、valido 10/09/2026；4 路 Malga Ciapela 只在 fermate facoltative；城際線頁 1／3／4 路。Autobusweb：54 路恢復、平日 5／假日 3 往返、到 9/9（正文已標二手）。
- 🟢 Versante Sud：約 200 條、2017、ISBN（義 978 88 85475 00 7、英 978 88 85475 02 1）、Giordani 50 多條新路線、有貨。CNSAS：112；CNSAS Veneto：118。
- 🔵→已修：Don Quixote 備註原寫「難段在上半」，Planetmountain 原文只說橫帶以上越來越有意思（「via via più interessante」），改成「中段橫帶以上越爬越精彩」。中英同步。
- 🔵→已修：指南書條目原寫「2017 年之後沒有新版」，沒有來源能證明，刪掉。中英同步。
- 🔵→已標：54 路只有 Autobusweb（交通媒體）報導，官方 PDF 已下架，正文標「二手」。
- 🟡 Falier 關門日只有 theCrag（DB）寫 9/20，正文並列標出處。

## post-review

- 機械檢查：`climbing-grade-convert --check` 中英各 14 列通過；`check-tw-terms` 0 blocking、0 to review；`check-process-leak` 無輸出。
- 結構：導言（位置＋這篇幫讀者決定什麼＋總覽連結）→ 這是什麼樣的岩場（規模比較表）→ 什麼季節去（山屋／纜車表）→ 怎麼去（大眾運輸、開車與停車、接近、下山）→ 規範 → 依程度挑路線（四級＋UIAA 傳攀表）→ 查資料的入口（含「指南書」條目、第一句照契約）→ 參考資料，對齊契約 ✅。
- 四級表：入門、中級「來源沒列」並指向傳攀表；進階 3 條、高手 1 條都是 Planetmountain 圖例的法國級數；傳攀表 10 條保留 UIAA 原始難度。
- 契約「停車」小節：寫成「開車與停車」合併一節（停車只有 theCrag 一句，獨立成節太薄）。
- frontmatter：order 506、tags 7 個（含 mountaineering、veneto）；tldr 先講岩壁再講最會改變行程的纜車末班與冰河注意區；description 為主題清單。
- 跨篇連結：系列總覽、五塔、Civetta 西北壁（507，同批撰寫，通過 grade check 後補上互連）；中連中、英連 -en。
- 讀者位置：台灣讀者從 Belluno 火車＋巴士講起，淡季沒有公車直說。

## post-polish

- register-scan 第一輪：長句 8 句、但書段落 2%、引述區塊 0、姓名當主詞 0、模板化轉折 0、英文術語 0；數字密集段 8 段（最多是指南書條目 15 個）。
- 已改：冰河注意區段（66 字）拆成三句並把建議改成具體動作「照末班纜車排行程」；Falier 住宿句（74 字）拆句；54 路句把站名串改成「從 Falcade 經 Alleghe、Caprile、Malga Ciapela 開到 Pian di Fedaia」。英文版同步改寫冰河句。
- 保留：剩下的長句多是含義大利文原句的出處說明與表格前導；數字密集段是時刻、ISBN、海拔，屬查表資訊。
