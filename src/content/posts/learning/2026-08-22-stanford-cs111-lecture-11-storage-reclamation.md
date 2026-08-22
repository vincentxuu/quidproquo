---
title: "Stanford CS111 Lecture 11：Storage Reclamation、Reference Counting 與 GC"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 12
tldr: "第 11 講的官方 PDF 與 Lecture 10 逐位元組相同；本文誠實保留此 artifact 缺口，聚焦後半的 reachability、dangling pointers、leaks、reference-count cycles 與 mark/compact GC。"
description: "導讀 Stanford CS111 Spring 2026 Lecture 11 的 storage reclamation：官方 PDF 重複狀況、pointer reachability、reference counting、cycles、garbage collection 與成本。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-11-storage-reclamation-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 12 篇，對應 **Stanford CS111, Spring 2026, Lecture 11**。2026-04-22 由 Mendel Rosenblum 主講，官方題目是 [Dynamic Storage Management, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/11/Lecture11.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

先說材料異常：官方 `Lecture10.pdf` 與 `Lecture11.pdf` 的 SHA-256 都是 `368092c0...e67cb`，22 頁內容逐位元組相同；calendar 卻把 4 月 22 日列為 **Dynamic Storage Management, Continued**。錄影受 Canvas 限制，無法判斷現場從哪一頁接續。因此本文不捏造 boundary tags 等 PDF 沒有的內容，而把重點放在重複 deck 後半明示的 storage reclamation。

## 1. Placement 與 reclamation 是兩個問題

`allocate(size) -> ptr` 要找一塊可用空間，`free(ptr)` 要歸還它。Stack 以 LIFO 限制換得單一 pointer；heap 允許任意順序，使用 free list、first/best fit、slabs 或 bitmaps 管理 holes。這些回答「空間放哪裡」。Reclamation 問得更根本：**何時確定 object 再也不會被使用？**

PDF 採 pointer reachability 模型：資料只有在存在 pointer 時才可存取；沒有 pointer 就安全回收。Tree node 若只有一個 owner，生命週期較清楚；graph 或 shared object 有多條引用，必須等所有使用者完成。這個模型需要 runtime 能辨識 pointers，否則一個看似整數的 machine word 是否是地址就無法可靠判定。

## 2. Dangling pointer 與 memory leak

太早回收造成 **dangling pointer**：程式仍握有 pointer，allocator 卻已把 block 交給其他 object。後續讀取可能看到無關資料，寫入則會破壞新 owner。錯誤往往依 allocation order 才出現，因此「測試跑過一次」不能證明安全。

太晚回收造成 **memory leak**：object 已不可達，storage 卻沒有回到 allocator。Leak 不一定立即 crash，但長時間 process 會持續增長，最後迫使 heap expansion 或 allocation failure。兩者方向相反：保守保留降低 dangling risk 卻增加 leak，積極回收反之；reclamation algorithm 必須建立可檢查的死亡條件。

## 3. Reference counting 的局部契約

Reference counting 在每個 object 保存指向它的 pointers 數量。建立引用時 increment，移除時 decrement；count 到 zero，便沒有引用者，可以 free。PDF 的例子是 C++ `std::shared_ptr`、早期 JavaScript、Python，以及 file-system inodes。

優點是 decision 局部：不用週期性掃完整個 heap，最後一個 reference 消失時即可回收。代價是每次 pointer assignment 都要正確更新 count；共享與 concurrency 下，更新還需要同步。若漏一次 increment，object 可能過早死亡；漏 decrement 則 leak。

## 4. Cycles 為何擊敗 reference counts

假設 A 指向 B、B 指向 C、C 指回 A。外界 root 全部移除後，三個 objects 對程式已不可達，但每個 count 仍至少為一。沒有任何 object 先降到 zero，所以整個 cycle 永遠不會觸發遞迴釋放。

這不是 count 寬度或 threshold 的小 bug，而是 local incoming-edge count 無法判斷「是否存在從 roots 出發的 path」。解法必須額外偵測 cycles，或改採真正的 reachability traversal。PDF 用這個反例界定 reference counting 的能力邊界，沒有宣稱所有 Python objects 都只靠 counts 管理。

## 5. Garbage collection：從 roots 找 live set

Garbage-collected model 不要求 application 呼叫 `free`；程式只移除 pointers。Collector 週期性尋找 live objects，刪除其餘 garbage，也可以 compact memory 以減少 fragmentation。PDF 列出 Java、JavaScript、Go 與部分 Python implementations，但不同 runtime 不必使用同一 collector。

這把責任從 programmer 移到 language environment。Runtime 必須知道 object boundaries、哪些 fields 是 pointers，以及 roots 在哪裡。好處是 unreachable cycles 可以被回收；代價是 tracing work、額外 memory 與可能的 pause。GC 避免某類 manual-free error，不代表程式不會 leak：root 若不必要地保留 pointer，object 仍被視為 live。

## 6. PDF 的 mark 與 compact 兩個 passes

Pass 1 從 statically allocated variables 與 procedure-local variables 中的 pointers，也就是 roots，開始 **mark**。每找到一個 object，就遞迴追蹤它指向的 objects，直到 reachable graph 都標記。Language environment 必須協助找出 pointers；只掃 raw bytes 而猜地址會有誤判。

Pass 2 走過所有 objects，把 live objects copy 到 contiguous memory 並 compact；所有指向 moved objects 的 pointers 都必須更新，剩餘空間才可釋放。投影片把這一步標為 sweep 並同時描述 copy/compact；本文沿用官方說法，不把它擴張成所有教材對 classic mark-sweep 的統一定義。

Compaction 同時處理 reachability 與 external fragmentation，但更新 pointers 是強 invariant：漏掉任何一條 live reference，就由 collector 自己製造 dangling pointer。Pinned objects、concurrent mutation 或 precise stack maps 等實作問題不在公開 PDF，不能補成這堂課已教內容。

## 7. GC 成本與材料邊界

PDF 給出的成本量級是：GC 可能占系統 10–20% CPU time，需要 2–5× overallocation，並造成 long pauses。這些數字是課堂用來建立取捨的概括，不是對所有 heap、runtime、collector 與 workload 的 benchmark。Generational、incremental、concurrent collectors 如何降低某些成本，也不在這 22 頁內。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/11/Lecture11.pdf)）

這講的核心不是「GC 一定優於 manual free」。Reference count 用便宜的 local count 換來 cycle 缺口；tracing GC 用 global reachability 換來 scan、space 與 pause；manual reclamation 把判斷交給 programmer，則暴露 dangling pointer 與 leak。官方 artifact 重複使本篇短於系列常規，但上述七節已覆蓋 PDF 後半全部 reclamation agenda，沒有重複 Lecture 10 的 allocator placement 內容灌水。


## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 11 slides: Dynamic Storage Management, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/11/Lecture11.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Python C API：Reference Counting](https://docs.python.org/3/c-api/refcounting.html)
- [Python：Garbage Collector interface](https://docs.python.org/3/library/gc.html)
- [Go：A Guide to the Go Garbage Collector](https://go.dev/doc/gc-guide)
