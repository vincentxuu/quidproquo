---
title: "Stanford CS111 Lecture 19：檔案抽象、配置策略與 FAT"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 20
tldr: "檔案系統把耐久 byte collection 映射到磁碟 blocks；contiguous、linked 與 FAT 分別交換 locality、成長彈性、random access 與 metadata 成本。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 19：檔案抽象、access patterns、inode、contiguous／linked allocation 與 FAT。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-19-file-systems-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 20 篇，對應 **Stanford CS111, Spring 2026, Lecture 19**。2026-05-11 由 Mendel Rosenblum 主講，官方題目是 [File Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)。本文逐頁依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；Canvas／Panopto 錄影不公開，因此不把錄影內容當成已核對來源。

## 高延遲磁碟上的四個問題

上一講的磁碟具有高 latency，連續傳輸卻相對快。檔案系統要同時處理四件事：disk-space management 要分享容量、減少 seeks 並避免浪費；naming 把 file name 解析成 blocks 的位置；reliability 要讓資料跨 OS crash 與 hardware failure 留存並可恢復；protection 則隔離使用者並允許受控分享。

這四題互相牽制。連續配置提高 locality，卻可能難以成長；更多 metadata 加速定位，卻占空間且增加 crash 後要維持一致的狀態。這講聚焦 disk layout，只把 naming、recovery 與 protection 列為目標，沒有展開 directory lookup、journaling 或 permission-check algorithm，不能倒灌後續材料。

## 使用者的 bytes 與核心的 blocks

使用者看到的 file 是「有名稱、耐久保存的一串 bytes」。核心看到的則是一組 disk blocks，加上 metadata。byte stream 讓應用程式不必知道 sector 邊界；核心仍須把任意 byte offset 轉成某個 block 與 block 內位移。

存取型態決定 layout 的價值。Sequential access 依序處理 bytes；[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)稱當時機器約占 90%，並以 editor、compiler 為例。這是 deck snapshot，不是所有 workload 的比例。Random access 依位置取得任意 byte，demand paging data set 與 database 會需要它。Keyed/indexed access 依內容找 record，例如 hash table、associative database 或 dictionary，通常由 database 而非 OS 提供。

多數 files 很小，所以 per-file overhead 必須低；大部分 disk space 與 I/O 卻集中在 large files，所以長檔 throughput 也要好。建立時又不知道最終大小。只對「平均檔案」最佳的設計，可能同時傷害大量小檔 metadata 或少量大檔路徑。

## Inode 是每個檔案的索引節點

inode 是每個 file 一份的 OS data structure。檔案 open 時可留在 memory，也和 data 一起存於 disk。投影片列 file size、占用 sectors、last read／last write times，以及 owner id、group id、rwx protection。名稱不在這張 inode 清單中；名稱解析如何連到 inode 是另一層問題。

inode 要回答「這個 byte 對應哪個 sector」，並以少量 metadata 完成。評估 layout 有兩個直接標準：能否快速找到 bytes，以及索引本身是否省空間。contiguous、linked 與 FAT，都是同一 mapping problem 的不同答案。

## Contiguous allocation：最短索引，最難成長

Contiguous allocation 把檔案配置成連續 sectors 群組，也稱 extent-based allocation。inode 只保存 first sector 與 sector length；形狀類似 virtual memory 的 base-and-bound 或 segmentation。給定 offset，核心用簡單算術找到 block，sequential 與 random access 都直接，連續 I/O 的 seeks 也少。

代價是建立時要指定長度，OS 還要保存 unused areas 的 free list。檔案超出原 extent 時，後方未必有空間；預留太多又浪費。外部 fragmentation 可能留下總量足夠、卻沒有夠大連續洞的空間，使 large file 無法配置。

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)以 IBM OS/360 為例，評價是 simple、metadata compact、sequential 最佳，但 size prediction、extension 與 fragmentation 棘手。現代「extent-based」可能支援多 extents；本講 historical model 是單一 contiguous group，不應把後來變體反推回來。

## Linked allocation：成長容易，定位昂貴

Linked files 把 disk 切成 fixed-size blocks；[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)在「4096 bytes?」刻意留問號，表示示意而非規格。inode 指向 first block，每個 data block 放 next pointer，最後為 null；free blocks 也能用 linked free list。新增資料只需取得任意 free block 串到尾端，不用預測 file size，也不要求連續大洞。

Sequential access 可追 links，但散落 blocks 仍造成許多 seeks。Random access 更差：到第 k 個 block 必須從 first block 走過前 k−1 個 links。pointer 占 data block 空間，損壞一個 link 可能使後段不可達。[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)列 TOPS-10 與 Xerox Alto 為 “more or less” 的例子，因此只宜視為類似設計。

它解掉 contiguous 的成長與外部 fragmentation，卻犧牲 locality 和直接索引。自由配置位置不是免費彈性；沒有額外 index 時，定位成本沿鏈長增加。

## FAT：把所有 links 搬到記憶體表格

MS-DOS 的 File Allocation Table（FAT）保留 linked allocation 邏輯，卻把 next pointers 集中到一張 table。每個 disk block 對應 FAT entry，內容可能是 next block number、end-of-file 或 free 特殊值。directory entry 保存 first block；尋找空間可掃描 FAT，也可從檔案末塊附近開始。

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)例子中，A 指到 block 6，再走 6 → 4 → 3 → end；B 走 1 → 2 → end。鏈仍可能散落，但 FAT 正常時常駐 memory，追索引不必為每個 pointer 讀 data block。因此 random access 仍要走鏈，卻比 on-disk links 快；data blocks 也不再存 pointer。FAT 同時標記 free entries，所以兼任 free list。

Sequential access 在不 fragmented 時能接近 contiguous performance，若 blocks 分散仍增加 seeks。全域表必須放進 memory，而且配置與刪除後 free space 趨於 fragmented。FAT 沒消除鏈式配置，只把昂貴 traversal 移到較快層。

## FAT16、FAT32 與投影片的歷史異常

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)說 original FAT 使用 16-bit integers 與 512-byte block，最大 disk 為 32 MB；簡化乘法 2^16 × 512 bytes 的確是 32 MiB 量級。接著說 Microsoft 於 1996 引入 FAT32，32-bit entries 中 28 bits 作 sector number，並以 cluster 分組相鄰 sectors，cluster size 在建立 file system 時固定為 2–32 KB。

[deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) 列 4 KB clusters 支援至 1 TB、32 KB clusters 至 8 TB。以 28-bit addressable cluster count 計算，量級相符；但這是簡化容量模型，不等於 Microsoft 規格對保留值、volume size 與工具限制的完整敘述。

另一個異常是[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)稱 FAT 用於 original IBM PC「1983」。IBM 的 PC 歷史頁把 IBM 5150 的推出日期列為 1981；1983 更接近 PC/XT 時期。本文保留「早期 IBM PC 使用 FAT」的主旨，不重述 1983 為原始 PC 發表年，因此 slide 括號不宜當精確產品年表。

## 三種配置其實在交換什麼

Contiguous 用極小 inode 與優秀 locality 換取難成長和 fragmentation。Linked 讓任意 free block 都可加入，換取 pointer overhead、seeks 與線性 random lookup。FAT 把 links 集中並常駐 memory，改善 traversal 且讓 data block 完整，換取隨 disk 規模成長的全域表與仍可能嚴重的 fragmentation。

可以用三種 workload 檢查：固定大小、頻繁 sequential read 偏好 contiguous；不可預測地 append 需要成長彈性；需要 random access 的大檔不適合逐塊追 on-disk links。這講沒有宣布永遠最佳者，而是讓「metadata 放哪裡」與「物理 blocks 如何分布」的代價可比較。

## 更新紀錄

- 2026-08-22：依 Lecture 19 官方 PDF 重寫完整 file-layout agenda，並標示 4 KiB block 問號、容量模型與 IBM PC 年份異常。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 19 slides: File Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)
- [IBM: The IBM PC](https://www.ibm.com/history/personal-computer)
- [OSTEP: File System Implementation](https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf)
