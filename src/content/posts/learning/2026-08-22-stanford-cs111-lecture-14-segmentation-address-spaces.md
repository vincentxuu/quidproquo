---
title: "Stanford CS111 Lecture 14：segmentation、共享、稀疏位址空間與配置限制"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 15
tldr: "Lecture 14 的官方 PDF 與 Lecture 13 逐位元組相同；本文明示此缺口，聚焦 segmentation 如何以多組 base/bound/protection 支援 growth、sharing、compaction，以及 fixed-count、fragmentation、rigid layout 限制。"
description: "導讀 Stanford CS111 Spring 2026 Lecture 14：官方 PDF 重複狀況、segmented address spaces、descriptor selection、protection、sharing、compaction 與 mmap 限制。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-14-segmentation-address-spaces-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 15 篇，對應 **Stanford CS111, Spring 2026, Lecture 14**。2026-04-29 由 Mendel Rosenblum 主講，官方題目是 [Virtual Memory, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/14/Lecture14.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

官方 `Lecture13.pdf` 與 `Lecture14.pdf` 都是 25 頁，SHA-256 同為 `f0aa78c7...e315`，內容逐位元組相同；calendar 卻把 4 月 29 日列為 **Virtual Memory, Continued**。Canvas 錄影不公開，本文不假裝有另一份 deck，只聚焦重複材料後段的 segmentation。

## 1. 為何一組 base/bound 不夠

Base/bound 讓每個 process 從 virtual 0 執行，hardware 同時做 `physical = base + virtual` 與 `virtual < bound`，達成 multitasking、transparency、isolation、efficiency。但整個 process 只有一段 contiguous region，code、data、stack 被迫綁在一起。

這無法表達不同權限：code 應 read-only，data/stack 要 read-write；也無法讓 stack 獨立 grow、讓 processes 分享 code。Variable-size process region 還會 external fragmentation，grow 或 move 都昂貴。問題不是 translation 原理，而是 metadata 只有一個 descriptor。

## 2. Segment map：多組帶權限的 base/bound

Segmentation 把 virtual space 分成 variable-size regions。MMU segment map 每列含 type、base、bound、protection。PDF 範例是 code：1000/1000/R-O；data：3000/2000/R-W；stack：8000/2000/R-W。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/14/Lecture14.pdf)）

Translation 先選 descriptor，確認 offset 小於 bound 且 operation 符合 protection，再以 `base + offset` 得 physical address。硬體仍是 table lookup、add、compare，接近 base/bound low overhead；expressiveness 來自多個 descriptors，而非取消檢查。

Reference identity 是 `(segment number, offset)`。相同 offset 140 在 code 與 data 可指向不同 physical locations；fault 也能區分越界與對 R/O code 寫入。

## 3. Segment number 的三種來源

PDP-10 用 address high-order bit 選 high/low segment，剩餘 bits 作 offset。PDP-11 由 instruction semantic 隱含選擇：instruction fetch 走 code，data access 走 data。Original x86 由 instruction 或 prefix 指定 segment。

Address bits 讓 pointer 自帶 segment，但固定 segment 數；implicit selection 簡化常見 access，卻難表達任意 mapping；instruction-specified segment 較彈性，也把 segmentation 暴露給 compiler/programming model。共同契約是先選 descriptor，再 translation。

若 2 bits 表示 segment，就只有四個 slots。某 slot 的 address range 即使沒用，也不能自然變成第五種 mapping；這是 rigid division 的根源。

## 4. Independent growth、swap 與 compaction

Segments 可各自 grow/shrink。Stack 增長不必搬 code；data heap 擴張也不用保留整個 process 最大連續空間。OS 還能把某 segment swap to disk，而讓其他 segments resident，雖然本講沒展開 disk I/O algorithm。

Physical memory fragment 時，OS 可移動一個 segment並更新 base，讓 holes 合併。Program 的 `(segment, offset)` 不變，不必像 load-time relocation 改寫 runtime pointers。這是 dynamic translation 的 transparency。

Moving 仍要 copy bytes，且執行期間要避免 CPU 同時用舊 base。投影片只說能 move/compact，沒有指定 stop-the-world、DMA 或 concurrency protocol；本文不補成已教實作。

## 5. Shared segments 與 protection

兩個 processes 的 descriptors 可指向同一 physical code region，各自 data/stack 仍私有。Shared code 標 R/O，process 可 execute/read，不能修改別人看到的 instructions；這同時省 memory 並維持 isolation。

Sharing 單位從整個 process 細化到 segment。Library code 與 per-process state 分開後，code 可共用；若仍是一個 base/bound region，就只能整體私有或共享 writable state。Protection metadata 因而是 sharing contract。

PDF 沒展開 shared writable memory synchronization。R/W mapping 只回答 permission，不保證 concurrent update 的 atomicity、ordering 或 invariant；仍須 locks/condition variables。

## 6. Fixed segment count 與 `mmap`

第一個缺點是 fixed number of segments。ISA 只有少數 selectors 時，難支援任意多 regions，PDF 直接寫「can't `mmap` files」。每個 mapped file、shared library 或 guard region 都可能需要獨立 mapping，slots 很快耗盡。

問題不是 file bytes 不能塞進 segment，而是 representation 不 scalable。把多個不相關 mappings 塞在一起，又失去獨立 bound、protection、sharing 與 lifetime。

## 7. Variable lengths 仍會 fragmentation

每個 segment 雖較小，physical allocation 仍是 variable length。反覆 create/grow/free 留下不同大小 holes，large segment 可能因沒有 contiguous region 而失敗，即使 total free memory 足夠。Compaction 能改善，但要付 copy/pause 成本。

Address space 也 rigidly divided：code/data/stack virtual ranges 受 encoding 限制，未用 capacity 不一定可借給另一段，program/toolchain 還得理解 segment identity。

Segmentation 以多 descriptors 修好單一 region 的 protection、growth、sharing，卻保留 fixed-count 與 variable-size placement。下一講 paging 會用 fixed-size pages 和更大的 mapping table處理不連續 frames；本篇到此為止，不提前把 paging 寫回這份重複 PDF。


## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 14 slides: Virtual Memory, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/14/Lecture14.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP：Segmentation](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-segmentation.pdf)
- [Linux manual：mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html)
- [Intel 64 and IA-32 Architectures manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
