# Review: 2026-10-17-ifmga-france-switzerland（zh + en）

Review date: 2026-10-17. Scope: IFMGA 高山嚮導系列 order 3，中英兩版。

## post-verify

2026-10-17 已完成事實查核（紀錄來源：session scratchpad `factcheck-0-3.md`）。order 0–3 共約 150 條主張逐條對照研究筆記（含附錄 I 覆寫）；zh/en 數字用腳本比對，沒有事實不一致。工具：Groundlane MCP 回「not connected」→ 改用 curl、archive.org、pdftotext。

| 原句 | 問題 | 處置 | 來源 |
|---|---|---|---|
| SNGM 現役會員 1,305（2024-10，含 aspirant） | 速覽表寫 1,505 | 不改。1,505 是全部會員、1,305 是現役 | SNGM 2025 新聞資料夾 |
| 約 €11,000 是 guichet-qualifications 2022 年的估計 | 早先標成摘要層級／404 | 不改。附錄 I 用 archive 存檔確認 | archive.org 2022-07-01 |
| 其餘（55 條路線、ENSM 規定與費用 €17,694.50、L.212-8、SBV 等同規定、RiskG／RiskV、BASPO 1,251 等） | — | 有研究筆記出處支撐，不改 | 研究筆記 |

修正：本篇無事實修正。未解決：無。

## post-review

機械檢查：`pnpm check:references` 本篇 0 錯誤 0 警告；`pnpm check:tw` 0 擋下、0 待看。

發現：
- 🟡 tag `mountaineering`：post-quality 警告中文正文沒有對應詞；本篇是國家制度比較，和同系列其他國家篇（order 4–7）一致的做法是不放此 tag。
- 🔴 inline 來源：probatoire「2025 年夏季通過率 26%」沒有就地連結（出處是 ENSM 培訓主頁的 Indicateurs 表）。
- 結構：guide 型，兩國各分訓練流程／門檻／費用／語言／法律／外國人／人數，總表在前、台灣讀者段在後，對象覆蓋完整；tldr 數字與正文一致（€17,694.50、CHF 31,230、至少 4 年／約 3 年）。
- 台灣讀者位置：第二段即交代台灣人的門檻（語言、學費、見習期合法工作），結尾轉手 taiwan-path。
- 主題歸屬：IFMGA 共通架構轉手 training-and-exams，沒有重講。

已修（zh + en）：
- 移除 `mountaineering` tag（剩 5 個：climbing, ifmga, mountain-guide, france, switzerland）。
- 「ENSM 公布的數字」加上 ENSM 培訓頁 inline 連結。

## post-polish

`register-scan.sh`（zh）：長句 2 句（<10%，綠）；但書 5%；引述 0；模板化轉折 0；一般英文術語 0；`scan-ledger.sh` 無命中。數字密度有 8 段 ≥4 個數字，集中在入學門檻、費用、法律罰則與人數清單——這些是讀者用來做決定的規格清單，屬誤殺邊界，不搬。

人工回讀：開頭、結論語氣一致；「對台灣讀者的意義」有可執行順序（先解決居留和語言，再談技術）。無須改寫。

選擇性筆記（未改）：瑞士「訓練流程」第 2 點 68 字，可拆成模組清單與「通過後拿 Aspirant 證」兩句。
