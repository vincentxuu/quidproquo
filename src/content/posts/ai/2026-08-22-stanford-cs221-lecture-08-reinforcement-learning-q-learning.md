---
title: "CS221 Lecture 8：MDPs II：不知道轉移模型時如何學 Q 值"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 9
tldr: "Stanford CS221 Autumn 2025 第 8 講依官方材料拆解 MDPs II：不知道轉移模型時如何學 Q 值，並標出方法成立的假設與限制。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 8：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 8**，2025-10-15 由 Percy Liang 主講。課程版本與作業以[官方課程網站](https://stanford-cs221.github.io/autumn2025/)為準；本講的可執行主線是官方 [reinforcement_learning artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning)，程式碼可在 [CS221 Autumn 2025 lecture repository](https://github.com/stanford-cs221/autumn2025-lectures) 對照，影片入口則是 [Stanford Online 的 CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)。

> 材料缺口：本地對照的官方 artifact 覆蓋的是 MDP、tabular model-free 方法、SARSA 與 Q-learning。它沒有在這份檔案中提供 features 或 linear approximation 的實作，因此本文只標示缺口，不把其他講次的內容接進來。Canvas 課堂互動、作業解答與隱藏測資也不在公開材料裡。

## TL;DR

這一講的問題很具體：如果知道 MDP 的轉移機率與 reward，就能用 value iteration 找最佳策略；如果不知道，agent 就必須靠一次次互動取得資料。官方程式依序展示三種做法：先估計 MDP 再做 value iteration 的 model-based 方法、直接從完整 rollout 平均 Q 值的 model-free Monte Carlo，以及一邊走一邊 bootstrapping 的 SARSA 和 Q-learning。

Q-learning 的關鍵不是「不用模型所以比較神奇」，而是它把學習目標改成 state-action value 的更新。agent 收到 `(state, action, reward, next_state, is_end)`，用立即 reward 加上下一狀態的最佳估計形成 target，再把目前的 Q 值往 target 推近。行動時仍用 epsilon-greedy 探索，但更新時看的是 greedy 的下一個動作，所以它是 off-policy。

本文照 [官方 artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning) 的執行順序讀，不把最後的 Q-learning 結論提前。每個例子都用 flaky tram MDP，並且區分「這次 rollout 得到多少 utility」和「agent 內部學到什麼」。

## 1. 先複習已知的 MDP

官方程式先把上一講的 MDP 重新跑一遍。對這份材料而言，一個 MDP 至少暴露幾個介面：`start_state()` 給起始狀態，`successors(state)` 列出可用 action 以及每個 `(action, probability, reward, next_state)`，`is_end(state)` 判斷是否終止，`discount()` 給折扣因子。範例建立 `FlakyTramMDP(num_locs=10, failure_prob=0.4)`，所以這不是一條完全確定會成功的交通路線。

先不要把 policy 和 agent 混為一談。policy 是把 state 映射到 action 的函式；範例中的 `tram_if_possible_policy` 在可以搭車的位置搭 tram，否則走路。接著 `generate_rollout(mdp, policy)` 產生一段互動軌跡，`policy_evaluation` 計算這個固定 policy 的期望 utility，`value_iteration(mdp)` 則直接計算最佳 policy。這三步對應三個不同問題：照這個策略走有多好、這個策略的 value 是多少、以及如果知道模型該怎麼最佳化。

Q 值在這裡先有精確定義。`Q_π(s, a)` 是在 `s` 採取 `a`，之後依 policy `π` 行動的價值；`V_π(s)` 則是從 `s` 開始一直依 `π` 行動的價值，因此 `V_π(s)=Q_π(s,π(s))`。已知模型時，Q 值可由所有可能 next state 的機率加權：

`Q_π(s,a) = Σ_s' T(s,a,s') [R(s,a,s') + γ V_π(s')]`。

最佳版本把後續的 policy 換成最佳 policy：`V*(s)=max_a Q*(s,a)`，最佳 action 是 `π*(s)=argmax_a Q*(s,a)`。這正是 value iteration 能做的事，但前提是知道 `T` 和 `R`。講到這裡，問題才轉出來：如果不知道 MDP，怎麼取得同一個最佳 policy？

## 2. RL 的互動協定：未知的不是介面，而是環境

強化學習把「知道模型」改成「和環境互動」。這裡仍假設環境背後是 MDP，而且 observation 就是 next state。每個回合重複以下協定：agent 根據目前 state 產生 action；environment 執行 action，回傳 reward 和 next state；agent 再把這份 feedback 納入自己的內部狀態。官方圖示與流程可在 [artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning) 中直接查看。

這裡的「未知」有精確含義。MDP 裡我們可能不知道實際會出現哪一個 outcome，但已知轉移分布 `T(s,a,s')`；RL 裡連這些機率也不知道，只能從 sample 觀察。這份講義沒有把部分可觀測情況展開，只提醒真實世界可能只能看到 state 的一部分，也就是 partially observable MDP；不要把這個提醒擴寫成這一講尚未展示的演算法。

程式把 RL algorithm 定成兩個方法：`get_action(state)` 負責把 state 送成 action；`incorporate_feedback(state, action, reward, next_state, is_end)` 負責接收環境回饋。`StaticAgent` 只是把既有 policy 包起來，`get_action` 永遠呼叫同一個 policy，`incorporate_feedback` 什麼都不做。它的作用是作為基準，清楚示範 policy 與會隨資料改變的 agent 不同。

## 3. Rollout 與 evaluation：先知道一次經驗值多少

`simulate(mdp, rl, num_trials)` 展示完整的訓練與評估外框。每一個 trial 從 `mdp.start_state()` 開始；只要目前 state 不是終點，就呼叫 agent 的 `get_action`，用 `sample_transition` 按照 MDP 的 successor probability 抽出一個 `Step`，把 reward、next state 和終止標記送回 `incorporate_feedback`，然後前進到 next state。到達終點後，程式用這串 steps 建立 `Rollout`，依 discount 計算該回合 utility。

一次 rollout 是一個樣本，不是期望值本身。官方範例跑十次 trial，把各回合 utility 放進 `utilities`，最後取平均。因此 leaderboard 上的 `value` 是這組模擬的 estimated value；它不是模型中精確的 `V*`，也不是 agent 已經知道答案的證明。增加 trial 可以讓估計更穩定，但來源在這裡只展示這個平均流程，沒有提供誤差範圍或統計保證。

## 4. Model-based：先學模型，再重用 value iteration

未知 MDP 的第一個想法是估計它。官方材料把流程拆成三階段：第一階段用 exploration policy 收集 feedback，估計轉移與 reward；第二階段對估計出的 MDP 執行 value iteration；第三階段使用估計出的 exploitation policy。

flaky tram 例子裡，`walk_tram_policy` 在合法 action 中隨機選一個；當位置已不適合搭 tram 時，只能選 `walk`。這個探索策略的工作不是立刻拿到最高 utility，而是嘗試所有合法 action，讓估計模型逐漸有資料。這種探索會付出成本，所以官方明確指出 exploration phase 的 utility 可能是次佳的。

`ModelBasedValueIteration` 內部保存一個 `EstimatedMDP`。第一次回饋把第一個 state 記成 start state；每次回饋把 `(state, action, next_state)` 的 reward 記下來，並把該轉移的 count 加一；如果 next state 是終點，就放進 `end_states`。`successors` 再用某個 action 下各 next state 的 count 除以該 action 的總 count，得到觀察到的經驗機率。這是從 feedback 估計模型，而不是直接估計 Q 值。

在第一階段，agent 尚未有 exploitation policy，因此 `get_action` 使用 exploration policy。跑十次模擬後，程式比較 true MDP 和 estimated MDP 的 start state、successors 與 end state，也比較真模型的最佳 policy 和估計模型的最佳 policy。探索越充分，估計 MDP 越接近 true MDP，估計 policy 也越可能接近 true MDP 的最佳 policy；但範例也提醒兩者在有限資料下不一定完全相同。

第二階段呼叫 `run_value_iteration()`，把 value iteration 的結果存成 exploitation policy。第三階段再模擬十次，這次 agent 使用估計出的 policy。實務上不必嚴格限制成兩個階段，可以持續修正估計 MDP，讓 policy 從完全探索逐漸移向完全利用。

## 5. Model-free Monte Carlo：直接從完整 rollout 學 Q

下一個問題是：能不能不先建立 estimated MDP，直接估計 `Q*(s,a)`？官方回答是可以先從比較直接的 model-free Monte Carlo 開始。核心想法是 rollout 一個 policy，對每個 state-action 觀察之後的 utility，然後把多次觀察取平均。它繞過了「先估計 `T`，再做 value iteration」的中間模型。

範例給出的 rollout 有三個 step，reward 依序是 `-1, -2, -2`，discount 設為 `1`。從第一步開始的 utility 是 `-1 + 1×(-2) + 1²×(-2)`；第二步是 `-2 + 1×(-2)`；最後一步是 `-2 + 1×0`。因此相鄰 utility 之間有遞迴關係：前一步 utility 等於當下 reward 加上 discount 乘後一步 utility。最後一步的未來部分為零，因為 rollout 已到 terminal。

這個方法仍要回答「用哪個 policy rollout」。材料從完全隨機探索改成 epsilon-greedy：以機率 `ε` 依 exploration policy 隨機選 action；以機率 `1-ε`，從目前已估計的 Q 值選最佳 action。當某個 state 尚未嘗試 action 時，程式先走 exploration policy，避免在沒有任何 Q 統計時取平均而除以零。

`ModelFreeMonteCarlo` 用兩份統計資料維護 Q：`sum_utilities[state][action]` 累積從該 state-action 開始的 utility，`counts[state][action]` 累積看過幾次；Q 就是兩者相除。它在每一步把 feedback 先放進 current rollout，只有 `is_end` 為真時才從後往前算完整 utilities，並將每一步的數值加入對應統計，接著清空 rollout。這是 on-policy 的味道：資料來自正在使用的 epsilon-greedy policy，而 Q 估計的是那個 policy 的行為。

官方實際跑二十次 trial，將平均 rollout utility 記到 leaderboard。完整 Monte Carlo utility 要等到 rollout 結束才知道，這也把問題推向下一段：能不能在回合結束前更新？

## 6. SARSA：bootstrapping，邊走邊更新

SARSA 的答案是 bootstrapping。它不等完整 rollout，而是把立即 reward 和目前對未來的模型估計合併。材料將完整 Monte Carlo 寫成 `u = r_0 + γr_1 + γ²r_2 + ... + γ^n r_n`；SARSA 的一步 target 則是 `u = r_0 + γ Q_π(s_1,a_1)`。這裡的 `(s_1,a_1)` 是下一個 state 與下一個 action，所以名字 SARSA 正好沿著 state、action、reward、state、action 的序列讀。

對目前的 `Q(s,a)`，程式用 gradient-style 的增量更新：

`Q(s,a) ← Q(s,a) + α [target - Q(s,a)]`，其中 `target = reward + γ Q(next_state,next_action)`。

`α` 是 learning rate。它不要求一次把 Q 值改成 target，而是向 target 移動一小步。SARSA 的 `incorporate_feedback` 會呼叫 `get_action(next_state)` 取得下一 action；這一點不能換成單純的 greedy `pi`，因為 SARSA 要估計實際使用中的 epsilon-greedy policy。於是它是 on-policy：探索動作也會影響下一步的 target。

終點處沒有未來 action。來源的 tabular 實作以未出現的 terminal Q 預設為 `0`，因此 terminal transition 的 target 退化成 `reward`；寫成通用更新時，應直接表達為 `target = reward`，非終點才加上 `γQ(next_state,next_action)`。這個 terminal handling 不是可有可無的細節：若把終點後的數值錯誤地累加，完整 rollout 和 bootstrapped update 就不再對齊。

## 7. Q-learning：用 greedy target 學最佳 policy

SARSA 學的是目前 policy 的 `Q_π(s,a)`。最後一段問得更直接：如果我們真正想要的是最佳 policy 的 `Q*(s,a)`，但又不知道那個 policy，怎麼辦？Q-learning 把 SARSA 的下一 action 改成目前 Q 表中的 greedy action。它在行動時仍使用 epsilon-greedy，卻在更新時呼叫 `pi(next_state)`，而不是 `get_action(next_state)`。

因此 Q-learning 的 target 是：

`target = reward + γ max_{a'} Q(next_state,a')`，

非終點時更新：

`Q(s,a) ← Q(s,a) + α [target - Q(s,a)]`。

若 next state 是 terminal，`max` 的未來部分應為零，target 就是 reward。官方 `QLearning` 繼承 SARSA 的表格與 epsilon-greedy 行動，但覆寫 `incorporate_feedback`；原始 artifact 透過 terminal state 尚未有 Q action 時的預設零值達到同樣效果。這也是讀 executable source 時要特別留意的地方：介面傳入了 `is_end`，實作的 terminal 行為則由空 Q 表的預設值完成。

同一個三步手動例子被再次送進 Q-learning，接著用二十次 trial 評估。差別只集中在 target 的 policy：SARSA 用實際會採取的 `next_action`，Q-learning 用 greedy 的 `next_action`。這就是 off-policy 在這份程式裡的具體位置。

## 8. Q 值、表格、features 與本講的邊界

這份 artifact 裡的 Q 是 tabular Q：用巢狀 dictionary，以 `(state, action)` 當 key 存一個數字。這種表示適合 flaky tram 這種有限、可列舉的 state-action 空間，也讓 `argmax`、平均與增量更新很容易逐行觀察。model-free Monte Carlo 的統計表和 SARSA/Q-learning 的 Q 表，分別對應「用完整回報平均」與「用 target 逐步修正」兩種學習方式。

材料沒有提供 state features、feature extractor、linear Q approximation、參數向量或梯度對 feature 的更新。因此本講不能據此聲稱 Q-learning 已經處理巨大或連續 state space；`main()` 的結尾反而明說下一講才會談「如何處理 huge state spaces」。如果要問「Q 值如何用 features 表示」或「linear approximation 的更新式是什麼」，目前公開 artifact 是缺口，應回到[官方 repository](https://github.com/stanford-cs221/autumn2025-lectures)確認是否屬於別的材料，不能用其他學期或記憶補進本講。

## 9. 三種方法怎麼比較

- Model-based 先估計 `T`、`R` 與終止狀態，再重用 value iteration；代價是必須學模型。
- Monte Carlo 直接平均完整 rollout 的 utility，不建模型，但要等 episode 結束且回報可能高變異。
- SARSA 用 epsilon-greedy 實際選出的下一 action bootstrapping，target 受探索行為影響。
- Q-learning 用 greedy next action 建 target，行動仍可探索；off-policy 並不自動解決巨大 state space 或資料不足。

## 10. 收束：照執行流程記住這一講

這講先回到已知 MDP，再移除模型前提，讓 agent 只能在 action 後收到 reward 與 next state。`simulate` 定義互動協定，model-based 估計模型後重用 value iteration，Monte Carlo 等完整回報，SARSA 用實際下一 action bootstrapping，Q-learning 則用 greedy next action 建 target，從 on-policy 轉成 off-policy。

若問題改成 features、linear approximation 或巨大 state space，這份 Lecture 8 artifact 已經告訴你邊界：下一步要找另一份官方材料，而不是從本講自行推導不存在的段落。

## 參考資料

- [CS221 Autumn 2025 官方課程網站](https://stanford-cs221.github.io/autumn2025/)
- [官方 Lecture 8 artifact：reinforcement_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
