---
title: "Stanford CS229 Lecture 17：Bellman Equation 如何導出 Value 與 Policy Iteration"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, reinforcement-learning, mdp]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 18
tldr: "MDP 用狀態、動作、轉移、折扣與回饋描述序列決策；Bellman equation 把長期價值拆成即時回饋與下一狀態價值，進而得到 value iteration 與 policy iteration。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 17：MDP、policy、discounted return、Bellman equations、value iteration 與 policy iteration。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-17-value-policy-iteration-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 18 篇，對應 **Stanford CS229, Spring 2021, Lecture 17**。課程表日期是 2021 年 5 月 24 日，官方題目是 **Basic concepts in RL, value iteration, policy iteration**。本文實際使用 Lecture 17 live lecture notes，並依課程表指定的 *Reinforcement Learning and Control* 講義第 1–2 節補齊推導。錄影在 Canvas，沒有作為來源。

監督式學習通常給每個輸入一個目標答案；reinforcement learning 面對的是一串決策。現在選的動作會改變下一個狀態，也會改變以後還能選什麼。單步看起來最好的動作，可能犧牲更大的長期回饋。

## MDP 把互動環境寫成五個部件

Markov Decision Process 可寫成 `(S, A, P, γ, R)`：

- `S`：狀態集合。
- `A`：動作集合。
- `P_sa(s')`：在狀態 `s` 採取 `a` 後轉移到 `s'` 的機率。
- `γ ∈ [0,1)`：discount factor。
- `R`：即時回饋函式。

Markov property 表示：給定目前狀態與動作後，下一步分布不再需要完整歷史。這不是說歷史不重要，而是狀態表示必須已包含預測未來所需的歷史資訊。

一段 trajectory 的 discounted return 是：

```text
G₀ = R(s₀) + γR(s₁) + γ²R(s₂) + …
```

`γ` 讓較晚的回饋權重逐步下降，也使無限期總和在有界回饋下保持有限。它同時表達「越早拿到正回饋越好」與問題的有效時間尺度。

## Policy 與 value function

Policy `π: S → A` 指定每個狀態採取的動作。固定 `π` 後，value function 是從 `s` 出發、之後都照 `π` 行動的期望 return：

```text
V^π(s) = E[G₀ | s₀=s, π]
```

把第一步拆開，就得到 Bellman equation：

```text
V^π(s) = R(s) + γ Σ_s' P_{s,π(s)}(s') V^π(s')
```

這是整堂課最重要的公式。左邊是一條無限長未來，右邊只剩即時回饋與「走一步後的同一個問題」。遞迴自相似讓長期規劃可以用局部 backup 計算。

在有限狀態下，每個狀態各有一條等式，因此 policy evaluation 可化成 `|S|` 個未知數的線性方程組。

## Optimal Bellman equation 多了一個 max

最佳價值 `V*(s)` 是所有 policy 中可達到的最高期望 return：

```text
V*(s) = R(s) + γ max_a Σ_s' P_sa(s') V*(s')
```

最佳 policy 則選擇讓下一步期望價值最大的動作：

```text
π*(s) = argmax_a Σ_s' P_sa(s') V*(s')
```

這裡的 greedy 不是只看眼前 `R(s)`；它是對已包含整個未來的 `V*` greedy。因此「greedy 不適合長期規劃」與「最佳 policy 對 `V*` greedy」並不矛盾。

## Value iteration：反覆做最佳化 backup

Value iteration 從任意 `V` 開始，對每個狀態反覆更新：

```text
V(s) ← R(s) + γ max_a Σ_s' P_sa(s')V(s')
```

每輪把目前對未來的估計往 Bellman fixed point 推進。有限狀態、已知 dynamics 且 `γ<1` 時，更新會收斂到 `V*`；最後再對 `V*` 取 argmax 得到 policy。

它可同步更新所有狀態，也可逐狀態非同步更新。兩者實作不同，核心都是同一個 Bellman backup。

## Policy iteration：評估與改善交替

Policy iteration 先選一個 policy，接著重複：

1. Policy evaluation：解 Bellman 線性方程，得到 `V^π`。
2. Policy improvement：讓每個狀態選擇對 `V^π` 最好的動作。

```text
π(s) ← argmax_a Σ_s' P_sa(s')V^π(s')
```

Policy iteration 常用較少輪收斂，但每輪要解線性系統；value iteration 每輪較便宜，價值則以近似方式逐步收斂。講義沒有宣告一個方法普遍較好，而是把取捨放在狀態空間與每輪計算成本。

## 這一講刻意假設了什麼

兩個演算法在本講都假設 `P_sa` 與 `R` 已知，而且狀態、動作集合有限。實際機器人通常不知道精確轉移，連續狀態也無法逐格存一個 value。這些不是小細節，而是下一講要拆掉的假設。

Reward 的設計也沒有因 Bellman equation 而自動正確。演算法會最佳化被寫下來的回饋，不會替設計者補上遺漏的目標。

## 這一講在十八講裡的位置

Lecture 17 是 CS229 從靜態預測跨到序列決策的門。前面課程的資料集通常在訓練前固定；RL 中，policy 會影響走到哪些狀態，也就影響之後收集的資料。

Lecture 18 接著處理兩個現實問題：dynamics 不知道時如何從 trajectory 學模型，以及狀態連續時如何用 function approximation 取代表格。

## 延伸

可以先用三個狀態與兩個動作做一個小 MDP，手算一次 Bellman backup。重點不是寫 RL 套件，而是逐項標出即時回饋、轉移機率與下一狀態價值。只要其中一項沒有進公式，就還沒把環境定義完整。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 17 live lecture notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture17_live.pdf)
- [Reinforcement Learning and Control notes：MDP 與 Bellman equations](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=2)
- [Reinforcement Learning and Control notes：value 與 policy iteration](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=5)
