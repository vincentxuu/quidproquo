# Review: 2026-10-17-ifmga-hire-a-guide（zh + en）

Review date: 2026-10-17. Scope: 中英兩版，系列 order 1。

## post-verify

2026-10-17 已完成事實查證（紀錄：fact-check log「IFMGA 系列 order 0–3」）。中英數字以腳本比對一致。Groundlane MCP 未連線，改用 curl、archive.org、pdftotext。

- 查過的主張：所有價格表列（霞慕尼、庫馬約爾、采爾馬特、奧地利、美國、加拿大、日本、紐西蘭）、不含費用清單、人數比、小費表、義大利 L. 6/1989、瑞士罰則、JMGA 37 人。
- 修正：tldr「日本國際山岳嚮導一天 ¥40,000 起」只有一位嚮導的資料，過度概括 → 改成「日本一位國際山岳嚮導（鳴海玄希）的私人一天 ¥40,000 起」，en 同步。
- 不改但補查：ZERMATTERS 馬特洪峰 CHF 1,550（2025、2026 季）與預備路線 CHF 360–785，用 archive 2026-04-12 頁（`minPrice:1550`）與 2024 Preisvarianten PDF 確認；Compagnie 冰攀 2027 價 €455／€495 開頁面確認。
- 未解決：無。

## post-review

機械檢查：`check:references` 本文 0 錯；`check:tw` 0 擋下；`check-series-plan` 通過；`check-post-quality` 只剩 `mountaineering` tag 警告（見下）。

發現：
- 🔴 inline 來源：「報價通常不含的錢」清單裡 ZERMATTERS、Courmayeur、Yamnuska 的數字，以及かながわ協會、Simmons Mountain Works、Mountain Trip 的引述，在原句沒有連結，要回上方表格對照。
- 🟡 研究過程進門面：「研究時這個系統要登入」「研究時查詢結果是空的」。
- 🟡 「推測對讀者的實際意義是」語氣像筆記。
- 結構符合 guide（情境 → 確認身分 → 行情 → 不含費用 → 人數比 → 小費 → 下一步）；台灣讀者位置有：開頭點明出國請嚮導、台幣換算、台灣健保不在 EHIC 體系。

已修（中英同步）：上述六處在原句補 inline 連結；「研究時」改「撰寫本文時」（en：at the time of writing）；推測句改成「換到讀者這邊（這是依條文推論）」（en：our inference from the law text）。

Tag 決定：保留 `mountaineering`。中文版沒有英文字 mountaineering，所以 post-quality 警告；但本篇的雇用情境是馬特洪峰、白朗峰、大格洛克納等高山攀登，主題就是 mountaineering，英文版內文也有這個詞，且和系列 overview、training、asia、south-america 等篇一致。tags 共 5 個，在 3–7 之內。

未修（可選）：瑞士、日本小費列是旅遊業者／觀光局說法，正文已標明，維持。

## post-polish

register-scan（修前）：長句 1（開頭 78 字）、但書 2%、引述 0、數字密度 2 段 ≥4（台幣換算段、預備路線項）、姓名主詞 0、模板化轉折 0、英文術語 0。phrase ledger：0 命中。

已修：開頭長句拆成一句陳述加四個問句；修後長句 0。

保留的筆記：數字密集的兩段是價格本身，讀者要拿來做決定，不下放；`mountain guide` 引號內是讀者會看到的原字，保留。
