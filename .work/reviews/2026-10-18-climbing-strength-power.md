# 審稿紀錄：2026-10-18-climbing-strength-power（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回「not connected」；Keenable keyless 搜尋補來源（Hörst 5×5、Lattice 引體向上、Climbing.com campus／pull-up）；curl＋本機去標籤讀網頁；pdftotext 讀臺大碩論與 UIAA PDF；PubMed efetch 讀摘要。原始擷取存於 scratchpad `d23src/`。

## post-verify

🟢 Confirmed
- MacKenzie 2020（摘要）：77 人（44 男 33 女）、低階到菁英；肩爆發力與耐力（最多引體向上、手搖功率、屈臂懸吊）為主要決定因素；指、手、手臂力量為次要。
- 臺大 2025 碩論（PDF 摘要）：25 名進階男性、平均 6.58 年；四變項中只有最大負重引體向上比值顯著（R²=.778）；建議納入女性。
- Berta 2025：307 人、最大指力解釋多數變異。Lattice 數據：6,000 多人、指力單一最佳預測、引體向上約翻倍。
- Lattice 初學者指南：引體向上與伏地挺身、動作正確安全、放在攀岩之後。
- Hörst 5×5：不到 10 下不做負重；自身體重 5 組 5–8 下、spotter；負重 5×5、≥3 分休、最後兩組接近力竭、每週 3 次 10 週、放訓練中段。
- Tom Randall（Climbing.com byline）：8–12 下停滯、寬握／offset／腳上箱、3–5 下。
- Lattice 引體向上文：733 筆、165%／135% 黃金標準、遞減效益、建議轉向指力等。
- Langer 2023、Saeterbakken 2024（低量高阻力每週 2 次吊小點或指力板；等級低者應限制指力板與 campus）、Fanchini 2013、Draper 2021、Stien 2021、Schöffl 2024、McMullen 2021（63%）摘要一致。
- Gresham（Climbing.com，2022-02-21，byline 確認）：離腳需抱石＋指力板 ≥2 年、約 V6/7；<17 不離腳；先做、精神好；≥2.5 分休；不 full crimp；初次每週一次；half crimp／chisel。
- BMC campus 指引（UIAA 核可）：<18 不離腳不動態、成人限有經驗者、排在開頭。BMC U18 專文（Morrison、Schöffl）：答案「no」、Güllich 與 Kurt Albert 1980 年代後期於紐倫堡 Campus 岩館發明、Action Directe 9a、31 歲、Schöffl 18–20 歲引言、訓練中受傷多於攀爬。
- UIAA 醫學說明書：veteran climbers 約 8–10 年、16–17 歲以下不做、要 fresh。
- tmingcheng 2008：campus 定義、Hörst 規格。kateberry 2026：0 下用彈力帶、先引體再吊板。Bechtel：「not an endurance activity」、計畫占 25% 訓練時間。

🔴／🟠 修正（已改）
- 「tmingcheng 是台灣最早說明 campus 的中文文章之一」無法查證 → 改成「2008 年就介紹過」。
- 「引體向上是半專項動作的典型」不在 Langer 摘要 → 刪。
- 「爬一年的人大多離 165% 很遠」無來源 → 刪，改寫成「上限不是目標」。
- 「唯一的 campus 介入研究」無法確認 → 改「介入研究很少，Stien 2021 是其中一篇」。
- 檢查清單初版第 3 項「能穩定做負重引體向上」不是任何來源的門檻 → 刪，剩 3 項皆有出處。
- 「Gresham 和 BMC 都要求 half crimp」→ BMC 沒寫握法，改成 Gresham 另外提醒。
- Saeterbakken「每週 2 次」原寫成泛指力量訓練 → 改成原意（指力訓練，吊小點或指力板）。
- 「Lattice 數據」不是同儕審查研究 → 從「這幾篇都是研究」中排除。
- 動態今晚動作原寫「很多時候是時機問題」無來源 → 改「先檢查出手時機」。
- 「岩館校隊」非台灣慣用 → 「岩館的青少年隊」。

🟡 Unverifiable／未寫入
- campus 發明年代：BMC 寫 1980 年代後期，Gresham 寫 1990 年代初 → 只採 BMC 並歸屬。
- Climb Strong（Bechtel）原頁 404、Lattice 青少年政策（UKC Part 5 被 Cloudflare 擋）：未寫入。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:references` 全站 0 error；`check:process-leak` 通過；`check-post-quality.mjs` 無問題。`pnpm verify`／`astro check` 未跑（交由 commit gate）。
- 範圍卡（order 3）：引體向上與負重引體向上 ✓；肩的角色（MacKenzie、臺大碩論，並列指力派）✓；campus 前置條件與風險（Gresham、BMC、UIAA、Saeterbakken 並列，不選單一門檻）✓；青少年不做 campus 共識＋McMullen 實務落差 ✓；讀完能說出 campus 前要達到什麼（三項清單）✓。
- 每個建議標證據等級 ✓；學派矛盾並列（指力 vs 肩；引體向上放訓練前段 vs 後段）✓。
- 每節結尾的今晚動作：初稿爆發力、campus 是什麼、青少年三節缺 → 補上。
- 連到 B 系列（動態、牆面角度、手點與握法經上一篇）與 D 系列 sibling；E 系列只寫「撰寫中」不連結 ✓。
- glossary：campus board（移除「校園板」別名，依台灣用語規則）、RFD ✓。
- 🟡 tags 同上一篇：`climbing-training` vs order 0、1 的 `training` 交主線程統一。

## post-polish

- register-scan：長句初版 2 句（Lattice 初學者指南段、Langer 段）→ 斷句，現為 0。但書 4%；模板化轉折 0。數字密度：Hörst 段拆成兩句並把「每週 3 次 10 週」獨立一句；165% 換算移入 `<details>`；剩餘 ≥4 數字的段落為處方與練習題，保留。
- 研究者姓名當主詞 2 處（Fanchini、Lattice），屬引用研究的自然寫法，保留。
- 中英同步補上三個今晚動作。
