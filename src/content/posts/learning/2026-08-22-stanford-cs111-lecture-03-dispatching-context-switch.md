---
title: "Stanford CS111 Lecture 3：核心執行緒、使用者執行緒、context switch 與 dispatcher"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 4
tldr: "第 3 講沿 running、blocked、ready 狀態轉移，拆解 PCB、context save/restore 與 dispatcher 如何完成一次 CPU 控制權交接。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 3，以一次 CPU handoff 串起執行緒狀態、PCB、context switch 與 dispatcher。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-03-dispatching-context-switch-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 4 篇，對應 **Stanford CS111, Spring 2026, Lecture 3**。2026-04-03 由 Mendel Rosenblum 主講，官方題目是 [Threads, Processes, and Dispatching, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Lecture 3 接手上一講留下的問題：threads 多於 cores 時，核心如何讓每條執行緒看似持續前進？答案不是單一 scheduler 函式，而是一個由狀態轉移、PCB、context save／restore 與 dispatcher 組成的閉環。

## 用一次 CPU 交接讀完整講

本文沿一條執行緒從 running 進入 blocked、另一條從 ready 被選上、之後原執行緒再回到 ready 的路徑閱讀投影片。每一步都問兩件事：誰讓 kernel 重新取得 core，以及下一次恢復時哪些 execution state 必須仍然正確。

## dispatching 的實際閉環

本講先複習 thread 是最小執行單位，process 則是一或多條 thread 加上 execution state。建立 thread 要有起始 program counter、stack 與參數；接著問題改成：建立好的 thread 怎麼真的跑上 core？

CPU、processor、core 與 hardware thread 是不同硬體年代留下的用語。穩定的抽象是每個 execution context 同一時刻承載一條 software thread。OS 通常管理遠多於 cores 的 threads；多數會 blocked 等事件，ready threads 則必須最終取得機會，且不能破壞別人或 kernel。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf)）

dispatching 是把 thread 放上 core 的機制，fairness、priority 與下一個選誰是 scheduling policy。本講只用 FIFO ready queue 示範最小選擇，完整政策留到 Lecture 8。

## PCB 與 thread states

Process Control Block 保存每條 thread 的 registers、排程資訊、process memory、open files 與 accounting。它讓不在 core 上的 thread 仍有可恢復表示。

狀態圖分 ready、running、blocked 與 exit。ready 是能跑但等 core；blocked 是等事件。事件完成後只會回 ready，不保證立刻 running。這個區別也是後續 I/O 與 condition variable 的基礎。

## context switch 保存與恢復

每個 core 的 dispatcher loop 讓 thread 跑一段時間，保存它，再載入另一條。投影片逐格畫出 A3 切到 B1：先把硬體 registers 存進 A3 stack，以 stack pointer 找到 saved frame；再換成 B1 的 SP、恢復 registers，最後從 B1 保存的 return address 繼續。

新 thread 也重用同一條路。kernel 預先構造一份「彷彿曾被切出」的 stack 與 PCB，把 return address 指向第一個 instruction；第一次 restore/return 就能啟動，不需要 dispatcher 的特殊分支。

## kernel 如何重新取得 core

若只請 process 主動 yield，就是 cooperative multitasking；壞程式可以永遠霸占機器。system call、illegal instruction、segmentation fault、page fault 等 traps，以及鍵盤或磁碟完成等 interrupts，都會進入 kernel。

compute-bound thread 可能沒有 system call 或裝置事件，所以 OS 設定 periodic timer interrupt，強制取得控制並決定是否 preempt。至此閉環才完整：PCB 保存狀態，states 表達 eligibility，context switch 做切換，trap／interrupt／timer 交還控制，ready queue 提供下一條 thread。

本講尚未比較排程政策，也未解決共享變數的交錯；後者就是 Lecture 4 的 concurrency 問題。

## 用一次阻塞走完整張狀態圖

假設 A 正在 core 上讀檔，B 已在 ready queue。A 呼叫 `read` 形成 trap，kernel 發現資料尚未到達，便把 A 從 running 轉成 blocked。dispatcher 保存 A 的 registers 與 SP，再從 ready queue 取出 B，載入 B 的 SP 與 registers。磁碟稍後完成傳輸並送出 interrupt；handler 不會直接把 A 塞回 core，而是把 A 從 blocked 移到 ready。B 繼續到 timer interrupt 或自己阻塞，scheduler 才可能選 A。

這個例子分清三件常被混在一起的事：unblock 只改 eligibility，dispatch 才真的占用 core，schedule 則決定 ready threads 中選誰。若機器有多個 cores，另一個 dispatcher 可能立刻取得 A；在單 core 圖裡則必須等目前 thread 退出 running。

PCB 也不只是 registers 的袋子。saved thread state 讓 instruction stream 可恢復；scheduling fields 讓 ready queue 或 priority policy 找得到它；memory metadata 決定重新執行後看到哪個 address space；open-file state 讓 `read` 完成後仍對應同一個 kernel object；accounting 則支援資源限制與觀察。不同 OS 的欄位會不同，PDF 支持的是責任分類，不是一份通用 C struct。

trap 與 interrupt 的差異在來源與同步性。trap 由目前 instruction 觸發，system call 是刻意 trap，illegal instruction 與 page fault 則是執行條件造成；device interrupt 從外部硬體非同步抵達。兩者都能進 kernel，但只有 timer 提供「即使 user code 不合作，也會在有限時間內取回控制」的保證。

preemption 仍不是零成本。每次切換要保存與恢復 state，切到不同 process 還可能擾動 cache 與位址轉譯；timer 太密會浪費工作，太疏則讓互動延遲變差。本講沒有指定 timer interval，也沒有比較 priority 或 multiple queues，因此不能從這份 PDF 推出通用 quantum。它只建立 FIFO ready queue 作為可工作的基線。

最後，context switch 圖的關鍵不是逐個 register 背順序，而是 SP 的角色：大多數 registers 先壓進目前 stack，保存 SP 就能找到整個 frame；切換到另一個 SP 後，restore 操作自然改在另一條 thread 的 stack 上。這正是新 thread 可以靠偽造初始 frame 啟動的理由。

## 手動走一次 dispatcher

替 A、B 兩條執行緒各畫 running、ready、blocked 三格，從 A 發出阻塞式 I/O 開始，逐步標出 PCB 更新、SP 切換、B 恢復，以及 I/O 完成後 A 回到 ready queue。任何一步若不知道由事件還是 dispatcher 觸發，就回看對應狀態箭頭。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 3 slides: Threads, Processes, and Dispatching, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf)
- [CS111 Assignment 3: Thread Dispatcher](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign3/)
- [Linux `clone(2)` manual page](https://man7.org/linux/man-pages/man2/clone.2.html)
- [Linux `sched(7)` manual page](https://man7.org/linux/man-pages/man7/sched.7.html)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
