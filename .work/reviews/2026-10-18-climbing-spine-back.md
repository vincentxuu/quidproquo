# 審稿紀錄：2026-10-18-climbing-spine-back（中英共用）

日期：2026-10-18。工具：Groundlane MCP 與 firecrawl MCP 皆回 not connected；Jina 對 climbing.com 回 403（AbuseAlleviationError），改用 curl 直抓 HTML 抽段落；PubMed E-utilities、Europe PMC fullTextXML、Jina（DAV、WMS、The Climbing Doctor、NHS）。原始擷取存於 scratchpad `e89/`。

## post-verify

🟢 Confirmed
- DAV Kletterhallen-Unfallstatistik 2025（網頁）：收案條件（救護車或中度以上）、約 250 館＋2024 起含 VKAÖ；252 件（抱石 174、Klettern 68、其他 10）；繩攀嚴重 15 件中 9 件為 Bodensturz 脊椎傷；31 件繩攀 Bodensturz 中 15 件在 Ablassen、其中 12 件繩子失控滑過確保器；無自由墜落潛力情境比例「bedenklich hoch」；先鋒多為嘗試掛快扣時墜落、定線建議地面附近相對簡單與好掛位置；自動確保器 5 件全為沒扣上、1 死 4 重傷（4.5–10 m）；抱石 1 件屁股著地脊椎骨折；綁繩結未完成、互檢漏看的案例；結論：互檢／自我檢查不確實、確保器操作錯誤。
- Lin 2026（全文）：Vertebra 1,030 = 骨折 8.1%；>20 ft 骨折風險高 52%。
- WMS 2024 摘要（Jina）＋ PubMed 38379496 摘要：目標導向 SCP、SMR 非固定、硬式頸圈／背板非有效安全手段、清醒者鼓勵不做會痛動作、軟性墊護即可。
- Carraro 2023（全文）：13–19 歲競技者 74.4% 過去 12 個月下背不適、多數 Grade I、結論不影響訓練。
- Schöffl 2025（全文）：直接回應 Carraro 74.4% 未見於其他研究、只問下背痛。
- Grønhaug 2018（全文表格）：Lower back 11（2.9%）、Neck 2（0.5%），分母為 385 位受傷者。
- Identeg 2023（全文）：15 vs 15、視覺分級無差異、無 spondylolisthesis。Hedelin 2026（全文）：定量 MRI 攀岩者 T12–L2 訊號較低、「early signs of disc degeneration」、MRI 留給有症狀者。
- NHS back pain（網頁）：999／urgent／GP 三層清單逐條對照。
- Climbing.com Cupido 2021：「not an official orthopedic diagnosis」、換姿勢可能最重要、換站位改變角度、確保間休息、收下巴 3 秒、確保眼鏡多數人很快習慣、已有慢性痛問醫師。
- Climbing.com Luu 2022：15° → IVD 壓力近 25%（Source 7 = Twente spine model）、25° 一半力量致傷（Source 8 = 高 G 飛行員頸部）；2–3/10 規則、>3/10 休息或今日停止。
- Förster 2009（摘要）：80 位無症狀男性、34 位休閒組為對照、站立 kyphosis SC>RC 顯著、lordosis 未達顯著、屈伸無差異、top-level > moderate。
- The Climbing Doctor hunchback（2019）：「High grade climbers usually suffer from back pain pathology」、kyphosis 造成頭痛／手麻／肩問題。Climbing.com 2022 攀岩背：「not inherently harmful」。

🔴／🟠 修正（已改）
- 初版寫「先鋒摔到地面多在第 5–7 支」並在 details 寫「先鋒 11 件、8 件」→ DAV 頁面該段標題 n=4、內文 8/11，口徑不明，刪除數字只留「多數在掛快扣時」。
- 「DAV 特別點出這些（下放）情境…比例高」→ 原文 44% 是所有無自由墜落潛力情境合計，改寫成「下放這類情境」。
- Luu 的數字「引用頭部重量研究」→ 對照文末 Source 7、8，改為「脊椎力學模型和高 G 力飛行員頸部」。
- Cupido「急性難忍的痛就停」原文是在講網球按摩時的痛，刪除，只留「慢性痛問醫師」。
- Lin「一成以下」→ 改為原數 8%。參考資料中 Lin、Schöffl 2025 標題補成全名。

🟡 Unverifiable（未寫入）
- Kiełt 2014 波蘭研究（只有 Climbing.com 轉述）→ 正文不引用。
- 確保者頸的流行病學與確保眼鏡效果：無研究，正文寫成限制一句。
- 攀岩專屬背痛紅旗：無來源，改用 NHS 一般分級並明寫。

## post-review

- 機械檢查：`check:tw` 0 blocking（1 review：「頭部重量」為解剖語境，保留）；`check:references` 中文版無錯，英文版連到 `2026-10-18-crag-first-aid-en`（sibling，order 13 英文版尚未建立；中文版已存在），sibling 建立後消失；`check-process-leak` 通過；`check-post-quality` 僅同一條 sibling 連結；`check-external-links`：WMS 摘要頁對 curl 無 cookie 時 302 迴圈後 404，Jina 可讀，瀏覽器應可開；另補 PubMed 指引原文作為穩定來源。
- 範圍卡（order 9）：DAV 嚴重事故 ✓、下背痛研究 ✓、確保者頸無研究（明講）✓、Förster 原文 vs 二手說法 ✓。讀完能說出確保時降低頸部負擔做法：「確保者頸」節清單＋今晚動作＋練習題 4 ✓。
- 醫療規則：分級與數字皆附來源與族群（DAV 德奧岩館救護車案例、NEISS 急診、青少年競技、國家隊 MRI）；摔落處置只寫 WMS 原則並導向 order 13 與 C 系列〈自我救援基礎〉；今晚動作皆為預防或自我檢查 ✓。
- 迷思：確保者頸、攀岩駝背、「七成五青少年下背痛」各有說法＋修正＋來源 ✓。
- frontmatter：series order 9 ✓、tags climbing／climbing-injury／belay／indoor-climbing ✓、glossary 3 條 ✓。
- 連結：上攀確保、先鋒、自我救援、拮抗肌與核心、總覽、急救、青少年皆 inline ✓。

## post-polish

- register-scan：長句初版 6 句 → WMS 段拆成三句、Lin 段拆兩句、Climbing Doctor 段拆兩句；剩 DAV 開頭與今晚動作各 1 句約 60 字，可讀，保留。數字密度：Carraro、MRI 段刪樣本數，Lin 段刪年份範圍；其餘 4 個以上數字段在 `<details>` 或停止規則（2–3/10 為規則本身）。但書 14%、模板化轉折 0、引述區塊 0。
- writing-phrase-ledger：無命中。
- 英文版同步上述修正。
