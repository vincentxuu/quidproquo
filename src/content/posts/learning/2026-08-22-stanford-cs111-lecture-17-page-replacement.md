---
title: "Stanford CS111 Lecture 17：從 page fault 到 Clock，記憶體滿了該換掉誰？"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 18
tldr: "第 17 講把 demand paging 分成 fetching 與 replacement：MIN 無法預知未來，精確 LRU 成本過高，Clock 只靠 reference／dirty bits 找夠舊的 page；active working sets 放不進 RAM 時，1% fault rate 就可能帶來約 1,000 倍 slowdown。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 17：page fault、demand fetching、prefetching、FIFO/MIN/LRU、Clock、global replacement 與 thrashing。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-17-page-replacement-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 18 篇，對應 **Stanford CS111, Spring 2026, Lecture 17**。2026-05-06 由 Mendel Rosenblum 主講，官方題目是 [Demand Paging, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf)。官方 Lecture 16 與 17 PDF 逐位元組相同（SHA-256 均為 `65091d9719674258175c2dcf29e1ad82bca8ff8a82d3b66d73b9e40ad3287d9e`），不是兩份可區分的 decks；本文因此聚焦後半的 replacement policy，Lecture 16 則以 fault/fetching mechanism 為主。Canvas／Panopto 錄影沒有公開，無法判定兩天實際口述分界。

Lecture 16 建立 demand paging 的承諾：程式不必把全部 code 與 data 同時放進 physical memory，也能執行。Lecture 17 接著問兩題：什麼時候把 page 搬進來？RAM 已滿時又要換掉哪一頁？前者是 **page fetching policy**，後者是 **page replacement policy**。Page fault、present bit 與 restartable instruction 是機制；FIFO、LRU、Clock 與 global replacement 則是政策。

## 本講完整 agenda

公開投影片依序涵蓋：demand paging 與 locality 回顧；DRAM、SSD、disk 的取捨；page fault handler 與 x86-64 `CR2`；可重新啟動的指令；fetching 和 replacement 兩項政策；demand fetching 的 page 來源；prefetching；Random、FIFO、MIN、LRU；12 次 page reference trace；精確 LRU 為何不實際；reference／dirty bits；Clock／second chance；clock hand speed；global 與 per-process replacement；thrashing 的量化例子；最後是停止部分 processes 或控制可同時執行的 working sets。

這講沒有介紹磁碟幾何、檔案系統或 flash translation layer。Disk／SSD latency 只是要表達 page fault 與 DRAM access 的成本差距；下一講才進入 magnetic disks。

## Demand paging 靠 locality 讓「不全部載入」可行

Demand paging 讓程式在只有部分資訊位於 physical memory 時執行。正在使用的 pages 留在 page frames，暫時閒置的 pages 放在 paging file，也就是 backing store／swap space，需要時再往返搬移。它不是憑空創造容量，而是用較慢 storage 承接 RAM 放不下的內容。

前提是 **locality of reference**：大多數程式在一段時間內只密集使用 code 與 data 的一小部分。這批近期活躍 pages 是 working set。若 working set 放得進 RAM，多數 references 會命中 resident pages；若每一步都跳到不在記憶體的新 page，執行就會變成不斷等待 I/O。

[官方 Lecture 17 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf)用量級建立直覺：DRAM 約比 disk 快 `100,000×`、比 SSD 快 `1,000×`，而 disk／SSD 每容量成本可能約低 `100×`。這些是課堂近似，不是所有裝置的固定規格。真正的目標是容量與價格接近 backing store，常見存取卻接近 DRAM；locality 只能讓 common path 靠近它，不能消除 miss 成本。

## Page fault 是受控補頁，不一定是程式錯誤

Backing store 中 page 的 page-table entry 會把 present bit 清成 0。CPU 參考該 virtual page 時，MMU 無法完成一般 translation，於是 trap 進 OS。Handler 先確認 address 是否屬於合法 virtual region：若 address 無效，才是程式錯誤；若 page 合法、只是目前不在 RAM，就是正常補頁。

合法 fault 的流程是找到 free frame、從來源讀入 page、更新 PTE 的 frame number 與 present bit，最後恢復原 thread。恢復的意思是重試原 instruction，不是跳過 faulting access。原本的 load、store 或 instruction fetch 必須在 page 就緒後重新執行。

x86-64 會把 faulting linear address 放進 privileged register `CR2`。[Intel architecture manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)也把 `CR2` 與 page-fault error code 列為 handler 的輸入。投影片寫「latch faulting address on a page table」容易誤讀；保存的是 faulting address，page table 仍是 translation metadata。

## 可重啟指令是透明 page-in 的前提

Page-in 後必須重試原 instruction，因此硬體還要保證 restartable semantics。投影片以 push-like 操作說明：若 stack pointer 已更新、memory write 才 fault，直接重跑可能減兩次。Architecture 必須讓 fault 看起來沒有留下半套 visible state，kernel 才能安全 resume。

核心能管理 I/O、PTE 與排程，卻不能猜一條 instruction 已完成哪個 micro-step。architecture 必須定義安全的 fault boundary；present bit 因而也參與 CPU、MMU 與 kernel 之間的 exception contract。

## Fetch policy：等 fault 才讀，還是先預取？

**Demand fetching** 直到 reference fault 才搬入 page。Code／initialized data 可從 executable 讀；新 stack／heap page 可先 zero-fill，修改後若換出才需要 backing store；先前寫回的 anonymous data 從 swap 讀回。它不替未使用 pages 付 I/O，但第一次 reference 必須等待，OS 也要記住每頁真正來源。

**Prefetching** 則預測未來。投影片的做法，是處理一次 fault 時順便讀相鄰幾頁；順序存取很快會用到它們，連續 I/O 也可能較便宜。若 access pattern 跳躍，預取只會浪費 bandwidth、佔 frame，甚至提早擠掉 active page。

[同一份官方 PDF 的 prefetch 表](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf)列出的量級是 disk fault 5–10 ms、SSD fault 50–100 µs、DRAM 50–100 ns；相鄰預取可便宜許多。數字會變，判準不變：避免的 stall 必須大於多讀、污染與 replacement cost。

## Replacement policy：RAM 滿時每次 fault 都要犧牲一頁

Free list 尚有 frame 時可直接配置；physical memory 填滿後，每載入一頁都要挑 victim：

- **Random** 隨機挑 page，accounting overhead 低，表現可能比直覺好。
- **FIFO** 換掉進入 RAM 最久的 page。Queue 容易維護，但 residence age 不等於下一刻是否仍使用。
- **MIN／optimal** 換掉未來最晚才會再次使用，或不再使用的 page。它是理論 baseline，真實 OS 無法預知完整未來。
- **LRU** 換掉最久未被 reference 的 page，以過去預測未來；temporal locality 成立時可近似 MIN。

評估不能只看名稱，還要算 fault count、每次 reference 的 metadata 成本、replacement 掃描量，以及 dirty victim 是否必須先寫回。少一次 fault 很有價值，但若為精確排名而讓每次 load/store 都增加昂貴工作，也會得不償失。

## 同一條 reference string，三種政策給出不同答案

[官方 Lecture 17 PDF 的 replacement trace](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf)使用四個 frames 與：

```text
A B C D A B E A B C D E
```

前四次裝入 A、B、C、D，都 fault；接著 A、B hit。第七次 E 到來時政策開始分歧。FIFO 依 arrival order 淘汰 A，整串共 **10 faults**。MIN 知道未來，E 到來時可淘汰最晚再用的 D，只有 **6 faults**。LRU 以近期歷史近似，先淘汰 C，得到 **8 faults**。

這不證明 LRU 永遠介於兩者。範例固定 frame 數與 reference string，只讓資訊差異可見：FIFO 看 arrival history，LRU 看 access history，MIN 看 future。另一條 string 可能改變 Random／FIFO／LRU 排名；MIN 仍是離線 optimal baseline，而不是部署方案。

## 精確 LRU 很吸引人，成本卻太高

精確 LRU 若替每個 page 加 timestamp、每次 access 寫 clock、replacement 再掃全部 timestamps，fast path 與 fault path 都太貴。

MIN 無法實作，LRU 本來就是用歷史近似未來；若為 exact LRU 付出不成比例的成本，並沒有讓最終預測變成確定。系統只需找一頁「夠久沒用」，不必證明它是全機最老。

## Reference 與 dirty bits 提供低成本訊號

Page-table entry 常帶兩個狀態。**Referenced bit**（x86 稱 Accessed）在 page 被讀或寫時設成 1，表示自 OS 上次清除後使用過；**dirty bit** 在 page 被修改時設成 1，表示 memory copy 與 disk／executable source 不再相同。CPU／MMU 可在 translation 時更新。

Reference 是 recency 的粗略 evidence；dirty 決定 eviction cost。Clean code page 若能從 executable 重建，可以直接丟棄；dirty anonymous page 若沒有其他最新 copy，必須先寫 backing store，否則 replacement 會遺失狀態。

部分 architecture 以 protection fault 模擬 bits：首次 access 或 write trap 後由 OS 記錄並放寬權限。少一點 hardware state，代價是更多 kernel traps。

## Clock：不用找最老，只找沒通過第二次檢查的 page

Clock，也叫 second chance，把 physical pages 排成環並維護一支 hand。只有 page fault 需要 frame、free list 又空時，hand 才前進。

若當前 page 的 reference bit 是 1，OS 把它清成 0，給第二次機會並繼續走。若 page 在 hand 再次繞回前被 reference，hardware 又把 bit 設回 1，它會再次被略過。若 bit 已是 0，表示自上次檢查以來沒有使用 evidence，因此可當 victim。

Dirty victim 不能像 clean page 一樣立刻忘掉。投影片描述清 dirty state 並開始寫回 disk；實作必須確保 I/O 完成前資料與 frame 不被不安全地重用，也可繼續找 clean victim。Deck 沒規定 queue、同步或 writeback daemon，因此本文不補一個特定 kernel 實作。

Clock 不會輸出 exact recency order，只區分「最近一輪用過」與「沒觀察到使用」，成本卻遠低於 per-access timestamp。這正是 lecture 的政策結論：便宜且與 locality 相關的訊號，往往比完美資訊更適合 fast path。

## Clock-hand speed 也是壓力訊號

Clock hand 只由 replacement demand 推動，而不是依 wall time 自動前進。慢表示 faults 少、working sets 大致放得下；快速繞圈表示系統不斷需要 frames。

速度本身不是判決：一次大型掃描也會暫時加速 hand。它仍要與 fault rate、I/O queue、CPU utilization 與 dirty-page rate 一起看。

## Global 與 per-process replacement 決定誰能影響誰

**Global replacement** 把所有 resident pages 放進共同候選池；任一 process fault 都可能淘汰另一個 process 的 page。它可動態把 frames 移給目前需求大的 workload，但 performance isolation 差，一個 memory-hungry process 可能提高其他工作的 fault rate。

**Per-process replacement** 只允許 process 淘汰自己的 frames，消除直接干擾。新問題是每個 process 應分多少 frames：固定平均可能浪費，依 working set 動態調整又需要估計。投影片以「多數 systems 使用 global replacement」收束；這是本講概括，不是所有 kernel、cgroup 與年代的普遍定律。

Global pool 容易借出 idle frames，卻耦合 workloads；local pool 邊界清楚，卻可能讓配額閒置。這是 utilization 與 isolation 的取捨。

## Thrashing：1% memory-reference page-fault rate 也可能慢約 1,000 倍

當 runnable threads 的 active pages 合計超過 physical memory，replacement 會淘汰仍在 working set 的 page。被換掉的 page 很快又被 reference，再 fault、再淘汰另一個 active page。Machine 大部分時間都在讀寫 backing store，真正 computation 幾乎沒有進展；這就是 **thrashing**。

[官方 Lecture 17 PDF 的 thrashing 範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf)使用 DRAM 100 ns、disk 10 ms 建立例子。它假設每 100 次 memory references 有一次 page fault，也就是 1% reference fault rate：

```text
0.99 × 100 ns + 0.01 × 10,000,000 ns
= 100,099 ns
```

相較 100 ns，約慢 **1,001×**。投影片算式印成 `.99 × 100 + .1 × 10,000,000`，但「1 in every 100」前提與 `100,099 ns` 結果都對應 `.01`；本文採一致的 1%。模型忽略 overlap、queueing 與現代 storage 差異，仍展示關鍵：slow path 貴多個數量級時，很低的 miss rate 就能主宰總時間。

Thrashing 還會形成回饋：faulting thread 等 I/O 時切到另一個 process，又載入另一批 pages。增加 multiprogramming 反而讓 throughput 下跌。

## 處理 thrashing 要控制同時活躍的 working sets

Replacement algorithm 無法產生 frames。若 active working sets 總和確實超過 RAM，再聰明的 victim selection 也只能決定誰承擔下一個 fault。投影片的解法，是暫停部分 processes，讓 scheduler 只同時執行能一起放進 memory 的 jobs。

這是降低 multiprogramming degree：先讓較少 working sets 留在 RAM 並向前推進，完成或壓力下降後再恢復其他工作。Personal computer 上，使用者也能關閉 applications；投影片最後以配置足夠 RAM 作務實結論。

Lecture 17 因此畫出 demand paging 的界線。Mechanism 能安全 trap、補入並 restart；policy 能用 locality 選 fetch timing 與 victim；Clock 能用便宜訊號近似 LRU。但 demand 超過 capacity 時，問題已不是換一個 queue discipline，而是 admission／scheduling 與資源總量。

## 這講之後應該能做的推理

看到 fault，分別回答 address／來源／restart、是否 prefetch、free frame／victim pool／dirty cost。面對 reference string，固定 frame 數，逐步更新 resident set 再算 faults；面對真實 slowdown，先問 working set 是否放得下。若 hand 高速旋轉且 fault I/O 壓滿，微調 victim order 可能救不了 thrashing。

## 更新紀錄

- 2026-08-22：依官方 19 頁 PDF 重寫全文，補齊 fetching／replacement、Clock、global policy 與 thrashing 的完整議程。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 17 slides: Demand Paging, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf)
- [Operating Systems: Principles and Practice, Chapter 9](https://ospp.cs.washington.edu/)
- [OSTEP: Beyond Physical Memory — Mechanisms](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf)
- [OSTEP: Beyond Physical Memory — Policies](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf)
- [Intel 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
