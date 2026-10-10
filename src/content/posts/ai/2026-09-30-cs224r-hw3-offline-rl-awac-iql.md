---
title: "CS224R HW3：AWAC、IQL 與 AntMaze 上的 stitching"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, offline-rl, homework]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 11
tldr: "CS224R Spring 2026 的 HW3 要你從零補完兩個 offline RL 演算法：AWAC 和 IQL，並在 D4RL 的 AntMaze 上比較。Problem 1 在 antmaze-umaze 和 antmaze-medium-diverse 跑 AWAC；Problem 2 先比較 IQL 的 expectile ζ = 0.2 和 0.9，再用較好的值跑 medium-diverse，最後在一份最高 return 只有 −46 的 PointMass 資料上，看 IQL 能不能拼出比資料更好的路徑，並跟只取前 10% 軌跡的 filtered BC 比較。題目 PDF、LaTeX 模板和起始碼都公開，但作業規定在 Modal 上跑，課程 credits 只發給修課學生。本文只整理題目和環境，不寫解答。"
description: "Stanford CS224R（Spring 2026）Homework 3 導讀：依官方 HW3 PDF 與 hw3_starter_code 整理 AWAC 與 IQL 的損失函數、要補的 TODO 檔案、AntMaze 與 PointMass 環境、三個實驗問題、autograder 的 CSV 規定，以及校外自學者要注意的 Modal 算力、wandb 和舊版 D4RL 依賴。不含解答。"
draft: false
glossary:
  - term: "AWAC"
    aliases: ["Advantage-Weighted Actor-Critic"]
    definition: "用 TD 學 Q-function、再以 exp(advantage / λ) 加權資料中動作的 log-likelihood 來更新 policy 的 offline RL 演算法。"
    context: "CS224R HW3 Problem 1 要實作它，critic 用 clipped double Q。"
  - term: "IQL"
    aliases: ["Implicit Q-Learning"]
    definition: "用 expectile regression 擬合 V、用 V 當 TD 目標擬合 Q，再用 advantage 加權模仿抽出 policy 的 offline RL 演算法；訓練過程不查詢資料外的動作。"
    context: "CS224R HW3 Problem 2 要實作它並調 expectile ζ。"
  - term: "D4RL"
    aliases: ["Datasets for Deep Data-Driven Reinforcement Learning"]
    definition: "一組 offline RL 的標準資料集與環境，包含 AntMaze 等任務。"
    context: "CS224R HW3 的 antmaze-umaze-v0 和 antmaze-medium-diverse-v0 都來自 D4RL。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Spring 2026 的 [HW3 PDF](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf)、[LaTeX 模板](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.tex)和 [hw3_starter_code.zip](https://cs224r.stanford.edu/material/hw3/hw3_starter_code.zip)。課表上 HW3 在 2026-04-24 發布，5/8 晚上 9 點（太平洋時間）截止。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 11 篇。**本文不寫解答**，也不透露實驗該得到什麼數字。

[CS224R](https://cs224r.stanford.edu/) 的三份作業佔總成績 40%，HW3 佔其中 15%。它對應的是 [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)：投影片在 AWAC 和 IQL 兩頁都寫「你會在 HW3 實作它」。

PDF 開頭列了三個目標：

1. 實作 AWAC 和 IQL，在 AntMaze 任務上訓練並比較
2. 調整 offline RL 的關鍵超參數，分析它們怎麼影響表現
3. 在資料不夠好的 PointMass 任務上，看 IQL 學到的 policy 能不能組合出比資料更好的軌跡

另外要知道一條規定：PDF 寫明**禁止用生成式模型幫你寫這份作業的程式碼**。

## 課程影片來源

下方提供官方課程與既有錄影入口。Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。沒有找到與本文範圍相符的公開單支講次，因此不嵌入。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

查核日期：2026-10-10。

## 環境與資料

| | AntMaze | PointMass |
|---|---|---|
| 動作空間 | 連續 | 離散（gridworld） |
| 任務 | 螞蟻機器人走迷宮到目標 | 在格子世界走到目標 |
| 變體 | antmaze-umaze（U 形迷宮，左下到左上）；antmaze-medium（左下到右上，需要更長的規劃） | PointmassMedium-v0 |
| 資料 | D4RL 的 antmaze-umaze-v0、antmaze-medium-diverse-v0，執行時自動下載 | 起始碼附的 pointmass_stitching_dataset.npz |

兩個環境的獎勵都很稀疏：到達目標得 0，其他每一步 −1。所以評估用的平均 return 越接近 0 越好；沒到達目標的 episode，return 會接近 −episode 長度。

[D4RL](https://arxiv.org/abs/2004.07219) 是 offline RL 的標準資料集。PointMass 那份資料是這份作業特別設計來測 stitching 的。

## Problem 1：AWAC（2 分）

### 要實作的損失

actor 用 advantage 加權的負 log-likelihood：

```text
Lπ(ψ) = −E_{(s,a)~D} [ log πψ(a | s) · exp( A^{πk}(s, a) / λ ) ]
```

A^{πk} 用目前的 policy 算，加上 stop gradient；λ 是溫度參數。

critic 用 TD loss，下一個動作 a′ 從目前的 policy 取樣。為了減少高估，PDF 要求用 **clipped double Q**：維護兩個 Q 網路和各自的 target 網路，TD 目標取兩個 target Q 的最小值，兩個 Q 都對這個目標做回歸。

### 要補的 TODO

| 檔案 | TODO 內容（照起始碼註解） |
|---|---|
| `cs224r/policies/MLP_policy.py` | 用 advantage 和 `lambda_awac` 算指數權重 |
| `cs224r/critics/awac_critic.py` | 算兩個 Q 網路的更新 loss |
| `cs224r/agents/awac_agent.py` | 算 A(s, a) = Q(s, a) − V(s)；從目前的 actor 取樣 a′ ~ π(·\|s′)；更新 actor |

### 實驗

1. 在 antmaze-umaze-v0 上訓練 AWAC，PDF 估計約 1 小時
2. 在較難的 antmaze-medium-diverse-v0 上訓練，約 1.5 小時

兩題都要回報 3 個 seed 最終 checkpoint 的 `Eval_AverageReturn` 平均和標準差。PDF 強調是「每個 seed 取一個值，再跨 seed 算統計量」，不是在單一 run 裡算。

## Problem 2：IQL（5 分）

### Expectile 的定義

PDF 把 expectile ζ 定義成最小化不對稱平方損失 |ζ − 1{μ ≤ 0}|·μ² 的那個值。ζ > 0.5 時，比估計值小的樣本權重被調低，大的樣本權重被調高。

IQL 的兩個 critic 損失：

- **V 的損失**：對 Q_target(s, a) − V(s) 套 expectile loss
- **Q 的損失**：一般的平方誤差，目標是 r + γ·V(s′)

actor 的更新跟 AWAC 類似，都是 advantage 加權。PDF 也點出 IQL 的關鍵：critic 只在資料裡出現過的動作上更新，不會碰到資料外取樣的動作。

> **跟投影片對照時注意符號方向。** L7 投影片把 expectile loss 寫在 V − Q 上，取「小於 0.5」的 λ；HW3 PDF 寫在 Q − V 上，用 ζ。兩邊的參數方向相反，別直接把投影片的數字搬過來。

### 要補的 TODO

| 檔案 | TODO 內容（照起始碼註解） |
|---|---|
| `cs224r/critics/iql_critic.py` | 定義 value function；實作 expectile loss；算 V 的 loss；算兩個 Q 網路的 loss |
| `cs224r/agents/iql_agent.py` | 估計 advantage；更新 actor |

### 三個實驗

**Part 1（2 分）：調 ζ。** 在 antmaze-umaze-v0 上分別用 ζ = 0.2 和 ζ = 0.9 訓練（每個約 1 小時），回報兩者的平均和標準差，再用 2–3 句話說明哪個比較好、為什麼。PDF 的定義段已經寫了 IQL 想學的是哪一側的 expectile，先用它預測結果，再拿實驗驗證。

**Part 2（2 分）：換難的迷宮。** 用 Part 1 較好的 ζ 在 antmaze-medium-diverse-v0 上訓練（約 1.5 小時）。然後做一張表，列 AWAC 和 IQL 在兩個迷宮上的最終平均 return，用 3 句話討論：在 horizon 更長、地圖更大的任務上哪個演算法比較好，並從「怎麼處理 OOD 動作和估計價值」解釋原因。這題正好是 L7 投影片後半的論點，可以拿投影片的優缺點表對照。

**Part 3（1 分）：stitching。** 資料 `pointmass_stitching_dataset.npz` 刻意做得不夠好，PDF 給的數字是最高 return −46、平均 −104。你要在上面訓練兩個 agent：

- IQL（用 Part 1 較好的 ζ），約 15 分鐘
- Filtered BC，只用 return 最高的 10% 軌跡，約 10 分鐘

回報兩者 3 個 seed 的平均 return 和最高 return，附上各一張軌跡視覺化圖，再分析：IQL 有沒有超過 −46？跟 filtered BC 比如何？它有沒有把資料裡不同軌跡的片段拼成一條更好的路徑？

這題是 L7 那張九狀態 stitching 圖的實作版。Filtered BC 就是 L7 說的「很原始、適合當 baseline」的方法。

## 繳交與 autograder

- 答案填在 LaTeX 模板的 `answer{}` 裡，交 PDF
- 程式碼和實驗紀錄打包成一個資料夾：`csv_data/` 放 autograder 用的 CSV，`cs224r/` 放所有 .py 檔，維持原本的檔名和結構
- autograder 評 Problem 1 的兩題和 Problem 2 的前兩題。CSV 要從 wandb 儀表板上名稱**完全是** `Eval_AverageReturn` 的圖匯出，一個 seed 一個檔，每題剛好 3 個
- Problem 2 Part 1 只交表現最好的那個 ζ 的 CSV

目錄結構 PDF 寫得很細（`P1/1/awac_umaze_seed1.csv` 這種格式），交之前照著對一次。

## 自學者要注意的地方

**算力。** PDF 寫明所有部分都在 Modal 上跑，也不支援在自己電腦或其他平台設定；你可以在本機寫程式，再送到 Modal 訓練。起始碼的 `modal_config.py` 設定每個容器一張 T4 GPU、timeout 4 小時；`modal_train_para.py` 會同時開 3 個容器，每個 seed 一個。課程 credits 從修課 email 裡的連結兌換，校外讀者拿不到，要自己付 Modal 費用或改寫成在別處跑。

照 PDF 給的每次訓練時間粗估，整份作業要跑 7 組設定、每組 3 個 seed，加起來大約 19 個 T4 GPU 小時。這是我依 PDF 的時間估計自己加總的，不是官方數字；實際時間會因為除錯重跑而變多。PDF 建議除錯時先用 `modal_train.py` 跑單一 seed。

**依賴版本很舊。** `requirements.txt` 固定了 gym 0.23.1、torch 1.13.1、mujoco-py 2.1.2.14，D4RL 則指定到某個 commit；conda 環境指定 Python 3.10.19。想在 Modal 以外的地方跑，就要自己重現這組舊版環境。

**wandb。** 要自己註冊 wandb 帳號並登入；在 Modal 上找不到 API key 時，PDF 給了用 `modal secret create` 建立 secret 的指令。autograder 的 CSV 也要從 wandb 匯出。

**沒有公開的部分。** 解答、autograder 和 Gradescope 都不公開，所以你只能自己判斷數字合不合理。可以用的對照是 L7 投影片的論點，以及 IQL 和 AWAC 原論文的實驗。

**結果存在哪。** 訓練輸出（log、checkpoint、評估影片）存在名為 `cs224r-hw3-results` 的 Modal Volume，用 `modal volume get` 下載到本機。Part 3 的軌跡圖也在這裡。

## 今晚可以做的事

還沒要跑實驗的話，先做一件不花算力的事：打開 `iql_critic.py` 的 expectile loss TODO，照 PDF 的定義在紙上畫出 ζ = 0.2 和 ζ = 0.9 的損失曲線（PDF 的 Figure 3 就是這張圖），然後回答：對同一個狀態、資料裡 Q 值有高有低的幾個動作，這兩個 ζ 會讓 V 落在哪裡？想清楚這一點，Part 1 的解釋題就有方向了。

## 延伸閱讀

- [Berkeley CS285：推論與 offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl)：另一門課對 offline RL 的整理
- [Berkeley CS285：作業與專題路線](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)：比較兩門課的作業設計

**系列導覽**：上一篇 [L8：獎勵從哪裡來](/posts/ai/2026-09-30-cs224r-reward-learning)｜下一篇 [L9：RLHF 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。重查官方頁與公開播放清單，沒有對應的公開錄影，狀態維持不變。

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [CS224R Spring 2026 Homework 3 PDF](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf)
- [Homework 3 LaTeX 模板](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.tex)
- [hw3_starter_code.zip](https://cs224r.stanford.edu/material/hw3/hw3_starter_code.zip)
- [CS224R Compute Guide（Modal）](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)
- [Lecture 7 投影片：Offline Reinforcement Learning（2026）](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf)
- [Nair, Gupta, Dalal, Levine. AWAC（arXiv 2006.09359）](https://arxiv.org/abs/2006.09359)
- [Kostrikov, Nair, Levine. Offline Reinforcement Learning with Implicit Q-Learning（arXiv 2110.06169）](https://arxiv.org/abs/2110.06169)
- [Fu et al. D4RL: Datasets for Deep Data-Driven Reinforcement Learning（arXiv 2004.07219）](https://arxiv.org/abs/2004.07219)
