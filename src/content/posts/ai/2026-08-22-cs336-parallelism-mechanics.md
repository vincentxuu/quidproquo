---
title: "CS336 Lecture 7：從 collective operations 組出資料、張量與管線平行"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, distributed-training, pytorch, gpu, parallelism]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 8
tldr: "第七講不從 FSDP API 開始，而是用 broadcast、all-reduce、all-gather、reduce-scatter 與 all-to-all 建立通訊語言，再親手組出 data、tensor 與 pipeline parallelism。"
description: "Stanford CS336 Spring 2026 Lecture 7 導讀：GPU 網路階層、collectives、torch.distributed、data parallel、tensor parallel、pipeline parallel 與通訊成本。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en)

本篇對應 **CS336 Spring 2026 Lecture 7: Parallelism**，2026 年 4 月 20 日由 Percy Liang 主講。主要來源是官方可執行講義 [`lecture_07.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_07.py)。

單張 GPU 的 optimization 到這裡結束。模型、optimizer state 或 batch 再大，就必須跨 devices。第七講刻意不用高階 wrapper 遮住細節，而是從 collective operations 組出三種基本平行化。

## 通訊有明確的距離階層

同一 GPU 內的 registers、shared memory 與 HBM 最快；同一節點的 GPUs 可經 NVLink/NVSwitch；跨節點走 InfiniBand 或 Ethernet，頻寬更低、延遲更高。RDMA 讓裝置直接讀寫遠端記憶體，避免 CPU 與 kernel network stack 的額外複製。

因此「傳多少 bytes」還不夠，必須知道 bytes 走哪條 link。Tensor parallel 每層都溝通，通常只能放在高速互連範圍；pipeline parallel 溝通頻率較低，可以跨較慢 links，但會產生 bubble。

## Collectives 是分散式訓練的指令集

Rank 是一個 participating process/device，world size 是總數。Broadcast、scatter、gather、reduce 是基礎；all-gather、reduce-scatter 與 all-reduce 是訓練主力；all-to-all 則用於 MoE routing。

All-reduce 可拆成 reduce-scatter 再 all-gather。這個等價關係非常關鍵：如果下一步只需要每張卡保留結果的一部分，就可以停在 reduce-scatter，不必立刻複製完整 tensor。下一講的 ZeRO/FSDP 正是利用這一點切分 state。

`torch.distributed` 與 NCCL 會依 topology 選擇 ring、tree 等演算法並啟動通訊 kernels。API 看似一行，但效能取決於訊息大小、link、拓撲與 collective pattern。

## Data parallel：複製模型、切分 batch

每個 rank 保存完整模型，處理不同資料，backward 後 all-reduce gradients。所有 ranks 從相同參數出發並套用相同平均梯度，所以更新後仍一致。

它的優點是簡單且計算獨立；限制是模型與 optimizer state 每張卡都完整複製，記憶體不會隨 world size 下降。Global batch 也隨 ranks 增加，超過 critical batch size 後，額外資料平行的收益會遞減。

## Tensor parallel：切分矩陣寬度

Tensor parallel 把線性層的 weight matrix 分成 row 或 column shards。各 rank 計算部分輸出，再用 all-reduce、all-gather 或 reduce-scatter 合成下一步需要的 layout。

它能讓單層參數分散，也讓所有 GPUs 同時工作，沒有 pipeline bubble；代價是每層頻繁通訊。因此通常把 tensor-parallel group 限制在單一高速 NVLink domain。

## Pipeline parallel：切分層的深度

把連續 layers 放在不同 ranks，activation 由前一 stage 傳給下一 stage。若一次送完整 batch，後面 stages 等前面，利用率很差。Microbatching 讓不同 stages 同時處理不同 microbatches，以 pipeline schedule 填滿空檔。

Bubble 無法完全消失，比例取決於 stages 與 microbatches。Pipeline 的優點是只需在 stage 邊界傳 activations，較適合較慢的跨節點 links；缺點是 schedule、activation storage 與負載平衡更複雜。

## 三種方法不是互斥選項

Data parallel 沿 batch 切、tensor parallel 沿 width 切、pipeline parallel 沿 depth 切。實際大型訓練會把它們組合，並加 sequence 或 expert parallel。選擇順序要跟硬體 topology 對齊：高頻通訊留在快 link，低頻通訊跨慢 link。

第七講的可執行程式最值得做的實驗，是固定 tensor 大小逐步增加 ranks，分別量 all-reduce、reduce-scatter 與各種平行方式。你會看到 scaling 並非線性，因為通訊與 idle time 會逐漸吃掉新增 compute。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整可執行講義，包含 collectives 與三種平行化的 PyTorch 範例。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 7 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_07.py)
- [PyTorch Distributed Overview](https://pytorch.org/tutorials/beginner/dist_overview.html)
- [NCCL documentation](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/)

