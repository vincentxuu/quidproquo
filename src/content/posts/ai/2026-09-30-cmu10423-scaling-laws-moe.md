---
title: "CMU 10-423 L15–L16：Scaling laws 與 Mixture of Experts——模型該多大，大了又怎麼只算一部分"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, scaling-laws, mixture-of-experts, moe, llm, training-data]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 16
tldr: "CMU 10-423 Spring 2026 的 Scaling Up 單元前兩講回答兩個問題。L15 後半講 scaling laws：Kaplan 2020 說模型放大 8 倍、資料約 5 倍就夠，Chinchilla 改說兩者要等比例放大，接著用 Phi 系列與資料過濾的 scaling law 補上「資料品質」這個第三條軸。L16 講 MoE：前饋層佔了 GPT-3 大半參數，把它切成專家、每個 token 只走 top-k 條，記憶體跟著總參數、計算跟著活躍參數，代價是負載平衡與訓練穩定性。這段後半沒有程式作業，驗收靠小考、練習考卷第 13 題與期末專案。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）Lecture 15 後半與 Lecture 16 導讀：power law 的定義、Kaplan 2020 的實驗設計與七個結論、Chinchilla 的等比例放大、Phi 系列與 data filtering scaling law；MoE 從前饋層參數佔比、dense 與 sparse gating、noisy top-k、expert parallelism 與 capacity、load balance 與 router z-loss，到活躍參數與專家數的選擇。含投影片版本與校外可取得範圍的說明。"
draft: false
glossary:
  - term: "活躍參數"
    aliases: ["active parameters", "active params"]
    definition: "MoE 模型處理一個 token 時，被 router 選中、實際參與計算的參數量。總參數決定要放多少記憶體，活躍參數決定每個 token 要花多少 FLOPs。"
    context: "L16 投影片舉 Mixtral（8 個專家選 2 個）與 OLMoE（64 個專家選 8 個）說明兩者的差別。"
  - term: "router z-loss"
    aliases: ["z-loss", "Router Z-loss"]
    definition: "加在 MoE 訓練目標上的正則項，懲罰 router 輸出過大的 logit，讓訓練更穩定。"
    context: "L16 投影片以 OLMoE 的做法為例，把它和 load balance loss 一起加進總 loss。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 16 篇，進入第五個單元「Scaling Up」。上一篇 [HW4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image) 是最後一份程式作業；從這裡開始，課程改用小考、HW623（只限 10-623／723）與期末專案驗收。

用到的官方材料：[Lecture 15 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)（37 頁，前半 Querying Transformer 已在 [order 14](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer) 講過，本篇只看 Scaling Laws 段）、[Lecture 16 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf)與[手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe-ink.pdf)、[課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)，以及 [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)上的練習考卷。全部在 2026-09-30 下載核對。講次表這兩講沒有列 readings，本文引用的論文都是投影片上標註的出處。

> **版本說明**：講次表 3 月 16 日 Lecture 16 連到的兩份 PDF，封面寫「Matt Gormley & Pat Virtue, Mar. 17, 2025」，提醒頁是 Spring 2025 的 HW4 日期，PDF 建立時間也是 2025 年 3 月。也就是說 Spring 2026 沿用了去年的 MoE 投影片。L15 的 Scaling 段註明「Scaling slides credit: Pat Virtue」。錄影只放在 CMU 內部的 Panopto，校外看不到，所以本篇完全依投影片撰寫。

## 為什麼這一段接在多模態之後

講次表把 L15–L18 歸在「Scaling Up」。前 14 講一直在問「模型長什麼樣、怎麼訓練」，這一段換成工程問題：錢和 GPU 有限時，模型該多大、要餵多少資料，放不下時又怎麼辦。

這四講分工清楚：L15–L16 回答「要多大」與「大了能不能少算一點」，[下一篇](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference)的 L17–L18 回答「怎麼跑得動」。

## L15 後半：Scaling laws

### 從一個問題開始

Scaling 段開頭放了兩條時間軸，文字模型與影像生成模型各一條，問一個問題：Transformer 2017 年出現、立刻統治 NLP，為什麼 Vision Transformer 要到 2021 年才出現？投影片沒有直接給答案，而是接一張 LLM 規模表，從 GPT-2 列到 LLaMA-3，並在旁邊寫下這一段的引導問題：**Meta 是怎麼決定訓練 token 數與模型參數的這個組合？**

表中的幾個數字（投影片原樣）：

| 模型 | 年份 | 訓練 token | 參數 |
|---|---|---|---|
| GPT-2 | 2019 | 約 100 億 | 15 億 |
| GPT-3 | 2020 | 3,000 億 | 1,750 億 |
| Chinchilla | 2022 | 1.4 兆 | 700 億 |
| LLaMA-2 | 2023 | 2 兆 | 700 億 |
| LLaMA-3 | 2024 | 15 兆 | 4,050 億 |

接著一張「訓練 Llama 要花多少錢」的練習：給了 GPU 單價（約 1.5 萬美元）、雲端 GPU 每小時 1–4 美元、700W 功耗的電費，讓你估 Llama-3 70B 的訓練成本。答案欄在投影片上是空的，講次表也沒有 L15 的手寫版。

### Power law 與 Kaplan 2020

大多數 LLM 的 scaling law 都假設損失與某個量之間是 **power law（冪律）**，形式是 $f(x) = c\,x^{-k}$。投影片並排畫了線性座標與 log-log 座標的同一條曲線：在 log-log 圖上它是一條直線。

[Kaplan et al. 2020](https://arxiv.org/abs/2001.08361) 的實驗設計，投影片列了會變動的超參數：參數量 N（768 到 15 億）、資料量 D（2,200 萬到 230 億 token）、計算量 C、模型形狀（深度、寬度、head 數）、上下文長度（最多 1024）與 batch size，然後量每個模型的測試損失。

投影片逐條標出的七個結論：

1. 三個量主導表現：參數 N、token 數 D、FLOPs C。
2. 模型形狀影響不大。
3. 只要 N 和 D 一起增加，表現就會變好。
4. 訓練／測試損失曲線遵循可預測的 power law。
5. 大模型的樣本效率更高。
6. 不需要訓練到收斂也能有好表現。
7. 最佳 batch size 也遵循 power law，而且很大（100–200 萬 token）。

最後一頁引了 Kaplan 的一句話：模型每放大 8 倍，資料只需要放大約 5 倍就不會吃虧。然後下一句是：「但 Hoffmann et al. (2022) 講的是完全不同的故事。」

### Chinchilla：大家的資料都太少了

[Hoffmann et al. 2022](https://arxiv.org/abs/2203.15556)（Chinchilla）的設計是固定計算量 C，同時變動 D 和 N，量出 L(N, D)，擬合一個能預測任意 N、D 下損失的模型，再用它推算最佳模型大小。

投影片的重點只有一句：**大家用的資料都太少了。** Kaplan 說參數放大 8 倍配 5 倍 token，Chinchilla 則說兩者要等比例放大（參數 2 倍、token 2 倍）。同樣的計算預算下，把模型縮小、資料加多，表現會好很多。投影片沒有替 Meta 寫出答案，但開頭那個引導問題，要靠這一頁的結論去讀：同一張表裡，Chinchilla 用 700 億參數配 1.4 兆 token，比 GPT-3 的 1,750 億參數配 3,000 億 token 小得多、資料多得多。

### 第三條軸：資料品質

最後一小段叫「Adjusting quality of data」：

- **Phi 系列**：不放大模型或資料，而是提高資料品質。[Phi-1（Textbooks Are All You Need）](https://arxiv.org/abs/2306.11644)在程式任務上的表現可以比肩大很多的模型，[Phi-1.5](https://arxiv.org/abs/2309.05463) 把同樣的結論推到一般 LLM。
- **資料過濾的 scaling law**：[Goyal et al. 2024](https://arxiv.org/abs/2404.07177) 處理數量、品質、計算三者怎麼取捨，投影片摘的結論是：計算量愈大，資料可以過濾得愈少。

<details>
<summary>練習考卷怎麼考這一段</summary>

[Spring 2026 練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)的第 13 大題「Scaling Laws」（4 分）題幹涵蓋：計算預算與資料過濾的關係、Hoffmann 研究對模型大小與資料的結論、測試損失隨參數量的變化、為什麼單純放大模型會邊際遞減、Phi 系列的關鍵洞見，另有兩題 MoE 簡答（為什麼 MoE 比較有效率、為什麼 MoE 難訓練）。解答在[另一份 PDF](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)，建議先自己寫再對。

L18 投影片的提醒頁寫明，3 月 30 日晚上的考試（Exam）涵蓋 Lectures 1–15，所以 scaling laws 在考試範圍內，MoE 不在；講次表的 Quiz 5 範圍是 L16–L20。
</details>

## L16：Mixture of Experts

### 參數都在前饋層

L16 從一張 GPT-3 參數分解表出發（出處是 [OLMoE 論文](https://arxiv.org/abs/2409.02060)）：總共 1,745.7 億參數裡，前饋層佔 1,159.7 億，attention 佔 579.9 億，embedding 只有 6.2 億。投影片要你自己算每一種層的參數怎麼來。

結論是 Transformer LLM 過半參數在前饋層，所以要動刀就從這裡動。

### 把一層切成專家

投影片用兩步說明「專家」是什麼：

1. 一個線性層 $z = Wx + b$ 可以按列切成三塊 $z_i = W_i x + b_i$，總參數不變。
2. 一個前饋層 $y = U\sigma(Wx + b) + c$ 也能切成三個小前饋網路；當 $W$、$b$、$U^T$ 是三塊堆疊而成時兩者等價。投影片把 $c$ 應該是什麼留成填空題。

注意投影片的附註：MoE 裡每個專家不是線性層，而是一個有一層隱藏層的前饋網路。

### Dense 與 sparse gating

MoE 的輸出是加權和 $y = \sum_{i=1}^{N_e} G(x)_i E_i(x)$，差別在 gate $G$：

- **Dense MoE**：$G(x) = \text{softmax}(x \cdot W_g)$，每個專家都有非零權重。
- **Sparse MoE**：$G(x) = \text{softmax}(\text{topk}(x \cdot W_g + b_g, k))$，只保留分數最高的 k 個。投影片寫明 sparsely-gated MoE 最早是為 RNN 提出，但方法通用，現在主要用在 Transformer。
- **Noisy top-k**：在 gate 分數上加一項由輸入決定大小的高斯雜訊。
- **Mixtral**：同樣的 top-k gating，但每個專家換成 SwiGLU 前饋網路（[Mixtral 論文](https://arxiv.org/abs/2401.04088)）。

初始化也有一個小細節：$W_g$ 和 $W_{noise}$ 初始化為全零，一開始等於沒有訊號、只有少量雜訊。

### 分到不同 GPU 就會塞車

**Expert parallelism** 把每個專家放在不同的 GPU，每個 token 送到 k 個專家。投影片用兩個小例子說明問題：3 台裝置、每台容量 3 個 token，6 個 token 且 k = 1 時，有的裝置滿了、有的閒著；4 個 token 且 k = 2 時，token 3 被分到已經滿的裝置，就放不進去。

放任不管的話，gate 會集中到訓練早期碰巧受歡迎的少數專家。投影片給的解法（OLMoE 的做法，並註明有很多變體）是在 loss 上加兩個正則項：

$$L = L_{CE} + \alpha L_{LB} + \beta L_{RZ}$$

- **Load balance term** $L_{LB} = N_e \sum_i f_i P_i$：$f_i$ 是這個 batch 裡被送到專家 i 的 token 比例，$P_i$ 是分給專家 i 的機率，鼓勵負載分散。
- **Router z-loss** $L_{RZ}$：懲罰 router 的大 logit，穩定訓練。

### 活躍參數：記憶體和計算分開算

top-k 的 k 通常選得很小。投影片的兩個例子：Mixtral k = 2、$N_e$ = 8；OLMoE k = 8、$N_e$ = 64。

**活躍參數**是被 router 選中、實際參與計算的參數量。粗略來說：

- GPU 記憶體需求 ∝ 總參數
- FLOPs 計算需求 ∝ 活躍參數

這就是 MoE 的取捨：用更多記憶體換每個 token 更少的計算。投影片接著放了 Mixtral 與 Llama-2 的比較、OLMoE 的超參數表，以及 OLMoE 論文的「表現 vs. 成本」圖，結論是 MoE 在表現與 FLOPs 之間提供不錯的折衷。

### 專家該選幾個

最後兩頁對比兩個時期：早期在 LSTM 語言模型上的 MoE 偏好非常多的專家；近期 Transformer LM 則偏好相對少的專家。收尾一頁是 [Clark et al. 2022](https://proceedings.mlr.press/v162/clark22a.html) 的 routed LM scaling law，把本講接回 L15 的主題。

## 自學怎麼讀這兩講

1. L15 先只看 Scaling 段（投影片右下角編號 13 之後），把 Kaplan 的七個結論與 Chinchilla 的一句話對照，寫下兩者對「參數放大 8 倍時資料要放大幾倍」的不同答案。
2. 自己算一次 GPT-3 各層的參數（L16 投影片編號 8 的練習），確認前饋層為什麼佔大半。
3. 用 L16 投影片編號 21–22 的兩個 expert parallelism 例子，手算哪些 token 被丟掉。
4. 最後做練習考卷第 13 大題，再對解答。

**怎麼做**：今晚打開 L16 投影片編號 12 那一頁，把「前饋層切成三個專家時 $c$ 該是什麼」這個填空寫出來。寫得出來，就代表你懂了專家其實只是把一個大前饋層重新分組。

## 這一篇可以確認與不能確認的

可以確認：兩份投影片的文字、公式與出處標註，講次表日期與小考範圍，L18 提醒頁的考試範圍，練習考卷第 13 題的題幹。不能確認：課堂口頭講解與板書（錄影在 Panopto，L15 沒有手寫版）、Llama 成本練習的官方答案、投影片中只有圖、文字抽不出來的數據（例如 Mixtral vs. Llama-2 的比較數字）。

## 延伸閱讀

- Scaling law 怎麼從小實驗外推：[CS336 Lecture 9：Scaling law 不是水晶球](/posts/ai/2026-08-22-cs336-scaling-laws-foundations)、[CS336 Lecture 11：Scaling law 落地時，learning rate 與 batch 也要一起縮放](/posts/ai/2026-08-22-cs336-scaling-laws-practice)
- MoE 在架構選擇裡的位置：[CS336 Lecture 4：Attention 不只一種，MoE 也不是免費擴大模型](/posts/ai/2026-08-22-cs336-attention-moe)
- MoE 的系統面（專家平行、通訊）：[CMU 11-868 L16–L17：模型放不進一張卡時](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)

系列導覽：上一篇 [HW4：用 Q-Former 做文生圖](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)｜下一篇 [L17–L18：分散式訓練、Flash Attention 與高效解碼](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L15、L16 日期與 Quiz 4／5 範圍
- [Lecture 15 投影片：Querying Transformer + Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Lecture 16 投影片：Mixture of Experts](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf)、[手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe-ink.pdf)
- [Lecture 18 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf) — 考試範圍 L1–L15
- [Spring 2026 練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)、[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Kaplan et al. 2020：Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Hoffmann et al. 2022：Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)
- [Gunasekar et al. 2023：Textbooks Are All You Need](https://arxiv.org/abs/2306.11644)
- [Li et al. 2023：Textbooks Are All You Need II: phi-1.5 technical report](https://arxiv.org/abs/2309.05463)
- [Goyal et al. 2024：Scaling Laws for Data Filtering](https://arxiv.org/abs/2404.07177)
- [Cai et al. 2024：A Survey on Mixture of Experts in Large Language Models](https://arxiv.org/abs/2407.06204)
- [Muennighoff et al. 2024：OLMoE: Open Mixture-of-Experts Language Models](https://arxiv.org/abs/2409.02060)
- [Jiang et al. 2024：Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [Clark et al. 2022：Unified Scaling Laws for Routed Language Models (ICML)](https://proceedings.mlr.press/v162/clark22a.html)
