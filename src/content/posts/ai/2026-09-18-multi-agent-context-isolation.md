---
title: "Multi-Agent Context 管理：Fork vs Fresh、歷史截斷、結果壓縮的設計取捨"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, context-engineering, agent, anthropic, openai, langgraph, cost-optimization]
lang: zh-TW
tldr: "子 agent 要不要看到父對話？Fork 帶完整歷史但 token 指數膨脹，Fresh 省錢但缺背景。業界共識：預設 Fresh，需要時才 Fork，且一定要搭歷史截斷和結果壓縮。"
description: "Multi-Agent 系統實戰系列第四篇。深入 fork/fresh context 模式、歷史截斷策略、結果壓縮機制，從 Claude Code 到 Antigravity 的實作比較。"
draft: false
series:
  name: "Multi-Agent 系統實戰"
  order: 4
---

Multi-Agent 系統裡最容易被低估的問題不是「怎麼讓 agent 合作」，而是「每個 agent 該看到多少資訊」。

給太多——token 爆炸、成本失控、模型被無關資訊淹沒。給太少——子 agent 缺乏背景做出錯誤判斷。這篇整理各家框架在 context 隔離與共享上的設計選擇。

## Fork vs Fresh：兩種基本模式

幾乎所有支援 subagent 的框架都面臨同一個選擇：子 agent 要繼承父的對話歷史嗎？

### Fresh（空白開始）

子 agent 只收到任務描述，不帶任何父對話歷史。

依 [Anthropic 的 agent 設計指南](https://docs.anthropic.com/en/docs/agents)，Fresh 是多數場景的預設選擇。Claude Code 的 Fresh subagent 以零上文啟動，prompt 需自行完整描述任務。適合需要獨立判斷的工作——code review、安全審查、事實查核——因為繼承父 context 反而會引入偏見。

Codex 的 worker agent 也是各自獨立 context。依 [OpenAI 文件](https://openai.com/index/codex-now-generally-available/)，每個 spawn 出來的 worker 拿到的是 manager 明確傳入的任務字串，不是整段對話。

**優勢**：省 token、無 context 污染、子 agent 判斷獨立
**劣勢**：任務描述必須自足——如果父對話裡有關鍵背景沒寫進任務字串，子 agent 會缺資訊

### Fork（繼承歷史）

子 agent 收到父 agent 的完整對話歷史 + 新的任務訊息。

Claude Code 的 Fork subagent 繼承完整 context 並共享 prompt cache，所以 cache hit 的部分不重複計費。這是 fork 模式成本可接受的關鍵——如果沒有 prompt cache，fork 的 input token 成本會隨深度線性成長。

**優勢**：子 agent 有完整背景，不需要在任務描述裡重述所有前情
**劣勢**：token 消耗高、深層巢狀時 context 膨脹嚴重

### 什麼時候用哪個

| 場景 | 建議 | 原因 |
|---|---|---|
| Code review / 安全審查 | Fresh | 需要獨立判斷，繼承 context 會引入作者偏見 |
| 並行查資料 | Fresh | 每個查詢獨立，不需要知道其他查詢在做什麼 |
| 「根據剛才的討論寫摘要」 | Fork | 必須看到完整對話才能摘要 |
| 除錯：「幫我查剛才那個 error」 | Fork | 需要知道前面嘗試了什麼 |
| 批次處理 | Fresh | 每筆資料獨立處理 |

## Context 膨脹問題

Fork 模式在巢狀 spawn 時會造成 context 指數膨脹。考慮這個情境：

```
父 agent（50 條訊息，~15K tokens）
  └─ 子 agent A（fork：繼承 50 條 + 自己 20 條 = 70 條，~21K tokens）
       └─ 孫 agent A1（fork：繼承 70 條 + 自己 15 條 = 85 條，~25K tokens）
       └─ 孫 agent A2（fork：繼承 70 條 + 自己 15 條 = 85 條，~25K tokens）
  └─ 子 agent B（fork：繼承 50 條 + 自己 30 條 = 80 條，~24K tokens）
```

三層巢狀、5 個 agent，光 input tokens 就超過 110K。如果每層並行 5 個、深度 3 層，理論上限是 125 個 agent 各自帶膨脹的 context——帳單會非常壯觀。

## 業界的解法

### 結果壓縮（Result Compression）

子 agent 的完整回覆在傳回父 agent 前，先用 LLM 摘要成精簡版。

依 [Anthropic 的多 agent 研究系統實戰](https://www.anthropic.com/engineering/multi-agent-research-system)，他們的 orchestrator-worker 架構中，worker 的回覆會被壓縮後才合併進 orchestrator 的 context。這防止了一個常見問題：某個 worker 回了一大段，佔掉了後續 worker 回覆的 context 空間。

[Antigravity（原 Gemini CLI）](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md)走得更徹底——**所有** subagent 的結果都強制壓縮後才回傳主 session。這是 Antigravity 的設計哲學：主 agent 的 context 是寶貴資源，子 agent 不能隨便汙染。

### 歷史截斷（History Truncation）

Fork 模式不帶完整歷史，而是截斷到最近 N 條訊息或做摘要。

依 Microsoft Agent Framework 的 [TokenOps 理念](https://github.com/microsoft/agents)，接近預算時的第一反應不是停止，而是壓縮 context。原 AutoGen 0.2 的 `TransformMessages` 機制可以在訊息傳給 agent 前做截斷或摘要——雖然 API 已過時，概念被 MAF 繼承。

實務建議：
- Fork 模式預設只帶最近 20 條訊息（或 ~8K tokens）
- 超過的部分用 LLM 做一次性摘要，摘要結果當作第一條 system message
- 每層巢狀都截斷一次，防止逐層膨脹

### 選擇性 Context（Selective Context）

不是全帶或全不帶，而是只帶相關的部分。

[LangGraph](https://langchain-ai.github.io/langgraph/) 的 State 機制天然支援這個模式——每個 node 只存取 graph state 中自己需要的 key，不是整個對話歷史。你可以設計一個 state schema，裡面有 `user_request`、`search_results`、`analysis`、`final_report` 等 key，每個 agent node 只讀寫自己相關的部分。

這比 fork/fresh 二選一更細緻，但需要開發者自己設計 state schema——代價是更多前期設計工作。

## Prompt Cache 的角色

Fork 模式的成本很大程度取決於有沒有 prompt cache。

依 [Anthropic 的定價](https://docs.anthropic.com/en/docs/about-claude/models)，cache hit 的 input token 只收原價的 10%。Claude Code 的 Fork subagent 共享父 agent 的 prompt cache，所以繼承的 50 條歷史訊息如果都 cache hit，實際多付的只有 10%。

但這個優勢**只有在同一個 provider 且 cache 未過期時才成立**。跨 provider 的 multi-agent（例如 Windsurf 的 Cascade + Devin）沒有共享 cache，fork 模式的成本就是完整的 input token 費用。

## 整體來說

Context 管理的核心取捨是**資訊充分性 vs token 效率**：

1. **預設 Fresh**——多數任務不需要完整歷史，一句好的任務描述比 50 條對話歷史更有效
2. **需要時才 Fork**——只在子 agent 確實需要對話背景時使用
3. **Fork 必搭截斷**——不要無限帶歷史，20 條或 8K tokens 是合理的上限
4. **結果必壓縮**——子 agent 回覆傳回父之前做摘要，防止 context 汙染
5. **有 cache 就用**——prompt cache 讓 fork 模式的成本降到可接受範圍

最後一個容易被忽略的點：**context 管理不只影響成本，也影響品質**。依 [Google Research 的實驗](https://arxiv.org/abs/2512.08296)，資訊過載的 agent 表現反而比資訊精簡的差——模型被無關訊息淹沒後，會忽略真正重要的指令。少即是多。

## 參考資料

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Claude models & pricing](https://docs.anthropic.com/en/docs/about-claude/models)
- [Claude Code — Subagent types (Fork vs Fresh)](https://code.claude.com/docs/en/workflows)
- [OpenAI — Codex GA 官方公告](https://openai.com/index/codex-now-generally-available/)
- [Antigravity — Subagents 文件](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md)
- [Microsoft Agent Framework](https://github.com/microsoft/agents)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
