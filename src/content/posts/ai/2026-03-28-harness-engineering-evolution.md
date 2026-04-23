---
title: "從 Prompt 到 Harness：AI 工程的三次演化"
date: 2026-03-28
type: guide
category: ai
tags: [harness-engineering, prompt-engineering, context-engineering, ai-agent, agentic-ai]
lang: zh-TW
tldr: "AI 工程經歷三個階段：Prompt Engineering（寫好指令）→ Context Engineering（餵對資訊）→ Harness Engineering（設計整個工作環境）。每一次演化不是取代前者，而是在更高的抽象層級上操作。"
description: "導讀 Epsilla 的 The Third Evolution 文章，整理 AI 互動從 prompt engineering 到 context engineering 再到 harness engineering 的演化脈絡，以及為什麼 2026 年的重點是設計 agent 的執行環境而非調整 prompt。"
draft: false
---

Epsilla 在 2026 年 3 月發了一篇 [The Third Evolution: Why Harness Engineering Replaced Prompting in 2026](https://www.epsilla.com/blogs/harness-engineering-evolution-prompt-context-autonomous-agents)，把過去四年 AI 工程的演化整理成三個清晰的階段。如果你一直有在跟 AI 工程的發展但覺得越來越碎片化，這篇能幫你把脈絡接起來。

---

## 三個階段

### Phase 1：Prompt Engineering（2022-2024）

重點在**寫好一條指令**。

這個階段的核心問題是：怎麼措辭才能讓模型給出最好的回答？Chain-of-thought、few-shot examples、role prompting——所有技巧都圍繞著同一件事：在一次呼叫裡，用最精準的語言引導模型。

限制很明顯：你能塞進一條 prompt 的資訊量是有限的，而且模型只被呼叫一次。

### Phase 2：Context Engineering（2025）

重點從「怎麼問」轉移到**「餵什麼資訊」**。

Andrej Karpathy 的定義最精準：Context engineering 是「把恰好正確的資訊，在恰好正確的時機，填進 context window」的藝術。

這個階段的工程重心是 RAG、memory 系統、tool definitions、conversation management——不再只是調 prompt，而是設計整個資訊流，確保模型在做每一個決策時都有足夠且相關的背景。

但 context engineering 仍然聚焦在**單一決策點**：為模型的下一步提供最好的輸入。

### Phase 3：Harness Engineering（2026）

重點再上一層：設計**整個工作環境和規則系統**。

Harness engineering 不只管單一決策的 context，而是管 agent 的整個生命週期——啟動儀式、工具約束、回饋迴圈、品質閘門、跨 session 狀態。它關心的問題是：agent 連續工作好幾個小時，怎麼確保它不偏離、不退化、不犯同樣的錯？

三者的關係不是取代，而是層層疊加：

```
Harness Engineering    ← 管整個執行環境和生命週期
  └─ Context Engineering  ← 管每一步的資訊輸入
       └─ Prompt Engineering  ← 管單一指令的措辭
```

---

## 為什麼需要 Harness？

Epsilla 引用了 Anthropic 和 OpenAI 的共同觀察：**模型無法可靠地評估自己的工作。**

這不是模型笨，而是結構性問題——讓一個 agent 同時當運動員和裁判，它會傾向對自己寬容。所以外部約束不是可選的，是必要的。

核心論點是一句反直覺的話：

> 用規則、回饋迴圈和 linter 約束 agent 的解空間，反而會提升它的生產力和可靠性。

自由度越大不代表表現越好。適當的約束讓 agent 不需要浪費算力在「該不該做這件事」上，直接專注在「怎麼做好這件事」。

---

## Harness 的關鍵設計原則

Epsilla 整理了幾條規則：

**1. Repository 是 agent 唯一的真相來源**

不假設外部知識。agent 需要的一切都應該存在 repo 裡。這跟 [Anthropic 的 `claude-progress.txt` 做法](/posts/ai/2026-03-28-anthropic-harness-design) 是同一個思路——把狀態寫進檔案系統，而不是依賴模型的記憶。

**2. 程式碼要 agent-readable，不只是 human-readable**

清晰一致的結構、充分的註解——因為 agent 沒有你腦中的隱性知識，它只看得到寫出來的東西。

**3. 架構約束用 linter 強制，不用 prompt 請求**

你不是「請」agent 遵守規則，你「讓它不可能」違反規則。Prompt 是建議，linter 是法律。

**4. 自主權漸進授予**

不是一開始就放手讓 agent 做所有事。設定階段和閘門，在每個階段驗證後才開放下一步。

---

## Generator-Evaluator：核心架構模式

跟 [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design) 一樣，Epsilla 也強調了 GAN 啟發的雙 agent 架構是 harness 的核心組件：

- **Generator**：負責生成
- **Evaluator**：獨立驗證，結果回饋給 generator

這個模式之所以重要，是因為它解決了模型自評不可靠的根本問題。不是讓模型更聰明，而是用架構補上這個結構性缺陷。

---

## 整體來說

這篇文章最大的價值是把散落各處的觀念串成一條清晰的演化線。如果你之前覺得「prompt engineering 還沒搞懂，怎麼又冒出 context engineering，現在又來 harness engineering」——它們不是彼此取代的潮流，而是同一條路上越走越高的抽象層級。

每一層解決的問題不同：
- **Prompt**：模型聽不懂我要什麼 → 換個說法
- **Context**：模型缺乏背景資訊 → 補上相關知識
- **Harness**：模型在長時間任務中失控 → 設計約束和回饋系統

2026 年的重點不是寫更好的 prompt，而是建更好的環境。

---

## 延伸閱讀

- [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design) — Anthropic 兩篇 harness design 文章的導讀
- [Phil Schmid：為什麼 Agent Harness 是 2026 年最重要的事](/posts/ai/2026-03-28-phil-schmid-agent-harness) — 從 CPU/OS/App 比喻理解 harness 的定位
- [Google 的八種 Multi-Agent 設計模式](/posts/ai/2026-03-28-google-multi-agent-patterns) — Generator-Critic 等模式的完整分類
- [AI Agent 的三個核心支柱：Context、Cognition、Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — Agent 架構的理論框架
- [The Third Evolution — Epsilla 原文](https://www.epsilla.com/blogs/harness-engineering-evolution-prompt-context-autonomous-agents)

## 參考資料

- [The Third Evolution: Why Harness Engineering Replaced Prompting in 2026](https://www.epsilla.com/blogs/harness-engineering-evolution-prompt-context-autonomous-agents) — Epsilla 原文，三個演化階段的完整論述
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic agent 設計哲學，「找最簡單方案」的核心原則
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Harness Engineering 的實戰案例，雙 Agent 架構
- [The Importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026) — Phil Schmid 對 Harness 作為 AI 作業系統的定位論述
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv 論文，LLM agent 架構的學術綜述
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction) — MCP，Harness Engineering 時代的工具標準化協議
- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — 實作 harness 編排層的代表性框架
