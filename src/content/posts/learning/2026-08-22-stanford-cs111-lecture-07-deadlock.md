---
title: "Stanford CS111 Lecture 7：Deadlock 的四個必要條件與全域鎖順序"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 8
tldr: "第 7 講用 request/ownership graph 拆出 deadlock 的四個必要條件，再比較 detection、prevention 與 lock ranking；實務上最常破壞 circular wait，但代價是所有模組必須遵守同一個全域順序。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 7：多鎖動機、deadlock 四條件、資源圖、偵測、預防、全域 lock ordering 與 mv 案例。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-07-deadlock-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 8 篇，對應 **Stanford CS111, Spring 2026, Lecture 7**。Mendel Rosenblum 在 2026-04-13 主講，官方題目是 [Deadlock](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/7/Lecture7.pdf)。本文只依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；Canvas／Panopto 錄影不是已讀來源。

上一講建立 mutex 與 condition variable，也提醒 lock 太多會增加複雜度。本講從那個取捨的另一面開始。多把 locks 可以降低 contention，也能讓每個 data structure 自己封裝同步，但一條 thread 經常要同時持有多個 resources。只要取得順序互相衝突，所有 critical sections 都可能各自寫對，整個系統卻永遠停止前進。

## 為什麼系統需要多把 locks

PDF 先列出三個動機。第一是降低 contention。若不相關的資料共用一把 coarse-grained lock，任一操作都會擋住其他操作；拆成 fine-grained locks，可能允許更多 concurrency。第二是 modularity：一個 structure 配一把 lock，模組可以自行維持不變量。第三是實際操作常跨 structures，因此 thread 會同時需要多把 locks。

前兩點讓設計看起來局部化：只要知道目前模組的 lock 即可。第三點卻把問題拉回全域。一個動作如果先改目錄 A、再改目錄 B，就不能在中途釋放 A 而暴露半完成狀態；它必須先持有 A，再取得 B。另一個模組若反向操作，就可能先持有 B，再等 A。deadlock 正是在「局部取得都合法」時出現的全域停滯。

## 兩把 mutex 的最小 deadlock trace

PDF 用 `m1`、`m2` 與兩條 threads 建立最小例子：

```cpp
// Thread A                    // Thread B
m1.lock();                    m2.lock();
m2.lock();                    m1.lock();
// ...                        // ...
m2.unlock();                  m1.unlock();
m1.unlock();                  m2.unlock();
```

若 A 先取得 `m1`，B 接著取得 `m2`，A 的第二行就會等待 `m2`，B 的第二行則等待 `m1`。兩者都不能走到 unlock。不是 scheduler 再多給一點時間就會解決，也不是其中一條執行比較慢；等待關係本身已封閉成環。

非正式定義因此包含三層。第一，一組 threads 全部 blocked。第二，每條 thread 都在等組內另一條 thread 擁有的 resource。第三，因為所有 owner 都 blocked，沒有人能執行到 release。只說「兩條 threads 卡住」不夠。等待 I/O 很久或暫時拿不到 CPU 都可能停頓；只要外部事件仍能讓其中一條前進，就不是這個定義下的 deadlock。

## 四個必要條件

Deadlock 是少數直接幫到 operating-systems design 的理論結果。PDF 列出四個必要條件；deadlock 發生時四者必須同時存在，消除任一項就能 prevention：

1. **Limited access / mutual exclusion**：resource 不能同時共享，只能由有限數量的 threads 使用。mutex 的 capacity 是一位 owner。
2. **No preemption**：resource 一旦交出，系統不能強行拿回，只能等 owner 主動 release。
3. **Multiple independent requests / hold and wait**：thread 不是一次要求全部 resources；它會持有已取得的 resource，同時等待下一個。
4. **Circular wait**：request 與 ownership 關係形成一個 cycle，每個 waiter 需要下一位持有的 resource。

這四項是 necessary，不是看到其中一項就能判 deadlock。mutex 本身具有 mutual exclusion，但單把 mutex 沒有 resource cycle。thread 持有一把 lock 再等另一把，也只建立一段 chain；若 chain 的尾端 owner 可以完成並釋放，系統仍會前進。判斷必須看四條件是否同時成立。

它們也提供設計 review 的固定問法。resource 能不能共享？可以被系統撤回嗎？caller 會不會逐次取得並保留先前資源？全域等待圖能否形成 cycle？

逐項記錄答案，再檢查四者是否同時成立。比起只 grep `lock()`，這套檢查也能涵蓋 locks 以外的資源。

## Request 與 ownership graph

PDF 把 threads 與 resources 畫成兩種 nodes，再用兩種方向的 edges 表示「resource owned by thread」與「thread waiting for resource」。閱讀圖時，應把每條 edge 翻回現在式：誰已經持有什麼，誰還缺什麼。沒有 cycle 的 chain 即使很長，也可能由末端 owner 完成後逐步解除。

例如 T1 等 R2，而 R2 由 T2 擁有；若 T2 沒有反過來等待 T1 手上的 resource，T2 仍可完成並釋放 R2。加入 T2 等 R1、R1 又由 T1 擁有後，路徑回到起點，才形成 `T1 → R2 → T2 → R1 → T1`。

在本講以 single-instance resources 為主的圖中，這個 cycle 直接呈現 circular wait。更一般的多 instance resource model 需要額外資訊，不能看到任意 cycle 就當成所有情況的充分判決。PDF 此處是把 locks 的 owner/waiter 關係變成可檢查的圖，不是展開完整的 graph-theory 演算法。

## Deadlock 不只發生在 locks

任何會讓執行者等待的 resource 都可能進入相同結構。PDF 列出 discrete locks、continuous memory exhaustion、tape drives、network messages 與 distributed systems。重點不在把它們硬說成同一種 API，而是它們都可能形成「我保留手上的份額，等待你手上的份額；你也反過來等我」。

記憶體例子尤其說明 resource 不一定是一件可命名物件。多個 processes 可能各自保留部分 pages，又都等更多 memory 才能完成；若沒有 process 能到達釋放點，連續數量的 resource 也會 deadlock。network 或 distributed system 中，ownership 與 request 分散在不同 machines，偵測全域 cycle 又更困難。

PDF 同時提醒：通常無法事先知道 thread 將需要哪些 resources。input、control flow 或另一個模組的回傳值都可能改變後續需求。這個限制直接影響 prevention：要求所有 callers 預先完整申報，理論上乾淨，實作上卻未必可行。

## Solution 1：偵測後打破 deadlock

第一條策略是 detection。系統允許資源要求自然發生，追蹤 request/ownership state，判定何時已 deadlocked，再終止其中一條 thread 以打破 cycle。受害者退出後，它持有的 resources 被釋放，其他成員才可能繼續。

PDF 判斷這通常不適合 operating systems。任意終止 thread 可能留下修改到一半的 kernel 或 application state，也未必有通用方法復原它對外部世界造成的 effects。選誰終止、已做的工作怎麼撤銷、是否會反覆犧牲同一方，都是 detection 之外的 recovery 問題。

database systems 較常使用這條路，因為 transaction 可以 abort 並 retry。這不是說 abort 沒有成本，而是 transaction abstraction 已定義未 commit 工作如何撤銷，使「殺掉一位 participant」有較清楚的語意。策略是否實用，取決於 resource owner 能否安全回滾。

## Solution 2：破壞一個必要條件

第二條策略是 prevention：設計系統，使四個必要條件至少有一項永遠不成立。PDF 逐項檢查可行性。

要消除 limited access，可以建立足夠 resources，讓 thread 永遠不必等待。但 locks 的目的就是 exclusive access，共享狀態不可能靠複製無限把 mutex 解決；memory、devices 也受實體容量限制。

要消除 no preemption，可以直接取回 resource。CPU 本來就適合 preemption：kernel 能保存執行狀態，日後恢復。lock 則不同；若 owner 正在維護資料結構不變量，中途搶走 lock 交給別人，後者會看到半完成狀態。能不能 preempt 是 resource semantics，不是 scheduler 想不想而已。

要消除 multiple independent requests，可以要求 thread 一次提出全部需求，系統要嘛一次全給，要嘛全部不給。困難是要同時等待多件事而不能先鎖任何一件；caller 也很難預測未來需求，可能為保險而 over-allocate，使 utilization 與 concurrency 下降。

最後是消除 circular wait：讓所有 threads 按同一順序要求 resources。PDF 認為這是 operating systems 最常使用的方法。它不移除 mutual exclusion、不強搶 resource，也不要求精確預知完整集合；只限制已知 requests 的合法順序。

## Global lock ordering 與 lock rank

實作方法是替每把 lock 指派全域 rank，要求一律由小到大取得，或一律由大到小取得，但全系統只能選一個方向。假設 cycle 存在，每次「持有一把、再要求下一把」都必須讓 rank 嚴格上升。走一圈回到起始 lock，rank 卻不可能大於自身，因此 cycle 不可能形成。

這個規則還可以 runtime check。thread 取得新 lock 時，系統比較它與目前已持有 locks 的 ranks；順序錯誤就立即報錯，而不是等罕見 interleaving 在 production 形成 deadlock。lock rank check 驗的是 ordering discipline，不代表程式沒有其他 races，也不處理不在 ranking 制度內的 resources。

一致順序必須依 resource identity 或預先定義的 rank，而不能依 caller 參數出現順序。否則兩個 callers 處理同一對 resources、但參數反向時，仍會產生相反的 lock order。

## 兩個 mv processes 的案例

PDF 用兩個同時移動檔案的 processes 讓問題具體化：

```text
Process 1: mv a/x b/y
Process 2: mv b/z a/q
```

若實作按照 command parameter order 鎖 directories，process 1 先鎖 `a` 再鎖 `b`；process 2 則先鎖 `b` 再鎖 `a`。兩者各持有一個 directory lock 後，就重現 `m1`/`m2` deadlock。

解法不是規定「source directory 永遠先鎖」，因為對另一個 command 而言 source 正好是相反目錄。應依兩個 directories 的共同全域次序，例如 stable inode number 或系統定義的 rank，先排序再取得。如此兩個 processes 都先要求同一把 lock；只有 winner 能繼續取得第二把，loser 尚未持有任何會封閉 cycle 的反向 lock。

這個案例也說明 ordering 是 correctness rule，不是效能建議。只要某條例外路徑按參數順序、另一條按 inode 順序，cycle 就可能重新出現。

## Deadlock 是全域設計問題

本講最後的 design insight 是：deadlock breaks modularity。單一模組可以證明自己每次 access 都持有正確 lock，仍無法獨自證明全系統沒有 cycle。所有可能一起持有 locks 的模組，都必須同意同一份 ordering；修改系統、加入新 lock 或新增跨模組 call 時，也要維持它。

這會造成實際痛點。有時 code 已持有高 rank lock，接著才發現需要低 rank resource。它不能直接取得，只能重構 control flow、提早取得、釋放後重試，或重新設計介面。global order 保住 safety，卻會穿過 module boundary，限制局部實作自由。

讀完後，可以把 code review 變成一個具體動作：列出每條 path 同時持有的 locks，寫成 `L1 < L2 < ...`，再把所有 paths 合併成一張 ordering graph。若出現互相矛盾的 edges，就不要等測試重現；設計本身已允許 circular wait。若 graph 無 cycle，仍要另查其他三個條件與非 lock resources，但至少最常見的 prevention discipline 已可被檢查。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 7 slides: Deadlock](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/7/Lecture7.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Linux kernel documentation: Runtime locking correctness validator](https://docs.kernel.org/locking/lockdep-design.html)
