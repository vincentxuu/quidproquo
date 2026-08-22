---
title: "Stanford CS107 Lecture 23：把 realloc 留在原地，必須守住哪些 allocator 不變量"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, memory-management, realloc, free-list]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 24
tldr: "CS107 第 23 講把 explicit free list 推進到原地 realloc：縮小時切出可用區塊，放大時吞併右側 free blocks，做不到才配置、複製、釋放；每一步都要同時維持實體 heap 與邏輯 free list。"
description: "導讀 Stanford CS107 Winter 2026 Lecture 23：coalescing 練習、realloc 的三種原地路徑、split 門檻、連續右向吞併、fallback，以及 final explicit allocator 的驗收不變量。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-explicit-free-list-en)

前兩講先做出 implicit allocator，再把所有 free blocks 串成 explicit free list。第 23 講問的是更棘手的一步：當 client 用 `realloc` 改變大小，allocator 能不能讓資料留在原地址？答案是有時可以，但「沒有搬家」不等於「沒有工作」。縮小可能產生新的 free block，放大可能要把右鄰從 free list 拆下來，任何一步漏更新 metadata 或 links，都會留下重疊區塊。

這講的主脊是一次 `realloc` 狀態轉換。先確認現有 block 的實際容量，再依序考慮 padding、縮小切割、吸收相鄰 free blocks，最後才走 allocate-copy-free。三個原地案例表面不同，實際都在維持同一組條件：alignment 不變、heap 仍被不重疊 blocks 完整切分、每個 free block 恰好出現在 free list 一次、舊資料的有效前綴不能改變。

## 教材與完整議程

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 正式講次：Lecture 23，2026 年 3 月 2 日
- 官方標題：Managing the Heap, Take III
- 講者：Jerry Cain
- 已讀材料：官方 calendar、Lecture 23 投影片、POSIX `realloc` 與 `free` 規格、C17 記憶體管理章節，以及 CS:APP Malloc Lab handout
- 材料缺口：Canvas 錄影與 AFS lecture code 未公開；本文重建投影片的配置案例，不宣稱還原課堂口頭補充或 demo

[官方 Lecture 23 投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/23/Lecture23.pdf)先用 coalescing etude 複習「實體相鄰不等於 free-list 相鄰」，再列出原地 `realloc` 三種情況：既有 padding 已足夠、縮小後可切出 remainder、放大時吸收右側 free blocks。接著用三個 heap 圖比較可切割、剛好吞併、餘量太小只能當 padding，最後把要求收束到 final explicit allocator assignment。

## 先把 realloc 的契約說清楚

[`realloc` 的 POSIX 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html)允許回傳原指標，也允許配置新物件；成功時，新物件會保留舊、新大小較小者所涵蓋的資料前綴。若回傳位置不同，舊物件會被釋放。這表示 caller 不能預設地址穩定，也不能在成功後繼續使用舊指標。

```c
void *tmp = realloc(buf, wanted);
if (tmp == NULL) {
    /* buf 仍指向原配置；先處理失敗。 */
    return -1;
}
buf = tmp;
```

用暫存指標不是風格偏好。若直接寫 `buf = realloc(buf, wanted)`，失敗時會把唯一仍可用的舊地址蓋成 `NULL`。Allocator 內部同樣要把 fallback 看成有失敗邊界的 transaction：新配置成功且複製完成後，才能釋放舊 block。

零大小的行為牽涉 C/POSIX 版本差異，不適合拿來推導這份作業的核心機制。本文聚焦投影片明確展示的正大小請求；實作時應完全依 assignment 提供的 contract 與測試要求處理邊界，不自行混入另一個 libc 的特殊行為。

## Etude 1：coalescing 看地址，不看串列前後

第一張 heap 圖裡，B 的 allocated block 右側緊接一個 free block。呼叫 `free(b)` 後，兩者在實體地址上連續，因此可以合成一個較大的 free block。這個判斷不能用 `b->next`：B 尚未釋放時根本不是 free-list node，而 free list 的 next 只表示搜尋順序，不保證下一個地址。

```text
before: [B used 24][free 16][A used 16]
free(b)
after:  [free 48........][A used 16]
```

圖上的數字包含 allocator 定義的 block layout，而不是單純 client request。合併時要以 headers 所描述的實體邊界計算總容量，不能把兩個 payload size 直接相加。若 free neighbor 已在 explicit list，先 unlink 它，再把合併後的新 block 插入一次；否則 list 會同時保留舊 node 與涵蓋它的新 node。

[`free` 的 POSIX 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)把釋放後繼續引用該空間視為未定義行為。這正是 allocator 能把 freed payload 改作 `prev`、`next` 的契約基礎；也說明 use-after-free 為何不只讀到舊資料，還可能破壞 allocator 的索引。

## 原地路徑一：請求變大，但 padding 已經足夠

Allocator 為了 alignment 與 minimum block size，實際給出的 block 容量可能大於 caller 請求。投影片的例子先配置 42 bytes，實際 block 已含足以容納 48 bytes 請求的空間。這時 `realloc(a, 48)` 可以直接回傳 `a`，不必移動資料，也不必改 free list。

關鍵是比較「新請求正規化後需要的 block size」與「目前 block 真正擁有的 size」，不是比較先前 request 與新 request。Allocator 通常不保存原 request 的每個細節；header 保存的是足以沿 heap 行走、判定狀態與容量的 metadata。既有 padding 已屬於這個 allocated block，不能再被其他 allocation 使用。

這條路徑看似什麼都不做，仍應通過 checker。Header 必須維持 allocated，payload address 不變，鄰居起點不變，而且 free-list node 集合完全相同。若實作把 requested size 硬寫回 header，反而可能讓下一個 physical walk 從錯誤地址開始。

## 原地路徑二：縮小後能否切出合法 free block

新需求較小時，保留原 block 當然足以滿足請求；真正的設計決定是尾端餘量能否另成一塊。投影片示範從較大的 block 縮到 16-byte payload，當尾端足以容納 header 與 explicit list 的兩個 pointers 時，allocator 可以把它切成新的 free node。

```text
before: [A used........................][free]
after:  [A used][new free remainder.....][free]
```

切割門檻不能只問「有沒有剩 bytes」。Explicit free block 的 payload 至少要放 `prev`、`next`，還要符合 alignment 與 metadata 需求。Lecture 23 的配置採 16-byte free payload，因此範例用相差至少 24 bytes 才值得切；真正程式應由常數與 layout 推導，避免把投影片數字散落成 magic numbers。

若 remainder 太小，最合理的做法是留在 allocated block 當 internal padding。硬切會產生永遠無法服務任何請求的碎片，甚至讓 links 寫過 block 邊界。若可以切，操作次序可寫成：先算出 allocated prefix 與 remainder 的精確邊界，寫好兩邊 metadata，初始化 remainder links，再依 policy 插入 free list，最後嘗試與右鄰 coalesce。

縮小不代表可以少保留原資料。依 `realloc` 契約，前 `min(old,new)` bytes 必須保持；因為 payload 起點不動，通常自然成立，但 metadata 寫錯位仍可能覆蓋前綴。測試不能只比回傳地址，也要用 pattern 填滿舊 payload，縮小後逐 byte 檢查保留範圍。

## 原地路徑三：放大時吸收右側 free blocks

目前 block 與右鄰 free block 實體相連時，可以把右鄰納入 allocated 範圍。這是原地成長最有價值的案例：payload 起點不動，省下配置與複製，也可能避免 heap 擴張。但右鄰原本是 free-list node，必須在擴大 header 前先從 logical list 移除。

```text
physical: [A used][R1 free][R2 free][B used]
logical:  head -> ... -> R2 -> ... -> R1 -> ...

grow A:   unlink R1, absorb it; if insufficient, unlink R2, absorb it
result:   [A used larger..............][B used]
```

投影片把第三種情況推廣成連續向右吸收：只要下一個實體 block 是 free，就繼續納入，直到容量足夠或遇到 allocated block／heap 終點。注意 logical order 完全可能是 R2 先於 R1，不能沿 free-list next 尋找第二個實體鄰居；每次都由目前合併範圍的右界讀下一個 header。

若吸收後有足夠大的尾端餘量，就再切出 free remainder；若只有八 bytes 之類不足以成為合法 explicit node 的空間，整段都給 A 當 padding。Etude 4 正是在測這條門檻：要求 48，合併後 block 是 56，剩下的八 bytes 不夠容納 free node，因此不能留下假 block。

## 三個 etudes 分別在測什麼

Etude 2 從 `[A used 16][free 32][B used 16]` 開始，把 A 放大到 24。吸收右鄰後仍有足夠 remainder，所以結果是 A 24、free 24、B 16。它測的是「吞鄰居之後仍要重新判斷 split」，不是一旦合併就必須吃光。

Etude 3 用相同起點把 A 放大到 56。A 與整個右鄰合起來剛好提供所需 block，free node 完全消失。它測的是 unlink 的完整性：head、tail、中間或唯一 node 都可能被吸收，操作後不能留下指向 A payload 內部的 link。

Etude 4 把 A 放大到 48。合併後雖有 56，餘下八 bytes 不符合 minimum free block，因此 A 保留整個 56。它測的是「可用空間」不等於「可表達成 allocator block」。若 checker 只驗總 bytes 守恆、不驗 minimum size，這種 bug 很容易漏過。

把三個案例放在一起，判斷流程就很清楚：先正規化 request，計算合併容量，再以 minimum block 判斷 remainder。不能先照 request 截斷，之後才發現尾端放不下 metadata。

## 如果右側空間仍不足，為什麼不必復原

作業要求有一個容易意外的細節：原地放大時，即使吸收所有連續 free blocks 後仍不足，也不必把它們恢復成原本的多個 nodes。接著可以配置新 block、複製資料，再釋放已擴張的舊 block。從 client 看，成功結果仍符合契約；從 allocator 看，先 coalesce 反而把多個 holes 合成一段。

不復原不等於可以忽略失敗。若 fallback 的 `malloc` 失敗，原 allocation 仍必須有效。這時實作要確定前面的吸收沒有破壞舊 payload，也要保留一個可描述擴大後 block 的一致 header。Caller 原本只被承諾舊 request 的資料，allocator 可以擁有更大的 backing block；重要的是失敗回傳後舊 pointer 仍可合法釋放。

複製長度應以舊 payload 可保留範圍與新 request 的較小者計算，而不是複製合併後全部容量。新吸收區域沒有 client 資料，把它當來源不只浪費，還可能讀入 allocator metadata。完成 copy 後再 `free(old)`，才能避免新配置失敗時丟失資料。

## 一個可檢查的 realloc 決策骨架

```c
void *resize(void *p, size_t request) {
    block *b = payload_to_block(p);
    size_t need = normalize(request);

    if (need <= block_size(b)) {
        split_tail_if_usable(b, need);
        return p;
    }

    while (right_neighbor_is_free(b)) {
        block *r = right_neighbor(b);
        remove_free(r);
        absorb_right(b, r);
        if (block_size(b) >= need) {
            split_tail_if_usable(b, need);
            return p;
        }
    }

    void *moved = allocate(request);
    if (moved == NULL) return NULL;
    memcpy(moved, p, preserved_payload_size(b, request));
    release(p);
    return moved;
}
```

這不是可直接繳交的 assignment code，而是把決策點排成可審查順序。`remove_free` 必須在 `absorb_right` 覆寫鄰居 metadata 前發生；`split_tail_if_usable` 必須同時更新 physical layout 與 free-list membership；所有 size 運算要先防 overflow，再做 alignment round-up。

[C17 draft 的記憶體管理章節](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)說明配置、重新配置與釋放的語意邊界；課堂 allocator 則把這些外部保證落到 headers、links 和 copy length。標準不指定 free list 長什麼樣，所以內部策略可以不同，但公開行為不能因資料結構方便而改寫。

## Final explicit allocator 的要求是一組相依條件

投影片最後列出 final assignment：header 要追蹤 size 與 used/free 狀態；free blocks 的前 16 bytes payload 放 doubly-linked-list pointers；`malloc` 只搜尋 explicit free list；`free` 至少要向右 coalesce；`realloc` 能原地完成時就原地完成，不能完成時也要耗盡連續右側 free blocks。

這些不是五個互不相干的 checkbox。若 minimum block 沒納入兩個 pointers，縮小 split 會造出非法 node；若 `malloc` 仍掃 physical heap，explicit list 的 corruption 可能被測試暫時掩蓋；若 `free` 不 coalesce，`realloc` 更常被迫搬家；若 links 沒在吸收前移除，下一次 first-fit 可能回傳 A 內部的重疊地址。

[CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)用 correctness、space utilization 與 throughput 一起看 allocator。原地 `realloc` 可能減少 copy 與暫時 peak heap，但不應以犧牲 correctness 換取漂亮數字。先讓每次 mutation 後 checker 都成立，再比較 trace 下的速度與空間。

## 測試要驗狀態，不只驗回傳值

至少建立四組 deterministic traces。第一組測 padding 已足夠，確認地址與 free-list 集合都不變。第二組測縮小，分別讓 remainder 剛好合法與差一個 alignment unit 不合法。第三組測放大，涵蓋一個右鄰、連續多個右鄰、剛好用完與留下合法 remainder。第四組強迫 fallback，確認資料前綴、舊 block 釋放與新 block 不重疊。

每一步後跑 heap checker，驗證：所有 block 地址與 size 對齊；size 非零且下一個 block 正確；allocated/free 狀態合法；實體 free blocks 與 list reachable nodes 集合相等；`prev`/`next` 互相對稱；list 無 cycle；相鄰且政策要求合併的 free blocks沒有殘留。

再加入 failure injection，讓 fallback allocation 回傳 `NULL`。這個案例能抓出「先 free 舊 block 再 malloc」與「吸收後 metadata 不一致」兩類嚴重錯誤。對 copy 則用遞增 byte pattern，不用全零；全零很難區分真的複製與剛好拿到清空頁面。

## 這講真正留下的是 mutation discipline

Lecture 23 不只是教一個更快的 `realloc`。它讓 allocator 的三種視角在同一個函式相撞：client 看見穩定或改變的 payload pointer，physical heap 看見 blocks 的切割與合併，explicit list 看見 nodes 的移除與插入。任何最佳化都必須同時對三者負責。

實作時最有效的順序是把每個 helper 的前置與後置條件寫清楚：它接收的 node 是否已在 list、回傳時 remainder 是否已插入、metadata 何時可被覆寫、失敗時哪個 pointer 仍有效。把複雜操作拆成「unlink、改 physical range、必要時 reinsert」，每階段都能檢查，會比一口氣改六個 pointers 容易除錯。

原地成長的效能收益很直觀，真正的課程價值卻是更樸素的原則：先保存仍需要的結構資訊，再讓舊表示失效；先證明 remainder 是合法 block，再把它放進索引；先確保新 allocation 成功，再結束舊物件生命週期。Allocator 沒有容錯空間，因為一次 stale link 最後會變成另一個 caller 的重疊記憶體。

## 參考資料

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 23 — Managing the Heap, Take III](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/23/Lecture23.pdf)
- [POSIX — realloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html)
- [POSIX — free](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)
- [ISO C17 Committee Draft N1570 — Memory Management Functions](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)
