# Research 工具映射

依當前 tool list 與執行環境選擇，不綁定單一平台。Groundlane 取代舊 `stealth_fetch` 與舊 `web-fetch/fetch_page`，但不取代 Tavily、Exa、Firecrawl、Jina、GitHub、來源專用 MCP 或 Web 平台必要的原生工具。

## Groundlane

連線後的 public contract 固定為：

| 用途 | 工具 | 重點 |
|---|---|---|
| 廣域搜尋 | `web_search` | 優先 `provider: auto`；可用 domain、exclude、time range 收斂 |
| 讀取單頁 | `web_fetch` | 預設 Markdown；按需使用 render、wait、selector |
| 固定欄位抽取 | `web_extract` | deterministic selectors，不是 LLM inference |

`web_search` 要記錄實際 provider；`web_fetch` 要保留 engine、backend、final URL、status、truncated 與 warnings；`web_extract` 要保留 missing fields。Rendering 成功只代表走過 browser path，不等於繞過 CAPTCHA。

本機與 Web-hosted 連線限制見 `usage-modes.md`。

## Runtime 與專用工具

| 用途 | 首選 | 保留的專用／平台替代 |
|---|---|---|
| 廣域搜尋（找候選來源） | Groundlane `web_search` | Tavily Search、Exa Search、Linkup Search、平台原生 search |
| 學術 / GitHub / 程式碼導向 | 官方資料庫／GitHub | Jina arXiv/SSRN、Exa、GitHub MCP、本機 repo |
| 抓單一頁面（轉 Markdown） | Groundlane `web_fetch` | Firecrawl Scrape、Tavily Extract、Exa Fetch、平台原生 open/fetch |
| 固定欄位抽取 | Groundlane `web_extract` | 來源本身的結構化 API／專用 MCP |
| 整站爬（多頁文件） | 先確認真的需要 | Firecrawl Crawl、Tavily Crawl |
| 站點地圖（找有哪些頁可讀） | 官方 sitemap／archive | Firecrawl Map、Tavily Map |
| 互動取資料（需要 JS render） | Groundlane configured rendering | Firecrawl Browser/Interact、平台原生 browser |
| 整合式深研（黑箱多步） | Agent 自己維持證據表 | Tavily Research 僅作候選材料，不取代本 skill 的驗證流程 |

Codex 或一般 Web agent 沒有 Groundlane 時，可使用平台原生 search/open/fetch。Claude 或其他 MCP client 沒有 Groundlane 時，使用當前實際暴露的專用 MCP。若名稱與上表不同，以 tool contract 判斷；不要假裝工具存在。

## 抽取完整度（最容易踩的坑）

`tavily_extract` 的 `query` 參數會**依相關性重排並只回傳片段**，不是全文。主要來源不要帶 `query`。

| 情境 | 怎麼抓 |
|---|---|
| 結論會依賴的論文 / 官方頁 / 定價頁 | `tavily_extract`（**不帶 `query`**）或 `firecrawl_scrape` |
| 只用來交叉印證方向的次要來源 | 可以帶 `query` 省 context |
| 回傳超過限制 | 有 filesystem 時讀 tool-spooled file，使用 `python3`／`grep` 分段讀完；Web 端用 pagination、section open 或縮小範圍重抓，無法證明完整就降級為 🟡 |

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
| 搜尋結果都是 SEO 農場 | 加 `site:` 限定官方域名，或改用 `exa_web_search`（語義搜尋更乾淨） |
| 整站爬卡住 | 先用 `firecrawl_map` 拿站點地圖，挑頁面後逐個 `scrape` |
| 需要 JS render 但 `firecrawl_browser_*` 太慢 | 確認真的需要 JS；很多 SPA 其實有 SSR fallback |
| 官方文件版本混淆 | 找 release note / changelog / versioned docs |
| 找不到第二來源 | 窄事實若有權威一手，標明單一一手來源；效果、比較、爭議或綜合結論則標 `⚠️ unverified`，不要硬湊低品質來源 |
| 來源互相矛盾 | 標 `❌ conflict`，列出差異 |
| PDF 抓回來是著陸頁 HTML 或空字串 | 該工具不解析 PDF，換 `firecrawl_scrape` 加 `parsers: ["pdf"]` |
| 機構典藏的 PDF 一直失敗 | 主機層級問題，不是格式問題。找鏡像站或走〈繞路順序〉 |
| MCP 工具回 `requires approval` | **不是設定檔問題**。claude.ai connector 層級設成 `ask` 的工具，allow 規則也擋不住（見 code.claude.com/docs/en/permissions），只能在權限提示當下放行 |
| Bash `curl` 回 HTTP 000 | 該環境沒有直接對外連線，抓取一律走 MCP 工具 |
| 二手站數字彼此一致但可疑 | 一致不等於正確，二手站會集體抄同一個錯。價格、方案名稱、產品線一律回官方頁覆核。本站踩過：兩個獨立統計彙整站對某年會議數字完全一致，官方 Fact Sheet PDF 卻寫了完全不同的數字——後來查到同一組織另外兩篇不同時間點發布的官方 blog 互相印證，才確認兩站是對的、Fact Sheet 那份 PDF 反而是官方自己文件裡的過時或錯誤數字 |
| 抓取工具在超大目錄／清單頁被截斷，只看到部分內容 | 改用 Bash `curl` 抓完整原始 HTML 存本機，用 `python3`／`grep` 逐段解析，繞過抓取工具的輸出上限 |
| 找不到官方 prose 寫的統計數字，但有逐項列出的官方目錄／清單頁 | 直接核算目錄本身：確認分節邊界乾淨（無缺號、無重複），用編號區間反推精確數量。本站踩過：查不到某會議某年官方公布的正式接受篇數，改抓官方論文集目錄頁原始 HTML，發現每篇論文依 `id="paperN"` 連續編號、按 track 分節，直接數編號區間就拿到精確的 Main Track 篇數，比任何轉述都更接近一手 |
| Web-hosted agent 沒有 Groundlane／專用 MCP | 使用平台原生 Web 工具並標明 fallback；不可嘗試連使用者 localhost |
| 當前環境完全沒有網路研究工具 | 使用已提供材料；不足時回報 blocker，不假裝工具存在 |
