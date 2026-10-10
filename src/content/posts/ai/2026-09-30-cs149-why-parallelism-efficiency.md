---
title: "CS149 L1：單核為什麼不再變快，以及「快」為什麼不等於「有效率」"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, performance, hardware, systems]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 1
tldr: "CS149 Fall 2025 第一講先定義 speedup，再用三個課堂示範說明通訊與負載不均會吃掉加速比。接著解釋單核效能為什麼停滯：superscalar 能挖的指令層級平行大約在每時脈發四道指令就用完，時脈又被功耗牆擋住，所以效能只能靠多核與專用硬體。最後一段把焦點轉到效率：取一次 DRAM 的延遲約是 L1 cache 的 60 倍，搬 64 bits 的能耗是一次整數運算的上千倍，高效率幾乎都歸結到高效率地存取資料。"
description: "Stanford CS149（Fall 2025）Lecture 1〈Why Parallelism? Why Efficiency?〉導讀：依官方 86 頁投影片整理 speedup 定義、三個課堂示範的教訓、ILP 與時脈頻率為何撞牆、功耗牆公式、記憶體延遲與 cache 的基本概念，以及資料搬移的能耗；2023 年 L1 錄影作為聽講補充。"
draft: false
glossary:
  - term: "speedup"
    aliases: ["加速比"]
    definition: "同一個問題用 1 個處理器的執行時間，除以用 P 個處理器的執行時間。"
    context: "CS149 L1 的第一個定義；課程提醒加速比高不代表硬體用得有效率。"
  - term: "ILP"
    aliases: ["instruction-level parallelism", "指令層級平行"]
    definition: "單一指令串流中，彼此沒有相依、可以同時執行的指令數量。"
    context: "L1 用 a = x*x + y*y + z*z 示範：三個乘法 ILP = 3，兩個加法各只有 1。"
  - term: "superscalar"
    aliases: ["超純量"]
    definition: "處理器在執行時自動找出同一指令串流裡互不相依的指令，派給多個執行單元同時執行。"
    context: "L1 投影片指出，大部分可用的 ILP 在每時脈發四道指令時就已經挖完。"
  - term: "stall"
    aliases: ["停頓"]
    definition: "下一道指令依賴一道尚未完成的指令（例如還在等記憶體的 load），處理器無法前進的狀態。"
    context: "L1 說明存取記憶體是 stall 的主要來源，cache 的作用是縮短 stall。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **本文依據 [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25) 的 Fall 2025 版。** 材料是 Lecture 1 的 [86 頁投影片](https://gfxcourses.stanford.edu/cs149/fall25content/media/efficiency/01_efficiency_hyF1AJq.pdf)（也有[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/)）；Fall 2025 錄影不公開，2023 年的 L1 錄影作為補充。這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列的第 1 篇，課程背景、公開程度與限制見總覽。

2025 年 9 月 23 日的第一講標題是兩個問題：Why Parallelism? Why Efficiency? 這兩個問題決定了整門課的走向。前半講回答第一個：單核處理器為什麼不再自己變快。後半講回答第二個：就算程式平行了，為什麼還要在乎效率。

## 課程影片來源

本文以 Fall 2025 教材為準。官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的 YouTube 播放清單；下列 Fall 2023 錄影是主題相近的相關補充影片，內容可能與 2025 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=V1tINV2-9p4
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 1 - Why Parallelism? Why Efficiency?
```

原始影片：[Stanford CS149 I Parallel Computing I 2023 I Lecture 1 - Why Parallelism? Why Efficiency?](https://www.youtube.com/watch?v=V1tINV2-9p4)

課程與錄影入口：

- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/)

內容核對：已依字幕核對（2026-10-10）：讀了 Fall 2023 錄影《Lecture 1 - Why Parallelism? Why Efficiency?》（1:12:21）。字幕涵蓋課程介紹與講者、speedup 的定義與課堂示範、時脈頻率與功耗、以及結尾的記憶體延遲與 cache 基本概念，主題與本文一致；字幕只零星提到 energy，沒有本文那組 pJ 數字，與文中「影片裡自然也不會講到」的說法一致。 核對的是影片主題與本文主題的關係；本文內容以 Fall 2025 投影片為準，沒有逐段比對兩版。

## 平行電腦與 speedup

投影片給的定義很短：**平行電腦是一群處理單元，彼此合作以快速解決問題。** 旁邊兩句註解點出這門課的立場：我們在乎效能，也在乎效率；用多個處理單元只是取得效能的手段。

第一個量化工具是 [speedup](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_5)：

```text
speedup(P 個處理器) = 用 1 個處理器的執行時間 / 用 P 個處理器的執行時間
```

接下來是三個課堂示範，讓學生扮演「處理器」一起算題目。投影片只留下每個示範的結論：

| 示範 | 觀察到的限制 | 怎麼改善 |
|---|---|---|
| Demo 1 | 通訊（互相告知部分和）限制了最大加速比 | 讓「處理器」坐近一點，或乾脆用喊的，降低通訊成本 |
| Demo 2：擴充到四個「處理器」 | 工作分配不均，有人做完閒著，有人還在做 | 改善工作分配 |
| Demo 3：大量平行 | 題目的通訊量相對計算量太大 | 通訊成本可能主宰整個平行計算，嚴重限制加速比 |

**這三個示範預告了整門課的主要敵人：通訊、負載不均，以及通訊相對計算的比例。** 後面的 L5、L6 會把它們一一展開。

## 三個課程主題

投影片把整門課歸成三個 theme：

1. **設計並寫出能 scale 的平行程式。** 包括平行思考的三步：把工作拆成可以安全平行執行的片段、把工作分配給處理器、管理處理器之間的通訊與同步，別讓它限制加速比。
2. **平行硬體怎麼實作。** 為什麼要懂硬體？因為機器的特性真的有影響，前面示範裡的通訊速度就是例子。
3. **思考效率。** [投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_13)用大字寫 **FAST != EFFICIENT**，並問：在 10 個處理器的電腦上拿到 2 倍加速，算好結果嗎？程式設計師要善用機器提供的能力；硬體設計者要決定放進哪些能力，衡量的是效能與成本（晶片面積、功耗等）。

## 為什麼以前不用平行

投影片先回顧歷史：單執行緒 CPU 效能大約每 18 個月翻倍。這代表花力氣平行化程式通常不划算，軟體工程師什麼都不做，明年程式就自動變快。

直到大約 20 年前，處理器變快主要靠兩件事：

1. 挖掘**指令層級平行**（instruction-level parallelism，ILP），也就是 superscalar 執行
2. 提高 CPU 時脈頻率

要理解第一點，投影片從「程式是什麼」重新講起。站在處理器的角度，**程式就是一串處理器指令**。一顆最簡單的處理器有三個部分：Fetch/Decode 決定下一道要跑哪個指令，ALU（執行單元）執行運算，execution context 裡的暫存器保存程式狀態。這顆處理器每個時脈執行一道指令。

## ILP：一次跑多道指令

投影片用一行程式示範：

```c
a = x*x + y*y + z*z
```

編譯後是五道指令：三個 `mul`、兩個 `add`。一次跑一道，要五個時脈。如果有兩個執行單元呢？限制是相依關係：`add R0, R0, R1` 要等前兩個 `mul` 做完，最後一個 `add` 又要等它。三個 `mul` 彼此獨立，所以這段程式的 ILP 是 3、1、1。有三個執行單元時，第一個時脈就能同時做完三個乘法，整段三個時脈跑完。

**Superscalar 處理器**就是在執行時自動找出這種互不相依的指令，派到多個執行單元同時執行。投影片接著丟出一個問題：這樣平行排程，怎麼才算「遵守程式順序」？提示是：看程式的輸出被期待成什麼樣子。

但 ILP 有極限。[投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_48)的圖顯示，**大部分可用的 ILP，在每時脈發四道指令的處理器上就已經挖完**，再做更寬的處理器幾乎沒有好處。

## 功耗牆

時脈那條路則撞上了功耗。[投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_51)列出電晶體的功耗：

```text
動態功耗 ∝ 電容負載 × 電壓² × 頻率
靜態功耗：電晶體就算閒著也會因為漏電而耗電
```

高功耗就是高熱，所以功耗是現代處理器的關鍵設計限制。投影片列了幾個 TDP 當量級參考：手機處理器約 0.5 到 2W，Apple M1 筆電 13W，Intel Core i9 10900K 桌機 CPU 95W，NVIDIA RTX 4090 GPU 450W。另一頁補充，最高可用頻率由處理器的核心電壓決定。

兩條路都走到盡頭後，投影片的結論是：

1. 頻率提升被功耗限制
2. ILP 的提升已經挖完

所以單一指令串流的效能成長率已經降到幾乎為零。架構師改成加入更多平行執行的單元，或加入為特定任務專用的單元（圖形、影音播放）。**軟體必須寫成平行才看得到效能成長，軟體工程師的免費午餐結束了。**

## 現在的平行硬體長什麼樣

投影片接著展示一排硬體，重點是規模：

- Intel Comet Lake 第 10 代 Core i9（2020），10 核
- AMD Ryzen Threadripper 3990X，64 核，由四個 8 核 chiplet 組成
- NVIDIA AD102 GPU（GeForce RTX 4090，2022）：760 億個電晶體，18,432 個 fp32 乘法器，組織成 144 個稱為 SM 的處理區塊
- Frontier 超級電腦（2022 年秋季世界第一）：9,472 顆 64 核 AMD CPU，加上 37,888 顆 Radeon GPU
- Apple A15 Bionic（iPhone 13、14）：2 大核加 4 小核的 CPU，加上多核 GPU

投影片也預告了第一個作業。[PA1](https://github.com/stanford-cs149/asst1) 在四核 Intel CPU 上跑，基準是用 `-O3` 編譯的單執行緒 C 程式；把 AVX SIMD 向量指令、hyper-threading 和四個核心都用上之後，[投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_55)說可以快 **約 32 到 40 倍**。SIMD、hyper-threading 這些名詞下一講才解釋。

## 效率：功耗與專用硬體

後半講轉向第二個問題。投影片的口號是：現代軟體不只要平行，**還必須有效率**。

以手機為例，最大的顧慮是功耗。省電有兩個理由：

- **功耗等於熱。** 晶片太熱就得降頻散熱，省電代表在固定時間內能跑更高的效能。
- **功耗等於電池。** 省電代表以足夠的效能跑更久。

所以行動晶片大量使用專用處理單元。A15 除了 CPU 和 GPU，還有做 DNN 加速的 Neural Engine（NPU）、影像與影片編解碼處理器、動作感測處理器。資料中心也一樣：投影片列出 Google TPU pod，以及一排 DNN 加速器，包括 Huawei Kirin NPU、GraphCore IPU、Apple Neural Engine、AWS Trainium、帶 Tensor Core 的 Ampere GPU、SambaNova、Cerebras Wafer Scale Engine。**高效率不只是用很多處理單元，也是用專用處理單元**，這條線會在 L10 硬體專用化那一講收回來。

## 高效率幾乎都歸結到存取資料

投影片最後一段只有一句話當標題：**達到高效率，幾乎總是歸結到高效率地存取資料。**

它先補了幾個基本名詞：

- **記憶體**是一個 byte 陣列，每個 byte 由它的位址識別。`ld` 指令把記憶體裡的值搬進暫存器。
- **記憶體存取延遲**是記憶體系統把資料交給處理器所需的時間，例如 100 個時脈週期、100 奈秒。
- **Stall**：下一道指令依賴一道還沒完成的指令，處理器無法前進。存取記憶體是 stall 的主要來源，存取時間常是數百個週期。
- **Cache** 是晶片上的儲存空間，保存記憶體中一部分值的副本。它是不影響程式輸出、只影響效能的硬體實作細節，以 cache line 為單位運作。

投影片用一個 8 bytes、4-byte cache line、LRU 取代策略的小 cache 走過兩個存取序列，說明 cold miss、capacity miss，以及兩種 locality：同一條 cache line 載入後，鄰近位址的存取會命中（**空間 locality**）；重複存取同一個位址會命中（**時間 locality**）。

然後是兩張讓人記住的表。[Kaby Lake CPU 的資料存取時間](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_83)（4 GHz 下的週期數）：

| 資料在哪裡 | 延遲（週期） |
|---|---|
| L1 cache | 4 |
| L2 cache | 12 |
| L3 cache | 38 |
| DRAM（最佳情況） | 約 248 |

以及[資料搬移的能耗](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_84)，投影片標註數字來自 Bill Dally（NVIDIA）與 Tom Olson（ARM）的估計：整數運算約 1 pJ，浮點運算約 20 pJ，從 1 mm 外的小型晶片上 SRAM 讀 64 bits 約 26 pJ，從低功耗行動 DRAM（LPDDR）讀 64 bits 約 1,200 pJ。換算下來，每秒從記憶體讀 10 GB 約耗 1.6 瓦，而行動 GPU 的整體功耗預算只有約 1 瓦。

**系統設計的經驗法則因此是：永遠設法減少資料在電腦裡的搬移量。**

## 小結

投影片的總結有三點：

- 單一控制流程的效能成長非常緩慢。要讓程式明顯變快，就要用多個處理單元或專用硬體，也就是要會推理、會寫平行又有效率的程式。
- 寫平行程式有挑戰：要切分問題、要通訊、要同步，也要了解機器特性，**特別是資料搬移**。
- 只要用得有效率，現代電腦的運算能力遠比你以為的強大。

我的讀法是，這一講埋了兩條會貫穿整門課的線。第一條是「通訊與負載不均吃掉加速比」，對應 L4 到 L6 的程式最佳化。第二條是「資料搬移比運算貴」，對應 L3 的頻寬瓶頸、L6 的 arithmetic intensity，一直到 AI 加速器為什麼要自己管晶片上的記憶體。

## 2023 錄影補充

2023 年的 [Lecture 1 錄影](https://www.youtube.com/watch?v=V1tINV2-9p4)（約 1 小時 12 分）對應同一講。我比對了 [2023 年的 L1 投影片](https://gfxcourses.stanford.edu/cs149/fall23content/media/whyparallelism/01_whyparallelism_huXfOJ4.pdf)和 2025 版的文字：ILP、功耗牆、硬體實例、記憶體與 cache 的技術內容大致相同。差異集中在兩處：

- **課務不同。** 依 [Fall 2023 的 Course Info](https://gfxcourses.stanford.edu/cs149/fall23/courseinfo)，2023 年是四個程式作業（58%，另有選做的 Assignment 5 Big Graph Processing）、五份書面作業（各 1.6%，共 8%），2% 的參與分數靠在課程網站的講次頁留言（async lecture comments）；2025 年改成五個程式作業、四份書面作業、每講小測驗。看影片聽到的作業與評分規定，以 2025 版為準。
- **2025 版多了「資料搬移的能耗」那一頁。** 上面那組 pJ 數字在 2023 年的 L1 投影片裡沒有，影片裡自然也不會講到。

## 今晚可以做的事

1. 找出你電腦 CPU 的型號，查它有幾個核心、支援哪些 SIMD 指令集（AVX2、AVX-512、ARM Neon）。下一講會用到。
2. 把 `a = x*x + y*y + z*z` 換成 `a = x*y*z*w`，畫出相依圖，算它的 ILP。再試 `a = (x*y)*(z*w)`，比較兩者。
3. 回想你最近寫的一段效能敏感程式，它的時間花在運算還是搬資料？

---

**系列導覽**：[← 系列總覽](/posts/ai/2026-09-30-cs149-course-overview) ｜ 下一篇 [L2 現代多核處理器：multi-core、SIMD、multithreading →](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Fall 2023 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。影片主題與本文一致，未發現需要更正的影片說法。

## 參考資料

- [CS149 Fall 2025 課程首頁與課表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 1 投影片 PDF：Why Parallelism? Why Efficiency?（Fall 2025，86 頁）](https://gfxcourses.stanford.edu/cs149/fall25content/media/efficiency/01_efficiency_hyF1AJq.pdf)
- [Lecture 1 逐頁網頁版（Fall 2025）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/)
- [Lecture 1 投影片 PDF（Fall 2023，對照用）](https://gfxcourses.stanford.edu/cs149/fall23content/media/whyparallelism/01_whyparallelism_huXfOJ4.pdf)
- [CS149 2023 Lecture 1 錄影（YouTube）](https://www.youtube.com/watch?v=V1tINV2-9p4)
- [PA1 README：Analyzing Parallel Program Performance on a Quad-Core CPU](https://github.com/stanford-cs149/asst1)
