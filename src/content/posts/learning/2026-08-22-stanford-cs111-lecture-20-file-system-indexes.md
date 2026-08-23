---
title: "Stanford CS111 Lecture 20：多層 Inode、Index Walk 與磁碟排程"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 21
tldr: "4.3BSD inode 用 direct、single-indirect 與 double-indirect pointers 讓 lookup depth 隨檔案大小分級；FIFO、SPTF、SCAN 與 CSCAN 則交換 seek cost、公平性與等待時間。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 20：multilevel inode、block 5／23／1040 的 index walk、double-fault 問題與 disk scheduling。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-20-file-system-indexes-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 21 篇，對應 **Stanford CS111, Spring 2026, Lecture 20**。2026-05-13 由 Mendel Rosenblum 主講，官方題目是 [File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)。官方 Lecture 20 與 [Lecture 21 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) 逐位元組相同，SHA-256 均為 `42e4021f84ed272db95224024c878a09d6c719430efc386c2614dcc8ef94310d`；Canvas／Panopto 錄影不公開，無法還原兩天實際口述分界。

因此這一篇只承擔 [deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf) 前段的 multilevel inode／index walk 與尾端 disk scheduling。中段的 block cache、write policy、free bitmap、fragments 與 delayed allocation 集中放在 [Lecture 21](/posts/learning/2026-08-22-stanford-cs111-lecture-21-free-space-buffer-cache)。這是對 byte-identical artifact 的編輯分工，不是聲稱公開材料提供了確切的課堂切點。

## 4.3BSD inode 是一棵按需長大的樹

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)模型把 disk 與 file 都切成 4 KiB blocks，inode 是 block-pointer tree 的 root，形狀類似 page table。inode 有 14 個 pointers，零表示沒有 block。前 12 個是 direct pointers，直接指向 file blocks 0–11；小檔不需額外 index I/O。

第 13 個 pointer 指向 indirect block。每個 4-byte pointer 配上 4 KiB block，使一個 indirect block 可放 1,024 個 pointers，涵蓋 file blocks 12–1035。超過 1,036 blocks 時，第 14 個 pointer 指向 double-indirect block；它的 entries 再各指向 indirect block。index blocks 只在需要時配置，因此小檔 metadata 低，大檔上限固定但很高。檔案截短時，核心也必須反向釋放不再指向資料的 index blocks，否則按需配置只進不出，仍會留下空索引占用磁碟。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)）

[slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf) 註記「4GB（with triple 4TB）」略顯含混：本頁畫出的 14 pointers 只有 direct、single 與 double levels，依 4 KiB block 與 1,024 fan-out，double 部分約再涵蓋 4 GiB 資料；4 TiB 需要額外 triple-indirect pointer。本文把 4 TiB 視為延伸註記，不誤寫成圖中 14-pointer layout 已包含 triple tier。

## Block 5、23 與 1040 怎麼走

讀 file block 5 直接查 inode 的 direct pointer 5，拿到 data block；若 inode 已在 memory，只需要真正的 data I/O。讀 block 23 時先扣掉 12 個 direct blocks，在 single-indirect table 取 index 11，再到 data block。這比 linked file 從頭追 23 次穩定得多。

讀 block 1040 時，因它大於 1035，要走 double-indirect。先扣掉 direct 加 single 的 1,036 blocks，剩下 offset 4；商與餘數決定第一層 indirect table 與第二層 data pointer。[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)圖以第一個 indirect branch 的 entry 4 指向 block 1040。一般化時可用 quotient 選 indirect block、remainder 選其中 entry。

因此 lookup depth 隨 file size 分級，而不是隨 offset 線性成長。代價是 double-indirect miss 最多先讀兩個 index blocks 才能讀 data，投影片稱 double-fault problem。這裡的 fault 是 index block 不在 cache 的磁碟讀取，不是 CPU page fault。

## BSD inode 的收益與瓶頸

優點是簡單、容易實作，[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)也連到 Assignment 7；不必預先宣告 file size，indirect blocks 按需配置，小檔快速，而且不像 FAT 必須把全 disk 的 table 常駐 memory。每個 file 只攜帶自己需要的索引。

缺點是 large-file access 最壞每次真正資料操作前多出兩次 index reads；block-by-block free list 又像 FAT 一樣缺乏 locality。索引解決「如何找到 block」，沒有自動解決「block 是否放得相近」。logical lookup 與 physical placement 是兩個政策。

## 從 logical lookup 交給 physical I/O

inode tree 回答的是「logical block 對應哪個 disk block」，沒有決定該 block 實際放得多近，也沒有決定多筆 I/O 先做哪一筆。index blocks 是否命中 cache，以及 free space、block size、fragments、write policy 與 delayed allocation 如何影響 placement，都交由 [Lecture 21](/posts/learning/2026-08-22-stanford-cs111-lecture-21-free-space-buffer-cache)完整處理。這裡只保留分界：lookup 產生 physical requests 之後，disk scheduler 才能排序它們。

## FIFO、SPTF、SCAN 與 CSCAN

多筆 disk I/O 等待時，ordering 目標是減少 seek。FIFO 按到達順序，公平直觀但不優化位置。Shortest positioning time first（SPTF）選移動最短者，減少 seeks 卻可能讓遠端 request starvation。SCAN 像 elevator 往一方向服務最近 requests，再反向；CSCAN 只在一方向服務，到端點後跳回起點，使等待較一致。

最後三張圖以同一組 pending requests 和 most recent I/O 對比：FIFO 有許多 long seeks，SPTF 得 minimal seeks，CSCAN 依單一方向掃描。PDF 圖的文字抽取把相鄰標號黏成「71」，無法可靠判定那是 sector 7 與 1 還是 71；本文不虛構精確 traversal sequence，只保留圖能確定的政策比較。

## 更新紀錄

- 2026-08-22：依 byte-identical Lecture 20／21 PDF 落實分工；本篇聚焦 inode index walk 與 disk scheduling，cache、free-space 與 allocation 改由 Lecture 21 承擔。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 20 slides: File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)
- [FreeBSD inode(5) manual](https://man.freebsd.org/cgi/man.cgi?query=inode&sektion=5)
- [OSTEP: File System Implementation](https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf)
