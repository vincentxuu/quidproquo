---
title: "CS149 PA5 在 H100 上寫最快的 kernel：五道 AI kernel 題，評分看工作日誌不看排名"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, triton, flashattention, performance]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 18
tldr: "CS149 Fall 2025 的最後一份程式作業是開放式的：從 Histogram、1D occupancy decoder、FlashAttention、3D 熱方程 RK4、SwiGLU 五題挑一題以上，在 H100 上把 PyTorch baseline 調快，可以用 CUDA、Triton 或 TileLang，也允許用 LLM。分數不看速度門檻，看你交的工作日誌能不能說清楚每一步量了什麼、推出什麼假設、為什麼停手。H100 job queue 與排行榜要 SUNet ID，校外只能在自己的 NVIDIA GPU 上用 eval.py 跑。"
description: "Stanford CS149（Fall 2025）Programming Assignment 5「Make the World's Fastest CUDA Kernels」導讀：五道題目的輸入規模與瓶頸、CUDA／Triton 3.5.1／TileLang 0.1.6.post2 三種寫法、popcorn-cli 的 test／benchmark／leaderboard／profile 模式、80／95／95–110 分的工作日誌評分，以及校外只能本地跑 eval.py 的限制。不含解答。"
draft: false
glossary:
  - term: "work log"
    aliases: ["工作日誌"]
    definition: "PA5 要繳交的報告：依序記錄每個最佳化步驟的程式結構、執行時間、看了哪些 profiler 數據、據此形成的假設，以及最後為什麼停手。"
    context: "PA5 的分數由助教評估工作日誌決定，沒有固定的效能門檻。"
  - term: "online softmax"
    definition: "逐塊處理 attention 分數時，維護每一列目前的最大值與累積和，讓 softmax 可以分塊正規化，不必一次把整列放進記憶體。"
    context: "PA5 FlashAttention 題的 README 把它列為三個關鍵概念之一，另外兩個是 tiling 與 fusion。"
  - term: "popcorn-cli"
    definition: "GPU MODE 社群開源的命令列工具，PA5 用它把程式送進課程的 H100 job queue 並提交到排行榜。"
    context: "需要先用 SUNet ID 註冊，校外讀者無法使用課程的 queue。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 18 篇，接續 [L13 DSL 與 AI 驅動的效能最佳化](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization)，範圍是 [Programming Assignment 5（stanford-cs149/asst5-kernels）](https://github.com/stanford-cs149/asst5-kernels)。課程首頁把它列為「Assignment 5: Make the World's Fastest CUDA Kernels」，截止日是 2025 年 12 月 4 日，而且 README 寫明這份作業**沒有遲交天數**。

本文只寫題目在練什麼、該先量什麼、往哪個方向想。**不附解答。**

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25)

## 這份作業跟前四份不一樣

[README](https://github.com/stanford-cs149/asst5-kernels/blob/main/README.md) 把 PA5 定位成「很短的期末專題」：助教校準過，大約兩個晚上可以拿到不錯的分數，想深挖的組也可以花很多時間追求極快的實作。它和 [PA1](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance) 到 PA4 最大的差別有三個：

1. **沒有單一題目。** 從五個 AI 相關的 kernel 裡挑一個以上，每題都有 PyTorch baseline。
2. **沒有效能門檻。** 分數由助教評估你的工作日誌決定。
3. **可以用 LLM。** README 明說可以用 [Stanford AI Playground](https://uit.stanford.edu/service/aiplayground) 裡的任何模型寫程式、解讀 profiler 結果、決定下一步。

README 給的目標是練習「開放式的效能工程」：沒有助教的快速參考解可以追，就像真實世界裡要讓一支程式跑更快的處境。

硬體是 H100。PA4 還有 Trainium 額度的組，也可以改在 Trainium 上做，但 Trainium 沒有排行榜（PA4 的環境見本系列的 [PA4 Trainium2 + NKI 篇](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki)）。

## 三種寫法

| 寫法 | 要交的檔案 | 備註 |
|---|---|---|
| Python + [Triton](https://triton-lang.org/main/index.html) | `submission.py`，實作 `custom_kernel` 介面 | job queue 環境是 triton 3.5.1 |
| Python + [TileLang](https://tilelang.com/) | `submission.py` | job queue 環境是 tilelang 0.1.6.post2 |
| CUDA | `submission.cu`，照 `templates/template.cu` 的骨架 | queue 只收 `submission.py`，要先跑 `python wrap_cuda_submission.py <SUNet ID>` 把 CUDA 包進 Python |

每題的資料夾都有 `templates/`（`template.py`、`template.cu`）和 `test_cases/test.txt`。FlashAttention 題另外附一個 `template_triton.py`，裡面是帶 online softmax 的 Triton kernel 骨架。

README 形容 Triton 和 TileLang 是「提供 tile 抽象的現代 AI 框架」。如果你讀過 [L13](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization) 的「演算法與排程分離」，這兩個工具就是同一個想法落在 GPU kernel 上的例子。Triton 的基礎可以先讀 [CS336 的 kernels 與 Triton 篇](/posts/ai/2026-08-22-cs336-kernels-triton)。

## 五道題目

下表的規模都取自各題的 `test_cases/test.txt` 或 README。

| 題目 | 在算什麼 | 測試規模 | README 點出的難處 |
|---|---|---|---|
| [Histogram](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/histogram) | 多通道直方圖：`[length, num_channels]` 的整數陣列，對每個通道統計各 bin 出現次數 | length 1,048,576、512 通道、256 bins | 大量 thread 搶同一批 bin 造成 atomic contention，存取模式也差 |
| [1d-occupancy-decoder](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/1d-occupancy-decoder) | MLP embedder → cross-attention → LayerNorm → 輸出投影，模組與尺寸取自 Roblox 開源的 Cube3D | 250,000 個 query、1,024 個 latent、width 768、12 heads | query 與 key/value 長度極度不對稱；全程 float16，但 softmax 必須用 float32 |
| [FlashAttention](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/flashattention) | 實作 softmax(QKᵀ/√D)V，輸入 FP16 | 三組形狀，遠端只用最大的 (4, 64, 8192, 128) 做 benchmark | 標準 attention 在 H100 上是 memory-bound |
| [3D Heat Equation – RK4](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/rk4) | 8 階精度的 25 點 stencil 算 Laplacian，外面包經典 RK4 時間積分 | 600³ 網格、10 步 | 正確性要求 rtol、atol 都是 1e-6；邊界 4 格固定不更新 |
| [SwiGLU](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/swiglu) | Swish(xW + b) ⊙ (xV + c) | batch 256、in_features 2048、hidden 4096 | README 只給定義與形狀，瓶頸要自己量 |

### 每題的第一個問題

以下不是解法，是讀完 README 後該先問自己的問題，對應課程前面學過的概念。

**Histogram**：多少 thread 會同時寫同一個 bin？這是 [L6 Locality 與通訊](/posts/ai/2026-09-30-cs149-locality-communication)講的 contention。README 提示的方向是 shared memory 與同步。

**1d-occupancy-decoder**：README 附了助教自己的嘗試。PyTorch 版約 7.4 ms；把 MLP embedder 和 cross-attention 都改成 Triton 但不做 fusion，反而慢了 19%；只換 MLP embedder 快 2%。助教說移植 cross-attention 花了五到六小時。這組數字本身就是一堂課：沒有 fusion 的逐層改寫，常常贏不了高度調校過的函式庫。

**FlashAttention**：README 列了三個關鍵概念：tiling（把 Q、K、V 的小塊載入 SRAM）、fusion（不把 N×N 的分數矩陣寫回 HBM）、online softmax。README 的參考表裡，PyTorch 自帶的 FlashAttention 在 H100 最大形狀上約 28 ms，是 naive 參考版的 4.5 倍快。這給了你一個「函式庫做得到多少」的座標。

**RK4**：每個時間步要算四次 Laplacian，每次都讀 25 個鄰點。README 的 baseline 表裡，PyTorch 約 1458 ms，naive Triton 約 317 ms，naive CUDA 約 148 ms。先想清楚：中間的 k₁ 到 k₄ 要不要寫回 global memory？README 自己點名的方向是自訂存取模式、shared memory 與 kernel fusion。

**SwiGLU**：兩個矩陣乘共用同一個輸入 x，後面接逐元素運算。先用 profiler 看瓶頸在矩陣乘還是在逐元素那一段，再決定要不要 fuse。

<details>
<summary>FlashAttention 要懂到什麼程度才夠做這題</summary>

夠做作業的最低限度：

1. 標準 attention 會先算出 N×N 的分數矩陣，寫回 HBM，再讀回來做 softmax 和乘 V。序列長度 8192 時，這個矩陣本身的讀寫就是主要成本。
2. FlashAttention 把 Q 切成列區塊，每個區塊依序掃過 K、V 的區塊，全程在 SRAM 裡算。
3. softmax 需要整列的最大值和總和。online softmax 在掃每個 K 區塊時更新這兩個統計量，並把已累積的輸出按比例修正。

更深的推導、backward 的重算技巧、FA2 到 FA4 如何隨硬體改寫，請讀 [CMU 11-868 的 FlashAttention 篇](/posts/ai/2026-09-30-cmu11868-flashattention)。README 推薦的讀物是 [FlashAttention 原論文](https://arxiv.org/abs/2205.14135)和 UW CSE 599M 的講義 [From Online Softmax to FlashAttention](https://courses.cs.washington.edu/courses/cse599m/23sp/notes/flashattn.pdf)。

</details>

## 怎麼跑：job queue 與本地開發

課程的流程分四步，前三步都綁 Stanford 身分：

1. 安裝 [popcorn-cli](https://github.com/gpu-mode/popcorn-cli)（repo 的 `binary/` 有 Linux、macOS 預編譯檔，也可以用 Rust 自己編）
2. 跑 Ed 貼文提供的 `setup.sh` 設定伺服器連線
3. 用 `popcorn-cli register --sunet-id ... --nickname ...` 註冊，隊名註冊後不能改
4. 用 `popcorn-cli submit --leaderboard <題目> --mode <模式> submission.py` 送出

`--mode` 有四種：

| 模式 | 做什麼 |
|---|---|
| `test` | 只檢查正確性 |
| `benchmark` | 量執行時間，不上排行榜 |
| `leaderboard` | 量時間並提交到該題排行榜 |
| `profile` | 跑 Nsight Compute，回傳摘要，完整 `.ncu-rep` 可從 job 頁面下載 |

profile 摘要會列 Compute_Throughput、SM_Busy、L1／L2／DRAM throughput、快取命中率、各層流量等指標。README 舉了一個 RK4 的 `heat_step_kernel` 例子：7.10 µs，Compute_Throughput 只有 18.45%，DRAM_Throughput 只有 4.45%，然後反問「為什麼它還沒用好 GPU？」。RK4 的 profile 只回報前 20 個 kernel。

本地開發不需要 SUNet：在任何支援 CUDA 的 NVIDIA GPU 上，把 `problems/` 加進 `PYTHONPATH`，到題目資料夾裡跑：

```bash
python ../eval.py <test/benchmark/profile> test_cases/test.txt
```

`profile` 模式要 `ncu` 與 `ncu_report` Python 套件，還要開放 GPU performance counter 的權限，README 有逐步指令。README 舉的本地環境是 AWS `g6.xlarge`（NVIDIA L4）。它也提醒：小 GPU 只適合驗證正確性和探索方向，**效能要針對 H100 調、針對 H100 分析**，因為對一種處理器最好的決定不一定適用另一種。

### 校外能做到哪裡

- **H100 queue 與排行榜：做不到。** 需要 SUNet ID 註冊，`setup.sh` 也只貼在課程 Ed 上。排行榜連結同樣在 Ed。
- **題目、模板、reference、eval.py：全部公開。** 有 NVIDIA GPU 就能跑正確性測試和 benchmark。
- **H100 上的數字：要自己租。** 沒有 H100 的話，你量到的數字不能和 README 的參考值比，工作日誌裡要寫清楚是哪張卡。

所以這份作業對校外讀者是 **A3 減掉評測環境**：材料完整，缺的是課程提供的 H100 和同學的排行榜。等級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 評分：工作日誌

| 分數 | 條件 |
|---|---|
| 80 | 付出最低限度的努力，日誌看得出用課程概念做了幾步最佳化，有一些 speedup |
| 95 | 用課程概念解讀執行時間與 profiler 結果，據此論證下一步，探索了一組合理的選項；不錯的最終效能也算紮實的證據 |
| 95–110 | 在 95 分的基礎上做出令人印象深刻的結果；拿到 100 可能意味排行榜上的高名次，超過 100 分個案決定 |

README 也保留在「連最低努力都沒達到」時給更低分的權利。

日誌分三部分：

1. **你走過的步驟。** 每一步要交代：程式怎麼結構化（要附程式，也要用高層語言描述，例如「把最外層迴圈分塊，對應到 CUDA thread block」）、執行時間是多少、看了哪些統計、得出什麼結論、假設瓶頸在哪、這個假設建議下一步改什麼。不用寫每個小改動，抽象程度對準你在 office hours 跟助教討論 PA2 到 PA4 的層次。
2. **為什麼停手。** 時間用完可以直說，但如果是看 profile 結果判斷沒什麼可做了，要說明怎麼判斷的。
3. **LLM 有沒有幫上忙。** 用在寫程式、發想、還是解讀 profile？有沒有用？README 說，用 LLM 逐步合作或一連串 prompt 工程得到好結果，也是好的做法，只要把思考過程與 prompt 寫進日誌。如果 LLM 第一個 prompt 就給出你改不動的答案，README 要你聯絡助教，例如改做第二題。

繳交格式是一個 `.zip`，內含 `handin.pdf` 和關鍵步驟的程式檔。

README 把這個迴圈寫成四步：執行、量測、用對程式的理解加上數據形成假設（**增加平行度、減少記憶體流量、隱藏記憶體延遲、緩解 contention**）、改程式驗證假設。這四個方向幾乎就是 CS149 前半學期的目錄：[L2](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading) 的平行與延遲隱藏、[L3](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc) 的頻寬、[L6](/posts/ai/2026-09-30-cs149-locality-communication) 的 contention、[L7](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda) 的 CUDA 記憶體階層。

**怎麼做**：挑一題，先不寫任何 kernel。用 `eval.py profile` 跑 baseline，把 profile 摘要貼進筆記，寫下一句「我認為它被 ___ 限制，因為 ___ 這個數字」。這句話就是你工作日誌的第一步。

## 這一篇可以確認與不能確認的

可以確認：asst5-kernels repo 的 README、五個題目的 README 與 `test_cases/test.txt`、模板檔案清單，以及課程首頁的作業標題與截止日。README 裡的效能數字是助教在各自硬體上量的（FlashAttention 表的小、中形狀是 RTX 5090，大形狀是 H100），本文照引，沒有重跑。

不能確認：Ed 上的 `setup.sh` 內容與排行榜實際結果、H100 queue 的實際排隊狀況、助教評分工作日誌的細部標準。

另外要注意：SwiGLU 題的 README 把 [arXiv 1710.05941](https://arxiv.org/abs/1710.05941) 寫成「the original SwiGLU paper」，但那篇是 Ramachandran、Zoph、Le 2017 年的〈Searching for Activation Functions〉，提出的是 Swish 這個激活函數。把 Swish 放進 GLU 閘門、命名 SwiGLU 的是 Noam Shazeer 2020 年的〈[GLU Variants Improve Transformer](https://arxiv.org/abs/2002.05202)〉（arXiv 2002.05202）。題目的公式 Swish(xW + b) ⊙ (xV + c) 兩篇都用得上：Swish 的定義查前者，SwiGLU 的結構查後者。

延伸閱讀：FlashAttention 的完整推導與演進看 [CMU 11-868 L21](/posts/ai/2026-09-30-cmu11868-flashattention)；Triton 的程式模型看 [CS336 kernels 與 Triton](/posts/ai/2026-08-22-cs336-kernels-triton)；GPU 程式設計的另一種講法看 [CMU 11-868 GPU programming](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)。

系列導覽：上一篇 [L13 DSL 與 AI 驅動的效能最佳化](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization)｜下一篇 [L14 Cache coherence：MSI、MESI 與 false sharing](/posts/ai/2026-09-30-cs149-cache-coherence)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁與作業表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Assignment 5 README（stanford-cs149/asst5-kernels）](https://github.com/stanford-cs149/asst5-kernels)
- [Histogram 題目說明](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/histogram)
- [1d-occupancy-decoder 題目說明](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/1d-occupancy-decoder)
- [FlashAttention 題目說明](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/flashattention)
- [3D Heat Equation – RK4 題目說明](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/rk4)
- [SwiGLU 題目說明](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/swiglu)
- [Searching for Activation Functions（arXiv 1710.05941，Swish 的出處）](https://arxiv.org/abs/1710.05941)
- [GLU Variants Improve Transformer（arXiv 2002.05202，SwiGLU 的出處）](https://arxiv.org/abs/2002.05202)
- [GPU MODE popcorn-cli](https://github.com/gpu-mode/popcorn-cli) 與 [kernelbot](https://github.com/gpu-mode/kernelbot)（PA5 使用的評測基礎設施）
- [Triton 官方文件](https://triton-lang.org/main/index.html)
- [TileLang 官方文件](https://tilelang.com/)
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness（arXiv 2205.14135）](https://arxiv.org/abs/2205.14135)
- [From Online Softmax to FlashAttention（UW CSE 599M 講義 PDF）](https://courses.cs.washington.edu/courses/cse599m/23sp/notes/flashattn.pdf)
