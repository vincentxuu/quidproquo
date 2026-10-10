---
title: "MIT 6.5940 L11 TinyEngine 與平行運算：從 loop tiling 到 in-place depthwise"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, parallelism, performance, cuda]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 13
tldr: "演算法把模型縮小之後，系統層還能再榨多少？L11 用同一個矩陣乘法示範：loop reordering 快 12 倍、tiling 快 19 倍（Intel Xeon 4114），CUDA 版在 2080Ti 上端到端快 94 倍。後半講 TinyEngine 用的推論技巧：im2col、in-place depthwise 把峰值記憶體從 2×C×H×W 降到 (1+C)×H×W、pointwise 用 NHWC、depthwise 用 NCHW，以及少 2.25 倍乘法的 Winograd。"
description: "MIT 6.5940 Fall 2024 第 11 講 TinyEngine and Parallel Processing 導讀：MCU 與筆電的資源差距、記憶體階層，loop reordering／tiling／unrolling、SIMD（SSE、NEON）、multithreading（Pthreads、OpenMP）、CUDA 與 Tensor Core，以及 im2col、in-place depthwise convolution、NHWC／NCHW 排版選擇與 Winograd convolution，並連到 Lab 4／5 的 LLM 部署。"
draft: false
glossary:
  - term: "loop tiling"
    aliases: ["迴圈分塊", "blocking"]
    definition: "把迴圈的迭代空間切成固定大小的塊，讓一塊內會重複用到的資料剛好放進 cache，用完才換下一塊，以減少 cache miss。L11 以矩陣乘法示範，tile 大小依 cache 大小決定，還可以對 L1、L2 做多層 tiling。"
    context: "MIT 6.5940 L11 投影片第 14–20 頁。"
  - term: "im2col"
    aliases: ["image to column"]
    definition: "把卷積的輸入重新排成矩陣，讓卷積可以直接呼叫通用矩陣乘法（GEMM）。優點是能用上高度最佳化的 GEMM，缺點是要額外記憶體；implicit GEMM 可以避開這個額外空間。"
    context: "MIT 6.5940 L11 投影片第 55–57 頁。"
  - term: "in-place depthwise convolution"
    aliases: ["原地 depthwise 卷積"]
    definition: "TinyEngine 的做法：depthwise 卷積逐通道計算，只用一個通道大小的暫存 buffer，算完就寫回輸入的位置，峰值記憶體從 2×C×H×W 降到 (1+C)×H×W。"
    context: "MIT 6.5940 L11 投影片第 59–64 頁。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940) 第 11 講（2024-10-10），主要材料是 [Lec11-TinyEngine.pdf](https://www.dropbox.com/scl/fi/z1980bzepegz85ara200n/Lec11-TinyEngine.pdf?rlkey=5evtfesbourbo03nlhazmiy1r&st=ehihqr5t&dl=0)（79 頁）與 [課堂錄影](https://youtu.be/wl1UEnIOVek)。文中頁碼指 PDF 頁。事實於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片、錄影、投影片引用的範例程式碼 repo 都公開；拿不到的是 Canvas 繳交與評分回饋。
>
> **Fall 2026 對照**：[F26 課表](https://hanlab.mit.edu/courses/2026-fall-65940)把同名講次排在 10 月 20 日，截至 2026-09-30 投影片與錄影仍是空連結。

**系列位置**：上一篇 [L10 MCUNet 與 tinyML](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml)｜下一篇 [L12 Transformer 與 LLM（橋接）](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

[L10](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml) 說 MCUNet 是 TinyNAS 加 TinyEngine 的協同設計，但只講了 TinyNAS。L11 補上另一半：模型定了之後，系統層要怎麼讓它跑得快、吃得少。

這講的程式碼比前面多，但骨架很單純。前半段用**同一個矩陣乘法**，依序套上 loop 優化、SIMD、multithreading、CUDA，每一步都報加速倍數；後半段換成卷積，講四個 TinyEngine 會用到的推論技巧。第 2 頁的 Lecture Plan 就是這三段：Edge AI 與 MCU 的特性、平行運算技巧、推論最佳化。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=wl1UEnIOVek
title: EfficientML.ai Lecture 11 - TinyEngine (MIT 6.5940, Fall 2024)
```

原始影片：[EfficientML.ai Lecture 11 - TinyEngine (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=wl1UEnIOVek)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

## MCU 到底小在哪

第 5 頁把四種平台排成一張表。兩端對比最能說明問題：

| | NVIDIA H100 | STM32F746NG |
|---|---|---|
| Memory | 80GB | 320kB |
| Storage | ~TB/PB | 1MB |
| 算力 | 1,979 TOPS | 462 MOPS |

第 6 頁拿 STM32F746 和 Apple M1 Ultra 的 MacBook Pro 比：時脈 216MHz 對 3200MHz；MCU 只有 8KB 的 L1 cache，沒有 L2、L3，也沒有作業系統；記憶體差 210,000 倍，儲存差 8,400,000 倍。

第 7 頁是記憶體階層：越往下越大、越慢、越便宜。投影片引用〈Latency Numbers Every Programmer Should Know〉，L1 約 0.5ns，DRAM 約 100ns，儲存約 1ms。後面所有 loop 優化的目的，都是讓資料盡量待在上層。

## 平行運算技巧：同一個 matmul 的六種寫法

第 9 頁列出四大類：loop 優化（reordering、tiling、unrolling）、SIMD、multithreading、CUDA。範例程式碼放在 [mit-han-lab/parallel-computing-tutorial](https://github.com/mit-han-lab/parallel-computing-tutorial)。除了 CUDA，加速倍數都是在 Intel Xeon 4114 上量的。

### Loop reordering：12 倍

第 10–12 頁。三層迴圈 `i, j, k` 裡，最內層 `k` 變動時，`B[k][j]` 是一欄一欄往下跳。矩陣以 row-major 存，跳著讀就一直 cache miss。

```python
# 改前：i, j, k —— B[k][j] 沿著欄讀，局部性差
for i in range(N):
    for j in range(N):
        for k in range(N):
            C[i][j] += A[i][k] * B[k][j]

# 改後：i, k, j —— 最內層 j 讓 B[k][j] 沿著列讀
for i in range(N):
    for k in range(N):
        for j in range(N):
            C[i][j] += A[i][k] * B[k][j]
```

只是換迴圈順序，第 12 頁報告快了 12 倍。

### Loop tiling：19 倍

第 14–20 頁處理下一個問題：B 比 cache 大很多時，資料還沒被重用就被趕出去。做法是把迭代空間切成 `TILE_SIZE` 的塊，讓一塊內用到的資料放得進 cache。依序切 `j`、`k`、`i` 之後，A、B、C 每次存取的元素都從 N² 降到 TILE_SIZE²。第 19 頁再往上一層，對 L1、L2 做多層 tiling。第 20 頁用 `BLK_SIZE 32` 的 C 實作，快了 19 倍。

### Loop unrolling：2.85 倍

第 22–24 頁。迴圈本身有成本：指標運算、每圈的結束條件判斷、分支預測。把迴圈本體複製 4 份、步長從 1 改成 4，指標運算與迴圈判斷都降成原來的 1/4，代價是最內層程式碼變成 4 倍大。投影片明講這是 binary 大小與額外開銷的取捨，在 Flash 只有 1MB 的 MCU 上這個取捨是真的。第 24 頁把 `j` 展開 8、`k` 展開 4，快 2.85 倍。

### SIMD：一條指令算四個數

第 26–27 頁先補指令集背景：CISC（x86）有很多專用指令；RISC（Arm、RISC-V）只實作常用指令。同一個 `C = A + B`，CISC 可能一條指令做完，RISC 可能要 load、load、add、store 四條。

第 28–30 頁的 SIMD 用 128-bit 向量暫存器一次處理四個 32-bit 浮點數，算術指令數從 N³ 降到 N³/4。投影片並列兩套 intrinsics：x86 的 SSE（`_mm_load_ps`、`_mm_mul_ps`、`_mm_add_ps`）和 Arm 的 NEON（`vld1q_f32`、`vmulq_f32`、`vaddq_f32`），還拆解了命名：`ps` 是 packed single-precision，`q` 是 quadword。第 30 頁的實作先把 B 轉置，讓兩邊都能連續讀。這一頁沒有報加速倍數。

### Multithreading：4.1 倍

第 32–37 頁。同一個 process 裡的多個 thread 共享記憶體，但各有自己的 stack 與 program counter，可以分到不同核心上跑。第 35 頁用 Pthreads 把矩陣的列平均分給 4 個 thread，快 4.1 倍。第 36–37 頁改用 OpenMP，只要在迴圈前加一行 `#pragma omp parallel for`，投影片的評語是比 Pthreads 乾淨得多。

### CUDA 與 Tensor Core：94 倍

第 39–44 頁的 CUDA 介紹借用了 [Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview) 的材料：thread 組成 block、block 組成 grid，每個 thread 用 `blockIdx` 與 `threadIdx` 算出自己負責的位置；host 與 device 的位址空間分開，要用 `cudaMemcpy` 搬資料；kernel 看得到 per-thread private、per-block shared、global 三種記憶體，局部性與存取成本各不同。第 44 頁的實作把 A、B 的 tile 先搬進 shared memory，在 2080Ti 上比 CPU naive 版**端到端快 94 倍**。

第 45–52 頁再往下一層看 Tensor Core：CUDA core 每個 cycle 做 1 個 FP32 或 2 個 FP16 MAC；Tensor Core 每個 cycle 做完一整個小矩陣乘法（Turing 是 4×4×4，Ampere 是 8×4×8）。第 46 頁在 A6000 上量到，N 夠大時 Tensor Core 比 CUDA core 快 3.8 倍。第 47–52 頁示範怎麼用 16×8×16 的 MMA intrinsic 拼出 16×16×32 的乘法。

## 推論最佳化：TinyEngine 用的四招

第 54 頁把後半段的四個技巧列在一起。前兩個跟記憶體有關，後兩個跟速度有關。

### Im2col：把卷積變成矩陣乘

第 55–57 頁。把輸入 activation 重新排成矩陣，卷積就能直接呼叫通用矩陣乘法（GEMM）。好處是前半段所有 matmul 優化都能用上；壞處是要額外記憶體。投影片提到 implicit GEMM 可以解掉這個問題：它是 direct convolution 的變體，直接在原本的權重與 activation 張量上操作。

### In-place depthwise：峰值從 2×C×H×W 到 (1+C)×H×W

第 59 頁先講動機。MobileNetV2 的 inverted residual block 用 depthwise 卷積省模型大小與 FLOPs，但中間層要展開成 6 倍通道，峰值記憶體因此大 3–6 倍。這正是 L10 說 MobileNetV2「省參數不省 activation」的原因。

第 60–64 頁的解法：一般 depthwise 卷積要同時放輸入與輸出，峰值是 2×C×H×W。Depthwise 卷積各通道彼此獨立，所以可以逐通道算，只用一個通道大小（H×W）的暫存 buffer，算完寫回輸入原本的位置。峰值變成 (1+C)×H×W。

### NHWC 給 pointwise，NCHW 給 depthwise

第 66–69 頁看記憶體排版。Pointwise（1×1）卷積在每個像素位置沿著通道做加權和，所以 NHWC（通道擺在最內層）讀起來是連續的，TinyEngine 對 pointwise 用 NHWC。Depthwise 卷積在每個通道內沿著空間滑動，而且前一段的 in-place 做法本來就是逐通道存取，所以用 NCHW 比較連續。

同一個網路裡兩種卷積交錯出現，排版跟著運算類型選。這是通用框架常忽略、專用推論引擎能榨出來的地方。

### Winograd：乘法少 2.25 倍

第 71–76 頁。3×3 卷積要算 2×2 共 4 個輸出，直接做需要 9×C×4 個 MAC。Winograd 先把輸入塊與濾波器轉換到另一個空間，逐元素相乘後再轉回來，只需要 16×C 個 MAC，少了 2.25 倍。濾波器的轉換可以離線先算好，輸入與輸出的轉換在推論時做。完整公式 Y = Aᵀ[(GgGᵀ) ⊙ (BᵀdB)] 出自 [Lavin & Gray 2015](https://arxiv.org/abs/1509.09308)。

<details>
<summary>為什麼是 16 而不是 36？</summary>

2×2 輸出配 3×3 濾波器，需要的輸入塊是 4×4。轉換後在 4×4 的空間裡逐元素相乘，每個輸入通道 16 次乘法，再沿著通道加總。直接卷積則是每個輸出 9 次乘法、4 個輸出共 36 次。36 / 16 = 2.25。
</details>

## 接到 Lab 4／5

第 77 頁推薦 [TinyEngine](https://github.com/mit-han-lab/tinyengine) 與 [TinyChatEngine](https://github.com/mit-han-lab/TinyChatEngine) 兩個 repo，第 78 頁預告 Lab 4／5：用 AWQ 把 LLM 量化到 4-bit，部署成本機聊天機器人，自己實作 loop unrolling／reordering、SIMD、multithreading，再量測每種技巧帶來的延遲改善。投影片這頁把引擎寫成「TinyLLMEngine」，F24 Lab 5 文件與 starter repo 用的名稱是 TinyChatEngine。細節見 [Lab 4＋Lab 5 導讀](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop)。

也就是說，這講教的 CPU 技巧，後面會原封不動拿去加速 LLaMA2-7B 的 linear kernel。

## 讀完這講可以做什麼

- **今晚能做的事**：clone [parallel-computing-tutorial](https://github.com/mit-han-lab/parallel-computing-tutorial)，在自己的機器上跑 naive 與 reordering 兩個版本，看加速倍數跟投影片的 12 倍差多少。差距本身就說明了 cache 大小與記憶體頻寬的影響。
- 想看 GPU 那一側更完整的推導：[CS149 L2：多核、SIMD、硬體多執行緒](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading)、[CS149 第 7 講：GPU 架構與 CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda)。
- 卷積改寫成矩陣乘、tiling 一路推到 FlashAttention：[CS149 L9：在 GPU 上高效跑 DNN](/posts/ai/2026-09-30-cs149-dnn-on-gpus)。

## 延伸閱讀

- 局部性與 arithmetic intensity：[CS149 L6 Locality 與通訊](/posts/ai/2026-09-30-cs149-locality-communication)
- GPU 與 Triton kernel：[CS336 Lecture 5：GPU](/posts/ai/2026-08-22-cs336-gpu-tpu)、[CS336 Lecture 6：Triton kernel](/posts/ai/2026-08-22-cs336-kernels-triton)
- CUDA 作業實戰：[CMU 11-868 HW1：CUDA 程式設計](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — L11 日期、投影片與錄影連結
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — L11 排在 10 月 20 日，材料未放出
- [Lec11-TinyEngine.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/z1980bzepegz85ara200n/Lec11-TinyEngine.pdf?rlkey=5evtfesbourbo03nlhazmiy1r&st=ehihqr5t&dl=0) — 本文所有頁碼、加速倍數與公式的出處
- [EfficientML.ai Lecture 11 - TinyEngine（YouTube）](https://youtu.be/wl1UEnIOVek)
- [mit-han-lab/parallel-computing-tutorial（GitHub）](https://github.com/mit-han-lab/parallel-computing-tutorial) — 投影片引用的 loop 優化、SIMD、multithreading、CUDA 範例
- [mit-han-lab/tinyengine（GitHub）](https://github.com/mit-han-lab/tinyengine)
- [mit-han-lab/TinyChatEngine（GitHub）](https://github.com/mit-han-lab/TinyChatEngine)
- [Lavin & Gray, Fast Algorithms for Convolutional Neural Networks（2015）](https://arxiv.org/abs/1509.09308) — Winograd 卷積
- [Lin et al., MCUNet: Tiny Deep Learning on IoT Devices（NeurIPS 2020）](https://arxiv.org/abs/2007.10319) — TinyEngine 出處
- [Latency Numbers Every Programmer Should Know](https://gist.github.com/jboner/2841832) — 第 7 頁記憶體階層延遲的引用來源
