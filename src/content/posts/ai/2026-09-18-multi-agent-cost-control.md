---
title: "Multi-Agent 成本控制：七家框架的做法與「先軟著陸再硬擋」的業界共識"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, cost-optimization, agent, anthropic, openai, langgraph, crewai, microsoft-agent-framework, bedrock]
lang: zh-TW
tldr: "Multi-Agent 並行 + 巢狀 spawn 可以在單輪對話燒掉 200K+ tokens。業界從 Anthropic 到 Microsoft 都走向三級分級反應：壓縮 → 降級 → 停止，而非一刀切硬擋。"
description: "比較 Anthropic Claude Agent SDK、OpenAI Codex、Microsoft Agent Framework、LangGraph、CrewAI、Amazon Bedrock Agents 的 multi-agent 成本控制機制，整理業界共識與實作建議。"
draft: false
series:
  name: "Multi-Agent 系統實戰"
  order: 2
---

讓多個 AI agent 協作聽起來很美好——一個負責搜尋、一個負責分析、一個負責寫報告。但當 agent 可以動態 spawn 子 agent、子 agent 又能 spawn 孫 agent、每個都帶著完整對話歷史跑的時候，單輪對話的 token 消耗可以指數成長。

這篇整理六家主流框架的成本控制機制，以及正在形成的業界共識。

## 為什麼 Multi-Agent 會爆成本

三個主要原因：

**並行 spawn**：一個 supervisor agent 一次派出 5 個子 agent 各自查資料，就是 5 倍的 LLM 呼叫。如果上限設到 20，就是 20 倍。

**巢狀深度**：子 agent 有權限再 spawn 子 agent。深度 3 層、每層 5 個並行，理論上限是 5³ = 125 個 agent 同時跑。

**Fork context 膨脹**：fork 模式會把父 agent 的完整對話歷史複製給子 agent。第一層帶 50 條訊息、第二層帶 80 條、第三層帶 120 條——input tokens 逐層膨脹，而且是乘上並行數。

依 AutoGen 社群 2025 年的回報，無上限的對話迴圈曾造成部分使用者 40% 的預算超支。這不是理論風險，是實際發生過的事。

## 各家框架怎麼做

### Anthropic：Claude Agent SDK + Managed Agents

依 [Anthropic 文件](https://docs.anthropic.com/en/docs/agents)，Anthropic 在 2026 年推出三層分級機制：

| 機制 | 類型 | 說明 |
|---|---|---|
| **Session Budget** | 硬美元 cap | 設在 session 層級，到頂回傳 `budget_reached` stop reason，暫停而非終止 |
| **Task Budget** | 軟 token 提示 | server-side 注入倒數計時，模型自行分配優先級，接近預算時主動收尾 |
| `max_tokens` per tool call | per-call | 限制單次工具呼叫的輸出 token |

Task Budget 是最有意思的設計——它不是硬擋，而是讓模型「知道」預算快用完了，自行決定要省著用還是趕快收尾。依 Anthropic 的說法，這在 Opus 4.7+ 上效果最好。

Managed Agents 的計費結構是 token 費率 + $0.08/session-hour + tool costs。

另外值得一提的是 [Claude Code](https://code.claude.com/docs/en/workflows) 的 Dynamic Workflow 系統。它提供 `budget.remaining()` 原語讓腳本在編排過程中查詢剩餘 token 預算，搭配 `pipeline()` / `parallel()` / `agent({schema})` 做確定性編排。單次 run 最多 1,000 個 agent、16 並發，支援中斷後 resume（cache hit）。這是目前唯一把預算追蹤做成一級原語的 coding agent。

### OpenAI：Codex CLI

依 [Codex 官方文件](https://openai.com/index/codex-now-generally-available/)，Codex 走 Manager / Worker 模式，提供六個原語：`spawn_agent`、`send_message`、`followup_task`、`wait_agent`、`list_agents`、`close_agent`。

成本控制方面，Codex 相對克制：
- `config.toml` 設定 `max_concurrent_threads_per_session`
- Cloud 版每任務獨立沙盒容器，fire-and-forget
- 沒有內建的 token 預算機制——靠 OpenAI 帳號層級的 spend limit

[Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) 是 OpenAI 開源的獨立編排層，用 Linear 當 control plane 把 issue 映射到 Codex agent，但它也沒有 per-task 的 token budget。

### Microsoft Agent Framework（2026-04 GA）

[Microsoft Agent Framework](https://github.com/microsoft/agents) 合併了 AutoGen 的 agent 抽象和 Semantic Kernel 的企業功能，兩者進入維護模式。它的核心理念叫 **TokenOps**：

> 超支時優先「原地干預」——壓縮 context、快取結果、縮減輸出。Kill switch 是最後手段。

具體機制：

- `ChatClientAgentRunOptions.max_tokens`：per-call 輸出上限
- **Termination middleware**：composable 的終止條件，包括 `TokenUsageTermination`
- **三級反應**：接近閾值 → throttle（降速）→ pause（暫停等確認）→ terminate（終止）
- 接近預算時自動壓縮 context 或降級模型

TokenOps 的思路是：先壓縮再降級再停止，不要一刀切。

MAF 的前身 AutoGen 是個值得記住的教訓。AutoGen 0.2 的 `GroupChat` 讓多個 agent 自由對話，沒有內建的 token 預算或輪次上限，社群回報 40% 的預算超支。2024 年 11 月原作者離開微軟後 fork 出 [AG2](https://github.com/ag2ai/ag2)，微軟自己則做了 async-first 的 AutoGen 0.4 重寫。到了 2026 年 4 月，微軟決定把 AutoGen + Semantic Kernel 合併成 MAF，AutoGen 正式進入[維護模式](https://github.com/microsoft/autogen/discussions/7066)。從「無上限對話」到「分級 TokenOps」，這條路走了將近兩年。

### LangGraph

[LangGraph](https://langchain-ai.github.io/langgraph/) 的做法最直接：

- `recursion_limit`（預設 25）——硬擋遞迴深度
- 每個 node 是離散的 LLM 呼叫，可個別計量
- 排程器尊重 rate limit
- 搭配 [LangSmith](https://smith.langchain.com/) 可做逐 node 的 token 追蹤

LangGraph 的優勢是顯式圖結構讓成本最可預測——你畫了幾個 node，最多就跑幾次。但它沒有內建的 token 預算機制，需要自己在 node 邏輯裡實作。

### CrewAI

[CrewAI](https://docs.crewai.com/) 走 per-agent 分級：

- `max_iter=5`：每個 agent 最多跑 5 輪，防無限迴圈
- `max_tokens=2000`：限單次輸出長度
- **per-agent 模型分級**：關鍵步驟用 Claude Opus / GPT-4o，雜務用 Haiku / GPT-4o-mini

CrewAI 的特色是模型分級做得很自然——建立 agent 時直接指定不同模型，不需要額外的 routing 邏輯。

### Amazon Bedrock Agents

[Bedrock Agents](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html) 是平台級護欄：

- Session idle timeout：60–5,400 秒
- [Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)：內容過濾 / PII / 拒答主題，獨立於模型
- 每分鐘 50K token 上限（記憶擷取）
- Lambda 執行 timeout 最長 3,600 秒

Bedrock 的優勢是護欄在 platform 層面，不需要應用層自己管。缺點是彈性低——你不能做「接近預算時降級模型」這種 application-level 的邏輯。

### 社群共識（Dify）

[Dify](https://dify.ai/) 社群整理出三層控制的最佳實踐：

1. **Per-model 月預算上限**：防單一模型暴衝
2. **Per-conversation token ceiling**：單次對話的硬上限
3. **子 agent timeout + token limit**：每個子任務獨立設限

額外建議：70% 預算時自動降級模型、50% 日預算時觸發告警。

## 業界共識：先軟著陸再硬擋

整理下來，分級反應已經是共識：

```
正常 → 接近預算(壓縮/降級) → 到預算(暫停/告警) → 超預算(終止)
```

各家做法的差異在「靠誰判斷」：

- **Anthropic Task Budget**：靠模型自己判斷要收尾了（soft hint）
- **Microsoft TokenOps**：靠 middleware 自動壓縮和降級（系統自動）
- **Bedrock Guardrails**：靠平台硬擋（無 application-level 控制）
- **CrewAI**：靠開發者在建 agent 時就分好模型等級（設計期決定）

沒有哪個是「對的」——取決於你要多少控制權。但**只有一級（硬擋）是不夠的**，這一點所有框架都同意。

## 實作建議

根據這些框架的經驗，multi-agent 系統的成本控制至少需要：

1. **基本護欄**（必做）：迭代上限、並行上限、巢狀深度上限、硬性 timeout
2. **Token 預算**（必做）：per-turn 或 per-session 的 token 上限，超過就拒絕新的 spawn
3. **歷史截斷**（高優先）：fork 模式不要無限帶歷史，截斷到最近 N 條或做摘要
4. **分級反應**（中優先）：接近預算時壓縮 / 降級，到預算才硬擋
5. **可觀測性**（中優先）：逐 agent 的 token 消耗可視化，不然問題發生時你不知道錢花在哪
6. **結果快取**（低優先）：相同 task + context 的 spawn 結果快取，避免重複呼叫

其中第 3 點容易被忽略——fork 模式的 context 膨脹是乘法級的，深層 spawn 很快就會撞到模型的 context window 上限，在那之前帳單早就爆了。

## 整體來說

Multi-Agent 的成本控制不是一個開關的問題，是一組分層機制。業界正從「設個上限就好」走向「分級反應 + 模型自覺」。Anthropic 的 Task Budget 讓模型自己省錢、Microsoft 的 TokenOps 讓系統自動降級，都比單純的硬擋聰明得多。

如果你正在建 multi-agent 系統，最低標準是：迭代上限 + token 預算 + 並行限制。進階做法是：加歷史截斷 + 分級反應。最終目標是讓系統在預算內自己找到最高效的方式完成任務，而不是跑到一半突然被掐斷。

## 參考資料

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Patterns and problems in multiagent systems](https://www.anthropic.com/research/multiagent-systems)
- [Claude Code — Dynamic Workflows 官方文件](https://code.claude.com/docs/en/workflows)
- [OpenAI — Codex GA 官方公告](https://openai.com/index/codex-now-generally-available/)
- [OpenAI — Symphony 開源編排層](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [Microsoft Agent Framework](https://github.com/microsoft/agents)
- [Microsoft — AutoGen 進入維護模式討論](https://github.com/microsoft/autogen/discussions/7066)
- [Microsoft — AutoGen to Agent Framework 遷移指南](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain — Benchmarking Multi-Agent Architectures](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)
- [LangSmith — Tracing & Observability](https://smith.langchain.com/)
- [CrewAI Documentation](https://docs.crewai.com/)
- [Amazon Bedrock Agents](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html)
- [Amazon Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)
- [Dify — Open-source LLM app development platform](https://dify.ai/)
- [AG2 — Community fork of AutoGen](https://github.com/ag2ai/ag2)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
