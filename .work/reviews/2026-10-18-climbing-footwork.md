# 審稿紀錄：2026-10-18-climbing-footwork（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回報 not connected；Jina reader（429 退避重試）；climbing.com 在 Jina 被擋（403 AbuseAlleviationError），改用 curl＋去標籤讀全文；BMC PDF 用 pdftotext。原始擷取存於 scratchpad `b01src/`。

## post-verify

逐條對照本 session 打開的原文（Baláš 2014、Bonelli 2026 PMC、BMC PDF、DAV Basics、REI、Gresham Climbing.com＋UKC Use of the Toe、UKC Heel Hooking、UKC Toe-Hooking、Jorgeson、Lattice basics＋4 concepts、PRG、Hooper's Off Foot、HANCHOR 阿倫）。

🟢 Confirmed
- Baláš 2014：新手腳負荷低、VO2/HR 高；牆越陡腳負荷越低；轉引 Noé 2001：前傾 10° 靜態站姿腳點受力較低、手點較高（正文標「轉引」）。
- Bonelli 2026：測力岩點、"Steeper wall angles cause load transfer from feet to hand"。
- BMC：腳法分選點與用法、鞋子設計集中於大拇趾、新手不準且進階者也常腳法差。
- DAV Basics：Blick auf die Füße、unbelastet und präzise (Vorderfuß)、"Blind treten ist wie Lotto spielen"、樓梯比喻、無手或只用拳頭爬斜板。
- REI：內側／外側、踩板用於 slab、找凹凸、腳在身體下方、踩好不動、腳跟低、梯子比喻。
- Gresham UKC：站在鞋緣中段圓處的錯誤、45°、外側常被初學者忽略（duck-footing）、外側也用前端、腳跟外轉；slab／好腳點時腳像平台，陡前傾要繃緊並 "drilling"。
- Gresham Climbing.com：腳跟低、不試探、壓力一致、小步、用力壓；jump-and-clump、pivot 與 ballerina、交換要快、大點留內側角落；規劃減少換腳。
- Jorgeson：Wallach、200 呎橫移懲罰、伸直手臂觀察、濕油漆 microdot、腳踝僵硬、鞋子設計集中大拇趾。
- Lattice：選定位置大拇趾踩上去、腳跟太高會滑、太低會減少腳尖受力與摩擦、no one size fits all、轉腳練習；換腳至少五種。
- PRG：安靜腳（低 1–2 級、眼睛跟到承重）、黏腳、slab 雙手→單手→無手。
- Hooper's：被「好」腳點困住。
- UKC heel：plonk 的錯誤、角度與腿後肌；Parkinson「四個可互換的肢體」。UKC toe：防止前傾壁腳甩出、小腿前側肌、不要猶豫。
- HANCHOR：踩點輕而小聲、鞋尖踩點、多花幾秒觀察腳、內側＝拇指側／外側＝小指側、內側更貼牆、換腳兩種做法、踩板、掛腳 heel hook／勾腳 toe hook、腳背橡膠。

🔴／🟠 修正（已改）
- 無。寫作時已避開：iclimb「70% 力量流失」（無出處，未引用）；Noé 2001 的百分比數字（只在轉引中出現、原文未打開，正文只寫方向）；PRG「slab 牆往前傾或超過 90 度」的描述（與 slab 定義矛盾，未採用）。

🟡 Unverifiable（未寫入）
- 「安靜腳」沒有找到台灣固定用語，標為本文譯名；edging 不給中文譯名，只用台灣常說的「內側／外側」。
- 小岩館 IG 的「側切法／疊腳法」只有搜尋摘要，未寫入。

本次只檢查了文中已提出的約 50 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；`register-scan` 長句 0、但書段落 7%；`check-process-leak` 中英皆通過；`check:references` 本篇無錯誤，僅一則 WARN（參考資料標題與文章關鍵詞重疊低，參考資料以英文標題為主）；`check-post-quality` 中文版一則 WARN（tag `bouldering` 對應詞，內文已有「抱石題目」「抱石區」，檢查器只認英文字）。
- 範圍卡對照：看著腳踩 ✅、安靜腳 ✅、鞋尖 edging ✅、smearing ✅、換腳 ✅、腳點高低 ✅、heel/toe hook 入門 ✅；迷思「用腳爬不要用手」只在垂直到微前傾成立 ✅；「70%」未引用 ✅；前傾壁腳法細節留給第 8 篇 ✅；讀完能做安靜腳並說出 edging 與 smearing 差別 ✅（練習題 2、3 覆蓋）。
- 結構：每節有「今晚就能做的動作」；練習題 5 題含 `<details>`；下一步連第 2 篇；中英同步；glossary 5 條（edging、踩板、安靜腳、掛腳、勾腳）。
- 長度：中文字約 3,700。

## post-polish

- 拆開 4 個超過 60 字的長句（腳跟段、前傾區練習、Gresham drilling 段、下一步）。
- 迷思段把數字壓到一個主張最多一個（Baláš 角度範圍用文字描述，不列三個角度）。
- 研究者名當主詞只出現在引用的第一句，後續改用做法本身當主詞。
