# 審稿紀錄：2026-10-18-youth-growth-plate（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 `not connected`（toolDegradation）；Jina reader（BMC、PMC、UKC）、curl（BMC 家長指南 PDF、UIAA PDF、PubMed E-utilities）。原始擷取存於 scratchpad `src1011/`。

## post-verify

逐條對照本 session 打開的原文：BMC 家長指南 PDF 全文（Rivett）、BMC campus 指引、BMC u18 專文（Morrison & Schöffl）、BMC 2016 研討會摘要、UIAA 運動攀登說明 PDF、Schöffl 2025 PMC 全文、PubMed 摘要（Schöffl 2022／2024／2015、Schweizer 2019、Hochholzer 2005、Bayer 2013、Meyers 2020、Bärtschi 2023、McMullen 2021、Jaini 2026）、UKC Lattice Part 6、台灣手外科醫學會簡介。

🟢 Confirmed
- PPSI 占 45.3%（Schöffl 2025，<18 歲、單一轉診中心 2017–2020）；男孩就醫等待 26.5 vs 女孩 11.6 天（「兩倍多」）；15/62 只有壓力反應；作者預防建議四項。
- 手指約 17 歲長完（BMC）、16–17 歲（UIAA）；生物年齡 vs 實際年齡（BMC u18）；生長曲線每三個月、衣鞋變小（UIAA）；結締組織弱 2–5 倍（UIAA）。
- 典型樣貌：中指／無名指 PIP、背側腫壓痛、ROM 下降、高峰女 12–13 男 13–15（Rivett）；24 例無急性受傷（Hochholzer 2005）；200+ 例多數 13–15 歲（Schöffl 2024）；X 光看不到、MRI 確認（Rivett）；Bayer 全部手指骨髓水腫。
- Pain = STOP 與「should never be allowed to work through the pain」（Rivett）；Isa Schöffl 引言（BMC 研討會）；Radcliffe 建議 GP→MRI＋手部專科（UKC）。
- 治療與時程表：Rivett 8 週＋control MRI；Schöffl 2022 40.1±65.2 天、28/9、全部癒合；Schweizer 約 8 個月；Jaini 2 週–6 月、91%。
- campus：BMC 指引 <18 不做離腳／動態（經 UIAA 核可）；BMC u18 專文 <18 不用（可能到 20）；UIAA 8–10 年老手、16–17 歲以下不做；UIAA 成長期不增加手指訓練；BMC u18 不加負重；Bärtschi 掌側位移與避免 crimp；McMullen 63%。

🔴／🟠 修正（已改）
- 「男孩多等兩倍以上」語意會被讀成三倍 → 改「平均是女孩的兩倍多」。
- 「兩根手指在全封閉時受力最大」→ Rivett 原文是 crimping，改成「crimp 握法」。
- 「滑車痛在指根掌側」本 session 未開來源 → 刪除，只留生長板的位置線索並導向醫師。
- 「Schweizer 蘇黎世手外科醫師」職稱未確認 → 改「Balgrist 醫院」。
- 「BMC 指南的標題」→ 實為其中一節標題，已改。
- 第三個警訊改用 BMC u18 原意「痛到沒辦法 crimp」。
- tldr「需要磁振造影」→「有時要靠磁振造影確認」。
- Meyers「十年內」→ 原文 up to a decade later，改「十年後」。

🟡 Unverifiable（未寫入）
- Meyers 2020 回攀流程的具體步驟（只有摘要）；BMC 2016 研討會「Lattice 指力板青少年門檻」等二手轉述；台灣本地青少年攀岩傷害資料（未找到）。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check-process-leak` 中英皆通過；`check-post-quality` 本篇中英無錯誤；`check:references` 本篇無錯。
- frontmatter：series 名稱中英與 series.ts 一致、order 10；tags 為 climbing、climbing-injury、climbing-training、indoor-climbing；glossary 兩條（生長板、PPSI），terms.ts 無重複。
- 範圍卡對照：生長板壓力傷害 ✓、Schöffl 2025 數據 ✓、UIAA／BMC 對指力板與 campus 的立場 ✓、家長警訊 ✓；「讀完能說出立刻停爬並就醫的症狀」→ 獨立一節三條警訊 ✓。
- 醫療界線：不給治療計畫，時程表放 `<details>` 並逐列標出處、族群、終點定義；證據等級標「研究／專家意見／生物力學」✓。今晚動作皆為自我檢查或預防（量身高、比對兩手、問教練），無治療。
- 內部連結：B／D 系列（holds-grips、hangboard-training、strength-power）、E 系列兄弟篇（0、2、3、9、11）皆存在；連結文字已對齊實際標題。
- 與總覽篇（order 0）的青少年段落說法一致（Pain = STOP、MRI、手外科）。

## post-polish

- register-scan：長句初版 5 句 → 斷句後 0；正文數字密度高的段落（Schöffl 2025 段、年紀條列、X 光段、UIAA campus）已減數字，剩餘 4 個以上的都在 `<details>`（年紀條列含年份引用，保留）。
- 模板化轉折 1 處（「不是……而是」型的 Schweizer 句）→ 改寫成兩句。
- 研究者姓名當主詞：1 處（引用段，保留）。但書密度 3%。
- 中英同步：EN 版同結構、同今晚動作、同練習題。
