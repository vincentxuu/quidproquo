# Review: 2026-10-19-italy-crag-monte-bianco（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-monte-bianco.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-monte-bianco.md`。系列〈義大利岩場〉order 201。作者自審（同一個 agent 研究與撰稿，非獨立審稿）。

工具降級（toolDegradation）：Groundlane MCP 前半可用（一次 CONCURRENCY_LIMIT、一次 stream 中斷後重試成功），帳號切換後「not connected」；lovevda、Versante Sud、Skyway 停車／公告頁改用 curl；theCrag、Mountain Project、SummitPost 用 Exa web_fetch_exa；Outdoortest 用 jina read_url。

## post-verify

逐句對照研究筆記中實際打開的來源；纜車、停車、道路、鐵路、救援全數檢查。

- 🟢 Skyway 時刻表：2026-09-14～11-01 與 11-02～11-15 首班 8:30、最後下山 15:30、週末 16:30；11-16～12-04 停駛；2027-04-19～05-21 停駛；6-26～7-31 首班 6:30、最後下山 17:30；8 月 18:00；Helbronner 停留 1.5 小時、攀登者不受限；班次可能因技術／天候調整。
- 🟢 La Stampa 2026-05-20：5/23 復駛，第二段中午前後開，5/24 全面營運。
- 🟢 Skyway 停車：300 個室內車位、首班前半小時開、前 30 分免費、1–5 h 每小時 2 歐元、13–24 h 15 歐元、多日每天 15 歐元。
- 🟢 Skyway 公告 2026-10-18：只有登山路線、無標示無檢查無防護；Thoula 階梯關閉禁用。
- 🟢 Skyway Rifugio Torino 頁：「closed until end of May」。Skyway How to reach：SAVDA、Geneva 106 km。
- 🟢 Courmayeur 嚮導：Helbronner 3,400 m、Torino 過夜、1h30 接近、300 m 最難 6b、冰斧冰爪登山靴、一人 1,008 歐元、半膳 65 歐元另計、可首班一天完成。
- 🟢 Planetmountain 路線頁：Via degli Svizzeri（1956、300 m、ED- 7b max、必要 5+、檢查垂降站）、Calcul du Roi（2024-07-15 懸空岩板警告、300 m、6c 或 6a+/A0、必要 6a）、Bettembourg-Thivierge（1975、250 m、TD+ 6b、必要 5+、#3.5）、Camalot（2024、200 m、TD- 6a+、必要 5c、11 點後有太陽、25–30 分）、Dromi（1996、600 m、6b+、必要 6a、Lavachey 2 h）、Elios & Super Elios（2023、3,813 m、「Stimiamo 8b」）；列表頁的 Astro Zap、C'era una volta il West、Bonne Ethique、Cric e Croc、Cenerentolo、Elixir d'Astaroth、Empire State Building、Eau et gaz、Aiguille Croux、Dente del Gigante 難度與一句描述。
- 🟢 Mountain Project Grand Capucin：「No route easier than sustained 5.10」、Voie des Suisses 6a 12 段、Bonatti-Ghigo 7b 15 段、Elixir 7b+、冰河「significant crevasse-fall hazard」。SummitPost：490 m、1951 Bonatti/Ghigo、落石與天氣警告。
- 🟢 CAI Seregno Salluard：VII-／VI 加 A0/A1、TD-、280 m、1h30、5 h、Estate、冰爪冰斧兩條半繩、裂隙。
- 🟢 theCrag 214 條（2026-10 讀到；盤點檔 2026-10-18 寫 280，以現在讀到的為準）；Mont Blanc Granite Val Ferret 248 條、Val Veny 2023 116 條。Rock+Run：JMEditions 2025-06、276 頁、作者三人、每冰斗有小屋、Dalmazzi。Versante Sud：2020、英文；libridimontagna 447 頁、作者 Calebasso、Pasquetto。
- 🟢 lovevda Val Ferret：6–9 月公車到 Planpincieux/Lavachey/Arp Nouvaz、車到 Lavachey、260 位、9–19 收費。AostaSera 2026-05-23：5/22 起重開、Lavachey–Arpnouva 禁行、全天禁停拖吊。
- 🟢 大區鐵路頁與 2026 新聞：2024-01 停駛、2027-01-11 Ivrea–PSM、春天到奧斯塔。CityNext 2026-10-03「non esiste una data」。
- 🟢 大區救援頁：112、800.800.319、免費、要說的三件事。
- 🟢 Outdoortest：120 歐元／分鐘、上限 3,500、全額；正文已標二手。
- 🔵→已修：Dente del Gigante「4,013 m」只來自搜尋摘要，未打開來源，刪除；「在 4,000 公尺」改寫。
- 🔵→已修：Calcul du Roi 中文備註原寫「強烈建議」主詞不明，補「他們」（發現者）。
- 🟡 無刪除事實。Torino 山屋 2026 確切營業日期、Panoramic 纜車日期未查到，正文未寫。

## post-review

- 機械檢查：`node scripts/climbing-grade-convert.mjs --check` 18 行通過（中英）；`check-tw-terms` 0 blocking／0 to review；`check-post-references` 本篇無問題；`check-lang-parity` OK；`check-process-leak` 無輸出。
- 結構：導言（位置＋這篇幫你決定什麼＋總覽與 IFMGA 連結）→ 這是什麼樣的岩場（規模表改成段落，因只有 theCrag 與指南書兩個數）→ 什麼季節去（Skyway 期間表）→ 怎麼去（大眾運輸／開車／停車）→ 規範（冰河、Skyway、落石、救援、費用二手、嚮導）→ 依程度挑路線（四級＋UIAA 表）→ 查資料的入口（指南書 bullet 首句照契約）→ 參考資料。✅
- frontmatter：date 2026-10-19、series order 201、tags 含 alpine-climbing、aosta-valley；tldr 先講岩場再講纜車停駛與鐵路；中英 series name 正確。
- 入門級：衛峰幾乎沒有 6a 以下，照實寫並只列一條，沒硬湊。高手級只有一條單一來源，備註已寫。
- 台灣讀者位置：從日內瓦／杜林方向的交通、鐵路停駛替代方案、請嚮導的價格都可直接照做。
- 跨篇連結：系列總覽、IFMGA 總覽（已存在）；中英各自連對應語言。

## post-polish

- register-scan 第一輪：長句 15 句、但書 5%、模板化轉折 0、英文術語 0。
- 已改：開場「兩種去法」長句拆成兩句；theCrag 規模句、Val Ferret 停車句、救援句在分號處斷句。
- 第二輪：長句 12 句，剩下多為含義大利文原文引號、路線名與數字的查表句，保留。
- 保護片段（引號原文、數字、連結）回讀未變；改後重跑 grade check 與 check:tw 結果同前。
