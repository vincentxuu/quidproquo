---
title: "CS234 導讀 8：進階策略梯度——performance bound、KL、PPO 與 GAE"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, policy-gradient, ppo]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 8
tldr: "Vanilla 策略梯度有兩個毛病：每批資料只走一步就丟，而且參數空間的距離不等於策略空間的距離，步長一大表現就崩。CS234 沿用 Joshua Achiam 的講法，從 performance difference lemma 出發，把新策略的表現改寫成舊策略資料上的 surrogate objective，再用 KL 散度界住近似誤差。最大化「surrogate 減 KL 懲罰」保證不退步，但理論常數太大，PPO 改用可調的 KL 懲罰或 clipping 近似它；advantage 則用 GAE 在偏差與變異之間折衷。"
description: "Stanford CS234 Reinforcement Learning（Winter 2026）第 6 講後半與第 7 講前半導讀：策略梯度的樣本效率與步長問題、performance difference lemma、importance sampling 與 surrogate objective、relative policy performance bound 與 KL、monotonic improvement 證明、PPO 的 adaptive KL 與 clipped 兩種變體、n-step advantage 與 GAE，以及跟 A2 PPO 實作的對應。"
draft: false
glossary:
  - term: "performance difference lemma"
    aliases: ["relative policy performance identity"]
    definition: "兩個策略的表現差 J(π′) − J(π)，等於在 π′ 的軌跡上把舊策略 π 的 advantage 折扣加總後取期望。"
    context: "CS234 L6 用它把新策略的表現寫成舊策略 advantage 的函數；A2 第 3 題要你證明它。"
  - term: "surrogate objective"
    aliases: ["L_π(π′)", "替代目標"]
    definition: "把 performance difference lemma 裡的新策略狀態分布 d^π′ 換成舊策略的 d^π 之後得到的近似目標，可以只用舊策略的資料估計。"
    context: "PPO 與 TRPO 最大化的都是它，再加上某種限制新舊策略距離的機制。"
  - term: "GAE"
    aliases: ["Generalized Advantage Estimation", "廣義優勢估計"]
    definition: "把 1 步、2 步、3 步……的 advantage 估計以 λ 的幾何級數加權平均，等價於 TD error 的 (γλ) 折扣和。"
    context: "λ = 0 是 TD(0) advantage（偏差大、變異小），λ 越接近 1 越接近 Monte Carlo。PPO 用截斷版本。"
    links:
      - label: "Schulman et al. 2016 (arXiv)"
        url: "https://arxiv.org/abs/1506.02438"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement-en)

**本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 投影片與作業；錄影是 Spring 2024 公開版。** 這是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列第 8 篇，接續[策略梯度基礎](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)。

用到的官方材料：

- [第 6 講投影片](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf)第 24–48 頁。這段標明取自 Joshua Achiam 的投影片，Brunskill 做了少量修改。
- [第 7 講投影片](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf)第 1–24 頁（PPO 回顧、GAE、monotonic improvement theory、PPO 與策略梯度總結）
- [A2 題目](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)第 2.4 節（PPO）與第 3 題（策略誘導的分布）
- 2024 公開錄影的[影片 06〈Policy Search 2〉](https://www.youtube.com/watch?v=8PwvNQ5WS-o)與[影片 07〈Policy Search 3〉](https://www.youtube.com/watch?v=4ngb0IZTg8I)。依 YouTube 章節，影片 06 後半（41:22 起）是單調改進、performance difference lemma 與 PPO clipped objective，影片 07 前 45 分鐘是 GAE 與單調改進的證明。

存取等級 **A3**。第 7 講後半的模仿學習留給 [order 10](/posts/ai/2026-09-30-cs234-imitation-learning-irl)。

這是系列第二個數學高峰。正文走直覺與結論，證明與定義放進折疊區塊。

## 場景：一步走太大，表現就崩了

L6 第 27 頁把策略梯度寫成最佳化問題：用隨機梯度上升最大化 $J(\pi_\theta) = \mathbb{E}_{\tau \sim \pi_\theta}[\sum_t \gamma^t r_t]$，梯度是 $\mathbb{E}[\sum_t \gamma^t \nabla_\theta \log \pi_\theta(a_t \mid s_t) A^{\pi_\theta}(s_t, a_t)]$。投影片接著列出兩個限制。

**樣本效率差**（第 28 頁）。Vanilla PG 每批資料只走一步梯度就丟掉，因為策略梯度是 on-policy 的期望：資料必須來自目前的策略。機會在於用舊資料多走幾步；挑戰在於，就算做得到，該走幾步？

**步長很難選**（第 29–31 頁）。

- 太大：表現可能崩盤，而且很難救回來，因為下一批資料會由那個壞掉的策略收集。
- 太小：進展慢到無法接受。
- 「對的」步長還會隨 $\theta$ 改變。Advantage 正規化或 Adam 這類自動調整有幫助，但投影片問：這真的解決問題了嗎？

第 31 頁指出問題比步長更深：**參數空間的距離不等於策略空間的距離**。投影片舉一個只有兩個動作、兩個動作的機率由同一個參數 $\theta$ 決定的策略族，圖上顯示參數的小變化可能讓策略出乎意料地大幅改變。所以核心問題是：怎麼設計一個更新規則，**讓策略的改變永遠不超過我們想要的**？

## 關鍵工具：兩個策略的表現差

第 33 頁的 **performance difference lemma**，投影片註明 CS234 在 HW2 要你證明（就是 A2 第 3 題）：

$$J(\pi') - J(\pi) = \mathbb{E}_{\tau \sim \pi'}\Big[\sum_{t=0}^\infty \gamma^t A^\pi(s_t, a_t)\Big] = \frac{1}{1-\gamma}\,\mathbb{E}_{s \sim d^{\pi'},\, a \sim \pi'}\big[A^\pi(s,a)\big]$$

其中 $d^\pi(s) = (1-\gamma)\sum_t \gamma^t P(s_t = s \mid \pi)$ 是折扣後的狀態分布。

第 34 頁說明它的好與壞。好處：新策略 $\pi'$ 的表現，用**舊策略 $\pi$ 的 advantage** 就能表示。壞處：期望仍然要在 $\pi'$ 的軌跡上取，而 $\pi'$ 正是我們還沒有的東西。

### 動作的部分用 importance sampling 修掉

第 36 頁把動作分布從 $\pi'$ 換成 $\pi$，代價是乘上比值：

$$J(\pi') - J(\pi) = \frac{1}{1-\gamma}\,\mathbb{E}_{s \sim d^{\pi'},\, a \sim \pi}\Big[\frac{\pi'(a \mid s)}{\pi(a \mid s)} A^\pi(s,a)\Big]$$

這跟[上一篇](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)的 likelihood ratio 是同一招：乘一個比值，把期望搬到你能取樣的分布底下。第 37 頁指出只剩一個問題：狀態仍然是 $s \sim d^{\pi'}$。

### 狀態的部分直接近似

第 38 頁的做法很直接：假裝 $d^{\pi'} \approx d^\pi$，不管它。得到的近似叫 $L_\pi(\pi')$：

$$J(\pi') - J(\pi) \approx L_\pi(\pi') = \frac{1}{1-\gamma}\,\mathbb{E}_{s \sim d^\pi,\, a \sim \pi}\Big[\frac{\pi'(a \mid s)}{\pi(a \mid s)} A^\pi(s,a)\Big]$$

第 40 頁強調這個近似的價值：它**只用舊策略的軌跡就能最佳化**。而且因為權重只依賴當下這一步、不依賴之前的整段歷史，它不會像整條軌跡的 importance weight 那樣消失或爆炸。

這個近似有多準？第 38 頁引用 [Achiam, Held, Tamar, Abbeel 2017（Constrained Policy Optimization）](https://arxiv.org/abs/1705.10528)的 **relative policy performance bound**：

$$\big|J(\pi') - (J(\pi) + L_\pi(\pi'))\big| \le C\sqrt{\mathbb{E}_{s \sim d^\pi}\big[D_{KL}(\pi' \,\|\, \pi)[s]\big]}$$

**新舊策略在 KL 散度上夠接近，近似就夠好。** 這句話是整段的主角。

<details>
<summary>L6 第 39 頁：KL 散度的定義與性質</summary>

離散分布 $P$、$Q$ 之間：

$$D_{KL}(P \,\|\, Q) = \sum_x P(x) \log \frac{P(x)}{Q(x)}$$

性質：$D_{KL}(P\|P) = 0$；$D_{KL}(P\|Q) \ge 0$；而且**不對稱**，$D_{KL}(P\|Q) \ne D_{KL}(Q\|P)$。兩個策略在狀態 $s$ 的 KL 是 $\sum_a \pi'(a \mid s) \log \frac{\pi'(a \mid s)}{\pi(a \mid s)}$。

</details>

第 41 頁的延伸閱讀是這條思路的三篇源頭：[Kakade & Langford 2002](https://people.eecs.berkeley.edu/~pabbeel/cs287-fa09/readings/KakadeLangford-icml2002.pdf)、[TRPO（Schulman et al. 2015）](https://arxiv.org/abs/1502.05477)、[CPO（Achiam et al. 2017）](https://arxiv.org/abs/1705.10528)。

## Monotonic improvement：為什麼保證不退步

L7 第 17–21 頁把上面的界翻成一個下界：

$$J(\pi') - J(\pi) \ge L_\pi(\pi') - C\sqrt{\mathbb{E}_{s \sim d^\pi}\big[D_{KL}(\pi' \,\|\, \pi)[s]\big]}$$

對右邊最大化，就保證比 $\pi$ 好。投影片稱之為對真正目標的 **majorize-maximize** 演算法，而且 $L_\pi$ 與 KL 項都能用 $\pi$ 的樣本估計。

<details>
<summary>L7 第 21 頁：不退步的證明</summary>

令 $\pi_{k+1} = \arg\max_{\pi'} L_{\pi_k}(\pi') - C\sqrt{\mathbb{E}_{s \sim d^{\pi_k}}[D_{KL}(\pi' \| \pi_k)[s]]}$。

$\pi_k$ 本身就是一個可行解，而且在 $\pi_k$ 上目標值是 0：

- $L_{\pi_k}(\pi_k) \propto \mathbb{E}_{s,a \sim d^{\pi_k}, \pi_k}[A^{\pi_k}(s,a)] = 0$（策略對自己的 advantage 平均是 0）
- $D_{KL}(\pi_k \| \pi_k)[s] = 0$

所以最佳值 $\ge 0$。再由下界，$J(\pi_{k+1}) - J(\pi_k) \ge 0$。

投影片補充：就算把最佳化限制在任意參數化策略類別 $\Pi_\theta$ 裡，只要 $\pi_k \in \Pi_\theta$，證明照樣成立。

</details>

### 理論的問題：C 太大

L7 第 22 頁：理論給出的 $C$ 在 $\gamma$ 接近 1 時非常大，照著走步伐會太小。投影片列了兩條出路：

- **調整 KL 懲罰的係數** → PPO
- **改成 KL 限制**（叫 trust region）→ 也就是 TRPO 的路線

## PPO：兩個變體

L6 第 43 頁的定義：**Proximal Policy Optimization（PPO）是一族方法，近似地懲罰策略在兩步之間改變太多**；第 46 頁補一句，它做到這件事**不需要算 natural gradient**。

### 變體一：adaptive KL penalty

$$\theta_{k+1} = \arg\max_\theta L_{\theta_k}(\theta) - \beta_k \bar{D}_{KL}(\theta \,\|\, \theta_k)$$

第 44 頁的演算法：

1. 用 $\pi_k$ 收集一批部分軌跡。
2. 用任一種 advantage 估計法估 $\hat{A}_t^{\pi_k}$。
3. 用 Adam 跑 $K$ 步 minibatch SGD，最大化上式。
4. 如果 KL 超過目標 $\delta$ 的 1.5 倍，$\beta_{k+1} = 2\beta_k$；如果低於 $\delta/1.5$，$\beta_{k+1} = \beta_k/2$。

投影片的兩句註記：初始 $\beta$ 不太重要，它很快會自己調整；有些迭代會違反 KL 限制，但大多數不會。第 45 頁特別標出第 3 步：**同一批資料走 K 步**，這正是樣本效率問題的解法。

### 變體二：clipped objective

第 46 頁。令 $r_t(\theta) = \pi_\theta(a_t \mid s_t) / \pi_{\theta_k}(a_t \mid s_t)$：

$$L^{CLIP}_{\theta_k}(\theta) = \mathbb{E}_{\tau \sim \pi_k}\Big[\sum_{t=0}^T \min\big(r_t(\theta)\hat{A}_t^{\pi_k},\ \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t^{\pi_k}\big)\Big]$$

$\epsilon$ 是超參數，投影片寫「maybe $\epsilon = 0.2$」。第 47–48 頁的小測給一張 [PPO 論文（Schulman et al. 2017）](https://arxiv.org/abs/1707.06347)的圖，問左右兩張分別對應 $A > 0$ 還是 $A < 0$。答案是**左圖 $A > 0$、右圖 $A < 0$**。

讀這個式子的直覺：

- $A > 0$（這個動作比平均好）：想提高 $r_t$，但超過 $1+\epsilon$ 之後目標變平，再推也沒有好處。
- $A < 0$（這個動作比平均差）：想降低 $r_t$，但低於 $1-\epsilon$ 之後目標也變平。
- 外層的 $\min$ 讓目標永遠取比較悲觀的那一個。我的讀法是：clipping 只擋「往有利方向走太遠」，不擋把變差的方向修回來。這一點投影片沒有逐字寫出，可以對照 PPO 論文第 3 節的圖 1。

A2 第 2.7(b) 題要你寫出 clipped 目標梯度為 0 的所有情況並解釋原因，正是在練這三條。

## GAE：advantage 要怎麼估

PPO 裡的 $\hat{A}_t$ 從哪來？L7 第 10 頁先回顧 n-step 估計。令 TD error $\delta_t^V = r_t + \gamma V(s_{t+1}) - V(s_t)$：

$$\hat{A}_t^{(1)} = \delta_t^V, \quad \hat{A}_t^{(2)} = \delta_t^V + \gamma\delta_{t+1}^V, \quad \hat{A}_t^{(k)} = \sum_{l=0}^{k-1}\gamma^l \delta_{t+l}^V = \sum_{l=0}^{k-1}\gamma^l r_{t+l} + \gamma^k V(s_{t+k}) - V(s_t)$$

最後一個等號是 telescoping sum。

第 11–12 頁的 **Generalized Advantage Estimator** 是這些估計的指數加權平均：

$$\hat{A}_t^{GAE(\gamma,\lambda)} = (1-\lambda)\big(\hat{A}_t^{(1)} + \lambda\hat{A}_t^{(2)} + \lambda^2\hat{A}_t^{(3)} + \dots\big) = \sum_{l=0}^\infty (\gamma\lambda)^l \delta_{t+l}^V$$

投影片註明它出自 [Schulman et al.〈High-Dimensional Continuous Control Using Generalized Advantage Estimation〉（ICLR 2016）](https://arxiv.org/abs/1506.02438)，推導也照論文走。

第 13–14 頁的小測問 GAE($\gamma$, 0) 與 GAE($\gamma$, 1) 的性質。投影片答案：

- **GAE($\gamma$, 0) 就是用 TD(0) 回報的 advantage**，也就是 $\delta_t^V$
- **GAE($\gamma$, 0) 的偏差很可能比 GAE($\gamma$, 1) 大**

第 15 頁的結論：一般會選 $\lambda \in (0, 1)$ 來平衡偏差與變異。這跟 [order 4](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation) 的 MC vs TD 是同一個取捨，只是換到 advantage 上。

第 16 頁：**PPO 用截斷版 GAE**，只加到第 $T$ 步：$\hat{A}_t = \sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}^V$。好處是只要在環境裡跑 $T$ 步就能更新，梯度估計也比較好。

## 總結：兩頁摘要

L7 第 23 頁的 PPO 摘要：

- 提升資料效率：蒐集新資料前可以走好幾步梯度
- 用 clipping（或 KL 限制）提高單調改進的可能性
- 保守的策略更新是 RL 裡很有影響力的想法，至少可以追溯到 2000 年代初
- 收斂到局部最佳
- 很受歡迎、容易實作，用在 ChatGPT 的調校

第 24 頁的策略梯度摘要：非常受歡迎、有很多超出本課的延伸；reward 不可微也能用；常跟 model-free 的價值方法搭配，也就是 actor-critic。

## 對應到 A2

A2 第 2.4 節的 PPO 跟投影片的 clipped 變體是同一個目標，只是符號改成 $z_\theta$ 表示比值、advantage 用 $G_t - V_\phi(s_t)$（A2 把 $V_\phi$ 叫 critic，訓練方式跟 baseline 網路一樣）。題目的做法是：用 $\pi_{\theta_{old}}$ 收集資料，對 $J_{clip}$ 做梯度上升，每 $K$ 次更新後把 $\pi_{\theta_{old}}$ 設成 $\pi_\theta$。

三個跟本篇直接相關的寫作題：

| A2 題號 | 分數 | 在問什麼 | 回看本篇 |
|---|---|---|---|
| 2.7(b) | 3 | clipped 目標的梯度何時為 0？為什麼 PPO 這樣設計？ | clipped objective 一節的三條直覺 |
| 2.7(c) | 3 | 為什麼 PPO 需要在 rollout 時快取 log 機率，REINFORCE 不需要？沒存的話實作要怎麼改？ | 比值 $r_t$ 的分母是舊策略 |
| 3(a)–(d) | 14 | 寫出軌跡分布、狀態分布 $d^\pi$，證明一個期望恆等式，最後證明 performance difference lemma | 「兩個策略的表現差」一節 |

題目另外給了一個實作提示（Tip 3）：算比值時不要直接相除，改成把 log 機率相減再取指數。

完整的作業導覽在 [A2 作業篇](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo)。

**今晚可以做的事**：在紙上畫出 $\min(rA, \text{clip}(r)A)$ 對 $r$ 的圖，$A > 0$ 與 $A < 0$ 各一張，$\epsilon = 0.2$。畫完再回答 A2 2.7(b) 的「梯度何時為 0」，會比讀文字快很多。

## 延伸閱讀

- [CS224R 導讀：Off-Policy Actor-Critic（PPO 與 SAC）](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)：另一門 Stanford RL 課從實作角度講 PPO
- [CME295 導讀：偏好微調](/posts/ai/2026-09-29-cme295-preference-tuning)：PPO 與 KL 懲罰在 LLM 對齊裡的樣子
- [CS336 導讀：SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)
- [Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)

**系列導覽**：上一篇 [order 7：策略梯度——REINFORCE、baseline、actor-critic](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)｜下一篇 [order 9：A2——REINFORCE、baseline、PPO 實作](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

## 參考資料

- [CS234: Reinforcement Learning（Winter 2026 課程首頁）](https://web.stanford.edu/class/cs234/)
- [CS234 講義頁（modules）](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 6: Policy Gradient II 投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf)
- [Lecture 7: Policy Gradients and Imitation Learning 投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf)
- [Assignment 2 題目 PDF（Winter 2026）](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Lecture 6: Policy Search 2（Spring 2024，YouTube）](https://www.youtube.com/watch?v=8PwvNQ5WS-o)
- [Lecture 7: Policy Search 3（Spring 2024，YouTube）](https://www.youtube.com/watch?v=4ngb0IZTg8I)
- [Kakade & Langford 2002：Approximately Optimal Approximate Reinforcement Learning](https://people.eecs.berkeley.edu/~pabbeel/cs287-fa09/readings/KakadeLangford-icml2002.pdf)
- [Schulman et al. 2015：Trust Region Policy Optimization](https://arxiv.org/abs/1502.05477)
- [Schulman et al. 2016：High-Dimensional Continuous Control Using Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438)
- [Schulman et al. 2017：Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Achiam, Held, Tamar, Abbeel 2017：Constrained Policy Optimization](https://arxiv.org/abs/1705.10528)
