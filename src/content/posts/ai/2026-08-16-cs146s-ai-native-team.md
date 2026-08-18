---
title: "CS146S Week 9：一個人接 MCP 沒問題，三百個人接就需要一座門"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - mcp
  - ai-agent
  - orchestration
  - pricing
  - developer-experience
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 10
tldr: "個人怎麼接工具是偏好問題，組織怎麼接是治理問題——誰能碰什麼資料、金鑰放哪、成本算誰的。Anthropic 自己公布的十個團隊使用紀錄裡有個好指標：安全工程團隊佔了整個 monorepo 自訂 slash command 的 50%。採用不是均勻擴散的，它先在會自己造工具的團隊裡起飛。"
description: "拆解 Stanford CS146S Fall 2026 第九週「Building an AI-Native Team」：MCP portal 的集中式權限控管、LLM gateway 與 model routing、agent 成本的三個來源，以及 Anthropic 十個內部團隊的實際採用紀錄。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-ai-native-team-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第十篇，對應 Fall 2026 的第九週。

課程主題三條：MCP portal 與集中、有權限控管的工具存取；LLM gateway、model routing 與成本優化；組織層級的採用模式。講題是「Coding agents in big teams」。

這一週處理的是前八週都繞開的問題：**當使用者從一個人變成一整間公司**。

## 每個人自己接，會壞在哪

一個工程師在自己機器上接五個 MCP server，沒有任何問題。三百個工程師各自接，會同時長出五個問題：

- **權限**：誰能透過 agent 讀 production 資料庫？沒有人知道，因為設定散在三百台筆電裡
- **金鑰**：API key 存在每個人的設定檔中，輪替一次要通知全公司
- **稽核**：出事之後回答不了「agent 那天碰了什麼」
- **重複**：同一個內部服務被包成七個版本的 MCP server，行為各自漂移
- **成本**：帳單是一筆總數，攤不回團隊或任務

這五個問題沒有一個是 AI 特有的——它們是 2010 年代 API 治理的同一批問題。差別在於觸發速度：agent 一天可以打出人類一個月的呼叫量。

## MCP portal：集中的那一層在管什麼

課程用的詞是 portal。不管叫 portal、gateway 還是 registry，那一層要做的事是固定的：

| 職責 | 具體是什麼 |
|---|---|
| 目錄 | 公司內有哪些 server 可用，誰維護 |
| 授權 | 哪個團隊／角色能用哪個 server 的哪些工具 |
| 憑證代管 | 金鑰在 portal 裡，不下放到個人裝置 |
| 稽核 | 每次工具呼叫留下誰、何時、做了什麼 |
| 版本 | server 升級不必每個人重設定 |

MCP 官方在 2025 年 9 月推出了[公開 registry 的預覽](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/)，處理的是「怎麼找到 server」這一半；企業內部的 portal 處理的是「誰能用哪個」那一半。

Anthropic 自家 Data Infrastructure 團隊在[內部使用紀錄](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf)裡給的建議正好是這個邏輯：

> They recommend using MCP servers rather than the BigQuery CLI to maintain better security control over what Claude Code can access, especially for handling sensitive data that requires logging or has potential privacy concerns.

**選 MCP 而不是 CLI，理由是可控與可記錄，不是好用。** 對個人來說 CLI 更快；對組織來說能記錄的那條路才是唯一能走的路。

## 工具太多本身就是成本

集中之後會冒出一個新問題：portal 上掛了八十個 server、六百個工具，然後每個 agent 開機都要把工具定義載進 context。

Anthropic 在 [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) 裡量過這件事：在工具數量大的情境下，把工具改成檔案系統上的程式碼 API、讓 agent 按需讀取，「reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%」。

所以 portal 的設計裡有一條容易被漏掉的需求：**它要能讓 agent 只載入需要的工具**，而不是把整份目錄推過去。搜尋式的工具發現（先搜、再載入定義）比全量載入實際得多。這跟 [Week 3 的 skill 三層 progressive disclosure](/posts/ai/2026-08-16-cs146s-agent-skills) 是同一個機制在不同層級的應用。

## LLM gateway 與 model routing

gateway 是模型呼叫這一側的對應物，職責清單類似：單一入口、金鑰不落地、配額與速率限制、每個團隊的用量歸屬、以及可觀測性（延遲、錯誤、token 分布）。

model routing 是掛在 gateway 上的一項能力——不同任務送給不同模型。合理的切法通常長這樣：

- 機械式、可驗證的任務（格式轉換、樣板生成）→ 便宜快的模型
- 需要跨檔案推理的任務 → 旗艦模型
- 大量重複的批次任務 → 便宜模型 + 確定性驗證迴圈把關

**但 routing 有個常被忽略的前提**：你得先能量測「便宜模型在這個任務上夠不夠好」。沒有評測就做 routing，省下的成本會以除錯時間的形式加倍付回去。這也是為什麼這門課把 [Week 5 的驗證迴圈](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)排在前面。

agent 的 token 成本主要來自三個地方，優化前先確認自己在燒哪一個：

1. **工具定義**——每輪都重送，工具越多越貴
2. **中間結果**——工具輸出穿過 context，大檔案穿兩次
3. **重試**——失敗的路徑照樣計費，而且通常是最長的那條

第 3 項最容易被忽略：**回饋迴圈越差，重試越多，成本越高**。把 CI 從十分鐘壓到五秒不只是體驗改善，它直接反映在帳單上。

## 組織採用長什麼樣

Anthropic 公布過一份自家十個團隊怎麼用 Claude Code 的紀錄，涵蓋資料基礎架構、產品開發、安全工程、推論、資料科學、API、成長行銷、產品設計、RL 工程與法務。裡面有幾個數字值得看（都是**自述**，沒有外部驗證）：

- 安全工程團隊「uses 50% of all custom slash command implementations in the entire monorepo」
- 產品開發團隊做 Vim mode 這類功能時，「roughly 70% of the final implementation came from Claude's autonomous work」
- 推論團隊的事故排查從「10-15 minutes of manual code scanning」降到約 5 分鐘
- 成長行銷的廣告文案產出從 2 小時降到 15 分鐘

最有參考價值的其實不是這些倍數，是**分布本身極不均勻**。一個團隊佔掉全公司自訂指令的一半，說明採用不是均勻擴散的——它先在「會自己造工具」的團隊裡起飛，其他團隊要等這些工具被抽象成可共用的東西。

這給組織推動者一條相當實際的策略：**別做全公司培訓，去找那個已經在自己造工具的團隊，把他們造的東西變成共用資產。**

文件裡反覆出現的做法也值得抄，因為它跟前面幾週完全對得上：

- 「Create self-sufficient loops」——讓 Claude 自己跑 build、測試與 lint 驗證自己的工作（[Week 5](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)）
- CLAUDE.md 寫得越詳細，表現越好（[Week 4](/posts/ai/2026-08-16-cs146s-agent-customization)）
- 把複雜工作流拆成專職 sub-agent，比塞進一個 prompt 好除錯（[Week 4](/posts/ai/2026-08-16-cs146s-agent-customization)）

還有一條很誠實的：推論團隊把它當「slot machine」——先 commit 存檔，讓它自己跑 30 分鐘，然後**要嘛接受、要嘛整個重來**，不要試圖跟它拉扯修正。這是我看過對「什麼時候該放棄一次 agent 執行」最實用的規則。

## 三個反模式

- **先買 gateway 再想清楚要治理什麼**。工具解決不了「沒人知道誰該有什麼權限」
- **把成本優化排在評測前面**。省下的錢會變成除錯時間
- **用全公司平均數當指標**。就像 [Week 5](/posts/ai/2026-08-16-cs146s-agent-ready-codebase) 提到的，「有多少比例的團隊達到某個水準」比「平均分數」有用得多

## 會過期的東西

- Anthropic 那份內部使用紀錄的數字是自述、單一時點、單一公司
- MCP registry 與企業 portal 的產品生態變動快，本文只寫職責不寫產品
- 各家模型的價格與能力階梯每幾個月就重排，routing 策略要跟著重驗

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 9 主題與講題
- [How Anthropic Uses Claude Code](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf) — Anthropic，十個內部團隊的使用紀錄，Fall 2025 Week 4 指定讀物
- [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) — Anthropic Engineering，工具定義的 token 成本與解法
- [MCP Registry preview](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/) — Fall 2025 Week 2 指定讀物
- [MCP Server Authentication](https://developers.cloudflare.com/agents/guides/remote-mcp-server/#add-authentication) — Cloudflare，遠端 MCP server 的授權設計，Fall 2025 Week 2 指定讀物
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory，回饋迴圈品質與重試成本的關係
