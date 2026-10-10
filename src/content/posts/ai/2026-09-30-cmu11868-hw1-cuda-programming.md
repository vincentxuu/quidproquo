---
title: "CMU 11-868 作業一：用 CUDA 寫 MiniTorch 的 map、zip、reduce 與 matmul"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, cuda, gpu, homework]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 3
tldr: "11-868 第一份作業要你在 src/combine.cu 寫四個 CUDA kernel（map 15、zip 25、reduce 25、matmul 30 分），接回 MiniTorch 的 Python 後端，再用 5 分的整合測試收尾。reduce 與 matmul 的 shared-memory 優化標為 Optional。作業頁明寫需要 GPU，評分用的是不公開的私有測資。"
description: "CMU 11-868 LLM Systems（Spring 2026）作業一導讀：Assignment 1 的五個 Problem 與配分、strides 索引、每題的編譯與測試指令、Optional 的 shared-memory 優化、官方時程（1/14 發、1/28 截止）、需要的 GPU 與校外讀者會卡住的地方。不提供解答。"
draft: false
glossary:
  - term: "CUDA kernel"
    aliases: ["kernel", "__global__ 函式"]
    definition: "在 NVIDIA GPU 上由大量 thread 平行執行的函式，用 __global__ 宣告，由 CPU 端以 grid／block 的組態啟動。"
    context: "作業一的四個 Problem 各要你寫一個 kernel：mapKernel、zipKernel、reduceKernel、MatrixMultiplyKernel。"
  - term: "strides"
    aliases: ["stride", "步幅"]
    definition: "描述多維張量在一維記憶體裡怎麼排的一組整數：沿第 k 維前進一格，要在底層陣列跳過 strides[k] 個元素。"
    context: "作業頁用 A[i, j] = Adata[i * strides[0] + j * strides[1]] 說明，四個 kernel 都要靠它算位置。"
  - term: "shared memory"
    aliases: ["共享記憶體", "__shared__"]
    definition: "GPU 上同一個 block 內所有 thread 共用、比全域記憶體快很多的小容量記憶體，常用來暫存會被重複讀取的資料。"
    context: "作業一把 reduce 的 tree-based 歸約與 matmul 的 tiling 列為 Optional 優化，兩者都靠 shared memory。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。作業頁在跨學期共用的 [作業站](https://llmsystem.github.io/llmsystemhomework/assignment_1/)，起始碼在 [llmsys_hw1](https://github.com/llmsystem/llmsys_hw1)，兩者都是 2026-09-30 所見。這個 repo 最後一次 commit 是 2026-01-30，也就是春季截止日後兩天，之後沒有再被 Fall 2026 改動。存取等級 **A3**：題目、起始碼與本機測試都公開；拿不到的是 Canvas 繳交、私有測資與學校提供的 PSC GPU。

**系列位置**：上一篇 [L02–L04 GPU 程式模型與加速](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)｜下一篇 [L05 深度學習框架與自動微分](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

上一篇講 thread、block 與記憶體階層，這一篇把那些觀念變成一份要交的作業。作業一的目標寫在頁面第一段：為張量運算寫高效的 CUDA kernel，再透過 CUDA 後端接回 MiniTorch。

[MiniTorch](https://llmsystem.github.io/llmsystemhomework/) 是整門課七份作業共用的教學框架。作業站說明它源自 Sasha Rush 的教學用框架，本課把它擴充成能跑真正的 CUDA kernel。作業一寫的四個 kernel，後面的作業會一直用下去：作業二的 README 第一步就是把你作業一的 `src/combine.cu` 複製過去。

本文只講題目結構、配分、需要的資源，以及校外讀者會卡在哪。**不提供任何題目的解答。**

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 它在課程裡的位置

官方時程跟導讀順序不同。[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 把 HW1 放在 1/14「GPU Programming Basics 1」當天發，1/28 截止，那天正好是 L05 框架與自動微分那一講。也就是說，修課學生是一邊上 L02–L04 一邊寫這份作業。本系列把它排在三講 GPU 之後，因為 reduce 與 matmul 的 hints 直接用到 L04 的 tiling 與記憶體存取觀念。

1/16 的 Recitation 1 主題是「PSC Guidelines, Simple CUDA Demo」，[投影片](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit?usp=sharing) 公開在 Google Slides。作業頁也要你先看課堂上的 CUDA 範例與 [cuda_acceleration_demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo)，裡面有 `matmul_tile.cu`、`sparse_mv.cu` 等範例檔。

## 你要改的只有兩個檔案

作業頁列出的檔案結構很短：

| 檔案 | 角色 |
|---|---|
| `src/combine.cu` | 四個 CUDA kernel 的實作（Problem 1–4） |
| `minitorch/cuda_kernel_ops.py` | 把 Tensor 後端接到 CUDA kernel，每題各有一段整合 |

要填的位置用 `BEGIN HW1_x` 與 `END HW1_x` 標出來。每改一次 `combine.cu` 都要用 `nvcc` 重新編成 `minitorch/cuda_kernels/combine.so`，作業頁在每題都重複這句提醒，FAQ 第一題也是它：測試明明該過卻沒過，先確認有沒有重新編譯。

## 題目結構與配分

五個 Problem，合計 100 分：

| Problem | 內容 | 配分 | 本機測試 |
|---|---|---|---|
| P1 Map | 逐元素套用一元函式，例如對 `[1, 2, 3]` 套 `f(x) = x²` 得 `[1, 4, 9]` | 15 | `-k "cuda_one_args"` |
| P2 Zip | 兩個張量逐元素套用二元函式；Part A kernel 20、Part B 整合 5 | 25 | `-k "cuda_two_args"` |
| P3 Reduce | 沿指定維度歸約，例如 `[[1,2,3],[4,5,6]]` 沿第 1 維加總得 `[6, 15]`；Part A kernel 20、Part B 整合 5 | 25 | `-k "cuda_reduce"` |
| P4 MatMul | 矩陣乘法；Part A kernel 25、Part B 整合 5 | 30 | `-k "cuda_matmul"` |
| P5 整合測試 | 跑全部 CUDA 測試 | 5 | `-k "cuda"` |

幾個讀題時該知道的設計：

**strides 是四題共同的門檻。** 作業頁花了一整節解釋：一般的 row-major 寫法是 `A[i, j] = Adata[i * cols + j]`，MiniTorch 改用 `A[i, j] = Adata[i * strides[0] + j * strides[1]]`。map 的 hints 最後一條就是「考慮多維張量的 stride 索引」，FAQ 也有一題專門回答 strides 看不懂怎麼辦，建議先用 2D 的小例子練。

**hints 描述的是最基本的平行化方式。** map 與 zip 的 hints 是「每個 thread 處理輸出的一個元素」加上邊界檢查。reduce 的基本版是讓每個 block 各算一個輸出元素，難點在依 `reduce_dim` 與 strides 算出要跨多遠。matmul 的基本版是每個 thread 算輸出矩陣的一格，作業頁附了虛擬碼，並指向 PMPP 第 4.3 節。

**shared-memory 優化是 Optional。** reduce 的「Optimized Reduction」要 block 內的 thread 先把資料載進 shared memory，再做 tree-based 歸約。作業頁提醒你要自己想怎麼把同一套做法套到 ReduceMultiply 與 ReduceMax，以及怎麼在連續陣列上沿特定軸歸約，並附上 NVIDIA 的 [reduction 投影片](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf) 當參考。matmul 的「Shared Memory Tiling」讓每個 block 負責一塊 `[S, S]` 的輸出，對應 PMPP 第 5.4 節。兩段都附了虛擬碼，但配分表沒有為它們另外給分。

**P5 的測資比前四題多。** 作業頁說整合測試的案例更完整，前面各題都過、到這裡才失敗，就回頭檢查實作。

**繳交與評分。** 把整個 `llmsys_hw1` 目錄壓縮上傳 Canvas，程式會自動編譯，再用**私有測資**評分。本機的 pytest 只是讓你自我檢查，通過它不保證拿滿分。

## 需要什麼運算資源

作業頁的 Prerequisites 只有一句話：「You'll need a GPU」。它建議用學校為本課開的 PSC（Pittsburgh Supercomputing Center）帳號，另外附一份登入指南；也可以用 AWS 或其他雲端 GPU，但課程不保證支援。安裝步驟用 `uv` 建 Python 3.12 環境，在 PSC 上要先要一台有 GPU 的計算節點，再載入 `cuda/12.4.0` 模組。

[Logistics 頁](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) 另外寫了兩件事：新手可以用 Google Colab；PSC 是排隊制，不保證工作會在時限內開始跑，要提早送。

## 校外讀者會卡在哪

**PSC 帳號拿不到。** 校外讀者只能用自己的 NVIDIA GPU 或租雲端 GPU，並自己裝好 `nvcc`。沒有 GPU 就無法完成這份作業。

**作業頁與 repo README 的環境說明不一致。** 2026-09-30 查看時，作業站寫的是建議用 PSC、用 `uv`、載入 `cuda/12.4.0`；repo 的 README 卻寫建議用 Google Colab、用 venv 或 anaconda、載入 `cuda/12.6.0`，而且說 PSC「not necessary」。題目與配分兩邊一致，只有環境段落不同。以作業站為準比較保險，因為 [課程首頁](https://llmsystem.github.io/llmsystem2026spring/) 的 Homework 連結指向它。

**教科書要付費。** hints 引用的 PMPP 第四版章節連到 O'Reilly 的 CMU SSO 入口，校外讀者要自己買書或另找管道。

**私有測資與 Canvas 都拿不到。** 你只能靠 repo 裡的 `tests/` 自我檢查。

**遲交與勘誤。** Logistics 頁的規定是整學期 3 天免罰遲交日，之後每天扣 20%。它也鼓勵學生幫作業抓錯：找到作業的錯字或 bug、送 pull request 並被合併，可以拿參與加分。llmsys_hw1 的 commit 紀錄也看得到這件事：截止前幾天密集合併了多個外部貢獻者的 PR，其中包括一筆修正 reduce kernel 參數型別不一致的 commit。自學時遇到怪錯，先翻一下 repo 的 commit 與 PR 紀錄。

## 自學怎麼做

1. 先確認你有一張能用 `nvcc` 編譯的 NVIDIA GPU，照作業頁建好環境，跑通 `import minitorch` 那行檢查。
2. 在紙上用作業頁的 2×4 例子手算 strides，確定你能把任意多維索引轉成一維位置，再動手寫 map。
3. 照 P1 → P4 的順序寫，每題寫完 kernel 就立刻做整合並跑該題的測試。作業頁 FAQ 說這個結構就是為了讓你能立刻測。
4. 基本版全過之後，再決定要不要挑戰 Optional 的 shared-memory 版本，並自己量前後的速度差。

今晚可以做的一件事：clone [llmsys_hw1](https://github.com/llmsystem/llmsys_hw1)，打開 `src/combine.cu`，把四個 `BEGIN HW1_x` 區塊的位置和函式簽名讀過一遍，先不寫任何程式。

## 延伸閱讀

- [Stanford CS336：GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)：從硬體角度解釋為什麼記憶體搬運常常比計算更貴
- [Stanford CS336：Kernel 與 Triton](/posts/ai/2026-08-22-cs336-kernels-triton)：同樣的 kernel 優化思路，改用 Triton 寫

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 11-868 Spring 2026 課程首頁](https://llmsystem.github.io/llmsystem2026spring/)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)（HW1 發放與截止日、Recitation 1）
- [CMU 11-868 Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics)（運算資源、遲交與參與加分規定）
- [Assignment 1: CUDA Programming](https://llmsystem.github.io/llmsystemhomework/assignment_1/)（作業站，2026-09-30 所見）
- [llmsystem/llmsys_hw1](https://github.com/llmsystem/llmsys_hw1)（起始碼與 README）
- [llmsys_code_examples：cuda_acceleration_demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo)
- [Recitation 1 投影片：PSC Guidelines, Simple CUDA Demo](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit?usp=sharing)
- [NVIDIA：Optimizing Parallel Reduction in CUDA](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf)
- [Programming Massively Parallel Processors, 4th Ed.（O'Reilly）](https://learning.oreilly.com/library/view/programming-massively-parallel/9780323984638/)
