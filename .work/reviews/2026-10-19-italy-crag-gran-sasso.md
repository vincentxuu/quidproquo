# Review: 2026-10-19-italy-crag-gran-sasso（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-gran-sasso.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-gran-sasso.md`。系列〈義大利岩場〉order 1301。作者自審（brief 指定 subagent 依三個 skill 清單自審）。

工具降級（toolDegradation）：本篇 Groundlane MCP 可用（web_search、web_fetch、web_extract）。公園規則草案 PDF 沒有文字層可抽 → jina read_url；Magia di Calcare 試閱本 PDF 用 curl 下載、pdftotext 讀；TUA 與 AMA 頁面表格被 Groundlane 抽掉，改 curl 讀原始 HTML。L'Aquila 市府新聞頁 browser render 只回空殼，未讀到。

## post-verify

開了 27 個來源，抽出正文 52 條宣告逐條對照。交通、纜車、山屋、公園規定全數檢查。

- 🟢 Centro Turistico del Gran Sasso（首頁、La Stazione）：9/20 是最後營業日、「Da lunedì 21 settembre 2026 la Funivia verrà chiusa per lavori di ordinaria manutenzione」、SP 17/bis 照常開放；1,115 m 到 2,130 m。沒有重開日期。
- 🟢 pdtx.it（Prati di Tivo 營運方）：2026 夏季 8/15–9/6 每天、之後 9/12、13、19、20；8:00–17:00；10/19 07:09 狀態「Chiuso」；La Madonnina 2007 m、8 人車廂。emmelle.it 2026-09-03：9/6 前每天開、之後週末，過去因經營糾紛長期停駛。
- 🟢 Rifugio Franchetti：2433 m、CAI 羅馬、6 月初到 9 月底、10–5 月 15 人以上團體預約、2026-10-01「Siamo chiusi…」、10 月只開週末、23 床（Il Rifugio 頁，curl 重讀確認）、Piana del Laghetto 2h30／780 m。
- 🟢 TUA 週六班表（linea=36）：Prati 06:10 發往 Montorio 07:35；往 Prati 到站 15:35、16:15。AMA 線路頁：M6 Base funivia–Terminalbus、M6F 假日、10/19 起平日班次調整公告。
- 🟢 SummitPost：2655 m、「some of the hardest and beautiest…」、各壁描述與「very dolomitic」、Marmolada 南壁比喻（原文「they say」，正文寫「被拿來和…比」）、A24 San Gabriele-Colledara→SS491→SS80、70 km／30 km、夏季最佳與 10 月初／5 月底、薄冰、霧、禁止隨意露營、Ferrata Brizio 封閉、各路線首攀年份與 UIAA 級。
- 🟢 Dargaud：1573 De Marchi 與引句、2912 m、1991 國家公園、「a mile high face」、45 km 離亞得里亞海、夏天下午起雲、只有離纜車 15 分鐘內的路線有 bolt、Il Nagual e la Farfalla 600 m EX VIII- A3、Cavalcare la tigre 橫渡讓人撤退。
- 🟢 Planetmountain 路線清單與 6 個路線頁：Paretone Express 約 850 m 後接 Canale Jannetta；Zarathustra TD+ VI+、6 段 210 m、接 Vecchiaccio 超過 400 m、從纜車上站 30/40 分、Cima Alta 45 分；Vecchiaccio 1977、SW、210 m、D+、VI-；Spigolo 9 段約 315 m、岩釘都在／部分確保站自架；Chiaraviglio PD+（3°）、「facile primo approccio」、Madonnina 約 1 h；SUCAI AD+ IV、10 段、超過 300 m、確保站已改 fix、Bafile 1.5–2 h；The Trooper 各段難度、8/31/2026 紅點、末段 clean、316L 8 mm 膨脹栓確保站、早上有太陽。
- 🟢 Alpinisti d'Appennino Vado di Sole：32 條、6a–9a+、朝西早上陰影、1700 m、6–9 月、雨天不能爬、Mucciante 後左轉 Farindola 約 2 km、5 分；表內 22 條路線與長度逐條對照。
- 🟢 Oliunid（Vado di Sole、Monte Aquila、七個夏季岩場）：約 30 顆石頭、約 70 個題目、約 2000 m、6 月與 10 月最好、露營車可停、Parisse 兄弟。
- 🟢 Magia di Calcare（出版社頁＋試閱本）：五區＋Poggio Umbricchio、「hundreds of problems」、2015、ISBN；Dosage 2006 第一顆 8a、Dosage 大石 16 題 5–8a+、各題難度與站姿起攀難度、Metodius 7c Masso Capulli、Numeri 1 7c+ 2005、Vega 7c+ 2012、Rui 8a+ 2012、Vado di Sole 約 30 條多在 8a 以上、Monte Aquila 停車 2–3 台與 600 m。Versante Sud《Gran Sasso》：作者、2020、ISBN、四種分類、Brutti 2008 年取得高山嚮導資格。
- 🟢 公園規則草案（檔名「Bozza Regolamento del Parco」）：art. 80、83、86 的內容如正文。theCrag：國家公園 311 條、Abruzzo Rock 2023 作者。CNSAS：118／112。
- 🔵→已修：傳攀表原始難度原寫「PD+（III）」，轉換腳本讀不到 UIAA，改成「III（PD+）」這種 UIAA 在前的寫法並讓 `--write` 重填 YDS；原先手填的 YDS 有 6 列偏差（例如 Zarathustra VI+ 寫 5.9，對照表是 5.10a），全部改成腳本值，中英同步。
- 🔵→已修：The Trooper 原把各段難度與「最難」混在難度欄，check 不通過；改成難度「最難 7b+」、YDS「5.12c」，前六段難度移到長度欄。
- 🔵→已標：公園規則只找到 2019 年草案，正文明寫「這份是草案，是否已正式生效沒查到」；封閉類句子寫「2026 年 10 月查，沒找到…封閉公告」。
- 🔵→已修：英文版「I could not confirm」改為非第一人稱。
- 🔵→已補：Abruzzo Rock 原寫「出版社與收錄細節沒查到」，做 Roccamorice 時讀到 Versante Sud 產品頁（2023 新版、義大利文、ISBN 978-88-55471-18-3、Chieti／L'Aquila／Pescara／Teramo），中英同步補進指南書與參考資料。
- 🟡 未找到：Funivia del Gran Sasso 的重開日期；大角峰／小角峰岩壁的鳥類繁殖封閉（查無，不是確認沒有）。

## post-review

- 機械檢查：`climbing-grade-convert --check` 兩檔 38 列通過；`check-tw-terms` 修掉 1 個「玩法」後 0 blocking、0 to review；`check-process-leak` 通過。
- frontmatter：order 1301、tags 8 個（multi-pitch、trad-climbing、bouldering、sport-climbing、abruzzo）。tldr 先講山塊與兩種玩法、難度範圍、季節，再講最會改變行程的兩條纜車停駛。description 列主題。
- 結構：契約 H2 依序齊全；四級法國級數表都有路線（入門只有一條，段落說明真正的入門是 III 級稜線），另有 UIAA 傳攀表與 Font 抱石表，表頭照契約。「怎麼去」有大眾運輸、開車、停車（併住宿），另加「纜車」小節。
- 一致性：纜車日期在 tldr、交通表、纜車小節三處一致（9/21 停駛、Prati di Tivo 到 9/20）；Vado di Sole 路線數 32（Alpinisti d'Appennino）與「約 30 條」（Magia di Calcare）來源不同，各自標出處。
- 連結：導言連總覽與五塔（en 連 -en）；首次出現的來源都有 inline 連結。
- 台灣讀者位置：寫明巴士班次無法當天來回，纜車停駛時的步行時間與爬升都給了。

## post-polish

- register-scan（中文）：模板化轉折 0、姓名當主詞 0、英文術語 0。數字密度高的是纜車小節（Prati di Tivo 那條 18 個，日期與時刻）與 TUA 班表段（8 個）。
- 保留：纜車與班表段的數字都是讀者排行程要照抄的日期與時刻；已把營運方原句放在最前面，其餘拆成條列。
- 已改：「兩種玩法」改「兩種方式」（check:tw 建議）。
- 保護片段（義大利文引號原文、路線名、級數、連結）回讀未變；改後重跑 grade check、check-tw-terms 通過。
