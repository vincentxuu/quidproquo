# Research 工具映射

依當前 tool list 與執行環境選擇，不綁定單一平台。Groundlane 取代舊 `stealth_fetch` 與舊 `web-fetch/fetch_page`，但不取代 Tavily、Exa、Firecrawl、Jina、GitHub、來源專用 MCP 或 Web 平台必要的原生工具。

## Groundlane

連線成功時，Groundlane 提供固定的 remote MCP contract：

| 用途 | 工具 |
|---|---|
| 廣域搜尋 | `web_search` |
| 抓單一頁面 | `web_fetch` |
| 固定欄位抽取 | `web_extract` |

工具 namespace 與完整 schema 才是 runtime truth；名稱相似的平台原生工具不算 Groundlane。Web-hosted agent 沒有 Groundlane connector 時，使用平台實際提供的專用 MCP 或原生 Web 工具，不可嘗試連使用者 localhost。

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

Claude 的規則（`CLAUDE.md`）：**不要用**內建 `WebFetch` / `Playwright`，一律用 MCP 工具。

| 用途 | 首選 | 備援 |
|---|---|---|
| 廣域搜尋（找候選來源） | Groundlane `web_search` | `tavily_search`、`exa_web_search`、`linkup-search` |
| 學術 / GitHub / 程式碼導向 | `exa_web_search`、`exa_web_fetch` | `tavily_search` |
| 抓單一頁面（轉 Markdown） | Groundlane `web_fetch` | `firecrawl_scrape`、`tavily_extract`、平台原生 open/fetch |
| 固定欄位抽取 | Groundlane `web_extract` | 來源本身的結構化 API／專用 MCP |
| 整站爬（多頁文件） | `firecrawl_crawl`、`tavily_crawl` | — |
| 站點地圖（找有哪些頁可讀） | `firecrawl_map`、`tavily_map` | — |
| 互動取資料（需要 JS render） | `firecrawl_browser_*`、`firecrawl_interact` | — |
| 整合式深研（黑箱多步） | `tavily_research` | — |
| 普通 HTTP 被擋 | Groundlane configured rendering 或其他現役 provider | 保留 status/warnings，不宣稱保證繞過 CAPTCHA |

## 抽取完整度（最容易踩的坑）

`tavily_extract` 的 `query` 參數會**依相關性重排並只回傳片段**，不是全文。主要來源不要帶 `query`。

| 情境 | 怎麼抓 |
|---|---|
| 結論會依賴的論文 / 官方頁 / 定價頁 | Groundlane `web_fetch`、`tavily_extract`（**不帶 `query`**）或 `firecrawl_scrape` |
| 只用來交叉印證方向的次要來源 | 可以帶 `query` 省 context |
| 回傳超過限制被存成檔案 | **正常**。用 `python3 -c 'print(open(f).read()[A:B])'` 或 `grep -o -E '.{200}關鍵字.{400}'` 讀完，不要改用會截斷的方式 |

## PDF 解析能力

不是每個抓取工具都會解析 PDF。這決定了論文抓不抓得到：

| 工具 | 解析 PDF？ |
|---|---|
| `firecrawl_scrape`（加 `parsers: ["pdf"]`）、`firecrawl_parse` | ✅ 最可靠 |
| `exa_web_fetch` | ✅ |
| `tavily_extract` | 🟡 多數站可以，但部分機構典藏（如 bepress 的 `viewcontent.cgi`）會失敗 |
| `linkup-fetch`、`get_url_markdown`、`get_url_html_content` | ❌ 不解析，會回空字串或著陸頁 HTML |

同一份 PDF 在 A 站抓不到、B 站抓得到，是**主機問題不是格式問題**——換鏡像站比換工具有效。

## 取不到全文時的繞路順序

「付費牆」通常只擋正文。放棄之前依序試：

1. **出版商自己開放的部分**——ScienceDirect 的 *Section snippets* 含各節首段、致謝、利益衝突聲明，免費且 `firecrawl_scrape` 抓得到
2. **引用它的開放取用論文**——後續研究常詳述前作的設計與結果，CC BY 的期刊論文與作者接受稿都可用
3. **機構典藏 / 作者自存版**——大學 repository、實驗室網站、個人頁；用 `bepress_citation_pdf_url` 之類的 meta 標籤確認 canonical PDF 位址
4. **鏡像與聚合站**——CORE、Semantic Scholar；**Scribd 等第三方轉載不採用**，來源正當性不明
5. **Wayback Machine**
6. 以上皆無 → 標 🔴 並在交手時明講，不要用「已查證」帶過

## 升階原則

**能搜就不用爬、能爬單頁就不用整站、能整站就不用瀏覽器**。每升一階成本與失敗率都升一階。

## 常見失敗與對應

| 失敗 | 對應 |
|---|---|
| 普通 HTTP 或 Firecrawl 403 / challenge | 嘗試 Groundlane configured rendering 或另一個現役 provider；保留 status/warnings，不宣稱一定能繞過 CAPTCHA |
| Groundlane 沒連線 | 使用實際可用的專用 MCP 或平台原生工具並記錄 fallback；不回退 legacy fetch tools |
| 搜尋結果都是 SEO 農場 | 加 `site:` 限定官方域名，或改用 `exa_web_search`（語義搜尋更乾淨） |
| 整站爬卡住 | 先用 `firecrawl_map` 拿站點地圖，挑頁面後逐個 `scrape` |
| 需要 JS render 但 `firecrawl_browser_*` 太慢 | 確認真的需要 JS；很多 SPA 其實有 SSR fallback |
| 官方文件版本混淆 | 找 release note / changelog / versioned docs |
| 找不到第二來源 | 標 `⚠️ unverified`，不要硬湊低品質來源 |
| 來源互相矛盾 | 標 `❌ conflict`，列出差異 |
| PDF 抓回來是著陸頁 HTML 或空字串 | 該工具不解析 PDF，換 `firecrawl_scrape` 加 `parsers: ["pdf"]` |
| 機構典藏的 PDF 一直失敗 | 主機層級問題，不是格式問題。找鏡像站或走〈繞路順序〉 |
| MCP 工具回 `requires approval` | **不是設定檔問題**。claude.ai connector 層級設成 `ask` 的工具，allow 規則也擋不住（見 code.claude.com/docs/en/permissions），只能在權限提示當下放行 |
| Bash `curl` 回 HTTP 000 | 該環境沒有直接對外連線，抓取一律走 MCP 工具 |
| 二手站數字彼此一致但可疑 | 一致不等於正確，二手站會集體抄同一個錯。價格、方案名稱、產品線一律回官方頁覆核 |
