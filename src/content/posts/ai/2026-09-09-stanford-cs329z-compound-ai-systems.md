---
title: "Stanford CS329Z 導讀 Week 1：別再只調模型了，好成績是系統工程堆出來的"
date: 2026-09-09
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 2
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 20
tldr: "CS329Z 第一週主讀物是 Zaharia 等人的 Compound AI Systems：SOTA 越來越靠多元件系統拿下，單一模型再大也只是零件；文章留下三個設計問題與三大挑戰，剛好就是 HW1 要你動手回答的題目。"
description: "帶讀 Stanford CS329Z Week 1 主讀物：複合式 AI 系統的定義、走向系統的三個理由、三個設計問題、三大挑戰與四個新興方向，以及它如何對應 HW1 的手刻 RAG 與 DSPy 重寫。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en)

[CS329Z](https://cs329z.stanford.edu/) 第一堂課只指定了一篇主讀物：Matei Zaharia 領銜的 [The Shift from Models to Compound AI Systems](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)（BAIR Blog）。作者群橫跨 Berkeley、Stanford 與 Databricks。選它當開場白，整門課的立場就說完了：這門課不賭下一個大模型會帶來什麼能力，只關心一件事——用今天的零件把系統架到最好。第一堂課的三個關鍵字 decomposition、data、evaluation，全是從這篇文章長出來的。

這篇導讀照文章的論證走：先給定義，再講為什麼非走系統不可，然後是它留下的三個設計問題、三大挑戰、四個新興方向。最後我會把每個段落連回課程——[HW1 要你交的東西](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，其實就是這篇文章的動手版。

## 定義：系統和模型差在哪

原文的定義只有一句話。複合式 AI 系統用**多個互相配合的元件**解任務，包括多次模型呼叫、檢索器、外部工具。AI 模型則只是一個統計模型，例如預測下一個 token 的 Transformer。

判斷方法很直接：你的東西能不能只用「換一個更大的模型」來變強？如果還需要檢索、工具、多步推理，那它就是系統。RAG、tool use、agent loop 全是實例。

## 為什麼非走系統不可：四個理由

第一，**有些任務靠系統設計更好漲分**。LLM 有漂亮的 scaling law，但很多應用裡砸訓練費的回報不如做系統。原文舉的是假設數字：最強 LLM 解競賽題正確率三成，訓練預算翻三倍也只漲到三成五，依然不堪用。反過來，用今天的模型多次採樣加測試篩選，正確率可以拉到八成。更關鍵的是迭代速度：改系統按天算，等訓練按月算。高價值應用兩邊都會要——好的 LLM 做出讓人驚豔卻不可靠的 demo，工程團隊再把它一點一點調成可用，這條路每家都在走。

第二，**系統可以是動態的**。模型定格在訓練截止那天，要新知識只能靠檢索這類元件；訓練還讓模型「看過」整個訓練集，所以要做存取控制（只能答使用者有權限檔案的問題）也得靠系統。

第三，**控制與信任比較做得出來**。神經網路很難保證不出現某些行為，但系統可以在外面加過濾；LLM 會幻覺，但接上檢索就能附引用、自動驗事實。

第四，**預算因人而異**。每個模型品質和成本都固定，但應用要的都不一樣。行內補全嫌最強模型太貴，Copilot 用調好的小模型加搜尋啟發式就行。反過來，有人願意花幾塊錢買一份正確的法律意見，而不是花幾分錢問 GPT-4。要吃下這份預算，只能靠系統設計。做系統的另一面就是做取捨。

## 留下的三個設計問題

文章沒有給答案，給了三個問題，個個都是 HW1 的考題：

1. **控制邏輯寫在哪？** 用傳統程式（Python 調 LLM）還是讓模型自己開車（LLM agent 調工具）？這正是 HW1 Part A 手刻和 Part B 框架的對照。
2. **資源投在哪？** RAG 管線裡，多花的 FLOPS 該給檢索器還是給 LLM？還是多調幾次 LLM？原文給了具體形狀：如果問答要在 100 毫秒內回來，20 毫秒給檢索、80 毫秒給 LLM，還是反過來？沒有通用答案，只能量。
3. **怎麼端到端優化？** 神經網路靠可微分反向傳播調參。系統裡有搜尋引擎、直譯器這種不可微分的零件，怎麼對著一個指標把它整條調到最好？

## 三大挑戰

第一，**設計空間太大**。光是 retriever 加 language model 的 RAG，就有模型選型、query expansion、reranking、再加一個 LLM 檢查輸出有沒有貼著檢索段落等組合。開發者要在這片空間裡找好設計，目前靠手感。

第二，**元件要一起調才會強**。理想上，LLM 要學會為「這台」檢索器生成好查的 query，檢索器也要偏好「這個」LLM 好用的答案。各調各的會留下效能。

第三，**優化方法還在長**。單模型有 PyTorch；複合系統要新方法。一個方向是 [DSPy](https://dspy.ai/)：第一個想對 LLM 呼叫加工具的管線做通用優化的框架。給它指標，它自動生 prompt 指令、few-shot 範例、調每個模組。另一條路是 LaMDA、Toolformer、AlphaGeometry：訓練時就讓模型學會用工具。

## 四個新興方向

**組裝框架**分成三類。傳統程式調用的元件庫：[LangChain](https://www.langchain.com/)、[LlamaIndex](https://www.llamaindex.ai/)。讓 LLM 開車的 agent 框架：AutoGPT 那一系。輸出控制工具：Guardrails、Outlines、SGLang。推理策略（chain-of-thought、self-consistency、WikiChat、RAG）也在同一層。

**自動把品質調上去**：DSPy。寫法是自然語言 signature（例如 `user_question -> search_query`），欄位名字本身就有意義，框架把它變成 prompt、範例甚至權重更新。效果像 PyTorch，只差模組不一定可微分。

**把成本調下來**：FrugalGPT 學一個路由策略，把輸入分派給不同模型串接。它背後是更大的 AI gateway 概念（Databricks AI Gateway、OpenRouter、Martian）。系統切得越碎，每段越好各自優化。

**營運**：[LangSmith](https://www.langchain.com/langsmith)、Phoenix Traces 這類追蹤工具，把每步的中間輸出記下來、視覺化、對回資料品質。研究端有 DSPy Assertions（拿監控回饋直接改輸出）和 MT-Bench、FAVA、ARES 這類自動化品質監控。原文還點了一個反直覺風險：聊天機器人加內容過濾器這種組合，可能冒出單一模型沒有的安全破口。系統的安全要整條看，不能只驗零件。

## 怎麼做：今晚就能動手的最小實驗

**怎麼做**：照 HW1 Part A 的縮小版，挑一個你答得不好的問答任務，用 litellm 手刻兩段式 RAG（檢索器加一次 LLM 呼叫）。先量 baseline，再只換檢索器量一次、只換 prompt 量一次，記下哪邊漲分多。這就是第三節第二題的最小實驗。

## 它在課程裡的位置

這篇是地圖，後面十一週是走法。RAG 與 tool use 是 Part A 的零件課，DSPy 是 Part B，optimization 與 evaluation 是 HW2 的零件課。讀的時候把「三個設計問題」當書籤：每週結束回來問一次，這週回答了哪一題。

## 延伸閱讀：同一週的另外兩篇

課表 Week 1 除了主讀物還有兩篇 additional readings，份量較輕，放在這裡一起收。

**Ng 的四個 agent 設計模式**（[The Batch, 2024](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance)）：Reflection（自己檢查自己）、Tool Use、Planning、多智慧體協作。論點只有一句：別讓 LLM 一次把答案吐完，多輪、有工具、有計畫地走，品質才會上去。注意它和 Week 2 Anthropic 分類的對應關係：Ng 的四個是能力方向，Anthropic 的五個是施工形狀；Reflection 對應 evaluator-optimizer，Planning 對應 orchestrator-workers。讀完 Week 2 再回來看這篇，會發現同一批概念被講了兩遍——一遍是方向，一遍是工法。

**Si 等人的 execution-grounded 自動化 AI 研究**（[arXiv:2601.14525](https://arxiv.org/abs/2601.14525)，2026；注意授課者 Diyi Yang 掛名作者）：LLM 生的研究點子看起來漂亮，做下去常常不行。解法是拿執行結果當 ground truth：自動把點子實作成 code，大規模平行跑 GPU 實驗，再用演化搜尋或 RL 從回饋裡學。十個搜尋 epoch 內找到的 post-training 配方打敗 GRPO baseline（69.4% 對 48.0%）。但有兩盆冷水： frontier 模型想法早熟、很快飽和；RL 只拉高平均分，拉不高上限（多樣性崩掉）。這篇是 Week 11「science agents 與 open problems」的前菜：evaluation 這件事，連研究 AI 的 AI 都逃不掉。

## 本週 Course Material 對照

- 週三 9/23 Foundations & Landscape：主讀物 Zaharia 等人 Compound AI Systems（本文已導讀）；延伸閱讀 Ng 四設計模式、Si 等人 execution-grounded（見上節延伸閱讀）。
- 課表原文：[CS329Z 官網 Week 1](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[Stanford CS329Z 導讀：先用 litellm 手刻一遍 agent，再讓 DSPy 把它收走](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z: Engineering AI Agents 官網（含課表與作業時程）](https://cs329z.stanford.edu/)
- 原文：[Zaharia et al., The Shift from Models to Compound AI Systems, BAIR Blog (2024)](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)
- 框架：[DSPy 官網](https://dspy.ai/)、[LangChain](https://www.langchain.com/)、[LlamaIndex](https://www.llamaindex.ai/)
