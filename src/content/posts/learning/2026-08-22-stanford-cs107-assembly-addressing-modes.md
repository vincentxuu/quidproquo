---
title: "Stanford CS107 Lecture 15：看懂 x86-64 addressing modes，分清位址和值"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, memory-addressing]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 16
tldr: "CS107 第 15 講把 x86-64 的 mov 拆成 immediate、register、absolute、indirect、displacement、indexed 與 scaled indexed operands，並以 D + R[b] + R[i]×s 統一解讀 pointer dereference 和 array access。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 15：mov 的來源與目的限制、AT&T operand forms、general address expression，以及由 assembly 還原 C pointer 與 array expressions。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-assembly-addressing-modes-en)

`mov $0x42,%rax` 與 `mov 0x42,%rax` 只差一個 `$`，效果卻完全不同：前者把數值 `0x42` 放進 register，後者到 memory address `0x42` 讀值。Stanford CS107 Lecture 15 就從這個容易看漏的符號開始，把 x86-64 addressing modes 整理成一套可計算的規則。

## 本講資料、範圍與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 15，2026-02-09
- 官方標題：Introduction to Assembly and `x86-64`, Take II
- 投影片標題：Introduction to Assembly, Take II
- 講者：課程資料列 Jerry Cain 授課；PDF 沒有另列 guest speaker
- 指定閱讀：Bryant 與 O'Hallaron，*Computer Systems: A Programmer's Perspective* 3.1–3.4
- 已讀材料：官方 calendar、完整 Lecture 15 投影片、GCC output-stage 文件、GNU `objdump` 文件、GNU assembler AT&T/Intel syntax 對照
- 材料缺口：Canvas 錄影、AFS lecture code 與 starter repositories 未公開；指定教科書不在公開材料內，本文不宣稱已讀

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)說本日會完成前一講尚未收完的 generics，再介紹 x86-64；[完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/15/Lecture15.pdf)則全部聚焦 assembly。agenda 依序是：`mov src,dst` 的限制；immediate、register、absolute address；indirect、base plus displacement、indexed、scaled indexed；general address expression；四組 operand tracing；重看 `sum_array`；由 assembly 回推 C；三個 etudes；最後以兩個 pointer 所指值互換預告後續。

## `mov src,dst`：複製 bytes，不是搬走物件

投影片把 `mov` 定義成由一個位置複製 bytes 到另一個位置，類似 C assignment，但 AT&T syntax 的 arguments 順序是 source、destination：

```asm
mov source,destination
```

[GNU assembler 的 AT&T/Intel syntax 文件](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)確認這個順序，並說明 AT&T register 前加 `%`、immediate 前加 `$`。若工具顯示 Intel syntax，常會改成 destination、source；閱讀前先確認 dialect。

source 可以是 immediate、register 或 memory。destination 可以是 register 或 memory，不能是 immediate。更重要的是，一條一般 `mov` 最多只有一個 memory operand；x86-64 不支援任意 memory-to-memory move。因此：

```asm
mov %rbx,%rcx       # register → register
mov (%rbx),%rcx     # memory → register
mov %rcx,(%rbx)     # register → memory
```

前兩條都寫 `%rcx`，但來源不同；第三條則把 `%rcx` 寫入 `%rbx` 所指 memory。`mov` 不會清空 source。

## 三種最基本 operand：immediate、register、absolute memory

### Immediate 是 instruction 裡的常數

```asm
mov $0x104,%rax
```

`$0x104` 表示數值本身。執行後 `%rax == 0x104`，不會讀取 address `0x104` 的內容。Immediate 可以當 source，不能當 destination，因為常數不是可寫入的 storage location。

### Register operand 讀寫 register file

```asm
mov %rbx,%rcx
```

它把 `%rbx` 的值複製到 `%rcx`。兩邊都沒有括號，所以不經由這兩個 operands 存取一般 memory。若 `%rbx` 剛好保存一個有效 pointer，本 instruction 仍只複製 pointer value，不會自動 dereference。

### 沒有 `$` 的裸數字可表示 absolute memory address

```asm
mov 0x104,%rax
```

這裡 `0x104` 是 memory location。instruction 到 address `0x104` 讀取內容，放進 `%rax`。反向的 `mov %rax,0x104` 則寫入該位置。這正是開頭兩條指令的差異：`$0x42` 是 66 這個 value，`0x42` 是 address 66。

投影片第一題給定 address `0x42` 存放 5、`%rbx` 存放 8：

```asm
mov $0x42,%rax   # %rax = 0x42
mov 0x42,%rax    # %rax = 5
mov %rbx,0x55    # memory[0x55] = 8
```

先在 operand 旁標 I（immediate）、R（register）、M（memory），再執行 copy，能減少被十六進位數字外觀誤導。

## 括號表示 indirect：使用 register 裡的地址

```asm
mov (%rbx),%rax
mov %rax,(%rbx)
```

`%rbx` 表示 register 裡的 value；`(%rbx)` 表示把該 value 當 address，再讀寫它指向的 memory。用 C 表示，若 `%rbx` 對應 `ptr`，第一條近似 `x = *ptr`，第二條近似 `*ptr = x`。

括號不是「取地址」運算。C 的 `&x` 取得地址，assembly operand 的括號是在 effective address 算完後存取 memory，更像 dereference。讀 `(%rbx)` 時可在紙上寫：

```text
address = R[%rbx]
operand = memory[address]
```

這個兩步法是後續所有 addressing modes 的基礎。括號內的成分只是在算 address；整個括號 operand 才代表該 address 的內容。

## Base + displacement：struct field 與固定 offset 的雛形

```asm
mov 0x10(%rax),%rcx
```

effective address 是 `R[%rax] + 0x10`，再從該位置 load。反向 store `mov %rcx,0x10(%rax)` 會把 `%rcx` 寫到相同位置。displacement 可以是正數或負數；省略時視為零。

固定 displacement 可對應 field offset、固定 index 或 stack frame 位置；單看它只能確定「base 加 16 bytes 後存取」，高階名稱仍需其他證據。

## Indexed：兩個 registers 共同形成地址

```asm
mov (%rax,%rdx),%rcx
mov 0x10(%rbx,%rdx),%rcx
```

第一條的 address 是 `R[%rax] + R[%rdx]`；第二條再加 displacement `0x10`。投影片用記號 `Imm(rb,ri)` 統一表示：

```text
address = Imm + R[rb] + R[ri]
```

base 與 index 名稱描述它們在 address expression 中的位置，不保證 source C 也有叫 `base` 或 `index` 的 variables。兩者對加法而言都貢獻一個 register value；命名主要是為了對應 encoding 與更一般的 scaled form。

投影片給定 `%rax = 0x100`、`%rdx = 0x3`、memory address `0x104` 存 `0xAB`、address `0x10C` 存 `0x11`：

```asm
mov $0x42,(%rax)          # memory[0x100] = 0x42
mov 4(%rax),%rcx          # %rcx = memory[0x104] = 0xAB
mov 9(%rax,%rdx),%rcx     # address = 9 + 0x100 + 3 = 0x10C; %rcx = 0x11
```

第三題最能檢查是否真的理解：`9` 是 displacement，不是 memory value；兩個 register values 也先相加，最後才 dereference。

## Scaled indexed：array access 的典型形狀

```asm
mov (%rcx,%rax,8),%rdx
mov %rdx,(%rdi,%rsi,4)
```

第一條從 `R[%rcx] + R[%rax] * 8` load；第二條把 `%rdx` store 到 `R[%rdi] + R[%rsi] * 4`。scale 只能是 1、2、4 或 8，省略時為 1。它很適合對應常見 element widths：`char` 是 1 byte，四-byte `int` 用 4，八-byte `long` 或 pointer 用 8。

scale 不是型別標籤；8 只表示 index 乘以 8。型別仍需由 instruction width 與周邊運算佐證，compiler 也可能借 addressing hardware 做一般算術。

投影片將所有形式收斂成：

```text
D(rb,ri,s)
effective address = D + R[rb] + R[ri] * s
```

`D`、base、index 都可省略；缺少的 displacement 或 register contribution 視為 0，scale 缺少時為 1。套到練習：

```asm
mov $0x42,0xfc(,%rcx,4)
```

若 `%rcx = 1`，address 是 `0xfc + 1 * 4 = 0x100`，所以將 immediate `0x42` 寫到 memory `0x100`。空著的 base slot 不代表語法壞掉，而是 base contribution 為零。

```asm
mov (%rax,%rdx,4),%rbx
```

若 `%rax = 0x100`、`%rdx = 3`，address 是 `0x10C`；已知該位置存 `0x11`，所以 `%rbx` 最後得到 `0x11`。務必分開寫 effective address 與 loaded value，否則很容易誤答 `%rbx = 0x10C`。

## 回到 `sum_array`：scale 4 把 pointer arithmetic 接回 C

本講重看稍微不同版本的 `sum_array`：

```asm
mov    $0x0,%edx
mov    $0x0,%eax
jmp    4005cb
movslq %edx,%rcx
add    (%rdi,%rcx,4),%eax
add    $0x1,%edx
cmp    %esi,%edx
jl     4005c2
repz retq
```

此版本讓 `%edx` 扮演 index、`%eax` 扮演 sum，和 Lecture 14 的 register allocation 不同。這再次證明 register name 不是 source variable identity。真正穩定的是 `%edx` 每輪加一並與 `%esi` 比較，`%eax` 則接收 memory element 的累加。

`(%rdi,%rcx,4)` 可展開成 `R[%rdi] + R[%rcx] * 4`。若 `%rdi` 是 `arr` base、`%rcx` 是 sign-extended index，一個 `int` 佔四 bytes，就正是 `&arr[i]` 的位址；因為它作為 `add` 的 memory source，實際讀入的是 `arr[i]`。位址計算本身與 dereference 必須一起看。

## 從 assembly 回推 C：同一行可以有多個等價答案

投影片列出四個基本對照：

```asm
mov $0x0,%rdx             # long y = 0;
mov %rdx,%rcx             # long offset = y;
mov $0x42,(%rdi)          # arr[0] = 66;
mov (%rdi,%rcx,8),%rax    # long w = arr[offset];
```

這些是合理 C，不是唯一 source。最後一條也可寫成 `long w = *(arr + offset)`；編譯後 array indexing 本來就以 pointer arithmetic 加 dereference 實現。反向閱讀能恢復效果，通常無法判定 programmer 使用了 `[]` 或 `*()`。

Extra Practice 1 給 `%ecx` 保存 `x`、`%rax` 保存 `ptr`：

```asm
mov %ecx,(%rax)
```

因此可還原為 `*ptr = x`。若漏看括號，會誤以為把 pointer variable 本身改成 x。

Extra Practice 2 給 `%rdi` 是 `long *arr`、`%rcx = 3`：

```asm
mov (%rdi,%rcx,8),%rax
```

合理答案包括 `long num = arr[3]`、`long num = *(arr + 3)`，若先前有 `long y = 3`，也可寫 `arr[y]`。assembly 保留當下數值與計算，不保留 source variable name。

Extra Practice 3 使用 `movb`：

```asm
movb $0x63,(%rcx,%rdx,1)
```

若 `%rcx` 是 `char *str`、`%rdx` 是 `i`，scale 1 與 byte-width store 支持 `str[i] = 'c'`。`0x63` 是 ASCII `c` 的 encoding；這項解讀同時依靠 immediate、effective address、instruction width 和 source context，不是只看其中一個符號。

## Swap preview：四條 `mov` 展示 load 與 store 的方向

最後的 `foo` 接收兩個 `long *`，其地址位於 `%rdi`、`%rsi`：

```asm
mov (%rdi),%rax
mov (%rsi),%rdx
mov %rdx,(%rdi)
mov %rax,(%rsi)
```

前兩條 load 原值到 temporary registers，後兩條交叉 store。等價 C 可以寫成：

```c
void foo(long *xp, long *yp) {
    long a = *xp;
    long b = *yp;
    *xp = b;
    *yp = a;
}
```

順序不可隨意刪減：任何 overwrite 前都要先保存兩個舊值，否則無法完成 swap。

## 一套不容易混淆的解題順序

面對任意 operand，依序做四步：

1. 確認 AT&T 或 Intel syntax，標出 source 與 destination。
2. 用 `$`、`%`、括號把 operands 分成 immediate、register、memory。
3. 對 memory operand 先計算 `D + base + index × scale`，寫下 effective address。
4. 最後依 instruction 方向做 load 或 store，並依 mnemonic/register 判斷 byte width。

例如不要直接心算 `mov 9(%rax,%rdx),%rcx`。先寫 `EA = 9 + R[%rax] + R[%rdx]`，再寫 `%rcx = memory[EA]`。兩行雖慢一點，卻把 address 與 value 分開，也能在結果不對時知道錯在算址還是 dereference。

[GNU `objdump` 文件](https://sourceware.org/binutils/docs/binutils/objdump.html)指出 `-d` 顯示 machine instructions 的 assembler mnemonics，並可用 `-M intel` 或 `-M att` 選擇 x86 顯示方式。[GCC output options](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)則讓你用 `-S` 保留 compiler 產生的 assembly。把同一個短 C expression 分別用兩種 syntax 顯示，是練習「語意不變、記法改變」最直接的方法。

一句話收尾：括號內算位址，括號整體存取 memory。再配上 `$`、`%` 與 AT&T 的 source-first 順序，密集標點就成了可驗算的 pointer arithmetic。

## 參考資料

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 15 slides: Introduction to Assembly, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/15/Lecture15.pdf)
- [GCC: Options Controlling the Kind of Output](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)
- [GNU Binutils: objdump](https://sourceware.org/binutils/docs/binutils/objdump.html)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
