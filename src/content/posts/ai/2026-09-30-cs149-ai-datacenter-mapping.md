---
title: "CS149 L12：從一顆晶片到整座資料中心——資料流硬體、kernel 融合、平行策略與記憶體瓶頸"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, distributed-training, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 16
tldr: "L12 的主軸是「搬資料」。前段用 SambaNova SN40L 說明資料流架構與 metapipelining：同樣跑 Llama 3.1 8B，投影片說 RDU 每個 token 約 3 次 kernel 呼叫，GPU 約 800 次，差別來自能不能把整個 decoder 融合進一個 kernel。中段把尺度拉到資料中心：TP、PP、EP、DP 各自需要哪種集體通訊，以及計算與通訊重疊為什麼決定擴展效率。後段回到能源與 DRAM：搬一個 byte 比算一次貴得多，記憶體控制器、burst mode、HBM 都是在解同一個問題。這講沒有公開錄影，本文只依投影片。"
description: "Stanford CS149（Fall 2025）第 12 講 Mapping AI Applications to the AI Datacenter 導讀：HBM 記憶體入門、SambaNova SN40L 資料流架構與 metapipelining、Llama 3.1 8B 的 kernel 融合、scale-up/scale-out 與集體通訊、張量/管線/專家/資料平行、計算通訊重疊、資料搬移的能源成本與 DRAM 運作原理。"
draft: false
glossary:
  - term: "metapipelining"
    aliases: ["meta-pipelining", "元管線"]
    definition: "階層式的粗粒度管線，也就是「管線的管線」：把一個平行迴圈的迴圈體切成幾個 stage，各 stage 同時執行不同迭代，stage 之間用 double buffer 傳遞中間資料。"
    context: "CS149 L12 用 SambaNova SN40L 的 METAPIPE 程式說明；Written 3 也有相關計算題。"
  - term: "RDU"
    aliases: ["Reconfigurable Dataflow Unit", "SN40L"]
    definition: "SambaNova 的可重組資料流處理器；由 PCU（計算）、PMU（記憶體）與交換器組成，把計算圖鋪在晶片空間上執行，而不是逐條執行指令。"
    context: "CS149 L12 拿 SN40L RDU 與 H100 比較 kernel 融合程度。"
  - term: "all-to-all"
    aliases: ["All-to-All"]
    definition: "集體通訊原語：每個節點把自己資料的第 i 份送給第 i 個節點，結果等於跨節點做一次轉置。"
    context: "CS149 L12 的表格把它對應到 expert parallelism。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 16 篇，對應 10 月 30 日的第 12 講 [Mapping AI Applications to the Datacenter Computer](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aidatacenter/)，官方投影片 [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/aidatacenter/12_AI_DatacenterMapping.pdf) 共 72 頁。

**這一講沒有任何公開錄影。** Fall 2025 錄影只在 Canvas，而課程首頁指向的 2023 年公開錄影裡沒有這個主題。本文只依投影片撰寫；投影片上有一些只有圖、沒有文字的頁面（例如 Nvidia HBM roadmap、Transformer 架構圖），講者在課堂上怎麼解釋，我們無從得知，本文不替它補話。

先說一件讀投影片時會注意到的事：講題是「映射到資料中心」，但 72 頁裡真正講資料中心規模的大約是第 28–44 頁。前面是記憶體入門與資料流硬體，後面是能源與 DRAM。把三段串起來的主題是**資料搬移**——從晶片內、晶片間到整座叢集，瓶頸都是資料送不送得過來。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。2026-10-10 已即時重查：官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的播放清單，而該清單沒有對應本文範圍的影片。查核日期：2026-10-10。

課程與錄影入口：

- [CS149 2023 公開錄影播放清單（無本講對應影片）](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aidatacenter/)

## 第一段：HBM 與資料流硬體（第 3–27 頁）

### 為什麼 GPU 用 HBM

第 4 頁一張圖就講完差別：CPU 接 DRAM 用 64 位元的記憶體匯流排，GPU 接 HBM 用 1024 位元。第 5 頁說明做法是把 DRAM 晶片 3D 堆疊，用穿過晶片的 TSV（through-silicon via）連接，底層「logic layer」當記憶體控制器，再用矽中介層（interposer）接到處理器。第 7 頁列出演進：

| GPU | 年份 | 介面 | 峰值頻寬 |
|---|---|---|---|
| AMD Radeon Fury | 2015 | 4 顆 HBM × 1024 bit | 512 GB/s |
| NVIDIA P100 | 2016 | 4 顆 HBM2 × 1024 bit | 720 GB/s |
| NVIDIA H100 | 2022 | 6 疊 HBM3 × 1024 bit | 3.2 TB/s |

（同一組投影片在第 68–70 頁講 DRAM 時又出現一次。）

### 資料流架構：用空間換掉指令

第 9 頁問：能不能保留非同步執行的好處，但用比較簡單的程式模型？提示是「從資料的角度看」。

第 10–11 頁的論點是：AI 模型本來就是資料流圖（GEMM、pooling、softmax、sum 串起來）。既然如此，硬體也可以是資料流處理器。投影片引用的是 Plasticine 可重組資料流架構（Prabhakar、Zhang 等人，ISCA 2017），由 **PCU**（Pattern Compute Unit）、**PMU**（Pattern Memory Unit）和交換器組成的網格。

第 12 頁用一張表比較「理想加速器」的各項特徵與資料流架構怎麼達成：分塊 tensor 讓 GEMM 拿到最多 TFLOPS、非同步計算與記憶體存取讓兩者重疊、計算單元之間直接傳資料以實現融合與管線化；最後一列是**串流資料流：沒有指令，所以沒有取指令與解碼的開銷**，也沒有循序的指令執行。

第 13 頁是 SambaNova SN40L RDU 的規格：1,040 個 PCU 與 PMU、638 TFLOPS（bf16）、520 MB 晶片內 SRAM、64 GB HBM、1.5 TB DDR。每個 PCU 有 systolic 與 SIMD 計算（16 × 8 bf16），每個 PMU 有 0.5 MB。

### 用平行模式寫程式，再用 metapipelining 排程

第 14 頁說明程式怎麼寫：用 Map、Zip、Reduce、Gather、Scatter、MM 這類可組合的平行模式描述計算（投影片的例子是簡化版 softmax），再經過 tiling、平行化、metapipelining、place & route、產生程式碼，最後在空間與時間上排程。

第 16 頁定義 **metapipelining**：

- 階層式粗粒度管線，「管線的管線」，利用巢狀迴圈的平行性
- 把平行模式（迴圈）轉成串流管線：在迴圈體中插入 stage，stage 平行執行，重疊多次迴圈迭代
- stage 之間的中間資料放 double buffer，用來吸收各 stage 執行時間不平衡
- 和 tiling 搭配良好；buffer 可以用來改變存取模式（例如轉置）；**融合做不到的時候 metapipelining 仍然可行**

第 18–20 頁給了一個 matmul 的 `METAPIPE` 程式：外層沿 M 方向逐塊載入 A 的 tile，內層沿 N 方向逐塊載入 B 的 tile、做 `MAT_MUL`、存回 C，並畫出這些 stage 分別對應到哪些 AGCU、PMU、PCU。第 21 頁把 FlashAttention 的 QKᵀ、mask、softmax、dropout、×V 鋪成 metapipeline。

### 同一個模型，3 次 vs 800 次 kernel 呼叫

第 22–25 頁是這一講最具體的例子：Llama 3.1 8B 的推論。

- 第 23 頁：用 TensorRT-LLM 在 GPU 上跑，每個 decoder 被切成約十個 kernel（K1–K10），投影片標註「kernel 融合程度低、資料 locality 低、啟動與同步開銷高」。
- 第 24 頁：RDU 把**整個 decoder 融合成一個 kernel**。投影片把這歸功於 SRAM 容量差距——SN40L 520 MB 對 H100 100 MB，約 5 倍——說資料流融合消除了 GB 級的晶片外中間結果流量。
- 第 25 頁：再進一步，一次 kernel 呼叫跑完所有 decoder。投影片給的數字是 **RDU 每個 token 3 次呼叫，GPU 約 800 次，少了 100 倍以上**。它也點出推論的瓶頸：**HBM 頻寬限制推論效能**，所以目標是讓權重載入與計算完全重疊，讓 HBM 一直忙著。

第 27 頁總結前半：專用硬體有大量 systolic 矩陣乘單元、可設定的資料路徑直接在計算單元間傳中間值、大量晶片內儲存。H100 用非同步計算與記憶體機制，程式設計很複雜，需要 ThunderKittens 等 DSL 來管理；SN40L 用資料流加 metapipelining，程式模型較簡單，但要靠精密的編譯器。**要高效能，就要把同步開銷壓到最低。**

要注意，這一段 RDU 與 GPU 的比較數字都出自投影片本身，投影片上沒有列出測量條件；本文照投影片轉述，沒有另外查證。

## 第二段：資料中心規模（第 28–44 頁）

### 為什麼需要整座資料中心

第 28 頁引用 Epoch AI 的圖，把 2014 年以來「有效算力」的成長拆成演算法進步與算力擴張兩部分。第 29 頁的標題是「All the TFLOPS are in the Tensor Cores」，第 30 頁用 Epoch AI 的圖顯示訓練用硬體數量隨年份上升（圖上標出 GPT-4、Gemini 1.0 Ultra、Llama 3.1-405B 等模型）。

第 31 頁區分 **scale up**（節點內）與 **scale out**（節點間）。第 32 頁是 NVIDIA DGX SuperPOD 的模組化架構：140 台 DGX A100（共 1,120 顆 GPU）組成一個 GPU POD，每台有 2 顆 AMD EPYC 7742 與 8 顆 A100，節點內 NVLink 3.0 全連接；節點間用 200 Gb/s HDR InfiniBand 的 fat-tree 網路，計算與儲存分開兩套網路。

### 集體通訊原語

第 33–34 頁定義幾個會一直用到的通訊原語（rank 指一個加速器節點）：

- **AllReduce**：每個節點最後都拿到所有節點資料的總和。投影片畫出 AllReduce = ReduceScatter + AllGather。
- **ReduceScatter**：加總後，每個節點只拿到其中一份。
- **AllGather**：每個節點把自己那份廣播給所有人。
- **All-to-All**：rank i 把自己資料的第 j 份送給 rank j，結果像是跨節點做了一次轉置。

### 平行性在哪裡，要付什麼通訊

第 36 頁把模型的張量畫成立方體，標出每個維度可以切的平行方式：pipeline parallel（沿層）、tensor parallel（沿 hidden 維度）、expert parallel（沿專家）、sequence／context parallel（沿序列）、data parallel（沿 batch）。第 37 頁把它們對到通訊原語：

| 平行方式 | 通訊原語 |
|---|---|
| Tensor Parallel（TP） | ReduceScatter + AllGather，或 AllReduce |
| Pipeline Parallel（PP） | Send-Receive |
| Expert Parallel（EP） | All-to-All |
| Data Parallel（DP） | ReduceScatter + AllGather，或 AllReduce |

這張表是這一講最值得記下來的東西：**選一種平行方式，就等於選了一種通訊模式。**

### 計算與通訊重疊決定擴展效率

第 38 頁用一個分散式矩陣乘當例子：`inputA[M×K] × inputB[K×N]`，BS = 16、M = 24576、K = 131072、N = 8192，沿 K 維度切給 S 顆 RDU。每顆算 `[M×K/S] × [K/S×N]`，得到一份 [M×N] 的部分和，最後做 S 路 reduce-scatter 合起來。

第 40 頁的概念圖說：沒有重疊時（投影片標為 GPU），socket 數越多，通訊時間佔比越大，通訊變成瓶頸，GPU 需要很大的互連頻寬才能維持利用率。第 41 頁在 RDU 上量化：

| RDU 數 | 8 | 16 | 32 |
|---|---|---|---|
| 100% 利用率下的計算時間（ms） | 66.3 | 33.1 | 16.5 |
| 100% 連結利用率下的 reduce-scatter 時間（ms） | 8.6 | 9.7 | 15 |
| 不重疊時的理論峰值利用率 | 88.5% | 77% | 52% |
| 有重疊時實測利用率 | 72% | 75% | 79% |

讀這張表的方式是：計算時間隨節點數線性下降，通訊時間卻不降反升；如果兩者序列執行，32 顆時理論上最多只剩 52%。投影片的結論是靠計算通訊重疊，32 個 socket 仍維持 70% 以上的利用率。第 39 頁補充：在 RDU 上 AllReduce 和 decoder 的計算管線化，不經過 HBM。

### 管線平行與 3D 平行

第 42 頁指出單純的管線平行在訓練時會讓計算資源閒置、整體吞吐量低。第 43 頁的解法是細粒度管線平行：把一個 mini-batch 切成多個 micro-batch，前向與反向計算在 micro-batch 之間管線化。

第 44 頁是一張 1.7B 到 1T 參數模型的設定表（序列長度 2048、詞彙量 51,200），列出每個規模用的 tensor parallel、pipeline parallel、data parallel 大小與 GPU 數，達到的峰值 FLOPS 比例在 41%–49% 之間。例如 1T 參數的設定是 TP 8、PP 64、DP 6、3,072 顆 GPU、49%。投影片沒有在這頁註明表格出處。這頁的重點在底下那行字：**平行度、管線排程、global batch size、micro-batch size，每一個都會影響通訊量、管線泡泡大小與記憶體用量。**

## 第三段：能源與 DRAM（第 45–72 頁）

### 搬資料比算貴

第 45 頁給出降低能耗的兩個想法：用對的處理器做對的事（專用化），以及**少搬資料**。

第 46 頁引用 Bill Dally（NVIDIA）與 Tom Olson（ARM）的概略數字：整數運算約 1 pJ、浮點運算約 20 pJ、從 1 mm 外的小型晶片內 SRAM 讀 64 bits 約 26 pJ、從低功耗行動 DRAM（LPDDR）讀 64 bits 約 1200 pJ。投影片的推論是：為能源最佳化時，**重算常常比存起來再讀回來好**。它也算給你看：從記憶體每秒讀 10 GB 約耗 1.6 瓦，而整個行動 GPU 的功耗預算約 1 瓦。第 47 頁引用另一組數字（Han, ICLR 2016，45 nm）：32 位元浮點運算約 0.9 pJ、晶片內 SRAM 存取約 5 pJ、從 LPDDR 載入 32 bits 約 640 pJ。

這和 [L3](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc) 的「算術是免費的」是同一個結論，只是從效能換成能源的角度。

### DRAM 怎麼運作

第 48–66 頁是一段 DRAM 入門：

- **DRAM 陣列**：每個 bit 是一顆電晶體加一顆電容，每列 2 Kbits，讀取時整列搬到 row buffer。
- **讀一個 byte 的步驟**：precharge（約 10 ns）→ row activation（約 10 ns）→ column selection（約 10 ns）→ 傳上匯流排。如果下一個 byte 在同一列，可以跳過前兩步。
- **延遲不是固定的**：最好情況只要 column access（CAS），最壞情況要 precharge + row activate + column access。
- **資料腳位是最稀缺的資源**：每次存取都要付一次延遲，腳位大部分時間閒著。解法有兩個：**burst mode**（一個命令傳一大段連續資料，攤平延遲）與**多個 bank**（一個 bank 在 precharge／activate 時，另一個 bank 在傳資料）。
- **DIMM**：八顆 DRAM 晶片組成 64 位元匯流排。讀一條 64 byte 的 cache line 時，錯誤的做法是讓同一顆晶片依序送出所有 byte；正確的做法是把實體位址以 byte 粒度交錯到八顆晶片，同時送出 64 bits。
- **記憶體控制器是請求排程器**：目標互相衝突（吞吐量、延遲、能耗），常見策略是 FR-FCFS——優先服務已打開那一列的請求，其他列依 FIFO；也會把小請求合併成大的連續請求，利用 burst mode。
- **多通道**：第 65 頁拿 myth 機器上的 Intel Core i7-7700K 當例子，DDR4-2400 每通道 64 bit × 1.2 GHz × 2 = 19.2 GB/s，兩通道 38.4 GB/s，CAS 約 13 ns。

第 71 頁提到 HBM4 的自訂 logic die，列出可能放上去的東西，包含 SRAM cache 與 KV cache 壓縮。

### 總結

第 72 頁把記憶體瓶頸的解法分成兩類：

- **應用程式設計師**：排程計算以最大化 locality，減少必要的資料搬移
- **新硬體架構**：聰明的 DRAM 請求排程、讓資料更靠近處理器（深層 cache、3D 堆疊）、更寬的記憶體系統、在記憶體內或附近做有限的計算、硬體加速壓縮

一般原則是三句：資料儲存放在處理器附近、把計算移到資料那裡、用額外的計算換更少的資料傳輸。

## 這一講留給你的三個問題

1. **你的 kernel 呼叫次數是多少？** 投影片的 3 對 800 是極端例子，但你可以用 profiler 數一數自己的推論程式每個 token 啟動幾個 kernel。
2. **你選的平行方式要付哪種通訊？** 看第 37 頁那張表。
3. **通訊能不能和計算重疊？** 看第 41 頁那張表：不能重疊時，加節點可能反而讓利用率掉下來。

**今晚可以做的事**：拿你手上任何一個模型的訓練或推論設定，寫下它用了哪幾種平行（TP／PP／DP／EP），逐一對到第 37 頁的通訊原語，再估計每一步要傳多少資料。

## 延伸閱讀

這一講是一個總覽。每個主題站上都有更深入的導讀，本系列保留完整內容，下面只當延伸：

- 平行策略的機制與取捨：[CS336 平行化機制](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[CS336 平行化策略](/posts/ai/2026-08-22-cs336-parallelism-strategies)
- 模型平行與 MoE 的 all-to-all：[CMU 11-868 模型平行與 MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)
- 大規模推論服務：[CMU 11-868 LLM serving：SGLang 與 vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)、[CMU 11-868 規模化服務與 KV cache](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)
- LLM 系統的整體圖像：[CME295 LLM 系統](/posts/ai/2026-09-29-cme295-llm-systems)

系列導覽：上一篇 [PA4 + Written 3：Trainium2 與 NKI](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki)｜下一篇 [L13 領域專用語言與 AI 驅動的效能最佳化](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。重查官方來源，確認仍無對應本文範圍的公開錄影，補上查核日期。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 12 講義頁（逐頁投影片）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aidatacenter/)
- [Lecture 12 投影片 PDF：Mapping AI Applications to the AI Datacenter](https://gfxcourses.stanford.edu/cs149/fall25content/media/aidatacenter/12_AI_DatacenterMapping.pdf)
- [CS149 2023 公開錄影播放清單（無本講對應影片）](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Prabhakar et al., Plasticine: A Reconfigurable Architecture for Parallel Patterns (ISCA 2017)](https://dl.acm.org/doi/10.1145/3079856.3080256)
