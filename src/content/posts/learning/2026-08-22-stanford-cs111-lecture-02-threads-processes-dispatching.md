---
title: "Stanford CS111 Lecture 2：行程與執行緒的執行抽象、狀態與切換"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 3
tldr: "第 2 講先定義行程與執行緒的共享／私有狀態，再用 fork、execvp、waitpid 與 thread creation 說明核心如何建立執行單位。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 2，整理行程、執行緒、system call 與 fork/exec 的執行抽象。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-02-threads-processes-dispatching-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 3 篇，對應 **Stanford CS111, Spring 2026, Lecture 2**。2026-04-01 由 Mendel Rosenblum 主講，官方題目是 [Threads, Processes, and Dispatching](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/2/Lecture2.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Lecture 2 先回答「被 OS 排程與隔離的是什麼」。投影片從 sequential execution 定義 thread，再把 registers、stack、code、variables 與 open files 分成私有或共享狀態，最後用 `fork`／`execvp`／`waitpid` 與 thread creation 串起物件生命週期。

## 從執行單位讀這講

本講刻意還不進入 dispatcher。閱讀順序應是：先區分 program、行程與執行緒，再看 system call 如何請核心建立或替換行程，最後列出新執行緒啟動所需的 program counter、stack 與參數。下一講才有足夠語彙討論 context switch。

## 問題分解先於 threads

投影片先問「電腦科學最根本的概念是什麼」，答案不是某個資料結構，而是 problem decomposition：把難題拆成能分別思考的小問題。並行活動之所以難，是因為多件事可能同時前進；thread 把它拆成數條各自依序執行的控制流。

這個定義有兩個邊界。第一，thread 是在單一 core 上依序執行的一段 code；同一條 thread 裡，instruction 有可推理的先後。第二，整個程式可以由多條 thread 組成，因此「每條依序」不等於「全程只有一件事」。硬體本身會同時做很多工作，卻對每條 thread 輸出 sequential execution 的錯覺；講義把這直接稱為 virtualization 的例子。

## execution state 不只是一組 registers

計算不能在真空裡前進。講義把 execution state 定成任何可能影響 thread、或被 thread 影響的東西，包括 code、data、registers、call stack、open files、network connections，甚至 time of day。這個寬定義很重要：context switch 若只存 registers，並不代表所有可觀察狀態都被複製或隔離。

行程正是用來整理這些狀態的抽象：**一或多條 threads，加上它們的 execution state**。同一行程內，code、variables、open files 與 network connections 等多數狀態共享；registers 與 call stack 則屬於各 thread 私有。時間是由外界共享的輸入，不是任何單一 thread 的私有快照。

多數行程從一條 thread 開始，早期 OS 甚至只允許一條。允許多執行緒行程有兩個理由：利用多核心平行執行，以及讓應用程式能按活動分解結構。代價也從這裡開始：共享 state 讓溝通便宜，卻使正確性依賴 thread 交錯；第四、五講才會正式處理這個問題。

## system call 是跨越權限邊界

建立行程不是一般函式可以自行完成的事，因為新的隔離域、位址空間與核心帳務都由 OS 管理。應用程式必須透過 system call 請 kernel 執行。Lecture 2 用 Linux 的 [`fork`](https://man7.org/linux/man-pages/man2/fork.2.html)、[`execvp`](https://man7.org/linux/man-pages/man3/exec.3.html)、[`waitpid`](https://man7.org/linux/man-pages/man2/wait.2.html) 展示一個完整生命週期。

`fork()` 複製目前行程，parent 收到 child PID，child 收到零，兩者從同一個呼叫返回點繼續。這個看似奇怪的回傳約定，讓同一份 code 能在分支後決定兩邊各自做什麼。它也說明行程建立不只是「開始執行某個函式」：child 一開始帶著 parent 的行程狀態。

`execvp()` 沒有建立第三個行程，而是用新 program 的 code 與 data 覆蓋目前行程。成功後不會回到下一行。`waitpid()` 則讓 parent 等特定 child 結束並取得狀態。三者組合起來，shell 才能先 fork，再於 child 調整 environment 或 file descriptors，例如完成 `ls > ls.out`，最後 exec 真正程式；parent 同時能決定同步等待或繼續接受工作。

## 為什麼先複製再覆蓋

fork/exec 的優點，是在 exec 前保留一段可程式化的設定空間：改環境、重接 standard streams、關閉不該繼承的 descriptors。缺點同樣明顯：若 child 馬上 exec，剛複製的大部分 state 都會丟掉。

講義拿 Windows `CreateProcess` 的多參數介面對照 Linux 的拆分。這不是要判哪個 API 比較漂亮，而是顯示介面如何安放政策：Unix 把建立複本與載入程式拆開，設定動作可以用普通行程操作組合；Windows 把許多建立選項集中在一個呼叫。macOS shell 會使用 `posix_spawn`，Linux 則透過實作技術讓 fork 夠快；因此 API 語意與內部是否真的 eager-copy 不能混為一談。

## thread creation 的最小資訊

行程通常帶著第一條 thread 啟動。再建立 thread 時，kernel 至少要知道起始 program counter、stack region 與初始 stack pointer，通常還要有傳給起始 routine 的參數。Linux、macOS、Windows 的底層呼叫不同，程式語言 library 再把它包成較安全的介面。

C++ 的 `std::thread t(func)` 建立一條與目前控制流並行的新 thread，`t.join()` 等它完成。C 的 `pthread_create`、Go 的 `go func(arg)`、Python 的 `threading.Thread(...).start()` 語法不同，背後都要回答同一組問題：從哪個 instruction 開始、stack 放哪裡、初始參數是什麼、共享哪個行程狀態。

這也是 thread 與行程建立最直接的對比。fork 產生新的行程抽象，state 在語意上被分開；新增 thread 則進入同一行程，共享 variables 與 open resources。前者隔離較強、溝通要跨邊界；後者共享容易、同步責任更大。

## Lecture 2 刻意停在哪裡

本講建立 execution abstractions，尚未完整回答 OS 如何讓「threads 比 cores 多」仍能運作。它只把必要物件準備好：thread 是 sequential execution，行程收納共享與私有 state，system call 讓應用程式請 kernel 建立這些物件。

下一講才把 thread 放上 core，介紹 ready、running、blocked 等狀態、行程控制區塊、dispatcher 與 context switch。這個切法很重要：先知道「被排程的是什麼」，再討論「如何排程」；否則 scheduler 很容易被誤讀成單純挑函式的 queue。

## 用共享狀態表自我檢查

畫兩欄比較新行程與同一行程內的新執行緒：逐項填入 code、variables、registers、stack、open files 是否共享。再解釋 `fork`、`execvp`、`waitpid` 分別改變哪一列；答不出來時，就回到投影片的 execution-state 清單。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 2 slides: Threads, Processes, and Dispatching](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/2/Lecture2.pdf)
- [CS111 Assignment 1: Lambdas, Threads, and Processes](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign1/)
- [Linux `fork(2)` manual page](https://man7.org/linux/man-pages/man2/fork.2.html)
- [Linux `execve(2)` manual page](https://man7.org/linux/man-pages/man2/execve.2.html)
- [Linux `waitpid(2)` manual page](https://man7.org/linux/man-pages/man2/wait.2.html)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
