---
title: "Multi-Agent 編排模式：腳本、Model-Driven、混合，三種哲學怎麼選"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, orchestration, agent, langgraph, crewai, anthropic, openai, agent-cli]
lang: zh-TW
tldr: "Multi-Agent 編排分三派：腳本確定性（LangGraph、Claude Code Workflow）可預測但僵硬，model-driven（Codex、Devin）靈活但不可控，混合派（Windsurf 2.0）當指揮台整合多家。選擇取決於你需要多少可預測性。"
description: "Multi-Agent 系統實戰系列第三篇。比較腳本確定性、model-driven、混合三種編排哲學，從 LangGraph 到 Devin 的設計取捨，附選擇決策樹。"
draft: false
series:
  name: "Multi-Agent 系統實戰"
  order: 3
---

你決定讓多個 agent 協作了。下一個問題是：**誰來決定接下來做什麼？**

是你寫一份腳本精確控制每一步？還是讓 LLM 自己判斷要不要 spawn 子 agent？還是乾脆不自己做編排，當個指揮台讓各家 agent 各司其職？

這個選擇決定了系統的可預測性、成本可控性和開發複雜度。

## 三種編排哲學

```
確定性腳本 ◄─────────────────────────────────────► Model-driven 自主

LangGraph    Claude Code    CrewAI    Cursor    Codex    Devin    AutoGen
  圖狀態機    Workflow       角色+委派  /multitask  Manager   Fusion   GroupChat
             JS 腳本                            /Worker   lead     自由對話
                                                         /sidekick
```

### 腳本派：開發者控制流程

**代表**：LangGraph、Claude Code Dynamic Workflow

核心思路是把 multi-agent 編排當**基礎設施**來寫，不是讓 LLM 即興發揮。

[LangGraph](https://langchain-ai.github.io/langgraph/) 用圖狀態機：你定義 State（資料快照）、Node（每個 agent 做的事）、Edge（流向條件）。每個 node 是一次離散的 LLM 呼叫，graph 的拓撲就決定了最多跑幾次、花多少錢。依 [LangChain 的 benchmark](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)，顯式圖結構讓成本最可預測。

[Claude Code Workflow](https://code.claude.com/docs/en/workflows) 用 JavaScript 腳本：`pipeline()` 做流水線、`parallel()` 做 barrier 同步、`agent({schema})` 拿結構化輸出。中間結果存在 JS 變數裡而非 LLM context 中，所以不會 context 膨脹。加上 `budget.remaining()` 可以在腳本裡直接查剩餘預算，決定要不要繼續 spawn。

**優勢**：可預測、可 resume、可審計、成本可控
**劣勢**：僵硬——遇到預期外的情境，腳本不會自己調整

適合場景：CI/CD 流程、code review pipeline、批次資料處理——任何你能預先定義步驟的工作。

### Model-driven 派：LLM 自主決定

**代表**：Codex Manager/Worker、Devin Fusion、AutoGen GroupChat

核心思路是**讓 LLM 決定什麼時候需要幫手**。開發者提供工具（spawn、send_message、wait），LLM 自己判斷要不要用。

[Codex](https://openai.com/index/codex-now-generally-available/) 的 Manager agent 每個 turn 決定要不要 `spawn_agent`、什麼時候 `wait_agent` 收結果。六個原語（spawn / send_message / followup_task / wait / list / close）就是 manager 的工具箱。

[Devin Fusion](https://cognition.com/blog/devin-fusion) 更進一步：lead model 自主決定哪些任務交給便宜的 sidekick model，各自有獨立 toolset 和 context。

已進入維護模式的 AutoGen GroupChat 是最極端的例子——多個 agent 在群聊裡自由對話，selector 決定誰發言，對話歷史就是狀態。靈活到極致，但也因此造成了[社群回報的 40% 預算超支](https://github.com/microsoft/autogen/discussions/7066)。

**優勢**：靈活、能處理預期外的情境、開發快
**劣勢**：不可預測——同樣的 prompt 每次可能 spawn 不同數量的 agent，成本波動大

適合場景：探索性研究、開放式問題、需要 agent 「判斷」而非「執行」的任務。

### 混合派：IDE 當指揮台

**代表**：Windsurf 2.0、VS Code Agent Sessions

核心思路是**不自己做 multi-agent 編排，而是整合多家 agent**。

[Windsurf 2.0](https://devin.ai/blog/windsurf-2-0) 的 Agent Command Center 是 Kanban 式儀表板，Cascade（本地 agent）負責即時補全和 context-aware 除錯，長任務一鍵交給 Devin（雲端 VM）。VS Code 1.109 讓你在同一 IDE 混搭 Copilot + Claude + Codex。

這不是傳統意義上的「編排」——更像是**調度**。每個 agent 保持自己的 subagent 架構和成本控制，IDE 只負責分配任務和彙總結果。

**優勢**：不 vendor lock-in、各 agent 的長處互補
**劣勢**：context 不共享、跨 agent 的結果整合靠人工

適合場景：團隊裡不同人偏好不同工具、或者不同任務適合不同 agent 的情境。

## 怎麼選

決策關鍵不是「哪個框架比較好」，而是「你需要多少可預測性」：

| 問自己 | 如果答案是 Yes | 建議 |
|---|---|---|
| 這個流程會重複跑嗎？ | 會（CI、batch、review pipeline） | 腳本派 |
| 你能預先定義所有步驟嗎？ | 能 | 腳本派 |
| 任務是開放式的嗎？ | 是（研究、探索、debug） | Model-driven |
| 成本波動是不是零容忍？ | 是 | 腳本派（圖結構限制了最大 LLM 呼叫次數） |
| 你需要混用不同 vendor 的 agent？ | 是 | 混合派 |

實務上，多數團隊會走**腳本 + model-driven 混合**——外層用腳本控制大流程（先分析、再實作、再 review），每個步驟內部讓 LLM 自主行動。Claude Code 本身就是這個模式：Workflow 是腳本層，每個 `agent()` 呼叫裡的 LLM 是自主層。

## 編排模式不是一次性選擇

值得注意的是，依 [Google Research 的研究](https://arxiv.org/abs/2512.08296)（180 個 agent 配置的系統性實驗），獨立多 agent（各自跑、不協調）把錯誤放大了 17.2 倍，而集中式協調降到 4.4 倍。

這意味著：**越是 model-driven 的系統，越需要某種形式的集中監督**。純自主 ≠ 好，有紀律的自主才有效。

隨著系統複雜度提高，很多團隊會從 model-driven 逐步往腳本派移動——不是因為腳本更好，而是因為出了問題的時候，你需要能 replay 和 debug 的確定性流程。

## 整體來說

編排模式的選擇本質上是一個**可預測性 vs 靈活性**的取捨。腳本派犧牲靈活換可控，model-driven 犧牲可控換靈活，混合派犧牲整合成本換 vendor 多樣性。

沒有一個模式適合所有場景。但如果你剛開始做 multi-agent，建議從腳本派入手——至少你知道系統會做什麼、花多少錢。等你對成本和行為有了足夠的觀測數據，再逐步放鬆控制。

## 參考資料

- [Anthropic — Claude Code Workflows 官方文件](https://code.claude.com/docs/en/workflows)
- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [OpenAI — Codex GA 官方公告](https://openai.com/index/codex-now-generally-available/)
- [OpenAI — Symphony 開源編排層](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [Cognition — Devin Fusion 架構](https://cognition.com/blog/devin-fusion)
- [Windsurf — Agent Command Center (2.0)](https://devin.ai/blog/windsurf-2-0)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain — Benchmarking Multi-Agent Architectures](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)
- [CrewAI Documentation](https://docs.crewai.com/)
- [Microsoft — AutoGen 進入維護模式](https://github.com/microsoft/autogen/discussions/7066)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
