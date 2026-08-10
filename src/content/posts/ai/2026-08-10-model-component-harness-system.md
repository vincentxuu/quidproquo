---
title: "模型只是元件，harness 才是系統"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, harness-engineering, llm, agentic-ai, orchestration]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 2
tldr: "Microsoft、OpenAI、Salesforce、Stripe 等七個獨立案例講出同一句話：可靠性來自模型周圍的工程。而「把確定性的部分還給程式碼」已經被四家公司各自做成產品——Agent Script、Procedures、runtime、blueprints。"
description: "七家公司對 agent 可靠性的收斂結論、四個把確定性節點產品化的設計、Salesforce 從兩萬個部署歸納的三大反模式，以及 LinkedIn 為什麼拒絕 ReAct 改用 plan-and-execute。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-model-component-harness-system-en)

[上一篇](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)建立了 workflow 與 agent 的分界，並且留了一個伏筆：複合錯誤讓「多幾步」不是線性變難。這一篇處理業界對這件事的共同答案。

把七家公司的原話橫著排在一起，會看到一個很難忽略的收斂。

## 七家公司說了同一句話

| 來源 | 原話 |
|---|---|
| [Microsoft](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at) | 「harness matters as much as the model」 |
| [OpenAI Codex](https://blog.bytebytego.com/p/how-openai-codex-works) | 「the model is a component and the agent is the system」 |
| [Salesforce](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000) | 「能畫成流程圖的，就該是程式碼，不是 prompt」 |
| [Stripe](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs) | 「別從選模型開始。從你的開發環境、測試基礎設施、回饋迴圈開始」 |
| [OpenAI 資料平台](https://blog.bytebytego.com/p/how-openai-built-its-data-agent) | 「我們的 agent 是 pretty vanilla，可靠性來自它周圍的工程」 |
| [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) | prompt 設計是整套系統裡最重要的槓桿 |
| [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) | 「大多數自稱 AI Agent 的產品其實沒那麼 agentic，它們多半是確定性程式碼，在剛好的位置點綴幾個 LLM 步驟」 |

七篇共用同一個編輯，所以「這會不會是編輯強加的敘事框架」是個合理的懷疑。兩件事讓這個懷疑站不住：

第一，我回查了 Dex Horthy 的 [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) 原文，確認那套框架確實來自作者本人，不是轉述時被套上去的。

第二，也更關鍵的是——**OpenAI 資料平台那篇是唯一一篇「自己勸自己不要做複雜架構」的**。他們的 agent 是單一模型加上 context assembly、精選工具與 runtime，**刻意不做** router、不混多模型、不做 fine-tune、不建複雜檢索管線，理由是每個這類選擇「都會增加成本、延遲，和更多失敗的方式」。而這套刻意樸素的系統要撐的規模是 1.5 EB 資料、九萬個資料集、約四千名內部使用者。一個團隊主動說「我們沒做那些酷東西」，很難用「編輯想講一個好故事」解釋掉。

## 「把確定性的部分還給程式碼」被產品化四次

收斂如果只停在口號，價值有限。真正有份量的是：四家公司各自把同一個想法做成了產品。

- **Salesforce 的 Agent Script**——用 TypeScript 寫「意圖符合 X 就跳過推理迴圈，直接跑這串工具」
- **Intercom 的 Procedures**——自然語言推理外加確定性控制：決策點的 conditional steps、保證同輸入同輸出的小段程式碼、敏感動作前暫停等人工核可的 checkpoint
- **Microsoft 的 runtime**——只把真正需要推理的部分送給 LLM
- **Stripe 的 blueprints**——一串節點，「實作功能」「修 CI 失敗」給完整的 agentic loop，**「跑 linter」「推分支」寫死**

Stripe 給的理由最直接：有些事永遠不該交給 agent 判斷，而且每個確定性節點就是**少一個會出錯的地方**——回到上一篇的複合錯誤，這等於直接縮短那條必須全對的鏈，而且在每天數百次執行下會複利。

四家獨立做出結構相同的東西，比七句話彼此呼應更有說服力。單純的觀點收斂可能來自互相閱讀，產品化則要投入工程資源。

## Salesforce 的三大反模式

從兩萬個企業部署歸納出來的三條，第一條正好是上一節的反面：

1. **該用程式碼的地方用 LLM 推理**
2. **不斷加強語氣的 prompt，而不是把規則寫成 policy**——「NEVER」「ALWAYS」加粗加驚嘆號沒有用
3. **爛的 context engineering**——他們舉的例子是把 `get_orders` 的回傳從 100K tokens 壓到 2K

第二條值得多說一句。用大寫和驚嘆號去加強 prompt，是一種很自然的直覺：既然模型沒照做，那就講得更大聲。但這個做法的失效模式是它**看起來有效**——加了之後測試通過了，於是規則被留在 prompt 裡，直到某個邊界情況下模型再次無視它。把同一條規則寫成程式碼裡的 policy 檢查，成本差不多，但它不會有心情。

## 同一條原則在迴圈層：LinkedIn 拒絕 ReAct

ReAct（thought → action → observation）幾乎是 agent 迴圈的預設答案。但 [LinkedIn 的 Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered) **明確拒絕了它**，改用 plan-and-execute：Planner 先把請求拆成結構化計畫，Executor 再逐步執行，每一步跑自己的推理迴圈。

理由是一句很直白的話：「**LLM 被要求同時處理太多事情時會變得不可靠。**」

這跟 Agent Script、blueprints 是同一條原則的不同層級——都是在縮小模型「一次要決定的範圍」。附帶好處是成本可控：規劃階段用貴模型，簡單步驟用便宜模型。

這是我在整批材料裡看到唯一一個生產系統對 ReAct 的實質反對，值得記下來，因為多數導讀會把 ReAct 講成通用解。

## 所以該怎麼改善一套 agent 系統

這條收斂有個很實際的推論：**換模型通常是最沒槓桿的那個動作。**

Microsoft 講得更狠——模型不是資料庫版本。你可以換 Postgres 版本並期待東西照常運作，但換模型不行，每個模型性質不同，harness 都要重調。他們舉的例子是新模型發表時，GitHub Copilot CLI 團隊得重調重測才敢出貨。

真正有槓桿的是別的地方：環境（第四篇的 Stripe）、context 與記憶的裁剪（第三篇）、回饋迴圈的速度（第四篇的 Salesforce），以及知道什麼時候該停下來交還給人。

## 本系列

1. [概念界線：agent、workflow、RAG、MCP 到底差在哪](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)
2. **模型只是元件，harness 才是系統**（本篇）
3. [context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
4. [上線才是工作的開始：企業案例橫向讀](/posts/ai/2026-08-10-enterprise-agent-case-studies)
5. [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
6. [引用之前：把 19 份一手來源查一遍](/posts/ai/2026-08-10-verifying-agent-numbers)
7. [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
8. [RAG 的三種形態與 evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants)

## 參考資料

- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — What Salesforce Learned from 20,000 Enterprise Agent Deployments](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000)
- [ByteByteGo — How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [ByteByteGo — How OpenAI Built Its Data Agent](https://blog.bytebytego.com/p/how-openai-built-its-data-agent)
- [ByteByteGo — How OpenAI Codex Works](https://blog.bytebytego.com/p/how-openai-codex-works)
- [ByteByteGo — How LinkedIn Built an AI-Powered Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered)
- [ByteByteGo — Best Practices for Building AI Agents That Work in Production](https://blog.bytebytego.com/p/best-practices-for-building-ai-agents)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Dex Horthy — 12-Factor Agents](https://github.com/humanlayer/12-factor-agents)
- [Intercom — What's new with Fin 3](https://www.intercom.com/blog/whats-new-with-fin-3/)
