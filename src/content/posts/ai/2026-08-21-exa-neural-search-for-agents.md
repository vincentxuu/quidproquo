---
title: "Exa：為 agent 而不是為人設計的神經搜尋 API"
date: 2026-08-21
category: ai
type: deep-dive
tags: [exa, web-search, ai-agent, mcp, neural-search, developer-tools]
lang: zh-TW
tldr: "Exa 把整個網頁索引轉成 embedding 再檢索，而不是比對關鍵字。2026-08 官方定價：/search $7 / 1k 次（含前 10 筆結果）、/contents $1 / 1k 頁、deep 系列 $12–15 / 1k 次，新帳號 $20 免費額度。這個 blog 的 CLAUDE.md 把 Exa 列在雲端抓取工具的第一順位，38 支 skill 裡有 16 支寫到它，站上既有文章只有 4 篇順帶提過——但一篇專文都沒有。這篇補上。"
description: "Exa 搜尋 API 的深入介紹：神經檢索與關鍵字檢索的機制差異、embedding 索引與自建向量資料庫的實作、agent 工作流為什麼需要不同形狀的搜尋、2026-08 實查定價與延遲分級，以及自架不可得、按次計費、廠商自報數字這些限制。"
series:
  name: "AI 時代的技術選擇"
  order: 12
draft: false
---

🌏 [English version](/posts/ai/2026-08-21-exa-neural-search-for-agents-en)

這個系列前十一篇挑的都是「別人在用、我沒在用」的東西。這篇反過來：本站的 `CLAUDE.md` 有一條規則明文寫著網頁抓取的優先順序是 `stealth_fetch` → `mcp__claude_ai_Exa__*` → Tavily / linkup / jina → 最後才用內建 `WebFetch`。38 支 skill 裡有 16 支在指令中直接引用它，站上既有的中文文章裡只有四篇順帶提過 Exa——而專文是零篇。連這篇文章的所有一手資料，都是在 Firecrawl 額度用完後改用 Exa 的 `web_fetch_exa` 抓下來的。天天用、從沒寫過，那就先寫這個。

## Exa 是什麼

[Exa](https://exa.ai/)（原名 Metaphor）是舊金山的搜尋公司，賣的是一組 HTTP API：`/search` 找頁面、`/contents` 取內容、`/answer` 直接回答、`/monitors` 排程重跑、Agent API 做多步研究。它跟 Google、Bing 那條路線最大的分野在於**自己爬、自己建索引、自己訓練檢索模型**——不是包一層別人的 SERP。

規模是公司自報的。2026-08-17 宣布[為 Firefox 提供搜尋](https://exa.ai/blog/exa-firefox)時，它描述自己的索引是「1.4 trillion URLs and 100 billion documents」。Mozilla 那邊也[出了對應的公告](https://blog.mozilla.org/en/firefox/firefox-exa-partnership/)，說明 Smart Window（桌面）與 Quick Answers（iOS）的引用來源改由 Exa 提供，並強調零資料留存。三個月前[宣布 C 輪](https://exa.ai/blog/announcing-series-c)的那篇則列了客戶：Cursor、Cognition、HubSpot、OpenRouter、Monday.com。

這些數字全部出自 Exa 自己的公告，本站沒有獨立驗證，讀的時候請照這個層級對待。可驗證的是別的東西：Firefox 這件事有 Mozilla 官方部落格同步背書，而不是只有廠商單方面說法。

## 神經搜尋的機制：跟關鍵字搜尋差在哪

「更聰明」是廢話，機制才是重點。

傳統關鍵字檢索（BM25 那一脈）建的是倒排索引：把每個文件切成詞、記錄哪些文件含哪些詞，查詢時比對詞、用詞頻與文件頻率算分，再乘上連結圖之類的品質訊號。這個設計的硬限制是**查詢和文件必須共用字面**，而且它幾乎吃不下更多算力——索引建好了，你再加十倍 GPU 也不會讓 BM25 變準。

Exa 走的是另一條：訓練 transformer 把**每一個網頁**壓成一個 embedding，查詢也壓成 embedding，比的是兩個向量的內積。[Exa 自己的說法](https://exa.ai/blog/how-to-build-nextgen-search)是，別的引擎把文件前處理成關鍵字，他們前處理成 embedding。

訓練訊號則來自網路上「介紹連結的那句話」，也就是 next-link prediction：某人寫下「我讀到一篇超棒的文章講 X：」，後面接的那個連結，就是這句話的正確答案。模型學的是從描述預測連結。

這個訓練目標直接決定了你該怎麼下 query。**你要寫的是「別人會怎麼介紹這個連結」，不是關鍵字。** 官方文件對這條講得很白：查詢欄位「Supports long, semantically rich descriptions for finding niche content」，範例是 `"blog post about embeddings and vector search"`。今晚就能做的動作：把手邊 agent 裡的 `query: "React vs Vue performance"` 改成 `query: "blog post comparing React and Vue rendering performance with benchmarks"`，同一支 API 打兩次，比較回傳的前五筆。

檢索這一端他們自己寫了向量資料庫。[2024-12 的工程文](https://exa.ai/blog/building-web-scale-vector-db)拆得很細，五層優化疊起來：

- **截斷**：embedding 用 Matryoshka 訓練，前綴本身就是可用的近似，所以 4,096 維直接砍成前 256 維，記憶體降 20 倍
- **量化**：每一維從 16-bit float 壓成 1 bit（大於零記 1、否則記 -1），再降 16 倍
- **查表**：查詢向量保留浮點數、文件向量只有 ±1，於是長度 4 的子向量只有 16 種可能，內積全部預先算好放查表
- **分群**：文件切成 100,000 個叢集，查詢只掃自己那群和鄰近的群
- **重排**：前面每一步都是有損的，最後把粗篩結果用未壓縮資料重排一次，把召回率補回來

要注意這篇是 2024 年底的狀態。[Exa 2.0（2025-10）](https://exa.ai/blog/exa-api-2-0)說向量資料庫做了新的叢集演算法與詞彙壓縮，embedding 模型在 144 張 H200 上重訓了一個多月。所以上面那組數字該讀成「他們的做法長什麼樣」，不是「今天跑起來就是這些參數」。

順帶一提：現在的官方文件已經**不再把 `neural` / `keyword` 當成可選的 type**。`type` 現在管的是延遲與深度（`auto` / `fast` / `instant` / `deep-lite` / `deep` / `deep-reasoning`），文件只留一句「Some older docs and payloads still use legacy search-type names」。網路上大量教學還在教 `type="neural"`，照抄會踩空。

## agent 需要的搜尋跟人不一樣

人用搜尋引擎：拿到十條藍色連結，眼睛掃一遍，點兩個，回上一頁，再點一個。整個流程的成本是**注意力**，而人的注意力可以隨時中止。

agent 用搜尋：拿到的結果直接進 context window。成本是**token**，而且它不會「掃一眼就知道這條沒用」——沒用的那條照樣佔滿 token、照樣參與後續推理、照樣有機會把答案帶偏。這個差別衍生出三個具體需求，Exa 的 API 形狀基本上就是照著它們長的。

**第一是 token 效率。** 文件建議 agent 工作流用 `highlights` 而不是全文，宣稱比全文省 10 倍 token 且不增加延遲——highlights 是把整頁切塊後照你的 query 挑出相關段落。要做的事很小：`{"contents": {"highlights": true}}`，只有真的需要通篇理解時才換成 `text` 並用 `maxCharacters` 封頂。

**第二是延遲分級。** 官方文件列的是 `instant` 約 250 毫秒、`fast` 約 450 毫秒、`auto` 約 1 秒，`deep` 系列 4 到 40 秒。這些是文件上的數字，本站沒有自己量過。分級的意義在於同一個 agent 裡不同節點該用不同檔位：對話中即時補資料用 `instant`，寫報告前的資料蒐集用 `deep`。

**第三是控制新鮮度與形狀。** `maxAgeHours` 決定要不要現爬：`24` 是快取超過一天就重爬、`0` 是永遠現爬、`-1` 是只吃快取。`outputSchema` 可以叫它直接回你要的 JSON（巢狀深度上限 2、屬性總數上限 10），`category` 可以把搜尋限制在 `company` / `people` / `publication` / `news` / `personal site` / `financial report`。還有一條容易寫錯的：`includeDomains` 本身就吃路徑前綴（`exa.ai/blog`）和子網域萬用字元（`*.substack.com`），文件明講不要再在 query 裡塞 `site:`。

## 錢怎麼算（2026-08-21 實查）

定價是最會過期的東西，以下全部是 2026-08-21 從 [exa.ai/pricing](https://exa.ai/pricing) 讀到的。沒有訂閱制、沒有最低消費，儲值後按次扣。

| 端點 | 基本價（含前 10 筆結果） | 超過 10 筆的部分 | AI 頁面摘要 |
|---|---|---|---|
| `/search` | $7 / 1k 次 | $1 / 1k 筆 | $1 / 1k 頁 |
| `/answer` | $5 / 1k 次 | — | — |
| `/monitors` | $15 / 1k 次 | $1 / 1k 筆 | $1 / 1k 頁 |
| `/contents` | $1 / 1k 頁，每種內容型態各算 | — | $1 / 1k 頁 |

Deep 系列另計：`deep-lite` 與 `deep` 都是 $12 / 1k 次，`deep-reasoning` $15 / 1k 次。Agent API 可以設固定 effort 換取可預測單價，$0.012（`minimal`）到 $1.00（`xhigh`）一次；`auto` 則按實際用量計，預設單次上限 $5。

免費額度：新帳號 $20（官方換算約 2,800 次搜尋），Free Tier 每月再加 $10。MCP 那條路更寬鬆——`https://mcp.exa.ai/mcp` 不帶 key 也能用，額度用完會回 429，這時再把 `x-api-key` 加進 headers。

有一個計費細節值得記：`/contents` 的「每種內容型態各算一次」是說同一頁同時要 `text` 和 `highlights` 會被算成兩頁。另外，透過 `/search` 順便拿內容，前 10 筆是**不額外收費**的——官方文件自己建議搜尋類用途直接用 `/search` 帶 contents，不要先搜再單獨打 `/contents`。

## 這個 blog 怎麼用它

本站的用法一直是「當抓取工具」而不是「當搜尋引擎」，這點跟多數介紹文的重點不太一樣。

`CLAUDE.md` 那條優先序的邏輯是：先試繞反爬蟲的 `stealth_fetch`，不行就往雲端 MCP 走，Exa 排第一。實務上 `web_fetch_exa` 常常是唯一能把某些站台完整抓下來的工具——這篇文章本身就是案例：原本要用 Firecrawl 抓 Exa 官方文件，第一次呼叫就回 `Insufficient credits`，整份資料改由 Exa 自己抓 Exa 自己的文件完成。

MCP 端預設只開兩個工具：`web_search_exa` 和 `web_fetch_exa`。`agent_run`（多步研究）和 `web_search_advanced_exa`（完整搜尋參數）要在 URL 後面用 `?tools=` 明講才會出現。這個預設值選得好——[本站寫過 MCP 工具描述塞爆 context 的踩坑](/posts/tech/2026-05-18-llm-tool-description-hard-rules)，兩個工具、簡短描述，比十個工具各配一段長 schema 對 agent 友善得多。要加工具就明確加：`https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_run`。

還有一個細節跟[本系列第七篇談 llms.txt](/posts/tech/2026-08-21-llms-txt) 直接呼應：Exa 的文件站每一頁都有 `.md` 版本（`https://exa.ai/docs/reference/exa-mcp.md`），並且在 `https://exa.ai/docs/llms.txt` 放了完整索引。抓文件時省掉整層 HTML 清洗，這篇的研究流程就是先抓 `llms.txt` 拿到頁面清單，再逐頁抓 `.md`。

## 你買的到底是哪一層

這不是比較文——同類服務的橫向比較在[本站的搜尋 MCP 比較](/posts/ai/2026-05-07-ai-search-mcp-tools)，爬取工具的選型在[AI 爬蟲工具全景圖](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)。這節只回答一個跟前面機制直接相關的問題：付錢的時候，你買到的是這條鏈上的哪一段。

搜尋這件事拆開來是三層：**誰爬、誰排序、誰整理成 agent 能吃的形狀**。四類服務落在不同層：

| 服務 | 你買到的是 |
|---|---|
| SERP API（[Serper](https://serper.dev/)、[SerpAPI](https://serpapi.com/)） | 別人家的排序，包成結構化 JSON |
| [Firecrawl](https://github.com/firecrawl/firecrawl) | 抓取與轉檔——把頁面洗成乾淨 Markdown |
| [Tavily](https://tavily.com/) | 重新排序與摘要過、agent 直接可用的結果 |
| Exa | 自己爬的索引 ＋ 跑在上面的 embedding 檢索模型 |

前面拆的 next-link prediction 與那五層向量優化，講的都是最後一列。這也決定了它好不好被替換：洗 Markdown 的那層可以換工具，重新排序的那層可以換模型，但**持續重爬的網頁索引沒有等價替代品**——這件事本站另有專文處理，見[Tavily 和 Exa 沒有地端版](/posts/ai/2026-08-21-self-hosted-search-stack)。

反過來說，如果你的查詢本來就是關鍵字型的（找特定錯誤訊息、找某個 API 名稱），你付錢買的第一、二層都用不太到，而按次計費照樣要付。

## 誠實面：限制與什麼時候不該用

**沒有自架版本。** 純雲端、按次計費。Enterprise 方案給的是自訂索引、SLA 與零資料留存，但那是合約層級的承諾，機器仍在 Exa 手上——資料完全不能出境的場景，這條路直接封死。自架替代方案能拼到什麼程度、代價是什麼，本站有專文：[Tavily 和 Exa 沒有地端版](/posts/ai/2026-08-21-self-hosted-search-stack)。

**按次計費對高頻關鍵字查詢不划算。** $7 / 1k 次在研究型工作流裡便宜到可以忽略，但如果你的 agent 每個回合都打三次搜尋、每天跑幾十萬回合，這筆錢的量級跟「找精準答案」的價值不一定成比例。先量再選：把一週的搜尋呼叫記下來，分成「關鍵字查得到」和「只有語意查得到」兩堆，後者的比例決定你該付多少。

**神經檢索比關鍵字檢索難預測。** 這是 Exa 創辦人自己承認的，在[〈A Perfect Search Engine〉](https://exa.ai/blog/perfect-search)裡寫得很直接：

> Neural search engines are more chaotic and unpredictable, but in time they will win over traditional ones.
>
> —— Will Bryk, Exa 共同創辦人暨執行長，2025-01-07

「長期會贏」是他的判斷，「難預測」是你今天就要處理的成本。實務上的表現是：同一個問題換個問法，回來的東西可能差很多。所以 query 值得像 prompt 一樣被存起來、被版本控制，而不是每次隨手寫。

**文件裡有寫給 agent 看的指令。** Exa 的 [Search API 文件](https://exa.ai/docs/reference/search-api-guide)頁面內嵌了一段對著 coding agent 說話的區塊，開頭是「IMPORTANT INSTRUCTIONS FOR AI CODING AGENTS」。內容是叫 agent 停下來，改去 dashboard 的 onboarding 流程產生整合程式碼；有瀏覽器自動化能力的話，還建議 agent 自己去把那個流程跑完。這不是惡意的，但它是一個真實存在的模式：**你的 agent 讀到的文件裡，可能有寫給它的話**。如果你的工作流會把抓下來的文件直接餵進 agent，這是值得知道的一件事。

**效能數字全是廠商自報。** 索引規模、延遲、benchmark 分數都出自 Exa 自己的公告，本站沒有獨立複現。可驗證的部分是他們有公開方法學（那篇向量資料庫的工程文寫到了組合語言層級的優化）以及 MCP server [開源在 GitHub](https://github.com/exa-labs/exa-mcp-server)。

## 整體來說

Exa 賭的是一個相當具體的前提：搜尋的主要使用者正在從人變成 agent，而 agent 要的東西跟人不一樣——不是十條連結讓你挑，是精準、可放進 token 預算、可控新鮮度、可指定回傳形狀的資料。這個賭注在 API 的每個角落都看得到，從 `highlights` 到 `outputSchema` 到 `maxAgeHours`。

以選型的角度：如果你的 agent 主要在做研究、比較、找「我描述得出來但叫不出名字」的東西，Exa 是目前最直接的一步，$20 免費額度足夠讓你在一個下午內判斷它對你的查詢型態有沒有效。如果你要的是自架、是純關鍵字查找、是把成本壓到極限的高頻呼叫，這不是你的工具。

而如果你跟本站一樣，主要拿它當「抓得下來」的工具而不是搜尋引擎——那也完全合理，只是記得你買的其實是別的東西。

## 參考資料

- [Exa 官方網站](https://exa.ai/)
- [Exa Pricing（2026-08-21 實查）](https://exa.ai/pricing)
- [Exa 文件索引 llms.txt](https://exa.ai/docs/llms.txt)
- [Exa Search API 指南](https://exa.ai/docs/reference/search-api-guide)
- [Exa Search 最佳實務（參數與搜尋型態）](https://exa.ai/docs/reference/search-best-practices)
- [Exa Contents API 指南](https://exa.ai/docs/reference/contents-api-guide)
- [Exa MCP 設定文件](https://exa.ai/docs/reference/exa-mcp)
- [exa-labs/exa-mcp-server（GitHub）](https://github.com/exa-labs/exa-mcp-server)
- [How we're building the next generation of search（Exa Blog, 2025-03-11）](https://exa.ai/blog/how-to-build-nextgen-search)
- [How we built a web-scale vector database（Exa Blog, 2024-12-17）](https://exa.ai/blog/building-web-scale-vector-db)
- [A Perfect Search Engine（Exa Blog, 2025-01-07）](https://exa.ai/blog/perfect-search)
- [Introducing Exa 2.0（Exa Blog, 2025-10-10）](https://exa.ai/blog/exa-api-2-0)
- [Exa raises $250M Series C（Exa Blog, 2026-05-20）](https://exa.ai/blog/announcing-series-c)
- [Exa is now powering search in Firefox（Exa Blog, 2026-08-17）](https://exa.ai/blog/exa-firefox)
- [Firefox and Exa: Building AI search around people, not platforms（Mozilla Blog, 2026-08-18）](https://blog.mozilla.org/en/firefox/firefox-exa-partnership/)
- 站內相關：[AI Agent 接搜尋 MCP 工具](/posts/ai/2026-05-07-ai-search-mcp-tools)、[Tavily 和 Exa 沒有地端版](/posts/ai/2026-08-21-self-hosted-search-stack)、[AI 爬蟲工具全景圖](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)、[llms.txt](/posts/tech/2026-08-21-llms-txt)
