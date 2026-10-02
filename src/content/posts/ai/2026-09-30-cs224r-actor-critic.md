---
title: "CS224R L4：Actor-Critic 與價值估計——先學會判斷好壞，再多做好事"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, policy-gradient]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 5
tldr: "Policy gradient 只能從實際拿到的獎勵判斷好壞，資料用得很浪費。Actor-critic 多訓練一個價值函數（critic）來估計「這個狀態有多好」，再用它算 advantage 去加權 policy（actor）的梯度。估計價值有三條路：用整條 rollout 的獎勵總和直接監督（Monte Carlo）、用「這一步獎勵加上自己對下一個狀態的估計」監督（bootstrap），或折衷的 n 步回報。L4 最後把它推到 off-policy：先在同一批資料上多走幾步（這是 PPO 的起點），再用 replay buffer 重用所有舊資料（這是 SAC 的起點）。"
description: "Stanford CS224R Deep Reinforcement Learning（Spring 2026）第 4 講 Actor-Critic Methods 導讀：V、Q、advantage 的定義，為什麼 policy gradient 浪費資料，Monte Carlo、bootstrap 與 n-step returns 三種價值估計的偏差與變異取捨，discount factor，完整的 actor-critic 演算法，以及兩種 off-policy 版本：多步梯度加 importance weight，和 replay buffer 加 Q 函數。"
draft: false
glossary:
  - term: "advantage function"
    aliases: ["優勢函數", "A^π(s,a)"]
    definition: "在狀態 s 選動作 a，比照目前 policy 行動平均好多少，等於 Q^π(s,a) − V^π(s)。"
    context: "CS224R L4 用它取代 policy gradient 裡的「reward to go 減 baseline」。"
  - term: "bootstrapping"
    aliases: ["自舉", "temporal difference learning"]
    definition: "用「這一步的獎勵加上自己目前對下一個狀態的價值估計」當作訓練價值函數的標籤，而不是等整條軌跡跑完再加總獎勵。"
    context: "L4 投影片稱它也是 temporal difference（TD）學習的一種形式。"
  - term: "replay buffer"
    aliases: ["經驗回放緩衝區"]
    definition: "把過去所有互動得到的轉移 (s, a, s′, r) 存起來，訓練時從中隨機抽 minibatch 的資料結構。"
    context: "L4 的第二種 off-policy actor-critic 靠它重用舊資料。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-actor-critic-en)

> **來源年份**：本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 第 4 講投影片 [04_cs224r_actor_critic_2026.pdf](https://cs224r.stanford.edu/slides/04_cs224r_actor_critic_2026.pdf)（37 頁，2026-04-10 上課）。2026 錄影只放在 Canvas；配套影片是 [Spring 2025 L4 錄影](https://www.youtube.com/watch?v=oejFZShW9hU)（補充）。2025 與 2026 版投影片的講次大綱相同，2026 版在開頭的複習多補了幾行 policy gradient 的特性，其餘差在日期。影片內容本文沒有逐段引用。

這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 5 篇，直接接在 [L3 Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients) 後面。投影片第 5 頁的學習目標有兩個：

- 怎麼估計一個狀態和動作對某個 policy 來說有多好
- 怎麼用這些估計做出更有效率的 RL 演算法

這一講的公式比 L3 多，但主軸只有一條：**與其等獎勵告訴你好壞，不如訓練一個網路來預測好壞。**

## 場景：policy gradient 在浪費資料

第 3 頁複習 L3 時補了兩個特性：policy gradient 要**收完整條軌跡才能更新**；它**不依賴 Markov 性質**，所以可以直接用觀測值（observation）而不是完整狀態。

第 8 頁指出它的問題。回到摺外套的例子，獎勵是稀疏的：

- 只摺了袖子的軌跡
- 把外套攤平但沒摺的軌跡

這兩條離成功都已經很近，但稀疏獎勵下它們的獎勵是 0，policy gradient **完全用不到**它們。人形機器人「往前一小步然後往後跌」那條，也會把那一小步的機率一起壓低。

投影片的結論：policy gradient 沒有有效率地使用資料。然後問：**我們能不能學會判斷什麼是好、什麼是壞？**

## 直覺：把「reward to go」換成一個更好的估計

L3 的梯度用「從 t 開始實際拿到的獎勵總和」來加權每個動作。第 9 頁指出，這只是**一次取樣**的結果，雜訊很大。如果能拿到**期望的**未來獎勵，就會好得多。

第 10 頁再往前一步：加上 baseline 之後，權重其實就是 **advantage**，也就是「這個動作比平均好多少」。**advantage 估得越準，梯度的雜訊越小。**

所以線上 RL 的迴圈（第 11–12 頁）多了一步：

1. 跑 policy 收一批資料
2. **擬合一個模型來估計期望回報**（V、Q 或 A）
3. 用它改進 policy

負責做決策的 policy 叫 actor，負責評估好壞的價值函數叫 critic。

## 機制一：三個價值物件

第 6 頁定義了三個函數，都是針對某個固定的 policy π：

| 名稱 | 意思 |
|---|---|
| $V^\pi(s)$ 價值函數 | 從 s 出發、之後照 π 行動，期望拿到的未來獎勵 |
| $Q^\pi(s,a)$ Q 函數 | 從 s 出發、先做 a、之後照 π 行動，期望拿到的未來獎勵 |
| $A^\pi(s,a)$ advantage | 在 s 做 a 比照 π 行動好多少：$Q^\pi(s,a) - V^\pi(s)$ |

兩者的關係是 $V^\pi(s) = \mathbb{E}_{a\sim\pi(\cdot\mid s)}[Q^\pi(s,a)]$。

第 7 頁用一個例子讓學生練習：目標是「一個月內能打完一段鼓譜」就得 1 分，否則 0 分；三個動作的圖示分別是躺椅上休息（a1）、坐在電腦前（a2）和打鼓（a3），而目前的 policy 永遠選 a1。在這個 policy 下，V、Q、A 各是多少？這題值得停下來自己算一次，特別是「打鼓」的 Q 值，因為它的定義是「先做一次這個動作，**之後照目前的 policy**」。

### 該擬合哪一個？

第 14 頁的推導給出答案：只要擬合 $V^\pi$ 就夠了。

因為 Q 可以拆成「這一步的獎勵」加上「下一個狀態的 V」，用實際取樣到的下一個狀態近似期望值後，advantage 就能只用一個 V 網路算出來：

$$A^\pi(s_t, a_t) \approx r(s_t, a_t) + V^\pi(s_{t+1}) - V^\pi(s_t)$$

V 只吃狀態、不吃動作，比 Q 好學。

## 機制二：怎麼訓練 V（policy evaluation）

估計某個 policy 的價值，稱為 policy evaluation。L4 給了三個版本。

### 版本 1：Monte Carlo，直接用 rollout 監督

第 15–17 頁：理想上，要知道 $V^\pi(s)$，就從 s 出發跑很多次 π，取平均。但現實中**無法把世界重設回同一個狀態**。

做法是退一步：每條軌跡在每個時間點都留下一個「單一樣本」估計（從那裡開始實際拿到的獎勵總和），把這些全部收集成資料集，再用**監督學習**擬合一個 V 網路。網路的泛化能力會替你在相似的狀態之間做平均。

### 版本 2：Bootstrap，用自己的估計當標籤

第 18 頁：標籤改成「這一步的獎勵，加上目前 V 網路對下一個狀態的估計」。因為標籤裡含有 V 自己，**每次梯度更新後標籤都要重算**。投影片註明這也是 temporal difference（TD）學習的一種形式。

### 兩者差在哪：一個例子

第 19 頁畫了兩條軌跡。一條（黑線）先經過粉紅色的狀態，再經過藍色的狀態，最後拿到 −1；另一條（灰線）從別的路徑到達同一個藍色狀態，最後拿到 +1。沿途獎勵都是 0。投影片要學生討論兩種方法估出來的 V 各是多少。

投影片沒有寫答案。依圖來推：藍色狀態被兩條軌跡經過，兩種方法都會估得接近 0。粉紅色狀態只被黑線經過，Monte Carlo 只看得到那一次的 −1；bootstrap 則是從藍色狀態的估計接過值，也就是接近 0。bootstrap 把不同軌跡的資訊接在一起，變異比較小，但它依賴 V 自己的估計，估錯就會帶進偏差。

投影片在這裡問：**有沒有中間地帶，能平衡偏差和變異？**

### 版本 3：n 步回報，折衷

第 20 頁：先加總接下來 n 步的實際獎勵，再接上第 n 步之後那個狀態的 V 估計。

- 比 Monte Carlo 變異小
- 比一步 bootstrap 偏差小

投影片的結論：**n 大於 1、小於 T，實務上通常效果最好。**

<details>
<summary>三種標籤的式子（第 19–20 頁）</summary>

- Monte Carlo：$y_{i,t} = \sum_{t'=t}^{T} r(s_{i,t'}, a_{i,t'})$
- Bootstrap：$y_{i,t} = r(s_{i,t}, a_{i,t}) + \hat{V}^\pi_\phi(s_{i,t+1})$
- n 步回報：$y_{i,t} = \sum_{t'=t}^{t+n-1} r(s_{i,t'}, a_{i,t'}) + \hat{V}^\pi_\phi(s_{i,t+n})$

三者都用平方誤差訓練：$\mathcal{L}(\phi) = \frac{1}{2}\sum_i \|\hat{V}^\pi_\phi(s_i) - y_i\|^2$。

</details>

### 插曲：discount factor

第 21 頁：如果回合長度 T 是無限的，V 在很多情況下會變成無限大。簡單的做法是「早拿到的獎勵比晚拿到的好」，在 bootstrap 標籤裡的 V 前面乘上 $\gamma \in [0, 1]$，投影片註明 0.99 效果不錯。

投影片也指出 γ 其實**改變了 MDP**：等於每一步都有 1 − γ 的機率掉進一個結束狀態。這張投影片標注改編自 Sergey Levine。

## 機制三：完整的 actor-critic 演算法

第 22 頁把上面的東西串起來：

1. 用 $\pi_\theta$ 取樣一批軌跡
2. 用資料裡的獎勵總和擬合 $\hat{V}_\phi$
3. 對每個 (t, i) 算 $\hat{A}(s_{t,i}, a_{t,i}) = r(s_{t,i}, a_{t,i}) + \gamma\hat{V}_\phi(s_{t+1,i}) - \hat{V}_\phi(s_{t,i})$
4. $\nabla_\theta J(\theta) \approx \sum_{t,i}\nabla_\theta\log\pi_\theta(a_{t,i}\mid s_{t,i})\,\hat{A}(s_{t,i}, a_{t,i})$
5. $\theta \leftarrow \theta + \alpha\nabla_\theta J(\theta)$

第 23 頁用一句話對照兩者：

- **Policy gradient**：觀察什麼是好、什麼是壞，然後多做好事。
- **Actor-critic**：**學會估計**什麼是好、什麼是壞，然後多做好事。

## 機制四：推向 off-policy

上面的演算法仍然是 on-policy 的。L4 的最後一段給了兩種越來越 off-policy 的版本。

### 版本 1：同一批資料走多步梯度

第 25–27 頁：在第 4 步套上 L3 的 importance weight，就能在同一批資料上走好幾步。

但 advantage 是用**舊** policy 算的，走越多步就越過時；policy 又會不斷提高高 advantage 動作的機率。第 27 頁問：走太多步會出什麼事？並給兩個點子：

- **點子 1：對 policy 加 KL 限制。** 投影片說這會在 LLM 偏好最佳化裡再看到。
- **點子 2：限制 importance weight 的大小。** 它不直接限制 policy，但移除了 policy 一直往同方向推的誘因。投影片說這是 **PPO 的核心想法**。

課表上 L4 列的閱讀除了 [Sutton et al. 1999](https://proceedings.neurips.cc/paper_files/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf)，還有 [PPO（Schulman et al. 2017）](https://arxiv.org/pdf/1707.06347)。PPO 的細節留給[下一講](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)。

### 版本 2：replay buffer，重用所有舊資料

第 28 頁問：能不能更 off-policy，把過去所有試誤的資料都拿來用？關鍵有兩個：把所有舊資料存進 **replay buffer**，以及修改式子，移除其中的 on-policy 假設。

第 30 頁先把 actor-critic 直接改成「從 buffer 抽 minibatch」，然後指出**這個演算法是壞的**，有兩處錯：

1. **價值的標籤不對。** buffer 裡的轉移是舊 policy 做的，拿它的下一個狀態算 V，估的不是目前 policy 的價值。
2. **policy 的更新不對。** buffer 裡的動作不是目前 policy 會做的動作。

第 31–33 頁逐一修正：

- **修價值函數**：改學 **Q** 而不是 V。Q 的標籤是「r 加上下一個狀態、下一個動作的 Q」，而下一個動作 **從目前的 policy 重新抽**，不從 buffer 拿。
- **修 policy 更新**：同樣的技巧，對每個 buffer 裡的狀態，從目前 policy 重新抽一個動作來算梯度。實務上直接用 Q 取代 advantage；投影片說這樣變異比較高但很方便，並留了一個問題：為什麼這裡可以接受比較高的變異？
- **剩下的問題**：buffer 裡的狀態不是目前 policy 會走到的分佈。投影片的回答是「沒辦法，接受它」。直覺是：我們想要在 policy 自己的狀態分佈上最優，實際得到的是在一個**更廣**的分佈上最優。

<details>
<summary>修正後的 off-policy actor-critic（第 33 頁）</summary>

1. 做動作 $a\sim\pi_\theta(a\mid s)$，得到 $(s, a, s', r)$，存進 $\mathcal{R}$
2. 從 $\mathcal{R}$ 抽一批 $\{s_i, a_i, r_i, s'_i\}$
3. 用標籤 $y_i = r_i + \gamma\hat{Q}^\pi_\phi(s'_i, a'_i)$ 更新 $\hat{Q}^\pi_\phi$，其中 $a'_i\sim\pi_\theta(a'\mid s'_i)$
4. $\nabla_\theta J(\theta) \approx \frac{1}{N}\sum_i\nabla_\theta\log\pi_\theta(a^\pi_i\mid s_i)\,\hat{Q}^\pi(s_i, a^\pi_i)$，其中 $a^\pi_i\sim\pi_\theta(a\mid s_i)$
5. $\theta \leftarrow \theta + \alpha\nabla_\theta J(\theta)$

第 29–34 頁標注改編自 Sergey Levine 的投影片。

</details>

第 34 頁補了實作細節：Q 還有更講究的擬合方法（接下來兩講會講）；高斯 policy 可以用 reparameterization trick 更好地估計梯度。實際演算法的例子是 [Soft Actor-Critic（Haarnoja et al. 2018）](https://arxiv.org/abs/1801.01290)。

## 連回整門課：兩種 off-policy 的取捨

第 35 頁比較兩端：

- **比較 off-policy（有 replay buffer，例如 SAC）**：資料效率可以高很多。
- **比較 on-policy（沒有 replay buffer，例如 PPO）**：前者通常更難調超參數、也比較不穩定。

這個比較就是接下來幾講的地圖。L5 講 PPO 和 SAC，L6 講 Q-learning。HW2 則讓你在同一個稀疏獎勵的 Sawyer 機械手臂敲釘子任務上，先寫 PPO，再寫一個 off-policy 演算法。第 37 頁預告，下週是最後一個大型線上 RL 方法 Q-learning，以及線上 RL 演算法的實務實作。

**今晚可以做的事**：把第 19 頁的圖畫在紙上，自己填四個格子，再對照上面的推論。然後把軌跡數增加到三條、讓粉紅色狀態被兩條經過，看看 Monte Carlo 和 bootstrap 的估計會怎麼變。這個練習能讓你在 L6 看到 Q-learning 的 bootstrap 標籤時，知道它省了什麼、又冒了什麼風險。

## 延伸閱讀

- [Sutton et al. 1999：Policy Gradient Methods for Reinforcement Learning with Function Approximation](https://proceedings.neurips.cc/paper_files/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf)：課表列的指定閱讀，證明 policy gradient 可以用近似的 Q 或 advantage 函數來估計
- [Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)：另一門課對 actor-critic 的講法
- [CME295：偏好微調](/posts/ai/2026-09-29-cme295-preference-tuning)：KL 限制在 LLM 偏好最佳化裡的樣子

**系列導覽**：上一篇 [L3：Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients)｜下一篇 [L5：Off-Policy Actor-Critic（PPO 與 SAC）](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程首頁與課表）](https://cs224r.stanford.edu/)
- [L4 Actor-Critic Methods 投影片（2026）](https://cs224r.stanford.edu/slides/04_cs224r_actor_critic_2026.pdf)
- [L4 Actor-Critic Methods 投影片（Spring 2025 封存）](https://cs224r.stanford.edu/spring_2025/slides/04_cs224r_actor_critic_2025.pdf)
- [Spring 2025 Lecture 4: Actor-Critic Methods（YouTube，Stanford Online）](https://www.youtube.com/watch?v=oejFZShW9hU)
- [CS224R Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Sutton, McAllester, Singh, Mansour 1999（NeurIPS）](https://proceedings.neurips.cc/paper_files/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf)
- [Schulman et al. 2017：Proximal Policy Optimization Algorithms](https://arxiv.org/pdf/1707.06347)
- [Haarnoja, Zhou, Abbeel, Levine 2018：Soft Actor-Critic](https://arxiv.org/abs/1801.01290)
