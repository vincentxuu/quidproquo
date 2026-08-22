---
title: "Stanford CS107 Lecture 6：C 字串不是型別，而是一份記憶體契約"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, c-strings]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 7
tldr: "CS107 第 6 講把 C 字串拆回 char 陣列、終止空字元與位址：strlen、strcmp、strcpy、strncpy、strcat 的每一個便利，都以呼叫者維持容量與終止條件為代價。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 6：char、ASCII、ctype.h、null-terminated C strings、字串函式、suffix pointer 與 string diamond。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-chars-c-strings-en)

第 6 講把文字拆回記憶體表示。C 沒有內建的字串型別；字串只是一段 `char` 序列，加上「遇到零就結束」的約定。

長度、邊界與容量全由程式設計者管理。漏掉一個 `\0`，陣列仍在，卻不能再安全交給字串函式。看見 `char *` 時應追問：字串在哪裡結束、目的地多大、誰能修改記憶體？

## 本講資料與閱讀範圍

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 6，2026-01-16
- 官方標題：Chars and C-Strings
- 講者：syllabus 列 Jerry Cain；PDF 未另列講者
- 已讀材料：calendar、20 頁投影片與文末 POSIX Issue 8 規格
- 材料缺口：Canvas 錄影、課堂 demo 與 AFS code 未公開；本文不重建逐字稿

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講放在 Topic 2 起點。完整路徑是 `char`、escape sequences、ASCII、`ctype.h`、null termination、長度與容量、比較／複製／串接、參數傳遞、suffix pointer，最後是 string diamond。

## `char` 是小整數，字元是我們賦予它的解讀

```c
char letter = 'M';
char plus = '+';
char space = ' ';
char newline = '\n';
char tab = '\t';
char quote = '\'';
char backslash = '\\';
```

單引號寫的是 character constant，反斜線則讓原本難以直接寫進程式碼的換行、tab、引號與反斜線有一套表示法。投影片接著把抽象拿掉：在這一講採用的 ASCII 模型裡，`char` 底下就是一個單位元組整數。`'A'` 是 65、`'a'` 是 97、`'0'` 是 48；大寫字母、小寫字母與數字各自在編碼表中連續排列。

ASCII 是 7-bit 字元集，這裡談 C string 契約，不是 Unicode。中文或 emoji 不符合「一個 `char` 一個 glyph」；`strlen` 數的是 bytes，不是字數。

`ctype.h` 提供 `isalpha`、`islower`、`isupper`、`isspace`、`isdigit`、`toupper` 與 `tolower`，讓程式不必手寫 ASCII 範圍。這也不只是可讀性偏好。[POSIX 的 character classification 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/isalnum.html)指出，分類結果受目前 locale 影響，而且參數必須可表示成 `unsigned char` 或等於 `EOF`。因此從可能為負值的 plain `char` 呼叫分類函式時，穩妥寫法是先轉型：

```c
unsigned char ch = (unsigned char)text[i];
if (isalpha(ch)) {
    text[i] = (char)toupper(ch);
}
```

投影片的主例子只用 ASCII 字母，所以沒有展開 locale 與 signedness；但函式契約提醒我們，便利的分類 API 仍然有前置條件。

## C string 的本體：`char` 陣列加上一個 sentinel

字面值 `"Hello"` 在記憶體中的關鍵不是五個可見字母，而是後面還有一個數值為零的 `\0`：

```text
index   0    1    2    3    4     5
value  'H'  'e'  'l'  'l'  'o'  '\0'
```

`\0` 稱為 null character、null byte 或 zero byte。它不是字元 `'0'`：後者在 ASCII 裡是 48，前者的值是 0。也不要把它和 null pointer 混為一談；兩者名稱接近，但一個是字串中的終止 byte，一個是「不指向物件」的指標值。

這就是投影片所說的 agreement。函式拿到 `char *` 時，型別只告訴它「這裡有一個字元的位址」，沒有附帶陣列容量，也沒有獨立的 length 欄位。函式之所以能把後續 bytes 解讀成字串，是呼叫者承諾在可讀範圍內終究會出現 `\0`。因此 `char data[5] = {'H', 'e', 'l', 'l', 'o'};` 是合法陣列，卻不是合法的 C string；`printf("%s", data)` 不會自動知道第五格就是邊界。

這個差別也解釋容量公式。要存五個可見字元的 `"hello"`，陣列至少需要六格：

```c
char exact[6] = "hello";
char roomy[12] = "hello";
```

兩者目前的字串長度都是 5，容量卻分別是 6 與 12。`roomy` 多出的空間讓它未來可能接上其他文字；它不會讓 `strlen(roomy)` 變成 12。把 length、已配置 capacity 與「包含 terminator 所需的 bytes」分開，是後續所有題目的共同底層。

## `strlen` 沒有讀取長度欄位，它只能一路找零

[POSIX `strlen` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strlen.html)的定義非常精確：計算 `s` 所指字串的 bytes 數，不包含結尾 NUL。這句話反過來讀更重要：輸入必須先是一個已有 NUL 的字串。`strlen` 不接受 capacity，也沒有錯誤回傳值；若可讀範圍內沒有終止字元，它只能越過陣列繼續尋找，程式行為未定義。

```c
char text[9] = "Hi earth";
text[2] = '\0';
printf("%s, %zu\n", text, strlen(text));
```

這段印出 `Hi, 2`。後面的 `earth` bytes 沒有被清除，只是第一個 `\0` 把字串的可見範圍截短了。C string 的長度不是陣列裡「有意義資料」的總量，而是從起點到第一個 zero byte 的距離。

因為沒有儲存好的長度，`strlen` 每次都要線性掃描。下面的迴圈會在每輪重新從開頭數一次，文字越長，重複工作越多：

```c
for (size_t i = 0; i < strlen(text); i++) {
    /* use text[i] */
}
```

若迴圈期間不會改動終止位置，先保存長度比較直接：

```c
size_t length = strlen(text);
for (size_t i = 0; i < length; i++) {
    /* use text[i] */
}
```

這不是微不足道的風格規則，而是表示法造成的成本：既然字串沒有 length 欄位，需要長度的人就得掃描或自行保存。

## `strcmp` 比內容；`==` 對 `char *` 比的是位址

C string 經常以指標出現，所以 `left == right` 比較的是兩個位址是否相同，不是兩段文字是否逐字相同。兩個不同陣列都裝著 `"cat"`，內容相同，起始位址仍可不同。內容比較要用 `strcmp`：

```c
int cmp = strcmp(left, right);
if (cmp == 0) {
    /* equal contents */
} else if (cmp < 0) {
    /* left comes first */
} else {
    /* right comes first */
}
```

[POSIX `strcmp` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcmp.html)只保證回傳值小於、等於或大於零；非零值的正負由第一組不同 bytes 的差決定，並以 `unsigned char` 解讀。程式若寫 `strcmp(a, b) == -1`，就是依賴標準沒有承諾的特定數值。正確的問題是符號，而不是「是否剛好回傳 -1」。

投影片把這稱為 lexicographic comparison，但要避免把它想成完整的自然語言排序。這裡比較的是 byte 序列，並在遇到第一個差異或 terminator 時決定結果；它沒有替你處理中文排序、重音字母或使用者期待的語系規則。

## `strcpy` 會複製終止字元，卻完全不知道目的地容量

```c
char orig[6];
strcpy(orig, "hello");

char clone[6];
strcpy(clone, orig);
clone[0] = 'c';
```

結果是 `orig` 仍為 `"hello"`，`clone` 成為 `"cello"`。陣列內容被複製到另一塊儲存空間，修改 clone 不會改到 orig。[POSIX `strcpy` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcpy.html)明列它會把來源字串連同 terminating NUL 一起複製到目的陣列；若來源與目的物件重疊，行為未定義。

真正的風險藏在函式原型裡：`strcpy(dst, src)` 沒有第三個 capacity 參數。它無從知道 `dst` 有幾格，只能相信呼叫者已準備至少 `strlen(src) + 1` bytes。以下程式不是「內容被截斷」，而是向陣列外寫：

```c
char tiny[6];
strcpy(tiny, "hello, world!");
```

越界寫入就是 buffer overflow。被覆寫的可能是相鄰區域、其他區域變數或控制流程會使用的資料；實際結果不由 C 保證。重點不在猜測這次執行會壞掉哪個值，而在承認從第一次越界開始，語言已不再提供可推理的正常行為。

## `strncpy` 不是自動安全的 `strcpy`

`strncpy(dst, src, n)` 最容易因名稱產生錯覺。它最多處理 `n` bytes，但若來源在前 `n` bytes 內沒有 `\0`，目的地也不會得到 terminator：

```c
char tight[8];
strncpy(tight, "continue", 8);  // no '\0' in tight

char snug[8];
strncpy(snug, "persist", 8);   // includes '\0'

char roomy[8];
strncpy(roomy, "endure", 8);   // pads remaining bytes with zero
```

第一個陣列是八個字母，沒有 C string 結束標記；把它直接交給 `strlen` 或 `%s` 仍是未定義行為。第三個例子則顯示另一面：來源提早結束時，`strncpy` 會用 zero bytes 補滿指定範圍。因此 `n` 既不是「目的地容量的萬靈參數」，也不等於最後保證可見的字元數。

本講在 string diamond 刻意正確使用它：只複製前綴的 `i` 個可見字元，然後由呼叫端親手蓋上 `prefix[i] = '\0'`。這個模式清楚表達兩個獨立動作——限制拷貝量，以及建立合法 terminator。若只做第一步，就只得到字元陣列片段，不一定得到字串。

## 串接的本質：找到舊的 `\0`，從那裡覆寫

```c
char greeting[13];
strcpy(greeting, "hello ");
strcat(greeting, "world!");
```

`strcat` 先找到 destination 原本的終止空字元，用來源第一個字元覆蓋它，再把來源其餘內容與新的 terminator 接上去。[POSIX `strcat` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcat.html)也明列來源與目的若重疊，行為未定義。呼叫前因此有兩份契約：`dst` 已經是合法的 null-terminated string，而且總容量足以容納原長度、來源長度與最後一格 NUL。

`strncat(dst, src, n)` 的 `n` 是最多從來源附加多少個非 NUL 字元，不是目的地總容量。它會補上新的 terminator，因此若陣列容量是 `cap`，可附加的上限應從剩餘空間推導：

```c
size_t used = strlen(alert);
if (used < sizeof alert) {
    strncat(alert, source, sizeof alert - used - 1);
}
```

最後的 `- 1` 是替新的 `\0` 保留位置。這也再次說明 C API 的閱讀方式：不能只看到 `n` 就判定安全，必須查清楚它限制的是來源字元數、總輸出長度，還是可檢查的輸入範圍。

## 字串當參數時，函式拿到的是第一個字元的位址

投影片用 `mockmeme` 將一句話的英文字母交替轉成大小寫。呼叫 `mockmeme(reprimand)` 等同傳入 `&reprimand[0]`；函式沒有複製整個陣列，因此透過 `text[i]` 寫入會反映在呼叫端原陣列。

```c
void mockmeme(char *text) {
    bool upper = true;
    size_t length = strlen(text);
    for (size_t i = 0; i < length; i++) {
        unsigned char ch = (unsigned char)text[i];
        if (isalpha(ch)) {
            text[i] = (char)(upper ? toupper(ch) : tolower(ch));
            upper = !upper;
        }
    }
}
```

參數型別 `char *` 表示函式可能修改指向的字元。如果只讀內容，介面應寫成 `const char *`，把限制交給編譯器檢查。另一個必須分清的地方是可修改陣列與 string literal：`char reprimand[] = "...";` 建立可修改陣列；把 literal 的位址交給會寫入的函式，則不是同一回事。投影片使用前者，正因範例真的要改字元。

## Suffix pointer：不複製也能把同一陣列的中段當字串

```c
char word[8];
strcpy(word, "racecar");

char *all = word;
char *some = word + 4;
printf("%s\n", all);   // racecar
printf("%s\n", some);  // car
```

`some` 沒有建立新字串，也沒有搬動 `c`、`a`、`r`。它只把起點改到索引 4；從那個位址往後仍可遇到原陣列的 `\0`，所以 `%s` 看見一個合法 suffix。這是指標運算與字串終止約定第一次漂亮地接在一起：C string 不需要從陣列索引 0 開始，只需要目前指標之後存在可達的 terminator。

同樣的別名關係也可能讓修改結果出乎直覺。先把 `"potatoes"` 放進九格陣列，再令 `fruit = veggie + 2`。若執行 `strcpy(fruit, "mag")`，`m`、`a`、`g` 與其 NUL 會從原陣列索引 2 開始覆寫，最後 `veggie` 顯示為 `"pomag"`；後面的舊 bytes 仍可能留在記憶體裡，只是新 terminator 讓它們不可見。若改成 `strncpy(fruit, "mid", 2)`，只覆寫 `m`、`i`，不寫 NUL，舊 suffix 繼續接著，結果是 `"pomitoes"`。

這類題目不該靠腦中模糊模擬。畫出每個索引、每個 byte、兩個指標指到哪裡，再逐格套用函式契約，答案會自然出現。

## String diamond：前綴靠複製，後綴只要移動起點

本講最後要求 `diamond("doris")` 印出逐步增長的 prefixes，再印出逐步縮短且縮排的 suffixes：

```text
d
do
dor
dori
doris
 oris
  ris
   is
    s
```

```c
void diamond(const char *str) {
    size_t length = strlen(str);

    for (size_t i = 1; i < length; i++) {
        char prefix[i + 1];
        strncpy(prefix, str, i);
        prefix[i] = '\0';
        printf("%s\n", prefix);
    }

    printf("%s\n", str);

    for (size_t i = 1; i < length; i++) {
        for (size_t j = 0; j < i; j++) {
            printf(" ");
        }
        printf("%s\n", str + i);
    }
}
```

前綴不能只移動起點，因為每一列需要在不同位置提早結束；範例建立 `i + 1` 格暫存陣列，拷貝 `i` 個字元，再自行放 NUL。後綴不必複製，因為大家共享同一個原始終點；`str + i` 直接略過前 `i` 個字元即可。這個小練習同時驗收 capacity、`strncpy`、手動終止、pointer arithmetic 與 suffix 的別名模型。

它也有明確邊界。這段使用 variable-length array，且每列重新輸出；對空字串與非常長輸入，正式程式會希望先定義行為與資源限制。若輸入是 UTF-8，依 byte 位移還可能切進多 byte 字元中間。這些不是投影片要解的題目，但它們標出「這個演算法建立在哪些假設上」。

## 讀完這講，應該留下的檢查順序

看到任何 C 字串操作，先不要問「該用哪個函式」，先做這五項檢查：

1. 起點是否指向可讀的 `char` sequence？
2. 在可讀邊界內是否保證有 `\0`？
3. 若要寫入，目的地是否可修改，而且容量是多少？
4. 最壞輸出是否把最後一格 terminator 算進去？
5. 來源與目的是否可能重疊，或其實是同一陣列的兩個 aliases？

這套順序比背「`strncpy` 比較安全」可靠，因為後者根本不成立。C 的字串函式各自只執行狹窄工作；它們不持有 capacity，也不替呼叫者恢復被破壞的契約。`strlen` 信任 NUL、`strcpy` 信任空間、`strcat` 同時信任既有終止位置與剩餘空間。

Lecture 6 真正交付的不是一張 `string.h` 速查表，而是一個系統程式設計習慣：型別資訊不夠時，把隱含契約寫回腦中的記憶體圖。下一講談 buffer overflow 與 security 時，漏洞不會突然從別處冒出來；它就是這一講的 capacity、terminator 與 pointer 關係被違反後的後果。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 6: Chars and C-Strings（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/06/Lecture06.pdf)
- [POSIX Issue 8: strlen](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strlen.html)
- [POSIX Issue 8: strcmp](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcmp.html)
- [POSIX Issue 8: strcpy](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcpy.html)
- [POSIX Issue 8: strcat](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcat.html)
- [POSIX Issue 8: isalnum and character classification contract](https://pubs.opengroup.org/onlinepubs/9799919799/functions/isalnum.html)
