# Review: 2026-10-19-italy-crag-statte（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-statte.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-statte.md`。系列〈義大利岩場〉order 1601。作者自審（依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane MCP 可用；DGR 2435/2009 PDF Groundlane 回 OUTPUT_LIMIT、curl 被 Akamai 擋，改 jina `read_url`；falesia.it 區頁路線表用 curl 抓 HTML 本機解析；Keenable 搜尋一次。未用 firecrawl、stealth_fetch、web-fetch/fetch_page。

## post-verify

本 session 開啟 24 個來源，正文每條宣告逐條對照研究筆記與原文（封閉／禁攀、交通、救援全數檢查）。

- 🟢 Regolamento Regionale 28/2008 Art. 5「Misure di conservazione per tutte le ZPS」1 v)：禁止岩壁攀岩「dal 1 gennaio al 30 agosto」。一手（大區公報 PDF）。
- 🟢 Area delle Gravine 管理計畫規則（DGR 2435/2009）Art. 10 1 e)：1/1–8/31 禁攀；期間外只限已打錨栓岩壁；新路線要管理單位核准；可暫停；不得寫字、留繩鍊（必要錨栓除外）；Art. 10 5 不得接近埃及禿鷲、遊隼、地中海隼、鵰鴞巢壁；Art. 29 罰鍰 25.82–258.22 歐元。一手（MASE Natura 2000 檔案）。
- 🟢 Leucaspide 在 IT9130007（SIC＋ZPS）內：ILVA 2007 AIA 技術報告原句；Wikipedia 列 Statte 在範圍內、管理單位 Provincia di Taranto。正文寫明出處。
- 🟢 Trekking Falco Naumanni 2015-02-24：3/1 活動因「vincoli ambientali presenti in questo periodo」取消。Made in Taranto 2020：猛禽築巢、繁殖期受保護。
- 🟢 Comune di Statte：Amastuola＋Triglie 匯流、Accetta／Leucaspide／Gennarini、石灰岩＋calcarenite「tufo」；無攀岩規定。Ente Parco 官網與市府站內搜尋無攀岩公告 → 正文寫「沒有查到（2026 年 10 月查）」。
- 🟢 規模表：falesia.it 172／11 區／4c–8b／「più di 200 vie」；theCrag 187／14 區；UKC 236／4c–8b；RATW 約 250；Climb Europe 280+／19 區／5c–7c；theCrag 指南書欄「nearly 300 routes」5c–7c。
- 🟢 進場：theCrag 四種進場與子區對應、金屬筒倉、金屬梯、鐵皮農舍、固定繩兩處；UKC 墓園鐵門、「possible but very unpleasant」、死巷底、紅黃鐵皮頂棚屋約 3 分鐘、「Parkplatz Climbing area」導航不到改設 Masseria Amastuola、紅白煙囪、大石牆、約 10 分鐘、繩索扶手、「world's most unconvincing access routes」、10 月葡萄園作業可能關閉。RATW 隔谷不到 500 m、開車 15 分鐘、沿葡萄園西側邊界牆。
- 🟢 Kyma 4 號線：Porto Mercantile – Stazione FF.SS. – … – Zona Montetermiti；冬季平日首班 05:18、白天約 18–36 分鐘一班（正文寫約 20–35）；檔案 2022-12 上傳，正文要求出發前確認。
- 🟢 錨栓：UKC「obvious from the first clip」、Il Mito 2026 重打；Rocciaeresina Il Mito A 側確保站換 inox 316＋鉤環、經費來源；Superskunk 水道橋上游第一條、非不鏽鋼錨栓老化、2023 換 inox。
- 🟢 救援：CNSAS 求救撥 112；CNSAS Puglia 有 Murgia 站、峽谷救援跨區。保險：來源沒寫，正文直說。
- 🟢 季節表六列與原文一致（Climb Europe、UKC、falesia.it 總頁／Il Graffio／Ganja、Rocciaeresina Ganja）。RATW 雨天谷底涉水到大腿深。
- 🟢 路線表 30 條：falesia.it 區頁（Solarium、Il Mito、Master of Rock、Il Graffio、Ganja）、Rocciaeresina（Capitan Harlock、Le 2 Torri、Ganja、Il Graffio）、theCrag 經典（Fame Chimica 6c、Lamu 6c+、Margot 7a、Leggende senza tempo 7c 20 m）、RATW（Di Tutto 6a、Zeus／Hercules 5c、Bheliel 6c、Rocky Joe 6a、Cumbre 6b、Torre de Babele 5c、Like a Rolling Stone 6c、God Save the Queen 6a）。來源間不一致者並列（Fame Chimica、Bhelial、Rocky Joe、Superskunk、Purpelize）；單一出處在備註標明。
- 🔵→已修：指南書條目原寫 Montel「這一帶開路線最多的人」，出版社原文是「continues to be the point of reference in the region」，改成出版社介紹的說法（FASI 教練與定線員、三十年在普利亞開新岩場整修舊岩場）。中英同步。
- 🔵→已修：`climbing-grade-convert --check` 第一次 11 列 YDS 不符（我手填的 5b→5.7、6c+→5.11b 等），清空後用 `--write` 重填，`--check` 通過；英文版 YDS 全由 `--write` 填，與中文逐列相同。
- 🟡 falesia.it Il Mito 區頁 Leggende senza tempo 的難度欄解析不清，改只用 theCrag 7c；theCrag Scrigno 的警告內容讀不到（子頁 404），正文只寫有警告圖示。

本次只檢查了文中已提出的宣告，未評估覆蓋完整度（覆蓋見 post-review）。

## post-review

- 機械檢查：`check-tw-terms` 0 blocking、0 to review；`climbing-grade-convert --check`（中英）0 issues；`check-post-references`、`check-lang-parity`、`check-post-quality`、`check-process-leak` 本篇未列名。
- 結構對照契約：這是什麼樣的岩場（規模比較表、上下段分區表）→ 什麼季節去（來源表）→ 怎麼去（大眾運輸／開車／停車三個 H3）→ 去之前要知道的規範（禁攀條文表、來源落差、私有地、錨栓、救援）→ 依程度挑路線（四級 H3、標題照 HEAD、NOTE_ZH／NOTE_EN）→ 查資料的入口（含「指南書」條目，第一句照契約）→ 參考資料 ✅。
- 封閉／禁攀句子全部有一手來源（大區規則、管理計畫規則）；執法實況查不到，正文已寫明並給確認對象 ✅。
- frontmatter：tags 5 個（含 puglia）；tldr 先講岩場再講法規；description 列主題；series 中英名稱與 order 1601 正確；date 2026-10-19。
- 連結：開頭中英互連；系列總覽（中連無後綴、英連 `-en`）；薩倫托篇 `/posts/climbing/2026-10-19-italy-crag-salento(-en)` 已存在。
- 台灣讀者位置：從塔蘭托火車站與 Kyma 公車講起，標明上段沒車難到；禁攀期直接給「9 到 12 月」的排程結論。

## post-polish

- 自查長句、但書堆疊、數字密度：規範段把兩部法規改成表格，避免一句塞兩組日期；季節段先列來源表，再用一句粗體點出和法規對不上。
- 交通段把 UKC 長段落拆成「上段／中段／下段」三段，每段一個停車點、一個動作。
- 引述保留義大利文原句的地方（法規、falesia.it、Rocciaeresina）都附中文意思；人名不當主詞，都以來源站為主詞。
- 改後重跑 `check-tw-terms`、`climbing-grade-convert --check`，結果同前。
