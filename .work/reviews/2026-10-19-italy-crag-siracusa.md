# Review: 2026-10-19-italy-crag-siracusa（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-siracusa.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-siracusa.md`。系列〈義大利岩場〉order 1906。作者自審（同一 agent，依 post-verify／post-review／post-polish 清單）。

工具降級（toolDegradation）：Groundlane MCP 前半可用（search／fetch／extract），中途「not connected」；theCrag 改用 Exa web_fetch_exa 與 Groundlane extract（直接 curl 403、r.jina.ai 只回 312 bytes）；Planetmountain 用 r.jina.ai；搜尋用 Keenable。原文存檔於 scratchpad/sic/。

## post-verify

逐條對照研究筆記裡已打開的來源（封閉、保護區、交通、救援全查）。

- 🟢 theCrag Siracusa：913 條、Canicattini 626 條、「Hidden gem…」、Di Roccia di Sole 第 5 版 2022；Sortino 標「Closed」、Grotta dei Pipistrelli 與 La Pagoda 標 Warning（內文未讀，正文已寫明只是 DB 標示）。
- 🟢 theCrag Canicattini：五區路線數（155／194／93／40／115）、Cava Bagni Alta 1,305 筆、「emphasising movement and technical climbing」、全打錨、走步道、關門、Inox 316L、無露營車設施、無攀岩店、卡塔尼亞機場、「a car is strongly recommended」、E45／SS114→SP14；Nearby Icons 十條的難度、星等、子區、次數。
- 🟢 theCrag Cava Bagni Alta：兩處停車（SP74 過橋右側；Via Bagni 汙水處理廠）、可從鎮上走 Via Bagni、2017 年 Löw／Leube／Stahr、2017 年後 350 條以上。
- 🟢 theCrag 各區：Belvedere 20 條 5a–7b+、適合初學與家庭、右牆中午前陰影；Friends of Canicattini 垃圾公告（約 20 袋、「Laura」）；Jungle Book 13 點前陰影；Fuchsberger 31 條 6a–8a 朝東到東南；B4 70 公尺繩、中午前陰涼；Contrada Alfano 起點、150 條以上 5b–8b；Cavadonna 115 條、SP74 約 4 公里接 SR15；Bassa SP14 約 2 公里、Lost Places 26 條。
- 🟢 Planetmountain Antro dell'Eco：21 條 5a–8a，表中 7 條的難度與長度、開線者 Flaccavento／Tidona。
- 🟢 Climb Europe：「over 400 routes」、峽谷深達 200 公尺、秋到春、唯一涵蓋錫拉庫薩的指南書。UKC 2022：春秋最好、7–8 月太熱、雨季、租車、Gresham 首批高難 DWS。
- 🟢 visitsicily：「the leading location for lovers of Deep-Water Soloing」、Plemmirio 海蝕洞。
- 🟢 Up-Climbing 2014：Gruppo Roccia Siracusa 因夏天熱而玩 DWS、城市海岸 6 公里沿自行車道、三個點（Bar Tunisi 15–17 公尺；石拱部分起攀處有露出的岩石；Cannone 下午有太陽、6a–8a）、7c+/8a 首攀、不要獨自去。正文標「12 年前的二手報導」。
- 🟢 Plemmirio 設立命令（2004-09-15）：A 區 Capo Murro di Porco「riserva integrale」，只允許救援、巡查、研究、授權導覽潛水；balneazione 從 B 區起；禁止破壞地質構造。EU MSP：A 80、B 1,470、C 950 公頃，「bathing and swimming is only permitted in zones B and C」。2025 補充規定：沒有攀岩／DWS 條文。
- 🟢 CNSAS Sicilia：打 112 並要求啟動 Soccorso Alpino e Speleologico。
- 🟢 交通：infopoint 列 Canicattini 巴士營運者 AST；Trenitalia「Messina – Catania – Siracusa」線存在。
- 🔵→已修：導言原寫「城西約 15 公里」與「往南約一小時車程」，沒有來源 → 刪除。中英同步（英文版本來就沒寫距離）。
- 🔵→已修：Plemmirio 段原寫「在 Maddalena 半島」，只看過搜尋摘要 → 刪除，改從命令寫起。
- 🔵→已修：中文「DWS 是夏天的玩法」被 check:tw 標記 → 改「夏天的選項」。
- 🟡 未寫入：Guardia Costiera 1530（Groundlane 403、Exa 逾時、jina 403，整條鏈失敗）；AST 第 648 線時刻表 PDF（連線逾時）。正文只寫營運者與「出發前查」。

本次只檢查文中已提出的宣告；DWS 題數與 8a 以上的具名路線是資料缺口，正文已寫「來源沒列」或「沒有路線名」。

## post-review

- 機械檢查：`climbing-grade-convert --check` 中英各 19 列通過；`check-tw-terms` 0 blocking；`check-post-references` 本篇無錯誤；`check-lang-parity` OK；`check-process-leak` 通過。
- 結構對照契約：固定 H2 七節齊全（多一節沒有；DWS 併在「這是什麼樣的岩場」與規範裡）；「依程度挑路線」四級 H3 帶 YDS 範圍；換算說明在段首；「指南書」bullet 第一句照契約。
- frontmatter：date 2026-10-19、type guide、series order 1906、中英系列名正確；tags 6 個（含 deep-water-solo、sicily）；tldr 先講岩場再講季節與 Plemmirio A 區；description 列主題不重複 tldr。
- 導言末句說明本篇幫讀者決定什麼；連到系列總覽與同批的拉古薩篇、既有的聖維托羅卡波篇（中英對應 -en）。
- 封閉類句子：Plemmirio 用一手命令；Sortino 等標「只是資料庫標示」；DWS 點位標二手與年份。
- 台灣讀者：交通從卡塔尼亞機場講起，直說不開車的折衷（住鎮上走 Via Bagni）。

## post-polish

- register-scan 第一輪：長句 15 句、但書段落 8%、引述區塊 0、姓名當主詞 0、模板化轉折 0、英文術語 0。
- 已改：導言「兩個理由」長句（94 字）拆成三句；五大區那句（94 字）拆成「最多人爬的是…；起點是…；其餘…」。
- 保留：剩下的長句多是走法與規範條文，含路名與命令引文，拆開會失去對應關係。
- 數字密集段（五大區、Plemmirio 面積）屬查表資訊，保留。
