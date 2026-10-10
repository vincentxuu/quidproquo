---
title: "CS149 L5 工作分配與排程：從 work queue 到 Cilk 的 work stealing"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 6
tldr: "負載平衡的難處在於它和排程成本互相拉扯：任務切得越細越好平衡，但每次領任務都要付同步成本。CS149 L5 先把選項排成一條從 static 到 dynamic 的連續光譜，再拆解 Cilk 的執行期：每個 worker 一條 deque，spawn 時先跑 child、把 continuation 留給別人偷，閒置的 thread 從別人 deque 的頂端偷走最大塊的工作。"
description: "Stanford CS149（Fall 2025）Lecture 5 導讀：static、semi-static、dynamic assignment 的適用條件，task granularity 的取捨，長任務先排，distributed work queue，以及 Cilk Plus 的 cilk_spawn／cilk_sync 語意、child stealing 與 continuation stealing、deque 偷取與 greedy join 的實作。"
draft: false
glossary:
  - term: "work stealing"
    aliases: ["工作竊取"]
    definition: "每個 worker thread 維護自己的工作佇列，自己的做完了就去別的 thread 的佇列偷工作的排程策略。"
    context: "CS149 L5 以 Cilk Plus 執行期為例，說明它如何在低同步成本下達成負載平衡。"
  - term: "continuation stealing"
    aliases: ["run child first"]
    definition: "遇到 spawn 時，當前 thread 先執行被 spawn 的 child，把呼叫端剩下的程式（continuation）放進佇列供其他 thread 偷。"
    context: "Cilk Plus 採用的策略；沒發生偷取時，執行順序與拿掉 spawn 的循序程式相同。"
  - term: "parallel slack"
    definition: "可獨立執行的工作量與機器平行執行能力的比值。"
    context: "L5 投影片說實務上約 8 是不錯的比值：太少難平衡，太多則管理細粒度工作的成本上升。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-work-distribution-scheduling-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 6 篇，接續 [L4 平行化的思考流程](/posts/ai/2026-09-30-cs149-parallelizing-thought-process)，範圍是 Lecture 5「Program Optimization 1: Work Distribution and Scheduling」（2025-10-07）。

用到的官方材料是 [L5 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt1/05_progperf1.pdf)（63 頁，另有[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt1/)）。Fall 2025 的錄影只放在 Canvas，官方首頁指向 2023 年版的 [Lecture 5 錄影](https://www.youtube.com/watch?v=mmO2Ri_dJkk)當替代。本文內容以 2025 投影片為準，影片只列為聽講補充。這一講的存取等級是 **A3**：投影片完整公開，缺的是當期錄影。

投影片「Today」列了三項：收尾 L4 的 grid solver、基本的負載平衡技巧、深入 Cilk 的排程器。本文只處理後兩項。

## 課程影片來源

本文以 Fall 2025 教材為準；下列 Fall 2023 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=mmO2Ri_dJkk
title: CS149 2023 Lecture 5 錄影（補充材料）
```

原始影片：[CS149 2023 Lecture 5 錄影（補充材料）](https://www.youtube.com/watch?v=mmO2Ri_dJkk)

課程與錄影入口：

- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt1/)

## 三個互相打架的目標

L5 開頭把效能調校定義成「反覆修正 decomposition、assignment、orchestration 的選擇」，並列出三個彼此衝突的目標：

1. 把工作平均分到所有執行資源上
2. 減少通訊，避免 stall
3. 減少為了增加平行度、管理分配、減少通訊而多做的額外工作（overhead）

第二項是[下一篇 L6](/posts/ai/2026-09-30-cs149-locality-communication) 的主題。這一篇處理第一項和第三項怎麼互相拉扯。

投影片的 TIP #1 很短：**先寫最簡單的解法，量過效能，再決定要不要做得更好。**

## 一點點不平衡就很貴

理想狀態是所有處理器從頭忙到尾，同時收工。投影片的例子是四個處理器裡 P4 多做一倍的工作：P4 就要多花一倍時間，整支程式的執行時間有一半等於是循序的。這部分工作只占總量約 1/5，對應 L4 的 Amdahl's law 裡 S = 0.2。

## Static、semi-static、dynamic 是一條光譜

**Static assignment**：分配方式不依賴執行時的動態行為。它不一定在編譯期決定。只要在知道工作量和 worker 數量時就定下來，都算 static，所以可以依輸入大小或 thread 數而變。好處是簡單，執行期成本幾乎為零，通常只多一點索引運算。[PA1](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance) Program 1 讓學生試各種 grid 切法，用的就是這種分配。

它適用的條件是工作的成本和數量都可預測：

- 每個任務成本相同（投影片例：12 個等長任務，每個處理器 3 個）
- 成本不同但已知
- 成本的統計性質可預測，例如平均相同

**Semi-static**：近期的過去能預測不久的未來。程式定期 profile 自己、重新調整分配，兩次調整之間的分配是固定的。投影片舉粒子模擬與 adaptive mesh 為例：粒子移動或網格變化得慢，就不必常常重分。

**Dynamic assignment**：任務的執行時間或總數事先不知道，就在執行期分配。投影片的例子是對 N = 1024 個數做 `test_primality`，每個數花多久不知道。SPMD 的寫法是用一個共享計數器，每個 thread 在 lock 裡領下一個 i：

```cpp
while (1) {
  int i;
  lock(counter_lock);
  i = counter++;
  unlock(counter_lock);
  if (i >= N) break;
  is_prime[i] = test_primality(x[i]);
}
```

更一般的形式是**共享的 work queue**：worker thread 從佇列拉工作，產生新工作時推回佇列。

L5 摘要頁把 static 和 dynamic 畫成一條連續的選擇光譜。對工作量知道得越多，就越該用這些知識降低不平衡和管理成本；極端情況下系統什麼都知道，就用完全 static 的分配。

## 任務要切多大

上面那段程式一次只領一個元素。平衡很好，但每個元素都要進一次 critical section，而 critical section 是循序執行的，這又回到 Amdahl's law。投影片問的是：「所以這**真的**是問題嗎？」答案取決於 `test_primality` 相對於領任務有多貴。

把 granularity 調成 10，每次領 10 個元素，進 critical section 的次數就少了 10 倍。取捨寫在「Choosing task size」這頁：

- 任務數要遠多於處理器，dynamic assignment 才有空間平衡，這推向小任務
- 任務數又要盡量少，才能降低管理成本，這推向大任務
- 最佳大小取決於很多因素。這是整門課反覆出現的主題：**要了解你的 workload，也要了解你的機器**

<details>
<summary>投影片程式碼的一個小筆誤</summary>

「Increasing task granularity」那頁的內層迴圈寫成 `for (int j=i; j<end; j++) is_prime[i] = test_primality(x[i]);`，迴圈變數是 `j`，陣列索引卻還是 `i`。照投影片的意思，索引應該是 `j`。讀投影片時別被它絆住。

</details>

## 長任務先排，以及分散式佇列

就算用 dynamic queue，任務依序由左到右發下去，最長的那個剛好排在最後，其他處理器早已做完、在旁邊等它。投影片給了兩種解法：

- **切成更多更小的任務**，讓「長竿子」相對整體變短。但同步成本可能上升，而且長任務也可能本質上就是循序的，切不開。
- **更聰明的排程：長任務先排**。做長任務的 thread 做的任務數比較少，但總工作量和別人差不多。代價是你需要對工作成本有一些預測能力。

另一個問題是所有 worker 都搶同一個佇列。解法是**每個 worker 一個佇列**：從自己的佇列拉、往自己的佇列推，自己的空了才去別人那裡**偷**。

佇列裡的工作也不一定彼此獨立。任務管理系統可以追蹤依賴，一個任務要等它依賴的任務都完成才會發給 worker。投影片用的介面長這樣：

```cpp
foo_handle = enqueue_task(foo);              // 與先前所有任務無關
bar_handle = enqueue_task(bar, foo_handle);  // foo 完成前不能執行
```

這正是 [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling) Part B 要你實作的東西。

## Fork-join 與 Cilk Plus

L5 後半換到 divide-and-conquer 演算法。quicksort 切完之後，左右兩半互相獨立，這種結構適合用 **fork-join** 表達。投影片用 Cilk Plus：一個 C++ 語言擴充，最早由 MIT 開發，後來成為開放標準，進入 GCC 和 Intel ICC。

| 語法 | 語意 |
|---|---|
| `cilk_spawn foo(args);` | fork：呼叫 foo，但呼叫端可以和 foo 非同步地繼續往下執行 |
| `cilk_sync;` | join：等到目前這個函式 spawn 出去的呼叫全部完成才返回 |

每個含 `cilk_spawn` 的函式結尾都有隱含的 `cilk_sync`。所以 Cilk 函式一返回，它衍生的所有工作都已經完成。

投影片特別強調**抽象與實作的區分**：`cilk_spawn` 只說被 spawn 的呼叫「可以」和呼叫端並行，沒說何時、由誰執行。投影片因此問：把 `cilk_spawn foo()` 實作成普通函式呼叫，算不算正確的 Cilk？下一點給了線索：抽象只給出「可以並行」的許可，真正對排程加上限制的是 `cilk_sync`，所有 spawn 出去的呼叫都要在它返回前完成。

平行 quicksort 的寫法是在問題夠小時改呼叫 `std::sort`，因為 spawn 的成本會蓋過平行化的好處：

```cpp
void quick_sort(int* begin, int* end) {
  if (begin >= end - PARALLEL_CUTOFF)
    std::sort(begin, end);
  else {
    int* middle = partition(begin, end);
    cilk_spawn quick_sort(begin, middle);
    quick_sort(middle+1, last);
  }
}
```

寫 fork-join 程式的經驗法則：暴露出來的獨立工作至少要填滿機器，最好多一些，讓負載有平衡空間。投影片把這個比值叫 **parallel slack**，並說實務上約 8 是不錯的值。但也不能多到讓每份工作太碎。

## Cilk 執行期怎麼排程

### 為什麼不是每個 spawn 開一條 pthread

最天真的做法：每個 `cilk_spawn` 呼叫 `pthread_create`，`cilk_sync` 翻成對應的 `pthread_join`。投影片列出的問題有四個：spawn 太重、同時跑的 thread 遠多於核心、context switch 成本，以及 working set 變大、cache locality 變差。

Cilk Plus 的執行期改用 **worker thread pool**，thread 數剛好等於機器的執行 context 數。投影片舉的例子是有 Hyper-Threading 的四核筆電配八個 worker。實際上執行期通常是第一次 spawn 時才懶惰地建立 worker，ISPC 執行 task 的 worker 也是這樣。

### 跑 child 還是跑 continuation

碰到 `cilk_spawn foo(); bar();` 時，被 spawn 的 `foo()` 叫 child，呼叫端剩下的部分（這裡是 `bar()`）叫 continuation。當前 thread 只能先做其中一個，另一個放進自己的工作佇列，閒置的 thread 可以把它偷走。

| 策略 | 先做 | 放進佇列供偷 | `for` 迴圈裡 spawn N 次的行為 |
|---|---|---|---|
| child stealing | continuation | child | 呼叫端先把 N 個 child 全部排進佇列，像廣度優先走訪，佔 O(N) 空間。沒人偷時的執行順序和拿掉 spawn 的程式很不一樣 |
| continuation stealing | child | continuation | 佇列裡永遠只有一個「剩下的迴圈」可偷，像深度優先。沒人偷時執行順序和循序程式相同 |

投影片提到一個可以證明的結果：continuation stealing 下，T 個 thread 的工作佇列空間不會超過單執行緒堆疊空間的 T 倍。Cilk Plus 選的就是這一種。

### deque：自己從底部拿，別人從頂部偷

每個 worker 的佇列是一條 **deque**（雙端佇列）。本地 thread 在尾端（底部）push/pop，其他 thread 從頭端（頂部）偷。投影片用 200 個元素的 quicksort 示範：thread 0 一路往下切，deque 由上而下累積 `cont: 101-200`、`cont: 51-100`、`cont: 26-50`。

閒置的 thread 會**隨機**挑一個對象來偷，而且從頂部偷。投影片列了三個理由：

- 頂部是最早放進去、最大塊的工作，一次偷到的最多，偷的次數就少
- 搭配 run-child-first，每個 thread 做的工作 locality 最好
- 偷的人和本地 thread 動的是 deque 的兩端，不會搶同一個元素，所以有高效的 lock-free deque 實作

投影片還比較了兩種迴圈寫法。一種是在 `for` 迴圈裡逐一 `cilk_spawn foo(i)`；另一種是 `recursive_for`，把區間對半切、spawn 一半、自己繼續切另一半。後者產生工作的速度本身也是平行的，所以更快填滿整台機器。child-first 的 work stealing 排程器本來就預期 divide-and-conquer 式的平行。

### sync 怎麼實作

- **沒人偷的情況**：`cilk_sync` 什麼事都不用做，是 no-op。
- **有人偷的情況**：第一次發生偷取時，執行期為這個 spawn 區塊建立一個 descriptor，記錄「已 spawn 幾個、完成幾個」。投影片一格一格推演 10 次迭代的迴圈，從 `spawn: 1, done: 0` 一路走到 `spawn: 10, done: 10`。最後一個 spawn 完成時，持有 continuation 的 thread 接著執行 `cilk_sync` 之後的 `bar()`。

Cilk 用的是 **greedy join scheduling**：

- 沒事做的 thread 一律去偷，只有整個系統都沒得偷時才閒置
- 發起 spawn 的 thread 不一定是執行 `cilk_sync` 之後那段程式的 thread
- 記錄偷取和管理 sync 的成本**只在發生偷取時才付**。偷走的工作夠大，偷取就不常發生；大部分時間 thread 只是在自己的 deque 上 push/pop

## 這篇怎麼接到作業

| 本講概念 | 出現在哪 |
|---|---|
| static vs dynamic assignment | PA1 Program 1、Program 3（投影片直接問：為什麼切成很多 ISPC task 會變快？） |
| task granularity 與同步成本 | [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling) Part A 的測試有很多極輕量的任務 |
| worker thread pool | PA2 Part A Step 2 |
| 依賴感知的任務佇列 | PA2 Part B 的 `runAsyncWithDeps()` |

**怎麼做**：打開投影片第 16 頁「Choosing task size」，拿你手邊任何一段 `parallel for` 或 thread pool 程式，寫下兩個數字：單一任務大概跑多久、領一次任務大概花多久。兩者差距不到兩個數量級的話，先試著把 granularity 放大。

## 這一篇可以確認與不能確認的

可以確認：L5 投影片 PDF 的內容與課程首頁的講次日期。不能確認：Fall 2025 課堂上的口頭補充（錄影不公開），以及 2023 年錄影與 2025 投影片的逐頁差異。本文沒有依影片內容寫作。

延伸閱讀：OS 層級的 CPU 排程不在本講範圍，可以讀 [CS111 Lecture 8：CPU scheduling](/posts/learning/2026-08-22-stanford-cs111-lecture-08-cpu-scheduling)。

系列導覽：上一篇 [L4 平行化的思考流程](/posts/ai/2026-09-30-cs149-parallelizing-thought-process)｜下一篇 [L6 Locality、通訊與 arithmetic intensity](/posts/ai/2026-09-30-cs149-locality-communication)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁與講次表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 5: Program Optimization 1: Work Distribution and Scheduling（投影片 PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt1/05_progperf1.pdf)
- [Lecture 5 逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt1/)
- [CS149 2023 Lecture 5 錄影（補充材料）](https://www.youtube.com/watch?v=mmO2Ri_dJkk)
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Assignment 2 README（stanford-cs149/asst2）](https://github.com/stanford-cs149/asst2)
