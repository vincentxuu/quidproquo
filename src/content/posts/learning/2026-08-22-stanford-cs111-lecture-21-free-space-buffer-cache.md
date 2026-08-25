---
title: "Stanford CS111 Lecture 21：Block Cache、Free Bitmap 與 Delayed Allocation"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 22
tldr: "Block cache 把熱索引留在 DRAM，bitmap 與保留空間維持配置選擇，fragments 和 delayed allocation 則用較晚、較完整的資訊換取 locality。"
description: "聚焦導讀 Stanford CS111 Spring 2026 Lecture 21：block cache、同步與延遲寫入、free bitmap、block fragments、repacking 與 delayed allocation。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-21-free-space-buffer-cache-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 22 篇，對應 **Stanford CS111, Spring 2026, Lecture 21**。2026-05-15 由 Mendel Rosenblum 主講，官方題目是 [File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)。官方 [Lecture 20 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf) 與 Lecture 21 PDF 逐位元組相同，SHA-256 均為 `42e4021f84ed272db95224024c878a09d6c719430efc386c2614dcc8ef94310d`。Canvas／Panopto 錄影不公開，無法還原兩天實際口述分界。

因此本文聚焦重複 [deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) 中段的 block cache、free-space bitmap、block fragments、repacking 與 delayed allocation。Direct／indirect inode walk 和尾端 disk scheduling 已由 [Lecture 20](/posts/learning/2026-08-22-stanford-cs111-lecture-20-file-system-indexes)完整處理；這裡不假裝有另一份 deck，也不複製相同段落灌水。

## Block cache 解掉冷索引的 I/O

BSD inode 的 indirect block 若每次都從 disk 讀取，大檔操作最多會在 data I/O 前多付兩次 index reads。OS 因此用部分 main memory 保存最近存取的 disk blocks；頻繁使用的 indirect blocks 與 inode blocks 會自然留在 cache。投影片指定 LRU replacement，讓近期不活躍的 cached block 先被回收。

這使「double-fault」成為 cold-cache 上界，而非每次存取的固定成本。第一趟走過 index tree 後，後續相鄰 reads 很可能命中同一批 index blocks。cache 沒有改變 on-disk layout，卻改變實際 latency distribution：少數 miss 支付 disk I/O，多數 hit 只讀 DRAM。

block cache 也和 virtual memory 競爭同一份 physical memory。OS 同時決定多少頁給 processes、多少頁保存 file blocks；cache 過小會重讀 metadata，過大則可能讓行程 pages 更早 fault。這是一個全域容量政策，不是兩個獨立記憶體池。

## 修改過的 cache block 何時落盤

Synchronous write 在 cache block 修改後立即寫穿 disk。優點是完成回傳時資料不只停在 volatile DRAM；缺點是 process 必須等慢速 I/O，每次小更新都可能成為一次 disk operation。投影片把它簡稱為 safe 與 slow。

Delayed write 先把 block 標成 dirty，等待一段時間再 flush。[deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) 寫「30 seconds?」，問號表示示意而非固定介面保證。等待期間，多次修改同一 indirect block 可以合併；temporary file 若很快刪除，甚至不需把其 data 寫出。write call 因而較快，disk I/O 也可能減少。

代價是 crash window：尚未 flush 的 dirty blocks 可能遺失。投影片的 safe/dangerous 是教學對比，不代表 synchronous write 自動解決 controller cache、write ordering 或 multi-block consistency。此講只建立 durability 與 throughput 的基本交換，不提前引入後續 recovery protocol。

## 從 free list 到 free bitmap

early Unix 用 linked list 保存 free blocks。初始 list 排序時，連續取 block 可形成良好 locality；經過反覆 allocate/free 後順序很快 scrambled，新檔便散落各處。鏈結結構能回答「有沒有空 block」，卻不容易快速看見某一區域是否有一串好位置。

free bitmap 為每個 disk block 保存一 bit：[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)定義 1 為 free、0 為 in use。以 1 TiB disk 和 4 KiB blocks 計算，共有 2^28 blocks，bitmap 需要 2^28 bits，也就是 32 MiB。這個數字是 deck 模型的二進位容量算式；它沒有把 file-system metadata、reserved regions 或不同 block size 加入。

bitmap 讓 allocator 搜尋靠近 file previous block 的 free position。disk 尚有餘裕時，通常能找到「good」block；越接近滿載，掃描成本上升、剩餘 holes 也難形成 locality。資料結構沒有消除 fragmentation，但讓空間分布可被批次檢視。

## 為何要假裝磁碟少 10%

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)的直接政策是不要讓 disk 真正填滿：對使用者少報 10% 容量，到 90% 就拒絕新寫入。這不是所有 file system 的固定門檻，而是展示 over-provisioning 的效果。保留 slack 後，allocator 有多個候選，較可能找到靠近既有 file blocks 的位置。

若只看可用 bytes，保留空間像浪費；若把 seek、bitmap search 與未來成長算進來，它買到的是選擇權。接近 100% 時，即使仍有零星 blocks，也可能需要長時間搜尋並產生高度分散的 layout。容量管理因此也是效能管理。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)）

## 大 block 與 internal fragmentation

早期 512-byte block 配合當時 sector，但一個檔案需要更多 transfers，indirect block 也只能容納 128 個 4-byte pointers；[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)估 pointer metadata 可占 disk 的 1%。放大成 4 KiB block 能提高順序 I/O、增加 inode fan-out，卻讓小檔最後一塊留下更大的 unused tail。

[deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) 以多數 files 很小、files 不能共享普通 block 為前提，說 4 KiB blocks 可能浪費 almost half disk space。這是 workload-dependent 的近似警告，不是數學定律。固定大小的選擇同時控制 transfer granularity、metadata depth 與 internal fragmentation，無法只最大化其中一項。

## 4.3BSD fragments 把兩種粒度分開

4.3BSD 讓大部分資料使用 4 KiB large blocks，但允許 file 最後一塊使用 512-byte multiples 的 fragment。同一 large block 可裝不同 files 的尾端 fragments，free bitmap 也以 fragment 為單位。長檔中間仍走大 block 的高效率，短檔尾端則不必浪費整塊。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)）

限制「只有 last block 可 fragment」很關鍵。若每一段都任意切小，metadata 與 I/O 又會退回細粒度成本。這個設計把例外限制在最可能產生 internal fragmentation 的尾端，保住 common case 的簡單 layout。

## Repacking 與 delayed allocation

file 建立時不知道最終大小，而且是一 block 一 block 成長；小檔會切碎 free space，大檔卻想取得 extents。較新的技術可用 16 KiB large blocks 與 2 KiB fragments/extents，初期逐塊配置，file 到一定大小後再尋找 large contiguous clusters 並重配。它以搬移成本換取長期 locality。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)）

另一做法是等 cache flush 才真正配置 disk space。此時 OS 已看見一批 dirty blocks，可替所有已知 blocks 一次配置 cluster，而不是每次 write 都在資訊不足時選一格。Delayed allocation 和 delayed write 不完全相同：前者延後決定位置，後者延後把內容送到 disk；實作常結合，但分析時要分開。

投影片說 disk space 便宜，所以今日 internal fragmentation 不太重要。這是相對成本判斷，不是浪費消失；小容量裝置、quota 與大量 tiny files 仍可能敏感。可靠的結論是：當容量成本下降，系統更願意用較大 units 換取較少 metadata、較少 seeks 與較高 throughput。

## 更新紀錄

- 2026-08-22：依與 Lecture 20 重複的官方 PDF，聚焦 cache、free space、fragments 與 delayed allocation，並記錄相同 SHA 與錄影缺口。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 21 slides: File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)
- [FreeBSD inode(5) manual](https://man.freebsd.org/cgi/man.cgi?query=inode&sektion=5)
- [OSTEP: File System Implementation](https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf)
