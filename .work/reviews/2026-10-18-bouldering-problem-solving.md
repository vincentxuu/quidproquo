# 審稿紀錄：2026-10-18-bouldering-problem-solving（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 "not connected"；firecrawl MCP 回 "not connected"；改用 Keenable keyless 搜尋、Jina reader、curl＋去標籤、PubMed E-utilities、pdftotext。原始擷取存於 scratchpad `src67/`。

## post-verify

逐條對照本 session 打開的原文：DAV Indoor-Bouldern Basics PDF（pdftotext 全文）、World Climbing Competition Rules 2026-01 v3（PDF 全文 §7.5、§8 boulder、註 21–22）、BMC route reading／the basics climbing indoors、REI bouldering、Tom Randall 起攀四練習（Climbing.com）、Lattice 專案策略頁、Cameron Hörst 兩篇（projecting mistakes、how to train bouldering）、PMC8657215 摘要、PubMed 38166602／33966976 摘要、PMC12312403 摘要、Gripped 禮儀與 spray wall、方格子 HHH 術語。

🟢 Confirmed
- DAV：起攀雙手握起攀點、只用同色點、牆面與 volume 可用、爬到 Top 不再往上、只在允許處 top out、規則各館不同、先看再爬、看別人怎麼爬、墊子比你以為的硬、下攀比跳安全、下攀點多為灰色、新手只在簡單題爬到頂、Babyboxer（肩寬、雙腳落地、屈膝如坐、往後滾、手臂彎曲貼身、握拳）、墜落區淨空。
- World Climbing 2026：起攀需雙手雙腳在標示位置並穩定；完攀＝雙手同時接觸完攀點＋穩定位置＋明確控制，或站上岩塊頂。
- 方格子：台灣岩館多講原文；非比賽時完攀點用兩條膠帶標示，與起攀相同；不主動報 beta。
- BMC：讀線清單（種類、方向、身體位置、crux）、看別人爬是 "perfectly acceptable"、身高臂展改變 beta、下來後對照計畫；spot 護肩避免頭先著地、多數受傷在累了「最後一次」。
- Randall：起攀是最安全的實驗室、四種起攀練習；「抓不住起攀就降至少兩級」。Lattice：Not starting at the start。
- Hörst：crux 失敗可能是 beta-recognition／動作技巧；極限抱石每次之間休息 3–5 分鐘、在完全力竭前結束。
- PMC8657215：真人示範完攀最多、onsight 失敗最多。Medernach 2023：程度越高記得越多點與動作。Auer 2021：下肢受傷較常由跳下造成（OR 4.39，放附錄）。PMC12312403：85% 非自願、多在中段與上段。
- Gripped：不霸占、不主動報 beta、spot 前先問；spray wall 文章：想清楚怎麼掉、影片有幫助。REI：spotter 護頭肩、不是接住。

🔴／🟠 修正（已改）
- 「在比你極限低至少兩級的題目上做起攀練習」→ Randall 原文是「抓不住起攀時降至少兩級」，改寫成條件句（中英）。
- 「看過真人示範比只自己看更容易完攀」→ 對照組是「沒有任何事前資訊」，改正 tldr 與正文（中英）。
- 「不要用手撐地」出自攀岩小妞，不是 DAV → 從 DAV 段刪除。
- 練習題 1「雙手同點停一秒在大多數規則下都算」→ 改成「比賽規則和 DAV 的說法都會算」。

🟡 Unverifiable（未寫入）
- 「完攀一律要雙手」：找不到通用來源，正文寫成比賽規則＋依館規。
- 台灣各岩館館規的完攀定義：無公開館規可引，只寫方格子的標示說法並請讀者問櫃檯。
- 戶外抱石（墊子擺放）留給未來模組，不寫。

本次只檢查文中約 40 條宣告。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:references` 本篇無警告（初版有「參考資料關鍵詞重疊」WARN，參考資料描述補上 beta 後消失）；`check:process-leak` 通過；`check-post-quality` 4 檔無問題。`pnpm verify`／`astro check` 未跑（worktree 多人同時寫，交 commit gate）。
- frontmatter：series 攀岩動作技術／Climbing Movement order 6 ✓；tags 與同系列一致 [climbing, bouldering, indoor-climbing] ✓；glossary 補 Beta（全站 terms.ts 的 Beta 是投資定義，本篇以 frontmatter 覆寫）、Crux、完攀點、Flash、下攀。
- 範圍卡逐項：起攀規則 ✓、完攀定義依館規 ✓、拆動作 ✓、換 beta ✓、看示範（研究）✓、記錄嘗試 ✓、休息時間 ✓、何時換題 ✓、抱石墊與摔落入門 ✓、戶外抱石留後 ✓。讀完能把題目拆段並設計下一次嘗試：mermaid 循環＋換 beta 表 ✓。
- 結構對照範本：🌏 連結、每節「今晚就能做的動作」、練習題 4 題 details、下一步、參考資料 ✓；數字細節收進附錄 details ✓。
- 內部連結：系列 0–5、7、8 與入門文全部存在 ✓；英文版連 -en ✓。
- 一致性：3–5 分鐘、完攀規則三種說法在 tldr／description／正文／練習題一致 ✓。

## post-polish

- register-scan：長句初版 1 句（DAV 起攀段 63 字）→ 拆句，現 0；但書段落 7%；數字密度 0 段；引述區塊 0；模板化轉折 1 處（spot「不是…而是…」）→ 改寫，現 0。
- writing-phrase-ledger：改後無命中。
- 人讀：每節都有可執行動作；研究者姓名當主詞只在 Hörst 一處（引述其主張必要）。中英同步修改。
