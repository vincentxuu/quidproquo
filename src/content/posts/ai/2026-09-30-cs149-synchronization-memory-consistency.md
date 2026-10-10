---
title: "CS149 L15 記憶體一致性：write buffer 讓 r1 = r2 = 0 變成可能"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, parallelism, concurrency, hardware, systems]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 20
tldr: "Coherence 只管單一位址；memory consistency 管的是不同位址之間的讀寫，在別的 thread 眼中以什麼順序生效。CS149 L15 用兩個 thread、兩個變數的例子說明：sequential consistency 下 r1 = r2 = 0 不可能，但每顆現代處理器都有的 write buffer 會讓讀跑到寫前面，於是它變成可能。TSO、PSO、weak ordering 依序放寬更多順序換取效能，fence 與同步原語再把需要的順序補回來。對應用程式設計師的結論很短：寫沒有 data race 的程式，用同步函式庫，C11、C++11、Java 5 就保證你看到 sequential consistency。"
description: "Stanford CS149（Fall 2025）Lecture 15 導讀：coherence 與 consistency 的區別、四種記憶體操作順序、sequential consistency 與 switch 比喻、write buffer 與 TSO／PC、PSO、weak ordering 與 release consistency、x86 的 lfence／sfence／mfence、data race 與 SC for DRF。另說明官方講次標題中的「Implementing Synchronization」在 Fall 2025 投影片中實際出現在 L16。"
draft: false
glossary:
  - term: "memory consistency model"
    aliases: ["記憶體一致性模型"]
    definition: "定義硬體與編譯器可以如何重新排序對不同位址的讀寫，是它們與應用軟體之間的契約。"
    context: "CS149 L15 強調它和 cache 是否存在無關；沒有 cache 的系統一樣需要 consistency model。"
  - term: "sequential consistency"
    aliases: ["SC", "循序一致性"]
    definition: "所有處理器的記憶體操作看起來像以某個單一序列執行，且每個 thread 的操作在序列中維持程式順序。"
    context: "L15 引 Lamport 1976 的定義，並用「記憶體隨機挑一個處理器、完整執行它的一個操作」的 switch 比喻說明。"
  - term: "total store ordering"
    aliases: ["TSO"]
    definition: "只放寬「寫後讀」順序的一致性模型：處理器可以讓自己的讀跑到自己的寫前面，但其他處理器在寫入被所有處理器看見之前讀不到新值。"
    context: "L15 說 x86 採用的是一種未完整規格化的 TSO。"
  - term: "data race"
    aliases: ["資料競爭"]
    definition: "兩個不同處理器對同一位址的存取，至少一個是寫，且沒有被同步操作排定先後。"
    context: "L15 的結論是沒有 data race 的程式在非 SC 系統上也會得到 SC 的結果。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 20 篇，接續 [L14 Cache coherence](/posts/ai/2026-09-30-cs149-cache-coherence)，範圍是 Lecture 15（2025-11-13）。

用到的官方材料是 [L15 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf)（60 頁，另有[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/sync_consistency/)）。Fall 2025 的錄影只放在 Canvas，官方首頁指向 2023 年版的 [Lecture 12 Memory Consistency 錄影](https://www.youtube.com/watch?v=nFXWmo9MFiY)當替代。本文以 2025 投影片為準，影片只列為聽講補充。存取等級是 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：投影片完整公開，缺的是當期錄影。

## 課程影片來源

本文以 Fall 2025 教材為準。官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的 YouTube 播放清單；下列 Fall 2023 錄影是主題相近的相關補充影片，內容可能與 2025 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=nFXWmo9MFiY
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 12 - Memory Consistency
```

原始影片：[Stanford CS149 I Parallel Computing I 2023 I Lecture 12 - Memory Consistency](https://www.youtube.com/watch?v=nFXWmo9MFiY)

課程與錄影入口：

- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/sync_consistency/)

## 先說清楚這一講的範圍

課程首頁把 L15 標為「Implementing Synchronization + Memory Consistency」，描述是「Fine-grained synchronization via locks, motivation for relaxed consistency, implications to programmers」。實際打開 PDF，封面寫的是「Memory Coherency and Consistency」，內容分兩段：

- **第 1–20 頁**：幾乎完整重複 [L14](/posts/ai/2026-09-30-cs149-cache-coherence) 的 MSI、MESI、directory 與 false sharing。這部分請看上一篇。
- **第 21–60 頁**：memory consistency，本文的主體。

L15 的 PDF 裡**沒有**鎖的實作。test-and-set、test-and-test-and-set、ticket lock 這些內容出現在 Fall 2025 的 [L16 投影片](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf)，封面是「Implementing Locks」。本系列把它們放在下一篇 [L16 細粒度鎖與 lock-free](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free)。本文只寫 L15 投影片裡有的東西。

投影片第 2 頁也公告了期中考：11 月 18 日晚上，範圍是 L1 到 L14（到 cache coherence 為止），全部閉卷。

## Coherence 管一個位址，consistency 管所有位址

L14 定義 coherence 的時候只看單一位址 X：所有處理器要同意對 X 的讀寫順序。Consistency 看的是**不同位址**：thread 0 對 X 的寫，相對於它對 Y 的讀寫，在 thread 1 眼中以什麼順序生效。

投影片換了一個更直覺的說法：

- Coherence 的目標是讓平行電腦的記憶體系統**表現得像 cache 不存在**。沒有 cache 的系統不需要 coherence。
- Consistency 定義對不同位址的讀寫**被允許**有什麼行為。不論有沒有 cache，都要規定這件事。

後面還有一頁「Clarification（make sure you get this!）」再強調一次：coherence 問題來自硬體把資料**複製**到多個 cache；relaxed consistency 問題來自硬體**重新排序**記憶體操作。兩個最佳化，兩個問題。

誰需要在意？投影片列了三種人：要寫同步函式庫的人、會做 kernel 或 driver 開發的人、要寫 lock-free 資料結構的人。投影片的 TL;DR：多處理器會用反直覺的方式重排記憶體操作，這是效能所必需的；應用程式設計師很少看到，系統開發者（OS、編譯器）天天看到。

## 四種順序

程式定義了一串 load 和 store，這是它們的「程式順序」。投影片把兩個相鄰操作之間的順序要求分成四種：

| 順序 | 意思 |
|---|---|
| W<sub>X</sub> → R<sub>Y</sub> | 寫 X 要在後面的讀 Y 之前生效 |
| R<sub>X</sub> → R<sub>Y</sub> | 讀 X 要在後面的讀 Y 之前完成 |
| R<sub>X</sub> → W<sub>Y</sub> | 讀 X 要在後面的寫 Y 之前完成 |
| W<sub>X</sub> → W<sub>Y</sub> | 寫 X 要在後面的寫 Y 之前生效 |

「寫要在讀之前生效」的意思是：寫的結果要在讀發生時已經對其他人可見。

## 一個兩行的例子

初始 A = B = 0：

```
Proc 0          Proc 1
(1) A = 1       (3) B = 1
(2) print B     (4) print A
```

可能印出什麼？投影片說不該出現「00」或「10」。它用 happens-before 圖解釋：把每個結果需要的先後關係畫成邊，如果圖裡有環，這個結果就不可能，因為某個事件得發生在自己之前。

### Sequential consistency

Lamport 在 1976 年提出（他在 2013 年拿到 Turing Award）：所有操作看起來以某個單一順序執行，就像大家在操作同一塊共享記憶體，而且每個 thread 的操作在這個順序裡維持程式順序。SC 系統維持全部四種順序。

投影片的比喻是一個開關：每個處理器照程式順序發出 load/store，記憶體隨機挑一個處理器，把它的一個操作完整做完，再挑下一個。投影片接著一步步走完 `A=1; r1=B` 與 `B=1; r2=A` 的一種交錯，結果 r1 = r2 = 1。

## 為什麼要放寬：寫太慢

SC 的問題：`A = 1` 和 `r1 = B` 根本不衝突，卻要等寫做完才能讀。投影片說寫入要花上百個 cycle，而且在有 coherence 的系統裡，一次記憶體存取可能還包括找資料、送作廢訊息等額外工作。

放寬順序的動機就是**隱藏記憶體延遲**：彼此獨立的記憶體操作可以重疊。

### Write buffer

最典型的最佳化是 write buffer：處理器把寫丟進自己的 buffer 就繼續往下走，讀也會先查自己的 buffer。回到剛才的例子：

```
初始 A = B = 0
Proc 0          Proc 1
(1) A = 1       (3) B = 1
(2) r1 = B      (4) r2 = A
```

r1 = r2 = 0 可能嗎？SC 下不可能。有 write buffer 時，兩邊的寫都還停在各自的 buffer，兩邊的讀都從記憶體讀到 0，於是**可能**。

投影片說每顆現代處理器都用 write buffer，包括 Intel x86、ARM、RISC-V，所以需要比 SC 弱的模型。

<details>
<summary>TSO 與 PC 的差別</summary>

兩者都只放寬 W<sub>X</sub> → R<sub>Y</sub>，W<sub>X</sub> → W<sub>Y</sub> 仍然成立，同一個 thread 的寫照程式順序發生。

- **Total Store Ordering（TSO）**：處理器 P 可以在它對 A 的寫被所有人看見之前，先讀 B（讀跑到自己的寫前面）。但其他處理器在 A 的寫被所有人看見之前，讀不到 A 的新值。
- **Processor Consistency（PC）**：任何處理器都可能在 A 的寫被所有人看見之前讀到新值。

投影片說 TSO 比 SC 稍難推理，x86 用的是一種沒有完整規格化的 TSO。

</details>

## 再放寬：寫也能重排，全部都能重排

**Partial Store Ordering（PSO）** 連 W<sub>X</sub> → W<sub>Y</sub> 也放寬。投影片用這個例子說明後果：

```c
// Thread 1 (P1)        // Thread 2 (P2)
A = 1;                  while (flag == 0);
flag = 1;               print A;
```

在 PSO 下，P2 可能先看到 `flag` 變 1，才看到 `A` 變 1，於是印出 0。

為什麼硬體想做這些重排？投影片給了對應：

- W → W：write buffer 裡一個寫 cache miss、另一個 hit，硬體可能讓 hit 的先完成
- R → W、R → R：亂序執行會重排互相獨立的指令

這些重排對單一指令流都是合法的最佳化。問題只在別的 thread 看得到。

最寬鬆的一檔是**四種順序全部放寬**，對資料操作不做任何保證，讀盡量早、寫盡量晚。投影片舉的例子是 weak ordering（WO）與 release consistency（RC）。

## 把順序補回來：fence 與同步原語

投影片自己也承認重排像一場惡夢。每種架構都提供讓順序變嚴格的同步原語：

- **Fence（memory barrier）**：fence 之前的所有記憶體操作完成後，之後的操作才能開始。能防止重排，但代價高。
- **針對單一位址的原語**：read-modify-write、compare-and-swap、transactional memory 等。

x86 大致是 TSO，軟體需要模型沒保證的順序時，可以用 `_mm_lfence`（等所有 load 完成）、`_mm_sfence`（等所有 store 完成）、`_mm_mfence`（等所有記憶體操作完成）。投影片形容 ARM 的模型「非常寬鬆」，並附了 Bartosz Milewski 談 x86 fence 的文章、ARM 的 barrier litmus test 手冊，以及 Cambridge 整理的 weak memory 論文清單。

## Data race 與「SC for DRF」

投影片指出，前面每個例子都有 data race：兩個不同處理器存取同一位址，至少一個是寫，而且沒有被同步操作（fence、帶 acquire/release 語意的操作、barrier 等）排定先後。有 race 的程式，輸出取決於處理器的相對速度。

關鍵結論：**沒有 data race 的程式，在非 SC 的系統上也會得到 SC 的結果。** 因為所有衝突的存取都被同步排好順序，而同步會強制 sequential consistency。實務上你碰到的大多數程式都透過鎖、barrier 這類同步函式庫同步，不會像範例一樣直接讀寫共享變數。

語言層級也一樣。編譯器同樣會重排，有些重排程式設計師看不到，有些看得到，所以語言也需要記憶體模型。C11、C++11 與 Java 5 都保證**沒有 data race 的程式得到 sequential consistency**（SC for DRF），編譯器負責插入必要的同步去對付底下的硬體模型。有 race 的程式則**沒有任何保證**，理由是多數程式設計師本來就會把有 race 的程式當成 bug。投影片的結論一句話：用同步函式庫。

投影片的兩頁總結：

- Relaxed consistency 的動機是效能，代價之一是軟體複雜度：程式設計師或編譯器要在需要的地方插入同步。實務上這些複雜度封裝在 lock/unlock、barrier、fence 這類函式庫原語裡。設計原則是讓常見情況快：大多數存取不衝突，就不要讓系統每次都付衝突的代價。
- Consistency model 是硬體或編譯器與應用軟體之間的契約。投影片也提出一個問題：好效能一定要弱模型嗎？它的答案是，資源多得多的話，SC 也能表現不錯。

**怎麼做**：找一段你寫過、用一個普通 `bool` 或 `int` 當旗標在 thread 間傳遞「資料準備好了」的程式，對照上面的 `A`／`flag` 例子。改成 C++ 的 `std::atomic`、或用 mutex／condition variable 包起來，讓它變成沒有 data race 的程式。

## 這一篇怎麼接到後面

| 本講概念 | 後面在哪用到 |
|---|---|
| fence、compare-and-swap | [L16](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free) 的鎖實作與 lock-free 資料結構 |
| 「lock-free 資料結構的作者要在意 consistency」 | 投影片直接標註「Topic of a later lecture」 |
| transactional memory 作為同步原語 | [L17–L18 Transactional memory](/posts/ai/2026-09-30-cs149-transactional-memory-w4) |

## 這一篇可以確認與不能確認的

可以確認：L15 投影片 PDF 的內容、課程首頁的講次標題與描述，以及 L16 PDF 封面標題與其中的鎖實作段落。首頁描述的「Fine-grained synchronization via locks」在 L15 PDF 裡找不到對應投影片；課堂上是否口頭帶過，沒有錄影可以確認。第 42 頁「Write Buffer Performance」是一張圖表，本文沒有引用其中的數值。

不能確認：Fall 2025 課堂的口頭補充，以及 2023 年錄影（當年標題是 Memory Consistency）與 2025 投影片的逐頁差異。本文沒有依影片內容寫作。

延伸閱讀：作業系統角度的鎖實作與 atomic 操作，可以讀 [CS111 Lecture 6：Implementing locks](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks)。

系列導覽：上一篇 [L14 Cache coherence：MSI、MESI 與 false sharing](/posts/ai/2026-09-30-cs149-cache-coherence)｜下一篇 [L16 細粒度鎖與 lock-free](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Fall 2023 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁與講次表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 15: Memory Coherency and Consistency（投影片 PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf)
- [Lecture 15 逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/sync_consistency/)
- [Lecture 16: Implementing Locks（投影片 PDF，鎖實作所在）](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf)
- [CS149 2023 Lecture 12 Memory Consistency 錄影（補充材料）](https://www.youtube.com/watch?v=nFXWmo9MFiY)
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Bartosz Milewski：Who ordered memory fences on an x86?（投影片推薦）](http://bartoszmilewski.com/2008/11/05/who-ordered-memory-fences-on-an-x86/)
- [Cambridge weak memory 論文清單（投影片推薦）](http://www.cl.cam.ac.uk/~pes20/weakmemory/)
