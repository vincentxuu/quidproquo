---
title: "CS221 Lecture 10：Games I：從 expectimax 到 minimax"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 11
tldr: "第 10 講把單一 agent 搜尋擴成 adversarial game tree：expectimax 對 chance 求期望、minimax 對對手取最差結果，alpha-beta 則在不改答案下剪掉無關分支。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 10：官方 agenda、核心推導、實作連接與材料缺口。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-10-games-minimax-alpha-beta-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 10**，2025-10-22 由 Percy Liang 主講。課程版本與作業以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準，本講主要材料是 [games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=games)。以下不把賽局搜尋寫成一串脫離程式的名詞，而是沿著 `.work/stanford-cs221-notes/source/games.py` 裡 `main()` 的執行順序，從一個可執行的賽局介面一路走到精確剪枝與近似評估。

> 材料缺口：官方講義與影片公開；Canvas 課堂互動、作業解答與隱藏測資不公開。

## 這一講先把 MDP 的問題改寫成 games

前一週的起點是 MDP 與 reinforcement learning：agent 想最大化 utility，而環境是隨機且已知的。本講把情境換成 games：agent 仍想最大化 utility，但對手的策略未知。這個改動改變了遞迴在每個節點要做的事：面對隨機環境取期望，面對對手則要說明其策略假設。

`games.py` 先限定範圍：這裡討論兩人、零和賽局。兩位玩家是 `agent` 與 `opp`；零和表示對 agent 的 utility 與對 opponent 的 utility 互為相反數。因此後文的數值都站在 agent 的角度：正數對 agent 有利，負數對 agent 不利。這不是所有賽局的完整模型，但它讓 max 與 min 的關係可以被精確寫出來。

## 一個 game 到底要提供什麼

程式把賽局抽象成 `Game` 類別，沒有把棋盤、數字或規則硬編進搜尋器。搜尋器只要求五個定義：

- `start_state()`：賽局從哪個 state 開始。
- `successors(state)`：在目前 state 中，每個 action 會導向哪個 successor state；回傳的是 action 到 state 的 mapping。
- `player(state)`：目前輪到哪個玩家走。
- `is_end(state)`：目前 state 是否已經結束。
- `utility(state)`：在結束 state 上，agent 得到多少 utility。

最後一點有一個重要前提：這個版本的 reward 是稀疏的，utility 全部放在 end state。非終局節點不直接給分，搜尋必須沿 successor 往下走，直到能呼叫 `utility`。`utility` 不應被拿來評估尚未結束的 state；`HalvingGame` 甚至用 `assert state.n == 0` 明確守住這個條件。

### `Game1`：先看一棵小樹

`Game1.start_state()` 回傳字串 `"root"`。root 有三個動作：`A`、`B`、`C`，分別前往同名的中間 state。到了 `A`、`B`、`C`，輪到 opponent，且每個節點都有動作 `1`、`2`：

```text
root (agent)
├─ A (opp) ─ 1 → A1: -50, 2 → A2: 50
├─ B (opp) ─ 1 → B1:   1, 2 → B2:  3
└─ C (opp) ─ 1 → C1:  -5, 2 → C2: 15
```

從 root 讀取 `is_end` 會得到 false，讀取 `player` 會得到 `agent`，讀取 `successors` 則得到三個 action。把 state 改成 `"A"` 後，`is_end` 仍是 false，`player` 變成 `opp`，successors 只含 `1` 和 `2`。再把 state 改成 `"A1"`，它是 end state，這時才呼叫 `utility`，得到 `-50`。這幾個操作正好說明搜尋器不需要知道 A 是什麼意思；它只需遵守介面。

程式接著用 `HalvingGame(n=11)` 展示另一種 state。`HalvingState` 是不可變資料類別，含有整數 `n` 與目前玩家。起點是 `(11, agent)`；每一步有 `decrement` 與 `half` 兩個 action，分別把數字減一或整除二，並把回合交給另一位玩家。`n == 0` 就結束；如果抵達零時 `state.player == "agent"`，utility 是 `+1`，否則是 `-1`。這裡的 `player` 是 state 的一部分，而不是從搜尋深度猜出來，因為不同賽局的回合規則可能不同。

政策也被明確分成兩種。deterministic policy 把 state 映射成唯一 action，寫作 `π_p(s)`；stochastic policy 則給出每個 action 的機率，寫作 `π_p(a | s)`。本檔案的一般介面採 stochastic policy：政策函式回傳 action 到 probability 的字典，之後由 `sample_dict` 抽樣。

## 先不找最佳策略：simulation 與 game evaluation

有了 game 與每個玩家的 policy，第一個問題不是「agent 應該怎麼走」，而是「固定這些政策時，這場賽局的價值是多少」。`simulate(game, policies)` 從 `start_state()` 開始，只要 `is_end(state)` 為 false，就依序做四件事：用 `player(state)` 找出輪到誰、呼叫該玩家的 policy、用 `sample_dict` 按機率抽 action，再從 `successors(state)[action]` 前進。每一步的 action 與新 state 被包成 `Step`，整段軌跡最後和終局 utility 一起包成 `Rollout`。

`game_evaluation()` 給 `Game1` 一個具體設定：agent 的 `always_choose_a_policy` 永遠回傳 `{"A": 1}`；opponent 的 `random_policy` 回傳 `{"1": 0.5, "2": 0.5}`。因此 agent 必定先到 A，接著 opponent 一半機率到 A1，得到 -50；一半機率到 A2，得到 50。單次 `simulate` 會受抽樣影響。程式固定 random seed 1 示範一次，再重複 20 次把 utilities 放進陣列，用 `np.mean` 取得 Monte Carlo 平均；這仍只是估計。

如果政策和 successor 都能被完整列舉，便可用 `V_eval(game, policies, state)` 直接計算期望值。遞迴的 base case 是：若 `is_end(state)`，回傳 `utility(state)`。否則先找 `player`，取得該玩家的 policy，遍歷 policy 回傳的每個 `(action, prob)`，找到 successor，並把 `prob * V_eval(next_state)` 加到 `value`。因此它在每個非終局節點做的是加權平均：

```text
V_eval(s) = Σ_a π_player(a | s) V_eval(successor(s, a))
```

在上面的 A 節點，若 opponent 真的以 0.5、0.5 行動，root 的固定政策價值就是 `0.5 × (-50) + 0.5 × 50 = 0`。這個 recurrence 和 MDP 的 policy evaluation 類似：政策已知，計算它帶來的 expected utility。差別只在賽局有多位玩家輪流提供政策。完全展開所有 successor 可能需要指數時間，所以「可以精確算」不等於「搜尋便宜」。

## Expectimax：對手政策固定，agent 選最好動作

下一步是保留 opponent 的固定政策，但不再固定 agent 的政策。`V_exptmax(game, opp_policy, state)` 的 base case 仍是 end state 的 utility。若 `player(state) == "agent"`，它列出所有 successor，遞迴計算每個 successor 的 value，取最大值；agent 節點是 max 節點。若 `player(state) == "opp"`，它依 `opp_policy(state)` 給出的機率，對各 successor value 做加權總和；opponent 節點不是 min，而是 expectation 節點。

`Game1` 中若 opponent 仍是 1、2 各半，agent 會比較三條 root 分支：

- A 的期望值是 `(−50 + 50) / 2 = 0`。
- B 的期望值是 `(1 + 3) / 2 = 2`。
- C 的期望值是 `(−5 + 15) / 2 = 5`。

所以程式的結論是 optimal action 選 C，value 是 5。這個「最佳」只對指定的 `random_policy` 成立；如果 opponent 的分布改變，三個期望值也可能改變。`expectimax` 對應的是在已知 opponent policy 下尋找最佳 agent policy：agent 節點取 max，對手節點取期望。

## Minimax：把未知對手視為最佳回應

但 `games.py` 很快指出 expectimax 的問題：games 的重點正是 opponent policy 未知。若沒有可靠的固定分布，不能假裝對手一定像 random policy。Minimax 的選擇是採取最壞情況假設：opponent 會使用對 agent 最不利、也就是把 agent utility 壓到最低的策略。

`V_minmax(game, state)` 同樣先在 end state 回傳 `utility(state)`。非終局時，它對每一個 successor 遞迴，建立 `values[action] = value`。若目前 `player` 是 agent，就用 `max(values.items(), key=...)` 選 value 最大的 action；若是 opponent，就用 `min(...)` 選 value 最小的 action。函式同時回傳 `(value, action)`，所以每個 state 都能保存 minimax value 與最佳動作。對 opponent 而言，這個 action 不是 agent 要執行的動作，而是最壞回應。

在 `Game1`，三個中間節點的 minimax value 是：A 取 `min(-50, 50) = -50`，B 取 `min(1, 3) = 1`，C 取 `min(-5, 15) = -5`。root 是 agent 節點，所以取 `max(-50, 1, -5) = 1`，選 B。這和 expectimax 的 C 不同，原因是 opponent 模型不同：expectimax 認為 opponent 會隨機選 1 或 2；minimax 認為 opponent 會挑較小的結果。

Halving game 讓這個政策可以被真的拿去 play。對 `n=11` 的每個 agent state，`minimax_policy` 呼叫 `V_minmax`，回傳 `{action: 1.0}`，永遠執行該 state 的 minimax action。為了比較，opponent 使用 `{"decrement": 0.5, "half": 0.5}` 的 random policy；程式固定 seed 1 先跑一次，再跑 10 次並計算平均 utility，材料用「minimax policy crushes the random policy」描述結果。這個實驗對手雖然是 random，minimax policy 的定義仍是針對任意 opponent 的 worst-case 保證。

程式也列出 `n=1` 到 `n=11`、agent 先手 state 的 minimax 結果。value 為 1，表示不論 opponent 做什麼，agent 都保證贏；value 為 -1，表示只要 opponent 最佳應對，opponent 就能保證贏。雙方都依最佳策略行動叫 perfect play；若已知初始位置在 perfect play 下的結果，這個 game 就是 solved。原始材料列出的分類是：tic-tac-toe、nim、connect four strongly solved；checkers、Othello 從初始位置 weakly solved；chess、Go 仍 unsolved，即使電腦已達到超人類水準。這些例子在檔案中是用來說明「已知的完美 play 結果」與「實力很強」不是同一件事。

## Face-off：最佳一定要問「相對於誰」

不同 recurrence 產生的 policy 都會把對手假設編進結果。`V_minmax` 產生 agent 的 `π_max` 與 opponent 的 `π_min`；`V_exptmax` 在 opponent policy `π_7` 下產生 agent 的 `π_exptmax(7)`。把 agent policy 與 opponent policy 寫成 `V(π_agent, π_opp)`，就是「這兩個政策真的互相比賽時」的 game value。

`face_off()` 的三個關係是這一講最值得保留的防呆器。第一，`π_max` 對 `π_min` 是最佳的 agent policy：

```text
V(π_exptmax(7), π_min) ≤ V(π_max, π_min)
```

第二，`π_min` 對 `π_max` 是最佳的 opponent policy：

```text
V(π_max, π_min) ≤ V(π_max, π_7)
```

第三，若 agent 知道 opponent 會採用 `π_7`，`π_exptmax(7)` 對 `π_7` 至少不差於 minimax policy：

```text
V(π_max, π_7) ≤ V(π_exptmax(7), π_7)
```

所以知道對手時可能做得比 minimax 好；不知道時，minimax 提供的是對任意未知 opponent 的 lower bound。因此「optimal」必須附帶比較對象：expectimax 相對於固定 `π_7`，minimax 相對於最壞的 `π_min`。

## Expectiminimax：回合選擇之外還有隨機性

到這裡，Game1 的每個分支都是玩家選 action；`expectiminimax()` 再引入一個有隨機性的 game tree，讓 recurrence 同時需要 agent 的 max、opponent 的 min，以及隨機事件的 expectation。原始程式用 `game2` 的圖和 expectiminimax recurrence 圖呈現這個組合；它沒有在 Python 中另寫一個通用類別，而是強調可以依賽局的節點類型定義對應的 `V_...()` recurrence。

因此，expectiminimax 不是把 expectimax 或 minimax 的假設含糊混在一起，而是按節點區分：agent 選最大值、opponent 選最小值、chance 分支按機率取期望。可能的延伸包括超過兩位玩家、玩家獲得額外回合，或玩家選擇誰接著走；對應做法仍是重新定義 recurrence。材料也明確列出這棵 turn-based、零和 game tree 沒有涵蓋的例子：不完全資訊的 poker、非零和的 prisoner's dilemma、非輪流制的 rock-paper-scissors。不能因為 recurrence 很漂亮，就把這些問題假定成同一模型。

## Alpha-beta pruning：精確但少算分支

Minimax 的 recurrence 要遞迴所有分支，通常是指數時間。Alpha-beta pruning 的目標是加速這個精確計算：不造一個近似 value，而是在已知某個分支不可能改變答案時不再訪問它。這是 branch and bound 的想法。

最小的 bound 例子是：A 的 value 已知落在 `[3, 5]`，B 的 value 落在 `[5, 100]`。如果要取 max，B 至少是 5，而 A 至多是 5；在本例的比較意義下，B 不會比 A 差，因此不必把兩者精確算完。遊戲樹裡同樣可以用祖先已知的界限停止探索。程式給的具體例子是：root 計算 `max(3, min(2, X))`。因為 `min(2, X)` 不可能大於 2，root 已經有另一個值 3，所以不論 X 是什麼，root 都會選 3；X 不需要被探索。

更一般地，探索進行時，每個 max node 有一個 value 的 lower bound，每個 min node 有一個 upper bound；minimax value 最終來自某個 leaf。沿著 minimax policy 會走到那個 leaf 的路徑可視為 optimal path，而這條路徑必須落在祖先節點提供的 lower/upper bounds 之內。當某個 node 的 bounds 與每個 ancestor 的 bounds 都不再有可能重疊時，該 node 可以 prune。這個判準的重點是「不影響 max/min 答案」，不是「看起來不重要」。因此 alpha-beta 保持 minimax 的 exact value 與 action，只減少實際拜訪的 state。

剪多少取決於 child 的訪問順序。若先走到能快速拉高 max node lower bound、或快速壓低 min node upper bound 的 child，後續分支更早與祖先界限失去重疊，便有更多 pruning。`games.py` 的實務建議是用 evaluation function 協助排序：max node 先訪問估值較高的 action，min node 先訪問估值較低的 action。這個 evaluation function 在 alpha-beta 章節只被拿來排序；它不會因此改變 alpha-beta 本身的 exactness。它的作用是讓 bounds 更快收緊，速度提升則依 ordering 而變。

## Evaluation function：深度受限時接受近似

如果樹太深，即使 alpha-beta 已經省掉一些分支，仍可能來不及把終局算到底。這時 `evaluation_functions()` 的策略不是假裝中途 state 已有真正 utility，而是定義一個 evaluation function，利用先驗知識估計「目前 state 對結果有多好」。在本講的 game model 裡，終局真正重要的只有誰贏；evaluation function 則在還沒走到終局時，提供一個近似訊號。原始材料用 chess 圖示意這種 domain knowledge，但 `games.py` 沒有規定一個通用的 chess 分數公式。

深度受限的 recurrence 會多帶一個深度 `d`：若 state 已經是 end state，回傳真正的 `utility`；若 `d` 已耗盡，停止繼續展開，改回傳 `evaluation(state)`；否則依 player 做 max 或 min，對 successor 以 `d-1` 遞迴。這個切點必須在實作中清楚處理，否則可能在非終局 state 呼叫只適用終局的 `utility`，或忘記遞減深度而仍然無限展開。之後仍可把 alpha-beta 加在這個 depth-limited minimax 上，但剪枝正確性只保證相對於你提供的 leaf values；如果 leaf value 是 evaluation function 的估計，整體 policy 就不再保證是原始完整樹的 optimal policy。

## 執行順序總覽

本講依序從 game 介面、simulation、expectimax、minimax 與 face-off，走到 expectiminimax、alpha-beta 和深度受限 evaluation；每一步都把假設寫在 recurrence 裡。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=games)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
