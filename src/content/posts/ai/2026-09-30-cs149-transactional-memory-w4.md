---
title: "CS149 L17–L18 Transactional memory 與 Written 4：把「這段要原子」交給系統"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, concurrency, hardware, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS149 導讀"
  order: 22
tldr: "粗鎖好寫但慢，細鎖快但容易寫錯。Transactional memory 讓程式設計師只宣告 atomic { }，由系統負責原子性與隔離。CS149 L17 講動機（failure atomicity、composability）與設計空間：資料版本管理分 eager（undo log）與 lazy（write buffer），衝突偵測分 pessimistic 與 optimistic。L18 拆 STM 的執行期資料結構與 McRT 演算法，再講 HTM 怎麼用 cache 的 R/W 位元加上 coherence 協定偵測衝突，最後是 Intel Haswell 的 RTM。Written 4 則把 MSI、LL/SC、鎖與記憶體順序、雙向 linked list 的細粒度鎖串成四題。"
description: "Stanford CS149（Fall 2025）Lecture 17、18 與 Written Assignment 4 導讀：atomic block 與 lock/unlock 的語意差異、TM 的 atomicity／isolation／serializability、eager 與 lazy versioning、pessimistic 與 optimistic 衝突偵測、STM 的 transaction descriptor 與 record、McRT STM、HTM 的 R/W 位元與 TCC、Intel RTM，以及 Written 4 四道計分題與 12 道練習題的主題。"
draft: false
glossary:
  - term: "transactional memory"
    aliases: ["TM", "交易式記憶體"]
    definition: "讓一段記憶體存取像資料庫交易一樣執行的同步機制：commit 時所有寫入一次生效，abort 時完全不留痕跡，commit 前其他處理器看不到中間狀態。"
    context: "CS149 L17–L18 把它當成比鎖更高一層的同步抽象。"
  - term: "eager versioning"
    aliases: ["undo-log versioning"]
    definition: "交易中的寫入直接改記憶體，同時把舊值記在 undo log，abort 時再用 log 還原。"
    context: "L17 的評語：commit 快，abort 慢，而且交易中途 crash 會有容錯問題。"
  - term: "lazy versioning"
    aliases: ["write-buffer versioning"]
    definition: "交易中的寫入先放在 write buffer，commit 時才寫回記憶體，abort 時直接丟掉 buffer。"
    context: "L17 的評語：abort 快、沒有容錯問題，但 commit 比較慢。"
  - term: "HTM"
    aliases: ["hardware transactional memory", "硬體交易式記憶體"]
    definition: "在硬體裡做 transactional memory：用 cache 保存交易中的資料版本，用 cache coherence 協定的請求偵測交易之間的衝突。"
    context: "L18 以 lazy-optimistic 的 HTM 為例，說明 cache line 上的 R/W 位元與兩階段 commit。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs149-transactional-memory-w4-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS149](https://gfxcourses.stanford.edu/cs149/fall25) Fall 2025 版。** 這是 [Stanford CS149 導讀](/posts/ai/2026-09-30-cs149-course-overview)系列第 22 篇，也是最後一篇，接續 [L16 細粒度鎖與 lock-free](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free)。範圍是 Lecture 17「Transactional Memory (Part I)」（2025-12-02）、Lecture 18「Transactional Memory (Part II) + AMA」（2025-12-04），以及 Written Assignment 4（課程首頁標 Dec 3）。

用到的官方材料：

- [L17 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/transactions/17_transactionalmem.pdf)（50 頁，[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/transactions/)）
- [L18 投影片 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/wrapup/18_transactionalmem_A4wu1Q8.pdf)（62 頁，[逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/wrapup/)）
- [Written Assignment 4 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)（47 頁）

Fall 2025 錄影只在 Canvas。官方首頁指向的 2023 年版對應影片是 [Lecture 16: Transactional Memory 1](https://www.youtube.com/watch?v=rFFf3WIJ7BA) 與 [Lecture 17: Transactional Memory 2](https://www.youtube.com/watch?v=Tbk1vnYLQqI)，本文只列為聽講補充，內容以 2025 投影片為準。整門課的存取等級是 **A3**；這兩講投影片與 Written 4 完整公開，缺的是當期錄影與解答。

## 課程影片來源

本文以 Fall 2025 教材為準。官方 Fall 2025 課程頁寫明今年的講課錄影不對外公開，只提供 2023 年版本的 YouTube 播放清單；下列 Fall 2023 錄影是主題相近的相關補充影片，內容可能與 2025 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=rFFf3WIJ7BA
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 16 - Transactional Memory 1
```

```youtube
url: https://www.youtube.com/watch?v=Tbk1vnYLQqI
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 17 - Transactional Memory 2
```

原始影片：[Stanford CS149 I Parallel Computing I 2023 I Lecture 16 - Transactional Memory 1](https://www.youtube.com/watch?v=rFFf3WIJ7BA)、[Stanford CS149 I Parallel Computing I 2023 I Lecture 17 - Transactional Memory 2](https://www.youtube.com/watch?v=Tbk1vnYLQqI)

課程與錄影入口：

- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [官方課程／講次來源](https://gfxcourses.stanford.edu/cs149/fall25/lecture/transactions/)

## 夾在鎖與難處之間

L17 第 4 頁的標題是「Between a Lock and a Hard Place」。鎖迫使你在兩件事之間取捨：並行度（效能）和出現 race 或 deadlock 的機率（正確性）。粗鎖並行度低但容易寫對；像上一講 hand-over-hand 那樣的細鎖並行度高，但容易寫錯。

投影片用 Java HashMap 走一遍這個取捨（第 11–15 頁）：

| 版本 | 優點 | 缺點 |
|---|---|---|
| 原始 `HashMap` | 不需要同步時沒有鎖開銷 | 不是 thread safe |
| Java 1.4 的 synchronized 包裝 | thread safe、好寫 | 一把鎖管全部，擴展差 |
| 每個 bucket 一把鎖 | thread safe、並行度高 | 不需要同步時也要付鎖開銷 |
| 全部包進 `atomic { }` | thread safe、好寫 | 效能取決於工作負載與 atomic 的實作 |

第 16–26 頁用一棵樹說明差別。兩條 thread 分別要改節點 3 和 4，hand-over-hand 鎖會讓它們在共同的祖先節點 1、2 上互相擋路。換成交易，A 讀 1、2、3 寫 3，B 讀 1、2、4 寫 4，沒有讀寫或寫寫衝突，可以同時進行；只有兩者都寫節點 3 時才必須序列化。第 27 頁的圖比較粗鎖、細鎖與 TCC（一個硬體 TM 系統）在 HashMap 與平衡樹上的執行時間。

## atomic 是宣告，不是鎖

第 6 頁把 `lock(); ... unlock();` 換成 `atomic { ... }`，並強調 atomic 是**宣告式**的：你說要什麼（這段要保持原子性），不說怎麼做。系統可以用鎖實作 atomic，但這兩講談的實作是 optimistic concurrency，只有真的發生讀寫或寫寫衝突時才序列化。

第 8 頁定義交易的三個語意：

- **Atomicity**：commit 時所有寫入一次生效；abort 時彷彿交易從未發生。
- **Isolation**：commit 前其他處理器看不到交易的寫入。
- **Serializability**：交易看起來按某個單一順序 commit，但語意不保證是哪個順序。

第 9 頁的說法很好記：coherence 為單一位址維持的那些性質，TM 想為一整組讀寫維持。

### 另外兩個動機

**Failure atomicity**（第 29–30 頁）。用鎖寫 `transfer`，每種例外都要手寫 undo 程式碼，漏掉一種就可能讓副作用外露，甚至讓系統 deadlock。包進 `atomic` 之後，例外發生時交易 abort、記憶體更新全部撤銷，也不會有失敗的 thread 還握著鎖。

**Composability**（第 31–33 頁）。`transfer(A, B)` 先鎖 A 再鎖 B，另一條 thread 同時跑 `transfer(B, A)`，就 deadlock 了。要避免必須制定全系統的鎖順序政策，這又會破壞模組化。用交易的話，最外層的交易定義原子性邊界，`transfer(A,B)` 與 `transfer(B,A)` 自動序列化，`transfer(A,B)` 與 `transfer(C,D)` 則能同時進行。投影片在這裡加了「(in theory)」。

L18 第 3 頁重述 TM 的承諾時，給了一個具體說法：系統支援的交易可以拿到專家手寫細粒度鎖 90% 的好處，只花 10% 的開發時間。L17 第 34 頁同一張投影片的措辭是「大部分好處、少得多的開發時間」。

### 自我檢查：atomic { } ≠ lock() + unlock()

第 35 頁要你一定要懂這個差別：

- 鎖是低階的阻塞原語，本身不提供原子性或隔離。
- 鎖可以拿來實作 atomic，但鎖也有原子性以外的用途，不是所有鎖都能換成 atomic。
- atomic 消除了很多 data race，但程式設計師仍會犯原子性錯誤。第 37 頁的例子是把本該一起執行的「`ptr = A`」與「`B = ptr->field`」拆成兩個 atomic block，中間被另一條 thread 設成 `NULL`。

第 36 頁留了一題思考：兩條 thread 各自在 `synchronized` 裡設自己的 flag，再等對方的 flag。把 `synchronized` 換成 `atomic` 會發生什麼？提示：回想 isolation 的定義。

## 設計空間：兩個問題、三個維度

L17 第 40 頁說 TM 實作要回答兩個問題，L18 再補上第三個維度：

**1. 資料版本管理（data versioning）**

| | Eager（undo log） | Lazy（write buffer） |
|---|---|---|
| 寫入時 | 直接改記憶體，舊值記進 undo log | 寫進 write buffer |
| commit | 快，資料已在記憶體 | 慢，要把 buffer 寫回 |
| abort | 慢，要用 log 還原 | 快，清掉 buffer |
| 容錯 | 交易中途 crash 有問題 | 沒有容錯問題 |

**2. 衝突偵測（conflict detection）**。系統要追蹤每個交易的 read set 與 write set，偵測兩種衝突：A 讀了 B 尚未 commit 的寫入（讀寫衝突），A 和 B 都寫同一位址（寫寫衝突）。

- **Pessimistic（eager）**：每次 load／store 就檢查，由 contention manager 決定 stall 還是 abort。好處是早發現、少浪費工作，還能把一些 abort 變成 stall；壞處是沒有前進保證，某些情況 abort 更多，而且檢查在關鍵路徑上。第 47 頁的 Case 4 就是兩個交易互相 restart、沒有進展，投影片問你怎麼避免這種 livelock。
- **Optimistic（lazy）**：等到 commit 才檢查，衝突時讓正在 commit 的交易優先。好處是有前進保證、可以批次溝通；壞處是晚發現，仍可能有公平性問題。

**3. 偵測粒度**（L18 第 16 頁）：物件級開銷低，但會有 false conflict；欄位／word 級減少 false conflict，開銷較高；cache line 級和硬體 TM 一致，但程式設計師與編譯器都難分析。也可以依型別混用，例如陣列用元素級、其他用物件級。

L18 第 12 頁列出實例，並說最佳設計仍是開放問題：軟體 TM 有 Sun TL2（lazy + optimistic）、Intel STM 等；硬體 TM 有 Stanford TCC（lazy + optimistic）、MIT LTM 與 Intel VTM（lazy + pessimistic）、Wisconsin LogTM（eager + pessimistic，投影片註明和傳統 cache coherence 最容易搭配）。

## STM：編譯器幫你插 barrier

L18 第 13 頁示範軟體 TM 怎麼改寫程式：`atomic` 變成 `tmTxnBegin()`／`tmTxnCommit()`，每個讀寫變成 `tmRd()`／`tmWr()` 呼叫。這些呼叫叫做 STM barrier，負責版本管理、read/write set 追蹤等簿記。同一個函式在交易內外都會用到，所以需要 function cloning 或動態轉譯。

第 14 頁的兩種執行期資料結構：

- **Transaction descriptor（每條 thread 一份）**：read set、write set、undo log 或 write buffer，用於衝突偵測、commit、abort。
- **Transaction record（每份資料一個）**：指標大小的紀錄，shared 時用版本號或共享讀鎖，exclusive 時用指向擁有者的寫鎖。投影片說這和硬體 cache coherence 的做法相同。

<details>
<summary>McRT STM 演算法細節（L18 第 17–21 頁）</summary>

投影片的範例根據 Intel McRT STM：eager versioning、optimistic read、pessimistic write，用 timestamp 追蹤版本。

- 全域 timestamp：有寫入的交易 commit 時遞增。每個交易有自己的 local timestamp，記錄上次驗證時的全域值。
- 32 位元 transaction record：最低位元 0 表示被寫鎖住、1 表示沒鎖；其他位元在沒鎖時存最後一次 commit 的版本號，鎖住時存擁有者的指標。
- **讀**：直接讀記憶體，檢查沒被鎖且版本 ≤ local timestamp，否則驗證整個 read set，再加入 read set。
- **寫**：驗證、拿鎖、加入 write set、寫 undo log、原地寫入。
- **commit**：全域 timestamp 原子地加 2（最低位元留給寫鎖）；若舊的全域值大於 local timestamp，先驗證 read set；最後對 write set 逐一放鎖並把版本設成新的全域值。

第 20–21 頁用 foo 複製到 bar 的例子走一遍：另一個交易必須讀到 bar 全是舊值或全是新值，不能一半一半。

</details>

第 23 頁列出 STM 的挑戰：barrier 的開銷、function cloning、穩健的 contention management，以及記憶體模型（strong 或 weak atomicity）。第 24–27 頁說明把整塊 barrier 拆成 `txnOpenForWrite`、`txnLogObjectInt` 這類細項後，編譯器就能看見並消除重複的簿記。第 28 頁留了一道練習：在 optimistic read、pessimistic write、eager versioning 的 STM 下，`obj.f1 = 42` 需要哪些步驟。

## HTM：讓 cache 做版本管理，讓 coherence 做衝突偵測

第 29–30 頁說明為什麼需要硬體：STM 每條 thread 有 2 到 8 倍的 barrier 開銷；單執行緒實測比循序版慢 1.8 到 5.6 倍，大部分時間花在讀 barrier 與 commit，因為多數程式讀的比寫的多。第 31 頁把硬體支援分三類：硬體加速的 STM（保留軟體 barrier）、純硬體 TM（沒有軟體 barrier）、在兩者間切換的 hybrid TM。

HTM 的核心想法（第 32–33 頁）：

- **版本管理放在 cache**：cache 當 write buffer 或 undo log，每條 line 多兩個位元，R 表示在 read set、W 表示在 write set。commit 或 abort 時一次清掉所有位元。
- **衝突偵測靠 coherence 請求**：看到別人對 W line 的共享讀請求是讀寫衝突；看到別人對 R line 的獨佔請求是寫讀衝突；看到別人對 W line 的獨佔請求是寫寫衝突。
- 交易開始時還要對暫存器做 checkpoint，abort 時才能還原。

第 34–41 頁用 lazy-optimistic 設計走一遍 `Xbegin; Load A; Load B; Store C ⇐ 5; Xcommit`。commit 分兩階段：先對 write set 的 line 取得獨佔權，再一次清掉 R/W 位元，write set 就變成一般的 dirty 資料。若別的核心 commit 時寫了 A，這個獨佔請求撞上本地 read set 裡的 A，本地交易 abort：丟掉 write set、清位元、還原暫存器。第 39 頁問了一個好問題：store 時為什麼不是直接把 line 載入獨佔狀態？

第 42 頁的結果：HTM 比 STM 快 2 到 7 倍，單執行緒時與循序版相差 10% 以內，且隨處理器數有效擴展。

第 44–48 頁是 TCC（Transactional Coherence and Consistency）的練習：把 TM 本身當成 coherence 機制，所有程式永遠都在交易裡。題目給四個交易，要你在 lazy、optimistic、每步只能一個 commit 的假設下排出最少步數。

最後，第 49 頁介紹 Intel Haswell 的 restricted transactional memory：`xbegin`（帶一個 abort 時跳去的 fallback 位址，例如改走 spin lock）、`xend`、`xabort`，read/write set 追蹤在 L1 cache。處理器可能因許多原因自動 abort，例如 read/write set 裡的 line 被逐出，而且不保證前進，所以 fallback 路徑是必要的。

## L18 後半：課程收尾

L18 第 51 頁之後是整門課的收尾與 AMA。第 55–56 頁重述課程的主線：找出平行性、有效排程（負載平衡、克服頻寬、延遲、同步的通訊限制）、利用 locality，以及吞吐導向的硬體與幫程式寫得有效率的抽象（data-parallel、functional parallelism、transactions、tasks、SPMD）。第 58 頁推薦的後續課程有 CS 217（Hardware Accelerators for Machine Learning）、CS 348K（Visual Computing Systems）與 CS/EE 282（Computer Systems Architecture）。

## Written 4：四道計分題

Written 4 的 PDF 有四道計分題，各 25 分；Problem 1、2 依正確性計分，Problem 3、4 只看努力程度。以下只寫題目在練什麼，不寫解答。

| 題目 | 在練什麼 | 對應講次 |
|---|---|---|
| 1. MSI Coherence Protocol Warmup | P0、P1 一連串 load／store 後，填出 X、Y 兩條 line 在各 cache 的狀態 | [L14 cache coherence](/posts/ai/2026-09-30-cs149-cache-coherence) |
| 2. Load Linked / Store Conditional and Cache Coherence | 用 LL/SC 寫的 read-write lock；A 小題比較它和 MSI 保證讀寫互斥的方式有何根本不同，B 小題填三顆處理器執行 `read_unlock` 時的匯流排交易與 cache 狀態表 | L14、L16 |
| 3. Coherence, Consistency, and Locks | A：CAS 鎖在 MSI 系統上，為什麼持有鎖的處理器不一定是 cache 裡握著 M 狀態 line 的那一顆；B：在同時放寬 write-after-write 與 read-after-write 順序的機器上，為什麼 thread 2 拿到鎖後可能看到 x=0 | L15、L16 |
| 4. Two threads + a doubly Linked List | 排序雙向 list，一條 thread 從頭插入、一條從尾插入、沒有鎖；判斷哪些插入組合會出錯，再換成 hand-over-hand 鎖看會出什麼新問題，最後用 `trylock` 在不重新走訪的限制下修好 | L16 |

Problem 4 的 D 小題限制很具體：插入時要握住新節點前後兩個節點的鎖，不能從頭重走 list，但不必擔心 livelock。題目的兩個提示值得先讀：list 只有插入，指標不會憑空消失；沒握任何鎖的 thread 無法確定上次看過之後 list 變了什麼。

PDF 後面還有 12 道 PRACTICE PROBLEM，主題包括另一題 MSI 狀態表、struct 欄位造成的 false sharing、cache coherence 與 false sharing、ISPC `sinx` 的 coherence、hand-over-hand 的 concurrent linked list、兩種 `atomicMin` 實作、Fine Grained Synchronization、圖節點上的鎖、hash table 平行化，以及把鎖放在邊上的 concurrent 二元搜尋樹。

**怎麼做**：先做 Problem 1 的 MSI 表格，錯了就回去看 L16 第 16 頁那張逐步示範的投影片；再做 Problem 4 的 A、B 小題，自己畫出兩條 thread 交錯時的指標狀態。Written 4 沒有公開解答，想確認答案，可以寫個小程式讓兩條 thread 大量交錯插入，檢查 `next` 與 `prev` 是否一致。

## 這一篇可以確認與不能確認的

可以確認：L17、L18 投影片與 Written 4 PDF 的內容，課程首頁的講次日期與 Written 4 標示的日期。不能確認：Fall 2025 課堂上的口頭補充與 AMA 內容（錄影不公開）；投影片效能圖的具體數值（本文只引用投影片以文字寫出的數字）；Written 4 的解答與評分細節（未公開）。Written 4 的 MSI 狀態圖上印著「Stanford CS149, Fall 2020」，是沿用舊圖，本文不另作推論。

延伸閱讀：OS 角度的鎖與 deadlock，見 [CS111 Lecture 7：Deadlock](/posts/learning/2026-08-22-stanford-cs111-lecture-07-deadlock)。

系列導覽：上一篇 [L16 細粒度鎖與 lock-free](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free)｜本篇是系列最後一篇｜[系列總覽](/posts/ai/2026-09-30-cs149-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Fall 2023 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。

## 參考資料

- [Stanford CS149 Fall 2025 課程首頁與講次表](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 17: Transactional Memory (Part I)（投影片 PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/media/transactions/17_transactionalmem.pdf)
- [Lecture 17 逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/transactions/)
- [Lecture 18: Transactional Memory (Part II) + Course Wrap Up（投影片 PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/media/wrapup/18_transactionalmem_A4wu1Q8.pdf)
- [Lecture 18 逐頁網頁版](https://gfxcourses.stanford.edu/cs149/fall25/lecture/wrapup/)
- [Written Assignment 4（PDF）](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)
- [CS149 2023 Lecture 16 錄影：Transactional Memory 1（補充材料）](https://www.youtube.com/watch?v=rFFf3WIJ7BA)
- [CS149 2023 Lecture 17 錄影：Transactional Memory 2（補充材料）](https://www.youtube.com/watch?v=Tbk1vnYLQqI)
- [CS149 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
