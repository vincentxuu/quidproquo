---
title: "CS221 Lecture 9：MDPs III：直接對 policy 的期望報酬求梯度"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 10
tldr: "Stanford CS221 Autumn 2025 第 9 講從 tabular RL 走到 function approximation，再用 log-derivative identity 推出 REINFORCE，最後落到可執行的 PyTorch 更新。"
description: "依 Stanford CS221 Autumn 2025 Lecture 9 的 policy_gradient.py，逐步拆解 RL review、function approximation、policy gradient 推導、REINFORCE 實作與 variance reduction。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-09-policy-gradient-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 9**，2025-10-20 由 Percy Liang 主講。課程版本與作業以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準；本文沿著本講可執行材料 [policy_gradient](https://stanford-cs221.github.io/autumn2025-lectures/?trace=policy_gradient) 的執行順序，解釋每個實際出現的例子與推導。

> 材料缺口：官方講義與影片公開；Canvas 課堂互動、作業解答與隱藏測資不公開。本文只覆蓋 `policy_gradient.py` 實際呈現的內容；source 沒有的 actor-critic、generalized advantage estimation、entropy regularization 或 off-policy policy-gradient 推導，不在本文假裝補齊。

## 這一講從哪裡出發

RL 裡有兩個角色。environment 是一個 Markov decision process（MDP）；agent 則是 RL algorithm。source 用 `FlakyTramMDP(num_locs=6, failure_prob=0.1)` 作為小型環境：共有六個位置，搭 tram 有失敗機率。agent 從 state 1 開始，依序看到 state、選 action、收到 reward，再看到下一個 state。

source 先用 Q-learning 示範一條互動：在 state 1 選 `walk`，得到 `-1` 並到 state 2；在 state 2 再選 `walk`，得到 `-1` 並到 state 3；在 state 3 選 `tram`，得到 `-2`，抵達 state 6 且 episode 結束。這條 rollout 的 utility 是 reward 的 discounted sum。這個例子設定 `discount=1`，所以總和就是 `-1 + -1 + -2 = -4`。

環境有隨機性，所以 source 跑 100 次 trial，取 utility 平均估計 policy value；單一 rollout 不代表期望值。

## RL review：到底在估計什麼

source 區分 policy-specific 的 `V_π(s)`、`Q_π(s,a)` 與 optimal 的 `V*(s)`、`Q*(s,a)`；也區分先估 MDP 再求 policy 的 model-based 方法，與直接估 `Q(s,a)` 的 model-free 方法。

source 把 model-free 的共同形式寫成：目前估計是 `Q(s, a)`，target 是 utility 的估計，更新為

```text
Q(s, a) ← Q(s, a) + learning_rate × (target - Q(s, a))
```

target 可以來自完整 rollout，也可以 bootstrap。前者使用實際得到的 discounted sum；後者只看 immediate reward，再加上對未來 reward 的估計。Monte Carlo 用完整 rollout 估 `Q_π`，是 on-policy；SARSA 用 `r + γ Q(s', a')`、其中 `a' = π(s')`，同樣是 on-policy；Q-learning 用 `r + γ max_a' Q*(s', a')`，估的是 optimal value，屬於 off-policy。

## tabular 不夠時：function approximation

tabular 方法要求每個 state/action pair 都能放進表格。但 source 刻意換成現實一點的輸入：state 可能是一張 robot image，也可能是一個 theorem-proving 的句子。所有可能的影像或句子不適合逐一建立 table，於是要用 function approximation。

把 lookup table 改寫成帶參數的函數 `Q_θ(s, a)`。source 把設計拆成三個決定：假設空間有哪些函數、用什麼 loss 判斷函數好不好、用什麼 optimization algorithm 降低 loss。

第一步是把 state/action 映射成 feature vector `φ(s, a)`。可以使用線性函數 `Q_θ(s, a) = φ(s, a) · θ`，也可以把 features 送進 `MLP_θ(φ(s, a))`。這只是把大量表格項目換成共享參數的函數，並不保證問題自動變簡單。

source 的 `ParameterizedQLearning` 仍以 one-hot feature 模擬 tabular setting：`Q(state, action)` 經 `nn.Linear` 得分，`π_θ(s)` 取 Q 最大的 action。非終點 target 是 immediate reward 加 discounted、bootstrapped 的下一步 value；終點只取當下 reward，再以平方誤差做 `backward()` 與 `step()`。跑 100 次 rollout 後，source 將學到的 policy/value 與 value iteration 真值比較；被訪問較多的 state 通常更準。重點是它仍先估 Q、再取 argmax，本講接著改問：能否直接學 policy？

## 直接參數化 policy，為什麼不能硬做 classifier

若直接把 policy 看成 classifier，輸入是 state `s`，輸出是 action `a`。但 hard classifier 的離散輸出不適合直接做平滑的 gradient optimization：argmax 只在邊界跳變，不提供一個可用的「動作改一點點」方向。

source 的做法是把 hard policy 改成 probabilistic classifier：`π_θ(a | s)` 是給定 state 時各 action 的機率。`Reinforce` 的 model 是 `nn.Linear(num_locs, len(actions))`；state 先變成 one-hot，linear layer 產生 logits，softmax 把 logits 轉成機率。policy 可以抽樣，而不是每次只吐出一個不可微的 action。

### 有 demonstration 時的 imitation learning

source 先建立一條 rollout：state 1 選 `walk` 到 state 2，state 2 選 `walk` 到 state 3，state 3 選 `tram` 到 state 6。若這是示範資料，就能建立三個 supervised examples：`(1, walk)`、`(2, walk)`、`(3, tram)`。目標寫成

```text
J(θ) = Σ_t log π_θ(a_t | s_{t-1})
```

最大化示範 action 的 log probability，就是 imitation learning。source 用 robotics teleoperation 與人類寫出的數學解答作為例子。但 RL 沒有 demonstrations，只有 reward function，因此 agent 必須從自己的結果學會哪些 action 值得提高機率。

## 從 trajectory 的機率開始

source 用三步 rollout 表示 trajectory：

```text
τ = (s₀, a₁, r₁, s₁, a₂, r₂, s₂, a₃, r₃, s₃)
```

例子中的 actions 是 `walk, walk, tram`，rewards 是 `-1, -1, -2`，最後到 state 6；`discount=1` 時 utility 是 `-4`。

一條 trajectory 的機率是初始 state、policy action probability、environment transition probability 的乘積：

```text
p(τ) = p(s₀)
       × π_θ(a₁ | s₀) × T(s₀, a₁, s₁)
       × π_θ(a₂ | s₁) × T(s₁, a₂, s₂)
       × π_θ(a₃ | s₂) × T(s₂, a₃, s₃)
```

`p(s₀)` 是起始 state 的機率，`π_θ(a_t | s_{t-1})` 是 policy，`T(s_{t-1}, a_t, s_t)` 是 transition distribution。參數 `θ` 出現在 policy，這正是後面能把 policy 的 log probability 拆出來的原因。

目標是最大化 rollout utility 的期望：

```text
V(θ) = E_θ[utility(τ)]
     = Σ_τ p_θ(τ) × utility(τ)
```

### sampled discrete action 為何卡住 naive differentiation

若把 `V(θ)` 想成先依 policy 抽樣離散 action、再跑完環境，就不能把抽出的 `walk` 或 `tram` 當成一般連續 tensor，直接讓 gradient 穿過這個選擇。action 是類別結果，transition 也可能 stochastic；逐一列舉所有 trajectory 才能回到完整 expectation，這正是 state/action space 變大時不想付出的成本。

所以 source 不對 sampled action 本身做 naive differentiation，而是把「哪條 trajectory 被抽到」視為對 `p_θ(τ)` 的抽樣，改寫期望梯度。

## log-derivative identity 與 REINFORCE

從期望開始逐行微分：

```text
∇_θ V(θ) = ∇_θ E_θ[utility(τ)]
∇_θ V(θ) = ∇_θ Σ_τ p_θ(τ) × utility(τ)
∇_θ V(θ) = Σ_τ ∇_θ p_θ(τ) × utility(τ)
∇_θ V(θ) = Σ_τ p_θ(τ) × ∇_θ log p_θ(τ) × utility(τ)
∇_θ V(θ) = E_θ[∇_θ log p_θ(τ) × utility(τ)]
```

中間使用的是 `∇p = p∇log p`。source 稱這是 policy gradient theorem（identity）：它沒有讓 discrete action 變連續，而是把梯度改寫成 trajectory probability 的 log gradient 乘上 utility。

看到 `E_θ[...]` 時，可以抽樣 `τ ~ p_θ(τ)`。定義單次 sample 的 objective `J(θ, τ) = log p_θ(τ) × utility(τ)`，對它做 gradient step，就得到期望梯度的 unbiased estimator。再拆開 trajectory probability，初始 state 與 transition 不依賴 policy parameters，留下

```text
∇_θ J(θ, τ)
= utility(τ) × Σ_t ∇_θ log π_θ(a_t | s_{t-1})
```

這就是 REINFORCE，source 連到 Williams (1992)。直覺是拿 agent 自己產生的 rollout 當 imitation examples，再用 utility 加權；若 utility 只有 `{0, 1}` 的 success/failure，就等於只強化自己成功的 demonstrations。

rollout 必須由目前的 `π_θ` 產生，因此 source 標成 on-policy；估計雖 unbiased，單次 sample 不保證改善 policy，也不保證低 variance。

## source 如何把公式寫成 PyTorch

`policy_gradient_implementation()` 建立同一個 flaky tram MDP，建立 `Reinforce(num_locs=6, actions=["walk", "tram"], discount=1, learning_rate=0.01)`，執行另一條 rollout：state 1 選 `walk` 得到 `-1` 到 state 2；state 2 選 `tram` 得到 `-2` 仍在 state 2；再從 state 2 選 `tram` 得到 `-2` 到 state 4 且結束。utility 是 `-5`。

這裡不需要額外 epsilon-greedy exploration policy，因為 `get_action` 每次從 stochastic policy 的 softmax distribution 抽樣，本身就能探索。

`Reinforce` 的部件直接對應公式：`phi(state)` 用 state - 1 作 index，產生 one-hot；`pi(state)` 將 one-hot 經 linear model 與 softmax，回傳兩個 action 的 distribution；`get_action(state)` 用 `torch.multinomial` 抽 index，再對回 action name，而不是使用 argmax。

`incorporate_feedback` 每一步把 `reward × discount ** len(rollout)` 加到 `self.utility`，並儲存 action、reward、next state。episode 尚未結束時只記錄，不更新參數。結束後逐一走訪 rollout：第一步 state 是 `start_state`，其後取前一個 step 的 state，還原每個 `a_t` 對應的 `s_{t-1}`。

對每個 pair，model 產生 logits，target 是 action 的 one-hot index，`CrossEntropyLoss` 衡量目前 policy 對該 action 的分類 loss。source 把每項 loss 乘上整條 rollout 的 utility，累加為

```text
loss = Σ_t utility(τ) × CrossEntropy(logits(s_{t-1}), a_t)
```

optimizer 最小化 cross-entropy；負 utility 的權重把梯度方向轉成提高該 rollout action log probability 的效果，這是 source 對 `utility × Σ log π` 的實作連接。接著 `zero_grad()`、`loss.backward()`、`optimizer.step()`，再清空 rollout 與 utility。source 最後用 50 次 trial 估計 value，列出六個 state 的目前 policy。

這份實作沒有把 return-to-go 寫進去，也沒有另外估 value function；它忠實使用整條 episode 的同一個 utility 作權重。這就是後面 variance reduction 要改善的對象。

## estimator 的 bias、variance 與成本

這裡有一個必須明確標出的官方可執行材料 bug／不一致：`policy_gradient.py` 寫的是 `probs = [0.1, 0.1, 0.1, 0.1]`，總和只有 `0.4`。如果把它當成未正規化的加權和，`Σ_i p(i) × points[i] = 0.4`；但 `torch.multinomial` 會把這些非負 weights 正規化後抽樣，因此實際分布是四個各 `0.25` 的均勻分布，抽樣 estimator 的期望是 `(-4 - 6 + 6 + 8) / 4 = 1`，不是 `0.4`。所以 source 把 `0.4` 稱為 true mean，與 executable artifact 的實際抽樣行為不一致；下面的 estimator 應以實際抽到的分布為準。抽一點成本低但波動大；抽兩點平均成本較高而較穩；額外加入 Gaussian noise 對實際均值 `1` 仍 unbiased，卻放大 variance。最後用 `offsets = [-6,-6,6,6]` 示範

```text
E[f(i) - offset(i)] = E[f(i)] - E[offset(i)] = E[f(i)]
```

這個 identity 要對實際的正規化分布解讀：四個 offset 的平均是 `0`，所以它們在均勻抽樣分布下仍是 zero-mean，`E[f(i) - offset(i)] = 1`，不是 `0.4`。平均不變，但 offset 若抵消波動，variance 就下降；這正是 policy-gradient baseline 的動機。換句話說，offset 的 zero-mean 並沒有修正 source 的 `probs` 不一致，也不能把實際 estimator 的目標均值改回 `0.4`。

## baseline、returns-to-go 與 bootstrapping

回到 `V(θ) = E_θ[utility(τ)]` 與 `∇_θ V(θ) = E_θ[∇_θ log p_θ(τ) × utility(τ)]`。REINFORCE 是抽一條 `τ ~ p_θ(τ)` 得到的 unbiased estimate，但 utility 的波動可能很大。

若 `b(s)` 是只依賴 state、不依賴 action 的任意 function，而且 `a ~ π_θ(a | s)`，source 給出關鍵 identity：

```text
E_θ[∇_θ log π_θ(a | s) × b(s)] = 0
```

proof 是：在已正規化的 action distribution 下，`E[b(s)]` 對 θ 是 constant，所以 gradient 為 0；展開 action expectation 得 `Σ_a π_θ(a | s)b(s)`，微分成 `Σ_a ∇π_θ(a | s)b(s)`，再用 `∇π = π∇logπ`，就得到該期望為 0。因為加上的項期望為零，所以從 utility 減去 baseline 不改變期望梯度。這個 baseline identity 談的是 `π_θ` 的正規化分布，不應與前一節把未正規化 `probs` 傳給 `torch.multinomial` 的 artifact 問題混為一談。

source 列出三種 enhancement：

1. **Baseline**：用 `utility(τ) - b(s_{t-1})` 取代 utility；baseline 只看 state 才保有零期望 identity。
2. **Returns-to-go**：用 `r_t + γr_{t+1} + γ²r_{t+2} + ... - b(s_{t-1})`，保留從該步往後的 reward。
3. **Bootstrapping**：用可能有 bias 的 `Q(s_{t-1}, a_t) - b(s_{t-1})` 取代整條 utility。source 明確說這能降 variance，但引入一點 bias。

source 實作選 `discount=1`，且未實作 baseline；本文不補入 actor-critic

## 這一講真正交付的契約

policy gradient 學 `π_θ(a|s)`，用 rollout utility 加權 log probability；baseline/returns-to-go 降 variance，bootstrapping 以 bias 換 variance。source 未提供大環境收斂保證。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：policy_gradient](https://stanford-cs221.github.io/autumn2025-lectures/?trace=policy_gradient)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
- [Williams, 1992：Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning](https://link.springer.com/article/10.1007/BF00992696)
