---
title: "Stanford CS107 Lecture 5：Bit shifts、bit tricks 與 GDB"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, bitwise-operators, gdb]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS107 導讀"
  order: 6
tldr: "第五講把 bitmask 推進到 left／right shift、power-of-two 與 popcount tricks，並用 absolute-value 範例揭示 signed intermediate 在 INT_MIN 會 overflow；後半建立 GDB 的 breakpoint、執行控制、格式化 print、memory examine 與 backtrace 工作流。"
description: "逐頁導讀 Stanford CS107 Winter 2026 Lecture 5：位移語意、bit manipulation 慣用法、absolute value 的邊界，以及 GDB 除錯指令與實作工作流。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-cs107-shifts-and-gdb-en)

Bitmask 能選位置，shift 則能把位置搬到需要的地方。兩者合起來，可以抽出 byte、翻轉欄位、找相鄰的 1、判斷 power of two，甚至在不使用比較運算子的情況下組出 absolute value。這些技巧很短，前提卻很多：型別寬度、signedness、右移補什麼，以及 shift count 是否合法。

CS107 第五講也第一次正式把 GDB 納入日常工具。重點不是記住一串縮寫，而是建立可重複的觀察循環：停在 breakpoint、控制下一步、用不同格式看值、檢查記憶體與 call stack，再回到原始碼修正。本文依 [Winter 2026 Lecture 5 官方投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/05/Lecture05.pdf) 完整展開。

## 講次資料與材料邊界

- 課程：Stanford CS107: Computer Organization and Systems
- 學期：Winter 2026
- 官方講次：Lecture 5, *Bitwise Operators, Take II*
- 上課日期：2026-01-14
- 講者：公開 PDF 未單獨署名確認
- 官方材料：[課程 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)、[Lecture 5 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/05/Lecture05.pdf)、[Stanford CS107 GDB 指南](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/resources/gdb)、[Stanford Lab 1](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
- 指定閱讀：Bryant 與 O’Hallaron，第 2.1 章

公開 PDF 共 14 頁，版權與 credits 不能證明當天講者。第 13 頁只有「Demo: Bitmasks and GDB」標題；lecture code、實際指令序列、輸入與畫面輸出未公開，因此本文不重建 demo。以下 GDB 說明以投影片命令表為核心，並把研究筆記列出的 `x`、`backtrace`、`quit` 一併放入指令地圖，但不冒充現場操作紀錄。

## 本講完整 agenda

1. 對 32-bit `int` 與 `unsigned long` 使用 mask 的四個暖身題。
2. 以 `(value & (value - 1)) == 0` 判斷非零 power of two。
3. Left shift：左移、右側補零、左側丟棄，以及 shift count 邊界。
4. Right shift：logical 與 arithmetic shift、unsigned 與 signed 的差異。
5. 以 shift、XOR 與 subtraction 實作 absolute value。
6. `INT_MIN` 對 absolute value 契約造成的邊界問題。
7. 兩種計算 set bits 的方法，以及 `1UL` 的必要性。
8. GDB 的 breakpoint、run、next、step 與 continue。
9. `print` 格式、`info args`、`info locals`、`x` 與 `backtrace`。
10. 未公開的 bitmask＋GDB demo，以及雙終端工作流。

## 四個 mask 暖身題

投影片先強調 mask 不只用於 8-bit `char`，也能套在 `short`、`int` 與 `long`。假設 `j`、`k` 是 32-bit `int`，要保留 `j` 最低一個 byte：

```c
k = j & 0xFF;
```

`0xFF` 的低八位全為 1，其餘為 0。AND 讓低 byte 通過，其他位置歸零。若要反轉 `j` 的第一與最後一個 byte：

```c
k = j ^ 0xFF0000FF;
```

XOR mask 中的 1 只覆蓋首尾 byte，因此那些位置 toggle，中間兩個 bytes 不變。

假設 `m`、`n` 是 `unsigned long`，完整反相可直接寫：

```c
n = ~m;
```

也可利用 XOR with one flips a bit：

```c
n = m ^ (~0L);
```

`~0L` 產生與 `long` 同寬的全一 pattern。Suffix 很重要；mask 寬度若比 operand 小，promotion 與 extension 可能讓結果偏離原意。

最後一題判斷 `n` 是否有兩個相鄰 bits 同為 1：

```c
(n & (n >> 1)) != 0
```

把 `n` 右移一格後，原本相鄰的兩位會對齊；再 AND，只有原 pattern 中存在 `11` 的位置會留下 1。結果非零就代表至少找到一組。

## Power of two：清掉最低的 set bit

正的二次冪 binary footprint 恰有一個 1，例如 `1`、`10`、`100`、`1000`。若 `value` 是 `1000000₂`，減一會得到 `0111111₂`：原本唯一的 1 變成 0，所有較低的零變成 1。因此兩者 AND 為零。

```c
bool is_power_of_2(unsigned long value) {
    return value != 0 && (value & (value - 1)) == 0;
}
```

若原值有多個 1，減一只會清掉最低 set bit 並改動它右邊的部分；至少一個較高的 1 仍會在 AND 後存活。`value != 0` 不能省，因為零沒有任何 set bit，`0 & (0 - 1)` 也會是零，卻不是 power of two。

這個 idiom 的價值不只是一行判斷。`value &= value - 1` 會在每次迭代清掉最低的 set bit，後面 popcount 範例正是重複使用這個不變量。

## Left shift：搬動權重，也可能丟掉資訊

`x << k` 把 pattern 向左移 `k` 格，右側補零，從左側移出的 bits 丟棄；`x <<= k` 是更新原變數的形式。投影片以 8-bit pattern 示範：

```text
00110111 << 2  -> 11011100
01100011 << 4  -> 00110000
10010101 << 5  -> 10100000
```

若沒有高位被丟掉，unsigned left shift 常可理解成乘以 `2^k`。一旦有 1 移出容器，數值只剩固定寬度內的 pattern，不能再把它當普通整數乘法。

投影片明確提醒：bit-pattern 效果只應對 unsigned values 依賴。Signed left shift 牽涉可表示範圍與語言規則，不應以「我的機器看起來如此」當契約。Shift count 也必須小於型別寬度；對 8-bit 值移 9 格這類操作是 undefined，而不是保證得到零。

建立 mask 時常見 `1UL << i`。`UL` 讓左 operand 從一開始就是 `unsigned long`，可在該寬度內移動。若只寫 32-bit `1` 卻移 33 格，操作在轉成較寬目的型別以前就已越界。

## Right shift：logical 與 arithmetic 不可混稱

`x >> k` 向右移，右側移出的 bits 丟棄。新出現的高位補什麼，取決於型別與實作語意。Unsigned right shift 以零補高位，稱 logical shift，通常可理解成除以 `2^k` 並捨去餘數。

投影片以 signed 8-bit patterns 示範複製 sign bit 的 arithmetic shift：

```text
01011101 >> 1  -> 00101110
01111110 >> 4  -> 00000111
11111110 >> 4  -> 11111111
11011011 >> 7  -> 11111111
```

正數 sign bit 是 0，看起來和 logical shift 相同；負數 sign bit 是 1，高位因此補一。這可讓負的 two's-complement 值大致維持除以二次冪的語意。

本文保留投影片的校園環境前提：後面的 absolute-value trick 假設 arithmetic right shift，而課堂使用的機器符合。寫需要跨平台的 C library 時，則應明確查核 signed right shift 的標準與 target 行為，或改用 unsigned representation 來避免把實作選擇藏在演算法裡。

## Absolute-value bit trick：投影片公式不是完整可用的 C 實作

一般寫法很直接：

```c
unsigned int absolute_value(int value) {
    return value < 0 ? -value : value;
}
```

投影片挑戰不用 relational operator 或 runtime multiplication，只用 bit manipulation，並展示：

```c
unsigned int absolute_value_bitwise(int value) {
    int mask = value >> (sizeof(value) * CHAR_BIT - 1);
    return (value ^ mask) - mask;
}
```

`sizeof(value) * CHAR_BIT` 算出型別 bit width，再減一，把 sign bit 移到最右端並填滿高位。在 arithmetic right shift 下，非負值產生全零 mask，負值產生全一，也就是 `~0` 或 -1。

非負路徑是 `(value ^ 0) - 0`，原值不變。負值路徑則想用 `(value ^ ~0) - (-1)` 完成 two's-complement negation。這段代數能解釋 bit pattern，卻不能直接當成所有輸入都有效的 C implementation：兩個 operands 都是 `int`，所以轉成 unsigned return type 之前，subtraction 已先以 signed `int` 計算。

## `INT_MIN`：公式正確不代表型別裝得下

投影片留下 thought question：`absolute_value_bitwise(INT_MIN)` 回傳什麼？Two's-complement signed range 不對稱，若 `int` 是 32 bits，最小值是 `-2^31`，正的 `2^31` 無法由 signed `int` 表示，卻能由同寬 `unsigned int` 表示。

這個函式宣告回傳 unsigned，卻救不了前一步：對 `INT_MIN` 而言，`(value ^ mask)` 形成 `INT_MAX`，再減 `-1` 要得到 `INT_MAX + 1`，超出 `int`，構成 signed integer overflow 的 undefined behavior。[SEI CERT INT32-C](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)明確要求避免 signed operation 產生不可表示結果。因此本文不把投影片函式稱為 working implementation。

若刻意保留課堂的 fixed-width、two's-complement bit-pattern 前提，必須在 arithmetic 前先進 unsigned domain，例如先把 `value` 轉為 `unsigned int`，從最高位建立 `0U - sign` mask，再算 `(bits ^ mask) - mask`。這能讓算術依 unsigned modulo rules 執行；production API 仍應明寫 representation 前提，並測試 `0`、`INT_MAX`、`-1` 與 `INT_MIN`。Lecture 26 再次展示這個早期例子時，也只能把它當成 representation 練習，不能抹掉本講的 C-language caveat。

更普遍的教訓是：bit trick 常把 branch 壓成少量 operations，卻把正確性條件藏進 representation。除非這段位於效能敏感路徑且 benchmark 證明有價值，清楚的條件式通常更容易維護；若採 trick，就把 two's complement、arithmetic shift 與邊界契約寫在旁邊。

## 兩種 popcount，以及 `1UL` 為何必要

投影片的 `mystery` 逐一掃過 `unsigned long` 的每個位置：

```c
size_t mystery(unsigned long ul) {
    size_t count = 0;
    for (size_t i = 0; i < sizeof(ul) * CHAR_BIT; i++) {
        if ((ul & (1UL << i)) != 0) count++;
    }
    return count;
}
```

`1UL << i` 建立單一位置 mask；AND 非零就把 count 加一。`UL` 至關重要，因為 plain `1` 通常是 32-bit `int`，移動超過其寬度會在尚未成為 `unsigned long` 前就造成 undefined behavior。

`enigma` 使用前面的清 lowest-set-bit idiom：

```c
size_t enigma(unsigned long ul) {
    size_t count = 0;
    while (ul != 0) {
        count++;
        ul &= ul - 1;
    }
    return count;
}
```

兩者都計算 1 的數量。第一個 loop 次數等於型別 bit width；第二個每輪恰清一個 1，因此 loop 次數等於 set-bit count。對 sparse value 後者更少迭代。這是從 representation 推導的演算法，不是只能背下來的黑魔法。

## GDB 的角色：停住程式再提問

GDB 是 command-line debugger。它可以在指定位置放 breakpoint、逐行控制執行、以 binary 或 hexadecimal 看變數、定位 crash 發生的 call path。相較於插入 `printf`，它不必為每個新問題重編一組輸出，也能停在錯誤狀態當下查看多個 expression。

啟動方式是把 executable 交給 GDB：

```text
gdb myprogram
```

這裡要給的是編譯後的程式，不是 `.c` source file。為了讓 source line、變數與 stack 資訊可用，編譯時也需要課程 Makefile 所設定的 debug information。

## Breakpoint 與執行控制

`break` 或縮寫 `b` 可在函式或行號設 breakpoint：

```text
break main
b 42
```

`run` 或 `r` 啟動程式，後面可放 command-line arguments：

```text
run 82
r 82
```

停住後，`next`／`n` 執行目前 source line，但把 function call 當成一步；`step`／`s` 會進入被呼叫函式；`continue`／`c` 則跑到下一個 breakpoint 或程式結束。投影片特別提醒：GDB 停在某行時，那一行尚未執行，直到下 `next` 或其他前進命令。把目前行誤當成「剛跑完」會讓變數值看起來永遠慢一拍。

## Inspect：`print`、`x`、資訊與 call stack

`print`／`p` 可印變數或即時計算 expression：

```text
p varname
p 3L << 10
p/t varname
p/x varname
p/d varname
p/u varname
p/c varname
```

`/t` 用 binary 顯示，`/x` 顯示 hexadecimal，`/d` 與 `/u` 分別用 signed／unsigned decimal，`/c` 以 character 顯示。同一 pattern 換格式看，正好能驗證前幾講「bits 不變、interpretation 改變」。投影片也把 `p + <expression>` 當成快速 C expression sandbox：先試 shift 或 mask，確認後再寫回 `.c`。

`info args` 顯示目前 frame 的參數，`info locals` 顯示 local variables。研究筆記另外列出 `x` 用來 examine memory、`backtrace` 檢視 call stack、`quit` 離開 GDB：

```text
x/16xb address
backtrace
quit
```

`x` 的格式可指定數量、顯示格式與單位；上例從 address 起看 16 個 hexadecimal bytes。`backtrace` 在 crash 後尤其重要，可先回答「經過哪些函式到這裡」，再選 frame 深入。這些命令應在實際程式上逐步練，不要只把縮寫背成清單。

## 未公開 demo 與可重複的雙終端工作流

第 13 頁宣布 bitmask＋GDB demo，卻沒有公開 lecture code 或 transcript。能確認的是下一頁的建議：開兩個 terminal windows，都 SSH 到 Myth；一邊放 editor，另一邊放 GDB 與 command line，方便對照 source line 與變數。

每次修改 `.c` 後，先離開或重新啟動相應 debug session，執行 `make`，再用更新後的 executable 跑 GDB。若忘記重新編譯，debugger 看到的是舊 binary；source 和執行狀態對不起來，會製造假的謎團。

一個可複製的最小循環是：`make` → `gdb myprogram` → `break main` → `run ...` → `next`／`step` → `p/t value` → `backtrace`（需要時）→ `quit`。每一步只回答一個問題，比一次放十個 breakpoints 更容易維持因果。

## 把這講整理成三個層次

**Pattern 層**處理位置：mask 選 bits，shift 對齊 bits，XOR、AND 再完成翻轉或交集。相鄰 1 與 power-of-two tricks 都是先觀察 footprint，再設計對齊方式。

**語言契約層**處理哪些 pattern 效果可依賴。Unsigned shift、operand width 與合法 count 都必須先確認；signed left shift、signed right shift 與 `INT_MIN` 不能只憑硬體直覺跳過。

**觀察層**由 GDB 把推理接回執行。Breakpoint 保存現場，step 控制狀態轉移，格式化 print 讓同一值切換解讀，memory examine 與 backtrace 則把範圍擴到 bytes 與 calls。

今晚可以拿 `0xB4` 做一次完整練習：先手算 `<< 1`、unsigned `>> 2`、`x & (x - 1)`，再在 GDB 用 `p/t`、`p/x` 與 `p/u` 核對。若答案不同，先問 operand type 與 width，而不是立刻認定 GDB 或紙筆其中一方錯了。

## 這講之後應該帶走什麼

1. Mask 可套用於任何 integer width，但 literal suffix 必須和預期寬度一致。
2. `n & (n - 1)` 清掉最低 set bit，可用於 power-of-two test 與 popcount。
3. Left shift 右補零；unsigned right shift 高位補零，arithmetic right shift 複製 sign bit。
4. Shift count 不得達到或超過 operand width，signed shift 也不能任意當成 unsigned pattern 操作。
5. 投影片的 branchless absolute-value 公式能解釋 bit pattern，但 signed intermediate 對 `INT_MIN` 會 overflow；可用實作必須先把 arithmetic 移入 unsigned domain。
6. GDB 的核心循環是 breakpoint、run、next／step、inspect、backtrace；修改原始碼後要重新 build。

下一講會進入 `char` 與 C strings。此時 GDB 的 `x` 與 `/c` 顯示會開始特別有用：字串不再只是畫面上的文字，而是連續 bytes、terminating null 與 address 所組成的 representation。

## 更新紀錄

- 2026-08-22：更正 branchless absolute-value 範例的 `INT_MIN` 判定；原式有 signed overflow，不能稱為完整可用實作。

## 參考資料

- [Stanford CS107 Winter 2026 course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 5 slides: Bitwise Operators, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/05/Lecture05.pdf)
- [Stanford CS107 GDB and Debugging Guide](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/resources/gdb)
- [Stanford CS107 Lab 1: Bits, Bytes, and Integers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
- [SEI CERT C INT32-C: Ensure that operations on signed integers do not result in overflow](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)
