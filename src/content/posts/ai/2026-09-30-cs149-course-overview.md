---
title: "Stanford CS149 導讀：Fall 2025 平行計算課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, performance, systems, course-guide]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 0
tldr: "CS149 是 Kayvon Fatahalian 與 Kunle Olukotun 在 Stanford 教的平行計算課，從多核 CPU、SIMD 一路講到 GPU、AI 加速器、資料中心，最後回到 cache coherence 與 lock-free。Fall 2025 的 18 份投影片、5 個程式作業的 starter code 與 README、4 份書面作業 PDF 都能匿名取得，本系列評為 A3（足以自學）。缺口有四個：當期錄影只在 Canvas；PA1 評分用 Stanford myth 機器；PA4 要自費租 AWS Trainium2，而且課程 AMI 是私有的；PA5 的 H100 排隊系統與排行榜要 SUNet ID。公開錄影是 2023 版，本系列只拿它當聽講補充。"
description: "Stanford CS149 Parallel Computing（Fall 2025）系列總覽：依官方課程首頁、course info、18 講投影片、5 個 GitHub 作業、4 份書面作業與 2023 YouTube 播放清單，整理課程定位、先修自查、評分、校外讀者拿得到什麼、2023 錄影怎麼對照，以及兩條閱讀路線。"
draft: false
glossary:
  - term: "A3 足以自學"
    definition: "本站課程地圖的公開程度分級之一：系統化教材加上作業與必要檔案都公開，可以照順序自學。"
    context: "CS149 Fall 2025 評為 A3，但 PA4 的 Trainium 環境實質只到 A2。"
  - term: "myth 機器"
    aliases: ["myth machines"]
    definition: "Stanford 給學生 SSH 登入的共用 Linux 機器；CS149 PA1 以它的四核 Intel CPU 作為評分基準。"
    context: "校外讀者可以在自己的多核 CPU 上做 PA1，但數字不能直接和官方參考值比。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-course-overview-en)

> **本系列依據 [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25) 的 Fall 2025 版。** 2026-09-30 查核時，`cs149.stanford.edu` 仍轉址到 fall25 課站，fall26 網址回 404。這是本系列第 0 篇，也是總覽；後面每一篇都回到這裡查材料與限制。

現在的 AI 工程師幾乎都在跟平行硬體打交道：訓練跑在 GPU 叢集，推論要擠 kernel 效能，連手機都有 NPU。但多數人對「為什麼 GPU 快」「為什麼加了核心卻沒變快」只有模糊印象。[CS149: Parallel Computing](https://gfxcourses.stanford.edu/cs149/fall25) 就是補這一塊的課。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [CS149 2023 YouTube 播放清單（Stanford Online）](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/)

## 這門課教什麼

[課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)開宗明義：從手機、多核 CPU、GPU、AI 加速器到超級電腦，平行處理無所不在；這門課要讓你理解設計平行系統的基本原理與工程取捨，並學會有效使用這些機器的程式技巧。因為寫出好的平行程式需要理解機器的效能特性，**課程同時講硬體和軟體**。

Fall 2025 由 Kayvon Fatahalian 和 Kunle Olukotun 合教，Sep 23 到 Dec 4 共 18 講，Nov 18 晚上期中考，Dec 11 期末考。18 講的主題可以分成五段：

| 段落 | 講次 | 主題 |
|---|---|---|
| Part 1 | L1–L3 | 為什麼要平行、多核處理器、延遲與頻寬、ISPC |
| Part 2 | L4–L6 | 平行化的思考流程、工作分配與排程、locality 與通訊 |
| Part 3 | L7–L8 | GPU 架構與 CUDA、資料平行思維 |
| Part 4 | L9–L13 | 在 GPU 上跑 DNN、硬體專用化、專用硬體的程式系統、AI 資料中心、DSL 與 AI 驅動的效能最佳化 |
| Part 5 | L14–L18 | cache coherence、同步與記憶體一致性、細粒度鎖與 lock-free、transactional memory |

第一講的投影片把課程主軸寫成三個 theme：怎麼設計能 scale 的平行程式、平行硬體怎麼實作、怎麼思考效率。第三個 theme 有一句話值得先記住：**FAST != EFFICIENT**。在 10 個處理器上拿到 2 倍加速，程式確實變快了，但硬體用得好不好是另一回事。

## 先修自查

[Course info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo) 把 CS111 列為「強烈建議」的先修，並列出期待你已經熟悉的概念。拿來當自查表：

- 編譯後的程式是一串機器指令；處理器執行指令，結果是更新暫存器或記憶體裡的狀態
- 為什麼需要記憶體階層，以及它怎麼由暫存器、晶片上 cache、晶片外記憶體、永久儲存組成
- 能讀、寫、除錯 C/C++（class、STL vector 這種程度）
- 至少寫過一次建立 thread 的程式，例如 `std::thread` 或 pthreads

官方特別寫：學生在 CS149 卡住，**最主要的原因是缺乏除錯經驗**，因為平行程式本來就難除錯。作業會用到 CUDA、ISPC 這些新的類 C 語言，課程假設你邊做邊學。

前兩項不熟，可以先讀本站的 [Stanford CS107 導讀](/posts/learning/2026-08-21-stanford-cs107-computer-systems)（機器指令、組合語言、cache 與記憶體階層）；thread、lock、排程不熟，讀 [Stanford CS111 導讀](/posts/learning/2026-08-21-stanford-cs111-operating-systems)。

## 作業、考試與評分

Course info 列的評分：

| 項目 | 比重 |
|---|---|
| 5 個程式作業 | 8% + 12% + 12% + 12% + 12% = 56% |
| 4 份書面作業 | 3% × 4 = 12% |
| 每講參與（課堂小測驗） | 4% |
| 期中考 | 12% |
| 期末考 | 16% |

程式作業可以兩人一組，一人組和兩人組的評分標準相同；書面作業必須三人一組，由助教隨機分組。每人整學期有 8 個 late day，只能用在程式作業，**PA5 不能用**。

五個程式作業依首頁列的截止日：

| 作業 | 截止 | 主題 | 執行環境 |
|---|---|---|---|
| [PA1](https://github.com/stanford-cs149/asst1) | Oct 6 | 在四核 CPU 上分析平行程式效能（threads、SIMD intrinsics、ISPC） | Stanford myth 機器（四核 Intel Core i7） |
| [PA2](https://github.com/stanford-cs149/asst2) | Oct 16 | 在多核 CPU 上排程 task graph | AWS `c7g.4xlarge` |
| [PA3](https://github.com/stanford-cs149/asst3) | Oct 30 | 用 CUDA 寫 circle renderer | AWS 上的 NVIDIA T4 |
| [PA4](https://github.com/stanford-cs149/asst4-trainium2) | Nov 13 | 在 Trainium2 加速器上寫 fused conv + maxpool | AWS `trn2.3xlarge` |
| [PA5](https://github.com/stanford-cs149/asst5-kernels) | Dec 4 | 寫全世界最快的 kernel（開放式） | 課程管理的 H100 job queue |

四份書面作業是 PDF：[Written 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf)、[Written 2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf)、[Written 3](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf)、[Written 4](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)。L1 投影片說這些題目是改編過的舊考題，所以除了練觀念，也是考試題型的練習。每份 PDF 除了計分題，還附了多題標成 PRACTICE PROBLEM 的練習題。**對自學者來說，這四份 PDF 是最接近「考卷」的東西。**

課程沒有指定教科書。Course info 推薦 Hennessy & Patterson 的 *Computer Architecture: A Quantitative Approach* 第六版當架構參考，同時說網路上已經有大量免費的平行程式資源。

## 校外讀者拿得到什麼：A3，但有四個缺口

依本站[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，CS149 Fall 2025 是 **A3（足以自學）**。公開的部分：

- [18 講投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/)：每講都有 PDF，也有逐頁網頁版
- 5 個作業的 GitHub repo：starter code、README、評分方式都在
- 4 份書面作業 PDF

缺口要先講清楚：

1. **Fall 2025 錄影不公開。** Course info 寫錄影透過 Canvas 提供；首頁直接說「We cannot distribute lecture videos to the public this year」，改指向 2023 版的公開影片。
2. **PA1、PA2 的評分機器拿不到。** PA1 README 要求在 myth 機器上跑並回報數字；PA2 以 AWS `c7g.4xlarge` 評分。你可以在自己的多核 CPU 上做，但跑出來的加速比不能直接和官方參考值比。
3. **PA4 實質只到 A2。** [PA4 的 cloud_readme](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md) 要學生從課程提供的 private AMI 開機，還必須購買 `trn2.3xlarge` 的 capacity block：文件寫 2025-10-31 時的預付價格是每小時 $2.25，7 天約 $300。修課生另有 $400 AWS credit，校外讀者沒有。能做的是讀 README 與 starter code，或自費自建 Neuron 環境。
4. **PA5 的排行榜要 SUNet ID。** 送 H100 job queue 要先用 popcorn-cli 以 SUNet ID 註冊。README 也說可以在任何支援 CUDA 的 NVIDIA GPU 上本地開發，用 `eval.py` 測試與 profile；校外讀者只能走這條路，沒有排行榜可比。

另外，PA3 需要 NVIDIA GPU（README 以 T4 為參考）；作業與書面題都沒有公開解答；公告與討論在 Ed，校外看不到。

## 為什麼拿 2023 錄影當補充

課程首頁自己把讀者指到 [2023 版 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)，共 19 支影片。本系列的原則是：

- **內容以 Fall 2025 投影片為準。** 2023 影片只當「聽講補充」，兩者不一致時以 2025 為準，並在各篇標註。
- **理由很單純**：2025 錄影校外看不到，2023 是官方指定的替代品。我比對過 L1、L2 兩講的 2023 與 2025 投影片文字，技術內容大致相同，差異主要在課務與少數新增頁；其餘各講的差異在各篇另外標註。

但兩個學期的課序並不完全對齊。2023 有 Spark（L9）和 Accessing Memory（L19）兩講，Fall 2025 沒有。反過來，Fall 2025 新增的 L11（專用硬體的程式系統）、L12（AI 資料中心）與 L13 的 AI 驅動最佳化部分，2023 沒有對應錄影。這幾篇只能依投影片寫。

| Fall 2025 講次 | 2023 對應錄影 |
|---|---|
| L1 Why Parallelism? Why Efficiency? | [L1](https://www.youtube.com/watch?v=V1tINV2-9p4) |
| L2 A Modern Multi-Core Processor (Part I) | [L2](https://www.youtube.com/watch?v=CKmNpAO5rS4) |
| L3 Multi-Core Architecture (Part II) + ISPC | [L3](https://www.youtube.com/watch?v=F4bVSyz_jxo) |
| L4 Parallelizing Code: An Example Thought Process | [L4 Parallel Programming Basics](https://www.youtube.com/watch?v=0-ztm8SKq70) |
| L5 Work Distribution and Scheduling | [L5](https://www.youtube.com/watch?v=mmO2Ri_dJkk) |
| L6 Locality and Communication | [L6](https://www.youtube.com/watch?v=Mhdny2JNhmc) |
| L7 GPU Architecture and CUDA Programming | [L7](https://www.youtube.com/watch?v=qQTDF0CBoxE) |
| L8 Data-Parallel Thinking | [L8](https://www.youtube.com/watch?v=Ba3TqxSgnTk) |
| L9 Efficiently Evaluating DNNs on GPUs | [L10](https://www.youtube.com/watch?v=qbKtU0X6-WU) |
| L10 Hardware Specialization | [L18](https://www.youtube.com/watch?v=2tAb3EgyjNw) |
| L11 Programming Systems for Specialized Hardware | 無 |
| L12 Mapping AI Applications to the Datacenter Computer | 無 |
| L13 Domain-Specific Programming Systems + AI-Driven Optimization | DSL 部分對照 [L15](https://www.youtube.com/watch?v=sRuyBNxCkGQ)；AI 部分無 |
| L14 Cache Coherence | [L11](https://www.youtube.com/watch?v=lrCfG2CPDEw) |
| L15 Implementing Synchronization + Memory Consistency | [L12](https://www.youtube.com/watch?v=nFXWmo9MFiY) |
| L16 Fine-Grained Locking and Lock-Free Programming | [L13](https://www.youtube.com/watch?v=GA1ObImqaMo) |
| L17 Transactional Memory (Part I) | [L16](https://www.youtube.com/watch?v=rFFf3WIJ7BA) |
| L18 Transactional Memory (Part II) + AMA | [L17](https://www.youtube.com/watch?v=Tbk1vnYLQqI) |

2023 版的程式作業也不一樣：2023 年 L1 投影片寫的是「Four programming assignments」，2025 年是五個，多出來的就是 PA5。看 2023 影片時聽到作業細節，請回頭以 2025 的 repo 為準。

## 系列弧線

本系列保留官方課序，因為作業和講次綁在一起，改動順序會讓作業篇的前置知識失真。每個作業篇排在它依賴的講次之後，書面作業併進同一篇。

**Part 1：為什麼平行、處理器長怎樣**

- 1. [L1 為什麼要平行、為什麼要效率](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency)
- 2. [L2 現代多核處理器：multi-core、SIMD、multithreading](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading)
- 3. [L3 延遲 vs 頻寬 + ISPC](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc)
- 4. [PA1 + Written 1：四核 CPU 上的效能分析](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance)

**Part 2：怎麼把程式平行化並調快**

- 5. [L4 平行化的思考流程](/posts/ai/2026-09-30-cs149-parallelizing-thought-process)
- 6. [L5 工作分配與排程](/posts/ai/2026-09-30-cs149-work-distribution-scheduling)
- 7. [L6 Locality 與通訊](/posts/ai/2026-09-30-cs149-locality-communication)
- 8. [PA2：task graph 排程](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling)

**Part 3：GPU 與資料平行思維**

- 9. [L7 GPU 架構與 CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda)
- 10. [L8 資料平行思維](/posts/ai/2026-09-30-cs149-data-parallel-thinking)
- 11. [PA3 + Written 2：CUDA circle renderer](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer)

**Part 4：AI 系統**

- 12. [L9 在 GPU 上跑 DNN](/posts/ai/2026-09-30-cs149-dnn-on-gpus)
- 13. [L10 硬體專用化](/posts/ai/2026-09-30-cs149-hardware-specialization)
- 14. [L11 專用硬體的程式系統](/posts/ai/2026-09-30-cs149-programming-specialized-hardware)
- 15. [PA4 + Written 3：Trainium2 與 NKI](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki)
- 16. [L12 把 AI 應用映射到資料中心](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping)
- 17. [L13 DSL 與 AI 驅動的效能最佳化](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization)
- 18. [PA5：寫最快的 kernel](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels)

**Part 5：共享記憶體的正確性**

- 19. [L14 Cache coherence](/posts/ai/2026-09-30-cs149-cache-coherence)
- 20. [L15 同步實作與記憶體一致性](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency)
- 21. [L16 細粒度鎖與 lock-free](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free)
- 22. [L17–L18 Transactional memory + Written 4](/posts/ai/2026-09-30-cs149-transactional-memory-w4)

## 兩條讀法

**完整路線**：照 0 → 22 讀。Part 5 概念上只依賴 Part 1–2，想先打好共享記憶體基礎的人，可以在第 8 篇之後就跳去讀 19–22，再回來讀 GPU 與 AI。

**只想看 AI 系統**：0 → 1–3 → 7 → 9–10 → 12–18。第 1–3 篇建立 SIMD、multithreading 與頻寬瓶頸的直覺，第 7 篇補 arithmetic intensity，之後直接進 GPU 與 AI 硬體。代價是跳過作業篇的動手部分，也跳過 coherence 與同步。

## 今晚可以做的事

1. 打開 [L1 投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/)，翻到效率那一頁，想想「10 個處理器拿到 2 倍加速」算不算好。
2. 對照上面的先修自查表，不熟的項目先去讀 CS107 或 CS111 導讀的對應篇。
3. Clone [PA1 repo](https://github.com/stanford-cs149/asst1)，確認自己的機器是幾核、支不支援 AVX2，裝好 ISPC。PA1 是整門課最容易在校外完整重現的作業。

## 延伸閱讀

以下站內系列與 CS149 有重疊，本系列不因此刪減內容，只在這裡放連結：

- [Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)：從零訓練語言模型；系統面可對照 [GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)、[kernel 與 Triton](/posts/ai/2026-08-22-cs336-kernels-triton)、[平行化機制](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[平行化策略](/posts/ai/2026-08-22-cs336-parallelism-strategies)
- [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)：專講大型語言模型的系統面，[GPU 程式設計與加速](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)、[FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention) 可對照本系列 Part 3–4
- [CME295 LLM systems](/posts/ai/2026-09-29-cme295-llm-systems)：從 LLM 課的角度看推論與服務系統
- [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)：A0–A3 分級的定義

**系列導覽**：下一篇 [L1 為什麼要平行、為什麼要效率](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS149 Fall 2025 課程首頁與課表](https://gfxcourses.stanford.edu/cs149/fall25)
- [CS149 Fall 2025 Course Info（先修、評分、late day）](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo)
- [CS149 Fall 2025 講義索引（18 講投影片）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/)
- [L1 投影片 PDF：Why Parallelism? Why Efficiency?（Fall 2025）](https://gfxcourses.stanford.edu/cs149/fall25content/media/efficiency/01_efficiency_hyF1AJq.pdf)
- [L1 投影片 PDF（Fall 2023，對照用）](https://gfxcourses.stanford.edu/cs149/fall23content/media/whyparallelism/01_whyparallelism_huXfOJ4.pdf)
- [PA1：Analyzing Parallel Program Performance on a Quad-Core CPU](https://github.com/stanford-cs149/asst1)
- [PA2：Scheduling Task Graphs on a Multi-Core CPU](https://github.com/stanford-cs149/asst2)
- [PA3：A Circle Renderer in CUDA](https://github.com/stanford-cs149/asst3)
- [PA4：Fused Conv+MaxPool on Trainium2](https://github.com/stanford-cs149/asst4-trainium2)
- [PA4 cloud_readme（private AMI、capacity block 費用）](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md)
- [PA5：Make the World's Fastest CUDA Kernels](https://github.com/stanford-cs149/asst5-kernels)
- [Written Assignment 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf)、[2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf)、[3](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf)、[4](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)
- [CS149 2023 YouTube 播放清單（Stanford Online）](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
