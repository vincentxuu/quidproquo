---
title: "CS234 導讀：沒模型時怎麼控制——ε-greedy、GLIE、Q-learning 與函數近似"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, q-learning, function-approximation]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 5
tldr: "會評估之後，下一步是一邊收資料一邊把策略變好。CS234 第 4 講的路線是：ε-greedy 讓策略改進仍然單調；GLIE 規定探索要多到什麼程度、何時收手；Q-learning 在 GLIE 加上 Robbins–Monro 步長下會收斂到 Q*；最後把表格換成參數化的 Q̂(s,a;w)，用 MC、SARSA 或 Q-learning 的目標做 SGD。代價是 deadly triad：函數近似、bootstrapping、off-policy 三者同時出現時，可能震盪或發散。"
description: "Stanford CS234（Winter 2026）第 4 講 p.16–60 導讀：model-free policy iteration、探索與利用、ε-greedy 的單調改進定理、GLIE 與 GLIE MC control、on-policy 與 off-policy、SARSA 與 Q-learning 的收斂條件、value function approximation 的 MC 與 TD 目標，以及 deadly triad。"
draft: false
glossary:
  - term: "GLIE"
    aliases: ["Greedy in the Limit of Infinite Exploration"]
    definition: "兩個條件：每個 state-action pair 都被造訪無窮多次；行為策略最終收斂到對 Q 貪婪的策略。ε 以 1/i 的速率降到 0 的 ε-greedy 就滿足它。"
    context: "L4 用它當 MC control 與 Q-learning 收斂定理的前提。"
  - term: "off-policy learning"
    aliases: ["離策略學習", "off-policy"]
    definition: "用某個行為策略收集的經驗，去估計與評估另一個（通常是目標）策略。相對的 on-policy 是從自己執行的經驗學自己。"
    context: "Q-learning 是 off-policy：用 ε-greedy 行動，卻估計最佳策略的 Q 值。"
  - term: "deadly triad"
    aliases: ["致命三角"]
    definition: "函數近似、bootstrapping、off-policy learning 同時出現時，價值學習可能震盪或不收斂。"
    context: "L4 的解釋是 Bellman operator 是 contraction，但函數近似的擬合步驟可能是 expansion。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 的 [Lecture 4 投影片](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf)（post 版，89 頁）p.16–60 與選讀例題 p.80–89；p.62–78 的 DQN 留給下一篇。公開錄影是 Spring 2024 版的 [第 4 支「Q learning and Function Approximation」](https://www.youtube.com/watch?v=b_wvosA70f8)，內容與 2026 投影片未逐頁對照。事實在 2026-09-30 打開官方投影片核對。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。

**系列位置**：上一篇 [沒模型時怎麼評估：MC、TD(0)、certainty equivalence](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation)｜下一篇 [DQN：deadly triad、experience replay、fixed targets](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

[上一篇](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation) 學會了在沒有模型時估一個**固定**策略的價值。但我們真正要的不是「這個策略值多少」，而是「怎麼找到更好的策略」。這就是 control。

L4 的標題是 **Model Free Control and Function Approximation**，一講裡做了兩件事：先在表格設定下把 policy iteration 搬到沒有模型的世界，再把表格換成參數化的函數。投影片列的讀物是 [Sutton & Barto](http://incompleteideas.net/book/the-book-2nd.html) 5.2–5.4、6.4、6.5、6.7 節，結構參考 David Silver 的第 5、6 講。投影片第 2 頁放的是 Atari 上的 deep RL，先讓你知道這一講的終點在哪。

## 把 policy iteration 搬到沒有模型的世界

有模型時的 policy iteration 是「評估 → 貪婪改進」反覆做。L4 p.17 指出，沒模型時有三個地方要改：

1. **評估要改成估 Q，不是 V。** 沒有模型，就算知道 V^π 也沒辦法算「換一個動作會怎樣」；要直接改進策略，需要 Q^π(s, a)。
2. **確定性策略會卡住。** 如果 π 是確定性的，你永遠只看到 π(s) 那個動作，其他動作的 Q(s, a) 根本估不出來。
3. **改進用的是估計出來的 Q**，而且評估與改進要怎麼交錯，也要重新想。

第 2 點就是**探索問題**（p.18）：不試就學不到一個動作好不好；但花時間試新動作，就少了時間去做經驗上已知回報高的事。

## ε-greedy：最簡單的平衡，而且改進仍然單調

ε-greedy 策略（p.19）：以 1 − ε 的機率選 argmax_a Q(s, a)，其餘時候從 |A| 個動作裡均勻隨機選。所以 argmax 動作的總機率是 1 − ε + ε/|A|，其他每個動作是 ε/|A|。

上一講證明的「policy iteration 單調改進」假設改進步驟輸出確定性策略。L4 p.20–21 給了 ε-greedy 版本的定理：

> 對任何 ε-greedy 策略 π_i，對 Q^{π_i} 取 ε-greedy 得到的 π_{i+1} 是單調改進：V^{π_{i+1}} ≥ V^{π_i}。

<details>
<summary>證明的關鍵一步（L4 p.80）</summary>

把 Q^{π_i}(s, π_{i+1}(s)) 展開成 Σ_a π_{i+1}(a|s) Q^{π_i}(s, a) = (ε/|A|) Σ_a Q^{π_i}(s, a) + (1 − ε) max_a Q^{π_i}(s, a)。

接著把 max 換成一個加權平均：權重是 (π_i(a|s) − ε/|A|) / (1 − ε)。這組權重非負、加總為 1（因為 π_i 本身是 ε-greedy），而任何加權平均都不會超過 max。代回去之後，ε/|A| 那兩項互相抵銷，剩下 Σ_a π_i(a|s) Q^{π_i}(s, a) = V^{π_i}(s)。

所以 Q^{π_i}(s, π_{i+1}(s)) ≥ V^{π_i}(s)，之後的論證跟有模型時的 policy improvement 一樣。

</details>

## MC control 與 GLIE：探索要多、最後要收手

把上一篇的 first-visit MC 改成估 Q(s, a)，再每條 episode 之後做一次 ε-greedy 改進，就得到 **MC online control**（p.24–25）。投影片的虛擬碼裡，ε 從 1 開始，第 k 條 episode 之後設成 ε = 1/k。

這個 ε 的排程不是隨便選的。L4 p.29–30 定義 **GLIE**（Greedy in the Limit of Infinite Exploration）：

1. 每個 state-action pair 都被造訪**無窮多次**
2. 行為策略（實際用來行動的策略）以機率 1 收斂到對 Q 貪婪的策略

投影片說，ε_i = 1/i 的 ε-greedy 是一個簡單的 GLIE 策略。定理（p.31）是：**GLIE Monte-Carlo control 會收斂到最佳的 Q*(s, a)。**

### 動手算一次

p.26 的選讀例題（解答在 p.82）：Mars rover 加了第二個動作，r(·, a1) = [1 0 0 0 0 0 10]、r(·, a2) = [0 0 0 0 0 0 5]，γ = 1。目前貪婪策略全選 a1，ε = 0.5，Q 全部初始化為 0。從 ε-greedy 策略抽到這條軌跡：

(s3, a1, 0, s2, a2, 0, s3, a1, 0, s2, a2, 0, s1, a1, 1, terminal)

first-visit MC 的估計是 Q(·, a1) = [1 0 1 0 0 0 0]、Q(·, a2) = [0 1 0 0 0 0 0]，新的貪婪策略是 [a1, a2, a1, 平手, 平手, 平手, 平手]。如果新的 ε = 1/3，s1 選 a1 的機率是 1 − 1/3 + (1/3)/2 = **5/6**。

## TD control：SARSA 與 Q-learning

MC control 要等 episode 結束。把評估換成 TD，就能每一步都更新（p.33）。這裡要先分清兩種學習（p.34）：

- **On-policy**：從**執行某個策略**得到的經驗，學這個策略自己
- **Off-policy**：用**另一個策略**收集的經驗，去估計與評估目標策略

兩個演算法只差在 TD target 的一項：

| | 更新式 | 類型 |
|---|---|---|
| SARSA | Q(s_t, a_t) ← Q(s_t, a_t) + α(r_t + γQ(s_{t+1}, a_{t+1}) − Q(s_t, a_t)) | on-policy：用實際選的下一個動作 |
| Q-learning | Q(s_t, a_t) ← Q(s_t, a_t) + α(r_t + γ max_{a′} Q(s_{t+1}, a′) − Q(s_t, a_t)) | off-policy：用下一狀態最好的動作 |

Q-learning 的想法（p.35）是：用某個行為策略 π_b（例如對 Q 的 ε-greedy）行動，卻去估計**最佳策略 π*** 的 Q 值。

### 同一筆資料，兩個演算法差兩倍

選讀例題（p.83–87）把差別算給你看。延續雙動作的 Mars rover，α = 0.5，Q(·, a1) 初始化為 [1 0 0 0 0 0 10]、Q(·, a2) 為 [1 0 0 0 0 0 5]，從 s6 選 a1：

- **SARSA**，觀察到 (s6, a1, 0, s7, a2, 5, s7)：下一步實際選了 a2，所以 Q(s6, a1) = 0.5 × 0 + 0.5 × (0 + Q(s7, a2)) = **2.5**
- **Q-learning**，觀察到 (s6, a1, 0, s7)：取 max，Q(s6, a1) = 0 + 0.5 × (0 + max_{a′} Q(s7, a′) − 0) = 0.5 × 10 = **5**

投影片也回答了「Q 怎麼初始化重要嗎？」：漸近而言，在溫和條件下不重要；但一開始是重要的。

### Q-learning 什麼時候收斂

定理（p.37）：對有限狀態、有限動作的 MDP，Q-learning 在以下條件下收斂到 Q*(s, a)：

1. 策略序列 π_t(a|s) 滿足 GLIE
2. 步長 α_t 滿足 Robbins–Monro 條件：Σ_t α_t = ∞ 且 Σ_t α_t² < ∞（例如 α_t = 1/t）

p.38 補了這個結果依賴什麼：建立在 stochastic approximation 上、步長要以正確的速率下降、依賴 Bellman backup 的 contraction 性質、reward 與價值函數要有界。

## 表格裝不下時：value function approximation

以上全部都假設每個 (s, a) 有自己的一格表。L4 p.40 列出為什麼要換掉表格：不想為每個狀態與動作都分別存（並學）模型、價值、Q 或策略；想要一個**能在狀態之間泛化**的緊湊表示，同時減少所需的記憶體、計算與**經驗**。

### 先假設有神諭

p.41–43 先做一個理想化：假設有個 oracle，問它任何 (s, a) 都會回答真正的 Q^π(s, a)。那問題就變成監督式學習：用參數 w 的函數 Q̂(s, a; w) 擬合，最小化

J(w) = E_π[(Q^π(s, a) − Q̂(s, a; w))²]

用梯度下降找局部最小值，梯度是 ∇_w J(w) = −2E_π[(Q^π(s, a) − Q̂(s, a; w))∇_w Q̂(s, a; w)]。SGD 只用有限個（常常是一個）樣本來近似這個梯度；投影片提醒，SGD 更新的期望等於完整梯度的更新。

### 沒有神諭：拿目標代替真值

實際上沒有 oracle，所以要**找一個東西代替 Q^π(s_t, a_t)**。這跟上一篇的評估方法一一對應（p.48–54、59）：

| 目標 | 代替 Q^π(s_t, a_t) 的是 | 性質 |
|---|---|---|
| Monte Carlo | 回報 G_t | 無偏但有雜訊；等於在 (s, a, G) 資料上做監督式學習 |
| SARSA | r + γQ̂(s′, a′; w) | 用目前的近似函數 bootstrap |
| Q-learning | r + γ max_{a′} Q̂(s′, a′; w) | 同上，再加上 off-policy |

TD 版本的評估，投影片（p.52）說它同時做了**三種近似**：取樣、bootstrapping，以及價值函數近似。TD target r + γV̂(s′; w) 因此是「有偏、又被近似過」的真值估計。

Control 的做法就是交錯進行：用函數近似做近似的策略評估，再做 ε-greedy 改進（p.57）。

## Deadly triad：三件事同時出現就可能出事

p.57 先警告：這樣做**可能不穩定**，通常涉及以下三者的交集。p.60 把它叫做 **deadly triad**：

1. 函數近似
2. Bootstrapping
3. Off-policy learning（例如 Q-learning）

投影片的直覺解釋是：每次更新都像是先做一次（近似的）Bellman backup，再把結果擬合到某個特徵表示上。**Bellman operator 是 contraction，但函數近似的擬合可能是 expansion。** 兩者串在一起，就可能震盪或不收斂。投影片指向 Sutton & Barto 2018 的 Baird 反例。

回頭看上一篇 L3 p.56 的那句預告：MC 在函數近似下仍然 consistent，TD(0) 加上函數近似就不一定收斂。deadly triad 就是這句話的完整版。

下一篇的 DQN 正是從這裡出發：Q-learning 接上神經網路，三個條件全中。投影片（p.63）點出兩個具體問題：樣本之間高度相關，以及目標值一直在變。DQN 用 experience replay 與 fixed Q-targets 來撐住。

## 這一講結束時你應該會的事

L4 p.78 的「What You Should Understand」（DQN 那一條留到下一篇）：

- 能實作 TD(0) 與 MC 的 on-policy 評估
- 能實作 Q-learning、SARSA 與 MC control
- 能列出三個可能造成不穩定的因素（函數近似、bootstrapping、off-policy learning），並定性描述問題

## 自學怎麼做

1. 讀 [L4 投影片](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) p.16–60，再做 p.80–89 的選讀例題與小測（SARSA 與 Q-learning 對照那題，投影片的解答是「兩個敘述都對」）。
2. 公開錄影是 2024 版的 [Lecture 4「Q learning and Function Approximation」](https://www.youtube.com/watch?v=b_wvosA70f8)，當聽講補充。
3. 對照 [Sutton & Barto](http://incompleteideas.net/book/RLbook2018.pdf) 5.2–5.4、6.4、6.5、6.7。
4. 動手：拿 [作業一](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) 的 `riverswim.py`，它有 `step()` 可以取樣。在上面寫表格型 Q-learning 與 SARSA，把學到的 Q 跟你用 value iteration 算出的 Q* 比較。

今晚可以做的一件事：只算那兩個 2.5 與 5。先自己寫出 SARSA 和 Q-learning 的更新，再想：如果 ε 很大，SARSA 學到的是「哪個策略」的 Q？

## 延伸閱讀

- 同一套 Q-learning 在 CS221 的入門講法：[CS221 第 8 講：強化學習與 Q-learning](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning)
- 深度 RL 課程裡的 value-based 方法：[Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表：Week 2 的「Q-learning and function approximation」
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — L4 的 pre／post 投影片連結
- [CS234 Lecture 4 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) — ε-greedy 定理、GLIE、SARSA、Q-learning 收斂條件、VFA、deadly triad、選讀例題
- [CS234 Lecture 3 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf) — p.56：MC 與 TD 在函數近似下的收斂差異
- [Sutton & Barto, Reinforcement Learning: An Introduction（第二版）](http://incompleteideas.net/book/the-book-2nd.html) — 官網列的輔助讀物；5.2–5.4、6.4、6.5、6.7 與 Baird 反例
- [Stanford CS234 Spring 2024 Lecture 4「Q learning and Function Approximation」](https://www.youtube.com/watch?v=b_wvosA70f8) — 公開錄影（2024 版）
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — 全部 16 支公開錄影
