---
title: "CMU 11-868 L02–L04 GPU 程式模型與加速：thread、block、記憶體階層與 tiling"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, gpu, cuda, performance]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 2
tldr: "CMU 11-868 的 GPU 三講回答一個問題：為什麼寫對的 CUDA matmul 在 A100 上只用到 2.48% 的 FP32 算力。L02 講 SM、warp 與 grid／block／thread，L03 講 cudaMalloc、cudaMemcpy 與 kernel 索引，L04 用 tiling、coalesced access 與避開 bank conflict，把資料從約 500 個 cycle 外的 global memory 搬近一點。"
description: "導讀 CMU 11-868 LLM Systems（Spring 2026）L02 GPU Programming、L03 GPU Programming 2、L04 GPU Acceleration 三份投影片與 Recitation 1：GPU 伺服器與 SM 架構、SIMT 與 warp、CUDA 的記憶體配置與 kernel 啟動、compute-to-global-memory-access 比、記憶體階層、shared memory tiling、coalesced access、bank conflict、CSR 稀疏矩陣與 cuBLAS，並對應到 HW1。"
draft: false
glossary:
  - term: "SM"
    aliases: ["Streaming Multiprocessor", "串流多處理器"]
    definition: "NVIDIA GPU 的基本運算單元。L02 投影片的 A6000 有 84 個 SM，每個 SM 分四個 partition、每個 partition 32 個 core，並有共用的 L1／shared memory。"
    context: "CUDA 把 thread block 分配到 SM 上執行。"
  - term: "warp"
    aliases: ["執行緒束"]
    definition: "SM 建立、管理、排程與執行 thread 的單位，每個 warp 有 32 個 thread，同一個 cycle 執行同一道指令。"
    context: "CMU 11-868 L02 第 26 頁。"
  - term: "tiling"
    aliases: ["分塊", "shared memory tiling"]
    definition: "把輸入矩陣切成小塊，由一個 thread block 合力載入 shared memory 後重複使用，減少對 global memory 的存取。"
    context: "CMU 11-868 L04 用矩陣乘法示範，對應 PMPP 第 5 章。"
  - term: "coalesced memory access"
    aliases: ["合併存取", "coalescing"]
    definition: "同一個 warp 裡的 thread 存取連續位址時，硬體把它們合併成少數幾次記憶體交易，比各自分散存取快。"
    context: "CMU 11-868 L04 以矩陣轉置示範 coalesced 與 uncoalesced 的差別。"
  - term: "bank conflict"
    aliases: ["記憶體庫衝突"]
    definition: "shared memory 分成 32 個 bank、每個 bank 4 bytes；同一個 warp 的多個 thread 存取同一個 bank 的不同位置時，存取會變成依序進行。"
    context: "L04 用把 shared 陣列多開一欄（+1 padding）的方式消除轉置時的 bank conflict。"
  - term: "compute-to-global-memory-access ratio"
    aliases: ["計算對記憶體存取比", "arithmetic intensity"]
    definition: "每從 GPU global memory 讀寫一個 byte，能做多少個浮點運算（FLOP/B）。比值太低時，kernel 的速度受限於記憶體頻寬，而不是算力。"
    context: "L04 算出最簡單的 matmul kernel 只有 0.25 FLOP/B。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版，材料是 [L02 GPU Programming Basics 1](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf)（1/14，36 頁）、[L03 GPU Programming Basics 2](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-03-gpu-programming2-b82b6ffdf554494747d00ce7ac606c3b.pdf)（1/21，32 頁）、[L04 GPU Acceleration](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-04-gpu-acceleration-48ffa5768ba62c54138f0a71ca2b68b8.pdf)（1/26，47 頁）、[Recitation 1 投影片](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit)，以及範例程式 [`cuda_acceleration_demo`](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo)。頁碼指 PDF 頁碼，事實皆於 2026-09-30 核對。官方課表未列本課公開錄影連結。

**系列位置**：上一篇 [L01 開場：LLM 為什麼需要系統](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems)｜下一篇 [HW1：CUDA Programming](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

這三講是整門課的地基。[總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)提過，先修只要求會 C／C++，但 L02 第二週就進到 CUDA。本篇照五層結構走：先看一個讓人意外的數字，再建直覺，然後拆機制，最後連回 LLM 與作業。

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 場景：寫對的 matmul，只用到 2.48% 的算力

L04 第 6 頁放了一個最直覺的矩陣乘法 kernel：每個 thread 負責輸出矩陣的一個元素，沿著 A 的一列、B 的一行做內積。程式完全正確。

問題在迴圈裡的每一步：讀 `a[row*N+k]` 和 `b[k*N+col]` 兩個 FP32（共 8 bytes），只做一次乘法、一次加法（2 FLOP）。投影片把這個比例叫 compute-to-global-memory-access ratio，算出來是 **0.25 FLOP/B**。

第 7 頁把它代進 A100 80G PCIe 的規格：記憶體頻寬 1,935 GB/s 乘上 0.25，最多只能餵出 483.75 GFLOPS，是 FP32 峰值（19.5 TFLOPS）的 2.48%。投影片的結論只有一行：「Memory-bound program」，速度卡在從記憶體搬資料的速率，不在算力。

這三講要回答的就是：GPU 的算力在哪、資料在哪、怎麼讓兩者靠近。

## 直覺：很多工人，冰箱很遠

先看 GPU 為什麼強。L02 第 21 頁比較 AMD EPYC 9754 與 NVIDIA A6000：CPU 有 256 個 thread，GPU 有 10,752 個；算力從 576 GFLOPS 變成 38.7 TFLOPS，功耗還略低。GPU 是一大群一起做同一件事的工人。

再看資料在哪。L04 第 8 頁畫出每層記憶體的存取延遲：register 約 1 個 cycle，shared memory 與 L1 約 5 個 cycle，global memory 約 500 個 cycle。第 9 頁用向量加法拆成 GPU 指令：兩次 `ld.global` 各 500 cycle，一次 `add.f32` 只要 1 cycle。

想像一個廚房：工人很多、手很快，但食材放在走廊盡頭的冰箱（global memory），每次拿要走 500 步；工作台（shared memory）就在旁邊。如果每個工人切一刀就跑一趟冰箱，人再多也快不起來。加速的核心就是：一次多搬一點到工作台上，大家輪流用。

## 機制一：GPU 伺服器與 SM

**伺服器層級。** L02 第 10–11 頁用講者實驗室的機器當例子：兩顆 EPYC CPU、8 張 A6000 48GB，GPU 之間用 NVLink（112.5 GB/s）或 PCIe Gen4（32 GB/s）溝通。第 12 頁點出為什麼要在乎：資料平行訓練時，梯度要從一張 GPU 搬到另一張。這條線會在分散式訓練那幾講回來。

**GPU 層級。** 第 16 頁的 A6000 有 84 個 SM（Streaming Multiprocessor）、6MB L2 cache。第 15 頁的規格表把 B200、H100、A100 並排，例如 H100 的記憶體頻寬是 3.2TB/s、A100 是 2TB/s。

**SM 層級。** 第 18 頁：每個 SM 分四個 partition，每個 partition 32 個 core，所以一個 SM 有 128 個 core；每個 partition 有 64KB register（最快）；每個 SM 有 128KB 共用 L1。第 19 頁的 H100 把共用 L1 加大到 256KB。

## 機制二：CUDA 的程式模型

**Host 與 device。** 第 23 頁：CPU 是 host，跑一般的 C++；GPU 是 device，跑 CUDA kernel。資料必須在系統記憶體與 GPU 記憶體之間搬來搬去。

**SIMT 與三層組織。** 第 24 頁：CUDA 是 Single Instruction Multiple Threads。thread 組成 thread block，block 組成 grid，一個 kernel 以「一個 grid 的 block 的 thread」執行。L03 第 21 頁補充，一個 block 最多 1,024 個 thread。

**Warp。** L02 第 26 頁：SM 把 block 切成 warp，每個 warp 32 個 thread，是建立、排程與執行的單位；同一個 cycle 執行同一道指令，但每個 thread 有自己的 program counter 與 register，可以分支。第 27 頁說 warp 之間的切換是即時的，SM 上能同時放幾個 warp，取決於要求與可用的記憶體。

**一次 GPU 計算的五步。** L03 第 12 頁：

1. CPU 用 `cudaMalloc` 配置 GPU 記憶體
2. 用 `cudaMemcpy` 把資料從 host 複製到 device
3. 啟動 kernel
4. 用 `cudaMemcpy` 把結果複製回 host
5. 用 `cudaFree` 釋放 GPU 記憶體

**Thread 怎麼知道自己算哪一格。** L03 第 22 頁：編譯器提供 `gridDim`、`blockIdx`、`blockDim`、`threadIdx` 四個內建變數。一維情況下，全域索引是 `blockDim.x * blockIdx.x + threadIdx.x`。第 27 頁留了一個練習：grid 是 2×3×4 個 block、每個 block 2×4×8 個 thread，共 1,536 個 thread——A6000 能同時跑完嗎？

<details>
<summary>L03 的向量加法：完整的 host 端流程</summary>

```cpp
// L03 第 20 頁：kernel
__global__ void VecAddKernel(int* A, int* B, int* C, int n) {
  int i = blockDim.x * blockIdx.x + threadIdx.x;
  if (i < n) {
    C[i] = A[i] + B[i];
  }
}

// L03 第 29 頁：host 端
void VecAddCUDA(int* Acpu, int* Bcpu, int* Ccpu, int n) {
  int *dA, *dB, *dC;
  cudaMalloc(&dA, n * sizeof(int));
  cudaMalloc(&dB, n * sizeof(int));
  cudaMalloc(&dC, n * sizeof(int));
  cudaMemcpy(dA, Acpu, n * sizeof(int), cudaMemcpyHostToDevice);
  cudaMemcpy(dB, Bcpu, n * sizeof(int), cudaMemcpyHostToDevice);
  int threads_per_block = 256;
  int num_blocks = (n + threads_per_block - 1) / threads_per_block;
  VecAddKernel<<<num_blocks, threads_per_block>>>(dA, dB, dC, n);
  cudaMemcpy(Ccpu, dC, n * sizeof(int), cudaMemcpyDeviceToHost);
  cudaFree(dA);
  cudaFree(dB);
  cudaFree(dC);
}
```

`num_blocks` 用無條件進位，是為了 n 不是 256 的倍數時也能蓋到最後幾個元素；kernel 裡的 `if (i < n)` 則擋掉多出來的 thread。L02 第 31 頁給的編譯指令是 `nvcc -o output.so --shared src.cu -Xcompiler -fPIC`，HW1 也是用同樣的方式把 kernel 編成 shared library 給 Python 呼叫。

</details>

L03 第 17–18 頁另外介紹 H100 新增的 Tensor Memory Accelerator（TMA），用 `cuda::memcpy_async` 加 barrier 做非同步搬移。這三講只提到它存在，沒有展開。

## 機制三：記憶體階層

L04 第 11 頁把 CUDA 變數宣告、所在記憶體、可見範圍與生命週期整理成一張表：

| 宣告 | 記憶體 | 誰看得到 | 活多久 |
|---|---|---|---|
| `int var;` | Register | 單一 thread | kernel 執行期間 |
| `int varArr[N];` | Local | 單一 thread | kernel 執行期間 |
| `__device__ __shared__ int SharedVar;` | Shared | 同一個 block | kernel 執行期間 |
| `__device__ int GlobalVar;` | Global | 整個 grid | 整個應用程式 |
| `__device__ __constant__ int constVar;` | Constant | 整個 grid | 整個應用程式 |

L03 第 15 頁用白話說同一件事：每個 thread 有私有 register，每個 block 有用 `__shared__` 宣告、block 內共享的 shared memory，所有 thread 都能存取 global memory，而且它在同一個程式的多次 kernel 啟動之間保留。

## 機制四：tiling

回到開頭的 matmul。L04 第 12–13 頁指出機會：同一個 block 裡的 thread 會用到相同的資料。算 C 的同一列時，每個 thread 都要讀 A 的同一列；各自從 global memory 讀，就重複搬了很多次。

Tiling 的做法（第 14–18 頁）：

1. block 裡每個 thread 各載入一個元素，合力把 A 與 B 的第一塊 tile 放進 shared memory
2. `__syncthreads()` 等所有人載完
3. 每個 thread 用 shared memory 裡的 tile 算部分和，再 `__syncthreads()` 等所有人算完
4. 載入下一塊 tile，重複直到走完整列與整行

每個元素從 global memory 只讀一次，之後在 shared memory 裡被同一個 block 的多個 thread 重複使用，compute-to-global-memory-access 比就上去了。

<details>
<summary>tiled matmul kernel（L04 第 36 頁、cuda_acceleration_demo）</summary>

```cpp
#define TILE_WIDTH 2
__global__ void MatMulTiledKernel(float* d_A, float* d_B, float* d_C, int N) {
  __shared__ float As[TILE_WIDTH][TILE_WIDTH];
  __shared__ float Bs[TILE_WIDTH][TILE_WIDTH];
  // Determine the row and col of the P element to be calculated for the thread
  int row = blockIdx.y * blockDim.y + threadIdx.y;
  int col = blockIdx.x * blockDim.x + threadIdx.x;
  float Cvalue = 0;
  for(int ph = 0; ph < N/TILE_WIDTH; ++ph) {
    As[threadIdx.y][threadIdx.x] = d_A[row * N + ph * TILE_WIDTH + threadIdx.x];
    Bs[threadIdx.y][threadIdx.x] = d_B[(ph * TILE_WIDTH + threadIdx.y) * N + col];
    __syncthreads();
    for(int k = 0; k < TILE_WIDTH; ++k) {
      Cvalue += As[threadIdx.y][k] * Bs[k][threadIdx.x];
    }
    __syncthreads();
  }
  d_C[row * N + col] = Cvalue;
}
```

兩個 `__syncthreads()` 缺一不可：第一個確保 tile 載完才開始算，第二個確保大家算完才覆寫 tile。外層迴圈跑 `N/TILE_WIDTH` 次、也沒有邊界檢查，所以這份示範只在 N 是 `TILE_WIDTH` 的倍數時正確。範例 repo 的 [`matmul_tile_full.cu`](https://github.com/llmsystem/llmsys_code_examples/blob/main/cuda_acceleration_demo/matmul_tile_full.cu) 把 `TILE_WIDTH` 設為 32，並用 CUDA event 計時，比較 naive 與 tiled 兩個版本。

</details>

Tile 不能無限大。L04 第 20–21 頁列出限制：A100 每個 SM 有 192KB shared memory、H100 有 256KB；32×32 的 FP32 tile 一塊是 4KB，A、B 兩塊共 8KB。register 也是有限的，thread 開越多，每個 thread 分到的 register 越少。

## 機制五：coalesced access 與 bank conflict

Tiling 解決「讀幾次」，這一節處理「怎麼讀」。

**Coalesced access。** L04 第 22–24 頁：GPU 每次存取 32 bytes，同一個 warp 裡連續位址的存取會被合併成一次；C 與 CUDA 用 row-major 存多維陣列，所以沿著一列讀可以利用 DRAM 的 burst。如果相鄰 thread 讀的位址相隔很遠，每個 thread 都要各自一次載入。

**矩陣轉置示範。** 第 25–33 頁用轉置說明整個優化過程：

1. **Naive**（第 26–28 頁）：讀 A 是沿著列、coalesced；寫 C 是沿著行、不 coalesced。
2. **用 shared memory**（第 29–30 頁）：block 先把一塊 tile coalesced 地讀進 shared memory，`__syncthreads()` 之後，再換個方向從 shared memory 取值，coalesced 地寫出去。
3. **Bank conflict**（第 31–32 頁）：shared memory 分成 32 個 bank、每個 bank 4 bytes，同一個 bank 的不同位置只能依序存取。沿著行讀 shared 陣列時，一個 warp 的 thread 全擠在同一個 bank。
4. **Padding**（第 33–34 頁）：把 shared 陣列宣告成 `[X][Y+1]`，多開一欄，讓每一列錯開一個 bank，衝突就消失了。

同一份資料，光是改變讀寫方向、在 shared memory 多開一欄，就能讓搬移效率差很多。後面的 LightSeq 與 FlashAttention 都建立在這種「重新安排資料流」的思路上。

**稀疏矩陣與 cuBLAS。** L04 最後兩節比較短。第 38–40 頁介紹 CSR 格式與每個 thread 負責一列的 SpMV kernel；第 42–45 頁介紹 cuBLAS，一個專做 GEMM 等線性代數運算的函式庫，列了 `cublasSdot`、`cublasSgemv`、`cublasSgemm` 的函式簽名，並提醒使用前後要呼叫 `cublasCreate` 與 `cublasDestroy`。

## 連回 LLM 與作業

[L01](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems) 把 LLM 的計算拆成矩陣乘法、reduction、map、記憶體搬移。L02 第 7–8 頁用一個情感分類的小網路（embedding、linear、ReLU、平均、softmax）把這件事具體化：每一層最後都落到這幾種運算子上，而要算得有效率就需要 GPU。

[Assignment 1](https://llmsystem.github.io/llmsystemhomework/assignment_1/) 就是把這幾種運算子寫成 CUDA kernel，接回 MiniTorch：map（15 分）、zip（25 分）、reduce（25 分）、matrix multiply（30 分），再加上整合（5 分）。作業頁把 reduce 的 shared-memory tree reduction 與 matmul 的 shared memory tiling 都標成「Optional」提示——必修的是寫出正確的平行版本，本篇的 tiling 是加分方向。官方時程是 HW1 在 L02 當天（1/14）發、1/28 截止，也就是還沒上 L03、L04 就要開始寫。

Recitation 1 講的是動手前的準備：PSC 的帳號申請、head node 與 GPU node 的差別、互動式與批次 job、檔案傳輸，以及用 VS Code 透過 head node 跳轉連進分配到的 node。投影片列出 PSC 的 GPU 節點以 V100 為主（24 個 8×V100-32GB 節點、9 個 8×V100-16GB 節點），並註明「Recently got H100s」。

**今晚能做的事**：

- 在 Colab 開 GPU runtime，打開 [`CUDA_Accelerate_Examples.ipynb`](https://github.com/llmsystem/llmsys_code_examples/blob/main/cuda_acceleration_demo/CUDA_Accelerate_Examples.ipynb)，先自己填 `matmul_tile.cu` 的空格，再編譯 `matmul_tile_full.cu` 比較 naive 與 tiled 的時間。notebook 預設用 `-arch=sm_75`，對應 Colab 的 T4。
- 跑完看 notebook 最後的解釋：T4 有 6MB L2 cache，矩陣小到約 N≈1,224 以下時整個放得進 L2，naive 版本不會輸太多；N 越大，tiling 的優勢越明顯。
- 沒有 GPU 的話，先做開頭那道算術：把 L04 第 6 頁的 0.25 FLOP/B 代進你手上 GPU 的記憶體頻寬，看最多能用到峰值的幾成。

## 想深入

- [CS336 Lecture 5：GPU 快不是因為每個 thread 快，而是資料少搬幾次](/posts/ai/2026-08-22-cs336-gpu-tpu)：同一套記憶體階層觀念，有錄影，並多了 TPU 的比較。
- [CS336 Lecture 6：寫 Triton kernel 前，先學會 benchmark 與 profile](/posts/ai/2026-08-22-cs336-kernels-triton)：從 CUDA 往上一層，用 Triton 寫 kernel。
- Recitation 1 推薦的練習：Sasha Rush 的 [GPU-Puzzles](https://github.com/srush/GPU-Puzzles)、NVIDIA 的 [cuda-samples](https://github.com/NVIDIA/cuda-samples)，以及把 matmul 一步步優化到接近 cuBLAS 的 [How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog](https://siboehm.com/articles/22/CUDA-MMM)。
- 指定閱讀：*Programming Massively Parallel Processors* 第 4 版，Syllabus 對應 L02 第 2、4 章、L03 第 3 章、L04 第 5、6 章；L04 第 2 頁另外推薦 NVIDIA 的 [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/)。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時回官方課程頁與公開影音來源查證，仍未找到該講公開錄影，狀態維持不變。

## 參考資料

- [CMU 11-868 L02 GPU Programming Basics 1 投影片（Spring 2026）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf)
- [CMU 11-868 L03 GPU Programming Basics 2 投影片（Spring 2026）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-03-gpu-programming2-b82b6ffdf554494747d00ce7ac606c3b.pdf)
- [CMU 11-868 L04 GPU Acceleration 投影片（Spring 2026）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-04-gpu-acceleration-48ffa5768ba62c54138f0a71ca2b68b8.pdf)
- [CMU 11-868 Recitation 1 投影片：PSC、CUDA Demo、HW1](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [llmsys_code_examples：cuda_acceleration_demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo)
- [llmsys_code_examples：simple_cuda_demo notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/simple_cuda_demo/CUDA_Code_Examples.ipynb)
- [CMU 11-868 Assignment 1: CUDA Programming](https://llmsystem.github.io/llmsystemhomework/assignment_1/)
- [NVIDIA CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/)
- [srush/GPU-Puzzles](https://github.com/srush/GPU-Puzzles)
- [NVIDIA/cuda-samples](https://github.com/NVIDIA/cuda-samples)
- [How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog](https://siboehm.com/articles/22/CUDA-MMM)
