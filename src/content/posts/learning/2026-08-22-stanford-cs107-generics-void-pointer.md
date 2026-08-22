---
title: "Stanford CS107 Lecture 11：void * 如何讓 C 擁有泛型，又不假裝型別還在"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, memory-management, generics]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 12
tldr: "CS107 第 11 講先收完 calloc、strdup、free、realloc 的 heap 契約，再把 swap 從多份型別專用程式改造成 void * 加 byte count：C 的泛型不是保留未知型別，而是明確交接位址、寬度與解讀責任。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 11：heap ownership、calloc、strdup、realloc、void pointer、memcpy 與 generic swap。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-generics-void-pointer-en)

如果替 `int`、`double`、字串 pointer 各寫一份 `swap`，程式很安全，也很快開始重複。若只保留一份函式，它又怎麼知道該搬幾個 bytes、該把位址解讀成哪一種型別？Stanford CS107 Lecture 11 的回答很有 C 的味道：函式不必知道資料的語意，只要 caller 同時交出位址與 byte count。`void *` 抹掉 pointee type，`memcpy` 負責複製 raw bytes，正確性則由介面契約與 caller 共同維持。

這不是「C 也有 Java generics」的輕巧語法糖。型別資訊一旦被擦掉，compiler 能替你做的檢查就變少；錯誤的寬度、錯誤的 cast 或錯誤的 lifetime 都可能順利編譯。本講因此先把上一講的 heap 收尾，再進入 generics：兩部分其實在問同一件事——當語言不替你記住資源與型別，程式設計者要如何把遺失的資訊寫回契約。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 11，2026-01-30
- 官方標題：Generics and `void *`
- 投影片標題：Heap Wrap, Generics – void *
- 講者：課程 syllabus 列 Jerry Cain 授課；本講 PDF 沒有另列講者
- 已讀材料：官方 calendar、完整 Lecture 11 投影片，以及 POSIX Issue 8 的 `calloc`、`strdup`、`free`、`realloc`、`memcpy` 規格
- 材料缺口：calendar 另提 vulnerability disclosure、use-after-free 與 partiality；公開投影片能完整支撐 heap 與 generics 主線，但 Canvas 錄影、課堂口頭倫理討論、AFS lecture code 與 starter repositories 未公開

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講放在 Topic 3 收尾與 Topic 4 開端。[完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/11/Lecture11.pdf)的 agenda 依序是：複習 heap allocation；介紹 `calloc`、`strdup`、`free`、`realloc`；比較 stack 與 heap 的 lifetime、容量、ownership 和成本；提出 strongly typed data exchange 的重複問題；把型別專用 `swap` 逐步改成 `void *` 加 byte count；用 `memcpy` 當 byte replicator；最後以錯誤的 `void *` 呼叫說明代價。

## Heap API 是一組狀態轉移，不是四個孤立函式

上一講由 `malloc` 建立基本模型：配置成功取得一塊至少指定大小的 storage，失敗得到 null pointer；成功後內容尚未初始化，程式保存 returned base address，使用完畢再釋放。本講補上的 API 不只是方便版 `malloc`，每個函式都改變了初始化或 ownership 契約。

```c
int *counts = calloc(26, sizeof *counts);
if (counts == NULL) {
    // handle allocation failure
}
```

依 [POSIX `calloc` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html)，它配置足以容納成員數乘以成員大小的空間，並將所有 bits 初始化為零。投影片用 26 個 `int` 說明，因此每個整數起始為零；同一頁也用 false 與 null-pointer representation 描繪常見結果。實務上應緊貼規格說「all bits zero」，不要把所有 C implementation 的抽象值表示法都偷換成某一台機器的經驗。

`sizeof *counts` 比 `sizeof(int)` 更能抵抗之後改型別：容量公式與左側 pointer 指向的型別保持一致。它沒有解決乘法溢位以外的所有風險，也不代表配置必定成功；null check 仍是控制流程的一部分。

```c
char *copy = strdup("disinformation");
if (copy != NULL) {
    copy[0] = 'D';
    free(copy);
}
```

[POSIX `strdup`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html)配置足夠空間，把來源字串連同終止 null byte 複製進去，並回傳新字串的 pointer。這讓 string literal 與可修改 heap copy 的角色分開：caller 不應改 literal，卻可以在容量範圍內修改 duplicate。方便沒有取消 ownership；成功取得的 copy 最後仍需 `free`。

## free 結束 allocation lifetime，不會替所有 alias 清空

```c
int *numbers = malloc(8 * sizeof *numbers);
int *alias = numbers;
free(numbers);
numbers = NULL;
```

把 `numbers` 設成 `NULL` 是良好局部習慣，卻沒有神奇地更新 `alias`。兩個 variables 原本保存同一個 base address，`free` 結束的是 allocated object 的 lifetime，不是掃描程式中所有相同 bit pattern。[POSIX `free` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)要求 argument 是先前由配置函式回傳、且尚未被釋放的 pointer；`free(NULL)` 不做任何事。把 interior pointer、stack address 或已釋放位址交給它，都不在合法契約內。

因此幾個常見 bug 要分開命名：memory leak 是最後一個可用 owner 消失，但 allocation 仍存活；use-after-free 是 allocation lifetime 已結束，程式仍經由 dangling alias 讀寫；double-free 是同一 allocation 被再次交給 `free`。三者都與 ownership 有關，卻不是同一狀態，修法也不能只靠「函式尾端多寫一個 `free`」。

一個可操作的 ownership 規則是：每次成功配置立刻寫下誰擁有它、ownership 是否轉移、所有 early return 從哪裡 cleanup。若函式只借用 pointer，就不要釋放；若函式接管，就在名稱、註解或 API 文件中明說。C compiler 不會替這份協議執法，但 reviewer 至少有可以對照的條款。

## realloc 的難點是舊 pointer 何時失效

```c
size_t new_count = count * 2;
int *grown = realloc(numbers, new_count * sizeof *numbers);
if (grown != NULL) {
    numbers = grown;
    count = new_count;
}
```

[POSIX `realloc` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html)允許 implementation 擴張原 block，也允許搬到新位置並保留共同範圍內的內容。成功時，舊 object 被釋放，舊 pointer 不應再用，即使新地址碰巧相同；失敗回傳 null pointer，原 block 保持不變。

這正是為什麼不能直接寫 `numbers = realloc(numbers, ...)`。若失敗，唯一 owner 被 null 覆蓋，原 allocation 仍在卻再也找不到，製造 leak。temporary pointer 讓程式先判斷結果，再提交 ownership 變更。若 size 計算會溢位，必須在呼叫前檢查；allocator 只看它實際收到的 byte count，不知道你原本想容納幾個 elements。

`realloc` 之後也要重新檢查 interior pointers。假如 `int *middle = &numbers[3]` 在配置調整前就被保存，block 一旦搬移，`middle` 不會自動跟著更新。比較穩健的做法是保存 index，在成功後由新 base 重算地址。

## Stack 與 heap 應按 lifetime 與 ownership 選，不按口號選

投影片把兩者的差異整理成多個軸。Stack allocation 隨 function activation 建立與回收，語法簡單、cleanup 自動，容量受 thread stack 與實作限制；heap 可讓物件跨越配置函式返回，也能在 runtime 決定大小，但配置、失敗處理與釋放都要由程式協調。

「stack 一定快、heap 一定慢」不足以指導設計。若資料只在目前 scope 暫用、大小合理且固定，automatic storage 通常最直接。若結果必須回傳給 caller 長期保存、大小直到 runtime 才知道，或物件 lifetime 與 call stack 不一致，heap 才提供必要能力。選擇 heap 的理由應是 lifetime 或可變容量，而不是覺得 `malloc` 看起來更專業。

## C generics 的起點是重複的 strongly typed swap

```c
void swap_int(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void swap_double(double *a, double *b) {
    double tmp = *a;
    *a = *b;
    *b = tmp;
}
```

這兩個函式的演算法完全相同：保存第一塊內容、第二塊覆蓋第一塊、暫存覆蓋第二塊。差別只在每塊資料的寬度與 compiler 用來解讀 bytes 的型別。Strong typing 的好處是 compiler 能驗證呼叫、替 pointer arithmetic 套上正確尺度；代價是相同資料搬運流程為每種型別複製一份。

泛化之前要辨認演算法真正需要的資訊。Swap 不需要知道整數加法、浮點比較或 struct field；它只需要兩段 storage 的起始位址與共同長度。反過來說，如果演算法要比較「大小」，單有 bytes 就不夠，因為相同 bit sequence 作為 signed integer、floating point 或字串有不同語意。Lecture 11 先處理純搬運，下一講才用 callback 補回 policy。

## void * 代表未知 pointee type，不代表萬用值

```c
void swap(void *a, void *b, size_t nbytes);
```

Object pointer 可以轉成 `void *` 再轉回相容的原型別，讓一個介面接收不同 object addresses。可是 `void *` 本身沒有 element size，也不能被 dereference 成有意義的 C value。標準 C 也不賦予它一般 object pointer arithmetic；要逐 byte 前進，需先轉成 `unsigned char *` 或 `char *`。

這個 signature 的三個 arguments 缺一不可。`a` 與 `b` 說明從哪裡開始，`nbytes` 說明搬多少；函式無法從位址反推出 allocation 大小，更無法判斷兩邊是否真的是同型別物件。Caller 若把 `sizeof(int)` 配給一個 `double`，callee 仍可能照做，留下半個物件被交換的破壞結果。

`void *` 也不延長 lifetime。把 local address 轉成 `void *` 再保存，local 返回後仍是 dangling pointer；把 `const` object 粗暴 cast 成可寫 pointer，也不創造修改權。Type erasure 只改變靜態介面看到的資訊，不改變 storage 的存在時間、alignment、有效範圍與 mutability。

## memcpy 是 byte replicator，契約比名字重要

```c
void swap(void *a, void *b, size_t nbytes) {
    unsigned char tmp[nbytes];
    memcpy(tmp, a, nbytes);
    memcpy(a, b, nbytes);
    memcpy(b, tmp, nbytes);
}
```

依 [POSIX `memcpy`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memcpy.html)，函式從 source object 複製指定數量的 bytes 到 destination；兩個範圍若重疊，行為未定義。這正適合交換兩個互不重疊、大小相同的完整 objects。`memcpy` 不知道 int、double 或 struct，也不呼叫建構式；在 C 的 object model 裡，它就是按 byte 複製。

範例用 variable-length temporary array 直接呈現三段複製。Production utility 還要考慮大小、overlap 與 stack temporary；三步操作的 aliasing 關係需整體分析。

正確呼叫可以寫成：

```c
int x = 17;
int y = 42;
swap(&x, &y, sizeof x);

double p = 3.14;
double q = 2.71;
swap(&p, &q, sizeof p);
```

`sizeof x` 跟著實際 object 走，避免手寫寬度。若兩個 operands 型別或大小不同，不應靠取較小值讓呼叫「不越界」；那只會將語意錯誤改造成較安靜的資料毀損。Generic API 的第一條防線仍是讓 wrapper 或 call site 將相關資訊綁在一起。

## 錯誤 demo 的重點：編譯成功不是契約成立

```c
short small = 7;
long large = 99;
swap(&small, &large, sizeof large); // wrong
```

從 signature 看，兩個 object pointers 與一個 byte count 都合法；從 storage 看，第一次複製就可能讀過 `small` 邊界。Compiler 在 type erasure 之後沒有足夠資訊拒絕呼叫。另一種錯法是把相同大小當成相同語意：即使某平台的 `int` 與 `float` 都佔四 bytes，交換其 representations 也不等於 numeric conversion。

這揭示 C generics 的取捨：重用來自「只依賴共同的低階操作」，不是所有型別突然擁有共同高階意義。`swap` 能泛化，因為完整 object representation 可以搬運；sort 的比較不能只看 raw bytes，下一講必須額外接收 function pointer，讓 caller 把 ordering policy 傳進來。

## 從這講帶走的判讀框架

遇到 heap API，先畫 allocation 的狀態：尚未配置、配置成功、可能被重新配置、已釋放。每個 pointer 是 owner 還是 borrower？失敗路徑是否仍保留原 owner？是否有 alias 在 lifetime 結束後還可能被使用？這能把模糊的「記憶體怪怪的」拆成可檢查的轉移。

遇到 generic API，則列出被擦掉的資訊與補回方式。`void *` 擦掉 pointee type，所以 byte-moving function 要補 size；排序還會擦掉 ordering meaning，所以再補 comparator；容器若管理元素 lifetime，還可能需要 copy 或 destructor callback。每抹掉一項 compiler 原本知道的資訊，就要有一項 runtime argument、wrapper 或文件契約承接。

Lecture 11 最重要的不是背五個 library functions，而是看見同一條系統程式設計原則：抽象不會消滅責任，只會移動責任。Heap 把 lifetime 從 call stack 移到 owner；`void *` 把型別知識從 callee 移到 caller；`memcpy` 把 value operation 降成 byte operation。介面愈通用，越需要把大小、生命週期與合法操作寫得精確。

## 延伸練習

為可成長的 `int` buffer 寫 `append`，以 temporary 接 `realloc` 並列出每條失敗路徑的 owner。再把 typed swap 改成 generic core，記錄 compiler 不再能檢查什麼。最後思考：generic bubble sort 收到 base、元素數量和寬度後，還缺哪項資訊才能決定相鄰元素是否逆序？

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 11: Heap Wrap, Generics – void *（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/11/Lecture11.pdf)
- [POSIX Issue 8: calloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html)
- [POSIX Issue 8: strdup and strndup](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html)
- [POSIX Issue 8: free](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)
- [POSIX Issue 8: realloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html)
- [POSIX Issue 8: memcpy](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memcpy.html)
