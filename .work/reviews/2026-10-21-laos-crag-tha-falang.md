# Tha Falang：中英獨立審稿

2026-10-21。theCrag Tha Falang 頁（含子區結構、Nearby Icons）、The Crag Journal 2023 寮國文、GCH 攀岩頁讀取。中英全文讀完。

## post-verify

- 🟢 33 條（theCrag，2026-10-21）與「over 30 routes」（Crag Journal 2023）兩者並列，未把其中一個當唯一值。
- 🟢 子區結構：Disneyland、Zombieland、Wonderland、KeLu Block、Phantasialand、Xe Bang Fie Cave：theCrag Tha Falang 頁的子區清單，逐項核對無誤。
- 🟢 代表路線：Caterpillar 7a、March Hare 7a+：theCrag Tha Falang 頁 Nearby Icons。
- 🟢 距離「less than 2 km」：Crag Journal 2023 原文「Less than 2km from GCH is another area called Tha Falang」。
- 🟢 岩質描述（部分路線長滿植物、部分區域髒）：Crag Journal 2023 原文，並在正文標為 2023 年觀察，未寫成 2026 年現況。
- 🟢 「人少」：Crag Journal 2023「Pha Tang doesn't get many climbers」的同類語氣與 Tha Falang 的獨立觀察；正文寫成「很少人」，屬該文的主觀描述，已用「多數人把時間留給 Pha Tam Kam」呈現。
- 🟢 指南書涵蓋 Tha Falang：GCH 攀岩頁列 Thakhek 為主，Tha Falang 位於 Thakhek 範圍內。
- 未驗：Tha Falang 各子區的逐條路線名、遮蔭方向、approach 是否在雨季會淹、是否有當地收費。公開頁面沒有這些資料，正文一律寫成「沒有公開資料／自己確認」，入門與 7 字頭兩張表的路線欄位用「區域路線」的誠實寫法，沒有虛構路線名。
- 判定：Tha Falang 的逐線資料在公開來源不足，因此路線表以「級數帶＋區域」呈現，並在表下明說名稱以指南書為準。此為刻意的取捨，不是缺漏。

## post-review

這一篇的讀者對象是「在他曲待超過一週、想換一面牆」的人，文中第一段就設定了這個情境，再給 33 條的現實與它的價值（少見的長路線、安靜）。

五個風險點各自獨立成段：無人維護、植物與落石、無救援、勿單獨前往、游泳與水流。沒有用一句「注意安全」概括。

「沒有即時資訊，第一次去建議排在上午」這類句子把不確定性轉成行動建議，讀完後讀者能做的決定明確。

## post-polish

入門段的寫法是誠實的：這裡的 5 字頭比 Tree Lounge 少人走，岩面可能有灰塵或植物，先試一條短路線確認岩況。比假裝有完整入門路線清單好。

可選修：表格中「多條／少」這類非數字欄位若要更精確需要指南書實體；現階段維持，非必修。

### 定稿掃描補記

register-scan 與 phrase-ledger 已實際執行，無 ledger 命中。本輪修掉文末 `\n` 字面字串殘留（寫入時的跳脫殘留），中英兩版皆已重寫確認。

### 定稿結構調整（2026-10-21 晚間）

依 `crag-guide-contract` 重寫 H2 與「依程度挑路線」：四級標題由 `climbing-grade-convert.mjs --write` 補 YDS 範圍。公開頁面沒有 Tha Falang 的逐線索引，所以入門、中級與高手三級寫「來源沒列」並說明理由，只有進階級有可查證的 Caterpillar 7a 與 March Hare 7a+（theCrag 圖示），2 rows / 0 issues。子區與風格表移到「這是什麼樣的岩場」段（欄位不含「難度」，不觸發換算規則）。

🔵 修：刪掉原稿用「區域路線」假造路線名（5a–5c 這類級數帶）的寫法，該寫法既不誠實也會被換算器誤讀。
