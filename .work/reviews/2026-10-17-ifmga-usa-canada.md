# Review: 2026-10-17-ifmga-usa-canada（zh + en）

Review date: 2026-10-17. Scope: IFMGA 高山嚮導系列 order 5，中英兩版。

## post-verify

2026-10-17 已完成事實查核（紀錄來源：session scratchpad `factcheck-4-7.md`）。

| 原句 | 問題 | 處置 | 來源 |
|---|---|---|---|
| 第 1 年上岩攀和高山訓練、考 Apprentice Rock…第 2 年考兩個見習考試 | 與先修矛盾：Guide Training Alpine／Ice 要先持 Apprentice Rock，高山訓練排不進第 1 年 | 改成第 1 年夏天岩攀＋Apprentice Rock、冬天冰攀與滑雪；第 2 年高山訓練＋兩個見習考試，仍標推測 | acmg.ca/alpine-guide-certificate；研究筆記 3258–3268 |
| AMGA 沒有「幾年內要完成」的總期限 | 研究只確認「官網查不到」，寫成定論過頭 | 改成「AMGA 官網查不到總期限」 | 研究筆記 372–373、I-A 373 |
| Eddie Schoen：美國認證自願、業界自律、國家公園許可不看認證（2023） | 研究筆記只列來源、沒有原句 | 開原頁核對（Groundlane MCP not connected → curl），原文相符，發布 2023-07-25。保留 | rebelalpine.com |
| 其餘約 55 項（AMGA 三線順序、83／86+ 天、WFR 70/45 小時、學費 40,650、$75、$140、>$50,000、1997、9 FAM B-1、191；ACMG 天數、3 年期限、CAD 46,600–48,300、3,525、2,674、100 作業日、CGL 2,000,000、IEC 12 個月、TRU PGWP、1,437／184） | — | 有研究支撐；zh／en 一致，不改 | 研究筆記 B、C、H、I-A、I-C |

修正：上述兩處（ACMG 時程推測、AMGA 期限措辭）。未解決：無。

## post-review

機械檢查：`pnpm check:references` 本篇 0 錯誤；`pnpm check:tw` 0 擋下、0 待看。

發現：
- 🔴 inline 來源：AMGA「Essential Eligibility Criteria」（英語授課要求）正文沒有連結。
- 🟡 研究過程進門面：總表「研究範圍內沒查到國家執照法規」與法律地位段「研究查過的 AMGA 頁面」把檢索歷程寫進正文。
- 結構：guide 型，兩國同一套小節；開頭先和阿爾卑斯國家執照對照，再說兩國共通點，對象覆蓋完整（AMGA 三線表、ACMG 三線與見習規定）。
- 台灣讀者位置：第三段點出語言門檻最低、卡在工作許可；外國人小節有 B-1、IEC、PGWP 等台灣人實際會遇到的身分問題與案例。

已修（zh + en）：
- EEC 加上 inline 連結（AMGA 的 Google Drive 文件），參考資料補一條。
- 總表與法律地位段改寫為「AMGA 公開頁面沒有引用國家執照法規」，意思不變、拿掉研究歷程措辭。

## post-polish

`register-scan.sh`（zh）：長句 0；但書 6%；引述 0；姓名當主詞 1（Eddie Schoen，引述其公開說法，保留）；模板化轉折 0；一般英文術語 0；`scan-ledger.sh` 無命中。數字密度 6 段 ≥4 個數字，在門檻與費用前提清單，屬誤殺邊界，不搬。

人工回讀：結語有可執行順序（先排簽證怎麼接，再排課表）。無須改寫。

已補（2026-10-17，協調者）：加拿大「至少 200 萬的商業責任險」原本沒寫幣別。回 ACMG 外國 IFMGA 嚮導頁（https://acmg.ca/ifmga-mobility/）原文：「not less than US$/€/￡2,000,000 inclusive per occurrence」，條件是參加 ACMG 省立公園許可方案；中英文改寫並改連這頁。
