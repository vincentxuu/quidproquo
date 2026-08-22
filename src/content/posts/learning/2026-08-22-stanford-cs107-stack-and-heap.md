---
title: "Stanford CS107 Lecture 10：Stack 與 Heap 的差別不是速度，而是 Lifetime 與 Ownership"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, memory-management, heap]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 11
tldr: "CS107 第 10 講從 sizeof 與 pointer arithmetic 走進 stack frame lifetime：回傳 local array 會留下 dangling pointer；malloc 讓資料跨越函式返回，但也把 NULL、容量計算、ownership、free 與 memory leak 交給程式設計者。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 10：stack frame、dangling pointer、Mayday 案例、malloc、calloc、strdup、free 與 heap ownership。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-stack-and-heap-en)

本講問資料活多久、誰結束生命。Local array 隨函式 frame 存活；heap allocation 可跨越函式返回，但程式必須保存 ownership 並 `free`。

`create_string` 確實建立 `"aaaa"` 並回傳當時的位址；但 pointer 抵達 caller 時，pointee 已結束 lifetime。Heap 修正生命週期，不會自動修正容量、初始化、配置失敗或釋放責任。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 10，2026-01-28
- 官方標題：Stack and Heap
- 講者：syllabus 列 Jerry Cain；PDF 未另列講者
- 已讀材料：calendar、46 頁投影片與四份 POSIX Issue 8 配置規格
- 材料缺口：PDF 可還原 stack animation，沒有 narration；Canvas 錄影與 lecture code 未公開

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)從本講進入 Topic 3。Agenda 是 array `sizeof`、pointer arithmetic、memory segments、stack frame、Mayday dangling pointer、`malloc`、dynamic-memory etude、heap 適用時機、`calloc`／`strdup` 與 `free`。

## 進 heap 之前，先把 array 與 pointer 的兩個尺度分清楚

```c
char fruit[6];
strcpy(fruit, "grape");
size_t bytes = sizeof fruit; // 6
```

在宣告作用域裡，`sizeof fruit` 取得整個陣列大小。傳入函式後不同：

```c
void func(char *str) {
    size_t bytes = sizeof str; // pointer size, slides show 8 on myth
}
```

函式只接到首元素位址，容量不在 pointer 裡。投影片的 64-bit myth 顯示 `sizeof(str) == 8`；可攜式程式不能寫死 pointer size 或據此推回容量。

Pointer arithmetic 依 pointee type 縮放：

```c
int numbers[] = {52, 23, 12, 34, 16, 45};
int *nums1 = numbers + 1;
int *nums3 = nums1 + 2;
printf("%td\n", nums3 - nums1); // 2
```

`+ 1` 會前進 `sizeof *numbers`。同一陣列內的 pointers 相減，結果是元素距離。配置 `len` 個 `int` 則需 `len * sizeof(int)` bytes。

## Memory segment 圖是模型，不是可攜式地址承諾

投影片把位址空間分成 stack、heap、data、BSS、text 與 kernel region：函式 frame 在 stack、動態配置在 heap、globals 依初始化狀態進 data 或 BSS、machine code 在 text。

圖中 stack 從高位址向下、heap 從低位址向上，是常見實作的教學模型，不是 C 語言要求每台機器採用的地址方向。程式不能依靠「local A 的地址一定比 local B 大」推論 lifetime 或配置方式。能依靠的是語言與函式契約：automatic object 在 block／function 執行期間存在；allocated object 從成功配置開始，持續到釋放或重新配置。

同樣地，「stack variable 返回後消失」不是保證 bytes 立刻被擦成零。它表示物件 lifetime 結束，程式不再有權透過舊 pointer 存取。實體 bytes 可能暫時保留，也可能立刻被下一個 frame 重用；兩種情況都不能讓 dangling pointer 重新合法。

## Stack frame 的價值是自動 lifetime

```c
void func2(void) {
    int d = 0;
}

void func1(void) {
    int c = 99;
    func2();
}

int main(void) {
    int a = 42;
    int b = 17;
    func1();
    func2();
}
```

`main` 執行時有自己的 frame；呼叫 `func1` 加入另一個 frame，再呼叫 `func2` 又加入一個。內層返回時，其 locals 的 lifetime 結束，空間可供後續呼叫使用。投影片動畫顯示 `main` 後來直接呼叫 `func2` 時，新 frame 可以覆蓋先前 `func1` 用過的位置。

Stack 的主要便利是 cleanup 與控制流程綁定：正常離開 scope 時，automatic storage 不需要 caller 記得釋放。代價則是資料不能自然跨越 declaring activation。把 pointer 傳給更深一層函式、在所有者仍存活時使用沒有問題；把它保存到所有者返回後再用，就超過 lifetime。

這也說明 recursion 為何每層能有自己的 locals：每次呼叫是不同 activation，各自有 frame 與物件。相同變數名稱不代表相同 object。

## Mayday：位址還在，物件已不存在

```c
char *create_string(char ch, int num) {
    char new_str[num + 1];
    for (size_t i = 0; i < num; i++) {
        new_str[i] = ch;
    }
    new_str[num] = '\0';
    return new_str;
}

int main(void) {
    char *str = create_string('a', 4);
    printf("%s\n", str);
}
```

在 `create_string` 執行期間，`new_str` 確實是合法、可寫、容量足夠的 local array。迴圈寫入四個 `'a'`，最後補 NUL；`return new_str` 時 array expression 轉成首元素位址，位址值也確實複製給 caller。

錯誤發生在函式返回這個時間點。`new_str` 的 lifetime 隨 frame 結束，`str` 成為 dangling pointer。`printf` 解參照它就是 undefined behavior。偶爾印出 `aaaa` 不是成功，只是舊 bytes 尚未被覆蓋；加入另一個函式呼叫、換編譯最佳化或改一行 logging，都可能讓相同 bug 顯現成垃圾字元或 crash。

投影片用逐頁 animation 強調 stack reuse：前一個 frame 的位置可被新 frame 覆蓋。這不是 bug 的根本原因，而是讓 bug 變得可見的其中一種方式。即使 bytes 完全沒變，物件 lifetime 已結束仍足以判定使用不合法。

若 caller 事先知道大小，也可以讓 caller 配置 array，再把 buffer 與 capacity 傳進 helper。這保留自動 lifetime，並把所有權留在 caller。當資料必須由 callee 決定大小並跨越 return，才需要 dynamic allocation。

## `malloc` 配置 raw bytes，不知道你想存什麼

```c
void *malloc(size_t size);
```

[POSIX `malloc` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/malloc.html)說，函式配置 `size` bytes 的未使用空間，內容值 unspecified。成功時回傳適合 fundamental alignment 物件使用的起始位址；失敗時回傳 null pointer。它不知道這些 bytes 將被解讀成 `int` array、C string 或 `struct node`。

```c
int *arr = malloc(n * sizeof *arr);
char *text = malloc(strlen(source) + 1);
struct node *node = malloc(sizeof *node);
```

C 的 `void *` 可指定給 object pointer，不需要像 C++ 額外 cast。使用 `sizeof *arr` 而非重複寫型別，能讓宣告型別改動時配置公式一起更新。

但乘法可能 overflow。若 `n * sizeof *arr` 在 `size_t` 裡繞回小數，`malloc` 可能成功配置「算錯後的小 buffer」，後續迴圈仍按 `n` 寫入。配置前要證明 `n <= SIZE_MAX / sizeof *arr`，或使用會檢查乘法的介面。零大小請求也不能當一般陣列使用；POSIX 允許回傳 null，或回傳不可用來存取物件的特殊結果。

## Heap 版本修正 lifetime，同時建立 ownership

```c
char *create_string(char ch, size_t num) {
    if (num == SIZE_MAX) return NULL;

    char *new_str = malloc(num + 1);
    if (new_str == NULL) return NULL;

    for (size_t i = 0; i < num; i++) {
        new_str[i] = ch;
    }
    new_str[num] = '\0';
    return new_str;
}

int main(void) {
    char *str = create_string('a', 4);
    if (str == NULL) return 1;
    printf("%s\n", str);
    free(str);
}
```

配置物件不屬於 `create_string` 的 stack frame，所以函式返回後仍存活。Caller 接到的不只是 pointer，也接到 ownership：成功時它必須安排恰好一次釋放。介面若沒有說明 return value 是 borrowed 還是 owned，使用者就不知道該不該 `free`。

投影片在教學環境以 `assert(new_str != NULL)` 讓配置失敗立即暴露。正式介面也可能回傳 `NULL`，讓 caller 傳遞錯誤或清理既有資源；選擇取決於程式是否能恢復。不能做的是忽略回傳值後直接 `new_str[0]`。

Heap 不保證比較大就一定成功，也不代表作業系統立刻提供實體 pages。本文只依公開函式契約處理：成功得到可用區塊，失敗得到 null；不要把特定系統的 overcommit 行為寫進一般 C 邏輯。

## Dynamic-memory etude：元素數量要轉成 bytes

```c
int *array_of_multiples(int mult, size_t len) {
    if (len > SIZE_MAX / sizeof(int)) return NULL;

    int *arr = malloc(len * sizeof *arr);
    if (len != 0 && arr == NULL) return NULL;

    for (size_t i = 0; i < len; i++) {
        arr[i] = mult * (int)(i + 1);
    }
    return arr;
}
```

投影片選項中的正解是 `malloc(len * sizeof(int))`，不是 local `int arr[len]`。Local array 會在返回時失效；`malloc(sizeof(int))` 只夠一個元素；數值陣列不像 C string，不需要為 terminator 多配置一格。

這個例子也顯示 API 必須一起回傳或另行保存 `len`。Heap pointer 自身不知道配置了多少 elements，callee 返回後 `sizeof arr` 仍只是 pointer size。若 caller 丟失長度，配置器不會替應用程式恢復陣列界線。

另外，`mult * (i + 1)` 的整數運算也可能 overflow；這是元素值的問題，與 allocation-size overflow 不同。安全檢查必須針對每個算術契約，不是成功 `malloc` 就全部解決。

## 何時 heap 比 stack 合適

投影片列四種情境。第一，資料必須活過目前函式呼叫；Mayday 就是代表。第二，要建立 linked list、tree、hash table 或可擴張 array，節點數量與生命週期由 runtime 決定。第三，所需空間很大或難以預測，不適合壓在有限 stack 上。第四，多個函式或模組需要共享同一資料，又不方便由較外層 scope 直接擁有。

這不是「只要大小在 runtime 才知道就必須 heap」。C 有 variable-length array，但它仍受 stack lifetime 與可用空間限制。反過來，小物件也可能因需要跨函式或組成長壽命資料結構而適合 heap。

選擇時可先回答：最晚使用者是誰、哪個 scope 能自然涵蓋它、最大大小能否合理設限、所有權是否唯一。若 outer caller 能配置並傳入 buffer，通常能避免配置；若大小與 lifetime 都由 callee 產生，owned heap return 才更自然。

## `calloc`：配置元素陣列並將所有 bits 設為零

```c
int *counts = calloc(26, sizeof *counts);
bool *answers = calloc(n, sizeof *answers);
```

[POSIX `calloc` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html)將介面拆成 element count 與 element size，並保證配置空間初始化成 all bits zero。Issue 8 還明列 `nelem * elsize` overflow 時以配置失敗處理，這是直接 `malloc(n * size)` 沒替 caller 提供的乘法保護。

All-bits-zero 不應被無限制翻譯成「任何型別的語意零值」。投影片使用 `int`、`bool` 與 pointer 範例來建立常見直覺；可攜式 code 仍應依目標型別的表示保證判斷。對 bytes buffer 或需要明確清零的整數陣列，`calloc` 能把配置與初始化合在同一契約裡。

和 `malloc` 一樣，結果可能為 `NULL`，成功結果最後要交給 `free`。它不是 garbage collector，也不記得 application-level owner。

## `strdup`：方便的字串複製，同樣移交 ownership

```c
char *news = strdup("disinformation");
if (news == NULL) return 1;
news[0] = 'm';
free(news);
```

[POSIX `strdup` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html)保證成功時回傳新配置的 duplicate string，回傳值可以交給 `free`；建立失敗則回傳 null。這跟 `const char *p = "disinformation"` 不同：`strdup` 的新 bytes 在 allocated storage 中，成功後可以修改。

便利函式沒有取消 ownership。每次成功 `strdup` 都建立一份待釋放資源。把結果直接覆蓋：

```c
news = strdup("replacement");
```

若沒有先保存並釋放舊位址，就失去最後一條能找到舊 allocation 的路，形成 memory leak。更新 owned pointer 時應先用暫存 pointer 接新結果，確認成功後再釋放與替換。

## `free` 結束 allocation lifetime，不會清除所有 aliases

```c
void free(void *ptr);
```

[POSIX `free` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)說，`free` 讓該空間可供後續配置。`free(NULL)` 不做任何事；其他參數必須匹配尚未釋放、由相容配置函式回傳的位址。Double free、釋放 stack address、釋放 allocation 中間的 pointer，行為都未定義。

```c
char *text = strdup("earth");
char *alias = text;
free(text);
text = NULL;
```

把 `text` 設為 `NULL` 能避免自己誤用，卻不會改掉 `alias`；它仍是 dangling pointer。`free` 不會追蹤並清空所有 copies。Ownership 規則要限制誰能釋放、其他 borrowers 何時停止使用。

Failure to free 造成 leak：allocated object 已不再需要，程式卻沒有歸還，或甚至弄丟最後一個 pointer。Use-after-free 則相反：已歸還後仍透過 alias 使用。兩者都來自 lifetime 與 ownership 沒有在資料流中被清楚表達。

## 一份今晚就能套用的 ownership checklist

每看到 allocation，立刻在 code review 寫下五件事：

1. 請求 bytes 的公式是什麼，乘法與加法會不會 overflow？
2. 配置失敗如何處理，零大小輸入的政策是什麼？
3. 回傳 pointer 是 owned、borrowed，還是 shared？
4. 所有成功路徑與錯誤路徑各由誰 `free`？
5. `free` 之後還有哪些 aliases 可能被使用？

接著逐條畫出 lifetime：automatic object 到 scope／activation 結束；allocated object到 `free`；literal 具有 static duration 但不可修改。Pointer 本身的 lifetime 與 pointee 分開畫，Mayday 的錯誤會立刻顯現——caller 的 `str` 活著，不代表它指向的 local array 還活著。

Lecture 10 的核心不是背 segment 圖，而是把「位址」與「可合法使用的期間」綁在一起。Stack 用控制流程自動管理 lifetime；heap 讓 lifetime 與呼叫堆疊脫鉤，換來明確 ownership。選 heap 不是取得永久記憶體，而是接下一份必須完成的 cleanup 工作。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 10: Stack and Heap（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/10/Lecture10.pdf)
- [POSIX Issue 8: malloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/malloc.html)
- [POSIX Issue 8: free](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)
- [POSIX Issue 8: calloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html)
- [POSIX Issue 8: strdup and strndup](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html)
