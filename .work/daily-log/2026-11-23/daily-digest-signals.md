# daily-digest-signals 例外記錄 — 2026-11-23

## toolDegradation

- **Groundlane MCP**：連線被拒（session 已登入過，但這次重新連線被 refused，需要使用者重新登入）。完全不可用，fallback 至下一層。
- **Groundlane 直接 HTTP**：`POST https://groundlane.vincent-xu-work.workers.dev/mcp` 回 401（需要 OAuth bearer token，CLI 無法取得），不可用。
- **Keenable keyless API**：可用。注意參數是 `query`（不是 `q`），且額外支援 `published_after`/`published_before`（文章發佈日）與 `acquired_after`/`acquired_before`（爬取日）兩組獨立篩選參數，與 `acquired_at`/`published_at` 回傳欄位對應，本次查詢用 `published_after` 搭配本機日期過濾。用於第一、三層全部 20 組搜尋查詢（9 廣域 + 3 社群 + 8 區域），全部成功。
- **Firecrawl MCP (`firecrawl_scrape`)**：連線到帳號每日 MCP 額度與團隊額度皆已用盡（"Insufficient credits"），完全無法使用，改用 Exa `web_fetch_exa` 取代官方 blog 直讀。額度預計 2026-11-23T17:12 UTC 重置。
- **Exa `web_fetch_exa`**：可用，取代 Groundlane `web_fetch` 執行官方 blog/changelog 直讀。

## 第二層「官方 blog 直讀」執行範圍縮減

SKILL.md 列出約 100+ 個官方來源（A1 大廠、HF/GitHub 公司頁、A2 模型公司、B1/B2 開發工具、中國大廠、VC/媒體）。由於 Groundlane（0 搜尋配額、低延遲）不可用，改用 Exa `web_fetch_exa`（有實際延遲與 context 成本）逐一讀取，考量單次 session 的執行時間與工具呼叫量，本次僅覆蓋約 24 個最高訊號密度來源：

- A1：anthropic.com/news, openai.com/news, deepmind.google/blog, devblogs.microsoft.com/agent-framework, ai.meta.com/blog, aws.amazon.com/blogs/aws, blogs.nvidia.com/blog/category/generative-ai, x.ai/news, blog.cloudflare.com/tag/ai
- A2：mistral.ai/news, cohere.com/blog
- B1/B2：cursor.com/changelog, langchain.com/blog
- 中國大廠：deepseek.com/en/news, manus.im/blog, huggingface.co/Qwen, kimi.com/blog, sakana.ai/blog, minimaxi.com/news（抓取失敗：CRAWL_EMPTY_CONTENT）, seed.bytedance.com/en/research, alibabacloud.com/blog
- VC/媒體：the-decoder.com, latent.space/archive, simonwillison.net, huggingface.co/blog

**未覆蓋**：剩餘約 75 個來源（主要是 HF/GitHub 各公司頁、A2/B1/B2/中國大廠的長尾項目、VC/媒體的 a16z/bvp/lsvp/ycombinator/artificialintelligence-news/marktechpost）本次未逐一直讀。第一層 9 組廣域查詢與第三層區域矩陣已對同一時間窗內的重大事件有較高覆蓋率（例如模型發佈、資安事件多數仍可透過廣域搜尋捕捉到），但未覆蓋來源仍可能有未被廣域搜尋索引到的獨家發佈，屬於已知覆蓋缺口。

## 其他

- 執行時區換算：系統時間 2026-11-22T19:34 UTC = 2026-11-23T03:34 Asia/Taipei，故 TODAY=2026-11-23、YESTERDAY=2026-11-22，48 小時過濾門檻採 `publishedDate >= 2026-11-21`（Keenable `published_at` 為準）。
- 去重：已核對 `seen-signal-urls.txt`（含 2026-11-18～2026-11-22 共 95 筆 URL），剔除 2 筆重複（`labs.scale.com/leaderboard/hss`、`autonainews.com` 澳洲 AI 安全義務報導）。
- 最終收錄 36 則信號，relevance 全數 ≥ 0.5，unverified 比例 3%（1/36，Zensar 案例研究頁面未標示發佈日期）。
