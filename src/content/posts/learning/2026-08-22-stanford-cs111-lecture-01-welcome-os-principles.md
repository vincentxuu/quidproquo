---
title: "Stanford CS111 Lecture 1：作業系統的歷史、抽象化與三條課程主線"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 2
tldr: "第 1 講沿 1940 年代共用 I/O 卡片、batch processing、multiprogramming 與個人電腦的演變，解釋 OS 的功能如何隨硬體成本與使用者需求逐層增加。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 1，從作業系統歷史讀懂抽象化、保護、資源共享與課程三條主線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-01-welcome-os-principles-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 2 篇，對應 **Stanford CS111, Spring 2026, Lecture 1**。2026-03-30 由 Mendel Rosenblum 主講，官方題目是 [Welcome to CS111!](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Lecture 1 不是先背一份 OS 定義，而是沿著硬體成本與使用方式的變化，回答作業系統為何一層層長出來。從共用 I/O 卡片、batch monitor、multiprogramming 到個人電腦，投影片把每次新增的抽象連回當時的瓶頸。

## 本講的歷史閱讀法

閱讀時抓住兩條線：硬體昂貴時，OS 優先提高機器利用率；硬體普及後，重心轉向便利、安全與跨應用共享。後文依投影片年代前進，再用課程三部分與評分方式說明這段歷史如何變成 CS111 的學習地圖。

## 從 1940 年代的共用卡片開始

講義沒有先給作業系統一個封閉定義，因為這個領域不是從定義演繹出來的。1940 年代的電腦一次只服務一個人，使用者直接坐在控制台前；最早被稱作「作業系統」的東西，只是把讀寫裝置等常用操作收成大家共用的卡片。它已經有兩個往後不斷重現的理由：方便，以及不要重複浪費昂貴資源。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)）

到了批次處理，使用者交出一疊 punched cards，batch monitor 依序載入工作，程式出錯時印出記憶體內容，也就是 `core dump` 這個名稱的歷史背景。人不用一直守著機器，機器利用率提高；代價是除錯迴圈變長，而且一個工作等待 I/O 時，整台昂貴電腦仍然閒著。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)）

這段歷史把第一個設計目標說得很準：**硬體昂貴、人力便宜時，系統優先讓機器不要停。** 1960 年代的 data channel 與 interrupt 讓 I/O 和計算可以重疊，OS 開始需要 buffer 與 interrupt handler，也第一次被迫處理「很多事情同時發生」。並行不是後來硬塞進課綱的主題，而是提高利用率後立刻出現的管理問題。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)）

## 從保護機制長出 kernel

simple batch monitor 還有三個明顯問題：一次只能跑一個工作、壞程式可以破壞 monitor、短工作得排在長工作後面。IBM 7094 那一代更大的主記憶體，配上 relocation 與 memory protection，才讓多個工作安全共存變得可行。

這時 kernel 的輪廓出現了：一段在 privileged mode 執行、占用保留記憶體、能控制整個系統的程式。應用程式則被限制在較小的權限範圍。隔離並不是「希望大家守規矩」，而是硬體與核心共同阻止一個參與者任意改動別人的狀態。

multitasking 也讓政策問題浮上來。處理器下一個該跑誰？短工作是否應插隊？怎樣算公平？這些問題沒有只靠硬體就能推出的唯一答案。Lecture 1 後面問「公平是否比整體幸福重要」，不是哲學裝飾，而是在預告 scheduling 會把價值判斷寫進政策。

1960 年代中期，Multics 與 OS/360 等大型計畫也顯示另一面：能處理更多問題的 OS 迅速變成龐大軟體，失敗不只來自單一演算法，也來自複雜度本身。投影片把 software engineering 的形成連回大型作業系統的困境，目的是提醒讀者：抽象化和模組邊界同樣是可靠性工具。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)）

## 硬體變便宜後，目標跟著反轉

第二階段是「硬體便宜、人力昂貴」。timesharing 把人重新拉回互動迴圈，file system 提供方便的持久命名，response time 與 thrashing 取代單純利用率成為焦點。個人電腦一開始像回到一人一機，後來又因網路、背景程式與權限需求長回複雜系統。

1990 年代的網路把共享擴到機器之間；2000 年代之後，作業系統同時向兩端延伸：小到手機、電視與開關，大到資料中心與雲端。規模不同，核心工作仍可收成同一張表：CPU 要支援並行、記憶體要在行程間共享、I/O 要有效率、檔案要讓多個使用者共享儲存、網路要協調不同機器、安全機制要讓參與者彼此隔離。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)）

所以現代 OS 不能只被說成「管理硬體的程式」。更精確的說法是：kernel 站在 application 與 hardware 中間，提供 processes、memory 與 file management 等抽象，同時管理有限資源並限制誰能做什麼。抽象讓應用程式看見一台比較規則、比較安全的虛擬機器；核心則承擔維持這個錯覺的成本。

## 三部分課程如何接在一起

Lecture 1 把季度分成三部分，而且每部分都由 lecture principles 與 programming assignments 兩條線構成：

1. **Concurrency**：process、synchronization、scheduling，配四份程式作業。
2. **Memory management**：linker、dynamic storage、virtual memory、paging，配兩份程式作業。
3. **File systems**：disk layout、directory structure、crash recovery，配兩份程式作業。

這個數量看起來只有八份，因為另外還有 [Assignment 0](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign0/) 的環境與 C/C++ 暖身；完整季度因此是九份。第一週先複習 class、method、instance variable、`std::vector`、`std::map`、`std::unordered_map`，並確認學生會用 myth、`gdb`、`sanitycheck` 與提交工具。它不是 OS 主題作業，但它把後面所有系統實驗需要的工具鏈先固定下來。

投影片特別對比 CS106／CS107：那些課的 lecture 常緊貼作業，CS111 lecture 則以 principles and concepts 為主，section 才實作當週作業，exam 也主要考 lecture material。這解釋了為什麼「程式寫得出來」不等於考試已準備好；學生還得能在紙上比較機制、寫出不變量與分析政策。

## 評分配置透露真正的學習重心

依 [Spring 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/syllabus)，評分是考試 55%、作業 35%、參與 10%。期中占 20%，期末占 35%；九份每週作業合計 35%；lecture 與 section 參與各占 5%。考試是現場、紙筆、原則上 closed-book／closed-note，只允許少量自備筆記。

這些數字不只是行政資訊。超過一半成績來自考試，與「exam focus on lecture material」互相印證。若自學者只照作業規格做出功能，會漏掉這門課刻意訓練的另一半：用抽象與模型解釋為什麼設計正確、何時會失效、換一種政策有何代價。

作業序列也把三條主線具體化：lambdas／threads／processes、synchronization、thread dispatcher、locks 與 condition variables；接著是 memory-mapped encrypted files 與 Clock page replacement；最後讀 Unix V6 file system，再做 journaling file system。它不是九個獨立小專案，而是從執行、位址空間一路走到持久狀態。

公開材料的限制也要留在判讀裡：第一講列出 Canvas、Panopto、Ed 與 Gradescope，但這些不是公開研究來源。本文能確認的是 PDF 內的課程安排與公開 calendar，不能用看不到的錄影補充講者口頭例子。

## Lecture 1 留下的判讀框架

第一講真正交付的不是一份功能清單，而是一個之後 27 講都能重用的讀法：先找歷史上的具體問題，再看 OS 新增哪個機制，最後抽出可跨硬體沿用的原則。

用這個框架看下一講，thread 和 process 就不只是兩個定義。它們是系統在「提高共享」與「維持隔離」之間做出的兩種執行抽象；dispatcher 則是把有限 CPU 分給多個抽象的機制。後面談 virtual memory、file system 與 VM 時，同一個模式會再出現。

## 用歷史因果鏈自我檢查

挑一個年代，寫成「硬體／使用瓶頸 → 新增的 OS 機制 → 新產生的政策或保護問題」。若無法說明中間箭頭，代表只記住年份，尚未掌握本講用歷史解釋設計的方式。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 1 slides: Welcome to CS111!](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)
- [CS111 Spring 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/syllabus)
- [Assignment 0: Welcome to CS111](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign0/)
- [CS111 enrollment FAQ](https://web.stanford.edu/class/cs111/faq)
- [CS111 Honor Code and collaboration policy](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/collaboration.html)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
