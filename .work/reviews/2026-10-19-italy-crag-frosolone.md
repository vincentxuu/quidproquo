# Review: 2026-10-19-italy-crag-frosolone（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-frosolone.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-frosolone.md`。系列〈義大利岩場〉order 1401。作者自審（同一 agent 依三個 skill 清單逐項檢查）。

工具降級（toolDegradation）：Groundlane MCP 可用（偶發 CONCURRENCY_LIMIT／upstream closed，重試成功）；市府 urbi 公告欄本機連線逾時、表單無法送出；Planetmountain 等用 r.jina.ai；Gulliver、theCrag 改 Exa web_fetch_exa；市府 PDF 用 curl＋pdftotext。

## post-verify

封閉／禁攀類宣告全部對照研究筆記的來源；路線與數字抽查。

- 🟢 Planetmountain 岩場頁：400 條、4a–8c+/9a、朝向 N/S/E/O、「storicamente la più importante del Molise」、約一百條 4–6 級、四分之三在 6b 以上、70 條 8 級與計畫線、1980 年代初開發、1200 m 以上春夏最好、Sant'Egidio 岔路往 Sessano 2–3 km、小石屋旁停車、飲水槽、15 分鐘；頁首「DIVIETO ARRAMPICATA … 18/08/2020」仍在（2026-10-19 查）；經典路線 12 條的長度與難度逐條對過。
- 🟢 Planetmountain 2020 報導：命令日期 2020-08-18、引文「attività spontanea dell'arrampicata sportiva」「fino alla realizzazione dei necessari interventi」、Delibera n. 77 del 12/08/2020、SIC 與 Vincolo Ambientale e Paesaggistico、「quasi 500 vie」、8 月 13 日事故與直升機送 Campobasso、市長 Felice Ianiro。
- 🟢 UP Climbing 2021：5 月 25 日決議、31 日公告；3–5 月全區封閉（uccelli rupicoli）、5–6 月 aree di rispetto 以外、7 月起全開；待市府另文指定保護區塊。
- 🟢 市府命令 17/2025（一手 PDF）：簽發 2025-05-21、生效 2025-07-30「fino a nuove disposizioni」、禁停路段、露營限劃定區、禁止開車上草地、罰 25–500 歐元、全文無「arrampicata」；公告頁日期 2026-08-12。
- 🟢 市府首頁電話 0874 890435；站內搜尋三個關鍵字 0 筆。
- 🟢 isNews 2026-04-16：GoFundMe 已逾 2,000 歐元、「oltre 500 vie」。GoFundMe：發起人 Pietro Radassao、「continua ad accogliere ogni anno appassionati」「meno affidabili e, nei casi peggiori, non più utilizzabili」。
- 🟢 Gulliver：海拔 1000、5b–8c、10–35 m、強風幾乎不能爬、冬天以外大致可爬、A1 Cassino 下、牲畜棚旁停車、柵門要關；各岩塊歸屬（Slayer、Invito al viaggio、Fedeli alla linea 在 B；Zero Coriandoli、...and Justice 在 D；Viale del tramonto 在 E；Mantanavai、Iron Moon 在 O；Queimada、Fagian Club、Flesh for Fantasy、Olive Fritte、Latte e Caffè、Cardine Sinistro 在 P；Cardine Destro、Inox 在 Q；Plancton 在 R；Fuga dalla Follia 在 S）。
- 🟢 theCrag：189 條、1,080–1,300 m。Climb Europe：1200 m、405 條、春到夏。
- 🟢 Climbook P/Q：59 條、資料來源 Molise rock ed. 2020（2025-03 更新）；十條重複次數與難度（含「in una relazione precedente」舊級數）逐條對過。
- 🟢 Versante Sud《Molise Rock》：作者、2020、ISBN 978 88 85475 63 2、LV 134、義大利文、Disponibile。
- 🟢 Scarano：兩條線名稱；Frosolone–Isernia PDF 連結回傳 HTML（正文已寫打不開）。
- 🟢 italia.it：112、118（含山區救援）。
- 🟢 推論標示：Er Macina 只出現在 Climbook 的 P、Q 合併頁，Gulliver 沒列，子區寫「Blocco P/Q」不再細分；Pantera nera 的 Blocco P 是用 Gulliver「Latte E Caffe' 6a+」對上 Climbook「Pantera nera (Latte e caffe')」。
- 🟢 停車：命令附圖看不出攀岩者常停的路邊是否在禁停路段內，正文寫「無法確認，照現場標示」，沒有推論。
- 🟡 未能查證：2020-08-18 禁攀令與 2021-05-25 重開決議的原文（公告欄表單送不出）；2022 年後是否每年 3–5 月重複鳥類封閉。正文兩處都標「二手」並給市府電話。

本次只檢查了文中已提出的宣告，未評估文章對主題的覆蓋是否完整（覆蓋交 post-review）。

## post-review

- 機械檢查：`node scripts/climbing-grade-convert.mjs --check` 中英各 22 列通過；`node scripts/check-tw-terms.mjs <中文檔>` 0 blocking、0 to review。
- frontmatter：date 2026-10-19、type guide、series order 1401（中「義大利岩場」、英「Italy Climbing Crags」）、tags 5 個（含 molise）；tldr 先講岩場（位置、海拔、規模、難度分布）再講最會改變行程的禁攀現況與交通；description 列主題不與 tldr 重複。
- 結構對照合約：這是什麼樣的岩場（含規模比較表）→ 什麼季節去（來源表）→ 怎麼去（大眾運輸／開車／停車三個 H3）→ 規範（禁攀、重開、查證過程、現況跡象、出發前確認、2025 命令、救援）→ 依程度挑路線（四級、表頭與換算說明）→ 查資料的入口（含「指南書」條目，首句照合約）→ 參考資料 ✅。
- 導言末句交代本篇幫讀者決定的事（程度、月份、交通、能不能爬、哪幾個月不能爬）✅。
- 連結：系列總覽（中 `/posts/climbing/2026-10-18-italy-crags-overview`、英 `-en`）；同批 Pennadomo（中英對應）✅。中英開頭互連 ✅。
- 中英對等：段落、表格列數、引文一致；英文電話加國碼。
- 讀者角度：沒車的讀者會看到「公車只到村子」與替代方式；春天出發的讀者會看到 3–5 月風險與確認方法。

## post-polish

- 長句檢查：規範段資訊最密（2020 禁攀、2021 重開），寫作時已把命令內容與 SIC 理由分成兩句，重開決議用三列表格呈現，沒有一句塞三個期間。
- 「我們實際查過的地方」段分成「搜尋 0 筆」「表單送不出」「PM 仍掛公告」三句；回讀後無需再拆。
- 術語：Albo Pretorio 在正文寫成「線上公告欄」，SIC 首次出現附中文解釋。
- 引述：義大利文原句保留在引號內並附中譯，共 7 處，都是規範或特色的關鍵詞，保留。
- 研究者姓名當主詞：Radassao 只在介紹作者與募款發起人時出現，未當論述主詞。
- 改後重跑 grade check 與 check-tw，結果同前。

## 補記（同日回讀）

- 🔵→已修：「最早是羅馬來的攀岩者」原本掛在 Planetmountain 名下，實際出處是 Versante Sud《Molise Rock》書介（「i primi arrampicatori romani fin dagli anni '80」），改成標出版社介紹並加連結。中英同步。
