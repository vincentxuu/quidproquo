# 審稿紀錄：2026-10-19-climbing-competitions-beyond-world-climbing（中英共用）

日期：2026-10-19。審稿：K-rev-c（獨立審稿，非作者）。

工具與降級（toolDegradation）：Groundlane MCP 回 `MCP server "claude.ai Groundlane" is not connected`；firecrawl MCP 同樣未連線。改用 curl＋r.jina.ai 抓全部 26 個參考連結（部分遇 429 後延遲重抓），Keenable keyless API 搜尋補充來源，Exa `web_fetch_exa` 補抓 jina 抓不到的頁面（8a.nu KO Boulder、PlanetMountain Mille Melloblocco）。所有 Confirmed 都以全文比對，不靠搜尋摘要。

## post-verify

| Verdict | 數量 |
|---|---|
| 🟢 Confirmed | 30 |
| 🔵 Misframed | 3 |
| 🟡 Unverifiable | 2 |
| 🟠 Outdated | 0 |
| 🔴 Contradicted | 0 |

🟢 Confirmed（摘要）
- Rock Master：1986 Colodri 天然岩壁、1987 移到城堡下並改名、1988 攀岩體育場、40 年（官方 rock-master-tale）；「longest-running sport climbing festival」（PlanetMountain 2025）；「friendly competition … kicks off the off-season」（Lacrux）；「By the 2000s, Duel Lead and KO Boulder」（官方）。
- 2026 先鋒對決 Schenk 1:07.3、快 Ondra 1.5 秒；女子 Pilz（8a.nu 2026-10-04）。2026 KO Boulder Pilz／Ondra（8a.nu 2026-10-05、PlanetMountain、Gripped 三源）。日期 10/2–4。
- Psicobloc：2013 Park City 為美國首場（Active Explorer）；UOP 辦五年、2019 宣布當年不辦（Park Record，curl 全文）。A Coruña 9/18–20、16 人男女各 8、牆 16 m（La Opinión 全文）。
- Red Bull Creepers：2014 與 Red Bull 對話、「take it further」（B3）；西班牙 2014／2021、2025-08-16 Chattanooga、16 人、Market Street Bridge（WTVC）。
- Dual Ascent：2022 近 600 ft、6 段、8 隊、Ginés López／Potočar 51:27（Climbing.com 結果表）；2024 第三屆、混合隊、Pilz／Schubert、180 m、F6c–F8b（Climber）；Red Bull 官方頁最新為 2024-11-02。
- Melloblocco：2004 首屆（PM 2023）；2023 回 Val di Mello；2026 年 5/6–9（Calendario Valtellinese）。
- Hueco：AAC 2024-11-01 公告、主辦十多年；AAC 活動頁明寫「will no longer host the Hueco Rock Rodeo」。
- PCL：創辦人 Boscoe、Markey 都做過 IFSC World Cup 轉播（Inside Climbing）；2026-02-28 倫敦、每性別 8 人三輪（Wikipedia）；Magazine London、2,400 人、Red Bull TV、Milne／Bertone、贏 Garnbret、£10k／£5k／£2.5k（Climber）；2027 柏林 1/23、巴黎 2/13、倫敦 3/20、每站 £50k（€58k）、12 人分三組、準決賽與決賽三題兩勝（UKC）。
- 系列賽冠軍 6,000 歐元（World Climbing 2026-04-16 公告）；2026 賽程 5 月柯橋至 10 月聖地牙哥（研究筆記＋第 0 篇）。

🔵 Misframed（已改）
1. PCL 賽制寫「每組對決比三題、每題 4 分鐘」：這是 Wikipedia 引的賽前規劃。Climber 的賽後報導寫實際是第一輪比三題、準決賽與決賽只比一題。→ 改成實際賽制，Wikipedia 只留人數與輪數。
2. Melloblocco「有獎品，不是排名賽」：PlanetMountain 2025 報導列了「prize boulders」依完成題數分男女排名（Le Nevé 8 題第一）。→ 改寫成「主體是聚會，唯一的比賽成分是獎項題計數」。
3. Melloblocco「2019 年停辦」：PM 2019 原文是「after fourteen editions in Val Masino … will not take place on the granite of the Valley」，並說可能換日期或地點。→ 改成「2019 年宣布當年不在山谷裡辦」。

🟡 Unverifiable（已處理）
1. 「2025 年第 18 屆有超過 2,300 人報名」：所引 PM 2025 報導全文沒有 2,300 或第 18 屆；Lacrux 預告反而寫「eighth edition」，屆數說法互相矛盾。→ 刪除，改用 PM〈Mille Melloblocco〉（2025-04-19）「已逾 1,200 人報名（1,275）」。
2. 2026 Rock Master 結果標「官方網站歷屆名單」：官方 rock-master-tale 頁只列到 2025 得主。→ 改引 8a.nu 兩篇賽報。

另：「比賽後來回到西班牙」暗示 Psicobloc 起源於西班牙，文中與來源都沒支撐 → 改「在西班牙續辦」。練習題 2「16 名國際選手的邀請賽」：La Opinión 沒寫「邀請」→ 改成「當地報導沒有提到公開報名的管道」。AAC 參考資料標題與實際頁面標題不符（實為 An Update on the AAC's Craggin' Classic Series and Hueco Rock Rodeo）→ 改正，並補 AAC 活動頁。

本次只檢查了文中已提出的約 35 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking／0 review；phrase ledger 0 命中；`check:references` 本篇中英版 0 error 0 warning。
- 站內連結：〈義大利岩場：阿爾科〉〈Val di Mello〉〈多繩距入門〉皆已在 main（中英版都在）；第 0、8 篇為本系列。未連其他平行新系列。
- frontmatter：tags 3 個、type guide、series order 7，與正文一致。tldr 數字（1986、40 屆、£10k、6,000 歐元、2027 三站 £50k）皆與正文和來源一致。
- 結構：差異表 → 各類賽事 → 為什麼重要 → 練習題 → 下一步，guide 型完整。

## post-polish

- 長句 3 句（約 5%），但書 0%，引述 0，姓名主詞 0：皆綠。
- 數字密度：Melloblocco 段原本 13 個數字 → 拆成三段（歷史／報名與日期／形式），每段 ≤ 4。
- 其餘只做與事實修正連動的句子改寫。

## 已修正

1. PCL 賽制改為實際賽制（第一輪三題、準決賽與決賽一題），加 Climber 連結；補 Milne 外卡、女子決賽 19 秒。
2. Melloblocco 段重寫：2019 措辭、刪未查證的 2,300／第 18 屆、改用 1,200+ 報名數、補獎項題計數與 2025 女子第一。新增參考資料〈Mille Melloblocco〉。
3. Rock Master 2026 結果改引 8a.nu 兩篇，補日期 10/2–4、16 名選手、Ondra 隔天贏回 Schenk；新增參考資料 8a.nu KO Boulder 賽報。「2000 年代」改成歸屬官方網站。
4. Psicobloc「回到西班牙」→「在西班牙續辦」。
5. Hueco：補「主辦十多年」、AAC 活動頁連結；參考資料標題改正。
6. 練習題 2 答案軟化（不宣稱「邀請賽」）。練習題 3 補第 0 篇連結作為賽程出處。
7. 新增英文版 `2026-10-19-climbing-competitions-beyond-world-climbing-en.md`。
