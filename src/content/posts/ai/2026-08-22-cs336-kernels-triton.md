---
title: "CS336 Lecture 6：寫 Triton kernel 前，先學會 benchmark 與 profile"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, triton, gpu, cuda, performance]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 7
tldr: "第六講把 GPU 原理落到 kernel：benchmark 看不同尺寸如何縮放，profiler 看實際呼叫與時間，再以 Triton 實作 GeLU、softmax、reduction 與 tiled matmul；快的前提是先量對。"
description: "Stanford CS336 Spring 2026 Lecture 6 導讀：可靠 GPU benchmark、profiler、warp/occupancy/bank conflict、Triton programming model、fusion 與 tiling。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-kernels-triton-en)

本篇對應 **CS336 Spring 2026 Lecture 6: Kernels, Triton**，2026 年 4 月 15 日由 Percy Liang 主講。主要來源是官方可執行講義 [`lecture_06.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_06.py)。

第五講說明資料搬運、tiling 與 fusion；第六講要求你實際量測並寫 kernel。順序不能顛倒：沒有可靠 benchmark 與 profiler，手寫 kernel 只是在替猜測最佳化。

## 正確性、效能與診斷是三層工作

PyTorch 提供 tensor semantics 與成熟 kernels，先建立正確基線。Triton 讓程式設計者以 thread blocks 和 tiles 思考，控制資料如何從 HBM 載入、在較快的記憶體計算、再寫回。更底層的 PTX 能揭露 load/store 與 registers，但通常不是第一個起點。

三層各有任務：framework reference 證明答案對；benchmark 比較速度與 scaling；profiler 告訴你實際執行哪些 kernels、各花多久。只做最後一次 wall-clock，無法區分 compilation、launch overhead、非同步執行與真正 kernel 時間。

## Benchmark 要處理 GPU 的非同步性

GPU operation 通常非同步排入 queue。CPU timer 若沒有同步，量到的可能只是 launch 時間。可靠測量要 warm up，排除 JIT compilation 與 cache 初次成本。接著用 CUDA events 或明確 synchronization，重複多次並掃過尺寸，而非只測單一 shape。

尺寸掃描會揭露 kernel dispatch、tile alignment 與 wave quantization。相同 API 在不同 tensor shape 下可能選到不同 CUTLASS kernel；小矩陣可能被 launch overhead 主導，大矩陣才接近硬體吞吐上限。

## Profiler 回答「時間花在哪」

Profiler 能看到 PyTorch operation 最後呼叫的 CUDA kernel、執行時間與 shape。Naive GeLU 由多個 pointwise kernels 組成，中間值反覆進出 HBM；builtin 或 compiled 版本可融合為一次讀取、一次寫回。這個證據比「編譯器應該會融合」更可靠。

硬體細節仍會出現在結果裡。Warp 內 branch divergence 會序列化，register 使用太高會降低 occupancy。Shared memory 的 banks 若被衝突存取也會序列化；HBM access 未 coalesce 則浪費 transaction。Occupancy 也不是越高必然越快：thread coarsening 可能以較少 resident threads 換取更高資料重用。

## Triton 的基本單位是 block of data

Triton kernel 先依 program ID 找到本 block 的索引，產生 offsets 與 mask，再載入一塊資料、向量化計算並存回。GeLU 是最簡單的 elementwise fusion。Row-wise softmax 在一列內求最大值、指數與總和；row sum 累積多個 tiles；matmul 則同時切 A、B tiles。

這些例子剛好形成難度階梯：

1. GeLU：每個元素獨立，主要目標是 fusion。
2. Softmax：一列內有 reduction，還要處理數值穩定。
3. Row sum：資料超過單一 block 時需要分塊累積。
4. Matmul：選 tile shapes、重用 shared data、控制 registers 與邊界 mask。

Matmul 後若立刻接 ReLU 或 GeLU，可以直接在輸出仍位於快速記憶體時套用，避免額外 kernel 與 HBM round trip。

## 寫 kernel 的停止條件

先用 framework implementation 作 correctness oracle，涵蓋非整除尺寸與 dtype tolerance。再畫出 runtime 隨尺寸的曲線，確認自寫版本在哪些區間勝出。最後用 profiler 檢查 kernel 數量、memory traffic 與 occupancy，避免只對一個 benchmark 特化。

Triton 降低了 CUDA 的語法負擔，沒有移除硬體限制。第六講真正教的是完整迴圈：理解 programming model、量測、定位，再動手改資料路徑。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整可執行講義，包含可執行 benchmark、profiler 與四組 Triton 範例。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 6 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_06.py)
- [Triton language documentation](https://triton-lang.org/main/index.html)
- [PyTorch Profiler](https://pytorch.org/tutorials/recipes/recipes/profiler_recipe.html)
