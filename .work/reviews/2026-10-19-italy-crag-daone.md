# Review: 2026-10-19-italy-crag-daone（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-daone.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-daone.md`。系列〈義大利岩場〉order 410。作者自審。

工具降級（toolDegradation）：Groundlane web_fetch 先回 CONCURRENCY_LIMIT、後回 UPSTREAM_ERROR；Groundlane web_search 可用。頁面改走 r.jina.ai（存 scratchpad/crag4/raw/）；theCrag、Oliunid、Daone 部落格 Casetta 頁 jina 讀不到，改用 Exa web_fetch_exa。

## post-verify

逐條對照研究筆記中實際開過的來源：

- 🟢 Planetmountain：686 m、21 km 到 Bissina 1,700 m、冰瀑→多段→抱石、「new Mecca for bouldering」、1990 年代末、7 區約 600 題、4C–8C；題目表 Karmelo 6C、L'Infame 6B、Lo Squalo 6B、Muller thurgau 6C、Nimbus 7A、James Tont 7B、Spigolo dell Anguria 7C、Thor o the king 8A、L'avenir nous reserve rien de bon 8B；書目 Daone Prog。
- 🟢 27crags：「best boulder area in the north of Italy」、14 區 2,070 條、3–10 月、建議開車或飛威尼斯／米蘭租車。
- 🟢 lacrux：granite 或 verrucano、10 區 1,800 題、800–2,000 m、Boulder Park 木屑落地區與兩條成人一條兒童 circuit、多數 6a–7b、Trento-Centro／Brescia-Est 出口、火車到 Trento／Brescia 轉巴士、第三版。
- 🟢 theCrag（Exa）：1,154 條、說明 12 區 1,800+、La Plana/Foresta 342、La Curva 284、Dos dei Aser/Casetta 245、Nudole 146；另有 Placche di Danerba、Parete del V tornante 兩區（無路線資料）。
- 🟢 Oliunid：Gramitico 在 La Plana、PNAB 內不能露營、Nudole 停車場廁所、無訊號、道路「usually closed from October to May」、Nudole 1550 m 約 50 顆、Virgola 6b+、Spigolo dell'anguria 7b+、Thor The King 8a、Insetto Stecco 7a、Magic Line 8a、Mad Line 7c、Clean for Climb 7c+/8a、Eye of the Cyclops 落地、Dos dei Aser 夏天涼、Orkaloka 8a、Fuori Tempo 8b、L'avenir 8b（站姿 8a）Lorenzo Puri、Big Illusion 8c Scarperi。
- 🟢 Daone boulder 部落格：三條進谷方向、約 70 km 到 Sarca 谷、Foresta ~1,000 m 到 Nudole 1,540 m、3–11 月、Boazzo 附近 11 月底到 5 月底通常封路、Scalette 以下可開車、柵欄走到 Casetta 20 分、Foresta 過橋停車、Caos Blocchi 涉溪；Casetta 頁：Nimbus 2000／James Tont「più ripetuti」、The Fishman 7c/7c+ 水位低時、路邊兩條容易線。
- 🟢 InfoBoulder：岩質描述、Foresta（Pracul）禁行標誌外停車「le multe le danno veramente」、Big Illusion 2020 Scarperi、Flow State 2024 Vidi 8C+ 之後重攀 8C、Flohé 2026-10-02 flash、L'avenir 列 8A+。
- 🟢 Versante Sud：2021、ISBN 9788855470476、LV 38、義大利文、1,800+、10 區、Boulder Park「più elevati」、QR code、decalogo。
- 🟢 PNAB 停車頁與交通 PDF：2026 收費日期與時段、當天 6 點前購買、Bissina 滿轉 Pracul 免費接駁、無訊號；Val di Fumo Express 8/8–8/23、時刻、8 點前預約、€6。
- 🟢 Valdaone 命令 36/2024：Pracul–Pozzo Cava 劃定區外禁停禁臨停、停滿封路、6/15–9/15 7:00–18:00 管制。正文標「只寫 2024 年日期」。
- 🟢 觀光局：「Over 600 clean, accessible boulders」、Boulder Park 標示、Nudole 露營車區收費夏季開放。Trentino Trasporti：B201／B215／B212。italia.it 112／118；trekking.it（二手）特倫托住院也收費。
- 🔵→已修：Flow State 原寫「8C+，後改 8C」，換算腳本對 Font 取第一個級數，改成「8C（首攀報 8C+）」，換算 V15。
- 🔵→已修：Virgola 6B+、Spigolo 7B+ 的 V 級手填錯，跑 `--check` 後改為 V4+、V8+。
- 🔵→已修：與阿爾科比較表原寫阿爾科「春秋冬、夏天熱」「兩小時車程」沒有本篇來源，刪掉，改用部落格的「約 70 公里」與阿爾科篇已寫的交通方式。開車出口改成 lacrux 原文的 Trento-Centro／Brescia-Est。
- 封閉類：冬季封路只有二手（部落格、Oliunid），正文已標二手並建議向 Pieve di Bono 遊客中心確認；夏季禁停有一手命令（2024 版）。

## post-review

- 機械檢查：`climbing-grade-convert --check` 兩檔 40 列通過；`check:tw` 0 blocking；`check-process-leak` 原本 5 處「來源沒寫」超標，子區欄改成「—」後通過。
- 結構：固定 H2 齊全（這是什麼樣的岩場／什麼季節去／怎麼去含大眾運輸・開車・停車／規範／依程度挑路線／查資料的入口／參考資料），另加「跟阿爾科怎麼排」。導言末句交代本篇幫讀者決定什麼；tldr 先講岩場，再講冬季封路與夏季禁停。
- 依程度挑路線：抱石區沒有可查證的運攀路線，四級 H3 照規格保留並寫「來源沒列」，抱石表依 Font 分四組；入門組沒有具名題目，改給 Boulder Park 的具體去處。
- 指南書條目第一句照規格；舊版 Daone Prog 註明已被取代。
- 連結：導言連系列總覽、阿爾科篇（英文版連 -en）；第一次出現的來源都是 inline 連結。中英對等，英文版義大利文來源標 (in Italian)。

## post-polish

- register-scan 第一輪：長句 10 句、但書 2%、數字密集段 6（交通與停車段 17、20 個數字）。
- 已改：PNAB 收費停車長句拆成兩句；Val di Fumo Express 段拆句；冬季封路句斷開。停車與時刻表段的數字是查表資訊，保留。
- 「依程度挑路線」四個空等級只寫「來源沒列」，說明集中在段首一段，不逐級重複。
