---
title: "CS149 PA1 + Written 1：在四核 CPU 上量 speedup，並解釋它為什麼不是線性"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 4
tldr: "PA1 程式寫得不多，重點是分析：六個程式分別練 threads 的工作分配、SIMD 遮罩、ISPC gang 與 task、輸入資料如何影響 SIMD 效率、頻寬受限的 saxpy，以及用計時找 K-Means 的熱點。Written 1 則用紙筆題練峰值吞吐量、指令相依、管線、多執行緒藏延遲與 SIMD divergence。官方評分以 Stanford myth 機器為準，校外可以在自己的機器跑，但數字不能直接對照。"
description: "Stanford CS149（Fall 2025）Programming Assignment 1 與 Written Assignment 1 導讀：Program 1–6 各在練什麼、該觀察什麼現象、校外執行的限制（myth 機器、ISPC 安裝、K-Means 資料集），以及 Written 1 五個計分題與 practice problems 的範圍。不含解答。"
draft: false
glossary:
  - term: "SIMD divergence"
    aliases: ["控制流分歧", "divergent execution"]
    definition: "同一條 SIMD 指令的不同 lane 走進 if/else 的不同分支時，硬體要用遮罩把兩個分支都跑一遍，被遮掉的 lane 在那段時間閒置。"
    context: "PA1 Program 2、4 與 Written 1 Problem 5 都在練估計這個損失。"
  - term: "ISPC task"
    aliases: ["launch", "ISPC tasks"]
    definition: "ISPC 用來使用多核的抽象：launch 產生一批 task，每個 task 由一個 gang 執行，執行時期系統把 task 分給各核心的工作執行緒。"
    context: "PA1 Program 3 Part 2 要你決定要開幾個 task。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance-en)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 4 篇，對應 [Programming Assignment 1: Analyzing Parallel Program Performance on a Quad-Core CPU](https://github.com/stanford-cs149/asst1)（Fall 2025 截止日 10 月 6 日）與 [Written Assignment 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf)。

本文只寫題目在練什麼、該觀察什麼、往哪個方向想。**不附解答。** 這兩份作業的價值就在自己量、自己解釋。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25)

## 先看清楚作業要什麼

[README](https://github.com/stanford-cs149/asst1/blob/master/README.md) 開宗明義：這份作業要你理解現代多核 CPU 的兩種主要平行——**單一核心內的 SIMD**，和**多核心平行**（順便看到 Hyper-Threading 的效果）。它說程式只寫一點點，**分析很多**。總分 100 分，另有 6 分加分題。

評分的硬體是 Stanford 的 myth 機器（`myth[51-66]`）：四核 4.2 GHz Intel Core i7，每核兩個硬體執行緒，支援 8-wide 的 AVX2 向量指令。這組數字決定了你該期待的上限：多核最多 4 倍、SIMD 最多 8 倍、兩者相乘最多 32 倍，再加上 Hyper-Threading 的一點額外空間。

### 校外能做到哪裡

- **myth 機器校外無法登入。** README 說評分以 myth 的數字為準，但也歡迎在自己的機器上跑，只要在報告裡寫清楚是哪台機器。
- **ISPC 可以自己裝。** README 用的是 ISPC v1.28.1 的 Linux 版，從 [ISPC 官網](https://ispc.github.io/)下載即可。
- **Apple Silicon 另有說明。** repo 附了 [README_aarch64.md](https://github.com/stanford-cs149/asst1/blob/master/README_aarch64.md)，要你在 ARM 筆電上跑並報告 SIMD 的加速。
- **Program 6 的資料集放在 Stanford AFS 上**（約 800 MB），校外拿不到。`prog6_kmeans/main.cpp` 裡有一段被註解掉的程式，說可以自己產生資料；但官方評分用的是 `data.dat`，你的數字只能自己比。
- 繳交走 Gradescope，校外無法繳交、也沒有評分回饋。

換句話說，校外讀者能完整做完這份作業的**分析**，但拿不到跟官方參考值可比的數字。你的四核筆電、八核桌機或 M 系列晶片，會讓每題的「理想上限」都不一樣——這本身就是好練習：先查自己機器的核心數、SIMD 寬度，再推你預期的 speedup。

## Program 1：用 threads 平行畫 Mandelbrot（20 分）

題目給你一個循序的 Mandelbrot 碎形產生器。每個像素的計算量跟它在圖上的亮度成正比——這一句是整題的伏筆。

你要用 `std::thread` 平行化：

1. 先用兩條執行緒，上半張給一條、下半張給一條。README 說這叫**空間分解（spatial decomposition）**。
2. 擴展到 2 到 8 條執行緒，每條分到連續一塊，畫出 speedup 對執行緒數的圖，回答「是不是線性？」README 的提示是：仔細看 3 條執行緒那個點。
3. 在每條執行緒開頭和結尾計時，用數據驗證你的假設。
4. 改變工作分配方式，讓兩個 view 都達到約 7–8 倍。限制是：**不准用同步**，而且要一個對所有執行緒數都適用的策略，不能針對每種設定寫死。README 說有一個很簡單的靜態分配就能做到。
5. 開 16 條執行緒，看看有沒有比 8 條快，並解釋原因。

**該觀察的現象**：當某些區塊的像素特別貴時，把圖切成連續大塊會讓工作量不平均。這就是上一篇 ISPC 例子裡 interleaved 與 blocked 的差別，只是換到執行緒層級。第 5 小題則要你想：機器只有 4 核 8 個硬體執行緒時，多開的執行緒能帶來什麼。

## Program 2：用「假的」向量指令做 SIMD（20 分）

要向量化的函式 `clampedExpSerial` 把 `values[i]` 自乘 `exponents[i]` 次，結果上限夾在 9.999999。每個元素的迴圈次數不同，所以 lane 之間會分歧。

題目不讓你直接寫 AVX2，而是用課程自己的 `CS149intrin.h`「假向量指令」。這些函式在軟體裡模擬向量運算，會記錄每道指令，並回報 **Total Vector Instructions**（當作效能）和 **Vector Utilization**（啟用中的 lane 比例）。每道指令都可以帶一個遮罩：遮罩為 0 的 lane 不會被寫入。

要做的事：

1. 寫出 `clampedExpVector`，對任何 `N` 和任何 `VECTOR_WIDTH` 都要正確。README 提醒你用 `./myexp -s 3` 測 N 不是向量寬度倍數的情況。
2. 把 `VECTOR_WIDTH` 從 2、4、8 掃到 16，記錄 vector utilization 怎麼變，並解釋原因。
3. 加分題（1 分）：向量化陣列加總，目標是 `N / VECTOR_WIDTH + log2(VECTOR_WIDTH)` 量級。

**該觀察的現象**：向量越寬，一組 lane 裡「最慢那一個」拖住其他人的機會越大。README 給的 `abs()` 範例本身就有 bug，也值得先找出來。

## Program 3：ISPC 與 ISPC tasks（20 分）

這一題回到 Mandelbrot，但改用 ISPC，同時用上四核與每核的 SIMD。README 說修掉一個會造成**效能問題**（不是正確性問題）的錯之後，你應該看到比循序版快 32 倍以上。

### Part 1：ISPC 基本觀念（10 分）

README 這一段幾乎就是[上一篇](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc)的濃縮版：C 程式呼叫 ISPC 函式，會產生一個 gang，裡面 `programCount` 個 program instance 在 SIMD 單元上同時執行，每個 instance 用 `programIndex` 知道自己是誰；gang 全部跑完，控制權才回到 C 程式。README 在這裡插了一句：「Stop. 這是你的講師。請把上一段再讀一次。相信我。」

README 對比了兩種寫法。`sum` 用 `programIndex` 明確分配每個 instance 處理哪些元素，是**命令式**的，描述怎麼把工作對應到 instance；`sum2` 用 `foreach`，是**宣告式**的，只說明要做哪些工作、哪些迭代彼此獨立。兩者差別很小但非常重要。README 建議先讀 [ISPC 官方 walkthrough](https://ispc.github.io/example.html)，它的範例幾乎就是這題的 `mandelbrot_ispc()`。

要回答的是：ISPC 設定成 8-wide AVX2 時，你預期的最大 speedup 是多少？實際量到的為什麼比較低？README 提示你想想圖上哪些區域對 SIMD 執行不友善，並比較兩個 view。

### Part 2：ISPC tasks（10 分）

一個 gang 只跑在一個核心上。要用多核，得用 `launch` 產生 **task**：每個 task 由一個 gang 執行，task 之間可以任意順序、在不同核心上平行處理。

1. 用 `--tasks` 跑，量 view 1 的 speedup，跟沒有 task 的版本比。
2. 只改 `mandelbrot_ispc_withtasks()` 裡要開幾個 task，讓速度超過循序版 32 倍。說明你怎麼決定數量、為什麼這個數字最好。
3. 加分題（2 分）：thread 和 ISPC task 這兩個抽象差在哪？README 的思考實驗是：開 10,000 個 ISPC task，和開 10,000 條執行緒，各會發生什麼事？

README 最後自問自答：為什麼 ISPC 要有 `foreach` 和 `launch` 兩種機制，系統不能自己把 `foreach` 的迭代同時分到多核與 SIMD 嗎？它的回答是：「好問題，答案很多，來 office hours。」這題會在系列下一篇 L4 的「assignment」裡再碰到。

## Program 4：迭代式 `sqrt`（15 分）

程式用牛頓法對 2000 萬個 0 到 3 之間的亂數開根號，初始猜測是 1.0。README 附了一張圖：輸入越接近 1，收斂越快；越接近 0 或 3，需要的迭代越多。README 說這題是「複習」，概念跟 Program 2、3 相同。

要做的事：

1. 量單核（無 task）與多核（有 task）的 ISPC 版本 speedup，拆出 SIMD 帶來多少、多核帶來多少。
2. 構造一組輸入，**讓 speedup 最大**，並說明它對 SIMD speedup 和多核 speedup 各有沒有幫助。
3. 構造一組輸入，**讓無 task 的 ISPC 版 speedup 最小**，解釋效率損失的原因。
4. 加分題（最多 2 分）：用 AVX2 intrinsics 手寫一版。

**該觀察的現象**：這題讓你直接操縱「每個 lane 的工作量」。想清楚一條 SIMD 指令裡 8 個 lane 各要跑幾次迭代，答案就出來了。

## Program 5：BLAS `saxpy`（10 分）

`saxpy` 算 `result = scale*X + Y`，N 是 2000 萬。README 特別說明：每用到三個元素只做兩次數學運算（一乘一加），而且它是完全可平行、存取規律、成本可預測的計算。

要回答的是：ISPC 加上 task 之後 speedup 是多少？能不能改寫到接近線性？請說明理由。

加分題（1 分）：程式碼裡算頻寬用的是 `TOTAL_BYTES = 4 * N * sizeof(float)`，明明只讀 X、讀 Y、寫 result 三次，為什麼乘以 4 是對的？README 的提示是想想 CPU cache 怎麼運作。

**該觀察的現象**：這題就是上一篇向量相乘思考實驗的 CPU 版。README 也提醒，過去有學生在這題想太多；它期待的是簡單的答案。

## Program 6：讓 K-Means 變快（15 分）

K-Means 把一百萬個資料點分群。起始程式是正確的，只是不夠快。README 說這題的核心技能是**找出效能熱點**，而且它不會告訴你該看哪裡。

要做的事：

1. 用 `common/CycleTimer.h` 的計時函式量出時間花在哪。
2. 根據量測改寫，目標約 2.1 倍以上。報告要寫成一連串步驟：「我量到…所以我認為…於是我試了…結果…」。

限制：只能改 `kmeansThread.cpp`；不能改變演算法的功能；而且 `dist`、`computeAssignments`、`computeCentroids`、`computeCost` 四個函式裡**只能平行化一個**。README 說官方解答只改了約 20–25 行，並提醒先搞清楚 K、M、N 的相對大小。它也說，就算沒達到目標，只要除錯過程有條理，還是能拿到大部分分數。

**今晚可以做的事**：不必等到有資料集。拿你手邊任何一個跑得慢的程式，先在兩三個可疑的地方插計時，找出最花時間的那一段，再決定要不要平行化——這就是 Program 6 在練的順序。

## Written Assignment 1：用紙筆練同一套直覺

[Written 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf) 共 48 頁，前面是五個計分題，後面是 12 題 PRACTICE PROBLEM。依 [course info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo)，書面作業必須三人一組，每次作業由課程人員隨機分配新組員；程式作業則可選擇兩人一組。

| 題目 | 主題 | 計分方式 | 在練什麼 |
|---|---|---|---|
| Problem 1 | Hardware Basics | 正確性（20 分） | 從多核、8-wide SIMD、四個硬體執行緒到 superscalar，一步步算處理器的峰值浮點吞吐量 |
| Problem 2 | Identifying Dependencies + A Bit on Superscalar Execution | 正確性（20 分） | 畫九道指令的相依圖；在有限制的三路 superscalar 處理器上排程，求最少時脈；判斷改成五路值不值得（提示用 ILP 回答） |
| Problem 3 | Pipelining | 努力（20 分） | 十位助教批改七題考卷的管線：求穩定狀態的吞吐量，以及單份考卷的延遲 |
| Problem 4 | Understanding Hardware Multi-Threading and Caches | 努力（20 分） | 兩條執行緒、記憶體讀取延遲 50 個時脈、16 MB cache：求核心利用率；N 變小後，該選提高時脈還是降低記憶體延遲 |
| Problem 5 | SIMD Divergence, and Avoiding It | 努力（20 分） | 一張 16 像素寬、每 13 列重複的黑白圖，白像素與黑像素走成本不同的分支：求總時脈數與平均 SIMD 利用率 |

Problem 3 就是上一篇洗衣服比喻的考題版，Problem 4 則是上一篇「多執行緒藏延遲、頻寬藏不掉」的定量版。

後面的 practice problems 從「Be An ISPC Compiler」開始，要你用 PA1 那套假向量指令手動翻譯一段 ISPC 函式；其餘題目反覆練峰值吞吐量、指令序列排程、cache 與多執行緒、SIMD divergence。最後一題開頭寫著「這題很難，答得出來代表你真的懂 SPMD 怎麼對應到 SIMD 執行」。

**怎麼用**：做 PA1 之前先寫 Problem 1、2，把「理想上限」算熟；做完 Program 2、4 再寫 Problem 5，對照你量到的 vector utilization。

## 這一篇可以確認與不能確認的

可以確認：README 的題目、分數、評分機器規格與限制；Written 1 的題目與計分方式。不能確認：myth 機器上的參考數字、Gradescope 的評分細節、Ed 討論區的補充說明（校外不可見）、Written 1 的截止日（PDF 與課程首頁都沒寫）。本文沒有任何題目的解答。

延伸閱讀：README 最後的「For the Curious」強烈推薦 Matt Pharr 的 [The Story of ISPC](https://pharr.org/matt/blog/2018/04/30/ispc-all)，它談到為什麼「編譯器不能自己平行化」這類常見問題。

系列導覽：上一篇 [L3 延遲 vs 頻寬與 ISPC](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc)｜下一篇 [L4 平行化程式的思考流程](/posts/ai/2026-09-30-cs149-parallelizing-thought-process)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [CS149 Fall 2025 Course Info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo)
- [stanford-cs149/asst1（Programming Assignment 1 starter code）](https://github.com/stanford-cs149/asst1)
- [asst1 README](https://github.com/stanford-cs149/asst1/blob/master/README.md)
- [asst1 README_aarch64.md（ARM Mac 說明）](https://github.com/stanford-cs149/asst1/blob/master/README_aarch64.md)
- [Written Assignment 1（PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf)
- [ISPC 官方網站](https://ispc.github.io/)
- [ISPC walkthrough 範例](https://ispc.github.io/example.html)
- [Matt Pharr：The Story of ISPC](https://pharr.org/matt/blog/2018/04/30/ispc-all)
