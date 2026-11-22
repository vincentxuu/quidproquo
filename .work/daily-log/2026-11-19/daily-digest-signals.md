# daily-digest-signals 2026-11-19

Groundlane MCP 全程可用，無需降級到 fallback 鏈下一層。以下來源在直讀時遇到問題，已記錄但不視為 blocker（整體資訊已由其他來源或廣域搜尋補足）：

- `deepmind.google/blog`：`UPSTREAM_ERROR browser-challenge`，無法繞過，本次未能直讀。
- `blog.palantir.com`：`UPSTREAM_ERROR browser-challenge`，無法繞過，本次未能直讀。
- `replit.com/blog`：`UPSTREAM_ERROR browser-challenge`，無法繞過，本次未能直讀。
- `azure.microsoft.com/en-us/blog/category/ai-machine-learning`：`DEADLINE_EXCEEDED`（connect timeout），重試後仍逾時。
- `news.sap.com/topics/artificial-intelligence`：瀏覽器 fallback 回傳空頁（`js_empty_document`），未取得有效文章列表。
- `www.minimaxi.com/news`：重導向到 `minimax.cn/news` 後回傳空頁（`js_empty_document`），僅取得語言切換連結。

另：三則候選信號（Microsoft Research「Lazarus」後門研究、LangChain 融資公告兩個候選 URL）在跨天去重檢查時發現已存在於 `seen-signal-urls.txt`（分別在 11/17 與 11/16 已收錄），因此從本次 JSON 移除，未計入 35→33 則的最終信號數。
