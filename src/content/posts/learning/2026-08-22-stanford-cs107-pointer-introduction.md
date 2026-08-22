---
title: "Stanford CS107 Lecture 8：指標不是魔法，而是可被複製的位址"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, pointers]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 9
tldr: "CS107 第 8 講從 & 取址與 * 解參照出發，說清楚 C 的 pointer parameter 為何仍是 pass-by-value，以及 int *、char *、char ** 如何分別修改 caller 擁有的 int、char 與 pointer。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 8：記憶體位址、指標宣告、alias、pointer parameters、char **、typed swap 與 rotation。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-pointer-introduction-en)

C 的指標常被教成符號規則：宣告加星號、呼叫加 `&`、使用時再加 `*`。這不容易回答真正的問題：函式改到哪一格記憶體？為何 pointer parameter 仍可能改不到 caller 的 pointer？

Stanford CS107 Winter 2026 的第 8 講把指標拉回最樸素的模型：pointer 是一個值，而那個值是某個物件的 memory address。C 的參數一律按值傳遞；傳 pointer 時，複製的不是目標物件，而是它的位址。callee 因而可以沿著複製來的位址找到 caller 擁有的物件。整講從 `int *` 一路走到 `char **`，其實只重複同一個問題：你究竟想修改值、指標，還是指標所指向的值？

## 本講資料與閱讀範圍

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 8，2026-01-23
- 官方標題：Introduction to Pointers
- 講者：課程 archive 列 Jerry Cain 授課；本講 PDF 沒有單獨署名，因此不進一步推定
- 已讀材料：官方 calendar、本講 22 頁投影片、GNU C Language Manual 的 pointer 與 dereference 章節，以及 SEI CERT C 的 null-pointer 規則
- 材料缺口：Canvas 錄影、課堂示範程式碼、AFS lecture code 與 starter repositories 不公開；本文重建公開投影片的完整 agenda，不假裝是逐字稿

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把這一講安排在 C strings 與 buffer overflow 之後、pointers and arrays 之前。這個位置很合理：前兩講已經頻繁看見 `char *`，現在才正式拆解它。依[官方 Lecture 8 投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/08/Lecture08.pdf)，完整路徑是回顧 C++ reference、建立 C pointer 的記憶體圖、練習 pointer parameters、用 `char **` 修改 pointer 本身，最後用 strongly typed swap 與 rotation 收束。

## 從 C++ reference 回到 C：需求沒有消失，只是介面變了

投影片先回顧 C++ 的 pass-by-reference。若要讓 helper 把 caller 的 `x` 從 2 改成 3，C++ 可以把參數宣告成 reference：

```cpp
void func(int& num) {
    num = 3;
}

int main() {
    int x = 2;
    func(x);
    // x is now 3
}
```

`num` 在函式內像是 `x` 的另一個名字。呼叫端不必寫出位址，函式內也不必顯式解參照。C 沒有這種 C++ reference syntax，但「讓 helper 修改 caller 已有物件」的需求當然還在。C 的做法是把資料所在的位置明白放進介面：

```c
void func(int *num) {
    *num = 3;
}

int main(void) {
    int x = 2;
    func(&x);
    printf("%d\n", x);  // 3
    return 0;
}
```

`x` 是 `int` 物件；`&x` 是位址，型別為 `int *`；`num` 收到位址副本；`*num` 才是位址指向的 `int`。`*num = 3` 沒有把 3 寫進 pointer，而是沿 pointer 找到 `x`，再把 3 寫進 `x`。

## `&` 產生位址，`*` 沿位址找到物件

[GNU C Language Manual 的 pointer 章節](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointers.html)把 pointer 定義成用來記錄資料所在位置的值，並強調 pointer 的型別包含它所指向的資料型別。最小例子可以拆成四行：

```c
int score = 17;
int *p = &score;
int observed = *p;
*p = 29;
```

第一行配置一個 `int` 物件。第二行的 `&score` 對 `score` 使用 address-of operator，結果存進 `p`。第三行讀取 `p` 指向的物件，所以 `observed` 得到 17。第四行把同一個物件改成 29，於是直接讀 `score` 也會得到 29。

可以把它畫成兩個各自有位址的物件：

```text
address      object      stored value
0x1f0        score       17
0x310        p           0x1f0
```

`p` 不是飄在空中的箭頭；它自己也是一個需要儲存空間的變數，假設位於 `0x310`，內容才是 `score` 的地址 `0x1f0`。因此 `p`、`&p`、`*p` 是三個不同問題：`p` 求值為 `0x1f0`，`&p` 是 pointer 物件自己的位置 `0x310`，`*p` 則指定 `0x1f0` 上的 `int`。

同一顆星號在宣告與運算式裡扮演不同文法角色：

```c
int *p;       // declaration: p has type pointer to int
int value = *p; // expression: read the int designated by p
```

宣告可以從變數名稱往外讀：`p` 是 pointer to `int`。[GNU 的 pointer declaration 章節](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Declarations.html)也提醒，星號靠近型別或名稱只是排版選擇；`int *p` 與 `int* p` 的意思相同。真正容易踩坑的是一次宣告多個名稱：

```c
int *first, second;
```

只有 `first` 是 `int *`，`second` 仍是 `int`。每行只宣告一個變數，或對每個 pointer 名稱都寫出 `*`，比靠視覺猜型別可靠。

## Alias：兩個 pointer 可以通往同一個物件

Pointer assignment 複製的是位址。它不會複製目標物件：

```c
int total = 5;
int *left = &total;
int *right = left;

*right = 12;
printf("%d %d\n", total, *left); // 12 12
```

`left` 與 `right` 是不同的 pointer 變數，卻都存著 `total` 的地址。這種多個名稱或存取路徑指向同一物件的關係稱為 aliasing。`*right = 12` 改的是共同目標，所以之後透過 `total` 或 `*left` 讀取，都會看見 12。若改成 `right = NULL`，改到的則只是 `right` 自己；`left` 仍保存原地址，`total` 也沒有被清除。

這裡最值得養成的不是畫箭頭，而是每逢 assignment 都念出左側究竟是哪一層：

```c
right = left;   // copy an address into a pointer variable
*right = *left; // copy an int into an int object
```

第一行改 pointer 的值，第二行改 pointer 指向的值。兩者只差兩顆星號，對記憶體狀態的影響完全不同。

## Pointer parameter 本身仍是 pass-by-value

投影片最關鍵的一句是：C 的所有參數都 pass by value。`func(&x)` 並沒有開啟另一種傳遞模式；它只是先計算 `&x`，再把算出的地址複製給參數 `num`。

假設 `x` 位於 `0x1f0`，呼叫過程可以寫成：

```text
main frame                     func frame
x at 0x1f0: 2                 num at 0x010: 0x1f0
```

`num` 與 `x` 不在同一格，甚至型別也不同：前者是 `int *`，後者是 `int`。共用的是一段關係——`num` 的內容正好是 `x` 的位址。函式若執行 `num = NULL`，只會改自己的參數副本；若執行 `*num = 3`，才會沿著地址修改 caller 的 `x`。

這也給介面設計一個簡單判準：如果 helper 只需要讀一個小值，直接傳值；如果它必須修改某個既有物件，就傳那個物件的位置。pointer parameter 不是「比較進階的傳參」，而是把可共享的存取路徑當作普通值傳入。

## 第一首 etude：用 `char *` 修改 caller 的字元

投影片的 `flip_case` 要把 caller 的一個字元原地切換大小寫：

```c
void flip_case(char *cp) {
    if (isupper((unsigned char)*cp)) {
        *cp = (char)tolower((unsigned char)*cp);
    } else if (islower((unsigned char)*cp)) {
        *cp = (char)toupper((unsigned char)*cp);
    }
}

int main(void) {
    char ch = 'g';
    flip_case(&ch);
    printf("%c\n", ch); // G
}
```

三個空格可以用型別推回來。要改的是 `char ch`，呼叫端便傳 `&ch`；`&ch` 的型別是 `char *`，參數便宣告成 `char *cp`；要檢查與改寫的是目標字元，所以函式使用 `*cp`。這套推導比背「哪裡要加星號」穩定：先說出要共享哪個物件，再取它的地址，最後以相符型別接住。

## 第二首 etude：為什麼 `char *` 改不到 caller 的 `char *`

接著投影片故意給一個壞掉的 `skip_spaces`：

```c
void skip_spaces(char *s) {
    s += strspn(s, " ");
}

int main(void) {
    char *str = "            hello";
    skip_spaces(str);
    printf("%s\n", str); // still includes spaces
}
```

`strspn` 的計算可以完全正確，結果仍不符合需求。原因是 `s` 收到 `str` 所存地址的副本。`s += ...` 只讓 callee 的 local pointer 往後移；函式返回時，這份副本消失，caller 的 `str` 從未被寫入。

這和 `func(int *num)` 並不矛盾。前一例想修改的是一個 `int`，所以拿 `int *` 沿路找到它；這一例想修改的物件本身是 `char *str`，它的地址型別自然是 `char **`：

```c
void skip_spaces(char **p_str) {
    *p_str += strspn(*p_str, " ");
}

int main(void) {
    char *str = "            hello";
    skip_spaces(&str);
    printf("%s\n", str); // hello
}
```

現在 `&str` 指向 caller 的 pointer 物件，`p_str` 保存那個位置，而 `*p_str` 指定原本的 `char *str`。`*p_str += n` 改的正是 `str` 裡保存的地址。若再寫 `**p_str`，才會沿第二層位址取得某個 `char`。星號數量不是難度徽章，而是你從目前值到目標物件要走幾次間接存取。

可以把規則濃縮成一張型別表：

| 函式參數 | 函式可透過它修改的 caller-owned 物件 |
|---|---|
| `int *` | `int` |
| `char *` | `char` |
| `char **` | `char *` |

這張表沒有說函式一定會修改，也沒有保證地址有效；它只描述型別允許的存取層次。

## Dereference 是有前置條件的操作

「pointer 存地址」是入門模型，不代表任何 bit pattern 都能安全當地址使用。[GNU 的 pointer dereference 章節](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Dereference.html)明確區分 pointer value 與它所指定的物件：只有 pointer 指向可存取且型別相符的資料時，才能以 `*` 讀寫。

最明顯的反例是 null pointer：

```c
int *p = NULL;
*p = 42; // invalid
```

[SEI CERT C 的 EXP34-C 規則](https://wiki.sei.cmu.edu/confluence/display/c/EXP34-C.+Do+not+dereference+null+pointers)要求在可能為 null 時先驗證再解參照。Null 不是一個「值為零的 int 物件」所在地址，而是刻意表示沒有指向物件的 pointer value。除此之外，指向生命週期已結束的區域、越出陣列允許範圍，或把不相容型別硬解讀成另一型別，也都不能因為語法編譯成功就視為有效。

```c
void set_score(int *score) {
    if (score != NULL) {
        *score = 42;
    }
}
```

是否接受 null 是函式介面的一部分。若 null 合法，明確檢查並定義行為；若 null 不合法，呼叫者就必須維持前置條件。重點是不能把 `*p` 想成無條件的「取值指令」：它是一個宣稱，表示此刻 `p` 確實指定一個可存取物件。

## Strongly typed swap：交換的是目標，不是參數副本

本講最後用 swap 把前面的模型放進有用的函式：

```c
void swap_ints(int *one, int *two) {
    int temp = *one;
    *one = *two;
    *two = temp;
}

int x = 17;
int y = 29;
swap_ints(&x, &y);
```

`one` 與 `two` 各自仍是地址副本，但 `*one` 與 `*two` 指定 caller 的兩個 `int`。暫存值若誤寫成 pointer，或 assignment 少一顆星號，交換的就會是 local addresses，而不是目標整數。

字串例子則刻意交換 `char *` 變數，而不是複製字串內容：

```c
void swap_strings(char **one, char **two) {
    char *temp = *one;
    *one = *two;
    *two = temp;
}
```

呼叫 `swap_strings(&h, &w)` 時，`one` 與 `two` 分別指向 caller 的 pointer 變數。函式交換的是兩個地址值，所以 `h` 與 `w` 改為指向對方原本的字串；字串的 bytes 沒有搬家。這是 typed swap：交換 `int` 需要 `int *`，交換 `char *` 需要 `char **`，暫存變數也要是相同的目標型別。

投影片再用兩次 swap 組出三者 rotation：

```c
void rotate(char **p, char **q, char **r) {
    swap_strings(p, q);
    swap_strings(p, r);
}
```

若初始為 `p -> Fred`、`q -> Wilma`、`r -> Pebbles`，第一次交換後是 `Wilma, Fred, Pebbles`，第二次交換 `p` 與 `r` 後是 `Pebbles, Fred, Wilma`。追蹤時不要只在腦中看名稱；每一步寫下三個 pointer 目前保存哪個地址，就能避免把「搬動字串」和「重新接線」混為一談。

Strong typing 讓編譯器知道解參照後應存取多少 bytes，也能檢查 argument 是否相容；代價是 `int`、`double`、struct 與 pointer 各需不同 swap。這正是後續 `void *` generics 要接手的問題：只知道位置與大小時能做什麼，又會失去哪一些型別資訊。

## 一套可以實際使用的 pointer tracing 方法

遇到 pointer 題目時，可以採用以下做法：

1. 列出每個物件的名稱與型別，例如 `x: int`、`p: int *`、`pp: int **`。
2. 替每個物件畫獨立儲存格；pointer 自己也要有一格。
3. 遇到 `&x`，寫下「產生 x 的地址」，不要寫成「x 變成 pointer」。
4. 遇到 `*p`，先確認 `p` 目前保存哪個有效地址，再走到目標格。
5. 遇到函式呼叫，為每個 parameter 建立新格，複製 argument 的值。
6. 遇到 assignment，先判斷左側是 pointer 變數還是 pointer 指向的物件。

## 這一講真正要帶走的事

第一，pointer 是有型別的地址值，也是一個獨立變數。`p` 保存目標位置，`&p` 是 pointer 自己的位置，`*p` 才是目標物件。

第二，C 沒有因為 parameter 是 pointer 就改成 pass-by-reference。函式拿到地址的副本；它能修改 caller state，是因為副本仍通往同一個物件。修改 local pointer 與修改其 target 必須分開看。

第三，要修改哪一種 caller-owned object，就傳哪個 object 的地址。修改 `int` 用 `int *`，修改 `char` 用 `char *`，修改 `char *` 本身則用 `char **`。

第四，dereference 不是單純語法動作，而是一份有效性承諾。地址必須真的指向仍在生命週期內、可依該型別存取的物件；null pointer 不能解參照。

最後，swap 與 rotation 顯示 pointer 的力量不是「可以碰記憶體」這種空話，而是函式可以精確修改 caller 選定的物件。代價也同樣精確：呼叫端與函式必須共同維持型別、生命週期與有效地址的契約。下一講把 pointers 與 arrays 接起來時，這套逐格追蹤法會比任何口訣都可靠。

## 參考資料

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 8: Introduction to Pointers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/08/Lecture08.pdf)
- [GNU C Language Manual: Pointers](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointers.html)
- [GNU C Language Manual: Pointer Declarations](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Declarations.html)
- [GNU C Language Manual: Pointer Dereference](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Dereference.html)
- [SEI CERT C: EXP34-C. Do not dereference null pointers](https://wiki.sei.cmu.edu/confluence/display/c/EXP34-C.+Do+not+dereference+null+pointers)
