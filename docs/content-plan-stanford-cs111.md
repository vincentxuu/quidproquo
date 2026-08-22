# 內容規劃：Stanford CS111 逐講系列

- 來源：Stanford CS111, **Spring 2026**（28 lectures）
- Canonical manifest：[官方 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- 規模：**28 篇 × zh-TW/en = 56 個新 Markdown 檔**；既有雙語總覽維持 series order 1，不改 slug／date
- 資料成熟度：L3；28 講都有公開 PDF，錄影僅限 Canvas
- 授課者：Mendel Rosenblum

## 實作狀態

- 完成：Lectures 1–28 zh-TW/en（56 篇文章與 28 份研究 notes 均已存在，並逐份依官方 PDF agenda 完成內容）
- 草稿狀態：Lectures 1–28 的 zh-TW/en 全部維持 `draft: true`，**不得視為已發布稿**
- 系列 fidelity 完成度：28 / 28 lectures；clean-context 獨立 review 已通過。56 篇仍維持 `draft: true`，等待使用者最終 review，因此已發布為 0 / 28。
- 重複 artifact：Lecture20.pdf 與 Lecture21.pdf 逐位元組相同（SHA-256 `42e4021f84ed272db95224024c878a09d6c719430efc386c2614dcc8ef94310d`）；L20 負責 inode walk／disk scheduling，L21 聚焦 cache／free space／fragments／delayed allocation。
- 短篇理由：Lecture 21 官方 artifact 與 Lecture 20 完全重複且錄影不公開；中文聚焦重複 deck 中段完整 agenda，不再複製 L20 已承擔的 inode walk 與 scheduling。
- 重複 artifact：Lecture16.pdf 與 Lecture17.pdf 逐位元組相同（SHA-256 `65091d9719674258175c2dcf29e1ad82bca8ff8a82d3b66d73b9e40ad3287d9e`）；L16 已移除完整 replacement 重講，只保留 page-fault／fetching mechanism；L17 以 replacement／thrashing policy 為主，不宣稱兩份不同 deck 或可還原的口述分界。
- 短篇理由：Lecture 19 公開 PDF 僅 18 頁，內容止於 FAT evaluation；中文 5,685 字元已逐頁覆蓋 access patterns、inode、contiguous／linked allocation 與 FAT，並如實標出 4 KiB 問號、簡化容量模型與 IBM PC 年份異常，不提前灌入後續 directory／journaling 講次。
- 短篇理由：Lecture 18 公開 PDF 僅 18 頁，其中封面、選讀與最後兩頁歷史圖片不增加技術 agenda；中文 5,434 字元已覆蓋 HDD 幾何與延遲、block API、MMIO、poll/interrupt、PIO/DMA 及完整 queue/doorbell 流程，不從其他 offering 補入本講未教授的 disk scheduling 演算法。
- 短篇理由：Lecture 14 官方 PDF 與 Lecture 13 是逐位元組相同的 25 頁檔案，且錄影不公開；中文聚焦重複 deck 後段全部 segmentation agenda，不複製 Lecture 13 的 base/bound 前半灌水。
- 短篇理由：Lecture 11 官方 PDF 與 Lecture 10 是逐位元組相同的 22 頁檔案，且錄影不公開；中文 4,653 字元聚焦重複 deck 後半全部 reclamation agenda，不再複製 Lecture 10 的 placement 內容灌水。
- 短篇理由：Lecture 6 的公開 PDF 僅 16 頁，主體是單核心版本與多核心 v1–v5 的逐格 race 修正；文章已覆蓋全部版本，不混入其他學期材料灌水。
- 短篇理由：Lecture 4 的 PDF 為 26 頁，其中多頁逐格重演同一個 Too Much Milk 狀態；中文 5,977 字元已逐一覆蓋合法 interleaving，不重複描述相同畫面灌水。
- 短篇理由：Lecture 2 的公開 PDF 為 22 頁，議程只涵蓋 execution abstractions 與建立 process/thread 的介面，因此中文 5,709 字元即停止，不用其他學期材料灌水。

## 編輯契約

1. 一篇對應一個官方 lecture，版本固定為 Spring 2026。
2. 每篇標明日期、講者、官方 PDF 與錄影缺口。
3. 正文依 PDF 主題前進；作者補充只放在「延伸」。
4. zh-TW/en 共用 order、來源與章節骨架。
5. 既有總覽保持 order 1；Lectures 使用 order 2–29。

## Manifest

| Order | Lecture | Date | Official title | Slug | Material |
|---:|---:|---|---|---|---|
| 2 | 1 | 2026-03-30 | Welcome to CS111! | `welcome-os-principles` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf) |
| 3 | 2 | 2026-04-01 | Threads, Processes, and Dispatching | `threads-processes-dispatching` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/2/Lecture2.pdf) |
| 4 | 3 | 2026-04-03 | Threads, Processes, and Dispatching, Continued | `dispatching-context-switch` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf) |
| 5 | 4 | 2026-04-06 | Concurrency | `concurrency-atomicity` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/4/Lecture4.pdf) |
| 6 | 5 | 2026-04-08 | Locks and Condition Variables | `locks-condition-variables` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/5/Lecture5.pdf) |
| 7 | 6 | 2026-04-10 | Implementing Locks | `implementing-locks` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/6/Lecture6.pdf) |
| 8 | 7 | 2026-04-13 | Deadlock | `deadlock` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/7/Lecture7.pdf) |
| 9 | 8 | 2026-04-15 | Scheduling | `cpu-scheduling` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf) |
| 10 | 9 | 2026-04-17 | Linkers and Dynamic Linking | `linkers-dynamic-linking` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf) |
| 11 | 10 | 2026-04-20 | Dynamic Storage Management | `dynamic-storage-allocation` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf) |
| 12 | 11 | 2026-04-22 | Dynamic Storage Management, Continued | `storage-reclamation` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/11/Lecture11.pdf) |
| 13 | 12 | 2026-04-24 | Trust and Operating Systems | `trust-operating-systems` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf) |
| 14 | 13 | 2026-04-27 | Virtual Memory | `virtual-memory` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf) |
| 15 | 14 | 2026-04-29 | Virtual Memory, Continued | `segmentation-address-spaces` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/14/Lecture14.pdf) |
| 16 | 15 | 2026-05-01 | Paging | `paging-page-tables` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf) |
| 17 | 16 | 2026-05-04 | Demand Paging | `demand-paging` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf) |
| 18 | 17 | 2026-05-06 | Demand Paging, Continued | `page-replacement` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf) |
| 19 | 18 | 2026-05-08 | Magnetic Disks | `magnetic-disks` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf) |
| 20 | 19 | 2026-05-11 | File Systems | `file-systems` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) |
| 21 | 20 | 2026-05-13 | File Systems, Continued | `file-system-indexes` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf) |
| 22 | 21 | 2026-05-15 | File Systems, Continued | `free-space-buffer-cache` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) |
| 23 | 22 | 2026-05-18 | Directories and Links | `directories-links` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf) |
| 24 | 23 | 2026-05-20 | File System Crash Recovery | `crash-recovery` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf) |
| 25 | 24 | 2026-05-22 | File System Crash Recovery, Continued | `journaling-file-systems` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf) |
| 26 | 25 | 2026-05-27 | Truth, Trust, and Technology | `truth-trust-technology` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/25/Lecture25.pdf) |
| 27 | 26 | 2026-05-29 | Flash Memory | `flash-memory` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) |
| 28 | 27 | 2026-06-01 | Virtual Machines | `virtual-machines` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf) |
| 29 | 28 | 2026-06-03 | Course Review | `course-review` | [PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/28/Lecture28.pdf) |

## 材料缺口

- Canvas/Panopto 錄影不公開，所有文章只宣稱讀過 calendar 與 lecture PDF。
- 官方 calendar 把 5 月 25 日誤標為 Presidents' Day；該日實為 Memorial Day，且不是 lecture。
- PDF 受 Stanford 版權聲明保護；研究筆記只記摘要與頁面主題，不重製投影片。

## 完成定義

- order 1–29 中英連續、28 講各有雙語文章。
- 每篇至少連到 calendar 與該講 PDF，並通過 references、lang parity、series order 與台灣用語檢查。
