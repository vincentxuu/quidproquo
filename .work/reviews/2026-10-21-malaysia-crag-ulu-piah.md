# Review: 2026-10-21-malaysia-crag-ulu-piah

撰稿自審（撰稿與審稿同一 session，非獨立第三方），2026-10-21。對照 `.research/2026-10-21-malaysia-crag-ulu-piah.md`、`docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md` 第 6 節與 `.agents/skills/post/references/crag-guide-contract.md`。theCrag 屬群眾 DB（不能單獨撐）；落石與頭盔的說法來自社群記錄，正文明標為社群回報而非岩場公布的規則。Groundlane 在本 session 未接線，來源依研究筆記已擷取的原文讀回。

## post-verify

🟢 通知地主的資訊逐字核對：頁面描述要求 contact (call/WhatsApp) and inform the land owner before going，並指定告知人數與時間；聯絡人與號碼寫在頁面上——**Haji Hamid，+60 19-573 6787**。正文的「去之前要知道的規範」第一段與「怎麼去」之前都出現這個號碼，沒有省略、沒有改寫。

🟢 級數分布完整照抄：5c 1、5c+ 1、6a 2、6a+ 4、6b 2、6b+ 0、6c 4、6c+ 0、7a 3、7a+ 0、7b 0、7b+ 3、7c 1、7c+ 1、8a 1、8a+ 1、8b 1，合計 25 條有級數；頁面另記 27 條。正文表格逐格一致，級距分組的加總（入門 4、中級 10、進階 8、高手 3）也與分布相符。

🟢 子區表：A(njing) 4 條／23 次／9 m、B(iawak) 5 條／60 次、C(icak) 15 條／115 次／15 m（運攀與抱石）、D(ubuk) 3 條／45 次／12 m。B 與 D 的牆高頁面未列，表格留「—」。

🟢 具名路線只有兩條：Friend 6a+（★★）、Mencari Impian 7a（★★★）；其餘路線只有級數沒有名字，正文明說「頁面只公開兩條具名路線」，沒有多寫。

🟢 落石：研究筆記記載「致命落石風險、確保者必須戴頭盔」來自社群回報，頁面本身沒有這條規則。正文分成兩句寫：先說明頁面沒有寫，再說社群記錄有，並要求確保者與攀登者都戴頭盔。

🟢 接近與車況：search for Bai Yun Si Thai Buddhist Temple → 開過約 50 公尺 → 岩場在左邊靠河；頁面提醒建議高底盤車、接近路崎嶇多坑洞。正文把這句寫成路面實況而不是客氣話。

🟢 其他社群記錄：附近沒有店家、要帶延長掛桿、Tambun 附近任何 homestay 都夠，都寫進去。

🔵 已修：初稿英文版的 Perak 與 Ipoh 沒有連結，已補上 theCrag 頁面連結；「Tambun」「Perak」在中文版同樣連結；參考資料補上正文引用過的每一條網址（theCrag、論壇、MetMalaysia、指南書書目、theCrag 指南書頁面、Rock Climbing in Thailand and Laos、Mountain Project 難度對照表）。

## post-review

讀者適配：文章回答「這個私人岩場我能不能去、要先做什麼」。三件事各占一段：先打電話給地主（含號碼與要說的內容）、高底盤車與坑洞路、社群記錄的落石與頭盔。

結構檢查：七個 H2 依序；「怎麼去」下三個 H3；四個級距 H3 標題與 `climbing-grade-convert.mjs` 的 HEAD 一致。

四級路線表：入門寫「來源沒列具名路線」並給出該級距的條數分布；中級與進階各一列具名路線，備註標 theCrag 出處與頁面更新日期；高手寫「來源沒列具名路線」並說明分布裡有 3 條 8 字頭但沒有名稱。沒有把「級數分布」假裝成路線表。

指南書條目第一句是固定句，底下列絕版書、UKC 書目與「馬來西亞沒有現行紙本指南」。

缺口（正文已寫成限制）：頁面沒有維護紀錄與岩栓狀況；8a 以上只有級數沒有名稱；Tambun 內陸的醫院與救護車距離沒有可引用的資料；「附近沒有店家」這條只有社群記錄一個出處。

## post-polish

zh／en 兩版對讀確認一致，地主姓名與電話號碼在兩版都完整出現、沒有被翻成別的格式。

級數分布用一張橫向表呈現，英文版用同一組欄位，讀者可以在同一列上比較路線數，不會誤以為是路線名。

「這是業主的私人安排，不是許可證、不是收費」與「頁面本身並未寫這條規則」這兩句刻意保留：它們是本篇最容易出錯的地方（把社群回報寫成官方規則、把通知寫成許可），刪掉會讓文章更順，但會讓讀者判斷錯。

機械閘門（針對本系列 10 個檔案重跑）：`climbing-grade-convert.mjs --check` 26 列通過；`check-process-leak.mjs` 10 檔通過；`check-post-quality.mjs` 10 檔無錯誤；`check-post-references.mjs` 與 `check-tw-terms.mjs` 通過。全站 `pnpm verify` 與 `check:series-plan` 由上層執行。
