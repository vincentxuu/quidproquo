---
title: "MIT 6.5940 第 6 講：量化 II——PTQ 的粒度與裁切、QAT 與 STE、二值化與混合精度"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, quantization, model-compression, deep-learning]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 6
tldr: "第 6 講處理「量化後精度掉了怎麼辦」。先不重訓：換更細的 scale 粒度（per-channel、group、MX）、裁掉離群值（EMA、校準批次、MSE、KL）、改捨入方式（AdaRound）。不夠再重訓：QAT 保留一份全精度權重，前向做假量化，反向靠 STE 把梯度直接穿過去。投影片引用的白皮書數字裡，MobileNetV1 做 per-tensor INT8 PTQ 準確率掉到 0.1%，改成 per-channel QAT 回到 70.7%，浮點原本是 70.9%。最後兩段談 1–2 bit 的二值／三值網路，以及用強化學習自動分配每層位元數的 HAQ。"
description: "MIT 6.5940 EfficientML（Fall 2024）第 6 講 Quantization Part II 導讀：per-tensor、per-channel、group quantization 與 MX 格式，activation 範圍怎麼決定，AdaRound，QAT 與 straight-through estimator，BinaryConnect、XNOR-Net、TWN、TTQ，以及 HAQ 自動混合精度。附 Fall 2026 對照。"
draft: false
glossary:
  - term: "PTQ"
    aliases: ["post-training quantization", "訓練後量化"]
    definition: "拿一個已經訓練好的浮點模型直接量化，只決定 scale、zero point、裁切範圍與捨入方式，不重新訓練權重。"
    context: "MIT 6.5940 第 6 講前半的主題：粒度、動態範圍裁切、捨入。"
  - term: "QAT"
    aliases: ["quantization-aware training", "量化感知訓練"]
    definition: "訓練或微調時，在前向傳播中模擬推論時的量化誤差，讓權重學會在量化後仍然好用。訓練完只保留量化後的權重。"
    context: "PTQ 精度不夠、特別是 4 bit 以下時的補救手段。"
  - term: "STE"
    aliases: ["straight-through estimator"]
    definition: "量化函數幾乎處處導數為 0，STE 在反向傳播時把它當成恆等函數，讓梯度原封不動穿過量化節點。"
    context: "QAT 能運作的關鍵技巧。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 6 篇，接續[第 5 講：量化 I](/posts/ai/2026-09-30-mit-65940-quantization-basics)。

**系列導覽**：上一篇 [第 5 講：量化基礎](/posts/ai/2026-09-30-mit-65940-quantization-basics)｜下一篇 [Lab 2：親手實作 K-means 與線性量化](/posts/ai/2026-09-30-mit-65940-lab2-quantization)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：[Lec06-Quantization-II.pdf](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&dl=0)（82 頁，以下頁碼皆指這份 PDF）、[第 6 講錄影](https://youtu.be/wrcgWm_nUeE)。存取等級 **A3**：投影片與錄影公開，練習題在 [Lab 2](/posts/ai/2026-09-30-mit-65940-lab2-quantization)。以下內容以投影片為準，2026-09-30 核對。

**Fall 2026 對照**：Fall 2026 的[第 6 講投影片](https://www.dropbox.com/scl/fi/4zry0dea0hrykoa2aoqp0/Lec06-Quantization-II.pdf?rlkey=cb7gol6t8jcrb8kyyxpxwjzfb&dl=0)（80 頁）與[錄影](https://www.youtube.com/watch?v=_sHTMuOQY5A)已經上線。Lecture Plan 五項一字不差。逐頁比對只少了兩頁：一頁重複的線性量化回顧，以及 HAQ 在 edge／cloud 硬體上的位元分配圖（F24 第 80 頁）。

## 上一講留下的問題

第 5 講給了兩種量化：K-means（權重存整數索引加一本浮點 codebook）與線性量化（`r = S(q − Z)`，權重與運算都能用整數）。第 6 講第 3 頁把兩者並排複習後，第 10 頁直接丟出本講的核心問題：

> How should we get the optimal linear quantization parameters (S, Z)?

第 2 頁的 Lecture Plan 把答案分成五段，這篇照它走：

1. 複習線性量化
2. **PTQ**：不重訓，只調粒度、範圍裁切、捨入
3. **QAT**：訓練時模擬量化，把精度拉回來
4. 二值與三值量化
5. 自動混合精度

## PTQ 第一招：換更細的 scale

### Per-tensor 為什麼在小模型上會壞

最簡單的做法是整個權重張量共用一個 scale，取 `|r|max = |W|max`，這叫 per-tensor quantization。第 14 頁的判斷是：大模型上效果不錯，小模型上精度會掉。

常見的壞法也寫在同一頁：不同 output channel 的權重範圍差異可以超過 100 倍。整個張量只有一個 scale，範圍小的 channel 就只分到很少幾個整數格子，資訊幾乎被抹平。投影片的解法是 **per-channel quantization**：每個 output channel 各自一個 scale。

第 16–20 頁用一個 4×4 矩陣做 2-bit 對稱量化示範。per-tensor 時 `|r|max = 2.12`，每一列共用；per-channel 時四列各自是 2.09、2.12、1.92、1.87。重建誤差因此變小。

### Group quantization：在精度與硬體之間取中間

per-channel 還是很粗。第 21–28 頁往更細走，把一個 channel 再切成小組，每組一個 scale。問題是 scale 本身要佔位元，組越小、額外開銷越大。投影片介紹的解法是**多層 scale**：細粒度用便宜的整數 scale，粗粒度用貴的浮點 scale。

- **[VS-Quant](https://arxiv.org/abs/2102.04503)**（第 24 頁）：`r = γ · Sq(q − Z)`，γ 是整個張量一個浮點 scale，`Sq` 是每個向量一個整數 scale。4-bit 權重、每 16 個元素配一個 4-bit scale，實際平均位元數是 4 + 4/16 = **4.25 bits**。
- **[Shared micro-exponent（MX）](https://arxiv.org/abs/2302.08007)**（第 26–28 頁）：同樣是兩層 scale，但 scale 用只有指數的格式（E1M0、E8M0）。表上 MX4、MX6、MX9 的有效位元數分別是 4、6、9。
- 第 23 頁把這件事連到硬體：NVIDIA Blackwell GPU 支援為 FP4 設計的「micro-tensor scaling」，FP4 tensor core 的理論吞吐量是 FP8／FP6／INT8 的 2 倍。

**怎麼做**：讀量化論文或工具文件時，看到「4-bit」先找它的 group size 與 scale 格式，換算成有效位元數再比。4-bit per-channel 跟 4-bit、group size 16 的方法，佔的空間並不一樣。

## PTQ 第二招：決定範圍，裁掉離群值

權重在部署前就固定了，範圍直接算得出來。activation 不一樣，它的範圍隨輸入變化（第 30 頁），所以部署前要先收集統計。第 31–38 頁列了幾種做法：

| 做法 | 什麼時候收 | 怎麼決定範圍 | 投影片出處 |
|---|---|---|---|
| EMA | 訓練過程中 | 對每步觀察到的 min／max 做指數移動平均，平滑數千步 | 第 31 頁，[Jacob et al. CVPR 2018](https://arxiv.org/abs/1712.05877) |
| 校準批次＋平均 | 訓練完，跑幾批校準資料 | 取每個樣本 min／max 的平均，不把範圍浪費在離群值上 | 第 32 頁 |
| 最小化 MSE | 同上 | 假設輸入是 Gaussian 或 Laplace 分布，解出最佳裁切點 | 第 33 頁，[Banner et al. NeurIPS 2019](https://arxiv.org/abs/1810.05723) |
| 最小化 KL divergence | 同上 | 讓量化後的分布與原分布的資訊損失最小 | 第 34–36 頁，TensorRT（Migacz 2017） |
| Newton-Raphson 解 MSE | — | OCTAV 迭代找最佳裁切值 | 第 37–38 頁，[Sakr et al. ICML 2022](https://arxiv.org/abs/2206.06501) |

核心直覺只有一個：**把整數格子花在大多數資料所在的區間**。遇到少數極端值，寧可把它們裁掉，也不要為了容納它們讓所有格子變粗。第 33 頁給了具體值：Laplace(0, b) 分布下，2、3、4 bit 的最佳裁切點分別是 2.83b、3.89b、5.03b。

## PTQ 第三招：不要四捨五入

第 40–42 頁介紹 **AdaRound**（[Nagel et al. 2020](https://arxiv.org/abs/2004.10568)）。它的出發點是：每個權重各自四捨五入到最近整數，不代表整個張量的結果最好，因為權重之間互相關聯。

AdaRound 把每個權重的捨入方向（往上或往下）變成一個可學的變數，最佳化目標是這一層的輸出 `Wx` 在量化前後的差距，再加一個正則項把這個變數推向 0 或 1。它仍然屬於 PTQ：只學捨入方向，不改原本的權重。

<details>
<summary>AdaRound 的最佳化式（第 42 頁）</summary>

```
argmin_V ‖Wx − ⌊⌊W⌋ + h(V)⌉x‖²_F + λ f_reg(V)
```

- `x` 是這一層的輸入，`V` 是與 W 同形狀的變數
- `h()` 把值映到 (0, 1)，例如 rectified sigmoid
- `f_reg(V)` 鼓勵 `h(V)` 變成二元（0 或 1）

</details>

## PTQ 的極限：小模型撐不住

第 44–45 頁整理了 INT8 PTQ 的結果。大模型幾乎無損，MobileNet 這類小模型則掉得多。投影片的解讀是：小模型的表示能力較小，所以對 PTQ 反應較差。接著第 45 頁直接問：「How should we improve performance of quantized models?」答案就是 QAT。

## QAT：前向假量化，反向假裝沒量化

### 場景

PTQ 只能挑參數，不能改權重。4 bit 以下時，光挑參數已經救不回來。第 47 頁的說法是：要把精度損失壓到最低，特別是 4 bit 以下，就要用量化後的權重與 activation 訓練或微調網路，而且通常從預訓練浮點模型微調，會比從頭訓練好。

第 47 頁先用 K-means 量化示範：把梯度按 cluster 分組加總，拿來更新 centroid，也就是 [Deep Compression](https://arxiv.org/abs/1510.00149) 的做法。線性量化版的做法如下。

### 直覺

第 48–51 頁描述的流程有三個重點：

1. 訓練全程保留一份**全精度權重 W**。
2. 前向時先把 W 量化再反量化，得到 `S_W · q_W = Q(W)`，拿它去算，這叫「simulated／fake quantization」。activation 也同樣處理。
3. 訓練完，推論只用量化後的權重。

保留全精度權重的理由寫在投影片上：很小的梯度可以累積起來，不會因為精度不夠被吃掉。

### 機制：STE

問題出在反向傳播。量化是 `round()`，是一個階梯函數，導數幾乎處處為 0（第 52 頁）。梯度一路乘到這裡就變成 0，權重永遠不會更新，網路什麼也學不到。

**Straight-Through Estimator（STE）** 的解法很粗暴：反向時把量化函數當成恆等函數，梯度直接穿過去。前向照樣量化，反向假裝沒量化。投影片把它歸功於 Hinton 2012 年的 Coursera 課程與 [Bengio 等人 2013 年的論文](https://arxiv.org/abs/1308.3432)。

<details>
<summary>STE 的式子（第 52 頁）</summary>

沒有 STE 時：

```
g_W = ∂L/∂W = ∂L/∂Q(W) · ∂Q(W)/∂W = 0      （因為 ∂Q(W)/∂W = 0）
```

用 STE 時，直接令：

```
g_W = ∂L/∂W = ∂L/∂Q(W)
```

</details>

需要反向傳播的直覺，可以先讀 [CMU 11-785 第 5 講：反向傳播](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)或 [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)。

### 連回數字

第 54 頁引用 [Krishnamoorthi 2018 的量化白皮書](https://arxiv.org/abs/1806.08342)，是整講最有說服力的一張表。MobileNetV1 的浮點準確率是 70.9%：

| 做法 | MobileNetV1 準確率 |
|---|---|
| PTQ，asymmetric per-tensor | 0.1% |
| PTQ，symmetric per-channel | 59.1% |
| QAT，asymmetric per-tensor | 70.0% |
| QAT，symmetric per-channel | 70.7% |

兩件事同時成立：換成 per-channel 能救回一大截，QAT 又把剩下的差距幾乎補平。

**怎麼做**：部署一個小模型時，先跑 per-channel INT8 PTQ 看掉多少。掉得少就停；掉得多，再花算力做 QAT 微調。

## 推到 1 bit：二值與三值網路

第 57 頁問：量化能不能推到 1 bit？

### 只二值化權重

權重只剩 +1 與 −1，乘法就變成加減法。第 59 頁的估算：相對於浮點，記憶體約省 32 倍，運算約省 2 倍。

二值化有兩種方式（第 60 頁）：**確定性**用 sign 函數以 0 為門檻；**隨機性**依機率決定是 +1 還是 −1，例如 [BinaryConnect](https://arxiv.org/abs/1511.00363) 用 hard sigmoid 算機率。後者需要硬體產生隨機位元，比較難實作。

只用 sign 誤差很大，所以 **Binary Weight Network（BWN）** 多乘一個浮點 scale `α = ‖W‖₁ / n`（第 61 頁）。同一張表上，AlexNet 類網路在 ImageNet 的 top-1 變化：BinaryConnect −21.2%，BWN +0.2%。

### 權重與 activation 都二值化

兩邊都是 ±1 時，把 +1 編碼成 1、−1 編碼成 0，內積就能改用 XNOR 加 popcount 算（第 62–67 頁）：`y = −n + popcount(W xnor x) << 1`。第 67 頁的估算是記憶體約省 32 倍，運算約省 58 倍。

代價是精度。第 68 頁 AlexNet 的 ImageNet top-1 變化：

| 方法 | W／A 位元 | 準確率變化 |
|---|---|---|
| BWN（權重有 scale） | 1 / 32 | +0.2% |
| [BNN](https://arxiv.org/abs/1602.02830)（沒有 scale） | 1 / 1 | −28.7% |
| [XNOR-Net](https://arxiv.org/abs/1603.05279)（權重與 activation 都有 scale） | 1 / 1 | −12.4% |

### 三值：多一個 0

**[Ternary Weight Networks（TWN）](https://arxiv.org/abs/1605.04711)** 把權重量化成 +1、0、−1，門檻 `Δ = 0.7 × E(|r|)`（第 69 頁）。**[Trained Ternary Quantization（TTQ）](https://arxiv.org/abs/1612.01064)** 則把正負兩邊的 scale 改成可訓練參數 `wp`、`wn`（第 70 頁）。ResNet-18 在 ImageNet 的 top-1：浮點 69.6、BWN 60.8、TWN 65.3、TTQ 66.6。

## 每層用不同位元：自動混合精度

前面所有做法都讓每一層用同樣位元數。第 72–74 頁提出另一個方向：每層的權重與 activation 各自挑位元數，例如第 1 層 4/5 bit、第 2 層 6/7 bit。

難處在搜尋空間（第 75 頁）：每層權重與 activation 各 8 種選擇，一層就有 8 × 8 = 64 種，n 層就是 64ⁿ 種。

投影片的解法是 **HAQ**（[Wang et al. CVPR 2019](https://arxiv.org/abs/1811.08886)，作者包含 Song Han 本人），用 actor-critic 強化學習逐層決定位元數（第 76 頁），並把目標硬體的回饋直接接進搜尋迴圈（第 77 頁）。第 78–79 頁顯示，在 MobileNetV1 上，HAQ 在模型大小、延遲、能耗三種限制下都勝過每層同位元的均勻量化。

「讓機器搜設計」這個想法，下一講會擴大到整個網路架構：[第 7 講：NAS I](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy)。

## 自學怎麼做

1. 先看第 54 頁那張 MobileNet 表，再回頭讀粒度與 QAT 兩段。那張表是整講的論證核心。
2. 用 PyTorch 拿一個預訓練 MobileNetV2，自己寫 per-tensor 與 per-channel 的 INT8 權重量化，各算一次準確率，看看有沒有重現第 54 頁的落差方向。
3. 接著做 [Lab 2](/posts/ai/2026-09-30-mit-65940-lab2-quantization)。它的 Q5 到 Q9 就是這講的 scale、zero point、per-channel 與整數推論。

今晚可以做的一件事：打開第 26 頁的表，自己算一次 VS-Quant 的 4 + 4/16 與 MX6 的 5 + 1/2 + 8/16，確認你知道「有效位元數」每一項是從哪裡來的。

## 延伸閱讀

- 系列入口與課程狀態：[MIT 6.5940 導讀（系列總覽）](/posts/ai/2026-09-30-mit-65940-course-overview)
- 量化基礎：[第 5 講：量化 I](/posts/ai/2026-09-30-mit-65940-quantization-basics)
- LLM 推論中的量化與系統觀點：[CS336 推論](/posts/ai/2026-08-22-cs336-inference)
- 反向傳播：[CMU 11-785 第 5 講](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — 講次排程、投影片與錄影連結、Lab 2 發布日期
- [Lec06-Quantization-II.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&dl=0) — 本文所有頁碼、數字與表格
- [EfficientML.ai Lecture 6 - Quantization Part II（MIT 6.5940, Fall 2024）](https://youtu.be/wrcgWm_nUeE) — 官方錄影
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — 進行中學期的排程
- [Lec06-Quantization-II.pdf（Fall 2026）](https://www.dropbox.com/scl/fi/4zry0dea0hrykoa2aoqp0/Lec06-Quantization-II.pdf?rlkey=cb7gol6t8jcrb8kyyxpxwjzfb&dl=0) — 與 F24 逐頁比對
- [EfficientML.ai Lecture 6 - Quantization (Part II)（MIT 6.5940 Fall 2026）](https://www.youtube.com/watch?v=_sHTMuOQY5A) — Fall 2026 錄影
- [Krishnamoorthi, Quantizing Deep Convolutional Networks for Efficient Inference: A Whitepaper（arXiv:1806.08342）](https://arxiv.org/abs/1806.08342) — 第 44、54 頁表格的來源
- [Jacob et al., Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference（arXiv:1712.05877）](https://arxiv.org/abs/1712.05877) — 線性量化與 EMA 範圍
- [Nagel et al., Up or Down? Adaptive Rounding for Post-Training Quantization（arXiv:2004.10568）](https://arxiv.org/abs/2004.10568) — AdaRound
- [Wang et al., HAQ: Hardware-Aware Automated Quantization with Mixed Precision（arXiv:1811.08886）](https://arxiv.org/abs/1811.08886) — 自動混合精度
