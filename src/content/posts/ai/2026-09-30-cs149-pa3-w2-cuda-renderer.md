---
title: "CS149 PA3 與 Written 2：CUDA 圓形渲染器，順序正確與速度要一起拿"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, homework]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 11
tldr: "PA3 有三部分：把 SAXPY 改寫成 CUDA 並分開計時、用 exclusive scan 實作 find_repeats、再寫一個又對又快的 CUDA 圓形渲染器（85 分）。渲染器的難點是半透明圓的混色不可交換，每個像素都得照輸入順序更新，而起始程式碼一個圓一個 thread 的做法兩樣都沒守住。Written 2 則是五題計分題（fusion、SIMD 利用率、用 barrier 取代鎖、用資料平行原語處理圖、粒子模擬的鎖）加 14 題練習。校外要自備 NVIDIA GPU，本文不提供解答。"
description: "Stanford CS149（Fall 2025）Programming Assignment 3 與 Written Assignment 2 導讀：SAXPY 的 kernel 計時與 PCIe 頻寬、scan 與 find_repeats 的評分門檻、圓形渲染器的 atomicity 與 order 兩條不變式、八個計分場景與效能公式、README 給的提示、AWS g5g.xlarge 環境，以及 Written 2 五道計分題各在練什麼。不提供解答。"
draft: false
glossary:
  - term: "alpha blending"
    aliases: ["alpha 混色", "半透明混色"]
    definition: "把半透明顏色疊到既有像素上：結果 = α × 新顏色 + (1 − α) × 原像素顏色。先疊誰後疊誰結果不同，運算不可交換。"
    context: "PA3 的圓形渲染器因此必須照圓的輸入順序更新每個像素。"
  - term: "kernel fusion"
    aliases: ["loop fusion", "fusion"]
    definition: "把原本分開、各自讀寫記憶體的多個迴圈或 kernel 合成一個，讓中間結果留在暫存器或 cache 裡，減少記憶體流量。"
    context: "Written 2 第一題「To Fuse or Not to Fuse」的主題。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版：[Assignment 3: A Simple CUDA Renderer](https://github.com/stanford-cs149/asst3)（截止 10 月 30 日）與 [Written Assignment 2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf)（課程首頁列的日期是 10 月 21 日），2026-09-30 打開 README、`cloud_readme.md` 與 PDF 核對。存取等級 **A3**：題目、起始程式碼、評分腳本、書面作業 PDF 都公開；拿不到的是 Gradescope 評分、官方 AWS 額度與解答。需要自備 NVIDIA GPU。**本文不提供任何解答。**

**系列位置**：上一篇 [第 8 講：資料平行思維](/posts/ai/2026-09-30-cs149-data-parallel-thinking)｜下一篇 [第 9 講：在 GPU 上跑 DNN](/posts/ai/2026-09-30-cs149-dnn-on-gpus)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

[第 7 講](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda) 講 CUDA 抽象怎麼落到 GPU，[第 8 講](/posts/ai/2026-09-30-cs149-data-parallel-thinking) 講怎麼用 scan、sort 這類原語取代鎖。PA3 把兩者一起考：README 開頭說這個渲染器很簡單，但把它平行化需要你設計並實作**能被平行建構與操作的資料結構**。接著用粗體重複了一次：真的要早點開始。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。2026-10-10 已即時重查：官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的播放清單，而該清單沒有對應本文範圍的影片。查核日期：2026-10-10。

課程與錄影入口：

- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/slide_17)

## 課程裡的位置與環境

PA3 在 10 月 30 日截止，前面剛上完第 7、8 講。依 [course info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo)，程式作業可以兩人一組，PA3 占總成績 12%；Written 2 必須三人一組、由助教隨機分組，每份書面作業占 3%。

**環境**：README 說效能測試要在 AWS 的 GPU 虛擬機上跑，並提到作業用 NVIDIA T4（compute capability 7.5）。[cloud_readme.md](https://github.com/stanford-cs149/asst3/blob/master/cloud_readme.md) 寫得更具體：

- instance 類型 `g5g.xlarge`，`nvidia-smi` 範例顯示的 GPU 是 **NVIDIA T4G**，CUDA 12.8。
- AMI 是 Community AMIs 裡的 `Deep Learning ARM64 Base OSS Nvidia Driver GPU AMI (Ubuntu 22.04) 20250613`，磁碟開 65 GiB。
- 另外要裝 `freeglut3-dev`。
- 課程會發 AWS 學生額度，文件反覆提醒用完要關機。

這對校外自學者的意義是：AMI 是公開的社群 AMI，**理論上可以自費照同樣步驟開機**，這點和 PA4 那種課程私有 AMI 不同（我沒有實際開過）。或者用手邊的 NVIDIA GPU：repo 裡的參考解同時附了 ARM64 版（`render_ref`、`cudaScan_ref`）和 x86 版（`render_ref_x86`、`cudaScan_ref_x86`），`render/checker.py` 會依 `platform.machine()` 自動挑。`checker.py` 的分數是跟**同一台機器上**的參考解相比，所以換機器後分數仍有意義，只是時間數字無法跟 T4 上的直接比。

## Part 1：SAXPY 暖身（5 分）

把 [PA1](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance) Program 5 的 SAXPY 改寫成 CUDA：配置 device 記憶體、把輸入複製過去、跑 kernel、把結果複製回來。

重點在計時。起始程式碼已經量了「複製過去 + kernel + 複製回來」的總時間，你要另外只量 kernel。README 特別警告：kernel launch 預設和 CPU 是**非同步**的，直接在 launch 前後讀時鐘，只會量到 API 呼叫本身，看起來快得驚人。要在 launch 後呼叫 `cudaDeviceSynchronize()`。`cudaMemcpy()` 在作業的用法下是同步的，不需要再同步。

兩個問題：

1. 跟 PA1 的循序 CPU 版比，效能如何？
2. 兩組計時差在哪？觀察到的頻寬跟機器各部分的規格大致吻合嗎？

README 給了一個線索：AWS 上記憶體匯流排的預期頻寬是 5.3 GB/s，跟 16 lane PCIe 3.0 的規格不符，原因包括主機板晶片組效能，以及來源的 host 記憶體是否 **pinned**。這一題真正要你看到的，是 [第 6 講](/posts/ai/2026-09-30-cs149-locality-communication) 那套 arithmetic intensity 的推論在 GPU 上的樣子：SAXPY 每個元素只做一次乘加，資料搬運才是大頭。

## Part 2：prefix sum 與 find_repeats（10 分）

`find_repeats` 給一個整數陣列 A，回傳所有滿足 `A[i] == A[i+1]` 的 i。README 的例子：`{1,2,2,1,1,1,3,5,3,3}` 輸出 `{1,3,4,8}`。

規定做法是先實作平行 exclusive scan，再用它完成 `find_repeats`。README 附的虛擬碼就是 [第 8 講投影片](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/slide_17) 那個 up-sweep / down-sweep 演算法，每個 `parallel_for` 對應一次 kernel launch。起始程式碼把陣列長度補到 2 的冪次，只複製 N 個元素回來，所以你可以只處理 2 的冪次。

讀題要注意的幾件事：

- **評分只看效能**，而且要在參考解的 20% 以內才拿滿分。README 附的 scan 分數表是 K80 上簡單 CUDA 實作的時間。
- README 說這部分重點是練 CUDA 與資料平行思考，**不是調效能**，直接照虛擬碼移植應該就夠。只有一個陷阱：每一輪都開 N 個 thread、再用條件判斷誰該做事，效能會很差（想想 up-sweep 最後一輪只有兩個 thread 有事做）。滿分解只為最內層平行迴圈的每一次迭代開一個 thread。
- 評分時用 `-i random` 跑隨機輸入。`--thrust` 可以跑 Thrust 的實作當對照，做到跟 Thrust 有競爭力可以拿最多 2 分額外加分。

## Part 3：圓形渲染器（85 分）

### 題目在問什麼

渲染器輸入一組圓（3D 位置、速度、半徑、顏色），每一格畫面的循序演算法是：清空影像；更新每個圓的位置；對每個圓算出螢幕上的 bounding box，對 box 裡每個像素，若像素中心在圓內，就算出顏色並**混進**這個像素。

關鍵在「混進」。圓是半透明的，用 RGBA 表示，疊色公式是 `result = C_alpha * C + (1 - C_alpha) * P`。README 強調這個合成不可交換：X 疊在 Y 上跟 Y 疊在 X 上看起來不一樣，所以必須照應用程式給的順序畫（可以假設輸入已按深度排好）。

起始程式碼有一個循序 C++ 參考版 `refRenderer.cpp`，和一個**錯誤的** CUDA 版 `cudaRenderer.cu`：它一個 CUDA thread 負責一個圓，數學完全正確，卻有兩個重大錯誤。README 說跑 `rgb` 和 `circles` 場景會看到每一格都在變動的水平條紋。

### 兩條不變式

你的 CUDA 渲染器必須守住兩件在循序版裡自動成立的事：

1. **Atomicity**：每次影像更新都要是 atomic。臨界區包括讀出像素的四個 32-bit float（RGBA）、混入目前的圓、寫回。
2. **Order**：同一個像素的更新必須照**圓的輸入順序**。README 用粗體點出一個關鍵觀察：順序只約束**同一個像素**的更新；不碰同一個像素的圓之間沒有順序要求，可以獨立處理。

沒同時守住兩條的解法，Part 3 最多只拿 12 分。README 補了一句：「我們已經給你這樣的解法了！」

### README 建議的節奏與提示

README 建議三步：先把起始程式碼改成邏輯正確（**建議用不需要鎖或同步的做法**）；再找出你的解法效能問題在哪；然後「真正的思考才開始」。

提示整理（這些是 README 原本就給的方向，不是解答）：

- 有兩條平行軸：**跨像素**與**跨圓**（跨圓要守順序）。README 說解法需要兩種都用上，可能在計算的不同階段。
- `circleBoxTest.cu_inl` 裡的圓與方框相交測試是你的朋友。
- `exclusiveScan.cu_inl` 提供了 shared memory 裡的 exclusive scan，但只適用 2 的冪次長度，而且 **block 的 thread 數必須等於陣列長度**，README 用全大寫要你讀註解。
- `shadePixel` 每次更新都做好幾次 global memory 操作，可以考慮在暫存器裡累加，最後只寫一次。
- 可以用 Thrust，但達到參考效能不需要它。README 說常見解法一種用它給的 shared memory scan，另一種用 Thrust 的 prefix sum，兩種都合法。
- 渲染器裡有資料重用嗎？怎麼利用？
- CUDA 沒有能 atomic 完成整個像素更新的原語。用 global memory atomic 做一把鎖是一種辦法，但就算 atomic 了，順序還是得對。README 的建議是**先想順序，再考慮 atomicity，如果那時它還是問題的話**。
- `rand1M` 和 `micro2M` 圓很多，暫存結構小心別吃光 device 記憶體。沒檢查 `cudaMalloc` 的回傳值，程式會照跑，然後在正確性檢查失敗。README 附了一個 `cudaCheckError` 巨集，建議除錯時把所有 CUDA API 呼叫都包起來；kernel launch 本身不能包，錯誤會在下一個被包住的呼叫才出現。

### 評分

`./checker.py` 會在你的機器上同時跑參考解 `render_ref` 和你的版本。八個計分場景是 `rgb`、`rand10k`、`rand100k`、`pattern`、`snowsingle`、`biglittle`、`rand1M`、`micro2M`，每個 9 分：

- 2 分正確性（只測 256 倍數的影像大小）。
- 7 分效能，只有正確時才拿得到：T ≤ 1.2 × T_ref 滿分；T 是 T_ref 十倍以上零分；中間用 `7 × T_ref / T` 計分。

合計 72 分。另外交一份 write-up：分工方式（怎麼分給 block、thread，甚至 warp）、同步發生在哪、做了什麼降低通訊、試過哪些方法、用什麼量測引導最佳化。額外加分最多 10 分：效能顯著超過要求的解最多 5 分，高品質的純 CPU 平行渲染器（要分析 GPU 與 CPU 版差異）最多 5 分。

README 的配分有兩處自相矛盾，讀的時候注意：Grading Guidelines 寫 write-up 18 分、prefix sum 10 分；緊接著的總表寫 Part 3 write-up 13 分，加上 Part 1 的 5 分；Part 2 的範例分數表又顯示 scan 滿分是 5 分（find_repeats 應是另一半）。以總表加總是 5 + 10 + 13 + 72 = 100 分，跟標題的 100 分一致。

## Written 2：五題計分題在練什麼

[Written Assignment 2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf) 共 43 頁，前半是五道計分題，每題 20 分；後半是 14 題 PRACTICE PROBLEM。這裡只說每題在考哪個概念，不給答案。

| 題目 | 評分方式 | 在練什麼 |
|---|---|---|
| 1. To Fuse or Not to Fuse | 正確性 | 一串 `parallel_for` 中間夾一個循序的 max 迴圈。A 問：無限核心、無限頻寬下能否拿到 20 倍加速（Amdahl 定律）。B 換成 10 核、4 GB/s 頻寬、256 KB 共享 cache 的機器，可以改寫程式並用 `atomicMax`，求執行時間。提示直接問：這支程式是算力受限還是頻寬受限？哪裡能 fusion、哪個相依阻止 fusion？ |
| 2. SPMD 與 SIMD | 正確性 | A：gang 大小 8 的 ISPC 程式有巢狀 if，找出讓 SIMD 利用率最差的輸入。B：1024 個 CUDA thread 各自隨機走一條深度 10 的二元樹路徑，warp 32，求 SIMD 利用率 |
| 3. A Barrier is Worth a 1000 Locks | 正確性 | 4 個 thread 算 10 個 bin 的直方圖，每次加一都搶同一把鎖。A 問效能問題在哪；B 要求不用鎖、只用一次 `barrier()` 重寫 |
| 4. 圖的資料平行思維 | 只看努力 | 用 CSR 形式的圖（`edgeStarts`、`edges`）算每個頂點鄰居的平均，只准用 gather、scatter、inclusive segmented scan、shiftLeft 與 map。題目說這是課堂 grid solver 的圖版本，也是 PageRank 的常見操作 |
| 5. 粒子模擬 | 只看努力 | 雙核跑 O(N²) 重力計算，利用對稱性只算 N²/2 次，卻做 N² 次加鎖。A 在不加變數、不改分工下把鎖的次數減半；B 找出另一個跟鎖次數無關的主要效能問題並提出解法 |

第 3、4 題幾乎就是第 8 講的延伸：第 3 題是「部分結果再合併」取代全域鎖，第 4 題是稀疏矩陣乘法那套 gather + segmented scan 的圖版本。

14 題練習題涵蓋更廣：用 sort/scatter/transpose 消除 ISPC 的 SIMD divergence、CUDA 走二元樹的 divergence、ISPC `foreach` 與 Cilk `cilk_spawn` 的抽象與實作差異、cache 與 LRU、Amdahl 定律、roofline 圖、非同步訊息傳遞、pipeline 等。它們沒有計分，但是很好的期中考複習材料。

## 自學怎麼做

1. 沒有 GPU 的話，先決定用哪台機器：照 `cloud_readme.md` 自費開 `g5g.xlarge`，或用任何 NVIDIA GPU。記得每次用完關機。
2. Part 1、2 當暖身，目標是熟悉 `cudaMalloc`、`cudaMemcpy`、kernel launch 與 `cudaDeviceSynchronize()`，以及把第 8 講的 scan 虛擬碼變成可執行的 CUDA。
3. Part 3 先跑 `./render -r cuda rand10k` 和 `./render -r cpuref rand10k` 比對，親眼看到錯在哪。
4. 動手前先在紙上寫下：你的平行化單位是像素、圓、還是畫面上的區塊？每個 thread 怎麼知道要處理哪些圓？順序怎麼保證？
5. Written 2 可以跟 PA3 同時做，第 3、4 題的思路直接可以用在渲染器上。

今晚可以做的一件事：clone [asst3](https://github.com/stanford-cs149/asst3)，只讀 `cudaRenderer.cu` 裡的 `kernelRenderCircles`，用一句話寫下它為什麼同時違反 atomicity 與 order。

## 延伸閱讀

- 另一門課的 CUDA 入門作業：[CMU 11-868 作業一：用 CUDA 寫 MiniTorch 的 map、zip、reduce 與 matmul](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming)
- thread、block 與 shared memory tiling 的另一種講法：[CMU 11-868 L02–L04 GPU 程式模型與加速](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)
- 五個作業的環境需求總表：[Stanford CS149 導讀（系列總覽）](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。重查官方來源，確認仍無對應本文範圍的公開錄影，補上查核日期。

## 參考資料

- [stanford-cs149/asst3 README](https://github.com/stanford-cs149/asst3) — 三部分題目、配分、提示與 checker
- [asst3 cloud_readme.md](https://github.com/stanford-cs149/asst3/blob/master/cloud_readme.md) — AWS `g5g.xlarge`、AMI、T4G 與 CUDA 12.8
- [Written Assignment 2（PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf) — 五道計分題與 14 道練習題
- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25) — PA3 與 Written 2 的日期
- [CS149 Fall 2025 Course Info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo) — 分組規定與成績比重
- [Lecture 8 slide 17（work-efficient scan）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/slide_17) — README 引用的 scan 演算法
- [NVIDIA CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/) — README 推薦的參考手冊，含 compute capability 規格表
- [CUDA Runtime API：memcpy 的同步行為](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html) — README 對 `cudaMemcpy` 同步性的說明來源
