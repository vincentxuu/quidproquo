---
title: "CMU 07-280 Lecture 23：從 Approximate Q-learning 到 DQN"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, reinforcement-learning, deep-q-learning, function-approximation]
lang: zh-TW
tldr: "第 23 講以 Qθ(s,a) 取代巨大 Q-table：先用 features 線性近似並由 squared TD error 推導 gradient update，再以 replay data 與固定 target network 形成 DQN。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 23：feature-based approximate Q-learning、TD loss、gradient update、experience replay 與 target network。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 23
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-23-deep-q-learning-en)

Tabular Q-learning 要為每個 `(state, action)` 保存一個數字。**CMU 07-280 Spring 2026 Lecture 23** 的 Deep Reinforcement Learning 段落處理 state explosion：用 features 與 neural network 近似 `Q(s,a)`，讓一筆 experience 同時影響許多相似 states。

## 官方材料與讀取範圍

這篇有一個必須先說清楚的缺口。課程首頁列出的 Spring 2026 Lecture 23 `Deep_RL` slides 與 pptx 直鏈，在 2026-08-22 都回傳 404。本文因此**不宣稱讀過 Lecture 23 slides**，也不補寫投影片順序。

可用的一手材料是 [Approximate Q-learning pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Approx_Q-learning.pdf)、[Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf)、[Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)。官方頁也沒有 Spring 2026 逐講公開錄影。本文是這些公開材料的導讀，不是完整課堂重建。

## 承上問題：Q-table 甚至來不及把 states 看一遍

Pre-reading 用 Pac-Man 說明：只考慮 100 個食物位置是否仍有食物，就有 `2^100` 種配置，還沒算角色位置與方向。Tabular Q-learning 不只存不下，也不可能讓每一格都累積足夠 samples。

解法是定義 features `f_i(s,a)`，以共享參數近似：

\[
Q_\theta(s,a)=\sum_i\theta_i f_i(s,a)=\theta^\top f(s,a).
\]

Features 可以是到食物距離、是否接近 ghost、action 是否撞牆。兩個 states 若 feature vectors 相似，就會共享 weights；更新一個 state-action pair 也會改變另一個 pair 的預測。

## 完整概念脈絡：把 TD error 變成 optimization objective

Tabular update 直接改一格。Function approximation 改為最小化預測 `Q_θ(s,a)` 與 bootstrap target 的差：

\[
y=r+\gamma\max_{a'}Q_{\theta^-}(s',a'),
\qquad
L(\theta)=\frac12[y-Q_\theta(s,a)]^2.
\]

`θ⁻` 表示暫時固定的 target parameters。Gradient 是：

\[
\nabla_\theta L
=-(y-Q_\theta(s,a))\nabla_\theta Q_\theta(s,a).
\]

線性模型有 `∇_θQ=f(s,a)`，所以 gradient descent 得到：

\[
\theta\leftarrow\theta+\alpha
[y-Q_\theta(s,a)]f(s,a).
\]

這就是 tabular Q-learning 的一般化。若每個 `(s,a)` 都用獨立 one-hot feature，更新只動一個 weight，便退化回 Q-table；若 features 共享，update 會泛化。

DQN 再把線性 `Q_θ` 換成 neural network。Recitation 14 明確列出兩個穩定化構件：把 transitions `(s,a,r,s')` 存進 dataset／replay buffer 並抽 random mini-batches；用暫時固定的 target network `θ⁻` 算 `y`，避免 target 與 prediction 在同一步一起移動。

## 可重做推導：兩個 features 的一次更新

令 features 是 `f(s,a)=[1,2]`，weights `θ=[0.5,-0.5]`。目前預測：

\[
Q_\theta(s,a)=0.5(1)-0.5(2)=-0.5.
\]

假設 reward `r=1`、`γ=0.9`，target network 對下一 state 的最大 Q 是 `2`，所以：

\[
y=1+0.9(2)=2.8,
\qquad
\delta=y-Q=3.3.
\]

取 `α=0.1`，更新：

\[
\theta_{new}=\theta+0.1(3.3)[1,2]
=[0.83,0.16].
\]

新的預測是 `0.83+0.32=1.15`，往 target `2.8` 移動，但沒有一步跳到 target。更重要的是，任何使用相同 features 的其他 `(s,a)` 預測也會改變。這是 function approximation 的效率來源，也是 interference 的來源。

Recitation 14 要學生從 squared loss 推回同一更新。推導時 `y` 被視為不依賴 `θ`，正是固定 target network 的數學角色；若讓兩邊同時由相同 trainable parameters 變動，gradient 與學習動態會不同。

## Recitation／HW 對應

Recitation 13 的 Approximate Q-learning 先處理 feature representation 與 weight update；Recitation 14 把它接到 DQN loss、target network 與 mini-batch data。兩份材料共同補足 Lecture 23 slides 失效後仍可查證的課程核心。

公開的 [RL programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/) 主要落在 tabular Q-learning；DQN 的正式 compute、tests 與評分環境沒有在同一路徑完整公開。自學實作應自己建立 tiny MDP regression tests，不能用「loss 有下降」取代正確性檢查。

## 延伸對照：近似帶來泛化，也帶來不穩定

Tabular Q-learning 的一格更新不會直接破壞別格；function approximation 會。Neural network、bootstrapping 與 off-policy data 同時存在時，target distribution 也持續變動。Replay buffer 降低相鄰 samples 的相關性，target network 降低 target 移動速度，但兩者不是收斂保證。

這一講也回扣前面的 supervised learning：DQN 仍有 inputs、predictions、targets、loss 與 gradient descent。差別是 targets 不是固定 labels，而是由 rewards 與另一份 Q estimate 組合出來。

## 今晚可做動作

先不要上 Atari。用上面兩維線性 features，手算三筆 transitions 的 `y`、TD error 與 weight update，再寫 unit tests 比對。之後實作兩個版本：每一步用目前 network 算 target，以及每十步才同步一次 target network。畫出的不是只有 reward，還要包含 TD loss、Q-value magnitude 與 target／online prediction 差距。

## 參考資料

- [CMU 07-280 Approximate Q-learning pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Approx_Q-learning.pdf)
- [CMU 07-280 Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf)
- [CMU 07-280 Recitation 13 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf)
- [CMU 07-280 Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf)
- [CMU 07-280 Recitation 14 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)
- [CMU 07-280 reinforcement-learning programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/)
