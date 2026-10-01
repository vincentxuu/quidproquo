---
title: "CS234 作業三：Hopper 上的 reward engineering、RLHF、DPO 與 best arm identification"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, homework, rlhf, dpo]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 12
tldr: "CS234 Winter 2026 作業三共五題、94 分。前三題都在 MuJoCo Hopper 上：先用手寫 reward 跑 PPO（13），再從 1 萬筆偏好對學 reward model 後跑 PPO（19＋8），最後用 SFT＋DPO 直接從偏好學策略、完全不碰環境（6＋19）。第四題換成純理論：用 Hoeffding 與 union bound 算出找 ε-最佳臂要幾次試驗（25），這題要等讀完下一篇 bandit 再做。第五題是新聞推薦的 stated vs revealed preference（4）。"
description: "Stanford CS234（Winter 2026）作業三導讀：Q1 Hopper reward engineering 與 early termination、Q2 Bradley-Terry 偏好學習與 run_rlhf.py、Q3 SFT／DPO 與 receding horizon control、Q4 best arm identification 的樣本數界、Q5 stated vs revealed preferences。附配分、Google Drive 起始碼與資料檔的實際內容、套件釘版與繳交格式。只講題目在練什麼，不提供解答。"
draft: false
glossary:
  - term: "Bradley-Terry 模型"
    aliases: ["Bradley-Terry", "BT model"]
    definition: "把「A 比 B 好」的機率寫成 exp(r_A) / (exp(r_A) + exp(r_B)) 的成對比較模型，也就是兩者分數差的 sigmoid。RLHF 用它把偏好標籤變成可以用交叉熵訓練的 reward model。"
    context: "作業三 Q2 用整段軌跡的 reward 總和當分數。"
  - term: "receding horizon control"
    aliases: ["RHC", "model predictive control", "MPC"]
    definition: "每一步都算出一段多步動作計畫，只執行第一個動作，下一步再重新規劃。跟一次把整段動作執行完的 open-loop control 相比，它能對擾動與累積誤差做出反應。"
    context: "作業三 Q3 用它把原本為 bandit 設計的 DPO 搬到多步的 Hopper 控制。"
  - term: "best arm identification"
    aliases: ["最佳臂辨識", "pure exploration"]
    definition: "bandit 的一種目標：不在乎過程中累積多少 reward，只想在有限試驗後，以高機率找出最好（或 ε 內接近最好）的那隻手臂。"
    context: "作業三 Q4 要你算出「每隻手臂拉 n_e 次再選平均最高者」需要多少總樣本。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits-en)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 的作業與投影片；公開錄影是 [Spring 2024 版](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)。所有事實都在 2026-09-30 打開 [作業頁](https://web.stanford.edu/class/cs234/assignments.html)、[A3 題目 PDF](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf)（8 頁）與作業頁連到的 [Google Drive 起始碼](https://drive.google.com/file/d/18HwwLiMIN9XSdK7QXqQjGyhyb_86Iz_Y/view)（下載後解壓逐檔看過）核對。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：題目、LaTeX 範本、起始碼與偏好資料都公開；拿不到的是 Gradescope 自動評分與官方解答。

**系列位置**：上一篇 [從人類偏好學：Bradley-Terry、RLHF pipeline、DPO](/posts/ai/2026-09-30-cs234-rlhf-dpo)｜下一篇 [資料效率 I：bandit、regret、UCB](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

上一篇講完 L8：Bradley-Terry 怎麼把「A 比 B 好」變成 reward model，以及 DPO 怎麼跳過 reward model、直接用偏好更新策略。作業三把這兩條路放到同一個機器人任務上比：MuJoCo 的 Hopper，一隻要學會往前跳的單腳機器人。

題目 PDF 的開場講得很直白：RLHF 是讓 ChatGPT 表現出色的關鍵工具之一，但這個概念更早就出現在 [Christiano et al.〈Deep reinforcement learning from human preferences〉](https://arxiv.org/abs/1706.03741)。作業要你在機器人任務上親手做一次 RLHF，再跟 DPO 與 supervised learning（behavior cloning）比較。

本文只講題目結構、配分、起始碼長什麼樣，以及做題前該知道的事。**不提供任何題目的解答。**

> **先說一個順序問題**：第四題 best arm identification 用的是 bandit 的概念，課堂上要到 L9 才教，本系列放在下一篇 [order 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)。建議 Q1–Q3、Q5 先做，Q4 等讀完下一篇再回來。

## 時程、繳交與配分

依 [2026 課表](https://web.stanford.edu/class/cs234/)，作業三在 Week 5（Feb 2–8，期中考那週）發下，Week 7 的 **2 月 20 日下午 6 點**截止，最多可用 2 個 late day。題目 PDF 抬頭寫的是「Feb 20, 2025」，跟 Winter 2026 的課表年份對不上，應該是沿用舊版抬頭；日期以作業頁為準。

成績比重分兩套：校內生作業三佔 7%，校外（沒有 tutorials）佔 15%。

Gradescope 上要交三樣東西：

1. 寫作部分的 PDF
2. LaTeX 的 zip，解開後直接是 `main.tex` 與 `img/`，裡面要有 `hopper.png`、`hopper_rlhf.png`、`hopper_dpo.png` 三張圖
3. 程式的 zip，用起始碼裡的 `collect_submission.sh` 產生，只打包 `run_dpo.py` 與 `run_rlhf.py`

| 題目 | 主題 | 配分 |
|---|---|---|
| Q1 | Reward engineering | 13（writeup） |
| Q2 | Learning from preferences | 19（writeup）＋8（coding） |
| Q3 | Direct preference optimization | 6（writeup）＋19（coding） |
| Q4 | Best Arm Identification in Multi-armed Bandit | 25（writeup） |
| Q5 | Stated vs. Revealed Preferences | 4（writeup） |

合計 94 分。寫作佔 67 分，程式只佔 27 分；但程式要跑的時間遠比寫作長，下一節會講。

## 起始碼與資料：先看清楚手上有什麼

作業頁的「Starter code can be downloaded here」連到一個公開的 Google Drive 檔案。解壓後是 `starter_code/` 資料夾，檔案日期是 2026-02-13，共 15 個項目：

| 檔案 | 用途 |
|---|---|
| `ppo_hopper.py` | Q1：用 [stable-baselines3](https://stable-baselines3.readthedocs.io/) 的 PPO 在 `Hopper-v4` 上訓練，`--early-termination` 切換是否在不健康狀態結束 episode |
| `run_rlhf.py` | Q2：`RewardModel` 類別有四處 TODO（建網路、`forward`、`compute_reward`、`update`），其餘流程已寫好 |
| `run_dpo.py` | Q3：`ActionSequenceModel`、`SFT.update`、`DPO.update` 是 TODO |
| `data.py` | 讀偏好資料、只保留嚴格偏好（去掉平手）的選項 |
| `render.py`、`plot.py`、`util.py` | 算圖、畫學習曲線、共用工具 |
| `data/prefs-hopper.npz` | 主要偏好資料，約 100 MB |
| `data/long-prefs-hopper.npz` | 給你用眼睛看的長片段偏好資料 |
| `data/pretrain.pt` | Q3 的預訓練 SFT 權重 |

兩份偏好資料的形狀，我用 numpy 打開看過：

| 檔案 | 偏好對數 | 每段步數 | 觀測維度 | 動作維度 |
|---|---|---|---|---|
| `prefs-hopper.npz` | 10,000 | 50 | 11 | 3 |
| `long-prefs-hopper.npz` | 10 | 200 | 11 | 3 |

每筆資料有 `obs_1`、`obs_2`、`action_1`、`action_2` 與 `label`。題目說明標籤的意思：0 代表第一段比較好，1 代表第二段，0.5 代表兩段一樣。

環境設定照 README 用 `uv` 建 Python 3.10.6 的虛擬環境。`requirements.txt` 釘了三個關鍵版本：`gymnasium[mujoco]==0.29.1`、`stable-baselines3==2.3.0`、`torch==2.6.0`。不要自己升版，`Hopper-v4` 這個環境名稱跟 gymnasium 版本綁在一起。

有一個缺口：題目 Q3 的註腳說課程準備了一份 notebook 示範 `torch.distributions.Independent` 的行為，但 Drive 上的 zip 裡沒有任何 `.ipynb`。校外讀者得自己查 [PyTorch 文件](https://docs.pytorch.org/docs/stable/distributions.html#independent)。

## Q1：手寫 reward 跑 PPO

這題在問一件事：你在作業二直接拿到 reward function，那個 reward 是誰、怎麼寫出來的？寫 reward 的過程叫 reward engineering，而它很難。

**寫作題（a）–（c）**：

- （a）為什麼 reward engineering 通常很難？寫錯 reward 有什麼風險？舉一個看起來合理、卻會帶來意外後果的 reward。
- （b）讀 [Hopper 環境說明](https://gymnasium.farama.org/environments/mujoco/hopper/)，用自己的話講目標，以及 reward 的每一項怎麼推動代理人達成目標。
- （c）預設情況下，代理人離開「healthy」狀態集合時 episode 就結束。healthy 是什麼意思？這種 early termination 有什麼優點與缺點？

（a）跟 [作業一 Q2 的 reward hacking](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) 是同一個問題換個場景：從交通匯流換到機器人。

**程式題（d）–（f）**：

- （d）用 `ppo_hopper.py` 跑 3 個 seed，有與沒有 early termination 各一組，共 6 次訓練。題目警告每個 seed 最多要跑 90 分鐘，要早點開始。畫出兩組的 episodic return 曲線，比較訓練 epoch 與 wall time，並評論平均 return 的 standard error 高不高、怎樣才能更準地估出 PPO 在 Hopper 上的平均表現。
- （e）挑一個訓練好的策略算出評估影片：代理人完成任務了嗎？做法是你預期的，還是出乎意料？
- （f）再算另一個策略的影片，比較兩者，你偏好哪一個？

起始碼的預設是 100 萬步，每 1 萬步評估一次、每次 10 個 episode。6 次訓練照最壞情況算是 9 小時；如果只有一台筆電，這一題就決定了整份作業的時程。

（e）（f）看起來像湊字數的觀察題，其實是在為 Q2 鋪路：你剛剛用眼睛比較了兩段 rollout 並說出偏好，這正是 RLHF 要人類標註者做的事。

## Q2：從偏好學 reward model

這一題照 Christiano et al. 的框架：不手寫 reward，改從「兩段軌跡哪一段比較好」的標籤學出 reward，再拿它跑 PPO。

題目先定義偏好：若一段軌跡每一步的 reward 加總比另一段大，它就比較好。再用 Bradley-Terry 模型把「第一段比較好」的機率寫成兩段 reward 總和的 softmax：

```text
P̂[σ¹ ≻ σ²] = exp(Σ r̂(o¹ₜ, a¹ₜ)) / ( exp(Σ r̂(o¹ₜ, a¹ₜ)) + exp(Σ r̂(o²ₜ, a²ₜ)) )

L(r̂) = − Σ over (σ¹, σ², μ) in D of [ μ log P̂[σ¹ ≻ σ²] + (1 − μ) log(1 − P̂[σ¹ ≻ σ²]) ]
```

也就是說，學 reward 變成一個分類問題：用交叉熵去擬合人類標籤 μ。

**寫作題（a）（b）**：把 r̂ 用神經網路參數化成 r̂_θ，推導 log P̂ 與損失 L 對 θ 的梯度，寫成每一步 ∇_θ r̂_θ 的函數。題目給了提示：把 P̂ 改寫成 sigmoid(z_θ)。

**程式與觀察題（c）–（g）**：

- （c）用 `render.py --dataset data/long-prefs-hopper.npz --idx IDX` 看 5 組長片段。每段 200 步，算出來是 8 秒的影片。記下資料集標了哪一段比較好，問自己同不同意；估計你跟標註者的一致率，並判斷你敢不敢信任從這份資料學出來的 reward。
- （d）實作 `run_rlhf.py` 裡的 `RewardModel`。
- （e）用學到的 reward 跑 PPO，3 個 seed，畫出**原始 reward 與學到的 reward**下的平均 return，問兩者是否相關。
- （f）偏好對夠多、而且真的照 Bradley-Terry 生成時，能不能還原出原本的 reward function？
- （g）算出訓練後的行為影片，跟 Q1 用真實 reward 訓練的策略比，也跟資料集裡看到的示範比。

讀起始碼可以看出幾個設計：reward model 預設訓練 10 萬步、batch 64；輸出範圍預設夾在 0 到 1 之間；訓練好之後用 `CustomRewardEnv` 把 Hopper 的 reward 換掉，再交給同一個 stable-baselines3 PPO。評估時 callback 同時記錄 `original_returns` 與 `learned_returns`，（e）的兩條曲線就是從這裡來。

題目的註腳還點出一個近年的研究方向：人類對部分軌跡給的成對回饋，可能更貼近 regret，學出來的東西比較像 advantage function 而不是 reward，見 [Knox et al. AAAI 2024](https://openreview.net/forum?id=euZXhbTmQ7)。（f）想得深一點，會碰到同一個問題。

## Q3：DPO，不學 reward model

Q2 的路線是「偏好 → reward model → PPO」。Q3 換一條路：手上有預訓練模型與偏好資料時，直接用偏好更新策略，完全跳過 reward model。題目給的 DPO 損失是：

```text
L_DPO(π_θ; π_ref) = − E_(x, y_w, y_l) ~ D [ log σ( β log(π_θ(y_w|x) / π_ref(y_w|x)) − β log(π_θ(y_l|x) / π_ref(y_l|x)) ) ]
```

x 是情境（狀態），y_w 是被偏好的動作（LLM 裡就是回應），y_l 是另一個。

問題在於 DPO 原本是為 bandit 設計的：一個情境、一次回應。Hopper 是多步控制。題目的處理方式值得先想清楚：

- 給定一個觀測，模型輸出**接下來一段動作序列**的分布，而不是單一動作。註腳解釋了原因：50 個動作只有 2 秒影片，要人類比較單一動作的效果幾乎不可能。
- 如果動作序列跟整個 horizon 一樣長，就是 open-loop control；但它對擾動與累積誤差沒有反應。
- 所以作業用 **receding horizon control**（也叫 MPC）：每一步算出一段計畫，只執行第一個動作，下一步重算。

題目也提到，[Contrastive Preference Learning（CPL）](https://arxiv.org/abs/2310.13639)是直接處理多步偏好學習的後續方法，而且 CPL 證明了 DPO 是它在 bandit 設定下的特例。作業選 DPO，是因為它在 LLM 訓練裡用得廣，設定又夠簡單，能看出 RLHF 與直接從偏好學策略的差別。

**程式題（a）–（c）**，只改 `run_dpo.py`：

- （a）實作 `ActionSequenceModel`：每個動作用一個多變量常態分布，平均與標準差由神經網路預測。
- （b）實作 `SFT.update`：在偏好資料上最大化**被偏好動作**的 log 機率，也就是 behavior cloning。
- （c）實作 `DPO.update`：最小化上面的 DPO 損失。

**實驗與寫作題（d）（e）**：SFT 與 DPO 各跑 3 個 seed，畫 return 曲線，跟 Q2 的 RLHF 比，評論兩種方法在這個例子上的優缺點；再挑最好的 DPO run，並排算出 SFT（左）與 DPO（右）的 10 個 episode 影片。

讀 `main()` 能看到實驗的幾個固定條件：

- 兩種演算法都從 `data/pretrain.pt` 載入的 SFT 權重出發；DPO 用這個 SFT 模型初始化，並把它當 reference policy。
- DPO 假設偏好是嚴格的，所以載入資料時丟掉 0.5 的平手對。
- 預設 `beta=0.1`、`lr=1e-5`，SFT 與 DPO 各 2 萬步，每 2,000 步評估一次、每次 100 個 episode。
- 環境用 `terminate_when_unhealthy=False`，跟 Q1 的預設不同。

題目自己先打了預防針：兩個策略的影片可能都不好看，因為它們只用少量離線資料訓練，**從頭到尾沒跟環境互動過**。這正是 Q3 跟 Q2 最根本的差別，寫（d）的優缺點時可以從這裡切入。

## Q4：best arm identification

前三題都在 Hopper 上，Q4 突然換成純理論。情境是：在好幾種實驗藥物或網站設計裡，盡快找出最好的那一個，之後拿來用。這叫 pure exploration，不在乎過程中損失多少 reward。

題目把它寫成 reward 落在 [0, 1] 的 multi-armed bandit，並提醒 bandit 就是只有一個狀態、horizon 為 1 的有限期 MDP，所以一共只有 |A| 個確定性策略。提出的演算法極簡單：**每隻手臂拉 n_e 次，回傳平均 reward 最高的那一隻**。

題目給了 Hoeffding 不等式：n 個落在 [0, 1] 的 i.i.d. 變數，樣本平均偏離期望值超過 sqrt(log(2/δ) / 2n) 的機率小於 δ。三小題：

- （a）從 Hoeffding 出發，證明「存在某隻手臂的估計偏離超過同一個寬度」的機率小於 |A|δ。能推出更緊的界也可以，但要說明為什麼更緊。
- （b）要以至少 1 − δ′ 的機率回傳 ε-最佳的手臂，每隻手臂需要估多準？總共需要多少樣本？答案寫成手臂數、精度 ε 與失敗機率 δ′ 的函數。
- （c）選做、不計分：改用中央極限定理假設平均值是常態分布，對兩隻手臂的情況重做一次，比較樣本數，並討論在實驗很貴的真實情境下，你會選哪一種假設。

（a）考的是 union bound，（b）考的是「估計誤差多小，才保證選出來的手臂不會差超過 ε」。這兩個工具在下一篇的 UCB 推導裡會再出現一次，而且更精細：[order 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb) 會講到 L9 的 sub-Gaussian 信賴界與 union bound，以及 L10 依 [Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) 第 7.1 節重寫的 UCB regret 證明。讀完再做 Q4，會順很多。

跟 UCB 對照也有助於理解題目：UCB 在乎**過程中**累積的 regret，Q4 只在乎**最後**選對。同一組集中不等式，換一個目標，就得到不同的演算法與界。

## Q5：stated vs. revealed preferences

最後 4 分是一個新聞推薦 app 的情境。app 有兩類使用者資料：使用者自己填的興趣主題與偏好格式，以及互動資料（在哪篇文章停留、停多久、分享給誰）。另外還有地點、瀏覽器、使用頻率、付費與訂閱可能性等 metadata。

四個小問：哪些資料是 stated preference、哪些是 revealed preference；公司可能挑什麼 reward function；以 stated 或 revealed preference 為優先各有什麼倫理考量；怎麼加入探索，測試使用者的偏好會不會隨時間改變。

這題跟 L10 後半的價值對齊客座直接相關，那一講把「對齊使用者意圖、顯示偏好、最佳利益」拆成三種不同的目標。本系列放在 [order 17 價值對齊](/posts/ai/2026-09-30-cs234-value-alignment-ethics)。第 4 小問的「加入探索」則是 order 13–15 的主題。

## 自學怎麼做

1. **先開跑 Q1 的 6 次訓練。** 這是整份作業最花時間的部分，趁它在背景跑的時候寫 Q1 (a)–(c) 與 Q2 (a)(b) 的推導。
2. **Q2 (c) 用眼睛看完 5 組長片段再寫程式。** 你怎麼評估標註品質，會影響你怎麼解讀 (e) 的曲線。
3. **Q2 的梯度推導先做，再寫 `RewardModel.update`。** 推導出來的式子就是你 loss 的樣子；寫完可以用一個手算的小例子檢查 loss 值。
4. **Q3 先確定 `ActionSequenceModel` 輸出的分布形狀對。** log 機率要在動作序列的每一步與每一維上加總，`torch.distributions.Independent` 管的就是這件事。
5. **Q4 等讀完 [order 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)。** 沒有 autograder，推導只能自己驗：把最後的樣本數公式代入幾組數字，看它隨手臂數與 ε 怎麼長。

今晚可以做的一件事：下載 Drive 上的 zip，建好環境，跑一次 `render.py --dataset data/long-prefs-hopper.npz`，看一組 8 秒的長片段，先不看標籤，自己判斷哪一段比較好，再去對答案。這一步不用 GPU，卻能讓你親身體會 RLHF 的資料是怎麼來的，以及它有多吵。

## 延伸閱讀

- 同一套 RLHF／DPO 在 CS224R 的講法（深度 RL 與 LLM 視角）：[CS224R L9：RLHF、DPO 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)
- SFT 與 RLHF 在 LLM 訓練管線裡的位置：[CS336 Lecture 15：SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)
- 探索與開放問題的另一條路線：[Berkeley CS285 L19–25：探索、RL 理論與開放問題](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表（A3 在 Week 5 發下、Week 7 截止）、兩套成績比重
- [CS234 作業頁](https://web.stanford.edu/class/cs234/assignments.html) — A3 題目、LaTeX 範本、起始碼連結、Feb 20 6 pm 截止與 2 個 late day
- [CS234 Winter 2026 Assignment 3 題目 PDF](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf) — 五題敘述、配分、指令與繳交格式
- [A3 起始碼（Google Drive）](https://drive.google.com/file/d/18HwwLiMIN9XSdK7QXqQjGyhyb_86Iz_Y/view) — `ppo_hopper.py`、`run_rlhf.py`、`run_dpo.py`、`data/prefs-hopper.npz` 等 15 個項目
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — L8、L9 投影片與「Data Efficient RL」單元
- [CS234 Lecture 9 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture9post.pdf) — 開頭的 RLHF vs DPO 小測，與 Q4 需要的 bandit 基礎
- [Christiano et al., Deep Reinforcement Learning from Human Preferences（NeurIPS 2017）](https://arxiv.org/abs/1706.03741) — Q2 的框架來源（題目引用）
- [Knox et al., Learning Optimal Advantage from Preferences and Mistaking It for Reward（AAAI 2024）](https://openreview.net/forum?id=euZXhbTmQ7) — Q2 註腳引用
- [Hejna et al., Contrastive Preference Learning（arXiv:2310.13639）](https://arxiv.org/abs/2310.13639) — Q3 提到的 CPL
- [Gymnasium Hopper 環境說明](https://gymnasium.farama.org/environments/mujoco/hopper/) — Q1 (b)(c) 要讀的環境文件
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — 講義頁列出的補充讀物，第 7.1 節
- [stable-baselines3 文件](https://stable-baselines3.readthedocs.io/) — 起始碼用的 PPO 實作
- [PyTorch distributions：Independent](https://docs.pytorch.org/docs/stable/distributions.html#independent) — Q3 註腳提到、但 zip 裡沒附的 notebook 主題
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — 公開錄影，第 9 支是 DPO 客座
