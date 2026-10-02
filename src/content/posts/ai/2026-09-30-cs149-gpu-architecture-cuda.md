---
title: "CS149 第 7 講：GPU 架構與 CUDA 程式設計"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, parallelism]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 9
tldr: "CUDA 的 grid、thread block、CUDA thread 是一套程式抽象；GPU 用 SM、warp 與硬體 block 排程器把它實作出來。這一講的核心是分清兩件事：thread block 之間系統可以任意排序，同一個 block 裡的 thread 則保證同時存在，所以 block 能用 shared memory 和 __syncthreads() 合作，也所以一個 SM 能塞幾個 block 由暫存器與 shared memory 的量決定。"
description: "Stanford CS149（Fall 2025）第 7 講導讀：GPU 從圖形管線走到 compute mode 的歷史、CUDA 的執行與記憶體抽象（host/device、grid/block/thread、global/shared/local）、1D 卷積範例、V100 SM 與 warp 的對應、thread block 排程如何受資源限制，以及 block 之間不可互相等待的原因。"
draft: false
glossary:
  - term: "warp"
    definition: "NVIDIA GPU 上一起執行的 32 個 CUDA thread。同一個 warp 的 thread 執行同一條指令時，硬體用 SIMD 單元一次跑完；不走同一條路時就會 divergence。"
    context: "CS149 L7 強調 warp 是實作細節，不在 CUDA 程式模型裡（少數 warp 內建操作除外）。"
  - term: "SIMT"
    aliases: ["single instruction multiple thread"]
    definition: "NVIDIA 對 GPU 執行方式的稱呼：程式寫成純量的 thread，硬體動態偵測一個 warp 內的 thread 是否執行同一條指令，是的話就用 SIMD 方式一起執行。"
    context: "L7 拿它跟 ISPC gang 對照：ISPC 是編譯期產生 SIMD 指令，SIMT 是硬體執行期檢查。"
  - term: "thread block"
    aliases: ["CUDA thread block", "block"]
    definition: "CUDA 程式把 thread 分組的單位。同一個 block 的 thread 一定排在同一個 SM 上、同時存在，可以透過 shared memory 與 __syncthreads() 合作；不同 block 之間系統可以任意順序執行。"
    context: "L7 用 block 的資源需求（thread 數、shared memory）解釋 GPU 的 block 排程器。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en)

> **版本說明**：本文依據 [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版第 7 講（10 月 14 日）[GPU Architecture and CUDA Programming](https://gfxcourses.stanford.edu/cs149/fall25/lecture/gpuarch/) 的投影片（[PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf)，74 頁），2026-09-30 打開核對。Fall 2025 錄影只在 Canvas，官方首頁指向的替代品是 [2023 版第 7 講錄影](https://www.youtube.com/watch?v=qQTDF0CBoxE)；我沒有逐段比對兩版差異，內容以 2025 投影片為準。存取等級 **A3**：投影片完整公開，錄影只有舊版。

**系列位置**：上一篇 [PA2：task graph 排程](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling)｜下一篇 [第 8 講：資料平行思維](/posts/ai/2026-09-30-cs149-data-parallel-thinking)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

前八篇一直待在 CPU 上。這一講換到 GPU，但它其實不是新東西。投影片第二頁就把 [第 2 講](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading) 那張「基本 GPU 架構」圖搬回來：多核心、每個核心裡有 SIMD 執行、每個核心同時交錯執行多個 thread。GPU 就是把這三種平行同時推到很大的規模。

所以這一講要回答的問題很具體：**CUDA 裡的 grid、block、thread 這些抽象，到底怎麼落到 GPU 硬體上？** 把 DNN 映射到 GPU 的部分留到 [第 9 講那一篇](/posts/ai/2026-09-30-cs149-dnn-on-gpus)，這裡只談執行模型。

## 從畫三角形到跑任意程式

投影片先花一段講歷史，理由是 GPU 的設計取捨都來自原本的工作：即時 3D 繪圖。

繪圖的工作可以用一句話講完：對每個三角形，算出它落在螢幕哪裡；對它蓋到的每個像素，算出表面在那一點的顏色。算顏色的那段程式叫 shader。投影片給了一段 GLSL shader，並特別註明語法不重要，重要的是 **shader 是一個純函式，被套用在一串輸入上**。每個像素各自獨立，這就是大量 SIMD、多執行緒核心的由來。

2001 到 2003 年前後，研究者發現這件事很像 90 年代超級電腦的資料平行。於是有了 GPGPU 的小把戲：想對 512×512 的陣列每個元素跑一個函式，就把輸出影像設成 512×512，畫兩個剛好蓋滿畫面的三角形，讓 fragment shader 對每個像素跑一次。Stanford 圖學實驗室的 Brook（2004）把這層包成 stream 程式語言，由編譯器翻成繪圖指令。

轉折點是 2007 年的 NVIDIA Tesla 架構。它第一次提供不經過繪圖管線的「compute mode」介面：應用程式可以在 GPU 記憶體配置 buffer、來回複製資料，交給 GPU 一個 kernel，然後說「用 SPMD 方式跑 N 個實例」。投影片點出一個有趣的地方：這個 `launch(myKernel, N)` 比繪圖用的 `drawPrimitives()` 簡單得多。CUDA 就在同一年推出，設計目標寫得很清楚：**抽象距離要短**，CUDA 的抽象要貼近 GPU 的能力與效能特性。

## CUDA 的抽象：一次開一大批 thread

投影片提醒了一個名詞陷阱：「CUDA thread」跟 pthread 一樣是邏輯上的控制流，但實作完全不同。這一點整講最後才揭曉，先記著。

CUDA 程式分成兩半：

- **host code**：在 CPU 上循序執行的一般 C/C++ 程式。
- **device code**：用 `__global__` 標記的 kernel 函式，在 GPU 上以 SPMD 方式執行。

host 端用 `<<<numBlocks, threadsPerBlock>>>` 語法一次 bulk launch 一整個 grid。投影片的例子是 12×6 的矩陣加法，每個 block 是 4×3 共 12 個 thread，開 6 個 block，總共 72 個 CUDA thread。每個 thread 用 `blockIdx`、`blockDim`、`threadIdx` 算出自己在整個 grid 裡的座標，id 最多可以是三維，方便處理本來就是多維的問題。

有一個跟圖形 shader 不同的地方：CUDA thread 的數量**寫在程式裡**，不是由資料大小決定。資料是 11×5、不是 block 大小的整數倍時，host 端要把 block 數往上取整，kernel 裡再加 `if (i < Nx && j < Ny)` 防止越界。

### 記憶體：分開的位址空間

CUDA 的記憶體模型是**分散式位址空間**。host 記憶體與 device 的 global memory 是兩個不同的空間，要用 `cudaMalloc` 在 device 上配置、用 `cudaMemcpy` 搬資料。host 端拿到的 `deviceA` 指標不能直接解參照，因為它不指向 host 的位址空間。投影片在這裡反問：`cudaMemcpy` 讓你想到什麼？投影片沒有給答案；我的讀法是它很像 [第 6 講](/posts/ai/2026-09-30-cs149-locality-communication) 談過的訊息傳遞模型，資料要明確地從一個位址空間送到另一個。

kernel 看得到三種 device 位址空間：

| 位址空間 | 誰能讀寫 |
|---|---|
| per-thread private | 單一 thread |
| per-block shared memory | 同一個 block 的所有 thread |
| device global memory | 所有 thread |

投影片的說法是：不同位址空間反映程式裡不同範圍的 locality，而這對 GPU 實作的效率影響很大。

### 1D 卷積：shared memory 省下什麼

整講的主範例是 `output[i] = (input[i] + input[i+1] + input[i+2]) / 3`，每個 block 128 個 thread，每個 thread 算一個輸出。

第一版每個 thread 直接從 global memory 讀三個值。第二版先讓 block 裡的所有 thread 合作，把這個 block 需要的 130 個輸入搬進 `__shared__ float support[130]`，呼叫 `__syncthreads()` 等大家都搬完，再從 shared memory 讀。投影片算的帳是：從 global memory 的載入從 3×128 次降到 130 次。

這個例子把 CUDA 的同步工具也帶出來了：

- `__syncthreads()`：block 內的 barrier。
- atomic 操作，例如 `atomicAdd`，global 與 shared memory 都支援。
- kernel 回傳時，所有 thread 之間有一個隱含的 barrier。

## 抽象怎麼落到硬體

投影片接著問了一個很好的問題：N 是 1024×1024 時，這個 kernel 會開超過一百萬個 CUDA thread、八千多個 block。系統真的會為每個 thread 配置一份 stack、為每個 block 配置一份 shared 變數嗎？

pthread 的做法是每建一個 thread 就配置 stack 與 OS 排程用的控制區塊。GPU 不是這樣做的。

### 編譯後的 kernel 帶著資源需求

編譯好的 CUDA device binary 除了指令，還記錄了這個 kernel 的資源需求。以卷積範例來說：每個 block 128 個 thread、每個 thread 需要多少 local 資料、每個 block 需要 130 個 float（520 bytes）的 shared memory。

另一個觀察是：CUDA 程式裡從來沒有「核心數」這個概念。投影片說 CUDA 的 launch 精神上接近資料平行模型裡的 forall 迴圈，同一支程式要能不修改就跑在 6 核心的中階 GPU 與 16 核心的高階 GPU 上。

所以 GPU 上有一個專門的硬體 block 排程器，用**動態排程**把 block 分派到核心，同時遵守每個 block 的資源需求。這是課程裡反覆出現的設計模式：一池 worker，加上一堆 task。投影片舉的同類例子是 ISPC 的 task 實作（每個 hyper-thread 開一個 pthread，活到程式結束），以及 web server 的 thread pool。這也就是你剛在 [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling) 自己寫過的東西。

這套排程成立的前提是 CUDA 的一個重大假設：**thread block 可以用任意順序執行，block 之間沒有相依。**

### V100 的 SM、warp 與 SIMT

投影片用 NVIDIA V100 當具體例子。一個 SM（streaming multiprocessor）分成 4 個 sub-core，每個 sub-core 有自己的 warp selector 與 fetch/decode。執行單元方面，每個 sub-core 有 16 個 fp32 SIMD 單元、16 個 int 單元、8 個 fp64 單元、tensor core 與 load/store 單元。

**warp** 是這裡的關鍵字：一個 block 裡編號 0–31 的 thread 是同一個 warp，32–63 是下一個，以此類推。256 個 thread 的 block 就是 8 個 warp。每個 sub-core 最多可以排程並交錯執行 16 個 warp。

warp 裡的 thread 在執行同一條指令時，以 SIMD 方式一起跑，NVIDIA 稱之為 **SIMT**。32 個 thread 走不同路時，效能會因 divergence 下降。這跟 [ISPC 的 gang](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc) 很像，但有一個差別投影片特別加了註腳：GPU 硬體在執行期**動態檢查** 32 個獨立 thread 是否執行同一條指令；CUDA 程式不像 ISPC gang 那樣被編譯成 SIMD 指令。

還有一個細節：sub-core 只有 16 個 fp32 單元，一個 warp 有 32 個 thread，所以一條 fp32 指令要兩個 clock 才跑完整個 warp。

整個 SM 的規格：

- 每個 sub-core 64 KB 暫存器，整個 SM 256 KB，分給最多 64 個 warp。
- shared memory 與 L1 cache 共用 128 KB。
- 每個 clock，每個 sub-core 從自己的 16 個 warp 裡挑一個可執行的，跑它的下一條指令。

整顆 V100 的算術：

| 項目 | 數字 |
|---|---|
| 時脈 | 1.245 GHz |
| SM 數 | 80 |
| fp32 mul-add ALU | 80 × 4 × 16 = 5,120 |
| 峰值 | 12.7 TFLOPs（mul-add 算 2 flops） |
| 最多交錯的 warp | 80 × 64 = 5,120（163,840 個 CUDA thread） |
| L2 cache | 6 MB |
| HBM | 16 GB，900 GB/s |

回到卷積 kernel：一個 128 thread 的 block 由 4 個 warp 執行，而且同一個 block 的 warp 全部排在同一個 SM 上，才能透過 shared memory 做高頻寬、低延遲的溝通。

### 資源決定一個 SM 放得下幾個 block

投影片用一個虛構的雙核心 GPU 一步步演示排程。每個核心能放 384 個 thread 的執行環境（12 個 warp）與 1.5 KB 的 shared memory；kernel 要跑 1,000 個 block，每個 block 要 128 個 thread 與 520 bytes shared memory。

排程器把 block 0 放到核心 0、block 1 放到核心 1、block 2 回到核心 0……到第三個 block 要進同一個核心時放不下了。執行環境其實還夠（384 個 thread 放得下三個 128 thread 的 block），卡住的是 shared memory：3 × 520 bytes 超過 1.5 KB。之後每當一個 block 完成、釋放資源，排程器就把下一個 block 補進去。

這個演示讓一個常被當成咒語的概念變得具體：**一個 SM 同時能跑幾個 block，由最緊的那項資源決定**。每個 thread 用多少暫存器、每個 block 要多少 shared memory，都直接影響能交錯多少 warp，也就影響能藏住多少記憶體延遲（第 2 講的 multithreading 論點）。

## 兩種語意，別混在一起

投影片最後一段是這講真正的考點。它說：看懂接下來幾個例子，就是真的懂 CUDA 程式怎麼在 GPU 上跑，也掌握了課程到目前為止的工作排程議題。

**為什麼 block 裡所有 thread 的執行環境必須一次配置？** 假設 block 有 256 個 thread，但核心只放得下 128 個。為什麼不先跑完 0–127，再跑 128–255？因為 block 內的 thread 可以互相相依，最簡單的例子就是 `__syncthreads()`：前 128 個 thread 會停在 barrier 等後 128 個，而後 128 個永遠不會開始。CUDA 的語意因此是：**同一個 block 的 thread 真的同時存在；只要一個 thread 可以執行，它最後就一定會被執行。**

**block 之間可以用 atomic 嗎？** 可以。投影片的直方圖例子讓所有 thread 對 global memory 裡的 `counts[10]` 做 `atomicAdd`。投影片強調它從來沒說 block 一定互相獨立，只說 CUDA 保留用任意順序排程 block 的權利。這裡的 atomic 只做互斥，不影響排程自由，所以是合法的。

**那 block 0 等 block 1 設旗標呢？** 假設 GPU 一次只放得下一個 block，而 block 1 在 `while (atomicAdd(&myFlag, 0) == 0)` 等 block 0 設旗標。如果系統先跑 block 1，它會永遠佔著核心，block 0 永遠排不進去。這就是「任意順序」的代價：block 之間不能有這種等待相依。

投影片另外給了一張 bonus 投影片：**persistent thread** 寫法。程式設計者算好 GPU 同時放得下幾個 block（V100 上是 `80 * (32*64/128)`），就只開這麼多，每個 block 用迴圈從 global 計數器搶工作，等於繞過硬體的 block 排程器、自己做工作分配。代價是程式對 GPU 實作做了假設。投影片的評語只有一個字：「Ugg!」

整理成一張表：

| 層級 | 語意 | 能做的合作 |
|---|---|---|
| grid 裡的 block 之間 | 邏輯上並行、系統可任意排序（很像 ISPC task） | atomic 互斥可以；互相等待不行 |
| block 裡的 thread 之間 | 真的同時存在，是 SPMD 的共享位址空間程式（很像 ISPC gang） | shared memory、`__syncthreads()`、atomic |
| warp | 實作細節，不在程式模型裡 | 效能上決定 SIMD 利用率 |

投影片的結語是：兩種執行模型的差別很細微，但一定要懂；以後遇到任何平行程式系統，都該問自己它用的是哪種語意。

## 這講刻意沒講的

- 繪圖管線本身的硬體實作，投影片說那是 CS248A 或 CS348K 的題目；跑 CUDA 時那些固定功能單元大多是關著的。
- SM 裡 tensor core 的上百 TFLOPS，投影片說留到學期後面。本系列對應的是 [第 9 講 DNN on GPUs](/posts/ai/2026-09-30-cs149-dnn-on-gpus) 與第 10 講硬體專用化。

## 自學怎麼做

1. 先讀 [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf) 裡「The plan」那頁列的四個問題：CUDA 是資料平行模型嗎？是共享位址空間還是訊息傳遞？能跟 ISPC instance、task 與 pthread 類比嗎？讀完整講再回來回答。
2. 把雙核心 GPU 的排程演示改個參數自己推一次：如果 block 要 256 個 thread、shared memory 只要 100 bytes，每個核心放得下幾個 block？這次卡住的是哪一項資源？
3. 想動手，接著做 [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer)，它的第一題就是把 PA1 的 SAXPY 改寫成 CUDA。

今晚可以做的一件事：把最後那個 `myFlag` 例子抄下來，寫一句話解釋「先跑 block 1」為什麼會卡死，再寫一句話說明直方圖例子為什麼不會。

## 延伸閱讀

- 同一套 GPU 執行模型從 LLM 訓練角度的講法：[CS336 Lecture 5：GPU 快不是因為每個 thread 快，而是資料少搬幾次](/posts/ai/2026-08-22-cs336-gpu-tpu)
- 另一門課對 thread、block、記憶體階層與 tiling 的整理：[CMU 11-868 L02–L04 GPU 程式模型與加速](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)
- 課程定位、五個作業的環境需求與 2023 錄影對照：[Stanford CS149 導讀（系列總覽）](/posts/ai/2026-09-30-cs149-course-overview)

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25) — 講次日期、錄影政策
- [Lecture 7: GPU Architecture and CUDA Programming（逐頁網頁版）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/gpuarch/) — 本文全部內容的來源
- [Lecture 7 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf) — 74 頁，含 V100 規格與排程演示
- [Stanford CS149 2023 Lecture 7 錄影](https://www.youtube.com/watch?v=qQTDF0CBoxE) — 官方首頁指向的舊版替代錄影
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp) — 全部 19 支 2023 錄影
- [NVIDIA CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/) — PA3 README 推薦的 CUDA 參考手冊
