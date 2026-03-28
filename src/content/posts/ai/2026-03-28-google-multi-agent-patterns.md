---
title: "Google 的八種 Multi-Agent 設計模式"
date: 2026-03-28
category: ai
tags: [multi-agent, design-patterns, google, agent-architecture, generator-critic, orchestration]
lang: zh-TW
tldr: "Google 整理了八種 multi-agent 設計模式：從最簡單的 Sequential Pipeline 到可組合的 Composite Pattern。不是越複雜越好——選對模式比堆 agent 重要。"
description: "導讀 Google 發布的八種 multi-agent 設計模式，涵蓋 Sequential Pipeline、Coordinator、Parallel Fan-Out、Hierarchical Decomposition、Generator & Critic、Iterative Refinement、Human in the Loop、Composite Pattern，附各模式的適用場景與取捨分析。"
draft: false
---

Google 在 2026 年初透過 Cloud Architecture Center 發布了一份 [multi-agent 設計模式指南](https://docs.google.com/architecture/choose-design-pattern-agentic-ai-system)，InfoQ 的 Sergio De Simone 做了一篇很好的 [整理報導](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/)。八種模式從簡單到複雜排列，每一種解決不同類型的問題。

這篇把八種模式拆開，加上跟 [Anthropic harness design](/posts/ai/2026-03-28-anthropic-harness-design) 的對照。

---

## 1. Sequential Pipeline

最簡單的模式。Agent 依固定順序處理任務，前一個的輸出是後一個的輸入。

```
Agent A → Agent B → Agent C → 結果
```

**適合**：流程固定、步驟明確的任務，例如「翻譯 → 校對 → 排版」。

**限制**：任何一步卡住，整條鏈停擺。沒有彈性。

---

## 2. Coordinator / Dispatcher

Sequential Pipeline 的進化版。一個 coordinator agent 接收請求，判斷應該交給哪個專門 agent 處理。

```
         ┌→ Agent A（技術問題）
請求 → Coordinator ─┼→ Agent B（帳務問題）
         └→ Agent C（一般查詢）
```

**適合**：客服路由、任務分類。

**跟 Anthropic 的關聯**：Anthropic 的 Initializer Agent 有一部分 coordinator 的角色——它判斷目前狀態，決定接下來該做什麼。

---

## 3. Parallel Fan-Out / Gather

多個 agent 同時處理不同面向，最後由一個 synthesizer 彙整。

```
         ┌→ Style Agent    ─┐
請求 → ──┼→ Security Agent  ─┼→ Synthesizer → 結果
         └→ Performance Agent─┘
```

**適合**：需要多角度分析的任務，例如 PR review（同時查 style、security、performance）。

**關鍵取捨**：速度快（平行處理），但 synthesizer 的彙整品質決定最終結果。各 agent 之間不共享中間狀態。

---

## 4. Hierarchical Decomposition

高層 agent 把複雜目標拆成子任務，分配給下層 agent，下層還可以再往下拆。

```
高層 Agent
  ├→ 子任務 Agent 1
  │    ├→ 子子任務 1a
  │    └→ 子子任務 1b
  └→ 子任務 Agent 2
```

**適合**：大型複雜任務，例如「建一個完整的 web app」。

**跟 Anthropic 的關聯**：Anthropic 的 Initializer Agent 把一個高階目標拆成 200+ 個 feature，就是 hierarchical decomposition 的實踐。差別在於 Anthropic 是預先拆解（init 時一次完成），而不是動態拆解。

---

## 5. Generator & Critic

一個 agent 負責生成，另一個負責評審。

```
Generator → 產出 → Critic → 通過？
                      │        ↓ Yes → 結果
                      └─ No → 回饋 → Generator（重做）
```

**這正是 Anthropic harness design 的核心模式。** Anthropic 用 GAN 來比喻，Google 用 Generator & Critic 來命名——本質相同。

**為什麼有效**：分離生成和評估，避免模型自評偏寬的問題。Evaluator 可以搭配自動化測試工具（Playwright、Puppeteer）做客觀驗證，不只是靠語言判斷。

---

## 6. Iterative Refinement

Generator & Critic 的延伸版。加入一個 Refiner agent，critic 和 refiner 交替工作，逐步提升品質。

```
Generator → Critic → Refiner → Critic → Refiner → ... → 結果
```

**適合**：對品質要求極高的任務，例如前端設計、文案撰寫。

**取捨**：品質更好，但 token 消耗和延遲線性增長。需要設定收斂條件（例如最多 N 輪），否則可能無限迴圈。

---

## 7. Human in the Loop

對不可逆或高風險操作，暫停執行等待人類確認。

```
Agent → 準備執行 → ⏸️ 人類審核 → ✅ 繼續 / ❌ 中止
```

**適合**：金融交易、程式碼部署、公開發布內容。

**跟 [三大支柱文章](/posts/ai/2026-03-17-ai-agents-context-cognition-action) 的關聯**：那篇提到的 Action 層風險管理（human-in-the-loop、reversibility check）就是這個模式。

---

## 8. Composite Pattern

把以上任何模式組合起來。真實世界的 agent 系統幾乎都是 composite。

```
Coordinator → 路由
  ├→ Parallel Fan-Out（多角度分析）
  │    └→ Generator & Critic（品質迴圈）
  └→ Human in the Loop（高風險確認）
```

**Anthropic 的完整 harness 就是一個 composite**：Hierarchical Decomposition（拆 feature）+ Sequential Pipeline（一個一個做）+ Generator & Critic（生成-評估迴圈）+ 自動化測試（替代部分 human-in-the-loop）。

---

## 怎麼選？

| 你的情況 | 建議模式 |
|---------|---------|
| 流程固定、步驟明確 | Sequential Pipeline |
| 請求類型多元，需要分流 | Coordinator |
| 需要多角度同時分析 | Parallel Fan-Out |
| 任務大且複雜 | Hierarchical Decomposition |
| 品質是第一優先 | Generator & Critic / Iterative Refinement |
| 涉及不可逆操作 | Human in the Loop |
| 以上都需要 | Composite |

Google 和 Anthropic 有一個共同的建議：**從最簡單的模式開始，只在特定失敗模式出現時才升級複雜度。** 多 agent 的協調成本是真實的，過度設計的危害不亞於設計不足。

---

## 整體來說

這八種模式不是理論清單，而是實際可選的工具箱。讀完之後回頭看 [Anthropic 的 harness design](/posts/ai/2026-03-28-anthropic-harness-design)，你會發現他們的架構可以精確地用這些模式來描述。理論和實踐在這裡匯合了。

最重要的一點：**不是 agent 越多越好，而是模式選對最重要。** 一個設計精良的雙 agent 系統（Generator + Critic），可以打敗一個設計糟糕的五 agent 系統。

---

## 延伸閱讀

- [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design) — 實戰中的 composite pattern
- [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) — 為什麼會走到 multi-agent
- [Phil Schmid：為什麼 Agent Harness 是 2026 年最重要的事](/posts/ai/2026-03-28-phil-schmid-agent-harness) — Harness 作為基礎設施的視角
- [AI Agent 的三個核心支柱：Context、Cognition、Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — Agent 架構理論框架
- [Google's Eight Essential Multi-Agent Design Patterns — InfoQ 原文](https://www.infoq.com/news/2026/01/multi-agent-design-patterns/)
- [Choose a Design Pattern for Your Agentic AI System — Google Cloud](https://docs.google.com/architecture/choose-design-pattern-agentic-ai-system)
