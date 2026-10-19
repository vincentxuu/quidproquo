# Review: 2026-10-19-italy-crag-grotti（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-grotti.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-grotti.md`。系列〈義大利岩場〉order 1203。作者自審（brief 指定 subagent 依三個 skill 清單自審）。

工具降級（toolDegradation）：Groundlane MCP web_fetch 成功一次（Planetmountain）後回 CONCURRENCY_LIMIT「request queue is full」、web_search 回 upstream stream error → Keenable keyless 搜尋＋r.jina.ai 讀頁；theCrag（jina 只回快取 SVG）與 CNSAS（jina 近乎空白）改用 Exa web_fetch_exa；Cotral 跨區線那段取自 Exa 對 Cotral 官網的搜尋 highlights，再用 Exa fetch 同頁確認頁面結構。Firecrawl 未用（額度用完）。

## post-verify

開了 17 個來源，抽出正文 40 條宣告逐條對照研究筆記與原頁。

- 🟢 Planetmountain 岩場頁：「The great crag in central Italy」圖說、230 條、4c–9a/a+、40 m、朝 S、70 m 繩、左側轉礫岩質石灰岩、黏膠樹脂錨栓、La Curva 70 條新路線與舊區重打、皮膚要休息、到費倫蒂洛 40 分鐘、離列蒂 8 km、獵具店旁「park discreetly」、無營地、Piazza delle Feste 100 m、冬／晚秋／早春、小雨可爬、La Curva 63 與 Grotti Alta 155 的分布（7c+ 欄 33／81）、Paretone 路線表（Caffè atomico 7a、Grigio pirla 7a+、Bombadill 7b）、書目《Arrampicare in Abruzzo》。
- 🟢 UKClimbing：255 條、朝 S、495 m、Margalef／Gorges du Tarn 比喻、最近營地在 Fiumata、平草地與飲水處、Grotti Alta 紅色三角標誌對面的步道、Grotti Bassa 過 Casette 過橋左轉、鐵門、防護網；表內 UKC 路線與子區（Iniziazione、Grotti Alta、Deposito、Canile、Grotti Bassa）逐條對照。
- 🟢 theCrag：238 條與難度直方圖（加總 19／56／112／39）、Grotti bassa 92 條與五個子區、列 Arrampica Roma Nord 為指南書、沒有警告。
- 🟢 Climbook：「atletico e spesso violento」、朝 S／SE、Iniziazione 與 Nirvana 冬季區、Eu／X-Files 夏天 15:00–15:30 陰影、Erotica 右側 15:00、春秋 14:00、熱月 17:00、重複次數（Guardia rossa 225、Guardia nera 202、Jolly fan 193、Provaci 190、Gladiatori 181、Gladio 175、Mondo meschino 175、Il nervoso 171）。
- 🟢 falesia.it：161 條、3c+/8c、「Pochi gradi facili, non adatta a principianti」、「Calda, molto calda」、「Chiodatura eterna a fittoni resinati」。
- 🟢 Alpinisti d'Appennino 2023：11 月到 3 月、「Si scala con la pioggia: No」、不鏽鋼膠栓＋10 mm 栓、品質四星、SS4→Rieti Est→SR578 約 7 km、A24 Valle del Salto→Grotti／Villa Grotti 出口。
- 🟢 Climbing Spot Factory：「almost never very technical, but you need to be powerful」、高難度路線點被鑿過、過 Casette 過橋左轉停車給 La Curva 與新區。
- 🟢 Visit Rieti：朝南不建議夏天。Oliunid 2022：Innocenti 對 Grotti 的評語、El grinta 點小、不一定 20 m 內結束、Alto Gradimento 約 35 m、Assalto Frontale 8a+ 在 Muro dell'Inverosimile、2022 年重打與步道整理。
- 🟢 Planetmountain 2020 新聞：Smargiassi 20 年前打的計畫、Lamberti 試十年、Iagnemma 2020 年 1 月首攀 9a/+、「hardest route at the crag and in Central Italy」、8b+ 屋簷接 8a、羅馬東北約 90 分鐘。
- 🟢 Cotral 跨區線頁：Contigliano–Rieti–Avezzano 停 Rieti Casette 與 Cittaducale Grotti、全部招呼站、平日 5 班週末 3 班（兩方向）、不停 Rieti FS 改在 Piazza Cavour／Porta d'Arce。
- 🟢 CNSAS：118 或 112、免費、請接線員啟動 CNSAS。Idea Montagna：Arrampica Roma Nord 2016、544 頁、ISBN 978-88-97299-74-5。
- 🔵→已修：表內 Mondo meschino、El grinta（6c）換算原寫 5.11a，`climbing-grade-convert --check` 指出對照表是 5.11a/b，中英同步改。
- 🔵→已修：入門段原寫 Iniziazione 在「Grotti Alta 最左邊」，來源只寫「步道上來先到 Iniziazione」（Climbook），改成「步道一上來就到的 Iniziazione」，中英同步。
- 🔵→已修：Cotral 段原把起點站發車時刻（4:15、12:15、20:15）寫進正文，那是 Contigliano 端發車時間、不是 Grotti 站時間，容易誤讀；改成「兩方向平日 5 班、週末 3 班」並導到 Cotral 時刻查詢。
- 🟡 未找到：Ultimo Tango a Zagarolo 的子區（表內寫「來源沒寫」）；《Arrampicare in Abruzzo》出版年。
- 封閉類：本岩場沒有封閉或禁攀句；正文寫「目前沒找到封閉或禁攀公告」並註 2026 年 10 月查。

## post-review

- 機械檢查：`climbing-grade-convert --check` 兩檔 26 列通過；`check-tw-terms` 0 blocking、0 to review；`check:references` 本篇無錯誤（全站 6 個錯誤都是其他篇的 10-19 連結）；`check:lang-parity` OK；`check-process-leak` 通過。
- frontmatter：date 2026-10-19、type guide、series order 1203、中英系列名正確；tags 5 個（sport-climbing、lazio）。tldr 先講岩場（位置、岩質、規模、最難），再講會改變行程的事（不適合初學、季節、巴士班次少）。description 列主題，不重複 tldr。
- 結構：契約 H2 依序齊全（這是什麼樣的岩場／什麼季節去／怎麼去含大眾運輸、開車、停車／規範／依程度挑路線四級／查資料的入口／參考資料），另加「跟費倫蒂洛怎麼搭」比較節（同 gaeta 範本的比較節）。四級表都有路線，沒有空級。
- 連結：導言連系列總覽與費倫蒂洛（en 連 -en）；比較表再連費倫蒂洛一次。首次出現的來源都是 inline 連結。
- 指南書條目：第一句照契約固定句；列兩本，交代 Arrampica Roma Nord 已十年、Abruzzo 書是舊版。
- 台灣讀者位置：從羅馬出發的開車與巴士都寫到能照做，巴士班次少給了替代（先排時刻或叫車）。

## post-polish

- register-scan（中文）：模板化轉折 0、姓名當主詞 0、英文術語 0；數字密度高的段落 7 段。
- 已改：Cotral 段數字從 13 個降到 4 個（拿掉發車時刻）。
- 保留：「朝向與遮陰」段（11 個數字，都是各子區的陰影時刻，讀者照時間排）、theCrag 難度分布段（查表資訊）、指南書書目欄位。
- 保護片段（義大利文引號原文、數字、連結）回讀未變；改後重跑 grade check、check-tw-terms 皆通過。
