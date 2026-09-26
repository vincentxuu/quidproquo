---
title: "定價追蹤｜Perplexity 今天讓 Sonar API 退場，改用「Token＋工具呼叫」計價的 Agent API"
date: 2026-09-27
category: daily
lang: zh-TW
type: digest
tags: [ai-agent, pricing, daily, perplexity]
description: "Perplexity 官方文件確認：2026-09-27 起 Sonar Chat Completions 停止支援，改用 Agent API。計價方式從「每次查詢固定請求費＋固定 token 價」換成「模型 token 價＋每次工具呼叫費」，同樣用量下多數情境成本降五到八成，但 Sonar Pro／Reasoning Pro 沒有直接對應的新模型可切換"
tldr: "Perplexity 官方定價文件與遷移指南確認：2026-09-27 起 Sonar Chat Completions API 停止支援，全面轉為 Agent API。舊制 Sonar 系列是「模型 token 價＋依搜尋深度分級的固定請求費（每千次 $5～$12）」，新制 Agent API 是「第三方模型 token 價（如 gpt-5.6-luna input $0.20／1M）＋每次工具呼叫費（web_search $0.0025、fetch_url $0.0005）」。以官方給的代表性用量估算，Sonar → fast 對應成本降約 49%，Sonar Pro → low 降約 84%，Sonar Reasoning Pro → medium 降約 71%；但 sonar-pro／sonar-reasoning-pro 在多數第三方閘道上直接停止可路由，只有基礎 sonar 模型會自動搬到 Agent API，其他分級都得改用新的 preset 系統手動遷移。"
series:
  name: "AI Pricing Watch"
  order: 11
---

> 🌏 [English version](/en/posts/daily/2026-09-27-pricing-perplexity-sonar-api-sunset-en)

## 變更摘要

Perplexity 從 8 月 13 日就在 API 文件裡掛出遷移橫幅，今天（2026-09-27）是官方寫死的停用日：Sonar Chat Completions 的 `sonar`、`sonar-pro`、`sonar-reasoning-pro`、`sonar-deep-research` 全部改用 Agent API 接手，且不是單純換個網址——計價骨架整個換了。舊制是「模型 token 價 + 依搜尋深度分三級（low／medium／high）收的固定請求費」，新制是「你自己選的第三方模型 token 價 + 每次工具呼叫（web_search／fetch_url／sandbox 等）各自計費」。基礎 `sonar` 模型會被自動搬進 Agent API 的模型清單、維持相容的呼叫方式，但 Pro／Reasoning Pro／Deep Research 這幾個分級在 Agent API 裡沒有同名模型，官方給的是「用哪個 preset 效果相近」的對照表，要遷移就得改寫成新的 request／response 格式。

## 前後對照

依 Perplexity 官方遷移指南給的「Sonar 分級 → Agent API preset」對照，換算成同樣代表性用量下的實際單價：

| 項目 | 舊（Sonar API） | 新（Agent API） | 變化 | 生效日 |
|---|---|---|---|---|
| Sonar → `fast` preset｜模型 | sonar（Perplexity 自家） | openai/gpt-5.6-luna | 換模型 | 2026-09-27 |
| Sonar → `fast`｜Input | $1.00/1M tokens | $0.20/1M tokens | ↓80% | 2026-09-27 |
| Sonar → `fast`｜Output | $1.00/1M tokens | $1.20/1M tokens | ↑20% | 2026-09-27 |
| Sonar Pro → `low` preset｜Input | $3.00/1M tokens | $0.20/1M tokens | ↓93% | 2026-09-27 |
| Sonar Pro → `low`｜Output | $15.00/1M tokens | $1.20/1M tokens | ↓92% | 2026-09-27 |
| Sonar Reasoning Pro → `medium` preset｜Input | $2.00/1M tokens | $0.20/1M tokens | ↓90% | 2026-09-27 |
| Sonar Reasoning Pro → `medium`｜Output | $8.00/1M tokens | $1.20/1M tokens | ↓85% | 2026-09-27 |
| 搜尋深度固定請求費 | 每 1,000 次 $5（low）／$8（medium）／$12（high） | 取消，改按實際呼叫的工具計費 | 結構改變 | 2026-09-27 |
| Web Search 工具呼叫 | 已內建於請求費中 | 每 1,000 次 $2.50（`web_search`） | 拆出來單獨計費 | 2026-09-27 |
| URL Fetch 工具呼叫 | 不適用（Sonar 沒有這個工具） | 每 1,000 次 $0.50（`fetch_url`） | 新增項目 | 2026-09-27 |

`fast` preset 的 output 看起來漲了 20%，是因為它換到的是 OpenAI 最輕量模型 gpt-5.6-luna，token 價結構本身跟 Sonar 不同——但因為工具呼叫費比舊的固定請求費便宜很多，整體單次查詢成本仍是降的（見下）。

## 成本試算

**場景**：一個做網頁研究、每天處理 10,000 次查詢的 Agent，過去用 Sonar Pro（平均每次查詢 2,000 input + 1,000 output tokens，搜尋深度設 medium，對應請求費 $8/1,000 次），遷移後改用官方對照表建議的 `low` preset（同樣的 token 量，1 次 `web_search` + 1 次 `fetch_url`）。

| | 舊（Sonar Pro，medium 深度） | 新（Agent API `low` preset） | 差額 |
|---|---|---|---|
| 單次 token 成本 | $0.021 | $0.0016 | -$0.0194 |
| 單次工具／請求費 | $0.008（固定請求費） | $0.0030（web_search + fetch_url） | -$0.0050 |
| 單次總成本 | $0.029 | $0.0046 | -$0.0244（↓84%） |
| **每月成本（10,000 次/日 × 30 天）** | **$8,700** | **$1,380** | **-$7,320（↓84%）** |

同樣的算法套到 Sonar → `fast`（降約 49%）和 Sonar Reasoning Pro → `medium`（降約 71%），降幅都很可觀，但幅度差很大——`low` 這一級降最多，是因為 Sonar Pro 的 token 價（$3/$15）本來就比 Agent API 預設的輕量模型（$0.20/$1.20）貴一個量級，而工具呼叫費（$0.0025+$0.0005）又遠低於舊制固定的請求費。Sonar Deep Research 對應的 `high`／`xhigh` preset 因為牽涉的 sandbox、多輪搜尋次數官方沒有公開足夠的代表性用量數據，本文不強行套算,但官方遷移指南自己的說法是「常常比 Sonar Deep Research 每次請求成本更低」。

## 對開發者/企業的影響

### 誰最受益、誰受衝擊最大

用 Sonar Pro／Reasoning Pro 做中高頻搜尋型 RAG 應用的團隊受益最大——這兩級的 token 價本來就偏貴，換成可以自選輕量模型（gpt-5.6-luna 這類）之後，同樣任務的成本降幅普遍在 70% 以上。受衝擊最大的則是還沒動手遷移、依賴第三方閘道路由 `sonar-pro`／`sonar-reasoning-pro` 的團隊——像 LLM Gateway 這類代理服務已經公告，這兩個分級今天直接停止可路由，只有最基礎的 `sonar` 會被自動接到 Agent API，其餘分級沒有「什麼都不改就繼續動」這個選項。

### 定價邏輯的轉向：從「搜尋深度分級」到「模型自選＋工具計次」

Sonar API 的設計是「你選一個深度等級，Perplexity 幫你把模型和搜尋深度包好、收一個固定價」；Agent API 反過來，把「用哪個模型」和「用幾次搜尋工具」拆開，各自照用量計費。對開發者來說，這代表可控性變高（可以換更便宜或更強的模型、可以精確控制工具呼叫次數），但也代表過去「查一次多少錢」這種心智模型不再適用，得改成「這個模型 token 價多少、我這次任務大概要打幾次工具」——跟其他 Agent 框架的計費邏輯（用多少模型算多少錢、用多少工具算多少錢）趨於一致，是 Perplexity 在補齊跟通用 Agent 平台的可比性。

### 行動建議

- 如果你的呼叫還在用 `sonar` 模型：多數情況會被自動搬到 Agent API、格式相容，但建議還是照官方遷移指南實測一次回應格式（`choices` 變成 `output` 陣列），避免解析邏輯壞掉。
- 如果你用 `sonar-pro`／`sonar-reasoning-pro`／`sonar-deep-research`：今天起沒有直接對應的模型可切，必須照官方對照表改用 `low`／`medium`／`high`／`xhigh` preset，並重寫成 Agent API 的 request／response 格式，這不是改個 model 參數就能解決的遷移。
- 如果你是透過第三方閘道（OpenRouter、LLM Gateway 之類）呼叫 Sonar：先確認你用的閘道是否已經把對應模型代號路由到 Agent API，沒有的話今天呼叫就會直接失敗。

## 時效提醒

⚠️ **停用日期**：2026-09-27（今天）。Sonar Chat Completions 的 `messages`／`choices` 格式全面停止支援，改用 Agent API 的 `input`／`output` 格式。遷移指南：[Migrate from Sonar to the Agent API](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview)。

## 今日收穫

過去記錄的 API sunset 多半是「舊模型關掉、換個新模型代號打」這種一對一替換，但這次 Perplexity 的遷移是計價骨架本身變了：從「搜尋深度分級的固定價」換成「模型 token 價＋工具呼叫次數」的組合式計費。這意味著同一個「查詢」在新舊制度下的成本，不再只取決於你選了哪個等級，還取決於你實際打了幾次工具——遷移指南沒辦法只給一個「等值代換表」，因為真正的帳單現在得看你自己怎麼配置 Agent 的搜尋行為。

## 參考資料

- [Pricing | Perplexity API Docs（Sonar 停用公告與定價表原文）](https://docs.perplexity.ai/docs/getting-started/pricing)
- [Migrate from Sonar to the Agent API | Perplexity API Docs（分級對照表）](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview)
- [Perplexity Sonar Changes September 25 | LLM Gateway Changelog](https://llmgateway.io/changelog/perplexity-sonar-changes)
- [Perplexity Sonar API Retiring | DNotifier](https://www.dnotifier.com/blog/perplexity-sonar-api-is-retiring/)
