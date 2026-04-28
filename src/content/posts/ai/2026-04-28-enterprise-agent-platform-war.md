---
title: "橫向 Agent 平台爭霸：Claude Managed Agents、OpenAI Workspace Agents、Gemini Enterprise 三家對決"
date: 2026-04-28
type: deep-dive
category: ai
tags: [agent, enterprise, anthropic, openai, google, claude-managed-agents, workspace-agents, gemini-enterprise, vertex-ai, mcp, a2a, vendor-lock-in]
lang: zh-TW
tldr: "2026 年 Q2 三家同時推出橫向 agent 平台。Anthropic 走 API-first 賭 brain；OpenAI 用 ChatGPT distribution 包 workflow；Google 把 Vertex AI 整碗端出，打 Agent Registry 和加密 Identity 牌。MCP 與 A2A 兩條協定戰線同時開打。"
description: "拆解 Claude Managed Agents、OpenAI Workspace Agents、Gemini Enterprise Agent Platform 三大企業級橫向 agent 平台的定位、架構、計價、治理模型與 vendor lock-in 風險，並分析 MCP vs A2A 互通協定之戰。"
draft: false
---

2026 年 Q2 短短一個月內，三家同時把「橫向 agent 平台」端上桌：

- **Anthropic** 4/8 推出 **Claude Managed Agents**
- **OpenAI** 早於同期端出 **Workspace Agents**（research preview，5/6 前免費）
- **Google** 4/22 在 Cloud Next 發表 **Gemini Enterprise Agent Platform**

這三個產品**不是 coding agent 的延伸**，而是要當企業 agent 工作流的**runtime 與治理基礎設施**。誰拿到這層的標準制定權，誰就是下一個雲端時代的 AWS。這篇拆解三家定位、架構差異、計價模型、治理思路，最後談 MCP 與 A2A 兩條協定戰線。

## 為什麼叫「橫向」agent 平台

先把名詞釐清。2026 上半年的 agent 產品其實分兩層：

**垂直（coding-specific）**：Claude Code Remote、Codex Cloud、Cursor Cloud Agents、Jules、Antigravity、Devin、Kiro、Replit Agent。這些只做寫 code 一件事。

**橫向（任意任務）**：Claude Managed Agents、OpenAI Workspace Agents、Gemini Enterprise Agent Platform。你帶 agent 定義來，平台幫你跑、管、稽核——任務本身可以是 sales meeting prep、issue triage、合約審查、客服自動化，什麼都行。

橫向平台的市場大很多倍，因為使用者不限於開發者，且每個企業內部能跑的 workflow 數量是 coding 的數十倍。三家都很清楚這點。

## Claude Managed Agents — 「decouple brain from hands」

Anthropic 的 pitch 一句話：「我們做最強的 brain，runtime 也包了，你只要帶 spec 來。」

### 架構

Managed Agents 是**一組 composable APIs**，不是 console 產品。你定義：

- **agent behavior**（要做什麼）
- **tools**（能用什麼）
- **constraints**（不能做什麼）

平台處理 orchestration、sandbox、session state、credential、persistence。Anthropic 自己把這個架構叫「**decoupling the brain from the hands**」——model 是 brain，runtime 是 hands，過去你得自己組 hands，現在 Anthropic 一起賣。

### 特色

- **Long-horizon**：可跑數小時。Connection drop 進度不丟，恢復後接續執行。
- **Production-grade 內建**：sandbox、auth、tool execution 由平台代管，不用自己寫 security 層。
- **開發時程**：Anthropic 自述從「數月」縮短到「數週」。

### 商業

- **計價**：$0.08/hour active runtime + 標準 Claude token 費用。
- **早期客戶**：Notion、Rakuten、Asana。
- **狀態**：Beta，跟企業套件 Claude Cowork 一起推出。

### 隱憂

VentureBeat 直接點名 **vendor lock-in**：你把 agent runtime、state、credential 都綁 Anthropic 後，搬家成本極高。這是 Anthropic 走 infra 層路線必須付的代價——但反過來說，如果 Claude model 在能力上持續領先，lock-in 就是合理的取捨。

## OpenAI Workspace Agents — Custom GPTs 的企業繼承者

OpenAI 的 pitch 完全不同：「你企業已經付 ChatGPT Enterprise 了，agent 是送的功能。」

### 架構

Workspace Agents 是 **ChatGPT 的延伸 surface**，不是 standalone API 產品。值得注意的細節：

- **Codex 驅動**——OpenAI 把 Codex model 同時當 coding agent 和 workspace agent 的 backbone。**coding 與企業工作流的 model 邊界正在消失**。
- 可在 **ChatGPT 介面或 Slack** 中執行。
- **Template 起手**或從零建、workspace 內分享、可排程。

### 整合範圍

直接連 Google Drive / Calendar、Slack、SharePoint、Salesforce，並支援自訂 MCP server。preview → publish 工作流意味著管理員可以在發佈前審核。

### 治理

- **Compliance API**：每個 agent 的 config、updates、runs 全可審計。
- **群組權限**：管理員可按 user group 限制能用哪些工具與 action。
- **Suspend agent**：發現問題可以即刻停用。

### 商業

- 限 ChatGPT Business / Enterprise / Edu / Teachers 用戶。
- **2026/05/06 前免費**，之後改 credit-based pricing。

OpenAI 的策略意圖很明顯：**靠 ChatGPT Enterprise 的既有付費基礎**做 distribution，agent 是「升級包」而不是另收一筆。對企業 IT 來說採購阻力低——但代價是綁 ChatGPT Enterprise 訂閱，且 agent 必須跑在 OpenAI 的 surface 上。

## Gemini Enterprise Agent Platform — 把 Vertex AI 整碗端出

Google 的 pitch 是這三家裡最大的：「**agent 是 identity、是 compute 資源、是 registry 裡的 entity**——我們整個 stack 都幫你管。」

### 最重要的一件事：Vertex AI 被併入

Cloud Next 2026 上 Google 直接把 **Vertex AI 改名成 Gemini Enterprise Agent Platform**，並把原本散在 Vertex、Agent Builder、Agentspace、Workspace 的工具統一進來。這是 Google 做 enterprise AI 五年累積的整合動作。

### 核心架構

| 組件 | 功能 |
|---|---|
| Agent Studio | Low-code 視覺化介面，business user 不寫 code 就能設計 agent 邏輯 |
| Sub-agent network | 用 graph 結構組多 agent 系統，明確定義協作邏輯 |
| Model Garden | 200+ models，含 Gemini 3.1 Pro、Claude 系列、第三方 model |
| Agent Runtime | 部署執行環境，按 vCPU-hour + GiB-hour 計費 |
| Native Ecosystem Integrations | Plug-and-play 連內部資料與工具 |

### 兩個殺手級差異化

**1. Agent Registry**

企業級「agent 的 single source of truth」。索引組織內**所有 agent、tool、skill**，使用者只能用經過治理核准的資產。這直接回應大企業「agent 失控繁殖、沒人知道誰在跑什麼」的真實痛點——Anthropic 跟 OpenAI 都還沒給出明確答案。

**2. Agent Identity（加密 ID）**

每個 agent 拿到唯一 cryptographic ID。每個 action 映射到 authorization policy，**完整 auditable trail**。這是三家裡安全治理路線最激進的做法——直接把 agent 當「identity 公民」處理，對應傳統 IAM 模型。對 SOC、合規、稽核團隊來說特別有說服力。

### 商業

- **計價**：vCPU-hour + GiB-hour，per-second 計費——走 GCP 傳統 IaaS 模式。
- **早期客戶**：Merck、Home Depot——傳統大企業。
- **A2A protocol**：同場推出 agent 之間的通訊協定（後面詳述）。

## 三家面對面

| 面向 | Gemini Enterprise | Claude Managed Agents | OpenAI Workspace Agents |
|---|---|---|---|
| 前身/併入 | 吸收 Vertex AI、Agentspace | 新產品線（Claude Platform 子集） | Custom GPTs 繼承者 |
| 交付形態 | Agent Studio (low-code) + API | API-first（composable APIs） | ChatGPT UI + Slack |
| 主要受眾 | 企業 IT + biz user 混合 | Developer | Ops / knowledge worker |
| 多 agent 組合 | Graph-based sub-agent network | Composable via API | Single-agent 為主 |
| 模型選擇 | Model Garden 200+（含第三方） | Claude 系列 | Codex (GPT-5.3) |
| 治理核心 | Agent Registry + 加密 Agent Identity | Sandbox、auth、audit log | Compliance API、group ACL |
| 互通協定 | A2A（自推） | MCP（Anthropic 主導） | MCP 相容 |
| 定價模型 | vCPU-hr + GiB-hr（per-second） | $0.08/hr active + token | Credit-based（5/6 後） |
| Lock-in 風險 | 低-中 | 高 | 中 |
| 代表客戶 | Merck、Home Depot | Notion、Rakuten、Asana | Business / Enterprise plan users |

## 三家的策略本質

**Anthropic — 狹窄但深**

賭 Claude model 領先 + managed runtime 的便利性壓 lock-in 風險。如果 Claude 在能力上能持續壓制 GPT 與 Gemini，這個賭注就成立。$0.08/hr 的固定費率比 Google 的 vCPU-hour 計費**更可預測**，這對需要 budget planning 的企業是優勢。

**OpenAI — 依附 distribution**

ChatGPT Enterprise 已經有大量企業用戶了，agent 不收額外費（5/6 後也只是 credit-based），等於用既有付費關係硬塞進去。賭的是**channel 勝過 product depth**。短期內最容易拿到企業採購單。

**Google — 基礎設施全面戰**

賭 Vertex AI / GCP 既有企業關係 + 200+ 模型的中立性 + A2A 標準主導權。Agent Registry 跟加密 Identity 是其他兩家短期內補不回來的差異化——這對保守、合規導向的傳統大企業是強說服力。

## MCP vs A2A：兩條協定戰線

如果橫向 agent 平台是 2026 上半年的戰場，那協定就是 2026 下半年的戰場。

### MCP（Model Context Protocol）

- **發起者**：Anthropic（2024 末發布）。
- **層級**：解 **agent ↔ tool/data source** 的界面。
- **採用者**：Anthropic、OpenAI、Google、Anysphere、Microsoft、各 IDE 廠商**全部採用**。
- **現狀**：事實上的標準，生態 server 數以千計。

### A2A（Agent-to-Agent Protocol）

- **發起者**：Google（2026/04 隨 Gemini Enterprise Platform 推出）。
- **層級**：解 **agent ↔ agent** 的協作通訊。
- **採用者**：目前以 Google 自家為主。
- **現狀**：Google 想抓的下一個標準位置，挑戰 Anthropic 在協定層的主導權。

### 兩者層級不重疊

MCP 解「agent 如何呼叫工具」、A2A 解「agent 如何跟其他 agent 對話」。理論上可以同時存在。但**誰先成為 de facto 標準誰就拿話語權**——MCP 已經跑在前面整整一年，A2A 要追趕需要快速建立足夠的生態壓力。

短期內 MCP 主導確定，但 A2A 如果能拿到 Google Workspace 內部生態（Gmail、Calendar、Drive 上跑的所有 agent），它的 distribution 優勢會反過來拉著別家採用。值得追蹤。

## Vendor Lock-in 會是下一個戰場

三家平台一旦 agent runtime、state、credential 都綁定，搬家成本極高。買家會開始要求**portable agent spec**——類似「Dockerfile for agents」的東西。

幾個觀察點：

1. **MCP 已經部分解決**「agent 用的 tools」可移植性問題。
2. **agent behavior（prompts + state machine）的可移植性還沒有標準**——OpenAI 的 Workspace Agent 規格、Claude Managed Agents 的 spec、Google Agent Studio 的 graph 三家互不相通。
3. **A2A 如果做成跨家標準**，會無意中順便解掉 multi-agent 編排的 lock-in。
4. 已經有開源專案在嘗試做「agent IR」（intermediate representation），把不同平台的 agent 定義 cross-compile——值得關注。

## 怎麼選？

這三家短期內**會並存**，企業很可能同時採用兩到三家。決策思路：

**選 Claude Managed Agents 如果**
- 你是 dev-heavy 組織，要把 agent 包進自家產品。
- 你押 Claude model 能力會持續領先。
- 你要 long-horizon agent 跑數小時不掉。

**選 OpenAI Workspace Agents 如果**
- 你已經有 ChatGPT Business / Enterprise 訂閱。
- 你的使用者是 ops、sales、HR 等 knowledge worker，不是 dev。
- 你需要快速接 Slack / Salesforce / SharePoint 等 SaaS。

**選 Gemini Enterprise Agent Platform 如果**
- 你已經是 GCP / Workspace 大客戶。
- 你需要嚴格的 agent identity、registry、稽核（合規導向）。
- 你想保持 model 中立，避免綁單一廠商。

實務上，**橫向 agent 平台會走向多 vendor 並用**，就像今天的 cloud（AWS + GCP + Azure 多雲）一樣。誰能把跨平台 portability 做好，誰就能在第二回合勝出。

## 結語

2026 Q2 的橫向 agent 平台之戰，本質是**雲端基礎設施的下一場土地爭奪**。Anthropic 賭 brain、OpenAI 賭 distribution、Google 賭 stack 整合。三家都已就位，接下來看誰能拉到最多 reference customer、誰能讓 MCP 或 A2A 成為事實標準、誰能把 lock-in 風險的論述轉化成競爭優勢。

對企業 buyer 來說，**現在不是選邊站的時刻**，而是觀察三家如何回應 portability、identity、registry 這幾個關鍵題的時刻。對開發者來說，**MCP server 與 portable agent spec 是值得投資的方向**——這是橫跨三家平台的共通底座。

下一場戰役大概會落在 2026 下半年的 **agent observability、cost optimization、自動化評估**——當 agent 真正跑進 production，「我的 agent 為什麼壞了」「我這個月燒了多少 token」會比「我用哪家平台」更迫切。

## 參考資料

- [Scaling Managed Agents: Decoupling the brain from the hands — Anthropic](https://www.anthropic.com/engineering/managed-agents)
- [Claude Managed Agents overview — Claude API Docs](https://platform.claude.com/docs/en/managed-agents/overview)
- [Anthropic's Claude Managed Agents — VentureBeat](https://venturebeat.com/orchestration/anthropics-claude-managed-agents-gives-enterprises-a-new-one-stop-shop-but)
- [Anthropic Introduces Managed Agents — InfoQ](https://www.infoq.com/news/2026/04/anthropic-managed-agents/)
- [Introducing workspace agents in ChatGPT — OpenAI](https://openai.com/index/introducing-workspace-agents-in-chatgpt/)
- [Workspace agents — OpenAI Academy](https://openai.com/academy/workspace-agents/)
- [OpenAI unveils Workspace Agents — VentureBeat](https://venturebeat.com/orchestration/openai-unveils-workspace-agents-a-successor-to-custom-gpts-for-enterprises-that-can-plug-directly-into-slack-salesforce-and-more)
- [Introducing Gemini Enterprise Agent Platform — Google Cloud Blog](https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform)
- [Gemini Enterprise Agent Platform pricing — Google Cloud](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing)
- [Gemini Enterprise Agent Platform adds connective tissue to Vertex AI — TechTarget](https://www.techtarget.com/searchitoperations/news/366642175/Gemini-Enterprise-Agent-Platform-adds-connective-tissue-to-Vertex-AI)
- [Google Introduces Unique AI Agent Identities — Infosecurity Magazine](https://www.infosecurity-magazine.com/news/google-ai-agent-identities-gemini/)
- [Merck, Home Depot tap Gemini Enterprise — TechTarget](https://www.techtarget.com/searchitoperations/news/366642097/Merck-Home-Depot-tap-Gemini-Enterprise-for-AI-agent-development)
- [Google Cloud Next 2026: AI agents, A2A protocol — TNW](https://thenextweb.com/news/google-cloud-next-ai-agents-agentic-era)
