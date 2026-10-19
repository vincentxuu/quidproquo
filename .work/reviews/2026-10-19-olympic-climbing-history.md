# 審稿紀錄：2026-10-19-olympic-climbing-history（中英共用）

日期：2026-10-19。審稿：K-rev-b（獨立審稿，非作者）。工具：World Climbing Competition Rules v3、Event Regulations v3（2026-01）、Speed Licence Rules、Para 規程與分級規則等 PDF 以 curl＋pdftotext 全文比對；新聞頁、Wikipedia、ifsc.results.info API、台灣政府／協會頁以 curl 抓全文。

toolDegradation：Groundlane MCP 回「not connected」，Groundlane 直接 HTTP 回 401；jina／firecrawl MCP 也是 not connected。改用 curl 直抓原始頁（主力）＋ Keenable keyless 搜尋（補原岩頁 403 與新聞搜尋）。Wayback availability API 回 429。

## post-verify

| Verdict | 數量 |
|---|---|
| 🟢 Confirmed | 34 |
| 🔵 Misframed | 1 |
| 🟡 Unverifiable | 1 |
| 🟠 Outdated | 0 |
| 🔴 Contradicted | 0 |

🟢 Confirmed
- 東京：World Climbing 東京頁（2021-08-03～06、男女各 20 人、青海都市運動公園、Combined）；olympics.com（Wayback）1×2×3＝6 例；《衛報》Ginés López 1×7×4＝28、Schubert 最後上場且唯一完攀先鋒；Wikipedia 男子全能決賽 Coleman 6/1/5＝30、Schubert 7/5/1＝35；World Climbing 女子賽報 Garnbret 5、野中 45、野口 64、Mirosław 6.84 世界紀錄；Climbing.com：Mirosław 抱石、先鋒都墊底未上頒獎台，作者認為這比數學更是真正的問題。
- 巴黎：World Climbing 巴黎頁（2→4 項、40→68 人）；官方成績手冊（Wayback PDF）：速度獨立、Boulder & Lead 兩階段新計分、Top 25／HZ 10／LZ 5、每次失敗 −0.1、先鋒最高 40 點 4/3/2/1、準決賽分數不帶入決賽；四項頒獎台逐一相符；男子決賽 Roberts 63.1＋92.1＝155.2（olympics.com 賽報同）。
- 2025 首爾世錦賽三項分開；2026 賽事規程附件只有 A–D（先鋒、速度、抱石、團體速度）。
- 洛杉磯：LA28 新聞稿拆開抱石與先鋒；World Climbing 引 IOC 執委會：6 項、76 人（男女各 38）；洛杉磯頁：7/24–29、Long Beach Climbing Theater（Long Beach Sports Park）、前兩屆 additional sport、2022-02 納入初始項目。
- 資格制度（2026-02-02）：2027 賽事約 50% 名額、每場 1 席；OQS 抱石先鋒各至少 4、速度至少 6；抱石先鋒男女各至少 12、速度各 14；每國每性別每項 2 人；美國每性別每項 1 席＋1 個普及名額；雙項資格只算一個名額。
- 2027 賽程：伊斯坦堡歐運 6/16–27、利馬泛美運 7/24–8/8、Brno 世錦賽 8/13–22、洲際資格賽（南非、澳洲、紐西蘭、中國），上海 11/10–14。
- Q-Series（2026-07-08）：東京 5/4–7、上海 5/11–14、奧蘭多 6/8–11（2028）；由 2024 OQS 演變而來。
- 帕拉：IPC 2024-06-26 核准；資格路徑（2026-08-12）8/15–27、8 項、80 人（男女各 40）、女子 B2/RP1/AU2/AL2、男子 B1/RP1/AU2/AL2、Brno 帕拉世錦賽每項前 3、2012-01-01 前出生；帕運頁「Women's B1 final」單行矛盾確實存在；分級規則（2025-03）B1–B3、AU2、AU3、AL1、AL2、RP1–RP3 共 10 級；帕拉規程（2026-01）top-rope、Para Series 年度巡迴、bi-annual 世錦賽。
- 練習題 1–4 重算正確（題 2：10＋20＋18＝48、總分 148）。

🔵 Misframed（已改）
- 「他抱石不是最好，但先鋒爬得很高，用先鋒追回來」：方向對但不精確。成績手冊顯示 Roberts 抱石決賽第 3（63.1，安樂 69.3），先鋒 92.1 也只並列第 3（Schubert、Ondra 96.0），他是對安樂（先鋒 76.1）追分。改寫為「抱石只排第 3，落後安樂 6.2 分；先鋒 92.1 對 76.1，靠先鋒追回」。

🟡 Unverifiable（已改）
- 「到了洛杉磯，奧運的抱石和先鋒會比較接近系列賽的規則」：未找到 LA28 單項賽制（輪次、人數）的官方公告，屬推測。改為「看懂前三篇單項規則就有基礎；實際輪次與人數以官方之後公布的賽制為準」。

本次只檢查了文中已提出的約 36 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；phrase ledger 0 命中；`check:references` 本篇無 error／warning。
- 外部連結 22 條 curl 全部 200（含 Wayback 成績手冊 PDF）。
- 站內連結：第 1、2、3、5 篇（本系列）。
- tldr／description／glossary 數字與正文一致（2/4/6 金、40/68/76 人、80 人帕運）。
- 結構：回顧 → 東京 → 巴黎 → 洛杉磯與資格 → 帕拉 → 一條線總表 → 練習題，guide 型完整。mermaid 流程圖與正文一致。

## post-polish

- 長句 6 處，皆 62–66 字、分散在不同段，未達密度門檻，不拆。
- 先鋒計分段單段 10 個數字：是規則本身，保留；練習題已把計算移到 `<details>`。
- 模板化轉折 0。

## 已修正

1. Roberts 奪金說明改為精確分項比較。
2. 洛杉磯賽制推測句改為「以官方公布為準」。
3. 新增英文版 `2026-10-19-olympic-climbing-history-en.md`。
