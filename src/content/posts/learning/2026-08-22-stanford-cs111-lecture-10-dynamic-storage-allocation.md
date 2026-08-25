---
title: "Stanford CS111 Lecture 10：allocator 介面、free list、fragmentation 與 placement policy"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 11
tldr: "第 10 講從 stack 的可預測 LIFO，推到 heap 的 free lists、first/best fit 與 slabs，再比較 reference counting 和 mark-and-sweep 如何在 dangling pointers、leaks、cycles、fragmentation 間取捨。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 10：dynamic allocation、stack/heap、fragmentation、free lists、slabs、bitmaps、reference counting 與 garbage collection。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-10-dynamic-storage-allocation-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 11 篇，對應 **Stanford CS111, Spring 2026, Lecture 10**。2026-04-20 由 Mendel Rosenblum 主講，官方題目是 [Dynamic Storage Management](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Dynamic storage management 問的是：如何管理一段 memory 或 storage，讓 applications 與 OS 都能滿足不可預測的需求？現在先談 memory，disk storage 留到後面。介面很小：`allocate(size) -> ptr` 取得指定 bytes，`free(ptr)` 歸還先前配置的 block。困難不在 API，而在 allocator 不知道 block 多久後會被 free，也不知道下一個 request 多大。

同一串 requests 只要 free 順序不同，就會留下完全不同的 hole pattern；allocator 當下也看不到未來，無法知道現在切開的大 block 是否稍後正好有大型需求。這使 placement 成為 online decision：只能依目前 free-space state 選擇，並承擔之後的 fragmentation。

## 1. Stack allocation：限制順序換取常數時間

Stack allocation 支援 last allocated, first freed（LIFO）的階層式生命週期。只需一個 stack pointer：allocate 往一個方向調整，free 再調回來。X 呼叫 Y、Y 再遞迴呼叫 Y，return 順序正好與配置相反。tree traversal、expression evaluation、top-down recursive-descent parser 也常符合這個形狀。

優點是 allocated space 與 free space 各自連續，配置與釋放只是 add/subtract，沒有散落 holes。代價是必須能預測生命週期；任意先釋放較早物件會破壞單一 pointer 模型。投影片的 C++ 例子把 global/data、function local/stack 與 `new int(42)`/heap 並列，顯示 storage class 取決於物件要活多久，而不是只取決於資料型別。

## 2. Heap allocation 與 fragmentation

Tree、graph 或複雜共享結構常以任意順序建立和刪除，必須使用 heap allocation；這裡的 heap 是 storage region，不是 heap priority-queue data structure。任意 free 會讓記憶體交錯成 allocated chunks 與 free holes。沒有 hole 足夠大時 allocator 才擴大 heap segment。

目標是讓 holes 數量少且尺寸大。**Fragmentation** 指許多小洞導致 memory 無法有效利用：總 free bytes 可能足夠，卻沒有一段 contiguous region 滿足 large allocation。Stack 因 free space 永遠連續而沒有這種 external fragmentation；heap allocator 則必須用 free list 記住 holes，並在 allocation 時搜尋。

Allocator 至少要維持三個 invariants：allocated blocks 不重疊；free list 精確覆蓋所有可用空間；相鄰 free blocks 若政策要求 coalescing，就不能永久分裂。`free(ptr)` 若收到非起點、重複釋放或仍被使用的 pointer，這些 invariants 便可能被破壞；PDF 聚焦管理策略，未展開安全檢查實作。

## 3. First fit、best fit 與 coalescing

早期 free list 是 holes 的 linked list。**Best fit** 掃描整張 list，選最接近 request size 的 hole，把剩餘部分放回 list；**first fit** 找到第一個能容納的 region 就停止。前者希望少浪費當下的 block，後者少做搜尋，但兩者都可能留下大量小 holes。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf)）

free 時要 merge adjacent free blocks。若一個 64-byte hole 緊鄰剛歸還的 128-byte block，coalescing 後才有 192 bytes 可供較大 request；只把兩者各自掛回 list 會造成假性不足。要合併就得知道鄰接 block 的位置與大小，表示 allocator metadata 本身也占空間並需要一致更新。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf)）

PDF 指出的失敗是：holes 趨向與小 objects 相近，大 allocation 因找不到連續空間而失敗或迫使 heap growth；allocation 還要掃過大量不適合的小洞，時間也變昂貴。best fit 並不保證長期最好，因為每次「最緊」的選擇可能製造永遠用不到的碎片。

## 4. Slab allocator：固定尺寸換快速 common case

Slab 是切成同尺寸 chunks 的 memory region；常見 allocation size 各有 pool，每個 slab 有自己的 free list。Allocate 先找所需 size 的 slab，從 list 取一塊；若沒有 free object，就配置新 slab、切成 blocks，再回傳一塊。Free 把 block 放回所屬 slab；若整個 slab 的 blocks 都 free，slab 本身也能歸還。

Common case 不必掃混合尺寸 holes，所以 allocation/free 很快。OS 特別適合 slab，因為 kernel 常反覆配置少數固定 struct sizes。型別或 size class 也能讓初始化、cache locality 與 metadata 更規律，雖然投影片只明示固定尺寸 pools 與速度。

Slab 沒有消除 fragmentation。某 slab 只用少數 chunks 時，剩餘空間不能立刻服務其他 size；allocation-size distribution 改變時尤其糟。這是 internal fragmentation／stranded capacity：空間在已配置 slab 內，但不符合目前需求。設計是在 generality 與 predictable fast path 間交換。

## 5. Bitmap 表示 free storage

Bitmap 用 bit array 追蹤固定 chunks，`0` 表示 free、`1` 表示 allocated。它適合 slab 內 blocks 或之後 file-system lectures 的 disk blocks。相較每個 free block 都放 linked-list pointers，bitmap metadata 緊密；但 allocation 可能要 scan bits 才找到 free run。

Bitmap 的粒度決定取捨。chunk 大，bit array 小但 internal waste 大；chunk 小，表示精細但 bitmap、scan 與連續-run 搜尋成本提高。PDF 只建立 fixed-size tracking 的概念，把 disk bitmap 細節留到 file systems。

## 6. Reclamation：何時才真的可以 free

Placement 解決「free space 放哪裡」，reclamation 解決「何時空間已不再可達」。投影片採用 pointer reachability 假設：只要還存在通往 object 的 pointer，就可能被存取；沒有 pointer 才安全回收。Tree 中 ownership 單一較容易，共享結構必須等所有使用者結束。

太早 free 造成 **dangling pointer**：程式仍使用已歸還、甚至已重新配置給別人的 bytes。太晚或忘記 free 造成 **memory leak**：物件已不可能再用，storage 卻永久遺失。兩者不能靠同一個「多 free 一點」修好；一邊要求保守保留，一邊要求積極辨識死亡。

## 7. Reference counting 與 cycles

Reference counting 讓 object 保存指向它的 pointer count；新增引用加一，移除引用減一，降到 zero 就 free。例子包括 C++ `std::shared_ptr`、早期 JavaScript、Python，以及 file-system inode。優點是回收時點局部且直觀，不必全 heap 停下掃描。

致命限制是 cycles。A 指向 B、B 指向 C、C 再指回 A，即使外界沒有任何 pointer，三者 counts 仍不為零，整個 cycle leak。正確更新 count 也要求每次 pointer assignment 都被攔截，並處理 concurrent updates。PDF 用 cycle 作核心反例，沒有聲稱 reference count 能單獨解一般 reachability。

## 8. Garbage collection 與 mark-and-sweep

Garbage-collected model 沒有顯式 `free`；程式刪除 pointers，collector 掃描 memory，保留 live objects、刪除其餘，還能 compact 以減少 fragmentation。Java、JavaScript、Go 與部分 Python implementations 是投影片列出的例子；具體 collector 並非全都採同一演算法。

講義的 mark-and-sweep 實作分兩 passes。Mark 從 statically allocated 與 procedure-local variables 的 pointers（roots）開始，遞迴標記所有 reachable objects；這需要 language environment 幫忙辨認哪些 machine words 是 pointers。Sweep 階段走過 objects，把 live objects copy/compact 到 contiguous memory，更新所有指向被搬動 objects 的 pointers，最後釋放剩餘空間。

嚴格說投影片把 sweep 與 copying/compaction 合在一起描述；本文沿用該 agenda，不把它改寫成所有教科書對「mark-sweep」的唯一命名。關鍵 invariant 是搬動 object 後每一條 live reference 都必須更新，否則 compaction 本身會製造 dangling pointer。

## 9. GC 成本與這講的結論

PDF 給出成本量級：在使用 GC 的 systems 中可能花 10–20% CPU time、需要 2–5× overallocation，並造成 long pauses。這些是講義用來說明代價的量級，不是所有 runtime、heap size 與 workload 的保證；generational、incremental 或 concurrent collectors 的行為可能不同，但不在本講公開材料內。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf)）

整講可用「預測能力換效率」串起來。LIFO 生命週期最可預測，所以 stack pointer 幾乎免費；任意 heap lifetime 需要 free lists 與 placement policy；固定 size 可用 slabs/bitmaps 換快路徑；ownership 可追蹤時 reference count 很直接；一般 graph reachability 則交給 collector，支付 scan、space 與 pause 成本。沒有一種 allocator 同時取得 arbitrary lifetime、零 fragmentation、常數時間、立即回收與零 metadata。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 10 slides: Dynamic Storage Management](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Wilson et al.：Dynamic Storage Allocation Survey](https://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15213-f98/doc/dsa.pdf)
- [Linux kernel：Slab allocation](https://docs.kernel.org/mm/slab.html)
- [Python documentation：Reference counting and cyclic garbage collection](https://docs.python.org/3/c-api/memory.html)
