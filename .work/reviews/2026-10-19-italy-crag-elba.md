# Review: 2026-10-19-italy-crag-elba（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-elba.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-elba.md`。系列〈義大利岩場〉order 902。作者自審（依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane web_search 可用（brave 間歇不可用、一次 stream 中斷）；Groundlane web_fetch 前一篇遇 CONCURRENCY_LIMIT，本篇頁面改用 curl 與 Exa web_fetch_exa；at-bus.it 以 Exa 讀取；guardiacostiera.gov.it 403（未使用）。Firecrawl 未用。

## post-verify

本 session 打開 22 個來源，抽 35 條宣告逐條對照（bolt 狀況、私人土地、交通、救援全數檢查）。

- 🟢 Climb Europe 兩頁：花崗岩、有 bolt 的海崖到多段、F5 到低 F7、8 處岩場、多為單段、San Bartolomeo 最長約 170 m、渡輪約一小時、托斯卡尼春秋最好。
- 🟢 infoelba San Bartolomeo：Portoferraio→Procchio→Marina di Campo→Cavoli→Seccheto→Fetovaia→Pomonte、約 30 km、教堂廣場或下方停車場、CAI 103、約 45 分、上下兩層（下層多段、上層多單段）、短鐵索、topo 1–27；表內 9 條難度逐條對過。
- 🟢 infoelba Fetovaia：4 區、第 3 區最值得、多數只有兩個 fittoni 要帶繩環、最高 15 m；停車點與岩區對應；表內 6 條對過。infoelba La Freccia、Madonna del Monte、Ginepro：入山與路線難度對過。
- 🟢 infoelba Ginepro：Capoliveri→Costa dei Gabbiani、碎石路約 10 km 到 Tenuta delle Ripalte、鐵鍊封路、約 20 分、「proprietà privata… annunciarsi alla reception」、「La parete non è attrezzata dalla Tenuta」。
- 🟢 infoelba 索引頁：Renato Bardi（FASI 教練）、「non è facile raccogliere informazioni aggiornate… verificare sempre la sicurezza」。
- 🟢 theCrag：27 條、5a–7c、「Rusty anchors and some spits. I would not recommend it」、第 1 區步道難走、CAI 103。
- 🟢 Climbook（2026 年 4 月更新、依 2025 年 3 月 Versante Sud 指南書）：33 筆；「3 multipitch… recentemente richiodate」「altre 6 Vie lunghe… pericolose」；三條多段的 6 段分段難度逐段對過。
- 🟢 Bergführer Dolomiten：花崗岩＋Costa dei Gabbiani 火山岩；2025 年 Baia dei Pirati、Remaiolo bolt 生鏽會斷；濕地衣滑；自行穿繩下降；Sant'Andrea 2021 不能爬；San Bartolomeo 上層不鏽鋼 bolt、鏈條鉤環生鏽、15 條 12 條能爬、朝北、約 400 m、忽略舊路牌走 103a；Fetovaia 第 1 區只有 Tempest 是膠黏錨栓；La Freccia 生鏽少人爬。
- 🟢 SiViaggia：San Bartolomeo「esposta a sud… anche in inverno」；Madonna del Monte 夏天有陰影。
- 🟢 Blu Navy：「Oltre otto tratte al giorno… sia in estate che in inverno」、1h00、報到 15／30 分鐘。Toremar 首頁：Piombino、Portoferraio、Cavo、Rio Marina。Moby 首頁：Elba 航線。
- 🟢 Trenitalia：Piombino Marittima 在客運港、Campiglia Marittima 站前接駁巴士、火車＋巴士同票、Elba Link。
- 🟢 Autolinee Toscane 116：Portoferraio Calata Italia 起、停 Marciana、Chiessi、Pomonte、Fetovaia、Seccheto、Marina di Campo。
- 🟢 國家公園規章清單：無攀岩專章。SAST：112、要求轉 CNSAS。Versante Sud 書頁欄位。
- 🔵→已修：「116 線班次少」沒有來源 → 改成「出發前先查好回程末班」。中英同步。
- 🔵→已修：「Costa dei Gabbiani 沒有巴士」沒有來源 → 改寫成 infoelba 的碎石路描述，結論標「實際上要開車」。中英同步。
- 🔵→已記：San Bartolomeo 朝向兩來源相反（SiViaggia 朝南、Bergführer Dolomiten 上層朝北）→ 季節表並列並提醒查指南書。
- 🔵→已記：三條重打多段的段數，Climbook（2025 指南書）寫 6 段、infoelba 舊 topo 寫 3 段 → 表格採 Climbook，備註並列。
- 🟡 二手：bolt 現況多數來自嚮導部落格（2021、2025）與 DB 使用者留言，正文已寫來源與年月。
- 未查到：島上岩場總路線數；Climb Europe 所說 8 處岩場的名單；Toremar／Moby 逐班時刻（JS 頁面，連到首頁）。

本次只檢查了文中已提出的宣告，覆蓋交 post-review。

## post-review

- 機械檢查：`check-tw-terms` 0 blocking、0 to review；`check-process-leak` 中英皆過；`climbing-grade-convert --check` 中英 50 列通過，中英 YDS 欄一致（只差「最難／hardest」）。
- frontmatter：date、category、type、series（order 902）中英正確；tags 6 個；tldr 先講岩場（花崗岩、8 處、170 m 多段）再講最會改變行程的事（生鏽 bolt、私人莊園報到）。
- 結構對照契約：七個 H2 齊全，順序正確；怎麼去有大眾運輸、開車與停車；規範含 bolt 現況表、私人土地、國家公園、救援；四級路線表，高手級寫「來源沒列」並說明依據；指南書條目首句照固定寫法，並直說沒有單獨的厄爾巴島指南書。
- 停車：契約要 `### 停車`；本篇用 `### 開車與停車` 合併，各岩區停車點逐條列出。
- 連結：導言連系列總覽（英文版連 `-en`）、同批的卡馬約雷與 Capo d'Uomo；營運者、FASI 整理者、國家公園、SAST 首次出現都有 inline 連結。
- 中英對等：所有修正中英同步。

## post-polish

- register-scan 第一輪：長句 3 句、但書段落 0%、引述區塊 0、姓名當主詞 0、模板化轉折 0、英文術語 0。
- 已改：Ginepro 私人土地句（65 字）拆成兩句。
- 保留：San Bartolomeo 開車路線（逐站地名，拆開反而難照做）、指南書條目（書目資訊）。
- 保護片段（引號原文、數字、連結）回讀未變。
