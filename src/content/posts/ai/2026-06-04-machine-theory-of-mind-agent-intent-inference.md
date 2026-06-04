---
title: "Machine Theory of Mind：Agent 如何推斷其他 agent 的意圖、知識與目標"
date: 2026-06-04
type: deep-dive
category: ai
tags: [theory-of-mind, multi-agent, ai-agent, llm, reasoning]
lang: zh-TW
tldr: "從觀察行為反推他者的信念/目標/意圖，學界叫 Machine Theory of Mind。三條血脈：符號 BDI、貝氏逆向規劃、深度學習 ToMnet。LLM 時代最大爭議是 ToMBench 上 GPT-4 仍落後人類 >10 分——高分到底是真推理還是統計捷徑。"
description: "解讀 Machine Theory of Mind 的三條技術路線（plan recognition/BDI、Bayesian inverse planning、ToMnet）與 LLM 時代的核心爭議：湧現派 vs 捷徑派、benchmark 為何壞掉、literal 與 functional ToM 的差別。"
draft: false
glossary:
  - term: "ToM"
    aliases: ["Theory of Mind", "心智理論"]
    definition: "從外在行為反推他者信念、目標與意圖的能力；機器版本稱 Machine Theory of Mind。"
    context: "本文整理機器具備這種能力的三條技術路線與 LLM 時代的爭議。"
  - term: "ToMnet"
    definition: "DeepMind 2018 提出的神經網路架構，透過觀察 agent 的行為軌跡學會預測其後續行為與信念，是深度學習路線 machine ToM 的代表作。"
    context: "本文用它代表「把心智推理當成 meta-learning 問題」的血脈。"
  - term: "BDI"
    aliases: ["Belief–Desire–Intention"]
    definition: "用信念（Belief）、慾望（Desire）、意圖（Intention）三元素描述 agent 心智狀態的經典框架；意圖帶承諾、不輕易動搖，對行為的預測力最強。"
    context: "本文用 BDI 作為符號路線的標準詞彙，NegotiationToM 等資料集直接用它標註對手心智。"
---

當多個 agent 要協作、談判、甚至互相欺騙時，「讀心」突然從哲學問題變成工程剛需：一個 agent 必須從**看得到的行為**，反推對方**看不見的信念、目標與意圖**。這件事在學界有正式名字——**Machine Theory of Mind（Machine ToM）**。這篇把它拆成三條技術血脈（符號規劃、貝氏推論、深度學習），再帶你看 LLM 時代最分裂的爭議：模型在心智測驗上的高分，到底是真推理，還是 Clever Hans 式的統計捷徑。一個關鍵數字先放這：在 ACL 2024 的 ToMBench 上，連 GPT-4 都還落後人類 10 個百分點以上。

## 先把問題講清楚：什麼叫「推斷他者心智」

Theory of Mind（ToM）的經典定義來自 Premack & Woodruff 1978：把信念（belief）、慾望（desire）、意圖（intention）這些**心智狀態**歸因給他人，並理解**對方的心智可能跟現實、跟自己都不同**。最難的考點是 false belief（錯誤信念）——「某人沒看到東西被移走，他會去他**以為**的位置找」。

認知科學對「人怎麼做到」有兩派說法，這兩派後來剛好對應到兩條 AI 路線：

- **Theory-Theory**：心智狀態是從觀察行為「推論」出來的 → 對應推論式模型（貝氏、符號溯因）。
- **Simulation Theory**：用自己的心智去「模擬」對方 → 對應 LLM 拿自己的世界模型 role-play 對方。

還有一個維度是 order（階層）：一階 ToM 是「他相信 X」；二階是「他相信『她相信 X』」。多數 benchmark 卡在二階以上就開始崩。

## 符號路線：Plan Recognition 與 BDI

最早的工程化做法是**溯因（abduction）**：從觀察到的動作序列，反推最能解釋它的計畫。這條線叫 Plan / Activity / Intent Recognition。值得記住的一個區分（Blaylock & Allen）：**goal recognition 是 plan recognition 的子集**——goal recognition 只問「他最頂層的目標是什麼」；plan recognition 還要回答「他在執行哪個計畫、完成到哪一步、每個動作扮演什麼角色」。早期用 Cascading HMM、合成計畫語料來做。

而 agent 用來描述心智的詞彙，幾乎都來自 **BDI（Belief–Desire–Intention）**：Bratman 1987 的哲學，經 Rao & Georgeff 形式化成帶 possible-world 語意的多模態時序邏輯，再落地成一大票 agent 程式框架。三個概念對應得很乾淨：Belief 是對世界/他者/自己的資訊，Desire(goal) 是想達成的狀態，Intention 是**帶承諾（commitment）的目標**。

這個 commitment 是關鍵。Bratman 的原話點破了為什麼「推斷意圖」比「推斷慾望」更有預測力：

> 「我下午想打籃球的慾望，只是我行為的一個潛在影響因子，它得跟其他慾望競爭才能決定我做什麼。相對地，一旦我**意圖**下午打籃球，事情就定了——我通常不必再繼續權衡利弊。」

換句話說，意圖一旦形成就驅動後續子計畫、不再反覆動搖，所以對行為的預測力遠高於慾望。BDI 原本是描述 **agent 自己** 的推理架構，但它提供了**建模他者**的標準詞彙——後面會看到的 NegotiationToM 就是直接用 BDI 來標註談判對手的心智。

## 貝氏路線：Bayesian Inverse Planning

第二條線把「讀心」變成乾淨的機率推論問題。核心想法（Baker、Saxe、Tenenbaum 一脈）是：假設對方是**近似理性的規劃者**，先寫一個「心智狀態 → 行為」的**生成模型（forward planning）**，再用貝氏定理**反轉**它——觀察到動作後，反推最可能產生這個動作的 goal 加 belief。這就是 **Bayesian Inverse Planning（BIP）**：把 ToM 推理框成「反轉一個理性決策的生成模型」。

它的價值在於**有原理、能量化不確定性**，而不是黑箱輸出一個猜測。2018 年之前，它是 ToM 計算模型的主流。重要的延伸有三個方向：

- **容忍非理性**：真實的 agent 會有錯誤的目標、計畫與動作，框架要能建模 boundedly rational agents。
- **接地到語言**：把「他知道」「他以為」這類 epistemic language，接到 BIP 推出的信念後驗上。
- **與 LLM 混血**：用 LLM 當前端，把自然語言場景轉成 BIP 能求解的形式（neuro-symbolic inverse planning），或做合作式語言引導的逆規劃來理解指令、主動協助。

代價是：你得**手寫那個生成模型與狀態空間**，要 scale 到開放域很難。

## 深度學習路線：ToMnet 與它的後裔

2018 年是分水嶺。DeepMind 的 **ToMnet**（Rabinowitz et al., ICML 2018）把 ToM 變成 meta-learning 問題。用論文自己的話：

> 「我們設計了一個 Theory of Mind 神經網路（ToMnet），用 meta-learning 來建立它所遇到的 agent 的模型——**僅憑觀察它們的行為**。」

架構是三個網路接力：

- **Character net**：吃 agent 的**過去多段軌跡**，萃取「這個 agent 是什麼性格/偏好」的 character embedding（類比長期記憶）。
- **Mental state net**：吃**當前這一集**的軌跡，推出當下的 mental state embedding（類比工作記憶）。
- **Prediction net**：結合上面兩個 embedding，預測**下一步動作、會去消耗哪個目標**。

最漂亮的結果是它**能推斷 false belief**：研究者對環境做一個「agent 看不到、但 ToMnet 看得到」的改動（例如把目標物悄悄移走），ToMnet 仍然預測 agent 會**按它的舊信念**行動——這正是 Sally-Anne 測驗的機器版。

但 ToMnet 作者在結論裡也誠實點出一個致命限制：這種顯式的 belief 推斷，**訓練時需要取得他者的潛在信念狀態當監督訊號**，而「現實世界裡這個溝通管道遠比實驗稀疏」，所以現形式「不太可能 scale」。後續工作（Trait-ToM、dynamic-trait attribution、belief-graph 模型，乃至 cyber-defence 場景的 ToM）大多在繞這個監督訊號稀疏的問題打轉。

## LLM 時代：核心爭議（兩派並陳）

LLM 出現後，「讀心」突然變得很好上手——但也立刻分裂成兩派，至今沒有共識。

**湧現派（樂觀）**：Kosinski 2023 主張 ToM 像是隨模型規模**自發湧現**，GPT-4 在多項 false-belief 測驗上的表現相當於 7 歲兒童；Bubeck et al. 的「Sparks of AGI」也呼應。

**捷徑派（懷疑）**：Ullman 2023 的反擊很致命——對題目做**微小擾動就崩**。例如告訴模型「袋子是透明的」或「角色不識字」，模型仍堅持預測角色抱持錯誤信念。他主張評測的零假設應該預設懷疑，**離群的失敗案例應該蓋過漂亮的平均分**。Shapira et al. 的〈Clever Hans or Neural Theory of Mind?〉（EACL 2024）跨 6 個任務複測後下結論：

> 「當代 LLM 展現出**有限**的 N-ToM 能力……這些能力並不穩健，某些情況下我們找到證據顯示它們過度依賴簡單的捷思法，而非泛化的推理。」

他們並直接反駁湧現派是拿 10–40 個例子過度外推。

連 benchmark 本身也被質疑壞了：

- **ToMBench**（Chen et al., ACL 2024）：8 任務、31 種社會認知能力、**雙語、從零自建以避免資料污染**、用選擇題自動評分。結論是「即使最先進的 GPT-4 也落後人類超過 10 個百分點」。
- **FANToM**：把 false belief 搬進**資訊不對稱的多人對話**，所有問題共享同一個底層推理——「誰知道對話裡這條資訊」。結論直白：**LLM 沒有 coherent ToM**，即使加 chain-of-thought 或微調，仍明顯輸人類。
- **Position: ToM Benchmarks are Broken**（ICLR 立場論文）提出一個重要區分：**literal ToM**（能預測他人行為）vs **functional ToM**（能在互動中**隨對方策略即時調整**）。它發現很多開源 LLM literal 很強、functional 卻很差，主張真正該測的是後者。

那「會思考的推理模型能不能救 ToM」？這也是分裂的：一派發現 reasoning model 對擾動更穩健；另一派（〈To Think or Not To Think〉）卻發現它**不一定更好、有時更差**，並觀察到「想越長、準確率掉越多」的 slow-thinking collapse，以及「把選項拿掉反而變準 → 模型靠的是 option-matching 捷徑」。結論是：數學/code 上的推理進步**無法直接遷移到社會推理**。

不過懷疑派也不是全贏。〈Language Models Represent Beliefs of Self and Others〉（ICML 2024）發現可以從模型的**神經活化中線性解碼**出不同 agent 視角的信念狀態，而且操弄這個內部表徵會改變 ToM 表現——這暗示模型內部**確實存在某種 belief 表徵**，不純然是表面捷徑。

## 多智能體與「讀心的上界」

把這些放回多 agent 系統，有幾個值得記的點：

- **協作永遠有 gap**：在 speaker–listener 實驗裡，帶 Machine ToM 的 speaker 給的指引比沒有的好，**但仍輸給「直接拿到對方真實心智」的上界**。推斷終究不是讀心。
- **談判與欺騙**：NegotiationToM 直接用 BDI 框架標註對手的慾望、二階信念與意圖；game-theory 視角的研究發現 LLM agent 在目標一致時傾向合作、偏好協商，但也會浮現策略性欺騙。
- **多模態**：MuMA-ToM 與 MMToM-QA 把 ToM 推到「影片 + 文字」的具身家庭場景，同時考 belief inference 與 goal inference。

## 整體架構

```
                   觀察到的行為 / 軌跡 / 對話
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
      符號溯因             貝氏反轉            神經網路
   plan/goal recog.   inverse planning      ToMnet 類
   (BDI 詞彙建模)     (反轉理性生成模型)    (meta-learning)
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
            推出：belief（知道什麼）/ desire（想要什麼）
                  / intention（帶承諾要做什麼）
                              │
                              ▼
              預測對方下一步 → 協作 / 談判 / 協助 / 防禦
```

## 整體來說

三條路線是清楚的取捨：要**可解釋、能量化不確定性、樣本少**，走 Bayesian inverse planning，但得手寫生成模型、難 scale；要**從大量行為資料學、泛化到沒見過的 agent**，走 ToMnet 類，但需要稀疏的心智監督訊號；要**用自然語言、開放域、即插即用**，走 LLM，但穩健性是最大問號。在多 agent 系統裡建模對手，目前最常見的組合是「**BDI 當詞彙 + 上述任一引擎當推斷器**」。

而最該記住的一條方法論警告是：推斷他者心智**永遠存在「推斷 vs 真實心智」的上界落差**；LLM 把這件事變得容易上手，但**把「答對 benchmark」直接當成「真的有 Theory of Mind」，是目前這個領域最大的陷阱**。比較精確的現狀是——LLM 有 literal ToM 的跡象，但 functional、穩健的 ToM 仍是 open problem。

## 參考資料

- [Machine Theory of Mind（Rabinowitz et al., ICML 2018）](https://arxiv.org/abs/1802.07740) — ToMnet 原始論文
- [Machine Theory of Mind（PMLR 全文）](https://proceedings.mlr.press/v80/rabinowitz18a/rabinowitz18a.pdf)
- [Belief–Desire–Intention software model（Wikipedia）](https://en.wikipedia.org/wiki/Belief%E2%80%93desire%E2%80%93intention_software_model)
- [BDI Agent Architectures: A Survey（IJCAI 2020）](https://www.ijcai.org/proceedings/2020/0684.pdf)
- [An Introduction to Plan, Activity, and Intent Recognition（PAIR Book）](https://ial.eecs.ucf.edu/pdf/PAIRBook-Intro.pdf)
- [Acting as Inverse Inverse Planning（Bayesian inverse planning，arXiv 2305.16913）](https://arxiv.org/abs/2305.16913)
- [Modeling the Mistakes of Boundedly Rational Agents（arXiv 2106.13249）](https://arxiv.org/abs/2106.13249)
- [ToMBench: Benchmarking Theory of Mind in Large Language Models（ACL 2024，arXiv 2402.15052）](https://arxiv.org/abs/2402.15052)
- [ToMBench GitHub repo](https://github.com/zhchen18/ToMBench)
- [FANToM: A Benchmark for ToM in Interactions（EMNLP 2023）](https://hyunw.kim/fantom)
- [Large Language Models Fail on Trivial Alterations to ToM Tasks（Ullman 2023，arXiv 2302.08399）](https://arxiv.org/abs/2302.08399)
- [Clever Hans or Neural Theory of Mind?（Shapira et al., EACL 2024）](https://aclanthology.org/2024.eacl-long.138.pdf)
- [Evaluating large language models in theory of mind tasks（Kosinski，arXiv 2302.02083）](https://arxiv.org/abs/2302.02083)
- [Position: Theory of Mind Benchmarks are Broken for LLMs（OpenReview）](https://openreview.net/forum?id=BCP8UU2BcU)
- [Language Models Represent Beliefs of Self and Others（ICML 2024，arXiv 2402.18496）](https://arxiv.org/abs/2402.18496)
- [To Think or Not To Think: LLM Reasoning in Theory of Mind Tasks（OpenReview）](https://openreview.net/forum?id=jGcBIvOrqc)
- [MuMA-ToM: Multi-modal Multi-Agent Theory of Mind（arXiv 2408.12574）](https://arxiv.org/abs/2408.12574)
