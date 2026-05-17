# Research 工具映射

依當前 agent 可用工具選擇，不綁定單一平台。

## Codex

Codex 有 `web.run` 時：

| 用途 | 工具 |
|---|---|
| 廣域搜尋 | `web.run` search_query |
| 開官方文件 / 論文 / release note | `web.run` open |
| 找頁內關鍵字 | `web.run` find |
| 需要最新價格、版本、政策 | 必須查網路，不靠模型記憶 |

Codex 搜尋技術問題時，優先使用 primary sources：官方文件、官方 blog、release note、GitHub repo、論文。

## Claude / MCP

有 MCP search/scrape 工具時：

| 用途 | 首選 | 備援 |
|---|---|---|
| 廣域搜尋 | `tavily_search`、`exa_web_search` | `linkup-search` |
| 學術 / GitHub / 程式碼導向 | `exa_web_search`、`exa_web_fetch` | `tavily_search` |
| 抓單一頁面 | `firecrawl_scrape`、`tavily_extract` | `get_url_markdown` |
| 整站爬 | `firecrawl_crawl`、`tavily_crawl` | - |
| 站點地圖 | `firecrawl_map`、`tavily_map` | - |
| 反爬蟲被擋 | `stealth_fetch` | - |

## 升階原則

能搜就不用爬，能抓單頁就不用整站，能整站就不用瀏覽器。每升一階成本與失敗率都升一階。

## 常見失敗

| 失敗 | 對應 |
|---|---|
| 搜尋結果都是 SEO 農場 | 加官方域名限制，或改語義搜尋 |
| 官方文件版本混淆 | 找 release note / changelog / versioned docs |
| 找不到第二來源 | 標 `⚠️ unverified`，不要硬湊低品質來源 |
| 來源互相矛盾 | 標 `❌ conflict`，列出差異 |
