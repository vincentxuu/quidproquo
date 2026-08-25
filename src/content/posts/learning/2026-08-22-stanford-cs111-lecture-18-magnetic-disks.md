---
title: "Stanford CS111 Lecture 18：磁碟幾何、Interrupt 與 DMA"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 19
tldr: "磁碟把機械式 seek 與 rotation 隱藏成線性 block API；現代 I/O 再用 memory-mapped registers、DMA queues 與 interrupts，讓 CPU 只負責下命令和收完成通知。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 18：HDD 幾何、seek／rotation／transfer、線性 block API、MMIO、polling、interrupt、PIO 與 DMA queue。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-18-magnetic-disks-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 19 篇，對應 **Stanford CS111, Spring 2026, Lecture 18**。2026-05-08 由 Mendel Rosenblum 主講，官方題目是 [Magnetic Disks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)。本文逐頁依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；Canvas／Panopto 錄影不可公開存取，因此不把錄影內容當成已核對來源。

## HDD 是會移動的儲存裝置

硬碟由一到十片 platter 組成，[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)列出的旋轉速度是 5,000–15,000 RPM，常見尺寸為 2.5 與 3.5 吋。actuator 帶動 arm，使 read-write head 沿半徑移動；每個表面由相應磁頭存取。讀一筆資料不是單純查陣列，而是先讓機械部件抵達正確位置。

同一半徑位置形成圓形 track，track 再切成 sector。[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)以 4,096-byte sector、每英吋數十萬到約五十萬 tracks、每 track 數千到數萬 sectors，以及 500 GB 到 30 TB 以上容量建立量級感。它另用「1 TB 約可存五億頁文字」做比喻。這些是 Spring 2026 deck 的示意快照，不是 HDD 標準保證；尤其實體 sector、邏輯 block 與廠商格式不能一概視為 4 KiB。

## 一次讀寫包含三種不同成本

第一步 seek 是移動 actuator，使 head 到目標 track，[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)典型值為 3–10 ms。第二步選擇表面上的磁頭。第三步等待目標 sector 旋轉到 head 下方；若請求位置均勻分布，平均等待半圈，在 7,500 RPM 約 4 ms。第四步才是 sector 經過 head 時的 transfer，deck 列 150–280 MB/s。

[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)把 seek 加 rotational latency 稱為 latency，典型 5–15 ms；transfer time 則隨資料長度變化。這個分解說明順序 I/O 為何重要：連續 sectors 可攤薄 seek 與 rotation，而許多小型隨機請求反覆支付固定機械成本。這講沒有提出磁碟排程演算法，因此不能從標題關鍵字自行補入 SSTF、SCAN 或 C-SCAN。

## 幾奈米的 flying height

磁頭必須非常靠近 platter，卻不能接觸。旋轉碟片拖動空氣形成 air bearing，讓 head「飛」在表面上方；[投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)給的高度約 3–10 nm，並以 80,000–100,000 nm 的人類髮絲作對照。這些仍是 deck 的近似範圍。

灰塵或撞擊可能損傷 head 與表面，舊式裝置尤其可能發生 catastrophic head crash。現代 drive 密封在乾淨 enclosure；關機時通常把 head 移到 platter 外的 parking ramp，較舊設計則在表面設 landing zone。投影片也提到 laptop drive 曾用 accelerometer 在偵測掉落時停放磁頭，現代 HDD 會自動補償 vibration 與 thermal expansion。這段不是旁枝：介面看似穩定，底下卻持續控制奈米尺度的物理誤差。

## 線性 block API 隱藏幾何

現代磁碟對軟體輸出 `0, 1, …, N` 的線性 blocks，介面可概念化為 `read(startSector, sectorCount, physAddr)` 與相應的 `write`。舊式介面曾讓軟體指定 track、surface 與 sector；如今 drive firmware 把幾何藏起來。（[官方投影片](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)）

隱藏是必要的，因為外圈 track 可容納比內圈更多 sectors，而且壞 sector 可由 drive 軟體 remap 到 spare sector。邏輯上相鄰不等於物理位置必然可見，也不保證相同延遲。OS 得到簡單、穩定的 block namespace，交換條件是不能只靠 block number 精確推導內部幾何。

## Memory-mapped I/O 與 device registers

現代 CPU／MMU 把 physical address space 分給 DRAM 與 I/O device。對 DRAM 的 load/store 通常可快取；device 則監聽特定位址上的 uncached load/store。這些位置稱 device registers，OS 透過它們控制裝置，整套方式叫 memory-mapped I/O（MMIO）。

register bits 有三類用途：CPU store 寫入參數，例如第一個 sector；CPU load 讀取 status，例如完成或錯誤；CPU store 寫入 control，例如啟動讀取。它們不像一般記憶體：start bit 可能永遠讀回零，completion bit 也能在 CPU 未寫入時由裝置改變。編譯器、CPU 與 driver 不能把 MMIO 當普通變數任意快取或消除。

## Polling 與 interrupt 的選擇

CPU 寫 registers 啟動 disk read 後，ready bit 先為零，完成時由 device 設成一。最直接的等待方式是 polling：OS 不斷讀 ready。它簡單且反應直接，但在毫秒級磁碟 I/O 期間會浪費大量 CPU cycles。

Interrupt 讓 device 完成後迫使 CPU trap，等待期間 CPU 可以執行別的工作。裝置發出 interrupt，處理器依 trap vector 進核心；OS 辨認來源、service 並 acknowledge，可能接著啟動下一個操作，最後 return from trap，從被中斷處繼續。system call、page fault 與 device interrupt 都利用受控轉移，但觸發來源不同。

投影片指出 interrupts 能讓多個裝置同時忙碌，CPU 也能跑 user code；多核心可分散 interrupts 以平衡負載。CPU 與 device 兩側也都有 interrupt enable/disable flags。這表示 interrupt 不是免費通知：核心仍要處理並避免遺漏事件，只是把漫長的空等改成完成時的離散工作。

## PIO 與 DMA：誰搬資料

Programmed I/O（PIO）讓 CPU 對 device registers 做 load/store，逐步搬資料。它容易理解，卻把昂貴 CPU 執行資源消耗在 byte movement。Direct Memory Access（DMA）則讓 device 直接在裝置與 physical memory 間傳輸；CPU 啟動前把 buffer physical address 寫入 register，之後不必搬每個 byte。

DMA 不代表 CPU 完全退出。OS 仍要配置並固定可供 device 使用的 buffer、準備命令、設定權限與處理完成；device 繞過一般 CPU load/store 路徑，使 DMA 可見性與生命週期成為 driver 必須維護的不變量。本講投影片聚焦資料流，沒有展開 cache coherence 或 IOMMU，因此本文也不把那些細節說成此講 agenda。

## 現代 queue、doorbell 與完成通知

現代介面主要使用 DMA，只保留少量 PIO 作為 doorbell。OS 與 device 在 memory 共享 command queue 與 response queue。以讀 sector 32 為例，OS 先在 command queue 建立「將 sector 32 讀到這個 address」的 command block，再向 uncached doorbell location 寫入通知。

device 以 DMA 讀 command，將 sector bytes DMA 到指定 address，再把 completion response DMA 寫入 response queue，最後對 CPU 發 interrupt。這條路徑把控制面與資料面分開：CPU 建立描述符並敲門，device 搬大量資料，interrupt 宣告有結果可收。

順序也形成 correctness contract。doorbell 前 command 必須完整可見；interrupt 被處理時 response 與資料必須已寫妥；OS 在 device 完成前不能回收 buffer。投影片沒有展開 memory barrier 語法，但流程圖已足以顯示 driver 為何不是單純呼叫 `read`。

## 從磁帶機房到同一套抽象

最後兩頁是 old-style magnetic tape 與 IBM System/360 datacenter 圖像，沒有新增演算法或量化主張。它們把前面的抽象放回歷史：早期軟體更直接面對裝置幾何與機械順序，現代 block API、DMA 與 queue 則把細節逐層移到 controller 與 driver。

整講可以用一條請求檢查：使用者要求某個 block，OS 建 command，MMIO doorbell 通知 device，controller 付出 seek、rotation 與 transfer，DMA 寫入 memory，response queue 記錄完成，再由 interrupt 把控制權交回核心。理解每一步由誰修改哪個狀態，比只背 HDD 數字更接近 driver 的真問題。

## 更新紀錄

- 2026-08-22：依 Lecture 18 官方 PDF 重寫完整磁碟與 I/O device agenda，並限定硬體數字為投影片快照。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 18 slides: Magnetic Disks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)
- [Linux kernel documentation: Dynamic DMA mapping](https://docs.kernel.org/core-api/dma-api-howto.html)
- [OSTEP: Hard Disk Drives](https://pages.cs.wisc.edu/~remzi/OSTEP/file-disks.pdf)
