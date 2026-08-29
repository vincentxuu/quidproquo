---
title: "Keenable 該放進台灣 Agent 團隊的搜尋備選嗎？"
date: 2026-08-29
category: ai
type: deep-dive
tags: [keenable, web-search, ai-agent, mcp, retrieval, search-api, benchmark]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 14
tldr: >-
  Keenable.ai 把自己定位成給 AI agents 用的搜尋基礎設施：100B+ 文件索引、Search/Fetch API、
  MCP/CLI 入口、100K 免費月額度與 keyless public endpoint。對台灣／繁中 agent 團隊來說，
  現階段最合理的位置是 provider matrix 裡的實測候選；Brave、Exa、Tavily 或 Serper 仍要留著對照。
description: >-
  從台灣／繁中 agent 團隊的選型角度，研究 Keenable.ai 的產品定位、定價、MCP/API 設計、
  Lightpanda/Gradium integration、NEEDLE 評測方法，以及它目前最該被保留的地方。
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-29-keenable-agentic-search-en)

台灣團隊做 agent 產品時，多半不會第一天就自己養 web index。真正會遇到的問題比較務實：搜尋要接 Brave、Exa、Tavily、Serper/Google wrapper，還是要多放一個新供應商進 provider matrix？

每個選擇都會牽動成本、延遲、配額、中文內容命中率和 fallback 設計。

[Keenable.ai](https://keenable.ai/) 正好站在這個問題上。它賣給 AI labs、inference platforms、browser agents、MCP toolchains 的，是可以接進系統裡的 web search / content access layer。給人看的答案頁不是它的主戰場。

官方首頁把主張壓得很直接：100B+ documents、US East p95 低於 250ms。價格頁另列出 scale plan：100 RPS+ 時，每 1,000 requests 從 1 美元起。這些數字先不要急著照單全收。這篇先把問題收窄：Keenable 抓到了一個會變大的 agent 搜尋需求；採用前還需要自己測品質、延遲和繁中召回。

## 先問：你的 agent 真的需要高頻搜尋嗎？

人類搜尋通常是一次 query、掃十個藍色連結、點幾個頁面、自己判斷。Agent 搜尋會在推理迴圈裡連續查詢：先搜一個粗 query，看結果，再把公司名、錯誤碼、日期、`site:` 條件、引用片段塞回下一次 query。這些搜尋可能相隔幾秒，而且會在同一個任務裡重複十幾次。

Keenable 在 [About 頁](https://keenable.ai/about) 的說法是，現在的工具仍然是「人類最佳化」的 web access：傳統搜尋 API 給你連結，fetch API 又慢又貴。它的目標是讓模型把查網路當成接近參數知識的動作：便宜、低延遲、可以高頻放進 reasoning loop。

這個方向合理。只要你真的做過 agent，就會知道「能不能查」只是起點。更麻煩的是：查一次要等多久、snippet 夠不夠讓模型判斷、能不能連續查、是否容易超額。

對繁中產品來說，還要多看一層：搜尋結果能不能穩定找到台灣公司、政府公告、法規文件和台灣媒體。只回英文世界的高權重頁面，很多台灣資料查詢會直接失準。

## 產品邊界：Search、Fetch、CLI、MCP

Keenable 的 [API reference](https://docs.keenable.ai/api-reference) 目前核心只有兩個 endpoint：`/v1/search` 和 `/v1/fetch`。Search 回傳 ranked results，包含 URL、title、description、snippet；Fetch 則把頁面內容轉成 Markdown，附 title、description、author 等資訊。

進入方式有三種：[Quickstart](https://docs.keenable.ai/) 把 MCP 寫成 agent 的推薦路徑。CLI 用來登入、設定本機 agent client，也可以直接從 terminal 搜尋；REST API 則保留給自己接 endpoint 的場景。這個產品分層是對的：模型要的是 tool，系統整合要的是 HTTP，工程師除錯要的是 CLI。

比較特別的是 keyless public endpoint。官方文件說，沒有 API key 時可以打 `/v1/search/public` 和 `/v1/fetch/public`，但要帶 `X-Keenable-Title` 標示應用。public pool 是每 IP 每小時 1,000 requests、最高 10 requests/sec，而且所有同 egress IP 的流量共用。這個設計比較適合 onboarding 和 fallback；production plan 仍然要用 authenticated usage。

## 價格：首頁的 1 美元不是一般入門價

Keenable 的 [Pricing 頁](https://keenable.ai/pricing) 比首頁更清楚：一般 agent builders 是每 1,000 requests 4 美元。AI labs / inference platforms 到 100 RPS+ 規模，才是每 1,000 requests 1 美元。文件也寫明 authenticated usage 有每月 100,000 requests 免費額度；[rate limits](https://docs.keenable.ai/rate-limits) 則是 authenticated tier 預設 10 requests/sec per organization，更高限制要談。

所以讀首頁的「from $1 / 1K requests @ 100 RPS+」時要小心。那是 scale 價，個人或小團隊一開始多半拿不到。對 agent 產品來說，4 美元 / 1,000 requests 不算離譜；若每一步推理都查一次，很快就會變成成本黑洞。搜尋預算、cache、重試、降級策略要一起設計。

## 自有 index 要用召回實測驗證

Keenable 最核心的差異化是 independent web index。[NEEDLE 文章](https://keenable.ai/blog/needle-the-benchmark-your-search-engine-can-t-memorize) 裡的論證很簡單：federate 其他搜尋引擎時，你最多只能 rerank 和改 snippet。coverage 修不了，index 也無法真正從 agent traffic 中學習。

這裡要分開看兩件事。

第一，自有 index 確實是長期 moat 的必要條件之一。Search 的品質不只在 reranker，而在你爬到了什麼、何時更新、如何切 shard、如何召回候選、如何處理罕見 query、如何產生 snippet。Agentic search 如果真的變成高頻 workload，擁有 index 的公司可以針對這種 query 分布重新最佳化。

第二，自有 index 仍要實測。Google、Bing、Brave 也有自己的 index；Exa、Tavily、Parallel 也在不同層做 AI search。Keenable 的 index 有多新、多全、多抗 spam、多懂長尾，需要實測。官方寫 100B+ documents 是一個規模訊號，不是品質保證；對台灣團隊來說，還要另外測繁中、台灣公司名、政府公告和台灣新聞的召回。

## NEEDLE 的價值在方法，不在排名

Keenable 做了一個值得認真看的東西：[NEEDLE](https://keenableai.github.io/needle/)，全名是 News, Everyday, Expert, Deep-tail, and Legal Evaluation。它把 search benchmark 拆成五類：news、finance、scholar、agentic rare、legal。官方說 news hourly 跑，其他 daily 跑。[GitHub repo](https://github.com/keenableai/needle) 公開 query generation、engine clients、scoring、GitHub Actions，run artifacts 也會放到 Hugging Face dataset。

這比只貼一張「我們比較快」的圖誠實很多。NEEDLE 至少讓你知道它怎麼產生 query、怎麼打各家 engine、怎麼算 nDCG@5、recall@K、MRR、latency、index overlap。它也明確說不 fetch page、不 rerank，只評估各 engine 回來的 ranking、title、snippet。

但保留也很明確：這是 Keenable 自己營運的 benchmark。Dashboard 的 methodology 自己承認 LLM judge 還沒有做系統性 human-agreement audit。也就是說，NEEDLE 很適合當「可重跑的線索」，不適合當「市場排名的最後答案」。如果要把它寫進選型結論，應該 clone repo、固定同一批 queries、抽樣看 raw artifacts，至少自己重跑一輪。

nDCG@5、recall@K、MRR 只是表層數字。用研之有物式的研究轉譯來看，真正要問的是：這套評測能不能支撐你的決策？

若你的 agent 需要查台灣法規、繁中技術文件或台灣公司動態，就要自己補一組繁中 query slice。NEEDLE 的公開方法可以借；最後答案要靠自己的 query 和 artifact 審查。

## 採用訊號先當線索，不當採購理由

目前能看到的公開採用訊號有兩個。

第一是 [Gradium partnership](https://keenable.ai/blog/natural-conversation-live-retrieval-keenable-search-with-gradium)。這個 integration 的重點是 voice agent：語音對話裡，一次搜尋停頓幾秒就會破壞節奏。Keenable 的說法是 search under 200ms，讓 live retrieval 可以塞進 conversation budget。這很符合它的低延遲 thesis，但仍然是官方合作文，不能當成獨立壓測。

第二是 [Lightpanda integration](https://keenable.ai/blog/keenable-now-runs-inside-lightpanda)。Lightpanda 是為 automation、crawling、AI agents 做的 headless browser engine；Keenable 文件說它成為 Lightpanda search tool 的 keyless fallback。沒有 Brave、Tavily、Exa key 時，Lightpanda 可以用 Keenable 回 `{title, url, snippet}`，有量才設定 `KEENABLE_API_KEY`。

這個訊號比一般 logo wall 更具體：Keenable 進的是 agent/browser runtime 的預設路徑。限制也要一起看。fallback 可用不等於品質最佳，keyless 可用也不等於 production quota。台灣團隊看到這裡，合理動作是列入候選，既有搜尋供應商先不要拔掉。

## 團隊背景加分，但公司仍早期

[TechCrunch 2026-08-25 報導](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/) 說 Keenable 以 2,600 萬美元 seed round 出 stealth，Accel 領投。Conviction Partners 和 angels 也參與。CEO Andrey Styskin 曾領導 Yandex 的 search、AI、cloud division，也曾在 Amazon 做 search infrastructure；共同創辦人 Matthias Petri 是 AI scientist。報導也提到團隊約 15 名工程人員，計畫年底前擴編。

這些背景足以讓 Keenable 進觀察名單。Search infrastructure 很吃經驗，包一層 API 做不出長期品質。Yandex/Amazon search 背景是加分項。

公司階段仍然早。TechCrunch 說它已在 several AI labs and inference providers production 使用，但客戶未公開。這類「已有大客戶但不能說」在基礎設施公司很常見，只能算風險降低一點的訊號，不能當成採購理由。

## 我會怎麼測

如果我是台灣團隊，正在做 agent runtime、browser agent 或需要繁中內容檢索的產品，我會把 Keenable 放進 provider matrix。既有搜尋供應商先留著，測試可以這樣排：

1. 用同一組 query 跑 Keenable、Brave、Exa、Tavily、Serper/Google。
2. 每個 query 記錄 latency、error rate、是否命中正確來源、snippet 是否足夠讓模型回答。
3. 分開測五類 query：fresh news、long-tail entity、technical docs、operator-heavy search、繁中／台灣來源。
4. 把 keyless public endpoint 只當 onboarding / fallback，不當 production dependency。
5. 如果 NEEDLE 分數要進決策，自己重跑或至少抽樣審查 artifact。

評估 Keenable 時，先不要從「便宜搜尋 API」開始。先問兩個問題。第一，我的 agent 真的需要在任務中高頻查網路嗎？第二，搜尋延遲與 snippet quality 已經影響任務成功率嗎？

如果你只是偶爾查資料，現有的 Brave / Exa / Tavily / Serper 可能已經夠用。

## 結論：先進 matrix，不要押注

Keenable 抓到的 thesis 是對的：AI agents 會把搜尋變成一個和人類搜尋不同的 workload。人類搜尋的最佳化目標是點擊、瀏覽、注意力；agent 搜尋的最佳化目標是低延遲、可組合、可重試、可被模型直接使用的 evidence。

它目前已有可檢查的產品材料：Search/Fetch API、MCP/CLI、keyless public endpoints、價格與 rate limit。NEEDLE repo 和 dashboard 讓 benchmark 至少可被檢查；Lightpanda/Gradium 是具體 integration。

保留也很明確：品質還沒有外部充分驗證，100B+ documents 和 latency 仍多為官方 claim，客戶多未公開，自家 benchmark 也需要第三方重跑。我的結論會是：值得追、值得實測、可以放進 agent 搜尋抽象層；現階段還不能把它當成已經勝出的搜尋基礎設施。

對台灣團隊來說，它現在的位置很清楚：放進 provider matrix、補一組繁中／台灣 query、測 latency 和 snippet quality。測完贏了再提高流量；測不贏，就讓它留在 onboarding 或 fallback。

## 參考資料

- [Keenable.ai](https://keenable.ai/)
- [What Is Keenable - Independent Web Search for AI](https://keenable.ai/about)
- [Keenable Pricing](https://keenable.ai/pricing)
- [Keenable API reference](https://docs.keenable.ai/api-reference)
- [Keenable Rate limits](https://docs.keenable.ai/rate-limits)
- [Keenable Quickstart](https://docs.keenable.ai/)
- [NEEDLE: The benchmark your search engine can't memorize](https://keenable.ai/blog/needle-the-benchmark-your-search-engine-can-t-memorize)
- [NEEDLE benchmark dashboard](https://keenableai.github.io/needle/)
- [keenableai/needle GitHub repo](https://github.com/keenableai/needle)
- [Keenable now runs inside Lightpanda](https://keenable.ai/blog/keenable-now-runs-inside-lightpanda)
- [Natural conversation, live retrieval: Keenable search with Gradium](https://keenable.ai/blog/natural-conversation-live-retrieval-keenable-search-with-gradium)
- [TechCrunch: Accel-backed Keenable is indexing the web for AI agents](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/)
