---
title: "CS234 導讀 7：策略梯度——score function、REINFORCE、baseline 與 actor-critic"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, policy-gradient, reinforce]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 7
tldr: "策略梯度不學價值再導出策略，而是直接對策略參數 θ 做梯度上升。關鍵一步是把 ∇P(τ;θ) 改寫成 P(τ;θ)∇log P(τ;θ)，動態模型在取 log 後消失，只剩策略自己的 score function。原始估計量無偏但雜訊很大，CS234 用三招降噪：只看動作之後的回報（REINFORCE）、減掉只依賴狀態的 baseline（證明它不引入偏差）、用 critic 估計的價值取代 Monte Carlo 回報（actor-critic）。"
description: "Stanford CS234 Reinforcement Learning（Winter 2026）第 5 講後半與第 6 講前半導讀：aliased gridworld 為什麼需要隨機策略、likelihood ratio 推導、softmax 與 Gaussian 策略的 score function、policy gradient theorem、利用時間結構得到 REINFORCE、baseline 無偏性與近似最佳 baseline 的推導、vanilla policy gradient，以及 advantage 與 actor-critic。"
draft: false
glossary:
  - term: "score function"
    aliases: ["∇log π"]
    definition: "參數化機率分布取 log 之後對參數的導數，例如 ∇_θ log π_θ(a|s)。"
    context: "策略梯度裡，軌跡機率的 score function 拆開後只剩策略這一項，所以不需要動態模型。"
  - term: "REINFORCE"
    aliases: ["Monte-Carlo policy gradient"]
    definition: "每跑完一個 episode，就對每一步用 θ ← θ + α ∇log π_θ(a_t|s_t) G_t 更新策略參數的 Monte Carlo 策略梯度演算法。"
    context: "CS234 L5 第 57 頁的版本；A2 要求你實作它。"
  - term: "baseline"
    aliases: ["基準線"]
    definition: "在策略梯度中從回報減掉的一個只依賴狀態的量 b(s)；它不改變梯度的期望，但可以降低變異。"
    context: "CS234 L6 證明 baseline 無偏，並推出近似最佳的選擇是期望回報，也就是 V(s)。"
  - term: "advantage function"
    aliases: ["優勢函數", "A(s,a)"]
    definition: "A^π(s,a) = Q^π(s,a) − V^π(s)，在狀態 s 先採取動作 a 再照 π 走，比一直照 π 走多拿多少回報。"
    context: "把 baseline 設成 V 之後，策略梯度可以寫成 ∇log π 乘上 advantage。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en)

**本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 投影片與作業；錄影是 Spring 2024 公開版。** 這是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列第 7 篇，接續 [DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning)。

用到的官方材料：

- [第 5 講投影片](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf)第 22–61 頁（策略梯度、score function、REINFORCE、baseline 開頭）
- [第 6 講投影片](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf)第 9–23 頁（baseline 推導、vanilla PG、actor-critic）
- 指定閱讀 [Sutton & Barto 第二版](http://incompleteideas.net/book/the-book-2nd.html)第 13 章
- 2024 公開錄影的[影片 05〈Policy Search 1〉](https://www.youtube.com/watch?v=L6OVEmV3NcE)與[影片 06〈Policy Search 2〉](https://www.youtube.com/watch?v=8PwvNQ5WS-o)。依 YouTube 章節，影片 05 從 policy gradient、likelihood ratio 講到 REINFORCE 與 baseline，影片 06 前半接著講 baseline 推導與 actor-critic。

存取等級 **A3**，缺口同系列其他篇：2026 錄影只在 Canvas、課堂小測的即時結果與 Ed 討論不公開。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=L6OVEmV3NcE
title: Lecture 5: Policy Search 1（Spring 2024，YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=8PwvNQ5WS-o
title: Lecture 6: Policy Search 2（Spring 2024，YouTube）
```

原始影片：[Lecture 5: Policy Search 1（Spring 2024，YouTube）](https://www.youtube.com/watch?v=L6OVEmV3NcE)、[Lecture 6: Policy Search 2（Spring 2024，YouTube）](https://www.youtube.com/watch?v=8PwvNQ5WS-o)

課程與錄影入口：

- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 為什麼不繼續學價值就好

第 23 頁先回答「策略梯度值得學嗎」：它在 NLP（以 REINFORCE 做序列層級訓練）、機器人（[End-to-End Training of Deep Visuomotor Policies](https://arxiv.org/abs/1504.00702)）與 ChatGPT 都有影響力。投影片也預告，A2 要你實作的 PPO 就是訓練 ChatGPT 時用過的方法。

第 24–25 頁把方法分成三類：

| 類別 | 學什麼 | 策略從哪來 |
|---|---|---|
| Value-based | 價值函數 | 隱含的，例如 ε-greedy |
| Policy-based | 策略 | 直接學，沒有價值函數 |
| Actor-critic | 兩者都學 | 直接學，再用價值函數輔助 |

這一講起，策略直接寫成 $\pi_\theta(s, a) = P[a \mid s; \theta]$，目標是找到讓 $V^{\pi}$ 最大的 $\theta$。

### Aliased gridworld：確定性策略會卡住

第 27–29 頁用一個例子說明為什麼要學**隨機策略**。格子世界裡有兩個灰色狀態，agent 用「北邊有牆」「南邊有牆」這類特徵看不出兩者差別。

- 在這種混淆（aliasing）之下，最佳的確定性策略只能在兩個灰色格都往西，或都往東。不管選哪個，都可能卡住、永遠拿不到錢。
- Value-based 方法學出的是接近確定性的策略（greedy 或 ε-greedy），所以會在走廊來回走很久。
- 最佳的隨機策略在灰色格以 0.5／0.5 往東或往西，很高機率幾步內就到終點。

Policy-based 方法可以直接學出這個隨機策略。

## 推導：把梯度搬進期望裡

第 31–33 頁定義目標。假設 episodic MDP，策略的價值可以寫成軌跡的期望：

$$V(\theta) = \sum_\tau P(\tau; \theta) R(\tau)$$

$\tau$ 是一條狀態動作軌跡，$R(\tau)$ 是它的總獎勵。策略梯度就是對 $V(\theta)$ 做梯度上升，$\Delta\theta = \alpha \nabla_\theta V(\theta)$，找的是**局部**最大值。

第 36 頁是整段最關鍵的一步，叫 likelihood ratio：

$$\nabla_\theta V(\theta) = \sum_\tau \nabla_\theta P(\tau;\theta) R(\tau) = \sum_\tau P(\tau;\theta) \frac{\nabla_\theta P(\tau;\theta)}{P(\tau;\theta)} R(\tau) = \sum_\tau P(\tau;\theta) R(\tau) \nabla_\theta \log P(\tau;\theta)$$

乘一個 $P/P$，梯度就變成「在 $P$ 底下的期望」，可以用 $m$ 條實際跑出來的軌跡平均來估計。

### 動態模型消失了

第 39–40 頁把 $\log P(\tau;\theta)$ 拆開。一條軌跡的機率是初始狀態分布 $\mu(s_0)$、每一步的策略 $\pi_\theta(a_t \mid s_t)$、每一步的動態 $P(s_{t+1} \mid s_t, a_t)$ 的連乘。取 log 變成連加，再對 $\theta$ 微分，只有策略那一項跟 $\theta$ 有關：

$$\nabla_\theta \log P(\tau;\theta) = \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t)$$

投影片在這一項下面寫著 **no dynamics model required**。這就是策略梯度能 model-free 的原因。

### Score function 的兩個常見例子

第 41 頁定義：score function 是參數化機率取 log 之後的導數。第 42–45 頁算了兩種策略：

- **Softmax 策略**（離散動作）：$\pi_\theta(s,a) \propto e^{\phi(s,a)^\top\theta}$。score function 是 $\phi(s,a) - \mathbb{E}_{\pi_\theta}[\phi(s,\cdot)]$，也就是「這個動作的特徵」減掉「策略下的平均特徵」。
- **Gaussian 策略**（連續動作）：平均 $\mu(s) = \phi(s)^\top\theta$，變異數 $\sigma^2$ 可固定也可學。score function 是 $(a - \mu(s))\phi(s)/\sigma^2$。

第 45 頁補充：深度網路或其他能算梯度的模型也都可以拿來表示策略。

### 直覺與一個常見誤解

第 49 頁給的直覺：把估計量看成 $f(x)\nabla_\theta \log p(x \mid \theta)$，$f(x)$ 衡量樣本 $x$ 有多好。往這個方向走，就是**依樣本好壞的比例，把它的 log 機率往上推**。這在 $f$ 不連續、未知，或樣本空間是離散集合時都成立。

第 47–48 頁的小測問：score function 策略梯度是否（a）需要可微的 reward、（b）只能用在 MDP、（c）主要用在無限時域？答案是**都不是**。

第 50 頁的 **policy gradient theorem** 把 likelihood ratio 推廣到三種目標（episodic、每步平均獎勵、平均價值）：

$$\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta}\big[\nabla_\theta \log \pi_\theta(s,a)\, Q^{\pi_\theta}(s,a)\big]$$

投影片推薦 Sutton & Barto 13.2 節的推導（episodic、離散狀態）。

## 無偏但很吵：三個修正

第 52 頁點出原始估計量的性質：**無偏，但雜訊非常大**。接下來三招都在降變異。

### 第一招：時間結構 → REINFORCE

第 53–56 頁的觀察：時間 $t'$ 的獎勵 $r_{t'}$ 只會受到 $t'$ 之前的動作影響。對單一獎勵項重做一次推導，再對所有 $t'$ 加總、交換加總順序，就得到：

$$\nabla_\theta V(\theta) = \mathbb{E}\Big[\sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t) \sum_{t'=t}^{T-1} r_{t'}\Big]$$

每個動作只跟它**之後**的回報 $G_t$ 配對，不再乘上整條軌跡的總獎勵。第 57 頁據此寫出 **REINFORCE**：

```text
初始化 θ
for 每個 episode {s1, a1, r2, ..., s_{T-1}, a_{T-1}, r_T} ~ π_θ:
    for t = 1 .. T-1:
        θ ← θ + α ∇θ log π_θ(s_t, a_t) G_t
return θ
```

### 第二招：baseline

第 61 頁（L6 第 11 頁重複）從每個回報減掉一個只依賴狀態的 $b(s_t)$：

$$\nabla_\theta \mathbb{E}_\tau[R] = \mathbb{E}_\tau\Big[\sum_{t=0}^{T-1} \nabla_\theta \log \pi(a_t \mid s_t;\theta)\big(\textstyle\sum_{t'=t}^{T-1} r_{t'} - b(s_t)\big)\Big]$$

投影片的兩個主張：**任何 $b$ 都不會讓估計量有偏**；近似最佳的選擇是期望回報 $b(s_t) \approx \mathbb{E}[r_t + \dots + r_{T-1}]$。直覺是：按「這次回報比預期好多少」來提高動作的 log 機率。

<details>
<summary>L6 第 13 頁：baseline 為什麼無偏</summary>

把期望拆成「到 $s_t$ 為止」與「之後」兩段，$b(s_t)$ 在內層是常數，可以提出來。內層剩下 $\mathbb{E}_{a_t}[\nabla_\theta \log \pi(a_t \mid s_t;\theta)]$，用 likelihood ratio 反過來寫：

$$\sum_a \pi_\theta(a \mid s_t) \frac{\nabla_\theta \pi(a \mid s_t;\theta)}{\pi_\theta(a \mid s_t)} = \nabla_\theta \sum_a \pi(a \mid s_t;\theta) = \nabla_\theta 1 = 0$$

所以整項是 $b(s_t) \cdot 0 = 0$。機率總和固定是 1，對它微分當然是 0。

</details>

<details>
<summary>L6 第 14–15 頁：為什麼 V(s) 是好的 baseline</summary>

既然 $b$ 不影響期望，要最小化變異，只需要最小化二階動差 $\mathbb{E}[(\nabla_\theta \log \pi)^2 (G_t - b(s))^2]$。這是加權最小平方問題，微分設為零得到：

$$b(s) = \frac{\mathbb{E}\big[(\nabla_\theta \log \pi)^2 G_t\big]}{\mathbb{E}\big[(\nabla_\theta \log \pi)^2\big]} \approx \mathbb{E}_{a \sim \pi(\cdot \mid s)}[G_t(s)]$$

最佳 baseline 是以 score function 平方加權的期望回報，近似起來就是狀態價值。第 18 頁因此說 $V^\pi(s) = \mathbb{E}_{a \sim \pi}[Q^\pi(s,a)]$ 是很好的 baseline。

</details>

### 「Vanilla」策略梯度

L6 第 16 頁把前兩招組起來：

1. 用目前的策略收集一批軌跡。
2. 每一步算回報 $G_t^i$ 與 advantage 估計 $\hat{A}_t^i = G_t^i - b(s_t^i)$。
3. 最小化 $\sum_i \sum_t |b(s_t^i) - G_t^i|^2$，重新擬合 baseline。
4. 用 $\sum \nabla_\theta \log \pi(a_t \mid s_t, \theta)\hat{A}_t$ 更新策略，丟進 SGD 或 Adam。

這幾乎就是 A2 第 2 題前半要你寫的東西：A2 用神經網路 $b_\phi(s)$ 當 baseline，以 MSE 擬合回報，另外再把 advantage 正規化成平均 0、標準差 1（題目說明：置中等於再減一個常數 baseline，縮放等於把學習率乘上 $1/\sigma$）。

### 第三招：換掉 Monte Carlo 回報 → actor-critic

L6 第 21 頁：$G_t$ 只是從一次 rollout 得到的估計，**無偏但變異大**。跟 [order 4](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation) 的 TD vs MC 一樣，可以用 bootstrapping 與函數近似引入一點偏差、換取變異下降。

第 22 頁：負責估計 V 或 Q 的叫 **critic**。**Actor-critic** 同時維護策略與價值函數的明確表示，兩者都更新。投影片舉 [A3C（Mnih et al., ICML 2016）](https://arxiv.org/abs/1602.01783)為常見的例子。

第 23 頁把 baseline 設成 V 的估計，梯度就能寫成 advantage 的形式：

$$\nabla_\theta \mathbb{E}_\tau[R] \approx \mathbb{E}_\tau\Big[\sum_{t=0}^{T-1} \nabla_\theta \log \pi(a_t \mid s_t;\theta)\,\hat{A}^\pi(s_t, a_t)\Big], \quad A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$$

## 小測：哪些說法是對的

L6 第 2–3 頁的開場小測列了四個關於策略梯度的敘述。投影片的答案是第 1、3 項成立：

1. **對**：$\nabla_\theta V(\theta) = \mathbb{E}_{\pi_\theta}[\nabla_\theta \log \pi_\theta(s,a) Q^{\pi_\theta}(s,a)]$
2. **錯**：$\theta$ 總是往 $\nabla_\theta \ln \pi$ 的方向增加（方向還取決於 Q 值或回報）
3. **對**：平均而言，估計 Q 值較高的狀態動作對，機率會上升
4. **錯**：保證收斂到策略類別裡的全域最佳（只保證局部最佳）

**今晚可以做的事**：不看本文，把 likelihood ratio 那一行推導與「動態模型消失」那一步自己寫一次。卡住的地方就是下一篇 PPO 會繼續用到的地方：[order 8](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement) 的 importance sampling 就是同一個「乘一個比值」的技巧。

## 留給下一篇的問題

vanilla PG 每批資料只走一步梯度就丟掉，而且步長很難選。L6 後半的 Advanced Policy Gradients 就從這兩個問題開始，接到 performance difference lemma、KL 與 PPO。這是下一篇的內容。

## 延伸閱讀

- [CS224R 導讀：Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients) 與 [Actor-Critic](/posts/ai/2026-09-30-cs224r-actor-critic)：同校深度 RL 課的講法，更偏機器人與實作
- [Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)
- [CS229 筆記第 21 章：策略梯度變體](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-21-policy-gradient-variants)

**系列導覽**：上一篇 [order 6：DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning)｜下一篇 [order 8：進階策略梯度——performance bound、KL、PPO、GAE](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS234: Reinforcement Learning（Winter 2026 課程首頁）](https://web.stanford.edu/class/cs234/)
- [CS234 講義頁（modules）](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 5: Policy Gradient I 投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf)
- [Lecture 6: Policy Gradient II 投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf)
- [Assignment 2 題目 PDF（Winter 2026）](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [Sutton & Barto：Reinforcement Learning: An Introduction, 2nd ed.（第 13 章 Policy Gradient Methods）](http://incompleteideas.net/book/the-book-2nd.html)
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Lecture 5: Policy Search 1（Spring 2024，YouTube）](https://www.youtube.com/watch?v=L6OVEmV3NcE)
- [Lecture 6: Policy Search 2（Spring 2024，YouTube）](https://www.youtube.com/watch?v=8PwvNQ5WS-o)
- [Levine, Finn, Darrell, Abbeel 2015：End-to-End Training of Deep Visuomotor Policies](https://arxiv.org/abs/1504.00702)
- [Mnih et al. 2016：Asynchronous Methods for Deep Reinforcement Learning（A3C）](https://arxiv.org/abs/1602.01783)
