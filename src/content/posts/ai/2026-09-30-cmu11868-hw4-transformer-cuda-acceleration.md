---
title: "CMU 11-868 HW4：把 Softmax 與 LayerNorm 寫成 CUDA 融合 kernel"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, homework, cuda, gpu, transformer]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 10
tldr: "11-868 第四份作業要你照 LightSeq 的做法，親手寫 attention softmax 與 LayerNorm 的 CUDA kernel（前向、反向各一），接回自己的 MiniTorch，再換進 HW3 的 Transformer 訓練一個 epoch。配分是 Softmax 40、LayerNorm 40、整合 20。作業頁預期單一 kernel 快 3.7 到 15.8 倍，整個訓練卻只快約 1.1 倍，原因是 Amdahl 定律。需要一張 NVIDIA GPU；repo 在 2026 秋季已被改過。"
description: "CMU 11-868 LLM Systems（2026 春季版）Assignment 4 導讀：三個 Problem 的內容與配分、要改哪些檔案、kernel 測試的比較基準、為什麼整體只快 1.1 倍、需要的硬體，以及 llmsys_hw4 repo 被 Fall 2026 修改後怎麼對齊春季版。不提供解答。"
draft: false
glossary:
  - term: "Amdahl 定律"
    aliases: ["Amdahl's law", "阿姆達爾定律"]
    definition: "整體加速的上限由「沒被加速的那部分」決定：就算某段程式快了無限倍，只要它原本只佔總時間的一小部分，整體也快不了多少。"
    context: "HW4 作業頁用它解釋：softmax 和 LayerNorm 各自快好幾倍，整個 Transformer 訓練卻只預期快約 1.1 倍。"
  - term: "warp shuffle"
    aliases: ["shfl_down", "__shfl_down_sync", "g.shfl_down"]
    definition: "CUDA 讓同一個 warp（32 個 thread）裡的 thread 直接讀彼此暫存器的指令，做 reduction 時可以不經過 shared memory。"
    context: "HW4 的 softmax 反向與 LayerNorm 的 gamma／beta 梯度 kernel 都用到它。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。作業頁與起始碼是**跨學期共用**的，本文內容依 2026-09-30 所見的 [Assignment 4 作業頁](https://llmsystem.github.io/llmsystemhomework/assignment_4/)與 [llmsys_hw4 repo](https://github.com/llmsystem/llmsys_hw4)。存取等級 **A3**：題目、起始碼、kernel 測試全部公開；拿不到的是 Canvas 繳交與評分、Ed 論壇，以及講課錄影（官方課表未列本課公開錄影連結）。

**系列位置**：上一篇 [L10 在 GPU 上加速 Transformer：LightSeq](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq)｜下一篇 [L14–L15 分散式訓練與資料平行](/posts/ai/2026-09-30-cmu11868-data-parallel-training)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

上一篇講完 LightSeq 怎麼把 Transformer 裡的小運算融合、怎麼改寫 reduction 少一次同步。這份作業把其中兩個 kernel 交給你：attention 裡的 **softmax** 和 **LayerNorm**，前向與反向都要寫。作業頁開頭就說，這些 CUDA 優化來自 [LightSeq](https://arxiv.org/abs/2010.13887) 與 [LightSeq2](https://arxiv.org/abs/2110.05722) 兩篇論文，並「強烈建議」動手前先讀論文和投影片。

本文只講題目結構、配分、依賴、硬體需求與自學時會卡住的地方。**不提供解答，也不貼參考實作。**

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 它在課程裡的位置

2026 春季的 [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 把 HW4 截止日排在 **3 月 11 日**，也就是 Distributed Model Training II 那一堂。Syllabus 沒有標 HW4 的發放日；前一份 HW3 在 2 月 18 日截止，那天正是 LightSeq Part 2 的課。中間隔著 Google 客座講 TPU 的兩堂和一週春假。

它依賴的東西比名字看起來多：

| 依賴 | 為什麼需要 |
|---|---|
| [L10 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf) 第 21–26 頁 | LayerNorm 與 Softmax 的公式改寫、依形狀調參的 template 寫法。投影片寫著「You will implement … in hw3」，是舊學期編號，指的就是這份 |
| [HW1](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming) 的 reduce kernel | 作業頁在 LayerNorm 反向那節直接回扣：你在 HW1 用 shared memory 寫過 reduce，這次改用 warp shuffle |
| [HW3](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture) 的整套實作 | 起始碼要你把 HW3 的 `combine.cu`、`autodiff.py` 與你改過的 `nn.py`、`modules_basic.py`、`modules_transfomer.py` 複製過來 |

作業頁第一句說它延伸 Assignment 1 和 2 的成果，但設定步驟實際上是從 Assignment 3 複製檔案。HW3 沒寫完，這份就接不上。

## 題目結構與配分

三個 Problem，合計 100 分：

| Problem | 內容 | 配分 | 預期加速 |
|---|---|---|---|
| 1.1 Softmax Forward | 在 `src/softmax_kernel.cu` 實作 `ker_attn_softmax`（處理 attention mask） | 20 | 約 6.5 倍 |
| 1.2 Softmax Backward | 實作 `launch_attn_softmax_bw`，依最大序列長度選 template 參數 | 20 | 約 5.5 倍 |
| 2.1 LayerNorm Forward | 在 `src/layernorm_kernel.cu` 實作 `ker_layer_norm` | 20 | 約 15.8 倍 |
| 2.2 LayerNorm Backward | 實作 `ker_ln_bw_dinp` 與 `ker_ln_bw_dgamma_dbetta` | 20 | 約 3.7 倍 |
| 3 Adopt Fused Kernels | 把融合 kernel 換進 `MultiHeadAttention`、`TransformerLayer`、`DecoderLM`，比較訓練一個 epoch 的時間 | 20 | 約 1.1 倍 |

每個 kernel 的工作流程都一樣：寫 CUDA、用 `nvcc` 編成 `.so`、在 `minitorch/cuda_kernel_ops.py` 綁定（要傳入 CUDA stream）、在 `minitorch/tensor_functions.py` 的 `Function` 裡接上 `forward` 或 `backward`，最後跑 `kernel_tests/` 底下對應的測試。

幾個讀題時值得先知道的設計：

**Softmax 前向有一半已經寫好。** 作業頁說 `ker_attn_softmax_lt32`（序列長度小於 32，用 warp 層級 reduction）已經實作，要你照著它寫出處理長序列的 `ker_attn_softmax`（用 CUB 的 block 層級 reduction）。兩者算最大值的方式相同，作業頁把步驟拆得很細：每個 thread 先算局部最大值、未來 token 的遮罩設成負無限大、加上 attention mask，再做 block 層級的全域最大值。

**Softmax 反向要你親手做 L10 講的 template 調參。** 作業頁要求依最大序列長度 {32, 64, 128, 256, 384, 512, 768, 1024, 2048} 決定 `ker_attn_softmax_bw` 的 `ITERATIONS` 參數，提示是去參考 `launch_attn_softmax` 怎麼用 template。它也說你可以試別的長度組合拿到更高加速，但不計分。

**LayerNorm 前向就是 L10 第 21 頁的改寫。** 作業頁寫出 σ(x) = √(μ(x²) − μ(x)² + ε)，ε 取 1×10⁻⁸，讓 x 和 x² 的平均能同時算。實作上要用 `reinterpret_cast` 把陣列轉成 `float4`，一次處理四個元素。

**LayerNorm 反向拆成兩個 kernel。** 輸入梯度那個照 L10 第 22 頁，把兩個加總並行算；gamma 與 beta 的梯度要跨列加總，作業頁建議用 shared memory 暫存、再用 cooperative groups 的 `g.shfl_down` 沿 `threadIdx.y` 做 reduction，並附上 [NVIDIA 部落格](https://developer.nvidia.com/blog/cooperative-groups/)的說明連結。

## 那些「快幾倍」是跟誰比

讀 `kernel_tests/test_softmax_fw.py` 會發現，測試的 baseline 不是 PyTorch，而是**你自己在 MiniTorch 裡用基本運算拼出來的 softmax**（`minitorch.nn.softmax(inp + mask)`）。結果正確性以 `atol=1e-3, rtol=1e-3` 比對。

這解釋了為什麼 LayerNorm 前向能預期 15.8 倍：比較對象是一串各自發 kernel、各自讀寫記憶體的 MiniTorch 運算，正好是 L10 說「融合能省下」的那種情況。

Problem 3 的 1.1 倍是另一回事。作業頁直接引 **Amdahl 定律**：你只加速了 softmax 和 LayerNorm，矩陣乘法等其他部分沒變，整體改善本來就不會大。這個「kernel 快 15 倍、訓練快 1.1 倍」的落差，是這份作業最值得帶走的一課。

## 需要什麼環境

| 項目 | 作業頁與 repo 的說明 |
|---|---|
| GPU | 要能跑 `nvcc` 的 NVIDIA GPU；作業頁的安裝指令以 PSC 上的 `module load cuda/12.4` 為例 |
| Python | 3.12 以上，建議用 conda 或 uv |
| 套件 | `requirements.txt` 在 2026-09-30 釘在 `torch==2.9.1`、`pycuda==2025.1.2`、`numba==0.63.1`、`datasets==4.4.1` 等版本 |
| Problem 3 的資料 | `project/run_machine_translation.py` 從 Hugging Face 載入 `bbaaaa/iwslt14-de-en-preprocess`（IWSLT14 德英），預設訓練 1 個 epoch |
| 繳交 | 整個 `llmsys_hw4` 資料夾壓成 zip 上傳 Canvas，附上有無融合 kernel 各訓練一個 epoch 的終端機截圖 |

校外讀者拿不到 PSC 帳號，要自備 NVIDIA GPU 或租雲端機器。Canvas 繳交也用不到，自學時以 `kernel_tests/` 全部通過、Problem 3 兩次計時都跑出來為完成標準。

課程的 [Logistics 頁](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics)有一條少見的規則：學生如果發現作業的錯字或 bug、送 pull request 並被合併，可以拿 participation bonus。repo 的 commit 歷史裡也確實有不少外部帳號送來、被合併的修正，例如 2026-02-18 合併的「Fix Adam second-moment beta coefficient」。自學時遇到怪現象，先翻一下 commit 與 PR 紀錄。

## repo 已被 2026 秋季改過

`llmsys_hw4` 的 README 標題仍是 `llmsys_f25_hw4`，而 GitHub commit 紀錄顯示：

- 春季學期內最後一次修改是 **2026-02-20** 合併的 typo 修正（commit `e2162e7d`），早於 3 月 11 日截止日
- **2026-09-18 與 2026-09-29** 又有兩批修改（最後一次合併在 2026-09-30），動到 `nn.py`、`modules_basic.py`、`modules_transfomer.py`、`tensor_functions.py`、`run_machine_translation.py`，並新增一個預先編好的 `layernorm_kernel.so`；兩個要你寫的 `.cu` 檔在這兩批修改裡沒有變動

想完全對齊春季版，clone 後 `git checkout e2162e7d`。想跟著目前的作業頁走，就用 `main`，但要知道它可能在 Fall 2026 學期中繼續變動。

## 自學怎麼做

1. 先確認 HW3 的 Transformer 能訓練。這份作業的 Problem 3 直接用它，HW3 有 bug 會一路帶進來。
2. 從 Softmax 前向開始，先讀懂已寫好的 `ker_attn_softmax_lt32`，再寫長序列版本。它是四個 kernel 裡有現成範本可以對照的一個。
3. 寫 LayerNorm 前，把 L10 第 21–22 頁的公式自己推一次，確認為什麼 μ(x) 和 μ(x²) 可以同時算、反向那兩個加總為什麼可以並行。
4. Problem 3 跑完兩次計時後，用 profiler 看一下 softmax 與 LayerNorm 原本佔訓練時間多少，自己驗證 1.1 倍從哪來。

今晚可以做的一件事：clone repo，只讀 `src/softmax_kernel.cu` 裡的 `ker_attn_softmax_lt32`，把它每一步對應到 L10 第 23–24 頁的圖。

## 延伸閱讀

- 用 Triton 寫融合 kernel、以及先 profile 再優化的方法：[CS336 Lecture 6：寫 Triton kernel 前，先學會 benchmark 與 profile](/posts/ai/2026-08-22-cs336-kernels-triton)
- 把整個 attention 融合成一個 kernel：本系列的 [FlashAttention 篇](/posts/ai/2026-09-30-cmu11868-flashattention)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時回官方課程頁與公開影音來源查證，仍未找到該講公開錄影，狀態維持不變。

## 參考資料

- [Assignment 4: Transformer CUDA Acceleration（作業頁）](https://llmsystem.github.io/llmsystemhomework/assignment_4/) — 三個 Problem、配分、預期加速、設定與繳交方式（2026-09-30 所見）
- [llmsystem/llmsys_hw4（GitHub）](https://github.com/llmsystem/llmsys_hw4) — 起始碼、kernel 測試、`requirements.txt`
- [llmsys_hw4 commit 紀錄](https://github.com/llmsystem/llmsys_hw4/commits/main) — 春季最後修改 2026-02-20、秋季修改 2026-09-18 起
- [kernel_tests/test_softmax_fw.py](https://github.com/llmsystem/llmsys_hw4/blob/main/kernel_tests/test_softmax_fw.py) — 測試以 MiniTorch 自己的 softmax 為 baseline
- [project/run_machine_translation.py](https://github.com/llmsystem/llmsys_hw4/blob/main/project/run_machine_translation.py) — Problem 3 的 IWSLT14 資料集與 `--use-fused-kernel` 參數
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — HW4 截止日 3/11
- [11-868 Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) — 作業配分、PSC、修 bug 的 participation bonus
- [L10 投影片（PDF）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf) — 第 21–26 頁的 LayerNorm／Softmax 改寫
- [Wang et al., LightSeq（arXiv 2010.13887）](https://arxiv.org/abs/2010.13887) 與 [LightSeq2（arXiv 2110.05722）](https://arxiv.org/abs/2110.05722) — 作業頁指定的兩篇論文
- [NVIDIA Developer Blog：Cooperative Groups](https://developer.nvidia.com/blog/cooperative-groups/) — 作業頁引用的 `shfl_down` 說明
