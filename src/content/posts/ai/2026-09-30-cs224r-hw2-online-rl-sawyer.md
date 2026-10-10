---
title: "CS224R HW2：Gridworld Q-learning、PPO 與 Sawyer 鐵鎚任務"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, ppo, q-learning, stanford, ai-course, course-guide]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 8
tldr: "CS224R Spring 2026 的 HW2 分三段：先在 5×4 的格子世界用表格型 Q-learning 看 reward 設計怎麼改變學到的路徑；再用 GAE 加 PPO clip 解一個只在完成時給 1 分的鐵鎚任務；最後用 BC 預訓練、critic ensemble 和更高的 UTD 做 off-policy actor-critic，並比較兩條學習曲線。題目、起始碼和算力指南都公開，但作業只支援 Modal，課程 credits 只發給修課學生。"
description: "Stanford CS224R Spring 2026 Homework 2 導讀：Problem 1 的 gridworld 與三種 reward 情境、Problem 2 的 PPO（GAE、clipped surrogate、reverse-KL 參考 policy）、Problem 3 的 off-policy actor-critic（BC 預訓練、critic ensemble、target critic、UTD 實驗）與 PPO 對照題，以及校外自學者要注意的 Modal 與 MuJoCo 環境限制。不含解答。"
draft: false
glossary:
  - term: "UTD ratio"
    aliases: ["update-to-data ratio", "UTD"]
    definition: "每收一步環境資料，就對 critic 做幾次梯度更新。UTD 越高，同一筆資料被用得越多次，但每步的計算也越貴。"
    context: "CS224R HW2 Problem 3 比較 UTD=1 與 UTD=5 的學習速度。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 8 篇，接在 [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac) 和 [L6 Q-learning](/posts/ai/2026-09-30-cs224r-q-learning) 之後，介紹第二份作業「Online Reinforcement Learning」。

作業在 2026 年 4 月 10 日（L4 當天）發下，4 月 24 日晚上 9 點（太平洋時間）交到 Gradescope，占總成績 15%。用到的官方材料有四份：

- 題目 [CS224R_2026_Homework_2.pdf](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf)，以及 [LaTeX 模板](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.tex)
- 起始碼 [hw2_starter_code.zip](https://cs224r.stanford.edu/material/hw2/hw2_starter_code.zip)（解壓後資料夾叫「hw2 4/」，只是命名）
- 算力指南 [CS224R_compute_guide.pdf](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)

存取等級是 **A3**：題目、模板、起始碼和算力指南都能匿名下載。解答、autograder、Gradescope 與 Ed 討論不公開。**本文只說明題目要你做什麼，不寫解答**，包括 Problem 1 各情境會走到哪個目標。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

## 任務：一個只有終點才給分的鐵鎚

作業的主角是一台 4 自由度的 Sawyer 機械手臂，動作空間是連續的，觀測是環境狀態，不是影像。它要拿起一把鐵鎚，把釘子敲進去。起始碼的 README 說明，環境是 Meta-World 的 `hammer-v2`。

題目特別強調獎勵是**稀疏的**：只有完整完成任務時給 1.0，中間沒有任何獎勵。題目給的理由是，真實世界的問題很難設計密集獎勵。

三個問題的分工：

| 問題 | 環境 | 演算法 | 要改的檔案 |
|---|---|---|---|
| Problem 1 | 5×4 gridworld | 表格型 Q-learning | `gridworld_q_learning.py` |
| Problem 2 | Sawyer 鐵鎚 | PPO（on-policy） | `on_policy.py` |
| Problem 3 | Sawyer 鐵鎚 | Off-policy actor-critic | `off_policy.py` |

README 寫明，只有這三個檔案有 `### YOUR CODE HERE ###` 區塊。題目也規定 Problem 2、3 不要改其他檔案。

## Problem 1：reward 怎麼改變學到的路徑

### 環境

格子是 5×4，共 20 個狀態。agent 永遠從 (0, 0) 出發。兩個終點：

- **Goal 2** 在 (4, 0)，4 步可到
- **Goal 1** 在 (4, 3)，7 步可到

四個動作：左、右、上、下。撞牆就留在原地，但仍然會扣或加當步的獎勵。

每一步的獎勵是 r_step，走進終點時再加上該終點的獎勵 R1 或 R2。三個情境：

| 情境 | r_step | R1（遠的 Goal 1） | R2（近的 Goal 2） |
|---|---|---|---|
| 1 | −1 | 10 | 5 |
| 2 | −2 | 10 | 5 |
| 3 | +1 | 1 | 1 |

題目說明 Q 表初始化為 0，用標準的 Q-learning 更新式直接更新表格。注意題目這裡有一處筆誤：前面寫 20 個狀態，後面卻寫表格有「40 × 4 = 160」個 Q 值。照 5×4 的格子算，應該是 20 × 4 = 80。

### 要實作的函式

1. `choose_action`：ε-greedy。以機率 ε 均勻隨機選，否則選 argmax Q，平手隨便挑。
2. `train_q_learning` 的內層迴圈：選動作、走一步拿到 (s', r, done)、套 Q-learning 更新、done 就結束這個 episode。

起始碼的預設值是 5000 個 episode、學習率 α=0.2、折扣 γ=0.98，ε 從 0.4 線性降到 0.02。

### 要回答的問題

每個情境跑一次 `python gridworld_q_learning.py`，回報學到的軌跡和總獎勵：有沒有走到終點、走到哪一個，並用一句話解釋為什麼學到這條路。

這一題的重點不在程式，而在 reward 設計。每步扣多少、每步是加分還是扣分，都會改變「繞遠路拿大獎」和「走近路拿小獎」哪個划算，甚至改變「要不要結束 episode」。動手前可以先用筆算一下三種情境下兩條路徑的總獎勵。

**怎麼做**：這個檔案只 import `numpy` 和標準函式庫，筆電就能跑，不需要 Modal。建議從這題開始，把 [L6](/posts/ai/2026-09-30-cs224r-q-learning) 的 Bellman optimality 直覺落地。

## Problem 2：PPO 解鐵鎚任務

### 題目先釐清「on-policy」

題目有一段說明：嚴格定義下，on-policy 要求每批資料只用來做一次梯度更新。這裡的 agent 會對同一批資料跑好幾個 epoch，所以並不嚴格。題目仍然叫它 on-policy，因為資料永遠是用目前 policy（或最近的快照）新收的；對照的是 Problem 3 那種可能用任意舊 policy 收的、存在 replay buffer 裡的資料。

這正是 [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac) 的「一批資料、多步梯度」，也對應 L6 總整理表上「技術上 off-policy，常被稱為 on-policy」那一格。

### Agent 的組成

`on_policy.py` 裡的 `PPOAgent` 有三個元件：

- **Actor**：輸出 TruncatedNormal 分佈，也就是被截在 [−1, 1] 的 Gaussian，對應環境的動作範圍
- **Value function V_φ(s)**：只看狀態，用來算 GAE
- **凍結的參考 actor**：BC 預訓練後的 policy 快照。PPO 更新時用 reverse-KL 懲罰，避免 policy 離預訓練的起點太遠

### 要實作的部分

1. **`compute_gae`**：給一條長度 T 的軌跡，從後往前算 GAE advantage 和對應的 return（value 的訓練目標）。題目把遞迴式寫出來了，要注意 episode 結束旗標 d_t 的處理。
2. **`update` 裡的兩個區塊**：
   - 在 epoch 迴圈之前，用 critic 估值、呼叫 `compute_gae`，整段包在 `torch.no_grad()` 裡，因為目標值要固定
   - 在 minibatch 迴圈裡，算新舊 policy 的比值 ρ，寫出 PPO-Clip 的 policy loss

題目提醒，比值要用 log 機率相減再取 exp 來算。在高維動作空間裡，個別機率可能小到 underflow，而且 actor 本來就輸出 log 機率。

### 訓練與門檻

用 `modal run modal_on_policy.py` 訓練，附上 Wandb 上 `eval/episode success` 的截圖，跑到 100 萬步，**成功率至少要到 25%**。

起始碼 `cfgs/on_policy_config.yaml` 的設定可以和 L5 投影片對照：

| 項目 | HW2 設定 | L5 投影片第 14 頁的範例 |
|---|---|---|
| 每批 rollout 步數 | 4096 | 約 2000 |
| 每批 epoch 數 | 3 | 約 10 |
| minibatch | 64 | 64 |
| clip ε | 0.1 | 0.2 |
| 總訓練步數 | 100 萬 | 約 100 萬 |

其他設定：GAE λ=0.99、γ=0.99、entropy 係數 0.01、reverse-KL 係數 0.01、BC 預訓練 10000 步、學習率 3e-4。

## Problem 3：off-policy actor-critic

### Agent 的組成

`off_policy.py` 裡的 `ACAgent`：

- **N 個 critic Q_φi(s, a)**：一個 ensemble，用來降低 Q 估計的誤差
- **每個 critic 各有一個 target critic**：更新得比較慢，讓 Bellman 目標穩定
- **Actor π_θ**

觀測是最近兩個環境步的狀態疊在一起。

### 要實作的部分

1. **BC 預訓練（`bc`）**：題目提供 20 條成功示範（起始碼 `demos/` 資料夾裡有 20 個 `.npz`），用 −log π(a|s) 做監督學習。之後 RL 訓練時也會交錯做 BC 更新來維持穩定。題目寫這個 policy「和 Problem 1 的參考 policy 相同」，從內容看指的應該是 Problem 2 的參考 actor。
2. **`update_critic`**：
   - 從 policy 抽下一步動作
   - Bellman 目標取**隨機抽出的兩個 target critic 的較小值**，用來壓低高估。這是 L6 Double Q 和 TA 講義 critic ensemble 的延伸
   - 對所有 N 個 critic 算平方誤差，目標值要 stop-gradient
   - 走一步梯度，再用指數移動平均更新 target critic（對應 TA 講義的 Polyak 軟更新）
3. **`update_actor`**：從 actor 抽動作，最大化所有 critic 的平均 Q 值，只更新 policy 參數。

題目列了三個常見錯誤：critic loss 一直是平的（critic 沒在更新）；critic loss 爆大（預測和目標的維度或 broadcasting 錯了）；只更新了被抽去算目標的那兩個 critic，而不是全部 N 個。

### 訓練與 UTD 實驗

1. **基本設定**（2 個 critic、UTD=1）：`modal run modal_off_policy.py`，**10 萬步內成功率至少 90%**。
2. **UTD 實驗**：把 `modal_off_policy.py` 裡 subprocess 的參數改成 `agent.num_critics=10` 和 `utd=5`，再跑一次，**4 萬步內成功率至少 90%**，並用一句話解釋為什麼。題目提醒這個設定計算量大很多，5 萬步約需 2 小時。

UTD（update-to-data ratio）是每走一步環境，做幾次 critic 梯度更新。

### 比較題

最後一題：比較 Problem 2 的 PPO 曲線和 Problem 3（2 個 critic、UTD=1）的曲線，用 3–5 句話說出**至少兩個具體差異**，分別從樣本效率和最終表現來看，並把每個差異連到演算法的某個性質。

這題的答題素材幾乎都在 L5 第 30 頁和 L6 第 28 頁的比較表裡。但題目要的是你在自己的曲線上看到的差異，所以要先跑出結果才能回答。

## 交作業與規定

- PDF 報告：Problem 1 的觀察、Problem 2 和 3 的訓練曲線與回答
- zip：三個 `.py` 檔，加上從 Wandb 下載的三個 CSV（`on_policy.csv`、`off_policy.num_critics=2,utd=1.csv`、`off_policy.num_critics=10,utd=5.csv`）
- **禁止用生成式 AI 寫這份作業的程式碼**，理由是要深入理解 actor-critic 的實作
- 需要一個 Wandb 帳號記錄訓練曲線

## 自學者要注意：算力與環境

**Modal 是唯一被支援的平台。** 題目說所有部分都在 Modal 上完成，不支援在其他平台（包括自己的電腦）上設定。可以在本機寫程式、再送上 Modal 跑，以節省 credits。長時間的工作可以加 `--detach` 在背景執行。

**Credits 只發給修課學生。** 算力指南寫明，credits 的兌換碼是教學團隊寄給學生的，標題「Your CS224R Modal Compute Credits」，另有一份 Google 表單給還沒收到的人。校外讀者要自己付 Modal 的費用，或自備機器。

起始碼裡的 Modal wrapper 各自指定了 GPU：`modal_on_policy.py` 和 `modal_gridworld_q_learning.py` 用 A10，`modal_off_policy.py` 用 A100。

**本機路線沒有官方支援。** 題目附了 `conda_env_local.yml`，給有 NVIDIA GPU 的 Linux 機器參考，但明說教學團隊不支援。這個環境需要 `mujoco_py==2.1.2.14` 和 Meta-World；`setup.sh` 是一份 Ubuntu 雲端機器的安裝腳本，會下載 MuJoCo 2.1.0 並安裝指定 commit 的 Meta-World。

算力指南本身是公開的，註明改編自 CS336 Spring 2026 的 Modal 指南。內容涵蓋登入、定義 image 與 app、volume、`.map` 平行化、GPU、secrets 和看 log，對沒用過 Modal 的人很實用。

**怎麼做**：

1. 今晚先做 Problem 1。它只需要 numpy，不用任何雲端資源就能看到三個情境的結果。
2. Problem 2、3 先在本機讀懂 `PPOAgent` 和 `ACAgent`，把 `YOUR CODE HERE` 填完，再決定要不要花錢跑 Modal。起始碼附的 `tests/test_on_policy.py` 可以先檢查 Problem 2 的程式。
3. 預算有限時，先跑 Problem 3 的基本設定：它的門檻是 10 萬步，比 PPO 的 100 萬步少一個數量級（實際耗時本文沒有實測）。題目說 UTD=5 那組 5 萬步約 2 小時，最後再跑。

## 這一篇可以確認與不能確認的

可以確認：題目 PDF 的全部文字、起始碼的檔案清單與設定檔、算力指南、課表上的日期與配分。不能確認：官方解答與評分細則、實際跑完的成功率曲線（本文沒有執行作業）、Modal 跑完整份作業的實際費用。題目 Problem 1 的「40 × 4 = 160」和 Problem 3 的「Problem 1 的參考 policy」看起來是筆誤，本文照原文列出並註明。

延伸閱讀：[Berkeley CS285 的作業與專題路線](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)也有 PPO 和 off-policy 的實作作業，可以當作第二套練習。

系列導覽：上一篇 [L6 Q-learning 與它的穩定化](/posts/ai/2026-09-30-cs224r-q-learning)｜下一篇 [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網、課表與評分政策）](https://cs224r.stanford.edu/)
- [Homework 2 題目 PDF（2026）](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf)
- [Homework 2 LaTeX 模板](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.tex)
- [Homework 2 起始碼 hw2_starter_code.zip](https://cs224r.stanford.edu/material/hw2/hw2_starter_code.zip)
- [CS224R Modal Compute Guide（Spring 2026）](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)
- [Lecture 5 投影片：Off-Policy Actor Critic Methods](https://cs224r.stanford.edu/slides/05_cs224r_offpolicy_actor_critic_2026.pdf)
- [Lecture 6 投影片：Q-Learning](https://cs224r.stanford.edu/slides/06_cs224r_qlearning_2026.pdf)
- [Schulman et al. 2017：Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Schulman et al. 2016：Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438)
- [Meta-World（Farama Foundation）](https://github.com/Farama-Foundation/Metaworld)
- [Modal](https://modal.com/)
- [Weights & Biases](https://wandb.ai/site)
