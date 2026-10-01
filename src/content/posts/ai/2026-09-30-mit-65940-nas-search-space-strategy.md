---
title: "MIT 6.5940 第 7 講：NAS I——從手工 building block 到搜尋空間與搜尋策略"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, neural-architecture-search, deep-learning]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 8
tldr: "第 7 講分三段。先用 MAC 公式複習全連接、卷積、分組卷積、depthwise 與 1×1 卷積；再拆 ResNet bottleneck、ResNeXt、MobileNet、MobileNetV2、ShuffleNet 與 Transformer 各靠什麼省運算，例如 bottleneck 比直接做 2048 通道的 3×3 卷積少 8.5 倍 MAC。最後進入 NAS：搜尋空間分 cell-level 與 network-level（深度、解析度、寬度、kernel size、拓撲），搜尋策略有 grid、random、強化學習、梯度下降、演化五種。投影片的一道算術題顯示，NASNet 的 cell 空間在 M=5、N=2、B=5 時就有 3.2×10¹¹ 個候選。"
description: "MIT 6.5940 EfficientML（Fall 2024）第 7 講 Neural Architecture Search Part I 導讀：primitive operations 的 MAC 公式、經典 building block（ResNet、ResNeXt、MobileNet、MobileNetV2、ShuffleNet、MHSA）、NAS 的搜尋空間（cell-level、network-level、TinyML 的記憶體限制）與五種搜尋策略（grid、random、RL、DARTS、演化）。附 Fall 2026 狀態。"
draft: false
glossary:
  - term: "NAS"
    aliases: ["neural architecture search", "神經架構搜尋"]
    definition: "在一個預先定義的候選架構集合（搜尋空間）裡，用某種搜尋策略自動找出在準確率、效率等目標上最好的網路架構。"
    context: "MIT 6.5940 第 7、8 講與 Lab 3 的主題。"
  - term: "search space"
    aliases: ["搜尋空間"]
    definition: "NAS 允許考慮的所有候選架構的集合，例如每層可選的運算、深度、寬度、kernel size 與連接方式。"
    context: "第 7 講強調搜尋空間設計本身就決定了 NAS 的上限。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 8 篇。剪枝與量化是把一個現成的網路變小，這一講換個角度：一開始就設計出又小又準的網路。

**系列導覽**：上一篇 [Lab 2：親手實作 K-means 與線性量化](/posts/ai/2026-09-30-mit-65940-lab2-quantization)｜下一篇 [第 8 講：NAS II，hardware-aware 與 zero-shot NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：[Lec07-Neural-Architecture-Search-I.pdf](https://www.dropbox.com/scl/fi/hxhjhxonwqyw2hfoywzcp/Lec07-Neural-Architecture-Search-I.pdf?rlkey=o6s5dglazyb2o2nrc897ccppg&dl=0)（76 頁，以下頁碼皆指這份 PDF）、[第 7 講錄影](https://www.youtube.com/watch?v=3W146_T8eCs)。存取等級 **A3**：投影片與錄影公開，練習在 [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas)。以下內容以投影片為準，2026-09-30 核對。

**Fall 2026 對照**：Fall 2026 的第 7 講排在 10 月 1 日，2026-10-01 查課程頁時投影片與錄影都還沒有連結。

## 這講在整個 NAS 單元的位置

第 4 頁列出整個 NAS 單元的大綱，第 7 講只負責前半：

- **本講**：primitive operations、經典 building blocks、NAS 是什麼、搜尋空間、搜尋空間設計、搜尋策略
- **第 8 講**：performance estimation、hardware-aware NAS、zero-shot NAS、neural-hardware 架構共同搜尋、NAS 應用（NLP、GAN、點雲、姿態估計）

第 3 頁的動機很簡短：儲存、延遲、能耗與準確率之間有取捨，架構設計決定你落在取捨曲線的哪裡。

## 第一段：primitive operations 的 MAC 帳

第 6–14 頁把第 2 講的內容重新整理成一張表。這張表是後面所有 building block 分析的計算工具。batch size 取 1、忽略 bias：

| 運算 | MACs |
|---|---|
| 全連接層 | cₒ · cᵢ |
| 卷積 | cₒ · cᵢ · kₕ · k_w · hₒ · wₒ |
| 分組卷積（g 組） | cₒ · cᵢ · kₕ · k_w · hₒ · wₒ / g |
| Depthwise 卷積 | cₒ · kₕ · k_w · hₒ · wₒ |
| 1×1 卷積 | cₒ · cᵢ · hₒ · wₒ |

讀法很直接：分組卷積把成本除以 g；depthwise 是分組數等於通道數的極端情況，cᵢ 從式子裡消失；1×1 卷積沒有空間維度的 kernel 成本，只剩通道混合。

## 第二段：經典 building block 各靠什麼省

### ResNet-50 bottleneck：先縮通道再做 3×3

第 16–22 頁拆 [ResNet](https://arxiv.org/abs/1512.03385)-50 的 bottleneck block。三步：1×1 卷積把通道縮 4 倍（2048→512），在縮小的特徵圖上做 3×3 卷積，再用 1×1 卷積擴回 2048。

帳算起來（第 21 頁）：

- bottleneck：2048×512×H×W + 512×512×H×W×9 + 2048×512×H×W = 512×512×H×W×**17**
- 直接做 2048 通道的 3×3：2048×2048×H×W×9 = 512×512×H×W×**144**

MAC 少了 **8.5 倍**。第 22 頁說參數量也是同樣的 8.5 倍。

### ResNeXt：把 3×3 換成分組卷積

第 23–25 頁：[ResNeXt](https://arxiv.org/abs/1611.05431) 把 bottleneck 中間的 3×3 換成 3×3 分組卷積，這等價於一個多路徑的 block。

### MobileNet：depthwise 管空間，1×1 管通道

第 26–28 頁：[MobileNet](https://arxiv.org/abs/1704.04861) 的 depthwise-separable block 把一般卷積拆成兩件事。depthwise 卷積負責擷取空間資訊，1×1 卷積負責在通道之間融合資訊。

### MobileNetV2：inverted bottleneck

第 29–32 頁：depthwise 卷積的表達能力比一般卷積低很多。[MobileNetV2](https://arxiv.org/abs/1801.04381) 的做法是反過來：先用 1×1 把通道**擴大** 6 倍（N→6N），做 3×3 depthwise，再用 1×1 縮回 N。因為 depthwise 的成本只隨通道數線性成長，擴大通道還負擔得起。

投影片用 N = 160 算了一次（第 30 頁）：inverted bottleneck 的 MAC 是 960×H×W×329，160 通道的一般 3×3 卷積是 960×H×W×240，比例約 1.37 : 1。

第 32 頁接著點出代價：這個設計在推論與訓練時都**不省記憶體**，因為中間被擴大 6 倍的 activation 很佔空間。這個伏筆會在 [MCUNet](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml) 那講回來。

### ShuffleNet 與 Transformer

- **[ShuffleNet](https://arxiv.org/abs/1707.01083)**（第 33 頁）：連 1×1 卷積也換成 1×1 分組卷積，再用 channel shuffle 讓不同組交換資訊。
- **Transformer 的 multi-head self-attention**（第 34–37 頁）：Q、K、V 各用 h 組學到的線性投影，平行做 scaled dot-product attention，把結果串接後再投影一次。

<details>
<summary>一張表整理六種 block 的省法</summary>

| Block | 核心手法 | 省的是什麼 |
|---|---|---|
| ResNet bottleneck | 1×1 縮通道 → 3×3 → 1×1 擴通道 | 3×3 卷積的通道數 |
| ResNeXt | 3×3 改分組卷積 | 3×3 的跨通道連接 |
| MobileNet | depthwise ＋ 1×1 | 空間與通道分開處理 |
| MobileNetV2 | 1×1 擴 6 倍 → depthwise → 1×1 縮 | 用便宜的 depthwise 換表達能力 |
| ShuffleNet | 1×1 分組卷積 ＋ channel shuffle | 1×1 卷積的成本 |
| MHSA | 多組投影平行做 attention | （不是為了省，列為常用 block） |

</details>

## 第三段：從手工設計到自動搜尋

### 為什麼要自動化

第 39–40 頁的理由是設計空間太大：層數、通道數、kernel size、連接方式、輸入解析度都能選，手工設計無法規模化。第 41–42 頁把手工設計的網路（Inception、ResNeXt、DenseNet 等）與自動搜尋的網路（[EfficientNet](https://arxiv.org/abs/1905.11946)、AmoebaNet、[DARTS](https://arxiv.org/abs/1806.09055)、[ProxylessNAS](https://arxiv.org/abs/1812.00332)、[Once-for-All](https://arxiv.org/abs/1908.09791) 等）放在同一張 ImageNet 準確率與效率的取捨圖上。

NAS 的目標（第 43 頁，引用 Elsken 等人的 [NAS 綜述](https://arxiv.org/abs/1808.05377)）：在搜尋空間中找出最好的架構，讓你關心的目標（準確率、效率等）最大化。本講處理其中的搜尋空間與搜尋策略；候選架構怎麼評估（performance estimation）留到第 8 講（第 4、73 頁）。

### 搜尋空間：cell-level

第 44 頁把搜尋空間分成 cell-level 與 network-level。

Cell-level 的代表是 [NASNet](https://arxiv.org/abs/1707.07012)（第 45–48 頁）。網路由重複堆疊的 normal cell 與 reduction cell 組成，NAS 只搜 cell 的內部結構。一個 RNN controller 逐步產生 cell：選兩個輸入、各選一個轉換運算（卷積、pooling、identity 等）、再選合併方式，重複 B 次。

第 48 頁出了一道算術題：有 2 個候選輸入、M 種轉換運算、N 種合併方式、B 層時，搜尋空間多大？

<details>
<summary>答案（第 48 頁）</summary>

每一步要選：第一個輸入（2）、第二個輸入（2）、第一個運算（M）、第二個運算（M）、合併方式（N），所以

```
(2 × 2 × M × M × N)^B = 4^B · M^(2B) · N^B
```

M = 5、N = 2、B = 5 時，約有 3.2 × 10¹¹ 個候選。

</details>

### 搜尋空間：network-level

Network-level 固定 block 的種類，搜整個網路的形狀。第 49–53 頁依序示範五個維度：

| 維度 | 投影片例子 |
|---|---|
| 深度 | 每個 stage 重複幾個 block（Once-for-All 的空間，第 49 頁） |
| 解析度 | 輸入影像大小（第 50 頁） |
| 寬度 | 每個 stage 的通道數（第 51 頁） |
| Kernel size | ProxylessNAS 為手機與 CPU 各自找到的架構，每層 kernel 大小不同（第 52 頁） |
| 拓撲連接 | Auto-DeepLab 的下採樣路徑（第 53 頁） |

### 搜尋空間本身也要設計：TinyML 的例子

第 55–59 頁用 Song Han 團隊的 [MCUNet](https://arxiv.org/abs/2007.10319)（TinyNAS）說明，搜尋空間設計對 NAS 的結果影響很大。TinyNAS 分兩步：先自動最佳化搜尋空間，再在限制下做模型特化。

它跟手機 AI 最大的不同在第 56–57 頁：手機要顧延遲與能耗，微控制器（投影片以 STM32F746 對照 iPhone 11 與 NVIDIA V100）還多了**記憶體**這條硬限制。

挑搜尋空間的方法（第 58 頁）是看「滿足限制的模型」的 FLOPs 分布：FLOPs 越大，模型容量越大，越可能得到高準確率。依這個邏輯，會傾向選讓合格模型 FLOPs 偏高的那個空間。第 59 頁留了一道討論題：這種做法和 [RegNet](https://arxiv.org/abs/2003.13678) 設計搜尋空間的方法各有什麼優缺點？結論只有一句：搜尋空間越好，最終準確率越好。

## 搜尋策略：五種怎麼探索

第 61 頁列出五種策略。

| 策略 | 做法 | 投影片例子 |
|---|---|---|
| Grid search | 把每個維度的選項做笛卡兒積，每個候選從頭訓練 | 解析度 × 寬度各 1.0x／1.1x／1.2x 的 3×3 網格，標出哪些超過延遲限制（第 62 頁）；EfficientNet 用網格搜 compound scaling 的 α、β、γ，讓 FLOPs 約變 2 倍（第 63 頁） |
| Random search | 隨機取樣候選，與 grid search 對照 | 第 64 頁 |
| 強化學習 | 用強化學習訓練一個 RNN controller，由它產生架構描述 | [Zoph & Le 2017](https://arxiv.org/abs/1611.01578)（第 65 頁） |
| 梯度下降 | 把「選哪個運算」鬆弛成所有運算的 softmax 加權和，架構參數可以直接微分 | DARTS（第 66 頁）；ProxylessNAS 再加一個可微的延遲項（第 67 頁） |
| 演化 | 依 fitness 保留、突變、交配 | Once-for-All（第 69–72 頁） |

兩個細節值得多看一眼：

- **延遲怎麼變可微**（第 67 頁）：直接在硬體上量延遲又貴又慢。ProxylessNAS 為每個候選運算建一個延遲預測模型（回歸器或查表），整個 block 的期望延遲就是各運算延遲依架構參數加權的和，於是能對架構參數算梯度。
- **演化的三個操作**（第 69–72 頁）：fitness 函數同時考慮準確率與效率；突變可以改某個 stage 的深度，或改某一層的運算（例如 3×3 換成 5×5）；交配則是每一層隨機從兩個親代中挑一個運算。

**怎麼做**：讀 NAS 論文時，先把它拆成「搜尋空間是什麼」「用哪種策略」「候選怎麼評估」三欄。多數論文的貢獻只落在其中一欄，拆開後比較容易看出它跟前人差在哪。

## 自學怎麼做

1. 拿第一段的 MAC 表，自己重算第 21 頁 bottleneck 的 17 與 144，以及第 30 頁 MobileNetV2 的 329 與 240。算過一次，之後看到任何新 block 都能自己估成本。
2. 自己算一次第 48 頁的搜尋空間大小，體會為什麼不可能窮舉。
3. 把五種搜尋策略跟 [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas) 對照：Lab 3 要你實作的是 random search 與演化搜尋。

今晚可以做的一件事：用 PyTorch 各寫一個 ResNet bottleneck 與 MobileNetV2 inverted bottleneck，丟進 `torchprofile.profile_macs` 量 MAC，對照投影片的算式。

## 延伸閱讀

- 系列入口與課程狀態：[MIT 6.5940 導讀（系列總覽）](/posts/ai/2026-09-30-mit-65940-course-overview)
- 效率指標與 building block 的第一次介紹：[第 1–2 講＋Lab 0](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)
- CNN 架構的另一種講法：[CMU 11-785 CNN 單元](/posts/ai/2026-08-22-cmu-11785-09-cnn-one)
- Transformer 從頭講起：[CMU 11-785 注意力與 Transformer](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers)

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — 講次排程、投影片與錄影連結
- [Lec07-Neural-Architecture-Search-I.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/hxhjhxonwqyw2hfoywzcp/Lec07-Neural-Architecture-Search-I.pdf?rlkey=o6s5dglazyb2o2nrc897ccppg&dl=0) — 本文所有頁碼、公式與數字
- [EfficientML.ai Lecture 7 - Neural Architecture Search Part I（MIT 6.5940, Fall 2024）](https://www.youtube.com/watch?v=3W146_T8eCs) — 官方錄影
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — Fall 2026 第 7 講排程
- [Elsken, Metzen & Hutter, Neural Architecture Search: A Survey（arXiv:1808.05377）](https://arxiv.org/abs/1808.05377) — NAS 三元件的框架
- [Zoph et al., Learning Transferable Architectures for Scalable Image Recognition（arXiv:1707.07012）](https://arxiv.org/abs/1707.07012) — NASNet cell-level 搜尋空間
- [Zoph & Le, Neural Architecture Search with Reinforcement Learning（arXiv:1611.01578）](https://arxiv.org/abs/1611.01578) — RL 搜尋策略
- [Liu, Simonyan & Yang, DARTS: Differentiable Architecture Search（arXiv:1806.09055）](https://arxiv.org/abs/1806.09055) — 梯度下降搜尋策略
- [Cai, Zhu & Han, ProxylessNAS（arXiv:1812.00332）](https://arxiv.org/abs/1812.00332) — 可微延遲項、kernel size 維度
- [Cai et al., Once-for-All（arXiv:1908.09791）](https://arxiv.org/abs/1908.09791) — network-level 搜尋空間與演化搜尋
- [Lin et al., MCUNet: Tiny Deep Learning on IoT Devices（arXiv:2007.10319）](https://arxiv.org/abs/2007.10319) — TinyNAS 搜尋空間設計
- [Sandler et al., MobileNetV2（arXiv:1801.04381）](https://arxiv.org/abs/1801.04381) — inverted bottleneck
