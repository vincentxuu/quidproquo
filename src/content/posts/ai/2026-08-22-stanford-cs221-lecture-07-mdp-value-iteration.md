---
title: "CS221 Lecture 7：MDPs I：把隨機性放進狀態轉移"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 8
tldr: "Stanford CS221 Autumn 2025 第 7 講依官方材料拆解 MDPs I：把隨機性放進狀態轉移，並標出方法成立的假設與限制。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 7：官方 agenda、核心推導、實作連接與材料缺口。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 7**，2025-10-13 由 Percy Liang 主講。課程版本、作業與講次脈絡以[官方課程網站](https://stanford-cs221.github.io/autumn2025/)為準；本文逐段對照可執行的[官方 `mdp` 講義 artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=mdp)，並把程式中的資料結構與更新順序翻成可讀的推導。課程錄影可由 [Stanford Online 官方 CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN) 交叉觀看，講義原始碼則在[官方 lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)。

> 材料缺口：官方講義與影片公開；本篇指定的本地 `mdp.py` 沒有提供完整課堂口述、Canvas 互動、作業解答或隱藏測資。因此下文只把原始碼直接示範或能由公式推出的內容寫成主張；沒有把其他學期、影片未見的細節或直覺補成 CS221 本講的結論。

## 1. 從 search 開始：為什麼需要 MDP

`main()` 先回顧上週的 search。`TravelSearchProblem(num_locs=10)` 有 `start_state()`、`successors(state)` 與 `is_end(state)`：一個 successor 會把 action、cost 和 next state 放在一起。對 search 而言，從 state 執行一個 action 會 deterministic 地抵達一個新 state，所以解可以描述成從起點到終點的一串 actions；路徑成本再用來比較解的好壞。

這個模型對「走路、騎車或開車，但交通與停車時間會變」的雜貨店問題不夠：agent 不能先知道隨機結果，卻必須在結果後依新 state 繼續決策。官方 artifact 以此引出關鍵差異：MDP generalize search，action result 變成 next-state distribution。

因此本講的問題不是「哪一條路最短」，而是「每個可能遇到的 state 該做什麼，以及整體期望表現如何？」action sequence 沒有說明 tram 失敗或骰子結果不同時該如何繼續。

## 2. MDP 的語言：state、action、successor、probability、reward

原始碼先說明名稱：Markov 指給定目前 state 後 past 與 future 被視為獨立；decision 指 agent 採取 action；process 指事情逐步發生。這也提醒建模者：state 必須保留未來決策所需資訊，否則 state-based recurrence 不再描述同一個過程。

介面很小，但每一項都必要：

- `start_state()` 給出 rollout 與 state traversal 的起點。
- `successors(state)` 回傳可能結果的 `Step` 清單。
- `is_end(state)` 判定是否停止，不再展開後續 action。
- `discount()` 提供 γ，決定未來 reward 在 utility 與 recurrence 中的權重。

`Step` 的 `action` 是所選動作，`prob` 是結果機率，`reward` 是 transition 回饋，`state` 是結果 state。`Actions(s)` 是可用 actions，`R(s,a,s')` 是 reward，`T(s,a,s')` 是 probability；固定 `(s,a)` 時，所有 `T` 必須加總為 1。

### Flaky tram：相同 action，兩個可能結果

第一個例子是 flaky tram。地點編號為 1 到 n；從 i 走到 i+1 固定花 1 分鐘；坐 tram 想從 i 到 2i，固定付出 2 分鐘，但 tram 以機率 p 故障。目標是從 1 到 n，期望花費時間最少。程式把「時間成本」寫成負 reward：walk 的 reward 是 -1，tram 的 reward 是 -2。這讓後面的 max-reward 公式仍然適用：較少的負時間代表較大的 value。

`FlakyTramMDP(num_locs=10, failure_prob=0.4)` 的 start state 是 1。若 `state + 1 <= num_locs`，walk 只有一個 successor：probability 1、reward -1、state + 1。若 `2 * state <= num_locs`，tram 有兩筆、但 action 名稱相同的 successor：成功以 `1 - failure_prob` 到 `2 * state`，故障以 `failure_prob` 留在原 state；兩者 reward 都是 -2。這裡「同一個 action 對應多筆 successor」正是 distribution 的具體形狀，不是兩個可供 policy 分別選的 action。

若 tram 不能推進到 n，程式以 probability 1、reward -100、terminal `num_locs` 編碼 invalid action。這是範例選擇，不是通則；`is_end` 只把 n 視為結束，所以故障留在原 state 時會再決策。

### Dice game：終止與循環可以並存

第二個例子是骰子遊戲，每回合選 `quit` 或 `stay`。quit 以 probability 1 得到 10，直接到 `end`。stay 先得到 4，再擲六面骰：結果為 1 或 2 時到 `end`，其餘四面繼續留在 `in`。因此程式把 stay 寫成兩筆 successor：probability `1/3`、reward 4、state `end`，以及 probability `2/3`、reward 4、state `in`。這示範了 action 可能直接結束，也可能回到同一個 state 形成循環。

Search 與 MDP 共用 start、end、successors 的外觀；表面差異是 costs 對 rewards，深層差異是單一 next state 對 next-state distribution。`get_action_successors` 將 `Step` 按 action 分組，讓 Q-value 對同一 action 的所有結果做機率加權。

## 3. Policy、rollout、utility 與 discount

在 deterministic search 裡，solution 可以是一串 actions；MDP 不能沿用這種格式。policy 是函式 `π(s) -> a`，對每一個 state 告訴 agent 當下該做什麼。程式中的 `always_walk_policy`、`always_quit_policy`、`always_stay_policy` 是簡單 policy；`tram_if_possible_policy` 則先看 `state * 2 <= mdp.num_locs`，可以坐 tram 就坐，否則 walk。這個 policy 需要 MDP 的大小資訊，因為 policy 必須避免選出這個範例不允許的 tram 狀態。

`generate_rollout(mdp, policy)` 的順序值得逐行看：先從 `start_state()` 開始，只要 `is_end(state)` 為 false，就呼叫 policy 選 action；再從 `mdp.successors(state)` 篩出相同 action 的 successor，取出 probabilities，以 `np.random.choice` 按分布抽一筆；把該 `Step` 加進 steps，最後把 state 更新成 step.state。也就是 policy 負責「選 action」，MDP 的 transition distribution 負責「決定結果」。同一 policy 因而可能產生不同 rollout；tram 的故障與骰子的結果會在這一層出現。

一個 rollout 的 utility 是 discounted reward sum。`compute_utility` 對第 i 筆 step 使用 `reward_i * discount ** i`，所以

\[
U = R_0 + \gamma R_1 + \gamma^2 R_2 + \cdots .
\]

`γ` 在 0 到 1 之間。γ=1 時不折扣，未來和現在同樣重要；γ=0 時只看第一個 reward；γ=0.5 時下一步權重是現在的一半，後續再按冪次衰減。程式中的 `FlakyTramMDP.discount()` 與 `DiceGameMDP.discount()` 都回傳 1，所以這兩個例子目前使用未折扣 utility；`compute_utility` 另外用 0、0.5 展示同一組 rollout 在不同 γ 下會得到不同數值。

discount 同時定義遠期 reward 的重要性，也影響反覆 backup 的收斂行為；改 γ 就是改變 policy 評估與最佳化的目標。γ=1 的循環 MDP 是否有限或終止，要看具體 transition；原始碼沒有聲稱所有循環都會收斂。

## 4. 從模擬估計 policy value

固定 policy π 後，從 state s 開始遵循它所得到的 expected utility，記作 `V_π(s)`。最直接的估計方法是反覆 rollout，再把 utilities 平均。`monte_carlo_policy_evaluation` 正是這件事：產生指定數量的 rollout，取每個 rollout 的 utility，最後用 `np.mean` 回傳 average。always-walk 在 tram 範例中是 deterministic，因此原始碼只需要一個 rollout；tram policy 與 dice stay 會重複 20 次，因為它們含有 stochastic outcome。

這個 value 是估計值：有限樣本平均可能偏離真正期望，增加次數也只是逼近；下一步才問能否用 recurrence 避免抽樣。

## 5. Q-value：把一次 action 寫成可計算的期望

原始碼的下一個問題是：能否比很多 rollout 更有效率地計算 `V_π(s)`？答案是重用 dynamic programming 的 recurrence。先定義 `Q(s, a, V)`：在 state s 選 action a，對 action 的每個 successor 計算即時 reward 加上折扣後的 successor value，再按 successor probability 加權求和。

若 action a 的 successor 是 `Step` 集合，程式 `compute_q_value` 對每筆 step 做：

\[
u(s,a,s') = R(s,a,s') + \gamma V(s'),
\]

再計算

\[
Q(s,a,V) = \sum_{s'} T(s,a,s')\bigl(R(s,a,s') + \gamma V(s')\bigr).
\]

在 flaky tram 的 warm-up 中，先用 `get_initial_values` 建立一組「只走到 termination」的 values：terminal state 是 0，其餘 state 是 -100。然後挑 state 9，取得 policy 在該狀態會選的 action、該 action 的 successors，將 successor values 帶進 `compute_q_value`。這一步不是完整 policy evaluation，只是在示範一個 state、一次 action backup 如何運作。

接下來擴展到所有 states，並用新 values 取代舊 values 重複。這叫 bootstrapping：0、1、2 steps 的值分別反映 termination、跟 policy 一步或兩步後 termination，逐步把更遠結果傳回目前 state；每輪使用上一輪 values。

## 6. Convergence、policy evaluation 與 Bellman equation

迭代演算法需要一個停止條件。原始碼用 `compute_distance` 計算兩組 state values 的最大絕對差：

\[
d(V,V') = \max_s |V(s)-V'(s)|.
\]

`policy_evaluation` 每輪對 terminal state 寫 0；其他 state 只看 `π(s)` 的 successors 並呼叫 `compute_q_value`。distance 小於 `tolerance`（預設 `1e-5`）就停止，否則更新 values，最多 `max_iters`（預設 100）輪。distance plot 可觀察變化下降，但不是正確性證明。

對固定 policy，這個更新可寫成 Bellman expectation equation：

\[
V_\pi(s) = \sum_{s'} T(s,\pi(s),s')
\left(R(s,\pi(s),s') + \gamma V_\pi(s')\right).
\]

terminal state 的 value 在程式中被明確設為 0，所以它不再呼叫 policy 或 successors。`get_states` 從 start state 遞迴走過每個 successor，收集可達 states；這讓 iterative algorithm 有一個有限的 state dictionary 可以更新。這也暴露實作限制：若 successor graph 無限、不可枚舉、或從 state 的 successors 會不停產生新 state，這份 `get_states`/dictionary 設計不能直接套用。

本地程式用 tolerance 或 max iterations 近似 recurrence；數學收斂需條件。常見條件是有限 state/action、bounded rewards、`0 <= γ < 1`，此時 Bellman backup 有標準收斂路徑。γ=1 或可能永不終止的循環不能只靠 distance 變小宣稱保證，必須檢查 termination、reward、transition。tram 與 dice 的 γ 都是 1，本文只報告其流程。

## 7. Value iteration：把 policy action 換成最佳 action

policy evaluation 的輸入含有一個已經指定的 policy；value iteration 想直接得到 optimal policy 的 value。原始碼先指出兩者很像：前者計算一個固定 `f(x)`，後者在每個 state 比較 action 後取最佳者。Bellman、dynamic programming 的歷史在 artifact 中連到 [Bellman 1957 的 dynamic programming 論文](https://gwern.net/doc/statistics/decision/1957-bellman-dynamicprogramming.pdf)；本文只沿用原始碼呈現的 recurrence。

optimal value 的更新是 Bellman optimality equation：

\[
V^*(s) = \max_a \sum_{s'} T(s,a,s')
\left(R(s,a,s') + \gamma V^*(s')\right)
= \max_a Q(s,a,V^*).
\]

與 policy evaluation 的關鍵差異只有一個但影響整個解：policy evaluation 固定用 `a = π(s)`；value iteration 對 state 的每個 action 都呼叫 `compute_q_value`，再取最大 Q-value。`value_iteration_for_state` 收集 actions 與 q_values，使用 `np.max` 取得 value，使用 `np.argmax` 取對應 action。這個 action 就是目前 values 下的 greedy choice。

`value_iteration` 以相同初值建立 `pi`；每輪對 terminal 寫 0，其他 state 呼叫 `value_iteration_for_state` 同時更新 value 與 action，再依 distance 停止或進入下一輪。結果包含 values、每 state 的 pi 與每輪 distance；最佳 action 在 backup 時記錄。

「optimal」是指在這個已知 MDP、rewards、discount、terminal 定義與停止設定下，選使 Bellman backup 最大的 action。負時間成本下取 max 等價於偏好較短期望時間；換 reward、未知參數、有限 horizon 或需估計 transition，問題契約就會改變。

## 8. 例子如何串起完整流程

在 flaky tram，state 9 的 walk reward 是 -1；因 `2 * 9 > 10`，tram 被編碼成 -100 的 invalid action。較早 state 的 tram Q-value 同時計入成功到 `2 * state` 與故障留在原地，policy 因而受 failure probability 影響。

在 dice game，quit 得到 10 後 terminal；stay 得到 4，再以 `1/3` 結束、`2/3` 留在 `in`。Monte Carlo 可先估計兩種 policy，policy evaluation 固定其中一個 action，value iteration 比較兩個 Q-value。stay 回到同一 state，說明 MDP graph 不一定是 acyclic path。

## 9. 複雜度與實作邊界

每輪 value iteration 會枚舉所有可達 state、action 與 successor；若平均分別有 `A` 個 actions、`B` 個 outcomes，`K` 輪約為 `O(K|S|AB)`，不含建立 state graph 與繪圖。

memory 方面，`values`、`new_values`、`pi` 與 visited set 都隨可達 states 增長；大 state space 會讓完整 table 與全量 backup 成為瓶頸。這份程式沒有 function approximation、sampling-based planning、state abstraction 或 model estimation。

`is_end` 為 true 時 value 直接是 0；退出獎勵應編碼在進入 terminal 的 transition。invalid action 的 -100 同樣是模型設計，不是演算法自動知道的規則。

`max_iters=100` 與 `tolerance=1e-5` 不等於精確解出 `V*`；碰到 cap 只是近似 table。distance 變小仍需檢查初始化、reward scale 與循環；γ=1 時要確認終止與 reward 有界。

## 10. 讀完這一講應帶走的模型

不要只背「取最大」，要檢查新問題的契約：state 是否保留 Markov 所需資訊、actions 是否完整、probability 是否加總為 1、reward 是負成本還是效用、哪些 state terminal、γ 是否符合遠期偏好，以及可達 states 是否有限可枚舉。任一項不清楚，輸出就未必回答原問題。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：mdp](https://stanford-cs221.github.io/autumn2025-lectures/?trace=mdp)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
