# 審稿紀錄：2026-10-18-climbing-movement-overview（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回報 not connected；改用 Jina reader（中途 429，退避重試後可用）、curl（BMC PDF＋pdftotext）。原始擷取存於 scratchpad `b01src/`。

## post-verify

逐條對照本 session 打開的原文（Baláš 2014 PMC 全文、BMC FUNdamentals PDF、DAV 兩篇、Philly Rock Gym、Lattice 4 concepts、iclimb 黃國維 2007、方格子術語表）。

🟢 Confirmed
- Baláš 2014：5 新手＋6 中級女性、85°/90°/98°；新手腳點負荷顯著較低、VO2 與心率較高；所有角度皆然（摘要）。
- BMC：新手太依賴手臂、手在視線內有安全感、用腿部大肌群；腳間重心轉移是 "one of climbing's most fundamental skills"；F1 slab／F2 垂直、穩定支撐、反向施力、陡岩、直臂／F3 較差的點、更陡、動態、roofs/volumes/heels and toes。
- DAV Grundlagen：三階段、只用未承重腳踩、力量來自腿與髖、Drüber und Rauf 一個連續動作、穩定期手臂放鬆伸長；技術在無壓力條件、未疲勞、一次一個元素、錄影回饋；三個典型錯誤（不移髖、太早彎手、雨刷式找點）。
- DAV Basics：口訣 Fuß setzen–KSP drüber–rauf drücken–weitergreifen；腿比手臂與手指強且耐久、"bis in die höchsten Schwierigkeitsgrade"。
- PRG：安靜腳、低 1–2 級、眼睛跟著腳到承重。
- Lattice：換腳至少五種、"direction of pull"、概念優先。
- iclimb：2007 第 17 期、五條原則原文標題。
- 方格子：術語多從國外傳入、大家講原文；beta 是少數常聽到的（其他在台灣岩館不常聽到）。

🔴／🟠 修正（已改）
- 「多數爬一年以內的人卡的是第一種」→ 無來源，刪除。
- 練習題 2 原寫「協會順序把力量和體能放在動作之後」→ BMC 的 LTPD 是談青少年發展，不能套到成人讀者；改成引導做安靜腳測試、指力訓練不在系列範圍。
- 「最常見的顛倒是先伸手」→ 無來源；改成 DAV 列的三個典型錯誤。

🟡 Unverifiable（未寫入）
- 研究筆記中的 Climbing Bible ch.1 目錄、台灣協會 C 級講習無動作課（本 session 未打開），不寫。
- 自我診斷表與「力量 vs 動作」症狀是教學性的分辨建議，不宣稱為研究結論。

本次只檢查了文中已提出的約 25 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；`register-scan` 長句 0、但書段落 8%；`check-process-leak` 通過；`check-post-quality` 無警告。`check:references` 剩下的錯誤只有尚未寫完的 sibling（第 3、7、9 篇的中／英版），等其他篇建立後消失。完整 `pnpm verify`／`astro check` 未跑（多 agent 同時改，交由 commit 時的 gate）。
- 範圍卡對照：動作 vs 力量的分辨 ✅、系列地圖 0–9 全連結 ✅、官方教學進程（看腳→重心→推腳→側身→動態，mermaid）✅、怎麼用系列 ✅；沒有教任何單一技巧細節 ✅；讀完能用自我診斷表說出先補哪一篇 ✅。
- 結構：每節有「今晚就能做的動作」；練習題 4 題含 `<details>`；下一步、參考資料齊全；術語段說明「本文譯名」規則。
- frontmatter：series 名稱與 series.ts 一致（攀岩動作技術／Climbing Movement）、order 0；glossary 3 條（slab、前傾、beta；全站 terms.ts 的 Beta 是投資詞，本篇用 frontmatter 覆蓋當篇語境）。
- 長度：中文字約 2,700（不含英文與數字），略低於 3,000 下限；總覽刻意不展開技巧，保留。

## post-polish

- 拆開 4 個超過 60 字的長句（BMC 段、力量問題條目、今晚動作、黃國維段）。
- 無引述區塊、無研究者姓名當段落主詞堆疊；Baláš 段一個主張只留一個數字（樣本 11 人）。
- 「本文譯名」規則寫在術語段一次，不逐句加歸因。
