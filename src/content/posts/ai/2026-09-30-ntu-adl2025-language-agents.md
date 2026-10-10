---
title: "台大 ADL 2025 第 11 講：Language Agents 的推理、記憶、規劃與多代理"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, multi-agent, agent-memory]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 14
tldr: "ADL Fall 2025 第 11 講以 EMNLP 2024 的 Language Agents tutorial 為底，把 agent 定義成「感知環境並採取行動的實體」，再指出 language agent 的新東西：推理本身也是一種內部行動。講義用推理、記憶、規劃三個概念組織整講，推理這段講 CoT 與 ReAct，記憶這段講 Generative Agents 的 recency／importance／relevance 檢索，規劃這段從貪婪的反應式規劃講到 tree search 與 world model，最後用初始化、協作、團隊優化三步驟講多代理系統。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）11/10 的 Language Agents 講義與影片 11.1–11.5：agent 的一般定義與 language agent 的差別、logical／neural／language agent 的演進、CoT 與 ReAct、推理擴大行動空間、短期與長期記憶、Generative Agents、社會模擬、規劃範式與 world model（Deep Dyna-Q、D3Q、LLM 當使用者模擬器）、多代理系統的初始化、協作與團隊優化。"
draft: false
glossary:
  - term: "language agent"
    aliases: ["語言代理"]
    definition: "把 LLM 整合進 agent，用語言表示感知與外部行動，並把「生成推理 token」當成一種內部行動的 agent。"
    context: "講義第 5 頁的定義。"
  - term: "ReAct"
    definition: "讓 LLM 交錯產生推理（Thought）與行動（Action），並把環境回傳的觀察（Observation）接回下一步推理的做法。"
    context: "講義第 13–17 頁引 Yao 等人 2022，結論是推理與行動兩者都不可少。"
  - term: "world model"
    aliases: ["世界模型"]
    definition: "環境模擬器：給定目前狀態與要採取的行動，預測接下來會發生什麼（下一個狀態或觀察）。"
    context: "講義第 38–47 頁用它串起對話規劃與 web agent 的 model-based planning。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en)

這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 14 篇。ADL Fall 2025（114-1，2025/09/01–12/15）在 11/10 上這一講，[課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)把這一週標為線上（Virtual）。這是課程頁上最後一個附講義的講次，之後三列（Knowledge／Multimodality、Personalization、Reasoning）只有標題。

**本文依據**：講義 [Language Agents（251110_LangAgent.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf)（65 頁），以及五支影片：[11.1 Language Agents Introduction 最近熱門的語言模型 Agent 是甚麼？](https://youtu.be/R0YBJve0NoI)（21:11）、[11.2 Reasoning 推論以進行內部反思](https://youtu.be/UO527XuWEzg)（21:40）、[11.3 Memory 長期記憶中有各種重要資訊](https://youtu.be/nAcLNc-H5Sc)（19:28）、[11.4 Planning 達成長期目標進行短期規劃](https://youtu.be/ny7qcF1BzaA)（23:19）、[11.5 Multi-Agent Systems 多人討論後效果更加](https://youtu.be/0b8NdMfZ8Fs)（19:38）。講義於 2026-09-30 打開核對，本文頁碼都指講義 PDF。

> **版本提醒**：講義封面寫 November 10th, 2025，並註明以 [EMNLP 2024 的 Language Agents tutorial](https://language-agent-tutorial.github.io/) 為參考。五支影片在 2025/11/10 上傳到 Fall 2025 播放清單，但說明欄標的日期是 2024/12/04。本文沒有逐頁比對影片畫面與 2025 講義，兩者有出入時以講義為準。

**系列位置**：上一篇 [偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)｜下一篇 [Reasoning（影片限定）](/posts/ai/2026-09-30-ntu-adl2025-reasoning)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

這一講沒有對應作業，講義與影片都公開，沒有額外缺口，系列整體的存取分級是 A2。它要回答的問題是：**大家都在講 agent，它到底是什麼？推理、記憶、規劃、多代理各自解決什麼？**

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=R0YBJve0NoI
title: ADL 11.1: Language Agents Introduction（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=UO527XuWEzg
title: ADL 11.2: Reasoning（YouTube）
```

原始影片：[ADL 11.1: Language Agents Introduction（YouTube）](https://www.youtube.com/watch?v=R0YBJve0NoI)、[ADL 11.2: Reasoning（YouTube）](https://www.youtube.com/watch?v=UO527XuWEzg)、[ADL 11.3: Memory（YouTube）](https://www.youtube.com/watch?v=nAcLNc-H5Sc)、[ADL 11.4: Planning（YouTube）](https://www.youtube.com/watch?v=ny7qcF1BzaA)、[ADL 11.5: Multi-Agent Systems（YouTube）](https://www.youtube.com/watch?v=0b8NdMfZ8Fs)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## Agent 是什麼，language agent 又多了什麼

第 2 頁先擺出兩邊的聲音：Bill Gates、Andrew Ng、Sam Altman 看好 agent，另一邊則說目前的 agent 只是 LLM 的薄包裝、自回歸 LLM 永遠無法推理或規劃。講義沒有選邊，而是回到定義。

第 3–4 頁引 Russell 與 Norvig 的《AI: A Modern Approach》：agent 是透過感測器感知環境、透過致動器作用於環境的任何東西。簡化成一句：**agent 是會感知、會行動的實體**；理性的 agent 選擇能最大化（期望）效用的行動。

第 5 頁說明 language agent 的新意：

- 生成推理 token 可以看成一種**內部行動**，發生在內在獨白（inner monologue）式的內部環境裡。
- 自我反思是「後設」推理，也就是對推理過程再推理。
- 推理是為了行動得更好：推斷環境狀態、重新規劃等。
- 感知與外部行動都用語言表示。

第 6 頁的表格把 agent 分三代比較：

| | Logical agent | Neural agent | Language agent |
|---|---|---|---|
| 表達力 | 低：受限於邏輯語言 | 中：小型神經網路能編碼的 | 高：幾乎任何能說出口的 |
| 推理 | 邏輯推論：嚴謹、明確、僵硬 | 參數化推論：隨機、隱含、僵硬 | 以語言推理：模糊、半明確、彈性 |
| 適應性 | 低：受限於知識整理 | 中：資料驅動但樣本效率差 | 高：LLM 的強先驗加上語言使用 |

第 7 頁定下整講的三個關鍵概念：**推理、記憶、規劃**。

## 推理：CoT 與 ReAct

第 9 頁把 language agent 的行動空間整理成三種：推理（更新短期記憶，也就是 context window）、檢索與學習（讀寫長期記憶）、規劃（在推論時選擇外部行動）。

- **[Chain-of-Thought](https://arxiv.org/abs/2201.11903)**（Wei 等人 2022，第 10 頁）：讓模型生成中間步驟，模仿人的思考過程。
- **推理幫助行動、行動也幫助推理**（第 11–12 頁）：第 12 頁的例子是問「你知道台大的陳縕儂嗎？」，模型先搜尋，再根據搜尋結果回答。
- **[ReAct](https://arxiv.org/abs/2210.03629)**（Yao 等人 2022，第 13–17 頁）：推理與行動交錯進行。講義的兩個結論是「兩者都不可少」，以及推理為控制行動提供了解釋。

第 18–19 頁補一個比較抽象但重要的觀點：**推理擴大了行動空間**。語言與推理的空間是無限的，行動空間變大代表能力更強，但決策也更難；LLM 透過模仿各種人類推理軌跡，學到推理的先驗。第 20 頁接著引 Yao 等人 2023，談用行動規劃改進推理。

本系列的[下一篇 Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning) 只有影片、沒有投影片，所以會回頭引用這裡第 8–20 頁的 CoT 與 ReAct。

## 記憶：短期、長期與 Generative Agents

第 22 頁的對照很好記：

| | 短期記憶 | 長期記憶 |
|---|---|---|
| 形式 | Instruction、Thought、Action、Obs 依序累加 | 可讀可寫 |
| 內容 | 目前任務的 context | 經驗、知識、技能 |
| 限制 | 只能追加；context 有限；注意力有限 | — |
| 持久性 | 換新任務就不保留 | 跨新經驗持續保存 |

**[Generative Agents](https://arxiv.org/abs/2304.03442)**（Park 等人 2023，第 23–25 頁）面對的問題是：context window 裝不下所有事件流，也很難注意到相關的事件。做法分兩步：先模擬一連串事件形成情節記憶，再檢索記憶。第 25 頁的重點是**檢索要同時考慮 recency、importance 與 relevance**，不能只看相關性。

第 26–30 頁是社會模擬 agent（Zhang 等人 2024）：同一句「我通過律師考試了！」，自己剛升遷的 agent 會說「辦個派對慶祝」，自己也考但沒過的 agent 則回得很勉強。講義用這組研究說明 agent 的「自身情緒」會改變回應，模擬團體討論時，負面情緒傾向反對、正面情緒傾向同意，正面情緒的團體比較容易做出和平的決定。

## 規劃：從反應式、tree search 到 world model

第 32 頁的定義：給定目標 G，決定一串行動 (a0, a1, …, an)，使最後的狀態通過目標檢驗 g(·)。

講義用幾個例子鋪陳：

- **常識推論的規劃**（Kuo & Chen 2023，第 33 頁）：使用者只說「我想規劃去舊金山的旅行」，agent 推出隱含的訂機票與訂房意圖，再依序叫出航空與訂房 bot。
- **Web 規劃 agent**（Deng 等人 2024，第 34 頁）：把任務拆成多個網頁操作。

第 35–37 頁比較三種規劃範式：

| 範式 | 優點 | 缺點 |
|---|---|---|
| 反應式（每步直接決定） | 快、好實作 | 貪婪、短視 |
| 在真實環境做 tree search（[Koh 等人 2024](https://arxiv.org/abs/2407.01476)） | 有系統地探索 | 有不可逆的行動、不安全、慢 |
| 用 world model 做 model-based planning | 更快、更安全、有系統地探索 | 要怎麼得到 world model？ |

### World model

第 38 頁：**world model 是環境模擬器**，回答「在狀態 s_t 做行動 a_t，接下來會發生什麼」。第 39–42 頁用兩篇對話策略學習的研究說明（第 41 頁列出 D3Q 的作者，陳縕儂是其中之一）：

- **[Deep Dyna-Q](https://arxiv.org/abs/1801.06176)**（Peng 等人 2018）：跟真實使用者互動時，同時學一個 world model 產生模擬經驗來規劃。問題是假經驗品質差會拖累策略學習。
- **[D3Q](https://arxiv.org/abs/1808.09442)**（Su 等人 2018）：加一個判別器把品質差的模擬經驗濾掉，策略學習更穩健，人工評估也有改善。

第 43–45 頁把這條線接到 LLM：**LLM 可以直接當使用者模擬器**。第 44 頁給了外向型與內向型兩個 persona 的角色扮演 prompt，講義的結論是這樣很容易做出多樣的使用者模擬器來訓練助理；第 45 頁再說 LLM 在某些情況下能預測狀態轉移。第 46–47 頁引 [Gu 等人 2024](https://arxiv.org/abs/2411.06559) 的 web agent：在 VisualWebArena 上，model-based planning 比反應式規劃準，也比 tree search 有效率。

## 多代理系統

第 49 頁列出動機：單一 agent 不夠強、容易平行擴展、不同 agent 代表不同專長、去中心化控制與隱私保護。第 50 頁把建構流程分成三步，後面每一步配兩個例子：

1. **Agent 初始化**：用 persona 描述（第 52 頁，Generative Agents 裡藥局老闆 John Lin 的長段設定），或用角色與行動來定義（Chen 等人 2024，第 53–54 頁）。
2. **協作流程**：[多代理辯論](https://arxiv.org/abs/2305.14325)（Du 等人 2023，第 56–58 頁）能改善事實性與推理；[AutoGen](https://arxiv.org/abs/2308.08155)（Wu 等人 2023，第 59–60 頁）讓 agent 透過對話互動，講義稱之為 conversational programming。
3. **團隊優化**：透過挑選 agent 優化團隊（[Liu 等人 2024](https://arxiv.org/abs/2310.02170)，第 62–63 頁），優化後同樣的團隊規模效果更好，API 呼叫也更少。

第 64 頁的總結把三個概念各壓成一兩句：推理是 agent 的內部行動，推理引導行動、行動更新推理；language agent 同時跟外部環境與內部記憶互動；用語言推理帶來新的規劃能力。

## 自學怎麼用這一講

1. 先看 11.1，把第 5 頁「推理是內部行動」和第 9 頁的三種行動空間弄清楚，後面四支都建立在這上面。
2. 11.2 搭配 ReAct 原論文讀；11.3 搭配 Generative Agents 原論文的記憶檢索那一節。
3. 11.4 的規劃範式表（第 37 頁）是整講最實用的一張，看完試著把你知道的 agent 框架歸到這三格裡。

今晚可以做的一件事：拿你正在用或正在做的一個 agent，照第 22 頁的表寫下它的短期記憶與長期記憶各放了什麼，再問自己檢索長期記憶時有沒有考慮 recency 與 importance，還是只看相關性。

## 延伸閱讀

- [CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)：整門課講 agent，尤其是 [Lecture 4：Skills 與 Memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory) 和 [Lecture 5：Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning)。
- [CME295 第 7 講：Agentic LLM](/posts/ai/2026-09-29-cme295-agentic-llms) 與 [CME295 2026 第 6 講預習：AI Agents](/posts/ai/2026-09-29-cme295-ai-agents)
- [CS224N 第 10 講：RAG 與 Language Agents 的六個元件](/posts/ai/2026-08-22-cs224n-rag-language-agents)

上一篇：[偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)
下一篇：[Reasoning（影片限定）](/posts/ai/2026-09-30-ntu-adl2025-reasoning)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 11/10 課表列
- [Language Agents 講義（251110_LangAgent.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) — 本文所有頁碼
- [EMNLP 2024 Tutorial: Language Agents: Foundations, Prospects, and Risks](https://language-agent-tutorial.github.io/) — 講義的參考來源
- [ADL 11.1: Language Agents Introduction（YouTube）](https://youtu.be/R0YBJve0NoI)
- [ADL 11.2: Reasoning（YouTube）](https://youtu.be/UO527XuWEzg)
- [ADL 11.3: Memory（YouTube）](https://youtu.be/nAcLNc-H5Sc)
- [ADL 11.4: Planning（YouTube）](https://youtu.be/ny7qcF1BzaA)
- [ADL 11.5: Multi-Agent Systems（YouTube）](https://youtu.be/0b8NdMfZ8Fs)
- [Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Yao et al., ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Park et al., Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
- [Koh et al., Tree Search for Language Model Agents](https://arxiv.org/abs/2407.01476)
- [Peng et al., Deep Dyna-Q: Integrating Planning for Task-Completion Dialogue Policy Learning](https://arxiv.org/abs/1801.06176)
- [Su et al., Discriminative Deep Dyna-Q: Robust Planning for Dialogue Policy Learning (EMNLP 2018)](https://arxiv.org/abs/1808.09442)
- [Gu et al., Is Your LLM Secretly a World Model of the Internet? Model-Based Planning for Web Agents](https://arxiv.org/abs/2411.06559)
- [Du et al., Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325)
- [Wu et al., AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)
- [Liu et al., A Dynamic LLM-Powered Agent Network for Task-Oriented Agent Collaboration](https://arxiv.org/abs/2310.02170)
