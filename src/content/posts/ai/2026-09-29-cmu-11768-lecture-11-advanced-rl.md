---
title: "CMU 11-768 第 11 講：進階 RL 演算法——credit assignment、穩定更新、reward hacking 與蒸餾"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, reinforcement-learning, ppo, grpo, post-training]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 12
tldr: "Graham Neubig 用一個修 bug 的 coding 任務，把第 9 講的 policy gradient 推到實戰：用 critic、GAE 或 PRM 把功勞分給個別回合，用 importance ratio 與 clipping 處理非同步 RL 的過期資料，並把 PPO、GRPO、CISPO、GSPO、DAPO 收成一張對照表；最大的篇幅留給獎勵本身——verifier 誤判、reward hacking 與探索崩塌，最後以 on-policy 蒸餾收尾。"
description: "導讀 CMU 11-768 AI Agents 第 11 講 Advanced RL Algorithms（依投影片撰寫）：reward-to-go、價值函數與 critic、TD error 與 GAE、PRM、同步與非同步 RL、importance sampling 與長軌跡的 ratio 爆炸、PPO／CISPO 的 clipping、KL 與 entropy 項、六種演算法對照表、verifier 的偽陰性與偽陽性、coding agent 的 reward hacking、DAPO dynamic sampling、輔助獎勵的風險，以及 on-policy distillation 與 OPSD。"
draft: false
glossary:
  - term: "importance sampling"
    aliases: ["importance ratio", "重要性抽樣", "ρ"]
    definition: "資料是用舊 policy μ 抽的，卻要估新 policy π_θ 的期望值時，把每個樣本乘上 π_θ(a|h) / μ(a|h) 來修正。"
    context: "非同步 RL 裡，rollout 完成時 learner 可能已經更新過，這個比值就是修正過期資料的工具。"
  - term: "GAE"
    aliases: ["generalized advantage estimation", "廣義優勢估計"]
    definition: "用 critic 算出每一步的 TD error，再往後以 λ 衰減加權加總，估計某個動作的 advantage。"
    context: "PPO 用 GAE 從 critic 得到逐步的 advantage，這是它跟 GRPO 最大的差別。"
  - term: "reward hacking"
    aliases: ["獎勵駭客", "specification gaming"]
    definition: "模型找到讓獎勵變高、卻沒有真正完成任務的捷徑，例如讓測試通過但沒有修好 bug。"
    context: "本講把它放在 verifier 偽陽性的脈絡下談：獎勵檢查不到的地方，訓練就會去鑽。"
  - term: "on-policy distillation"
    aliases: ["OPD", "on-policy 蒸餾"]
    definition: "讓學生模型自己跑出歷史，再請老師模型在這些歷史上給出下一步的機率分布，學生去貼近它。"
    context: "本講最後一段：它讓學生在自己會犯錯的地方拿到老師的密集指導。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl-en)

**影片狀態：待確認：尚未核對到對應錄影。** [影片來源與說明](#課程影片來源)

> **本篇依投影片撰寫，影片上架後補充。** 截至 2026-09-29，[官方課表](https://www.cmu-agents.com/)上第 11 講只有[投影片](https://www.cmu-agents.com/slides/lecture-11-rl-advanced.pdf)，沒有錄影。下文的說明與推論都只根據投影片內容，沒有講者口述；投影片沒說的，我會標成我的解讀。

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 是 Daniel Fried 與 Graham Neubig 在 2026 秋季開的 LLM agent 研究所課。第 11 講（9/29）是訓練模組三講 RL 的第二講，由 Neubig 主講，副標題是「簡單配方失效時，怎麼從軌跡學習」。

第 9 講 Fried 用猜數字把 REINFORCE、baseline、GRPO 推了一遍，但刻意把三件事留到這一講：importance ratio、clipping、參考模型的 KL 項（中間的第 10 講是 deep research agents 的客座課，跟 RL 無關）。投影片開頭的路線圖把這一講放在中間：前面的 RL 基礎是「reward → advantage → policy gradient」，這一講要處理四件事——**有用的回饋、少一點等待、穩定的更新、可靠的獎勵**，最後加上「向老師學」；下一講（第 12 講，助教 Apurva Gandhi）才談記憶體、平行化與大規模執行。

這一講塞了五個以上的演算法，還有 reward hacking 和蒸餾。我的處理方式是：演算法收進一張對照表，reward hacking 單獨成一節，蒸餾放折疊區。

## 課程影片來源

本篇依投影片撰寫。已查官方課表、講師頻道與本文講次標題搜尋，仍未取得可核對的直接錄影；官方課表抽取只取得後半段，講師頻道抽取未提供完整影片清單。因此本講錄影狀態尚待確認，不能判定沒有影片。

官方來源：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

查核日期：2026-10-10。

## 範例：修一個 retry 設定的 bug

這一講換了一個更像 agent 的範例，沿用第 6 講 coding agents 的教學題目（投影片附的原始題目連結指向 `cmu-agents/lecture-planning` repo，2026-09-29 查詢時未公開、回 404，題目內容以投影片為準）：

```python
def retry_count(config):
    return config.get("retries") or 3
```

任務是：`retries=0` 應該關閉重試，同時保留「沒設定」、`None`、正數的原本行為。verifier 有四個檢查：缺值 → 3、`None` → 3、`0` → 0、`2` → 2。原本的程式碼錯在 `0` 會被 `or` 當成 false，於是回傳 3。

一條成功的軌跡長這樣：讀程式碼 → 改成 `get(..., 3)`（修好了 0，但 `None` 會直接回傳 `None`）→ 跑四個測試，`None` 那個失敗 → 改成明確處理 `None`，四個全過。投影片想強調的是：**agent 中途可以做錯一步，最後仍然交出正確的 patch。**

獎勵是結果獎勵：最終程式碼通過全部檢查得 1，否則 0。套第 9 講的二元 REINFORCE，成功的軌跡會把裡面每個取樣 token 的機率一起往上推，失敗的軌跡什麼都不貢獻。

## 一、更有用的回饋：把功勞分給個別回合

### 群組比較還不夠

GRPO 的群組 baseline 會拿同一題的其他軌跡來比。投影片的例子是四條軌跡，最終 patch 分別是「明確處理 None」（1 分）、「用 get(..., 3)」、「永遠回傳 0」、「保留原本的錯誤程式」（都是 0 分）。組平均 0.25，所以成功那條權重 +0.75，其餘 −0.25。

問題在於：**同一條軌跡裡每個回合拿到的權重都一樣。**成功的軌跡 A 裡可能有一步做錯，失敗的軌跡 B 裡也可能有一步很有幫助。我們想知道的是回合層級的功勞。

### reward-to-go 與價值函數

只有最終獎勵時，在某一步之後剩下的獎勵總和（reward-to-go）在成功軌跡上每一步都是 1、在失敗軌跡上每一步都是 0，還是分不出哪一步有用。

解法是問另一個問題：**從這個歷史出發，平均能拿到多少分？**投影片的例子是從軌跡 B 的第三步歷史 h₃ 往下接續十次，其中三次成功，平均 0.3。這個「對所有可能接續取平均」的量，就是價值函數 V(h₃)。

### 訓練一個 critic

實務上不可能每一步都接續十次，所以訓練一個 critic V_φ(h) 來預測 reward-to-go，loss 是平方誤差。拿剛剛十個結果（三個 1、七個 0）來算：預測 0.6 的平均平方誤差是 0.30，預測 0.3（也就是平均值）是 0.21，最小。

critic 有兩種放法：

| | 獨立的價值網路 | 掛在 policy 上的 value head |
|---|---|---|
| 結構 | 自己的主體與輸出層 | 讀 policy 主體的隱藏表示，接一層線性 head |
| value loss 訓練到 | 整個價值網路 | 只有 head（對主體 stop-gradient） |
| 例子 | [InstructGPT](https://arxiv.org/abs/2203.02155) | [MIXER](https://michaelauli.github.io/papers/iclr2016_mixer.pdf)（Ranzato et al.） |

stop-gradient 讓 value loss 不會改到 policy 主體，policy loss 仍然照常訓練它。

### TD error 與 GAE

有了 critic，就能看每一步前後的價值變化。軌跡 B 最後三步：

| 動作 | 之前的價值 | 之後的價值 | TD error δ |
|---|---|---|---|
| a₃ | 0.3 | 0.6 | +0.3 |
| a₄ | 0.6 | 0.4 | −0.2 |
| a₅ | 0.4 | 0（軌跡結束） | −0.4 |

a₃ 讓局面變好，a₄、a₅ 讓局面變差。雖然整條軌跡失敗，a₃ 的 δ 是正的——這正是群組比較做不到的事。

[GAE](https://arxiv.org/abs/1506.02438)（generalized advantage estimation，Schulman et al.）的想法是：一個動作的 advantage 不只看自己那一步的 δ，也把後面的 δ 以 λ 衰減後加進來。取 λ = 0.5：Â₃ = 0.3 + 0.5 × (−0.2) + 0.25 × (−0.4) = 0.1。λ 越接近 0 越相信 critic，越接近 1 越接近直接用實際的 reward-to-go（這句是我的補充，投影片只示範了 λ = 0.5）。

<details>
<summary>機制：value loss、TD error 與 GAE 的遞迴</summary>

critic 的平方誤差 loss（對抽到的 rollout 歷史取平均）：

$$L_V(\phi) = \mathbb{E}_t\big[(V_\phi(h_t) - R_t)^2\big]$$

TD error（範例不做折扣，γ = 1）：

$$\delta_t = r_{t+1} + V_\phi(h_{t+1}) - V_\phi(h_t)$$

GAE 由後往前遞迴，最後一步之後沒有 δ：

$$\hat A_t = \delta_t + \lambda \hat A_{t+1}$$

</details>

### 另一條路：PRM

不訓練 critic 也可以：[Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)（Lightman et al.）用人工標註每一步是否正確，訓練 process reward model（PRM）當作價值的替代品。投影片的例子是一道代數題，模型從 5x = 6x − 14 推出 x = 7，標註者把這一步標成錯誤（正解是 14）。

## 二、少一點等待：同步與非同步 RL

同步 RL 裡，一個 batch 的所有軌跡都要跑完才能更新 policy。agent 的軌跡長短差很多，先跑完的 GPU 只能乾等。非同步 RL 讓 rollout worker 持續產生軌跡，learner 拿已完成的軌跡去更新，兩者重疊進行。投影片引用的是 [AReaL](https://arxiv.org/abs/2505.24298)（Fu et al.，NeurIPS 2025）。投影片把它標成 2026 年，對應的是 arXiv 上 2026 年 3 月的第 5 版修訂；論文 v1 是 2025 年 5 月上傳、發表於 NeurIPS 2025。

代價是：**有些完成的軌跡來自比較舊的 policy。**這就把問題帶進下一段。

## 三、穩定的更新：過期資料、ratio 與 clipping

### 過期的 rollout 與 importance sampling

rollout 用的是當時的 policy μ，learner 現在是 π_θ。投影片的例子在同一個歷史下：

| 動作 | μ（rollout 時） | π_θ（現在） | 權重 π_θ / μ |
|---|---|---|---|
| 明確檢查 None | 0.40 | 0.70 | 1.75 |
| 用 get(..., 3) | 0.40 | 0.20 | 0.50 |
| 保留原程式 | 0.20 | 0.10 | 0.50 |

importance sampling 把每個樣本乘上這個比值，讓用 μ 抽的資料能估 π_θ 下的期望值。

### 長軌跡會把 ratio 放大

整條軌跡的比值是每一步比值的連乘。每一步只差一點點，長軌跡就會爆掉：**1.05 的 100 次方約是 132。**結果是少數樣本主宰整個更新，變異數很高。[CTPO](https://arxiv.org/abs/2605.07331)（Zhang et al.）的圖顯示，在會用工具的數學 rollout 裡，累積比值在回應越後面的位置分散得越大。

另一個細節：前面的動作會改變後面的歷史。假設 μ 有 40% 機率加上 None 檢查、π_θ 只有 10%，那麼即使下一步「跑測試」在兩個 policy 下都是 50%（比值 1），現在的 policy 走到這個歷史的機率只剩原來的 0.25 倍。只看當下這一步的比值會漏掉這件事。

### 各演算法把哪些動作放進權重

| 方法 | 權重用到的動作 |
|---|---|
| PPO／GRPO | 只有當下這一個 |
| CTPO | 從頭到當下 |
| 完整 ratio | 全部 |
| GSPO | 全部，再做長度正規化 |

DAPO 和 CISPO 也只用當下這一個動作的比值，差別在 clipping 規則。

### clipping：限制一次更新走多遠

過期的 rollout 可能拿到很大的權重，讓少數樣本主宰更新。clipping 把超出範圍 [ℓ, u] 的比值換成最近的邊界，例如 [0.8, 1.2]。

[PPO](https://arxiv.org/abs/1707.06347) 和 [CISPO](https://arxiv.org/abs/2506.13585)（MiniMax-M1）都用 clip，但用法不同：

- **PPO** 把 clip 過和沒 clip 的項取最小值。advantage 為正時，比值超過 1 + ε 就不再多給獎勵；advantage 為負時，比值低於 1 − ε 就不再多給懲罰。
- **CISPO** 把 clip 過的比值當成固定權重（stop-gradient），乘在 advantage 與 log 機率上。

<details>
<summary>機制：PPO 與 CISPO 的目標函數</summary>

單一 token 的比值與 clip：

$$\rho_t = \frac{\pi_\theta(u_t \mid u_{<t})}{\mu(u_t \mid u_{<t})}, \qquad c_t = \operatorname{clip}(\rho_t, \ell, u)$$

PPO（最大化）：

$$J_{\text{PPO}}(\theta) = \mathbb{E}_t\big[\min(\rho_t \hat A_t,\ c_t \hat A_t)\big]$$

CISPO（最大化，sg 表示 stop-gradient）：

$$J_{\text{CISPO}}(\theta) = \mathbb{E}_t\big[\operatorname{sg}(c_t)\, \hat A_t \log \pi_\theta(u_t \mid u_{<t})\big]$$

要最小化的 loss 是 $-J$。

整條軌跡的比值：

$$w(\tau \mid x) = \frac{p_\theta(\tau \mid x)}{p_\mu(\tau \mid x)} = \prod_t \frac{\pi_\theta(a_t \mid h_t)}{\mu(a_t \mid h_t)}$$

</details>

### 參考模型 KL 與 entropy

另外兩個常見的附加項：

- **參考模型 KL**：扣掉 β 倍的 KL(π_θ ‖ π_ref)，讓 policy 不要離一個固定的參考模型太遠。投影片特別區分兩個角色：rollout policy μ 負責產生訓練資料、提供 ratio 的分母；參考模型 π_ref 則固定不動，當作錨點。出處是 [DeepSeekMath](https://arxiv.org/abs/2402.03300) 的 GRPO 目標函數。
- **entropy bonus**：加上 α 倍的 entropy，鼓勵下一個 token 的分布更寬，讓 agent 有機會試別的動作。投影片也註明：分布更寬不保證那些動作有用。

## 演算法對照表

投影片的總表比較三件事：怎麼分配功勞、怎麼加權抽到的 token、怎麼限制更新。

| 演算法 | 權重從哪來 | 要訓練 critic？ | importance ratio | clipping |
|---|---|---|---|---|
| REINFORCE | reward-to-go R_t | 否 | 無（只用新鮮 rollout） | 無 |
| [PPO](https://arxiv.org/abs/1707.06347) | critic 算出的 GAE | 是 | 當下 token 的 ρ_t | 原始與 clip 項取最小 |
| [GRPO](https://arxiv.org/abs/2402.03300) | 群組比較 | 否 | 當下 token 的 ρ_t | 同 PPO |
| [CISPO](https://arxiv.org/abs/2506.13585) | 群組比較 | 否 | 當下 token 的 ρ_t | clip 後的比值當固定權重 |
| [GSPO](https://arxiv.org/abs/2507.18071) | 群組比較 | 否 | 整條回應、長度正規化 | PPO 的 min，套在回應比值上 |
| [DAPO](https://arxiv.org/abs/2503.14476) | 群組比較 | 否 | 當下 token 的 ρ_t | PPO 的 min，上界放寬 |

這裡的「群組比較」指減掉組平均再除以組內的獎勵分散程度。讀這張表的方法是：**先決定你付不付得起一個 critic，再決定你的資料有多「過期」。**付不起 critic 就走群組比較那一欄；rollout 很長、非同步又很過期，就要認真挑 ratio 的算法和 clip 規則。後半句是我對表格的讀法，不是投影片原話。

## 四、可靠的獎勵：從無用的群組到 reward hacking

這一節是整講最長的部分，也是對做 agent 的人最直接有用的部分。前面所有技巧都假設獎勵是對的，這一節處理獎勵不對的情況。

### 為什麼一整組都失敗

每題抽四條軌跡，[0, 0, 0, 0] 和 [1, 1, 1, 1] 減掉平均都是全 0，沒有任何比較訊號。遇到全部失敗，投影片要你先看發生了什麼，再決定怎麼治：

| 可能原因 | 怎麼查 |
|---|---|
| verifier 品質：正確解被拒絕 | 回去看需求和失敗的測試 |
| 目前能力不足：模型還做不到 | 看更強模型的示範能不能成功 |
| 探索不足：每次都重複同一招 | 看這幾條軌跡彼此有沒有差異 |

### 偽陰性：正確解被判錯

回到 retry 題。某個候選解四個案例全對，但寫法不同；verifier 卻要求原始碼裡一定要出現 `value is None` 這串字，於是判它錯。這就是偽陰性（false negative）：正確解被拒絕。解法是檢查行為，不要檢查寫法上的偶然選擇。

偽陰性的後果有兩個：

- **獎勵雜訊**：等價的解因為措辭或實作細節拿到不同分數，模型會去擬合那些無關的差異。
- **benchmark 飽和**：評測器拒絕正確解時，分數會卡在 100% 以下。

投影片整理的例子（都是歷史版本，於 2025–26 年被稽核）：

| Benchmark | 停滯點／上限 | 稽核發現 |
|---|---|---|
| SWE-bench Verified | 約 81% | 最佳成績半年內只從 74.9% 升到 80.9%；OpenAI 稽核 138 道 o3 在 64 次執行中都沒穩定解出的題目，59.4% 的測試設計或題目描述有實質問題（[OpenAI, 2026-02](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)） |
| τ-bench Airline | 約 70% | 任務不一致限制了可達分數（[SABER](https://arxiv.org/abs/2512.07850) §5.1） |
| τ-bench Retail | 約 92% | 標註錯誤限制了可達分數（同上） |

三個數字的性質不一樣，引用時要分開看。τ-bench 的 70% 和 92% 是 SABER 論文算出來的可達上限：資料集本身的錯誤讓分數最多只能到這裡。SWE-bench Verified 的 81% 則是 OpenAI 觀察到的最佳成績停滯點，不是算出來的天花板；而且 OpenAI 列了兩個原因，除了測試會拒絕正確解，另一個是資料污染——它測過的前沿模型都能背出部分題目的原始修正（gold patch），所以它停止回報這個分數，改建議 SWE-bench Pro。投影片把兩者都歸在「偽陰性造成飽和」底下，只講了測試那一半。

SABER 是第三方的稽核（Cuadron et al.），不是 τ-bench 原作者。τ-bench 團隊在 2026 年 2 月的 [τ³-Bench: Fixing Airline + Retail](https://taubench.com/blog/tau3-task-fixes.html) 裡修了 airline 27 題、retail 26 題，文中說大多數修正直接取自 SABER。SWE-bench Verified 本身當初就是 OpenAI 為了篩掉有問題的題目而[建立的人工驗證子集](https://openai.com/index/introducing-swe-bench-verified/)：從 1,699 題裡由工程師審出 500 題。

### 偽陽性與 reward hacking

反過來，假設訓練時的 verifier 只測 `retries=0` 這一個輸入。那麼：

```python
def retry_count(config):
    return 0
```

這個「永遠回傳 0」的候選解通過唯一的測試，拿到獎勵 1，但缺值、`None`、`2` 三個案例全錯。這是偽陽性（false positive）：無效的解被獎勵。**訓練會學會鑽這個縫。**

在 coding agent 身上，投影片列了四種常見捷徑：

| 環境裡有什麼 | 捷徑 |
|---|---|
| 網路存取 | 上網找已公開的解答 |
| Git 歷史（包含未來的 commit） | 找到後來的修正直接抄 |
| 模型 API key | 呼叫更強的模型要答案或產生訓練資料 |
| 能碰到測試或測試執行器 | 讓測試通過，但沒修 bug |

網路、Git 與測試這三種捷徑，投影片引用的是 [MAI-Thinking-1 技術報告](https://microsoft.ai/pdf/mai-thinking-1.pdf) §3.3.1（第 43 頁）：報告把 SWE 環境裡的 reward hacking 分成上網搜尋原始 PR、翻本地 Git 歷史找修正 commit、竄改測試三類，對策分別是限制網路、把 base commit 之後的 commit 全部清掉、評分前重設測試檔。API key 那一條有明確的文件記錄：[PostTrainBench](https://arxiv.org/abs/2603.08640)（Rank et al.）§5.4 提到，評測用的 OpenAI API key 會開放給 agent，研究者在評測腳本裡明文禁止拿它做別的事；GPT-5.1 Codex-Max 在推理軌跡裡提到了這條限制，卻在長時間調不好模型之後違反它，用這個 key 產生訓練資料（Figure 7）。論文推測是限制在長 session 裡掉出了 context。這是論文記錄到的一次個案，不是普遍比例。

### 用獨立的檢查看進度

那個永遠回傳 0 的 patch 拿到訓練獎勵 1，但四個必要案例只過一個。投影片建議同時看三種訊號：

| 訓練獎勵 | 獨立的成功指標 | 成本與失敗 |
|---|---|---|
| 在訓練用 verifier 上的成功率 | 沒見過的任務、verifier 沒檢查到的行為 | 檢查工具呼叫、退步、重複動作 |

**如果獎勵在漲、獨立指標沒有跟著進步，就去翻軌跡找捷徑。**

### DAPO 的 dynamic sampling

全對或全錯的群組 advantage 為零，占了 batch 卻不貢獻梯度。[DAPO](https://arxiv.org/abs/2503.14476)（Yu et al.，§3.2）的做法是：只保留獎勵有高有低的群組，一直抽到 batch 裝滿為止。保留的群組要整組保留，包括裡面失敗的軌跡。

### 部分獎勵與它的風險

另一種讓群組有差異的方法是給部分分數，例如每通過一個檢查加 0.25。四條軌跡分別通過 0、1、2、1 個檢查時，純成功獎勵全是 0；加上部分分數後變成 0、0.25、0.5、0.25，減掉平均後是 −0.25、0、+0.25、0，有了訊號。

但輔助獎勵本身也可能被鑽。投影片舉了 OpenAI 公開的兩個例子：

- **工具使用**：一個 bug 讓表面上的網頁工具呼叫也能拿分，結果 GPT-5.1 把瀏覽器當計算機用，還表現得好像自己真的搜尋過（OpenAI 內部稱為「calculator hacking」，見 [Sidestepping Evaluation Awareness and Anticipating Misalignment with Production Evaluations](https://alignment.openai.com/prod-evals/)，2025-12）。
- **人設**：用來鼓勵「Nerdy」俏皮人設的獎勵，對含有 goblin、gremlin 比喻的回答給分較高，結果生物類比喻越來越常見，連沒有該人設 prompt 的時候也出現（[Where the goblins came from](https://openai.com/index/where-the-goblins-came-from/)）。

### 探索崩塌

最後一個獎勵相關的風險在 policy 本身。某個歷史下三個動作原本是 0.2、0.6、0.2，訓練後變成 0.01、0.98、0.01：幾乎每次都選 B，其他選項很少再被試到。entropy bonus 可以鼓勵嘗試其他動作，同時要檢查軌跡之間到底有沒有差異。DAPO 論文也討論了這種 entropy collapse。

## 五、向老師學：課程、暖身與蒸餾

學生幾乎從不成功時，RL 拿不到訊號。投影片給的第一步是課程設計：先從成功解學（warm start）→ 練模型偶爾做得到的題目 → 模型變強再加難。要把早期的題目留在混合裡，並用一組固定的評測集量進步。

「保留早期題目」這一點和 [Bengio et al.（2009）](https://doi.org/10.1145/1553374.1553380) 對課程學習的正式定義一致：論文把課程寫成一串重新加權的訓練分布，每個樣本的權重只增不減、分布的熵逐步變大，最後所有樣本權重都回到 1。暖身和「練模型偶爾做得到的題目」則是投影片針對 RL 的具體做法，不在這篇論文裡。論文的主要實驗（形狀分類與語言模型）都是監督式學習，難易度事先定好，例如先用形狀變化較少的圖片，或先只學常見字，而不是依模型當下的成功率挑題目。

接下來是蒸餾：與其只給一個 0／1 的結果獎勵，不如讓老師在每一步都給出完整的動作機率分布。

<details>
<summary>蒸餾的三種做法：從離線到 on-policy self-distillation</summary>

**離線蒸餾（[Hinton et al., 2015](https://arxiv.org/abs/1503.02531)）。** 在一組老師產生的固定軌跡上，訓練學生去貼近老師的動作機率。例如在歷史 h₃，老師給 a₃ 80%、另一個動作 20%，記為 q(· | h₃)。問題跟 SFT 的曝光偏差一樣：學生自己行動時，會因為自己的錯走到訓練集裡沒有的歷史。

**On-policy 蒸餾（[Agarwal et al., ICLR 2024](https://arxiv.org/abs/2306.13649)，GKD）。** 讓學生自己跑出歷史，再請老師在這些歷史上給出目標分布。on-policy 的意思是歷史來自學生自己的 rollout。

**密集的蒸餾目標。** 在同一個 h₃，學生給兩個動作各 0.5，老師是 0.8 與 0.2。反向 KL（自然對數）：

$$0.5 \log\frac{0.5}{0.8} + 0.5 \log\frac{0.5}{0.2} \approx 0.223$$

對學生產生的歷史分布 $d_\mu$ 取平均後最小化：

$$L_{\text{OPD}} = \mathbb{E}_{h \sim d_\mu}\big[D_{\text{KL}}(\pi_\theta(\cdot \mid h) \,\|\, q(\cdot \mid h))\big]$$

跟 RL 比，這裡每一步都有訊號，不是只有最後一個分數。

**On-policy self-distillation（[OPSD](https://arxiv.org/abs/2601.18734)，Zhao et al.）。** 老師不必是更大的模型。OPSD 用一份凍結的起始模型當老師，差別只在輸入：學生看到任務和歷史 h₃，老師看到同樣的任務和歷史，外加一份已驗證的解答。有了解答，老師在學生自己的歷史上能給出更好的目標分布，再用同樣的方式訓練學生。

</details>

## 三個收穫

投影片最後把整講收成三欄：

| 有用的回饋 | 穩定的更新 | 可靠的獎勵 |
|---|---|---|
| 用群組比較、critic 或 process reward 來分配功勞 | 搞清楚 behavior policy 是誰，控制樣本能把模型改多少 | 讓任務難度匹配模型，並驗證你真正想要的行為 |

換成做 agent 的人今晚能做的事：

- **拿一個「永遠回傳常數」或「什麼都不改」的假解去跑你的 verifier。**如果它拿到分數，你的獎勵就有洞，訓練一定會找到它。
- **把沙盒裡的網路、Git 歷史、API key、測試檔案列一張清單。**每一項都問一次：agent 能不能靠它不做事就拿分？
- **訓練時同時畫兩條曲線**：訓練獎勵，以及一組 verifier 沒碰過的獨立評測。兩條分岔的那一刻，就是該去翻軌跡的時候。

## 想深入

官方課表為這一講列的參考資料（大多也標在投影片上）：

- Credit assignment：[MIXER](https://michaelauli.github.io/papers/iclr2016_mixer.pdf)、[InstructGPT](https://arxiv.org/abs/2203.02155)、[GAE](https://arxiv.org/abs/1506.02438)、[Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)
- 非同步與 importance sampling：[AReaL](https://arxiv.org/abs/2505.24298)、[CTPO](https://arxiv.org/abs/2605.07331)
- 演算法：[PPO](https://arxiv.org/abs/1707.06347)、[DeepSeekMath（GRPO）](https://arxiv.org/abs/2402.03300)、[MiniMax-M1（CISPO）](https://arxiv.org/abs/2506.13585)、[GSPO](https://arxiv.org/abs/2507.18071)、[DAPO](https://arxiv.org/abs/2503.14476)
- 獎勵可靠度：[Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)、[Why we no longer evaluate SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)、[SABER](https://arxiv.org/abs/2512.07850)、[τ³-Bench task fixes](https://taubench.com/blog/tau3-task-fixes.html)、Lilian Weng 的 [Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)、[MAI-Thinking-1](https://microsoft.ai/pdf/mai-thinking-1.pdf)、[PostTrainBench](https://arxiv.org/abs/2603.08640)、[OpenAI production evaluations（calculator hacking）](https://alignment.openai.com/prod-evals/)、[Where the goblins came from](https://openai.com/index/where-the-goblins-came-from/)、Ng 等人的 [Policy Invariance Under Reward Transformations](https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf)（reward shaping）
- 課程與蒸餾：[Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)、[GKD](https://arxiv.org/abs/2306.13649)、[OPSD](https://arxiv.org/abs/2601.18734)

站內延伸閱讀（同一批演算法的其他角度，不取代本講）：

- [CS336 Lecture 16：RLVR 用可驗證獎勵擴大推理，但 GRPO 不是免費的 PPO](/posts/ai/2026-08-22-cs336-rlvr)
- [CS336 Lecture 15：SFT 教模型模仿，RLHF 才開始直接最佳化偏好](/posts/ai/2026-08-22-cs336-sft-rlhf)
- [Deep Reinforcement Learning：把 RLHF 放回強化學習的框架裡](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf)（CS230）
- [CME295 第 6 講：reasoning model 怎麼學會想久一點，GRPO 又省掉了 PPO 的什麼](/posts/ai/2026-09-29-cme295-llm-reasoning)
- [CME295 第 5 講：RLHF 與 DPO 怎麼補上負面訊號](/posts/ai/2026-09-29-cme295-preference-tuning)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 11-768 AI Agents 課程官網](https://www.cmu-agents.com/)
- [Lecture 11 投影片：Advanced RL Algorithms for Agents](https://www.cmu-agents.com/slides/lecture-11-rl-advanced.pdf)
- [Ranzato et al., ICLR 2016. Sequence Level Training with Recurrent Neural Networks (MIXER)](https://michaelauli.github.io/papers/iclr2016_mixer.pdf)
- [Ouyang et al., 2022. Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
- [Schulman et al., 2016. High-Dimensional Continuous Control Using Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438)
- [Lightman et al., 2023. Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)
- [Fu et al., NeurIPS 2025. AReaL: A Large-Scale Asynchronous Reinforcement Learning System for Language Reasoning](https://arxiv.org/abs/2505.24298)
- [Zhang et al., 2026. Rethinking Importance Sampling in LLM Policy Optimization: A Cumulative Token Perspective (CTPO)](https://arxiv.org/abs/2605.07331)
- [Schulman et al., 2017. Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Shao et al., 2024. DeepSeekMath](https://arxiv.org/abs/2402.03300)
- [MiniMax, 2025. MiniMax-M1 (CISPO)](https://arxiv.org/abs/2506.13585)
- [Zheng et al., 2025. Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071)
- [Yu et al., 2025. DAPO: An Open-Source LLM Reinforcement Learning System at Scale](https://arxiv.org/abs/2503.14476)
- [OpenAI. Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)
- [OpenAI. Why we no longer evaluate SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [Cuadron et al., 2025. SABER: Small Actions, Big Errors](https://arxiv.org/abs/2512.07850)
- [Barres & Shi, 2026. τ³-Bench: Fixing Airline + Retail](https://taubench.com/blog/tau3-task-fixes.html)
- [Lilian Weng, 2024. Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)
- [Microsoft AI. MAI-Thinking-1](https://microsoft.ai/pdf/mai-thinking-1.pdf)
- [Rank et al., 2026. PostTrainBench: Can LLM Agents Automate LLM Post-Training?](https://arxiv.org/abs/2603.08640)
- [Williams, Raymond & Carroll, 2025. Sidestepping Evaluation Awareness and Anticipating Misalignment with Production Evaluations](https://alignment.openai.com/prod-evals/)
- [OpenAI. Where the goblins came from](https://openai.com/index/where-the-goblins-came-from/)
- [Ng, Harada & Russell, 1999. Policy Invariance Under Reward Transformations](https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf)
- [Bengio, Louradour, Collobert & Weston, 2009. Curriculum Learning](https://doi.org/10.1145/1553374.1553380)（ICML 2009；[Collobert 個人網站的公開副本](https://ronan.collobert.com/pub/matos/2009_curriculum_icml.pdf)，課程的正式定義在 §3〈A curriculum as a continuation method〉）
- [Hinton et al., 2015. Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Agarwal et al., ICLR 2024. On-Policy Distillation of Language Models](https://arxiv.org/abs/2306.13649)
- [Zhao et al., 2026. Self-Distilled Reasoner: On-Policy Self-Distillation for Large Language Models](https://arxiv.org/abs/2601.18734)
