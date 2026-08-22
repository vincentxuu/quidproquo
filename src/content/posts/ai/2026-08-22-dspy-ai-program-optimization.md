---
title: "DSPy：用 Signature、Metric 與 Optimizer 編譯 AI 程式"
date: 2026-08-22
category: ai
type: deep-dive
tags: [dspy, ai-agent, prompt-optimization, evaluation, machine-learning, python]
lang: zh-TW
tldr: "DSPy 不把 prompt 當手寫字串，而以 Signature 宣告任務、Module 決定執行策略，再用資料集與 metric 讓 Optimizer 編譯出較好的提示與示例。"
description: "介紹 DSPy 的 Signature、Module、Metric、Optimizer、ReAct，以及它和一般 Agent orchestration 框架的邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-dspy-ai-program-optimization-en)

[DSPy](https://dspy.ai/) 是用 Python 建立並最佳化 AI 系統的框架。它也能寫 ReAct agent、工具使用與 RAG，但核心問題不是「下一個 agent 是誰」，而是「能不能用資料和 metric 系統化改善整個 AI 程式，而不是一直手改 prompt」。

DSPy 把工作拆成三層：Signature 宣告輸入與輸出，Module 選擇 Predict、ChainOfThought、ReAct 等策略，Optimizer 再依 trainset 與 metric 編譯程式。這使 prompt 從原始碼裡的長字串，變成可以評估和產生的 artifact。

## Signature 描述任務契約

```python
import dspy

dspy.configure(lm=dspy.LM('openai/gpt-5-mini'))

class Triage(dspy.Signature):
    """Route a support ticket."""
    ticket: str = dspy.InputField()
    urgency: str = dspy.OutputField(desc='low or high')
    team: str = dspy.OutputField()

triage = dspy.Predict(Triage)
result = triage(ticket='Payment failed twice and the card was charged.')
```

Signature 說明「要完成什麼」，Module 說明「用哪種推理方式完成」。同一份 Signature 可以從 `Predict` 換成 `ChainOfThought` 或帶工具的 `ReAct`，不必重寫任務契約。

型別欄位能讓輸入輸出更清楚，但 DSPy 的主要價值不只 structured output。真正的差異在下一步：你可以定義一個 metric，拿一組案例比較不同編譯結果。

## Metric 決定「比較好」是什麼

Optimizer 不知道業務目標。你必須提供 trainset 與 scoring function，例如分類是否正確、答案是否命中必要欄位、檢索結果是否支持回答。Metric 寫錯，optimizer 只會更有效率地追錯目標。

評估資料也要切分。用同一批案例編譯又報成果，會把過度適配當成進步；至少保留未參與最佳化的測試集，並記錄模型、DSPy 版本、資料集與成本。

## Optimizer 是編譯器，不是 production runtime

[DSPy 官方文件](https://dspy.ai/)提供 GEPA、BootstrapFewShot 等 optimizers。它們可以選示例、改進 instructions 或搜尋更合適的策略，產物則能保存後載入。

這不會替代 checkpoint、排程、人工核准、RBAC 或外部副作用的 retry。DSPy module 可以放在 LangGraph、Mastra 或普通 worker 的某個節點裡：外層 runtime 負責可靠執行，DSPy 負責讓該節點的模型行為更好。

## ReAct 讓 DSPy 也能做 Agent

將普通 Python function 當工具傳給 `dspy.ReAct`，模型就能在推理迴圈中選工具。這適合把「工具選擇正不正確」納入 metric，再用 optimizer 改善行為。

如果需求主要是多角色 handoff、長時間暫停恢復或視覺化 workflow，DSPy 不是最直接的第一層。它的強項是已經知道怎樣判斷好壞，並希望把 prompt engineering 變成可重複實驗。

## 整體來說

DSPy 適合已有代表性案例與可計算 metric 的分類、抽取、RAG 或 agent 節點。沒有資料集時，先蒐集失敗案例；沒有 metric 時，先把「好答案」寫成可以逐筆核對的規則，不要急著選 optimizer。

最小驗證可從二十筆案例開始：建立 baseline、切 train/test、跑一次 optimizer，再比較未見測試集的品質、成本與延遲。它和 orchestration 框架的差異，可接著看[Agent 框架選型指南](/posts/ai/2026-08-22-agent-framework-selection-guide)與[Stanford CS329Z 導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)。

## 參考資料

- [DSPy documentation](https://dspy.ai/)
- [DSPy GitHub](https://github.com/stanfordnlp/dspy)
- [站內：2026 Agent 框架怎麼選](/posts/ai/2026-08-22-agent-framework-selection-guide)
- [站內：Stanford CS329Z Engineering AI Agents](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
