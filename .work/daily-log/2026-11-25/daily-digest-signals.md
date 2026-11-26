# daily-digest-signals 例外記錄 — 2026-11-25

Groundlane MCP 全程可用，未觸發 fallback 鏈降級。以下為個別來源（非整條鏈）失敗，已在信號篩選階段視為「該來源無法確認」處理，不影響其他 94 次查詢：

- `https://deepmind.google/blog` — 回傳內容為未能解碼的二進位/亂碼（疑似 gzip 層問題），放棄本次讀取。
- `https://www.snowflake.com/blog` — `UPSTREAM_ERROR: browser-challenge`，目標網站的瀏覽器驗證無法通過。
- `https://replit.com/blog` — 同上，`browser-challenge` 無法通過。
- `https://www.artificialintelligence-news.com` — 回傳 202、無可抽取內容。

另外三個來源初次呼叫逾時 / MCP 連線中斷後重試成功，不列入上述清單：
`(Australia OR New Zealand)` 區域查詢（DEADLINE_EXCEEDED，重試成功）、`vercel.com/blog`、`www.pydantic.dev/articles`（MCP server connection lost，重試後其中一個成功取得內容，另一個維持未讀）。

## 跨天去重修正

初稿 40 則信號中，有 6 則經 `seen-signal-urls.txt` 比對後移除：
- 4 則為「URL 完全重複」：`cursor.com/changelog/voice-chat`（2026-11-13 已收錄）、`ox.security/.../CVE-2026-47396`（2026-11-24 已收錄）、`research.google/blog/supercharging-transformer-residual-connections`（2026-11-24 已收錄）、`microsoft.com/.../lazare-veni-foras...`（2026-11-12 已收錄）。
- 2 則為「同一事件、不同 URL 的重複報導」，經人工判斷後移除以避免連續兩天重複收錄同一新聞：Sierra $1.75B Series F（2026-11-24 已用 lazytensor.com 報導過）、India AI funding doubles to $1.6B Tracxn report（2026-11-24 已用 economictimes.com 報導過）。

最終收錄 34 則信號，均通過 schema 與品質檢查清單。
