---
title: "CS234 導讀：沒模型時怎麼評估策略——MC、TD(0) 與 certainty equivalence"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, temporal-difference, mdp]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 4
tldr: "不知道轉移機率與 reward，要怎麼估一個策略值多少？CS234 第 3 講給三個答案：Monte Carlo 直接平均整條軌跡的回報（無偏、變異大、要等 episode 結束），TD(0) 用「一步 reward＋下一狀態的估計值」當目標（有偏、變異小、每一步都能更新），certainty equivalence 先估模型再做動態規劃（最省資料、最貴的計算）。第 4 講開頭的 AB 例子把差別講到最清楚：同一批資料，MC 說 V(A)=0，TD 說 V(A)=0.75。"
description: "Stanford CS234（Winter 2026）第 3 講與第 4 講開頭導讀：first-visit／every-visit／incremental Monte Carlo、bias／variance／consistency、TD(0) 與 TD error、Mars rover 例子、certainty equivalence 的計算成本，以及 batch 設定下 MC 與 TD 各自收斂到什麼（Sutton & Barto 的 AB 例子）。"
draft: false
glossary:
  - term: "bootstrapping"
    aliases: ["自舉", "bootstrap"]
    definition: "在 RL 裡指用自己目前的價值估計來組成更新目標，例如用 V(s′) 代替 s′ 之後所有回報的期望。"
    context: "L3 指出動態規劃與 TD 都 bootstrap，Monte Carlo 不會。"
  - term: "TD error"
    aliases: ["temporal difference error", "δ_t"]
    definition: "δ_t = r_t + γV(s_{t+1}) − V(s_t)：TD 目標與目前估計的差。TD(0) 每一步把 V(s_t) 往這個方向移動 α 倍。"
    context: "L3 的 TD(0) 更新式就是 V(s_t) ← V(s_t) + α·δ_t。"
  - term: "certainty equivalence"
    aliases: ["確定性等價", "MLE MDP"]
    definition: "先用資料算出轉移與 reward 的最大概似估計，把這個估出來的 MDP 當成真的，再用動態規劃求 V^π。"
    context: "L3 的第三種 model-free 設定下的評估法；L4 指出 batch TD(0) 收斂到的正是它的答案。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 的 [Lecture 3 投影片](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf)（post 版，57 頁）與 [Lecture 4 投影片](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) p.5–15；公開錄影是 Spring 2024 版的 [第 3 支「Policy Evaluation」](https://www.youtube.com/watch?v=jjq51TRNVvk)，內容與 2026 投影片未逐頁對照。事實在 2026-09-30 打開官方投影片核對。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：投影片公開，課堂 Poll Everywhere 的即時作答與 2026 錄影拿不到。

**系列位置**：上一篇 [作業一：有效視野、reward hacking、Bellman residual 與 RiverSwim](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim)｜下一篇 [沒模型時怎麼控制：ε-greedy、GLIE、Q-learning、函數近似](/posts/ai/2026-09-30-cs234-model-free-control-function-approx)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

到 [上一講](/posts/ai/2026-09-30-cs234-mdp-planning) 為止，我們都假設手上有完整的模型：知道每個動作會以什麼機率轉到哪裡、拿到多少 reward。現實裡幾乎沒有這種好事。你只能讓策略實際跑起來，看它經歷了哪些狀態、拿到哪些獎勵。

第 3 講的標題直接把問題寫出來：**Policy Evaluation Without Knowing How the World Works**。今天只處理「評估」：給一個固定的策略 π，估它的價值 V^π。怎麼改進策略（control）留給下一講。投影片也先聲明，今天的資料都來自執行 π 本身（on-policy）；用別的策略收的資料來評估，之後才會談。

投影片列的對應讀物是 [Sutton & Barto 第二版](http://incompleteideas.net/book/the-book-2nd.html) 的 5.1、5.5、6.1–6.3 節，結構參考 David Silver 的第 4 講。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=jjq51TRNVvk
title: Stanford CS234 Spring 2024 Lecture 3「Policy Evaluation」
```

原始影片：[Stanford CS234 Spring 2024 Lecture 3「Policy Evaluation」](https://www.youtube.com/watch?v=jjq51TRNVvk)

課程與錄影入口：

- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

Winter 2026 官方課程頁的 Lecture Materials 只列投影片，沒有列錄影；公開 YouTube 播放清單是 Spring 2024。 查核日期：2026-10-10。

## 先回到動態規劃：它其實已經在「借」自己的估計

L3 開頭先回顧 DP 版的 policy evaluation：

V_k^π(s) = r(s, π(s)) + γ Σ_{s′} p(s′ | s, π(s)) V_{k−1}^π(s′)

投影片特別點出：這條式子用 Σ p(s′|s,π(s)) V_{k−1}^π(s′) 代替了「下一步之後所有回報的期望」。**用自己的估計去組更新目標**，這件事叫 bootstrapping。沒有模型時，Σ p(s′|…) 這一項就算不出來了。接下來的三種方法，差別就在它們怎麼處理這一項。

課前的複習題也值得一看。一題問：表格型 MDP 裡，value iteration 漸近地會不會跟 policy iteration 得到同樣價值的策略？答案是會，兩者都保證收斂到最佳。另一題問：value iteration 可不可能需要超過 |A||S| 次迭代？答案是可能。投影片的反例是單一狀態、單一動作、r = 1、γ = 0.9、V_0 = 0，V* 是 1/(1 − γ)，但第一輪之後 V_1 只有 1，要無窮多輪才逼近。

## Monte Carlo：價值就是平均回報

最直接的想法：V^π(s) 是從 s 出發的期望回報，那就讓 π 跑很多條軌跡，把從 s 開始的回報 G_t 平均起來。

投影片列出 MC 的性質（L3 p.10–11）：

- 不需要轉移與 reward 模型
- **不假設狀態是 Markov**
- 只能用在 episodic 設定：每條軌跡都要結束，才算得出完整回報

### 三種 MC

| 版本 | 做法 | 性質（L3 p.26） |
|---|---|---|
| First-visit MC | 每條軌跡裡，只拿狀態 s **第一次**出現時的回報去平均 | 無偏；由大數法則，N(s) → ∞ 時收斂到真值 |
| Every-visit MC | s 每出現一次就拿一次回報去平均 | 有偏，但 consistent，而且 MSE 往往比較好 |
| Incremental MC | V(s) ← V(s) + α(G_{i,t} − V(s)) | 性質取決於學習率 α |

Incremental 那條更新式值得記住。投影片說：接下來會看到很多演算法都是這個形狀，**一個學習率、一個目標、一次增量更新**。α 取 1/N(s) 時，它就等於 every-visit MC；α 取得比 1/N(s) 大，則會更重視新資料，投影片說這在非平穩的環境可能有幫助。

α 可以隨更新次數變動。投影片給的收斂條件是 Σ_n α_n = ∞ 且 Σ_n α_n² < ∞，滿足時 incremental MC 會收斂到真正的 V^π。

### 評估估計器的幾把尺

L3 在這裡停下來定義後面一直會用到的詞（p.23–25）：

- **Bias**：估計值的期望跟真值差多少
- **Variance**：估計值自己晃得多厲害
- **MSE** = Variance + Bias²
- **Consistency**：資料越多，估計值偏離真值超過任意 ε 的機率趨近 0

投影片留了一個問題給你想：無偏的估計器一定 consistent 嗎？另外列出的實務考量還有計算成本、記憶體，以及「統計效率」：同樣多的資料，估計準確度如何。

### MC 的限制

投影片寫得很直接（p.28）：MC 一般是**高變異**的估計器，要壓低變異需要大量資料；資料昂貴或風險高時可能不實際；而且必須等 episode 結束才能更新。

但它也有一句容易被忽略的話（p.29）：**即使知道真正的模型，有時候 MC 仍然比動態規劃好用。** MC 不假設 Markov、不需要對每個狀態做 Σ，只要能跑模擬就能估。

## TD(0)：用一步的真實 reward 加下一狀態的估計

L3 引了 Sutton & Barto 的一句話：如果要挑一個 RL 最核心、最新穎的想法，那無疑是 temporal-difference（TD）learning。

TD 的想法是把 MC 與 DP 各拿一半：

- 像 MC 一樣**取樣**：不需要模型，用實際走到的 (s, a, r, s′)
- 像 DP 一樣 **bootstrap**：不等整條軌跡，用目前的 V(s′) 代表之後的回報

更新式是：

V^π(s_t) ← V^π(s_t) + α([r_t + γV^π(s_{t+1})] − V^π(s_t))

中括號裡的 r_t + γV^π(s_{t+1}) 叫 **TD target**；它跟目前估計的差 δ_t = r_t + γV^π(s_{t+1}) − V^π(s_t) 叫 **TD error**。因為每拿到一筆 (s, a, r, s′) 就能更新，TD **不需要 episodic 設定**，無限視野的任務也能用。

### Mars rover：同一條軌跡，MC 和 TD 更新了不同的東西

L3 用上一講的 Mars rover 當例子（p.35–36）：7 個狀態，R = [1 0 0 0 0 0 10]（不管做什麼動作），π 永遠選 a1，從 s1 或 s7 做任何動作都會結束。觀察到的軌跡是：

(s3, a1, 0, s2, a1, 0, s2, a1, 0, s1, a1, 1, terminal)

- **TD(0)**，α = 1、V 初始化為 0：跑完這條軌跡，V = [1 0 0 0 0 0 0]。只有 s1 被更新成非零，因為 s3→s2、s2→s2、s2→s1 這幾步更新時，下一狀態的估計都還是 0。
- **First-visit MC**（γ = 1）：V = [1 1 1 0 0 0 0]。s1、s2、s3 都拿到了最後那個 +1。

投影片最後一頁把差別收成一句話：**TD(0) 每筆資料只用一次；MC 拿的是從 s 到 episode 結束的整段回報。** 所以 TD 要多跑幾條軌跡，獎勵的資訊才會一步一步往回傳。

### α 取 1 會怎樣

課堂小測（L3N2）問了 TD 在 α 取極端值時的行為。投影片給的正確選項是：

- α = 1 時，TD 直接把估計換成 TD target
- α = 1 時，如果策略經過的狀態有多個可能的下一狀態，V 可能**永遠震盪**
- 存在某些確定性的 MDP，α = 1 的 TD 會收斂

「α = 0 時會更重視 TD target」是錯的：α = 0 時根本不更新。

### TD 的性質

L3 的 TD 總結（p.40）：

- 有偏：一開始會被初始化影響
- 一般**變異比 MC 低**
- 學習率滿足跟 incremental MC 相同的條件時是 consistent 的
- 投影片介紹的是 TD(0)；一般來說也有介於 TD(0) 與 MC 之間的方法

後面的偏差／變異對照（p.56）把原因講清楚了：回報 G_t 是一連串隨機動作、狀態與 reward 的函數；TD target 只含**一個**隨機動作、一個 reward 與一個下一狀態。所以 G_t 無偏但變異大，TD target 有偏但變異小。投影片還預告了一個之後會很重要的差別：MC 在函數近似下仍然 consistent；TD(0) 在表格表示下會收斂到真值，**加上函數近似就不一定收斂**。這一點下一篇會碰到。

## Certainty equivalence：先估模型，再當它是真的

第三種方法其實是 model-based 的（L3 p.42–43）：每看到一筆 (s, a, r, s′)，就重算最大概似的模型

- P̂(s′ | s, a) = 從 (s, a) 轉到 s′ 的次數 / N(s, a)
- r̂(s, a) = 在 (s, a) 拿到的 reward 總和 / N(s, a)

然後把這個估出來的 MDP 丟給上一講的任何一種 DP 方法，算出 V^π。

投影片列的取捨：

| 面向 | 說明 |
|---|---|
| 資料效率 | 非常高 |
| 計算成本 | 非常高：每次更新都要更新模型並重新規劃，解析解是 O(\|S\|³)，迭代法是 O(\|S\|²\|A\|) |
| 收斂性 | 對 Markov 模型是 consistent 的 |
| 額外好處 | 容易拿來做 off-policy evaluation |

投影片附了一個選讀練習：同一條 Mars rover 軌跡，certainty equivalence 會估出什麼？解答頁（p.50–51）估出 p̂(s2|s2, a1) = p̂(s1|s2, a1) = 0.5，再用 V = (I − γP)^{−1}R 解出 s1、s2、s3 的價值。解答頁自己標了一個 typo（V(s1) 應該是 1），自學時對照要留意。

## Batch 設定：同一批資料，MC 和 TD 給出不同答案

L4 開頭把 L3 收尾（L4 p.8–13）。前面的 MC 與 TD 都是「資料用一次就丟」。如果只有固定的 K 條 episode，可以反覆從中抽一條、套用 MC 或 TD(0)，直到收斂。問題是：兩者各自收斂到什麼？

投影片用 Sutton & Barto 的 Example 6.4（**AB 例子**）：兩個狀態 A、B，γ = 1，8 條 episode：

- A, 0, B, 0（1 次）
- B, 1（6 次）
- B, 0（1 次）

V(B) 沒有爭議：8 次裡有 6 次拿到 1，MC 與 TD 都給 **0.75**。V(A) 才是重點，投影片的答案是 **V^MC(A) = 0、V^TD(A) = 0.75**。

原因（L4 p.13）：

- **Batch MC** 收斂到對「觀察到的回報」的最小 MSE 解。A 只出現過一次，那次的回報是 0，所以 V(A) = 0。
- **Batch TD(0)** 收斂到「用最大概似模型做 DP」的答案，**也就是 certainty equivalence**。資料顯示 A 一定轉到 B、而 B 值 0.75，所以 V(A) = 0.75。

哪個比較對？取決於世界是不是 Markov。L4 p.14 的比較把這件事跟效率連起來：TD(0) 每筆資料 O(1) 更新，一條長 L 的 episode 是 O(L)；MC 也是 O(L)，但要等 episode 結束。MC 可能比簡單的 TD 更省資料，但 **TD 利用了 Markov 結構**；如果環境真的是 Markov，利用它是有幫助的。certainty equivalence 同樣利用 Markov 結構。

## 三種方法放在一起

| | Monte Carlo | TD(0) | Certainty equivalence |
|---|---|---|---|
| 需要模型 | 不需要 | 不需要 | 從資料估一個 |
| 假設 Markov | 不假設 | 利用 | 利用 |
| 需要 episode 結束 | 需要 | 不需要 | 不需要 |
| Bias | first-visit 無偏 | 有偏 | — |
| Variance | 高 | 較低 | — |
| 每次更新的計算 | 低 | O(1) | 高（重新規劃） |
| Batch 下收斂到 | 對觀察回報的最小 MSE | CE 的答案 | 自己 |

L4 p.15 的總結給了一個應用情境：評估新推薦系統每個 session 的平均購買量。這就是典型的「沒有世界模型、只有策略跑出來的資料」。

## 自學怎麼做

1. 先讀 [L3 投影片](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf) p.10–43，再讀 [L4 投影片](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) p.5–15；投影片的選讀例題與解答集中在 L3 p.44–57。
2. 公開錄影是 2024 版的 [Lecture 3「Policy Evaluation」](https://www.youtube.com/watch?v=jjq51TRNVvk)，可以當聽講補充；它跟 2026 投影片的切點不一定相同。
3. 對照 [Sutton & Barto](http://incompleteideas.net/book/RLbook2018.pdf) 5.1、5.5、6.1–6.3；AB 例子在 Example 6.4。
4. 動手：用 Python 把 Mars rover 那條軌跡分別跑一次 first-visit MC、every-visit MC 與 α = 1 的 TD(0)，確認你算出的向量跟投影片一致。再把 AB 例子的 8 條 episode 丟進 batch MC 與 batch TD，看它們分別收斂到 0 與 0.75。

今晚可以做的一件事：只做 AB 例子。先不看答案，用紙筆寫出你覺得 V(A) 應該是多少、為什麼，再對照兩種演算法的答案，想一想你的直覺比較接近哪一種假設。

## 延伸閱讀

- 同樣主題在 CS221 的講法（TD、Q-learning 的入門版）：[CS221 第 8 講：強化學習與 Q-learning](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning)
- 深度 RL 視角下的策略評估與 value-based 方法：[Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表：Week 2 的「Policy Evaluation」與「Q-learning and function approximation」
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — L3、L4 的 pre／post 投影片連結
- [CS234 Lecture 3 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf) — MC、TD(0)、certainty equivalence、bias／variance、Mars rover 例子
- [CS234 Lecture 4 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) — p.5–15：batch MC／TD、AB 例子、效率比較
- [Sutton & Barto, Reinforcement Learning: An Introduction（第二版）](http://incompleteideas.net/book/the-book-2nd.html) — 官網列的輔助讀物；5.1、5.5、6.1–6.3 與 Example 6.4
- [Stanford CS234 Spring 2024 Lecture 3「Policy Evaluation」](https://www.youtube.com/watch?v=jjq51TRNVvk) — 公開錄影（2024 版）
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — 全部 16 支公開錄影
