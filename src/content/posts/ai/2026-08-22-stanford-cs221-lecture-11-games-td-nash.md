---
title: "CS221 Lecture 11：Games II：TD learning、同時賽局與 Nash 均衡"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 12
tldr: "第 11 講先用 temporal-difference updates 從遊戲經驗學 value，再從 sequential play 轉向 simultaneous games，以 mixed strategies、minimax guarantee 與 Nash equilibrium 描述穩定策略。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 11：官方 agenda、核心推導、實作連接與材料缺口。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-11-games-td-nash-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 11**，2025-10-27 由 Percy Liang 主講。課程版本與作業以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準，本講主要材料是 [td_learning and simultaneous_games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=td_learning)。下面只沿著兩份 source 的教學順序整理，不把其他講次或常識硬塞進來。

> 材料缺口：官方講義與影片公開；Canvas 課堂互動、作業解答與隱藏測資不公開。因此本文不替這些部分補上不存在的數據或結論。

## 這一講的路線

source 的 `main()` 先回顧上次的 two-player zero-sum games，接著把問題轉成：「能不能讓機器自己學會 evaluation function？」答案先由 TD learning 給出，再把學到的 value 放回遊戲策略。最後，課程從 turn-based games 走到 simultaneous games，並從 zero-sum 走到 non-zero-sum。

## 先回顧：minimax 與 evaluation function

在 turn-based two-player zero-sum game 裡，可以用 minimax 看 game tree：輪到 agent 時最大化，輪到 opponent 時最小化。source 也點到 expectimax 與 expectiminimax，表示如果樹中有機率節點，對應的聚合方式會不同。

樹太大時有兩種方向。alpha-beta pruning 是精確地加速 minimax；evaluation function 則是近似地估計目前局面。這裡的 evaluation function 仍是人工設計的 heuristic。於是講次提出問題：既然 evaluation function 決定搜尋看起來有多好，能不能從對局經驗把它學出來？

## TD learning 為什麼出現

先分清楚兩個量。對 policy `π` 而言，

`V_π(s)` 是從 state `s` 開始、之後遵循 `π` 時的 expected utility；`Q_π(s, a)` 則是先在 `s` 做 action `a`，再遵循 `π` 的 expected utility。

source 先用 SARSA 對照 TD learning。SARSA 是 on-policy：它估計目前 policy 的 `Q_π(s, a)`，而且用 bootstrapping，把「立即 reward 加上估計的未來 reward」當成 target。走 flaky tram 的片段就是這個介面：在 state 1 走 `walk` 得到 `-1` 到 state 2；在 state 2 再走 `walk` 得到 `-1` 到 state 3；在 state 3 搭 `tram` 得到 `-2` 並結束於 state 6。

SARSA 的 `Q` 直接告訴我們每個 action 多好，因此可以做 policy improvement：

`π_new(s) = argmax_a Q_π(s, a)`。

如果知道的是 `V_π(s)`，而不是每個 action 的 `Q`，在一般 MDP 中仍可寫成：

`Q_π(s, a) = Σ_s' T(s, a, s') [R(s, a, s') + γ V_π(s')]`。

於是新的 policy 是

`π_new(s) = argmax_a Σ_s' T(s, a, s') [R(s, a, s') + γ V_π(s')]`。

這一步需要 MDP 的 transition `T` 和 reward `R`。對 source 的 deterministic game，式子簡化成 `π_new(s) = argmax_a V_π(Succ(s, a))`：比較各 action 的 successor value 即可。

那為什麼不已知 MDP 就直接做 value iteration？source 的回答是 state 數量呈指數成長，完整解 MDP 太昂貴。因此這裡使用 reinforcement learning，不是因為原始動機所說的「不知道 MDP」，而是即使規則知道，state space 仍可能太大。

## TD learning 的 recurrence 與演算法

source 把兩個方法排成很清楚的類比：`TD learning : V_π :: SARSA : Q_π`。SARSA 為每個 state-action pair 存價值；TD learning 為每個 state 存價值，因為 action 到 next state 的關係可由 MDP 取得。

假設用 function approximation 表示 value：`V_π(s) = V(s; w)`，其中 `w` 是 weights；在 deep reinforcement learning 的語境裡，source 稱這個 value function 為 value network。一次經驗是 `(s, a, r, s')`。模型對目前 state 的預測是 `V(s; w)`，bootstrapped target 是：

`target = r + γ V(s'; w)`。

平方 loss 為：

`L(w) = (V(s; w) - [r + γ V(s'; w)])²`。

接著做 gradient step：`w = w - α ∇_w L(w)`。這就是「拿一小段經驗、用下一狀態的目前估計形成 target、再讓目前預測靠近 target」的 recurrence。它不是等整局結束才把最終答案一次倒灌回所有 state。

source 的 `TDLearning` class 則把這個想法寫成表格式的 `V`。`V` 是 `defaultdict(float)`，尚未見過的 state 預設為 0。`incorporate_feedback` 先讀 `predicted = V[state]`，再算 `target = reward + discount * V[next_state]`，最後更新：

`V[state] += learning_rate * (target - predicted)`。

也就是「目前值加上 learning rate 乘以 TD error」。這個實作本身沒有把其他 action 的觀察混進來，所以 source 的摘要把它標成 on-policy，並強調它使用 bootstrapping。

## flaky tram：把 recurrence 走一遍

source 固定 random seed 為 1，建立 `FlakyTramMDP(num_locs=6, failure_prob=0.1)`，使用 `walk_tram_policy(6)` 作 exploration policy，`epsilon=0.2`、`discount=1`、`learning_rate=0.1`。這些設定是範例的設定，不應被讀成所有問題的必要選擇。

執行片段是：

1. `state=1`，選 `walk`，`reward=-1`，到 `next_state=2`，尚未結束。
2. `state=2`，選 `walk`，`reward=-1`，到 `next_state=3`，尚未結束。
3. `state=3`，選 `tram`，`reward=-2`，到 `next_state=6`，結束。

在這個 class 中，`discount=1`，所以第一次更新的 target 是 `-1 + V[2]`，第二次是 `-1 + V[3]`，第三次是 `-2 + V[6]`。因為初始表格值都是 0，第一次看到第三筆 feedback 時，state 3 的 value 會往 `-2` 移動，幅度由 `0.1` 決定；前兩個 state 的更新則依賴當下 next-state value，而不是直接知道整段路的總 reward。這正是 TD 的 bootstrapping：估計會沿著互動逐步傳回去。

`get_action` 以 `epsilon` 機率呼叫 exploration policy，否則呼叫 `pi(state)`。`pi` 對每個 action 透過 `get_action_successors` 算出：

`Q(action) = Σ successor.prob × (successor.reward + discount × V[successor.state])`。

再選最高的 action。這裡只有 `pi` 使用 MDP 知識；TD 的 value 來自經驗，但 policy improvement 仍需要知道可能的 successors、reward 與 transition probability。這個界線是 source 明確示範的假設。

## 從 MDP 到遊戲：互動中學 game value

source 接著說 TD learning 可以處理 arbitrary MDP，現在把它改放回 games。這裡有三個改動：`Succ(s, a)` 捕捉 deterministic transition；遊戲可能直到結束才有 utility；還有兩個玩家，一個是 agent，一個是 opponent。

兩方使用同一個 value function `V_π(s)`，這是 self-play 的設定。但兩方對同一數值的方向相反：agent 最大化，opponent 最小化。對 agent：

`π_agent(s) = argmax_a V_π(Succ(s, a))`。

對 opponent：

`π_opp(s) = argmin_a V_π(Succ(s, a))`。

這裡的「同一個 value」不是說兩方目標相同，而是以 agent 的 utility 尺度評估局面；opponent 會把 agent 不想要的 successor 選出來。

## Backgammon：同一套想法遇到機率

source 用 Backgammon 說明這個設定。兩方都想把棋子移出棋盤；骰子決定可以移幾格。如果棋子落在只有一顆 opponent piece 的 point，對方棋子會被送到 bar；不能落在有超過一顆 opponent pieces 的 point。

骰子使遊戲帶有 randomness，因此 rollout 的順序不是單純的 agent、opponent 交替，而是：

`π_dice → π_agent → π_dice → π_opp → π_dice → π_agent → ...`

這裡 `π_dice` 是固定的，正在學的是 `π_agent` 與 `π_opp`。為了讓 value function 可學，source 先替每個 state 定義 feature vector，再提供兩種表示：線性 value function `V(s; w) = φ(s) * w`，或 MLP value function `V(s; w) = MLP_w(φ(s))`。接下來「just apply TD learning」的意思是把前面的 `(s, a, r, s')` 更新套到這些 state representation；source 沒有在這裡再給出一套不同的 recurrence。

## 三個歷史例子：只讀 source 給的對照

source 用三例對照 TD 與 self-play：Samuel 的 checkers（1959）用 smart features、linear evaluation、intermediate rewards 與 alpha-beta；TD-Gammon（1992）self-play 一百萬次，以 dumb features、neural network 且無 intermediate rewards；AlphaGo Zero（2017）self-play 490 萬局，以 stone positions、neural network、無 intermediate rewards並結合 MCTS。重點是 features、model、reward 與 search 可有不同組合，TD learning 不等於單一模型。

## 轉向 simultaneous games

source 的下一個 agenda 是從 turn-based games 轉到 simultaneous games。例子是 rock-paper-scissors：兩個玩家同時動作，因此不能先看對手選了什麼再回應。turn-based 時可以從 game tree 算 minimax policy；simultaneous 時兩人同時走，原本的 game tree 會失效。

source 還提出一個直覺問題：如果你公開自己的 strategy，還能不能 optimal？答案要等 mixed strategies 與 minimax theorem 才完整。先從 single-move simultaneous zero-sum game 開始。

## Two-finger Morra：payoff matrix、策略與期望值

Morra 的直覺是 A 想讓自己出的手指數和 B 相同，且偏向 4。source 把它定義成只有一個 action 的 game：沒有 state，兩位玩家 A、B，各自選 action；payoff matrix 是每個 action pair `(a, b)` 的 `V(a, b)`。在 zero-sum 設定，A 的 utility 是 `V(a,b)`，B 的 utility 是 `-V(a,b)`。

source 的矩陣是：

| A \\ B | 1 | 2 |
|---|---:|---:|
| 1 | 2 | -3 |
| 2 | -3 | 4 |

pure strategy 就是單一 action，例如 always one 是 `π=[1,0]`，always two 是 `π=[0,1]`。mixed strategy 則是 actions 上的 probability distribution；uniform 是 `π=[0.5,0.5]`。

兩個 mixed strategy 的 game evaluation 是：

`V(π_A, π_B) = Σ_a Σ_b π_A(a) π_B(b) V(a,b)`。

source 實際呼叫 `evaluate_game` 計算 uniform 對 uniform、always one 對 uniform、always two 對 uniform，以及 uniform 對 always one、uniform 對 always two。這個函式就是逐一枚舉 action pair，把 `prob_a * prob_b * V[a][b]` 加總；沒有額外的狀態轉移或搜尋。

## Best response 與 minimax

A 想 maximize `V(π_A,π_B)`，B 想 minimize，而且要同時決定。source 用「交通 deadlock」比喻這個互相等待，再暫時讓一方先走，說明 pure strategies 的第二位玩家可以看到第一位的 action 後選一個不差的回應。一般來說，第二個玩家總能採用 pure strategy。

但如果 A 先用 mixed strategy `π_A=[0.5,0.5]`，B 的期望值可展開成：

`V(π_A,π_B) = π_A(1)π_B(1)V(1,1) + π_A(1)π_B(2)V(1,2) + π_A(2)π_B(1)V(2,1) + π_A(2)π_B(2)V(2,2)`。

代入 Morra 矩陣後，source 寫成：

`V(π_A,π_B) = 0.5 * π_B(1) (2 - 3) + 0.5 * π_B(2) (4 - 3)`，

也就是：

`V(π_A,π_B) = -0.5 * π_B(1) + 0.5 * π_B(2)`。

因此 B 的 optimal strategy 是 `π_B(1)=1, π_B(2)=0`。這裡的 best response 是針對已知對手 strategy 使自己目標最佳的策略；它不是「對任何對手都唯一最好」的意思。

接著 source 讓 A 使用一般的 `π_A=[p,1-p]`，再讓 B 使用一般的 `π_B=[p,1-p]`，分別展示 pure/mixed case 的 minimax value。重點不是把圖片中的每一步另造一個公式，而是：純策略會讓先後手造成劣勢；允許混合後，雙方可以把自己的動作隨機化。

von Neumann minimax theorem 說，在這類 simultaneous zero-sum game 中，允許 mixed strategies 後，兩方的最優保證一致。source 給出的 proof label 是 linear programming duality，algorithm 則是用 linear programming 計算 optimal mixed strategies。結果很反直覺：公開你的 optimal mixed strategy 不會傷害你。

對這個 two-finger Morra，source 給出的雙方 optimal mixed strategy 都是 `[7/12, 5/12]`。它也用 `evaluate_game` 計算這兩個策略互對時的 value。從 minimax principles 看，若對手改變 strategy，你只能變好；若你自己偏離 optimal strategy，只會變差。這是 zero-sum 的 guarantee，不是說每一個 action pair 都同樣好。

## non-zero-sum 與 Nash equilibrium

接著 source 放棄「A 的 utility 加 B 的 utility 等於 0」的限制，改看 utility arbitrary 的 non-zero-sum games。競爭型遊戲仍可用 minimax，搭配 linear programming 或 search；合作型遊戲若所有人的 utility 相同，可以做 pure maximization 與 search；現實則在兩者之間。

Prisoner's Dilemma 用 payoff matrix 表示 `V_p(π_A,π_B)`：當 A、B 各自採用一個 strategy 時，player `p ∈ {A,B}` 的 utility。source 把 utility 寫成「-number of years in jail」，所以坐牢年數越少，utility 越高。這裡不能直接套用 von Neumann minimax theorem，因為遊戲不是 zero-sum。

較弱但適用的概念是 Nash equilibrium：一組 strategy profile，使任何一位 player 單獨改變自己的 strategy 都無法獲得更高 utility。source 引用 Nash's existence theorem（1950）：對任意 finite-player game，只要每位玩家的 actions 是 finite，就至少存在一個 Nash equilibrium。

source 用三個 payoff 圖示例子對照：zero-sum Morra 的 Nash equilibrium（同時也是 minimax strategy）是 `[7/12,5/12]`；collaborative Morra 的 Nash equilibrium 是兩位玩家都出 1，或兩位玩家都出 2；Prisoner's Dilemma 的 Nash equilibrium 是兩位玩家都 testify。

最後要分清楚兩個結論。simultaneous zero-sum games 有 von Neumann minimax theorem，可能有多個 minimax strategies，但 game value 相同。simultaneous non-zero-sum games 有 Nash existence theorem，可能有多個 Nash equilibria，而且 game values 也可能不同。Nash equilibrium 的「穩定」不是全局 optimality；source 明確說它沒有 optimality 的概念。

## source 的邊界

本講展示 recurrence 與策略比較，不提供完整 Nash solver。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：td_learning and simultaneous_games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=td_learning)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
