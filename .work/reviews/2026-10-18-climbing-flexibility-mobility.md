# 審稿紀錄：2026-10-18-climbing-flexibility-mobility（中英共用）

日期：2026-10-18。工具：Groundlane MCP 未連線（`MCP server "claude.ai Groundlane" is not connected`）；PubMed E-utilities（摘要）、OpenAlex（Draper 2009 摘要）、curl 直抓 PMC 全文（Quarmby 2023、Han 2025）、Jina reader（Draga 2020 全文）、curl（Lattice workout 頁）。原始擷取存於 scratchpad `e12src/`。

## post-verify

逐條對照本 session 打開的原文。

🟢 Confirmed
- Mermier 2000（摘要）：44 人、5.6–5.13c、測髖與肩柔軟度；訓練成分 58.9%、柔軟度 1.8%、身材 0.3%。
- MacKenzie 2020（摘要）：77 人（44 男 33 女）；肩爆發力與耐力為主要決定因素；柔軟度列為重要次要因素；男性 hip、hamstrings and lower-back flexibility 相關，女性 10 項相關變數中無柔軟度。
- Draper 2021 IRCRA（摘要）：10 項、132 人、7 國；柔軟度與肌力「only partially successful」；finger hang、powerslap 最強；門檻推論為作者 suggest（正文寫成「作者的推論」）。
- Draper 2009（OpenAlex 摘要）：sit-and-reach 等既有測驗相關差；foot-loading r = 0.65 最強；lateral foot reach 0.30、adapted Grant foot raise 0.34。
- Draga 2020（PMC 全文）：60 名 7b–9a 男性；straddle stand r = −0.48、straddle sit r = −0.41；攀岩專項測驗無顯著相關；測量方式為恥骨聯合到地面／牆的最短距離（確認負號解釋）。
- Grant 1996（摘要）：30 名男性；leg span 經體重與腿長校正 139 vs 122／124 cm。
- Quarmby 2023（PMC 全文）：34 篇；伸展、暖身收操、貼紮、喝水與過度使用傷害無關；伸展證據來自 2 篇（含 1 篇前瞻）；>60 秒靜態伸展可能降低表現、不宜在訓練或比賽前建議；肌力介入預防肩肘傷。
- Lauersen 2014（摘要）：25 個 RCT、26,610 人；伸展 RR 0.963 無效；肌力訓練降到 1/3 以下。
- Han 2025（PMC 全文）：高雄醫學大學、22 名休閒攀岩者、隨機交叉、三種 10 分鐘暖身；肩屈曲、內外旋活動度皆增加，VR 最多；只測立即效果；DW 動作含肩外旋、肩胛後收。
- Lattice workout 頁：約 14 分鐘、六個動作與做法描述、horse stance 「strength at end range」、可作暖身或收操、無逐項秒數。

🔴／🟠 修正（已改）
- Han 2025 論文標題初稿寫錯（漏 "Comparing the Effectiveness of 10-Minute"）→ 改為原標題。
- Draga 負號解釋初稿為推測（「該研究的測量方式」）→ 讀全文後改成具體測法。

🟡 Unverifiable（未寫入）
- Han 2025 引言轉述的 Torres 2023（菁英攀岩者髖肩功能性柔軟度較佳、肩外旋關鍵）：PubMed 找不到原文，未寫。
- 「柔軟度訓練能預防攀岩傷害」：無直接研究，正文明講伸展與傷害無關的證據，不寫正面主張。

本次檢查了文中約 30 條宣告，未評估覆蓋是否完整（交 post-review）。

## post-review

- 機械檢查：`check:tw` 0 blocking／0 review；`check:references` 全站 0 error（本篇無警告；系列兄弟篇 warm-up、return-to-climbing、knee-heel-hook 已存在，內部連結解得開）；`check-post-quality` 4 檔無問題；`check-process-leak` 中英皆通過；外部連結 curl：PubMed 回 203（正常）、doi.org 403（Taylor & Francis 擋機器人，摘要已經 OpenAlex 讀過）。完整 `pnpm verify`／`astro check` 未跑（多 agent 同時改，交 commit gate）。
- 範圍卡對照：柔軟度與表現研究 ✓、柔軟度與受傷無關的證據 ✓、攀岩常用活動度（髖、肩）✓、讀完能做 10 分鐘活動度練習 ✓（7 個動作合計約 10 分鐘的表）。
- 證據等級：練習表明標「教練菜單與暖身研究的動作，沒有研究測過長期效果」；每動作秒數標為本文分配 ✓。
- 醫療：不做診斷；疼痛、麻木、卡住 → 骨科、復健科或物理治療師 ✓；今晚動作皆為自我檢查或預防，無治療 ✓。
- 迷思處理：「多拉筋就不會受傷」→ Quarmby＋Lauersen 修正，附來源 ✓；「柔軟度很關鍵」→ Mermier 1.8%、IRCRA 門檻 ✓。
- 台灣用語：高腳、drop knee（折膝，依 B 系列 glossary）、掛腳（heel hook，依腳法篇 glossary）；無「擰身」以外的自創詞（擰身只出現在 B 系列已發佈的篇名引用）。
- frontmatter：series 中英名稱正確、order 12；tldr 有數字（1.8%）且與 description 不重複；tags 4 個（含 climbing-injury、health）；glossary 兩條（活動度、門檻型能力），terms.ts 無重複。
- 內部連結：系列前後篇、D 系列〈拮抗肌與核心〉、〈攀岩卡關該開始訓練嗎〉、B 系列〈側身與擰身〉；連結文字已改成各篇實際標題（初稿用了自擬的「轉身與扭身」「膝與 heel hook」等，已修）。

## post-polish

- register-scan（zh）：長句 3 句、數字密度 7 段、研究者姓名當主詞 6 段 → 把 Mermier、MacKenzie、Draga、Lauersen 四處改成「2000 年一項研究（Mermier 等人）」句式，肩那段改「前面那項 2000 年的研究」；Lattice 段斷句。數字多的段落集中在研究結果，主要數字放 `<details>`；保留每主張一個數字的原則。但書 6%、模板化轉折 0、引述區塊 0、一般英文術語 0。
- writing-phrase-ledger：中英皆無命中。
- 跨節指代人工確認：「前面那項」「下面的髖部動作」「上面這組」皆指向正確位置。
- 中英同步修改（Mermier 主詞、連結標題）。
