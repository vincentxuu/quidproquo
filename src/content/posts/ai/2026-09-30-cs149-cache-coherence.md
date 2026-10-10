---
title: "CS149 L14 Cache coherence：MSI、MESI 與 false sharing"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, parallelism, hardware, cache, systems]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 19
tldr: "每個核心都有自己的 cache，同一個位址就可能同時有好幾份副本，各核看到的值會不一樣。這不是加鎖能解決的問題，是硬體複製資料造成的。CS149 L14 先定義什麼叫 coherent，再拆解 snooping 的 MSI 協定：要寫就先廣播 BusRdX 讓別人作廢，MESI 多一個 E 狀態省掉「讀完再寫」的第二筆交易，directory 則把廣播改成點對點。對程式設計師最實際的後果是 false sharing：兩個 thread 寫不同變數，只因為落在同一條 cache line，就讓 cache line 在核心間來回彈，投影片的 demo 慢了三倍。"
description: "Stanford CS149（Fall 2025）Lecture 14 導讀：cache coherence 問題的來源、coherence 的形式定義與 SWMR／write serialization 兩個不變式、snooping 與 write-through 的最簡實作、MSI 狀態機與範例、MESI 的 E 狀態、Intel Core i7 以 L3 當 directory，以及 AMAT、false sharing 與 padding。"
draft: false
glossary:
  - term: "cache coherence"
    aliases: ["快取一致性"]
    definition: "多個處理器各自快取同一記憶體位址時，確保對單一位址的所有讀寫能排成一個與各處理器觀察一致的順序，讀到的是該順序中最後一次寫入的值。"
    context: "CS149 L14 強調它只管單一位址；多個位址之間的順序是下一講的 memory consistency。"
  - term: "false sharing"
    aliases: ["偽共享"]
    definition: "兩個處理器寫入不同位址，但這些位址落在同一條 cache line，coherence 協定讓該 line 在兩個 cache 之間來回搬移，產生程式本身並不需要的通訊。"
    context: "L14 的 demo 中，8 個 thread 在 4 核機器上各自累加計數器，有 padding 與沒有 padding 的執行時間差約三倍。"
  - term: "SWMR invariant"
    aliases: ["Single-Writer, Multiple-Read"]
    definition: "任一時段內，一個位址要嘛只有一個處理器可以寫（也可以讀），要嘛有多個處理器只能讀。"
    context: "L14 用它和 data-value invariant 說明 MSI 為什麼能維持 coherence。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-cache-coherence-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 19 篇，接續 [PA5 在 H100 上寫最快的 kernel](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels)，範圍是 Lecture 14「Cache Coherence」（2025-11-11）。

用到的官方材料是 [L14 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/cachecoherence/14_coherence.pdf)（45 頁，另有[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/cachecoherence/)）。Fall 2025 的錄影只放在 Canvas，官方首頁指向 2023 年版的 [Lecture 11 Cache Coherence 錄影](https://www.youtube.com/watch?v=lrCfG2CPDEw)當替代。本文以 2025 投影片為準，影片只列為聽講補充。這一講的存取等級是 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：投影片完整公開，缺的是當期錄影。

## 課程影片來源

本文以 Fall 2025 教材為準。官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的 YouTube 播放清單；下列 Fall 2023 錄影是主題相近的相關補充影片，內容可能與 2025 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=lrCfG2CPDEw
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 11 - Cache Coherence
```

原始影片：[Stanford CS149 I Parallel Computing I 2023 I Lecture 11 - Cache Coherence](https://www.youtube.com/watch?v=lrCfG2CPDEw)

課程與錄影入口：

- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/cachecoherence/)

內容核對：已依字幕核對（2026-10-10）：讀了 Fall 2023 錄影《Lecture 11 - Cache Coherence》（1:20:37）。影片前約三分之一在收尾上一講的 Spark，約三分之一處才進入 cache coherence：講 coherence 的定義與兩個不變式、軟體與硬體做法、snooping 的概念，最後停在 MSI 三個狀態與 BusRd／BusRdX／BusWB 的定義，講者說狀態如何轉換「週四再繼續」。字幕中沒有 MESI 的 E 狀態、false sharing 的示範與 padding、directory 的實作細節（directory 只被一句帶過），所以本文這幾段沒有影片可對照。 核對的是影片主題與本文主題的關係；本文內容以 Fall 2025 投影片為準，沒有逐段比對兩版。

## 為什麼 AI kernel 之後突然回到 cache

官方課序就是這樣排的：L9 到 L13 和 PA4、PA5 談 AI 系統，L14 到 L18 轉回共享記憶體的正確性。主題看起來斷了，其實接得回前面兩個地方：

- [L2 現代多核處理器](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading)畫過每個核心有私有 L1、L2 的圖。這一講回答：私有 cache 裡的副本怎麼保持一致？
- [PA2 的 thread pool](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling) 裡，多條 worker thread 共享任務計數器與佇列。它們的效能有一部分取決於這一講的協定。

多執行緒的 runtime、鎖、lock-free 資料結構都建在這層之上，所以 Part 5 雖然不直接談 AI，寫任何平行 runtime 都繞不過它。

## 先複習：cache 怎麼運作

投影片前段用兩個小例子複習 cache：8 bytes 容量、4-byte cache line、LRU 替換。例子一示範 spatial locality（載入一條 line 順便預載同 line 的資料）與 temporal locality（重複存取同一位址）；例子二走到 capacity miss。

接著是單處理器上 write-allocate、write-back cache 遇到寫入 miss 的五個步驟：選位置（若有 dirty line 先寫回）、從記憶體載入整條 line、改其中 32 bits、標成 dirty。投影片也列出 Intel Skylake 的階層：每核私有 32 KB L1 與 256 KB L2，全晶片共享 8 MB 的 inclusive L3，cache line 64 bytes。

## Coherence 問題長什麼樣

四個處理器各有 cache，共享位址 X 上的變數 `foo`，初值 0，cache 是 write-back。投影片逐步走：

| 動作 | 結果 |
|---|---|
| P1 load X | P1 快取 0 |
| P2 load X | P2 快取 0 |
| P1 store X ← 1 | 只改了 P1 的 cache，記憶體仍是 0 |
| P3 load X | P3 從記憶體讀到 0 |
| P3 store X ← 2 | 只改 P3 的 cache |
| P2 load X | P2 cache hit，讀到舊的 0 |
| P1 load Y，導致 X 被逐出 | P1 把 1 寫回記憶體 |

同一個位址，不同處理器看到 0、1、2 三個值。投影片問：這是互斥問題嗎？加鎖能修嗎？答案是**不能**。這個問題來自硬體把資料複製到多個 local cache，跟程式有沒有 race 無關。

問題的根源是：單一共享位址空間這個抽象，實際上由全域的主記憶體加每個處理器的本地 cache 共同實作。

### 「最後一次寫入」的「最後」是什麼意思

直覺的要求是「讀 X 會拿到任何處理器最後一次寫入 X 的值」。但兩個處理器同時寫怎麼算？P1 寫完、P2 馬上讀，近到訊息來不及傳過去又怎麼算？循序程式裡的「最後」由程式順序決定，平行程式需要另一種定義。

投影片的正式定義：一個記憶體系統是 coherent 的，如果對每個位址，都存在一個所有處理器對它的操作的假想序列順序，與執行結果一致，而且：

1. 同一個處理器發出的操作，在序列中維持它發出的順序
2. 每次讀回傳的值，是序列中對該位址最後一次寫入的值

落到實作上，變成兩個不變式：

- **SWMR（Single-Writer, Multiple-Read）**：任一時段，要嘛只有一個處理器能寫（也能讀），要嘛有多個處理器只能讀
- **Data-value（write serialization）**：每個時段開始時的值，等於上一個讀寫時段結束時的值

## 實作 coherence 的幾條路

投影片列了三類：

- **軟體、以 VM page 為粒度**：OS 用 page fault 傳播寫入，可用於工作站叢集。課堂不談，只點出它的大問題是 false sharing（後面會講）。
- **硬體、以 cache line 為粒度**：snooping（本講重點）與 directory（簡介）。
- **乾脆共用一個 cache**：沒有複製就沒有 coherence 問題，但喪失 cache 本地、快速的意義，還有干擾與 contention。好處是 working set 重疊時，一個處理器的載入可能幫另一個預取。投影片舉 SUN Niagara 2：八核透過 crossbar 接到共享的 L2 banks，crossbar 面積約等於一顆核心。

### Snooping 與最簡單的版本

Snooping 的想法：所有和 coherence 有關的活動都廣播給每個 cache controller，controller 監聽（snoop）並依協定反應。controller 因此要同時回應兩端：本地處理器的 load/store，和互連上廣播來的訊息。

最簡單的版本假設 write-through cache、以 cache line 為粒度：寫入時廣播 invalidation，其他處理器下次讀就 miss，從記憶體讀到新值。問題是每次寫都要打到記憶體，頻寬需求太高。Write-back cache 能把大部分寫入吸收成 cache hit，但就需要更複雜的協定。

## MSI：寫之前先拿到獨佔權

Write-back 下，dirty 狀態等於**獨佔擁有權**：這個 cache 是唯一有有效副本的，可以直接寫；別人要讀時，它也負責把資料交出去，不然別人會從記憶體讀到過期資料。

MSI 協定的每條 cache line 有三種狀態：

| 狀態 | 意義 |
|---|---|
| I（Invalid） | 無效，和單處理器 cache 的 invalid 相同 |
| S（Shared） | 一個或多個 cache 有有效副本，記憶體是最新的 |
| M（Modified） | 只有這一個 cache 有有效副本（dirty，也叫 exclusive） |

處理器端有兩種操作：PrRd、PrWr。匯流排上有三種交易：

- **BusRd**：取得副本，不打算修改
- **BusRdX**：取得副本，打算修改
- **BusWB**：把 dirty line 寫回記憶體

狀態轉換的要點：

- 讀會把 line 拿到 S，即使它是唯一的副本
- 寫之前一定要拿到 M：發 BusRdX，其他 cache 看到就作廢自己的副本；若有人持有 M，它要先寫回
- 就算本地已經是 S，要寫還是得發 BusRdX 升級到 M
- 持有 M 的 cache 看到別人的 BusRd，就寫回並降到 S；看到 BusRdX 就寫回並降到 I

投影片的範例表（三個處理器對 x 操作）：

| 動作 | P1 | P2 | P3 | 匯流排 | 資料來源 |
|---|---|---|---|---|---|
| P1 read x | S | – | – | BusRd | 記憶體 |
| P3 read x | S | – | S | BusRd | 記憶體 |
| P3 write x | I | – | M | BusRdX | 記憶體 |
| P1 read x | S | – | S | BusRd | P3 的 cache |
| P1 read x | S | – | S | 無 | P1 的 cache |
| P2 write x | I | M | I | BusRdX | 記憶體 |

MSI 怎麼滿足兩個不變式：只有一個 cache 能在 M，其他人都收到作廢訊息，這是 SWMR；BusRd 與 BusRdX 的資料由持有 M 的 cache 提供，而匯流排把所有交易排成一個順序，這是 write serialization。

<details>
<summary>為什麼 S 狀態要寫還得廣播</summary>

投影片在 MSI 總結頁留了這個問題。線索在 SWMR：S 表示「可能還有別人也有副本」。如果不廣播就直接寫，別的 cache 裡的 S 副本就過期了，而且它們會繼續 cache hit 讀到舊值。BusRdX 的作用就是告訴大家「你們不能再讀了，因為我要寫」。

</details>

## MESI：省掉「讀完再寫」的第二筆交易

MSI 在最常見的「先讀一個位址再寫它」的情況下要兩筆交易：BusRd 從 I 到 S，再 BusRdX 從 S 到 M。就算程式完全沒有共享資料，這個浪費也存在。

MESI 加一個 **E（exclusive clean）** 狀態：line 沒被改過，但只有這個 cache 有副本。讀的時候，如果沒有其他 cache 表示自己也有（assert shared），就直接進 E；之後要寫，E 到 M 不需要任何匯流排交易。E 把「獨佔」和「擁有」拆開：line 不是 dirty，記憶體裡的副本仍是有效的。

投影片頁角寫了一句「MESI, not Messi!」。

## Directory：不再廣播

Snooping 靠廣播確認其他 cache 的狀態，規模一大就撐不住。Directory 的做法是把每條 line 在所有 cache 裡的狀態集中記在一個地方，cache 需要時查詢，coherence 以點對點訊息「按需告知」維持。SWMR 與 write serialization 兩個不變式照樣要守。

投影片的實例是 Intel Core i7：L3 是 inclusive 的，L2 裡的每條 line 一定也在 L3，所以 L3 可以當所有 line 的集中 directory，也是序列化的點。Directory 記錄哪些 L2 有這條 line，coherence 訊息只送給它們。Core i7 的互連是 ring，不是 bus。

## 對程式設計師的後果

### 通訊成本藏在記憶體延遲裡

在多處理器上，通訊是主要的平行開銷之一，它表現成平均記憶體存取時間（AMAT）變長。投影片列了 Core i7 Xeon 5500 系列的約略延遲：L1 hit 約 4 cycles；L3 hit 在 line 未共享時約 40 cycles，line 被另一核修改過時約 75 cycles；遠端 DRAM 約 400 cycles。投影片的提醒是：這類高延遲存取只要占一小部分，影響就可能很大。投影片建議用 Intel VTune 觀察記憶體系統的效能。

### False sharing

投影片問：下面這段每個 thread 各自累加的程式，效能問題在哪？

```c
// 每個 thread 一個計數器，連續放在陣列裡
int myPerThreadCounter[NUM_THREADS];
```

換成下面這樣為什麼可能更快？

```c
struct PerThreadState {
  int myPerThreadCounter;
  char padding[CACHE_LINE_SIZE - sizeof(int)];
};
PerThreadState myPerThreadCounter[NUM_THREADS];
```

Demo 的數字：8 個 thread 在 4 核系統上各自對自己的計數器加很多次，不 padding 要 14.2 秒，padding 後 4.7 秒。

原因就是 false sharing：兩個處理器寫不同位址，但位址落在同一條 cache line。依 MSI，每次寫都要先拿到 M，於是這條 line 在兩個 cache 之間來回彈（ping-pong），產生大量 coherence 通訊。程式本身沒有任何需要溝通的資料，這些通訊完全是 cache line 大於 4 bytes 造成的「人為」通訊（artifactual communication）。

投影片最後引 Culler、Singh、Gupta 的模擬圖：1 MB cache、四個應用，cache line 從 8 bytes 放大到 256 bytes 時，miss rate 拆成 cold、capacity/conflict、true sharing、false sharing、upgrade 五類。cache line 變大有利有弊，false sharing 是其中一個代價。

**怎麼做**：打開你寫過的任何 thread pool 或平行累加程式（例如 [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling) 的 worker 狀態），找出「每個 thread 一格、連續擺在陣列裡、會被頻繁寫」的欄位。把它 padding 到 64 bytes（Skylake 與投影片寫的 cache line 大小），量一次前後差異。

## 本講總結

投影片的總結頁有三點：

1. coherence 問題存在，是因為單一共享位址空間不是由單一儲存單元實作，資料為了效能被複製到本地 cache
2. snooping 的主旨是：任何可能影響 coherence 的 cache 操作，都廣播給其他所有 cache controller。硬體設計者的挑戰是降低協定開銷，軟體開發者的挑戰是小心協定帶來的人為通訊，例如 false sharing
3. snooping 的規模受限於廣播能力，directory 是擴展的方向

## 這一篇可以確認與不能確認的

可以確認：L14 投影片 PDF 的內容與課程首頁的講次日期、描述（「Invalidation-based coherence using MSI and MESI, false sharing」）。Fall 2025 的 L15 投影片前 20 頁幾乎完整重複了 L14 的 MSI、MESI、directory 與 false sharing 內容，表示 L14 可能沒講完，延到下一講；這是從投影片推論，沒有錄影可證。

不能確認：Fall 2025 課堂的口頭補充，以及 2023 年錄影和 2025 投影片的逐頁差異。本文沒有依影片內容寫作。

延伸閱讀：作業系統層級的鎖與同步可以讀 [CS111 Lecture 6：Implementing locks](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks)。

系列導覽：上一篇 [PA5 在 H100 上寫最快的 kernel](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels)｜下一篇 [L15 記憶體一致性](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Fall 2023 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。這支 2023 錄影只涵蓋本文前半（定義、不變式、snooping、MSI 狀態定義），MESI、directory、false sharing 在影片中沒有，已在影片來源段寫明。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁與講次表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 14: Cache Coherence（投影片 PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/media/cachecoherence/14_coherence.pdf)
- [Lecture 14 逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/cachecoherence/)
- [Lecture 15 投影片 PDF（前段重複 L14 內容）](https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf)
- [CS149 2023 Lecture 11 Cache Coherence 錄影（補充材料）](https://www.youtube.com/watch?v=lrCfG2CPDEw)
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Assignment 2 README（stanford-cs149/asst2）](https://github.com/stanford-cs149/asst2)
