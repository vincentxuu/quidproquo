---
title: "CS149 L2：多核、SIMD、硬體多執行緒，三種平行各解決什麼問題"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, performance, hardware, systems]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 2
tldr: "CS149 Fall 2025 第二講用一個計算 sin(x) 的迴圈，依序加上三個想法：把電晶體拿去做更多核心（multi-core）、讓一道指令同時驅動多個 ALU（SIMD）、在同一個核心上交錯執行多個執行緒來隱藏記憶體延遲（hardware multithreading）。前兩個增加運算能力，第三個讓運算單元在等記憶體時不閒著。結論是三個條件：平行工作要夠多、同一組工作要跑同樣的指令、平行工作要比 ALU 更多才能隱藏延遲。"
description: "Stanford CS149（Fall 2025）Lecture 2〈A Modern Multi-Core Processor (Part I)〉導讀：依官方 108 頁投影片整理 multi-core、SIMD、hardware multithreading 三種平行的動機與限制，包括條件分支造成的 SIMD 發散、Kaby Lake 的 400 GFLOPs 算法、用多少執行緒才能把核心利用率拉到 100% 的練習；只談 CPU，GPU 留到 L7。2023 年 L2 錄影作為補充。"
draft: false
glossary:
  - term: "SIMD"
    aliases: ["single instruction, multiple data", "單指令多資料"]
    definition: "一道指令廣播給多個 ALU，同時對不同資料做同一個運算；把管理指令串流的成本攤到多個 ALU 上。"
    context: "CS149 L2 的 Idea #2；AVX2 一次處理 8 個 32-bit float。"
  - term: "hardware multithreading"
    aliases: ["硬體多執行緒", "multi-threading"]
    definition: "一個核心同時保存多個執行緒的 execution context，當某個執行緒因等待記憶體而 stall，就改執行另一個執行緒的指令，藉此隱藏延遲。"
    context: "CS149 L2 的 Idea #3；Intel Hyper-threading 是每核 2 個執行緒的 SMT。"
  - term: "divergent execution"
    aliases: ["發散執行", "divergence"]
    definition: "同一組 SIMD 工作項目走了不同的指令路徑（例如 if/else 分支不同），部分 ALU 的結果必須被遮罩丟棄。"
    context: "L2 指出 8-wide SIMD 在最壞情況只剩 1/8 的尖峰效能。"
  - term: "SMT"
    aliases: ["simultaneous multi-threading", "同時多執行緒"]
    definition: "每個時脈從多個執行緒挑選指令，同時送進 ALU 執行；與每個時脈只挑一個執行緒的交錯式多執行緒相對。"
    context: "L2 以 Intel Hyper-threading（每核 2 個執行緒）為例。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **本文依據 [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25) 的 Fall 2025 版。** 材料是 Lecture 2 的 [108 頁投影片](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore1/02_basicarch.pdf)（也有[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/)）；Fall 2025 錄影不公開，2023 年的 L2 錄影作為補充。這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列的第 2 篇，上一篇是 [L1 為什麼要平行、為什麼要效率](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency)。

[上一講](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency)的結論是：單核不會再自己變快，效能要靠平行和專用硬體。這一講回答下一個問題：現代處理器到底用哪些方式平行？

投影片說今天是「從軟體工程師的角度講計算機架構」，要講三個關鍵概念：兩個跟平行執行有關（multi-core、SIMD），一個跟記憶體延遲有關（multithreading）。理解這些，才能最佳化自己的平行程式，也才有直覺判斷哪些工作適合跑在平行機器上。

投影片後段有幾頁用 GPU 當例子。本系列把 GPU 全部留到[第 9 篇 L7 GPU 架構與 CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda)，這一篇只談 CPU。

## 課程影片來源

本文以 Fall 2025 教材為準；下列 Fall 2023 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=CKmNpAO5rS4
title: CS149 2023 Lecture 2 錄影（YouTube）
```

原始影片：[CS149 2023 Lecture 2 錄影（YouTube）](https://www.youtube.com/watch?v=CKmNpAO5rS4)

課程與錄影入口：

- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/)

## 開場複習

2025 版的 L2 先花了一段複習 L1：程式是一串指令、superscalar 處理器自動找出互不相依的指令平行執行、記憶體延遲、stall、cache 與 LRU。這些在[上一篇](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency)已經整理過。

## 貫穿整講的例子：算 sin(x)

整講都圍繞同一段程式：對一個有 N 個 float 的陣列，每個元素用泰勒展開算 sin(x)。

```c
void sinx(int N, int terms, float* x, float* y)
{
  for (int i=0; i<N; i++)
  {
    float value = x[i];
    float numer = x[i] * x[i] * x[i];
    int denom = 6; // 3!
    int sign = -1;
    for (int j=1; j<=terms; j++)
    {
      value += sign * numer / denom;
      numer *= x[i] * x[i];
      denom *= (2*j+2) * (2*j+3);
      sign *= -1;
    }
    y[i] = value;
  }
}
```

這段程式編譯成一條純量指令串流。投影片指出，內層迴圈的指令幾乎都一個接一個相依，**這一段沒有 ILP**，一顆每時脈能發兩道指令的 superscalar 處理器也幫不上忙。

## Idea #1：把電晶體拿去做更多核心

多核時代之前，晶片上大部分電晶體都拿來讓**單一指令串流**跑得更快：更大的 data cache、亂序執行邏輯、花俏的分支預測器、記憶體 prefetcher。電晶體越多，這些東西就做得越大越聰明。

多核時代的想法是：**不要再把電晶體花在加速單一指令串流的複雜邏輯上，而是拿來放更多核心。** 每個核心更簡單，跑單一指令串流可能比較慢，但現在有兩個。投影片的算術是：每個核心的速度變成原本的 0.75，兩個核心合起來是 2 × 0.75 = 1.5，有加速的潛力。

問題是，上面那段 C 程式**沒有表達任何平行**。它編譯成一條指令串流，只會在一個核心上跑成一個執行緒。如果簡單核心比原本的複雜核心慢 25%，程式就真的慢了 25%。

所以程式設計師得把平行說出來。投影片示範兩種寫法：

- **用 C++ threads**：`std::thread` 開一個執行緒處理前半陣列，主執行緒處理後半，最後 `join()` 等它做完。
- **用 Kayvon 虛構的 `forall` 語法**：宣告迴圈的每次迭代彼此獨立，編譯器就可能自動替你產生多執行緒程式。

有了平行，就能往上堆：4 核同時算 4 個元素，16 核同時算 16 個，也就是 16 條同時執行的指令串流。實例包括 Intel Comet Lake 10 核 Core i9、Apple A15（2 大核加 4 小核）、Apple M1（4 大核加 4 小核的異質設計）。

## Idea #2：SIMD，一道指令驅動多個 ALU

投影片指出 `sinx` 還有另一個性質：**平行存在於迴圈的各次迭代之間，而每次迭代執行的是完全相同的指令序列**，只是輸入資料 `x[i]` 不同。

這就引出[第二個想法](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_44)：在核心裡加更多 ALU，**把管理一條指令串流的成本和複雜度，攤到很多個 ALU 上**。同一道指令廣播給所有 ALU，在每個 ALU 上平行執行。這就是 SIMD（single instruction, multiple data）。

投影片把 `sinx` 改寫成 AVX intrinsics 版本：`__m256` 是裝 8 個 32-bit float 的向量型別，`_mm256_load_ps`、`_mm256_mul_ps` 這些函式一次對 8 個值運算。編譯後會看到 `vmulps` 這類向量指令，一次處理 8 個陣列元素。

16 個核心、每核 8 個 SIMD ALU，就是 128 個元素同時計算。前面的 `forall` 抽象在這裡又有用：它告訴編譯器迭代彼此獨立、同一段迴圈本體要跑在大量資料上，編譯器因此可以同時產生多核程式和 SIMD 向量指令。

### 分支怎麼辦

SIMD 的弱點是條件分支。投影片的例子是在 `forall` 裡寫 `if (t > 0.0) {...} else {...}`。8 個 ALU 上的元素，有的條件成立、有的不成立。硬體的做法是兩條路徑都執行，用遮罩（mask）丟掉不該算的 ALU 輸出。**不是每個 ALU 都在做有用的事**，[最壞情況只剩 1/8 的尖峰效能](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_52)。分支結束後才恢復全速。

投影片在這裡留了一個討論題：只用一個 `if`，能不能寫出讓 8-wide SIMD 跑出最壞效能的程式？

[這一頁](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_55)定義了兩個以後會一直出現的詞：

- **Instruction stream coherence（coherent execution）**：同一段指令序列套用在很多資料元素上。要有效率地用 SIMD，**必須**有 coherent execution；但要有效率地平行到多個核心，**不需要**，因為每個核心能從自己的執行緒抓取、解碼不同的指令。
- **Divergent execution**：缺乏 instruction stream coherence。

### 現代 CPU 的 SIMD

投影片列了三個指令集：Intel AVX2 是 256-bit 運算（8 個 32-bit，8-wide float 向量），AVX-512 是 512-bit（16 個 32-bit），ARM Neon 是 128-bit（4 個 32-bit）。

這些指令都是編譯器產生的，平行的來源有三種：

1. 程式設計師用 intrinsics 明確要求
2. 用平行語言的語意傳達，例如前面的 `forall`
3. 「auto-vectorizing」編譯器分析迴圈的相依關係自行推斷

CPU 這種做法叫 **explicit SIMD**：向量化在編譯期完成，打開執行檔就看得到 `vmulps`、`vstoreps` 這些 SIMD 指令。另一種 implicit SIMD 是 GPU 的做法，留到 L7。

## 三種平行執行的比較

講完前兩個想法，[投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_58)把三種平行執行並排：

| 形式 | 發生在哪 | 平行的是什麼 | 誰找出平行 |
|---|---|---|---|
| Superscalar | 核心內 | 同一條指令串流裡的不同指令 | 硬體在執行時自動發現（ILP） |
| SIMD | 核心內 | 同一道指令控制多個 ALU | 編譯器（explicit SIMD）或執行時的硬體（implicit SIMD） |
| Multi-core | 多個核心 | 完全不同的指令串流（thread-level parallelism） | 軟體建立執行緒，把平行暴露給硬體 |

把三者放進一顆真實 CPU，就能算出它的尖峰運算能力。[投影片以四核 Intel i7-7700K（Kaby Lake）為例](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_60)，每核有三個 8-wide SIMD ALU（AVX2）：

```text
4 核 × 8-wide SIMD × 3 × 4.2 GHz = 400 GFLOPs
```

**一個單執行緒、沒向量化的程式，只用到這個數字裡一個核心、一條 lane 的那一小部分。** 這就是上一講 PA1 預告 32 到 40 倍加速的來源。

## 第二部分：存取記憶體

運算能力堆上去了，接下來的問題是資料。投影片先複習：cache 能縮短 stall，因為處理器存取最近用過的資料時延遲較低。

第二招是 **prefetching**：很多現代 CPU 會動態分析程式的記憶體存取模式，猜測未來要用的資料並提前載入 cache。資料到的時候，load 就是 cache hit。但[投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_66)提醒，猜錯時 prefetching 反而會降低效能，因為它消耗頻寬，也會污染 cache。

那如果資料最近沒讀過、不在 cache 裡，下一筆要讀的位址又猜不到呢？投影片的例子是：

```c
int x = some_function();
int y = A[x];
```

它用洗衣服和煮飯來比喻：等洗衣機的時候，你不會站著發呆，會去做別的事。

## Idea #3：硬體多執行緒，隱藏 stall

[第三個想法](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_69)：**在同一個核心上交錯處理多個執行緒來隱藏 stall。** 目前的執行緒無法前進時，就去做另一個。

投影片的圖是一個核心保存 4 個硬體執行緒的 execution context，各自處理 8 個元素。執行緒 1 碰到 stall，核心切去跑執行緒 2；2 也 stall 了，就跑 3。等輪回來時，執行緒 1 的資料已經到了。

這是 **throughput computing 的取捨**：單一執行緒完成工作的時間可能變長（它明明可以跑，核心卻在跑別人），換來整個系統的吞吐量提升。

代價是儲存空間。execution context 放在晶片上，容量有限。同樣大小的儲存空間，可以切成很多小 context（每個執行緒的工作集小，隱藏延遲的能力高），也可以切成少數大 context（每個執行緒的工作集大，隱藏延遲的能力低）。

### 練習：要幾個執行緒才能把核心用滿

投影片接著出了一題，值得自己算一遍。一個核心每個時脈能從某個硬體執行緒跑一道純量指令。程式的每個執行緒先做 3 道算術指令，再做一次延遲 12 個週期的記憶體 load。

- **1 個執行緒**：每 15 個週期只有 3 個在做事，利用率 3/15 = 20%。
- **2 個執行緒**：6/15 = 40%。
- **幾個執行緒才能到 100%？** [答案是 5 個](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_82)。再加執行緒不會更好，已經滿了。

然後把條件改成每個執行緒做 6 道算術指令，再做同樣的 load。這時只要 3 個執行緒就能到 100%。

投影片的兩個 takeaway：

1. 有多個硬體執行緒的處理器，能在某個執行緒等待長延遲操作時，改跑其他執行緒的指令來避免 stall。**記憶體操作的延遲並沒有變短**，只是不再拉低處理器的利用率。
2. [多執行緒處理器用其他執行緒的算術來隱藏記憶體延遲](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_87)。**每次記憶體存取搭配的算術越多，隱藏 stall 需要的執行緒就越少。**

第二點值得記住：「算術與記憶體存取的比例」這個概念，之後在 L6 會以 arithmetic intensity 的名字回來。

### 兩種硬體多執行緒

投影片區分兩種做法：

- **交錯式多執行緒**（interleaved，也叫 temporal multi-threading）：每個時脈核心挑一個執行緒，跑它的一道指令。前面的練習就是這種。
- **同時多執行緒**（simultaneous multi-threading，SMT）：每個時脈核心從多個執行緒挑指令，一起送進 ALU。例子是 Intel Hyper-threading，每核 2 個執行緒。

兩者的共同點是：**核心的 ALU 數量沒變**，多執行緒只是讓它們在遇到記憶體存取這類高延遲操作時被用得更有效率。

## 全部疊起來

投影片把三個想法疊成一顆虛構晶片：16 核、每核 8 個 SIMD ALU（共 128 個）、每核 4 個執行緒。這代表 16 條同時執行的指令串流、共 64 個同時存在的執行緒，要以最大的延遲隱藏能力跑滿這顆晶片，[需要 512 個獨立的工作](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_89)。

真實的 Intel Skylake／Kaby Lake 核心是雙向多執行緒（每核 2 個執行緒），每個時脈最多能跑 4 道獨立的純量指令和 3 道 8-wide 向量指令。

接下來幾頁用 NVIDIA V100 說明 GPU 是「極端的吞吐量導向處理器」：同樣的三個想法，推到更大的規模。細節留到 L7。

## 到目前為止的結論

[投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_94)的總結是：要有效率地使用現代平行處理器，應用程式必須：

1. **有足夠的平行工作**，才能用滿所有執行單元（跨多個核心，也跨每個核心裡的多個執行單元）
2. **成組的平行工作要跑同樣的指令序列**，才能用上 SIMD
3. **暴露比 ALU 更多的平行工作**，才能交錯執行來隱藏記憶體 stall

投影片建議學生一定要懂這幾個詞：instruction stream、multi-core processor、SIMD execution、coherent control flow、hardware multi-threading（interleaved 與 simultaneous 兩種）。

投影片最後附了一組 bonus slides，一步步從單一純量核心疊到「多核、多執行緒、superscalar」核心，標題寫「看懂這一串就懂 lecture 2」。最後一頁是思考題：程式開了兩個執行緒，跑在雙核、每核兩個 execution context 的處理器上，誰負責把應用程式的執行緒對應到硬體 context？答案是作業系統。接著問：如果你是作業系統，這兩個執行緒要放哪兩個 context？開五個執行緒呢？

## 2023 錄影補充

2023 年的 [Lecture 2 錄影](https://www.youtube.com/watch?v=CKmNpAO5rS4)（約 1 小時 16 分）對應同一講。我比對了 [2023 年的 L2 投影片](https://gfxcourses.stanford.edu/cs149/fall23content/media/multicore/02_basicarch_xX3ssOi.pdf)（103 頁）與 2025 版（108 頁）的文字：`sinx` 例子、三個想法、SIMD 發散、執行緒利用率練習都一樣。差異有兩處：

- **開場不同。** 2025 版開頭多了複習 L1 的記憶體、延遲、stall、cache 與資料搬移能耗那幾頁，也多了 Apple M1 的例子。
- **結尾不同。** 2023 版 L2 的最後幾頁已經開始講「讀 A[i]、讀 B[i]、算 A[i] × B[i]、存回 C[i]」這個頻寬例子，並問它適不適合跑在吞吐量導向的平行處理器上。2025 版把這部分移到 L3，所以 2023 影片的最後一段，內容屬於本系列的下一篇。

## 今晚可以做的事

1. 算你自己的 CPU 尖峰 GFLOPs：核心數 × SIMD 寬度 × 每核 SIMD 單元數 × 時脈。規格不確定就只算前兩項和時脈，看看跟單執行緒純量程式差了幾倍。
2. 把執行緒利用率練習改成「4 道算術 + 20 週期延遲的 load」，算需要幾個執行緒。
3. 寫一個只有一個 `if` 的迴圈，想辦法讓 8-wide SIMD 裡每次只有一條 lane 做有用的事。

---

**系列導覽**：[← 上一篇 L1 為什麼要平行、為什麼要效率](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency) ｜ [系列總覽](/posts/ai/2026-09-30-cs149-course-overview) ｜ 下一篇 [L3 延遲 vs 頻寬 + ISPC →](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS149 Fall 2025 課程首頁與課表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 2 投影片 PDF：A Modern Multi-Core Processor (Part I)（Fall 2025，108 頁）](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore1/02_basicarch.pdf)
- [Lecture 2 逐頁網頁版（Fall 2025）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/)
- [Lecture 2 投影片 PDF（Fall 2023，對照用）](https://gfxcourses.stanford.edu/cs149/fall23content/media/multicore/02_basicarch_xX3ssOi.pdf)
- [CS149 2023 Lecture 2 錄影（YouTube）](https://www.youtube.com/watch?v=CKmNpAO5rS4)
