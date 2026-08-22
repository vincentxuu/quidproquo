---
title: "Stanford CS107 Lecture 12：Function Pointer 讓 Generic C 注入比較規則"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, generics, function-pointers]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 13
tldr: "CS107 第 12 講先用 char * 完成 byte-wise generic swap 與 rotate，再以 function pointer 把 bubble sort 的走訪機制和比較規則拆開；void * 解決資料型別，callback 解決行為差異。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 12：void pointer、byte-wise pointer arithmetic、memmove、generic rotate、function pointer、callback 與 bubble sort。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-function-pointers-en)

C 沒有 template，仍能避免為每種型別複製演算法。Lecture 12 把泛型拆成資料定址與比較規則：`void *` 加 width 解決前者，function pointer 讓 caller 注入後者。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 12，2026-02-02
- calendar 標題：Generics, `void *`, and Function Pointers
- 投影片標題：C Generics and Function Pointers
- 講者：PDF 未單獨署名；版權頁列 Stanford CS、Lisa Yan、Nick Troccoli 與 Katie Creel
- 已讀材料：官方 calendar、完整 32 頁投影片、POSIX `memmove` 規格、cppreference 的 pointer、`memmove` 與 `qsort` 條目
- 材料缺口：Canvas 錄影與 lecture code 未公開

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)列出 C generics、function pointers 與 callback。路線是泛化 `swap_ends_int`、以 bytes 定址、完成 `rotate`、處理 overlap，再把 bubble sort 的 ordering 改成 caller 傳入的函式。下一講才泛化 element type。

## 從 typed `swap_ends_int` 找出真正不變的機制

先看只接受整數陣列的版本：

```c
void swap_ends_int(int arr[], size_t len) {
    int tmp = arr[0];
    arr[0] = arr[len - 1];
    arr[len - 1] = tmp;
}

int nums[] = {7, 2, 3, 4, 5, 6, 1};
size_t len = sizeof(nums) / sizeof(nums[0]);
swap_ends_int(nums, len);
// nums[0] == 1, nums[6] == 7
```

它看似充滿 `int`，實際機制只有兩件事：算出第一與最後一個元素的位址，再交換兩段相同寬度的 bytes。若前一講已經有 generic `swap(void *a, void *b, size_t size)`，typed wrapper 可縮成：

```c
void swap_ends_int(int arr[], size_t len) {
    swap(&arr[0], &arr[len - 1], sizeof(arr[0]));
}
```

換成 `short`、`float` 或 struct，結構仍相同；差別只有 `sizeof(arr[0])` 與步長。演算法不需要 element 語意，卻需要 width。

若 `len == 0`，`len - 1` 會在 unsigned `size_t` 下溢，而且沒有 endpoint 可交換。實作應先 `if (len < 2) return;`，或明訂 caller 不可傳空陣列。

## `void *` 保存地址，卻刻意不知道步長

第一個直覺版本無法通過標準 C：

```c
void swap_ends(void *arr, size_t len, size_t size) {
    swap(arr, arr + len - 1, size); // invalid in standard C
}
```

`void *` 可以承接 object pointer，適合表達「某塊資料的起點，元素型別不重要」。但 `void` 沒有大小，也不能解參照。編譯器看到 `int *p + 1`，能以 `sizeof(int)` 縮放；看到 `void *` 則不知道一格是多少。部分編譯器把 `void *` arithmetic 當 extension，以一 byte 處理，portable C 不該依賴它。

[cppreference 的 pointer 說明](https://en.cppreference.com/w/c/language/pointer.html)區分 object pointer、function pointer 與 `void *`。Object pointer 可和 `void *` 互轉，但這只提供通用地址，不是 runtime type information；count、width、alignment 與 lifetime 若有需要，仍要另外傳入。

可攜的實作先轉成 byte pointer，再自行乘上寬度：

```c
void swap_ends(void *base, size_t len, size_t elem_size) {
    if (len < 2) return;
    char *bytes = base;
    void *last = bytes + (len - 1) * elem_size;
    swap(base, last, elem_size);
}
```

`char` 依定義是一 byte，所以 `char *` 加一就是逐 byte 移動。最後一個元素地址是 `base + (len - 1) * elem_size`。投影片稱它為「`char *` hack」；其實只是把位址單位降到 bytes。

呼叫端仍握有 typed array，因此應由它提供寬度：

```c
fraction ratios[] = {{5, 7}, {11, 18}, {13, 27}};
swap_ends(ratios,
          sizeof(ratios) / sizeof(ratios[0]),
          sizeof(ratios[0]));
```

這裡交換完整 object representation，不理解欄位。對 pointer array 也是交換 pointer values，不是字串內容。寬度一旦傳錯，函式只會在錯誤邊界搬動 bytes。

## Generic `rotate`：先用半開區間說清楚資料形狀

第二個練習把 `[front, end)` 旋轉，使 `[front, separator)` 移到尾端，並維持兩段內部的相對順序：

```c
int array[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
rotate(array, array + 3, array + 10);
// {4, 5, 6, 7, 8, 9, 10, 1, 2, 3}
```

半開區間讓 `end` 指向 one-past。Prefix 寬度是 `separator - front`，suffix 寬度是 `end - separator`，兩者都是 byte counts。三個 pointers 必須位於同一 contiguous block，順序為 `front <= separator <= end`。

概念上需要三次搬移：prefix 到暫存區、suffix 往前、暫存 prefix 放到尾端。

```c
void rotate(void *front, void *separator, void *end) {
    size_t width = (char *)end - (char *)front;
    size_t prefix_width = (char *)separator - (char *)front;
    size_t suffix_width = width - prefix_width;

    if (prefix_width == 0 || suffix_width == 0) return;

    char temp[prefix_width];
    memcpy(temp, front, prefix_width);
    memmove(front, separator, suffix_width);
    memcpy((char *)end - prefix_width, temp, prefix_width);
}
```

第一與第三次 copy 使用獨立的 `temp`，不會重疊；第二次把 suffix 往低地址移，source 與 destination 會交疊。原先三次都用 `memcpy` 的版本因此有漏洞。

投影片用 variable-length array 保存 prefix；大型輸入可能耗盡 stack，可改用 heap 或 in-place 演算法。這不改變 overlap 判斷。

## `memcpy` 與 `memmove` 的差別是契約，不是運氣

兩者都複製指定數量的 bytes，也都回傳 destination。差異在 ranges 是否允許 overlap。[POSIX `memmove` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memmove.html)用一個精確的抽象描述語意：先把 source 的 `n` bytes 複製到不與兩側重疊的暫存陣列，再從暫存陣列複製到 destination。實作不必真的配置完整暫存區，但結果必須像這樣。

[cppreference 的 `memmove` 條目](https://en.cppreference.com/w/c/string/byte/memmove.html)也指出，超出有效範圍或 pointers 無效仍是 undefined behavior。`memmove` 只處理 overlap，不驗證容量或補 terminator。

投影片用 Pascal string 原地轉成 C string：第零格存長度，字元從 index 1 開始；轉換時 source `s + 1` 與 destination `s` 重疊。

```c
void pascal_to_c_string(char *s) {
    size_t len = (unsigned char)s[0];
    memmove(s, s + 1, len);
    s[len] = '\0';
}
```

不能因 `memcpy` 某次「剛好從前往後複製」就宣稱安全；overlap 已違反其契約。已證明不重疊時使用 `memcpy`，則能表達這項保證並保留最佳化空間。

Pascal 範例仍要求 buffer 能寫入 `s[len]`。轉成 `unsigned char` 可避免 signed `char` 把長度變成負值；真實介面也應攜帶 capacity。

## Bubble sort 先固定資料型別，觀察哪一條規則仍寫死

Bubble sort 重複掃描相鄰元素，若順序錯誤就交換；某次完整 pass 沒有交換即可結束。第一輪會把最大值推到末端，後續每輪至少固定一個尾端位置，所以長度為 `n` 的陣列最多需要 `n - 1` 個有意義的 passes，再以無交換 pass 偵測完成。

```c
void bubble_sort_int(int arr[], size_t n) {
    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            if (arr[i - 1] > arr[i]) {
                swap(&arr[i - 1], &arr[i], sizeof(arr[0]));
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

真正寫死的是 `>`：它假設 element 是 `int` 且採 ascending order。`bool ascending` 只能二選一；enum 仍得為 odd before even、絕對值或結構欄位持續新增 case，把 client policy 塞回共同機制。

固定名稱 `should_swap` 也不夠，每次呼叫仍只有一種 global behavior。演算法必須接收「這一次要呼叫哪個函式」。

## Function pointer：把程式行為本身當作參數

第三個參數可宣告為接受兩個 `int`、回傳 `bool` 的 function pointer：

```c
void bubble_sort_int(
    int arr[],
    size_t n,
    bool (*should_swap)(int, int)
) {
    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            if (should_swap(arr[i - 1], arr[i])) {
                swap(&arr[i - 1], &arr[i], sizeof(arr[0]));
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

括號不能省。`bool *should_swap(int, int)` 會宣告「回傳 `bool *` 的函式」；`bool (*should_swap)(int, int)` 才是「指向函式的 pointer」。實務上可用 typedef 降低噪音：

```c
typedef bool (*int_swap_predicate)(int, int);

void bubble_sort_int(int arr[], size_t n,
                     int_swap_predicate should_swap);
```

函式名稱用在這個呼叫情境時會轉成 function pointer；因此傳 `sort_ascending` 不必手寫 `&sort_ascending`，呼叫時寫 `should_swap(a, b)` 也不必寫 `(*should_swap)(a, b)`。兩種形式都能表達意思，簡潔形式較常見。

這裡的 callback 契約不是「one 比 two 小」或一般三向 comparator，而是「這一對目前順序不對，是否該交換」。因此 ascending callback 在左值較大時回 true：

```c
bool sort_ascending(int one, int two) {
    return one > two;
}

bool sort_descending(int one, int two) {
    return one < two;
}

bool sort_abs(int one, int two) {
    return abs(one) > abs(two);
}
```

命名與契約必須一起讀，否則很容易把「先後關係」與「是否交換」的極性寫反。`sort_abs` 還有整數邊界：對最小可表示負整數呼叫 `abs` 的結果不能用正 `int` 表示。若資料可能包含該值，就應使用不溢位的 magnitude 比較，而不是把課堂示例直接當成完整 library comparator。

## Callback 分離 mechanism 與 policy，但型別仍要吻合

排序函式掌管 mechanism：何時走訪、比較哪些相鄰位置、何時交換、何時停止。callback 掌管 policy：什麼叫 out of order。client 每次呼叫可以選擇不同函式，不必修改排序實作。這就是「call back」的含義：library 在演算法進行到需要 domain decision 的位置，回頭呼叫 client 提供的程式碼。

Function pointer 不是無型別地址。參數與回傳型別必須相容；object pointer 與 function pointer 也不同，`void *` 並不是標準 C 的 generic function pointer。

Callback 雖能讀 global state 或修改資料，但結果若反覆變動，sort 可能不收斂。健全 predicate 應維持一致 ordering、避免副作用，並對相等元素回 false；function type 本身無法檢查這些語意。

## 和標準函式庫 `qsort` 對照

本講只泛化 ordering，資料仍是 `int[]`。標準函式庫 [`qsort`](https://en.cppreference.com/w/c/algorithm/qsort.html)則同時接收 `void *base`、count、element size，以及 `int (*comp)(const void *, const void *)`，展示完整 C-style generic sorting。

它的 comparator 以負、零、正代表在前、等價、在後，不能代入 `bool should_swap`。`a - b` 可能 overflow，可用 `(a > b) - (a < b)`。下一講才合併資料定址與 ordering。

## 型別安全的交換與一個可做的練習

泛型把證明責任移給 caller：base 要可寫且存活，寬度要吻合；function type 也不知道 predicate 是否穩定。練習時可把 typed helper 的 address、width、policy 圈出，依序改成 byte arithmetic、size 參數與 callback。無法從 prototype 推導的條件，就補成 assertion 或文件。

## 本講最值得留下的心智模型

`void *` 是未知型別 object 的地址，不是未知寬度元素的 iterator；走訪時要另帶 width。Byte algorithm 只搬 object representation，range 與 lifetime 由 caller 保證。`memcpy` 要求不重疊，`memmove` 才定義 overlap。Function pointer 則把 client policy 變成參數，但 signature 與 ordering 契約仍要吻合。

共同工作留在 library，資料寬度與決策交還 caller；型別保存得愈少，契約就必須愈精確。

## 參考資料

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 12: C Generics and Function Pointers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/12/Lecture12.pdf)
- [cppreference: Pointer declaration](https://en.cppreference.com/w/c/language/pointer.html)
- [POSIX: memmove](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memmove.html)
- [cppreference: memmove](https://en.cppreference.com/w/c/string/byte/memmove.html)
- [cppreference: qsort](https://en.cppreference.com/w/c/algorithm/qsort.html)
