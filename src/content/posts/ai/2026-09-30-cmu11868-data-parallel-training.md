---
title: "CMU 11-868 L14–L15：分散式訓練與資料平行，梯度同步的代價從哪裡來"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, distributed-training, parallelism, pytorch, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 11
tldr: "11-868 第 14、15 講從 parameter server 講到 PyTorch DDP：先用 NCCL 的五個 collective（Broadcast、Reduce、AllReduce、ReduceScatter、AllGather）當積木，推出 ring 為什麼能讓廣播時間幾乎不隨 GPU 數增加，再把 AllReduce 拆成 ReduceScatter 加 AllGather。第二講拆 DDP 的兩個關鍵設計：把梯度分桶（預設 25 MB）、在反向傳播還沒結束時就開始同步。官方課表未列公開錄影連結，本文依投影片頁碼與 VLDB 2020 論文整理。"
description: "CMU 11-868 LLM Systems（2026 春季版）第 14–15 講導讀：parameter server 與 AllReduce 資料平行的差別、NCCL collective 與 ring 演算法、ring AllReduce 的兩個階段、PyTorch DDP 的 world size／rank、gradient bucketing 與計算通訊重疊，以及 DDP 論文裡的兩個陷阱。附投影片頁碼與讀法。"
draft: false
glossary:
  - term: "AllReduce"
    aliases: ["all-reduce", "ring AllReduce", "ring all-reduce"]
    definition: "一種 collective 通訊：每張 GPU 各有一份資料，做完加總（或取最大、最小）之後，每張 GPU 都拿到完整的結果。可以拆成 ReduceScatter 加 AllGather 兩步。"
    context: "資料平行訓練每一步都要對梯度做一次 AllReduce，L14 第 32–45 頁逐步畫出 ring 版本。"
  - term: "NCCL"
    aliases: ["Nvidia Collective Communication Library"]
    definition: "NVIDIA 的多 GPU 通訊函式庫，提供 collective 與點對點的傳送、接收，支援 PCIe、NVLink、InfiniBand 與 IP socket。"
    context: "L14 用它的 API 介紹 Broadcast、Reduce、AllReduce、ReduceScatter、AllGather 五個原語。"
    links:
      - label: "NVIDIA NCCL"
        url: "https://developer.nvidia.com/nccl"
  - term: "gradient bucketing"
    aliases: ["梯度分桶", "bucket_cap_mb"]
    definition: "PyTorch DDP 把多個參數的梯度打包成一個「桶」，整桶梯度都算好了才發一次 AllReduce，在「每個梯度各同步一次太頻繁」和「全部算完才同步太晚」之間取折衷。"
    context: "DDP 論文寫明預設每桶 25 MB，可用 bucket_cap_mb 調整。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-data-parallel-training-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。事實皆於 2026-09-30 打開[課程 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)、[L14 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-14-distributed-training-b27c3d1dc185e680c6f5cc924e9ec9d7.pdf)（48 頁）、[L15 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-15-ddp-165dbe3873fac21eb8b339e64bcfee28.pdf)（26 頁）與 [PyTorch DDP 論文](https://www.vldb.org/pvldb/vol13/p3005-li.pdf)核對。存取等級 **A3**，但**官方課表未列本課公開錄影連結**。以下頁碼一律指 PDF 頁數；L14 投影片角落印的編號比 PDF 頁數大 2 到 3，對照時請以 PDF 為準。

**系列位置**：上一篇 [HW4：Softmax 與 LayerNorm 的 CUDA 融合 kernel](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration)｜下一篇 [L16–L17 模型平行與 MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 這兩講在回答什麼

[上一講的 LightSeq](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq) 把一張 GPU 榨乾。接下來的問題是：一張不夠時，**多張 GPU 一起訓練，時間花在哪裡？**

L14 第 5 頁先給規模感：

- **DeepSeek-V3（671B）**：預訓練用了 2,048 張 H800，跑了約兩個月，合計 266.4 萬 H800 GPU 小時。
- **LLaMA 3.1（405B）**：用了 16,000 張 H100，合計 3,084 萬 GPU 小時。

這種規模下，GPU 之間怎麼交換資料，直接決定錢花得值不值。

第 6 頁把擴展策略分成兩大類：

| 切資料 | 切模型 |
|---|---|
| 單機資料平行、分散式資料平行、parameter server | 模型平行：管線平行（pipeline）、張量平行（tensor） |

這兩講只處理左欄：**每張 GPU 放一整份模型，各自吃不同的資料**。右欄是[下一篇](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)的主題。Syllabus 把 L14 排在 3 月 9 日（春假後第一堂）、L15 排在 3 月 11 日，L15 的 reading 是 [PyTorch DDP 論文](https://www.vldb.org/pvldb/vol13/p3005-li.pdf)（VLDB 2020）。3 月 20 日另有一堂「Recitation 6 Distributed Training」，Syllabus 沒有附投影片。

## 直覺：資料平行只有一件事要同步

資料平行的每一步都一樣（L14 第 32 頁）：

1. 把一個 batch 切給每個 worker
2. 每個 worker 用自己那份資料做前向、反向，得到**局部梯度**
3. 所有 worker 一起算出**平均梯度**
4. 每個 worker 用平均梯度更新自己那份參數

第 1、2、4 步各做各的，完全不用溝通。**唯一的通訊成本在第 3 步**。所以整個問題變成：這一步要怎麼做才夠快、才能不讓 GPU 閒著等？

## 機制一：從 parameter server 到 AllReduce

### 舊做法：parameter server

L14 第 7 頁畫出經典的 parameter server：worker 先從 server 拉（pull）參數，算完局部梯度推（push）回 server，server 加總、更新參數，下一輪再重來。第 30 頁把它翻成 NCCL 語言：pull 就是 Broadcast、push 就是 Reduce。

第 46 頁點出它的問題：**要同步兩次**（參數一次、梯度一次），而且 worker 要等 server 送參數，server 要等所有 worker 送梯度。

### NCCL 的五個積木

[NCCL](https://developer.nvidia.com/nccl) 是 NVIDIA 的多 GPU 通訊函式庫。L14 第 9 頁說它同時提供 collective 與點對點通訊，支援 PCIe、NVLink、InfiniBand、IP socket，而且每個操作都綁在一個 CUDA stream 上。第 10–15 頁逐一介紹五個 collective：

| 原語 | 做什麼 | 頁碼 |
|---|---|---|
| Broadcast | 把 root 上 N 個元素複製到所有 rank | p.11 |
| Reduce | 跨裝置做加總（或最大、最小），結果只寫到一個 rank | p.12 |
| AllReduce | 做完 reduction，每個 rank 都拿到結果（＝ Reduce ＋ Broadcast） | p.13 |
| ReduceScatter | 做完 reduction，結果切成幾段，分散到各 rank | p.14 |
| AllGather | 從 k 個 rank 各收 N 個值，拼成 k×N 的結果發給所有 rank | p.15 |

第 15 頁底下有一行關鍵等式：**AllReduce ＝ ReduceScatter ＋ AllGather**。後面的 ring AllReduce 就是照這個拆法做的。

### 為什麼用 ring：把資料切小，讓傳輸變成管線

第 18 頁說 NCCL 用「環」在 GPU 之間搬資料、做 reduction。第 19–28 頁用 Broadcast 推導為什麼。設要傳 N bytes、頻寬 B、共 K 張 GPU 排成單向環：

- **整包傳**：每一跳花 N/B，要傳 K−1 跳，總時間 (K−1)·N/B（p.22）。GPU 越多越慢。
- **切成 S 份傳**：每一跳只花 N/(S·B)，而且第一份傳到下一站時，第二份已經可以出發。總時間是 (K−2+S)·N/(S·B)，S 夠大時**約等於 N/B**（p.28）。

後者的時間幾乎跟 GPU 數量無關。把大訊息切小、讓每條連線同時都在忙，這是理解 ring 演算法的核心。

### ring AllReduce：先 ReduceScatter，再 AllGather

第 34–43 頁用 4 個 worker 逐步畫出 ring AllReduce。每個 worker 把自己的梯度切成 4 塊（worker 0 是 a0–a3，worker 1 是 b0–b3，依此類推）：

1. **ReduceScatter 階段**（p.35–42）：每一步，每個 worker 把一塊傳給環上的下一位，下一位把收到的加到自己對應那塊上。繞完 K−1 步，每個 worker 手上各有**一塊**已經加總完成的結果（例如某個 worker 拿到 a1+b1+c1+d1）。
2. **AllGather 階段**（p.43）：再繞 K−1 步，把這些完成的塊傳給所有人。結束時每個 worker 都有完整的加總梯度。

第 44–45 頁附了用 MPI 寫的兩個階段的程式碼。投影片沒有推 ring AllReduce 的總通訊量公式；想看這部分的推導，[CS336 Lecture 7](/posts/ai/2026-08-22-cs336-parallelism-mechanics) 有完整的算法。

回到第 46 頁的比較：AllReduce 資料平行不需要 server，但**每個 worker 都要自己更新一次參數**。投影片自問「這樣重複嗎？」，答案是：在本地更新比把資料在 GPU 之間搬來搬去快得多。

<details>
<summary>L14 投影片上的 NCCL 呼叫範例（p.29）</summary>

投影片示範在一個 process 管多張 GPU 時，怎麼初始化 communicator、發起 AllReduce、再等 stream 完成：

```c
NCCLCHECK(ncclGroupStart());
for (int i=0; i<nDev; i++) {
  CUDACHECK(cudaSetDevice(localRank*nDev + i));
  NCCLCHECK(ncclCommInitRank(comms+i, nRanks*nDev, id, myRank*nDev + i));
}
NCCLCHECK(ncclGroupEnd());

NCCLCHECK(ncclGroupStart());
for (int i=0; i<nDev; i++)
  NCCLCHECK(ncclAllReduce((const void*)sendbuff[i], (void*)recvbuff[i],
                          size, ncclFloat, ncclSum, comms[i], s[i]));
NCCLCHECK(ncclGroupEnd());

for (int i=0; i<nDev; i++)
  CUDACHECK(cudaStreamSynchronize(s[i]));
```

</details>

## 機制二：PyTorch DDP 怎麼把同步藏起來

L15 從 L14 的結論接下去：演算法有了，實際的框架要怎麼做？主角是 [PyTorch Distributed Data Parallel（DDP）](https://www.vldb.org/pvldb/vol13/p3005-li.pdf)。

### 兩個設計目標

L15 第 8 頁引用論文列出的兩個目標：

- **Non-intrusive**：開發者應該能沿用單機訓練腳本，只做最少修改
- **Interceptive**：API 要讓內部實作能攔截各種訊號、及時觸發對應的演算法，盡量把優化機會交給實作

第 12 頁的範例就是第一個目標的樣子：把 `model` 包成 `DDP(model, device_ids)`，其餘的 loss、optimizer、`backward()`、`step()` 都照舊。

### world size、global rank、local rank

第 9 頁定義三個名詞，以兩台機器、每台兩張 GPU 為例：

- **world size**：總共幾個 process（這裡是 4）
- **global rank**：全域的 process 編號（0–3）
- **local rank**：同一台機器內的編號（每台都是 0、1）

第 10–11 頁說明舊的 `torch/distributed/launch.py` 會用環境變數 `MASTER_ADDR`、`MASTER_PORT`、`RANK`、`WORLD_SIZE` 傳入這些資訊，每個 process 再用 `dist.init_process_group(backend="nccl")` 加入 process group。課程的[程式碼範例](https://github.com/llmsystem/llmsys_code_examples/tree/main/ddp_example)（L15 第 23 頁的 code walkthrough）則改用 `torchrun --nproc_per_node=2 main.py --ddp` 啟動。

### 什麼時候同步：gradient bucketing

最直接的做法是等整個反向傳播跑完，再對所有梯度做一次 AllReduce。第 13–14 頁指出可以更好：**梯度是一層一層從後往前算出來的**，後面幾層的梯度早就算好了，沒必要等前面幾層。

但如果每個參數一算好就各自同步一次，又會同步得太頻繁。DDP 的折衷是分桶（第 15–18 頁）：

- 桶的大小由 DDP 建構子的 `bucket_cap_mb` 參數設定
- 參數分到哪個桶，是在**建構 DDP 時**依桶大小上限與參數大小決定的
- 參數大致依 `model.parameters()` 的**反向順序**分桶，因為 DDP 預期反向傳播時梯度大致按這個順序算好
- 一個桶裡的梯度全到齊，Reducer 就對這個桶發起**非同步 AllReduce**，同時反向傳播繼續算前面的層

結果是反向計算與 AllReduce 通訊重疊。第 20 頁貼了 PyTorch C++ 原始碼的骨架：每個參數的梯度累加完會觸發 `autograd_hook`，把該桶的待完成數減一；歸零時 `mark_bucket_ready` 會**依桶的順序**把已就緒的桶送去 AllReduce。第 21–22 頁的圖表展示 DDP 的擴展性與重疊通訊帶來的延遲下降。

### 論文補充了投影片沒細講的部分

[DDP 論文](https://arxiv.org/abs/2006.15704)描述的是 PyTorch v1.5 的實作。摘要列出三個加速技巧：梯度分桶、計算與通訊重疊、**跳過梯度同步**。在適當設定下，論文報告 DDP 在 256 張 GPU 上達到接近線性的擴展。

幾個讀論文時值得注意的細節：

- **預設每桶 25 MB**。論文說桶大小是關鍵取捨：桶越大，平攤到每個梯度的通訊開銷越小，但每個桶要等更多梯度才能出發。它建議應用自己實測調整；在 16 張 GPU、NCCL 後端的 ResNet50 實驗裡，最快的區間落在 10 MB 到 25 MB 之間。
- **為什麼一定要依順序送桶**。每個 process 每次前向都會動態建出 autograd 圖，不同 process 的梯度就緒順序可能不一樣。如果各自一就緒就送，AllReduce 的內容會對不上，結果錯誤甚至當掉。所以所有 process 必須用同樣的分桶順序，桶 i 還沒送之前不能送桶 i+1。論文也承認用 `model.parameters()` 反向順序只是近似。
- **沒用到的參數會讓反向傳播卡住**。如果某些參數這一輪沒參與計算，它們的桶永遠等不到齊，反向傳播就會 hang。DDP 提供 `find_unused_parameters` 選項，在前向結束時走一遍 autograd 圖標出沒用到的參數。
- **跳過同步**：`no_sync()` context manager 讓你在梯度累積的幾個小步裡不同步，只在最後一步同步一次。
- 論文支援 NCCL、Gloo、MPI 三種通訊後端，並比較了 NCCL 與 Gloo。

## 這兩講沒講什麼

- **模型放不進一張卡怎麼辦**：L15 最後一頁的下一講 reading 是 GPipe 與 Megatron-LM，也就是[管線平行與張量平行](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)。
- **每張卡都存一整份 optimizer state 太浪費**：這是 [ZeRO 篇](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization)的主題。L10 最後一頁把 PyTorch FSDP 論文也列為 reading，但 2026 春季 Syllabus 在這兩堂只掛了 DDP 論文。
- **實作**：[HW5](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training) 要你自己寫資料平行與管線平行，需要至少 2 張 GPU。

## 怎麼讀這兩講

1. L14 先讀第 19–28 頁的 ring broadcast 推導，自己把 (K−2+S)·N/(S·B) 算一次，感受「切小」為什麼有效。
2. 再讀第 34–43 頁的 ring AllReduce，拿紙筆跟著 4 個 worker 走一遍，確認每一步誰傳哪一塊給誰。
3. L15 讀第 13–20 頁，對照 DDP 論文第 3 節（System Design），重點放在分桶和順序的理由。
4. 最後跑一次課程的 [ddp_example](https://github.com/llmsystem/llmsys_code_examples/tree/main/ddp_example)，比較單卡與兩卡的每個 epoch 時間。

今晚可以做的一件事：在任何一個 PyTorch 訓練腳本裡，把 `bucket_cap_mb` 設成 1、25、100 各跑幾步，看每步時間怎麼變。

## 延伸閱讀

- 用 collective 組出資料、張量與管線平行，含通訊量推導：[CS336 Lecture 7：從 collective operations 組出資料、張量與管線平行](/posts/ai/2026-08-22-cs336-parallelism-mechanics)
- ZeRO、FSDP 與硬體拓撲：[CS336 Lecture 8：ZeRO、FSDP 與 3D Parallelism 怎麼對齊硬體拓撲](/posts/ai/2026-08-22-cs336-parallelism-strategies)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時回官方課程頁與公開影音來源查證，仍未找到該講公開錄影，狀態維持不變。

## 參考資料

- [CMU 11-868 LLM Systems（Spring 2026）課程首頁](https://llmsystem.github.io/llmsystem2026spring/) — 講師與課程描述
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — L14（3/9）、L15（3/11）日期、DDP reading、Recitation 6
- [L14 投影片：Distributed Training（PDF，48 頁）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-14-distributed-training-b27c3d1dc185e680c6f5cc924e9ec9d7.pdf) — parameter server、NCCL 原語、ring broadcast 與 ring AllReduce
- [L15 投影片：Distributed Data Parallel Training（PDF，26 頁）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-15-ddp-165dbe3873fac21eb8b339e64bcfee28.pdf) — DDP 設計目標、rank、gradient bucketing、Reducer 原始碼
- [Li et al., PyTorch Distributed: Experiences on Accelerating Data Parallel Training（VLDB 2020）](https://www.vldb.org/pvldb/vol13/p3005-li.pdf) — Syllabus 指定的 reading
- [同一篇論文的 arXiv 版（2006.15704）](https://arxiv.org/abs/2006.15704) — 三個加速技巧、256 GPU 接近線性擴展、預設 25 MB、分桶順序與 unused parameters
- [llmsystem/llmsys_code_examples：ddp_example](https://github.com/llmsystem/llmsys_code_examples/tree/main/ddp_example) — L15 的 code walkthrough，用 `torchrun` 跑單卡與多卡
- [NVIDIA NCCL](https://developer.nvidia.com/nccl) — L14 介紹的通訊函式庫
