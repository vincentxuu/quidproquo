---
title: "Stanford CS111 Lecture 28：用四個觀念串起並行、記憶體與儲存"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 29
tldr: "第 28 講把整學期收斂成並行、記憶體、儲存三條主線，再用 virtualization、atomicity、locality、layering 四個觀念解釋作業系統如何管理共享資源。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 28：從 processes、paging、file systems 回顧整門課，整理 virtualization、atomicity、locality 與 layering。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-28-course-review-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 29 篇，對應 **Stanford CS111, Spring 2026, Lecture 28**。2026-06-03 由 Mendel Rosenblum 主講，官方題目是 [Course Review](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/28/Lecture28.pdf)。本文依 10 頁公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)逐頁整理；錄影位於 Canvas／Panopto 後方，不算已讀來源。

素材稽核沒有發現重複講義：Lecture 28 的檔案雜湊、頁數與標題均不同於 Lecture 26、27。這份期末回顧也不是把章節名稱再念一次。第 2–7 頁先沿著 concurrency、memory、storage 三條主線盤點機制，第 8 頁再抽出 virtualization、atomicity、locality、layering 四個跨章節觀念。真正要帶走的是後者如何反覆出現在前者。

## 第一條主線：並行不是「同時跑」而已

第 2–3 頁把 concurrency management 拆成 processes and threads、synchronization、CPU scheduling、deadlock。process 與 thread 提供可獨立 dispatch 的執行單位；一旦多個執行單位共享狀態，race condition 就會讓結果依賴不可預測的 interleaving。lock、condition variable、monitor 與底層 atomic instruction，是用來限制哪些 interleaving 可以被看見。

CPU scheduling 問的是另一件事：多個 runnable thread 都合法時，現在該讓誰執行。time slice、round robin 與 priority 是政策選擇，不是同步正確性的替代品。一個排程器可以很公平，程式仍然有 race；程式也可以完全沒有 data race，卻因排程政策而延遲很久。

deadlock 則提醒我們，個別操作都有鎖不代表整體會前進。投影片列出的條件是 limited access、no preemption、multiple independent requests、circular wait；形成循環後，每個參與者都在等別人釋放資源。detection 是接受它可能發生後再找環；prevention 則先破壞必要條件。這堂回顧把兩者並列，是要區分「找出壞狀態」與「讓壞狀態不可達」。

## 第二條主線：記憶體管理把位址變成可控制的抽象

第 4 頁回顧 linking 與 dynamic allocation。static／dynamic linking 決定符號何時綁到程式碼；stack 與 heap 提供不同生命週期的儲存。dangling pointer 是物件已失效，指標仍被使用；memory leak 是物件已不可達，配置卻沒有回收。兩者方向相反，卻都源自「名稱的生命週期」與「儲存的生命週期」沒有對齊。

同一頁由 static relocation 走向 dynamic relocation，再列出 base-and-bound、segmentation、paging。共同問題是：程式使用的位址如何映射到實體記憶體，同時維持隔離與可搬移性。分段以可變大小區域貼近程式結構，paging 以固定大小 page 簡化配置；兩者付出的 fragmentation 形態與查找成本不同。

第 5 頁進入期中考範圍之後的細節：x86-64 page tables、TLB、OS address spaces、fragmentation、demand paging 與 thrashing。TLB 用 locality 快取近期 translation；page fault 讓尚未在記憶體的頁面按需載入。prefetching 提前猜測未來，replacement policy 則在容量滿時選 victim。

投影片一次列出 Random、FIFO、MIN、LRU、Clock，以及 global／local replacement。MIN 需要知道未來，因此是理想比較基準；LRU 用過去近似未來；Clock 再用較便宜的 reference bit 近似 LRU。global policy 可跨 process 取頁，local policy 把影響限制在個別 process。當 working sets 合計超過可用記憶體，系統可能把時間花在換頁而不是做工作，這就是 thrashing。

## 第三條主線：儲存把持久性、命名與硬體成本綁在一起

第 6 頁從磁碟 mechanism 開始：operations、interrupts、programmed I/O、DMA 描述 CPU 與裝置如何交換資料。往上一層，file 提供 sequential、random、keyed access；inode 保存檔案 metadata 與區塊索引。contiguous、linked、multilevel index、FAT、Unix inode 等 layout，是在隨機存取、成長彈性、索引空間與失敗影響之間取捨。

block size 也沒有單一正解。較大的 block 可降低索引與 I/O 次數，卻可能增加內部 fragmentation；較小的 block 節省尾端浪費，metadata 與定位成本則更高。free-space management 同樣以 linked list 或 bitmap 等結構，在查找、更新與空間開銷之間選擇。

第 7 頁把這些結構接到效能與復原。buffer cache 透過 delayed writes 合併與重排 I/O；disk scheduling 用 FIFO、shortest positioning time first、CSCAN 決定請求順序。directory 是 naming layer，hard link 讓多個名稱指向同一 inode，symbolic link 則把路徑存成另一層解析。

crash recovery 的三個答案是 `fsck`、ordered writes、write-ahead logging：崩潰後全域掃描、事前限制寫入順序、先記錄可 replay 的意圖。最後的 flash memory 與 FTL 再顯示 layering：上層仍看見區塊介面，底層卻要處理 erase-before-write、wear leveling 與 logical-to-physical mapping。

## 四個跨章節觀念，才是整門課的索引

第 8 頁把大量名詞收斂成四個觀念。

第一是 **virtualization**：讓一個東西看起來像另一個，或讓單一資源看起來有許多份。thread 虛擬化 CPU 的執行機會，file 把儲存裝置變成具名 byte sequence，address space 讓每個 process 像是擁有自己的記憶體。虛擬化不是「假裝資源無限」，而是透過 mapping、protection 與 multiplexing 提供穩定介面。

第二是 **atomicity**：多個步驟對外看起來像不可分割的一步。lock 保護的 critical section 與 journal transaction 表面上分屬並行與檔案系統，底層問題卻相同：觀察者能否看見一半完成的狀態。硬體 atomic instruction、鎖定規約、write-ahead ordering 是不同層次的答案。

第三是 **locality**：近期過去常能預測近期未來。scheduler、TLB、page replacement、buffer cache 都利用 temporal 或 spatial locality，把昂貴資源留給可能再被使用的項目。locality 是經驗規律，不是正確性保證；工作負載改變時，快取與預取也可能失準。

第四是 **layering**：用較高階抽象遮住較低階細節。thread 不必直接操作每次 context switch，file caller 不必安排磁頭或 flash erase block，virtual-memory user 不必手算每次實體配置。layering 的價值是把困難問題集中解決；代價是跨層互動仍可能漏出，例如 `fsync`、page fault 與 DMA 都提醒上層「底下不是免費的」。

## 怎麼用這份回顧自我測驗

不要照投影片順序背清單。挑一個機制，例如 TLB、condition variable 或 journal，畫四欄：它虛擬化什麼、需要哪個 atomic boundary、利用哪種 locality、位於哪些 layer 之間。某一欄若寫不出來，不一定表示機制沒有該性質；先回到原講次確認，不要硬湊。

再做一次 failure test：拿掉該機制，問外界會看到效能下降、錯誤結果、隔離破壞，還是資料遺失。這能把「為什麼存在」與「如何實作」分開，也能辨認 policy change 與 interface break 的差異。

## 接下來的課，不是難度排行榜

[第 9 頁](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/28/Lecture28.pdf)列出 CS112、CS140E、CS240、CS143、CS145、CS144、CS244C。投影片把它們分別指向 kernel implementation、OS design、advanced OS、compilers、databases、networking 與 distributed systems。這是一張方向圖，不是修課先後保證；課號、名稱與開課狀態會變，實際選課仍應查當期 Stanford 課程資訊。

若這門課最吸引你的是「抽象如何落到核心」，往 kernel implementation 走。若是 translation 與 runtime，compilers 會延續 linking、address space 與 control transfer。若是持久狀態和 transaction，databases 會把一致性問題推得更深。若是跨機器的部分失敗，networking 與 distributed systems 會把本課單機假設逐一拿掉。

## 逐頁核對清單

- 第 1–2 頁：課程回顧與 concurrency／memory／storage 三大主題。
- 第 3 頁：process、thread、dispatch、synchronization、scheduling、deadlock。
- 第 4–5 頁：linking、allocation、relocation、segmentation、paging、TLB、demand paging、replacement、thrashing。
- 第 6–7 頁：disk I/O、file access、inode、block layout、free space、cache、scheduling、links、crash recovery、FTL。
- 第 8 頁：virtualization、concurrency、atomicity、locality、layering。
- 第 9–10 頁：後續課程方向與結語。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 28 slides: Course Review](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/28/Lecture28.pdf)
