# Review: 2026-10-21-malaysia-crag-bukit-keplu

撰稿自審（撰稿與審稿同一 session，非獨立第三方），2026-10-21。對照 `.research/2026-10-21-malaysia-crag-bukit-keplu.md`、`docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md` 第 6 節與 `.agents/skills/post/references/crag-guide-contract.md`。theCrag 屬群眾 DB（不能單獨撐），落石與頭盔的說法來自社群記錄，正文一律標成社群回報而非岩場公布的規則。Groundlane 在本 session 未接線，來源依研究筆記已擷取的原文讀回。

## post-verify

🟢 路線數與子區：28 條運動攀、5c 到 7b+；Siputeh 9 條（21 次攀登）、Si Mata Tiga 19 條（37 次攀登、55 m）。頁面更新 2026-10-18。正文表格與段落一致。

🟢 壁型與氣候描述（overhung／slab／vertical、afternoon sun、3pm 開始熱、dry in the rain）逐字照頁面寫，沒有誇大成「全年適合」。

🟢 接近方式兩個選項完整保留：左邊穩固橋 → 20 分鐘叢林小徑 → Si Mata Tiga（穿過枝葉間的空地後陡峭左上升）；右邊臨時原木橋 → 5 分鐘小徑 → Siputeh。theCrag 給的停車點地圖連結也收進正文與參考資料。

🟢 停車與農路：allowed、停稻田前空地、不要擋路、窄農路要留給農民——四點都寫進去，沒有簡化成「有停車場」。

🟢 落石：研究筆記記載這條來自社群記錄（「有致命落石風險，確保者必須戴頭盔」），正文明寫「社群的落石回報要當真的看」並說明它是社群回報、不是管理單位公布的規定。

🟢 硬體：2026-08 theCrag 論壇的 Habuk Mata 掛片鬆動回報寫成「有人回報」，並交代要出發前一周再看論壇。

🟢 歷史：Kok Plu 來自暹羅語 Betel Hill、七個洞穴名、1950–1980 年代收蝙蝠糞與牆上竹桿痕跡，都照頁面寫。

🔵 已修：初稿把「Kodiang」寫成無連結的專名，已改成首次出現即連到 theCrag 頁面；參考資料補上正文引用過的每一條網址（theCrag、地圖連結、論壇、MetMalaysia、指南書書目、theCrag 指南書頁面、Rock Climbing in Thailand and Laos、Mountain Project 難度對照表）。

## post-review

讀者適配：文章回答的是「一個上午能不能爬得完、要怎麼進去、停車會不會擋到農民、能不能不戴頭盔」。前三題在對應段落，第四題在「去之前要知道的規範」並明標社群來源。

結構檢查：七個 H2 依序；「怎麼去」下三個 H3；四個級距 H3 標題與 `climbing-grade-convert.mjs` 的 HEAD 一致。

四級路線表：入門與中級都寫「來源沒列」並說明原因（難度範圍從 5c 起，但沒有公開任何 5c／5c+／6a／6a+ 到 6c+ 的路線名）；進階只有 Komplikasi（7b+）一列；高手寫「來源沒列」，並說頁面上限就是 7b+。沒有為填表造名稱。

住宿（Bayu Damai 約 500 m、Sena Village 約 2 km）放在「怎麼去」的停車段落之後，沒有另開 H2，避免打亂固定結構。

指南書條目第一句是固定句，底下照合約列絕版書、UKC 書目與「馬來西亞沒有現行紙本指南」。

缺口（正文已寫成限制）：頁面沒有公布岩栓狀況與維護紀錄；論壇的掛片問題是回報而非普查；附近的醫院與救護車距離沒有可引用的資料。

## post-polish

zh／en 兩版對讀確認語氣一致。中文用台灣用語（岩栓、掛片、確保者、快扣、影片、資訊）。英文版沒有把中文 sector 名殘留帶進表格。

「兩條接近路線」那一段用條列寫成兩條可執行的走法（橋的種類、步行時間、走到哪個子區、路上會遇到什麼），讀者可以照著選，而不是一句「從叉路口有兩個選擇」。

「熱門度」這類資料只留在星等與攀登次數，並標明是 theCrag 的數字；沒有用星等推論「這裡很安全」。

機械閘門（針對本系列 10 個檔案重跑）：`climbing-grade-convert.mjs --check` 26 列通過；`check-process-leak.mjs` 10 檔通過；`check-post-quality.mjs` 10 檔無錯誤；`check-post-references.mjs` 與 `check-tw-terms.mjs` 通過。全站 `pnpm verify` 與 `check:series-plan` 由上層執行。
