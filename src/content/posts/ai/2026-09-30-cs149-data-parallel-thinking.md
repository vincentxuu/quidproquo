---
title: "CS149 第 8 講：資料平行思維，用 map、scan 與 sort 取代鎖"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, parallelism]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 10
tldr: "第 8 講要你換一個腦袋：不再想「每個 worker 做什麼」，而是把演算法寫成對序列的操作，例如 map、fold、scan、segmented scan、gather/scatter、sort、groupBy。這些原語都有高效的平行實作，能把不規則的平行變規則、把細粒度同步變粗粒度。代價是要多掃幾遍資料，所以很吃頻寬。"
description: "Stanford CS149（Fall 2025）第 8 講導讀：為什麼 GPU 需要十幾萬個 thread 的平行度、map 與 fold 的平行條件、scan 的 O(N lg N) 與 work-efficient 兩種演算法、CUDA 上依 warp 與 block 分層的 scan 實作、segmented scan 與稀疏矩陣乘法、gather/scatter，以及用 sort 取代鎖來建粒子格點與直方圖。"
draft: false
glossary:
  - term: "prefix sum"
    aliases: ["scan", "前綴和", "inclusive scan", "exclusive scan"]
    definition: "對序列做累加：inclusive scan 的第 i 項是前 i+1 個元素的和，exclusive scan 的第 i 項是前 i 個元素的和（不含自己）。運算子換成任何有結合律的二元運算都成立，統稱 scan。"
    context: "CS149 L8 的核心原語；PA3 要你在 CUDA 上實作 exclusive scan。"
  - term: "segmented scan"
    definition: "同時對序列裡多個連續區段各自做 scan，區段的起點用一個旗標陣列標記。它讓「序列的序列」這種不規則資料可以用規則的資料平行方式處理。"
    context: "L8 用它做稀疏矩陣乘法，也用它實作需要 atomic 的 scatter。"
  - term: "work-efficient"
    definition: "平行演算法的總運算量與最佳循序演算法同階。scan 的簡單平行版做 O(N lg N) 次運算，work-efficient 版只做 O(N)。"
    context: "L8 指出在 32-wide SIMD 的 warp 內，work-efficient 版反而指令更多，因為 SIMD 利用率低。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-data-parallel-thinking-en)

> **版本說明**：本文依據 [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版第 8 講（10 月 16 日）[Data-Parallel Thinking](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/) 的投影片（[PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/dataparallel/08_dataparallel.pdf)，51 頁），2026-09-30 打開核對。Fall 2025 錄影只在 Canvas，官方首頁指向的替代品是 [2023 版第 8 講錄影](https://www.youtube.com/watch?v=Ba3TqxSgnTk)；我沒有逐段比對兩版差異，內容以 2025 投影片為準。存取等級 **A3**。

**系列位置**：上一篇 [第 7 講：GPU 架構與 CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda)｜下一篇 [PA3 CUDA 圓形渲染器 + Written 2](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

到這裡為止，課程教你用「worker 做什麼」和「怎麼把工作分給 worker」來想平行程式。第 8 講第一頁就說，今天換一種描述法：**把演算法寫成對資料序列的操作**。

投影片列的清單是 map、filter、fold/reduce、scan/segmented scan、sort、groupBy、join、partition/flatten。主張只有一句：這些操作都有高效的平行實作，所以用它們寫成的程式，往往能在平行機器上跑得很好。後面加了一個星號：**前提是你沒被頻寬卡住**。

## 為什麼要這麼多平行度

投影片把 [上一講](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda) 的 V100 規格搬回來：80 個 SM，最多同時交錯 163,840 個 CUDA thread。結論寫在同一頁：沒有暴露大量平行度、算術密度又不高的程式，在 GPU 上跑不快。

多核心機器、雲端叢集、SIMD 加上多執行緒核心，都要求程式拿出大量平行度，GPU 要求的最多。而找平行度的關鍵是看懂**相依**：沒有相依，就有平行執行的空間。

## 序列與 map、fold

資料平行模型把計算組織成對序列的操作。投影片舉的現代例子是 NumPy 的 `C = A + B`，也列了 Scala list、Pandas DataFrame、PyTorch/JAX tensor（N 維序列）與 Haskell 的 `seq T`。

序列跟陣列有一個重要差別：程式**只能透過特定操作存取序列元素**，不能直接用索引存取。這個限制正是實作端能自由平行化的來源。

**map** 把一個沒有副作用的一元函式套到每個元素上，輸出長度相同。投影片給了 Haskell、C++ 的 `std::transform`，以及 JAX 的 `vmap`。因為 `f` 沒有副作用，套用順序不影響結果，實作可以把序列切成 P 段各自平行 map，再串起來。

**fold** 用一個二元函式把元素逐一累進一個累加值。要平行化時多需要一個 combiner 函式，把各段的部分結果合起來；如果 `f` 本身是有結合律的 `(b,b) -> b` 運算，就不需要另外的 combiner。

## Scan：課程最愛的原語

scan 的定義：給一個有結合律、有單位元素的二元運算 ⊕，

- inclusive scan：`[a0, a0⊕a1, a0⊕a1⊕a2, ...]`
- exclusive scan：`[I, a0, a0⊕a1, ...]`，第 i 項不含自己

⊕ 是加法時，inclusive scan 就叫 prefix sum。循序版只要一個迴圈，`out[i] = op(out[i-1], in[i])`，看起來完全是循序的。投影片接下來示範三種平行化，重點在於每一種的取捨都不同。

### 簡單平行版：工作量變多

第一種每一步讓每個元素加上距離 1、2、4、8…之外的值，lg N 步就算完。投影片標了兩個數字：**work O(N lg N)，span O(lg N)**。span 是最長的循序步驟鏈。投影片的評語是：跟循序演算法比，這很沒效率。

### Work-efficient 版：up-sweep 加 down-sweep

第二種分兩階段。up-sweep 沿一棵二元樹往上兩兩相加，down-sweep 再沿樹往下把部分和推回去。總工作量降到 O(N)，span 仍是 O(lg N)。投影片在旁邊留了兩個問號：這兩個 O 的常數是多少？locality 如何？這段虛擬碼後來原封不動出現在 [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer) 的 README 裡。

### 只有兩個核心時

第三種最接地氣。只有兩個核心時，各自循序 scan 一半，然後把前半段的總和 `a0-7` 當 base，加到後半段每個元素上。工作量是 O(N)，常數只有 1.5，而且都是連續記憶體存取，spatial locality 很高。投影片補了一句：核心數很多、記憶體存取不均勻（NUMA）時，跨區存取會比較貴；小規模多核心上大概沒差。

這三種放在一起的教訓是：**理論上的平行度不等於要全部用上**。

### CUDA 上的 scan：依硬體層級換演算法

投影片接著寫了 warp 內的 scan（`scan_warp`）：32 個 thread 做 5 步（2⁵ = 32），每步讓 lane 編號夠大的 thread 加上 `shift` 之外的值。這是第一種 O(N lg N) 的演算法。

投影片特別說明為什麼這裡不用 work-efficient 版：在 32-wide SIMD 裡，work-efficient 的寫法會讓很多 lane 閒著，SIMD 利用率低，**需要的指令數反而超過兩倍**。

更大的陣列就分層：

1. 一個 128 元素的 block 由 4 個 warp 各自 scan 32 個元素。
2. 每個 warp 的最後一個 thread（lane 31）把自己那段的總和寫進 shared memory。
3. warp 0 對這 4 個總和再做一次 scan，得到每段的 base。
4. 其他 warp 把 base 加回自己的元素。

投影片說 PA3 會提供類似的 `scan_block` 程式碼。再往上，一百萬元素的 scan 要三次 kernel launch：每個 block 各自 scan、對所有 block 的總和 scan、再把 base 加回各 block；超過一百萬就得把第二階段也切成多個 block。

scan 這一段的總結值得抄下來：

- **平行度**：演算法有 O(N) 的平行工作，但高效實作只用「剛好填滿機器」那麼多的平行度，目標是減少工作量與通訊、同步。
- **locality**：多層實作對應記憶體階層，CUDA 的 block 層級在 shared memory 裡做。
- **異質性**：機器不同層級用不同演算法，warp 內一種、thread 之間另一種；核心少的 CPU 則以循序 scan 為主。

## Segmented scan：把不規則變規則

很多問題是「序列的序列」：圖的每個頂點走訪它的每條邊、模擬裡每個粒子檢查半徑內的鄰居、每份文件處理它的每個字。這裡有兩層平行可以用，但很不規則，每個頂點的邊數、每份文件的字數可能差很多。

segmented scan 同時對多個連續區段各自做 scan。投影片的例子：`A = [[1,2],[6],[1,2,3,4]]` 做 exclusive 加法 segmented scan，得到 `[[0,1],[0],[0,1,3,6]]`。表示法是一個旗標陣列，區段起點標 1：

```
flag: 1 0 0 1 0 0 0 0
data: 1 2 3 4 5 6 7 8
```

它也有 work-efficient 的 up-sweep/down-sweep 版本，只是每一步都要看旗標，而且 down-sweep 需要保留一份原始旗標。

### Gather、scatter 與稀疏矩陣乘法

另外兩個關鍵操作：

- `gather(index, input, output)`：`output[i] = input[index[i]]`
- `scatter(index, input, output)`：`output[index[i]] = input[i]`

硬體支援的程度不一。投影片說 AVX2（2013）有 SIMD gather 但沒有 scatter，AVX-512 才有 scatter 指令；GPU 硬體兩者都支援，但仍比連續的向量載入貴。

把 segmented scan 和 gather 組起來，就能做 CSR 格式的稀疏矩陣乘向量。每一列的非零元素數不同，直接按列平行會讓寬 SIMD 很難用滿。投影片的五步做法：

1. 依 `cols` 從 x gather 出對應元素。
2. map：每個非零值乘上 gather 來的 x。
3. 從 `row_starts` 做出旗標陣列。
4. 對乘積做 inclusive segmented scan。
5. 取每個區段的最後一個元素，就是 y。

每一步都是規則的資料平行操作，不規則性全被旗標吸收了。

### 需要 atomic 的 scatter，改用 sort

index 有重複時，scatter 得做成 `output[index[i]] = atomicOp(output[index[i]], input[i])`。投影片示範不用 atomic 的替代法：依 index 排序輸入、標出每個相同 index 區段的起點、再對每段做 segmented scan。

## 用 sort 取代鎖：粒子格點

最後一個大例子是把 100 萬個粒子依 2D 位置放進 16 格的均勻格點，這是 N-body 問題找半徑 R 內鄰居時常用的資料結構。投影片依序比了五種解法：

| 解法 | 做法 | 問題 |
|---|---|---|
| 1 | 每個粒子一個 CUDA thread，用一把全域鎖 append 進格子的 list | 數千個 thread 搶同一個資料結構 |
| 2 | 每格一把鎖 | 粒子均勻分布時競爭少約 16 倍，仍然要鎖 |
| 3 | 按格子平行，每格掃過所有粒子 | 只有 16 個 task，平行度不夠；工作量是循序的 16 倍 |
| 4 | 每個 block 建自己的部分格點，最後合併 | 同步在 block 本地的 shared memory 裡，較便宜；但要額外合併與 N 份格點的記憶體 |
| 5 | map 算出每個粒子的格子 → 依格子 sort → 每個元素比較自己與前一個的格子，找出每格的起訖 | 不需細粒度同步、保有大量平行度，代價是一次 sort 與多掃幾遍資料 |

直方圖是同一個模式的小練習：只用 map 與 sort，平行算出每個 bin 的數量。做法是 map 出每個元素的 bin id、sort、找出每個 bin 在排序結果裡的起點，再用「下一個非空 bin 的起點減自己的起點」算出大小。投影片特別標出一個容易漏的邊界情況：下一個 bin 是空的時候，要一路往後找到第一個非空的 bin。

## 總結：換來什麼、付出什麼

投影片的兩張總結：

- 資料平行思維把演算法寫成對大型資料集合的簡單操作，這些操作通常能大量平行、實作也很有效率。
- 它把**不規則平行變規則**，把**細粒度同步變粗粒度**。
- 但大部分解法要多掃幾遍資料，**很吃頻寬**。
- 這些原語是今天很多平行與分散式系統的基礎：CUDA 的 Thrust、Pandas、JAX、Apache Spark / Hadoop。

最後一點讓這講跟 AI 工程直接相連。你在 PyTorch 或 JAX 裡寫的 tensor 操作，本質上就是這堂課說的序列操作；它們快不快，取決於底層怎麼實作這些原語，以及你是不是被頻寬卡住（[第 6 講](/posts/ai/2026-09-30-cs149-locality-communication) 的 arithmetic intensity）。

## 自學怎麼做

1. 在紙上對 8 個元素分別跑一次簡單版與 work-efficient 版 scan，數兩者各做了幾次加法，驗證 O(N lg N) 與 O(N) 的差別。
2. 把 segmented scan 的旗標例子 `[[1,2,3],[4,5,6,7,8]]` 手算一遍 exclusive 結果。
3. 接著讀 [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer) 的第二部分：用 exclusive scan 實作 `find_repeats`，就是這講的直接應用。

今晚可以做的一件事：挑一段你寫過、用了鎖或 atomic 累加的程式，試著用「map → sort → 找區段起點」三步改寫，寫下它多掃了幾遍資料。

## 延伸閱讀

- 用 CUDA 實作 map、zip、reduce 與 matmul 的作業：[CMU 11-868 作業一：用 CUDA 寫 MiniTorch 的 map、zip、reduce 與 matmul](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming)
- GPU 為什麼怕搬資料：[CS336 Lecture 5：GPU 快不是因為每個 thread 快，而是資料少搬幾次](/posts/ai/2026-08-22-cs336-gpu-tpu)
- 系列總覽與 2023 錄影對照（2023 版第 9 講 Spark 在 Fall 2025 沒有對應講次）：[Stanford CS149 導讀（系列總覽）](/posts/ai/2026-09-30-cs149-course-overview)

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25) — 講次日期、錄影政策
- [Lecture 8: Data-Parallel Thinking（逐頁網頁版）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/) — 本文全部內容的來源
- [Lecture 8 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/dataparallel/08_dataparallel.pdf) — 51 頁
- [Stanford CS149 2023 Lecture 8 錄影](https://www.youtube.com/watch?v=Ba3TqxSgnTk) — 官方首頁指向的舊版替代錄影
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp) — 全部 19 支 2023 錄影
- [stanford-cs149/asst3 README](https://github.com/stanford-cs149/asst3) — 引用本講 work-efficient scan 虛擬碼的作業
- [NVIDIA CCCL（Thrust 現在所在的 repo）](https://github.com/NVIDIA/cccl) — 投影片總結列出的 CUDA 資料平行原語函式庫 Thrust
