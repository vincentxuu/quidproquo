---
title: "Stanford CS229 Lecture 18：Model-Based RL 與 Fitted Value Iteration"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, reinforcement-learning, model-based-rl]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 19
tldr: "Model-based RL 先從 trajectory 估計轉移與回饋，再用規劃改善 policy；連續狀態下，fitted value iteration 用 regression 逼近 Bellman target，避開逐格列舉但失去表格法的收斂保證。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 18：學習 dynamics、exploration、連續狀態、value function approximation 與 fitted value iteration。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-18-model-based-rl-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 19 篇，對應 **Stanford CS229, Spring 2021, Lecture 18**。課程表日期是 2021 年 5 月 26 日，官方題目是 **Model-based RL, value function approximator**。本文實際使用 Lecture 18 live lecture notes，並依課程表指定的 *Reinforcement Learning and Control* 講義第 3–4 節補齊細節。錄影在 Canvas，沒有作為來源。

Lecture 17 的 value iteration 假設 dynamics 已知，而且每個狀態都能放進表格。本講一次拆掉兩個理想化條件：先從互動資料學 transition model，再以函式近似連續狀態的 value。

## Model-based RL 先學環境再規劃

在離散狀態下，trajectory 會留下 `(s, a, s')` 計數。最大概似轉移估計是：

```text
P̂_sa(s') = count(s,a,s') / count(s,a)
```

若回饋未知，也可用在該狀態或 state-action pair 觀察到的平均回饋估計。得到 `P̂` 與 `R̂` 後，就能把它們交給 value iteration 或 policy iteration，產生新的 policy。

整個流程因此形成迴圈：執行目前 policy、收集 trajectory、更新模型、重新規劃、再執行。這就是 model-based 的重點：轉移模型是顯式學習與重用的中介物。

## 為什麼收集資料不能只用目前最好的 policy

早期模型不準，依它產生的 greedy policy 可能只走到少數狀態。那些沒被拜訪的 `(s,a)` 沒有計數，模型也就無法修正。這是 exploitation 與 exploration 的張力。

講義提到在 policy 動作上加入雜訊，讓系統看到更多狀態。這不是通用最優探索演算法，而是一種直觀策略。探索仍有成本與安全邊界；真實控制系統不能只為了資料多樣性就任意試錯。

## 連續狀態為何不能直接切格子

若每個維度切成 `k` 格，`d` 維狀態會產生 `k^d` 個格子。這就是 curse of dimensionality：維度每多一個，狀態數再乘一次 `k`。此外，格子內共用常數值，無法自然表達平滑變化。

所以不再為每個狀態存 `V(s)`，而以參數化函式近似：

```text
V_θ(s) = θᵀφ(s)
```

`φ(s)` 可以是手工特徵，材料也指出可改用非線性模型。關鍵是相近狀態透過共享參數互相泛化。

## Dynamics 也可以用 supervised learning 學

連續系統可先假設線性 dynamics：

```text
s_{t+1} = As_t + Ba_t + ε_t
```

把 `(s_t,a_t)` 視為輸入、`s_{t+1}` 視為標籤，就能用 regression 估計 `A`、`B` 與雜訊。若關係非線性，也可換特徵映射或非線性預測器。

這一步把 model-based RL 與前半學期接回來：學 dynamics 本身是 supervised learning。差別是資料並非固定獨立抽樣，而是由 policy 走出的 trajectory。

## Fitted value iteration 把 Bellman backup 變成 regression target

連續狀態不能對每個 `s` 逐格更新，因此先抽樣有限的狀態 `s⁽ⁱ⁾`。對每個 action，從模型抽樣下一狀態，估計：

```text
q(a) ≈ R(s⁽ⁱ⁾) + γ E[V_θ(s') | s⁽ⁱ⁾, a]
y⁽ⁱ⁾ = max_a q(a)
```

接著用 regression 擬合 Bellman target：

```text
θ ← argmin_θ Σᵢ (V_θ(s⁽ⁱ⁾) - y⁽ⁱ⁾)²
```

公式的直覺是把 value iteration 的精確指定 `V(s)=target`，改成在有限樣本上「盡量接近 target」。這讓 value 可以跨狀態泛化，也同時引入 approximation error、sampling error 與 model error。

## 三層近似會互相放大

本講方法有三個不同誤差來源：

- 學到的 dynamics 與真實環境不同。
- 有限 next-state 樣本只近似期望。
- `V_θ` 的函式類別未必表示得了 `V*`。

更麻煩的是 target 本身依賴目前的 `V_θ`。錯誤可能經 Bellman backup 被反覆帶回訓練。講義明確指出 fitted value iteration 不像離散表格版一樣保證總會收斂，雖然許多實務問題上可有效運作。

對 deterministic simulator，下一狀態只有一個，估計期望時可只跑一次。對 stochastic dynamics 則要平均多個樣本；若 action 很多，每個 action 都取樣會帶來顯著計算成本。

## 這一講在十八講裡的位置

Lecture 18 收束 CS229 的主線。前面的 regression 在這裡學 dynamics，function approximation 表示 value，bias–variance 與 model diagnostics 則重新出現在近似誤差與部署風險中。RL 不是一套與監督式學習無關的孤立技巧，而是把前面工具放進互動迴圈。

Spring 2021 還有 Lecture 19 *Societal impact*，但課程表沒有提供同講公開材料；本系列不以其他學期內容補寫，因此這篇是目前有 offering-specific 官方來源的最後一講。

## 延伸

實作前先把三種誤差分開量：在真實 transition 上檢查 dynamics prediction、在固定模型上檢查 Bellman target 的 Monte Carlo variance、在固定 target 上檢查 regressor residual。若只看最後 return，三個問題會混在一起，很難知道該收資料、換模型還是增加抽樣。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 18 live lecture notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture18_live.pdf)
- [Reinforcement Learning and Control notes：學習 MDP model](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=7)
- [Reinforcement Learning and Control notes：連續狀態與 fitted value iteration](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=9)
