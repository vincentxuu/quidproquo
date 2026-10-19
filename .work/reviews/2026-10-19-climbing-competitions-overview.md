# 審稿紀錄：2026-10-19-climbing-competitions-overview（中英共用）

日期：2026-10-19。審稿：K-rev-a（獨立審稿，非作者）。工具：worldclimbing.com 各頁與 ifsc.results.info 用 curl 抓全文（200）去標籤閱讀；World Climbing PDF（Eligibility Code v2、Speed Licence Rules 2022）curl＋pdftotext。Groundlane 未使用（前序 agent 回報 401），降級紀錄：toolDegradation = curl 直取一手來源。

## post-verify

| Verdict | 數量 |
|---|---|
| 🟢 Confirmed | 22 |
| 🔵 Misframed | 2 |
| 🔴 Contradicted | 0 |
| 🟡 Unverifiable | 2 |

🟢 Confirmed
- 改名三步：2023-10 會員協會通過、寫入章程；2025-12-10 新識別啟用＋World Climbing Series 接替 IFSC World Cup（品牌新聞原文 "formally approved by National Federations in October 2023 … will succeed the IFSC World Cup"）；2026-07-23 臨時會員大會通過法定名稱修正（EGA 新聞，需三分之二多數）。
- 五個洲際總會：Africa／Asia／Europe／Oceania／Pan America（品牌新聞）。
- 2026 系列賽 13 站日期、城市、項目逐列對照 2026-01-09 賽程新聞，全部相符。
- 名額：每項基本 2 人、最多 6 人；額外名額依世界排名前 40；日本、法國各 20 個額外名額、抱石先鋒全滿（2025-12-16 新聞）。
- 世錦賽 2027 Brno 8/13–22、第 20 屆（故 2025 首爾為第 19 屆）、屬 LA28 資格途徑（2027 賽程新聞）。
- 帕拉攀登 LA28 帕運首登場（同上）；LA28 三項分開頒牌（World Climbing 2025-04-09 新聞 "six events for men's and women's Lead, Speed, and Boulder"）。
- Eligibility Code 表 1／表 2：2026 Open＝2009 或更早；U17＝2010–2011；U19＝2008–2009；表內另有 U21。
- 2024 規則：Senior "aged 16 or over in the year"（2024 rules 名詞定義）→ 2025 起 17 歲。
- Arco 2026 青年世錦賽只有 U17、U19 決賽（Arco 新聞）。
- Alcobendas 轉播公告：抱石先鋒準決賽／決賽 YouTube 直播、部分地區鎖區；Chinese Taipei → ELTA TV（Live or Delayed）。
- 速度牆 15.00 m、標準路線（Speed Licence Rules 1.1.1／1.2）。
- CTAA：官方成績網站 API 選手資料的 federation 欄位為 "Chinese Taipei Alpine Association"。
- 亞洲盃現名 World Climbing Asia Series：研究筆記已引 Wikipedia（single-source，二手）。

🔵 Misframed（已改）
- 「先鋒 15 公尺高的長路線」：附件 A §1.1 是「不低於 15 m」→ 改「至少 15 公尺」。
- 「2025 年以前的門檻是 16 歲」：Eligibility Code 表 1 顯示 2025 已是 17 歲（2008 或更早），16 歲是到 2024 為止。原句可讀成「2025 年也是 16」→ 改寫為「從 2025 年開始，2024 年以前是 16 歲」。

🟡 Unverifiable（已改）
- 「日本、中國在某些項目一次站滿好幾個位置」：名額新聞點名的是日本、法國，沒有中國 → 改成日本、法國。
- 「台灣通常只有一兩位選手出賽，或沒有派」：無來源 → 刪除，改寫成「只有基本名額的協會每項最多兩人」。

本次只檢查了文中已提出的約 26 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking／0 review；phrase ledger 0 命中；`check:references` 中文版無錯誤；英文版的錯誤全是系列其他篇 `-en` 檔尚未建立（由其他 agent 產出），不是本篇問題。
- 連結：協會欄位原連到單一選手的 API JSON（含生日），不適合當參考連結 → 改連官方成績網站首頁。
- 站內連結皆指向 main 上已存在的文章（攀岩入門、攀岩動作技術、攀岩訓練）或本系列 9 篇。
- 結構：地圖文該有的元件齊全（項目、主辦、金字塔、年度賽程、分組、系列導覽、轉播、練習題 4 題）。
- frontmatter：tags 3 個、series order 0、glossary 3 條；tldr 與正文數字一致（13 站、2025-12）。

## post-polish

- 開頭「四公尺高的牆」：巴黎同時有先鋒牆，數字不精確且非讀者決策所需 → 刪掉數字。
- 名額段改寫為兩句：先講規則、再講結果，去掉無來源的台灣推論。
- 其餘長句、但書密度、數字密度在綠區，未動。

## 已修正

1. 開頭刪「四公尺高」。
2. 項目表：先鋒「15 公尺」→「至少 15 公尺」。
3. 協會欄位連結改為官方成績網站首頁（不連個別選手 API）。
4. 名額段：「日本、中國」→「日本、法國」，刪無來源的台灣派員描述，補「額外名額依世界排名前 40」。
5. 成人門檻改寫為「從 2025 年開始，2024 年以前是 16 歲」。
6. 青年組補 U21（2006–2007）在規章中存在，與「青年世錦賽只辦 U17、U19」並列。
7. 新增英文版 `2026-10-19-climbing-competitions-overview-en.md`。
