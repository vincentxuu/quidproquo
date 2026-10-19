# Review: 2026-10-19-italy-crag-collepardo（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-collepardo.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-collepardo.md`。系列〈義大利岩場〉order 1204。作者自審（brief 指定 subagent 依三個 skill 清單自審）。

工具降級（toolDegradation）：Groundlane MCP 本 session 回 CONCURRENCY_LIMIT／upstream error → Keenable keyless 搜尋＋r.jina.ai（Climbook 成功；Planetmountain、Alpinisti d'Appennino、Oliunid、Monti Ernici 論壇只回 242 bytes 錯誤頁）→ Exa web_fetch_exa；Oliunid 全文用 jina read_url MCP；封閉一手來源與 Cotral 路線用 Exa web_search_exa。Firecrawl 未用。

## post-verify

開了 15 個來源，抽出正文 38 條宣告逐條對照。

- 🟢 Planetmountain 岩場頁：31 條、6b–9a、NNE「in the shade all day long」、左右壁 19＋12 條與長度難度（Traverso della muerte 7a 18 m、Bella Lu' 8b 27 m、Clorophilla 7c+ 25 m、La gasparata 7b、Madonnazinonvedol'ora 6b+、La scallona 6b 18 m 等）。
- 🟢 Planetmountain 2016：約 30 m 高的洞、2015 年 Vertical Park 教練群由下往上打 bolt、Gambineri 發現、河谷約一百條四個主區、La Pala 1990 年代 La Bozzetta、Classico 與 Bambocci 約 2003、大雨可爬、Intorre 推薦 Tomorrowland 與 Bella Lù、村子「novecento anime」。
- 🟢 Planetmountain 2019：羅馬東南約 1.5 小時；Rèveille-toi 是 Podio 打的 8c Il traverso dei sogni 的直上出口、Lemaire 打 bolt、冬天滲水；Rogora 首攀清單（Tomorrowland ext 2016-11、Supercrack 2016-12、La Gasparata 2017-01、Ercole 2017-03、Sitting Bull 2018-04、Rèveille-toi 2019-06）。
- 🟢 theCrag：67 條、左壁全天陰影、右壁到 14:00 有太陽、乾燥於雨天、SP115 往 Trisulti 約 4 km 的 Lo Scoiattolo、「Accesso ripido 10-20 minuti」、最低 6a+、The Bomb 9a Peri 2020 從 Callagan 橫渡約 10 m 接 Sitting Bull、位置未知。
- 🟢 Climbook：禁攀句原文、「Aggiornamento maggio 2026（Fonte: il chiodatore, R. Podio "Limetta"）」、1,751 次、重複榜（202／168／140／100／91／88／84／76／76／66）、約十年前留言（市警告知、Forestale 執法、可能罰款）、「ideale per le mezze stagioni」。
- 🟢 Alpinisti d'Appennino（2023，2024 更新）：左右壁 21＋18＝39 條、6b–8c+、Cuevita 在步道上、雨天條件、N／NE、15 分、10 mm 栓與不鏽鋼膠栓四星、830 m、9–11 月、「Interdizione dal 1 gennaio al 31 luglio」、開車路線、圍籬、12–14 快扣、60 m／80 m、護膝。
- 🟢 Oliunid 2023：2023 年 1 月到 7/31 因猛禽築巢限制、8b 以上需至少 7a、秋天最好、8 月只挑陰涼有風日、La Pala／Classica 20–40 度、25–30 m、Ercole 與 Sitting Bull 在那邊。
- 🟢 parks.it ZPS IT6050008：Collepardo 在市鎮名單、管理單位 Monti Simbruini 區域公園、DGR 612/11。Circeo 公告引 DGR 612/2011 的 1/1–7/31 規定。Planetmountain 2020 Peschio delle Cornacchie：同 ZPS、大區 2020-01-21 函。
- 🟢 CNSAS：118／112、免費。Arrampica Roma Sud 書目欄位同 2026-10-18 書目檔。
- 🔵→已標：封閉句沒有 2026 年一手公告，依契約在正文標「二手：Climbook 2026 年 5 月更新、Alpinisti d'Appennino 2023、Oliunid 2023，未找到 2026 年的原始公告」，並建議出發前問 Vertical Park 或公園。法規背景（ZPS 名單、DGR 612/2011）用一手頁面寫，但明寫「洞穴是否在 ZPS 界線內沒找到官方圖資」，不推論。
- 🔵→已標：Cotral Frosinone–Collepardo 時刻只在 Moovit／busmaps（Cotral GTFS 的聚合站）看到，正文寫「聚合站整理的 Cotral 資料」並以 Cotral 時刻查詢為準。
- 🔵→已修：導言原寫格羅蒂「往北約 2 小時車程」，沒有來源，改成「同在拉齊奧的格羅蒂」，中英同步。
- 🟡 未找到：La Pala、Classica 的路線清單與路線數；Ercole、Sitting Bull 的確切子區（只有 Oliunid 一句）。

## post-review

- 機械檢查：`climbing-grade-convert --check` 兩檔 19 列通過；`check-tw-terms` 0 blocking、0 to review；`check-process-leak` 通過。
- frontmatter：order 1204、type guide、tags 5 個；tldr 先講岩場（位置、洞、規模、Rogora、陰影與雨天），再講最會改變行程的封閉期與可排月份、要開車。description 列主題。
- 結構：契約 H2 依序齊全；四級表中「入門」寫「來源沒列」（洞內最低 6b、theCrag 最低 6a+），不硬湊；其他三級都有表。
- 一致性：路線數 31／39／67 在 tldr 與規模表一致；禁攀日期全文四處寫法一致（1/1–7/31）；「實際能排 8–12 月、最好 9–11 月」在 tldr 與季節節一致。
- 連結：導言連總覽與格羅蒂（同批指派的檔，en 連 -en）；首次出現的來源都有 inline 連結。
- 指南書條目：第一句照固定句；說明書在 2016 年出版、La Cueva 2015 年才開線，新路線要對照線上資料。

## post-polish

- register-scan（中文）：模板化轉折 0、姓名當主詞 0、英文術語 0。數字密度最高的是封閉段（19 個，日期與出處年份）與法規段（11 個）。
- 保留：封閉段的日期與來源年份是契約要求的出處標示，刪了就失去「二手」的依據；法規段的 ZPS 代碼與 DGR 號碼是讀者回查用。
- 已改：導言去掉無來源的車程。
- 保護片段（義大利文引號原文、路線名、數字、連結）回讀未變；改後重跑 grade check、check-tw-terms 通過。
