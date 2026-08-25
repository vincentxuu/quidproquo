---
title: "Stanford CS111 Lecture 26：Flash Translation Layer、Garbage Collection 與 Wear Leveling"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 27
tldr: "Flash 只能逐頁 program、整個 erase unit 清除；FTL 以 out-of-place mapping 隱藏不對稱，再用 garbage collection、temperature segregation、wear leveling 與 TRIM 管理放大成本。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 26：flash cells、erase units、FTL mapping、crash-safe page states、garbage collection、write amplification、wear leveling 與 TRIM。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-26-flash-memory-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 27 篇，對應 **Stanford CS111, Spring 2026, Lecture 26**。2026-05-29 由 Mendel Rosenblum 主講，官方題目是 [Flash Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)。本文逐頁依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；Canvas／Panopto 錄影不公開。SHA-256 稽核顯示 Lecture 26 與相鄰 Lectures 25、27 均不同，沒有 duplicate artifact。

## Flash 位在 disk 與 DRAM 之間

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)說 flash 已在 phones、laptops 等多數裝置取代 magnetic disk，並封裝成 SSD。和 disk 相比，它無 moving parts，因此更耐震、可靠性較高，random-access latency 約低 100–1,000 倍，但 cost/bit 高 3–10 倍。和 DRAM 相比，flash 是 nonvolatile、cost/bit 低 5–20 倍，速度卻慢 100–1,000 倍。

這些倍率與後面的容量／延遲都是 Spring 2026 [deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) 的量級快照，不是所有產品的規格。重要的是位置：flash 有 persistent storage 的介面期待，卻不像 disk 有 seek，也不像 DRAM 能任意覆寫 byte。file system 若假設「block 可原地重寫」，controller 就必須在中間補上一層。

page read 約 10–100 µs；1→0 program 約 100–1,000 µs，0→1 約 1,000–10,000 µs。存取單位是 4–16 KiB pages，chip capacity [投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)列至 2 TB。原 PDF 在 page-size 行尾多一個右括號，是排版異常；本文保留範圍，不複製錯括號。

## Program page，卻要 erase 整個 unit

flash page 的 write 只能把更多 bits 從 1 清成 0，效果像 logical AND。要把任何 0 變回 1，必須先 erase 包含該 page 的整個 erase unit，使其全為 1。erase unit 通常 1–8 MiB、包含許多 pages，[deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) 給 erase 1,000–10,000 µs，典型效能頁又寫約 2 ms。

因此 program 與 erase 粒度不對稱。只改一個 logical block，若硬做 in-place update，就可能要讀出 unit 的其他 live pages、erase 全 unit、再連同新內容全部寫回。erase 還會磨耗 unit；[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)列 100–100,000 cycles 才無法可靠保存，跨度很大，反映 flash type 與製程差異。

典型 throughput 強烈依賴 parallelism：[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)以 single NAND chips 為數百 MB/s、SSD 透過多 channels/dies 可達數 GB/s 為例。這也解釋為何單頁 latency 和裝置 aggregate throughput 不能互相換算；controller 同時排程多個操作才得到高頻寬。

## Direct mapping 為何失敗

既有 file system 想看到像 disk 一樣的 linear blocks。Flash Translation Layer（FTL）在 device 內管理 flash，把 virtual block number 映射到 physical page，讓舊 file system 繼續呼叫 block read/write。代價是額外 metadata、reserved space、performance overhead，且實作通常 proprietary。

最直接 mapping 令 virtual block N 永遠住 physical page N。read 很簡單；write N 卻要讀出所在 erase unit、erase、再重寫 unit 並替換 N。每次小 write 都增加約 2 ms erase cost，同一熱門 block 也反覆磨耗同一 unit。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)）

更危險的是 crash：若 erase 後、重寫完整 unit 前斷電，old data 已消失而 new state 尚未完成。投影片說某些 inexpensive USB sticks 搭 FAT 曾用類似 direct map。這是可能技術的課堂例子，不應泛化成所有 USB 裝置。

## Out-of-place mapping 與 A-W-G lifecycle

較好的 FTL 把 virtual identity 與 physical location 分離。read 先查 block map；write 找一個 free、already-erased page，寫入新 copy，更新 map，再把舊 page 標成垃圾。virtual block 隨時間搬家，不需要每次更新都先 erase 原位置。

Approach #1 把 block map 放 DRAM、開機掃描 flash headers 重建。每頁 header 保存 virtual block number 與 allocated、written、garbage 三 bits。因 flash 初始全 1 且只能清為 0，生命週期是：erased `111`、allocated-not-written `011`、successfully-written `001`、obsolete/garbage `000`。

中間 `011` 用來偵測 writing crash：若只完成 allocation bit，reboot scan 不會把半寫 page 當成有效最新版。重建時仍需處理同一 virtual block 的版本選擇；[deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) 沒展開 sequence number 或 atomic-map protocol，因此本文只陳述 A-W-G 能識別未完成狀態，不自行宣稱它單獨解決所有 crash consistency。

## Garbage collection 與 write amplification

out-of-place write 每次留下舊 garbage page，逐漸降低 effective capacity。collector 找 garbage 比例高的 erase unit，把其中 live pages copy 到 clean unit 並更新 map，利用其餘空間放新 pages，再 erase 舊 unit。回收不是免費：為取得可寫空間，必須搬仍有效的資料。

若 victim unit 的 live utilization 為 U，collector 讀並重寫 U units 的 old data，最後只騰出 1−U 給 new data。每寫一 unit 新內容，實際 flash writes 為 `1/(1−U)`：U=.5 時 amplification 2，U=.9 時 10，U=.99 時 100。公式假設按這個 U 的 unit 回收，是教學上界模型。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)）

高 utilization 同時追求容量與低 write cost 很困難；頻繁 collection 也加速 wear。可是全裝置平均 U=.5 不代表 collector 只能選 U=.5 的 unit。理想分布是多數 units nearly full，少數 victims nearly empty；挑後者可降低搬移量，所以真實 FTL 會設法塑造 bimodal distribution。

## Temperature segregation 與 wear leveling

locality 不只描述 read，也描述 updates。FTL 可把同時更新、具有相似 lifetime 的 blocks 放進同一 erase unit，並依 temperature 分組：hot blocks 近期很可能被覆寫，cold blocks 很少改。hot unit 很快累積 garbage，collector 能找到低 U victims；cold live pages 則不必每輪跟著搬。

但只回收 hot units 會讓它們承受所有 erase cycles，提早 wear out。Wear leveling 偶爾選 cold unit，即使回收不到多少空間，也把 cold data 搬走，釋出較少磨耗的 unit 給新 writes。它故意接受眼前較差的 GC efficiency，換取整個 device 較均勻的 erase count。

garbage collection 問「哪裡搬最少 live data」，wear leveling 問「哪裡需要分攤磨耗」。兩個 objective 可能衝突，FTL policy 必須同時看 utilization、temperature 與 erase history，而非只追單一最空 unit。裝置壽命與即時寫入成本因此必須一起衡量。

## FTL、TRIM 與跨層資訊缺口

FTL 造成重複 mapping：file block → logical disk block → flash page；若 file system 直接管理 flash，理論上可省一層。但廉價 device 已內建 FTL，flash-native file systems 因相容性與市場現實沒有取代一般 block interface。現行方向是讓 file system 與 FTL 更好合作。

最大資訊缺口是 file system 刪除 file block 時，FTL 只看到「沒有再讀寫」，不知道 logical block 已無效；GC 可能繼續 copy 已刪資料。TRIM 讓 OS 告知 device 哪些 logical blocks freed，FTL 可直接視為 garbage，減少無用 copying。FTL 則繼續負責 wear leveling、bad blocks 與 erase scheduling。

flash 鼓勵 not-in-place updates，而 disk 曾偏好 in-place 以維持 sequential layout。現在 SSD file systems 也努力避免原地更新。這不是說 append-only 自動正確，而是底層物理成本改變後，上層 allocation/recovery policy 也要重新排列。

## 更新紀錄

- 2026-08-22：依 Lecture 26 官方 PDF 重寫 flash/FTL 全講，限定硬體數字為 deck snapshot，並標示 page-size 括號與 crash-state能力邊界。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 26 slides: Flash Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)
- [NVM Express: Dataset Management / deallocate](https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0d-2024.01.11-Ratified.pdf)
- [Linux kernel documentation: F2FS](https://docs.kernel.org/filesystems/f2fs.html)
