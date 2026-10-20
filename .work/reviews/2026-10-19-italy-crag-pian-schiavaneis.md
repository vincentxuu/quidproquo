# Review: 2026-10-19-italy-crag-pian-schiavaneis（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-pian-schiavaneis.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-pian-schiavaneis.md`。系列〈義大利岩場〉order 406。作者自審（依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：前半 Groundlane MCP 可用；帳號切換後 Groundlane「not connected」→ Keenable keyless 搜尋＋r.jina.ai reader＋Exa。theCrag 經 jina 只回 bot 頁，未引用。Trentino Trasporti 時刻表是 PDF 內嵌圖片，jina OCR 需 key，改用 pdfimages 抽圖人工讀。

## post-verify

逐來源對照正文宣告：

- 🟢 Planetmountain（英、義）：62 條、5b–8b/c、35 m、70 m 繩、朝 S-SE、約 2,000 m、「crucible of modern sports climbing」、「friable overhanging limestone … chipped, glued and drilled」、全年可爬但夏天下午最好、下雨可爬但長雨後滲水、兩間山屋停車、柵欄與大石、過溪 10 分鐘、四區名、各路線難度（Via delle guide 5c … Linea mortale 8b/c）、Camicia e cravatta 13 m、旱獺。
- 🟢 falesia.it：100 條、4a/8c+、1,910 m、2026-05-10 更新、7 區各區條數與難度範圍。
- 🟢 UKC：77 條、1,898 m、朝 S、「A steep and imposing crag…」、好路線多 7a+、過橋前右側停車、沿溪床 10/15 分鐘；UKC 難度（Lambada 7a、Samba 7b+、Linea mortale 8c、Power ranger 5c、Franiglia 6a、Bel cammino 5c）。
- 🟢 Climbook：Centrale 37 條、Placca 15 條；攀登次數（Via delle guide 17、Golder stveat 14、Turtles 12、Lambada L1 11、Power ranger 10、Ciamorces 9、Allungata 8、Fessura 7、Lambada L1+L2 5、Supergrimp 2）；Samba L1 7c、Pregio L1 7a+；10 年前留言（小雨可爬、Power ranger 接 Fessura）。
- 🟢 CAI《Lo Scarpone》：10 分鐘、1,900 m、朝南、「non è propriamente considerata una falesia per principianti」、「quasi cento vie」、推薦 Principale 與 Placca、中央區午後雷雨可續爬、停車多收費常滿。
- 🟢 Trentino Trasporti 556/2026：B129、6/27–9/9、每日、民間包車業者、Canazei 圓環停車場 8:30–16:30 每 40 分 13 班、Pian Schiavaneis 站 +15 分、回程 9:19–17:19（從 PDF 圖片逐格讀）。
- 🟢 Val di Fassa 觀光局：101 路全年；B129／B130／B131「SERVIZIO ATTIVO SOLO IN ESTATE」。
- 🟢 Soccorso Alpino Trentino：打 112 與要說明的資訊。
- 🟢 Versante Sud Dolomiti Falesie：Colombetti、2021、ISBN、105 岩場、Fassa 在範圍、Non disponibile；英文版頁存在。UKC 書目 Bonanno 2004。
- 🔵→已修：tags 原寫 `dolomites, trentino`（新 tag），改成系列既有的 `trentino-alto-adige`，中英同步。
- 封閉類：正文寫「查到的來源都沒有封閉或禁攀公告」，研究筆記列了查過的 4 個來源；沒有寫成「確定沒有封閉」。

## post-review

- 機械檢查：`climbing-grade-convert --check` 28 列 0 問題；`check:tw` 0 blocking；`check:lang-parity` OK；`check:references`、`check:process-leak` 本篇未列名。
- 結構：導言（位置＋這篇幫你判斷什麼＋連總覽與 Sella）→ 這是什麼樣的岩場（規模比較表）→ 什麼季節去（雨天專段）→ 怎麼去（大眾運輸／開車／停車與接近）→ 規範 → 依程度挑路線（四級都有表）→ 查資料的入口（含指南書 bullet、第一句照規格）→ 參考資料。對齊契約 ✅。
- tldr 先講岩場，再講最影響行程的事（季節巴士只到 9/9）✅；description 不重複 tldr ✅。
- 內文連結：首次出現的 Planetmountain、falesia.it、UKC、CAI、Climbook、Trentino Trasporti、觀光局、救援都有 inline 連結 ✅。
- 中英對等：表格列數與備註一致；英文版連 `-en` 總覽與 Sella ✅。

## post-polish

- register-scan：長句 7 句（最長 104 字是指南書 bullet）、但書段落 13%、模板化轉折 0、英文術語 0。
- 已改：CAI 那句（98 字）拆成兩句，並把義大利文引句補上中文意思「不算新手岩場」。
- 保留：其餘長句多含義大利文原句或班表數字，屬查表資訊。
