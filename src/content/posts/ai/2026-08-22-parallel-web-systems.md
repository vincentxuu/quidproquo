---
title: "Parallel Web Systems：Agent 的搜尋、擷取與深度研究層"
date: 2026-08-22
category: ai
type: deep-dive
tags: [parallel-web, web-search, ai-agent, retrieval, deep-research, web-extraction]
lang: zh-TW
tldr: "Parallel Web Systems 把 Search、Extract 與 Task API 分成三個成本與延遲不同的網路存取層，並以 Basis 把引用、摘錄與信心標到輸出欄位。"
description: "拆解 Parallel Web Systems 的 Search、Extract、Task API、引用模型與安全邊界，並和 Exa、Bright Data 比較選型取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-parallel-web-systems-en)

[Parallel Web Systems](https://parallel.ai/) 做的不是一個「幫 LLM Google 一下」的 wrapper，而是一套給 Agent 使用的網路存取層。它有自己的 crawler 與 index，再把工作拆成搜尋、網頁擷取、多步研究，以及持續監控等不同 API。這個拆法很重要：Agent 不該為了找一個官方版本號，每次都啟動昂貴的深度研究。

截至本文截稿，正式產品包含 Search、Extract、Task、FindAll、Monitor 與 Chat API。本文聚焦最常組成 Agent research loop 的前三個。

公司在最新一輪募資中宣布 [1 億美元 Series B、估值 20 億美元](https://www.prnewswire.com/news-releases/parallel-raises-at-2-billion-valuation-to-scale-web-infrastructure-for-agents-302756350.html)，累計融資達 2.3 億美元。

同一份公司新聞稿稱平台有超過 100,000 名開發者使用；這是 Parallel 自己公布的採用數字，不能視為獨立稽核。

## 三層 API 對應三種問題

Parallel 的核心不是單一 endpoint，而是按「你已經知道多少」選層級。

| API | 輸入與輸出 | 適合 |
|---|---|---|
| [Search](https://docs.parallel.ai/search/search-quickstart) | 自然語言 objective 加數個 keyword query，回傳排名 URL 與 LLM-ready excerpts | 找近期事實、候選來源、特定實體 |
| [Extract](https://docs.parallel.ai/extract/extract-quickstart) | 已知 URL，回傳相關摘錄或完整 Markdown；支援 JS 頁面與 PDF | 搜尋後完整讀原文，或處理使用者指定頁面 |
| [Task](https://docs.parallel.ai/task-api/examples/task-deep-research) | 開放問題或結構化輸入，非同步回傳 cited text／JSON | 多跳研究、資料補全、需要跨來源綜合的工作 |

Search 是一個同步 retrieval primitive。`objective` 說明真正要回答的問題與來源偏好，`search_queries` 提供幾個短關鍵詞入口；兩者一起用，比把整段使用者問題直接塞進 query 更可控。結果已附較長 excerpts，所以模型常能先判斷來源價值，再決定是否呼叫 Extract。

Extract 不負責替你找 URL。它把指定公開頁面轉成乾淨 Markdown，可要求和 objective 相關的 excerpts，也可取完整內容。這個分工避免 Search 為每筆結果都抓全文，浪費延遲與 context；需要逐字查證時，再針對少數候選頁升級。

Task 則把搜尋、取文與綜合包成託管 research agent。Deep Research 可花到數十分鐘，適合 webhook、SSE 或 polling，不適合卡在即時聊天 request 裡。它可輸出 Markdown，也能依 JSON Schema 填資料，這正是 Parallel 從「搜尋 API」走向「網路知識工作 API」的地方。

## 最小用法：先 Search，必要時才 Extract

Python SDK 套件名是 `parallel-web`，import 則是 `parallel`。以下流程先找官方與近期來源，再擷取第一筆原文：

```python
from parallel import Parallel

client = Parallel()  # 從 PARALLEL_API_KEY 讀取金鑰

search = client.search(
    objective="確認某套 SDK 最新穩定版，優先官方 release notes",
    search_queries=["SDK release notes", "SDK latest stable version"],
)

candidate = search.results[0]
page = client.extract(
    urls=[candidate.url],
    objective="找出最新穩定版號、發布日期與 breaking changes",
)

print(candidate.url)
print(page.results[0].excerpts)
```

正式環境不要無條件信任 `results[0]`。先依 domain、publish date 與題目需求篩選，保留 Search 回傳的 URL，再讓 Extract 讀取原頁。若 freshness 是硬條件，[進階設定](https://docs.parallel.ai/search/advanced-search-settings)可控制快取年齡與 live fetch；強制 live fetch 會增加延遲，失敗時是否允許回退舊索引也要明確決定。

## Basis 是可追蹤證據，不是真相保證

Task API 的 [Research Basis](https://docs.parallel.ai/task-api/guides/access-research-basis) 會把每個輸出欄位對應到 citations、source excerpts、reasoning 與 confidence。結構化輸出因此可以保留「這一格數字從哪裡來」，不必只在整份報告尾端放一包 URL。陣列元素也能用 beta 功能取得更細的 field basis。

但 citation 只證明系統讀過某頁，不代表那頁可信，也不保證摘錄足以支持改寫後的主張。應把 Basis 當 provenance layer：高風險欄位至少檢查來源是否為一手、摘錄是否真的包含數字與對照條件、不同來源是否彼此獨立。`confidence: high` 是 Parallel processor 的判斷，不是校準到你業務損失函數的機率。

另外，Search 與 Extract 的 excerpts 是經過目標導向壓縮的內容。當任務涉及合約但書、研究限制或價格細則，不要只讀 excerpt；要求 full content，並保留原 URL 供人覆核。

## 網頁內容是不受信任的輸入

Parallel 解決的是取得與整理內容，不會替 Agent 消除 prompt injection。被擷取頁面可能寫著「忽略先前指令」、偽造系統訊息，或誘導 Agent 上傳內部資料。Markdown 變乾淨，不代表內容變安全。

實作上應把網頁資料放進明確的 `untrusted_web_content` 欄位，不要串進 system prompt；搜尋工具只接受 objective 與 queries，不讓頁面文字改寫工具權限。執行動作的 Agent 和研究 Agent 應分權：前者只接收經 schema 驗證的必要欄位，涉及寄信、付款、寫資料庫時再要求人類確認。

URL 也需要政策。阻擋 localhost、私有 IP、雲端 metadata endpoint 與未核准 scheme，避免 Extract 能力變成 SSRF 跳板。API key 放在後端 secrets manager，不交給瀏覽器或模型 context。對合規資料源可用 domain allowlist；對開放研究則不宜過度限制，否則會先把未知但重要的來源排除。

## 跟 Exa、Bright Data 怎麼選

三者有重疊，但起點不同。

| 產品 | 強項 | 優先考慮的情境 |
|---|---|---|
| [Parallel](https://docs.parallel.ai/introduction) | 搜尋、擷取、長時間研究與欄位級 Basis 放在同一產品面 | Agent 要從 retrieval 一路升級到 cited structured research |
| [Exa](https://exa.ai/docs/reference/search) | Search 與 contents API、語意／神經搜尋，介面偏向直接組裝 retrieval | 團隊要自己控制 agent loop，只需要高品質候選頁與內容 |
| [Bright Data](https://docs.brightdata.com/scraping-automation/introduction) | proxy、反機器人處理、SERP、browser、現成 scraper 與 dataset | 難抓站點、地區化存取或大規模資料蒐集本身才是主要問題 |

Parallel 比較像「給模型用的資訊層」，Bright Data 更像「取得網頁資料的網路與蒐集基建」。遇到強反機器人網站時，Bright Data 的 Unlocker 或 Browser API 可能更貼題；已經有自己的 crawler 與 evidence pipeline，則 Exa 或單用 Parallel Search 會比 Task 更透明。不要因為三家都寫了 web，就假設它們能互換。

Parallel 公開的 [BrowseComp 自測](https://parallel.ai/benchmarks)顯示，Turbo 在其 harness 下得到 51% accuracy，搜尋延遲中位數為 216 ms。

同一份測試列出的 Exa Instant accuracy 為 33.7%，搜尋延遲中位數為 361 ms。這是 vendor benchmark：Parallel 選取多次執行中的最佳成績、以 GPT-5.4 同時擔任 agent 與 judge，且不同引擎可用工具並不完全相同。它適合當候選訊號，不該取代你自己的 query set、模型、地區與成本測試。

## 適合、不適合與真正的取捨

Parallel 適合需要近期公開資訊、可追蹤引用、結構化補全或背景深度研究的 Agent。尤其當團隊不想同時維護 crawler、ranking、內容清理、research orchestration 與 evidence mapping，它的整合面能大幅縮短路徑。

它不適合把私有文件檢索當主體的 RAG、需要登入後互動操作的 browser agent，或必須完全掌握 crawl 排程與索引內容的搜尋產品。只查少數固定官方站時，一個受控 HTTP client 加 parser 可能更便宜，也更容易稽核。

最實際的導入方式是分級：預設 Search，只有原文不足才 Extract，只有跨來源綜合才 Task。接著用自己的 100 個真實問題記錄 answer accuracy、citation support rate、p95 latency 與每個成功答案成本。Parallel 的價值不在把所有網路請求包成一個黑箱，而在讓 Agent 能按問題難度逐級花費，並把證據一路帶回你的系統。

## 參考資料

- [Parallel Web Systems 產品首頁](https://parallel.ai/)
- [Parallel Search API Quickstart](https://docs.parallel.ai/search/search-quickstart)
- [Parallel Extract API Quickstart](https://docs.parallel.ai/extract/extract-quickstart)
- [Parallel Task API Deep Research Quickstart](https://docs.parallel.ai/task-api/examples/task-deep-research)
- [Parallel Research Basis](https://docs.parallel.ai/task-api/guides/access-research-basis)
- [Parallel Advanced Search Settings](https://docs.parallel.ai/search/advanced-search-settings)
- [Parallel Quality Benchmarks](https://parallel.ai/benchmarks)
- [Parallel 2026 Series B 公告](https://www.prnewswire.com/news-releases/parallel-raises-at-2-billion-valuation-to-scale-web-infrastructure-for-agents-302756350.html)
- [Exa Search API](https://exa.ai/docs/reference/search)
- [Bright Data Web Access APIs](https://docs.brightdata.com/scraping-automation/introduction)
