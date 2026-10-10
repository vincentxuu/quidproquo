---
title: "CS149 L4：拿到一個程式，怎麼把它平行化？——分解、分配、協調，以及 Amdahl 定律"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, concurrency, performance, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 5
tldr: "L4 給了一套平行化的思考流程：先分解（decomposition）找出彼此獨立的工作，再分配（assignment）給工作者，再協調（orchestration）通訊與同步，最後對應到硬體。Amdahl 定律提醒你循序部分決定 speedup 上限。貫穿全講的例子是 2D 網格解算器：原本的相依關係很難平行，改用紅黑著色換一種更新順序後，就能用資料平行或共享位址空間兩種模型寫出來。"
description: "Stanford CS149（Fall 2025）第 4 講導讀：平行程式的四個步驟（decomposition、assignment、orchestration、mapping to hardware）、Amdahl 定律、靜態與動態分配、以 Gauss-Seidel 網格解算器示範找相依與紅黑著色，並比較資料平行模型與共享位址空間模型（lock、barrier）如何表達同一個程式。"
draft: false
glossary:
  - term: "Amdahl 定律"
    aliases: ["Amdahl's Law", "阿姆達爾定律"]
    definition: "若一個程式有比例 S 的工作本質上必須循序執行，平行化能帶來的最大 speedup 不超過 1/S，不管處理器有多少個。"
    context: "CS149 L4 用它說明：在大型平行機器上，很小的循序區段就會限制 speedup。"
  - term: "barrier"
    aliases: ["屏障", "barrier synchronization"]
    definition: "一種同步原語：所有執行緒都抵達 barrier 之前，任何一條都不能繼續往下執行。它把計算切成階段，並保守地假設後一階段依賴前一階段的全部結果。"
    context: "L4 的共享位址空間網格解算器用 barrier 分隔紅格與黑格的更新。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-parallelizing-thought-process-en)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 5 篇，對應 10 月 2 日的第 4 講 [Parallelizing Code: An Example Thought Process](https://gfxcourses.stanford.edu/cs149/fall25/lecture/thoughtprocess/)，官方投影片 [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/thoughtprocess/04_progbasics.pdf) 共 74 頁。

Fall 2025 錄影只在 Canvas，本講可對照 2023 公開錄影 [Lecture 4 - Parallel Programming Basics](https://www.youtube.com/watch?v=0-ztm8SKq70)。內容以 2025 投影片為準。

投影片第 3–27 頁是 L3 後半 ISPC 內容的重播（`sinx()`、interleaved 與 blocked、`foreach`、`reduce_add`、SPMD 總結），[上一講的導讀](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc)已經講過。本文從第 28 頁開始，也就是這一講真正的新主題：**寫一個平行程式時，腦中該跑什麼流程？**

## 課程影片來源

本文以 Fall 2025 教材為準；下列 Fall 2023 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=0-ztm8SKq70
title: 2023 Lecture 4 錄影：Parallel Programming Basics
```

原始影片：[2023 Lecture 4 錄影：Parallel Programming Basics](https://www.youtube.com/watch?v=0-ztm8SKq70)

課程與錄影入口：

- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/thoughtprocess/)

## 三個問題，一個目標

第 29 頁把思考流程濃縮成三步：

1. 找出可以平行執行的工作。
2. 切分工作（以及工作用到的資料）。
3. 管理資料存取、通訊與同步。

常見的目標是最大化 speedup，定義是固定計算量下「1 個處理器的時間 ÷ P 個處理器的時間」。投影片也註明其他目標：更高的效率（成本、面積、功耗），或是處理單機放不下的更大問題。

第 30 頁把這三步畫成一條管線，並標注出處是 Culler、Singh 與 Gupta 的教科書：

```mermaid
flowchart LR
  A[要解的問題] -->|Decomposition| B[子問題／tasks]
  B -->|Assignment| C[平行工作者<br/>threads、instances]
  C -->|Orchestration| D[互相溝通的平行程式]
  D -->|Mapping| E[在平行機器上執行]
```

投影片特別強調：**這些責任可能由程式設計師承擔，也可能由系統（編譯器、執行時期、硬體）承擔，或兩者分工。** 這句話是上一講「抽象 vs 實作」的延伸——每一步是誰負責，就是程式模型的設計選擇。

## 第一步：分解，關鍵是找相依

第 31 頁：把問題拆成可以平行執行的 task，通常至少要多到能讓所有執行單元都忙起來。**分解的關鍵挑戰是找出相依關係**（或找出「沒有相依」的地方）。

### Amdahl 定律：循序的部分決定上限

第 32 頁的定義：令 S 為循序執行時本質上必須循序的比例（相依關係讓它無法平行），平行化能帶來的最大 speedup 不超過 1/S。

第 33–35 頁用一個兩步驟的影像計算示範。對一張 N×N 的影像：

- 步驟 1：每個像素亮度乘以 2（每個像素獨立）
- 步驟 2：算所有像素的平均值

循序版兩步各花約 N² 時間。第一次嘗試只平行化步驟 1，步驟 2 仍循序執行，speedup 最多 2 倍——不管 P 多大。第二次嘗試把步驟 2 也拆成「各自算部分和，再循序合併」，步驟 2 的時間變成 N²/P + P。投影片說，當 N 遠大於 P 時 speedup 趨近 P。多出來的那個 P，就是平行演算法合併部分和的額外成本。

第 37 頁給了一個極端的例子：Summit 超級電腦有 27,648 顆 GPU，約 1.48 億個 ALU。如果程式只有 0.1% 是循序的，最大 speedup 是多少？代入 1/S，答案是 1000 倍——連機器規模的萬分之一都不到。

### 誰來分解？

第 38 頁：多數情況下是程式設計師。自動把循序程式分解成獨立 task 仍是困難的研究問題：編譯器要分析程式、找出相依，而相依關係可能取決於執行時期的資料。投影片說研究者在簡單的巢狀迴圈上有些成果，但針對複雜通用程式的「神奇平行化編譯器」還沒有出現。

## 第二步：分配，靜態或動態

第 39 頁：把 task 分給工作者。「工作者」可能是執行緒、program instance、向量 lane。目標是**負載平衡**與**降低通訊成本**。分配可以在程式執行前靜態決定，也可以在執行時動態決定。投影片也指出，程式設計師通常負責分解，但很多語言和執行時期會接手分配。

投影片給了三個例子：

| 例子 | 誰分配 | 方式 |
|---|---|---|
| C++11 threads 版 `sinx()`（第 40 頁） | 程式設計師 | 靜態、blocked：前半陣列給新執行緒，後半給主執行緒 |
| ISPC 的 interleaved 版與 `foreach` 版（第 41 頁） | 前者程式設計師、後者 ISPC | 靜態 |
| ISPC tasks（第 42 頁） | ISPC 執行時期 | 動態：`launch[100]` 產生 100 個 task，執行緒池裡的工作執行緒做完一個，就去清單上領下一個還沒做的 |

第三個例子回答了 [PA1](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance) Program 3 的一部分疑問：task 數量多於核心數時，動態分配能自然地把快做完的核心補上新工作。

## 第三步：協調

第 43 頁列出 orchestration 包含的事：

- 安排通訊的結構
- 必要時加入同步，以保住相依關係
- 在記憶體中組織資料結構
- 排程 task

目標是降低通訊與同步的成本、保持資料存取的 locality、減少額外負擔。投影片提醒，這些決定很受機器細節影響：如果同步很貴，程式設計師就會少用。

## 第四步：對應到硬體

第 44 頁給了三種「誰把工作者放到硬體上」的例子：

- 作業系統：把一條執行緒放到 CPU 核心的硬體執行 context 上
- 編譯器：把 ISPC program instance 對應到向量指令的 lane
- 硬體：把 CUDA thread block 分派到 GPU 核心（之後的講次會談）

投影片也列了兩個看似相反的放置策略：把互相合作的執行緒放在同一個核心（提高 locality、降低通訊成本），或是把不相關的執行緒放在同一個核心（一條受頻寬限制、另一條受運算限制，一起跑更能用滿機器）。

## 貫穿全講的例子：2D 網格解算器

第 45 頁起，投影片用 Culler、Singh、Gupta 書中的例子，從頭走一遍流程。

### 問題與循序演算法

在 (N+2)×(N+2) 的網格上解偏微分方程，用 Gauss-Seidel 迭代：每個格點更新為自己與上下左右四個鄰居的加權平均（係數 0.2），一直掃到整張網格的平均變化量小於門檻為止（第 46–47 頁）。

### 找相依：有平行度，但很難用

第 48–49 頁分析一次迭代內的相依：每個格點依賴它左邊的格點，每一列依賴上一列。結果是**沿著對角線的格點彼此獨立**。

好消息是有平行度；壞消息是它很難利用。對角線在一開始和結束時很短，平行度很低；而且每做完一條對角線就要同步一次。

### 換一個演算法：紅黑著色

第 50 頁提出關鍵的一步：**改變演算法，讓它更適合平行。** 改變格點的更新順序，新演算法會收斂到（近似）同一個解，只是收斂的路徑不同，浮點數值也會不同，但仍在誤差門檻內。投影片坦白說，這需要懂 Gauss-Seidel 方法的領域知識才能判斷這個改動是允許的——但這是平行程式設計的常見手法。

第 51 頁的新做法是**紅黑著色**：把網格像西洋棋盤一樣分成紅格與黑格。先平行更新所有紅格，完成後再平行更新所有黑格（黑格依賴紅格的新值），重複直到收斂。

第 52–54 頁討論怎麼把格點分給處理器。投影片問「哪種分配比較好？」，回答是「取決於程式跑在什麼系統上」。每一輪都要把更新後的邊界格點送給其他處理器，而 blocked 分配（每個處理器分到連續幾列）需要傳的資料比較少。

**今晚可以做的事**：拿你自己寫過的一個迴圈，畫出每次迭代讀、寫哪些位置，找出迭代之間的相依。如果相依卡住平行，想一想有沒有「換個順序也能得到可接受結果」的改法——這就是紅黑著色的思路。

## 同一個程式，兩種寫法

第 55 頁說，這個解算器可以用兩種思考方式寫：資料平行，或 SPMD／共享位址空間。

### 資料平行模型

第 57 頁的虛擬碼用 `for_all (red cells (i,j))` 表達紅格更新，差異量用內建的 `reduceAdd` 累加。投影片把四步驟對上：

- 分解：每個格點的處理是獨立的工作
- 分配：沒有寫（投影片標為「???」，交給系統）
- 協調：由系統處理——內建的 `reduceAdd` 通訊原語，以及 `for_all` 結尾隱含的「等所有工作者完成」

### 共享位址空間模型

第 59–60 頁改用 SPMD 執行模型：所有執行緒都執行同一個 `solve()`，每條用自己的 `threadId` 算出負責的列範圍。這時**同步要程式設計師自己來**，常用的原語是 lock（互斥，一次只有一條執行緒在臨界區）和 barrier（等所有執行緒都到這一點）。

第 61–67 頁補上共享位址空間的基本觀念：

- 執行緒透過讀寫共享變數溝通，投影片的比喻是一塊人人都能讀寫的布告欄。
- 為什麼需要互斥：`x++` 其實是「載入到暫存器、加一、存回去」三道指令，兩條執行緒交錯執行時，兩次加一可能只剩一次。這三道指令必須是**原子的**。
- 保住原子性的機制：lock／unlock 包住臨界區、某些語言的 `atomic { }` 區塊、硬體支援的原子讀改寫操作（例如 `atomicAdd`）。
- 投影片指出，到目前為止課堂上的討論其實都預設了共享位址空間，它是循序程式設計的自然延伸。

第 68–69 頁回到解算器：每條執行緒把差異量先累加到**私有**的 `myDiff`，一輪結束時才用 lock 加到全域的 `diff`。這跟上一講 ISPC 陣列加總「各自累加部分和、最後再合併」是同一招，目的都是減少對共享變數的爭用。

### Barrier：保守地表達相依

第 70 頁定義 barrier：barrier 之前所有執行緒的計算，都要在 barrier 之後任何執行緒的計算開始前完成。換句話說，**barrier 假設後面的每個計算都依賴前面的每個計算**——這是一種保守的相依表達方式，它把計算切成階段。

第 71 頁問：解算器為什麼需要三個 barrier？第 72 頁給出一個只用一個 barrier 的版本：把全域 `diff` 變成三份，連續的迭代輪流使用不同的那一份，藉此移除相依。投影片把這個技巧命名為**用記憶體空間換取移除相依**，並說這是常見的平行程式設計技巧。三個 barrier 各自保護什麼、為什麼三份 `diff` 就夠，值得你自己推一遍。

### 兩種模型的比較

第 73 頁的對照：

| | 資料平行模型 | 共享位址空間模型 |
|---|---|---|
| 同步 | 單一邏輯控制流，`forall` 的迭代可由系統平行化；迴圈結尾有隱含 barrier | 共享變數需要互斥（例如 lock）；用 barrier 表達階段之間的相依 |
| 通訊 | 隱含在載入與儲存中；複雜模式用內建原語（例如 reduce） | 隱含在對共享變數的載入與儲存中 |

## 本講總結

第 74 頁的總結：

- Amdahl 定律：平行化的最大 speedup 受限於程式中循序執行的部分。
- 建立平行程式的四個面向：分解出獨立工作、把工作分配給工作者、協調工作者的處理、對應到硬體。後面幾講會一再回到每個階段該怎麼做出好的決定。
- 今天的重點：找出相依關係。
- 接下來的重點：找出 locality、減少同步。

下一講 L5 就從「分配」這一步接著談：怎麼平衡負載，又不付太多排程成本。

延伸閱讀：本講的 lock 與原子性只講到動機。想看作業系統層面的完整討論，可以讀站上 [CS111 第 4 講：並行與原子性](/posts/learning/2026-08-22-stanford-cs111-lecture-04-concurrency-atomicity)與[第 5 講：lock 與 condition variable](/posts/learning/2026-08-22-stanford-cs111-lecture-05-locks-condition-variables)；CS149 自己會在系列第 20–21 篇談 lock 的實作與 lock-free 程式設計。

系列導覽：上一篇 [PA1 + Written 1：四核 CPU 效能分析](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance)｜下一篇 [L5 工作分配與排程](/posts/ai/2026-09-30-cs149-work-distribution-scheduling)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 4 講義頁（逐頁投影片）](https://gfxcourses.stanford.edu/cs149/fall25/lecture/thoughtprocess/)
- [Lecture 4 投影片 PDF：Parallelizing Code: An Example Thought Process](https://gfxcourses.stanford.edu/cs149/fall25content/media/thoughtprocess/04_progbasics.pdf)
- [2023 Lecture 4 錄影：Parallel Programming Basics](https://www.youtube.com/watch?v=0-ztm8SKq70)
- [CS149 2023 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
