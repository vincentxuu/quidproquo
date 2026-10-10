---
title: "CS234 資料效率 I：multi-armed bandit、regret 與 UCB"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, exploration, multi-armed-bandit]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 13
tldr: "CS234 L9 與 L10 前半把「探索」從 ε-greedy 這種經驗法則，變成可以證明的東西。先定義 regret：跟一直選最好的手臂相比，你少拿了多少。greedy 會鎖死在次佳手臂，固定 ε 的 ε-greedy 永遠有 ε 比例在亂選，兩者的 regret 都隨時間線性成長。Lai-Robbins 下界說最好也要對數成長，而 UCB 靠「對不確定的手臂樂觀一點」做到了：Bandit Algorithms 定理 7.1 給出每隻次佳手臂只會被拉大約 16 log n / Δ² 次。"
description: "Stanford CS234（Winter 2026）L9 與 L10 前半導讀：multi-armed bandit 的設定、骨折治療玩具例子、regret 的 gap 與 count 分解、greedy 與 ε-greedy 為什麼是線性 regret、Lai-Robbins 下界、optimism in the face of uncertainty、sub-Gaussian 信賴界、UCB1，以及 L10 依 Bandit Algorithms 定理 7.1 重做的 regret 證明與 Bastani et al. 的 COVID 檢測案例。"
draft: false
glossary:
  - term: "regret"
    aliases: ["遺憾", "total regret", "累積 regret"]
    definition: "跟每一步都選期望 reward 最高的動作相比，演算法累積少拿的期望 reward。最小化總 regret 等價於最大化累積 reward，但 regret 讓不同問題之間可以用「隨時間怎麼成長」來比較演算法。"
    context: "CS234 L9 引入的評估框架，之後 L10–L12 都用它或 PAC 來比較探索演算法。"
  - term: "UCB"
    aliases: ["UCB1", "Upper Confidence Bound", "上信賴界"]
    definition: "每一步替每個動作算一個「以高機率不會低於真實期望值」的上界，然後選上界最大的動作。拉得少的動作上界寬，會被優先嘗試；拉得多之後上界收窄，就只剩真的好的動作會被選。"
    context: "CS234 L9 用 Auer、Cesa-Bianchi、Fischer（2002）的 UCB1，L10 證明它的 regret 對數成長。"
  - term: "optimism in the face of uncertainty"
    aliases: ["面對不確定時保持樂觀", "OFU"]
    definition: "在不確定時假設一個動作可能很好並去試它。如果它真的好，你拿到高 reward；如果不好，你學到東西，之後就不會再高估它。"
    context: "UCB 背後的原則，L12 會把它搬到 MDP 上（MBIE-EB）。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 的投影片；公開錄影是 [Spring 2024 版](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)，本篇對應第 11 支「Exploration 1」（依 YouTube 章節，內容是 multi-armed bandit、regret、ε-greedy 與 UCB1）。所有事實都在 2026-09-30 打開 [Lecture 9 投影片](https://web.stanford.edu/class/cs234/slides/lecture9post.pdf)（post 版，53 頁）與 [Lecture 10 投影片](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf)（post 版，41 頁，本篇用 p.1–17）核對。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：投影片與補充讀物都公開；2026 錄影只在 Canvas 給修課生。

**系列位置**：上一篇 [A3：Hopper 上的 reward engineering、RLHF、DPO 與 best arm identification](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits)｜下一篇 [資料效率 II：Thompson sampling、Bayesian bandit、Gittins](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

到這裡為止，這門課用過的探索方法只有一種：ε-greedy。它在 [order 5](/posts/ai/2026-09-30-cs234-model-free-control-function-approx) 的 GLIE 控制與 [order 6](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning) 的 DQN 裡都出現過，但從來沒有人問它「好不好」。

L9 開頭列出四種評估演算法的方式：會不會收斂、會不會收斂到最佳策略、多快到達最佳策略、過程中犯多少錯。前兩種課程已經談過，L9 開始處理後兩種。這一講的標題是「Data Efficient Reinforcement Learning」，講義頁把 L9 到 L12 歸在同一個「Data Efficient RL」單元，並列出 [Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) 第 7.1 節當補充讀物。

Brunskill 在 L9 說得很清楚，為什麼先講 bandit：它是看清這些想法最簡單的地方，而這些想法之後會延伸到 MDP。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=sqYii3nd78w
title: Stanford CS234 Spring 2024 播放清單第 11 支「Exploration 1」
```

原始影片：[Stanford CS234 Spring 2024 播放清單第 11 支「Exploration 1」](https://www.youtube.com/watch?v=sqYii3nd78w)

課程與錄影入口：

- [Spring 2024 版](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 設定：只做一個決定的 RL

multi-armed bandit 是一個 (A, R) 組合：A 是已知的 m 個動作（手臂），R^a(r) = P[r | a] 是每隻手臂未知的 reward 分布。每一步選一個動作、拿到一個 reward，目標是最大化累積 reward。

跟 MDP 比，bandit 少了狀態轉移：你的選擇不會改變下一步面對的情境。L10 開頭的小測直接寫出這個關係：k 隻手臂的 bandit，就像一個只有單一狀態、k 個動作的 MDP。

整個單元都用同一個玩具例子。L9 特別註明是編的，數字不代表真實療效：

| 治療方式 | 痊癒機率（真實值，演算法不知道） |
|---|---|
| a1 手術 | 0.95 |
| a2 buddy taping（把骨折的腳趾跟旁邊的腳趾綁在一起） | 0.90 |
| a3 什麼都不做 | 0.10 |

reward 是二元的：6 週後照 X 光，痊癒得 1，沒痊癒得 0。每隻手臂是參數未知的 Bernoulli 變數。

## greedy 為什麼會鎖死

最直覺的演算法是 greedy：用蒙地卡羅平均估每隻手臂的價值 Q̂(a)，每一步選估計值最高的。

L9 的例子示範它怎麼失敗。每隻手臂先拉一次：手術運氣不好得 0，taping 得 1，什麼都不做得 0。現在 Q̂(a2) = 1 最高，greedy 會一直選 taping。只要 taping 的平均一直高於 0，手術就再也不會被試到，而手術的估計值永遠停在 0。

投影片的結論是一句話：**greedy 可能永遠鎖定在次佳動作上。**

## regret：把「犯多少錯」變成數字

要比較演算法，L9 引入 regret。先定義幾個量：

- Q(a) = E[r | a]：動作 a 的平均 reward
- V* = max Q(a)：最好的手臂的平均 reward
- 單步 regret l_t = E[V* − Q(a_t)]，期望是對演算法的選擇取的
- 總 regret L_t = E[Σ (V* − Q(a_τ))]

最大化累積 reward 等價於最小化總 regret。再定義 N_t(a) 為動作 a 到時間 t 被選的次數，gap Δ_a = V* − Q(a)，總 regret 就能拆成：

```text
L_t = Σ_a E[N_t(a)] · Δ_a
```

這個式子是整個單元的主軸。好的演算法要讓 **gap 大的手臂被選的次數少**；困難在於 gap 是未知的。

L9 也提醒一件實務上容易忽略的事：真實情境裡你算不出 regret，因為它需要知道最好的手臂的真實期望值。所以理論工作做的是**證明一個上界**：不管在哪個 bandit 問題上，這個演算法的 regret 都不會超過多少。

## ε-greedy 也逃不掉線性 regret

回到骨折例子，套 greedy 的 regret 表：每次選 taping 付出 0.05，選什麼都不做付出 0.85。一直鎖在 taping，regret 就每步加 0.05，**跟決策次數成正比**。

ε-greedy 以 1 − ε 的機率選估計值最高的動作，以 ε 的機率隨機選。它不會鎖死，但代價是：**永遠有 ε 比例的時間在做次佳決定**。

L9 的小測把兩件事放在一起：只要存在 gap 大於 0 的手臂，ε = 0.1 的 ε-greedy 會有線性 regret，ε = 0（也就是 greedy）也會。投影片給了一個非正式定義：如果演算法有固定比例的時間在選非最佳動作，它的 regret 就是線性的。

於是有兩個極端：永遠探索是線性 regret，從不探索也是線性 regret。問題變成：**有沒有可能做到 sublinear？**

## 下界：最好能做到多好

L9 先區分兩種 regret 界：

- **problem independent**：regret 怎麼隨總步數 T 成長
- **problem dependent**：regret 寫成每隻手臂被拉的次數與它的 gap 的函數

然後給出 Lai 與 Robbins 的下界：漸近來說，任何演算法的總 regret 至少隨步數**對數成長**。

```text
lim_{t→∞} L_t ≥ log t · Σ_{a: Δ_a > 0} Δ_a / D_KL(R^a ‖ R^{a*})
```

分母的 KL 散度衡量次佳手臂的 reward 分布跟最佳手臂有多像。直覺很清楚：難的問題是那些**長得很像、平均卻不同**的手臂。

投影片對這個下界的評語是「promising」：下界本身是 sublinear，所以還有希望找到做得到的演算法。

## optimism：不確定時，往好的方向猜

L9 的答案是 optimism in the face of uncertainty：**選那些可能很好的動作**。為什麼這樣合理？投影片列出兩種結果：

- 如果那隻手臂真的平均很高，你拿到高 reward
- 如果它其實不好，拉它會（在期望上）降低它的平均估計，也降低它的不確定性，你學到了東西

兩種結果都不虧。具體做法是 Upper Confidence Bound：替每個動作估一個上界 U_t(a)，讓 Q(a) ≤ U_t(a) 以高機率成立。上界的寬度取決於 N_t(a)，每一步選上界最大的動作。

上界從哪來？L9 引用 Lattimore 與 Szepesvári《Bandit Algorithms》的 Corollary 5.5：若 X_i − μ 是獨立的 σ-sub-Gaussian 變數，樣本平均偏離 μ 超過 ε 的機率不超過 exp(−nε² / 2σ²)。反過來解，就得到：以至少 1 − δ 的機率，

```text
μ ≤ μ̂ + sqrt( 2σ² log(1/δ) / n )
```

假設 reward 是 1-sub-Gaussian（σ² = 1），就得到 UCB1 的選擇規則：

```text
a_t = argmax_a [ Q̂(a) + sqrt( 2 log(1/δ) / N_t(a) ) ]
```

UCB1 出自 Auer、Cesa-Bianchi、Fischer（2002）。它的第二項是「探索獎勵」：拉得越少，獎勵越大。

L9 用骨折例子手算：每隻手臂先各拉一次，這次手術與 taping 都得 1、什麼都不做得 0，然後從 t = 3 開始，每一步重算三個上界、選最大者。投影片最後留了一個選做題：如果改成永遠選**下界**最高的手臂（悲觀），能不能保證低 regret？可以先用兩隻手臂的情況想想看。

> 這個選做題的答案，L11 的「What You Should Understand」清單間接給了：要能舉例說明為什麼 ε-greedy、greedy 與 **pessimism** 會造成線性 regret。

## L10：重做的 UCB regret 證明

L9 投影片裡有一段課後附註：Brunskill 原本想在 L9 講一個更短的 UCB 證明，但上課時發現有錯，於是在 L10 改講修正版，照的是 Bandit Algorithms 的定理 7.1。所以這個證明要看 L10 p.10–16，不是 L9。

**定理 7.1**（L10 p.11 的版本）：在 reward 落在 [0, 1] 的 K 臂隨機 bandit 上跑 UCB，取 δ = 1/n²，則

```text
Regret_n ≤ 3 · Σ_i Δ_i + Σ_{i: Δ_i > 0} 16 log n / Δ_i
```

regret 隨 n 只有對數成長，對上了 Lai-Robbins 下界的量級。

<details>
<summary>證明骨架（L10 p.11–16）</summary>

不失一般性假設 a1 是最佳手臂。因為 Regret_n = Σ Δ_i E[N_n(a_i)]，只要界住每隻次佳手臂被拉的期望次數。

1. **定義好事件 G_i**，由兩個條件組成：（*）最佳手臂 a1 的真實值在所有時間都小於它自己的 UCB；（**）次佳手臂 a_i 被拉 u_i 次之後，它的 UCB 已經低於 a1 的真實值。u_i 是一個待定的次數。
2. **拆期望**：E[N(a_i)] = E[1(G_i) N(a_i)] + E[1(G_i^c) N(a_i)] ≤ u_i + n · P(G_i^c)。
3. **好事件下 a_i 最多被拉 u_i 次**，用反證：若超過，必有某一步 a_i 已被拉 u_i 次卻又被選中；但此時 a_i 的 UCB < Q(a1) < a1 的 UCB，應該選 a1 才對，矛盾。L10 投影片在這一步標了原稿的 typo，修正後是比較 Q(a1) 而不是 Q(a_i)。
4. **界住壞事件的機率**：條件（*）用 union bound，每個時間點的 UCB 以 1 − δ 成立，所以失敗機率 ≤ nδ；條件（**）在 u_i 夠大、使信賴寬度 ≤ cΔ_i 時，用上一講的集中不等式得到 exp(−u_i c² Δ_i² / 2)。
5. **選 u_i**：讓寬度條件成立，解出 u_i ≈ 2 log(1/δ) / ((1 − c)² Δ_i²)，代回去。
6. **收尾**：取 c = 0.5、δ = 1/n²，得到 E[N(a_i)] ≤ 3 + 16 log n / Δ_i²。乘上 Δ_i 加總，就是定理的形式。

完整細節要看 Bandit Algorithms 第 7.1 節，投影片自己也這樣建議。

</details>

L10 開頭的小測值得當成自我檢查，官方答案是五個全對：

- 最小化 regret 的演算法也在最大化 reward
- 忽略常數與 δ，UCB 選的是 Q̂(a) 加上一個 N_t(a) 的函數最大的手臂
- 把探索項換成 sqrt(log(t/δ) / N_t(a)) 的版本，UCB 仍然會學到多拉最佳手臂
- 如果探索獎勵是固定常數（例如 5），演算法對經驗 reward 是樂觀的，但仍可能有線性 regret
- k 臂 bandit 就像單一狀態、k 個動作的 MDP

第四條最值得想：樂觀本身不夠，**樂觀的幅度必須隨資料變多而收窄**。

## 真實案例：COVID 邊境檢測

L10 p.5–6 放了一個真實案例：[Bastani et al. 在 Nature 發表的 COVID-19 邊境檢測研究](https://www.nature.com/articles/s41586-021-04014-z)，問題是該挑哪些入境旅客做檢測。投影片標題寫「Nature 2001」，實際論文是 2021 年發表，應是筆誤。

投影片對這個問題的描述是一整串限定詞：**nonstationary、contextual、batched，而且有 delayed feedback 與 constraints 的 bandit**。對照本篇的乾淨設定，每一個形容詞都是一個還沒處理的難題：reward 分布會變、每個旅客有自己的特徵、決策是整批做的、檢測結果要等、檢測量有上限。

這個案例的作用是提醒你：UCB 的證明是在最簡單的設定下做的，真實部署要再往上疊很多層。下一篇的 Thompson sampling 會處理其中一個：批次與延遲回饋下，確定性的 optimism 會出問題。

## 這一篇跟作業三的關係

[作業三 Q4](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits) 的 best arm identification 用的是同一組工具：Hoeffding（sub-Gaussian 的特例）與 union bound。差別在目標：

- UCB 在乎**過程中**累積多少 regret，所以要邊探索邊利用
- Q4 只在乎**最後**選對，所以可以先把每隻手臂都拉夠次數再決定

讀完本篇，Q4 (a) 的「存在某隻手臂估計偏離」其實就是上面證明步驟 4 的 union bound；(b) 則是在問「信賴寬度要多窄，選出來的手臂才不會差超過 ε」。

## 自學怎麼做

1. **先把骨折例子的 greedy 與 ε-greedy 手算一遍。** 寫出每一步的 Q̂ 與 regret，親眼看到 regret 為什麼線性成長。
2. **寫一個 UCB1。** L11 的學習目標清單明寫「Be able to implement UCB bandit algorithm」。用三隻 Bernoulli 手臂（0.95、0.9、0.1），畫出 greedy、ε-greedy 與 UCB1 的累積 regret 曲線。
3. **把 L10 的證明骨架自己重寫一次。** 同一份清單也要求「Be able to prove why UCB bandit algorithm has sublinear regret」。卡住時對照 Bandit Algorithms 第 7.1 節。
4. **回頭做作業三 Q4。**

今晚可以做的一件事：用 30 行 Python 模擬骨折例子，跑 1,000 步，比較 ε = 0.1 的 ε-greedy 與 UCB1 的累積 regret。你會看到一條直線與一條逐漸變平的曲線，那就是「線性」與「對數」的差別。

## 延伸閱讀

- 探索在深度 RL 裡的做法與理論：[Berkeley CS285 L19–25：探索、RL 理論與開放問題](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)
- 課程定位、存取缺口與 2024 影片對照：[Stanford CS234 導讀（系列總覽）](/posts/ai/2026-09-30-cs234-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表、learning outcomes（regret 與探索的評量目標）
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — 「Data Efficient RL」單元（L9–L12）與 Bandit Algorithms 7.1 節補充讀物
- [CS234 Lecture 9 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture9post.pdf) — bandit 設定、骨折例子、regret、ε-greedy、Lai-Robbins 下界、sub-Gaussian 信賴界、UCB1、證明勘誤附註
- [CS234 Lecture 10 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) — p.1–17：小測與解答、COVID 案例、定理 7.1 的證明骨架
- [CS234 Lecture 11 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture11post.pdf) — 「What You Should Understand」學習目標清單
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — Corollary 5.5 與第 7.1 節定理 7.1
- [Bastani et al., Efficient and targeted COVID-19 border testing via reinforcement learning（Nature 2021）](https://www.nature.com/articles/s41586-021-04014-z) — L10 的真實案例
- [Stanford CS234 Spring 2024 播放清單第 11 支「Exploration 1」](https://www.youtube.com/watch?v=sqYii3nd78w) — 公開錄影（2024 版，講次與 2026 不完全對齊）
