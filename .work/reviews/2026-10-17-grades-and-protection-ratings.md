# Review: 2026-10-17-grades-and-protection-ratings（zh + en）

日期：2026-10-17。工具：Groundlane MCP 未連線 → Jina reader（429 時改 sleep 重試）→ curl 直連；BMC 評等對照 PDF 以 curl + pdftotext 讀。

## post-verify

逐條比對已下載原文（scratchpad/agent-grades/），共 31 條宣告：

- 🟢 換算表 11 列（5.6–5.14a 的 法式／UIAA／英式）逐格對 Mountain Project 國際對照表。
- 🟢 BMC：形容詞級數順序到 E11、技術級數 4a–7b、常見搭配 S 4a…E2 5c、高／低技術級數的解讀、手掌裂隙 vs 斜板例子、「rules are broken more often than obeyed」。
- 🟢 Rockfax：6b 才轉 E1、6b+ 以下 onsight／7b 以上 redpoint、UIAA 用於德國與東歐、R/X 定義、高 E 低技術＝保護差／high first gear、「sport less serious」理由。
- 🟢 Wikipedia YDS：1950 年代 Tahquitz、最難一步、最高 5.15d、Erickson 1980 G/PG/R/X 定義。Wikipedia Grade：法式 1980 年代源自 UIAA、V+≈5a 前對齊、f 前綴、Welzenbach 1923／UIAA 1967／VII 1978、YDS 與法式幾乎可對齊。
- 🟢 TOCC 資料庫：全庫只有「王者雷電 5.10? R」標 R；安全評級欄 626 條皆 ●●●（2026-10-17 匯出 CSV 計算）。
- 🟢 中文維基大砲岩：以「陽光懸岩」5.8 為基準、評等偏硬。
- 🔵→已修：原稿寫「G 和 PG 通常不寫出來」無來源，刪除；「保護差 5.9 與保護好 5.10c 都可能是 E1」為推論，改成原則句；「傳攀要邊爬邊放保護所以更難」改成 Rockfax 原本的理由。
- 🟡→已修：redpoint 定義改依 Wikipedia Redpoint 條目（已開）。
- 未寫入（無一手來源）：BMC 對照 PDF 的逐格位置（排版無法確定對應），只引用 BMC 文字版的常見搭配。

本次只檢查了文中已提出的 31 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋交 post-review）。

## post-review

- 機械檢查：`pnpm verify` 唯一紅燈是本審稿紀錄缺檔（本檔補上）；`check:references` 本篇僅 WARN（關鍵詞重疊，與範本文同）；`check:links` 9 條外部連結全通；`check-process-leak` 中英皆過；`check:tw` 0 blocking。
- frontmatter：必填齊、tags 5 個皆為既有 tag、series order 6、description 與 tldr 不重複、glossary 4 條為本篇特有詞。
- tldr 衍生一致性：MP「5.10a↔E1 5a」、BMC「E1 搭 5b」、Rockfax「6b 再 E1」三者均與正文及原文一致。
- 範圍卡對照：YDS／法式／UIAA／英式＋技術級／R、X／換算表標近似／MP vs BMC E1 衝突全部涵蓋；V 級與 YDS 基礎改連入門文，不重講。
- 結構：每節都有「今晚就能做的動作」；練習題 5 題 `<details>`；下一步連 order 7、order 12、總覽。
- 主題歸屬：入門文已講 YDS 基礎，本篇只補歷史與「最難一步」，未重述 V 級。
- 已修：無。可選：數字密度在「換算表」相關段落天然偏高（主題本身是數字），保留。

## post-polish

- register-scan：長句 6 句（< 10%），但書 13%，引述區塊 0，模板化轉折 0，phrase ledger 0 命中。
- 已修：大砲岩 75 字句拆兩句；Rockfax onsight/redpoint 75 字句改句號斷開。
- 數字密度：YDS 歷史段、BMC 搭配段 >4 個數字，屬主題詞（評等本身），依誤殺邊界保留。
- 可執行動作：每節皆有一句可照做的動作（查資料庫、存換算行、記 E1 5b 基準、先找 R/X、以 6b 為傳攀門檻）。
