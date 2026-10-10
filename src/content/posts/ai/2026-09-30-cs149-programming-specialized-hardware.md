---
title: "CS149 L11：怎麼替專用硬體寫程式——ThunderKittens 管住 H100 的非同步，資料流架構用 metapipeline 換掉它"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, gpu, compiler, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 14
tldr: "L11 問的是：硬體為 AI 專用化之後，程式設計師要付出什麼？投影片以 H100 為例：要吃滿 Tensor Core，就得用 16×16 tile、讓 TMA 非同步搬資料、讓 producer 與 consumer warp 管線化，寫起來很複雜，所以有了 ThunderKittens 這類 DSL。另一條路是資料流架構（SambaNova SN40L）：用 map／reduce／zip 等平行模式描述計算，編譯器做分塊、metapipelining 與佈局，投影片說它能把 Llama 3.1 8B 的整個 decoder 融成一個 kernel。"
description: "Stanford CS149（Fall 2025）第 11 講導讀（本講無公開錄影，逐頁依投影片寫）：同步與非同步執行、脈動陣列的 weight／output／input-stationary、H100／B100 的 Tensor Core 與 TMA、為什麼 GPU kernel 值得花力氣、ThunderKittens 的 tile 抽象與 producer-consumer 管線、SambaNova SN40L 可重組資料流、平行模式與 metapipelining，以及整個 decoder 融合成一個 kernel 的案例。"
draft: false
glossary:
  - term: "ThunderKittens"
    aliases: ["TK"]
    definition: "嵌入在 CUDA 裡的 C++ 模板函式庫（投影片稱為 embedded DSL），以 16×16 tile 為基本資料型別，提供非同步原語與 producer-consumer 等 GPU 協調模式，用來寫高效能 AI kernel。"
    context: "CS149 L11 用它示範一個 H100 矩陣乘 kernel 的三個步驟。"
  - term: "metapipelining"
    aliases: ["metapipeline", "元管線"]
    definition: "階層式的粗粒度管線：把一個平行模式（迴圈）的主體切成幾個 stage，各 stage 同時執行、重疊不同迭代，中間資料放在 double buffer；外層迴圈的每個 stage 本身又可以是一條管線，所以是「管線的管線」。"
    context: "L11 用它說明怎麼為 SambaNova 的資料流架構寫矩陣乘與 FlashAttention。"
  - term: "weight-stationary"
    aliases: ["WS", "output-stationary", "input-stationary", "脈動陣列資料流"]
    definition: "脈動陣列的資料流類型：哪種資料固定留在每個 PE 裡。weight-stationary 留權重、output-stationary 留部分和、input-stationary 留輸入，其餘資料流過陣列。"
    context: "L11 第 17 頁的表格，說明各類型要減少的是哪種資料的重新載入或搬移。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-programming-specialized-hardware-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 14 篇，對應 10 月 28 日的第 11 講 [Programming Systems for Specialized Hardware](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/)，官方投影片 [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/proghardware/11_SpecializedHardwareProgramming.pdf) 共 60 頁（投影片封面的標題是 Programming Specialized Hardware for AI）。

**這一講沒有公開錄影可以對照。** Fall 2025 的錄影只放在 Stanford Canvas，官方首頁指向的 2023 播放清單裡也沒有這一講。[2023 年課站的硬體專用化投影片](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/)後半講 Spatial 加速器語言與串流執行模型，觀念上接近本講的資料流那一半，但內容不同，不能當作本講的替代。本文逐頁依 2025 投影片寫，投影片沒寫的不補；有些頁面只有圖或程式截圖、沒有文字，本文就只寫標題。整門課的公開程度是 A3（足以自學），缺口列在[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)。

本篇用到的硬體名詞（Tensor Core、TMA、脈動陣列、資料流架構）都在[上一篇](/posts/ai/2026-09-30-cs149-hardware-specialization)解釋過，這裡只引用。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/)

## 一、場景：同一個 kernel，換新 GPU 反而變慢

第 31 頁用一組數字說明為什麼 GPU kernel 值得花力氣：

- 投影片說 NVIDIA 2025 年單季營收超過 470 億美元。
- AI kernel 常常跑在價值數億美元的 GPU 叢集上，一跑就是好幾個月（大型訓練、大規模 serving）。
- **FlashAttention-2 在 A100 上約用到 70% 的算力，到了 H100 掉到約 35%；花了兩年，FlashAttention-3 才回到約 65%。**
- 寫得差的 kernel，等於浪費價值數十億美元的算力。

第三點是這一講的起點：硬體越專用，舊程式越吃不到新功能。上一篇列過的 H100／B100 新單元（第 27–29、33 頁在本講重提），都要程式設計師主動去用。

## 二、直覺：非同步是必要的，但很難寫

第 2 頁的主題列了三個案例：Google TPU（脈動陣列做稠密矩陣乘）、NVIDIA H100 與 B100（非同步計算與記憶體機制 ⇒ 程式很複雜 ⇒ 用 ThunderKittens DSL 簡化）、SambaNova SN40L（資料流架構，程式模型是分塊加上以 metapipelining 串流）。

第 3 頁重提上一篇的效率光譜，這次加了一句：**可程式性會帶來額外成本，因此降低效率。**

第 4–5 頁對比兩種執行方式。同步：每一組「載入 → 運算 → 儲存」都等前一組做完才開始。非同步：後面的操作在前面的做完之前就開始。投影片註明非同步可以由兩層做到：軟體加硬體（非同步指令加上同步機制），或純硬體（亂序執行）。

所以問題變成：**非同步一定要，那誰來管同步？** 這一講給了兩個答案：

1. 在 GPU 上，交給程式設計師，但用 DSL 把常見模式包起來（ThunderKittens）。
2. 換成資料流硬體，讓資料本身驅動執行，程式設計師只描述資料怎麼流（metapipelining）。

## 三、機制之一：脈動陣列的資料流類型

第 6–26 頁大部分是上一篇 TPU 與脈動陣列的重提。新增的是第 17 頁的表：

| 資料流類型 | 留在每個 PE 裡的 | 流過陣列的 | 主要目標 |
|---|---|---|---|
| Weight-Stationary（WS） | 權重 | 輸入（activation）與部分和 | 減少重新載入權重 |
| Output-Stationary（OS） | 部分和（輸出） | 輸入與權重 | 減少累加結果的搬移 |
| Input-Stationary（IS） | 輸入 activation | 權重與部分和 | 減少重新載入輸入 |

上一篇看到的 TPU y = Wx 動畫，權重存在 PE 裡、x 流過，就是 weight-stationary。選哪一種，看的是哪種資料最貴、重用最多——還是 arithmetic intensity 那套想法。

另外，第 18 頁的 SIMD 與脈動陣列比較表和上一篇幾乎相同，只有效率一列從「中／非常高」改寫成「低／高」。

## 四、機制之二：在 H100 上吃滿 Tensor Core

### 硬體給了什麼

第 28–29 頁整理 GPU 的兩個專用單元：

- **Tensor Core**：專做 MMA 的計算單元。投影片補了兩個名詞：warpgroup 是 128 條連續的執行緒；PTX 是 NVIDIA 的虛擬指令集架構。
- **TMA**：專用的區塊資料搬移單元。第 28 頁對比 A100 的 LDGSTS 與 H100 的 TMA，TMA 可以繞過 L1。第 29 頁說它省掉數千道指令與記憶體定址的額外成本，也省掉資料經過 L1 與暫存器的不必要搬移。

第 30 頁把 GPU 放回理想特徵表（同上一篇）：分塊 tensor、非同步計算、非同步記憶體都 ✅，運算單元之間直接傳資料是 ❓。

### 程式設計師要做什麼

第 35 頁列出讓 H100 Tensor Core 保持在 90% 以上 TFLOPS 的條件：

- 用 16×16 的 fp16 tile，對上 Tensor Core 的計算形狀；
- 確保計算單元永遠不閒著；
- 用非同步讓記憶體存取與計算重疊。

投影片畫出一條 tile 處理管線：tile 從 global memory（HBM/L2）載入 shared memory，再進暫存器給 Tensor Core 算，結果存回去。每一段都要同時在跑。

### ThunderKittens：把這些模式包起來

第 36 頁介紹 [ThunderKittens](https://github.com/HazyResearch/ThunderKittens)（投影片署名 Ben Spector 等人），一個嵌入在 CUDA 裡的模板函式庫。三條設計原則：

1. **16×16 tile 是基本資料型別**：TK 管理布局、提供基本運算。
2. **非同步無所不在**：追求極致效能時，把原語開放給使用者自己管。
3. **高階的 GPU 協調模式**：例如 producer-consumer。

資料型別分四種：暫存器 tile（2D）、暫存器 vector（1D）、共享記憶體 tile、共享記憶體 vector，各自可以指定尺寸與布局。運算有初始化（例如把 vector 清零）、一元運算（`exp`）、二元運算（`mul`）、列／欄運算（`row_sum`）。

第 37 頁把前面的 tile 管線對應到三種角色：**producer** 負責把 tile 從 global memory 載入 shared memory，**consumer** 在暫存器裡用 Tensor Core 算，**finish** 把結果經 shared memory 存回 global memory。

<details>
<summary>第 38–40 頁：TK 矩陣乘的三個步驟（程式細節）</summary>

**步驟 1：定義布局。** A 用 64×64 的 tile、B 用 64×256 的 tile，各自建立 TMA descriptor；C 不需要。輸入區塊在 shared memory 放兩個 A tile 和一個 B tile，結果區塊放兩個 64×256 的 C tile，consumer 的狀態是一個 16×256 的 fp32 暫存器 tile 當累加器。

**步驟 2：定義管線與 producer。** 8 個 consumer warp、4 個 producer warp（預設），4 段輸入管線。producer 呼叫 `warpgroup::decrease_registers<40>()` 讓出暫存器給 consumer；載入時只要一個 warp（其實只要一條執行緒）去叫 TMA 發出 `tma::load_async`，並用 `tma::expect` 告訴 mbarrier 要等多少 bytes。

**步驟 3：計算。** consumer 呼叫 `warpgroup::increase_registers<232>()` 拿更多暫存器，把累加器清零；每一輪用 `warpgroup::mma_AB` 做矩陣乘、`mma_async_wait` 等它完成，再由一條執行緒標記這塊輸入用完了。結尾先存到 shared memory，註解說這樣重新排列後寫回 HBM 比較能合併存取（coalescing）。

第 41 頁是 TK 矩陣乘的效能圖，投影片沒有文字說明。

</details>

值得注意的是這段程式的形狀：暫存器在 producer 與 consumer 之間**手動重新分配**、barrier 要自己設定期待的 bytes、哪條執行緒發 TMA 要自己指定。這就是第 2 頁說的「非同步機制 ⇒ 程式很複雜」。TK 讓它變得寫得出來，但程式設計師仍然在直接管同步。

## 五、機制之三：資料流架構，用 metapipeline 描述計算

第 42 頁問：**能不能用更簡單的程式模型得到非同步？** 提示是「從資料的角度看」。

第 43–46 頁重提上一篇的論證：AI 模型是資料流圖，所以用可重組資料流架構（Plasticine）執行；串流資料流天然帶來 kernel fusion 與粗粒度管線；沒有指令流，就沒有取指令與解碼的成本。

### SambaNova SN40L 的硬體

第 47 頁的 SN40L RDU 規格（投影片數字）：

- 1,040 個 PCU 與 PMU
- 638 TFLOPS（bf16）
- 520 MB 晶片上 SRAM、64 GB HBM、1.5 TB DDR
- PCU：脈動陣列加 SIMD 運算（16×8 bf16）
- PMU：高彈性、高頻寬的位址產生
- 網格交換器（S）：晶片上互連彈性高、頻寬高
- AGCU（address generator and coalescing unit）：通往晶片外記憶體與 I/O 的入口

### 用平行模式寫程式

第 48 頁以簡化版 softmax 為例：先 Map（`exp`），再 Reduce（`+`），再 Zip（`/`）。程式設計師寫的就是這樣一串平行模式；接下來由編譯流程做**分塊 → 平行化 → metapipelining → 佈局與繞線（place & route）→ 產生程式碼**。可以組合的基本運算有 MM、Map、Zip、Reduce、Gather、Scatter；排程在空間與時間上都有彈性，最後變成空間性的執行。

### Metapipelining

第 49 頁的定義：

- **階層式的粗粒度管線**，也就是「管線的管線」，利用巢狀迴圈的平行性。
- 把一個平行模式（迴圈）轉成串流管線：在迴圈主體裡插入 pipe stage，各 stage 平行執行，讓多次迭代重疊。
- stage 之間的中間資料放在 **double buffer**，可以容忍各 stage 執行時間不平均。
- 和分塊搭配得很好；緩衝區還能順便改變存取模式（例如轉置）；**融合做不到的地方，metapipelining 仍然可以。**

第 50 頁用 Gaussian Discriminant Analysis 示範：對每一列，切出該列、減去平均、算外積、累加，形成四段的 metapipeline，每段對應到 AGCU、PCU、PMU。

<details>
<summary>第 51–53 頁：矩陣乘的 metapipeline</summary>

投影片的程式（精簡）：

```cpp
auto MM = 256;  // M 方向的 tile 大小
auto NN = 64;   // N 方向的 tile 大小
METAPIPE(M / MM, [&]() {
  auto a_tile = LOAD_TILE(A, a_tile_shape);          // MM x K
  METAPIPE(N / NN, [&]() {
    auto b_tile = LOAD_TILE(B, b_tile_shape, row_par = 4);  // K x NN
    auto c = MAT_MUL(a_tile, b_tile);
    auto c_tile = BUFFER(c);
    STORE_TILE(C, c_tile);
  });
});
```

外層 metapipeline 每次載入 A 的一條 MM×K，內層每次載入 B 的一條 K×NN、相乘、放進緩衝區、存回 C。第 53 頁畫出映射：載入與儲存經過 AGCU，`a_tile`、`b_tile`、`c_tile` 放在 PMU，矩陣乘攤在四個 PCU 上。

對照 TK 版：這裡沒有 barrier、沒有暫存器重分配，程式只說資料怎麼切、怎麼流。

</details>

第 54 頁把 FlashAttention 寫成 metapipeline：QKᵀ、Mask、Softmax、Dropout、×V 依序排開，tile 一個接一個流過。投影片的註記是：**以 token 控制的資料流執行 ⇒ 不需要以鎖為基礎的同步**；metapipeline 就是串流資料流。

## 六、連回模型：整個 decoder 融成一個 kernel

第 55–59 頁用 Llama 3.1 8B 推論做案例（這部分的數字與比較都出自投影片）。模型是 embedding、32 層 decoder、classifier、sampling；每層 decoder 裡有 Q／K／V 的 GEMM、QKᵀ、scale、mask、softmax、×V、O 的 GEMM、all-reduce、RMS norm、gate／up／down GEMM、SiLU 等一長串運算。

- **GPU 上**（第 56 頁，以 TensorRT-LLM 執行）：融合有限（FlashAttention 是其中一個融合），每層 decoder 仍分成約十個 kernel。投影片列的問題是：融合程度低、資料局部性低、kernel 啟動與同步的額外成本高。
- **RDU 上**（第 57 頁）：激進融合，**一層 decoder 一次 kernel 呼叫**。投影片的理由是晶片上 SRAM：SN40L 有 520 MB，H100 是 100 MB，約 5 倍；資料流融合省掉以 GB 計的晶片外中間結果流量，也沒有額外的 kernel 啟動成本。
- **更進一步**（第 58 頁）：一次 kernel 呼叫跑完所有 decoder。推論效能受 HBM 頻寬限制，所以要讓權重載入與計算完全重疊、讓 HBM 一直忙。投影片的數字是 RDU 每個 token 3 次呼叫、GPU 約 800 次，寫作「100 倍少的 kernel 呼叫」。
- **跨晶片**（第 59 頁）：all-reduce 可以和權重載入、計算完全重疊，而且不占用 HBM 容量或頻寬。

這一段把[第 12 篇](/posts/ai/2026-09-30-cs149-dnn-on-gpus)的「融合」推到極限：L9 在 GPU 上融合兩三個運算；這裡是硬體有足夠的晶片上儲存與直接互連，所以整層、甚至整個模型都不必把中間結果寫回 DRAM。

## 七、想深入：這一講的總結與你的判斷

第 60 頁的總結：

- 為 AI 設計的專用硬體有大型、大量的矩陣乘單元（以脈動陣列實作）；有客製或可設定的資料路徑，讓中間值直接在處理單元之間傳（把計算空間性地鋪在晶片上）；有大量晶片上儲存。
- **H100**：非同步計算與記憶體機制 ⇒ 程式很複雜，需要 ThunderKittens 與其他 DSL 管理複雜度。
- **SN40L**：資料流模型加 metapipelining ⇒ 程式模型比較簡單，但需要精密的編譯器來最佳化並映射到資料流硬體。
- **高效能的前提是把同步的額外成本降到最低。**

投影片最後一頁也放了一張 TPU 超級電腦（1024 顆 TPU v3）的圖，沒有文字說明。

讀這一講時要記得：GPU 與 RDU 的比較、Llama 的呼叫次數與 SRAM 對比，都是投影片提出的案例，本系列沒有獨立重現；也要記得 CS149 的授課者之一 Kunle Olukotun 是 [Plasticine 論文](https://doi.org/10.1145/3079856.3080256)的作者之一，資料流這條路線和授課團隊的研究直接相關。把它當成「一種設計取捨的論證」來讀，比當成產品評比更有收穫。

**帶走的判斷框架**：遇到一個新的 AI 硬體，問三件事——

1. 它的計算形狀是什麼（16×16 tile？脈動陣列多大？），你的運算能不能對上？
2. 非同步由誰管？是你（barrier、暫存器分配），還是編譯器與資料流？
3. 晶片上儲存有多大？夠不夠讓中間結果不回 DRAM？

**今晚可以做的事**：打開 [ThunderKittens 的 GitHub](https://github.com/HazyResearch/ThunderKittens)，找一個 kernel 範例，標出哪些行是 producer、哪些是 consumer、哪些是在設定同步。再試著用第 48 頁的 Map／Reduce／Zip 把同一個運算寫一遍，比較兩者各要你決定哪些事。

延伸閱讀：想在 TPU 上看另一種「用 DSL 管理專用硬體」的做法，讀 [CMU 11-868 TPU、JAX 與 Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas)；想看 Triton 這類更高階的 GPU kernel 語言，讀 [CS336 Kernels 與 Triton](/posts/ai/2026-08-22-cs336-kernels-triton)。下一篇 [PA4](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki) 會讓你在 AWS Trainium2 上親手管理軟體控制的晶片上記憶體。

系列導覽：上一篇 [L10 硬體專用化與 DNN 加速器設計](/posts/ai/2026-09-30-cs149-hardware-specialization)｜下一篇 [PA4 + Written 3：Trainium2 與 NKI](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 11 講義頁（逐頁投影片）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/)
- [Lecture 11 投影片 PDF：Programming Specialized Hardware for AI](https://gfxcourses.stanford.edu/cs149/fall25content/media/proghardware/11_SpecializedHardwareProgramming.pdf)
- [2023 硬體專用化講義頁（僅觀念對照，非本講替代）](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/)
- [ThunderKittens（HazyResearch）](https://github.com/HazyResearch/ThunderKittens)
- [Prabhakar et al., Plasticine: A Reconfigurable Architecture for Parallel Patterns (ISCA 2017)](https://doi.org/10.1145/3079856.3080256)
