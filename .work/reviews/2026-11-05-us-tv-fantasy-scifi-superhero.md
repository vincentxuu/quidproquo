# 2026-11-05-us-tv-fantasy-scifi-superhero — 審稿紀錄

日期：2026-11-05。範圍：zh-TW 與 en 兩檔（系列 order 1）。審稿者：本篇作者自審（同一 session），未另派獨立審稿者。

## post-verify

事實來源是 `.work/research/world-tv-drama-guide/us/factsheets-post1.md`（每部的 Wikipedia、IMDb Parents Guide、Rotten Tomatoes 季頁皆標 read）與三份候選檔。逐部對照：

- 季數、集數、狀態、續訂：18 部與資料卡一致（例：權力遊戲 8 季 73 集；黑袍糾察隊 5 季 40 集 2026-05 完結；曼達洛人 3 季 24 集、第 4 季改電影）。
- RT 第一季影評／觀眾分 18 部一致；共識改寫成中文轉述，未加原文沒有的評價。
- 尺度點數由 IMDb 五類嚴重度換算（None/Mild/Moderate/Severe → ○○○/●○○/●●○/●●●），逐部核對。
- 推薦來源標籤：只用 read 的來源；snippet（HBO Max TW 首頁、風傳媒、Reddit survey）與業配（TEEPR #HBOMaxPartner）都沒列。
- 修正：3 體原寫「分數最低」，實際星期三 74% 更低，改成「只高於星期三」；安道爾「Variety、Vulture、THR 年度第 1」原寫成媒體第 1，實為各媒體中個別影評人的第 1，已改；Reddit 調查是 snippet，改成 RedRecs #1（read）。tldr 原寫人生切割術「尺度最輕」，曼達洛人更輕，已改。
- 《陰屍路：生存者》的 F 標籤屬母劇，扣除後只剩 C、G 兩類，移到候補名單。
- 台灣串流：17 部有平台台灣作品頁、台灣官方 YouTube 頻道或台灣新聞佐證（`tw-availability-*.md`、`tw-availability-official.md`）；黑袍糾察隊只到 likely，文中標「JustWatch 台灣列出」。

未驗：IMDb 尺度是使用者投票；《Gen V》與主劇第 4 季的劇情交集未查，文中只寫「同一宇宙另有《Gen V》」。

## post-review

- 機械檢查：check:tw 0 blocking（「本地區」被 phrase-ledger 標出，改寫）；check-process-leak 通過；check-post-quality 通過；diagram-geometry 0 錯誤；diagram-preview 中英皆 ✓，淺色、深色、手機截圖已看過；lang-parity 通過；series-order 只有缺號 2 的提示（美劇 2 還沒寫）。
- 結構照使用者確認的排版：開頭 → 先從這 3 部開始 → 推薦來源一覽（矩陣表）→ 象限圖 → 分組卡片 → 候補觀察名單 → 限制 → 參考資料。
- 推薦來源矩陣用 Markdown 表格而非 SVG：diagram skill 的比較矩陣上限 5 個選項，18 部要用表格。
- 每部卡片欄位一致；第一次出現的來源都有 inline 連結（Wikipedia、RT、IMDb、平台頁）。
- frontmatter：tldr 是答案（先看哪 3 部、避開哪些、短的選哪部、和平使者要先看什麼）；tags 5 個；type guide；series order 1。

## post-polish

register-scan：長句 0；但書段 6%；引述區塊 0；模板化轉折 0；一般英文術語 0。數字密度命中的 3 段都是「長度」欄（季數、集數、年份），是欄位本身的資料，不改。phrase-ledger：「本地區」1 處已改。

## 修訂：評價欄位多元化（2026-11-05，使用者：「都是 Rotten Tomatoes 不夠多元」）

- 每部改為「評分」＋「劇評」兩行：Metacritic（讀過的季頁）、RT、IMDb、豆瓣（只列讀得到頁面或可信報導的分數），加一篇英美主流媒體署名劇評與一篇讀得到全文的台灣中文劇評。來源：`.work/research/world-tv-drama-guide/us/reviews-post*.md`。
- 中文劇評原本多為搜尋摘要，另用 Tavily extract 補讀全文：關鍵評論網（大熊餐廳、繼承之戰、核爆家園、龍族前傳、曼達洛人、最後生還者、怪奇物語、德利鎮、星期三）、鳴人堂（和平使者）、電影神搜（企鵝人、異塵餘生）、釀電影（大熊餐廳、安道爾、萬中選一、3 體）。仍只有摘要的（GQ、大紀元、北京青年報、Vogue、Tatler、多數豆瓣長評）不引用。
- 豆瓣分數：只放讀到頁面快取或報導原文的；3 體用聯合早報 2024-03-27 報導的 6.8。
- 英文版台灣影評人名字保留中文原名，不自創拼音。
- Metacritic 計分方式、RT Tomatometer 定義兩頁皆讀過，加入參考資料。
