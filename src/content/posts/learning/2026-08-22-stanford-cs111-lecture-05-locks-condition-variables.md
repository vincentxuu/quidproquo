---
title: "Stanford CS111 Lecture 5：mutex、condition variable 與 Mesa semantics"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 6
tldr: "第 5 講用容量為 8 的環形 Pipe 證明：mutex 只提供互斥；condition variable 才能在 predicate 不成立時原子地釋放鎖並阻塞；Mesa semantics 下，wait 返回後必須用 while 重查條件。"
description: "逐講導讀 Stanford CS111 Spring 2026 Lecture 5：鎖的擁有權、環形緩衝區不變量、四版錯誤 Pipe、condition variable、Mesa semantics 與 monitor。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-05-locks-condition-variables-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 6 篇，對應 **Stanford CS111, Spring 2026, Lecture 5**。Mendel Rosenblum 在 2026-04-08 主講，官方題目是 [Locks and Condition Variables](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/5/Lecture5.pdf)。本文只依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影位於 Canvas／Panopto，沒有把它當成已讀來源。

上一講的 Too Much Milk 用旗標與逐條 interleaving 勉強做出互斥，但解法太複雜。本講要找兩個更高階的同步能力。第一是讓 critical section 容易表達的 **mutual exclusion**；第二是在某件事尚未發生時，不浪費 CPU 地延後 thread 的 **blocking**。mutex 解第一題，condition variable 解第二題。整份 PDF 用同一個 producer/consumer `Pipe` 反覆改錯，重點正是看清楚兩者為何缺一不可。

## 從 Too Much Milk 到 mutex

`lock` 在英文裡既是名詞也是動詞，若類別和方法都叫 lock，就會出現 `lock.lock()`。C++ 因而把 mutual-exclusion object 稱為 `std::mutex`。本講先使用三個操作：

- `lock()`：若 mutex 已被持有就阻塞；可取得時，將它標成由呼叫者持有。
- `unlock()`：持有者釋放 mutex，並讓一位等待者有機會繼續。
- `try_lock()`：若 mutex 已被持有，不等待而直接回報失敗。

擁有權契約不能省略：成功取得 mutex 的 thread 才能釋放它；一把 mutex 同時最多只有一位 owner。mutex 也不會自動知道哪些變數屬於同一份共享狀態，程式設計者必須規定：凡是讀寫那組變數，都先持有同一把 mutex。

```cpp
std::mutex mutex;
mutex.lock();
if (milk == 0) {
    buy_milk();
    milk = 1;
}
mutex.unlock();
```

從 `lock()` 成功到 `unlock()` 是 critical section。兩條 threads 不能同時執行檢查與更新，因此不會一起看到 `milk == 0`。代價也很清楚：`buy_milk()` 在鎖內時，另一條 thread 要等完整個購買動作。互斥保證 atomicity，不保證 critical section 很短，也不自動保證公平。

## Pipe 的共享狀態與環形不變量

`Pipe` 是容量固定為 `SIZE = 8` 的 bounded producer/consumer queue。producer 用 `put(c)` 放入字元，consumer 用 `get()` 取出最舊字元：

```cpp
char buffer[SIZE];
int count;
int nextPut;
int nextGet;
std::mutex mutex;
```

`nextPut` 指向下一個寫入位置，`nextGet` 指向下一個讀取位置；兩者到達 `SIZE` 就繞回 0。`count` 區分「索引相同但 buffer 為空」與「索引相同但 buffer 已滿」。正確實作必須一直維持六個不變量：

1. `0 <= count <= SIZE`。
2. `0 <= nextPut, nextGet < SIZE`。
3. `count` 等於尚未被取走的字元數。
4. `count > 0` 時，`buffer[nextGet]` 是下一個應回傳的字元。
5. `count < SIZE` 時，`buffer[nextPut]` 是下一個可以安全覆寫的位置。
6. `count`、兩個索引與對應 buffer slot 的更新，都在持有同一把 mutex 時一起完成。

PDF 逐步執行 `put('A')`，再放入 B、C，接著 `get()` 取回 A；之後放入 D 到 I，讓索引跨過陣列尾端回到開頭。這不只是 `% SIZE` 的技巧：物理位置會重用，但尚未被 consumer 取走的 logical order 不能被破壞。

## Pipe v1：有 critical section，前置條件仍錯

v1 的 `put` 與 `get` 都在 mutex 內更新，所以 critical sections 不重疊，兩條 thread 不會同時改索引。然而 mutex 只回答「現在是否有人在改」，沒有回答「現在是否允許 put 或 get」。

第一條失敗 trace 是 overflow。容量 8 的 queue 已有 8 個未讀字元時，`count == 8`。再執行 `put('J')`，v1 仍先 `count++`，使 count 變 9，再覆寫 `buffer[nextPut]`。一個尚未讀取的字元消失，count 範圍與 FIFO 順序同時失效；PDF 圖中 J 覆蓋 B。

第二條 trace 是 underflow。空 queue 的 `count == 0`，但 v1 的 `get()` 仍先 `count--`，使 count 變 -1；接著讀出未定義內容並推進 `nextGet`。mutex 完整保護了這串錯誤操作，反而證明「沒有 data race」不等於演算法正確。

所以 `put` 的 predicate 是 `count < SIZE`，`get` 的 predicate 是 `count > 0`。predicate 是對共享狀態的布林判斷，只有持有保護該狀態的 mutex 時，檢查結果才有意義。predicate 不成立時不能繼續，也不能持鎖原地空轉，因為必須讓另一方進來改變 `count`。

## Pipe v2：持鎖等待造成 deadlock

v2 在 critical section 裡加入等待：

```cpp
mutex.lock();
while (count == SIZE) {
}
// put
```

check 與 update 不會被別人插入，但 queue 滿時，producer 永遠持有 mutex。唯一能讓 `count` 下降的是 consumer 的 `get()`，而 `get()` 第一個動作也是取得同一把 mutex。producer 等 consumer，consumer 等 producer 解鎖，兩者永遠無法前進。空 queue 中 consumer 持鎖等待 producer，也是對稱的 deadlock。

等待者必須在確認 predicate 不成立後釋放 mutex，而且「釋放＋睡眠」必須不可分割。若分成兩步，狀態可能在中間改變，通知也可能在 waiter 真正睡下前發生而被錯過。

## Pipe v2.5：鎖外檢查造成 race

v2.5 把迴圈搬到 `mutex.lock()` 之前：

```cpp
while (count == SIZE) {
}
mutex.lock();
// put
```

這避開持鎖等待，卻拆開 predicate check 與 state update。假設 `count == SIZE - 1`，兩個 producers 都可能在鎖外看到「尚未滿」。A 先取得 mutex 並 put，使 queue 變滿。B 接著取得 mutex，卻不會回頭檢查，仍然 put，使 count 變成 `SIZE + 1`。

此外，普通 C++ `int count` 在鎖外被讀、在另一條 thread 的鎖內被寫，並行讀寫本身就是 data race，不只是「可能看到稍舊的值」。即使改成 atomic，check-then-act 仍不是一個 atomic transaction，邏輯 race 依然存在。

## Pipe v2.9：接近正確，卻用 CPU 忙等

v2.9 在每次重查前釋放再取得 mutex：

```cpp
mutex.lock();
while (count == SIZE) {
    mutex.unlock();
    mutex.lock();
}
// put
```

每次 predicate check 都在鎖內，離開迴圈後仍持有 mutex，所以沒有 v2.5 的 check/update race；另一方也有機會改變 `count`。問題是等待者沒有睡眠。它反覆取得與釋放 mutex，和真正能推進系統的 thread 爭用 CPU 與 cache line。若兩方沒有同時被排程，等待者可能燒完整個 core，卻不完成任何工作。

四次失敗各指向不同缺口。v1 缺 flow-control predicate；v2 持鎖忙等而 deadlock；v2.5 在鎖外檢查而 race；v2.9 雖保住 check/update atomicity，卻 excessive busy-waiting。需要的不是再調迴圈位置，而是「在 critical section 內原子地釋放 mutex 並睡眠」。等狀態可能改變後，再競爭 mutex。

## Condition variable：通知狀態可能已改變

`std::condition_variable` 可以想成讓 threads 睡眠的等待佇列。PDF 介紹三個操作：

- `wait(lock)`：原子地釋放 lock 並阻塞；被喚醒後，先重新取得 lock 才返回。
- `notify_one()`：若有人睡眠，喚醒其中一位。
- `notify_all()`：喚醒所有睡眠者。

condition variable 不保存「條件為真」這個事實，也不是事件計數器。`notify_one()` 發生時若沒有人等待，不會替未來 waiter 留一張票。真正的 conditions 是 `count > 0` 與 `count < SIZE`；它們由 mutex 保護的共享狀態決定。condition variable 只表示「你關心的狀態也許改了，醒來重查」。

Pipe 用 `charAdded` 等待 `count > 0`，以 `charRemoved` 等待 `count < SIZE`。成功 put 後通知 consumer，成功 get 後通知 producer。等待與更新都使用保護 `count` 的同一把 mutex：

```cpp
mutex.lock();
while (count == 0) {
    charAdded.wait(mutex);
}
count--;
char c = buffer[nextGet];
nextGet = (nextGet + 1) % SIZE;
charRemoved.notify_one();
mutex.unlock();
```

PDF 先用簡化介面傳入 mutex；最後的 C++ 版本改用 `std::unique_lock<std::mutex>`，因為標準 `condition_variable::wait` 必須能暫時解鎖並重新上鎖。這個 scope-bound object 也會在函式返回時自動釋放 mutex，避免某條 return 或 exception path 漏掉 `unlock()`。

## Mesa semantics：notify 不會直接交出 mutex

本講最關鍵的一句是：notified thread 不一定立刻重新取得 mutex。這就是 **Mesa-style condition-variable semantics**。notifier 呼叫 `notify_one()` 後仍可持有 mutex 繼續執行；被喚醒者只是從 sleeping 變成 runnable，之後還要和其他 threads 競爭 mutex。等它真正從 `wait` 返回時，當初等待的 predicate 可能又是 false。

正確契約不是「醒來就保證 condition 成立」，而是「醒來並重新取得 mutex 後，可以安全地重查共享狀態」。因此 predicate 必須寫在 `while`，不能寫在 `if`。

## 為什麼 wait 一定放在 while

PDF 用 T1、T2、T3 展開 `if` 版的完整失敗 trace：

1. consumer `T1` 取得 mutex，看到 `count == 0`，呼叫 `charAdded.wait(lock)`；wait 原子地釋放 mutex，T1 睡眠。
2. producer `T2` 取得 mutex，執行 `put('A')`，令 `count == 1`，再 `notify_one()` 喚醒 T1。通知沒有把 mutex 交給 T1；T2 隨後解鎖。
3. T1 尚未重新取得 mutex 前，另一個 consumer `T3` 先取得它。T3 取走 A，使 `count` 回到 0，通知 producer，再解鎖。
4. T1 終於重新取得 mutex，從 `wait` 返回。若只用 `if`，控制流程直接往下執行 `count--`，使 count 變 -1，並從空 queue 讀出 undefined。

改成 `while (count == 0)` 後，第四步會重查 predicate，發現 queue 又空了，於是再次 wait。相同寫法也處理 spurious wakeup：不論因何返回，只要 predicate 尚未成立，就不能碰共享狀態。

```text
持有 mutex → while（predicate 不成立）wait → predicate 成立時修改狀態
```

while 不是保守的風格偏好，而是 Mesa semantics 下的 correctness requirement。

## notify_one、notify_all 與喚醒競爭

PDF 接著把 v3 的兩個通知換成 `notify_all()` 並問能否運作。只要所有 waiters 都用 while 重查 predicate，正確性仍可維持。每位被喚醒者都要重新取得 mutex；第一位可能消耗資源，後來者看到 predicate 不成立就再睡。

但 `notify_all()` 可能製造 thundering herd：一次狀態改變只允許一個操作前進，卻喚醒許多 threads 競爭同一把 mutex，最後大多數又回去睡。`notify_one()` 通常符合「put 一個字元只新增一份可消耗資源」；若一次轉換可能讓多位 waiters 的不同 predicates 成立，才重新評估是否喚醒全部。判準是 predicate 與 state transition，不是背誦通知函式的固定排名。

## 鎖的粒度與 monitor style

更多 locks 可能降低 contention，讓互不相關的資料同時操作。但 locks 越多，所有權規則、取得順序與狀態切分越複雜，也更容易出現 race 與 deadlock。取得 mutex 本身亦有成本。PDF 將兩端稱為 coarse-grained 與 fine-grained locking。實務方向是在 contention 可接受的前提下使用盡可能少的 locks，並把一把 lock 與一組相關變數綁在一起。

monitor 包含共享資料結構、操作它的一組 methods、一把 mutex，以及一個或多個 condition variables。method 在入口取得 mutex，存取共享資料時始終持有它，返回前釋放；需要等待時，condition variable 暫時釋放同一把 mutex。Java 的 `synchronized` 是 PDF 提到的語言支援例子。

Pipe 是完整 monitor：`buffer`、`count`、`nextPut`、`nextGet` 是共享狀態；`put` 與 `get` 是操作入口；兩者使用同一把 mutex；`charAdded` 與 `charRemoved` 對應兩個 predicates。review 可以直接問「有沒有任何 method 在沒持鎖時碰共享狀態」。

## v4：用 unique_lock 表達最終契約

PDF 最後把 v3 改寫成 `std::unique_lock<std::mutex>`：

```cpp
void Pipe::put(char c) {
    std::unique_lock<std::mutex> lock(mutex);
    while (count == SIZE) {
        charRemoved.wait(lock);
    }
    count++;
    buffer[nextPut] = c;
    nextPut = (nextPut + 1) % SIZE;
    charAdded.notify_one();
}
```

`get()` 對稱地等待 `count > 0`，取出字元後通知 `charRemoved`。這個版本把全部契約放在同一處。`unique_lock` 表示 scope 內的 mutex ownership；while 表示每次醒來後重查 predicate；wait 原子地釋放並重新取得 mutex。所有環形狀態更新都在 critical section；notify 只提示另一類 waiter 狀態可能已改變。

讀完後可用五題檢查 condition-variable 程式。共享狀態是什麼？哪把 mutex 保護它？每種操作的 predicate 是什麼？wait 是否在持鎖的 while 裡？哪次狀態改變需要通知哪類 waiter？

實際 review 時，把這五個答案逐一標在 code 上。若其中一題答不出來，程式即使成功跑過幾次，也還沒有同步正確性的證明。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 5 slides: Locks and Condition Variables](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/5/Lecture5.pdf)
- [cppreference: `std::condition_variable`](https://en.cppreference.com/w/cpp/thread/condition_variable)
- [cppreference: `std::mutex`](https://en.cppreference.com/w/cpp/thread/mutex)
- [cppreference: `std::unique_lock`](https://en.cppreference.com/w/cpp/thread/unique_lock)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
