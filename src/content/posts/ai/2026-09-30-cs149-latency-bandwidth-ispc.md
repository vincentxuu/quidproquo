---
title: "CS149 L3：處理器很快，資料送不過來——延遲 vs 頻寬，以及 ISPC 教你分清「抽象」與「實作」"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 3
tldr: "L3 前半用高速公路與洗衣服的比喻分開延遲與頻寬，再算給你看：向量逐元素相乘在 V100 上效率不到 1%，因為記憶體送資料的速度追不上 ALU。後半的主題是「抽象 vs 實作」：ISPC 讓你用 SPMD 的方式思考（一群 program instance 各做一份），編譯器卻用 SIMD 指令實作。把這兩層混在一起，是這門課最常見的困惑來源。"
description: "Stanford CS149（Fall 2025）第 3 講導讀：延遲與頻寬的差別、為什麼記憶體頻寬常常是真正的瓶頸（bandwidth-bound）、指令管線的吞吐量與延遲，以及用 ISPC 說明程式模型的語意（抽象）與排程（實作）如何分開。"
draft: false
glossary:
  - term: "bandwidth-bound"
    aliases: ["頻寬受限", "memory bandwidth-bound"]
    definition: "程式的執行速度由記憶體能送資料的速率決定，而不是由處理器算得多快決定；此時核心會停下來等資料。"
    context: "CS149 L3 用向量逐元素相乘說明：每做一次乘法要搬 12 bytes，ALU 再多也餵不飽。"
  - term: "SPMD"
    aliases: ["single program, multiple data"]
    definition: "定義一個函式，同時跑它的多個實例，每個實例拿不同的輸入或不同的編號。這是程式設計師看到的抽象。"
    context: "ISPC 的程式模型是 SPMD，但編譯器用 SIMD 向量指令實作它。"
  - term: "gang"
    aliases: ["ISPC gang", "program instances"]
    definition: "從 C/C++ 呼叫一個 ISPC 函式時產生的一組 program instance，數量是 programCount；全部完成後控制權才回到 C 程式。"
    context: "CS149 L3、PA1 Program 3 都用這個詞。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 3 篇，對應 9 月 30 日的第 3 講 [Modern Multi-Core Architecture (Part II) + ISPC Programming Abstractions](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore2/)，官方投影片 [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore2/03_multicore2-ispc_WueDBzT.pdf) 共 56 頁。

Fall 2025 的錄影只放在 Stanford Canvas。課程首頁指向 2023 年的公開錄影，本講對應 [2023 Lecture 3](https://www.youtube.com/watch?v=F4bVSyz_jxo)，標題相同。本文以 2025 投影片為準，影片只當聽講補充。整門課的公開程度是 A3（足以自學），缺口列在[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)。

這一講分兩半，看起來不相干：前半講**記憶體頻寬**，後半講 **ISPC 程式模型**。它們其實共用一個前提——上一篇的三種硬體平行（多核、SIMD、硬體多執行緒）讓處理器的算力暴增，接下來的問題是「資料送不送得過來」與「程式設計師該怎麼描述平行」。

## 課程影片來源

本文以 Fall 2025 教材為準。官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的 YouTube 播放清單；下列 Fall 2023 錄影是主題相近的相關補充影片，內容可能與 2025 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=F4bVSyz_jxo
title: Stanford CS149 I 2023 I Lecture 3 - Multi-core Arch Part II + ISPC Programming Abstractions
```

原始影片：[Stanford CS149 I 2023 I Lecture 3 - Multi-core Arch Part II + ISPC Programming Abstractions](https://www.youtube.com/watch?v=F4bVSyz_jxo)

課程與錄影入口：

- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore2/)

內容核對：已依字幕核對（2026-10-10）：讀了 Fall 2023 錄影《Lecture 3 - Multi-core Arch Part II + ISPC Programming Abstractions》（1:16:18）。字幕涵蓋上一講的硬體多執行緒與延遲回顧、頻寬與記憶體延遲（約過半處）、指令管線的吞吐量，以及結尾約最後六分之一的 ISPC（gang、program instance，並要求學生確認「抽象」可以有多種合法的「實作」），主題與本文一致。 核對的是影片主題與本文主題的關係；本文內容以 Fall 2025 投影片為準，沒有逐段比對兩版。

## 投影片開頭先補上一講沒講完的

投影片第 2 頁說明，L2 結尾的 hardware multi-threading 沒講到，這一講開頭會用 L2 的投影片補完。那部分的內容已寫在[上一篇](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading)，這裡不再重複。

## 一個思考實驗：向量逐元素相乘適合 GPU 嗎？

第 3 頁丟出一個問題：兩個各有數百萬元素的向量 A、B，逐元素相乘存進 C。每個元素要讀 A[i]、讀 B[i]、乘、寫 C[i]。這種工作完全獨立、平行度無限高，看起來很適合放到吞吐量導向的處理器上。

答案要等講完延遲與頻寬才揭曉。先記住第 4 頁的硬體數字：V100 有 80 個 SM，每個 SM 有 64 個 fp32 ALU，共 5120 個 ALU；記憶體介面是 900 GB/s。投影片要你想的是：每個時脈都要餵資料給這 5120 個 ALU。

（GPU 的架構細節留到系列第 9 篇。這一講拿 V100 只是為了算頻寬。）

## 延遲和頻寬是兩件事

投影片第 6–16 頁用了三個生活比喻，重點都是把兩個常被混用的詞分開：

- **延遲（latency）**：一件事從開始到完成要多久。
- **吞吐量／頻寬（throughput / bandwidth）**：單位時間能完成多少件。記憶體頻寬的定義是「記憶體系統能提供資料給處理器的速率」。

**高速公路**：舊金山到 Stanford 約 50 公里，時速 100 公里，一台車要半小時。如果一次只准一台車在路上，吞吐量是每小時 2 台。要提高吞吐量，可以開快一點（延遲下降）、多蓋車道（資源加倍），或是讓車子一台接一台間隔 1 公里上路——延遲完全沒變，吞吐量卻從每小時 2 台變成 100 台。

**洗衣服**：洗 45 分、烘 60 分、摺 15 分，一批要 2 小時。多買一台洗衣機和烘衣機，吞吐量加倍，但資源也加倍。改成**管線化**：第一批進烘衣機時第二批就開始洗，一台洗衣機一台烘衣機就能做到每小時一批，單批延遲仍是 2 小時。

**兩條水管接起來**：一條每秒 100 公升、一條每秒 50 公升，串起來最多每秒 50 公升。整個系統的吞吐量由最窄的那一段決定。

這三個例子合起來的直覺是：**延遲可以靠「同時有很多件事在路上」來藏起來，但頻寬的上限藏不掉。**

## 把比喻搬回處理器：核心在等資料

第 17–20 頁把水管的故事換成處理器。每條執行緒重複三道有相依的指令：載入 64 bytes、兩次加法。處理器的設定是：

- 每個時脈做一次數學運算
- 載入指令可以和數學運算同時發出
- 記憶體每個時脈送 8 bytes
- 硬體執行緒夠多，記憶體延遲可以被藏起來

於是每 2 個時脈的數學運算就要 64 bytes 資料，但記憶體要 8 個時脈才送得完 64 bytes。投影片的時間軸畫出來：同時在途的載入請求到了上限，核心就開始 stall。

照這組數字自己算一下：穩定狀態下，每 8 個時脈只做得了 2 個時脈的數學，核心利用率約四分之一。投影片第 20 頁要你說服自己一件事：**這個利用率只取決於指令吞吐量和記憶體吞吐量的比例，跟記憶體延遲有多長、同時能有幾個在途請求無關。** 記憶體那一側 100% 的時間都在傳資料，它就是傳不了更快。這種狀態叫 **memory bandwidth-bound**。

### 回到向量相乘

第 22 頁揭曉答案。每做一次乘法要讀兩個 float、寫一個 float，共 12 bytes。V100 在 1.6 GHz 下每個時脈能做 5120 次 fp32 乘法，要讓所有 ALU 都忙起來需要約 98 TB/s 的頻寬，而它只有 900 GB/s。

結果是 GPU 效率不到 1%。投影片補了一句：即使如此，它還是比接在 76 GB/s 記憶體匯流排上的八核 Xeon 快，那顆 CPU 在同一個計算上的效率約 3%。

所以思考實驗的答案是：平行度再高，這個程式也被頻寬卡住了。

## 頻寬才是關鍵資源

第 23–24 頁把結論講得很直接：**如果處理器要資料的速率太高，記憶體系統跟不上。克服頻寬限制，常常是在吞吐量導向系統上寫程式最重要的挑戰。**

投影片列出高效平行程式會做的三件事：

1. 組織計算，少從記憶體抓資料：重用同一條執行緒先前載入的資料（temporal locality），或讓執行緒之間共享資料。
2. 寧可多算一點，也不要把值存回去再重新載入——「算術是免費的」。
3. 總之，程式必須很少存取記憶體，才能有效利用現代處理器。

這三點在系列第 7 篇（L6 Locality 與通訊）會變成 arithmetic intensity 的正式討論。現在先帶走一個判斷習慣：**看到一個程式，先算每搬一個 byte 做幾次運算。**

**今晚可以做的事**：挑一個你熟悉的迴圈（例如 `y = a*x + y`），算它每個元素讀寫幾個 byte、做幾次浮點運算，再查你機器的記憶體頻寬，估計它最多能跑多少 FLOPS。下一篇 PA1 的 Program 5 就是這題。

### 附帶一提：一個時脈怎麼做完一次乘法？

第 25 頁回答學生常問的問題。說「核心每個時脈做一個運算」，指的是**指令吞吐量，不是延遲**。四段管線（fetch、decode、execute、write back）裡，一道指令要 4 個時脈才完成，但每個時脈都有一道新指令進來，所以吞吐量是每時脈一道。投影片也提醒，現代 CPU 的管線可以深到約 20 段，而連續相依的指令要特別處理才能保證正確。這跟洗衣服的管線化是同一件事。

## 後半：抽象 vs 實作

第 26 頁宣告後半的主題：**把程式模型的語意（意義）和它的實作細節混為一談，是這門課最常見的困惑來源。**

第 27 頁把兩層分開：

| | 抽象（語意） | 實作（排程） |
|---|---|---|
| 回答的問題 | 給定程式和各操作的意義，它會算出什麼答案？ | 在平行機器上怎麼算出來？ |
| 具體要問 | 結果是什麼 | 操作以什麼（可能平行的）順序執行？哪些操作由哪條執行緒、哪個執行單元、哪個向量 lane 算？ |

投影片對學生的期待是：知道一個程式模型怎麼被實作之後，你能在腦中「追蹤」平行電腦的每個部分在每一步做什麼。

ISPC 就是用來練這件事的例子。

## ISPC：用 SPMD 思考，用 SIMD 實作

[ISPC](https://ispc.github.io/)（Intel SPMD Program Compiler）是 Intel 的開源編譯器。投影片第 29 頁推薦 ISPC 作者 Matt Pharr 的長文 [The Story of ISPC](https://pharr.org/matt/blog/2018/04/30/ispc-all.html)。

### 抽象這一層：一群 program instance

投影片第 30–36 頁用 L2 就出現過的 `sinx()`（用泰勒展開算 sin）當例子。C++ 的 `main()` 呼叫一個 ISPC 函式時，發生的事是：

1. 呼叫會產生一個 **gang**，裡面有 `programCount` 個 **program instance**。
2. 所有 instance 同時執行同一段 ISPC 程式碼，每個 instance 的 `programIndex` 不同。
3. 函式返回時，所有 instance 都已完成，控制權回到循序執行的 C++ 程式。

這就是 **SPMD**（single program, multiple data）：定義一個函式，平行跑它的多個實例，各自處理不同的資料。第 50 頁的總結圖是「單一控制流 → 呼叫 SPMD 函式 → 多個邏輯控制流 → 返回 → 回到單一控制流」。

### 實作這一層：SIMD 指令

第 49 頁說明實作：ISPC 編譯器產生向量指令（例如 AVX2、ARM NEON）來完成一整個 gang 的邏輯；遇到條件分支時，由編譯器處理向量 lane 的遮罩（masking）——就是 PA1 要你手動做的那件事。

所以程式設計師「想像」的是 `programCount` 條獨立的指令流，機器實際跑的是**一條執行緒裡的一串 SIMD 指令**。

### 同一個抽象，可以有不同的工作分配

第 34–40 頁比較兩種寫法：

- **interleaved**：instance 0 處理元素 0、8、16…，instance 1 處理 1、9、17…
- **blocked**：每個 instance 分到連續一整塊。

兩種寫法算出的答案一樣，但實作上的差別很大。投影片第 39–40 頁畫出每一步 gang 同時存取的元素：interleaved 時，8 個 instance 讀的是記憶體中連續的 8 個值，一道 packed vector load 指令（`vmovaps`）就能完成；blocked 時，8 個值彼此不連續，要用 gather 指令（`vgatherdps`），投影片說它更複雜、成本更高。這正是「抽象相同、實作不同」的例子。

### foreach：只說「哪些工作彼此獨立」

第 41–43 頁引入 `foreach`。寫成 `foreach (i = 0 ... N)` 時，程式設計師只宣告「這 N 次迭代彼此獨立、順序不重要」，不指定哪個 instance 做哪一次。第 42 頁列出編譯器可以選的四種實作：全部給 instance 0、interleaved、blocked、動態分配。投影片的用意是讓你看到：**`foreach` 是抽象，這四種都是合法的實作。**

第 43 頁說，在很多簡單的情況下，`foreach` 讓你幾乎像寫循序程式一樣寫平行程式。

### 抽象不是萬能：未定義的輸出

第 44–45 頁用兩個程式測你懂不懂語意。第一個把 `x` 的絕對值寫兩次到 `y`，每次迭代寫的位置互不重疊，結果是確定的。第二個在某些條件下寫 `y[i-1]`、其他情況寫 `y[i]`，不同迭代可能寫到同一個位置——**輸出是未定義的**。`foreach` 保證的是「你宣稱這些迭代獨立」，不是「系統幫你確認它們獨立」。

第 46–48 頁的陣列加總是另一個陷阱：每個 instance 各自累加到一個非 `uniform` 的變數，會得到 `programCount` 份部分和，沒辦法直接回傳給只期待一個值的 C 程式，編譯時就會報型別錯誤；正確的寫法是各自累加私有的部分和，最後用跨 instance 的 `reduce_add()` 合起來。第 48 頁另列了 `reduce_min`、`broadcast`、`rotate` 等跨 instance 操作。

第 47 頁有一段自我測驗：如果你看得懂為什麼一段 AVX intrinsics 程式正確實作了這個 ISPC 函式的語意，你就掌握 ISPC 了。

（`uniform`、`programIndex` 這些關鍵字的實際寫法，下一篇 PA1 Program 3 會帶你動手。這裡只需要知道它們在哪一層。）

### 還差一層：多核

第 51 頁提醒：一個 gang 是在**一個 CPU 核心的一條執行緒**上用 SIMD 指令跑的。前面所有程式碼，在四核的 myth 機器上只用到一個核心。要用到多核，ISPC 有另一個抽象叫 **task**，投影片說留給學生在作業 1 裡自己讀。

## 低階語言的代價，與更高階的選擇

第 52–55 頁收尾時問了一個設計問題。ISPC 是低階語言：它把 `programIndex`、`programCount` 暴露給你，讓你能精確控制每個 instance 做什麼、讀什麼。代價是你也能寫出輸出未定義的程式，或只在特定 `programCount` 下才正確的程式。

如果拿掉 `programIndex` 和 `programCount`，只准用 `foreach`，就幾乎不用想 program instance 了。再往上走一步，連陣列索引都不給，只准對一個集合呼叫 `map(f, x)`——投影片說，這對寫 NumPy、PyTorch 的人應該很熟悉，並說後面還會有更多相關內容。

第 56 頁的總結只有三句：程式模型是思考平行程式組織方式的工具；它提供的抽象允許多種合法實作；整門課都要一直想著「抽象 vs 實作」。

## 這一講留給你的兩個習慣

1. **先算頻寬，再談平行度。** 一個程式平行度再高，如果每個 byte 只做一次運算，它就被記憶體卡住。
2. **讀平行程式時，分清你在讀哪一層。** 「這段程式的答案是什麼」和「它在機器上怎麼跑」是兩個問題。`foreach` 回答第一個，編譯器回答第二個。

延伸閱讀：想看頻寬限制在大型模型訓練上的樣子，可以接著讀站上的 [CS336 GPU 與 TPU 導讀](/posts/ai/2026-08-22-cs336-gpu-tpu)。

系列導覽：上一篇 [L2 現代多核處理器](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading)｜下一篇 [PA1 + Written 1：四核 CPU 效能分析](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Fall 2023 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。影片主題與本文一致，未發現需要更正的影片說法。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 3 講義頁（逐頁投影片）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore2/)
- [Lecture 3 投影片 PDF：Multi-Core Architecture, Part II + Parallel Programming Abstractions](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore2/03_multicore2-ispc_WueDBzT.pdf)
- [2023 Lecture 3 錄影：Multi-core Arch Part II + ISPC Programming Abstractions](https://www.youtube.com/watch?v=F4bVSyz_jxo)
- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [ISPC 官方網站](https://ispc.github.io/)
- [Matt Pharr：The Story of ISPC](https://pharr.org/matt/blog/2018/04/30/ispc-all.html)
