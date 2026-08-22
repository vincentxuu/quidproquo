---
title: "Stanford CS107 Lecture 13：從 Comparator 到完整 Generic Bubble Sort"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, generics, function-pointers]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 14
tldr: "CS107 第 13 講把 bool callback 升級成三向 comparator，再把 void *、element width 與 const void * callback 合併成完整 generic bubble sort，最後對照 qsort、bsearch、lfind 與 lsearch。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 13：三向 comparator、generic callback、byte-wise element addressing、qsort、bsearch、lfind 與 lsearch。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-function-pointers-continued-en)

Lecture 12 還留下 `int[]`。Lecture 13 讓演算法只保存 base、count 與 width，把元素地址交給 comparator。Library 不知道型別，caller 負責還原並比較。

這也是 `qsort`、`bsearch` 等 APIs 的骨架：library 與 client 各自保留必要知識，以三向回傳值溝通。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 13，2026-02-04
- calendar 標題：Function Pointers, Continued
- 投影片標題：C Generics and Function Pointers, Take II
- 講者：PDF 未單獨署名
- 已讀材料：官方 calendar、完整投影片、POSIX `qsort`、`bsearch`、`lfind`／`lsearch` 規格與 cppreference `qsort`
- 材料缺口：影片與 lecture code 未公開

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)指定 function pointers、generic sort/search 與三個 man pages。本講建立三向 comparator，泛化資料地址與 width，再映射到標準函式庫。

## 從 bool predicate 改成 standard comparator

前一講的 callback 回答「這兩個元素是否該交換」，因此只需 `bool`。標準 comparator 提供更多資訊：

- 回傳值小於零：first 排在 second 前面。
- 回傳值大於零：first 排在 second 後面。
- 回傳零：兩者在這個 ordering 下等價。

若元素仍是 `int`，function pointer type 是：

```c
int (*compare_fn)(int, int)
```

Bubble sort 不再直接理解 ascending 或 descending，只在左側元素依 comparator 應排於右側之後時交換：

```c
void bubble_sort_int(int arr[], size_t n,
                     int (*cmp_fn)(int, int)) {
    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            if (cmp_fn(arr[i - 1], arr[i]) > 0) {
                swap(&arr[i - 1], &arr[i], sizeof(arr[0]));
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

「小於」不是固定的數值比較，而是 comparator 定義的先後關係。Case-insensitive string order、依 struct 的 timestamp、偶數優先，都能用同一個負／零／正協定。演算法只問「first 是否應排在 second 後面」，不必知道原因。

三向結果也保留 equality。搜尋函式需要用零判定命中，排序函式則可在零時保留原順序。若 callback 只回 bool，library 很難同時區分 first-before-second、equivalent 與 first-after-second。

## Comparator 的減法捷徑有 overflow 陷阱

投影片以這個整數 comparator 說明 cast 與 dereference：

```c
int sort_ascending(const void *first, const void *second) {
    return *(const int *)first - *(const int *)second;
}
```

它在小範例可讀，卻不是所有 `int` 的安全實作。若 first 是 `INT_MAX`、second 是負值，減法可能超過 signed `int` 範圍，signed overflow 是 undefined behavior。Comparator 只承諾結果的 sign，不要求回傳數值差，因此可以寫成：

```c
int compare_ints(const void *first, const void *second) {
    int a = *(const int *)first;
    int b = *(const int *)second;
    return (a > b) - (a < b);
}
```

結果只會是 `1`、`0` 或 `-1`，足以表達協定，也不做可能溢位的減法。[cppreference 的 `qsort` 說明](https://en.cppreference.com/w/c/algorithm/qsort.html)同樣提醒 comparator 應對同一組 objects 給出一致結果，並指出比較整數時以 subtraction 回傳可能 overflow。

Comparator 應維持一致且 transitive 的 ordering；若依會變動的 global state 比較，sort 可能無法結束。

## 三個版本看清楚「資料泛化」還缺什麼

第一版知道資料與 callback 都是整數：

```c
void bubble_sort(int arr[], size_t n,
                 int (*cmp_fn)(int, int));
```

第二版把 array base 改成 `void *` 並新增 element size，卻仍把兩個 `int` 傳入 comparator。這是矛盾介面：library 宣稱不知道元素型別，callback 卻要求它解出整數值。

```c
void bubble_sort(void *base, size_t n, size_t width,
                 int (*cmp_fn)(int, int));
```

第三版讓 comparator 也接 generic element addresses：

```c
void bubble_sort(void *base, size_t n, size_t width,
                 int (*cmp_fn)(const void *, const void *));
```

Library 無法解參照 `void *`，但可以算出每個元素的位址。Caller 寫 comparator 時知道實際 element type，能 cast 回正確 pointer 再讀值。這條邊界很清楚：sort 負責「在哪裡」，comparator 負責「是什麼」和「誰在前」。

加上 `const` 表示 comparator 只觀察 elements，不應透過參數修改它們。投影片早期 prototype 使用 `void *`；標準函式庫採 `const void *`，能把語意限制交給編譯器檢查。Sort 本身仍需可寫的 `void *base`，因為交換步驟會改動 array。

## 完整 generic bubble sort 的 byte-wise addressing

```c
typedef int (*compare_fn)(const void *, const void *);

void bubble_sort(void *base, size_t n, size_t width,
                 compare_fn cmp) {
    char *bytes = base;

    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            void *first = bytes + (i - 1) * width;
            void *second = bytes + i * width;

            if (cmp(first, second) > 0) {
                swap(first, second, width);
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

`base` 是 element 0 的地址。轉成 `char *` 後，index `i` 的地址是 `bytes + i * width`；第一個相鄰元素則是 `(i - 1) * width`。這裡沒有任何 typed dereference，只有 address calculation、callback invocation 與 byte-wise swap。

`width` 必須吻合且不可為零；乘法不可 overflow；base 要涵蓋可寫且存活的 range。Comparator casts 也必須吻合真實元素；`void *` 不會讓錯誤 cast 變安全。

Bubble sort 是 quadratic 教學載具；實務上大型資料通常使用標準 `qsort`。

## Client view 與 implementation view

假設 caller 有：

```c
int nums[] = {4, 2, 12, -5, 56, 14};
bubble_sort(nums,
            sizeof(nums) / sizeof(nums[0]),
            sizeof(nums[0]),
            compare_ints);
```

Client 知道 `nums` 是六個 `int`、每個值的語意、要採 ascending order。`bubble_sort` 只看到一個 address、數量、寬度與 callback address。它能算 `nums[3]` 的 byte address，卻不能自己產生 `int` value。

Comparator 收到的 `const void *` 實際指向某個 array element。Cast 不是「把資料轉成另一種表示」，而是告訴編譯器這個 address 背後原本就是 `int`，再以 `*(const int *)first` 讀取。若 caller 傳 float array 卻搭配 `compare_ints`，這個陳述就是謊話，結果不受介面保護。

## 字串陣列為什麼要 cast 成 `char * const *`

```c
const char *words[] = {
    "sabotage", "bumfuzzle", "winsome",
    "ablution", "gravamen", "crepuscular"
};
```

這個 array 的 element type 是 `const char *`，不是 `char`。因此 comparator 收到的是「指向某個 pointer element 的地址」，概念型別是 `const char * const *`。要先解參照取得 string pointer，再交給 `strcmp`：

```c
int compare_strings(const void *first, const void *second) {
    const char *one = *(const char * const *)first;
    const char *two = *(const char * const *)second;
    return strcmp(one, two);
}

bubble_sort(words,
            sizeof(words) / sizeof(words[0]),
            sizeof(words[0]),
            compare_strings);
```

直接 cast 成 `const char *` 會把 pointer object 的 bytes 當成字串。因為 sort 排列 pointers，argument 多一層 indirection。先寫 element type `T`；callback argument 指向 element，因此 cast 成 `const T *`。

`strcmp` 的回傳值本來就符合負／零／正協定，不必壓成 `-1/0/1`。Comparator 也不需要知道字串長度，只要每個 pointer 指向合法 null-terminated string，且比較期間仍存活。

## `qsort`：標準函式庫版本的相同骨架

[POSIX `qsort` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/qsort.html)的 prototype 與本講成品幾乎相同：

```c
void qsort(void *base, size_t nmemb, size_t size,
           int (*compar)(const void *, const void *));
```

它排序 `nmemb` 個、每個 `size` bytes 的 elements。Comparator 對兩個 elements 回傳負、零、正值。規格不承諾使用哪一種排序演算法；名稱是歷史介面，不應據此依賴 quicksort 的 recursion、pivot 或穩定性。

POSIX 明訂 comparator 不應改動 elements，且結果須一致。相等元素的相對順序未指定，所以 `qsort` 不保證 stable；需要 stability 時應選其他實作。

標準函式提供共同 ABI 與成熟機制；caller 仍要負責 width、count、casts 和 ordering contract。

## `bsearch`：相同 comparator，額外要求 array 已排序

[POSIX `bsearch` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/bsearch.html)接受 key、sorted base、count、width 與 comparator：

```c
void *bsearch(const void *key, const void *base,
              size_t nmemb, size_t size,
              int (*compar)(const void *, const void *));
```

它回傳 matching element 的 pointer，找不到則回 `NULL`。若多個 elements 都與 key 相等，回哪一個未指定。最重要的前置條件是 array 已依同一 comparator 排序；若先用另一套 ordering 排序，再拿不同 comparator 搜尋，binary search 的切半判斷失去依據。

`compar` 的第一側是 key，第二側是 element。兩者可同型，也可依各自真實型別 cast；兩個 `const void *` 不保證隱藏型別相同。

結果是 array 內部地址，不是 copy；array 結束 lifetime 或重新配置後便失效。

## `lfind` 與 `lsearch`：搜尋和插入只差 mutability

[POSIX `lfind`／`lsearch` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/lsearch.html)展示同一 generic pattern 的另一種變化。`lfind` 線性掃描既有 array，找不到回 `NULL`，不修改 base；`lsearch` 若找不到會把 key 複製到尾端並增加 element count。

```c
void *lfind(const void *key, const void *base,
            size_t *nelp, size_t width,
            int (*compar)(const void *, const void *));

void *lsearch(const void *key, void *base,
              size_t *nelp, size_t width,
              int (*compar)(const void *, const void *));
```

`lsearch` 的 base 不帶 `const`，因為它會新增 element；`nelp` 是 pointer，因為 count 會更新。Prototype 無法表示 capacity，所以 caller 必須預留空間。

Linear search 不要求排序；`bsearch` 以排序成本換取更快的 repeated lookup。共用 comparator 顯示這套抽象也適用搜尋。

## 本講留下的完整模型

Generic algorithm 用 base、count 與 width 計算地址，不猜 element type。Comparator 還原 `const void *` 的 domain type並回傳 ordering sign，不管理 traversal。`qsort`、`bsearch`、`lfind` 與 `lsearch` 只是套用到不同控制流程。

實作前可在每個 `void *` 旁標出隱藏的 `T`，把 `sizeof(array[0])` 留在呼叫處，並確認 callback sign、range、capacity 與 result lifetime。可靠的 generic C 不只會 cast，更能說清楚每個被 compiler 擦掉的關係。

## 參考資料

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 13: C Generics and Function Pointers, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/13/Lecture13.pdf)
- [POSIX: qsort](https://pubs.opengroup.org/onlinepubs/9799919799/functions/qsort.html)
- [POSIX: bsearch](https://pubs.opengroup.org/onlinepubs/9799919799/functions/bsearch.html)
- [POSIX: lfind and lsearch](https://pubs.opengroup.org/onlinepubs/9799919799/functions/lsearch.html)
- [cppreference: qsort](https://en.cppreference.com/w/c/algorithm/qsort.html)
