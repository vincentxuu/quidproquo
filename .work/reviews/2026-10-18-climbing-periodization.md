# 審稿紀錄：2026-10-18-climbing-periodization（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 "not connected"；改用 Jina reader、curl＋去標籤、Keenable 搜尋、Wayback 可用性查詢。原始擷取存於 scratchpad `d45src/`。

## post-verify

🟢 Confirmed
- TrainingBeta × Bechtel 訪談節錄：periodization is simply the organization of your training；線性模式退訓（eight weeks out from strength）；攀岩是 acyclic、一條路線要多個能量系統；四口爐比喻；先評估、drift toward preference rather than greatest need。
- Lattice deload 文（2026-07）：3–4 週中週期、最後減量、2:1 或 3:1；兩個理由；減 40–60%、不是整週休息；四種減法；不要加量、不要加新動作、不要熬夜亂吃；不需要減量的四種情況（復健、維持、長期表現期、剛開始訓練的 build phase）。
- Lattice 初學者指南：每週只能去 2 次就大多拿來爬；肌力訓練塞在攀爬課最後。
- Eva López Guide III：48–72 h compulsory；MaxHangs 永遠放第一；4–8 週加組數後停 1–2 週；改到 72 h 的三種情況；檢查其他天、睡眠、飲食。López ARC 週期化：複合課順序；3×5′→4×5′→5×5′→恢復 2–3×5′；microcycle／mesocycle／macrocycle 定義。
- Climbing.com 4×4：48–72 h。Hooper's Beta：第 3 問「Do you know how to integrate more training load」、最常見錯誤是照舊爬、慢性疲勞→組織受傷（手指或肩）；every hang with ease 才加。
- Rock Prodigy 講義：Base Fitness→Strength→Power→Power Endurance→Performance→Rest 各階段內容；解決 just climbing 的停滯。APCST 簡報：12 週＋6 週表現期；問卷 n=75 紅點 +1.44 YDS（自願、無對照）；defined schedule 97%、documenting 77% 列為 significant。
- 練健康：並行／順序（block）／重點（pendulum）三模式與適用族群；periodization ≠ programming。HANCHOR：至少隔一天（一三五）、力量／技術／耐力各一天；無研究引用。Camp4：一週爬三次卡 5.10+。

🔴／🟠 修正（已改）
- Hooper 的問題初稿寫成「你會把別的訓練量拿掉嗎？」→ 原文是「你知道怎麼把新增的訓練量放進作息嗎？」，改成原意＋它點名的錯誤。
- 「攀岩領域沒有比較有減量週 vs 沒有的研究」→ 無來源支持此否定句，刪。

🟡 Unverifiable（未寫入）
- Climb Strong〈Pendulum Plans〉〈Periodized Training Works〉現為 404（Wayback 有快照未用）→ Bechtel 的主張只引 TrainingBeta 訪談原文。
- Hörst 4-3-2-1 週期 → 本 session 沒有打開原文，未寫。
- 紅石週期性訓練課內容（CAPTCHA）→ 未寫。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check-process-leak` 通過；`check-post-quality`／`check:references` 只剩 EN 版連到 `2026-10-18-climbing-strength-power-en`（兄弟篇英文版產出中）。
- 範圍卡逐項：每週 3 次的排法（三條規則＋週表）先講 ✓；中週期與減量週 ✓；線性 vs 非線性並列、模型差別放 `<details>`、標明無 RCT ✓；技術、指力、耐力排進同一週 ✓；讀完能排 4 週中週期（mermaid＋今晚動作的 4 欄表）✓。
- 證據等級：三條規則、減量、年度模式皆標「教練共識」，年度模式加註「各家不一致」✓。不給單一門檻，指力板只連回 order 2 的開始條件 ✓。
- frontmatter：series「攀岩訓練」order 5／EN「Climbing Training」✓；glossary 3 條（中週期、減量週、鐘擺模式），terms.ts 無重複 ✓。
- 結構：每個 `##` 節有今晚動作 ✓；練習題 4 題 ✓；下一步連 order 6 ✓；E 系列無連結 ✓；過度訓練指向 order 8、疼痛轉介醫師／物理治療師 ✓。

## post-polish

- register-scan：初版長句 5 句（Hooper 段、練健康三模式、Bechtel 兩句、練習題 4）→ 斷句或改條列；中週期比例段改寫成「2:1 或 3:1」減數字。剩餘數字密度命中為 López 課表條列與 48–72 h 規則段（同一個數字範圍重複出現），保留。但書 6%；模板化轉折 0。
- 英文版：一般英文術語密度命中 2 處（英文版本身，非問題）。
- 中英同步：Hooper 修正、三模式條列兩版一致。
