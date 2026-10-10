---
title: "CS234 導讀 15：資料效率 III——MDP 的 PAC、MBIE-EB、PSRL 與策略性探索"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, exploration]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 15
tldr: "前兩篇的 UCB 與 Thompson sampling 只處理單步決策。CS234 第 12 講把同一組想法搬進有狀態的 MDP：先換一把尺，用 PAC 限制「不夠好的步數」而不是總 regret；再看樂觀派的 MBIE-EB（計數＋探索獎勵）與抽樣派的 PSRL（每個 episode 抽一個 MDP 來解）。狀態多到數不完時，計數失效，就改成在 Q-learning 目標上加 bonus，這是 Montezuma's Revenge 上贏過 ε-greedy DQN 的關鍵。最後一段問：探索策略能不能用學的？答案之一是 Decision-Pretrained Transformer。"
description: "Stanford CS234 Reinforcement Learning（Winter 2026）第 12 講〈Fast RL Continued〉導讀：PAC 的定義、MBIE-EB 演算法與 simulation lemma、Bayesian model-based RL 與 PSRL、linear contextual bandit、深度 RL 的 count-based bonus 與 Montezuma's Revenge、Bootstrapped DQN，以及用 Decision-Pretrained Transformer 學探索。對照 2024 公開影片 13〈Exploration 3〉。"
draft: false
glossary:
  - term: "PAC（probably approximately correct）"
    aliases: ["PAC RL", "PAC 演算法"]
    definition: "一種評估 RL 演算法的準則：以至少 1 − δ 的機率，除了多項式個時間步之外，每一步選的動作都是 ε-optimal。多項式是對 |S|、|A|、1/(1 − γ)、1/ε、1/δ 這些問題參數而言。"
    context: "CS234 L12 用它跟 regret 對照：regret 看總損失，PAC 看「犯下不小的錯」的次數。"
  - term: "MBIE-EB"
    aliases: ["Model-Based Interval Estimation with Exploration Bonus"]
    definition: "Strehl & Littman（2008）的表格型 model-based 演算法：用計數估計轉移與獎勵，在 Bellman backup 裡加上跟 1/√n(s,a) 成比例的探索獎勵，並對得到的樂觀 Q 值貪婪行動。"
    context: "CS234 L12 的 PAC RL 範例演算法。"
  - term: "PSRL"
    aliases: ["Posterior Sampling for Reinforcement Learning", "後驗抽樣 RL"]
    definition: "Thompson sampling 在 MDP 上的版本：每個 episode 開始時，從轉移與獎勵的後驗分布抽一個 MDP，解出它的最佳策略並照著走完這個 episode，結束後用觀察到的資料更新後驗。"
    context: "Osband, Russo & Van Roy（NeurIPS 2013）；CS234 L12 的 Bayesian MDP 段落。"
    links:
      - label: "Osband et al. 2013"
        url: "https://arxiv.org/abs/1306.0940"
  - term: "simulation lemma"
    aliases: ["模擬引理"]
    definition: "界住「用有誤差的模型算出的價值」跟真實價值差多少：若獎勵誤差不超過 ε_R、轉移分布的 L1 誤差不超過 ε_T，則同一策略的價值差不超過 (ε_R + γ V_max ε_T)/(1 − γ)。"
    context: "CS234 L12 說它是 MBIE-EB 之所以是 PAC 的關鍵想法之一。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 投影片與作業；錄影是 Spring 2024 公開版。** 這是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列第 15 篇。

**系列位置**：上一篇 [資料效率 II：Bayesian bandit、Thompson sampling、Gittins、PAC](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits)｜下一篇 [規劃＋學習：MCTS、UCT、AlphaGo／AlphaZero](/posts/ai/2026-09-30-cs234-mcts-alphazero)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

用到的官方材料：[第 12 講投影片（post 版）〈Fast RL Continued〉](https://web.stanford.edu/class/cs234/slides/lecture12post.pdf)，整份 PDF 54 頁（投影片自己的頁碼標到 52，中間兩頁是 Decision-Pretrained Transformer 的補充圖）。聽講補充是 [2024 公開播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)的[影片 13〈Exploration 3〉](https://www.youtube.com/watch?v=pc7oayCSZmQ)；依字幕，這支講 MBIE-EB、PAC 分析、simulation lemma、Bayesian MDP 與 PSRL、concurrent RL 與 seed sampling。

存取等級是 **A3（足以自學）**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：投影片公開。缺口是 2026 錄影只在 Canvas；投影片在 simulation lemma 那頁引用的 Winter 2023 problem session PDF（`sessions/CS234_Win23_ProblemSession2.pdf` 與解答），2026-09-30 查核時兩個網址都是 404。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=pc7oayCSZmQ
title: Stanford CS234 Spring 2024 影片 13〈Exploration 3〉
```

原始影片：[Stanford CS234 Spring 2024 影片 13〈Exploration 3〉](https://www.youtube.com/watch?v=pc7oayCSZmQ)

課程與錄影入口：

- [2024 公開播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

Winter 2026 官方課程頁的 Lecture Materials 只列投影片，沒有列錄影；公開 YouTube 播放清單是 Spring 2024。 查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了 Spring 2024 Lecture 13「Exploration 3」字幕（約 70 分鐘）：確認影片涵蓋 optimism 與 MBIE-EB、PAC 與 simulation lemma、Bayesian MDP 與 PSRL、concurrent RL 與 seed sampling，後段有 contextual／linear bandit、Montezuma's Revenge 與 Decision-Pretrained Transformer 的簡短提及，與本文主題一致；「YouTube 章節」改為「字幕」。

## 這一講要解決什麼

[第 13 篇](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)的 UCB 與[上一篇](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits)的 Thompson sampling，都只處理 bandit：每次決策做完就結束，下一步跟這一步無關。MDP 多了一件麻煩事：你今天去哪裡，決定了明天看得到什麼資料。第 12 講的「Check Your Understanding」直接把這點當成錯誤選項：「探索在 MDP 裡不重要，因為資料分布跟你走的策略無關」，答案是 False。

投影片開頭把整個「Fast RL」單元整理成三層：

| 層次 | 內容 |
|---|---|
| Settings（問題設定） | bandit（單步決策）、MDP |
| Frameworks（評估準則） | 經驗表現、漸近收斂、regret；這一講新增 **PAC** |
| Approaches（演算法類別） | greedy、ε-greedy、optimism、Thompson sampling |

整講的主軸是：bandit 那兩派想法（樂觀、抽樣）在 MDP 裡都有對應的演算法，而且都能搭上一把新尺。

## 第一把新尺：PAC

regret 的界告訴你「總損失隨時間 T 怎麼長」。投影片點出它看不出的東西：同樣的 regret，可能來自很多次小失誤，也可能來自少數幾次大失誤。如果你在意的是「犯下不小錯誤的次數」，就要用 PAC（probably approximately correct）。

PAC 演算法的要求是：

- 每一步選的動作 $a$ 是 ε-optimal，也就是 $Q(a) \ge Q(a^*) - \epsilon$
- 這件事以至少 $1 - \delta$ 的機率成立
- 例外的時間步數最多是**多項式**個，多項式是對 $|S|$、$|A|$、$1/(1-\gamma)$、$1/\epsilon$、$1/\delta$ 而言

課堂小測有一題專門考最後一條：如果保證的是「不夠好的步數小於一個**指數**函數」，算不算 PAC？答案是不算，一定要多項式。

投影片也說明：大部分 PAC 演算法建立在 optimism 或 Thompson sampling 上；有些樂觀型 PAC 演算法的做法很簡單，就是把所有價值初始化成一個（依問題而定的）很高的值。

## 樂觀派：MBIE-EB

第一個 MDP 版本的演算法是 [Strehl & Littman（2008）](https://www.sciencedirect.com/science/article/pii/S0022000008000767)的 MBIE-EB。這篇論文就是[作業一](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) RiverSwim 環境的出處。它的結構可以拆成四步：

1. **計數**：記錄每個 $(s, a)$ 被試過幾次 $n(s,a)$，以及每個 $(s, a, s')$ 出現幾次
2. **估模型**：用平均值當獎勵估計 $\hat{R}(s,a)$，用 $n(s,a,s')/n(s,a)$ 當轉移估計 $\hat{T}(s' \mid s,a)$
3. **樂觀的 Bellman backup**：反覆計算直到收斂

$$
\tilde{Q}(s,a) = \hat{R}(s,a) + \gamma \sum_{s'} \hat{T}(s' \mid s,a) \max_{a'} \tilde{Q}(s',a') + \frac{\beta}{\sqrt{n(s,a)}}
$$

4. **行動**：對 $\tilde{Q}$ 取 argmax

幾個細節值得注意：

- 所有 $\tilde{Q}$ 初始化成 $1/(1-\gamma)$，這是獎勵在 $[0,1]$ 時價值可能的最大值，所以一開始每個動作都「看起來最好」
- 探索獎勵 $\beta/\sqrt{n(s,a)}$ 跟 UCB 的信賴區間形狀一樣：試得越少，加得越多
- $\beta = \frac{1}{1-\gamma}\sqrt{0.5 \ln(2|S||A|m/\delta)}$，裡面的 $m$ 是演算法的輸入參數
- 每一步都要重新解一次（近似的）MDP，運算成本比 Q-learning 高很多

投影片接著放上「MBIE-EB is a PAC RL Algorithm」這個結論，但沒有在課堂上推完整證明，只挑出一個關鍵工具。

### simulation lemma：模型錯一點，價值錯多少

MBIE-EB 手上的是估出來的模型，不是真的模型。要說它的決策夠好，就要先回答：模型錯一點，算出來的價值會錯多少？這就是 simulation lemma。

對一個固定策略，如果兩個模型的獎勵差最多 $\epsilon_R$（無窮範數），轉移分布差最多 $\epsilon_T$（L1 範數），那麼：

$$
\max_s |V_1^\pi(s) - V_2^\pi(s)| \le \frac{\epsilon_R + \gamma V_{\max} \epsilon_T}{1 - \gamma}
$$

<details>
<summary>證明的骨架（投影片第 16 頁）</summary>

令 $\Delta = \max_s |V_1^\pi(s) - V_2^\pi(s)|$。展開 $|Q_1^\pi(s,a) - Q_2^\pi(s,a)|$：

- 獎勵差貢獻最多 $\epsilon_R$
- 轉移那一項加一項減一項，拆成 $\sum_{s'} T_1(s' \mid s,a)(V_1^\pi(s') - V_2^\pi(s'))$ 與 $\sum_{s'} (T_1 - T_2)(s' \mid s,a) V_2^\pi(s')$
- 前者最多 $\gamma\Delta$，後者最多 $\gamma V_{\max} \epsilon_T$

所以 $\Delta \le \epsilon_R + \gamma\Delta + \gamma V_{\max}\epsilon_T$，移項得 $(1-\gamma)\Delta \le \epsilon_R + \gamma V_{\max}\epsilon_T$。

這跟[作業一 Q3](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) 的套路一樣：插入零項、三角不等式、把同一個量移到左邊。

</details>

這個界把「估模型」跟「做決策」接了起來：只要每個常去的 $(s,a)$ 都被試過夠多次，模型誤差就小，價值誤差就小，選出來的動作就接近最佳。

## 抽樣派：Bayesian model-based RL 與 PSRL

投影片先複習 Bernoulli bandit：Beta 分布是 Bernoulli 的共軛先驗，觀察到 $r \in \{0,1\}$ 之後，後驗從 $\text{Beta}(\alpha, \beta)$ 變成 $\text{Beta}(r + \alpha, 1 - r + \beta)$。Thompson sampling 就是每一輪從後驗抽參數、對抽到的參數貪婪。

搬到 MDP，要維持的後驗變成「整個 MDP」：轉移 $P$ 與獎勵 $R$ 的聯合後驗 $p[P, R \mid h_t]$。Thompson sampling for MDPs 的流程是：

1. 用 Bayes 法則更新 $p[P, R \mid h_t]$
2. 從後驗抽一個 MDP
3. 用你喜歡的規劃演算法（例如[第 2 篇](/posts/ai/2026-09-30-cs234-mdp-planning)的 value iteration）解出它的 $Q^*$
4. 在真實狀態上選 $\arg\max_a Q^*(s_t, a)$

[PSRL（Osband, Russo & Van Roy, NeurIPS 2013）](https://arxiv.org/abs/1306.0940)把抽樣的頻率定在 episode：每個 episode 開頭，對每個 $(s,a)$ 抽一個轉移模型與獎勵模型，解出這個 MDP 的 $Q^*_M$，接下來 $H$ 步都照它走，走完再更新後驗。

課堂小測對 PSRL 問了三件事，答案剛好點出它的性格：

| 敘述 | 答案 | 原因 |
|---|---|---|
| 只抽獎勵，轉移用經驗平均，效果一樣 | False | 轉移的不確定性也要進入抽樣，不然就少了一半的探索 |
| 每次後驗更新都可以重新規劃 | 投影片的演算法是這樣 | 但也可以設計其他版本 |
| 每步的運算成本跟 Q-learning 一樣 | False | 每次都要解一個抽出來的 MDP |

投影片也提到 Dimakopoulou & Van Roy（ICML 2018）的 seed sampling 與 concurrent PSRL，但只給了作者、會議與一支示範影片，沒有展開。論文本身（[Coordinated Exploration in Concurrent Reinforcement Learning](https://arxiv.org/abs/1802.01282)）處理的是多個代理人在同一個環境裡同時學習時，怎麼協調彼此的探索。

## 狀態數不完時：泛化加探索

MBIE-EB 與 PSRL 都是表格型演算法。投影片直說：把泛化與策略性探索結合起來仍是活躍的研究領域，但大部分方法的根基還是這兩個原則：樂觀與 Thompson sampling。

### 先看 bandit：linear contextual bandit

contextual bandit 多了一個 context（狀態）$s$，獎勵分布變成 $R_{a,s}(r) = P[r \mid a, s]$。狀態或動作很多時，常見做法是用線性模型：

$$
r = \theta^\top \phi(s, a) + \varepsilon, \quad \varepsilon \sim \mathcal{N}(0, \sigma^2)
$$

另一種寫法是 disjoint linear model：每個 arm 有自己的參數 $\theta_a$，$r(s,a) = \theta_a^\top \phi(s) + \varepsilon$。投影片留了一個問題：共用 $\theta$ 的寫法能不能表示 disjoint 的版本？（提示：看 $\phi(s,a)$ 怎麼設計。）

以前我們用 Hoeffding 不等式替一個純量獎勵畫信賴區間；現在要改成替向量 $\theta$ 畫不確定性集合。投影片說這可以用計算上可行的方式做到，並指向 [Li et al. 的新聞推薦論文（WWW 2010）](https://arxiv.org/abs/1003.0146)與 [Lattimore & Szepesvári《Bandit Algorithms》](https://tor-lattimore.com/downloads/book/book.pdf)第 19 章。投影片放了書中圖 19.1，說明當 arm 數 $k$ 變多時，能泛化的 contextual 方法 regret 長得比較慢。

### 再看 MDP：把計數換成 bonus

MBIE-EB 的 bonus 靠計數 $n(s,a)$。狀態空間連續或極大時，幾乎每個狀態只會遇到一次，計數就沒用了。

投影片的改法是回到[第 5 篇](/posts/ai/2026-09-30-cs234-model-free-control-function-approx)的 Q-learning with function approximation，直接在 TD 目標上加一項：

$$
\Delta w = \alpha \left( r(s) + r_{\text{bonus}}(s,a) + \gamma \max_{a'} \hat{Q}(s', a'; w) - \hat{Q}(s,a;w) \right) \nabla_w \hat{Q}(s,a;w)
$$

$r_{\text{bonus}}$ 要反映「從 $(s,a)$ 出發，未來獎勵還有多不確定」。投影片列出幾種估計拜訪次數或拜訪密度的深度 RL 做法：Bellemare et al.（NIPS 2016）、Ostrovski et al.（ICML 2017）、Tang et al.（NIPS 2017）。有一個實作陷阱值得記住：bonus 是在拜訪當下算的，放進 replay buffer 之後可能過期。

成果展示是 Montezuma's Revenge。投影片引用 [Bellemare et al.〈Unifying Count-Based Exploration and Intrinsic Motivation〉](https://arxiv.org/abs/1606.01868)的圖，結論只有一句：比標準的 ε-greedy DQN 好非常多。

### 抽樣派的大規模版本

Bayesian 的角度也啟發了幾種做法，投影片依序列出：

| 方法 | 做法 | 投影片的評語 |
|---|---|---|
| Mandel, Liu, Brunskill, Popović（IJCAI 2016） | 對表示法與參數一起做 Thompson sampling | — |
| [Bootstrapped DQN（Osband et al., NIPS 2016）](https://arxiv.org/abs/1602.04621) | 用 bootstrap 樣本訓練 C 個 DQN；行動時選 C 個代理人中 Q 值最高的動作 | 有些效能提升，但不如 reward bonus |
| [Bayesian DQN（Azizzadenesheli & Anandkumar, 2017）](https://arxiv.org/abs/1802.04412) | 深度網路的最後一層改成 Bayesian linear regression，對後驗樂觀 | 很簡單，實驗上比「最後一層只做線性回歸」或 Bootstrapped DQN 好很多，某些情況仍不如 reward bonus |

這裡的難點投影片也講白了：model-free 版本想要從「可能的 $Q^*$ 的後驗」抽樣，這件事並不簡單。

## 探索本身能不能用學的

最後一段換一個角度：我們真正想要的，常常是能跨很多任務學習的代理人。那能不能讓代理人**學會怎麼探索**？投影片舉兩個例子：DREAM（Liu et al.），以及 Brunskill 參與的 [Decision-Pretrained Transformer（Lee, Xie et al., NeurIPS 2023）](https://arxiv.org/abs/2306.14892)。

DPT 那兩頁的核心只有一句：訓練模型去預測最佳動作 $a^*$，行為上會模仿 Thompson sampling，但能捕捉豐富得多的先驗；圖的標題是它能學到並利用（事先不知道的）任務結構，大幅加快探索。這跟上一篇的 Thompson sampling 接得很緊：TS 的先驗是你手寫的 Beta 分布，DPT 的「先驗」是從一大堆任務的預訓練資料裡學出來的。

## 理論現況

投影片最後兩頁是給想深入的人的地圖：

- **表格型 MDP**：regret 與 PAC 都已經有主導項緊的 minimax 結果，例如 Azar, Osband & Munos（ICML 2017，regret）與 Dann, Li, Wei & Brunskill（ICML 2019，PAC）；也有 instance-dependent 的界，例如 Zanette & Brunskill（ICML 2019）、Simchowitz & Jamieson（NeurIPS 2019）
- **函數近似**：仍是活躍領域，投影片舉 Jin, Yang, Wang & Jordan（COLT 2020）的線性函數近似；另一條線是量化「什麼讓一個問題變難」，例如 eluder dimension（Russo & Van Roy）與 Bellman rank（Jiang et al.）

## 這一單元你應該會什麼

投影片的「Summary: What You Are Expected to Know」是整個 Fast RL 單元（第 13–15 篇）的驗收清單：

1. 說明探索與利用的張力，以及它為什麼不會出現在監督式或非監督式學習裡
2. 定義並比較不同的「好表現」準則：經驗、收斂、漸近、regret、PAC
3. 把課堂上詳細講過的演算法對應到它們滿足的準則
4. 理解 UCB 的證明骨架
5. 做預設專題的人：能為 linear contextual bandit 實作 UCB 與 TS

第 5 點提到的預設專題，2026-09-30 查核時專題頁上沒有公開的細節，所以校外讀者可以把它當成一個自訂練習。

## 自學怎麼做

1. 先把第 13、14 篇的 UCB 與 TS 各用一句話講清楚，再讀這一講。這一講的每個演算法都是其中之一的 MDP 版本。
2. 把 MBIE-EB 的四步跟 UCB 對照著寫在同一張紙上：計數對計數、信賴區間對 $\beta/\sqrt{n}$、「對上界貪婪」對「對 $\tilde{Q}$ 貪婪」。
3. 把 simulation lemma 的證明自己推一次，它比作業一 Q3 短，但套路相同。
4. 最後讀「泛化加探索」那段時，每個方法都問一句：它是樂觀派還是抽樣派？

今晚可以做的一件事：拿作業一的 `riverswim.py`，在 value iteration 外面包一層計數，把 $\beta/\sqrt{n(s,a)}$ 加進 backup，跑一次看看代理人是不是比 ε-greedy 更早游到最上游。這就是一個最小的 MBIE-EB。

## 延伸閱讀

- 另一門深度 RL 課怎麼講探索與 RL 理論：[Berkeley CS285 L19–25：探索、RL 理論、多任務學習與開放問題](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)
- 「學會探索」在 meta-RL 脈絡下的完整講法：[CS224R L13：Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。
- 2026-10-10：依字幕核對影片內容。影片主題一致；「YouTube 章節」改為「字幕」。

## 參考資料

- [CS234 第 12 講投影片（Winter 2026，post 版）〈Fast RL Continued〉](https://web.stanford.edu/class/cs234/slides/lecture12post.pdf) — 本文所有演算法、小測答案與文獻清單的來源
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — Data Efficient RL 單元（L9–L12）與附加閱讀 Bandit Algorithms §7.1
- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表：Week 7–8 是 Exploration
- [CS234 專題頁](https://web.stanford.edu/class/cs234/project.html) — 專題規格
- [Stanford CS234 Spring 2024 影片 13〈Exploration 3〉](https://www.youtube.com/watch?v=pc7oayCSZmQ) — 公開錄影，字幕涵蓋 MBIE-EB、PSRL
- [Strehl & Littman, An analysis of model-based Interval Estimation for Markov Decision Processes (JCSS 2008)](https://www.sciencedirect.com/science/article/pii/S0022000008000767) — MBIE-EB
- [Osband, Russo & Van Roy, (More) Efficient Reinforcement Learning via Posterior Sampling (NeurIPS 2013)](https://arxiv.org/abs/1306.0940) — PSRL
- [Li et al., A Contextual-Bandit Approach to Personalized News Article Recommendation (WWW 2010)](https://arxiv.org/abs/1003.0146) — linear contextual bandit
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — 第 19 章 linear bandit
- [Bellemare et al., Unifying Count-Based Exploration and Intrinsic Motivation (NIPS 2016)](https://arxiv.org/abs/1606.01868) — Montezuma's Revenge 的 count-based bonus
- [Dimakopoulou & Van Roy, Coordinated Exploration in Concurrent Reinforcement Learning (ICML 2018)](https://arxiv.org/abs/1802.01282) — seed sampling
- [Osband et al., Deep Exploration via Bootstrapped DQN (NIPS 2016)](https://arxiv.org/abs/1602.04621)
- [Azizzadenesheli & Anandkumar, Efficient Exploration through Bayesian Deep Q-Networks](https://arxiv.org/abs/1802.04412)
- [Lee, Xie et al., Supervised Pretraining Can Learn In-Context Reinforcement Learning (NeurIPS 2023)](https://arxiv.org/abs/2306.14892) — Decision-Pretrained Transformer
