---
title: "Stanford CS111 Lecture 4：交錯執行、race condition、atomicity 與 critical section"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 5
tldr: "第 4 講逐步拆解 Too Much Milk 的失敗排程，從具體 interleaving 推導 race condition、atomicity、critical section 與正確同步條件。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 4，以 Too Much Milk 反例理解 interleaving、race、atomicity 與 critical section。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-04-concurrency-atomicity-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 5 篇，對應 **Stanford CS111, Spring 2026, Lecture 4**。2026-04-06 由 Mendel Rosenblum 主講，官方題目是 [Concurrency](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/4/Lecture4.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Lecture 4 把「每條 thread 都依序執行」與「多條 threads 的全域順序不固定」放在一起。Too Much Milk 不是趣味插曲，而是用三輪失敗方案逼出 race condition、atomicity 與 critical section 的精確定義。

## 用反例而不是口號學 concurrency

本文先區分 independent 與 cooperating threads，再把 `read`、判斷、`write` 拆成可交錯步驟。每個方案都要實際寫出一條會失敗的 schedule；只有如此，互斥、progress 與 bounded waiting 才不是事後貼上的術語。

## independent 與 cooperating threads

沒有 shared state 的 independent threads 不會互相影響，輸出只取決於各自輸入，因此可重現，排程順序也不改變結果。cooperating threads 共享 state，則可能 nondeterministic、難以重現，結果依 execution order 而變。課堂用兩條分別輸出 `ABC` 與 `CBA` 的 thread 說明：字元可交錯，但每條 thread 內部順序仍保留，所以 `AABBCC` 不可能由這兩條順序產生。

仍然需要合作，因為單一磁碟要服務多個檔案、同一銀行帳戶會被多台 ATM 存取；多核心 parallelism 與 I/O／computation overlap 也都需要共享。因此目標不是消滅 concurrency，而是控制會衝突的順序。

## race 從 read-modify-write 出現

兩條 thread 分別寫不同變數時，先後通常不影響終值；當一條執行 `A = B + 1`、另一條執行 `B = 2 * B`，A 讀到 B 的時刻就會改變答案。`x++` 更不是一個不可分割動作：它通常包含 read、add、write，另一條 thread 可插在中間。

atomic 的意思是對其他 threads 看起來瞬間完成、不可觀察中間狀態。單一 machine word 的 aligned read/write 通常可視為 atomic，struct copy 與多步驟操作通常不行。PDF 的「usually」是重要限制：精確保證要看硬體、對齊與語言 memory model，不能把課堂模型擴寫成所有平台承諾。

若硬體一個 atomic primitive 都沒有，純軟體無法憑空造出 atomicity；策略是由硬體小原語往上建較容易使用的 synchronization constructs。

## Too Much Milk：逐次失敗的價值

兩位室友都先看到沒有牛奶，再各自出門，最後買太多。需求同時包含 safety（永不多買）與 liveness（需要時終究有人買）；只滿足其一不是正確解。

把 `milk==0` 改成共享變數仍會失敗，因為 check 與 buy 之間可被切換。加一張共同 `note` 也沒修好：兩人可能都先讀到零，再各自寫一。錯誤變少不等於 race 消失。

用單一 turn variable 輪流，可能做到 safety，卻讓輪到但不在場的一方阻塞另一方，形成 starvation／liveness 問題。各放一張 note 的對稱版本又可能同時看到對方 note、兩邊都不買。第四版讓一方等待另一方，能工作但 asymmetric，且 busy waiting 會占用 CPU 什麼也不做。Peterson's algorithm 提供對稱解，但本講的教學判決不是要求手刻它，而是證明 atomic reads/writes 仍很難安全組合。

## 三個定義接起來

synchronization 是使用 atomic operations 確保 cooperating threads 正確；critical section 是同一時間只允許一條 thread 執行的 code；mutual exclusion 是強制 critical section 的機制，通常由 lock 提供。下一講的 locks 與 condition variables，就是把牛奶題裡反覆出錯的協定封裝成可重用原語。

## 把失敗排程逐步寫出來

最初版的反例是：A 讀 `milk==0`；切到 B，B 也讀到零並完成購買；切回 A，A 不會重新檢查，仍依先前結果購買。問題不是 write 不 atomic，而是「檢查後再行動」整段沒有 atomicity。

共同 note 版同樣可列出反例：A 讀 `note==0` 後被切走；B 也讀零、寫一、買完再清零；A 回來後依舊寫一並購買。把 race window 縮短只讓錯誤罕見，沒有刪除合法 interleaving。

turn 版讓 A 只在 note 為零時行動、B 只在一時行動。它不會同時買，卻可能在沒有牛奶、輪到 A、A 又永遠不執行時讓 B 無法前進。這是 safety 成立、liveness 失敗的具體排程。

雙 note 版則可能 A 先設 `noteA=1`、B 再設 `noteB=1`；兩邊接著都看見對方 note，不進購買區，最後各自清除。這次沒有多買，但需要牛奶時也沒人買。第四版用不對稱規則打破僵局：A 看 B，B 等 A 清除，能同時維持 safety 與 liveness；代價是 B 的 `while` 持續讀共享變數，白白占用 core。

## Peterson 為何只能放延伸

PDF 只說 Peterson's algorithm 是 symmetric solution，沒有在頁面內給 code 或證明。因此課堂可支持的結論只有「存在一個對稱軟體協定」；下面是依 [Peterson 原始論文](https://doi.org/10.1016/0020-0190(81)90106-X)補充的判讀，不冒充 lecture agenda。

兩條 threads 各先宣告 intent，再把 `turn` 讓給對方；只有在「對方有意進入，而且 turn 指向對方」時等待。若兩邊同時競爭，單一 `turn` 最終值只會偏向一方，因此不會同時進 critical section（safety）。離開者清除 intent，等待者便能前進；在兩條 threads、atomic read/write 與適當 memory-order 假設下可論 liveness。

限制同樣重要：它只直接處理兩方，等待仍是 busy-wait；而 C++ 對跨執行緒可見性有明確的 [atomic ordering 規則](https://eel.is/c++draft/atomics.order)，不能把未指定原子語意的教科書 pseudo-code 原封不動當成 C++ synchronization。實務上應使用語言與 OS 提供的 mutex／condition variable，讓 memory ordering 與阻塞語意由正式介面承擔。

## 用 schedule 驗證，不用直覺

任選一個 Too Much Milk 方案，把每次 read、write 與條件判斷排成兩欄，直到產生「重複購買」或「沒人購買」。接著指出需要合併成哪個 atomic region 才能排除該反例；只說「加一把 lock」而無法圈出區域，仍未定位 race。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 4 slides: Concurrency](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/4/Lecture4.pdf)
- [CS111 Assignment 2: Synchronization](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign2/)
- [G. L. Peterson, Myths About the Mutual Exclusion Problem](https://doi.org/10.1016/0020-0190(81)90106-X)
- [C++ working draft: order and consistency](https://eel.is/c++draft/atomics.order)
- [cppreference: `std::mutex`](https://en.cppreference.com/w/cpp/thread/mutex)
- [cppreference: memory order](https://en.cppreference.com/w/cpp/atomic/memory_order)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
