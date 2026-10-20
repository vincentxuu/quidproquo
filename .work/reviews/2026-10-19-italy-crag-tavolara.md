# Review: 2026-10-19-italy-crag-tavolara（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-tavolara.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-tavolara.md`。系列〈義大利岩場〉order 2003。作者自審（同一 agent，依三個 skill 的清單）。

工具降級（toolDegradation）：Groundlane MCP 前半可用（奧爾比亞市政府新聞、SassariToday），之後斷線；其餘用 r.jina.ai、Exa、Keenable 搜尋。Olbianova 只回 JS 外殼、GognaBlog 是驗證頁，都沒讀到。

## post-verify

- 🟢 奧爾比亞市政府 2025-05-14 新聞：市長 Nizzi 的禁令、例外只限具運動攀登專長的高山嚮導且「esclusivamente a scopo di studio e scientifico」、Hg3／Hg4 崩塌危險、PAI 地圖、2025-05-03 Ferrata degli Angeli 事故（14 名救援隊員、海巡艇、Areus 直升機）。
- 🟢 SassariToday 2025-06-02：第 28 號命令（2025-05-13）、5-19 更正令限到 2025-09-30、秋天擬步道規則；約 90% 為 Marzano 家族私地；1962 年起北約基地、東半部「strettamente off-limits」；Tavolara Libera 委員會。
- 🟢 Climbing Sardinia 2025-05-26：9-30 前不接攻頂與攀岩行程、命令 5-13 發布、5-19 更正。La Nuova Sardegna 2025-06-25：市長在議會維持命令。L'Unione Sarda 2025-07-03：違令兩人迷路；2026-09-18：兩名英國遊客夜間迷路獲救。
- 🟢 climbingitaly：38 條、標籤（多段傳攀、整天曬、搭船接近、擋西北風、冬季）、難度分布 5a–6b+ 與 3 條計畫線、Traverso Infinito 原文、Habel 與 Stenghel、4–10 月 Bertoleoni 渡輪 9:00–18:00、私人船電話、Marzano「not very enthusiast of climbers」、東北面軍事基地、不能繫泊下錨；表中 12 條的段數、各段難度、年份、首攀者與保護備註。
- 🟢 Planetmountain 2016（Oviglia）：1970 年代初、Habel、Stenghel、Lecis／Sarti 1990 年代、Buscaini 與 Pietra di Luna 不收、「can one climb on Tavolara? Who knows… you decide」、只走 topo 步道。Planetmountain 路線頁：Punta Lucca 西北稜、夏天 14 點前陰影。
- 🟢 Trekking Tavolara：Spalmatore 起步、石灰窯、「Scala 'e Fustes」木梯、約 20 分鐘；首頁 2026 年仍宣傳登頂；把 Affora sa nato 寫成 2000 年代初（與 Planetmountain 的 1990 年代不一致，表內並列）。
- 🟢 AMP Tavolara：2014 年第 299 號規則、B／C 區下錨、漁獵、水上摩托車規定。Tavolara Traghetti e Gite：Porto San Paolo 港、349 4465993、走法。CNSAS：薩丁尼亞 118。
- 🔵→已修：路線表「子區」原填「南面／北面」，只有 Stenghel 的南面路線有來源，其餘是我推的 → 改填「Tavolara」，Affora sa NATO 與 Follia 保留來源寫的位置。
- 🔵→已修：UIAA 三條的原始難度原寫分段清單，換算腳本會取第一段 → 改寫「最難 VI+（各段…）」，`--write` 重算 YDS。英文版同步改成「hardest VI+ (pitches …)」。
- 🔵→已標：5-19 更正令原文沒找到，正文註明「二手：SassariToday、Climbing Sardinia」。
- 🟡 查不到：2025-09-30 之後的續禁令、新步道規則、撤銷或 TAR 判決（2026 年 10 月查，Keenable 多組關鍵字）；A 區範圍與會落水的路線是否受游泳限制。正文都直說查不到，並建議向市政府確認。

## post-review

- 機械檢查：`climbing-grade-convert --check` 中英各 12 列通過；`check-tw-terms` 0；`check-post-references` 本篇無錯誤；`check-lang-parity` OK；`check-process-leak` 通過。
- 結構：七個固定 H2；四級 H3 中進階、高手寫「來源沒列」（38 條沒有 6c 以上）；UIAA 路線另開傳攀表。
- 標題直接寫出「2025 年起市長令禁攀」，tldr 與導言第一個問題都是「現在能不能爬」，因為這件事決定讀者要不要去。
- frontmatter：order 2003、tags 6 個（multi-pitch、trad-climbing、sardinia）；description 涵蓋禁令、私地、軍事區、保護區。
- 指南書 bullet 第一句照契約，接著直說沒有紙本指南。

## post-polish

- register-scan：長句 13 句、但書 7%、姓名當主詞 0、模板化轉折 0、英文術語 0。
- 長句集中在禁令與更正令的段落，含命令號、日期與引文，拆開會讓「誰在何時說了什麼」對不上，保留。
- 「2026 年的現況不明」段補了具體動作：向奧爾比亞市政府確認，或找有登記的在地高山嚮導。
