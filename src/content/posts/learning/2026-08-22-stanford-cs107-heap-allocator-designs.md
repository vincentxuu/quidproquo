---
title: "Stanford CS107 Lecture 22：Explicit Free List 為何同時活在兩種順序裡"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, memory-management, malloc, free-list]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 23
tldr: "CS107 第 22 講把 implicit free list 改成 explicit free list：搜尋只拜訪可重用 blocks，但每塊 free memory 同時具有實體相鄰順序與邏輯鏈結順序，unlink、coalesce、reinsert 必須共同維持不變量。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 22：implicit 與 explicit free list、payload 內嵌 links、placement、unlink、splitting、physical adjacency、coalescing 與雙重不變量。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-heap-allocator-designs-en)

Lecture 21 的 implicit free list 讓每個 block header 記錄 size 與使用狀態，再靠 size 沿 heap 逐塊走訪。它簡單、空間成本低，卻有一個結構性問題：尋找可重用空間時，連正在使用的 blocks 也必須逐一跨過。Lecture 22 的 explicit free list 改變搜尋集合，只把 free blocks 串起來。

這個優化並非「多放一個 next pointer」就結束。Free block 從此同時屬於兩種順序：它在 heap 位址上有物理左右鄰居，也在 free list 中有邏輯前後節點。Coalescing 依賴前者，搜尋與移除依賴後者。最危險的錯誤不是某一行 pointer syntax，而是更新了一種關係，忘了另一種關係仍把舊節點當成有效。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 22，2026-02-27
- 官方標題：Managing the Heap, Take II
- 講者：課程 syllabus 列 Jerry Cain；本講 PDF 沒有另列 guest speaker
- 已讀材料：官方 calendar、完整官方投影片、CS:APP Malloc Lab、Doug Lea allocator 設計文章，以及 glibc malloc internals 說明
- 材料缺口：Canvas 錄影與 AFS lecture code 未公開；本文依投影片圖解重建資料結構，不聲稱逐字重現現場 demo

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講列為 heap management 第二部分。完整 agenda 是 implicit list 成本、explicit free list、把 links 放進 free payload、配置時搜尋與 unlink、split 後 remainder 的處理、物理相鄰與邏輯鏈結的差異，以及 unlink／merge／reinsert 的 coalescing 案例。本文只比較投影片涵蓋的設計，不把後續課程或 production allocator 的額外機制倒灌成本講內容。

## Implicit list 的成本來自搜尋集合太大

Implicit list 的下一塊由 `current + block_size` 得到，因此 allocated 與 free blocks 都在同一條實體走訪路徑。要找 64-byte free block，實作可能先跨過幾百個 live blocks。這些 header 對維持 heap 邊界有用，對本次「哪個洞可重用」卻沒有候選價值。

假設 heap 有一千個 blocks，只有十個 free。Implicit search 的成本仍可能接近一千次 header inspection；explicit list 理想上只拜訪十個候選。這不表示 explicit search 必為常數時間，而是複雜度改以 free-block count 為主要尺度。若 heap 幾乎全空，兩者候選數差距便縮小。

[CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)把 throughput 與 utilization 一起評估，提醒我們縮短搜尋不等於整體勝利。新增 links 擴大 minimum free block，頻繁 unlink/reinsert 也有成本。設計判斷必須回到 trace：live blocks 多而 holes 少時 explicit list 可能特別有利；大量微小 blocks 則可能被 metadata 壓低利用率。

今晚可以替 allocator 加兩個 counter：每次 allocation 看過幾個實體 blocks、看過幾個 free candidates。用同一 trace 比較，而不是只量整支程式時間。這能把「慢」定位為搜尋集合、coalescing 或其他路徑。

## Free payload 可以保存 links，因為 client 已放棄使用權

Allocated block 的 payload 屬於 client，allocator 不能拿來放 next pointer。`free(ptr)` 之後，client 的物件 lifetime 結束，再讀寫該 payload 都不合法；allocator 因而能把前幾個 machine words 改作 `prev` 與 `next`。

```text
allocated block: [header | client bytes................]
free block:      [header | prev | next | unused space..]
```

這是 space reuse，不是 metadata 免費。Free block 必須大到容納 header 和 links，因此 split remainder 有更高的 minimum size。若 64-bit 環境使用兩個 pointers，加上 header 與 alignment，過小 remainder 不能成為合法 free-list node，只能留在 allocated block 形成 internal fragmentation。

同一 bytes 在生命週期切換時具有不同意義。Allocation 從 list 取出 block 後，client 可覆寫 payload，allocator 不得再期待其中 links 存活；release 時 allocator 寫入 links，client 不得再期待舊內容保留。Use-after-free 之所以危險，除了可能讀到新物件，也可能把 allocator 的鏈結當舊資料，甚至破壞 list。

[C17 草案](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)把已釋放 pointer 的值列為 indeterminate，並規定存取已結束 lifetime 的物件不具有效契約。Allocator 能重用 payload，正建立在這條 client 責任上；不是因為 memory「被清空」。

## 一塊 free memory 同時有物理順序與邏輯順序

物理順序由位址決定：block B 右邊緊接 block C，這件事不因 free-list policy 改變。邏輯順序由 `prev`／`next` 決定：B 可以連到 heap 另一端的 H。兩種鄰居回答不同問題。

```text
physical: [A used][B free][C free][D used][E free]
logical:  head -> E -> B -> C -> NULL
```

B 與 C 能 coalesce，因為實體相鄰且都 free；E 在 list 上緊接 B，卻不能與 B 合併。反過來，想從 free list 移除 B 時，要更新 E 與 C 的邏輯 links，而不是改動 A 或 C 只因它們在地址附近。

除錯時最好把兩種圖分開印。Heap dump 依地址列每個 header、size、state；free-list dump 從 head 走 links，列 node 地址。把兩者畫成一張箭頭圖，很容易誤把 next free node 當成 next physical block。

核心不變量包括：每個 list node 都位於 heap 內且標為 free；每個 free block 恰好出現在 list 一次；`x->next->prev == x` 與 `x->prev->next == x` 在非 null 時成立；實體 blocks 不重疊且 sizes 覆蓋整個管理區間。只檢查 list 能走到底，抓不到遺失節點；只檢查 heap 邊界，也抓不到同一節點被插入兩次。

## List ordering 是 policy，不是物理事實

Explicit list 可以用 LIFO：剛釋放的 block 插在 head，操作短、容易維持。也可按地址排序，讓鄰近 free blocks 在 list 中靠近，可能幫助某些 coalescing 或 locality 操作。還可按 size 排序或分 bins，加速接近大小的搜尋。

每種 ordering 都轉移成本。LIFO insertion 是常數步驟，但 first-fit 的結果受最近釋放順序影響。Address order 插入要找位置，卻讓走訪呈現 heap 方向。Size order 有利找 fit，更新與同尺寸 tie-breaking 更複雜。投影片的比較重點是 throughput 與 utilization，不能從「sorted」推導全域更好。

[Doug Lea 的 allocator 設計文章](https://gee.cs.oswego.edu/dl/html/malloc.html)同時討論時間、空間、locality、fragmentation 與 tunability。Production designs 常用多個 bins，不代表教學用單一 explicit list 錯；單一 list 把基本不變量暴露得更清楚，適合先驗證正確性，再逐步增加 policy。

比較 ordering 時應固定 placement 與 coalescing 規則。若同時改三項，就無法知道 high-water mark 變化來自排序、split 或 merge。Allocator 實驗最怕把「設計組合」結果誤歸因到其中一個漂亮名詞。

## Allocation 是 find、unlink、必要時 split

搜尋先沿 logical `next` 找到足夠大的 free node。找到後不能只把 header 改成 allocated，因為 list 仍會指向它；client 一寫 payload，`prev`／`next` 就被覆寫，下一次 traversal 會跟著任意 bytes 跳走。正確步驟先 unlink，再交給 client。

```c
static void remove_free(block *b) {
    if (b->prev != NULL) b->prev->next = b->next;
    else free_head = b->next;
    if (b->next != NULL) b->next->prev = b->prev;
}
```

四種邊界都要覆蓋：唯一節點、head、tail、中間節點。唯一節點移除後 head 應為 null；移除 head 要更新新 head 的 prev；移除 tail 要清除前節點 next。把這些 cases 寫成 table-driven tests，比等隨機 trace 撞到可靠。

若 block 過大，unlink 原節點後再 split。Allocated prefix 不回 list；free remainder 必須建立完整 header 與 links，然後依 policy 插入一次。不能讓原 node 與 remainder 同時代表重疊空間，也不能因沿用舊 links 就跳過鄰居的反向更新。

另一種實作順序可以先算 layout 再 unlink，但對外可見的不變量要相同。最安全的思考方式是 transaction：操作前結構合法；局部保存必要鄰居；操作後 heap partition 與 free membership 都合法。中間步驟不可呼叫會走訪尚未修復 list 的 helper。

## `free` 是狀態轉換、插入與重複釋放防線

`free(ptr)` 先由 payload 回到 header，確認 pointer 符合 allocator contract，再把 block 標為 free。之後要 coalesce 並插入 list；究竟先插入再合併，或先合併再插入，必須有一致規則，不能讓同一實體範圍同時以多個 nodes 存在。

教學 allocator 有時假設 client 永不 double-free，production allocator 仍可能加入檢測或 hardening。若同一 block 插入兩次，list 可能形成 cycle，或兩個 allocation 回傳重疊 payload。這不只是「多釋放一次」的局部錯誤，而是破壞全域 ownership bookkeeping。

`free(NULL)` 依 C contract 是 no-op；任意 interior pointer、stack pointer 或已釋放 pointer 都不是合法輸入。Debug build 可以檢查地址是否在 heap、alignment 是否正確、header state 是否 allocated。這些檢查不把未定義行為變合法，但能把晚一步的 list corruption 提前成可定位錯誤。

插入前應清楚誰負責初始化 links。若 helper 假設 `prev`、`next` 已為 null，而 payload 還留著 client bytes，條件判斷可能使用垃圾值。把 node 初始化與掛接集中在一個 helper，能縮小不變量暫時失效的區域。

## Coalescing 的核心流程是 unlink、merge、reinsert

釋放 B 後，先用實體 metadata 判斷左、右 blocks 是否 free。若鄰居已 free，它們必已在 explicit list 中；合併前要先 unlink。接著計算新範圍與總 size，寫入合併後 metadata，最後只把新 block 插回一次。

```text
before: list -> L -> B -> R -> ...   (logical order only)
heap:   [L free][B free][R free]

after:  list -> M -> ...
heap:   [M = combined free block]
```

實際 logical order 未必是 L、B、R；圖只是顯示三者各自原本可能在 list。若只改 combined header，舊 L 或 R node 仍留在 list，未來 allocation 會把合併區間的中間位置當獨立 block。若先覆寫鄰居 links 再 unlink，就失去找到 logical neighbors 的資訊。因此通常先保存並移除 nodes，再重建 merged node。

四個實體案例要各自測試：左右都 allocated；只有右 free；只有左 free；左右都 free。第一種只是把 B 插入；第二種起點仍是 B；第三種 merged 起點要改成左鄰；第四種移除兩個既有 free nodes，再插入一個跨三塊的 node。每種都要檢查 heap size 守恆與 list membership。

Coalescing 後 client 舊 pointer 不該再使用。Merged block 的 node 地址通常是最低位址 header，不是最後被 `free` 的 payload。把「剛傳入的 ptr」永久當合併節點，會在左鄰 free 的案例寫到範圍中間。

## 找左右鄰居需要 physical metadata，不靠 free-list links

右鄰仍可由 `current + size` 找到。左鄰若只有 headers，可能得從 heap 起點掃到 current；加入 footer 或 boundary tag，便可從 current 前方讀出 previous size。Footer 增加每塊 metadata，換得近乎固定步驟的左向定位。

Boundary tag 必須和 header 一致。Split、merge、allocation state 更新若只改其中一端，後續向左走會讀到 stale size。Debug checker 應逐塊比較 header/footer size，並確認下一塊起點等於目前起點加 size。

有些設計只在 free blocks 放 footer，或把 previous-allocated bit 塞進下一個 header，以降低 allocated block overhead。這些是同一取捨的延伸，不是免費技巧：狀態轉換時要同步更多 bits。Lecture 22 的雙序觀念仍適用——用 physical metadata 找鄰居，用 logical links 管候選集合。

[glibc malloc internals](https://sourceware.org/glibc/wiki/MallocInternals)展示 production allocator 如何使用 chunks、boundary information 與多種 bins。本文引用它是為了看見概念延伸，不把 glibc 的全部機制說成 Stanford 投影片要求的實作。

## Corrupted links 為何會把普通 overflow 放大

Free-list pointers 位於可寫 heap 中。若 use-after-free 或 overflow 改到 `prev`／`next`，naive unlink 會依被竄改地址寫入鄰居欄位。基本 hardening 會在 dereference 前檢查 alignment、heap 範圍、free state 與 reciprocal links。測試時也要從 heap 與 list 兩端收集 free addresses 並比較集合；走訪超過 block 數就判定 cycle，避免 checker 自己卡住。

## Explicit 不必然更省空間，也不必然永遠更快

Explicit list 最大優勢是只搜尋 free candidates，但每個 free block 要容納 links，minimum block 增大。對大量小配置，split 後常因 remainder 太小而不切，internal fragmentation 上升。若 workload 大部分時間 heap 很空，free candidates 本來就多，搜尋縮減也有限。

比較時至少保留四項觀測：平均與尾端 allocation latency、peak heap、minimum block overhead、coalescing 次數。只報平均 throughput 會藏住偶爾掃很久的 request；只報 utilization 會藏住昂貴的全表排序。

## 從這講帶走的實作與測試順序

先完成 heap walker 和 checker，再做 explicit list。接著獨立測試 insert/remove 的四種位置，確認雙向 links。再加入 allocation unlink，然後 splitting，最後加入四種 coalescing cases。每增加一步，都比較「heap 中所有 free blocks」與「list 可達 nodes」兩個集合。

錯誤發生時保存最短 trace。印出每一步前後的 physical map 與 logical map，標出 header size/state、node prev/next。不要只看 crash 行；corruption 常在早一個 split 或 unlink 發生，直到下一次 traversal 才爆炸。

Lecture 22 真正教的是資料結構 ownership。Free block 不是單純 linked-list node，也不是單純連續 bytes；它同時參與 heap partition 與候選集合。可靠 allocator 的每個狀態轉換，都要回答三題：物理範圍現在是什麼、邏輯 list 目前指向誰、client 是否仍有權碰這些 bytes。三個答案一致，速度優化才站得住。

## 參考資料

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 22 — Managing the Heap, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/22/Lecture22.pdf)
- [ISO C17 Committee Draft N1570 — Memory Management Functions](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)
- [Doug Lea — A Memory Allocator](https://gee.cs.oswego.edu/dl/html/malloc.html)
- [glibc Wiki — Malloc Internals](https://sourceware.org/glibc/wiki/MallocInternals)
