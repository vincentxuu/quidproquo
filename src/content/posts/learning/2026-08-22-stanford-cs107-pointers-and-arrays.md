---
title: "Stanford CS107 Lecture 9：Array 不是 Pointer，但它們在運算式裡合作"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, pointers, arrays]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 10
tldr: "CS107 第 9 講用 C strings 七條規則拆開 array object、pointer variable 與 string literal：array 常在運算式中退化成首元素指標，但儲存空間、可重新賦值性、可修改性與 sizeof 行為仍完全不同。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 9：陣列與指標、array-to-pointer conversion、string literal、pointer arithmetic、suffix 與跨函式 aliasing。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-pointers-and-arrays-en)

「array 就是 pointer」有誤。`arr[i]` 與 `*(arr + i)` 取得同一元素，函式參數也只收到首元素位址；但 array object 擁有元素空間，pointer variable 只存位址。前者不能重新賦值，且原作用域中的 `sizeof` 會算整個陣列；後者則相反。

Lecture 9 用「C strings 七誡」整理陷阱。每讀一行都要回答：這是 array object 還是 pointer value？字元存在哪裡？位址能否改指別處？透過它寫入是否合法？

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 9，2026-01-26
- calendar 標題：Pointers and Arrays
- 投影片標題：Arrays and Pointers
- 講者：syllabus 列 Jerry Cain；PDF 未另列講者
- 已讀材料：calendar、26 頁投影片、cppreference 三個條目與 SEI CERT STR30-C
- 材料缺口：Canvas 錄影與 lecture code 未公開；本文不虛構課堂討論

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)要求理解 array／pointer 轉換與連續記憶體。七條規則是：local `char[]` 可修改；array name 不可重新賦值；array 在多數情境轉成 pointer；string literal 不可修改；pointer 可重新賦值；位移產生 suffix；透過參數 alias 的修改會留在呼叫端。

## 先把三個東西分開：陣列物件、指標變數、字串常值

```c
char fruit[] = "apple";
char *food = fruit;
const char *label = "apple";
```

`fruit` 是六個 `char` 組成的 array object，內容是五個字母與 `\0`。宣告本身配置所有元素的儲存空間。`food` 是 pointer variable，它另外占一塊足以保存位址的空間，目前值是 `&fruit[0]`。`label` 也是指標，但指向由 string literal 產生、具有 static storage duration 的陣列。

[cppreference 的 array 條目](https://en.cppreference.com/w/c/language/array.html)將陣列定義為特定元素型別、連續配置且非空的 object sequence；元素數量在該陣列生命週期內不變。這跟 pointer 的定義不同：pointer value 可以指向物件或越過陣列末端一格的位置，pointer variable 則可以被重新指定成另一個合法位址。

`fruit` 在多數運算式裡會轉成首元素指標，因此常與 `food` 產生相同位址值；相同結果不代表相同物件種類。

## 第一條：local `char[]` 擁有可修改的元素

```c
char str[6];
strcpy(str, "apple");

// equivalent initialization
char other[] = "apple";

str[0] = 'A';
other[4] = 'y';
```

兩個宣告都建立可修改的陣列。第二種語法使用 string literal 當 initializer，把包含 terminator 的內容放進新陣列；它不是讓 `other` 永遠指向 literal。投影片以 local 變數說明這些 bytes 位於宣告函式的 stack frame，因此在陣列生命週期內可寫。

更一般地說，可修改性由實際物件與型別限定決定，不該只靠猜位址在哪個 segment。local non-`const` array 是本講最清楚的案例；static array、heap allocation 也可能可寫。判斷時要看資料怎麼建立、生命週期與介面契約，而不是看到 `char *` 就斷定可修改。

`char str[] = "apple"` 會由 initializer 推導容量 6；若手寫 `char str[5] = "apple"`，就沒有位置存 terminator，不能把結果當正常 C string。陣列可寫不代表任何寫入索引都合法，容量邊界仍然存在。

## 第二條：array name 不能被重新賦值

```c
char good[12];
strcpy(good, "Dr. Jekyll");

char evil[] = "Mr. Hyde";
good = evil; // compile-time error
```

`good` 不是可存放新位址的 pointer variable；它是已配置好的十二元素陣列。指定運算無法把這整塊物件改成「從此代表 evil 的儲存區」。[cppreference 的 array assignment 說明](https://en.cppreference.com/w/c/language/array.html)同樣指出，array type 的物件不是 modifiable lvalue，不能直接以 assignment operator 指定，即使包在 `struct` 中的陣列可隨整個 struct 一起複製。

若目標是複製字串內容，用有容量證明的 copy；若目標是讓名稱改指別處，就需要 pointer variable：

```c
char *current = good;
current = evil; // pointer now holds &evil[0]
```

這只改 `current` 保存的位址，不會搬動或複製任何字元。`good` 與 `evil` 仍是原本兩塊陣列，大小在各自生命週期內不變。

## 第三條：array-to-pointer conversion 發生在多數運算式，不是所有地方

```c
void fun_times(char *str) {
    /* str stores an address */
}

int main(void) {
    char local_str[5] = "rice";
    fun_times(local_str);
}
```

呼叫時沒有複製五格陣列。`local_str` 轉成指向首元素的 pointer，位址值按值傳入 `str`。函式參數寫成 `char str[]` 也一樣；在 function parameter declarator 中，它會調整為 pointer type。

[cppreference 的 array-to-pointer conversion](https://en.cppreference.com/w/c/language/array.html)把規則寫得更精確：除了作為 `&`、`sizeof`、`typeof`／`typeof_unqual` 或用來初始化字元陣列的 string literal 等特定操作數，多數 array expression 都轉成指向首元素的非 lvalue pointer。這些例外正是「array 永遠是 pointer」會失敗的地方。

```c
char local_str[5] = "rice";

sizeof local_str; // 5: operand remains an array here
&local_str;       // pointer to the whole array, type char (*)[5]
local_str + 2;    // conversion, then pointer to local_str[2]
```

`local_str` 與 `&local_str[0]` 在一般值情境給出相同起始位址；`&local_str` 的數值地址通常相同，型別與步長卻不同。前者加一移動一個 `char`，後者加一跨過整個五元素陣列。投影片稱 `char *food = &fruit;` misleading，原因就在這裡：即使某些編譯器只警告或接受不相容轉換，也不該抹掉型別差異。

## `sizeof` 是最實用的反例：進函式前後答案不同

```c
void inspect(char items[]) {
    printf("%zu\n", sizeof items); // sizeof(char *), not array capacity
}

int main(void) {
    char items[40];
    printf("%zu\n", sizeof items); // 40
    inspect(items);
}
```

在 `main` 中，`items` 仍是完整 array operand，所以 `sizeof` 取得整個陣列 bytes。到了 `inspect`，宣告中的 `char items[]` 已調整成 `char *items`；`sizeof` 只能量 pointer object。這不是執行期把容量弄丟，而是函式型別從一開始就沒有攜帶原陣列長度。

因此接受陣列的函式若需要邊界，必須另外接收 element count 或 byte capacity：

```c
void inspect(char *items, size_t capacity);
```

呼叫端還握有 array object 時可以傳 `sizeof items`。不要在 callee 裡用 `sizeof parameter` 猜回容量，也不要把 pointer size 恰好等於某個小 buffer 大小當作測試通過。

## 第四條：string literal 產生陣列，但修改它是 undefined behavior

```c
char salutation[] = "Good day!";
char *greeting = "Hello, world!";

salutation[3] = 'f'; // valid array write
greeting[0] = 'h';   // undefined behavior
```

第二行在 C 中可能編譯，卻不授權寫入 literal 的字元。[cppreference 的 string literal 條目](https://en.cppreference.com/w/c/language/string_literal.html)指出，程式嘗試修改 string literal 所形成的陣列，行為未定義；相同內容的 literals 是否使用同一儲存區也未指定。[SEI CERT STR30-C](https://wiki.sei.cmu.edu/confluence/display/c/STR30-C.+Do+not+attempt+to+modify+string+literals)因此建議只把 literals 指派給指向 `const char` 的指標。

```c
const char *greeting = "Hello, world!";
```

`const` 讓編譯器在 `greeting[0] = 'h'` 處阻止錯誤，而不是等程式執行後看它 crash、靜默失敗或看似成功。Undefined behavior 的意思不是保證 segmentation fault；沒有可靠的 runtime probe 能普遍判斷某個 `char *` 背後是否可寫。

這也會沿著搜尋函式傳遞。CERT 規則特別指出，若 `strchr`、`strrchr` 或 `strstr` 的第一個引數來自 literal，回傳的 interior pointer 仍指向不可修改的同一儲存區。函式原型歷史上可能回傳 `char *`，不等於取得修改權。

## 函式如果要改字元，mutability 必須是介面前置條件

```c
void capitalize(char *text) {
    text[0] = (char)toupper((unsigned char)text[0]);
}
```

`capitalize` 無法光看位址可靠判斷 caller 傳來的是可寫陣列、heap buffer，還是透過非 const pointer 指到 literal。函式能做的是把契約寫清楚：`text` 必須指向至少一個可寫字元並有合法生命週期；若需要處理空字串，先檢查 terminator。

只讀函式則接受 `const char *`。這不只是文件，它使可寫陣列與 literal 都能安全傳入，同時禁止函式透過該參數修改字元。需要輸出修改結果但不想要求 caller 提供 mutable input 時，可改成接受 source、destination 與 capacity，將複製責任明確化。

## 第五條：pointer variable 可重新賦值，因為它保存的是位址

```c
const char *elphaba = "Idina Menzel";
const char *understudy = "Shoshana Bean";
elphaba = understudy;
```

指定後，兩個 pointer variables 保存相同位址。`"Idina Menzel"` 的 bytes 沒被覆寫，也沒有發生字串 copy；只是 `elphaba` 不再指向它。pointer assignment 改的是導航資訊，不是目的地物件。

同理：

```c
char fruit[] = "apple";
char *food = fruit;
char *same = &fruit[0];
```

`food` 與 `same` 都 alias `fruit[0]`。透過任一指標寫入合法索引，`fruit` 觀察到同一變化。把 pointer 改指別處，則不會改動 `fruit`。這兩種「改」必須分清：`food = other` 修改 pointer value；`food[0] = 'A'` 修改 pointee。

## 第六條：pointer arithmetic 依元素型別縮放，合法範圍仍在同一陣列

```c
const char *a = "peach";
const char *b = a + 1;
const char *c = a + 3;

printf("%s\n", a); // peach
printf("%s\n", b); // each
printf("%s\n", c); // ch
```

對 `char *` 加一移動一個 `char`；對 `int *` 加一會移動一個 `int` 的距離。[cppreference 的 pointer arithmetic 說明](https://en.cppreference.com/w/c/language/operator_arithmetic.html)限制結果必須指向同一 array object 的元素，或恰好 one-past-the-end。One-past pointer 可用於比較與迴圈終點，但不能解參照。

`a + 5` 指向 `"peach"` 的 terminator，因此可作為空 suffix 印出；`a + 6` 是 one-past whole array，不能當 C string 使用，因為從那裡開始沒有屬於此陣列的可讀 terminator。再往後做 arithmetic 已超出同一陣列規則。

這個界線讓 suffix 技巧變得精確：offset 必須落在可見字元或 terminator 的索引範圍內，且原陣列生命週期尚未結束。Pointer value 沒有自帶 capacity；caller 必須從其他資訊證明 offset 合法。

## `arr[i]` 等價於 `*(arr + i)`，不代表 array 與 pointer 是同一型別

```c
const char *str = "booze";
char ch1 = str[4];
char ch2 = *(str + 4);
char ch3 = *(4 + str);
char ch4 = 4[str];
```

四者都取得 `'e'`。下標運算以 pointer arithmetic 加 dereference 定義，所以加法可交換後甚至產生古怪但合法的 `4[str]`。投影片明確建議不要這樣寫：合法語法不等於清楚介面。

這個等價式只解釋 element access。它沒有把 array object 變成 pointer variable，也沒有讓 `sizeof`、assignment 或 `&array` 的型別行為消失。最安全的心智模型是：陣列在需要元素位址的運算式中「提供」首元素 pointer，運算完成後原陣列仍是原陣列。

## 第七條：參數複製位址，修改透過 alias 回到呼叫端

```c
void func(char *s) {
    s[4] = 'k';
}

int main(void) {
    char str[] = "spare";
    func(str);
    printf("%s\n", str); // spark
}
```

C 仍然是 pass-by-value。被複製的是 `&str[0]` 這個位址值，不是整個陣列。callee 的 `s` 與 caller 的 `str` 指向相同元素，因而 `s[4]` 修改原陣列。函式返回後 local pointer parameter 消失，陣列內的 byte 變更不會跟著復原。

若 callee 執行 `s = other`，只會改自己的 pointer copy，caller 的 array name 或 pointer variable 不會被重新指定。要讓函式改 caller 的 pointer variable 本身，需要傳 pointer-to-pointer；那是下一層 indirection，不應和「透過 pointer 修改 pointee」混在一起。

生命週期也不能省略。把 local array 的位址傳給函式並在呼叫期間使用沒有問題；若函式保存該位址，等宣告函式返回後再用，就成為 dangling pointer。Aliasing 說明多個 expression 指向同一物件，並不延長物件生命。

## 把七條規則濃縮成三次判斷

第一，判斷 expression 的型別與轉換。它原本是 array object、pointer variable，還是 literal 產生的陣列？目前語境會不會觸發 array-to-pointer conversion？`sizeof` 與 `&` 是常見反例。

第二，判斷 storage 與 mutability。指標值能重新賦值，不代表 pointee 可寫；pointer 宣告為 `char *` 也不能洗掉 literal 不可修改的事實。若函式會寫，caller 必須提供可寫物件，介面應記錄這份要求。

第三，判斷 bounds 與 lifetime。Pointer arithmetic 只在同一陣列及 one-past 範圍內有定義；one-past 不能解參照。Suffix 必須仍能在合法範圍內到達 terminator，且原物件仍存活。

做 code review 時，可以對每個 `char *` 寫下「來源物件、可寫與否、已知容量、有效期限」四欄。若其中一欄只能靠猜，介面就少傳了資訊或少寫了前置條件。

Lecture 9 最終不是要消除 array 與 pointer 的差別，而是理解它們為何能合作：陣列提供連續元素與儲存空間，轉換提供首元素位址，pointer arithmetic 提供導航，dereference 才真正存取元素。把四步分開，`arr[i]` 的便利就不會再掩蓋底下的記憶體契約。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 9: Arrays and Pointers（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/09/Lecture09.pdf)
- [cppreference: Array declaration](https://en.cppreference.com/w/c/language/array.html)
- [cppreference: String literals](https://en.cppreference.com/w/c/language/string_literal.html)
- [cppreference: Arithmetic operators and pointer arithmetic](https://en.cppreference.com/w/c/language/operator_arithmetic.html)
- [SEI CERT STR30-C: Do not attempt to modify string literals](https://wiki.sei.cmu.edu/confluence/display/c/STR30-C.+Do+not+attempt+to+modify+string+literals)
