# MCP 工具映射

`CLAUDE.md` 規定**不要用**內建 `WebFetch` / `Playwright`，一律用 MCP 工具。

## 按用途選工具

| 用途 | 首選 | 備援 |
|---|---|---|
| 廣域搜尋（找候選來源） | `tavily_search`、`exa_web_search` | `linkup-search` |
| 學術 / GitHub / 程式碼導向 | `exa_web_search`、`exa_web_fetch` | `tavily_search` |
| 抓單一頁面（轉 markdown） | `firecrawl_scrape`、`tavily_extract` | `get_url_markdown` |
| 整站爬（多頁文件） | `firecrawl_crawl`、`tavily_crawl` | — |
| 站點地圖（找有哪些頁可讀） | `firecrawl_map`、`tavily_map` | — |
| 互動取資料（需要 JS render） | `firecrawl_browser_*`、`firecrawl_interact` | — |
| 整合式深研（黑箱多步） | `tavily_research` | — |
| 反爬蟲被擋 | `stealth_fetch` | — |

## 升階原則

**能搜就不用爬、能爬單頁就不用整站、能整站就不用瀏覽器**。每升一階成本與失敗率都升一階。

## 常見失敗與對應

| 失敗 | 對應 |
|---|---|
| `firecrawl_scrape` 403 / Cloudflare | 改 `stealth_fetch` |
| 搜尋結果都是 SEO 農場 | 加 `site:` 限定官方域名，或改用 `exa_web_search`（語義搜尋更乾淨） |
| 整站爬卡住 | 先用 `firecrawl_map` 拿站點地圖，挑頁面後逐個 `scrape` |
| 需要 JS render 但 `firecrawl_browser_*` 太慢 | 確認真的需要 JS；很多 SPA 其實有 SSR fallback |
