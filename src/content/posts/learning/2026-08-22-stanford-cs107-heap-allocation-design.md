---
title: "Stanford CS107 Lecture 21：Heap Allocator 的第一個設計，速度與空間為何互相拉扯"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, memory-management, malloc, heap]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 22
tldr: "CS107 第 21 講從 allocator 的 alignment、throughput 與 utilization 目標出發，以 bump allocator 和 implicit free list 拆解 metadata、splitting、placement、內部與外部碎片，以及 free 後為何必須 coalesce。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 21：heap allocator 介面、效能指標、fragmentation、bump allocation、implicit free list、block headers、placement、splitting 與 coalescing。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-heap-allocation-design-en)

Lecture 20 最後把視角從 `malloc` 的使用者轉到實作者：一段連續 heap 交到 allocator 手上，它得把不同大小、不同生命週期的要求安排進去。Lecture 21 正式回答第一層問題：allocator 至少要記住什麼，才能在沒有物件型別、也不知道未來要求的情況下，反覆配置與回收空間？

這不是尋找唯一「最好」的資料結構。配置器同時追求正確對齊、快速回應和高空間利用率，但改善其中一項常會傷害另一項。最簡單的 bump allocator 幾乎不花時間搜尋，代價是無法真正重用；implicit free list 能重用空間，卻得掃過使用中的 block。這講的主脊就是逐步增加 bookkeeping，並逐筆看見它買到的能力與新增的成本。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 21，2026-02-25
- 官方標題：Managing the Heap, Take I
- 講者：課程 syllabus 列 Jerry Cain；本講 PDF 沒有另列 guest speaker
- 已讀材料：官方 calendar、完整官方投影片、C17 草案的配置介面條款、CS:APP Malloc Lab 說明與 Doug Lea 的 allocator 設計文章
- 材料缺口：Canvas 錄影與 AFS lecture code 未公開；本文不虛構課堂口述、現場 demo 或特定 starter code

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講列為 heap management 的第一部分。投影片的完整路線是 allocator 目標、alignment、throughput 與 utilization、內部和外部 fragmentation、bump allocator、block metadata、implicit free list、first-fit 搜尋、placement 與 splitting，最後預告 coalescing 和 in-place `realloc`。下一講才比較其他 free-list 組織方式；本文不搶先把後續設計當成本講結論。

## Client 看見 bytes，allocator 看見一串 blocks

在 client 端，`malloc(n)` 像是「給我至少 n bytes」。Allocator 端看到的問題更具體：從自己管理的連續區間找出一塊足夠大的空間，回傳符合對齊要求的 payload 指標，並保存日後 `free` 和 `realloc` 所需的資訊。C 語言不會把 client 的型別、陣列長度或最後一次使用時間一起交給 allocator。

[C17 草案的 allocated objects 條款](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)說，配置函式回傳的指標必須適當對齊，足以指向任何具有 fundamental alignment 的物件；`malloc` 配出的內容起初是不確定值。這兩句直接限制實作。Allocator 不能只找出 n 個相鄰 bytes 就交差，payload 起點還得落在合法 alignment 上；也不能靠「新空間一定是零」當契約。

可以把 heap 想成 allocator 自己維護的 block 序列：

```text
heap start                                             heap end
   |                                                       |
   v                                                       v
+--------+----------------+--------+----------+--------+----+
| header | client payload | header | payload  | header | ...|
+--------+----------------+--------+----------+--------+----+
```

Header 是 allocator 的私有 bookkeeping，不是 client 要求的 payload。最基本資訊通常包括 block 大小與是否使用中。Client pointer 指向 payload；`free(ptr)` 時，實作以固定 offset 回到 header，才知道這一塊跨多遠。這個安排也解釋為什麼 `free` 不需要 length 參數：長度不是消失了，而是 allocator 早已藏在 block 附近。

## 正確性先於效能：alignment 與 block 邊界不能靠運氣

假設平台要求 payload 起點落在 8-byte 邊界。Client 要 13 bytes 時，allocator 不能把下一個 block 緊接在第 13 byte 後面，否則下一份 payload 可能失去對齊。它會把占用大小向上取整，再加上 header 所需空間。這些 padding 對 client 不可見，卻真實占用 heap。

常見計算可寫成：

```c
size_t roundup(size_t n, size_t alignment) {
    return (n + alignment - 1) & ~(alignment - 1);
}
```

這段位元技巧的前提是 `alignment` 為二的冪，而且 `n + alignment - 1` 沒有 overflow。正式 allocator 在相加前要檢查上界，不能讓極大 request 繞回小數字，再錯誤配置一個太小的 block。Lecture 3 到 Lecture 5 的整數表示法在這裡不是前置知識裝飾：size arithmetic 本身就是記憶體安全邊界。

Header 的編碼也利用 alignment。若所有 block size 都是 8 的倍數，低三個 bits 原本必為零，其中一個便可保存 allocated flag。取 size 時遮掉旗標，判斷狀態時只讀該 bit。這能避免另放一個欄位，但增加一條硬性不變量：所有讀寫 header 的路徑必須使用一致 mask，不能把含旗標的 word 直接當純大小做 pointer arithmetic。

今晚可以做的檢查很簡單：替自製 allocator 列出三種 request——零、非對齊大小、接近 `SIZE_MAX`——逐步算出 header、padding 和總 block size。只測正常小數字，最容易把 alignment 與 overflow 錯誤藏到最後。

## Throughput 與 utilization 是兩把不同尺

Allocator 的速度常以 throughput 表示：一段時間能完成多少次配置與釋放。空間則看 utilization：client 當下實際需要的 payload，佔 allocator 從底層取得 heap 的比例。兩者不能用同一個「很快」或「很省」帶過。

[CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)也把評估拆成 space utilization 與 throughput，並用 traces 測量。這個方法比只跑一次範例重要：配置器的行為取決於 request 順序。連續配置相同大小、交錯釋放、突然要求大 block，會產生完全不同的搜尋與碎片圖案。

極端設計很容易看出張力。每次都線性掃完整個 heap，可能找到最貼合的洞，卻讓 allocation latency 隨 block 數增加。只拿 heap 尾端的新空間，回應幾乎是常數時間，卻留下所有舊洞。多做 bookkeeping 可能減少搜尋，metadata 又會吃掉小 request 的空間。工程判斷因此要寫成 workload 假設，而不是宣稱某策略普遍最佳。

## 內部 fragmentation：block 裡有空間，client 卻用不到

Internal fragmentation 指已配置 block 內部、但不屬於 client 有效 payload 的空間。來源包括 header、alignment padding，以及因 allocator size class 或最小 block 大小而多給的部分。它們散在各 block 裡，其他 request 無法取用。

例如 client 要 13 bytes，實作需要 8-byte header，再把總大小向 8 對齊，block 可能占 24 bytes。Client 仍只能依 13-byte 契約存取；其餘 11 bytes 不是額外贈送的合法陣列。把「實際 block 比 request 大」誤讀成可使用容量，會讓程式依賴 allocator 私有布局，也可能越過 API 保證。

小 request 特別容易讓 metadata 比例變高。一千份 1-byte 配置若各有 header 和 padding，heap 大部分可能是管理成本。這不代表 header 可以全部刪除，因為 `free` 仍需辨識 block；真正問題是介面與 workload 是否適合逐物件配置，或該由上層使用 arena、pool、批次陣列來攤平成本。

計算 internal fragmentation 時要先說清楚分母與時間點。單一 block 可比較 requested payload 與 block footprint；整體 trace 則可能看 peak payload 對 heap size。不同定義適合不同決策，不應拿一個百分比跨工具直接排名。

## 外部 fragmentation：總空間夠，卻拼不出連續 block

External fragmentation 發生在 free space 分散於多個洞。假設 heap 有三個 32-byte free blocks，總 free space 是 96 bytes；client 要一個 64-byte block，若三個洞不相鄰，allocator 仍無法用它們完成要求。`malloc` 必須回傳一段連續記憶體，不能把三段地址包裝成一個普通 C pointer。

```text
[used 32][free 32][used 32][free 32][used 32][free 32]
```

這要看 free block 的大小與實體相鄰關係。相鄰 free blocks 可合併；被 live block 隔開的洞不能移動，因為 allocator 無法改寫 client 手上的 pointers。

Internal 與 external fragmentation 也可能互相拉扯。把 request 向較大級距取整，可能增加內部浪費，卻讓回收後的 blocks 尺寸規律、較容易重用。精細切到剛剛好能減少當下 padding，但留下太小 remainder 時，日後誰也用不了。好的評估要用真實 trace，而不是只靠單一步驟直覺。

## Bump allocator：一個指標就能快，但 `free` 幾乎沒有意義

最簡單的配置器保存 `next`，每次把 request 對齊後回傳目前位置，再把 `next` 向後推：

```c
void *bump_malloc(size_t n) {
    size_t need = roundup(n, 8);
    if (need > (size_t)(heap_end - next)) return NULL;
    void *result = next;
    next += need;
    return result;
}
```

它的優點很強：沒有 free-list search，路徑短，metadata 也可極少。若所有配置共享同一生命週期，例如編譯一個 request 後整座 arena 一次丟棄，bump allocation 很合理。不能因它無法逐塊回收，就說它在所有情境都差。

問題出在一般 `malloc` 契約允許任意順序 `free`。單靠 `next` 不知道早先哪一塊已釋放，也不能安全往回退：最後一塊之前若仍有 live object，回退後的新配置會覆蓋它。把 `free` 實作成 no-op 雖然不立即破壞 live data，長時間程序卻只增不減，最終耗盡 heap。

## Implicit free list：header 讓整座 heap 自己成為清單

Implicit free list 不另存 next pointer。每個 header 記錄當前 block 的總大小與 allocated bit；從 heap 起點開始，把 size 加到目前位址，就能跳到下一個實體 block。因此「list」是隱含在 block layout 裡。

```text
[size=32,A][payload...][size=48,F][unused...][size=24,A][payload...]
      +32 bytes ----------> +48 bytes ---------->
```

走訪時有三條不變量。第一，size 包含 allocator 定義的整個 block footprint，而不是只有 client request。第二，size 必須非零且保持 alignment，否則 iterator 可能停住或跳出 heap。第三，終點要有明確表示，例如 epilogue header 或已知 heap boundary。Metadata 一旦被 client overflow 改壞，後續 traversal 便可能把任意 bytes 解讀成 size。

這種設計的美感在於最低限度 metadata 同時支援 placement、free 與走訪。代價同樣直接：找 free block 時也得跨過 allocated blocks。Heap 上 live objects 越多，即使 free list 只有少數洞，搜尋仍可能很長。下一講的 explicit free list 正是針對這項成本。

## First fit、next fit 與 best fit 改變搜尋路徑，也改變洞的形狀

First fit 從固定起點掃描，遇到第一個足夠大的 free block 就停止；但前段會反覆 split，逐漸累積小洞。Next fit 從上次停止處繼續，避免每次重掃開頭，結果則依歷史位置更敏感。

Best fit 尋找能容納 request 的最小 free block，希望留下最少剩餘。然而在 implicit list 上，若要確認「最小」，通常得掃完整座 heap；而極小 remainder 可能成為不可用碎片。名稱裡的 best 描述局部選擇規則，不是對整體 throughput 或 utilization 的保證。

[Doug Lea 對 general-purpose allocator 的設計說明](https://gee.cs.oswego.edu/dl/html/malloc.html)把 minimizing time、space、fragmentation、locality 與 tunability 都列為目標，也明說它們會彼此取捨。這提供一個重要分寸：placement policy 要和 free-list 結構、split threshold、coalescing 時機及 workload 一起評估，不能脫離其餘設計只比較名字。

實驗 placement policy 時，固定同一組 trace，記錄平均搜尋長度、最大搜尋長度、heap high-water mark 和失敗 request。改 policy 又改 trace，得到的差異無法歸因。

## Splitting：大洞可以切，但 remainder 必須仍是合法 block

找到比 request 大的 free block 後，allocator 有兩個選擇：整塊交給 client，或切出需要的前段，把 remainder 留為 free block。整塊交付沒有新增 header，速度快，但多出的部分成為 internal fragmentation。Splitting 提高可重用空間，卻不是任何剩餘大小都值得切。

Remainder 至少要放得下 free block 所需 metadata、滿足 alignment，並能承載最小 payload。如果剩下 8 bytes，而 free block 自己就需要 8-byte header，把它掛進可用集合沒有實際價值，還增加走訪項目。實作通常定義 minimum block size；不足門檻時，讓原配置吸收 remainder。

切割順序也關係到不變量。先計算並驗證 allocated size 與 remainder size，再寫新 free header，最後標記前段 allocated。任何中途可觀察狀態都不該讓兩個 block 重疊或讓 heap traversal 失去終點。

一個好測試是配置到「剛好不值得 split」與「剛好值得 split」門檻的兩側，釋放後走完整個 heap，確認 block sizes 相加仍等於管理區間，且每個 payload 對齊。

## `free` 只改一個 bit 還不夠：相鄰洞必須能重組

在 implicit list 中，`free(ptr)` 可以找到 header 並清除 allocated bit。若只做到這裡，兩個相鄰 free blocks 仍會被當成兩個洞；日後的大 request 可能失敗，即使它們合起來足夠。Coalescing 的工作是辨識物理相鄰且都 free 的 blocks，將大小合併成單一合法 block。

找到右鄰很容易：目前位址加目前 size。找到左鄰則較麻煩，因為 header 只告訴自己多大，沒有說前一塊從哪裡開始。最簡單可以從 heap 起點重走；也可以在 block 尾端加入 boundary tag，讓下一塊向左讀到前一塊大小。後者多用 metadata 換取快速鄰居定位，正是全講反覆出現的取捨。

Coalescing 可立即執行，也可延後到搜尋失敗或特定時點。立即合併減少相鄰小洞，卻可能讓剛被拆開、很快又需要相同大小的 block 反覆 split 與 merge。延後合併讓 `free` 更短，但 allocation 可能突然承擔大筆整理成本。沒有 workload 就不能只從名稱判斷答案。

## `realloc` 預告：最好情況是不搬資料

投影片最後預告 in-place `realloc`：縮小時可切出尾端 remainder；擴大時若右鄰 free，可合併後保留原 pointer。右邊不足才配置新 block、複製並釋放舊 block。[C17 草案](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)規定失敗時原物件仍有效，所以 client 不該在確認成功前覆蓋唯一 pointer。這個預告把 placement、splitting 與 coalescing 串了起來。

## 從這講帶走的 allocator 檢查表

實作前先寫出不變量，比先寫 `malloc` 主迴圈更省時間：payload alignment 是多少；header 的 size 是否包含自己；最低 block size 是多少；allocated flag 藏在哪個 bit；heap 如何表示終點；size arithmetic 如何拒絕 overflow；split 後兩塊是否都合法；free 後何時 coalesce。

Lecture 21 的真正收穫不是背下 first fit，而是看懂 allocator 每增加一份 metadata，都在購買某種能力：header 買到走訪與回收，padding 買到 alignment，搜尋買到重用，splitting 買到較高利用率，coalescing 買到較大的連續空間。成本也同時存在。下一講把 free blocks 從隱含序列抽成 explicit list，會再次用更多結構換取更短搜尋。

## 參考資料

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 21 — Managing the Heap, Take I](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/21/Lecture21.pdf)
- [ISO C17 Committee Draft N1570 — Memory Management Functions](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)
- [Doug Lea — A Memory Allocator](https://gee.cs.oswego.edu/dl/html/malloc.html)
