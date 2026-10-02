---
title: "CS149 PA4 + Written 3：在 Trainium2 上自己搬資料——NKI、SBUF/PSUM 與 fused conv+maxpool"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 15
tldr: "PA4 把你丟到 AWS Trainium2 的一顆 NeuronCore 上。這裡沒有 cache 幫你決定什麼資料留在晶片上：SBUF（28 MiB）與 PSUM（2 MiB）都要你用 dma_copy 明確搬進搬出，partition 維度最多 128。Part 1 用 vector add 和 transpose 教你這些限制與 DMA 成本，Part 2 要你把 convolution 拆成一串 matmul、再和 max pool 融合成一個不落地到 HBM 的 kernel。Written 3 用 line buffer、兩次 box blur、softmax 硬體與 metapipelining 練同一件事：把中間結果留在晶片上。環境需要課程 private AMI 與付費 capacity block，校外實質只到 A2。"
description: "Stanford CS149（Fall 2025）Programming Assignment 4 與 Written Assignment 3 導讀：Trainium2 的 NeuronCore 與 HBM/SBUF/PSUM 記憶體階層、NKI 程式模型、vector add 與 matrix transpose、fused convolution + max pool 的 matmul 映射，以及書面作業的 locality、softmax 硬體與 data-parallel 練習；附校外可及性說明。"
draft: false
glossary:
  - term: "SBUF"
    aliases: ["State Buffer"]
    definition: "Trainium NeuronCore 上由軟體管理的晶片內記憶體（PA4 README 寫 28 MiB，頻寬約為 HBM 的 20 倍）；計算前必須明確把資料從 HBM 搬進來。"
    context: "CS149 PA4 的所有 NKI kernel 都要先 dma_copy 到 SBUF 才能運算。"
  - term: "PSUM"
    aliases: ["Partial Sum Buffer"]
    definition: "NeuronCore 上專門存放 Tensor Engine 矩陣乘結果的小型晶片內記憶體（2 MiB），支援 read-add-write，適合分塊 matmul 時累加部分和。"
    context: "PA4 的 transpose 與 matmul 結果都先落在 PSUM，要再複製到 SBUF 才能 DMA 回 HBM。"
  - term: "partition dimension"
    aliases: ["P 維度", "分割維度"]
    definition: "NKI 中 SBUF/PSUM 2D tensor 的第一個維度，NeuronCore 沿這個維度平行載入與處理資料，大小上限 128；第二個維度叫 free dimension。"
    context: "PA4 Part 1 的 vector add 只能處理 128 個元素，就是因為 1D 向量唯一的維度被當成 partition 維度。"
  - term: "NKI"
    aliases: ["Neuron Kernel Interface"]
    definition: "AWS 為 Trainium 提供的 kernel 語言與編譯器，用 Python 撰寫，以 @nki.jit 標記要編譯到 NeuronDevice 的函式。"
    context: "CS149 PA4 全部用 NKI 撰寫。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 15 篇，對應兩份作業：程式作業 [Assignment 4: Programming a Machine Learning Accelerator](https://github.com/stanford-cs149/asst4-trainium2)（Due Nov 13，100 分），以及書面作業 [Written Assignment 3](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf)。

先講公開程度。整門課是 A3（足以自學），但 **PA4 這一份實質只到 A2**：程式碼與 README 完全公開，可以讀、可以理解；要真的跑起來，得有 AWS Trainium2 機器，而官方的環境設定用的是只開放給修課學生的 private AMI（細節見文末「校外能做到哪」）。Written 3 的 PDF 公開，但沒有解答。

本文只寫題目在練什麼、該觀察什麼現象，**不貼解答**。

## 從 CUDA 換到 Trainium：少了 cache 這個保母

前一份作業 [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer) 在 NVIDIA GPU 上寫 CUDA。PA4 的 README 一開頭就拿 PA3 對照：CUDA 的記憶體階層是 host memory、device global memory、每個 thread block 的 shared memory、每條 CUDA thread 的私有記憶體；Trainium 則是四層：

| 層 | 位置 | README 給的數字 | 誰管理 |
|---|---|---|---|
| host memory（DRAM） | Trainium 裝置外 | — | 本作業不碰 |
| HBM | Trainium 裝置上 | 96 GiB | 裝置主記憶體，kernel 外建立的 NumPy 陣列預設放這 |
| SBUF（State Buffer） | NeuronCore 晶片內 | 28 MiB，頻寬約 HBM 的 20 倍 | **軟體**明確搬進搬出 |
| PSUM（Partial Sum Buffer） | NeuronCore 晶片內 | 2 MiB | 專放 Tensor Engine 的矩陣乘結果 |

README 用一段話點出這份作業的核心差異。傳統有資料 cache 的系統裡，什麼資料要複製到晶片上，由 cache 硬體決定——從軟體正確性的角度，cache 根本不存在。NeuronCore 的記憶體則是 **software managed**：要嘛程式設計師在程式裡寫出資料搬移，要嘛 NKI 編譯器分析程式後自己產生搬移指令。README 說，用好 NeuronCore 最大的挑戰之一，就是把資料在機器裡的流動安排好。

這正是前兩講的延續。[L10 硬體專用化](/posts/ai/2026-09-30-cs149-hardware-specialization)講為什麼加速器要大量晶片內儲存，[L11 專用硬體的程式系統](/posts/ai/2026-09-30-cs149-programming-specialized-hardware)講怎麼替這種硬體寫程式；PA4 讓你親手做一次。

### 硬體長什麼樣

作業用的 `trn2.3xlarge` instance 有一顆 Trainium 裝置，內含八個 NeuronCore，每個 core 有自己專屬的 HBM。每個 NeuronCore 可以視為獨立的處理單元，有自己的晶片內儲存，以及一組專用計算引擎：做 128×128 矩陣運算的 Tensor Engine、做 128 寬向量運算的 Vector Engine 等等。README 說 NeuronCore 共有四種計算引擎，細節連到 [AWS Neuron 文件](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html)。**整份作業只在一個 NeuronCore 上寫 kernel。**

## NKI 程式模型：三種操作

[NKI](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/programming_model.html)（Neuron Kernel Interface）是 Trainium 的 kernel 語言與編譯器，用 Python 寫。README 把 NKI kernel 的操作分成三類：

1. **載入**：從 HBM 搬到 SBUF
2. **計算**：在 NeuronCore 的計算引擎上執行
3. **儲存**：把結果從 SBUF 搬回 HBM

README 一路拿 CUDA 對照：`@nki.jit` 裝飾器像 CUDA 的 `__global__`，標記要編譯到裝置上的函式；kernel 參數是放在 HBM 的 tensor，就像 CUDA kernel 參數是 device global memory 裡的陣列；`nisa.dma_copy` 在 HBM 與 SBUF 間搬資料，概念上像 `cudaMemcpyAsync`。作業還要求加上 `@nki.compiler.skip_middle_end_transformations`，關掉一些會以意外方式改寫 kernel 的編譯器最佳化，讓除錯比較容易。

最重要的一句是粗體寫的：**NKI 操作的對象是 tensor，不是純量。** SBUF 和 PSUM 把資料存成 2D 陣列，第一維叫 **partition dimension**（P），第二維叫 **free dimension**（F）。NeuronCore 能沿 partition 維度平行載入與處理資料，但架構限制 **partition 維度最多 128**。

所以 README 給的第一個 vector add kernel 只能處理長度 128 以下的向量：1D 向量唯一的維度就是 partition 維度。

## Part 1：vector add 與 transpose（30 分）

Part 1 的程式碼在 `part1/`，`run_benchmark.py` 可以用不同向量大小跑各版本 kernel，也可以選擇收集 profiling 資料。

### Step 1：切塊，對齊 128 條 lane

`vector_add_tiled` 把向量切成 `ROW_CHUNK` 大小的塊，用 `nl.affine_range` 迴圈逐塊處理。起始程式故意設 `ROW_CHUNK = 1`（README 自己說這很沒效率）。你要做的是：

- 用 `ROW_CHUNK = 1` 跑 25600 個元素，記錄時間
- 改成 128，比較快多少，解釋原因。README 的提示是：把執行想成「從 HBM 平行載入 `ROW_CHUNK` 個元素，再在 SBUF 上做 `ROW_CHUNK` 寬的向量加法」
- 試 256，會報錯；用一句話解釋為什麼

`affine_range` 要求迭代間沒有 loop-carried dependency；有依賴的情況要用 `sequential_range`。README 說明，因為作業關掉了編譯器最佳化，這兩者在這裡實際上效果一樣。

### Step 2a：讓每次 DMA 搬更多

README 請你把 `nisa.dma_copy` 想成**一個非同步操作，把一整塊資料從 HBM 搬到 SBUF 或反向**。每個 NeuronCore 有 16 個 DMA engine 可以平行處理不同的傳輸，但每次設定 DMA 傳輸都有固定開銷，所以有效率的實作應該每次搬大量資料來攤平這個開銷。

partition 維度最多 128，但單一 SBUF 向量指令的 free 維度可以到 64K 個元素。`vector_add_stream` 因此把 1D 向量 reshape 成 `(128, M/128)` 的 2D tile，每次沿 free 維度搬 `FREE_DIM` 個元素。README 把這比作 PA3 的反向操作：PA3 把 2D 的 thread 網格攤平成線性索引，這裡把一維向量折成二維矩陣。你要調 `FREE_DIM`，讓 25600 個元素的 DMA 次數降到最少，並記錄加速比。

### Step 2b：tile 不是越大越好

README 列出選 free 維度大小時的取捨：

1. 太小：指令開銷太明顯，引擎執行沒效率
2. 太大：引擎之間的 pipelining 變差；有資料重用時，SBUF 的記憶體壓力變高

這一步把向量放大到 256000 個元素，比較 `FREE_DIM = 2000` 與 `1000`，用 `neuron-profile` 看 `dma_transfer_count` 和 `total_time`。README 直接告訴你結果的方向：**1000 的 DMA 次數比較多，卻比較快**。你要打開 profiler 的 GUI，看 DMA engine、Vector Engine、Pending DMA Count、DMA Throughput 這幾條時間軸，解釋原因——提示只有一個詞：pipelining。

這個現象和 [L3 的洗衣服比喻](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc)是同一件事：一批太大，下一站只能乾等。

### Step 3：用 Tensor Engine 做 transpose（15 分 + 1 分加分）

Tensor Engine 的核心是 128×128 的 systolic array（README 連回 [L11 投影片第 10 頁](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/slide_10)），從 SBUF 串流讀入矩陣資料，結果寫進 PSUM。PSUM 支援對每個位址做 read-add-write，所以分塊做大矩陣乘時，各塊結果可以直接累加到同一個輸出 tile。

你要寫一個把 (M, N) 矩陣轉成 (N, M) 的 kernel，M、N 都是 128 的倍數。限制是：**唯一能用的計算指令是 `nisa.nc_transpose`**，它用 Tensor Engine 轉置最大 128×128 的 tile、結果放在 PSUM。`nisa.dma_copy` 只能作用在 SBUF/HBM 上，所以 PSUM 的結果要先用 `nisa.tensor_copy` 之類的指令複製到 SBUF。

寫完要回答：不看 profiler，你認為這個 kernel 是 memory-bound 還是 compute-bound？再用 profiler 驗證。加分題是 4096×4096 的 transpose 要低於 700 μs。

## Part 2：fused convolution + max pool（70 分）

### 先學 NKI 的分塊 matmul

Tensor Engine 對 tile 大小有自己的限制，和 Vector Engine 不同。計算 C = A × B 時：

- 左矩陣 A 的 tile 最大 (128, 128)
- 右矩陣 B 的 tile 最大 (128, 512)
- PSUM 裡的輸出 tile C 最大 (128, 512)

README 給了一個改編自 NKI 官方教學的分塊 matmul：外兩層 `affine_range` 迴圈走過輸出的 M、N 維度，每個輸出 tile 在 PSUM 配一塊部分和；最內層沿收縮維度 K 逐塊載入 A、B 的 tile，用 `nisa.nc_matmul` 累加進 PSUM；做完再複製回 SBUF、轉型、DMA 回 HBM。

要特別注意一個介面細節：**左矩陣是以轉置形式 `lhsT`（形狀 [K, M]）傳入的**。`nisa.nc_matmul(lhsT, rhs)` 回傳的是 A × B。這會直接影響你在 Part 2 要不要先轉置輸入。

### 把 convolution 改寫成一串 matmul

[L9](/posts/ai/2026-09-30-cs149-dnn-on-gpus) 講過一種 conv→GEMM 的轉換：替每個空間 patch 建一列，變成一個大矩陣乘。PA4 README 特別用 NOTE 標註：**這裡用的是另一種轉換**，比較適合 Trainium。

做法是把輸入特徵圖的高與寬攤平成一維，變成 `(Height × Width) × Input Channels`。濾波器的每一個位置 (i, j) 都是一個 `Input Channels × Output Channels` 的切片；對每個 (i, j)，把輸入平移對應的偏移量，和這個切片做一次沿 Input Channels 收縮的矩陣乘，全部累加起來就是輸出。README 的虛擬碼是兩層迴圈（濾波器高、寬）包一個 `output += matmul(transpose(weight[i,j,:,:]), input_shifted)`，並提醒：**這只是演算法描述，作業的重點是你要想出怎麼把它有效率地映射到這個硬體上。**

作業也簡化了 convolution 的參數：只需支援 stride 1，不用處理 padding（harness 會先幫你 pad 好）。

### max pool 與融合

max pool 同樣在特徵圖上滑動視窗，但取的是視窗內最大值，而且每個 channel 各自獨立處理。作業用單一參數 `pool_size` 同時代表視窗大小與步長，只會是 1 或 2；`pool_size = 1` 等於沒做 pooling，所以同一個 kernel 也能當普通 convolution 用。

「融合」的定義在 README 裡寫得很明確：convolution 和 max pool 在 Trainium 上一起算完，**中間結果不寫回晶片外的 HBM**。

kernel 的輸入保證了一些好條件：Input Channels 與 Output Channels 都是 128 的倍數、濾波器是正方形、權重一定能整個放進 SBUF、尺寸都能整除。

### README 的建議順序

README 的 General Tips 基本上就是一份作業計畫：

1. **先求正確**：從最簡單的情況開始——小圖、沒有 bias、沒有 maxpool。然後處理放不進 SBUF 的大圖，再加 bias，最後融合 max pool。全對之後才開始調效能。
2. **先懂演算法**：畫出矩陣與維度，想清楚怎麼對應到記憶體階層。提示：想想 NKI matmul 介面的特別之處——第一個輸入是轉置過的。
3. **追蹤 tile 維度**：決定輸出要沿哪個維度切 tile；partition 維度最多 128 且必須是第一維。決定輸出形狀之後，反推算一個輸出 tile 需要 X 和 W 的哪一部分。
4. **按 locality 排迴圈**：迴圈來自濾波器高寬、分塊 matmul 和 batch。建議目標是讓中間結果留在 PSUM 直到該 tile 算完，這樣 SBUF 裡的每塊結果只寫一次；接著再為輸入的 locality 排剩下的迴圈。
5. **用 profiler 找 Tensor Engine 閒置的地方**，重構程式縮短那些階段。

### 評分方式

- 正確性測試用兩種圖：32×16 的小圖，以及 224×224、超過 SBUF 容量、不能一次放進去的大圖。**必須全部正確才能拿效能分。**
- 效能和參考 kernel 比：有無 maxpool、float16 與 float32 四種組合，float16 的門檻更嚴。p99 延遲在「未最佳化參考版」的 120% 以內拿 95% 效能分，在「最佳化參考版」的 120% 以內拿滿分。
- 配分：Write-up 30 分（Part 1 題目 20、Part 2 題目 10）、transpose 正確性 10 分、conv 正確性 10 分（小圖、大圖、bias、maxpool 各 2.5）、conv 效能 50 分，另有小圖效能加分最多 5 分。
- write-up 要回報用 profiler 量到的 MFU（Model FLOPs Utilization），float16 與 float32 都要。

加分題問的是：小圖和大圖的 MFU 有沒有差？怎麼為小圖最佳化？README 給的提示是 `nisa.nc_matmul` 的 moving 參數可以接受超過二維的 tensor，只要遵守 PSUM 的硬體限制。

**今晚可以做的事**：不用 Trainium 也能做第一步。打開 repo 的 `part2/conv2d_numpy.py`，它有 convolution 和 maxpool 的 NumPy 實作。拿紙畫出 README 那個「平移 + matmul 累加」的版本，標出每個矩陣的形狀，然後問自己：一個 128×512 的 PSUM tile 對應到輸出的哪一塊，需要讀多少輸入？

## Written 3：把中間結果留在晶片上

Written 3 的標題頁寫著 **Improving locality on Specialized Hardware**。計分題與練習題混在一起，以下依 PDF 順序列出，只講每題在練什麼。

### 計分題

**Problem 1（30 分，依正確性計分）：line buffer 做兩段式模糊。** 從一段 C 程式出發：先對每列做 1D 水平模糊寫進 `tmp_buf`，再對每行做垂直模糊。先算它的 arithmetic intensity，再給定 1 TB/s 頻寬、1 TFLOPS 算力的處理器求峰值效能。接著引入一種叫 `LINEBUFF` 的晶片內儲存模組：可以逐像素 enqueue、整列 dequeue，滿了或不夠時會讓呼叫的執行緒 stall。你要讓水平與垂直兩段在兩條執行緒上同時跑、透過 line buffer 溝通，並選出「讓 arithmetic intensity 最大、且穩定狀態下兩條執行緒都能持續前進」的最小列數。最後重算 intensity 與雙核處理器上的峰值效能。

這題和 [L13 的 Halide 例子](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization)用的是同一段兩段式模糊程式，一個從硬體角度、一個從排程語言角度，都在消掉 `tmp_buf` 的來回搬移。

**Problem 2（35 分，依正確性計分）：Two Box Blurs are Better Than One。** 兩次背靠背的 `FILTER_SIZE × FILTER_SIZE` convolution。先算不融合時的 arithmetic intensity，再看一個把兩次 convolution 融合、每次產生 `CHUNK_SIZE × CHUNK_SIZE` 輸出塊的版本：`temp` 要配多大？`CHUNK_SIZE = 8`、`FILTER_SIZE = 5` 時每個輸出像素要做多少運算？如果原本已經是 compute-bound，這個轉換會變快還是變慢？最後一問是：就算效能沒什麼變，為什麼在能源受限的環境裡這個轉換仍然有用？

這題逼你面對一個取捨：融合省下記憶體流量，但分塊邊緣要**重算**一部分中間值。

**Problem 3（30 分，只看努力程度）：Designing Hardware for Softmax。** 在一種以 `LOAD_TILE`、`STORE_TILE`、`BUFFER` 描述的 AI 加速器程式上，分析 softmax 的 exp 與 rowsum 兩段：先算 EXP 迴圈的 arithmetic intensity，再給定 10 MB/s 頻寬、10 MFLOPS 算力求 N=1000 的執行時間；然後不用 metapipelining、只靠一般迴圈改寫提升效能；最後改用 metapipelining 再算一次。這裡的 metapipelining 就是 [L12](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping) 講 SambaNova 資料流架構時介紹的概念。

**Problem 4（30 分，依正確性計分）：An Interesting CUDA Program。** 一個「有點像指數函數但不完全是」的 CUDA kernel，每條 thread 迴圈次數取決於輸入（1 到 8 之間，每 8 個值至少一個是 8）。問每個 warp 要幾個 cycle、在 32 GB/s 頻寬下是 memory-bound 還是 compute-bound、在延遲 75 cycle 時最少要幾個 warp 的執行 context 才能完全不 stall。這是 [L7 GPU 架構](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda)的 divergence 與延遲隱藏的綜合練習。

**Problem 5（18 分，只看努力程度）：Data-Parallel Grid Solver。** 回到 [L4](/posts/ai/2026-09-30-cs149-parallelizing-thought-process) 的紅黑格 grid solver，先算 arithmetic intensity，再把它寫成資料流架構（題目點名 SambaNova SN40L）上的 tile 程式，分別用一般的循序 `LOOP` 與 `METAPIPE` 計算一次迭代的時間。提示是：pipeline 的整體吞吐量受什麼限制？

### 練習題（不計分）

- **Practice 1：An Exercise in Data-Parallel Thinking。** 只用 bulk launch 和 `exclusive_scan`，算出一個 flags 陣列所描述的最長 segment 長度；滿分解要求 lg2(num_segs) 的 span。對應 [L8 資料平行思維](/posts/ai/2026-09-30-cs149-data-parallel-thinking)。
- **Practice 2：Async Message Ping Pong。** 用非同步 send/recv API，讓執行緒 A 送出 COUNT 個亂數給 B、B 全部送回、A 驗證後印 DONE。網路延遲高、可能亂序送達，要讓網路傳輸平行度最大。
- **Practice 3：PKPU2.0。** 一顆虛構 GPU（16 核、1 GHz、32 寬 warp），算峰值吞吐量、判斷 divergence、算 arithmetic intensity、判斷能否藏住延遲，最後在四種硬體升級中選一個。
- **Practice 4：Fusion, Fusion, Fusion。** 一串數學函式庫呼叫，在兩台頻寬與 SIMD 寬度不同的電腦間做選擇；允許你改寫程式（包含融合），但不能改變數學運算本身。
- **Practice 5：Paparazzi Camera。** 設計異質多核相機晶片：固定功能核心與通用核心怎麼配、為什麼 Amdahl's Law 的 6 倍上限在這裡不成立、怎麼改虛擬碼讓能源效率約翻倍。

整份 Written 3 反覆出現同一個問題：**這個中間結果有沒有必要寫回記憶體？** 這和 PA4 Part 2 的「融合、不落地到 HBM」是同一個問題的不同版本。

## 校外能做到哪

依 [cloud_readme](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md) 的內容，官方環境是：

- 在 AWS 的 Asia Pacific（Melbourne，`ap-southeast-4`）區域開 `trn2.3xlarge`，這個區域預設沒開，要先手動啟用。
- 從 EC2 的 **Private images** 選課程提供的 Ubuntu AMI——README 寫「All students in CS149 should have access」，校外帳號看不到。
- **必須購買 capacity block** 才能啟動 instance。README 寫明截至 2025 年 10 月 31 日，預付價是每小時 $2.25，7 天約 $300；只能以天為單位購買、最長 14 天，買了之後用不用都算錢。
- 修課學生有課程發的 AWS credits，README 另說明額外加了 $400。
- profiling 要把 3001 與 8086 port 轉發到本機，才能在瀏覽器看 `neuron-profile` 的 GUI。

所以校外讀者的選項是：

1. **只讀**：README 本身就是一份很好的 Trainium／NKI 入門，搭配 `kernels.py`、`conv2d_numpy.py` 理解題目與演算法。
2. **自費自建**：自己買 Trainium2 capacity block、自己裝 Neuron SDK 與 NKI。課程的 private AMI 與 `install.sh` 環境無法完整重現，數字也不能和官方參考值直接比。
3. **用 NKI 的 CPU 模擬**：README 提到 test harness 的 `--simulate` 旗標會呼叫 `nki.simulate_kernel()`，也警告模擬與實機可能有差異。README 沒有說這能脫離課程環境單獨使用，本文也沒有驗證。

## 延伸閱讀

- 同樣是「自己管理晶片內記憶體、分塊餵給矩陣單元」，Google TPU 的寫法可以對照站上的 [CMU 11-868 TPU、JAX 與 Pallas 導讀](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas)。
- 想看 GPU 上的對應版本（Triton kernel），可以讀 [CS336 Kernels 與 Triton 導讀](/posts/ai/2026-08-22-cs336-kernels-triton)。

系列導覽：上一篇 [L11 專用硬體的程式系統](/posts/ai/2026-09-30-cs149-programming-specialized-hardware)｜下一篇 [L12 把 AI 應用映射到資料中心](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [Assignment 4 GitHub repo：asst4-trainium2（README）](https://github.com/stanford-cs149/asst4-trainium2)
- [Assignment 4 AWS 環境設定：cloud_readme.md](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md)
- [Written Assignment 3 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf)
- [Lecture 11 投影片第 10 頁：systolic array（README 引用）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/slide_10)
- [Lecture 9 投影片第 57 頁：convolution 層實作（README 引用）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dnninference/slide_57)
- [AWS Neuron 文件：NeuronCore-v3 架構](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html)
- [AWS Neuron 文件：NKI 程式模型](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/programming_model.html)
- [AWS 文件：EC2 Capacity Blocks 購買說明](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html)
