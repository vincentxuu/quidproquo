# Review: 2026-10-17-sport-vs-trad-overview（zh + en）

日期：2026-10-17。來源原檔：`/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/eefceeef-ad9b-4e77-b0f9-6d606c5f451b/scratchpad/agent-overview/src/`（jina reader／curl，本 session 全部開過）。Groundlane MCP 未用（依任務指示走 Keenable→Jina→curl）。

## post-verify

逐條對原檔 grep 核對（共 28 條宣告）：
- 🟢 TOCC 試算表統計分頁：傳攀 325／運攀 209／上方架繩 42／抱石 44（CSV 匯出 2026-10-17）。
- 🟢 5.9 以下傳攀 182／運攀 12：由九個分區頁的路線列計算（路線列傳攀 329、運攀 209，與統計分頁 325 差 4，屬試算表內部差異；文中總數用統計分頁、難度分布用路線列，並寫明「按分區路線」）。nobodyclimb 舊匯入的 616 條／326 傳攀／204 運攀為舊數，不採用。
- 🟢 分區數字（第一洞 62/12、鐘塔 42/5、音樂廳 63/19、黃金谷 65/24）由同一批 CSV 計算。
- 🟢 「多數傳攀頂端有 bolt 固定點」：329 條傳攀中 Anchor 欄標 bolt 材質 96、「共用」156、天然 7、無 38、空白／待查 32。
- 🟢 2015 大鼓雙 bolt 斷裂、Collinox 2010 前為 304；2019 #313 三點脫出、墜落約 20 m（TOCC 大事紀）。
- 🟢 AAC Human Factors 2025：2005–2024、岩館 5.12 案例、2023 全部保護點脫出事故皆為 cam。
- 🟢 Rugg 2020：trad 75% 墜落（轉引 Addis）、sport 多為用力動作、limitations 段的異質性。
- 🟢 Wikipedia Sport climbing「early 1980s」；Traditional climbing 定義與「需較多裝備」。
- 🟢 REI 快扣兩端不可對調（sharp edges）。
- 🟢 nobodyclimb：rope-system 頁 8 分類、認證「Coming Soon」；L1–L5 來自 nobodyclimb repo `docs/games/rope-system/01-product-spec.md`（未上線，文中寫「規劃中」）。
- 🟢 nobodyclimb 岩場頁：墾丁、壽山 Crag Type: Sport；關子嶺 Sport, Boulder。
- 🔵→已修：原寫三岩場「都標為運攀」，關子嶺另標抱石 → 加括號說明。
- 🟢 MP 關子嶺 19 條全 Sport；東管處景點頁「四稜砂岩」。
- 🟢 壽山禁止事項第 15 點；墾丁第 7 點三地區（中央社 2024-01-05 引述）。
- 🔴→已修：協調者更正 TOCC 垂降為「建議」非要求。原文「要求兩件事」「TOCC 也要求」→ 改為「請大家務必自備器材架頂繩」「建議盡量雙繩垂降」（中英 Q2 同步）。頁面原文：頂繩「請各位務必使用自備的器材」、撤退「我們建議各位盡可能以雙繩垂降」。
- 🟡→已刪：初稿「多繩距路線也在這裡」無本 session 開過的來源，且協調者指出龍洞多繩距並非全傳攀，刪除。
- 本次只檢查文中已提出的宣告，未評估覆蓋完整性（交 post-review）。

## post-review

- `pnpm check:references`：本篇 0 error（兄弟篇此時已存在）。`pnpm verify` 唯一紅燈是本審稿紀錄未建立（本檔建立後解除）。`pnpm -s check:tw`：0 blocking。
- frontmatter：必填齊、tags 5 個皆既有 tag、type guide、series order 0、glossary 4 條只在 frontmatter。tldr 有具體數字（325/209、182/12）與岩場名。
- 範圍卡對照：定義、裝備差、風險差、台灣數據、系列地圖、自我定位（L1–L5）皆有；未講技術細節，改連到各篇。
- inline link：每個數字與事件都在該句附來源連結。英文版中文來源標 (in Chinese)。
- 已修：TOCC 英文名初稿寫 Community → 依 TOCC 大事紀改為 Taiwan Outdoor Climbers' Coalition。
- 已修：東管處全名「東北角及宜蘭海岸」（初稿誤作「暨」）。
- mermaid：flowchart TB、無顏色、短標籤；mmdc 本地渲染中英兩張皆正常。
- 每節有「今晚就能做的動作」；練習題 4 題 + nobodyclimb 連結；下一步、參考資料齊。

## post-polish

- register-scan：長句 3 → 0（拆 AAC cam、#313、壽山／墾丁三句）；但書 1%；姓名主詞 2 → 0（Arenz、Rugg 移出主詞位置）；模板化轉折 0；不是…而是 0。
- 數字密度：「5.9 以下 182／12」段 5 → 4（刪 5.11、5.12 改「5.11 以上」）；大鼓段刪月份；#313 段拆兩段；Q1「12 支快扣」改「一串」。剩餘 4 數字段為核心數據與編號清單，保留。
- scan-ledger：0 命中。
