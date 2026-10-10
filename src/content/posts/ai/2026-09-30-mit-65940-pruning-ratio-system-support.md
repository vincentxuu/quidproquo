---
title: "MIT 6.5940 第 4 講：每層剪多少、怎麼 fine-tune、硬體怎麼吃稀疏"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, pruning, model-compression, hardware]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 3
tldr: "MIT 6.5940 第 4 講把剪枝的後半段講完：用敏感度分析、AMC（強化學習）或 NetAdapt（逐步查表）決定每層剪多少；用 1/10 到 1/100 的學習率 fine-tune、迭代剪枝把 AlexNet 的剪枝倍數從 5 倍推到 9 倍；最後看 EIE、NVIDIA 2:4 稀疏與 TorchSparse/PointAcc，說明稀疏要有系統支援才會變快。"
description: "MIT 6.5940 EfficientML（Fall 2024）Lecture 4 Pruning and Sparsity Part II 導讀：非均勻剪枝、sensitivity analysis、AMC、NetAdapt、fine-tuning 與 iterative pruning、L1/L2 正則化，以及 EIE、M:N（2:4）稀疏、TorchSparse 與 PointAcc 的系統與硬體支援，附 Fall 2026 對照。"
draft: false
glossary:
  - term: "sensitivity analysis（剪枝）"
    aliases: ["敏感度分析", "sensitivity scan"]
    definition: "一次只剪一層、掃過不同剪枝比例，記下每個比例的準確率下降，畫出每層的敏感度曲線，再依曲線替每層挑剪枝比例。"
    context: "6.5940 第 4 講用 VGG-11 on CIFAR-10 示範，並指出它忽略層與層之間的交互作用。"
  - term: "2:4 sparsity"
    aliases: ["M:N sparsity", "N:M sparsity", "2:4 稀疏"]
    definition: "每四個連續權重中只保留兩個非零值的結構化細粒度稀疏格式；非零值往左壓縮存放，另外用 2-bit 索引記位置，NVIDIA Sparse Tensor Core 只做一半的乘法。"
    context: "6.5940 第 4 講以它說明「細粒度但有規則」的稀疏如何在 GPU 上兌現加速。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文以 [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940)為主幹（最近一屆完整學期；Fall 2025 因 Song Han 休假停開，理由見[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)）。主要材料是 [Lecture 4 投影片 Lec04-Pruning-II.pdf](https://www.dropbox.com/scl/fi/w5baiyci5cxl1ozpy6lsr/Lec04-Pruning-II.pdf?rlkey=6qxc1nz20isy9izwnqfebtukg&st=59gy1eal&dl=0)（119 頁，下文頁碼皆指 PDF 頁），[錄影](https://youtu.be/upaZrpXkELc)一併列出但本文的主張都以投影片為準。事實於 2026-09-30 打開官方材料核對。存取等級：Fall 2024 **A3**（投影片、錄影、lab 全公開）；Fall 2026 **A2**（進行中）。

**系列位置**：上一篇 [第 3 講：剪哪裡、剪多細、依什麼標準剪](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)｜下一篇 [Lab 1：Fine-grained vs Channel Pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

[第 3 講](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)回答了「剪哪種形狀」與「依什麼標準挑要剪的權重」。可是真要剪一個模型，還會卡在三件事：每一層該剪多少？剪完準確率掉了怎麼救？剪出來的稀疏矩陣，硬體到底會不會變快？

第 4 講就是這三個問題。投影片第 2 頁把整個剪枝單元拆成五個問題，第 3 講處理前三個，本講處理「Determine the Pruning Ratio」與「Fine-tune/Train Pruned Neural Network」，再加一整段系統與硬體支援。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=upaZrpXkELc
title: EfficientML.ai Lecture 4 - Pruning and Sparsity Part II (MIT 6.5940, Fall 2024)
```

原始影片：[EfficientML.ai Lecture 4 - Pruning and Sparsity Part II (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=upaZrpXkELc)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了開頭與結尾總結並抽查中段：用 sensitivity analysis 決定各層 pruning ratio、AMC（強化學習）、NetAdapt、fine-tune 恢復準確率、EIE 與稀疏加速器、NVIDIA 的稀疏支援（字幕轉寫不清，具體名稱以投影片為準）、點雲稀疏卷積的 merge-sort 配對。主題與講次和本文相符；本文只說錄影適合配著看加速器的圖，沒有對影片內容下具體說法。頁碼與投影片數字以投影片為準，未逐句比對影片。

## 先把剪枝寫成一個最佳化問題

第 4 頁給了剪枝的正式寫法：

$$
\arg\min_{W_P} L(x; W_P) \quad \text{s.t.} \quad \|W_P\|_0 < N
$$

$L$ 是訓練目標，$W_P$ 是剪過的權重，$\|W_P\|_0$ 數非零元素有幾個，$N$ 是你允許的非零數量上限。這條式子只規定「總共留多少」，沒說每層各留多少。本講第一段就在補這個缺口。

## 每層該剪多少

### 非均勻比均勻好

第 10–11 頁先重提一個結論：把每層的 channel 等比例縮小（uniform shrink），不如讓每層剪不同比例。投影片引用 [AMC（He et al., ECCV 2018）](https://arxiv.org/abs/1802.03494)的準確率對延遲曲線，剪枝版在同樣延遲下準確率較高。

問題變成：比例怎麼定？

### 做法一：敏感度分析

第 12 頁的理由很直觀：不同層對剪枝的敏感度不同，有些層很敏感（例如第一層），有些層很冗餘。第 16 頁寫出流程（以 VGG-11 on CIFAR-10 示範）：

1. 挑一層 $L_i$。
2. 用 $r \in \{0, 0.1, 0.2, \dots, 0.9\}$ 各剪一次。
3. 記下每個比例造成的準確率下降 $\Delta Acc_r$。
4. 對每一層重複。

畫完每層的曲線之後，設一條準確率門檻 $T$，每層取「還在門檻之上的最大剪枝比例」。

第 25–26 頁接著問：這樣是最佳解嗎？投影片的答案是「Maybe not」，因為它一次只動一層，沒有考慮層與層之間的交互作用。這就是下一個方法想解決的。

### 做法二：AMC，把比例交給強化學習

第 28 頁把目標講成「push-the-button」：不要靠同時懂機器學習和硬體的專家手調。AMC 把逐層決定剪枝比例寫成強化學習問題，第 31 頁列出設定：

| 元件 | 內容 |
|---|---|
| State | 層的索引、channel 數、kernel 大小、FLOPs 等特徵 |
| Action | 連續值 $a \in [0, 1)$，就是該層的剪枝比例 |
| Agent | DDPG，因為它支援連續動作輸出 |
| Reward | 滿足限制時為 $-\text{Error}$，不滿足時為 $-\infty$ |

延遲限制則用預先建好的查表（lookup table）估算，不必每次都上機實測。

第 34 頁的表是這一段最具體的證據。以 MobileNet 為基準（569M MACs、70.6% top-1、119.0 ms），AMC 在 50% FLOPs 設定下得到 285M MACs、70.5%、64.4 ms。對照組是手工把 MobileNet 寬度縮成 0.75 倍：325M MACs、68.4%、69.5 ms。延遲是在 Samsung Galaxy S7 Edge 上用 TF-Lite、單核、batch size 1 量的。

### 做法三：NetAdapt，一次砍一點、每次挑最好的那層

[NetAdapt（Yang et al., ECCV 2018）](https://arxiv.org/abs/1804.03230)走規則式、逐步的路線（第 35 頁）。目標同樣是找每層比例，讓整個模型滿足一個全域資源限制，例如延遲或能耗。第 41 頁的流程：

1. 每一輪設定這輪要砍掉的延遲量 $\Delta R$（手動指定）。
2. 對每一層各試一次：剪到剛好省下 $\Delta R$（靠查表估延遲），短期 fine-tune 10k 次迭代，量準確率。
3. 挑準確率最高的那一層，真的剪下去。
4. 重複到總延遲滿足限制，最後長期 fine-tune 回復準確率。

第 42 頁點出一個副產品：每一輪都產生一個模型，所以跑完會拿到一整串不同成本的模型，數量等於迭代次數。

## 剪完之後怎麼救準確率

第 45 頁：剪枝比例越高，準確率掉越多；fine-tune 剪過的網路可以救回準確率，也能把剪枝比例再往上推。投影片給了一個實用數字：fine-tune 的學習率通常是原本的 1/100 到 1/10。

第 46–53 頁講迭代剪枝（iterative pruning）：把「剪一次＋fine-tune 一次」當成一輪，每輪慢慢提高目標稀疏度。第 53 頁引用 [Han et al.（NeurIPS 2015）](https://arxiv.org/abs/1506.02626)：在 AlexNet 上，相較一次剪到位，迭代剪枝把剪枝倍數從 5 倍推到 9 倍。

第 54 頁補上正則化。訓練或 fine-tune 時在 loss 加一項，懲罰非零參數、鼓勵參數變小：

- L1：$L' = L(x; W) + \lambda |W|$
- L2：$L' = L(x; W) + \lambda \|W\|^2$

投影片舉的例子：magnitude-based fine-grained pruning 對權重加 L2；[Network Slimming（Liu et al., ICCV 2017）](https://arxiv.org/abs/1708.06519)則對 channel 的 scaling factor 加 smooth-L1。

## 稀疏要有系統支援才會變快

這是本講最長的一段（第 56–117 頁）。第 57 頁列出三個案例，剛好對應三種稀疏：

| 案例 | 吃的是哪種稀疏 |
|---|---|
| EIE | 權重稀疏＋activation 稀疏 |
| NVIDIA Tensor Core | M:N 權重稀疏 |
| TorchSparse 與 PointAcc | activation 稀疏（點雲的稀疏卷積） |

### EIE：第一顆吃稀疏壓縮模型的加速器

[EIE（Han et al., ISCA 2016）](https://arxiv.org/abs/1602.01528)在第 60 頁被稱為「The First DNN Accelerator for Sparse, Compressed Model」。它同時利用三件事：

- **稀疏權重**：90% 靜態稀疏，計算量少 10 倍、記憶體少 5 倍。
- **稀疏 activation**：70% 動態稀疏，計算量再少 3 倍。
- **權重共享**：4-bit 權重，記憶體少 8 倍。

第 61–75 頁逐步拆解它怎麼在多個 PE（processing element）之間切稀疏矩陣、dataflow 與每個 PE 的微架構，這部分適合配錄影看圖。

第 80 頁是整段最值得抄下來的一頁，投影片自己列了優缺點：

- 優點：證明專用硬體能讓密度到 50% 的矩陣做稀疏運算仍划算；同時跳過零權重與零 activation；支援細粒度稀疏，所以剪枝比例可以更高；4-bit 權重解碼成 16-bit 再算，投影片指出這種 W4A16 做法在 LLM 時代以 GPTQ、AWQ、llama.cpp、MLC LLM 的形式重生。
- 缺點：不容易套到向量處理器陣列上（改進方向是結構化的 N:M 稀疏）；控制流程與儲存有額外負擔（改進方向是粗粒度稀疏）；只支援 FC 層；把所有東西塞進 SRAM，適合 TinyML，不適合 LLM。

第 81 頁把這段收成一句原則：高效 AI 計算的第一原則是「懶」——避免重複計算、快速拒絕不必要的工作、或延後工作。

### M:N 稀疏：讓 GPU 也吃得下細粒度稀疏

EIE 的第一個缺點，NVIDIA 用 M:N 稀疏回應。第 83–85 頁引用 [Mishra et al.（arXiv 2021）](https://arxiv.org/abs/2104.08378)的 2:4 格式：每四個連續權重只留兩個非零值。存法是把非零值往左壓，$R \times C$ 的矩陣變成 $R \times C/2$ 的數值，再加一份 2-bit 的索引 metadata。

第 86 頁說明它怎麼上 Tensor Core：稀疏矩陣 A 從 $M \times K$ 變成 $M \times K/2$，硬體用索引從稠密矩陣 B 挑出對應的元素，四次乘法只做兩次。

會不會掉準確率？第 87 頁的表（ImageNet top-1）顯示幾乎不會，例如 ResNet-50 稠密 FP16 是 76.1，2:4 稀疏 FP16 是 76.2。

### TorchSparse 與 PointAcc：輸入本身就是稀疏的

第三種情況跟剪枝無關：點雲這類輸入本來就很稀疏。第 90 頁對比一般卷積與稀疏卷積：一般卷積會讓非零點向外擴散，稀疏卷積不會。

[TorchSparse（Tang et al., MLSys 2022）](https://arxiv.org/abs/2204.10319)把稀疏卷積拆成 gather → 矩陣乘 → scatter-accumulate（第 105 頁）。核心取捨在第 106–109 頁：

- 每個 kernel offset 各做一次矩陣乘：計算不浪費，但 kernel 呼叫很多、裝置使用率低。
- 全部當稠密卷積算：最規則，但多算很多。
- 分組後用 batched matmul：多一點點計算換規則性；再依模型與資料集搜尋自訂的分組策略（adaptive grouping）。

硬體端的 [PointAcc（Lin et al., MICRO 2021）](https://arxiv.org/abs/2110.07600)在第 115–116 頁用 merge sort 做 mapping unit，找出稀疏卷積的輸入輸出對應關係；第 117 頁是它相對 RTX 2080Ti、TPU v3 等平台的加速與省電圖。

## Fall 2026 對照

[Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)的 Lecture 4（9 月 22 日）已放出 [投影片](https://www.dropbox.com/scl/fi/cmqhxgcml6gpks9khm2vm/Lec04-Pruning-II.pdf?rlkey=k7fb0eam3aiy8kl9gosx2qt78&st=d75bnpaw&dl=0)與[錄影](https://www.youtube.com/watch?v=y-WU7PVj0cg)。我逐字比對兩份 PDF 的文字層：同樣 119 頁，差別只有封面圖、頁尾課名改成「TinyML and Efficient AI Computing」與排版空白。本篇內容對兩屆都適用。

差別在 lab：Fall 2024 在第 4 講發 Lab 1（Pruning）；Fall 2026 同一天發的 Lab 1 換成 GPU Basics，所以**想動手練剪枝，只能用 Fall 2024 的 Lab 1**，下一篇會拆它的題目。

## 讀完可以做的事

1. 先回答第 118 頁的兩個總結問題：比例怎麼自動找？不同粒度各要什麼系統支援？答不出來就回去看第 26、57 頁。
2. 把「非均勻比例」「fine-tune」「硬體支援」三件事對到你手上的模型：你的推論硬體支援 2:4 稀疏嗎？不支援的話，細粒度剪枝在那台機器上只省儲存、不省時間。
3. 今晚就能做的一件事：打開 [Fall 2024 Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN)，跑到 sensitivity scan 那一格，親眼看每層曲線長得多不一樣。

## 延伸閱讀

- 剪枝的前半段（粒度與標準）：[第 3 講導讀](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)
- 同一套想法在 LLM 上：[CMU 11-868 導讀：模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)（W4A16 為什麼重生）
- GPU 與 Tensor Core 的背景：[CS336：GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。
- 2026-10-10：依字幕核對影片內容。L4 影片主題與講次相符，抽樣未發現與本文矛盾，正文未改。

## 參考資料

- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940) — 排程（Lecture 4：9 月 17 日、Lab 1 同日發出）、投影片與錄影連結、Fall 2025 停開公告
- [Lec04-Pruning-II.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/w5baiyci5cxl1ozpy6lsr/Lec04-Pruning-II.pdf?rlkey=6qxc1nz20isy9izwnqfebtukg&st=59gy1eal&dl=0) — 本文所有頁碼出處
- [EfficientML.ai Lecture 4 錄影（Fall 2024）](https://youtu.be/upaZrpXkELc)
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 4 投影片、[錄影](https://www.youtube.com/watch?v=y-WU7PVj0cg)、Lab 1 改為 GPU Basics
- [Han et al., Learning both Weights and Connections for Efficient Neural Networks（NeurIPS 2015）](https://arxiv.org/abs/1506.02626) — fine-tune 與迭代剪枝
- [He et al., AMC: AutoML for Model Compression and Acceleration on Mobile Devices（ECCV 2018）](https://arxiv.org/abs/1802.03494)
- [Yang et al., NetAdapt: Platform-Aware Neural Network Adaptation for Mobile Applications（ECCV 2018）](https://arxiv.org/abs/1804.03230)
- [Liu et al., Learning Efficient Convolutional Networks through Network Slimming（ICCV 2017）](https://arxiv.org/abs/1708.06519)
- [Han et al., EIE: Efficient Inference Engine on Compressed Deep Neural Network（ISCA 2016）](https://arxiv.org/abs/1602.01528)
- [Mishra et al., Accelerating Sparse Deep Neural Networks（arXiv 2021）](https://arxiv.org/abs/2104.08378) — 2:4 稀疏格式與 Tensor Core 對應
- [Tang et al., TorchSparse: Efficient Point Cloud Inference Engine（MLSys 2022）](https://arxiv.org/abs/2204.10319)
- [Lin et al., PointAcc: Efficient Point Cloud Accelerator（MICRO 2021）](https://arxiv.org/abs/2110.07600)
