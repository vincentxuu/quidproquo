---
title: "CS234 導讀 6：DQN——deadly triad、experience replay 與 fixed Q-targets"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, deep-reinforcement-learning]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 6
tldr: "Q-learning 在表格上會收斂，接上函數近似就可能發散。CS234 把原因歸成 deadly triad：bootstrapping、function approximation、off-policy learning 三者同時出現。DQN 用兩招撐住：experience replay 打散樣本之間的相關性，fixed Q-targets 讓目標值在 C 步內不動。投影片引用的 Atari 消融表裡，Breakout 從線性模型的 3 分、沒有兩招的深度網路 3 分，到兩招都用的 317 分；只加 replay 就到 241。"
description: "Stanford CS234 Reinforcement Learning（Winter 2026）第 5 講前半導讀：從 VFA 的 TD target 回顧起，講 deadly triad 為什麼讓 Q-learning 不穩、DQN 的 experience replay 與 fixed Q-targets、完整 pseudocode、Atari 設定與消融結果，以及 A2 Q1 三道 DQN 書面題在練什麼。"
draft: false
glossary:
  - term: "deadly triad"
    aliases: ["致命三角"]
    definition: "Bootstrapping、function approximation、off-policy learning 三者同時出現時，價值學習可能震盪或不收斂。"
    context: "CS234 L5 用它解釋 Q-learning 接上函數近似後為什麼會發散；詳見 Sutton & Barto 第二版的 Baird 反例。"
    links:
      - label: "Sutton & Barto 2nd ed."
        url: "http://incompleteideas.net/book/the-book-2nd.html"
  - term: "experience replay"
    aliases: ["replay buffer", "經驗回放"]
    definition: "把過去的 (s, a, r, s') 轉移存進緩衝區，更新時從中隨機抽 minibatch，而不是只用剛發生的那一步。"
    context: "DQN 的第一招，用來打散連續樣本之間的相關性。"
  - term: "fixed Q-targets"
    aliases: ["target network", "目標網路"]
    definition: "計算 TD 目標時使用另一組權重 w⁻，每隔 C 步才把正在更新的權重 w 複製過去，讓目標值在這段期間固定。"
    context: "DQN 的第二招，對付「目標值跟著被更新的網路一起移動」的問題。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 投影片與作業；錄影是 Spring 2024 公開版。** 這是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列第 6 篇，接續[沒模型時怎麼控制：ε-greedy、GLIE、SARSA／Q-learning、函數近似](/posts/ai/2026-09-30-cs234-model-free-control-function-approx)。

用到的官方材料：[第 5 講投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf)第 5–21 頁，[A2 題目](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)第 1 題（8 分書面題），以及 [2024 公開播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)的[影片 04〈Q learning and Function Approximation〉](https://www.youtube.com/watch?v=b_wvosA70f8)。依 YouTube 章節，2024 版的 DQN 在這支的最後 20 分鐘：[58:04「Instabilities and DQN」](https://www.youtube.com/watch?v=b_wvosA70f8&t=3484s)與 1:05:39「DQN implementation」；影片 05〈Policy Search 1〉整支講策略搜尋，沒有 DQN。

存取等級是 **A3（足以自學）**：投影片與 A2 題目都公開。缺口是 2026 錄影只在 Canvas、Gradescope autograder 不公開，所以 A2 Q1 你只能自己對照講義檢查答案。

第 5 講的檔名是〈Policy Gradient I〉，但前 21 頁其實在收尾上一講的函數近似，講 DQN。本系列依主題切篇，所以這篇只講前半，後半的策略梯度留給[下一篇](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=b_wvosA70f8
title: 影片 04〈Q learning and Function Approximation〉
```

原始影片：[影片 04〈Q learning and Function Approximation〉](https://www.youtube.com/watch?v=b_wvosA70f8)

課程與錄影入口：

- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 先回到上一篇的最後一個式子

上一篇的結尾，表格裝不下了，我們用參數 $w$ 的函數 $\hat{Q}(s, a; w)$ 來近似 Q。第 5 頁把三種做法並排，差別只在「拿什麼當真正 Q 的替代目標」：

- **Monte Carlo**：用實際回報 $G_t$ 當目標。
- **SARSA**：用 $r + \gamma \hat{Q}(s', a'; w)$ 當目標，$a'$ 是實際採取的下一個動作。
- **Q-learning**：用 $r + \gamma \max_{a'} \hat{Q}(s', a'; w)$ 當目標。

更新式都長這樣：

$$\Delta w = \alpha \big(\text{target} - \hat{Q}(s, a; w)\big) \nabla_w \hat{Q}(s, a; w)$$

如果你對「對參數做梯度下降」還不熟，先讀 [CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)的[深度學習章](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-07-deep-learning)。這篇會把 $\hat{Q}$ 換成一個卷積網路，但更新式本身不變。

## 問題：表格會收斂，函數近似可能發散

第 9 頁先講結論：Q-learning 用表格表示時會收斂到最佳的 $Q^*$，但**接上函數近似就可能發散**。

第 6 頁給的解釋分兩層。Bellman operator 本身是 contraction（[order 2](/posts/ai/2026-09-30-cs234-mdp-planning) 證過），每做一次 backup，誤差都會縮小。但每次 backup 之後，我們還要把結果「擬合」回某個特徵表示，而這個擬合步驟**可能是 expansion**。一縮一放，就不保證收斂了。

投影片把會出事的組合叫做 **deadly triad**，三個元素同時出現時可能造成震盪或不收斂：

1. **Bootstrapping**：用下一個狀態的「估計值」代替真正的值。第 3 頁的小測就在確認這個定義。
2. **Function approximation**：用參數化的函數，而不是表格。
3. **Off-policy learning**：例如 Q-learning，更新用的 $\max$ 跟實際採取動作的策略不同。

第 6 頁推薦去看 Sutton & Barto 裡的 Baird 反例，那是這個現象的經典構造。

### 具體到 DQN 的兩個症狀

第 9 頁把「Q-learning 接神經網路」的麻煩收斂成兩個具體問題：

- **樣本之間有相關性**：連續的轉移來自同一條軌跡，彼此高度相關，違反 SGD 對獨立樣本的期待。
- **目標值不固定**：目標 $r + \gamma \max_{a'} \hat{Q}(s', a'; w)$ 用的也是 $w$，你一更新 $w$，目標就跟著動。

DQN 的兩招各自對應一個症狀。

## 第一招：experience replay

第 10 頁的做法：把過去的經驗存成資料集 $D$，叫做 **replay buffer**。每次更新時：

1. 從 $D$ 隨機抽一筆 $(s, a, r, s')$。
2. 算目標 $r + \gamma \max_{a'} \hat{Q}(s', a'; w)$。
3. 用 SGD 更新 $w$。

隨機抽樣打斷了時間上的相關性。第 11 頁接著指出剩下的問題：目標在這一步被當成純量，可是下一輪 $w$ 更新後，同一筆資料的目標值就變了。這就引出第二招。

## 第二招：fixed Q-targets

第 12 頁：計算目標時改用**另一組權重** $w^-$，更新的仍是 $w$。

$$y = r + \gamma \max_{a'} \hat{Q}(s', a'; w^-)$$

$w^-$ 在多次更新之間保持固定，目標就暫時不會跟著跑。第 14–15 頁的小測問：多一組權重會讓計算時間加倍，還是讓記憶體加倍？投影片的答案是**記憶體加倍**。

## 完整的 DQN pseudocode

第 13 頁的版本，逐行翻成中文：

1. 輸入 $C$、$\alpha$，$D = \{\}$，初始化 $w$，令 $w^- = w$，$t = 0$
2. 取得初始狀態 $s_0$
3. 迴圈：
   - 依目前 $\hat{Q}(s_t, a; w)$ 的 ε-greedy 策略選動作 $a_t$
   - 觀察獎勵 $r_t$ 與下一個狀態 $s_{t+1}$
   - 把 $(s_t, a_t, r_t, s_{t+1})$ 存進 $D$
   - 從 $D$ 隨機抽一個 minibatch
   - 對 minibatch 裡每筆：如果 episode 在下一步結束，$y_i = r_i$；否則 $y_i = r_i + \gamma \max_{a'} \hat{Q}(s_{i+1}, a'; w^-)$。然後對 $(y_i - \hat{Q}(s_i, a_i; w))^2$ 做一步梯度下降
   - $t = t + 1$；每 $C$ 步令 $w^- \leftarrow w$

投影片底下的註記提醒：這裡有很多超參數與設計選擇要定，包括網路架構、學習率、目標網路多久更新一次。replay buffer 通常是固定大小，所以還要決定它多大、怎麼填。

## 在 Atari 上的設定與結果

第 17 頁描述 DQN 在 Atari 的設定，出處是 [Mnih et al. 2015〈Human-level control through deep reinforcement learning〉](https://www.nature.com/articles/nature14236)：

- 從像素端到端學 $Q(s, a)$
- 輸入狀態是**最近 4 幀**的原始像素堆疊
- 輸出是 **18 個**搖桿／按鈕位置各自的 $Q(s, a)$
- 獎勵是該步的分數變化
- 用 CNN，**所有遊戲共用同一套架構與超參數**

第 18–19 頁是論文的架構圖與各遊戲結果圖，文字版投影片抽不出數字，這裡不轉述。

### 消融：哪一招比較重要

第 20 頁有一張表，比較五種設定在五款遊戲上的分數：

| 遊戲 | 線性 | 深度網路 | DQN＋fixed Q | DQN＋replay | DQN＋replay＋fixed Q |
|---|---|---|---|---|---|
| Breakout | 3 | 3 | 10 | 241 | 317 |
| Enduro | 62 | 29 | 141 | 831 | 1006 |
| River Raid | 2345 | 1453 | 2868 | 4102 | 7447 |
| Seaquest | 656 | 275 | 1003 | 823 | 2894 |
| Space Invaders | 301 | 302 | 373 | 826 | 1089 |

投影片的結論是 **replay 非常重要**。讀表時可以注意兩件事：

- 只換成深度網路、不加任何一招，分數沒有比線性模型好，有些還更差（Enduro 62 → 29、Seaquest 656 → 275）。
- 單加 fixed Q 的提升不大，單加 replay 的提升大很多，兩招一起最好。Seaquest 是例外：單加 replay（823）比單加 fixed Q（1003）還低，但兩招合用跳到 2894。

第 20 頁最後留了一個問題：除了打散相關性，replay 還做了什麼？投影片沒有直接給答案。一個可以自己想的方向是：同一筆轉移會被抽中很多次，也就是**同樣的資料被重複用來更新**。這跟[下兩篇](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement)PPO 想「在同一批資料上多走幾步」的動機是同一件事。

## 第 21 頁：model-free 單元的驗收清單

第 21 頁列出上完 model-free 幾講後應該做得到的事：

- 能實作 TD(0) 與 MC 的 on-policy 評估
- 能實作 Q-learning 與 MC control
- 能列出造成不穩定的三個因素（function approximation、bootstrapping、off-policy learning），並定性描述問題
- 知道 DQN 裡關鍵的設計（experience replay、fixed targets）

**今晚可以做的事**：拿這張清單逐條自問。第三條答不出來，就回頭讀本篇的 deadly triad 一節；前兩條答不出來，回 [order 4](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation) 與 [order 5](/posts/ai/2026-09-30-cs234-model-free-control-function-approx)。

## A2 Q1：三道 DQN 書面題在練什麼

A2 的第一題是 8 分的書面題，題目附了一份跟投影片寫法略有不同的 DQN pseudocode（以 episode 為外層迴圈、用 $\theta$ 與 $\theta^-$ 表示兩組權重、第 20 行每 $C$ 步令 $\theta^- = \theta$）。三小題是：

| 小題 | 分數 | 在問什麼 | 對應本篇 |
|---|---|---|---|
| (a) | 3 | 要改 pseudocode 的哪幾行，才能退回表格版 Q-learning？改成什麼？ | 回想表格 Q-learning 沒有 buffer、沒有目標網路、直接更新單一格 |
| (b) | 2 | 第 2 講的 Mars Rover 例子要怎麼改，才會讓表格 Q-learning 表現極差（因此需要 DQN 之類的方法）？ | 想想表格表示在什麼條件下裝不下或學不動 |
| (c) | 3 | 解釋 replay buffer 為什麼有幫助 | 本篇「第一招」與消融表 |

本系列不給解答。作業的其他三題（策略梯度實作、策略誘導的分布、倫理題）等讀完[下一篇](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)與 [order 8](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement)，在 [A2 作業篇](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo)一起看。注意 A2 的程式部分沒有 DQN：[起始碼](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip)裡的檔案是 `policy_gradient.py`、`ppo.py`、`baseline_network.py` 等，DQN 在這份作業只出現在書面題。

## 延伸閱讀

- [CS224R 導讀：Q-learning](/posts/ai/2026-09-30-cs224r-q-learning)：另一門 Stanford RL 課對 Q-learning 與 replay 的講法
- [Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)：同一段內容在 Berkeley 的版本
- [CS229 筆記第 19 章：強化學習](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning)：先修課對 MDP 與 value iteration 的整理

**系列導覽**：上一篇 [order 5：沒模型時怎麼控制](/posts/ai/2026-09-30-cs234-model-free-control-function-approx)｜下一篇 [order 7：策略梯度——REINFORCE、baseline、actor-critic](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS234: Reinforcement Learning（Winter 2026 課程首頁）](https://web.stanford.edu/class/cs234/)
- [CS234 講義頁（modules）](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 5: Policy Gradient I 投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf)
- [CS234 作業頁](https://web.stanford.edu/class/cs234/assignments.html)
- [Assignment 2 題目 PDF（Winter 2026）](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [Assignment 2 起始碼](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip)
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Lecture 4: Q learning and Function Approximation（Spring 2024，YouTube）](https://www.youtube.com/watch?v=b_wvosA70f8&t=3484s) — DQN 從 58:04 起
- [Mnih et al. 2015：Human-level control through deep reinforcement learning（Nature）](https://www.nature.com/articles/nature14236)
- [Sutton & Barto：Reinforcement Learning: An Introduction, 2nd ed.](http://incompleteideas.net/book/the-book-2nd.html)
