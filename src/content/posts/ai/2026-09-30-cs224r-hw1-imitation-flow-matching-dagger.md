---
title: "CS224R HW1：Flappy Bird 上的回歸式 BC、Flow Matching 與 DAgger"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, homework, flow-matching]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 3
tldr: "CS224R Spring 2026 的 HW1 用一個自製的 Flappy Bird 環境考模仿學習：policy 一次預測 20 步目標高度、只執行前 10 步。你要依序寫出 MSE 回歸式 BC、flow matching policy 和 DAgger，並在 easy 與 hard 兩種模式下比較。題目 PDF、LaTeX 模板和起始碼都能匿名下載，CPU 也跑得動；解答、autograder 和 Gradescope 不公開。這篇整理每一題要實作什麼、要回答什麼，不寫解答。"
description: "Stanford CS224R Deep Reinforcement Learning（Spring 2026）Homework 1 導讀：Flappy Bird 環境與 action chunking（預測 20 步、執行 10 步）、easy/hard 模式、Problem 1–3 要實作的函式與實驗問題、flow matching 的直覺、起始碼的訓練與評估設定，以及校外自學者會碰到的檔案出入與限制。"
draft: false
glossary:
  - term: "action chunking"
    aliases: ["動作分塊"]
    definition: "policy 一次預測未來一段動作序列，只執行其中前幾步就重新查詢 policy 的做法。"
    context: "CS224R HW1 設定 ACTION_CHUNK=20、EXECUTE_STEPS=10；PDF 稱這種執行方式為 receding horizon control。"
  - term: "DAgger"
    aliases: ["Dataset Aggregation"]
    definition: "反覆讓目前學到的 policy 自己跑，把它走到的狀態交給專家重新標註動作，再和原本的示範資料合併重新訓練的模仿學習方法。"
    context: "CS224R HW1 Problem 3 用它改善 hard 模式下的回歸式 BC。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **來源年份**：本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 的 [Homework 1 PDF](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)、[LaTeX 模板](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.tex)與[起始碼 hw1_starter_code.zip](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip)，三者都在 2026-09-30 匿名下載並讀過。這份作業沒有配套影片。

這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 3 篇，接在 [L2 模仿學習](/posts/ai/2026-09-30-cs224r-imitation-learning)後面。L2 講了三件事：為什麼 policy 要能表達多峰分佈、action chunking、以及用 DAgger 做線上介入。HW1 就是把這三件事放進同一個小遊戲裡，讓你親手看到它們各自解決什麼問題。

課程首頁的時間表寫著：HW1 在 4 月 3 日（週五）L2 當天發出，4 月 10 日晚上 9 點（太平洋時間）截止，占總成績 10%。

## 課程影片來源

下方提供官方課程與既有錄影入口。Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。沒有找到與本文範圍相符的公開單支講次，因此不嵌入。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

查核日期：2026-10-10。

## 公開到什麼程度

依本站[課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，這份作業是 **A3（足以自學）**：題目、模板、完整起始碼都公開，而且不需要雲端算力。

拿不到的部分：

- 解答、autograder、Gradescope 繳交頁面
- Ed 討論區上的澄清與勘誤
- 助教的 office hours

另外要注意 HW1 PDF 自己的 AI 工具規定：為了讓學生真正理解模仿學習方法的實作，這份作業**禁止**用生成式模型幫忙寫程式。這比課程首頁的一般規定嚴格（首頁允許在解題過程中跟 AI 討論，但要求獨立寫下解答）。自學不受 honor code 約束，但這條規定點出了作業的用意：這三個演算法都不長，自己寫一遍才有收穫。

## 環境：一隻由 PD 控制器驅動的鳥

這不是原版 Flappy Bird。PDF 和起始碼的 README 描述如下：

- **動作**：一個介於 0 到 1 之間的數字，代表鳥的「目標高度」。環境內部用 PD 控制器把目標轉成推力，所以鳥有動量，policy 必須提前反應。
- **觀測**：4 維、都已正規化——離下一根水管的水平距離、gap1 的高度、gap2 的高度、鳥目前的高度。easy 模式下 gap2 等於 gap1。
- **easy 模式**：每根水管只有一個開口。
- **hard 模式**：單開口和雙開口的水管交替出現。
- **成功條件**：撐滿 1000 步。撞到水管或畫面邊界就結束。

示範資料來自 `expert.py` 裡的 `Expert`（唯讀）。它的 docstring 寫明了 hard 模式下的行為：離水管還遠時，先停在兩個開口的中間；靠近到一定距離（`commit_dist`，預設 0.18）時，**隨機**挑其中一個開口，之後一路瞄準它，直到下一根水管出現。動作還會經過 EMA 平滑。

建議開寫前先讀完 `expert.py`。後面三題的現象，都跟這個專家怎麼產生資料有關。

## Action chunking：預測 20 步，執行 10 步

PDF 規定 policy 一次輸出 `ACTION_CHUNK=20` 個未來的目標高度。rollout 時只執行前 `EXECUTE_STEPS=10` 個，然後重新查詢 policy。PDF 稱這種做法為 receding horizon control，並說明現在多數機器人學習的 policy 都這樣做，效果通常好很多。

L2 投影片也有同樣的內容，並列了 [Diffusion Policy](https://arxiv.org/abs/2303.04137v5)（課表上的指定閱讀）等提出 action chunking 的論文。

在程式碼裡，這表示 BC policy 的輸出維度是 20，而不是 1。`networks.py` 裡 `BCPolicy` 的預設參數就是 `state_dim=4, action_dim=20, hidden=256`。

## 要寫的程式：七個 TODO

所有 TODO 都會丟出 `NotImplementedError`。PDF 建議的實作順序如下：

| 順序 | 檔案::函式 | 所屬題目 | PDF 給的規格 |
|---|---|---|---|
| 1 | `networks.py::BCPolicy` | Problem 1 | 3 層 MLP：Linear → ReLU → Linear → ReLU → Linear → Sigmoid |
| 2 | `losses.py` 的 BC loss | Problem 1 | 預測動作與專家動作的 MSE |
| 3 | `networks.py::FlowMatchingSchedule.interpolate`、`.sample` | Problem 2 | 見下方 flow matching 段落 |
| 4 | `losses.py::flow_matching_loss` | Problem 2 | 提示：呼叫 `schedule.interpolate` |
| 5 | `dagger.py::DeterministicExpert.act` | Problem 3 | 跟 `Expert.act` 的 hard 模式邏輯相同，但要選一個能消除歧義的策略 |
| 6 | `dagger.py::rollout_episode` | Problem 3 | 記得 reset 環境、使用 policy 輸出的 action chunk，回傳狀態與動作配對 |
| 7 | `dagger.py::rollout_and_relabel` | Problem 3 | 用 `rollout_episode` 跑，再用 `DeterministicExpert` 重新標註 |

`main.py`、`visualization.py`、`flappy_bird_env.py`、`expert.py` 都標成唯讀。flow matching 用的網路（一個一維的 conditional U-Net，`ConditionalUnet1D`）也已經寫好，你只需要寫 schedule 和 loss。

## Problem 1：回歸式 BC（2 分）

先寫最簡單的版本：一個 MLP 直接把狀態映射成 20 步動作，用 MSE 對齊專家。

實驗與問題：

1. 在 easy 模式跑 `python main.py --method bc_reg --env easy`，回報 50 個評估回合的回合長度平均與標準差。
2. 在 hard 模式跑 `python main.py --method bc_reg --env hard`，同樣回報。這步不用寫新程式。
3. 用 2–3 句話解釋 MSE 回歸在 hard 模式的表現，以及為什麼會這樣。

第 3 題是整份作業的轉折點。回想上面那個專家在 hard 模式下怎麼選開口，再回想 L2 為什麼強調 policy 要能表達多峰分佈。這篇不替你寫那 2–3 句話，請用你自己跑出來的數字回答。

## Problem 2：Flow Matching（2 分）

### 直覺：學一個「從雜訊流向答案」的速度場

回歸式 BC 對每個狀態只給一個答案。flow matching 改學一個**生成模型**：給定狀態，它能從隨機雜訊出發，一步步把雜訊「推」成一個合理的 action chunk。

訓練時做的事情很單純：

1. 從資料集拿一個真的 action chunk，再抽一個同樣形狀的高斯雜訊。
2. 隨機抽一個時間點 τ（0 到 1 之間），在雜訊和真動作之間的直線上取一點。τ 越接近 1，這個點越像真動作。
3. 讓網路看著「狀態、這個中間點、τ」，預測該往哪個方向走。正確答案就是「真動作減雜訊」這個方向。

推論時從純雜訊出發，照網路預測的方向走 n 小步（起始碼預設 20 步，`NUM_DIFFUSION_ITERS = 20`），就得到一個 action chunk。因為每次起點的雜訊不同，同一個狀態可以生成不同的動作序列。

PDF 說明，flow matching 跟 diffusion 相似，但實作更簡單，效果通常相當或更好。

<details>
<summary>PDF 裡的公式（interpolation、loss、Euler 積分）</summary>

令 $a_t$ 是示範資料中的一個 action chunk，$a_{t,0} \sim \mathcal{N}(0, I)$ 是同形狀的雜訊。抽 $\tau \sim U(0,1)$，定義插值

$$a_{t,\tau} = \tau a_t + (1-\tau) a_{t,0}$$

訓練網路 $v_\theta$ 預測把 $a_{t,\tau}$ 推向 $a_t$ 的速度：

$$\mathcal{L}_{FM}(\theta) = \frac{1}{|\mathcal{D}|}\sum_{(s_t, a_t)\in\mathcal{D}} \left\| v_\theta(s_t, a_{t,\tau}, \tau) - (a_t - a_{t,0}) \right\|_2^2$$

推論時從 $a_{t,0} \sim \mathcal{N}(0,I)$ 出發，從 $\tau=0$ 到 $\tau=1$ 積分 $\frac{da_{t,\tau}}{d\tau} = v_\theta(s_t, a_{t,\tau}, \tau)$。最簡單的是 Euler 法：

$$a_{t,\tau+\frac{1}{n}} = a_{t,\tau} + \frac{1}{n} v_\theta(s_t, a_{t,\tau}, \tau)$$

重複 n 次得到 $a_{t,1}$，就是要執行的 action chunk。PDF 規定 `sample` 回傳前要 clamp 到 [0, 1]。起始碼的 docstring 把這個 schedule 稱為 conditional optimal-transport flow matching。

</details>

### 要實作與回答的

- `FlowMatchingSchedule.interpolate`：給定乾淨的 action chunk 和 τ，抽雜訊，回傳插值點與目標速度。
- `FlowMatchingSchedule.sample`：從高斯雜訊出發跑 `num_steps` 步 Euler 積分，結果 clamp 到 [0, 1]。
- `flow_matching_loss`：實作上面的 loss。
- 跑 `python main.py --method bc_flow --env hard`，回報平均與標準差，再用 2–3 句話解釋它在 hard 模式的表現。

想把 flow matching 的數學從頭弄懂，站上的 [MIT 6.S184 Flow Matching 講次導讀](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)從 ODE 講起。本作業只需要上面的直覺和折疊區的三條式子。

## Problem 3：DAgger（2 分）

Problem 3 換一條路：不換模型，還是用 Problem 1 的 MSE 回歸 policy，改從**資料**下手。

PDF 的描述：反覆讓目前的 policy 自己跑，收集它走到的狀態，再請專家替每個狀態重新標註動作，得到 $\mathcal{D}_{DAgger} = \{(s, \pi_{expert}(s)) \mid s \sim \mathcal{D}_\pi\}$。把它和原資料合併，用同樣的回歸目標重新訓練。這樣做能緩解專家和學到的 policy 之間的分佈偏移：policy 會走到示範資料裡沒有的狀態，DAgger 在這些狀態補上專家的標註。

這裡的專家不是原本的 `Expert`，而是你要寫的 `DeterministicExpert`。PDF 的要求是：邏輯跟 `Expert.act` 的 hard 模式相同，但要挑一個能消除前面題目裡那個歧義的策略，讓 MSE 回歸 policy 能成功。

實驗與問題：

1. 跑 `python main.py --method dagger --env hard`，用預設的 5 輪。畫學習曲線：x 軸是輪次，y 軸是平均回合長度加標準差誤差線，再把 Problem 1 的回歸表現畫成一條水平線。
2. **比較**（0.5 分）：用長條圖或表格比較 hard 模式下的回歸、flow matching、DAgger（最後一輪）。`python main.py --plot` 會用 `results/` 裡最新一次的結果畫圖。
3. 用 3–4 句話回答（0.5 分）：DAgger 為什麼會隨輪次進步？deterministic expert 扮演什麼角色？這種做法怎麼解決前面 MSE 回歸遇到的問題？

Problem 2 和 Problem 3 是兩種不同的解法：一個讓模型能表達多種答案，一個讓資料只剩一種答案。把兩者的結果放在同一張圖上，是這份作業最值得花時間想的地方。

## 繳交內容

- **書面**：一份 PDF 報告，含 Problem 1–3 的結果，交到 Gradescope 的「Homework 1 (Written Part)」。
- **程式**：一個 zip，交到「Homework 1 (Programming Part)」，裡面是 `hw1/` 資料夾（含填好 TODO 的 `networks.py`、`losses.py`、`expert.py`、`dagger.py`），加上四個結果檔 `bc_reg_easy.txt`、`bc_reg_hard.txt`、`bc_flow_hard.txt`、`dagger_hard.txt`。

## 起始碼裡的訓練設定

讀 `main.py` 可以看到實際跑的設定。這些數字會影響你的結果解讀，值得先知道：

| 項目 | 設定 |
|---|---|
| 專家示範 | 每個模式收集 500 個回合，切成 action chunk 訓練資料 |
| 回歸式 BC | 100 epoch、學習率 1e-5、batch size 2048 |
| Flow matching | 50 epoch、batch size 2048、推論積分 20 步 |
| BC 與 flow 的評估 | 50 個回合 |
| DAgger | 5 輪、每輪 rollout 30 個回合、每輪評估 50 個回合；最後再用 100 個回合評估一次存成結果檔 |

裝置自動選擇的順序是 CUDA → MPS（Apple Silicon）→ CPU。README 說 GPU 不是必要的，但能明顯加快訓練。`colab_instructions.md` 另外提供了 Colab（T4 GPU）的步驟。

## 自學時會碰到的檔案出入

這些是 PDF 和起始碼之間的小落差，不影響作業本身，但第一次讀會困惑：

- **BC loss 的名字**：PDF 寫 `bc_loss`，`losses.py` 和 README 裡的函式叫 `mse_loss`。照程式碼的名字寫。
- **題號**：程式碼註解把 flow matching loss 標成「Problem 3」、DAgger 的 TODO 標成「Problem 4」；PDF 只有三題，flow matching 是 Problem 2、DAgger 是 Problem 3。以 PDF 為準。
- **不存在的參照**：`networks.py` 和 `losses.py` 的註解叫你「對照 `DDPMSchedule`」和「對照 `diffusion_loss`」，但這一版的起始碼裡沒有這兩個東西。
- **requirements.txt**：README 的資料夾地圖列了 `requirements.txt`，但 zip 裡沒有。用 `installation.md` 的 pip 指令安裝即可（它列出 `torch gymnasium pygame matplotlib "imageio[ffmpeg]" "numpy==2.2.4"`）。
- **提示太多**：`main.py` 和 `dagger.py` 開頭的 docstring 直接寫出了 Problem 1 的現象和 `DeterministicExpert` 該怎麼設計。想自己推導的話，先讀 PDF 和 `expert.py`，最後再讀這兩份檔案的開頭。
- **錯字**：PDF 的 hard 模式描述把 double 拼成 doulbe。

## 今晚可以做的事

下載起始碼，照 `installation.md` 建好環境，先只寫 `BCPolicy` 和 BC loss，跑 easy 模式。它在 CPU 上也跑得動。拿到第一組數字之後，再切到 hard 模式跑同一個指令，看看結果差多少。後面兩題都從這個落差開始。

## 延伸閱讀

- [L2 模仿學習](/posts/ai/2026-09-30-cs224r-imitation-learning)：本作業的理論背景
- [Berkeley CS285：模仿學習與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)：另一門課從分佈偏移講 DAgger 的角度
- [MIT 6.S184 Flow Matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)：flow matching 的完整推導
- [CME295 Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms)：diffusion 系方法用在語言模型

**系列導覽**：上一篇 [L2：模仿學習](/posts/ai/2026-09-30-cs224r-imitation-learning)｜下一篇 [L3：Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。重查官方頁與公開播放清單，沒有對應的公開錄影，狀態維持不變。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程首頁與課表）](https://cs224r.stanford.edu/)
- [CS224R Spring 2026 Homework 1 PDF](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)
- [Homework 1 LaTeX 模板](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.tex)
- [hw1_starter_code.zip](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip)
- [L2 Imitation Learning 投影片（2026）](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)
- [Chi et al. 2024：Diffusion Policy: Visuomotor Policy Learning via Action Diffusion](https://arxiv.org/abs/2303.04137v5)
- [Zhao et al. 2023：Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://arxiv.org/abs/2304.13705)
