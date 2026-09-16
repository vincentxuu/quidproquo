# Batch A 寫作 brief：B2B 情報 orders 0–2

Last updated: 2026-09-16

## 共用契約

- Category / type：`product` / `deep-dive`
- Tags：以 `[business-model, content-business, b2b, media, subscription]` 為底，個案特殊 tag 最多再加 2 個。
- 中文 series：`情報如何成為一門企業生意`
- 英文 series：`How Intelligence Becomes an Enterprise Business`
- Series orders：DIGITIMES 0、The Information 1、Seeking Alpha 2。既有 B2B 比較文留在母系列，不重複掛入子系列。
- 日期：實際落稿日；slug 分別為 `digitimes-supply-chain-intelligence`、`the-information-exclusive-news`、`seeking-alpha-contributor-marketplace`。
- 中文先定稿，英文採自然改寫；Mermaid 節點同步翻譯，外部 URL 不變。
- 每篇前三段完成 ELI5：用讀者熟悉的購買／市場情境說清楚「這家公司到底賣什麼」。
- 每個高風險數字或引述要有 inline source；文末只列實際完整讀過的來源。
- 母系列總覽只負責比較；個案篇負責機制與邊界，不複製整段六家公司比較。

## Order 0：DIGITIMES

- 聚焦問題：供應鏈關係如何從記者的人脈，變成企業願意續約的情報產品？
- 主脊：按情報生產鏈排列。
- ELI5 hook：菜市場裡，價格表人人看得到；真正值錢的是誰知道明天哪一攤會缺貨。
- 必含部件：資訊取得、編輯／研究產品化、企業採購、回饋飛輪、台灣供應鏈優勢、AI 能與不能取代之處。
- 圖解：
  1. `供應鏈接觸 → 零碎訊號 → 編輯驗證 → 報導／報告 → 企業決策 → 續約`。
  2. 公開新聞／供應鏈情報／決策建議比較表。
- 邊界：不把未公開的企業合約價格寫成事實；不把被國際媒體引用直接等同準確率。

## Order 1：The Information

- 聚焦問題：少量獨家新聞如何支撐高於大眾媒體的訂閱價格？
- 主脊：按訂閱單位經濟與內容飛輪排列。
- ELI5 hook：球賽結束後的比數免費；比賽前知道主力不會上場，才可能改變決策。
- 必含部件：產品與方案、讀者／客戶、獨家採訪成本、付費牆、附加資料產品、所有權／融資可驗證程度、AI 威脅。
- 圖解：
  1. `記者關係 → 獨家消息 → 高價值讀者 → 訂閱收入 → 更多採訪資源`。
  2. 標準／Pro／Investor 的「買到什麼」比較表（僅使用查證到的現行資訊）。
- 邊界：不把「無外部投資」自動寫成新聞品質較高；盈利、訂戶與成長數字若僅創辦人自述，要明標來源性質。

## Order 2：Seeking Alpha

- 聚焦問題：平台如何把大量投稿者的觀點，轉成讀者願意付費的投資研究產品？
- 主脊：按雙邊市場飛輪排列。
- ELI5 hook：不是一家餐廳雇一百位主廚，而是一座夜市讓攤商進來，再靠評分、規則與人流讓市場運作。
- 必含部件：貢獻者供給、編輯／治理、作者報酬、免費與訂閱層、Quant Ratings／資料層、讀者價值、品質風險、AI 衝擊。
- 圖解：
  1. 作者—平台—投資讀者的內容／注意力／金流三邊圖。
  2. 人工觀點與量化資料如何疊成產品的分層圖。
- 邊界：不把平台文章視為投資建議；不以單一回測結果證明未來績效；若使用 benchmark，完整走 benchmark 七問。

## Batch A 驗證

1. 對每篇中文跑 `check:tw`、register scan、phrase ledger。
2. 對六檔跑 references、lang parity、series order、post quality。
3. 跑 `pnpm verify` 與 `pnpm astro check`。
4. 渲染頁面檢查 Mermaid 手機寬度、節點截斷與雙語路由。
5. 回填既有 B2B 總覽的系列導覽；此為舊文修改，需依 post-update 規則同步中英與更新紀錄。
