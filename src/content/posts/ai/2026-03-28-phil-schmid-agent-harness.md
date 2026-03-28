---
title: "Phil Schmid：為什麼 Agent Harness 是 2026 年最重要的事"
date: 2026-03-28
category: ai
tags: [harness-engineering, ai-agents, agent-harness, model-drift, benchmarks, claude-code]
lang: zh-TW
tldr: "模型是 CPU，harness 是作業系統，agent 是應用程式。模型能力再強，沒有好的 harness 就只是 demo。Phil Schmid 認為 harness 是 2026 年 AI 工程最關鍵的基礎設施。"
description: "導讀 Phil Schmid 的 The Importance of Agent Harness in 2026，從 CPU/OS/App 比喻到 model drift、context durability、benchmarks 的局限，理解為什麼 agent harness 是 2026 年 AI 工程的核心議題。"
draft: false
---

Phil Schmid（前 Hugging Face）在 2026 年初寫了 [The Importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026)，開頭就丟出一句判斷：**如果 2025 年是 agent 的元年，2026 年就是 agent harness 的元年。**

這篇不長，但概念密度很高。以下是拆解。

---

## 一個比喻搞懂 Harness 的定位

Phil 用了一個很直覺的電腦比喻：

| 電腦 | AI Agent 系統 |
|------|-------------|
| **CPU** | **Model** — 提供原始運算能力 |
| **作業系統** | **Agent Harness** — 管理 context、處理啟動流程、提供標準驅動（工具處理） |
| **應用程式** | **Agent** — 跑在 OS 上的具體使用邏輯 |

這個比喻的重點是：**harness 不是 agent 本身，也不是 framework。** 它在 framework 之上、agent 之下。

Framework（如 LangChain、Claude Agent SDK）提供的是積木——工具整合、agentic loop 的實作。Harness 提供的是更高層的東西：prompt 預設、工具呼叫的 opinionated handling、lifecycle hooks、planning 能力、子 agent 管理。

簡單說：framework 給你零件，harness 給你一台組裝好的機器。

---

## The Bitter Lesson：不要過度工程

Phil 提出一個嚴厲的警告：

> 2024 年需要複雜 hand-coded pipeline 才能做到的事，2026 年一個 context window prompt 就搞定了。

這意味著什麼？**你今天寫的 harness 邏輯，明天可能因為模型升級而過時。**

所以 harness 的設計必須允許你隨時拆掉「聰明」的部分。如果你過度工程化了控制流，下一次模型更新就會打破你的系統——不是因為模型變差了，而是因為你的 workaround 變成了障礙。

這跟 [Anthropic 的觀察](/posts/ai/2026-03-28-anthropic-harness-design)完全一致：從 Sonnet 4.5 升級到 Opus 4.5 後，context reset 機制直接拿掉，因為模型自己解決了 context anxiety。

---

## Benchmarks 的盲區

Phil 指出現有 benchmarks 有一個致命盲區：**它們幾乎不測試模型在第 50 或第 100 次工具呼叫之後的表現。**

一個模型可能在一兩次嘗試內解開難題，但連續跑一個小時後就開始忽略初始指令。這種「持久度」問題，標準 benchmark 完全測不到。

這就是為什麼 harness 不只是執行環境，也是**驗證環境**——它讓你能測試模型在你的真實場景下，長時間運行後的實際表現，而不是靠 benchmark 的數字猜測。

---

## Context Durability 與 Model Drift

Phil 提出了兩個前瞻性的概念：

### Context Durability（Context 耐久性）

隨著 agent 運行時間越長，context 的品質會逐漸退化——不是 context window 不夠大，而是累積的資訊開始干擾決策。Harness 需要主動管理 context 的「健康度」，而不只是被動地往裡面塞東西。

### Model Drift（模型漂移）

當模型在第 100 步之後開始偏離初始指令，這就是 model drift。Phil 認為 harness 會成為偵測 drift 的主要工具——它可以在每個階段檢查模型是否還在遵循原始意圖，這些偵測數據甚至可以回饋到訓練流程。

---

## 現在有哪些 Harness？

Phil 直說了：**通用型 harness 目前還很少。**

- **Claude Code** 是目前最典型的例子——它不只是一個 CLI，而是一個完整的 agent harness，包含 prompt 管理、工具編排、lifecycle hooks、子 agent 管理
- **Claude Agent SDK** 和 **LangChain DeepAgents** 正在嘗試標準化
- 所有 coding CLI（Cursor、Windsurf 等）本質上都是特定領域的 agent harness

但真正的通用 harness 標準還沒出現。

---

## 整體來說

Phil 這篇的核心訊息用一句話總結：

> Intelligence without infrastructure is just a demo.

模型能力是必要條件，但不是充分條件。2026 年 AI 工程的競爭不在誰用的模型更好（前沿模型的能力正在趨近），而在誰的 harness 設計得更好——誰能讓同一個模型跑得更穩、更久、更可靠。

---

## 延伸閱讀

- [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design) — Anthropic 的實戰案例
- [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) — 三個階段的完整脈絡
- [Google 的八種 Multi-Agent 設計模式](/posts/ai/2026-03-28-google-multi-agent-patterns) — 設計模式分類
- [AI Agent 的三個核心支柱：Context、Cognition、Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — Agent 架構理論框架
- [The Importance of Agent Harness in 2026 — Phil Schmid 原文](https://www.philschmid.de/agent-harness-2026)
