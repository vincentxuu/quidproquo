# AI 搜尋系列 orders 0–1 研究 dossier

研究日期：2026-09-17。公開頁面皆以 Groundlane `web_fetch` 完整讀取；Google spam policies 因頁面長度截斷，但本次只使用開頭可見的 generative-AI policy 定義，不引用未讀區段。

## Order 0：內容到流量的路徑

- Google 官方：AI Overviews／AI Mode 可用 query fan-out，跨子題與資料來源發出多個查詢，再生成帶 supporting links 的回答。這是平台自述，不代表每次都觸發或必然增加 publisher traffic。
- Google 官方：AI features 的站點表現併入 Search Console Performance 的 Web search type，不能從該報表直接拆出完整 AI Overview／AI Mode cohort。
- Pew：900 位美國成年人 2025-03 tracked-device browsing data；研究者在 2025-04-07–17 重跑相同查詢來分類 AI summary。被分類為有摘要的查詢後，一般結果點擊較低。這是特定樣本與事後重建分類的關聯，不是全球因果。
- Cloudflare：crawl-to-refer = 平台相關 user agents 取得 HTML response 的 request 數／`Referer` 含平台 hostname 的 HTML request 數，正規化為 1 referral request。不是 CTR、session 或 unique visitor；Claude native app 不帶 Referer，Cloudflare 推測其他 apps 可能相同，故比率可能高估且幅度未知。
- 決策框架：曝光、引用、referral request、session、activation、conversion 分開量。

## Order 1：內容可替代性

這是分析矩陣，不是外部研究排名。兩軸：

1. 答案可壓縮性：能否在短回答中保留主要價值。
2. 原始訊號／行動依賴：使用者是否仍要回到原站取得更新資料、個人信任、工具、交易或工作流。

- 高可替代：定義、通用步驟、公開規格轉述、無新增價值的彙整。
- 中：觀點、案例整理、公開資料比較；來源脈絡與更新速度會改變風險。
- 較難：獨家採訪、第一方資料、持續更新工具、需登入或交易的工作流、社群信任。
- 「較難」只代表答案無法完整完成工作，不代表不會被抓取、摘要或引用。
- Google spam policy 明列試圖操弄 Search generative AI responses 在政策範圍；大量低新增價值內容不是防禦。

## 來源帳

| URL | 支持主張 | 完整度 |
|---|---|---|
| https://developers.google.com/search/docs/appearance/ai-features | fan-out、links、Search Console、控制邊界 | 全文，未截斷 |
| https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/ | 樣本、重跑方法、點擊關聯 | 全文，未截斷 |
| https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/ | request/request 定義、Referer 限制 | 全文已在同日審稿完整讀取；本輪 bounded fetch 取得方法段 |
| https://developers.google.com/search/docs/essentials/spam-policies | generative-AI manipulation policy | bounded fetch，輸出截斷；使用段落完整 |

## 寫作紅線

- 不引用單一 zero-click 比率代表全市場。
- 不把 crawl-to-refer 當 CTR。
- 不把 Google「higher quality clicks」平台自述當獨立研究。
- 不把 Pew 關聯寫成 AI summary 的因果效果。
- 不說工具、資料或品牌不可被摘要；只說公開答案較難完成整個工作。
