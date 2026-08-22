---
title: "Stanford CS111 Lecture 24：Journaling、Transaction 與 Checkpoint"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 25
tldr: "第 24 講從 WAL 入口往下拆 transaction、idempotent replay 與 checkpoint，說明一致性不等於 durability，journal 也不能取代 fsync 與備份。"
description: "導讀 Stanford CS111 Spring 2026 Lecture 24：journaling entry、transaction、idempotent replay、checkpoint，以及 consistency 與 durability 的分界。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-24-journaling-file-systems-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 25 篇，對應 **Stanford CS111, Spring 2026, Lecture 24**。2026-05-22 由 Mendel Rosenblum 主講，行事曆上的題目是 [File System Crash Recovery, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)。本文只使用[公開講義 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)；錄影位於 Canvas／Panopto 後方，不算已讀來源。

先說材料的異常：Lecture 23 與 Lecture 24 的 PDF 都有 23 頁，逐頁標題、條列與順序相同。兩個檔案的 SHA-256 不同，但抽出的文字只差 `/lost+found` 的斜線與四處句點。公開資料因此沒有一份獨立的「continued」[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)。本文不虛構不存在的內容，而是把第 1–15 頁交給 Lecture 23，從第 16 頁起專注 write-ahead logging、transaction、checkpoint，以及 consistency 與 durability 的分界。

## 從前講接續：公開素材相同，閱讀問題不同

[Lecture 23](/posts/learning/2026-08-22-stanford-cs111-lecture-23-crash-recovery)已處理第 1–15 頁的 crash model、`fsck`、ordered writes 與 WAL 入口。本講不再重講掃描修復案例，而是從第 16 頁開始追問：一筆 log 如何描述更新、多筆 entry 如何組成 transaction、replay 如何允許重做，以及 checkpoint 如何安全回收 log。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)）

前講留下的比較基準仍要保留：`fsck` 在 crash 後從 metadata 重建合法狀態；ordered writes 在 crash 前限制危險順序；WAL 則在 home blocks 之前先留下可復原的承諾。L24 的工作，是把第三句展開成真正可執行的協定。

## 方法三：先寫 journal，再改正式位置

第 16–18 頁把 WAL 原則展開成 journaling protocol。系統先把即將進行的操作附加到特殊 log，之後才以任意順序更新正式區塊；重開機時 replay 已完成的 log group。Linux 核心的 [ext4 journal 文件](https://docs.kernel.org/filesystems/ext4/journal.html)也描述同樣兩階段：transaction 先完整寫入並 commit 到 journal，之後才 checkpoint 到最終位置；若第二階段崩潰，就從 journal replay。

log entry 可以描述 logical operation，例如「把某區塊設為 inode 的第幾個區塊」；也可以描述 physical update，例如「把某區塊某 offset 的四個 byte 改成某值」。replay 可能自己再次崩潰，所以動作必須是 **idempotent**：重做一次與重做多次應得到相同結果。

一個檔案系統操作可能需要多筆 log entry。恢復程式必須判斷 consistent group 是否完整，不能只套用一半。Assignment 8 採 hybrid entry：既能 patch disk block，也能標記區塊已配置或釋放；再用 transaction 的 start 與 end 記號框出全有或全無的一組更新。這裡的 transaction 是 crash-recovery 邊界，不代表資料庫 transaction 的所有並行控制語意。

## checkpoint 解決無限增長，但不是免費清空

第 19 頁指出 log 若永遠追加，復原仍會愈來愈慢。checkpoint 先記下「最後一個完整 transaction 之後」的 log head，再把所有 dirty block 寫回正式位置；確認完成後，才可截去該位置以前的 log。順序不能顛倒，否則發生在 truncate 之後、dirty blocks 寫完之前的崩潰，會同時失去正式更新與可 replay 的紀錄。

另一個選擇是「要記多少」。講義說常見做法只 journal metadata，如 free map、inode 與 indirect block；把 file data 也寫入 journal 會更昂貴。[ext4 官方文件](https://docs.kernel.org/filesystems/ext4/journal.html)提供具體對照：預設 `data=ordered` 主要記 metadata，`data=journal` 讓 data 與 metadata 都通過 journal，而 `data=writeback` 對資料區塊的順序保證更弱。journaling 不是單一固定保證，必須連同設定一起談。

## 延遲 log 寫入：一致性與持久性正式分家

第 20–22 頁整理優缺點。journal 讓重開機只需處理有限 log，依序追加也適合儲存裝置；metadata 可繼續延遲寫回，不必為排序把所有正常操作改成同步。但最簡單的 write-ahead logging 會在每次 metadata 操作前加入同步 log write，而且延遲的 file data 仍可能在崩潰時消失。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)）

安全條件其實不是「每筆 log 都立刻同步」，而是：相關正式區塊落盤以前，對應 log entry 必須先落盤。系統可以先把 log 暫存在記憶體，等 buffer cache 真要寫出某個區塊時，再先 flush 所需 log。這保住 consistency，卻沒有承諾剛寫入的內容已 durable。

需要持久性時，應用程式必須明確要求同步。Linux [`fsync(2)` 手冊](https://man7.org/linux/man-pages/man2/fsync.2.html)說明它會 flush 檔案的 modified in-core data 與相關 metadata；若要保證新檔名的目錄項目也到儲存裝置，還需對目錄本身呼叫 `fsync`。journaling 解決檔案系統結構如何在崩潰後回到合法狀態，不是替每次應用程式寫入自動做 durability 承諾。

## 本講的結論：先決定要承受哪種失敗

最後一頁把設計空間收斂成 performance、durability、consistency 三個目標。`fsck` 把成本放在重啟後，ordered writes 把限制放在正常寫入順序，journaling 則多寫一份可 replay 的意圖。三者都沒有處理儲存裝置本身毀損；那需要 replication 或 backup，而不是更精巧的 journal。

闔上投影片後，可以用一次「替檔案配置新區塊」自我測驗：列出 free map、inode、data block 與 log 的每次寫入，在任意兩步間插入斷電，再判斷重啟後是遺失資料、洩漏空間、metadata 不一致，還是能完整 replay。只要還說不清楚哪個 write 必須先 durable，就還沒有真正讀懂 write-ahead 的「ahead」。

## 逐頁核對清單

- 第 1–15 頁：由 Lecture 23 承擔 crash model、`fsck`、ordered writes 與 WAL 入口。
- 第 16–18 頁：logical／physical entry、idempotence、consistent group、Assignment 8 transaction。
- 第 19–22 頁：checkpoint、metadata-only logging、優缺點、delayed log writes、`fsync`、裝置失效。
- 第 23 頁：performance、durability、consistency 與可恢復失敗範圍的取捨。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 24 slides: File System Crash Recovery, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)
- [Linux kernel documentation: ext4 Journal (jbd2)](https://docs.kernel.org/filesystems/ext4/journal.html)
- [Linux man-pages: fsync(2)](https://man7.org/linux/man-pages/man2/fsync.2.html)
