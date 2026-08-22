---
title: "Stanford CS111 Lecture 6：關中斷、原子指令、spinlock 與阻塞式 lock 的實作"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 7
tldr: "第 6 講從單核心關中斷一路修到多核心 v5，追蹤 guard、lock 與 wait queue，說明 atomic exchange、spin、block 與 wakeup 如何避免 race 和 lost wakeup。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 6，逐版拆解 interrupt masking、atomic exchange、spinlock 與阻塞式 lock。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 7 篇，對應 **Stanford CS111, Spring 2026, Lecture 6**。2026-04-10 由 Mendel Rosenblum 主講，官方題目是 [Implementing Locks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/6/Lecture6.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Lecture 6 不再把 lock 當成黑盒子。16 頁投影片先用單核心關中斷建立最小版本，再在多核心環境逐版加入 atomic exchange、spin、block 與 wakeup；每一次修改都修掉一個具體 race，也可能製造下一個。

## 逐版追蹤 lock 的不變量

閱讀 v1 到 v5 時，只追三個狀態：guard 是否被持有、lock 本身是否可用、等待者是否已進 queue。真正的難點是「檢查失敗」與「睡眠」之間不能遺失 wakeup；因此後文依版本前進，而不是先套一組通用的機制／政策模板。


## 單核心：關中斷把排程點暫時拿掉

投影片先限定單核心：執行緒只會因 trap 或 interrupt 被切換。核心在檢查 `locked`、修改等待佇列之前關中斷，就能讓這段狀態轉移不可被另一個執行緒插入；完成後再開中斷。這不是給應用程式任意使用的 lock 實作，而是核心利用特權機制建立短暫 critical section。

等待路徑最容易出現 lost wakeup。若執行緒先加入 queue、開中斷，之後才呼叫 `blockThread`，另一個核心工作可能在兩步之間 `unlock` 並喚醒它；等原執行緒接著睡下，就再也沒有人喚醒。因此「加入等待佇列並進入 blocked 狀態」必須對 unlock 看起來是一個原子轉移。

## 多核心：atomic exchange 只解決最內層互斥

多核心即使關掉本核心中斷，其他核心仍會執行。投影片因此使用 atomic `exchange(true)`：它在同一個不可分割的 read-modify-write 中回傳舊值並寫入新值。若舊值為 false，執行緒取得 spinlock；若為 true，就持續重試。投影片也展示 x86 `xchg` 產生的 busy-wait loop。

第一版直接把 spinlock 當應用層 lock，競爭時會一直耗 CPU。第二版加入等待 queue，卻沒有保護 queue 自己。第三版以短 spinlock 保護 `locked` 與 queue，再讓長時間等待者阻塞。Busy waiting 在多核心取得最內層 guard 時難以完全避免，重點是把持有時間縮到只涵蓋少量 bookkeeping，不把整個使用者 critical section 包進去。

## v3 到 v5：真正難的是 block 與 wakeup 的交界

v3 仍在釋放 spinlock 與 `blockThread()` 之間留下 race。v4 改變 dispatcher 介面：先把 current thread 標成 `BLOCKED`，釋放 spinlock，再 `redispatch()`。如此 unlock 即使在其間執行，也能看見一致的 thread state。不過投影片接著追問：若就在更新狀態後收到 interrupt 呢？同一執行緒可能被 dispatcher 以不合預期的狀態處理。

v5 的組合答案是：本核心先關中斷，再取得跨核心 spinlock；完成 queue 與 thread-state 轉移、釋放 spinlock並完成 redispatch 後才恢復中斷。兩種機制各守一個威脅模型：interrupt masking 防止本核心被切走，atomic exchange 防止其他核心同時修改。`unlock` 同樣在短暫保護下選擇清除 `locked`，或從 queue 取出一個 waiter 並 unblock。

這個分工也可由 [Linux kernel 的 spinlock 說明](https://docs.kernel.org/locking/spinlocks.html)交叉檢查：關中斷只作用於本核心，跨核心互斥仍由 spinlock 保證；若中斷處理器也會碰同一把 lock，忽略本地中斷還可能讓持有者被同核心中斷卡住而自我死鎖。這是實務文件對投影片「兩種機制各處理不同競爭來源」的具體對照，不是把 Linux API 當成課堂偽碼。

這五版的閱讀方法不是背最終程式碼，而是逐版指定 linearization point：哪一瞬間算取得 lock、哪一瞬間算成為 waiter、unlock 何時把 ownership 交給被喚醒者。只要其中一項沒有單一可辨識的狀態轉移，就應主動找「已入 queue 但尚未睡」或「已被喚醒但狀態仍 blocked」的交錯。

[Linux generic mutex 設計文件](https://docs.kernel.org/locking/mutex-design.html)提供另一個主題直接相關的實作對照：未競爭時以原子操作走 fast path，短暫等待可走 optimistic-spinning midpath，仍拿不到時才把 task 放進 wait queue 睡眠。它同時明列 mutex 的 owner 與 waiter queue 由原子狀態及短 spinlock 協調。這支持本講把「短時間自旋保護 bookkeeping、長時間競爭者阻塞」視為分層策略；文章仍以 Stanford v1–v5 為主，不把 Linux 的三路徑設計倒灌成投影片內容。

## 公開材料範圍與短篇理由

公開 PDF 只有 16 頁，扣除標題、閱讀提示與 announcements，主體集中在單核心版本及多核心 v1–v5 的逐格修正；多頁重複同一份程式碼，只標出下一個 race。本篇逐一覆蓋這些版本與兩個核心問題，不混入其他學期的 condition-variable 或記憶體模型內容，因此以短篇收束。

可以用「故障注入」重讀本講：在每個狀態轉換後假設執行緒被切走、行程崩潰或機器斷電，記下外界可能看到什麼。這不是說官方作業一定要求每一種測試，而是把投影片的設計圖轉成可操作的驗證方法。

另一個延伸是畫出機制／政策表。左欄只寫核心提供的能力，右欄寫選擇順序或資源分配的規則。若某一項放不下，通常表示兩個概念還混在一起。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 6 slides: Implementing Locks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/6/Lecture6.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Linux kernel documentation: Locking lessons](https://docs.kernel.org/locking/spinlocks.html)
- [Linux kernel documentation: Generic Mutex Subsystem](https://docs.kernel.org/locking/mutex-design.html)
