---
title: "AI Agent GitHub Digest — 2026-09-25"
date: 2026-09-25
category: daily
tags: [ai-agent, github, open-source, daily, agent-orchestration, agent-memory, agent-sdk]
lang: zh-TW
description: "Google 把 agent workload 當成新一類叢集資源在蓋排程平台，同一天 AWS 的 agent harness SDK、會學習的記憶系統 Hindsight、agent 原生 CLI 生成器也都衝上今日星數成長榜"
tldr: "google/ax 用 Kubernetes 風格的 Workspace/Task/Gateway/Model 四個原語跑 agent workload，今天狂漲 1,376 星；strands-agents/harness-sdk 把 agent loop 的 lifecycle、工具、MCP、多 agent、記憶全打包進 create_harness() 一行呼叫；HKUDS/CLI-Anything 幫任意軟體生成 agent 原生 CLI 介面，50,241 星、附 arxiv 技術報告；vectorize-io/hindsight 主打「會學習」的 agent 記憶，在 LongMemEval benchmark 宣稱業界最佳，今天單日漲 1,607 星；Haystack 3.2.0 加入摘要式 context 壓縮與 token 預算控制，但 Toolset 的 `+` 合併語法被整個移除。"
series:
  name: "AI Agent GitHub Digest"
  order: 41
---

## 今日亮點

今天四個成長最快的專案剛好卡在 agent 生命週期的四個不同層——google/ax 決定 agent「跑在哪裡」，strands-agents/harness-sdk 決定 agent「怎麼跑」，HKUDS/CLI-Anything 決定 agent「能操作什麼」，vectorize-io/hindsight 決定 agent「記得什麼」。基礎設施層一次補到這個密度，代表這波不只是模型能力在進步，是整條 agent 供應鏈都在補位。

## Trending Repos

### google/ax ⭐ 10,083 (+1,376)

[GitHub](https://github.com/google/ax)　·　Go　·　Apache-2.0

- **是什麼**：Google 開源的「agent 工作負載編排引擎」，概念像 Kubernetes，但排程單位不是 Pod，是一個會跑到底的 agent task。
- **為什麼值得看**：Agent 工作負載跟一般服務不一樣——會累積狀態、需要嚴格沙箱隔離、會呼叫外部模型 API、沒人看著可能一直燒錢。ax 用 `Task`（跑沙箱裡的任務）、`Workspace`（先接好 Git repo、MCP server、skill 套件）、`Gateway`（鎖住對外連線白名單）、`Model`（統一設定平台用哪個 LLM）四個宣告式原語把這些問題收斂掉，還支援 `ax suspend`/`ax resume` 暫停恢復、`ax ssh` 直接進沙箱看 agent 在幹嘛。作者標註目前仍會有重大 breaking changes，但這個方向代表 Google 已經把「agent」當成一種需要獨立排程平台的新工作負載，而不是應用層的一個功能。
- **tech stack**：Go + Agent Substrate（沙箱執行層）+ Kubernetes 風格宣告式 manifest（`ax.io/v1alpha1`）
- **上手難度**：高——需要自備 Kubernetes 叢集、`ko`、容器 registry，面向要蓋 agent 平台的團隊，不是給個人開發者直接上手的工具

---

### strands-agents/harness-sdk ⭐ 8,178 (+463)

[GitHub](https://github.com/strands-agents/harness-sdk)　·　Python　·　Apache-2.0

- **是什麼**：AWS Strands Agents 團隊的「agent harness」SDK monorepo，把寫 agent loop 時大家各自重造一遍的東西打包成一行呼叫。
- **為什麼值得看**：定位很直白——「如果你原本得自己刻一個 agent loop，就該改用 Strands」。一個 `create_harness()`（Python）或 `createHarness()`（TypeScript）就接好 turn 上限、token 預算、取消、停止原因這些 lifecycle 控制，加上工具、結構化輸出、MCP、多 agent 模式、記憶、session、串流、guardrail、追蹤、評估。跟 LangGraph／CrewAI 這類重編排 DSL 的框架不同，它主打「跑在你自己的 process 裡，沒有 hosted control plane」，Python 和 TypeScript 雙棲，CLI、文件站、跨 SDK 治理文件也都收進同一個 repo。
- **tech stack**：Python + TypeScript 雙 SDK（`harness-py`／`harness-ts`）+ `strands` CLI（終端機直接跑 harness agent）
- **上手難度**：低——`create_harness()` 一行接好核心能力，要客製 model provider、guardrail、追蹤這些再逐步加

---

### HKUDS/CLI-Anything ⭐ 50,241 (+415)

[GitHub](https://github.com/HKUDS/CLI-Anything)　·　Python　·　Apache-2.0

- **是什麼**：幫任何軟體自動生成一支「agent 原生」的 CLI 操作介面，搭配社群共享的 CLI-Hub 套件庫。
- **為什麼值得看**：現有軟體的操作介面幾乎都是為人類設計的 GUI，agent 得自己硬啃截圖或點座標。CLI-Anything 反過來做——幫特定軟體造一層 agent 能直接呼叫的 CLI，`pip install cli-anything-hub` 後 `cli-hub install <name>` 就能裝別人已經做好的 CLI，README 附了 arxiv 技術報告佐證方法，並展示 agent 用生成的 CLI 操作 CAD 建模、3D 場景、字幕產出等真實任務。
- **tech stack**：Python + CLI-Hub 套件登錄庫 + 各軟體對應的操作腳本與 preview/trajectory 迴圈
- **上手難度**：中——裝現成的 CLI 很容易，但要「幫一個新軟體造 CLI」需要先理解該軟體本身的操作介面

---

### vectorize-io/hindsight ⭐ 27,594 (+1,607)

[GitHub](https://github.com/vectorize-io/hindsight)　·　Python　·　MIT

- **是什麼**：主打「會學習」而不只是「會回想」的 agent 長期記憶系統。
- **為什麼值得看**：多數 agent 記憶系統做的事是 RAG 式的對話回想，Hindsight 的操作模型是 retain／recall／reflect 三段式，把記憶整理成「心智模型」和「知識頁」而不是散落的向量片段。README 宣稱在 LongMemEval——一個常被用來評估對話式 AI 記憶系統的 benchmark——上拿到目前最佳表現，並持續在 benchmark 頁面公開更新各模型的準確率、延遲、成本數字。包一個 LLM 呼叫成 agent 記憶只要兩行程式碼，也提供 MCP server 介面接進 coding agent。
- **tech stack**：Python，支援內嵌模式（不需要另外架 server）+ MCP server 介面
- **上手難度**：低——`python` 內嵌模式最快，要多 agent 共用記憶才需要另外起 server

## Notable Releases

### Haystack 3.2.0

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.2.0)

- **重要變更**：新增實驗性 `SummarizationCompactor`，用 LLM 生成摘要來壓縮長跑 Agent 的歷史對話，取代直接砍掉舊訊息，並可設定 `min_keep_steps` 保留最新幾步不動；新增 `TokenBudgetHook`，Agent 執行花完設定的 token 預算就會在下一次呼叫模型前乾淨停下，回傳目前已收集的訊息並標註 `exit_reason`；`Pipeline` 新增 `add_components()` 和 `connect_many()`，一次加多個元件、一次接多條連線，且都能鏈式呼叫。
- **Breaking Changes**：序列化過、且帶 Jinja `custom_filters` 的 `OutputAdapter`／`ConditionalRouter` 元件，現在必須用 `Pipeline.load(..., unsafe=True)` 才能載入；`Toolset` 的 `+` 合併運算子被整個移除，改用 list 傳入多個 Toolset，過去用 `+` 序列化過的 pipeline 檔案會直接載入失敗，得改寫成 list 形式重新序列化。
- **對你的影響**：如果 pipeline 裡有用 `+` 合併過 `Toolset`，或序列化過帶自訂 Jinja filter 的元件，升級前要先改寫這兩處，否則會直接載入失敗，不是跑起來才報錯。

---

### Pydantic AI v2.49.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.49.0)

- **重要變更**：新增 `GitHubCopilotOAuthFlow` 支援裝置授權登入；`TypeSafeModel` 新增 `BoolCriteria`，讓你明講一個 `bool` 欄位的「是」跟「否」各自代表什麼；修掉多個串流 tool call、Bedrock Converse 模型清單、Gemini Live 連線失敗的 bug。
- **Breaking Changes**：無，這個版本以新功能和 bug fix 為主。
- **對你的影響**：如果你在用 Bedrock 上的 OpenAI 相容模型或 Gemini Live 語音功能，這個版本修了幾個實際連不上、跑不動的問題，值得升級。

## 今日收穫

之前以為 agent 框架的競爭焦點還停在 LangGraph／CrewAI 這種編排 DSL 上，但 google/ax 直接把 agent workload 當成 Kubernetes 等級的排程單位在蓋平台——這代表至少有一家大廠已經在賭「agent 是需要獨立基礎設施層的新工作負載」，而不只是應用層一個會呼叫工具的迴圈。

## 參考資料

- [google/ax](https://github.com/google/ax)
- [strands-agents/harness-sdk](https://github.com/strands-agents/harness-sdk)
- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)
- [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- [Haystack 3.2.0 — Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.2.0)
- [Pydantic AI v2.49.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.49.0)
