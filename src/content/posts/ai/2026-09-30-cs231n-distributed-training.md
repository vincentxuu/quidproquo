---
title: "CS231N L11：大規模分散式訓練——把一個模型切到上萬張 GPU"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, distributed-training, gpu, parallelism]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 13
tldr: "CS231N 第 11 講以 Llama3-405B 為貫穿範例，先講 GPU 硬體與叢集（H100、8 卡伺服器、24,576 張 GPU 的叢集），再把 Transformer activation 的四個維度對應到四種平行化：切 batch 是資料平行（再演進成 FSDP、HSDP），切序列是 context parallelism，切層是 pipeline parallelism，切通道是 tensor parallelism。中間插入 activation checkpointing（用重算換記憶體）和一份實用的擴展配方，並用 Model FLOPs Utilization（MFU）當調參目標：超過 30% 算好，超過 40% 算優秀。"
description: "Stanford CS231N Spring 2026 Lecture 11（Large-Scale Distributed Training）導讀：GPU 與叢集硬體、all-reduce 等通訊原語、資料平行／FSDP／HSDP、activation checkpointing 的記憶體與計算取捨、HFU 與 MFU、context／pipeline／tensor parallelism 與 ND 平行，以及投影片給的擴展配方。投影片 Spring 2026，錄影 Spring 2025。"
draft: false
glossary:
  - term: "MFU"
    aliases: ["Model FLOPs Utilization"]
    definition: "理論上完成一次訓練迭代所需的矩陣乘法 FLOPs，除以裝置峰值算力得到理論時間，再除以實際量到的迭代時間。衡量 GPU 算力有多少花在「有用的」模型計算上。"
    context: "CS231N L11 把它當成調整平行化配方的目標；投影片說超過 30% 算好，超過 40% 算優秀。"
  - term: "FSDP"
    aliases: ["Fully Sharded Data Parallelism", "完全分片資料平行"]
    definition: "資料平行的變形：每份權重（連同梯度與最佳化器狀態）只由一張 GPU 擁有，要用時才廣播給其他 GPU，用完即刪。"
    context: "源自 ZeRO；讓放不進單張 GPU 的大模型也能做資料平行。"
  - term: "activation checkpointing"
    aliases: ["gradient checkpointing"]
    definition: "前向時只保留部分層的 activation，反向傳播需要時再從最近的檢查點重算，用額外計算換記憶體。"
    context: "每 √N 層存一個檢查點時，記憶體 O(√N)、計算 O(N√N)。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-distributed-training-en)

> **來源年份**：投影片依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 的 [Lecture 11 投影片](https://cs231n.stanford.edu/slides/2026/lecture_11.pdf)（158 頁，封面日期 2026-05-05）；錄影是 [Spring 2025 的 Lecture 11](https://www.youtube.com/watch?v=9MvD-XsowsE)（YouTube，約 1 小時 12 分，2025 課表列的講者是 Justin Johnson）。2026 錄影只放在 Canvas，限修課生，兩個年份的內容可能有差異。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 13 篇。

**為什麼電腦視覺課要講分散式訓練？** [上一篇](/posts/ai/2026-09-30-cs231n-video-understanding)算過：5 分鐘、24 fps 的影片切成 ViT token 是 141 萬個。下一篇的自監督學習也會提到 SimCLR 需要大 batch，ImageNet 實驗要靠 TPU 分散式訓練。視覺模型走到基礎模型的規模之後，「怎麼把它塞進很多張 GPU」就變成每個人都會碰到的問題。

這一講是整門課最偏系統的一講。它的貫穿範例是 [Llama3-405B](https://arxiv.org/abs/2407.21783)。投影片解釋了原因：GPT-4 技術報告明言不公開架構、模型大小、硬體與訓練算力，開啟了不分享模型細節的趨勢；Meta 在 2024 年 4 月釋出的 Llama3 則在論文裡公開大量模型與訓練細節。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=9MvD-XsowsE
title: Stanford CS231N 2025 Lecture 11: Large Scale Distributed Training（YouTube）
```

原始影片：[Stanford CS231N 2025 Lecture 11: Large Scale Distributed Training（YouTube）](https://www.youtube.com/watch?v=9MvD-XsowsE)

課程與錄影入口：

- [Stanford CS231N 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 第一部分：GPU 與叢集

**GPU 是什麼。** 原本為圖形設計，現在是通用的平行處理器。投影片拆解 NVIDIA H100：有 50 MB 的 L2 cache，每個 streaming multiprocessor「有點像帶向量指令的 CPU 核心」。

**速度成長。** 從 2013 年的 K40（FP32 約 5 TFLOP/s）到 H100（Tensor Core BF16 989 TFLOP/s）再到 B200（Tensor Core FP8 5000 TFLOP/s），投影片標註「自 2013 年以來快了 1000 倍」。下一句是這一講的起點：我們也可以用不只一張 GPU 訓練。

**頻寬的階層。** 這組數字決定了後面每種平行化的取捨：

| 層級 | 頻寬 |
|---|---|
| 單張 H100 內部 | 3352 GB/s |
| 同一台伺服器（8 張 GPU）之間 | 900 GB/s |
| 機櫃、機櫃群、整個叢集 | 越往外越慢 |

Meta 的 Llama3 叢集一台伺服器 8 張 GPU、一個機櫃 2 台，整個叢集 24,576 張 GPU、1.875 PB 的 GPU 記憶體。投影片的說法是：**GPU 叢集就是一台大電腦**，目標是在上面訓練一個巨大的神經網路。投影片也列了 Google TPU、AMD MI355X、AWS Trainium3 等其他訓練晶片。

## 第二部分：通訊原語

GPU 之間交換資料靠幾個「collective」原語，後面每種平行化都是它們的組合：

| 原語 | 每張 GPU 最後拿到 |
|---|---|
| All-Reduce | 所有輸入張量的總和（可換成任何結合律運算，如 max） |
| Reduce-Scatter | 總和的其中一塊 |
| All-Gather | 把各自持有的一塊拼成完整張量 |
| All-To-All | 把張量切塊後在 GPU 間「轉置」，用來沿另一個軸重新分片 |

## 第三部分：四個維度，四種平行化

投影片的組織方式很漂亮。Transformer 的 activation 形狀是 (Layer, Batch, Sequence, Channel)，**切哪個維度，就是哪一種平行化**：

| 切的維度 | 平行化 |
|---|---|
| Batch | 資料平行（DP） |
| Sequence | Context parallelism（CP） |
| Layer | Pipeline parallelism（PP） |
| Channel | Tensor parallelism（TP） |

### 資料平行：DP → FSDP → HSDP

**DP。** loss 通常是 minibatch 的平均，梯度是線性的，所以可以把 MN 個樣本分給 M 張 GPU：每張 GPU 各有一份模型與最佳化器、載入自己的資料、各自前向與反向，最後用 all-reduce 平均梯度。

**FSDP。** DP 要求每張 GPU 放得下整個模型。[ZeRO](https://arxiv.org/abs/1910.02054) 的想法是把權重分片：每份權重 W_i 只由一張 GPU 擁有，它同時保管 W_i 的梯度與最佳化器狀態。流程是六步：

1. 前向到第 i 層之前，擁有者把 W_i 廣播給所有 GPU
2. 所有 GPU 算完第 i 層前向，刪掉本地的 W_i
3. 反向到第 i 層之前，擁有者再廣播一次
4. 所有 GPU 算出本地 dL/dW_i，刪掉 W_i
5. 把本地梯度送回擁有者，刪掉本地梯度
6. 擁有者更新 W_i

實作上會重疊通訊與計算：算第 i 層時就先抓第 i+1 層的權重；前向最後一層的權重不刪，避免反向一開始又要重傳。

投影片給了一個算式讓你感受規模：1000 億參數的模型，每個參數要存 4 個數（參數、梯度、Adam 的兩個動量），每個數 2 bytes，共 800 GB；分到 80 張 GPU 上，每張只要 10 GB。

**HSDP。** 把 N = M×K 張 GPU 分成 M 組，每組 K 張做 FSDP（K 可以到上百張），組與組之間再做一般的 DP。這樣最頻繁的權重廣播留在組內。

### Activation checkpointing：用重算換記憶體

把每一層看成兩個函數：前向 A_{i+1} = F_i→(A_i)，反向 G_i = F_i←(A_i, G_{i+1})。反向需要前向的 activation，所以一般訓練要全部存起來。投影片逐格動畫比較三種策略：

| 策略 | 計算 | 記憶體 |
|---|---|---|
| 一般前向＋反向 | O(N) | O(N) |
| 完全重算（反向時每次從頭算） | O(N²) | O(1) |
| 每 C 層存一個檢查點 | O(N²/C) | O(C) |
| 存 √N 個檢查點 | O(N√N) | O(√N) |

N² 的計算太貴，所以實務上選中間：存一些檢查點，只重算檢查點之間那一段。

### 擴展配方

投影片在這裡停下來，給了一份很實用的配方，並強調「HSDP＋activation checkpointing 可以帶你走很遠」：

1. 約 128 張 GPU、約 10 億參數以內，用資料平行
2. 永遠把每張 GPU 的 batch size 調到塞滿記憶體
3. 模型超過 10 億參數，考慮 FSDP
4. 加 activation checkpointing，讓每張 GPU 塞得下更大的 batch
5. 超過 256 張 GPU，考慮 HSDP
6. 超過 1000 張 GPU、模型超過 500 億參數，或序列長度超過 16K，才上更進階的 CP、PP、TP

### 旋鈕太多，怎麼調：HFU 與 MFU

**HFU**（Hardware FLOPs Utilization）是實際達到的矩陣乘法效能占理論值的比例。H100 理論上能做 989.4 TFLOP/s 的 16-bit 矩陣乘法，但即使是只做大矩陣乘法的最佳情境，投影片引用的量測也只有約 80%。

**MFU**（Model FLOPs Utilization，出自 [PaLM](https://arxiv.org/abs/2204.02311) 論文）問的是：GPU 峰值算力有多少花在「有用的」模型計算上？

<details>
<summary>MFU 的五步算法（投影片第 115 頁）</summary>

1. 算出一次前向＋反向的矩陣乘法總 FLOPs（反向約等於前向的 2 倍；非線性、正規化、殘差等逐元素運算忽略）
2. 查裝置的理論峰值（H100：989 TFLOP/s）
3. 理論時間 = 總 FLOPs ÷ 峰值
4. 實際量一次完整迭代的時間：資料載入、前向、反向、最佳化器更新
5. MFU = 理論時間 ÷ 實際時間

</details>

投影片的標準是 **MFU 超過 30% 算好，超過 40% 算優秀**。還有一個反直覺的觀察：較新的裝置有時 MFU 更差，因為峰值算力成長得比記憶體頻寬快。A100 到 H100，FLOPs 成長 3.1 倍，記憶體頻寬只成長 2.1 倍。

### Context parallelism：切序列

Transformer 處理長度 S 的序列；CP 用多張 GPU 處理同一條長序列，N 路 CP 時每個 block 處理的張量形狀從 (batch, sequence, channels) 變成 (batch, sequence/N, channels)。MLP 和 QKV 投影可以像 DP 一樣沿序列切開、同步梯度。投影片說 attention 運算子「最難平行化」，並給兩個選項：

- **[Ulysses](https://arxiv.org/abs/2309.14509)**：算完 QKV 後重新分片，從「每張 GPU 一段序列、全部 head」改成「每張 GPU 完整序列、一部分 head」。容易實作，但 head 數必須能被 GPU 數整除。
- **[Ring Attention](https://arxiv.org/abs/2310.01889)**：把序列切塊分給 GPU，外迴圈跑 query、內迴圈跑 key/value。實作複雜，但能擴展到非常長的序列。

CP 常用於長序列微調。Llama3-405B 的例子：第一階段 S=8192，不用 CP；第二階段 S=131,072，用 16 路 CP，每張 GPU 處理 8192。

### Pipeline parallelism：切層

把模型的層分給不同 GPU，在邊界複製 activation（[GPipe](https://arxiv.org/abs/1811.06965)）。問題是 GPU 會互相等待。投影片的例子：4 路 PP 如果不切 microbatch，最大 MFU 只有 1/4＝25%；切成 4 個 microbatch 後提升到 16/28，約 57.1%。

### Tensor parallelism：切通道

把每個線性層的權重切給多張 GPU，用分塊矩陣乘法。技巧在於兩層連著切：

<details>
<summary>兩層 TP 為什麼中間不用通訊</summary>

第一層 XW = Y，把 W 按欄切成 W_1…W_4，GPU i 算 XW_i = Y_i。第二層 YU = Z，把 U 按列切成 U_1…U_4，GPU i 直接用自己手上的 Y_i 算 Y_iU_i。因為 Z = Y_1U_1 + Y_2U_2 + Y_3U_3 + Y_4U_4，每張 GPU 算出其中一項，最後做一次 all-reduce 就得到輸出。XW = Y 之後完全不需要通訊。

</details>

### ND 平行

最後把 TP、CP、PP、DP 同時用上：把 GPU 排成 4D 網格，每張 GPU 在網格中的索引就是它在各平行維度上的 rank。Llama3-405B 的設定就是這樣調出來的，目標一樣是最大化 MFU。

## 自學建議

- **把四種平行化跟張量維度綁在一起記。** 看到任何分散式訓練論文，先問「它切的是哪一維、要付出哪個通訊原語」。
- **先學會算 MFU。** 下一次自己訓練模型時，照五步算一次，比追新框架更能知道瓶頸在哪。
- **小規模就能練 activation checkpointing。** PyTorch 單張 GPU 就能開，觀察記憶體和每步時間的變化。
- **缺口**：這一講沒有對應作業，投影片也沒有程式練習。2026 錄影不公開，想聽口頭推導只能看 2025 錄影。

## 延伸閱讀

- 更深入的平行化實作與 GPU 硬體：[CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)的 [GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)、[平行化機制](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[平行化策略](/posts/ai/2026-08-22-cs336-parallelism-strategies)
- 為什麼影片 token 會爆炸：本系列上一篇 [L10：影片理解](/posts/ai/2026-09-30-cs231n-video-understanding)
- 大 batch 對比學習為什麼需要分散式訓練：本系列下一篇 [L12：自監督學習](/posts/ai/2026-09-30-cs231n-self-supervised-learning)

**系列導覽**：上一篇 [L10：影片理解](/posts/ai/2026-09-30-cs231n-video-understanding)｜下一篇 [L12：自監督學習](/posts/ai/2026-09-30-cs231n-self-supervised-learning)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [Lecture 11: Large Scale Distributed Training 投影片（Spring 2026, PDF）](https://cs231n.stanford.edu/slides/2026/lecture_11.pdf)
- [CS231N Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N 2025 Lecture 11: Large Scale Distributed Training（YouTube）](https://www.youtube.com/watch?v=9MvD-XsowsE)
- [Stanford CS231N 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Llama Team (2024). The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783)
- [Rajbhandari et al. (2019). ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Chowdhery et al. (2022). PaLM: Scaling Language Modeling with Pathways](https://arxiv.org/abs/2204.02311)
- [Jacobs et al. (2023). DeepSpeed Ulysses](https://arxiv.org/abs/2309.14509)
- [Liu et al. (2023). Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Huang et al. (2018). GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism](https://arxiv.org/abs/1811.06965)
