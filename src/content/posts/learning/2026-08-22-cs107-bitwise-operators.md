---
title: "Stanford CS107 Lecture 4：Bitwise operators、型別轉換與 bitmask"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, bitwise-operators, bitmask]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS107 導讀"
  order: 5
tldr: "第四講先釐清 signed／unsigned 轉型不改 bits、混合比較可能改變數值意義，以及 sign extension、zero extension、truncation；再推導 AND、OR、NOT、XOR 與 bitmask 的讀取、設定、清除和集合操作。"
description: "逐頁導讀 Stanford CS107 Winter 2026 Lecture 4：整數轉型與截斷、bitwise operators、bit vector、集合運算，以及可組合的 bitmask 慣用法。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-cs107-bitwise-operators-en)

Bitwise operator 暫時忽略整體數值，把每個位置當成獨立欄位。`&` 保留、`|` 設定、`^` 切換指定 bits；操作前要先確認 C 的型別轉換是否改變寬度，以及 pattern 被當成 signed 或 unsigned 解讀。

本講先收束 conversion 與 truncation，再進入 operators、bit vector 與 bitmask。本文依 [Winter 2026 Lecture 4 官方投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/04/Lecture04.pdf) 展開。

## 講次資料與材料邊界

- 課程：Stanford CS107: Computer Organization and Systems
- 學期：Winter 2026
- 官方講次：Lecture 4, *Bitwise Operators*（投影片封面作 *Bits and Bytes Wrap-up, Bitwise Operators*）
- 上課日期：2026-01-12
- 講者：公開 PDF 未單獨署名確認
- 官方材料：[課程 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)、[Lecture 4 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/04/Lecture04.pdf)、[SEI CERT C integer conversion 指南](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/recommendations/integers-int/int02-c/)、[Stanford Lab 1](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
- 指定閱讀：Bryant 與 O’Hallaron，第 2.1 章

投影片版權列 Stanford Computer Science，credits 列出多位歷來作者；名單不能證明當天由誰授課，因此本文不反推講者。公開 PDF 完整；Canvas 錄影與課堂問答未公開，無法核對。

## 本講完整 agenda

1. Signed 與 unsigned cast：bit pattern 不變，型別決定 interpretation。
2. `U` suffix、C-style cast，以及負數被解讀成大型 unsigned value。
3. Signed／unsigned 混合 comparison 的 implicit conversion 與反直覺結果。
4. 從較窄 signed type 到較寬 type 的 sign extension。
5. 從較窄 unsigned type 到較寬 type 的 zero extension。
6. 從較寬 type 到較窄 type 的 truncation 與數值改變。
7. `&`、`|`、`~`、`^` 的逐 bit 規則。
8. 多位元 operands 的對位運算，以及 bitwise 與 logical operators 的差異。
9. Bitmask 的目的，以及 bit vector 如何壓縮 Boolean 資訊。
10. 以課程集合示範 union、intersection、設定、清除與測試 bits。

## Cast 不一定改 bits，卻可能徹底改變數值

投影片先看 signed `int` 轉成 unsigned `int`：

```c
int v = -12345;
unsigned int uv = v;
printf("v = %d, uv = %u\n", v, uv);
```

在投影片假設的 32-bit `int` 下，輸出是：

```text
v = -12345, uv = 4294954951
```

前後 32 bits 完全相同：

```text
11111111111111111100111111000111
```

變的是 interpretation。Signed `int` 以 two's complement 解讀，所以是 -12345；unsigned 每一位都是正權重，同一 pattern 就成為 4294954951，也就是 `2^32 - 12345`。

同一件事可以用 C-style cast 即時寫出：

```c
printf("v = %d, uv = %u\n", v, (unsigned int)v);
```

Cast 不是取 absolute value。這個同寬例子保留 bits、改變解碼規則；寬度不同時還會牽涉 extension 或 truncation，不能誤以為 cast 永遠不改 bits。

## `U` suffix 與混合比較：語法很小，轉換很大

數值 literal 後可加 `U` 指定 unsigned，例如 `12345U`。在 `-12345U` 中，負號是 unary operator，而 literal 已是 unsigned；應先判斷 literal type，再套 operator，不能只看表面負號。

真正危險的是 signed 與 unsigned 混在 comparison。投影片的簡化規則是：比較時 signed operand 會被轉成 unsigned，然後以兩邊皆非負的方式比較。於是：

```c
0 == 0U        // true
-1 < 0         // true
-1 < 0U        // false under the slide's 32-bit int model
```

第三行在數學上當然應是 true；但 `0U` 把比較帶進 unsigned，-1 的 all-one pattern 變成很大的正值，所以結果為 false。投影片再列出：

```c
2147483647 > -2147483648       // true as signed comparison
2147483647U > -2147483648      // false in the shown model
-1 > -2                         // true as signed comparison
(unsigned long)-1 > -2          // true after conversion
```

重點不是背六個答案，而是標出兩邊型別、找共同比較型別，最後才解讀 bits。完整規則還會考慮 rank 與可表示範圍；本講表格是常見平台案例，不代表所有組合都只套一句「signed 轉 unsigned」。不要用 cast 壓過 warning，應先在原本的 signed domain 驗證範圍。

## Sign extension：複製 sign bit 來保留 signed value

當較窄 signed integer 放進較寬 signed integer，C 需要讓原值在更多 bits 中維持不變。投影片以 16-bit `short` 到 32-bit `int` 為例：

```c
short s = 4, t = -4;
int i = s, j = t;
```

+4 的 16-bit pattern 是：

```text
0000 0000 0000 0100
```

補成 32 bits 時，左側加入零：

```text
0000 0000 0000 0000 0000 0000 0000 0100
```

-4 的 16-bit two's-complement pattern 是：

```text
1111 1111 1111 1100
```

若左側補零，它會突然變成大型正值。正確做法是把原 MSB，也就是 sign bit，複製到所有新位置：

```text
1111 1111 1111 1111 1111 1111 1111 1100
```

這就是 sign extension。統一規則不是背正負特例，而是複製 sign bit，使原值在更寬的 representation 中不變。

## Zero extension：unsigned 擴寬只要在左側補零

Unsigned value 沒有 sign bit，所有位置都是非負權重。從 `unsigned short` 擴到 `unsigned int` 時，新增加的高位全部補零即可：

```c
unsigned short us = 0b1111111111110010;
unsigned int ui = us;
```

投影片畫成：

```text
                1111 1111 1111 0010
0000 0000 0000 0000 1111 1111 1111 0010
```

前導零不增加權重，所以數值不變。Extension 也不限於 `short`；`char`、`int` 與 `long` 之間都可能發生。真正要問的是來源 signedness 與目的寬度。它的目的是建立更寬的 representation 並保存 value。

## Truncation：保留低位不等於保留數值

反方向把 32-bit `int` 放進投影片假設的 16-bit `short` 時，四 bytes 無法塞進兩 bytes，最顯著的高 16 bits 被截掉，只留下低 16 bits：

```c
int i = 50000, j = 100000, k = -32769;
short s = i, t = j, v = k;
```

投影片的結果是：

```text
50000   -> 1100 0011 0101 0000 -> -15536
100000  -> 1000 0110 1010 0000 -> -31072
-32769  -> 0111 1111 1111 1111 ->  32767
```

低 bits 的確被忠實保留，但目的 `short` 重新把保留下來的 MSB 當 sign bit，所以數值可能連正負都改變。這和 extension 的差異很根本：擴寬時通常能保存原值；縮窄時若原值超出目的型別範圍，就不可能同時保留所有資訊。

投影片採特定平台寬度。可攜式 C 不能假設 `short` 必為 16 bits、`int` 必為 32 bits，也不應依賴超出目的 signed type 範圍時的結果。轉型前先確認目的型別能表示原值。

## 四個 bitwise operators：每個位置各算一次

理解 representation 之後，問題變成：如何直接操作其中某些 bits？投影片列出六個 bitwise operators：`&`、`|`、`~`、`^`、`<<`、`>>`。本講完整展開前四個，shift 留到後續講次。

AND `&` 是 binary operator，兩個 input bits 都為 1 才輸出 1：

```text
0 & 0 = 0    0 & 1 = 0
1 & 0 = 0    1 & 1 = 1
```

因此用 1 AND 某 bit 會讓它通過，用 0 AND 會把它清成零。

OR `|` 只要任一 input 為 1 就輸出 1：

```text
0 | 0 = 0    0 | 1 = 1
1 | 0 = 1    1 | 1 = 1
```

因此用 1 OR 某 bit 會把它設為一，用 0 OR 則維持原樣。

NOT `~` 是 unary operator，逐位反相。XOR `^` 則只在兩個 input 恰有一個為 1 時輸出 1。用 1 XOR 某 bit 會切換它，用 0 XOR 則保持原樣。這四句「通過、清除、設定、切換」比死背 truth table 更容易直接轉成 mask 操作。

## 多位元運算：對齊位置，不做整體真假判斷

Operators 套在多位元整數時，每一欄獨立套相同規則：

```text
  0110       0110       0110      ~1100
& 1100     | 1100     ^ 1100       ----
  ----       ----       ----        0011
  0100       1110       1010
```

AND 的第一欄不會影響第二欄，也沒有 carry。OR 不會把兩個整數先化成 Boolean；XOR 也不是「兩個整數不同就 true」。結果仍是一整組 bit pattern，可再被當成整數或 bit fields 解讀。

這正是 bitwise 與 logical operator 的分界。`6 & 12` 得到 4；`6 && 12` 只問兩邊是否非零，所以是 true。相同地，`6 | 12` 得到 14，但 `6 || 12` 是 true；`~12` 反相整個 representation，`!12` 則是 false。Condition 中的單一 `&` 或 `|` 值得確認是刻意測 bit，而不是少打一個字元。

## Bit vector：用位置表示集合成員資格

Bit vector 把每個 bit 當成 Boolean slot。投影片以 C++ `vector<bool>` 說明：24 個狀態可放進三個 8-bit `char`，既壓縮空間，也能一次處理整組狀態。

課堂例子用一個 `char` 的八個位置表示本季是否修一門 core CS course。每個 course 對應固定位置，1 表示集合中包含它，0 表示不包含。Pattern `00100011` 不是拿來讀成十進位 35；在這個 domain 裡，它是一張 enrollment map。

Bit-level programming 要先寫出 layout：每個 bit 的意義、1／0 的定義，以及未使用 bits 是否必須為零。否則十六進位常數只是一串無法 review 的魔術數字。

## 集合運算：OR 是 union，AND 是 intersection

若兩份課表用相同 bit layout，集合運算就能直接映射到 bitwise operators。投影片以：

```text
  00100011
| 01100001
----------
  01100011
```

示範 union。某門課只要出現在其中一份 schedule，對應 bit 的 OR 就是 1，結果正是兩集合聯集。

Intersection 則使用 AND：

```text
  00100011
& 01100001
----------
  00100001
```

只有兩份 schedule 都包含的 course 才留下。XOR 可推得 symmetric difference，也就是只出現在一個集合的項目；投影片只明示 union 與 intersection，因此這是延伸推論。一次 OR 或 AND 能完成集合運算，代價是可讀性依賴穩定命名；散布 `0x20` 這類常數會迅速失去語意。

## Bitmask：把想操作的位置做成 pattern

Bitmask 是刻意建構的 pattern，1 與 0 用來選出哪些位置要受影響。投影片為八門課定義單一 bit masks：

```c
#define CS106A  0x01  /* 0000 0001 */
#define CS106B  0x02  /* 0000 0010 */
#define CS106AX 0x04  /* 0000 0100 */
#define CS107   0x08  /* 0000 1000 */
#define CS111   0x10  /* 0001 0000 */
#define CS103   0x20  /* 0010 0000 */
#define CS109   0x40  /* 0100 0000 */
#define CS161   0x80  /* 1000 0000 */
```

每個 mask 只有一個 bit 為 1，位置代表 course。註解同時給 binary layout，名稱則把 domain meaning 帶回程式。`1 << n` 也能建立第 `n` 位 mask；本講列出這種寫法，但 shift 的完整規則尚未展開，這裡只把它讀成「把唯一的 1 移到指定位置」。

Mask 可以組合；例如 `CS107 | CS111` 同時選中兩門課。只要 layout 一致，同一套操作也能用於權限或功能開關。

## 設定、清除、測試與切換：四個可組合慣用法

**設定 bit** 使用 OR，因為 mask 為 1 的位置被強制設為 1，其他位置和 0 OR 後保持不變：

```c
schedule = schedule | CS107;
schedule |= CS107;
```

**清除 bit** 使用 AND 加反相 mask。`~CS103` 只有 CS103 的位置是 0，其他位置是 1；AND 後只清掉目標：

```c
schedule &= ~CS103;
```

**測試 bit** 使用 AND。若結果非零，代表目標位置原本是 1：

```c
if (schedule & CS106B) {
    /* taking CS106B */
}
```

若要測試多個 bits 是否「全部」存在，不能只測結果非零；應比較 `(schedule & required) == required`。若只要確認「至少一個」存在，非零測試才正確。

**切換 bit** 使用 XOR。Mask 為 1 的位置翻轉，其他位置不變：

```c
schedule ^= CS107;
```

這個 idiom 可由本講 XOR truth table 直接推出，雖然最後一頁主要示範的是 enrollment test。四種操作放在一起看，就不必背零散語法：OR 設定、AND-NOT 清除、AND 測試、XOR 切換。

## 把這講整理成三個層次

**型別層**決定同一 pattern 如何解讀，也決定比較前是否發生 implicit conversion。負 signed value 遇到 unsigned operand，可能先變成大型非負值，然後才比較。

**寬度層**決定 bits 如何搬進另一個容器。Signed 擴寬用 sign extension，unsigned 擴寬用 zero extension；縮窄保留低 bits，資訊與數值都可能改變。

**欄位層**暫時不把整組 bits 當一個數，而把每一位視為獨立狀態。Bitwise operators 配合 mask 選擇位置，bit vector 再把 union、intersection 與 membership test 變成單一機器運算。

三層不能混在一起。最穩定的閱讀順序是：先寫寬度與 signedness，再畫 pattern，最後套 operator；若 conversion 已改變 representation，就先回到型別層查明。

## 一個可以立即做的手算練習

假設 8-bit schedule 是 `00100011`，請不用執行程式，依序預測以下結果：

```c
schedule |= CS107;
schedule &= ~CS103;
bool has_b = schedule & CS106B;
schedule ^= CS106A;
```

每一步都先寫 mask，再逐欄運算。答案應依序成為 `00101011`、`00001011`、true、`00001010`。接著把 `schedule & CS106B` 換成 `schedule && CS106B`，說明為何它幾乎失去 membership test 的意義：只要兩個整數都非零，logical AND 就是 true，完全沒有隔離 CS106B 對應位置。

再用 8-bit pattern `11111011` 寫出 unsigned 與 signed 值，並分別 sign-extend、zero-extend 到 16 bits。把新增的高位畫出來，確認「改 interpretation」與「改 width」不是同一件事。

## 這講之後應該帶走什麼

1. 同寬 signed／unsigned conversion 可以保留 bits、改變數值 interpretation。
2. 混合 signedness comparison 必須先求共同型別，不能直接套數學直覺。
3. Sign extension 複製 MSB，zero extension 補零；truncation 保留低 bits，卻不保證保留值。
4. `&`、`|`、`~`、`^` 逐位置運算，與 `&&`、`||`、`!` 的整體真假判斷不同。
5. Bit vector 用位置承載 Boolean meaning；OR 與 AND 可直接表示集合 union 與 intersection。
6. Mask 的四個核心 idioms 是設定、清除、測試與切換，而且都能從 truth table 推導，不必硬背。

下一講會接續 left shift、right shift 與 `gdb`。先記住 mask 中 1 是要操作的位置、0 是要保留的位置；shift 會提供建立與搬動這些位置的方法。

## 參考資料

- [Stanford CS107 Winter 2026 course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 4 slides: Bits and Bytes Wrap-up, Bitwise Operators](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/04/Lecture04.pdf)
- [SEI CERT C INT02-C: Understand integer conversion rules](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/recommendations/integers-int/int02-c/)
- [Stanford CS107 Lab 1: Bits, Bytes, and Integers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
