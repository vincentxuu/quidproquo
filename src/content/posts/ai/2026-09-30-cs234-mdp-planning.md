---
title: "CS234 L2：有模型時怎麼規劃：policy evaluation、PI、VI"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, mdp, value-iteration, dynamic-programming]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 2
tldr: "CS234 Winter 2026 第二講假設世界模型已知，回答怎麼算出最好的 policy。先把 MDP 加上 policy 變回 MRP，用 Bellman backup 迭代評估 policy；再用 policy iteration 交替評估與改進，並證明每一輪都不會變差，最多 |A|^|S| 輪就停。另一條路是 value iteration：直接重複套用 Bellman 最佳化運算子，因為它在 γ < 1 時是 contraction，所以一定收斂。最後補上 finite horizon：這時最好的 policy 通常會隨剩餘步數改變。"
description: "Stanford CS234（Winter 2026）第二講導讀：依官方 lecture2post 投影片整理 MDP 定義、MDP 加 policy 等於 MRP、iterative policy evaluation、policy iteration 與單調改進證明、Q 函數、Bellman backup 運算子、value iteration 與 contraction 證明、finite horizon 下的規劃。配套影片為 Spring 2024 Lecture 2（補充），補充讀物為 Sutton & Barto 第 3 章與 4.1–4.4 節。"
draft: false
glossary:
  - term: "Bellman backup"
    aliases: ["Bellman backup operator", "Bellman 運算子"]
    definition: "把一個 value function 映射成新 value function 的運算子；最佳化版本是 BV(s) = max_a [R(s,a) + γ Σ P(s'|s,a) V(s')]，policy 版本 B^π 則把 max 換成照 π 選動作。"
    context: "CS234 L2 用它統一描述 policy evaluation、policy iteration 和 value iteration。"
  - term: "contraction operator"
    aliases: ["收縮運算子"]
    definition: "對兩個輸入套用後，彼此距離不會變大的運算子；Bellman backup 在 γ < 1 時會把無限範數距離縮成原本的 γ 倍。"
    context: "這是 value iteration 一定收斂到唯一解的原因。"
  - term: "policy iteration"
    aliases: ["PI", "策略迭代"]
    definition: "交替做兩步的規劃演算法：評估目前 policy 的 value，再對每個狀態選 Q 值最大的動作當新 policy，直到 policy 不再改變。"
    context: "CS234 L2 證明它每一輪單調改進，最多 |A|^|S| 輪結束。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-mdp-planning-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Winter 2026 的 [Lecture 2 投影片（post-class 版）](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf)。配套影片是 [Spring 2024 Lecture 2: Tabular MDP Planning（補充）](https://www.youtube.com/watch?v=gHdsUUGcBC0)，標題相同，但投影片是 2026 版。本文是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列的第 2 篇。

[上一篇](/posts/ai/2026-09-30-cs234-intro-sequential-decisions)停在 Markov reward process：知道怎麼算一個沒有動作的過程值多少。[CS234](https://web.stanford.edu/class/cs234/) 第二講加上動作，問一個更實際的問題：**已知世界怎麼運作時，怎麼算出最好的 policy？**

投影片開頭留了一個問題，當天結束前回答。問題是：能不能設計出一種演算法，保證多算一輪，policy 就只會變好或不變？所有演算法都有這個性質嗎？答案是「可以，而且不是所有演算法都有」。這篇就是在講哪個演算法有、為什麼有。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=gHdsUUGcBC0
title: Spring 2024 Lecture 2: Tabular MDP Planning（YouTube，補充）
```

原始影片：[Spring 2024 Lecture 2: Tabular MDP Planning（YouTube，補充）](https://www.youtube.com/watch?v=gHdsUUGcBC0)

課程與錄影入口：

- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

Winter 2026 官方課程頁的 Lecture Materials 只列投影片，沒有列錄影；公開 YouTube 播放清單是 Spring 2024。 查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了 Spring 2024 Lecture 2「Tabular MDP Planning」字幕（約 65K 字元）：確認影片講 Markov reward process、policy evaluation、policy iteration 與單調改進、value iteration 與 contraction、finite horizon 與 Mars rover 例子，主題與本文一致；本文逐題的小測與證明細節來自 2026 投影片，未逐項對照影片。

## 先回答暖身題：γ 大代表什麼

投影片第一個小測驗：「在 MDP 裡，折扣因子 γ 大，代表短期獎勵比長期獎勵影響大得多。」答案是**錯**。γ 大代表更重視延遲的長期獎勵；γ = 0 才只看即時獎勵。

## MDP 的正式定義

MDP 是 MRP 加上動作，寫成 tuple (S, A, P, R, γ)：

- S：有限的 Markov 狀態集合
- A：有限的動作集合
- P：每個動作各自的轉移模型，P(sₜ₊₁ = s′ | sₜ = s, aₜ = a)
- R：獎勵函數，R(s, a) = E[rₜ | sₜ = s, aₜ = a]
- γ ∈ [0, 1]：折扣因子

投影片的註腳提醒，reward 有時定義成只看狀態，有時看 (s, a, s′)；這門課大多用 (s, a)。

火星探測車的 MDP 版本有兩個**確定性**動作：a₁ 往左一格（s₁ 留在原地），a₂ 往右一格（s₇ 留在原地），各用一個 7×7 的 0/1 矩陣表示。

## MDP 加上 policy，就是 MRP

Policy 一般寫成條件分佈 π(a | s) = P(aₜ = a | sₜ = s)。把它和 MDP 合起來，就得到一個 MRP (S, R^π, P^π, γ)：

```text
R^π(s)     = Σ_a π(a|s) R(s, a)
P^π(s'|s)  = Σ_a π(a|s) P(s'|s, a)
```

這一步是整講的地基：**評估 MDP 裡某個 policy 的價值，等於評估一個 MRP**，上一篇的算法可以直接用。

## Policy evaluation：迭代的 Bellman backup

```text
初始化 V_0(s) = 0，對所有 s
for k = 1 直到收斂:
    for s in S:
        V_k^π(s) = Σ_a π(a|s) [ R(s,a) + γ Σ_{s'} p(s'|s,a) V_{k−1}^π(s') ]
```

投影片把這一行叫做「針對特定 policy 的 **Bellman backup**」。policy 是確定性的話，外面那層加總消失，變成 V_k^π(s) = R(s, π(s)) + γ Σ p(s′ | s, π(s)) V_{k−1}^π(s′)。

投影片的練習 L2E1 可以手算一次：在 s₆ 選 a₁ 時，有 0.5 機率留在 s₆、0.5 機率到 s₇；π(s) = a₁、V_k = [1, 0, 0, 0, 0, 0, 10]、γ = 0.5。那麼

```text
V_{k+1}(s6) = 0 + 0.5 × (0.5 × 10 + 0.5 × 0) = 2.5
```

s₇ 的 10 分被打了兩次折：一次是機率 0.5，一次是 γ = 0.5。

## 從評估到控制：policy 空間有多大

進入控制之前，投影片先問兩題：火星車有 7 個狀態、2 個動作，確定性 policy 有幾個？最佳 policy 唯一嗎？

- 確定性 policy 有 |A|^|S| = 2⁷ = 128 個
- 最佳 policy **不一定唯一**，可能有兩個 policy 的 value function 一樣、都是最大

MDP control 的目標是算出 π*(s) = argmax_π V^π(s)。投影片列了三個性質：最佳 value function 存在且唯一；在 infinite horizon 問題裡，最佳 policy 是**確定性**的，也是**stationary** 的（不依賴時間步）；但不一定唯一。

一個笨方法是把 |A|^|S| 個 policy 全部列舉、各自評估。Policy iteration 通常比列舉有效率得多。

## Policy iteration

```text
i = 0
隨機初始化 π_0(s)
while i == 0 或 ‖π_i − π_{i−1}‖_1 > 0:   # 有任何狀態的動作改變
    V^{π_i} ← 評估 π_i
    π_{i+1} ← policy improvement
    i = i + 1
```

Policy improvement 需要一個新定義，**state-action value**：

```text
Q^π(s, a) = R(s, a) + γ Σ_{s'} P(s'|s, a) V^π(s')
```

意思是：先做動作 a，之後照 π 走。改進步驟就是對每個狀態算出所有動作的 Q 值，選最大的：

```text
π_{i+1}(s) = argmax_a Q^{π_i}(s, a)
```

### 為什麼改進不會變差

直覺是這樣：因為 max 至少不小於原本那個動作的值，

```text
max_a Q^{π_i}(s, a) ≥ Q^{π_i}(s, π_i(s)) = V^{π_i}(s)
```

所以「這一步照 π_{i+1}，之後照 π_i」至少跟一直照 π_i 一樣好。但新 policy 是**每一步**都照 π_{i+1}，這樣還成立嗎？投影片的命題說成立：

> V^{π_{i+1}} ≥ V^{π_i}（對每個狀態逐一比較），而且只要 π_i 不是最佳，就是嚴格大於。

<details>
<summary>證明：monotonic improvement（投影片 p.26–27）</summary>

```text
V^{π_i}(s) ≤ max_a Q^{π_i}(s, a)
           = max_a [ R(s,a) + γ Σ_{s'} P(s'|s,a) V^{π_i}(s') ]
           = R(s, π_{i+1}(s)) + γ Σ_{s'} P(s'|s, π_{i+1}(s)) V^{π_i}(s')      // π_{i+1} 的定義
           ≤ R(s, π_{i+1}(s)) + γ Σ_{s'} P(s'|s, π_{i+1}(s)) max_{a'} Q^{π_i}(s', a')
           = R(s, π_{i+1}(s)) + γ Σ_{s'} P(s'|s, π_{i+1}(s))
               ( R(s', π_{i+1}(s')) + γ Σ_{s''} P(s''|s', π_{i+1}(s')) V^{π_i}(s'') )
           ⋮
           = V^{π_{i+1}}(s)
```

每一行都把「下一步的 V^{π_i}」換成不小於它的「照 π_{i+1} 走一步再接 V^{π_i}」，一路展開下去，就變成每一步都照 π_{i+1} 走的價值。

</details>

### PI 什麼時候停

投影片的第三個小測驗有兩題：

1. **policy 一旦不變，之後還會再變嗎？** 不會。若對所有 s 都有 π_{i+1}(s) = π_i(s)，那 Q^{π_{i+1}} = Q^{π_i}，下一輪的 argmax 也一樣。
2. **PI 有最大迭代次數嗎？** 有，最多 |A|^|S| 輪。因為改進是單調的，除了最佳 policy 以外，每個 policy 最多只會出現一次，而 policy 總數只有 |A|^|S| 個。

這就回答了開場的問題：policy iteration 保證「多算一輪不會變差」。

## Bellman 方程與 Bellman backup 運算子

Value iteration 之前，投影片先把 Bellman 的兩個東西分清楚。

一個 policy 的 value function 必須滿足 **Bellman 方程**：

```text
V^π(s) = R^π(s) + γ Σ_{s'} P^π(s'|s) V^π(s')
```

**Bellman backup 運算子** B 則是一個「吃一個 value function、吐出一個新 value function」的操作，能改進就改進：

```text
BV(s) = max_a [ R(s, a) + γ Σ_{s'} p(s'|s, a) V(s') ]
```

針對特定 policy 的版本 B^π 把 max 換成照 π 選：B^π V(s) = R^π(s) + γ Σ P^π(s′ | s) V(s′)。用這套語言，policy evaluation 就是找 B^π 的**不動點**：一直套 B^π，直到 V 不再變。

## Value iteration

Policy iteration 是算出一個 policy 的 infinite horizon 價值，再拿它改進 policy。Value iteration 換一個想法：**維護「還剩 k 步時，從 s 出發的最佳價值」，然後一步步把 k 拉長。**

```text
k = 1
初始化 V_0(s) = 0
重複直到收斂（例如 ‖V_{k+1} − V_k‖_∞ ≤ ε）:
    for s in S:
        V_{k+1}(s) = max_a [ R(s,a) + γ Σ_{s'} P(s'|s,a) V_k(s') ]
```

用運算子寫只有一行：V_{k+1} = B V_k。要取出 policy，就對最後的 V 做一次 argmax。

### 為什麼一定收斂：contraction

設 O 是一個運算子，|x| 是任意範數。如果 |OV − OV′| ≤ |V − V′|，O 就是 contraction operator。

投影片的結論：**只要 γ < 1，或最終以機率 1 進入終止狀態，value iteration 就會收斂。**理由是 γ < 1 時 Bellman backup 是 contraction：拿兩個不同的 value function 各套一次，它們的距離會縮小。

<details>
<summary>證明：Bellman backup 在 γ < 1 時是 contraction（投影片 p.40–41）</summary>

用無限範數 ‖V − V′‖ = max_s |V(s) − V′(s)|。

```text
‖BV_k − BV_j‖
  = ‖ max_a [R(s,a) + γ Σ P(s'|s,a) V_k(s')] − max_{a'} [R(s,a') + γ Σ P(s'|s,a') V_j(s')] ‖
  ≤ max_a ‖ R(s,a) + γ Σ P(s'|s,a) V_k(s') − R(s,a) − γ Σ P(s'|s,a) V_j(s') ‖
  = max_a ‖ γ Σ P(s'|s,a) (V_k(s') − V_j(s')) ‖
  ≤ max_a ‖ γ Σ P(s'|s,a) ‖V_k − V_j‖ ‖
  = max_a ‖ γ ‖V_k − V_j‖ Σ P(s'|s,a) ‖
  = γ ‖V_k − V_j‖
```

最後一步用到機率加總為 1。投影片特別註明：就算每個不等式都取等號，只要 γ < 1，它仍然是 contraction。

</details>

投影片接著留了三個課後練習，沒有給答案：

1. 證明在離散狀態與動作、γ < 1 時，value iteration 會收斂到**唯一**解
2. value iteration 的初始值會影響什麼嗎？
3. 每一輪從 value iteration 取出的 policy，放到真正的 infinite horizon 問題裡，價值會像 policy iteration 那樣單調改進嗎？

第三題直接對上開場那句「不是所有演算法都有這個性質」。

## Finite horizon

如果只能做 H 次決定，value iteration 的迴圈就跑 H 次，V_k 和 π_k 的意思是「還剩 k 個決定時的最佳價值與最佳 policy」。

另一種做法是**模擬**：產生大量 episode、把 return 平均起來。集中不等式可以界定平均值多快逼近期望值，而且這個方法**不需要 Markov 假設**。

投影片用火星車 MRP 示範（γ = 1/2、H = 4、從 s₄ 出發）：

| 抽到的 episode | return |
|---|---|
| s₄, s₅, s₆, s₇ | 0 + ½×0 + ¼×0 + ⅛×10 = 1.25 |
| s₄, s₄, s₅, s₄ | 0 |
| s₄, s₃, s₂, s₁ | 0 + ½×0 + ¼×0 + ⅛×1 = 0.125 |

最後一個問題：**finite horizon 下的最佳 policy 是 stationary 的嗎？** 投影片的答案是「一般來說不是」。直覺是：還剩 10 步和只剩 1 步時，值得冒的險不一樣。這跟前面 infinite horizon 的「最佳 policy 是 stationary 的」形成對比。

## VI 和 PI 的差別

| | Value iteration | Policy iteration |
|---|---|---|
| 每一輪在算什麼 | horizon = k 時的最佳價值，再把 k 加一 | 目前 policy 的 infinite horizon 價值 |
| 怎麼得到 policy | 對 V 做 argmax；horizon = k 時也能直接給出最佳 policy | 用算出的價值選出另一個更好的 policy |
| 延伸 | — | 投影片說它跟 RL 裡很熱門的 policy gradient 密切相關 |

最後這一格是伏筆：「評估目前 policy、再往更好的方向改」的結構，會在[第 7 篇的策略梯度](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)重新出現。

## 這講要會什麼

投影片的「What You Should Know」列了這些：

- 定義 MP、MRP、MDP、Bellman operator、contraction、model、Q-value、policy
- 能實作 value iteration 和 policy iteration
- 說出不同 policy evaluation 方法的優缺點
- 能證明 contraction 性質
- 知道這些方法和 Markov 假設的限制：哪些 policy evaluation 方法需要 Markov 假設？

最後一題可以用這篇回答：迭代的 Bellman backup 需要，模擬取平均不需要。

## 今晚可以做的事

[A1 的起始碼](https://web.stanford.edu/class/cs234/assignments/a1/code.zip)裡有 `vi_and_pi.py`，RiverSwim 那題要你實作 Bellman backup、policy iteration 和 value iteration。今晚先不寫程式，只用紙筆跑火星車的確定性 MDP。設定是 γ = 0.5，每個動作的 reward 都是 s₁ 為 1、s₇ 為 10、其他為 0，從 V₀ = 0 開始。跑五輪 value iteration，每輪寫下 V 和 argmax 出來的 policy。我自己算的結果是：第一輪所有動作平手；之後 s₇ 的價值往左傳、s₁ 的價值往右傳，「往右」的範圍一輪輪擴大，到第五輪只剩 s₁、s₂ 還選往左。你可以拿這個對答案。

寫完再讀 [Sutton & Barto](http://incompleteideas.net/book/RLbook2018.pdf) 4.1–4.4 節，對照書上的 policy evaluation、policy improvement、policy iteration 和 value iteration。[下一篇](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim)講 A1 在練什麼。

## 延伸閱讀

- [CS221 L7：MDPs 與 value iteration](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration)：先修課對同一組演算法的講法
- [強化學習：MDP、價值迭代與連續狀態（CS229 講義第 19 章）](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning)
- [CS224R L1：把做決策寫成 RL 問題](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)
- [Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)

**系列導覽**：上一篇 [RL 是什麼、MDP 的語言](/posts/ai/2026-09-30-cs234-intro-sequential-decisions)｜下一篇 [A1：有效視野、reward hacking、Bellman residual、RiverSwim](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。
- 2026-10-10：依字幕核對影片內容。影片主題一致，無需改動說法。

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/)
- [CS234 Lecture Materials（Winter 2026）](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 2 投影片：Making Sequences of Good Decisions Given a Model of the World（2026 post-class）](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf)
- [A1 起始碼 code.zip（2026）](https://web.stanford.edu/class/cs234/assignments/a1/code.zip)
- [Spring 2024 Lecture 2: Tabular MDP Planning（YouTube，補充）](https://www.youtube.com/watch?v=gHdsUUGcBC0)
- [Sutton & Barto, Reinforcement Learning: An Introduction（2nd ed.），第 3 章與 4.1–4.4 節](http://incompleteideas.net/book/RLbook2018.pdf)
