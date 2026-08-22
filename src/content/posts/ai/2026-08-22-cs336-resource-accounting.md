---
title: "CS336 Lecture 2：先算 FLOPs 與記憶體，再談模型跑不跑得動"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm, pytorch, gpu, performance]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 3
tldr: "第二講把模型訓練還原成 tensor、FLOPs、bytes 與時間：用 einops 管維度，以 arithmetic intensity 和 roofline 判斷瓶頸，再用 gradient accumulation 與 activation checkpointing 交換運算和記憶體。"
description: "Stanford CS336 Spring 2026 Lecture 2 導讀：PyTorch tensor、einops、訓練 FLOPs、MFU、arithmetic intensity、roofline、optimizer 記憶體，以及兩種常用省記憶體技法。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-resource-accounting-en)

本篇對應 **CS336 Spring 2026 Lecture 2: PyTorch (einops), resource accounting**，2026 年 4 月 1 日由 Percy Liang 主講。主要來源是官方可執行講義 [`lecture_02.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py)。

第一講把 efficiency 放到課程中央；第二講立刻要求你把它算出來。問題不再是籠統的「這個模型很大」。你要問訓練 70B 模型需要多少運算、八張 H100 裝得下多大的 AdamW 模型，以及操作受算力或記憶體頻寬限制。

## 所有東西最後都是 tensor

資料、參數、梯度、activation 與 optimizer state 都存在 tensor 裡。估算記憶體只需要兩個量：元素數量與每個元素的 bytes。fp32 每個值 4 bytes；fp16 和 bf16 是 2 bytes。bf16 保留接近 fp32 的動態範圍，解析度則較低，因此深度學習常用 bf16 儲存參數、activation 與梯度，optimizer state 留在 fp32。

這個清單也說明為什麼「參數量乘兩個 bytes」通常嚴重低估訓練記憶體。AdamW 不只存權重，還要存梯度、動量與二階動量；activation 又隨 batch size、sequence length 與層數改變。只算權重頂多得到下限。

## einops 是把維度名稱寫進運算

PyTorch 的 `transpose(-2, -1)` 很短，卻把語意藏在負索引裡。`einops` 用名稱描述每個維度，讓 einsum、reduce 與 rearrange 直接呈現「哪個軸被保留、哪個軸被加總、哪幾個軸被拆開」。

這不是語法偏好而已。Transformer 常見 tensor 會同時帶 batch、sequence、head 與 hidden 維度；一個軸放錯位置，程式可能仍能 broadcast 並產生錯誤答案。把 shape 寫成可讀的契約，是後面做效能優化前的正確性基礎。

## FLOPs 先回答總工作量

一個乘法加一個加法算兩次 floating-point operations。矩陣乘法的成本可以從三個索引的迴圈推回來；對 dense Transformer，課堂使用一個常見的粗估：一次完整訓練約需

```text
6 × parameters × training tokens FLOPs
```

係數 6 把 forward 與 backward 的主要矩陣乘法合在一起。它不是精準 profiler，但足以做量級判斷。把總 FLOPs 除以 GPU 數量、每張卡的峰值 FLOP/s 與預期利用率，就能先估訓練時間，而不是先租機器再猜。

講義也區分 FLOPs 與 FLOP/s：前者是做了多少工作，後者是硬體每秒能做多少。Model FLOPs Utilization（MFU）則是實際吞吐除以規格峰值；規格表的數字不是程式自然會拿到的速度。

## Arithmetic intensity 決定你在等誰

Arithmetic intensity 是每搬動一個 byte 能完成多少 FLOPs。Elementwise operation 幾乎沒有重用資料，常受記憶體頻寬限制；大型 matrix multiplication 會重複使用載入的資料，更可能受算力限制。

Roofline model 把兩個上限放在一起：

```text
achievable FLOP/s = min(peak compute, memory bandwidth × arithmetic intensity)
```

如果點落在斜線區，增加算術單元沒有用，該減少資料搬運或融合操作。落在水平區才是 compute-bound，這時低精度 tensor core 或更高峰值算力才直接有效。這個判斷會一路接到後面的 GPU、kernel 與 FlashAttention。

## 反向傳播為什麼大約是 forward 的兩倍

線性層 forward 算輸出；backward 還要分別算輸入梯度與權重梯度，兩者都是相近規模的矩陣乘法。因此主要 dense operation 常可粗估為 backward 約兩倍 forward，合計得到前面的係數 6。

Optimizer 的算術成本通常不像矩陣乘法那麼大，卻可能受 memory bandwidth 限制，並占用大量 state。這正是只看 FLOPs 會漏掉的地方：runtime 不只由操作數量決定，也由資料在哪裡、要搬幾次決定。

## 兩種用運算換記憶體的方法

**Gradient accumulation** 把大 batch 拆成數個 microbatch，累積梯度後才更新一次。它降低每次 forward/backward 要保留的 activation，但不會減少完成同一批資料所需的總運算。

**Activation checkpointing** 只保存部分中間結果，backward 時重算其餘 activation。它刻意增加 FLOPs，換取較低峰值記憶體。當模型原本因記憶體不足而無法使用理想 batch 或 sequence length，這筆交換可能讓整體訓練更有效率。

## 做完這講該留下的表格

替自己的模型列四欄：parameters、gradients、optimizer states、activations。每欄標 dtype、元素數與 bytes；再列主要操作的 FLOPs、讀寫 bytes 與 arithmetic intensity。最後才問該改 batch、precision、checkpointing，或換硬體。

這份表不會取代 profiler，但能先抓出差一個數量級的錯誤。CS336 的 resource accounting mindset 就是：在執行昂貴實驗以前，先讓估算說明你預期會看到什麼。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整可執行講義。本文依講義的 PyTorch 範例與總結整理，未混用其他學期版本。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 2 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py)
- [PyTorch automatic mixed precision](https://pytorch.org/docs/stable/amp.html)
- [Einops documentation](https://einops.rocks/)
