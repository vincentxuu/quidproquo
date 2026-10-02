---
title: "CS224R L2：模仿學習與能表達多峰分佈的 policy"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, imitation-learning, flow-matching, reinforcement-learning]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 2
tldr: "CS224R Spring 2026 第二講處理模仿學習的兩個失敗模式。第一個是示範有多種合理做法時，回歸只學到平均值；解法是把 policy 換成生成模型（高斯混合、離散化加自迴歸、diffusion／flow matching），再加上 action chunking。第二個是 compounding errors：policy 一犯錯就走到示範沒涵蓋的狀態；解法是 DAgger 和 human-gated DAgger 收集修正資料。前兩部分就是 HW1 的內容。"
description: "Stanford CS224R（Spring 2026）第二講導讀：依官方 02_cs224r_imitation_2026 投影片與課表指定讀物（Diffusion Policy、ALOHA/ACT），整理為什麼模仿學習需要表達力夠的 policy 分佈、flow matching 的訓練與取樣迴圈、action chunking、compounding errors 與 DAgger、human-gated DAgger，以及機器人示範怎麼收集。配套影片為 Spring 2025 L2（補充）。"
draft: false
glossary:
  - term: "behavior cloning"
    aliases: ["BC", "行為複製"]
    definition: "用監督學習直接模仿示範資料裡的 (狀態, 動作) 配對來訓練 policy；完全 offline，不需要獎勵函數。"
    context: "CS224R L2 的 Part 1，也是 HW1 Problem 1–2 的主題。"
  - term: "compounding errors"
    aliases: ["累積誤差", "covariate shift"]
    definition: "policy 的小錯誤把它帶到示範資料沒涵蓋的狀態，在那裡更容易犯錯，錯誤因此越滾越大。"
    context: "根源是 policy 的輸出會影響下一個輸入，違反監督學習的 i.i.d. 假設。"
  - term: "DAgger"
    aliases: ["dataset aggregation"]
    definition: "讓學到的 policy 實際跑，在它走到的狀態上詢問專家該怎麼做，把這些修正加回資料集再訓練。"
    context: "CS224R L2 用它處理 compounding errors，HW1 Problem 3 要實作。"
  - term: "action chunking"
    aliases: ["動作分塊"]
    definition: "policy 一次預測未來 k 步的動作，執行其中一段後再重新決策，而不是每一步都重新預測。"
    context: "出自 ALOHA/ACT 與 Diffusion Policy；HW1 的 policy 一次預測 20 步、執行前 10 步。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-imitation-learning-en)

> **來源年份**：依據 Spring 2026 的 [02_cs224r_imitation_2026 投影片](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)（2026-04-03）。配套影片是 [Spring 2025 L2 錄影（補充）](https://www.youtube.com/watch?v=WxRDyObrm_M)，標題相同，但投影片已改成 2026 版，細節可能不同。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 2 篇。

[上一講](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)停在一個問題：示範資料裡同一個情境有兩種合理做法時，用 ℓ2 回歸訓練的 policy 會學到兩者的平均值，一個沒有人示範過的動作。這一講就從這裡開始。

投影片把今天的計畫分成三段，並標明前兩段就是 [HW1](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf) 的主題：

1. 學習表達力夠的 policy 分佈
2. 從線上介入學習
3. 有時間的話：怎麼收集示範

學習目標也寫得很具體：怎麼用神經網路表示分佈、為什麼表達力對模仿學習很重要、什麼是 compounding errors 以及怎麼處理。

課表在這一講列了兩篇 optional reading：[Diffusion Policy（Chi et al.）](https://arxiv.org/abs/2303.04137v5) 和 [Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware（Zhao et al.，也就是 ALOHA/ACT）](https://arxiv.org/abs/2304.13705)。

## 第一個問題：平均值不是答案

L1 最後的結論是：離散動作可以用 categorical 分佈表示，表達力最強；連續動作如果讓網路輸出 μ 和 σ，得到的是單峰的 Gaussian，表達力不夠。

這一講的解法是一句話：**借用生成模型**。影像 diffusion 模型學的是 p(影像 | 文字描述)，自迴歸語言模型學的是 p(下一個字 | 前面的字)。模仿學習要學的是 p(動作 | 觀測)，結構完全一樣。

所以 **imitation learning version 1** 改成：

1. 給定專家示範
2. 訓練一個專家動作的生成模型：最小化 −E₍ₛ,ₐ₎∼𝒟[log πθ(a | s)]，也就是讓示範動作在 policy 底下的 log 機率越大越好，而且 π(· | s) 要是一個表達力夠的分佈
3. 部署

投影片列了三種生成模型：

| 做法 | 網路輸出 | 怎麼表示多峰 |
|---|---|---|
| 高斯混合（GMM） | μ₁, σ₁, w₁, μ₂, σ₂, w₂, … | 多個 Gaussian 加權疊起來 |
| 離散化＋自迴歸 | p(aₜ,₁)、p(aₜ,₂ \| âₜ,₁)、p(aₜ,₃ \| âₜ,₁:₂)… | 每個動作維度切成離散 bin，一維一維依序預測 |
| Diffusion | 每一步的雜訊 ϵₙ | 從雜訊開始反覆去噪 |

投影片在這裡丟了一個問題：這些做法和「用更大的網路做 ℓ2 回歸」有什麼不同？它給的提示是一句粗體：

> 神經網路的表達力，常常和分佈的表達力是兩回事。

網路再大，只要輸出層是「一個數字配 ℓ2 loss」，它能表示的就只有一個點，最佳解還是平均值。要表示兩個峰，必須改的是**輸出的分佈族**，不是網路深度。

## Flow matching：把雜訊搬到資料上

投影片用最多頁數解釋 diffusion 的一種：flow matching。起點是：Gaussian 我們會取樣，資料分佈我們不會。能不能學一個轉換，把 Gaussian 的樣本變成資料分佈的樣本？

**Idea 0（行不通）**：隨機抽一筆資料 xᵢ 和一個雜訊 ϵ，訓練模型 fθ(ϵ) → xᵢ。問題是雜訊和資料是隨便配對的，模型沒有理由利用雜訊去對應到不同的資料點，最後又退回平均值。

**真正的做法**：不直接預測終點，改成學一個**速度場** vθ，一小步一小步把雜訊推向資料。

<details>
<summary>訓練與取樣迴圈（投影片原樣整理）</summary>

訓練：

1. 抽一筆資料 x₁ ∼ D，和雜訊 x₀ ∼ 𝒩(0, I)
2. 抽一個時間 t ∼ p(t)，例如 Unif[0, 1]
3. 線性內插：xₜ = t·x₁ + (1 − t)·x₀
4. 最小化 ‖vθ(xₜ, t) − (x₁ − x₀)‖²

取樣：

1. 抽雜訊 x₀ ∼ 𝒩(0, I)
2. 對 t ∈ {0, δ, 2δ, …, 1 − δ}，做 xₜ₊δ ← xₜ + v(xₜ, t)·δ（用 Euler 法積分 ODE）
3. 回傳 x₁

</details>

直覺是：在內插線上任何一點，正確的「前進方向」都是 x₁ − x₀。模型看到的是 xₜ 和 t，要學會預測這個方向。取樣時從雜訊出發，沿著學到的方向走完 t 從 0 到 1 的路，就走到一個像資料的點。不同的起點雜訊會走到不同的峰，所以多峰分佈表示得出來。

用在模仿學習時，投影片的說法是學一個**條件**速度場：對動作 aₜ 去噪，條件是狀態 sₜ。投影片也附了 Peter Roelants 的 [flow matching 入門文章](https://peterroelants.github.io/posts/flow_matching_intro/)當視覺化來源。HW1 Problem 2 要你親手實作這個 schedule 和 loss。

**效果有多大？** 投影片放了兩組結果，來源是 [Diffusion Policy](https://diffusion-policy.cs.columbia.edu/) 和 [ALOHA Unleashed](https://aloha-unleashed.github.io/) 的專案頁。模擬搬運任務上，只用單一示範者的資料時，diffusion 和 GMM 差不多；換成多人示範資料，GMM 的成功率掉到一半以下，diffusion 仍然接近九成。真實掛衣服任務（多人資料）上，diffusion 也明顯高過 L1 回歸。

**多人資料就是多峰資料。** 這張圖的重點在這裡，不在誰高幾個百分點。

投影片接著列出產業界的例子，標註各自用哪種分佈：機器人方面，Physical Intelligence π0.6、NVIDIA GR00T、Figure Helix 用 diffusion，OpenVLA 用離散化加自迴歸；自動駕駛方面，Waymo EMMA 和 Wayve LINGO-2 都是離散化加自迴歸。

## 另一個技巧：action chunking

到目前為止 policy 都是 π(aₜ | sₜ)。如果控制頻率是 50 Hz，每 20 ms 就要做一次新決定。

替代做法是讓 policy 根據 sₜ 預測一段動作 aₜ:ₜ₊ₖ，每 k 步才重新決策一次，中間那段動作 open loop 執行。投影片給的理由有兩個：

1. 實際上常常好很多
2. policy 推論有更多時間可以算

投影片把 ALOHA 和 Diffusion Policy 列為提出 action chunking 的原始論文，另外附了三篇後續分析：[Action Chunking and Exploratory Data Collection…](https://arxiv.org/pdf/2507.09061)、[Bidirectional Decoding](https://arxiv.org/pdf/2408.17355)、[Real-Time Execution of Action Chunking Flow Policies](https://arxiv.org/pdf/2506.07339)。

HW1 直接用上這個技巧：Flappy Bird 的 policy 一次預測 20 個目標位置，只執行前 10 個就重新查詢 policy，作業稱之為 receding horizon control。

**第一部分的小結**，投影片用兩欄對照：示範者只有一位而且行為一致時，單峰分佈就夠；資料來自多位示範者時，就需要表達力夠的生成模型。這種做法完全 offline：

- 優點：不需要 policy 自己收資料（線上資料可能不安全、昂貴），也不需要定義獎勵函數
- 缺點：可能需要很多資料才能穩定表現

## 第二個問題：錯誤會自己長大

監督學習裡，輸入 x 和模型預測的標籤 ŷ 無關。行為的監督學習不是這樣：**預測的動作會影響下一個狀態**。policy 犯一個小錯，就走到一個離示範資料稍遠的狀態；在那裡它更不熟、更容易犯錯，於是越走越偏。

投影片把這寫成 p_expert(s) ≠ p_π(s)：專家走過的狀態分佈，和學到的 policy 實際走到的狀態分佈不一樣。這就是 **covariate shift**，錯誤會 compound。

解法有兩種。第一種是「收集超多示範資料，然後祈禱」。第二種是收集**修正行為**的資料：policy 偏掉之後，該怎麼回到正軌。

### DAgger：在 policy 走到的地方問專家

**DAgger（dataset aggregation）** 的迴圈是：

1. 讓學到的 policy πθ 實際跑，得到 s′₁, â₁, …, s′_T
2. 在它走到的每個狀態上詢問專家：a* ∼ π_expert(· | s′)
3. 把修正加回資料集：𝒟 ← 𝒟 ∪ {(s′, a*)}
4. 用新的資料集更新 policy

優點是向專家學習的資料效率高。缺點是 agent 在控制時，要專家即時說出「這裡該怎麼做」可能很難。想像你坐在副駕，車子由一個還不太會開的 policy 在開，你得每一刻都說出正確的方向盤角度。

### Human-gated DAgger：讓專家直接接手

投影片問：有沒有別的方式收集修正資料？答案是讓專家**完全接手**：

1. 讓 policy 開始跑
2. policy 犯錯時，專家在時間 t 介入
3. 專家提供（部分）示範 s′ₜ, a*ₜ, …, s′_T
4. 把 t 之後的新示範加回資料集
5. 更新 policy

這叫 **human-gated DAgger**（HG-DAgger）。優點是修正的介面實際得多；缺點是在某些應用領域，很難及時發現錯誤。投影片留了一個問題：能不能自動偵測什麼時候需要介入？

HW1 Problem 3 實作的是用確定性專家做 relabeling 的 DAgger 版本，細節見本系列的 [HW1 篇](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger)。

## 示範從哪裡來

最後一段講收集示範。有些領域的人本來就在產生可以記錄的示範，例如開車、打字傳訊息。機器人就沒那麼簡單，投影片比較了三種介面：

| 方式 | 優點 | 缺點 |
|---|---|---|
| Kinesthetic teaching（直接用手帶機器人） | 介面簡單 | 人會出現在畫面裡 |
| 遙控器 | — | 介面好不好用差很多，延遲可能很高 |
| Puppeteering（操作一套對應的主控手臂） | 介面簡單 | 需要兩套硬體 |

有些領域根本收不到示範，例如四足機器人。那能不能直接用人或動物的影片？投影片指出 embodiment gap：外觀不同，身體能力和自由度也不同。直接模仿很難，但可以拿來引導探索，例子是 [Peng et al. 2018 的 SFV](https://arxiv.org/abs/1810.03599)。

## 這一講的總結

投影片的最後一頁把兩部分並排：

- **Part 1：模仿 offline 示範**，常叫 behavior cloning（BC）。policy 最好是動作的生成模型，演算法完全 offline。
- **Part 2：用線上介入改進 policy**，常叫 DAgger 或 HG-DAgger。需要專家介入的介面，演算法要讓 policy 線上跑。

共同的優點是不需要定義獎勵函數。offline BC 簡單，不需要 policy 自己的資料；DAgger 是通往穩定表現的可能路徑，資料效率比 offline BC 高。

共同的限制有兩個：要穩定表現可能需要多到不實際的資料量；而且**模仿學習沒有提供「靠自己練習變強」的框架**。這正是下一講 policy gradient 要補的東西。投影片最後一句是：很多成功的方法都結合了模仿學習和強化學習。

## 今晚可以做的事

不用 GPU 就能驗證「平均值不是答案」：

```python
import numpy as np
rng = np.random.default_rng(0)
# 兩群示範者：一群往左切（-2），一群直行（0）
a = np.concatenate([rng.normal(-2, 0.2, 250), rng.normal(0, 0.2, 750)])
print("ℓ2 回歸的最佳常數解（平均值）:", a.mean())
print("落在平均值附近 ±0.2 的示範比例:", np.mean(np.abs(a - a.mean()) < 0.2))
```

平均值附近幾乎沒有示範。接著下載 [HW1 起始碼](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip)，先讀 `networks.py` 裡 `FlowMatchingSchedule` 的 TODO 和 docstring，對照上面折疊區的訓練迴圈，想清楚 `interpolate` 和 `sample` 各自對應哪幾行。

## 延伸閱讀

- [Berkeley CS285 L1–4：模仿學習、分布偏移與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)：DAgger 和分布偏移的另一種講法
- [擴散模型：正向加噪、反向生成與 ELBO（CS229 講義第 14 章）](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models)：diffusion 的數學背景
- [CME295：Diffusion LLM](/posts/ai/2026-09-29-cme295-diffusion-llms)：同一套雜訊與去噪框架用在語言模型

**系列導覽**：上一篇 [L1：把做決策寫成 RL 問題](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)｜下一篇 [HW1：Flappy Bird 模仿學習](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [Lecture 2 投影片：Imitation Learning（2026）](https://cs224r.stanford.edu/slides/02_cs224r_imitation_2026.pdf)
- [Spring 2025 Lecture 2: Imitation Learning（YouTube，補充）](https://www.youtube.com/watch?v=WxRDyObrm_M)
- [HW1 PDF（2026）](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)
- [Chi et al. Diffusion Policy: Visuomotor Policy Learning via Action Diffusion](https://arxiv.org/abs/2303.04137v5)
- [Zhao et al. (2023). Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://arxiv.org/abs/2304.13705)
- [Diffusion Policy 專案頁](https://diffusion-policy.cs.columbia.edu/)
- [ALOHA Unleashed 專案頁](https://aloha-unleashed.github.io/)
- [Peter Roelants, Flow Matching Intro](https://peterroelants.github.io/posts/flow_matching_intro/)
- [Action Chunking and Exploratory Data Collection Yield Exponential Improvements in Behavior Cloning for Continuous Control](https://arxiv.org/pdf/2507.09061)
- [Bidirectional Decoding: Improving Action Chunking via Guided Test-Time Sampling](https://arxiv.org/pdf/2408.17355)
- [Real-Time Execution of Action Chunking Flow Policies](https://arxiv.org/pdf/2506.07339)
- [Peng et al. (2018). SFV: Reinforcement Learning of Physical Skills from Videos](https://arxiv.org/abs/1810.03599)
