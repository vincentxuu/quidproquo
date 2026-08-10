---
title: "概念界線：agent、workflow、RAG、MCP 到底差在哪"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, llm, mcp, rag, agentic-ai]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 1
tldr: "workflow 與 agent 的分界是「步數由誰決定」——開發者在設計時決定是 workflow，模型在執行時決定是 agent。依這個定義，今天大多數上線的 LLM 系統其實是 workflow。附 agent / RAG / MCP 的可操作判準。"
description: "釐清 agent、workflow、RAG、MCP 四個常被混用的概念：Anthropic 的 workflow/agent 分界、五種編排模式、agent 迴圈的四個輸出分支與三族 guardrail，以及選 RAG 還是選 agent 的判準。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)

這是「Agent 生產線」系列的第一篇。整個系列的材料來自把 [ByteByteGo](https://blog.bytebytego.com/) 2025–2026 年約六十篇 agent 相關文章讀完，再回查十九份它引用的一手來源。第一篇先把四個最常被混用的詞分開——因為後面六篇談的所有工程取捨，都建立在這幾條界線上。

## Agent 是什麼：LLM + 工具 + 記憶 + 迴圈

最乾淨的定義是把 agent 拆成四個東西：一個負責推理的 LLM、一組能對外界動手的工具、跨輪次保留資訊的記憶，以及把三者串起來反覆執行的迴圈。

ByteByteAI 頻道那支影片的比喻最好懂：LLM 是大腦，它能推理，但**不能開瀏覽器、不能寄信、不能查資料庫**；agent 是幫大腦裝上手和眼睛的那層軟體。關鍵的一句是「**agent 不是一種新模型，是編排這個系統的軟體**」——這句話決定了整個系列的立場。

迴圈本身有四步：**perceive → reason → act → observe**。其中 observe 是一等公民，不是收尾動作。[〈The Agent Loop〉](https://blog.bytebytego.com/p/the-agent-loop-how-ai-goes-from-answering)點出：拿掉 observe，迴圈就退化成一條 chain，模型只能靠「預期會發生什麼」推進，而不是靠「實際發生了什麼」。

每一輪模型的輸出會走四個分支之一（這個切法引自 OpenAI Agents SDK）：

| 分支 | 意思 |
|---|---|
| final answer | 收工，把結果交出去 |
| tool call | 我需要對外界做一件事 |
| handoff | 這件事該交給另一個 agent |
| continued thought | 還沒想完，再想一輪 |

Guardrail 則依**位置**分三族，而不是依內容分類：**input**（第一輪之前，常用小模型當守門員）、**tool**（每次工具呼叫的前後各一道）、**output**（迴圈結束後、使用者看到之前）。這個分法在後面談安全時會再用到，因為 agent 真正的破口幾乎都在中間那一族。

一個常被漏掉的元件是 **exit condition**。EP215 的五元件解剖（Brain / Planning / Tools / Memory / Loop）沒有列它，留言區有人批評得很準：「知道什麼時候該停，比知道下一步做什麼難得多。」這個批評成立，而且後面第四篇會看到 Stripe 直接把它做成硬上限。

## workflow 與 agent 的分界：步數由誰決定

這是整個領域最常被行銷語言蓋掉的一條界線。[Anthropic 在《Building Effective Agents》](https://www.anthropic.com/engineering/building-effective-agents)給的定義很精確：

> Workflows 是 LLM 與工具透過**預先寫好的程式路徑**編排的系統；Agents 是 LLM **動態主導自己的流程與工具使用**的系統。

換句話說，差別不在「有沒有用 LLM」，也不在「複不複雜」，而在**步數與路徑是誰決定的**：開發者在設計時決定就是 workflow，模型在執行時決定就是 agent。

依這個標準，〈The Agent Loop〉下了一個對整個產業行銷語言的糾正：**今天大多數上線的 LLM 系統其實是 workflow，不是 agent。** 這不是貶義——第二篇會看到，「盡量往 workflow 那端靠」正是各家生產系統一致的做法。

兩者共同的基本構件是 Anthropic 說的 **augmented LLM**：一個 LLM，外加檢索、工具與記憶。Anthropic 自己的建議比多數導讀都保守：

> 對很多應用而言，把單次 LLM 呼叫加上檢索與範例優化好，通常就夠了。

### 五種 workflow 編排模式

Anthropic 列的五種，切分軸一致：

1. **prompt chaining**——把任務拆成固定的連續步驟，每步的輸出餵給下一步
2. **routing**——先分類，再導到專門的處理路徑
3. **parallelization**——分兩種變體：sectioning（拆成互不相干的子任務同時做）與 voting（同一件事跑多次取共識）
4. **orchestrator-workers**——一個主導者動態拆任務、派給 worker、彙整結果
5. **evaluator-optimizer**——一個產生、一個評分，來回迭代

> ⚠️ 站內另有一篇〈Top AI Agentic Workflow Patterns〉也講「五種模式」（Reflection / Tool Use / ReAct / Planning / Multi-Agent），但**切分軸完全不同、沒有標任何出處，而且把 Tool Use 這種「能力」跟編排模式並列**。兩篇之間沒有交叉引用。要用就用有出處的那一套。

## Agent、RAG、MCP：三個問題，不是三個競品

這三個詞經常被放在同一句話裡比較，但它們回答的其實是不同層次的問題。

| | 管什麼 | 關鍵限制 |
|---|---|---|
| **MCP** | LLM 怎麼「用」工具——發現、呼叫、結構化回傳的標準介面 | **不決定做什麼** |
| **RAG** | 模型在 runtime「知道」什麼。模型凍結、不重訓 | **不採取行動，只改善答案** |
| **Agent** | 「做事」：observe → reason → decide → act → repeat | 更多 token、更難 debug |

可操作的判準只有一句：**答案在文件裡 → RAG；答案需要對其他系統動手 → Agent。** MCP 則是兩者都可能用到的底層介面，它不是 RAG 或 agent 的替代品。

這條判準看起來簡單，但實務上大量的過度設計都源自跳過它——把一個檢索問題包裝成多 agent 系統，於是同時付出了更多 token、更難 debug 的代價，卻沒有換到任何行動能力。

## 複合錯誤：為什麼「多幾步」不是線性變難

最後一個必須先建立的直覺是複合錯誤。每一步 95% 正確率聽起來很高，但：

- 10 步 → 0.95¹⁰ ≈ **60%**
- 20 步 → 0.95²⁰ ≈ **36%**

這解釋了一件常被誤讀的事：**編碼 agent 之所以比開放任務 agent 好用，不是因為程式碼比較簡單，而是因為測試回饋提高了每一步的可靠度，等於縮短了那條「必須全對」的鏈。** 這個觀察是後面所有工程做法的共同動機——第二篇談的「把確定性的部分還給程式碼」，本質上就是在縮短這條鏈。

## 本系列

1. **概念界線：agent、workflow、RAG、MCP 到底差在哪**（本篇）
2. [模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
3. [context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
4. [上線才是工作的開始：企業案例橫向讀](/posts/ai/2026-08-10-enterprise-agent-case-studies)
5. [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
6. [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
7. [RAG 的三種形態與 evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants)

## 參考資料

- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [ByteByteGo — The Agent Loop: How AI Goes From Answering Questions to Doing Things](https://blog.bytebytego.com/p/the-agent-loop-how-ai-goes-from-answering)
- [ByteByteGo — EP215: The Anatomy of an AI Agent](https://blog.bytebytego.com/p/ep215-the-anatomy-of-an-ai-agent)
- [ByteByteGo — EP202: MCP vs RAG vs AI Agents](https://blog.bytebytego.com/p/ep202-mcp-vs-rag-vs-ai-agents)
- [ByteByteGo — EP216: RAGs vs Agents](https://blog.bytebytego.com/p/ep216-rags-vs-agents)
- [ByteByteGo — EP218: The Typical AI Agent Stack, Explained](https://blog.bytebytego.com/p/ep218-the-typical-ai-agent-stack)
- [ByteByteGo — Top AI Agentic Workflow Patterns](https://blog.bytebytego.com/p/top-ai-agentic-workflow-patterns)
- [YouTube — What Are AI Agents & How Do They Work?（ByteByteAI）](https://www.youtube.com/watch?v=oP6DS_x5K0Y)
