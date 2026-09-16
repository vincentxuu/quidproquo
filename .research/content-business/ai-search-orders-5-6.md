# AI 搜尋系列 orders 5–6 研究紀錄

研究日期：2026-09-17

## 問題與結論

- Order 5 比較的是產品層，不是公司排名。同一家公司可同時有高暴露的公開摘要與較難重建的資料庫、會員關係或工作流。
- Order 6 把內容資產拆成現金流、防禦與選擇權；「資產」必須能回答擁有者、可攜性、更新責任與公開網頁能否重建。
- Google 官方文件證實 AI Overviews／AI Mode 仍建立在 Search 索引與既有 SEO 基礎上，流量併入 Search Console Web 類型；Google 對點擊品質的說法是平台自述，本文不拿來當獨立成效證據。
- Cloudflare 的 crawl-to-refer 是 crawler requests 與可辨識 referral requests 的相對量，不是 CTR；原生 App 缺 Referer 會造成未知幅度的低估。
- Ghost 官方文件可證會員清單可匯出、Stripe 帳號由出版者連接；只能證明這套產品設計的可攜性，不能外推為留存或收入保證。
- Cloudflare AI Crawl Control 可監看、允許或封鎖 crawler；Pay Per Crawl 在 2026-08-14 文件仍標 private beta，不能當成熟普遍收入。

## 主要來源

1. Google Search Central: https://developers.google.com/search/docs/appearance/ai-features
2. Cloudflare crawl-to-refer: https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/
3. Ghost Memberships: https://docs.ghost.org/members
4. Cloudflare AI Crawl Control: https://developers.cloudflare.com/ai-crawl-control/

以上均由 Groundlane `web_fetch` 取得完整正文；查證日期 2026-09-17。搜尋階段 Groundlane balanced routing 的 Tavily／Exa 部分不可用，但 Brave／You 成功，未使用平台 web fallback。
