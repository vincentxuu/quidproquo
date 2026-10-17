# 審稿紀錄：2026-10-17-judging-bolts（中英共用）

日期：2026-10-17。工具：Groundlane MCP 未連線（toolDegradation）；Keenable keyless 搜尋、Jina reader（中途 429，重試成功）、curl（UIAA PDF、Google Sheets CSV／htmlview）、pdftotext／pdftoppm（UIAA 圖解轉 PNG 目視）。原始擷取存於 scratchpad `agent-bolts/dl/`。

## post-verify

逐條對照本 session 打開的原文：UIAA 123 V5.1 全文、UIAA 123 圖解（PNG 目視：徑向 25 kN、EN 15／UIAA 20 kN 軸向）、UIAA Watch Your Anchor 2024、UIAA Rock Anchors 頁、TOCC〈龍洞的錨栓〉、大事紀、Rebolting Project、〈龍洞值得怎樣的未來〉（2021）、2025 工作成果報告、2026/07–08 工作報告、TOCC 路線資料庫（統計分頁 CSV、第一洞分頁 CSV＋htmlview 字色）、BMC spot-a-bad-bolt、Access Fund Can You Trust That Bolt。

🟢 Confirmed
- 強度表（EN 959 軸 15／徑 25；UIAA 123 軸 20／徑 25）；UIAA 123 以 EN 959:2018 為基礎、150 N·m 60 s、SCC/GC/LC 標示、禁止塗漆、V5.1 Effective from July 2026。
- SCC 條件（Annex A Table 4：氯化物、20°C 起、>30°C 更糟、RH 20–70%、約 30 km 無明確界線、不被雨沖）；304/316 不可混用（Annex B）；膨脹式／黏膠式定義（§3）。
- UIAA 給攀登者／打 bolt 者的建議、保留斷件與回報表單。
- 龍洞時間線：2004 316（張登榮、王宏祥）、2010 章芳源 Rebolt 計畫、2014-07-19 決議改鈦、2015-07-24 大鼓雙點斷裂（離地不遠輕傷）、Collinox 2010 前為 304、2015-09-06 首次拉測、2016 臺製鈦（X 光＋12 kN）。
- 拉測 8 kN×1 min×5 次／10 min、降伏 >8 kN、破斷估 >12 kN、鈦免測；問題錨栓多為 304、少數 316 化學膠混合不均；TOCC 無法排除 316 SCC。
- 資料庫數字（2026-10-17 統計分頁 CSV 自行重算）：總 2,149；304 = 65+17+8 = 90，第一洞 88；316 1,278；Ti 781。字色：304 #cc0000、316 #6aa84f、Ti #000000（htmlview CSS 解析）。2025 報告切除 20 支 304（#248 14、#258 6）。
- BMC：膨脹式適合中硬岩、黏膠式較優但舊 U 形弱、SCC 幾乎看不出、手掌寬、磨損 1/3、下攀撤退、bail biner、「沒人負責」。Access Fund：spinner 降低強度、現代不鏽鋼有鏽也要回報、每個攀登者有責任檢查、混金屬。

🔴／🟠 修正（已改）
- 「有些 bolt 裝上去幾個月到幾年就斷了」→ 原文是單一事件（Leonidio），改成「希臘 Leonidio 的一起事故」。
- 「TOCC 會在仍有 304 的路線第一顆 bolt 掛警告布標」→ 原文是「部分路線已掛上」，改為「第一洞部分仍有 304 的路線」。
- 路線狀態列舉刪去「路線封閉」（本次只核到第一洞分頁的值）。
- 「軸向強度提高到 20 kN（第 5.1 版 4.3.1(b)）」條款編號移除（正文不需要）。

🟡 Unverifiable（未寫入）
- 試算表最後修改時間（匿名讀取拿不到）→ 正文以「2026-10-17 的統計分頁」標示時點。
- 試算表「安全評級」欄（●●●）的意義 → 未寫。

本次只檢查了文中已提出的約 40 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:process-leak` 通過；`check:references` 本篇中英無錯（英文版連到的 sibling -en 已存在或在 allowed 範圍）；`check:links` 無壞鏈；mermaid 經 Mermaid Chart validate 為 valid flowchart。`pnpm verify` 失敗項為 check:post-quality（ai 類舊文 tag WARN，與本篇無關）、check:references（其他 sibling 尚未建立）、check:series-plan（本紀錄寫入前）。
- frontmatter：tags 4 個皆既有；description 與 tldr 不重複；tldr 有具體數字與日期；series order 3。
- 範圍卡對照：bolt 種類 ✓、UIAA 123 vs EN 959 ✓、SCC ✓、304→316→鈦 ✓、2015 大鼓 ✓、目視檢查清單 ✓、TOCC 試算表查法且不轉述成紅綠燈 ✓（明寫「顏色代表材質」）。
- 修了什麼：「所以下面兩節才是重點」指代不準（重點其實在後兩節查詢與檢查）→ 改為列出接下來的三件事。練習題第 3 題「掛上快扣當作有總比沒有好」為作者判斷，保留。

## post-polish

- register-scan：長句 0（初版 4 句，已斷）；但書 5%；引述區塊 0；模板化轉折 0；phrase-ledger 0 命中。
- 數字密度：初版 6 段 ≥4，已降：開頭改「2015 年夏天」、混用段改為不列鋼種編號、大鼓條目去掉月份與 316。剩 2 段（316 材質比較段、拉測加載條目）的數字是材質名與測試參數本身，保留。
- 每節都有「今晚就能做的動作」或可照做的步驟（分類、查資料庫、現場清單）。
