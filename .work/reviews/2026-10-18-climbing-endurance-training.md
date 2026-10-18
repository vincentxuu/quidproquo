# 審稿紀錄：2026-10-18-climbing-endurance-training（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 "not connected"；改用 Jina reader、curl＋去標籤（Eva López blogspot）、PubMed E-utilities（摘要）、Keenable 搜尋。原始擷取存於 scratchpad `d45src/`。

## post-verify

逐條對照本 session 打開的原文。

🟢 Confirmed
- Lattice 耐力文：有氧靠量、無氧靠強度；爬到 pump 落在中間、兩邊都練不好、疲勞恢復久；5 on 3 off ×3 輕微可控 pump；1 on 1 off ×10、建 pump、休息完全恢復、不接近力竭；ARC 10–30 分、完全不 pump、最後一分鐘跟第一分鐘一樣；留言回覆：ARC RPE 2/10、1 on 1 off RPE 4/10、60→80→100 秒、先爬至少 15 分鐘、5 on 3 off RPE 2/10、陡 spray wall 可能變成練無氧；ARC 全名 Aerobic Recruitment Capilarisation。
- Lattice 能量系統文：水箱比喻（水位＝無氧容量、流入＝有氧能力）。
- UKC × Lattice Part 2：power endurance／strength endurance／aerobic power 同義；aerobic power 與 anaerobic capacity 的感覺、Capacity Power（5×2 雙趟、1′／10′、onsight 低 1–2 級）、Boulder Triples（6×3、1′／3′、flash 等級）；路線者偏 aerobic power、抱石者偏 anaerobic capacity；每週約 2 次、easy to overdo。
- Climbing.com Learn to Train pt 4：The Problem 原句；4×4 低約 3 級、4 次、2 分、5 分、3 組；48–72 h、2→3 次／週；2–3 週見效且退得一樣快；先有力量基礎、會把部分最大力量轉成耐力。
- Eva López Capacity (III)：前臂痛 1–2 級（very mild pump），超過 2 換牆或點；連續 5–45 分；偶爾停 1–2 秒、不超過 3 秒、不停休息點；不用心跳控制強度。
- Eva López ARC 週期化（2015）：8→10→12→6 分範例；複合課順序（最大力量→抱石→高強度耐力→capacity）；新手／中等程度隔天，週末戶外 2 天、否則最多 3 天；3–4 週有感、6–8 週才明顯。TrainingBeta 轉介頁：前 2–3 週加組數、第 3 或 4 週組數減半。
- Rock Prodigy 講義（2015）：Aerobic Restoration and Capillarity、2–3 組 20–45 分、at or just below MSS。
- 劉純延 2017：症狀描述（極限以下仍僵、好點與簡單區域無法恢復）；ARC 15–45 分、輕微 pump、垂直或微前傾牆、5 分爬 5 分休累積 30–45 分；展開為 Aerobic, Respiration, Capillarity；甩手用語。
- MacLeod 2007 摘要：休息期再氧合預測耐力（間歇測試）。Baláš 2022 摘要：攀岩用氣體交換閾值、心率、血乳酸控制強度並不有效。Stien 2021 摘要：LCT 前臂耐力進步、BCT 指力進步、攀爬表現兩組不變、5 週偏重一項另一項未下降。

🔴／🟠 修正（已改）
- 初稿寫「上一篇能量系統」→ 上一篇（order 3）是力量篇，改「能量系統那篇」。
- glossary「一兩分鐘撐得住」→ 來源（UKC 為 extended period；Rock Prodigy 為約 1–4 分）不支持「一兩分鐘」，改「撐上幾分鐘」。
- tldr「這些方法都沒有對照試驗直接比較效果」→ 改成「支持這些方法的主要是生理研究和教練經驗，還沒有對照試驗直接比較它們的效果」（研究檔 §5 的證據缺口）。
- 新增 Baláš 2022 內文連結，支撐 glossary「攀岩很難用心跳控制強度」。

🟡 Unverifiable（未寫入）
- Climbing.com 說力量耐力是讓前臂「浸在乳酸」裡的暴露療法 → 屬過時生理說法且本篇不需要，未用。
- Hörst 4×4 原始出處沒找到 → 只寫 Climbing.com 版本，不歸給 Hörst。
- 「ARC 原始全名」誰先提出 → 未查到，三種展開並列、不判對錯。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check-process-leak` 通過；`check-post-quality`／`check:references` 只剩 EN 版連到 `2026-10-18-climbing-strength-power-en`（order 3 英文版，由其他寫手同批產出中）。完整 `pnpm verify`／`astro check` 未跑（多 agent 同時改，交由 commit gate）。
- 範圍卡逐項：ARC、4×4、間歇（1 on 1 off、5 on 3 off）✓；各練到哪個系統（表格＋Lattice 兩分法）✓；強度怎麼抓（RPE、pump 等級、各家並列表）✓；劉純延等台灣用語（前臂僵硬／pump、甩手、耐力、力量耐力）✓；沒有 RCT（每節證據等級標示）✓；讀完能選一種並排一次課（決策圖＋課表範例）✓。不講週期化細節，指向 order 5 ✓。
- 學派矛盾並列：ARC 強度 Lattice／López／Anderson／劉純延四欄並列，不選邊 ✓。
- frontmatter：series「攀岩訓練」order 4／EN「Climbing Training」✓；tags 新增 `climbing-training`（系列專用，與其他 D 篇需一致）；glossary 3 條，terms.ts 無重複 ✓。
- 結構：每個 `##` 節有「今晚就能做的動作」✓；練習題 4 題 `<details>` ✓；下一步連 order 5 ✓；E 系列只寫「傷害預防系列（撰寫中）」無連結 ✓；B 系列連〈休息、讀線〉✓。
- inline link：每個來源第一次出現都有連結；中文來源英文版標 (in Chinese) ✓。

## post-polish

- register-scan：初版長句 4 句（MacLeod 段、今晚動作、ARC 全名、Baláš 段）→ 斷句；4×4 頻率段 6 個數字 → 拆成條列。剩下的數字密度命中都是課表條列與練習題答案（協定本身就是數字），保留。但書 3%；引述區塊 0；模板化轉折 0。
- 人讀：研究者當主詞只出現在引用研究結果的段落；每段一個主張。
- 中英同步：修正後句子兩版一致（含 4×4 頻率條列）。
