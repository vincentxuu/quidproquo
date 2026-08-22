---
title: "CS336 Lecture 8：ZeRO、FSDP 與 3D Parallelism 怎麼對齊硬體拓撲"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, distributed-training, fsdp, zero, parallelism]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 9
tldr: "第八講把平行化從原語提升到系統設計：ZeRO 逐階切 optimizer、gradient 與 parameter，TP/PP/SP/EP 再分別切 width、depth、sequence 與 experts；組合順序必須服從網路拓撲與動態 activation memory。"
description: "Stanford CS336 Spring 2026 Lecture 8 導讀：ZeRO 1–3、FSDP、pipeline/tensor/sequence/expert parallelism、activation memory 與 3D/4D parallelism。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-parallelism-strategies-en)

本篇對應 **CS336 Spring 2026 Lecture 8: Parallelism**，2026 年 4 月 22 日由 Tatsunori Hashimoto 主講。主要來源是官方 [`lecture_08.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf)。

第七講教你用 collectives 組出平行化；第八講問大型模型究竟該怎麼組。它把 datacenter 當成新的計算單位：GPU memory、NVLink domain、跨節點 fabric 與 batch size 共同決定切法，沒有一個 strategy 能單獨解完所有限制。

## ZeRO 從複製 state 開始減

Naive data parallel 每張卡都保存完整 parameters、gradients 與 optimizer states。計算能隨 batch 分散，記憶體卻完整複製。ZeRO 利用 reduce-scatter 與 all-gather 的等價性逐階 sharding：

- **Stage 1**：只切 optimizer states；每張卡更新自己負責的 parameter shard，再 all-gather 新參數。
- **Stage 2**：連 gradients 一起切；backward 完成一層就 reduce-scatter，避免保存完整梯度。
- **Stage 3／FSDP**：parameters 也切；forward/backward 前按層 all-gather，用完立刻釋放。

Stage 越高，persistent memory 越低，但 collectives 更頻繁，prefetch 與 computation/communication overlap 更重要。FSDP 也沒有自動解決 activation memory；sequence length 與 microbatch 仍可能把記憶體吃滿。

## Model parallel 解決「單層或整模放不下」

Pipeline parallel 沿 depth 切 layers。Microbatches 改善利用率，但會有 pipeline bubble；zero-bubble 類 schedule 甚至把 backward 拆成 activation gradient 與 weight gradient，重排空檔。

Tensor parallel 沿 width 切 matrix。它沒有 pipeline bubble，卻每層需要高速 collective，因此通常限制在單 node 或 NVLink island。Sequence parallel 再把 normalization、dropout 等非 tensor-parallel 部分的 activation 沿 sequence 分散，使 activation memory 也更接近線性下降。

## MoE 多出 expert parallel

Expert parallel 把不同 experts 放在不同 ranks，透過 all-to-all route tokens。它在 MLP 部分像另一種 width parallel，能減少每張卡保存的 expert parameters。Attention 卻通常仍是 dense，導致兩種 blocks 的最佳 parallel degree 不同。

組合 EP、TP、DP 時不能單純把維度相乘。Expert load 是否平衡、all-to-all 是否跨慢 links、DP replicas 與 EP groups 是否重疊，都會改變實際 utilization。

## Activation 是動態記憶體，不能只算 parameters

Parameter memory 在啟動前可算清楚；activation 隨 batch、sequence、hidden size、layers 與 checkpoint strategy 改變。Tensor/pipeline parallel 能分散部分 activation，sequence parallel 才進一步處理在 sequence 維度上重複的部分。

長 context 還會加入 context parallel：不同 ranks 各持一段 sequence，再交換 attention 所需的 K/V。它能讓 context 長度跨卡擴展，代價是 attention communication 與 load balance。

## 3D／4D parallelism 的實務順序

課堂整理出的原則不是固定數字，而是一個 topology-aware 順序：

1. 模型尚未 fit 前，先在單機高速互連內使用 TP 或 EP。
2. 再以 PP 跨較慢節點切 layers，接受並控制 bubbles。
3. 模型 fit 後，把剩餘 devices 用於 DP／ZeRO 擴大吞吐。
4. Activation 或 context 成為瓶頸時加入 SP／CP 與 recomputation。

大型模型案例使用的組合不同，正好證明沒有普遍最佳配置。Dense 與 MoE、短 context 與長 context、訓練初期與延長 context 階段都可能換 strategy。

## 怎麼驗證一個平行化配置

先做 per-rank memory accounting，分開 parameters、optimizer、gradients、activations 與 communication buffers。再列每一維 parallelism 的 collective、訊息大小、頻率與 link。最後量 steady-state throughput、bubble fraction 與通訊重疊，而不是只確認 OOM 消失。

一個配置能跑不代表它有效率。第八講的核心判準是：sharding 省下的記憶體，是否值得它新增的通訊與 idle time。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整官方 PDF。本文涵蓋投影片的 networking、ZeRO/FSDP、TP/PP/SP/EP 與組合策略。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 8 官方投影片](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf)
- [ZeRO](https://arxiv.org/abs/1910.02054)
- [PyTorch FSDP](https://pytorch.org/docs/stable/fsdp.html)
