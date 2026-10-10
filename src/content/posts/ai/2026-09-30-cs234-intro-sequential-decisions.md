---
title: "CS234 L1：RL 是什麼、MDP 的語言"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, mdp]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 1
tldr: "CS234 Winter 2026 第一講先回答 RL 是什麼：在不確定之下，從經驗學會做好決策。它通常同時牽涉四件事：最佳化、延遲後果、探索、泛化。接著用火星探測車的七格世界，從 Markov process 一路加到 Markov reward process，定義 return、value function 和折扣因子，最後推出 MRP 的 Bellman 方程：可以直接解矩陣反轉，也可以用動態規劃迭代。加上動作之後就是 MDP，這是下一講的起點。"
description: "Stanford CS234（Winter 2026）第一講導讀：依官方 lecture1post 投影片整理 RL 的定義、四個核心挑戰、Markov 假設與狀態表示、火星探測車的 Markov process 與 Markov reward process、evaluation 與 control 的差別，以及 MRP 價值的兩種算法。配套影片為 Spring 2024 Lecture 1（補充），補充讀物為 Sutton & Barto 第 1 章。"
draft: false
glossary:
  - term: "Markov assumption"
    aliases: ["馬可夫假設", "Markov property"]
    definition: "狀態 s_t 滿足 p(s_{t+1} | s_t, a_t) = p(s_{t+1} | h_t, a_t)：給定現在，未來和過去的歷史無關。"
    context: "CS234 L1 用它把「整段歷史」壓縮成一個狀態。"
  - term: "Markov reward process"
    aliases: ["MRP"]
    definition: "Markov chain 加上 reward：狀態集合、轉移模型、獎勵函數 R(s) 和折扣因子 γ，沒有動作。"
    context: "MDP 固定一個 policy 之後就變成 MRP，所以 MRP 的算法可以直接拿來評估 policy。"
  - term: "evaluation 與 control"
    definition: "evaluation 是估計照某個 policy 行動的期望獎勵；control 是找出最好的 policy。"
    context: "CS234 L1 把這兩件事分開，整門課反覆用這個區分。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-intro-sequential-decisions-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Winter 2026 的 [Lecture 1 投影片（post-class 版）](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf)。配套影片是 [Spring 2024 Lecture 1 錄影（補充）](https://www.youtube.com/watch?v=WsvFL-LjA6U)，標題相同，但投影片是 2026 版，例子可能不同。本文是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列的第 1 篇。

[CS234](https://web.stanford.edu/class/cs234/) 第一講的議程分三段：RL 概論、課務、不確定下的序列決策。課務（評分、tutorials、late days）[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)已經整理過，這篇只講另外兩段。

一個小提醒：post-class 版 PDF 有 60 頁，頁碼卻標到「/ 70」，最後一頁是當天的總結。後面沒放上來的部分，下一講的投影片開頭會接著講。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=WsvFL-LjA6U
title: Spring 2024 Lecture 1: Introduction to Reinforcement Learning（YouTube，補充）
```

原始影片：[Spring 2024 Lecture 1: Introduction to Reinforcement Learning（YouTube，補充）](https://www.youtube.com/watch?v=WsvFL-LjA6U)

課程與錄影入口：

- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

Winter 2026 官方課程頁的 Lecture Materials 只列投影片，沒有列錄影；公開 YouTube 播放清單是 Spring 2024。 查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了 Spring 2024 Lecture 1「Introduction to Reinforcement Learning」字幕（約 72K 字元）：確認影片講 RL 的定位與應用（AlphaGo、核融合、COVID、ChatGPT、AlphaTensor）、探索與利用、AI 家教加減法的 reward 例子、Markov 假設、Mars rover 與折扣，主題與本文一致；字幕沒有 OpenAI o1（2024 影片早於 o1），本文提到 o1 的地方是依 2026 投影片，不是影片內容。

## RL 是什麼

投影片的定義只有一句：**從經驗或資料學習，在不確定之下做出好的決策。**

它接著給了兩個定位。第一，這是智慧的核心部分。第二，它的理論從 1950 年代的 Richard Bellman 開始累積，近十年才有一連串亮眼成果。投影片列的例子有 AlphaGo 系列的圍棋、核融合的電漿控制、COVID-19 邊境檢測（第 13 篇講 bandit 時會再回來）、ChatGPT，以及 OpenAI o1。

開場那頁叫「RL in 2025」，引了兩段話：DeepSeek-R1-Zero 沒有先做 SFT，只靠大規模 RL 就展現出推理能力；以及國際數學奧林匹亞主席確認 Google DeepMind 拿到 42 分中的 35 分、達到金牌水準。這門課從 1950 年代的理論講起，第一頁卻放在 2025 年，意思是這些理論到今天還在用。

## RL 通常同時牽涉四件事

投影片把 RL 的特徵拆成四個詞：

| 挑戰 | 投影片的說法 | 例子 |
|---|---|---|
| Optimization | 目標是找到最好的（或至少很好的）決策方式，要有明確的效用 | 在道路網上找兩城之間最短路線 |
| Delayed consequences | 現在的決定可能很久以後才有影響 | 存退休金；在 Montezuma's Revenge 裡找鑰匙 |
| Exploration | 透過做決定來認識世界，agent 像科學家 | 學騎腳踏車要先摔幾次 |
| Generalization | policy 是從過去經驗到動作的映射 | 為什麼不直接把 policy 寫死？ |

**延遲後果**帶來兩個問題。規劃時，要考慮一個決定的長期影響，不只看眼前好處。學習時，temporal credit assignment 很難：後來拿到高分或低分，到底是哪一步造成的？

**探索**的關鍵在於你只看得到自己選的那條路。投影片的例子是：選了 Stanford 而不是 MIT，之後的經歷就完全不同，你永遠不知道另一條路會怎樣。這跟監督式學習不同，監督式學習的每筆資料都附著正確答案。

投影片也說明 RL 特別有用的兩類問題：一是**沒有理想行為的示範**，例如目標是超越人類，或這個任務根本沒有既有資料；二是**搜尋空間巨大、結果又延遲出現**的最佳化問題，例子是 AlphaTensor。

## 一個熱身練習：AI 家教

講到序列決策之前，投影片先丟了一個題目：學生一開始既不會加法（簡單）也不會減法（難），AI 家教可以出加法題或減法題；學生答對，agent 得 +1，答錯得 -1。

題目要你寫出狀態空間、動作空間和 reward model，想想 dynamics model 代表什麼，再問：最佳化期望折扣獎勵總和的 policy 會做什麼？

投影片沒寫答案，但問題本身已經暗示了：這個 reward 會鼓勵 agent 一直出學生會答對的簡單題，這不是讓學生學最多的做法。投影片的最後一問就是「如果不是，該給什麼 reward 才能鼓勵學習？」這是 reward 設計第一次出現，[A1](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) 的 reward hacking 題會再遇到。

## 序列決策的基本迴圈

序列決策的目標是：**選擇動作，最大化未來的期望總獎勵**，其中可能要在即時獎勵和長期獎勵之間取捨。投影片舉了網路廣告、機器人卸洗碗機、血壓控制三個例子。

在離散時間下，每個時間步 t：

1. agent 採取動作 aₜ
2. 世界根據 aₜ 更新，送出觀測 oₜ 和獎勵 rₜ
3. agent 收到 oₜ 和 rₜ

到目前為止的所有東西叫**歷史** hₜ = (a₁, o₁, r₁, …, aₜ, oₜ, rₜ)。agent 根據歷史選動作。**狀態**則是「假設足以決定接下來會發生什麼」的資訊，寫成歷史的函數 sₜ = f(hₜ)。

## Markov 假設：把歷史壓成狀態

狀態 sₜ 是 Markov 的，若且唯若

```text
p(s_{t+1} | s_t, a_t) = p(s_{t+1} | h_t, a_t)
```

換句話說，給定現在，未來和過去無關。

投影片說這個假設受歡迎有兩個原因：它簡單，而且只要把一些歷史放進狀態，通常就能滿足。實務上常直接假設最近一次觀測就是足夠統計量，也就是 sₜ = oₜ。狀態怎麼表示，會同時影響計算複雜度、需要的資料量和最後的表現。

投影片接著用三個問題替序列決策過程分類：

- 狀態是 Markov 的嗎？世界是部分可觀測的嗎（POMDP）？
- dynamics 是確定的還是隨機的？
- 動作只影響即時獎勵（bandit），還是也影響下一個狀態？

第三個問題值得記住。bandit 是「動作不改變狀態」的特例，[第 13 篇](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)會專門講它。

## 火星探測車：整門課的玩具例子

這個例子會一路用到 A1 和 A2。探測車在一排七個格子 s₁…s₇ 上，動作是 TryLeft 或 TryRight。reward：s₁ 給 +1，s₇ 給 +10，其他格子給 0。

**MDP model** 是 agent 對世界的表示，分兩部分：

- **Transition／dynamics model**：預測下一個狀態，p(sₜ₊₁ = s′ | sₜ = s, aₜ = a)
- **Reward model**：預測即時獎勵，r(s, a) = E[rₜ | sₜ = s, aₜ = a]

投影片刻意寫了一句「Model may be wrong」：agent 的模型是它自己的估計，不一定等於真實世界。例子裡，agent 的 reward model 在每格都估成 0，transition model 則假設在 s₁ 按 TryRight 有 0.5 機率留在原地、0.5 機率往右一格。

**Policy** π 決定 agent 怎麼選動作，可以是確定性的 π(s) = a，也可以是隨機的 π(a | s) = Pr(aₜ = a | sₜ = s)。投影片的小測驗：七格全都選 TryRight 的 policy，是確定性還是隨機的？答案是確定性，因為每個狀態只對應一個動作。

## Evaluation 與 control

這是整門課反覆使用的區分：

- **Evaluation**：估計照某個 policy 行動的期望獎勵
- **Control**：最佳化，找出最好的 policy

投影片接著用一張「Build up in complexity」的圖說明課程的推進方式：先假設狀態和動作有限、已知 dynamics 與 reward 模型，要做的是評估一個 policy、再算出最好的 policy。這在 AI 裡叫 planning 問題。順序是 Markov process → Markov reward process → MDP → MDP 上的 evaluation 與 control。

## 第一層：Markov process

Markov process（Markov chain）是無記憶的隨機過程，只有兩個元素：有限狀態集合 S，和轉移模型 p(sₜ₊₁ = s′ | sₜ = s)。**沒有 reward，也沒有動作。**

N 個狀態時，轉移模型可以寫成 N×N 矩陣 P，第 i 列是從 sᵢ 出發到各狀態的機率。火星車的版本是：兩端的格子 0.6 留在原地、0.4 往內走；中間的格子 0.4 往左、0.2 留下、0.4 往右。

從 s₄ 出發抽幾條 episode：

```text
s4, s5, s6, s7, s7, s7, ...
s4, s4, s5, s4, s5, s6, ...
s4, s3, s2, s1, ...
```

## 第二層：Markov reward process

MRP 是 Markov chain 加上 reward：

- S：有限狀態集合
- P：轉移模型 P(sₜ₊₁ = s′ | sₜ = s)
- R：獎勵函數 R(s) = E[rₜ | sₜ = s]
- γ ∈ [0, 1]：折扣因子

仍然沒有動作。火星車 MRP 的 reward 是 s₁ 為 1、s₇ 為 10、其他為 0。

接著是三個定義：

- **Horizon H**：每個 episode 的時間步數，可以是無限
- **Return Gₜ**：從 t 到 horizon 的折扣獎勵總和，Gₜ = rₜ + γrₜ₊₁ + γ²rₜ₊₂ + … + γ^(H−1) rₜ₊H₋₁
- **State value V(s)**：從狀態 s 出發的期望 return，V(s) = E[Gₜ | sₜ = s]

為什麼要折扣？投影片給兩個理由：數學上方便（避免 return 和 value 變成無限大），而且人的行為本來就常像是帶著小於 1 的折扣。γ = 0 只在乎即時獎勵；γ = 1 表示未來的獎勵跟現在一樣重要。如果 episode 長度一定有限，可以用 γ = 1。

## MRP 價值的兩種算法

Markov 性質給了結構，MRP 的 value function 滿足：

```text
V(s) = R(s) + γ Σ_{s'∈S} P(s'|s) V(s')
        即時獎勵    未來獎勵的折扣總和
```

這就是 MRP 的 **Bellman 方程**。有限狀態時寫成矩陣形式 V = R + γPV，移項得到

```text
(I − γP) V = R    →    V = (I − γP)^(−1) R
```

**第一種算法是直接解。** 要做一次矩陣反轉，複雜度大約 O(N³)。

**第二種算法是動態規劃迭代：**

```text
初始化 V_0(s) = 0，對所有 s
for k = 1 直到收斂:
    for s in S:
        V_k(s) = R(s) + γ Σ_{s'} P(s'|s) V_{k−1}(s')
```

每次迭代的複雜度是 O(|S|²)。狀態很多時，迭代通常比直接反轉划算。下一講的 policy evaluation，就是把這個迭代套到 MDP 上。

## 加上動作就是 MDP

第一講的 PDF 停在 MRP，[第二講投影片](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf)開頭補上正式定義：MDP 是 MRP 加上動作，寫成 tuple (S, A, P, R, γ)，其中 P 和 R 都依賴動作，P(s′ | s, a)、R(s, a)。

最重要的一個觀察也在那裡：**MDP 加上一個固定的 policy π，就變回 MRP。** 所以這篇的兩種算法，可以直接拿來評估 MDP 裡的任何 policy。[下一篇](/posts/ai/2026-09-30-cs234-mdp-planning)從這裡接著講。

## 投影片最後的總結

第一講最後一頁的總結只有兩句：RL 牽涉學習、最佳化、延遲後果、泛化和探索；目標是學會在不確定之下做好決策。

注意這裡列了五項，比前面「四個挑戰」多了「學習」。前面的四項是 RL 問題的特徵，「學習」則是指 agent 不知道世界模型、要從經驗學。

## 今晚可以做的事

照 AI 家教那題的格式，拿一個你熟悉的系統（推薦系統、客服 bot、自己寫的 agent）寫四行：

```text
state：
action：
dynamics model 代表什麼：
reward：
```

寫完問自己兩件事：你的 state 滿足 Markov 假設嗎？如果照這個 reward 最佳化，agent 會不會找到一個分數很高、但不是你要的行為？

想算一次看看，就用火星車的 MRP：γ = 0.5、reward 為 [1, 0, 0, 0, 0, 0, 10]，照上面的迭代從 V₀ = 0 算兩步，看 s₆ 的值怎麼從 s₇ 傳過來。

## 延伸閱讀

- [Sutton & Barto 第 1 章](http://incompleteideas.net/book/RLbook2018.pdf)：講義頁指定給第一講的補充讀物
- [CS224R L1：把做決策寫成 RL 問題](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)：同校深度 RL 課對同一段內容的講法
- [Berkeley CS285 L1–4：模仿學習、分布偏移與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)
- [CS221 L7：MDPs 與 value iteration](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration)：先修課裡的 MDP

**系列導覽**：上一篇 [系列總覽](/posts/ai/2026-09-30-cs234-course-overview)｜下一篇 [有模型時怎麼規劃：policy evaluation、PI、VI](/posts/ai/2026-09-30-cs234-mdp-planning)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。
- 2026-10-10：依字幕核對影片內容。影片主題一致；o1 非影片內容，已在標記中說明。

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/)
- [CS234 Lecture Materials（Winter 2026）](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 1 投影片：Introduction to RL（2026 post-class）](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf)
- [Lecture 2 投影片：Making Sequences of Good Decisions Given a Model of the World（2026 post-class）](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf)
- [Spring 2024 Lecture 1: Introduction to Reinforcement Learning（YouTube，補充）](https://www.youtube.com/watch?v=WsvFL-LjA6U)
- [Sutton & Barto, Reinforcement Learning: An Introduction（2nd ed.），第 1 章](http://incompleteideas.net/book/RLbook2018.pdf)
