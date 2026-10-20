# Review: 2026-10-19-italy-crag-roccamorice（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-roccamorice.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-roccamorice.md`。系列〈義大利岩場〉order 1302。作者自審（brief 指定 subagent 依三個 skill 清單自審）。

工具降級（toolDegradation）：本篇開始時 Groundlane MCP 已斷線（「not connected」）→ Keenable keyless 搜尋＋r.jina.ai（Montagna.TV、市府頁只回空殼）→ Exa web_fetch_exa 讀 Montagna.TV、市府、theCrag、Climbing Spot Factory。Firecrawl 未用。

## post-verify

開了 19 個來源，抽出正文 44 條宣告逐條對照。封閉、事故、市府規定全數檢查。

- 🟢 市府 Parete dell'Orso 頁（2026-01-02 更新）：引句、命令號與日期（nr. 2 del 12 febbraio 2020）、頭盔強制（攀爬與牆腳）、牆腳落石風險與停留限制、牆下市道「vietato in maniera assoluta parcheggiare」、禁止過夜／露營／帳篷／露營車／拖車、禁火、動力繩、初學者與未成年需有經驗者陪同、課程限登記高山嚮導並通報、不得改 bolt、新路線需許可、禁止寫字掛牌、禁止 dry tooling。
- 🟢 Montagna.TV 2025-04-27：「tempio del climbing nella Majella」、1981 首批傳攀、Rosica 等、2000 後只剩前約 50 條、2014 起不鏽鋼重打（含 D'Anteo）、Linea Gotica 2018、2025 加 13 條（Ghaza 6a–7c+、Linea Gotica 5c–7a）、關鍵段不能拉 bolt、6b 以下現代 bolt、鑿點路線保留、300 多條約十二區、5 級到 8c 與可能 9a 的計畫、第一區在路邊、牆面描述、凹處下午陰影、冬天晴天可爬、隱修院步道；照片路線含 Anteios（Pancia d'Elefante）。
- 🟢 Abruzzo Verticale：岩質、約 2 km、義大利最大結構之一、5A–8B 平均 6C、部分確保鏈沒鉤環要帶 longe、子區列表、朝南、900 m、全年除無陽光冬日、停車與步道（200 m、5–15 分）、Pecorella Smarrita 跨護欄垂降 25 m。
- 🟢 Caramanico Terme（官方觀光）：A25 Caramanico 出口、Lettomanoppello、Block House 4 km、右轉 Santo Spirito 1 km、噴泉旁停車、「uno dei luoghi di arrampicata più famosi dell'Abruzzo」。
- 🟢 theCrag：215 條、4b–8b 平均 6c、沿路排開、早上有太陽傍晚陰影（Galon、Buconi、Ghaza、Plache 例外）、咖啡色「Roccamorice Climbing School」指標。falesia.it（2023-09-30）：190 條、4b/8a、11 區與 Giallon 44、Pancia d'Elefante 29、下降鏈。UKClimbing：204 條、S、空地停兩台車。Climbing Spot Factory：約 250 條與引句、A25 Alanno/Scafa→SS5。
- 🟢 Climbook（Giallon、Settore Alto、Pancia d'Elefante 路線表）：依 Abruzzo Rock 2023 更新的註記與月份；表內 24 條路線的難度、重複次數、舊 topo 難度、L2 待確認。Betacam 在 Pancia d'Elefante 路線表第 36 條。
- 🟢 Planetmountain 2013：Hole's Trilogy 8c，Calibani，2013-06-14。
- 🟢 AbruzzoLive 與 L'Aquila Blog（2025-11-01）：Betacam 下方、大石從上方掉落碎裂、35 歲 Stefano D'Anteo 死亡、兩人輕傷、CNSAS 阿布魯佐與 118 直升機吊掛約 60 m、「messa in sicurezza e posta sotto sequestro」、憲兵與山難救援調查。
- 🟢 馬耶拉公園 Piano e Regolamento：規則 1999 年理事會通過、「in corso di adozione」。Versante Sud Abruzzo Rock：2023 新版、義大利文、ISBN、四省。CNSAS：118／112。
- 🔵→已標：落石區查封的現況沒有一手公告，正文依契約標「二手：地方媒體報導，未找到查封範圍與解除的原始公告；2026 年 10 月查」，並建議出發前問市府或在地社群。
- 🔵→已修：導言原寫 Santo Spirito 隱修院是「13 世紀教宗塞萊斯廷五世修行過」、Roccamorice 在國家公園「西北麓」，這兩點只在搜尋摘要看過、沒打開來源，改成「在馬耶拉國家公園內」與「往岩場的路也通往 Santo Spirito 隱修院」（市府與觀光頁的停車指引），中英同步。
- 🔵→已標：沒找到到村子的公車，正文寫「沒找到」並導到 TUA 官網，不引用 rome2rio 的火車＋計程車說法。
- 🟡 未找到：Hole's Trilogy 的子區；《Arrampicare in Abruzzo》年份；熊之壁的鳥類繁殖禁攀（查無）。

## post-review

- 機械檢查：`climbing-grade-convert --check` 兩檔 24 列通過；`check-tw-terms` 0 blocking、0 to review；`check-process-leak` 通過；`check:lang-parity` OK；`check:references` 本篇無錯誤。
- frontmatter：order 1302、tags 5 個；tldr 先講岩場（長牆、規模、難度、重打 bolt、季節），再講去之前要知道的規定與 2025 事故、要開車。description 列主題。
- 結構：契約 H2 依序齊全；四級表都有路線，Ghaza 與 Linea Gotica 2025 新路線另以一句交代。
- 一致性：路線數在 tldr（190 到 300 多）與規模表一致；事故日期、地點（Betacam 下方、Pancia d'Elefante）在 tldr 與規範節一致。
- 連結：導言連總覽與格蘭薩索（同批指派，en 連 -en）；季節節再連格蘭薩索一次。
- 台灣讀者位置：交代沒有公車、停車點與步道、強制頭盔，照著能做。

## post-polish

- register-scan（中文）：模板化轉折 0、姓名當主詞 0、英文術語 0。第一輪「子區」段 17 個數字。
- 已改：子區段只留兩個最大子區的路線數，其餘只列名（數字從 17 降到 4），中英同步。
- 保留：歷史段（10 個，年份與路線數）、事故段（8 個，日期、年齡、吊掛距離），屬讀者判斷現況要的事實。
- 保護片段（義大利文引號原文、路線名、級數、連結）回讀未變；改後重跑 grade check、check-tw-terms 通過。
