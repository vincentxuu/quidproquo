---
title: "CMU 11-768 第 9 講：RL 基礎——policy gradient 就是 SFT loss 乘上一個權重"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, reinforcement-learning, grpo, reinforce]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 10
tldr: "Daniel Fried 用 1 到 16 猜數字當例子，把 RL 講成 SFT 的延伸：先點出 SFT 的三個缺口（任務不對齊、學不了失敗、沒見過自己的錯），再依序推出 ReST、REINFORCE、baseline 與 GRPO／DrGRPO——四者都是對 agent 自己產生的 token 算 log 機率，差別只在每個 token 乘上的權重。"
description: "導讀 CMU 11-768 AI Agents 第 9 講 RL Basics：猜數字範例、SFT 的三個問題、軌跡與期望獎勵、ReST 與 ReST-EM、REINFORCE 推導與實作（遮罩＋縮放 SFT loss）、baseline 為何不偏且降低變異數（雙臂吃角子老虎的數字實例）、GRPO 的群組相對 advantage、DrGRPO 的兩個修正，以及全對或全錯群組沒有梯度的問題。"
draft: false
glossary:
  - term: "policy gradient"
    aliases: ["策略梯度", "REINFORCE"]
    definition: "直接對「期望獎勵」取梯度來更新模型的方法。實作上是把 agent 自己產生的 token 的 log 機率乘上獎勵，再做反向傳播。"
    context: "本文把 REINFORCE、ReST、GRPO 都看成 policy gradient 的不同權重選擇。"
  - term: "advantage"
    aliases: ["優勢", "Â", "advantage estimate"]
    definition: "某個動作比 policy 平常的表現好多少：拿實際拿到的獎勵減掉一個「預期獎勵」的估計（baseline）。"
    context: "GRPO 用同一題多次 rollout 的平均獎勵當 baseline 來算 advantage。"
  - term: "exposure bias"
    aliases: ["曝光偏差"]
    definition: "模型訓練時只看過正確的前文，推論時卻要接著自己產生（可能有錯）的前文繼續寫，於是遇到自己的錯誤就不知道怎麼辦。"
    context: "本講把它列為 SFT 的第三個缺口，on-policy RL 讓模型在訓練時就面對自己的錯。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics-en)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 是 Daniel Fried 與 Graham Neubig 在 2026 秋季開的研究所課，主題是用 LLM 做的 agent：工具使用、規劃、記憶、訓練、安全與人機互動。第 9 講（9/22）由 Fried 主講，是訓練模組三講 RL 的第一講：這一講講 policy gradient 的基本方法，下週的第 11 講由 Neubig 講進階演算法與穩定訓練，第 12 講由助教 Apurva Gandhi 講 RL 系統與實務框架（中間的第 10 講是 Akari Asai 講 deep research agents 的客座課）。三講合起來是作業 3 的地基。課程官網對作業 3 只寫了「實作用來調整與改進 agent 的訓練流程」；Fried 在課堂上口頭補充，作業 3 會要你在兩個環境裡用 RL 訓練模型，一個是本講範例的猜數字，另一個是有點像 Minecraft 的簡易合成環境，運算量也會比前兩份作業大。環境細節以作業正式公布的內容為準。

本篇依[影片](https://www.youtube.com/watch?v=paAcPaaYZGM)與[投影片](https://www.cmu-agents.com/slides/lecture-09-rl-basics.pdf)撰寫。Fried 開場就說，這一講是從上一講的 SFT 搭一座橋，走到 policy gradient 這個他認為最簡單、也最優雅的 RL 形式。整講的主線可以濃縮成一句話：**每一種方法都是對 agent 自己做過的動作算 log 機率，差別只在乘上什麼權重。**

這篇照講者的順序走，數學一律放在折疊區。只想抓直覺的讀者，跳過所有「機制」折疊區也讀得完。

## 場景：在 1 到 16 之間猜一個數字

整講用同一個例子。環境藏了一個 1 到 16 的整數，agent 有四次機會。猜錯時環境回「higher」或「lower」，猜中就結束，拿到獎勵 1；四次用完還沒中，獎勵是 0。

藏的數字是 11 時，投影片列了四條軌跡：

| 軌跡 | 過程 | 結果 |
|---|---|---|
| τ₁ | 8 → higher → 12 → lower → 10 → higher → 11 | 猜中，R=1 |
| τ₂ | 4 → higher → 8 → higher → 12 → lower → 11 | 猜中，R=1 |
| τ₃ | 16 → lower → 8 → higher → 9 → higher → 10 | 超時，R=0 |
| τ₄ | 1 → higher → 2 → higher → 3 → higher → 4 | 超時，R=0 |

最好的第一手是 8，因為它把範圍對半切，Fried 拿 Wordle 的最佳開局來比喻。但 τ₂ 從 4 開始也成功了，τ₁ 和 τ₂ 動作不同、結果一樣。

換成 agent 的世界，獎勵可以是「寫出來的程式有沒有通過全部單元測試」，例如 SWE-bench；也可以是非二元的「通過了幾成測試」。現在很多人做的 RLVR（reinforcement learning with verifiable rewards）獎勵只有 0 或 1，但本講的方法對任意純量獎勵都成立。

## 直覺：SFT 有三個缺口

SFT 的做法是拿一條示範軌跡，最大化 agent 對每個示範動作的機率。示範可以來自人、來自更強的模型，也可以來自 agent 自己成功的軌跡——最後這種就是本講的起點。

Fried 列了 SFT 的三個問題：

**任務不對齊（task mismatch）。** SFT 最大化「示範動作的機率」，我們要的卻是「完成任務的機率」，兩者不一樣。第一，完成任務的方法不只一種，示範只給了一種。第二，沒被示範的動作裡也有好壞之分：猜 8、12 得到「lower」之後再猜 13 是蠢到不行的一步，但在 SFT 的 loss 裡，它跟其他沒被示範的動作一樣，受到的懲罰相同。

**資料不對齊（data mismatch）。** 就算示範是最佳解，其他次佳、甚至失敗的軌跡也帶著訊號。像 τ₃ 這種超時的軌跡，你不會想對它做 SFT，但會想讓模型「別再這樣做」，SFT 做不到。

**曝光偏差（exposure bias）。** SFT 訓練時，前文永遠是示範給的；推論時，前文是模型自己一步步產生的。如果訓練資料裡每一步都照著回饋走，模型從沒看過自己犯錯後的局面，一旦推論時猜了個方向錯的數字（例如 8 → higher 之後猜 2），它可能完全接不下去。

## RL 換了什麼：讓 agent 自己產生訓練資料

RL 的做法是讓 agent 自己跑出軌跡，算出每條軌跡的獎勵，再調整參數，讓高獎勵的軌跡更可能出現、低獎勵的更不可能出現。三個缺口一次補上：

- 目標直接是期望獎勵，所以任何成功的軌跡都會被強化，不只示範那一條。
- 失敗的軌跡也能提供「避開」的訊號（前提是有 baseline，下文會講）。
- 軌跡來自當下的 policy（on-policy），模型在訓練時就得面對自己的錯，並因為錯誤導致低獎勵而被懲罰。

Fried 在課堂上補了一句自己的觀察（口述，投影片沒有，也沒附出處）：三、四年前語言模型常見的重複、鬼打牆，在大家開始於後訓練加上 RL 階段之後，很多都消失了，他的解釋是模型學會了從自己的錯誤裡爬出來。這是講者的經驗判斷，本文沒有找到直接驗證這個因果的研究。代價是效率：on-policy 要一直等模型自己產資料，第 11 講 Neubig 會談放寬這個假設的方法。

## 把互動寫成軌跡

agent 是一個 policy π_θ，θ 是背後語言模型的參數。每一步它看到歷史 h_t（到目前為止的所有觀察與動作），抽樣出動作 a_t，環境回傳下一個觀察和獎勵。投影片用三個例子對照這套框架：

| | 任務實例 x | 觀察 | 動作 | 獎勵 |
|---|---|---|---|---|
| 文字生成 | prompt | 目前為止的 token | 下一個 token | judge 模型的分數 |
| 網頁 agent | 任務＋網站 | 渲染後的頁面 | 點擊、輸入、捲動 | 完成的子任務數 |
| 猜數字 | 藏起來的數字 | higher／lower／correct | 下一個猜測 | 猜中得 1，否則 0 |

有個關鍵區分：policy 只能看到歷史，看不到環境的隱藏狀態。猜數字的答案 11、網頁後端資料庫的內容都屬於後者。課堂上有人問古典 RL 的 Markov 假設，Fried 的回答是這裡處理的其實是 POMDP（部分可觀察的馬可夫決策過程），因為看不到狀態，所以下一個觀察要條件在全部歷史上。

一條軌跡的機率由兩部分相乘：policy 選每個動作的機率，以及環境回傳每個觀察與獎勵的機率。**RL 最重要的一點是：環境那部分我們不必知道**，只要能跟環境互動、從中抽樣就夠了。這很神奇，但也是 RL 貴的原因——你只能試了再看結果，拿這個間接的訊號去推「獎勵怎麼隨參數變」。

目標是**期望獎勵** J(θ)：在 policy 下抽出軌跡、算獎勵、取平均。假設 agent 只會產生上面四條軌跡，機率分別是 0.30、0.20、0.25、0.25，那 J = 0.3 × 1 + 0.2 × 1 = 0.5。訓練就是把機率質量從失敗的軌跡搬到成功的軌跡。

<details>
<summary>機制：軌跡、軌跡機率與目標函數</summary>

歷史與 policy：

$$h_t = (o_0, a_0, o_1, \ldots, o_t), \qquad \pi_\theta(a_t \mid h_t)$$

帶獎勵的軌跡與總獎勵：

$$\tau = (o_0, a_0, r_1, o_1, \ldots, a_{T-1}, r_T, o_T), \qquad R(\tau) = \sum_{t=1}^{T} r_t$$

軌跡機率用連鎖律拆成 policy 項與環境項（Fried 在課堂上更正了投影片少寫的 $P$）：

$$p_\theta(\tau \mid x) = \prod_t \pi_\theta(a_t \mid h_t)\, P(o_{t+1}, r_{t+1} \mid h_t, a_t, x)$$

目標：

$$J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\cdot \mid x)}[R(\tau)] = \sum_\tau p_\theta(\tau \mid x) R(\tau)$$

</details>

## 最簡單的 RL：只拿成功的軌跡做 SFT

在進 policy gradient 之前，Fried 先介紹一個很有道理的 SFT 小改版：expert iteration，其中一種叫 [ReST](https://arxiv.org/abs/2308.08998)（Reinforced Self-Training，Gulcehre et al.）。流程是三步反覆：

1. **Grow**：用當下的 policy 抽一批軌跡，算獎勵。
2. **Improve**：用獎勵過濾（二元獎勵就是留 R=1、丟 R=0），把留下的軌跡併進既有資料集，對整個資料集做 SFT。
3. **Repeat**：用更新後的 policy 再來一輪。

猜數字的例子裡，τ₁、τ₂ 留下，τ₃、τ₄ 丟掉，loss 就是只在成功軌跡上的 SFT loss。[ReST-EM](https://arxiv.org/abs/2312.06585)（Singh et al.）的 EM 指的是期望最大化（expectation maximization），因為這個「抽樣→重新擬合」的交替跟 EM 演算法很像。

Fried 強調這在技術上還不算 RL，但骨架已經一樣：資料由模型自己產生，更新方式由獎勵決定。它完全沿用 SFT 的訓練機制，二元獎勵下是個簡單又有效的起點。

課堂上有兩個問題值得記下：

- **它和 self-distillation 差在哪？** 只差在用獎勵過濾。self-distillation 可以指在模型產生的全部軌跡上訓練；ReST 之所以叫 reinforced，是因為用獎勵強化了好的軌跡。
- **如果模型一條成功的軌跡都產不出來怎麼辦？** 那 RL 和這個方法大概都不適用。Fried 給了三種解法：先用示範做一輪訓練（像 [DeepSeek-R1](https://arxiv.org/abs/2501.12948) 和很多 reasoning model 在 RL 前做的 cold start）；排課程（curriculum），先挑模型偶爾做得到的題目，變強再加難；或者給中間獎勵，例如你知道先探索 repo 有幫助，就為這一步給獎勵。

## Policy gradient：SFT loss 乘上獎勵

要最大化 J(θ)，不能直接反向傳播，原因有兩個：動作是離散抽樣出來的，參數改一點點，抽到的動作通常不變，所以導數幾乎處處是零；環境又是個黑盒子，Fried 的比喻是「你要怎麼對一個單元測試取程式碼的微分？」

通用解法是 Williams 1992 年提出的 [REINFORCE](https://doi.org/10.1007/BF00992696)。透過一個叫 score function（log 導數）的代數技巧（Williams 把 ∂ln g/∂w 這一項稱為 characteristic eligibility），期望獎勵的梯度可以寫成另一個期望值，而這個期望值可以用抽樣估計：

**抽一條軌跡，把軌跡裡每個動作的 log 機率梯度加總，再乘上這條軌跡的獎勵。**

最後這一步有兩個好消息。第一，環境那一項對 θ 是常數，取梯度就消失了，所以完全不用知道環境怎麼運作。第二，剩下的「動作 log 機率的梯度」跟 SFT 算的是同一件事，只不過這些 token 是 policy 自己抽出來的，不是示範給的。一個動作如果是好幾個 token（例如一個複雜的工具呼叫），就把這些 token 的 log 機率加起來。

<details>
<summary>機制：REINFORCE 的推導</summary>

對 J 取梯度，只有軌跡機率依賴 θ：

$$\nabla_\theta J = \sum_\tau \nabla_\theta p_\theta(\tau \mid x)\, R(\tau)$$

乘上再除以 $p_\theta(\tau \mid x)$，並用 $\nabla p / p = \nabla \log p$：

$$\nabla_\theta J = \sum_\tau p_\theta(\tau \mid x)\, R(\tau)\, \nabla_\theta \log p_\theta(\tau \mid x) = \mathbb{E}_{\tau \sim p_\theta}\big[R(\tau)\, \nabla_\theta \log p_\theta(\tau \mid x)\big]$$

軌跡 log 機率裡的環境項對 θ 是常數：

$$\log p_\theta(\tau \mid x) = \underbrace{\sum_t \log P(o_{t+1}, r_{t+1} \mid h_t, a_t, x)}_{\text{const}} + \sum_t \log \pi_\theta(a_t \mid h_t)$$

所以抽一條軌跡就得到一個梯度估計：

$$\hat\nabla_\theta J = R(\tau) \sum_t \nabla_\theta \log \pi_\theta(a_t \mid h_t)$$

動作 $a_t = (u_{t,1}, \ldots, u_{t,m_t})$ 由多個 token 組成時：

$$\nabla_\theta \log \pi_\theta(a_t \mid h_t) = \sum_{k=1}^{m_t} \nabla_\theta \log \pi_\theta(u_{t,k} \mid h_t, u_{t,<k})$$

</details>

### 實作：遮罩加縮放

投影片把一條猜數字的軌跡攤成 chat template 的 token：`<|im_start|>assistant`、`guess(8)`、`<|im_end|>`、`<|im_start|>tool`、`higher`……其中只有 policy 自己抽出來的 token（猜測內容與結尾的 end-of-turn token）遮罩值 m=1，prompt 與環境回傳的觀察 m=0。loss 就是：

$$L_{PG} = -R(\tau) \sum_{t : m_t = 1} \log \pi_\theta(u_t \mid u_{<t})$$

換句話說，**policy gradient 就是 SFT loss 做了遮罩和縮放**。Fried 分享了一段個人經驗：他第一次讀到 REINFORCE 的實作程式碼時很驚訝——那是用 RL 最佳化談判對話模型的 [Deal or No Deal](https://arxiv.org/abs/1706.05125)（Lewis et al., 2017）論文——原本以為很複雜，結果就是算 SFT 的 loss 再乘上獎勵。這段故事只有講者口述；可以查證的部分是，那篇論文的 RL 階段確實用的是 Williams 1992 的 REINFORCE。

訓練迴圈四步：抽任務實例並讓 agent 產生軌跡 → 算每條軌跡的獎勵 → 用獎勵加權動作的 log 機率 → 反向傳播更新 θ，換新 policy 再抽。標準 REINFORCE 每個任務實例只抽一條軌跡，batch size 等於任務實例數。

### 二元獎勵下，它長得很像 ReST

獎勵只有 0 或 1 時，REINFORCE 的 loss 就等於「只在成功軌跡上的 SFT loss」，跟 ReST 一樣。差別在 REINFORCE 完全 online，抽完就更新；ReST 先累積一大份資料集，再對整份跑一個或多個 epoch。直覺上兩者相同。

## Baseline 與 advantage：跟「平常的表現」比

問題也出在這裡：τ₃ 失敗了，獎勵是 0，乘上去梯度就是 0。不減 baseline 的純 REINFORCE 和 ReST 一樣，**從失敗中學不到任何東西**，但我們明明想讓模型學會「別這樣做」。

Fried 的直覺是：更新幅度應該看這個 policy 在這題平常做得多好。如果一題模型 95% 的時候都拿 1 分，那 5% 犯蠢拿 0 分的情況就該被重重修正。

這就是 **advantage**：這個動作比 policy 的平均表現好多少。形式上是「做了這個動作之後的期望獎勵」減掉「從這個歷史出發的期望獎勵」，也就是 Q 減 V。

猜數字的例子：已經猜了 8（higher）、12（lower），答案只剩 9、10、11，還有兩次機會。

- 猜 **10**：猜錯的話，回饋會直接告訴你是 9 還是 11，下一次必中。advantage > 0。
- 猜 **11**：猜錯的話剩 9 和 10 兩個候選、一次機會，只有一半機率猜中。advantage < 0。

實務上 Q 和 V 都不知道，所以用抽到的獎勵減掉一個 baseline b(h_t) 來估 advantage：Â_t = R(τ) − b(h_t)。baseline 怎麼選，決定了你用的是哪一種演算法：

| baseline 的選法 | 對應 |
|---|---|
| 常數 | 下面的吃角子老虎例子 |
| 目前為止獎勵的移動平均 | 會隨 policy 變強而調整 |
| 訓練一個價值模型 V_φ(h) | actor-critic、PPO（第 11 講） |
| 同一題多次 rollout 的平均 | GRPO，不需要額外模型 |

投影片把 baseline 當成 REINFORCE 之後的改良來講，但 Williams 1992 的原始定義就已經包含它。論文的更新式是 Δw = α(r − b)e，其中 b 叫 reinforcement baseline，只要求它和當下輸出的動作條件獨立；REINFORCE 這個名字是 "REward Increment = Nonnegative Factor × Offset Reinforcement × Characteristic Eligibility" 的縮寫，其中的 "Offset Reinforcement" 指的就是 r − b。論文也舉了用過去獎勵的指數移動平均當 baseline 的做法（沿用 Sutton 1984 的 reinforcement comparison），對應上表第二列。本節的「純 REINFORCE」指的是 b = 0 的特例。

### 為什麼減掉 baseline 不會出錯

減掉 baseline 之後，每個樣本算出來的梯度數值變了，但**期望值不變**。只要 baseline 只依賴歷史、不依賴當下選的動作，它貢獻的那一項期望值恰好是 0，所以估計仍然不偏。

<details>
<summary>機制：baseline 不偏的證明</summary>

帶 baseline 的估計：

$$\hat\nabla_\theta J = \sum_t \big(R(\tau) - b(h_t)\big)\, \nabla_\theta \log \pi_\theta(a_t \mid h_t)$$

只要下面這項期望值是 0，它就是不偏的：

$$\mathbb{E}_{a \sim \pi_\theta(\cdot \mid h)}\big[b(h)\, \nabla_\theta \log \pi_\theta(a \mid h)\big] = b(h) \sum_a \pi_\theta(a \mid h)\, \nabla_\theta \log \pi_\theta(a \mid h) = b(h) \sum_a \nabla_\theta \pi_\theta(a \mid h) = b(h)\, \nabla_\theta 1 = 0$$

第二個等號用的是 $\pi \nabla \log \pi = \nabla \pi$。

</details>

### 數字實例：雙臂吃角子老虎

Fried 說 baseline 對他來說一直有點神秘，所以做了一組視覺化來看它到底在做什麼。設定只有一步、兩個動作：猜 A 得 1 分，猜 B 得 0 分。policy 只有一個參數 θ，猜 A 的機率 p = σ(θ)。θ = −1.1 時 p = 0.25，也就是這個 policy 很爛，把 75% 的機率放在沒分的 B 上。我們希望梯度把 θ 往正的方向推。

| | 抽到 A（機率 0.25） | 抽到 B（機率 0.75） |
|---|---|---|
| log 機率對 θ 的斜率 | 1 − p = +0.75 | −p = −0.25 |
| 無 baseline：R × 斜率 | 1 × 0.75 = **+0.75** | 0 × (−0.25) = **0** |
| baseline b = 0.5：(R − b) × 斜率 | 0.5 × 0.75 = **+0.375** | (−0.5) × (−0.25) = **+0.125** |

兩種做法的期望梯度都是 0.25 × 0.75 = 0.1875，也就是真正的梯度。差別在分散程度：沒有 baseline 時，四次裡有三次梯度是 0，一次是遠大於真值的 0.75，標準差約 0.325；加上 b = 0.5 之後，兩種樣本都落在真值附近，標準差降到約 0.108。

更直觀的是抽到 B 那格：沒有 baseline 時什麼都沒學到；有了 baseline，「拿 0 分比預期差」這件事本身就提供了訊號——降低 B 的機率，等於提高 A 的機率。**baseline 讓失敗也能產生學習訊號，同時不改變期望梯度。**

RL 有很大一部分工作都在降低梯度估計的變異數，讓訓練穩定、不被 policy 抽樣和環境的雜訊帶著跑。這個兩臂的直覺可以直接推到多步的決策問題。

### baseline 解決不了的事

baseline 能把一整條軌跡標成「比預期好」或「比預期差」，好的 baseline 也能降低變異數。但它**沒有解決 credit assignment**：同一條軌跡裡的每個動作拿到同一個 Â，τ₁ 的 8、12、10、11 全部是 +0.5。另外，估 V 可能需要另外訓練一個價值模型。

如果環境在中途就給獎勵（例如某個工具呼叫給 +0.2），可以把 R(τ) 換成 **reward-to-go**：每個動作只乘上它之後的獎勵總和。之前的獎勵跟這個動作無關，拿掉可以降變異數又不會引入偏差。猜數字只在最後給一次獎勵，所以每個動作的 reward-to-go 都等於 R(τ)。

## GRPO：同一題多跑幾次，平均就是 baseline

最後一段講簡化版的 GRPO（Group Relative Policy Optimization），出自 [DeepSeekMath](https://arxiv.org/abs/2402.03300)（Shao et al.）。Fried 的說法是：以往把 RL 用在語言模型上，大多要另外訓練一個模型來預測 baseline，既重要又昂貴；DeepSeek 很在意效率，於是想出一個不需要額外模型的做法。

做法很直白：同一個任務實例讓模型跑 G 次（每次重置環境），拿到 G 個獎勵，用它們的平均當 baseline。baseline 本來就是「這個 policy 在這題的期望獎勵」，而估計它最好的方法就是真的跑幾次再取平均，這個想法很漂亮。原始 GRPO 還會再除以這組獎勵的標準差。

藏的數字是 11、四條軌跡的獎勵為 1、1、0、0：平均 0.5，標準差 0.5，advantage 分別是 +1、+1、−1、−1。失敗的軌跡終於拿到負的權重。

一個 batch 裡有多個任務實例，**每個實例只跟自己那組比**：

| 任務實例 | 四次 rollout 的獎勵 | 組平均 | advantage |
|---|---|---|---|
| 藏 11 | 1, 1, 0, 0 | 0.50 | +1, +1, −1, −1 |
| 藏 3 | 1, 0, 0, 0 | 0.25 | +1.73, −0.58, −0.58, −0.58 |
| 藏 7 | 1, 1, 1, 0 | 0.75 | +0.58, +0.58, +0.58, −1.73 |

注意藏 3 那組：唯一成功的那次拿到很大的正權重；藏 7 那組則是唯一失敗的那次被重罰。這正好對上前面的直覺：難題裡的成功、簡單題裡的失誤，都值得大幅更新。

Fried 口頭說群組大小 G 通常是 8 左右，第 12 講的 Apurva Gandhi 會再談怎麼選。這是講者的經驗值，投影片沒有寫；對照論文，DeepSeekMath 原本的設定是每題抽 64 個輸出，DrGRPO 論文的實驗則是每題 8 個回應，可見這個數字隨設定差很多。有人問這樣是否不偏，Fried 的回答是：baseline 只來自同一個 prompt 下的 rollout，不依賴當下這個動作，所以不偏。

Fried 也特別聲明，投影片寫的**不是**論文裡完整的 GRPO loss。論文版還有 importance ratio、clipping（避免一步走太遠）和 KL 項（避免離起點模型太遠），這些留到第 11 講。

<details>
<summary>機制：群組相對 advantage 與 GRPO loss</summary>

同一任務實例的 G 條 rollout：

$$\bar R = \frac{1}{G} \sum_{j=1}^{G} R(\tau_j), \qquad \sigma_R = \operatorname{std}\{R(\tau_1), \ldots, R(\tau_G)\}, \qquad \hat A_j = \frac{R(\tau_j) - \bar R}{\sigma_R}$$

對組內每個 $h_t$，$b(h_t) = \bar R$。

policy gradient loss（i 是 batch 內的任務實例）：

$$-\sum_i R(\tau_i) \sum_t \log \pi_\theta(a_{i,t} \mid h_{i,t})$$

換成 GRPO 的權重（j 是組內第幾條 rollout）：

$$-\sum_i \frac{1}{G} \sum_{j=1}^{G} \hat A_{ij} \sum_t \log \pi_\theta(a_{ij,t} \mid h_{ij,t})$$

這是只考慮 on-policy 軌跡的簡化版，沒有論文中的 ratio、clipping 與 KL 項。

</details>

### DrGRPO：拿掉兩個除法

[DrGRPO](https://arxiv.org/abs/2503.20783)（Liu et al.，論文標題是 Understanding R1-Zero-Like Training）指出 GRPO 有兩個除法會帶來偏差。作業 3 也會要你實作這兩個修改：

| | GRPO | DrGRPO | 為什麼改 |
|---|---|---|---|
| advantage | 減平均再除以組內標準差 σ_R | 只減平均 | 幾乎總是做對或總是做錯的題目 σ_R 很小，除下去之後權重反而變大；標準化也把題目難度的差異抹平了 |
| 回應彙總 | 每條回應除以自己的長度 \|y_j\| | 除以全域常數 C | 長度不同時，長的錯誤回答每個 token 受的懲罰比短的小，policy 會往又長又錯的方向漂 |

C 對每條回應都一樣，論文用的是生成長度上限。獎勵本身不變，變的是各題、各回應之間的相對權重。Fried 在課堂上提到（口述，未附出處），很多自稱 GRPO 的實作其實也已經拿掉除以標準差這一步。

<details>
<summary>機制：DrGRPO 的逐 token 係數</summary>

同一任務實例裡，軌跡 j 的每個生成 token 共用同一個 advantage，再除以常數 C：

$$L_{\text{DrGRPO}} = -\frac{1}{G} \sum_{j=1}^{G} \frac{1}{C} \sum_{t : m_{j,t} = 1} \hat A_j \log \pi_\theta(u_{j,t} \mid u_{j,<t}), \qquad \hat A_j = R(\tau_j) - \bar R$$

例如 τ₁（成功）每個 token 的係數是 +0.5 / C，τ₃（失敗）是 −0.5 / C。論文的完整目標函數同樣有 ratio 和 clipping，這裡省略。

</details>

### 全對或全錯的群組沒有梯度

一組獎勵全部一樣時，減掉平均後全部是 0，這組不貢獻任何梯度：

- **[0, 0, 0, 0]**：可能對目前的 policy 太難。
- **[1, 1, 1, 1]**：可能太簡單。

如果每條軌跡都失敗，可以換別的任務實例、擴大探索、在 prompt 裡注入提示讓模型比較有機會做對、加入示範（off-policy RL 可以把正確示範放進群組，更簡單的做法是 RL 前先用示範微調），或是給更有資訊量的獎勵，也就是 reward shaping，例如找到正確的檔案就給分。

### GRPO 和 PPO 的關係

GRPO 最初是被當成 PPO 更有效率的替代方案提出的。PPO 另外訓練一個價值模型來估 baseline，GRPO 則用群組相對的 advantage 取代它。價值模型長什麼樣，說法不一：Fried 在課堂上說它通常跟 policy 共用骨幹；DeepSeekMath 論文 §4.1.1 的描述則是「通常是另一個跟 policy 差不多大的模型」，這也是它提出 GRPO 的理由，InstructGPT 的 PPO 就是另外用一個 6B 的價值模型。PPO 的 ratio、clipping 和參考模型的 KL 項留到第 11 講。

## 連回模型：四種方法只差一個權重

Fried 的總結表把整講收成一個式子：

$$\nabla_\theta J = \sum_t w_t\, \nabla_\theta \log \pi_\theta(a_t \mid h_t)$$

| 方法 | 權重 w_t |
|---|---|
| ReST-EM | 成功軌跡為 1，其餘為 0（就是在留下來的資料上做 SFT） |
| REINFORCE | 這個動作所屬軌跡的獎勵 R(τ) |
| GRPO／DrGRPO | Â_j，跟同一任務其他 rollout 比較後的相對獎勵 |

回到開場的三個缺口：

- **任務不對齊**：目標就是期望獎勵，任何成功的軌跡都會被強化。
- **資料不對齊**：只要 baseline 設對，獎勵為 0 的軌跡也能學。
- **曝光偏差**：軌跡來自當下的 policy，Fried 的比喻是訓練時就是模型自己在開車，所以它得學會從自己的錯誤中恢復。

代價是要在環境裡一直試，這可能很貴，也會把雜訊帶進梯度。本講處理了一部分，第 11、12 講會處理其他部分。

## 對做 agent 的工程師，這一講改變什麼

- **先看你的 loss 遮罩對不對。** 自己寫 RL 訓練時，工具回傳與 prompt 的 token 必須 m=0。遮罩錯了，模型會被訓練去「預測環境」，而不是學做決策。
- **先檢查群組獎勵有沒有變化。** 跑 GRPO 前，拿幾題各抽 8 次看獎勵分布。全 0 或全 1 的題目占多數，就先調題目難度或先做 SFT 暖身，不要直接開訓。
- **二元獎勵先試 ReST。** 它完全沿用 SFT 管線，是驗證「這個環境的獎勵訊號學得起來嗎」最便宜的方式。

## 想深入

本講官方課表列的指定讀物：

- [ReST: Reinforced Self-Training for Language Modeling](https://arxiv.org/abs/2308.08998)（Gulcehre et al., 2023）
- [Beyond Human Data: Scaling Self-Training for Problem-Solving with Language Models](https://arxiv.org/abs/2312.06585)（ReST-EM，Singh et al., 2023）
- [DeepSeekMath](https://arxiv.org/abs/2402.03300)（Shao et al., 2024），GRPO 的目標函數在 §4.1.1，群組標準化的 advantage 在 §4.1.2
- [Understanding R1-Zero-Like Training: A Critical Perspective](https://arxiv.org/abs/2503.20783)（DrGRPO，Liu et al., 2025）

官方課表另列 Sean Welleck 在 CMU ANLP 的 [RL Fundamentals 講義](https://cmu-l3.github.io/anlp-spring2026/static_files/anlp-s2026-16-rl.pdf)，本講投影片第 7 頁（RL 怎麼補 SFT 的三個缺口）就是改編自這份講義。

站內延伸閱讀（從不同角度講同一批演算法，不取代本講）：

- [CS336 Lecture 15：SFT 教模型模仿，RLHF 才開始直接最佳化偏好](/posts/ai/2026-08-22-cs336-sft-rlhf)
- [CS336 Lecture 16：RLVR 用可驗證獎勵擴大推理，但 GRPO 不是免費的 PPO](/posts/ai/2026-08-22-cs336-rlvr)
- [Deep Reinforcement Learning：把 RLHF 放回強化學習的框架裡](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf)（CS230）
- [CME295 第 5 講：RLHF 與 DPO 怎麼補上負面訊號](/posts/ai/2026-09-29-cme295-preference-tuning)
- [CME295 第 6 講：reasoning model 怎麼學會想久一點，GRPO 又省掉了 PPO 的什麼](/posts/ai/2026-09-29-cme295-llm-reasoning)

## 參考資料

- [CMU 11-768 AI Agents 課程官網](https://www.cmu-agents.com/)
- [Lecture 9 投影片：RL Foundations for Agents](https://www.cmu-agents.com/slides/lecture-09-rl-basics.pdf)
- [Lecture 9 錄影](https://www.youtube.com/watch?v=paAcPaaYZGM)
- [Williams, 1992. Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning](https://doi.org/10.1007/BF00992696)（*Machine Learning* 8, 229–256；[UMass CS687 課程頁的公開副本](https://people.cs.umass.edu/~barto/courses/cs687/williams92simple.pdf)。REINFORCE 的定義與 reinforcement baseline 在 §4，episodic REINFORCE 在 §5；文中的推導依投影片，符號與論文不同）
- [Gulcehre et al., 2023. Reinforced Self-Training (ReST) for Language Modeling](https://arxiv.org/abs/2308.08998)
- [Singh et al., 2023. Beyond Human Data: Scaling Self-Training for Problem-Solving with Language Models](https://arxiv.org/abs/2312.06585)
- [Shao et al., 2024. DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300)
- [Ouyang et al., 2022. Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)（Appendix C.4，PPO 的獨立價值模型）
- [Liu et al., 2025. Understanding R1-Zero-Like Training: A Critical Perspective](https://arxiv.org/abs/2503.20783)
- [DeepSeek-AI, 2025. DeepSeek-R1](https://arxiv.org/abs/2501.12948)
- [Lewis et al., 2017. Deal or No Deal? End-to-End Learning for Negotiation Dialogues](https://arxiv.org/abs/1706.05125)
- [Sean Welleck, CMU ANLP Spring 2026. RL Fundamentals](https://cmu-l3.github.io/anlp-spring2026/static_files/anlp-s2026-16-rl.pdf)
