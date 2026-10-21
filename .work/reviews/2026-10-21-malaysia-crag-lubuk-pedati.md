# Review: 2026-10-21-malaysia-crag-lubuk-pedati

撰稿自審（撰稿與審稿同一 session，非獨立第三方），2026-10-21。對照 `.research/2026-10-21-malaysia-crag-lubuk-pedati.md`、`docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md` 第 6 節與 `.agents/skills/post/references/crag-guide-contract.md`。theCrag 屬群眾 DB（不能單獨撐）；本篇的事實幾乎全部來自 theCrag 單一頁面，因此每一列表格備註都標了單一出處與頁面更新日期。Groundlane 在本 session 未接線，來源依研究筆記已擷取的原文讀回。

## post-verify

🟢 路線數與子區：35 條運動攀；Hornet Section 20 條（127 次攀登、20 m、9 個級距）、Otter Section 5 條（98 次、19 m）、Goat Section 7 條（29 次、20 m）、Bat Section 3 條（24 次、11 m）。子區表與內文一致；只有 Hornet 有級距數，其餘寫「未列」而非推算。

🟢 具名路線五條全部收錄且沒有增加：Awang Setia 6a+、BMM 6b、Hanger Heist 6b+、Breakthrough 6c+、High Boltage 7b+，三星來自 theCrag。

🟢 岩質與描述：研究筆記記載頁面沒有岩質欄位、也完全沒有描述，正文因此寫「頁面對這個岩場未附描述」，沒有把 Bukit Keplu 的石灰岩搬到這裡。

🟢 接近方式照頁面原文逐步寫：Gua Jepun → 左邊 Jin Seng Construction 機車店轉入泥路 → 轉左直行 → 左手邊有橋 → 三岔路取中間小徑 → 左手邊是 Lubuk Pedati 河；並保留「兩側植物會刮車」這句。

🟢 交通與住宿：頁面寫 public transport in this area are scarce、any homestay nearby should suffice，正文照寫，沒有補票價或班次。

🟢 2.5 天串接行程（Instagram DOOB2LMEucV）來自行程筆記 6.1，網址同時列在正文與參考資料。

🔵 已修：初稿有一處簡體字「这一带」已改為「這一帶」；「Baling」與「Bukit Keteri／玻璃市」等專名改為首次出現即連結；參考資料補上正文引用過的每一條網址（theCrag、論壇、Instagram、Mountain Project、指南書書目、theCrag 指南書頁面、Rock Climbing in Thailand and Laos、Mountain Project 難度對照表）。

## post-review

讀者適配：文章回答「這個偏遠岩場值不值得專程一趟」。三個決定點分開寫：自駕與最後一段泥路（怎麼去）、沒有任何成文規則與空白硬體資訊（去之前要知道的規範）、線上只剩路線與攀登次數（依程度挑路線）。

結構檢查：七個 H2 依序；「怎麼去」下三個 H3；四個級距 H3 標題與 `climbing-grade-convert.mjs` 的 HEAD 一致。

四級路線表：入門寫「來源沒列」並說明五條具名路線沒有一條在 6a 以下；中級四列、進階一列，每列備註都寫 theCrag 出處與頁面更新日期；高手寫「來源沒列」並說明公開具名路線最高到 7b+。長度與子區兩欄一律「—」，沒有拿分區平均長度冒充路線長度。

指南書條目第一句是固定句，底下列絕版書、UKC 書目與「馬來西亞沒有現行紙本指南」的現況。

缺口（正文已寫成限制）：頁面沒有描述、沒有岩質、沒有季節表、沒有停車資訊；內陸醫院與救護車距離沒有可引用的資料。

## post-polish

zh／en 兩版對讀確認一致。接近方式的兩種選擇用編號條列，讀者可以照著走；英文版同樣保留 1–5 步，不用一段話壓縮掉。

「35 條是一個數字，不是一份能帶走的路線表」這類句子在兩版都保留，沒有被修成更輕鬆的語氣——這正是本篇要提醒的事。

子區表用「級距數」欄並在沒有資料時寫「未列」，沒有拿 9 個級距去推其他三區的級距。

機械閘門（針對本系列 10 個檔案重跑）：`climbing-grade-convert.mjs --check` 26 列通過；`check-process-leak.mjs` 10 檔通過；`check-post-quality.mjs` 10 檔無錯誤；`check-post-references.mjs` 與 `check-tw-terms.mjs` 通過。全站 `pnpm verify` 與 `check:series-plan` 由上層執行。
