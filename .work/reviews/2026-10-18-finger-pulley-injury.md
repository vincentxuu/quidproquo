# 審稿紀錄：2026-10-18-finger-pulley-injury（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 not connected；PubMed E-utilities（curl efetch，33 篇摘要）、Jina reader（Hooper's Beta、The Climbing Doctor、UKC、Climbing.com、PMC 全文）、curl（UIAA PDF、台灣手外科醫學會）。原始擷取存於 scratchpad `finger-src/`。

## post-verify

逐條對照本 session 打開的原文。

🟢 Confirmed
- Larsson 2022 全文：A1–A5 五條環狀滑車；Table 1 分級（改編自 Schöffl 2003）；Schöffl 時程轉述（固定最多 2 週、6–8 週／3 個月、貼紮 3／6 個月）；貼紮減少弓弦 15–22%、其他結果證據低到非常低。
- Miro 2021 摘要：crimp 是機轉、A2–A4 最高風險、離心負荷、超音波第一線、MRI 補充。
- Schöffl 2003（604 人、20% 第一）、2015（911 件、A4 多於 A2）、2004（X 光→動態超音波→MRI）、2006 JHS（IV＝多條斷裂）、2006 MSSE（21 人、單條建議非手術、力量無差、一年內回原等級）摘要。
- El-Sheikh 2006（29 篇、弓弦測試沒有證據、建議動態超音波）；I. Schöffl 2018（大體 18 指、A2 敏感度 90%）。
- Schneeberger 2016（45 人 47 處、38/43 回原等級、平均 8.8 個月）；Scheibler 2021（12 例三條斷、急性 6 例 6 個月回原等級、延遲診斷較差，PubMed 摘要直接打開）。
- 貼紮：I. Schöffl 2007（8 人、16%、建議斷裂後用）、Warme 2000、Schweizer 2000、Salas 2023、Quarmby 2023 摘要。
- UIAA factsheet PDF：單條滑車受傷功能性貼紮或軟式護環、6–8 週不攀爬。
- Hooper A2 指南：所有等級立刻停爬、III 級肉眼看不到弓弦且可能不腫、IVa/IVb、停爬天數、完整力量時程、不建議整指固定、單獨 A2 不開刀、翻瓣 6–8 週準則、18 歲以下規則、四點預防。Hooper 貼紮文：完好滑車貼紮不會預防、變成依賴。
- TCD 2022 表格（困難攀爬週數）與「沒有臨床研究支持特定組數」；UKC/Lattice 警訊與 18 歲以下生長板；Climbing.com 3–10 天就醫。
- 台灣手外科醫學會：骨科或整形外科專科後甄審、範圍含手部運動傷害、多數不必手術。

🔴／🟠 修正（已改）
- 「Lattice 物理治療師也說要先當成生長板骨折處理」→ UKC 原文是「生長板傷害是最可能的手指傷害」，改成各自原意。
- Scheibler 原本經 Larsson 轉述寫「大多數回到原本難度」→ 打開摘要後改為急性 6 例 6 個月回原等級、延遲診斷較差，並標證據等級「病例系列」。
- 「Schöffl 父女」→ 關係未查證，改寫成 Volker 與 Isabelle Schöffl。
- glossary 的 H 貼紮貼法細節（繞在 PIP 上下）沒有來源 → 刪除，只留命名與用途。

🟡 未寫入
- 姚斯元 2017「滑車斷了就要開刀」部落格：未打開，正文只寫成常見說法，不歸屬作者。
- Climbing.com 作者與 Wave Tools 的利益關係：本次抓取未看到揭露句，正文不提，只引用 3–10 天就醫建議。
- Schöffl 2003 原始分級表全文（付費牆）：只用 Larsson 轉引，正文已標明。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:process-leak` 通過；`check-post-quality` 無問題；`check:references` 本篇中文版無錯，英文版唯一錯誤是 `return-to-climbing-en` 尚未建立（同系列 order 11，另一位寫手處理中，中文版已存在）。
- 範圍卡對照：滑車構造 ✓、Schöffl 分級＋原始出處限制 ✓、超音波診斷 ✓、保守與手術 ✓、復原時程註明出處與終點 ✓、H 貼紮大體研究證據 ✓、A4 漸增 ✓（Schöffl 2015）。讀完能說出「停爬→3–10 天內看醫師要超音波→依分級復健」三步 ✓。
- 醫療寫法：證據等級（研究／大體研究／專家意見／病例系列）有標；時程表放 `<details>` 並寫樣本與終點；無個人診斷；就醫導向骨科、手外科。
- 每節有「今晚就能做的動作」且都是預防或自我檢查；練習題 4 題，涉傷題都含就醫判斷。
- frontmatter：series「攀岩傷害預防與急救」order 2；tags climbing、climbing-injury、climbing-training；glossary 3 條（terms.ts 無滑車條目）。
- 站內連結標題已對齊 sibling 實際標題（總覽、暖身、握法、指力板、青少年、回岩館）。
- mermaid：單欄 TB、短節點、無自訂顏色；未用 mmdc 渲染。

## post-polish

- register-scan：長句初版 7 句 → 斷句後剩 2 句（61、63 字，含引號問句，保留）。但書 5%、引述區塊 0、模板化轉折 0。數字密度高的段落集中在分級說明與時程，主文每主張一個數字，其餘移到 `<details>`。
- writing-phrase-ledger：無命中。
- 中英同步：同一批修正兩版一起改。
