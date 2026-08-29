# Research: Keenable.ai

訪問日：2026-08-29

## 子問題
1. Keenable.ai 是什麼產品，主要解什麼問題？
2. 它的技術/產品主張和一般搜尋 API、fetch API 差在哪？
3. 公司背景、募資、團隊狀態如何？
4. 定價、rate limit、API/MCP 使用方式如何？
5. 有哪些 adoption / integration 訊號？
6. 可信度、風險和適合/不適合場景是什麼？

## 來源清單
- [Keenable.ai homepage](https://keenable.ai/) — 來源角色：官方；取用層級：全文；訪問日：2026-08-29
- [What Is Keenable - Independent Web Search for AI](https://keenable.ai/about) — 來源角色：官方；取用層級：全文；訪問日：2026-08-29
- [Keenable Pricing](https://keenable.ai/pricing) — 來源角色：官方；取用層級：全文；訪問日：2026-08-29
- [API reference - Keenable](https://docs.keenable.ai/api-reference) — 來源角色：官方文件；取用層級：全文；訪問日：2026-08-29
- [Rate limits - Keenable](https://docs.keenable.ai/rate-limits) — 來源角色：官方文件；取用層級：全文；訪問日：2026-08-29
- [Quickstart - Keenable](https://docs.keenable.ai/) — 來源角色：官方文件；取用層級：全文；訪問日：2026-08-29
- [Natural conversation, live retrieval: Keenable search with Gradium](https://keenable.ai/blog/natural-conversation-live-retrieval-keenable-search-with-gradium) — 來源角色：官方 blog；取用層級：全文；訪問日：2026-08-29
- [Keenable now runs inside Lightpanda](https://keenable.ai/blog/keenable-now-runs-inside-lightpanda) — 來源角色：官方 blog；取用層級：全文；訪問日：2026-08-29
- [NEEDLE: The benchmark your search engine can't memorize](https://keenable.ai/blog/needle-the-benchmark-your-search-engine-can-t-memorize) — 來源角色：官方 blog；取用層級：全文；訪問日：2026-08-29
- [keenableai/needle](https://github.com/keenableai/needle) — 來源角色：官方 GitHub repo；取用層級：全文 README；訪問日：2026-08-29
- [NEEDLE benchmark dashboard](https://keenableai.github.io/needle/) — 來源角色：官方 benchmark dashboard；取用層級：全文頁面文字；訪問日：2026-08-29
- [Accel-backed Keenable is indexing the web for AI agents](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/) — 來源角色：外部二手報導；取用層級：全文；訪問日：2026-08-29

## 讀取完整度盤點
| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| 官方首頁 | ✅ 全文 | 無 |
| About | ✅ 全文 | 無 |
| Pricing | ✅ 全文 | 無 |
| API reference / rate limits / quickstart | ✅ 全文 | 無 |
| Keenable blog: Gradium / Lightpanda / NEEDLE | ✅ 全文 | 無 |
| GitHub: keenableai/needle README | ✅ README 全文 | 未 clone repo、未重跑 benchmark |
| NEEDLE dashboard | ✅ 頁面方法論文字 | 未抽取動態圖表數值 |
| TechCrunch 報導 | ✅ 全文 | 無 |
| 全網候選搜尋 | 🔴 未完成 | Groundlane `web_search` 回 `PROVIDER_UNAVAILABLE`，本 turn 未改用 legacy/platform search |

## 事實交叉表
| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| Keenable 是面向 AI agents / AI labs 的 web search and content access infrastructure | 官方首頁、About、Docs | TechCrunch 對公司定位的描述 | ✅ |
| 官方宣稱自建 independent web index，規模 100B+ documents | 官方首頁、About | TechCrunch 報導引用同一 claim | ✅ 單一官方 claim，外部未獨立驗證規模 |
| 首頁宣稱 <250ms p95 (US East) | 官方首頁 | NEEDLE/官方 blog 另稱 p50 200ms、目標 p95 200ms；Gradium 文稱 under 200ms | ⚠️ 官方 claim 內部語境不同，未獨立壓測 |
| 一般 Search API 價格是 $4 / 1000 requests | Pricing | API docs 說 authenticated usage draw on credits | ✅ |
| Scale/AI labs 價格是 $1 / 1000 requests at 100 RPS+ | Pricing、首頁 | TechCrunch 說成本是商業重點但未列價格 | ✅ 單一官方價格 |
| 每月 100K free requests | Pricing | Rate limits docs 說 authenticated usage draws on 100,000 requests/month free allowance | ✅ |
| Keyless public endpoints 存在，限 1,000 req/hour + 10 req/sec per IP | API reference | Rate limits docs | ✅ |
| API 有 search 與 fetch 兩類 endpoint，並提供 MCP/CLI/REST 三種入口 | API reference、Quickstart | Lightpanda docs 使用 search tool | ✅ |
| Keenable 2026-08-25 出 stealth，seed $26M，Accel 領投，Conviction Partners 和 angels 參與 | TechCrunch | Keenable 官方 blog 摘要/轉載 TechCrunch | ⚠️ 報導為外部二手；官方 blog 不是獨立來源 |
| CEO Andrey Styskin 曾領導 Yandex search/AI/cloud；共同創辦人 Matthias Petri 是 AI scientist | TechCrunch | 官方首頁列 co-founder titles | ✅ 背景細節主要來自 TechCrunch |
| 團隊約 15 engineering staff，計畫年底 doubling headcount | TechCrunch | 官方 about/careers 僅說 hiring | ⚠️ 單一二手來源 |
| Gradium partnership / Lightpanda integration 是公開 adoption 訊號 | 官方 blog、docs | TechCrunch 提到 Gradium partnership | ✅ |
| NEEDLE 是 Keenable 建的 live open-source benchmark，GitHub repo、dashboard、HF artifacts 公開 | NEEDLE blog、GitHub README、dashboard | 無外部獨立評測 | ✅ 其存在與方法可驗證；分數可信度仍需審查 |

## 我的推論（與上表分開）
| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| Keenable 的核心賭注是「agentic search 會變成獨立基礎設施市場」 | 官網、About、NEEDLE 文、TechCrunch 都把人類搜尋 vs agent 搜尋當成差異 | 如果 Google/Bing/Brave/Exa 很快提供足夠便宜且 agent-optimized 的 API，獨立 index 的優勢可能被壓縮 |
| 它更像 search infrastructure vendor，不是 Perplexity 類 end-user answer engine | API/MCP/CLI/REST 文件、定價、目標客戶是 AI labs/inference platforms | 未實測 API 的 response quality，可能產品也會往應用層延伸 |
| 最大亮點是 keyless/public endpoint + Lightpanda fallback，能降低 agent 工具預設可用性的摩擦 | API docs、rate limit docs、Lightpanda integration docs | keyless pool 是 per-IP shared，production 仍需 key；可用性可能受 abuse/control 影響 |
| 最大風險是品質與 benchmark 由自家主導，外部驗證不足 | NEEDLE 為官方 repo/dashboard；dashboard 承認 LLM judge 尚未做系統性 human-agreement audit | 開源 artifact 允許外部重跑，如果社群審查增加，可信度會提高 |

## 草稿骨架

### 核心概念
Keenable.ai 是給 AI agents 使用的 web search / content access infrastructure。它的基本判斷是：傳統搜尋是為人類掃標題、點連結、讀頁面設計；agent 搜尋則是在推理迴圈中高頻、低延遲、連續改寫 query，並需要直接拿到可處理的 snippet/content。因此 Keenable 想提供自有 web index、search API、fetch API、CLI、MCP server，以及 keyless public endpoint，讓 agent 在沒有額外搜尋供應商 key 的情況下也能查網路。

### 關鍵設計決定
第一個設計決定是自建 independent index，而不是單純 federate 其他搜尋 API。Keenable 的說法是：如果不擁有 index，就只能 rerank 別人的結果，不能改善 coverage、latency 或 agent-specific retrieval。

第二個設計決定是把 MCP 當 agent 的推薦入口。官方 quickstart 明確說 REST 是 first-class，但 agent 使用 MCP 比較順，因為模型可直接拿到工具。

第三個設計決定是提供 keyless public endpoints。這讓 CLI、MCP、Lightpanda integration 在沒有 API key 時仍可回傳 `{title, url, snippet}` 類搜尋結果，但 public pool 有 per-IP 限制，不適合 production。

### 跟替代方案的比較
Keenable 對標的是 Google/Serper、Bing/SearchAPI、Brave Search API、Exa、Tavily、Parallel、Perplexity 等 search/search-for-AI 供應商。它自己的差異化說法是：自有 index、面向 agentic query、低延遲、可從 agent traffic 中持續學習。這些方向合理，但目前大多是官方 claim；NEEDLE benchmark 是好的透明化動作，但仍需外部重跑與審查。

### 適合 / 不適合的情境
適合：agent runtime 需要大量 search calls、希望走 MCP/CLI 快速接入、需要低延遲 live retrieval、想避免單一 Google/Bing 依賴、或要在沒有搜尋 key 的工具鏈裡提供 fallback search。

不適合：需要已被市場長期驗證的 search quality SLA、需要完全中立 benchmark、需要非常清楚的 enterprise 合規/資料處理承諾，或 search volume 還很小且現有 Brave/Exa/Tavily 已足夠。

### 限制 / 已知問題
1. 搜尋品質未做本地實測。
2. 100B+ documents、latency、production customers 多為官方或報導引用官方 claim。
3. Benchmark 開源但由 Keenable 自己運營；dashboard 承認 LLM judge 尚未做系統性 human-agreement audit。
4. Keyless public pool 是 shared per-IP，不能當穩定 production quota。
5. 客戶名稱多未公開；TechCrunch 說已在多個 AI labs/inference providers production 使用，但公司未透露客戶。

### 取捨總結
Keenable 值得關注，尤其是你在做 agent runtime、browser agent、MCP toolchain 或 search abstraction。它抓到的問題是真的：agent 查網路和人類查網路不是同一個 workload。但目前比較像「有強團隊和清楚 thesis 的早期 infrastructure startup」，不是已經被獨立證實能取代 Google/Brave/Exa/Tavily 的成熟答案。建議下一步不是先寫結論文，而是拿相同 query set 實測 Keenable、Brave、Exa、Tavily、Serper/Google 的 latency、coverage、snippet usefulness、error rate。

## 待解問題
- 實測 Keenable API：same query set 對照 Brave/Exa/Tavily/Serper。
- 查公開公司登記、投資方公告、創辦人 LinkedIn/X/GitHub，補團隊背景交叉驗證。
- 抽取 NEEDLE dashboard 的實際 7-day leaderboard 數字，並抽樣審查 raw artifacts。
- 檢查 API response schema、fetch content quality、robots/ToS/資料來源政策。
- 評估是否適合 quidproquo/agent-tooling 自己的 web research provider matrix。
