---
title: "Stanford CS111 Lecture 8：FIFO、round robin、priority 與多核心排程"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 9
tldr: "第 8 講從 FIFO、round robin 與不可實作的 SRPT，推到自適應 priority queues、BSD scheduler，再處理多核心 queue contention、core affinity 與 work-conserving 的衝突。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 8：CPU scheduling 的回應時間、公平性、time slice、SRPT、priority queues、BSD scheduler、Unix nice 與多核心排程。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-08-cpu-scheduling-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 9 篇，對應 **Stanford CS111, Spring 2026, Lecture 8**。2026-04-15 由 Mendel Rosenblum 主講，官方題目是 [Scheduling](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

這講接續 dispatching：dispatcher 已經能保存暫存器、切換 stack，現在才問「下一個該切給誰」。因此 **dispatch 是 mechanism，scheduling 是 policy**。輸入是一組 ready threads 與若干 CPU cores；輸出則是每個 core 跑哪個 thread、跑多久。官方 PDF 先用單核心建立直覺，再把同一政策搬到多核心；錄影只在 Canvas，本文不補寫投影片沒有的口頭內容。

## 1. FIFO：最簡單的 ready queue 已經是一項政策

First-in-first-out（FIFO，也稱 non-preemptive scheduling）只需要一條 ready queue。thread 變成 ready 時排到尾端；dispatcher 取隊首，讓它一直跑到 exit 或 block。資料結構與規則都很簡單，但「先到先服務」不等於中立：排在前面的長工作會決定後面所有工作的等待時間。

[官方 Lecture 8 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf)假設 A 需要 100 ms、B 需要 1 ms、C 需要 2 ms，ready queue 的執行順序是 A、B、C。completion times 分別是 100、101、103 ms，平均為 `(100+101+103)/3 = 101.3 ms`。B 與 C 本來幾毫秒就能完成，卻被 A 擋住；這就是 convoy effect 的直覺。PDF 把問題概括為 starvation 與 high response time：只要工作持續很久，後面的工作就可能長期拿不到 CPU。

這裡的 response time 是投影片用來比較工作完成時刻的量，不應和互動系統常說的「第一次回應延遲」混為一談。本文沿用官方圖的計算方式。FIFO 的優點不是平均 response time 好，而是排隊成本低、行為容易理解，而且長工作不會因時間片被反覆中斷。

## 2. Preemption 與 round robin：公平要付 context-switch 成本

要避免一個 thread 無限占用 CPU，核心可加入 **preemption**。硬體 timer 在 thread 執行一段時間後產生 interrupt；這段上限叫 time slice。[官方 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf) 以 Linux 的 4 ms time slice 作例子，但這是講義中的例示值，不是本文對所有 Linux 版本與 scheduler 的現況宣稱。

[同一份官方 PDF 的 Round Robin 範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf)每次讓隊首跑一個 time slice；若仍 ready，就把它放回隊尾。所有 ready threads 輪流取得 core，因此在相同優先層級有近似相等的 CPU share。對前述 100、1、2 ms 工作與 1 ms slice，B 在 2 ms 時完成、C 在 5 ms 時完成、A 在 103 ms 完成，平均降到 36.7 ms。短工作不必等長工作跑完。

time slice 不是愈短愈公平就愈好。slice 太長，round robin 逐漸退化成 FIFO；太短，timer interrupt、保存與載入暫存器、切換 address-space 狀態等 overhead 會占據太多時間。有效 CPU 比例可以粗略寫成 `q/(q+s)`：`q` 是 time slice，`s` 是一次切換成本。這是理解取捨的模型，不是 PDF 指定的 benchmark。

公平也不保證平均完成時間最低。若 A、B、C 都各需要 10 ms，FIFO 的完成時刻是 10、20、30 ms，平均 20 ms；1 ms round robin 會讓它們約在 28、29、30 ms 才完成，平均 29 ms。每個工作都很公平地前進，卻讓原本可以先完成的 A 與 B 延後。選 scheduler 前必須先回答要最佳化的指標。

## 3. 排程目標互相衝突

PDF 列出三組目標。第一是 minimize response time，讓使用者不必等待；第二是有效使用資源，包括讓 cores、disks 都保持忙碌，以及降低 context-switch overhead；第三是公平分配 CPU cycles 並避免 starvation。沒有一個演算法能在所有 workload 同時把三者推到最好。

公平是一項系統價值判斷，而不只是數學條件。縮短 slice 可以讓每個 ready thread 更快被輪到，卻增加 overhead；先跑短工作能降低平均完成時間，卻可能讓長工作一直後退；優先服務 interactive workload 可改善人感受到的延遲，卻會拿走 background compute 的 share。投影片直接把 fairness versus average response time 稱為有社會意涵的問題，因為「誰先拿到稀缺資源」必然分配利益。

因此不能只報一個平均數。至少還要看 tail latency、是否有 starvation、CPU 與 I/O utilization，以及 scheduler 自身成本。平均值可能被少數長工作主導，也可能掩蓋某個低優先群體永遠得不到服務。

## 4. SRPT：最佳平均 response time 需要知道未來

[官方 Lecture 8 PDF 的 SRPT 範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf)中，Shortest Remaining Processing Time（SRPT）永遠選「剩餘時間最短」的 thread，並在這份投影片的簡化描述中 run to completion。它對平均 response time 是 provably optimal。對 100、1、2 ms 範例，順序改成 B、C、A，完成時刻是 1、3、103 ms，平均 35.7 ms，比 1 ms round robin 的 36.7 ms 再低；三個工作都為 10 ms 時，SRPT 與 FIFO 同樣得到 20 ms。

[同一份官方 PDF 的 workload 數字](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf)也顯示 SRPT 可能提高整體 resource utilization。I/O-bound 工作通常只有短 CPU burst，接著便等待 disk 或 network；先完成這段短 burst，可以讓裝置開始工作，CPU 再去跑 compute-bound thread。PDF 用三個 workload 建立直覺：大檔案複製反覆做 5 ms disk read、1 ms CPU、5 ms disk write；互動式 editor 等 100 ms 字元後只需 0.1 ms CPU；number crunching 則可能有數小時的 CPU burst。偏好短 burst 能讓人與 I/O 裝置不必被長計算阻塞。

問題是 scheduler 不知道 thread 未來還要跑多久；一般程式甚至自己也未必知道。即使知道，持續到來的短工作仍可能餓死長工作。所以 SRPT 在這裡既是 optimum，也是一個無法直接實作的 oracle。它告訴我們理想決策需要什麼資訊，實際 scheduler 再找可觀測的 proxy。

## 5. 用過去 CPU usage 近似未來

投影片的關鍵近似是：**past performance predicts future behavior**。如果 thread 已經執行很久仍未 block，它很可能是 CPU-bound，下一段也會繼續使用 CPU；頻繁 block 的 thread 則可能是 interactive 或 I/O-bound，下一個 CPU burst 通常較短。這是 workload tendency，不是正確性保證。

這個觀察把不可知的 remaining time 換成可量測的 recent CPU usage。scheduler 不必猜精確毫秒，只要讓近期用較少 CPU 的 thread 取得較高 priority，就能在許多 workload 近似 SRPT：editor 與 I/O-bound 工作很快回到等待狀態，compute-bound 工作逐步往低 priority 移動。

近似也會誤判。thread 可能先做長計算再轉成互動，也可能故意短暫 block 以維持高 priority。自適應 scheduler 的結論不是「歷史一定預言未來」，而是用可更新的估計取代不存在的 oracle，並另外設計避免 starvation 的機制。

## 6. Dispatcher、scheduler 與 priority queues

PDF 特別修正一個常見心智模型：不是 dispatcher 每次 context switch 都「呼叫 scheduler 算下一個」。兩者共享 scheduling data structure。dispatcher 位於快速路徑，只要快速取得下一個 thread；scheduler 則在事件發生時更新資料結構，藉此控制 dispatcher 之後會選到誰。

priority-based scheduling 讓每個 thread 有 priority，dispatcher 永遠取最高 priority 的 ready thread；同一 priority 內用 round robin。實作可以為每個 priority level 各設一條 ready queue `P0 ... Pn`，找到最高的非空 queue 後從隊首取 thread。priority 因而不是單一政策，而是一個可以承載多種政策的機制：可以用來近似 SRPT，也可以暴露給 user 影響排程。

一個簡單 feedback 規則是：新 ready thread 從最高 priority 開始；若用完整個 slice 仍未 block，就降到下一層；若先 block，之後回到較高層。結果是 interactive、I/O-bound threads 留在上方，CPU-bound threads 往下遷移。這就是投影片呈現的 multilevel feedback 思路，雖然 PDF 在頁面上稱它 priority queues，而沒有把一套現代 MLFQ 的所有參數與規則寫成規格。

最直接的缺陷是 CPU-bound thread 可能 starvation。只靠「用滿 slice 就降級」，高優先工作源源不絕時，最低 queue 永遠輪不到。任何完整方案都要回答低 priority 如何隨等待時間恢復競爭力。

## 7. 4.4BSD scheduler 與 Unix nice

PDF 以 early-1990s Unix 的 4.4BSD scheduler 說明自適應 priority。dispatcher 記錄 thread 的 start/stop time，系統保留近期 CPU usage；最近使用 CPU 最少的 thread 得到最高 priority。interactive 與 I/O-bound threads 因常常等待，CPU usage 少，維持高 priority；CPU-bound threads 累積 usage 後降低 priority。

避免 starvation 的答案是 aging：thread 等待執行時 priority 會上升，最後能成為最高 priority。若系統嚴重 overload，所有 thread 都只取得少量 CPU，它們的 usage 差距縮小，排程會退化成最高 priority queue 內的 round robin。這也顯示 adaptive policy 的狀態依賴 workload；不能只看某一瞬間的 priority 解釋長期 share。

Unix `nice` 讓 user 影響預設行為。投影片列出 `0` 為 default、`+19` 最 nice 因而給較低 priority、`-20` least nice 因而最高 priority，並給出：

```bash
nice -n 19 ./background_script.sh
nice -n -20 ./run_with_highest_priority.sh
```

這裡要讀的是相對意義：對其他工作「nice」就是少爭 CPU。實際能否設定負 nice value 受權限與系統規則限制；PDF 沒有展開權限模型，本文也不把範例寫成所有使用者都能成功執行的保證。

## 8. 多核心：全域最佳順序撞上 contention 與 affinity

最初的 multicore 設計讓所有 cores 共用 ready queues 與 lock；每個 core 各自有 dispatcher 和產生 slice 的 timer interrupt。若有 `k` 個 cores，就讓最高 priority 的 `k` 個 threads 執行。高 priority thread 變 ready 時，若它勝過目前最低 priority 的 running thread，核心透過 inter-processor interrupt（IPI）要求另一個 core preempt。

共享 queue 讓全域選擇容易，卻把所有 cores 導向同一把 lock。core 數增加後，central ready queue 會成為 bottleneck。投影片給的解法是每個 core 各有 ready queue，並隨時間 balance；work stealing 讓空閒 core 從別人的 queue 取工作。代價是「哪個 thread 全域最高 priority」不再能用一次便宜操作回答。

第二個問題是 **core affinity**。thread 在某個 core 執行後，cache 裡累積它的 instructions 與 data；搬到另一個 core 可能要重新載入。把 queues 平衡得很漂亮，反而可能因 migration 失去 locality。scheduler 因此同時衡量 queue imbalance、priority 與移動成本，而不是逢空閒就搬。

## 9. Work-conserving 不是免費的好性質

work-conserving scheduler 的定義是：只要有 runnable work，就不讓 core idle。理論上這很合理，但 PDF 立刻提醒，在 contention 與 affinity 下很難免費做到。為了找到遠端 queue 的工作、取得 lock、發 IPI、搬移 thread，付出的同步與 cache 成本可能大於讓 core 短暫 idle 的損失；整體反而變慢。

這是本講最重要的系統思考之一：局部看似浪費，不代表全域 throughput 較差。性質必須連同實作成本與 workload 評估。若工作即將在原 core unblock，強行 migration 可能比等待更糟；若某 core 長期空閒，stealing 才值得。

## 10. Scheduler 何時執行，以及結論

scheduler 是回應事件而執行的 code，**不是一條常駐 thread**。PDF 列出的事件包括 thread unblocks、timer interrupt，以及另一個 core 傳來的 IPI。這些事件會改變 ready set 或需要重新考慮目前選擇，scheduler 便更新共享資料結構；dispatcher 再從快速路徑取下一個工作。

CPU scheduling 的重要性也隨硬體與 workload 改變。timesharing 時代 CPU 稀缺，政策極重要；單一使用者 PC 可較多交由 user 調整；多核心讓一般 CPU time 不再總是最稀缺。但 datacenter 又把問題放大到數百、數千台 servers，還要讓 latency-critical web service 與 CPU-heavy ML training 共存。

最後的契約是：scheduler algorithm 不應改變程式產生的結果，但會深刻影響效率與 response time。最好的方案通常 adaptive，依 workload 調整；那些看似奇怪的 constants 可能大幅左右行為。真正最優需要預測未來，實際系統只能用過去估計未來，並在 response time、utilization、overhead、公平與 locality 之間持續折衷。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 8 slides: Scheduling](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP：Scheduling Introduction](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf)
- [Linux manual：nice(1)](https://man7.org/linux/man-pages/man1/nice.1.html)
- [Linux kernel scheduler documentation](https://docs.kernel.org/scheduler/index.html)
