---
title: "CS149 L16 細粒度鎖與 lock-free：從 test-and-set 到 ABA 問題"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, concurrency, performance, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 21
tldr: "CS149 L16 分三段：先用 cache coherence 的眼光看鎖怎麼實作（test-and-set、test-and-test-and-set、ticket lock、CAS、LL/SC），再用一條排序 linked list 示範從一把大鎖改成 hand-over-hand 細粒度鎖，最後介紹 lock-free：單一生產者單一消費者佇列、用 CAS 寫的 stack、ABA 問題與 hazard pointer。投影片的結論很務實：在只有你的程式佔用機器的情境下，寫得好的鎖版本常常一樣快，而且好寫得多；lock-free 的價值在於執行緒可能被搶佔、page fault 的系統。"
description: "Stanford CS149（Fall 2025）Lecture 16 導讀：deadlock／livelock／starvation，test-and-set 鎖的 coherence 流量，test-and-test-and-set 與 ticket lock，用 CAS 組出 atomic_min 與鎖，LL/SC 與 C++11 atomic，排序 linked list 的 hand-over-hand locking，blocking 與 lock-free 的定義，SPSC 佇列、lock-free stack、ABA 問題、DCAS 與 hazard pointer。"
draft: false
glossary:
  - term: "hand-over-hand locking"
    aliases: ["lock coupling", "手遞手鎖"]
    definition: "走訪 linked list 時，先鎖住下一個節點，再放掉目前的節點，任何時刻最多握兩把相鄰的鎖。"
    context: "CS149 L16 用它把排序 linked list 從一把全域鎖改成每個節點一把鎖，讓不同位置的操作可以同時進行。"
  - term: "ABA problem"
    aliases: ["ABA 問題"]
    definition: "執行緒讀到位址 A，準備用 CAS 更新；期間別的執行緒把 A 移走又放回來，CAS 看到的值一樣而成功，但資料結構其實已經變了。"
    context: "L16 用 lock-free stack 示範：CAS 成功把 top 設成已經不在 stack 裡的節點，導致節點遺失。"
  - term: "lock-free"
    aliases: ["無鎖"]
    definition: "非阻塞演算法的一種保證：任何時刻總有某個執行緒能繼續前進（systemwide progress），但不保證每個執行緒都不會餓死。"
    context: "L16 的定義；對比使用鎖的演算法，鎖的持有者被換下 CPU 時，其他執行緒全部卡住。"
  - term: "hazard pointer"
    definition: "每個執行緒公告自己正在存取的節點；要釋放節點的執行緒先把它放進待刪清單，確認沒有任何 hazard pointer 指向它才真正 delete。"
    context: "L16 標為進階主題，用來解決 lock-free stack pop 時讀到已被釋放記憶體的問題。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free-en)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 21 篇，接續 [L15 同步實作與記憶體一致性](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency)，範圍是 Lecture 16「Fine-Grained Locking and Lock-Free Programming」（2025-11-20）。

用到的官方材料是 [L16 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf)（66 頁，另有[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/finegrainedsync/)）。投影片封面的完整標題是「Implementing Locks, Fine-Grained Synchronization, and (a short intro to) Lock-Free Programming」，所以鎖的實作也在這一講。Fall 2025 錄影只在 Canvas，官方首頁指向的 2023 年版對應影片是 [Lecture 13: Fine-Grained Synchronization and Lock-Free Programming](https://www.youtube.com/watch?v=GA1ObImqaMo)，本文只把它列為聽講補充，內容以 2025 投影片為準。整門課的存取等級是 **A3**；這一講投影片完整公開，缺的是當期錄影。

Part 5 這幾篇和 AI 沒有直接關係，但你寫的每個 thread pool、每個多執行緒 runtime 都踩在這些原語上。[PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling) 的 task queue 就是一個要被多條 thread 同時存取的共享資料結構。

## 課程影片來源

本文以 Fall 2025 教材為準；下列 Fall 2023 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=GA1ObImqaMo
title: CS149 2023 Lecture 13 錄影：Fine-Grained Synchronization and Lock-Free Programming（補充材料）
```

原始影片：[CS149 2023 Lecture 13 錄影：Fine-Grained Synchronization and Lock-Free Programming（補充材料）](https://www.youtube.com/watch?v=GA1ObImqaMo)

課程與錄影入口：

- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/finegrainedsync/)

## 先分清楚三種「卡住」

投影片第 3 頁先定義三個詞，並註明 deadlock 與 livelock 是正確性問題，starvation 比較接近公平性問題：

| 狀態 | 投影片的定義 | 例子 |
|---|---|---|
| Deadlock | 還有操作沒完成，但沒有任何操作能前進 | 兩條 thread 互相往對方已滿的 work queue 塞工作 |
| Livelock | 系統一直在執行操作，但沒有 thread 取得有意義的進展 | 操作不斷 abort 再重試 |
| Starvation | 系統整體有進展，但某些 process 一直沒有 | 黃車必須讓綠車先走，綠車不斷就一直等 |

第 8 頁列出 deadlock 的四個必要條件：mutual exclusion、hold and wait、no preemption、circular wait。後面判斷 hand-over-hand 為什麼不會 deadlock，靠的就是這張表。

## 鎖怎麼做：每一次嘗試都是一次寫入

第 15–16 頁先複習 MSI 協定，接著才講鎖。順序是刻意的：鎖的效能問題幾乎都是 cache coherence 流量問題。

### test-and-set：簡單，但流量很大

`ts R0, mem[addr]` 原子地把記憶體讀進暫存器，如果是 0 就寫成 1。拿鎖就是不斷 `ts`，直到讀回 0。問題在於 test-and-set 對 coherence 協定來說永遠是寫入：每次嘗試都發出 `BusRdX`，把其他 cache 的那條 line 全部 invalidate。第 19 頁的時序圖裡，P1 握著鎖的整段時間，P2、P3 不停地互相搶那條 cache line。

第 21 頁的實驗圖（出自 Culler、Singh、Gupta 的教科書）顯示，處理器越多，單純取得與釋放鎖的時間越長，因為連放鎖的人都得先搶到 interconnect。

第 22 頁列出好鎖的五個指標：低延遲、低 interconnect 流量、可擴展、低儲存成本、公平。簡單 test-and-set 的評語是：低競爭時延遲低，流量大，擴展差，儲存只要一個 int，完全不管公平。

### test-and-test-and-set：先讀，再搶

改法是先用一般的讀取在自己的 cache 裡 spin，看到鎖被釋放才真的做 test-and-set：

```c
void Lock(int* lock) {
  while (1) {
    while (*lock != 0);              // 在本地 cache 讀，不產生匯流排流量
    if (test_and_set(*lock) == 0)    // 鎖看起來空了，才去搶
      return;
  }
}
```

第 25 頁的分析：無競爭時延遲略高（多一次讀），但流量少很多，每次釋放鎖時每個等待者只被 invalidate 一次。儲存成本不變，公平性依然沒有。

### ticket lock：解決「一放鎖大家一起衝」

test-and-set 家族的共同問題是放鎖那一刻所有等待者同時去搶。Ticket lock 像銀行抽號碼牌：`next_ticket` 用 atomic increment 發號碼，`now_serving` 叫號，等待者只需要讀。第 26 頁的結論是每次釋放只造成一次 invalidation，而且天然照抽號順序拿鎖。

### CAS、LL/SC 與 C++11 atomic

第 27 頁列出 CUDA 提供的 atomic 操作（`atomicAdd`、`atomicCAS` 等）。第 28 頁出了一個練習：只用 `atomicCAS` 組出 `atomic_min`。寫法是讀舊值、算新值，用 CAS 確認舊值沒被別人改過，失敗就重來。第 29 頁用 CAS 寫鎖，並問為什麼「先讀再 CAS」的版本在競爭下比較快，答案和 test-and-test-and-set 相同。

第 30 頁介紹 load-linked／store-conditional：這是一對指令，SC 只在 LL 之後沒有任何處理器寫過該位址時才成功，ARM 上對應 `LDREX`／`STREX`。投影片留了一個問題給你：在 cache coherent 的處理器上怎麼實作 LL/SC？這題在 [Written 4](/posts/ai/2026-09-30-cs149-transactional-memory-w4) 的 Problem 2 會再出現。

第 31 頁收在 C++11 的 `atomic<T>`：它提供整個物件的原子讀、寫、read-modify-write，預設記憶體順序是 sequential consistency，`is_lock_free()` 可以查實作到底有沒有用 mutex。

## 用鎖：一條排序 linked list 的三個版本

第 33 頁的範例是單向、排序的 linked list，只有 `insert` 和 `delete`。第 34–36 頁示範不加同步會怎樣：兩條 thread 同時插入 6 和 7，算出同一組 `prev`／`cur`，其中一個插入直接消失；一邊插入 6、一邊刪除 10，新節點可能接在已被刪除的節點後面。

**版本一：一把鎖保護整個 list。** 第 38 頁的評語：正確性容易做到，但所有操作被序列化，可能限制整個應用的平行度。

**版本二：hand-over-hand locking。** 每個節點帶一把鎖，走訪時先鎖下一個節點，再放掉上一個（第 40 頁配了一張《American Ninja Warrior》的照片當比喻）。第 45 頁的程式裡，`insert` 與 `delete` 都先鎖 list 再鎖第一個節點，然後一路「鎖 next、放 old_prev」往前推。

第 46 頁整理這個設計的帳：

- **收益**：不同位置的操作可以同時進行，減少全域鎖的競爭。
- **難處**：何時需要互斥不好判斷；投影片要你自己回答「為什麼一眼就知道這段程式不會 deadlock」。提示是回頭看四個必要條件：所有 thread 都從頭往尾、按同一順序拿鎖，circular wait 不可能成立。
- **成本**：每走一步都要拿鎖（走訪變成會寫記憶體），每個節點多一把鎖的儲存。

投影片接著問有沒有折衷：用一把鎖保護一段連續節點，犧牲一點平行度換較低的開銷。這和 [L5](/posts/ai/2026-09-30-cs149-work-distribution-scheduling) 選 task granularity 是同一個取捨。第 47 頁另留一個課後練習：為二元搜尋樹寫出支援 insert 與 delete 的細粒度鎖版本。

## Lock-free：不拿鎖，改用 CAS 檢查「有沒有人動過」

### 為什麼鎖是 blocking 的

第 49 頁定義 blocking：一條 thread 可以無限期阻止其他 thread 完成操作。例如 thread 0 拿了某個節點的鎖，接著被 OS 換下、crash，或只是遇到 page fault，其他 thread 就都動不了。投影片特別強調：不管鎖是 spin 還是 preemption 實作，用鎖的演算法都是 blocking。

第 50 頁定義 lock-free：非阻塞，而且保證**某個** thread 一定能前進。這個定義不防止個別 thread 餓死。

### 單一生產者、單一消費者佇列

第 51 頁的 bounded queue 是最簡單的 lock-free 結構：一個陣列，`head` 由消費者推進，`tail` 由生產者推進，兩條 thread 從不互相等待，佇列滿時 push 失敗、空時 pop 失敗。第 52–53 頁的 unbounded 版本（出處標為 Dr. Dobb's Journal）多一個 `reclaim` 指標：節點的配置與釋放都由生產者執行，push 時順便回收消費者已經走過的節點。

這幾頁都有星號註腳：先假設 sequentially consistent 的記憶體系統，或有適當的 memory fence，或使用 C++11 `atomic<>`。這就是 [L15](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency) 記憶體一致性的用武之地。

### Lock-free stack 與 ABA

第 54 頁的 stack：push 和 pop 都是「讀 `top`、準備新值、CAS 換上去，失敗就重來」。投影片點出它和細粒度鎖的差別：細粒度鎖鎖住資料結構的一部分；這裡的 thread 完全不持有鎖。

第 55 頁的 ABA 情境（A、B、C、D 是節點位址，不是值）：

1. Thread 0 開始 pop，讀到 `old_top = A`、`new_top = B`，還沒 CAS。
2. Thread 1 pop 走 A，push D，再把 A push 回去。現在 stack 是 A → D → B → C。
3. Thread 0 的 CAS 比對 `top == A`，成功，把 `top` 設成 B。D 從此遺失。

<details>
<summary>三個補救方式（第 56–59 頁）</summary>

- **計數器 + DCAS**：stack 多一個 `pop_count`，pop 時用 double compare-and-swap 同時比對 `top` 和計數器。投影片補充 x86 有 `cmpxchg8b`／`cmpxchg16b` 這種「double-wide」CAS，不完全等於 DCAS，但只要讓 `top` 和計數器在記憶體中相鄰，就能用一條寬 CAS 做到。
- **小心的節點配置／重用策略**：第 56 頁提到也能用這個方向解決 ABA。
- **Hazard pointer**：第 58 頁指出另一個問題，pop 讀 `old.top->next` 時，那個節點可能已被別的 thread 釋放。第 59 頁（標為進階主題）的做法是每條 thread 公告自己正在讀的節點，要刪的節點先進 retire list，超過門檻時只刪沒有被任何 hazard pointer 指著的節點。

</details>

第 60 頁的 lock-free linked list 插入沒有拿鎖的開銷，也沒有每個節點一把鎖的儲存成本，但前提是 list 上只有插入。第 61 頁說明加入刪除會讓事情複雜許多：B 被刪除的同時有人在 B 後面插入 E，結果 B 指向 E，B 卻已不在 list 裡。投影片給了兩篇延伸閱讀：Harris 2001 與 Fomitchev 2004。

## 什麼時候真的需要 lock-free

第 62 頁引用 Hunt 2011 的實驗，比較 lock-free、細粒度鎖與 pthread mutex 在佇列與 linked list 上的執行時間。第 63 頁的結論值得原樣記住：

- 在這門課的情境裡，你通常假設機器上只有你的程式在跑（科學計算、圖學、機器學習、資料分析都是這樣）。這時寫得好的鎖版本可以和 lock-free 一樣快甚至更快，而且簡單得多。
- 鎖會出問題的情境是 thread 很多、而且 critical section 裡可能發生 page fault 或被搶佔的系統，例如資料庫和 web server。priority inversion、convoying、在 critical section 裡 crash 這些問題通常在 OS 課討論。

第 64 頁的總結補了兩句容易忽略的話：lock-free 在現代 relaxed consistency 硬體上依然需要適當的 memory fence；lock-free 也沒有消除競爭，競爭激烈時 CAS 會一直失敗、一直重試。

**怎麼做**：打開第 54 頁的 lock-free stack，在紙上照第 55 頁的時序跑一遍 ABA，然後自己寫出加了 `pop_count` 的 pop。能說清楚為什麼計數器讓第三步的 CAS 失敗，就代表你抓到了這一講的核心。

## 伏筆：把 CAS 的角色一般化

第 65 頁用一個問答收尾：lock-free 實作裡的 CAS 在做什麼？答案是判斷在這條 thread 操作到一半時，有沒有別的 thread 改過資料結構。下一講的 transactional memory 把這個想法一般化：讓系統推測一段操作能順利完成，被別人改動時就 abort。

第 66 頁列了延伸閱讀：Michael & Scott 1996 的多讀多寫 lock-free 佇列、Harris 2001、Michael Sullivan 的 [RMC compiler](https://github.com/msullivan/rmc-compiler)，以及兩篇部落格文章。

## 這一篇可以確認與不能確認的

可以確認：L16 投影片 PDF 的內容、課程首頁上的講次日期與講題摘要。不能確認：Fall 2025 課堂上的口頭補充（錄影不公開）；第 62 頁實驗圖的具體數值（本文沒有讀圖取數）；2023 年錄影與 2025 投影片的逐頁差異。本文沒有依影片內容寫作。

延伸閱讀：OS 角度的鎖實作與 deadlock，可以讀 [CS111 Lecture 6：實作鎖](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks)與 [CS111 Lecture 7：Deadlock](/posts/learning/2026-08-22-stanford-cs111-lecture-07-deadlock)。

系列導覽：上一篇 [L15 同步實作與記憶體一致性](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency)｜下一篇 [L17–L18 Transactional memory + Written 4](/posts/ai/2026-09-30-cs149-transactional-memory-w4)｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁與講次表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 16: Fine-Grained Locking and Lock-Free Programming（投影片 PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf)
- [Lecture 16 逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/finegrainedsync/)
- [CS149 2023 Lecture 13 錄影：Fine-Grained Synchronization and Lock-Free Programming（補充材料）](https://www.youtube.com/watch?v=GA1ObImqaMo)
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Written Assignment 4（PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)
- [Michael Sullivan：RMC compiler（投影片列出的延伸閱讀）](https://github.com/msullivan/rmc-compiler)
