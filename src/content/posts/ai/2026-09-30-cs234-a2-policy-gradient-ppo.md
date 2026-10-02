---
title: "CS234 作業二：REINFORCE、baseline 與 PPO 實作，外加策略誘導的分布"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, homework, policy-gradient, ppo]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 9
tldr: "CS234 Winter 2026 的作業二共 102 分、四題：DQN 紙筆題（8）、在 CartPole、Pendulum、HalfCheetah 三個 PyBullet 環境上實作 REINFORCE、神經網路 baseline 與 clipped PPO（54 分程式＋21 分報告），證明策略誘導的狀態分布與 performance difference lemma（14），以及用 Belmont Report 檢視一個會邊學邊影響學生的 RL 實驗（5）。程式題的重點是把 L5–L7 的式子一行一行變成可以跑出 21 條學習曲線的程式。"
description: "Stanford CS234（Winter 2026）作業二導讀：Q1 DQN 紙筆題、Q2 REINFORCE／baseline／PPO 在 CartPole、Pendulum、Cheetah 的實作與目標分數、Q3 discounted state distribution 與 performance difference lemma、Q4 RL 實驗的研究倫理。含配分、繳交格式、起始碼檔案清單與超參數。只講題目在練什麼，不提供解答。"
draft: false
glossary:
  - term: "advantage normalization"
    aliases: ["優勢正規化"]
    definition: "把一批估計出的 advantage 減去平均、除以標準差，讓它們平均為 0、標準差為 1。減平均等於再扣一個常數 baseline，除以標準差等於把學習率乘上 1/σ。"
    context: "作業二 §2.3 的第二個降變異技巧，起始碼的 config 預設開啟。"
  - term: "performance difference lemma"
    aliases: ["relative policy performance identity", "策略表現差恆等式"]
    definition: "兩個策略的價值差，可以寫成「用其中一個策略的狀態分布取樣，對另一個策略的 advantage 取期望」再乘上 1/(1−γ)。它讓你只用舊策略收的資料，就能估新策略會好多少。"
    context: "L6 p.33 直接寫明「In CS234 HW2 we ask you to prove」，就是作業二 Q3 (d)。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo-en)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 的作業與投影片；公開錄影是 [Spring 2024 版](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)。所有事實都在 2026-09-30 打開 [作業頁](https://web.stanford.edu/class/cs234/assignments.html)、[A2 題目 PDF](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)（11 頁）與 [起始碼 zip](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip) 核對。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：題目、LaTeX 範本與起始碼都公開；拿不到的是 Gradescope 評分、Ed 論壇上的助教回覆與官方解答。

**系列位置**：上一篇 [進階策略梯度：performance bound、KL、PPO、GAE](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement)｜下一篇 [從示範學：BC、DAgger、IRL、MaxEnt IRL](/posts/ai/2026-09-30-cs234-imitation-learning-irl)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

前三篇把 value-based 走到 [DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning)，再轉向直接對策略求梯度：[REINFORCE 與 baseline](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)，以及用 clipping 限制步長的 PPO。作業二把這一整段收成一份：一題 DQN 小題、一個要自己寫完 policy gradient 家族的程式專案、一題把 PPO 背後那條恆等式證出來，最後一題問你「這種邊試邊學的演算法，拿到真人身上該怎麼做實驗」。

依 2026 課表，作業二在 Week 2 發下，**2026 年 2 月 1 日（週日）下午 6 點（PST）截止**。截止那週（Week 4）課堂正在講 Policy Search 與模仿學習，所以 PPO 的課才剛講完，程式就要交。

本文只講每題在練什麼、要用哪些講次的工具、做的時候容易卡在哪。**不提供任何題目的解答。**

## 繳交方式與配分

作業分三份交：

1. 紙筆部分的 PDF
2. 紙筆部分的 LaTeX 原始檔 zip（用官方 [LaTeX 範本](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_template.zip)）；這個 zip 解開要直接是 `main.tex` 與 `img/results-cheetah.png`、`img/results-pendulum.png`、`img/results-cartpole.png`，不能多一層資料夾
3. 程式部分：跑 `bash collect_submission.sh`，它只把 `network_utils.py`、`policy.py`、`policy_gradient.py`、`baseline_network.py`、`ppo.py` 五個檔打包成 `assignment2.zip`

| 題目 | 主題 | 配分 | 形式 |
|---|---|---|---|
| Q1 | Deep Q-Networks (DQN) | 8 | 紙筆，3＋2＋3 |
| Q2 | Policy Gradient Methods | 75 | 程式 54＋報告 21 |
| Q3 | Distributions induced by a policy | 14 | 紙筆證明，3＋1＋5＋5 |
| Q4 | Ethical concerns with Policy Gradients | 5 | 紙筆，4＋1 |

合計 102 分。[課程首頁](https://web.stanford.edu/class/cs234/) 的比重：校內學生作業二佔 7%（另有 24% 的 tutorials），校外學生佔 15%。每份作業最多用 2 個 late day，全學期共 5 個。

## Q1：DQN 的三個小題

這題題目直接附上 DQN 的虛擬碼（replay buffer D、網路參數 θ、target network 參數 θ⁻、每 C 步同步一次），然後問：

- (a) 要改虛擬碼的哪幾行，才能退回表格版 Q-learning？改成什麼？（3 分）
- (b) 回到 L2 的 Mars Rover 例子，怎麼改這個問題，會讓表格版 Q-learning 表現極差、需要改用 DQN 之類的方法？（2 分）
- (c) 解釋 replay buffer 為什麼有幫助。（3 分）

三小題都是 [DQN 那一篇](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning) 的複習。(a) 最好的做法是逐行對照：哪些行是為了函數近似才存在（網路、target network、minibatch），拿掉它們之後，剩下的更新規則是不是就是 L4 的 Q-learning。(b) 想的是「表格什麼時候裝不下或學不動」，而不是「DQN 什麼時候比較帥」。

## Q2：自己寫完 policy gradient 家族

題目 §2.1–2.4 先把四個式子交代清楚，程式就是照著它們填：

1. **REINFORCE**：用取樣的報酬 Gₜ 當 Q^π(s, a) 的不偏估計，目標是所有軌跡、所有時間步的 log π_θ(aₜ|sₜ)·Gₜ 取平均
2. **Baseline**：扣掉一個學出來的 b_φ(s)，b_φ 用 MSE 去擬合 Gₜ
3. **Advantage normalization**：把 Âₜ = Gₜ − b_φ(sₜ) 正規化成平均 0、標準差 1。題目自己解釋了為什麼這不改變梯度方向：減平均等於再扣一個常數 baseline，除以標準差等於把學習率縮放 1/σ
4. **PPO**：比值 z_θ = π_θ(a|s) / π_θold(a|s)，目標是 min(z·Â, clip(z, 1−ε, 1+ε)·Â)。這裡的 V_φ 叫 critic，訓練方式跟 baseline 一樣。用 π_θold 收一批資料，對同一批資料做 K 次更新，再把 π_θold 換成 π_θ

題目特別點出 REINFORCE 是 on-policy：一批資料做一次更新就丟掉。PPO 的動機就是想從同一批軌跡「多擠一點資訊」，同時用 clipping 擋住因為資料是舊策略收的而可能過大的更新。題目也預告：這跟之後會細講的 importance sampling 有關（L7 PDF 最後 p.63–69 就是這段補充）。

### 起始碼檔案清單

解開 `assignment2_starter_code.zip` 是 `code/` 目錄加 `README.md`、`requirements.txt`、`collect_submission.sh`：

| 檔案 | 要做什麼 |
|---|---|
| `network_utils.py` | 實作 `build_mlp` |
| `policy.py` | 實作 `BasePolicy.act`、`CategoricalPolicy.action_distribution`、`GaussianPolicy.__init__`、`GaussianPolicy.std`、`GaussianPolicy.action_distribution` |
| `policy_gradient.py` | 實作 `PolicyGradient.init_policy`、`get_returns`、`normalize_advantage`、`update_policy`；取樣、訓練迴圈與評估已寫好 |
| `baseline_network.py` | 實作 `BaselineNetwork.__init__`、`forward`、`calculate_advantage`、`update_baseline` |
| `ppo.py` | 實作 `PPO.update_policy`；`PPO` 繼承 `PolicyGradient`，取樣時多存 `old_logprobs` |
| `config.py` | 三個環境的超參數（不用改） |
| `main.py`、`plot.py`、`general.py` | 執行入口、畫圖、logger 與進度條工具 |

環境要求寫在 README：**Python 3.9**，環境來自開源物理引擎 [PyBullet](https://github.com/bulletphysics/bullet3)。`requirements.txt` 釘了 `gym==0.21`、`pybullet==3.2.6`、`numpy==1.23.0`，外加 torch、matplotlib、scipy。README 與題目都提醒：安裝出錯先 `pip install pip==23.0`，因為新版 pip 跟 `gym==0.21.0` 不相容。

### 三個環境與超參數

`config.py` 裡三個環境其實是 PyBullet 版：

| 參數 | cartpole | pendulum | cheetah |
|---|---|---|---|
| 環境 ID | `CartPoleBulletEnv-v1` | `InvertedPendulumBulletEnv-v0` | `HalfCheetahBulletEnv-v0` |
| 批次數 | 100 | 100 | 200 |
| 每批步數 | 2000 | 10000 | 10000 |
| 最長 episode | 200 | 1000 | 1000 |
| γ | 1.0 | 1.0 | 0.9 |
| 網路 | 1 層 × 64 | 1 層 × 64 | 2 層 × 64 |
| PPO ε（`eps_clip`） | 0.2 | 0.2 | 0.1 |
| 每批更新次數（`update_freq`） | 5 | 20 | 10 |

學習率三個都是 3e-2，advantage normalization 預設開啟。注意 cartpole 與 pendulum 的 γ 是 1，只有 cheetah 打折扣；Q2 報告題 (a) 的 Gₜ 要用 `self.config.gamma` 算。

### 寫程式時值得先想清楚的地方

- **維度**。題目說所有函式的 batch 大小都是 ΣTᵢ：起始碼已經把所有 episode 的觀測、動作、報酬攤平成一條。Tip 1、Tip 2 都在講形狀：用 `self(observations)` 呼叫 forward，而不是直接呼叫內部的網路。
- **離散與連續**。`init_policy` 的 docstring 要你看 `self.discrete`：離散動作建 `CategoricalPolicy`，連續動作建 `GaussianPolicy`，再建一個 Adam optimizer。`GaussianPolicy.std` 要你想清楚：標準差是學出來的參數，怎麼保證它是正的？
- **PPO 的比值**。Tip 3 建議不要把兩個機率相除，而是把 log 機率相減再取 exp。
- **哪些東西要算梯度**。PPO 的 `old_logprobs` 是取樣當下存下來的數字；Q2 (c) 會回頭問你這件事。

### Sanity check 與目標分數

題目給的除錯用檢查（大多數 seed 下成立，不是完整驗證）：

- Pendulum，不用 baseline：第 10 個 iteration 左右平均報酬約 100
- Pendulum，用 baseline：第 20 個 iteration 左右約 700
- Pendulum，PPO：第 20 個 iteration 約 200
- 三種方法都應該在某個時間點達到 CartPole 200、Pendulum 1000、Cheetah 200

報告用的參考表現：CartPole 應該碰到上限 200、Pendulum 碰到上限 1000（兩者都不一定停得住），Cheetah 至少 200，可能高到 900。學習曲線會震盪，題目建議多跑幾個 seed 取平均來判斷。

### 報告題（21 分）

| 小題 | 內容 | 分數 |
|---|---|---|
| (a) | 直接算所有 Gₜ 要 O(T²)，說明怎麼在 O(T) 內算完 | 3 |
| (b) | clipped PPO 目標的梯度在哪些情況等於 0？寫成式子並解釋 PPO 為什麼這樣設計 | 3 |
| (c) | 取樣函式會回傳動作的 log 機率。為什麼 REINFORCE 不需要存它、PPO 需要？如果 rollout 時沒存，PPO 的更新程式要怎麼改？ | 3 |
| (d) | 跑完全部實驗並畫圖，對每種方法的表現下評論 | 12 |

(d) 的指令是 `python main.py --env-name ENV --seed SEED --METHOD`，METHOD 是 `baseline`、`no-baseline` 或 `ppo`。CartPole 與 Pendulum 各跑 seed 1、2、3，Cheetah 只要求 seed 1（計算量大，但鼓勵多跑），三種方法合計至少 21 次。畫圖用 `python plot.py --env-name ENV --seeds 1,2,3`，每個環境一張圖放進報告。

(b) 是整份作業最值得花時間的一題。先把 Â > 0 與 Â < 0 分開畫：min 與 clip 各在哪一段起作用，哪一段的斜率是 0。畫完你就知道 PPO 的「proximal」是怎麼靠梯度消失做出來的，也會明白上一篇講的「步長太大就崩」在這裡怎麼被擋住。

## Q3：策略誘導的分布

這題要你從零推出上一篇 PPO 背後那條恆等式。設定是無限視野 MDP、隨機策略、固定起點 s₀：

| 小題 | 要做的事 | 分數 |
|---|---|---|
| (a) | 寫出執行 π 時取樣到一條軌跡 τ 的機率 ρ^π(τ) | 3 |
| (b) | 用 ρ^π 寫出「第 t 步在狀態 s」的機率 p^π(sₜ = s) | 1 |
| (c) | 定義折扣狀態分布 d^π(s) = (1−γ) Σₜ γᵗ p^π(sₜ = s)，證明對任意 f(s, a)，軌跡上 Σ γᵗ f 的期望等於 1/(1−γ) 乘上 d^π 下 f 的期望 | 5 |
| (d) | 證明 V^π′(s₀) − V^π(s₀) = 1/(1−γ) · E_{s∼d^π′, a∼π′}[A^π(s, a)] | 5 |

題目給的提示很具體：(c) 先想 f 只在某一個 (s, a) 等於 1 的情況，那其實就是折扣後的造訪次數；(d) 試著加減 Σ γᵗ⁺¹ V^π(sₜ₊₁)，再用 tower property 與部分軌跡 τₜ。

(d) 在 [L6 投影片 p.33](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf) 有名字：**performance difference lemma**，投影片直接寫「In CS234 HW2 we ask you to prove」。題目最後一段說明它的用處：π 是手上的網路、π′ 是更新後的網路時，這條式子讓你用 π 收的資料去估 π′ 的表現。它就是上一篇 relative performance bound 與 PPO 限制更新幅度的出發點。

<details>
<summary>做 Q3 前先確認手上有哪些工具</summary>

- ρ^π(τ) 是起點、策略機率與轉移機率的連乘；把它寫對，(b)(c) 幾乎就是換個加總順序
- Σₜ γᵗ = 1/(1−γ)，所以 d^π 確實是一個機率分布；(c) 的 1/(1−γ) 就是從這裡來的
- A^π(s, a) = Q^π(s, a) − V^π(s)，而 Q^π(s, a) 可以寫成 r(s, a) + γ E[V^π(s′)]
- 注意 (d) 左右兩邊用的是**哪個**策略的分布、**哪個**策略的 advantage；兩者對調是最常見的錯

</details>

## Q4：拿真人做 RL 實驗

題目設想一門 Stanford CS 課要引入一個以 RL 訓練的 office hours 聊天機器人：每份作業有些學生只拿到真人助教、有些只拿到機器人、有些兩者都有，reward 是學生的作業成績。機器人邊學邊變，所以某個時間點它可能比隨便一位真人助教好，也可能比較差；而且所有學生照同一標準評分。

題目引用 [Belmont Report](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html) 的三個原則：respect for persons、beneficence、justice。

- (a) 用 4–6 句話提出兩個實驗設計或研究決策，並說明各自對應哪一個原則（4 分）。題目自己給了一個範例：讓拿到機器人建議的學生可以在交件後再用真人建議修改，否則壞建議的風險分配不均，違反 justice。
- (b) 如果你要在 Stanford 做這個實驗，要走什麼流程取得 IRB 許可？寄信給誰、在哪裡上傳研究計畫？（1 分）題目附了 [Stanford Research Compliance 的人體研究頁](https://researchcompliance.stanford.edu/panels/hs/forms/for-researchers#need) 要你自己去讀。

這題跟 A1 的 reward hacking 題呼應：那題是 reward 寫錯了，這題是 reward 寫對了，但**探索本身**就會傷人。policy gradient 在學會之前一定得先用還不夠好的策略收資料，模擬器裡沒關係，放到教育或醫療現場就是倫理問題。

## 自學怎麼做

1. 先把 [REINFORCE 那一篇](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce) 的 score function 推導自己重寫一次，再開 `policy.py`。`act` 與 `action_distribution` 就是那個推導的程式版。
2. 照 `network_utils.py` → `policy.py` → `policy_gradient.py` → `baseline_network.py` → `ppo.py` 的順序寫，每寫完一檔就跑一次 Pendulum 對 sanity check。
3. CartPole 跑得最快，適合先確認三種方法都動得起來；Cheetah 最慢，留到最後，至少要跑完 seed 1。
4. Q3 放在實作之後做。寫過 PPO 再證 performance difference lemma，比較看得出「用舊資料估新策略」這件事的份量。
5. 沒有 autograder：你能自己驗的只有 sanity check、參考分數，以及三種方法之間的相對表現是否合理。

今晚可以做的一件事：在紙上畫出 clipped PPO 目標對 z 的函數圖，Â > 0 一張、Â < 0 一張，把梯度為 0 的區段塗起來。這張圖就是 Q2 (b) 的起點。

## 延伸閱讀

- 同一套 policy gradient 在另一門課怎麼講：[CS224R L3：Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients)、[CS224R L5：PPO 與 SAC 的共同骨架](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)
- Berkeley 的版本：[CS285 L5–10：Policy Gradient、Actor-Critic、DQN 與 SAC](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表（A2 在 Week 2 發下、Week 4 截止）、成績比重、late day 規則
- [CS234 作業頁](https://web.stanford.edu/class/cs234/assignments.html) — A2 題目、LaTeX 範本與起始碼連結
- [CS234 Winter 2026 Assignment 2 題目 PDF](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf) — 四題的敘述、配分、繳交格式、sanity check 與參考分數
- [A2 起始碼 zip](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_starter_code.zip) — `code/` 內各檔、README、`requirements.txt`、`config.py` 超參數
- [A2 LaTeX 範本](https://web.stanford.edu/class/cs234/assignments/a2/assignment2_template.zip) — 紙筆部分的排版範本
- [CS234 Lecture 6 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf) — p.33 的 performance difference lemma，點名作業二要證
- [CS234 Lecture 7 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf) — clipped PPO、GAE，以及 p.63–69 的 importance sampling 補充
- [Belmont Report（HHS）](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html) — Q4 引用的三個研究倫理原則
- [Stanford Research Compliance：Human Subjects](https://researchcompliance.stanford.edu/panels/hs/forms/for-researchers#need) — Q4 (b) 要讀的 IRB 流程頁（題目附的連結）
- [Bullet Physics／PyBullet（GitHub）](https://github.com/bulletphysics/bullet3) — 作業三個環境的物理引擎
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — 公開錄影，第 5–7 支「Policy Search 1–3」對應作業二需要的內容
