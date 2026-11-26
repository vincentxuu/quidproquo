---
title: "AI Agent 接搜尋 MCP 工具：當 WebFetch / WebSearch 被擋的時候"
date: 2026-05-07
category: ai
tags: [mcp, search, web-search, tavily, firecrawl, exa, bocha, claude-code, agent]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 1
type: guide
tldr: "用 Claude Code、Cursor 等 AI agent 時，內建 WebFetch / WebSearch 常被 Cloudflare、地理限制或 rate limit 擋住。接一個 search MCP server 是最直接的解法，這篇比較 2026 年實際能用的選項。"
description: "比較 AI agent 可以接的搜尋類 MCP server：Tavily、Firecrawl、Exa、Linkup、Brave、博查、Bright Data 等，標註各自的場景與限制。"
draft: false
---

用 Claude Code、Claude Desktop、Cursor 跑 agent 任務時，內建的 WebFetch / WebSearch 常碰壁：Cloudflare 擋 bot、地理限制（WebSearch 只在 US 可用）、authenticated 頁面拿不到、rate limit、回傳格式對 LLM 不友善。最直接的解法是接一個 search MCP server，把搜尋這層交給專門服務。這篇按場景整理 2026 年可用的選項，每家都標註 MCP 支援與適用情境。

## 為什麼要換 MCP 而不是直接用內建工具

內建 WebFetch / WebSearch 的限制大致是：

- **WebSearch 地理限制**：Anthropic 的 web search 只在 US 區域可用
- **WebFetch 擋 bot**：Cloudflare、Akamai、Datadome 直接 403
- **拿不到結構**：HTML → markdown 後丟掉了排序、引用、metadata
- **沒有快取與配額控制**：每次都打全量
- **無法跨搜尋引擎**：拿不到 Bing、百度、中文索引

Search MCP server 補的就是這幾塊：專業反爬、結構化 SERP、引用、配額、跨地區索引。

## Tavily

最主流的 agentic search MCP，原生整合 LangChain / LlamaIndex，回傳結果已做排名與摘要、附引用，直接餵給 LLM 不用清洗。官方提供 `tavily-mcp`，安裝即用。

2026 年 2 月被 Nebius 收購（交易金額未公開），現屬 Nebius AI cloud platform，但品牌與既有 API 維持運作。月活 SDK 下載超過 300 萬，IBM、Cohere、Groq 是客戶。

定價：免費層 1,000 credits/月，付費從 $30/月起，每 credit $0.008，100K 頁約 $800。

適合：通用 agent 整合、想直接拿乾淨結果、不想自己清洗 SERP。
不適合：大規模爬全文、極度成本敏感的批次任務。

## Firecrawl

定位偏向「LLM-ready 的爬蟲與搜尋索引」，把網頁轉成乾淨 Markdown，再以策展索引（新聞、研究、金融、政府）做搜尋來源。**核心開源、可自架**，這對 self-hosted MCP 很友善。官方有 `firecrawl-mcp`。

定價：Standard $99/月（年繳 $83）含 100K credits，1K 搜尋約 $1.66、1K 頁面提取約 $0.83。免費方案每月 1,000 credits（約 500 次搜尋或 1,000 頁），不用綁卡。100K 頁約 $83，是 Tavily 的十分之一。舊的 `/extract` 端點 2026-12-10 移除，結構化抽取改用 `/v2/scrape` 的 JSON 格式，多頁或要先搜尋的任務改用 `/v2/agent`。

適合：要爬全文塞進 RAG、預算敏感、合規要求自架。
不適合：要即時 SERP、要語義搜尋。

## Exa

Exa 強在 neural / similarity search，「給我跟這個 URL 或這段文字語意相近的網頁」。其他家多半是 keyword + ranker，沒有 Exa 那種以 embedding 索引整個網頁的能力。官方 `exa-mcp-server` 暴露 search、find similar、get contents 三種工具，agent 可以做 hybrid 用法。

2026 年它已經不只是「語意搜尋那一家」，而是把深度攤成多段延遲讓你自己挑。2026-10 推出 Exa 3.0 後，官方推薦的只剩 `lite`、`auto`、`deep` 三種，`instant`、`fast`、`deep-reasoning` 標為 legacy，舊程式仍可呼叫：

| type | 延遲 | 適用 |
|---|---|---|
| `lite` | 只讀快取，最快 | 對話、語音等即時場景；參數受限 |
| `auto` | ~1s | 預設，品質與速度平衡 |
| `deep-lite` | 4s | 輕量綜整輸出 |
| `deep` | 4-15s | 多步推理 + 結構化輸出 |
| `instant`／`fast`（legacy） | ~250ms／~450ms | 舊的低延遲選項，新程式改用 `lite` 或 `auto` |
| `deep-reasoning`（legacy） | 12-40s | 舊的最高深度，新程式改用 `deep` |

另外 `output_schema` 可以搭配任一 search type 直接吐符合 JSON Schema 的結構化結果，`category` 能鎖定 company（5,000 萬筆公司頁）、people（10 億筆）、publication（3.5 億筆學術出版品）等垂直領域。

定價（2026-11-23 查詢）：`auto`／`fast` $7 / 1,000 次、`lite` 與 `instant` $4、`deep` 與 `deep-lite` $12、`deep-reasoning` $15，頁面內容與 AI 摘要各 $1 / 1,000 頁。免費層註冊給 $10（最多約 2,500 次 `lite` 搜尋），每月 1 日把免費餘額重設回 $10，完成 onboarding 另送一次 $10。

適合：找關聯內容、競品研究、語意推薦、需要結構化輸出的研究任務。
不適合：純 keyword SERP、預算敏感的高頻 query。

## Linkup

歐洲（法國）團隊，伺服器在歐盟，主打 GDPR 合規。搜尋深度分 `fast`、`standard`、`deep`，2026-09 另推出延遲低於 200ms 的 `flash`（alpha）。MCP server 由官方維護。

定價：2026-05 起改用美元計價，`standard` 搜尋每次 $0.005（約 $5 / 1,000 次），`deep` $0.05；符合資格的帳號每月把免費餘額補回 $20。

適合：客戶或法規要求歐盟資料邊界、做 B2B 公司情報、想要可預測單價。
不適合：英文以外資源、以中國或亞洲市場為主的場景。

## Brave Search（注意：免費方案已取消）

獨立索引、不記錄 query。官方有 `brave-search-mcp`，agent 接過去就能用。

**2026 年 2 月取消獨立免費方案**：改成每個方案每月套用 $5 credit（Search 約 1,000 query；Search、Answers 等四個方案合計最多 $20），註冊要綁卡並預付。Search 各類型都是 $5 / 1,000 query。改版公告曾要求在自家網站標示 Brave Search 才能拿免費 credit，但 2026-09 更新的服務條款把歸屬標示寫成可選，申請前以 dashboard 的現行條件為準。

適合：醫療、法律、金融等隱私敏感、且願意付費。
不適合：原本想靠免費層撐起小專案，請重新估算。

## 博查（Bocha）

中文場景目前最務實的選擇。中國境內可達、中文索引品質高，是 DeepSeek 的官方搜尋供應方，阿里、騰訊、字節跳動也在用，官方宣稱承載中國 60% 以上的 AI 應用搜尋請求。提供 Search API 與 Rerank API。MCP 部分有官方 `bocha-search-mcp`，社群也有 `yoko19191/bocha-ai-mcp-server`。

適合：產品主要服務中國使用者、做中文 RAG / chatbot、需要在中國境內部署。
不適合：英文研究類應用、跨境合規嚴格的場景。

## Bright Data

企業級資料抓取老牌，賣點是無並發上限、即時抓 Google / Bing / Yandex / Yahoo、Web Unlocker 處理反爬、按成功計費。官方 MCP server 把 SERP API + Web Unlocker + Browser API 都包進來，是少數能解掉「Cloudflare / Datadome 擋 agent」這個痛點的選項。

適合：日均上百萬量級的 query、會碰到反機器人擋路、要拿完整 SERP 結構。
不適合：原型階段、月用量在 10K 以下。

## Serper / SerpAPI

兩家都是「便宜的 Google 結構化結果」，差在 Serper 更便宜（$1.00 / 1,000 query 起，量大可到 $0.30）但只給 SERP 摘要與連結；SerpAPI 比較貴但結構化欄位最完整（知識面板、廣告、featured snippet）。社群都有對應 MCP server。

適合：只需要 Google 排序結果做下游 reranking、要拿結構化欄位做分析。
不適合：要全文內容（還要再串爬蟲）、要語義搜尋。

## 對照速查

| 場景 | 推薦 MCP |
|------|------|
| 通用 agent + 想直接拿乾淨結果 | Tavily |
| 要爬全文塞 RAG、預算敏感、要自架 | Firecrawl |
| 找語意相似內容 | Exa |
| 歐盟合規、可預測單價 | Linkup |
| 大規模爬取 + 反爬突破 | Bright Data |
| 隱私敏感、可付費 | Brave Search |
| 中文場景、中國境內部署 | 博查 |
| Google 結構化欄位 | SerpAPI / Serper |

## 在 Claude Code / Claude Desktop 裡接 MCP

以 Tavily 為例，`~/.claude.json` 或 Claude Desktop 的 `claude_desktop_config.json` 裡加：

```json
{
  "mcpServers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp"],
      "env": { "TAVILY_API_KEY": "tvly-xxx" }
    }
  }
}
```

換成 Firecrawl、Exa、Brave、博查同樣的模式，差別在 package 名與環境變數。Claude Code 也支援 `claude mcp add` 直接設定。

## 整體來說

接 search MCP 的價值不只是「補上一個工具」，而是把 agent 從「依賴內建 WebFetch / WebSearch、被各種防護機制隨機擊穿」變成「有穩定的搜尋層、可控配額、可追蹤引用」。

實務上比較合理的組合是 **主力一家 + 備援一家** 並用 feature flag 切換：

- 通用：Tavily（主）+ Firecrawl（爬全文）
- 中文為主：博查（主）+ Serper（英文補充）
- 研究 / 推薦：Exa（語義）+ Tavily（一般 query）
- 反爬重災區：Bright Data（單獨）

押單一供應商在 2026 年這個市場速度下風險偏高，多串一家備援花不了多少時間。

這篇談的全部是雲端 API——每次查詢都經過對方伺服器、按次計費。如果你的考量是不想被限額，或查詢內容不能外流，同系列下一篇處理另一半：[Tavily 和 Exa 不能自己架：要怎麼自己組一套](/posts/ai/2026-08-21-self-hosted-search-stack)。

## 更新紀錄

- 2026-11-23：依官方頁重查各家定價。Tavily 收購金額改為「未公開」（Nebius 新聞稿與 SEC 文件都未揭露）；Firecrawl 免費額度更正為每月 1,000 credits，並註明 `/extract` 將於 2026-12-10 移除；Exa 依 3.0 改版更新 search type（新增 `lite`，`instant`／`fast`／`deep-reasoning` 轉 legacy）與免費額度；Linkup 改為美元計價並補 `flash`；Brave 刪去查無來源的「舊免費戶 2,000 query」與「最高 $30」，歸屬要求改寫為現況；Serper 單價改為官網現價。
- 2026-08-21：重寫 Exa 一節。原文只把它描述成「語意搜尋那一家、keyword 有點貴」，但 Exa 現在提供六種 search type（`instant` ~250ms 到 `deep-reasoning` 12-40s）、`output_schema` 結構化輸出與 company / people / publication 等垂直分類，定價也已公開到單項費率，原本的描述不足以拿來選型。另修正 Firecrawl MCP server 的 GitHub org（`mendableai` → `firecrawl`）。其餘各家的定價仍為 2026-05-07 查詢值，未重新驗證。

## 參考資料

- [Model Context Protocol 官方文件](https://modelcontextprotocol.io/)
- [Anthropic: Claude Code MCP 設定](https://docs.claude.com/en/docs/claude-code/mcp)
- [Tavily MCP server](https://github.com/tavily-ai/tavily-mcp)
- [Firecrawl MCP server](https://github.com/firecrawl/firecrawl-mcp-server)
- [Exa MCP server](https://github.com/exa-labs/exa-mcp-server)
- [Exa Pricing](https://exa.ai/pricing?tab=api) — 2026-11-23 查詢的費率與免費層
- [Exa 3.0](https://exa.ai/blog/exa-3) — `lite` 上線與 search type 調整
- [Exa Search API Guide](https://exa.ai/docs/reference/search-api-guide) — search type 與 output_schema
- [Brave Search MCP server](https://github.com/brave/brave-search-mcp-server)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing)
- [Firecrawl Extract 移除公告](https://docs.firecrawl.dev/features/extract)
- [Linkup Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Brave Search API](https://brave.com/search/api/)
- [Serper](https://serper.dev/)
- [Bocha Search MCP](https://github.com/BochaAI/bocha-search-mcp)
- [Bright Data MCP](https://github.com/luminati-io/brightdata-mcp)
- [Nebius announces agreement to acquire Tavily](https://nebius.com/newsroom/nebius-announces-agreement-to-acquire-tavily-to-add-agentic-search-to-its-ai-cloud-platform)
- [Top 5 Exa Alternatives for AI Web Search (Firecrawl Blog)](https://www.firecrawl.dev/blog/exa-alternatives)
- [Brave Kills Free Search API Tier (Implicator.ai)](https://www.implicator.ai/brave-drops-free-search-api-tier-puts-all-developers-on-metered-billing/)
- [博查 AI 開放平台](https://open.bochaai.com/)
