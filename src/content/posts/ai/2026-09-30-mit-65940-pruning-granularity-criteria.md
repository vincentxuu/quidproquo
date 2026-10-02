---
title: "MIT 6.5940 L3 Pruning I：剪哪裡、剪多細、依什麼標準剪"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, pruning, deep-learning, cnn]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 2
tldr: "Pruning 是把神經網路裡不重要的權重或神經元拿掉，目標寫成「在非零權重數不超過 N 的限制下讓 loss 最小」。6.5940 第 3 講先處理其中兩個決定。第一是粒度：從任意位置都能剪的 fine-grained，到整個通道一起剪的 channel pruning，越規則越容易在現有硬體上變快，但能剪掉的比例越小；介於中間的 2:4 sparsity 在 NVIDIA Ampere GPU 上最多快 2 倍。第二是準則：看權重大小、看 Batch Norm 縮放係數、看二階導數、看 activation 有多少是零，或看剪完後輸出重建得多好。"
description: "MIT 6.5940 Fall 2024 第 3 講 Pruning and Sparsity Part I 導讀：pruning 的問題定義、iterative pruning 與 fine-tuning、fine-grained／pattern-based（N:M）／vector／kernel／channel 等粒度的取捨，以及 magnitude、scaling、second-order、APoZ、regression 五種剪枝準則，並對照 Fall 2026 版投影片。"
draft: false
glossary:
  - term: "pruning"
    aliases: ["剪枝", "neural network pruning"]
    definition: "移除神經網路中不重要的權重（synapse）或神經元，讓模型變小、運算變少。"
    context: "6.5940 第 3–4 講的主題，第 3 講處理粒度與準則。"
  - term: "N:M sparsity"
    aliases: ["2:4 sparsity"]
    definition: "每連續 M 個元素中剪掉 N 個的規則稀疏樣式。2:4 就是每 4 個剪 2 個，稀疏度 50%。"
    context: "L3 投影片引 NVIDIA 資料，指出 Ampere GPU 支援 2:4 sparsity，最多約 2 倍加速。"
  - term: "APoZ"
    aliases: ["Average Percentage of Zeros"]
    definition: "某個通道的輸出 activation 中為零的平均比例。APoZ 越小，代表這個神經元越常有輸出，越重要。"
    context: "L3 用它當挑選要剪哪些神經元的準則之一。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en)

> 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列的第 2 篇，依據 Fall 2024 版。上一篇講了怎麼量模型大小與運算量，這一篇開始真的動手把模型變小。

本篇涵蓋的官方材料：

- Lecture 3 Pruning and Sparsity (Part I)：[投影片](https://www.dropbox.com/scl/fi/6qspcmk8qayy7mft737gh/Lec03-Pruning-I.pdf?rlkey=9jpifc92be0sitiknpbhn9ggf&st=lml94lam&dl=0)（74 頁）、[錄影](https://www.youtube.com/watch?v=EjsB0WgIfUM)

頁碼一律是 PDF 頁數。

## 為什麼從剪枝開始

第 4 頁列出課程第一部分「Efficient Inference」的四個技術：Pruning、Quantization、Neural Architecture Search、Knowledge Distillation。Pruning 排第一。

動機接續上一講的能耗表（第 6 頁）：讀一次 32-bit DRAM 要 640 pJ，遠高於一次運算。權重少了，要搬的資料就少，能耗跟著下降。

投影片也放了一個 LLM 的例子（第 5 頁）。NVIDIA 在 MLPerf Inference v4.1 的 open division 對 Llama 2 70B 做了剪枝：深度從 80 層剪到 32 層，MLP 中間維度從 28,762 剪到 14,336。在單張 H200 上，每秒處理的樣本數從 closed division 的 4,488 提高到 11,189，約 2.5 倍，同時維持 99% 的準確率。

## 問題怎麼寫

第 9 頁把 pruning 寫成一個有限制的最佳化問題：

> argmin_{W_P} L(x; W_P)　subject to　‖W_P‖₀ ≤ N

L 是訓練的目標函數，W 是原本的權重，W_P 是剪枝後的權重。‖W_P‖₀ 計算 W_P 裡非零元素的個數，N 是允許的非零數量。換句話說：只准留 N 個權重，讓 loss 盡量小。

這個式子引出四個要決定的事，也是第 3、4 講的大綱（第 8 頁）：

1. **粒度**：用什麼樣式剪？
2. **準則**：剪哪些 synapse 或 neuron？
3. **比例**：每一層的目標稀疏度是多少？
4. **Fine-tune**：剪完之後怎麼把表現救回來？

本篇講前兩個，後兩個在[下一講](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support)。

## 剪完要再訓練

第 16–20 頁用 [Han et al. 2015](https://arxiv.org/abs/1506.02626) 的實驗曲線，說明剪枝不是一刀了事。圖的橫軸是剪掉的參數比例（40% 到 100%），縱軸是準確率損失，投影片一頁加一條線，共三條：

- **只剪不訓練**：剪得越多，準確率掉得越快
- **剪完 fine-tune**：同樣的剪枝比例，損失明顯變小
- **反覆剪枝加 fine-tune**：一次剪一點、訓練一下、再剪，能剪到最高的比例而損失最小

第 21 頁列出這套方法在幾個經典模型上的結果：

| 模型 | 剪枝前參數 | 剪枝後參數 | 參數減少 | MAC 減少 |
|---|---|---|---|---|
| AlexNet | 61M | 6.7M | 9× | 3× |
| VGG-16 | 138M | 10.3M | 12× | 5× |
| GoogleNet | 7M | 2.0M | 3.5× | 5× |
| ResNet50 | 26M | 7.47M | 3.4× | 6.3× |
| SqueezeNet | 1M | 0.38M | 3.2× | 3.5× |

表上的參數減少倍數和 MAC 減少倍數不一樣，因為被剪掉的權重不一定落在運算量大的層。AlexNet 的參數集中在全連接層，運算集中在卷積層（見[上一篇](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)），所以參數減 9 倍，MAC 只減 3 倍。

第 22 頁是 NeuralTalk LSTM 的圖說生成例子：剪掉 90% 權重後，生成的句子跟原模型幾乎一樣。第 24 頁列出業界的硬體支援，包括 EIE、ESE、SpArch、SpAtten，以及 A100 GPU 上的 2:4 sparsity（投影片寫「2X peak performance, 1.5X measured BERT speedup」）。

## 決定一：粒度

### 從一個 2D 矩陣看

第 29–30 頁先用一個 2D 權重矩陣說明兩個極端：

| | Fine-grained／Unstructured | Coarse-grained／Structured |
|---|---|---|
| 剪哪裡 | 任意位置都能剪 | 只能整排、整塊剪 |
| 彈性 | 高 | 低（是 fine-grained 的子集） |
| 加速 | 難，因為非零位置不規則 | 容易，剪完就是一個比較小的矩陣 |

### 卷積層有四個維度可以選

卷積權重的形狀是 [cₒ, cᵢ, k_h, k_w]，四個維度提供更多種剪法。第 33 頁引 Mao et al. 的分類，由不規則到規則排成一列：

1. **Fine-grained pruning**：任意元素
2. **Pattern-based pruning**：固定樣式
3. **Vector-level pruning**：整條向量
4. **Kernel-level pruning**：整個 k_h × k_w kernel
5. **Channel-level pruning**：整個通道

投影片接著挑三個代表來看。

**Fine-grained**（第 35–37 頁）。彈性最大，通常壓縮率也最高，因為可以在任何地方找「多餘」的權重；上面那張表就是 fine-grained 的結果。缺點寫在第 37 頁：它在某些客製硬體（例如 EIE）上可以加速，但在 GPU 上不容易。

**Pattern-based：N:M sparsity**（第 39–42 頁）。每連續 M 個元素剪掉 N 個。經典例子是 2:4，也就是 50% 稀疏度。剪完的矩陣可以壓成「非零值＋每個值 2-bit 的索引」。投影片引 NVIDIA 的資料：Ampere GPU 架構支援 2:4 sparsity，最多約 2 倍加速，而且在多種任務上通常能維持準確率。它是規則與彈性之間的折衷。

**Channel pruning**（第 44–46 頁）。直接減少通道數，剪完就是一個通道比較少的普通網路，任何硬體都能直接變快。代價是壓縮率比較小。第 45 頁比較兩種做法：每一層都砍 30% 的 uniform shrink，以及各層比例不同的 channel prune（例如 0.5、0.3、0.7、0.2）。第 46 頁引 [AMC](https://arxiv.org/abs/1802.03494) 的結果，在相同 latency 下，各層比例不同的剪法比均勻縮放的 ImageNet 準確率高。各層比例怎麼找，是下一講的主題。

整理起來，粒度是一個取捨軸：越細越能剪、越難加速；越粗越好加速、能剪的越少。選哪一種要看你的硬體支援什麼。

## 決定二：準則

準則回答的是「剪誰」。第 49 頁的原則是：拿掉的參數越不重要，剪完的網路表現越好。問題在於怎麼定義「重要」。

第 49 頁用一個小例子開場：y = ReLU(10x₀ − 8x₁ + 0.1x₂)，如果只能拿掉一個權重，要拿哪一個？直覺是 0.1，因為它對輸出影響最小。這就是 magnitude-based pruning 的想法。

### 剪權重的三種準則

**Magnitude-based**（第 50–53 頁）。絕對值越大的權重越重要。

- 逐元素剪：重要度 = |W|。例如權重 [[3, −2], [1, −5]] 剪一半，會留下 3 和 −5
- 逐列剪（structured）：重要度是一整列的 L1 norm。同一個矩陣，第一列 |3| + |−2| = 5，第二列 |1| + |−5| = 6，剪掉第一列
- 也可以用 L2 norm（√13 對 √26），一般化就是 Lp norm（第 53 頁引 [Wen et al. 2016](https://arxiv.org/abs/1608.03665)）

[Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN) 的 fine-grained 部分就是實作這個準則。

**Scaling-based**（第 54–56 頁）。這是給 filter（輸出通道）用的準則，來自 [Network Slimming](https://arxiv.org/abs/1708.06519)。每個輸出通道配一個可訓練的縮放係數，乘在該通道的輸出上，係數小的通道就剪掉。第 56 頁指出不用另外加參數：Batch Norm 的 γ 本來就是每個通道一個縮放係數，可以直接拿來用。

**Second-order-based**（第 57–62 頁）。這是 LeCun 1989 年 Optimal Brain Damage 的做法：直接估計剪掉一個權重會讓 loss 增加多少。

<details>
<summary>Optimal Brain Damage 的推導</summary>

剪枝造成的 loss 變化用 Taylor 展開：

δL = Σᵢ gᵢ δwᵢ + ½ Σᵢ hᵢᵢ δwᵢ² + ½ Σᵢ≠ⱼ hᵢⱼ δwᵢ δwⱼ + O(‖δW‖³)

其中 gᵢ 是一階導數，hᵢⱼ 是二階導數（Hessian 的元素）。Optimal Brain Damage 做三個假設：

1. 目標函數接近二次式，所以忽略三階以上的項
2. 訓練已經收斂，所以一階項為零
3. 刪除每個參數造成的誤差互相獨立，所以交叉項為零

剩下的就是 δLᵢ ≈ ½ hᵢᵢ wᵢ²。重要度定義成 ½ hᵢᵢ wᵢ²，誤差小的權重先剪。

</details>

第 62 頁點出這個方法的實際障礙：Hessian 矩陣很難算。

### 剪神經元的兩種準則

第 63 頁說明剪神經元就是粗粒度的剪權重：在全連接層剪一個 neuron 等於剪掉權重矩陣的一列，在卷積層就是剪一個通道。

**Percentage-of-Zero-based**（第 64–66 頁）。ReLU 會讓輸出出現很多零。統計每個通道的輸出中零的平均比例（APoZ），比例越小代表這個神經元越常有輸出，越重要。第 66 頁用一個 batch 2、3 通道、4×4 的例子算出三個通道的 APoZ 分別是 11/32、12/32、14/32，所以通道 2 最先被剪。方法來自 [Network Trimming](https://arxiv.org/abs/1607.03250)。

**Regression-based**（第 67–72 頁）。前面的準則都看整體 loss 或權重本身，這個方法只看單一層：剪完之後，這一層的輸出能不能重建得跟原本一樣。設原輸出 Z = XWᵀ，可以拆成各輸入通道的貢獻加總。引入一個長度 cᵢ 的係數向量 β，βc = 0 代表剪掉通道 c，問題寫成：

> argmin_{W, β} ‖Z − Σ_c β_c X_c W_cᵀ‖²_F　subject to　‖β‖₀ ≤ N_c

解法是交替：固定 W 解 β 來選通道，再固定 β 解 W 來最小化重建誤差。出處是 [He et al., ICCV 2017](https://arxiv.org/abs/1707.06168)。

### 五種準則對照

| 準則 | 剪什麼 | 看什麼 | 代價 |
|---|---|---|---|
| Magnitude | 權重（元素或結構） | 權重的 Lp norm | 最便宜 |
| Scaling | 輸出通道 | 縮放係數（可用 BN 的 γ） | 要訓練縮放係數 |
| Second-order | 權重 | ½ hᵢᵢ wᵢ² | Hessian 難算 |
| APoZ | 神經元／通道 | 輸出為零的比例 | 要跑資料統計 activation |
| Regression | 通道 | 單層輸出的重建誤差 | 要解最佳化問題 |

## Fall 2026 對照

Fall 2026 的 [L3 投影片](https://www.dropbox.com/scl/fi/y5k1ipgvg919hykax33nu/Lec03-Pruning-I.pdf?rlkey=yg3v2oa8r8wfd7oez23b8azlg&st=ilwjkc8u&dl=0)共 71 頁，[錄影](https://www.youtube.com/watch?v=47nNIPj3B98)已上傳。三段結構（pruning 簡介、粒度、準則）與 Fall 2024 相同，結尾摘要也一字不差。差別是開頭少了三頁：「Today's AI is too BIG」、「Efficient Deep Learning Techniques are Essential」，以及 MLPerf 上 Llama 2 70B 的剪枝案例。前兩頁的圖在 Fall 2026 版 L2 已經出現過。

Fall 2026 的 Lab 1 改成 GPU Basics，Lab 2 的主題則是課頁與投影片說法不一（詳見[系列入口](/posts/ai/2026-09-30-mit-65940-course-overview)）。想練習本講內容，目前只能用 Fall 2024 的 Lab 1。

## 今晚可以做的事

打開 [Fall 2024 Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN)，跑完 Setup 與權重分布直方圖，先做 Question 1：觀察各層權重分布有什麼共同特徵，以及這些特徵為什麼對剪枝有利。這題不用寫程式，但答得出來，就代表你理解了 magnitude-based pruning 為什麼行得通。Lab 1 的完整拆解在 [order 4](/posts/ai/2026-09-30-mit-65940-lab1-pruning)。

## 延伸閱讀

- [Stanford CS336 導讀：GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)：為什麼不規則的稀疏在 GPU 上難加速
- [Stanford CS336 導讀：推論](/posts/ai/2026-08-22-cs336-inference)：LLM 推論端的壓縮方法

**系列導覽**：上一篇 [為什麼要高效、怎麼量模型大小與運算量](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)｜下一篇 [Pruning II：每層剪多少、硬體怎麼支援](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support)｜[系列入口](/posts/ai/2026-09-30-mit-65940-course-overview)

## 參考資料

- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940)
- [Lecture 3 投影片：Pruning and Sparsity Part I（Fall 2024）](https://www.dropbox.com/scl/fi/6qspcmk8qayy7mft737gh/Lec03-Pruning-I.pdf?rlkey=9jpifc92be0sitiknpbhn9ggf&st=lml94lam&dl=0)
- [Lecture 3 錄影（Fall 2024）](https://www.youtube.com/watch?v=EjsB0WgIfUM)
- [Lecture 3 投影片（Fall 2026）](https://www.dropbox.com/scl/fi/y5k1ipgvg919hykax33nu/Lec03-Pruning-I.pdf?rlkey=yg3v2oa8r8wfd7oez23b8azlg&st=ilwjkc8u&dl=0)
- [Lecture 3 錄影（Fall 2026）](https://www.youtube.com/watch?v=47nNIPj3B98)
- [Lab 1：Pruning（Fall 2024，Colab）](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN)
- [Han et al. (2015). Learning both Weights and Connections for Efficient Neural Networks. NeurIPS](https://arxiv.org/abs/1506.02626)
- [Liu et al. (2017). Learning Efficient Convolutional Networks through Network Slimming. ICCV](https://arxiv.org/abs/1708.06519)
- [Hu et al. (2016). Network Trimming: A Data-Driven Neuron Pruning Approach towards Efficient Deep Architectures](https://arxiv.org/abs/1607.03250)
- [He et al. (2017). Channel Pruning for Accelerating Very Deep Neural Networks. ICCV](https://arxiv.org/abs/1707.06168)
- [He et al. (2018). AMC: AutoML for Model Compression and Acceleration on Mobile Devices. ECCV](https://arxiv.org/abs/1802.03494)
- [Wen et al. (2016). Learning Structured Sparsity in Deep Neural Networks. NeurIPS](https://arxiv.org/abs/1608.03665)
