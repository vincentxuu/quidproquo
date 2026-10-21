# Review: 2026-10-21-malaysia-crag-gunung-lang

撰稿自審（撰稿與審稿同一 session，非獨立第三方），2026-10-21。對照 `.research/2026-10-21-malaysia-crag-gunung-lang.md`、`docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md` 第 6 節與 `.agents/skills/post/references/crag-guide-contract.md`。theCrag 與 moredaysoff 都屬群眾 DB／個人部落格（不能單獨撐），所以本篇把兩份來源的數字並列而不合併。Groundlane 在本 session 未接線，來源依研究筆記已擷取的原文讀回。

## post-verify

🟢 兩份來源的數字並列未合併：theCrag 記 28 條、Mostly Sport climbing、699 次攀登、20 m、15 個級距、East Wall 單一子區、頁面更新 2026-10-18；moredaysoff 2023-12-28 寫 "about 30 routes from 5b to 8a"。正文把兩個數字並列並各自標出處，沒有取其一、也沒有平均。

🟢 具名路線四條：Spicy 5c（★★）、Route 4 6b（★★）、Ice Box 6c（★★★）、Ketoyong 6c+/7a（★★★）。Ketoyong 的雙級數在備註寫出「頁面同時標 6c+ 與 7a」，換算欄依對照表取第一個（5.11c）。

🟢 水窪：頁面描述寫 large puddles at the base of most of the climbs，正文照寫並說明它影響起步摩擦，沒有淡化。

🟢 土地狀態：頁面 access 寫 Allowed／Private／private property, but freely accessible，正文保留「私人土地、可自由進入」並提醒業主可以改變安排；沒有寫成免費公有地。

🟢 停車：頁面寫可停路邊或公園停車場並補 Please park responsibly，正文兩種都寫，並提醒市區路邊停車影響居民。

🟢 硬體：2026-01 theCrag 論壇回報 Route 1 岩栓鬆動、Spider 固定點鉤環開著，正文寫成「有人回報」而非定論。

🟢 Grab 車資約 RM10、舊城 3 公里、中午後有蔭、牆面從不到垂直到略陡、六年前開發——全部標明是 2023-12-28 的社群記錄。

🔵 已修：初稿的英文版「(updated 2026-10-19 territory, page dated 2026-10-18)」語句混亂，已改成單一日期；「Ipoh」「moredaysoff」等專名改為首次出現即連結；參考資料補上正文引用過的每一條網址（theCrag、論壇、moredaysoff、KTMB、MetMalaysia、指南書書目、theCrag 指南書頁面、Rock Climbing in Thailand and Laos、Mountain Project 難度對照表）。

## post-review

讀者適配：文章回答「住怡保時有沒有辦法用半天爬岩」。交通（Grab 3 公里）、季節（中午後有蔭）、硬體（水窪、2026-01 的鬆栓回報）、土地狀態（私人但開放）四件事都有明確答案。

結構檢查：七個 H2 依序；「怎麼去」下三個 H3；四個級距 H3 標題與 `climbing-grade-convert.mjs` 的 HEAD 一致。

四級路線表：入門一列（Spicy 5c）、中級三列（Route 4、Ice Box、Ketoyong）、進階與高手寫「來源沒列」並說明理由（theCrag 記 15 個級距、2023 年社群記錄說到 8a，但沒有公開 7 字頭與 8 字頭的具名路線）。沒有把級距範圍冒充成具名路線。

指南書條目第一句是固定句，底下列絕版書、UKC 書目與「馬來西亞沒有現行紙本指南」；因為這個岩場是市區的，額外保留 KTMB（怡保 ETS）與 moredaysoff 兩個入口。

缺口（正文已寫成限制）：頁面未記錄朝向與季節表；兩個路線數無法互相驗證；市區的救護車與醫院距離沒有可引用的資料。

## post-polish

zh／en 兩版對讀確認一致，英文版沒有把中文殘留帶進 sector 欄（全部寫 East Wall）。

「兩個路線數並列，不合併」用小標題與粗體呈現，讀者一眼能看出這是本篇的核心限制，不會被當成排版錯誤。

排程建議（上午爬、下午休息）寫成可執行的行動，沒有停在「注意天氣」這種沒有動作的建議上。

機械閘門（針對本系列 10 個檔案重跑）：`climbing-grade-convert.mjs --check` 26 列通過；`check-process-leak.mjs` 10 檔通過；`check-post-quality.mjs` 10 檔無錯誤；`check-post-references.mjs` 與 `check-tw-terms.mjs` 通過。全站 `pnpm verify` 與 `check:series-plan` 由上層執行。
