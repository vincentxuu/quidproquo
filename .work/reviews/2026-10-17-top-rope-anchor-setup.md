# 審稿紀錄：2026-10-17-top-rope-anchor-setup（中英共用）

日期：2026-10-17。工具：Groundlane MCP 未連線（toolDegradation）；Keenable keyless 搜尋、Jina reader（429 後重試成功）、curl（Google Sheets CSV）。原始擷取存於 scratchpad `agent-bolts/dl/`。

## post-verify

對照本 session 打開的原文：REI How to Set and Clean a Top-Rope Anchor、AAC Know the Ropes: Cleaning Sport Routes（Auble 2021）、BD QC Lab Worn Anchors、BMC spot-a-bad-bolt、TOCC〈龍洞的上方固定點〉、TOCC 路線資料庫統計分頁、nobodyclimb sport-toprope 頁（存在，1/15 題）。

🟢 Confirmed
- REI：前提（會先鋒、先鋒確保、垂降；找有經驗者或合格教練）、25 呎 7 mm cordelette＋雙漁人結、4 個有鎖鉤環、PAS girth hitch 兩個綁繩點、quad 步驟（兩結約 8 吋、對向兩鎖扣三股留一股）、SERENE-A 與 ≤60°、至少兩個牢靠點、扣點優先序 hanger>chain>ring、PAS 不能承受墜落須拉緊、下放前流程、收繩四步、不要讓繩直接穿過 hanger/chain/ring 下放，必要時留有鎖鉤環。
- AAC：至少兩條、對向大致均分、locker draw、不扣最下環、避免鉤環壓岩角、鋼製鉤環耐磨減少髒污、下放已在許多岩場被接受甚至推薦但部分組織仍要求垂降、頂繩清線應在先鋒離地前決定、擺盪時上方繩會磨岩角或卡灌木鬆石。
- BD：兩個磨槽 cold shut 2330／2522 lbf 晚於新品 1466 lbf 變形；尖銳邊緣傷繩皮、用自己的快扣分擔。
- BMC：頂繩一律用自己的快扣或鉤環、最後一人清；磨損 >1/3 不依賴。
- TOCC：上方架繩為器材磨損率最高、務必自備器材、勿主繩直接穿過固定設備、盡可能雙繩垂降（天候、雷擊、地震、蜂螫等例外）、梅隆鎖多 304、鋁垂降環不到一年削弱、長巷佈告欄 2004–2006 年 316 羊角磨損、檢查與自我確保下的測試、近 600 條路線／多數第二輪更新／舊孔不能重用、捐款與志工。
- 資料庫統計分頁：上方架繩 42 條（2026-10-17）。

🔴／🟠 修正（已改）
- 「PAS 用雙套結」→ 原文 girth hitch，改「繫帶結（girth hitch）」。
- 「鋼製鉤環比較不會把鋁屑帶到繩上」→ 原文是減少 grime，改「減少繩子沾上的髒污」。
- 「quad 在受力方向偏移時仍能分擔」→ 本 session 未打開支持此說的來源（Petzl 頁僅在研究筆記），刪除。
- 「最適合運動路線的架法」→ 無來源，改「最簡單的架法」。
- 「BD 測過一批」→ 原文兩個樣本，改「兩個 cold shut」。
- 「快扣受力時被岩面扭轉」條目無來源，刪除。
- 「近 2000 顆錨栓」（TOCC 2020 文）與資料庫 2,149 不一致 → 改「兩千多顆」。
- 「TOCC 明文規定不可」→ 原文為「請勿」，改「明文要求不要」；英文同步。

🟡 Unverifiable（未寫入）
- 延伸固定點越過岩角的具體做法（只找到論壇討論）→ 只寫「換路線或等學會延伸再架」，細節留給 order 8。

本次只檢查了文中已提出的約 45 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:process-leak` 通過；`check:references` 本篇只剩 sibling 尚未建立的 -en 連結（building-anchors-en 等，允許）；`check:links` 無壞鏈，REI 403 為擋機器人（本 session 已用 Jina 讀全文）；mermaid validate 為 valid flowchart。
- frontmatter：tags 5 個皆既有；description／tldr 不重複；series order 4。
- 範圍卡對照：自己的快扣／鎖鉤環 ✓、不在頂端環直接頂繩 ✓、兩點獨立 ✓、不壓岩角 ✓、龍洞規範 ✓；傳攀固定點只轉手到 order 8 ✓；下放 vs 垂降只講分界、轉手 order 5 ✓。
- 「上一篇的檢查」指向 order 3 判斷 bolt，正確。

## post-polish

- register-scan：長句 0（初版 1 句已斷）；但書 3%；引述 0；模板化轉折 0；phrase-ledger 0。
- 開頭「不在危險，在『磨』」為對比骨架，改成直述壞習慣。
- 數字密度：資料庫段拆成兩段，剩一段（日期＋42）保留。
- 可執行動作：準備兩條有鎖快扣、在家練對向扣、約好分工，各節有對應動作；quad 與頂端流程為步驟清單。
