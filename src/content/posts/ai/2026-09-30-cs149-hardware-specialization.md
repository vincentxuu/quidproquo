---
title: "CS149 L10：通用處理器為什麼浪費能量——硬體專用化、Tensor Core、TPU 脈動陣列與資料流架構"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, gpu, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 13
tldr: "L10 從一條式子出發：功耗固定時，效能只能靠「每個運算花多少焦耳」來換，而通用處理器把大部分能量花在取指令、解碼、搬資料，不是在算。投影片的經驗法則是 GPU 比 CPU 好約 10 倍 perf/watt，固定功能 ASIC 可達 100–1000 倍。接著用同一套標準（分塊 tensor、非同步計算與記憶體、運算單元直接互傳）檢視 H100 的 Tensor Core 與 TMA、Google TPU 的脈動陣列，以及可重組資料流架構。"
description: "Stanford CS149（Fall 2025）第 10 講導讀：能量受限的運算、指令處理的額外成本、DSP／FPGA／ASIC 的效率與可程式性光譜、理想 AI 加速器的特徵、資料搬移的能量成本、複雜指令攤提控制成本、BF16／FP8 格式、A100／H100／B100 Tensor Core 與 TMA、TPU 脈動陣列、Hardware Lottery，以及 Plasticine 可重組資料流架構。"
draft: false
glossary:
  - term: "ASIC"
    aliases: ["application-specific integrated circuit", "特定應用積體電路", "固定功能硬體"]
    definition: "為單一用途設計的晶片，電路直接實作演算法，不需要取指令與解碼，因此能效最高，但不能再改程式，設計與驗證成本很高。"
    context: "CS149 L10 的經驗法則：在計算受限、非浮點的工作上，ASIC 相對 CPU 可達 100–1000 倍以上的 perf/watt。"
  - term: "Tensor Core"
    aliases: ["tensor cores", "張量核心"]
    definition: "NVIDIA GPU 上專做小矩陣乘加（例如 A100 的 8×4 × 4×8）的運算單元。一道指令做完一整塊矩陣乘加，把取指令與控制的成本攤到很多運算上。"
    context: "L10 投影片的標題之一是「所有的 TFLOPS 都在 Tensor Core 裡」。"
  - term: "systolic array"
    aliases: ["脈動陣列", "心縮陣列"]
    definition: "排成網格的處理單元（PE），資料像波一樣逐格流過相鄰的 PE，每格做一次乘加並把結果傳給鄰居。資料重用高、只做鄰近通訊、控制分散，因此面積與能量效率高。"
    context: "L10 用 Google TPU v1 的 y = Wx 逐步動畫說明。"
  - term: "TMA"
    aliases: ["Tensor Memory Accelerator"]
    definition: "H100 起的專用資料搬移單元。一條執行緒發出一個描述 tensor 區塊的 copy descriptor，硬體負責產生位址、非同步把整塊資料從 global memory 搬進 shared memory，完成時通知 barrier。"
    context: "L10 與 L11 都把它當成 GPU 為 AI 專用化的例子。"
  - term: "dataflow architecture"
    aliases: ["資料流架構", "reconfigurable dataflow architecture", "RDA", "可重組資料流架構"]
    definition: "不靠循序的指令流驅動，而是把計算圖直接鋪在晶片上的運算與記憶單元之間，資料一到就開始算，單元之間直接傳中間結果。"
    context: "L10 以 Plasticine（ISCA 2017）說明，L11 以 SambaNova SN40L 說明怎麼為它寫程式。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-hardware-specialization-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 13 篇，對應 10 月 23 日的第 10 講 [Hardware Specialization](https://gfxcourses.stanford.edu/cs149/fall25/lecture/accelerators/)，官方投影片 [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/accelerators/10_Specialized.pdf) 共 71 頁。

Fall 2025 的錄影只放在 Stanford Canvas。最接近的公開錄影是 [2023 Lecture 18: Hardware Specialization](https://www.youtube.com/watch?v=2tAb3EgyjNw)，但只能當前半段的補充。對照 [2023 年課站上的同主題投影片](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/)：能量受限、H.264、FFT、DSP、Anton、FPGA、效率經驗法則這些開場內容 2023 版都有；2023 版後半講的是 Spatial 加速器設計語言、串流執行與 DRAM 運作（錄影字幕裡只有 Spatial 與串流執行，DRAM 部分講者說沒時間講），2025 版則換成 GPU Tensor Core、TPU 脈動陣列與資料流架構。本文以 2025 投影片為準。整門課的公開程度是 A3（足以自學），缺口列在[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)。

[上一篇](/posts/ai/2026-09-30-cs149-dnn-on-gpus)結尾留了一個問題：GPU 跑 DNN 很好，但它真的是最理想的平台嗎？這一講回答它。本篇也負責建立加速器的名詞（Tensor Core、脈動陣列、TMA、資料流架構），[下一篇](/posts/ai/2026-09-30-cs149-programming-specialized-hardware)直接引用。

## 課程影片來源

本文以 Fall 2025 教材為準。官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的 YouTube 播放清單；下列 Fall 2023 錄影是主題相近的相關補充影片，內容可能與 2025 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=2tAb3EgyjNw
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 18 - Hardware Specialization
```

原始影片：[Stanford CS149 I Parallel Computing I 2023 I Lecture 18 - Hardware Specialization](https://www.youtube.com/watch?v=2tAb3EgyjNw)

課程與錄影入口：

- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/accelerators/)

內容核對：已依字幕核對（2026-10-10）：讀了 Fall 2023 錄影《Lecture 18 - Hardware Specialization》（1:11:48）。字幕涵蓋能量受限的運算、H.264 編碼與 SIMD 的能耗、FFT／DSP／ASIC 與 Anton、行動裝置的能耗限制、TPU 與 FPGA（字幕寫成 field programmable gator rays，只簡短帶到），後半主要在講 Spatial 加速器設計語言與串流執行；DRAM 的運作講者說沒時間講。BF16／FP8、A100／H100／B100 的 Tensor Core、脈動陣列、Plasticine、Hardware Lottery 在字幕中沒有，所以影片只能當本文前半（能量與專用化動機）的補充，與文中說明一致。 核對的是影片主題與本文主題的關係；本文內容以 Fall 2025 投影片為準，沒有逐段比對兩版。

## 為什麼要專用化：能量

投影片第 2–4 頁先把問題換成能量。手機受電池與無風扇散熱限制；超級電腦與資料中心因為規模太大（數十萬顆 CPU 和 GPU），受供電與冷卻限制；而 AI 的需求在指數成長。

第 5 頁的式子是整講的主軸：

**功耗 = (運算數 / 秒) × (焦耳 / 運算)**

功耗是固定的上限，要更快就只能讓每個運算花的能量更少。投影片的結論是：**更好的能量效率 ⇒ 專用化（固定功能）**，並問：專用化能帶來多大的改善？

## 通用處理器把能量花在哪

第 7 頁先回應學生的疑問：整門課都在教怎麼用好多核 CPU 和 GPU，現在又說它們「沒效率」？

第 8 頁列出現代處理器執行一道指令要做的事：讀指令（位址轉換、存取指令快取）、解碼（轉成 micro-op）、檢查相依與管線危障、找可用的執行單元、從暫存器檔讀資料、搬到執行單元、**做運算**、搬回暫存器檔、寫回。真正在算的只是其中一步。投影片附了複習題：SIMD 如何降低某些計算的額外成本？這些計算要有什麼性質？

兩個實測例子：

- **H.264 影片編碼**（第 9 頁，[Hameed et al., ISCA 2010](https://doi.org/10.1145/1815961.1815968)）：即使用 SIMD 指令實作，功能單元消耗的能量仍只占一小部分，其餘花在取指令、暫存器、管線控制與資料快取。
- **FFT**（第 10 頁，[Chung et al., MICRO 2010](https://doi.org/10.1109/MICRO.2010.36)）：ASIC 以約 1/1000 的晶片面積、約 1/100 的功耗，達到一顆 CPU 核心的效能；GPU 核心的面積效率約是 CPU 核心的 5–7 倍。

## 專用化的光譜

第 11–17 頁依序介紹幾種比 CPU 更專用的選擇：

- **DSP**（第 11 頁）：仍可程式，但指令流控制比較簡單，用複雜指令（SIMD、VLIW）一次做很多運算來攤提控制成本。例子是 Qualcomm Hexagon DSP，用在 Snapdragon 的數據機、音訊與影像處理，FFT 最內層迴圈每個時脈做 29 個「RISC」運算。VLIW（very long instruction word）是一道指令指定多個**不同**的運算，和 SIMD 的「同一運算、多筆資料」相對。
- **Anton**（第 12 頁）：D. E. Shaw Research 為分子動力學打造的超級電腦。Anton 1（2008）有 512 顆計算粒子交互作用的 ASIC，加上專做 FFT 的子系統與為 N-body 通訊模式設計的低延遲網路。投影片說 Anton 3（2025）約比同期 GPU 快 20 倍。
- **TPU**（第 13 頁）：Google 為深度學習設計的處理器，之後在頂尖計算機結構會議上出現了大量 DNN 加速器論文。
- **FPGA**（第 14–17 頁）：介於 ASIC 與處理器之間。晶片提供一整片邏輯區塊與互連，由程式設計師定義的邏輯直接實作在上面。基本單元是可程式的查表（LUT），例如 Xilinx Virtex-7 的 6 輸入 LUT 就是一張 64 格的表；8 個 LUT6 串起來可以做 40 輸入的 AND。現代 FPGA 有很多面積做成固定的 SRAM、乘法器（DSP block）甚至 ARM／RISC-V CPU，用 Verilog 這類硬體描述語言寫；AWS 的 EC2 F1／F2 也提供雲端 FPGA。

第 18 頁的經驗法則，和高品質 C 程式在 CPU 上比：

| 平台 | perf/watt 改善 | 前提 |
|---|---|---|
| 吞吐量導向處理器（GPU 核心） | 約 10 倍 | 程式能很好地映射到寬資料平行執行，而且受算力限制 |
| 固定功能 ASIC | 可達 100–1000 倍以上 | 受算力限制，而且不是浮點運算 |

第 19 頁（投影片註明版面設計來自 Pat Hanrahan）把這些排成一條光譜：從 CPU、GPU、可程式 DSP、領域專用加速器、FPGA 到 ASIC，效率越來越高，可程式性越來越差。CPU 最容易寫；領域專用加速器只能在有限領域內靠 DSL（例如 DNN）寫程式；FPGA 很難寫，讓它變好寫是活躍的研究領域；ASIC 不能寫程式，設計、驗證與製造要花上數千萬到數億美元。

## 理想的 AI 加速器長什麼樣

第 21–22 頁重提上一講的問題：GPU 有高 FLOPS 與 cuDNN，但既然 AI 的主要運算是矩陣乘，還需要一顆通用處理器嗎？

第 23 頁列出理想 AI 加速器的特徵：高峰值 TFLOPS 與能效、高記憶體頻寬、容易寫出高效能程式，而且在受算力限制與受頻寬限制的模型上都能碰到效能上限。

第 24–28 頁逐步建出一張「理想特徵表」。背景有兩個：非同步執行（後面的載入、運算、儲存不必等前面的做完），以及 AI 模型本身就是一張資料流圖（第 25 頁：GEMM → Pool → GEMM → SoftMax → Sum）。第 26 頁點出關鍵：**GEMM 的計算很便宜，資料搬移很貴**——貴在晶片面積、瓦數與奈秒。

| 特徵 | 為什麼 |
|---|---|
| 分塊 tensor（例如 16×16、32×32） | GEMM 拿到最大 TFLOPS、指令額外成本低 |
| 非同步計算 | 計算與記憶體存取重疊 |
| 非同步記憶體存取 | 計算與記憶體存取重疊 |
| 非同步晶片間通訊 | 計算、記憶體與通訊重疊 |
| 運算單元之間直接傳資料 | 融合與管線化、串流資料流 |

最後一列就是上一篇「融合」的硬體版：中間結果根本不離開晶片。

## 兩個關鍵數字：搬資料貴、控制也貴

第 31 頁的「大概數字」（來源標為 Bill Dally 與 Tom Olson），只算邏輯運算本身、不含解碼與讀暫存器：

- 整數運算約 1 pJ，浮點運算約 20 pJ
- 從 1 mm 外的小型晶片上 SRAM 讀 64 位元約 26 pJ
- 從低功耗行動 DRAM（LPDDR）讀 64 位元約 1200 pJ

所以設計系統的經驗法則是：**永遠想辦法減少資料搬移。**

第 32 頁量化了「可程式性」的額外成本（指令流與控制），相對於運算本身：

- 半精度 FMA（乘加）：2000%
- 半精度 DP4（四元素內積）：500%
- 半精度 4×4 MMA（矩陣乘加）：27%

原則是：**一道複雜指令做很多運算，就能把指令處理的成本攤掉。** Tensor Core 就是這個原則的產物。

第 33 頁補上數值格式（投影片註明來自 Bill Dally）：BF16 是 1 位符號、8 位指數、7 位尾數，範圍和 FP32 一樣但精度較低；FP8 有 E4M3（範圍 0–448）與 E5M2（範圍 0–57344）兩種。

## GPU 怎麼往專用化走

### A100 與 H100 的 Tensor Core

第 35 頁的 A100 SM：64 個 fp32 ALU、32 個 int32 ALU、4 個 Tensor Core。Tensor Core 執行 8×4 × 4×8 的矩陣乘加指令 A×B + D，A、B 以 fp16 儲存、以 fp32 累加。整顆 GA100 有 108 個 SM，1.4 GHz 下 fp32 是 19.5 TFLOPS，Tensor Core 的 fp16/32 混合精度是 312 TFLOPS。

第 36–41 頁介紹 H100（2022）：第四代 Tensor Core、TMA、CUDA cluster、最多 80 GB 的 HBM3、TSMC 4nm、800 億顆電晶體。第 38 頁把三種階層對起來：

| CUDA 階層 | 計算階層 | 記憶體 |
|---|---|---|
| Grid | GPU | 80 GB HBM／50 MB L2 |
| Cluster | CPC | 每個 SM 256 KB 共享記憶體 |
| Thread Block | SM | 256 KB 共享記憶體 |
| Thread | SIMD lane | 每條執行緒 1 KB 暫存器、每個 SM 分區 64 KB |

thread block cluster 最多 16 個 thread block，保證每個在不同的 SM 上同時執行。第 41 頁的完整 H100 有 144 個 SM，Tensor Core（投影片標註是脈動陣列式的 MMA）fp16 是 989 TFLOPS，SIMD 單元 fp16 是 134、fp32 是 67 TFLOPS。第 43 頁的標題直接說：**所有的 TFLOPS 都在 Tensor Core 裡。**

### TMA：專門搬資料的單元

第 40 頁的 **TMA（Tensor Memory Accelerator）** 是為資料搬移做的特殊指令：一條執行緒發出一個 copy descriptor，描述要搬的 tensor 區塊；硬體負責產生位址，非同步地把區塊從 global memory 搬進 shared memory，完成時通知 barrier。

### B100：「不是你爸爸的 CUDA」

第 44 頁列出 V100 → A100 → H100 → B100 每一代新增的專用功能（FP8、FP4、Transformer Engine、非同步複製、Tensor Core sparsity、解壓縮引擎等），並問：這對程式設計師意味著什麼？

第 45 頁給了答案的一角。B100 的 Tensor Core 受限於暫存器頻寬，tensor 資料改放在 SMEM 與 TMEM；由單一執行緒發出 MMA，「不再需要 warp」。寫 Tensor Core 程式變成：用 `tcgen05.alloc` 配置 TMEM 與 descriptor、用 TMA（`cp.async.bulk.tensor`，配合 `mbarrier`）預取與串流 tile、用 `tcgen05.mma` 發出非同步 MMA 並 `tcgen05.commit`、用 `tcgen05.fence` 排序與收尾。投影片的標語是 “Not your father’s CUDA”。第 46 頁接著列出為 GPU AI kernel 設計的 DSL，例如 Cute-DSL（Python 版 CUTLASS）與 Mosaic GPU。

### GPU 離理想多遠

第 47 頁把 GPU 放回理想特徵表：分塊 tensor ✅；非同步計算 ✅（`mma_async`）；非同步記憶體存取 ✅（TMA + TMEM）；運算單元之間直接傳資料是 ❓，只有 thread block cluster 部分做到。

## Google TPU 與脈動陣列

第 49 頁列出一整排 AI 加速器：AWS Trainium 2、Google TPU3、Apple Neural Engine、Intel 推論加速器、SambaNova Cardinal SN10、Cerebras Wafer Scale Engine，以及有 Tensor Core 的 Ampere GPU。

第 50–51 頁看 TPU v1（圖出自 [Jouppi et al. 2017](https://arxiv.org/abs/1704.04760)）：算術單元約占晶片 30%，控制電路的面積很小。主要指令只有五個：讀主機記憶體、寫主機記憶體、讀權重、matrix_multiply／convolve、activate。

第 52–58 頁用動畫說明 **脈動陣列（systolic array）**。以 y = Wx 為例：4×4 的處理單元（PE）各自存一個權重，x 的元素從左邊斜著一個時脈一格流進來，每個 PE 做一次乘法，把部分和往下傳給鄰居，最後在底部的 32 位元累加器得到結果。換成矩陣乘 Y = WX 時，X 的多個欄一波接一波流過，投影片提醒需要多組累加器來存輸出的各欄。

第 59 頁的比較表：

| | SIMD | 脈動陣列 |
|---|---|---|
| 資料流 | 由指令驅動 | 由資料驅動（波前） |
| 資料重用 | 有限 | 時間與空間局部性 |
| 通訊 | 全域（暫存器／記憶體） | 局部（相鄰 PE） |
| 控制 | 集中 | 分散 |
| 效率（perf/mm²、perf/W） | 中 | 非常高 |

<details>
<summary>第 60–63 頁：小陣列怎麼算大矩陣</summary>

例子是 A = 8×8、B = 8×4096、C = 8×4096，假設有 4096 個累加器。投影片用四頁動畫把 A 切成小塊依序載入陣列，B 的欄串流通過，部分和累加在 4096 個累加器裡。重點是：陣列大小固定，大矩陣要靠分塊與累加器輪流完成——和上一篇的分塊 GEMM 是同一件事，只是換成硬體排程。

</details>

第 64–65 頁展示 TPU 的 perf/watt 比較與歷代 TPU 的演進。第 66 頁引用 Sara Hooker 的 [Hardware Lottery](https://arxiv.org/abs/2009.06489)：一個研究想法勝出，可能是因為它剛好適合當時主流的軟硬體，而不是因為它普遍比較好。投影片畫出一個循環：TPU 擅長稠密矩陣乘（投影片標注「OI ∝ n」，矩陣越大、每搬一單位資料能做的運算越多），transformer 剛好適合，於是硬體又為矩陣乘更專用化。

## 資料流架構

第 67–69 頁回到「AI 模型是資料流圖」。既然如此，何不讓硬體也是資料流？投影片以 [Plasticine](https://doi.org/10.1145/3079856.3080256)（Prabhakar、Zhang 等人，ISCA 2017）為例：晶片上交錯排著 PCU（pattern compute unit）、PMU（pattern memory unit）與交換器（switch），把 GEMM 加上 map、filter、reduce 這些平行模式直接鋪在晶片上執行。

第 69 頁把它放回理想特徵表，並加了兩條 GPU 沒有的優點：**沒有指令 ⇒ 沒有取指令與解碼的成本**；**極端的非同步：沒有循序的指令執行**。第 70 頁示範 FlashAttention 在資料流架構上怎麼做：QKᵀ、Mask、Softmax、Dropout、×V 各占一組 PCU／PMU，tile 像流水線一樣依序流過，稱為 metapipeline。怎麼替這種硬體寫程式，是[下一篇](/posts/ai/2026-09-30-cs149-programming-specialized-hardware)的主題。

## 收尾：專用硬體的三個共同點

第 71 頁的總結：為 DNN 設計的專用硬體

1. 有大量算術單元；
2. 有客製或可設定的資料路徑，讓中間值直接在處理單元之間傳遞——等於把計算在晶片上**空間性地**鋪開來排程，而且在多種粒度上都這樣做；
3. 有大量晶片上儲存，讓中間結果能快速存取。

## 這一講留給你的名詞表

後面幾篇會直接用到：

| 名詞 | 一句話 |
|---|---|
| ASIC | 固定功能電路，能效最高、不可程式 |
| FPGA | 可重組的邏輯，介於 ASIC 與處理器之間 |
| Tensor Core | GPU 上一道指令做完一塊小矩陣乘加的單元 |
| TMA | GPU 上專門非同步搬 tensor 區塊的單元 |
| 脈動陣列 | 資料在相鄰 PE 間流動的乘加網格，TPU 的核心 |
| 資料流架構 | 把計算圖鋪在晶片上，單元間直接傳資料，沒有指令流 |

**今晚可以做的事**：用第 31 頁的數字估算一次矩陣乘：兩個 4096×4096 的 fp16 矩陣相乘，如果每個輸入都從 DRAM 讀一次，搬資料的能量和做運算的能量各是多少？再想想分塊能省下哪一邊。

延伸閱讀：想看 TPU 與 JAX／Pallas 在 LLM 系統課裡怎麼被使用，讀 [CMU 11-868 TPU、JAX 與 Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas)；想從 LLM 訓練的角度看 GPU 與 TPU，讀 [CS336 GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)。

系列導覽：上一篇 [L9 在 GPU 上高效跑 DNN](/posts/ai/2026-09-30-cs149-dnn-on-gpus)｜下一篇 [L11 專用硬體的程式系統](/posts/ai/2026-09-30-cs149-programming-specialized-hardware)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Fall 2023 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。影片只涵蓋本文前半的動機與 Spatial 設計語言，Tensor Core、脈動陣列、資料流架構不在影片中，已補寫影片實際內容。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 10 講義頁（逐頁投影片）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/accelerators/)
- [Lecture 10 投影片 PDF：Hardware Specialization](https://gfxcourses.stanford.edu/cs149/fall25content/media/accelerators/10_Specialized.pdf)
- [2023 Lecture 18 錄影：Hardware Specialization](https://www.youtube.com/watch?v=2tAb3EgyjNw)
- [2023 硬體專用化講義頁（對照用）](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/)
- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Hameed et al., Understanding Sources of Inefficiency in General-Purpose Chips (ISCA 2010)](https://doi.org/10.1145/1815961.1815968)
- [Chung et al., Single-Chip Heterogeneous Computing (MICRO 2010)](https://doi.org/10.1109/MICRO.2010.36)
- [Jouppi et al., In-Datacenter Performance Analysis of a Tensor Processing Unit (2017)](https://arxiv.org/abs/1704.04760)
- [Sara Hooker, The Hardware Lottery (2020)](https://arxiv.org/abs/2009.06489)
- [Prabhakar et al., Plasticine: A Reconfigurable Architecture for Parallel Patterns (ISCA 2017)](https://doi.org/10.1145/3079856.3080256)
