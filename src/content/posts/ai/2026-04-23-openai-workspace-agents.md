---
title: "OpenAI Workspace Agents:從 Custom GPT 進化到團隊自動化平台"
date: 2026-04-23
category: ai
tags: [openai, chatgpt, agent, workspace-agents, codex, enterprise-ai]
lang: zh-TW
tldr: "OpenAI 2026/4/22 推出 Workspace Agents,以 Codex 為底、可長時間在雲端執行、能串 Slack/Salesforce/Google Drive,是 Custom GPT 的企業版後繼者。"
description: "Workspace Agents 的設計定位、核心能力、與 Custom GPTs 的差異、整合生態、治理機制、適用情境與限制。"
draft: false
---

2026 年 4 月 22 日,OpenAI 把 ChatGPT 從「聊天機器人」往前推了一大步,推出 **Workspace Agents**——針對企業/團隊的 AI 代理框架,由 Codex 驅動,可以在雲端長時間自主執行任務,並直接接進 Slack、Salesforce、Google Drive、Microsoft 365、Notion、Atlassian 等工具。OpenAI 同時宣布:Custom GPTs 將在企業方案中**逐步停用**,Business / Enterprise / Edu / Teachers 使用者之後必須把既有 GPT 升級為 workspace agent。

## 設計定位:不是更強的 Chatbot,而是團隊的 AI 員工

過去 Custom GPTs 的模型假設是「使用者問問題 → GPT 同步回答」。Workspace Agents 打掉這個假設:agent 是**團隊共享的雲端角色**,可以被排程、可以掛在 Slack 頻道接收請求、可以在使用者離線的狀態下繼續推進任務。

這帶來幾個結構性變化:

- **共享而非個人**:agent 是組織資產,一個人建好、整個團隊一起用、一起改進。
- **長時間執行**:不再是幾秒鐘一問一答,而是分鐘到小時級的工作流。
- **跨工具推進**:不只生成文字,還會瀏覽網頁、填表單、改試算表、發信、開 IT ticket。

類比來說:Custom GPTs 像 Slack 的 slash command,Workspace Agents 比較像 Zapier + Slackbot + Codex 的合體。

## 由 Codex 驅動的能力

Workspace Agents 底層是 Codex(OpenAI 的 coding agent),這是個關鍵技術決定。Codex 本來就擅長「在環境裡多步驟執行任務、觀察結果、修正」這件事,搬到企業工作流剛好適合。常見能力:

- 撰寫/回覆 email、整理報表、草擬簡報
- 寫程式、review、重構、migration(繼承 Codex 的強項)
- 瀏覽網站、填表單、抓資料
- 編輯 Google Sheets / Excel
- 從 email、文件庫、CRM 拉 context

因為 memory 在 agent 本身,使用者可以在對話中糾正 agent,agent 越用越準——這點比 Custom GPTs 的一次性 instructions 更接近「訓練同事」的感覺。

## 與 Custom GPTs 的差異

| 面向 | Custom GPTs | Workspace Agents |
|---|---|---|
| 執行模型 | 同步回覆 | 雲端長時間自主執行 |
| 協作 | 個人使用為主 | 組織共享、團隊改進 |
| 工具整合 | 有限 actions | 原生 Slack / Salesforce / Drive / Notion |
| 觸發方式 | 使用者開對話 | 對話 + 排程 + Slack 被動接收 |
| 治理 | 基本權限 | 工具/資料/動作權限 + 人工核准 gate |
| 底層 | GPT | Codex |

對企業 IT 來說,Custom GPTs 是「用 prompt 包出來的玩具」,Workspace Agents 才開始有「可審計、可治理」的企業軟體樣子。

## 治理與核准:human-in-the-loop

Workspace Agents 最值得注意的產品決定是 **approval gating**。使用者或管理員可以設定:哪些動作 agent 可以自己做、哪些動作必須先來問人。

典型需要核准的動作:

- 寄出 email
- 編輯/覆寫試算表
- 新增行事曆事件
- 發出採購單或 IT 工單

OpenAI 官方給的一個範例是「軟體採購審核 agent」——自動分流新工具請求、檢查公司政策、路由到對應審核人、核准後直接開 IT ticket。這種流程在過去需要 Workato / ServiceNow + 一堆 glue code,現在一個 agent 吃掉。

## 部署與排程

Agent 的部署有三種典型模式:

```
┌─────────────────────────────────────────────┐
│ 1. ChatGPT 內直接對話(同步)                 │
│    使用者 → agent → 回應                     │
│                                              │
│ 2. Slack 被動觸發(事件驅動)                 │
│    Slack 訊息 → agent 在背景處理 → 回報結果  │
│                                              │
│ 3. 排程任務(cron-like)                      │
│    每週一 9am → agent 拉數據 → 生成週報 →    │
│    發到 #team-metrics                        │
└─────────────────────────────────────────────┘
```

第 3 種特別有意思:過去這類工作要嘛是人手動做、要嘛是工程師寫 script 維護,現在變成「設定一次、自動跑下去」。

## 定價與可用性

- **研究預覽階段**:ChatGPT Business / Enterprise / Edu / Teachers。
- **2026/5/6 前免費**,之後改為 credit-based pricing(依使用量計費)。
- Business 的入門方案為 $20 / user / 月,Enterprise / Edu 另議。

Credit-based 的設計對企業其實是合理的——長時間執行、跨工具調用、處理大量資料,費用跟實際工作量掛鉤比固定訂閱公平。但也代表「一個 agent 跑一整晚」可能會產生可觀的帳單,需要管理員設 budget。

## 適合與不適合的情境

**適合**:
- 重複性高、跨多個 SaaS 工具的工作流(例:週報、月報、審核流程)
- 需要記憶與演進的角色(例:客服分流、合規檢查)
- 可以容忍分鐘級延遲、換來更完整產出的任務

**不適合**:
- 即時性要求極高的互動(毫秒級 API)
- 需要確定性輸出的系統整合(agent 的決策有隨機性)
- 處理高敏感資料、且法規要求資料不離開自家環境的場景(仍走 OpenAI 雲端)

## 整體來說

Workspace Agents 真正的意義不是「又一個 AI 產品」,而是 OpenAI 在賭一件事:**未來企業 AI 的消費單位是「agent」而不是「對話」**。Custom GPTs 停用、Codex 全面下沉到工作流、Slack/Salesforce 深度整合,這些訊號都指向同一個方向。

對團隊來說,現在值得做的事是盤點:哪些重複工作可以被一個「共享、有記憶、能跨工具推進」的 agent 接走?這個問題的答案,會決定接下來一兩年 AI 在你們組織裡的槓桿有多大。

## 參考資料

- [Introducing workspace agents in ChatGPT | OpenAI](https://openai.com/index/introducing-workspace-agents-in-chatgpt/)
- [OpenAI updates ChatGPT with Codex-powered 'workspace agents' for teams | 9to5Mac](https://9to5mac.com/2026/04/22/openai-updates-chatgpt-with-codex-powered-workspace-agents-for-teams/)
- [OpenAI unveils Workspace Agents, a successor to custom GPTs for enterprises | VentureBeat](https://venturebeat.com/orchestration/openai-unveils-workspace-agents-a-successor-to-custom-gpts-for-enterprises-that-can-plug-directly-into-slack-salesforce-and-more)
- [OpenAI launches workspace agents that turn ChatGPT into a team automation platform | The Decoder](https://the-decoder.com/openai-launches-workspace-agents-that-turn-chatgpt-from-a-chatbot-into-a-team-automation-platform/)
- [Building workspace agents in ChatGPT (cookbook) | OpenAI Developers](https://developers.openai.com/cookbook/articles/chatgpt-agents-sales-meeting-prep)
- [Introducing Codex | OpenAI](https://openai.com/index/introducing-codex/)
