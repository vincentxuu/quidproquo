# 審稿紀錄：2026-10-18-resting-route-reading（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 "not connected"；firecrawl MCP 回 "not connected"；改用 Keenable keyless 搜尋、Jina reader、curl＋去標籤、PubMed E-utilities、Wayback Machine（Hörst 原站被 Cloudflare 擋）。原始擷取存於 scratchpad `src67/`。

## post-verify

逐條對照本 session 打開的原文：PubMed 20561271（Sanchez 2012）摘要、PMC5404847（Seifert 2017）、PMC10911288（2024）、PMC8657215、PubMed 38166602、PMC13236747（2025）、BMC route reading／indoor basics、Climbing.com 兩篇休息文（MacDonald；The Editors）、Hörst G-Tox 部落格（Wayback 20101204 存檔全文）、Power Company Climbing（Kris Hampton）、Gripped spray wall／禮儀、Movement 禮儀、Randall 起攀四練習、攀岩小妞技巧文。

🟢 Confirmed
- Sanchez 2012：3 分鐘看線不影響完攀，停頓較少較短；調整基線後只在專家成立（附錄）。Seifert 2017：掃視次數多→摸索與換點時間少；分區塊／之字形與停頓久相關（附錄）。2024：盯過的點使用次數兩倍。Medernach 2023：記憶與想像動作相關。
- BMC：清單五項（種類、方向、身體位置、休息、crux）、選手比動作；挑戰：拿掉點、只用某類點。
- MacDonald：stemming、腳跟踩、前臂靠平台、drop knee、knee bar 需腹肌、heel hook 為前傾最常見休息、核心型休息很快不划算；直臂、張手非 crimp、piano、重心在腳、兩手輪流甩、看遠方慢呼吸、休息時想像下一段；提到 G-Tox 與 Luke Roberts。
- Editors：隱藏休息點、好／普通（2–10 min）／差（30 s–2 min）／幾乎沒有（2–30 s）、從直臂甩、不要猛甩、前傾換手換腳、重心在掛手下方、岩館短而連續時衝頂更有效率。
- Hörst 2006：每 5–10 秒輪流、肩膀會累所以不一直舉、Roberts 研究 p<0.05、平均血乳酸約 4 mmol/L 時效果在高乳酸下不確定。
- PMC13236747：直臂（DOWN）手指屈肌活化較高；只測 ±5°。
- Hampton：四變數定義、size 不是正確說法、orientation 最重要最常被忽略、改變數並記錄。Gripped：定線增進動作理解、多樣點、比 Moon/Tension/Kilter 更密；禮儀（輪流含 LED 板、看清整題是否交會）。Movement：室內不要用粉筆畫記號、鬆點告訴工作人員。攀岩小妞：match＝換手、列為基本功；甩手、休息點用語。

🔴／🟠 修正（已改）
- Seifert「從下往上掃得越多遍」→ 研究計的是掃視次數，不限方向，改成「來回掃視整條路線越多次」。
- G-Tox「血乳酸只到中等程度」為作者評語 → 改成 Hörst 原意「乳酸濃度不高、高 pump 下效果不確定」。
- Randall 練習的「極限低兩級」是條件句 → 本篇刪除，只連到第 6 篇。
- glossary 別名「爆手」「自由牆」查無台灣用例 → 刪除，Pump 改用攀岩小妞的「幫浦感」。

🟡 Unverifiable（未寫入）
- G-Tox 的同行審查版本：未找到，正文寫「結果只公布在這篇部落格上」。
- 「< 20% MVC 休息握力」：無一手來源，不寫。
- 台灣岩館 spray wall 館規：無公開來源，正文只寫「先問櫃檯」。
- 「定線」一詞的台灣用例未查到；沿用系列已確認的篇名，第一次出現附 routesetting。

本次只檢查文中約 45 條宣告。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:references` 本篇無警告；`check:process-leak` 通過；`check-post-quality` 無問題。`pnpm verify`／`astro check` 未跑（交 commit gate）。
- frontmatter：series order 7 ✓；tags [climbing, sport-climbing, indoor-climbing, bouldering] ✓；glossary：Pump、G-Tox、膝頂、Spray wall、Crux。
- 範圍卡逐項：繩攀讀線（看線不提高完攀）✓、手勢預演 ✓、休息點辨識 ✓、甩手＋G-Tox 但書 ✓、換手 ✓、膝頂 ✓、自己定線／spray wall 方法與禮儀 ✓。讀完能在起攀前標出休息點和 crux：今晚動作（照片標 R／C）✓。
- 迷思處理：「讀線就能完攀」寫出原說法、修正與來源 ✓；「直臂＝休息」修正並連重心篇 ✓；「一定要甩手」對照岩館衝頂 ✓。
- 結構對照範本 ✓；數字細節收附錄 ✓；內部連結（第 2、3、6、8 篇、上攀確保、先鋒、戶外先鋒）全部存在 ✓。

## post-polish

- register-scan：長句 0、但書段落 9%、數字密度 0 段、引述區塊 0、模板化轉折 0；研究者姓名當主詞 1 處（Kris Hampton 的四變數，屬引述其方法，保留）。
- writing-phrase-ledger：無命中。
- 人讀：每節有今晚動作；「停多久」表格每列一個數字範圍。中英同步。
