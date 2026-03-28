---
title: "Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作"
date: 2026-03-28
category: ai
tags: [harness-design, ai-agents, anthropic, claude, multi-agent, long-running-agents, agent-sdk]
lang: zh-TW
tldr: "同一個模型在不同的 harness 設計下會產生截然不同的結果。Anthropic 用雙 Agent 架構、跨 session 狀態檔、GAN 式 generator-evaluator 迴圈，讓 Claude 能自主完成數小時的軟體開發任務。"
description: "導讀 Anthropic 工程部落格的兩篇 harness design 文章，拆解長時間運行 AI agent 的架構設計：雙 Agent 架構、claude-progress.txt 狀態傳遞、GAN 啟發的生成-評估迴圈，以及模型進步如何改變框架設計。"
draft: false
---

Anthropic 工程團隊在 2025 年底到 2026 年初陸續發了兩篇關於 harness design 的文章，分別是 [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) 和 [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps)。兩篇合在一起，幾乎是目前公開文獻中對「怎麼讓 AI agent 持續工作好幾個小時」最完整的實戰紀錄。

這篇是導讀，把兩篇的核心觀點拆開來看。如果你讀過 [AI Agent 的三個核心支柱：Context、Cognition、Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action)，這兩篇可以當作那個理論框架的實戰案例——Anthropic 怎麼在實際的 agent 系統中解決 context 斷裂、認知迴圈、行動驗證的問題。

---

## 什麼是 Harness？

Harness 是包裹在 LLM 外層的執行框架——決定模型何時被呼叫、給什麼 prompt、怎麼處理輸出、搭配什麼工具。你可以把它想成模型的「工作環境」。

Anthropic 的核心論點很直接：**同一個模型，在不同的 harness 設計下，會產生截然不同的結果。** 模型能力的天花板往往不在模型本身，而在你怎麼設計它的執行框架。

這跟他們之前在 [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) 提出的理念一脈相承：找最簡單的方案，只在必要時增加複雜度。

---

## 問題：Context Window 是斷裂的

長時間運行的 agent 面臨一個根本性的挑戰——context window 有限，而複雜專案不可能在一個 window 內完成。

這跟 [Context 那篇](/posts/ai/2026-03-17-ai-agents-context-cognition-action) 說的一樣：LLM 的 context window 就是 RAM，對話結束一切歸零。Anthropic 面對的正是這個問題的極端版本——不是一次對話記不住，而是一個要跑好幾個小時的 agent 必須跨越數十個 session。

每次新 session 啟動時，agent 對之前的工作**一無所知**。就像輪班的工程師：前一班走了，新來的人看著一堆程式碼，不知道做到哪、下一步該幹嘛。

即使是 Opus 4.5 這樣的頂級模型，直接跑也會出問題：

- **貪心一口氣做完**：試圖 one-shot 整個應用，context 用完時功能只做了一半
- **沒有留紀錄**：下一個 session 無法接手，只能重新理解整個 codebase

---

## 解法一：雙 Agent 架構

Anthropic 的第一個突破是把工作拆成兩個角色。

### Initializer Agent（初始化者）

只在首次運行時啟動，負責搭建整個工作環境：

- 產生 `feature_list.json`——200+ 個細粒度功能，全部標記為 `failing`
- 初始化 git repo 並建立初始 commit
- 建立 `claude-progress.txt` 進度日誌
- 產生 `init.sh` 啟動腳本

用 JSON 而不是 Markdown 記錄功能清單是刻意的選擇——模型比較不會亂改 JSON 的結構。

### Coding Agent（編碼者）

每個 session 做一件事：**增量完成一個功能，留下清晰的 artifact 給下一個 session。**

每次啟動有固定儀式：

1. 跑 `pwd`，確認工作目錄
2. 讀 git log 和 `claude-progress.txt`
3. 選最高優先級的未完成功能
4. 跑 `init.sh` 啟動 dev server
5. 做 smoke test 確認環境正常
6. 才開始寫新功能

這套儀式的設計邏輯是：**讓 agent 在動手之前，先搞清楚現在在哪。**

---

## 關鍵機制：`claude-progress.txt`

這是整個架構中最優雅的部分。

`claude-progress.txt` 搭配 git history，讓每個新 session 的 agent 能在幾秒內理解：目前做到哪了、哪些功能完成了、哪些還沒做、上一個 session 遇到什麼問題。

它不是什麼高科技——就是一個純文字檔案。但它解決了長時間 agent 最關鍵的問題：**跨 session 的狀態傳遞。** 用三大支柱的語言來說，這是最低成本的 episodic memory 實作——不需要 vector database，不需要 Mem0，一個文字檔就夠了。

---

## 解法二：GAN 啟發的 Generator-Evaluator 迴圈

第二篇文章更進一步，引入了借鑑 GAN（生成對抗網路）的架構。

### 為什麼需要這個？

沒有外部回饋時，Claude 傾向產出「安全但平庸」的結果——前端設計技術上可用，但視覺上毫無特色。模型天生會避險，走向最常見的佈局。

### 怎麼做？

把生成和評估拆成兩個獨立的 agent：

- **Generator Agent**：負責寫程式碼、做前端設計
- **Evaluator Agent**：獨立的嚴格評審，依照四項標準打分

關鍵洞見是：**調教一個獨立的 evaluator 讓它嚴格挑剔，遠比讓 generator 自我批判來得容易。** 有了外部回饋，generator 才有具體的目標可以迭代。這本質上就是 [Cognition 篇](/posts/ai/2026-03-17-ai-agents-context-cognition-action) 提到的 Self-Reflection 機制——只是 Anthropic 把反思能力外包給了另一個 agent，而不是讓同一個 agent 自我反省。

搭配 Playwright 做自動化端對端測試，整個系統可以自主迭代好幾個小時——generator 產出、evaluator 打槍、generator 再改，直到通過標準。

---

## 模型進步如何改變 Harness 設計

這裡有一個很值得注意的觀察。

第一篇文章使用的是 Sonnet 4.5，當時發現模型在長 context 中會出現「context anxiety」——隨著 context 變長，品質會明顯下降。所以他們在架構中加了 **context reset** 機制，定期清空重來。

到了第二篇，升級到 Opus 4.5 後，這個問題自己消失了。模型本身就能穩定處理長 context，於是 context reset 被直接拿掉，改成單一連續 session，讓 Claude Agent SDK 的自動 compaction 處理 context 增長。

Anthropic 從這裡得出一個重要原則：

> Harness 的每個組件都編碼了一個「模型做不到」的假設。這些假設值得不斷壓力測試——因為它們可能是錯的，也可能隨模型進步而過時。

換句話說，好的 harness 不是寫完就不動的。模型升級了，harness 也該跟著簡化。

---

## 開放問題

Anthropic 自己也承認還沒有定論的事：

- **單一通用 agent vs. 多個專門 agent**：一個什麼都會的 agent 好，還是把測試、QA、code cleanup 拆給不同的專門 agent 更好？
- **成本權衡**：結構化 harness 會增加 token 消耗和延遲，什麼時候值得、什麼時候不值得？

---

## 整體來說

這兩篇文章最大的價值不在於具體的架構（雙 agent、progress file 這些），而在於背後的思考方式：

1. **模型的能力上限，往往是 harness 設計的問題，不是模型的問題。**
2. **每個 harness 組件都是一個假設——要持續驗證這些假設是否還成立。**
3. **隨著模型進步，有趣的 harness 組合空間不會縮小，只會移動。** AI 工程師的工作是持續找到下一個新穎的組合。

如果你在做任何長時間運行的 agent 系統，這兩篇值得反覆讀。不是照抄架構，而是學這套「先觀察模型在哪裡失敗，再用最小的框架補上」的方法論。

---

## 延伸閱讀

**Anthropic 原文與基礎**
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic 的 agent 設計哲學起點，6 種 composable pattern
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — 本文導讀的第一篇原文
- [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — 本文導讀的第二篇原文
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic 的 agent 評估方法論，跟 evaluator agent 設計直接相關

**Harness Engineering 趨勢**
- [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) — Prompt → Context → Harness 三個時代的演化
- [Phil Schmid：為什麼 Agent Harness 是 2026 年最重要的事](/posts/ai/2026-03-28-phil-schmid-agent-harness) — 為什麼 harness 才是決定 agent 成敗的關鍵
- [Google 的八種 Multi-Agent 設計模式](/posts/ai/2026-03-28-google-multi-agent-patterns) — Google 的 8 種 multi-agent 設計模式，可與 Anthropic 做法對照

**站內相關**
- [AI Agent 的三個核心支柱：Context、Cognition、Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — 理解 agent 架構的理論框架，本文是它的實戰對照
