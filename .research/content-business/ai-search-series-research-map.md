# AI 搜尋正在重寫內容生意：orders 0–6 研究地圖

研究日期：2026-09-17
狀態：第一輪 Groundlane-first source map；正式寫稿前，各 order 仍需補足第二來源與當日產品狀態。

## 共通來源與已證邊界

1. Google Search Central「AI features and your website」：AI Overviews／AI Mode 使用既有 Search 技術與索引內容；出現在 AI features 的網站流量被合併計入 Search Console Performance，不提供獨立的 AI Overview/Mode 細分。https://developers.google.com/search/docs/appearance/ai-features
2. Google spam policies：嘗試操弄 Search 的 generative AI responses 也在政策範圍；大量生成、主要為操弄排名且缺乏新增價值的頁面可構成 scaled content abuse。https://developers.google.com/search/docs/essentials/spam-policies
3. Cloudflare 2025-07-01 crawl-to-refer：AI crawler requests 與可辨識 referrals 間差距可量測，但 native apps 常沒有 Referer，故比率可能高估且幅度未知；各平台、期間差異大。https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/
4. Cloudflare AI Crawl Control／Pay Per Crawl：控制與付費存取是供給端機制；Pay Per Crawl 為特定推出階段／beta，不能寫成普遍市場收入。https://www.cloudflare.com/paypercrawl-signup/ 與 https://blog.cloudflare.com/introducing-pay-per-crawl/
5. Google-Extended：官方稱出版者可管理網站是否協助改進部分 Google generative AI 產品；其控制邊界要依最新官方頁，不可推導為退出所有 Google AI answers。https://blog.google/innovation-and-ai/products/an-update-on-web-publisher-controls/

## Order 0：AI 摘要如何改變流量路徑

- ELI5：目錄員變成代讀員。以前目錄指向書架；現在先念摘要，只有部分問題需要讀者去原站。
- 圖：傳統 search `query→10 links→click→publisher` 對照 AI `query→fan-out/retrieval→answer+citations→少量/不同意圖 referrals`。
- 核心：引用、曝光、點擊、轉換是四個不同指標；不能用「被引用」代表流量或收入。
- 量測：Search Console（混合報表）、server referrer、landing cohort、branded/direct、conversion per referred visit。
- 紅線：不拿單一 zero-click 百分比代表所有國家／查詢；不把 Cloudflare crawler ratio 當 CTR。

## Order 1：哪些內容最容易被答案引擎商品化

- 矩陣軸：答案可壓縮性 × 原始資料／行動依賴。
- 高可替代：定義、通用步驟、公開規格摘要、無原創比較。
- 中等：觀點文章、案例整理、定期更新資料，但若來源公開仍可重述。
- 較難替代：獨家訊號、第一方資料、個人信任、互動工具、交易／工作流。
- ELI5：料理卡片可抄；只有你家的食材、廚房與熟客關係較難抄。
- 紅線：較難替代不等於不會被摘要；要分取得成本與呈現成本。

## Order 2：封鎖、授權與訴訟各自保護什麼

- 決策樹：目標是降低 crawl、取得對價、建立法律判例，還是保護付費內容？四者不是同一問題。
- 封鎖：技術供給控制；只對遵守或能被邊緣阻擋的 crawler 有效，不建立需求。
- 授權：合約交換；條款常不公開，不把 announced partnership 等同明確訓練權／搜尋顯示權／固定金額。
- 訴訟：爭議處理；complaint、motion、ruling、final judgment 必須分層。
- Pay Per Crawl：實驗性市場機制，不等於已有穩定 publisher revenue。
- 需正式寫稿前補：至少兩個已公開合約範圍的 publisher deal、一個可讀 court docket／ruling。

## Order 3：從 SEO 到品牌直達

- 舊漏斗：non-brand query→ranking→click→pageview→ad/CTA。
- 新漏斗：AI／search exposure→brand recognition→direct/app/email/tool→conversion；搜尋仍存在但不再必然交付點擊。
- 品牌直達不是 slogan：要用 branded search、direct returning users、newsletter activation、app push、saved tool usage 衡量。
- SEO 仍負責可發現與可引用；品牌直達負責不必每次重新向平台買入口。
- 紅線：不宣布 SEO 死亡；Google 官方仍要求 crawl/index/quality，AI features 也用 Search systems。

## Order 4：第一方資料、社群與工具為何更重要

- 同心圓：外層 rented reach（search/social）→ identified audience（consented email/account）→ behavioral data（合法用途）→ community context→ tool/workflow→ transaction/retention。
- 第一方不等於可任意利用：同意、用途限制、刪除與安全成本必须入圖。
- 社群不是 follower 數；要看成員彼此互動是否能在平台外重建。
- 工具能把答案接到 action，但簡單功能也可能被模型內建；護城河來自資料更新、工作流與信任。

## Order 5：四種內容模式誰最危險

- 矩陣：AI exposure（公開文字可重述程度）× defense（原始訊號、owned relation、workflow、transaction）。
- 四類：B2B intelligence、creator platform、free/side monetization、independent newsletter/media company。
- 不做單一公司排名；同一公司內文章層與資料／工具層風險不同。
- 例：Seeking Alpha generic article vs Quant；Gartner public summary vs analyst/workflow；Substack archive vs email/payment；free news vs transaction/tool。
- 圖要標「產品層」，不能用公司 logo 固定風險。

## Order 6：AI 時代仍值得經營哪些內容資產

- 資產配置框架：
  - 現金流：直接訂閱、服務、affiliate／ads（需透明與單位經濟）。
  - 防禦：第一方關係、原始資料、工具、社群、品牌直達。
  - 選擇權：授權、API、structured data、workflow integrations。
- 每項資產問四題：誰擁有、能否匯出、多久更新、AI 能否只靠公開網頁重建。
- ELI5：不把所有錢放在一種果樹；有的今天結果，有的多年後形成土地與灌溉系統。
- 收束：少做可被完整壓縮、沒有下一步的文字；多做能產生原始訊號、直接關係或行動的內容系統。

## 全系列圖表規格

- 每篇至少 2 張：一張建立直覺，一張支援決策；另有 1 張比較表。
- Mermaid 節點避免把「可能提高」畫成已證因果。
- 時間敏感數字附日期、母體、方法與限制；沒有雙來源就刪精確值或標單源快照。
- series zh：`AI 搜尋正在重寫內容生意`
- series en：`AI Search Is Rewriting the Content Business`
